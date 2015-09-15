// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: handlers
//


module.exports = function(config) {

	
	// require each module and return it
	return {
		activate:   require('./activate')(config),
		deactivate: require('./deactivate')(config),
		getAll:     require('./getAll')(config),
		getId:      require('./getId')(config),
		post:       require('./post')(config),
		publish:    require('./publish')(config),
		put:        require('./put')(config),
		del:        require('./delete')(config),
		unpublish:  require('./unpublish')(config)
	};
};