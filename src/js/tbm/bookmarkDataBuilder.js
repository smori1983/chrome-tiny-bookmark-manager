/**
 * NOTE:
 * - tbm.bookmarkUtil should be loaded previously.
 */
tbm.bookmarkDataBuilder = (function() {
  var util = tbm.bookmarkUtil;

  var that = {};

  /**
   * @param {BookmarkTmpDataSet} result
   * @param {chrome.bookmarks.BookmarkTreeNode} bookmarkTreeNode
   * @param {string[]} folderStack
   */
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

  /**
   * @param {chrome.bookmarks.BookmarkTreeNode} bookmarkTreeNode
   * @returns {boolean}
   */
  var isBookmarkNode = function (bookmarkTreeNode) {
    return Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'url');
  };

  /**
   * @param {BookmarkTmpDataSet} result
   * @param {chrome.bookmarks.BookmarkTreeNode} node
   * @param {string[]} folderStack
   */
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

  /**
   * @param {BookmarkTmpDataSet} result
   * @param {string} folderName
   */
  var addFolder = function (result, folderName) {
    if (result.folders.indexOf(folderName) < 0) {
      result.folders.push(folderName);
    }
  };

  /**
   * @param {BookmarkTmpDataSet} result
   * @param {string} title
   */
  var addTags = function (result, title) {
    util.getTags(title).forEach(function(tagName) {
      addTag(result, tagName);
    });
  };

  /**
   * @param {BookmarkTmpDataSet} result
   * @param {string} tagName
   */
  var addTag = function (result, tagName) {
    if (result.tags.indexOf(tagName) < 0) {
      result.tags.push(tagName);
    }
  };

  /**
   * @param {string[]} folders
   * @returns {Folder[]}
   */
  var prepareFolders = function(folders) {
    var result = [];

    folders.forEach(function(folderName) {
      result.push({ name: folderName });
    });

    return result;
  };

  /**
   * @param {string[]} tags
   * @returns {Tag[]}
   */
  var prepareTags = function(tags) {
    var result = [];

    tags.forEach(function(tagName) {
      result.push({ name: tagName });
    });

    return result;
  };

  /**
   * @param {chrome.bookmarks.BookmarkTreeNode} rootNode
   * @returns {BookmarkDataSet}
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

/**
 * @typedef BookmarkTmpDataSet
 * @property {Bookmark[]} bookmarks
 * @property {string[]} folders
 * @property {string[]} tags
 */

/**
 * @typedef BookmarkDataSet
 * @property {Bookmark[]} bookmarks
 * @property {Folder[]} folders
 * @property {Tag[]} tags
 */

/**
 * @typedef Bookmark
 * @property {string} id
 * @property {string} title
 * @property {string} fullTitle
 * @property {string} url
 * @property {string[]} folders
 */

/**
 * @typedef Folder
 * @property {string} name
 */

/**
 * @typedef Tag
 * @property {string} name
 */
