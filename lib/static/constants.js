// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Helper functions
//


module.exports = {
	fields: {
		rest:       '_rest',
		methods:    'methods',
		auth:       'auth',
		pluralize:  'pluralize',
		postUpdate: 'postUpdate',
		port:       'port',
		server:     'server'
	},
	methods: {
		GET:        'GET',
		HEAD:       'HEAD',
		POST:       'POST',
		PUT:        'PUT',
		DELETE:     'DELETE'
	},
	params: {
		action:     'action',
		fields:     'fields',
		force:      'force',
		limit:      'limit',
		maxdepth:   'maxdepth',
		offset:     'offset',
		order:      'order',
		search:     'search',
		version:    'version',
		view:       'view'

	},
	headers: {
		accept: {
			pagination: 'accept-pagination'
		}
	}
};