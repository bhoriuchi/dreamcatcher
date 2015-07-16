module.exports = function(c) {
	
	var auth = function() {
		return true;
	};
	var rest = {
		methods: {
			HEAD: {
				auth: auth
			},
			GET: {
				auth: auth
			},
			POST: {
				auth: auth
			},
			PUT: {
				auth: auth
			},
			DELETE: {
				auth: auth
			}
		}
	};
	
	
	
	return {
        survivor: {
            sid: {type: c.type.integer, primary: true, increments: true, views: ['summary']},
            name: {type: c.type.string, size: 100, views: ['summary']},
            groups: {belongsToMany: 'group', views: ['summary']},
            notes: {type: c.type.string, size: 200, nullable: true, defaultTo: 'default notes', views: ['summary']},
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
        }
    };
};