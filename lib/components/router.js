'use strict';

var _ = require('lodash');

var RequestHandler = require('../../api/request-handler');
var Routable = require('../../api/routable');

var requestHandlers = [];

var router = {

	configure: function (hub) {
		hub.provideService({
			contract: Routable,
			component: this
		});
		hub.requireService({
			contract: RequestHandler,
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

	start: function () {},

	stop: function () {},

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