// main
tbm.main = tbm.main || {};

tbm.main.sendRequest = function(path, data, callback) {
    chrome.extension.sendRequest({ path: path, data: data || {} }, callback || function() {});
};

tbm.main.showRecentSearchItems = (function() {
    var menu      = "#recent-search",
        content   = "#recent-search-content",
        template  = "/template/recent-search-set.html",
        timestamp = null;

    return function() {
        tbm.main.sendRequest("/user/query/recent", {}, function(response) {
            if (timestamp !== response.timestamp) {
                timestamp = response.tiemstamp;

                if (response.data.length > 0) {
                    $(content).empty();
                    smodules.template(template, { data: response.data }).appendTo(content);
                    $(menu).show();
                } else {
                    $(menu).hide();
                }
            }
        });
    };
})();
tbm.main.showFrequentSearchItems = (function() {
    var menu      = "#frequent-search",
        content   = "#frequent-search-content",
        template  = "/template/frequent-search-set.html",
        timestamp = null;

    return function() {
        tbm.main.sendRequest("/user/query/frequent", {}, function(response) {
            if (timestamp !== response.timestamp) {
                timestamp = response.timestamp;

                if (response.data.length > 0) {
                    $(content).empty();
                    smodules.template(template, { data: response.data }).appendTo(content);
                    $(menu).show();
                } else {
                    $(menu).hide();
                }
            }
        });
    };
})();
tbm.main.showBookmarkFolders = (function() {
    var menu      = "#found-folders",
        content   = "#found-folders-content",
        template  = "/template/found-folder-set.html",
        timestamp = null;

    return function() {
        tbm.main.sendRequest("/bookmark/folders", {}, function(response) {
            if (timestamp !== response.timestamp) {
                timestamp = response.timestamp;

                if (response.data.length > 0) {
                    $(content).empty();
                    smodules.template(template, { folders: response.data }).appendTo(content);
                    $(menu).show();
                } else {
                    $(menu).hide();
                }
            }
        });
    };
})();
tbm.main.showBookmarkTags = (function() {
    var menu      = "#found-tags",
        content   = "#found-tags-content",
        template  = "/template/found-tag-set.html",
        timestamp = null;

    return function() {
        tbm.main.sendRequest("/bookmark/tags", {}, function(response) {
            if (timestamp !== response.timestamp) {
                timestamp = response.timestamp;

                if (response.data.length > 0) {
                    $(content).empty();
                    smodules.template(template, { tags: response.data }).appendTo(content);
                    $(menu).show();
                } else {
                    $(menu).hide();
                }
            }
        });
    };
})();
tbm.main.showFavoriteQueries = (function() {
    var menu      = "#favorite-query",
        content   = "#favorite-query-content",
        template  = "/template/favorite-query-set.html",
        timestamp = null;

    return function() {
        tbm.main.sendRequest("/user/query/favorite/list", {}, function(response) {
            if (timestamp !== response.timestamp) {
                timestamp = response.timestamp;

                if (response.data.length > 0) {
                    $(content).empty();
                    smodules.template(template, { queries: response.data }).appendTo(content);
                    $(menu).show();
                } else {
                    $(menu).hide();
                }
            }
        });
    };
})();
tbm.main.checkFavoriteStatus = (function() {
    var id  = "#add-favorite-button",
        fav = "fav";

    return function(query) {
        tbm.main.sendRequest("/user/query/favorite/check", { query: query }, function(response) {
            if (response.answer) {
                $(id).addClass(fav);
            } else {
                $(id).removeClass(fav);
            }
        });
    };
})();
tbm.main.toggleFavoriteStatus = (function() {
    var id  = "#add-favorite-button",
        fav = "fav";

    var contains = function(data, testee) {
        return data.some(function(query) {
            return query.query === testee;
        });
    };

    return function(query) {
        tbm.main.sendRequest("/user/query/favorite/check", { query: query }, function(response) {
            if (response.answer) {
                tbm.main.sendRequest("/user/query/favorite/remove", { query: query }, function(response) {
                    if (!contains(response.data, query)) {
                        $(id).removeClass(fav);
                    }
                });
            } else {
                tbm.main.sendRequest("/user/query/favorite/add", { query: query }, function(response) {
                    if (contains(response.data, query)) {
                        $(id).addClass(fav);
                    }
                });
            }
        });
    };
})();
