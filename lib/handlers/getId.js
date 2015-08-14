// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: GET/HEAD by ID method handler
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
			
			
			models[tableName].forge().view(view)
			.getResource(req.params.id).then(function(results) {
				if (results !== null && results.hasOwnProperty('_code')) {
					var status = STATUS[_.findKey(STATUS, {code: results._code})];
					res.send(status.code, status);
				}
				else {
					res.send(results);
				}
			});
			next();
			
		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};