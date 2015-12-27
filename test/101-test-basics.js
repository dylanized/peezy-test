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

	

