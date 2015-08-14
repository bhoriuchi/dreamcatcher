module.exports = function(passport) {
	
	var BasicStrategy = require('passport-http').BasicStrategy;
	
	
	passport.use(new BasicStrategy());
	
	
	
};