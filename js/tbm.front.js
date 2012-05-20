/*!
 * smorijp.info tiny bookmark manager v0.1.3
 *
 * Copyright (c) 2012 smori <smori1983@gmail.com>
 * Dual licensed under the MIT or GPL-2.0 licenses.
 *
 * Date 2012-05-21 01:02:46
 */

var tbm = {};

tbm.util = tbm.util || {};
tbm.util.tag = (function() {
    var regex = /\{\{([a-z]+):(.+?)\}\}/g,
        tags  = "code|strong";

    // {{tag:content}} -> <tag>content</tag>
    return function(value) {
        return value.toString().replace(regex, function(matched, tag, content) {
            if (tags.indexOf(tag) >= 0) {
                return "<%s>%s</%s>".format(tag, content, tag);
            } else {
                return matched;
            }
        });
    };
})();

/**
 * tbm.setting
 *
 * openType
 */
tbm.setting = tbm.setting || {};
tbm.setting = (function() {
    var that   = {},
        prefix = "setting.log",

        defaults = {
            "latest_query": "yes",
            "query_store_days": "30"
        };

    var getKey = function(key) {
        return [prefix, key].join(".");
    };

    that.set = function(key, value) {
        smodules.storage.set(getKey(key), value);
    };

    that.get = function(key) {
        var data = smodules.storage.get(getKey(key));

        if (data === null) {
            return defaults.hasOwnProperty(key) ? defaults[key] : data;
        } else {
            return data;
        }
    };

    return that;
})();

/**
 * tbm.user.query
 *
 * setStoreDays(days)
 * setRecentFetchSize(size)
 * setFrequentFetchSize(size)
 * add(query)
 * getLatest()
 * getRecent()
 * getFrequent()
 */
tbm.user = tbm.user || {};
tbm.user.query = (function() {
    var that = {},
        key  = "user.query",
        data = null,

        storeDays         = 28,
        recentFetchSize   = 20,
        frequentFetchSize = 20;

    var load = function() {
        if (data === null) {
            data = smodules.storage.getJSON(key, []);
        }
    };

    var save = function() {
        smodules.storage.setJSON(key, data);
    };

    var clean = function() {
        var date = new Date().add({ day: -storeDays }).format("%Y-%m-%d");

        while (data && data.length > 0 && data[data.length - 1].date < date) {
            date.pop();
        }
    };

    that.setStoreDays = function(days) {
        if (typeof days === "number") {
            storeDays = parseInt(days, 10);
        }
        return that;
    };

    that.setRecentFetchSize = function(size) {
        if (typeof size === "number") {
            recentFetchSize = parseInt(size, 10);
        }
        return that;
    };

    that.setFrequentFetchSize = function(size) {
        if (typeof size === "number") {
            frequentFetchSize = parseInt(size, 10);
        }
        return that;
    };

    that.add = function(query) {
        load();
        data.unshift({
            date:  new Date().format("%Y-%m-%d"),
            query: query
        });
        clean();
        save();
    };

    that.getLatest = function() {
        load();
        return data.length > 0 ? data[0].query : "";
    };

    that.getRecent = function() {
        load();
        return data.slice(0, recentFetchSize);
    };

    that.getFrequent = function() {
        var summary, array = [];

        load();
        summary = data.reduce(function(prev, current, index, array) {
            if (prev.hasOwnProperty(current.query)) {
                prev[current.query] += 1;
            } else {
                prev[current.query] = 1;
            }
            return prev;
        }, {});

        $.each(summary, function(query, count) {
            array.push({
                query: query,
                count: count
            });
        });
        array.sort(function(a, b) {
            return b.count - a.count;
        });

        return array.slice(0, frequentFetchSize);
    };

    return that;
})();

/**
 * tbm.user.favorite
 *
 * add(query)
 * remove(query)
 * isAdded(query)
 * getAll()
 */
tbm.user = tbm.user || {};
tbm.user.favorite = (function() {
    var that = {},
        key  = "user.favorite",
        data = null;

    var load = function() {
        if (data === null) {
            data = smodules.storage.getJSON(key, []);
        }
    };

    var save = function() {
        smodules.storage.setJSON(key, data);
    };

    var notIn = function(value, array, callback) {
        if ($.inArray(value, array) < 0) {
            callback();
        }
    };

    that.add = function(query) {
        load();
        notIn(query, data, function() {
            data.push(query);
        });
        data.sort();
        save();
    };

    that.remove = function(query) {
        var idx;

        load();
        if ((idx = data.indexOf(query)) >= 0) {
            data.splice(idx, 1);
        }
        save();        
    };

    that.isAdded = function(query) {
        load();
        return $.inArray(query, data) >= 0;
    };

    that.getAll = function() {
        var array = [];

        load();
        $.each(data, function(idx, query) {
            array.push({ query: query });
        });
        return array;
    };

    return that;
})();

/**
 * tbm.bookmark.search
 *
 * tbm.bookmark.search.execute(query, callback)
 */
tbm.bookmark = tbm.bookmark || {};
tbm.bookmark.search = (function() {
    var that = {},
        background = chrome.extension.getBackgroundPage().tbm.background;

    var setupRegex = function(query) {
        var regexList = [],
            words = query.trim().replace(/\s+/g, " ").split(" ");

        $.each(words, function(idx, word) {
            regexList.push(new RegExp(word.regexQuote(), "i"));
        });

        return regexList;
    };

    var searchRecursive = function(bookmarkTreeNode, folders, callback) {
        $.each(bookmarkTreeNode.children, function(idx, childNode) {
            if (childNode.hasOwnProperty("url")) {
                callback(childNode, folders);
            } else {
                folders.push(childNode.title);
                searchRecursive(childNode, folders, callback);
                folders.pop();
            }
        });
    };

    var checkWords = function(node, regexList, callback) {
        var i = 0, len = regexList.length;

        for ( ; i < len; i++) {
            //if (!node.title.match(regexList[i]) && !node.url.match(regexList[i])) {
            if (!node.fullTitle.match(regexList[i])) {
                return;
            }
        }

        callback();
    };

    that.execute = function(query, callback) {
        var hits = [],
            regexList = setupRegex(query);

        $.each(background.getBookmarks(), function(idx, bookmark) {
            checkWords(bookmark, regexList, function() {
                hits.push(bookmark);
            });
        });
        callback(hits);
    };

    return that;
})();
