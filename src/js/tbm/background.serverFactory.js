tbm.background.serverFactory = (function() {
  var that = {};

  /**
   * @param {chrome.bookmarks} bookmarksApi
   */
  that.create = function(bookmarksApi) {
    return tbm.background.server2(bookmarksApi);
  };

  return that;
})();
