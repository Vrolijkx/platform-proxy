'use strict';

var AssetsManager = require('./assets-manager');
var Server = require('./proxy-server');
var Config = require('./config');
var glob = require('glob-all');


function start(config) {
	var assetManager = new AssetsManager(config);
	var files = glob.sync(config.assetsPatterns, {cwd: config.platformProjectDir});
	assetManager.setAllAssets(files);

	var server = new Server(config, assetManager);
	server.start();
}

module.exports.start = start;
