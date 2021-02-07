/**
 * @param {chrome.bookmarks} bookmarksApi
 */
tbm.bookmarkManager = function(bookmarksApi) {
  var that = {};

  var importing = false;

  var dataBuilder;
  var search;

  var timestamp;
  var bookmarkData;

  that.init = function(callback) {
    dataBuilder = tbm.bookmarkDataBuilder;
    search = tbm.bookmarkSearch;

    that.update(callback);
  };

  that.update = (function() {
    var wait = 100;
    var inProgress = false;
    var eventCount = 0;

    var execute = function(callback) {
      var timeLabel = 'bookmark scan';

      smodules.util.console.time(timeLabel);

      bookmarksApi.getTree(function(rootNodes) {
        bookmarkData = dataBuilder.build(rootNodes[0]);
        timestamp = new Date().getTime();

        smodules.util.console.timeEnd(timeLabel);

        inProgress = false;
        eventCount = 0;

        if (typeof callback === 'function') {
          callback();
        }
      });
    };

    return function(callback, isRecursive) {
      var logMsg = 'update - execute() %s - eventCount = %d';

      if (importing) {
        return;
      }

      eventCount += isRecursive ? 0 : 1;

      if (inProgress) {
        return;
      }

      inProgress = true;

      window.setTimeout(function() {
        if (eventCount <= 1) {
          smodules.util.console.log(logMsg.format('called', eventCount));
          execute(callback);
        } else {
          smodules.util.console.log(logMsg.format('not called', eventCount));
          inProgress = false;
          eventCount = Math.floor(eventCount / 2);
          that.update(callback, true);
        }
      }, wait);
    };
  })();

  that.getTimestamp = function() {
    return timestamp;
  };

  that.getBookmarks = function(query) {
    if (typeof query === 'string') {
      return search.execute(bookmarkData.bookmarks, query);
    } else {
      return bookmarkData.bookmarks;
    }
  };

  that.getFolders = function() {
    return bookmarkData.folders;
  };

  that.getTags = function() {
    return bookmarkData.tags;
  };

  that.updateBookmark = function(id, params, callback) {
    if (!Object.prototype.hasOwnProperty.call(params, 'title')) {
      return;
    }

    bookmarksApi.update(id, params, function(updated) {
      callback({
        id: updated.id,
        title: updated.title,
        url: updated.url,
      });
    });
  };

  that.importLock = function() {
    importing = true;
  };

  that.importUnlock = function() {
    importing = false;
  };

  return that;
};
