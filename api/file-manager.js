/**
 * Indicates that the component can be configured.
 */
var FileManager = {
	/**
	 * This options will be presented to the user
	 * in the help description
	 *
	 * @return    the possible configuration options
	 */
	getFilePaths: function () {},

	/**
	 * Called when configuration might have been changed
	 *
	 * @param    the configuration to use from now on
	 */
	hasChangedFileForCategory: function (configuration) {},

	scanAndWatchFiles: function(dir, category) {}
};

module.exports = FileManager;