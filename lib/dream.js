// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Creates a REST webservice for JSON defined models
//

var _        = require('lodash');
var Promise  = require('bluebird');
var restify  = require('restify');



module.exports = function(config) {
	
	
	// set up variables for modules that can be passed in the config
	var knex, bookshelf, schemer, factory, models;

	
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
		knex = require('knex')(config);
	}
	
	// if no knex or bookshelf or db config, return null
	else {
		console.log('Error: Could not find knex, bookshelf, bookshelf-factory, or database config object');
		return null;
	}
	
	
	// set bookshelf and schemer instance
	bookshelf = config.bookshelf || require('bookshelf')(knex);
	schemer   = config.schemer   || require('knex-schemer')(knex);
	factory   = config.factory   || require('bookshelf-factory')({
		bookshelf: bookshelf
	});
	
	
	var CONST  = require("./static/constants");
	var METHOD = CONST.methods;
	var FIELD  = CONST.fields;
	
	
	// compile a list of modules
	var mods = {
			bookshelf: bookshelf,
			schemer: schemer,
			factory: factory,
			lodash: _,
			promise: Promise,
			restify: restify,
			constants: CONST
	};
	
	
	// function to build the routes
	function getRoutes(schema) {
		
		var routes = [];
		
		// prepare the schema
		schema = factory.prepareSchema(schema) || {};
		
		// create the models
		models = factory.create(schema);
		
		
		// loop through the schema and get the routes
		_.forEach(schema, function(tableSchema, tableName) {
			if (tableSchema.hasOwnProperty(FIELD.rest)) {
				
				if (tableSchema._rest.hasOwnProperty(FIELD.methods)) {
					_.forEach(tableSchema[FIELD.rest][FIELD.methods], function(opts, method) {
						
						var route = {
							model: tableName,
							method: method
						};
						
						// get method
						if (method === METHOD.GET) {
							
							var getAll = _.merge({
								path: '/' + tableName + 's/',
								handler: function(req, res, next) {

									
									if (opts.hasOwnProperty(FIELD.auth) && !opts.auth(req)) {
										res.send({_code: 401, message: 'unauthorized'});
										next();
									}
									else {
										models[tableName].forge().getResources().then(function(results) {
											res.send(results);
											next();
										});
									}
								}
							}, route);
							var getId  = _.merge({
								path: '/' + tableName + 's/:id',
								handler: function(req, res, next) {
									
									models[tableName].forge().getResource(req.params.id).then(function(results) {
										res.send(results);
										next();
									});
								}
							}, route);
							
							routes.push(getAll);
							routes.push(getId);
						}
					});
				}
			}
		});
		
		return routes;
	}
	
	
	// function to start the server
	function run(routes) {
		
		var server = restify.createServer();
		server.use(restify.acceptParser(server.acceptable));
		server.use(restify.authorizationParser());
		server.use(restify.queryParser());
		server.use(restify.bodyParser());
		
		_.forEach(routes, function(route) {
			
			if (route.method === METHOD.GET) {
				server.get(route.path, route.handler);
			}
		});
		
		
		server.listen(8080, function() {
			console.log('Server started');
		});
	}
	
	
	
	return {
		bookshelf: bookshelf,
		schemer: schemer,
		factory: factory,
		lodash: _,
		promise: Promise,
		restify: restify,
		constants: CONST,
		getRoutes: getRoutes,
		run: run
	};
	
};