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
			label: "Sync and Async",
			tests: [
				{
					label: "Sync test",
					assert: function() {
						test.object(data).hasProperty("secret", "hello world");					
					}
				},
				{
					label: "Async test",
					assert: function(done) {
						test.object(data).hasProperty("secret", "hello world");
						done();
					}	
				}
			]		
		},
		{
			label: "HTTP",
			tests: [
				{
					label: "HTTP test",
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
			label: "HTTP",
			tests: [
				{
					label: "HTTP test",
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
			label: "Run .before function",
			assert: function() {
				
			},
			before: function() {
				before = true;
			}
		},
		{
			label: "Check .before function",
			assert: function() {
				test.assert(before === true);	
			}
		},
		{
			label: "Run .after function",
			assert: function() {
				
			},
			after: function() {
				after = true;				
			}
		},
		{
			label: "Check .after function",
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
			label: "Async with .after",
			assert: function(done) {
				done();	
			},
			after: function() {
				after_async = true;				
			}
		},
		{
			label: "Check async .after function",
			assert: function() {
				test.assert(after_async === true);								
			}
		},
		{
			label: "HTTP with .after",
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
			label: "Check http .after function",
			assert: function() {
				test.assert(after_http === true);								
			}
		}		
	]);
	
// beforeAll and afterAll (sync)
	
	var allTest = 0;

	test.suite("beforeAll and afterAll (sync)", [
		{
			label: "Dummy test",
			assert: function() {
				//console.log(allTest);
				test.assert(allTest == 1);								
				//console.log(allTest);				
			}
		},
		{
			label: "Increment",
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
	
	test.suite("Confirming afterAll", [
		{
			label: "Confirming afterAll",
			assert: function() {
				test.assert(allTest == 3);				
			}
		}
	]);
	
// beforeAll and afterAll (async)
	
	var allAsyncTest = 0;

	test.suite("beforeAll and afterAll (async)", [
		{
			label: "Dummy test",
			assert: function(done) {
				setTimeout(function() {
					test.assert(allAsyncTest == 1);
					done();							
				}, 1500);
			}
		},
		{
			label: "Increment",
			assert: function(done) {
				setTimeout(function() {
					allAsyncTest++;
					done();
				}, 1500);
			}
		}		
	], {
		beforeAll: function(done) {
			setTimeout(function() {
				allAsyncTest++;
				done();
			}, 1500);
		},
		afterAll: function(done) {
			setTimeout(function() {
				test.assert(allAsyncTest == 2);
				allAsyncTest++;				
				done();
			}, 1500);
		}
	});
	
	test.suite("beforeAll and afterAll (async - cont'd)", [
		{
			label: "confirming afterAll",
			assert: function() {
				test.assert(allAsyncTest == 3);								
			}
		}
	]);
		
// beforeEach and afterEach (sync)
	
	var beforeTest = 0;
	var afterTest = 10;

	test.suite("beforeEach, afterEach (sync)", [
		{
			label: "Dummy test",
			assert: function() {
				test.assert(beforeTest == 1);								
				test.assert(afterTest == 10);									
			}
		},
		{
			label: "Increment",
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
	
	test.suite("beforeEach, afterEach (sync - cont'd)", [
		{
			label: "confirming afterAll",
			assert: function() {
				test.assert(beforeTest == 2);			
				test.assert(afterTest == 12);									
			}
		}
	]);	
	
// beforeEach and afterEach (async)
	
	var beforeAsyncTest = 0;
	var afterAsyncTest = 10;

	test.suite("beforeEach, afterEach (async)", [
		{
			label: "Dummy test",
			assert: function(done) {
				setTimeout(function() {
					test.assert(beforeAsyncTest == 1);								
					test.assert(afterAsyncTest == 10);	
					done();													
				}, 1500);
			}
		},
		{
			label: "Increment",
			assert: function(done) {
				setTimeout(function() {
					test.assert(beforeAsyncTest == 2);	
					test.assert(afterAsyncTest == 11);		
					done();														
				}, 1500);		
			}
		}				
	], {
		beforeEach: function(done) {
			setTimeout(function() {
				beforeAsyncTest++;	
				done();				
			}, 1500);	
		},
		afterEach: function(done) {
			setTimeout(function() {	
				afterAsyncTest++;
				done();
			}, 1500);
		},
		afterAll: function() {
			test.assert(beforeAsyncTest == 2);			
			test.assert(afterAsyncTest == 12);	
		}
	});	
		
	test.suite("beforeEach, afterEach (async - cont'd)", [
		{
			label: "confirming afterAll",
			assert: function() {
				test.assert(beforeAsyncTest == 2);			
				test.assert(afterAsyncTest == 12);									
			}
		}
	]);		
	
// pending and skipping

	var pending = false;
	var skipping = false;

	test.suite("Pending and Skipping", [
		{
			label: "This should be pending",
			assert: function() {
				pending = true;	
			},
			pending : true
		},
		{
			label: "Checking pending",
			assert: function() {
				test.assert(pending === false);	
			}
		},
		{
			label: "This should be skipped",
			assert: function() {
				skipping = true;	
			},
			skip : true
		},
		{
			label: "Checking skipped",
			assert: function() {
				test.assert(skipping === false);	
			}
		}		
	]);
	
// suite pending and skipping	
	
	var suite_pending = false;
	var suite_skip = false;
	
	test.suite("Suite Pending", [
		{
			label: "This should never run",
			assert: function() {
				test.assert(suite_pending === true);	
			}
		}		
	], {
		pending: true
	});	
	
	test.suite("Suite Skip", [
		{
			label: "This should never run",
			assert: function() {
				test.assert(suite_pending === true);
			}
		}		
	], {
		skip: true
	});	
	
// timeouts	

	test.suite("Suite Timeout", [
		{
			label: "2.5 Second Delay",
			assert: function() {
				setTimeout(function() {
					test.assert(true === true);					
				}, 2500);
			}
		}		
	], {
		timeout: 3000
	});
	
		test.suite("Test Timeout", [
		{
			label: "2.5 Second Delay",
			assert: function() {
				setTimeout(function() {
					test.assert(true === true);					
				}, 2500);
			},
			timeout: 3000
		}		
	]);
			
// TODO: put and delete

	/*
	test.suite("Post, Put and Delete", [
		{
			label: "Post with .verb",
			verb: "post",
			send: {},
			status: 201
		},	
		{
			label: "Post with .post property",
			post: {},
			status: 201
		},	
		{
			label: "Put with .verb property",
			verb: "put",
			send: {},
			status: 204
		},	
		{
			label: "Put with .put property",
			put: {},
			status: 204
		},
		{
			label: "Del with .del property",
			verb: "del",
			send: {},
			status: 204
		},	
		{
			label: "Delete with .delete property",
			put: {},
			status: 204
		}					
	]);	
	*/