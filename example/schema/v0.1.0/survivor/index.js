// v0.1.0 survivor model

module.exports = function (args) {
	
	return {
        sid: {
            type: args.type.integer,
            primary: true,
            increments: true,
            views: ['summary']
        },
        name: {
            type: args.type.string,
            size: 100,
            views: ['summary']
        },
        groups: {
            belongsToMany: 'group'
        },
        notes: {
            type: args.type.string,
            size: 200,
            nullable: true,
            defaultTo: 'default notes'
        },
        _rest: args.rest
	};
};