// dreamcatcher example
// Author: Branden Horiuchi <bhoriuchi@gmail.com>
//





// create a dreamcatcher config
var config = {
	"client": "mysql",
	"connection": {
		"host": "127.0.0.1",
		"user": "db",
		"password": "password",
		"database": "test",
		"charset": "utf8"
	},
	debug: false,
	rest: {
		paginate: require('./custom-paginate'),
		basePath: 'api'
	}
};





// import modules, configurations and data
var dream     = require("../lib/dream")(config);
var schema    = require('./sample-schema')(dream);
var data      = require('./sample-data');
var factory   = dream.factory;




// prepare the schema
schema = factory.prepareSchema(schema) || {};





//drop the schema
factory.schemer.drop(schema).then(function() {
	
	
	// create a database
	return factory.schemer.sync(schema).then(function() {
		
		
		// load the data
		return factory.schemer.convertAndLoad(data, schema).then(function() {
			
			
			// get routes from the schema
			var routes = dream.getRoutes(schema);
			
			// add datatables static content to routes
			routes.push({
				method: "GET",
				path: /\/datatables\/?.*/,
				handler: dream.restify.serveStatic({
					directory: __dirname + '/public',
					'default': 'index.html'
				})
			});

			// run the server
			dream.run(routes);
		});
	});
});










