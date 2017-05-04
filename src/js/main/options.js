$(function() {

    var details = chrome.app.getDetails(),
        locale  = window.navigator.language === 'ja' ? 'ja' : 'en';

    tbm.util.i18n(locale, 'options');

    (function() {
        $('input[name=latest_query][value=%s]'.format(tbm.setting.get('latest_query'))).click();
        $('#query_store_days').attr({ value: tbm.setting.get('query_store_days') });
    })();

    $('body').click(function(e) {
        var target = e.target,
            name   = $(target).attr('name'),
            value  = null;

        if (name === 'latest_query') {
            value = $(target).attr('value');
        } else if (name === 'query_store_days') {
            value = $(target).attr('value');
        }

        if (value) {
            tbm.setting.set(name, value);
        }
    });
});
