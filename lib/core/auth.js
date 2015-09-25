// Author: Branden Horiuchi <bhoriuchi@gmail.com>
//


module.exports = function(config) {
	
	// constants
	var PARAMS         = config.constants.params;
	var METHODS        = config.constants.methods;
	var STATUS         = config.HttpStatus;
	
	// modules
	var _              = config.lodash;
	
	
	// default allow all function
	function allAuth(req, res, next) {
		return next();
	}

	
	// function to send an unauthorized status
	function unAuth(req, res, next) {
		res.send(STATUS.UNAUTHORIZED.code, STATUS.UNAUTHORIZED);
		res.end();
	}
	
	
	// function to evaluate the auth value
	function evalAuth(auth, tableName) {
		
		// check for boolean, if true allow, if false, reject
		if (typeof (auth) === 'boolean') {
			auth = auth === true ? allAuth : unAuth;
		}
		
		// check for a function only and use the function passing the callback as an argument
		else if (typeof (auth) === 'function') {
			auth = auth;
		}
		
		// check for an object that has the correct properties
		else if (_.has(auth, 'module')) {
			
			// set up the defaults
			var funct = auth.authentication || 'authenticate';
			var args  = auth.arguments || [];
			args      = Array.isArray(args) ? args : [args];
			
			// check that the module has an authentication function
			if (typeof(auth.module[funct]) === 'function') {
				auth = auth.module[funct].apply(auth.module, args);
			}
			
			// if it does not, send a not authorized response
			else {
				console.log('An invalid authorization was supplied for ' + tableName);
				auth = unAuth;
			}
		}
		
		// everything else has been configured incorrectly
		// and should deny all for security
		else {
			console.log('An invalid authorization was supplied for ' + tableName);
			auth = unAuth;
		}
		
		// return the auth function
		return auth;
	}
	
	
	// return functions
	return {
		evalAuth: evalAuth,
		allAuth: allAuth,
		unAuth: unAuth
	};
};