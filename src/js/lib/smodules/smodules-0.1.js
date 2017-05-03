/*!
 * smodules.js v0.1
 *
 * Copyright (c) 2012 smori <smori1983@gmail.com>
 * Dual licensed under the MIT or GPL-2.0 licenses.
 *
 * Date 2012-06-15 03:42:37
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

smodules.templateParser = (function() {
    var that = {},
        src,
        text,
        ptr,
        ch,
        len,
        line,
        at;

    var exception = function(message) {
        throw new Error("smodules.templateParser - " + message + " in source " + src + " [" + line + "," + at + "]");
    };

    var next = (function(expr, replace) {
        var position = function(expr) {
            while (expr.length > 0) {
                if (expr.slice(0, 1) === "\n") {
                    line++;
                    at = 1;
                } else {
                    at++;
                }
                expr = expr.slice(1);
            }
        };

        return function(expr, replace) {
            expr = expr || ch;

            if (text.indexOf(expr, ptr) !== ptr) {
                exception("syntax error");
            }

            position(expr);

            ptr += expr.length;
            ch = text.charAt(ptr);

            return replace || expr;
        };
    })();

    var skipWhitespace = function() {
        var s = "";

        while (/\s/.test(ch)) {
            s += next(ch);
        }

        return s;
    };

    var read = function(expr) {
        return text.indexOf(expr, ptr) === ptr;
    };

    var readRegex = function(regex) {
        return regex.test(text.slice(ptr));
    };

    var readLeftTag = function() {
        return readRegex(/^\{\s*left\s*\}/);
    };

    var eatLeftTag = function() {
        next("{");
        skipWhitespace();
        next("left");
        skipWhitespace();
        next("}");

        return "{";
    };

    var readRightTag = function() {
        return readRegex(/^\{\s*right\s*\}/);
    };

    var eatRightTag = function() {
        next("{");
        skipWhitespace();
        next("right");
        skipWhitespace();
        next("}");

        return "}";
    };

    var readLiteralTag = function() {
        return readRegex(/^\{\s*literal\s*\}/);
    };

    var eatLiteralTag = function() {
        next("{");
        skipWhitespace();
        next("literal");
        skipWhitespace();
        next("}");

        return "{literal}";
    };

    var readEndLiteralTag = function() {
        return readRegex(/^\{\s*\/\s*literal\s*\}/);
    };

    var eatEndLiteralTag = function() {
        next("{");
        skipWhitespace();
        next("/");
        skipWhitespace();
        next("literal");
        skipWhitespace();
        next("}");

        return "{/literal}";
    };

    var readIfTag = function() {
        return readRegex(/^\{\s*if\s/);
    };

    var eatIfTag = function() {
        next("{");
        skipWhitespace();
        next("if");
        skipWhitespace();

        return "{if ";
    };

    var readElseifTag = function() {
        return readRegex(/^\{\s*elseif\s/);
    };

    var eatElseifTag = function() {
        next("{");
        skipWhitespace();
        next("elseif");
        skipWhitespace();

        return "{elseif ";
    };

    var readElseTag = function() {
        return readRegex(/^\{\s*else\s*\}/);
    };

    var eatElseTag = function() {
        next("{");
        skipWhitespace();
        next("else");
        skipWhitespace();
        next("}");

        return "{else}";
    };

    // NOTE: currently not used.
    var readEndIfTag = function() {
        return readRegex(/^\{\s*\/\s*if\s*\}/);
    };

    var eatEndIfTag = function() {
        next("{");
        skipWhitespace();
        next("/");
        skipWhitespace();
        next("if");
        skipWhitespace();
        next("}");

        return "{/if}";
    };

    var readForTag = function() {
        return readRegex(/^\{\s*for\s/);
    };

    var eatForTag = function() {
        next("{");
        skipWhitespace();
        next("for");
        skipWhitespace();

        return "{for ";
    };

    var readEndForTag = function() {
        return readRegex(/^\{\s*\/\s*for\s*\}/);
    };

    var eatEndForTag = function() {
        next("{");
        skipWhitespace();
        next("/");
        skipWhitespace();
        next("for");
        skipWhitespace();
        next("}");

        return "{/for}";
    };

    var readHolderTag = function() {
        return readRegex(/^\{\s*\$/);
    };

    // NOTE: currently not used.
    var readTmpVar = function() {
        return readRegex(/^\$\w+[^\w]/);
    };

    var eatTmpVar = function() {
        var s = next("$");

        while (/\w/.test(ch)) {
            s += next(ch);
        }

        if (s === "$") {
            exception("tmp variable not found");
        }

        return s.slice(1);
    };

    var readVar = function() {
        return readRegex(/^\$\w+(?:\.\w+)*(?:[^\w]|$)/);
    };

    var parseVar = function() {
        var s = next("$");

        while (/[\w\.]/.test(ch)) {
            s += next(ch);
        }

        if (s === "$") {
            exception("variable not found");
        } else if (/^\$\.|\.$|\.\./.test(s)) {
            exception("invalid variable expression");
        }

        return {
            type: "var",
            expr: s,
            keys: s.slice(1).split(".")
        };
    };

    var readNull = function() {
        return readRegex(/^null[^\w]/);
    };

    var parseNull = function() {
        return {
            type:  "value",
            expr:  next("null"),
            value: null
        };
    };

    var readTrue = function() {
        return readRegex(/^true[^\w]/);
    };

    var parseTrue = function() {
        return {
            type:  "value",
            expr:  next("true"),
            value: true
        };
    };

    var readFalse = function() {
        return readRegex(/^false[^\w]/);
    };

    var parseFalse = function() {
        return {
            type:  "value",
            expr:  next("false"),
            value: false
        };
    };

    var readString = function() {
        return ch === "'" || ch === '"';
    };

    var parseString = function() {
        var matched;

        if ((matched = text.slice(ptr).match(/^(["'])(?:\\\1|\s|\S)*?\1/))) {
            next(matched[0]);

            return {
                type:  "value",
                expr:  matched[0],
                value: matched[0].slice(1, -1).replace("\\" + matched[1], matched[1])
            };
        } else {
            exception("string expression not closed");
        }
    };

    var readNumber = function() {
        return ch === "+" || ch === "-" || (ch >= "0" && ch <= "9");
    };

    var parseNumber = function() {
        var value, matched = text.slice(ptr).match(/^[\+\-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][\+\-]?\d+)?/);

        if (matched && !isNaN(value = +(matched[0]))) {
            next(matched[0]);

            return {
                type:  "value",
                expr:  matched[0],
                value: value
            };
        } else {
            exception("invalid number expression");
        }
    };

    var readValue = function() {
        return readNull() || readTrue() || readFalse() || readString() || readNumber();
    };

    var parseValue = function() {
        if (readNull()) {
            return parseNull();
        } else if (readTrue()) {
            return parseTrue();
        } else if (readFalse()) {
            return parseFalse();
        } else if (readString()) {
            return parseString();
        } else if (readNumber()) {
            return parseNumber();
        } else {
            exception("value shoud be written");
        }
    };

    var readAndOr = function() {
        return readRegex(/^(and|or)[^\w]/);
    };

    var parseAndOr = function() {
        var expr;

        if (read("and")) {
            expr = next("and");
        } else if (read("or")) {
            expr = next("or");
        } else {
            exception("'and' or 'or' should be written");
        }

        return {
            type: "andor",
            expr: expr
        };
    };

    var compRegex = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;

    var readComp = function() {
        return readRegex(compRegex);
    };

    var parseComp = function() {
        var matched;

        if ((matched = text.slice(ptr).match(compRegex))) {
            expr = next(matched[0]);
        } else {
            exception("comparer should be written");
        }

        return {
            type: "comp",
            expr: expr
        };
    };

    var readRoundBracket = function() {
        return ch === "(";
    };

    var parseRoundBracket = function() {
        return {
            type: "roundBracket",
            expr: next("(")
        };
    };

    var readEndRoundBracket = function() {
        return ch === ")";
    };

    var parseEndRoundBracket = function() {
        return {
            type: "endRoundBracket",
            expr: next(")")
        };
    };

    var parseCondition = (function() {
        var getReversePolish = (function() {
            var state = {
                "start":           ["roundBracket",                    "value", "var",                  "error"],
                "roundBracket":    ["roundBracket",                    "value", "var",                  "error"],
                "endRoundBracket": [                "endRoundBracket",                         "andor", "error"],
                "value":           [                "endRoundBracket",                 "comp", "andor", "error"],
                "var":             [                "endRoundBracket",                 "comp", "andor", "error"],
                "comp":            [                                   "value", "var",                  "error"],
                "andor":           ["roundBracket",                    "value", "var",                  "error"]
            };

            var method = {
                "roundBracket":    { read: readRoundBracket,    parse: parseRoundBracket },
                "endRoundBracket": { read: readEndRoundBracket, parse: parseEndRoundBracket },
                "value":           { read: readValue,           parse: parseValue },
                "var":             { read: readVar,             parse: parseVar },
                "comp":            { read: readComp,            parse: parseComp },
                "andor":           { read: readAndOr,           parse: parseAndOr }
            };

            var history = (function() {
                var stack;

                return {
                    init: function() {
                        stack = ["start"];
                    },
                    add: function(type) {
                        stack.push(type);
                    },
                    get: function(idx) {
                        return stack[stack.length - idx] || null;
                    }
                };
            })();

            var sectionTypeStat = (function() {
                var roundBracketBalance, operandOperatorBalance;

                return {
                    init: function() {
                        roundBracketBalance    = 0;
                        operandOperatorBalance = 0;
                    },
                    add: function(type) {
                        if (type === "var" || type === "value") {
                            operandOperatorBalance++;
                        } else if (type === "comp" || type === "andor") {
                            operandOperatorBalance--;
                        } else if (type === "roundBracket") {
                            roundBracketBalance++;
                        } else if (type === "endRoundBracket") {
                            roundBracketBalance--;
                        }

                        if (roundBracketBalance < 0) {
                            exception("can not use ')' here");
                        }
                    },
                    finish: function() {
                        if (roundBracketBalance !== 0) {
                            exception("invalid usage of round bracket");
                        }
                        if (operandOperatorBalance !== 1) {
                            exception("invalid usage of operand or operator");
                        }
                    }
                };
            })();

            var getOrder = (function() {
                var orders = {
                    "endRoundBracket": 1,
                    "or":              2,
                    "and":             3,
                    "comp":            4,
                    "value":           5,
                    "var":             5,
                    "roundBracket":    6
                };

                return function(section) {
                    return orders[section.type] || orders[section.expr];
                };
            })();

            var parse = function() {
                var list = state[history.get(1)], i = 0, size = list.length, type, result;

                for ( ; i < size; i++) {
                    type = list[i];

                    if (type === "error") {
                        exception("invalid condition expression");
                    } else if (method[type].read()) {
                        if (type === "comp" && history.get(2) === "comp") {
                            exception("can not write comparer here");
                        }
                        result = method[type].parse();
                        break;
                    }
                }
                history.add(result.type);
                sectionTypeStat.add(result.type);

                return result;
            };

            return function() {
                var section, polish = [], stack = [], stackTop;

                history.init();
                sectionTypeStat.init();
                while (ptr < len) {
                    if (ch === "}") {
                        break;
                    } else {
                        section = parse();
                        section.order = getOrder(section);
                    }

                    while (stack.length > 0) {
                        stackTop = stack.pop();

                        if (section.order <= stackTop.order && stackTop.type !== "roundBracket") {
                            polish.push(stackTop);
                        } else {
                            stack.push(stackTop);
                            break;
                        }
                    }

                    if (section.type === "endRoundBracket") {
                        stack.pop();
                    } else {
                        stack.push(section);
                    }

                    skipWhitespace();
                }

                while (stack.length > 0) {
                    polish.push(stack.pop());
                }
                sectionTypeStat.finish();

                return polish;
            };
        })(); // getReversePolish()

        return function() {
            var type, stack = null;

            if (readIfTag()) {
                eatIfTag();
                type = "if";
            } else if (readElseifTag()) {
                eatElseifTag();
                type = "elseif";
            } else if (readElseTag()) {
                eatElseTag();
                type = "else";
            } else {
                exception("unknown condition expression");
            }

            if (type === "if" || type === "elseif") {
                stack = getReversePolish();
                next("}");
            }

            return {
                type:  type,
                stack: stack
            };
        };
    })(); // parseCondition()

    var parseNormalBlock = function() {
        var s = "";

        while (ptr < len) {
            if (ch === "{") {
                if (readLeftTag()) {
                    s += eatLeftTag();
                } else if (readRightTag()) {
                    s += eatRightTag();
                } else {
                    break;
                }
            } else {
                s += next(ch);
            }
        }

        return {
            type: "normal",
            expr: s
        };
    };

    var parseLiteralBlock = function() {
        var s = "", closed = false, startLine = line, startAt = at;

        eatLiteralTag();

        while (ptr < len) {
            if (ch === "{") {
                if (readLeftTag()) {
                    s += eatLeftTag();
                } else if (readRightTag()) {
                    s += eatRightTag();
                } else if (readEndLiteralTag()) {
                    eatEndLiteralTag();
                    closed = true;
                    break;
                } else {
                    s += next(ch);
                }
            } else {
                s += next(ch);
            }
        }

        if (!closed) {
            exception("literal block starts at [" + startLine + ", " + startAt + "] not closed by {/literal}");
        }

        return {
            type: "literal",
            expr: s
        };
    };

    var parseHolderBlock = (function() {
        var getFilterSection = (function() {
            var getFilterNameSection = function() {
                var s = "";

                skipWhitespace();

                while (/[\w\-]/.test(ch)) {
                    s += next(ch);
                }

                if (s === "") {
                    exception("filter name not found");
                }

                return {
                    expr: s,
                    name: s
                };
            };

            var getFilterArgsSection = function() {
                var s = "", args = [], arg;

                skipWhitespace();

                if (ch === ":") {
                    s += next(":");

                    while (ptr < len) {
                        skipWhitespace();

                        if (ch === "n") {
                            arg = parseNull();
                        } else if (ch === "t") {
                            arg = parseTrue();
                        } else if (ch === "f") {
                            arg = parseFalse();
                        } else if (ch === "'" || ch === '"') {
                            arg = parseString();
                        } else if (ch === "-" || ch === "+" || (ch >= "0" && ch <= "9")) {
                            arg = parseNumber();
                        } else {
                            exception("invalid filter args");
                        }

                        s += arg.expr;
                        args.push(arg.value);

                        skipWhitespace();

                        if (ch === ",") {
                            s += next(",");
                        } else if (ch === "|" || ch === "}") {
                            break;
                        }
                    }
                }

                return {
                    expr: s,
                    args: args
                };
            }; // getFilterArgsSection()

            var mainLoop = function() {
                var s = "", filters = [], filter, nameSection, argsSection;

                while (ptr < len) {
                    filter = {};

                    s += next("|");

                    nameSection = getFilterNameSection();
                    s += nameSection.expr;
                    filter.name = nameSection.name;

                    argsSection = getFilterArgsSection();
                    s += argsSection.expr;
                    filter.args = argsSection.args;

                    filters.push(filter);

                    if (ch === "}") {
                        break;
                    } else if (ch !== "|") {
                        exception("syntax error");
                    }
                }

                return {
                    expr:    s,
                    filters: filters
                };
            };

            return function() {
                var s = "", filters = [], mainResult;

                skipWhitespace();

                if (ch === "|") {
                    mainResult = mainLoop();

                    s       = mainResult.expr;
                    filters = mainResult.filters;
                }

                return {
                    expr:    s,
                    filters: filters
                };
            };
        })(); // getFilterSection()

        return function() {
            var s = "", keySection, filterSection;

            s += next("{");

            skipWhitespace();

            keySection = parseVar();
            s += keySection.expr;

            filterSection = getFilterSection();
            s += filterSection.expr;

            s += next("}");

            return {
                type:    "holder",
                expr:    s,
                keys:    keySection.keys,
                filters: filterSection.filters
            };
        };
    })(); // parseHolderBlock()

    var parseForBlock = (function() {
        var parseHeader = function() {
            var s = eatForTag(), k, v, array;

            v = eatTmpVar();
            s += v;
            skipWhitespace();

            if (ch === ",") {
                k = v;
                s += next(",");

                skipWhitespace();
                v = eatTmpVar();
                s += v;
                skipWhitespace();
            }

            s += " ";
            if (!readRegex(/^in\s/)) {
                exception("invalid for expression");
            }
            s += next("in");
            skipWhitespace();

            array = parseVar();
            s += array.expr;
            skipWhitespace();

            s += next("}");

            return {
                expr:  s,
                k:     k,
                v:     v,
                array: array.keys
            };
        }; // parseHeader()

        return function() {
            var header = parseHeader(),
                blocks = loop([], true);

            eatEndForTag();

            return {
                type:   "for",
                header: header,
                blocks: blocks
            };
        };
    })(); // parseForBlock()

    var parseIfBlock = function() {
        var sections = [];

        while (readIfTag() || readElseifTag() || readElseTag()) {
            sections.push({
                header: parseCondition(),
                blocks: loop([], true)
            });
        }
        eatEndIfTag();

        return {
            type:     "if",
            sections: sections
        };
    }; // parseIfBlock()

    var loop = function(result, inBlock) {
        while (ptr < len) {
            if (ch === "{") {
                if (inBlock && (readElseifTag() || readElseTag() || readEndIfTag() || readEndForTag())) {
                    break;
                } else if (readLiteralTag()) {
                    result.push(parseLiteralBlock());
                } else if (readIfTag()) {
                    result.push(parseIfBlock());
                } else if (readForTag()) {
                    result.push(parseForBlock());
                } else if (readHolderTag()) {
                    result.push(parseHolderBlock());
                } else {
                    result.push(parseNormalBlock());
                }
            } else {
                result.push(parseNormalBlock());
            }
        }

        return result;
    };


    that.parse = function(content, source) {
        var result = [];

        src  = source || "";
        text = content;
        ptr  = 0;
        ch   = content.charAt(0);
        len  = content.length;
        line = 1;
        at   = 1;

        return loop([]);
    };

    return that;
})();

/**
 * smodules.util.console
 *
 * on()
 * off()
 * log(message)
 * time(tag)
 * timeEnd(tag)
 */
