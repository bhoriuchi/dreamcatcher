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
		
		
		
		
		
		
		
		
		
		
		// add formatters for JSON paginations
		if (!serverConfig.hasOwnProperty('formatters')) {
			serverConfig.formatters = {};
		}
		
		serverConfig.formatters['*/*'] = function(req, res, body) {
			if (body instanceof Error) {
				body = JSON.stringify({
					code : body.body.code,
					message : body.body.message
				});
			}
			return body;
		};
		
		/*
		serverConfig.formatters['application/json+datatables'] = function(req, res, body) {
			return JSON.stringify(body);
		};
		serverConfig.formatters['application/json+pagemaker'] = function(req, res, body) {
			return JSON.stringify(body);
		};
		serverConfig.formatters['application/json+paginate'] = function(req, res, body) {
			return JSON.stringify(body);
		};*/
		
		
		
		
		
		
		
		
		
		
		// create the server
		var server = restify.createServer(serverConfig);
		server.pre(restify.pre.sanitizePath());
		
		
		
		
		
		
		// Set Middleware options
		var queryParser = rest.queryParser || null;
		var dateParser  = rest.dateParser || null;
		var bodyParser  = rest.bodyParser || null;
		
		
		
		// Standard Middleware
		server.use(restify.acceptParser(server.acceptable));
		server.use(restify.authorizationParser());
		server.use(restify.queryParser(queryParser));
		server.use(restify.jsonp());
		server.use(restify.gzipResponse());
		server.use(restify.dateParser(dateParser));
		server.use(restify.bodyParser(bodyParser));
		
		
		// CORS
		if (rest.hasOwnProperty('cors') && typeof (rest.cors) === 'object') {
			server.use(restify.CORS(rest.cors));
		}
		
		// Throttle
		if (rest.hasOwnProperty('throttle') && typeof (rest.throttle) === 'object') {
			server.use(restify.throttle(rest.throttle));
		}
		
		
		// Custom Middleware
		if (rest.hasOwnProperty('use') && Array.isArray(rest.use)) {
			_.forEach(rest.use, function(middleware) {
				server.use(middleware);
			});
		}
		
		
		
		
		
		
		
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