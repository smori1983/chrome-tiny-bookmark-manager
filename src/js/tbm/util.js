tbm.util = tbm.util || {};

tbm.util.tag = (function() {
    var regex = /\{\{([a-z]+):(.+?)\}\}/g;
    var tags = 'code|strong';

    /**
     * Converts input to html tag formatted string.
     *
     * {{tag:content}} -> <tag>content</tag>
     *
     * Acceptable tags:
     * - code
     * - strong
     *
     * @param string value
     * @return string
     */
    return function(value) {
        if (typeof value !== 'string') {
            return '';
        }

        return value.toString().replace(regex, function(matched, tag, content) {
            if (tags.indexOf(tag) >= 0) {
                return '<%s>%s</%s>'.format(tag, content, tag);
            } else {
                return matched;
            }
        });
    };
})();

tbm.util.i18n = (function() {
    var getRegex = function(prefix) {
        return new RegExp('^%s_(tag|id|class)_([0-9a-zA-Z_]+)$'.format(prefix));
    };

    var getTarget = function(matched) {
        switch (matched[1]) {
            case 'tag':   return matched[2];
            case 'id':    return '#' + matched[2].replace(/_/g, '-');
            case 'class': return '.' + matched[2].replace(/_/g, '-');
        }
    };

    return function(locale, prefix) {
        var matched, regex = getRegex(prefix);

        $.ajax({
            url: chrome.extension.getURL('/_locales/%s/messages.json'.format(locale)),
            dataType: 'json',
            success: function(response) {
                $.each(response, function(key, value) {
                    if ((matched = key.match(regex))) {
                        $(getTarget(matched)).html(tbm.util.tag(value.message.escapeHTML()));
                    }
                });
            },
        });
    };
})();

/**
 * @param array array array to be accessed.
 * @param function callback function to be called for each array element or elements.
 * @param int interval milliseconds to wait for delay.
 * @param int step size access in one time.
 * @param bool together when true argument of callback function is an array of elements.
 */
tbm.util.delayedArrayAccess = function(spec) {
    if (!$.isArray(spec.array) ||
        typeof spec.callback !== 'function' ||
        typeof spec.interval !== 'number' ||
        typeof spec.step !== 'number') {

        return;
    }

    spec.size = spec.array.length;

    var id = null;

    var execute = function(start) {
        var i, next = start + spec.step;

        if (spec.together) {
            spec.callback(spec.array.slice(start, next));
        } else {
            for (i = start; i < next && i < spec.size; i++) {
                spec.callback(spec.array[i]);
            }
        }

        if (next < spec.size) {
            id = window.setTimeout(function() {
                execute(next);
            }, spec.interval);
        } else {
            id = null;
        }
    };

    var that = {};

    that.start = function() {
        execute(0);
        return that;
    };

    that.stop = function() {
        if (id) {
            window.clearTimeout(id);
        }
        return that;
    };

    return that;
};
