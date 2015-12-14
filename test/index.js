// setup

	var test = require("../index.js");

// dummy data

	var data = { secret: "hello world" };
	
	var http_options = {
		host: "http://google.com",
		expect: [
			{ "Content-Type": /html/ }
		],
		status: 301
	};
	
// basic suite tests

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
	var after_http = false;

	test.suite("After Async Tests", [
		{
			desc: "Async with .after",
			assert: function(done) {
				done();	
			},
			after: function() {
				after_async = true;				
			}
		},
		{
			desc: "Check async .after function",
			assert: function() {
				test.assert(after_async === true);								
			}
		},
		{
			desc: "HTTP with .after",
			host: "http://google.com",
			status: 301,
			expect: [
				{ "Content-Type": /html/ }
			],					
			assert: function(res) {
				test.object(res).hasProperty("body");
			},
			after: function() {
				after_http = true;				
			}							
		},
		{
			desc: "Check http .after function",
			assert: function() {
				test.assert(after_http === true);								
			}
		}		
	]);
	
// beforeAll and afterAll
	
	var allTest = 0;

	test.suite("beforeAll and afterAll", [
		{
			desc: "Dummy test",
			assert: function() {
				//console.log(allTest);
				test.assert(allTest == 1);								
				//console.log(allTest);				
			}
		},
		{
			desc: "Increment",
			assert: function() {
				allTest++;
				test.assert(allTest == 2);
			}
		}		
	], {
		beforeAll: function() {
			allTest++;
		},
		afterAll: function() {
			allTest++;	
		}
	});	
	
	test.suite("Checking afterAll", [
		{
			desc: "Checking afterAll",
			assert: function() {
				test.assert(allTest == 3);				
			}
		}
	]);
	
// beforeEach and afterEach
	
	var beforeTest = 0;
	var afterTest = 10;

	test.suite("beforeEach, afterEach", [
		{
			desc: "Dummy test",
			assert: function() {
				test.assert(beforeTest == 1);								
				test.assert(afterTest == 10);									
			}
		},
		{
			desc: "Increment",
			assert: function() {
				test.assert(beforeTest == 2);	
				test.assert(afterTest == 11);																		
			}
		}				
	], {
		beforeEach: function() {
			beforeTest++;
		},
		afterEach: function() {
			afterTest++;
		},
		afterAll: function() {
			test.assert(beforeTest == 2);			
			test.assert(afterTest == 12);	
		}
	});
		
// put and delete

	/*
	test.suite("Post, Put and Delete", [
		{
			desc: "Post with .verb",
			verb: "post",
			send: {},
			status: 201
		},	
		{
			desc: "Post with .post property",
			post: {},
			status: 201
		},	
		{
			desc: "Put with .verb property",
			verb: "put",
			send: {},
			status: 204
		},	
		{
			desc: "Put with .put property",
			put: {},
			status: 204
		},
		{
			desc: "Del with .del property",
			verb: "del",
			send: {},
			status: 204
		},	
		{
			desc: "Delete with .delete property",
			put: {},
			status: 204
		}					
	]);	
	*/