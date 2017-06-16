var express = require('express');
var gw = require('gateway');
var _ = require('lodash');
var lib = require('lib');
var CONTEXT = require('context');
var fs = require('fs');

lib.flags = lib.DISABLE_CACHE;

var www = '';
var server_port = 32200;
var bus_domain = 'yows.bus.singularlogic.eu';
var master_bus = '';
var local_devices = ['app-device'];

var config = function () {
	for (var i = 0, max = local_devices.length; i < max; i++) {
		var cfg = require(local_devices[i] + '-config').config(),
			name = cfg.name;
		module.exports[name] = cfg;
	}
};

module.exports = {
	debug: true,
	server: {
		port: server_port
	},
	bus: {
		domain: bus_domain,
		localDevices: local_devices,
		masterBus: master_bus
	},
	routes: function (app) {
		var bodyParser = require('body-parser');

		// support json encoded bodies
		app.use(bodyParser.json());

		// support encoded bodies
		app.use(bodyParser.urlencoded({
			extended: true
		}));

		app.use('/dispatch', CONTEXT.handler(__dirname + '/dispatch'));

		// -- TODO:start custom routes
		//
		//
		//-- end custom routes
	}
};

config();
