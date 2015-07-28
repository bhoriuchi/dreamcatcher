// v0.1.1 group model

module.exports = function (dream) {
	
	return {
        id: {
            type: dream.schemer.constants.type.integer,
            primary: true,
            increments: true
        },
        name: {
            type: dream.schemer.constants.type.string,
            size: 100,
            views: ['summary']
        },
        station: {
            hasOne: 'station',
            nullable: true
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