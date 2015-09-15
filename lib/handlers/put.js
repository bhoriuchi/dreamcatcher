// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: PUT method handler
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
		
		// return function
		return function(req, res, next) {
			
			// parse the query string
			var qsp = config.core.util.qsParse(req);
			
			
			// if a custom param action exists, complete it
			if (qsp.action && _.has(opts, 'action.' + qsp.action) &&
					typeof(opts.action[qsp.action]) === 'function') {
				return opts.action[qsp.action](req, res, next);
			}
			
			
			// forge a model and set the id attribute to the value passed
			// by the user in the path
			var model = models[tableName].forge();
			req.body[model.idAttribute] = req.params.id;
			
			// check for body object
			if (_.has(req, 'body') && typeof (req.body) === 'object' && req.body) {
				
				// set the model properties and save it
				return model.view(qsp.view)
				.saveResource(req.body, qsp.fetchOpts)
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
					return next();
				})
				.caught(function(e) {
					return next(e);
				});
			}

			// if there was no body, send a bad request status
			res.send(STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST);
			return next();
		};
	};
};