tbm.util = tbm.util || {};

tbm.util.tag = (function() {
    var regex = /\{\{([a-z]+):(.+?)\}\}/g,
        tags  = "code|strong";

    // {{tag:content}} -> <tag>content</tag>
    return function(value) {
        return value.toString().replace(regex, function(matched, tag, content) {
            if (tags.indexOf(tag) >= 0) {
                return "<%s>%s</%s>".format(tag, content, tag);
            } else {
                return matched;
            }
        });
    };
})();

tbm.util.i18n = (function() {
    var getRegex = function(prefix) {
        return new RegExp("^%s_(tag|id|class)_([0-9a-zA-Z_]+)$".format(prefix));
    };

    var getTarget = function(matched) {
        switch (matched[1]) {
            case "tag":   return matched[2];
            case "id":    return "#" + matched[2].replace(/_/g, "-");
            case "class": return "." + matched[2].replace(/_/g, "-");
        }
    };

    return function(locale, prefix) {
        var matched, regex = getRegex(prefix);

        $.ajax({
            url: chrome.extension.getURL("/_locales/%s/messages.json".format(locale)),
            dataType: "json",
            success: function(response) {
                $.each(response, function(key, value) {
                    if ((matched = key.match(regex))) {
                        $(getTarget(matched)).html(tbm.util.tag(value.message.escapeHTML()));
                    }
                });
            }
        });
    };
})();
