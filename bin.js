#!/usr/bin/env node
'use strict';

require('./external/hubu');

var _ = require('lodash');
var path = require('path');
var contracts = require('./api/contracts');
var httpServer = require('./lib/components/http-server');
var router = require('./lib/components/router');
var proxyRequestHandler = require('./lib/components/proxy-request-handler');
var assetRequestHandler = require('./lib/components/asset-request-handler');
var translationsResponseHandler = require('./lib/components/translations-response-handler');
var Project = require('./lib/components/Project');

var cli = require('cli');

var parseOptions = {};

var configurableServiceListener = {
	contract: contracts.configurable,
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

hub
	.registerComponent(httpServer.component)
	.registerComponent(router.component)
	.registerComponent(proxyRequestHandler.component)
	.registerComponent(assetRequestHandler.component)
	.registerComponent(translationsResponseHandler.component)
	.start();

cli.parse(parseOptions);

cli.main(exec);

function exec(args, options) {
	this.debug('args ' + JSON.stringify(args));
	this.debug('options ' + JSON.stringify(options));

	if (_.isEmpty(args)) {
		args.push('.');
	}

	_.forEach(args, function (projectDir) {
		hub.registerComponent(hub.createInstance(Project, {projectDir: path.resolve(projectDir)}));
	});

	var serviceReferences = hub.getServiceReferences(contracts.configurable);
	_.forEach(serviceReferences, function (serviceReference) {
		getService(serviceReference, function (service) {
			service.updateConfiguration(_.pick(options, _.keys(service.getConfigurationOptions())));
		});
	});

	httpServer.component.listen();
}
