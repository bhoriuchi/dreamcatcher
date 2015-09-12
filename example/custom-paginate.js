/*
 * Basic Paged Pagination
 */
var paged = {
	usePages: true,
	input: {
		search: {
			param: 'search',
			fields: {
				value: 'value',
				regex: 'regex'
			}
		},
		order: {
			param: 'order',
			defaultDirection: 'asc',
			fields: {
				column: 'column',
				direction: 'dir'
			}
		},
		columns: {
			param: 'columns',
			fields: {
				data: 'data',
				name: 'name',
				searchable: 'searchable',
				orderable: 'orderable'
			}
		}
	},
	fields: {
		length: {
			show: true,
			displayName: 'recordsPerPage',
			param: 'limit',
			defaultValue: 10,
			maximum: 50,
			displayOrder: 3
		},
		data: {
			show: true,
			displayName: 'records',
			displayOrder: 6
		},
		pagesTotal: {
			show: true,
			displayName: 'pagesTotal',
			displayOrder: 4
		},
		pagesFiltered: {
			show: true,
			displayName: 'pagesFiltered',
			displayOrder: 5
		},
		currentPage: {
			show: true,
			displayName: 'currentPage',
			param: 'page',
			defaultValue: 1,
			displayOrder: 1
		},
		previous: {
			show: true,
			displayName: 'previousPage',
			displayOrder: 0
		},
		next: {
			show: true,
			displayName: 'nextPage',
			displayOrder: 2
		}
	}
};

module.exports = paged;