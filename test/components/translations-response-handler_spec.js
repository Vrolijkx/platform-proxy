'use strict';

describe('TranslationsResponseHandler', function () {
	require('../../external/hubu');
	var ResponseHandler = require('../../api/response-handler');
	var Configurable = require('../../api/configurable');
	var TranslationResponeHandler = require('../../lib/components/translations-response-handler');

	var hubInstance, component;

	beforeEach(function () {
		component = TranslationResponeHandler.component;
		hubInstance = new HUBU.Hub();
		hubInstance.registerComponent(component).start();
	});
	
	afterEach(function() {
		if(hubInstance) {
			hubInstance.stop();
		}
	});

	function getServiceForcontract(contract) {
		return hubInstance.getService({}, hubInstance.getServiceReference(contract));
	}

	it('should be registered as responsHandler correctly', function() {
		var responseHandler = getServiceForcontract(ResponseHandler);

		expect(responseHandler).toBeDefined();
		expect(responseHandler.__proxy__).toEqual(component);
	});

	it('should be registered as Configurable correctly', function() {
		var responseHandler = getServiceForcontract(Configurable);

		expect(responseHandler).toBeDefined();
		expect(responseHandler.__proxy__).toEqual(component);
	});

	it('should have the correct componentName', function() {
		expect(component.getComponentName()).toEqual('translations-response-handler');
	});

	it('should have the correct Name', function() {
		expect(component.getName()).toEqual('translations-response-handler');
	});

	it('should have 0 as priority', function() {
		expect(component.getPriority()).toEqual(0);
	});

	it('should return te correct ConfigurationOoptions', function() {
		var configurationOptions = component.getConfigurationOptions();

		expect(configurationOptions).toEqual({
			translations: [false, 'enable/disable translation support', 'string', 'auto']
		})
	});

	describe('canProcess', function() {
		var req;

		beforeEach(function () {
			component.updateConfiguration({ translations: 'on'});
			req = {
				method: 'GET',
				url: 'v1/services/i18n/translations'
			}
		});

		it('should return false when translations disabled', function () {
			component.updateConfiguration({ translations: 'off'});
			expect(component.canProcess({})).toBe(false);
		});
		
		
	});

});
