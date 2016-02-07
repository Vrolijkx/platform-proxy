'use strict';

var httpProxy = require('http-proxy');
var contracts = require('../../api/contracts');

var targetAddress = 'http://localhost:8080/';
var proxy;

var component = {

	configure: function (hub, configuration) {
		if (configuration) {
			this.updateConfiguration(configuration);
		}
		hub.provideService({
			contract: contracts.configurable,
			component: this
		});
		hub.provideService({
			contract: contracts.requestHandler,
			component: this
		});
	},
	start: function () {
		proxy = httpProxy.createProxyServer({});
	},
	stop: function () {
	},
	getComponentName: function () {
		return 'proxy-request-handler';
	},
	getConfigurationOptions: function () {
		return {
			targetAddress: ['t', 'target address for proxy server', 'string', targetAddress]
		};
	},
	updateConfiguration: function (configuration) {
		targetAddress = configuration.targetAddress || targetAddress;
	},
	getPriority: function () {
		return 1000;
	},
	canHandle: function (req) {
		return true;
	},
	handle: function (req, res) {
		proxy.web(req, res, {target: targetAddress}, function (e) {
			if (e.code === 'ECONNREFUSED') {
				res.writeHead(504);
				res.end();
			} else {
				console.log('problem with proxy');
				console.error(e);
			}
		});
		return true;
	},
	getName: function () {
		return this.getComponentName();
	}
};

module.exports = {
	component: component
};