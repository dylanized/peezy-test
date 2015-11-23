// module setup

	var test = require("unit.js");

// setup mocha test

	test.setup = function(label, desc, testFunc, testObj) {
	
		describe(label, function() {
		  
			it(desc, function(done) {

				if (typeof testObj == "object") return testFunc(testObj, done);
				else return testFunc(done);
							
			});
		
		});
	
	}
	
// module exports	
	
	module.exports = test;
