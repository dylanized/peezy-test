# suite-tooth

Suite Tooth is a declarative testing framework built on top of [Unit.js](http://unitjs.com) and [Mocha](https://mochajs.org). It allows you to delcare a test as a JavaScript "test object" with configration properties and an assertion function.

Then a "suite" of tests can be built by creating an array of test objects, and can be configured by a suite-wide configuration object. Other features include support HTTP tests, before & after functions, and more.

## Syncronous Tests

Create a very simple, single test like this:

```
var test = require('suite-tooth');

test.suite("My first suite", [
	{
		label: "My first test",
		assert: function() {
			var data = { foo: "bar" }; // do something here
			test.object(data).hasProperty("foo", "bar");				
		}
	}
]);
```

In this example, Suite-tooth instantiates a test suite which contains one test. The test has a label of "My first test" and it runs a syncronous assertion function.

In this case, the `.object` helper used is from Unit.js, but other assertion libraries can be used as well (like `should` or `assert`).

#### Skipping Tests

Disable a test by setting the `skip` or `pending` property:

```
test.suite("This suite will run", [
	{
		label: "This test will be skipped",
		assert: function() {
			var data = { foo: "bar" }; // do something here
			test.object(data).hasProperty("foo", "bar");				
		},
		skip: true
	}
]);
```

#### Before & After Functions

Run a function before or after the test like this:

```
var data;
data.foo = false;

test.suite("Example suite", [
	{
		label: "This test will be run after the before function",
		assert: function() {
			test.object(data).hasProperty("foo", true);				
		},
		before: function() {
			data.foo = true;
		},
		after: function() {
			data.foo = false;
		}
	}
]);
```

Note: before and after functions work on sync and async tests, but the before and after functions themselves must be syncronous.

## Asyncronous Tests

By adding the `done` argument to the assert function, Suite-tooth knows to run a test asyncronously:

```
test.suite("My second suite", [
	{
		label: "My async test",
		assert: function(done) {
			setTimeout(function() {
				var data = { foo: "bar" }; // do something here
				test.object(data).hasProperty("foo", "bar");			
			}, 1000);
		}
	}
]);
```

#### Timeout Value

Set a custom timeout value to allow asyncronous tests more time to run:

```
test.suite("This is a suite", [
	{
		label: "This async test might take awhile",
		assert: function(done) {
			setTimeout(function() {
				var data = { foo: "bar" }; // do something here
				test.object(data).hasProperty("foo", "bar");			
			}, 5000);
		},
		timeout: 6000
	}
]);
```

## HTTP Tests

Run an HTTP test using the Supertest library like this:

```
test.suite("This is a suite", [
	{
		label: "HTTP test",
		host: "http://google.com",
		status: 301,
		expect: [
			{ "Content-Type": /html/ }
		],					
		assert: function(res) {
			test.object(res.body);
		}					
	}
]);
```

In this example, Suite-tooth is fed a single test. Because it has a host property set, Suite-tooth knows to treat this as an HTTP test. 

#### HTTP Properties

For HTTP tests, Suite-tooth parses these properties:

| property  | notes |
| --------- | --- |
| host      | The base URL the HTTP test is pointed at. This can be an external URL, or an object referencing a web server in your application.|
| path      | The path the HTTP test is pointed at. Default is `/`. |
| status    | The HTTP status code that is expected. Default is `200`. |
| expect    | An array of header key/value pairs that will be expected. |
| assert    | This works similar to an async assert function, except the argument passed in is the response object. Usually the object will a body child and other descendents to test against. Sometimes, the response object can be an error message. |

#### HTTP Testing Notes

The HTTP testing is completed using [Supertest](https://github.com/visionmedia/supertest), via Unit.js.

Note: behind the scenes, Suite-tooth executes the HTTP tests via a JavaScript `eval` statement. This is not ideal and probably needs to be rebuilt in a future version using a different HTTP testing library or approach.

## Test Suites

A collection of tests is called a "test suite". Create a simple suite like this:

```
test.suite("A Simple Test Suite", [
	{
		label: "Sync test",
		assert: function() {
			var data = doSomething(); // do something
			test.object(data).hasProperty("secret", "hello world");				
		}
	},
	{
		label: "Async test",
		assert: function(done) {

			setTimeout(function() {
				var data = doSomething(); // do something				
				test.object(data).hasProperty("secret", "hello world");
				done();					
			}, 1000);
			
		},
		skip: false	
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
		},
		skip: true					
	}
]);

```

In this example, Suite-tooth is given a suite sith 3 tests. The tests will be run in series, even though the second and third tests take longer than the first. Individual tests can be skipped, or have other unqiue properties.

#### Suite Properties

Pass the suite properties like this:

```
test.suite("A Suite with Config Properties",
	[
		{
			label: "Sync test",
			assert: function() {
				var data = doSomething(); // do something
				test.object(data).hasProperty("secret", "hello world");				
			}
		},
		{
			label: "Async test",
			assert: function(done) {
	
				setTimeout(function() {
					var data = doSomething(); // do something				
					test.object(data).hasProperty("secret", "hello world");
					done();					
				}, 1000);
				
			},
			skip: false
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
	],
	{
		skip: true,
		timeout: 5000
	}
);
```

In this example, the suite is passed a config object with the `skip` and `timeout` properties set. Both these properties are passed on to all the tests within the suite. On the second test, the local version of `skip` takes precedence, so the test is NOT skipped.

#### beforeAll, afterAll, wrapAll

These functions can be hooked into the suite config object, and then wrap the entire suite:

- beforeAll - run before the suite
- afterAll - run after the suite
- wrapAll - run before and after the suite

These functions can be sync or async. See example:

```
test.suite("beforeAll and afterAll Examples",
	[
		{
			label: "Test #1",
			assert: function() {
				// test something
			}
		},
		{
			label: "Test #2",
			assert: function(done) {
				
				setTimeout(function() {
					// test something	
					done();		
				}, 1500);
			
			}
		}		
	],
	{
		beforeAll: function(done) {
			setTimeout(function() {
				// do something	
				done();		
			}, 1500);

		},
		afterAll: function() {
			// do something
		}
	}
);
```
In this example, the async `beforeAll` is run first, then Test #1, then the async Test #2, and finally the `afterAll`.

Here's a similar example but with wrapAll:

```
test.suite("wrapAll Example",
	[
		{
			label: "Test #1",
			assert: function() {
				// test something
			}
		},
		{
			label: "Test #2",
			assert: function(done) {
				
				setTimeout(function() {
					// test something	
					done();		
				}, 1500);
			
			}
		}		
	],
	{
		wrapAll: function(done) {
			setTimeout(function() {
				// do something	
				done();		
			}, 1500);

		}
	}
);
```

In this example, the async `wrapAll` is run first, then Test #1, then the async Test #2, and finally the `wrapAll` is run again.

If Suite-tooth is given a suite of suites, it will pass on `beforeAll`, `afterAll` and `wrapAll` to the children suites.

To run a before/afters on a suite WITHOUT passing it on to children, use `beforeThis`, `afterThis` and `wrapThis`.

#### beforeEach, afterEach, wrapEach

These are functions that run wrap each test inside a suite:

- beforeEach - run before each test in the suite
- afterEach - run after each test
- wrapEach - run before and after each test

These functions get passed on to nested suites, but they only apply to tests - not to suites.

These functions can be sync or async.

Here's an example:

```
test.suite("beforeEach and afterEach Examples",
	[
		{
			label: "Test #1",
			assert: function() {
				// test something
			}
		},
		{
			label: "Test #2",
			assert: function(done) {
				
				setTimeout(function() {
					// test something	
					done();		
				}, 1500);
			
			}
		}		
	],
	{
		beforeEach: function(done) {
			setTimeout(function() {
				// do something	
				done();		
			}, 1500);

		},
		afterEach: function() {
			// do something
		}
	}
);
```
In this example, the async `beforeEach` is run first, then Test #1, then `afterEach`, then `beforeEach` (again), then Test #2, and finally `afterEach` (again).

`wrapEach` works similarly, but it runs before AND after EVERY test.

#### Credits

This is a work in progress. Send any feedback to me, [@dylanized](http://twitter.com/dylanized)
