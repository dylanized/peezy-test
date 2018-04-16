// setup

	var test = require("../index.js");

	var data = { secret: "hello world" };

//  tests

	test.page("101 Test Basics", function() {

		//	simple sync, async and http tests

			test.suite("101.1 Basic Test Types", [
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
						host: "https://google.com",
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

		// test pending and skipping

			var pending = false;
			var skipping = false;

			test.suite("101.2 Test Pending and Skipping", [
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

		// test timeout

			test.suite("101.3 Test Timeout", [
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

		// test options

			var inherit = false;
			var override = false;

			test.suite("101.4 Test Options", [
					{
						label: "Inherit pending - this should not run",
						assert: function() {

							test.fail("This should not run");
							inherit = true;

						}
					},
					{
						label: "Override pending - this should run",
						assert: function() {

							test.assert(override == false);
							override = true;

						},
						pending: false
					}
				],
				{
					pending: true,
					noSpacer: true
				}
			);

			test.suite("Test Options (checking)", [
				{
					label: "Checking inherit",
					assert: function() {
						test.assert(inherit === false);
					}
				},
				{
					label: "Checking override",
					assert: function() {
						test.assert(override === true);
					}
				}
			]);

		// only

			var fired = 0;

			test.suite("101.5 Only", [
					{
						label: "Normal test",
						assert: function() {
							fired = false;
							test.fail("This should never run");
						}
					},
					{
						label: ".only test",
						assert: function() {
							test.assert(fired === 0);
							fired = true;

						},
						only: true
					},
					{
						label: "Normal test",
						assert: function() {
							fired = false;
							test.fail("This should never run");
						}
					}
				],
				{
					noSpacer: true
				}
			);

			test.suite("Only (checking)", [
				{
					label: "Checking fired",
					assert: function() {
						test.assert(fired === true);
					}
				}
			]);

		// title

			test.suite("101.6 This should be a title", [
					{
						label: "This should not be a title",
						assert: function() {
							test.assert(typeof this.title == "undefined");
						}
					}
				],
				{
					title: true
				}
			);

			test.suite("This should not be a title", [
					{
						label: "This should be a title",
						assert: function() {
							test.assert(this.title == true);
						},
						title: true
					}
				]
			);

	});