smodules.util.console = (function() {
    var that = {},
        on   = false;

    that.on = function() {
        on = true;
        return that;
    };

    that.off = function() {
        on = false;
        return that;
    };

    that.log = function(message) {
        if (on) {
            console.log(message);
        }
        return that;
    };

    that.time = function(tag) {
        if (on) {
            console.time(tag);
        }
        return that;
    };

    that.timeEnd = function(tag) {
        if (on) {
            console.timeEnd(tag);
        }
        return that;
    };
    
    return that;
})();

smodules.template = (function() {
    var _filters = {};

    var _templates = {};

    var _isRemoteFile = function(templateSrc) {
        return (/\.html$/).test(templateSrc);
    };

    var _isEmbedded = function(templateSrc) {
        return templateSrc.indexOf("#") === 0;
    };

    var _register = function(templateSrc, content) {
        _templates[templateSrc] = smodules.templateParser.parse(content, templateSrc);
    };

    var _registerFromRemote = function(templateSrc, callback) {
        $.ajax({
            url: templateSrc,
            success: function(response) {
                _register(templateSrc, response);
                if (typeof callback === "function") {
                    callback();
                }
            }
        });
    };

    var _registerFromHTML = function(templateSrc, callback) {
        if ($(templateSrc)[0].tagName.toLowerCase() === "textarea") {
            _register(templateSrc, $(templateSrc).val());
        } else {
            _register(templateSrc, $(templateSrc).html());
        }
        if (typeof callback === "function") {
            callback();
        }
    };

    var _registerFromString = function(templateSrc, callback) {
        _register(templateSrc, templateSrc);
        if (typeof callback === "function") {
            callback();
        }
    };

    var _execute = function(templateSrc, bindParams, callback) {
        if (_templates.hasOwnProperty(templateSrc)) {
            _executeRecursive(templateSrc, bindParams, callback);
        } else if (_isRemoteFile(templateSrc)) {
            _registerFromRemote(templateSrc, function() {
                _executeRecursive(templateSrc, bindParams, callback);
            });
        } else if (_isEmbedded(templateSrc)) {
            _registerFromHTML(templateSrc, function() {
                _executeRecursive(templateSrc, bindParams, callback);
            });
        } else {
            _registerFromString(templateSrc, function() {
                _executeRecursive(templateSrc, bindParams, callback);
            });
        }
    };

    var _executeRecursive = function(templateSrc, bindParams, callback) {
        if (!$.isArray(bindParams)) {
            bindParams = [bindParams];
        }

        $.each(bindParams, function(idx, params) {
            callback(_bind(templateSrc, params));
        });
    };

    var _bind = (function() {
        var src;

        var exception = function(message) {
            throw new Error("smodules.template - " + message + " in source " + src);
        };

        var getValue = function(keys, params, asis) {
            var pIdx = params.length - 1, i, len = keys.length, value;

            for ( ; pIdx >= 0; pIdx--) {
                value = params[pIdx];
                for (i = 0; i < len; i++) {
                    if (typeof value[keys[i]] === "undefined") {
                        value = null;
                        break;
                    } else {
                        value = value[keys[i]];
                    }
                }
                if (i === len) {
                    break;
                }
            }

            if (asis) {
                return value;
            } else {
                return value === null ? "" : value.toString();
            }
        };

        var getFilter = function(name) {
            if (typeof _filters[name] === "function") {
                return _filters[name];
            } else {
                exception("filter '" + name + "' not found");
            }
        };

        var applyFilters = function(value, filters) {
            filters.forEach(function(filter) {
                value = getFilter(filter.name).apply(null, [value].concat(filter.args));
            });

            return value;
        };

        var loop = function(blocks, params) {
            return blocks.reduce(function(output, block) {
                if (block.type === "normal" || block.type === "literal") {
                    return output + block.expr;
                } else if (block.type === "holder") {
                    return output + applyFilters(getValue(block.keys, params), block.filters);
                } else if (block.type === "if") {
                    return output + loopIf(block, params);
                } else if (block.type === "for") {
                    return output + loopFor(block, params);
                } else {
                    return output;
                }
            }, "");
        };

        var evaluateComp = function(lval, rval, comp) {
            if (comp === "===") {
                return lval === rval;
            } else if (comp === "==") {
                return lval == rval;
            } else if (comp === "!==") {
                return lval !== rval;
            } else if (comp === "!=") {
                return lval != rval;
            } else if (comp === "lte") {
                return lval <= rval;
            } else if (comp === "lt") {
                return lval < rval;
            } else if (comp === "gte") {
                return lval >= rval;
            } else if (comp === "gt") {
                return lval > rval;
            } else {
                exception("invalid comparer");
            }
        };

        var evaluateAndOr = function(lval, rval, type) {
            if (type === "and") {
                return lval && rval;
            } else if (type === "or") {
                return lval || rval;
            } else {
                exception("unknown operator");
            }
        };

        var evaluate = function(conditions, params) {
            var result = [], i = 0, len = conditions.length, section, lval, rval;

            for ( ; i < len; i++) {
                section = conditions[i];

                if (section.type === "value") {
                    result.push(section.value || section.expr);
                } else if (section.type === "var") {
                    result.push(getValue(section.keys, params, true));
                } else if (section.type === "comp") {
                    rval = result.pop();
                    lval = result.pop();
                    result.push(evaluateComp(lval, rval, section.expr));
                } else if (section.type === "andor") {
                    rval = result.pop();
                    lval = result.pop();
                    result.push(evaluateAndOr(lval, rval, section.expr));
                }
            }

            if (result.length !== 1) {
                exception("invalid condition expression");
            }

            return result[0];
        };

        var loopIf = function(block, params) {
            var i = 0, len = block.sections.length, section, sectionResult, output = "";

            for ( ; i < len; i++) {
                section = block.sections[i];

                if (section.header.type === "if" || section.header.type === "elseif") {
                    if ((sectionResult = evaluate(section.header.stack, params))) {
                        output = loop(section.blocks, params);
                        break;
                    }
                } else {
                    output = loop(section.blocks, params);
                }
            }

            return output;
        };

        var loopFor = function(block, params) {
            var array = getValue(block.header.array, params, true), output = "", additional;

            if ($.isArray(array)) {
                array.forEach(function(value, idx) {
                    additional = {};

                    if (block.header.k) {
                        additional[block.header.k] = idx;
                    }
                    additional[block.header.v] = value;

                    params.push(additional);
                    output += loop(block.blocks, params);
                    params.pop();
                });
            }

            return output;
        };

        return function(templateSrc, bindParams) {
            src = templateSrc;

            return loop(_templates[templateSrc], [bindParams]);
        };
    })();


    // APIs.
    var that = function(templateFile, bindParams) {
        return {
            get: function(callback) {
                _execute(templateFile, bindParams, function(response) {
                    callback(response);
                });
            },
            appendTo: function(target) {
                _execute(templateFile, bindParams, function(response) {
                    $(response).appendTo(target);
                });
            },
            insertBefore: function(target) {
                _execute(templateFile, bindParams, function(response) {
                    $(response).insertBefore(target);
                });
            }
        };
    };

    that.addFilter = function(name, func) {
        _filters[name] = func;
        return that;
    };

    that.preFetch = function(templateSrc) {
        if (_isRemoteFile(templateSrc)) {
            _registerFromRemote(templateSrc);
        } else if (_isEmbedded(templateSrc)) {
            _registerFromHTML(templateSrc);
        } else {
            _registerFromString(templateSrc);
        }
        return that;
    };

    return that;
})();


// default filters
smodules.template.addFilter("h", (function() {
    var list = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return function(value) {
        return value.replace(/[<>&"']/g, function(matched) {
            return list[matched];
        });
    };
})());

smodules.template.addFilter("default", function(value, defaultValue) {
    return value.length === 0 ? defaultValue : value;
});

smodules.template.addFilter("upper", function(value) {
    return value.toLocaleUpperCase();
});

smodules.template.addFilter("lower", function(value) {
    return value.toLocaleLowerCase();
});

smodules.template.addFilter("plus", function(value, plus) {
    if (isFinite(value) && typeof plus === "number" && isFinite(plus)) {
        return (+(value) + plus).toString();
    } else {
        return value;
    }
});

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
