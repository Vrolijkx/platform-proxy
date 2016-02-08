#!/usr/bin/env node
'use strict';

require('./external/hubu');

var _ = require('lodash');
var path = require('path');

var configurable = require('./api/configurable');

//TODO dynamicly load and register components
var httpServer = require('./lib/components/http-server');
var router = require('./lib/components/router');
var proxyRequestHandler = require('./lib/components/proxy-request-handler');
var assetRequestHandler = require('./lib/components/asset-request-handler');
var translationsResponseHandler = require('./lib/components/translations-response-handler');
var uiFilesResponseHandler = require('./lib/components/uifiles-response-handler');
var Project = require('./lib/components/project');

var cli = require('cli');

var parseOptions = {};

var configurableServiceListener = {
	contract: configurable,
	listener: function (event) {
		if (event.getType() === SOC.ServiceEvent.REGISTERED) {
			getService(event.getReference(), addParseOptions);
		}
	}
};

function getService(serviceReference, fn) {
	var service = hub.getService(this, serviceReference);
	fn.call(null, service);
	hub.ungetService(serviceReference);
}

function addParseOptions(configurable) {
	return _.assign(parseOptions, configurable.getConfigurationOptions());
}

hub.registerServiceListener(configurableServiceListener);

loadComponents();

cli.parse(parseOptions);
cli.main(exec);

function exec(args, options) {
	this.debug('args ' + JSON.stringify(args));
	this.debug('options ' + JSON.stringify(options));

	if (_.isEmpty(args)) {
		args.push('.');
	}

	_.forEach(args, registerProjectForDir);

	var serviceReferences = hub.getServiceReferences(configurable);
	_.forEach(serviceReferences, function (serviceReference) {
		getService(serviceReference, function (service) {
			service.updateConfiguration(_.pick(options, _.keys(service.getConfigurationOptions())));
		});
	});

	httpServer.component.listen();
}

function registerProjectForDir(projectDir) {
	hub.registerComponent(hub.createInstance(Project, {projectDir: path.resolve(projectDir)}));
}

function loadComponents() {
	hub
		.registerComponent(httpServer.component)
		.registerComponent(router.component)
		.registerComponent(proxyRequestHandler.component)
		.registerComponent(assetRequestHandler.component)
		.registerComponent(translationsResponseHandler.component)
		.registerComponent(uiFilesResponseHandler.component)
		.start();
}
