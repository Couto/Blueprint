/**
 *
 * Blueprint - Sugar syntax for Prototypal Inheritance
 *
 * @author Luis Couto
 * @contact lcouto87@gmail.com
 * @version 0.2
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
 *      }).implement(Bezier);
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
(function(root) {

    'use strict';

    var Blueprint = {
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
            var instance,
                clone = Object.create || function (obj) {
                    function F() {}
                    F.prototype = obj;
                    return new F();
                };

            instance = clone(this);

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
         * Helper method to fix the context (equivalent to ES5 Function.bind)
         *
         * @public
         * @param {Function} fn Function that will be binded to the new context
         * @param {Object} context Context
         * @returns {Function} function proxied to the new context
         */
        proxy : function(fn, context) {
            var isType = Object.prototype.toString,
                slice = Array.prototype.slice,
                tmp, args, proxy;

            if (isType.call(context) === '[object String]') {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }

            if (isType.call(fn) !== '[object Function]') {
                return undefined;
            }

            args = slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context, args.concat(slice.call(arguments)));
            };

            return proxy;
        }

    };

    /**
     * Expose Blueprint to the Global context with support for AMD and Node Modules
     */
     if (typeof define === "function" && define.amd) {
         define("Blueprint", [], function () { return Blueprint; } );
     } else if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports) {
         module.exports = Blueprint;
     } else {
         root.Blueprint = Blueprint;
     }


}(this));
