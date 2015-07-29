module.exports = function(dream) {
	
	var c = dream.schemer.constants;
	
	var rest = {
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
	};
	
	
	
	return {
        survivor: {
            sid: {type: c.type.integer, primary: true, increments: true, views: ['summary']},
            name: {type: c.type.string, size: 100, views: ['summary']},
            groups: {belongsToMany: 'group'},
            notes: {type: c.type.string, size: 200, nullable: true, defaultTo: 'default notes'},
            _rest: rest
        },
        group: {
            id: {type: c.type.integer, primary: true, increments: true},
            name: {type: c.type.string, size: 100, views: ['summary']},
            station: {hasOne: 'station', nullable: true},
            _rest: rest
        },
        station: {
            id: {type: c.type.integer, primary: true, increments: true},
            name: {type: c.type.string, size: 100}
        },
        actor: {
            id: {type: c.type.integer, primary: true, increments: true},
            name: {type: c.type.string, size: 200},
            character: {hasOne: 'survivor', nullable: true},
            nicknames: {hasMany: 'nickname', nullable: true}
        },
        nickname: {
            id: {type: c.type.integer, primary: true, increments: true},
            name: {type: c.type.string, size: 200}
        },
        user: {
            id: {type: c.type.integer, primary: true, increments: true},
            name: {type: c.type.string, size: 200},
            username: {type: c.type.string, size: 200},
            password: {type: c.type.string, size: 500}
        },
        whitelist: {
            id: {type: c.type.integer, primary: true, increments: true},
            ipAddress: {type: c.type.string, size: 200},
            route: {type: c.type.string, size: 500},
            method: {type: c.type.string, size: 8}
        }
    };
};