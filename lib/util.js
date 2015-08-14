// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: helper functions
//

module.exports = function(config) {
	
	var PARAMS = config.constants.params;
	
	
	
	// get the view info from the request
	var getView = function(req) {
		if (req.params.hasOwnProperty(PARAMS.fields)) {
			return req.params[PARAMS.fields].split(',');
		}
		else if (req.params.hasOwnProperty(PARAMS.view)) {
			return req.params[PARAMS.view];
		}
		return null;
	};
	
	
	
	
	// return the public functions
	return {
		getView: getView
	};
	
};