/**
 * @param chrome.bookmarks bookmarksApi
 */
tbm.bookmarkManager = function(bookmarksApi) {
    var that = {};

    var dataBuilder;
    var search;

    var bookmarkData;

    that.init = function() {
        dataBuilder = tbm.bookmarkDataBuilder;
        search = tbm.bookmarkSearch;

        bookmarksApi.getTree(function(rootNodes) {
            bookmarkData = dataBuilder.build(rootNodes[0]);
        });
    };

    that.getBookmarks = function(query) {
        if (typeof query === 'string') {
            return search.execute(bookmarkData.bookmarks, query);
        } else {
            return bookmarkData.bookmarks;
        }
    };

    return that;
};
