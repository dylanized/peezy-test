# suite-tooth
A declarative testing framework

Suite Tooth is a declarative testing framework built on top of [Unit.js](http://unitjs.com) and [Mocha](https://mochajs.org). It allows you to delcare a test as a JavaScript "test object", with values for the name (and other configuration values), and a function to run as an assertation.

Then you can build a "suite" of tests by creating an array of these test objects, and you can configure the suite (and all the included tests) by passing in a configuration object. Suite Tooth also supports some extras like HTTP tests, before & after functions, and more.

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
