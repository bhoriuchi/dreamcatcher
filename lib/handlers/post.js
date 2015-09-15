// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: POST method handler
//


module.exports = function(config) {
	
	
	var PARAMS         = config.constants.params;
	var FIELD          = config.constants.fields;
	var STATUS         = config.HttpStatus;
	var _              = config.lodash;
	var u              = config.factory.utils.util;
	
	
	// get the post update value, which allows the user to update
	// a model using the post method. by default post will only be
	// used to create a new resource and not to update
	var postUpdate = (config.rest.hasOwnProperty(FIELD.postUpdate) &&
			config.rest.postUpdate === true) ? true : false;
	
	
	// create a handle function
	var handle = function(models, tableName, opts) {
		
		
		return function(req, res, next) {
			
			
			// parse the query string
			var qsp = config.core.util.qsParse(req);
			
			
			var model = models[tableName].forge().view(qsp.view);
			
			
			// check for body object
			if (req.hasOwnProperty('body') && typeof (req.body) === 'object') {
				
				
				// if postUpdate is not set to true, try to delete the id attribute
				// from the body. since bookshelf-factory's save would overwrite the
				// resource with the same id
				if (!postUpdate && req.body.hasOwnProperty(model.idAttribute)) {
					delete req.body[model.idAttribute];
				}
				
				
				return model.saveResource(req.body, qsp.fetchOpts).end().then(function(results) {

					
					if (results && u.isErr(results)) {
						res.send(results.code, results);
					}
					else {
						
						if (req.body.hasOwnProperty(model.idAttribute)) {
							res.send(STATUS.OK.code, results);
						}
						else {
							res.send(STATUS.CREATED.code, results);
						}
					}
					
					return next();
				});
			}
			else {
				res.send(STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST);
			}
			
			return next();
			
		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};