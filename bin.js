#!/usr/bin/env node
'use strict';

var path = require('path');
var cli = require('cli');
var runner = require('./lib/run');
var Config = require('./lib/config');


cli.parse({
	port:   ['p', 'port to start proxy on', 'number', 5050]
});


cli.main(exec);

function exec(args, options) {
	var servingDir;
	if(args.length) {
		servingDir = path.resolve(args[0]);
	} else {
		servingDir = path.resolve('./');
	}

	this.debug('Serving files under ' + servingDir);
	var config = new Config(servingDir, undefined, undefined, options.port);

	runner.start(config);
	this.ok("Listening on port: " + config.poxyPort);
}



