// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Route Builder
//


module.exports = function(config) {
	
	
	
	
	
	var Promise   = config.promise;
	var factory   = config.factory;
	var pagemaker = config.pagemaker;
	var _         = config.lodash;
	
	
	
	
	
	
	var CONST     = config.constants;
	var METHOD    = CONST.methods;
	var FIELD     = CONST.fields;
	var PARAMS    = CONST.params;
	var STATUS    = config.HttpStatus;
	
	
	
	
	
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
		var pluralize = (config.rest.hasOwnProperty(FIELD.pluralize) &&
				config.rest.pluralize === false) ? '' : 's';
		
		
		// get the post update value, which allows the user to update
		// a model using the post method. by default post will only be
		// used to create a new resource and not to update
		var postUpdate = (config.rest.hasOwnProperty(FIELD.postUpdate) &&
				config.rest.postUpdate === true) ? true : false;
		
		
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

									var view = null;
									
									if (req.params.hasOwnProperty(PARAMS.fields)) {
										view = req.params[PARAMS.fields].split(',');
									}
									else if (req.params.hasOwnProperty(PARAMS.view)) {
										view = req.params[PARAMS.view];
									}

									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											
											// get the model
											var Model = models[tableName];
											
											
											// optional, obtain the uri for use with next/previous 
											var http_type = (req.connection.encrypted) ? 'https://' : 'http://';
											var baseURI = http_type + req.headers.host + req.url;

											
											// paginate is specified
											if (req.headers.accept === 'application/json+datatables') {
												pagemaker.datatables.paginate({
													params: req.params,
													model: Model,
													relations: models._relations[tableName]
												})
												.then(function(results) {
													if (results !== null && results.hasOwnProperty('_code')) {
														var status = STATUS[_.findKey(STATUS, {code: results._code})];
														res.send(status.code, status);
													}
													else {
														res.send(results);
													}
												});
											}
											
											else if (req.headers.accept === 'application/json+pagemaker') {
												pagemaker.pagemaker.paginate({
													params: req.params,
													model: Model,
													relations: models._relations[tableName],
													uri: baseURI
												})
												.then(function(results) {
													if (results !== null && results.hasOwnProperty('_code')) {
														var status = STATUS[_.findKey(STATUS, {code: results._code})];
														res.send(status.code, status);
													}
													else {
														res.send(results);
													}
												});
											}
											
											else if (req.headers.accept === 'application/json+paginate' &&
													config.rest.paginate !== null &&
													typeof (config.rest.paginate) === 'object') {
												pagemaker.custom.paginate({
													params: req.params,
													model: Model,
													relations: models._relations[tableName],
													uri: baseURI
												})
												.then(function(results) {
													if (results !== null && results.hasOwnProperty('_code')) {
														var status = STATUS[_.findKey(STATUS, {code: results._code})];
														res.send(status.code, status);
													}
													else {
														res.send(results);
													}
												});
											}
											
											// otherwise print the entire result
											else {
											
												Model.forge().view(view)
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
									
									var view = null;
									
									if (req.params.hasOwnProperty(PARAMS.fields)) {
										view = req.params[PARAMS.fields].split(',');
									}
									else if (req.params.hasOwnProperty(PARAMS.view)) {
										view = req.params[PARAMS.view];
									}
									
									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											models[tableName].forge().view(view)
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
									
									
									var view = null;
									
									if (req.params.hasOwnProperty(PARAMS.fields)) {
										view = req.params[PARAMS.fields].split(',');
									}
									else if (req.params.hasOwnProperty(PARAMS.view)) {
										view = req.params[PARAMS.view];
									}
									
									
									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											var model = models[tableName].forge().view(view);
											
											// check for body object
											if (req.hasOwnProperty('body') && typeof (req.body) === 'object') {
												
												// if postUpdate is not set to true, try to delete the id attribute
												// from the body. since bookshelf-factory's save would overwrite the
												// resource with the same id
												if (!postUpdate && req.body.hasOwnProperty(model.idAttribute)) {
													delete req.body[model.idAttribute];
												}
												
												model.saveResource(req.body).then(function(results) {

													if (results !== null && results.hasOwnProperty('_code')) {
														var status = STATUS[_.findKey(STATUS, {code: results._code})];
														res.send(status.code, results);
													}
													else {
														
														if (req.body.hasOwnProperty(model.idAttribute)) {
															res.send(STATUS.OK.code, results);
														}
														else {
															res.send(STATUS.CREATED.code, results);
														}
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
						else if (method === METHOD.PUT) {
							
							
							// get all records
							var put = _.merge({
								path: '/' + tableName + pluralize + '/:id',
								handler: function(req, res, next) {
									
									
									var view = null;
									
									if (req.params.hasOwnProperty(PARAMS.fields)) {
										view = req.params[PARAMS.fields].split(',');
									}
									else if (req.params.hasOwnProperty(PARAMS.view)) {
										view = req.params[PARAMS.view];
									}
									
									
									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											
											// forge a model and set the id attribute to the value passed
											// by the user in the path
											var model = models[tableName].forge().view(view);
											req.body[model.idAttribute] = req.params.id;
											
											// check for body object
											if (req.hasOwnProperty('body') && typeof (req.body) === 'object') {
												
												model.saveResource(req.body).then(function(results) {

													if (results !== null && results.hasOwnProperty('_code')) {
														var status = STATUS[_.findKey(STATUS, {code: results._code})];
														res.send(status.code, results);
													}
													else {
														res.send(STATUS.OK.code, results);
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
							routes.push(put);
						}
						
						
						
						
						
						
						
						
						
						
						// delete function
						else if (method === METHOD.DELETE) {
							
							
							// get all records
							var del = _.merge({
								path: '/' + tableName + pluralize + '/:id',
								handler: function(req, res, next) {
									
									
									var view = null;
									
									if (req.params.hasOwnProperty(PARAMS.fields)) {
										view = req.params[PARAMS.fields].split(',');
									}
									else if (req.params.hasOwnProperty(PARAMS.view)) {
										view = req.params[PARAMS.view];
									}
									
									
									validateAccess(opts, req).then(function(allow) {
										if (!allow) {
											res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
										}
										else {
											
											// forge a model and delete
											models[tableName].forge().view(view)
											.deleteResource(req.params.id).then(function(results) {

												if (results !== null && results.hasOwnProperty('_code')) {
													var status = STATUS[_.findKey(STATUS, {code: results._code})];
													res.send(status.code, results);
												}
												else {
													res.send(STATUS.OK.code, results);
												}
											});
										}
										next();
									});
								}
							}, route);
							routes.push(del);
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