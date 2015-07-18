

# dreamcatcher
---
dreamcatcher is a tool that extends the [knex-schemer and bookshelf-factory schema definition](https://github.com/bhoriuchi/bookshelf-factory/wiki/Define-Schema) format to produce a rest web service using [restify](http://mcavage.me/node-restify/) to perform CRUD operations
on resources stored in a relational database. At its core, dreamcatcher uses bookshelf and knex to perform the actual database access, and bookshelf-factory to produce the models.

* See the **[WIKI](https://github.com/bhoriuchi/dreamcatcher/wiki)** for full documentation
* And the **[Change Log](https://github.com/bhoriuchi/dreamcatcher/wiki/Change-Log)** for what's new

# Install
---
```bash
npm install -g dreamcatcher
```

# Usage
---
```js
// create a database connection config
var config = {
	"client": "mysql",
	"connection": {
		"host": "127.0.0.1",
		"user": "db",
		"password": "password",
		"database": "test",
		"charset": "utf8"
	}
};

// require the package passing the config
var dream = require('dreamcatcher')(config);

```


# Basic Example
---
##### JavaScript
```js
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
	rest: {
		"port": 8081
	}
};

// require the package and pass the db connection config
var dream = require('dreamcatcher')(config);

// define a schema in schemer format that has been extended to use 
// bookshelf-factory and dreamcatcher field extensions
var schema = {
    survivor: {
        id: {type: type.integer, primary: true, increments: true, views: ['summary']},
        name: {type: type.string, size: 200, views: ['summary']},
        groups: {belongsToMany: 'group', views: ['summary']},
        station_id: {type: type.integer},
        station: {belongsTo: 'station', views: ['summary']},
        _rest: {
        	methods: {
				HEAD: {},
				GET: {},
				POST: {},
				PUT: {},
				DELETE: {}
			}
        }
    }
};

// create the routes
var routes = dream.getRoutes(schema);

// run the server
dream.run(routes);
```

This will create the routes and methods

* (HEAD, GET, POST) http://host.domain.com:8081/survivors
* (HEAD, GET, PUT, DELETE) http://host.domain.com:8081/survivors/:id




# Tools
---
Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.