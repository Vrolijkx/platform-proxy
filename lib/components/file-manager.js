'use strict';

var _ = require('lodash');
var FileManager = require('../../api/file-manager');
var gaze = require('gaze');
var path = require('path');
var minimatch = require("minimatch");

var cache = {};

var categories = [];

var watchers = {};

function getCategory(file) {
	return _.find(categories, function (category) {
		return _.find(category.patterns, function (pattern) {
			return minimatch(file.substring(category.dir.length + 1), pattern);
		});
	})
}

var fileManager = {

	configure: function (hub) {
		hub.provideService({
			contract: FileManager,
			component: this
		});
	},

	start: function () {},

	stop: function () {
		_.forOwn(watchers, function(watcher) {
			watcher.close();
		})
	},

	getComponentName: function () {
		return 'file-manager';
	},

	scanAndWatchFiles: function (dir, category) {
		categories.push({dir: dir, patterns: category.patterns, name: category.name});
		cache[category.name] = cache[category.name] || {changed: false, filePaths: []};

		if (watchers[dir]) {
			watchers[dir].add(category.patterns);
		} else {
			watchers[dir] = gaze(category.patterns, {cwd: dir}, function (err) {
				if (err) {
					return console.error(err);
				}

				var watched = this.watched();
				_.chain(watched).values()
					.flatten()
					.filter(function (file) {
						return path.extname(file);
					})
					.forEach(function(file) {
						var cat = getCategory(file);
						cache[cat.name].filePaths.push(file);
					}).commit();


				this.on('added', function (filepath) {
					var cat = getCategory(filepath);
					if (cat) {
						cache[cat.name].filePaths.push(filepath);
						cache[cat.name].changed = true;
					}
				});

				this.on('deleted', function (filepath) {
					var cat = getCategory(filepath);
					if (cat) {
						_.pull(cache[category.name].filePaths, filepath);
						cache[category.name].changed = true;
					}
				});

				this.on('changed', function(filepath) {
					var cat = getCategory(filepath);
					if (cat) {
						cache[cat.name].changed = true;
					}
				});

			});
		}

	},

	getFilePaths: function (categoryName) {
		return cache[categoryName].filePaths;
	},

	hasChangedFileForCategory: function (categoryName) {
		return cache[categoryName].changed;
	}
};

module.exports = {
	component: fileManager
};