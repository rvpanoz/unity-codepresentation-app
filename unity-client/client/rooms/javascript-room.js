define([
	'schema',
	'rooms/javascript-room-cfg',
	'codemirror',
	'unity/app-state'
], function (schema, fcfg, CodeMirror) {
	'use strict';

	var JavascriptRoomHandler = app.define(null, {
		extend: 'app.classes.ContentHandler',
		roomName: 'javascript',
		userInfo: null,
		codemirror: null,
		codemirror_value: "",
		instructors: [],
		events: {
			'click [itemId="btn-disconnect"]': '_onDisconnect',
			'click [itemId="btn-send-msg"]': '_onSendMessage'
		},
		initialize: function () {
			this.title = "Javascript room";
			this.instructors = new schema.Instructors();
			this.messages = new schema.Messages();
			this.root = fcfg.call(this);
			this.ready();
			this.listenTo(app, 'get:instructor', this.onGetInstructors, this);
			this.listenTo(app, 'update:codemirror', this.onUpdateCodemirror, this);
			this.listenTo(app, 'update:messages', this.onUpdateMessages, this);
			this.listenTo(this.messages, 'add', this.onMessageAdded, this);
		},
		onUpdateCodemirror(code_text) {
			this.codemirror.setValue(code_text);
			return false;
		},
		onUpdateMessages(message) {
			var message = new schema.Message({
				MESSAGE_TEXT: message.from + " says: " + message.msg,
				CREATED_AT: lib.now()
			});
			this.messages.add(message);
			this.clearMessage();
		},
		onGetInstructors: function (resp) {
			if (resp.success && resp.message) {
				var tofm = (resp.message instanceof Array);
				switch (tofm) {
				case false:
					var instructor = new schema.Instructor({
						USERNAME: resp.message.USERNAME,
						ISLOGGEDIN: resp.message.ISLOGGEDIN
					});
					this.instructors.add(instructor);
					break;
				case true:
					this.addInstructor();
					break;
				default:
					break;
				}
			}
			return false;
		},
		hosted: function () {
			this._instatiateCodemirror(); //instatiate codemirror plugin
			app.getRoomInstructors(this.roomName); //get room instructors
			this.uber('hosted', arguments);
			app.getComponent('main-leftPanel').close();
		},
		_onSendMessage: function(e) {
			e.preventDefault();
			var message;
			try {
				var message_component = this.root.find('message-area');
				var message_text = $.trim(message_component.$el.val());
				if(message_text.length) {
					app.socket.send({
						id: 'message:added',
						to: 'unity.yochat.*',
						data: {
							msg: message_text
						}
					});
				}
				this.clearMessage();
			} catch (e) {
				throw new Error(e);
			}

			return false;
		},
		onMessageAdded: function(message) {
			this.messages.sort();
		},
		clearMessage() {
			try {
				var message_component = this.root.find('message-area');
				message_component.$el.val('');
			} catch (e) {
				throw new Error(e);
			}
		},
		addInstructor() {
			return app.openPopup(this, {
				xtype: 'dialog',
				dismissible: false,
				title: 'Add instructor',
				items: [{
					xtype: 'textfield',
					itemId: 'username-instructor'
				}],
				buttons: [{
					itemId: 'btn-ok',
					label: 'Done'
				}],
				action: '_dialogActionInstructor'
			});
		},
		destructor: function () {
			this.uber('destructor', arguments);
		},
		_dialogActionInstructor(btn, dialog) {
			var now = lib.now();
			var _this = this;

			try {
				var username_component = dialog.find('username-instructor');
				var username_value = $.trim(username_component.$el.val());
				if (!username_value) {
					return false;
				} else {
					app.socket.callServer({
						action: 'add_roomInstructor',
						params: {
							username: username_value,
							roomName: this.roomName
						},
						success: function (resp) {
							var instructor = new schema.Instructor(resp.message);
							_this.instructors.add(instructor);
							dialog.close();
						}
					});
				}
			} catch (e) {
				throw new Error(e);
			}
		},
		_instatiateCodemirror: function () {
			var code_area = this.root.find('code-area').el;
			this.codemirror = CodeMirror.fromTextArea(code_area, {
				lineNumbers: true,
				mode: "javascript",
				theme: 'cobalt',
				autofocus: true,
				indentWithTabs: true
			});
			this._addCodemirrorEventListeners();
		},
		_addCodemirrorEventListeners() {
			this.codemirror.on("change", _.bind(function (inst, o) {
				var code_text = this.codemirror.getValue();

				//prevent trigger on change when value has changed programmatically
				if (o.origin === 'setValue') return;

				if (code_text.length) {
					app.socket.send({
						id: 'codemirror:update:text',
						to: 'unity.yochat.*',
						data: {
							msg: code_text,
							created_at: lib.now()
						}
					});
				}
				return false;
			}, this));
		}
	});

	return JavascriptRoomHandler;
});
