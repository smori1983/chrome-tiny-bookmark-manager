$(function() {
  var searchForm  = '#search-form';
  var searchQuery = '#search-query';
  var searchMsg   = '#search-msg';

  var details = chrome.app.getDetails();
  var locale  = window.navigator.language === 'ja' ? 'ja' : 'en';

  var query = '';
  var bookmarkRenderer = null;

  var isManualSubmit = true;

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
    var tab      = '#tab-main';
    var menu     = '#search-result';
    var content  = '#search-result-content';
    var summary  = '#search-result-summary';
    var favorite = '#add-favorite-button';
    var template = '/template/bookmark-item-set.html';

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
        $(summary).text('%s (%d)'.format(query, response.body.data.length));

        if (response.body.data.length > 0) {
          bookmarkRenderer = tbm.util.delayedArrayAccess({
            array: response.body.data,
            interval: 300,
            step: 20,
            together: true,
            callback: function(bookmarks) {
              smodules.template(template, { bookmarks: bookmarks }).appendTo(content);
            },
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
    { id: '#favorite-query-content',  className: 'query', tagged: true },
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
        if (response.status === 'ok') {
          $(searchQuery).val(response.body.data);
          $(searchForm).submit();
        }
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
        tbm.main.sendRequest('/user/query/favorite/remove', { query: $(target).prev().text() }, function() {
          $(target).parent().remove();
          tbm.main.showFavoriteQueries();
          tbm.main.checkFavoriteStatus(query);
        });
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
    var button    = 'edit-button';
    var menu      = 'bookmark-edit';
    var editTitle = 'bookmark-edit-title';

    $('body').click(function(e) {
      smodules.ui.hasClass(e, button, function(target) {
        var editBound = $(target).parent();
        var form      = editBound.prev();

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
        var id = $(target).parent().attr('id').replace('bookmark-', '');
        var title = $(target).find('input:first').val();

        tbm.main.sendRequest('/bookmark/item/update', {
          id: id,
          title: title,
        }, function(response) {
          $(target).hide().next().show().find('a:first').text(response.body.bookmark.title);
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
