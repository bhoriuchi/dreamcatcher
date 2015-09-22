// v0.1.0 actor model

module.exports = function (dream) {
	
	return {
        id: {type: dream.schemer.constants.type.integer, primary: true, increments: true},
        name: {type: dream.schemer.constants.type.string, size: 200},
        character: {hasOne: 'survivor', nullable: true},
        notes: {
        	type: 'string',
        	versioned: true
        },
        _rest: {
        	//auth: false,//dream.registry.passport.authenticate('basic', {session: false, failureFlash: false}),
            methods: {
                HEAD: {},
                GET: {
                	//auth: true
                },
                POST: {
                    //auth: dream.registry.passport.authenticate('basic', {session: false, failureFlash: true}),
                    action: {
                    	test: function(req, res, next) {
                    		res.send({message: "test"});
                    		return next();
                    	}
                    }
                },
                PUT: {
                   // auth: dream.auth.whitelist
                },
                DELETE: {
                   // auth: dream.auth.whitelist
                }
            }
        }
	};
};