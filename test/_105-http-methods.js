// setup

	var test = require("../index.js");
	
	describe(test.title("105 HTTP METHODS"), function() {	

// tests

	test.suite("105.1 Post, Put and Delete", [
			{
				label: "Post with .verb",
				verb: "post",
				send: {},
				status: 201
			},	
			{
				label: "Post with .post property",
				post: {},
				status: 201
			},	
			{
				label: "Put with .verb property",
				verb: "put",
				send: {},
				status: 204
			},	
			{
				label: "Put with .put property",
				put: {},
				status: 204
			},
			{
				label: "Del with .del property",
				verb: "del",
				send: {},
				status: 204
			},	
			{
				label: "Delete with .delete property",
				put: {},
				status: 204
			}					
		],
		{
			pending: true
		}
	);
	
	});