module.exports = {
		"style": {
			"type": "offset"
		},
		"data": {
			"show": true,
			"field": "records"
		},
		"pageSize": {
			"show": false,
			"field": "limit",
			"defaultValue": 10,
			"maximum": 1000,
			"param": "limit"
		},
		"offset": {
			"show": false,
			"field": "offset",
			"defaultValue": 0,
			"param": "offset"
		},
		"page": {
			"show": false,
			"field": "currentPage",
			"defaultValue": 1,
			"param": "page"
		},
		"pageCount": {
			"show": false,
			"field": "totalPages"
		},
		"count": {
			"show": true,
			"field": "totalRecords"
		},
		"filteredCount": {
			"show": true,
			"field": "totalFiltered"
		},
		"previous": {
			"show": true,
			"field": "previous"
		},
		"next": {
			"show": true,
			"field": "next"
		},
		"search": {
			"enabled": true,
			"param": "search",
			"regexParam": "regex",
			"complex": false
		},
		"order": {
			"enabled": true,
			"param": "sort",
			"defaultDirection": "asc",
			"complex": false
		},
		"complex": {
			"enabled": false,
			"param": "columns",
			"fieldName": "data",
			"searchable": "searchable",
			"orderable": "orderable",
			"search": {
				"key": "search",
				"value": "value",
				"regex": "regex"
			},
			"order": {
				"key": "order",
				"field": "column",
				"direction": "dir"
			}
		}
};