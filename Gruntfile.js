module.exports = function( grunt ) {

    var libs = [
        'js/linoleum.js',
        'js/tile.js'
    ];

    grunt.initConfig({

            pkg: grunt.file.readJSON('package.json'),

            clean : ["linoleum-v*"],

            uglify : {
                options : {
                    banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                release : {
                    files : {
                        'linoleum-v<%= pkg.version %>.min.js' : libs
                    }
                }
            },

            "git-describe" : {
                "options" : {
                    prop : "git-version"
                }
            },

            jshint : {
                all : [ 'Gruntfile.js', 'js/linoleum.js', 'js/tile.js' ]
            }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-git-describe');

    grunt.registerTask('default', ['jshint','git-describe', 'clean', 'uglify']);

};