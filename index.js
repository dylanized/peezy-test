// module setup

	var test = require("unit.js");

// setup mocha test			

	// build test suite with tests obj
		
		test.suite = function(label, tests, data) {
		
			describe(label, function() {
			
				// for each test
				for (var key in tests) {
				
					// test test async or sync
					if (tests[key].assert.length > 0) test.async(tests[key].desc, tests[key].assert, data);
					else test.sync(tests[key].desc, tests[key].assert, data);
				
				}
			
			});
		
		}

	// run suite with single test
	
		test.single = function(label, desc, assert, data) {
		
			describe(label, function() {
			
				// if async
				if (assert.length > 0) test.async(desc, assert, data);
				// else sync				
				else test.sync(desc, assert, data);
			
			});
		
		}
	
	// sync test case
	
		test.sync = function(desc, assert, data) {
			
			it(desc, function() {
				return assert(data);
			});
		
		}

	// async test case
	
		test.async = function(desc, assert, data) {
		
			it(desc, function(done) {	
			
				if (typeof data == "object") assert(data, done);
				else assert(done);	
			
			});		
		
		}
	
// module exports	
	
	module.exports = test;

