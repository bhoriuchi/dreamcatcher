// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Route Builder
//


module.exports = function(config) {
	
	
	var handlers  = require('../handlers')(config);
	var factory   = config.factory;
	var _         = config.lodash;
	var METHOD    = config.constants.methods;
	var FIELD     = config.constants.fields;

	
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
		var pluralize = (config.rest.hasOwnProperty(FIELD.pluralize) &&
				config.rest.pluralize === false) ? '' : 's';
		
		
		// get the base path value for the api and strip the first and last / if they exist
		var basePath = config.rest.basePath || '';
		basePath     = basePath.replace(/^\/|\/$/g, '');
				
		
		// get the allowed API versions. if no versions were specified, allow them all
		var versions = (config.rest.hasOwnProperty('versions') &&
				Array.isArray(config.rest.versions)) ? config.rest.versions : _.pluck(schemas, 'version');
		
		
		// create an array to hold all of the routes
		var routes   = [];
		var handle   = null;
		
		
		_.forEach(schemas, function(schemaVersion) {
			
			
			var schema  = schemaVersion.schema;
			var version = schemaVersion.version;
			
			
			// check the version
			if (versions.indexOf(version) !== -1) {

				
				// create the models
				var models = factory.create(schema, {version: version});
				

				// loop through the schema and get the routes
				_.forEach(models._schema, function(tableSchema, tableName) {
					
					
					if (tableSchema.hasOwnProperty(FIELD.rest)) {
						
						
						var servicePath = '';

						
						// add the service path if it exists
						if (tableSchema[FIELD.rest].hasOwnProperty('service')) {
							servicePath     = tableSchema[FIELD.rest].service.path || '';
							servicePath     = servicePath.replace(/^\/|\/$/g, '');
							servicePath     = (servicePath !== '') ? servicePath + '/' : '';
						}
						
						
						// check for a pluralize override
						var addPlural = pluralize;
						if (tableSchema[FIELD.rest].hasOwnProperty('pluralize') &&
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
						
						
						if (tableSchema._rest.hasOwnProperty(FIELD.methods)) {

							_.forEach(tableSchema[FIELD.rest][FIELD.methods], function(opts, method) {
								
								
								// create a base route object
								var route = {
									model: tableName,
									method: method,
									version: version
								};
								

								// get method
								if (method === METHOD.GET || method === METHOD.HEAD) {
									
									// get handle functions for getAll
									handle = handlers.select.handle(models, tableName, opts,
											handlers.getAll.handle(models, tableName, opts));
									
									// get all records
									routes.push(
										_.merge({
											path: basePathUri,
											auth: handle.auth,
											handler: handle.handler
										}, route)
									);
									
									
									// get handle functions for getId
									handle = handlers.select.handle(models, tableName, opts,
											handlers.getId.handle(models, tableName, opts));

									routes.push(
										_.merge({
											path: basePathUri + ':id',
											auth: handle.auth,
											handler: handle.handler
										}, route)
									);
								}

								
								// post function
								else if (method === METHOD.POST) {
									
									// get handle functions for post
									handle = handlers.select.handle(models, tableName, opts,
											handlers.post.handle(models, tableName, opts));
									
									// post record
									routes.push(
										_.merge({
											path: basePathUri,
											auth: handle.auth,
											handler: handle.handler
										}, route)
									);
								}

								
								// put function
								else if (method === METHOD.PUT) {
									
									// get handle functions for put
									handle = handlers.select.handle(models, tableName, opts,
											handlers.put.handle(models, tableName, opts));
									
									// post record
									routes.push(
										_.merge({
											path: basePathUri + ':id',
											auth: handle.auth,
											handler: handle.handler
										}, route)
									);
								}
								
								
								// delete function
								else if (method === METHOD.DELETE) {
									
									// get handle functions for delete
									handle = handlers.select.handle(models, tableName, opts,
											handlers.del.handle(models, tableName, opts));
									
									// delete record
									routes.push(
										_.merge({
											path: basePathUri + ':id',
											auth: handle.auth,
											handler: handle.handler
										}, route)
									);
								}
							});
						}
					}
				});
			}
		});

		
		return routes;
	}
	
	
	// return public functions
	return {
		getRoutes: getRoutes
	};
};