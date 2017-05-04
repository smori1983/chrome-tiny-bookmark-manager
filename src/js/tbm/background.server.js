tbm.background.server = (function() {
    var that = {},
        list = {};

    chrome.extension.onRequest.addListener(function(request, sender, callback) {
        var path = request.path,
            data = request.data;

        if (list.hasOwnProperty(path)) {
            try {
                list[path](data, callback);
            } catch (e) {
                callback({ message: e.message + ' for ' + path });
            }
        } else {
            callback({ message: 'path not found.' });
        }
    });

    that.register = function(ob) {
        $.each(ob, function(path, func) {
            list[path] = func;
        });

        return that;
    };

    return that;
})();
