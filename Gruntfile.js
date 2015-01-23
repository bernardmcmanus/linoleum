module.exports = function( grunt ) {


  var cp = require( 'child_process' );
  var httpd = require( 'httpd-node' );
  var fs = require( 'fs-extra' );
  var colors = require( 'colors' );


  httpd.environ( 'root' , __dirname );


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
      build: [ 'dist' ],
      dev: [ 'live' ],
      tmp: [ 'linoleum-tmp.js' ]
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
              replacement: '\"main\": \"dist/<%= pkg.name %>-<%= pkg.version %>.min.js\"'
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
            replacement: '<script src=\"../dist/linoleum-<%= pkg.version %>.js\"></script>'
          }]
        },
        files: [{
          src: 'live/index.html',
          dest: 'live/index.html'
        }]
      }
    },

    watch: [{
      files: [ 'Gruntfile.js' , 'package.json' , 'js/**/*' , 'dev/*' , 'build/*.js' ],
      tasks: [ 'dev' ]
    }],

    concat: {
      options: {
        banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
      },
      build: {
        src: 'linoleum-tmp.js',
        dest: 'dist/linoleum-<%= pkg.version %>.js'
      }
    },

    uglify: {
      options: {
        banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      release : {
        files : {
          'dist/linoleum-<%= pkg.version %>.min.js' : [ 'dist/linoleum-<%= pkg.version %>.js' ]
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


  grunt.registerTask( 'ensureDist' , function() {
    fs.ensureDirSync( './dist' );
  });


  grunt.registerTask( 'git-hash' , function() {

    grunt.task.requires( 'git-describe' );

    var rev = grunt.config.get( 'git-version' );
    var matches = rev.match( /\-?([A-Za-z0-9]{7})\-?/ );

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


  grunt.registerTask( 'git-branch' , function() {
    var done = this.async();
    cp.exec( 'git status' , function( err , stdout , stderr ) {
      if (!err) {
        var branch = stdout
          .split( '\n' )
          .shift()
          .replace( /on\sbranch\s/i , '' );
        grunt.config.set( 'git-branch' , branch );
      }
      done();
    });
  });


  grunt.registerTask( 'build:amd' , function() {
    var done = this.async();
    cp.exec( 'npm run build' , done );
  });


  grunt.registerTask( 'build:describe' , function() {
    var pkg = grunt.config.get( 'pkg' );
    var dist = pkg.name + '-' + pkg.version;
    var dev = dist + '.js';
    var prod = dist + '.min.js';
    var bytesInit = fs.statSync( 'dist/' + dev ).size;
    var bytesFinal = fs.statSync( 'dist/' + prod ).size;
    var kbInit = (Math.round( bytesInit / 10 ) / 100);
    var kbFinal = (Math.round( bytesFinal / 10 ) / 100);
    console.log('File ' + prod.cyan + ' created: ' + (kbInit + ' kB').green + ' \u2192 ' + (kbFinal + ' kB').green);
  });


  grunt.registerTask( 'always' , [
    'jshint',
    'clean',
    'ensureDist',
    'git-describe',
    'git-hash',
    'git-branch',
    'build:amd',
    'concat',
    'clean:tmp'
  ]);


  grunt.registerTask( 'default' , [
    'always',
    'uglify',
    'replace:packages',
    'build:describe'
  ]);


  grunt.registerTask( 'dev' , [
    'always',
    'createLive',
    'replace:debug'
  ]);


  grunt.registerTask( 'debug' , [
    'dev',
    'startServer',
    'watch'
  ]);

};












