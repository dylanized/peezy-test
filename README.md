# Suite Tooth

Suite Tooth is a declarative, functional testing framework built on [Unit.js](http://unitjs.com) and [Mocha](https://mochajs.org). It allows the creation of a test via a JavaScript "test object", which contains configration properties and an assertion function.

A test object looks like this:

```
{
	label: "I am a test",
	assert: function() {
		test.object(foo).hasProperty("bar"); // checking something here
	}
}
```

It also allows the creation of a "suite" of tests by building an array of test objects (the "tests array"), which can be configured by a suite-wide parameters. A tests array looks like this:

```
[
	{
		label: "First test",
		assert: function() {
			test.object(foo).hasProperty("bar"); // checking something here
		}
	},
	{
		label: "Second test",
		assert: function() {
			test.object(foo).hasProperty("baz"); // checking something else here
		}
	},
	{
		label: "Third test",
		assert: function() {
			test.object(foo).hasProperty("buz"); // checking something else here
		}
	}
]
```

Other features include HTTP testing, before & after functions, and more.

These tests and suites can be built dynamically, and reusable functions can be passed in for assert or before/after behavior. This allows code reuse and code clarity in the construction of large testing scenarios.

#### Table of Contents

The main feautures of Suite Tooth fall into these categories:

- [Single Tests](#single-tests)
  - [Syncronous Tests](#syncronous-tests)
  - [Asyncronous Tests](#asyncronous-tests)
  - [HTTP Tests](#http-tests)
  - [Dynamically Generated Tests](#dynamically-generated-tests)
- [Test Suites](#test-suites)
  - [Suite Before/After Functions](#suite-before--after-functions)
  - [Dynamically Generated Suites](#dynamically-generated-suites)

TODO:
- [Nested Suites](#nested-suites)
- [Other Details](#other-details)

# Single Tests

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

In this case, the `.object` and `hasProperty` helpers from [Unit.js](http://unitjs.com/guide/quickstart.html) are used, but other [assertion](http://chaijs.com/) [libraries](https://shouldjs.github.io/) can be used as well.

#### Skipping Tests

Disable a test by setting the `skip` or `pending` property:

```
test.suite("This suite will run", [
	{
		label: "But this test will be skipped",
		assert: function() {
			// check something				
		},
		skip: true
	}
]);
```

#### Test Before & After Functions

Run a function before or after the test like this:

```
var data;
data.foo = false;

test.suite("Example suite", [
	{
		label: "This is a test with its own before and after functions",
		assert: function() {
			// this function will be run second
			test.object(data).hasProperty("foo", true);				
		},
		before: function() {
			// this function will be run first
			data.foo = true;
		},
		after: function() {
			// this function will be run third
			data.foo = false;
		}
	}
]);
```

Note: these test-specific before & after functions work on sync and async tests, but the functions themselves must be syncronous.

## Asyncronous Tests

By adding the `done` argument to the assert function, Suite-tooth knows to run a test asyncronously:

```
test.suite("Example suite", [
	{
		label: "My async test",
		assert: function(done) {
			setTimeout(function() {
				// check something
				done();			
			}, 1000);
		}
	}
]);
```

#### Timeout Value

Set a custom timeout value to allow asyncronous tests more time to run:

```
test.suite("Example suite", [
	{
		label: "This async test might take awhile",
		assert: function(done) {
			setTimeout(function() {
				// check something			
			}, 5000);
		},
		timeout: 6000
	}
]);
```

## HTTP Tests

Run an HTTP test using the Supertest library like this:

```
test.suite("Example suite", [
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

Because the test object has a `host` property set, Suite-tooth knows to handle this as an HTTP test. 

#### HTTP Properties

For HTTP tests, Suite-tooth parses these properties:

| property  | notes |
| --------- | --- |
| host      | The base URL or server object that the HTTP test is pointed at. |
| path      | The path the HTTP test is pointed at. Default is `/`. |
| status    | The HTTP status code that is expected. Default is `200`. |
| expect    | An array of header key/value pairs that will be expected. |
| assert    | This HTTP assert function will have a `res` argument |

#### Server Object

If you are testing a local application, pass Suite Tooth the app object instead of a URL, like this:

```
var process = require("process");

var app = require(process.cwd() + '/app');

test.suite("Example suite", [
	{
		label: "Testing a local app",
		host: app,
		status: 200,
		assert: function(res) {
			test.object(res.body);
		}					
	}
]);
```

(TODO - confirm the process syntax)

#### Other HTTP Notes

- The HTTP testing is completed using [Supertest](https://github.com/visionmedia/supertest), via Unit.js.
- Usually the `res` object will contain a `body` property with other descendents; or an error message; or anything, depending on how the API is constructed.
- Behind the scenes, Suite-tooth executes the HTTP tests via a JavaScript `eval` statement. This is not ideal and probably needs to be rebuilt eventually.

## Dynamically Generated Tests

One of the most powerful ways to use Suite-tooth is to create tests dynamically or programatically. 

Here is an example:

```

function runTest(title, testObj, timeout) {

	testObj.before = function() {
		// do something
	};

	testObj.timeout = timeout;

  	test.suite(title, [
  		testObj
  	]);

}

```

In this example, `runTest` builds a test using the `testObj` & `timeout` provided, then adds a common `before` function to the test, then executes it. This is a simple example, but there are many other ways to utilize this capability.

## Test Suites

A collection of tests is called a test suite. Create a simple suite like this:

```
test.suite("A Simple Test Suite", [
	{
		label: "Sync test",
		assert: function() {
			// check something			
		}
	},
	{
		label: "Async test",
		assert: function(done) {

			setTimeout(function() {
				// check something
				done();					
			}, 1000);
			
		},
		skip: false	
	},
	{
		label: "HTTP test",
		host: "http://google.com",
		assert: function(res) {				
			// check res
		},
		skip: true					
	}
]);

```

In this example, Suite-tooth is given a suite sith 3 tests. The tests will be run in series, even though the second and third tests take longer than the first. Individual tests can be skipped, or have other unqiue properties.

#### Suite Config

Pass the suite configuration parameters like this:

```
test.suite("A Suite with Config Properties",
	[
		{
			label: "Sync test",
			assert: function() {
				// check something				
			}
		},
		{
			label: "Async test",
			assert: function(done) {
	
				setTimeout(function() {
					// check something
					done();					
				}, 1000);
				
			},
			skip: false
		},
		{
			label: "HTTP test",
			host: "http://google.com",
			assert: function(res) {				
				// check res
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

## Suite Before & After Functions

There are 3 varieties of before & after functions that can be passed to a suite:

| `beforeAll` | run before/after the entire suite, gets passed on to children suites |
| `beforeThis` | run before/after the entire suite, doesn't get passed on to children |
| `beforeEach` | run before & after each test in the suite |

Here is how these work in more detail:

#### beforeAll, afterAll, wrapAll

These functions can be hooked into the suite config object, and then wrap the entire suite:

| `beforeAll` | run before the suite |
| `afterAll` | run after the suite |
| `wrapAll` | run before and after the suite |

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

Here's a similar example using wrapAll:

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

| `beforeEach` | run before each test in the suite |
| `afterEach` | run after each test |
| `wrapEach` | run before and after each test |

These functions get passed on to nested suites, but they only apply to tests -- not to suites.

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

## Dynamically Generated Suites

Suites can also be created dynamically or programatically. This gets crazy powerful.

Here is an example:

```
var waterfowl = [
	{
		name: "Huey",
		age: 11
	},
	{
		name: "Dewie",
		age: 11
	},
	{
		name: "Louie",
		age: 11
	}
];

function buildTests(list, timeout) {

	var tests = new Array();

	list.forEach(function(testObj) {
	
		// set the label
		testObj.label = "Checking " + testObj.name;
	
		// set the timeout dynamically
		testObj.timeout = timeout;
		
		// add a common before function
		testObj.before = function() {
			// do something
		};	
		
		// build the assert function
		testObj.assert = function() {
			
			// check the testObj for an extra property
			test.object(this).hasProperty("age");
			
			// do some other checking
			if (!walksLikeDuck(this.name)) test.fail("Not a duck");			
			
		}	
	
		tests.push(testObj);
	
	});
	
	return tests;
	
}

test.suite("Checking waterfowl", buildTests(waterfowl, 5000));

```

In this example, we take a list of data and use it to dynamically construct a suiteArray, then pass that into Suite-tooth.

Inside the `buildTests` function, we construct the test objects by dynamically constructing the label and assert function, passing the timeout, and adding a common before function. In the assert function, we use `this` to access properties of the test object.

For even greater simplicity/flexibility, the example of `buildTests` could be refactored into this:

```
function buildTests(list, timeout) {

	var tests = new Array();

	list.forEach(function(listObj) {
	
		tests.push(buildTest(listObj));
	
	});
	
	return tests;
	
}

function buildTest(testObj) {
	
	// set the label
	testObj.label = "Checking " + testObj.name;
	
	// set the timeout dynamically
	testObj.timeout = timeout;
	
	// add a common before function
	testObj.before = function() {
		// do something
	};	
	
	// build the assert function
	testObj.assert = function() {
		
		// check the testObj for an extra property
		test.object(this).hasProperty("age");
		
		// do some other checking
		if (!walksLikeDuck(this.name)) test.fail("Not a duck");			
		
	}	
	
	return testObj;

}

```


## Credits

This is a work in progress. Send feedback to [@dylanized](http://twitter.com/dylanized)
