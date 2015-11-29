// module setup

	var test = require("unit.js"),
		_ = require("underscore");

// setup mocha test	

	// build test suite with array of tests or suites
		
		test.suite = function(desc, tests, data) {
		
			describe(desc, function() {
			
				var options;
			
				// for each test
				for (var key in tests) {
				
					// if this is a nested suite
					if (tests[key].desc && tests[key].tests) test.suite(tests[key].desc, tests[key].tests, data);
				
					// else its a test
					else {
						// if http
						if (tests[key].path) {
							options = _.extend(tests[key], data);
							test.http(options, tests[key].assert);
						}
						// if async
						else if (tests[key].assert.length > 0) test.async(tests[key].desc, tests[key].assert, data);
						// else sync
						else test.sync(tests[key].desc, tests[key].assert, data);
					}
				
				}
			
			});
		
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
		
		}
	
	// sync test case
	
		test.sync = function(desc, assert) {
			
			it(desc, function() {
				assert();
			});
		
		}

	// async test case
	
		test.async = function(desc, assert) {
		
			it(desc, function(done) {				
				assert(done);				
			});		
		
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
	
		test.http = function(desc, options, assert) {
		
			it(desc, function(done) {
		
				var httpString = "test.httpAgent(options.host)";
				
				// path
				if (!options.path) httpString += ".get('/')";
				else httpString += ".get(options.path)";
				
				// auth
				if (options.user && options.pass) httpString += ".auth(options.user, options.pass)";
				
				// headers
				if (options.headers && options.headers.length > 0) {
					for (var key in options.headers) {
						httpString += ".set(options.set[" + key + "])";
					}
				}
				
				// accept
				if (options.accept) httpString += ".set('Accept', options.accept)";		
				
				// status
				if (options.status) httpString += ".expect(options.status)";
				else httpString += ".expect(200)";
				
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
				
				// end
				httpString += ".end(done);";
				
				// run httpString
				eval(httpString);				
			
			});	
								
		}		
	
// module exports	
	
	module.exports = test;

