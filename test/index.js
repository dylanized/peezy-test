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
		test.object(res).hasProperty("body");
	});
	
// suite test

	var suites = [
		{
			desc: "Sync and Async",
			tests: [
				{
					desc: "Sync test",
					assert: function() {
						test.object(data).hasProperty("secret", "hello world");					
					}
				},
				{
					desc: "Async test",
					assert: function(done) {
						test.object(data).hasProperty("secret", "hello world");
						done();
					}	
				}
			]		
		},
		{
			desc: "HTTP",
			tests: [
				{
					desc: "HTTP test",
					host: "http://google.com",
					status: 301,
					expect: [
						{ "Content-Type": /html/ }
					],					
					assert: function(res) {
						test.object(res).hasProperty("body");
					}					
				}
			]		
		}		
	];
	
	test.suite("Suite test", suites);
	
// alt suite test

	var suites2 = [
		{
			desc: "HTTP",
			tests: [
				{
					desc: "HTTP test",
					assert: function(res) {
						test.object(res).hasProperty("body");
					}					
				}
			]		
		}		
	];
	
	var http_options = {
		host: "http://google.com",
		status: 301,
		expect: [
			{ "Content-Type": /html/ }
		]
	}	
	
	test.suite(suites2, http_options);	
