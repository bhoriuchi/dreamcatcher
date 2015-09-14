// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: helper functions
//

module.exports = function(config) {
	
	var PARAMS = config.constants.params;
	
	var _ = config.lodash;
	
	// function to get the href
	function getHref(req) {
		
		// check for fields required to get the base uri
		if (_.has(req, 'headers.host') && _.has(req, 'connection')) {

			var protocol = req.connection.encrypted ? 'https://' : 'http://';
			return protocol + req.headers.host;
		}
		return null;
	}
	
	
	// function to get search
	function getSearch(req) {
		if (_.has(req.params, PARAMS.search)) {
			return req.params.search;
		}
		return null;
	}
	
	
	// get the view info from the request
	function getView(req) {
		if (_.has(req.params, PARAMS.fields)) {
			return req.params[PARAMS.fields].split(',');
		}
		else if (_.has(req.params, PARAMS.view)) {
			return req.params[PARAMS.view];
		}
		return null;
	}
	
	// function to get the max depth
	function getMaxDepth(req, fetchOpts) {
		if (_.has(req.params, PARAMS.maxdepth) && !isNaN(Number(req.params.maxdepth))) {
			fetchOpts.maxDepth = Math.round(Number(req.params.maxdepth));
		}
	}
	
	// function to get the version
	function getVersion(req, fetchOpts) {
		if (_.has(req.params, PARAMS.version) && req.params.version !== '') {
			fetchOpts.version = req.params.version;
		}
	}
	
	// function to get the order
	function getOrder(req) {
		if (_.has(req.params, PARAMS.order) && req.params.order !== '') {
			return req.params.order;
		}
	}
	
	// function to get the limit
	function getLimit(req) {
		if (_.has(req.params, PARAMS.limit) && req.params.limit !== '') {
			return req.params.limit;
		}
	}
	
	// function to get the offset
	function getOffset(req) {
		if (_.has(req.params, PARAMS.offset) && req.params.offset !== '') {
			return req.params.offset;
		}
	}
	
	
	// function to parse the querystring params
	function qsParse(req) {
		
		// create an object to hold the configs
		var qsp = {fetchOpts: {}};
		
		// get options
		qsp.view = getView(req);
		qsp.search = getSearch(req);
		qsp.order  = getOrder(req);
		qsp.limit  = getLimit(req);
		qsp.offset = getOffset(req);
		qsp.href   = getHref(req);
		
		// get maxDepth
		getMaxDepth(req, qsp.fetchOpts);
		
		// get the version
		getVersion(req, qsp.fetchOpts);

		return qsp;
	}
	
	
	
	// return the public functions
	return {
		getView: getView,
		qsParse: qsParse
	};
	
};