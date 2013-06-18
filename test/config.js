require.config({
    paths: {
        'mocha' : '../node_modules/mocha/mocha',
        'expect': '../node_modules/expect.js/expect',
        'Blueprint' : '../src/Blueprint'
    },
    shim: {
        'mocha':  { exports : 'mocha'  },
        'expect': { exports : 'expect' }
    },
    urlArgs: 'cache=' + (+new Date())
});

require(['index.test']);
