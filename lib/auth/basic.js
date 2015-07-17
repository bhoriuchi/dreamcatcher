// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: basic authentication example. this example assumes
//              that there is a table in the model database named user
//              that has a field named username and a field named password
//              that has a password that has been hashed using password-hash


module.exports = function(config) {
	
	var passwordHash = config.passwordHash;
	var knex         = config.knex;
	
	// return the function
	return function(req) {
		
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
			
			
			console.log(req.authorization);
			return true;
			
		}
		else {
			return false;
		}
	};
};