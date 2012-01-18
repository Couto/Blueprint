/**
 * The MIT License (MIT)
 * Copyright (c) 2012 Luis Couto
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Blueprint - Sugar syntax for Prototypal Inheritance
 *
 * @author Luis Couto
 * @contact lcouto87@gmail.com
 * @version 0.1
 *
 * @param {Object} methods Object with methods
 * @returns Function
 */
function Blueprint (methods) {
    var blueprint;
    
    
    /**
     * Extends an object with another given object
     *
     * @private
     
     * @param {Object} target Object's that will get the new methods
     * @returns undefined
     */
    function extend (methods, target) {
        var k;
        for (k in methods) {
            if (methods.hasOwnProperty(k)){ target[k] = methods[k]; }
        }
    }
    
    
    /**
     * For an Array of Objects, add their methods/properties to 
     * target's prototype
     *
     * @private
     * @param {Array} arr Array of objects that will give their methods
     * @param {Object} Target that will receive the methods
     * @returns undefined
     */
    
    function implement (arr, target){
        var i = arr.length - 1,
            k, constructorBck;
            
        for (i; i >= 0; i -= 1) {
            if (arr[i].prototype.constructor) {
                constructorBck = arr[i].prototype.constructor;
                delete arr[i].prototype.constructor;
                extend(arr[i].prototype, target.prototype);
                arr[i].prototype.constructor = constructorBck;
            } else { extend(arr[i].prototype, target.prototype); }
        }
    }
    
    
    /**
     * Fixes the context in given methods
     *
     * @private
     * @param {Function} 
     * @returns function handler with fixed context
     */
    function proxies (arr, context, target) {
        var proxy = function(func){
            if (Function.prototype.bind) { return func.bind(context); } 
            else {
                return function () {
                    return func.apply(context, arguments);
                };
            }
        }, i = arr.length - 1;
        
        for (i; i >= 0; i -=1 ) {
            target[arr[i]] = proxy(target[arr[i]], blueprint);
        }
    }
    
    
    
    /**
     * Copies the given object into a freshly 
     * created empty function's prototype
     *
     * @private
     * @param {Object} o Object
     * @returns {Function} Instance
     * @type Function
     */
    function clone (o) {
        function F(){}
        F.prototype = o;
        return new F();
    }
    
    
    
    blueprint = methods.init || function blueprint() {};
    
    if (methods.Extends) {
        blueprint.Super = methods.Extends.prototype;
        blueprint.prototype = clone(blueprint.Super);
        extend(methods, blueprint.prototype);
    } else { blueprint.prototype = methods; }
    blueprint.prototype.constructor = blueprint;
    
    if (methods.Implements) { implement(methods.Implements, blueprint); }
    if (methods.Bind)       { proxies(methods.Bind, blueprint, blueprint.prototype); }
    if (methods.Static)     {
        extend(methods.Static, blueprint);
        delete blueprint.prototype.Static;
    }
    
    
    
    return blueprint;
}