// module setup

	var test = require("unit.js");

// setup mocha test			

	// build test suite with tests obj
		
		test.suite = function(label, tests, data) {
		
			describe(label, function() {
			
				// for each test
				for (var key in tests) {
				
					// test test async or sync
					if (tests[key].async) test.async(tests[key].desc, tests[key].assert, data);
					else test.setup(tests[key].desc, tests[key].assert, data);
				
				}
			
			});
		
		}

	// run suite with single sync test
	
		test.single = function(label, desc, assert, data) {
		
			describe(label, function() {
			  
				it(desc, function(done) {
	
					if (typeof data == "object") return assert(data, done);
					else return assert(done);
								
				});
			
			});
		
		}

	// run suite with single async test
		
		test.singleAsync = function(label, desc, assert, data) {
		
			describe(label, function() {
			  
				it(desc, function(done) {
	
					if (typeof data == "object") return assert(data, done);
					else return assert(done);
								
				});
			
			});
		
		}
	
	// sync test	
	
		test.setup = function(desc, assert, data) {
			
			it(desc, function() {
				return assert(data);
			}	
		
		}

	// async test
	
		test.async = function(desc, assert, data) {
		
			it(desc, function(done) {	
		
				if (typeof data == "object") return assert(data, done);
				else return assert(done);	
			
			});		
		
		}
	
// module exports	
	
	module.exports = test;

