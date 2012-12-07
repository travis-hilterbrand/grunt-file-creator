/*
 * grunt-file-creator
 * Copyright (c) 2012 Travis Hilterbrand, contributors
 * Licensed under the MIT license.
 */

 module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<config:nodeunit.tests>'
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      }
    },

    // Configuration to be run (and then tested).
    "file-creator": {
      "basic": {
        files: {
          "tmp/basic.txt": function(fs, fd, done) {
            fs.writeSync(fd, 'some basic text');
            done();
          }
        }
      },
      "complex": {
        files: {
          "tmp/complex.txt": function(fs, fd, done) {
            var glob = grunt.file.glob;
            var _ = grunt.util._;
            glob("test/fixtures/sample/**/*.js", function (err, files) {
              var widgets = [];
              _.each(files, function(file) {
                widgets.push(file);
              });

              fs.writeSync(fd, '// this file is auto-generated.  DO NOT MODIFY\n');
              _.each(widgets, function(file, i) {
                fs.writeSync(fd, file + ':' + i + '\n');
              });
              done();
            });
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*-test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Setup a test helper to create some folders to clean.
  grunt.registerTask('copy', 'Copy fixtures to a temp location.', function() {
    //grunt.file.copy('test/fixtures/sample_long/long.txt', 'tmp/sample_long/long.txt');
    //grunt.file.copy('test/fixtures/sample_short/short.txt', 'tmp/sample_short/short.txt');
  });

  // Whenever the 'test' task is run, first create some files to be cleaned,
  // then run this plugin's task(s), then test the result.
  grunt.registerTask('test', ['copy', 'file-creator', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
