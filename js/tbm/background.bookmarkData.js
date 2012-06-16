/**
 * tbm.background.bookmarkData
 *
 * getBookmarks()
 * getFolders()
 * getTags()
 */
tbm.background.bookmarkData = (function() {
    var that = {},
        importing = false,

        _timestamp = null,
        _bookmarks = [],
        _folders   = [],
        _tags      = [];

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
        return folders.slice(1).map(function(value, index, array) {
            return "[" + value + "]";
        }).join("") + node.title;
    };

    var getTags = function(title) {
        var matched, tags = [];

        while ((matched = /^\[([^\[\]]+)\]/.exec(title))) {
            tags.push(matched[1]);
            title = title.slice(matched[0].length);
        }

        return tags;
    };

    var notIn = function(testee, array, key) {
        return !array.some(function(value, index, array) {
            return value[key] === testee;
        });
    };

    var update = (function() {
        var wait       = 1000,
            inProgress = false,
            eventCount = 0;

        var execute = function() {
            var options = { silent: true },

                tmpBookmarks = [],
                tmpFolders   = [],
                tmpTags      = [],

                timeLabel = "tbm.background.bookmarkData - bookmark scan";

            smodules.util.console.time(timeLabel);
            chrome.bookmarks.getTree(function(rootNodes) {
                rootNodes.forEach(function(rootNode) {
                    searchRecursive(rootNode, [], function(node, folders) {
                        node.fullTitle = getFullTitle(node, folders);
                        node.folders   = folders.join(" / ");
                        tmpBookmarks.push(node);

                        folders.slice(1).forEach(function(folder) {
                            if (notIn(folder, tmpFolders, "name")) {
                                tmpFolders.push({ name: folder });
                            }
                        });
                        getTags(node.title).forEach(function(tag) {
                            if (notIn(tag, tmpTags, "name")) {
                                tmpTags.push({ name: tag });
                            }
                        });

                    });
                });

                tmpBookmarks.sort(function(a, b) {
                    return a.fullTitle.compare(b.fullTitle);
                });
                tmpFolders.sort(function(a, b) {
                    return a.name.compare(b.name);
                });
                tmpTags.sort(function(a, b) {
                    return a.name.compare(b.name);
                });

                _timestamp = new Date().getTime();
                _bookmarks = tmpBookmarks;
                _folders   = tmpFolders;
                _tags      = tmpTags;

                smodules.util.console.timeEnd(timeLabel);
                inProgress = false;
                eventCount = 0;
            });
        };

        return function(isRecursive) {
            var logMsg = "tbm.background.bookmarkData - execute() %s - eventCount = %d";

            if (!importing) {
                eventCount += isRecursive ? 0 : 1;

                if (!inProgress) {
                    inProgress = true;
                    window.setTimeout(function() {
                        if (eventCount <= 1) {
                            smodules.util.console.log(logMsg.format("called", eventCount));
                            execute();
                        } else {
                            smodules.util.console.log(logMsg.format("not called", eventCount));
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


    var setupRegex = function(query) {
        return query.trim().replace(/\s+/g, " ").split(" ").map(function(value, index, array) {
            return new RegExp(value.regexQuote(), "i");
        });
    };

    var checkWords = function(testee, regexList) {
        return regexList.every(function(value, index, array) {
            return value.test(testee);
        });
    };

    var search = function(query) {
        var regexList = setupRegex(query);

        return _bookmarks.filter(function(bookmark) {
            return checkWords(bookmark.fullTitle, regexList);
        });
    };


    that.getTimestamp = function() {
        return _timestamp;
    };

    that.getBookmarks = function(query) {
        return typeof query === "string" ? search(query) : _bookmarks;
    };

    that.getFolders = function() {
        return _folders;
    };

    that.getTags = function() {
        return _tags;
    };

    that.itemUpdate = function(bookmark, callback) {
        chrome.bookmarks.update(bookmark.id, {
            title: bookmark.title
        }, function(bookmarkTreeNode) {
            callback(bookmarkTreeNode);
        });
    };

    return that;
})();
