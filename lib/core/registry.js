// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: registry functions
//


module.exports = function(config) {
	
	var _ = config.lodash;
	
	return function(dream) {
		
		// function to add a value to the registry
		function set(name, value, subregistry) {
			
			if (name && value) {
				// check for a subregistry
				if (subregistry) {
					
					if (Array.isArray(dream.registry[subregistry])) {
						return;
					}
					else if (dream.registry[subregistry] &&
							typeof(dream.registry[subregistry]) === 'object') {
						dream.registry[subregistry][name] = value;
					}
					else {
						dream.registry[subregistry] = {};
						dream.registry[subregistry][name] = value;
					}
				}
				else {
					dream.registry[name] = value;
				}
			}
		}
		
		
		// function to remove something from the registry
		function remove(name, subregistry) {
			
			if (name) {
				// check for subregistry
				if (subregistry) {
					if (dream.registry[subregistry]) {
						delete dream.registry[subregistry][name];
					}
				}
				else {
					delete dream.registry[name];
				}
			}
		}
		
		
		// function to get an item from the registry
		function get(name, subregistry) {
			
			// check for subregistry
			if (subregistry) {
				if (dream.registry[subregistry] && dream.registry[subregistry][name]) {
					return dream.registry[subregistry][name];
				}
			}
			else if (dream.registry[name]) {
				return dream.registry[name];
			}
			
			return null;
		}
		
		
		// helper function for pagination
		function pagination(name, value) {
			
			if (name && value) {
				set(name, value, 'pagination');
			}
		}
		
		
		// function for middleware
		function middleware(value) {
			if (value) {
				dream.registry.middleware.push(value);
			}
		}
		
		// function for setting global authentication
		function authentication(auth) {
			if (typeof(auth) === 'function' || typeof(auth) === 'boolean' || _.has(auth, 'module')) {
				dream.registry.authentication = auth;
			}
		}
		
		
		// function for adding an event listener
		function event(e) {
			if (_.has(e, 'event') && _.has(e, 'listener') &&
					typeof(e.listener) === 'function' &&
					typeof(e.event) === 'string') {
				
				// default to on listener
				e.type = (e.type === 'on' || e.type === 'once') ? e.type : 'on';
				
				// add the listener to the registry
				dream.registry.events.push(e);
			}
			else {
				console.log('failed to push event to the registry');
			}
		}
		
		// add plugins. a plugin must be a function that takes 
		// dreamcatcher as its argument
		// and return an object containing a key named routes that contains
		// an array of routes. the plugin will be accessible
		// from the registry under the plugins key
		function plugin(name, p) {
			if (typeof(p) === 'function') {
				dream.registry.plugins[name] = p(dream);
				return dream.registry.plugins[name];
			}
			return null;
		}
		
		// return the functions
		return {
			set: set,
			get: get,
			event: event,
			remove: remove,
			plugin: plugin,
			middleware: middleware,
			pagination: pagination,
			authentication: authentication
		};
	};
};