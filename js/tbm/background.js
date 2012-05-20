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
