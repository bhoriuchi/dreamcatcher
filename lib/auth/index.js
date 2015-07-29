// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: authentication methods
//


module.exports = function(config) {

	
	// require each module and return it
	return {
		basic: require('./basic')(config),
		whitelist: require('./whitelist')(config),
		util: require('./util')(config)
	};
};