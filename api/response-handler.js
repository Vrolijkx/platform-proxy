var ResponseHandler = {

	canProcess: function (req) {
	},
	preProcess: function (res, req) {
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

module.exports = ResponseHandler;
