// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Server Builder
//


module.exports = function(config) {
	
	var restify = config.restify;
	var _       = config.lodash;
	

	var CONST  = config.constants;
	var METHOD = CONST.methods;
	var FIELD  = CONST.fields;
	
	
	
	// function to start the server
	function run(routes) {
		
		var server = restify.createServer();
		server.use(restify.acceptParser(server.acceptable));
		server.use(restify.authorizationParser());
		server.use(restify.queryParser());
		server.use(restify.bodyParser());
		
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
		});
		
		
		server.listen(8080, function() {
			console.log('Server started');
		});
	}
	
	
	
	// return public functions
	return {
		run: run
	};
	
};