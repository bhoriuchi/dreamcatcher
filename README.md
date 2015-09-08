
![dreamcatcher](https://github.com/bhoriuchi/dreamcatcher/blob/master/public/assets/images/dreamcatcher.png)
---
**dreamcatcher** is a tool that allows you to design, create, and serve a **REST** webservice using **JSON**. The tool uses **[bookshelf-factory](https://github.com/bhoriuchi/bookshelf-factory/wiki)** to create, update, and delete **relational database** entries and **[restify](http://mcavage.me/node-restify/)** to serve the webservice


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
var type  = dream.schemer.constants.type;

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