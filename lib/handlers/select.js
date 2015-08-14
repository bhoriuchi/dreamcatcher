// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: the select handler looks at the schema definition
//              and determines what handlers to use, then returns
//              an object containing an auth and operation handler
//


module.exports = function(config) {
	
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var _              = config.lodash;
	
	
	// create a handle function
	var handle = function(models, tableName, opts, handler) {

		var auth = null;
		
		
		// determine the handler to use for the authentication callback
		if (opts.hasOwnProperty('handler') && typeof(opts.handler) === 'function') {
			handler = opts.handler;
		}
		
		
		// default allow all function
		var allAuth = function(req, res, next) {
			next();
		};
		
		
		// function to send an unauthorized status
		var unAuth = function(req, res, next) {
			res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
			res.end();
		};
		
		

		// determine auth function to use
		if (opts.hasOwnProperty('auth')) {
			
			// check for boolean, if true allow, if false, reject
			if (typeof (opts.auth) === 'boolean') {
				auth = opts.auth ? allAuth : unAuth;
			}
			
			// check for a function only and use the function passing the callbaack as an argument
			else if (typeof (opts.auth) === 'function') {
				auth = opts.auth;
			}
			
			// everything else has been misconfigured and should deny all for security
			else {
				auth = unAuth;
			}
			
		}
		
		// if no auth has been specified, all access is permitted
		else {
			auth = allAuth;
		}
		
		
		// return the handler function
		return {
			auth: auth,
			handler: handler
		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};