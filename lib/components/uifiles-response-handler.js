'use strict';

var _ = require('lodash');
var url = require('url');
var path = require('path');

var Project = require('../../api/project');
var ResponseHandler = require('../../api/response-handler');
var Configurable = require('../../api/configurable');
var Mode = require('../Mode');

var DEFAULT_MODE = Mode.auto;

var mode;
var projects = [];

function hasChangedUiFiles() {
	return _.some(projects, function(project) {
		return project.hasChangedFileForCategory('uifiles');
	});
}

var uiFilesResponseHandler = {

	configure: function (hub) {
		hub.provideService({
			contract: ResponseHandler,
			component: this
		});

		hub.provideService({
			contract: Configurable,
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

	start: function () {},

	stop: function () {},

	getComponentName: function () {
		return 'uifiles-response-handler';
	},

	getPriority: function () {
		return 0;
	},

	canProcess: function (req) {
		if (mode.isActive(hasChangedUiFiles) && projects.length && req.method === 'GET') {
			var urlObject = url.parse(req.url);
			return _.endsWith(urlObject.pathname, '/jsfiles') || _.endsWith(urlObject.pathname, '/modules');
		}
		return false;
	},

	preProcess: function(res, req) {
		var originalWrite = res.write;
		var originalEnd = res.end;
		var buffers = [];

		var urlObject = url.parse(req.url);
		var extension = '.' + path.basename(urlObject.pathname);
		var category = path.basename(path.dirname(urlObject.pathname));

		res.write = function(chunk) {
			buffers.push(chunk);
		};
		res.end = function(chunk, encoding, callback) {
			if(chunk) {
				buffers.push(chunk);
			}
			var updatedUifiles = JSON.parse(Buffer.concat(buffers).toString());
			_.forEach(projects, function (project) {
				project.updateUiFiles(category, updatedUifiles, extension);
			});
			res.write = originalWrite;
			originalEnd.call(res, new Buffer(JSON.stringify(updatedUifiles)), encoding, callback);
			res.end = originalEnd;
		};
	},

	getName: function () {
		return this.getComponentName();
	},

	getConfigurationOptions: function () {
		return {
			uifiles: [false, 'enable/disable uifiles support (' + _.keys(Mode), 'string', DEFAULT_MODE.getValue()]
		};
	},

	updateConfiguration: function (configuration) {
		mode = Mode[configuration.uifiles || DEFAULT_MODE.getValue()];
	}

};

module.exports = {
	component: uiFilesResponseHandler
};