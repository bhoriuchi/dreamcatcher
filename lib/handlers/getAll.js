// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: GET/HEAD All method handler
//


module.exports = function(config) {
	
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var _              = config.lodash;
	var dotprune       = config.dotprune;
	var u              = config.factory.utils.util;
	
	// create a handle function
	var handle = function(models, tableName, opts) {
		
		// return a function that takes the
		// standard express parameters
		return function (req, res, next) {
			
			// parse the query string
			var qsp      = config.core.util.qsParse(req);
			var registry = config.registry;

			// get the model
			var Model    = models[tableName];
			
			console.log(models[tableName]._var);
			// paginate is specified
			if (req.headers.hasOwnProperty('accept-pagination') &&
					req.headers['accept-pagination']) {
				
				// get the pagination type
				var ptype      = req.headers['accept-pagination'];
				var pagination = registry.pagination[ptype] || registry.pagination.paged;
				
				// paginate the model and get the resource
				return Model.forge()
				.paginate(pagination, req)
				.view(qsp.view)
				.getResources(qsp.fetchOpts)
				.end()
				.then(function(results) {
					
					
					
					// check if there are results and the results are an error
					// send the results along with the error code
					if (results && u.isErr(results)) {
						res.send(results.code, results);
					}
					
					// otherwise send the results
					else {
						res.send(results);
					}
					
					return next();
				});
			}
			
			// if a regular request
			else {
				
				// forge the model and attempt to search, order
				// and filter the results
				return Model.forge()
				.href(qsp.href)
				.search(qsp.search)
				.order(qsp.order)
				.limit(qsp.limit)
				.offset(qsp.offset)
				.view(qsp.view)
				.getResources(qsp.fetchOpts)
				.end()
				.then(function(results) {
					
					// if there are results and the results are an error
					// send the results along with the error code
					if (results && u.isErr(results)) {
						res.send(results.code, results);
					}
					else {
						res.send(results);
					}
					
					return next();
				});
			}
			
			// call the next function to proceed
			// to the next middleware
			//next();

		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};