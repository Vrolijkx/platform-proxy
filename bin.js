#!/usr/bin/env node

var path = require('path');
var program = require('commander');
var runner = require('./lib/run');
var Config = require('./lib/config');


program
	.version('0.0.1')
	.usage('[file...]')
	.parse(process.argv);

var config;
if(program.arg.length) {
	config = new Config(program.arg[0]);
} else {
	config = new Config(path.resolve("./"));
}

console.log("start serving assets under: " + config.platformProjectDir);
runner.start(config);


