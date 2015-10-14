// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Route Builder
//


module.exports = function(config) {
	
	// constants
	var METHOD    = config.constants.methods;
	var FIELD     = config.constants.fields;
	
	// modules
	var _         = config.lodash;
	var select    = config.core.select;
	var handlers  = config.handlers;
	var factory   = config.factory;
	var path      = config.path;



	
	// function to build the routes
	function getRoutes(schemas) {
				
		
		// check for a single schema passed
		if (!Array.isArray(schemas) && typeof(schemas) === 'object') {
			schemas = [
                {
                    schema: schemas,
                    version: '0.1.0'
                }
			];
		}
		
		
		// get pluralize value which adds an s onto the model name
		// for access to the rest resource path if not explicitly
		// set to false
		var pluralize = (_.has(config.rest, FIELD.pluralize) &&
				        config.rest.pluralize === false) ? '' : 's';
		
		
		// get the base path
		var basePath = config.rest.basePath || '';
		
		
		// get the allowed API versions. if no versions were specified, allow them all
		var versions = (_.has(config.rest, 'versions') &&
					   Array.isArray(config.rest.versions)) ?
					   config.rest.versions : _.pluck(schemas, 'version');
		
		
		// create an array to hold all of the routes
		var routes   = [];
		
		
		// loop through each schema version
		_.forEach(schemas, function(schemaVersion) {
			
			
			// set the schema and version
			var schema  = schemaVersion.schema;
			var version = schemaVersion.version;
			
			
			// check the version
			if (_.contains(versions, version)) {

				// create the models for the current version
				var models = factory.create(schema, {version: version});

				// loop through the schema and get the routes
				_.forEach(models._schema, function(tableSchema, tableName) {
					
					// get the model name
					var modelName = (_.has(tableSchema, '_model.name')) ? tableSchema._model.name : tableName;
					
					// check for temporal schema
					var isTemporal = _.has(tableSchema, '_versioned.model');
					
					// check for a rest configuration
					if (_.has(tableSchema, FIELD.rest)) {
						
						var rest = tableSchema._rest;
						
						
						// get the service path
						var servicePath = _.has(rest, 'service.path') ? rest.service.path : '';

						
						// check for a pluralize override
						var addPlural = pluralize;
						if (_.has(rest, 'pluralize') &&
								typeof(rest.pluralize) === 'boolean') {
							addPlural = (rest.pluralize) ? 's' : '';
						}

						// add the resource path
						var basePathUri = path.join(basePath, servicePath, modelName + addPlural);
						
						// add the path to the model schema so that related models have a correct uri
						models._schema[tableName]._path = {
							path: basePathUri
						};
						
						
						// check if the table has any methods
						if (_.has(rest, FIELD.methods)) {

							// loop through each method
							_.forEach(rest[FIELD.methods], function(opts, method) {
								
								// create an object to hold the route/handler config
								var handleObj = {
									useDefaults: true,
									routes: []
								};
								
								// examine the handler
								if (_.has(opts, 'handler')) {
									
									// if the handler is a function or array, then custom
									// handling will take place for the default paths
									if (typeof(opts.handler) === 'function' || Array.isArray(opts.handler)) {
										
										// if a function is supplied to handle, it overrides
										// the default handler(s)
										handleObj.useDefaults = false;
										handleObj.routes.push({
											route: '',
											handler: opts.handler,
											auth: null
										});
									}
									
									// if the handler is an object with a routes field then
									// it is a whole set of routes
									else if (typeof(opts.handler) === 'object' &&
											_.has(opts.handler, 'routes') &&
											Array.isArray(opts.handler.routes)) {
										
										// if use defaults is set to false don't add them
										// otherwise add them with the custom routes/handlers
										handleObj.useDefaults = (opts.handler.useDefaults === false) ? false : true;
										
										// loop through the routes and add them if they have a route and handler
										_.forEach(opts.handler.routes, function(route) {
											if (_.has(route, 'route') && _.has(route, 'handler')) {
												
												// set the auth to the defined, or possible method auth
												// both may be undefined or null, and will get taken care
												// of at the time of the route push
												route.auth = route.auth ? route.auth : opts.auth;
												
												// add the route
												handleObj.routes.push(route);
											}
										});
									}
								}
																
								
								// get method
								if (method === METHOD.GET || method === METHOD.HEAD) {
									
									
									
									// get the defaults and add them
									if (handleObj.useDefaults) {
										handleObj.routes.push({
											route: '',
											handler: handlers.getAll(models, tableName, opts),
											auth: opts.auth
										});
										handleObj.routes.push({
											route: ':id',
											handler: handlers.getId(models, tableName, opts),
											auth: opts.auth
										});
									}
								}

								
								// post function
								else if (method === METHOD.POST) {
									
									
									// get the defaults and add them
									if (handleObj.useDefaults) {
										handleObj.routes.push({
											route: '',
											handler: handlers.post(models, tableName, opts),
											auth: opts.auth
										});
									}
									
									// if the model is temporal, add the additional routes
									if (isTemporal) {
										handleObj.routes.push({
											route: ':id/activate',
											handler: handlers.activate(models, tableName, opts),
											auth: opts.auth
										});
										handleObj.routes.push({
											route: ':id/deactivate',
											handler: handlers.deactivate(models, tableName, opts),
											auth: opts.auth
										});
										handleObj.routes.push({
											route: ':id/publish',
											handler: handlers.publish(models, tableName, opts),
											auth: opts.auth
										});
										handleObj.routes.push({
											route: ':id/unpublish',
											handler: handlers.unpublish(models, tableName, opts),
											auth: opts.auth
										});
									}
								}

								
								// put function
								else if (method === METHOD.PUT) {
									
									
									// get the defaults and add them
									if (handleObj.useDefaults) {
										handleObj.routes.push({
											route: ':id',
											handler: handlers.put(models, tableName, opts),
											auth: opts.auth
										});
									}
								}
								
								
								// delete function
								else if (method === METHOD.DELETE) {
									
									// get the defaults and add them
									if (handleObj.useDefaults) {
										handleObj.routes.push({
											route: ':id',
											handler: handlers.del(models, tableName, opts),
											auth: opts.auth
										});
									}
								}
								
								// look at the proposed routes and create actual route objects
								_.forEach(handleObj.routes, function(route) {
									
									// determine the authentication
									if (!route.auth) {
										if (rest.auth) {
											route.auth = rest.auth;
										}
										else if (_.has(config, 'registry.authentication')) {
											route.auth = config.registry.authentication;
										}
										else {
											route.auth = true;
										}
									}
									
									// evaluate the authentication
									var handlerList = [config.core.auth.evalAuth(route.auth, tableName)];
									route.handler   = Array.isArray(route.handler) ? route.handler : [route.handler];
									
									// add the non-auth handlers
									_.forEach(route.handler, function(hndl) {
										handlerList.push(hndl);
									});
									
									// push the current route
									routes.push({
										method: method,
										route: {
											path: path.join(basePathUri, route.route),
											version: version
										},
										handler: handlerList
									});
								});
							});
						}
					}
				});
			}
		});

		// now add any plug-in routes
		_.forEach(config.registry.plugins, function(plugin) {
			if (Array.isArray(plugin.routes)) {
				_.forEach(plugin.routes, function(pluginRoute) {
					routes.push(pluginRoute);
				});
			}
		});
		
		
		// return the routes
		return routes;
	}
	
	
	// helper function to return a static route
	function staticRoute(opts) {
		
		var cfg  = {};
		var path = opts.path;
		var auth = opts.auth;
		var dir  = opts.directory;
		var def  = opts['default'];
		
		// set default root
		cfg.directory = dir || __dirname + '/';
		
		// set the default file
		if (def) {
			cfg['default'] = def;
		}

		// check for a path
		if (path) {
			
			var handler = [];
			
			// check for auth function
			if (typeof(auth) === 'function') {
				handler.push(auth);
			}
			
			// add the static handler
			handler.push(config.restify.serveStatic(cfg));
			
			// return the route
			return {
				method: METHOD.GET,
				route: {
					path: path
				},
				handler: handler
			};
		}
		
		// return null if missing required data
		return null;
	}
	
	
	function hbsRoute(args) {
		
		// look for required args
		if (!_.has(args, 'path') || !_.has(args, 'template')) {
			return null;
		}
		
		// set optional args
		args.live     = (args.live === true) ? true : false;
		args.encoding = args.encoding || 'utf8';
		args.context  = args.context  || {};
		args.method   = args.method   || 'GET';
		args.version  = args.version  || null;
		
		return {
			method: args.method,
			route: {
				path: args.path,
				version: args.version
			},
			handler: config.core.handlebars.hbsHandler(args)
		};
	}
	
	
	// return public functions
	return {
		staticRoute: staticRoute,
		getRoutes: getRoutes,
		hbsRoute: hbsRoute
	};
};