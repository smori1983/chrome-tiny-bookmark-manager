$(function() {

    var details = chrome.app.getDetails(),
        locale  = window.navigator.language === "ja" ? "ja" : "en";

    locale = "ja";
    // i18n
    $.ajax({
        url: chrome.extension.getURL("/_locales/%s/messages.json".format(locale)),
        dataType: "json",
        success: function(response) {
            var target, matched, i18n = chrome.i18n.getMessage;

            $("#logo").text(i18n("meta_name"));
            $.each(response, function(key, value) {
                if ((matched = key.match(/^options_(tag|id|class)_([0-9a-zA-Z_]+)$/))) {
                    if (matched[1] === "tag") {
                        target = matched[2];
                    } else if (matched[1] === "id") {
                        target = "#" + matched[2].replace(/_/g, "-");
                    } else if (matched[1] === "class") {
                        target = "." + matched[2].replace(/_/g, "-");
                    }
                    //$(target).text(i18n(key));
                    $(target).html(tbm.util.tag(value.message.escapeHTML()));
                }
            });
        }
    });

    (function() {
        $("#latest_query-" + tbm.setting.get("latest_query")).click();
        $("#query_store_days").attr({ value: tbm.setting.get("query_store_days") });
    })();

    $("body").click(function(e) {
        var target = e.target,
            name   = $(target).attr("name"),
            value  = null;

        if (name === "latest_query") {
            value = $(target).attr("value");
        } else if (name === "query_store_days") {
            value = $(target).attr("value");
        }

        tbm.setting.set(name, value);
    });





});
