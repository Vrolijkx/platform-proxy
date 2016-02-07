'use strict';

var _ = require('lodash');

var url = require('url');
var request = require('request');

var contracts = require('../../api/contracts');

var projects = [];
var targetAddress;

//TODO: this should not be a request handler, but a response post processor
var component = {

	configure: function (hub, configuration) {
		hub.provideService({
			contract: contracts.requestHandler,
			component: this
		});

		hub.provideService({
			contract: contracts.configurable,
			component: this
		});

		hub.requireService({
			contract: contracts.project,
			component: this,
			optional: false,
			aggregate: true,
			bind: this.addProject,
			unbind: this.removeProject
		});
	},
	addProject: function (project) {
		projects.push(project);
	},
	removeProject: function (project) {
		_.remove(projects, function (p) {
			return p.getProjectDir() === project.getProjectDir();
		});
	},
	start: function () {
	},
	stop: function () {
	},
	getComponentName: function () {
		return 'translations-request-handler';
	},
	//duplication/hack, should be removed after response-post-processor refactoring
	getConfigurationOptions: function () {
		return {
			targetAddress: ['t', 'target address for proxy server', 'string']
		};
	},
	updateConfiguration: function (configuration) {
		targetAddress = configuration.targetAddress;
	},
	getPriority: function () {
		return 0;
	},
	canHandle: function (req) {
		if (req.method === 'GET') {
			var urlObject = url.parse(req.url);
			return _.endsWith(urlObject.pathname, '/services/i18n/translations');
		}
		return false;
	},
	handle: function (req, res) {
		var options = {
			url: targetAddress + req.url.substring(1),
			headers: req.headers
		};
		//no dependency on request needed, post process the response from the proxy-request-handler
		request(options, function (error, response, originalTranslations) {
			if (!error && response.statusCode === 200) {
				var updatedTranslations = JSON.parse(originalTranslations);
				_.forEach(projects, function (project) {
					project.updateTranslations(updatedTranslations);
				});
				res.headers = response.headers;
				res.end(JSON.stringify(updatedTranslations));
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