// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: POST method handler
//


module.exports = function(config) {
	
	// constants
	var PARAMS         = config.constants.params;
	var FIELD          = config.constants.fields;
	var STATUS         = config.HttpStatus;
	
	// modules
	var _              = config.lodash;
	var u              = config.factory.utils.util;
	
	
	// get the post update value, which allows the user to update
	// a model using the post method. by default post will only be
	// used to create a new resource and not to update
	var postUpdate = (config.rest.hasOwnProperty(FIELD.postUpdate) &&
			config.rest.postUpdate === true) ? true : false;
	
	
	// create a handle function
	return function(models, tableName, opts) {
		
		var tableSchema = models._schema[tableName];
		
		// check for postUpdate override
		if (_.has(tableSchema, '_rest.methods.POST.postUpdate') && tableSchema._rest.methods.POST.postUpdate === true) {
			postUpdate = true;
		}
		
		// return the function
		return function(req, res, next) {
			
			
			// parse the query string
			var qsp = config.core.util.qsParse(req);
			
			
			// if a custom param action exists, complete it
			if (qsp.action && _.has(opts, 'action.' + qsp.action) &&
					typeof(opts.action[qsp.action]) === 'function') {
				return opts.action[qsp.action](req, res, next);
			}
			
			// forge the model first in order to get its ID attribute
			var model = models[tableName].forge();
			
			// check for body object
			if (_.has(req, 'body') && typeof (req.body) === 'object' && req.body) {
				
				
				// if postUpdate is not set to true, try to delete the id attribute
				// from the body. since bookshelf-factory's save would overwrite the
				// resource with the same id
				if (!postUpdate && req.body.hasOwnProperty(model.idAttribute)) {
					delete req.body[model.idAttribute];
				}
				
				// set values on the model and save it
				return model
				.view(qsp.view)
				.saveResource(req.body, qsp.fetchOpts, qsp.jsonOpts)
				.end()
				.then(function(results) {

					// check for results
					if (results) {
						
						// if the result is an error, set the code
						if (u.isErr(results)) {
							res.send(results.code, results);
							return next();
						}
						else if (_.has(req.body, model.idAttribute)) {
							res.send(STATUS.OK.code, results);
							return next();
						}

						// send a created status
						res.send(STATUS.CREATED.code, results);
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
			
			// return a bad request if there was no body
			res.send(STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST);
			return next();
		};
	};
};