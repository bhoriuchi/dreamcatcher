// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: auth handler
//


module.exports = function(config) {
	
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var _              = config.lodash;
	
	
	// create a handle function
	var handle = function(models, tableName, opts, callback) {

		var auth = null;
		
		
		// determine the handler to use for the authentication callback
		if (opts.hasOwnProperty('handler') && typeof(opts.handler) === 'function') {
			callback = opts.handler;
		}
		
		
		// default allow all function
		var allAuth = function(req, res, next) {
			callback(req, res, next);
		};
		
		
		// function to send an unauthorized status
		var unAuth = function(req, res, next) {
			res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
			next();
		};
		
		

		// determine auth function to use
		if (opts.hasOwnProperty('auth')) {
			
			// check for boolean, if true allow, if false, reject
			if (typeof (opts.auth) === 'boolean') {
				auth = opts.auth ? allAuth : unAuth;
			}
			
			// check for a function only and use the function passing the callbaack as an argument
			else if (typeof (opts.auth) === 'function') {
				auth = opts.auth(callback);
			}
			
			// check for an object with a handler
			else if (typeof (opts.auth) === 'object' &&
					opts.auth.hasOwnProperty('handler') &&
					typeof(opts.auth.handler) === 'function') {
				
				// check for arguments and push the callback onto the arguments
				var args = opts.auth.arguments || [];
				args.push(callback);
				
				// apply the args to the auth handler
				auth = opts.auth.handler.apply(this, args);
				
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
		return function(req, res, next) {
			auth(req, res, next);
		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};