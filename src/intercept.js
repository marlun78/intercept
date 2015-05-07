'use strict';

var isArray = require('lodash.isarray');
var isFunction = require('lodash.isfunction');
var noop = require('lodash.noop');
var toArray = require('lodash.toarray');

/**
 * @param   {Object}   host     - The object where the method lives in
 * @param   {String}   name     - The name of the method to intercept
 * @param   {Function} [input]  - A function to be called _before_ the original implementation
 * @param   {Function} [output] - A function to be called _after_ the original implementation
 * @returns {Function}          - A release function that undo the interception
 */
module.exports = function intercept(host, name, input, output) {
    var original = host[name];

    if (isFunction(original)) {
        host[name] = intercepted;
        return release;
    } else {
        return noop;
    }

    function intercepted() {
        var newArgs, value;
        var origArgs = toArray(arguments);

        if (isFunction(input)) {
            newArgs = input.call(this, origArgs);
        }

        value = original.apply(this, newArgs || origArgs);

        if (isFunction(output)) {
            return output.call(this, value);
        } else {
            return value;
        }
    }

    function release() {
        host[name] = original;
    }
};