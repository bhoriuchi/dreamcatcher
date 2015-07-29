// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: whitelist authentication example. this example assumes
//              that there is a table in the model database named whitelist
//              that has a field named ipAddress that has a list of allowed ip
//              addresses. for granular control a route and method field can
//              be added to the whitelist table


module.exports = function(config) {
	

	var knex  = config.knex;

	
	// return the function
	return function(req) {

		
		// get the ip address from the request
		var ip = req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;
		
		
		return knex('whitelist').where('ipAddress', ip).then(function(results) {
			if (results.length > 0) {
				
				
				// check for path and method fields. if there are none it means that the access
				// control is not granular and any ipAddress in the whitelist gets full access
				if (!results[0].hasOwnProperty('route') || !results[0].hasOwnProperty('method')) {
					return true;
				}
				
				
				// otherwise access is granular so find a matching route/method
				for(var i = 0; i < results.length; i++) {
					
					
					// set up variables
					var result = results[i];
					var routeRx, methodRx;
					
					
					// get route path regex
					if (result.route === '*') {
						routeRx = /.*/;
					}
					else {
						routeRx = new RegExp(result.route);
					}
					
					
					// get route method regex
					if (result.method === '*') {
						methodRx = /.*/;
					}
					else {
						methodRx = new RegExp(result.method);
					}

					
					// check if the route and method match
					if (req.route.path.match(routeRx) !== null &&
							req.route.method.match(methodRx) !== null) {
						return true;
					}
				}
			}
			return false;
		});
	};
};