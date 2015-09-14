// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: core functions
//


module.exports = function(config) {

	// create an empty object
	config.core = {};
	
	// import the utilities
	config.core.util     = require('./util')(config);
	
	// import the schema tool
	config.core.schema   = require('./schema')(config);
	
	// import the registry
	config.core.registry = require('./registry')(config);
	
	// import the routes
	config.core.routes   = require('./routes')(config);

	// import the server
	config.core.server   = require('./server')(config);
	
	// return the core
	return config.core;
	
};