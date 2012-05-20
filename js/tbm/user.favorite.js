/**
 * tbm.user.favorite
 *
 * add(query)
 * remove(query)
 * isAdded(query)
 * getAll()
 */
tbm.user = tbm.user || {};
tbm.user.favorite = (function() {
    var that = {},
        key  = "user.favorite",
        data = null;

    var load = function() {
        if (data === null) {
            data = smodules.storage.getJSON(key, []);
        }
    };

    var save = function() {
        smodules.storage.setJSON(key, data);
    };

    var notIn = function(value, array, callback) {
        if ($.inArray(value, array) < 0) {
            callback();
        }
    };

    that.add = function(query) {
        load();
        notIn(query, data, function() {
            data.push(query);
        });
        data.sort();
        save();
    };

    that.remove = function(query) {
        var idx;

        load();
        if ((idx = data.indexOf(query)) >= 0) {
            data.splice(idx, 1);
        }
        save();        
    };

    that.isAdded = function(query) {
        load();
        return $.inArray(query, data) >= 0;
    };

    that.getAll = function() {
        var array = [];

        load();
        $.each(data, function(idx, query) {
            array.push({ query: query });
        });
        return array;
    };

    return that;
})();
