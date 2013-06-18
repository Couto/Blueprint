define([
    'Blueprint',
    'mocha',
    'expect'
], function (Blueprint, mocha, expect) {
    'use strict';


    mocha.setup('bdd');

    describe('Instantiation', function () {
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
        first = First.create(),
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
        }),
        Mixin = Blueprint.create({
            mixinMethod1 : function () {
                console.log('I was written with the mixinMethod1 from the Mixin <br />');
            },
            mixinMethod2 : function () {
                console.log('I was written with the mixinMethod2 from the Mixin <br />');
            },
            mixinMethod3 : function () {
                console.log('I was written with the mixinMethod3 from the Mixin <br />');
            }
        }),
        Third = Blueprint.create({
            method4 : function () {}
        }).implement(Mixin),

        Forth = Third.create({
            init : function (div) {
                console.log('initializer', div);
            },
            method4 : function () {
                console.log('I was written with the method4 from the Forth and i called the mixinMethod3 <br />');
                this.mixinMethod3();
            }
        }).implement(Mixin);

        it('should match instance methods with base methods', function () {
            expect(first.method1).to.equal(base.method1);
            expect(first.method2).to.equal(base.method2);
        });

        it('should match instance properties with base properties', function () {
            expect(first.property).to.equal('foo');
        });

        it('should match instance method with prototype methods', function () {
            expect(first.method1).to.equal(Object.getPrototypeOf(First).method1);
            expect(first.method2).to.equal(Object.getPrototypeOf(First).method2);
            expect(first.property).to.equal(Object.getPrototypeOf(First).property);
        });


        it('should have methods from Class and extended Class', function () {
            var second = Second.create();
            expect(second.method3, Object.getPrototypeOf(Second).method3, 'Instanciated Object has method from Class child');
            expect(second.method2, base.method2, 'Instanciated Object has method from base Object');
            expect(second.method1, base.method1, 'Instanciated Object has method from base Object');
            expect(second.property, base.property, 'Instanciated Object has property from base Object');
            expect(second.method2, Object.getPrototypeOf(First).method2, 'Instanciated Object has method from extended Class');
            expect(second.method1, Object.getPrototypeOf(First).method1, 'Instanciated Object has method from extended Class');
            expect(second.property, Object.getPrototypeOf(First).property, 'Instanciated Object has property from extended Class');
            expect(7);
        });



        it('should call initialize at instanciation time', function () {
            var div = document.createElement('div'),
                allocatedDiv = document.getElementById('example');

            expect(Forth.create().init(div), allocatedDiv, 'Object was in the DOM meaning that init ran at initialization');
            expect(1);
        });

        it('should have mixin\'s methods', function () {
            var third = Third.create();
            expect(third.mixinMethod1, Object.getPrototypeOf(Mixin).mixinMethod1, 'Class inherited Mixin\'s method');
            expect(third.mixinMethod2, Object.getPrototypeOf(Mixin).mixinMethod2, 'Class inherited Mixin\'s method');
            expect(third.mixinMethod3, Object.getPrototypeOf(Mixin).mixinMethod3, 'Class inherited Mixin\'s method');
            expect(third.method4, Object.getPrototypeOf(Third).method4, 'Class remain with it\'s own method');
            expect(4);
        });

        it('should have mixins methods', function () {
            var mixinObj = {
                mixinObjMethod1 : function () {},
                mixinObjMethod2 : function () {},
                mixinObjMethod3 : function () {}
            },
            Fifth = Blueprint.create({
                method1 : function () {},
                method2 : function () {}
            }).implement(mixinObj),
            fifth = Fifth.create();

            expect(mixinObj.mixinObjMethod1).to.equal(fifth.mixinObjMethod1);
            expect(mixinObj.mixinObjMethod2).to.equal(fifth.mixinObjMethod2);
            expect(mixinObj.mixinObjMethod3).to.equal(fifth.mixinObjMethod3);
            expect(fifth.method1).to.equal(Object.getPrototypeOf(Fifth).method1);

        });

    });

});
