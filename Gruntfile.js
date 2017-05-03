module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    locales: grunt.file.readJSON("_locales/ja/messages.json"),
    meta: {
        banner: "/*!\n" +
                " * <%= locales.meta_name.message %> v<%= pkg.version %>\n" +
                " *\n" +
                " * Copyright (c) <%= grunt.template.today('yyyy') %> smori <smori1983@gmail.com>\n" +
                " * Licensed under the MIT license.\n" +
                " *\n" +
                " * Date <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>\n" +
                " */\n"
    },
    qunit: {
        files: []
    },
    concat: {
        tbmBackground: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "js/tbm/HEAD.js",
                "js/tbm/util.js",
                "js/tbm/setting.js",
                "js/tbm/background.HEAD.js",
                "js/tbm/background.*.js"
            ],
            dest: "js/tbm.background.js"
        },
        tbmFront: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "js/tbm/HEAD.js",
                "js/tbm/util.js",
                "js/tbm/setting.js",
                "js/tbm/user.*.js",
                "js/tbm/bookmark.*.js"
            ],
            dest: "js/tbm.front.js"
        },
        mainBackground: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "js/main/background.js"
            ],
            dest: "js/main.background.js"
        },
        mainOptions: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "js/main/options.js"
            ],
            dest: "js/main.options.js"
        },
        mainPopup: {
            options: {
                banner: "<%= meta.banner %>"
            },
            src: [
                "js/main/front.js",
                "js/main/popup.js"
            ],
            dest: "js/main.popup.js"
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
            "js/main/*.js",
            "js/tbm/*.js"
        ]
    },
    watch: {
        files: [
            "js/tbm/*.js",
            "js/main/*.js"
        ],
        tasks: ["jshint", "concat"]
    }
});

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask("default", ["jshint", "concat"]);

};
