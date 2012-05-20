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
