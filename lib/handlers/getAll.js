// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: GET/HEAD All method handler
//


module.exports = function(config) {
	
	
	var PARAMS         = config.constants.params;
	var STATUS         = config.HttpStatus;
	var pagemaker      = config.pagemaker;
	var _              = config.lodash;
	var dotprune       = config.dotprune;
	
	
	// create a handle function
	var handle = function(models, tableName, opts) {
		
		
		return function (req, res, next) {
			
			// parse the query string
			var qsp = config.util.qsParse(req);


			// get the model
			var Model = models[tableName];
			
			
			// optional, obtain the uri for use with next/previous 
			var http_type = (req.connection.encrypted) ? 'https://' : 'http://';
			var baseURI = http_type + req.headers.host + req._url.pathname;
			
			
			// paginate is specified
			if (req.headers.hasOwnProperty('accept-pagination') &&
					req.headers['accept-pagination'] === 'datatables') {
				
				
				pagemaker.datatables.paginate({
					params: req.params,
					model: Model,
					relations: models._relations[tableName]
				})
				.then(function(results) {
					
					
					if (results !== null && results.hasOwnProperty('_code')) {
						var status = STATUS[_.findKey(STATUS, {code: results._code})];
						res.send(status.code, status);
					}
					else {
						
						
						results.data = dotprune.prune(results.data, Model.forge().view(qsp.view)._keep);
						res.send(results);
					}
				});
			}
			else if (req.headers.hasOwnProperty('accept-pagination') &&
					req.headers['accept-pagination'] === 'pagemaker') {
				
				
				pagemaker.pagemaker.paginate({
					params: req.params,
					model: Model,
					relations: models._relations[tableName],
					uri: baseURI
				})
				.then(function(results) {
					
					
					if (results !== null && results.hasOwnProperty('_code')) {
						var status = STATUS[_.findKey(STATUS, {code: results._code})];
						res.send(status.code, status);
					}
					else {
						
						
						results.results = dotprune.prune(
							results.results,
							Model.forge().view(qsp.view)._keep
						);
						res.send(results);
					}
				});
			}
			else if (req.headers.hasOwnProperty('accept-pagination') &&
					req.headers['accept-pagination'] === 'paginate' &&
					config.rest.paginate !== null &&
					typeof (config.rest.paginate) === 'object') {
				
				
				pagemaker.custom.paginate({
					params: req.params,
					model: Model,
					relations: models._relations[tableName],
					uri: baseURI,
					config: config.rest.paginate
				})
				.then(function(results) {
					
					
					if (results !== null && results.hasOwnProperty('_code')) {
						var status = STATUS[_.findKey(STATUS, {code: results._code})];
						res.send(status.code, status);
					}
					else {
						results[config.rest.paginate.data.field] = dotprune.prune(
							results[config.rest.paginate.data.field],
							Model.forge().view(qsp.view)._keep
						);
						res.send(results);
					}
				});
			}
			else {
			
				
				Model.forge().search(qsp.search).view(qsp.view)
				.getResources(qsp.fetchOpts).then(function(results) {
					
					
					if (results !== null && results.hasOwnProperty('_code')) {
						var status = STATUS[_.findKey(STATUS, {code: results._code})];
						res.send(status.code, status);
					}
					else {
						res.send(results);
					}
				});
			}
			
			next();

		};
	};
	
	
	// return public function
	return {
		handle: handle
	};
};