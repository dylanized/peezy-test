// setup

	var test = require("../index.js");
	
	//console.log("=== 104 BEFORE & AFTER ===");	
	
// before and after (sync)

	var before = false;
	var after = false;

	test.suite("104.1 Before and After Sync Tests", [
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

	test.suite("104.2 After Async Tests", [
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

	test.suite("104.3 beforeAll and afterAll (sync)", [
		{
			label: "Dummy test",
			assert: function() {

				test.assert(allTest == 1);								

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
	
	test.suite("beforeAll and afterAll (sync - cont'd)", [
		{
			label: "Confirming afterAll",
			assert: function() {
				test.assert(allTest == 3);				
			}
		}
	]);
	
// beforeAll and afterAll (async)
	
	var allAsyncTest = 0;

	test.suite("104.4 beforeAll and afterAll (async)", [
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
	
// bothAll	

	var bothTest = 0;

	test.suite("104.5 bothAll", [
		{
			label: "Checking bothAll before",
			assert: function() {
				test.assert(bothTest == 1);
			}
		}		
	], {
		bothAll: function() {
			bothTest++;
		}
	});
	
	test.suite("bothAll (cont'd)", [
		{
			label: "Checking bothAll after",
			assert: function() {
				test.assert(bothTest == 2);								
			}
		}
	]);
		
// beforeEach and afterEach (sync)
	
	var beforeTest = 0;
	var afterTest = 10;

	test.suite("104.6 beforeEach, afterEach (sync)", [
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

	test.suite("104.7 beforeEach, afterEach (async)", [
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
	
// bothEach	

	var bothEachTest = 0;

	test.suite("104.8 bothEach", [
		{
			label: "Increment 1",
			assert: function() {
				test.assert(bothEachTest == 1);
			}
		},
		{
			label: "Increment 2",
			assert: function() {
				test.assert(bothEachTest == 3);
			}
		},
		{
			label: "Increment 3",
			assert: function() {
				test.assert(bothEachTest == 5);
			}
		}						
	], {
		bothEach: function() {
			bothEachTest++;
		}
	});
	
	test.suite("bothEach (cont'd)", [
		{
			label: "Checking bothEach",
			assert: function() {
				test.assert(bothEachTest == 6);								
			}
		}
	]);	