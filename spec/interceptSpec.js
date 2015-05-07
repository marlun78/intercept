'use strict';

var intercept = require('../src/intercept');

describe('intercept:', function () {
    var _args, _calls, _this, math;

    function add(a, b) {
        _args = arguments;
        _calls++;
        _this = this;
        return a + b;
    }

    beforeEach(function () {
        _args = undefined;
        _calls = 0;
        _this = undefined;
        math = { add: add };
    });

    it('should always return a function (no name)', function () {
        expect(intercept(math)).toEqual(jasmine.any(Function));
    });

    it('should always return a function (undefined)', function () {
        expect(intercept(math, 'name')).toEqual(jasmine.any(Function));
    });

    it('should always return a function (string)', function () {
        math.name = 'some string value';
        expect(intercept(math, 'name')).toEqual(jasmine.any(Function));
    });

    it('the pre function should be called with an args array an return an array to be passed as arguments to the original method', function () {
        intercept(math, 'add', function (args) {
            expect(args[0]).toBe(1);
            expect(args[1]).toBe(2);
            return [5, 5];
        });
        expect(math.add(1, 2)).toBe(10);
    });

    it('should not alter the `this` value', function () {
        intercept(math, 'add');
        math.add(1, 2);
        expect(_this).toBe(math);
    });

    it('should pass the arguments to the original method', function () {
        var a1 = 1;
        var a2 = 'string';
        var a3 = null;
        var a4 = {};
        intercept(math, 'add');
        math.add(a1, a2, a3, a4);
        expect(_args[0]).toBe(a1);
        expect(_args[1]).toBe(a2);
        expect(_args[2]).toBe(a3);
        expect(_args[3]).toBe(a4);
    });

    it('the post function gets the return value of the original method and it controls the return value',
        function () {
            intercept(math, 'add', null, function (value) {
                expect(value).toBe(3);
                return 'duck';
            });
            expect(math.add(1, 2)).toBe('duck');
        });

    it('if no post function is supplied, it should return the value of the original method',
        function () {
            intercept(math, 'add');
            expect(math.add(1, 2)).toBe(3);
        });
});