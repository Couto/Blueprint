require.config({
    paths: {
        'mocha' : '../node_modules/mocha/mocha',
        'expect': '../node_modules/expect.js/expect',
        'Blueprint' : '../index.js'
    },
    shim: {
        'mocha':  { exports : 'mocha'  },
        'expect': { exports : 'expect' }
    },
    urlArgs: 'cache=' + (+new Date())
});

require([
    'mocha',
    'expect',
    'instantiation.test',
    'parenting.test',
    'static.test'
], function (mocha) { mocha.run(); });
