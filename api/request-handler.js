/**
 * The router will use requestHandlers to serve requests.
 * The request handler with the lowest priority number
 * that canHandle the request will be asked to handle
 * the request first. If successful other following
 * requestHandlers are ignored
 */
var RequestHandler = {
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

module.exports = RequestHandler;
