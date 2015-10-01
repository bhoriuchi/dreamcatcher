// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: GET/HEAD All method handler
//


module.exports = function(config) {
	
	// constants
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var _HDR           = config.constants.headers;
	
	// modules
	var _              = config.lodash;
	var dotprune       = config.dotprune;
	var u              = config.factory.utils.util;

	
	// create a handle function
	return function(models, tableName, opts) {
		
		// return a function that takes the
		// standard express parameters
		return function (req, res, next) {
			
			
			// parse the query string
			var qsp      = config.core.util.qsParse(req);
			
			
			// if a custom param action exists, complete it
			if (qsp.action && _.has(opts, 'action.' + qsp.action) &&
					typeof(opts.action[qsp.action]) === 'function') {
				return opts.action[qsp.action](req, res, next);
			}
			
			
			// get the registry
			var registry = config.registry;

			
			// get the model
			var model    = models[tableName].forge();
			
			// check for pagination
			if (_.has(req.headers, _HDR.accept.pagination) &&
					req.headers[_HDR.accept.pagination]) {
				
				// get the pagination type
				var page_type  = req.headers[_HDR.accept.pagination];
				var pagination = registry.pagination[page_type] || registry.pagination.paged;
				
				// paginate the model and get the resource
				return model
				.paginate(pagination, req)
				.view(qsp.view)
				.getResources(qsp.fetchOpts, qsp.jsonOpts)
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
			
			// non-paginated request
			else {
				
				// forge the model and attempt to search, order
				// and filter the results
				return model
				.href(qsp.href)
				.search(qsp.search)
				.order(qsp.order)
				.limit(qsp.limit)
				.offset(qsp.offset)
				.view(qsp.view)
				.getResources(qsp.fetchOpts, qsp.jsonOpts)
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
		};
	};
};