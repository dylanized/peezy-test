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
			
			test.suite("single (checking)", [
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
			
			test.suite("102.2 testObj (checking)", [
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
						test.assert(this.foo === "bop");					
						
						single3 = this.foo;
						
					}
				}
			],
			{
				noSpacer: true,
				foo: "bop"
			});
			
			test.suite("102.3 testArr (checking)", [
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
		
			var suiteObj1 = {
				label: "102.4 suiteObj - with .tests",
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
			
			test.suiteObj(suiteObj1, { foo: "bar" });
			
			test.suite("suiteObj - with .tests (checking)", [
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
		
			var suiteObj2 = {
				label: "102.5 suiteObj - with .suites",
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
			
			test.suiteObj(suiteObj2, { foo: "baz" });
			
			test.suite("suiteObj - with .suites (checking)", [
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

		// suiteArr 1 - no options
		
			var arr_count = 0;
		
			var arrObj1 = {
				label: "suiteArr suite 1",
				tests: [
					{
						label: "Increment",
						assert: function() {
							test.assert(arr_count == 0);	
							arr_count++;			
						}
					},	
					{
						label: "Check this.options",
						assert: function() {
							test.assert(this.noSpacer == true);
							test.assert(arr_count == 1);	
							arr_count++;		
						}
					},
					{
						label: "Check passed options",
						assert: function() {
							test.assert(arr_count == 2);	
							arr_count++;				
						}
					}					
				],
				options: {
					noSpacer: true	
				}
			};
			
			var arrObj2 = {
				label: "suiteArr suite 2",
				suites: [
					{
						label: "Increment",
						assert: function() {
							test.assert(arr_count == 3);	
							arr_count++;			
						}
					},	
					{
						label: "Check this.options",
						assert: function() {
							test.assert(arr_count == 4);	
							arr_count++;		
						}
					},
					{
						label: "Check passed options",
						assert: function() {
							test.assert(arr_count == 5);	
							arr_count++;											
						}
					}					
				],
				options: {
					noSpacer: true	
				}
			};	
				
			test.suiteArr([
				arrObj1,
				arrObj2
			]);
		
			test.suite("102.6 suiteArr (checking)", [
				{
					label: "Checking unnamed",
					assert: function() {
						
						test.assert(arr_count == 6);
						
					}
				}				
			]);	
						
		// suiteArr2 - with options
		
			var arr_count2 = 0;
		
			var arrObj3 = {
				label: "suiteArr suite 3",
				tests: [
					{
						label: "Increment",
						assert: function() {
							test.assert(arr_count2 == 0);	
							arr_count2++;			
						}
					},	
					{
						label: "Check this.options",
						assert: function() {
							test.assert(this.noSpacer == true);
							test.assert(arr_count2 == 1);	
							arr_count2++;		
						}
					},
					{
						label: "Check passed options",
						assert: function() {
							test.assert(this.foo == "hello");
							test.assert(arr_count2 == 2);	
							arr_count2++;				
							arr_keyword1 = this.foo;								
						}
					}					
				],
				options: {
					noSpacer: true	
				}
			};
			
			var arrObj4 = {
				label: "suiteArr suite 4",
				suites: [
					{
						label: "Increment",
						assert: function() {
							test.assert(arr_count2 == 3);	
							arr_count2++;			
						}
					},	
					{
						label: "Check this.options",
						assert: function() {
							test.assert(this.noSpacer == true);
							test.assert(arr_count2 == 4);	
							arr_count2++;		
						}
					},
					{
						label: "Check passed options",
						assert: function() {
							test.assert(this.foo == "hello");
							test.assert(arr_count2 == 5);	
							arr_count2++;				
							arr_keyword2 = this.foo;								
						}
					}					
				],
				options: {
					noSpacer: true	
				}
			};	
				
			test.suiteArr([
				arrObj3,
				arrObj4
			],
			{
				noSpacer: true,
				foo: "hello"
			});
		
			test.suite("102.7 suiteArr (checking)", [
				{
					label: "Checking unnamed",
					assert: function() {
						
						test.assert(arr_count2 == 6);
						
					}
				},
				{
					label: "Checking foo",
					assert: function() {
						
						test.assert(arr_keyword1 === "hello");
						test.assert(arr_keyword2 === "hello");
						
					}
				}				
			]);				 
	
	});	
			