// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Utility functions
//


module.exports = function(config) {

	
	var Promise = config.promise;
	var FIELD   = config.constants.fields;
	
	
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
			else if (typeof (opts[FIELD.auth].then) === 'function') {
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
	
	
	// return public functions
	return {
		validateAccess: validateAccess
	};
};