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
 * tbm.background
 *
 * tbm.background.getBookmarks()
 * tbm.background.getTags()
 */
tbm.background = (function() {
    var that = {},
        importing = false,

        bookmarks = [],
        folders   = [],
        tags      = [];

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

    var getFullTitle = function(node, folders) {
        var folderTags = [];

        $.each(folders.slice(1), function(idx, folder) {
            folderTags.push("[" + folder + "]");
        });

        return folderTags.join("") + node.title;
    };

    var getTags = function(title) {
        var matched, tags = [];

        while ((matched = /^\[([^\[\]]+)\]/.exec(title))) {
            tags.push(matched[1]);
            title = title.slice(matched[0].length);
        }

        return tags;
    };

    var notIn = function(value, array, callback) {
        if ($.inArray(value, array) < 0) {
            callback();
        }
    };

    var update = (function() {
        var wait       = 1000,
            inProgress = false,
            eventCount = 0;

        var execute = function() {
            var tmpBookmarks = [],
                tmpFolders   = [],
                tmpTags      = [];

            chrome.bookmarks.getTree(function(rootNodes) {
                $.each(rootNodes, function(idx, rootNode) {
                    searchRecursive(rootNode, [], function(node, folders) {
                        node.fullTitle = getFullTitle(node, folders);
                        node.folders   = folders.join(" / ");
                        tmpBookmarks.push(node);

                        $.each(folders.slice(1), function(idx, folder) {
                            notIn(folder, tmpFolders, function() {
                                tmpFolders.push(folder);
                            });
                        });
                        $.each(getTags(node.title), function(idx, tag) {
                            notIn(tag, tmpTags, function() {
                                tmpTags.push(tag);
                            });
                        });
                    });
                });

                bookmarks = tmpBookmarks;
                folders   = tmpFolders.sort();
                tags      = tmpTags.sort();

                inProgress = false;
                eventCount = 0;
            });
        };

        return function(isRecursive) {
            if (!importing) {
                eventCount += isRecursive ? 0 : 1;

                if (!inProgress) {
                    inProgress = true;
                    window.setTimeout(function() {
                        if (eventCount <= 1) {
                            smodules.util.debug("%4d execute() called.".format(eventCount));
                            execute();
                        } else {
                            smodules.util.debug("%4d execute() not called.".format(eventCount));
                            inProgress = false;
                            eventCount = Math.floor(eventCount / 2);
                            update(true);
                        }
                    }, wait);
                }
            }
        };
    })();

    update();

    chrome.bookmarks.onChanged.addListener(function(id, changeInfo) {
        update();
    });
    chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
        update();
    });
    chrome.bookmarks.onMoved.addListener(function(id, moveInfo) {
        update();
    });
    chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) {
        update();
    });
    chrome.bookmarks.onImportBegan.addListener(function() {
        importing = true;
    });
    chrome.bookmarks.onImportEnded.addListener(function() {
        importing = false;
        update();
    });

    that.getBookmarks = function() {
        return bookmarks;
    };

    that.getFolders = function() {
        return folders;
    };

    that.getTags = function() {
        return tags;
    };

    return that;
})();
