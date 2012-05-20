/*!
 * prototype-extensions.js v0.1
 *
 * Copyright (c) 2012 smori <smori1983@gmail.com>
 * Dual licensed under the MIT or GPL-2.0 licenses.
 *
 * Includes php.js
 * http://phpjs.org/
 * Copyright (c) 2011 Kevin van Zonneveld
 * Dual licensed under the MIT or GPL-2.0 licenses.
 */

/* basics-function.js */

Function.prototype.method = function(name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};

/* basics-string.js */

String.method("compare", function(value) {
    var self = this.toString();

    if (typeof value === "number") {
        value = value.toString();
    }

    if (typeof value === "string") {
        if (self === value) {
            return 0;
        } else {
            return self < value ? -1 : 1;
        }
    } else {
        return 0;
    }
});

String.method("escapeBase64", function() {
    var list = {
        "+": "%28",
        "/": "%2F",
        "=": "%3D"
    };

    return function() {
        return this.replace(/[\+\/=]/g, function(matched) {
            return list[matched];
        });
    };
}());

String.method("escapeHTML", function() {
    var list = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return function() {
        return this.replace(/[<>&"']/g, function(matched) {
            return list[matched];
        });
    };
}());

String.method("format", function() {
    var s = function(arg, format) {
        var ret, len;

        if (typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") {
            if (format.length > 2) {
                len = parseInt(format.slice(1, -1), 10);
                if (arg.length < len) {
                    arg = " ".repeat(len - arg.length) + arg;
                }
            }
            ret = arg;
        } else {
            ret = "";
        }

        return ret;
    };

    var d = function(arg, format) {
        var ret, fill, len;

        if (typeof arg === "number" || (typeof arg === "string" && arg.match(/^\d/))) {
            ret = parseInt(arg, 10).toString();
            if (format.length > 2) {
                fill = format.slice(1, 2) === "0" ? "0" : " ";
                len  = parseInt(format.slice(1, -1), 10);
                if (ret.length < len) {
                    ret = fill.repeat(len - ret.length) + ret;
                }
            }
        } else {
            ret = "";
        }

        return ret;
    };

    return function() {
        var i, next, ret = "",
            args = Array.prototype.slice.apply(arguments),
            regex = /%%|%\d*s|%\d*d/g,
            leaves = this.split(regex),
            escapes = this.match(regex);

        for (i = 0; i < leaves.length; i++) {
            ret += leaves[i];
            if (i < leaves.length - 1) {
                if (escapes[i] === "%%") {
                    ret += "%";
                } else if (escapes[i].slice(-1) === "s") {
                    ret += s(args.shift(), escapes[i]);
                } else if (escapes[i].slice(-1) === "d") {
                    ret += d(args.shift(), escapes[i]);
                }
            }
        }

        return ret;
    };
}());

String.method("isNumeric", function() {
    return this.match(/^[\+\-]?\d+(?:\.\d+)?/) !== null;
});

String.method("lowerFirst", function() {
    return this.slice(0, 1).toLocaleLowerCase() + this.slice(1);
});

String.method("pad", function(len, word) {
    var ret = this;

    if (typeof len === "number" && len > 0 && typeof word === "string" && word.length > 0) {
        ret = ret.padLeft(ret.length + Math.floor((len - ret.length) / 2), word);
        ret = ret.padRight(len, word);
    }

    return ret;
});

String.method("padLeft", function(len, word) {
    var pad, ret = this;

    if (typeof len === "number" && len > 0 && typeof word === "string" && word.length > 0) {
        pad = word.repeat(Math.ceil(len - this.length) / word.length).slice(0, len - this.length);
        ret = pad + this;
    }

    return ret;
});

String.method("padRight", function(len, word) {
    var pad, ret = this;

    if (typeof len === "number" && len > 0 && typeof word === "string" && word.length > 0) {
        pad = word.repeat(Math.ceil(len - this.length) / word.length).slice(0, len - this.length);
        ret = this + pad;
    }

    return ret;
});

String.method("regexQuote", function() {
    return this.replace(/[\^\$\.\?\*\+\-\\\/\:\=\!\,\(\)\[\]\{\}]/g, function(matched) {
        return "\\" + matched;
    });
});

String.method("repeat", function(count) {
    var i, ret = "";

    if (typeof count === "number") {
        for (i = 0; i < count; i++) {
            ret += this;
        }
    }

    return ret;
});

String.method("reverse", function() {
    return this.split("").reverse().join("");
});

// JavaScript 1.8.1
String.method("trim", function() {
    return this.replace(/^\s+|\s+$/g, "");
});

// JavaScript 1.8.1
String.method("trimLeft", function() {
    return this.replace(/^\s+/, "");
});

// JavaScript 1.8.1
String.method("trimRight", function() {
    return this.replace(/\s+$/, "");
});

