// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: handlers
//


module.exports = function(config) {

	
	// require each module and return it
	return {
		auth: require('./auth')(config),
		getAll: require('./getAll')(config),
		getId: require('./getId')(config),
		post: require('./post')(config),
		put: require('./put')(config),
		del: require('./delete')(config)
	};
};