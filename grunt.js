module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
    pkg: "<json:manifest.json>",
    locales: "<json:_locales/ja/messages.json>",
    meta: {
        banner: "/*!\n" +
                " * smorijp.info <%= locales.meta_name.message %> v<%= pkg.version %>\n" +
                " *\n" +
                " * Copyright (c) <%= grunt.template.today('yyyy') %> smori <smori1983@gmail.com>\n" +
                " * Dual licensed under the MIT or GPL-2.0 licenses.\n" +
                " *\n" +
                " * Date <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>\n" +
                " */"
    },
    lint: {
        all: ["grunt.js", "js/tbm/*.js"]
    },
    qunit: {
        files: []
    },
    concat: {
        tbmBackground: {
            src: [
                "<banner:meta.banner>",
                "js/tbm/HEAD.js",
                "js/tbm/util.js",
                "js/tbm/setting.js",
                "js/tbm/background.js"
            ],
            dest: "js/tbm.background.js"
        },
        tbmFront: {
            src: [
                "<banner:meta.banner>",
                "js/tbm/HEAD.js",
                "js/tbm/util.js",
                "js/tbm/setting.js",
                "js/tbm/user.*.js",
                "js/tbm/bookmark.*.js"
            ],
            dest: "js/tbm.front.js"
        },
        mainBackground: {
            src: [
                "<banner:meta.banner>",
                "js/main/background.js"
            ],
            dest: "js/main.background.js"
        },
        mainOptions: {
            src: [
                "<banner:meta.banner>",
                "js/main/options.js"
            ],
            dest: "js/main.options.js"
        },
        mainPopup: {
            src: [
                "<banner:meta.banner>",
                "js/main/front.js",
                "js/main/popup.js"
            ],
            dest: "js/main.popup.js"
        }
    },
    jshint: {
        options: {
            browser: true,
            curly: true,
            eqeqeq: true,
            forin: true
        }
    },
    watch: {
        files: [
            "js/tbm/*.js",
            "js/main/*.js",
            "test/*.js"
        ],
        tasks: "lint concat"
    }
});

grunt.registerTask("default", "lint concat");

};
