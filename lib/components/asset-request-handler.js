'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var url = require('url');

var RequestHandler = require('../../api/request-handler');
var Project = require('../../api/project');

var projects = [];

var mimeTypes = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".png": "image/png"
};

function stripeUiPathFromUrl(url) {
	return url.replace(/\/?ui\/?/, ''); //striping /ui/ from request
}

function serveAssetFile(asset, res) {
	var extension = path.extname(asset);
	var headers = { "Content-Type": mimeTypes[extension] || "text/plain" } ;
	res.writeHead(200, headers);
	var fileStream = fs.createReadStream(asset);
	fileStream.pipe(res);
	console.log('Serving ' + asset);
}

var AssetRequestHandler = {

	configure: function (hub) {
		hub.provideService({
			contract: RequestHandler,
			component: this
		});

		hub.requireService({
			contract: Project,
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
		return 'asset-request-handler';
	},
	getPriority: function () {
		return 1;
	},
	canHandle: function (req) {
		if (req.method === 'GET') {
			var urlObject = url.parse(req.url);
			var index = urlObject.pathname.lastIndexOf('.');
			if (index > -1) {
				var extension = urlObject.pathname.substring(index);
				return _.has(mimeTypes, extension);
			}
		}
		return false;
	},
	handle: function (req, res) {
		var uriToMatch = stripeUiPathFromUrl(req.url) || 'index.html';
		var asset;
		_.forEach(projects, function (project) {
			asset = project.getAsset(uriToMatch);
			if (asset) {
				return false;
			}
		});
		if (asset) {
			serveAssetFile(asset, res);
			return true;
		}
		return false;
	},
	getName: function () {
		return this.getComponentName();
	}
};

module.exports = {
	component: AssetRequestHandler
};