tbm.bookmarkUtil = (function() {
    var that = {};

    /**
     * Extracts tags from title.
     *
     * tag pattern: [xxx]
     *
     * @param string title
     * @return string[]
     */
    that.getTags = function(title) {
        var input = title.trimLeft();
        var tags = [];
        var pattern = /^\[([^\[\]]+)\]/;
        var matched;

        while ((matched = pattern.exec(input))) {
            tags.push(matched[1]);
            input = input.slice(matched[0].length).trimLeft();
        }

        return tags;
    };

    return that;
})();
