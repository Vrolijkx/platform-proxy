'use strict';

var _ = require('lodash');
var url = require('url');
var path = require('path');
var contracts = require('../../api/contracts');

var projects = [];

var uiFilesResponseHandler = {

	configure: function (hub) {
		hub.provideService({
			contract: contracts.responseHandler,
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
		return 'uifiles-response-handler';
	},
	getPriority: function () {
		return 0;
	},
	canProcess: function (req) {
		if (req.method === 'GET') {
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
	}
};

module.exports = {
	component: uiFilesResponseHandler
};