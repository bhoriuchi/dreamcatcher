// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: POST method handler
//

module.exports = function(config) {
	
	var PARAMS         = config.constants.params;
	var FIELD          = config.constants.fields;
	var STATUS         = config.HttpStatus;
	var validateAccess = config.auth.util.validateAccess;
	var _              = config.lodash;
	
	
	// get the post update value, which allows the user to update
	// a model using the post method. by default post will only be
	// used to create a new resource and not to update
	var postUpdate = (config.rest.hasOwnProperty(FIELD.postUpdate) &&
			config.rest.postUpdate === true) ? true : false;
	
	
	// create a handle function
	var handle = function(models, tableName, opts) {
		
		return function(req, res, next) {
			
			
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
		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};