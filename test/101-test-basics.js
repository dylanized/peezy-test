// setup

	var test = require("../index.js");

	var data = { secret: "hello world" };
	
//	simple sync, async and http tests

	test.suite("101.1 Test Basics", [
			{
				label: "Sync test",
				assert: function() {
	
					test.object(data).hasProperty("secret", "hello world");					
	
				}
			},
			{
				label: "Async test",
				assert: function(done) {
	
					setTimeout(function() {
						test.object(data).hasProperty("secret", "hello world");
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
					test.object(res).hasProperty("body");
				}					
			}
		]
	);
	
// options override - setup

	var foo = 0;
	var bar = false;

	var options_override_tests = [
		{
			label: "Use inherited assert function"
		},
		{
			label: "Override inherited assert function",
			assert: function() {
			
				test.assert(bar === false);
				bar = true;
					
			}
		}		
	];
	
	var options_override_options = {
		assert: function() {
			
			test.assert(foo === 0);
			foo++;			
			
		}
	};

// options override - tests

	test.suite("102.2 Options Override", options_override_tests, options_override_options);
		
	test.suite("Options Override (cont'd- checking)", [
		{
			label: "Checking foo",
			assert: function() {
				
				test.assert(foo === 1);
				
			}
		},
		{
			label: "Checking bar",
			assert: function() {
				
				test.assert(bar === true);
		
			}		
		}		
	]);	
