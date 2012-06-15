// main
tbm.main = tbm.main || {};
tbm.main.showRecentSearchItems = (function() {
    var menu     = "#recent-search",
        content  = "#recent-search-content",
        template = "/template/recent-search.html";

    return function() {
        var data = tbm.user.query.getRecent();

        if (data.length > 0) {
            $(content).empty();
            smodules.template(template, { data: data }).appendTo(content);
            $(menu).show();
        } else {
            $(menu).hide();
        }
    };
})();
tbm.main.showFrequentSearchItems = (function() {
    var menu     = "#frequent-search",
        content  = "#frequent-search-content",
        template = "/template/frequent-search.html";

    return function() {
        var data = tbm.user.query.getFrequent();

        if (data.length > 0) {
            $(content).empty();
            smodules.template(template, { data: data }).appendTo(content);
            $(menu).show();
        } else {
            $(menu).hide();
        }
    };
})();
tbm.main.showBookmarkFolders = (function() {
    var menu     = "#found-folders",
        content  = "#found-folders-content",
        template = "/template/found-folders.html",

        background = chrome.extension.getBackgroundPage().tbm.background;

    return function() {
        var folders = background.getFolders();

        if (folders.length > 0) {
            $(content).empty();
            smodules.template(template, { folders: folders }).appendTo(content);
            $(menu).show();
        } else {
            $(menu).hide();
        }
    };
})();
tbm.main.showBookmarkTags = (function() {
    var menu     = "#found-tags",
        content  = "#found-tags-content",
        template = "/template/found-tags.html",

        background = chrome.extension.getBackgroundPage().tbm.background;

    return function() {
        var tags = background.getTags();

        if (tags.length > 0) {
            $(content).empty();
            smodules.template(template, { tags: tags }).appendTo(content);
            $(menu).show();
        } else {
            $(menu).hide();
        }
    };
})();
tbm.main.showFavoriteQueries = (function() {
    var menu     = "#favorite-query",
        content  = "#favorite-query-content",
        template = "/template/favorite-query.html";

    return function() {
        var queries = tbm.user.favorite.getAll();

        if (queries.length > 0) {
            $(content).empty();
            smodules.template(template, { queries: queries }).appendTo(content);
            $(menu).show();
        } else {
            $(menu).hide();
        }
    };
})();
tbm.main.checkFavoriteStatus = (function() {
    var id  = "#add-favorite-button",
        fav = "fav";

    return function(query) {
        if (tbm.user.favorite.isAdded(query)) {
            $(id).addClass(fav);
        } else {
            $(id).removeClass(fav);
        }
    };
})();
tbm.main.toggleFavoriteStatus = (function() {
    var id  = "#add-favorite-button",
        fav = "fav";

    return function(query) {
        if (tbm.user.favorite.isAdded(query)) {
            $(id).removeClass(fav);
            tbm.user.favorite.remove(query);
        } else {
            $(id).addClass(fav);
            tbm.user.favorite.add(query);
        }
    };
})();
