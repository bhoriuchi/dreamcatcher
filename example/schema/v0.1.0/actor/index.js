// v0.1.0 actor model

module.exports = function (dream) {
	
	return {
        id: {type: dream.schemer.constants.type.integer, primary: true, increments: true},
        name: {type: dream.schemer.constants.type.string, size: 200},
        character: {hasOne: 'survivor', nullable: true},
        _rest: {
            methods: {
                HEAD: {
                    auth: dream.auth.whitelist
                },
                GET: {
                    auth: dream.registry.passport.authenticate('basic', {session: false, failureFlash: false})
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