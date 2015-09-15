// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: DELETE by ID method handler
//


module.exports = function(config) {
	
	// constants
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	
	// modules
	var _              = config.lodash;
	var u              = config.factory.utils.util;
	
	
	// create a handle function
	return function(models, tableName, opts) {
		
		// return the function
		return function(req, res, next) {
			
			// parse the query string
			var qsp = config.core.util.qsParse(req);

			
			// if a custom param action exists, complete it
			if (qsp.action && _.has(opts, 'action.' + qsp.action) &&
					typeof(opts.action[qsp.action]) === 'function') {
				return opts.action[qsp.action](req, res, next);
			}
			
			
			// forge a model and delete
			return models[tableName].forge()
			.deleteResource(req.params.id, qsp.fetchOpts)
			.end()
			.then(function(results) {

				// check for results
				if (results) {
					
					// if the result is an error, set the code
					if (u.isErr(results)) {
						res.send(results.code, results);
						return next();
					}

					// send an ok status
					res.send(STATUS.OK.code, results);
					return next();
				}
				
				// if there are no results, return a no content response
				res.send(STATUS.NO_CONTENT.code, STATUS.NO_CONTENT);
			})
			.caught(function(e) {
				return next(e);
			});
		};
	};
};