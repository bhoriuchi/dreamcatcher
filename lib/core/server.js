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
		var port             = rest.port            || 8080;
		var serverConfig     = rest.server          || {};
		serverConfig.version = serverConfig.version || config.rest.versions[0];
		serverConfig.name    = serverConfig.name    || '☯ dreamcatcher ☯';

		
		// check what type of object routes is. if it is a schema, then process the routes
		if (!Array.isArray(routes) || routes.length === 0) {
			console.log('No routes were specified, cannot start the server.');
			return;
		}
				

		// create the server
		var server = restify.createServer(serverConfig);
		server.pre(restify.pre.sanitizePath());
		

		// set middle ware options
		var queryParser = rest.queryParser || null;
		var dateParser  = rest.dateParser  || null;
		var bodyParser  = rest.bodyParser  || null;
		
		
		// standard middle ware
		server.use(restify.bodyParser(bodyParser));
		server.use(restify.acceptParser(server.acceptable));
		server.use(restify.authorizationParser());
		server.use(restify.queryParser(queryParser));
		server.use(restify.jsonp());
		server.use(restify.gzipResponse());
		server.use(restify.dateParser(dateParser));
		
		
		// CORS
		if (rest.hasOwnProperty('cors') && typeof (rest.cors) === 'object') {
			
			
			// add allowed cross domain headers
			rest.corsHeaders = (rest.hasOwnProperty('corsHeaders') &&
					Array.isArray(rest.corsHeaders)) ? rest.corsHeaders : [];
			rest.corsHeaders.push('authorization');
			rest.corsHeaders.push('accept-pagination');
			restify.CORS.ALLOW_HEADERS = _.union(restify.CORS.ALLOW_HEADERS, rest.corsHeaders);

			
			// set the middle ware
			server.use(restify.CORS(rest.cors));
		}
		
		
		// throttle
		if (rest.hasOwnProperty('throttle') && typeof (rest.throttle) === 'object') {
			server.use(restify.throttle(rest.throttle));
		}
		
		
		// custom middle ware
		if (Array.isArray(config.registry.middleware) && config.registry.middleware.length > 0) {
			_.forEach(config.registry.middleware, function(middleware) {
				server.use(middleware);
			});
		}
		

		// create the routes in the route list
		_.forEach(routes, function(route) {

			// first update any routes that are misconfigured
			if (_.has(route, 'route.path') &&
					_.has(route, 'method') &&
					_.has(route, 'handler') &&
					(typeof(route.handler) ||
					(Array.isArray(route.handler)))) {
				
				// set the handler to an array if it is a single function
				if (typeof(route.handler) === 'function') {
					route.handler = [route.handler];
				}

				// set route
				if (route.method === METHOD.GET) {
					server.get(route.route, route.handler);
				}
				else if (route.method === METHOD.HEAD) {
					server.head(route.route, route.handler);
				}
				else if (route.method === METHOD.POST) {
					server.post(route.route, route.handler);
				}
				else if (route.method === METHOD.PUT) {
					server.put(route.route, route.handler);
				}
				else if (route.method === METHOD.DELETE) {
					server.del(route.route, route.handler);
				}
				else {
					console.log("WARNING: Invalid or no method provided for route " +
							route.path +
							". Allowed methods are GET, HEAD, POST, PUT, and DELETE");
				}
				
			}
			else {
				console.log('Missing a route, method, or handler', route);
			}
		});

		
		// start the listener on the server
		server.listen(port, function() {
			
			// print a startup message
			var timestamp = new Date(Date.now()).toISOString();
			console.log(timestamp, ':', server.name, 'is listening at ➜', server.url);
			
			// add any event listeners
			_.forEach(config.registry.events, function(event) {
				
				// check that the event has a valid type
				if (typeof(config.emitter[event.type]) === 'function') {
					
					// create a new timestamp
					timestamp = new Date(Date.now()).toISOString();
					
					// log that the event listener has been added
					console.log(timestamp, ': Adding', event.type, 'event listener for', event.event);
					
					// create the listener
					config.emitter[event.type](event.event, event.listener);
				}
			});
		});
	}
	
	
	// return public functions
	return {
		run: run
	};
};