// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: basic authentication example. this example assumes
//              that there is a table in the model database named user
//              that has a field named username and a field named password
//              that has a password that has been hashed using password-hash





module.exports = function(config) {
	
	
	var passwordHash = config.passwordHash;
	var knex         = config.knex;
	var Promise      = config.promise;
	
	// return the function
	return function(req) {
		
		var username, password;

		// check that all the basic properties exist and have valid values
		if (req.hasOwnProperty('authorization') &&
				req.authorization.hasOwnProperty('scheme') &&
				req.authorization.scheme === 'Basic' &&
				req.authorization.hasOwnProperty('basic') &&
				req.authorization.basic.hasOwnProperty('username') &&
				req.authorization.basic.hasOwnProperty('password') &&
				req.authorization.basic.username !== null &&
				req.authorization.basic.username !== '' &&
				req.authorization.basic.password !== null &&
				req.authorization.basic.password !== '') {
			
			var basic = req.authorization.basic;
			
			
			return knex('user').where('username', basic.username).then(function(results) {
				if (results.length > 0 && results[0].hasOwnProperty('password')) {

					return passwordHash.verify(basic.password, results[0].password);
				}
				return false;
			});
		}
		else {
			
			return new Promise(function(resolve) {
				resolve(false);
			});
		}
	};
};