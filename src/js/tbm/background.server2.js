/**
 * @param chrome.bookmarks bookmarksApi
 */
tbm.background.server2 = function(bookmarksApi) {
  var that = {};

  var manager = tbm.bookmarkManager(bookmarksApi);

  var hasProperty = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  var jobs = {
    '/bookmark/search': function(params, callback) {
      if (!hasProperty(params, 'query')) {
        error('invalid params: query is required.');
      }

      callback({
        timestamp: manager.getTimestamp(),
        data: manager.getBookmarks(params.query),
      });
    },
    '/bookmark/bookmarks': function(params, callback) {
      callback({
        timestamp: manager.getTimestamp(),
        data: manager.getBookmarks(params.query || null),
      });
    },
    '/bookmark/folders': function(params, callback) {
      callback({
        timestamp: manager.getTimestamp(),
        data: manager.getFolders(),
      });
    },
    '/bookmark/tags': function(params, callback) {
      callback({
        timestamp: manager.getTimestamp(),
        data: manager.getTags(),
      });
    },
    '/bookmark/item/update': function(params, callback) {
      if (!hasProperty(params, 'id')) {
        error('invalid params: id is required.');
      }
      if (!hasProperty(params, 'title')) {
        error('invalid params: title is required.');
      }

      manager.updateBookmark(params.id, {
        title: params.title,
      }, function(updated) {
        callback({
          bookmark: updated,
        });
      });
    },
    '/user/query/latest': function(params, callback) {
      var module = tbm.background.user.query;

      callback({
        timestamp: module.getTimestamp(),
        data: module.getLatest(),
      });
    },
    '/user/query/recent': function(params, callback) {
      var module = tbm.background.user.query;

      callback({
        timestamp: module.getTimestamp(),
        data: module.getRecent(),
      });
    },
    '/user/query/frequent': function(params, callback) {
      var module = tbm.background.user.query;

      callback({
        timestamp: module.getTimestamp(),
        data: module.getFrequent(),
      });
    },
    '/user/query/add': function(params, callback) {
      if (!hasProperty(params, 'query')) {
        error('invalid params: query is required.');
      }

      var module = tbm.background.user.query;

      module.add(params.query);

      callback({
        timestamp: module.getTimestamp(),
        data: null,
      });
    },
    '/user/query/favorite/list': function(params, callback) {
      var module = tbm.background.user.favoriteQuery;

      callback({
        timestamp: module.getTimestamp(),
        data: module.getAll(),
      });
    },
    '/user/query/favorite/add': function(params, callback) {
      if (!hasProperty(params, 'query')) {
        error('invalid params: query is required.');
      }

      var module = tbm.background.user.favoriteQuery;

      module.add(params.query);

      callback({});
    },
    '/user/query/favorite/remove': function(params, callback) {
      if (!hasProperty(params, 'query')) {
        error('invalid params: query is required.');
      }

      var module = tbm.background.user.favoriteQuery;

      module.remove(params.query);

      callback({});
    },
    '/user/query/favorite/check': function(params, callback) {
      if (!hasProperty(params, 'query')) {
        error('invalid params: query is required.');
      }

      var module = tbm.background.user.favoriteQuery;

      callback({
        answer: module.check(params.query),
      });
    },
  };

  var error = function(message) {
    throw new Error(message);
  };

  var checkPath = function(path) {
    if (!hasProperty(jobs, path)) {
      error('path not found.');
    }
  };

  that.start = function(callback) {
    manager.init(callback);
  };

  that.crawl = function(callback) {
    manager.update(callback);
  };

  that.request = function(path, params, responseCallback) {
    var request = {
      path: path,
      params: params,
    };

    try {
      checkPath(path);

      jobs[path](params, function(body) {
        responseCallback({
          request: request,
          status: 'ok',
          body: body,
        });
      });
    } catch (e) {
      responseCallback({
        request: request,
        status: 'error',
        message: e.message,
      });
    }
  };

  return that;
};
