/**
 * Represents a directory from which assets, translations, ...
 * will be served
 */
var Project = {
	/**
	 * @param uri
	 * @return    the full path matching the given uri
	 */
	getAsset: function (uri) {
	},

	/**
	 * Merges in the translations found in getProjectDir
	 *
	 * @param translations    the translations JSON object to be updated
	 */
	updateTranslations: function (translations) {
	},

	updateUiFiles: function (category, uifiles) {
	},

	/**
	 * @return the working directory of this project
	 */
	getProjectDir: function () {
	},
	hasChangedFileForCategory: function (categoryName) {
	}
};

module.exports = Project;
