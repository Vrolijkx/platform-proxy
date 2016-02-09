'use strict';

var _ = require('lodash');
var url = require('url');

var Project = require('../../api/project');
var ResponseHandler = require('../../api/response-handler');
var Mode = require('../Mode');

var DEFAULT_MODE = Mode.auto;

var projects = [];
var mode;

function hasChangedTranslationFiles() {
	return _.some(projects, function(project) {
		return project.hasChangedFileForCategory('translations');
	});
}

var translationsResponseHandler = {

	configure: function (hub) {
		hub.provideService({
			contract: ResponseHandler,
			component: this
		});

		hub.provideService({
			contract: contracts.configurable,
			component: this
		});

		hub.requireService({
			contract: Project,
			component: this,
			optional: true,
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
		return 'translations-response-handler';
	},

	getPriority: function () {
		return 0;
	},

	canProcess: function (req) {
		if (mode.isActive(hasChangedTranslationFiles) && projects.length && req.method === 'GET') {
			var urlObject = url.parse(req.url);
			return _.endsWith(urlObject.pathname, '/services/i18n/translations');
		}
		return false;
	},

	preProcess: function(res) {
		var originalWrite = res.write;
		var originalEnd = res.end;
		var buffers = [];
		res.write = function(chunk) {
			buffers.push(chunk);
		};
		res.end = function(chunk, encoding, callback) {
			if(chunk) {
				buffers.push(chunk);
			}
			var updatedTranslations = JSON.parse(Buffer.concat(buffers).toString());
			_.forEach(projects, function (project) {
				project.updateTranslations(updatedTranslations);
			});
			res.write = originalWrite;
			originalEnd.call(res, new Buffer(JSON.stringify(updatedTranslations)), encoding, callback);
			res.end = originalEnd;
		};
	},

	getName: function () {
		return this.getComponentName();
	},
	getConfigurationOptions: function () {
		return {
			translations: [false, 'enable/disable translation support', 'string', DEFAULT_MODE.getValue()]
		};
	},
	updateConfiguration: function (configuration) {
		mode = Mode[configuration.translations || DEFAULT_MODE.getValue()];
	}
};

module.exports = {
	component: translationsResponseHandler
};