// Author: Branden Horiuchi <bhoriuchi@gmail.com>
//
module.exports = function(config) {
	
	var _          = config.lodash;
	var fs         = config.fs;
	var Handlebars = config.handlebars;
	
	function hbsHandler(args) {
		// look for required args
		if (!_.has(args, 'path') || !_.has(args, 'template')) {
			return null;
		}
		
		// set optional args
		args.encoding = args.encoding || 'utf8';
		args.live     = (args.live === true) ? true : false;
		args.context  = args.context || {};
		
		// return 
		var send = function(req, res, next, compiler, context) {
			res.end(compiler(context));
			return next();
		};
		
		// return the appropriate handler
		if (args.live) {
			return function(req, res, next) {
				fs.readFileAsync(args.template, args.encoding).then(function(content) {
					send(req, res, next, Handlebars.compile(content), args.context);
				});
			};
		}
		else {
			var content  = fs.readFileSync(args.template, args.encoding);
			var compiler = Handlebars.compile(content);
			
			return function(req, res, next) {
				send(req, res, next, compiler, args.context);
			};	
		}
	}
	
	
	return {
		hbsHandler: hbsHandler
	};	
};