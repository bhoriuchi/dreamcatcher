// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: core functions
//


module.exports = function(config) {

	// create an empty object
	config.core = {};
	
	// import the utilities
	config.core.util       = require('./util')(config);
	
	// import the schema tool
	config.core.schema     = require('./schema')(config);
	
	// import the registry
	config.core.registry   = require('./registry')(config);
	
	// import authentication helper
	config.core.auth       = require('./auth')(config);
	
	// import handlebars helper
	config.core.handlebars = require('./handlebars')(config);
	
	// import the route
	config.core.route      = require('./route')(config);

	// import the server
	config.core.server     = require('./server')(config);
	
	// import the setup
	config.core.setup     = require('./setup')(config);
	
	// return the core
	return config.core;
	
};