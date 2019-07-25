/**
 * tbm.background.user.query
 *
 * setStoreDays(days)
 * setRecentFetchSize(size)
 * setFrequentFetchSize(size)
 * add(query)
 * getLatest()
 * getRecent()
 * getFrequent()
 */
tbm.background.user.query = (function() {
    var that = {};
    var key  = 'user.query';

    var timestamp = null;
    var data = null;

    var storeDays         = 28;
    var recentFetchSize   = 20;
    var frequentFetchSize = 20;

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

    var clean = function() {
        var date = new Date().add({ day: -storeDays }).format('%Y-%m-%d');

        while (data && data.length > 0 && data[data.length - 1].date < date) {
            data.pop();
        }
    };

    load();

    that.reload = function() {
        load(true);
    };

    that.setStoreDays = function(days) {
        if (typeof days === 'number') {
            storeDays = parseInt(days, 10);
        }
        return that;
    };

    that.setRecentFetchSize = function(size) {
        if (typeof size === 'number') {
            recentFetchSize = parseInt(size, 10);
        }
        return that;
    };

    that.setFrequentFetchSize = function(size) {
        if (typeof size === 'number') {
            frequentFetchSize = parseInt(size, 10);
        }
        return that;
    };

    that.add = function(query) {
        data.unshift({
            date:  new Date().format('%Y-%m-%d'),
            query: query,
        });
        clean();
        save();
    };

    that.getTimestamp = function() {
        return timestamp;
    };

    that.getLatest = function() {
        return data.length > 0 ? data[0].query : '';
    };

    that.getRecent = function() {
        return data.slice(0, recentFetchSize);
    };

    that.getFrequent = function() {
        var summary = {};
        var array = [];

        data.forEach(function(item) {
            summary[item.query] = 0;
        });

        data.forEach(function(item) {
            summary[item.query] += 1;
        });

        Object.keys(summary).forEach(function(query) {
            array.push({
                query: query,
                count: summary[query],
            });
        });

        array.sort(function(a, b) {
            if (a.count === b.count) {
                return a.query < b.query ? -1 : 1;
            }

            return b.count - a.count;
        });

        return array.slice(0, frequentFetchSize);
    };

    return that;
})();
