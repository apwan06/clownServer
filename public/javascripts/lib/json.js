// 08 - JSON.js


var JSON;
JSON || (JSON = {}), function() {
    "use strict";
    function f(t) {
        return 10 > t ? "0" + t : t
    }
    function quote(t) {
        return escapable.lastIndex = 0, escapable.test(t) ? '"' + t.replace(escapable, function(t) {
            var e = meta[t];
            return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + t + '"'
    }
    function str(t, e) {
        var n, i, s, o, r, a = gap, l = e[t];
        switch (l && "object" == typeof l && "function" == typeof l.toJSON && (l = l.toJSON(t)), "function" == typeof rep && (l = rep.call(e, t, l)), typeof l) {
            case "string":
                return quote(l);
            case "number":
                return isFinite(l) ? String(l) : "null";
            case "boolean":
            case "null":
                return String(l);
            case "object":
                if (!l)
                    return "null";
                if (gap += indent, r = [], "[object Array]" === Object.prototype.toString.apply(l)) {
                    for (o = l.length, n = 0; o > n; n += 1)
                        r[n] = str(n, l) || "null";
                    return s = 0 === r.length ? "[]" : gap ? "[\n" + gap + r.join(",\n" + gap) + "\n" + a + "]" : "[" + r.join(",") + "]", gap = a, s
                }
                if (rep && "object" == typeof rep)
                    for (o = rep.length, n = 0; o > n; n += 1)
                        "string" == typeof rep[n] && (i = rep[n], s = str(i, l), s && r.push(quote(i) + (gap ? ": " : ":") + s));
                else
                    for (i in l)
                        Object.prototype.hasOwnProperty.call(l, i) && (s = str(i, l), s && r.push(quote(i) + (gap ? ": " : ":") + s));
                return s = 0 === r.length ? "{}" : gap ? "{\n" + gap + r.join(",\n" + gap) + "\n" + a + "}" : "{" + r.join(",") + "}", gap = a, s
        }
    }
    "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf()
    });
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b","	": "\\t","\n": "\\n","\f": "\\f","\r": "\\r",'"': '\\"',"\\": "\\\\"}, rep;
    "function" != typeof JSON.stringify && (JSON.stringify = function(t, e, n) {
        var i;
        if (gap = "", indent = "", "number" == typeof n)
            for (i = 0; n > i; i += 1)
                indent += " ";
        else
            "string" == typeof n && (indent = n);
        if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length))
            throw new Error("JSON.stringify");
        return str("", {"": t})
    }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
        function walk(t, e) {
            var n, i, s = t[e];
            if (s && "object" == typeof s)
                for (n in s)
                    Object.prototype.hasOwnProperty.call(s, n) && (i = walk(s, n), void 0 !== i ? s[n] = i : delete s[n]);
            return reviver.call(t, e, s)
        }
        var j;
        if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(t) {
                return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j;
        throw new SyntaxError("JSON.parse")
    })
}();
