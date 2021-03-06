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
        _model: {name: 'survivor'},
        _rest: {
            methods: {
                HEAD: {
                    auth: dream.auth.whitelist
                },
                GET: {
                    auth: true //auth: dream.registry.passport.authenticate('basic', {session: false, failureFlash: false})
                },
                POST: {
                    auth: dream.auth.whitelist
                },
                PUT: {
                    auth: dream.auth.whitelist
                },
                DELETE: {
                    auth: dream.auth.whitelist
                }
            }
        }
	};
};