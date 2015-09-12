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
		if (req.params.hasOwnProperty(PARAMS.search)) {
			return req.params.search;
		}
		return null;
	}
	
	
	// get the view info from the request
	function getView(req) {
		if (req.params.hasOwnProperty(PARAMS.fields)) {
			return req.params[PARAMS.fields].split(',');
		}
		else if (req.params.hasOwnProperty(PARAMS.view)) {
			return req.params[PARAMS.view];
		}
		return null;
	}
	
	// function to get the max depth
	function getMaxDepth(req, fetchOpts) {
		if (req.params.hasOwnProperty(PARAMS.maxdepth) && !isNaN(Number(req.params.maxdepth))) {
			fetchOpts.maxDepth = Math.round(Number(req.params.maxdepth));
		}
	}
	
	// function to get the version
	function getVersion(req, fetchOpts) {
		if (req.params.hasOwnProperty(PARAMS.version) && req.params.version !== '') {
			fetchOpts.version = req.params.version;
		}
	}
	
	
	// function to parse the querystring params
	function qsParse(req) {
		
		// create an object to hold the configs
		var qsp = {fetchOpts: {}};
		
		// get view options
		qsp.view = getView(req);
		
		// get search
		qsp.search = getSearch(req);
		
		// get href
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