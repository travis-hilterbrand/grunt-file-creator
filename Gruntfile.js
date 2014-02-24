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

    conditional: {
      file: 'conditional.txt'
    },

    // Configuration to be run (and then tested).
    "file-creator": {
      "basic": {
        "tmp/basic.txt": function(fs, fd, done) {
          fs.writeSync(fd, 'some basic text');
          done();
        }
      },
      "complex": {
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
      },

      "expanded": {
        files: [
          {
            file: "tmp/" + "expanded.txt",
            method: function(fs, fd, done) {
              fs.writeSync(fd, 'the expanded file format allows keys to be variables');
              done();
            }
          }
        ]
      },

      "conditional": {
        files: [
          {
            file: "tmp/" + '<%= conditional.file %>',
            method: function(fs, fd, done) {
              fs.writeSync(fd, 'filenames can be set using grunt templates');
              done();
            }
          }
        ]
      },

      "option": {
        files: [
          {
            file: "tmp/" + (grunt.option('option-name') || 'option.txt'),
            method: function(fs, fd, done) {
              fs.writeSync(fd, 'filenames can be set as grunt options (passed on the command line)');
              done();
            }
          }
        ]
      },
  
      "old": {
        files: {
          "tmp/old.txt": function(fs, fd, done) {
            fs.writeSync(fd, 'old options format');
            done();
          }
        }
      }
    },

    clean: [
      "tmp/"
    ],

    // Unit tests.
    nodeunit: {
      tests: ['test/*-test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the 'test' task is run, first create some files to be cleaned,
  // then run this plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'file-creator', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
