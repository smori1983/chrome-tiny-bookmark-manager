/*!
 * smorijp.info tiny bookmark manager v0.1.3
 *
 * Copyright (c) 2012 smori <smori1983@gmail.com>
 * Dual licensed under the MIT or GPL-2.0 licenses.
 *
 * Date 2012-05-21 01:02:46
 */

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
            smodules.template(template, data).appendTo(content);
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
            smodules.template(template, data).appendTo(content);
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
        var folders = [];

        $.each(background.getFolders(), function(idx, folder) {
            folders.push({ name: folder });
        });

        if (folders.length > 0) {
            $(content).empty();
            smodules.template(template, folders).appendTo(content);
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
        var tags = [];

        $.each(background.getTags(), function(idx, tag) {
            tags.push({ name: tag });
        });

        if (tags.length > 0) {
            $(content).empty();
            smodules.template(template, tags).appendTo(content);
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
        var data = tbm.user.favorite.getAll();

        if (data.length > 0) {
            $(content).empty();
            smodules.template(template, data).appendTo(content);
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

$(function() {

    var searchForm   = "#search-form",
        searchQuery  = "#search-query",
        searchMsg    = "#search-msg",

        details = chrome.app.getDetails(),
        i18n    = chrome.i18n.getMessage,

        isManualSubmit = true;


    // i18n
    $("#recent-search-label").text(i18n("label_recentSearch"));
    $("#frequent-search-label").text(i18n("label_frequentSearch"));
    $("#recent-bookmark-label").text(i18n("label_recentBookmark"));
    $("#found-folders-label").text(i18n("label_foundFolders"));
    $("#found-tags-label").text(i18n("label_foundTags"));
    $("#favorite-query-label").text(i18n("label_favoriteQuery"));
    $("#search-result-label").text(i18n("label_searchResult"));

    // setting init
    tbm.user.query.
        setStoreDays(tbm.setting.get("query_store_days")).
        setRecentFetchSize(20).
        setFrequentFetchSize(20);

    // ui init
    $("#logo").text("version %s".format(details.version));
    $(searchQuery).focus();
    smodules.ui.tab({ id: "tab" });

    // event listener init

    // search form submit
    $(searchForm).submit(function() {
        var query,
            tab      = "#tab-main",
            menu     = "#search-result",
            content  = "#search-result-content",
            summary  = "#search-result-summary",
            favorite = "#add-favorite-button",
            template = "/template/bookmark-item.html";

        return function(e) {
            e.preventDefault();

            $(tab).click();

            query = $(searchQuery).val();
            if (query.length === 0) {
                return;
            }

            $(searchMsg).show();
            $(menu).hide();
            $(favorite).hide();

            tbm.bookmark.search.execute(query, function(hits) {
                $(content).empty();
                $(summary).text("%s (%d)".format(query, hits.length));

                if (hits.length > 0) {
                    hits.sort(function(a, b) {
                        return a.title.compare(b.title);
                    });
                    smodules.template(template, hits).appendTo(content);
                    tbm.main.checkFavoriteStatus(query);
                    $(favorite).show();

                    if (isManualSubmit) {
                        tbm.user.query.add(query);
                    }
                }
                isManualSubmit = true;
                $(searchMsg).hide();
                $(menu).show();
            });
        };
    }());

    // trigger search
    (function(list) {
        $.each(list, function(idx, ob) {
            $(ob.id).click(function(e) {
                smodules.ui.hasClass(e, ob.className, function(target) {
                    if (ob.tagged) {
                        $(searchQuery).val($(target).text());
                    } else {
                        $(searchQuery).val("[" + $(target).text() + "]");
                    }
                    $(searchForm).submit();
                });
            });
        });
    })([
        { id: "#recent-search-content",   className: "query", tagged: true },
        { id: "#frequent-search-content", className: "query", tagged: true },
        { id: "#found-folders-content",   className: "name",  tagged: false },
        { id: "#found-tags-content",      className: "name",  tagged: false },
        { id: "#favorite-query-content",  className: "query", tagged: true }
    ]);

    // tab 'TAGS'
    $("#tab-tags").click(function(e) {
        e.preventDefault();
        tbm.main.showBookmarkFolders();
        tbm.main.showBookmarkTags();
    });

    // tab 'DATA'
    $("#tab-data").click(function(e) {
        e.preventDefault();
        tbm.main.showRecentSearchItems();
        tbm.main.showFrequentSearchItems();
        //tbm.main.showRecentBookmarkItems();
    });

    // tab 'FAVORITE'
    $("#tab-fav").click(function(e) {
        e.preventDefault();
        tbm.main.showFavoriteQueries();
    });

    // restore last query
    if (tbm.setting.get("latest_query") === "yes") {
        window.setTimeout(function() {
            var latest = tbm.user.query.getLatest();

            if (latest !== "") {
                isManualSubmit = false;
                $(searchQuery).val(latest);
                $(searchForm).submit();
            }
        }, 600);
    }

    // add favorite button
    (function() {
        var id = "add-favorite-button";

        $("body").click(function(e) {
            smodules.ui.hasId(e, id, function(target) {
                tbm.main.toggleFavoriteStatus($(searchQuery).val());
            });
        }).mouseover(function(e) {
            smodules.ui.hasId(e, id, function(target) {
                $(target).addClass("mouse");
            });
        }).mouseout(function(e) {
            smodules.ui.hasId(e, id, function(target) {
                $(target).removeClass("mouse");
            });
        });
    })();

    // remove favorite button
    (function() {
        var className = "favorite-remove-button";

        $("body").click(function(e) {
            smodules.ui.hasClass(e, className, function(target) {
                tbm.user.favorite.remove($(target).prev().text());
                $(target).parent().remove();
                tbm.main.showFavoriteQueries();
            });
        }).mouseover(function(e) {
            smodules.ui.hasClass(e, className, function(target) {
                $(target).addClass("mouse");
            });
        }).mouseout(function(e) {
            smodules.ui.hasClass(e, className, function(target) {
                $(target).removeClass("mouse");
            });
        });
    })();

    // edit bookmark title
    (function() {
        var button   = "edit-button",
            menu     = "bookmark-edit",
            template = "/template/bookmark-edit.html",

            editBound = null,
            id = null;

        var reset = function() {
            if (editBound) {
                $("." + menu).remove();
                $(editBound).show();
                editBound = id = null;
            }
        };

        $("body").click(function(e) {
            smodules.ui.hasClass(e, button, function(target) {
                reset();
                editBound = $(target).parent();
                id = $(editBound).parent().attr("id").replace("bookmark-", "");

                smodules.template(template, {
                    id: id,
                    title: $(editBound).find("a:first").text()
                }).insertBefore(editBound);
                $(editBound).hide();
            }, function(target) {
                smodules.ui.hasClass(e, "title", function(target) {}, function(target) {
                    reset();
                });
            });
        }).submit(function(e) {
            smodules.ui.hasClass(e, menu, function(target) {
                e.preventDefault();
                chrome.bookmarks.update(id, {
                    title: $(target).find("input.title").val()
                }, function(bookmarkTreeNode) {
                    $(editBound).find("a:first").text(bookmarkTreeNode.title);
                    reset();
                });
            });
        }).mouseover(function(e) {
            smodules.ui.hasClass(e, button, function(target) {
                $(target).addClass("mouse");
            });
        }).mouseout(function(e) {
            smodules.ui.hasClass(e, button, function(target) {
                $(target).removeClass("mouse");
            });
        });
    })();
});