String.method("unescapeHTML", function() {
    var list = {
        "&lt;":   "<",
        "&gt;":   ">",
        "&amp;":  "&",
        "&quot;": '"',
        "&#039;": "'"
    };

    return function() {
        return this.replace(/&lt;|&gt;|&amp;|&quot;|&#039;/g, function(matched) {
            return list[matched];
        });
    };
}());

String.method("upperFirst", function() {
    return this.slice(0, 1).toLocaleUpperCase() + this.slice(1);
});

String.method("upperWords", function() {
    return this.replace(/\S+/g, function(matched) {
        return matched.upperFirst();
    });
});

/* basics-date.js */

Date.method("add", function(spec) {
    var ms = Date.parse(this.toUTCString());

    if (spec.hasOwnProperty("day")) {
        ms += spec.day * 86400000;
    }
    if (spec.hasOwnProperty("hour")) {
        ms += spec.hour * 3600000;
    }
    if (spec.hasOwnProperty("minute")) {
        ms += spec.minute * 60000;
    }
    if (spec.hasOwnProperty("second")) {
        ms += spec.second * 1000;
    }

    return new Date(ms);
});

Date.method("format", function(format) {
    var ret = format;

    ret = ret.replace(/([^%]?)%Y/g, "$1" + this.getFullYear().toString());
    ret = ret.replace(/([^%]?)%y/g, "$1" + this.getFullYear().toString().slice(-2));
    ret = ret.replace(/([^%]?)%m/g, "$1" + ("0" + (this.getMonth() + 1)).slice(-2));
    ret = ret.replace(/([^%]?)%d/g, "$1" + ("0" + this.getDate()).slice(-2));
    ret = ret.replace(/([^%]?)%H/g, "$1" + ("0" + this.getHours()).slice(-2));
    ret = ret.replace(/([^%]?)%i/g, "$1" + ("0" + this.getMinutes()).slice(-2));
    ret = ret.replace(/([^%]?)%s/g, "$1" + ("0" + this.getSeconds()).slice(-2));

    return ret;
});

/* phpjs-string.js */

String.method("base64Decode", function() {
    var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    return function() {
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, tmp = [];

        do {
            h1 = table.indexOf(this.charAt(i++));
            h2 = table.indexOf(this.charAt(i++));
            h3 = table.indexOf(this.charAt(i++));
            h4 = table.indexOf(this.charAt(i++));

            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

            o1 = bits >> 16 & 0xff;
            o2 = bits >>  8 & 0xff;
            o3 = bits       & 0xff;

            if (h3 === 64) {
                tmp.push(String.fromCharCode(o1));
            } else if (h4 === 64) {
                tmp.push(String.fromCharCode(o1, o2));
            } else {
                tmp.push(String.fromCharCode(o1, o2, o3));
            }
        } while (i < this.length);

        return tmp.join('').utf8Decode();
    };
}());

String.method("base64Encode", function() {
    var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    return function() {
        var o1, o2, o3, h1, h2, h3, h4, bits,
            encoded = "",
            tmp = [],
            i = 0,
            data = this.utf8Encode();

        do {
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >>  6 & 0x3f;
            h4 = bits       & 0x3f;

            tmp.push(table.charAt(h1) + table.charAt(h2) + table.charAt(h3) + table.charAt(h4));
        } while (i < data.length);

        encoded = tmp.join('');

        var r = data.length % 3;

        return (r ? encoded.slice(0, r - 3) : encoded) + "===".slice(r || 3);
    };
}());

String.method("utf8Decode", function() {
    var tmp = [], i = 0, c1, c2, c3;

    while (i < this.length) {
        c1 = this.charCodeAt(i);

        if (c1 < 128) {
            tmp.push(String.fromCharCode(c1));
            i += 1;
        } else if (c1 > 191 && c1 < 224) {
            c2 = this.charCodeAt(i + 1);
            tmp.push(String.fromCharCode(((c1 & 31) << 6) | (c2 & 63)));
            i += 2;
        } else {
            c2 = this.charCodeAt(i + 1);
            c3 = this.charCodeAt(i + 2);
            tmp.push(String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)));
            i += 3;
        }
    }

    return tmp.join('');
});

String.method("utf8Encode", function() {
    var encoded = "",
        start = 0,
        end = 0,
        len = this.length,
        i, c, enc;

    for (i = 0; i < len; i++) {
        c = this.charCodeAt(i);
        enc = null;

        if (c < 128) {
            end++;
        } else if (c >= 128 && c < 2048) {
            enc = String.fromCharCode((c >> 6) | 192) +
                  String.fromCharCode((c & 63) | 128);
        } else {
            enc = String.fromCharCode((c >> 12) | 224) +
                  String.fromCharCode(((c >> 6) & 63) | 128) +
                  String.fromCharCode((c & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                encoded += this.slice(start, end);
            }
            encoded += enc;
            start = end = i + 1;
        }
    }

    if (end > start) {
        encoded += this.slice(start, len);
    }

    return encoded;
});
