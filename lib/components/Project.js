'use strict';

var path = require('path');
var _ = require('lodash');
var PropertiesReader = require('properties-reader');

var fs = require('fs');
var os = require("os");

var Project = require('../../api/project');
var FileManager = require('../../api/file-manager');

var EXTENSION_LENGTH = ".properties".length;
var LANGUAGE_CODE_LENGTH = 4;

function getLanguageCodeFromFilePath(filePath) {
	return filePath.slice(-(EXTENSION_LENGTH + LANGUAGE_CODE_LENGTH + 1), -EXTENSION_LENGTH);
}

function DefaultProject() {

	var projectDir;

	var fileCategories = {
		translations: {
			name: 'translations',
			patterns: ['*/src/main/resources/translations/*.properties']
		},
		uifiles: {
			name: 'uifiles',
			patterns: ['*/src/main/resources/*.@(jsfiles|modules)']
		},
		assets: {
			name: 'assets',
			patterns: ['*/src/main/@(resources|webapp)/**/*.@(js|html|css|jpg|png|jpeg)']
		}
	};

	var fileManager;

	return {
		configure: function (hub, configuration) {
			projectDir = configuration.projectDir;
			fileCategories.assets.patterns = configuration.assetsPatterns || fileCategories.assets.patterns;
			fileCategories.translations.patterns = configuration.translationFilesPatterns || fileCategories.translations.patterns;
			fileCategories.uifiles.patterns = configuration.uiFilesPatterns || fileCategories.uifiles.patterns;

			hub.requireService({
				contract: FileManager,
				component: this,
				bind: this.bindFileManager,
				unbind: this.unbindFileManager
			});

			hub.provideService({
				contract: Project,
				component: this
			});


		},

		bindFileManager: function (service) {
			fileManager = service;
		},

		unbindFileManager: function () {
			fileManager = null;
		},

		start: function () {
			hub.subscribe(this, '/framework/started', function() {
				fileManager.scanAndWatchFiles(this.getProjectDir(), fileCategories.translations);
				fileManager.scanAndWatchFiles(this.getProjectDir(), fileCategories.uifiles);
				fileManager.scanAndWatchFiles(this.getProjectDir(), fileCategories.assets);
			});
			console.log('Serving from ' + this.getComponentName());
		},

		stop: function () {},

		getComponentName: function () {
			return 'Project (' + projectDir + ')';
		},

		getAsset: function (uri) {
			var assetFiles = fileManager.getFilePaths(fileCategories.assets.name);
			var match = _.find(assetFiles, function (file) {
				return _.endsWith(file, uri);
			});
			if (match) {
				return match;
			}
		},

		updateTranslations: function (translations) {
			var translationFiles = fileManager.getFilePaths(fileCategories.translations.name);
			_.forEach(translationFiles, function (translationFile) {
				var code = getLanguageCodeFromFilePath(translationFile);
				var properties = PropertiesReader(translationFile);
				properties.each(function (key, value) {
					translations[code][key] = value;
				});
			});
			console.log('Updating translations for ' + projectDir);
		},

		updateUiFiles: function(category, uiFiles, extension) {
			var files = _.flatMap(uiFiles, 'value');
			var uiFilesPaths = fileManager.getFilePaths(fileCategories.uifiles.name);
			_.forEach(uiFilesPaths, function(uiFilePath) {
				var cat = path.basename(uiFilePath, extension);
				if(cat === category) {
					var lines = fs.readFileSync(uiFilePath, 'utf8').split(os.EOL);
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
		},

		hasChangedFileForCategory: function(categoryName) {
			return fileManager.hasChangedFileForCategory(categoryName);
		}

	};
}

module.exports = DefaultProject;
