// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: PUT method handler
//

module.exports = function(config) {
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var _              = config.lodash;
	
	
	// create a handle function
	var handle = function(models, tableName, opts) {
		
		return function(req, res, next) {
			
			
			// get the view
			var view = config.util.getView(req);
			
			
			// forge a model and set the id attribute to the value passed
			// by the user in the path
			var model = models[tableName].forge().view(view);
			req.body[model.idAttribute] = req.params.id;
			
			
			// check for body object
			if (req.hasOwnProperty('body') && typeof (req.body) === 'object') {
				
				
				model.saveResource(req.body).then(function(results) {

					
					if (results !== null && results.hasOwnProperty('_code')) {
						var status = STATUS[_.findKey(STATUS, {code: results._code})];
						res.send(status.code, results);
					}
					else {
						res.send(STATUS.OK.code, results);
					}
				});
			}
			else {
				res.send(STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST);
			}
			
			next();
		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};