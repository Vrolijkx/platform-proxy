/**
 * Indicates that the component can route requests
 */
var routable = {
	/**
	 * Called by the http-server when a request arrives
	 * @param request
	 * @param response
	 */
	onRequest: function (request, response) {}
};

module.exports = routable;