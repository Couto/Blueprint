define([
    'Blueprint',
    'mocha',
    'expect'
], function (Blueprint, mocha, expect) {
    'use strict';

    mocha.setup('bdd');

    describe('Parenting', function () {
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


        it('should have access to it\'s parent', function () {
            expect(Second.Parent).to.equal(First.prototype);
        });
    });

});
