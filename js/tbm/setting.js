/**
 * tbm.setting
 *
 * openType
 */
tbm.setting = tbm.setting || {};
tbm.setting = (function() {
    var that   = {},
        prefix = "setting.log",

        defaults = {
            "latest_query": "yes",
            "query_store_days": "30"
        };

    var getKey = function(key) {
        return [prefix, key].join(".");
    };

    that.set = function(key, value) {
        smodules.storage.set(getKey(key), value);
    };

    that.get = function(key) {
        var data = smodules.storage.get(getKey(key));

        if (data === null) {
            return defaults.hasOwnProperty(key) ? defaults[key] : data;
        } else {
            return data;
        }
    };

    return that;
})();
