// setup

	var test = require("../index.js"),
		_ = require("underscore");

// dummy data

	var data = { secret: "hello world" };
	
	var http_options = {
		host: "http://google.com",
		expect: [
			{ "Content-Type": /html/ }
		],
		status: 301
	};		
	
// single tests

	test.single("Single Sync Test", "test.sync()", function() {
		test.object(data).hasProperty("secret", "hello world");
	});

	test.single("Single Async Test", "test.async()", function(done) {
		test.object(data).hasProperty("secret", "hello world");
		done();	
	});

	test.single("Single HTTP Test", "test.http(http_options)", http_options, function(res) {
		//console.log(res);
		test.object(res).hasProperty("body");
	});
	
// suite test

	var nested_tests = [
		{
			desc: "Sync and Async",
			tests: [
				{
					desc: "Sync test",
					assert: function(data) {
						test.object(data).hasProperty("secret", "hello world");					
					}
				},
				{
					desc: "Async test",
					assert: function(data, done) {
						test.object(data).hasProperty("secret", "hello world");
						done();
					}	
				}
			]		
		},
		{
			desc: "Sync and Async",
			tests: [
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
			]		
		}		
	];
	
	//test.suite("Testing suite", nested_tests, dummy_data);	
	
	// test for data
	// http tester
	// default if only arrat is provided
