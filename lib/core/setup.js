/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var _         = env.lodash;
	var factory   = env.factory;
	var promise   = env.promise;
	var compile   = env.core.schema.compileSchema;
	
	function install(schemas, data, version) {
		
		var timestamp;
		var setups = [];
		
		data    = data    || {};
		version = version || '0.0.1';
		
		// check for a single schema passed
		if (!schemas) {
			schemas = [];
		}
		else if (!Array.isArray(schemas) && typeof(schemas) === 'object') {
			schemas = [
                {
                    schema: schemas,
                    version: version
                }
			];
		}
		
		// compile the schemas
		schemas = compile(schemas);
		
		// compile the data and setups
		_.forEach(env.registry.plugins, function(plugin) {
			plugin.data = plugin.data || {};
			_.merge(data, plugin.data);
			
			if (Array.isArray(plugin.setups)) {
				_.forEach(plugin.setups, function(setup) {
					setups.push(setup);
				});
			}
		});
		
		var schema = _.findWhere(schemas, {version: version});
		schema     = factory.prepareSchema(schema.schema) || {};
		
		// create a transaction
		return factory.knex.transaction(function(trx) {
			
			// create the tables
			return factory.schemer.drop(schema, trx).then(function() {
				
				timestamp = new Date(Date.now()).toISOString();
				console.log(timestamp, ': INSTALL - Dropped Tables');
				
				// create a database
				return factory.schemer.sync(schema, trx).then(function() {
					
					timestamp = new Date(Date.now()).toISOString();
					console.log(timestamp, ': INSTALL - Created Tables');
					
					return factory.schemer.convertAndLoad(data, schema, trx).then(function() {
						
						timestamp = new Date(Date.now()).toISOString();
						console.log(timestamp, ': INSTALL - Loaded Data');
						
						return promise.each(setups, function(setup) {
							return setup().then(function() {
								timestamp = new Date(Date.now()).toISOString();
								console.log(timestamp, ': INSTALL - Setup ' + setup.name);
							});
						});
					});
				});
			});
		});
	}
	
	
	return {
		install: install
	};
};