'use strict';

const Bus = require('bus');
const _ = require('lodash');
const lib = require('lib');
var sqlite3 = require('sqlite3').verbose();
const mk = require('mk');

var AppDevice = Bus.InternalDevice.extend({
	id: 'app-device',
	constructor: function () {
		AppDevice.__super__.constructor.apply(this, arguments);
		this.db = new sqlite3.Database('unity_rtc.db');
		this.createDB();
	},
	handle: function (msg) {
		msg.data || (msg.data = {});
		try {
			switch (msg.id) {
			case 'uc:call':
				this.doCall(msg);
				break;
			}
		} catch (e) {
			this.doError(msg, e);
		}
	},
	doError: function (msg, error) {
		this.respond({
			data: {
				success: false,
				message: error.toString()
			}
		}, msg);
	},
	createDB: function() {
		var _this = this;

    // Each command inside the serialize() function is
    // guaranteed to finish executing before the next one starts.
    this.db.serialize(function() {

      //table instructor
      _this.db.run("CREATE TABLE IF NOT EXISTS instructor (\
        ID INTEGER AUTO_INCREMENT PRIMARY KEY,\
        USERNAME TEXT,\
        ROOMID INTEGER CREATED_AT DATETIME,\
				ISLOGGEDIN INTEGER CREATED_AT DATETIME,\
        FOREIGN KEY(ROOMID) REFERENCES ROOM(ID));");

        //table room
      _this.db.run("CREATE TABLE IF NOT EXISTS room\
      (ID INTEGER AUTO_INCREMENT PRIMARY KEY,\
        ROOMNAME TEXT, CREATED_AT DATETIME);");
    });
  },
	closeDb: function () {
		this.db.close();
	},
	addRoomInstructors: function (msg) {
		var data = msg.data;
		if (!data.roomName || !data.username) throw new Error('getRoomInstructors: missing parameters.');

		var sql = "SELECT rm.ID from room rm WHERE rm.ROOMNAME = '" + data.roomName + "'";

		this.db.serialize(_.bind(function () {
			var _this = this;
			this.db.all(sql, function (err, rows) {
				if (err) {
					this.doError(msg, err);
				}

				var roomId = _.get(_.first(rows), 'ID');
				var stmt = _this.db.prepare("INSERT INTO instructor(USERNAME, ROOMID, ISLOGGEDIN) VALUES (?,?,?)");

				stmt.run(data.username, roomId, 1); //ISLOGGEDIN = 1
				stmt.finalize(function () {
					_this.respond({
						data: {
							success: true,
							message: {
								USERNAME: data.username,
								ROOMID: roomId,
								ISLOGGEDIN: 1
							}
						}
					}, msg);
				});
			});
		}, this));
	},
	getRoomInstructors: function (msg) {
		var data = msg.data;
		if (!data.roomName) throw new Error('getRoomInstructors: Roomname parameter is not defined.');

		var sql = "SELECT inst.USERNAME, inst.ISLOGGEDIN, rm.ROOMNAME FROM instructor inst JOIN room rm ON rm.ID = inst.roomId\
							WHERE inst.ROOMID = rm.ID AND rm.ROOMNAME = '" + data.roomName + "'";

		this.db.all(sql, _.bind(function (err, rows) {
			if (err) {
				this.doError(msg, err);
			}
			this.respond({
				data: {
					success: true,
					message: (rows.length == 0) ? rows : _.first(rows)
				}
			}, msg);
		}, this));
	},
	getEndPoint: function (msg) {
		var a = AppDevice.parseAddress(msg.to);
		var epName = a.name.substr(this.id.length + 1);
		var ep = mk.config.app_device.endpoints[epName];
		if (!ep) throw 'Invalid/missing endpoint ' + epName;
		return ep;
	},
	doCall: function (msg) {
		var _this = this;
		var ep = this.getEndPoint(msg);
		_.extend(msg.data, ep.params);
		var msgData = msg.data;

		if (msgData && msgData._run) {
			switch (msgData._run) {
			case 'get_roomInstructor':
				var rslt = this.getRoomInstructors(msg);
				break;
			case 'add_roomInstructor':
				var rslt = this.addRoomInstructors(msg);
				break;
			default:
				break;
			}
		}
	}
});

module.exports = AppDevice;
