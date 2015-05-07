'use strict';

var index = require('../src');
var intercept = require('../src/intercept');

describe('index', function () {
    it('should only expose the intercept function', function () {
        expect(index).toBe(intercept);
    });
});