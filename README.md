grunt-file-creator
==================

A grunt task that creates/writes to files from Javascript functions in the grunt config (useful for config files, etc).

####_Grunt ~0.4 Required_

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-file-creator --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-file-creator');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


## The file-creator task

### Overview

This task is a multi task so any targets, files and options should be specified according to the multi task documentation.

### Options

#### openFlags
Type: `String`  
Default: 'w'

The flags passed to the open file method.

[See the node.js fs docs for more info](http://nodejs.org/api/fs.html)

### Usage Examples

#### Write a file

In this example, running `grunt file-creator:basic` (or `grunt file-creator` because `file-creator` is a [multi task]()) will write a simple string to the file *basic.txt* under the folder *dist*.

```js
// Project configuration.
grunt.initConfig({
  "file-creator": {
    "basic": {
      "dist/basic.txt": function(fs, fd, done) {
        fs.writeSync(fd, 'some basic text');
        done();
      }
    }
  }
});
```

#### Iterating a folder and writing the contents to a file.

In this example, running `grunt file-creator:folder` (or `grunt file-creator` because `file-creator` is a [multi task]()) will write the filtered contents of a folder to the file *folder.txt* under the folder *dist*.  

The filtering is performed using the glob included with grunt (node-glob).

The glob operation is asynchronous.  The target iteration performed by file-creator will wait until the done() method is called before moving on to the next target.

```js
// Project configuration.
grunt.initConfig({
  "file-creator": {
    options: {
      openFlags: 'w'
    },
    "folder": {
      "dist/folder.txt": function(fs, fd, done) {
          var glob = grunt.file.glob;
          var _ = grunt.util._;
          glob('test/fixtures/sample/**/*.js', function (err, files) {
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
  }
});
```

#### Specifying filenames conditionally using grunt templates

For more information, see the grunt documentation on templates (http://gruntjs.com/api/grunt.template).

```js
  grunt.initConfig({
    conditional: {
      file: 'conditional.txt'
    },

    "file-creator": {
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
      }
    }
  });
```

#### Specifying filenames on the command line using grunt options

For more information, see the grunt documentation on options (http://gruntjs.com/api/grunt.option).

Using this command line, the file can be set conditionally using options.
<pre>
grunt file-creator --option-name=myfile.txt
</pre>


```js
  grunt.initConfig({
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
      }
    }
  });

```


For fully-working examples, see the test folder.
