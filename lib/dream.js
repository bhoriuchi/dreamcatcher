/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(config) {

	
	// external modules
	var _             = require('lodash');
	var EventEmitter  = require('events').EventEmitter;
	var promise       = require('bluebird');
	var fs            = require('fs');

	
	// promise options
	promise.promisifyAll(fs);
	promise.longStackTraces();
	
	
	// compile and environment object
	var env = {
		config        : config,
		rest          : config.rest,
		lodash        : _,
		fs            : fs,
		promise       : promise,
		emitter       : new EventEmitter(),
		restify       : require('restify'),
		passwordHash  : require('password-hash'),
		handlebars    : require('handlebars'),
		dotprune      : require('dotprune'),
		path          : require('path'),
		io            : require('socket.io'),
		constants     : require('./static/constants'),
		HttpStatus    : require('./static/HttpStatus')
	};
	
	
	// import utilities
	env.utils         = require('./utils')(env);
	
	
	// attempt to connect
	if (!env.utils.connect.connect(config)) {
		return null;
	}

	
	// check for a rest configuration
	if (!_.has(config, 'rest')) {
		config.rest = {
			pluralize: true
		};
	}
	

	// create the registry which is used by users to
	// provide custom settings and middle-ware
	env.registry = {
		schema         : {},
		pagination     : {
			paged      : env.factory.statics.paginations.paged,
			offset     : env.factory.statics.paginations.offset,
			datatables : env.factory.statics.paginations.datatables
		},
		plugins        : {},
		middleware     : [],
		events         : [],
		sockets        : [],
		authentication: function (req, res, next) {
			return next();
		}
	};


	// import local modules
	env.handlers      = require('./handlers')(env);
	env.core          = require('./core')(env);
	env.auth          = require('./auth')(env);
	

	// create an object that will be returned
	var dream = {
		type          : 'dream',
		version       : '0.0.1',
		config        : config,
		route         : env.core.route,
		getRoutes     : env.core.route.getRoutes,
		staticRoute   : env.core.route.staticRoute,
		hbsRoute      : env.core.route.hbsRoute,
		run           : env.core.server.run,
		mergeSchema   : env.core.schema.merge,
		utils         : env.utils,
		auth          : env.auth,
		core          : env.core,
		registry      : env.registry,
		schemer       : env.schemer,
		factory       : env.factory,
		restify       : env.restify,
		emitter       : env.emitter,
		io            : env.io,
		mods          : env,
		env           : env
	};
	

	// add the registry module last since it needs to be passed
	// the dream object
	dream.register = env.core.registry(dream);
	env.dream      = dream;
	
	
	// return the dream object
	return dream;
};