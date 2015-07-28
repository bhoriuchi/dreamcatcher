// v0.1.0 survivor model

module.exports = function (dream) {
	
	return {
        sid: {
            type: dream.schemer.constants.type.integer,
            primary: true,
            increments: true,
            views: ['summary']
        },
        name: {
            type: dream.schemer.constants.type.string,
            size: 100,
            views: ['summary']
        },
        groups: {
            belongsToMany: 'group'
        },
        notes: {
            type: dream.schemer.constants.type.string,
            size: 200,
            nullable: true,
            defaultTo: 'default notes'
        },
        _rest: {
            methods: {
                HEAD: {
                    auth: dream.auth.basic
                },
                GET: {
                    auth: dream.auth.basic
                },
                POST: {
                    auth: dream.auth.basic
                },
                PUT: {
                    auth: dream.auth.basic
                },
                DELETE: {
                    auth: dream.auth.basic
                }
            }
        }
	};
};