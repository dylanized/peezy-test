// setup

	var test = require("../index.js");

	var data = { secret: "hello world" };
	
// tests	
	
	test.page("102 Suite Basics", function() {
				
		// suite object 1 - with tests array
		
			var suite_count1 = 0;
			var suite_keyword1 = false;
		
			var suiteObj = {
				label: "102.1 Suite Object #1 - with tests array",
				tests: [
					{
						label: "Increment",
						assert: function() {
							test.assert(suite_count1 == 0);	
							suite_count1++;			
						}
					},	
					{
						label: "Check this.options",
						assert: function() {
							test.assert(this.noSpacer == true);
							test.assert(suite_count1 == 1);	
							suite_count1++;								
						}
					},
					{
						label: "Check passed options",
						assert: function() {
							test.assert(this.foo == "bar");
							test.assert(suite_count1 == 2);	
							suite_count1++;				
							suite_keyword1 = this.foo;				
						}
					}									
				],
				options: {
					noSpacer: true	
				}
			};
			
			//test.suiteObj(suiteObj, { foo: "bar" });
			
			/*test.suite("Suite Object 1 (cont'd - checking)", [
				{
					label: "Checking suite count",
					assert: function() {			
						test.assert(suite_count1 == 3);				
					}
				},
				{
					label: "Checking suite keyword",
					assert: function() {			
						test.assert(suite_keyword1 == "bar");				
					}
				}						
			]);*/
				
				
		// suite object 2 - with suites array
		
			var suite_count2 = 0;
		
			var suiteObj = {
				label: "102.2 Suite Object #2 - with suites array",
				suites: [
					{
						label: "Increment",
						assert: function() {
							test.assert(suite_count2 == 0);	
							suite_count2++;			
						}
					},	
					{
						label: "Check this.options",
						assert: function() {
							test.assert(this.noSpacer == true);
							test.assert(suite_count2 == 1);	
							suite_count2++;		
						}
					},
					{
						label: "Check passed options",
						assert: function() {
							test.assert(this.foo == "baz");
							test.assert(suite_count2 == 2);	
							suite_count2++;				
							suite_keyword2 = this.foo;								
						}
					}					
				],
				options: {
					noSpacer: true	
				}
			};
			
			/*test.suiteObj(suiteObj, { foo: "baz" });
			
			test.suite("Suite Object 2 (cont'd - checking)", [
				{
					label: "Checking suite count",
					assert: function() {			
						test.assert(suite_count2 == 3);				
					}
				},
				{
					label: "Checking suite keyword",
					assert: function() {			
						test.assert(suite_keyword2 == "baz");				
					}
				}			
			]);	*/

		// nested suites - sample
		
			var nested_suites_sample = {
				label: "Nested Suite Example",
				tests: [
					{
						label: "Sync test",
						assert: function() {
							count++;			
						}
					},					
					{
						label: "Async test",
						assert: function(done) {
			
							setTimeout(function() {
								count++;
								done();					
							}, 1000);
			
						}	
					},
					{
						label: "HTTP test",
						host: "http://google.com",
						status: 301,
						expect: [
							{ "Content-Type": /html/ }
						],					
						assert: function(res) {
							count++;
						}					
					}
				]
			};
		
		// nested suites - test
		
			var count = 0;
		
			var suites = [
				nested_suites_sample,
				nested_suites_sample
			];
		
			test.suite("102.3 Nested Suites", suites, { noSpacer: true });
				
			test.suite("Nested Suites (cont'd- checking)", [
				{
					label: "Checking nested count",
					assert: function() {
						
						test.assert(count == 6);
						
					}
				}
			]);
			
		// nested options - sample
		
			var inherit_sample = {
				label: "Inherit Options Sample",
				tests: [
					{
						label: "Inherit pending and do not run",
						assert: function() {
			
							test.fail("This should not run");
			
						}
					}
				]
			};
		
			var override_sample = {
				label: "Override Options Sample",
				tests: [
					{
						label: "Override pending and do run",
						assert: function() {
			
							test.assert("This should run");
							foo = true;
			
						}
					}
				],
				options: {
					pending: false
				}
			};
			
		// nested options - test
		
			var foo = false;
		
			var nested_options_suites = [
				inherit_sample,
				override_sample
			];
		
			test.suite("102.4 Nested Options", nested_options_suites, { pending: true, noSpacer: true });
				
			test.suite("Nested Options (cont'd- checking)", [
				{
					label: "Checking foo",
					assert: function() {
						
						test.assert(foo === true);
						
					}
				}
			]);	
			
		// unnamed suite
		
			var unnamed = 0;
				
			test.testObj([
				{
					label: "Increment",
					assert: function() {
						
						unnamed++;
						
					}
				}
			], {
				noSpacer: true
			});
		
			test.suite("102.5 Unnamed Suite (cont'd)", [
				{
					label: "Checking unnamed",
					assert: function() {
						
						test.assert(unnamed == 1);
						
					}
				}
			]);
			
		// chained suites
		
			var chained = 0;
				
			test.suite("102.6 Chained Suite", [
				{
					label: "Increment",
					assert: function() {
						
						test.assert(chained == 0);
						chained++;
						
					}
				}
			], {
				noSpacer: true
			})
		
			.suite("Chain (part 2)", [
				{
					label: "Increment",
					assert: function() {
						
						test.assert(chained == 1);
						chained++;
						
					}
				}
			], {
				noSpacer: true
			})
		
			.suite("Chain (part 3)", [
				{
					label: "Increment",
					assert: function() {
						
						test.assert(chained == 2);
						chained++;
						
					}
				}
			], {
				noSpacer: true
			});	
		
			test.suite("Chained Suite (checking)", [
				{
					label: "Checking chained",
					assert: function() {
						
						test.assert(chained == 3);
						
					}
				}
			]);

	});