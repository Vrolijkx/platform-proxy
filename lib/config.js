var DEFAULT_ASSETS_PATTERNS = ['*/src/main/resources/**/*.*'];
var DEFAULT_TARGET_ADDRES = 'http://localhost:8080';
var DEFAULT_PROXY_PORT =  5050;


function Config(projectDir, targetAddress, assetsPatterns, proxyPort) {
	this.platformProjectDir = projectDir;
	this.poxyPort = proxyPort || DEFAULT_PROXY_PORT;
	this.assetsPatterns = assetsPatterns || DEFAULT_ASSETS_PATTERNS;
	this.targetAddress = targetAddress || DEFAULT_TARGET_ADDRES
}


module.exports = Config;