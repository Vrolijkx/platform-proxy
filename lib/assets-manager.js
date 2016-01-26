'use strict';

var _ = require('lodash');
var path = require('path');

function AssetsManager(config) {
	var assets = [];

	this.registerAssetFile = registerAssetFile;
	this.setAllAssets = setAllAssets;
	this.findMatchingAssetForUrl = findMatchingAssetForUrl;
	this.serverAssetFile = serverAssetFile;

	function registerAssetFile(file) {
		assets.push(file);
	}

	function setAllAssets(newAssets) {
		assets = newAssets;
	}

	function findMatchingAssetForUrl(uri) {
		var uriToMatch = uri.replace(/\/?ui\/?/, ''); //striping /ui/ from request

		//matching index file.
		uriToMatch = uriToMatch === '' ? 'index.html' : uriToMatch;

		var match = _.find(assets, function (file) {
			return _.endsWith(file, uriToMatch);
		});

		if (match) {
			return path.join(config.platformProjectDir, match);
		}
	}

	function serverAssetFile(asset, res) {
		//for now no asset objects
		res.sendfile(asset);
	}

}

module.exports = AssetsManager;