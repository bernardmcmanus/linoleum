module.exports = function( grunt ) {


  var httpd = require( 'httpd-node' );
  var fs = require( 'fs-extra' );


  httpd.environ( 'root' , __dirname );


  var SRC = [
    'js/linoleum.js',
    'js/grid.js',
    'js/tiledata.js'
  ];


  var INCLUDES = [
    'js/includes/emoney-0.2.3.min.js',
    'js/includes/asap.js'
  ];


  var BUILD = INCLUDES.concat( SRC );


  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    'git-describe': {
      'options': {
        prop: 'git-version'
      },
      dist : {}
    },

    jshint : {
      all : [ 'Gruntfile.js' , 'js/*.js' ]
    },

    clean: {
      all: [ 'linoleum-*.js' , 'live' ]
    },

    replace: {
      packages: {
        options: {
          patterns: [
            {
              match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
              replacement: '\"version\": \"<%= pkg.version %>\"'
            },
            {
              match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
              replacement: '\"main\": \"<%= pkg.name %>-<%= pkg.version %>.min.js\"'
            }
          ]
        },
        files: [
          {
            src: 'package.json',
            dest: 'package.json'
          },
          {
            src: 'bower.json',
            dest: 'bower.json'
          }
        ]
      },
      debug: {
        options: {
          patterns: [{
            match: /<\!(\-){2}\s\[scripts\]\s(\-){2}>/,
            replacement: '<script src=\"../linoleum-<%= pkg.version %>.js\"></script>'
          }]
        },
        files: [{
          src: 'live/index.html',
          dest: 'live/index.html'
        }]
      }
    },

    watch: [{
      files: [ 'Gruntfile.js' , 'package.json' , 'js/**/*' , 'dev/*' ],
      tasks: [ 'dev' ]
    }],

    concat: {
      options: {
        banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
      },
      build: {
        src: BUILD,
        dest: 'linoleum-<%= pkg.version %>.js'
      }
    },

    uglify: {
      options: {
        banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      release : {
        files : {
          'linoleum-<%= pkg.version %>.min.js' : BUILD
        }
      }
    }
  });


  [
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-git-describe',
    'grunt-replace',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-watch'
  ]
  .forEach( grunt.loadNpmTasks );


  grunt.registerTask( 'startServer' , function() {
    var server = new httpd();
    server.setHttpDir( 'default' , '/' );
    server.start();
  });


  grunt.registerTask( 'createLive' , function() {
    var src = __dirname + '/dev';
    var dest = __dirname + '/live';
    fs.copySync( src , dest );
  });


  grunt.registerTask( 'createHash' , function() {

    grunt.task.requires( 'git-describe' );

    var rev = grunt.config.get( 'git-version' );
    var matches = rev.match( /(\-{0,1})+([A-Za-z0-9]{7})+(\-{0,1})/ );

    var hash = matches
      .filter(function( match ) {
        return match.length === 7;
      })
      .pop();

    if (matches && matches.length > 1) {
      grunt.config.set( 'git-hash' , hash );
    }
    else{
      grunt.config.set( 'git-hash' , rev );
    }
  });


  grunt.registerTask( 'always' , [
    'jshint',
    'clean',
    'git-describe',
    'createHash'
  ]);


  grunt.registerTask( 'default' , [
    'always',
    'uglify',
    'replace:packages'
  ]);


  grunt.registerTask( 'dev' , [
    'always',
    'concat',
    'createLive',
    'replace:debug'
  ]);


  grunt.registerTask( 'debug' , [
    'dev',
    'startServer',
    'watch'
  ]);

};












