'use strict';

var path = require('path');
var glob = require('glob-all');
var _ = require('lodash');
var PropertiesReader = require('properties-reader');

var fs = require('fs');
var os = require("os");
var gaze = require("gaze");

var Project = require('../../api/project');

var EXTENSION_LENGTH = ".properties".length;
var LANGUAGE_CODE_LENGTH = 4;

function getLanguageCodeFromFilePath(path) {
	return path.slice(-(EXTENSION_LENGTH + LANGUAGE_CODE_LENGTH + 1), -EXTENSION_LENGTH);
}

function DefaultProject() {

	var projectDir;
	var assetsPatterns = ['*/src/main/resources/**/*.@(js|html|css)'];
	var translationFilesPatterns = ['*/src/main/resources/translations/*.properties'];
	var uiFilesPatterns = ['*/src/main/resources/*.@(jsfiles|modules)'];

	var watcher;

	function getAssetsToServe() {
		var watchedDirs = watcher.watched();
		return _.flatMap(_.values(watchedDirs));
	}

	return {
		configure: function (hub, configuration) {
			projectDir = configuration.projectDir;
			assetsPatterns = configuration.assetsPatterns || assetsPatterns;
			translationFilesPatterns = configuration.translationFilesPatterns || translationFilesPatterns;

			hub.provideService({
				contract: Project,
				component: this
			});
		},

		start: function () {
			console.log('Serving from ' + this.getComponentName());

			gaze(assetsPatterns, {cwd: projectDir}, function(err, gazeWatcher) {
				if(!err) {
					watcher = gazeWatcher;
				}

				watcher.on('all', function() {
					console.log.apply(this, arguments);
				});
			});
		},

		stop: function () {
			if(watcher) {
				watcher.close();
			}
		},

		getComponentName: function () {
			return 'Project (' + projectDir + ')';
		},

		getAsset: function (uri) {
			var match = _.find(getAssetsToServe(), function (file) {
				return _.endsWith(file, uri);
			});
			if (match) {
				return path.join(projectDir, match);
			}
		},

		updateTranslations: function (translations) {
			var translationFiles = glob.sync(_.concat([], translationFilesPatterns), {cwd: projectDir});
			_.forEach(translationFiles, function (translationFile) {
				var code = getLanguageCodeFromFilePath(translationFile);
				var properties = PropertiesReader(path.join(projectDir, translationFile));
				properties.each(function (key, value) {
					translations[code][key] = value;
				});
			});
			console.log('Updating translations for ' + projectDir);
		},

		updateUiFiles: function(category, uiFiles, extension) {
			var files = _.flatMap(uiFiles, 'value');
			var uiFilesPaths = glob.sync(uiFilesPatterns, {cwd: projectDir});
			_.forEach(uiFilesPaths, function(uiFilePath) {
				var cat = path.basename(uiFilePath, extension);
				if(cat === category) {
					var lines = fs.readFileSync(path.join(projectDir, uiFilePath), 'utf8').split(os.EOL);
					_.forEach(lines, function(line) {
						if(_.trim(line) && !_.includes(files, line)) {
							uiFiles.push({value: line});
							console.log('Adding ' + line + ' to ' + uiFilePath);
						}
					});
				}
			});
		},

		getProjectDir: function () {
			return projectDir;
		}

	};
}

module.exports = DefaultProject;
