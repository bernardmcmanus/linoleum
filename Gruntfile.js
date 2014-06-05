module.exports = function( grunt ) {


    var libs = [
        'js/linoleum.js',
        'js/tile.js'
    ];


    grunt.initConfig({

        pkg: grunt.file.readJSON( 'package.json' ),

        jshint : {
            all : [ 'Gruntfile.js' , 'js/*.js' ]
        },

        clean : ["linoleum-*"],

        replace: [{
            options: {
                patterns: [
                    {
                        match : /(\.\.\/linoleum\-)(.*?)(\.js)/,
                        replacement : '../linoleum-<%= pkg.version %>.js'
                    }
                ]
            },
            files: [
                {
                    src: 'test/index.html',
                    dest: 'test/index.html'
                }
            ]
        }],

        watch: [{
            files: ([ 'package.json' ]).concat( libs ),
            tasks: [ 'dev' ]
        }],

        concat: {
            options: {
                banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
            },
            build: {
                src: libs,
                dest: 'linoleum-<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release : {
                files : {
                    'linoleum-<%= pkg.version %>.min.js' : libs
                }
            }
        }
    });


    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-replace' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );


    grunt.registerTask( 'default' , [
        'jshint',
        'clean',
        'uglify'
    ]);

    grunt.registerTask( 'dev' , [
        'jshint',
        'clean',
        'replace',
        'concat'
    ]);

    grunt.registerTask( 'debug' , [
        'dev',
        'watch'
    ]);

};
