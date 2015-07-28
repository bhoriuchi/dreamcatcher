// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: PUT method handler
//

module.exports = function(config) {
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var validateAccess = config.auth.util.validateAccess;
	var _              = config.lodash;
	
	
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
		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};