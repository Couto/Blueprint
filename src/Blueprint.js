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
(function(root) {

    'use strict';

    var Blueprint = {
        /**
         * Describe what this method does
         *
         * @public
         * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String|Object|Array|Boolean|Number
         */
        create: function(methods) {
            var instance;

            function F() {}
            F.prototype = this;
            instance = new F();

            if (methods) {
                this.implement.call(instance, methods);
            }

            return instance;
        },
        /**
         * Describe what this method does
         *
         * @public
         * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String|Object|Array|Boolean|Number
         */
        implement: function(methods) {
            if (methods) {
                var k;
                for (k in methods) {
                    if (methods.hasOwnProperty(k)) {
                        this[k] = methods[k];
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
        bind: function(methods) {
            var methds = Object.prototype.toString.call(methods) !== '[object Array]' ? [methods] : methods,
                i = methds.length - 1;

            for (i; i >= 0; i -= 1) {
                this[methds[i]] = this.proxy(this[methds[i]], this);
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
