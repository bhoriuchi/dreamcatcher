// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Server Builder
//


module.exports = function(config) {
	
	var restify      = config.restify;
	var _            = config.lodash;
	

	var CONST        = config.constants;
	var METHOD       = CONST.methods;
	var FIELD        = CONST.fields;
	var rest         = config.rest;

	
	
	
	// function to start the server
	function run(routes) {
		
		// get config defaults
		var port         = rest.port || 8080;
		var serverConfig = rest.server || {};
		
		// create the server
		var server = restify.createServer(serverConfig);
		
		
		
		// middleware
		server.use(restify.acceptParser(server.acceptable));
		server.use(restify.authorizationParser());
		server.use(restify.queryParser());
		server.use(restify.bodyParser());
		
		
		// create the routes in the route list
		_.forEach(routes, function(route) {
			
			if (route.method === METHOD.GET) {
				server.get(route.path, route.handler);
			}
			else if (route.method === METHOD.HEAD) {
				server.head(route.path, route.handler);
			}
			else if (route.method === METHOD.POST) {
				server.post(route.path, route.handler);
			}
			else if (route.method === METHOD.PUT) {
				server.put(route.path, route.handler);
			}
			else if (route.method === METHOD.DELETE) {
				server.del(route.path, route.handler);
			}
		});
		
		
		
		
		
		server.listen(port, function() {
			console.log('Server started');
		});
	}
	
	
	
	// return public functions
	return {
		run: run
	};
	
};