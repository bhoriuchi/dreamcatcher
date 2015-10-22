// dreamcatcher example
// Author: Branden Horiuchi <bhoriuchi@gmail.com>
//

var passport      = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var _             = require('lodash');


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
		basePath: '/api',
		versions: ['0.1.0', '0.1.1'],
		port: 8080,
		cors: {}
	}
};

// import modules, configurations and data
var dream     = require("../lib/dreamcatcher")(config);
//var schema    = require('./sample-schema')(dream);
var data      = require('./sample-data');
var factory   = dream.factory;


// register the pagination and middleware
dream.register.pagination('custom', require('./custom-paginate'));
dream.register.middleware(passport.initialize());
dream.register.set('passport', passport);
dream.register.event({
	event: 'logRequest',
	listener: function(message) {
		console.log(message);
	}
});
dream.register.event({
	type: 'once',
	event: 'logRequest',
	listener: function(message) {
		console.log('ONCE', message);
	}
});

passport.use(new BasicStrategy(function(username, password, done) {
	
	return dream.mods.knex('user').where('username', username).then(function(results) {
		if (results.length > 0 && results[0].hasOwnProperty('password')) {

			return done(null, dream.mods.passwordHash.verify(password, results[0].password));
		}
		return done(null, false);
	});
	
}));

// register authentication
dream.register.authentication({
	module: dream.registry.passport,
	authenticate: 'authenticate',
	arguments: ['basic', {session: false, failureFlash: false}]
});


// create multi version api
var schemas   = [];

// version 0.1.0
schemas.push({
	schema: require('./schema/v0.1.0')(dream),
	version: '0.1.0'
});
// version 0.1.1
schemas.push({
	schema: require('./schema/v0.1.1')(dream),
	version: '0.1.1'
});





// prepare the schema
var schema = dream.mergeSchema(schemas) || {};

//console.log(schema);

//drop the schema
factory.schemer.drop(schema).then(function() {
	
	// create a database
	return factory.schemer.sync(schema).then(function() {
		
		// load the data
		return factory.schemer.convertAndLoad(data, schema).then(function() {
			
			// get routes from the schema
			var routes = dream.getRoutes(schemas);
			
			routes.push(dream.staticRoute({
				path: /\/datatables\/?.*/,
				directory: __dirname + '/public',
				'default': 'index.html'
			}));
			

			// run the server
			dream.run(routes);
		});
	});
});










