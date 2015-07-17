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

dream.run(routes);

