tbm.background.server2 = (function() {
    var that = {};

    var jobs = {
        '/user/query/latest': function(params) {
            var module = tbm.background.user.query;

            return {
                timestamp: module.getTimestamp(),
                data: module.getLatest(),
            };
        },
        '/user/query/recent': function(params) {
            var module = tbm.background.user.query;

            return {
                timestamp: module.getTimestamp(),
                data: module.getRecent(),
            };
        },
        '/user/query/frequent': function(params) {
            var module = tbm.background.user.query;

            return {
                timestamp: module.getTimestamp(),
                data: module.getFrequent(),
            };
        },
    };

    var checkPath = function(path) {
        if (!jobs.hasOwnProperty(path)) {
            throw new Error('path not found.');
        }
    };

    that.request = function(path, params) {
        var result = {
            request: {
                path: path,
                params: params,
            },
        };

        try {
            checkPath(path);

            result.status = 'ok';
            result.response = jobs[path](params);
        } catch (e) {
            result.status = 'error';
            result.message = e.message;
        }

        return result;
    };

    return that;
})();
