// v0.1.0 group model

module.exports = function (args) {
	
	return {
        id: {
            type: args.type.integer,
            primary: true,
            increments: true
        },
        name: {
            type: args.type.string,
            size: 100,
            views: ['summary']
        },
        _rest: args.rest
    };
};