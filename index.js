// module setup

	var test = require("unit.js");

// setup mocha test

	test.setup = function(label, desc, testFunc, testObj) {
	
		describe(label, function() {
		  
			it(desc, function(done) {
			
				return testFunc(testObj, done);
			
			});
		
		});
	
	}
	
// module exports	
	
	module.exports = test;
