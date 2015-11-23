// module setup

	var test = require("unit.js");

// setup method

	test.set = function(name, desc, assert) {
	
		describe(name, function() {
		  
			it(desc, function() {
			
				assert();
			
			});
		
		});
	
	}
	
