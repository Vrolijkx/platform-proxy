'use strict';

var _ = require('lodash');
var url = require('url');
var contracts = require('../../api/contracts');

var requestHandlers = [];

var router = {

	configure: function (hub) {
		hub.provideService({
			contract: contracts.routable,
			component: this
		});
		hub.requireService({
			contract: contracts.requestHandler,
			component: this,
			optional: false,
			aggregate: true,
			bind: this.addRequestHandler,
			unbind: this.removeRequestHandler
		});
	},
	addRequestHandler: function (requestHandler) {
		requestHandlers.push(requestHandler);
		requestHandlers = _.sortBy(requestHandlers, function (requestHandler) {
			return requestHandler.getPriority();
		});
	},
	removeRequestHandler: function (requestHandler) {
		_.remove(requestHandlers, function (r) {
			return r.getName() === requestHandler.getName();
		});
	},
	start: function () {
	},
	stop: function () {
	},
	getComponentName: function () {
		return 'router';
	},
	onRequest: function (req, res) {
		_.forEach(requestHandlers, function (requestHandler) {
			if (requestHandler.canHandle(req)) {
				return !requestHandler.handle(req, res);
			}
		});
	}
};

module.exports = {
	component: router
};