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
		var port             = rest.port || 8080;
		var serverConfig     = rest.server || {};
		serverConfig.version = serverConfig.version || config.rest.versions[0];
		serverConfig.name    = serverConfig.name || 'dreamcatcher';


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
			
			
			// add allowed cross domain headers
			rest.corsHeaders = (rest.hasOwnProperty('corsHeaders') &&
					Array.isArray(rest.corsHeaders)) ? rest.corsHeaders : [];
			rest.corsHeaders.push('authorization');
			rest.corsHeaders.push('accept-pagination');
			restify.CORS.ALLOW_HEADERS = _.union(restify.CORS.ALLOW_HEADERS, rest.corsHeaders);

			
			// set the middleware
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
			
			
			// verify that route.path and route.handler have been specified
			if (route.hasOwnProperty('path') &&
					route.path !== null &&
					route.hasOwnProperty('handler') &&
					typeof(route.handler) === 'function') {
				
				
				// check for an authentication function
				if (!route.hasOwnProperty('auth') || typeof(route.auth) !== 'function') {
					route.auth = function(req, res, next) {
						next();
					};
				}

				
				// set route
				if (route.method === METHOD.GET) {
					server.get({path: route.path, version: route.version}, route.auth, route.handler);
				}
				else if (route.method === METHOD.HEAD) {
					server.head({path: route.path, version: route.version}, route.auth, route.handler);
				}
				else if (route.method === METHOD.POST) {
					server.post({path: route.path, version: route.version}, route.auth, route.handler);
				}
				else if (route.method === METHOD.PUT) {
					server.put({path: route.path, version: route.version}, route.auth, route.handler);
				}
				else if (route.method === METHOD.DELETE) {
					server.del({path: route.path, version: route.version}, route.auth, route.handler);
				}
				else {
					console.log("WARNING: Invalid or no method provided for route " +
							route.path +
							". Allowed methods are GET, HEAD, POST, PUT, and DELETE");
				}
			}
			else {
				console.log("WARNING: Missing path or handler in one of the routes in the route list. It will be ignored");
			}
		});

		
		// start the listener on the server
		server.listen(port, function() {
			
			var timestamp = new Date(Date.now()).toISOString();
			console.log(timestamp + ': ' + server.name + ' is listening at ' + server.url);
		});
	}
	
	
	// return public functions
	return {
		run: run
	};
	
};