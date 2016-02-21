'use strict';

var _ = require('lodash');

var i = 1;

var testUtils = {
	createStub: function (contract, overrides, properties, componentName) {
		return _.assign(_.create(contract, {
			getComponentName: function () {
				return componentName || 'DummyComponent' + i++;
			},
			start: function () {
			},
			stop: function () {
			},
			configure: function (hub) {
				hub.provideService({contract: contract, component: this, properties: properties});
			}
		}), overrides);
	}
};

module.exports = testUtils;