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

In this example, Suite-tooth instantiates a test suite which contains one test. The test has a label of "My first test" and it runs a syncronous assertion function. In this case, the assertion method used is from Unit.js, but other libraries can be used as well (like `should` or `assert`).

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


```

... to be continued








## Test Suites

A collection of tests is called a "test suite". Create a simple suite like this:

```
SIMPLE SUITE EXAMPLE
```

The tests will be run in sequential order. Individual tests can be skipped, or have unqiue properties.

#### Suite Properties

Pass the suite properties like this:

```
SUITE WITH PROPERTIES EXAMPLE
```

Suite-tooth will look for any properties that apply to the suite, then pass on the config object to all the tests contained in the suite.

Here are properties that apply to the suite:

#### beforeAll, afterAll, wrapAll

These are functions that wrap the entire suite:

- beforeAll - run before the suite
- afterAll - run after the suite
- wrapAll - run before and after the suite

These functions can be sync or async. These functions get passed on to any nested suites (see below).

#### beforeThis, afterThis, wrapThis

These are functions that wrap the entire suite, but do NOT get passed on to any nested suites. They only apply to "this" suite.

These functions can be sync or async. 

#### beforeEach, afterEach, wrapEach

These are functions that run wrap each test inside a suite:

- beforeEach - run before each test in the suite
- afterEach - run after each test
- wrapEach - run before and after each test

These functions get passed on to nested suites, but only apply to tests - not to suites.

These functions can be sync or async.

#### Nested Suites

A suite can contain suites, in fact they can be nested indefinitely. The config object gets passed down, with the exception of the beforeThis/afterThis/wrapThis functions.
