tbm.bookmarkDataBuilder = (function() {
    var that = {};

    var walkFolder = function (result, bookmarkTreeNode, folderStack) {
        bookmarkTreeNode.children.forEach(function(node) {
            if (isBookmarkNode(node)) {
                addTags(result, node.title);
                addBookmark(result, node, folderStack);
            } else {
                folderStack.push(node.title);
                addFolder(result, node.title);
                walkFolder(result, node, folderStack);
                folderStack.pop();
            }
        });
    };

    var isBookmarkNode = function (bookmarkTreeNode) {
        return bookmarkTreeNode.hasOwnProperty('url');
    };

    var addBookmark = function(result, node, folderStack) {
        var bookmark = {
            title: node.title,
            fullTitle: tbm.bookmarkUtil.getFullTitle(node.title, folderStack),
            url: node.url,
            folders: folderStack.slice(0),
        };

        result.bookmarks.push(bookmark);
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

        walkFolder(result, rootNode, []);

        result.folders.sort();
        result.tags.sort();

        return result;
    };

    return that;
})();
