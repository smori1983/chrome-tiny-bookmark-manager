$(function() {

    var searchForm   = '#search-form',
        searchQuery  = '#search-query',
        searchMsg    = '#search-msg',

        details = chrome.app.getDetails(),
        locale  = window.navigator.language === 'ja' ? 'ja' : 'en',

        query = '',
        bookmarkRenderer = null,

        isManualSubmit = true;

    // template prefetch
    smodules.template.
        preFetch('/template/bookmark-edit.html').
        preFetch('/template/bookmark-item-set.html').
        preFetch('/template/favorite-query-set.html').
        preFetch('/template/found-folder-set.html').
        preFetch('/template/found-tag-set.html').
        preFetch('/template/frequent-search-set.html').
        preFetch('/template/recent-search-set.html');

    // i18n
    tbm.util.i18n(locale, 'popup');

    // ui init
    $('#logo').text('version %s'.format(details.version));
    $(searchQuery).focus();
    smodules.ui.tab({ id: 'tab' });

    // event listener init

    // search form submit
    $(searchForm).submit(function() {
        var tab      = '#tab-main',
            menu     = '#search-result',
            content  = '#search-result-content',
            summary  = '#search-result-summary',
            favorite = '#add-favorite-button',
            template = '/template/bookmark-item-set.html';

        return function(e) {
            e.preventDefault();

            if (bookmarkRenderer) {
                bookmarkRenderer.stop();
                bookmarkRenderer = null;
            }

            $(tab).click();

            if ((query = $(searchQuery).val()).length === 0) {
                return;
            }

            $(searchMsg).show();
            $(menu).hide();
            $(favorite).hide();

            tbm.main.sendRequest('/bookmark/search', { query: query }, function(response) {
                $(content).empty();
                $(summary).text('%s (%d)'.format(query, response.data.length));

                if (response.data.length > 0) {
                    bookmarkRenderer = tbm.util.delayedArrayAccess({
                        array: response.data,
                        interval: 300,
                        step: 20,
                        together: true,
                        callback: function(bookmarks) {
                            smodules.template(template, { bookmarks: bookmarks }).appendTo(content);
                        }
                    }).start();
                    tbm.main.checkFavoriteStatus(query);
                    $(favorite).show();

                    if (isManualSubmit) {
                        tbm.main.sendRequest('/user/query/add', { query: query });
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
                        $(searchQuery).val('[' + $(target).text() + ']');
                    }
                    $(searchForm).submit();
                });
            });
        });
    })([
        { id: '#recent-search-content',   className: 'query', tagged: true },
        { id: '#frequent-search-content', className: 'query', tagged: true },
        { id: '#found-folders-content',   className: 'name',  tagged: false },
        { id: '#found-tags-content',      className: 'name',  tagged: false },
        { id: '#favorite-query-content',  className: 'query', tagged: true }
    ]);

    // tab 'Folders & Tags'
    $('#tab-tags').click(function(e) {
        e.preventDefault();
        tbm.main.showBookmarkFolders();
        tbm.main.showBookmarkTags();
    });

    // tab 'Data'
    $('#tab-data').click(function(e) {
        e.preventDefault();
        tbm.main.showRecentSearchItems();
        tbm.main.showFrequentSearchItems();
        //tbm.main.showRecentBookmarkItems();
    });

    // tab 'Favorites'
    $('#tab-fav').click(function(e) {
        e.preventDefault();
        tbm.main.showFavoriteQueries();
    });

    // restore last query
    if (tbm.setting.get('latest_query') === 'yes') {
        window.setTimeout(function() {
            tbm.main.sendRequest('/user/query/latest', {}, function(response) {
                $(searchQuery).val(response.data);
                $(searchForm).submit();
            });
        }, 600);
    }

    // add favorite button
    (function() {
        var id = 'add-favorite-button';

        $('body').click(function(e) {
            smodules.ui.hasId(e, id, function(target) {
                tbm.main.toggleFavoriteStatus(query);
            });
        }).mouseover(function(e) {
            smodules.ui.hasId(e, id, function(target) {
                $(target).addClass('mouse');
            });
        }).mouseout(function(e) {
            smodules.ui.hasId(e, id, function(target) {
                $(target).removeClass('mouse');
            });
        });
    })();

    // remove favorite button
    (function() {
        var className = 'favorite-remove-button';

        $('body').click(function(e) {
            smodules.ui.hasClass(e, className, function(target) {
                tbm.main.sendRequest('/user/query/favorite/remove', { query: $(target).prev().text() });
                $(target).parent().remove();
                tbm.main.showFavoriteQueries();
                tbm.main.checkFavoriteStatus(query);
            });
        }).mouseover(function(e) {
            smodules.ui.hasClass(e, className, function(target) {
                $(target).addClass('mouse');
            });
        }).mouseout(function(e) {
            smodules.ui.hasClass(e, className, function(target) {
                $(target).removeClass('mouse');
            });
        });
    })();

    // edit bookmark title
    (function() {
        var button    = 'edit-button',
            menu      = 'bookmark-edit',
            editTitle = 'bookmark-edit-title';

        $('body').click(function(e) {
            smodules.ui.hasClass(e, button, function(target) {
                var editBound = $(target).parent(),
                    form      = editBound.prev();

                editBound.hide();
                form.show().find('input:first').val(editBound.find('a:first').text()).focus();
            });
        }).focusout(function(e) {
            smodules.ui.hasClass(e, editTitle, function(target) {
                $(target).parent().hide();
                $(target).parent().next().show();
            });
        }).submit(function(e) {
            smodules.ui.hasClass(e, menu, function(target) {
                var bookmark = {
                    id:    $(target).parent().attr('id').replace('bookmark-', ''),
                    title: $(target).find('input:first').val()
                };

                tbm.main.sendRequest('/bookmark/item/update', { bookmark: bookmark }, function(response) {
                    $(target).hide().next().show().find('a:first').text(response.data.title);
                });

                e.preventDefault();
            });
        }).mouseover(function(e) {
            smodules.ui.hasClass(e, button, function(target) {
                $(target).addClass('mouse');
            });
        }).mouseout(function(e) {
            smodules.ui.hasClass(e, button, function(target) {
                $(target).removeClass('mouse');
            });
        });
    })();
});
