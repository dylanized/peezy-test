// setup

	var test = require("../index.js");

	var data = { secret: "hello world" };
	
	//console.log("=== 102 SUITE BASICS ===");
	
// nested suites - sample

	var nested_suites_sample = {
		label: "Nested Suites Sample",
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

	test.suite("102.1 Nested Suites", suites);
		
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

	test.suite("102.2 Nested Options", nested_options_suites, { pending: true });
		
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
		
	test.suite([
		{
			label: "Increment",
			assert: function() {
				
				unnamed++;
				
			}
		}
	]);

	test.suite("102.3 Unnamed Suite (cont'd)", [
		{
			label: "Checking unnamed",
			assert: function() {
				
				test.assert(unnamed == 1);
				
			}
		}
	]);
	
// chained suites

	var chained = 0;
		
	test.suite("102.4 Chained Suite", [
		{
			label: "Increment",
			assert: function() {
				
				test.assert(chained == 0);
				chained++;
				
			}
		}
	])

	.suite("Chain (part 2)", [
		{
			label: "Increment",
			assert: function() {
				
				test.assert(chained == 1);
				chained++;
				
			}
		}
	])

	.suite("Chain (part 3)", [
		{
			label: "Increment",
			assert: function() {
				
				test.assert(chained == 2);
				chained++;
				
			}
		}
	]);	

	test.suite("Chained Suite (checking)", [
		{
			label: "Checking chained",
			assert: function() {
				
				test.assert(chained == 3);
				
			}
		}
	]);
	
// single test (named)
/*
	var single = 0;
		
	test.suite("102.5 Single Test (named)", {
		label: "Increment",
		assert: function() {
			
			test.assert(single === 0);
			single++;
			
		}
	});

	// single test (cont'd - unnamed)
	test.suite({
		label: "Increment",
		assert: function() {
			
			test.assert(single === 1);
			single++;
			
		}
	});
	
	test.suite("Single Test (cont'd)", [
		{
			label: "Checking single",
			assert: function() {
				
				test.assert(single === 2);
				
			}
		}
	]);	
	 
*/