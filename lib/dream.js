// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Creates a REST webservice for JSON defined models
//

var _            = require('lodash');
var Promise      = require('bluebird');
var restify      = require('restify');
var constants    = require('./static/constants');
var HttpStatus   = require('./static/HttpStatus');
var passwordHash = require('password-hash');
var dotprune     = require('dotprune');



module.exports = function(config) {
	

	
	
	
	// set up variables for modules that can be passed in the config
	var knex, bookshelf, schemer, factory, pagemaker;


	
	
	
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
	
	
	
	
	// set bookshelf and schemer instance
	bookshelf = config.bookshelf || require('bookshelf')(knex);
	pagemaker = config.pagemaker || require('bookshelf-pagemaker')(bookshelf);
	schemer   = config.schemer   || require('knex-schemer')(knex);
	factory   = config.factory   || require('bookshelf-factory')({
		bookshelf: bookshelf
	});


	

	
	// compile a list of modules
	var mods = {
			knex: knex,
			bookshelf: bookshelf,
			pagemaker: pagemaker,
			schemer: schemer,
			factory: factory,
			lodash: _,
			promise: Promise,
			restify: restify,
			passwordHash: passwordHash,
			constants: constants,
			rest: config.rest,
			HttpStatus: HttpStatus,
			dotprune: dotprune
	};
	
	
	
	
	
	// require the route and server builders
	var routes = require('./routes')(mods);
	var server = require('./server')(mods);

	// plugins
	var auth   = require('./auth')(mods);

	
	
	
	// return all the public functions and variables
	return {
		knex: knex,
		bookshelf: bookshelf,
		schemer: schemer,
		factory: factory,
		lodash: _,
		dotprune: dotprune,
		promise: Promise,
		restify: restify,
		passwordHash: passwordHash,
		constants: constants,
		HttpStatus: HttpStatus,
		getRoutes: routes.getRoutes,
		run: server.run,
		auth: auth
	};
};