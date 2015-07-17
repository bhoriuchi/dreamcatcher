// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Route Builder
//


module.exports = function(config) {
	
	
	var factory = config.factory;
	var _       = config.lodash;
	
	
	
	var CONST  = config.constants;
	var METHOD = CONST.methods;
	var FIELD  = CONST.fields;
	
	
	
	// function to build the routes
	function getRoutes(schema) {
		
		var routes = [];
		
		// prepare the schema
		schema = factory.prepareSchema(schema) || {};
		
		// create the models
		var models = factory.create(schema);
		
		
		// loop through the schema and get the routes
		_.forEach(schema, function(tableSchema, tableName) {
			if (tableSchema.hasOwnProperty(FIELD.rest)) {
				
				if (tableSchema._rest.hasOwnProperty(FIELD.methods)) {
					_.forEach(tableSchema[FIELD.rest][FIELD.methods], function(opts, method) {
						
						var route = {
							model: tableName,
							method: method
						};
						
						// get method
						if (method === METHOD.GET) {
							
							var getAll = _.merge({
								path: '/' + tableName + 's/',
								handler: function(req, res, next) {

									
									if (opts.hasOwnProperty(FIELD.auth) && !opts.auth(req)) {
										res.send({_code: 401, message: 'unauthorized'});
										next();
									}
									else {
										models[tableName].forge().getResources().then(function(results) {
											res.send(results);
											next();
										});
									}
								}
							}, route);
							var getId  = _.merge({
								path: '/' + tableName + 's/:id',
								handler: function(req, res, next) {
									
									models[tableName].forge().getResource(req.params.id).then(function(results) {
										res.send(results);
										next();
									});
								}
							}, route);
							
							routes.push(getAll);
							routes.push(getId);
						}
					});
				}
			}
		});
		
		return routes;
	}
	
	
	// return public functions
	return {
		getRoutes: getRoutes
	};
	
	
};