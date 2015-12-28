// setup

	var test = require("unit.js"),
		_ = require("lodash");
		
// suite and test runners		

	// suite runner
	
		test.suite = function(arg1, arg2, arg3) {
			
			var label;
			var tests = new Array();
			var options = {};		
			
			// if arg1 is label, parse 3-arg style
			if (typeof arg1 == "string") {
			
				// set label
				label = arg1;
				
				// if tests array
				if (_.isArray(arg2)) tests = arg2;
				
				// else if single obj, wrap it in an array
				else if (typeof arg2 == "object") tests.push(arg2);
				
				// set options
				options = arg3;
	
			}
						
			// else parse 2 arg style
			else {
			
				label = "";
				options = arg2;
	
				// if tests array
				if (_.isArray(arg1)) tests = arg1;
				
				// else if single obj
				else if (typeof arg1 == "object") test.handleObj(arg1, options);
				
			}
			
			// fancy title
			if (options && options.title) {
				
				label = test.title(label, true);
				delete options['title'];
				
			}
			
			// set up mocha suite
			describe(label, function() {			
			
				// get array of onlys
				var onlys = _.filter(tests, function(obj) {
				    if (obj && obj.only) return obj;
				});			
						
				// if any tests have .only
				if (onlys.length > 0) {
				
					// set suite to pending
					if (typeof options == "undefined") options = {};
					options.pending = true;
				
				}
			
				// set timeout
				if (options && options.timeout) this.timeout(options.timeout);
						
				// if wrapAll (before and after)
				if (options && typeof options.wrapAll == 'function') {
				
					before(options.wrapAll);
					after(options.wrapAll);
					
				}
				
				// else if wrapThis (before and after - but don't pass into child suites)
				else if (options && typeof options.wrapThis == 'function') {
						
					// set and delete						
					before(options.wrapThis);
					after(options.wrapThis);	
					delete options[wrapThis];						
			
				}
								
				// else if beforeAll and/or afterAll
				else {
	
					// if beforeThis				
					if (options && typeof options.beforeThis == 'function') {
					
						// set and delete
						before(options.beforeThis);
						delete options[beforeThis];
						
					}
					
					// else if beforeAll
					if (options && typeof options.beforeAll == 'function') before(options.beforeAll);
					
					// if afterThis
					if (options && typeof options.afterThis == 'function') {
					
						// set and delete					
						after(options.afterThis);			
						delete options[afterThis];
						
					}
	
					// else if afterAll					
					if (options && typeof options.afterAll == 'function') after(options.afterAll);			
					
				}
				
				// if wrapEach (before and after)
				if (options && typeof options.wrapEach == 'function') {
				
					beforeEach(options.wrapEach);
					afterEach(options.wrapEach);
					
				}
				
				// else if beforeEach and/or afterEach
				else {
				
					// set .beforeEach and .afterEach						
					if (options && typeof options.beforeEach == 'function') beforeEach(options.beforeEach);
					if (options && typeof options.afterEach == 'function') afterEach(options.afterEach);			
					
				}
	
				// if spacer				
				if (!options || !options.noSpacer) {
	
					after(function spacer() {
						console.log("");
					});		
				
				}
	
				// for each testObj
				for (var key in tests) {
				
					test.handleObj(tests[key], options);
				
				}
			
			});
			
			return this;
		
		}
		
	// handle test or suite object
			
		test.handleObj = function(testObj, options) {
		
			// clone options
			options = _.clone(options);
			
			// if this has suites attribute
			if (testObj.suites) {
				// move to tests
				testObj.tests = _.clone(testObj.suites);
				delete testObj['suites'];			
			}
					
			// if this is a suiteObj
			if (testObj.tests) test.suiteObj(testObj, options);
		
			// else its a testObj
			else test.testObj(testObj, options);			
		
		}	
		
	// handle suiteObj
	
		test.suiteObj = function(suiteObj, options) {
					
			// merge options
			if (suiteObj.options) options = merge(options, suiteObj.options);
			
			// fire off child suite
			test.suite(suiteObj.label, suiteObj.tests, options);		
		
		}
		
	// handle testObj	
	
		test.testObj = function(testObj, options) {
		
			// merge options into the testObj
			if (options) testObj = merge(options, testObj);											

			// if pending test case
			if (!testObj.only && (testObj.pending || testObj.skip)) it(testObj.label);

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

// test cases

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

// other
		
	// page utility
	
		test.page = function(title, tests) {
		
			describe(test.title(title), tests);
		
		}
	
		
	// title utility

		test.title = function(title, indent) {
		
			var length = title.length;
			var divider = "";
			var i;
			
			// build divider
			for (i = 0; i < length; i++) {		
				divider += "=";				
			}
		
			// build title string
			title = divider + "\n  " + title.toUpperCase() + "\n  " + divider + "\n";
			
			// if prevent indent
			if (indent) title = "\n  " + title;
			
			return title;
		
		}	
		
// helpers
		
	function merge(obj1, obj2) {
		
		// copy obj2 into obj1
		for (var key in obj2) {				
			obj1[key] = obj2[key];				
		}
		
		return obj1;
	
	}			
			
// module exports	
	
	module.exports = test;

