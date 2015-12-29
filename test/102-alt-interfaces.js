// setup

	var test = require("../index.js");

	var data = { secret: "hello world" };

//  tests
	
	test.page("102 Alternate Interfaces", function() {
				
		// .single

			var single = 0;
				
			test.single("102.1 single", {
				label: "Increment",
				assert: function() {
					
					test.assert(single === 0);
					test.assert(this.noSpacer === true);
					test.assert(this.foo === "bar");	
					
					single = this.foo;
					
				}
			},
			{
				noSpacer: true,
				foo: "bar"
			});
			
			test.suite("single (cont'd - checking)", [
				{
					label: "Checking single",
					assert: function() {
						
						test.assert(single === "bar");
						
					}
				}				
			]);	
			 
			
		// testObj

			var single2 = 0;
				
			test.testObj({
				label: "Increment",
				assert: function() {
					
					test.assert(single2 === 0);
					test.assert(this.noSpacer === true);
					test.assert(this.foo === "baz");					
					
					single2 = this.foo;
					
				}
			},
			{
				noSpacer: true,
				foo: "baz"
			});
			
			test.suite("102.2 testObj (cont'd - checking)", [
				{
					label: "Checking testObj",
					assert: function() {
						
						test.assert(single2 === "baz");
						
					}
				}				
			]);	
			
					
		// testArr

			var single3 = 0;
				
			test.testArr([
				{
					label: "Increment",
					assert: function() {
						
						test.assert(single3 === 0);
						test.assert(this.noSpacer === true);
						test.assert(this.foo === "baz");					
						
						single3 = this.foo;
						
					}
				}
			],
			{
				noSpacer: true,
				foo: "bop"
			});
			
			test.suite("102.3 testArr (cont'd - checking)", [
				{
					label: "Checking testArr",
					assert: function() {
						
						test.assert(single3 === "bop");
						
					}
				}				
			]);		
			
		// suiteObj with .tests
		
			var suite_count1 = 0;
			var suite_keyword1 = false;
		
			var suiteObj = {
				label: "102.1 suiteObj - with .tests",
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
			
			test.suiteObj(suiteObj, { foo: "bar" });
			
			test.suite("suiteObj - with .tests (cont'd - checking)", [
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
			]);
				
				
		// suite object 2 - with suites array
		
			var suite_count2 = 0;
		
			var suiteObj = {
				label: "102.2 suiteObj - with .suites",
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
			
			test.suiteObj(suiteObj, { foo: "baz" });
			
			test.suite("suiteObj - with .suites (cont'd - checking)", [
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
			]);
			
		// suiteArr
		
			// TODO					 
	
	});	
			