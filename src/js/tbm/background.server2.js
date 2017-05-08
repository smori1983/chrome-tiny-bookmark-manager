tbm.background.server2 = (function() {
    var that = {};

    var jobs = {
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
            if (!params.hasOwnProperty('query')) {
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
            if (!params.hasOwnProperty('query')) {
                error('invalid params: query is required.');
            }

            var module = tbm.background.user.favoriteQuery;

            module.add(params.query);

            callback({});
        },
        '/user/query/favorite/remove': function(params, callback) {
            if (!params.hasOwnProperty('query')) {
                error('invalid params: query is required.');
            }

            var module = tbm.background.user.favoriteQuery;

            module.remove(params.query);

            callback({});
        },
        '/user/query/favorite/check': function(params, callback) {
            if (!params.hasOwnProperty('query')) {
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
        if (!jobs.hasOwnProperty(path)) {
            error('path not found.');
        }
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
})();
