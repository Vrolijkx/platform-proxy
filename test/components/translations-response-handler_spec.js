'use strict';

require('../../external/hubu');
var _ = require('lodash');
var httpMocks = require('node-mocks-http');

describe('TranslationsResponseHandler', function () {
	var ResponseHandlerContract = require('../../api/response-handler');
	var ConfigurableContract = require('../../api/configurable');
	var ProjectContract = require('../../api/project');
	var translationsResponseHandler = require('../../lib/components/translations-response-handler').component;

	var testUtils = require('../lib/utils');

	describe('contract conformity', function () {
		it('should conform to ResponseHandlerContract', function () {
			expect(HUBU.UTILS.isObjectConformToContract(translationsResponseHandler, ResponseHandlerContract)).toBe(true);
		});

		it('should conform to ConfigurableContract', function () {
			expect(HUBU.UTILS.isObjectConformToContract(translationsResponseHandler, ConfigurableContract)).toBe(true);
		});
	});

	describe('running hub', function () {
		var hubInstance, service;

		beforeEach(function () {
			hubInstance = new HUBU.Hub();
			hubInstance.registerComponent(translationsResponseHandler);
			hubInstance.start();
		});

		afterEach(function () {
			hubInstance && hubInstance.stop();
		});

		describe('provided services', function () {

			it('component should provide Configurable service', function () {
				expect(hubInstance.getServiceReference(ConfigurableContract)).not.toBeNull();
			});

			it('component should provide ResponseHandler service', function () {
				expect(hubInstance.getServiceReference(ResponseHandlerContract)).not.toBeNull();
			});

		});

		describe('required services', function () {

			var project1, project2;

			beforeEach(function () {
				project1 = testUtils.createStub(ProjectContract, {getProjectDir: _.constant('project1')});
				project2 = testUtils.createStub(ProjectContract, {getProjectDir: _.constant('project2')});
				hubInstance.registerComponent(project1);
				hubInstance.registerComponent(project2);
			});

			afterEach(function () {
				hubInstance.unregisterComponent(project1);
				hubInstance.unregisterComponent(project2);
			});

			it('component should require all registered projects', function () {
				expect(translationsResponseHandler.getProjects().length).toBe(2);
			});

			it('component should remove all unregistered projects', function () {
				hubInstance.unregisterComponent(project1);

				expect(translationsResponseHandler.getProjects().length).toBe(1);
				expect(translationsResponseHandler.getProjects()[0].getProjectDir()).toEqual(project2.getProjectDir());
			});

		});

	});

	describe('configurable', function () {

		it('should return the correct ConfigurationOptions', function () {
			var configurationOptions = translationsResponseHandler.getConfigurationOptions();

			expect(configurationOptions).toEqual({
				translations: [false, 'enable/disable translation support', 'string', 'auto']
			})
		});

	});

	describe('component', function () {

		it('should have the correct componentName', function () {
			expect(translationsResponseHandler.getComponentName()).toEqual('translations-response-handler');
		});

	});

	describe('response-handler', function () {

		describe('getName', function () {
			it('should have the correct name', function () {
				expect(translationsResponseHandler.getName()).toEqual('translations-response-handler');
			});
		});

		describe('getPriority', function () {
			it('should have priority 0', function () {
				expect(translationsResponseHandler.getPriority()).toEqual(0);
			});
		});

		describe('canProcess', function () {

			var req, project;

			beforeEach(function () {
				req = {method: 'GET', url: 'http://localhost/services/i18n/translations'};
				project = testUtils.createStub(ProjectContract, {getProjectDir: _.constant('project')});
				translationsResponseHandler.addProject(project);
			});

			describe('Mode.on', function () {

				beforeEach(function() {
					translationsResponseHandler.updateConfiguration({translations: 'on'});
				});

				it('should return false when method not GET', function () {
					req.method = 'POST';
					expect(translationsResponseHandler.canProcess(req)).toBe(false);
				});

				it('should return false when no projects registered', function () {
					translationsResponseHandler.removeProject(project);
					expect(translationsResponseHandler.canProcess(req)).toBe(false);
				});

				it('should return false when url not correct', function () {
					req.url = 'http://localhost/ui/file.html';
					expect(translationsResponseHandler.canProcess(req)).toBe(false);
				});

				it('should return true otherwise', function () {
					expect(translationsResponseHandler.canProcess(req)).toBe(true);
				});

			});

			describe('Mode.off', function () {

				beforeEach(function() {
					translationsResponseHandler.updateConfiguration({translations: 'off'});
				});

				it('should return false', function () {
					expect(translationsResponseHandler.canProcess(req)).toBe(false);
				});

			});
			
			describe('Mode.auto', function () {

				beforeEach(function() {
					translationsResponseHandler.updateConfiguration({translations: 'auto'});
				});

				it('should ask the project for changed translations', function() {
					spyOn(project, 'hasChangedFileForCategory');

					translationsResponseHandler.canProcess(req);

					expect(project.hasChangedFileForCategory).toHaveBeenCalledWith('translations');
				});

				it('should return false when no changed translations', function() {
					spyOn(project, 'hasChangedFileForCategory').and.returnValue(false);

					expect(translationsResponseHandler.canProcess(req)).toBe(false);
				});

				it('should return true when changed translations', function() {
					spyOn(project, 'hasChangedFileForCategory').and.returnValue(true);

					expect(translationsResponseHandler.canProcess(req)).toBe(true);
				});

			});

		});

		describe('preProcess', function () {
			
			var project, res;
			
			beforeEach(function() {
				project = testUtils.createStub(ProjectContract, {getProjectDir: _.constant('project')});
				translationsResponseHandler.addProject(project);
				res = httpMocks.createResponse();
			});

			it('should ask project to update translations', function() {
				spyOn(project, 'updateTranslations');
				var translationsFile = {a: 'b'};

				translationsResponseHandler.preProcess(res);
				res.write(new Buffer(JSON.stringify(translationsFile)));
				res.end();

				expect(project.updateTranslations).toHaveBeenCalledWith(translationsFile);
			});

			it('should send updated translations to response', function() {
				spyOn(project, 'updateTranslations').and.callFake(function(translations) {
					delete translations.a;
					translations.b = 'c';
				});
				translationsResponseHandler.preProcess(res);
				res.write(new Buffer(JSON.stringify({a: 'b'})));
				res.end();

				expect(JSON.parse(res._getData())).toEqual({b: 'c'});
			});

		});

	});

});
