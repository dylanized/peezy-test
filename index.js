// module setup

	var test = require("unit.js"),
		_ = require("lodash");

// setup mocha test
	
	// build test suite with array of tests or suites
		
		test.suite = function(label, tests, options) {
		
			// if no description
			if (typeof label == "object") {
				label = tests;
				tests = label;
				label = "Testing suite";
			}
		
			describe(label, function() {
			
				// .beforeAll and .afterAll					
				if (options && typeof options.beforeAll == 'function') before(options.beforeAll);
				if (options && typeof options.afterAll == 'function') after(options.afterAll);			

				// .beforeEach and .afterEach						
				if (options && typeof options.beforeEach == 'function') beforeEach(options.beforeEach);
				if (options && typeof options.afterEach == 'function') afterEach(options.afterEach);		
			
				// for each test
				for (var key in tests) {
				
					// if this is a nested suite
					if (tests[key].label && tests[key].tests) test.suite(tests[key].label, tests[key].tests, options);
				
					// else its a test
					else {
					
						// merge options
						if (options) _.extend(tests[key], options);
						
						// if pending test case
						if (tests[key].pending || tests[key].skip) it(tests[key].label);

						// else execute test case						
						else {
					
							// if http
							if (tests[key].host || tests[key].path) test.http(tests[key]);
	
							// if async
							else if (tests[key].assert.length > 0) test.async(tests[key]);
							
							// else sync
							else test.sync(tests[key]);
							
						}
						
					}
				
				}
			
			});
			
			return this;
		
		}

	// sync test case
	
		test.sync = function(testObj) {
		
			it(testObj.label, function() {
				
				// before
				if (testObj.before) testObj.before();
						
				// assert					
				if (testObj.assert) testObj.assert();
				
				// finish
				if (testObj.after) testObj.after();				
				
			});

			return this;
		
		}

	// async test case
	
		test.async = function(testObj) {

			it(testObj.label, function(done) {
		
				// before
				if (testObj.before) testObj.before();
				
				// set finish
				if (testObj.after) {
				
					function finish() {
						testObj.after();
						done();
					}
				
				} else finish = done;
						
				// assert and finish			
				if (testObj.assert) testObj.assert(finish);
				else finish();
				
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
	
		test.http = function(testObj) {
		
			it(testObj.label, function(done) {
			
				// before
		
					if (testObj.before) testObj.before();
					
				// set finish
				
					if (testObj.after) {
					
						function finish() {
							testObj.after();
							done();
						}
					
					} else finish = done;					
		    
		    	// build http eval
			    	
					var httpString = "test.httpAgent(testObj.host)";
					
					// defaults
					var verb = "get";
					var path = "/";
					var send;
					var status = 200;
					
					if (testObj.verb) verb = testObj.verb;
					if (testObj.path) path = testObj.path;
					if (testObj.send) send = testObj.send;
					if (testObj.status) status = testObj.status;
					
					// shortcuts								
					
					if (testObj.post) {
						verb = "post";
						send = testObj.post;
					}
	
					else if (testObj.put) {
						verb = "put";
						send = testObj.put;
					}
					
					else if (testObj.del) {
						verb = "delete";
						send = testObj.del;
					}			
					
					// verb and path
					httpString += "." + verb + "('" + path + "')";
					
					// auth
					if (testObj.user && testObj.pass) httpString += ".auth(testObj.user, testObj.pass)";
					
					// headers
					if (testObj.headers && testObj.headers.length > 0) {
						for (var key in testObj.headers) {
							httpString += ".set(testObj.set[" + key + "])";
						}
					}
					
					// send
					if (send) httpString += ".send(send)";
					
					// accept
					if (testObj.accept) httpString += ".set('Accept', testObj.accept)";		
					
					// status
					httpString += ".expect(status)";
					
					// type
					if (testObj.type) httpString += ".expect('Content-Type', testObj.type)";
			
					// body
					if (testObj.body) httpString += ".expect(testObj.body)";
					
					// expect
					if (testObj.expect && testObj.expect.length > 0) {
						for (var key in testObj.expect) {
							var obj = testObj.expect[key];
							var field = Object.keys(obj)[0];
							var val = obj[field];
							if (typeof val == "string") val = "'" + val + "'";
							httpString += ".expect('" + field + "', " + val + ")";
						}
					}
					
					// assert
					if (testObj.assert) httpString += ".expect(testObj.assert)";
					
					// end
					httpString += ".end(finish);";
				
				// run http eval
				
					eval(httpString);
	
			});
			
			return this;	
								
		}
			
// module exports	
	
	module.exports = test;

