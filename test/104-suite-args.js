// setup

	var test = require("../index.js");

// tests

	test.page("104 Suite Args", function() {	
	
		// suite pending and skipping	
			
			var suite_pending = false;
			var suite_skip = false;
			var suite_count = 0;
			
			test.suite("104.1 Suite Pending", [
				{
					label: "This should be skipped",
					assert: function() {
						suite_count++;			
						test.assert(suite_pending === true);	
					}
				}		
			], {
				pending: true
			});	
			
			test.suite("104.2 Suite Skip", [
				{
					label: "This should be skipped",
					assert: function() {
						suite_count++;
						test.assert(suite_pending === true);
					}
				}		
			], {
				skip: true,
				noSpacer: true
			});	
			
			test.suite("Suite Skip (checking)", [
				{
					label: "Checking skipped",
					assert: function() {
						test.assert(suite_count === 0);
					}
				}		
			]);		
			
		// timeout
		
			test.suite("104.3 Suite Timeout", [
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
			
	});