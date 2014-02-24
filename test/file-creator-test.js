'use strict';

var fs = require('fs');
var grunt = require('grunt');

exports.clean = {
  basic: function(test) {
    test.expect(1);

    var found = fs.readFileSync('tmp/basic.txt');
    test.equal(found, 'some basic text', 'should generate a file containing some basic text');

    test.done();
  },
  complex: function(test) {
    test.expect(1);

    var found = fs.readFileSync('tmp/complex.txt');
    var expected = "// this file is auto-generated.  DO NOT MODIFY\ntest/fixtures/sample/1.js:0\ntest/fixtures/sample/sub/2.js:1\n";
    test.equal(found, expected, 'should generate a file containing some complex text');

    test.done();
  },
  expanded: function(test) {
    test.expect(1);

    var found = fs.readFileSync('tmp/expanded.txt');
    var expected = "the expanded file format allows keys to be variables";
    test.equal(found, expected, 'should generate a file using the expanded format');

    test.done();
  },
  conditional: function(test) {
    test.expect(1);

    var found = fs.readFileSync('tmp/conditional.txt');
    var expected = "filenames can be set using grunt templates";
    test.equal(found, expected, 'should generate a file using a grunt template variable');

    test.done();
  },
  option: function(test) {
    test.expect(1);

    var found = fs.readFileSync('tmp/option.txt');
    var expected = "filenames can be set as grunt options (passed on the command line)";
    test.equal(found, expected, 'should generate a file using grunt options');

    test.done();
  },
  old: function(test) {
    test.expect(1);

    var found = fs.readFileSync('tmp/old.txt');
    test.equal(found, 'old options format', 'should generate a file using the old options format');

    test.done();
  }
};
