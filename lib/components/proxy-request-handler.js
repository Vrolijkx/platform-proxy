'use strict';

var httpProxy = require('http-proxy');
var _ = require('lodash');
var contracts = require('../../api/contracts');

var targetAddress = 'http://localhost:8080/';
var proxy;

var responseHandlers = [];

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
		hub.requireService({
			contract: contracts.responseHandler,
			component: this,
			optional: true,
			aggregate: true,
			bind: this.addResponseHandler,
			unbind: this.removeResponseHandler
		});
	},
	addResponseHandler: function (responseHandler) {
		responseHandlers.push(responseHandler);
		responseHandlers = _.sortBy(responseHandlers, function (responseHandler) {
			return responseHandler.getPriority();
		});
	},
	removeResponseHandler: function (responseHandler) {
		_.remove(responseHandler, function (r) {
			return r.getName() === responseHandler.getName();
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
		_.forEach(responseHandlers, function(responseHandler) {
			if(responseHandler.canProcess(req)) {
				responseHandler.preProcess(res, req);
			}
		});
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