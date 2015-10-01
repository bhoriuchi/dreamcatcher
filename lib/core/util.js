// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: helper functions
//

module.exports = function(config) {
	
	// constants
	var PARAMS    = config.constants.params;
	var toBoolean = config.factory.utils.util.toBoolean;
	
	// modules
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
	
	
	// get the fetch opts
	function getFetchOpts(req) {
		if (_.has(req.params, PARAMS.fetchOpts) && _.keys(req.params.fetchOpts).length > 0) {
			return req.params.fetchOpts;
		}
		return {};
	}
	
	// get the json opts
	function getJsonOpts(req) {
		if (_.has(req.params, PARAMS.jsonOpts) && _.keys(req.params.jsonOpts).length > 0) {
			return req.params.jsonOpts;
		}
		return null;
	}
	
	// get the overrides
	function getOverride(req, fetchOpts) {
		if (_.has(req.params, PARAMS.override) && Array.isArray(req.params.override)) {
			fetchOpts.override = req.params.override;
		}
	}
	
	
	// function to get the max depth
	function getMaxDepth(req, fetchOpts) {
		if (_.has(req.params, PARAMS.maxdepth) && !isNaN(Number(req.params.maxdepth))) {
			fetchOpts.maxDepth = Math.round(Number(req.params.maxdepth));
		}
	}
	
	// function to get the version
	function getVersion(req, fetchOpts) {
		if (_.has(req.params, PARAMS.version) && req.params.version !== null) {
			fetchOpts.version = (req.params.version === '0') ? 0 : req.params.version;
		}
	}
	
	// function to get the force option
	function getForce(req, fetchOpts) {
		if (_.has(req.params, PARAMS.force)) {
			fetchOpts.force = toBoolean(req.params.force);
		}
	}
	
	
	// function to get a param
	function getParam(req, param) {
		
		if (_.has(req.params, param) && req.params[param]) {
			return req.params[param];
		}
		return null;
	}
	
	
	// function to parse the querystring params
	function qsParse(req) {
		
		var fetchOpts = getFetchOpts(req);
		var jsonOpts  = getJsonOpts(req);
		
		// create an object to hold the configs
		var qsp = {
			fetchOpts: fetchOpts,
			jsonOpts: jsonOpts
		};
		
		// get params
		qsp.search = getParam(req, PARAMS.search);
		qsp.order  = getParam(req, PARAMS.order);
		qsp.limit  = getParam(req, PARAMS.limit);
		qsp.offset = getParam(req, PARAMS.offset);
		qsp.action = getParam(req, PARAMS.action);
		
		// params that require some modification
		qsp.href   = getHref(req);
		qsp.view   = getView(req);
		
		// fetchOpts setters
		getMaxDepth(req, qsp.fetchOpts);
		getVersion(req, qsp.fetchOpts);
		getForce(req, qsp.fetchOpts);
		getOverride(req, qsp.fetchOpts);

		// return the query string parser
		return qsp;
	}
	
	
	
	// return the public functions
	return {
		qsParse: qsParse
	};
	
};