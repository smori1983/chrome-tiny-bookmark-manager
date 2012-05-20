/*!
 * smodules.js v0.1
 *
 * Copyright (c) 2012 smori <smori1983@gmail.com>
 * Dual licensed under the MIT or GPL-2.0 licenses.
 *
 * Date 2012-05-19 20:37:45
 */

var smodules = {};

smodules.ui = {};

smodules.util = {};

smodules.ui.hasId = function(event, id, callbackTrue, callbackFalse) {
    var target = event.target;

    if ($(target).attr("id") === id) {
        callbackTrue(target);
    } else if (typeof callbackFalse === "function") {
        callbackFalse(target);
    }
};

smodules.ui.hasClass = function(event, className, callbackTrue, callbackFalse) {
    var target = event.target;

    if ($(target).hasClass(className)) {
        callbackTrue(target);
    } else if (typeof callbackFalse === "function") {
        callbackFalse(target);
    }
};

smodules.ui.tab = (function() {
    var ok = function(event, callback) {
        var target = event.target;

        if (target.tagName === "A") {
            callback(target);
        }
    };

    var changeContent = function(spec, target) {
        $("#" + spec.id).find("a").each(function(idx, element) {
            if (element === target) {
                $(element).addClass(spec.selected);
                $($(element).attr("href")).show();
            } else {
                $(element).removeClass(spec.selected);
                $($(element).attr("href")).hide();
            }
        });
    };

    return function(spec) {
        if (typeof spec.id !== "string") {
            return;
        }

        spec = $.extend({
            mouseover: "mouse",
            selected:  "selected",
            initial:   0
        }, spec);

        $("#" + spec.id).
            click(function(e) {
                ok(e, function(target) {
                    changeContent(spec, target);
                    e.preventDefault();
                });
            }).
            mouseover(function(e) {
                ok(e, function(target) {
                    $(target).addClass(spec.mouseover);
                });
            }).
            mouseout(function(e) {
                ok(e, function(target) {
                    $(target).removeClass(spec.mouseover);
                });
            });

        $("#" + spec.id).find("a").eq(spec.initial).click();

        return smodules.ui;
    };
})();

smodules.util.debug = (function() {
    var isDebug = false;

    var that = function(message) {
        if (isDebug) {
            console.log(message);
        }
    };

    that.on = function() {
        isDebug = true;
    };

    that.off = function() {
        isDebug = false;
    };

    return that;
})();

smodules.template = (function() {
    var loadedTemplateFiles = {};

    var escapeHTML = (function() {
        var list = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return function(value) {
            return value.toString().replace(/[<>&"']g/, function(matched) {
                return list[matched];
            });
        };
    })();

    var regexQuote = function(str) {
        return str.replace(/[\*\+\?\.\-\[\]\{\}\\\/]/g, function(matched) {
            return "\\" + matched;
        });
    };

    var delimL = regexQuote("{{");
    var delimR = regexQuote("}}");

    var isRemoteFile = function(templateSrc) {
        return templateSrc.match(/\.html$/);
    };

    var execute = function(templateSrc, bindParams, callback) {
        if (loadedTemplateFiles.hasOwnProperty(templateSrc)) {
            executeRecursive(loadedTemplateFiles[templateSrc], bindParams, callback);
        } else {
            if (isRemoteFile(templateSrc)) {
                $.ajax({
                    url: templateSrc,
                    success: function(response) {
                        loadedTemplateFiles[templateSrc] = response;
                        executeRecursive(response, bindParams, callback);
                    }
                });
            } else {
                executeRecursive(templateSrc, bindParams, callback);
            }
        }
    };

    var executeRecursive = function(templateSrc, bindParams, callback) {
        if (!$.isArray(bindParams)) {
            bindParams = [bindParams];
        }

        $.each(bindParams, function(idx, params) {
            callback(bind(templateSrc, params));
        });
    };

    var bind = function(templateSrc, bindParams) {
        var ret = templateSrc;

        $.each(bindParams, function(key, value) {
            if (typeof value === "object") {
                ret = bindObject(ret, key, value);
            } else {
                ret = bindValue(ret, key, value);
            }
        });

        return ret;
    };

    var bindObject = function(templateSrc, key, value) {
        var ret = templateSrc;
        var regex = new RegExp(delimL + "\\s*(" + regexQuote(key) + "[^\\s" + delimR + "]*)\\s*" + delimR, "g");

        $.each(templateSrc.match(regex), function(idx, matched) {
            var regex = new RegExp("^" + delimL + "\\s*|\\s*" + delimR + "$", "g");
            var ob = matched.replace(regex, "").split(".").slice(1);
            var chain = value;

            while (ob.length > 0) {
                chain = chain[ob.shift()];
            }
            ret = ret.replace(matched, escapeHTML(chain));
        });

        return ret;
    };

    var bindValue = function(templateSrc, key, value) {
        var regex = new RegExp(delimL + "\\s*" + regexQuote(key) + "\\s*" + delimR, "g");

        return templateSrc.replace(regex, escapeHTML(value));
    };

    var that = function(templateFile, bindParams) {
        return {
/*
            display: function() {
                execute(templateFile, bindParams, function(response) {
                    document.write(response);
                });
            },
*/
            appendTo: function(target) {
                execute(templateFile, bindParams, function(response) {
                    $(response).appendTo(target);
                });
            },
            insertBefore: function(target) {
                execute(templateFile, bindParams, function(response) {
                    $(response).insertBefore(target);
                });
            }
        };
    };

    that.setDelimiter = function(left, right) {
        delimL = regexQuote(left);
        delimR = regexQuote(right);
    };

    return that;
})();

/**
 * smodules.storage
 *
 * get(key, defaultValue)
 * getJSON(key, defaultObject)
 * set(key, value)
 * setJSON(key, value)
 */
smodules.storage = (function() {
    var that = {};

    that.get = function(key, defaultValue) {
        var value = localStorage.getItem(key);

        if (typeof defaultValue === "undefined") {
            return value;
        } else {
            return value === null ? defaultValue : value;
        }
    };

    that.getJSON = function(key, defaultObject) {
        var value = localStorage.getItem(key);

        if (typeof defaultObject === "undefined") {
            return value === null ? {} : JSON.parse(value);
        } else {
            return value === null ? defaultObject : JSON.parse(value);
        }
    };

    that.set = function(key, value) {
        localStorage.setItem(key, value);
    };

    that.setJSON = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    return that;
})();
