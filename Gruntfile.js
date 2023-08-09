module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      ts: {
          default: {
              tsconfig: './tsconfig.json',
              options: {
                additionalFlags: '--ignoreDeprecations 5.0'
              }
          }
      },
      watch: {
          default: {
              files: ["src/ts/**/*", "src/d.ts/**/*", "index.html", "index.css"],
              tasks: ['ts:default'],
              options: {
                  livereload: true
              }
          }
      },
      connect: {
          server: {
              options: {
                  livereload: true
              }
          }
      },
      clean: {
          all: ["build", "dist", "dist.zip", "js13k.zip"]
      },
      'closure-compiler': {
          es2020: {
              closurePath: 'libbuild/closure-compiler-v20230502',
              js: 'build/out.js',
              jsOutputFile: 'dist/out.min.js',
              maxBuffer: 500,
              reportFile: 'closure.txt',
              options: {
                  compilation_level: 'ADVANCED_OPTIMIZATIONS',
                  language_in: 'ECMASCRIPT_2020',
                  language_out: 'ECMASCRIPT_2020',
                  externs: 'src/externs/externs.js',
                  create_source_map: "true",
              }
          },
          es5: {
              closurePath: 'libbuild/closure-compiler-v20230502',
              js: 'build/out.js',
              jsOutputFile: 'dist/out.min.js',
              maxBuffer: 500,
              reportFile: 'closure.txt',
              options: {
                  compilation_level: 'ADVANCED_OPTIMIZATIONS',
                  language_in: 'ECMASCRIPT_2020',
                  language_out: 'ECMASCRIPT5',
                  externs: 'src/externs/externs.js'
              }
          }
      },
      cssmin: {
        options: {
        },
        target: {
            files: {
            'dist/index.css': ['dist/index.css']
            }
        }
      },
      htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true
          },
          files: {
            'dist/index.html': 'dist/index.html'
          }
        }
      },
      inline: {
          dist: {
              src: 'dist/index.html',
              dest: 'dist/index.html'
          }
      },
      replace: {
          hax: {
            src: ['build/out.js'],
            overwrite: true,
            replacements: [
              // turn on production mode
              {
                from: /ENVIRONMENT = '\w+';/g,
                to: "ENVIRONMENT = 'small';"
              },
              // math
              // remove all consts so CC can aggregate consecutive declarations
              { 
                from: /(\s)const(\s)/g, 
                to: "$1let$2"
              },
              // webgl constants
              { from: "gl.RENDERBUFFER", to: "0x8D41" },
              { from: "gl.FRAMEBUFFER", to: "0x8D40" },
              { from: "gl.DEPTH_COMPONENT16", to: "0x81A5" },
              { from: "gl.DEPTH_ATTACHMENT", to: "0x8D00" },
              { from: "gl.FRAGMENT_SHADER", to: "0x8B30" },
              { from: "gl.ELEMENT_ARRAY_BUFFER", to: "0x8893" },
              { from: "gl.COLOR_ATTACHMENT0", to: "0x8CE0" },
              { from: "gl.DEPTH_TEST", to: "0x0B71" },
              { from: "gl.CULL_FACE", to: "0x0B44" },
              { from: "gl.BLEND", to: "0x0BE2" },
              { from: "gl.LESS", to: "0x0201" },
              { from: "gl.LEQUAL", to: "0x0203" },
              { from: "gl.FRONT", to: "0x0404" },
              { from: "gl.BACK", to: "0x0405" },
              { from: "gl.COLOR_BUFFER_BIT", to: "0x4000" },
              { from: "gl.DEPTH_BUFFER_BIT", to: "0x100" },
              { from: "gl.TEXTURE_2D", to: "0x0DE1" },
              { from: "gl.RGBA", to: "0x1908" },
              { from: "gl.UNSIGNED_SHORT", to: "0x1403" },
              { from: "gl.TRIANGLES", to: "0x0004" },
              { from: "gl.TEXTURE0", to: "0x84C0" },
              { from: "gl.TEXTURE1", to: "0x84C1" },
              { from: "gl.TEXTURE2", to: "0x84C2" },
              { from: "gl.ARRAY_BUFFER", to: "0x8892" },
              { from: "gl.TEXTURE_MAG_FILTER", to: "10240" },
              { from: "gl.NEAREST", to: "9728" },
              { from: "gl.TEXTURE_MIN_FILTER", to: "10241" },
              { from: "gl.SRC_ALPHA", to: "770" },
              { from: "gl.ONE_MINUS_SRC_ALPHA", to: "771" },
              { from: "gl.FLOAT", to: "5126" },
              { from: "gl.STATIC_DRAW", to: "0x88E4" },
              { from: "gl.VERTEX_SHADER", to: "0x8B31" },
              { from: "gl.LINK_STATUS", to: "0x8B82" },
              { from: "gl.CLAMP_TO_EDGE", to: "33071" },
              { from: "gl.DEPTH_COMPONENT", to: "6402" },
              { from: "gl.TEXTURE_3D", to: "32879" },
              { from: "gl.TEXTURE_BASE_LEVEL", to: "33084" },
              { from: "gl.TEXTURE_CUBE_MAP_POSITIVE_X", to: "34069" },
              { from: "gl.TEXTURE_CUBE_MAP", to: "34067" },
              { from: "gl.TEXTURE_MAX_LEVEL", to: "33085" },
              { from: "gl.TEXTURE_WRAP_R", to: "32882" },
              { from: "gl.TEXTURE_WRAP_S", to: "10242" },
              { from: "gl.TEXTURE_WRAP_T", to: "10243" },
              { from: "gl.UNSIGNED_BYTE", to: "5121" }, 
            ]
          },
          html: {
            src: ['dist/index.html'],
            overwrite: true,
            replacements: [{
              from: /build\/out\.js/g,
              to:"out.min.rr.js"
            }, { // gut the HTML entirely!
              from: "</body></html>",
              to: ""
            }, {
              from: "<html>",
              to: ""
            }, {
              from: "<body>",
              to: ""
            }]
          },
          html2: {
            src: ['dist/index.html'],
            overwrite: true,
            replacements: [{
              from: /id=\"(\w+)\"/g,
              to: "id=$1"
            }, {
              from: /class=\"(\w+)\"/g,
              to: "class=$1"
            }, {
              from: /name=\"(\w+)\"/g,
              to: "name=$1"
            }]
          },          
          js: {
              src: ['dist/out.min.js'],
              overwrite: true,
              replacements: [{
                from: "'use strict';",
                to:""
              }, {
                from: "window.",
                to:""
              }, /* GLSL comments */ {
                from: /\/\/([^\n])*\n/g,
                to:""
              }, /*{
                from: /\/\*(.|\\n)*\*\//g,
                to:""
              }, */{
                from: /\$\{\"((\w|\d|\.)*)\"\}/g,
                to: "$1"
              }, {
                from: /\$\{(\-?(\d|\.)*)\}/g,
                to: "$1"
              }, {
                from: "void 0",
                to: "null"
              }, {
                from: "const ",
                to: "var "
              }, {
                from: "const[",
                to: "var["
              }, {
                from: "const{",
                to: "var{"
              }, {
                from: "let ",
                to: "var "
              }, {
                from: "let{",
                to: "var{"
              }, {
                from: "let[",
                to: "var["
              }, {
                from: /(\,|\{)\["(\w+)"\]:/g,
                to: "$1$2:"
              }, {
                from: "${Math.random()/999}",
                to: "0.",
              }, {
                from: "forEach",
                to: "map"
              }, {
                from: /var ([a-zA-Z_$]+=[^;\{]+);var/g,
                to: "var $1,",
              }]
          },
          js2: { // second pass for the bits that we changed above
            src: ['dist/out.min.js'],
            overwrite: true,
            replacements: [{
              from: /(\s)+/g,
              to:" "
            }, {
              from: /((\\n)\s*)+/g,
              to:" "
            }, {
              from: /([^a-zA-Z0-9$])\s(\w)/g,
              to: "$1$2"
            }, {
              from: /(\w)\s([^a-zA-Z0-9$])/g,
              to: "$1$2"
            }, {
              from: /([^a-zA-Z0-9$])\s([^a-zA-Z0-9$])/g,
              to: "$1$2"
            }, {
              from: ",null)",
              to: ")",
            }]
        },
      },
      copy: {
          html: {
              files: [
                  {expand: true, src: ['index.html'], dest: 'dist/'},
                  {expand: true, src: ['index.css'], dest: 'dist/'}
              ]
          }
      },
      devUpdate: {
          main: {
              options: {
                  //task options go here
                  updateType: 'force',
                  reportUpdated: true
              }
          }
      },
      exec: {
        options: {
          // ...
        },
        roadroller: {
          cmd: 'npx roadroller dist/out.min.js -o dist/out.min.rr.js'
        },
        deploy: {
          cmd: 'npx gh-pages -d dist'
        },
        zip: {
          cmd: 'advzip -4 -a index.zip dist/index.html'
        },
        dir: {
          cmd: 'stat -c "%N %s" index.zip'
        }
      }     
  });

  // clean
  grunt.loadNpmTasks('grunt-contrib-clean');
  // load the plugin that provides the closure compiler
  grunt.loadNpmTasks('grunt-closure-compiler');
  // Load the plugin that provides the "TS" task.
  grunt.loadNpmTasks('grunt-ts');
  // copy
  grunt.loadNpmTasks('grunt-contrib-copy');
  // replace text in file
  grunt.loadNpmTasks('grunt-text-replace');
  // update version
  grunt.loadNpmTasks('grunt-dev-update');
  // inline js
  grunt.loadNpmTasks('grunt-inline');
  // live reload
  grunt.loadNpmTasks('grunt-contrib-watch');
  // server for live reload
  grunt.loadNpmTasks('grunt-contrib-connect');
  // copying html
  grunt.loadNpmTasks('grunt-contrib-copy');
  // minifying css
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // minifying html
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  // run command line
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('reset', ['clean:all']);
  grunt.registerTask('prod', ['ts']);
  grunt.registerTask('dist', [
    'prod', 
    'replace:hax',
    'closure-compiler:es2020', 
    'exec:roadroller',
    'copy',
    'cssmin', 
    'replace:html', 
    'replace:js', 'replace:js2', 'replace:js2', 
    'inline', 
    'htmlmin',
    /* 'replace:html2',*/
    'exec:zip',
    'exec:dir',
  ]);
  grunt.registerTask('default', ['prod', 'connect', 'watch']);
  grunt.registerTask('deploy', ['exec:deploy']);

};
