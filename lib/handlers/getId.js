// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: GET/HEAD by ID method handler
//


module.exports = function(config) {
	
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var _              = config.lodash;
	var u              = config.factory.utils.util;
	
	// create a handle function
	var handle = function(models, tableName, opts) {
		
		
		return function(req, res, next) {

			
			// parse the query string
			var qsp = config.util.qsParse(req);
			
			
			models[tableName].forge().view(qsp.view)
			.getResource(req.params.id, qsp.fetchOpts).end().then(function(results) {
				if (results && u.isErr(results)) {
					res.send(results.code, results);
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