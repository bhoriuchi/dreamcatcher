// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: registry functions
//


module.exports = function(config) {
	
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
			if (typeof(auth) === 'function' || typeof(auth) === 'boolean') {
				dream.registry.authentication = auth;
			}
		}
		
		
		// return the functions
		return {
			set: set,
			get: get,
			remove: remove,
			middleware: middleware,
			pagination: pagination,
			authentication: authentication
		};
	};
};