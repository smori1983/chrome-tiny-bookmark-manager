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
