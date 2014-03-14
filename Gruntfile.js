module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    simplemocha: {
      options: {
        globals: ['should'],
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: ['test/**/*.js', 'test/*.js']
      }
    },

    watch: {
      scripts: {
        files: ['**/*.js', '**/**/*.js'],
        tasks: ['jshint', 'test', 'watch'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('dev', ['jshint', 'test', 'watch']);
  grunt.registerTask('test', ['simplemocha']);
};