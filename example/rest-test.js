// create a database connection config
var config = {
	"client": "mysql",
	"connection": {
		"host": "127.0.0.1",
		"user": "db",
		"password": "password",
		"database": "test",
		"charset": "utf8"
	},
	debug: false
};

var dream  = require("../lib/dream")(config);
var schema = require('./sample-schema')(dream);


var routes = dream.getRoutes(schema);


// add datatables static content

routes.push({
	method: "GET",
	path: "\/public\/test.txt",
	handler: function() {
		console.log('static add-in');
		dream.restify.serveStatic({
			directory: './'
		});
		
	}
});


dream.run(routes);

