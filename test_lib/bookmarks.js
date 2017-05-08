var tbm = tbm || {};

tbm.testLib = tbm.testLib || {};

tbm.testLib.bookmarks = (function() {
    var that = {};

    that.getTree = function(callback) {
        var result = [tbm.testLib.bookmarkTreeNode.getRootNode()];

        callback(result);
    };

    return that;
})();
