// v0.1.0 whitelist model

module.exports = function (dream) {
	
	return {
        id: {
            type: dream.schemer.constants.type.integer,
            primary: true,
            increments: true
        },
        ipAddress: {
            type: dream.schemer.constants.type.string,
            size: 200,
            views: ['summary']
        },
        route: {
            type: dream.schemer.constants.type.string,
            size: 500,
        },
        method: {
            type: dream.schemer.constants.type.string,
            size: 8
        },
        _rest: {
            pluralize: false,
            methods: {
                HEAD: {
                    auth: dream.auth.whitelist
                },
                GET: {
                    auth: dream.auth.whitelist
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