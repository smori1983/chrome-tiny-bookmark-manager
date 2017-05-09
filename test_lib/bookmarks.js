var tbm = tbm || {};

tbm.testLib = tbm.testLib || {};

tbm.testLib.bookmarks = (function() {
    var that = {};

    that.getTree = function(callback) {
        var result = [tbm.testLib.bookmarkTreeNode.getRootNode()];

        callback(result);
    };

    /**
     * Currently application accepts only bookmark title change.
     */
    that.update = function(bookmarkId, changes, callback) {
        var node = {
            id: bookmarkId,
            parentId: 999, // dummy
            index: 999, // dummy
            url: 'http://example.com/', // dummy
            title: changes.title || 'title',
            // Omit other properties.
        };

        // Emulates asynchronous callback.
        setTimeout(function() {
            callback(node);
        }, 10);
    };

    return that;
})();
