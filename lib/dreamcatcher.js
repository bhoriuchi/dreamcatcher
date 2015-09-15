// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Creates a REST WebService for JSON defined models
//


// import modules
var _            = require('lodash');
var promise      = require('bluebird');
promise.longStackTraces();
var restify      = require('restify');
var constants    = require('./static/constants');
var HttpStatus   = require('./static/HttpStatus');
var passwordHash = require('password-hash');
var dotprune     = require('dotprune');


module.exports = function(config) {

	
	// set up variables for modules that can be passed in the config
	var knex, bookshelf, schemer, factory;
	
	
	// validate the configuration is an object
	if (typeof (config) !== 'object') {
		return null;
	}
	
	
	// check for knex instance
	if (config.hasOwnProperty('knex')) {
		knex = config.knex;
	}
	
	
	// if no knex, check for bookshelf
	else if (config.hasOwnProperty('bookshelf')) {
		knex = config.bookshelf.knex;
	}
	
	
	// if no knex or bookshelf, check for bookshelf-factory
	else if (config.hasOwnProperty('factory')) {
		knex = config.factory.knex;
	}
	
	
	// if no bookshelf, check for a db config
	else if (config.hasOwnProperty('client') && config.hasOwnProperty('connection')) {
		var debug = config.hasOwnProperty('debug') ? config.debug : false;
		knex = require('knex')({
			client: config.client,
			connection: config.connection,
			debug: debug
		});
	}
	
	
	// if no knex or bookshelf or db config, return null
	else {
		console.log('Error: Could not find knex, bookshelf, bookshelf-factory, or database config object');
		return null;
	}
	
	
	// check for a rest config
	if (!config.hasOwnProperty('rest')) {
		config.rest = {
			pluralize: true
		};
	}
	

	// set bookshelf, bookshelf-factory, and schemer instances
	bookshelf = config.bookshelf || require('bookshelf')(knex);
	schemer   = config.schemer   || require('knex-schemer')(knex);
	factory   = config.factory   || require('bookshelf-factory')({
		bookshelf: bookshelf
	});

	
	// create the registry which is used by users to
	// provide custom settings and middleware
	var registry = {
		pagination: {
			paged: factory.statics.paginations.paged,
			offset: factory.statics.paginations.offset,
			datatables: factory.statics.paginations.datatables
		},
		middleware: [],
		authentication: {}
	};

	
	// compile a list of modules
	var mods = {
		config: config,
		registry: registry,
		knex: knex,
		bookshelf: bookshelf,
		schemer: schemer,
		factory: factory,
		lodash: _,
		promise: promise,
		restify: restify,
		passwordHash: passwordHash,
		constants: constants,
		rest: config.rest,
		HttpStatus: HttpStatus,
		dotprune: dotprune
	};
	
	
	// import the core modules
	mods.core    = require('./core')(mods);
	
	
	// import simple built in authentication modules
	mods.auth    = require('./auth')(mods);
	

	// create an object that will be returned
	var dreamcatcher = {
		registry: 	 registry,
		getRoutes: 	 mods.core.routes.getRoutes,
		run: 		 mods.core.server.run,
		mergeSchema: mods.core.schema.merge,
		auth: 		 mods.auth,
		core: 		 mods.core,
		schemer: 	 mods.schemer,
		factory: 	 mods.factory,
		restify: 	 mods.restify,
		mods: 		 mods
	};
	

	// add the registry module last since it needs to be passed
	// the dream object
	dreamcatcher.register = mods.core.registry(dreamcatcher);
	
	
	// return the dream object
	return dreamcatcher;
};