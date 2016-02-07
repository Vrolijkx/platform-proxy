'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

function AssetsManager(config) {
	var assets = [];

	var mimeTypes = {
		".html": "text/html",
		".js": "text/javascript",
		".css": "text/css",
		".jpeg": "image/jpeg",
		".jpg": "image/jpeg",
		".png": "image/png"
	};

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
		var extension = path.extname(asset);
		if(mimeTypes[extension]) {
			res.writeHead(200, mimeTypes[extension]);
		}
		var fileStream = fs.createReadStream(asset);
		fileStream.pipe(res);
	}

}

module.exports = AssetsManager;
