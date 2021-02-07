/**
 * tbm.setting
 */
tbm.setting = (function() {
  var that   = {};
  var prefix = 'setting.log';

  var defaults = {
    'latest_query': 'yes',
    'query_store_days': '30',
  };

  var isValidKey = function(key) {
    return Object.prototype.hasOwnProperty.call(defaults, key);
  };

  var getKey = function(key) {
    return [prefix, key].join('.');
  };

  /**
   * keys:
   * - latest_query
   * - query_store_days
   *
   * @param {string} key setting key
   * @param {string} value setting value
   */
  that.set = function(key, value) {
    if (isValidKey(key)) {
      smodules.storage.set(getKey(key), value);
    }
  };

  /**
   * keys:
   * - latest_query
   * - query_store_days
   *
   * @param {string} key setting key
   * @returns {(string|null)}
   */
  that.get = function(key) {
    var data;

    if (isValidKey(key)) {
      data = smodules.storage.get(getKey(key));

      return data === null ? defaults[key] : data;
    }

    return null;
  };

  return that;
})();
