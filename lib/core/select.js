// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: the select handler looks at the schema definition
//              and determines what handlers to use, then returns
//              an object containing an auth and operation handler
//


module.exports = function(config) {
	
	// constants
	var PARAMS         = config.constants.params;
	var METHODS        = config.constants.methods;
	var STATUS         = config.HttpStatus;
	
	// modules
	var _              = config.lodash;
	var handlers       = config.handlers;
	
	
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
		
		// everything else has been configured incorrectly
		// and should deny all for security
		else {
			console.log('An invalid authorization was supplied for ' + tableName);
			auth = unAuth;
		}
		
		// return the auth function
		return auth;
	}
	
	
	// create a handle function
	function handle(models, tableName, opts, def) {
		
		// set the defaults
		var auth     = allAuth;
		var handler = [];
		
		// determine authentication function to use. authentication can
		// be supplied at the global level, the model level, and the method level
		// lower level authentication is used over global level
		if (_.has(opts, 'auth')) {
			auth = evalAuth(opts.auth, tableName);
		}
		else if (_.has(models._schema, tableName + '._rest.auth')) {
			
			console.log('found _rest.auth');
			auth = evalAuth(models._schema[tableName]._rest.auth, tableName);
		}
		else if (_.has(config, 'registry.authentication') &&
				typeof(config.registry.authentication) === 'function') {
			auth = evalAuth(config.registry.authentication, tableName);
		}
		
		// push the authentication
		handler.push(auth);
		
		// determine the handler to use for the authentication callback
		if (_.has(opts, 'handler')) {
			
			// set the handler to an array if it is not one
			opts.handler = (typeof(opts.handler) === 'function') ? [opts.handler] : opts.handler;

			// loop through the handler array and add functions to the handlers array
			_.forEach(opts.handler, function(h) {
				if (typeof(h) === 'function') {
					handler.push(h);
				}
			});
		}
		
		else {

			// check for get method
			if (def && _.has(handlers, def)) {
				handler.push(handlers[def](models, tableName, opts));
			}
		}


		// return the handler function
		return handler;
	}
	
	
	// return public function
	return handle;
};