/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * @version 0.1.0
 * 
 */
module.exports = function(env) {
	
	var _ = env.lodash;
	
	function connect(config) {
		
		// set up variables for modules that can be passed in the config
		var knex, bookshelf, schemer, factory;
		
		
		// validate the configuration is an object
		if (typeof (config) !== 'object') {
			return null;
		}
		
		
		// check for knex instance
		if (_.has(config, 'knex')) {
			env.knex = config.knex;
		}
		
		
		// if no knex, check for bookshelf
		else if (_.has(config, 'bookshelf')) {
			env.knex = config.bookshelf.knex;
		}
		
		
		// if no knex or bookshelf, check for bookshelf-factory
		else if (_.has(config, 'factory')) {
			env.knex = config.factory.knex;
		}
		
		// check for a database config key
		else if (_.has(config, 'database')) {
			env.knex = require('knex')(config.database);
		}
		
		// if no bookshelf, check for a legacy config
		else if (_.has(config, 'client') && _.has(config, 'connection')) {
			var debug = _.has(config, 'debug') ? config.debug : false;
			env.knex = require('knex')({
				client: config.client,
				connection: config.connection,
				debug: debug
			});
		}
		
		// if no knex or bookshelf or db config, return null
		else {
			console.log('Error: Could not find knex, bookshelf, bookshelf-factory, or database config object');
			return false;
		}
		
		// set bookshelf, bookshelf-factory, and schemer instances
		env.bookshelf = config.bookshelf || require('bookshelf')(env.knex);
		env.factory   = config.factory   || require('bookshelf-factory')({
			bookshelf: env.bookshelf
		});
		env.schemer   = env.factory.schemer;
		
		return true;
	}
	
	return {
		connect: connect
	};
};