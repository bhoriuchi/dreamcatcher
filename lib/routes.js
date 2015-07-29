// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Route Builder
//


module.exports = function(config) {
	
	
	var handlers  = require('./handlers')(config);
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
		var routes = [];
		
		
		_.forEach(schemas, function(schemaVersion) {
			
			
			var schema  = schemaVersion.schema;
			var version = schemaVersion.version;
			
			// check the version
			if (versions.indexOf(version) !== -1) {
				
				
				// prepare the schema
				schema = factory.prepareSchema(schema) || {};
				
				
				// create the models
				var models = factory.create(schema);

				
				// loop through the schema and get the routes
				_.forEach(schema, function(tableSchema, tableName) {
					
					
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
						
						
						if (tableSchema._rest.hasOwnProperty(FIELD.methods)) {
							_.forEach(tableSchema[FIELD.rest][FIELD.methods], function(opts, method) {
								
								
								// create a base route object
								var route = {
									model: tableName,
									method: method,
									version: version
								};
								
								
								// create the base uri path
								var basePathUri = (basePath === '') ? '' : '/' + basePath;
						
								
								// add the resource path
								basePathUri     = basePathUri + '/' + servicePath + tableName + addPlural + '/';

								
								// get method
								if (method === METHOD.GET || method === METHOD.HEAD) {
									
									
									// get all records
									routes.push(
										_.merge({
											path: basePathUri,
											handler: handlers.getAll.handle(models, tableName, opts)
										}, route)
									);
									
									
									// get record by id
									routes.push(
										_.merge({
											path: basePathUri + ':id',
											handler: handlers.getId.handle(models, tableName, opts)
										}, route)
									);
								}

								
								// post function
								else if (method === METHOD.POST) {
									
									
									// post record
									routes.push(
										_.merge({
											path: basePathUri,
											handler: handlers.post.handle(models, tableName, opts)
										}, route)
									);
								}

								
								// put function
								else if (method === METHOD.PUT) {
									
									
									// post record
									routes.push(
										_.merge({
											path: basePathUri + ':id',
											handler: handlers.put.handle(models, tableName, opts)
										}, route)
									);
								}
								
								
								// delete function
								else if (method === METHOD.DELETE) {
									
									
									// delete record
									routes.push(
										_.merge({
											path: basePathUri + ':id',
											handler: handlers.del.handle(models, tableName, opts)
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