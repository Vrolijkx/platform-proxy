'use strict';

var http = require('http');
var httpProxy = require('http-proxy');

function Server(config, assertManager) {
	function handleRequest(req, res){
		if(req.method === 'GET') {
			smartProxyFunction(req, res)
		} else {
			proxyRequests(req, res);
		}
	}
	var httpServer = http.createServer(handleRequest);

	var proxy = httpProxy.createProxyServer({});

	this.start = start;

	function proxyRequests(req, res) {
		proxy.web(req, res, {target: config.targetAddress });
	}

	function smartProxyFunction(req, res) {
		var staticAsset = assertManager.findMatchingAssetForUrl(req.url);
		if (staticAsset) {
			console.info("Asset found: " + staticAsset);
			assertManager.serverAssetFile(staticAsset, res);
		} else {
			proxyRequests(req, res);
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
		httpServer.listen(config.poxyPort);
	}
}

module.exports = Server;
