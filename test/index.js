// setup

	var test = require("../index.js");

// dummy data

	var data = {};	
	
// single tests

	test.single("Single Sync Test", "test.sync()", function() {}, data);
	
	test.single("Single Async Test", "test.async()", function(done) {
		done();	
	});
	
// suite test

	var tests = [
		{
			desc: "Sync test",
			assert: function() {
			
			}
		},
		{
			desc: "Async test",
			assert: function(data, done) {
				done();
			}	
		}
	];
	
	test.suite("Testing suite", tests, data);	