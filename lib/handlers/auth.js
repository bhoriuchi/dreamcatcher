// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: auth handler
//


module.exports = function(config) {
	
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var validateAccess = config.auth.util.validateAccess;
	var _              = config.lodash;
	
	
	// create a handle function
	var handle = function(opts, callback) {
		
		
		return function(req, res, next) {

			
			validateAccess(opts, req).then(function(allow) {
				
				
				if (!allow) {
					res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
				}
				else {
					callback(req, res, next);
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