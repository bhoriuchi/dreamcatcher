// v0.1.0 models

module.exports = function(args) {
	return {
		group: require('./group')(args),
		survivor: require('./survivor')(args)
	};
};
