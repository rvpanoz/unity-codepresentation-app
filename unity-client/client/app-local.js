define([
  'lib',
  'app',
  'unity/app-rpc',
  'unity/app-ws',
  'unity/app-listhandler',
  'unity/app-formhandler',
  'unity/app-behaviors'], function() {

  'use strict';

  app.initPromise = $.Deferred();

  function createSocket() {

    //socket setup
    var socketUrl = '127.0.0.1:32200';
		var dispatcher = 'app-device.dispatcher@yows.bus.singularlogic.eu';

    //instatiate socket
    var socket = new app.classes.rpcSocket({
      id: 'unity.yochat.{0}'.format(lib.now()),
      timeout: 5000,
      url: socketUrl,
      dispatcher: dispatcher,
      appEvents: true,
      reconnect: true,
      bus: true
    });

    return socket;
  }

  function doConnection() {
    try {
      app.socket.connect();
    } catch (e) {
      throw new Error(e);
    }
  }

  function goHome() {
    app.loadContent({
      cls: 'home'
    });
    return false;
  }

  function getRoomInstructors(roomName) {
    return app.socket.callServer({
      action: 'get_roomInstructor',
      params: {
        roomName: roomName
      },
      success: _.bind(function(resp) {
        app.trigger('get:instructor', resp);
      }, app),
      failure: function(err) {
        throw new Error(err.message)
      }
    });
  }

  function registerSocketEvents() {

			app.socket.on('open', function(u, socket) {
				console.info('a socket connection is established with id:' + socket.id);
			});

			app.socket.on('close', function(o) {
				console.log('socket closed');
			});

      app.socket.on('send', _.bind(function(o) {

      }, this));

			app.socket.on('message', _.bind(function (o) {

        if(o.id) {
          switch(o.id) {
            case 'user:action:disconnected':
            this.trigger('update:messages', o.data.msg + ' disconnected');
            break;
            case 'user:action:connected':
            this.trigger('update:messages', o.data.msg + ' connected');
            break;
            case 'codemirror:update:text':
            this.trigger('update:codemirror', o.data.msg);
            break;
            case 'message:added':
            this.trigger('update:messages', {
              from: o.from,
              msg: o.data.msg
            });
            break;
          }
        }
			}, this));
  }

  _.extend(app, {
    socket: createSocket(),
    getRoomInstructors: getRoomInstructors,
    registerSocketEvents: registerSocketEvents
  });

  app.socket.on('open', _.bind(function() {

    //register socket events
    app.registerSocketEvents();

    //start the app
    app.initPromise.resolve();
  }, app));

  //make a socket connection
  doConnection();
});
