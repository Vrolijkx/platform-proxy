/**
 * Indicates that the component can route requests
 */
var routable = {
	/**
	 * Called by the http-server when a request arrives
	 * @param request
	 * @param response
	 */
	onRequest: function (request, response) {
	}
};

/**
 * Indicates that the component can be configured.
 */
var configurable = {
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

/**
 * The router will use requestHandlers to serve requests.
 * The request handler with the lowest priority number
 * that canHandle the request will be asked to handle
 * the request first. If successful other following
 * requestHandlers are ignored
 */
var requestHandler = {
	/**
	 * Lower priority number gets precedence
	 */
	getPriority: function () {
	},
	/**
	 * Indicates whether this requestHandler
	 * can handle this request
	 *
	 * @param req    The request to handle
	 */
	canHandle: function (req) {
	},
	/**
	 * Try to serve the request
	 *
	 * @param req    The request to handle
	 * @param res    The response to send
	 *
	 * @return    true if request was served successfully,
	 *            false otherwise
	 */
	handle: function (req, res) {
	},
	/**
	 * Unique identifier for the requestHandler
	 */
	getName: function () {
	}
};

/**
 * Represents a directory from which assets, translations, ...
 * will be served
 */
var project = {
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

	/**
	 * @return the working directory of this project
	 */
	getProjectDir: function () {
	}
};

var responseHandler = {

	canProcess: function (req) {
	},
	preProcess: function(res, req) {
	},

	/**
	 * Lower priority number gets precedence
	 */
	getPriority: function () {
	},
	/**
	 * Unique identifier for the requestHandler
	 */
	getName: function () {
	}

};

module.exports = {
	routable: routable,
	configurable: configurable,
	requestHandler: requestHandler,
	project: project,
	responseHandler: responseHandler
};