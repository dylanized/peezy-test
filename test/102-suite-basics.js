// setup

	var test = require("../index.js");

	var data = { secret: "hello world" };
	
// sample suite

	var sample = {
		label: "Sample Suite",
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
		],
		options: {
			pending: false
		}
	};

// nested suites

	var count = 0;

	var suites = [
		sample,
		sample
	];

	test.suite("Nested Suites", suites);
	
	test.suite("Nested Suites (cont'd- checking)", [
		{
			label: "Checking nested count",
			assert: function() {
				
				test.assert(count == 6);
				
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

	test.suite("Unnamed Suite (cont'd)", [
		{
			label: "Checking unnamed",
			assert: function() {
				
				test.assert(unnamed == 1);
				
			}
		}
	]);
	
// chained suites

	var chained = 0;
		
	test.suite([
		{
			label: "Increment",
			assert: function() {
				
				test.assert(chained == 0);
				chained++;
				
			}
		}
	])

	.suite([
		{
			label: "Increment",
			assert: function() {
				
				test.assert(chained == 1);
				chained++;
				
			}
		}
	])

	.suite([
		{
			label: "Increment",
			assert: function() {
				
				test.assert(chained == 2);
				chained++;
				
			}
		}
	]);	

	test.suite("Chained Suite (cont'd)", [
		{
			label: "Checking chained",
			assert: function() {
				
				test.assert(chained == 3);
				
			}
		}
	]);

