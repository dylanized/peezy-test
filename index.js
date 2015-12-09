// module setup

	var test = require("unit.js"),
		_ = require("underscore"),
		file = require("peezy-file-helper");

// setup mocha test
	
	// build test suite with array of tests or suites
		
		test.suite = function(desc, tests, data) {
		
			// if no description
			if (typeof desc == "object") {
				data = tests;
				tests = desc;
				desc = "Testing suite";
			}
		
			describe(desc, function() {
			
				// for each test
				for (var key in tests) {
				
					// if this is a nested suite
					if (tests[key].desc && tests[key].tests) test.suite(tests[key].desc, tests[key].tests, data);
				
					// else its a test
					else {
					
						// merge data
						if (data) _.extend(tests[key], data);

						// run before func						
						if (typeof tests[key].before == 'function') tests[key].before();
					
						// if http
						if (tests[key].host || tests[key].path) test.http(tests[key].desc, tests[key], tests[key].assert, tests[key].after);

						// if async
						else if (tests[key].assert.length > 0) {
						
							if (tests[key].after) test.async(tests[key].desc, tests[key].assert, tests[key].after);
							test.async(tests[key].desc, tests[key].assert);

						}
						
						// else sync
						else {
						
							if (tests[key].after) test.sync(tests[key].desc, tests[key].assert, tests[key].after);
							else test.sync(tests[key].desc, tests[key].assert);
							
						}
						
					}
				
				}
			
			});
			
			return this;
		
		}

	// run suite with single test
	
		test.single = function(label, desc, options, assert) {
	
			if (typeof options == "function") assert = options;
		
			describe(label, function() {
			
				// if http
				if (options.path || options.host) test.http(desc, options, assert);
				// if async
				else if (assert.length > 0) test.async(desc, assert);
				// else sync				
				else test.sync(desc, assert);
			
			});
			
			return this;
		
		}
	
	// sync test case
	
		test.sync = function(desc, assert, after) {
			
			it(desc, function() {
				assert();
			});
			
			if (after) after();

			return this;
		
		}

	// async test case
	
		test.async = function(desc, assert, after) {
		
			it(desc, function(done) {
				if (after) {
					function cb() {
						done();
						after();
					}
				}
				else cb = done;		
				assert(cb);				
			});		
			
			return this;			
		
		}
		
	// http tester
	
		/* example of options obj */
		var options_example = {
			host: "http://localhost:9000",
			path: "/api/path/",
			user: "email@domain.com",
			pass: "123456",
			headers: [
				{ "": "" }
			],
			status: 200,
			expect: [
				{ "Content-Type": /html/ }
			]
		};
	
		test.http = function(desc, options, assert, after) {
		
			it(desc, function(done) {
		
				var httpString = "test.httpAgent(options.host)";
				
				// defaults
				var verb = "get";
				var path = "/";
				var send;
				var status = 200;
				
				if (options.verb) verb = options.verb;
				if (options.path) path = options.path;
				if (options.send) send = options.send;
				if (options.status) status = options.status;
				
				// shortcuts								
				
				if (options.post) {
					verb = "post";
					send = options.post;
				}

				else if (options.put) {
					verb = "put";
					send = options.put;
				}
				
				else if (options.del) {
					verb = "delete";
					send = options.del;
				}			
				
				// verb and path
				httpString += "." + verb + "('" + path + "')";
				
				// auth
				if (options.user && options.pass) httpString += ".auth(options.user, options.pass)";
				
				// headers
				if (options.headers && options.headers.length > 0) {
					for (var key in options.headers) {
						httpString += ".set(options.set[" + key + "])";
					}
				}
				
				// send
				if (send) httpString += ".send(send)";
				
				// accept
				if (options.accept) httpString += ".set('Accept', options.accept)";		
				
				// status
				httpString += ".expect(status)";
				
				// type
				if (options.type) httpString += ".expect('Content-Type', options.type)";
		
				// body
				if (options.body) httpString += ".expect(options.body)";
				
				// expect
				if (options.expect && options.expect.length > 0) {
					for (var key in options.expect) {
						var obj = options.expect[key];
						var field = Object.keys(obj)[0];
						var val = obj[field];
						if (typeof val == "string") val = "'" + val + "'";
						httpString += ".expect('" + field + "', " + val + ")";
					}
				}
				
				// assert
				if (assert) httpString += ".expect(assert)";
				
				// determine cb				
				if (after) {
					function cb() {
						after();
						done();
					}
				}
				else cb = done;	
				
				// end
				httpString += ".end(cb);";
				
				// run httpString
				eval(httpString);				
			
			});
			
			return this;	
								
		}
		
	// helpers
	
		test.exists = function(filepath) {
			
			test.assert(file.exists(filepath));
			
			return this;
			
		}		

		test.doesNotExist = function(filepath) {
			
			test.assert(!file.exists(filepath));
			
			return this;
			
		}
		
		test.noExist = test.doesNotExist;
			
// module exports	
	
	module.exports = test;

