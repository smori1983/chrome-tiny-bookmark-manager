// main
tbm.main = tbm.main || {};

tbm.main.sendRequest = function(path, data, callback) {
    chrome.extension.sendRequest({ path: path, data: data || {} }, callback || function() {});
};

tbm.main.showRecentSearchItems = (function() {
    var menu     = '#recent-search';
    var content  = '#recent-search-content';
    var template = '/template/recent-search-set.html';

    var canShow = function(response) {
        return response.status === 'ok'
            && response.body.data.length > 0;
    };

    return function() {
        tbm.main.sendRequest('/user/query/recent', {}, function(response) {
            if (canShow(response)) {
                $(content).empty();
                smodules.template(template, { data: response.body.data }).appendTo(content);
                $(menu).show();
            } else {
                $(menu).hide();
            }
        });
    };
})();

tbm.main.showFrequentSearchItems = (function() {
    var menu     = '#frequent-search';
    var content  = '#frequent-search-content';
    var template = '/template/frequent-search-set.html';

    var canShow = function(response) {
        return response.status === 'ok'
            && response.body.data.length > 0;
    };

    return function() {
        tbm.main.sendRequest('/user/query/frequent', {}, function(response) {
            if (canShow(response)) {
                $(content).empty();
                smodules.template(template, { data: response.body.data }).appendTo(content);
                $(menu).show();
            } else {
                $(menu).hide();
            }
        });
    };
})();

tbm.main.showBookmarkFolders = (function() {
    var menu     = '#found-folders';
    var content  = '#found-folders-content';
    var template = '/template/found-folder-set.html';

    var canShow = function(response) {
        return response.status === 'ok'
            && response.body.data.length > 0;
    };

    return function() {
        tbm.main.sendRequest('/bookmark/folders', {}, function(response) {
            if (canShow(response)) {
                $(content).empty();
                smodules.template(template, { folders: response.body.data }).appendTo(content);
                $(menu).show();
            } else {
                $(menu).hide();
            }
        });
    };
})();

tbm.main.showBookmarkTags = (function() {
    var menu     = '#found-tags';
    var content  = '#found-tags-content';
    var template = '/template/found-tag-set.html';

    var canShow = function(response) {
        return response.status === 'ok'
            && response.body.data.length > 0;
    };

    return function() {
        tbm.main.sendRequest('/bookmark/tags', {}, function(response) {
            if (canShow(response)) {
                $(content).empty();
                smodules.template(template, { tags: response.body.data }).appendTo(content);
                $(menu).show();
            } else {
                $(menu).hide();
            }
        });
    };
})();

tbm.main.showFavoriteQueries = (function() {
    var menu     = '#favorite-query';
    var content  = '#favorite-query-content';
    var template = '/template/favorite-query-set.html';

    var canShow = function(response) {
        return response.status === 'ok'
            && response.body.data.length > 0;
    };

    return function() {
        tbm.main.sendRequest('/user/query/favorite/list', {}, function(response) {
            if (canShow(response)) {
                $(content).empty();
                smodules.template(template, { queries: response.body.data }).appendTo(content);
                $(menu).show();
            } else {
                $(menu).hide();
            }
        });
    };
})();

tbm.main.checkFavoriteStatus = (function() {
    var id  = '#add-favorite-button';
    var fav = 'fav';

    var isFavorite = function(response) {
        return response.status === 'ok'
            && response.body.answer === true;
    };

    return function(query) {
        tbm.main.sendRequest('/user/query/favorite/check', { query: query }, function(response) {
            if (isFavorite(response)) {
                $(id).addClass(fav);
            } else {
                $(id).removeClass(fav);
            }
        });
    };
})();

tbm.main.toggleFavoriteStatus = (function() {
    var id  = '#add-favorite-button';
    var fav = 'fav';

    var shouldBeNormalResponse = function(response) {
        if (response.status === 'error') {
            throw new Error();
        }
    };

    return function(query) {
        tbm.main.sendRequest('/user/query/favorite/check', { query: query }, function(response) {
            try {
                shouldBeNormalResponse(response);

                if (response.body.answer === true) {
                    tbm.main.sendRequest('/user/query/favorite/remove', { query: query }, function(response) {
                        shouldBeNormalResponse(response);
                        $(id).removeClass(fav);
                    });
                } else {
                    tbm.main.sendRequest('/user/query/favorite/add', { query: query }, function(response) {
                        shouldBeNormalResponse(response);
                        $(id).addClass(fav);
                    });
                }
            } catch (e) {
                $(id).removeClass(fav);
            }
        });
    };
})();
