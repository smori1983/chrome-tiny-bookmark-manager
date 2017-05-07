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

    /**
     * Creates the title with folder names.
     *
     * @param string title
     * @param string[] folders
     * @return string
     */
    that.getFullTitle = function(title, folders) {
        // Because first element of folders is 'bookmark bar',
        // skip it.
        return folders.slice(1).map(function(value) {
            return '[' + value + ']';
        }).join('') + title;
    };

    return that;
})();
