// v0.1.0 group model

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
        _rest: {
            service: {
                path: '/lost'
            },
            methods: {
                HEAD: {
                    auth: dream.auth.basic
                },
                GET: {
                    auth: dream.auth.basic,
                    handler: function(req, res, next) {
                        res.send({"message": "this is an example of overriding the handler"});
                        next();
                    }
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