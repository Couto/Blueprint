module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        files: {
            src: ['index.js', 'src/**/*.js'],
            test: ['test/**/*.js'],
            all: ['README.md', 'index.js', 'src/**/*.js', 'test/**/*.js']
        },

        jshint: {
            files: '<%= files.all %>',
            options: {
                jshintrc: '.jshintrc'
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/Blueprint.min.js': ['src/Blueprint.js']
                }
            }
        },

        clean: {
            coverage: ['coverage']
        },

        cafemocha: {

            unit: {
                src: '<%= files.test %>',
                options: {
                    ui: 'exports',
                    reporter: 'nyan'
                }
            },
            coverage: {
                src: '<%= files.test %>',
                options: {
                    ui: 'exports',
                    reporter: 'html-cov',
                    coverage: {
                        output: 'coverage/index.html',
                        env: 'BLUEPRINT_COVERAGE'
                    }
                }
            }
        },

        coverage: {
            test: {
                files: { 'coverage': 'src' }
            }
        }
    });

    grunt.registerMultiTask('coverage', 'Create code coverage', function () {
        var spawn = require('child_process').spawn,
            done = this.async(),
            coverage = spawn('jscoverage', [this.files[0].src, this.files[0].dest]),
            error;

        coverage.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        coverage.stderr.on('data', function (data) {
            error = new Error(data.toString());
        });

        coverage.on('close', function (code) { done(error); });
    });

    // Load Grunt Tasks
    Object.keys(require('./package.json').devDependencies).forEach(function (key) {
        return (/^grunt-/).test(key) && grunt.loadNpmTasks(key);
    });

    grunt.registerTask('default', ['jshint', 'cafemocha:unit']);
    grunt.registerTask('cov', ['clean:coverage', 'coverage:test', 'cafemocha:coverage']);
    grunt.registerTask('dist', ['default', 'uglify']);

};
