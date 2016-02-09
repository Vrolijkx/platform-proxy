/**
 * Indicates that the component can be configured.
 */
var Configurable = {
	/**
	 * This options will be presented to the user
	 * in the help description
	 *
	 * @return    the possible configuration options
	 */
	getConfigurationOptions: function () {
	},

	/**
	 * Called when configuration might have been changed
	 *
	 * @param    the configuration to use from now on
	 */
	updateConfiguration: function (configuration) {
	}
};

module.exports = Configurable;