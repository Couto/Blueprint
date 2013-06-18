module.exports = (process.env.BLUEPRINT_COVERAGE) ?
        require('./coverage/Blueprint.js') :
        require('./src/Blueprint.js');
