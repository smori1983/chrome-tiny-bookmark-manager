tbm.bookmarkDataBuilder = (function() {
    var that = {};

    var walkFolder = function (result, bookmarkTreeNode) {
        bookmarkTreeNode.children.forEach(function(node) {
            if (isBookmarkNode(node)) {
                addTags(result, node.title);
                result.bookmarks.push(node);
            } else {
                addFolder(result, node.title);
                walkFolder(result, node);
            }
        });
    };

    var isBookmarkNode = function (bookmarkTreeNode) {
        return bookmarkTreeNode.hasOwnProperty('url');
    };

    var addFolder = function (result, folderName) {
        if (result.folders.indexOf(folderName) < 0) {
            result.folders.push(folderName);
        }
    };

    var addTags = function (result, title) {
        tbm.bookmarkUtil.getTags(title).forEach(function(tagName) {
            addTag(result, tagName);
        });
    };

    var addTag = function (result, tagName) {
        if (result.tags.indexOf(tagName) < 0) {
            result.tags.push(tagName);
        }
    };

    /**
     * @param BookmarkTreeNode rootNode
     * @return object
     */
    that.build = function(rootNode) {
        var result = {
            bookmarks: [],
            folders: [],
            tags: [],
        };

        walkFolder(result, rootNode);

        result.folders.sort();

        return result;
    };

    return that;
})();
