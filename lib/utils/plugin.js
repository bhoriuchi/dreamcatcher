/**
 * Plugin functions
 * @name plugin
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * 
 */
module.exports = function(env) {
	
	// modules
	var _ = env.lodash;
	
	/**
	 * Extend a schema object
	 * @param {Object} model - Model to extend.
	 * @param {Object} extending - Model that is extending.
	 * @returns {Object} Extended model. 
	 */
	function extend(model, extending) {
		return _.merge(_.cloneDeep(model), _.cloneDeep(extending));
	}

	
	/**
	 * adds a route to the
	 */
	function addModel(opts) {
		
		
		// validate input
		if (!opts.models || typeof(opts.models) !== 'object' ||
			!opts.name   || typeof(opts.name)   !== 'string' ||
			!opts.model  || typeof(opts.model)  !== 'object' ||
			!opts.env    || typeof(opts.env) !== 'object') {
			return null;
		}
		
		// get the service. if it does not exist, set one
		var service    = opts.env.service || 'plugin';
		var modelName  = [service, opts.name].join('_');
		opts.env.service = service;
		
		// extend the model if necessary
		opts.model = (opts.ext && typeof(opts.ext) === 'object') ?
				     extend(opts.ext, opts.model) : opts.model;

		// set up the rest service path
		opts.model._rest              = opts.model._rest         || {};
		opts.model._rest.service      = opts.model._rest.service || {};
		opts.model._rest.service.path = service;
		
		// add the route
		opts.models[modelName] = opts.model;
		
		// return the model object
		return opts.models;
	}
	
	return {
		extend   : extend,
		addModel : addModel
	};
};