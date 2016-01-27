'use strict';

var
  grunt = require('grunt'),
  Newman = require('newman'),
  request = require('unirest'),
  fs = require('fs'),
  JSON5 = require('json5');



module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('fuzz_newman', 'Run Newman', function() {
    var options = this.options();
    var done = this.async();
    try {
      if (options.evnJson) {
        options.envJson = JSON5.parse(fs.readFileSync(options.envJson, 'utf8'));
      }
      // Iterate over all specified file groups.
      if (options.collection) {
        var requestJSON = JSON5.parse(fs.readFileSync(options.collection, 'utf8'));

        Newman.execute(requestJSON, options, function () {
          done();
        });

      } else {

        request.get(options.url).type('json').end(function (data) {
          if (data.error) {
            grunt.fail.fatal('Unable to fetch a valid response. Error: ' + data.code);
          }
          Newman.execute(data.body, options, function () {
            done();
          });
        });
      }
    } catch(e) {
      console.log(e.message);
    }

    });

};
