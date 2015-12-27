// module setup

	var test = require("unit.js"),
		_ = require("lodash");

// setup mocha test
	
	// build test suite with array of tests or suites
		
		test.suite = function(label, tests, options) {
		
			var testObj = {};
		
			// if no label
			if (typeof label == "object") {
				options = tests;
				tests = label;
				label = "";
			}
			
			// set up mocha suite
			describe(label, function() {
			
				// set timeout
				if (options && options.timeout) this.timeout(options.timeout);
						
				// if bothAll (before and after)
				if (options && typeof options.bothAll == 'function') {
				
					before(options.bothAll);
					after(options.bothAll);
					
				}
				
				// else if beforeAll and/or afterAll
				else {
				
					// set .beforeAll and .afterAll					
					if (options && typeof options.beforeAll == 'function') before(options.beforeAll);
					if (options && typeof options.afterAll == 'function') after(options.afterAll);			
					
				}
				
				// if bothEach (before and after)
				if (options && typeof options.bothEach == 'function') {
				
					beforeEach(options.bothEach);
					afterEach(options.bothEach);
					
				}
				
				// else if beforeEach and/or afterEach
				else {
				
					// set .beforeEach and .afterEach						
					if (options && typeof options.beforeEach == 'function') beforeEach(options.beforeEach);
					if (options && typeof options.afterEach == 'function') afterEach(options.afterEach);			
					
				}				

				// for each testObj
				for (var key in tests) {
				
					handleTestObj(tests[key], _.clone(options));
				
				}
			
			});
			
			return this;
		
		}
		
		function handleTestObj(testObj, options) {		
					
			// if this is a suiteObj
			if (testObj.label && testObj.tests) {
			
					// merge options
					if (testObj.options) options = merge(options, testObj.options);
					
					// fire off child suite
					test.suite(testObj.label, testObj.tests, options);
					
			}
		
			// else its a testObj
			else {											
			
				// merge options into the testObj
				if (options) testObj = merge(options, testObj);											

				// if pending test case
				if (testObj.pending || testObj.skip) it(testObj.label);
	
				// else execute test case						
				else {
			
					// if http
					if (testObj.host || testObj.path) test.http(testObj);
	
					// if async
					else if (testObj.assert && testObj.assert.length > 0) test.async(testObj);
					
					// else sync
					else test.sync(testObj);
					
				}
				
			}
			
			function merge(obj1, obj2) {
				
				// copy obj2 into obj1
				for (var key in obj2) {				
					obj1[key] = obj2[key];				
				}
				
				return obj1;
			
			}				
		
		}		

	// sync test case
	
		test.sync = function(testObj) {
		
			it(testObj.label, function() {
			
				// set timeout
				if (testObj.timeout) this.timeout(testObj.timeout);
		
				// run before
				if (testObj.before) testObj.before();
						
				// run assert					
				if (testObj.assert) testObj.assert();
				
				// run finish
				if (testObj.after) testObj.after();				
				
			});

			return this;
		
		}

	// async test case
	
		test.async = function(testObj) {

			it(testObj.label, function(done) {
			
				// set timeout
				if (testObj.timeout) this.timeout(testObj.timeout);
		
				// run before
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
			
				// set timeout
				
					if (testObj.timeout) this.timeout(testObj.timeout);
		
				// run before
		
					if (testObj.before) testObj.before();
					
				// set finish
				
					if (testObj.after) {
					
						function finish() {
							testObj.after();
							done();
						}
					
					} else finish = done;					
		    
		    	// build http eval
		    	
					var httpString = buildHttpString(testObj);
					
				// run http eval
				
					eval(httpString);
	
			});
			
			return this;	
								
		}
		
		function buildHttpString(testObj) {
		
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
			if (send) httpString += ".send(" + send + ")";
			
			// accept
			if (testObj.accept) httpString += ".set('Accept', testObj.accept)";		
			
			// status
			httpString += ".expect(" + status + ")";
			
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
			
			return httpString;
			
		}
			
// module exports	
	
	module.exports = test;

