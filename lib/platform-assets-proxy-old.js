'use strict';

var _ = require('lodash');
var path = require('path');

var ASSETS_PATTERN = ['*/src/main/resources/**/*.*'];
var PLATFORM_PROJECT_DIR = '/Users/kristof/Projects/OEVEL/isabell-test/mandate';
var TARGET_ADDRESS = 'http://localhost:8080';
var PORT = 5050;

var files = [];

function loadFileLocations() {
  var glob = require('glob-all');
  files = glob.sync(ASSETS_PATTERN, {cwd: PLATFORM_PROJECT_DIR});
}

function findMatchingAssetForUrl(url) {
  var uriToMatch = url.replace(/\/?ui\/?/, ''); //striping /ui/ from request

  //matching index file.
  uriToMatch = uriToMatch === '' ? 'index.html' : uriToMatch;

  var match = _.find(files, function (file) {
    return _.endsWith(file, uriToMatch);
  });

  if (match) {
    return path.join(PLATFORM_PROJECT_DIR, match);
  }
}

function startServer() {
  var app = require('express')();
  var httpProxy = require('http-proxy');

  var proxy = httpProxy.createProxyServer({});

  app.get('*', function (req, res) {

    var staticAsset = findMatchingAssetForUrl(req.url);
    if (staticAsset) {
      console.info("Asset found: " + staticAsset);
      res.sendFile(staticAsset);
    } else {
      //console.info("proxying uri: " + req.url);
      proxy.web(req, res, {target: TARGET_ADDRESS});
    }

    if (req.url === '/v1/services/i18n/translations') {
      console.warn('Todo live reload translations: ' + req.url);
    } else if (req.url === '/v1/services/uimanager/ui/modules') {
      console.warn('Todo live reload ui modules: ' + req.url);
    } else if (req.url === '/v1/services/uimanager/ui/jsfiles') {
      console.warn('Todo live reload js files: ' + req.url);
    }
  });

  console.log('listening on port ' + PORT);
  app.listen(PORT);
}

loadFileLocations();
startServer();