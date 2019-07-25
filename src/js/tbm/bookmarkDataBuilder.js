/**
 * NOTE:
 * - tbm.bookmarkUtil should be loaded previously.
 */
tbm.bookmarkDataBuilder = (function() {
    var util = tbm.bookmarkUtil;

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
            id: node.id,
            title: node.title,
            fullTitle: util.getFullTitle(node.title, folderStack),
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
        util.getTags(title).forEach(function(tagName) {
            addTag(result, tagName);
        });
    };

    var addTag = function (result, tagName) {
        if (result.tags.indexOf(tagName) < 0) {
            result.tags.push(tagName);
        }
    };

    var prepareFolders = function(folders) {
        var result = [];

        folders.forEach(function(folderName) {
            result.push({ name: folderName });
        });

        return result;
    };

    var prepareTags = function(tags) {
        var result = [];

        tags.forEach(function(tagName) {
            result.push({ name: tagName });
        });

        return result;
    };

    /**
     * @param BookmarkTreeNode rootNode
     * @return object
     */
    that.build = function(rootNode) {
        var tmp = {
            bookmarks: [],
            folders: [],
            tags: [],
        };

        walkFolder(tmp, rootNode, []);

        tmp.folders.sort();
        tmp.tags.sort();

        return {
            bookmarks: tmp.bookmarks,
            folders: prepareFolders(tmp.folders),
            tags: prepareTags(tmp.tags),
        };
    };

    return that;
})();
