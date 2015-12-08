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
	})

	.single("Single Async Test", "test.async()", function(done) {
		test.object(data).hasProperty("secret", "hello world");
		done();	
	})

	.single("Single HTTP Test", "test.http(http_options)", http_options, function(res) {
		test.object(res).hasProperty("body");
	});
	
// suite tests

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
		},
		{
			desc: "Exists",
			tests: [
				{
					desc: "Single file exists",
					assert: function() {
						test.exists("./package.json");
					}					
				},
				{
					desc: "Single file does not exists",
					assert: function() {
						test.doesNotExist("./package2.json");
					}					
				}										
			]		
		}				
	];
	
	var unnamed_suite = [
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
	
	test.suite("Suite test", suites)
	
	// chained unnamed suite with suiteObj
	.suite(unnamed_suite, http_options);	

// before and after (sync)

	var before = false;
	var after = false;

	test.suite("Before and After Sync Tests", [
		{
			desc: "Run .before function",
			assert: function() {
				
			},
			before: function() {
				before = true;
			}
		},
		{
			desc: "Check .before function",
			assert: function() {
				test.assert(before === true);	
			}
		},
		{
			desc: "Run .after function",
			assert: function() {
				
			},
			after: function() {
				console.log("hello world");
				after = true;				
			}
		},
		{
			desc: "Check .after function",
			assert: function() {
				test.assert(after === true);								
			}
		}
	]);
	
// after async
	
	var after_async = false;

	test.suite("After Async Tests", [
		{
			desc: "Run .after function",
			assert: function(done) {
				done();	
			},
			after: function() {
				after_async = true;				
			}
		},
		{
			desc: "Check .after function",
			assert: function() {
				test.assert(after_async === true);								
			}
		}
	]);	