/**
 * @param chrome.bookmarks bookmarksApi
 */
tbm.bookmarkManager = function(bookmarksApi) {
    var that = {};

    var dataBuilder;
    var search;

    var timestamp;
    var bookmarkData;

    that.init = function(callback) {
        dataBuilder = tbm.bookmarkDataBuilder;
        search = tbm.bookmarkSearch;

        that.update(callback);
    };

    that.update = function(callback) {
        bookmarksApi.getTree(function(rootNodes) {
            bookmarkData = dataBuilder.build(rootNodes[0]);
            timestamp = new Date().getTime();
            callback();
        });
    };

    that.getTimestamp = function() {
        return timestamp;
    };

    that.getBookmarks = function(query) {
        if (typeof query === 'string') {
            return search.execute(bookmarkData.bookmarks, query);
        } else {
            return bookmarkData.bookmarks;
        }
    };

    that.getFolders = function() {
        return bookmarkData.folders;
    };

    that.getTags = function() {
        return bookmarkData.tags;
    };

    that.updateBookmark = function(id, params, callback) {
        if (!params.hasOwnProperty('title')) {
            return;
        }

        bookmarksApi.update(id, params, function(updated) {
            callback({
                id: updated.id,
                title: updated.title,
                url: updated.url,
            });
        });
    };

    return that;
};
