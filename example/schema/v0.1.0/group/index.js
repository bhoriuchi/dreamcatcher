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
                HEAD: {},
                GET: {
                    handler: {
                    	useDefaults: true,
                    	routes: [
                    	    {
                    	    	route: '/:id/execute/',
                    	    	auth: true,
                    	    	handler: function(req, res, next) {
                    	    		res.send({message: 'execute a new instance'});
                    	    		return next();
                    	    	}
                    	    }
                    	]
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