// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: DELETE by ID method handler
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

			
			// forge a model and delete
			models[tableName].forge().view(view)
			.deleteResource(req.params.id).then(function(results) {

				
				if (results !== null && results.hasOwnProperty('_code')) {
					var status = STATUS[_.findKey(STATUS, {code: results._code})];
					res.send(status.code, results);
				}
				else {
					res.send(STATUS.OK.code, results);
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