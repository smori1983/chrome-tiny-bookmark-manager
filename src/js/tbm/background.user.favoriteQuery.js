/**
 * tbm.background.user.favoriteQuery
 *
 * add(query)
 * remove(query)
 * isAdded(query)
 * getAll()
 */
tbm.background.user.favoriteQuery = (function() {
    var that = {};
    var key  = 'user.favorite';

    var timestamp = null;
    var data = null;

    var time = function() {
        timestamp = new Date().getTime();
    };

    var load = function(force) {
        if (force === true || data === null) {
            data = smodules.storage.getJSON(key, []);
            time();
        }
    };

    var save = function() {
        smodules.storage.setJSON(key, data);
        time();
    };

    var contains = function(testee) {
        return data.some(function(query) {
            return query === testee;
        });
    };

    load();

    that.reload = function() {
        load(true);
    };

    that.add = function(query) {
        if (!contains(query)) {
            data.push(query);
            data.sort();
            save();
        }
    };

    that.remove = function(query) {
        if (contains(query)) {
            data.splice(data.indexOf(query), 1);
            save();
        }
    };

    that.getTimestamp = function() {
        return timestamp;
    };

    that.getAll = function() {
        return data.map(function(query) {
            return { query: query };
        });
    };

    that.check = function(query) {
        return contains(query);
    };

    return that;
})();
