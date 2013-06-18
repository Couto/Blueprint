/**
 *
 * Blueprint - Sugar syntax for Prototypal Inheritance
 *
 * @author Luis Couto
 * @contact lcouto87@gmail.com
 * @version 0.0.3
 *
 * @license
 *     This program is free software. It comes without any warranty, to
 *     the extent permitted by applicable law. You can redistribute it
 *     and/or modify it under the terms of the Do What The Fuck You Want
 *     To Public License, Version 2, as published by Sam Hocevar. See
 *     http://sam.zoy.org/wtfpl/COPYING for more details.
 *
 * @copyright 2012, Luis Couto
 *
 * @example
 *      var Polygon = Blueprint({
 *          init : function (vertices) {
 *              this.vertices = vertices;
 *          },
 *          draw : function () {}
 *      }).implement(Bezier).bind('draw');
 *
 *      var FilledPolygon = Polygon.create({
 *          init : function (vertices, color) {
 *              this.color = color;
 *              Object.getPrototypeOf(FilledPolygon).call(this, vertices);
 *          }
 *      });
 *
 * @param {Object} methods Object
 * @returns Function
 */
(function (root) {

    'use strict';

    var slice = Array.prototype.slice,

        /**
         * Helper method to fix the context (equivalent to ES5 Function.bind)
         *
         * @public
         * @param {Function} fn Function that will be binded to the new context
         * @param {Object} context Context
         * @returns {Function} function proxied to the new context
         */
        proxy = (function () {
            if (Function.prototype.bind) {
                return function (fn, context) {
                    return fn.bind(context);
                };
            } else {
                return function (fn, context) {
                    var args = slice.call(arguments, 2);
                    return function () {
                        return fn.apply(context, args.concat(slice.call(arguments)));
                    };
                };
            }
        }()),

        /**
         * Helper method to beget objects
         *
         * @public
         * @param {Object} object to extend
         * @returns {Object} extended object
         */
        clone = Object.create || function (obj) {
            function F() {}
            F.prototype = obj;
            return new F();
        },

        Blueprint = {
            /**
             * Creates a new instance of the current Blueprint
             * if an object is given as a parameter, it will also extend
             * the new instance with that object.
             *
             * @public
             * @param {Object} [methods] if given, it will extend the created instance with the object given.
             * @returns {Object} a new instance of the object
             */
            create: function (methods) {
                var instance = clone(this);

                if (methods) {
                    this.implement.call(instance, methods);
                }

                return instance;
            },
            /**
             * Adds an object properties/methods to the current instance
             *
             * @public
             * @param {Object} obj An object whose properties/methods will be copied to the current instance
             * @returns {Object} this
             */
            implement: function (obj) {
                if (obj) {
                    var k;
                    for (k in obj) {
                        if (obj.hasOwnProperty(k)) {
                            this[k] = obj[k];
                        }
                    }
                }
                return this;
            },
            /**
             * Describe what this method does
             *
             * @public
             * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
             * @returns Describe what it returns
             * @type String|Object|Array|Boolean|Number
             */
            bind: function (methods) {
                methods = [].concat(methods);
                var i = methods.length - 1;

                for (i; i >= 0; i -= 1) {
                    this[methods[i]] = proxy(this[methods[i]], this);
                }

                return this;
            }

        };

    /**
     * Expose Blueprint to the Global context with support for AMD and Node Modules
     */
    if (typeof define === 'function' && define.amd) {
        define('Blueprint', [], function () { return Blueprint; });
    } else if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports) {
        module.exports = Blueprint;
    } else {
        root.Blueprint = Blueprint;
    }

}(this));
