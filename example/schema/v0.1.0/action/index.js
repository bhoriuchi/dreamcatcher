// v0.1.0 action model that only provides a service

module.exports = function (dream) {
	
	return {
        _rest: {
            pluralize: false,
            service: {
                path: '/actions'
            },
            methods: {
                GET: {
                    auth: dream.auth.basic,
                    handler: function(req, res, next) {
                        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
                        console.log(ip);
                        res.send({"message": "this would produce an action without creating a data model"});
                        next();
                    }
                }
            }
        }
    };
};