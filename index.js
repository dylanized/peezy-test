// setup

	var test = require("unit.js"),
		_ = require("lodash"),
		npmRun = require("npm-run");
		
// alt suite interfaces	

	// handle test or suite object
			
		test.handleObj = function(obj, options) {
		
			// clone options
			options = _.clone(options);
					
			// if this is a suiteObj
			if (obj.tests || obj.suites) test.suiteObj(obj, options);

			// else its a testObj
			else test.testObj(obj, options); 
			
		}	
		
	// handle suiteObj
	
		test.suiteObj = function(suiteObj, options) {
		
			// if obj options
			if (suiteObj.options) {
				// if passed options is blank, instantiate it
				if (typeof options == "undefined") options = {};
				// merge objs
				options = merge(options, suiteObj.options);
			}
			
			// default label
			if (!suiteObj.label) suiteObj.label = "";
			
			if (suiteObj.suites) tests = suiteObj.suites;
			else tests = suiteObj.tests;			
			
			// fire off suite
			test.suite(suiteObj.label, tests, options);		
		
		}
		
	// handle suiteArr
	
		test.suiteArr = function(suiteArr, options) {
		
			for (var key in suiteArr) {
			
				test.suiteObj(suiteArr[key], options);
			
			}		
		
		}

	// handle testObj or testArr
	
		test.testObj = function(testObj, options) {
		
			// wrap testObj in array
			tests = new Array(testObj);
			
			// fire off single suite
			test.suite("", tests, options);
		
		}
				
	// handle testObj or testArr
	
		test.testArr = function(tests, options) {
			
			// fire off single suite
			test.suite("", tests, options);
		
		}
		
	// single test launcher
	
		test.single = function(label, testObj, options) {
		
			// wrap in array
			var tests = new Array(testObj);
			
			// fire off single suite
			test.suite(label, tests, options);
		
		}			

// main functions

	// build suite
	
		test.suite = function(label, tests, options) {
		
			// clone options
			var opt = _.clone(options);
		
			// if title is set
			if (opt && opt.title && opt.title === true) {			
				// add formatting to label and delete prop
				label = test.title(label);
				delete opt.title;				
			}
			
			// set up mocha suite
			describe(label, function() {
			
				// if this is a suite of suites
				if ( (tests[0] && tests[0].tests) || (tests[0] && tests[0].suites) ) test.suiteArr(tests, opt);

				// else build single suite of tests
				else test.buildSuite(tests, opt, this);
			
			});
			
			return this;
		
		}
		
	// build suite
	
		test.buildSuite = function(tests, options, describeObj) {

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
			if (options && options.timeout) describeObj.timeout(options.timeout);
					
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
				delete options['wrapThis'];						
		
			}
							
			// else if beforeAll and/or afterAll
			else {

				// if beforeThis				
				if (options && typeof options.beforeThis == 'function') {
				
					// set and delete
					before(options.beforeThis);
					delete options['beforeThis'];
					
				}
				
				// else if beforeAll
				if (options && typeof options.beforeAll == 'function') before(options.beforeAll);
				
				// if afterThis
				if (options && typeof options.afterThis == 'function') {
				
					// set and delete					
					after(options.afterThis);			
					delete options['afterThis'];
					
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
			
				// build test				
				test.buildTest(tests[key], options);
			
			}
			
		}
	
	// build test
	
		test.buildTest = function(testObj, options) {
		
			// title filter
			if (testObj.title && testObj.title === true && testObj.label) testObj.label = test.title(testObj.label);		
		
			// merge options into the testObj
			if (options) testObj = merge(options, testObj);											

			// if pending test case, build it
			if (!testObj.only && (testObj.pending || testObj.skip)) it(testObj.label);

			// else execute test case						
			else {
		
				// if http
				if (testObj.host || testObj.path) test.http(testObj);

				// else if async
				else if (testObj.assert && testObj.assert.length > 0) test.async(testObj);
				
				// else sync
				else test.sync(testObj);
				
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
			if (send) httpString += ".send(" + JSON.stringify(send) + ")";
			
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
		
// npm run utilities
	
	test.run = function(task, done) {
		
		npmRun.exec(task, {cwd: __dirname}, function(err, stdout, stderr) {
		
			// if error
			if (err) console.log(err);
			
			done();
		 
		});			
		
	}	
	
	// all	
		
		test.beforeAllRun = function(task) {
		
			test.beforeAll(function(done) {
			
				test.run(task, done);
			
			});
		
		}

		test.afterAllRun = function(task) {
		
			test.afterAll(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
		
		test.wrapAllRun = function(task) {
		
			test.wrapAll(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
	
	// each

		test.beforeEachRun = function(task) {
		
			test.beforeEach(function(done) {
			
				test.run(task, done);
			
			});			
		
		}

		test.afterEachRun = function(task) {
		
			test.afterEach(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
		
		test.wrapEachRun = function(task) {
		
			test.wrapEach(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
	
	// this
		
		test.beforeThisRun = function(task) {
		
			test.beforeThis(function(done) {
			
				test.run(task, done);
			
			});			
		
		}

		test.afterThisRun = function(task) {
		
			test.afterThis(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
		
		test.wrapThisRun = function(task) {
		
			test.wrapThis(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
		
	// individual test
		
		test.beforeRun = function(task) {
		
			test.before(function(done) {
			
				test.run(task, done);
			
			});			
		
		}

		test.afterRun = function(task) {
		
			test.after(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
		
		test.wrapRun = function(task) {
		
			test.wrap(function(done) {
			
				test.run(task, done);
			
			});			
		
		}
								
// other utilities
		
	// page utility
	
		test.page = function(title, tests) {
		
			describe(test.title(title), tests);
		
		}
	
		
	// title utility

		test.title = function(title, indent) {
		
			var length = title.length + 4;
			var divider = "";
			var i;
			
			// build divider
			for (i = 0; i < length; i++) {		
				divider += "=";				
			}
		
			// build title string
			//title = divider + "\n    " + title.toUpperCase() + "\n  " + divider + "\n";
			title = "= " + title.toUpperCase() + " =\n";
			
			// if prevent indent
			if (indent) title = "\n  " + title;
			
			return title;
		
		}
		
// internal helpers
		
	function merge(obj1, obj2) {
	
		var output = _.clone(obj1);
		
		// copy obj2 into obj1
		for (var key in obj2) {				
			output[key] = obj2[key];				
		}
		
		return output;
	
	}			
			
// module exports	
	
	module.exports = test;

