tbm.bookmarkSearch = (function() {
  var that = {};

  /**
   * @param {string} query
   * @returns {RegExp[]}
   */
  var setupRegex = function(query) {
    return query.trim().replace(/\s+/g, ' ').split(' ').map(function(value) {
      return new RegExp(regexQuote(value), 'i');
    });
  };

  /**
   * @param {string} value
   * @returns {string}
   */
  var regexQuote = function(value) {
    return value.replace(/[\^$.?*+\-\\/:=!,()[\]{}]/g, function(matched) {
      return '\\' + matched;
    });
  };

  /**
   * @param {string} testee
   * @param {RegExp[]} regexList
   * @returns {boolean}
   */
  var checkWords = function(testee, regexList) {
    return regexList.every(function(value) {
      return value.test(testee);
    });
  };

  /**
   * @param {Bookmark[]} bookmarkData
   * @param {string} query
   * @returns {Bookmark[]}
   */
  that.execute = function(bookmarkData, query) {
    var regexList = setupRegex(query);

    return bookmarkData.filter(function(bookmark) {
      return checkWords(bookmark.fullTitle, regexList);
    });
  };

  return that;
})();
