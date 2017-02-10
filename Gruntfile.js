var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
    var externalLibs = [
        'classnames',
        'lodash',
        'moment',
        'react',
        'react-addons-css-transition-group',
        'react-addons-pure-render-mixin',
        'react-addons-update',
        'react-dom',
        'react-dom/server',
        'react-draggable',
        'underscore.string'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env : {
            options : {
                //Shared Options Hash
            },
            prod : {
                BABEL_ENV : 'production'
            }
        },
        watch: {
            app: {
                files: ['src/**/*.js'],
                tasks: ['browserify:app']
            },
            locale: {
                files: ['locales/**/*.json'],
                tasks: ['concat-locales']
            },
            styles: {
              files: ['assets/less/**/*.less'], // which files to watch
              tasks: ['less','concat','clean'],
              options: {
                nospawn: true
              }
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true // enable source mapping
                },
                transform: [
                    ["babelify"]
                ]
            },
            app: {
                src: "src/app.js",
                dest: 'assets/js/app.js',
                options: {
                  external: externalLibs
                }
            },
            vendor: {
                // External modules that don't need to be constantly re-compiled
                src: ['.'],
                dest: 'assets/js/vendor.js',
                options: {
                  debug: false,
                  require: externalLibs
                }
            }
        },
        less: {
            options: {
                //cleancss: true
                //compress:true
            },
            files: {
                expand: true,
                cwd: "assets/less",
                src: ["common/*.less","*.less"],
                dest: "assets/css-temp",
                ext: ".css"
            }
        },
        concat: {
            css: {
                src: ['assets/css-temp/**/*.css'],
                dest: "assets/css/all.css"
            }
        },
        eslint: {
            target: [
                'Gruntfile.js',
                'src/**/*.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('clean', function() {
        console.log('removing css-temp folder...');
        fse.removeSync('assets/css-temp');
    });
    grunt.registerTask('concat-locales', function() {
        console.log('concat locale files...');
        fs.readdirSync('locales').forEach(lng => {
            let res = {};
            fs.readdirSync(`locales/${lng}`).forEach(filepath => {
                res[path.basename(filepath, '.json')] = fse.readJsonSync(`locales/${lng}/${filepath}`);
            })
            fse.outputJsonSync(`assets/locales/${lng}.json`, res);
        });
    });
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('default', ['browserify:vendor','browserify:app','less', 'concat', 'clean', /*'eslint',*/'concat-locales', 'watch'])
};
