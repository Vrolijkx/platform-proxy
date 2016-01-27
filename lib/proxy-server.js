'use strict';

var express = require('express');
var httpProxy = require('http-proxy');


function Server(config, assertManager) {
	var app = express();
	var proxy = httpProxy.createProxyServer({});

	this.start = start;

	function initServer() {
		app.get('*', smartProxyFunction);
	}

	function smartProxyFunction(req, res) {
		var staticAsset = assertManager.findMatchingAssetForUrl(req.url);
		if (staticAsset) {
			console.info("Asset found: " + staticAsset);
			assertManager.serverAssetFile(staticAsset, res);
		} else {
			proxy.web(req, res, {target: config.targetAddress});
		}

		if (req.url === '/v1/services/i18n/translations') {
			console.warn('Todo live reload translations: ' + req.url);
		} else if (req.url === '/v1/services/uimanager/ui/modules') {
			console.warn('Todo live reload ui modules: ' + req.url);
		} else if (req.url === '/v1/services/uimanager/ui/jsfiles') {
			console.warn('Todo live reload js files: ' + req.url);
		}
	}

	function start() {
		initServer();
		app.listen(config.poxyPort);
	}
}


module.exports = Server;
