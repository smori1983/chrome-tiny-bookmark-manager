/*
var usePopup = function() {
    chrome.browserAction.setPopup({
        popup: "html/popup.html"
    });
};

var useTab = function() {
    chrome.browserAction.onClicked.addListener(function() {
        var path = chrome.extension.getURL("html/tab.html");

        // @param Tab tab holds the information about active tab.
        return function(tab) {
            chrome.tabs.query({
                windowId: chrome.windows.WINDOW_ID_CURRENT
            }, function(tabs) {
                var i   = 0,
                    len = tabs.length,
                    idx = null;

                for ( ; i < len; i++) {
                    if (tabs[i].url === path) {
                        idx = i;
                        break;
                    }
                }

                if (idx === null) {
                    chrome.tabs.create({
                        url: path
                    });
                } else {
                    chrome.tabs.highlight({
                        windowId: chrome.windows.WINDOW_ID_CURRENT,
                        tabs: [idx]
                    }, function(win) {});
                }
            });
        };
    }());
};

usePopup();
*/
