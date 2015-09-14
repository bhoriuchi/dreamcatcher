// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: schema functions
//


module.exports = function(config) {
	
	var _ = config.lodash;
	
	// function to merge schemas into a single schema for creating a
	// database schema that will work for multiple versions of your API
	// the schema will be prepared
	function merge(schemas) {
		
		var master = {};
		
		// loop through each schema
		_.forEach(schemas, function(schemaObj) {

			// prepare the schema first
			var schema = config.factory.prepareSchema(schemaObj.schema);
			
			// loop through each table
			_.forEach(schema, function(tableSchema, table) {
				
				// create the table schema if it does not exist
				master[table] = master[table] || {};
				
				// loop through each column
				_.forEach(tableSchema, function(colSchema, col) {
					
					if (_.has(colSchema, 'type')) {
						
						// create the column schema if it does not exist
						if (_.has(master[table], col)) {
							
							// set the current value
							var cur = master[table][col];
	
							// only update if the types match and the objects are different
							if (cur.type === colSchema.type && !_.isEqual(cur, colSchema)) {
								
								// check string
								if (cur.type === 'string') {
									
									var size = Math.max(cur.size, colSchema.size);
									
									if (!isNaN(size)) {
										master[table][col].size = size;
									}
								}
								
								
								// check for nullable, if there is a non nullable column, then
								// the table has to be nullable to support previous rows that
								// were inserted with a null value
								if (cur.nullable === true || colSchema.nullable === true) {
									master[table][col].nullable = true;
								}
							}
						}
						else {
							master[table][col] = _.cloneDeep(colSchema);
						}
					}
				});
			});
		});	
		
		
		// check for tables with no rows and remove them
		_.forEach(_.cloneDeep(master), function(tableSchema, table) {
			if (_.keys(tableSchema).length === 0) {
				delete master[table];
			}
		});
		
		
		return master;
	}
	
	
	// return public functions
	return {
		merge: merge
	};
	
};