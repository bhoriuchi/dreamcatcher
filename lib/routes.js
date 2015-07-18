// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Route Builder
//


module.exports = function(config) {
	
	
	
	
	
	var Promise = config.promise;
	var factory = config.factory;
	var _       = config.lodash;
	
	
	
	
	
	
	var CONST  = config.constants;
	var METHOD = CONST.methods;
	var FIELD  = CONST.fields;
	var STATUS = config.HttpStatus;
	
	
	
	
	
	// returns a promise containing the validation response
	// if the validation function does not return a promise
	// wrap it in one
	function validateAccess(opts, req) {

		
		// check for an auth field
		if (opts.hasOwnProperty(FIELD.auth)) {


			// check if the field is a boolean
			if (typeof (opts[FIELD.auth]) === 'boolean') {
				return new Promise(function(resolve) {
					resolve(opts[FIELD.auth]);
				});
			}
			// check for a promise
			else if (typeof (opts[FIELD.auth].next) === 'function') {
				return opts[FIELD.auth](req);
			}
			// check for plain function
			else if (typeof (opts[FIELD.auth]) === 'function') {
				return new Promise(function(resolve) {
					resolve(opts[FIELD.auth](req));
				});
			}
			// any other value is invalid, do not authenticate
			else {
				return new Promise(function(resolve) {
					resolve(false);
				});
			}
		}
		else {
			return new Promise(function(resolve) {
				resolve(true);
			});
		}
	}

	

	
	
	// function to build the routes
	function getRoutes(schema) {
		
		var routes = [];
		
		// prepare the schema
		schema = factory.prepareSchema(schema) || {};
		
		// create the models
		var models = factory.create(schema);
		
		
		// get pluralize value which adds an s onto the model name
		// for access to the rest resource path if not explicitly
		// set to false
		var pluralize = (config.rest.hasOwnProperty('pluralize') &&
				config.rest.pluralize === false) ? '' : 's';
		
		
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
						if (method === METHOD.GET || method === METHOD.HEAD) {
							
							
							// get all records
							var getAll = _.merge({
								path: '/' + tableName + pluralize + '/',
								handler: function(req, res, next) {
									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											models[tableName].forge()
											.getResources().then(function(results) {
												if (results !== null && results.hasOwnProperty('_code')) {
													var status = STATUS[_.findKey(STATUS, {code: results._code})];
													res.send(status.code, status);
												}
												else {
													res.send(results);
												}
											});
										}
										next();
									});
								}
							}, route);
							routes.push(getAll);
							
							
							// get a specific record
							var getId  = _.merge({
								path: '/' + tableName + pluralize + '/:id',
								handler: function(req, res, next) {
									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											models[tableName].forge()
											.getResource(req.params.id).then(function(results) {
												if (results !== null && results.hasOwnProperty('_code')) {
													var status = STATUS[_.findKey(STATUS, {code: results._code})];
													res.send(status.code, status);
												}
												else {
													res.send(results);
												}
											});
										}
										next();
									});
								}
							}, route);
							routes.push(getId);
						}
						
						
						
						
						
						
						
						
						
						
						// post function
						else if (method === METHOD.POST) {
							
							
							// get all records
							var post = _.merge({
								path: '/' + tableName + pluralize + '/',
								handler: function(req, res, next) {
									
									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											var model = models[tableName].forge();
											
											// as a safety check, delete the id field if it was supplied
											if (req.hasOwnProperty('body') && typeof (req.body) === 'object') {
												delete req.body[model.idAttribute];
												model.saveResource(req.body).then(function(results) {
													
													console.log(results);
													
													if (results !== null && results.hasOwnProperty('_code')) {
														var status = STATUS[_.findKey(STATUS, {code: results._code})];
														res.send(status.code, results);
													}
													else {
														res.send(STATUS.CREATED.code, results);
													}
												});
											}
											else {
												res.send(STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST);
											}
										}
										next();
									});
								}
							}, route);
							routes.push(post);
						}
						
						
						
						// put function
						
						
						
						// delete function
						
						
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