require("dotenv").config();

var sprintf = require("sprintf-js").sprintf;

module.exports = function(grunt) {

var forProduction = (function() {
    var mode = process.env.EXTENSION_MODE || "development";

    return mode === "production";
})();

var dist = (function() {
    var baseDir = process.env.EXTENSION_DIST || "dist";

    if (forProduction) {
        return sprintf("%s/<%%= pkg.name %%>-v<%%= pkg.version %%>", baseDir);
    } else {
        return sprintf("%s/<%%= pkg.name %%>-dev", baseDir);
    }
})();

grunt.initConfig({
    dist: dist,
    pkg: grunt.file.readJSON("package.json"),
    locales: grunt.file.readJSON("src/_locales/ja/messages.json"),
    meta: {
        banner: "/*!\n" +
                " * <%= locales.meta_name.message %> v<%= pkg.version %>\n" +
                " *\n" +
                " * Copyright (c) <%= grunt.template.today('yyyy') %> smori <shinichiro.mori.1983@gmail.com>\n" +
                " * Licensed under the MIT license.\n" +
                " *\n" +
                " * Date <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>\n" +
                " */\n"
    },
    qunit: {
        options: {},
        all: ["test/**/*.html"]
    },
    clean: {
        options: {
            force: true
        },
        dist: [
            "<%= dist %>"
        ]
    },
    copy: {
        manifest: {
            expand: true,
            cwd: "src",
            src: "manifest.json",
            dest: "<%= dist %>/"
        },
        locales: {
            expand: true,
            cwd: "src",
            src: "_locales/**/*",
            dest: "<%= dist %>/"
        },
        html: {
            expand: true,
            cwd: "src",
            src: "html/**/*.html",
            dest: "<%= dist %>/"
        },
        template: {
            expand: true,
            cwd: "src",
            src: "template/**/*.html",
            dest: "<%= dist %>/"
        },
        js: {
            expand: true,
            cwd: "src",
            src: "js/lib/**/*",
            dest: "<%= dist %>/"
        },
        css: {
            expand: true,
            cwd: "src",
            src: "css/**/*.css",
            dest: "<%= dist %>/"
        },
        image: {
            expand: true,
            cwd: "src",
            src: [
                "image/**/*.gif",
                "image/**/*.png"
            ],
            dest: "<%= dist %>/"
        }
    },
    concat: {
        tbmBackground: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "src/js/tbm/HEAD.js",
                "src/js/tbm/util.js",
                "src/js/tbm/setting.js",
                "src/js/tbm/background.HEAD.js",
                "src/js/tbm/background.*.js"
            ],
            dest: "<%= dist %>/js/tbm.background.js"
        },
        tbmFront: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "src/js/tbm/HEAD.js",
                "src/js/tbm/util.js",
                "src/js/tbm/setting.js",
                "src/js/tbm/user.*.js",
                "src/js/tbm/bookmark.*.js"
            ],
            dest: "<%= dist %>/js/tbm.front.js"
        },
        mainBackground: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "src/js/main/background.js"
            ],
            dest: "<%= dist %>/js/main.background.js"
        },
        mainOptions: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "src/js/main/options.js"
            ],
            dest: "<%= dist %>/js/main.options.js"
        },
        mainPopup: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "src/js/main/front.js",
                "src/js/main/popup.js"
            ],
            dest: "<%= dist %>/js/main.popup.js"
        }
    },
    jshint: {
        options: {
            force: true,
            browser: true,
            curly: true,
            eqeqeq: true,
            forin: true
        },
        all: [
            "Gruntfile.js",
            "src/js/main/*.js",
            "src/js/tbm/*.js",
            "test/**/*.js"
        ]
    },
    watch: {
        files: [
            "src/js/tbm/*.js",
            "src/js/main/*.js",
            "test/**/*.html",
            "test/**/*.js"
        ],
        tasks: ["jshint", "qunit"]
    }
});

grunt.loadNpmTasks("grunt-contrib-clean");
grunt.loadNpmTasks("grunt-contrib-concat");
grunt.loadNpmTasks("grunt-contrib-copy");
grunt.loadNpmTasks("grunt-contrib-jshint");
grunt.loadNpmTasks("grunt-contrib-qunit");
grunt.loadNpmTasks("grunt-contrib-watch");

grunt.registerTask("default", ["jshint", "clean", "copy", "concat"]);

};
