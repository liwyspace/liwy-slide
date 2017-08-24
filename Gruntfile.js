'use strict';
/**
 * liwy-slide
 *
 * www.oscafe.net
 *
 * Copyright (c) 2017
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed MIT */\n',
        
        // Task configuration
        clean: {
            dist: ['dist'],
            docs: ['docs/dist']
        },

        copy: {
            dist: {
                files: [{
                    'dist/LICENSE':'LICENSE',
                    'dist/README.md':'README.md'
                },{
                    expand: true,
                    cwd: 'src/img',
                    src: '*.*',
                    dest: 'dist/assets/'
                }]
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs/src/',
                    src: [ '*' ],
                    dest: 'docs/dist/'
                },{
                    expand: true,
                    cwd: 'dist/',
                    src: [ '**/*.*' ],
                    dest: 'docs/dist/assets/vendors/liwy-slide'
                },{
                    'docs/dist/assets/vendors/jquery.min.js':'bower_components/jquery/dist/jquery.min.js'
                }]
            }
        },

        //编译sass
        sass: {
            dist: {
                options: {
                    outputStyle: 'compact'
                },
                files: [{
                    expand: true,
                    cwd: 'src/scss/',
                    src: '*.scss',
                    dest: 'dist/assets/',
                    ext: '.css'
                }]
            },
            docs: {
                options: {
                    outputStyle: 'expanded',
                    // includePaths: [ '<%= app.docs.src %>/assets/scss/']
                },
                files: [{
                    expand: true,
                    cwd: 'docs/src/assets/scss/',
                    src: '*.scss',
                    dest: 'docs/dist/assets/css/',
                    ext: '.css'
                }]
            },
        },

        //为css添加浏览器前缀
        autoprefixer: {
            options: {
                browser:['last 2 versions', 'ie7', 'ie8', 'ie9', 'ie10', 'ie11']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/assets/',
                    src: '*.css',
                    dest: 'dist/assets'
                }]
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs/src/assets/css',
                    src: '*.css',
                    dest: 'docs/src/assets/css'
                }]
            }
        },

        //校验js语法
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            dist: {
                src: 'src/js/*.js'
            },
            docs: {
                src: 'docs/src/assets/js/*.js'
            }
        },

        //合并js
        concat: {
            dist: {
                files: {
                    'dist/<%=pkg.name%>.js': 'src/js/*'
                }
            },
            docs: {
                src: ['docs/src/assets/js/*.js'],
                dest: 'docs/dist/assets/js/index.js'
            }
        },

        //压缩css
        cssmin: {
            dist: {
                src: 'dist/assets/liwy-slide.css',
                dest: 'dist/assets/liwy-slide.min.css'
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs/dist/assets/css/',
                    src: '*.css',
                    dest: 'docs/dist/assets/css/',
                    ext: '.min.css'
                }]
            }
        },

        //压缩图片
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/assets/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'dist/assets'
                }]
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs/src/assets/img/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'docs/dist/assets/img'
                }]
            }
        },

        //添加banner
        usebanner: {
            options: {
                banner: '<%=banner%>',
                linebreak: false
            },
            dist: {
                files: {
                    src: ['dist/assets/*.css','dist/<%=pkg.name%>.js']
                }
            },
            docs: {
                files: {
                    src: ['docs/dist/assets/css/*.css','docs/dist/assets/js/*.js']
                }
            }
        },

        //压缩js
        uglify: {
            options: {
                banner: '<%=banner%>'
            },
            dist: {
                files:{
                    'dist/<%=pkg.name%>.min.js':'dist/<%=pkg.name%>.js'
                }
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs/dist/assets/js/',
                    src: '*.js',
                    dest: 'docs/dist/assets/js/',
                    ext: '.min.js'
                }]
            }
        },

        //zip打包
        compress: {
            zip: {
                options: {
                    archive: 'docs/dist/download/liwy-slide.<%= pkg.version %>.zip'
                },
                files: [ {
                    expand: true,
                    cwd: 'dist/',
                    src: [ '**' ],
                    dest: 'liwy-slide.<%= pkg.version %>'
                }]
            }
        },


        //md5重命名
        rev: {
            dist: {
                files: {
                    src: [
                        'docs/dist/assets/css/{,*/}*.min.css',
                        'docs/dist/assets/js/{,*/}*.min.js',
                        'docs/dist/assets/img/{,*/}*.*',
                        'docs/dist/download/*.zip',
                        'docs/dist/*.{ico,png}'
                    ]
                }
            }
        },

        //替换压缩后路径与rev重命名后路径
        usemin: {
            options: {
                blockReplacements: {
                    css: function(block) {
                        return '<link rel="stylesheet" type="text/css" href="'+block.dest+'">';
                    },
                    js: function(block) {
                        return '<script type="text/javascript" src="'+block.dest+'"></script>';
                    }
                }
            },
            html: 'docs/dist/index.html',
            css: 'docs/dist/assets/css/{,*/}*.css',

        },

        //压缩html
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true
                },
                files: [{
                    expand: true,
                    cwd: 'docs/dist',
                    src: '*.html',
                    dest: 'docs/dist'
                }]
            }
        },

        //开启web服务器
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: true,
                hostname: 'localhost',
                // keepalive: true
            },
            docs: {
                options: {
                    open: {
                        target: 'http://localhost:9000/'
                    },
                    middleware: function(connect, options, middlwares) {
                        return [
                            require('connect-livereload')({
                                hostname:'localhost',
                                port:35729
                            }),
                            require('serve-static')('docs/dist'),
                            require('serve-index')('docs/dist')
                        ];
                    }
                }
            }
        },
        
        //监听文件变化
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: [ 'src/scss/*.scss' ],
                tasks: [ 'sass:dist', 'autoprefixer:dist', 'cssmin:dist', 'usebanner:dist', 'copy:docs' ]
            },
            js: {
                files: [ 'src/js/*.js' ],
                tasks: [ 'jshint:dist', 'concat:dist', 'usebanner:dist', 'uglify:dist', 'copy:docs']
            },
            sassDocs: {
                files: [ 'docs/src/assets/scss/*.scss' ],
                tasks: [ 'sass:docs', 'autoprefixer:docs', 'cssmin:docs','usebanner:docs' ]
            },
            jsDocs: {
                files: [ 'docs/src/assets/js/*.js' ],
                tasks: [ 'jshint:docs', 'concat:docs','usebanner:docs', 'uglify:docs' ]
            },
            staticDocs: {
                files: [ 'docs/src/*' ],
                tasks: [ 'copy:docs']
            },
            imageDocs: {
                files: [ 'docs/src/assets/img/*' ],
                tasks: [ 'imagemin:docs']
            }
        },

        //通过karma+jasmine进行js单元测试
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            test: {
                singleRun: true,
                autoWatch: false
            },
            watch: {
                singleRun: false,
                autoWatch: true
            }
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    // My task
    grunt.registerTask('dist', ['clean:dist','copy:dist', 'sass:dist', 'autoprefixer:dist', 
        'jshint:dist', 'concat:dist', 'cssmin:dist','imagemin:dist','usebanner:dist', 
        'uglify:dist']);

    grunt.registerTask('docs', function(target) {
        var docs = ['dist', 'clean:docs', 'copy:docs', 'jshint:docs', 'concat:docs', 'sass:docs', 
            'autoprefixer:docs', 'cssmin:docs','imagemin:docs','usebanner:docs', 'uglify:docs', 'compress'];
        if(target === 'dist') {
            return grunt.task.run(docs.concat(['rev', 'usemin', 'htmlmin']));
        } 
        grunt.task.run(docs.concat(['connect:docs','watch']));

    });

    grunt.registerTask('test', function (target) {
        if (target === 'watch') {
            return grunt.task.run(['jshint:dist', 'karma:watch']);
        }
        grunt.task.run(['jshint:dist', 'karma:test']);
    });

    grunt.registerTask('default',['docs']);
};

