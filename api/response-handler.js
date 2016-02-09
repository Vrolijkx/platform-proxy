var responseHandler = {

	canProcess: function (req) {},

	preProcess: function(res, req) {},

	/**
	 * Lower priority number gets precedence
	 */
	getPriority: function () {},

	/**
	 * Unique identifier for the RequestHandler
	 */
	getName: function () {}
};

module.exports = responseHandler;
