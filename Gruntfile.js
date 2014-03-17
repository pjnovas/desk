
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! \n* <%= pkg.title || pkg.name %> - v<%= pkg.version %>' +
            '\n* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> ' +
            '\n* <%= pkg.homepage ? pkg.homepage : "" %> ' +
            '\n*/ \n\n',

    paths: {
      app: {
        root: "client/app/"
      },
      vendor: {
        js: "client/vendor/scripts/",
        css: "client/vendor/styles/"
      },
      dist: {
        root: "client/dist/",
        appName: "app.js",
        vendorName: "vendor.js",
        vendorCSSName: "vendor.css",
        exportJS: "public/js/",
        exportCSS: "public/styles/"
      }
    },

    clean: {
      before: {
        src: [
          "<%= paths.app.root %>views/**/*.hbs.js", 
          "<%= paths.dist.root %>*",
          "!<%= paths.dist.root %>.gitignore"
        ],
      },
      after: {
        src: [
          "<%= paths.app.root %>views/**/*.hbs.js"
        ]
      } 
    },

    handlebars: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'client/app/views/',
            src: ['**/*.hbs'],
            dest: 'client/app/views/',
            ext: '.hbs.js',
          },
        ]
      }
    },

    browserify: {
      app: {
        options:{
          extension: [ '.js' ]
        },
        src: ['<%= paths.app.root %>index.js'],
        dest: '<%= paths.dist.root %><%= paths.dist.appName %>'
      }
    },

    concat: {
      styles: {
        src: [
            '<%= paths.vendor.css %>bootstrap.min.css'
          , '<%= paths.vendor.css %>**/*.css'
         ],
        dest: '<%= paths.dist.root %><%= paths.dist.vendorCSSName %>'
      },
      vendor: {
        options: {
          separator: ';',
        },
        src: [
            '<%= paths.vendor.js %>jquery.min.js'
          , '<%= paths.vendor.js %>underscore.min.js'
          , '<%= paths.vendor.js %>backbone.min.js'

          , '<%= paths.vendor.js %>backbone.marionette.min.js'
          , '<%= paths.vendor.js %>bootstrap.min.js'
          , '<%= paths.vendor.js %>**/*.js'
         ],
        dest: '<%= paths.dist.root %><%= paths.dist.vendorName %>'
      },
      app: {
        options: {
          stripBanners: {
            line: true
          },
          banner: '<%= banner %>',
        },
        files: {
          '<%= paths.dist.root %><%= paths.dist.appName %>': 
            [ '<%= paths.dist.root %><%= paths.dist.appName %>' ]
        }
      }
    },

    copy: {
      dist: {
        cwd: "./", 
        files: {
          "<%= paths.dist.exportCSS %><%= paths.dist.vendorCSSName %>": 
            "<%= paths.dist.root %><%= paths.dist.vendorCSSName %>",

          "<%= paths.dist.exportJS %><%= paths.dist.vendorName %>": 
            "<%= paths.dist.root %><%= paths.dist.vendorName %>",

          "<%= paths.dist.exportJS %><%= paths.dist.appName %>": 
            "<%= paths.dist.root %><%= paths.dist.appName %>"
        }
      }

    },

    watch: {
      local: {
        files: ["<%= paths.app.root %>**/*",
          "!<%= paths.app.root %>views/**/*.hbs.js"],
        tasks: ['default']
      },
      test: {
        files: ["router/api/**/*", "tests/api/**/*",
          "!<%= paths.app.root %>**/*"],
        tasks: ['test']
      }
    },

    jshint: {
      all: {
        files: {
          src: ["<%= paths.app.root %>**/*.js"]
        },
        options: {
          bitwise: true
          ,curly: true
          ,eqeqeq: true
          ,forin: true
          ,immed: true
          ,latedef: true
          ,newcap: true
          ,noempty: true
          ,nonew: true
          ,quotmark: false
          ,undef: true
          ,unused: true
          ,laxcomma: true

          ,globals: {
            window: true
            ,jQuery: true
            ,$: true
            ,_: true
            ,require: true
            ,module: true
            ,Backbone: true
            ,Handlebars: true
            ,console: true
            ,moment: true
            ,Placeholders: true
            ,Mousetrap: true
            ,desk: true
          }
        }
      }
    },


    express: {
      options: {
        // Override defaults here
      },
      test: {
        options: {
          script: 'app.js',
          node_env: 'test',
          port: require('./app.config.test').port
        }
      }
    },

    mochacov: {
      unit: {
        options: {
          reporter: 'spec'
        }
      },
      html: {
        options: {
          reporter: 'html-cov',
          output: 'coverage.html'
        }
      },
      coverage: {
        options: {
          reporter: 'mocha-term-cov-reporter',
          coverage: true
        }
      },
      coveralls: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      options: {
        files: 'tests/**/*.js',
        ui: 'bdd',
        colors: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-commonjs-handlebars');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-cov');

  grunt.registerTask("default", [
    "clean:before", 
    "jshint:all", 
    "handlebars", 
    "browserify", 
    "concat", 
    "clean:after",
    "copy"
  ]);

  grunt.registerTask("test", ['express:test', 'mochacov:unit']);
  grunt.registerTask("wtest", ["test", "watch:test"]);

  grunt.registerTask('travis', ['mochacov:unit']);

  grunt.registerTask("w", ["default", "watch:local"]);
};
