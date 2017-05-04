(function() {

smodules.util.console.on();

var has = function(data, key) {
    return data.hasOwnProperty(key);
};

var exception = function(message) {
    throw new Error('main.background - ' + message);
};

tbm.background.server.register({
    '/bookmark/search': function(data, callback) {
        var module = tbm.background.bookmarkData;

        if (has(data, 'query')) {
            callback({
                timestamp: module.getTimestamp(),
                data:      module.getBookmarks(data.query)
            });
        } else {
            exception('no data: query');
        }
    },
    '/bookmark/bookmarks': function(data, callback) {
        var module = tbm.background.bookmarkData;

        callback({
            timestamp: module.getTimestamp(),
            data:      module.getBookmarks(has(data, 'query') ? data.query : null)
        });
    },

    '/bookmark/folders': function(data, callback) {
        var module = tbm.background.bookmarkData;

        callback({
            timestamp: module.getTimestamp(),
            data:      module.getFolders()
        });
    },

    '/bookmark/tags': function(data, callback) {
        var module = tbm.background.bookmarkData;

        callback({
            timestamp: module.getTimestamp(),
            data:      module.getTags()
        });
    },

    '/bookmark/item/update': function(data, callback) {
        var module = tbm.background.bookmarkData;

        if (has(data, 'bookmark')) {
            module.itemUpdate(data.bookmark, function(bookmarkTreeNode) {
                callback({ data: bookmarkTreeNode });
            });
        } else {
            exception('no data: bookmark');
        }
    },

    '/bookmark/item/remove': function(data, callback) {
    },

    '/user/query/latest': function(data, callback) {
        var module = tbm.background.user.query;

        callback({
            timestamp: module.getTimestamp(),
            data:      module.getLatest()
        });
    },

    '/user/query/recent': function(data, callback) {
        var module = tbm.background.user.query;

        callback({
            timestamp: module.getTimestamp(),
            data:      module.getRecent()
        });
    },

    '/user/query/frequent': function(data, callback) {
        var module = tbm.background.user.query;

        callback({
            timestamp: module.getTimestamp(),
            data:      module.getFrequent()
        });
    },

    '/user/query/add': function(data, callback) {
        if (data.hasOwnProperty('query')) {
            tbm.background.user.query.add(data.query);
        }
    },

    '/user/query/favorite/list': function(data, callback) {
        var module = tbm.background.user.favoriteQuery;

        callback({
            timestamp: module.getTimestamp(),
            data: module.getAll()
        });
    },

    '/user/query/favorite/add': function(data, callback) {
        var module = tbm.background.user.favoriteQuery;

        if (has(data, 'query')) {
            module.add(data.query);
            callback({
                data: module.getAll()
            });
        } else {
            exception('no data: query');
        }
    },

    '/user/query/favorite/remove': function(data, callback) {
        var module = tbm.background.user.favoriteQuery;

        if (has(data, 'query')) {
            module.remove(data.query);
            callback({
                data: module.getAll()
            });
        } else {
            exception('no data: query');
        }
    },

    '/user/query/favorite/check': function(data, callback) {
        var module = tbm.background.user.favoriteQuery;

        if (has(data, 'query')) {
            callback({
                answer: module.check(data.query)
            });
        } else {
            exception('no data: query');
        }
    }

}); // tbm.background.server.register()

})(); // END
