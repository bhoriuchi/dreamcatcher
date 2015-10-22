var promise = require('bluebird');
var restify = require('restify');
promise.promisifyAll(restify.JsonClient.prototype);
var client = restify.createJsonClient({
	url: 'http://localhost:8080',
	version: '*'
});


client.getAsync('/api/survivors/1').spread(function(req, res, obj) {
	console.log('result 1', obj);
	
	return client.getAsync('/api/survivors/2').spread(function(req, res, obj) {
		console.log('result 2', obj);
	});
});