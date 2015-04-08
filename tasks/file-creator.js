/*
 * Grunt Task File
 * ---------------
 *
 * Task: file-creator
 * Description: A grunt task that creates/writes to files from Javascript functions in the grunt config (useful for config files, etc).
 *
 */
'use strict';

var cli = require('grunt/lib/grunt/cli');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  var util = grunt.util || grunt.utils;
  var _ = util._;
  var async = util.async;

  grunt.registerMultiTask("file-creator", "Creates/writes to files from Javascript functions in the grunt config.", function(prop) {

    var taskDone = this.async();

    var allOptions = this.options();
    var defaultOptions = {
      openFlags: 'w'
    };

    var fd, fileCount = 0;
    var targetFiles = (_.isUndefined(this.data.files)) ? this.data : this.data.files;

    if (_.isArray(targetFiles)) {
      // if target is an array, assume it is split into [{file,method},{file,method}] and do nothing
    }
    // if target is an object, turn it into an array
    else if (_.isObject(targetFiles)) {
      targetFiles = keysToArray(targetFiles);
    }

    grunt.verbose.writeln('targetFiles', targetFiles);

    if (targetFiles) {
      async.forEachSeries(targetFiles, function(item, next) {
        var filepath = item.file;
        var method = item.method;
        if (_.isUndefined(filepath) || !_.isString(filepath)) {
          grunt.log.error('Missing filepath', filepath);
          return;
        }
        if (_.isUndefined(method)) {
          grunt.log.error('Missing expansion method', method);
          return;
        }
        if (filepath === 'options') {
          // targets cannot be named "options" so that global-options are possible
          return;
        }

        grunt.log.writeln('Writing file [' + filepath + ']');

        if (method) {
          // find options
          // targetOptions > globalOptions > default
          var options = this.data.options || {};
          options = _.extend(defaultOptions, allOptions, options);
          grunt.verbose.writeflags(options, 'Options');

          // create path (if needed)
          var dir = path.dirname(filepath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, '0777', true);
          }

          // open file
          fd = fs.openSync(filepath, options.openFlags);

          // call method associated from Gruntfile.js config
          method(fs, fd, function() {
            fs.closeSync(fd);
            fileCount++;

            next();
          });
        }
        else {
          grunt.verbose.writeln( ('Unable to find an associated function for [' + filepath + ']').yellow );
        }
      }.bind(this),
      function() {

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }

        // Otherwise, print a success message.
        grunt.log.ok(fileCount + ' file(s) written.');

        taskDone();
      }.bind(this));
    }

  });

  // flattens to array
  var keysToArray = function(o) {
    var a = [];
    _.each(o, function(value, key) {
      a.push({file:key,method:value});
    });
    return a;
  };
};
