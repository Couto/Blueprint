define([
    'Blueprint',
    'mocha',
    'expect'
], function (Blueprint, mocha, expect) {

    'use strict';

    mocha.setup('bdd');

    describe('Static methods', function () {

        var base = {
            property: 'foo',
            method1 : function () {
                console.log('I was written with the method1 from First <br />');
            },
            method2 : function () {
                console.log('I was writter with the method2 from the First <br />');
            }
        },
        First = Blueprint.create(base),
        Second = First.create({
            method3 : function () {
                console.log('I was written with the method3 from the Second <br />');
                Object.getPrototypeOf(Second).method1.call(this);
            },
            Statics : {
                staticFunction : function () {
                    console.log('I was written with the staticFunction from the Second <br />');
                }
            }
        });

        it('should be accessible', function () {
            var second = Second.create();
            console.dir(Second);
            console.dir(second);
            expect(Second.staticFunction).not.to.equal(undefined);
        });
    });

});
