tbm.bookmarkSearch = (function() {
  var that = {};

  var setupRegex = function(query) {
    return query.trim().replace(/\s+/g, ' ').split(' ').map(function(value) {
      return new RegExp(regexQuote(value), 'i');
    });
  };

  var regexQuote = function(value) {
    return value.replace(/[\^$.?*+\-\\/:=!,()[\]{}]/g, function(matched) {
      return '\\' + matched;
    });
  };

  var checkWords = function(testee, regexList) {
    return regexList.every(function(value) {
      return value.test(testee);
    });
  };

  that.execute = function(bookmarkData, query) {
    var regexList = setupRegex(query);

    return bookmarkData.filter(function(bookmark) {
      return checkWords(bookmark.fullTitle, regexList);
    });
  };

  return that;
})();
