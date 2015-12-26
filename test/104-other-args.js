// setup

	var test = require("../index.js");
	
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
	var suite_count = 0;
	
	test.suite("Suite Pending", [
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
	
	test.suite("Suite Skip", [
		{
			label: "This should be skipped",
			assert: function() {
				suite_count++;
				test.assert(suite_pending === true);
			}
		}		
	], {
		skip: true
	});	
	
	test.suite("Checking skipped", [
		{
			label: "Checking skipped",
			assert: function() {
				test.assert(suite_count === 0);
			}
		}		
	]);		
	
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
			