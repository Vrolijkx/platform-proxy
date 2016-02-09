'use strict';

var _ = require('lodash');

function Mode(value, active) {
	this.isActive = function (fallback) {
		return _.isUndefined(active) ? fallback.call() : active;
	};

	this.getValue = function () {
		return value;
	}
}


module.exports = {
	on: new Mode('on', true),
	off: new Mode('off', false),
	auto: new Mode('auto')
};