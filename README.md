# Intercept.js

Simple meta-programming for methods

The intercept-function enables input and output hooks that will run before and
after the intercepted method. In the input-hook lets you control the input to
the intercepted method and the output-hook the return value.

### Simple Example
```
// Original method
var math = {
    add: function add(a, b) {
        return a + b;
    }
};

// Now we intercept this method to control its in- and outputs.
// A `release`-function is returned to release the intercepted method and
// revert it to its original state.
var release = intercept(math, 'add',
    // The first function controls the input
    function (args) { console.log('in', args); return [5, 5]; }, // Important to return an array!
    // The second function controls the output
    function (value) { console.log('out', value); return 'Monkey'; } // Important to return the value!
);

// Now we call the method
math.add(1, 2);
// in [1, 2]
// out 10
// 'Monkey'

// If we release the method and call it again
release();
math.add(2, 3);
// 5
```

### Arguments

##### host
{Object} - The object to which the method belongs

##### name
{String} - The name of the method to intercept

##### input (optional)
{Function} - A function to be called _before_ the original implementation and
lets you control the input to the method. If supplied, **it MUST return an
array** (the args)!

##### output (optional)
{Function} - A function to be called _after_ the original implementation and it
lets you control the output of the method. If supplied, what ever it returns
will be used as the return value of the method.

### Returns

{Function} - A function to release the method and revert it to its original
state.
