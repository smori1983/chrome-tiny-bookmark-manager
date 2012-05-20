/**
 * tbm.user.query
 *
 * setStoreDays(days)
 * setRecentFetchSize(size)
 * setFrequentFetchSize(size)
 * add(query)
 * getLatest()
 * getRecent()
 * getFrequent()
 */
tbm.user = tbm.user || {};
tbm.user.query = (function() {
    var that = {},
        key  = "user.query",
        data = null,

        storeDays         = 28,
        recentFetchSize   = 20,
        frequentFetchSize = 20;

    var load = function() {
        if (data === null) {
            data = smodules.storage.getJSON(key, []);
        }
    };

    var save = function() {
        smodules.storage.setJSON(key, data);
    };

    var clean = function() {
        var date = new Date().add({ day: -storeDays }).format("%Y-%m-%d");

        while (data && data.length > 0 && data[data.length - 1].date < date) {
            date.pop();
        }
    };

    that.setStoreDays = function(days) {
        if (typeof days === "number") {
            storeDays = parseInt(days, 10);
        }
        return that;
    };

    that.setRecentFetchSize = function(size) {
        if (typeof size === "number") {
            recentFetchSize = parseInt(size, 10);
        }
        return that;
    };

    that.setFrequentFetchSize = function(size) {
        if (typeof size === "number") {
            frequentFetchSize = parseInt(size, 10);
        }
        return that;
    };

    that.add = function(query) {
        load();
        data.unshift({
            date:  new Date().format("%Y-%m-%d"),
            query: query
        });
        clean();
        save();
    };

    that.getLatest = function() {
        load();
        return data.length > 0 ? data[0].query : "";
    };

    that.getRecent = function() {
        load();
        return data.slice(0, recentFetchSize);
    };

    that.getFrequent = function() {
        var summary, array = [];

        load();
        summary = data.reduce(function(prev, current, index, array) {
            if (prev.hasOwnProperty(current.query)) {
                prev[current.query] += 1;
            } else {
                prev[current.query] = 1;
            }
            return prev;
        }, {});

        $.each(summary, function(query, count) {
            array.push({
                query: query,
                count: count
            });
        });
        array.sort(function(a, b) {
            return b.count - a.count;
        });

        return array.slice(0, frequentFetchSize);
    };

    return that;
})();
