'use strict';

var http = require('http');

var Configurable = require('../../api/configurable');
var Routable = require('../../api/routable');

var port = 5050;
var router = null;

var httpServer = {

	configure: function (hub, configuration) {
		if (configuration) {
			this.updateConfiguration(configuration);
		}
		hub.provideService({
			contract: Configurable,
			component: this
		});

		hub.requireService({
			contract: Routable,
			component: this,
			bind: this.bindRouter,
			unbind: this.unbindRouter
		});

		hub.subscribe(this, '/framework/started', this.listen);
	},

	bindRouter: function (service) {
		router = service;
	},

	unbindRouter: function () {
		router = null;
	},

	start: function () {},

	stop: function () {},

	listen: function () {
		http.createServer(router.onRequest).listen(port);
		console.log('Server started on port ' + port);
	},

	getComponentName: function () {
		return 'http-server';
	},

	getConfigurationOptions: function () {
		return {
			port: ['p', 'port to start proxy on', 'number', port]
		};
	},

	updateConfiguration: function (configuration) {
		port = configuration.port || port;
	}
};

module.exports = {
	component: httpServer
};