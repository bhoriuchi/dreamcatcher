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
		
		
		// get the base path value for the api and strip the first and last / if they exist
		var basePath = config.rest.basePath || '';
		basePath     = basePath.replace(/^\/|\/$/g, '');
				
		
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
					
					// check for temporal schema
					var isTemporal = _.has(tableSchema, '_versioned.model');
					
					// check for a rest configuration
					if (_.has(tableSchema, FIELD.rest)) {
						
						// set an empty service path
						var servicePath = '';

						
						// add the service path if it exists
						if (_.has(tableSchema[FIELD.rest], 'service')) {
							servicePath     = tableSchema[FIELD.rest].service.path || '';
							servicePath     = servicePath.replace(/^\/|\/$/g, '');
							servicePath     = (servicePath !== '') ? servicePath + '/' : '';
						}
						
						
						// check for a pluralize override
						var addPlural = pluralize;
						if (_.has(tableSchema[FIELD.rest], 'pluralize') &&
								typeof(tableSchema[FIELD.rest].pluralize) === 'boolean') {
							addPlural = (tableSchema[FIELD.rest].pluralize) ? 's' : '';
						}
						
						
						// create the base uri path
						var basePathUri  = (basePath === '') ? '' : '/' + basePath;

						// add the resource path
						basePathUri      = basePathUri + '/' + servicePath + tableName + addPlural + '/';
						
						// add the path to the model schema so that related models have a correct uri
						models._schema[tableName]._path = {
							path: basePathUri
						};
						
						
						// check if the table has any methods
						if (_.has(tableSchema._rest, FIELD.methods)) {

							// loop through each method
							_.forEach(tableSchema[FIELD.rest][FIELD.methods], function(opts, method) {
								
								// get method
								if (method === METHOD.GET || method === METHOD.HEAD) {
									
									// get route for getAll
									routes.push({
										method: method,
										route: {
											path: basePathUri,
											version: version
										},
										handler: select(models, tableName, opts, 'getAll')
									});

									
									// get route for getId
									routes.push({
										method: method,
										route: {
											path: basePathUri + ':id',
											version: version
										},
										handler: select(models, tableName, opts, 'getId')
									});
								}

								
								// post function
								else if (method === METHOD.POST) {
									
									// get route for post
									routes.push({
										method: method,
										route: {
											path: basePathUri,
											version: version
										},
										handler: select(models, tableName, opts, 'post')
									});
									
									
									// add extra routes activate, deactivate, publish, and
									// un-publish for temporal models
									if (isTemporal) {
										routes.push({
											method: method,
											route: {
												path: basePathUri + ':id/activate',
												version: version
											},
											handler: select(models, tableName, opts, 'activate')
										});
										routes.push({
											method: method,
											route: {
												path: basePathUri + ':id/deactivate',
												version: version
											},
											handler: select(models, tableName, opts, 'deactivate')
										});
										routes.push({
											method: method,
											route: {
												path: basePathUri + ':id/publish',
												version: version
											},
											handler: select(models, tableName, opts, 'publish')
										});
										routes.push({
											method: method,
											route: {
												path: basePathUri + ':id/unpublish',
												version: version
											},
											handler: select(models, tableName, opts, 'unpublish')
										});
									}
								}

								
								// put function
								else if (method === METHOD.PUT) {
									
									// get route for put
									routes.push({
										method: method,
										route: {
											path: basePathUri + ':id',
											version: version
										},
										handler: select(models, tableName, opts, 'put')
									});
								}
								
								
								// delete function
								else if (method === METHOD.DELETE) {
									
									// get route for delete
									routes.push({
										method: method,
										route: {
											path: basePathUri + ':id',
											version: version
										},
										handler: select(models, tableName, opts, 'del')
									});
								}
							});
						}
					}
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
	
	
	
	// return public functions
	return {
		staticRoute: staticRoute,
		getRoutes: getRoutes
	};
};