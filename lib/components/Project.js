'use strict';

var path = require('path');
var glob = require('glob-all');
var _ = require('lodash');
var PropertiesReader = require('properties-reader');
var fs = require('fs');

var contracts = require('../../api/contracts');

var EXTENSION_LENGTH = ".properties".length;
var LANGUAGE_CODE_LENGTH = 4;

function getLanguageCodeFromFilePath(path) {
	return path.slice(-(EXTENSION_LENGTH + LANGUAGE_CODE_LENGTH + 1), -EXTENSION_LENGTH);
}

var Project = function () {

	var projectDir;
	var assetsPatterns = ['*/src/main/resources/**/*.@(js|html|css)'];
	var translationFilesPatterns = ['*/src/main/resources/translations/*.properties'];
	var jsfilesPatterns = ['*/src/main/resources/*.jsfiles'];

	return {

		configure: function (hub, configuration) {
			projectDir = configuration.projectDir;
			assetsPatterns = configuration.assetsPatterns || assetsPatterns;
			translationFilesPatterns = configuration.translationFilesPatterns || translationFilesPatterns;

			hub.provideService({
				contract: contracts.project,
				component: this
			});
		},
		start: function () {
			console.log('Serving from ' + this.getComponentName());
		},
		stop: function () {
		},
		getComponentName: function () {
			return 'project (' + projectDir + ')';
		},
		getAsset: function (uri) {
			var assetFiles = glob.sync(_.concat([], assetsPatterns), {cwd: projectDir});
			var match = _.find(assetFiles, function (file) {
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
		updateJsfiles: function(category, jsfiles) {
			var files = _.flatMap(jsfiles, function(jsfile) {
				return jsfile.value;
			});
			var jsfilesPaths = glob.sync(_.concat([], jsfilesPatterns), {cwd: projectDir});
			_.forEach(jsfilesPaths, function(jsfilePath) {
				var cat = path.basename(jsfilePath, '.jsfiles');
				if(cat === category) {
					var lines = fs.readFileSync(path.join(projectDir, jsfilePath), 'utf8').split('\n');
					_.forEach(lines, function(line) {
						if(_.trim(line) && !_.includes(files, line)) {
							jsfiles.push({value: line});
							console.log('Adding ' + line + ' to ' + jsfilePath);
						}
					});
				}
			});
		},
		getProjectDir: function () {
			return projectDir;
		}

	};
};


module.exports = Project;
