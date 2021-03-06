"undefined" == typeof layui && "undefined" == typeof jQuery && console.error("非layui调用请先加载jQuery"), "undefined" != typeof jQuery && ($ = jQuery), LAY_EXCEL = {
    downloadExl: function (e, t, r) {
        r = r || "xlsx", this.exportExcel({sheet1: e}, t + "." + r, r, null)
    }, exportExcel: function (e, t, r, n) {
        r = r || "xlsx", t = t || "导出数据." + r;
        var a = XLSX.utils.book_new(), s = {
            Title: t,
            Subject: "Export From web browser",
            Author: "excel.wj2015.com",
            Manager: "",
            Company: "",
            Category: "",
            Keywords: "",
            Comments: "",
            LastAuthor: "",
            CreatedData: new Date
        };
        n && n.Props && (s = $.extend(s, n.Props)), a.compression = !n || n.compression, !1 !== a.compression && (a.compression = !0), a.Props = s;
        var i = {
            "!merges": null,
            "!margins": null,
            "!cols": null,
            "!rows": null,
            "!protect": null,
            "!autofilter": null
        };
        for (var o in n && n.extend && (i = $.extend(i, n.extend)), i) i.hasOwnProperty(o) && (i[o] || delete i[o]);
        for (var l in $.isArray(e) && (e = {sheet1: e}), e) if (e.hasOwnProperty(l)) {
            var c = e[l];
            a.SheetNames.push(l);
            var f = !1;
            if (c.length && c[0] && $.isArray(c[0]) && (f = !0), f) d = XLSX.utils.aoa_to_sheet(c); else {
                var h = {};
                if (c.length) {
                    h.headers = c.unshift(), h.skipHeader = !0;
                    var u = this.splitContent(c)
                }
                var d = XLSX.utils.json_to_sheet(c, h);
                i[l] ? $.extend(d, i[l]) : $.extend(d, i), void 0 !== u && this.mergeCellOpt(d, u.style)
            }
            a.Sheets[l] = d
        }
        var p = XLSX.write(a, {bookType: r, type: "binary", cellStyles: !0, compression: a.compression});
        saveAs(new Blob([this.s2ab(p)], {type: "application/octet-stream"}), t)
    }, splitContent: function (e) {
        for (var t = {}, r = 0; r < e.length; r++) {
            var n = e[r], a = 0;
            for (var s in n) if (n.hasOwnProperty(s)) {
                var i = n[s];
                "object" == typeof i ? null !== i ? t[this.numToTitle(a + 1) + (parseInt(r) + 1)] = i : n[s] = "" : (0 === i && (i = {
                    v: "0",
                    s: {alignment: {horizontal: "right"}}
                }), t[this.numToTitle(a + 1) + (parseInt(r) + 1)] = i), a++
            }
        }
        return {content: e, style: t}
    }, mergeCellOpt: function (e, t) {
        for (var r in t) if (t.hasOwnProperty(r)) {
            var n = t[r];
            if (e[r]) {
                for (var a = ["t", "w", "f", "r", "h", "c", "z", "l", "s"], s = 0; s < a.length; s++) e[r][a[s]] = e[r][a[s]];
                $.extend(e[r], n)
            }
        }
    }, tableToJson: function (e) {
        e = $(e);
        var t = [];
        e.find("thead > tr").each(function () {
            var e = [];
            $(this).find("td,th").each(function () {
                e.push($(this).text())
            }), t.push(e)
        });
        var r = [];
        return e.find("tbody > tr").each(function () {
            var e = [];
            $(this).find("td").each(function () {
                e.push($(this).text())
            }), r.push(e)
        }), {head: t, body: r}
    }, numsTitleCache: {}, titleNumsCache: {}, numToTitle: function (e) {
        if (this.numsTitleCache[e]) return this.numsTitleCache[e];
        var t = "";
        if (26 < e) {
            var r = e % 26;
            return t = this.numToTitle((e - r) / 26) + this.numToTitle(r || 26), this.numsTitleCache[e] = t, this.titleNumsCache[t] = e, t
        }
        return t = String.fromCharCode(64 + e), this.numsTitleCache[e] = t, this.titleNumsCache[t] = e, t
    }, titleToNum: function (e) {
        if (this.titleNumsCache[e]) return this.titleNumsCache[e];
        var t = e.length, r = 0;
        for (var n in e) {
            if (e.hasOwnProperty(n)) r += (e[n].charCodeAt() - 64) * Math.pow(26, t - n - 1)
        }
        return this.numsTitleCache[r] = e, this.titleNumsCache[e] = r
    }, setExportCellStyle: function (e, t, r, n) {
        if ("object" != typeof e || !e.length || !e[0] || !Object.keys(e[0]).length) return [];
        var a = Object.keys(e[0]), s = {c: 0, r: 0}, i = {c: e.length - 1, r: a.length - 1};
        if (t && "string" == typeof t) {
            var o = t.split(":");
            o[0].length && (s = this.splitPosition(o[0])), void 0 !== o[1] && "" !== o[1] && (i = this.splitPosition(o[1]))
        }
        s.c > i.c && console.error("开始列不得大于结束列"), s.r > i.r && console.error("开始行不得大于结束行");
        for (var l = s.r; l <= i.r; l++) for (var c = s.c; c <= i.c; c++) {
            var f = e[l];
            if (!f) {
                f = {};
                for (var h = 0; h < a.length; h++) f[a[h]] = "";
                e[l] = f
            }
            var u = f[a[c]], d = null;
            null == u && (u = ""), d = "object" == typeof u ? $.extend(!0, {}, u, r) : $.extend(!0, {}, {v: u}, r), "function" == typeof n && (d = n(u, d, f, r, l, c, a[c])), e[l][a[c]] = d
        }
        return e
    }, makeMergeConfig: function (e) {
        for (var t = [], r = 0; r < e.length; r++) t.push({
            s: this.splitPosition(e[r][0]),
            e: this.splitPosition(e[r][1])
        });
        return t
    }, makeColConfig: function (e, t) {
        t = 0 < t ? t : 50;
        var r = [], n = 0;
        for (var a in e) if (e.hasOwnProperty(a)) {
            var s = e[a];
            if (a.match && a.match(/[A-Z]*/)) {
                for (var i = this.titleToNum(a) - 1; n < i;) r.push({wpx: t}), n++;
                n = 1 + i, r.push({wpx: 0 < s ? s : t})
            }
        }
        return r
    }, makeRowConfig: function (e, t) {
        t = 0 < t ? t : 10;
        var r = [], n = 0;
        for (var a in e) if (e.hasOwnProperty(a)) {
            var s = e[a];
            if (a.match && a.match(/[0-9]*/)) {
                for (var i = parseInt(a) - 1; n < i;) r.push({hpx: t}), n++;
                n = 1 + i, r.push({hpx: 0 < s ? s : t})
            }
        }
        return r
    }, splitPosition: function (e) {
        var t = e.match("^([A-Z]+)([0-9]+)$");
        return t ? {c: this.titleToNum(t[1]) - 1, r: parseInt(t[2]) - 1} : {c: 0, r: 0}
    }, s2ab: function (e) {
        for (var t = new ArrayBuffer(e.length), r = new Uint8Array(t), n = 0; n < e.length; n++) r[n] = 255 & e.charCodeAt(n);
        return t
    }, filterDataToAoaData: function (e) {
        var a = [];
        return $.each(e, function (e, t) {
            var r = [];
            for (var n in t) t.hasOwnProperty(n) && r.push(t[n]);
            a.push(r)
        }), a
    }, filterExportData: function (e, t) {
        var r = [], n = [];
        if (Array.isArray(t)) for (var a = 0; a < t.length; a++) n[t[a]] = t[a]; else n = t;
        for (a = 0; a < e.length; a++) {
            var s = e[a];
            for (var i in r[a] = {}, n) if (n.hasOwnProperty(i)) {
                var o = i, l = n[i];
                "function" == typeof l && l.apply ? r[a][o] = l.apply(window, [o, s, e, a]) : void 0 !== s[l] ? r[a][o] = s[l] : r[a][o] = ""
            }
        }
        return r
    }, filterImportData: function (e, n) {
        var a = this;
        return $.each(e, function (e, r) {
            $.each(r, function (e, t) {
                r[e] = a.filterExportData(t, n)
            })
        }), e
    }, importExcel: function (s, e, i) {
        var o = {header: "A", range: null, fields: null};
        $.extend(o, e);
        var l = this;
        if (s.length < 1) throw{code: 999, message: "传入文件为空"};
        var r = ["application/vnd.ms-excel", "application/msexcel", "application/x-msexcel", "application/x-ms-excel", "application/x-excel", "application/x-dos_ms_excel", "application/xls", "application/x-xls", "application/vnd-xls", "application/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ""];
        $.each(s, function (e, t) {
            if (-1 === r.indexOf(t.type)) throw{code: 999, message: t.name + "（" + t.type + "）为不支持的文件类型"}
        });
        var c = {}, f = {};
        $.each(s, function (t, e) {
            var r = new FileReader;
            if (!r) throw{code: 999, message: "不支持FileReader，请更换更新的浏览器"};
            r.onload = function (e) {
                var n = XLSX.read(e.target.result, {type: "binary"}), a = {};
                $.each(n.Sheets, function (e, t) {
                    if (n.Sheets.hasOwnProperty(e)) {
                        var r = {header: o.header, defval: ""};
                        o.range && (r.range = o.range), a[e] = XLSX.utils.sheet_to_json(t, r), o.fields && (a[e] = l.filterExportData(a[e], o.fields))
                    }
                }), c[t] = a, f[t] = n, t === s.length - 1 && i && i.apply && i.apply(window, [c, f])
            }, r.readAsBinaryString(e)
        })
    }
}, "undefined" != typeof layui && layui.define(["jquery"], function (e) {
    $ = layui.jquery, e("excel", LAY_EXCEL)
}), function () {
    var u = "object" == typeof window ? window : "object" == typeof self ? self : this,
        n = u.BlobBuilder || u.WebKitBlobBuilder || u.MSBlobBuilder || u.MozBlobBuilder;
    u.URL = u.URL || u.webkitURL || function (e, t) {
        return (t = document.createElement("a")).href = e, t
    };
    var r = u.Blob, d = URL.createObjectURL, p = URL.revokeObjectURL, s = u.Symbol && u.Symbol.toStringTag, e = !1,
        t = !1, m = !!u.ArrayBuffer, a = n && n.prototype.append && n.prototype.getBlob;
    try {
        e = 2 === new Blob(["ä"]).size, t = 2 === new Blob([new Uint8Array([1, 2])]).size
    } catch (e) {
    }

    function i(e) {
        return e.map(function (e) {
            if (e.buffer instanceof ArrayBuffer) {
                var t = e.buffer;
                if (e.byteLength !== t.byteLength) {
                    var r = new Uint8Array(e.byteLength);
                    r.set(new Uint8Array(t, e.byteOffset, e.byteLength)), t = r.buffer
                }
                return t
            }
            return e
        })
    }

    function o(e, t) {
        t = t || {};
        var r = new n;
        return i(e).forEach(function (e) {
            r.append(e)
        }), t.type ? r.getBlob(t.type) : r.getBlob()
    }

    function l(e, t) {
        return new r(i(e), t || {})
    }

    function c() {
        var e = !!u.ActiveXObject || "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style,
            t = u.XMLHttpRequest && u.XMLHttpRequest.prototype.send;
        e && t && (XMLHttpRequest.prototype.send = function (e) {
            e instanceof Blob && this.setRequestHeader("Content-Type", e.type), t.call(this, e)
        });
        try {
            new File([], "")
        } catch (e) {
            try {
                var r = new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name;this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();
                u.File = r
            } catch (e) {
                r = function (e, t, r) {
                    var n = new Blob(e, r), a = r && void 0 !== r.lastModified ? new Date(r.lastModified) : new Date;
                    return n.name = t, n.lastModifiedDate = a, n.lastModified = +a, n.toString = function () {
                        return "[object File]"
                    }, s && (n[s] = "File"), n
                };
                u.File = r
            }
        }
    }

    u.Blob && (o.prototype = Blob.prototype, l.prototype = Blob.prototype), s && (File.prototype[s] = "File", Blob.prototype[s] = "Blob", FileReader.prototype[s] = "FileReader"), e ? (c(), u.Blob = t ? u.Blob : l) : a ? (c(), u.Blob = o) : function () {
        function i(e) {
            for (var t = [], r = 0; r < e.length; r++) {
                var n = e.charCodeAt(r);
                n < 128 ? t.push(n) : n < 2048 ? t.push(192 | n >> 6, 128 | 63 & n) : n < 55296 || 57344 <= n ? t.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | 63 & n) : (r++, n = 65536 + ((1023 & n) << 10 | 1023 & e.charCodeAt(r)), t.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | 63 & n))
            }
            return t
        }

        function t(e) {
            var t, r, n, a, s, i;
            for (t = "", n = e.length, r = 0; r < n;) switch ((a = e[r++]) >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    t += String.fromCharCode(a);
                    break;
                case 12:
                case 13:
                    s = e[r++], t += String.fromCharCode((31 & a) << 6 | 63 & s);
                    break;
                case 14:
                    s = e[r++], i = e[r++], t += String.fromCharCode((15 & a) << 12 | (63 & s) << 6 | (63 & i) << 0)
            }
            return t
        }

        function o(e) {
            for (var t = new Array(e.byteLength), r = new Uint8Array(e), n = t.length; n--;) t[n] = r[n];
            return t
        }

        function r(e) {
            for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", r = [], n = 0; n < e.length; n += 3) {
                var a = e[n], s = n + 1 < e.length, i = s ? e[n + 1] : 0, o = n + 2 < e.length, l = o ? e[n + 2] : 0,
                    c = a >> 2, f = (3 & a) << 4 | i >> 4, h = (15 & i) << 2 | l >> 6, u = 63 & l;
                o || (u = 64, s || (h = 64)), r.push(t[c], t[f], t[h], t[u])
            }
            return r.join("")
        }

        var e = Object.create || function (e) {
            function t() {
            }

            return t.prototype = e, new t
        };
        if (m) var n = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
            l = ArrayBuffer.isView || function (e) {
                return e && -1 < n.indexOf(Object.prototype.toString.call(e))
            };

        function c(e, t) {
            for (var r = 0, n = (e = e || []).length; r < n; r++) {
                var a = e[r];
                a instanceof c ? e[r] = a._buffer : "string" == typeof a ? e[r] = i(a) : m && (ArrayBuffer.prototype.isPrototypeOf(a) || l(a)) ? e[r] = o(a) : m && ((s = a) && DataView.prototype.isPrototypeOf(s)) ? e[r] = o(a.buffer) : e[r] = i(String(a))
            }
            var s;
            this._buffer = [].concat.apply([], e), this.size = this._buffer.length, this.type = t && t.type || ""
        }

        function a(e, t, r) {
            var n = c.call(this, e, r = r || {}) || this;
            return n.name = t, n.lastModifiedDate = r.lastModified ? new Date(r.lastModified) : new Date, n.lastModified = +n.lastModifiedDate, n
        }

        if (c.prototype.slice = function (e, t, r) {
            return new c([this._buffer.slice(e || 0, t || this._buffer.length)], {type: r})
        }, c.prototype.toString = function () {
            return "[object Blob]"
        }, (a.prototype = e(c.prototype)).constructor = a, Object.setPrototypeOf) Object.setPrototypeOf(a, c); else try {
            a.__proto__ = c
        } catch (e) {
        }

        function s() {
            if (!(this instanceof s)) throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
            var r = document.createDocumentFragment();
            this.addEventListener = r.addEventListener, this.dispatchEvent = function (e) {
                var t = this["on" + e.type];
                "function" == typeof t && t(e), r.dispatchEvent(e)
            }, this.removeEventListener = r.removeEventListener
        }

        function f(e, t, r) {
            if (!(t instanceof c)) throw new TypeError("Failed to execute '" + r + "' on 'FileReader': parameter 1 is not of type 'Blob'.");
            e.result = "", setTimeout(function () {
                this.readyState = s.LOADING, e.dispatchEvent(new Event("load")), e.dispatchEvent(new Event("loadend"))
            })
        }

        a.prototype.toString = function () {
            return "[object File]"
        }, s.EMPTY = 0, s.LOADING = 1, s.DONE = 2, s.prototype.error = null, s.prototype.onabort = null, s.prototype.onerror = null, s.prototype.onload = null, s.prototype.onloadend = null, s.prototype.onloadstart = null, s.prototype.onprogress = null, s.prototype.readAsDataURL = function (e) {
            f(this, e, "readAsDataURL"), this.result = "data:" + e.type + ";base64," + r(e._buffer)
        }, s.prototype.readAsText = function (e) {
            f(this, e, "readAsText"), this.result = t(e._buffer)
        }, s.prototype.readAsArrayBuffer = function (e) {
            f(this, e, "readAsText"), this.result = e._buffer.slice()
        }, s.prototype.abort = function () {
        }, URL.createObjectURL = function (e) {
            return e instanceof c ? "data:" + e.type + ";base64," + r(e._buffer) : d.call(URL, e)
        }, URL.revokeObjectURL = function (e) {
            p && p.call(URL, e)
        };
        var h = u.XMLHttpRequest && u.XMLHttpRequest.prototype.send;
        h && (XMLHttpRequest.prototype.send = function (e) {
            e instanceof c ? (this.setRequestHeader("Content-Type", e.type), h.call(this, t(e._buffer))) : h.call(this, e)
        }), u.FileReader = s, u.File = a, u.Blob = c
    }()
}(), function (e, t) {
    "function" == typeof define && define.amd ? define([], t) : "undefined" != typeof exports ? t() : (t(), e.FileSaver = {})
}(this, function () {
    "use strict";

    function f(e, t, r) {
        var n = new XMLHttpRequest;
        n.open("GET", e), n.responseType = "blob", n.onload = function () {
            a(n.response, t, r)
        }, n.onerror = function () {
            console.error("could not download file")
        }, n.send()
    }

    function i(e) {
        var t = new XMLHttpRequest;
        return t.open("HEAD", e, !1), t.send(), 200 <= t.status && t.status <= 299
    }

    function o(t) {
        try {
            t.dispatchEvent(new MouseEvent("click"))
        } catch (e) {
            var r = document.createEvent("MouseEvents");
            r.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), t.dispatchEvent(r)
        }
    }

    var h = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof global && global.global === global ? global : void 0,
        a = h.saveAs || "object" != typeof window || window !== h ? function () {
        } : "download" in HTMLAnchorElement.prototype ? function (e, t, r) {
            var n = h.URL || h.webkitURL, a = document.createElement("a");
            t = t || e.name || "download", a.download = t, a.rel = "noopener", "string" == typeof e ? (a.href = e, a.origin === location.origin ? o(a) : i(a.href) ? f(e, t, r) : o(a, a.target = "_blank")) : (a.href = n.createObjectURL(e), setTimeout(function () {
                n.revokeObjectURL(a.href)
            }, 4e4), setTimeout(function () {
                o(a)
            }, 0))
        } : "msSaveOrOpenBlob" in navigator ? function (e, t, r) {
            if (t = t || e.name || "download", "string" != typeof e) navigator.msSaveOrOpenBlob((a = e, void 0 === (s = r) ? s = {autoBom: !1} : "object" != typeof s && (console.warn("Depricated: Expected third argument to be a object"), s = {autoBom: !s}), s.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob(["\ufeff", a], {type: a.type}) : a), t); else if (i(e)) f(e, t, r); else {
                var n = document.createElement("a");
                n.href = e, n.target = "_blank", setTimeout(function () {
                    o(n)
                })
            }
            var a, s
        } : function (e, t, r, n) {
            if ((n = n || open("", "_blank")) && (n.document.title = n.document.body.innerText = "downloading..."), "string" == typeof e) return f(e, t, r);
            var a = "application/octet-stream" === e.type, s = /constructor/i.test(h.HTMLElement) || h.safari,
                i = /CriOS\/[\d]+/.test(navigator.userAgent);
            if ((i || a && s) && "object" == typeof FileReader) {
                var o = new FileReader;
                o.onloadend = function () {
                    var e = o.result;
                    e = i ? e : e.replace(/^data:[^;]*;/, "data:attachment/file;"), n ? n.location.href = e : location = e, n = null
                }, o.readAsDataURL(e)
            } else {
                var l = h.URL || h.webkitURL, c = l.createObjectURL(e);
                n ? n.location = c : location.href = c, n = null, setTimeout(function () {
                    l.revokeObjectURL(c)
                }, 4e4)
            }
        };
    h.saveAs = a.saveAs = a, "undefined" != typeof module && (module.exports = a)
}), function (e) {
    if ("object" == typeof exports && "undefined" != typeof module && "undefined" == typeof DO_NOT_EXPORT_JSZIP) module.exports = e(); else if ("function" == typeof define && define.amd && "undefined" == typeof DO_NOT_EXPORT_JSZIP) JSZipSync = e(), define([], e); else {
        var t;
        "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof $ && $.global ? t = $.global : "undefined" != typeof self && (t = self), t.JSZipSync = e()
    }
}(function () {
    return function a(s, i, o) {
        function l(r, e) {
            if (!i[r]) {
                if (!s[r]) {
                    var t = "function" == typeof require && require;
                    if (!e && t) return t(r, !0);
                    if (c) return c(r, !0);
                    throw new Error("Cannot find module '" + r + "'")
                }
                var n = i[r] = {exports: {}};
                s[r][0].call(n.exports, function (e) {
                    var t = s[r][1][e];
                    return l(t || e)
                }, n, n.exports, a, s, i, o)
            }
            return i[r].exports
        }

        for (var c = "function" == typeof require && require, e = 0; e < o.length; e++) l(o[e]);
        return l
    }({
        1: [function (e, t, r) {
            "use strict";
            var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            r.encode = function (e, t) {
                for (var r, n, a, s, i, o, l, c = "", f = 0; f < e.length;) s = (r = e.charCodeAt(f++)) >> 2, i = (3 & r) << 4 | (n = e.charCodeAt(f++)) >> 4, o = (15 & n) << 2 | (a = e.charCodeAt(f++)) >> 6, l = 63 & a, isNaN(n) ? o = l = 64 : isNaN(a) && (l = 64), c = c + h.charAt(s) + h.charAt(i) + h.charAt(o) + h.charAt(l);
                return c
            }, r.decode = function (e, t) {
                var r, n, a, s, i, o, l = "", c = 0;
                for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); c < e.length;) r = h.indexOf(e.charAt(c++)) << 2 | (s = h.indexOf(e.charAt(c++))) >> 4, n = (15 & s) << 4 | (i = h.indexOf(e.charAt(c++))) >> 2, a = (3 & i) << 6 | (o = h.indexOf(e.charAt(c++))), l += String.fromCharCode(r), 64 != i && (l += String.fromCharCode(n)), 64 != o && (l += String.fromCharCode(a));
                return l
            }
        }, {}],
        2: [function (e, t, r) {
            "use strict";

            function n() {
                this.compressedSize = 0, this.uncompressedSize = 0, this.crc32 = 0, this.compressionMethod = null, this.compressedContent = null
            }

            n.prototype = {
                getContent: function () {
                    return null
                }, getCompressedContent: function () {
                    return null
                }
            }, t.exports = n
        }, {}],
        3: [function (e, t, r) {
            "use strict";
            r.STORE = {
                magic: "\0\0", compress: function (e) {
                    return e
                }, uncompress: function (e) {
                    return e
                }, compressInputType: null, uncompressInputType: null
            }, r.DEFLATE = e("./flate")
        }, {"./flate": 8}],
        4: [function (e, t, r) {
            "use strict";
            var i = e("./utils"),
                o = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
            t.exports = function (e, t) {
                if (void 0 === e || !e.length) return 0;
                var r = "string" !== i.getTypeOf(e);
                void 0 === t && (t = 0);
                var n = 0;
                t ^= -1;
                for (var a = 0, s = e.length; a < s; a++) n = r ? e[a] : e.charCodeAt(a), t = t >>> 8 ^ o[255 & (t ^ n)];
                return -1 ^ t
            }
        }, {"./utils": 21}],
        5: [function (e, t, r) {
            "use strict";
            var n = e("./utils");

            function a(e) {
                this.data = null, this.length = 0, this.index = 0
            }

            a.prototype = {
                checkOffset: function (e) {
                    this.checkIndex(this.index + e)
                }, checkIndex: function (e) {
                    if (this.length < e || e < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?")
                }, setIndex: function (e) {
                    this.checkIndex(e), this.index = e
                }, skip: function (e) {
                    this.setIndex(this.index + e)
                }, byteAt: function (e) {
                }, readInt: function (e) {
                    var t, r = 0;
                    for (this.checkOffset(e), t = this.index + e - 1; t >= this.index; t--) r = (r << 8) + this.byteAt(t);
                    return this.index += e, r
                }, readString: function (e) {
                    return n.transformTo("string", this.readData(e))
                }, readData: function (e) {
                }, lastIndexOfSignature: function (e) {
                }, readDate: function () {
                    var e = this.readInt(4);
                    return new Date(1980 + (e >> 25 & 127), (e >> 21 & 15) - 1, e >> 16 & 31, e >> 11 & 31, e >> 5 & 63, (31 & e) << 1)
                }
            }, t.exports = a
        }, {"./utils": 21}],
        6: [function (e, t, r) {
            "use strict";
            r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !1, r.date = null, r.compression = null, r.comment = null
        }, {}],
        7: [function (e, t, r) {
            "use strict";
            var n = e("./utils");
            r.string2binary = function (e) {
                return n.string2binary(e)
            }, r.string2Uint8Array = function (e) {
                return n.transformTo("uint8array", e)
            }, r.uint8Array2String = function (e) {
                return n.transformTo("string", e)
            }, r.string2Blob = function (e) {
                var t = n.transformTo("arraybuffer", e);
                return n.arrayBuffer2Blob(t)
            }, r.arrayBuffer2Blob = function (e) {
                return n.arrayBuffer2Blob(e)
            }, r.transformTo = function (e, t) {
                return n.transformTo(e, t)
            }, r.getTypeOf = function (e) {
                return n.getTypeOf(e)
            }, r.checkSupport = function (e) {
                return n.checkSupport(e)
            }, r.MAX_VALUE_16BITS = n.MAX_VALUE_16BITS, r.MAX_VALUE_32BITS = n.MAX_VALUE_32BITS, r.pretty = function (e) {
                return n.pretty(e)
            }, r.findCompression = function (e) {
                return n.findCompression(e)
            }, r.isRegExp = function (e) {
                return n.isRegExp(e)
            }
        }, {"./utils": 21}],
        8: [function (e, t, r) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
                a = e("pako");
            r.uncompressInputType = n ? "uint8array" : "array", r.compressInputType = n ? "uint8array" : "array", r.magic = "\b\0", r.compress = function (e) {
                return a.deflateRaw(e)
            }, r.uncompress = function (e) {
                return a.inflateRaw(e)
            }
        }, {pako: 24}],
        9: [function (e, t, r) {
            "use strict";
            var n = e("./base64");

            function a(e, t) {
                if (!(this instanceof a)) return new a(e, t);
                this.files = {}, this.comment = null, this.root = "", e && this.load(e, t), this.clone = function () {
                    var e = new a;
                    for (var t in this) "function" != typeof this[t] && (e[t] = this[t]);
                    return e
                }
            }

            (a.prototype = e("./object")).load = e("./load"), a.support = e("./support"), a.defaults = e("./defaults"), a.utils = e("./deprecatedPublicUtils"), a.base64 = {
                encode: function (e) {
                    return n.encode(e)
                }, decode: function (e) {
                    return n.decode(e)
                }
            }, a.compressions = e("./compressions"), t.exports = a
        }, {
            "./base64": 1,
            "./compressions": 3,
            "./defaults": 6,
            "./deprecatedPublicUtils": 7,
            "./load": 10,
            "./object": 13,
            "./support": 17
        }],
        10: [function (e, t, r) {
            "use strict";
            var i = e("./base64"), o = e("./zipEntries");
            t.exports = function (e, t) {
                var r, n, a, s;
                for ((t = t || {}).base64 && (e = i.decode(e)), r = (n = new o(e, t)).files, a = 0; a < r.length; a++) s = r[a], this.file(s.fileName, s.decompressed, {
                    binary: !0,
                    optimizedBinaryString: !0,
                    date: s.date,
                    dir: s.dir,
                    comment: s.fileComment.length ? s.fileComment : null,
                    createFolders: t.createFolders
                });
                return n.zipComment.length && (this.comment = n.zipComment), this
            }
        }, {"./base64": 1, "./zipEntries": 22}],
        11: [function (e, a, t) {
            (function (r) {
                "use strict";
                var n = function () {
                };
                if (void 0 !== r) {
                    var t = !r.from;
                    if (!t) try {
                        r.from("foo", "utf8")
                    } catch (e) {
                        t = !0
                    }
                    n = t ? function (e, t) {
                        return t ? new r(e, t) : new r(e)
                    } : r.from.bind(r), r.alloc || (r.alloc = function (e) {
                        return new r(e)
                    })
                }
                a.exports = function (e, t) {
                    return "number" == typeof e ? r.alloc(e) : n(e, t)
                }, a.exports.test = function (e) {
                    return r.isBuffer(e)
                }
            }).call(this, "undefined" != typeof Buffer ? Buffer : void 0)
        }, {}],
        12: [function (e, t, r) {
            "use strict";
            var n = e("./uint8ArrayReader");

            function a(e) {
                this.data = e, this.length = this.data.length, this.index = 0
            }

            (a.prototype = new n).readData = function (e) {
                this.checkOffset(e);
                var t = this.data.slice(this.index, this.index + e);
                return this.index += e, t
            }, t.exports = a
        }, {"./uint8ArrayReader": 18}],
        13: [function (e, t, r) {
            "use strict";

            function n(e) {
                if (e._data instanceof c && (e._data = e._data.getContent(), e.options.binary = !0, e.options.base64 = !1, "uint8array" === v.getTypeOf(e._data))) {
                    var t = e._data;
                    e._data = new Uint8Array(t.length), 0 !== t.length && e._data.set(t, 0)
                }
                return e._data
            }

            function a(e) {
                var t = n(e);
                return "string" === v.getTypeOf(t) ? !e.options.binary && i.nodebuffer ? f(t, "utf-8") : e.asBinary() : t
            }

            function s(e) {
                var t = n(this);
                return null == t ? "" : (this.options.base64 && (t = g.decode(t)), t = e && this.options.binary ? p.utf8decode(t) : v.transformTo("string", t), e || this.options.binary || (t = v.transformTo("string", p.utf8encode(t))), t)
            }

            function o(e, t, r) {
                this.name = e, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this._data = t, this.options = r, this._initialMetadata = {
                    dir: r.dir,
                    date: r.date
                }
            }

            var i = e("./support"), v = e("./utils"), E = e("./crc32"), w = e("./signature"), l = e("./defaults"),
                g = e("./base64"), b = e("./compressions"), c = e("./compressedObject"), f = e("./nodeBuffer"),
                S = e("./utf8"), _ = e("./stringWriter"), y = e("./uint8ArrayWriter");
            o.prototype = {
                asText: function () {
                    return s.call(this, !0)
                }, asBinary: function () {
                    return s.call(this, !1)
                }, asNodeBuffer: function () {
                    var e = a(this);
                    return v.transformTo("nodebuffer", e)
                }, asUint8Array: function () {
                    var e = a(this);
                    return v.transformTo("uint8array", e)
                }, asArrayBuffer: function () {
                    return this.asUint8Array().buffer
                }
            };

            function C(e, t) {
                var r, n = "";
                for (r = 0; r < t; r++) n += String.fromCharCode(255 & e), e >>>= 8;
                return n
            }

            function B() {
                var e, t, r = {};
                for (e = 0; e < arguments.length; e++) for (t in arguments[e]) arguments[e].hasOwnProperty(t) && void 0 === r[t] && (r[t] = arguments[e][t]);
                return r
            }

            function h(e, t, r) {
                var n, a, s = v.getTypeOf(t);
                if (!0 !== (a = (a = r) || {}).base64 || null !== a.binary && void 0 !== a.binary || (a.binary = !0), (a = B(a, l)).date = a.date || new Date, null !== a.compression && (a.compression = a.compression.toUpperCase()), (r = a).createFolders && (n = u(e)) && d.call(this, n, !0), r.dir || null == t) r.base64 = !1, r.binary = !1, t = null; else if ("string" === s) r.binary && !r.base64 && !0 !== r.optimizedBinaryString && (t = v.string2binary(t)); else {
                    if (r.base64 = !1, r.binary = !0, !(s || t instanceof c)) throw new Error("The data of '" + e + "' is in an unsupported format !");
                    "arraybuffer" === s && (t = v.transformTo("uint8array", t))
                }
                var i = new o(e, t, r);
                return this.files[e] = i
            }

            function T(e, t) {
                var r, n = new c;
                return e._data instanceof c ? (n.uncompressedSize = e._data.uncompressedSize, n.crc32 = e._data.crc32, 0 === n.uncompressedSize || e.dir ? (t = b.STORE, n.compressedContent = "", n.crc32 = 0) : e._data.compressionMethod === t.magic ? n.compressedContent = e._data.getCompressedContent() : (r = e._data.getContent(), n.compressedContent = t.compress(v.transformTo(t.compressInputType, r)))) : ((r = a(e)) && 0 !== r.length && !e.dir || (t = b.STORE, r = ""), n.uncompressedSize = r.length, n.crc32 = E(r), n.compressedContent = t.compress(v.transformTo(t.compressInputType, r))), n.compressedSize = n.compressedContent.length, n.compressionMethod = t.magic, n
            }

            function k(e, t, r, n) {
                r.compressedContent;
                var a, s, i, o, l = v.transformTo("string", S.utf8encode(t.name)), c = t.comment || "",
                    f = v.transformTo("string", S.utf8encode(c)), h = l.length !== t.name.length,
                    u = f.length !== c.length, d = t.options, p = "", m = "", g = "";
                i = t._initialMetadata.dir !== t.dir ? t.dir : d.dir, a = (o = t._initialMetadata.date !== t.date ? t.date : d.date).getHours(), a <<= 6, a |= o.getMinutes(), a <<= 5, a |= o.getSeconds() / 2, s = o.getFullYear() - 1980, s <<= 4, s |= o.getMonth() + 1, s <<= 5, s |= o.getDate(), h && (m = C(1, 1) + C(E(l), 4) + l, p += "up" + C(m.length, 2) + m), u && (g = C(1, 1) + C(this.crc32(f), 4) + f, p += "uc" + C(g.length, 2) + g);
                var b = "";
                return b += "\n\0", b += h || u ? "\0\b" : "\0\0", b += r.compressionMethod, b += C(a, 2), b += C(s, 2), b += C(r.crc32, 4), b += C(r.compressedSize, 4), b += C(r.uncompressedSize, 4), b += C(l.length, 2), b += C(p.length, 2), {
                    fileRecord: w.LOCAL_FILE_HEADER + b + l + p,
                    dirRecord: w.CENTRAL_FILE_HEADER + "\0" + b + C(f.length, 2) + "\0\0\0\0" + (!0 === i ? "\0\0\0" : "\0\0\0\0") + C(n, 4) + l + p + f,
                    compressedObject: r
                }
            }

            var u = function (e) {
                "/" == e.slice(-1) && (e = e.substring(0, e.length - 1));
                var t = e.lastIndexOf("/");
                return 0 < t ? e.substring(0, t) : ""
            }, d = function (e, t) {
                return "/" != e.slice(-1) && (e += "/"), t = void 0 !== t && t, this.files[e] || h.call(this, e, null, {
                    dir: !0,
                    createFolders: t
                }), this.files[e]
            }, p = {
                load: function (e, t) {
                    throw new Error("Load method is not defined. Is the file jszip-load.js included ?")
                }, filter: function (e) {
                    var t, r, n, a, s = [];
                    for (t in this.files) this.files.hasOwnProperty(t) && (n = this.files[t], a = new o(n.name, n._data, B(n.options)), r = t.slice(this.root.length, t.length), t.slice(0, this.root.length) === this.root && e(r, a) && s.push(a));
                    return s
                }, file: function (r, e, t) {
                    if (1 !== arguments.length) return r = this.root + r, h.call(this, r, e, t), this;
                    if (v.isRegExp(r)) {
                        var n = r;
                        return this.filter(function (e, t) {
                            return !t.dir && n.test(e)
                        })
                    }
                    return this.filter(function (e, t) {
                        return !t.dir && e === r
                    })[0] || null
                }, folder: function (r) {
                    if (!r) return this;
                    if (v.isRegExp(r)) return this.filter(function (e, t) {
                        return t.dir && r.test(e)
                    });
                    var e = this.root + r, t = d.call(this, e), n = this.clone();
                    return n.root = t.name, n
                }, remove: function (r) {
                    r = this.root + r;
                    var e = this.files[r];
                    if (e || ("/" != r.slice(-1) && (r += "/"), e = this.files[r]), e && !e.dir) delete this.files[r]; else for (var t = this.filter(function (e, t) {
                        return t.name.slice(0, r.length) === r
                    }), n = 0; n < t.length; n++) delete this.files[t[n].name];
                    return this
                }, generate: function (e) {
                    e = B(e || {}, {
                        base64: !0,
                        compression: "STORE",
                        type: "base64",
                        comment: null
                    }), v.checkSupport(e.type);
                    var t, r, n = [], a = 0, s = 0,
                        i = v.transformTo("string", this.utf8encode(e.comment || this.comment || ""));
                    for (var o in this.files) if (this.files.hasOwnProperty(o)) {
                        var l = this.files[o], c = l.options.compression || e.compression.toUpperCase(), f = b[c];
                        if (!f) throw new Error(c + " is not a valid compression method !");
                        var h = T.call(this, l, f), u = k.call(this, o, l, h, a);
                        a += u.fileRecord.length + h.compressedSize, s += u.dirRecord.length, n.push(u)
                    }
                    var d;
                    d = w.CENTRAL_DIRECTORY_END + "\0\0\0\0" + C(n.length, 2) + C(n.length, 2) + C(s, 4) + C(a, 4) + C(i.length, 2) + i;
                    var p = e.type.toLowerCase();
                    for (t = new ("uint8array" === p || "arraybuffer" === p || "blob" === p || "nodebuffer" === p ? y : _)(a + s + d.length), r = 0; r < n.length; r++) t.append(n[r].fileRecord), t.append(n[r].compressedObject.compressedContent);
                    for (r = 0; r < n.length; r++) t.append(n[r].dirRecord);
                    t.append(d);
                    var m = t.finalize();
                    switch (e.type.toLowerCase()) {
                        case"uint8array":
                        case"arraybuffer":
                        case"nodebuffer":
                            return v.transformTo(e.type.toLowerCase(), m);
                        case"blob":
                            return v.arrayBuffer2Blob(v.transformTo("arraybuffer", m));
                        case"base64":
                            return e.base64 ? g.encode(m) : m;
                        default:
                            return m
                    }
                }, crc32: function (e, t) {
                    return E(e, t)
                }, utf8encode: function (e) {
                    return v.transformTo("string", S.utf8encode(e))
                }, utf8decode: function (e) {
                    return S.utf8decode(e)
                }
            };
            t.exports = p
        }, {
            "./base64": 1,
            "./compressedObject": 2,
            "./compressions": 3,
            "./crc32": 4,
            "./defaults": 6,
            "./nodeBuffer": 11,
            "./signature": 14,
            "./stringWriter": 16,
            "./support": 17,
            "./uint8ArrayWriter": 19,
            "./utf8": 20,
            "./utils": 21
        }],
        14: [function (e, t, r) {
            "use strict";
            r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\b"
        }, {}],
        15: [function (e, t, r) {
            "use strict";
            var n = e("./dataReader"), a = e("./utils");

            function s(e, t) {
                this.data = e, t || (this.data = a.string2binary(this.data)), this.length = this.data.length, this.index = 0
            }

            (s.prototype = new n).byteAt = function (e) {
                return this.data.charCodeAt(e)
            }, s.prototype.lastIndexOfSignature = function (e) {
                return this.data.lastIndexOf(e)
            }, s.prototype.readData = function (e) {
                this.checkOffset(e);
                var t = this.data.slice(this.index, this.index + e);
                return this.index += e, t
            }, t.exports = s
        }, {"./dataReader": 5, "./utils": 21}],
        16: [function (e, t, r) {
            "use strict";

            function n() {
                this.data = []
            }

            var a = e("./utils");
            n.prototype = {
                append: function (e) {
                    e = a.transformTo("string", e), this.data.push(e)
                }, finalize: function () {
                    return this.data.join("")
                }
            }, t.exports = n
        }, {"./utils": 21}],
        17: [function (e, t, n) {
            (function (e) {
                "use strict";
                if (n.base64 = !0, n.array = !0, n.string = !0, n.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, n.nodebuffer = void 0 !== e, n.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) n.blob = !1; else {
                    var t = new ArrayBuffer(0);
                    try {
                        n.blob = 0 === new Blob([t], {type: "application/zip"}).size
                    } catch (e) {
                        try {
                            var r = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder);
                            r.append(t), n.blob = 0 === r.getBlob("application/zip").size
                        } catch (e) {
                            n.blob = !1
                        }
                    }
                }
            }).call(this, "undefined" != typeof Buffer ? Buffer : void 0)
        }, {}],
        18: [function (e, t, r) {
            "use strict";
            var n = e("./dataReader");

            function a(e) {
                e && (this.data = e, this.length = this.data.length, this.index = 0)
            }

            (a.prototype = new n).byteAt = function (e) {
                return this.data[e]
            }, a.prototype.lastIndexOfSignature = function (e) {
                for (var t = e.charCodeAt(0), r = e.charCodeAt(1), n = e.charCodeAt(2), a = e.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t && this.data[s + 1] === r && this.data[s + 2] === n && this.data[s + 3] === a) return s;
                return -1
            }, a.prototype.readData = function (e) {
                if (this.checkOffset(e), 0 === e) return new Uint8Array(0);
                var t = this.data.subarray(this.index, this.index + e);
                return this.index += e, t
            }, t.exports = a
        }, {"./dataReader": 5}],
        19: [function (e, t, r) {
            "use strict";

            function n(e) {
                this.data = new Uint8Array(e), this.index = 0
            }

            var a = e("./utils");
            n.prototype = {
                append: function (e) {
                    0 !== e.length && (e = a.transformTo("uint8array", e), this.data.set(e, this.index), this.index += e.length)
                }, finalize: function () {
                    return this.data
                }
            }, t.exports = n
        }, {"./utils": 21}],
        20: [function (e, t, r) {
            "use strict";
            for (var o = e("./utils"), l = e("./support"), n = e("./nodeBuffer"), c = new Array(256), a = 0; a < 256; a++) c[a] = 252 <= a ? 6 : 248 <= a ? 5 : 240 <= a ? 4 : 224 <= a ? 3 : 192 <= a ? 2 : 1;
            c[254] = c[254] = 1;

            function s(e, t) {
                var r;
                for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) r--;
                return !(r < 0) && 0 !== r && r + c[e[r]] > t ? r : t
            }

            function i(e) {
                var t, r, n, a, s = e.length, i = new Array(2 * s);
                for (t = r = 0; t < s;) if ((n = e[t++]) < 128) i[r++] = n; else if (4 < (a = c[n])) i[r++] = 65533, t += a - 1; else {
                    for (n &= 2 === a ? 31 : 3 === a ? 15 : 7; 1 < a && t < s;) n = n << 6 | 63 & e[t++], a--;
                    1 < a ? i[r++] = 65533 : n < 65536 ? i[r++] = n : (n -= 65536, i[r++] = 55296 | n >> 10 & 1023, i[r++] = 56320 | 1023 & n)
                }
                return i.length !== r && (i.subarray ? i = i.subarray(0, r) : i.length = r), o.applyFromCharCode(i)
            }

            r.utf8encode = function (e) {
                return l.nodebuffer ? n(e, "utf-8") : function (e) {
                    var t, r, n, a, s, i = e.length, o = 0;
                    for (a = 0; a < i; a++) 55296 == (64512 & (r = e.charCodeAt(a))) && a + 1 < i && 56320 == (64512 & (n = e.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
                    for (t = new (l.uint8array ? Uint8Array : Array)(o), a = s = 0; s < o; a++) 55296 == (64512 & (r = e.charCodeAt(a))) && a + 1 < i && 56320 == (64512 & (n = e.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
                    return t
                }(e)
            }, r.utf8decode = function (e) {
                if (l.nodebuffer) return o.transformTo("nodebuffer", e).toString("utf-8");
                for (var t = [], r = 0, n = (e = o.transformTo(l.uint8array ? "uint8array" : "array", e)).length; r < n;) {
                    var a = s(e, Math.min(r + 65536, n));
                    l.uint8array ? t.push(i(e.subarray(r, a))) : t.push(i(e.slice(r, a))), r = a
                }
                return t.join("")
            }
        }, {"./nodeBuffer": 11, "./support": 17, "./utils": 21}],
        21: [function (e, t, c) {
            "use strict";
            var r = e("./support"), n = e("./compressions"), f = e("./nodeBuffer");

            function a(e) {
                return e
            }

            function s(e, t) {
                for (var r = 0; r < e.length; ++r) t[r] = 255 & e.charCodeAt(r);
                return t
            }

            function i(e) {
                var t = 65536, r = [], n = e.length, a = c.getTypeOf(e), s = 0, i = !0;
                try {
                    switch (a) {
                        case"uint8array":
                            String.fromCharCode.apply(null, new Uint8Array(0));
                            break;
                        case"nodebuffer":
                            String.fromCharCode.apply(null, f(0))
                    }
                } catch (e) {
                    i = !1
                }
                if (!i) {
                    for (var o = "", l = 0; l < e.length; l++) o += String.fromCharCode(e[l]);
                    return o
                }
                for (; s < n && 1 < t;) try {
                    "array" === a || "nodebuffer" === a ? r.push(String.fromCharCode.apply(null, e.slice(s, Math.min(s + t, n)))) : r.push(String.fromCharCode.apply(null, e.subarray(s, Math.min(s + t, n)))), s += t
                } catch (e) {
                    t = Math.floor(t / 2)
                }
                return r.join("")
            }

            function o(e, t) {
                for (var r = 0; r < e.length; r++) t[r] = e[r];
                return t
            }

            c.string2binary = function (e) {
                for (var t = "", r = 0; r < e.length; r++) t += String.fromCharCode(255 & e.charCodeAt(r));
                return t
            }, c.arrayBuffer2Blob = function (t) {
                c.checkSupport("blob");
                try {
                    return new Blob([t], {type: "application/zip"})
                } catch (e) {
                    try {
                        var r = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder);
                        return r.append(t), r.getBlob("application/zip")
                    } catch (e) {
                        throw new Error("Bug : can't construct the Blob.")
                    }
                }
            }, c.applyFromCharCode = i;
            var l = {};
            l.string = {
                string: a, array: function (e) {
                    return s(e, new Array(e.length))
                }, arraybuffer: function (e) {
                    return l.string.uint8array(e).buffer
                }, uint8array: function (e) {
                    return s(e, new Uint8Array(e.length))
                }, nodebuffer: function (e) {
                    return s(e, f(e.length))
                }
            }, l.array = {
                string: i, array: a, arraybuffer: function (e) {
                    return new Uint8Array(e).buffer
                }, uint8array: function (e) {
                    return new Uint8Array(e)
                }, nodebuffer: function (e) {
                    return f(e)
                }
            }, l.arraybuffer = {
                string: function (e) {
                    return i(new Uint8Array(e))
                }, array: function (e) {
                    return o(new Uint8Array(e), new Array(e.byteLength))
                }, arraybuffer: a, uint8array: function (e) {
                    return new Uint8Array(e)
                }, nodebuffer: function (e) {
                    return f(new Uint8Array(e))
                }
            }, l.uint8array = {
                string: i, array: function (e) {
                    return o(e, new Array(e.length))
                }, arraybuffer: function (e) {
                    return e.buffer
                }, uint8array: a, nodebuffer: function (e) {
                    return f(e)
                }
            }, l.nodebuffer = {
                string: i, array: function (e) {
                    return o(e, new Array(e.length))
                }, arraybuffer: function (e) {
                    return l.nodebuffer.uint8array(e).buffer
                }, uint8array: function (e) {
                    return o(e, new Uint8Array(e.length))
                }, nodebuffer: a
            }, c.transformTo = function (e, t) {
                if (t = t || "", !e) return t;
                c.checkSupport(e);
                var r = c.getTypeOf(t);
                return l[r][e](t)
            }, c.getTypeOf = function (e) {
                return "string" == typeof e ? "string" : "[object Array]" === Object.prototype.toString.call(e) ? "array" : r.nodebuffer && f.test(e) ? "nodebuffer" : r.uint8array && e instanceof Uint8Array ? "uint8array" : r.arraybuffer && e instanceof ArrayBuffer ? "arraybuffer" : void 0
            }, c.checkSupport = function (e) {
                if (!r[e.toLowerCase()]) throw new Error(e + " is not supported by this browser")
            }, c.MAX_VALUE_16BITS = 65535, c.MAX_VALUE_32BITS = -1, c.pretty = function (e) {
                var t, r, n = "";
                for (r = 0; r < (e || "").length; r++) n += "\\x" + ((t = e.charCodeAt(r)) < 16 ? "0" : "") + t.toString(16).toUpperCase();
                return n
            }, c.findCompression = function (e) {
                for (var t in n) if (n.hasOwnProperty(t) && n[t].magic === e) return n[t];
                return null
            }, c.isRegExp = function (e) {
                return "[object RegExp]" === Object.prototype.toString.call(e)
            }
        }, {"./compressions": 3, "./nodeBuffer": 11, "./support": 17}],
        22: [function (e, t, r) {
            "use strict";
            var n = e("./stringReader"), a = e("./nodeBufferReader"), s = e("./uint8ArrayReader"), i = e("./utils"),
                o = e("./signature"), l = e("./zipEntry"), c = e("./support"), f = e("./object");

            function h(e, t) {
                this.files = [], this.loadOptions = t, e && this.load(e)
            }

            h.prototype = {
                checkSignature: function (e) {
                    var t = this.reader.readString(4);
                    if (t !== e) throw new Error("Corrupted zip or bug : unexpected signature (" + i.pretty(t) + ", expected " + i.pretty(e) + ")")
                }, readBlockEndOfCentral: function () {
                    this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2), this.zipComment = this.reader.readString(this.zipCommentLength), this.zipComment = f.utf8decode(this.zipComment)
                }, readBlockZip64EndOfCentral: function () {
                    this.zip64EndOfCentralSize = this.reader.readInt(8), this.versionMadeBy = this.reader.readString(2), this.versionNeeded = this.reader.readInt(2), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
                    for (var e, t, r, n = this.zip64EndOfCentralSize - 44; 0 < n;) e = this.reader.readInt(2), t = this.reader.readInt(4), r = this.reader.readString(t), this.zip64ExtensibleData[e] = {
                        id: e,
                        length: t,
                        value: r
                    }
                }, readBlockZip64EndOfCentralLocator: function () {
                    if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported")
                }, readLocalFiles: function () {
                    var e, t;
                    for (e = 0; e < this.files.length; e++) t = this.files[e], this.reader.setIndex(t.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), t.readLocalPart(this.reader), t.handleUTF8()
                }, readCentralDir: function () {
                    var e;
                    for (this.reader.setIndex(this.centralDirOffset); this.reader.readString(4) === o.CENTRAL_FILE_HEADER;) (e = new l({zip64: this.zip64}, this.loadOptions)).readCentralPart(this.reader), this.files.push(e)
                }, readEndOfCentral: function () {
                    var e = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
                    if (-1 === e) throw new Error("Corrupted zip : can't find end of central directory");
                    if (this.reader.setIndex(e), this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
                        if (this.zip64 = !0, -1 === (e = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR))) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
                        this.reader.setIndex(e), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral()
                    }
                }, prepareReader: function (e) {
                    var t = i.getTypeOf(e);
                    "string" !== t || c.uint8array ? this.reader = "nodebuffer" === t ? new a(e) : new s(i.transformTo("uint8array", e)) : this.reader = new n(e, this.loadOptions.optimizedBinaryString)
                }, load: function (e) {
                    this.prepareReader(e), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles()
                }
            }, t.exports = h
        }, {
            "./nodeBufferReader": 12,
            "./object": 13,
            "./signature": 14,
            "./stringReader": 15,
            "./support": 17,
            "./uint8ArrayReader": 18,
            "./utils": 21,
            "./zipEntry": 23
        }],
        23: [function (e, t, r) {
            "use strict";
            var n = e("./stringReader"), s = e("./utils"), a = e("./compressedObject"), i = e("./object");

            function o(e, t) {
                this.options = e, this.loadOptions = t
            }

            o.prototype = {
                isEncrypted: function () {
                    return 1 == (1 & this.bitFlag)
                }, useUTF8: function () {
                    return 2048 == (2048 & this.bitFlag)
                }, prepareCompressedContent: function (r, n, a) {
                    return function () {
                        var e = r.index;
                        r.setIndex(n);
                        var t = r.readData(a);
                        return r.setIndex(e), t
                    }
                }, prepareContent: function (e, t, r, n, a) {
                    return function () {
                        var e = s.transformTo(n.uncompressInputType, this.getCompressedContent()), t = n.uncompress(e);
                        if (t.length !== a) throw new Error("Bug : uncompressed data size mismatch");
                        return t
                    }
                }, readLocalPart: function (e) {
                    var t, r;
                    if (e.skip(22), this.fileNameLength = e.readInt(2), r = e.readInt(2), this.fileName = e.readString(this.fileNameLength), e.skip(r), -1 == this.compressedSize || -1 == this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");
                    if (null === (t = s.findCompression(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + this.fileName + ")");
                    if (this.decompressed = new a, this.decompressed.compressedSize = this.compressedSize, this.decompressed.uncompressedSize = this.uncompressedSize, this.decompressed.crc32 = this.crc32, this.decompressed.compressionMethod = this.compressionMethod, this.decompressed.getCompressedContent = this.prepareCompressedContent(e, e.index, this.compressedSize, t), this.decompressed.getContent = this.prepareContent(e, e.index, this.compressedSize, t, this.uncompressedSize), this.loadOptions.checkCRC32 && (this.decompressed = s.transformTo("string", this.decompressed.getContent()), i.crc32(this.decompressed) !== this.crc32)) throw new Error("Corrupted zip : CRC32 mismatch")
                }, readCentralPart: function (e) {
                    if (this.versionMadeBy = e.readString(2), this.versionNeeded = e.readInt(2), this.bitFlag = e.readInt(2), this.compressionMethod = e.readString(2), this.date = e.readDate(), this.crc32 = e.readInt(4), this.compressedSize = e.readInt(4), this.uncompressedSize = e.readInt(4), this.fileNameLength = e.readInt(2), this.extraFieldsLength = e.readInt(2), this.fileCommentLength = e.readInt(2), this.diskNumberStart = e.readInt(2), this.internalFileAttributes = e.readInt(2), this.externalFileAttributes = e.readInt(4), this.localHeaderOffset = e.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
                    this.fileName = e.readString(this.fileNameLength), this.readExtraFields(e), this.parseZIP64ExtraField(e), this.fileComment = e.readString(this.fileCommentLength), this.dir = !!(16 & this.externalFileAttributes)
                }, parseZIP64ExtraField: function (e) {
                    if (this.extraFields[1]) {
                        var t = new n(this.extraFields[1].value);
                        this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = t.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = t.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = t.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = t.readInt(4))
                    }
                }, readExtraFields: function (e) {
                    var t, r, n, a = e.index;
                    for (this.extraFields = this.extraFields || {}; e.index < a + this.extraFieldsLength;) t = e.readInt(2), r = e.readInt(2), n = e.readString(r), this.extraFields[t] = {
                        id: t,
                        length: r,
                        value: n
                    }
                }, handleUTF8: function () {
                    if (this.useUTF8()) this.fileName = i.utf8decode(this.fileName), this.fileComment = i.utf8decode(this.fileComment); else {
                        var e = this.findExtraFieldUnicodePath();
                        null !== e && (this.fileName = e);
                        var t = this.findExtraFieldUnicodeComment();
                        null !== t && (this.fileComment = t)
                    }
                }, findExtraFieldUnicodePath: function () {
                    var e = this.extraFields[28789];
                    if (e) {
                        var t = new n(e.value);
                        return 1 !== t.readInt(1) ? null : i.crc32(this.fileName) !== t.readInt(4) ? null : i.utf8decode(t.readString(e.length - 5))
                    }
                    return null
                }, findExtraFieldUnicodeComment: function () {
                    var e = this.extraFields[25461];
                    if (e) {
                        var t = new n(e.value);
                        return 1 !== t.readInt(1) ? null : i.crc32(this.fileComment) !== t.readInt(4) ? null : i.utf8decode(t.readString(e.length - 5))
                    }
                    return null
                }
            }, t.exports = o
        }, {"./compressedObject": 2, "./object": 13, "./stringReader": 15, "./utils": 21}],
        24: [function (e, t, r) {
            "use strict";
            var n = {};
            (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n
        }, {"./lib/deflate": 25, "./lib/inflate": 26, "./lib/utils/common": 27, "./lib/zlib/constants": 30}],
        25: [function (e, t, r) {
            "use strict";
            var i = e("./zlib/deflate.js"), o = e("./utils/common"), l = e("./utils/strings"), n = e("./zlib/messages"),
                a = e("./zlib/zstream"), s = function (e) {
                    this.options = o.assign({
                        level: -1,
                        method: 8,
                        chunkSize: 16384,
                        windowBits: 15,
                        memLevel: 8,
                        strategy: 0,
                        to: ""
                    }, e || {});
                    var t = this.options;
                    t.raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new a, this.strm.avail_out = 0;
                    var r = i.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
                    if (0 !== r) throw new Error(n[r]);
                    t.header && i.deflateSetHeader(this.strm, t.header)
                };

            function c(e, t) {
                var r = new s(t);
                if (r.push(e, !0), r.err) throw r.msg;
                return r.result
            }

            s.prototype.push = function (e, t) {
                var r, n, a = this.strm, s = this.options.chunkSize;
                if (this.ended) return !1;
                n = t === ~~t ? t : !0 === t ? 4 : 0, a.input = "string" == typeof e ? l.string2buf(e) : e, a.next_in = 0, a.avail_in = a.input.length;
                do {
                    if (0 === a.avail_out && (a.output = new o.Buf8(s), a.next_out = 0, a.avail_out = s), 1 !== (r = i.deflate(a, n)) && 0 !== r) return this.onEnd(r), !(this.ended = !0);
                    (0 === a.avail_out || 0 === a.avail_in && 4 === n) && ("string" === this.options.to ? this.onData(l.buf2binstring(o.shrinkBuf(a.output, a.next_out))) : this.onData(o.shrinkBuf(a.output, a.next_out)))
                } while ((0 < a.avail_in || 0 === a.avail_out) && 1 !== r);
                return 4 !== n || (r = i.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, 0 === r)
            }, s.prototype.onData = function (e) {
                this.chunks.push(e)
            }, s.prototype.onEnd = function (e) {
                0 === e && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
            }, r.Deflate = s, r.deflate = c, r.deflateRaw = function (e, t) {
                return (t = t || {}).raw = !0, c(e, t)
            }, r.gzip = function (e, t) {
                return (t = t || {}).gzip = !0, c(e, t)
            }
        }, {
            "./utils/common": 27,
            "./utils/strings": 28,
            "./zlib/deflate.js": 32,
            "./zlib/messages": 37,
            "./zlib/zstream": 39
        }],
        26: [function (e, t, r) {
            "use strict";
            var c = e("./zlib/inflate.js"), f = e("./utils/common"), h = e("./utils/strings"),
                u = e("./zlib/constants"), n = e("./zlib/messages"), a = e("./zlib/zstream"), s = e("./zlib/gzheader"),
                i = function (e) {
                    this.options = f.assign({chunkSize: 16384, windowBits: 0, to: ""}, e || {});
                    var t = this.options;
                    t.raw && 0 <= t.windowBits && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(0 <= t.windowBits && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), 15 < t.windowBits && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new a, this.strm.avail_out = 0;
                    var r = c.inflateInit2(this.strm, t.windowBits);
                    if (r !== u.Z_OK) throw new Error(n[r]);
                    this.header = new s, c.inflateGetHeader(this.strm, this.header)
                };

            function o(e, t) {
                var r = new i(t);
                if (r.push(e, !0), r.err) throw r.msg;
                return r.result
            }

            i.prototype.push = function (e, t) {
                var r, n, a, s, i, o = this.strm, l = this.options.chunkSize;
                if (this.ended) return !1;
                n = t === ~~t ? t : !0 === t ? u.Z_FINISH : u.Z_NO_FLUSH, o.input = "string" == typeof e ? h.binstring2buf(e) : e, o.next_in = 0, o.avail_in = o.input.length;
                do {
                    if (0 === o.avail_out && (o.output = new f.Buf8(l), o.next_out = 0, o.avail_out = l), (r = c.inflate(o, u.Z_NO_FLUSH)) !== u.Z_STREAM_END && r !== u.Z_OK) return this.onEnd(r), !(this.ended = !0);
                    o.next_out && (0 === o.avail_out || r === u.Z_STREAM_END || 0 === o.avail_in && n === u.Z_FINISH) && ("string" === this.options.to ? (a = h.utf8border(o.output, o.next_out), s = o.next_out - a, i = h.buf2string(o.output, a), o.next_out = s, o.avail_out = l - s, s && f.arraySet(o.output, o.output, a, s, 0), this.onData(i)) : this.onData(f.shrinkBuf(o.output, o.next_out)))
                } while (0 < o.avail_in && r !== u.Z_STREAM_END);
                return r === u.Z_STREAM_END && (n = u.Z_FINISH), n !== u.Z_FINISH || (r = c.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === u.Z_OK)
            }, i.prototype.onData = function (e) {
                this.chunks.push(e)
            }, i.prototype.onEnd = function (e) {
                e === u.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = f.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
            }, r.Inflate = i, r.inflate = o, r.inflateRaw = function (e, t) {
                return (t = t || {}).raw = !0, o(e, t)
            }, r.ungzip = o
        }, {
            "./utils/common": 27,
            "./utils/strings": 28,
            "./zlib/constants": 30,
            "./zlib/gzheader": 33,
            "./zlib/inflate.js": 35,
            "./zlib/messages": 37,
            "./zlib/zstream": 39
        }],
        27: [function (e, t, r) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            r.assign = function (e) {
                for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
                    var r = t.shift();
                    if (r) {
                        if ("object" != typeof r) throw new TypeError(r + "must be non-object");
                        for (var n in r) r.hasOwnProperty(n) && (e[n] = r[n])
                    }
                }
                return e
            }, r.shrinkBuf = function (e, t) {
                return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e)
            };
            var a = {
                arraySet: function (e, t, r, n, a) {
                    if (t.subarray && e.subarray) e.set(t.subarray(r, r + n), a); else for (var s = 0; s < n; s++) e[a + s] = t[r + s]
                }, flattenChunks: function (e) {
                    var t, r, n, a, s, i;
                    for (t = n = 0, r = e.length; t < r; t++) n += e[t].length;
                    for (i = new Uint8Array(n), t = a = 0, r = e.length; t < r; t++) s = e[t], i.set(s, a), a += s.length;
                    return i
                }
            }, s = {
                arraySet: function (e, t, r, n, a) {
                    for (var s = 0; s < n; s++) e[a + s] = t[r + s]
                }, flattenChunks: function (e) {
                    return [].concat.apply([], e)
                }
            };
            r.setTyped = function (e) {
                e ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, a)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s))
            }, r.setTyped(n)
        }, {}],
        28: [function (e, t, r) {
            "use strict";
            var l = e("./common"), a = !0, s = !0;
            try {
                String.fromCharCode.apply(null, [0])
            } catch (e) {
                a = !1
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1))
            } catch (e) {
                s = !1
            }
            for (var c = new l.Buf8(256), n = 0; n < 256; n++) c[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;

            function f(e, t) {
                if (t < 65537 && (e.subarray && s || !e.subarray && a)) return String.fromCharCode.apply(null, l.shrinkBuf(e, t));
                for (var r = "", n = 0; n < t; n++) r += String.fromCharCode(e[n]);
                return r
            }

            c[254] = c[254] = 1, r.string2buf = function (e) {
                var t, r, n, a, s, i = e.length, o = 0;
                for (a = 0; a < i; a++) 55296 == (64512 & (r = e.charCodeAt(a))) && a + 1 < i && 56320 == (64512 & (n = e.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
                for (t = new l.Buf8(o), a = s = 0; s < o; a++) 55296 == (64512 & (r = e.charCodeAt(a))) && a + 1 < i && 56320 == (64512 & (n = e.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
                return t
            }, r.buf2binstring = function (e) {
                return f(e, e.length)
            }, r.binstring2buf = function (e) {
                for (var t = new l.Buf8(e.length), r = 0, n = t.length; r < n; r++) t[r] = e.charCodeAt(r);
                return t
            }, r.buf2string = function (e, t) {
                var r, n, a, s, i = t || e.length, o = new Array(2 * i);
                for (r = n = 0; r < i;) if ((a = e[r++]) < 128) o[n++] = a; else if (4 < (s = c[a])) o[n++] = 65533, r += s - 1; else {
                    for (a &= 2 === s ? 31 : 3 === s ? 15 : 7; 1 < s && r < i;) a = a << 6 | 63 & e[r++], s--;
                    1 < s ? o[n++] = 65533 : a < 65536 ? o[n++] = a : (a -= 65536, o[n++] = 55296 | a >> 10 & 1023, o[n++] = 56320 | 1023 & a)
                }
                return f(o, n)
            }, r.utf8border = function (e, t) {
                var r;
                for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) r--;
                return !(r < 0) && 0 !== r && r + c[e[r]] > t ? r : t
            }
        }, {"./common": 27}],
        29: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t, r, n) {
                for (var a = 65535 & e | 0, s = e >>> 16 & 65535 | 0, i = 0; 0 !== r;) {
                    for (r -= i = 2e3 < r ? 2e3 : r; s = s + (a = a + t[n++] | 0) | 0, --i;) ;
                    a %= 65521, s %= 65521
                }
                return a | s << 16 | 0
            }
        }, {}],
        30: [function (e, t, r) {
            t.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            }
        }, {}],
        31: [function (e, t, r) {
            "use strict";
            var o = function () {
                for (var e, t = [], r = 0; r < 256; r++) {
                    e = r;
                    for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                    t[r] = e
                }
                return t
            }();
            t.exports = function (e, t, r, n) {
                var a = o, s = n + r;
                e ^= -1;
                for (var i = n; i < s; i++) e = e >>> 8 ^ a[255 & (e ^ t[i])];
                return -1 ^ e
            }
        }, {}],
        32: [function (e, t, r) {
            "use strict";
            var u = e("../utils/common"), l = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"),
                c = 0, f = 4, h = 0, m = -2, g = -1, b = 4, a = 2, v = 8, E = 9, s = 286, i = 30, o = 19, w = 2 * s + 1,
                S = 15, _ = 3, y = 258, C = y + _ + 1, B = 42, T = 113, k = 1, x = 2, A = 3, I = 4;

            function R(e, t) {
                return e.msg = n[t], t
            }

            function O(e) {
                return (e << 1) - (4 < e ? 9 : 0)
            }

            function F(e) {
                for (var t = e.length; 0 <= --t;) e[t] = 0
            }

            function D(e) {
                var t = e.state, r = t.pending;
                r > e.avail_out && (r = e.avail_out), 0 !== r && (u.arraySet(e.output, t.pending_buf, t.pending_out, r, e.next_out), e.next_out += r, t.pending_out += r, e.total_out += r, e.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0))
            }

            function P(e, t) {
                l._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, D(e.strm)
            }

            function N(e, t) {
                e.pending_buf[e.pending++] = t
            }

            function L(e, t) {
                e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t
            }

            function M(e, t) {
                var r, n, a = e.max_chain_length, s = e.strstart, i = e.prev_length, o = e.nice_match,
                    l = e.strstart > e.w_size - C ? e.strstart - (e.w_size - C) : 0, c = e.window, f = e.w_mask,
                    h = e.prev, u = e.strstart + y, d = c[s + i - 1], p = c[s + i];
                e.prev_length >= e.good_match && (a >>= 2), o > e.lookahead && (o = e.lookahead);
                do {
                    if (c[(r = t) + i] === p && c[r + i - 1] === d && c[r] === c[s] && c[++r] === c[s + 1]) {
                        s += 2, r++;
                        do {
                        } while (c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && s < u);
                        if (n = y - (u - s), s = u - y, i < n) {
                            if (e.match_start = t, o <= (i = n)) break;
                            d = c[s + i - 1], p = c[s + i]
                        }
                    }
                } while ((t = h[t & f]) > l && 0 != --a);
                return i <= e.lookahead ? i : e.lookahead
            }

            function U(e) {
                var t, r, n, a, s, i, o, l, c, f, h = e.w_size;
                do {
                    if (a = e.window_size - e.lookahead - e.strstart, e.strstart >= h + (h - C)) {
                        for (u.arraySet(e.window, e.window, h, h, 0), e.match_start -= h, e.strstart -= h, e.block_start -= h, t = r = e.hash_size; n = e.head[--t], e.head[t] = h <= n ? n - h : 0, --r;) ;
                        for (t = r = h; n = e.prev[--t], e.prev[t] = h <= n ? n - h : 0, --r;) ;
                        a += h
                    }
                    if (0 === e.strm.avail_in) break;
                    if (i = e.strm, o = e.window, l = e.strstart + e.lookahead, c = a, f = void 0, f = i.avail_in, c < f && (f = c), r = 0 === f ? 0 : (i.avail_in -= f, u.arraySet(o, i.input, i.next_in, f, l), 1 === i.state.wrap ? i.adler = d(i.adler, o, f, l) : 2 === i.state.wrap && (i.adler = p(i.adler, o, f, l)), i.next_in += f, i.total_in += f, f), e.lookahead += r, e.lookahead + e.insert >= _) for (s = e.strstart - e.insert, e.ins_h = e.window[s], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + _ - 1]) & e.hash_mask, e.prev[s & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = s, s++, e.insert--, !(e.lookahead + e.insert < _));) ;
                } while (e.lookahead < C && 0 !== e.strm.avail_in)
            }

            function H(e, t) {
                for (var r, n; ;) {
                    if (e.lookahead < C) {
                        if (U(e), e.lookahead < C && t === c) return k;
                        if (0 === e.lookahead) break
                    }
                    if (r = 0, e.lookahead >= _ && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + _ - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== r && e.strstart - r <= e.w_size - C && (e.match_length = M(e, r)), e.match_length >= _) if (n = l._tr_tally(e, e.strstart - e.match_start, e.match_length - _), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= _) {
                        for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + _ - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, 0 != --e.match_length;) ;
                        e.strstart++
                    } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask; else n = l._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
                    if (n && (P(e, !1), 0 === e.strm.avail_out)) return k
                }
                return e.insert = e.strstart < _ - 1 ? e.strstart : _ - 1, t === f ? (P(e, !0), 0 === e.strm.avail_out ? A : I) : e.last_lit && (P(e, !1), 0 === e.strm.avail_out) ? k : x
            }

            function z(e, t) {
                for (var r, n, a; ;) {
                    if (e.lookahead < C) {
                        if (U(e), e.lookahead < C && t === c) return k;
                        if (0 === e.lookahead) break
                    }
                    if (r = 0, e.lookahead >= _ && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + _ - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = _ - 1, 0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - C && (e.match_length = M(e, r), e.match_length <= 5 && (1 === e.strategy || e.match_length === _ && 4096 < e.strstart - e.match_start) && (e.match_length = _ - 1)), e.prev_length >= _ && e.match_length <= e.prev_length) {
                        for (a = e.strstart + e.lookahead - _, n = l._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - _), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= a && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + _ - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 != --e.prev_length;) ;
                        if (e.match_available = 0, e.match_length = _ - 1, e.strstart++, n && (P(e, !1), 0 === e.strm.avail_out)) return k
                    } else if (e.match_available) {
                        if ((n = l._tr_tally(e, 0, e.window[e.strstart - 1])) && P(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return k
                    } else e.match_available = 1, e.strstart++, e.lookahead--
                }
                return e.match_available && (n = l._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < _ - 1 ? e.strstart : _ - 1, t === f ? (P(e, !0), 0 === e.strm.avail_out ? A : I) : e.last_lit && (P(e, !1), 0 === e.strm.avail_out) ? k : x
            }

            function V(e, t, r, n, a) {
                this.good_length = e, this.max_lazy = t, this.nice_length = r, this.max_chain = n, this.func = a
            }

            var W;

            function X() {
                this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new u.Buf16(2 * w), this.dyn_dtree = new u.Buf16(2 * (2 * i + 1)), this.bl_tree = new u.Buf16(2 * (2 * o + 1)), F(this.dyn_ltree), F(this.dyn_dtree), F(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new u.Buf16(S + 1), this.heap = new u.Buf16(2 * s + 1), F(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new u.Buf16(2 * s + 1), F(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
            }

            function j(e) {
                var t;
                return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = a, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? B : T, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = c, l._tr_init(t), h) : R(e, m)
            }

            function G(e) {
                var t, r = j(e);
                return r === h && ((t = e.state).window_size = 2 * t.w_size, F(t.head), t.max_lazy_match = W[t.level].max_lazy, t.good_match = W[t.level].good_length, t.nice_match = W[t.level].nice_length, t.max_chain_length = W[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = _ - 1, t.match_available = 0, t.ins_h = 0), r
            }

            function $(e, t, r, n, a, s) {
                if (!e) return m;
                var i = 1;
                if (t === g && (t = 6), n < 0 ? (i = 0, n = -n) : 15 < n && (i = 2, n -= 16), a < 1 || E < a || r !== v || n < 8 || 15 < n || t < 0 || 9 < t || s < 0 || b < s) return R(e, m);
                8 === n && (n = 9);
                var o = new X;
                return (e.state = o).strm = e, o.wrap = i, o.gzhead = null, o.w_bits = n, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = a + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + _ - 1) / _), o.window = new u.Buf8(2 * o.w_size), o.head = new u.Buf16(o.hash_size), o.prev = new u.Buf16(o.w_size), o.lit_bufsize = 1 << a + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new u.Buf8(o.pending_buf_size), o.d_buf = o.lit_bufsize >> 1, o.l_buf = 3 * o.lit_bufsize, o.level = t, o.strategy = s, o.method = r, G(e)
            }

            W = [new V(0, 0, 0, 0, function (e, t) {
                var r = 65535;
                for (r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5); ;) {
                    if (e.lookahead <= 1) {
                        if (U(e), 0 === e.lookahead && t === c) return k;
                        if (0 === e.lookahead) break
                    }
                    e.strstart += e.lookahead, e.lookahead = 0;
                    var n = e.block_start + r;
                    if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, P(e, !1), 0 === e.strm.avail_out)) return k;
                    if (e.strstart - e.block_start >= e.w_size - C && (P(e, !1), 0 === e.strm.avail_out)) return k
                }
                return e.insert = 0, t === f ? (P(e, !0), 0 === e.strm.avail_out ? A : I) : (e.strstart > e.block_start && (P(e, !1), e.strm.avail_out), k)
            }), new V(4, 4, 8, 4, H), new V(4, 5, 16, 8, H), new V(4, 6, 32, 32, H), new V(4, 4, 16, 16, z), new V(8, 16, 32, 32, z), new V(8, 16, 128, 128, z), new V(8, 32, 128, 256, z), new V(32, 128, 258, 1024, z), new V(32, 258, 258, 4096, z)], r.deflateInit = function (e, t) {
                return $(e, t, v, 15, 8, 0)
            }, r.deflateInit2 = $, r.deflateReset = G, r.deflateResetKeep = j, r.deflateSetHeader = function (e, t) {
                return !e || !e.state || 2 !== e.state.wrap ? m : (e.state.gzhead = t, h)
            }, r.deflate = function (e, t) {
                var r, n, a, s;
                if (!e || !e.state || 5 < t || t < 0) return e ? R(e, m) : m;
                if (n = e.state, !e.output || !e.input && 0 !== e.avail_in || 666 === n.status && t !== f) return R(e, 0 === e.avail_out ? -5 : m);
                if (n.strm = e, r = n.last_flush, n.last_flush = t, n.status === B) if (2 === n.wrap) e.adler = 0, N(n, 31), N(n, 139), N(n, 8), n.gzhead ? (N(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), N(n, 255 & n.gzhead.time), N(n, n.gzhead.time >> 8 & 255), N(n, n.gzhead.time >> 16 & 255), N(n, n.gzhead.time >> 24 & 255), N(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), N(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (N(n, 255 & n.gzhead.extra.length), N(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = p(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = 69) : (N(n, 0), N(n, 0), N(n, 0), N(n, 0), N(n, 0), N(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), N(n, 3), n.status = T); else {
                    var i = v + (n.w_bits - 8 << 4) << 8;
                    i |= (2 <= n.strategy || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6, 0 !== n.strstart && (i |= 32), i += 31 - i % 31, n.status = T, L(n, i), 0 !== n.strstart && (L(n, e.adler >>> 16), L(n, 65535 & e.adler)), e.adler = 1
                }
                if (69 === n.status) if (n.gzhead.extra) {
                    for (a = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > a && (e.adler = p(e.adler, n.pending_buf, n.pending - a, a)), D(e), a = n.pending, n.pending !== n.pending_buf_size));) N(n, 255 & n.gzhead.extra[n.gzindex]), n.gzindex++;
                    n.gzhead.hcrc && n.pending > a && (e.adler = p(e.adler, n.pending_buf, n.pending - a, a)), n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = 73)
                } else n.status = 73;
                if (73 === n.status) if (n.gzhead.name) {
                    a = n.pending;
                    do {
                        if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (e.adler = p(e.adler, n.pending_buf, n.pending - a, a)), D(e), a = n.pending, n.pending === n.pending_buf_size)) {
                            s = 1;
                            break
                        }
                        s = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, N(n, s)
                    } while (0 !== s);
                    n.gzhead.hcrc && n.pending > a && (e.adler = p(e.adler, n.pending_buf, n.pending - a, a)), 0 === s && (n.gzindex = 0, n.status = 91)
                } else n.status = 91;
                if (91 === n.status) if (n.gzhead.comment) {
                    a = n.pending;
                    do {
                        if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (e.adler = p(e.adler, n.pending_buf, n.pending - a, a)), D(e), a = n.pending, n.pending === n.pending_buf_size)) {
                            s = 1;
                            break
                        }
                        s = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, N(n, s)
                    } while (0 !== s);
                    n.gzhead.hcrc && n.pending > a && (e.adler = p(e.adler, n.pending_buf, n.pending - a, a)), 0 === s && (n.status = 103)
                } else n.status = 103;
                if (103 === n.status && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && D(e), n.pending + 2 <= n.pending_buf_size && (N(n, 255 & e.adler), N(n, e.adler >> 8 & 255), e.adler = 0, n.status = T)) : n.status = T), 0 !== n.pending) {
                    if (D(e), 0 === e.avail_out) return n.last_flush = -1, h
                } else if (0 === e.avail_in && O(t) <= O(r) && t !== f) return R(e, -5);
                if (666 === n.status && 0 !== e.avail_in) return R(e, -5);
                if (0 !== e.avail_in || 0 !== n.lookahead || t !== c && 666 !== n.status) {
                    var o = 2 === n.strategy ? function (e, t) {
                        for (var r; ;) {
                            if (0 === e.lookahead && (U(e), 0 === e.lookahead)) {
                                if (t === c) return k;
                                break
                            }
                            if (e.match_length = 0, r = l._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, r && (P(e, !1), 0 === e.strm.avail_out)) return k
                        }
                        return e.insert = 0, t === f ? (P(e, !0), 0 === e.strm.avail_out ? A : I) : e.last_lit && (P(e, !1), 0 === e.strm.avail_out) ? k : x
                    }(n, t) : 3 === n.strategy ? function (e, t) {
                        for (var r, n, a, s, i = e.window; ;) {
                            if (e.lookahead <= y) {
                                if (U(e), e.lookahead <= y && t === c) return k;
                                if (0 === e.lookahead) break
                            }
                            if (e.match_length = 0, e.lookahead >= _ && 0 < e.strstart && (n = i[a = e.strstart - 1]) === i[++a] && n === i[++a] && n === i[++a]) {
                                s = e.strstart + y;
                                do {
                                } while (n === i[++a] && n === i[++a] && n === i[++a] && n === i[++a] && n === i[++a] && n === i[++a] && n === i[++a] && n === i[++a] && a < s);
                                e.match_length = y - (s - a), e.match_length > e.lookahead && (e.match_length = e.lookahead)
                            }
                            if (e.match_length >= _ ? (r = l._tr_tally(e, 1, e.match_length - _), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (r = l._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), r && (P(e, !1), 0 === e.strm.avail_out)) return k
                        }
                        return e.insert = 0, t === f ? (P(e, !0), 0 === e.strm.avail_out ? A : I) : e.last_lit && (P(e, !1), 0 === e.strm.avail_out) ? k : x
                    }(n, t) : W[n.level].func(n, t);
                    if (o !== A && o !== I || (n.status = 666), o === k || o === A) return 0 === e.avail_out && (n.last_flush = -1), h;
                    if (o === x && (1 === t ? l._tr_align(n) : 5 !== t && (l._tr_stored_block(n, 0, 0, !1), 3 === t && (F(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), D(e), 0 === e.avail_out)) return n.last_flush = -1, h
                }
                return t !== f ? h : n.wrap <= 0 ? 1 : (2 === n.wrap ? (N(n, 255 & e.adler), N(n, e.adler >> 8 & 255), N(n, e.adler >> 16 & 255), N(n, e.adler >> 24 & 255), N(n, 255 & e.total_in), N(n, e.total_in >> 8 & 255), N(n, e.total_in >> 16 & 255), N(n, e.total_in >> 24 & 255)) : (L(n, e.adler >>> 16), L(n, 65535 & e.adler)), D(e), 0 < n.wrap && (n.wrap = -n.wrap), 0 !== n.pending ? h : 1)
            }, r.deflateEnd = function (e) {
                var t;
                return e && e.state ? (t = e.state.status) !== B && 69 !== t && 73 !== t && 91 !== t && 103 !== t && t !== T && 666 !== t ? R(e, m) : (e.state = null, t === T ? R(e, -3) : h) : m
            }, r.deflateInfo = "pako deflate (from Nodeca project)"
        }, {"../utils/common": 27, "./adler32": 29, "./crc32": 31, "./messages": 37, "./trees": 38}],
        33: [function (e, t, r) {
            "use strict";
            t.exports = function () {
                this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
            }
        }, {}],
        34: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) {
                var r, n, a, s, i, o, l, c, f, h, u, d, p, m, g, b, v, E, w, S, _, y, C, B, T;
                r = e.state, n = e.next_in, B = e.input, a = n + (e.avail_in - 5), s = e.next_out, T = e.output, i = s - (t - e.avail_out), o = s + (e.avail_out - 257), l = r.dmax, c = r.wsize, f = r.whave, h = r.wnext, u = r.window, d = r.hold, p = r.bits, m = r.lencode, g = r.distcode, b = (1 << r.lenbits) - 1, v = (1 << r.distbits) - 1;
                e:do {
                    p < 15 && (d += B[n++] << p, p += 8, d += B[n++] << p, p += 8), E = m[d & b];
                    t:for (; ;) {
                        if (d >>>= w = E >>> 24, p -= w, 0 === (w = E >>> 16 & 255)) T[s++] = 65535 & E; else {
                            if (!(16 & w)) {
                                if (0 == (64 & w)) {
                                    E = m[(65535 & E) + (d & (1 << w) - 1)];
                                    continue t
                                }
                                if (32 & w) {
                                    r.mode = 12;
                                    break e
                                }
                                e.msg = "invalid literal/length code", r.mode = 30;
                                break e
                            }
                            S = 65535 & E, (w &= 15) && (p < w && (d += B[n++] << p, p += 8), S += d & (1 << w) - 1, d >>>= w, p -= w), p < 15 && (d += B[n++] << p, p += 8, d += B[n++] << p, p += 8), E = g[d & v];
                            r:for (; ;) {
                                if (d >>>= w = E >>> 24, p -= w, !(16 & (w = E >>> 16 & 255))) {
                                    if (0 == (64 & w)) {
                                        E = g[(65535 & E) + (d & (1 << w) - 1)];
                                        continue r
                                    }
                                    e.msg = "invalid distance code", r.mode = 30;
                                    break e
                                }
                                if (_ = 65535 & E, p < (w &= 15) && (d += B[n++] << p, (p += 8) < w && (d += B[n++] << p, p += 8)), l < (_ += d & (1 << w) - 1)) {
                                    e.msg = "invalid distance too far back", r.mode = 30;
                                    break e
                                }
                                if (d >>>= w, p -= w, (w = s - i) < _) {
                                    if (f < (w = _ - w) && r.sane) {
                                        e.msg = "invalid distance too far back", r.mode = 30;
                                        break e
                                    }
                                    if (C = u, (y = 0) === h) {
                                        if (y += c - w, w < S) {
                                            for (S -= w; T[s++] = u[y++], --w;) ;
                                            y = s - _, C = T
                                        }
                                    } else if (h < w) {
                                        if (y += c + h - w, (w -= h) < S) {
                                            for (S -= w; T[s++] = u[y++], --w;) ;
                                            if (y = 0, h < S) {
                                                for (S -= w = h; T[s++] = u[y++], --w;) ;
                                                y = s - _, C = T
                                            }
                                        }
                                    } else if (y += h - w, w < S) {
                                        for (S -= w; T[s++] = u[y++], --w;) ;
                                        y = s - _, C = T
                                    }
                                    for (; 2 < S;) T[s++] = C[y++], T[s++] = C[y++], T[s++] = C[y++], S -= 3;
                                    S && (T[s++] = C[y++], 1 < S && (T[s++] = C[y++]))
                                } else {
                                    for (y = s - _; T[s++] = T[y++], T[s++] = T[y++], T[s++] = T[y++], 2 < (S -= 3);) ;
                                    S && (T[s++] = T[y++], 1 < S && (T[s++] = T[y++]))
                                }
                                break
                            }
                        }
                        break
                    }
                } while (n < a && s < o);
                n -= S = p >> 3, d &= (1 << (p -= S << 3)) - 1, e.next_in = n, e.next_out = s, e.avail_in = n < a ? a - n + 5 : 5 - (n - a), e.avail_out = s < o ? o - s + 257 : 257 - (s - o), r.hold = d, r.bits = p
            }
        }, {}],
        35: [function (e, t, r) {
            "use strict";
            var P = e("../utils/common"), N = e("./adler32"), L = e("./crc32"), M = e("./inffast"), U = e("./inftrees"),
                H = 1, z = 2, V = 0, W = -2, X = 1, n = 852, a = 592;

            function j(e) {
                return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24)
            }

            function s() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new P.Buf16(320), this.work = new P.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
            }

            function i(e) {
                var t;
                return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = X, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new P.Buf32(n), t.distcode = t.distdyn = new P.Buf32(a), t.sane = 1, t.back = -1, V) : W
            }

            function o(e) {
                var t;
                return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, i(e)) : W
            }

            function l(e, t) {
                var r, n;
                return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || 15 < t) ? W : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, o(e))) : W
            }

            function c(e, t) {
                var r, n;
                return e ? (n = new s, (e.state = n).window = null, (r = l(e, t)) !== V && (e.state = null), r) : W
            }

            var f, h, u = !0;

            function G(e) {
                if (u) {
                    var t;
                    for (f = new P.Buf32(512), h = new P.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8;
                    for (; t < 256;) e.lens[t++] = 9;
                    for (; t < 280;) e.lens[t++] = 7;
                    for (; t < 288;) e.lens[t++] = 8;
                    for (U(H, e.lens, 0, 288, f, 0, e.work, {bits: 9}), t = 0; t < 32;) e.lens[t++] = 5;
                    U(z, e.lens, 0, 32, h, 0, e.work, {bits: 5}), u = !1
                }
                e.lencode = f, e.lenbits = 9, e.distcode = h, e.distbits = 5
            }

            r.inflateReset = o, r.inflateReset2 = l, r.inflateResetKeep = i, r.inflateInit = function (e) {
                return c(e, 15)
            }, r.inflateInit2 = c, r.inflate = function (e, t) {
                var r, n, a, s, i, o, l, c, f, h, u, d, p, m, g, b, v, E, w, S, _, y, C, B, T, k, x, A, I, R, O = 0,
                    F = new P.Buf8(4), D = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return W;
                12 === (r = e.state).mode && (r.mode = 13), i = e.next_out, a = e.output, l = e.avail_out, s = e.next_in, n = e.input, o = e.avail_in, c = r.hold, f = r.bits, h = o, u = l, y = V;
                e:for (; ;) switch (r.mode) {
                    case X:
                        if (0 === r.wrap) {
                            r.mode = 13;
                            break
                        }
                        for (; f < 16;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        if (2 & r.wrap && 35615 === c) {
                            F[r.check = 0] = 255 & c, F[1] = c >>> 8 & 255, r.check = L(r.check, F, 2, 0), f = c = 0, r.mode = 2;
                            break
                        }
                        if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & c) << 8) + (c >> 8)) % 31) {
                            e.msg = "incorrect header check", r.mode = 30;
                            break
                        }
                        if (8 != (15 & c)) {
                            e.msg = "unknown compression method", r.mode = 30;
                            break
                        }
                        if (f -= 4, _ = 8 + (15 & (c >>>= 4)), 0 === r.wbits) r.wbits = _; else if (_ > r.wbits) {
                            e.msg = "invalid window size", r.mode = 30;
                            break
                        }
                        r.dmax = 1 << _, e.adler = r.check = 1, r.mode = 512 & c ? 10 : 12, f = c = 0;
                        break;
                    case 2:
                        for (; f < 16;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        if (r.flags = c, 8 != (255 & r.flags)) {
                            e.msg = "unknown compression method", r.mode = 30;
                            break
                        }
                        if (57344 & r.flags) {
                            e.msg = "unknown header flags set", r.mode = 30;
                            break
                        }
                        r.head && (r.head.text = c >> 8 & 1), 512 & r.flags && (F[0] = 255 & c, F[1] = c >>> 8 & 255, r.check = L(r.check, F, 2, 0)), f = c = 0, r.mode = 3;
                    case 3:
                        for (; f < 32;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        r.head && (r.head.time = c), 512 & r.flags && (F[0] = 255 & c, F[1] = c >>> 8 & 255, F[2] = c >>> 16 & 255, F[3] = c >>> 24 & 255, r.check = L(r.check, F, 4, 0)), f = c = 0, r.mode = 4;
                    case 4:
                        for (; f < 16;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        r.head && (r.head.xflags = 255 & c, r.head.os = c >> 8), 512 & r.flags && (F[0] = 255 & c, F[1] = c >>> 8 & 255, r.check = L(r.check, F, 2, 0)), f = c = 0, r.mode = 5;
                    case 5:
                        if (1024 & r.flags) {
                            for (; f < 16;) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            r.length = c, r.head && (r.head.extra_len = c), 512 & r.flags && (F[0] = 255 & c, F[1] = c >>> 8 & 255, r.check = L(r.check, F, 2, 0)), f = c = 0
                        } else r.head && (r.head.extra = null);
                        r.mode = 6;
                    case 6:
                        if (1024 & r.flags && (o < (d = r.length) && (d = o), d && (r.head && (_ = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), P.arraySet(r.head.extra, n, s, d, _)), 512 & r.flags && (r.check = L(r.check, n, d, s)), o -= d, s += d, r.length -= d), r.length)) break e;
                        r.length = 0, r.mode = 7;
                    case 7:
                        if (2048 & r.flags) {
                            if (0 === o) break e;
                            for (d = 0; _ = n[s + d++], r.head && _ && r.length < 65536 && (r.head.name += String.fromCharCode(_)), _ && d < o;) ;
                            if (512 & r.flags && (r.check = L(r.check, n, d, s)), o -= d, s += d, _) break e
                        } else r.head && (r.head.name = null);
                        r.length = 0, r.mode = 8;
                    case 8:
                        if (4096 & r.flags) {
                            if (0 === o) break e;
                            for (d = 0; _ = n[s + d++], r.head && _ && r.length < 65536 && (r.head.comment += String.fromCharCode(_)), _ && d < o;) ;
                            if (512 & r.flags && (r.check = L(r.check, n, d, s)), o -= d, s += d, _) break e
                        } else r.head && (r.head.comment = null);
                        r.mode = 9;
                    case 9:
                        if (512 & r.flags) {
                            for (; f < 16;) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            if (c !== (65535 & r.check)) {
                                e.msg = "header crc mismatch", r.mode = 30;
                                break
                            }
                            f = c = 0
                        }
                        r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = 12;
                        break;
                    case 10:
                        for (; f < 32;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        e.adler = r.check = j(c), f = c = 0, r.mode = 11;
                    case 11:
                        if (0 === r.havedict) return e.next_out = i, e.avail_out = l, e.next_in = s, e.avail_in = o, r.hold = c, r.bits = f, 2;
                        e.adler = r.check = 1, r.mode = 12;
                    case 12:
                        if (5 === t || 6 === t) break e;
                    case 13:
                        if (r.last) {
                            c >>>= 7 & f, f -= 7 & f, r.mode = 27;
                            break
                        }
                        for (; f < 3;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        switch (r.last = 1 & c, --f, 3 & (c >>>= 1)) {
                            case 0:
                                r.mode = 14;
                                break;
                            case 1:
                                if (G(r), r.mode = 20, 6 !== t) break;
                                c >>>= 2, f -= 2;
                                break e;
                            case 2:
                                r.mode = 17;
                                break;
                            case 3:
                                e.msg = "invalid block type", r.mode = 30
                        }
                        c >>>= 2, f -= 2;
                        break;
                    case 14:
                        for (c >>>= 7 & f, f -= 7 & f; f < 32;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        if ((65535 & c) != (c >>> 16 ^ 65535)) {
                            e.msg = "invalid stored block lengths", r.mode = 30;
                            break
                        }
                        if (r.length = 65535 & c, f = c = 0, r.mode = 15, 6 === t) break e;
                    case 15:
                        r.mode = 16;
                    case 16:
                        if (d = r.length) {
                            if (o < d && (d = o), l < d && (d = l), 0 === d) break e;
                            P.arraySet(a, n, s, d, i), o -= d, s += d, l -= d, i += d, r.length -= d;
                            break
                        }
                        r.mode = 12;
                        break;
                    case 17:
                        for (; f < 14;) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        if (r.nlen = 257 + (31 & c), c >>>= 5, f -= 5, r.ndist = 1 + (31 & c), c >>>= 5, f -= 5, r.ncode = 4 + (15 & c), c >>>= 4, f -= 4, 286 < r.nlen || 30 < r.ndist) {
                            e.msg = "too many length or distance symbols", r.mode = 30;
                            break
                        }
                        r.have = 0, r.mode = 18;
                    case 18:
                        for (; r.have < r.ncode;) {
                            for (; f < 3;) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            r.lens[D[r.have++]] = 7 & c, c >>>= 3, f -= 3
                        }
                        for (; r.have < 19;) r.lens[D[r.have++]] = 0;
                        if (r.lencode = r.lendyn, r.lenbits = 7, C = {bits: r.lenbits}, y = U(0, r.lens, 0, 19, r.lencode, 0, r.work, C), r.lenbits = C.bits, y) {
                            e.msg = "invalid code lengths set", r.mode = 30;
                            break
                        }
                        r.have = 0, r.mode = 19;
                    case 19:
                        for (; r.have < r.nlen + r.ndist;) {
                            for (; b = (O = r.lencode[c & (1 << r.lenbits) - 1]) >>> 16 & 255, v = 65535 & O, !((g = O >>> 24) <= f);) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            if (v < 16) c >>>= g, f -= g, r.lens[r.have++] = v; else {
                                if (16 === v) {
                                    for (B = g + 2; f < B;) {
                                        if (0 === o) break e;
                                        o--, c += n[s++] << f, f += 8
                                    }
                                    if (c >>>= g, f -= g, 0 === r.have) {
                                        e.msg = "invalid bit length repeat", r.mode = 30;
                                        break
                                    }
                                    _ = r.lens[r.have - 1], d = 3 + (3 & c), c >>>= 2, f -= 2
                                } else if (17 === v) {
                                    for (B = g + 3; f < B;) {
                                        if (0 === o) break e;
                                        o--, c += n[s++] << f, f += 8
                                    }
                                    f -= g, _ = 0, d = 3 + (7 & (c >>>= g)), c >>>= 3, f -= 3
                                } else {
                                    for (B = g + 7; f < B;) {
                                        if (0 === o) break e;
                                        o--, c += n[s++] << f, f += 8
                                    }
                                    f -= g, _ = 0, d = 11 + (127 & (c >>>= g)), c >>>= 7, f -= 7
                                }
                                if (r.have + d > r.nlen + r.ndist) {
                                    e.msg = "invalid bit length repeat", r.mode = 30;
                                    break
                                }
                                for (; d--;) r.lens[r.have++] = _
                            }
                        }
                        if (30 === r.mode) break;
                        if (0 === r.lens[256]) {
                            e.msg = "invalid code -- missing end-of-block", r.mode = 30;
                            break
                        }
                        if (r.lenbits = 9, C = {bits: r.lenbits}, y = U(H, r.lens, 0, r.nlen, r.lencode, 0, r.work, C), r.lenbits = C.bits, y) {
                            e.msg = "invalid literal/lengths set", r.mode = 30;
                            break
                        }
                        if (r.distbits = 6, r.distcode = r.distdyn, C = {bits: r.distbits}, y = U(z, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, C), r.distbits = C.bits, y) {
                            e.msg = "invalid distances set", r.mode = 30;
                            break
                        }
                        if (r.mode = 20, 6 === t) break e;
                    case 20:
                        r.mode = 21;
                    case 21:
                        if (6 <= o && 258 <= l) {
                            e.next_out = i, e.avail_out = l, e.next_in = s, e.avail_in = o, r.hold = c, r.bits = f, M(e, u), i = e.next_out, a = e.output, l = e.avail_out, s = e.next_in, n = e.input, o = e.avail_in, c = r.hold, f = r.bits, 12 === r.mode && (r.back = -1);
                            break
                        }
                        for (r.back = 0; b = (O = r.lencode[c & (1 << r.lenbits) - 1]) >>> 16 & 255, v = 65535 & O, !((g = O >>> 24) <= f);) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        if (b && 0 == (240 & b)) {
                            for (E = g, w = b, S = v; b = (O = r.lencode[S + ((c & (1 << E + w) - 1) >> E)]) >>> 16 & 255, v = 65535 & O, !(E + (g = O >>> 24) <= f);) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            c >>>= E, f -= E, r.back += E
                        }
                        if (c >>>= g, f -= g, r.back += g, r.length = v, 0 === b) {
                            r.mode = 26;
                            break
                        }
                        if (32 & b) {
                            r.back = -1, r.mode = 12;
                            break
                        }
                        if (64 & b) {
                            e.msg = "invalid literal/length code", r.mode = 30;
                            break
                        }
                        r.extra = 15 & b, r.mode = 22;
                    case 22:
                        if (r.extra) {
                            for (B = r.extra; f < B;) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            r.length += c & (1 << r.extra) - 1, c >>>= r.extra, f -= r.extra, r.back += r.extra
                        }
                        r.was = r.length, r.mode = 23;
                    case 23:
                        for (; b = (O = r.distcode[c & (1 << r.distbits) - 1]) >>> 16 & 255, v = 65535 & O, !((g = O >>> 24) <= f);) {
                            if (0 === o) break e;
                            o--, c += n[s++] << f, f += 8
                        }
                        if (0 == (240 & b)) {
                            for (E = g, w = b, S = v; b = (O = r.distcode[S + ((c & (1 << E + w) - 1) >> E)]) >>> 16 & 255, v = 65535 & O, !(E + (g = O >>> 24) <= f);) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            c >>>= E, f -= E, r.back += E
                        }
                        if (c >>>= g, f -= g, r.back += g, 64 & b) {
                            e.msg = "invalid distance code", r.mode = 30;
                            break
                        }
                        r.offset = v, r.extra = 15 & b, r.mode = 24;
                    case 24:
                        if (r.extra) {
                            for (B = r.extra; f < B;) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            r.offset += c & (1 << r.extra) - 1, c >>>= r.extra, f -= r.extra, r.back += r.extra
                        }
                        if (r.offset > r.dmax) {
                            e.msg = "invalid distance too far back", r.mode = 30;
                            break
                        }
                        r.mode = 25;
                    case 25:
                        if (0 === l) break e;
                        if (d = u - l, r.offset > d) {
                            if ((d = r.offset - d) > r.whave && r.sane) {
                                e.msg = "invalid distance too far back", r.mode = 30;
                                break
                            }
                            p = d > r.wnext ? (d -= r.wnext, r.wsize - d) : r.wnext - d, d > r.length && (d = r.length), m = r.window
                        } else m = a, p = i - r.offset, d = r.length;
                        for (l < d && (d = l), l -= d, r.length -= d; a[i++] = m[p++], --d;) ;
                        0 === r.length && (r.mode = 21);
                        break;
                    case 26:
                        if (0 === l) break e;
                        a[i++] = r.length, l--, r.mode = 21;
                        break;
                    case 27:
                        if (r.wrap) {
                            for (; f < 32;) {
                                if (0 === o) break e;
                                o--, c |= n[s++] << f, f += 8
                            }
                            if (u -= l, e.total_out += u, r.total += u, u && (e.adler = r.check = (r.flags ? L : N)(r.check, a, u, i - u)), u = l, (r.flags ? c : j(c)) !== r.check) {
                                e.msg = "incorrect data check", r.mode = 30;
                                break
                            }
                            f = c = 0
                        }
                        r.mode = 28;
                    case 28:
                        if (r.wrap && r.flags) {
                            for (; f < 32;) {
                                if (0 === o) break e;
                                o--, c += n[s++] << f, f += 8
                            }
                            if (c !== (4294967295 & r.total)) {
                                e.msg = "incorrect length check", r.mode = 30;
                                break
                            }
                            f = c = 0
                        }
                        r.mode = 29;
                    case 29:
                        y = 1;
                        break e;
                    case 30:
                        y = -3;
                        break e;
                    case 31:
                        return -4;
                    case 32:
                    default:
                        return W
                }
                return e.next_out = i, e.avail_out = l, e.next_in = s, e.avail_in = o, r.hold = c, r.bits = f, (r.wsize || u !== e.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== t)) && (k = (T = e).output, x = e.next_out, A = u - e.avail_out, null === (R = T.state).window && (R.wsize = 1 << R.wbits, R.wnext = 0, R.whave = 0, R.window = new P.Buf8(R.wsize)), void (A >= R.wsize ? (P.arraySet(R.window, k, x - R.wsize, R.wsize, 0), R.wnext = 0, R.whave = R.wsize) : (A < (I = R.wsize - R.wnext) && (I = A), P.arraySet(R.window, k, x - A, I, R.wnext), (A -= I) ? (P.arraySet(R.window, k, x - A, A, 0), R.wnext = A, R.whave = R.wsize) : (R.wnext += I, R.wnext === R.wsize && (R.wnext = 0), R.whave < R.wsize && (R.whave += I))))) ? (r.mode = 31, -4) : (h -= e.avail_in, u -= e.avail_out, e.total_in += h, e.total_out += u, r.total += u, r.wrap && u && (e.adler = r.check = (r.flags ? L : N)(r.check, a, u, e.next_out - u)), e.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0), (0 == h && 0 === u || 4 === t) && y === V && (y = -5), y)
            }, r.inflateEnd = function (e) {
                if (!e || !e.state) return W;
                var t = e.state;
                return t.window && (t.window = null), e.state = null, V
            }, r.inflateGetHeader = function (e, t) {
                var r;
                return !e || !e.state || 0 == (2 & (r = e.state).wrap) ? W : ((r.head = t).done = !1, V)
            }, r.inflateInfo = "pako inflate (from Nodeca project)"
        }, {"../utils/common": 27, "./adler32": 29, "./crc32": 31, "./inffast": 34, "./inftrees": 36}],
        36: [function (e, t, r) {
            "use strict";
            var D = e("../utils/common"),
                P = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                L = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                M = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            t.exports = function (e, t, r, n, a, s, i, o) {
                var l, c, f, h, u, d, p, m, g, b = o.bits, v = 0, E = 0, w = 0, S = 0, _ = 0, y = 0, C = 0, B = 0,
                    T = 0, k = 0, x = null, A = 0, I = new D.Buf16(16), R = new D.Buf16(16), O = null, F = 0;
                for (v = 0; v <= 15; v++) I[v] = 0;
                for (E = 0; E < n; E++) I[t[r + E]]++;
                for (_ = b, S = 15; 1 <= S && 0 === I[S]; S--) ;
                if (S < _ && (_ = S), 0 === S) return a[s++] = 20971520, a[s++] = 20971520, o.bits = 1, 0;
                for (w = 1; w < S && 0 === I[w]; w++) ;
                for (_ < w && (_ = w), v = B = 1; v <= 15; v++) if (B <<= 1, (B -= I[v]) < 0) return -1;
                if (0 < B && (0 === e || 1 !== S)) return -1;
                for (R[1] = 0, v = 1; v < 15; v++) R[v + 1] = R[v] + I[v];
                for (E = 0; E < n; E++) 0 !== t[r + E] && (i[R[t[r + E]]++] = E);
                if (d = 0 === e ? (x = O = i, 19) : 1 === e ? (x = P, A -= 257, O = N, F -= 257, 256) : (x = L, O = M, -1), v = w, u = s, f = -1, h = (T = 1 << (y = _)) - 1, 1 === e && 852 < T || 2 === e && 592 < T) return 1;
                for (C = E = k = 0; ;) {
                    for (p = v - C, g = i[E] < d ? (m = 0, i[E]) : i[E] > d ? (m = O[F + i[E]], x[A + i[E]]) : (m = 96, 0), l = 1 << v - C, w = c = 1 << y; a[u + (k >> C) + (c -= l)] = p << 24 | m << 16 | g | 0, 0 !== c;) ;
                    for (l = 1 << v - 1; k & l;) l >>= 1;
                    if (0 !== l ? (k &= l - 1, k += l) : k = 0, E++, 0 == --I[v]) {
                        if (v === S) break;
                        v = t[r + i[E]]
                    }
                    if (_ < v && (k & h) !== f) {
                        for (0 === C && (C = _), u += w, B = 1 << (y = v - C); y + C < S && !((B -= I[y + C]) <= 0);) y++, B <<= 1;
                        if (T += 1 << y, 1 === e && 852 < T || 2 === e && 592 < T) return 1;
                        a[f = k & h] = _ << 24 | y << 16 | u - s | 0
                    }
                }
                return 0 !== k && (a[u + k] = v - C << 24 | 64 << 16 | 0), o.bits = _, 0
            }
        }, {"../utils/common": 27}],
        37: [function (e, t, r) {
            "use strict";
            t.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }, {}],
        38: [function (e, t, r) {
            "use strict";
            var l = e("../utils/common"), o = 0, c = 1;

            function n(e) {
                for (var t = e.length; 0 <= --t;) e[t] = 0
            }

            var f = 0, i = 29, h = 256, u = h + 1 + i, d = 30, p = 19, g = 2 * u + 1, b = 15, a = 16, m = 7, v = 256,
                E = 16, w = 17, S = 18,
                _ = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                y = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                B = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], T = new Array(2 * (u + 2));
            n(T);
            var k = new Array(2 * d);
            n(k);
            var x = new Array(512);
            n(x);
            var A = new Array(256);
            n(A);
            var I = new Array(i);
            n(I);
            var R = new Array(d);
            n(R);

            function s(e, t) {
                this.dyn_tree = e, this.max_code = 0, this.stat_desc = t
            }

            var O, F, D, P = function (e, t, r, n, a) {
                this.static_tree = e, this.extra_bits = t, this.extra_base = r, this.elems = n, this.max_length = a, this.has_stree = e && e.length
            };

            function N(e) {
                return e < 256 ? x[e] : x[256 + (e >>> 7)]
            }

            function L(e, t) {
                e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255
            }

            function M(e, t, r) {
                e.bi_valid > a - r ? (e.bi_buf |= t << e.bi_valid & 65535, L(e, e.bi_buf), e.bi_buf = t >> a - e.bi_valid, e.bi_valid += r - a) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += r)
            }

            function U(e, t, r) {
                M(e, r[2 * t], r[2 * t + 1])
            }

            function H(e, t) {
                for (var r = 0; r |= 1 & e, e >>>= 1, r <<= 1, 0 < --t;) ;
                return r >>> 1
            }

            function z(e, t, r) {
                var n, a, s = new Array(b + 1), i = 0;
                for (n = 1; n <= b; n++) s[n] = i = i + r[n - 1] << 1;
                for (a = 0; a <= t; a++) {
                    var o = e[2 * a + 1];
                    0 !== o && (e[2 * a] = H(s[o]++, o))
                }
            }

            function V(e) {
                var t;
                for (t = 0; t < u; t++) e.dyn_ltree[2 * t] = 0;
                for (t = 0; t < d; t++) e.dyn_dtree[2 * t] = 0;
                for (t = 0; t < p; t++) e.bl_tree[2 * t] = 0;
                e.dyn_ltree[2 * v] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0
            }

            function W(e) {
                8 < e.bi_valid ? L(e, e.bi_buf) : 0 < e.bi_valid && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0
            }

            function X(e, t, r, n) {
                var a = 2 * t, s = 2 * r;
                return e[a] < e[s] || e[a] === e[s] && n[t] <= n[r]
            }

            function j(e, t, r) {
                for (var n = e.heap[r], a = r << 1; a <= e.heap_len && (a < e.heap_len && X(t, e.heap[a + 1], e.heap[a], e.depth) && a++, !X(t, n, e.heap[a], e.depth));) e.heap[r] = e.heap[a], r = a, a <<= 1;
                e.heap[r] = n
            }

            function G(e, t, r) {
                var n, a, s, i, o = 0;
                if (0 !== e.last_lit) for (; n = e.pending_buf[e.d_buf + 2 * o] << 8 | e.pending_buf[e.d_buf + 2 * o + 1], a = e.pending_buf[e.l_buf + o], o++, 0 === n ? U(e, a, t) : (U(e, (s = A[a]) + h + 1, t), 0 !== (i = _[s]) && M(e, a -= I[s], i), U(e, s = N(--n), r), 0 !== (i = y[s]) && M(e, n -= R[s], i)), o < e.last_lit;) ;
                U(e, v, t)
            }

            function $(e, t) {
                var r, n, a, s = t.dyn_tree, i = t.stat_desc.static_tree, o = t.stat_desc.has_stree,
                    l = t.stat_desc.elems, c = -1;
                for (e.heap_len = 0, e.heap_max = g, r = 0; r < l; r++) 0 !== s[2 * r] ? (e.heap[++e.heap_len] = c = r, e.depth[r] = 0) : s[2 * r + 1] = 0;
                for (; e.heap_len < 2;) s[2 * (a = e.heap[++e.heap_len] = c < 2 ? ++c : 0)] = 1, e.depth[a] = 0, e.opt_len--, o && (e.static_len -= i[2 * a + 1]);
                for (t.max_code = c, r = e.heap_len >> 1; 1 <= r; r--) j(e, s, r);
                for (a = l; r = e.heap[1], e.heap[1] = e.heap[e.heap_len--], j(e, s, 1), n = e.heap[1], e.heap[--e.heap_max] = r, e.heap[--e.heap_max] = n, s[2 * a] = s[2 * r] + s[2 * n], e.depth[a] = (e.depth[r] >= e.depth[n] ? e.depth[r] : e.depth[n]) + 1, s[2 * r + 1] = s[2 * n + 1] = a, e.heap[1] = a++, j(e, s, 1), 2 <= e.heap_len;) ;
                e.heap[--e.heap_max] = e.heap[1], function (e, t) {
                    var r, n, a, s, i, o, l = t.dyn_tree, c = t.max_code, f = t.stat_desc.static_tree,
                        h = t.stat_desc.has_stree, u = t.stat_desc.extra_bits, d = t.stat_desc.extra_base,
                        p = t.stat_desc.max_length, m = 0;
                    for (s = 0; s <= b; s++) e.bl_count[s] = 0;
                    for (l[2 * e.heap[e.heap_max] + 1] = 0, r = e.heap_max + 1; r < g; r++) p < (s = l[2 * l[2 * (n = e.heap[r]) + 1] + 1] + 1) && (s = p, m++), l[2 * n + 1] = s, c < n || (e.bl_count[s]++, i = 0, d <= n && (i = u[n - d]), o = l[2 * n], e.opt_len += o * (s + i), h && (e.static_len += o * (f[2 * n + 1] + i)));
                    if (0 !== m) {
                        do {
                            for (s = p - 1; 0 === e.bl_count[s];) s--;
                            e.bl_count[s]--, e.bl_count[s + 1] += 2, e.bl_count[p]--, m -= 2
                        } while (0 < m);
                        for (s = p; 0 !== s; s--) for (n = e.bl_count[s]; 0 !== n;) c < (a = e.heap[--r]) || (l[2 * a + 1] !== s && (e.opt_len += (s - l[2 * a + 1]) * l[2 * a], l[2 * a + 1] = s), n--)
                    }
                }(e, t), z(s, c, e.bl_count)
            }

            function Y(e, t, r) {
                var n, a, s = -1, i = t[1], o = 0, l = 7, c = 4;
                for (0 === i && (l = 138, c = 3), t[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++) a = i, i = t[2 * (n + 1) + 1], ++o < l && a === i || (o < c ? e.bl_tree[2 * a] += o : 0 !== a ? (a !== s && e.bl_tree[2 * a]++, e.bl_tree[2 * E]++) : o <= 10 ? e.bl_tree[2 * w]++ : e.bl_tree[2 * S]++, s = a, c = (o = 0) === i ? (l = 138, 3) : a === i ? (l = 6, 3) : (l = 7, 4))
            }

            function K(e, t, r) {
                var n, a, s = -1, i = t[1], o = 0, l = 7, c = 4;
                for (0 === i && (l = 138, c = 3), n = 0; n <= r; n++) if (a = i, i = t[2 * (n + 1) + 1], !(++o < l && a === i)) {
                    if (o < c) for (; U(e, a, e.bl_tree), 0 != --o;) ; else 0 !== a ? (a !== s && (U(e, a, e.bl_tree), o--), U(e, E, e.bl_tree), M(e, o - 3, 2)) : o <= 10 ? (U(e, w, e.bl_tree), M(e, o - 3, 3)) : (U(e, S, e.bl_tree), M(e, o - 11, 7));
                    s = a, c = (o = 0) === i ? (l = 138, 3) : a === i ? (l = 6, 3) : (l = 7, 4)
                }
            }

            var Z = !1;

            function Q(e, t, r, n) {
                var a, s, i, o;
                M(e, (f << 1) + (n ? 1 : 0), 3), s = t, i = r, o = !0, W(a = e), o && (L(a, i), L(a, ~i)), l.arraySet(a.pending_buf, a.window, s, i, a.pending), a.pending += i
            }

            r._tr_init = function (e) {
                Z || (function () {
                    var e, t, r, n, a, s = new Array(b + 1);
                    for (n = r = 0; n < i - 1; n++) for (I[n] = r, e = 0; e < 1 << _[n]; e++) A[r++] = n;
                    for (A[r - 1] = n, n = a = 0; n < 16; n++) for (R[n] = a, e = 0; e < 1 << y[n]; e++) x[a++] = n;
                    for (a >>= 7; n < d; n++) for (R[n] = a << 7, e = 0; e < 1 << y[n] - 7; e++) x[256 + a++] = n;
                    for (t = 0; t <= b; t++) s[t] = 0;
                    for (e = 0; e <= 143;) T[2 * e + 1] = 8, e++, s[8]++;
                    for (; e <= 255;) T[2 * e + 1] = 9, e++, s[9]++;
                    for (; e <= 279;) T[2 * e + 1] = 7, e++, s[7]++;
                    for (; e <= 287;) T[2 * e + 1] = 8, e++, s[8]++;
                    for (z(T, u + 1, s), e = 0; e < d; e++) k[2 * e + 1] = 5, k[2 * e] = H(e, 5);
                    O = new P(T, _, h + 1, u, b), F = new P(k, y, 0, d, b), D = new P(new Array(0), C, 0, p, m)
                }(), Z = !0), e.l_desc = new s(e.dyn_ltree, O), e.d_desc = new s(e.dyn_dtree, F), e.bl_desc = new s(e.bl_tree, D), e.bi_buf = 0, e.bi_valid = 0, V(e)
            }, r._tr_stored_block = Q, r._tr_flush_block = function (e, t, r, n) {
                var a, s, i = 0;
                0 < e.level ? (2 === e.strm.data_type && (e.strm.data_type = function (e) {
                    var t, r = 4093624447;
                    for (t = 0; t <= 31; t++, r >>>= 1) if (1 & r && 0 !== e.dyn_ltree[2 * t]) return o;
                    if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return c;
                    for (t = 32; t < h; t++) if (0 !== e.dyn_ltree[2 * t]) return c;
                    return o
                }(e)), $(e, e.l_desc), $(e, e.d_desc), i = function (e) {
                    var t;
                    for (Y(e, e.dyn_ltree, e.l_desc.max_code), Y(e, e.dyn_dtree, e.d_desc.max_code), $(e, e.bl_desc), t = p - 1; 3 <= t && 0 === e.bl_tree[2 * B[t] + 1]; t--) ;
                    return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t
                }(e), a = e.opt_len + 3 + 7 >>> 3, (s = e.static_len + 3 + 7 >>> 3) <= a && (a = s)) : a = s = r + 5, r + 4 <= a && -1 !== t ? Q(e, t, r, n) : 4 === e.strategy || s === a ? (M(e, 2 + (n ? 1 : 0), 3), G(e, T, k)) : (M(e, 4 + (n ? 1 : 0), 3), function (e, t, r, n) {
                    var a;
                    for (M(e, t - 257, 5), M(e, r - 1, 5), M(e, n - 4, 4), a = 0; a < n; a++) M(e, e.bl_tree[2 * B[a] + 1], 3);
                    K(e, e.dyn_ltree, t - 1), K(e, e.dyn_dtree, r - 1)
                }(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, i + 1), G(e, e.dyn_ltree, e.dyn_dtree)), V(e), n && W(e)
            }, r._tr_tally = function (e, t, r) {
                return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & r, e.last_lit++, 0 === t ? e.dyn_ltree[2 * r]++ : (e.matches++, t--, e.dyn_ltree[2 * (A[r] + h + 1)]++, e.dyn_dtree[2 * N(t)]++), e.last_lit === e.lit_bufsize - 1
            }, r._tr_align = function (e) {
                var t;
                M(e, 2, 3), U(e, v, T), 16 === (t = e).bi_valid ? (L(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : 8 <= t.bi_valid && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8)
            }
        }, {"../utils/common": 27}],
        39: [function (e, t, r) {
            "use strict";
            t.exports = function () {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
            }
        }, {}]
    }, {}, [9])(9)
});
var XLSX = {};

function make_xlsx_lib(n) {
    n.version = "0.14.3";
    var u = 1200, a = 1252;
    "undefined" != typeof module && "undefined" != typeof require && "undefined" == typeof cptable && ("undefined" != typeof global ? global.cptable = void 0 : "undefined" != typeof window && (window.cptable = void 0));
    for (var t = [874, 932, 936, 949, 950], e = 0; e <= 8; ++e) t.push(1250 + e);
    var h = {
        0: 1252,
        1: 65001,
        2: 65001,
        77: 1e4,
        128: 932,
        129: 949,
        130: 1361,
        134: 936,
        136: 950,
        161: 1253,
        162: 1254,
        163: 1258,
        177: 1255,
        178: 1256,
        186: 1257,
        204: 1251,
        222: 874,
        238: 1250,
        255: 1252,
        69: 6969
    }, f = function (e) {
        -1 != t.indexOf(e) && (a = h[0] = e)
    };
    var he = function (e) {
        f(u = e)
    };

    function d() {
        he(1200), f(1252)
    }

    function re(e) {
        for (var t = [], r = 0, n = e.length; r < n; ++r) t[r] = e.charCodeAt(r);
        return t
    }

    var ne = function (e) {
        var t = e.charCodeAt(0), r = e.charCodeAt(1);
        return 255 == t && 254 == r ? function (e) {
            for (var t = [], r = 0; r < e.length >> 1; ++r) t[r] = String.fromCharCode(e.charCodeAt(2 * r) + (e.charCodeAt(2 * r + 1) << 8));
            return t.join("")
        }(e.slice(2)) : 254 == t && 255 == r ? function (e) {
            for (var t = [], r = 0; r < e.length >> 1; ++r) t[r] = String.fromCharCode(e.charCodeAt(2 * r + 1) + (e.charCodeAt(2 * r) << 8));
            return t.join("")
        }(e.slice(2)) : 65279 == t ? e.slice(1) : e
    }, p = function (e) {
        return String.fromCharCode(e)
    };
    "undefined" != typeof cptable && (he = function (e) {
        u = e
    }, ne = function (e) {
        return 255 === e.charCodeAt(0) && 254 === e.charCodeAt(1) ? cptable.utils.decode(1200, re(e.slice(2))) : e
    }, p = function (e) {
        return 1200 === u ? String.fromCharCode(e) : cptable.utils.decode(u, [255 & e, e >> 8])[0]
    });
    var m, ue = null, q = (m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", {
            encode: function (e) {
                for (var t = "", r = 0, n = 0, a = 0, s = 0, i = 0, o = 0, l = 0, c = 0; c < e.length;) s = (r = e.charCodeAt(c++)) >> 2, i = (3 & r) << 4 | (n = e.charCodeAt(c++)) >> 4, o = (15 & n) << 2 | (a = e.charCodeAt(c++)) >> 6, l = 63 & a, isNaN(n) ? o = l = 64 : isNaN(a) && (l = 64), t += m.charAt(s) + m.charAt(i) + m.charAt(o) + m.charAt(l);
                return t
            }, decode: function (e) {
                var t = "", r = 0, n = 0, a = 0, s = 0, i = 0, o = 0;
                e = e.replace(/[^\w\+\/\=]/g, "");
                for (var l = 0; l < e.length;) r = m.indexOf(e.charAt(l++)) << 2 | (s = m.indexOf(e.charAt(l++))) >> 4, t += String.fromCharCode(r), n = (15 & s) << 4 | (i = m.indexOf(e.charAt(l++))) >> 2, 64 !== i && (t += String.fromCharCode(n)), a = (3 & i) << 6 | (o = m.indexOf(e.charAt(l++))), 64 !== o && (t += String.fromCharCode(a));
                return t
            }
        }),
        ee = "undefined" != typeof Buffer && "undefined" != typeof process && void 0 !== process.versions && !!process.versions.node,
        s = function () {
        };
    if ("undefined" != typeof Buffer) {
        var r = !Buffer.from;
        if (!r) try {
            Buffer.from("foo", "utf8")
        } catch (e) {
            r = !0
        }
        s = r ? function (e, t) {
            return t ? new Buffer(e, t) : new Buffer(e)
        } : Buffer.from.bind(Buffer), Buffer.alloc || (Buffer.alloc = function (e) {
            return new Buffer(e)
        }), Buffer.allocUnsafe || (Buffer.allocUnsafe = function (e) {
            return new Buffer(e)
        })
    }

    function te(e) {
        return ee ? Buffer.alloc(e) : new Array(e)
    }

    function ae(e) {
        return ee ? Buffer.allocUnsafe(e) : new Array(e)
    }

    var se = function (e) {
        return ee ? s(e, "binary") : e.split("").map(function (e) {
            return 255 & e.charCodeAt(0)
        })
    };

    function i(e) {
        if ("undefined" == typeof ArrayBuffer) return se(e);
        for (var t = new ArrayBuffer(e.length), r = new Uint8Array(t), n = 0; n != e.length; ++n) r[n] = 255 & e.charCodeAt(n);
        return t
    }

    function l(e) {
        if (Array.isArray(e)) return e.map(Ec).join("");
        for (var t = [], r = 0; r < e.length; ++r) t[r] = Ec(e[r]);
        return t.join("")
    }

    function g(e) {
        if ("undefined" == typeof ArrayBuffer) throw new Error("Unsupported");
        if (e instanceof ArrayBuffer) return g(new Uint8Array(e));
        for (var t = new Array(e.length), r = 0; r < e.length; ++r) t[r] = e[r];
        return t
    }

    var ie = function (e) {
        return [].concat.apply([], e)
    }, oe = /\u0000/g, le = /[\u0001-\u0006]/g, de = {}, ce = function (e) {
        function I(e) {
            for (var t = "", r = e.length - 1; 0 <= r;) t += e.charAt(r--);
            return t
        }

        function R(e, t) {
            for (var r = ""; r.length < t;) r += e;
            return r
        }

        function O(e, t) {
            var r = "" + e;
            return t <= r.length ? r : R("0", t - r.length) + r
        }

        function F(e, t) {
            var r = "" + e;
            return t <= r.length ? r : R(" ", t - r.length) + r
        }

        function D(e, t) {
            var r = "" + e;
            return t <= r.length ? r : r + R(" ", t - r.length)
        }

        e.version = "0.10.2";
        var l = Math.pow(2, 32);

        function P(e, t) {
            if (l < e || e < -l) return r = e, n = t, a = "" + Math.round(r), n <= a.length ? a : R("0", n - a.length) + a;
            var r, n, a, s, i, o = Math.round(e);
            return (s = t) <= (i = "" + o).length ? i : R("0", s - i.length) + i
        }

        function k(e, t) {
            return t = t || 0, e.length >= 7 + t && 103 == (32 | e.charCodeAt(t)) && 101 == (32 | e.charCodeAt(t + 1)) && 110 == (32 | e.charCodeAt(t + 2)) && 101 == (32 | e.charCodeAt(t + 3)) && 114 == (32 | e.charCodeAt(t + 4)) && 97 == (32 | e.charCodeAt(t + 5)) && 108 == (32 | e.charCodeAt(t + 6))
        }

        var f = [["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"], ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"], ["Sat", "Saturday"]],
            h = [["J", "Jan", "January"], ["F", "Feb", "February"], ["M", "Mar", "March"], ["A", "Apr", "April"], ["M", "May", "May"], ["J", "Jun", "June"], ["J", "Jul", "July"], ["A", "Aug", "August"], ["S", "Sep", "September"], ["O", "Oct", "October"], ["N", "Nov", "November"], ["D", "Dec", "December"]];

        function t(e) {
            e[0] = "General", e[1] = "0", e[2] = "0.00", e[3] = "#,##0", e[4] = "#,##0.00", e[9] = "0%", e[10] = "0.00%", e[11] = "0.00E+00", e[12] = "# ?/?", e[13] = "# ??/??", e[14] = "m/d/yy", e[15] = "d-mmm-yy", e[16] = "d-mmm", e[17] = "mmm-yy", e[18] = "h:mm AM/PM", e[19] = "h:mm:ss AM/PM", e[20] = "h:mm", e[21] = "h:mm:ss", e[22] = "m/d/yy h:mm", e[37] = "#,##0 ;(#,##0)", e[38] = "#,##0 ;[Red](#,##0)", e[39] = "#,##0.00;(#,##0.00)", e[40] = "#,##0.00;[Red](#,##0.00)", e[45] = "mm:ss", e[46] = "[h]:mm:ss", e[47] = "mmss.0", e[48] = "##0.0E+0", e[49] = "@", e[56] = '"上午/下午 "hh"時"mm"分"ss"秒 "', e[65535] = "General"
        }

        var s = {};

        function N(e, t, r) {
            for (var n = e < 0 ? -1 : 1, a = e * n, s = 0, i = 1, o = 0, l = 1, c = 0, f = 0, h = Math.floor(a); c < t && (o = (h = Math.floor(a)) * i + s, f = h * c + l, !(a - h < 5e-8));) a = 1 / (a - h), s = i, i = o, l = c, c = f;
            if (t < f && (o = t < c ? (f = l, s) : (f = c, i)), !r) return [0, n * o, f];
            var u = Math.floor(n * o / f);
            return [u, n * o - u * f, f]
        }

        function x(e, t, r) {
            if (2958465 < e || e < 0) return null;
            var n = 0 | e, a = Math.floor(86400 * (e - n)), s = 0, i = [],
                o = {D: n, T: a, u: 86400 * (e - n) - a, y: 0, m: 0, d: 0, H: 0, M: 0, S: 0, q: 0};
            if (Math.abs(o.u) < 1e-6 && (o.u = 0), t && t.date1904 && (n += 1462), .9999 < o.u && (o.u = 0, 86400 == ++a && (o.T = a = 0, ++n, ++o.D)), 60 === n) i = r ? [1317, 10, 29] : [1900, 2, 29], s = 3; else if (0 === n) i = r ? [1317, 8, 29] : [1900, 1, 0], s = 6; else {
                60 < n && --n;
                var l = new Date(1900, 0, 1);
                l.setDate(l.getDate() + n - 1), i = [l.getFullYear(), l.getMonth() + 1, l.getDate()], s = l.getDay(), n < 60 && (s = (s + 6) % 7), r && (s = 0)
            }
            return o.y = i[0], o.m = i[1], o.d = i[2], o.S = a % 60, a = Math.floor(a / 60), o.M = a % 60, a = Math.floor(a / 60), o.H = a, o.q = s, o
        }

        t(s), e.parse_date_code = x;
        var n = new Date(1899, 11, 31, 0, 0, 0), a = n.getTime(), i = new Date(1900, 2, 1, 0, 0, 0);

        function o(e, t) {
            var r = e.getTime();
            return t ? r -= 1262304e5 : i <= e && (r += 864e5), (r - (a + 6e4 * (e.getTimezoneOffset() - n.getTimezoneOffset()))) / 864e5
        }

        function r(e) {
            return e.toString(10)
        }

        e._general_int = r;
        var c, u, d, p, m,
            g = (c = /\.(\d*[1-9])0+$/, u = /\.0*$/, d = /\.(\d*[1-9])0+/, p = /\.0*[Ee]/, m = /(E[+-])(\d)$/, function (e) {
                var t, r, n, a, s, i, o = Math.floor(Math.log(Math.abs(e)) * Math.LOG10E);
                return t = -4 <= o && o <= -1 ? e.toPrecision(10 + o) : Math.abs(o) <= 9 ? (s = (a = e) < 0 ? 12 : 11, (i = b(a.toFixed(12))).length <= s || (i = a.toPrecision(10)).length <= s ? i : a.toExponential(5)) : 10 === o ? e.toFixed(10).substr(0, 12) : ((n = (r = e).toFixed(11).replace(c, ".$1")).length > (r < 0 ? 12 : 11) && (n = r.toPrecision(6)), n), b(function (e) {
                    for (var t = 0; t != e.length; ++t) if (101 == (32 | e.charCodeAt(t))) return e.replace(d, ".$1").replace(p, "E").replace("e", "E").replace(m, "$10$2");
                    return e
                }(t))
            });

        function b(e) {
            return -1 < e.indexOf(".") ? e.replace(u, "").replace(c, ".$1") : e
        }

        function A(e, t) {
            switch (typeof e) {
                case"string":
                    return e;
                case"boolean":
                    return e ? "TRUE" : "FALSE";
                case"number":
                    return ((0 | e) === e ? r : g)(e);
                case"undefined":
                    return "";
                case"object":
                    if (null == e) return "";
                    if (e instanceof Date) return C(14, o(e, t && t.date1904), t)
            }
            throw new Error("unsupported value in General format: " + e)
        }

        function L(e, t, r, n) {
            var a, s = "", i = 0, o = 0, l = r.y, c = 0;
            switch (e) {
                case 98:
                    l = r.y + 543;
                case 121:
                    switch (t.length) {
                        case 1:
                        case 2:
                            a = l % 100, c = 2;
                            break;
                        default:
                            a = l % 1e4, c = 4
                    }
                    break;
                case 109:
                    switch (t.length) {
                        case 1:
                        case 2:
                            a = r.m, c = t.length;
                            break;
                        case 3:
                            return h[r.m - 1][1];
                        case 5:
                            return h[r.m - 1][0];
                        default:
                            return h[r.m - 1][2]
                    }
                    break;
                case 100:
                    switch (t.length) {
                        case 1:
                        case 2:
                            a = r.d, c = t.length;
                            break;
                        case 3:
                            return f[r.q][0];
                        default:
                            return f[r.q][1]
                    }
                    break;
                case 104:
                    switch (t.length) {
                        case 1:
                        case 2:
                            a = 1 + (r.H + 11) % 12, c = t.length;
                            break;
                        default:
                            throw"bad hour format: " + t
                    }
                    break;
                case 72:
                    switch (t.length) {
                        case 1:
                        case 2:
                            a = r.H, c = t.length;
                            break;
                        default:
                            throw"bad hour format: " + t
                    }
                    break;
                case 77:
                    switch (t.length) {
                        case 1:
                        case 2:
                            a = r.M, c = t.length;
                            break;
                        default:
                            throw"bad minute format: " + t
                    }
                    break;
                case 115:
                    if ("s" != t && "ss" != t && ".0" != t && ".00" != t && ".000" != t) throw"bad second format: " + t;
                    return 0 !== r.u || "s" != t && "ss" != t ? (60 * (o = 2 <= n ? 3 === n ? 1e3 : 100 : 1 === n ? 10 : 1) <= (i = Math.round(o * (r.S + r.u))) && (i = 0), "s" === t ? 0 === i ? "0" : "" + i / o : (s = O(i, 2 + n), "ss" === t ? s.substr(0, 2) : "." + s.substr(2, t.length - 1))) : O(r.S, t.length);
                case 90:
                    switch (t) {
                        case"[h]":
                        case"[hh]":
                            a = 24 * r.D + r.H;
                            break;
                        case"[m]":
                        case"[mm]":
                            a = 60 * (24 * r.D + r.H) + r.M;
                            break;
                        case"[s]":
                        case"[ss]":
                            a = 60 * (60 * (24 * r.D + r.H) + r.M) + Math.round(r.S + r.u);
                            break;
                        default:
                            throw"bad abstime format: " + t
                    }
                    c = 3 === t.length ? 1 : 2;
                    break;
                case 101:
                    a = l, c = 1
            }
            return 0 < c ? O(a, c) : ""
        }

        function M(e) {
            if (e.length <= 3) return e;
            for (var t = e.length % 3, r = e.substr(0, t); t != e.length; t += 3) r += (0 < r.length ? "," : "") + e.substr(t, 3);
            return r
        }

        e._general_num = g, e._general = A;
        var U, H, z, V, W,
            X = (U = /%/g, H = /# (\?+)( ?)\/( ?)(\d+)/, z = /^#*0*\.([0#]+)/, V = /\).*[0#]/, W = /\(###\) ###\\?-####/, function (e, t, r) {
                return ((0 | r) === r ? S : Y)(e, t, r)
            });

        function j(e) {
            for (var t, r = "", n = 0; n != e.length; ++n) switch (t = e.charCodeAt(n)) {
                case 35:
                    break;
                case 63:
                    r += " ";
                    break;
                case 48:
                    r += "0";
                    break;
                default:
                    r += String.fromCharCode(t)
            }
            return r
        }

        function G(e, t) {
            var r = Math.pow(10, t);
            return "" + Math.round(e * r) / r
        }

        function $(e, t) {
            return t < ("" + Math.round((e - Math.floor(e)) * Math.pow(10, t))).length ? 0 : Math.round((e - Math.floor(e)) * Math.pow(10, t))
        }

        function Y(e, t, r) {
            if (40 === e.charCodeAt(0) && !t.match(V)) {
                var n = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
                return 0 <= r ? Y("n", n, r) : "(" + Y("n", n, -r) + ")"
            }
            if (44 === t.charCodeAt(t.length - 1)) return function (e, t, r) {
                for (var n = t.length - 1; 44 === t.charCodeAt(n - 1);) --n;
                return X(e, t.substr(0, n), r / Math.pow(10, 3 * (t.length - n)))
            }(e, t, r);
            if (-1 !== t.indexOf("%")) return a = e, i = r, o = (s = t).replace(U, ""), l = s.length - o.length, X(a, o, i * Math.pow(10, 2 * l)) + R("%", l);
            var a, s, i, o, l, c;
            if (-1 !== t.indexOf("E")) return function e(t, r) {
                var n, a = t.indexOf("E") - t.indexOf(".") - 1;
                if (t.match(/^#+0.0E\+0$/)) {
                    if (0 == r) return "0.0E+0";
                    if (r < 0) return "-" + e(t, -r);
                    var s = t.indexOf(".");
                    -1 === s && (s = t.indexOf("E"));
                    var i = Math.floor(Math.log(r) * Math.LOG10E) % s;
                    if (i < 0 && (i += s), -1 === (n = (r / Math.pow(10, i)).toPrecision(1 + a + (s + i) % s)).indexOf("e")) {
                        var o = Math.floor(Math.log(r) * Math.LOG10E);
                        for (-1 === n.indexOf(".") ? n = n.charAt(0) + "." + n.substr(1) + "E+" + (o - n.length + i) : n += "E+" + (o - i); "0." === n.substr(0, 2);) n = (n = n.charAt(0) + n.substr(2, s) + "." + n.substr(2 + s)).replace(/^0+([1-9])/, "$1").replace(/^0+\./, "0.");
                        n = n.replace(/\+-/, "-")
                    }
                    n = n.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function (e, t, r, n) {
                        return t + r + n.substr(0, (s + i) % s) + "." + n.substr(i) + "E"
                    })
                } else n = r.toExponential(a);
                return t.match(/E\+00$/) && n.match(/e[+-]\d$/) && (n = n.substr(0, n.length - 1) + "0" + n.charAt(n.length - 1)), t.match(/E\-/) && n.match(/e\+/) && (n = n.replace(/e\+/, "e")), n.replace("e", "E")
            }(t, r);
            if (36 === t.charCodeAt(0)) return "$" + Y(e, t.substr(" " == t.charAt(1) ? 2 : 1), r);
            var f, h, u, d, p, m, g, b, v, E, w, S, _, y = Math.abs(r), C = r < 0 ? "-" : "";
            if (t.match(/^00+$/)) return C + P(y, t.length);
            if (t.match(/^[#?]+$/)) return "0" === (c = P(r, 0)) && (c = ""), c.length > t.length ? c : j(t.substr(0, t.length - c.length)) + c;
            if (f = t.match(H)) return d = f, p = y, m = C, g = parseInt(d[4], 10), b = Math.round(p * g), v = Math.floor(b / g), m + (0 === v ? "" : "" + v) + " " + (0 == (E = b - v * (w = g)) ? R(" ", d[1].length + 1 + d[4].length) : F(E, d[1].length) + d[2] + "/" + d[3] + O(w, d[4].length));
            if (t.match(/^#+0+$/)) return C + P(y, t.length - t.indexOf("0"));
            if (f = t.match(z)) return c = G(r, f[1].length).replace(/^([^\.]+)$/, "$1." + j(f[1])).replace(/\.$/, "." + j(f[1])).replace(/\.(\d*)$/, function (e, t) {
                return "." + t + R("0", j(f[1]).length - t.length)
            }), -1 !== t.indexOf("0.") ? c : c.replace(/^0\./, ".");
            if (t = t.replace(/^#+([0.])/, "$1"), f = t.match(/^(0*)\.(#*)$/)) return C + G(y, f[2].length).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, f[1].length ? "0." : ".");
            if (f = t.match(/^#{1,3},##0(\.?)$/)) return C + M(P(y, 0));
            if (f = t.match(/^#,##0\.([#0]*0)$/)) return r < 0 ? "-" + Y(e, t, -r) : M("" + (Math.floor(r) + (S = r, (_ = f[1].length) < ("" + Math.round((S - Math.floor(S)) * Math.pow(10, _))).length ? 1 : 0))) + "." + O($(r, f[1].length), f[1].length);
            if (f = t.match(/^#,#*,#0/)) return Y(e, t.replace(/^#,#*,/, ""), r);
            if (f = t.match(/^([0#]+)(\\?-([0#]+))+$/)) return c = I(Y(e, t.replace(/[\\-]/g, ""), r)), h = 0, I(I(t.replace(/\\/g, "")).replace(/[0#]/g, function (e) {
                return h < c.length ? c.charAt(h++) : "0" === e ? "0" : ""
            }));
            if (t.match(W)) return "(" + (c = Y(e, "##########", r)).substr(0, 3) + ") " + c.substr(3, 3) + "-" + c.substr(6);
            var B, T = "";
            if (f = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)) return h = Math.min(f[4].length, 7), u = N(y, Math.pow(10, h) - 1, !1), c = C, " " == (T = X("n", f[1], u[1])).charAt(T.length - 1) && (T = T.substr(0, T.length - 1) + "0"), c += T + f[2] + "/" + f[3], (T = D(u[2], h)).length < f[4].length && (T = j(f[4].substr(f[4].length - T.length)) + T), c += T;
            if (f = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)) return h = Math.min(Math.max(f[1].length, f[4].length), 7), C + ((u = N(y, Math.pow(10, h) - 1, !0))[0] || (u[1] ? "" : "0")) + " " + (u[1] ? F(u[1], h) + f[2] + "/" + f[3] + D(u[2], h) : R(" ", 2 * h + 1 + f[2].length + f[3].length));
            if (f = t.match(/^[#0?]+$/)) return c = P(r, 0), t.length <= c.length ? c : j(t.substr(0, t.length - c.length)) + c;
            if (f = t.match(/^([#0?]+)\.([#0]+)$/)) {
                c = "" + r.toFixed(Math.min(f[2].length, 10)).replace(/([^0])0+$/, "$1"), h = c.indexOf(".");
                var k = t.indexOf(".") - h, x = t.length - c.length - k;
                return j(t.substr(0, k) + c + t.substr(t.length - x))
            }
            if (f = t.match(/^00,000\.([#0]*0)$/)) return h = $(r, f[1].length), r < 0 ? "-" + Y(e, t, -r) : M((B = r) < 2147483647 && -2147483648 < B ? "" + (0 <= B ? 0 | B : B - 1 | 0) : "" + Math.floor(B)).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function (e) {
                return "00," + (e.length < 3 ? O(0, 3 - e.length) : "") + e
            }) + "." + O(h, f[1].length);
            switch (t) {
                case"###,##0.00":
                    return Y(e, "#,##0.00", r);
                case"###,###":
                case"##,###":
                case"#,###":
                    var A = M(P(y, 0));
                    return "0" !== A ? C + A : "";
                case"###,###.00":
                    return Y(e, "###,##0.00", r).replace(/^0\./, ".");
                case"#,###.00":
                    return Y(e, "#,##0.00", r).replace(/^0\./, ".")
            }
            throw new Error("unsupported format |" + t + "|")
        }

        function S(e, t, r) {
            if (40 === e.charCodeAt(0) && !t.match(V)) {
                var n = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
                return 0 <= r ? S("n", n, r) : "(" + S("n", n, -r) + ")"
            }
            if (44 === t.charCodeAt(t.length - 1)) return function (e, t, r) {
                for (var n = t.length - 1; 44 === t.charCodeAt(n - 1);) --n;
                return X(e, t.substr(0, n), r / Math.pow(10, 3 * (t.length - n)))
            }(e, t, r);
            if (-1 !== t.indexOf("%")) return a = e, i = r, o = (s = t).replace(U, ""), l = s.length - o.length, X(a, o, i * Math.pow(10, 2 * l)) + R("%", l);
            var a, s, i, o, l, c;
            if (-1 !== t.indexOf("E")) return function e(t, r) {
                var n, a = t.indexOf("E") - t.indexOf(".") - 1;
                if (t.match(/^#+0.0E\+0$/)) {
                    if (0 == r) return "0.0E+0";
                    if (r < 0) return "-" + e(t, -r);
                    var s = t.indexOf(".");
                    -1 === s && (s = t.indexOf("E"));
                    var i = Math.floor(Math.log(r) * Math.LOG10E) % s;
                    if (i < 0 && (i += s), !(n = (r / Math.pow(10, i)).toPrecision(1 + a + (s + i) % s)).match(/[Ee]/)) {
                        var o = Math.floor(Math.log(r) * Math.LOG10E);
                        -1 === n.indexOf(".") ? n = n.charAt(0) + "." + n.substr(1) + "E+" + (o - n.length + i) : n += "E+" + (o - i), n = n.replace(/\+-/, "-")
                    }
                    n = n.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function (e, t, r, n) {
                        return t + r + n.substr(0, (s + i) % s) + "." + n.substr(i) + "E"
                    })
                } else n = r.toExponential(a);
                return t.match(/E\+00$/) && n.match(/e[+-]\d$/) && (n = n.substr(0, n.length - 1) + "0" + n.charAt(n.length - 1)), t.match(/E\-/) && n.match(/e\+/) && (n = n.replace(/e\+/, "e")), n.replace("e", "E")
            }(t, r);
            if (36 === t.charCodeAt(0)) return "$" + S(e, t.substr(" " == t.charAt(1) ? 2 : 1), r);
            var f, h, u, d, p, m = Math.abs(r), g = r < 0 ? "-" : "";
            if (t.match(/^00+$/)) return g + O(m, t.length);
            if (t.match(/^[#?]+$/)) return c = "" + r, 0 === r && (c = ""), c.length > t.length ? c : j(t.substr(0, t.length - c.length)) + c;
            if (f = t.match(H)) return g + (0 === (p = m) ? "" : "" + p) + R(" ", (d = f)[1].length + 2 + d[4].length);
            if (t.match(/^#+0+$/)) return g + O(m, t.length - t.indexOf("0"));
            if (f = t.match(z)) return c = (c = ("" + r).replace(/^([^\.]+)$/, "$1." + j(f[1])).replace(/\.$/, "." + j(f[1]))).replace(/\.(\d*)$/, function (e, t) {
                return "." + t + R("0", j(f[1]).length - t.length)
            }), -1 !== t.indexOf("0.") ? c : c.replace(/^0\./, ".");
            if (t = t.replace(/^#+([0.])/, "$1"), f = t.match(/^(0*)\.(#*)$/)) return g + ("" + m).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, f[1].length ? "0." : ".");
            if (f = t.match(/^#{1,3},##0(\.?)$/)) return g + M("" + m);
            if (f = t.match(/^#,##0\.([#0]*0)$/)) return r < 0 ? "-" + S(e, t, -r) : M("" + r) + "." + R("0", f[1].length);
            if (f = t.match(/^#,#*,#0/)) return S(e, t.replace(/^#,#*,/, ""), r);
            if (f = t.match(/^([0#]+)(\\?-([0#]+))+$/)) return c = I(S(e, t.replace(/[\\-]/g, ""), r)), h = 0, I(I(t.replace(/\\/g, "")).replace(/[0#]/g, function (e) {
                return h < c.length ? c.charAt(h++) : "0" === e ? "0" : ""
            }));
            if (t.match(W)) return "(" + (c = S(e, "##########", r)).substr(0, 3) + ") " + c.substr(3, 3) + "-" + c.substr(6);
            var b = "";
            if (f = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)) return h = Math.min(f[4].length, 7), u = N(m, Math.pow(10, h) - 1, !1), c = g, " " == (b = X("n", f[1], u[1])).charAt(b.length - 1) && (b = b.substr(0, b.length - 1) + "0"), c += b + f[2] + "/" + f[3], (b = D(u[2], h)).length < f[4].length && (b = j(f[4].substr(f[4].length - b.length)) + b), c += b;
            if (f = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)) return h = Math.min(Math.max(f[1].length, f[4].length), 7), g + ((u = N(m, Math.pow(10, h) - 1, !0))[0] || (u[1] ? "" : "0")) + " " + (u[1] ? F(u[1], h) + f[2] + "/" + f[3] + D(u[2], h) : R(" ", 2 * h + 1 + f[2].length + f[3].length));
            if (f = t.match(/^[#0?]+$/)) return c = "" + r, t.length <= c.length ? c : j(t.substr(0, t.length - c.length)) + c;
            if (f = t.match(/^([#0]+)\.([#0]+)$/)) {
                c = "" + r.toFixed(Math.min(f[2].length, 10)).replace(/([^0])0+$/, "$1"), h = c.indexOf(".");
                var v = t.indexOf(".") - h, E = t.length - c.length - v;
                return j(t.substr(0, v) + c + t.substr(t.length - E))
            }
            if (f = t.match(/^00,000\.([#0]*0)$/)) return r < 0 ? "-" + S(e, t, -r) : M("" + r).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function (e) {
                return "00," + (e.length < 3 ? O(0, 3 - e.length) : "") + e
            }) + "." + O(0, f[1].length);
            switch (t) {
                case"###,###":
                case"##,###":
                case"#,###":
                    var w = M("" + m);
                    return "0" !== w ? g + w : "";
                default:
                    if (t.match(/\.[0#?]*$/)) return S(e, t.slice(0, t.lastIndexOf(".")), r) + j(t.slice(t.lastIndexOf(".")))
            }
            throw new Error("unsupported format |" + t + "|")
        }

        function v(e) {
            for (var t = [], r = !1, n = 0, a = 0; n < e.length; ++n) switch (e.charCodeAt(n)) {
                case 34:
                    r = !r;
                    break;
                case 95:
                case 42:
                case 92:
                    ++n;
                    break;
                case 59:
                    t[t.length] = e.substr(a, n - a), a = n + 1
            }
            if (t[t.length] = e.substr(a), !0 === r) throw new Error("Format |" + e + "| unterminated string ");
            return t
        }

        e._split = v;
        var K = /\[[HhMmSs]*\]/;

        function Z(e) {
            for (var t = 0, r = "", n = ""; t < e.length;) switch (r = e.charAt(t)) {
                case"G":
                    k(e, t) && (t += 6), t++;
                    break;
                case'"':
                    for (; 34 !== e.charCodeAt(++t) && t < e.length;) ++t;
                    ++t;
                    break;
                case"\\":
                case"_":
                    t += 2;
                    break;
                case"@":
                    ++t;
                    break;
                case"B":
                case"b":
                    if ("1" === e.charAt(t + 1) || "2" === e.charAt(t + 1)) return !0;
                case"M":
                case"D":
                case"Y":
                case"H":
                case"S":
                case"E":
                case"m":
                case"d":
                case"y":
                case"h":
                case"s":
                case"e":
                case"g":
                    return !0;
                case"A":
                case"a":
                    if ("A/P" === e.substr(t, 3).toUpperCase()) return !0;
                    if ("AM/PM" === e.substr(t, 5).toUpperCase()) return !0;
                    ++t;
                    break;
                case"[":
                    for (n = r; "]" !== e.charAt(t++) && t < e.length;) n += e.charAt(t);
                    if (n.match(K)) return !0;
                    break;
                case".":
                case"0":
                case"#":
                    for (; t < e.length && (-1 < "0#?.,E+-%".indexOf(r = e.charAt(++t)) || "\\" == r && "-" == e.charAt(t + 1) && -1 < "0#".indexOf(e.charAt(t + 2)));) ;
                    break;
                case"?":
                    for (; e.charAt(++t) === r;) ;
                    break;
                case"*":
                    ++t, " " != e.charAt(t) && "*" != e.charAt(t) || ++t;
                    break;
                case"(":
                case")":
                    ++t;
                    break;
                case"1":
                case"2":
                case"3":
                case"4":
                case"5":
                case"6":
                case"7":
                case"8":
                case"9":
                    for (; t < e.length && -1 < "0123456789".indexOf(e.charAt(++t));) ;
                    break;
                case" ":
                default:
                    ++t
            }
            return !1
        }

        function E(e, t, r, n) {
            for (var a, s, i, o = [], l = "", c = 0, f = "", h = "t", u = "H"; c < e.length;) switch (f = e.charAt(c)) {
                case"G":
                    if (!k(e, c)) throw new Error("unrecognized character " + f + " in " + e);
                    o[o.length] = {t: "G", v: "General"}, c += 7;
                    break;
                case'"':
                    for (l = ""; 34 !== (i = e.charCodeAt(++c)) && c < e.length;) l += String.fromCharCode(i);
                    o[o.length] = {t: "t", v: l}, ++c;
                    break;
                case"\\":
                    var d = e.charAt(++c), p = "(" === d || ")" === d ? d : "t";
                    o[o.length] = {t: p, v: d}, ++c;
                    break;
                case"_":
                    o[o.length] = {t: "t", v: " "}, c += 2;
                    break;
                case"@":
                    o[o.length] = {t: "T", v: t}, ++c;
                    break;
                case"B":
                case"b":
                    if ("1" === e.charAt(c + 1) || "2" === e.charAt(c + 1)) {
                        if (null == a && null == (a = x(t, r, "2" === e.charAt(c + 1)))) return "";
                        o[o.length] = {t: "X", v: e.substr(c, 2)}, h = f, c += 2;
                        break
                    }
                case"M":
                case"D":
                case"Y":
                case"H":
                case"S":
                case"E":
                    f = f.toLowerCase();
                case"m":
                case"d":
                case"y":
                case"h":
                case"s":
                case"e":
                case"g":
                    if (t < 0) return "";
                    if (null == a && null == (a = x(t, r))) return "";
                    for (l = f; ++c < e.length && e.charAt(c).toLowerCase() === f;) l += f;
                    "m" === f && "h" === h.toLowerCase() && (f = "M"), "h" === f && (f = u), o[o.length] = {
                        t: f,
                        v: l
                    }, h = f;
                    break;
                case"A":
                case"a":
                    var m = {t: f, v: f};
                    if (null == a && (a = x(t, r)), "A/P" === e.substr(c, 3).toUpperCase() ? (null != a && (m.v = 12 <= a.H ? "P" : "A"), m.t = "T", u = "h", c += 3) : "AM/PM" === e.substr(c, 5).toUpperCase() ? (null != a && (m.v = 12 <= a.H ? "PM" : "AM"), m.t = "T", c += 5, u = "h") : (m.t = "t", ++c), null == a && "T" === m.t) return "";
                    o[o.length] = m, h = f;
                    break;
                case"[":
                    for (l = f; "]" !== e.charAt(c++) && c < e.length;) l += e.charAt(c);
                    if ("]" !== l.slice(-1)) throw'unterminated "[" block: |' + l + "|";
                    if (l.match(K)) {
                        if (null == a && null == (a = x(t, r))) return "";
                        o[o.length] = {t: "Z", v: l.toLowerCase()}, h = l.charAt(1)
                    } else -1 < l.indexOf("$") && (l = (l.match(/\$([^-\[\]]*)/) || [])[1] || "$", Z(e) || (o[o.length] = {
                        t: "t",
                        v: l
                    }));
                    break;
                case".":
                    if (null != a) {
                        for (l = f; ++c < e.length && "0" === (f = e.charAt(c));) l += f;
                        o[o.length] = {t: "s", v: l};
                        break
                    }
                case"0":
                case"#":
                    for (l = f; ++c < e.length && -1 < "0#?.,E+-%".indexOf(f = e.charAt(c)) || "\\" == f && "-" == e.charAt(c + 1) && c < e.length - 2 && -1 < "0#".indexOf(e.charAt(c + 2));) l += f;
                    o[o.length] = {t: "n", v: l};
                    break;
                case"?":
                    for (l = f; e.charAt(++c) === f;) l += f;
                    o[o.length] = {t: f, v: l}, h = f;
                    break;
                case"*":
                    ++c, " " != e.charAt(c) && "*" != e.charAt(c) || ++c;
                    break;
                case"(":
                case")":
                    o[o.length] = {t: 1 === n ? "t" : f, v: f}, ++c;
                    break;
                case"1":
                case"2":
                case"3":
                case"4":
                case"5":
                case"6":
                case"7":
                case"8":
                case"9":
                    for (l = f; c < e.length && -1 < "0123456789".indexOf(e.charAt(++c));) l += e.charAt(c);
                    o[o.length] = {t: "D", v: l};
                    break;
                case" ":
                    o[o.length] = {t: f, v: f}, ++c;
                    break;
                default:
                    if (-1 === ",$-+/():!^&'~{}<>=€acfijklopqrtuvwxzP".indexOf(f)) throw new Error("unrecognized character " + f + " in " + e);
                    o[o.length] = {t: "t", v: f}, ++c
            }
            var g, b = 0, v = 0;
            for (c = o.length - 1, h = "t"; 0 <= c; --c) switch (o[c].t) {
                case"h":
                case"H":
                    o[c].t = u, h = "h", b < 1 && (b = 1);
                    break;
                case"s":
                    (g = o[c].v.match(/\.0+$/)) && (v = Math.max(v, g[0].length - 1)), b < 3 && (b = 3);
                case"d":
                case"y":
                case"M":
                case"e":
                    h = o[c].t;
                    break;
                case"m":
                    "s" === h && (o[c].t = "M", b < 2 && (b = 2));
                    break;
                case"X":
                    break;
                case"Z":
                    b < 1 && o[c].v.match(/[Hh]/) && (b = 1), b < 2 && o[c].v.match(/[Mm]/) && (b = 2), b < 3 && o[c].v.match(/[Ss]/) && (b = 3)
            }
            switch (b) {
                case 0:
                    break;
                case 1:
                    .5 <= a.u && (a.u = 0, ++a.S), 60 <= a.S && (a.S = 0, ++a.M), 60 <= a.M && (a.M = 0, ++a.H);
                    break;
                case 2:
                    .5 <= a.u && (a.u = 0, ++a.S), 60 <= a.S && (a.S = 0, ++a.M)
            }
            var E, w = "";
            for (c = 0; c < o.length; ++c) switch (o[c].t) {
                case"t":
                case"T":
                case" ":
                case"D":
                    break;
                case"X":
                    o[c].v = "", o[c].t = ";";
                    break;
                case"d":
                case"m":
                case"y":
                case"h":
                case"H":
                case"M":
                case"s":
                case"e":
                case"b":
                case"Z":
                    o[c].v = L(o[c].t.charCodeAt(0), o[c].v, a, v), o[c].t = "t";
                    break;
                case"n":
                case"(":
                case"?":
                    for (E = c + 1; null != o[E] && ("?" === (f = o[E].t) || "D" === f || (" " === f || "t" === f) && null != o[E + 1] && ("?" === o[E + 1].t || "t" === o[E + 1].t && "/" === o[E + 1].v) || "(" === o[c].t && (" " === f || "n" === f || ")" === f) || "t" === f && ("/" === o[E].v || " " === o[E].v && null != o[E + 1] && "?" == o[E + 1].t));) o[c].v += o[E].v, o[E] = {
                        v: "",
                        t: ";"
                    }, ++E;
                    w += o[c].v, c = E - 1;
                    break;
                case"G":
                    o[c].t = "t", o[c].v = A(t, r)
            }
            var S, _, y = "";
            if (0 < w.length) {
                40 == w.charCodeAt(0) ? (S = t < 0 && 45 === w.charCodeAt(0) ? -t : t, _ = X("(", w, S)) : (_ = X("n", w, S = t < 0 && 1 < n ? -t : t), S < 0 && o[0] && "t" == o[0].t && (_ = _.substr(1), o[0].v = "-" + o[0].v)), E = _.length - 1;
                var C = o.length;
                for (c = 0; c < o.length; ++c) if (null != o[c] && "t" != o[c].t && -1 < o[c].v.indexOf(".")) {
                    C = c;
                    break
                }
                var B = o.length;
                if (C === o.length && -1 === _.indexOf("E")) {
                    for (c = o.length - 1; 0 <= c; --c) null != o[c] && -1 !== "n?(".indexOf(o[c].t) && (E >= o[c].v.length - 1 ? (E -= o[c].v.length, o[c].v = _.substr(E + 1, o[c].v.length)) : E < 0 ? o[c].v = "" : (o[c].v = _.substr(0, E + 1), E = -1), o[c].t = "t", B = c);
                    0 <= E && B < o.length && (o[B].v = _.substr(0, E + 1) + o[B].v)
                } else if (C !== o.length && -1 === _.indexOf("E")) {
                    for (E = _.indexOf(".") - 1, c = C; 0 <= c; --c) if (null != o[c] && -1 !== "n?(".indexOf(o[c].t)) {
                        for (s = -1 < o[c].v.indexOf(".") && c === C ? o[c].v.indexOf(".") - 1 : o[c].v.length - 1, y = o[c].v.substr(s + 1); 0 <= s; --s) 0 <= E && ("0" === o[c].v.charAt(s) || "#" === o[c].v.charAt(s)) && (y = _.charAt(E--) + y);
                        o[c].v = y, o[c].t = "t", B = c
                    }
                    for (0 <= E && B < o.length && (o[B].v = _.substr(0, E + 1) + o[B].v), E = _.indexOf(".") + 1, c = C; c < o.length; ++c) if (null != o[c] && (-1 !== "n?(".indexOf(o[c].t) || c === C)) {
                        for (s = -1 < o[c].v.indexOf(".") && c === C ? o[c].v.indexOf(".") + 1 : 0, y = o[c].v.substr(0, s); s < o[c].v.length; ++s) E < _.length && (y += _.charAt(E++));
                        o[c].v = y, o[c].t = "t", B = c
                    }
                }
            }
            for (c = 0; c < o.length; ++c) null != o[c] && -1 < "n(?".indexOf(o[c].t) && (S = 1 < n && t < 0 && 0 < c && "-" === o[c - 1].v ? -t : t, o[c].v = X(o[c].t, o[c].v, S), o[c].t = "t");
            var T = "";
            for (c = 0; c !== o.length; ++c) null != o[c] && (T += o[c].v);
            return T
        }

        e.is_date = Z, e._eval = E;
        var w = /\[[=<>]/, _ = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;

        function y(e, t) {
            if (null != t) {
                var r = parseFloat(t[2]);
                switch (t[1]) {
                    case"=":
                        if (e == r) return 1;
                        break;
                    case">":
                        if (r < e) return 1;
                        break;
                    case"<":
                        if (e < r) return 1;
                        break;
                    case"<>":
                        if (e != r) return 1;
                        break;
                    case">=":
                        if (r <= e) return 1;
                        break;
                    case"<=":
                        if (e <= r) return 1
                }
            }
        }

        function C(e, t, r) {
            null == r && (r = {});
            var n = "";
            switch (typeof e) {
                case"string":
                    n = "m/d/yy" == e && r.dateNF ? r.dateNF : e;
                    break;
                case"number":
                    n = 14 == e && r.dateNF ? r.dateNF : (null != r.table ? r.table : s)[e]
            }
            if (k(n, 0)) return A(t, r);
            t instanceof Date && (t = o(t, r.date1904));
            var a = function (e, t) {
                var r = v(e), n = r.length, a = r[n - 1].indexOf("@");
                if (n < 4 && -1 < a && --n, 4 < r.length) throw new Error("cannot find right format for |" + r.join("|") + "|");
                if ("number" != typeof t) return [4, 4 === r.length || -1 < a ? r[r.length - 1] : "@"];
                switch (r.length) {
                    case 1:
                        r = -1 < a ? ["General", "General", "General", r[0]] : [r[0], r[0], r[0], "@"];
                        break;
                    case 2:
                        r = -1 < a ? [r[0], r[0], r[0], r[1]] : [r[0], r[1], r[0], "@"];
                        break;
                    case 3:
                        r = -1 < a ? [r[0], r[1], r[0], r[2]] : [r[0], r[1], r[2], "@"]
                }
                var s = 0 < t ? r[0] : t < 0 ? r[1] : r[2];
                if (-1 === r[0].indexOf("[") && -1 === r[1].indexOf("[")) return [n, s];
                if (null == r[0].match(w) && null == r[1].match(w)) return [n, s];
                var i = r[0].match(_), o = r[1].match(_);
                return y(t, i) ? [n, r[0]] : y(t, o) ? [n, r[1]] : [n, r[null != i && null != o ? 2 : 1]]
            }(n, t);
            if (k(a[1])) return A(t, r);
            if (!0 === t) t = "TRUE"; else if (!1 === t) t = "FALSE"; else if ("" === t || null == t) return "";
            return E(a[1], t, r, a[0])
        }

        function B(e, t) {
            if ("number" != typeof t) {
                t = +t || -1;
                for (var r = 0; r < 392; ++r) if (null != s[r]) {
                    if (s[r] == e) {
                        t = r;
                        break
                    }
                } else t < 0 && (t = r);
                t < 0 && (t = 391)
            }
            return s[t] = e, t
        }

        e.load = B, e._table = s, e.get_table = function () {
            return s
        }, e.load_table = function (e) {
            for (var t = 0; 392 != t; ++t) void 0 !== e[t] && B(e[t], t)
        }, e.init_table = t, e.format = C
    };
    ce(de);
    var fe = {
        "General Number": "General",
        "General Date": de._table[22],
        "Long Date": "dddd, mmmm dd, yyyy",
        "Medium Date": de._table[15],
        "Short Date": de._table[14],
        "Long Time": de._table[19],
        "Medium Time": de._table[18],
        "Short Time": de._table[20],
        Currency: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
        Fixed: de._table[2],
        Standard: de._table[4],
        Percent: de._table[10],
        Scientific: de._table[11],
        "Yes/No": '"Yes";"Yes";"No";@',
        "True/False": '"True";"True";"False";@',
        "On/Off": '"Yes";"Yes";"No";@'
    }, o = {
        5: '"$"#,##0_);\\("$"#,##0\\)',
        6: '"$"#,##0_);[Red]\\("$"#,##0\\)',
        7: '"$"#,##0.00_);\\("$"#,##0.00\\)',
        8: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
        23: "General",
        24: "General",
        25: "General",
        26: "General",
        27: "m/d/yy",
        28: "m/d/yy",
        29: "m/d/yy",
        30: "m/d/yy",
        31: "m/d/yy",
        32: "h:mm:ss",
        33: "h:mm:ss",
        34: "h:mm:ss",
        35: "h:mm:ss",
        36: "m/d/yy",
        41: '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)',
        42: '_("$"* #,##0_);_("$"* (#,##0);_("$"* "-"_);_(@_)',
        43: '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)',
        44: '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)',
        50: "m/d/yy",
        51: "m/d/yy",
        52: "m/d/yy",
        53: "m/d/yy",
        54: "m/d/yy",
        55: "m/d/yy",
        56: "m/d/yy",
        57: "m/d/yy",
        58: "m/d/yy",
        59: "0",
        60: "0.00",
        61: "#,##0",
        62: "#,##0.00",
        63: '"$"#,##0_);\\("$"#,##0\\)',
        64: '"$"#,##0_);[Red]\\("$"#,##0\\)',
        65: '"$"#,##0.00_);\\("$"#,##0.00\\)',
        66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
        67: "0%",
        68: "0.00%",
        69: "# ?/?",
        70: "# ??/??",
        71: "m/d/yy",
        72: "m/d/yy",
        73: "d-mmm-yy",
        74: "d-mmm",
        75: "mmm-yy",
        76: "h:mm",
        77: "h:mm:ss",
        78: "m/d/yy h:mm",
        79: "mm:ss",
        80: "[h]:mm:ss",
        81: "mmss.0"
    }, v = /[dD]+|[mM]+|[yYeE]+|[Hh]+|[Ss]+/g;
    var pe;
    !function (e) {
        function t() {
            var e = 0, t = new Array(256);
            for (var r = 0; r != 256; ++r) {
                e = r;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                e = e & 1 ? -306674912 ^ e >>> 1 : e >>> 1;
                t[r] = e
            }
            return typeof Int32Array !== "undefined" ? new Int32Array(t) : t
        }

        e.version = "1.2.0";
        var o = t();

        function r(e, t) {
            var r = t ^ -1, n = e.length - 1;
            for (var a = 0; a < n;) {
                r = r >>> 8 ^ o[(r ^ e.charCodeAt(a++)) & 255];
                r = r >>> 8 ^ o[(r ^ e.charCodeAt(a++)) & 255]
            }
            if (a === n) r = r >>> 8 ^ o[(r ^ e.charCodeAt(a)) & 255];
            return r ^ -1
        }

        function n(e, t) {
            if (e.length > 1e4) return s(e, t);
            var r = t ^ -1, n = e.length - 3;
            for (var a = 0; a < n;) {
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255]
            }
            while (a < n + 3) r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
            return r ^ -1
        }

        function s(e, t) {
            var r = t ^ -1, n = e.length - 7;
            for (var a = 0; a < n;) {
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
                r = r >>> 8 ^ o[(r ^ e[a++]) & 255]
            }
            while (a < n + 7) r = r >>> 8 ^ o[(r ^ e[a++]) & 255];
            return r ^ -1
        }

        function a(e, t) {
            var r = t ^ -1;
            for (var n = 0, a = e.length, s, i; n < a;) {
                s = e.charCodeAt(n++);
                if (s < 128) {
                    r = r >>> 8 ^ o[(r ^ s) & 255]
                } else if (s < 2048) {
                    r = r >>> 8 ^ o[(r ^ (192 | s >> 6 & 31)) & 255];
                    r = r >>> 8 ^ o[(r ^ (128 | s & 63)) & 255]
                } else if (s >= 55296 && s < 57344) {
                    s = (s & 1023) + 64;
                    i = e.charCodeAt(n++) & 1023;
                    r = r >>> 8 ^ o[(r ^ (240 | s >> 8 & 7)) & 255];
                    r = r >>> 8 ^ o[(r ^ (128 | s >> 2 & 63)) & 255];
                    r = r >>> 8 ^ o[(r ^ (128 | i >> 6 & 15 | (s & 3) << 4)) & 255];
                    r = r >>> 8 ^ o[(r ^ (128 | i & 63)) & 255]
                } else {
                    r = r >>> 8 ^ o[(r ^ (224 | s >> 12 & 15)) & 255];
                    r = r >>> 8 ^ o[(r ^ (128 | s >> 6 & 63)) & 255];
                    r = r >>> 8 ^ o[(r ^ (128 | s & 63)) & 255]
                }
            }
            return r ^ -1
        }

        e.table = o, e.bstr = r, e.buf = n, e.str = a
    }(pe = {});
    var b, me = function () {
        var a, e = {};

        function u(e) {
            if ("/" == e.charAt(e.length - 1)) return -1 === e.slice(0, -1).indexOf("/") ? e : u(e.slice(0, -1));
            var t = e.lastIndexOf("/");
            return -1 === t ? e : e.slice(0, t + 1)
        }

        function d(e) {
            if ("/" == e.charAt(e.length - 1)) return d(e.slice(0, -1));
            var t = e.lastIndexOf("/");
            return -1 === t ? e : e.slice(t + 1)
        }

        function S(e, t) {
            "string" == typeof t && (t = new Date(t));
            var r = t.getHours();
            r = (r = r << 6 | t.getMinutes()) << 5 | t.getSeconds() >>> 1, e.write_shift(2, r);
            var n = t.getFullYear() - 1980;
            n = (n = n << 4 | t.getMonth() + 1) << 5 | t.getDate(), e.write_shift(2, n)
        }

        function E(e) {
            Ft(e, 0);
            for (var t = {}, r = 0; e.l <= e.length - 4;) {
                var n = e.read_shift(2), a = e.read_shift(2), s = e.l + a, i = {};
                switch (n) {
                    case 21589:
                        1 & (r = e.read_shift(1)) && (i.mtime = e.read_shift(4)), 5 < a && (2 & r && (i.atime = e.read_shift(4)), 4 & r && (i.ctime = e.read_shift(4))), i.mtime && (i.mt = new Date(1e3 * i.mtime))
                }
                e.l = s, t[n] = i
            }
            return t
        }

        function s() {
            return a = a || require("fs")
        }

        function i(e, t) {
            if (80 == e[0] && 75 == e[1]) return Z(e, t);
            if (e.length < 512) throw new Error("CFB file size " + e.length + " < 512");
            var r, n, a, s, i, o, l = 512, c = [], f = e.slice(0, 512);
            Ft(f, 0);
            var h = function (e) {
                if (80 == e[e.l] && 75 == e[e.l + 1]) return [0, 0];
                e.chk(k, "Header Signature: "), e.chk(x, "CLSID: ");
                var t = e.read_shift(2, "u");
                return [e.read_shift(2, "u"), t]
            }(f);
            switch (r = h[0]) {
                case 3:
                    l = 512;
                    break;
                case 4:
                    l = 4096;
                    break;
                case 0:
                    if (0 == h[1]) return Z(e, t);
                default:
                    throw new Error("Major Version: Expected 3 or 4 saw " + r)
            }
            512 !== l && Ft(f = e.slice(0, l), 28);
            var u = e.slice(0, l);
            !function (e, t) {
                var r;
                switch (e.l += 2, r = e.read_shift(2)) {
                    case 9:
                        if (3 != t) throw new Error("Sector Shift: Expected 9 saw " + r);
                        break;
                    case 12:
                        if (4 != t) throw new Error("Sector Shift: Expected 12 saw " + r);
                        break;
                    default:
                        throw new Error("Sector Shift: Expected 9 or 12 saw " + r)
                }
                e.chk("0600", "Mini Sector Shift: "), e.chk("000000000000", "Reserved: ")
            }(f, r);
            var d = f.read_shift(4, "i");
            if (3 === r && 0 !== d) throw new Error("# Directory Sectors: Expected 0 saw " + d);
            f.l += 4, s = f.read_shift(4, "i"), f.l += 4, f.chk("00100000", "Mini Stream Cutoff Size: "), i = f.read_shift(4, "i"), n = f.read_shift(4, "i"), o = f.read_shift(4, "i"), a = f.read_shift(4, "i");
            for (var p = -1, m = 0; m < 109 && !((p = f.read_shift(4, "i")) < 0); ++m) c[m] = p;
            var g = function (e, t) {
                for (var r = Math.ceil(e.length / t) - 1, n = [], a = 1; a < r; ++a) n[a - 1] = e.slice(a * t, (a + 1) * t);
                return n[r - 1] = e.slice(r * t), n
            }(e, l);
            !function e(t, r, n, a, s) {
                var i = T;
                if (t === T) {
                    if (0 !== r) throw new Error("DIFAT chain shorter than expected")
                } else if (-1 !== t) {
                    var o = n[t], l = (a >>> 2) - 1;
                    if (!o) return;
                    for (var c = 0; c < l && (i = Bt(o, 4 * c)) !== T; ++c) s.push(i);
                    e(Bt(o, a - 4), r - 1, n, a, s)
                }
            }(o, a, g, l, c);
            var b = function (e, t, r, n) {
                var a = e.length, s = [], i = [], o = [], l = [], c = n - 1, f = 0, h = 0, u = 0, d = 0;
                for (f = 0; f < a; ++f) if (o = [], a <= (u = f + t) && (u -= a), !i[u]) {
                    for (l = [], h = u; 0 <= h;) {
                        i[h] = !0, o[o.length] = h, l.push(e[h]);
                        var p = r[Math.floor(4 * h / n)];
                        if (n < 4 + (d = 4 * h & c)) throw new Error("FAT boundary crossed: " + h + " 4 " + n);
                        if (!e[p]) break;
                        h = Bt(e[p], d)
                    }
                    s[u] = {nodes: o, data: rt([l])}
                }
                return s
            }(g, s, c, l);
            b[s].name = "!Directory", 0 < n && i !== T && (b[i].name = "!MiniFAT"), b[c[0]].name = "!FAT", b.fat_addrs = c, b.ssz = l;
            var v = [], E = [], w = [];
            !function (e, t, r, n, a, s, i, o) {
                for (var l, c = 0, f = n.length ? 2 : 0, h = t[e].data, u = 0, d = 0; u < h.length; u += 128) {
                    var p = h.slice(u, u + 128);
                    Ft(p, 64), d = p.read_shift(2), l = at(p, 0, d - f), n.push(l);
                    var m = {
                        name: l,
                        type: p.read_shift(1),
                        color: p.read_shift(1),
                        L: p.read_shift(4, "i"),
                        R: p.read_shift(4, "i"),
                        C: p.read_shift(4, "i"),
                        clsid: p.read_shift(16),
                        state: p.read_shift(4, "i"),
                        start: 0,
                        size: 0
                    };
                    0 !== p.read_shift(2) + p.read_shift(2) + p.read_shift(2) + p.read_shift(2) && (m.ct = C(p, p.l - 8)), 0 !== p.read_shift(2) + p.read_shift(2) + p.read_shift(2) + p.read_shift(2) && (m.mt = C(p, p.l - 8)), m.start = p.read_shift(4, "i"), m.size = p.read_shift(4, "i"), m.size < 0 && m.start < 0 && (m.size = m.type = 0, m.start = T, m.name = ""), 5 === m.type ? (c = m.start, 0 < a && c !== T && (t[c].name = "!StreamData")) : 4096 <= m.size ? (m.storage = "fat", void 0 === t[m.start] && (t[m.start] = y(r, m.start, t.fat_addrs, t.ssz)), t[m.start].name = m.name, m.content = t[m.start].data.slice(0, m.size)) : (m.storage = "minifat", m.size < 0 ? m.size = 0 : c !== T && m.start !== T && t[c] && (m.content = _(m, t[c].data, (t[o] || {}).data))), m.content && Ft(m.content, 0), s[l] = m, i.push(m)
                }
            }(s, b, g, v, n, {}, E, i), function (e, t, r) {
                for (var n = 0, a = 0, s = 0, i = 0, o = 0, l = r.length, c = [], f = []; n < l; ++n) c[n] = f[n] = n, t[n] = r[n];
                for (; o < f.length; ++o) n = f[o], a = e[n].L, s = e[n].R, i = e[n].C, c[n] === n && (-1 !== a && c[a] !== a && (c[n] = c[a]), -1 !== s && c[s] !== s && (c[n] = c[s])), -1 !== i && (c[i] = n), -1 !== a && (c[a] = c[n], f.lastIndexOf(a) < o && f.push(a)), -1 !== s && (c[s] = c[n], f.lastIndexOf(s) < o && f.push(s));
                for (n = 1; n < l; ++n) c[n] === n && (-1 !== s && c[s] !== s ? c[n] = c[s] : -1 !== a && c[a] !== a && (c[n] = c[a]));
                for (n = 1; n < l; ++n) if (0 !== e[n].type) {
                    if (0 === (o = c[n])) t[n] = t[0] + "/" + t[n]; else for (; 0 !== o && o !== c[o];) t[n] = t[o] + "/" + t[n], o = c[o];
                    c[n] = 0
                }
                for (t[0] += "/", n = 1; n < l; ++n) 2 !== e[n].type && (t[n] += "/")
            }(E, w, v), v.shift();
            var S = {FileIndex: E, FullPaths: w};
            return t && t.raw && (S.raw = {header: u, sectors: g}), S
        }

        function _(e, t, r) {
            for (var n = e.start, a = e.size, s = [], i = n; r && 0 < a && 0 <= i;) s.push(t.slice(i * l, i * l + l)), a -= l, i = Bt(r, 4 * i);
            return 0 === s.length ? Pt(0) : ie(s).slice(0, e.size)
        }

        function y(e, t, r, n, a) {
            var s = [], i = [];
            a = a || [];
            var o = n - 1, l = 0, c = 0;
            for (l = t; 0 <= l;) {
                a[l] = !0, s[s.length] = l, i.push(e[l]);
                var f = r[Math.floor(4 * l / n)];
                if (n < 4 + (c = 4 * l & o)) throw new Error("FAT boundary crossed: " + l + " 4 " + n);
                if (!e[f]) break;
                l = Bt(e[f], c)
            }
            return {nodes: s, data: rt([i])}
        }

        function C(e, t) {
            return new Date(1e3 * (Ct(e, t + 4) / 1e7 * Math.pow(2, 32) + Ct(e, t) / 1e7 - 11644473600))
        }

        function m(e, t) {
            var r = t || {}, n = r.root || "Root Entry";
            if (e.FullPaths || (e.FullPaths = []), e.FileIndex || (e.FileIndex = []), e.FullPaths.length !== e.FileIndex.length) throw new Error("inconsistent CFB structure");
            0 === e.FullPaths.length && (e.FullPaths[0] = n + "/", e.FileIndex[0] = {
                name: n,
                type: 5
            }), r.CLSID && (e.FileIndex[0].clsid = r.CLSID), function (e) {
                var t = "Sh33tJ5";
                if (me.find(e, "/" + t)) return;
                var r = Pt(4);
                r[0] = 55, r[1] = r[3] = 50, r[2] = 54, e.FileIndex.push({
                    name: t,
                    type: 2,
                    content: r,
                    size: 4,
                    L: 69,
                    R: 69,
                    C: 69
                }), e.FullPaths.push(e.FullPaths[0] + t), p(e)
            }(e)
        }

        function p(e, t) {
            m(e);
            for (var r = !1, n = !1, a = e.FullPaths.length - 1; 0 <= a; --a) {
                var s = e.FileIndex[a];
                switch (s.type) {
                    case 0:
                        n ? r = !0 : (e.FileIndex.pop(), e.FullPaths.pop());
                        break;
                    case 1:
                    case 2:
                    case 5:
                        n = !0, isNaN(s.R * s.L * s.C) && (r = !0), -1 < s.R && -1 < s.L && s.R == s.L && (r = !0);
                        break;
                    default:
                        r = !0
                }
            }
            if (r || t) {
                var i = new Date(1987, 1, 19), o = 0, l = [];
                for (a = 0; a < e.FullPaths.length; ++a) 0 !== e.FileIndex[a].type && l.push([e.FullPaths[a], e.FileIndex[a]]);
                for (a = 0; a < l.length; ++a) {
                    var c = u(l[a][0]);
                    for (n = !1, o = 0; o < l.length; ++o) l[o][0] === c && (n = !0);
                    n || l.push([c, {name: d(c).replace("/", ""), type: 1, clsid: x, ct: i, mt: i, content: null}])
                }
                for (l.sort(function (e, t) {
                    return function (e, t) {
                        for (var r = e.split("/"), n = t.split("/"), a = 0, s = 0, i = Math.min(r.length, n.length); a < i; ++a) {
                            if (s = r[a].length - n[a].length) return s;
                            if (r[a] != n[a]) return r[a] < n[a] ? -1 : 1
                        }
                        return r.length - n.length
                    }(e[0], t[0])
                }), e.FullPaths = [], e.FileIndex = [], a = 0; a < l.length; ++a) e.FullPaths[a] = l[a][0], e.FileIndex[a] = l[a][1];
                for (a = 0; a < l.length; ++a) {
                    var f = e.FileIndex[a], h = e.FullPaths[a];
                    if (f.name = d(h).replace("/", ""), f.L = f.R = f.C = -(f.color = 1), f.size = f.content ? f.content.length : 0, f.start = 0, f.clsid = f.clsid || x, 0 === a) f.C = 1 < l.length ? 1 : -1, f.size = 0, f.type = 5; else if ("/" == h.slice(-1)) {
                        for (o = a + 1; o < l.length && u(e.FullPaths[o]) != h; ++o) ;
                        for (f.C = o >= l.length ? -1 : o, o = a + 1; o < l.length && u(e.FullPaths[o]) != u(h); ++o) ;
                        f.R = o >= l.length ? -1 : o, f.type = 1
                    } else u(e.FullPaths[a + 1] || "") == u(h) && (f.R = a + 1), f.type = 2
                }
            }
        }

        function o(e, t) {
            var r = t || {};
            if (p(e), "zip" == r.fileType) return function (e, t) {
                var r = t || {}, n = [], a = [], s = Pt(1), i = r.compression ? 8 : 0, o = 0;
                0;
                var l = 0, c = 0, f = 0, h = 0, u = e.FullPaths[0], d = u, p = e.FileIndex[0], m = [], g = 0;
                for (l = 1; l < e.FullPaths.length; ++l) if (d = e.FullPaths[l].slice(u.length), (p = e.FileIndex[l]).size && p.content && "Sh33tJ5" != d) {
                    var b = f, v = Pt(d.length);
                    for (c = 0; c < d.length; ++c) v.write_shift(1, 127 & d.charCodeAt(c));
                    v = v.slice(0, v.l), m[h] = pe.buf(p.content, 0);
                    var E = p.content;
                    8 == i && (w = E, E = B ? B.deflateRawSync(w) : M(w)), (s = Pt(30)).write_shift(4, 67324752), s.write_shift(2, 20), s.write_shift(2, o), s.write_shift(2, i), p.mt ? S(s, p.mt) : s.write_shift(4, 0), s.write_shift(-4, 8 & o ? 0 : m[h]), s.write_shift(4, 8 & o ? 0 : E.length), s.write_shift(4, 8 & o ? 0 : p.content.length), s.write_shift(2, v.length), s.write_shift(2, 0), f += s.length, n.push(s), f += v.length, n.push(v), f += E.length, n.push(E), 8 & o && ((s = Pt(12)).write_shift(-4, m[h]), s.write_shift(4, E.length), s.write_shift(4, p.content.length), f += s.l, n.push(s)), (s = Pt(46)).write_shift(4, 33639248), s.write_shift(2, 0), s.write_shift(2, 20), s.write_shift(2, o), s.write_shift(2, i), s.write_shift(4, 0), s.write_shift(-4, m[h]), s.write_shift(4, E.length), s.write_shift(4, p.content.length), s.write_shift(2, v.length), s.write_shift(2, 0), s.write_shift(2, 0), s.write_shift(2, 0), s.write_shift(2, 0), s.write_shift(4, 0), s.write_shift(4, b), g += s.l, a.push(s), g += v.length, a.push(v), ++h
                }
                var w;
                return (s = Pt(22)).write_shift(4, 101010256), s.write_shift(2, 0), s.write_shift(2, 0), s.write_shift(2, h), s.write_shift(2, h), s.write_shift(4, g), s.write_shift(4, f), s.write_shift(2, 0), ie([ie(n), ie(a), s])
            }(e, r);
            var n = function (e) {
                for (var t = 0, r = 0, n = 0; n < e.FileIndex.length; ++n) {
                    var a = e.FileIndex[n];
                    if (a.content) {
                        var s = a.content.length;
                        0 < s && (s < 4096 ? t += s + 63 >> 6 : r += s + 511 >> 9)
                    }
                }
                for (var i = e.FullPaths.length + 3 >> 2, o = t + 127 >> 7, l = (t + 7 >> 3) + r + i + o, c = l + 127 >> 7, f = c <= 109 ? 0 : Math.ceil((c - 109) / 127); c < l + c + f + 127 >> 7;) f = ++c <= 109 ? 0 : Math.ceil((c - 109) / 127);
                var h = [1, f, c, o, i, r, t, 0];
                return e.FileIndex[0].size = t << 6, h[7] = (e.FileIndex[0].start = h[0] + h[1] + h[2] + h[3] + h[4] + h[5]) + (h[6] + 7 >> 3), h
            }(e), a = Pt(n[7] << 9), s = 0, i = 0;
            for (s = 0; s < 8; ++s) a.write_shift(1, g[s]);
            for (s = 0; s < 8; ++s) a.write_shift(2, 0);
            for (a.write_shift(2, 62), a.write_shift(2, 3), a.write_shift(2, 65534), a.write_shift(2, 9), a.write_shift(2, 6), s = 0; s < 3; ++s) a.write_shift(2, 0);
            for (a.write_shift(4, 0), a.write_shift(4, n[2]), a.write_shift(4, n[0] + n[1] + n[2] + n[3] - 1), a.write_shift(4, 0), a.write_shift(4, 4096), a.write_shift(4, n[3] ? n[0] + n[1] + n[2] - 1 : T), a.write_shift(4, n[3]), a.write_shift(-4, n[1] ? n[0] - 1 : T), a.write_shift(4, n[1]), s = 0; s < 109; ++s) a.write_shift(-4, s < n[2] ? n[1] + s : -1);
            if (n[1]) for (i = 0; i < n[1]; ++i) {
                for (; s < 236 + 127 * i; ++s) a.write_shift(-4, s < n[2] ? n[1] + s : -1);
                a.write_shift(-4, i === n[1] - 1 ? T : i + 1)
            }

            function o(e) {
                for (i += e; s < i - 1; ++s) a.write_shift(-4, s + 1);
                e && (++s, a.write_shift(-4, T))
            }

            for (i = s = 0, i += n[1]; s < i; ++s) a.write_shift(-4, b.DIFSECT);
            for (i += n[2]; s < i; ++s) a.write_shift(-4, b.FATSECT);
            o(n[3]), o(n[4]);
            for (var l = 0, c = 0, f = e.FileIndex[0]; l < e.FileIndex.length; ++l) (f = e.FileIndex[l]).content && ((c = f.content.length) < 4096 || (f.start = i, o(c + 511 >> 9)));
            for (o(n[6] + 7 >> 3); 511 & a.l;) a.write_shift(-4, b.ENDOFCHAIN);
            for (i = s = 0, l = 0; l < e.FileIndex.length; ++l) (f = e.FileIndex[l]).content && (!(c = f.content.length) || 4096 <= c || (f.start = i, o(c + 63 >> 6)));
            for (; 511 & a.l;) a.write_shift(-4, b.ENDOFCHAIN);
            for (s = 0; s < n[4] << 2; ++s) {
                var h = e.FullPaths[s];
                if (h && 0 !== h.length) {
                    f = e.FileIndex[s], 0 === s && (f.start = f.size ? f.start - 1 : T);
                    var u = 0 === s && r.root || f.name;
                    if (c = 2 * (u.length + 1), a.write_shift(64, u, "utf16le"), a.write_shift(2, c), a.write_shift(1, f.type), a.write_shift(1, f.color), a.write_shift(-4, f.L), a.write_shift(-4, f.R), a.write_shift(-4, f.C), f.clsid) a.write_shift(16, f.clsid, "hex"); else for (l = 0; l < 4; ++l) a.write_shift(4, 0);
                    a.write_shift(4, f.state || 0), a.write_shift(4, 0), a.write_shift(4, 0), a.write_shift(4, 0), a.write_shift(4, 0), a.write_shift(4, f.start), a.write_shift(4, f.size), a.write_shift(4, 0)
                } else {
                    for (l = 0; l < 17; ++l) a.write_shift(4, 0);
                    for (l = 0; l < 3; ++l) a.write_shift(4, -1);
                    for (l = 0; l < 12; ++l) a.write_shift(4, 0)
                }
            }
            for (s = 1; s < e.FileIndex.length; ++s) if (4096 <= (f = e.FileIndex[s]).size) {
                for (a.l = f.start + 1 << 9, l = 0; l < f.size; ++l) a.write_shift(1, f.content[l]);
                for (; 511 & l; ++l) a.write_shift(1, 0)
            }
            for (s = 1; s < e.FileIndex.length; ++s) if (0 < (f = e.FileIndex[s]).size && f.size < 4096) {
                for (l = 0; l < f.size; ++l) a.write_shift(1, f.content[l]);
                for (; 63 & l; ++l) a.write_shift(1, 0)
            }
            for (; a.l < a.length;) a.write_shift(1, 0);
            return a
        }

        e.version = "1.1.0";
        var B, l = 64, T = -2, k = "d0cf11e0a1b11ae1", g = [208, 207, 17, 224, 161, 177, 26, 225],
            x = "00000000000000000000000000000000", b = {
                MAXREGSECT: -6,
                DIFSECT: -4,
                FATSECT: -3,
                ENDOFCHAIN: T,
                FREESECT: -1,
                HEADER_SIGNATURE: k,
                HEADER_MINOR_VERSION: "3e00",
                MAXREGSID: -6,
                NOSTREAM: -1,
                HEADER_CLSID: x,
                EntryTypes: ["unknown", "storage", "stream", "lockbytes", "property", "root"]
            };

        function n(e) {
            for (var t = new Array(e.length), r = 0; r < e.length; ++r) t[r] = String.fromCharCode(e[r]);
            return t.join("")
        }

        var A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
            v = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258],
            w = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
        for (var t, r, I = "undefined" != typeof Uint8Array, R = I ? new Uint8Array(256) : [], c = 0; c < 256; ++c) R[c] = 255 & ((r = 139536 & ((t = c) << 1 | t << 11) | 558144 & (t << 5 | t << 15)) >> 16 | r >> 8 | r);

        function O(e, t) {
            var r = 7 & t, n = t >>> 3;
            return (e[n] | (r <= 5 ? 0 : e[1 + n] << 8)) >>> r & 7
        }

        function F(e, t) {
            var r = 7 & t, n = t >>> 3;
            return (e[n] | (r <= 3 ? 0 : e[1 + n] << 8)) >>> r & 31
        }

        function D(e, t) {
            var r = 7 & t, n = t >>> 3;
            return (e[n] | (r <= 1 ? 0 : e[1 + n] << 8)) >>> r & 127
        }

        function P(e, t, r) {
            var n = 7 & t, a = t >>> 3, s = (1 << r) - 1, i = e[a] >>> n;
            return r < 8 - n ? i & s : (i |= e[1 + a] << 8 - n, r < 16 - n ? i & s : (i |= e[2 + a] << 16 - n, r < 24 - n ? i & s : (i |= e[3 + a] << 24 - n) & s))
        }

        function N(e, t) {
            var r = e.length, n = t < 2 * r ? 2 * r : t + 5, a = 0;
            if (t <= r) return e;
            if (ee) {
                var s = ae(n);
                if (e.copy) e.copy(s); else for (; a < e.length; ++a) s[a] = e[a];
                return s
            }
            if (I) {
                var i = new Uint8Array(n);
                if (i.set) i.set(e); else for (; a < e.length; ++a) i[a] = e[a];
                return i
            }
            return e.length = n, e
        }

        function L(e) {
            for (var t = new Array(e), r = 0; r < e; ++r) t[r] = 0;
            return t
        }

        var f, M = (f = function (e, t) {
            for (var r = 0; r < e.length;) {
                var n = Math.min(65535, e.length - r), a = r + n == e.length;
                for (t.write_shift(1, +a), t.write_shift(2, n), t.write_shift(2, 65535 & ~n); 0 < n--;) t[t.l++] = e[r++]
            }
            return t.l
        }, function (e) {
            var t = Pt(50 + Math.floor(1.1 * e.length)), r = f(e, t);
            return t.slice(0, r)
        });

        function U(e, t, r) {
            var n = 1, a = 0, s = 0, i = 0, o = 0, l = e.length, c = I ? new Uint16Array(32) : L(32);
            for (s = 0; s < 32; ++s) c[s] = 0;
            for (s = l; s < r; ++s) e[s] = 0;
            l = e.length;
            var f = I ? new Uint16Array(l) : L(l);
            for (s = 0; s < l; ++s) c[a = e[s]]++, n < a && (n = a), f[s] = 0;
            for (c[0] = 0, s = 1; s <= n; ++s) c[s + 16] = o = o + c[s - 1] << 1;
            for (s = 0; s < l; ++s) 0 != (o = e[s]) && (f[s] = c[o + 16]++);
            var h, u, d, p = 0;
            for (s = 0; s < l; ++s) if (0 != (p = e[s])) for (h = f[s], u = n, d = void 0, d = R[255 & h], o = (u <= 8 ? d >>> 8 - u : (d = d << 8 | R[h >> 8 & 255], u <= 16 ? d >>> 16 - u : (d = d << 8 | R[h >> 16 & 255]) >>> 24 - u)) >> n - p, i = (1 << n + 4 - p) - 1; 0 <= i; --i) t[o | i << p] = 15 & p | s << 4;
            return n
        }

        var H = I ? new Uint16Array(512) : L(512), z = I ? new Uint16Array(32) : L(32);
        if (!I) {
            for (var h = 0; h < 512; ++h) H[h] = 0;
            for (h = 0; h < 32; ++h) z[h] = 0
        }
        !function () {
            for (var e = [], t = 0; t < 32; t++) e.push(5);
            U(e, z, 32);
            var r = [];
            for (t = 0; t <= 143; t++) r.push(8);
            for (; t <= 255; t++) r.push(9);
            for (; t <= 279; t++) r.push(7);
            for (; t <= 287; t++) r.push(8);
            U(r, H, 288)
        }();
        var V = I ? new Uint16Array(32768) : L(32768), W = I ? new Uint16Array(32768) : L(32768),
            X = I ? new Uint16Array(128) : L(128), j = 1, G = 1;

        function $(e, t) {
            var r, n, a, s, i = F(e, t) + 257, o = F(e, t += 5) + 1,
                l = (a = 7 & (n = t += 5), 4 + (((r = e)[s = n >>> 3] | (a <= 4 ? 0 : r[1 + s] << 8)) >>> a & 15));
            t += 4;
            for (var c = 0, f = I ? new Uint8Array(19) : L(19), h = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], u = 1, d = I ? new Uint8Array(8) : L(8), p = I ? new Uint8Array(8) : L(8), m = f.length, g = 0; g < l; ++g) f[A[g]] = c = O(e, t), u < c && (u = c), d[c]++, t += 3;
            var b = 0;
            for (d[0] = 0, g = 1; g <= u; ++g) p[g] = b = b + d[g - 1] << 1;
            for (g = 0; g < m; ++g) 0 != (b = f[g]) && (h[g] = p[b]++);
            var v = 0;
            for (g = 0; g < m; ++g) if (0 != (v = f[g])) {
                b = R[h[g]] >> 8 - v;
                for (var E = (1 << 7 - v) - 1; 0 <= E; --E) X[b | E << v] = 7 & v | g << 3
            }
            var w, S, _, y, C = [];
            for (u = 1; C.length < i + o;) switch (t += 7 & (b = X[D(e, t)]), b >>>= 3) {
                case 16:
                    for (c = 3 + (0, _ = 7 & (S = t), ((w = e)[y = S >>> 3] | (_ <= 6 ? 0 : w[1 + y] << 8)) >>> _ & 3), t += 2, b = C[C.length - 1]; 0 < c--;) C.push(b);
                    break;
                case 17:
                    for (c = 3 + O(e, t), t += 3; 0 < c--;) C.push(0);
                    break;
                case 18:
                    for (c = 11 + D(e, t), t += 7; 0 < c--;) C.push(0);
                    break;
                default:
                    C.push(b), u < b && (u = b)
            }
            var B = C.slice(0, i), T = C.slice(i);
            for (g = i; g < 286; ++g) B[g] = 0;
            for (g = o; g < 30; ++g) T[g] = 0;
            return j = U(B, V, 286), G = U(T, W, 30), t
        }

        function Y(e, t) {
            var r = function (e, t) {
                if (3 == e[0] && !(3 & e[1])) return [te(t), 2];
                for (var r = 0, n = 0, a = ae(t || 1 << 18), s = 0, i = a.length >>> 0, o = 0, l = 0; 0 == (1 & n);) if (n = O(e, r), r += 3, n >>> 1 != 0) for (l = n >>> 1 == 1 ? (o = 9, 5) : (r = $(e, r), o = j, G), !t && i < s + 32767 && (i = (a = N(a, s + 32767)).length); ;) {
                    var c = P(e, r, o), f = n >>> 1 == 1 ? H[c] : V[c];
                    if (r += 15 & f, 0 == ((f >>>= 4) >>> 8 & 255)) a[s++] = f; else {
                        if (256 == f) break;
                        var h = (f -= 257) < 8 ? 0 : f - 4 >> 2;
                        5 < h && (h = 0);
                        var u = s + v[f];
                        0 < h && (u += P(e, r, h), r += h), c = P(e, r, l), r += 15 & (f = n >>> 1 == 1 ? z[c] : W[c]);
                        var d = (f >>>= 4) < 4 ? 0 : f - 2 >> 1, p = w[f];
                        for (0 < d && (p += P(e, r, d), r += d), !t && i < u && (i = (a = N(a, u)).length); s < u;) a[s] = a[s - p], ++s
                    }
                } else {
                    7 & r && (r += 8 - (7 & r));
                    var m = e[r >>> 3] | e[1 + (r >>> 3)] << 8;
                    if (r += 32, !t && i < s + m && (i = (a = N(a, s + m)).length), "function" == typeof e.copy) e.copy(a, s, r >>> 3, (r >>> 3) + m), s += m, r += 8 * m; else for (; 0 < m--;) a[s++] = e[r >>> 3], r += 8
                }
                return [t ? a : a.slice(0, s), r + 7 >>> 3]
            }(e.slice(e.l || 0), t);
            return e.l += r[1], r[0]
        }

        function K(e, t) {
            if (!e) throw new Error(t);
            "undefined" != typeof console && console.error(t)
        }

        function Z(e, t) {
            var r = e;
            Ft(r, 0);
            var n = {FileIndex: [], FullPaths: []};
            m(n, {root: t.root});
            for (var a = r.length - 4; (80 != r[a] || 75 != r[a + 1] || 5 != r[a + 2] || 6 != r[a + 3]) && 0 <= a;) --a;
            r.l = a + 4, r.l += 4;
            var s = r.read_shift(2);
            r.l += 6;
            var i = r.read_shift(4);
            for (r.l = i, a = 0; a < s; ++a) {
                r.l += 20;
                var o = r.read_shift(4), l = r.read_shift(4), c = r.read_shift(2), f = r.read_shift(2),
                    h = r.read_shift(2);
                r.l += 8;
                var u = r.read_shift(4), d = E(r.slice(r.l + c, r.l + c + f));
                r.l += c + f + h;
                var p = r.l;
                r.l = u + 4, Q(r, o, l, n, d), r.l = p
            }
            return n
        }

        function Q(e, t, r, n, a) {
            e.l += 2;
            var s = e.read_shift(2), i = e.read_shift(2), o = function (e) {
                var t = 65535 & e.read_shift(2), r = 65535 & e.read_shift(2), n = new Date, a = 31 & r,
                    s = 15 & (r >>>= 5);
                r >>>= 4, n.setMilliseconds(0), n.setFullYear(r + 1980), n.setMonth(s - 1), n.setDate(a);
                var i = 31 & t, o = 63 & (t >>>= 5);
                return t >>>= 6, n.setHours(t), n.setMinutes(o), n.setSeconds(i << 1), n
            }(e);
            if (8257 & s) throw new Error("Unsupported ZIP encryption");
            for (var l = e.read_shift(4), c = e.read_shift(4), f = e.read_shift(4), h = e.read_shift(2), u = e.read_shift(2), d = "", p = 0; p < h; ++p) d += String.fromCharCode(e[e.l++]);
            if (u) {
                var m = E(e.slice(e.l, e.l + u));
                (m[21589] || {}).mt && (o = m[21589].mt), ((a || {})[21589] || {}).mt && (o = a[21589].mt)
            }
            e.l += u;
            var g = e.slice(e.l, e.l + c);
            switch (i) {
                case 8:
                    g = function (e, t) {
                        if (!B) return Y(e, t);
                        var r = new B.InflateRaw, n = r._processChunk(e.slice(e.l), r._finishFlushFlag);
                        return e.l += r.bytesRead, n
                    }(e, f);
                    break;
                case 0:
                    break;
                default:
                    throw new Error("Unsupported ZIP Compression method " + i)
            }
            var b = !1;
            8 & s && (134695760 == (l = e.read_shift(4)) && (l = e.read_shift(4), b = !0), c = e.read_shift(4), f = e.read_shift(4)), c != t && K(b, "Bad compressed size: " + t + " != " + c), f != r && K(b, "Bad uncompressed size: " + r + " != " + f);
            var v = pe.buf(g, 0);
            l != v && K(b, "Bad CRC32 checksum: " + l + " != " + v), J(n, d, g, {unsafe: !0, mt: o})
        }

        function J(e, t, r, n) {
            var a = n && n.unsafe;
            a || m(e);
            var s = !a && me.find(e, t);
            if (!s) {
                var i = e.FullPaths[0];
                i = t.slice(0, i.length) == i ? t : ("/" != i.slice(-1) && (i += "/"), (i + t).replace("//", "/")), s = {
                    name: d(t),
                    type: 2
                }, e.FileIndex.push(s), e.FullPaths.push(i), a || me.utils.cfb_gc(e)
            }
            return s.content = r, s.size = r ? r.length : 0, n && (n.CLSID && (s.clsid = n.CLSID), n.mt && (s.mt = n.mt), n.ct && (s.ct = n.ct)), s
        }

        return e.find = function (e, t) {
            var r = e.FullPaths.map(function (e) {
                return e.toUpperCase()
            }), n = r.map(function (e) {
                var t = e.split("/");
                return t[t.length - ("/" == e.slice(-1) ? 2 : 1)]
            }), a = !1;
            47 === t.charCodeAt(0) ? (a = !0, t = r[0].slice(0, -1) + t) : a = -1 !== t.indexOf("/");
            var s = t.toUpperCase(), i = !0 === a ? r.indexOf(s) : n.indexOf(s);
            if (-1 !== i) return e.FileIndex[i];
            var o = !s.match(le);
            for (s = s.replace(oe, ""), o && (s = s.replace(le, "!")), i = 0; i < r.length; ++i) {
                if ((o ? r[i].replace(le, "!") : r[i]).replace(oe, "") == s) return e.FileIndex[i];
                if ((o ? n[i].replace(le, "!") : n[i]).replace(oe, "") == s) return e.FileIndex[i]
            }
            return null
        }, e.read = function (e, t) {
            switch (t && t.type || "base64") {
                case"file":
                    return r = e, n = t, s(), i(a.readFileSync(r), n);
                case"base64":
                    return i(se(q.decode(e)), t);
                case"binary":
                    return i(se(e), t)
            }
            var r, n;
            return i(e, t)
        }, e.parse = i, e.write = function (e, t) {
            var r = o(e, t);
            switch (t && t.type) {
                case"file":
                    return s(), a.writeFileSync(t.filename, r), r;
                case"binary":
                    return n(r);
                case"base64":
                    return q.encode(n(r))
            }
            return r
        }, e.writeFile = function (e, t, r) {
            s();
            var n = o(e, r);
            a.writeFileSync(t, n)
        }, e.utils = {
            cfb_new: function (e) {
                var t = {};
                return m(t, e), t
            }, cfb_add: J, cfb_del: function (e, t) {
                m(e);
                var r = me.find(e, t);
                if (r) for (var n = 0; n < e.FileIndex.length; ++n) if (e.FileIndex[n] == r) return e.FileIndex.splice(n, 1), e.FullPaths.splice(n, 1), !0;
                return !1
            }, cfb_mov: function (e, t, r) {
                m(e);
                var n = me.find(e, t);
                if (n) for (var a = 0; a < e.FileIndex.length; ++a) if (e.FileIndex[a] == n) return e.FileIndex[a].name = d(r), e.FullPaths[a] = r, !0;
                return !1
            }, cfb_gc: function (e) {
                p(e, !0)
            }, ReadShift: kt, CheckField: Ot, prep_blob: Ft, bconcat: ie, use_zlib: function (e) {
                try {
                    var t = new e.InflateRaw;
                    if (t._processChunk(new Uint8Array([3, 0]), t._finishFlushFlag), !t.bytesRead) throw new Error("zlib does not expose bytesRead");
                    B = e
                } catch (e) {
                    console.error("cannot use native zlib: " + (e.message || e))
                }
            }, _deflateRaw: M, _inflateRaw: Y, consts: b
        }, e
    }();
    if (0, "undefined" != typeof require) try {
        b = require("fs")
    } catch (e) {
    }

    function c(e) {
        return "string" == typeof e ? i(e) : Array.isArray(e) ? function (e) {
            if ("undefined" == typeof Uint8Array) throw new Error("Unsupported");
            return new Uint8Array(e)
        }(e) : e
    }

    function E(e, t, r) {
        if (void 0 !== b && b.writeFileSync) return r ? b.writeFileSync(e, t, r) : b.writeFileSync(e, t);
        var n = "utf8" == r ? De(t) : t;
        if ("undefined" != typeof IE_SaveFile) return IE_SaveFile(n, e);
        if ("undefined" != typeof Blob) {
            var a = new Blob([c(n)], {type: "application/octet-stream"});
            if ("undefined" != typeof navigator && navigator.msSaveBlob) return navigator.msSaveBlob(a, e);
            if ("undefined" != typeof saveAs) return saveAs(a, e);
            if ("undefined" != typeof URL && "undefined" != typeof document && document.createElement && URL.createObjectURL) {
                var s = URL.createObjectURL(a);
                if ("object" == typeof chrome && "function" == typeof (chrome.downloads || {}).download) return URL.revokeObjectURL && "undefined" != typeof setTimeout && setTimeout(function () {
                    URL.revokeObjectURL(s)
                }, 6e4), chrome.downloads.download({url: s, filename: e, saveAs: !0});
                var i = document.createElement("a");
                if (null != i.download) return i.download = e, i.href = s, document.body.appendChild(i), i.click(), document.body.removeChild(i), URL.revokeObjectURL && "undefined" != typeof setTimeout && setTimeout(function () {
                    URL.revokeObjectURL(s)
                }, 6e4), s
            }
        }
        if ("undefined" != typeof $ && "undefined" != typeof File && "undefined" != typeof Folder) try {
            var o = File(e);
            return o.open("w"), o.encoding = "binary", Array.isArray(t) && (t = l(t)), o.write(t), o.close(), t
        } catch (e) {
            if (!e.message || !e.message.match(/onstruct/)) throw e
        }
        throw new Error("cannot save file " + e)
    }

    function ge(e) {
        for (var t = Object.keys(e), r = [], n = 0; n < t.length; ++n) e.hasOwnProperty(t[n]) && r.push(t[n]);
        return r
    }

    function w(e, t) {
        for (var r = [], n = ge(e), a = 0; a !== n.length; ++a) null == r[e[n[a]][t]] && (r[e[n[a]][t]] = n[a]);
        return r
    }

    function S(e) {
        for (var t = [], r = ge(e), n = 0; n !== r.length; ++n) t[e[r[n]]] = r[n];
        return t
    }

    function C(e) {
        for (var t = [], r = ge(e), n = 0; n !== r.length; ++n) t[e[r[n]]] = parseInt(r[n], 10);
        return t
    }

    var _ = new Date(1899, 11, 30, 0, 0, 0),
        y = _.getTime() + 6e4 * ((new Date).getTimezoneOffset() - _.getTimezoneOffset());

    function K(e, t) {
        var r = e.getTime();
        return t && (r -= 1263168e5), (r - y) / 864e5
    }

    function N(e) {
        var t = new Date;
        return t.setTime(24 * e * 60 * 60 * 1e3 + y), t
    }

    function Z(e) {
        var t = 0, r = 0, n = !1,
            a = e.match(/P([0-9\.]+Y)?([0-9\.]+M)?([0-9\.]+D)?T([0-9\.]+H)?([0-9\.]+M)?([0-9\.]+S)?/);
        if (!a) throw new Error("|" + e + "| is not an ISO8601 Duration");
        for (var s = 1; s != a.length; ++s) if (a[s]) {
            switch (r = 1, 3 < s && (n = !0), a[s].slice(a[s].length - 1)) {
                case"Y":
                    throw new Error("Unsupported ISO Duration Field: " + a[s].slice(a[s].length - 1));
                case"D":
                    r *= 24;
                case"H":
                    r *= 60;
                case"M":
                    if (!n) throw new Error("Unsupported ISO Duration Field: M");
                    r *= 60
            }
            t += r * parseInt(a[s], 10)
        }
        return t
    }

    var B = new Date("2017-02-19T19:06:09.000Z");
    isNaN(B.getFullYear()) && (B = new Date("2/19/17"));
    var T = 2017 == B.getFullYear();

    function Q(e, t) {
        var r = new Date(e);
        if (T) return 0 < t ? r.setTime(r.getTime() + 60 * r.getTimezoneOffset() * 1e3) : t < 0 && r.setTime(r.getTime() - 60 * r.getTimezoneOffset() * 1e3), r;
        if (e instanceof Date) return e;
        if (1917 == B.getFullYear() && !isNaN(r.getFullYear())) {
            var n = r.getFullYear();
            return -1 < e.indexOf("" + n) ? r : (r.setFullYear(r.getFullYear() + 100), r)
        }
        var a = e.match(/\d+/g) || ["2017", "2", "19", "0", "0", "0"],
            s = new Date(+a[0], a[1] - 1, +a[2], +a[3] || 0, +a[4] || 0, +a[5] || 0);
        return -1 < e.indexOf("Z") && (s = new Date(s.getTime() - 60 * s.getTimezoneOffset() * 1e3)), s
    }

    function k(e) {
        for (var t = "", r = 0; r != e.length; ++r) t += String.fromCharCode(e[r]);
        return t
    }

    function be(e) {
        if ("undefined" != typeof JSON && !Array.isArray(e)) return JSON.parse(JSON.stringify(e));
        if ("object" != typeof e || null == e) return e;
        if (e instanceof Date) return new Date(e.getTime());
        var t = {};
        for (var r in e) e.hasOwnProperty(r) && (t[r] = be(e[r]));
        return t
    }

    function D(e, t) {
        for (var r = ""; r.length < t;) r += e;
        return r
    }

    function x(e) {
        var t = Number(e);
        if (!isNaN(t)) return t;
        var r = 1, n = e.replace(/([\d]),([\d])/g, "$1$2").replace(/[$]/g, "").replace(/[%]/g, function () {
            return r *= 100, ""
        });
        return isNaN(t = Number(n)) ? (n = n.replace(/[(](.*)[)]/, function (e, t) {
            return r = -r, t
        }), isNaN(t = Number(n)) ? t : t / r) : t / r
    }

    function A(e) {
        var t = new Date(e), r = new Date(NaN), n = t.getYear(), a = t.getMonth(), s = t.getDate();
        return isNaN(s) || n < 0 || 8099 < n || (!(0 < a || 1 < s) || 101 == n) && !e.toLowerCase().match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/) && e.match(/[^-0-9:,\/\\]/) ? r : t
    }

    var I, R = 5 == "abacaba".split(/(:?b)/i).length;

    function O(e) {
        return e ? e.data ? ne(e.data) : e.asNodeBuffer && ee ? ne(e.asNodeBuffer().toString("binary")) : e.asBinary ? ne(e.asBinary()) : e._data && e._data.getContent ? ne(k(Array.prototype.slice.call(e._data.getContent(), 0))) : null : null
    }

    function F(e) {
        return (e && ".bin" === e.name.slice(-4) ? function (e) {
            if (!e) return null;
            if (e.data) return re(e.data);
            if (e.asNodeBuffer && ee) return e.asNodeBuffer();
            if (e._data && e._data.getContent) {
                var t = e._data.getContent();
                return "string" == typeof t ? re(t) : Array.prototype.slice.call(t)
            }
            return null
        } : O)(e)
    }

    function P(e, t) {
        for (var r = ge(e.files), n = t.toLowerCase(), a = n.replace(/\//g, "\\"), s = 0; s < r.length; ++s) {
            var i = r[s].toLowerCase();
            if (n == i || a == i) return e.files[r[s]]
        }
        return null
    }

    function L(e, t) {
        var r = P(e, t);
        if (null == r) throw new Error("Cannot find file " + t + " in zip");
        return r
    }

    function M(e, t, r) {
        if (!r) return F(L(e, t));
        if (!t) return null;
        try {
            return M(e, t)
        } catch (e) {
            return null
        }
    }

    function U(e, t, r) {
        if (!r) return O(L(e, t));
        if (!t) return null;
        try {
            return U(e, t)
        } catch (e) {
            return null
        }
    }

    function H(e, t) {
        var r = t.split("/");
        "/" != t.slice(-1) && r.pop();
        for (var n = e.split("/"); 0 !== n.length;) {
            var a = n.shift();
            ".." === a ? r.pop() : "." !== a && r.push(a)
        }
        return r.join("/")
    }

    "undefined" != typeof JSZipSync && (I = JSZipSync), "undefined" != typeof exports && "undefined" != typeof module && module.exports && void 0 === I && (I = void 0);
    var z = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n',
        V = /([^"\s?>\/]+)\s*=\s*((?:")([^"]*)(?:")|(?:')([^']*)(?:')|([^'">\s]+))/g,
        W = /<[\/\?]?[a-zA-Z0-9:]+(?:\s+[^"\s?>\/]+\s*=\s*(?:"[^"]*"|'[^']*'|[^'">\s=]+))*\s?[\/\?]?>/g;
    z.match(W) || (W = /<[^>]*>/g);
    var X = /<\w*:/, j = /<(\/?)\w+:/;

    function ve(e, t) {
        for (var r = {}, n = 0, a = 0; n !== e.length && (32 !== (a = e.charCodeAt(n)) && 10 !== a && 13 !== a); ++n) ;
        if (t || (r[0] = e.slice(0, n)), n === e.length) return r;
        var s = e.match(V), i = 0, o = "", l = 0, c = "", f = "", h = 1;
        if (s) for (l = 0; l != s.length; ++l) {
            for (f = s[l], a = 0; a != f.length && 61 !== f.charCodeAt(a); ++a) ;
            for (c = f.slice(0, a).trim(); 32 == f.charCodeAt(a + 1);) ++a;
            for (h = 34 == (n = f.charCodeAt(a + 1)) || 39 == n ? 1 : 0, o = f.slice(a + 1 + h, f.length - h), i = 0; i != c.length && 58 !== c.charCodeAt(i); ++i) ;
            if (i === c.length) 0 < c.indexOf("_") && (c = c.slice(0, c.indexOf("_"))), r[c] = o, r[c.toLowerCase()] = o; else {
                var u = (5 === i && "xmlns" === c.slice(0, 5) ? "xmlns" : "") + c.slice(i + 1);
                if (r[u] && "ext" == c.slice(i - 3, i)) continue;
                r[u] = o, r[u.toLowerCase()] = o
            }
        }
        return r
    }

    function G(e) {
        return e.replace(j, "<$1")
    }

    var Y, J, Ee = {"&quot;": '"', "&apos;": "'", "&gt;": ">", "&lt;": "<", "&amp;": "&"}, we = S(Ee),
        Se = (Y = /&(?:quot|apos|gt|lt|amp|#x?([\da-fA-F]+));/g, J = /_x([\da-fA-F]{4})_/g, function e(t) {
            var r = t + "", n = r.indexOf("<![CDATA[");
            if (-1 == n) return r.replace(Y, function (e, t) {
                return Ee[e] || String.fromCharCode(parseInt(t, -1 < e.indexOf("x") ? 16 : 10)) || e
            }).replace(J, function (e, t) {
                return String.fromCharCode(parseInt(t, 16))
            });
            var a = r.indexOf("]]>");
            return e(r.slice(0, n)) + r.slice(n + 9, a) + e(r.slice(a + 3))
        }), _e = /[&<>'"]/g, ye = /[\u0000-\u0008\u000b-\u001f]/g;

    function Ce(e) {
        return (e + "").replace(_e, function (e) {
            return we[e]
        }).replace(ye, function (e) {
            return "_x" + ("000" + e.charCodeAt(0).toString(16)).slice(-4) + "_"
        })
    }

    function Be(e) {
        return Ce(e).replace(/ /g, "_x0020_")
    }

    var Te = /[\u0000-\u001f]/g;

    function ke(e) {
        return (e + "").replace(_e, function (e) {
            return we[e]
        }).replace(/\n/g, "<br/>").replace(Te, function (e) {
            return "&#x" + ("000" + e.charCodeAt(0).toString(16)).slice(-4) + ";"
        })
    }

    var xe, Ae = (xe = /&#(\d+);/g, function (e) {
        return e.replace(xe, Ie)
    });

    function Ie(e, t) {
        return String.fromCharCode(parseInt(t, 10))
    }

    var Re = function (e) {
        return e.replace(/(\r\n|[\r\n])/g, "&#10;")
    };

    function Oe(e) {
        switch (e) {
            case 1:
            case!0:
            case"1":
            case"true":
            case"TRUE":
                return !0;
            default:
                return !1
        }
    }

    var Fe = function (e) {
        for (var t = "", r = 0, n = 0, a = 0, s = 0, i = 0, o = 0; r < e.length;) (n = e.charCodeAt(r++)) < 128 ? t += String.fromCharCode(n) : (a = e.charCodeAt(r++), 191 < n && n < 224 ? (i = (31 & n) << 6, i |= 63 & a, t += String.fromCharCode(i)) : (s = e.charCodeAt(r++), n < 240 ? t += String.fromCharCode((15 & n) << 12 | (63 & a) << 6 | 63 & s) : (o = ((7 & n) << 18 | (63 & a) << 12 | (63 & s) << 6 | 63 & (i = e.charCodeAt(r++))) - 65536, t += String.fromCharCode(55296 + (o >>> 10 & 1023)), t += String.fromCharCode(56320 + (1023 & o)))));
        return t
    }, De = function (e) {
        for (var t = [], r = 0, n = 0, a = 0; r < e.length;) switch (!0) {
            case(n = e.charCodeAt(r++)) < 128:
                t.push(String.fromCharCode(n));
                break;
            case n < 2048:
                t.push(String.fromCharCode(192 + (n >> 6))), t.push(String.fromCharCode(128 + (63 & n)));
                break;
            case 55296 <= n && n < 57344:
                n -= 55296, a = e.charCodeAt(r++) - 56320 + (n << 10), t.push(String.fromCharCode(240 + (a >> 18 & 7))), t.push(String.fromCharCode(144 + (a >> 12 & 63))), t.push(String.fromCharCode(128 + (a >> 6 & 63))), t.push(String.fromCharCode(128 + (63 & a)));
                break;
            default:
                t.push(String.fromCharCode(224 + (n >> 12))), t.push(String.fromCharCode(128 + (n >> 6 & 63))), t.push(String.fromCharCode(128 + (63 & n)))
        }
        return t.join("")
    };
    if (ee) {
        function Pe(e) {
            var t, r, n, a = Buffer.alloc(2 * e.length), s = 1, i = 0, o = 0;
            for (r = 0; r < e.length; r += s) s = 1, (n = e.charCodeAt(r)) < 128 ? t = n : n < 224 ? (t = 64 * (31 & n) + (63 & e.charCodeAt(r + 1)), s = 2) : n < 240 ? (t = 4096 * (15 & n) + 64 * (63 & e.charCodeAt(r + 1)) + (63 & e.charCodeAt(r + 2)), s = 3) : (s = 4, t = 262144 * (7 & n) + 4096 * (63 & e.charCodeAt(r + 1)) + 64 * (63 & e.charCodeAt(r + 2)) + (63 & e.charCodeAt(r + 3)), o = 55296 + ((t -= 65536) >>> 10 & 1023), t = 56320 + (1023 & t)), 0 !== o && (a[i++] = 255 & o, a[i++] = o >>> 8, o = 0), a[i++] = t % 256, a[i++] = t >>> 8;
            return a.slice(0, i).toString("ucs2")
        }

        var Ne = "foo bar bazâð£";
        Fe(Ne) == Pe(Ne) && (Fe = Pe);

        function Le(e) {
            return s(e, "binary").toString("utf8")
        }

        Fe(Ne) == Le(Ne) && (Fe = Le), De = function (e) {
            return s(e, "utf8").toString("binary")
        }
    }
    var Me, Ue, He, ze = (Me = {}, function (e, t) {
            var r = e + "|" + (t || "");
            return Me[r] ? Me[r] : Me[r] = new RegExp("<(?:\\w+:)?" + e + '(?: xml:space="preserve")?(?:[^>]*)>([\\s\\S]*?)</(?:\\w+:)?' + e + ">", t || "")
        }),
        Ve = (Ue = [["nbsp", " "], ["middot", "·"], ["quot", '"'], ["apos", "'"], ["gt", ">"], ["lt", "<"], ["amp", "&"]].map(function (e) {
            return [new RegExp("&" + e[0] + ";", "g"), e[1]]
        }), function (e) {
            for (var t = e.replace(/^[\t\n\r ]+/, "").replace(/[\t\n\r ]+$/, "").replace(/[\t\n\r ]+/g, " ").replace(/<\s*[bB][rR]\s*\/?>/g, "\n").replace(/<[^>]*>/g, ""), r = 0; r < Ue.length; ++r) t = t.replace(Ue[r][0], Ue[r][1]);
            return t
        }), We = (He = {}, function (e) {
            return void 0 !== He[e] ? He[e] : He[e] = new RegExp("<(?:vt:)?" + e + ">([\\s\\S]*?)</(?:vt:)?" + e + ">", "g")
        }), Xe = /<\/?(?:vt:)?variant>/g, je = /<(?:vt:)([^>]*)>([\s\S]*)</;

    function Ge(e, t) {
        var r = ve(e), n = e.match(We(r.baseType)) || [], a = [];
        if (n.length == r.size) return n.forEach(function (e) {
            var t = e.replace(Xe, "").match(je);
            t && a.push({v: Fe(t[2]), t: t[1]})
        }), a;
        if (t.WTF) throw new Error("unexpected vector length " + n.length + " != " + r.size);
        return a
    }

    var $e = /(^\s|\s$|\n)/;

    function Ye(e, t) {
        return "<" + e + (t.match($e) ? ' xml:space="preserve"' : "") + ">" + t + "</" + e + ">"
    }

    function Ke(t) {
        return ge(t).map(function (e) {
            return " " + e + '="' + t[e] + '"'
        }).join("")
    }

    function Ze(e, t, r) {
        return "<" + e + (null != r ? Ke(r) : "") + (null != t ? (t.match($e) ? ' xml:space="preserve"' : "") + ">" + t + "</" + e : "/") + ">"
    }

    function Qe(e, t) {
        try {
            return e.toISOString().replace(/\.\d*/, "")
        } catch (e) {
            if (t) throw e
        }
        return ""
    }

    var Je = {
        dc: "http://purl.org/dc/elements/1.1/",
        dcterms: "http://purl.org/dc/terms/",
        dcmitype: "http://purl.org/dc/dcmitype/",
        mx: "http://schemas.microsoft.com/office/mac/excel/2008/main",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        sjs: "http://schemas.openxmlformats.org/package/2006/sheetjs/core-properties",
        vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        xsd: "http://www.w3.org/2001/XMLSchema",
        main: ["http://schemas.openxmlformats.org/spreadsheetml/2006/main", "http://purl.oclc.org/ooxml/spreadsheetml/main", "http://schemas.microsoft.com/office/excel/2006/main", "http://schemas.microsoft.com/office/excel/2006/2"]
    }, qe = {
        o: "urn:schemas-microsoft-com:office:office",
        x: "urn:schemas-microsoft-com:office:excel",
        ss: "urn:schemas-microsoft-com:office:spreadsheet",
        dt: "uuid:C2F41010-65B3-11d1-A29F-00AA00C14882",
        mv: "http://macVmlSchemaUri",
        v: "urn:schemas-microsoft-com:vml",
        html: "http://www.w3.org/TR/REC-html40"
    };
    var et, tt, rt = function (e) {
        for (var t = [], r = 0; r < e[0].length; ++r) if (e[0][r]) for (var n = 0, a = e[0][r].length; n < a; n += 10240) t.push.apply(t, e[0][r].slice(n, n + 10240));
        return t
    }, nt = rt, at = function (e, t, r) {
        for (var n = [], a = t; a < r; a += 2) n.push(String.fromCharCode(_t(e, a)));
        return n.join("").replace(oe, "")
    }, st = at, it = function (e, t, r) {
        for (var n = [], a = t; a < t + r; ++a) n.push(("0" + e[a].toString(16)).slice(-2));
        return n.join("")
    }, ot = it, lt = function (e, t, r) {
        for (var n = [], a = t; a < r; a++) n.push(String.fromCharCode(St(e, a)));
        return n.join("")
    }, ct = lt, ft = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? lt(e, t + 4, t + 4 + r - 1) : ""
    }, ht = ft, ut = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? lt(e, t + 4, t + 4 + r - 1) : ""
    }, dt = ut, pt = function (e, t) {
        var r = 2 * Ct(e, t);
        return 0 < r ? lt(e, t + 4, t + 4 + r - 1) : ""
    }, mt = pt;
    et = tt = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? at(e, t + 4, t + 4 + r) : ""
    };
    var gt, bt, vt = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? lt(e, t + 4, t + 4 + r) : ""
    }, Et = vt;
    gt = bt = function (e, t) {
        return function (e, t) {
            for (var r = 1 - 2 * (e[t + 7] >>> 7), n = ((127 & e[t + 7]) << 4) + (e[t + 6] >>> 4 & 15), a = 15 & e[t + 6], s = 5; 0 <= s; --s) a = 256 * a + e[t + s];
            return 2047 == n ? 0 == a ? 1 / 0 * r : NaN : (0 == n ? n = -1022 : (n -= 1023, a += Math.pow(2, 52)), r * Math.pow(2, n - 52) * a)
        }(e, t)
    };
    var wt = function (e) {
        return Array.isArray(e)
    };
    ee && (at = function (e, t, r) {
        return Buffer.isBuffer(e) ? e.toString("utf16le", t, r).replace(oe, "") : st(e, t, r)
    }, it = function (e, t, r) {
        return Buffer.isBuffer(e) ? e.toString("hex", t, t + r) : ot(e, t, r)
    }, ft = function (e, t) {
        if (!Buffer.isBuffer(e)) return ht(e, t);
        var r = e.readUInt32LE(t);
        return 0 < r ? e.toString("utf8", t + 4, t + 4 + r - 1) : ""
    }, ut = function (e, t) {
        if (!Buffer.isBuffer(e)) return dt(e, t);
        var r = e.readUInt32LE(t);
        return 0 < r ? e.toString("utf8", t + 4, t + 4 + r - 1) : ""
    }, pt = function (e, t) {
        if (!Buffer.isBuffer(e)) return mt(e, t);
        var r = 2 * e.readUInt32LE(t);
        return e.toString("utf16le", t + 4, t + 4 + r - 1)
    }, et = function (e, t) {
        if (!Buffer.isBuffer(e)) return tt(e, t);
        var r = e.readUInt32LE(t);
        return e.toString("utf16le", t + 4, t + 4 + r)
    }, vt = function (e, t) {
        if (!Buffer.isBuffer(e)) return Et(e, t);
        var r = e.readUInt32LE(t);
        return e.toString("utf8", t + 4, t + 4 + r)
    }, lt = function (e, t, r) {
        return Buffer.isBuffer(e) ? e.toString("utf8", t, r) : ct(e, t, r)
    }, rt = function (e) {
        return 0 < e[0].length && Buffer.isBuffer(e[0][0]) ? Buffer.concat(e[0]) : nt(e)
    }, ie = function (e) {
        return Buffer.isBuffer(e[0]) ? Buffer.concat(e) : [].concat.apply([], e)
    }, gt = function (e, t) {
        return Buffer.isBuffer(e) ? e.readDoubleLE(t) : bt(e, t)
    }, wt = function (e) {
        return Buffer.isBuffer(e) || Array.isArray(e)
    }), "undefined" != typeof cptable && (at = function (e, t, r) {
        return cptable.utils.decode(1200, e.slice(t, r)).replace(oe, "")
    }, lt = function (e, t, r) {
        return cptable.utils.decode(65001, e.slice(t, r))
    }, ft = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? cptable.utils.decode(a, e.slice(t + 4, t + 4 + r - 1)) : ""
    }, ut = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? cptable.utils.decode(u, e.slice(t + 4, t + 4 + r - 1)) : ""
    }, pt = function (e, t) {
        var r = 2 * Ct(e, t);
        return 0 < r ? cptable.utils.decode(1200, e.slice(t + 4, t + 4 + r - 1)) : ""
    }, et = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? cptable.utils.decode(1200, e.slice(t + 4, t + 4 + r)) : ""
    }, vt = function (e, t) {
        var r = Ct(e, t);
        return 0 < r ? cptable.utils.decode(65001, e.slice(t + 4, t + 4 + r)) : ""
    });
    var St = function (e, t) {
        return e[t]
    }, _t = function (e, t) {
        return 256 * e[t + 1] + e[t]
    }, yt = function (e, t) {
        var r = 256 * e[t + 1] + e[t];
        return r < 32768 ? r : -1 * (65535 - r + 1)
    }, Ct = function (e, t) {
        return e[t + 3] * (1 << 24) + (e[t + 2] << 16) + (e[t + 1] << 8) + e[t]
    }, Bt = function (e, t) {
        return e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t]
    }, Tt = function (e, t) {
        return e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]
    };

    function kt(e, t) {
        var r, n, a, s, i, o, l = "", c = [];
        switch (t) {
            case"dbcs":
                if (o = this.l, ee && Buffer.isBuffer(this)) l = this.slice(this.l, this.l + 2 * e).toString("utf16le"); else for (i = 0; i < e; ++i) l += String.fromCharCode(_t(this, o)), o += 2;
                e *= 2;
                break;
            case"utf8":
                l = lt(this, this.l, this.l + e);
                break;
            case"utf16le":
                e *= 2, l = at(this, this.l, this.l + e);
                break;
            case"wstr":
                if ("undefined" == typeof cptable) return kt.call(this, e, "dbcs");
                l = cptable.utils.decode(u, this.slice(this.l, this.l + 2 * e)), e *= 2;
                break;
            case"lpstr-ansi":
                l = ft(this, this.l), e = 4 + Ct(this, this.l);
                break;
            case"lpstr-cp":
                l = ut(this, this.l), e = 4 + Ct(this, this.l);
                break;
            case"lpwstr":
                l = pt(this, this.l), e = 4 + 2 * Ct(this, this.l);
                break;
            case"lpp4":
                e = 4 + Ct(this, this.l), l = et(this, this.l), 2 & e && (e += 2);
                break;
            case"8lpp4":
                e = 4 + Ct(this, this.l), l = vt(this, this.l), 3 & e && (e += 4 - (3 & e));
                break;
            case"cstr":
                for (e = 0, l = ""; 0 !== (a = St(this, this.l + e++));) c.push(p(a));
                l = c.join("");
                break;
            case"_wstr":
                for (e = 0, l = ""; 0 !== (a = _t(this, this.l + e));) c.push(p(a)), e += 2;
                e += 2, l = c.join("");
                break;
            case"dbcs-cont":
                for (l = "", o = this.l, i = 0; i < e; ++i) {
                    if (this.lens && -1 !== this.lens.indexOf(o)) return a = St(this, o), this.l = o + 1, s = kt.call(this, e - i, a ? "dbcs-cont" : "sbcs-cont"), c.join("") + s;
                    c.push(p(_t(this, o))), o += 2
                }
                l = c.join(""), e *= 2;
                break;
            case"cpstr":
                if ("undefined" != typeof cptable) {
                    l = cptable.utils.decode(u, this.slice(this.l, this.l + e));
                    break
                }
            case"sbcs-cont":
                for (l = "", o = this.l, i = 0; i != e; ++i) {
                    if (this.lens && -1 !== this.lens.indexOf(o)) return a = St(this, o), this.l = o + 1, s = kt.call(this, e - i, a ? "dbcs-cont" : "sbcs-cont"), c.join("") + s;
                    c.push(p(St(this, o))), o += 1
                }
                l = c.join("");
                break;
            default:
                switch (e) {
                    case 1:
                        return r = St(this, this.l), this.l++, r;
                    case 2:
                        return r = ("i" === t ? yt : _t)(this, this.l), this.l += 2, r;
                    case 4:
                    case-4:
                        return "i" === t || 0 == (128 & this[this.l + 3]) ? (r = (0 < e ? Bt : Tt)(this, this.l), this.l += 4, r) : (n = Ct(this, this.l), this.l += 4, n);
                    case 8:
                    case-8:
                        if ("f" === t) return n = 8 == e ? gt(this, this.l) : gt([this[this.l + 7], this[this.l + 6], this[this.l + 5], this[this.l + 4], this[this.l + 3], this[this.l + 2], this[this.l + 1], this[this.l + 0]], 0), this.l += 8, n;
                        e = 8;
                    case 16:
                        l = it(this, this.l, e)
                }
        }
        return this.l += e, l
    }

    var xt = function (e, t, r) {
        e[r] = 255 & t, e[r + 1] = t >>> 8 & 255, e[r + 2] = t >>> 16 & 255, e[r + 3] = t >>> 24 & 255
    }, At = function (e, t, r) {
        e[r] = 255 & t, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255
    }, It = function (e, t, r) {
        e[r] = 255 & t, e[r + 1] = t >>> 8 & 255
    };

    function Rt(e, t, r) {
        var n = 0, a = 0;
        if ("dbcs" === r) {
            for (a = 0; a != t.length; ++a) It(this, t.charCodeAt(a), this.l + 2 * a);
            n = 2 * t.length
        } else if ("sbcs" === r) {
            for (t = t.replace(/[^\x00-\x7F]/g, "_"), a = 0; a != t.length; ++a) this[this.l + a] = 255 & t.charCodeAt(a);
            n = t.length
        } else {
            if ("hex" === r) {
                for (; a < e; ++a) this[this.l++] = parseInt(t.slice(2 * a, 2 * a + 2), 16) || 0;
                return this
            }
            if ("utf16le" === r) {
                var s = Math.min(this.l + e, this.length);
                for (a = 0; a < Math.min(t.length, e); ++a) {
                    var i = t.charCodeAt(a);
                    this[this.l++] = 255 & i, this[this.l++] = i >> 8
                }
                for (; this.l < s;) this[this.l++] = 0;
                return this
            }
            switch (e) {
                case 1:
                    n = 1, this[this.l] = 255 & t;
                    break;
                case 2:
                    n = 2, this[this.l] = 255 & t, t >>>= 8, this[this.l + 1] = 255 & t;
                    break;
                case 3:
                    n = 3, this[this.l] = 255 & t, t >>>= 8, this[this.l + 1] = 255 & t, t >>>= 8, this[this.l + 2] = 255 & t;
                    break;
                case 4:
                    n = 4, xt(this, t, this.l);
                    break;
                case 8:
                    if (n = 8, "f" === r) {
                        !function (e, t, r) {
                            var n = (t < 0 || 1 / t == -1 / 0 ? 1 : 0) << 7, a = 0, s = 0, i = n ? -t : t;
                            isFinite(i) ? 0 == i ? a = s = 0 : (a = Math.floor(Math.log(i) / Math.LN2), s = i * Math.pow(2, 52 - a), a <= -1023 && (!isFinite(s) || s < Math.pow(2, 52)) ? a = -1022 : (s -= Math.pow(2, 52), a += 1023)) : (a = 2047, s = isNaN(t) ? 26985 : 0);
                            for (var o = 0; o <= 5; ++o, s /= 256) e[r + o] = 255 & s;
                            e[r + 6] = (15 & a) << 4 | 15 & s, e[r + 7] = a >> 4 | n
                        }(this, t, this.l);
                        break
                    }
                case 16:
                    break;
                case-4:
                    n = 4, At(this, t, this.l)
            }
        }
        return this.l += n, this
    }

    function Ot(e, t) {
        var r = it(this, this.l, e.length >> 1);
        if (r !== e) throw new Error(t + "Expected " + e + " saw " + r);
        this.l += e.length >> 1
    }

    function Ft(e, t) {
        e.l = t, e.read_shift = kt, e.chk = Ot, e.write_shift = Rt
    }

    function Dt(e, t) {
        e.l += t
    }

    function Pt(e) {
        var t = te(e);
        return Ft(t, 0), t
    }

    function Nt(e, t, r) {
        if (e) {
            var n, a, s;
            Ft(e, e.l || 0);
            for (var i = e.length, o = 0, l = 0; e.l < i;) {
                128 & (o = e.read_shift(1)) && (o = (127 & o) + ((127 & e.read_shift(1)) << 7));
                var c = Wc[o] || Wc[65535];
                for (s = 127 & (n = e.read_shift(1)), a = 1; a < 4 && 128 & n; ++a) s += (127 & (n = e.read_shift(1))) << 7 * a;
                l = e.l + s;
                var f = (c.f || Dt)(e, s, r);
                if (e.l = l, t(f, c.n, o)) return
            }
        }
    }

    function Lt() {
        function t(e) {
            var t = Pt(e);
            return Ft(t, 0), t
        }

        function r() {
            s && (s.length > s.l && ((s = s.slice(0, s.l)).l = s.length), 0 < s.length && e.push(s), s = null)
        }

        function n(e) {
            return s && e < s.length - s.l ? s : (r(), s = t(Math.max(e + 1, a)))
        }

        var e = [], a = ee ? 256 : 2048, s = t(a);
        return {
            next: n, push: function (e) {
                r(), null == (s = e).l && (s.l = s.length), n(a)
            }, end: function () {
                return r(), rt([e])
            }, _bufs: e
        }
    }

    function Mt(e, t, r, n) {
        var a, s = +Xc[t];
        if (!isNaN(s)) {
            a = 1 + (128 <= s ? 1 : 0) + 1, 128 <= (n = n || (Wc[s].p || (r || []).length || 0)) && ++a, 16384 <= n && ++a, 2097152 <= n && ++a;
            var i = e.next(a);
            s <= 127 ? i.write_shift(1, s) : (i.write_shift(1, 128 + (127 & s)), i.write_shift(1, s >> 7));
            for (var o = 0; 4 != o; ++o) {
                if (!(128 <= n)) {
                    i.write_shift(1, n);
                    break
                }
                i.write_shift(1, 128 + (127 & n)), n >>= 7
            }
            0 < n && wt(r) && e.push(r)
        }
    }

    function Ut(e, t, r) {
        var n = be(e);
        if (t.s ? (n.cRel && (n.c += t.s.c), n.rRel && (n.r += t.s.r)) : (n.cRel && (n.c += t.c), n.rRel && (n.r += t.r)), !r || r.biff < 12) {
            for (; 256 <= n.c;) n.c -= 256;
            for (; 65536 <= n.r;) n.r -= 65536
        }
        return n
    }

    function Ht(e, t, r) {
        var n = be(e);
        return n.s = Ut(n.s, t.s, r), n.e = Ut(n.e, t.s, r), n
    }

    function zt(e, t) {
        e.cRel && e.c < 0 && ((e = be(e)).c += 8 < t ? 16384 : 256), e.rRel && e.r < 0 && ((e = be(e)).r += 8 < t ? 1048576 : 5 < t ? 65536 : 16384);
        var r = Kt(e);
        return 0 === e.cRel && (r = r.replace(/^([A-Z])/, "$$$1")), 0 === e.rRel && (r = r.replace(/([A-Z]|^)(\d+)$/, "$1$$$2")), r
    }

    function Vt(e, t) {
        return 0 != e.s.r || e.s.rRel || e.e.r != (12 <= t.biff ? 1048575 : 8 <= t.biff ? 65536 : 16384) || e.e.rRel ? 0 != e.s.c || e.s.cRel || e.e.c != (12 <= t.biff ? 65535 : 255) || e.e.cRel ? zt(e.s, t.biff) + ":" + zt(e.e, t.biff) : (e.s.rRel ? "" : "$") + Xt(e.s.r) + ":" + (e.e.rRel ? "" : "$") + Xt(e.e.r) : (e.s.cRel ? "" : "$") + Gt(e.s.c) + ":" + (e.e.cRel ? "" : "$") + Gt(e.e.c)
    }

    function Wt(e) {
        return parseInt(e.replace(/\$(\d+)$/, "$1"), 10) - 1
    }

    function Xt(e) {
        return "" + (e + 1)
    }

    function jt(e) {
        for (var t = e.replace(/^\$([A-Z])/, "$1"), r = 0, n = 0; n !== t.length; ++n) r = 26 * r + t.charCodeAt(n) - 64;
        return r - 1
    }

    function Gt(e) {
        var t = "";
        for (++e; e; e = Math.floor((e - 1) / 26)) t = String.fromCharCode((e - 1) % 26 + 65) + t;
        return t
    }

    function $t(e) {
        return e.replace(/(\$?[A-Z]*)(\$?\d*)/, "$1,$2").split(",")
    }

    function Yt(e) {
        var t = $t(e);
        return {c: jt(t[0]), r: Wt(t[1])}
    }

    function Kt(e) {
        return Gt(e.c) + Xt(e.r)
    }

    function Zt(e) {
        var t = e.split(":").map(Yt);
        return {s: t[0], e: t[t.length - 1]}
    }

    function Qt(e, t) {
        return void 0 === t || "number" == typeof t ? Qt(e.s, e.e) : ("string" != typeof e && (e = Kt(e)), "string" != typeof t && (t = Kt(t)), e == t ? e : e + ":" + t)
    }

    function Jt(e) {
        var t = {s: {c: 0, r: 0}, e: {c: 0, r: 0}}, r = 0, n = 0, a = 0, s = e.length;
        for (r = 0; n < s && !((a = e.charCodeAt(n) - 64) < 1 || 26 < a); ++n) r = 26 * r + a;
        for (t.s.c = --r, r = 0; n < s && !((a = e.charCodeAt(n) - 48) < 0 || 9 < a); ++n) r = 10 * r + a;
        if (t.s.r = --r, n === s || 58 === e.charCodeAt(++n)) return t.e.c = t.s.c, t.e.r = t.s.r, t;
        for (r = 0; n != s && !((a = e.charCodeAt(n) - 64) < 1 || 26 < a); ++n) r = 26 * r + a;
        for (t.e.c = --r, r = 0; n != s && !((a = e.charCodeAt(n) - 48) < 0 || 9 < a); ++n) r = 10 * r + a;
        return t.e.r = --r, t
    }

    function qt(e, t) {
        var r = "d" == e.t && t instanceof Date;
        if (null != e.z) try {
            return e.w = de.format(e.z, r ? K(t) : t)
        } catch (e) {
        }
        try {
            return e.w = de.format((e.XF || {}).numFmtId || (r ? 14 : 0), r ? K(t) : t)
        } catch (e) {
            return "" + t
        }
    }

    function er(e, t, r) {
        return null == e || null == e.t || "z" == e.t ? "" : void 0 !== e.w ? e.w : ("d" == e.t && !e.z && r && r.dateNF && (e.z = r.dateNF), qt(e, null == t ? e.v : t))
    }

    function tr(e, t) {
        var r = t && t.sheet ? t.sheet : "Sheet1", n = {};
        return n[r] = e, {SheetNames: [r], Sheets: n}
    }

    function rr(e, t, r) {
        var n = r || {}, a = e ? Array.isArray(e) : n.dense;
        null != ue && null == a && (a = ue);
        var s = e || (a ? [] : {}), i = 0, o = 0;
        if (s && null != n.origin) if ("number" == typeof n.origin) i = n.origin; else {
            var l = "string" == typeof n.origin ? Yt(n.origin) : n.origin;
            i = l.r, o = l.c
        }
        var c = {s: {c: 1e7, r: 1e7}, e: {c: 0, r: 0}};
        if (s["!ref"]) {
            var f = Jt(s["!ref"]);
            c.s.c = f.s.c, c.s.r = f.s.r, c.e.c = Math.max(c.e.c, f.e.c), c.e.r = Math.max(c.e.r, f.e.r), -1 == i && (c.e.r = i = f.e.r + 1)
        }
        for (var h = 0; h != t.length; ++h) if (t[h]) {
            if (!Array.isArray(t[h])) throw new Error("aoa_to_sheet expects an array of arrays");
            for (var u = 0; u != t[h].length; ++u) if (void 0 !== t[h][u]) {
                var d = {v: t[h][u]}, p = i + h, m = o + u;
                if (c.s.r > p && (c.s.r = p), c.s.c > m && (c.s.c = m), c.e.r < p && (c.e.r = p), c.e.c < m && (c.e.c = m), !t[h][u] || "object" != typeof t[h][u] || Array.isArray(t[h][u]) || t[h][u] instanceof Date) if (Array.isArray(d.v) && (d.f = t[h][u][1], d.v = d.v[0]), null === d.v) if (d.f) d.t = "n"; else {
                    if (!n.sheetStubs) continue;
                    d.t = "z"
                } else "number" == typeof d.v ? d.t = "n" : "boolean" == typeof d.v ? d.t = "b" : d.v instanceof Date ? (d.z = n.dateNF || de._table[14], n.cellDates ? (d.t = "d", d.w = de.format(d.z, K(d.v))) : (d.t = "n", d.v = K(d.v), d.w = de.format(d.z, d.v))) : d.t = "s"; else d = t[h][u];
                if (a) s[p] || (s[p] = []), s[p][m] = d; else s[Kt({c: m, r: p})] = d
            }
        }
        return c.s.c < 1e7 && (s["!ref"] = Qt(c)), s
    }

    function nr(e, t) {
        return rr(null, e, t)
    }

    function ar(e, t) {
        return (t = t || Pt(4)).write_shift(4, e), t
    }

    function sr(e) {
        var t = e.read_shift(4);
        return 0 === t ? "" : e.read_shift(t, "dbcs")
    }

    function ir(e, t) {
        var r = !1;
        return null == t && (r = !0, t = Pt(4 + 2 * e.length)), t.write_shift(4, e.length), 0 < e.length && t.write_shift(0, e, "dbcs"), r ? t.slice(0, t.l) : t
    }

    function or(e, t) {
        var r, n = e.l, a = e.read_shift(1), s = sr(e), i = [], o = {t: s, h: s};
        if (0 != (1 & a)) {
            for (var l = e.read_shift(4), c = 0; c != l; ++c) i.push({
                ich: (r = e).read_shift(2),
                ifnt: r.read_shift(2)
            });
            o.r = i
        } else o.r = [{ich: 0, ifnt: 0}];
        return e.l = n + t, o
    }

    !function (e, t) {
        var r;
        if (void 0 !== t) r = t; else if ("undefined" != typeof require) try {
            r = void 0
        } catch (e) {
            r = null
        }
        e.rc4 = function (e, t) {
            var r = new Array(256), n = 0, a = 0, s = 0, i = 0;
            for (a = 0; 256 != a; ++a) r[a] = a;
            for (a = 0; 256 != a; ++a) s = s + r[a] + e[a % e.length].charCodeAt(0) & 255, i = r[a], r[a] = r[s], r[s] = i;
            a = s = 0;
            var o = Buffer(t.length);
            for (n = 0; n != t.length; ++n) s = (s + r[a = a + 1 & 255]) % 256, i = r[a], r[a] = r[s], r[s] = i, o[n] = t[n] ^ r[r[a] + r[s] & 255];
            return o
        }, e.md5 = function (e) {
            if (!r) throw new Error("Unsupported crypto");
            return r.createHash("md5").update(e).digest("hex")
        }
    }({}, "undefined" != typeof crypto ? crypto : void 0);
    var lr = or;

    function cr(e, t) {
        var r, n, a = !1;
        return null == t && (a = !0, t = Pt(23 + 4 * e.t.length)), t.write_shift(1, 1), ir(e.t, t), t.write_shift(4, 1), r = {
            ich: 0,
            ifnt: 0
        }, (n = (n = t) || Pt(4)).write_shift(2, r.ich || 0), n.write_shift(2, r.ifnt || 0), a ? t.slice(0, t.l) : t
    }

    function fr(e) {
        var t = e.read_shift(4), r = e.read_shift(2);
        return r += e.read_shift(1) << 16, e.l++, {c: t, iStyleRef: r}
    }

    function hr(e, t) {
        return null == t && (t = Pt(8)), t.write_shift(-4, e.c), t.write_shift(3, e.iStyleRef || e.s), t.write_shift(1, 0), t
    }

    var ur = sr, dr = ir;

    function pr(e) {
        var t = e.read_shift(4);
        return 0 === t || 4294967295 === t ? "" : e.read_shift(t, "dbcs")
    }

    function mr(e, t) {
        var r = !1;
        return null == t && (r = !0, t = Pt(127)), t.write_shift(4, 0 < e.length ? e.length : 4294967295), 0 < e.length && t.write_shift(0, e, "dbcs"), r ? t.slice(0, t.l) : t
    }

    var gr = sr, br = pr, vr = mr;

    function Er(e) {
        var t = e.slice(e.l, e.l + 4), r = 1 & t[0], n = 2 & t[0];
        e.l += 4, t[0] &= 252;
        var a = 0 == n ? gt([0, 0, 0, 0, t[0], t[1], t[2], t[3]], 0) : Bt(t, 0) >> 2;
        return r ? a / 100 : a
    }

    function wr(e) {
        var t = {s: {}, e: {}};
        return t.s.r = e.read_shift(4), t.e.r = e.read_shift(4), t.s.c = e.read_shift(4), t.e.c = e.read_shift(4), t
    }

    var Sr = wr, _r = function (e, t) {
        return (t = t || Pt(16)).write_shift(4, e.s.r), t.write_shift(4, e.e.r), t.write_shift(4, e.s.c), t.write_shift(4, e.e.c), t
    };

    function yr(e) {
        return e.read_shift(8, "f")
    }

    function Cr(e, t) {
        return (t || Pt(8)).write_shift(8, e, "f")
    }

    var Br = {
        0: "#NULL!",
        7: "#DIV/0!",
        15: "#VALUE!",
        23: "#REF!",
        29: "#NAME?",
        36: "#NUM!",
        42: "#N/A",
        43: "#GETTING_DATA",
        255: "#WTF?"
    }, Tr = C(Br);

    function kr(e, t) {
        if (t = t || Pt(8), !e || e.auto) return t.write_shift(4, 0), t.write_shift(4, 0), t;
        e.index ? (t.write_shift(1, 2), t.write_shift(1, e.index)) : e.theme ? (t.write_shift(1, 6), t.write_shift(1, e.theme)) : (t.write_shift(1, 5), t.write_shift(1, 0));
        var r = e.tint || 0;
        if (0 < r ? r *= 32767 : r < 0 && (r *= 32768), t.write_shift(2, r), e.rgb) {
            var n = e.rgb || "FFFFFF";
            t.write_shift(1, parseInt(n.slice(0, 2), 16)), t.write_shift(1, parseInt(n.slice(2, 4), 16)), t.write_shift(1, parseInt(n.slice(4, 6), 16)), t.write_shift(1, 255)
        } else t.write_shift(2, 0), t.write_shift(1, 0), t.write_shift(1, 0);
        return t
    }

    function xr(e, t) {
        var r = e.read_shift(4);
        switch (r) {
            case 0:
                return "";
            case 4294967295:
            case 4294967294:
                return {2: "BITMAP", 3: "METAFILEPICT", 8: "DIB", 14: "ENHMETAFILE"}[e.read_shift(4)] || ""
        }
        if (400 < r) throw new Error("Unsupported Clipboard: " + r.toString(16));
        return e.l -= 4, e.read_shift(0, 1 == t ? "lpstr" : "lpwstr")
    }

    var Ar = 2, Ir = 3, Rr = 12, Or = 81, Fr = [80, Or], Dr = {
        1: {n: "CodePage", t: Ar},
        2: {n: "Category", t: 80},
        3: {n: "PresentationFormat", t: 80},
        4: {n: "ByteCount", t: Ir},
        5: {n: "LineCount", t: Ir},
        6: {n: "ParagraphCount", t: Ir},
        7: {n: "SlideCount", t: Ir},
        8: {n: "NoteCount", t: Ir},
        9: {n: "HiddenCount", t: Ir},
        10: {n: "MultimediaClipCount", t: Ir},
        11: {n: "ScaleCrop", t: 11},
        12: {n: "HeadingPairs", t: 4096 | Rr},
        13: {n: "TitlesOfParts", t: 4126},
        14: {n: "Manager", t: 80},
        15: {n: "Company", t: 80},
        16: {n: "LinksUpToDate", t: 11},
        17: {n: "CharacterCount", t: Ir},
        19: {n: "SharedDoc", t: 11},
        22: {n: "HyperlinksChanged", t: 11},
        23: {n: "AppVersion", t: Ir, p: "version"},
        24: {n: "DigSig", t: 65},
        26: {n: "ContentType", t: 80},
        27: {n: "ContentStatus", t: 80},
        28: {n: "Language", t: 80},
        29: {n: "Version", t: 80},
        255: {}
    }, Pr = {
        1: {n: "CodePage", t: Ar},
        2: {n: "Title", t: 80},
        3: {n: "Subject", t: 80},
        4: {n: "Author", t: 80},
        5: {n: "Keywords", t: 80},
        6: {n: "Comments", t: 80},
        7: {n: "Template", t: 80},
        8: {n: "LastAuthor", t: 80},
        9: {n: "RevNumber", t: 80},
        10: {n: "EditTime", t: 64},
        11: {n: "LastPrinted", t: 64},
        12: {n: "CreatedDate", t: 64},
        13: {n: "ModifiedDate", t: 64},
        14: {n: "PageCount", t: Ir},
        15: {n: "WordCount", t: Ir},
        16: {n: "CharCount", t: Ir},
        17: {n: "Thumbnail", t: 71},
        18: {n: "Application", t: 80},
        19: {n: "DocSecurity", t: Ir},
        255: {}
    }, Nr = {2147483648: {n: "Locale", t: 19}, 2147483651: {n: "Behavior", t: 19}, 1919054434: {}};
    !function () {
        for (var e in Nr) Nr.hasOwnProperty(e) && (Dr[e] = Pr[e] = Nr[e])
    }();
    var Lr = w(Dr, "n"), Mr = w(Pr, "n"), Ur = {
            1: "US",
            2: "CA",
            3: "",
            7: "RU",
            20: "EG",
            30: "GR",
            31: "NL",
            32: "BE",
            33: "FR",
            34: "ES",
            36: "HU",
            39: "IT",
            41: "CH",
            43: "AT",
            44: "GB",
            45: "DK",
            46: "SE",
            47: "NO",
            48: "PL",
            49: "DE",
            52: "MX",
            55: "BR",
            61: "AU",
            64: "NZ",
            66: "TH",
            81: "JP",
            82: "KR",
            84: "VN",
            86: "CN",
            90: "TR",
            105: "JS",
            213: "DZ",
            216: "MA",
            218: "LY",
            351: "PT",
            354: "IS",
            358: "FI",
            420: "CZ",
            886: "TW",
            961: "LB",
            962: "JO",
            963: "SY",
            964: "IQ",
            965: "KW",
            966: "SA",
            971: "AE",
            972: "IL",
            974: "QA",
            981: "IR",
            65535: "US"
        },
        Hr = [null, "solid", "mediumGray", "darkGray", "lightGray", "darkHorizontal", "darkVertical", "darkDown", "darkUp", "darkGrid", "darkTrellis", "lightHorizontal", "lightVertical", "lightDown", "lightUp", "lightGrid", "lightTrellis", "gray125", "gray0625"];
    var zr,
        Vr = [0, 16777215, 16711680, 65280, 255, 16776960, 16711935, 65535, 0, 16777215, 16711680, 65280, 255, 16776960, 16711935, 65535, 8388608, 32768, 128, 8421376, 8388736, 32896, 12632256, 8421504, 10066431, 10040166, 16777164, 13434879, 6684774, 16744576, 26316, 13421823, 128, 16711935, 16776960, 65535, 8388736, 8388608, 32896, 255, 52479, 13434879, 13434828, 16777113, 10079487, 16751052, 13408767, 16764057, 3368703, 3394764, 10079232, 16763904, 16750848, 16737792, 6710937, 9868950, 13158, 3381606, 13056, 3355392, 10040064, 10040166, 3355545, 3355443, 16777215, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(function (e) {
            return [e >> 16 & 255, e >> 8 & 255, 255 & e]
        }), Wr = {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
            "application/vnd.ms-excel.binIndexWs": "TODO",
            "application/vnd.ms-excel.intlmacrosheet": "TODO",
            "application/vnd.ms-excel.binIndexMs": "TODO",
            "application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
            "application/vnd.openxmlformats-officedocument.custom-properties+xml": "custprops",
            "application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",
            "application/vnd.openxmlformats-officedocument.customXmlProperties+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty": "TODO",
            "application/vnd.ms-excel.pivotTable": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml": "TODO",
            "application/vnd.ms-office.chartcolorstyle+xml": "TODO",
            "application/vnd.ms-office.chartstyle+xml": "TODO",
            "application/vnd.ms-excel.calcChain": "calcchains",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings": "TODO",
            "application/vnd.ms-office.activeX": "TODO",
            "application/vnd.ms-office.activeX+xml": "TODO",
            "application/vnd.ms-excel.attachedToolbars": "TODO",
            "application/vnd.ms-excel.connections": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": "TODO",
            "application/vnd.ms-excel.externalLink": "links",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml": "links",
            "application/vnd.ms-excel.sheetMetadata": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml": "TODO",
            "application/vnd.ms-excel.pivotCacheDefinition": "TODO",
            "application/vnd.ms-excel.pivotCacheRecords": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml": "TODO",
            "application/vnd.ms-excel.queryTable": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml": "TODO",
            "application/vnd.ms-excel.userNames": "TODO",
            "application/vnd.ms-excel.revisionHeaders": "TODO",
            "application/vnd.ms-excel.revisionLog": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml": "TODO",
            "application/vnd.ms-excel.tableSingleCells": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml": "TODO",
            "application/vnd.ms-excel.slicer": "TODO",
            "application/vnd.ms-excel.slicerCache": "TODO",
            "application/vnd.ms-excel.slicer+xml": "TODO",
            "application/vnd.ms-excel.slicerCache+xml": "TODO",
            "application/vnd.ms-excel.wsSortMap": "TODO",
            "application/vnd.ms-excel.table": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.theme+xml": "themes",
            "application/vnd.openxmlformats-officedocument.themeOverride+xml": "TODO",
            "application/vnd.ms-excel.Timeline+xml": "TODO",
            "application/vnd.ms-excel.TimelineCache+xml": "TODO",
            "application/vnd.ms-office.vbaProject": "vba",
            "application/vnd.ms-office.vbaProjectSignature": "vba",
            "application/vnd.ms-office.volatileDependencies": "TODO",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml": "TODO",
            "application/vnd.ms-excel.controlproperties+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.model+data": "TODO",
            "application/vnd.ms-excel.Survey+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.drawing+xml": "drawings",
            "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml": "TODO",
            "application/vnd.openxmlformats-officedocument.vmlDrawing": "TODO",
            "application/vnd.openxmlformats-package.relationships+xml": "rels",
            "application/vnd.openxmlformats-officedocument.oleObject": "TODO",
            "image/png": "TODO",
            sheet: "js"
        }, Xr = (ge(zr = {
            workbooks: {
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
                xlsm: "application/vnd.ms-excel.sheet.macroEnabled.main+xml",
                xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.main",
                xlam: "application/vnd.ms-excel.addin.macroEnabled.main+xml",
                xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml"
            },
            strs: {
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml",
                xlsb: "application/vnd.ms-excel.sharedStrings"
            },
            comments: {
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
                xlsb: "application/vnd.ms-excel.comments"
            },
            sheets: {
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
                xlsb: "application/vnd.ms-excel.worksheet"
            },
            charts: {
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
                xlsb: "application/vnd.ms-excel.chartsheet"
            },
            dialogs: {
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
                xlsb: "application/vnd.ms-excel.dialogsheet"
            },
            macros: {xlsx: "application/vnd.ms-excel.macrosheet+xml", xlsb: "application/vnd.ms-excel.macrosheet"},
            styles: {
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
                xlsb: "application/vnd.ms-excel.styles"
            }
        }).forEach(function (t) {
            ["xlsm", "xlam"].forEach(function (e) {
                zr[t][e] || (zr[t][e] = zr[t].xlsx)
            })
        }), ge(zr).forEach(function (t) {
            ge(zr[t]).forEach(function (e) {
                Wr[zr[t][e]] = t
            })
        }), zr), jr = function (e) {
            for (var t = [], r = ge(e), n = 0; n !== r.length; ++n) null == t[e[r[n]]] && (t[e[r[n]]] = []), t[e[r[n]]].push(r[n]);
            return t
        }(Wr);

    function Gr() {
        return {
            workbooks: [],
            sheets: [],
            charts: [],
            dialogs: [],
            macros: [],
            rels: [],
            strs: [],
            comments: [],
            links: [],
            coreprops: [],
            extprops: [],
            custprops: [],
            themes: [],
            styles: [],
            calcchains: [],
            vba: [],
            drawings: [],
            TODO: [],
            xmlns: ""
        }
    }

    Je.CT = "http://schemas.openxmlformats.org/package/2006/content-types";
    var $r = Ze("Types", null, {xmlns: Je.CT, "xmlns:xsd": Je.xsd, "xmlns:xsi": Je.xsi}),
        Yr = [["xml", "application/xml"], ["bin", "application/vnd.ms-excel.sheet.binary.macroEnabled.main"], ["vml", "application/vnd.openxmlformats-officedocument.vmlDrawing"], ["bmp", "image/bmp"], ["png", "image/png"], ["gif", "image/gif"], ["emf", "image/x-emf"], ["wmf", "image/x-wmf"], ["jpg", "image/jpeg"], ["jpeg", "image/jpeg"], ["tif", "image/tiff"], ["tiff", "image/tiff"], ["pdf", "application/pdf"], ["rels", jr.rels[0]]].map(function (e) {
            return Ze("Default", null, {Extension: e[0], ContentType: e[1]})
        });

    function Kr(r, n) {
        var t, a = [];
        a[a.length] = z, a[a.length] = $r, a = a.concat(Yr);

        function e(e) {
            r[e] && 0 < r[e].length && (t = r[e][0], a[a.length] = Ze("Override", null, {
                PartName: ("/" == t[0] ? "" : "/") + t,
                ContentType: Xr[e][n.bookType || "xlsx"]
            }))
        }

        function s(t) {
            (r[t] || []).forEach(function (e) {
                a[a.length] = Ze("Override", null, {
                    PartName: ("/" == e[0] ? "" : "/") + e,
                    ContentType: Xr[t][n.bookType || "xlsx"]
                })
            })
        }

        function i(t) {
            (r[t] || []).forEach(function (e) {
                a[a.length] = Ze("Override", null, {PartName: ("/" == e[0] ? "" : "/") + e, ContentType: jr[t][0]})
            })
        }

        return e("workbooks"), s("sheets"), s("charts"), i("themes"), ["strs", "styles"].forEach(e), ["coreprops", "extprops", "custprops"].forEach(i), i("vba"), i("comments"), i("drawings"), 2 < a.length && (a[a.length] = "</Types>", a[1] = a[1].replace("/>", ">")), a.join("")
    }

    var Zr = {
        WB: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
        SHEET: "http://sheetjs.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
        HLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        VML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
        VBA: "http://schemas.microsoft.com/office/2006/relationships/vbaProject"
    };

    function Qr(e) {
        var t = e.lastIndexOf("/");
        return e.slice(0, t + 1) + "_rels/" + e.slice(t + 1) + ".rels"
    }

    function Jr(e, a) {
        if (!e) return e;
        "/" !== a.charAt(0) && (a = "/" + a);
        var s = {}, i = {};
        return (e.match(W) || []).forEach(function (e) {
            var t = ve(e);
            if ("<Relationship" === t[0]) {
                var r = {};
                r.Type = t.Type, r.Target = t.Target, r.Id = t.Id, r.TargetMode = t.TargetMode;
                var n = "External" === t.TargetMode ? t.Target : H(t.Target, a);
                s[n] = r, i[t.Id] = r
            }
        }), s["!id"] = i, s
    }

    Je.RELS = "http://schemas.openxmlformats.org/package/2006/relationships";
    var qr = Ze("Relationships", null, {xmlns: Je.RELS});

    function en(t) {
        var r = [z, qr];
        return ge(t["!id"]).forEach(function (e) {
            r[r.length] = Ze("Relationship", null, t["!id"][e])
        }), 2 < r.length && (r[r.length] = "</Relationships>", r[1] = r[1].replace("/>", ">")), r.join("")
    }

    function tn(e, t, r, n, a) {
        if (a = a || {}, e["!id"] || (e["!id"] = {}), t < 0) for (t = 1; e["!id"]["rId" + t]; ++t) ;
        if (a.Id = "rId" + t, a.Type = n, a.Target = r, a.Type == Zr.HLINK && (a.TargetMode = "External"), e["!id"][a.Id]) throw new Error("Cannot rewrite rId " + t);
        return e["!id"][a.Id] = a, e[("/" + a.Target).replace("//", "/")] = a, t
    }

    var rn = "application/vnd.oasis.opendocument.spreadsheet";

    function nn(e, t, r) {
        return ['  <rdf:Description rdf:about="' + e + '">\n', '    <rdf:type rdf:resource="http://docs.oasis-open.org/ns/office/1.2/meta/' + (r || "odf") + "#" + t + '"/>\n', "  </rdf:Description>\n"].join("")
    }

    var an,
        sn = (an = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2"><office:meta><meta:generator>SheetJS ' + n.version + "</meta:generator></office:meta></office:document-meta>", function () {
            return an
        }),
        on = [["cp:category", "Category"], ["cp:contentStatus", "ContentStatus"], ["cp:keywords", "Keywords"], ["cp:lastModifiedBy", "LastAuthor"], ["cp:lastPrinted", "LastPrinted"], ["cp:revision", "RevNumber"], ["cp:version", "Version"], ["dc:creator", "Author"], ["dc:description", "Comments"], ["dc:identifier", "Identifier"], ["dc:language", "Language"], ["dc:subject", "Subject"], ["dc:title", "Title"], ["dcterms:created", "CreatedDate", "date"], ["dcterms:modified", "ModifiedDate", "date"]];
    Je.CORE_PROPS = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties", Zr.CORE_PROPS = "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties";
    var ln = function () {
        for (var e = new Array(on.length), t = 0; t < on.length; ++t) {
            var r = on[t], n = "(?:" + r[0].slice(0, r[0].indexOf(":")) + ":)" + r[0].slice(r[0].indexOf(":") + 1);
            e[t] = new RegExp("<" + n + "[^>]*>([\\s\\S]*?)</" + n + ">")
        }
        return e
    }();

    function cn(e) {
        var t = {};
        e = Fe(e);
        for (var r = 0; r < on.length; ++r) {
            var n = on[r], a = e.match(ln[r]);
            null != a && 0 < a.length && (t[n[1]] = a[1]), "date" === n[2] && t[n[1]] && (t[n[1]] = Q(t[n[1]]))
        }
        return t
    }

    var fn = Ze("cp:coreProperties", null, {
        "xmlns:cp": Je.CORE_PROPS,
        "xmlns:dc": Je.dc,
        "xmlns:dcterms": Je.dcterms,
        "xmlns:dcmitype": Je.dcmitype,
        "xmlns:xsi": Je.xsi
    });

    function hn(e, t, r, n, a) {
        null == a[e] && null != t && "" !== t && (a[e] = t, n[n.length] = r ? Ze(e, t, r) : Ye(e, t))
    }

    var un = [["Application", "Application", "string"], ["AppVersion", "AppVersion", "string"], ["Company", "Company", "string"], ["DocSecurity", "DocSecurity", "string"], ["Manager", "Manager", "string"], ["HyperlinksChanged", "HyperlinksChanged", "bool"], ["SharedDoc", "SharedDoc", "bool"], ["LinksUpToDate", "LinksUpToDate", "bool"], ["ScaleCrop", "ScaleCrop", "bool"], ["HeadingPairs", "HeadingPairs", "raw"], ["TitlesOfParts", "TitlesOfParts", "raw"]];
    Je.EXT_PROPS = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties", Zr.EXT_PROPS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties";

    function dn(e, t, r, n) {
        var a = [];
        if ("string" == typeof e) a = Ge(e, n); else for (var s = 0; s < e.length; ++s) a = a.concat(e[s].map(function (e) {
            return {v: e}
        }));
        var i = "string" == typeof t ? Ge(t, n).map(function (e) {
            return e.v
        }) : t, o = 0, l = 0;
        if (0 < i.length) for (var c = 0; c !== a.length; c += 2) {
            switch (l = +a[c + 1].v, a[c].v) {
                case"Worksheets":
                case"工作表":
                case"Листы":
                case"أوراق العمل":
                case"ワークシート":
                case"גליונות עבודה":
                case"Arbeitsblätter":
                case"Çalışma Sayfaları":
                case"Feuilles de calcul":
                case"Fogli di lavoro":
                case"Folhas de cálculo":
                case"Planilhas":
                case"Regneark":
                case"Werkbladen":
                    r.Worksheets = l, r.SheetNames = i.slice(o, o + l);
                    break;
                case"Named Ranges":
                case"名前付き一覧":
                case"Benannte Bereiche":
                case"Navngivne områder":
                    r.NamedRanges = l, r.DefinedNames = i.slice(o, o + l);
                    break;
                case"Charts":
                case"Diagramme":
                    r.Chartsheets = l, r.ChartNames = i.slice(o, o + l)
            }
            o += l
        }
    }

    var pn = Ze("Properties", null, {xmlns: Je.EXT_PROPS, "xmlns:vt": Je.vt});
    Je.CUST_PROPS = "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties", Zr.CUST_PROPS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties";
    var mn = /<[^>]+>[^<]*/g;
    var gn = Ze("Properties", null, {xmlns: Je.CUST_PROPS, "xmlns:vt": Je.vt});

    function bn(t) {
        var r = [z, gn];
        if (!t) return r.join("");
        var n = 1;
        return ge(t).forEach(function (e) {
            ++n, r[r.length] = Ze("property", function (e) {
                switch (typeof e) {
                    case"string":
                        return Ze("vt:lpwstr", e);
                    case"number":
                        return Ze((0 | e) == e ? "vt:i4" : "vt:r8", String(e));
                    case"boolean":
                        return Ze("vt:bool", e ? "true" : "false")
                }
                if (e instanceof Date) return Ze("vt:filetime", Qe(e));
                throw new Error("Unable to serialize " + e)
            }(t[e]), {fmtid: "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}", pid: n, name: e})
        }), 2 < r.length && (r[r.length] = "</Properties>", r[1] = r[1].replace("/>", ">")), r.join("")
    }

    var vn = {
        Title: "Title",
        Subject: "Subject",
        Author: "Author",
        Keywords: "Keywords",
        Comments: "Description",
        LastAuthor: "LastAuthor",
        RevNumber: "Revision",
        Application: "AppName",
        LastPrinted: "LastPrinted",
        CreatedDate: "Created",
        ModifiedDate: "LastSaved",
        Category: "Category",
        Manager: "Manager",
        Company: "Company",
        AppVersion: "Version",
        ContentStatus: "ContentStatus",
        Identifier: "Identifier",
        Language: "Language"
    }, En = S(vn);

    function wn(e) {
        var t = e.read_shift(4), r = e.read_shift(4);
        return new Date(1e3 * (r / 1e7 * Math.pow(2, 32) + t / 1e7 - 11644473600)).toISOString().replace(/\.000/, "")
    }

    function Sn(e, t, r) {
        var n = e.l, a = e.read_shift(0, "lpstr-cp");
        if (r) for (; e.l - n & 3;) ++e.l;
        return a
    }

    function _n(e, t, r) {
        var n = e.read_shift(0, "lpwstr");
        return r && (e.l += 4 - (n.length + 1 & 3) & 3), n
    }

    function yn(e, t, r) {
        return 31 === t ? _n(e) : Sn(e, 0, r)
    }

    function Cn(e, t, r) {
        return yn(e, t, !1 === r ? 0 : 4)
    }

    function Bn(e) {
        return function (e) {
            for (var t = e.read_shift(4), r = [], n = 0; n != t; ++n) r[n] = e.read_shift(0, "lpstr-cp").replace(oe, "");
            return r
        }(e)
    }

    function Tn(e) {
        return function (e) {
            for (var t, r = e.read_shift(4), n = [], a = 0; a != r / 2; ++a) n.push([An(t = e, Or), An(t, Ir)]);
            return n
        }(e)
    }

    function kn(e, t) {
        for (var r = e.read_shift(4), n = {}, a = 0; a != r; ++a) {
            var s = e.read_shift(4), i = e.read_shift(4);
            n[s] = e.read_shift(i, 1200 === t ? "utf16le" : "utf8").replace(oe, "").replace(le, "!"), 1200 === t && i % 2 && (e.l += 2)
        }
        return 3 & e.l && (e.l = e.l >> 3 << 2), n
    }

    function xn(e) {
        var t = e.read_shift(4), r = e.slice(e.l, e.l + t);
        return e.l += t, 0 < (3 & t) && (e.l += 4 - (3 & t) & 3), r
    }

    function An(e, t, r) {
        var n, a, s, i = e.read_shift(2), o = r || {};
        if (e.l += 2, t !== Rr && i !== t && -1 === Fr.indexOf(t)) throw new Error("Expected type " + t + " saw " + i);
        switch (t === Rr ? i : t) {
            case 2:
                return n = e.read_shift(2, "i"), o.raw || (e.l += 2), n;
            case 3:
                return n = e.read_shift(4, "i");
            case 11:
                return 0 !== e.read_shift(4);
            case 19:
                return n = e.read_shift(4);
            case 30:
                return Sn(e, 0, 4).replace(oe, "");
            case 31:
                return _n(e);
            case 64:
                return wn(e);
            case 65:
                return xn(e);
            case 71:
                return (s = {}).Size = (a = e).read_shift(4), a.l += s.Size + 3 - (s.Size - 1) % 4, s;
            case 80:
                return Cn(e, i, !o.raw).replace(oe, "");
            case 81:
                return function (e, t) {
                    if (!t) throw new Error("VtUnalignedString must have positive length");
                    return yn(e, t, 0)
                }(e, i).replace(oe, "");
            case 4108:
                return Tn(e);
            case 4126:
                return Bn(e);
            default:
                throw new Error("TypedPropertyValue unrecognized type " + t + " " + i)
        }
    }

    function In(e, t) {
        var r = Pt(4), n = Pt(4);
        switch (r.write_shift(4, 80 == e ? 31 : e), e) {
            case 3:
                n.write_shift(-4, t);
                break;
            case 5:
                (n = Pt(8)).write_shift(8, t, "f");
                break;
            case 11:
                n.write_shift(4, t ? 1 : 0);
                break;
            case 64:
                n = function (e) {
                    var t = ("string" == typeof e ? new Date(Date.parse(e)) : e).getTime() / 1e3 + 11644473600,
                        r = t % Math.pow(2, 32), n = (t - r) / Math.pow(2, 32);
                    n *= 1e7;
                    var a = (r *= 1e7) / Math.pow(2, 32) | 0;
                    0 < a && (r %= Math.pow(2, 32), n += a);
                    var s = Pt(8);
                    return s.write_shift(4, r), s.write_shift(4, n), s
                }(t);
                break;
            case 31:
            case 80:
                for ((n = Pt(4 + 2 * (t.length + 1) + (t.length % 2 ? 0 : 2))).write_shift(4, t.length + 1), n.write_shift(0, t, "dbcs"); n.l != n.length;) n.write_shift(1, 0);
                break;
            default:
                throw new Error("TypedPropertyValue unrecognized type " + e + " " + t)
        }
        return ie([r, n])
    }

    function Rn(e, t) {
        var r = e.l, n = e.read_shift(4), a = e.read_shift(4), s = [], i = 0, o = 0, l = -1, c = {};
        for (i = 0; i != a; ++i) {
            var f = e.read_shift(4), h = e.read_shift(4);
            s[i] = [f, h + r]
        }
        s.sort(function (e, t) {
            return e[1] - t[1]
        });
        var u = {};
        for (i = 0; i != a; ++i) {
            if (e.l !== s[i][1]) {
                var d = !0;
                if (0 < i && t) switch (t[s[i - 1][0]].t) {
                    case 2:
                        e.l + 2 === s[i][1] && (e.l += 2, d = !1);
                        break;
                    case 80:
                    case 4108:
                        e.l <= s[i][1] && (e.l = s[i][1], d = !1)
                }
                if ((!t || 0 == i) && e.l <= s[i][1] && (d = !1, e.l = s[i][1]), d) throw new Error("Read Error: Expected address " + s[i][1] + " at " + e.l + " :" + i)
            }
            if (t) {
                var p = t[s[i][0]];
                if (u[p.n] = An(e, p.t, {raw: !0}), "version" === p.p && (u[p.n] = String(u[p.n] >> 16) + "." + ("0000" + String(65535 & u[p.n])).slice(-4)), "CodePage" == p.n) switch (u[p.n]) {
                    case 0:
                        u[p.n] = 1252;
                    case 874:
                    case 932:
                    case 936:
                    case 949:
                    case 950:
                    case 1250:
                    case 1251:
                    case 1253:
                    case 1254:
                    case 1255:
                    case 1256:
                    case 1257:
                    case 1258:
                    case 1e4:
                    case 1200:
                    case 1201:
                    case 1252:
                    case 65e3:
                    case-536:
                    case 65001:
                    case-535:
                        he(o = u[p.n] >>> 0 & 65535);
                        break;
                    default:
                        throw new Error("Unsupported CodePage: " + u[p.n])
                }
            } else if (1 === s[i][0]) {
                if (o = u.CodePage = An(e, Ar), he(o), -1 !== l) {
                    var m = e.l;
                    e.l = s[l][1], c = kn(e, o), e.l = m
                }
            } else if (0 === s[i][0]) {
                if (0 === o) {
                    l = i, e.l = s[i + 1][1];
                    continue
                }
                c = kn(e, o)
            } else {
                var g, b = c[s[i][0]];
                switch (e[e.l]) {
                    case 65:
                        e.l += 4, g = xn(e);
                        break;
                    case 30:
                    case 31:
                        e.l += 4, g = Cn(e, e[e.l - 4]).replace(/\u0000+$/, "");
                        break;
                    case 3:
                        e.l += 4, g = e.read_shift(4, "i");
                        break;
                    case 19:
                        e.l += 4, g = e.read_shift(4);
                        break;
                    case 5:
                        e.l += 4, g = e.read_shift(8, "f");
                        break;
                    case 11:
                        e.l += 4, g = Mn(e, 4);
                        break;
                    case 64:
                        e.l += 4, g = Q(wn(e));
                        break;
                    default:
                        throw new Error("unparsed value: " + e[e.l])
                }
                u[b] = g
            }
        }
        return e.l = r + n, u
    }

    var On = ["CodePage", "Thumbnail", "_PID_LINKBASE", "_PID_HLINKS", "SystemIdentifier", "FMTID"].concat(["Worksheets", "SheetNames", "NamedRanges", "DefinedNames", "Chartsheets", "ChartNames"]);

    function Fn(e) {
        switch (typeof e) {
            case"boolean":
                return 11;
            case"number":
                return (0 | e) == e ? 3 : 5;
            case"string":
                return 31;
            case"object":
                if (e instanceof Date) return 64
        }
        return -1
    }

    function Dn(e, t, r) {
        var n = Pt(8), a = [], s = [], i = 8, o = 0, l = Pt(8), c = Pt(8);
        if (l.write_shift(4, 2), l.write_shift(4, 1200), c.write_shift(4, 1), s.push(l), a.push(c), i += 8 + l.length, !t) {
            (c = Pt(8)).write_shift(4, 0), a.unshift(c);
            var f = [Pt(4)];
            for (f[0].write_shift(4, e.length), o = 0; o < e.length; ++o) {
                var h = e[o][0];
                for ((l = Pt(8 + 2 * (h.length + 1) + (h.length % 2 ? 0 : 2))).write_shift(4, o + 2), l.write_shift(4, h.length + 1), l.write_shift(0, h, "dbcs"); l.l != l.length;) l.write_shift(1, 0);
                f.push(l)
            }
            l = ie(f), s.unshift(l), i += 8 + l.length
        }
        for (o = 0; o < e.length; ++o) if ((!t || t[e[o][0]]) && !(-1 < On.indexOf(e[o][0])) && null != e[o][1]) {
            var u = e[o][1], d = 0;
            if (t) {
                var p = r[d = +t[e[o][0]]];
                if ("version" == p.p && "string" == typeof u) {
                    var m = u.split(".");
                    u = (+m[0] << 16) + (+m[1] || 0)
                }
                l = In(p.t, u)
            } else {
                var g = Fn(u);
                -1 == g && (g = 31, u = String(u)), l = In(g, u)
            }
            s.push(l), (c = Pt(8)).write_shift(4, t ? d : 2 + o), a.push(c), i += 8 + l.length
        }
        var b = 8 * (s.length + 1);
        for (o = 0; o < s.length; ++o) a[o].write_shift(4, b), b += s[o].length;
        return n.write_shift(4, i), n.write_shift(4, s.length), ie([n].concat(a).concat(s))
    }

    function Pn(e, t, r) {
        var n = e.content;
        if (!n) return {};
        Ft(n, 0);
        var a, s, i, o, l = 0;
        n.chk("feff", "Byte Order: "), n.read_shift(2);
        var c = n.read_shift(4), f = n.read_shift(16);
        if (f !== me.utils.consts.HEADER_CLSID && f !== r) throw new Error("Bad PropertySet CLSID " + f);
        if (1 !== (a = n.read_shift(4)) && 2 !== a) throw new Error("Unrecognized #Sets: " + a);
        if (s = n.read_shift(16), o = n.read_shift(4), 1 === a && o !== n.l) throw new Error("Length mismatch: " + o + " !== " + n.l);
        2 === a && (i = n.read_shift(16), l = n.read_shift(4));
        var h, u = Rn(n, t), d = {SystemIdentifier: c};
        for (var p in u) d[p] = u[p];
        if (d.FMTID = s, 1 === a) return d;
        if (l - n.l == 2 && (n.l += 2), n.l !== l) throw new Error("Length mismatch 2: " + n.l + " !== " + l);
        try {
            h = Rn(n, null)
        } catch (e) {
        }
        for (p in h) d[p] = h[p];
        return d.FMTID = [s, i], d
    }

    function Nn(e, t, r, n, a, s) {
        var i = Pt(a ? 68 : 48), o = [i];
        i.write_shift(2, 65534), i.write_shift(2, 0), i.write_shift(4, 842412599), i.write_shift(16, me.utils.consts.HEADER_CLSID, "hex"), i.write_shift(4, a ? 2 : 1), i.write_shift(16, t, "hex"), i.write_shift(4, a ? 68 : 48);
        var l = Dn(e, r, n);
        if (o.push(l), a) {
            var c = Dn(a, null, null);
            i.write_shift(16, s, "hex"), i.write_shift(4, 68 + l.length), o.push(c)
        }
        return ie(o)
    }

    function Ln(e, t) {
        return e.read_shift(t), null
    }

    function Mn(e, t) {
        return 1 === e.read_shift(t)
    }

    function Un(e, t) {
        return (t = t || Pt(2)).write_shift(2, +!!e), t
    }

    function Hn(e) {
        return e.read_shift(2, "u")
    }

    function zn(e, t) {
        return (t = t || Pt(2)).write_shift(2, e), t
    }

    function Vn(e, t) {
        return function (e, t, r) {
            for (var n = [], a = e.l + t; e.l < a;) n.push(r(e, a - e.l));
            if (a !== e.l) throw new Error("Slurp error");
            return n
        }(e, t, Hn)
    }

    function Wn(e, t, r) {
        var n = e.read_shift(r && 12 <= r.biff ? 2 : 1), a = "sbcs-cont", s = u;
        (r && 8 <= r.biff && (u = 1200), r && 8 != r.biff) ? 12 == r.biff && (a = "wstr") : e.read_shift(1) && (a = "dbcs-cont");
        2 <= r.biff && r.biff <= 5 && (a = "cpstr");
        var i = n ? e.read_shift(n, a) : "";
        return u = s, i
    }

    function Xn(e) {
        var t = u;
        u = 1200;
        var r, n = e.read_shift(2), a = e.read_shift(1), s = 4 & a, i = 8 & a, o = 1 + (1 & a), l = 0, c = {};
        i && (l = e.read_shift(2)), s && (r = e.read_shift(4));
        var f = 2 == o ? "dbcs-cont" : "sbcs-cont", h = 0 === n ? "" : e.read_shift(n, f);
        return i && (e.l += 4 * l), s && (e.l += r), c.t = h, i || (c.raw = "<t>" + c.t + "</t>", c.r = c.t), u = t, c
    }

    function jn(e, t, r) {
        if (r) {
            if (2 <= r.biff && r.biff <= 5) return e.read_shift(t, "cpstr");
            if (12 <= r.biff) return e.read_shift(t, "dbcs-cont")
        }
        return 0 === e.read_shift(1) ? e.read_shift(t, "sbcs-cont") : e.read_shift(t, "dbcs-cont")
    }

    function Gn(e, t, r) {
        var n = e.read_shift(r && 2 == r.biff ? 1 : 2);
        return 0 === n ? (e.l++, "") : jn(e, n, r)
    }

    function $n(e, t, r) {
        if (5 < r.biff) return Gn(e, 0, r);
        var n = e.read_shift(1);
        return 0 === n ? (e.l++, "") : e.read_shift(n, r.biff <= 4 || !e.lens ? "cpstr" : "sbcs-cont")
    }

    function Yn(e, t, r) {
        return (r = r || Pt(3 + 2 * e.length)).write_shift(2, e.length), r.write_shift(1, 1), r.write_shift(31, e, "utf16le"), r
    }

    function Kn(e) {
        var t = e.read_shift(16);
        switch (t) {
            case"e0c9ea79f9bace118c8200aa004ba90b":
                return function (e) {
                    var t = e.read_shift(4), r = e.l, n = !1;
                    24 < t && (e.l += t - 24, "795881f43b1d7f48af2c825dc4852763" === e.read_shift(16) && (n = !0), e.l = r);
                    var a = e.read_shift((n ? t - 24 : t) >> 1, "utf16le").replace(oe, "");
                    return n && (e.l += 24), a
                }(e);
            case"0303000000000000c000000000000046":
                return function (e) {
                    e.l += 2;
                    var t = e.read_shift(0, "lpstr-ansi");
                    if (e.l += 2, 57005 != e.read_shift(2)) throw new Error("Bad FileMoniker");
                    if (0 === e.read_shift(4)) return t.replace(/\\/g, "/");
                    var r = e.read_shift(4);
                    if (3 != e.read_shift(2)) throw new Error("Bad FileMoniker");
                    return e.read_shift(r >> 1, "utf16le").replace(oe, "")
                }(e);
            default:
                throw new Error("Unsupported Moniker " + t)
        }
    }

    function Zn(e) {
        var t = e.read_shift(4);
        return 0 < t ? e.read_shift(t, "utf16le").replace(oe, "") : ""
    }

    function Qn(e) {
        return [e.read_shift(1), e.read_shift(1), e.read_shift(1), e.read_shift(1)]
    }

    function Jn(e) {
        var t = Qn(e);
        return t[3] = 0, t
    }

    function qn(e) {
        return {r: e.read_shift(2), c: e.read_shift(2), ixfe: e.read_shift(2)}
    }

    function ea(e, t, r, n) {
        return (n = n || Pt(6)).write_shift(2, e), n.write_shift(2, t), n.write_shift(2, r || 0), n
    }

    function ta(e) {
        return [e.read_shift(2), Er(e)]
    }

    function ra(e) {
        var t = e.read_shift(2), r = e.read_shift(2);
        return {s: {c: e.read_shift(2), r: t}, e: {c: e.read_shift(2), r: r}}
    }

    function na(e, t) {
        return (t = t || Pt(8)).write_shift(2, e.s.r), t.write_shift(2, e.e.r), t.write_shift(2, e.s.c), t.write_shift(2, e.e.c), t
    }

    function aa(e) {
        var t = e.read_shift(2), r = e.read_shift(2);
        return {s: {c: e.read_shift(1), r: t}, e: {c: e.read_shift(1), r: r}}
    }

    var sa = aa;

    function ia(e) {
        e.l += 4;
        var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(2);
        return e.l += 12, [r, t, n]
    }

    function oa(e) {
        e.l += 2, e.l += e.read_shift(2)
    }

    var la = {
        0: oa, 4: oa, 5: oa, 6: oa, 7: function (e) {
            return e.l += 4, e.cf = e.read_shift(2), {}
        }, 8: oa, 9: oa, 10: oa, 11: oa, 12: oa, 13: function (e) {
            var t = {};
            return e.l += 4, e.l += 16, t.fSharedNote = e.read_shift(2), e.l += 4, t
        }, 14: oa, 15: oa, 16: oa, 17: oa, 18: oa, 19: oa, 20: oa, 21: ia
    };

    function ca(e, t) {
        var r = {BIFFVer: 0, dt: 0};
        switch (r.BIFFVer = e.read_shift(2), 2 <= (t -= 2) && (r.dt = e.read_shift(2), e.l -= 2), r.BIFFVer) {
            case 1536:
            case 1280:
            case 1024:
            case 768:
            case 512:
            case 2:
            case 7:
                break;
            default:
                if (6 < t) throw new Error("Unexpected BIFF Ver " + r.BIFFVer)
        }
        return e.read_shift(t), r
    }

    function fa(e, t, r) {
        var n = 1536, a = 16;
        switch (r.bookType) {
            case"biff8":
                break;
            case"biff5":
                n = 1280, a = 8;
                break;
            case"biff4":
                n = 4, a = 6;
                break;
            case"biff3":
                n = 3, a = 6;
                break;
            case"biff2":
                n = 2, a = 4;
                break;
            case"xla":
                break;
            default:
                throw new Error("unsupported BIFF version")
        }
        var s = Pt(a);
        return s.write_shift(2, n), s.write_shift(2, t), 4 < a && s.write_shift(2, 29282), 6 < a && s.write_shift(2, 1997), 8 < a && (s.write_shift(2, 49161), s.write_shift(2, 1), s.write_shift(2, 1798), s.write_shift(2, 0)), s
    }

    function ha(e, t) {
        var r = !t || 8 <= t.biff ? 2 : 1, n = Pt(8 + r * e.name.length);
        n.write_shift(4, e.pos), n.write_shift(1, e.hs || 0), n.write_shift(1, e.dt), n.write_shift(1, e.name.length), 8 <= t.biff && n.write_shift(1, 1), n.write_shift(r * e.name.length, e.name, t.biff < 8 ? "sbcs" : "utf16le");
        var a = n.slice(0, n.l);
        return a.l = n.l, a
    }

    function ua(e, t, r) {
        var n = 0;
        r && 2 == r.biff || (n = e.read_shift(2));
        var a = e.read_shift(2);
        return r && 2 == r.biff && (n = 1 - (a >> 15), a &= 32767), [{
            Unsynced: 1 & n,
            DyZero: (2 & n) >> 1,
            ExAsc: (4 & n) >> 2,
            ExDsc: (8 & n) >> 3
        }, a]
    }

    function da(e, t, r, n) {
        var a = r && 5 == r.biff;
        (n = n || Pt(a ? 3 + t.length : 5 + 2 * t.length)).write_shift(2, e), n.write_shift(a ? 1 : 2, t.length), a || n.write_shift(1, 1), n.write_shift((a ? 1 : 2) * t.length, t, a ? "sbcs" : "utf16le");
        var s = n.length > n.l ? n.slice(0, n.l) : n;
        return null == s.l && (s.l = s.length), s
    }

    var pa = $n;

    function ma(e, t, r) {
        var n = e.l + t, a = 8 != r.biff && r.biff ? 2 : 4, s = e.read_shift(a), i = e.read_shift(a),
            o = e.read_shift(2), l = e.read_shift(2);
        return e.l = n, {s: {r: s, c: o}, e: {r: i, c: l}}
    }

    function ga(e, t, r, n) {
        var a = r && 5 == r.biff;
        return (n = n || Pt(a ? 16 : 20)).write_shift(2, 0), e.style ? (n.write_shift(2, e.numFmtId || 0), n.write_shift(2, 65524)) : (n.write_shift(2, e.numFmtId || 0), n.write_shift(2, t << 4)), n.write_shift(4, 0), n.write_shift(4, 0), a || n.write_shift(4, 0), n.write_shift(2, 0), n
    }

    function ba(e, t, r) {
        var n = qn(e);
        2 == r.biff && ++e.l;
        var a, s, i = (s = (a = e).read_shift(1), 1 === a.read_shift(1) ? s : 1 === s);
        return n.val = i, n.t = !0 === i || !1 === i ? "b" : "e", n
    }

    function va(e, t, r, n, a, s) {
        var i, o, l, c = Pt(8);
        return ea(e, t, n, c), i = r, o = s, (l = (l = c) || Pt(2)).write_shift(1, +i), l.write_shift(1, "e" == o ? 1 : 0), c
    }

    function Ea(e, t, r) {
        return 0 === t ? "" : $n(e, 0, r)
    }

    function wa(e, t, r) {
        var n, a = e.read_shift(2), s = {
            fBuiltIn: 1 & a,
            fWantAdvise: a >>> 1 & 1,
            fWantPict: a >>> 2 & 1,
            fOle: a >>> 3 & 1,
            fOleLink: a >>> 4 & 1,
            cf: a >>> 5 & 1023,
            fIcon: a >>> 15 & 1
        };
        return 14849 === r.sbcch && (n = function (e, t, r) {
            e.l += 4, t -= 4;
            var n = e.l + t, a = Wn(e, 0, r), s = e.read_shift(2);
            if (s !== (n -= e.l)) throw new Error("Malformed AddinUdf: padding = " + n + " != " + s);
            return e.l += s, a
        }(e, t - 2, r)), s.body = n || e.read_shift(t - 2), "string" == typeof n && (s.Name = n), s
    }

    var Sa = ["_xlnm.Consolidate_Area", "_xlnm.Auto_Open", "_xlnm.Auto_Close", "_xlnm.Extract", "_xlnm.Database", "_xlnm.Criteria", "_xlnm.Print_Area", "_xlnm.Print_Titles", "_xlnm.Recorder", "_xlnm.Data_Form", "_xlnm.Auto_Activate", "_xlnm.Auto_Deactivate", "_xlnm.Sheet_Title", "_xlnm._FilterDatabase"];

    function _a(e, t, r) {
        var n = e.l + t, a = e.read_shift(2), s = e.read_shift(1), i = e.read_shift(1),
            o = e.read_shift(r && 2 == r.biff ? 1 : 2), l = 0;
        (!r || 5 <= r.biff) && (5 != r.biff && (e.l += 2), l = e.read_shift(2), 5 == r.biff && (e.l += 2), e.l += 4);
        var c = jn(e, i, r);
        32 & a && (c = Sa[c.charCodeAt(0)]);
        var f = n - e.l;
        return r && 2 == r.biff && --f, {
            chKey: s,
            Name: c,
            itab: l,
            rgce: n == e.l || 0 === o ? [] : function (e, t, r, n) {
                var a, s = e.l + t, i = Po(e, n, r);
                s !== e.l && (a = Do(e, s - e.l, i, r));
                return [i, a]
            }(e, f, r, o)
        }
    }

    function ya(e, t, r) {
        if (r.biff < 8) return function (e, t) {
            3 == e[e.l + 1] && e[e.l]++;
            var r = Wn(e, 0, t);
            return 3 == r.charCodeAt(0) ? r.slice(1) : r
        }(e, r);
        for (var n, a, s = [], i = e.l + t, o = e.read_shift(8 < r.biff ? 4 : 2); 0 != o--;) s.push((n = e, r.biff, a = 8 < r.biff ? 4 : 2, [n.read_shift(a), n.read_shift(a, "i"), n.read_shift(a, "i")]));
        if (e.l != i) throw new Error("Bad ExternSheet: " + e.l + " != " + i);
        return s
    }

    function Ca(e, t, r) {
        var n = sa(e, 6);
        switch (r.biff) {
            case 2:
                e.l++, t -= 7;
                break;
            case 3:
            case 4:
                e.l += 2, t -= 8;
                break;
            default:
                e.l += 6, t -= 12
        }
        return [n, function (e, t, r) {
            var n, a = e.l + t, s = 2 == r.biff ? 1 : 2, i = e.read_shift(s);
            if (65535 == i) return [[], Dt(e, t - 2)];
            var o = Po(e, i, r);
            t !== i + s && (n = Do(e, t - i - s, o, r));
            return e.l = a, [o, n]
        }(e, t, r)]
    }

    var Ba = [];

    function Ta(e) {
        var t = Pt(24), r = Yt(e[0]);
        t.write_shift(2, r.r), t.write_shift(2, r.r), t.write_shift(2, r.c), t.write_shift(2, r.c);
        for (var n = "d0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" "), a = 0; a < 16; ++a) t.write_shift(1, parseInt(n[a], 16));
        return ie([t, function (e) {
            var t = Pt(512), r = 0, n = e.Target, a = -1 < n.indexOf("#") ? 31 : 23;
            switch (n.charAt(0)) {
                case"#":
                    a = 28;
                    break;
                case".":
                    a &= -3
            }
            t.write_shift(4, 2), t.write_shift(4, a);
            var s = [8, 6815827, 6619237, 4849780, 83];
            for (r = 0; r < s.length; ++r) t.write_shift(4, s[r]);
            if (28 == a) {
                for (n = n.slice(1), t.write_shift(4, n.length + 1), r = 0; r < n.length; ++r) t.write_shift(2, n.charCodeAt(r));
                t.write_shift(2, 0)
            } else if (2 & a) {
                for (s = "e0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" "), r = 0; r < s.length; ++r) t.write_shift(1, parseInt(s[r], 16));
                for (t.write_shift(4, 2 * (n.length + 1)), r = 0; r < n.length; ++r) t.write_shift(2, n.charCodeAt(r));
                t.write_shift(2, 0)
            } else {
                for (s = "03 03 00 00 00 00 00 00 c0 00 00 00 00 00 00 46".split(" "), r = 0; r < s.length; ++r) t.write_shift(1, parseInt(s[r], 16));
                for (var i = 0; "../" == n.slice(3 * i, 3 * i + 3) || "..\\" == n.slice(3 * i, 3 * i + 3);) ++i;
                for (t.write_shift(2, i), t.write_shift(4, n.length + 1), r = 0; r < n.length; ++r) t.write_shift(1, 255 & n.charCodeAt(r));
                for (t.write_shift(1, 0), t.write_shift(2, 65535), t.write_shift(2, 57005), r = 0; r < 6; ++r) t.write_shift(4, 0)
            }
            return t.slice(0, t.l)
        }(e[1])])
    }

    function ka(e) {
        var t = e[1].Tooltip, r = Pt(10 + 2 * (t.length + 1));
        r.write_shift(2, 2048);
        var n = Yt(e[0]);
        r.write_shift(2, n.r), r.write_shift(2, n.r), r.write_shift(2, n.c), r.write_shift(2, n.c);
        for (var a = 0; a < t.length; ++a) r.write_shift(2, t.charCodeAt(a));
        return r.write_shift(2, 0), r
    }

    function xa(e, t, r) {
        if (!r.cellStyles) return Dt(e, t);
        var n = r && 12 <= r.biff ? 4 : 2, a = e.read_shift(n), s = e.read_shift(n), i = e.read_shift(n),
            o = e.read_shift(n), l = e.read_shift(2);
        return 2 == n && (e.l += 2), {s: a, e: s, w: i, ixfe: o, flags: l}
    }

    Ba[8] = function (e, t) {
        var r = e.l + t;
        e.l += 10;
        var n = e.read_shift(2);
        e.l += 4, e.l += 2, e.l += 2, e.l += 2, e.l += 4;
        var a = e.read_shift(1);
        return e.l += a, e.l = r, {fmt: n}
    };
    var Aa = qn, Ia = Vn, Ra = Gn;
    var Oa, Fa, Da = (Oa = {
        1: 437,
        2: 850,
        3: 1252,
        4: 1e4,
        100: 852,
        101: 866,
        102: 865,
        103: 861,
        104: 895,
        105: 620,
        106: 737,
        107: 857,
        120: 950,
        121: 949,
        122: 936,
        123: 932,
        124: 874,
        125: 1255,
        126: 1256,
        150: 10007,
        151: 10029,
        152: 10006,
        200: 1250,
        201: 1251,
        202: 1254,
        203: 1253,
        0: 20127,
        8: 865,
        9: 437,
        10: 850,
        11: 437,
        13: 437,
        14: 850,
        15: 437,
        16: 850,
        17: 437,
        18: 850,
        19: 932,
        20: 850,
        21: 437,
        22: 850,
        23: 865,
        24: 437,
        25: 437,
        26: 850,
        27: 437,
        28: 863,
        29: 850,
        31: 852,
        34: 852,
        35: 852,
        36: 860,
        37: 850,
        38: 866,
        55: 850,
        64: 852,
        77: 936,
        78: 949,
        79: 950,
        80: 874,
        87: 1252,
        88: 1252,
        89: 1252,
        255: 16969
    }, Fa = {B: 8, C: 250, L: 1, D: 8, "?": 0, "": 0}, {
        to_workbook: function (e, t) {
            try {
                return tr(Pa(e, t), t)
            } catch (e) {
                if (t && t.WTF) throw e
            }
            return {SheetNames: [], Sheets: {}}
        }, to_sheet: Pa, from_sheet: function (e, t) {
            if ("string" == (t || {}).type) throw new Error("Cannot write DBF to JS string");
            var r = Lt(), n = Jf(e, {header: 1, cellDates: !0}), a = n[0], s = n.slice(1), i = 0, o = 0, l = 0, c = 1;
            for (i = 0; i < a.length; ++i) if (null != i) {
                if (++l, "number" == typeof a[i] && (a[i] = a[i].toString(10)), "string" != typeof a[i]) throw new Error("DBF Invalid column name " + a[i] + " |" + typeof a[i] + "|");
                if (a.indexOf(a[i]) !== i) for (o = 0; o < 1024; ++o) if (-1 == a.indexOf(a[i] + "_" + o)) {
                    a[i] += "_" + o;
                    break
                }
            }
            var f = Jt(e["!ref"]), h = [];
            for (i = 0; i <= f.e.c - f.s.c; ++i) {
                var u = [];
                for (o = 0; o < s.length; ++o) null != s[o][i] && u.push(s[o][i]);
                if (0 != u.length && null != a[i]) {
                    var d = "", p = "";
                    for (o = 0; o < u.length; ++o) {
                        switch (typeof u[o]) {
                            case"number":
                                p = "B";
                                break;
                            case"string":
                                p = "C";
                                break;
                            case"boolean":
                                p = "L";
                                break;
                            case"object":
                                p = u[o] instanceof Date ? "D" : "C";
                                break;
                            default:
                                p = "C"
                        }
                        if ("C" == (d = d && d != p ? "C" : p)) break
                    }
                    c += Fa[d] || 0, h[i] = d
                } else h[i] = "?"
            }
            var m = r.next(32);
            for (m.write_shift(4, 318902576), m.write_shift(4, s.length), m.write_shift(2, 296 + 32 * l), m.write_shift(2, c), i = 0; i < 4; ++i) m.write_shift(4, 0);
            for (m.write_shift(4, 768), o = i = 0; i < a.length; ++i) if (null != a[i]) {
                var g = r.next(32), b = (a[i].slice(-10) + "\0\0\0\0\0\0\0\0\0\0\0").slice(0, 11);
                g.write_shift(1, b, "sbcs"), g.write_shift(1, "?" == h[i] ? "C" : h[i], "sbcs"), g.write_shift(4, o), g.write_shift(1, Fa[h[i]] || 0), g.write_shift(1, 0), g.write_shift(1, 2), g.write_shift(4, 0), g.write_shift(1, 0), g.write_shift(4, 0), g.write_shift(4, 0), o += Fa[h[i]] || 0
            }
            var v = r.next(264);
            for (v.write_shift(4, 13), i = 0; i < 65; ++i) v.write_shift(4, 0);
            for (i = 0; i < s.length; ++i) {
                var E = r.next(c);
                for (E.write_shift(1, 0), o = 0; o < a.length; ++o) if (null != a[o]) switch (h[o]) {
                    case"L":
                        E.write_shift(1, null == s[i][o] ? 63 : s[i][o] ? 84 : 70);
                        break;
                    case"B":
                        E.write_shift(8, s[i][o] || 0, "f");
                        break;
                    case"D":
                        s[i][o] ? (E.write_shift(4, ("0000" + s[i][o].getFullYear()).slice(-4), "sbcs"), E.write_shift(2, ("00" + (s[i][o].getMonth() + 1)).slice(-2), "sbcs"), E.write_shift(2, ("00" + s[i][o].getDate()).slice(-2), "sbcs")) : E.write_shift(8, "00000000", "sbcs");
                        break;
                    case"C":
                        var w = String(s[i][o] || "");
                        for (E.write_shift(1, w, "sbcs"), l = 0; l < 250 - w.length; ++l) E.write_shift(1, 32)
                }
            }
            return r.next(1).write_shift(1, 26), r.end()
        }
    });

    function Pa(e, t) {
        var r = t || {};
        return r.dateNF || (r.dateNF = "yyyymmdd"), nr(function (e, t) {
            var r = [], n = te(1);
            switch (t.type) {
                case"base64":
                    n = se(q.decode(e));
                    break;
                case"binary":
                    n = se(e);
                    break;
                case"buffer":
                case"array":
                    n = e
            }
            Ft(n, 0);
            var a = n.read_shift(1), s = !1, i = !1, o = !1;
            switch (a) {
                case 2:
                case 3:
                    break;
                case 48:
                    s = i = !0;
                    break;
                case 49:
                    i = !0;
                    break;
                case 131:
                case 139:
                    s = !0;
                    break;
                case 140:
                    o = s = !0;
                    break;
                case 245:
                    s = !0;
                    break;
                default:
                    throw new Error("DBF Unsupported Version: " + a.toString(16))
            }
            var l = 0, c = 0;
            2 == a && (l = n.read_shift(2)), n.l += 3, 2 != a && (l = n.read_shift(4)), 2 != a && (c = n.read_shift(2));
            var f = n.read_shift(2), h = 1252;
            2 != a && (n.l += 16, n.read_shift(1), 0 !== n[n.l] && (h = Oa[n[n.l]]), n.l += 1, n.l += 2), o && (n.l += 36);
            for (var u = [], d = {}, p = c - 10 - (i ? 264 : 0), m = o ? 32 : 11; 2 == a ? n.l < n.length && 13 != n[n.l] : n.l < p;) switch ((d = {}).name = cptable.utils.decode(h, n.slice(n.l, n.l + m)).replace(/[\u0000\r\n].*$/g, ""), n.l += m, d.type = String.fromCharCode(n.read_shift(1)), 2 == a || o || (d.offset = n.read_shift(4)), d.len = n.read_shift(1), 2 == a && (d.offset = n.read_shift(2)), d.dec = n.read_shift(1), d.name.length && u.push(d), 2 != a && (n.l += o ? 13 : 14), d.type) {
                case"B":
                    i && 8 == d.len || !t.WTF || console.log("Skipping " + d.name + ":" + d.type);
                    break;
                case"G":
                case"P":
                    t.WTF && console.log("Skipping " + d.name + ":" + d.type);
                    break;
                case"C":
                case"D":
                case"F":
                case"I":
                case"L":
                case"M":
                case"N":
                case"O":
                case"T":
                case"Y":
                case"0":
                case"@":
                case"+":
                    break;
                default:
                    throw new Error("Unknown Field Type: " + d.type)
            }
            if (13 !== n[n.l] ? n.l = c - 1 : 2 == a && (n.l = 521), 2 != a) {
                if (13 !== n.read_shift(1)) throw new Error("DBF Terminator not found " + n.l + " " + n[n.l]);
                n.l = c
            }
            var g = 0, b = 0;
            for (r[0] = [], b = 0; b != u.length; ++b) r[0][b] = u[b].name;
            for (; 0 < l--;) if (42 !== n[n.l]) for (++n.l, r[++g] = [], b = b = 0; b != u.length; ++b) {
                var v = n.slice(n.l, n.l + u[b].len);
                n.l += u[b].len, Ft(v, 0);
                var E = cptable.utils.decode(h, v);
                switch (u[b].type) {
                    case"C":
                        r[g][b] = cptable.utils.decode(h, v), r[g][b] = r[g][b].trim();
                        break;
                    case"D":
                        8 === E.length ? r[g][b] = new Date(+E.slice(0, 4), E.slice(4, 6) - 1, +E.slice(6, 8)) : r[g][b] = E;
                        break;
                    case"F":
                        r[g][b] = parseFloat(E.trim());
                        break;
                    case"+":
                    case"I":
                        r[g][b] = o ? 2147483648 ^ v.read_shift(-4, "i") : v.read_shift(4, "i");
                        break;
                    case"L":
                        switch (E.toUpperCase()) {
                            case"Y":
                            case"T":
                                r[g][b] = !0;
                                break;
                            case"N":
                            case"F":
                                r[g][b] = !1;
                                break;
                            case" ":
                            case"?":
                                r[g][b] = !1;
                                break;
                            default:
                                throw new Error("DBF Unrecognized L:|" + E + "|")
                        }
                        break;
                    case"M":
                        if (!s) throw new Error("DBF Unexpected MEMO for type " + a.toString(16));
                        r[g][b] = "##MEMO##" + (o ? parseInt(E.trim(), 10) : v.read_shift(4));
                        break;
                    case"N":
                        r[g][b] = +E.replace(/\u0000/g, "").trim();
                        break;
                    case"@":
                        r[g][b] = new Date(v.read_shift(-8, "f") - 621356832e5);
                        break;
                    case"T":
                        r[g][b] = new Date(864e5 * (v.read_shift(4) - 2440588) + v.read_shift(4));
                        break;
                    case"Y":
                        r[g][b] = v.read_shift(4, "i") / 1e4;
                        break;
                    case"O":
                        r[g][b] = -v.read_shift(-8, "f");
                        break;
                    case"B":
                        if (i && 8 == u[b].len) {
                            r[g][b] = v.read_shift(8, "f");
                            break
                        }
                    case"G":
                    case"P":
                        v.l += u[b].len;
                        break;
                    case"0":
                        if ("_NullFlags" === u[b].name) break;
                    default:
                        throw new Error("DBF Unsupported data type " + u[b].type)
                }
            } else n.l += f;
            if (2 != a && n.l < n.length && 26 != n[n.l++]) throw new Error("DBF EOF Marker missing " + (n.l - 1) + " of " + n.length + " " + n[n.l - 1].toString(16));
            return t && t.sheetRows && (r = r.slice(0, t.sheetRows)), r
        }(e, r), r)
    }

    var Na = {
        to_workbook: function (e, t) {
            return tr(Ma(e, t), t)
        }, to_sheet: Ma, from_sheet: function (e, t) {
            var r, n, a, s = ["ID;PWXL;N;E"], i = [], o = Jt(e["!ref"]), l = Array.isArray(e), c = "\r\n";
            s.push("P;PGeneral"), s.push("F;P0;DG0G8;M255"), e["!cols"] && (n = s, e["!cols"].forEach(function (e, t) {
                var r = "F;W" + (t + 1) + " " + (t + 1) + " ";
                e.hidden ? r += "0" : ("number" == typeof e.width && (e.wpx = ti(e.width)), "number" == typeof e.wpx && (e.wch = ri(e.wpx)), "number" == typeof e.wch && (r += Math.round(e.wch))), " " != r.charAt(r.length - 1) && n.push(r)
            })), e["!rows"] && (a = s, e["!rows"].forEach(function (e, t) {
                var r = "F;";
                e.hidden ? r += "M0;" : e.hpt ? r += "M" + 20 * e.hpt + ";" : e.hpx && (r += "M" + 20 * li(e.hpx) + ";"), 2 < r.length && a.push(r + "R" + (t + 1))
            })), s.push("B;Y" + (o.e.r - o.s.r + 1) + ";X" + (o.e.c - o.s.c + 1) + ";D" + [o.s.c, o.s.r, o.e.c, o.e.r].join(" "));
            for (var f = o.s.r; f <= o.e.r; ++f) for (var h = o.s.c; h <= o.e.c; ++h) {
                var u = Kt({r: f, c: h});
                (r = l ? (e[f] || [])[h] : e[u]) && (null != r.v || r.f && !r.F) && i.push(Ua(r, 0, f, h))
            }
            return s.join(c) + c + i.join(c) + c + "E" + c
        }
    };

    function La(e, t) {
        for (var r, n = e.split(/[\n\r]+/), a = -1, s = -1, i = 0, o = 0, l = [], c = [], f = null, h = {}, u = [], d = [], p = [], m = 0; i !== n.length; ++i) {
            m = 0;
            var g, b = n[i].trim(), v = b.replace(/;;/g, "").split(";").map(function (e) {
                return e.replace(/\u0001/g, ";")
            }), E = v[0];
            if (0 < b.length) switch (E) {
                case"ID":
                case"E":
                case"B":
                case"O":
                    break;
                case"P":
                    "P" == v[1].charAt(0) && c.push(b.slice(3).replace(/;;/g, ";"));
                    break;
                case"C":
                    var w = !1, S = !1;
                    for (o = 1; o < v.length; ++o) switch (v[o].charAt(0)) {
                        case"X":
                            s = parseInt(v[o].slice(1)) - 1, S = !0;
                            break;
                        case"Y":
                            for (a = parseInt(v[o].slice(1)) - 1, S || (s = 0), r = l.length; r <= a; ++r) l[r] = [];
                            break;
                        case"K":
                            '"' === (g = v[o].slice(1)).charAt(0) ? g = g.slice(1, g.length - 1) : "TRUE" === g ? g = !0 : "FALSE" === g ? g = !1 : isNaN(x(g)) ? isNaN(A(g).getDate()) || (g = Q(g)) : (g = x(g), null !== f && de.is_date(f) && (g = N(g))), "undefined" != typeof cptable && "string" == typeof g && "string" != (t || {}).type && (t || {}).codepage && (g = cptable.utils.decode(t.codepage, g)), w = !0;
                            break;
                        case"E":
                            var _ = eo(v[o].slice(1), {r: a, c: s});
                            l[a][s] = [l[a][s], _];
                            break;
                        default:
                            if (t && t.WTF) throw new Error("SYLK bad record " + b)
                    }
                    w && (l[a][s] = g, f = null);
                    break;
                case"F":
                    var y = 0;
                    for (o = 1; o < v.length; ++o) switch (v[o].charAt(0)) {
                        case"X":
                            s = parseInt(v[o].slice(1)) - 1, ++y;
                            break;
                        case"Y":
                            for (a = parseInt(v[o].slice(1)) - 1, r = l.length; r <= a; ++r) l[r] = [];
                            break;
                        case"M":
                            m = parseInt(v[o].slice(1)) / 20;
                            break;
                        case"F":
                        case"G":
                            break;
                        case"P":
                            f = c[parseInt(v[o].slice(1))];
                            break;
                        case"S":
                        case"D":
                        case"N":
                            break;
                        case"W":
                            for (p = v[o].slice(1).split(" "), r = parseInt(p[0], 10); r <= parseInt(p[1], 10); ++r) m = parseInt(p[2], 10), d[r - 1] = 0 === m ? {hidden: !0} : {wch: m}, ii(d[r - 1]);
                            break;
                        case"C":
                            d[s = parseInt(v[o].slice(1)) - 1] || (d[s] = {});
                            break;
                        case"R":
                            u[a = parseInt(v[o].slice(1)) - 1] || (u[a] = {}), 0 < m ? (u[a].hpt = m, u[a].hpx = ci(m)) : 0 === m && (u[a].hidden = !0);
                            break;
                        default:
                            if (t && t.WTF) throw new Error("SYLK bad record " + b)
                    }
                    y < 1 && (f = null);
                    break;
                default:
                    if (t && t.WTF) throw new Error("SYLK bad record " + b)
            }
        }
        return 0 < u.length && (h["!rows"] = u), 0 < d.length && (h["!cols"] = d), t && t.sheetRows && (l = l.slice(0, t.sheetRows)), [l, h]
    }

    function Ma(e, t) {
        var r = function (e, t) {
            switch (t.type) {
                case"base64":
                    return La(q.decode(e), t);
                case"binary":
                    return La(e, t);
                case"buffer":
                    return La(e.toString("binary"), t);
                case"array":
                    return La(k(e), t)
            }
            throw new Error("Unrecognized type " + t.type)
        }(e, t), n = r[0], a = r[1], s = nr(n, t);
        return ge(a).forEach(function (e) {
            s[e] = a[e]
        }), s
    }

    function Ua(e, t, r, n) {
        var a = "C;Y" + (r + 1) + ";X" + (n + 1) + ";K";
        switch (e.t) {
            case"n":
                a += e.v || 0, e.f && !e.F && (a += ";E" + no(e.f, {r: r, c: n}));
                break;
            case"b":
                a += e.v ? "TRUE" : "FALSE";
                break;
            case"e":
                a += e.w || e.v;
                break;
            case"d":
                a += '"' + (e.w || e.v) + '"';
                break;
            case"s":
                a += '"' + e.v.replace(/"/g, "") + '"'
        }
        return a
    }

    var Ha = {
        to_workbook: function (e, t) {
            return tr(Va(e, t), t)
        }, to_sheet: Va, from_sheet: function (e) {
            var t, r = [], n = Jt(e["!ref"]), a = Array.isArray(e);
            Wa(r, "TABLE", 0, 1, "sheetjs"), Wa(r, "VECTORS", 0, n.e.r - n.s.r + 1, ""), Wa(r, "TUPLES", 0, n.e.c - n.s.c + 1, ""), Wa(r, "DATA", 0, 0, "");
            for (var s = n.s.r; s <= n.e.r; ++s) {
                Xa(r, -1, 0, "BOT");
                for (var i = n.s.c; i <= n.e.c; ++i) {
                    var o = Kt({r: s, c: i});
                    if (t = a ? (e[s] || [])[i] : e[o]) switch (t.t) {
                        case"n":
                            var l = t.w;
                            l || null == t.v || (l = t.v), null == l ? t.f && !t.F ? Xa(r, 1, 0, "=" + t.f) : Xa(r, 1, 0, "") : Xa(r, 0, l, "V");
                            break;
                        case"b":
                            Xa(r, 0, t.v ? 1 : 0, t.v ? "TRUE" : "FALSE");
                            break;
                        case"s":
                            Xa(r, 1, 0, isNaN(t.v) ? t.v : '="' + t.v + '"');
                            break;
                        case"d":
                            t.w || (t.w = de.format(t.z || de._table[14], K(Q(t.v)))), Xa(r, 0, t.w, "V");
                            break;
                        default:
                            Xa(r, 1, 0, "")
                    } else Xa(r, 1, 0, "")
                }
            }
            return Xa(r, -1, 0, "EOD"), r.join("\r\n")
        }
    };

    function za(e, t) {
        for (var r = e.split("\n"), n = -1, a = -1, s = 0, i = []; s !== r.length; ++s) if ("BOT" !== r[s].trim()) {
            if (!(n < 0)) {
                var o = r[s].trim().split(","), l = o[0], c = o[1], f = r[++s].trim();
                switch (+l) {
                    case-1:
                        if ("BOT" === f) {
                            i[++n] = [], a = 0;
                            continue
                        }
                        if ("EOD" !== f) throw new Error("Unrecognized DIF special command " + f);
                        break;
                    case 0:
                        "TRUE" === f ? i[n][a] = !0 : "FALSE" === f ? i[n][a] = !1 : isNaN(x(c)) ? isNaN(A(c).getDate()) ? i[n][a] = c : i[n][a] = Q(c) : i[n][a] = x(c), ++a;
                        break;
                    case 1:
                        f = f.slice(1, f.length - 1), i[n][a++] = "" !== f ? f : null
                }
                if ("EOD" === f) break
            }
        } else i[++n] = [], a = 0;
        return t && t.sheetRows && (i = i.slice(0, t.sheetRows)), i
    }

    function Va(e, t) {
        return nr(function (e, t) {
            switch (t.type) {
                case"base64":
                    return za(q.decode(e), t);
                case"binary":
                    return za(e, t);
                case"buffer":
                    return za(e.toString("binary"), t);
                case"array":
                    return za(k(e), t)
            }
            throw new Error("Unrecognized type " + t.type)
        }(e, t), t)
    }

    function Wa(e, t, r, n, a) {
        e.push(t), e.push(r + "," + n), e.push('"' + a.replace(/"/g, '""') + '"')
    }

    function Xa(e, t, r, n) {
        e.push(t + "," + r), e.push(1 == t ? '"' + n.replace(/"/g, '""') + '"' : n)
    }

    var ja, Ga, $a, Ya,
        Ka = (ja = ["socialcalc:version:1.5", "MIME-Version: 1.0", "Content-Type: multipart/mixed; boundary=SocialCalcSpreadsheetControlSave"].join("\n"), Ga = ["--SocialCalcSpreadsheetControlSave", "Content-type: text/plain; charset=UTF-8"].join("\n") + "\n", $a = ["# SocialCalc Spreadsheet Control Save", "part:sheet"].join("\n"), Ya = "--SocialCalcSpreadsheetControlSave--", {
            to_workbook: function (e, t) {
                return tr(Qa(e, t), t)
            }, to_sheet: Qa, from_sheet: function (e) {
                return [ja, Ga, $a, Ga, function (e) {
                    if (!e || !e["!ref"]) return "";
                    for (var t, r = [], n = [], a = "", s = Zt(e["!ref"]), i = Array.isArray(e), o = s.s.r; o <= s.e.r; ++o) for (var l = s.s.c; l <= s.e.c; ++l) if (a = Kt({
                        r: o,
                        c: l
                    }), (t = i ? (e[o] || [])[l] : e[a]) && null != t.v && "z" !== t.t) {
                        switch (n = ["cell", a, "t"], t.t) {
                            case"s":
                            case"str":
                                n.push(Za(t.v));
                                break;
                            case"n":
                                t.f ? (n[2] = "vtf", n[3] = "n", n[4] = t.v, n[5] = Za(t.f)) : (n[2] = "v", n[3] = t.v);
                                break;
                            case"b":
                                n[2] = "vt" + (t.f ? "f" : "c"), n[3] = "nl", n[4] = t.v ? "1" : "0", n[5] = Za(t.f || (t.v ? "TRUE" : "FALSE"));
                                break;
                            case"d":
                                var c = K(Q(t.v));
                                n[2] = "vtc", n[3] = "nd", n[4] = "" + c, n[5] = t.w || de.format(t.z || de._table[14], c);
                                break;
                            case"e":
                                continue
                        }
                        r.push(n.join(":"))
                    }
                    return r.push("sheet:c:" + (s.e.c - s.s.c + 1) + ":r:" + (s.e.r - s.s.r + 1) + ":tvf:1"), r.push("valueformat:1:text-wiki"), r.join("\n")
                }(e), Ya].join("\n")
            }
        });

    function Za(e) {
        return e.replace(/\\/g, "\\b").replace(/:/g, "\\c").replace(/\n/g, "\\n")
    }

    function Qa(e, t) {
        return nr(function (e, t) {
            for (var r = e.split("\n"), n = -1, a = -1, s = 0, i = []; s !== r.length; ++s) {
                var o = r[s].trim().split(":");
                if ("cell" === o[0]) {
                    var l = Yt(o[1]);
                    if (i.length <= l.r) for (n = i.length; n <= l.r; ++n) i[n] || (i[n] = []);
                    switch (n = l.r, a = l.c, o[2]) {
                        case"t":
                            i[n][a] = o[3].replace(/\\b/g, "\\").replace(/\\c/g, ":").replace(/\\n/g, "\n");
                            break;
                        case"v":
                            i[n][a] = +o[3];
                            break;
                        case"vtf":
                            var c = o[o.length - 1];
                        case"vtc":
                            switch (o[3]) {
                                case"nl":
                                    i[n][a] = !!+o[4];
                                    break;
                                default:
                                    i[n][a] = +o[4]
                            }
                            "vtf" == o[2] && (i[n][a] = [i[n][a], c])
                    }
                }
            }
            return t && t.sheetRows && (i = i.slice(0, t.sheetRows)), i
        }(e, t), t)
    }

    var Ja, qa, es = (Ja = {44: ",", 9: "\t", 59: ";"}, qa = {44: 3, 9: 2, 59: 1}, {
        to_workbook: function (e, t) {
            return tr(as(e, t), t)
        }, to_sheet: as, from_sheet: function (e) {
            for (var t, r = [], n = Jt(e["!ref"]), a = Array.isArray(e), s = n.s.r; s <= n.e.r; ++s) {
                for (var i = [], o = n.s.c; o <= n.e.c; ++o) {
                    var l = Kt({r: s, c: o});
                    if ((t = a ? (e[s] || [])[o] : e[l]) && null != t.v) {
                        for (var c = (t.w || (er(t), t.w) || "").slice(0, 10); c.length < 10;) c += " ";
                        i.push(c + (0 === o ? " " : ""))
                    } else i.push("          ")
                }
                r.push(i.join(""))
            }
            return r.join("\n")
        }
    });

    function ts(e, t, r, n, a) {
        a.raw ? t[r][n] = e : "TRUE" === e ? t[r][n] = !0 : "FALSE" === e ? t[r][n] = !1 : "" === e || (isNaN(x(e)) ? isNaN(A(e).getDate()) ? t[r][n] = e : t[r][n] = Q(e) : t[r][n] = x(e))
    }

    function rs(n, e) {
        var a = e || {}, t = "";
        null != ue && null == a.dense && (a.dense = ue);
        var s = a.dense ? [] : {}, i = {s: {c: 0, r: 0}, e: {c: 0, r: 0}};
        "sep=" == n.slice(0, 4) && 10 == n.charCodeAt(5) ? (t = n.charAt(4), n = n.slice(6)) : t = function (e) {
            for (var t = {}, r = !1, n = 0, a = 0; n < e.length; ++n) 34 == (a = e.charCodeAt(n)) ? r = !r : !r && a in Ja && (t[a] = (t[a] || 0) + 1);
            for (n in a = [], t) t.hasOwnProperty(n) && a.push([t[n], n]);
            if (!a.length) for (n in t = qa) t.hasOwnProperty(n) && a.push([t[n], n]);
            return a.sort(function (e, t) {
                return e[0] - t[0] || qa[e[1]] - qa[t[1]]
            }), Ja[a.pop()[1]]
        }(n.slice(0, 1024));
        var o = 0, l = 0, c = 0, f = 0, h = 0, u = t.charCodeAt(0), r = !1, d = 0;
        n = n.replace(/\r\n/gm, "\n");
        var p, m,
            g = null != a.dateNF ? (p = a.dateNF, m = (m = "number" == typeof p ? de._table[p] : p).replace(v, "(\\d+)"), new RegExp("^" + m + "$")) : null;

        function b() {
            var e = n.slice(f, h), t = {};
            if ('"' == e.charAt(0) && '"' == e.charAt(e.length - 1) && (e = e.slice(1, -1).replace(/""/g, '"')), 0 === e.length) t.t = "z"; else if (a.raw) t.t = "s", t.v = e; else if (0 === e.trim().length) t.t = "s", t.v = e; else if (61 == e.charCodeAt(0)) 34 == e.charCodeAt(1) && 34 == e.charCodeAt(e.length - 1) ? (t.t = "s", t.v = e.slice(2, -1).replace(/""/g, '"')) : 1 != e.length ? (t.t = "n", t.f = e.slice(1)) : (t.t = "s", t.v = e); else if ("TRUE" == e) t.t = "b", t.v = !0; else if ("FALSE" == e) t.t = "b", t.v = !1; else if (isNaN(c = x(e))) if (!isNaN(A(e).getDate()) || g && e.match(g)) {
                t.z = a.dateNF || de._table[14];
                var r = 0;
                g && e.match(g) && (e = function (e, n) {
                    var a = -1, s = -1, i = -1, o = -1, l = -1, c = -1;
                    (e.match(v) || []).forEach(function (e, t) {
                        var r = parseInt(n[t + 1], 10);
                        switch (e.toLowerCase().charAt(0)) {
                            case"y":
                                a = r;
                                break;
                            case"d":
                                i = r;
                                break;
                            case"h":
                                o = r;
                                break;
                            case"s":
                                c = r;
                                break;
                            case"m":
                                0 <= o ? l = r : s = r
                        }
                    }), 0 <= c && -1 == l && 0 <= s && (l = s, s = -1);
                    var t = ("" + (0 <= a ? a : (new Date).getFullYear())).slice(-4) + "-" + ("00" + (1 <= s ? s : 1)).slice(-2) + "-" + ("00" + (1 <= i ? i : 1)).slice(-2);
                    7 == t.length && (t = "0" + t), 8 == t.length && (t = "20" + t);
                    var r = ("00" + (0 <= o ? o : 0)).slice(-2) + ":" + ("00" + (0 <= l ? l : 0)).slice(-2) + ":" + ("00" + (0 <= c ? c : 0)).slice(-2);
                    return -1 == o && -1 == l && -1 == c ? t : -1 == a && -1 == s && -1 == i ? r : t + "T" + r
                }(a.dateNF, e.match(g) || []), r = 1), a.cellDates ? (t.t = "d", t.v = Q(e, r)) : (t.t = "n", t.v = K(Q(e, r))), !1 !== a.cellText && (t.w = de.format(t.z, t.v instanceof Date ? K(t.v) : t.v)), a.cellNF || delete t.z
            } else t.t = "s", t.v = e; else !(t.t = "n") !== a.cellText && (t.w = e), t.v = c;
            if ("z" == t.t || (a.dense ? (s[o] || (s[o] = []), s[o][l] = t) : s[Kt({
                c: l,
                r: o
            })] = t), f = h + 1, i.e.c < l && (i.e.c = l), i.e.r < o && (i.e.r = o), d == u) ++l; else if (l = 0, ++o, a.sheetRows && a.sheetRows <= o) return 1
        }

        e:for (; h < n.length; ++h) switch (d = n.charCodeAt(h)) {
            case 34:
                r = !r;
                break;
            case u:
            case 10:
            case 13:
                if (!r && b()) break e
        }
        return 0 < h - f && b(), s["!ref"] = Qt(i), s
    }

    function ns(e, t) {
        return "sep=" == e.slice(0, 4) || 0 <= e.indexOf("\t") || 0 <= e.indexOf(",") || 0 <= e.indexOf(";") ? rs(e, t) : nr(function (e, t) {
            var r = t || {}, n = [];
            if (!e || 0 === e.length) return n;
            for (var a = e.split(/[\r\n]/), s = a.length - 1; 0 <= s && 0 === a[s].length;) --s;
            for (var i = 10, o = 0, l = 0; l <= s; ++l) -1 == (o = a[l].indexOf(" ")) ? o = a[l].length : o++, i = Math.max(i, o);
            for (l = 0; l <= s; ++l) {
                n[l] = [];
                var c = 0;
                for (ts(a[l].slice(0, i).trim(), n, l, c, r), c = 1; c <= (a[l].length - i) / 10 + 1; ++c) ts(a[l].slice(i + 10 * (c - 1), i + 10 * c).trim(), n, l, c, r)
            }
            return r.sheetRows && (n = n.slice(0, r.sheetRows)), n
        }(e, t), t)
    }

    function as(e, t) {
        var r = "", n = "string" == t.type ? [0, 0, 0, 0] : Hf(e, t);
        switch (t.type) {
            case"base64":
                r = q.decode(e);
                break;
            case"binary":
                r = e;
                break;
            case"buffer":
                r = 65001 == t.codepage ? e.toString("utf8") : t.codepage && "undefined" != typeof cptable ? cptable.utils.decode(t.codepage, e) : e.toString("binary");
                break;
            case"array":
                r = k(e);
                break;
            case"string":
                r = e;
                break;
            default:
                throw new Error("Unrecognized type " + t.type)
        }
        return 239 == n[0] && 187 == n[1] && 191 == n[2] ? r = Fe(r.slice(3)) : "binary" == t.type && "undefined" != typeof cptable && t.codepage && (r = cptable.utils.decode(t.codepage, cptable.utils.encode(1252, r))), "socialcalc:version:" == r.slice(0, 19) ? Ka.to_sheet("string" == t.type ? r : Fe(r), t) : ns(r, t)
    }

    var ss, is, os = (ss = {
        0: {n: "BOF", f: Hn},
        1: {n: "EOF"},
        2: {n: "CALCMODE"},
        3: {n: "CALCORDER"},
        4: {n: "SPLIT"},
        5: {n: "SYNC"},
        6: {
            n: "RANGE", f: function (e) {
                var t = {s: {c: 0, r: 0}, e: {c: 0, r: 0}};
                return t.s.c = e.read_shift(2), t.s.r = e.read_shift(2), t.e.c = e.read_shift(2), t.e.r = e.read_shift(2), 65535 == t.s.c && (t.s.c = t.e.c = t.s.r = t.e.r = 0), t
            }
        },
        7: {n: "WINDOW1"},
        8: {n: "COLW1"},
        9: {n: "WINTWO"},
        10: {n: "COLW2"},
        11: {n: "NAME"},
        12: {n: "BLANK"},
        13: {
            n: "INTEGER", f: function (e, t, r) {
                var n = cs(e, 0, r);
                return n[1].v = e.read_shift(2, "i"), n
            }
        },
        14: {
            n: "NUMBER", f: function (e, t, r) {
                var n = cs(e, 0, r);
                return n[1].v = e.read_shift(8, "f"), n
            }
        },
        15: {n: "LABEL", f: fs},
        16: {
            n: "FORMULA", f: function (e, t, r) {
                var n = e.l + t, a = cs(e, 0, r);
                if (a[1].v = e.read_shift(8, "f"), r.qpro) e.l = n; else {
                    var s = e.read_shift(2);
                    e.l += s
                }
                return a
            }
        },
        24: {n: "TABLE"},
        25: {n: "ORANGE"},
        26: {n: "PRANGE"},
        27: {n: "SRANGE"},
        28: {n: "FRANGE"},
        29: {n: "KRANGE1"},
        32: {n: "HRANGE"},
        35: {n: "KRANGE2"},
        36: {n: "PROTEC"},
        37: {n: "FOOTER"},
        38: {n: "HEADER"},
        39: {n: "SETUP"},
        40: {n: "MARGINS"},
        41: {n: "LABELFMT"},
        42: {n: "TITLES"},
        43: {n: "SHEETJS"},
        45: {n: "GRAPH"},
        46: {n: "NGRAPH"},
        47: {n: "CALCCOUNT"},
        48: {n: "UNFORMATTED"},
        49: {n: "CURSORW12"},
        50: {n: "WINDOW"},
        51: {n: "STRING", f: fs},
        55: {n: "PASSWORD"},
        56: {n: "LOCKED"},
        60: {n: "QUERY"},
        61: {n: "QUERYNAME"},
        62: {n: "PRINT"},
        63: {n: "PRINTNAME"},
        64: {n: "GRAPH2"},
        65: {n: "GRAPHNAME"},
        66: {n: "ZOOM"},
        67: {n: "SYMSPLIT"},
        68: {n: "NSROWS"},
        69: {n: "NSCOLS"},
        70: {n: "RULER"},
        71: {n: "NNAME"},
        72: {n: "ACOMM"},
        73: {n: "AMACRO"},
        74: {n: "PARSE"},
        255: {n: "", f: Dt}
    }, is = {
        0: {n: "BOF"},
        1: {n: "EOF"},
        3: {n: "??"},
        4: {n: "??"},
        5: {n: "??"},
        6: {n: "??"},
        7: {n: "??"},
        9: {n: "??"},
        10: {n: "??"},
        11: {n: "??"},
        12: {n: "??"},
        14: {n: "??"},
        15: {n: "??"},
        16: {n: "??"},
        17: {n: "??"},
        18: {n: "??"},
        19: {n: "??"},
        21: {n: "??"},
        22: {
            n: "LABEL16", f: function (e, t) {
                var r = hs(e);
                return r[1].t = "s", r[1].v = e.read_shift(t - 4, "cstr"), r
            }
        },
        23: {n: "NUMBER17", f: us},
        24: {
            n: "NUMBER18", f: function (e, t) {
                var r = hs(e);
                r[1].v = e.read_shift(2);
                var n = r[1].v >> 1;
                if (1 & r[1].v) switch (7 & n) {
                    case 1:
                        n = 500 * (n >> 3);
                        break;
                    case 2:
                        n = (n >> 3) / 20;
                        break;
                    case 4:
                        n = (n >> 3) / 2e3;
                        break;
                    case 6:
                        n = (n >> 3) / 16;
                        break;
                    case 7:
                        n = (n >> 3) / 64;
                        break;
                    default:
                        throw"unknown NUMBER_18 encoding " + (7 & n)
                }
                return r[1].v = n, r
            }
        },
        25: {
            n: "FORMULA19", f: function (e, t) {
                var r = us(e);
                return e.l += t - 14, r
            }
        },
        26: {n: "??"},
        27: {n: "??"},
        28: {n: "??"},
        29: {n: "??"},
        30: {n: "??"},
        31: {n: "??"},
        33: {n: "??"},
        37: {
            n: "NUMBER25", f: function (e, t) {
                var r = hs(e), n = e.read_shift(4);
                return r[1].v = n >> 6, r
            }
        },
        39: {n: "NUMBER27", f: ds},
        40: {
            n: "FORMULA28", f: function (e, t) {
                var r = ds(e);
                return e.l += t - 10, r
            }
        },
        255: {n: "", f: Dt}
    }, {
        to_workbook: function (e, t) {
            switch (t.type) {
                case"base64":
                    return ls(se(q.decode(e)), t);
                case"binary":
                    return ls(se(e), t);
                case"buffer":
                case"array":
                    return ls(e, t)
            }
            throw"Unsupported type " + t.type
        }
    });

    function ls(n, e) {
        if (!n) return n;
        var a = e || {};
        null != ue && null == a.dense && (a.dense = ue);
        var s = a.dense ? [] : {}, i = "Sheet1", o = 0, l = {}, c = [i], f = {s: {r: 0, c: 0}, e: {r: 0, c: 0}},
            h = a.sheetRows || 0;
        if (2 == n[2]) a.Enum = ss; else if (26 == n[2]) a.Enum = is; else {
            if (14 != n[2]) throw new Error("Unrecognized LOTUS BOF " + n[2]);
            a.Enum = is, a.qpro = !0, n.l = 0
        }
        return function (e, t, r) {
            if (e) {
                Ft(e, e.l || 0);
                for (var n = r.Enum || ss; e.l < e.length;) {
                    var a = e.read_shift(2), s = n[a] || n[255], i = e.read_shift(2), o = e.l + i,
                        l = (s.f || Dt)(e, i, r);
                    if (e.l = o, t(l, s.n, a)) return
                }
            }
        }(n, function (e, t, r) {
            if (2 == n[2]) switch (r) {
                case 0:
                    4096 <= (a.vers = e) && (a.qpro = !0);
                    break;
                case 6:
                    f = e;
                    break;
                case 15:
                    a.qpro || (e[1].v = e[1].v.slice(1));
                case 13:
                case 14:
                case 16:
                case 51:
                    14 == r && 112 == (112 & e[2]) && 1 < (15 & e[2]) && (15 & e[2]) < 15 && (e[1].z = a.dateNF || de._table[14], a.cellDates && (e[1].t = "d", e[1].v = N(e[1].v))), a.dense ? (s[e[0].r] || (s[e[0].r] = []), s[e[0].r][e[0].c] = e[1]) : s[Kt(e[0])] = e[1]
            } else switch (r) {
                case 22:
                    e[1].v = e[1].v.slice(1);
                case 23:
                case 24:
                case 25:
                case 37:
                case 39:
                case 40:
                    if (e[3] > o && (s["!ref"] = Qt(f), l[i] = s, s = a.dense ? [] : {}, f = {
                        s: {r: 0, c: 0},
                        e: {r: 0, c: 0}
                    }, o = e[3], i = "Sheet" + (o + 1), c.push(i)), 0 < h && e[0].r >= h) break;
                    a.dense ? (s[e[0].r] || (s[e[0].r] = []), s[e[0].r][e[0].c] = e[1]) : s[Kt(e[0])] = e[1], f.e.c < e[0].c && (f.e.c = e[0].c), f.e.r < e[0].r && (f.e.r = e[0].r)
            }
        }, a), s["!ref"] = Qt(f), l[i] = s, {SheetNames: c, Sheets: l}
    }

    function cs(e, t, r) {
        var n = [{c: 0, r: 0}, {t: "n", v: 0}, 0];
        return r.qpro && 20768 != r.vers ? (n[0].c = e.read_shift(1), e.l++, n[0].r = e.read_shift(2), e.l += 2) : (n[2] = e.read_shift(1), n[0].c = e.read_shift(2), n[0].r = e.read_shift(2)), n
    }

    function fs(e, t, r) {
        var n = e.l + t, a = cs(e, 0, r);
        if (a[1].t = "s", 20768 != r.vers) return r.qpro && e.l++, a[1].v = e.read_shift(n - e.l, "cstr"), a;
        e.l++;
        var s = e.read_shift(1);
        return a[1].v = e.read_shift(s, "utf8"), a
    }

    function hs(e) {
        var t = [{c: 0, r: 0}, {t: "n", v: 0}, 0];
        return t[0].r = e.read_shift(2), t[3] = e[e.l++], t[0].c = e[e.l++], t
    }

    function us(e, t) {
        var r = hs(e), n = e.read_shift(4), a = e.read_shift(4), s = e.read_shift(2);
        if (65535 == s) return r[1].v = 0, r;
        var i = 32768 & s;
        return s = (32767 & s) - 16446, r[1].v = (2 * i - 1) * ((0 < s ? a << s : a >>> -s) + (-32 < s ? n << s + 32 : n >>> -(s + 32))), r
    }

    function ds(e, t) {
        var r = hs(e), n = e.read_shift(8, "f");
        return r[1].v = n, r
    }

    var ps, ms, gs, bs, vs,
        Es = (ps = ze("t"), ms = ze("rPr"), gs = /<(?:\w+:)?r>/g, bs = /<\/(?:\w+:)?r>/, vs = /\r\n/g, function (e) {
            return e.replace(gs, "").split(bs).map(ws).join("")
        });

    function ws(e) {
        var t = [[], "", []], r = e.match(ps);
        if (!r) return "";
        t[1] = r[1];
        var n = e.match(ms);
        return n && function (e, t, r) {
            var n = {}, a = 65001, s = "", i = !1, o = e.match(W), l = 0;
            if (o) for (; l != o.length; ++l) {
                var c = ve(o[l]);
                switch (c[0].replace(/\w*:/g, "")) {
                    case"<condense":
                    case"<extend":
                        break;
                    case"<shadow":
                        if (!c.val) break;
                    case"<shadow>":
                    case"<shadow/>":
                        n.shadow = 1;
                        break;
                    case"</shadow>":
                        break;
                    case"<charset":
                        if ("1" == c.val) break;
                        a = h[parseInt(c.val, 10)];
                        break;
                    case"<outline":
                        if (!c.val) break;
                    case"<outline>":
                    case"<outline/>":
                        n.outline = 1;
                        break;
                    case"</outline>":
                        break;
                    case"<rFont":
                        n.name = c.val;
                        break;
                    case"<sz":
                        n.sz = c.val;
                        break;
                    case"<strike":
                        if (!c.val) break;
                    case"<strike>":
                    case"<strike/>":
                        n.strike = 1;
                        break;
                    case"</strike>":
                        break;
                    case"<u":
                        if (!c.val) break;
                        switch (c.val) {
                            case"double":
                                n.uval = "double";
                                break;
                            case"singleAccounting":
                                n.uval = "single-accounting";
                                break;
                            case"doubleAccounting":
                                n.uval = "double-accounting"
                        }
                    case"<u>":
                    case"<u/>":
                        n.u = 1;
                        break;
                    case"</u>":
                        break;
                    case"<b":
                        if ("0" == c.val) break;
                    case"<b>":
                    case"<b/>":
                        n.b = 1;
                        break;
                    case"</b>":
                        break;
                    case"<i":
                        if ("0" == c.val) break;
                    case"<i>":
                    case"<i/>":
                        n.i = 1;
                        break;
                    case"</i>":
                        break;
                    case"<color":
                        c.rgb && (n.color = c.rgb.slice(2, 8));
                        break;
                    case"<family":
                        n.family = c.val;
                        break;
                    case"<vertAlign":
                        s = c.val;
                        break;
                    case"<scheme":
                        break;
                    case"<extLst":
                    case"<extLst>":
                    case"</extLst>":
                        break;
                    case"<soulTable":
                        i = !0;
                        break;
                    case"</soulTable>":
                        i = !1;
                        break;
                    default:
                        if (47 !== c[0].charCodeAt(1) && !i) throw new Error("Unrecognized rich format " + c[0])
                }
            }
            var f = [];
            n.u && f.push("text-decoration: underline;"), n.uval && f.push("text-underline-style:" + n.uval + ";"), n.sz && f.push("font-size:" + n.sz + "pt;"), n.outline && f.push("text-effect: outline;"), n.shadow && f.push("text-shadow: auto;"), t.push('<span style="' + f.join("") + '">'), n.b && (t.push("<b>"), r.push("</b>")), n.i && (t.push("<i>"), r.push("</i>")), n.strike && (t.push("<s>"), r.push("</s>")), "superscript" == s ? s = "sup" : "subscript" == s && (s = "sub"), "" != s && (t.push("<" + s + ">"), r.push("</" + s + ">")), r.push("</span>")
        }(n[1], t[0], t[2]), t[0].join("") + t[1].replace(vs, "<br/>") + t[2].join("")
    }

    var Ss = /<(?:\w+:)?t[^>]*>([^<]*)<\/(?:\w+:)?t>/g, _s = /<(?:\w+:)?r>/,
        ys = /<(?:\w+:)?rPh.*?>([\s\S]*?)<\/(?:\w+:)?rPh>/g;

    function Cs(e, t) {
        var r = !t || t.cellHTML, n = {};
        return e ? (e.match(/^\s*<(?:\w+:)?t[^>]*>/) ? (n.t = Se(Fe(e.slice(e.indexOf(">") + 1).split(/<\/(?:\w+:)?t>/)[0] || "")), n.r = Fe(e), r && (n.h = ke(n.t))) : e.match(_s) && (n.r = Fe(e), n.t = Se(Fe((e.replace(ys, "").match(Ss) || []).join("").replace(W, ""))), r && (n.h = Es(n.r))), n) : null
    }

    var Bs = /<(?:\w+:)?sst([^>]*)>([\s\S]*)<\/(?:\w+:)?sst>/, Ts = /<(?:\w+:)?(?:si|sstItem)>/g,
        ks = /<\/(?:\w+:)?(?:si|sstItem)>/;
    Zr.SST = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings";
    var xs = /^\s|\s$|[\t\n\r]/;
    var As = function (e, t) {
        var r = !1;
        return null == t && (r = !0, t = Pt(15 + 4 * e.t.length)), t.write_shift(1, 0), ir(e.t, t), r ? t.slice(0, t.l) : t
    };

    function Is(e) {
        var t, r, n = Lt();
        Mt(n, "BrtBeginSst", (t = e, (r = r || Pt(8)).write_shift(4, t.Count), r.write_shift(4, t.Unique), r));
        for (var a = 0; a < e.length; ++a) Mt(n, "BrtSSTItem", As(e[a]));
        return Mt(n, "BrtEndSst"), n.end()
    }

    function Rs(e) {
        if ("undefined" != typeof cptable) return cptable.utils.encode(a, e);
        for (var t = [], r = e.split(""), n = 0; n < r.length; ++n) t[n] = r[n].charCodeAt(0);
        return t
    }

    function Os(e, t) {
        var r = {};
        return r.Major = e.read_shift(2), r.Minor = e.read_shift(2), 4 <= t && (e.l += t - 4), r
    }

    function Fs(e) {
        for (var t = e.read_shift(4), r = e.l + t - 4, n = {}, a = e.read_shift(4), s = []; 0 < a--;) s.push({
            t: e.read_shift(4),
            v: e.read_shift(0, "lpp4")
        });
        if (n.name = e.read_shift(0, "lpp4"), n.comps = s, e.l != r) throw new Error("Bad DataSpaceMapEntry: " + e.l + " != " + r);
        return n
    }

    function Ds(e) {
        var t, r,
            n = (r = {}, (t = e).read_shift(4), t.l += 4, r.id = t.read_shift(0, "lpp4"), r.name = t.read_shift(0, "lpp4"), r.R = Os(t, 4), r.U = Os(t, 4), r.W = Os(t, 4), r);
        if (n.ename = e.read_shift(0, "8lpp4"), n.blksz = e.read_shift(4), n.cmode = e.read_shift(4), 4 != e.read_shift(4)) throw new Error("Bad !Primary record");
        return n
    }

    function Ps(e, t) {
        var r = e.l + t, n = {};
        n.Flags = 63 & e.read_shift(4), e.l += 4, n.AlgID = e.read_shift(4);
        var a = !1;
        switch (n.AlgID) {
            case 26126:
            case 26127:
            case 26128:
                a = 36 == n.Flags;
                break;
            case 26625:
                a = 4 == n.Flags;
                break;
            case 0:
                a = 16 == n.Flags || 4 == n.Flags || 36 == n.Flags;
                break;
            default:
                throw"Unrecognized encryption algorithm: " + n.AlgID
        }
        if (!a) throw new Error("Encryption Flags/AlgID mismatch");
        return n.AlgIDHash = e.read_shift(4), n.KeySize = e.read_shift(4), n.ProviderType = e.read_shift(4), e.l += 8, n.CSPName = e.read_shift(r - e.l >> 1, "utf16le"), e.l = r, n
    }

    function Ns(e, t) {
        var r = {}, n = e.l + t;
        return e.l += 4, r.Salt = e.slice(e.l, e.l + 16), e.l += 16, r.Verifier = e.slice(e.l, e.l + 16), e.l += 16, e.read_shift(4), r.VerifierHash = e.slice(e.l, n), e.l = n, r
    }

    function Ls(e) {
        var t = Os(e);
        switch (t.Minor) {
            case 2:
                return [t.Minor, function (e) {
                    if (36 != (63 & e.read_shift(4))) throw new Error("EncryptionInfo mismatch");
                    var t = e.read_shift(4), r = Ps(e, t), n = Ns(e, e.length - e.l);
                    return {t: "Std", h: r, v: n}
                }(e)];
            case 3:
                return [t.Minor, function () {
                    throw new Error("File is password-protected: ECMA-376 Extensible")
                }()];
            case 4:
                return [t.Minor, function (e) {
                    var r = ["saltSize", "blockSize", "keyBits", "hashSize", "cipherAlgorithm", "cipherChaining", "hashAlgorithm", "saltValue"];
                    e.l += 4;
                    var t = e.read_shift(e.length - e.l, "utf8"), n = {};
                    return t.replace(W, function (e) {
                        var t = ve(e);
                        switch (G(t[0])) {
                            case"<?xml":
                                break;
                            case"<encryption":
                            case"</encryption>":
                                break;
                            case"<keyData":
                                r.forEach(function (e) {
                                    n[e] = t[e]
                                });
                                break;
                            case"<dataIntegrity":
                                n.encryptedHmacKey = t.encryptedHmacKey, n.encryptedHmacValue = t.encryptedHmacValue;
                                break;
                            case"<keyEncryptors>":
                            case"<keyEncryptors":
                                n.encs = [];
                                break;
                            case"</keyEncryptors>":
                                break;
                            case"<keyEncryptor":
                                n.uri = t.uri;
                                break;
                            case"</keyEncryptor>":
                                break;
                            case"<encryptedKey":
                                n.encs.push(t);
                                break;
                            default:
                                throw t[0]
                        }
                    }), n
                }(e)]
        }
        throw new Error("ECMA-376 Encrypted file unrecognized Version: " + t.Minor)
    }

    function Ms(e) {
        var t, r, n = 0, a = Rs(e), s = a.length + 1;
        for ((t = te(s))[0] = a.length, r = 1; r != s; ++r) t[r] = a[r - 1];
        for (r = s - 1; 0 <= r; --r) n = ((0 == (16384 & n) ? 0 : 1) | n << 1 & 32767) ^ t[r];
        return 52811 ^ n
    }

    var Us, Hs, zs,
        Vs = (Us = [187, 255, 255, 186, 255, 255, 185, 128, 0, 190, 15, 0, 191, 15, 0], Hs = [57840, 7439, 52380, 33984, 4364, 3600, 61902, 12606, 6258, 57657, 54287, 34041, 10252, 43370, 20163], zs = [44796, 19929, 39858, 10053, 20106, 40212, 10761, 31585, 63170, 64933, 60267, 50935, 40399, 11199, 17763, 35526, 1453, 2906, 5812, 11624, 23248, 885, 1770, 3540, 7080, 14160, 28320, 56640, 55369, 41139, 20807, 41614, 21821, 43642, 17621, 28485, 56970, 44341, 19019, 38038, 14605, 29210, 60195, 50791, 40175, 10751, 21502, 43004, 24537, 18387, 36774, 3949, 7898, 15796, 31592, 63184, 47201, 24803, 49606, 37805, 14203, 28406, 56812, 17824, 35648, 1697, 3394, 6788, 13576, 27152, 43601, 17539, 35078, 557, 1114, 2228, 4456, 30388, 60776, 51953, 34243, 7079, 14158, 28316, 14128, 28256, 56512, 43425, 17251, 34502, 7597, 13105, 26210, 52420, 35241, 883, 1766, 3532, 4129, 8258, 16516, 33032, 4657, 9314, 18628], function (e) {
            for (var t, r, n, a = Rs(e), s = function (e) {
                for (var t = Hs[e.length - 1], r = 104, n = e.length - 1; 0 <= n; --n) for (var a = e[n], s = 0; 7 != s; ++s) 64 & a && (t ^= zs[r]), a *= 2, --r;
                return t
            }(a), i = a.length, o = te(16), l = 0; 16 != l; ++l) o[l] = 0;
            for (1 == (1 & i) && (t = s >> 8, o[i] = Ws(Us[0], t), --i, t = 255 & s, r = a[a.length - 1], o[i] = Ws(r, t)); 0 < i;) t = s >> 8, o[--i] = Ws(a[i], t), t = 255 & s, o[--i] = Ws(a[i], t);
            for (n = (i = 15) - a.length; 0 < n;) t = s >> 8, o[i] = Ws(Us[n], t), --n, t = 255 & s, o[--i] = Ws(a[i], t), --i, --n;
            return o
        });

    function Ws(e, t) {
        return 255 & ((r = e ^ t) / 2 | 128 * r);
        var r
    }

    var Xs = function (e) {
        var r = 0, n = Vs(e);
        return function (e) {
            var t = function (e, t, r, n, a) {
                var s, i;
                for (a = a || t, n = n || Vs(e), s = 0; s != t.length; ++s) i = t[s], i = 255 & ((i ^= n[r]) >> 5 | i << 3), a[s] = i, ++r;
                return [a, r, n]
            }("", e, r, n);
            return r = t[1], t[0]
        }
    };

    function js(e, t, r) {
        var n = r || {};
        return n.Info = e.read_shift(2), e.l -= 2, 1 === n.Info ? n.Data = function (e) {
            var t = {}, r = t.EncryptionVersionInfo = Os(e, 4);
            if (1 != r.Major || 1 != r.Minor) throw"unrecognized version code " + r.Major + " : " + r.Minor;
            return t.Salt = e.read_shift(16), t.EncryptedVerifier = e.read_shift(16), t.EncryptedVerifierHash = e.read_shift(16), t
        }(e) : n.Data = function (e, t) {
            var r = {}, n = r.EncryptionVersionInfo = Os(e, 4);
            if (t -= 4, 2 != n.Minor) throw new Error("unrecognized minor version code: " + n.Minor);
            if (4 < n.Major || n.Major < 2) throw new Error("unrecognized major version code: " + n.Major);
            r.Flags = e.read_shift(4), t -= 4;
            var a = e.read_shift(4);
            return t -= 4, r.EncryptionHeader = Ps(e, a), t -= a, r.EncryptionVerifier = Ns(e, t), r
        }(e, t), n
    }

    var Gs = {
        to_workbook: function (e, t) {
            return tr($s(e, t), t)
        }, to_sheet: $s, from_sheet: function (e) {
            for (var t, r = ["{\\rtf1\\ansi"], n = Jt(e["!ref"]), a = Array.isArray(e), s = n.s.r; s <= n.e.r; ++s) {
                r.push("\\trowd\\trautofit1");
                for (var i = n.s.c; i <= n.e.c; ++i) r.push("\\cellx" + (i + 1));
                for (r.push("\\pard\\intbl"), i = n.s.c; i <= n.e.c; ++i) {
                    var o = Kt({r: s, c: i});
                    (t = a ? (e[s] || [])[i] : e[o]) && (null != t.v || t.f && !t.F) && (r.push(" " + (t.w || (er(t), t.w))), r.push("\\cell"))
                }
                r.push("\\pard\\intbl\\row")
            }
            return r.join("") + "}"
        }
    };

    function $s(e, t) {
        switch (t.type) {
            case"base64":
                return Ys(q.decode(e), t);
            case"binary":
                return Ys(e, t);
            case"buffer":
                return Ys(e.toString("binary"), t);
            case"array":
                return Ys(k(e), t)
        }
        throw new Error("Unrecognized type " + t.type)
    }

    function Ys(e, t) {
        var r = (t || {}).dense ? [] : {};
        if (!e.match(/\\trowd/)) throw new Error("RTF missing table");
        return r["!ref"] = Qt({s: {c: 0, r: 0}, e: {c: 0, r: 0}}), r
    }

    function Ks(e) {
        for (var t = 0, r = 1; 3 != t; ++t) r = 256 * r + (255 < e[t] ? 255 : e[t] < 0 ? 0 : e[t]);
        return r.toString(16).toUpperCase().slice(1)
    }

    function Zs(e, t) {
        if (0 === t) return e;
        var r, n, a = function (e) {
            var t = e[0] / 255, r = e[1] / 255, n = e[2] / 255, a = Math.max(t, r, n), s = Math.min(t, r, n), i = a - s;
            if (0 == i) return [0, 0, t];
            var o, l = 0, c = a + s;
            switch (o = i / (1 < c ? 2 - c : c), a) {
                case t:
                    l = ((r - n) / i + 6) % 6;
                    break;
                case r:
                    l = (n - t) / i + 2;
                    break;
                case n:
                    l = (t - r) / i + 4
            }
            return [l / 6, o, c / 2]
        }((n = (r = e).slice("#" === r[0] ? 1 : 0).slice(0, 6), [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]));
        return a[2] = t < 0 ? a[2] * (1 + t) : 1 - (1 - a[2]) * (1 - t), Ks(function (e) {
            var t, r = e[0], n = e[1], a = e[2], s = 2 * n * (a < .5 ? a : 1 - a), i = a - s / 2, o = [i, i, i],
                l = 6 * r;
            if (0 !== n) switch (0 | l) {
                case 0:
                case 6:
                    t = s * l, o[0] += s, o[1] += t;
                    break;
                case 1:
                    t = s * (2 - l), o[0] += t, o[1] += s;
                    break;
                case 2:
                    t = s * (l - 2), o[1] += s, o[2] += t;
                    break;
                case 3:
                    t = s * (4 - l), o[1] += t, o[2] += s;
                    break;
                case 4:
                    t = s * (l - 4), o[2] += s, o[0] += t;
                    break;
                case 5:
                    t = s * (6 - l), o[2] += t, o[0] += s
            }
            for (var c = 0; 3 != c; ++c) o[c] = Math.round(255 * o[c]);
            return o
        }(a))
    }

    var Qs = 6, Js = 15, qs = 1, ei = Qs;

    function ti(e) {
        return Math.floor((e + Math.round(128 / ei) / 256) * ei)
    }

    function ri(e) {
        return Math.floor((e - 5) / ei * 100 + .5) / 100
    }

    function ni(e) {
        return Math.round((e * ei + 5) / ei * 256) / 256
    }

    function ai(e) {
        return ni(ri(ti(e)))
    }

    function si(e) {
        var t = Math.abs(e - ai(e)), r = ei;
        if (.005 < t) for (ei = qs; ei < Js; ++ei) Math.abs(e - ai(e)) <= t && (t = Math.abs(e - ai(e)), r = ei);
        ei = r
    }

    function ii(e) {
        e.width ? (e.wpx = ti(e.width), e.wch = ri(e.wpx), e.MDW = ei) : e.wpx ? (e.wch = ri(e.wpx), e.width = ni(e.wch), e.MDW = ei) : "number" == typeof e.wch && (e.width = ni(e.wch), e.wpx = ti(e.width), e.MDW = ei), e.customWidth && delete e.customWidth
    }

    var oi = 96;

    function li(e) {
        return 96 * e / oi
    }

    function ci(e) {
        return e * oi / 96
    }

    var fi = {
        None: "none",
        Solid: "solid",
        Gray50: "mediumGray",
        Gray75: "darkGray",
        Gray25: "lightGray",
        HorzStripe: "darkHorizontal",
        VertStripe: "darkVertical",
        ReverseDiagStripe: "darkDown",
        DiagStripe: "darkUp",
        DiagCross: "darkGrid",
        ThickDiagCross: "darkTrellis",
        ThinHorzStripe: "lightHorizontal",
        ThinVertStripe: "lightVertical",
        ThinReverseDiagStripe: "lightDown",
        ThinHorzCross: "lightGrid"
    };
    var hi = ["numFmtId", "fillId", "fontId", "borderId", "xfId"],
        ui = ["applyAlignment", "applyBorder", "applyFill", "applyFont", "applyNumberFormat", "applyProtection", "pivotButton", "quotePrefix"];
    var di, pi, mi, gi, bi,
        vi = (di = /<(?:\w+:)?numFmts([^>]*)>[\S\s]*?<\/(?:\w+:)?numFmts>/, pi = /<(?:\w+:)?cellXfs([^>]*)>[\S\s]*?<\/(?:\w+:)?cellXfs>/, mi = /<(?:\w+:)?fills([^>]*)>[\S\s]*?<\/(?:\w+:)?fills>/, gi = /<(?:\w+:)?fonts([^>]*)>[\S\s]*?<\/(?:\w+:)?fonts>/, bi = /<(?:\w+:)?borders([^>]*)>[\S\s]*?<\/(?:\w+:)?borders>/, function (e, t, r) {
            var n, a, s, i, o, l, c = {};
            return e && ((n = (e = e.replace(/<!--([\s\S]*?)-->/gm, "").replace(/<!DOCTYPE[^\[]*\[[^\]]*\]>/gm, "")).match(di)) && function (e, t, r) {
                t.NumberFmt = [];
                for (var n = ge(de._table), a = 0; a < n.length; ++a) t.NumberFmt[n[a]] = de._table[n[a]];
                var s = e[0].match(W);
                if (s) for (a = 0; a < s.length; ++a) {
                    var i = ve(s[a]);
                    switch (G(i[0])) {
                        case"<numFmts":
                        case"</numFmts>":
                        case"<numFmts/>":
                        case"<numFmts>":
                            break;
                        case"<numFmt":
                            var o = Se(Fe(i.formatCode)), l = parseInt(i.numFmtId, 10);
                            if (t.NumberFmt[l] = o, 0 < l) {
                                if (392 < l) {
                                    for (l = 392; 60 < l && null != t.NumberFmt[l]; --l) ;
                                    t.NumberFmt[l] = o
                                }
                                de.load(o, l)
                            }
                            break;
                        case"</numFmt>":
                            break;
                        default:
                            if (r.WTF) throw new Error("unrecognized " + i[0] + " in numFmts")
                    }
                }
            }(n, c, r), (n = e.match(gi)) && function (e, n, a, s) {
                n.Fonts = [];
                var i = {}, o = !1;
                e[0].match(W).forEach(function (e) {
                    var t = ve(e);
                    switch (G(t[0])) {
                        case"<fonts":
                        case"<fonts>":
                        case"</fonts>":
                            break;
                        case"<font":
                        case"<font>":
                            break;
                        case"</font>":
                        case"<font/>":
                            n.Fonts.push(i), i = {};
                            break;
                        case"<name":
                            t.val && (i.name = t.val);
                            break;
                        case"<name/>":
                        case"</name>":
                            break;
                        case"<b":
                            i.bold = t.val ? Oe(t.val) : 1;
                            break;
                        case"<b/>":
                            i.bold = 1;
                            break;
                        case"<i":
                            i.italic = t.val ? Oe(t.val) : 1;
                            break;
                        case"<i/>":
                            i.italic = 1;
                            break;
                        case"<u":
                            switch (t.val) {
                                case"none":
                                    i.underline = 0;
                                    break;
                                case"single":
                                    i.underline = 1;
                                    break;
                                case"double":
                                    i.underline = 2;
                                    break;
                                case"singleAccounting":
                                    i.underline = 33;
                                    break;
                                case"doubleAccounting":
                                    i.underline = 34
                            }
                            break;
                        case"<u/>":
                            i.underline = 1;
                            break;
                        case"<strike":
                            i.strike = t.val ? Oe(t.val) : 1;
                            break;
                        case"<strike/>":
                            i.strike = 1;
                            break;
                        case"<outline":
                            i.outline = t.val ? Oe(t.val) : 1;
                            break;
                        case"<outline/>":
                            i.outline = 1;
                            break;
                        case"<shadow":
                            i.shadow = t.val ? Oe(t.val) : 1;
                            break;
                        case"<shadow/>":
                            i.shadow = 1;
                            break;
                        case"<condense":
                            i.condense = t.val ? Oe(t.val) : 1;
                            break;
                        case"<condense/>":
                            i.condense = 1;
                            break;
                        case"<extend":
                            i.extend = t.val ? Oe(t.val) : 1;
                            break;
                        case"<extend/>":
                            i.extend = 1;
                            break;
                        case"<sz":
                            t.val && (i.sz = +t.val);
                            break;
                        case"<sz/>":
                        case"</sz>":
                            break;
                        case"<vertAlign":
                            t.val && (i.vertAlign = t.val);
                            break;
                        case"<vertAlign/>":
                        case"</vertAlign>":
                            break;
                        case"<family":
                            t.val && (i.family = parseInt(t.val, 10));
                            break;
                        case"<family/>":
                        case"</family>":
                            break;
                        case"<scheme":
                            t.val && (i.scheme = t.val);
                            break;
                        case"<scheme/>":
                        case"</scheme>":
                            break;
                        case"<charset":
                            if ("1" == t.val) break;
                            t.codepage = h[parseInt(t.val, 10)];
                            break;
                        case"<color":
                            if (i.color || (i.color = {}), t.auto && (i.color.auto = Oe(t.auto)), t.rgb) i.color.rgb = t.rgb.slice(-6); else if (t.indexed) {
                                i.color.index = parseInt(t.indexed, 10);
                                var r = Vr[i.color.index];
                                if (81 == i.color.index && (r = Vr[1]), !r) throw new Error(e);
                                i.color.rgb = r[0].toString(16) + r[1].toString(16) + r[2].toString(16)
                            } else t.theme && (i.color.theme = parseInt(t.theme, 10), t.tint && (i.color.tint = parseFloat(t.tint)), t.theme && a.themeElements && a.themeElements.clrScheme && (i.color.rgb = Zs(a.themeElements.clrScheme[i.color.theme].rgb, i.color.tint || 0)));
                            break;
                        case"<color/>":
                        case"</color>":
                            break;
                        case"<extLst":
                        case"<extLst>":
                        case"</extLst>":
                            break;
                        case"<soulTable":
                            o = !0;
                            break;
                        case"</soulTable>":
                            o = !1;
                            break;
                        default:
                            if (s && s.WTF && !o) throw new Error("unrecognized " + t[0] + " in fonts")
                    }
                })
            }(n, c, t, r), (n = e.match(mi)) && function (e, r, n) {
                r.Fills = [];
                var a = {}, s = !1;
                e[0].match(W).forEach(function (e) {
                    var t = ve(e);
                    switch (G(t[0])) {
                        case"<fills":
                        case"<fills>":
                        case"</fills>":
                            break;
                        case"<fill>":
                        case"<fill":
                        case"<fill/>":
                            a = {}, r.Fills.push(a);
                            break;
                        case"</fill>":
                        case"<gradientFill>":
                            break;
                        case"<gradientFill":
                        case"</gradientFill>":
                            r.Fills.push(a), a = {};
                            break;
                        case"<patternFill":
                        case"<patternFill>":
                            t.patternType && (a.patternType = t.patternType);
                            break;
                        case"<patternFill/>":
                        case"</patternFill>":
                            break;
                        case"<bgColor":
                            a.bgColor || (a.bgColor = {}), t.indexed && (a.bgColor.indexed = parseInt(t.indexed, 10)), t.theme && (a.bgColor.theme = parseInt(t.theme, 10)), t.tint && (a.bgColor.tint = parseFloat(t.tint)), t.rgb && (a.bgColor.rgb = t.rgb.slice(-6));
                            break;
                        case"<bgColor/>":
                        case"</bgColor>":
                            break;
                        case"<fgColor":
                            a.fgColor || (a.fgColor = {}), t.theme && (a.fgColor.theme = parseInt(t.theme, 10)), t.tint && (a.fgColor.tint = parseFloat(t.tint)), t.rgb && (a.fgColor.rgb = t.rgb.slice(-6));
                            break;
                        case"<fgColor/>":
                        case"</fgColor>":
                            break;
                        case"<stop":
                        case"<stop/>":
                        case"</stop>":
                            break;
                        case"<color":
                        case"<color/>":
                        case"</color>":
                            break;
                        case"<extLst":
                        case"<extLst>":
                        case"</extLst>":
                            break;
                        case"<soulTable":
                            s = !0;
                            break;
                        case"</soulTable>":
                            s = !1;
                            break;
                        default:
                            if (n && n.WTF && !s) throw new Error("unrecognized " + t[0] + " in fills")
                    }
                })
            }(n, c, r), (n = e.match(bi)) && function (e, r, n) {
                r.Borders = [];
                var a = {}, s = !1;
                e[0].match(W).forEach(function (e) {
                    var t = ve(e);
                    switch (G(t[0])) {
                        case"<borders":
                        case"<borders>":
                        case"</borders>":
                            break;
                        case"<border":
                        case"<border>":
                        case"<border/>":
                            a = {}, t.diagonalUp && (a.diagonalUp = t.diagonalUp), t.diagonalDown && (a.diagonalDown = t.diagonalDown), r.Borders.push(a);
                            break;
                        case"</border>":
                        case"<left/>":
                            break;
                        case"<left":
                        case"<left>":
                        case"</left>":
                        case"<right/>":
                            break;
                        case"<right":
                        case"<right>":
                        case"</right>":
                        case"<top/>":
                            break;
                        case"<top":
                        case"<top>":
                        case"</top>":
                        case"<bottom/>":
                            break;
                        case"<bottom":
                        case"<bottom>":
                        case"</bottom>":
                            break;
                        case"<diagonal":
                        case"<diagonal>":
                        case"<diagonal/>":
                        case"</diagonal>":
                            break;
                        case"<horizontal":
                        case"<horizontal>":
                        case"<horizontal/>":
                        case"</horizontal>":
                            break;
                        case"<vertical":
                        case"<vertical>":
                        case"<vertical/>":
                        case"</vertical>":
                            break;
                        case"<start":
                        case"<start>":
                        case"<start/>":
                        case"</start>":
                            break;
                        case"<end":
                        case"<end>":
                        case"<end/>":
                        case"</end>":
                            break;
                        case"<color":
                        case"<color>":
                            break;
                        case"<color/>":
                        case"</color>":
                            break;
                        case"<extLst":
                        case"<extLst>":
                        case"</extLst>":
                            break;
                        case"<soulTable":
                            s = !0;
                            break;
                        case"</soulTable>":
                            s = !1;
                            break;
                        default:
                            if (n && n.WTF && !s) throw new Error("unrecognized " + t[0] + " in borders")
                    }
                })
            }(n, c, r), (n = e.match(pi)) && (a = n, i = r, (s = c).CellXf = [], l = !1, a[0].match(W).forEach(function (e) {
                var t = ve(e), r = 0;
                switch (G(t[0])) {
                    case"<cellXfs":
                    case"<cellXfs>":
                    case"<cellXfs/>":
                    case"</cellXfs>":
                        break;
                    case"<xf":
                    case"<xf/>":
                        for (delete (o = t)[0], r = 0; r < hi.length; ++r) o[hi[r]] && (o[hi[r]] = parseInt(o[hi[r]], 10));
                        for (r = 0; r < ui.length; ++r) o[ui[r]] && (o[ui[r]] = Oe(o[ui[r]]));
                        if (392 < o.numFmtId) for (r = 392; 60 < r; --r) if (s.NumberFmt[o.numFmtId] == s.NumberFmt[r]) {
                            o.numFmtId = r;
                            break
                        }
                        s.CellXf.push(o);
                        break;
                    case"</xf>":
                        break;
                    case"<alignment":
                    case"<alignment/>":
                        var n = {};
                        t.vertical && (n.vertical = t.vertical), t.horizontal && (n.horizontal = t.horizontal), null != t.textRotation && (n.textRotation = t.textRotation), t.indent && (n.indent = t.indent), t.wrapText && (n.wrapText = t.wrapText), o.alignment = n;
                        break;
                    case"</alignment>":
                        break;
                    case"<protection":
                    case"</protection>":
                    case"<protection/>":
                        break;
                    case"<extLst":
                    case"<extLst>":
                    case"</extLst>":
                        break;
                    case"<soulTable":
                        l = !0;
                        break;
                    case"</soulTable>":
                        l = !1;
                        break;
                    default:
                        if (i && i.WTF && !l) throw new Error("unrecognized " + t[0] + " in cellXfs")
                }
            }))), c
        }), Ei = Ze("styleSheet", null, {xmlns: Je.main[0], "xmlns:vt": Je.vt});

    function wi(e, t) {
        if ("undefined" != typeof style_builder) return style_builder.toXml();
        var r, n, a, s, i, o = [z, Ei];
        return e.SSF && null != (n = e.SSF, a = ["<numFmts>"], [[5, 8], [23, 26], [41, 44], [50, 392]].forEach(function (e) {
            for (var t = e[0]; t <= e[1]; ++t) null != n[t] && (a[a.length] = Ze("numFmt", null, {
                numFmtId: t,
                formatCode: Ce(n[t])
            }))
        }), r = 1 === a.length ? "" : (a[a.length] = "</numFmts>", a[0] = Ze("numFmts", null, {count: a.length - 2}).replace("/>", ">"), a.join(""))) && (o[o.length] = r), o[o.length] = '<fonts count="1"><font><sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts>', o[o.length] = '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>', o[o.length] = '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>', o[o.length] = '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>', s = t.cellXfs, (i = [])[i.length] = "<cellXfs/>", s.forEach(function (e) {
            i[i.length] = Ze("xf", null, e)
        }), i[i.length] = "</cellXfs>", (r = 2 === i.length ? "" : (i[0] = Ze("cellXfs", null, {count: i.length - 2}).replace("/>", ">"), i.join(""))) && (o[o.length] = r), o[o.length] = '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>', o[o.length] = '<dxfs count="0"/>', o[o.length] = '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4"/>', 2 < o.length && (o[o.length] = "</styleSheet>", o[1] = o[1].replace("/>", ">")), o.join("")
    }

    function Si(e, t, r) {
        (r = r || Pt(6 + 4 * t.length)).write_shift(2, e), ir(t, r);
        var n = r.length > r.l ? r.slice(0, r.l) : r;
        return null == r.l && (r.l = r.length), n
    }

    function _i(e, t) {
        (t = t || Pt(153)).write_shift(2, 20 * e.sz), function (e, t) {
            t = t || Pt(2);
            var r = (e.italic ? 2 : 0) | (e.strike ? 8 : 0) | (e.outline ? 16 : 0) | (e.shadow ? 32 : 0) | (e.condense ? 64 : 0) | (e.extend ? 128 : 0);
            t.write_shift(1, r), t.write_shift(1, 0)
        }(e, t), t.write_shift(2, e.bold ? 700 : 400);
        var r = 0;
        "superscript" == e.vertAlign ? r = 1 : "subscript" == e.vertAlign && (r = 2), t.write_shift(2, r), t.write_shift(1, e.underline || 0), t.write_shift(1, e.family || 0), t.write_shift(1, e.charset || 0), t.write_shift(1, 0), kr(e.color, t);
        var n = 0;
        return "major" == e.scheme && (n = 1), "minor" == e.scheme && (n = 2), t.write_shift(1, n), ir(e.name, t), t.length > t.l ? t.slice(0, t.l) : t
    }

    Zr.STY = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles";
    var yi = S(["none", "solid", "mediumGray", "darkGray", "lightGray", "darkHorizontal", "darkVertical", "darkDown", "darkUp", "darkGrid", "darkTrellis", "lightHorizontal", "lightVertical", "lightDown", "lightUp", "lightGrid", "lightTrellis", "gray125", "gray0625"]),
        Ci = Dt;

    function Bi(e, t) {
        t = t || Pt(84);
        var r = yi[e.patternType];
        null == r && (r = 40), t.write_shift(4, r);
        var n = 0;
        if (40 != r) for (kr({auto: 1}, t), kr({auto: 1}, t); n < 12; ++n) t.write_shift(4, 0); else {
            for (; n < 4; ++n) t.write_shift(4, 0);
            for (; n < 12; ++n) t.write_shift(4, 0)
        }
        return t.length > t.l ? t.slice(0, t.l) : t
    }

    function Ti(e, t, r) {
        return (r = r || Pt(16)).write_shift(2, t || 0), r.write_shift(2, e.numFmtId || 0), r.write_shift(2, 0), r.write_shift(2, 0), r.write_shift(2, 0), r.write_shift(1, 0), r.write_shift(1, 0), r.write_shift(1, 0), r.write_shift(1, 0), r.write_shift(1, 0), r.write_shift(1, 0), r
    }

    function ki(e, t) {
        return (t = t || Pt(10)).write_shift(1, 0), t.write_shift(1, 0), t.write_shift(4, 0), t.write_shift(4, 0), t
    }

    var xi = Dt;

    function Ai(e) {
        var t;
        Mt(e, "BrtBeginBorders", ar(1)), Mt(e, "BrtBorder", ((t = t || Pt(51)).write_shift(1, 0), ki(0, t), ki(0, t), ki(0, t), ki(0, t), ki(0, t), t.length > t.l ? t.slice(0, t.l) : t)), Mt(e, "BrtEndBorders")
    }

    function Ii(e) {
        var t, r;
        Mt(e, "BrtBeginStyles", ar(1)), Mt(e, "BrtStyle", (t = {
            xfId: 0,
            builtinId: 0,
            name: "Normal"
        }, (r = r || Pt(52)).write_shift(4, t.xfId), r.write_shift(2, 1), r.write_shift(1, +t.builtinId), r.write_shift(1, 0), mr(t.name || "", r), r.length > r.l ? r.slice(0, r.l) : r)), Mt(e, "BrtEndStyles")
    }

    function Ri(e) {
        var t, r, n, a;
        Mt(e, "BrtBeginTableStyles", (t = 0, r = "TableStyleMedium9", n = "PivotStyleMedium4", (a = Pt(2052)).write_shift(4, t), mr(r, a), mr(n, a), a.length > a.l ? a.slice(0, a.l) : a)), Mt(e, "BrtEndTableStyles")
    }

    function Oi(e, t) {
        var r, n, a, s, i, o, l = Lt();
        return Mt(l, "BrtBeginStyleSheet"), function (r, n) {
            if (n) {
                var a = 0;
                [[5, 8], [23, 26], [41, 44], [50, 392]].forEach(function (e) {
                    for (var t = e[0]; t <= e[1]; ++t) null != n[t] && ++a
                }), 0 != a && (Mt(r, "BrtBeginFmts", ar(a)), [[5, 8], [23, 26], [41, 44], [50, 392]].forEach(function (e) {
                    for (var t = e[0]; t <= e[1]; ++t) null != n[t] && Mt(r, "BrtFmt", Si(t, n[t]))
                }), Mt(r, "BrtEndFmts"))
            }
        }(l, e.SSF), Mt(r = l, "BrtBeginFonts", ar(1)), Mt(r, "BrtFont", _i({
            sz: 12,
            color: {theme: 1},
            name: "Calibri",
            family: 2,
            scheme: "minor"
        })), Mt(r, "BrtEndFonts"), Mt(n = l, "BrtBeginFills", ar(2)), Mt(n, "BrtFill", Bi({patternType: "none"})), Mt(n, "BrtFill", Bi({patternType: "gray125"})), Mt(n, "BrtEndFills"), Ai(l), Mt(a = l, "BrtBeginCellStyleXFs", ar(1)), Mt(a, "BrtXF", Ti({
            numFmtId: 0,
            fontId: 0,
            fillId: 0,
            borderId: 0
        }, 65535)), Mt(a, "BrtEndCellStyleXFs"), s = l, i = t.cellXfs, Mt(s, "BrtBeginCellXFs", ar(i.length)), i.forEach(function (e) {
            Mt(s, "BrtXF", Ti(e, 0))
        }), Mt(s, "BrtEndCellXFs"), Ii(l), Mt(o = l, "BrtBeginDXFs", ar(0)), Mt(o, "BrtEndDXFs"), Ri(l), Mt(l, "BrtEndStyleSheet"), l.end()
    }

    function Fi(e, r, n) {
        r.themeElements.clrScheme = [];
        var a = {};
        (e[0].match(W) || []).forEach(function (e) {
            var t = ve(e);
            switch (t[0]) {
                case"<a:clrScheme":
                case"</a:clrScheme>":
                    break;
                case"<a:srgbClr":
                    a.rgb = t.val;
                    break;
                case"<a:sysClr":
                    a.rgb = t.lastClr;
                    break;
                case"<a:dk1>":
                case"</a:dk1>":
                case"<a:lt1>":
                case"</a:lt1>":
                case"<a:dk2>":
                case"</a:dk2>":
                case"<a:lt2>":
                case"</a:lt2>":
                case"<a:accent1>":
                case"</a:accent1>":
                case"<a:accent2>":
                case"</a:accent2>":
                case"<a:accent3>":
                case"</a:accent3>":
                case"<a:accent4>":
                case"</a:accent4>":
                case"<a:accent5>":
                case"</a:accent5>":
                case"<a:accent6>":
                case"</a:accent6>":
                case"<a:hlink>":
                case"</a:hlink>":
                case"<a:folHlink>":
                case"</a:folHlink>":
                    "/" === t[0].charAt(1) ? (r.themeElements.clrScheme.push(a), a = {}) : a.name = t[0].slice(3, t[0].length - 1);
                    break;
                default:
                    if (n && n.WTF) throw new Error("Unrecognized " + t[0] + " in clrScheme")
            }
        })
    }

    function Di() {
    }

    function Pi() {
    }

    Zr.THEME = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme";
    var Ni = /<a:clrScheme([^>]*)>[\s\S]*<\/a:clrScheme>/, Li = /<a:fontScheme([^>]*)>[\s\S]*<\/a:fontScheme>/,
        Mi = /<a:fmtScheme([^>]*)>[\s\S]*<\/a:fmtScheme>/;
    var Ui = /<a:themeElements([^>]*)>[\s\S]*<\/a:themeElements>/;

    function Hi(e, t) {
        if (!e || 0 === e.length) return Hi(zi());
        var r, n, a, s, i, o = {};
        if (!(r = e.match(Ui))) throw new Error("themeElements not found in theme");
        return n = r[0], s = t, (a = o).themeElements = {}, [["clrScheme", Ni, Fi], ["fontScheme", Li, Di], ["fmtScheme", Mi, Pi]].forEach(function (e) {
            if (!(i = n.match(e[1]))) throw new Error(e[0] + " not found in themeElements");
            e[2](i, a, s)
        }), o
    }

    function zi(e, t) {
        if (t && t.themeXLSX) return t.themeXLSX;
        var r = [z];
        return r[r.length] = '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">', r[r.length] = "<a:themeElements>", r[r.length] = '<a:clrScheme name="Office">', r[r.length] = '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>', r[r.length] = '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>', r[r.length] = '<a:dk2><a:srgbClr val="1F497D"/></a:dk2>', r[r.length] = '<a:lt2><a:srgbClr val="EEECE1"/></a:lt2>', r[r.length] = '<a:accent1><a:srgbClr val="4F81BD"/></a:accent1>', r[r.length] = '<a:accent2><a:srgbClr val="C0504D"/></a:accent2>', r[r.length] = '<a:accent3><a:srgbClr val="9BBB59"/></a:accent3>', r[r.length] = '<a:accent4><a:srgbClr val="8064A2"/></a:accent4>', r[r.length] = '<a:accent5><a:srgbClr val="4BACC6"/></a:accent5>', r[r.length] = '<a:accent6><a:srgbClr val="F79646"/></a:accent6>', r[r.length] = '<a:hlink><a:srgbClr val="0000FF"/></a:hlink>', r[r.length] = '<a:folHlink><a:srgbClr val="800080"/></a:folHlink>', r[r.length] = "</a:clrScheme>", r[r.length] = '<a:fontScheme name="Office">', r[r.length] = "<a:majorFont>", r[r.length] = '<a:latin typeface="Cambria"/>', r[r.length] = '<a:ea typeface=""/>', r[r.length] = '<a:cs typeface=""/>', r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>', r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>', r[r.length] = '<a:font script="Hans" typeface="宋体"/>', r[r.length] = '<a:font script="Hant" typeface="新細明體"/>', r[r.length] = '<a:font script="Arab" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Hebr" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>', r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>', r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>', r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>', r[r.length] = '<a:font script="Khmr" typeface="MoolBoran"/>', r[r.length] = '<a:font script="Knda" typeface="Tunga"/>', r[r.length] = '<a:font script="Guru" typeface="Raavi"/>', r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>', r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>', r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>', r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>', r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>', r[r.length] = '<a:font script="Deva" typeface="Mangal"/>', r[r.length] = '<a:font script="Telu" typeface="Gautami"/>', r[r.length] = '<a:font script="Taml" typeface="Latha"/>', r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>', r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>', r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>', r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>', r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>', r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>', r[r.length] = '<a:font script="Viet" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>', r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>', r[r.length] = "</a:majorFont>", r[r.length] = "<a:minorFont>", r[r.length] = '<a:latin typeface="Calibri"/>', r[r.length] = '<a:ea typeface=""/>', r[r.length] = '<a:cs typeface=""/>', r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>', r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>', r[r.length] = '<a:font script="Hans" typeface="宋体"/>', r[r.length] = '<a:font script="Hant" typeface="新細明體"/>', r[r.length] = '<a:font script="Arab" typeface="Arial"/>', r[r.length] = '<a:font script="Hebr" typeface="Arial"/>', r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>', r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>', r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>', r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>', r[r.length] = '<a:font script="Khmr" typeface="DaunPenh"/>', r[r.length] = '<a:font script="Knda" typeface="Tunga"/>', r[r.length] = '<a:font script="Guru" typeface="Raavi"/>', r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>', r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>', r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>', r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>', r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>', r[r.length] = '<a:font script="Deva" typeface="Mangal"/>', r[r.length] = '<a:font script="Telu" typeface="Gautami"/>', r[r.length] = '<a:font script="Taml" typeface="Latha"/>', r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>', r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>', r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>', r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>', r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>', r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>', r[r.length] = '<a:font script="Viet" typeface="Arial"/>', r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>', r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>', r[r.length] = "</a:minorFont>", r[r.length] = "</a:fontScheme>", r[r.length] = '<a:fmtScheme name="Office">', r[r.length] = "<a:fillStyleLst>", r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>', r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:lin ang="16200000" scaled="1"/>', r[r.length] = "</a:gradFill>", r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>",r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="100000"/><a:shade val="100000"/><a:satMod val="130000"/></a:schemeClr></a:gs>',r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:shade val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs>',r[r.length] = "</a:gsLst>",r[r.length] = '<a:lin ang="16200000" scaled="0"/>',r[r.length] = "</a:gradFill>",r[r.length] = "</a:fillStyleLst>",r[r.length] = "<a:lnStyleLst>",r[r.length] = '<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln>',r[r.length] = '<a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>',r[r.length] = '<a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>',r[r.length] = "</a:lnStyleLst>",r[r.length] = "<a:effectStyleLst>",r[r.length] = "<a:effectStyle>",r[r.length] = "<a:effectLst>",r[r.length] = '<a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw>',r[r.length] = "</a:effectLst>",r[r.length] = "</a:effectStyle>",r[r.length] = "<a:effectStyle>",r[r.length] = "<a:effectLst>",r[r.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>',r[r.length] = "</a:effectLst>",r[r.length] = "</a:effectStyle>",r[r.length] = "<a:effectStyle>",r[r.length] = "<a:effectLst>",r[r.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>',r[r.length] = "</a:effectLst>",r[r.length] = '<a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d>',r[r.length] = '<a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d>',r[r.length] = "</a:effectStyle>",r[r.length] = "</a:effectStyleLst>",r[r.length] = "<a:bgFillStyleLst>",r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>',r[r.length] = '<a:gradFill rotWithShape="1">',r[r.length] = "<a:gsLst>",r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs>',r[r.length] = '<a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs>',r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs>',r[r.length] = "</a:gsLst>",r[r.length] = '<a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path>',r[r.length] = "</a:gradFill>",r[r.length] = '<a:gradFill rotWithShape="1">',r[r.length] = "<a:gsLst>",r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs>',r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs>',r[r.length] = "</a:gsLst>",r[r.length] = '<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>',r[r.length] = "</a:gradFill>",r[r.length] = "</a:bgFillStyleLst>",r[r.length] = "</a:fmtScheme>",r[r.length] = "</a:themeElements>",r[r.length] = "<a:objectDefaults>",r[r.length] = "<a:spDef>",r[r.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="1"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="3"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="2"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></a:style>',r[r.length] = "</a:spDef>",r[r.length] = "<a:lnDef>",r[r.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="1"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></a:style>',r[r.length] = "</a:lnDef>",r[r.length] = "</a:objectDefaults>",r[r.length] = "<a:extraClrSchemeLst/>",r[r.length] = "</a:theme>",r.join("")
    }

    function Vi(e) {
        var t = {};
        switch (t.xclrType = e.read_shift(2), t.nTintShade = e.read_shift(2), t.xclrType) {
            case 0:
                e.l += 4;
                break;
            case 1:
                t.xclrValue = Dt(e, 4);
                break;
            case 2:
                t.xclrValue = Qn(e);
                break;
            case 3:
                t.xclrValue = e.read_shift(4);
                break;
            case 4:
                e.l += 4
        }
        return e.l += 8, t
    }

    function Wi(e) {
        var t = e.read_shift(2), r = e.read_shift(2) - 4, n = [t];
        switch (t) {
            case 4:
            case 5:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 13:
                n[1] = Vi(e);
                break;
            case 6:
                n[1] = Dt(e, r);
                break;
            case 14:
            case 15:
                n[1] = e.read_shift(1 == r ? 1 : 2);
                break;
            default:
                throw new Error("Unrecognized ExtProp type: " + t + " " + r)
        }
        return n
    }

    Zr.IMG = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", Zr.DRAW = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing";
    var Xi = 1024;

    function ji(e, t) {
        for (var r = [21600, 21600], n = ["m0,0l0", r[1], r[0], r[1], r[0], "0xe"].join(","), a = [Ze("xml", null, {
            "xmlns:v": qe.v,
            "xmlns:o": qe.o,
            "xmlns:x": qe.x,
            "xmlns:mv": qe.mv
        }).replace(/\/>/, ">"), Ze("o:shapelayout", Ze("o:idmap", null, {
            "v:ext": "edit",
            data: e
        }), {"v:ext": "edit"}), Ze("v:shapetype", [Ze("v:stroke", null, {joinstyle: "miter"}), Ze("v:path", null, {
            gradientshapeok: "t",
            "o:connecttype": "rect"
        })].join(""), {id: "_x0000_t202", "o:spt": 202, coordsize: r.join(","), path: n})]; Xi < 1e3 * e;) Xi += 1e3;
        return t.forEach(function (e) {
            var t = Yt(e[0]);
            a = a.concat(["<v:shape" + Ke({
                id: "_x0000_s" + ++Xi,
                type: "#_x0000_t202",
                style: "position:absolute; margin-left:80pt;margin-top:5pt;width:104pt;height:64pt;z-index:10" + (e[1].hidden ? ";visibility:hidden" : ""),
                fillcolor: "#ECFAD4",
                strokecolor: "#edeaa1"
            }) + ">", Ze("v:fill", Ze("o:fill", null, {type: "gradientUnscaled", "v:ext": "view"}), {
                color2: "#BEFF82",
                angle: "-180",
                type: "gradient"
            }), Ze("v:shadow", null, {
                on: "t",
                obscured: "t"
            }), Ze("v:path", null, {"o:connecttype": "none"}), '<v:textbox><div style="text-align:left"></div></v:textbox>', '<x:ClientData ObjectType="Note">', "<x:MoveWithCells/>", "<x:SizeWithCells/>", Ye("x:Anchor", [t.c, 0, t.r, 0, t.c + 3, 100, t.r + 5, 100].join(",")), Ye("x:AutoFill", "False"), Ye("x:Row", String(t.r)), Ye("x:Column", String(t.c)), e[1].hidden ? "" : "<x:Visible/>", "</x:ClientData>", "</v:shape>"])
        }), a.push("</xml>"), a.join("")
    }

    function Gi(e, s, t) {
        var i, o = Array.isArray(s);
        t.forEach(function (e) {
            var t = Yt(e.ref);
            if (!(i = o ? (s[t.r] || (s[t.r] = []), s[t.r][t.c]) : s[e.ref])) {
                i = {}, o ? s[t.r][t.c] = i : s[e.ref] = i;
                var r = Jt(s["!ref"] || "BDWGO1000001:A1");
                r.s.r > t.r && (r.s.r = t.r), r.e.r < t.r && (r.e.r = t.r), r.s.c > t.c && (r.s.c = t.c), r.e.c < t.c && (r.e.c = t.c);
                var n = Qt(r);
                n !== s["!ref"] && (s["!ref"] = n)
            }
            i.c || (i.c = []);
            var a = {a: e.author, t: e.t, r: e.r};
            e.h && (a.h = e.h), i.c.push(a)
        })
    }

    Zr.CMNT = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments";
    var $i = Ze("comments", null, {xmlns: Je.main[0]});
    var Yi = sr;

    function Ki(e) {
        var s = Lt(), i = [];
        return Mt(s, "BrtBeginComments"), Mt(s, "BrtBeginCommentAuthors"), e.forEach(function (e) {
            e[1].forEach(function (e) {
                -1 < i.indexOf(e.a) || (i.push(e.a.slice(0, 54)), Mt(s, "BrtCommentAuthor", ir(e.a.slice(0, 54))))
            })
        }), Mt(s, "BrtEndCommentAuthors"), Mt(s, "BrtBeginCommentList"), e.forEach(function (a) {
            a[1].forEach(function (e) {
                e.iauthor = i.indexOf(e.a);
                var t, r, n = {s: Yt(a[0]), e: Yt(a[0])};
                Mt(s, "BrtBeginComment", (t = [n, e], null == r && (r = Pt(36)), r.write_shift(4, t[1].iauthor), _r(t[0], r), r.write_shift(4, 0), r.write_shift(4, 0), r.write_shift(4, 0), r.write_shift(4, 0), r)), e.t && 0 < e.t.length && Mt(s, "BrtCommentText", cr(e)), Mt(s, "BrtEndComment"), delete e.iauthor
            })
        }), Mt(s, "BrtEndCommentList"), Mt(s, "BrtEndComments"), s.end()
    }

    var Zi = "application/vnd.ms-office.vbaProject";
    var Qi = ["xlsb", "xlsm", "xlam", "biff8", "xla"];
    Zr.DS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/dialogsheet", Zr.MS = "http://schemas.microsoft.com/office/2006/relationships/xlMacrosheet";
    var Ji, qi, eo = (Ji = /(^|[^A-Za-z])R(\[?)(-?\d+|)\]?C(\[?)(-?\d+|)\]?/g, qi = {r: 0, c: 0}, function (e, t) {
        return qi = t, e.replace(Ji, to)
    });

    function to(e, t, r, n, a, s) {
        var i = 0 < n.length ? 0 | parseInt(n, 10) : 0, o = 0 < s.length ? 0 | parseInt(s, 10) : 0;
        o < 0 && 0 === a.length && (o = 0);
        var l = !1, c = !1;
        return (0 < a.length || 0 == s.length) && (l = !0), l ? o += qi.c : --o, (0 < r.length || 0 == n.length) && (c = !0), c ? i += qi.r : --i, t + (l ? "" : "$") + Gt(o) + (c ? "" : "$") + Xt(i)
    }

    var ro = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)([1-9]\d{0,5}|10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6])(?![_.\(A-Za-z0-9])/g,
        no = function (e, l) {
            return e.replace(ro, function (e, t, r, n, a, s) {
                var i = jt(n) - (r ? 0 : l.c), o = Wt(s) - (a ? 0 : l.r);
                return t + "R" + (0 == o ? "" : a ? 1 + o : "[" + o + "]") + "C" + (0 == i ? "" : r ? 1 + i : "[" + i + "]")
            })
        };

    function ao(e, t, r) {
        var i, n = Zt(t).s, a = Yt(r), s = {r: a.r - n.r, c: a.c - n.c};
        return i = s, e.replace(ro, function (e, t, r, n, a, s) {
            return t + ("$" == r ? r + n : Gt(jt(n) + i.c)) + ("$" == a ? a + s : Xt(Wt(s) + i.r))
        })
    }

    function so(e) {
        return e.replace(/_xlfn\./g, "")
    }

    function io(e) {
        e.l += 1
    }

    function oo(e, t) {
        var r = e.read_shift(1 == t ? 1 : 2);
        return [16383 & r, r >> 14 & 1, r >> 15 & 1]
    }

    function lo(e, t, r) {
        var n = 2;
        if (r) {
            if (2 <= r.biff && r.biff <= 5) return co(e);
            12 == r.biff && (n = 4)
        }
        var a = e.read_shift(n), s = e.read_shift(n), i = oo(e, 2), o = oo(e, 2);
        return {s: {r: a, c: i[0], cRel: i[1], rRel: i[2]}, e: {r: s, c: o[0], cRel: o[1], rRel: o[2]}}
    }

    function co(e) {
        var t = oo(e, 2), r = oo(e, 2), n = e.read_shift(1), a = e.read_shift(1);
        return {s: {r: t[0], c: n, cRel: t[1], rRel: t[2]}, e: {r: r[0], c: a, cRel: r[1], rRel: r[2]}}
    }

    function fo(e, t, r) {
        if (r && 2 <= r.biff && r.biff <= 5) return a = oo(n = e, 2), s = n.read_shift(1), {
            r: a[0],
            c: s,
            cRel: a[1],
            rRel: a[2]
        };
        var n, a, s, i = e.read_shift(r && 12 == r.biff ? 4 : 2), o = oo(e, 2);
        return {r: i, c: o[0], cRel: o[1], rRel: o[2]}
    }

    function ho(e, t, r) {
        var n = r && r.biff ? r.biff : 8;
        if (2 <= n && n <= 5) return function (e) {
            var t = e.read_shift(2), r = e.read_shift(1), n = (32768 & t) >> 15, a = (16384 & t) >> 14;
            t &= 16383, 1 == n && 8192 <= t && (t -= 16384);
            1 == a && 128 <= r && (r -= 256);
            return {r: t, c: r, cRel: a, rRel: n}
        }(e);
        var a = e.read_shift(12 <= n ? 4 : 2), s = e.read_shift(2), i = (16384 & s) >> 14, o = (32768 & s) >> 15;
        if (s &= 16383, 1 == o) for (; 524287 < a;) a -= 1048576;
        if (1 == i) for (; 8191 < s;) s -= 16384;
        return {r: a, c: s, cRel: i, rRel: o}
    }

    function uo(e) {
        return [e.read_shift(1), e.read_shift(1)]
    }

    function po(e, t) {
        var r = [e.read_shift(1)];
        if (12 == t) switch (r[0]) {
            case 2:
                r[0] = 4;
                break;
            case 4:
                r[0] = 16;
                break;
            case 0:
                r[0] = 1;
                break;
            case 1:
                r[0] = 2
        }
        switch (r[0]) {
            case 4:
                r[1] = Mn(e, 1) ? "TRUE" : "FALSE", 12 != t && (e.l += 7);
                break;
            case 37:
            case 16:
                r[1] = Br[e[e.l]], e.l += 12 == t ? 4 : 8;
                break;
            case 0:
                e.l += 8;
                break;
            case 1:
                r[1] = yr(e);
                break;
            case 2:
                r[1] = $n(e, 0, {biff: 0 < t && t < 8 ? 2 : t});
                break;
            default:
                throw new Error("Bad SerAr: " + r[0])
        }
        return r
    }

    function mo(e, t, r) {
        for (var n = e.read_shift(12 == r.biff ? 4 : 2), a = [], s = 0; s != n; ++s) a.push((12 == r.biff ? Sr : ra)(e, 8));
        return a
    }

    function go(e, t, r) {
        var n = 0, a = 0;
        12 == r.biff ? (n = e.read_shift(4), a = e.read_shift(4)) : (a = 1 + e.read_shift(1), n = 1 + e.read_shift(2)), 2 <= r.biff && r.biff < 8 && (--n, 0 == --a && (a = 256));
        for (var s = 0, i = []; s != n && (i[s] = []); ++s) for (var o = 0; o != a; ++o) i[s][o] = po(e, r.biff);
        return i
    }

    function bo(e, t, r) {
        return e.l += 2, [(a = (n = e).read_shift(2), s = n.read_shift(2), {
            r: a,
            c: 255 & s,
            fQuoted: !!(16384 & s),
            cRel: s >> 15,
            rRel: s >> 15
        })];
        var n, a, s
    }

    function vo(e) {
        return e.l += 6, []
    }

    var Eo = bo, wo = vo, So = vo, _o = bo;

    function yo(e) {
        return e.l += 2, [Hn(e), 1 & e.read_shift(2)]
    }

    var Co = bo, Bo = yo, To = vo, ko = bo, xo = bo,
        Ao = ["Data", "All", "Headers", "??", "?Data2", "??", "?DataHeaders", "??", "Totals", "??", "??", "??", "?DataTotals", "??", "??", "??", "?Current"];
    var Io = {
        1: {
            n: "PtgExp", f: function (e, t, r) {
                return e.l++, r && 12 == r.biff ? [e.read_shift(4, "i"), 0] : [e.read_shift(2), e.read_shift(r && 2 == r.biff ? 1 : 2)]
            }
        },
        2: {n: "PtgTbl", f: Dt},
        3: {n: "PtgAdd", f: io},
        4: {n: "PtgSub", f: io},
        5: {n: "PtgMul", f: io},
        6: {n: "PtgDiv", f: io},
        7: {n: "PtgPower", f: io},
        8: {n: "PtgConcat", f: io},
        9: {n: "PtgLt", f: io},
        10: {n: "PtgLe", f: io},
        11: {n: "PtgEq", f: io},
        12: {n: "PtgGe", f: io},
        13: {n: "PtgGt", f: io},
        14: {n: "PtgNe", f: io},
        15: {n: "PtgIsect", f: io},
        16: {n: "PtgUnion", f: io},
        17: {n: "PtgRange", f: io},
        18: {n: "PtgUplus", f: io},
        19: {n: "PtgUminus", f: io},
        20: {n: "PtgPercent", f: io},
        21: {n: "PtgParen", f: io},
        22: {n: "PtgMissArg", f: io},
        23: {
            n: "PtgStr", f: function (e, t, r) {
                return e.l++, Wn(e, 0, r)
            }
        },
        26: {
            n: "PtgSheet", f: function (e, t, r) {
                return e.l += 5, e.l += 2, e.l += 2 == r.biff ? 1 : 4, ["PTGSHEET"]
            }
        },
        27: {
            n: "PtgEndSheet", f: function (e, t, r) {
                return e.l += 2 == r.biff ? 4 : 5, ["PTGENDSHEET"]
            }
        },
        28: {
            n: "PtgErr", f: function (e) {
                return e.l++, Br[e.read_shift(1)]
            }
        },
        29: {
            n: "PtgBool", f: function (e) {
                return e.l++, 0 !== e.read_shift(1)
            }
        },
        30: {
            n: "PtgInt", f: function (e) {
                return e.l++, e.read_shift(2)
            }
        },
        31: {
            n: "PtgNum", f: function (e) {
                return e.l++, yr(e)
            }
        },
        32: {
            n: "PtgArray", f: function (e, t, r) {
                var n = (96 & e[e.l++]) >> 5;
                return e.l += 2 == r.biff ? 6 : 12 == r.biff ? 14 : 7, [n]
            }
        },
        33: {
            n: "PtgFunc", f: function (e, t, r) {
                var n = (96 & e[e.l]) >> 5;
                e.l += 1;
                var a = e.read_shift(r && r.biff <= 3 ? 1 : 2);
                return [Yo[a], $o[a], n]
            }
        },
        34: {
            n: "PtgFuncVar", f: function (e, t, r) {
                var n, a = e[e.l++], s = e.read_shift(1),
                    i = r && r.biff <= 3 ? [88 == a ? -1 : 0, e.read_shift(1)] : [(n = e)[n.l + 1] >> 7, 32767 & n.read_shift(2)];
                return [s, (0 === i[0] ? $o : Go)[i[1]]]
            }
        },
        35: {
            n: "PtgName", f: function (e, t, r) {
                var n = e.read_shift(1) >>> 5 & 3, a = !r || 8 <= r.biff ? 4 : 2, s = e.read_shift(a);
                switch (r.biff) {
                    case 2:
                        e.l += 5;
                        break;
                    case 3:
                    case 4:
                        e.l += 8;
                        break;
                    case 5:
                        e.l += 12
                }
                return [n, 0, s]
            }
        },
        36: {
            n: "PtgRef", f: function (e, t, r) {
                var n = (96 & e[e.l]) >> 5;
                return e.l += 1, [n, fo(e, 0, r)]
            }
        },
        37: {
            n: "PtgArea", f: function (e, t, r) {
                return [(96 & e[e.l++]) >> 5, lo(e, 2 <= r.biff && r.biff, r)]
            }
        },
        38: {
            n: "PtgMemArea", f: function (e, t, r) {
                var n = e.read_shift(1) >>> 5 & 3;
                return e.l += r && 2 == r.biff ? 3 : 4, [n, e.read_shift(r && 2 == r.biff ? 1 : 2)]
            }
        },
        39: {n: "PtgMemErr", f: Dt},
        40: {n: "PtgMemNoMem", f: Dt},
        41: {
            n: "PtgMemFunc", f: function (e, t, r) {
                return [e.read_shift(1) >>> 5 & 3, e.read_shift(r && 2 == r.biff ? 1 : 2)]
            }
        },
        42: {
            n: "PtgRefErr", f: function (e, t, r) {
                var n = e.read_shift(1) >>> 5 & 3;
                return e.l += 4, r.biff < 8 && e.l--, 12 == r.biff && (e.l += 2), [n]
            }
        },
        43: {
            n: "PtgAreaErr", f: function (e, t, r) {
                var n = (96 & e[e.l++]) >> 5;
                return e.l += r && 8 < r.biff ? 12 : r.biff < 8 ? 6 : 8, [n]
            }
        },
        44: {
            n: "PtgRefN", f: function (e, t, r) {
                var n = (96 & e[e.l]) >> 5;
                return e.l += 1, [n, ho(e, 0, r)]
            }
        },
        45: {
            n: "PtgAreaN", f: function (e, t, r) {
                return [(96 & e[e.l++]) >> 5, function (e, t) {
                    if (t.biff < 8) return co(e);
                    var r = e.read_shift(12 == t.biff ? 4 : 2), n = e.read_shift(12 == t.biff ? 4 : 2), a = oo(e, 2),
                        s = oo(e, 2);
                    return {s: {r: r, c: a[0], cRel: a[1], rRel: a[2]}, e: {r: n, c: s[0], cRel: s[1], rRel: s[2]}}
                }(e, r)]
            }
        },
        46: {
            n: "PtgMemAreaN", f: function (e) {
                return [e.read_shift(1) >>> 5 & 3, e.read_shift(2)]
            }
        },
        47: {
            n: "PtgMemNoMemN", f: function (e) {
                return [e.read_shift(1) >>> 5 & 3, e.read_shift(2)]
            }
        },
        57: {
            n: "PtgNameX", f: function (e, t, r) {
                return 5 == r.biff ? function (e) {
                    var t = e.read_shift(1) >>> 5 & 3, r = e.read_shift(2, "i");
                    e.l += 8;
                    var n = e.read_shift(2);
                    return e.l += 12, [t, r, n]
                }(e) : [e.read_shift(1) >>> 5 & 3, e.read_shift(2), e.read_shift(4)]
            }
        },
        58: {
            n: "PtgRef3d", f: function (e, t, r) {
                var n = (96 & e[e.l]) >> 5;
                e.l += 1;
                var a = e.read_shift(2);
                return r && 5 == r.biff && (e.l += 12), [n, a, fo(e, 0, r)]
            }
        },
        59: {
            n: "PtgArea3d", f: function (e, t, r) {
                var n = (96 & e[e.l++]) >> 5, a = e.read_shift(2, "i");
                if (r) switch (r.biff) {
                    case 5:
                        e.l += 12, 0;
                        break;
                    case 12:
                        0
                }
                return [n, a, lo(e, 0, r)]
            }
        },
        60: {
            n: "PtgRefErr3d", f: function (e, t, r) {
                var n = (96 & e[e.l++]) >> 5, a = e.read_shift(2), s = 4;
                if (r) switch (r.biff) {
                    case 5:
                        s = 15;
                        break;
                    case 12:
                        s = 6
                }
                return e.l += s, [n, a]
            }
        },
        61: {
            n: "PtgAreaErr3d", f: function (e, t, r) {
                var n = (96 & e[e.l++]) >> 5, a = e.read_shift(2), s = 8;
                if (r) switch (r.biff) {
                    case 5:
                        e.l += 12, s = 6;
                        break;
                    case 12:
                        s = 12
                }
                return e.l += s, [n, a]
            }
        },
        255: {}
    }, Ro = {
        64: 32,
        96: 32,
        65: 33,
        97: 33,
        66: 34,
        98: 34,
        67: 35,
        99: 35,
        68: 36,
        100: 36,
        69: 37,
        101: 37,
        70: 38,
        102: 38,
        71: 39,
        103: 39,
        72: 40,
        104: 40,
        73: 41,
        105: 41,
        74: 42,
        106: 42,
        75: 43,
        107: 43,
        76: 44,
        108: 44,
        77: 45,
        109: 45,
        78: 46,
        110: 46,
        79: 47,
        111: 47,
        88: 34,
        120: 34,
        89: 57,
        121: 57,
        90: 58,
        122: 58,
        91: 59,
        123: 59,
        92: 60,
        124: 60,
        93: 61,
        125: 61
    };
    !function () {
        for (var e in Ro) Io[e] = Io[Ro[e]]
    }();
    var Oo = {
        1: {n: "PtgElfLel", f: yo},
        2: {n: "PtgElfRw", f: ko},
        3: {n: "PtgElfCol", f: Eo},
        6: {n: "PtgElfRwV", f: xo},
        7: {n: "PtgElfColV", f: _o},
        10: {n: "PtgElfRadical", f: Co},
        11: {n: "PtgElfRadicalS", f: To},
        13: {n: "PtgElfColS", f: wo},
        15: {n: "PtgElfColSV", f: So},
        16: {n: "PtgElfRadicalLel", f: Bo},
        25: {
            n: "PtgList", f: function (e) {
                e.l += 2;
                var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(4), a = e.read_shift(2),
                    s = e.read_shift(2);
                return {ixti: t, coltype: 3 & r, rt: Ao[r >> 2 & 31], idx: n, c: a, C: s}
            }
        },
        29: {
            n: "PtgSxName", f: function (e) {
                return e.l += 2, [e.read_shift(4)]
            }
        },
        255: {}
    }, Fo = {
        0: {
            n: "PtgAttrNoop", f: function (e) {
                return e.l += 4, [0, 0]
            }
        }, 1: {
            n: "PtgAttrSemi", f: function (e, t, r) {
                var n = 255 & e[e.l + 1] ? 1 : 0;
                return e.l += r && 2 == r.biff ? 3 : 4, [n]
            }
        }, 2: {
            n: "PtgAttrIf", f: function (e, t, r) {
                var n = 255 & e[e.l + 1] ? 1 : 0;
                return e.l += 2, [n, e.read_shift(r && 2 == r.biff ? 1 : 2)]
            }
        }, 4: {
            n: "PtgAttrChoose", f: function (e, t, r) {
                e.l += 2;
                for (var n = e.read_shift(r && 2 == r.biff ? 1 : 2), a = [], s = 0; s <= n; ++s) a.push(e.read_shift(r && 2 == r.biff ? 1 : 2));
                return a
            }
        }, 8: {
            n: "PtgAttrGoto", f: function (e, t, r) {
                var n = 255 & e[e.l + 1] ? 1 : 0;
                return e.l += 2, [n, e.read_shift(r && 2 == r.biff ? 1 : 2)]
            }
        }, 16: {
            n: "PtgAttrSum", f: function (e, t, r) {
                e.l += r && 2 == r.biff ? 3 : 4
            }
        }, 32: {
            n: "PtgAttrBaxcel", f: function (e) {
                var t = 1 & e[e.l + 1];
                return e.l += 4, [t, 1]
            }
        }, 64: {
            n: "PtgAttrSpace", f: function (e) {
                return e.read_shift(2), uo(e)
            }
        }, 65: {
            n: "PtgAttrSpaceSemi", f: function (e) {
                return e.read_shift(2), uo(e)
            }
        }, 128: {
            n: "PtgAttrIfError", f: function (e) {
                var t = 255 & e[e.l + 1] ? 1 : 0;
                return e.l += 2, [t, e.read_shift(2)]
            }
        }, 255: {}
    };

    function Do(e, t, r, n) {
        if (n.biff < 8) return Dt(e, t);
        for (var a = e.l + t, s = [], i = 0; i !== r.length; ++i) switch (r[i][0]) {
            case"PtgArray":
                r[i][1] = go(e, 0, n), s.push(r[i][1]);
                break;
            case"PtgMemArea":
                r[i][2] = mo(e, r[i][1], n), s.push(r[i][2]);
                break;
            case"PtgExp":
                n && 12 == n.biff && (r[i][1][1] = e.read_shift(4), s.push(r[i][1]));
                break;
            case"PtgList":
            case"PtgElfRadicalS":
            case"PtgElfColS":
            case"PtgElfColSV":
                throw"Unsupported " + r[i][0]
        }
        return 0 !== (t = a - e.l) && s.push(Dt(e, t)), s
    }

    function Po(e, t, r) {
        for (var n, a, s = e.l + t, i = []; s != e.l;) t = s - e.l, a = e[e.l], n = Io[a], 24 !== a && 25 !== a || (n = (24 === a ? Oo : Fo)[e[e.l + 1]]), n && n.f ? i.push([n.n, n.f(e, t, r)]) : Dt(e, t);
        return i
    }

    function No(e) {
        for (var t = [], r = 0; r < e.length; ++r) {
            for (var n = e[r], a = [], s = 0; s < n.length; ++s) {
                var i = n[s];
                if (i) switch (i[0]) {
                    case 2:
                        a.push('"' + i[1].replace(/"/g, '""') + '"');
                        break;
                    default:
                        a.push(i[1])
                } else a.push("")
            }
            t.push(a.join(","))
        }
        return t.join(";")
    }

    Fo[33] = Fo[32];
    var Lo = {
        PtgAdd: "+",
        PtgConcat: "&",
        PtgDiv: "/",
        PtgEq: "=",
        PtgGe: ">=",
        PtgGt: ">",
        PtgLe: "<=",
        PtgLt: "<",
        PtgMul: "*",
        PtgNe: "<>",
        PtgPower: "^",
        PtgSub: "-"
    };

    function Mo(e, t, r) {
        return function (e, t) {
            if (!(e || t && t.biff <= 5 && 2 <= t.biff)) throw new Error("empty sheet name");
            return -1 < e.indexOf(" ") ? "'" + e + "'" : e
        }(function (e, t, r) {
            if (!e) return "SH33TJSERR0";
            if (8 < r.biff && (!e.XTI || !e.XTI[t])) return e.SheetNames[t];
            if (!e.XTI) return "SH33TJSERR6";
            var n = e.XTI[t];
            if (r.biff < 8) return 1e4 < t && (t -= 65536), t < 0 && (t = -t), 0 == t ? "" : e.XTI[t - 1];
            if (!n) return "SH33TJSERR1";
            var a = "";
            if (8 < r.biff) switch (e[n[0]][0]) {
                case 357:
                    return a = -1 == n[1] ? "#REF" : e.SheetNames[n[1]], n[1] == n[2] ? a : a + ":" + e.SheetNames[n[2]];
                case 358:
                    return null != r.SID ? e.SheetNames[r.SID] : "SH33TJSSAME" + e[n[0]][0];
                case 355:
                default:
                    return "SH33TJSSRC" + e[n[0]][0]
            }
            switch (e[n[0]][0][0]) {
                case 1025:
                    return a = -1 == n[1] ? "#REF" : e.SheetNames[n[1]] || "SH33TJSERR3", n[1] == n[2] ? a : a + ":" + e.SheetNames[n[2]];
                case 14849:
                    return "SH33TJSERR8";
                default:
                    return e[n[0]][0][3] ? (a = -1 == n[1] ? "#REF" : e[n[0]][0][3][n[1]] || "SH33TJSERR4", n[1] == n[2] ? a : a + ":" + e[n[0]][0][3][n[2]]) : "SH33TJSERR2"
            }
        }(e, t, r), r)
    }

    function Uo(e, t, r, n, a) {
        var s, i, o, l, c = a && a.biff || 8, f = {s: {c: 0, r: 0}, e: {c: 0, r: 0}}, h = [], u = 0, d = 0, p = "";
        if (!e[0] || !e[0][0]) return "";
        for (var m = -1, g = "", b = 0, v = e[0].length; b < v; ++b) {
            var E = e[0][b];
            switch (E[0]) {
                case"PtgUminus":
                    h.push("-" + h.pop());
                    break;
                case"PtgUplus":
                    h.push("+" + h.pop());
                    break;
                case"PtgPercent":
                    h.push(h.pop() + "%");
                    break;
                case"PtgAdd":
                case"PtgConcat":
                case"PtgDiv":
                case"PtgEq":
                case"PtgGe":
                case"PtgGt":
                case"PtgLe":
                case"PtgLt":
                case"PtgMul":
                case"PtgNe":
                case"PtgPower":
                case"PtgSub":
                    if (s = h.pop(), i = h.pop(), 0 <= m) {
                        switch (e[0][m][1][0]) {
                            case 0:
                                g = D(" ", e[0][m][1][1]);
                                break;
                            case 1:
                                g = D("\r", e[0][m][1][1]);
                                break;
                            default:
                                if (g = "", a.WTF) throw new Error("Unexpected PtgAttrSpaceType " + e[0][m][1][0])
                        }
                        i += g, m = -1
                    }
                    h.push(i + Lo[E[0]] + s);
                    break;
                case"PtgIsect":
                    s = h.pop(), i = h.pop(), h.push(i + " " + s);
                    break;
                case"PtgUnion":
                    s = h.pop(), i = h.pop(), h.push(i + "," + s);
                    break;
                case"PtgRange":
                    s = h.pop(), i = h.pop(), h.push(i + ":" + s);
                    break;
                case"PtgAttrChoose":
                case"PtgAttrGoto":
                case"PtgAttrIf":
                case"PtgAttrIfError":
                    break;
                case"PtgRef":
                    o = Ut(E[1][1], f, a), h.push(zt(o, c));
                    break;
                case"PtgRefN":
                    o = r ? Ut(E[1][1], r, a) : E[1][1], h.push(zt(o, c));
                    break;
                case"PtgRef3d":
                    u = E[1][1], o = Ut(E[1][2], f, a);
                    p = Mo(n, u, a);
                    h.push(p + "!" + zt(o, c));
                    break;
                case"PtgFunc":
                case"PtgFuncVar":
                    var w = E[1][0], S = E[1][1];
                    w = w || 0;
                    var _ = 0 == (w &= 127) ? [] : h.slice(-w);
                    h.length -= w, "User" === S && (S = _.shift()), h.push(S + "(" + _.join(",") + ")");
                    break;
                case"PtgBool":
                    h.push(E[1] ? "TRUE" : "FALSE");
                    break;
                case"PtgInt":
                    h.push(E[1]);
                    break;
                case"PtgNum":
                    h.push(String(E[1]));
                    break;
                case"PtgStr":
                    h.push('"' + E[1] + '"');
                    break;
                case"PtgErr":
                    h.push(E[1]);
                    break;
                case"PtgAreaN":
                    l = Ht(E[1][1], r ? {s: r} : f, a), h.push(Vt(l, a));
                    break;
                case"PtgArea":
                    l = Ht(E[1][1], f, a), h.push(Vt(l, a));
                    break;
                case"PtgArea3d":
                    u = E[1][1], l = E[1][2], p = Mo(n, u, a), h.push(p + "!" + Vt(l, a));
                    break;
                case"PtgAttrSum":
                    h.push("SUM(" + h.pop() + ")");
                    break;
                case"PtgAttrBaxcel":
                case"PtgAttrSemi":
                    break;
                case"PtgName":
                    d = E[1][2];
                    var y = (n.names || [])[d - 1] || (n[0] || [])[d], C = y ? y.Name : "SH33TJSNAME" + String(d);
                    C in Ko && (C = Ko[C]), h.push(C);
                    break;
                case"PtgNameX":
                    var B, T = E[1][1];
                    if (d = E[1][2], !(a.biff <= 5)) {
                        var k = "";
                        14849 == ((n[T] || [])[0] || [])[0] || (1025 == ((n[T] || [])[0] || [])[0] ? n[T][d] && 0 < n[T][d].itab && (k = n.SheetNames[n[T][d].itab - 1] + "!") : k = n.SheetNames[d - 1] + "!"), n[T] && n[T][d] ? k += n[T][d].Name : n[0] && n[0][d] ? k += n[0][d].Name : k += "SH33TJSERRX", h.push(k);
                        break
                    }
                    T < 0 && (T = -T), n[T] && (B = n[T][d]), B = B || {Name: "SH33TJSERRY"}, h.push(B.Name);
                    break;
                case"PtgParen":
                    var x = "(", A = ")";
                    if (0 <= m) {
                        switch (g = "", e[0][m][1][0]) {
                            case 2:
                                x = D(" ", e[0][m][1][1]) + x;
                                break;
                            case 3:
                                x = D("\r", e[0][m][1][1]) + x;
                                break;
                            case 4:
                                A = D(" ", e[0][m][1][1]) + A;
                                break;
                            case 5:
                                A = D("\r", e[0][m][1][1]) + A;
                                break;
                            default:
                                if (a.WTF) throw new Error("Unexpected PtgAttrSpaceType " + e[0][m][1][0])
                        }
                        m = -1
                    }
                    h.push(x + h.pop() + A);
                    break;
                case"PtgRefErr":
                case"PtgRefErr3d":
                    h.push("#REF!");
                    break;
                case"PtgExp":
                    o = {c: E[1][1], r: E[1][0]};
                    var I = {c: r.c, r: r.r};
                    if (n.sharedf[Kt(o)]) {
                        var R = n.sharedf[Kt(o)];
                        h.push(Uo(R, 0, I, n, a))
                    } else {
                        var O = !1;
                        for (s = 0; s != n.arrayf.length; ++s) if (i = n.arrayf[s], !(o.c < i[0].s.c || o.c > i[0].e.c || o.r < i[0].s.r || o.r > i[0].e.r)) {
                            h.push(Uo(i[1], 0, I, n, a)), O = !0;
                            break
                        }
                        O || h.push(E[1])
                    }
                    break;
                case"PtgArray":
                    h.push("{" + No(E[1]) + "}");
                    break;
                case"PtgMemArea":
                    break;
                case"PtgAttrSpace":
                case"PtgAttrSpaceSemi":
                    m = b;
                    break;
                case"PtgTbl":
                case"PtgMemErr":
                    break;
                case"PtgMissArg":
                    h.push("");
                    break;
                case"PtgAreaErr":
                case"PtgAreaErr3d":
                    h.push("#REF!");
                    break;
                case"PtgList":
                    h.push("Table" + E[1].idx + "[#" + E[1].rt + "]");
                    break;
                case"PtgMemAreaN":
                case"PtgMemNoMemN":
                case"PtgAttrNoop":
                case"PtgSheet":
                case"PtgEndSheet":
                case"PtgMemFunc":
                case"PtgMemNoMem":
                    break;
                case"PtgElfCol":
                case"PtgElfColS":
                case"PtgElfColSV":
                case"PtgElfColV":
                case"PtgElfLel":
                case"PtgElfRadical":
                case"PtgElfRadicalLel":
                case"PtgElfRadicalS":
                case"PtgElfRw":
                case"PtgElfRwV":
                    throw new Error("Unsupported ELFs");
                case"PtgSxName":
                default:
                    throw new Error("Unrecognized Formula Token: " + String(E))
            }
            if (3 != a.biff && 0 <= m && -1 == ["PtgAttrSpace", "PtgAttrSpaceSemi", "PtgAttrGoto"].indexOf(e[0][b][0])) {
                var F = !0;
                switch ((E = e[0][m])[1][0]) {
                    case 4:
                        F = !1;
                    case 0:
                        g = D(" ", E[1][1]);
                        break;
                    case 5:
                        F = !1;
                    case 1:
                        g = D("\r", E[1][1]);
                        break;
                    default:
                        if (g = "", a.WTF) throw new Error("Unexpected PtgAttrSpaceType " + E[1][0])
                }
                h.push((F ? g : "") + h.pop() + (F ? "" : g)), m = -1
            }
        }
        if (1 < h.length && a.WTF) throw new Error("bad formula stack");
        return h[0]
    }

    function Ho(e, t, r) {
        var n = e.l + t, a = qn(e);
        2 == r.biff && ++e.l;
        var s = function (e) {
            var t;
            if (65535 !== _t(e, e.l + 6)) return [yr(e), "n"];
            switch (e[e.l]) {
                case 0:
                    return e.l += 8, ["String", "s"];
                case 1:
                    return t = 1 === e[e.l + 2], e.l += 8, [t, "b"];
                case 2:
                    return t = e[e.l + 2], e.l += 8, [t, "e"];
                case 3:
                    return e.l += 8, ["", "s"]
            }
            return []
        }(e), i = e.read_shift(1);
        2 != r.biff && (e.read_shift(1), 5 <= r.biff && e.read_shift(4));
        var o = function (e, t, r) {
            var n, a = e.l + t, s = 2 == r.biff ? 1 : 2, i = e.read_shift(s);
            if (65535 == i) return [[], Dt(e, t - 2)];
            var o = Po(e, i, r);
            return t !== i + s && (n = Do(e, t - i - s, o, r)), e.l = a, [o, n]
        }(e, n - e.l, r);
        return {cell: a, val: s[0], formula: o, shared: i >> 3 & 1, tt: s[1]}
    }

    function zo(e, t, r) {
        var n = e.read_shift(4), a = Po(e, n, r), s = e.read_shift(4);
        return [a, 0 < s ? Do(e, s, a, r) : null]
    }

    var Vo = zo, Wo = zo, Xo = zo, jo = zo, Go = {
        0: "BEEP",
        1: "OPEN",
        2: "OPEN.LINKS",
        3: "CLOSE.ALL",
        4: "SAVE",
        5: "SAVE.AS",
        6: "FILE.DELETE",
        7: "PAGE.SETUP",
        8: "PRINT",
        9: "PRINTER.SETUP",
        10: "QUIT",
        11: "NEW.WINDOW",
        12: "ARRANGE.ALL",
        13: "WINDOW.SIZE",
        14: "WINDOW.MOVE",
        15: "FULL",
        16: "CLOSE",
        17: "RUN",
        22: "SET.PRINT.AREA",
        23: "SET.PRINT.TITLES",
        24: "SET.PAGE.BREAK",
        25: "REMOVE.PAGE.BREAK",
        26: "FONT",
        27: "DISPLAY",
        28: "PROTECT.DOCUMENT",
        29: "PRECISION",
        30: "A1.R1C1",
        31: "CALCULATE.NOW",
        32: "CALCULATION",
        34: "DATA.FIND",
        35: "EXTRACT",
        36: "DATA.DELETE",
        37: "SET.DATABASE",
        38: "SET.CRITERIA",
        39: "SORT",
        40: "DATA.SERIES",
        41: "TABLE",
        42: "FORMAT.NUMBER",
        43: "ALIGNMENT",
        44: "STYLE",
        45: "BORDER",
        46: "CELL.PROTECTION",
        47: "COLUMN.WIDTH",
        48: "UNDO",
        49: "CUT",
        50: "COPY",
        51: "PASTE",
        52: "CLEAR",
        53: "PASTE.SPECIAL",
        54: "EDIT.DELETE",
        55: "INSERT",
        56: "FILL.RIGHT",
        57: "FILL.DOWN",
        61: "DEFINE.NAME",
        62: "CREATE.NAMES",
        63: "FORMULA.GOTO",
        64: "FORMULA.FIND",
        65: "SELECT.LAST.CELL",
        66: "SHOW.ACTIVE.CELL",
        67: "GALLERY.AREA",
        68: "GALLERY.BAR",
        69: "GALLERY.COLUMN",
        70: "GALLERY.LINE",
        71: "GALLERY.PIE",
        72: "GALLERY.SCATTER",
        73: "COMBINATION",
        74: "PREFERRED",
        75: "ADD.OVERLAY",
        76: "GRIDLINES",
        77: "SET.PREFERRED",
        78: "AXES",
        79: "LEGEND",
        80: "ATTACH.TEXT",
        81: "ADD.ARROW",
        82: "SELECT.CHART",
        83: "SELECT.PLOT.AREA",
        84: "PATTERNS",
        85: "MAIN.CHART",
        86: "OVERLAY",
        87: "SCALE",
        88: "FORMAT.LEGEND",
        89: "FORMAT.TEXT",
        90: "EDIT.REPEAT",
        91: "PARSE",
        92: "JUSTIFY",
        93: "HIDE",
        94: "UNHIDE",
        95: "WORKSPACE",
        96: "FORMULA",
        97: "FORMULA.FILL",
        98: "FORMULA.ARRAY",
        99: "DATA.FIND.NEXT",
        100: "DATA.FIND.PREV",
        101: "FORMULA.FIND.NEXT",
        102: "FORMULA.FIND.PREV",
        103: "ACTIVATE",
        104: "ACTIVATE.NEXT",
        105: "ACTIVATE.PREV",
        106: "UNLOCKED.NEXT",
        107: "UNLOCKED.PREV",
        108: "COPY.PICTURE",
        109: "SELECT",
        110: "DELETE.NAME",
        111: "DELETE.FORMAT",
        112: "VLINE",
        113: "HLINE",
        114: "VPAGE",
        115: "HPAGE",
        116: "VSCROLL",
        117: "HSCROLL",
        118: "ALERT",
        119: "NEW",
        120: "CANCEL.COPY",
        121: "SHOW.CLIPBOARD",
        122: "MESSAGE",
        124: "PASTE.LINK",
        125: "APP.ACTIVATE",
        126: "DELETE.ARROW",
        127: "ROW.HEIGHT",
        128: "FORMAT.MOVE",
        129: "FORMAT.SIZE",
        130: "FORMULA.REPLACE",
        131: "SEND.KEYS",
        132: "SELECT.SPECIAL",
        133: "APPLY.NAMES",
        134: "REPLACE.FONT",
        135: "FREEZE.PANES",
        136: "SHOW.INFO",
        137: "SPLIT",
        138: "ON.WINDOW",
        139: "ON.DATA",
        140: "DISABLE.INPUT",
        142: "OUTLINE",
        143: "LIST.NAMES",
        144: "FILE.CLOSE",
        145: "SAVE.WORKBOOK",
        146: "DATA.FORM",
        147: "COPY.CHART",
        148: "ON.TIME",
        149: "WAIT",
        150: "FORMAT.FONT",
        151: "FILL.UP",
        152: "FILL.LEFT",
        153: "DELETE.OVERLAY",
        155: "SHORT.MENUS",
        159: "SET.UPDATE.STATUS",
        161: "COLOR.PALETTE",
        162: "DELETE.STYLE",
        163: "WINDOW.RESTORE",
        164: "WINDOW.MAXIMIZE",
        166: "CHANGE.LINK",
        167: "CALCULATE.DOCUMENT",
        168: "ON.KEY",
        169: "APP.RESTORE",
        170: "APP.MOVE",
        171: "APP.SIZE",
        172: "APP.MINIMIZE",
        173: "APP.MAXIMIZE",
        174: "BRING.TO.FRONT",
        175: "SEND.TO.BACK",
        185: "MAIN.CHART.TYPE",
        186: "OVERLAY.CHART.TYPE",
        187: "SELECT.END",
        188: "OPEN.MAIL",
        189: "SEND.MAIL",
        190: "STANDARD.FONT",
        191: "CONSOLIDATE",
        192: "SORT.SPECIAL",
        193: "GALLERY.3D.AREA",
        194: "GALLERY.3D.COLUMN",
        195: "GALLERY.3D.LINE",
        196: "GALLERY.3D.PIE",
        197: "VIEW.3D",
        198: "GOAL.SEEK",
        199: "WORKGROUP",
        200: "FILL.GROUP",
        201: "UPDATE.LINK",
        202: "PROMOTE",
        203: "DEMOTE",
        204: "SHOW.DETAIL",
        206: "UNGROUP",
        207: "OBJECT.PROPERTIES",
        208: "SAVE.NEW.OBJECT",
        209: "SHARE",
        210: "SHARE.NAME",
        211: "DUPLICATE",
        212: "APPLY.STYLE",
        213: "ASSIGN.TO.OBJECT",
        214: "OBJECT.PROTECTION",
        215: "HIDE.OBJECT",
        216: "SET.EXTRACT",
        217: "CREATE.PUBLISHER",
        218: "SUBSCRIBE.TO",
        219: "ATTRIBUTES",
        220: "SHOW.TOOLBAR",
        222: "PRINT.PREVIEW",
        223: "EDIT.COLOR",
        224: "SHOW.LEVELS",
        225: "FORMAT.MAIN",
        226: "FORMAT.OVERLAY",
        227: "ON.RECALC",
        228: "EDIT.SERIES",
        229: "DEFINE.STYLE",
        240: "LINE.PRINT",
        243: "ENTER.DATA",
        249: "GALLERY.RADAR",
        250: "MERGE.STYLES",
        251: "EDITION.OPTIONS",
        252: "PASTE.PICTURE",
        253: "PASTE.PICTURE.LINK",
        254: "SPELLING",
        256: "ZOOM",
        259: "INSERT.OBJECT",
        260: "WINDOW.MINIMIZE",
        265: "SOUND.NOTE",
        266: "SOUND.PLAY",
        267: "FORMAT.SHAPE",
        268: "EXTEND.POLYGON",
        269: "FORMAT.AUTO",
        272: "GALLERY.3D.BAR",
        273: "GALLERY.3D.SURFACE",
        274: "FILL.AUTO",
        276: "CUSTOMIZE.TOOLBAR",
        277: "ADD.TOOL",
        278: "EDIT.OBJECT",
        279: "ON.DOUBLECLICK",
        280: "ON.ENTRY",
        281: "WORKBOOK.ADD",
        282: "WORKBOOK.MOVE",
        283: "WORKBOOK.COPY",
        284: "WORKBOOK.OPTIONS",
        285: "SAVE.WORKSPACE",
        288: "CHART.WIZARD",
        289: "DELETE.TOOL",
        290: "MOVE.TOOL",
        291: "WORKBOOK.SELECT",
        292: "WORKBOOK.ACTIVATE",
        293: "ASSIGN.TO.TOOL",
        295: "COPY.TOOL",
        296: "RESET.TOOL",
        297: "CONSTRAIN.NUMERIC",
        298: "PASTE.TOOL",
        302: "WORKBOOK.NEW",
        305: "SCENARIO.CELLS",
        306: "SCENARIO.DELETE",
        307: "SCENARIO.ADD",
        308: "SCENARIO.EDIT",
        309: "SCENARIO.SHOW",
        310: "SCENARIO.SHOW.NEXT",
        311: "SCENARIO.SUMMARY",
        312: "PIVOT.TABLE.WIZARD",
        313: "PIVOT.FIELD.PROPERTIES",
        314: "PIVOT.FIELD",
        315: "PIVOT.ITEM",
        316: "PIVOT.ADD.FIELDS",
        318: "OPTIONS.CALCULATION",
        319: "OPTIONS.EDIT",
        320: "OPTIONS.VIEW",
        321: "ADDIN.MANAGER",
        322: "MENU.EDITOR",
        323: "ATTACH.TOOLBARS",
        324: "VBAActivate",
        325: "OPTIONS.CHART",
        328: "VBA.INSERT.FILE",
        330: "VBA.PROCEDURE.DEFINITION",
        336: "ROUTING.SLIP",
        338: "ROUTE.DOCUMENT",
        339: "MAIL.LOGON",
        342: "INSERT.PICTURE",
        343: "EDIT.TOOL",
        344: "GALLERY.DOUGHNUT",
        350: "CHART.TREND",
        352: "PIVOT.ITEM.PROPERTIES",
        354: "WORKBOOK.INSERT",
        355: "OPTIONS.TRANSITION",
        356: "OPTIONS.GENERAL",
        370: "FILTER.ADVANCED",
        373: "MAIL.ADD.MAILER",
        374: "MAIL.DELETE.MAILER",
        375: "MAIL.REPLY",
        376: "MAIL.REPLY.ALL",
        377: "MAIL.FORWARD",
        378: "MAIL.NEXT.LETTER",
        379: "DATA.LABEL",
        380: "INSERT.TITLE",
        381: "FONT.PROPERTIES",
        382: "MACRO.OPTIONS",
        383: "WORKBOOK.HIDE",
        384: "WORKBOOK.UNHIDE",
        385: "WORKBOOK.DELETE",
        386: "WORKBOOK.NAME",
        388: "GALLERY.CUSTOM",
        390: "ADD.CHART.AUTOFORMAT",
        391: "DELETE.CHART.AUTOFORMAT",
        392: "CHART.ADD.DATA",
        393: "AUTO.OUTLINE",
        394: "TAB.ORDER",
        395: "SHOW.DIALOG",
        396: "SELECT.ALL",
        397: "UNGROUP.SHEETS",
        398: "SUBTOTAL.CREATE",
        399: "SUBTOTAL.REMOVE",
        400: "RENAME.OBJECT",
        412: "WORKBOOK.SCROLL",
        413: "WORKBOOK.NEXT",
        414: "WORKBOOK.PREV",
        415: "WORKBOOK.TAB.SPLIT",
        416: "FULL.SCREEN",
        417: "WORKBOOK.PROTECT",
        420: "SCROLLBAR.PROPERTIES",
        421: "PIVOT.SHOW.PAGES",
        422: "TEXT.TO.COLUMNS",
        423: "FORMAT.CHARTTYPE",
        424: "LINK.FORMAT",
        425: "TRACER.DISPLAY",
        430: "TRACER.NAVIGATE",
        431: "TRACER.CLEAR",
        432: "TRACER.ERROR",
        433: "PIVOT.FIELD.GROUP",
        434: "PIVOT.FIELD.UNGROUP",
        435: "CHECKBOX.PROPERTIES",
        436: "LABEL.PROPERTIES",
        437: "LISTBOX.PROPERTIES",
        438: "EDITBOX.PROPERTIES",
        439: "PIVOT.REFRESH",
        440: "LINK.COMBO",
        441: "OPEN.TEXT",
        442: "HIDE.DIALOG",
        443: "SET.DIALOG.FOCUS",
        444: "ENABLE.OBJECT",
        445: "PUSHBUTTON.PROPERTIES",
        446: "SET.DIALOG.DEFAULT",
        447: "FILTER",
        448: "FILTER.SHOW.ALL",
        449: "CLEAR.OUTLINE",
        450: "FUNCTION.WIZARD",
        451: "ADD.LIST.ITEM",
        452: "SET.LIST.ITEM",
        453: "REMOVE.LIST.ITEM",
        454: "SELECT.LIST.ITEM",
        455: "SET.CONTROL.VALUE",
        456: "SAVE.COPY.AS",
        458: "OPTIONS.LISTS.ADD",
        459: "OPTIONS.LISTS.DELETE",
        460: "SERIES.AXES",
        461: "SERIES.X",
        462: "SERIES.Y",
        463: "ERRORBAR.X",
        464: "ERRORBAR.Y",
        465: "FORMAT.CHART",
        466: "SERIES.ORDER",
        467: "MAIL.LOGOFF",
        468: "CLEAR.ROUTING.SLIP",
        469: "APP.ACTIVATE.MICROSOFT",
        470: "MAIL.EDIT.MAILER",
        471: "ON.SHEET",
        472: "STANDARD.WIDTH",
        473: "SCENARIO.MERGE",
        474: "SUMMARY.INFO",
        475: "FIND.FILE",
        476: "ACTIVE.CELL.FONT",
        477: "ENABLE.TIPWIZARD",
        478: "VBA.MAKE.ADDIN",
        480: "INSERTDATATABLE",
        481: "WORKGROUP.OPTIONS",
        482: "MAIL.SEND.MAILER",
        485: "AUTOCORRECT",
        489: "POST.DOCUMENT",
        491: "PICKLIST",
        493: "VIEW.SHOW",
        494: "VIEW.DEFINE",
        495: "VIEW.DELETE",
        509: "SHEET.BACKGROUND",
        510: "INSERT.MAP.OBJECT",
        511: "OPTIONS.MENONO",
        517: "MSOCHECKS",
        518: "NORMAL",
        519: "LAYOUT",
        520: "RM.PRINT.AREA",
        521: "CLEAR.PRINT.AREA",
        522: "ADD.PRINT.AREA",
        523: "MOVE.BRK",
        545: "HIDECURR.NOTE",
        546: "HIDEALL.NOTES",
        547: "DELETE.NOTE",
        548: "TRAVERSE.NOTES",
        549: "ACTIVATE.NOTES",
        620: "PROTECT.REVISIONS",
        621: "UNPROTECT.REVISIONS",
        647: "OPTIONS.ME",
        653: "WEB.PUBLISH",
        667: "NEWWEBQUERY",
        673: "PIVOT.TABLE.CHART",
        753: "OPTIONS.SAVE",
        755: "OPTIONS.SPELL",
        808: "HIDEALL.INKANNOTS"
    }, $o = {
        0: "COUNT",
        1: "IF",
        2: "ISNA",
        3: "ISERROR",
        4: "SUM",
        5: "AVERAGE",
        6: "MIN",
        7: "MAX",
        8: "ROW",
        9: "COLUMN",
        10: "NA",
        11: "NPV",
        12: "STDEV",
        13: "DOLLAR",
        14: "FIXED",
        15: "SIN",
        16: "COS",
        17: "TAN",
        18: "ATAN",
        19: "PI",
        20: "SQRT",
        21: "EXP",
        22: "LN",
        23: "LOG10",
        24: "ABS",
        25: "INT",
        26: "SIGN",
        27: "ROUND",
        28: "LOOKUP",
        29: "INDEX",
        30: "REPT",
        31: "MID",
        32: "LEN",
        33: "VALUE",
        34: "TRUE",
        35: "FALSE",
        36: "AND",
        37: "OR",
        38: "NOT",
        39: "MOD",
        40: "DCOUNT",
        41: "DSUM",
        42: "DAVERAGE",
        43: "DMIN",
        44: "DMAX",
        45: "DSTDEV",
        46: "VAR",
        47: "DVAR",
        48: "TEXT",
        49: "LINEST",
        50: "TREND",
        51: "LOGEST",
        52: "GROWTH",
        53: "GOTO",
        54: "HALT",
        55: "RETURN",
        56: "PV",
        57: "FV",
        58: "NPER",
        59: "PMT",
        60: "RATE",
        61: "MIRR",
        62: "IRR",
        63: "RAND",
        64: "MATCH",
        65: "DATE",
        66: "TIME",
        67: "DAY",
        68: "MONTH",
        69: "YEAR",
        70: "WEEKDAY",
        71: "HOUR",
        72: "MINUTE",
        73: "SECOND",
        74: "NOW",
        75: "AREAS",
        76: "ROWS",
        77: "COLUMNS",
        78: "OFFSET",
        79: "ABSREF",
        80: "RELREF",
        81: "ARGUMENT",
        82: "SEARCH",
        83: "TRANSPOSE",
        84: "ERROR",
        85: "STEP",
        86: "TYPE",
        87: "ECHO",
        88: "SET.NAME",
        89: "CALLER",
        90: "DEREF",
        91: "WINDOWS",
        92: "SERIES",
        93: "DOCUMENTS",
        94: "ACTIVE.CELL",
        95: "SELECTION",
        96: "RESULT",
        97: "ATAN2",
        98: "ASIN",
        99: "ACOS",
        100: "CHOOSE",
        101: "HLOOKUP",
        102: "VLOOKUP",
        103: "LINKS",
        104: "INPUT",
        105: "ISREF",
        106: "GET.FORMULA",
        107: "GET.NAME",
        108: "SET.VALUE",
        109: "LOG",
        110: "EXEC",
        111: "CHAR",
        112: "LOWER",
        113: "UPPER",
        114: "PROPER",
        115: "LEFT",
        116: "RIGHT",
        117: "EXACT",
        118: "TRIM",
        119: "REPLACE",
        120: "SUBSTITUTE",
        121: "CODE",
        122: "NAMES",
        123: "DIRECTORY",
        124: "FIND",
        125: "CELL",
        126: "ISERR",
        127: "ISTEXT",
        128: "ISNUMBER",
        129: "ISBLANK",
        130: "T",
        131: "N",
        132: "FOPEN",
        133: "FCLOSE",
        134: "FSIZE",
        135: "FREADLN",
        136: "FREAD",
        137: "FWRITELN",
        138: "FWRITE",
        139: "FPOS",
        140: "DATEVALUE",
        141: "TIMEVALUE",
        142: "SLN",
        143: "SYD",
        144: "DDB",
        145: "GET.DEF",
        146: "REFTEXT",
        147: "TEXTREF",
        148: "INDIRECT",
        149: "REGISTER",
        150: "CALL",
        151: "ADD.BAR",
        152: "ADD.MENU",
        153: "ADD.COMMAND",
        154: "ENABLE.COMMAND",
        155: "CHECK.COMMAND",
        156: "RENAME.COMMAND",
        157: "SHOW.BAR",
        158: "DELETE.MENU",
        159: "DELETE.COMMAND",
        160: "GET.CHART.ITEM",
        161: "DIALOG.BOX",
        162: "CLEAN",
        163: "MDETERM",
        164: "MINVERSE",
        165: "MMULT",
        166: "FILES",
        167: "IPMT",
        168: "PPMT",
        169: "COUNTA",
        170: "CANCEL.KEY",
        171: "FOR",
        172: "WHILE",
        173: "BREAK",
        174: "NEXT",
        175: "INITIATE",
        176: "REQUEST",
        177: "POKE",
        178: "EXECUTE",
        179: "TERMINATE",
        180: "RESTART",
        181: "HELP",
        182: "GET.BAR",
        183: "PRODUCT",
        184: "FACT",
        185: "GET.CELL",
        186: "GET.WORKSPACE",
        187: "GET.WINDOW",
        188: "GET.DOCUMENT",
        189: "DPRODUCT",
        190: "ISNONTEXT",
        191: "GET.NOTE",
        192: "NOTE",
        193: "STDEVP",
        194: "VARP",
        195: "DSTDEVP",
        196: "DVARP",
        197: "TRUNC",
        198: "ISLOGICAL",
        199: "DCOUNTA",
        200: "DELETE.BAR",
        201: "UNREGISTER",
        204: "USDOLLAR",
        205: "FINDB",
        206: "SEARCHB",
        207: "REPLACEB",
        208: "LEFTB",
        209: "RIGHTB",
        210: "MIDB",
        211: "LENB",
        212: "ROUNDUP",
        213: "ROUNDDOWN",
        214: "ASC",
        215: "DBCS",
        216: "RANK",
        219: "ADDRESS",
        220: "DAYS360",
        221: "TODAY",
        222: "VDB",
        223: "ELSE",
        224: "ELSE.IF",
        225: "END.IF",
        226: "FOR.CELL",
        227: "MEDIAN",
        228: "SUMPRODUCT",
        229: "SINH",
        230: "COSH",
        231: "TANH",
        232: "ASINH",
        233: "ACOSH",
        234: "ATANH",
        235: "DGET",
        236: "CREATE.OBJECT",
        237: "VOLATILE",
        238: "LAST.ERROR",
        239: "CUSTOM.UNDO",
        240: "CUSTOM.REPEAT",
        241: "FORMULA.CONVERT",
        242: "GET.LINK.INFO",
        243: "TEXT.BOX",
        244: "INFO",
        245: "GROUP",
        246: "GET.OBJECT",
        247: "DB",
        248: "PAUSE",
        251: "RESUME",
        252: "FREQUENCY",
        253: "ADD.TOOLBAR",
        254: "DELETE.TOOLBAR",
        255: "User",
        256: "RESET.TOOLBAR",
        257: "EVALUATE",
        258: "GET.TOOLBAR",
        259: "GET.TOOL",
        260: "SPELLING.CHECK",
        261: "ERROR.TYPE",
        262: "APP.TITLE",
        263: "WINDOW.TITLE",
        264: "SAVE.TOOLBAR",
        265: "ENABLE.TOOL",
        266: "PRESS.TOOL",
        267: "REGISTER.ID",
        268: "GET.WORKBOOK",
        269: "AVEDEV",
        270: "BETADIST",
        271: "GAMMALN",
        272: "BETAINV",
        273: "BINOMDIST",
        274: "CHIDIST",
        275: "CHIINV",
        276: "COMBIN",
        277: "CONFIDENCE",
        278: "CRITBINOM",
        279: "EVEN",
        280: "EXPONDIST",
        281: "FDIST",
        282: "FINV",
        283: "FISHER",
        284: "FISHERINV",
        285: "FLOOR",
        286: "GAMMADIST",
        287: "GAMMAINV",
        288: "CEILING",
        289: "HYPGEOMDIST",
        290: "LOGNORMDIST",
        291: "LOGINV",
        292: "NEGBINOMDIST",
        293: "NORMDIST",
        294: "NORMSDIST",
        295: "NORMINV",
        296: "NORMSINV",
        297: "STANDARDIZE",
        298: "ODD",
        299: "PERMUT",
        300: "POISSON",
        301: "TDIST",
        302: "WEIBULL",
        303: "SUMXMY2",
        304: "SUMX2MY2",
        305: "SUMX2PY2",
        306: "CHITEST",
        307: "CORREL",
        308: "COVAR",
        309: "FORECAST",
        310: "FTEST",
        311: "INTERCEPT",
        312: "PEARSON",
        313: "RSQ",
        314: "STEYX",
        315: "SLOPE",
        316: "TTEST",
        317: "PROB",
        318: "DEVSQ",
        319: "GEOMEAN",
        320: "HARMEAN",
        321: "SUMSQ",
        322: "KURT",
        323: "SKEW",
        324: "ZTEST",
        325: "LARGE",
        326: "SMALL",
        327: "QUARTILE",
        328: "PERCENTILE",
        329: "PERCENTRANK",
        330: "MODE",
        331: "TRIMMEAN",
        332: "TINV",
        334: "MOVIE.COMMAND",
        335: "GET.MOVIE",
        336: "CONCATENATE",
        337: "POWER",
        338: "PIVOT.ADD.DATA",
        339: "GET.PIVOT.TABLE",
        340: "GET.PIVOT.FIELD",
        341: "GET.PIVOT.ITEM",
        342: "RADIANS",
        343: "DEGREES",
        344: "SUBTOTAL",
        345: "SUMIF",
        346: "COUNTIF",
        347: "COUNTBLANK",
        348: "SCENARIO.GET",
        349: "OPTIONS.LISTS.GET",
        350: "ISPMT",
        351: "DATEDIF",
        352: "DATESTRING",
        353: "NUMBERSTRING",
        354: "ROMAN",
        355: "OPEN.DIALOG",
        356: "SAVE.DIALOG",
        357: "VIEW.GET",
        358: "GETPIVOTDATA",
        359: "HYPERLINK",
        360: "PHONETIC",
        361: "AVERAGEA",
        362: "MAXA",
        363: "MINA",
        364: "STDEVPA",
        365: "VARPA",
        366: "STDEVA",
        367: "VARA",
        368: "BAHTTEXT",
        369: "THAIDAYOFWEEK",
        370: "THAIDIGIT",
        371: "THAIMONTHOFYEAR",
        372: "THAINUMSOUND",
        373: "THAINUMSTRING",
        374: "THAISTRINGLENGTH",
        375: "ISTHAIDIGIT",
        376: "ROUNDBAHTDOWN",
        377: "ROUNDBAHTUP",
        378: "THAIYEAR",
        379: "RTD",
        380: "CUBEVALUE",
        381: "CUBEMEMBER",
        382: "CUBEMEMBERPROPERTY",
        383: "CUBERANKEDMEMBER",
        384: "HEX2BIN",
        385: "HEX2DEC",
        386: "HEX2OCT",
        387: "DEC2BIN",
        388: "DEC2HEX",
        389: "DEC2OCT",
        390: "OCT2BIN",
        391: "OCT2HEX",
        392: "OCT2DEC",
        393: "BIN2DEC",
        394: "BIN2OCT",
        395: "BIN2HEX",
        396: "IMSUB",
        397: "IMDIV",
        398: "IMPOWER",
        399: "IMABS",
        400: "IMSQRT",
        401: "IMLN",
        402: "IMLOG2",
        403: "IMLOG10",
        404: "IMSIN",
        405: "IMCOS",
        406: "IMEXP",
        407: "IMARGUMENT",
        408: "IMCONJUGATE",
        409: "IMAGINARY",
        410: "IMREAL",
        411: "COMPLEX",
        412: "IMSUM",
        413: "IMPRODUCT",
        414: "SERIESSUM",
        415: "FACTDOUBLE",
        416: "SQRTPI",
        417: "QUOTIENT",
        418: "DELTA",
        419: "GESTEP",
        420: "ISEVEN",
        421: "ISODD",
        422: "MROUND",
        423: "ERF",
        424: "ERFC",
        425: "BESSELJ",
        426: "BESSELK",
        427: "BESSELY",
        428: "BESSELI",
        429: "XIRR",
        430: "XNPV",
        431: "PRICEMAT",
        432: "YIELDMAT",
        433: "INTRATE",
        434: "RECEIVED",
        435: "DISC",
        436: "PRICEDISC",
        437: "YIELDDISC",
        438: "TBILLEQ",
        439: "TBILLPRICE",
        440: "TBILLYIELD",
        441: "PRICE",
        442: "YIELD",
        443: "DOLLARDE",
        444: "DOLLARFR",
        445: "NOMINAL",
        446: "EFFECT",
        447: "CUMPRINC",
        448: "CUMIPMT",
        449: "EDATE",
        450: "EOMONTH",
        451: "YEARFRAC",
        452: "COUPDAYBS",
        453: "COUPDAYS",
        454: "COUPDAYSNC",
        455: "COUPNCD",
        456: "COUPNUM",
        457: "COUPPCD",
        458: "DURATION",
        459: "MDURATION",
        460: "ODDLPRICE",
        461: "ODDLYIELD",
        462: "ODDFPRICE",
        463: "ODDFYIELD",
        464: "RANDBETWEEN",
        465: "WEEKNUM",
        466: "AMORDEGRC",
        467: "AMORLINC",
        468: "CONVERT",
        724: "SHEETJS",
        469: "ACCRINT",
        470: "ACCRINTM",
        471: "WORKDAY",
        472: "NETWORKDAYS",
        473: "GCD",
        474: "MULTINOMIAL",
        475: "LCM",
        476: "FVSCHEDULE",
        477: "CUBEKPIMEMBER",
        478: "CUBESET",
        479: "CUBESETCOUNT",
        480: "IFERROR",
        481: "COUNTIFS",
        482: "SUMIFS",
        483: "AVERAGEIF",
        484: "AVERAGEIFS"
    }, Yo = {
        2: 1,
        3: 1,
        10: 0,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 0,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 2,
        30: 2,
        31: 3,
        32: 1,
        33: 1,
        34: 0,
        35: 0,
        38: 1,
        39: 2,
        40: 3,
        41: 3,
        42: 3,
        43: 3,
        44: 3,
        45: 3,
        47: 3,
        48: 2,
        53: 1,
        61: 3,
        63: 0,
        65: 3,
        66: 3,
        67: 1,
        68: 1,
        69: 1,
        70: 1,
        71: 1,
        72: 1,
        73: 1,
        74: 0,
        75: 1,
        76: 1,
        77: 1,
        79: 2,
        80: 2,
        83: 1,
        85: 0,
        86: 1,
        89: 0,
        90: 1,
        94: 0,
        95: 0,
        97: 2,
        98: 1,
        99: 1,
        101: 3,
        102: 3,
        105: 1,
        106: 1,
        108: 2,
        111: 1,
        112: 1,
        113: 1,
        114: 1,
        117: 2,
        118: 1,
        119: 4,
        121: 1,
        126: 1,
        127: 1,
        128: 1,
        129: 1,
        130: 1,
        131: 1,
        133: 1,
        134: 1,
        135: 1,
        136: 2,
        137: 2,
        138: 2,
        140: 1,
        141: 1,
        142: 3,
        143: 4,
        144: 4,
        161: 1,
        162: 1,
        163: 1,
        164: 1,
        165: 2,
        172: 1,
        175: 2,
        176: 2,
        177: 3,
        178: 2,
        179: 1,
        184: 1,
        186: 1,
        189: 3,
        190: 1,
        195: 3,
        196: 3,
        197: 1,
        198: 1,
        199: 3,
        201: 1,
        207: 4,
        210: 3,
        211: 1,
        212: 2,
        213: 2,
        214: 1,
        215: 1,
        225: 0,
        229: 1,
        230: 1,
        231: 1,
        232: 1,
        233: 1,
        234: 1,
        235: 3,
        244: 1,
        247: 4,
        252: 2,
        257: 1,
        261: 1,
        271: 1,
        273: 4,
        274: 2,
        275: 2,
        276: 2,
        277: 3,
        278: 3,
        279: 1,
        280: 3,
        281: 3,
        282: 3,
        283: 1,
        284: 1,
        285: 2,
        286: 4,
        287: 3,
        288: 2,
        289: 4,
        290: 3,
        291: 3,
        292: 3,
        293: 4,
        294: 1,
        295: 3,
        296: 1,
        297: 3,
        298: 1,
        299: 2,
        300: 3,
        301: 3,
        302: 4,
        303: 2,
        304: 2,
        305: 2,
        306: 2,
        307: 2,
        308: 2,
        309: 3,
        310: 2,
        311: 2,
        312: 2,
        313: 2,
        314: 2,
        315: 2,
        316: 4,
        325: 2,
        326: 2,
        327: 2,
        328: 2,
        331: 2,
        332: 2,
        337: 2,
        342: 1,
        343: 1,
        346: 2,
        347: 1,
        350: 4,
        351: 3,
        352: 1,
        353: 2,
        360: 1,
        368: 1,
        369: 1,
        370: 1,
        371: 1,
        372: 1,
        373: 1,
        374: 1,
        375: 1,
        376: 1,
        377: 1,
        378: 1,
        382: 3,
        385: 1,
        392: 1,
        393: 1,
        396: 2,
        397: 2,
        398: 2,
        399: 1,
        400: 1,
        401: 1,
        402: 1,
        403: 1,
        404: 1,
        405: 1,
        406: 1,
        407: 1,
        408: 1,
        409: 1,
        410: 1,
        414: 4,
        415: 1,
        416: 1,
        417: 2,
        420: 1,
        421: 1,
        422: 2,
        424: 1,
        425: 2,
        426: 2,
        427: 2,
        428: 2,
        430: 3,
        438: 3,
        439: 3,
        440: 3,
        443: 2,
        444: 2,
        445: 2,
        446: 2,
        447: 6,
        448: 6,
        449: 2,
        450: 2,
        464: 2,
        468: 3,
        476: 2,
        479: 1,
        480: 2,
        65535: 0
    }, Ko = {
        "_xlfn.ACOT": "ACOT",
        "_xlfn.ACOTH": "ACOTH",
        "_xlfn.AGGREGATE": "AGGREGATE",
        "_xlfn.ARABIC": "ARABIC",
        "_xlfn.AVERAGEIF": "AVERAGEIF",
        "_xlfn.AVERAGEIFS": "AVERAGEIFS",
        "_xlfn.BASE": "BASE",
        "_xlfn.BETA.DIST": "BETA.DIST",
        "_xlfn.BETA.INV": "BETA.INV",
        "_xlfn.BINOM.DIST": "BINOM.DIST",
        "_xlfn.BINOM.DIST.RANGE": "BINOM.DIST.RANGE",
        "_xlfn.BINOM.INV": "BINOM.INV",
        "_xlfn.BITAND": "BITAND",
        "_xlfn.BITLSHIFT": "BITLSHIFT",
        "_xlfn.BITOR": "BITOR",
        "_xlfn.BITRSHIFT": "BITRSHIFT",
        "_xlfn.BITXOR": "BITXOR",
        "_xlfn.CEILING.MATH": "CEILING.MATH",
        "_xlfn.CEILING.PRECISE": "CEILING.PRECISE",
        "_xlfn.CHISQ.DIST": "CHISQ.DIST",
        "_xlfn.CHISQ.DIST.RT": "CHISQ.DIST.RT",
        "_xlfn.CHISQ.INV": "CHISQ.INV",
        "_xlfn.CHISQ.INV.RT": "CHISQ.INV.RT",
        "_xlfn.CHISQ.TEST": "CHISQ.TEST",
        "_xlfn.COMBINA": "COMBINA",
        "_xlfn.CONCAT": "CONCAT",
        "_xlfn.CONFIDENCE.NORM": "CONFIDENCE.NORM",
        "_xlfn.CONFIDENCE.T": "CONFIDENCE.T",
        "_xlfn.COT": "COT",
        "_xlfn.COTH": "COTH",
        "_xlfn.COUNTIFS": "COUNTIFS",
        "_xlfn.COVARIANCE.P": "COVARIANCE.P",
        "_xlfn.COVARIANCE.S": "COVARIANCE.S",
        "_xlfn.CSC": "CSC",
        "_xlfn.CSCH": "CSCH",
        "_xlfn.DAYS": "DAYS",
        "_xlfn.DECIMAL": "DECIMAL",
        "_xlfn.ECMA.CEILING": "ECMA.CEILING",
        "_xlfn.ERF.PRECISE": "ERF.PRECISE",
        "_xlfn.ERFC.PRECISE": "ERFC.PRECISE",
        "_xlfn.EXPON.DIST": "EXPON.DIST",
        "_xlfn.F.DIST": "F.DIST",
        "_xlfn.F.DIST.RT": "F.DIST.RT",
        "_xlfn.F.INV": "F.INV",
        "_xlfn.F.INV.RT": "F.INV.RT",
        "_xlfn.F.TEST": "F.TEST",
        "_xlfn.FILTERXML": "FILTERXML",
        "_xlfn.FLOOR.MATH": "FLOOR.MATH",
        "_xlfn.FLOOR.PRECISE": "FLOOR.PRECISE",
        "_xlfn.FORECAST.ETS": "FORECAST.ETS",
        "_xlfn.FORECAST.ETS.CONFINT": "FORECAST.ETS.CONFINT",
        "_xlfn.FORECAST.ETS.SEASONALITY": "FORECAST.ETS.SEASONALITY",
        "_xlfn.FORECAST.ETS.STAT": "FORECAST.ETS.STAT",
        "_xlfn.FORECAST.LINEAR": "FORECAST.LINEAR",
        "_xlfn.FORMULATEXT": "FORMULATEXT",
        "_xlfn.GAMMA": "GAMMA",
        "_xlfn.GAMMA.DIST": "GAMMA.DIST",
        "_xlfn.GAMMA.INV": "GAMMA.INV",
        "_xlfn.GAMMALN.PRECISE": "GAMMALN.PRECISE",
        "_xlfn.GAUSS": "GAUSS",
        "_xlfn.HYPGEOM.DIST": "HYPGEOM.DIST",
        "_xlfn.IFERROR": "IFERROR",
        "_xlfn.IFNA": "IFNA",
        "_xlfn.IFS": "IFS",
        "_xlfn.IMCOSH": "IMCOSH",
        "_xlfn.IMCOT": "IMCOT",
        "_xlfn.IMCSC": "IMCSC",
        "_xlfn.IMCSCH": "IMCSCH",
        "_xlfn.IMSEC": "IMSEC",
        "_xlfn.IMSECH": "IMSECH",
        "_xlfn.IMSINH": "IMSINH",
        "_xlfn.IMTAN": "IMTAN",
        "_xlfn.ISFORMULA": "ISFORMULA",
        "_xlfn.ISO.CEILING": "ISO.CEILING",
        "_xlfn.ISOWEEKNUM": "ISOWEEKNUM",
        "_xlfn.LOGNORM.DIST": "LOGNORM.DIST",
        "_xlfn.LOGNORM.INV": "LOGNORM.INV",
        "_xlfn.MAXIFS": "MAXIFS",
        "_xlfn.MINIFS": "MINIFS",
        "_xlfn.MODE.MULT": "MODE.MULT",
        "_xlfn.MODE.SNGL": "MODE.SNGL",
        "_xlfn.MUNIT": "MUNIT",
        "_xlfn.NEGBINOM.DIST": "NEGBINOM.DIST",
        "_xlfn.NETWORKDAYS.INTL": "NETWORKDAYS.INTL",
        "_xlfn.NIGBINOM": "NIGBINOM",
        "_xlfn.NORM.DIST": "NORM.DIST",
        "_xlfn.NORM.INV": "NORM.INV",
        "_xlfn.NORM.S.DIST": "NORM.S.DIST",
        "_xlfn.NORM.S.INV": "NORM.S.INV",
        "_xlfn.NUMBERVALUE": "NUMBERVALUE",
        "_xlfn.PDURATION": "PDURATION",
        "_xlfn.PERCENTILE.EXC": "PERCENTILE.EXC",
        "_xlfn.PERCENTILE.INC": "PERCENTILE.INC",
        "_xlfn.PERCENTRANK.EXC": "PERCENTRANK.EXC",
        "_xlfn.PERCENTRANK.INC": "PERCENTRANK.INC",
        "_xlfn.PERMUTATIONA": "PERMUTATIONA",
        "_xlfn.PHI": "PHI",
        "_xlfn.POISSON.DIST": "POISSON.DIST",
        "_xlfn.QUARTILE.EXC": "QUARTILE.EXC",
        "_xlfn.QUARTILE.INC": "QUARTILE.INC",
        "_xlfn.QUERYSTRING": "QUERYSTRING",
        "_xlfn.RANK.AVG": "RANK.AVG",
        "_xlfn.RANK.EQ": "RANK.EQ",
        "_xlfn.RRI": "RRI",
        "_xlfn.SEC": "SEC",
        "_xlfn.SECH": "SECH",
        "_xlfn.SHEET": "SHEET",
        "_xlfn.SHEETS": "SHEETS",
        "_xlfn.SKEW.P": "SKEW.P",
        "_xlfn.STDEV.P": "STDEV.P",
        "_xlfn.STDEV.S": "STDEV.S",
        "_xlfn.SUMIFS": "SUMIFS",
        "_xlfn.SWITCH": "SWITCH",
        "_xlfn.T.DIST": "T.DIST",
        "_xlfn.T.DIST.2T": "T.DIST.2T",
        "_xlfn.T.DIST.RT": "T.DIST.RT",
        "_xlfn.T.INV": "T.INV",
        "_xlfn.T.INV.2T": "T.INV.2T",
        "_xlfn.T.TEST": "T.TEST",
        "_xlfn.TEXTJOIN": "TEXTJOIN",
        "_xlfn.UNICHAR": "UNICHAR",
        "_xlfn.UNICODE": "UNICODE",
        "_xlfn.VAR.P": "VAR.P",
        "_xlfn.VAR.S": "VAR.S",
        "_xlfn.WEBSERVICE": "WEBSERVICE",
        "_xlfn.WEIBULL.DIST": "WEIBULL.DIST",
        "_xlfn.WORKDAY.INTL": "WORKDAY.INTL",
        "_xlfn.XOR": "XOR",
        "_xlfn.Z.TEST": "Z.TEST"
    };

    function Zo(e) {
        return "of:" == e.slice(0, 3) && (e = e.slice(3)), 61 == e.charCodeAt(0) && 61 == (e = e.slice(1)).charCodeAt(0) && (e = e.slice(1)), (e = (e = (e = e.replace(/COM\.MICROSOFT\./g, "")).replace(/\[((?:\.[A-Z]+[0-9]+)(?::\.[A-Z]+[0-9]+)?)\]/g, function (e, t) {
            return t.replace(/\./g, "")
        })).replace(/\[.(#[A-Z]*[?!])\]/g, "$1")).replace(/[;~]/g, ",").replace(/\|/g, ";")
    }

    function Qo(e) {
        var t = e.split(":");
        return [t[0].split(".")[0], t[0].split(".")[1] + (1 < t.length ? ":" + (t[1].split(".")[1] || t[1].split(".")[0]) : "")]
    }

    var Jo = {}, qo = {};
    Zr.WS = ["http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet", "http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet"];
    var el = "undefined" != typeof Map;

    function tl(e, t, r) {
        var n = 0, a = e.length;
        if (r) {
            if (el ? r.has(t) : r.hasOwnProperty(t)) for (var s = el ? r.get(t) : r[t]; n < s.length; ++n) if (e[s[n]].t === t) return e.Count++, s[n]
        } else for (; n < a; ++n) if (e[n].t === t) return e.Count++, n;
        return e[a] = {t: t}, e.Count++, e.Unique++, r && (el ? (r.has(t) || r.set(t, []), r.get(t).push(a)) : (r.hasOwnProperty(t) || (r[t] = []), r[t].push(a))), a
    }

    function rl(e, t) {
        var r = {min: e + 1, max: e + 1}, n = -1;
        return t.MDW && (ei = t.MDW), null != t.width ? r.customWidth = 1 : null != t.wpx ? n = ri(t.wpx) : null != t.wch && (n = t.wch), -1 < n ? (r.width = ni(n), r.customWidth = 1) : null != t.width && (r.width = t.width), t.hidden && (r.hidden = !0), r
    }

    function nl(e, t) {
        if (e) {
            var r = [.7, .7, .75, .75, .3, .3];
            "xlml" == t && (r = [1, 1, 1, 1, .5, .5]), null == e.left && (e.left = r[0]), null == e.right && (e.right = r[1]), null == e.top && (e.top = r[2]), null == e.bottom && (e.bottom = r[3]), null == e.header && (e.header = r[4]), null == e.footer && (e.footer = r[5])
        }
    }

    function al(e, t, r) {
        if ("undefined" != typeof style_builder) {
            if (/^\d+$/.exec(t.s)) return t.s;
            if (t.s && t.s == +t.s) return t.s;
            var n = t.s || {};
            return t.z && (n.numFmt = t.z), style_builder.addStyle(n)
        }
        var a = r.revssf[null != t.z ? t.z : "General"], s = 60, i = e.length;
        if (null == a && r.ssf) for (; s < 392; ++s) if (null == r.ssf[s]) {
            de.load(t.z, s), r.ssf[s] = t.z, r.revssf[t.z] = a = s;
            break
        }
        for (s = 0; s != i; ++s) if (e[s].numFmtId === a) return s;
        return e[i] = {numFmtId: a, fontId: 0, fillId: 0, borderId: 0, xfId: 0, applyNumberFormat: 1}, i
    }

    function sl(e, t, r, n, a, s) {
        if ("z" !== e.t) {
            "d" === e.t && "string" == typeof e.v && (e.v = Q(e.v));
            try {
                n.cellNF && (e.z = de._table[t])
            } catch (e) {
                if (n.WTF) throw e
            }
            if (!n || !1 !== n.cellText) try {
                if (null == de._table[t] && de.load(o[t] || "General", t), "e" === e.t) e.w = e.w || Br[e.v]; else if (0 === t) if ("n" === e.t) (0 | e.v) === e.v ? e.w = de._general_int(e.v) : e.w = de._general_num(e.v); else if ("d" === e.t) {
                    var i = K(e.v);
                    e.w = (0 | i) === i ? de._general_int(i) : de._general_num(i)
                } else {
                    if (void 0 === e.v) return;
                    e.w = de._general(e.v, qo)
                } else "d" === e.t ? e.w = de.format(t, K(e.v), qo) : e.w = de.format(t, e.v, qo)
            } catch (e) {
                if (n.WTF) throw e
            }
            if (n.cellStyles && null != r) try {
                e.s = s.Fills[r], e.s.fgColor && e.s.fgColor.theme && !e.s.fgColor.rgb && (e.s.fgColor.rgb = Zs(a.themeElements.clrScheme[e.s.fgColor.theme].rgb, e.s.fgColor.tint || 0), n.WTF && (e.s.fgColor.raw_rgb = a.themeElements.clrScheme[e.s.fgColor.theme].rgb)), e.s.bgColor && e.s.bgColor.theme && (e.s.bgColor.rgb = Zs(a.themeElements.clrScheme[e.s.bgColor.theme].rgb, e.s.bgColor.tint || 0), n.WTF && (e.s.bgColor.raw_rgb = a.themeElements.clrScheme[e.s.bgColor.theme].rgb))
            } catch (e) {
                if (n.WTF && s.Fills) throw e
            }
        }
    }

    function il(e, t, r) {
        if (e && e["!ref"]) {
            var n = Jt(e["!ref"]);
            if (n.e.c < n.s.c || n.e.r < n.s.r) throw new Error("Bad range (" + r + "): " + e["!ref"])
        }
    }

    var ol = /<(?:\w:)?mergeCell ref="[A-Z0-9:]+"\s*[\/]?>/g,
        ll = /<(?:\w+:)?sheetData>([\s\S]*)<\/(?:\w+:)?sheetData>/, cl = /<(?:\w:)?hyperlink [^>]*>/gm,
        fl = /"(\w*:\w*)"/, hl = /<(?:\w:)?col\b[^>]*[\/]?>/g,
        ul = /<(?:\w:)?autoFilter[^>]*([\/]|>([\s\S]*)<\/(?:\w:)?autoFilter)>/g, dl = /<(?:\w:)?pageMargins[^>]*\/>/g,
        pl = /<(?:\w:)?sheetPr\b(?:[^>a-z][^>]*)?\/>/,
        ml = /<(?:\w:)?sheetViews[^>]*(?:[\/]|>([\s\S]*)<\/(?:\w:)?sheetViews)>/;

    function gl(e, t, r, n, a, s, i) {
        if (!e) return e;
        null != ue && null == t.dense && (t.dense = ue);
        var o = t.dense ? [] : {}, l = {s: {r: 2e6, c: 2e6}, e: {r: 0, c: 0}}, c = "", f = "", h = e.match(ll);
        h ? (c = e.slice(0, h.index), f = e.slice(h.index + h[0].length)) : c = f = e;
        var u = c.match(pl);
        u && bl(u[0], 0, a, r);
        var d, p, m, g = (c.match(/<(?:\w*:)?dimension/) || {index: -1}).index;
        if (0 < g) {
            var b = c.slice(g, g + 50).match(fl);
            b && (d = o, p = b[1], (m = Jt(p)).s.r <= m.e.r && m.s.c <= m.e.c && 0 <= m.s.r && 0 <= m.s.c && (d["!ref"] = Qt(m)))
        }
        var v, E, w = c.match(ml);
        w && w[1] && (v = w[1], E = a, (v.match(vl) || []).forEach(function (e) {
            Oe(ve(e).rightToLeft) && (E.Views || (E.Views = [{}]), E.Views[0] || (E.Views[0] = {}), E.Views[0].RTL = !0)
        }));
        var S = [];
        if (t.cellStyles) {
            var _ = c.match(hl);
            _ && function (e, t) {
                for (var r = !1, n = 0; n != t.length; ++n) {
                    var a = ve(t[n], !0);
                    a.hidden && (a.hidden = Oe(a.hidden));
                    var s = parseInt(a.min, 10) - 1, i = parseInt(a.max, 10) - 1;
                    for (delete a.min, delete a.max, a.width = +a.width, !r && a.width && (r = !0, si(a.width)), ii(a); s <= i;) e[s++] = be(a)
                }
            }(S, _)
        }
        h && kl(h[1], o, t, l, s, i);
        var y = f.match(ul);
        y && (o["!autofilter"] = {ref: (y[0].match(/ref="([^"]*)"/) || [])[1]});
        var C = [], B = f.match(ol);
        if (B) for (g = 0; g != B.length; ++g) C[g] = Jt(B[g].slice(B[g].indexOf('"') + 1));
        var T = f.match(cl);
        T && function (e, t, r) {
            for (var n = Array.isArray(e), a = 0; a != t.length; ++a) {
                var s = ve(Fe(t[a]), !0);
                if (!s.ref) return;
                var i = ((r || {})["!id"] || [])[s.id];
                i ? (s.Target = i.Target, s.location && (s.Target += "#" + s.location)) : (s.Target = "#" + s.location, i = {
                    Target: s.Target,
                    TargetMode: "Internal"
                }), s.Rel = i, s.tooltip && (s.Tooltip = s.tooltip, delete s.tooltip);
                for (var o = Jt(s.ref), l = o.s.r; l <= o.e.r; ++l) for (var c = o.s.c; c <= o.e.c; ++c) {
                    var f = Kt({c: c, r: l});
                    n ? (e[l] || (e[l] = []), e[l][c] || (e[l][c] = {
                        t: "z",
                        v: void 0
                    }), e[l][c].l = s) : (e[f] || (e[f] = {t: "z", v: void 0}), e[f].l = s)
                }
            }
        }(o, T, n);
        var k, x, A = f.match(dl);
        if (A && (o["!margins"] = (k = ve(A[0]), x = {}, ["left", "right", "top", "bottom", "header", "footer"].forEach(function (e) {
            k[e] && (x[e] = parseFloat(k[e]))
        }), x)), !o["!ref"] && l.e.c >= l.s.c && l.e.r >= l.s.r && (o["!ref"] = Qt(l)), 0 < t.sheetRows && o["!ref"]) {
            var I = Jt(o["!ref"]);
            t.sheetRows <= +I.e.r && (I.e.r = t.sheetRows - 1, I.e.r > l.e.r && (I.e.r = l.e.r), I.e.r < I.s.r && (I.s.r = I.e.r), I.e.c > l.e.c && (I.e.c = l.e.c), I.e.c < I.s.c && (I.s.c = I.e.c), o["!fullref"] = o["!ref"], o["!ref"] = Qt(I))
        }
        return 0 < S.length && (o["!cols"] = S), 0 < C.length && (o["!merges"] = C), o
    }

    function bl(e, t, r, n) {
        var a = ve(e);
        r.Sheets[n] || (r.Sheets[n] = {}), a.codeName && (r.Sheets[n].CodeName = a.codeName)
    }

    var vl = /<(?:\w:)?sheetView(?:[^>a-z][^>]*)?\/>/;

    function El(e, t, r, n) {
        if (void 0 === e.v && void 0 === e.f || "z" === e.t) return "";
        var a = "", s = e.t, i = e.v;
        switch (e.t) {
            case"b":
                a = e.v ? "1" : "0";
                break;
            case"n":
                a = "" + e.v;
                break;
            case"e":
                a = Br[e.v];
                break;
            case"d":
                a = n.cellDates ? Q(e.v, -1).toISOString() : ((e = be(e)).t = "n", "" + (e.v = K(Q(e.v)))), void 0 === e.z && (e.z = de._table[14]);
                break;
            default:
                a = e.v
        }
        var o = Ye("v", Ce(a)), l = {r: t}, c = al(n.cellXfs, e, n);
        switch (0 !== c && (l.s = c), e.t) {
            case"n":
                break;
            case"d":
                l.t = "d";
                break;
            case"b":
                l.t = "b";
                break;
            case"e":
                l.t = "e";
                break;
            default:
                if (null == e.v) {
                    delete e.t;
                    break
                }
                if (n.bookSST) {
                    o = Ye("v", "" + tl(n.Strings, e.v, n.revStrings)), l.t = "s";
                    break
                }
                l.t = "str"
        }
        if (e.t != s && (e.t = s, e.v = i), e.f) {
            var f = e.F && e.F.slice(0, t.length) == t ? {t: "array", ref: e.F} : null;
            o = Ze("f", Ce(e.f), f) + (null != e.v ? o : "")
        }
        return e.l && r["!links"].push([t, e.l]), e.c && r["!comments"].push([t, e.c]), Ze("c", o, l)
    }

    var wl, Sl, _l, yl, Cl, Bl, Tl,
        kl = (wl = /<(?:\w+:)?c[ >]/, Sl = /<\/(?:\w+:)?row>/, _l = /r=["']([^"']*)["']/, yl = /<(?:\w+:)?is>([\S\s]*?)<\/(?:\w+:)?is>/, Cl = /ref=["']([^"']*)["']/, Bl = ze("v"), Tl = ze("f"), function (e, t, r, n, a, s) {
            for (var i, o, l, c, f, h = 0, u = "", d = [], p = [], m = 0, g = 0, b = 0, v = "", E = 0, w = 0, S = 0, _ = 0, y = Array.isArray(s.CellXf), C = [], B = [], T = Array.isArray(t), k = [], x = {}, A = !1, I = e.split(Sl), R = 0, O = I.length; R != O; ++R) {
                var F = (u = I[R].trim()).length;
                if (0 !== F) {
                    for (h = 0; h < F && 62 !== u.charCodeAt(h); ++h) ;
                    if (++h, E = null != (o = ve(u.slice(0, h), !0)).r ? parseInt(o.r, 10) : E + 1, w = -1, !(r.sheetRows && r.sheetRows < E)) for (n.s.r > E - 1 && (n.s.r = E - 1), n.e.r < E - 1 && (n.e.r = E - 1), r && r.cellStyles && (A = !(x = {}), o.ht && (A = !0, x.hpt = parseFloat(o.ht), x.hpx = ci(x.hpt)), "1" == o.hidden && (A = !0, x.hidden = !0), null != o.outlineLevel && (A = !0, x.level = +o.outlineLevel), A && (k[E - 1] = x)), d = u.slice(h).split(wl), h = 0; h != d.length; ++h) if (0 !== (u = d[h].trim()).length) {
                        if (p = u.match(_l), m = h, b = g = 0, u = "<c " + ("<" == u.slice(0, 1) ? ">" : "") + u, null != p && 2 === p.length) {
                            for (m = 0, v = p[1], g = 0; g != v.length && !((b = v.charCodeAt(g) - 64) < 1 || 26 < b); ++g) m = 26 * m + b;
                            w = --m
                        } else ++w;
                        for (g = 0; g != u.length && 62 !== u.charCodeAt(g); ++g) ;
                        if (++g, (o = ve(u.slice(0, g), !0)).r || (o.r = Kt({
                            r: E - 1,
                            c: w
                        })), i = {t: ""}, null != (p = (v = u.slice(g)).match(Bl)) && "" !== p[1] && (i.v = Se(p[1])), r.cellFormula) {
                            null != (p = v.match(Tl)) && "" !== p[1] ? (i.f = so(Se(Fe(p[1]))), -1 < p[0].indexOf('t="array"') ? (i.F = (v.match(Cl) || [])[1], -1 < i.F.indexOf(":") && C.push([Jt(i.F), i.F])) : -1 < p[0].indexOf('t="shared"') && (c = ve(p[0]), B[parseInt(c.si, 10)] = [c, so(Se(Fe(p[1]))), o.r])) : (p = v.match(/<f[^>]*\/>/)) && B[(c = ve(p[0])).si] && (i.f = ao(B[c.si][1], B[c.si][2], o.r));
                            var D = Yt(o.r);
                            for (g = 0; g < C.length; ++g) D.r >= C[g][0].s.r && D.r <= C[g][0].e.r && D.c >= C[g][0].s.c && D.c <= C[g][0].e.c && (i.F = C[g][1])
                        }
                        if (null == o.t && void 0 === i.v) if (i.f || i.F) i.v = 0, i.t = "n"; else {
                            if (!r.sheetStubs) continue;
                            i.t = "z"
                        } else i.t = o.t || "n";
                        switch (n.s.c > w && (n.s.c = w), n.e.c < w && (n.e.c = w), i.t) {
                            case"n":
                                if ("" == i.v || null == i.v) {
                                    if (!r.sheetStubs) continue;
                                    i.t = "z"
                                } else i.v = parseFloat(i.v);
                                break;
                            case"s":
                                if (void 0 === i.v) {
                                    if (!r.sheetStubs) continue;
                                    i.t = "z"
                                } else l = Jo[parseInt(i.v, 10)], i.v = l.t, i.r = l.r, r.cellHTML && (i.h = l.h);
                                break;
                            case"str":
                                i.t = "s", i.v = null != i.v ? Fe(i.v) : "", r.cellHTML && (i.h = ke(i.v));
                                break;
                            case"inlineStr":
                                p = v.match(yl), i.t = "s", null != p && (l = Cs(p[1])) ? i.v = l.t : i.v = "";
                                break;
                            case"b":
                                i.v = Oe(i.v);
                                break;
                            case"d":
                                r.cellDates ? i.v = Q(i.v, 1) : (i.v = K(Q(i.v, 1)), i.t = "n");
                                break;
                            case"e":
                                r && !1 === r.cellText || (i.w = i.v), i.v = Tr[i.v]
                        }
                        if (S = _ = 0, y && void 0 !== o.s && null != (f = s.CellXf[o.s]) && (null != f.numFmtId && (S = f.numFmtId), r.cellStyles && null != f.fillId && (_ = f.fillId)), sl(i, S, _, r, a, s), r.cellDates && y && "n" == i.t && de.is_date(de._table[S]) && (i.t = "d", i.v = N(i.v)), T) {
                            var P = Yt(o.r);
                            t[P.r] || (t[P.r] = []), t[P.r][P.c] = i
                        } else t[o.r] = i
                    }
                }
            }
            0 < k.length && (t["!rows"] = k)
        });
    var xl = Ze("worksheet", null, {xmlns: Je.main[0], "xmlns:r": Je.r});

    function Al(e, t, r, n) {
        var a, s = [z, xl], i = r.SheetNames[e], o = "", l = r.Sheets[i];
        null == l && (l = {});
        var c, f, h, u, d = l["!ref"] || "A1", p = Jt(d);
        if (16383 < p.e.c || 1048575 < p.e.r) {
            if (t.WTF) throw new Error("Range " + d + " exceeds format limit A1:XFD1048576");
            p.e.c = Math.min(p.e.c, 16383), p.e.r = Math.min(p.e.c, 1048575), d = Qt(p)
        }
        if (n = n || {}, l["!comments"] = [], l["!drawing"] = [], "xlsx" !== t.bookType && r.vbaraw) {
            var m = r.SheetNames[e];
            try {
                r.Workbook && (m = r.Workbook.Sheets[e].CodeName || m)
            } catch (e) {
            }
            s[s.length] = Ze("sheetPr", null, {codeName: Ce(m)})
        }
        s[s.length] = Ze("dimension", null, {ref: d}), s[s.length] = (f = {workbookViewId: "0"}, ((((c = r) || {}).Workbook || {}).Views || [])[0] && (f.rightToLeft = c.Workbook.Views[0].RTL ? "1" : "0"), Ze("sheetViews", Ze("sheetView", null, f), {})), t.sheetFormat && (s[s.length] = Ze("sheetFormatPr", null, {
            defaultRowHeight: t.sheetFormat.defaultRowHeight || "16",
            baseColWidth: t.sheetFormat.baseColWidth || "10",
            outlineLevelRow: t.sheetFormat.outlineLevelRow || "7"
        })), null != l["!cols"] && 0 < l["!cols"].length && (s[s.length] = function (e) {
            for (var t, r = ["<cols>"], n = 0; n != e.length; ++n) (t = e[n]) && (r[r.length] = Ze("col", null, rl(n, t)));
            return r[r.length] = "</cols>", r.join("")
        }(l["!cols"])), s[a = s.length] = "<sheetData/>", l["!links"] = [], null != l["!ref"] && 0 < (o = function (e, t) {
            var r, n, a = [], s = [], i = Jt(e["!ref"]), o = "", l = "", c = [], f = 0, h = 0, u = e["!rows"],
                d = Array.isArray(e), p = {r: l}, m = -1;
            for (h = i.s.c; h <= i.e.c; ++h) c[h] = Gt(h);
            for (f = i.s.r; f <= i.e.r; ++f) {
                for (s = [], l = Xt(f), h = i.s.c; h <= i.e.c; ++h) {
                    r = c[h] + l;
                    var g = d ? (e[f] || [])[h] : e[r];
                    void 0 !== g && null != (o = El(g, r, e, t)) && s.push(o)
                }
                (0 < s.length || u && u[f]) && (p = {r: l}, u && u[f] && ((n = u[f]).hidden && (p.hidden = 1), m = -1, n.hpx ? m = li(n.hpx) : n.hpt && (m = n.hpt), -1 < m && (p.ht = m, p.customHeight = 1), n.level && (p.outlineLevel = n.level)), a[a.length] = Ze("row", s.join(""), p))
            }
            if (u) for (; f < u.length; ++f) u && u[f] && (p = {r: f + 1}, (n = u[f]).hidden && (p.hidden = 1), m = -1, n.hpx ? m = li(n.hpx) : n.hpt && (m = n.hpt), -1 < m && (p.ht = m, p.customHeight = 1), n.level && (p.outlineLevel = n.level), a[a.length] = Ze("row", "", p));
            return a.join("")
        }(l, t)).length && (s[s.length] = o), s.length > a + 1 && (s[s.length] = "</sheetData>", s[a] = s[a].replace("/>", ">")), null != l["!protect"] && (s[s.length] = (h = l["!protect"], u = {sheet: 1}, ["objects", "scenarios", "selectLockedCells", "selectUnlockedCells"].forEach(function (e) {
            null != h[e] && h[e] && (u[e] = "1")
        }), ["formatColumns", "formatRows", "formatCells", "insertColumns", "insertRows", "insertHyperlinks", "deleteColumns", "deleteRows", "sort", "autoFilter", "pivotTables"].forEach(function (e) {
            null == h[e] || h[e] || (u[e] = "0")
        }), h.password && (u.password = Ms(h.password).toString(16).toUpperCase()), Ze("sheetProtection", null, u))), null != l["!autofilter"] && (s[s.length] = function (e, t, r, n) {
            var a = "string" == typeof e.ref ? e.ref : Qt(e.ref);
            r.Workbook || (r.Workbook = {}), r.Workbook.Names || (r.Workbook.Names = []);
            var s = r.Workbook.Names, i = Zt(a);
            i.s.r == i.e.r && (i.e.r = Zt(t["!ref"]).e.r, a = Qt(i));
            for (var o = 0; o < s.length; ++o) {
                var l = s[o];
                if ("_xlnm._FilterDatabase" == l.Name && l.Sheet == n) {
                    l.Ref = "'" + r.SheetNames[n] + "'!" + a;
                    break
                }
            }
            return o == s.length && s.push({
                Name: "_xlnm._FilterDatabase",
                Sheet: n,
                Ref: "'" + r.SheetNames[n] + "'!" + a
            }), Ze("autoFilter", null, {ref: a})
        }(l["!autofilter"], l, r, e)), null != l["!merges"] && 0 < l["!merges"].length && (s[s.length] = function (e) {
            if (0 === e.length) return "";
            for (var t = '<mergeCells count="' + e.length + '">', r = 0; r != e.length; ++r) t += '<mergeCell ref="' + Qt(e[r]) + '"/>';
            return t + "</mergeCells>"
        }(l["!merges"]));
        var g, b, v = -1, E = -1;
        return 0 < l["!links"].length && (s[s.length] = "<hyperlinks>", l["!links"].forEach(function (e) {
            e[1].Target && (g = {ref: e[0]}, "#" != e[1].Target.charAt(0) && (E = tn(n, -1, Ce(e[1].Target).replace(/#.*$/, ""), Zr.HLINK), g["r:id"] = "rId" + E), -1 < (v = e[1].Target.indexOf("#")) && (g.location = Ce(e[1].Target.slice(v + 1))), e[1].Tooltip && (g.tooltip = Ce(e[1].Tooltip)), s[s.length] = Ze("hyperlink", null, g))
        }), s[s.length] = "</hyperlinks>"), delete l["!links"], null != l["!margins"] && (s[s.length] = (nl(b = l["!margins"]), Ze("pageMargins", null, b))), s[s.length] = "", t && !t.ignoreEC && null != t.ignoreEC || (s[s.length] = Ye("ignoredErrors", Ze("ignoredError", null, {
            numberStoredAsText: 1,
            sqref: d
        }))), 0 < l["!drawing"].length ? (E = tn(n, -1, "../drawings/drawing" + (e + 1) + ".xml", Zr.DRAW), s[s.length] = Ze("drawing", null, {"r:id": "rId" + E})) : delete l["!drawing"], 0 < l["!comments"].length && (E = tn(n, -1, "../drawings/vmlDrawing" + (e + 1) + ".vml", Zr.VML), s[s.length] = Ze("legacyDrawing", null, {"r:id": "rId" + E}), l["!legacy"] = E), 2 < s.length && (s[s.length] = "</worksheet>", s[1] = s[1].replace("/>", ">")), s.join("")
    }

    function Il(e, t, r, n) {
        var a = function (e, t, r) {
            var n = Pt(145), a = (r["!rows"] || [])[e] || {};
            n.write_shift(4, e), n.write_shift(4, 0);
            var s = 320;
            a.hpx ? s = 20 * li(a.hpx) : a.hpt && (s = 20 * a.hpt), n.write_shift(2, s), n.write_shift(1, 0);
            var i = 0;
            a.level && (i |= a.level), a.hidden && (i |= 16), (a.hpx || a.hpt) && (i |= 32), n.write_shift(1, i), n.write_shift(1, 0);
            var o = 0, l = n.l;
            n.l += 4;
            for (var c = {r: e, c: 0}, f = 0; f < 16; ++f) if (!(t.s.c > f + 1 << 10 || t.e.c < f << 10)) {
                for (var h = -1, u = -1, d = f << 10; d < f + 1 << 10; ++d) {
                    c.c = d, (Array.isArray(r) ? (r[c.r] || [])[c.c] : r[Kt(c)]) && (h < 0 && (h = d), u = d)
                }
                h < 0 || (++o, n.write_shift(4, h), n.write_shift(4, u))
            }
            var p = n.l;
            return n.l = l, n.write_shift(4, o), n.l = p, n.length > n.l ? n.slice(0, n.l) : n
        }(n, r, t);
        (17 < a.length || (t["!rows"] || [])[n]) && Mt(e, "BrtRowHdr", a)
    }

    var Rl = Sr, Ol = _r;

    function Fl(e, t, r) {
        return null == r && (r = Pt(12)), hr(t, r), function (e, t) {
            null == t && (t = Pt(4));
            var r = 0, n = 0, a = 100 * e;
            if (e == (0 | e) && -(1 << 29) <= e && e < 1 << 29 ? n = 1 : a == (0 | a) && -(1 << 29) <= a && a < 1 << 29 && (r = n = 1), !n) throw new Error("unsupported RkNumber " + e);
            t.write_shift(-4, ((r ? a : e) << 2) + (r + 2))
        }(e.v, r), r
    }

    var Dl = Sr, Pl = _r;
    var Nl = ["left", "right", "top", "bottom", "header", "footer"];

    function Ll(e, t, r, n, a, s) {
        if (void 0 !== t.v) {
            var i = "";
            switch (t.t) {
                case"b":
                    i = t.v ? "1" : "0";
                    break;
                case"d":
                    (t = be(t)).z = t.z || de._table[14], t.v = K(Q(t.v)), t.t = "n";
                    break;
                case"n":
                case"e":
                    i = "" + t.v;
                    break;
                default:
                    i = t.v
            }
            var o, l, c, f, h, u, d, p, m, g, b, v, E, w = {r: r, c: n};
            switch (w.s = al(a.cellXfs, t, a), t.l && s["!links"].push([Kt(w), t.l]), t.c && s["!comments"].push([Kt(w), t.c]), t.t) {
                case"s":
                case"str":
                    return void (a.bookSST ? (i = tl(a.Strings, t.v, a.revStrings), w.t = "s", w.v = i, Mt(e, "BrtCellIsst", (g = w, null == b && (b = Pt(12)), hr(g, b), b.write_shift(4, g.v), b))) : (w.t = "str", Mt(e, "BrtCellSt", (d = t, p = w, null == m && (m = Pt(12 + 4 * d.v.length)), hr(p, m), ir(d.v, m), m.length > m.l ? m.slice(0, m.l) : m))));
                case"n":
                    return void (t.v == (0 | t.v) && -1e3 < t.v && t.v < 1e3 ? Mt(e, "BrtCellRk", Fl(t, w)) : Mt(e, "BrtCellReal", (f = t, h = w, null == u && (u = Pt(16)), hr(h, u), Cr(f.v, u), u)));
                case"b":
                    return w.t = "b", void Mt(e, "BrtCellBool", (o = t, l = w, null == c && (c = Pt(9)), hr(l, c), c.write_shift(1, o.v ? 1 : 0), c));
                case"e":
                    w.t = "e"
            }
            Mt(e, "BrtCellBlank", (v = w, null == E && (E = Pt(8)), hr(v, E)))
        }
    }

    function Ml(t, e) {
        var r, n;
        e && e["!merges"] && (Mt(t, "BrtBeginMergeCells", (r = e["!merges"].length, null == n && (n = Pt(4)), n.write_shift(4, r), n)), e["!merges"].forEach(function (e) {
            Mt(t, "BrtMergeCell", Pl(e))
        }), Mt(t, "BrtEndMergeCells"))
    }

    function Ul(r, e) {
        e && e["!cols"] && (Mt(r, "BrtBeginColInfos"), e["!cols"].forEach(function (e, t) {
            e && Mt(r, "BrtColInfo", function (e, t, r) {
                null == r && (r = Pt(18));
                var n = rl(e, t);
                r.write_shift(-4, e), r.write_shift(-4, e), r.write_shift(4, 256 * (n.width || 10)), r.write_shift(4, 0);
                var a = 0;
                return t.hidden && (a |= 1), "number" == typeof n.width && (a |= 2), r.write_shift(1, a), r.write_shift(1, 0), r
            }(t, e))
        }), Mt(r, "BrtEndColInfos"))
    }

    function Hl(e, t) {
        var r, n;
        t && t["!ref"] && (Mt(e, "BrtBeginCellIgnoreECs"), Mt(e, "BrtCellIgnoreEC", (r = Jt(t["!ref"]), (n = Pt(24)).write_shift(4, 4), n.write_shift(4, 1), _r(r, n), n)), Mt(e, "BrtEndCellIgnoreECs"))
    }

    function zl(r, e, n) {
        e["!links"].forEach(function (e) {
            if (e[1].Target) {
                var t = tn(n, -1, e[1].Target.replace(/#.*$/, ""), Zr.HLINK);
                Mt(r, "BrtHLink", function (e, t) {
                    var r = Pt(50 + 4 * (e[1].Target.length + (e[1].Tooltip || "").length));
                    _r({s: Yt(e[0]), e: Yt(e[0])}, r), vr("rId" + t, r);
                    var n = e[1].Target.indexOf("#");
                    return ir((-1 == n ? "" : e[1].Target.slice(n + 1)) || "", r), ir(e[1].Tooltip || "", r), ir("", r), r.slice(0, r.l)
                }(e, t))
            }
        }), delete e["!links"]
    }

    function Vl(e, t, r) {
        Mt(e, "BrtBeginWsViews"), Mt(e, "BrtBeginWsView", function (e, t) {
            null == t && (t = Pt(30));
            var r = 924;
            return (((e || {}).Views || [])[0] || {}).RTL && (r |= 32), t.write_shift(2, r), t.write_shift(4, 0), t.write_shift(4, 0), t.write_shift(4, 0), t.write_shift(1, 0), t.write_shift(1, 0), t.write_shift(2, 0), t.write_shift(2, 100), t.write_shift(2, 0), t.write_shift(2, 0), t.write_shift(2, 0), t.write_shift(4, 0), t
        }(r)), Mt(e, "BrtEndWsView"), Mt(e, "BrtEndWsViews")
    }

    function Wl(e, t) {
        var r, n;
        t["!protect"] && Mt(e, "BrtSheetProtection", (r = t["!protect"], null == n && (n = Pt(66)), n.write_shift(2, r.password ? Ms(r.password) : 0), n.write_shift(4, 1), [["objects", !1], ["scenarios", !1], ["formatCells", !0], ["formatColumns", !0], ["formatRows", !0], ["insertColumns", !0], ["insertRows", !0], ["insertHyperlinks", !0], ["deleteColumns", !0], ["deleteRows", !0], ["selectLockedCells", !1], ["sort", !0], ["autoFilter", !0], ["pivotTables", !0], ["selectUnlockedCells", !1]].forEach(function (e) {
            e[1] ? n.write_shift(4, null == r[e[0]] || r[e[0]] ? 0 : 1) : n.write_shift(4, null != r[e[0]] && r[e[0]] ? 0 : 1)
        }), n))
    }

    function Xl(e, t, r, n) {
        var a = Lt(), s = r.SheetNames[e], i = r.Sheets[s] || {}, o = s;
        try {
            r && r.Workbook && (o = r.Workbook.Sheets[e].CodeName || o)
        } catch (e) {
        }
        var l, c, f, h, u = Jt(i["!ref"] || "A1");
        if (16383 < u.e.c || 1048575 < u.e.r) {
            if (t.WTF) throw new Error("Range " + (i["!ref"] || "A1") + " exceeds format limit A1:XFD1048576");
            u.e.c = Math.min(u.e.c, 16383), u.e.r = Math.min(u.e.c, 1048575)
        }
        return i["!links"] = [], i["!comments"] = [], Mt(a, "BrtBeginSheet"), r.vbaraw && Mt(a, "BrtWsProp", function (e, t) {
            null == t && (t = Pt(84 + 4 * e.length));
            for (var r = 0; r < 3; ++r) t.write_shift(1, 0);
            return kr({auto: 1}, t), t.write_shift(-4, -1), t.write_shift(-4, -1), dr(e, t), t.slice(0, t.l)
        }(o)), Mt(a, "BrtWsDim", Ol(u)), Vl(a, 0, r.Workbook), Ul(a, i), function (e, t, r) {
            var n, a = Jt(t["!ref"] || "A1"), s = "", i = [];
            Mt(e, "BrtBeginSheetData");
            var o = Array.isArray(t), l = a.e.r;
            t["!rows"] && (l = Math.max(a.e.r, t["!rows"].length - 1));
            for (var c = a.s.r; c <= l; ++c) if (s = Xt(c), Il(e, t, a, c), c <= a.e.r) for (var f = a.s.c; f <= a.e.c; ++f) {
                c === a.s.r && (i[f] = Gt(f)), n = i[f] + s;
                var h = o ? (t[c] || [])[f] : t[n];
                h && Ll(e, h, c, f, r, t)
            }
            Mt(e, "BrtEndSheetData")
        }(a, i, t), Wl(a, i), l = a, (c = i)["!autofilter"] && (Mt(l, "BrtBeginAFilter", _r(Jt(c["!autofilter"].ref))), Mt(l, "BrtEndAFilter")), Ml(a, i), zl(a, i, n), i["!margins"] && Mt(a, "BrtMargins", (f = i["!margins"], null == h && (h = Pt(48)), nl(f), Nl.forEach(function (e) {
            Cr(f[e], h)
        }), h)), t && !t.ignoreEC && null != t.ignoreEC || Hl(a, i), function (e, t, r, n) {
            if (0 < t["!comments"].length) {
                var a = tn(n, -1, "../drawings/vmlDrawing" + (r + 1) + ".vml", Zr.VML);
                Mt(e, "BrtLegacyDrawing", vr("rId" + a)), t["!legacy"] = a
            }
        }(a, i, e, n), Mt(a, "BrtEndSheet"), a.end()
    }

    function jl(e, t, r, n, a, s) {
        var i = s || {"!type": "chart"};
        if (!e) return s;
        var o = 0, l = 0, c = "A", f = {s: {r: 2e6, c: 2e6}, e: {r: 0, c: 0}};
        return (e.match(/<c:numCache>[\s\S]*?<\/c:numCache>/gm) || []).forEach(function (e) {
            var r = function (e) {
                var r = [];
                (e.match(/<c:pt idx="(\d*)">(.*?)<\/c:pt>/gm) || []).forEach(function (e) {
                    var t = e.match(/<c:pt idx="(\d*?)"><c:v>(.*)<\/c:v><\/c:pt>/);
                    t && (r[+t[1]] = +t[2])
                });
                var t = Se((e.match(/<c:formatCode>([\s\S]*?)<\/c:formatCode>/) || ["", "General"])[1]);
                return [r, t]
            }(e);
            f.s.r = f.s.c = 0, f.e.c = o, c = Gt(o), r[0].forEach(function (e, t) {
                i[c + Xt(t)] = {t: "n", v: e, z: r[1]}, l = t
            }), f.e.r < l && (f.e.r = l), ++o
        }), 0 < o && (i["!ref"] = Qt(f)), i
    }

    Zr.CS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet";
    Ze("chartsheet", null, {xmlns: Je.main[0], "xmlns:r": Je.r});
    var Gl = [["allowRefreshQuery", !1, "bool"], ["autoCompressPictures", !0, "bool"], ["backupFile", !1, "bool"], ["checkCompatibility", !1, "bool"], ["CodeName", ""], ["date1904", !1, "bool"], ["defaultThemeVersion", 0, "int"], ["filterPrivacy", !1, "bool"], ["hidePivotFieldList", !1, "bool"], ["promptedSolutions", !1, "bool"], ["publishItems", !1, "bool"], ["refreshAllConnections", !1, "bool"], ["saveExternalLinkValues", !0, "bool"], ["showBorderUnselectedTables", !0, "bool"], ["showInkAnnotation", !0, "bool"], ["showObjects", "all"], ["showPivotChartFilter", !1, "bool"], ["updateLinks", "userSet"]],
        $l = [["activeTab", 0, "int"], ["autoFilterDateGrouping", !0, "bool"], ["firstSheet", 0, "int"], ["minimized", !1, "bool"], ["showHorizontalScroll", !0, "bool"], ["showSheetTabs", !0, "bool"], ["showVerticalScroll", !0, "bool"], ["tabRatio", 600, "int"], ["visibility", "visible"]],
        Yl = [],
        Kl = [["calcCompleted", "true"], ["calcMode", "auto"], ["calcOnSave", "true"], ["concurrentCalc", "true"], ["fullCalcOnLoad", "false"], ["fullPrecision", "true"], ["iterate", "false"], ["iterateCount", "100"], ["iterateDelta", "0.001"], ["refMode", "A1"]];

    function Zl(e, t) {
        for (var r = 0; r != e.length; ++r) for (var n = e[r], a = 0; a != t.length; ++a) {
            var s = t[a];
            if (null == n[s[0]]) n[s[0]] = s[1]; else switch (s[2]) {
                case"bool":
                    "string" == typeof n[s[0]] && (n[s[0]] = Oe(n[s[0]]));
                    break;
                case"int":
                    "string" == typeof n[s[0]] && (n[s[0]] = parseInt(n[s[0]], 10))
            }
        }
    }

    function Ql(e, t) {
        for (var r = 0; r != t.length; ++r) {
            var n = t[r];
            if (null == e[n[0]]) e[n[0]] = n[1]; else switch (n[2]) {
                case"bool":
                    "string" == typeof e[n[0]] && (e[n[0]] = Oe(e[n[0]]));
                    break;
                case"int":
                    "string" == typeof e[n[0]] && (e[n[0]] = parseInt(e[n[0]], 10))
            }
        }
    }

    function Jl(e) {
        Ql(e.WBProps, Gl), Ql(e.CalcPr, Kl), Zl(e.WBView, $l), Zl(e.Sheets, Yl), qo.date1904 = Oe(e.WBProps.date1904)
    }

    var ql = "][*?/\\".split("");

    function ec(t, r) {
        if (31 < t.length) {
            if (r) return;
            throw new Error("Sheet names cannot exceed 31 chars")
        }
        var n = !0;
        return ql.forEach(function (e) {
            if (-1 != t.indexOf(e)) {
                if (!r) throw new Error("Sheet name cannot contain : \\ / ? * [ ]");
                n = !1
            }
        }), n
    }

    function tc(e) {
        if (!e || !e.SheetNames || !e.Sheets) throw new Error("Invalid Workbook");
        if (!e.SheetNames.length) throw new Error("Workbook is empty");
        var a, s, i, t = e.Workbook && e.Workbook.Sheets || [];
        a = e.SheetNames, s = t, i = !!e.vbaraw, a.forEach(function (e, t) {
            ec(e);
            for (var r = 0; r < t; ++r) if (e == a[r]) throw new Error("Duplicate Sheet Name: " + e);
            if (i) {
                var n = s && s[t] && s[t].CodeName || e;
                if (95 == n.charCodeAt(0) && 22 < n.length) throw new Error("Bad Code Name: Worksheet" + n)
            }
        });
        for (var r = 0; r < e.SheetNames.length; ++r) il(e.Sheets[e.SheetNames[r]], e.SheetNames[r], r)
    }

    var rc = /<\w+:workbook/;
    var nc = Ze("workbook", null, {xmlns: Je.main[0], "xmlns:r": Je.r});

    function ac(e, t) {
        if (t.Workbook && t.Workbook.Sheets) {
            for (var r, n, a = t.Workbook.Sheets, s = 0, i = -1, o = -1; s < a.length; ++s) !a[s] || !a[s].Hidden && -1 == i ? i = s : 1 == a[s].Hidden && -1 == o && (o = s);
            if (!(i < o)) Mt(e, "BrtBeginBookViews"), Mt(e, "BrtBookView", (r = i, (n = n || Pt(29)).write_shift(-4, 0), n.write_shift(-4, 460), n.write_shift(4, 28800), n.write_shift(4, 17600), n.write_shift(4, 500), n.write_shift(4, r), n.write_shift(4, r), n.write_shift(1, 120), n.length > n.l ? n.slice(0, n.l) : n)), Mt(e, "BrtEndBookViews")
        }
    }

    function sc(e, t) {
        var r = Lt();
        return Mt(r, "BrtBeginBook"), Mt(r, "BrtFileVersion", function (e) {
            e = e || Pt(127);
            for (var t = 0; 4 != t; ++t) e.write_shift(4, 0);
            return ir("SheetJS", e), ir(n.version, e), ir(n.version, e), ir("7262", e), e.length = e.l, e.length > e.l ? e.slice(0, e.l) : e
        }()), Mt(r, "BrtWbProp", function (e, t) {
            t = t || Pt(72);
            var r = 0;
            return e && e.filterPrivacy && (r |= 8), t.write_shift(4, r), t.write_shift(4, 0), dr(e && e.CodeName || "ThisWorkbook", t), t.slice(0, t.l)
        }(e.Workbook && e.Workbook.WBProps || null)), ac(r, e), function (e, t) {
            Mt(e, "BrtBeginBundleShs");
            for (var r = 0; r != t.SheetNames.length; ++r) {
                var n = {
                    Hidden: t.Workbook && t.Workbook.Sheets && t.Workbook.Sheets[r] && t.Workbook.Sheets[r].Hidden || 0,
                    iTabID: r + 1,
                    strRelID: "rId" + (r + 1),
                    name: t.SheetNames[r]
                };
                Mt(e, "BrtBundleSh", (a = n, (s = (s = void 0) || Pt(127)).write_shift(4, a.Hidden), s.write_shift(4, a.iTabID), vr(a.strRelID, s), ir(a.name.slice(0, 31), s), s.length > s.l ? s.slice(0, s.l) : s))
            }
            var a, s;
            Mt(e, "BrtEndBundleShs")
        }(r, e), Mt(r, "BrtEndBook"), r.end()
    }

    function ic(e, t, r) {
        return (".bin" === t.slice(-4) ? function (e, n) {
            var a = {AppVersion: {}, WBProps: {}, WBView: [], Sheets: [], CalcPr: {}, xmlns: ""}, s = [], i = !1;
            (n = n || {}).biff = 12;
            var o = [], l = [[]];
            return l.SheetNames = [], l.XTI = [], Nt(e, function (e, t, r) {
                switch (r) {
                    case 156:
                        l.SheetNames.push(e.name), a.Sheets.push(e);
                        break;
                    case 153:
                        a.WBProps = e;
                        break;
                    case 39:
                        null != e.Sheet && (n.SID = e.Sheet), e.Ref = Uo(e.Ptg, 0, null, l, n), delete n.SID, delete e.Ptg, o.push(e);
                        break;
                    case 1036:
                        break;
                    case 357:
                    case 358:
                    case 355:
                    case 667:
                        l[0].length ? l.push([r, e]) : l[0] = [r, e], l[l.length - 1].XTI = [];
                        break;
                    case 362:
                        0 === l.length && (l[0] = [], l[0].XTI = []), l[l.length - 1].XTI = l[l.length - 1].XTI.concat(e), l.XTI = l.XTI.concat(e);
                        break;
                    case 361:
                        break;
                    case 3072:
                    case 3073:
                    case 2071:
                    case 534:
                    case 677:
                    case 158:
                    case 157:
                    case 610:
                    case 2050:
                    case 155:
                    case 548:
                    case 676:
                    case 128:
                    case 665:
                    case 2128:
                    case 2125:
                    case 549:
                    case 2053:
                    case 596:
                    case 2076:
                    case 2075:
                    case 2082:
                    case 397:
                    case 154:
                    case 1117:
                    case 553:
                    case 2091:
                        break;
                    case 35:
                        s.push(t), i = !0;
                        break;
                    case 36:
                        s.pop(), i = !1;
                        break;
                    case 37:
                        s.push(t), i = !0;
                        break;
                    case 38:
                        s.pop(), i = !1;
                        break;
                    case 16:
                        break;
                    default:
                        if (!(0 < (t || "").indexOf("Begin")) && !(0 < (t || "").indexOf("End")) && (!i || n.WTF && "BrtACBegin" != s[s.length - 1] && "BrtFRTBegin" != s[s.length - 1])) throw new Error("Unexpected record " + r + " " + t)
                }
            }, n), Jl(a), a.Names = o, a.supbooks = l, a
        } : function (n, a) {
            if (!n) throw new Error("Could not find file");
            var s = {AppVersion: {}, WBProps: {}, WBView: [], Sheets: [], CalcPr: {}, Names: [], xmlns: ""}, i = !1,
                o = "xmlns", l = {}, c = 0;
            if (n.replace(W, function (e, t) {
                var r = ve(e);
                switch (G(r[0])) {
                    case"<?xml":
                        break;
                    case"<workbook":
                        e.match(rc) && (o = "xmlns" + e.match(/<(\w+):/)[1]), s.xmlns = r[o];
                        break;
                    case"</workbook>":
                        break;
                    case"<fileVersion":
                        delete r[0], s.AppVersion = r;
                        break;
                    case"<fileVersion/>":
                    case"</fileVersion>":
                        break;
                    case"<fileSharing":
                    case"<fileSharing/>":
                        break;
                    case"<workbookPr":
                    case"<workbookPr/>":
                        Gl.forEach(function (e) {
                            if (null != r[e[0]]) switch (e[2]) {
                                case"bool":
                                    s.WBProps[e[0]] = Oe(r[e[0]]);
                                    break;
                                case"int":
                                    s.WBProps[e[0]] = parseInt(r[e[0]], 10);
                                    break;
                                default:
                                    s.WBProps[e[0]] = r[e[0]]
                            }
                        }), r.codeName && (s.WBProps.CodeName = r.codeName);
                        break;
                    case"</workbookPr>":
                    case"<workbookProtection":
                    case"<workbookProtection/>":
                        break;
                    case"<bookViews":
                    case"<bookViews>":
                    case"</bookViews>":
                        break;
                    case"<workbookView":
                    case"<workbookView/>":
                        delete r[0], s.WBView.push(r);
                        break;
                    case"</workbookView>":
                        break;
                    case"<sheets":
                    case"<sheets>":
                    case"</sheets>":
                        break;
                    case"<sheet":
                        switch (r.state) {
                            case"hidden":
                                r.Hidden = 1;
                                break;
                            case"veryHidden":
                                r.Hidden = 2;
                                break;
                            default:
                                r.Hidden = 0
                        }
                        delete r.state, r.name = Se(Fe(r.name)), delete r[0], s.Sheets.push(r);
                        break;
                    case"</sheet>":
                        break;
                    case"<functionGroups":
                    case"<functionGroups/>":
                    case"<functionGroup":
                        break;
                    case"<externalReferences":
                    case"</externalReferences>":
                    case"<externalReferences>":
                    case"<externalReference":
                    case"<definedNames/>":
                        break;
                    case"<definedNames>":
                    case"<definedNames":
                        i = !0;
                        break;
                    case"</definedNames>":
                        i = !1;
                        break;
                    case"<definedName":
                        (l = {}).Name = Fe(r.name), r.comment && (l.Comment = r.comment), r.localSheetId && (l.Sheet = +r.localSheetId), Oe(r.hidden || "0") && (l.Hidden = !0), c = t + e.length;
                        break;
                    case"</definedName>":
                        l.Ref = Se(Fe(n.slice(c, t))), s.Names.push(l);
                        break;
                    case"<definedName/>":
                        break;
                    case"<calcPr":
                    case"<calcPr/>":
                        delete r[0], s.CalcPr = r;
                        break;
                    case"</calcPr>":
                    case"<oleSize":
                        break;
                    case"<customWorkbookViews>":
                    case"</customWorkbookViews>":
                    case"<customWorkbookViews":
                        break;
                    case"<customWorkbookView":
                    case"</customWorkbookView>":
                        break;
                    case"<pivotCaches>":
                    case"</pivotCaches>":
                    case"<pivotCaches":
                    case"<pivotCache":
                        break;
                    case"<smartTagPr":
                    case"<smartTagPr/>":
                        break;
                    case"<smartTagTypes":
                    case"<smartTagTypes>":
                    case"</smartTagTypes>":
                    case"<smartTagType":
                        break;
                    case"<webPublishing":
                    case"<webPublishing/>":
                        break;
                    case"<fileRecoveryPr":
                    case"<fileRecoveryPr/>":
                        break;
                    case"<webPublishObjects>":
                    case"<webPublishObjects":
                    case"</webPublishObjects>":
                    case"<webPublishObject":
                        break;
                    case"<extLst":
                    case"<extLst>":
                    case"</extLst>":
                    case"<extLst/>":
                        break;
                    case"<soulTable":
                        i = !0;
                        break;
                    case"</soulTable>":
                        i = !1;
                        break;
                    case"<ArchID":
                        break;
                    case"<AlternateContent":
                    case"<AlternateContent>":
                        i = !0;
                        break;
                    case"</AlternateContent>":
                        i = !1;
                        break;
                    case"<revisionPtr":
                        break;
                    default:
                        if (!i && a.WTF) throw new Error("unrecognized " + r[0] + " in workbook")
                }
                return e
            }), -1 === Je.main.indexOf(s.xmlns)) throw new Error("Unknown Namespace: " + s.xmlns);
            return Jl(s), s
        })(e, r)
    }

    function oc(e, t, r, n, a, s, i, o) {
        return (".bin" === t.slice(-4) ? function (e, t, i, o, l, c, f) {
            if (!e) return e;
            var h = t || {};
            o = o || {"!id": {}}, null != ue && null == h.dense && (h.dense = ue);
            var u, d, p, m, g, b, v, E, w, S, _ = h.dense ? [] : {}, y = {s: {r: 2e6, c: 2e6}, e: {r: 0, c: 0}}, C = !1,
                B = !1, T = [];
            h.biff = 12;
            var k = h["!row"] = 0, x = !1, A = [], I = {}, R = h.supbooks || l.supbooks || [[]];
            if (R.sharedf = I, R.arrayf = A, R.SheetNames = l.SheetNames || l.Sheets.map(function (e) {
                return e.name
            }), !h.supbooks && (h.supbooks = R, l.Names)) for (var r = 0; r < l.Names.length; ++r) R[0][r + 1] = l.Names[r];
            var O = [], F = [], D = !1;
            if (Nt(e, function (e, t, r) {
                if (!B) switch (r) {
                    case 148:
                        u = e;
                        break;
                    case 0:
                        d = e, h.sheetRows && h.sheetRows <= d.r && (B = !0), w = Xt(g = d.r), h["!row"] = d.r, (e.hidden || e.hpt || null != e.level) && (e.hpt && (e.hpx = ci(e.hpt)), F[e.r] = e);
                        break;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        switch (p = {t: e[2]}, e[2]) {
                            case"n":
                                p.v = e[1];
                                break;
                            case"s":
                                E = Jo[e[1]], p.v = E.t, p.r = E.r;
                                break;
                            case"b":
                                p.v = !!e[1];
                                break;
                            case"e":
                                p.v = e[1], !1 !== h.cellText && (p.w = Br[p.v]);
                                break;
                            case"str":
                                p.t = "s", p.v = e[1]
                        }
                        if ((m = f.CellXf[e[0].iStyleRef]) && sl(p, m.numFmtId, null, h, c, f), b = e[0].c, h.dense ? (_[g] || (_[g] = []), _[g][b] = p) : _[Gt(b) + w] = p, h.cellFormula) {
                            for (x = !1, k = 0; k < A.length; ++k) {
                                var n = A[k];
                                d.r >= n[0].s.r && d.r <= n[0].e.r && b >= n[0].s.c && b <= n[0].e.c && (p.F = Qt(n[0]), x = !0)
                            }
                            !x && 3 < e.length && (p.f = e[3])
                        }
                        if (y.s.r > d.r && (y.s.r = d.r), y.s.c > b && (y.s.c = b), y.e.r < d.r && (y.e.r = d.r), y.e.c < b && (y.e.c = b), h.cellDates && m && "n" == p.t && de.is_date(de._table[m.numFmtId])) {
                            var a = de.parse_date_code(p.v);
                            a && (p.t = "d", p.v = new Date(a.y, a.m - 1, a.d, a.H, a.M, a.S, a.u))
                        }
                        break;
                    case 1:
                        if (!h.sheetStubs || C) break;
                        p = {
                            t: "z",
                            v: void 0
                        }, b = e[0].c, h.dense ? (_[g] || (_[g] = []), _[g][b] = p) : _[Gt(b) + w] = p, y.s.r > d.r && (y.s.r = d.r), y.s.c > b && (y.s.c = b), y.e.r < d.r && (y.e.r = d.r), y.e.c < b && (y.e.c = b);
                        break;
                    case 176:
                        T.push(e);
                        break;
                    case 494:
                        var s = o["!id"][e.relId];
                        for (s ? (e.Target = s.Target, e.loc && (e.Target += "#" + e.loc), e.Rel = s) : "" == e.relId && (e.Target = "#" + e.loc), g = e.rfx.s.r; g <= e.rfx.e.r; ++g) for (b = e.rfx.s.c; b <= e.rfx.e.c; ++b) h.dense ? (_[g] || (_[g] = []), _[g][b] || (_[g][b] = {
                            t: "z",
                            v: void 0
                        }), _[g][b].l = e) : (v = Kt({c: b, r: g}), _[v] || (_[v] = {t: "z", v: void 0}), _[v].l = e);
                        break;
                    case 426:
                        if (!h.cellFormula) break;
                        A.push(e), (S = h.dense ? _[g][b] : _[Gt(b) + w]).f = Uo(e[1], 0, {
                            r: d.r,
                            c: b
                        }, R, h), S.F = Qt(e[0]);
                        break;
                    case 427:
                        if (!h.cellFormula) break;
                        I[Kt(e[0].s)] = e[1], (S = h.dense ? _[g][b] : _[Gt(b) + w]).f = Uo(e[1], 0, {
                            r: d.r,
                            c: b
                        }, R, h);
                        break;
                    case 60:
                        if (!h.cellStyles) break;
                        for (; e.e >= e.s;) O[e.e--] = {
                            width: e.w / 256,
                            hidden: !!(1 & e.flags)
                        }, D || (D = !0, si(e.w / 256)), ii(O[e.e + 1]);
                        break;
                    case 161:
                        _["!autofilter"] = {ref: Qt(e)};
                        break;
                    case 476:
                        _["!margins"] = e;
                        break;
                    case 147:
                        l.Sheets[i] || (l.Sheets[i] = {}), e.name && (l.Sheets[i].CodeName = e.name);
                        break;
                    case 137:
                        l.Views || (l.Views = [{}]), l.Views[0] || (l.Views[0] = {}), e.RTL && (l.Views[0].RTL = !0);
                        break;
                    case 485:
                        break;
                    case 175:
                    case 644:
                    case 625:
                    case 562:
                    case 396:
                    case 1112:
                    case 1146:
                    case 471:
                    case 1050:
                    case 649:
                    case 1105:
                    case 49:
                    case 589:
                    case 607:
                    case 564:
                    case 1055:
                    case 168:
                    case 174:
                    case 1180:
                    case 499:
                    case 64:
                    case 1053:
                    case 550:
                    case 171:
                    case 167:
                    case 1177:
                    case 169:
                    case 1181:
                    case 551:
                    case 552:
                    case 661:
                    case 639:
                    case 478:
                    case 151:
                    case 537:
                    case 477:
                    case 536:
                    case 1103:
                    case 680:
                    case 1104:
                    case 1024:
                    case 152:
                    case 663:
                    case 535:
                    case 678:
                    case 504:
                    case 1043:
                    case 428:
                    case 170:
                    case 3072:
                    case 50:
                    case 2070:
                    case 1045:
                        break;
                    case 35:
                        C = !0;
                        break;
                    case 36:
                        C = !1;
                        break;
                    case 37:
                    case 38:
                        break;
                    default:
                        if (!(0 < (t || "").indexOf("Begin")) && !(0 < (t || "").indexOf("End")) && (!C || h.WTF)) throw new Error("Unexpected record " + r + " " + t)
                }
            }, h), delete h.supbooks, delete h["!row"], !_["!ref"] && (y.s.r < 2e6 || u && (0 < u.e.r || 0 < u.e.c || 0 < u.s.r || 0 < u.s.c)) && (_["!ref"] = Qt(u || y)), h.sheetRows && _["!ref"]) {
                var n = Jt(_["!ref"]);
                h.sheetRows <= +n.e.r && (n.e.r = h.sheetRows - 1, n.e.r > y.e.r && (n.e.r = y.e.r), n.e.r < n.s.r && (n.s.r = n.e.r), n.e.c > y.e.c && (n.e.c = y.e.c), n.e.c < n.s.c && (n.s.c = n.e.c), _["!fullref"] = _["!ref"], _["!ref"] = Qt(n))
            }
            return 0 < T.length && (_["!merges"] = T), 0 < O.length && (_["!cols"] = O), 0 < F.length && (_["!rows"] = F), _
        } : gl)(e, n, r, a, s, i, o)
    }

    function lc(e, t, r, n, a, s) {
        return ".bin" === t.slice(-4) ? function (e, n, a, t, s) {
            if (!e) return e;
            t = t || {"!id": {}};
            var i = {"!type": "chart", "!chart": null, "!rel": ""}, o = [], l = !1;
            return Nt(e, function (e, t, r) {
                switch (r) {
                    case 550:
                        i["!rel"] = e;
                        break;
                    case 651:
                        s.Sheets[a] || (s.Sheets[a] = {}), e.name && (s.Sheets[a].CodeName = e.name);
                        break;
                    case 562:
                    case 652:
                    case 669:
                    case 679:
                    case 551:
                    case 552:
                    case 476:
                    case 3072:
                        break;
                    case 35:
                        l = !0;
                        break;
                    case 36:
                        l = !1;
                        break;
                    case 37:
                        o.push(t);
                        break;
                    case 38:
                        o.pop();
                        break;
                    default:
                        if (0 < (t || "").indexOf("Begin")) o.push(t); else if (0 < (t || "").indexOf("End")) o.pop(); else if (!l || n.WTF) throw new Error("Unexpected record " + r + " " + t)
                }
            }, n), t["!id"][i["!rel"]] && (i["!chart"] = t["!id"][i["!rel"]]), i
        }(e, n, r, a, s) : function (e, t, r, n) {
            if (!e) return e;
            r = r || {"!id": {}};
            var a, s = {"!type": "chart", "!chart": null, "!rel": ""}, i = e.match(pl);
            return i && bl(i[0], 0, n, t), (a = e.match(/drawing r:id="(.*?)"/)) && (s["!rel"] = a[1]), r["!id"][s["!rel"]] && (s["!chart"] = r["!id"][s["!rel"]]), s
        }(e, r, a, s)
    }

    function cc(e, t, r, n) {
        return (".bin" === t.slice(-4) ? function (e, n, a) {
            var s = {NumberFmt: []};
            for (var t in de._table) s.NumberFmt[t] = de._table[t];
            s.CellXf = [], s.Fonts = [];
            var i = [], o = !1;
            return Nt(e, function (e, t, r) {
                switch (r) {
                    case 44:
                        s.NumberFmt[e[0]] = e[1], de.load(e[1], e[0]);
                        break;
                    case 43:
                        s.Fonts.push(e), null != e.color.theme && n && n.themeElements && n.themeElements.clrScheme && (e.color.rgb = Zs(n.themeElements.clrScheme[e.color.theme].rgb, e.color.tint || 0));
                        break;
                    case 1025:
                    case 45:
                    case 46:
                        break;
                    case 47:
                        "BrtBeginCellXFs" == i[i.length - 1] && s.CellXf.push(e);
                        break;
                    case 48:
                    case 507:
                    case 572:
                    case 475:
                        break;
                    case 1171:
                    case 2102:
                    case 1130:
                    case 512:
                    case 2095:
                    case 3072:
                        break;
                    case 35:
                        o = !0;
                        break;
                    case 36:
                        o = !1;
                        break;
                    case 37:
                        i.push(t);
                        break;
                    case 38:
                        i.pop();
                        break;
                    default:
                        if (0 < (t || "").indexOf("Begin")) i.push(t); else if (0 < (t || "").indexOf("End")) i.pop(); else if (!o || a.WTF) throw new Error("Unexpected record " + r + " " + t)
                }
            }), s
        } : vi)(e, r, n)
    }

    function fc(e, t, r) {
        return ".bin" === t.slice(-4) ? (n = r, s = !(a = []), Nt(e, function (e, t, r) {
            switch (r) {
                case 159:
                    a.Count = e[0], a.Unique = e[1];
                    break;
                case 19:
                    a.push(e);
                    break;
                case 160:
                    return 1;
                case 35:
                    s = !0;
                    break;
                case 36:
                    s = !1;
                    break;
                default:
                    if (0 < t.indexOf("Begin") || t.indexOf("End"), !s || n.WTF) throw new Error("Unexpected record " + r + " " + t)
            }
        }), a) : function (e, t) {
            var r = [], n = "";
            if (!e) return r;
            var a = e.match(Bs);
            if (a) {
                n = a[2].replace(Ts, "").split(ks);
                for (var s = 0; s != n.length; ++s) {
                    var i = Cs(n[s].trim(), t);
                    null != i && (r[r.length] = i)
                }
                a = ve(a[1]), r.Count = a.count, r.Unique = a.uniqueCount
            }
            return r
        }(e, r);
        var n, a, s
    }

    function hc(e, t, r) {
        return ".bin" === t.slice(-4) ? (n = r, a = [], s = [], o = !(i = {}), Nt(e, function (e, t, r) {
            switch (r) {
                case 632:
                    s.push(e);
                    break;
                case 635:
                    i = e;
                    break;
                case 637:
                    i.t = e.t, i.h = e.h, i.r = e.r;
                    break;
                case 636:
                    if (i.author = s[i.iauthor], delete i.iauthor, n.sheetRows && n.sheetRows <= i.rfx.r) break;
                    i.t || (i.t = ""), delete i.rfx, a.push(i);
                    break;
                case 3072:
                    break;
                case 35:
                    o = !0;
                    break;
                case 36:
                    o = !1;
                    break;
                case 37:
                case 38:
                    break;
                default:
                    if (!(0 < (t || "").indexOf("Begin")) && !(0 < (t || "").indexOf("End")) && (!o || n.WTF)) throw new Error("Unexpected record " + r + " " + t)
            }
        }), a) : function (e, o) {
            if (e.match(/<(?:\w+:)?comments *\/>/)) return [];
            var l = [], c = [], t = e.match(/<(?:\w+:)?authors>([\s\S]*)<\/(?:\w+:)?authors>/);
            t && t[1] && t[1].split(/<\/\w*:?author>/).forEach(function (e) {
                if ("" !== e && "" !== e.trim()) {
                    var t = e.match(/<(?:\w+:)?author[^>]*>(.*)/);
                    t && l.push(t[1])
                }
            });
            var r = e.match(/<(?:\w+:)?commentList>([\s\S]*)<\/(?:\w+:)?commentList>/);
            return r && r[1] && r[1].split(/<\/\w*:?comment>/).forEach(function (e) {
                if ("" !== e && "" !== e.trim()) {
                    var t = e.match(/<(?:\w+:)?comment[^>]*>/);
                    if (t) {
                        var r = ve(t[0]),
                            n = {author: r.authorId && l[r.authorId] || "sheetjsghost", ref: r.ref, guid: r.guid},
                            a = Yt(r.ref);
                        if (!(o.sheetRows && o.sheetRows <= a.r)) {
                            var s = e.match(/<(?:\w+:)?text>([\s\S]*)<\/(?:\w+:)?text>/),
                                i = !!s && !!s[1] && Cs(s[1]) || {r: "", t: "", h: ""};
                            n.r = i.r, "<t></t>" == i.r && (i.t = i.h = ""), n.t = i.t.replace(/\r\n/g, "\n").replace(/\r/g, "\n"), o.cellHTML && (n.h = i.h), c.push(n)
                        }
                    }
                }
            }), c
        }(e, r);
        var n, a, s, i, o
    }

    function uc(e, t) {
        return ".bin" === t.slice(-4) ? (n = [], Nt(e, function (e, t, r) {
            switch (r) {
                case 63:
                    n.push(e);
                    break;
                default:
                    if (!(0 < (t || "").indexOf("Begin") || 0 < (t || "").indexOf("End"))) throw new Error("Unexpected record " + r + " " + t)
            }
        }), n) : function (e) {
            var r = [];
            if (!e) return r;
            var n = 1;
            return (e.match(W) || []).forEach(function (e) {
                var t = ve(e);
                switch (t[0]) {
                    case"<?xml":
                        break;
                    case"<calcChain":
                    case"<calcChain>":
                    case"</calcChain>":
                        break;
                    case"<c":
                        delete t[0], t.i ? n = t.i : t.i = n, r.push(t)
                }
            }), r
        }(e);
        var n
    }

    function dc(e, t, r) {
        if (".bin" === t.slice(-4)) return function (e, t) {
            if (!e) return e;
            var n = t || {}, a = !1;
            Nt(e, function (e, t, r) {
                switch (0, r) {
                    case 359:
                    case 363:
                    case 364:
                    case 366:
                    case 367:
                    case 368:
                    case 369:
                    case 370:
                    case 371:
                    case 472:
                    case 577:
                    case 578:
                    case 579:
                    case 580:
                    case 581:
                    case 582:
                    case 583:
                    case 584:
                    case 585:
                    case 586:
                    case 587:
                        break;
                    case 35:
                        a = !0;
                        break;
                    case 36:
                        a = !1;
                        break;
                    default:
                        if (!(0 < (t || "").indexOf("Begin")) && !(0 < (t || "").indexOf("End")) && (!a || n.WTF)) throw new Error("Unexpected record " + r.toString(16) + " " + t)
                }
            }, n)
        }(e, r)
    }

    function pc(e, t, r) {
        return (".bin" === t.slice(-4) ? sc : function (t) {
            var r = [z];
            r[r.length] = nc;
            var e = t.Workbook && 0 < (t.Workbook.Names || []).length, n = {codeName: "ThisWorkbook"};
            t.Workbook && t.Workbook.WBProps && (Gl.forEach(function (e) {
                null != t.Workbook.WBProps[e[0]] && t.Workbook.WBProps[e[0]] != e[1] && (n[e[0]] = t.Workbook.WBProps[e[0]])
            }), t.Workbook.WBProps.CodeName && (n.codeName = t.Workbook.WBProps.CodeName, delete n.CodeName)), r[r.length] = Ze("workbookPr", null, n);
            var a = t.Workbook && t.Workbook.Sheets || [], s = 0;
            for (r[r.length] = "<sheets>", s = 0; s != t.SheetNames.length; ++s) {
                var i = {name: Ce(t.SheetNames[s].slice(0, 31))};
                if (i.sheetId = "" + (s + 1), i["r:id"] = "rId" + (s + 1), a[s]) switch (a[s].Hidden) {
                    case 1:
                        i.state = "hidden";
                        break;
                    case 2:
                        i.state = "veryHidden"
                }
                r[r.length] = Ze("sheet", null, i)
            }
            return r[r.length] = "</sheets>", e && (r[r.length] = "<definedNames>", t.Workbook && t.Workbook.Names && t.Workbook.Names.forEach(function (e) {
                var t = {name: e.Name};
                e.Comment && (t.comment = e.Comment), null != e.Sheet && (t.localSheetId = "" + e.Sheet), e.Hidden && (t.hidden = "1"), e.Ref && (r[r.length] = Ze("definedName", String(e.Ref).replace(/</g, "&lt;").replace(/>/g, "&gt;"), t))
            }), r[r.length] = "</definedNames>"), 2 < r.length && (r[r.length] = "</workbook>", r[1] = r[1].replace("/>", ">")), r.join("")
        })(e, r)
    }

    function mc(e, t, r) {
        return (".bin" === t.slice(-4) ? Is : function (e, t) {
            if (!t.bookSST) return "";
            var r = [z];
            r[r.length] = Ze("sst", null, {xmlns: Je.main[0], count: e.Count, uniqueCount: e.Unique});
            for (var n = 0; n != e.length; ++n) if (null != e[n]) {
                var a = e[n], s = "<si>";
                a.r ? s += a.r : (s += "<t", a.t || (a.t = ""), a.t.match(xs) && (s += ' xml:space="preserve"'), s += ">" + Ce(a.t) + "</t>"), s += "</si>", r[r.length] = s
            }
            return 2 < r.length && (r[r.length] = "</sst>", r[1] = r[1].replace("/>", ">")), r.join("")
        })(e, r)
    }

    function gc(e, t, r) {
        return (".bin" === t.slice(-4) ? Ki : function (e) {
            var r = [z, $i], n = [];
            return r.push("<authors>"), e.forEach(function (e) {
                e[1].forEach(function (e) {
                    var t = Ce(e.a);
                    -1 < n.indexOf(t) || (n.push(t), r.push("<author>" + t + "</author>"))
                })
            }), r.push("</authors>"), r.push("<commentList>"), e.forEach(function (t) {
                t[1].forEach(function (e) {
                    r.push('<comment ref="' + t[0] + '" authorId="' + n.indexOf(Ce(e.a)) + '"><text>'), r.push(Ye("t", null == e.t ? "" : Ce(e.t))), r.push("</text></comment>")
                })
            }), r.push("</commentList>"), 2 < r.length && (r[r.length] = "</comments>", r[1] = r[1].replace("/>", ">")), r.join("")
        })(e, r)
    }

    var bc = /([\w:]+)=((?:")([^"]*)(?:")|(?:')([^']*)(?:'))/g,
        vc = /([\w:]+)=((?:")(?:[^"]*)(?:")|(?:')(?:[^']*)(?:'))/, Ec = function (e) {
            return String.fromCharCode(e)
        };

    function wc(e, t) {
        var r = e.split(/\s+/), n = [];
        if (t || (n[0] = r[0]), 1 === r.length) return n;
        var a, s, i, o = e.match(bc);
        if (o) for (i = 0; i != o.length; ++i) -1 === (s = (a = o[i].match(vc))[1].indexOf(":")) ? n[a[1]] = a[2].slice(1, a[2].length - 1) : n["xmlns:" === a[1].slice(0, 6) ? "xmlns" + a[1].slice(6) : a[1].slice(s + 1)] = a[2].slice(1, a[2].length - 1);
        return n
    }

    function Sc(e) {
        var t = {};
        if (1 === e.split(/\s+/).length) return t;
        var r, n, a, s = e.match(bc);
        if (s) for (a = 0; a != s.length; ++a) -1 === (n = (r = s[a].match(vc))[1].indexOf(":")) ? t[r[1]] = r[2].slice(1, r[2].length - 1) : t["xmlns:" === r[1].slice(0, 6) ? "xmlns" + r[1].slice(6) : r[1].slice(n + 1)] = r[2].slice(1, r[2].length - 1);
        return t
    }

    function _c(e, t, r, n) {
        var a = n;
        switch ((r[0].match(/dt:dt="([\w.]+)"/) || ["", ""])[1]) {
            case"boolean":
                a = Oe(n);
                break;
            case"i2":
            case"int":
                a = parseInt(n, 10);
                break;
            case"r4":
            case"float":
                a = parseFloat(n);
                break;
            case"date":
            case"dateTime.tz":
                a = Q(n);
                break;
            case"i8":
            case"string":
            case"fixed":
            case"uuid":
            case"bin.base64":
                break;
            default:
                throw new Error("bad custprop:" + r[0])
        }
        e[Se(t)] = a
    }

    function yc(e, t, r) {
        if ("z" !== e.t) {
            if (!r || !1 !== r.cellText) try {
                "e" === e.t ? e.w = e.w || Br[e.v] : "General" === t ? "n" === e.t ? (0 | e.v) === e.v ? e.w = de._general_int(e.v) : e.w = de._general_num(e.v) : e.w = de._general(e.v) : e.w = (n = t || "General", a = e.v, "General" === (s = fe[n] || Se(n)) ? de._general(a) : de.format(s, a))
            } catch (e) {
                if (r.WTF) throw e
            }
            var n, a, s;
            try {
                var i = fe[t] || t || "General";
                if (r.cellNF && (e.z = i), r.cellDates && "n" == e.t && de.is_date(i)) {
                    var o = de.parse_date_code(e.v);
                    o && (e.t = "d", e.v = new Date(o.y, o.m - 1, o.d, o.H, o.M, o.S, o.u))
                }
            } catch (e) {
                if (r.WTF) throw e
            }
        }
    }

    function Cc(e, t, r) {
        if (r.cellStyles && t.Interior) {
            var n = t.Interior;
            n.Pattern && (n.patternType = fi[n.Pattern] || n.Pattern)
        }
        e[t.ID] = t
    }

    function Bc(e, t, r, n, a, s, i, o, l, c) {
        var f = "General", h = n.StyleID, u = {};
        c = c || {};
        var d = [], p = 0;
        for (void 0 === h && o && (h = o.StyleID), void 0 === h && i && (h = i.StyleID); void 0 !== s[h] && (s[h].nf && (f = s[h].nf), s[h].Interior && d.push(s[h].Interior), s[h].Parent);) h = s[h].Parent;
        switch (r.Type) {
            case"Boolean":
                n.t = "b", n.v = Oe(e);
                break;
            case"String":
                n.t = "s", n.r = Ae(Se(e)), n.v = -1 < e.indexOf("<") ? Se(t) : n.r;
                break;
            case"DateTime":
                "Z" != e.slice(-1) && (e += "Z"), n.v = (Q(e) - new Date(Date.UTC(1899, 11, 30))) / 864e5, n.v != n.v ? n.v = Se(e) : n.v < 60 && (n.v = n.v - 1), f && "General" != f || (f = "yyyy-mm-dd");
            case"Number":
                void 0 === n.v && (n.v = +e), n.t || (n.t = "n");
                break;
            case"Error":
                n.t = "e", n.v = Tr[e], !1 !== c.cellText && (n.w = e);
                break;
            default:
                n.t = "s", n.v = Ae(t || e)
        }
        if (yc(n, f, c), !1 !== c.cellFormula) if (n.Formula) {
            var m = Se(n.Formula);
            61 == m.charCodeAt(0) && (m = m.slice(1)), n.f = eo(m, a), delete n.Formula, "RC" == n.ArrayRange ? n.F = eo("RC:RC", a) : n.ArrayRange && (n.F = eo(n.ArrayRange, a), l.push([Jt(n.F), n.F]))
        } else for (p = 0; p < l.length; ++p) a.r >= l[p][0].s.r && a.r <= l[p][0].e.r && a.c >= l[p][0].s.c && a.c <= l[p][0].e.c && (n.F = l[p][1]);
        c.cellStyles && (d.forEach(function (e) {
            !u.patternType && e.patternType && (u.patternType = e.patternType)
        }), n.s = u), void 0 !== n.StyleID && (n.ixfe = n.StyleID)
    }

    function Tc(e) {
        if (ee && Buffer.isBuffer(e)) return e.toString("utf8");
        if ("string" == typeof e) return e;
        if ("undefined" != typeof Uint8Array && e instanceof Uint8Array) return Fe(l(g(e)));
        throw new Error("Bad input format: expected Buffer or string")
    }

    var kc = /<(\/?)([^\s?>!\/:]*:|)([^\s?>:\/]+)[^>]*>/gm;

    function xc(e, t) {
        var r = t || {};
        ce(de);
        var n = ne(Tc(e));
        "binary" != r.type && "array" != r.type && "base64" != r.type || (n = "undefined" != typeof cptable ? cptable.utils.decode(65001, re(n)) : Fe(n));
        var a, s = n.slice(0, 1024).toLowerCase(), i = !1;
        if (-1 == s.indexOf("<?xml") && ["html", "table", "head", "meta", "script", "style", "div"].forEach(function (e) {
            0 <= s.indexOf("<" + e) && (i = !0)
        }), i) return af.to_workbook(n, r);
        var o, l = [];
        null != ue && null == r.dense && (r.dense = ue);
        var c, f, h, u, d, p = {}, m = [], g = r.dense ? [] : {}, b = "", v = {}, E = {},
            w = wc('<Data ss:Type="String">'), S = 0, _ = 0, y = 0, C = {s: {r: 2e6, c: 2e6}, e: {r: 0, c: 0}}, B = {},
            T = {}, k = "", x = 0, A = [], I = {}, R = {}, O = 0, F = [], D = [], P = {}, N = [], L = !1, M = [],
            U = [], H = {}, z = 0, V = 0, W = {Sheets: [], WBProps: {date1904: !1}}, X = {};
        for (kc.lastIndex = 0, n = n.replace(/<!--([\s\S]*?)-->/gm, ""); a = kc.exec(n);) switch (a[3]) {
            case"Data":
                if (l[l.length - 1][1]) break;
                "/" === a[1] ? Bc(n.slice(S, a.index), k, w, "Comment" == l[l.length - 1][0] ? P : v, {
                    c: _,
                    r: y
                }, B, N[_], E, M, r) : (k = "", w = wc(a[0]), S = a.index + a[0].length);
                break;
            case"Cell":
                if ("/" === a[1]) if (0 < D.length && (v.c = D), (!r.sheetRows || r.sheetRows > y) && void 0 !== v.v && (r.dense ? (g[y] || (g[y] = []), g[y][_] = v) : g[Gt(_) + Xt(y)] = v), v.HRef && (v.l = {Target: v.HRef}, v.HRefScreenTip && (v.l.Tooltip = v.HRefScreenTip), delete v.HRef, delete v.HRefScreenTip), (v.MergeAcross || v.MergeDown) && (z = _ + (0 | parseInt(v.MergeAcross, 10)), V = y + (0 | parseInt(v.MergeDown, 10)), A.push({
                    s: {
                        c: _,
                        r: y
                    }, e: {c: z, r: V}
                })), r.sheetStubs) if (v.MergeAcross || v.MergeDown) {
                    for (var j = _; j <= z; ++j) for (var G = y; G <= V; ++G) (_ < j || y < G) && (r.dense ? (g[G] || (g[G] = []), g[G][j] = {t: "z"}) : g[Gt(j) + Xt(G)] = {t: "z"});
                    _ = z + 1
                } else ++_; else v.MergeAcross ? _ = z + 1 : ++_; else (v = Sc(a[0])).Index && (_ = v.Index - 1), _ < C.s.c && (C.s.c = _), _ > C.e.c && (C.e.c = _), "/>" === a[0].slice(-2) && ++_, D = [];
                break;
            case"Row":
                "/" === a[1] || "/>" === a[0].slice(-2) ? (y < C.s.r && (C.s.r = y), y > C.e.r && (C.e.r = y), "/>" === a[0].slice(-2) && (E = wc(a[0])).Index && (y = E.Index - 1), _ = 0, ++y) : ((E = wc(a[0])).Index && (y = E.Index - 1), H = {}, "0" != E.AutoFitHeight && !E.Height || (H.hpx = parseInt(E.Height, 10), H.hpt = li(H.hpx), U[y] = H), "1" == E.Hidden && (H.hidden = !0, U[y] = H));
                break;
            case"Worksheet":
                if ("/" === a[1]) {
                    if ((o = l.pop())[0] !== a[3]) throw new Error("Bad state: " + o.join("|"));
                    m.push(b), C.s.r <= C.e.r && C.s.c <= C.e.c && (g["!ref"] = Qt(C), r.sheetRows && r.sheetRows <= C.e.r && (g["!fullref"] = g["!ref"], C.e.r = r.sheetRows - 1, g["!ref"] = Qt(C))), A.length && (g["!merges"] = A), 0 < N.length && (g["!cols"] = N), 0 < U.length && (g["!rows"] = U), p[b] = g
                } else C = {
                    s: {r: 2e6, c: 2e6},
                    e: {r: 0, c: 0}
                }, y = _ = 0, l.push([a[3], !1]), o = wc(a[0]), b = Se(o.Name), g = r.dense ? [] : {}, A = [], M = [], U = [], X = {
                    name: b,
                    Hidden: 0
                }, W.Sheets.push(X);
                break;
            case"Table":
                if ("/" === a[1]) {
                    if ((o = l.pop())[0] !== a[3]) throw new Error("Bad state: " + o.join("|"))
                } else {
                    if ("/>" == a[0].slice(-2)) break;
                    wc(a[0]), l.push([a[3], !1]), L = !(N = [])
                }
                break;
            case"Style":
                "/" === a[1] ? Cc(B, T, r) : T = wc(a[0]);
                break;
            case"NumberFormat":
                T.nf = Se(wc(a[0]).Format || "General"), fe[T.nf] && (T.nf = fe[T.nf]);
                for (var $ = 0; 392 != $ && de._table[$] != T.nf; ++$) ;
                if (392 == $) for ($ = 57; 392 != $; ++$) if (null == de._table[$]) {
                    de.load(T.nf, $);
                    break
                }
                break;
            case"Column":
                if ("Table" !== l[l.length - 1][0]) break;
                if ((c = wc(a[0])).Hidden && (c.hidden = !0, delete c.Hidden), c.Width && (c.wpx = parseInt(c.Width, 10)), !L && 10 < c.wpx) {
                    L = !0, ei = Qs;
                    for (var Y = 0; Y < N.length; ++Y) N[Y] && ii(N[Y])
                }
                L && ii(c), N[c.Index - 1 || N.length] = c;
                for (var K = 0; K < +c.Span; ++K) N[N.length] = be(c);
                break;
            case"NamedRange":
                W.Names || (W.Names = []);
                var Z = ve(a[0]), Q = {Name: Z.Name, Ref: eo(Z.RefersTo.slice(1), {r: 0, c: 0})};
                0 < W.Sheets.length && (Q.Sheet = W.Sheets.length - 1), W.Names.push(Q);
                break;
            case"NamedCell":
            case"B":
            case"I":
            case"U":
            case"S":
            case"Sub":
            case"Sup":
            case"Span":
            case"Border":
            case"Alignment":
            case"Borders":
                break;
            case"Font":
                if ("/>" === a[0].slice(-2)) break;
                "/" === a[1] ? k += n.slice(x, a.index) : x = a.index + a[0].length;
                break;
            case"Interior":
                if (!r.cellStyles) break;
                T.Interior = wc(a[0]);
                break;
            case"Protection":
                break;
            case"Author":
            case"Title":
            case"Description":
            case"Created":
            case"Keywords":
            case"Subject":
            case"Category":
            case"Company":
            case"LastAuthor":
            case"LastSaved":
            case"LastPrinted":
            case"Version":
            case"Revision":
            case"TotalTime":
            case"HyperlinkBase":
            case"Manager":
            case"ContentStatus":
            case"Identifier":
            case"Language":
            case"AppName":
                if ("/>" === a[0].slice(-2)) break;
                "/" === a[1] ? (h = I, u = a[3], d = n.slice(O, a.index), h[u = En[u] || u] = d) : O = a.index + a[0].length;
                break;
            case"Paragraphs":
                break;
            case"Styles":
            case"Workbook":
                if ("/" === a[1]) {
                    if ((o = l.pop())[0] !== a[3]) throw new Error("Bad state: " + o.join("|"))
                } else l.push([a[3], !1]);
                break;
            case"Comment":
                if ("/" === a[1]) {
                    if ((o = l.pop())[0] !== a[3]) throw new Error("Bad state: " + o.join("|"));
                    (f = P).t = f.v || "", f.t = f.t.replace(/\r\n/g, "\n").replace(/\r/g, "\n"), f.v = f.w = f.ixfe = void 0, D.push(P)
                } else l.push([a[3], !1]), P = {a: (o = wc(a[0])).Author};
                break;
            case"AutoFilter":
                if ("/" === a[1]) {
                    if ((o = l.pop())[0] !== a[3]) throw new Error("Bad state: " + o.join("|"))
                } else if ("/" !== a[0].charAt(a[0].length - 2)) {
                    var J = wc(a[0]);
                    g["!autofilter"] = {ref: eo(J.Range).replace(/\$/g, "")}, l.push([a[3], !0])
                }
                break;
            case"Name":
                break;
            case"ComponentOptions":
            case"DocumentProperties":
            case"CustomDocumentProperties":
            case"OfficeDocumentSettings":
            case"PivotTable":
            case"PivotCache":
            case"Names":
            case"MapInfo":
            case"PageBreaks":
            case"QueryTable":
            case"DataValidation":
            case"Sorting":
            case"Schema":
            case"data":
            case"ConditionalFormatting":
            case"SmartTagType":
            case"SmartTags":
            case"ExcelWorkbook":
            case"WorkbookOptions":
            case"WorksheetOptions":
                if ("/" === a[1]) {
                    if ((o = l.pop())[0] !== a[3]) throw new Error("Bad state: " + o.join("|"))
                } else "/" !== a[0].charAt(a[0].length - 2) && l.push([a[3], !0]);
                break;
            default:
                if (0 == l.length && "document" == a[3]) return pf(n, r);
                if (0 == l.length && "UOF" == a[3]) return pf(n, r);
                var q = !0;
                switch (l[l.length - 1][0]) {
                    case"OfficeDocumentSettings":
                        switch (a[3]) {
                            case"AllowPNG":
                            case"RemovePersonalInformation":
                            case"DownloadComponents":
                            case"LocationOfComponents":
                            case"Colors":
                            case"Color":
                            case"Index":
                            case"RGB":
                            case"PixelsPerInch":
                            case"TargetScreenSize":
                            case"ReadOnlyRecommended":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"ComponentOptions":
                        switch (a[3]) {
                            case"Toolbar":
                            case"HideOfficeLogo":
                            case"SpreadsheetAutoFit":
                            case"Label":
                            case"Caption":
                            case"MaxHeight":
                            case"MaxWidth":
                            case"NextSheetNumber":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"ExcelWorkbook":
                        switch (a[3]) {
                            case"Date1904":
                                W.WBProps.date1904 = !0;
                                break;
                            case"WindowHeight":
                            case"WindowWidth":
                            case"WindowTopX":
                            case"WindowTopY":
                            case"TabRatio":
                            case"ProtectStructure":
                            case"ProtectWindows":
                            case"ActiveSheet":
                            case"DisplayInkNotes":
                            case"FirstVisibleSheet":
                            case"SupBook":
                            case"SheetName":
                            case"SheetIndex":
                            case"SheetIndexFirst":
                            case"SheetIndexLast":
                            case"Dll":
                            case"AcceptLabelsInFormulas":
                            case"DoNotSaveLinkValues":
                            case"Iteration":
                            case"MaxIterations":
                            case"MaxChange":
                            case"Path":
                            case"Xct":
                            case"Count":
                            case"SelectedSheets":
                            case"Calculation":
                            case"Uncalced":
                            case"StartupPrompt":
                            case"Crn":
                            case"ExternName":
                            case"Formula":
                            case"ColFirst":
                            case"ColLast":
                            case"WantAdvise":
                            case"Boolean":
                            case"Error":
                            case"Text":
                            case"OLE":
                            case"NoAutoRecover":
                            case"PublishObjects":
                            case"DoNotCalculateBeforeSave":
                            case"Number":
                            case"RefModeR1C1":
                            case"EmbedSaveSmartTags":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"WorkbookOptions":
                        switch (a[3]) {
                            case"OWCVersion":
                            case"Height":
                            case"Width":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"WorksheetOptions":
                        switch (a[3]) {
                            case"Visible":
                                if ("/>" !== a[0].slice(-2)) if ("/" === a[1]) switch (n.slice(O, a.index)) {
                                    case"SheetHidden":
                                        X.Hidden = 1;
                                        break;
                                    case"SheetVeryHidden":
                                        X.Hidden = 2
                                } else O = a.index + a[0].length;
                                break;
                            case"Header":
                                g["!margins"] || nl(g["!margins"] = {}, "xlml"), g["!margins"].header = ve(a[0]).Margin;
                                break;
                            case"Footer":
                                g["!margins"] || nl(g["!margins"] = {}, "xlml"), g["!margins"].footer = ve(a[0]).Margin;
                                break;
                            case"PageMargins":
                                var ee = ve(a[0]);
                                g["!margins"] || nl(g["!margins"] = {}, "xlml"), ee.Top && (g["!margins"].top = ee.Top), ee.Left && (g["!margins"].left = ee.Left), ee.Right && (g["!margins"].right = ee.Right), ee.Bottom && (g["!margins"].bottom = ee.Bottom);
                                break;
                            case"DisplayRightToLeft":
                                W.Views || (W.Views = []), W.Views[0] || (W.Views[0] = {}), W.Views[0].RTL = !0;
                                break;
                            case"Unsynced":
                            case"Print":
                            case"Panes":
                            case"Scale":
                            case"Pane":
                            case"Number":
                            case"Layout":
                            case"PageSetup":
                            case"Selected":
                            case"ProtectObjects":
                            case"EnableSelection":
                            case"ProtectScenarios":
                            case"ValidPrinterInfo":
                            case"HorizontalResolution":
                            case"VerticalResolution":
                            case"NumberofCopies":
                            case"ActiveRow":
                            case"ActiveCol":
                            case"ActivePane":
                            case"TopRowVisible":
                            case"TopRowBottomPane":
                            case"LeftColumnVisible":
                            case"LeftColumnRightPane":
                            case"FitToPage":
                            case"RangeSelection":
                            case"PaperSizeIndex":
                            case"PageLayoutZoom":
                            case"PageBreakZoom":
                            case"FilterOn":
                            case"DoNotDisplayGridlines":
                            case"SplitHorizontal":
                            case"SplitVertical":
                            case"FreezePanes":
                            case"FrozenNoSplit":
                            case"FitWidth":
                            case"FitHeight":
                            case"CommentsLayout":
                            case"Zoom":
                            case"LeftToRight":
                            case"Gridlines":
                            case"AllowSort":
                            case"AllowFilter":
                            case"AllowInsertRows":
                            case"AllowDeleteRows":
                            case"AllowInsertCols":
                            case"AllowDeleteCols":
                            case"AllowInsertHyperlinks":
                            case"AllowFormatCells":
                            case"AllowSizeCols":
                            case"AllowSizeRows":
                            case"NoSummaryRowsBelowDetail":
                            case"TabColorIndex":
                            case"DoNotDisplayHeadings":
                            case"ShowPageLayoutZoom":
                            case"NoSummaryColumnsRightDetail":
                            case"BlackAndWhite":
                            case"DoNotDisplayZeros":
                            case"DisplayPageBreak":
                            case"RowColHeadings":
                            case"DoNotDisplayOutline":
                            case"NoOrientation":
                            case"AllowUsePivotTables":
                            case"ZeroHeight":
                            case"ViewableRange":
                            case"Selection":
                            case"ProtectContents":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"PivotTable":
                    case"PivotCache":
                        switch (a[3]) {
                            case"ImmediateItemsOnDrop":
                            case"ShowPageMultipleItemLabel":
                            case"CompactRowIndent":
                            case"Location":
                            case"PivotField":
                            case"Orientation":
                            case"LayoutForm":
                            case"LayoutSubtotalLocation":
                            case"LayoutCompactRow":
                            case"Position":
                            case"PivotItem":
                            case"DataType":
                            case"DataField":
                            case"SourceName":
                            case"ParentField":
                            case"PTLineItems":
                            case"PTLineItem":
                            case"CountOfSameItems":
                            case"Item":
                            case"ItemType":
                            case"PTSource":
                            case"CacheIndex":
                            case"ConsolidationReference":
                            case"FileName":
                            case"Reference":
                            case"NoColumnGrand":
                            case"NoRowGrand":
                            case"BlankLineAfterItems":
                            case"Hidden":
                            case"Subtotal":
                            case"BaseField":
                            case"MapChildItems":
                            case"Function":
                            case"RefreshOnFileOpen":
                            case"PrintSetTitles":
                            case"MergeLabels":
                            case"DefaultVersion":
                            case"RefreshName":
                            case"RefreshDate":
                            case"RefreshDateCopy":
                            case"VersionLastRefresh":
                            case"VersionLastUpdate":
                            case"VersionUpdateableMin":
                            case"VersionRefreshableMin":
                            case"Calculation":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"PageBreaks":
                        switch (a[3]) {
                            case"ColBreaks":
                            case"ColBreak":
                            case"RowBreaks":
                            case"RowBreak":
                            case"ColStart":
                            case"ColEnd":
                            case"RowEnd":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"AutoFilter":
                        switch (a[3]) {
                            case"AutoFilterColumn":
                            case"AutoFilterCondition":
                            case"AutoFilterAnd":
                            case"AutoFilterOr":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"QueryTable":
                        switch (a[3]) {
                            case"Id":
                            case"AutoFormatFont":
                            case"AutoFormatPattern":
                            case"QuerySource":
                            case"QueryType":
                            case"EnableRedirections":
                            case"RefreshedInXl9":
                            case"URLString":
                            case"HTMLTables":
                            case"Connection":
                            case"CommandText":
                            case"RefreshInfo":
                            case"NoTitles":
                            case"NextId":
                            case"ColumnInfo":
                            case"OverwriteCells":
                            case"DoNotPromptForFile":
                            case"TextWizardSettings":
                            case"Source":
                            case"Number":
                            case"Decimal":
                            case"ThousandSeparator":
                            case"TrailingMinusNumbers":
                            case"FormatSettings":
                            case"FieldType":
                            case"Delimiters":
                            case"Tab":
                            case"Comma":
                            case"AutoFormatName":
                            case"VersionLastEdit":
                            case"VersionLastRefresh":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"Sorting":
                    case"ConditionalFormatting":
                    case"DataValidation":
                        switch (a[3]) {
                            case"Range":
                            case"Type":
                            case"Min":
                            case"Max":
                            case"Sort":
                            case"Descending":
                            case"Order":
                            case"CaseSensitive":
                            case"Value":
                            case"ErrorStyle":
                            case"ErrorMessage":
                            case"ErrorTitle":
                            case"CellRangeList":
                            case"InputMessage":
                            case"InputTitle":
                            case"ComboHide":
                            case"InputHide":
                            case"Condition":
                            case"Qualifier":
                            case"UseBlank":
                            case"Value1":
                            case"Value2":
                            case"Format":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"MapInfo":
                    case"Schema":
                    case"data":
                        switch (a[3]) {
                            case"Map":
                            case"Entry":
                            case"Range":
                            case"XPath":
                            case"Field":
                            case"XSDType":
                            case"FilterOn":
                            case"Aggregate":
                            case"ElementType":
                            case"AttributeType":
                                break;
                            case"schema":
                            case"element":
                            case"complexType":
                            case"datatype":
                            case"all":
                            case"attribute":
                            case"extends":
                            case"row":
                                break;
                            default:
                                q = !1
                        }
                        break;
                    case"SmartTags":
                        break;
                    default:
                        q = !1
                }
                if (q) break;
                if (!l[l.length - 1][1]) throw"Unrecognized tag: " + a[3] + "|" + l.join("|");
                if ("CustomDocumentProperties" === l[l.length - 1][0]) {
                    if ("/>" === a[0].slice(-2)) break;
                    "/" === a[1] ? _c(R, a[3], F, n.slice(O, a.index)) : O = (F = a).index + a[0].length;
                    break
                }
                if (r.WTF) throw"Unrecognized tag: " + a[3] + "|" + l.join("|")
        }
        var te = {};
        return r.bookSheets || r.bookProps || (te.Sheets = p), te.SheetNames = m, te.Workbook = W, te.SSF = de.get_table(), te.Props = I, te.Custprops = R, te
    }

    function Ac(e, t) {
        switch (Of(t = t || {}), t.type || "base64") {
            case"base64":
                return xc(q.decode(e), t);
            case"binary":
            case"buffer":
            case"file":
                return xc(e, t);
            case"array":
                return xc(l(e), t)
        }
    }

    function Ic(e, t) {
        var r, n, a, s, i, o, l, c, f = [];
        return e.Props && f.push((r = e.Props, n = t, a = [], ge(vn).map(function (e) {
            for (var t = 0; t < on.length; ++t) if (on[t][1] == e) return on[t];
            for (t = 0; t < un.length; ++t) if (un[t][1] == e) return un[t];
            throw e
        }).forEach(function (e) {
            if (null != r[e[1]]) {
                var t = n && n.Props && null != n.Props[e[1]] ? n.Props[e[1]] : r[e[1]];
                switch (e[2]) {
                    case"date":
                        t = new Date(t).toISOString().replace(/\.\d*Z/, "Z")
                }
                "number" == typeof t ? t = String(t) : !0 === t || !1 === t ? t = t ? "1" : "0" : t instanceof Date && (t = new Date(t).toISOString().replace(/\.\d*Z/, "")), a.push(Ye(vn[e[1]] || e[1], t))
            }
        }), Ze("DocumentProperties", a.join(""), {xmlns: qe.o}))), e.Custprops && f.push((s = e.Props, i = e.Custprops, o = ["Worksheets", "SheetNames"], l = "CustomDocumentProperties", c = [], s && ge(s).forEach(function (e) {
            if (s.hasOwnProperty(e)) {
                for (var t = 0; t < on.length; ++t) if (e == on[t][1]) return;
                for (t = 0; t < un.length; ++t) if (e == un[t][1]) return;
                for (t = 0; t < o.length; ++t) if (e == o[t]) return;
                var r = s[e], n = "string";
                r = "number" == typeof r ? (n = "float", String(r)) : !0 === r || !1 === r ? (n = "boolean", r ? "1" : "0") : String(r), c.push(Ze(Be(e), r, {"dt:dt": n}))
            }
        }), i && ge(i).forEach(function (e) {
            if (i.hasOwnProperty(e) && (!s || !s.hasOwnProperty(e))) {
                var t = i[e], r = "string";
                t = "number" == typeof t ? (r = "float", String(t)) : !0 === t || !1 === t ? (r = "boolean", t ? "1" : "0") : t instanceof Date ? (r = "dateTime.tz", t.toISOString()) : String(t), c.push(Ze(Be(e), t, {"dt:dt": r}))
            }
        }), "<" + l + ' xmlns="' + qe.o + '">' + c.join("") + "</" + l + ">")), f.join("")
    }

    function Rc(e) {
        return Ze("NamedRange", null, {"ss:Name": e.Name, "ss:RefersTo": "=" + no(e.Ref, {r: 0, c: 0})})
    }

    function Oc(e, t, r, n, a, s, i) {
        if (!e || null == e.v && null == e.f) return "";
        var o = {};
        if (e.f && (o["ss:Formula"] = "=" + Ce(no(e.f, i))), e.F && e.F.slice(0, t.length) == t) {
            var l = Yt(e.F.slice(t.length + 1));
            o["ss:ArrayRange"] = "RC:R" + (l.r == i.r ? "" : "[" + (l.r - i.r) + "]") + "C" + (l.c == i.c ? "" : "[" + (l.c - i.c) + "]")
        }
        if (e.l && e.l.Target && (o["ss:HRef"] = Ce(e.l.Target), e.l.Tooltip && (o["x:HRefScreenTip"] = Ce(e.l.Tooltip))), r["!merges"]) for (var c = r["!merges"], f = 0; f != c.length; ++f) c[f].s.c == i.c && c[f].s.r == i.r && (c[f].e.c > c[f].s.c && (o["ss:MergeAcross"] = c[f].e.c - c[f].s.c), c[f].e.r > c[f].s.r && (o["ss:MergeDown"] = c[f].e.r - c[f].s.r));
        var h = "", u = "";
        switch (e.t) {
            case"z":
                return "";
            case"n":
                h = "Number", u = String(e.v);
                break;
            case"b":
                h = "Boolean", u = e.v ? "1" : "0";
                break;
            case"e":
                h = "Error", u = Br[e.v];
                break;
            case"d":
                h = "DateTime", u = new Date(e.v).toISOString(), null == e.z && (e.z = e.z || de._table[14]);
                break;
            case"s":
                h = "String", u = ((e.v || "") + "").replace(_e, function (e) {
                    return we[e]
                }).replace(Te, function (e) {
                    return "&#x" + e.charCodeAt(0).toString(16).toUpperCase() + ";"
                })
        }
        var d = al(n.cellXfs, e, n);
        o["ss:StyleID"] = "s" + (21 + d), o["ss:Index"] = i.c + 1;
        var p = '<Data ss:Type="' + h + '">' + (null != e.v ? u : "") + "</Data>";
        return 0 < (e.c || []).length && (p += e.c.map(function (e) {
            var t = Ze("ss:Data", Re(e.t || ""), {xmlns: "http://www.w3.org/TR/REC-html40"});
            return Ze("Comment", t, {"ss:Author": e.a})
        }).join("")), Ze("Cell", p, o)
    }

    function Fc(e, t, r) {
        var n = [], a = r.SheetNames[e], s = r.Sheets[a], i = s ? function (e, t, r) {
            if (!e) return "";
            if (!((r || {}).Workbook || {}).Names) return "";
            for (var n = r.Workbook.Names, a = [], s = 0; s < n.length; ++s) {
                var i = n[s];
                i.Sheet == t && (i.Name.match(/^_xlfn\./) || a.push(Rc(i)))
            }
            return a.join("")
        }(s, e, r) : "";
        return 0 < i.length && n.push("<Names>" + i + "</Names>"), 0 < (i = s ? function (e, t) {
            if (!e["!ref"]) return "";
            var r = Jt(e["!ref"]), n = e["!merges"] || [], a = 0, s = [];
            e["!cols"] && e["!cols"].forEach(function (e, t) {
                ii(e);
                var r = !!e.width, n = rl(t, e), a = {"ss:Index": t + 1};
                r && (a["ss:Width"] = ti(n.width)), e.hidden && (a["ss:Hidden"] = "1"), s.push(Ze("Column", null, a))
            });
            for (var i, o, l, c = Array.isArray(e), f = r.s.r; f <= r.e.r; ++f) {
                for (var h = [(i = f, o = (e["!rows"] || [])[f], l = void 0, l = '<Row ss:Index="' + (i + 1) + '"', o && (o.hpt && !o.hpx && (o.hpx = ci(o.hpt)), o.hpx && (l += ' ss:AutoFitHeight="0" ss:Height="' + o.hpx + '"'), o.hidden && (l += ' ss:Hidden="1"')), l + ">")], u = r.s.c; u <= r.e.c; ++u) {
                    var d = !1;
                    for (a = 0; a != n.length; ++a) if (!(n[a].s.c > u || n[a].s.r > f || n[a].e.c < u || n[a].e.r < f)) {
                        n[a].s.c == u && n[a].s.r == f || (d = !0);
                        break
                    }
                    if (!d) {
                        var p = {r: f, c: u}, m = Kt(p), g = c ? (e[f] || [])[u] : e[m];
                        h.push(Oc(g, m, e, t, 0, 0, p))
                    }
                }
                h.push("</Row>"), 2 < h.length && s.push(h.join(""))
            }
            return s.join("")
        }(s, t) : "").length && n.push("<Table>" + i + "</Table>"), n.push(function (t, e, r) {
            if (!t) return "";
            var n = [];
            if (t["!margins"] && (n.push("<PageSetup>"), t["!margins"].header && n.push(Ze("Header", null, {"x:Margin": t["!margins"].header})), t["!margins"].footer && n.push(Ze("Footer", null, {"x:Margin": t["!margins"].footer})), n.push(Ze("PageMargins", null, {
                "x:Bottom": t["!margins"].bottom || "0.75",
                "x:Left": t["!margins"].left || "0.7",
                "x:Right": t["!margins"].right || "0.7",
                "x:Top": t["!margins"].top || "0.75"
            })), n.push("</PageSetup>")), r && r.Workbook && r.Workbook.Sheets && r.Workbook.Sheets[e]) if (r.Workbook.Sheets[e].Hidden) n.push(Ze("Visible", 1 == r.Workbook.Sheets[e].Hidden ? "SheetHidden" : "SheetVeryHidden", {})); else {
                for (var a = 0; a < e && (!r.Workbook.Sheets[a] || r.Workbook.Sheets[a].Hidden); ++a) ;
                a == e && n.push("<Selected/>")
            }
            return ((((r || {}).Workbook || {}).Views || [])[0] || {}).RTL && n.push("<DisplayRightToLeft/>"), t["!protect"] && (n.push(Ye("ProtectContents", "True")), t["!protect"].objects && n.push(Ye("ProtectObjects", "True")), t["!protect"].scenarios && n.push(Ye("ProtectScenarios", "True")), null == t["!protect"].selectLockedCells || t["!protect"].selectLockedCells ? null == t["!protect"].selectUnlockedCells || t["!protect"].selectUnlockedCells || n.push(Ye("EnableSelection", "UnlockedCells")) : n.push(Ye("EnableSelection", "NoSelection")), [["formatCells", "AllowFormatCells"], ["formatColumns", "AllowSizeCols"], ["formatRows", "AllowSizeRows"], ["insertColumns", "AllowInsertCols"], ["insertRows", "AllowInsertRows"], ["insertHyperlinks", "AllowInsertHyperlinks"], ["deleteColumns", "AllowDeleteCols"], ["deleteRows", "AllowDeleteRows"], ["sort", "AllowSort"], ["autoFilter", "AllowFilter"], ["pivotTables", "AllowUsePivotTables"]].forEach(function (e) {
                t["!protect"][e[0]] && n.push("<" + e[1] + "/>")
            })), 0 == n.length ? "" : Ze("WorksheetOptions", n.join(""), {xmlns: qe.x})
        }(s, e, r)), n.join("")
    }

    function Dc(e, t) {
        t = t || {}, e.SSF || (e.SSF = de.get_table()), e.SSF && (ce(de), de.load_table(e.SSF), t.revssf = C(e.SSF), t.revssf[e.SSF[65535]] = 0, t.ssf = e.SSF, t.cellXfs = [], al(t.cellXfs, {}, {revssf: {General: 0}}));
        var n, r = [];
        r.push(Ic(e, t)), r.push(""), r.push(""), r.push("");
        for (var a = 0; a < e.SheetNames.length; ++a) r.push(Ze("Worksheet", Fc(a, t, e), {"ss:Name": Ce(e.SheetNames[a])}));
        return r[2] = (n = ['<Style ss:ID="Default" ss:Name="Normal"><NumberFormat/></Style>'], t.cellXfs.forEach(function (e, t) {
            var r = [];
            r.push(Ze("NumberFormat", null, {"ss:Format": Ce(de._table[e.numFmtId])})), n.push(Ze("Style", r.join(""), {"ss:ID": "s" + (21 + t)}))
        }), Ze("Styles", n.join(""))), r[3] = function (e) {
            if (!((e || {}).Workbook || {}).Names) return "";
            for (var t = e.Workbook.Names, r = [], n = 0; n < t.length; ++n) {
                var a = t[n];
                null == a.Sheet && (a.Name.match(/^_xlfn\./) || r.push(Rc(a)))
            }
            return Ze("Names", r.join(""))
        }(e), z + Ze("Workbook", r.join(""), {
            xmlns: qe.ss,
            "xmlns:o": qe.o,
            "xmlns:x": qe.x,
            "xmlns:ss": qe.ss,
            "xmlns:dt": qe.dt,
            "xmlns:html": qe.html
        })
    }

    function Pc(e) {
        var t = {}, r = e.content;
        if (r.l = 28, t.AnsiUserType = r.read_shift(0, "lpstr-ansi"), t.AnsiClipboardFormat = xr(r, 1), r.length - r.l <= 4) return t;
        var n = r.read_shift(4);
        return 0 == n || 40 < n ? t : (r.l -= 4, t.Reserved1 = r.read_shift(0, "lpstr-ansi"), r.length - r.l <= 4 || 1907505652 !== (n = r.read_shift(4)) ? t : (t.UnicodeClipboardFormat = xr(r, 2), 0 == (n = r.read_shift(4)) || 40 < n ? t : (r.l -= 4, void (t.Reserved2 = r.read_shift(0, "lpwstr")))))
    }

    function Nc(e, t, r, n) {
        var a = r, s = [], i = t.slice(t.l, t.l + a);
        if (n && n.enc && n.enc.insitu) switch (e.n) {
            case"BOF":
            case"FilePass":
            case"FileLock":
            case"InterfaceHdr":
            case"RRDInfo":
            case"RRDHead":
            case"UsrExcl":
                break;
            default:
                if (0 === i.length) break;
                n.enc.insitu(i)
        }
        s.push(i), t.l += a;
        for (var o = jc[_t(t, t.l)], l = 0; null != o && "Continue" === o.n.slice(0, 8);) a = _t(t, t.l + 2), l = t.l + 4, "ContinueFrt" == o.n ? l += 4 : "ContinueFrt" == o.n.slice(0, 11) && (l += 12), s.push(t.slice(l, t.l + 4 + a)), t.l += 4 + a, o = jc[_t(t, t.l)];
        var c = ie(s);
        Ft(c, 0);
        var f = 0;
        c.lens = [];
        for (var h = 0; h < s.length; ++h) c.lens.push(f), f += s[h].length;
        return e.f(c, c.length, n)
    }

    function Lc(e, t, r) {
        if ("z" !== e.t && e.XF) {
            var n = 0;
            try {
                n = e.z || e.XF.numFmtId || 0, t.cellNF && (e.z = de._table[n])
            } catch (e) {
                if (t.WTF) throw e
            }
            if (!t || !1 !== t.cellText) try {
                "e" === e.t ? e.w = e.w || Br[e.v] : 0 === n || "General" == n ? "n" === e.t ? (0 | e.v) === e.v ? e.w = de._general_int(e.v) : e.w = de._general_num(e.v) : e.w = de._general(e.v) : e.w = de.format(n, e.v, {date1904: !!r})
            } catch (e) {
                if (t.WTF) throw e
            }
            if (t.cellDates && n && "n" == e.t && de.is_date(de._table[n] || String(n))) {
                var a = de.parse_date_code(e.v);
                a && (e.t = "d", e.v = new Date(a.y, a.m - 1, a.d, a.H, a.M, a.S, a.u))
            }
        }
    }

    function Mc(e, t, r) {
        return {v: e, ixfe: t, t: r}
    }

    function Uc(e, t) {
        var r = {opts: {}}, n = {};
        null != ue && null == t.dense && (t.dense = ue);

        function l(e) {
            return !(e < 8) && e < 64 && T[e - 8] || Vr[e]
        }

        function a(e, t, r) {
            if (!(1 < M) && (r.sheetRows && e.r >= r.sheetRows && (C = !1), C)) {
                var n, a, s, i;
                if (r.cellStyles && t.XF && t.XF.data && (a = r, (i = (n = t).XF.data) && i.patternType && a && a.cellStyles && (n.s = {}, n.s.patternType = i.patternType, (s = Ks(l(i.icvFore))) && (n.s.fgColor = {rgb: s}), (s = Ks(l(i.icvBack))) && (n.s.bgColor = {rgb: s}))), delete t.ixfe, delete t.XF, S = Kt(c = e), g && g.s && g.e || (g = {
                    s: {
                        r: 0,
                        c: 0
                    }, e: {r: 0, c: 0}
                }), e.r < g.s.r && (g.s.r = e.r), e.c < g.s.c && (g.s.c = e.c), e.r + 1 > g.e.r && (g.e.r = e.r + 1), e.c + 1 > g.e.c && (g.e.c = e.c + 1), r.cellFormula && t.f) for (var o = 0; o < y.length; ++o) if (!(y[o][0].s.c > e.c || y[o][0].s.r > e.r || y[o][0].e.c < e.c || y[o][0].e.r < e.r)) {
                    t.F = Qt(y[o][0]), y[o][0].s.c == e.c && y[o][0].s.r == e.r || delete t.f, t.f && (t.f = "" + Uo(y[o][1], 0, e, P, A));
                    break
                }
                r.dense ? (p[e.r] || (p[e.r] = []), p[e.r][e.c] = t) : p[S] = t
            }
        }

        var c, s, i, o, f, h, u, d, p = t.dense ? [] : {}, m = {}, g = {}, b = null, v = [], E = "", w = {}, S = "",
            _ = {}, y = [], C = !0, B = [], T = [], k = {Sheets: [], WBProps: {date1904: !1}, Views: [{}]}, x = {},
            A = {
                enc: !1,
                sbcch: 0,
                snames: [],
                sharedf: _,
                arrayf: y,
                rrtabid: [],
                lastuser: "",
                biff: 8,
                codepage: 0,
                winlocked: 0,
                cellStyles: !!t && !!t.cellStyles,
                WTF: !!t && !!t.wtf
            };
        t.password && (A.password = t.password);
        var I = [], R = [], O = [], F = [], D = !1, P = [];
        P.SheetNames = A.snames, P.sharedf = A.sharedf, P.arrayf = A.arrayf, P.names = [], P.XTI = [];
        var N, L = "", M = 0, U = 0, H = [], z = [];
        A.codepage = 1200, he(1200);
        for (var V = !1; e.l < e.length - 1;) {
            var W = e.l, X = e.read_shift(2);
            if (0 === X && "EOF" === L) break;
            var j = e.l === e.length ? 0 : e.read_shift(2), G = jc[X];
            if (G && G.f) {
                if (t.bookSheets && "BoundSheet8" === L && "BoundSheet8" !== G.n) break;
                if (L = G.n, 2 === G.r || 12 == G.r) {
                    var $ = e.read_shift(2);
                    if (j -= 2, !A.enc && $ !== X && ((255 & $) << 8 | $ >> 8) !== X) throw new Error("rt mismatch: " + $ + "!=" + X);
                    12 == G.r && (e.l += 10, j -= 10)
                }
                var Y;
                Y = "EOF" === G.n ? G.f(e, j, A) : Nc(G, e, j, A);
                var K = G.n;
                if (0 == M && "BOF" != K) continue;
                switch (K) {
                    case"Date1904":
                        r.opts.Date1904 = k.WBProps.date1904 = Y;
                        break;
                    case"WriteProtect":
                        r.opts.WriteProtect = !0;
                        break;
                    case"FilePass":
                        if (A.enc || (e.l = 0), A.enc = Y, !t.password) throw new Error("File is password-protected");
                        if (null == Y.valid) throw new Error("Encryption scheme unsupported");
                        if (!Y.valid) throw new Error("Password is incorrect");
                        break;
                    case"WriteAccess":
                        A.lastuser = Y;
                        break;
                    case"FileSharing":
                        break;
                    case"CodePage":
                        switch (Y) {
                            case 21010:
                                Y = 1200;
                                break;
                            case 32768:
                                Y = 1e4;
                                break;
                            case 32769:
                                Y = 1252
                        }
                        he(A.codepage = Y), V = !0;
                        break;
                    case"RRTabId":
                        A.rrtabid = Y;
                        break;
                    case"WinProtect":
                        A.winlocked = Y;
                        break;
                    case"Template":
                    case"BookBool":
                    case"UsesELFs":
                    case"MTRSettings":
                        break;
                    case"RefreshAll":
                    case"CalcCount":
                    case"CalcDelta":
                    case"CalcIter":
                    case"CalcMode":
                    case"CalcPrecision":
                    case"CalcSaveRecalc":
                        r.opts[K] = Y;
                        break;
                    case"CalcRefMode":
                        A.CalcRefMode = Y;
                        break;
                    case"Uncalced":
                        break;
                    case"ForceFullCalculation":
                        r.opts.FullCalc = Y;
                        break;
                    case"WsBool":
                        Y.fDialog && (p["!type"] = "dialog");
                        break;
                    case"XF":
                        B.push(Y);
                        break;
                    case"ExtSST":
                    case"BookExt":
                    case"RichTextStream":
                    case"BkHim":
                        break;
                    case"SupBook":
                        P.push([Y]), P[P.length - 1].XTI = [];
                        break;
                    case"ExternName":
                        P[P.length - 1].push(Y);
                        break;
                    case"Index":
                        break;
                    case"Lbl":
                        N = {
                            Name: Y.Name,
                            Ref: Uo(Y.rgce, 0, null, P, A)
                        }, 0 < Y.itab && (N.Sheet = Y.itab - 1), P.names.push(N), P[0] || (P[0] = [], P[0].XTI = []), P[P.length - 1].push(Y), "_xlnm._FilterDatabase" == Y.Name && 0 < Y.itab && Y.rgce && Y.rgce[0] && Y.rgce[0][0] && "PtgArea3d" == Y.rgce[0][0][0] && (z[Y.itab - 1] = {ref: Qt(Y.rgce[0][0][1][2])});
                        break;
                    case"ExternCount":
                        A.ExternCount = Y;
                        break;
                    case"ExternSheet":
                        0 == P.length && (P[0] = [], P[0].XTI = []), P[P.length - 1].XTI = P[P.length - 1].XTI.concat(Y), P.XTI = P.XTI.concat(Y);
                        break;
                    case"NameCmt":
                        if (A.biff < 8) break;
                        null != N && (N.Comment = Y[1]);
                        break;
                    case"Protect":
                        p["!protect"] = Y;
                        break;
                    case"Password":
                        0 !== Y && A.WTF && console.error("Password verifier: " + Y);
                        break;
                    case"Prot4Rev":
                    case"Prot4RevPass":
                        break;
                    case"BoundSheet8":
                        m[Y.pos] = Y, A.snames.push(Y.name);
                        break;
                    case"EOF":
                        if (--M) break;
                        if (g.e) {
                            if (0 < g.e.r && 0 < g.e.c) {
                                if (g.e.r--, g.e.c--, p["!ref"] = Qt(g), t.sheetRows && t.sheetRows <= g.e.r) {
                                    var Z = g.e.r;
                                    g.e.r = t.sheetRows - 1, p["!fullref"] = p["!ref"], p["!ref"] = Qt(g), g.e.r = Z
                                }
                                g.e.r++, g.e.c++
                            }
                            0 < I.length && (p["!merges"] = I), 0 < R.length && (p["!objects"] = R), 0 < O.length && (p["!cols"] = O), 0 < F.length && (p["!rows"] = F), k.Sheets.push(x)
                        }
                        "" === E ? w = p : n[E] = p, p = t.dense ? [] : {};
                        break;
                    case"BOF":
                        if (8 === A.biff && (A.biff = {9: 2, 521: 3, 1033: 4}[X] || {
                            512: 2,
                            768: 3,
                            1024: 4,
                            1280: 5,
                            1536: 8,
                            2: 2,
                            7: 2
                        }[Y.BIFFVer] || 8), 8 == A.biff && 0 == Y.BIFFVer && 16 == Y.dt && (A.biff = 2), M++) break;
                        if (C = !0, p = t.dense ? [] : {}, A.biff < 8 && !V && (V = !0, he(A.codepage = t.codepage || 1252)), A.biff < 5) {
                            "" === E && (E = "Sheet1"), g = {s: {r: 0, c: 0}, e: {r: 0, c: 0}};
                            var Q = {pos: e.l - j, name: E};
                            m[Q.pos] = Q, A.snames.push(E)
                        } else E = (m[W] || {name: ""}).name;
                        32 == Y.dt && (p["!type"] = "chart"), 64 == Y.dt && (p["!type"] = "macro"), I = [], R = [], A.arrayf = y = [], O = [], 0, D = !(F = []), x = {
                            Hidden: (m[W] || {hs: 0}).hs,
                            name: E
                        };
                        break;
                    case"Number":
                    case"BIFF2NUM":
                    case"BIFF2INT":
                        "chart" == p["!type"] && (t.dense ? (p[Y.r] || [])[Y.c] : p[Kt({
                            c: Y.c,
                            r: Y.r
                        })]) && ++Y.c, h = {
                            ixfe: Y.ixfe,
                            XF: B[Y.ixfe] || {},
                            v: Y.val,
                            t: "n"
                        }, 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({c: Y.c, r: Y.r}, h, t);
                        break;
                    case"BoolErr":
                        h = {
                            ixfe: Y.ixfe,
                            XF: B[Y.ixfe],
                            v: Y.val,
                            t: Y.t
                        }, 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({c: Y.c, r: Y.r}, h, t);
                        break;
                    case"RK":
                        h = {
                            ixfe: Y.ixfe,
                            XF: B[Y.ixfe],
                            v: Y.rknum,
                            t: "n"
                        }, 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({c: Y.c, r: Y.r}, h, t);
                        break;
                    case"MulRk":
                        for (var J = Y.c; J <= Y.C; ++J) {
                            var q = Y.rkrec[J - Y.c][0];
                            h = {
                                ixfe: q,
                                XF: B[q],
                                v: Y.rkrec[J - Y.c][1],
                                t: "n"
                            }, 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({c: J, r: Y.r}, h, t)
                        }
                        break;
                    case"Formula":
                        if ("String" == Y.val) {
                            b = Y;
                            break
                        }
                        if ((h = Mc(Y.val, Y.cell.ixfe, Y.tt)).XF = B[h.ixfe], t.cellFormula) {
                            var ee = Y.formula;
                            if (ee && ee[0] && ee[0][0] && "PtgExp" == ee[0][0][0]) {
                                var te = ee[0][0][1][0], re = ee[0][0][1][1], ne = Kt({r: te, c: re});
                                _[ne] ? h.f = "" + Uo(Y.formula, 0, Y.cell, P, A) : h.F = ((t.dense ? (p[te] || [])[re] : p[ne]) || {}).F
                            } else h.f = "" + Uo(Y.formula, 0, Y.cell, P, A)
                        }
                        0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a(Y.cell, h, t), b = Y;
                        break;
                    case"String":
                        if (!b) throw new Error("String record expects Formula");
                        (h = Mc(b.val = Y, b.cell.ixfe, "s")).XF = B[h.ixfe], t.cellFormula && (h.f = "" + Uo(b.formula, 0, b.cell, P, A)), 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a(b.cell, h, t), b = null;
                        break;
                    case"Array":
                        y.push(Y);
                        var ae = Kt(Y[0].s);
                        if (s = t.dense ? (p[Y[0].s.r] || [])[Y[0].s.c] : p[ae], t.cellFormula && s) {
                            if (!b) break;
                            if (!ae || !s) break;
                            s.f = "" + Uo(Y[1], 0, Y[0], P, A), s.F = Qt(Y[0])
                        }
                        break;
                    case"ShrFmla":
                        if (!C) break;
                        if (!t.cellFormula) break;
                        if (S) {
                            if (!b) break;
                            _[Kt(b.cell)] = Y[0], ((s = t.dense ? (p[b.cell.r] || [])[b.cell.c] : p[Kt(b.cell)]) || {}).f = "" + Uo(Y[0], 0, c, P, A)
                        }
                        break;
                    case"LabelSst":
                        (h = Mc(v[Y.isst].t, Y.ixfe, "s")).XF = B[h.ixfe], 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({
                            c: Y.c,
                            r: Y.r
                        }, h, t);
                        break;
                    case"Blank":
                        t.sheetStubs && (h = {
                            ixfe: Y.ixfe,
                            XF: B[Y.ixfe],
                            t: "z"
                        }, 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({c: Y.c, r: Y.r}, h, t));
                        break;
                    case"MulBlank":
                        if (t.sheetStubs) for (var se = Y.c; se <= Y.C; ++se) {
                            var ie = Y.ixfe[se - Y.c];
                            h = {
                                ixfe: ie,
                                XF: B[ie],
                                t: "z"
                            }, 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({c: se, r: Y.r}, h, t)
                        }
                        break;
                    case"RString":
                    case"Label":
                    case"BIFF2STR":
                        (h = Mc(Y.val, Y.ixfe, "s")).XF = B[h.ixfe], 0 < U && (h.z = H[h.ixfe >> 8 & 31]), Lc(h, t, r.opts.Date1904), a({
                            c: Y.c,
                            r: Y.r
                        }, h, t);
                        break;
                    case"Dimensions":
                        1 === M && (g = Y);
                        break;
                    case"SST":
                        v = Y;
                        break;
                    case"Format":
                        if (4 == A.biff) {
                            H[U++] = Y[1];
                            for (var oe = 0; oe < U + 163 && de._table[oe] != Y[1]; ++oe) ;
                            163 <= oe && de.load(Y[1], U + 163)
                        } else de.load(Y[1], Y[0]);
                        break;
                    case"BIFF2FORMAT":
                        H[U++] = Y;
                        for (var le = 0; le < U + 163 && de._table[le] != Y; ++le) ;
                        163 <= le && de.load(Y, U + 163);
                        break;
                    case"MergeCells":
                        I = I.concat(Y);
                        break;
                    case"Obj":
                        R[Y.cmo[0]] = A.lastobj = Y;
                        break;
                    case"TxO":
                        A.lastobj.TxO = Y;
                        break;
                    case"ImData":
                        A.lastobj.ImData = Y;
                        break;
                    case"HLink":
                        for (f = Y[0].s.r; f <= Y[0].e.r; ++f) for (o = Y[0].s.c; o <= Y[0].e.c; ++o) (s = t.dense ? (p[f] || [])[o] : p[Kt({
                            c: o,
                            r: f
                        })]) && (s.l = Y[1]);
                        break;
                    case"HLinkTooltip":
                        for (f = Y[0].s.r; f <= Y[0].e.r; ++f) for (o = Y[0].s.c; o <= Y[0].e.c; ++o) (s = t.dense ? (p[f] || [])[o] : p[Kt({
                            c: o,
                            r: f
                        })]) && s.l && (s.l.Tooltip = Y[1]);
                        break;
                    case"Note":
                        if (A.biff <= 5 && 2 <= A.biff) break;
                        s = t.dense ? (p[Y[0].r] || [])[Y[0].c] : p[Kt(Y[0])];
                        var ce = R[Y[2]];
                        if (!s) break;
                        s.c || (s.c = []), i = {a: Y[1], t: ce.TxO.t}, s.c.push(i);
                        break;
                    default:
                        switch (G.n) {
                            case"ClrtClient":
                                break;
                            case"XFExt":
                                B[Y.ixfe], Y.ext.forEach(function (e) {
                                    e[0]
                                });
                                break;
                            case"DefColWidth":
                                0;
                                break;
                            case"DefaultRowHeight":
                                Y[1];
                                break;
                            case"ColInfo":
                                if (!A.cellStyles) break;
                                for (; Y.e >= Y.s;) O[Y.e--] = {width: Y.w / 256}, D || (D = !0, si(Y.w / 256)), ii(O[Y.e + 1]);
                                break;
                            case"Row":
                                var fe = {};
                                null != Y.level && ((F[Y.r] = fe).level = Y.level), Y.hidden && ((F[Y.r] = fe).hidden = !0), Y.hpt && ((F[Y.r] = fe).hpt = Y.hpt, fe.hpx = ci(Y.hpt));
                                break;
                            case"LeftMargin":
                            case"RightMargin":
                            case"TopMargin":
                            case"BottomMargin":
                                p["!margins"] || nl(p["!margins"] = {}), p["!margins"][K.slice(0, -6).toLowerCase()] = Y;
                                break;
                            case"Setup":
                                p["!margins"] || nl(p["!margins"] = {}), p["!margins"].header = Y.header, p["!margins"].footer = Y.footer;
                                break;
                            case"Window2":
                                Y.RTL && (k.Views[0].RTL = !0);
                                break;
                            case"Header":
                            case"Footer":
                            case"HCenter":
                            case"VCenter":
                            case"Pls":
                            case"GCW":
                            case"LHRecord":
                            case"DBCell":
                            case"EntExU2":
                            case"SxView":
                            case"Sxvd":
                            case"SXVI":
                            case"SXVDEx":
                            case"SxIvd":
                            case"SXString":
                            case"Sync":
                            case"Addin":
                            case"SXDI":
                            case"SXLI":
                            case"SXEx":
                            case"QsiSXTag":
                            case"Selection":
                            case"Feat":
                                break;
                            case"FeatHdr":
                            case"FeatHdr11":
                                break;
                            case"Feature11":
                            case"Feature12":
                            case"List12":
                                break;
                            case"Country":
                                u = Y;
                                break;
                            case"RecalcId":
                            case"DxGCol":
                                break;
                            case"Fbi":
                            case"Fbi2":
                            case"GelFrame":
                            case"Font":
                            case"XFCRC":
                            case"Style":
                            case"StyleExt":
                                break;
                            case"Palette":
                                T = Y;
                                break;
                            case"Theme":
                                d = Y;
                                break;
                            case"ScenarioProtect":
                            case"ObjProtect":
                            case"CondFmt12":
                            case"Table":
                            case"TableStyles":
                            case"TableStyle":
                            case"TableStyleElement":
                            case"SXStreamID":
                            case"SXVS":
                            case"DConRef":
                            case"SXAddl":
                            case"DConBin":
                            case"DConName":
                            case"SXPI":
                            case"SxFormat":
                            case"SxSelect":
                            case"SxRule":
                            case"SxFilt":
                            case"SxItm":
                            case"SxDXF":
                            case"ScenMan":
                            case"DCon":
                            case"CellWatch":
                            case"PrintRowCol":
                            case"PrintGrid":
                            case"PrintSize":
                            case"XCT":
                            case"CRN":
                            case"Scl":
                            case"SheetExt":
                            case"SheetExtOptional":
                            case"ObNoMacros":
                            case"ObProj":
                                break;
                            case"CodeName":
                                E ? x.CodeName = Y || x.name : k.WBProps.CodeName = Y || "ThisWorkbook";
                                break;
                            case"GUIDTypeLib":
                            case"WOpt":
                            case"PhoneticInfo":
                            case"OleObjectSize":
                                break;
                            case"DXF":
                            case"DXFN":
                            case"DXFN12":
                            case"DXFN12List":
                            case"DXFN12NoCB":
                                break;
                            case"Dv":
                            case"DVal":
                                break;
                            case"BRAI":
                            case"Series":
                            case"SeriesText":
                            case"DConn":
                            case"DbOrParamQry":
                            case"DBQueryExt":
                            case"OleDbConn":
                            case"ExtString":
                            case"IFmtRecord":
                                break;
                            case"CondFmt":
                            case"CF":
                            case"CF12":
                            case"CFEx":
                            case"Excel9File":
                            case"Units":
                                break;
                            case"InterfaceHdr":
                            case"Mms":
                            case"InterfaceEnd":
                            case"DSF":
                            case"BuiltInFnGroupCount":
                                break;
                            case"Window1":
                            case"HideObj":
                            case"GridSet":
                            case"Guts":
                            case"UserBView":
                            case"UserSViewBegin":
                            case"UserSViewEnd":
                            case"Pane":
                                break;
                            default:
                                switch (G.n) {
                                    case"Dat":
                                    case"Begin":
                                    case"End":
                                    case"StartBlock":
                                    case"EndBlock":
                                    case"Frame":
                                    case"Area":
                                    case"Axis":
                                    case"AxisLine":
                                    case"Tick":
                                        break;
                                    case"AxesUsed":
                                    case"CrtLayout12":
                                    case"CrtLayout12A":
                                    case"CrtLink":
                                    case"CrtLine":
                                    case"CrtMlFrt":
                                    case"CrtMlFrtContinue":
                                        break;
                                    case"LineFormat":
                                    case"AreaFormat":
                                    case"Chart":
                                    case"Chart3d":
                                    case"Chart3DBarShape":
                                    case"ChartFormat":
                                    case"ChartFrtInfo":
                                        break;
                                    case"PlotArea":
                                    case"PlotGrowth":
                                        break;
                                    case"SeriesList":
                                    case"SerParent":
                                    case"SerAuxTrend":
                                        break;
                                    case"DataFormat":
                                    case"SerToCrt":
                                    case"FontX":
                                        break;
                                    case"CatSerRange":
                                    case"AxcExt":
                                    case"SerFmt":
                                    case"ShtProps":
                                        break;
                                    case"DefaultText":
                                    case"Text":
                                    case"CatLab":
                                    case"DataLabExtContents":
                                        break;
                                    case"Legend":
                                    case"LegendException":
                                        break;
                                    case"Pie":
                                    case"Scatter":
                                        break;
                                    case"PieFormat":
                                    case"MarkerFormat":
                                        break;
                                    case"StartObject":
                                    case"EndObject":
                                        break;
                                    case"AlRuns":
                                    case"ObjectLink":
                                    case"SIIndex":
                                        break;
                                    case"AttachedLabel":
                                    case"YMult":
                                        break;
                                    case"Line":
                                    case"Bar":
                                    case"Surf":
                                    case"AxisParent":
                                    case"Pos":
                                    case"ValueRange":
                                    case"SXViewEx9":
                                    case"SXViewLink":
                                    case"PivotChartBits":
                                    case"SBaseRef":
                                    case"TextPropsStream":
                                    case"LnExt":
                                    case"MkrExt":
                                    case"CrtCoopt":
                                        break;
                                    case"Qsi":
                                    case"Qsif":
                                    case"Qsir":
                                    case"QsiSXTag":
                                    case"TxtQry":
                                    case"FilterMode":
                                        break;
                                    case"AutoFilter":
                                    case"AutoFilterInfo":
                                    case"AutoFilter12":
                                    case"DropDownObjIds":
                                    case"Sort":
                                    case"SortData":
                                    case"ShapePropsStream":
                                        break;
                                    case"MsoDrawing":
                                    case"MsoDrawingGroup":
                                    case"MsoDrawingSelection":
                                        break;
                                    case"WebPub":
                                    case"AutoWebPub":
                                        break;
                                    case"HeaderFooter":
                                    case"HFPicture":
                                    case"PLV":
                                    case"HorizontalPageBreaks":
                                    case"VerticalPageBreaks":
                                        break;
                                    case"Backup":
                                    case"CompressPictures":
                                    case"Compat12":
                                        break;
                                    case"Continue":
                                    case"ContinueFrt12":
                                        break;
                                    case"FrtFontList":
                                    case"FrtWrapper":
                                        break;
                                    default:
                                        switch (G.n) {
                                            case"TabIdConf":
                                            case"Radar":
                                            case"RadarArea":
                                            case"DropBar":
                                            case"Intl":
                                            case"CoordList":
                                            case"SerAuxErrBar":
                                                break;
                                            case"BIFF2FONTCLR":
                                            case"BIFF2FMTCNT":
                                            case"BIFF2FONTXTRA":
                                                break;
                                            case"BIFF2XF":
                                            case"BIFF3XF":
                                            case"BIFF4XF":
                                                break;
                                            case"BIFF4FMTCNT":
                                            case"BIFF2ROW":
                                            case"BIFF2WINDOW2":
                                                break;
                                            case"SCENARIO":
                                            case"DConBin":
                                            case"PicF":
                                            case"DataLabExt":
                                            case"Lel":
                                            case"BopPop":
                                            case"BopPopCustom":
                                            case"RealTimeData":
                                            case"Name":
                                                break;
                                            case"LHNGraph":
                                            case"FnGroupName":
                                            case"AddMenu":
                                            case"LPr":
                                                break;
                                            case"ListObj":
                                            case"ListField":
                                            case"RRSort":
                                            case"BigName":
                                                break;
                                            case"ToolbarHdr":
                                            case"ToolbarEnd":
                                            case"DDEObjName":
                                            case"FRTArchId$":
                                                break;
                                            default:
                                                if (t.WTF) throw"Unrecognized Record " + G.n
                                        }
                                }
                        }
                }
            } else e.l += j
        }
        return r.SheetNames = ge(m).sort(function (e, t) {
            return Number(e) - Number(t)
        }).map(function (e) {
            return m[e].name
        }), t.bookSheets || (r.Sheets = n), r.Sheets && z.forEach(function (e, t) {
            r.Sheets[r.SheetNames[t]]["!autofilter"] = e
        }), r.Preamble = w, r.Strings = v, r.SSF = de.get_table(), A.enc && (r.Encryption = A.enc), d && (r.Themes = d), r.Metadata = {}, void 0 !== u && (r.Metadata.Country = u), 0 < P.names.length && (k.Names = P.names), r.Workbook = k, r
    }

    var Hc = {
        SI: "e0859ff2f94f6810ab9108002b27b3d9",
        DSI: "02d5cdd59c2e1b10939708002b2cf9ae",
        UDI: "05d5cdd59c2e1b10939708002b2cf9ae"
    };

    function zc(e, t) {
        var r, n, a, s, i, o;
        if (Of(t = t || {}), d(), t.codepage && f(t.codepage), e.FullPaths) {
            if (me.find(e, "/encryption")) throw new Error("File is password-protected");
            r = me.find(e, "!CompObj"), n = me.find(e, "/Workbook") || me.find(e, "/Book")
        } else {
            switch (t.type) {
                case"base64":
                    e = se(q.decode(e));
                    break;
                case"binary":
                    e = se(e);
                    break;
                case"buffer":
                    break;
                case"array":
                    Array.isArray(e) || (e = Array.prototype.slice.call(e))
            }
            Ft(e, 0), n = {content: e}
        }
        if (r && Pc(r), t.bookProps && !t.bookSheets) a = {}; else {
            var l = ee ? "buffer" : "array";
            if (n && n.content) a = Uc(n.content, t); else if ((s = me.find(e, "PerfectOffice_MAIN")) && s.content) a = os.to_workbook(s.content, (t.type = l, t)); else {
                if (!(s = me.find(e, "NativeContent_MAIN")) || !s.content) throw new Error("Cannot find Workbook stream");
                a = os.to_workbook(s.content, (t.type = l, t))
            }
            t.bookVBA && e.FullPaths && me.find(e, "/_VBA_PROJECT_CUR/VBA/dir") && (a.vbaraw = (i = e, o = me.utils.cfb_new({root: "R"}), i.FullPaths.forEach(function (e, t) {
                if ("/" !== e.slice(-1) && e.match(/_VBA_PROJECT_CUR/)) {
                    var r = e.replace(/^[^\/]*/, "R").replace(/\/_VBA_PROJECT_CUR\u0000*/, "");
                    me.utils.cfb_add(o, r, i.FileIndex[t].content)
                }
            }), me.write(o)))
        }
        var c = {};
        return e.FullPaths && function (e, t, r) {
            var n = me.find(e, "!DocumentSummaryInformation");
            if (n && 0 < n.size) try {
                var a = Pn(n, Dr, Hc.DSI);
                for (var s in a) t[s] = a[s]
            } catch (e) {
                if (r.WTF) throw e
            }
            var i = me.find(e, "!SummaryInformation");
            if (i && 0 < i.size) try {
                var o = Pn(i, Pr, Hc.SI);
                for (var l in o) null == t[l] && (t[l] = o[l])
            } catch (e) {
                if (r.WTF) throw e
            }
            t.HeadingPairs && t.TitlesOfParts && (dn(t.HeadingPairs, t.TitlesOfParts, t, r), delete t.HeadingPairs, delete t.TitlesOfParts)
        }(e, c, t), a.Props = a.Custprops = c, t.bookFiles && (a.cfb = e), a
    }

    function Vc(e, t) {
        var n, a, r = t || {}, s = me.utils.cfb_new({root: "R"}), i = "/Workbook";
        switch (r.bookType || "xls") {
            case"xls":
                r.bookType = "biff8";
            case"xla":
                r.bookType || (r.bookType = "xla");
            case"biff8":
                i = "/Workbook", r.biff = 8;
                break;
            case"biff5":
                i = "/Book", r.biff = 5;
                break;
            default:
                throw new Error("invalid type " + r.bookType + " for XLS CFB")
        }
        return me.utils.cfb_add(s, i, tf(e, r)), 8 == r.biff && (e.Props || e.Custprops) && function (e, t) {
            var r, n = [], a = [], s = [], i = 0;
            if (e.Props) for (r = ge(e.Props), i = 0; i < r.length; ++i) (Lr.hasOwnProperty(r[i]) ? n : Mr.hasOwnProperty(r[i]) ? a : s).push([r[i], e.Props[r[i]]]);
            if (e.Custprops) for (r = ge(e.Custprops), i = 0; i < r.length; ++i) (e.Props || {}).hasOwnProperty(r[i]) || (Lr.hasOwnProperty(r[i]) ? n : Mr.hasOwnProperty(r[i]) ? a : s).push([r[i], e.Custprops[r[i]]]);
            var o = [];
            for (i = 0; i < s.length; ++i) -1 < On.indexOf(s[i][0]) || null != s[i][1] && o.push(s[i]);
            a.length && me.utils.cfb_add(t, "/SummaryInformation", Nn(a, Hc.SI, Mr, Pr)), (n.length || o.length) && me.utils.cfb_add(t, "/DocumentSummaryInformation", Nn(n, Hc.DSI, Lr, Dr, o.length ? o : null, Hc.UDI))
        }(e, s), 8 == r.biff && e.vbaraw && (n = s, (a = me.read(e.vbaraw, {type: "string" == typeof e.vbaraw ? "binary" : "buffer"})).FullPaths.forEach(function (e, t) {
            if (0 != t) {
                var r = e.replace(/[^\/]*[\/]/, "/_VBA_PROJECT_CUR/");
                "/" !== r.slice(-1) && me.utils.cfb_add(n, r, a.FileIndex[t].content)
            }
        })), s
    }

    var Wc = {
        0: {
            n: "BrtRowHdr", f: function (e, t) {
                var r = {}, n = e.l + t;
                r.r = e.read_shift(4), e.l += 4;
                var a = e.read_shift(2);
                e.l += 1;
                var s = e.read_shift(1);
                return e.l = n, 7 & s && (r.level = 7 & s), 16 & s && (r.hidden = !0), 32 & s && (r.hpt = a / 20), r
            }
        },
        1: {
            n: "BrtCellBlank", f: function (e) {
                return [fr(e)]
            }
        },
        2: {
            n: "BrtCellRk", f: function (e) {
                return [fr(e), Er(e), "n"]
            }
        },
        3: {
            n: "BrtCellError", f: function (e) {
                return [fr(e), e.read_shift(1), "e"]
            }
        },
        4: {
            n: "BrtCellBool", f: function (e) {
                return [fr(e), e.read_shift(1), "b"]
            }
        },
        5: {
            n: "BrtCellReal", f: function (e) {
                return [fr(e), yr(e), "n"]
            }
        },
        6: {
            n: "BrtCellSt", f: function (e) {
                return [fr(e), sr(e), "str"]
            }
        },
        7: {
            n: "BrtCellIsst", f: function (e) {
                return [fr(e), e.read_shift(4), "s"]
            }
        },
        8: {
            n: "BrtFmlaString", f: function (e, t, r) {
                var n = e.l + t, a = fr(e);
                a.r = r["!row"];
                var s = [a, sr(e), "str"];
                if (r.cellFormula) {
                    e.l += 2;
                    var i = Wo(e, n - e.l, r);
                    s[3] = Uo(i, 0, a, r.supbooks, r)
                } else e.l = n;
                return s
            }
        },
        9: {
            n: "BrtFmlaNum", f: function (e, t, r) {
                var n = e.l + t, a = fr(e);
                a.r = r["!row"];
                var s = [a, yr(e), "n"];
                if (r.cellFormula) {
                    e.l += 2;
                    var i = Wo(e, n - e.l, r);
                    s[3] = Uo(i, 0, a, r.supbooks, r)
                } else e.l = n;
                return s
            }
        },
        10: {
            n: "BrtFmlaBool", f: function (e, t, r) {
                var n = e.l + t, a = fr(e);
                a.r = r["!row"];
                var s = [a, e.read_shift(1), "b"];
                if (r.cellFormula) {
                    e.l += 2;
                    var i = Wo(e, n - e.l, r);
                    s[3] = Uo(i, 0, a, r.supbooks, r)
                } else e.l = n;
                return s
            }
        },
        11: {
            n: "BrtFmlaError", f: function (e, t, r) {
                var n = e.l + t, a = fr(e);
                a.r = r["!row"];
                var s = [a, e.read_shift(1), "e"];
                if (r.cellFormula) {
                    e.l += 2;
                    var i = Wo(e, n - e.l, r);
                    s[3] = Uo(i, 0, a, r.supbooks, r)
                } else e.l = n;
                return s
            }
        },
        16: {
            n: "BrtFRTArchID$", f: function (e, t) {
                var r = {};
                return e.read_shift(4), r.ArchID = e.read_shift(4), e.l += t - 8, r
            }
        },
        19: {n: "BrtSSTItem", f: or},
        20: {n: "BrtPCDIMissing"},
        21: {n: "BrtPCDINumber"},
        22: {n: "BrtPCDIBoolean"},
        23: {n: "BrtPCDIError"},
        24: {n: "BrtPCDIString"},
        25: {n: "BrtPCDIDatetime"},
        26: {n: "BrtPCDIIndex"},
        27: {n: "BrtPCDIAMissing"},
        28: {n: "BrtPCDIANumber"},
        29: {n: "BrtPCDIABoolean"},
        30: {n: "BrtPCDIAError"},
        31: {n: "BrtPCDIAString"},
        32: {n: "BrtPCDIADatetime"},
        33: {n: "BrtPCRRecord"},
        34: {n: "BrtPCRRecordDt"},
        35: {n: "BrtFRTBegin"},
        36: {n: "BrtFRTEnd"},
        37: {n: "BrtACBegin"},
        38: {n: "BrtACEnd"},
        39: {
            n: "BrtName", f: function (e, t, r) {
                var n = e.l + t;
                e.l += 4, e.l += 1;
                var a = e.read_shift(4), s = gr(e), i = Xo(e, 0, r), o = pr(e);
                e.l = n;
                var l = {Name: s, Ptg: i};
                return a < 268435455 && (l.Sheet = a), o && (l.Comment = o), l
            }
        },
        40: {n: "BrtIndexRowBlock"},
        42: {n: "BrtIndexBlock"},
        43: {
            n: "BrtFont", f: function (e, t, r) {
                var n = {};
                n.sz = e.read_shift(2) / 20;
                var a, s, i = (s = (a = e).read_shift(1), a.l++, {
                    fItalic: 2 & s,
                    fStrikeout: 8 & s,
                    fOutline: 16 & s,
                    fShadow: 32 & s,
                    fCondense: 64 & s,
                    fExtend: 128 & s
                });
                switch (i.fCondense && (n.condense = 1), i.fExtend && (n.extend = 1), i.fShadow && (n.shadow = 1), i.fOutline && (n.outline = 1), i.fStrikeout && (n.strike = 1), i.fItalic && (n.italic = 1), 700 === e.read_shift(2) && (n.bold = 1), e.read_shift(2)) {
                    case 1:
                        n.vertAlign = "superscript";
                        break;
                    case 2:
                        n.vertAlign = "subscript"
                }
                var o = e.read_shift(1);
                0 != o && (n.underline = o);
                var l = e.read_shift(1);
                0 < l && (n.family = l);
                var c = e.read_shift(1);
                switch (0 < c && (n.charset = c), e.l++, n.color = function (e) {
                    var t = {}, r = e.read_shift(1) >>> 1, n = e.read_shift(1), a = e.read_shift(2, "i"),
                        s = e.read_shift(1), i = e.read_shift(1), o = e.read_shift(1);
                    switch (e.l++, r) {
                        case 0:
                            t.auto = 1;
                            break;
                        case 1:
                            t.index = n;
                            var l = Vr[n];
                            l && (t.rgb = Ks(l));
                            break;
                        case 2:
                            t.rgb = Ks([s, i, o]);
                            break;
                        case 3:
                            t.theme = n
                    }
                    return 0 != a && (t.tint = 0 < a ? a / 32767 : a / 32768), t
                }(e), e.read_shift(1)) {
                    case 1:
                        n.scheme = "major";
                        break;
                    case 2:
                        n.scheme = "minor"
                }
                return n.name = sr(e), n
            }
        },
        44: {
            n: "BrtFmt", f: function (e, t) {
                return [e.read_shift(2), sr(e)]
            }
        },
        45: {n: "BrtFill", f: Ci},
        46: {n: "BrtBorder", f: xi},
        47: {
            n: "BrtXF", f: function (e, t) {
                var r = e.l + t, n = e.read_shift(2), a = e.read_shift(2);
                return e.l = r, {ixfe: n, numFmtId: a}
            }
        },
        48: {n: "BrtStyle"},
        49: {n: "BrtCellMeta"},
        50: {n: "BrtValueMeta"},
        51: {n: "BrtMdb"},
        52: {n: "BrtBeginFmd"},
        53: {n: "BrtEndFmd"},
        54: {n: "BrtBeginMdx"},
        55: {n: "BrtEndMdx"},
        56: {n: "BrtBeginMdxTuple"},
        57: {n: "BrtEndMdxTuple"},
        58: {n: "BrtMdxMbrIstr"},
        59: {n: "BrtStr"},
        60: {n: "BrtColInfo", f: xa},
        62: {n: "BrtCellRString"},
        63: {
            n: "BrtCalcChainItem$", f: function (e) {
                var t = {};
                t.i = e.read_shift(4);
                var r = {};
                r.r = e.read_shift(4), r.c = e.read_shift(4), t.r = Kt(r);
                var n = e.read_shift(1);
                return 2 & n && (t.l = "1"), 8 & n && (t.a = "1"), t
            }
        },
        64: {n: "BrtDVal"},
        65: {n: "BrtSxvcellNum"},
        66: {n: "BrtSxvcellStr"},
        67: {n: "BrtSxvcellBool"},
        68: {n: "BrtSxvcellErr"},
        69: {n: "BrtSxvcellDate"},
        70: {n: "BrtSxvcellNil"},
        128: {n: "BrtFileVersion"},
        129: {n: "BrtBeginSheet"},
        130: {n: "BrtEndSheet"},
        131: {n: "BrtBeginBook", f: Dt, p: 0},
        132: {n: "BrtEndBook"},
        133: {n: "BrtBeginWsViews"},
        134: {n: "BrtEndWsViews"},
        135: {n: "BrtBeginBookViews"},
        136: {n: "BrtEndBookViews"},
        137: {
            n: "BrtBeginWsView", f: function (e) {
                var t = e.read_shift(2);
                return e.l += 28, {RTL: 32 & t}
            }
        },
        138: {n: "BrtEndWsView"},
        139: {n: "BrtBeginCsViews"},
        140: {n: "BrtEndCsViews"},
        141: {n: "BrtBeginCsView"},
        142: {n: "BrtEndCsView"},
        143: {n: "BrtBeginBundleShs"},
        144: {n: "BrtEndBundleShs"},
        145: {n: "BrtBeginSheetData"},
        146: {n: "BrtEndSheetData"},
        147: {
            n: "BrtWsProp", f: function (e, t) {
                var r = {};
                return e.l += 19, r.name = ur(e, t - 19), r
            }
        },
        148: {n: "BrtWsDim", f: Rl, p: 16},
        151: {n: "BrtPane"},
        152: {n: "BrtSel"},
        153: {
            n: "BrtWbProp", f: function (e, t) {
                var r = {}, n = e.read_shift(4);
                r.defaultThemeVersion = e.read_shift(4);
                var a = 8 < t ? sr(e) : "";
                return 0 < a.length && (r.CodeName = a), r.autoCompressPictures = !!(65536 & n), r.backupFile = !!(64 & n), r.checkCompatibility = !!(4096 & n), r.date1904 = !!(1 & n), r.filterPrivacy = !!(8 & n), r.hidePivotFieldList = !!(1024 & n), r.promptedSolutions = !!(16 & n), r.publishItems = !!(2048 & n), r.refreshAllConnections = !!(262144 & n), r.saveExternalLinkValues = !!(128 & n), r.showBorderUnselectedTables = !!(4 & n), r.showInkAnnotation = !!(32 & n), r.showObjects = ["all", "placeholders", "none"][n >> 13 & 3], r.showPivotChartFilter = !!(32768 & n), r.updateLinks = ["userSet", "never", "always"][n >> 8 & 3], r
            }
        },
        154: {n: "BrtWbFactoid"},
        155: {n: "BrtFileRecover"},
        156: {
            n: "BrtBundleSh", f: function (e, t) {
                var r = {};
                return r.Hidden = e.read_shift(4), r.iTabID = e.read_shift(4), r.strRelID = br(e, t - 8), r.name = sr(e), r
            }
        },
        157: {n: "BrtCalcProp"},
        158: {n: "BrtBookView"},
        159: {
            n: "BrtBeginSst", f: function (e) {
                return [e.read_shift(4), e.read_shift(4)]
            }
        },
        160: {n: "BrtEndSst"},
        161: {n: "BrtBeginAFilter", f: Sr},
        162: {n: "BrtEndAFilter"},
        163: {n: "BrtBeginFilterColumn"},
        164: {n: "BrtEndFilterColumn"},
        165: {n: "BrtBeginFilters"},
        166: {n: "BrtEndFilters"},
        167: {n: "BrtFilter"},
        168: {n: "BrtColorFilter"},
        169: {n: "BrtIconFilter"},
        170: {n: "BrtTop10Filter"},
        171: {n: "BrtDynamicFilter"},
        172: {n: "BrtBeginCustomFilters"},
        173: {n: "BrtEndCustomFilters"},
        174: {n: "BrtCustomFilter"},
        175: {n: "BrtAFilterDateGroupItem"},
        176: {n: "BrtMergeCell", f: Dl},
        177: {n: "BrtBeginMergeCells"},
        178: {n: "BrtEndMergeCells"},
        179: {n: "BrtBeginPivotCacheDef"},
        180: {n: "BrtEndPivotCacheDef"},
        181: {n: "BrtBeginPCDFields"},
        182: {n: "BrtEndPCDFields"},
        183: {n: "BrtBeginPCDField"},
        184: {n: "BrtEndPCDField"},
        185: {n: "BrtBeginPCDSource"},
        186: {n: "BrtEndPCDSource"},
        187: {n: "BrtBeginPCDSRange"},
        188: {n: "BrtEndPCDSRange"},
        189: {n: "BrtBeginPCDFAtbl"},
        190: {n: "BrtEndPCDFAtbl"},
        191: {n: "BrtBeginPCDIRun"},
        192: {n: "BrtEndPCDIRun"},
        193: {n: "BrtBeginPivotCacheRecords"},
        194: {n: "BrtEndPivotCacheRecords"},
        195: {n: "BrtBeginPCDHierarchies"},
        196: {n: "BrtEndPCDHierarchies"},
        197: {n: "BrtBeginPCDHierarchy"},
        198: {n: "BrtEndPCDHierarchy"},
        199: {n: "BrtBeginPCDHFieldsUsage"},
        200: {n: "BrtEndPCDHFieldsUsage"},
        201: {n: "BrtBeginExtConnection"},
        202: {n: "BrtEndExtConnection"},
        203: {n: "BrtBeginECDbProps"},
        204: {n: "BrtEndECDbProps"},
        205: {n: "BrtBeginECOlapProps"},
        206: {n: "BrtEndECOlapProps"},
        207: {n: "BrtBeginPCDSConsol"},
        208: {n: "BrtEndPCDSConsol"},
        209: {n: "BrtBeginPCDSCPages"},
        210: {n: "BrtEndPCDSCPages"},
        211: {n: "BrtBeginPCDSCPage"},
        212: {n: "BrtEndPCDSCPage"},
        213: {n: "BrtBeginPCDSCPItem"},
        214: {n: "BrtEndPCDSCPItem"},
        215: {n: "BrtBeginPCDSCSets"},
        216: {n: "BrtEndPCDSCSets"},
        217: {n: "BrtBeginPCDSCSet"},
        218: {n: "BrtEndPCDSCSet"},
        219: {n: "BrtBeginPCDFGroup"},
        220: {n: "BrtEndPCDFGroup"},
        221: {n: "BrtBeginPCDFGItems"},
        222: {n: "BrtEndPCDFGItems"},
        223: {n: "BrtBeginPCDFGRange"},
        224: {n: "BrtEndPCDFGRange"},
        225: {n: "BrtBeginPCDFGDiscrete"},
        226: {n: "BrtEndPCDFGDiscrete"},
        227: {n: "BrtBeginPCDSDTupleCache"},
        228: {n: "BrtEndPCDSDTupleCache"},
        229: {n: "BrtBeginPCDSDTCEntries"},
        230: {n: "BrtEndPCDSDTCEntries"},
        231: {n: "BrtBeginPCDSDTCEMembers"},
        232: {n: "BrtEndPCDSDTCEMembers"},
        233: {n: "BrtBeginPCDSDTCEMember"},
        234: {n: "BrtEndPCDSDTCEMember"},
        235: {n: "BrtBeginPCDSDTCQueries"},
        236: {n: "BrtEndPCDSDTCQueries"},
        237: {n: "BrtBeginPCDSDTCQuery"},
        238: {n: "BrtEndPCDSDTCQuery"},
        239: {n: "BrtBeginPCDSDTCSets"},
        240: {n: "BrtEndPCDSDTCSets"},
        241: {n: "BrtBeginPCDSDTCSet"},
        242: {n: "BrtEndPCDSDTCSet"},
        243: {n: "BrtBeginPCDCalcItems"},
        244: {n: "BrtEndPCDCalcItems"},
        245: {n: "BrtBeginPCDCalcItem"},
        246: {n: "BrtEndPCDCalcItem"},
        247: {n: "BrtBeginPRule"},
        248: {n: "BrtEndPRule"},
        249: {n: "BrtBeginPRFilters"},
        250: {n: "BrtEndPRFilters"},
        251: {n: "BrtBeginPRFilter"},
        252: {n: "BrtEndPRFilter"},
        253: {n: "BrtBeginPNames"},
        254: {n: "BrtEndPNames"},
        255: {n: "BrtBeginPName"},
        256: {n: "BrtEndPName"},
        257: {n: "BrtBeginPNPairs"},
        258: {n: "BrtEndPNPairs"},
        259: {n: "BrtBeginPNPair"},
        260: {n: "BrtEndPNPair"},
        261: {n: "BrtBeginECWebProps"},
        262: {n: "BrtEndECWebProps"},
        263: {n: "BrtBeginEcWpTables"},
        264: {n: "BrtEndECWPTables"},
        265: {n: "BrtBeginECParams"},
        266: {n: "BrtEndECParams"},
        267: {n: "BrtBeginECParam"},
        268: {n: "BrtEndECParam"},
        269: {n: "BrtBeginPCDKPIs"},
        270: {n: "BrtEndPCDKPIs"},
        271: {n: "BrtBeginPCDKPI"},
        272: {n: "BrtEndPCDKPI"},
        273: {n: "BrtBeginDims"},
        274: {n: "BrtEndDims"},
        275: {n: "BrtBeginDim"},
        276: {n: "BrtEndDim"},
        277: {n: "BrtIndexPartEnd"},
        278: {n: "BrtBeginStyleSheet"},
        279: {n: "BrtEndStyleSheet"},
        280: {n: "BrtBeginSXView"},
        281: {n: "BrtEndSXVI"},
        282: {n: "BrtBeginSXVI"},
        283: {n: "BrtBeginSXVIs"},
        284: {n: "BrtEndSXVIs"},
        285: {n: "BrtBeginSXVD"},
        286: {n: "BrtEndSXVD"},
        287: {n: "BrtBeginSXVDs"},
        288: {n: "BrtEndSXVDs"},
        289: {n: "BrtBeginSXPI"},
        290: {n: "BrtEndSXPI"},
        291: {n: "BrtBeginSXPIs"},
        292: {n: "BrtEndSXPIs"},
        293: {n: "BrtBeginSXDI"},
        294: {n: "BrtEndSXDI"},
        295: {n: "BrtBeginSXDIs"},
        296: {n: "BrtEndSXDIs"},
        297: {n: "BrtBeginSXLI"},
        298: {n: "BrtEndSXLI"},
        299: {n: "BrtBeginSXLIRws"},
        300: {n: "BrtEndSXLIRws"},
        301: {n: "BrtBeginSXLICols"},
        302: {n: "BrtEndSXLICols"},
        303: {n: "BrtBeginSXFormat"},
        304: {n: "BrtEndSXFormat"},
        305: {n: "BrtBeginSXFormats"},
        306: {n: "BrtEndSxFormats"},
        307: {n: "BrtBeginSxSelect"},
        308: {n: "BrtEndSxSelect"},
        309: {n: "BrtBeginISXVDRws"},
        310: {n: "BrtEndISXVDRws"},
        311: {n: "BrtBeginISXVDCols"},
        312: {n: "BrtEndISXVDCols"},
        313: {n: "BrtEndSXLocation"},
        314: {n: "BrtBeginSXLocation"},
        315: {n: "BrtEndSXView"},
        316: {n: "BrtBeginSXTHs"},
        317: {n: "BrtEndSXTHs"},
        318: {n: "BrtBeginSXTH"},
        319: {n: "BrtEndSXTH"},
        320: {n: "BrtBeginISXTHRws"},
        321: {n: "BrtEndISXTHRws"},
        322: {n: "BrtBeginISXTHCols"},
        323: {n: "BrtEndISXTHCols"},
        324: {n: "BrtBeginSXTDMPS"},
        325: {n: "BrtEndSXTDMPs"},
        326: {n: "BrtBeginSXTDMP"},
        327: {n: "BrtEndSXTDMP"},
        328: {n: "BrtBeginSXTHItems"},
        329: {n: "BrtEndSXTHItems"},
        330: {n: "BrtBeginSXTHItem"},
        331: {n: "BrtEndSXTHItem"},
        332: {n: "BrtBeginMetadata"},
        333: {n: "BrtEndMetadata"},
        334: {n: "BrtBeginEsmdtinfo"},
        335: {n: "BrtMdtinfo"},
        336: {n: "BrtEndEsmdtinfo"},
        337: {n: "BrtBeginEsmdb"},
        338: {n: "BrtEndEsmdb"},
        339: {n: "BrtBeginEsfmd"},
        340: {n: "BrtEndEsfmd"},
        341: {n: "BrtBeginSingleCells"},
        342: {n: "BrtEndSingleCells"},
        343: {n: "BrtBeginList"},
        344: {n: "BrtEndList"},
        345: {n: "BrtBeginListCols"},
        346: {n: "BrtEndListCols"},
        347: {n: "BrtBeginListCol"},
        348: {n: "BrtEndListCol"},
        349: {n: "BrtBeginListXmlCPr"},
        350: {n: "BrtEndListXmlCPr"},
        351: {n: "BrtListCCFmla"},
        352: {n: "BrtListTrFmla"},
        353: {n: "BrtBeginExternals"},
        354: {n: "BrtEndExternals"},
        355: {n: "BrtSupBookSrc", f: br},
        357: {n: "BrtSupSelf"},
        358: {n: "BrtSupSame"},
        359: {n: "BrtSupTabs"},
        360: {n: "BrtBeginSupBook"},
        361: {n: "BrtPlaceholderName"},
        362: {n: "BrtExternSheet", f: ya},
        363: {n: "BrtExternTableStart"},
        364: {n: "BrtExternTableEnd"},
        366: {n: "BrtExternRowHdr"},
        367: {n: "BrtExternCellBlank"},
        368: {n: "BrtExternCellReal"},
        369: {n: "BrtExternCellBool"},
        370: {n: "BrtExternCellError"},
        371: {n: "BrtExternCellString"},
        372: {n: "BrtBeginEsmdx"},
        373: {n: "BrtEndEsmdx"},
        374: {n: "BrtBeginMdxSet"},
        375: {n: "BrtEndMdxSet"},
        376: {n: "BrtBeginMdxMbrProp"},
        377: {n: "BrtEndMdxMbrProp"},
        378: {n: "BrtBeginMdxKPI"},
        379: {n: "BrtEndMdxKPI"},
        380: {n: "BrtBeginEsstr"},
        381: {n: "BrtEndEsstr"},
        382: {n: "BrtBeginPRFItem"},
        383: {n: "BrtEndPRFItem"},
        384: {n: "BrtBeginPivotCacheIDs"},
        385: {n: "BrtEndPivotCacheIDs"},
        386: {n: "BrtBeginPivotCacheID"},
        387: {n: "BrtEndPivotCacheID"},
        388: {n: "BrtBeginISXVIs"},
        389: {n: "BrtEndISXVIs"},
        390: {n: "BrtBeginColInfos"},
        391: {n: "BrtEndColInfos"},
        392: {n: "BrtBeginRwBrk"},
        393: {n: "BrtEndRwBrk"},
        394: {n: "BrtBeginColBrk"},
        395: {n: "BrtEndColBrk"},
        396: {n: "BrtBrk"},
        397: {n: "BrtUserBookView"},
        398: {n: "BrtInfo"},
        399: {n: "BrtCUsr"},
        400: {n: "BrtUsr"},
        401: {n: "BrtBeginUsers"},
        403: {n: "BrtEOF"},
        404: {n: "BrtUCR"},
        405: {n: "BrtRRInsDel"},
        406: {n: "BrtRREndInsDel"},
        407: {n: "BrtRRMove"},
        408: {n: "BrtRREndMove"},
        409: {n: "BrtRRChgCell"},
        410: {n: "BrtRREndChgCell"},
        411: {n: "BrtRRHeader"},
        412: {n: "BrtRRUserView"},
        413: {n: "BrtRRRenSheet"},
        414: {n: "BrtRRInsertSh"},
        415: {n: "BrtRRDefName"},
        416: {n: "BrtRRNote"},
        417: {n: "BrtRRConflict"},
        418: {n: "BrtRRTQSIF"},
        419: {n: "BrtRRFormat"},
        420: {n: "BrtRREndFormat"},
        421: {n: "BrtRRAutoFmt"},
        422: {n: "BrtBeginUserShViews"},
        423: {n: "BrtBeginUserShView"},
        424: {n: "BrtEndUserShView"},
        425: {n: "BrtEndUserShViews"},
        426: {
            n: "BrtArrFmla", f: function (e, t, r) {
                var n = e.l + t, a = wr(e), s = e.read_shift(1), i = [a];
                if (i[2] = s, r.cellFormula) {
                    var o = Vo(e, n - e.l, r);
                    i[1] = o
                } else e.l = n;
                return i
            }
        },
        427: {
            n: "BrtShrFmla", f: function (e, t, r) {
                var n = e.l + t, a = [Sr(e, 16)];
                if (r.cellFormula) {
                    var s = jo(e, n - e.l, r);
                    a[1] = s, e.l = n
                } else e.l = n;
                return a
            }
        },
        428: {n: "BrtTable"},
        429: {n: "BrtBeginExtConnections"},
        430: {n: "BrtEndExtConnections"},
        431: {n: "BrtBeginPCDCalcMems"},
        432: {n: "BrtEndPCDCalcMems"},
        433: {n: "BrtBeginPCDCalcMem"},
        434: {n: "BrtEndPCDCalcMem"},
        435: {n: "BrtBeginPCDHGLevels"},
        436: {n: "BrtEndPCDHGLevels"},
        437: {n: "BrtBeginPCDHGLevel"},
        438: {n: "BrtEndPCDHGLevel"},
        439: {n: "BrtBeginPCDHGLGroups"},
        440: {n: "BrtEndPCDHGLGroups"},
        441: {n: "BrtBeginPCDHGLGroup"},
        442: {n: "BrtEndPCDHGLGroup"},
        443: {n: "BrtBeginPCDHGLGMembers"},
        444: {n: "BrtEndPCDHGLGMembers"},
        445: {n: "BrtBeginPCDHGLGMember"},
        446: {n: "BrtEndPCDHGLGMember"},
        447: {n: "BrtBeginQSI"},
        448: {n: "BrtEndQSI"},
        449: {n: "BrtBeginQSIR"},
        450: {n: "BrtEndQSIR"},
        451: {n: "BrtBeginDeletedNames"},
        452: {n: "BrtEndDeletedNames"},
        453: {n: "BrtBeginDeletedName"},
        454: {n: "BrtEndDeletedName"},
        455: {n: "BrtBeginQSIFs"},
        456: {n: "BrtEndQSIFs"},
        457: {n: "BrtBeginQSIF"},
        458: {n: "BrtEndQSIF"},
        459: {n: "BrtBeginAutoSortScope"},
        460: {n: "BrtEndAutoSortScope"},
        461: {n: "BrtBeginConditionalFormatting"},
        462: {n: "BrtEndConditionalFormatting"},
        463: {n: "BrtBeginCFRule"},
        464: {n: "BrtEndCFRule"},
        465: {n: "BrtBeginIconSet"},
        466: {n: "BrtEndIconSet"},
        467: {n: "BrtBeginDatabar"},
        468: {n: "BrtEndDatabar"},
        469: {n: "BrtBeginColorScale"},
        470: {n: "BrtEndColorScale"},
        471: {n: "BrtCFVO"},
        472: {n: "BrtExternValueMeta"},
        473: {n: "BrtBeginColorPalette"},
        474: {n: "BrtEndColorPalette"},
        475: {n: "BrtIndexedColor"},
        476: {
            n: "BrtMargins", f: function (t) {
                var r = {};
                return Nl.forEach(function (e) {
                    r[e] = yr(t)
                }), r
            }
        },
        477: {n: "BrtPrintOptions"},
        478: {n: "BrtPageSetup"},
        479: {n: "BrtBeginHeaderFooter"},
        480: {n: "BrtEndHeaderFooter"},
        481: {n: "BrtBeginSXCrtFormat"},
        482: {n: "BrtEndSXCrtFormat"},
        483: {n: "BrtBeginSXCrtFormats"},
        484: {n: "BrtEndSXCrtFormats"},
        485: {
            n: "BrtWsFmtInfo", f: function () {
            }
        },
        486: {n: "BrtBeginMgs"},
        487: {n: "BrtEndMGs"},
        488: {n: "BrtBeginMGMaps"},
        489: {n: "BrtEndMGMaps"},
        490: {n: "BrtBeginMG"},
        491: {n: "BrtEndMG"},
        492: {n: "BrtBeginMap"},
        493: {n: "BrtEndMap"},
        494: {
            n: "BrtHLink", f: function (e, t) {
                var r = e.l + t, n = Sr(e, 16), a = pr(e), s = sr(e), i = sr(e), o = sr(e);
                e.l = r;
                var l = {rfx: n, relId: a, loc: s, display: o};
                return i && (l.Tooltip = i), l
            }
        },
        495: {n: "BrtBeginDCon"},
        496: {n: "BrtEndDCon"},
        497: {n: "BrtBeginDRefs"},
        498: {n: "BrtEndDRefs"},
        499: {n: "BrtDRef"},
        500: {n: "BrtBeginScenMan"},
        501: {n: "BrtEndScenMan"},
        502: {n: "BrtBeginSct"},
        503: {n: "BrtEndSct"},
        504: {n: "BrtSlc"},
        505: {n: "BrtBeginDXFs"},
        506: {n: "BrtEndDXFs"},
        507: {n: "BrtDXF"},
        508: {n: "BrtBeginTableStyles"},
        509: {n: "BrtEndTableStyles"},
        510: {n: "BrtBeginTableStyle"},
        511: {n: "BrtEndTableStyle"},
        512: {n: "BrtTableStyleElement"},
        513: {n: "BrtTableStyleClient"},
        514: {n: "BrtBeginVolDeps"},
        515: {n: "BrtEndVolDeps"},
        516: {n: "BrtBeginVolType"},
        517: {n: "BrtEndVolType"},
        518: {n: "BrtBeginVolMain"},
        519: {n: "BrtEndVolMain"},
        520: {n: "BrtBeginVolTopic"},
        521: {n: "BrtEndVolTopic"},
        522: {n: "BrtVolSubtopic"},
        523: {n: "BrtVolRef"},
        524: {n: "BrtVolNum"},
        525: {n: "BrtVolErr"},
        526: {n: "BrtVolStr"},
        527: {n: "BrtVolBool"},
        528: {n: "BrtBeginCalcChain$"},
        529: {n: "BrtEndCalcChain$"},
        530: {n: "BrtBeginSortState"},
        531: {n: "BrtEndSortState"},
        532: {n: "BrtBeginSortCond"},
        533: {n: "BrtEndSortCond"},
        534: {n: "BrtBookProtection"},
        535: {n: "BrtSheetProtection"},
        536: {n: "BrtRangeProtection"},
        537: {n: "BrtPhoneticInfo"},
        538: {n: "BrtBeginECTxtWiz"},
        539: {n: "BrtEndECTxtWiz"},
        540: {n: "BrtBeginECTWFldInfoLst"},
        541: {n: "BrtEndECTWFldInfoLst"},
        542: {n: "BrtBeginECTwFldInfo"},
        548: {n: "BrtFileSharing"},
        549: {n: "BrtOleSize"},
        550: {n: "BrtDrawing", f: br},
        551: {n: "BrtLegacyDrawing"},
        552: {n: "BrtLegacyDrawingHF"},
        553: {n: "BrtWebOpt"},
        554: {n: "BrtBeginWebPubItems"},
        555: {n: "BrtEndWebPubItems"},
        556: {n: "BrtBeginWebPubItem"},
        557: {n: "BrtEndWebPubItem"},
        558: {n: "BrtBeginSXCondFmt"},
        559: {n: "BrtEndSXCondFmt"},
        560: {n: "BrtBeginSXCondFmts"},
        561: {n: "BrtEndSXCondFmts"},
        562: {n: "BrtBkHim"},
        564: {n: "BrtColor"},
        565: {n: "BrtBeginIndexedColors"},
        566: {n: "BrtEndIndexedColors"},
        569: {n: "BrtBeginMRUColors"},
        570: {n: "BrtEndMRUColors"},
        572: {n: "BrtMRUColor"},
        573: {n: "BrtBeginDVals"},
        574: {n: "BrtEndDVals"},
        577: {n: "BrtSupNameStart"},
        578: {n: "BrtSupNameValueStart"},
        579: {n: "BrtSupNameValueEnd"},
        580: {n: "BrtSupNameNum"},
        581: {n: "BrtSupNameErr"},
        582: {n: "BrtSupNameSt"},
        583: {n: "BrtSupNameNil"},
        584: {n: "BrtSupNameBool"},
        585: {n: "BrtSupNameFmla"},
        586: {n: "BrtSupNameBits"},
        587: {n: "BrtSupNameEnd"},
        588: {n: "BrtEndSupBook"},
        589: {n: "BrtCellSmartTagProperty"},
        590: {n: "BrtBeginCellSmartTag"},
        591: {n: "BrtEndCellSmartTag"},
        592: {n: "BrtBeginCellSmartTags"},
        593: {n: "BrtEndCellSmartTags"},
        594: {n: "BrtBeginSmartTags"},
        595: {n: "BrtEndSmartTags"},
        596: {n: "BrtSmartTagType"},
        597: {n: "BrtBeginSmartTagTypes"},
        598: {n: "BrtEndSmartTagTypes"},
        599: {n: "BrtBeginSXFilters"},
        600: {n: "BrtEndSXFilters"},
        601: {n: "BrtBeginSXFILTER"},
        602: {n: "BrtEndSXFilter"},
        603: {n: "BrtBeginFills"},
        604: {n: "BrtEndFills"},
        605: {n: "BrtBeginCellWatches"},
        606: {n: "BrtEndCellWatches"},
        607: {n: "BrtCellWatch"},
        608: {n: "BrtBeginCRErrs"},
        609: {n: "BrtEndCRErrs"},
        610: {n: "BrtCrashRecErr"},
        611: {n: "BrtBeginFonts"},
        612: {n: "BrtEndFonts"},
        613: {n: "BrtBeginBorders"},
        614: {n: "BrtEndBorders"},
        615: {n: "BrtBeginFmts"},
        616: {n: "BrtEndFmts"},
        617: {n: "BrtBeginCellXFs"},
        618: {n: "BrtEndCellXFs"},
        619: {n: "BrtBeginStyles"},
        620: {n: "BrtEndStyles"},
        625: {n: "BrtBigName"},
        626: {n: "BrtBeginCellStyleXFs"},
        627: {n: "BrtEndCellStyleXFs"},
        628: {n: "BrtBeginComments"},
        629: {n: "BrtEndComments"},
        630: {n: "BrtBeginCommentAuthors"},
        631: {n: "BrtEndCommentAuthors"},
        632: {n: "BrtCommentAuthor", f: Yi},
        633: {n: "BrtBeginCommentList"},
        634: {n: "BrtEndCommentList"},
        635: {
            n: "BrtBeginComment", f: function (e) {
                var t = {};
                t.iauthor = e.read_shift(4);
                var r = Sr(e, 16);
                return t.rfx = r.s, t.ref = Kt(r.s), e.l += 16, t
            }
        },
        636: {n: "BrtEndComment"},
        637: {n: "BrtCommentText", f: lr},
        638: {n: "BrtBeginOleObjects"},
        639: {n: "BrtOleObject"},
        640: {n: "BrtEndOleObjects"},
        641: {n: "BrtBeginSxrules"},
        642: {n: "BrtEndSxRules"},
        643: {n: "BrtBeginActiveXControls"},
        644: {n: "BrtActiveX"},
        645: {n: "BrtEndActiveXControls"},
        646: {n: "BrtBeginPCDSDTCEMembersSortBy"},
        648: {n: "BrtBeginCellIgnoreECs"},
        649: {n: "BrtCellIgnoreEC"},
        650: {n: "BrtEndCellIgnoreECs"},
        651: {
            n: "BrtCsProp", f: function (e, t) {
                return e.l += 10, {name: sr(e)}
            }
        },
        652: {n: "BrtCsPageSetup"},
        653: {n: "BrtBeginUserCsViews"},
        654: {n: "BrtEndUserCsViews"},
        655: {n: "BrtBeginUserCsView"},
        656: {n: "BrtEndUserCsView"},
        657: {n: "BrtBeginPcdSFCIEntries"},
        658: {n: "BrtEndPCDSFCIEntries"},
        659: {n: "BrtPCDSFCIEntry"},
        660: {n: "BrtBeginListParts"},
        661: {n: "BrtListPart"},
        662: {n: "BrtEndListParts"},
        663: {n: "BrtSheetCalcProp"},
        664: {n: "BrtBeginFnGroup"},
        665: {n: "BrtFnGroup"},
        666: {n: "BrtEndFnGroup"},
        667: {n: "BrtSupAddin"},
        668: {n: "BrtSXTDMPOrder"},
        669: {n: "BrtCsProtection"},
        671: {n: "BrtBeginWsSortMap"},
        672: {n: "BrtEndWsSortMap"},
        673: {n: "BrtBeginRRSort"},
        674: {n: "BrtEndRRSort"},
        675: {n: "BrtRRSortItem"},
        676: {n: "BrtFileSharingIso"},
        677: {n: "BrtBookProtectionIso"},
        678: {n: "BrtSheetProtectionIso"},
        679: {n: "BrtCsProtectionIso"},
        680: {n: "BrtRangeProtectionIso"},
        1024: {n: "BrtRwDescent"},
        1025: {n: "BrtKnownFonts"},
        1026: {n: "BrtBeginSXTupleSet"},
        1027: {n: "BrtEndSXTupleSet"},
        1028: {n: "BrtBeginSXTupleSetHeader"},
        1029: {n: "BrtEndSXTupleSetHeader"},
        1030: {n: "BrtSXTupleSetHeaderItem"},
        1031: {n: "BrtBeginSXTupleSetData"},
        1032: {n: "BrtEndSXTupleSetData"},
        1033: {n: "BrtBeginSXTupleSetRow"},
        1034: {n: "BrtEndSXTupleSetRow"},
        1035: {n: "BrtSXTupleSetRowItem"},
        1036: {n: "BrtNameExt"},
        1037: {n: "BrtPCDH14"},
        1038: {n: "BrtBeginPCDCalcMem14"},
        1039: {n: "BrtEndPCDCalcMem14"},
        1040: {n: "BrtSXTH14"},
        1041: {n: "BrtBeginSparklineGroup"},
        1042: {n: "BrtEndSparklineGroup"},
        1043: {n: "BrtSparkline"},
        1044: {n: "BrtSXDI14"},
        1045: {n: "BrtWsFmtInfoEx14"},
        1046: {n: "BrtBeginConditionalFormatting14"},
        1047: {n: "BrtEndConditionalFormatting14"},
        1048: {n: "BrtBeginCFRule14"},
        1049: {n: "BrtEndCFRule14"},
        1050: {n: "BrtCFVO14"},
        1051: {n: "BrtBeginDatabar14"},
        1052: {n: "BrtBeginIconSet14"},
        1053: {n: "BrtDVal14"},
        1054: {n: "BrtBeginDVals14"},
        1055: {n: "BrtColor14"},
        1056: {n: "BrtBeginSparklines"},
        1057: {n: "BrtEndSparklines"},
        1058: {n: "BrtBeginSparklineGroups"},
        1059: {n: "BrtEndSparklineGroups"},
        1061: {n: "BrtSXVD14"},
        1062: {n: "BrtBeginSXView14"},
        1063: {n: "BrtEndSXView14"},
        1064: {n: "BrtBeginSXView16"},
        1065: {n: "BrtEndSXView16"},
        1066: {n: "BrtBeginPCD14"},
        1067: {n: "BrtEndPCD14"},
        1068: {n: "BrtBeginExtConn14"},
        1069: {n: "BrtEndExtConn14"},
        1070: {n: "BrtBeginSlicerCacheIDs"},
        1071: {n: "BrtEndSlicerCacheIDs"},
        1072: {n: "BrtBeginSlicerCacheID"},
        1073: {n: "BrtEndSlicerCacheID"},
        1075: {n: "BrtBeginSlicerCache"},
        1076: {n: "BrtEndSlicerCache"},
        1077: {n: "BrtBeginSlicerCacheDef"},
        1078: {n: "BrtEndSlicerCacheDef"},
        1079: {n: "BrtBeginSlicersEx"},
        1080: {n: "BrtEndSlicersEx"},
        1081: {n: "BrtBeginSlicerEx"},
        1082: {n: "BrtEndSlicerEx"},
        1083: {n: "BrtBeginSlicer"},
        1084: {n: "BrtEndSlicer"},
        1085: {n: "BrtSlicerCachePivotTables"},
        1086: {n: "BrtBeginSlicerCacheOlapImpl"},
        1087: {n: "BrtEndSlicerCacheOlapImpl"},
        1088: {n: "BrtBeginSlicerCacheLevelsData"},
        1089: {n: "BrtEndSlicerCacheLevelsData"},
        1090: {n: "BrtBeginSlicerCacheLevelData"},
        1091: {n: "BrtEndSlicerCacheLevelData"},
        1092: {n: "BrtBeginSlicerCacheSiRanges"},
        1093: {n: "BrtEndSlicerCacheSiRanges"},
        1094: {n: "BrtBeginSlicerCacheSiRange"},
        1095: {n: "BrtEndSlicerCacheSiRange"},
        1096: {n: "BrtSlicerCacheOlapItem"},
        1097: {n: "BrtBeginSlicerCacheSelections"},
        1098: {n: "BrtSlicerCacheSelection"},
        1099: {n: "BrtEndSlicerCacheSelections"},
        1100: {n: "BrtBeginSlicerCacheNative"},
        1101: {n: "BrtEndSlicerCacheNative"},
        1102: {n: "BrtSlicerCacheNativeItem"},
        1103: {n: "BrtRangeProtection14"},
        1104: {n: "BrtRangeProtectionIso14"},
        1105: {n: "BrtCellIgnoreEC14"},
        1111: {n: "BrtList14"},
        1112: {n: "BrtCFIcon"},
        1113: {n: "BrtBeginSlicerCachesPivotCacheIDs"},
        1114: {n: "BrtEndSlicerCachesPivotCacheIDs"},
        1115: {n: "BrtBeginSlicers"},
        1116: {n: "BrtEndSlicers"},
        1117: {n: "BrtWbProp14"},
        1118: {n: "BrtBeginSXEdit"},
        1119: {n: "BrtEndSXEdit"},
        1120: {n: "BrtBeginSXEdits"},
        1121: {n: "BrtEndSXEdits"},
        1122: {n: "BrtBeginSXChange"},
        1123: {n: "BrtEndSXChange"},
        1124: {n: "BrtBeginSXChanges"},
        1125: {n: "BrtEndSXChanges"},
        1126: {n: "BrtSXTupleItems"},
        1128: {n: "BrtBeginSlicerStyle"},
        1129: {n: "BrtEndSlicerStyle"},
        1130: {n: "BrtSlicerStyleElement"},
        1131: {n: "BrtBeginStyleSheetExt14"},
        1132: {n: "BrtEndStyleSheetExt14"},
        1133: {n: "BrtBeginSlicerCachesPivotCacheID"},
        1134: {n: "BrtEndSlicerCachesPivotCacheID"},
        1135: {n: "BrtBeginConditionalFormattings"},
        1136: {n: "BrtEndConditionalFormattings"},
        1137: {n: "BrtBeginPCDCalcMemExt"},
        1138: {n: "BrtEndPCDCalcMemExt"},
        1139: {n: "BrtBeginPCDCalcMemsExt"},
        1140: {n: "BrtEndPCDCalcMemsExt"},
        1141: {n: "BrtPCDField14"},
        1142: {n: "BrtBeginSlicerStyles"},
        1143: {n: "BrtEndSlicerStyles"},
        1144: {n: "BrtBeginSlicerStyleElements"},
        1145: {n: "BrtEndSlicerStyleElements"},
        1146: {n: "BrtCFRuleExt"},
        1147: {n: "BrtBeginSXCondFmt14"},
        1148: {n: "BrtEndSXCondFmt14"},
        1149: {n: "BrtBeginSXCondFmts14"},
        1150: {n: "BrtEndSXCondFmts14"},
        1152: {n: "BrtBeginSortCond14"},
        1153: {n: "BrtEndSortCond14"},
        1154: {n: "BrtEndDVals14"},
        1155: {n: "BrtEndIconSet14"},
        1156: {n: "BrtEndDatabar14"},
        1157: {n: "BrtBeginColorScale14"},
        1158: {n: "BrtEndColorScale14"},
        1159: {n: "BrtBeginSxrules14"},
        1160: {n: "BrtEndSxrules14"},
        1161: {n: "BrtBeginPRule14"},
        1162: {n: "BrtEndPRule14"},
        1163: {n: "BrtBeginPRFilters14"},
        1164: {n: "BrtEndPRFilters14"},
        1165: {n: "BrtBeginPRFilter14"},
        1166: {n: "BrtEndPRFilter14"},
        1167: {n: "BrtBeginPRFItem14"},
        1168: {n: "BrtEndPRFItem14"},
        1169: {n: "BrtBeginCellIgnoreECs14"},
        1170: {n: "BrtEndCellIgnoreECs14"},
        1171: {n: "BrtDxf14"},
        1172: {n: "BrtBeginDxF14s"},
        1173: {n: "BrtEndDxf14s"},
        1177: {n: "BrtFilter14"},
        1178: {n: "BrtBeginCustomFilters14"},
        1180: {n: "BrtCustomFilter14"},
        1181: {n: "BrtIconFilter14"},
        1182: {n: "BrtPivotCacheConnectionName"},
        2048: {n: "BrtBeginDecoupledPivotCacheIDs"},
        2049: {n: "BrtEndDecoupledPivotCacheIDs"},
        2050: {n: "BrtDecoupledPivotCacheID"},
        2051: {n: "BrtBeginPivotTableRefs"},
        2052: {n: "BrtEndPivotTableRefs"},
        2053: {n: "BrtPivotTableRef"},
        2054: {n: "BrtSlicerCacheBookPivotTables"},
        2055: {n: "BrtBeginSxvcells"},
        2056: {n: "BrtEndSxvcells"},
        2057: {n: "BrtBeginSxRow"},
        2058: {n: "BrtEndSxRow"},
        2060: {n: "BrtPcdCalcMem15"},
        2067: {n: "BrtQsi15"},
        2068: {n: "BrtBeginWebExtensions"},
        2069: {n: "BrtEndWebExtensions"},
        2070: {n: "BrtWebExtension"},
        2071: {n: "BrtAbsPath15"},
        2072: {n: "BrtBeginPivotTableUISettings"},
        2073: {n: "BrtEndPivotTableUISettings"},
        2075: {n: "BrtTableSlicerCacheIDs"},
        2076: {n: "BrtTableSlicerCacheID"},
        2077: {n: "BrtBeginTableSlicerCache"},
        2078: {n: "BrtEndTableSlicerCache"},
        2079: {n: "BrtSxFilter15"},
        2080: {n: "BrtBeginTimelineCachePivotCacheIDs"},
        2081: {n: "BrtEndTimelineCachePivotCacheIDs"},
        2082: {n: "BrtTimelineCachePivotCacheID"},
        2083: {n: "BrtBeginTimelineCacheIDs"},
        2084: {n: "BrtEndTimelineCacheIDs"},
        2085: {n: "BrtBeginTimelineCacheID"},
        2086: {n: "BrtEndTimelineCacheID"},
        2087: {n: "BrtBeginTimelinesEx"},
        2088: {n: "BrtEndTimelinesEx"},
        2089: {n: "BrtBeginTimelineEx"},
        2090: {n: "BrtEndTimelineEx"},
        2091: {n: "BrtWorkBookPr15"},
        2092: {n: "BrtPCDH15"},
        2093: {n: "BrtBeginTimelineStyle"},
        2094: {n: "BrtEndTimelineStyle"},
        2095: {n: "BrtTimelineStyleElement"},
        2096: {n: "BrtBeginTimelineStylesheetExt15"},
        2097: {n: "BrtEndTimelineStylesheetExt15"},
        2098: {n: "BrtBeginTimelineStyles"},
        2099: {n: "BrtEndTimelineStyles"},
        2100: {n: "BrtBeginTimelineStyleElements"},
        2101: {n: "BrtEndTimelineStyleElements"},
        2102: {n: "BrtDxf15"},
        2103: {n: "BrtBeginDxfs15"},
        2104: {n: "brtEndDxfs15"},
        2105: {n: "BrtSlicerCacheHideItemsWithNoData"},
        2106: {n: "BrtBeginItemUniqueNames"},
        2107: {n: "BrtEndItemUniqueNames"},
        2108: {n: "BrtItemUniqueName"},
        2109: {n: "BrtBeginExtConn15"},
        2110: {n: "BrtEndExtConn15"},
        2111: {n: "BrtBeginOledbPr15"},
        2112: {n: "BrtEndOledbPr15"},
        2113: {n: "BrtBeginDataFeedPr15"},
        2114: {n: "BrtEndDataFeedPr15"},
        2115: {n: "BrtTextPr15"},
        2116: {n: "BrtRangePr15"},
        2117: {n: "BrtDbCommand15"},
        2118: {n: "BrtBeginDbTables15"},
        2119: {n: "BrtEndDbTables15"},
        2120: {n: "BrtDbTable15"},
        2121: {n: "BrtBeginDataModel"},
        2122: {n: "BrtEndDataModel"},
        2123: {n: "BrtBeginModelTables"},
        2124: {n: "BrtEndModelTables"},
        2125: {n: "BrtModelTable"},
        2126: {n: "BrtBeginModelRelationships"},
        2127: {n: "BrtEndModelRelationships"},
        2128: {n: "BrtModelRelationship"},
        2129: {n: "BrtBeginECTxtWiz15"},
        2130: {n: "BrtEndECTxtWiz15"},
        2131: {n: "BrtBeginECTWFldInfoLst15"},
        2132: {n: "BrtEndECTWFldInfoLst15"},
        2133: {n: "BrtBeginECTWFldInfo15"},
        2134: {n: "BrtFieldListActiveItem"},
        2135: {n: "BrtPivotCacheIdVersion"},
        2136: {n: "BrtSXDI15"},
        2137: {n: "BrtBeginModelTimeGroupings"},
        2138: {n: "BrtEndModelTimeGroupings"},
        2139: {n: "BrtBeginModelTimeGrouping"},
        2140: {n: "BrtEndModelTimeGrouping"},
        2141: {n: "BrtModelTimeGroupingCalcCol"},
        3072: {n: "BrtUid"},
        3073: {n: "BrtRevisionPtr"},
        5095: {n: "BrtBeginCalcFeatures"},
        5096: {n: "BrtEndCalcFeatures"},
        5097: {n: "BrtCalcFeature"},
        65535: {n: ""}
    }, Xc = w(Wc, "n"), jc = {
        3: {
            n: "BIFF2NUM", f: function (e) {
                var t = qn(e);
                ++e.l;
                var r = yr(e);
                return t.t = "n", t.val = r, t
            }
        },
        4: {
            n: "BIFF2STR", f: function (e, t, r) {
                var n = qn(e);
                ++e.l;
                var a = $n(e, 0, r);
                return n.t = "str", n.val = a, n
            }
        },
        6: {n: "Formula", f: Ho},
        9: {n: "BOF", f: ca},
        10: {n: "EOF", f: Ln},
        12: {n: "CalcCount", f: Hn},
        13: {n: "CalcMode", f: Hn},
        14: {n: "CalcPrecision", f: Mn},
        15: {n: "CalcRefMode", f: Mn},
        16: {n: "CalcDelta", f: yr},
        17: {n: "CalcIter", f: Mn},
        18: {n: "Protect", f: Mn},
        19: {n: "Password", f: Hn},
        20: {n: "Header", f: Ea},
        21: {n: "Footer", f: Ea},
        23: {n: "ExternSheet", f: ya},
        24: {n: "Lbl", f: _a},
        25: {n: "WinProtect", f: Mn},
        26: {n: "VerticalPageBreaks"},
        27: {n: "HorizontalPageBreaks"},
        28: {
            n: "Note", f: function (e, t, r) {
                return function (e, t) {
                    if (!(t.biff < 8)) {
                        var r = e.read_shift(2), n = e.read_shift(2), a = e.read_shift(2), s = e.read_shift(2),
                            i = $n(e, 0, t);
                        return t.biff < 8 && e.read_shift(1), [{r: r, c: n}, i, s, a]
                    }
                }(e, r)
            }
        },
        29: {n: "Selection"},
        34: {n: "Date1904", f: Mn},
        35: {n: "ExternName", f: wa},
        38: {n: "LeftMargin", f: yr},
        39: {n: "RightMargin", f: yr},
        40: {n: "TopMargin", f: yr},
        41: {n: "BottomMargin", f: yr},
        42: {n: "PrintRowCol", f: Mn},
        43: {n: "PrintGrid", f: Mn},
        47: {
            n: "FilePass", f: function (e, t, r) {
                var n, a, s, i, o = {Type: 8 <= r.biff ? e.read_shift(2) : 0};
                return o.Type ? js(e, t - 2, o) : (n = e, r.biff, a = r, s = o, i = {
                    key: Hn(n),
                    verificationBytes: Hn(n)
                }, a.password && (i.verifier = Ms(a.password)), s.valid = i.verificationBytes === i.verifier, s.valid && (s.insitu = Xs(a.password))), o
            }
        },
        49: {
            n: "Font", f: function (e, t, r) {
                var n = {dyHeight: e.read_shift(2), fl: e.read_shift(2)};
                switch (r && r.biff || 8) {
                    case 2:
                        break;
                    case 3:
                    case 4:
                        e.l += 2;
                        break;
                    default:
                        e.l += 10
                }
                return n.name = Wn(e, 0, r), n
            }
        },
        51: {n: "PrintSize", f: Hn},
        60: {n: "Continue"},
        61: {
            n: "Window1", f: function (e) {
                return {
                    Pos: [e.read_shift(2), e.read_shift(2)],
                    Dim: [e.read_shift(2), e.read_shift(2)],
                    Flags: e.read_shift(2),
                    CurTab: e.read_shift(2),
                    FirstTab: e.read_shift(2),
                    Selected: e.read_shift(2),
                    TabRatio: e.read_shift(2)
                }
            }
        },
        64: {n: "Backup", f: Mn},
        65: {n: "Pane"},
        66: {n: "CodePage", f: Hn},
        77: {n: "Pls"},
        80: {n: "DCon"},
        81: {n: "DConRef"},
        82: {n: "DConName"},
        85: {n: "DefColWidth", f: Hn},
        89: {n: "XCT"},
        90: {n: "CRN"},
        91: {n: "FileSharing"},
        92: {
            n: "WriteAccess", f: function (e, t, r) {
                if (r.enc) return e.l += t, "";
                var n = e.l, a = $n(e, 0, r);
                return e.read_shift(t + n - e.l), a
            }
        },
        93: {
            n: "Obj", f: function (e, t, r) {
                if (r && r.biff < 8) return function (e, t, r) {
                    e.l += 4;
                    var n = e.read_shift(2), a = e.read_shift(2), s = e.read_shift(2);
                    e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 6, t -= 36;
                    var i = [];
                    return i.push((Ba[n] || Dt)(e, t, r)), {cmo: [a, n, s], ft: i}
                }(e, t, r);
                var n = ia(e);
                return {
                    cmo: n, ft: function (t, e) {
                        for (var r = t.l + e, n = []; t.l < r;) {
                            var a = t.read_shift(2);
                            t.l -= 2;
                            try {
                                n.push(la[a](t, r - t.l))
                            } catch (e) {
                                return t.l = r, n
                            }
                        }
                        return t.l != r && (t.l = r), n
                    }(e, t - 22, n[1])
                }
            }
        },
        94: {n: "Uncalced"},
        95: {n: "CalcSaveRecalc", f: Mn},
        96: {n: "Template"},
        97: {n: "Intl"},
        99: {n: "ObjProtect", f: Mn},
        125: {n: "ColInfo", f: xa},
        128: {
            n: "Guts", f: function (e) {
                e.l += 4;
                var t = [e.read_shift(2), e.read_shift(2)];
                if (0 !== t[0] && t[0]--, 0 !== t[1] && t[1]--, 7 < t[0] || 7 < t[1]) throw new Error("Bad Gutters: " + t.join("|"));
                return t
            }
        },
        129: {
            n: "WsBool", f: function (e, t, r) {
                return {fDialog: 16 & (r && 8 == r.biff || 2 == t ? e.read_shift(2) : (e.l += t, 0))}
            }
        },
        130: {n: "GridSet", f: Hn},
        131: {n: "HCenter", f: Mn},
        132: {n: "VCenter", f: Mn},
        133: {
            n: "BoundSheet8", f: function (e, t, r) {
                var n = e.read_shift(4), a = 3 & e.read_shift(1), s = e.read_shift(1);
                switch (s) {
                    case 0:
                        s = "Worksheet";
                        break;
                    case 1:
                        s = "Macrosheet";
                        break;
                    case 2:
                        s = "Chartsheet";
                        break;
                    case 6:
                        s = "VBAModule"
                }
                var i = Wn(e, 0, r);
                return 0 === i.length && (i = "Sheet1"), {pos: n, hs: a, dt: s, name: i}
            }
        },
        134: {n: "WriteProtect"},
        140: {
            n: "Country", f: function (e) {
                var t, r = [0, 0];
                return t = e.read_shift(2), r[0] = Ur[t] || t, t = e.read_shift(2), r[1] = Ur[t] || t, r
            }
        },
        141: {n: "HideObj", f: Hn},
        144: {n: "Sort"},
        146: {
            n: "Palette", f: function (e) {
                for (var t = e.read_shift(2), r = []; 0 < t--;) r.push(Jn(e));
                return r
            }
        },
        151: {n: "Sync"},
        152: {n: "LPr"},
        153: {n: "DxGCol"},
        154: {n: "FnGroupName"},
        155: {n: "FilterMode"},
        156: {n: "BuiltInFnGroupCount", f: Hn},
        157: {n: "AutoFilterInfo"},
        158: {n: "AutoFilter"},
        160: {n: "Scl", f: Ia},
        161: {
            n: "Setup", f: function (e, t) {
                var r = {};
                return t < 32 || (e.l += 16, r.header = yr(e), r.footer = yr(e), e.l += 2), r
            }
        },
        174: {n: "ScenMan"},
        175: {n: "SCENARIO"},
        176: {n: "SxView"},
        177: {n: "Sxvd"},
        178: {n: "SXVI"},
        180: {n: "SxIvd"},
        181: {n: "SXLI"},
        182: {n: "SXPI"},
        184: {n: "DocRoute"},
        185: {n: "RecipName"},
        189: {
            n: "MulRk", f: function (e, t) {
                for (var r = e.l + t - 2, n = e.read_shift(2), a = e.read_shift(2), s = []; e.l < r;) s.push(ta(e));
                if (e.l !== r) throw new Error("MulRK read error");
                var i = e.read_shift(2);
                if (s.length != i - a + 1) throw new Error("MulRK length mismatch");
                return {r: n, c: a, C: i, rkrec: s}
            }
        },
        190: {
            n: "MulBlank", f: function (e, t) {
                for (var r = e.l + t - 2, n = e.read_shift(2), a = e.read_shift(2), s = []; e.l < r;) s.push(e.read_shift(2));
                if (e.l !== r) throw new Error("MulBlank read error");
                var i = e.read_shift(2);
                if (s.length != i - a + 1) throw new Error("MulBlank length mismatch");
                return {r: n, c: a, C: i, ixfe: s}
            }
        },
        193: {n: "Mms", f: Ln},
        197: {n: "SXDI"},
        198: {n: "SXDB"},
        199: {n: "SXFDB"},
        200: {n: "SXDBB"},
        201: {n: "SXNum"},
        202: {n: "SxBool", f: Mn},
        203: {n: "SxErr"},
        204: {n: "SXInt"},
        205: {n: "SXString"},
        206: {n: "SXDtr"},
        207: {n: "SxNil"},
        208: {n: "SXTbl"},
        209: {n: "SXTBRGIITM"},
        210: {n: "SxTbpg"},
        211: {n: "ObProj"},
        213: {n: "SXStreamID"},
        215: {n: "DBCell"},
        216: {n: "SXRng"},
        217: {n: "SxIsxoper"},
        218: {n: "BookBool", f: Hn},
        220: {n: "DbOrParamQry"},
        221: {n: "ScenarioProtect", f: Mn},
        222: {n: "OleObjectSize"},
        224: {
            n: "XF", f: function (e, t, r) {
                var n, a, s, i, o, l, c, f = {};
                return f.ifnt = e.read_shift(2), f.numFmtId = e.read_shift(2), f.flags = e.read_shift(2), f.fStyle = f.flags >> 2 & 1, f.data = (n = e, f.fStyle, a = r, s = {}, i = n.read_shift(4), o = n.read_shift(4), l = n.read_shift(4), c = n.read_shift(2), s.patternType = Hr[l >> 26], a.cellStyles && (s.alc = 7 & i, s.fWrap = i >> 3 & 1, s.alcV = i >> 4 & 7, s.fJustLast = i >> 7 & 1, s.trot = i >> 8 & 255, s.cIndent = i >> 16 & 15, s.fShrinkToFit = i >> 20 & 1, s.iReadOrder = i >> 22 & 2, s.fAtrNum = i >> 26 & 1, s.fAtrFnt = i >> 27 & 1, s.fAtrAlc = i >> 28 & 1, s.fAtrBdr = i >> 29 & 1, s.fAtrPat = i >> 30 & 1, s.fAtrProt = i >> 31 & 1, s.dgLeft = 15 & o, s.dgRight = o >> 4 & 15, s.dgTop = o >> 8 & 15, s.dgBottom = o >> 12 & 15, s.icvLeft = o >> 16 & 127, s.icvRight = o >> 23 & 127, s.grbitDiag = o >> 30 & 3, s.icvTop = 127 & l, s.icvBottom = l >> 7 & 127, s.icvDiag = l >> 14 & 127, s.dgDiag = l >> 21 & 15, s.icvFore = 127 & c, s.icvBack = c >> 7 & 127, s.fsxButton = c >> 14 & 1), s), f
            }
        },
        225: {
            n: "InterfaceHdr", f: function (e, t) {
                return 0 === t || e.read_shift(2), 1200
            }
        },
        226: {n: "InterfaceEnd", f: Ln},
        227: {n: "SXVS"},
        229: {
            n: "MergeCells", f: function (e, t) {
                for (var r = [], n = e.read_shift(2); n--;) r.push(ra(e));
                return r
            }
        },
        233: {n: "BkHim"},
        235: {n: "MsoDrawingGroup"},
        236: {n: "MsoDrawing"},
        237: {n: "MsoDrawingSelection"},
        239: {n: "PhoneticInfo"},
        240: {n: "SxRule"},
        241: {n: "SXEx"},
        242: {n: "SxFilt"},
        244: {n: "SxDXF"},
        245: {n: "SxItm"},
        246: {n: "SxName"},
        247: {n: "SxSelect"},
        248: {n: "SXPair"},
        249: {n: "SxFmla"},
        251: {n: "SxFormat"},
        252: {
            n: "SST", f: function (e, t) {
                for (var r = e.l + t, n = e.read_shift(4), a = e.read_shift(4), s = [], i = 0; i != a && e.l < r; ++i) s.push(Xn(e));
                return s.Count = n, s.Unique = a, s
            }
        },
        253: {
            n: "LabelSst", f: function (e) {
                var t = qn(e);
                return t.isst = e.read_shift(4), t
            }
        },
        255: {
            n: "ExtSST", f: function (e, t) {
                var r = {};
                return r.dsst = e.read_shift(2), e.l += t - 2, r
            }
        },
        256: {n: "SXVDEx"},
        259: {n: "SXFormula"},
        290: {n: "SXDBEx"},
        311: {n: "RRDInsDel"},
        312: {n: "RRDHead"},
        315: {n: "RRDChgCell"},
        317: {n: "RRTabId", f: Vn},
        318: {n: "RRDRenSheet"},
        319: {n: "RRSort"},
        320: {n: "RRDMove"},
        330: {n: "RRFormat"},
        331: {n: "RRAutoFmt"},
        333: {n: "RRInsertSh"},
        334: {n: "RRDMoveBegin"},
        335: {n: "RRDMoveEnd"},
        336: {n: "RRDInsDelBegin"},
        337: {n: "RRDInsDelEnd"},
        338: {n: "RRDConflict"},
        339: {n: "RRDDefName"},
        340: {n: "RRDRstEtxp"},
        351: {n: "LRng"},
        352: {n: "UsesELFs", f: Mn},
        353: {n: "DSF", f: Ln},
        401: {n: "CUsr"},
        402: {n: "CbUsr"},
        403: {n: "UsrInfo"},
        404: {n: "UsrExcl"},
        405: {n: "FileLock"},
        406: {n: "RRDInfo"},
        407: {n: "BCUsrs"},
        408: {n: "UsrChk"},
        425: {n: "UserBView"},
        426: {n: "UserSViewBegin"},
        427: {n: "UserSViewEnd"},
        428: {n: "RRDUserView"},
        429: {n: "Qsi"},
        430: {
            n: "SupBook", f: function (e, t, r) {
                var n = e.l + t, a = e.read_shift(2), s = e.read_shift(2);
                if (1025 == (r.sbcch = s) || 14849 == s) return [s, a];
                if (s < 1 || 255 < s) throw new Error("Unexpected SupBook type: " + s);
                for (var i = jn(e, s), o = []; n > e.l;) o.push(Gn(e));
                return [s, a, i, o]
            }
        },
        431: {n: "Prot4Rev", f: Mn},
        432: {n: "CondFmt"},
        433: {n: "CF"},
        434: {n: "DVal"},
        437: {n: "DConBin"},
        438: {
            n: "TxO", f: function (t, r, e) {
                var n = t.l, a = "";
                try {
                    t.l += 4;
                    var s = (e.lastobj || {cmo: [0, 0]}).cmo[1];
                    -1 == [0, 5, 7, 11, 12, 14].indexOf(s) ? t.l += 6 : function (e) {
                        var t = e.read_shift(1);
                        e.l++;
                        var r = e.read_shift(2);
                        e.l += 2
                    }(t);
                    var i = t.read_shift(2);
                    t.read_shift(2), Hn(t);
                    var o = t.read_shift(2);
                    t.l += o;
                    for (var l = 1; l < t.lens.length - 1; ++l) {
                        if (t.l - n != t.lens[l]) throw new Error("TxO: bad continue record");
                        var c = t[t.l];
                        if ((a += jn(t, t.lens[l + 1] - t.lens[l] - 1)).length >= (c ? i : 2 * i)) break
                    }
                    if (a.length !== i && a.length !== 2 * i) throw new Error("cchText: " + i + " != " + a.length);
                    return t.l = n + r, {t: a}
                } catch (e) {
                    return t.l = n + r, {t: a}
                }
            }
        },
        439: {n: "RefreshAll", f: Mn},
        440: {
            n: "HLink", f: function (e, t) {
                var r = ra(e);
                return e.l += 16, [r, function (e, t) {
                    var r = e.l + t, n = e.read_shift(4);
                    if (2 !== n) throw new Error("Unrecognized streamVersion: " + n);
                    var a = e.read_shift(2);
                    e.l += 2;
                    var s, i, o, l, c, f, h = "";
                    16 & a && (s = Zn(e, e.l)), 128 & a && (i = Zn(e, e.l)), 257 == (257 & a) && (o = Zn(e, e.l)), 1 == (257 & a) && (l = Kn(e, e.l)), 8 & a && (h = Zn(e, e.l)), 32 & a && (c = e.read_shift(16)), 64 & a && (f = wn(e)), e.l = r;
                    var u = i || o || l || "";
                    u && h && (u += "#" + h);
                    var d = {Target: u = u || "#" + h};
                    return c && (d.guid = c), f && (d.time = f), s && (d.Tooltip = s), d
                }(e, t - 24)]
            }
        },
        441: {n: "Lel"},
        442: {n: "CodeName", f: Gn},
        443: {n: "SXFDBType"},
        444: {n: "Prot4RevPass", f: Hn},
        445: {n: "ObNoMacros"},
        446: {n: "Dv"},
        448: {n: "Excel9File", f: Ln},
        449: {
            n: "RecalcId", f: function (e) {
                return e.read_shift(2), e.read_shift(4)
            }, r: 2
        },
        450: {n: "EntExU2", f: Ln},
        512: {n: "Dimensions", f: ma},
        513: {n: "Blank", f: Aa},
        515: {
            n: "Number", f: function (e) {
                var t = qn(e), r = yr(e);
                return t.val = r, t
            }
        },
        516: {
            n: "Label", f: function (e, t, r) {
                e.l;
                var n = qn(e);
                2 == r.biff && e.l++;
                var a = Gn(e, e.l, r);
                return n.val = a, n
            }
        },
        517: {n: "BoolErr", f: ba},
        518: {n: "Formula", f: Ho},
        519: {n: "String", f: Ra},
        520: {
            n: "Row", f: function (e) {
                var t = {};
                t.r = e.read_shift(2), t.c = e.read_shift(2), t.cnt = e.read_shift(2) - t.c;
                var r = e.read_shift(2);
                e.l += 4;
                var n = e.read_shift(1);
                return e.l += 3, 7 & n && (t.level = 7 & n), 32 & n && (t.hidden = !0), 64 & n && (t.hpt = r / 20), t
            }
        },
        523: {n: "Index"},
        545: {n: "Array", f: Ca},
        549: {n: "DefaultRowHeight", f: ua},
        566: {n: "Table"},
        574: {
            n: "Window2", f: function (e, t, r) {
                return r && 2 <= r.biff && r.biff < 8 ? {} : {RTL: 64 & e.read_shift(2)}
            }
        },
        638: {
            n: "RK", f: function (e) {
                var t = e.read_shift(2), r = e.read_shift(2), n = ta(e);
                return {r: t, c: r, ixfe: n[0], rknum: n[1]}
            }
        },
        659: {n: "Style"},
        1030: {n: "Formula", f: Ho},
        1048: {n: "BigName"},
        1054: {
            n: "Format", f: function (e, t, r) {
                return [e.read_shift(2), $n(e, 0, r)]
            }
        },
        1084: {n: "ContinueBigName"},
        1212: {
            n: "ShrFmla", f: function (e, t, r) {
                var n = aa(e);
                e.l++;
                var a = e.read_shift(1);
                return [function (e, t, r) {
                    var n, a = e.l + t, s = e.read_shift(2), i = Po(e, s, r);
                    if (65535 == s) return [[], Dt(e, t - 2)];
                    t !== s + 2 && (n = Do(e, a - s - 2, i, r));
                    return [i, n]
                }(e, t -= 8, r), a, n]
            }
        },
        2048: {
            n: "HLinkTooltip", f: function (e, t) {
                e.read_shift(2);
                var r = ra(e), n = e.read_shift((t - 10) / 2, "dbcs-cont");
                return [r, n = n.replace(oe, "")]
            }
        },
        2049: {n: "WebPub"},
        2050: {n: "QsiSXTag"},
        2051: {n: "DBQueryExt"},
        2052: {n: "ExtString"},
        2053: {n: "TxtQry"},
        2054: {n: "Qsir"},
        2055: {n: "Qsif"},
        2056: {n: "RRDTQSIF"},
        2057: {n: "BOF", f: ca},
        2058: {n: "OleDbConn"},
        2059: {n: "WOpt"},
        2060: {n: "SXViewEx"},
        2061: {n: "SXTH"},
        2062: {n: "SXPIEx"},
        2063: {n: "SXVDTEx"},
        2064: {n: "SXViewEx9"},
        2066: {n: "ContinueFrt"},
        2067: {n: "RealTimeData"},
        2128: {n: "ChartFrtInfo"},
        2129: {n: "FrtWrapper"},
        2130: {n: "StartBlock"},
        2131: {n: "EndBlock"},
        2132: {n: "StartObject"},
        2133: {n: "EndObject"},
        2134: {n: "CatLab"},
        2135: {n: "YMult"},
        2136: {n: "SXViewLink"},
        2137: {n: "PivotChartBits"},
        2138: {n: "FrtFontList"},
        2146: {n: "SheetExt"},
        2147: {n: "BookExt", r: 12},
        2148: {n: "SXAddl"},
        2149: {n: "CrErr"},
        2150: {n: "HFPicture"},
        2151: {n: "FeatHdr", f: Ln},
        2152: {n: "Feat"},
        2154: {n: "DataLabExt"},
        2155: {n: "DataLabExtContents"},
        2156: {n: "CellWatch"},
        2161: {n: "FeatHdr11"},
        2162: {n: "Feature11"},
        2164: {n: "DropDownObjIds"},
        2165: {n: "ContinueFrt11"},
        2166: {n: "DConn"},
        2167: {n: "List12"},
        2168: {n: "Feature12"},
        2169: {n: "CondFmt12"},
        2170: {n: "CF12"},
        2171: {n: "CFEx"},
        2172: {
            n: "XFCRC", f: function (e) {
                e.l += 2;
                var t = {cxfs: 0, crc: 0};
                return t.cxfs = e.read_shift(2), t.crc = e.read_shift(4), t
            }, r: 12
        },
        2173: {
            n: "XFExt", f: function (e, t) {
                e.l, e.l += 2;
                var r = e.read_shift(2);
                e.l += 2;
                for (var n = e.read_shift(2), a = []; 0 < n--;) a.push(Wi(e, e.l));
                return {ixfe: r, ext: a}
            }, r: 12
        },
        2174: {n: "AutoFilter12"},
        2175: {n: "ContinueFrt12"},
        2180: {n: "MDTInfo"},
        2181: {n: "MDXStr"},
        2182: {n: "MDXTuple"},
        2183: {n: "MDXSet"},
        2184: {n: "MDXProp"},
        2185: {n: "MDXKPI"},
        2186: {n: "MDB"},
        2187: {n: "PLV"},
        2188: {n: "Compat12", f: Mn, r: 12},
        2189: {n: "DXF"},
        2190: {n: "TableStyles", r: 12},
        2191: {n: "TableStyle"},
        2192: {n: "TableStyleElement"},
        2194: {n: "StyleExt"},
        2195: {n: "NamePublish"},
        2196: {
            n: "NameCmt", f: function (e, t, r) {
                if (!(r.biff < 8)) {
                    var n = e.read_shift(2), a = e.read_shift(2);
                    return [jn(e, n, r), jn(e, a, r)]
                }
                e.l += t
            }, r: 12
        },
        2197: {n: "SortData"},
        2198: {
            n: "Theme", f: function (e, t, r) {
                var n = e.l + t;
                if (124226 !== e.read_shift(4)) if (r.cellStyles && I) {
                    var a, s = e.slice(e.l);
                    e.l = n;
                    try {
                        a = new I(s)
                    } catch (e) {
                        return
                    }
                    var i = U(a, "theme/theme/theme1.xml", !0);
                    if (i) return Hi(i, r)
                } else e.l = n
            }, r: 12
        },
        2199: {n: "GUIDTypeLib"},
        2200: {n: "FnGrp12"},
        2201: {n: "NameFnGrp12"},
        2202: {
            n: "MTRSettings", f: function (e) {
                return [0 !== e.read_shift(4), 0 !== e.read_shift(4), e.read_shift(4)]
            }, r: 12
        },
        2203: {n: "CompressPictures", f: Ln},
        2204: {n: "HeaderFooter"},
        2205: {n: "CrtLayout12"},
        2206: {n: "CrtMlFrt"},
        2207: {n: "CrtMlFrtContinue"},
        2211: {
            n: "ForceFullCalculation", f: function (e) {
                var t, r, n, a = (r = (t = e).read_shift(2), n = t.read_shift(2), t.l += 8, {type: r, flags: n});
                if (2211 != a.type) throw new Error("Invalid Future Record " + a.type);
                return 0 !== e.read_shift(4)
            }
        },
        2212: {n: "ShapePropsStream"},
        2213: {n: "TextPropsStream"},
        2214: {n: "RichTextStream"},
        2215: {n: "CrtLayout12A"},
        4097: {n: "Units"},
        4098: {n: "Chart"},
        4099: {n: "Series"},
        4102: {n: "DataFormat"},
        4103: {n: "LineFormat"},
        4105: {n: "MarkerFormat"},
        4106: {n: "AreaFormat"},
        4107: {n: "PieFormat"},
        4108: {n: "AttachedLabel"},
        4109: {n: "SeriesText"},
        4116: {n: "ChartFormat"},
        4117: {n: "Legend"},
        4118: {n: "SeriesList"},
        4119: {n: "Bar"},
        4120: {n: "Line"},
        4121: {n: "Pie"},
        4122: {n: "Area"},
        4123: {n: "Scatter"},
        4124: {n: "CrtLine"},
        4125: {n: "Axis"},
        4126: {n: "Tick"},
        4127: {n: "ValueRange"},
        4128: {n: "CatSerRange"},
        4129: {n: "AxisLine"},
        4130: {n: "CrtLink"},
        4132: {n: "DefaultText"},
        4133: {n: "Text"},
        4134: {n: "FontX", f: Hn},
        4135: {n: "ObjectLink"},
        4146: {n: "Frame"},
        4147: {n: "Begin"},
        4148: {n: "End"},
        4149: {n: "PlotArea"},
        4154: {n: "Chart3d"},
        4156: {n: "PicF"},
        4157: {n: "DropBar"},
        4158: {n: "Radar"},
        4159: {n: "Surf"},
        4160: {n: "RadarArea"},
        4161: {n: "AxisParent"},
        4163: {n: "LegendException"},
        4164: {
            n: "ShtProps", f: function (e, t, r) {
                var n = {area: !1};
                if (5 != r.biff) return e.l += t, n;
                var a = e.read_shift(1);
                return e.l += 3, 16 & a && (n.area = !0), n
            }
        },
        4165: {n: "SerToCrt"},
        4166: {n: "AxesUsed"},
        4168: {n: "SBaseRef"},
        4170: {n: "SerParent"},
        4171: {n: "SerAuxTrend"},
        4174: {n: "IFmtRecord"},
        4175: {n: "Pos"},
        4176: {n: "AlRuns"},
        4177: {n: "BRAI"},
        4187: {n: "SerAuxErrBar"},
        4188: {
            n: "ClrtClient", f: function (e) {
                for (var t = e.read_shift(2), r = []; 0 < t--;) r.push(Jn(e));
                return r
            }
        },
        4189: {n: "SerFmt"},
        4191: {n: "Chart3DBarShape"},
        4192: {n: "Fbi"},
        4193: {n: "BopPop"},
        4194: {n: "AxcExt"},
        4195: {n: "Dat"},
        4196: {n: "PlotGrowth"},
        4197: {n: "SIIndex"},
        4198: {n: "GelFrame"},
        4199: {n: "BopPopCustom"},
        4200: {n: "Fbi2"},
        0: {n: "Dimensions", f: ma},
        2: {
            n: "BIFF2INT", f: function (e) {
                var t = qn(e);
                ++e.l;
                var r = e.read_shift(2);
                return t.t = "n", t.val = r, t
            }
        },
        5: {n: "BoolErr", f: ba},
        7: {
            n: "String", f: function (e) {
                var t = e.read_shift(1);
                return 0 === t ? (e.l++, "") : e.read_shift(t, "sbcs-cont")
            }
        },
        8: {n: "BIFF2ROW"},
        11: {n: "Index"},
        22: {n: "ExternCount", f: Hn},
        30: {n: "BIFF2FORMAT", f: pa},
        31: {n: "BIFF2FMTCNT"},
        32: {n: "BIFF2COLINFO"},
        33: {n: "Array", f: Ca},
        37: {n: "DefaultRowHeight", f: ua},
        50: {
            n: "BIFF2FONTXTRA", f: function (e, t) {
                e.l += 6, e.l += 2, e.l += 1, e.l += 3, e.l += 1, e.l += t - 13
            }
        },
        52: {n: "DDEObjName"},
        62: {n: "BIFF2WINDOW2"},
        67: {n: "BIFF2XF"},
        69: {n: "BIFF2FONTCLR"},
        86: {n: "BIFF4FMTCNT"},
        126: {n: "RK"},
        127: {
            n: "ImData", f: function (e) {
                var t = e.read_shift(2), r = e.read_shift(2), n = e.read_shift(4),
                    a = {fmt: t, env: r, len: n, data: e.slice(e.l, e.l + n)};
                return e.l += n, a
            }
        },
        135: {n: "Addin"},
        136: {n: "Edg"},
        137: {n: "Pub"},
        145: {n: "Sub"},
        148: {n: "LHRecord"},
        149: {n: "LHNGraph"},
        150: {n: "Sound"},
        169: {n: "CoordList"},
        171: {n: "GCW"},
        188: {n: "ShrFmla"},
        191: {n: "ToolbarHdr"},
        192: {n: "ToolbarEnd"},
        194: {n: "AddMenu"},
        195: {n: "DelMenu"},
        214: {
            n: "RString", f: function (e, t, r) {
                var n = e.l + t, a = qn(e), s = e.read_shift(2), i = jn(e, s, r);
                return e.l = n, a.t = "str", a.val = i, a
            }
        },
        223: {n: "UDDesc"},
        234: {n: "TabIdConf"},
        354: {n: "XL5Modify"},
        421: {n: "FileSharing2"},
        521: {n: "BOF", f: ca},
        536: {n: "Lbl", f: _a},
        547: {n: "ExternName", f: wa},
        561: {n: "Font"},
        579: {n: "BIFF3XF"},
        1033: {n: "BOF", f: ca},
        1091: {n: "BIFF4XF"},
        2157: {n: "FeatInfo"},
        2163: {n: "FeatInfo11"},
        2177: {n: "SXAddl12"},
        2240: {n: "AutoWebPub"},
        2241: {n: "ListObj"},
        2242: {n: "ListField"},
        2243: {n: "ListDV"},
        2244: {n: "ListCondFmt"},
        2245: {n: "ListCF"},
        2246: {n: "FMQry"},
        2247: {n: "FMSQry"},
        2248: {n: "PLV"},
        2249: {n: "LnExt"},
        2250: {n: "MkrExt"},
        2251: {n: "CrtCoopt"},
        2262: {n: "FRTArchId$", r: 12},
        29282: {}
    }, Gc = w(jc, "n");

    function $c(e, t, r, n) {
        var a = +t || +Gc[t];
        if (!isNaN(a)) {
            var s = n || (r || []).length || 0, i = e.next(4);
            i.write_shift(2, a), i.write_shift(2, s), 0 < s && wt(r) && e.push(r)
        }
    }

    function Yc(e, t, r) {
        return (e = e || Pt(7)).write_shift(2, t), e.write_shift(2, r), e.write_shift(2, 0), e.write_shift(1, 0), e
    }

    function Kc(e, t, r, n) {
        if (null != t.v) switch (t.t) {
            case"d":
            case"n":
                var a = "d" == t.t ? K(Q(t.v)) : t.v;
                return void (a == (0 | a) && 0 <= a && a < 65536 ? $c(e, 2, (v = r, E = n, w = a, Yc(S = Pt(9), v, E), S.write_shift(2, w), S)) : $c(e, 3, (p = r, m = n, g = a, Yc(b = Pt(15), p, m), b.write_shift(8, g, "f"), b)));
            case"b":
            case"e":
                return void $c(e, 5, (c = r, f = n, h = t.v, u = t.t, Yc(d = Pt(9), c, f), "e" == u ? (d.write_shift(1, h), d.write_shift(1, 1)) : (d.write_shift(1, h ? 1 : 0), d.write_shift(1, 0)), d));
            case"s":
            case"str":
                return void $c(e, 4, (s = r, i = n, o = t.v, Yc(l = Pt(8 + 2 * o.length), s, i), l.write_shift(1, o.length), l.write_shift(o.length, o, "sbcs"), l.l < l.length ? l.slice(0, l.l) : l))
        }
        var s, i, o, l, c, f, h, u, d, p, m, g, b, v, E, w, S;
        $c(e, 1, Yc(null, r, n))
    }

    function Zc(e, t) {
        var r = t || {};
        null != ue && null == r.dense && (r.dense = ue);
        for (var n = Lt(), a = 0, s = 0; s < e.SheetNames.length; ++s) e.SheetNames[s] == r.sheet && (a = s);
        if (0 == a && r.sheet && e.SheetNames[0] != r.sheet) throw new Error("Sheet not found: " + r.sheet);
        return $c(n, 9, fa(0, 16, r)), function (e, t, r) {
            var n, a = Array.isArray(t), s = Jt(t["!ref"] || "A1"), i = "", o = [];
            if (255 < s.e.c || 16383 < s.e.r) {
                if (r.WTF) throw new Error("Range " + (t["!ref"] || "A1") + " exceeds format limit A1:IV16384");
                s.e.c = Math.min(s.e.c, 255), s.e.r = Math.min(s.e.c, 16383), n = Qt(s)
            }
            for (var l = s.s.r; l <= s.e.r; ++l) {
                i = Xt(l);
                for (var c = s.s.c; c <= s.e.c; ++c) {
                    l === s.s.r && (o[c] = Gt(c)), n = o[c] + i;
                    var f = a ? (t[l] || [])[c] : t[n];
                    f && Kc(e, f, l, c)
                }
            }
        }(n, e.Sheets[e.SheetNames[a]], r), $c(n, 10), n.end()
    }

    function Qc(e, t, r) {
        var n, a, s, i, o;
        $c(e, "Font", (s = (n = {
            sz: 12,
            color: {theme: 1},
            name: "Arial",
            family: 2,
            scheme: "minor"
        }).name || "Arial", i = (a = r) && 5 == a.biff, (o = Pt(i ? 15 + s.length : 16 + 2 * s.length)).write_shift(2, 20 * (n.sz || 12)), o.write_shift(4, 0), o.write_shift(2, 400), o.write_shift(4, 0), o.write_shift(2, 0), o.write_shift(1, s.length), i || o.write_shift(1, 1), o.write_shift((i ? 1 : 2) * s.length, s, i ? "sbcs" : "utf16le"), o))
    }

    function Jc(e, t, r, n, a) {
        var s, i, o, l, c, f, h, u, d, p, m, g, b = 16 + al(a.cellXfs, t, a);
        if (null != t.v) switch (t.t) {
            case"d":
            case"n":
                var v = "d" == t.t ? K(Q(t.v)) : t.v;
                return void $c(e, "Number", (u = r, d = n, p = v, m = b, g = Pt(14), ea(u, d, m, g), Cr(p, g), g));
            case"b":
            case"e":
                return void $c(e, 517, va(r, n, t.v, b, 0, t.t));
            case"s":
            case"str":
                return void $c(e, "Label", (s = r, i = n, o = t.v, l = b, f = !(c = a) || 8 == c.biff, h = Pt(+f + 8 + (1 + f) * o.length), ea(s, i, l, h), h.write_shift(2, o.length), f && h.write_shift(1, 1), h.write_shift((1 + f) * o.length, o, f ? "utf16le" : "sbcs"), h))
        }
        $c(e, "Blank", ea(r, n, b))
    }

    function qc(e, t, r) {
        var n, a, s, i, o, l, c, f = Lt(), h = r.SheetNames[e], u = r.Sheets[h] || {}, d = (r || {}).Workbook || {},
            p = (d.Sheets || [])[e] || {}, m = Array.isArray(u), g = 8 == t.biff, b = "", v = [],
            E = Jt(u["!ref"] || "A1"), w = g ? 65536 : 16384;
        if (255 < E.e.c || E.e.r >= w) {
            if (t.WTF) throw new Error("Range " + (u["!ref"] || "A1") + " exceeds format limit A1:IV16384");
            E.e.c = Math.min(E.e.c, 255), E.e.r = Math.min(E.e.c, w - 1)
        }
        $c(f, 2057, fa(0, 16, t)), $c(f, "CalcMode", zn(1)), $c(f, "CalcCount", zn(100)), $c(f, "CalcRefMode", Un(!0)), $c(f, "CalcIter", Un(!1)), $c(f, "CalcDelta", Cr(.001)), $c(f, "CalcSaveRecalc", Un(!0)), $c(f, "PrintRowCol", Un(!1)), $c(f, "PrintGrid", Un(!1)), $c(f, "GridSet", zn(1)), $c(f, "Guts", (a = [0, 0], (s = Pt(8)).write_shift(4, 0), s.write_shift(2, a[0] ? a[0] + 1 : 0), s.write_shift(2, a[1] ? a[1] + 1 : 0), s)), $c(f, "HCenter", Un(!1)), $c(f, "VCenter", Un(!1)), $c(f, 512, (i = E, l = 8 != (o = t).biff && o.biff ? 2 : 4, (c = Pt(2 * l + 6)).write_shift(l, i.s.r), c.write_shift(l, i.e.r + 1), c.write_shift(2, i.s.c), c.write_shift(2, i.e.c + 1), c.write_shift(2, 0), c)), g && (u["!links"] = []);
        for (var S = E.s.r; S <= E.e.r; ++S) {
            b = Xt(S);
            for (var _ = E.s.c; _ <= E.e.c; ++_) {
                S === E.s.r && (v[_] = Gt(_)), n = v[_] + b;
                var y = m ? (u[S] || [])[_] : u[n];
                y && (Jc(f, y, S, _, t), g && y.l && u["!links"].push([n, y.l]))
            }
        }
        var C, B, T, k, x, A, I = p.CodeName || p.name || h;
        return g && d.Views && $c(f, "Window2", (C = d.Views[0], B = Pt(18), T = 1718, C && C.RTL && (T |= 64), B.write_shift(2, T), B.write_shift(4, 0), B.write_shift(4, 64), B.write_shift(4, 0), B.write_shift(4, 0), B)), g && (u["!merges"] || []).length && $c(f, "MergeCells", function (e) {
            var t = Pt(2 + 8 * e.length);
            t.write_shift(2, e.length);
            for (var r = 0; r < e.length; ++r) na(e[r], t);
            return t
        }(u["!merges"])), g && function (e, t) {
            for (var r = 0; r < t["!links"].length; ++r) {
                var n = t["!links"][r];
                $c(e, "HLink", Ta(n)), n[1].Tooltip && $c(e, "HLinkTooltip", ka(n))
            }
            delete t["!links"]
        }(f, u), $c(f, "CodeName", Yn(I)), g && (k = f, x = u, (A = Pt(19)).write_shift(4, 2151), A.write_shift(4, 0), A.write_shift(4, 0), A.write_shift(2, 3), A.write_shift(1, 1), A.write_shift(4, 0), $c(k, "FeatHdr", A), (A = Pt(39)).write_shift(4, 2152), A.write_shift(4, 0), A.write_shift(4, 0), A.write_shift(2, 3), A.write_shift(1, 0), A.write_shift(4, 0), A.write_shift(2, 1), A.write_shift(4, 4), A.write_shift(2, 0), na(Jt(x["!ref"] || "A1"), A), A.write_shift(4, 4), $c(k, "Feat", A)), $c(f, "EOF"), f.end()
    }

    function ef(e, t, r) {
        var n, a, s, i, o, l = Lt(), c = (e || {}).Workbook || {}, f = c.Sheets || [], h = c.WBProps || {},
            u = 8 == r.biff, d = 5 == r.biff;
        $c(l, 2057, fa(0, 5, r)), "xla" == r.bookType && $c(l, "Addin"), $c(l, "InterfaceHdr", u ? zn(1200) : null), $c(l, "Mms", function (e, t) {
            t = t || Pt(e);
            for (var r = 0; r < e; ++r) t.write_shift(1, 0);
            return t
        }(2)), d && $c(l, "ToolbarHdr"), d && $c(l, "ToolbarEnd"), $c(l, "InterfaceEnd"), $c(l, "WriteAccess", function (e) {
            var t = !e || 8 == e.biff, r = Pt(t ? 112 : 54);
            for (r.write_shift(8 == e.biff ? 2 : 1, 7), t && r.write_shift(1, 0), r.write_shift(4, 859007059), r.write_shift(4, 5458548 | (t ? 0 : 536870912)); r.l < r.length;) r.write_shift(1, t ? 0 : 32);
            return r
        }(r)), $c(l, "CodePage", zn(u ? 1200 : 1252)), u && $c(l, "DSF", zn(0)), u && $c(l, "Excel9File"), $c(l, "RRTabId", function (e) {
            for (var t = Pt(2 * e), r = 0; r < e; ++r) t.write_shift(2, r + 1);
            return t
        }(e.SheetNames.length)), u && e.vbaraw && ($c(l, "ObProj"), $c(l, "CodeName", Yn(h.CodeName || "ThisWorkbook")));
        $c(l, "BuiltInFnGroupCount", zn(17)), $c(l, "WinProtect", Un(!1)), $c(l, "Protect", Un(!1)), $c(l, "Password", zn(0)), u && $c(l, "Prot4Rev", Un(!1)), u && $c(l, "Prot4RevPass", zn(0)), $c(l, "Window1", ((n = Pt(18)).write_shift(2, 0), n.write_shift(2, 0), n.write_shift(2, 29280), n.write_shift(2, 17600), n.write_shift(2, 56), n.write_shift(2, 0), n.write_shift(2, 0), n.write_shift(2, 1), n.write_shift(2, 500), n)), $c(l, "Backup", Un(!1)), $c(l, "HideObj", zn(0)), $c(l, "Date1904", Un("true" == ((a = e).Workbook && a.Workbook.WBProps && Oe(a.Workbook.WBProps.date1904) ? "true" : "false"))), $c(l, "CalcPrecision", Un(!0)), u && $c(l, "RefreshAll", Un(!1)), $c(l, "BookBool", zn(0)), Qc(l, 0, r), s = l, i = e.SSF, o = r, i && [[5, 8], [23, 26], [41, 44], [50, 392]].forEach(function (e) {
            for (var t = e[0]; t <= e[1]; ++t) null != i[t] && $c(s, "Format", da(t, i[t], o))
        }), function (t, r) {
            for (var e = 0; e < 16; ++e) $c(t, "XF", ga({numFmtId: 0, style: !0}, 0, r));
            r.cellXfs.forEach(function (e) {
                $c(t, "XF", ga(e, 0, r))
            })
        }(l, r), u && $c(l, "UsesELFs", Un(!1));
        var p, m = l.end(), g = Lt();
        u && $c(g, "Country", ((p = p || Pt(4)).write_shift(2, 1), p.write_shift(2, 1), p)), $c(g, "EOF");
        var b = g.end(), v = Lt(), E = 0, w = 0;
        for (w = 0; w < e.SheetNames.length; ++w) E += (u ? 12 : 11) + (u ? 2 : 1) * e.SheetNames[w].length;
        var S = m.length + E + b.length;
        for (w = 0; w < e.SheetNames.length; ++w) {
            $c(v, "BoundSheet8", ha({
                pos: S,
                hs: (f[w] || {}).Hidden || 0,
                dt: 0,
                name: e.SheetNames[w]
            }, r)), S += t[w].length
        }
        var _ = v.end();
        if (E != _.length) throw new Error("BS8 " + E + " != " + _.length);
        var y = [];
        return m.length && y.push(m), _.length && y.push(_), b.length && y.push(b), rt([y])
    }

    function tf(e, t) {
        var r = t || {};
        switch (r.biff || 2) {
            case 8:
            case 5:
                return function (e, t) {
                    var r = t || {}, n = [];
                    e && !e.SSF && (e.SSF = de.get_table()), e && e.SSF && (ce(de), de.load_table(e.SSF), r.revssf = C(e.SSF), r.revssf[e.SSF[65535]] = 0, r.ssf = e.SSF), r.cellXfs = [], r.Strings = [], r.Strings.Count = 0, r.Strings.Unique = 0, al(r.cellXfs, {}, {revssf: {General: 0}});
                    for (var a = 0; a < e.SheetNames.length; ++a) n[n.length] = qc(a, r, e);
                    return n.unshift(ef(e, n, r)), rt([n])
                }(e, t);
            case 4:
            case 3:
            case 2:
                return Zc(e, t)
        }
        throw new Error("invalid type " + r.bookType + " for BIFF")
    }

    var rf, nf, af = {
        to_workbook: function (e, t) {
            return tr(sf(e, t), t)
        },
        to_sheet: sf,
        _row: of,
        BEGIN: rf = '<html><head><meta charset="utf-8"/><title>SheetJS Table Export</title></head><body>',
        END: nf = "</body></html>",
        _preamble: lf,
        from_sheet: function (e, t) {
            var r = t || {}, n = null != r.header ? r.header : rf, a = null != r.footer ? r.footer : nf, s = [n],
                i = Zt(e["!ref"]);
            r.dense = Array.isArray(e), s.push(lf(0, 0, r));
            for (var o = i.s.r; o <= i.e.r; ++o) s.push(of(e, i, o, r));
            return s.push("</table>" + a), s.join("")
        }
    };

    function sf(e, t) {
        var r = t || {};
        null != ue && null == r.dense && (r.dense = ue);
        var n = r.dense ? [] : {}, a = e.match(/<table/i);
        if (!a) throw new Error("Invalid HTML: could not find <table>");
        var s = e.match(/<\/table/i), i = a.index, o = s && s.index || e.length, l = function (e, t, r) {
                if (R || "string" == typeof t) return e.split(t);
                for (var n = e.split(t), a = [n[0]], s = 1; s < n.length; ++s) a.push(r), a.push(n[s]);
                return a
            }(e.slice(i, o), /(:?<tr[^>]*>)/i, "<tr>"), c = -1, f = 0, h = 0, u = 0,
            d = {s: {r: 1e7, c: 1e7}, e: {r: 0, c: 0}}, p = [];
        for (i = 0; i < l.length; ++i) {
            var m = l[i].trim(), g = m.slice(0, 3).toLowerCase();
            if ("<tr" != g) {
                if ("<td" == g || "<th" == g) {
                    var b = m.split(/<\/t[dh]>/i);
                    for (o = 0; o < b.length; ++o) {
                        var v = b[o].trim();
                        if (v.match(/<t[dh]/i)) {
                            for (var E = v, w = 0; "<" == E.charAt(0) && -1 < (w = E.indexOf(">"));) E = E.slice(w + 1);
                            var S = ve(v.slice(0, v.indexOf(">")));
                            u = S.colspan ? +S.colspan : 1, (1 < (h = +S.rowspan) || 1 < u) && p.push({
                                s: {r: c, c: f},
                                e: {r: c + (h || 1) - 1, c: f + u - 1}
                            });
                            var _ = S.t || "";
                            if (E.length) {
                                if (E = Ve(E), d.s.r > c && (d.s.r = c), d.e.r < c && (d.e.r = c), d.s.c > f && (d.s.c = f), d.e.c < f && (d.e.c = f), E.length) {
                                    var y = {t: "s", v: E};
                                    r.raw || !E.trim().length || "s" == _ || ("TRUE" === E ? y = {
                                        t: "b",
                                        v: !0
                                    } : "FALSE" === E ? y = {
                                        t: "b",
                                        v: !1
                                    } : isNaN(x(E)) ? isNaN(A(E).getDate()) || (y = {
                                        t: "d",
                                        v: Q(E)
                                    }, r.cellDates || (y = {
                                        t: "n",
                                        v: K(y.v)
                                    }), y.z = r.dateNF || de._table[14]) : y = {
                                        t: "n",
                                        v: x(E)
                                    }), r.dense ? (n[c] || (n[c] = []), n[c][f] = y) : n[Kt({r: c, c: f})] = y, f += u
                                }
                            } else f += u
                        }
                    }
                }
            } else {
                if (++c, r.sheetRows && r.sheetRows <= c) {
                    --c;
                    break
                }
                f = 0
            }
        }
        return n["!ref"] = Qt(d), n
    }

    function of(e, t, r, n) {
        for (var a = e["!merges"] || [], s = [], i = t.s.c; i <= t.e.c; ++i) {
            for (var o = 0, l = 0, c = 0; c < a.length; ++c) if (!(a[c].s.r > r || a[c].s.c > i || a[c].e.r < r || a[c].e.c < i)) {
                if (a[c].s.r < r || a[c].s.c < i) {
                    o = -1;
                    break
                }
                o = a[c].e.r - a[c].s.r + 1, l = a[c].e.c - a[c].s.c + 1;
                break
            }
            if (!(o < 0)) {
                var f = Kt({r: r, c: i}), h = n.dense ? (e[r] || [])[i] : e[f], u = {};
                1 < o && (u.rowspan = o), 1 < l && (u.colspan = l);
                var d = h && null != h.v && (h.h || ke(h.w || (er(h), h.w) || "")) || "";
                u.t = h && h.t || "z", n.editable && (d = '<span contenteditable="true">' + d + "</span>"), u.id = "sjs-" + f, s.push(Ze("td", d, u))
            }
        }
        return "<tr>" + s.join("") + "</tr>"
    }

    function lf(e, t, r) {
        return [].join("") + "<table" + (r && r.id ? ' id="' + r.id + '"' : "") + ">"
    }

    function cf(e, t) {
        var r = t || {};
        null != ue && (r.dense = ue);
        for (var n, a, s, i, o = r.dense ? [] : {}, l = e.getElementsByTagName("tr"), c = r.sheetRows || 1e7, f = {
            s: {
                r: 0,
                c: 0
            }, e: {r: 0, c: 0}
        }, h = [], u = 0, d = [], p = 0, m = 0; p < l.length && m < c; ++p) {
            var g = l[p];
            if (ff(g)) {
                if (r.display) continue;
                d[m] = {hidden: !0}
            }
            var b = g.children;
            for (n = a = 0; n < b.length; ++n) {
                var v = b[n];
                if (!r.display || !ff(v)) {
                    var E = Ve(v.innerHTML);
                    for (u = 0; u < h.length; ++u) {
                        var w = h[u];
                        w.s.c == a && w.s.r <= m && m <= w.e.r && (a = w.e.c + 1, u = -1)
                    }
                    i = +v.getAttribute("colspan") || 1, (0 < (s = +v.getAttribute("rowspan")) || 1 < i) && h.push({
                        s: {
                            r: m,
                            c: a
                        }, e: {r: m + (s || 1) - 1, c: a + i - 1}
                    });
                    var S = {t: "s", v: E}, _ = v.getAttribute("t") || "";
                    null != E && (0 == E.length ? S.t = _ || "z" : r.raw || 0 == E.trim().length || "s" == _ || ("TRUE" === E ? S = {
                        t: "b",
                        v: !0
                    } : "FALSE" === E ? S = {t: "b", v: !1} : isNaN(x(E)) ? isNaN(A(E).getDate()) || (S = {
                        t: "d",
                        v: Q(E)
                    }, r.cellDates || (S = {t: "n", v: K(S.v)}), S.z = r.dateNF || de._table[14]) : S = {
                        t: "n",
                        v: x(E)
                    })), r.dense ? (o[m] || (o[m] = []), o[m][a] = S) : o[Kt({
                        c: a,
                        r: m
                    })] = S, f.e.c < a && (f.e.c = a), a += i
                }
            }
            ++m
        }
        return h.length && (o["!merges"] = h), d.length && (o["!rows"] = d), f.e.r = m - 1, o["!ref"] = Qt(f), c <= m && (o["!fullref"] = Qt((f.e.r = l.length - p + m - 1, f))), o
    }

    function ff(e) {
        var t, r = "",
            n = (t = e).ownerDocument.defaultView && "function" == typeof t.ownerDocument.defaultView.getComputedStyle ? t.ownerDocument.defaultView.getComputedStyle : "function" == typeof getComputedStyle ? getComputedStyle : null;
        return n && (r = n(e).getPropertyValue("display")), "none" === (r = r || e.style.display)
    }

    var hf, uf = (hf = {
        day: ["d", "dd"],
        month: ["m", "mm"],
        year: ["y", "yy"],
        hours: ["h", "hh"],
        minutes: ["m", "mm"],
        seconds: ["s", "ss"],
        "am-pm": ["A/P", "AM/PM"],
        "day-of-week": ["ddd", "dddd"],
        era: ["e", "ee"],
        quarter: ["\\Qm", 'm\\"th quarter"']
    }, function (e, t) {
        var r = t || {};
        null != ue && null == r.dense && (r.dense = ue);
        var n, a, s, i, o, l, c, f, h = Tc(e), u = [], d = {name: ""}, p = "", m = 0, g = {}, b = [],
            v = r.dense ? [] : {}, E = {value: ""}, w = "", S = 0, _ = [], y = -1, C = -1,
            B = {s: {r: 1e6, c: 1e7}, e: {r: 0, c: 0}}, T = 0, k = {}, x = [], A = {}, I = [], R = 1, O = 1, F = [],
            D = {Names: []}, P = {}, N = ["", ""], L = [], M = {}, U = "", H = 0, z = !1, V = !1, W = 0;
        for (kc.lastIndex = 0, h = h.replace(/<!--([\s\S]*?)-->/gm, "").replace(/<!DOCTYPE[^\[]*\[[^\]]*\]>/gm, ""); o = kc.exec(h);) switch (o[3] = o[3].replace(/_.*$/, "")) {
            case"table":
            case"工作表":
                "/" === o[1] ? (B.e.c >= B.s.c && B.e.r >= B.s.r && (v["!ref"] = Qt(B)), 0 < r.sheetRows && r.sheetRows <= B.e.r && (v["!fullref"] = v["!ref"], B.e.r = r.sheetRows - 1, v["!ref"] = Qt(B)), x.length && (v["!merges"] = x), I.length && (v["!rows"] = I), s.name = s["名称"] || s.name, "undefined" != typeof JSON && JSON.stringify(s), b.push(s.name), g[s.name] = v, V = !1) : "/" !== o[0].charAt(o[0].length - 2) && (s = ve(o[0], !1), y = C = -1, B.s.r = B.s.c = 1e7, B.e.r = B.e.c = 0, v = r.dense ? [] : {}, x = [], I = [], V = !0);
                break;
            case"table-row-group":
                "/" === o[1] ? --T : ++T;
                break;
            case"table-row":
            case"行":
                if ("/" === o[1]) {
                    y += R, R = 1;
                    break
                }
                if ((i = ve(o[0], !1))["行号"] ? y = i["行号"] - 1 : -1 == y && (y = 0), (R = +i["number-rows-repeated"] || 1) < 10) for (W = 0; W < R; ++W) 0 < T && (I[y + W] = {level: T});
                C = -1;
                break;
            case"covered-table-cell":
                "/" !== o[1] && ++C, r.sheetStubs && (r.dense ? (v[y] || (v[y] = []), v[y][C] = {t: "z"}) : v[Kt({
                    r: y,
                    c: C
                })] = {t: "z"}), w = "", _ = [];
                break;
            case"table-cell":
            case"数据":
                if ("/" === o[0].charAt(o[0].length - 2)) ++C, E = ve(o[0], !1), O = parseInt(E["number-columns-repeated"] || "1", 10), l = {
                    t: "z",
                    v: null
                }, E.formula && 0 != r.cellFormula && (l.f = Zo(Se(E.formula))), "string" == (E["数据类型"] || E["value-type"]) && (l.t = "s", l.v = Se(E["string-value"] || ""), r.dense ? (v[y] || (v[y] = []), v[y][C] = l) : v[Kt({
                    r: y,
                    c: C
                })] = l), C += O - 1; else if ("/" !== o[1]) {
                    O = 1;
                    var X = R ? y + R - 1 : y;
                    if (++C > B.e.c && (B.e.c = C), C < B.s.c && (B.s.c = C), y < B.s.r && (B.s.r = y), X > B.e.r && (B.e.r = X), L = [], M = {}, l = {
                        t: (E = ve(o[0], !1))["数据类型"] || E["value-type"],
                        v: null
                    }, r.cellFormula) if (E.formula && (E.formula = Se(E.formula)), E["number-matrix-columns-spanned"] && E["number-matrix-rows-spanned"] && (A = {
                        s: {
                            r: y,
                            c: C
                        },
                        e: {
                            r: y + (parseInt(E["number-matrix-rows-spanned"], 10) || 0) - 1,
                            c: C + (parseInt(E["number-matrix-columns-spanned"], 10) || 0) - 1
                        }
                    }, l.F = Qt(A), F.push([A, l.F])), E.formula) l.f = Zo(E.formula); else for (W = 0; W < F.length; ++W) y >= F[W][0].s.r && y <= F[W][0].e.r && C >= F[W][0].s.c && C <= F[W][0].e.c && (l.F = F[W][1]);
                    switch ((E["number-columns-spanned"] || E["number-rows-spanned"]) && (A = {
                        s: {r: y, c: C},
                        e: {
                            r: y + (parseInt(E["number-rows-spanned"], 10) || 0) - 1,
                            c: C + (parseInt(E["number-columns-spanned"], 10) || 0) - 1
                        }
                    }, x.push(A)), E["number-columns-repeated"] && (O = parseInt(E["number-columns-repeated"], 10)), l.t) {
                        case"boolean":
                            l.t = "b", l.v = Oe(E["boolean-value"]);
                            break;
                        case"float":
                        case"percentage":
                        case"currency":
                            l.t = "n", l.v = parseFloat(E.value);
                            break;
                        case"date":
                            l.t = "d", l.v = Q(E["date-value"]), r.cellDates || (l.t = "n", l.v = K(l.v)), l.z = "m/d/yy";
                            break;
                        case"time":
                            l.t = "n", l.v = Z(E["time-value"]) / 86400;
                            break;
                        case"number":
                            l.t = "n", l.v = parseFloat(E["数据数值"]);
                            break;
                        default:
                            if ("string" !== l.t && "text" !== l.t && l.t) throw new Error("Unsupported value type " + l.t);
                            l.t = "s", null != E["string-value"] && (w = Se(E["string-value"]), _ = [])
                    }
                } else {
                    if (z = !1, "s" === l.t && (l.v = w || "", _.length && (l.R = _), z = 0 == S), P.Target && (l.l = P), 0 < L.length && (l.c = L, L = []), w && !1 !== r.cellText && (l.w = w), (!z || r.sheetStubs) && !(r.sheetRows && r.sheetRows <= y)) for (var j = 0; j < R; ++j) {
                        if (O = parseInt(E["number-columns-repeated"] || "1", 10), r.dense) for (v[y + j] || (v[y + j] = []), v[y + j][C] = 0 == j ? l : be(l); 0 < --O;) v[y + j][C + O] = be(l); else for (v[Kt({
                            r: y + j,
                            c: C
                        })] = l; 0 < --O;) v[Kt({r: y + j, c: C + O})] = be(l);
                        B.e.c <= C && (B.e.c = C)
                    }
                    C += (O = parseInt(E["number-columns-repeated"] || "1", 10)) - 1, O = 0, l = {}, w = "", _ = []
                }
                P = {};
                break;
            case"document":
            case"document-content":
            case"电子表格文档":
            case"spreadsheet":
            case"主体":
            case"scripts":
            case"styles":
            case"font-face-decls":
                if ("/" === o[1]) {
                    if ((n = u.pop())[0] !== o[3]) throw"Bad state: " + n
                } else "/" !== o[0].charAt(o[0].length - 2) && u.push([o[3], !0]);
                break;
            case"annotation":
                if ("/" === o[1]) {
                    if ((n = u.pop())[0] !== o[3]) throw"Bad state: " + n;
                    M.t = w, _.length && (M.R = _), M.a = U, L.push(M)
                } else "/" !== o[0].charAt(o[0].length - 2) && u.push([o[3], !1]);
                w = U = "", S = H = 0, _ = [];
                break;
            case"creator":
                "/" === o[1] ? U = h.slice(H, o.index) : H = o.index + o[0].length;
                break;
            case"meta":
            case"元数据":
            case"settings":
            case"config-item-set":
            case"config-item-map-indexed":
            case"config-item-map-entry":
            case"config-item-map-named":
            case"shapes":
            case"frame":
            case"text-box":
            case"image":
            case"data-pilot-tables":
            case"list-style":
            case"form":
            case"dde-links":
            case"event-listeners":
            case"chart":
                if ("/" === o[1]) {
                    if ((n = u.pop())[0] !== o[3]) throw"Bad state: " + n
                } else "/" !== o[0].charAt(o[0].length - 2) && u.push([o[3], !1]);
                w = "", S = 0, _ = [];
                break;
            case"scientific-number":
            case"currency-symbol":
            case"currency-style":
                break;
            case"number-style":
            case"percentage-style":
            case"date-style":
            case"time-style":
                if ("/" === o[1]) {
                    if (k[d.name] = p, (n = u.pop())[0] !== o[3]) throw"Bad state: " + n
                } else "/" !== o[0].charAt(o[0].length - 2) && (p = "", d = ve(o[0], !1), u.push([o[3], !0]));
                break;
            case"script":
            case"libraries":
            case"automatic-styles":
            case"master-styles":
                break;
            case"default-style":
            case"page-layout":
            case"style":
            case"map":
            case"font-face":
            case"paragraph-properties":
            case"table-properties":
            case"table-column-properties":
            case"table-row-properties":
            case"table-cell-properties":
                break;
            case"number":
                switch (u[u.length - 1][0]) {
                    case"time-style":
                    case"date-style":
                        a = ve(o[0], !1), p += hf[o[3]]["long" === a.style ? 1 : 0]
                }
                break;
            case"fraction":
                break;
            case"day":
            case"month":
            case"year":
            case"era":
            case"day-of-week":
            case"week-of-year":
            case"quarter":
            case"hours":
            case"minutes":
            case"seconds":
            case"am-pm":
                switch (u[u.length - 1][0]) {
                    case"time-style":
                    case"date-style":
                        a = ve(o[0], !1), p += hf[o[3]]["long" === a.style ? 1 : 0]
                }
                break;
            case"boolean-style":
            case"boolean":
            case"text-style":
                break;
            case"text":
                if ("/>" === o[0].slice(-2)) break;
                if ("/" === o[1]) switch (u[u.length - 1][0]) {
                    case"number-style":
                    case"date-style":
                    case"time-style":
                        p += h.slice(m, o.index)
                } else m = o.index + o[0].length;
                break;
            case"named-range":
                N = Qo((a = ve(o[0], !1))["cell-range-address"]);
                var G = {Name: a.name, Ref: N[0] + "!" + N[1]};
                V && (G.Sheet = b.length), D.Names.push(G);
                break;
            case"text-content":
            case"text-properties":
            case"embedded-text":
                break;
            case"body":
            case"电子表格":
            case"forms":
            case"table-column":
            case"table-header-rows":
            case"table-rows":
            case"table-column-group":
            case"table-header-columns":
            case"table-columns":
            case"null-date":
            case"graphic-properties":
            case"calculation-settings":
            case"named-expressions":
            case"label-range":
            case"label-ranges":
            case"named-expression":
            case"sort":
            case"sort-by":
            case"sort-groups":
            case"tab":
            case"line-break":
            case"span":
                break;
            case"p":
            case"文本串":
                if ("/" !== o[1] || E && E["string-value"]) ve(o[0], !1), S = o.index + o[0].length; else {
                    var $ = (c = h.slice(S, o.index), f = void 0, f = c.replace(/[\t\r\n]/g, " ").trim().replace(/ +/g, " ").replace(/<text:s\/>/g, " ").replace(/<text:s text:c="(\d+)"\/>/g, function (e, t) {
                        return Array(parseInt(t, 10) + 1).join(" ")
                    }).replace(/<text:tab[^>]*\/>/g, "\t").replace(/<text:line-break\/>/g, "\n"), [Se(f.replace(/<[^>]*>/g, ""))]);
                    w = (0 < w.length ? w + "\n" : "") + $[0]
                }
                break;
            case"s":
                break;
            case"database-range":
                if ("/" === o[1]) break;
                try {
                    g[(N = Qo(ve(o[0])["target-range-address"]))[0]]["!autofilter"] = {ref: N[1]}
                } catch (e) {
                }
                break;
            case"date":
            case"object":
                break;
            case"title":
            case"标题":
            case"desc":
            case"binary-data":
            case"table-source":
            case"scenario":
            case"iteration":
            case"content-validations":
            case"content-validation":
            case"help-message":
            case"error-message":
            case"database-ranges":
            case"filter":
            case"filter-and":
            case"filter-or":
            case"filter-condition":
            case"list-level-style-bullet":
            case"list-level-style-number":
            case"list-level-properties":
                break;
            case"sender-firstname":
            case"sender-lastname":
            case"sender-initials":
            case"sender-title":
            case"sender-position":
            case"sender-email":
            case"sender-phone-private":
            case"sender-fax":
            case"sender-company":
            case"sender-phone-work":
            case"sender-street":
            case"sender-city":
            case"sender-postal-code":
            case"sender-country":
            case"sender-state-or-province":
            case"author-name":
            case"author-initials":
            case"chapter":
            case"file-name":
            case"template-name":
            case"sheet-name":
            case"event-listener":
                break;
            case"initial-creator":
            case"creation-date":
            case"print-date":
            case"generator":
            case"document-statistic":
            case"user-defined":
            case"editing-duration":
            case"editing-cycles":
            case"config-item":
            case"page-number":
            case"page-count":
            case"time":
            case"cell-range-source":
            case"detective":
            case"operation":
            case"highlighted-range":
                break;
            case"data-pilot-table":
            case"source-cell-range":
            case"source-service":
            case"data-pilot-field":
            case"data-pilot-level":
            case"data-pilot-subtotals":
            case"data-pilot-subtotal":
            case"data-pilot-members":
            case"data-pilot-member":
            case"data-pilot-display-info":
            case"data-pilot-sort-info":
            case"data-pilot-layout-info":
            case"data-pilot-field-reference":
            case"data-pilot-groups":
            case"data-pilot-group":
            case"data-pilot-group-member":
            case"rect":
                break;
            case"dde-connection-decls":
            case"dde-connection-decl":
            case"dde-link":
            case"dde-source":
            case"properties":
            case"property":
                break;
            case"a":
                if ("/" !== o[1]) {
                    if (!(P = ve(o[0], !1)).href) break;
                    P.Target = P.href, delete P.href, "#" == P.Target.charAt(0) && -1 < P.Target.indexOf(".") && (N = Qo(P.Target.slice(1)), P.Target = "#" + N[0] + "!" + N[1])
                }
                break;
            case"table-protection":
            case"data-pilot-grand-total":
            case"office-document-common-attrs":
                break;
            default:
                switch (o[2]) {
                    case"dc:":
                    case"calcext:":
                    case"loext:":
                    case"ooo:":
                    case"chartooo:":
                    case"draw:":
                    case"style:":
                    case"chart:":
                    case"form:":
                    case"uof:":
                    case"表:":
                    case"字:":
                        break;
                    default:
                        if (r.WTF) throw new Error(o)
                }
        }
        var Y = {Sheets: g, SheetNames: b, Workbook: D};
        return r.bookSheets && delete Y.Sheets, Y
    });

    function df(e, t) {
        t = t || {};
        var r = !!P(e, "objectdata");
        r && function (e, t) {
            for (var r, n, a = Tc(e); r = kc.exec(a);) switch (r[3]) {
                case"manifest":
                    break;
                case"file-entry":
                    if ("/" == (n = ve(r[0], !1)).path && n.type !== rn) throw new Error("This OpenDocument is not a spreadsheet");
                    break;
                case"encryption-data":
                case"algorithm":
                case"start-key-generation":
                case"key-derivation":
                    throw new Error("Unsupported ODS Encryption");
                default:
                    if (t && t.WTF) throw r
            }
        }(M(e, "META-INF/manifest.xml"), t);
        var n = U(e, "content.xml");
        if (!n) throw new Error("Missing content.xml in " + (r ? "ODS" : "UOF") + " file");
        var a = uf(r ? n : Fe(n), t);
        return P(e, "meta.xml") && (a.Props = cn(M(e, "meta.xml"))), a
    }

    function pf(e, t) {
        return uf(e, t)
    }

    var mf, gf, bf = (mf = "<office:document-styles " + Ke({
        "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
        "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
        "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
        "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
        "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
        "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "xmlns:dc": "http://purl.org/dc/elements/1.1/",
        "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
        "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
        "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
        "office:version": "1.2"
    }) + "></office:document-styles>", function () {
        return z + mf
    }), vf = function (e, t) {
        var r, n = [z], a = Ke({
            "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
            "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
            "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
            "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
            "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
            "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            "xmlns:dc": "http://purl.org/dc/elements/1.1/",
            "xmlns:meta": "urn:oasis:names:tc:opendocument:xmlns:meta:1.0",
            "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
            "xmlns:presentation": "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
            "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
            "xmlns:chart": "urn:oasis:names:tc:opendocument:xmlns:chart:1.0",
            "xmlns:dr3d": "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0",
            "xmlns:math": "http://www.w3.org/1998/Math/MathML",
            "xmlns:form": "urn:oasis:names:tc:opendocument:xmlns:form:1.0",
            "xmlns:script": "urn:oasis:names:tc:opendocument:xmlns:script:1.0",
            "xmlns:ooo": "http://openoffice.org/2004/office",
            "xmlns:ooow": "http://openoffice.org/2004/writer",
            "xmlns:oooc": "http://openoffice.org/2004/calc",
            "xmlns:dom": "http://www.w3.org/2001/xml-events",
            "xmlns:xforms": "http://www.w3.org/2002/xforms",
            "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xmlns:sheet": "urn:oasis:names:tc:opendocument:sh33tjs:1.0",
            "xmlns:rpt": "http://openoffice.org/2005/report",
            "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
            "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
            "xmlns:grddl": "http://www.w3.org/2003/g/data-view#",
            "xmlns:tableooo": "http://openoffice.org/2009/table",
            "xmlns:drawooo": "http://openoffice.org/2010/draw",
            "xmlns:calcext": "urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0",
            "xmlns:loext": "urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0",
            "xmlns:field": "urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0",
            "xmlns:formx": "urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0",
            "xmlns:css3t": "http://www.w3.org/TR/css3-text/",
            "office:version": "1.2"
        }), s = Ke({
            "xmlns:config": "urn:oasis:names:tc:opendocument:xmlns:config:1.0",
            "office:mimetype": "application/vnd.oasis.opendocument.spreadsheet"
        });
        "fods" == t.bookType ? n.push("<office:document" + a + s + ">\n") : n.push("<office:document-content" + a + ">\n"), (r = n).push(" <office:automatic-styles>\n"), r.push('  <number:date-style style:name="N37" number:automatic-order="true">\n'), r.push('   <number:month number:style="long"/>\n'), r.push("   <number:text>/</number:text>\n"), r.push('   <number:day number:style="long"/>\n'), r.push("   <number:text>/</number:text>\n"), r.push("   <number:year/>\n"), r.push("  </number:date-style>\n"), r.push('  <style:style style:name="ce1" style:family="table-cell" style:parent-style-name="Default" style:data-style-name="N37"/>\n'), r.push(" </office:automatic-styles>\n"), n.push("  <office:body>\n"), n.push("    <office:spreadsheet>\n");
        for (var i = 0; i != e.SheetNames.length; ++i) n.push(Ef(e.Sheets[e.SheetNames[i]], e, i));
        return n.push("    </office:spreadsheet>\n"), n.push("  </office:body>\n"), "fods" == t.bookType ? n.push("</office:document>") : n.push("</office:document-content>"), n.join("")
    };

    function Ef(e, t, r) {
        var n = [];
        n.push('      <table:table table:name="' + Ce(t.SheetNames[r]) + '">\n');
        var a = 0, s = 0, i = Zt(e["!ref"]), o = e["!merges"] || [], l = 0, c = Array.isArray(e);
        for (a = 0; a < i.s.r; ++a) n.push("        <table:table-row></table:table-row>\n");
        for (; a <= i.e.r; ++a) {
            for (n.push("        <table:table-row>\n"), s = 0; s < i.s.c; ++s) n.push(gf);
            for (; s <= i.e.c; ++s) {
                var f = !1, h = {}, u = "";
                for (l = 0; l != o.length; ++l) if (!(o[l].s.c > s || o[l].s.r > a || o[l].e.c < s || o[l].e.r < a)) {
                    o[l].s.c == s && o[l].s.r == a || (f = !0), h["table:number-columns-spanned"] = o[l].e.c - o[l].s.c + 1, h["table:number-rows-spanned"] = o[l].e.r - o[l].s.r + 1;
                    break
                }
                if (f) n.push("          <table:covered-table-cell/>\n"); else {
                    var d = Kt({r: a, c: s}), p = c ? (e[a] || [])[s] : e[d];
                    if (p && p.f && (h["table:formula"] = Ce(("of:=" + p.f.replace(ro, "$1[.$2$3$4$5]").replace(/\]:\[/g, ":")).replace(/;/g, "|").replace(/,/g, ";")), p.F && p.F.slice(0, d.length) == d)) {
                        var m = Zt(p.F);
                        h["table:number-matrix-columns-spanned"] = m.e.c - m.s.c + 1, h["table:number-matrix-rows-spanned"] = m.e.r - m.s.r + 1
                    }
                    if (p) {
                        switch (p.t) {
                            case"b":
                                u = p.v ? "TRUE" : "FALSE", h["office:value-type"] = "boolean", h["office:boolean-value"] = p.v ? "true" : "false";
                                break;
                            case"n":
                                u = p.w || String(p.v || 0), h["office:value-type"] = "float", h["office:value"] = p.v || 0;
                                break;
                            case"s":
                            case"str":
                                u = p.v, h["office:value-type"] = "string";
                                break;
                            case"d":
                                u = p.w || Q(p.v).toISOString(), h["office:value-type"] = "date", h["office:date-value"] = Q(p.v).toISOString(), h["table:style-name"] = "ce1";
                                break;
                            default:
                                n.push(gf);
                                continue
                        }
                        var g = Ce(u).replace(/  +/g, function (e) {
                            return '<text:s text:c="' + e.length + '"/>'
                        }).replace(/\t/g, "<text:tab/>").replace(/\n/g, "<text:line-break/>").replace(/^ /, "<text:s/>").replace(/ $/, "<text:s/>");
                        if (p.l && p.l.Target) {
                            var b = p.l.Target;
                            g = Ze("text:a", g, {"xlink:href": b = "#" == b.charAt(0) ? "#" + b.slice(1).replace(/\./, "!") : b})
                        }
                        n.push("          " + Ze("table:table-cell", Ze("text:p", g, {}), h) + "\n")
                    } else n.push(gf)
                }
            }
            n.push("        </table:table-row>\n")
        }
        return n.push("      </table:table>\n"), n.join("")
    }

    function wf(e, t) {
        if ("fods" == t.bookType) return vf(e, t);
        var r = new I, n = "", a = [], s = [];
        return n = "mimetype", r.file(n, "application/vnd.oasis.opendocument.spreadsheet"), n = "content.xml", r.file(n, vf(e, t)), a.push([n, "text/xml"]), s.push([n, "ContentFile"]), n = "styles.xml", r.file(n, bf(e, t)), a.push([n, "text/xml"]), s.push([n, "StylesFile"]), n = "meta.xml", r.file(n, sn()), a.push([n, "text/xml"]), s.push([n, "MetadataFile"]), n = "manifest.rdf", r.file(n, function (e) {
            var t, r, n = [z];
            n.push('<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n');
            for (var a = 0; a != e.length; ++a) n.push(nn(e[a][0], e[a][1])), n.push((t = "", r = e[a][0], ['  <rdf:Description rdf:about="' + t + '">\n', '    <ns0:hasPart xmlns:ns0="http://docs.oasis-open.org/ns/office/1.2/meta/pkg#" rdf:resource="' + r + '"/>\n', "  </rdf:Description>\n"].join("")));
            return n.push(nn("", "Document", "pkg")), n.push("</rdf:RDF>"), n.join("")
        }(s)), a.push([n, "application/rdf+xml"]), n = "META-INF/manifest.xml", r.file(n, function (e) {
            var t = [z];
            t.push('<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">\n'), t.push('  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>\n');
            for (var r = 0; r < e.length; ++r) t.push('  <manifest:file-entry manifest:full-path="' + e[r][0] + '" manifest:media-type="' + e[r][1] + '"/>\n');
            return t.push("</manifest:manifest>"), t.join("")
        }(a)), r
    }

    function Sf(n) {
        return function (e, t) {
            var r = function (e, t) {
                if (!t) return 0;
                var r = e.SheetNames.indexOf(t);
                if (-1 == r) throw new Error("Sheet not found: " + t);
                return r
            }(e, t.sheet);
            return n.from_sheet(e.Sheets[e.SheetNames[r]], t, e)
        }
    }

    var _f = Sf(af), yf = Sf({from_sheet: th}), Cf = Sf(Na), Bf = Sf(Ha), Tf = Sf(es), kf = Sf(Gs),
        xf = Sf({from_sheet: rh}), Af = Sf(Da), If = Sf(Ka);

    function Rf(n) {
        return function (e) {
            for (var t = 0; t != n.length; ++t) {
                var r = n[t];
                void 0 === e[r[0]] && (e[r[0]] = r[1]), "n" === r[2] && (e[r[0]] = Number(e[r[0]]))
            }
        }
    }

    var Of = Rf([["cellNF", !(gf = "          <table:table-cell />\n")], ["cellHTML", !0], ["cellFormula", !0], ["cellStyles", !1], ["cellText", !0], ["cellDates", !1], ["sheetStubs", !1], ["sheetRows", 0, "n"], ["bookDeps", !1], ["bookSheets", !1], ["bookProps", !1], ["bookFiles", !1], ["bookVBA", !1], ["password", ""], ["WTF", !1]]),
        Ff = Rf([["cellDates", !1], ["bookSST", !1], ["bookType", "xlsx"], ["compression", !1], ["WTF", !1]]);

    function Df(r, e) {
        if (!r) return 0;
        try {
            r = e.map(function (e) {
                return e.id || (e.id = e.strRelID), [e.name, r["!id"][e.id].Target, (t = r["!id"][e.id].Type, -1 < Zr.WS.indexOf(t) ? "sheet" : Zr.CS && t == Zr.CS ? "chart" : Zr.DS && t == Zr.DS ? "dialog" : Zr.MS && t == Zr.MS ? "macro" : t && t.length ? t : "sheet")];
                var t
            })
        } catch (e) {
            return null
        }
        return r && 0 !== r.length ? r : null
    }

    function Pf(e, t, r, n, a, s, i, o, l, c, f, h) {
        try {
            s[n] = Jr(U(e, r, !0), t);
            var u, d = M(e, t);
            switch (o) {
                case"sheet":
                    u = oc(d, t, a, l, s[n], c, f, h);
                    break;
                case"chart":
                    if (!(u = lc(d, t, a, l, s[n], c)) || !u["!chart"]) break;
                    var p = H(u["!chart"].Target, t), m = Qr(p), g = H(function (e, t) {
                        if (!e) return "??";
                        var r = (e.match(/<c:chart [^>]*r:id="([^"]*)"/) || ["", ""])[1];
                        return t["!id"][r].Target
                    }(U(e, p, !0), Jr(U(e, m, !0), p)), p), b = Qr(g);
                    u = jl(U(e, g, !0), 0, 0, Jr(U(e, b, !0), g), 0, u);
                    break;
                case"macro":
                    E = t, s[n], E.slice(-4), u = {"!type": "macro"};
                    break;
                case"dialog":
                    v = t, s[n], v.slice(-4), u = {"!type": "dialog"}
            }
            i[n] = u
        } catch (e) {
            if (l.WTF) throw e
        }
        var v, E
    }

    function Nf(e) {
        return "/" == e.charAt(0) ? e.slice(1) : e
    }

    function Lf(t, r) {
        if (ce(de), Of(r = r || {}), P(t, "META-INF/manifest.xml")) return df(t, r);
        if (P(t, "objectdata.xml")) return df(t, r);
        if (P(t, "Index/Document.iwa")) throw new Error("Unsupported NUMBERS file");
        var e, n, a = function (e) {
            for (var t = ge(e.files), r = [], n = 0; n < t.length; ++n) "/" != t[n].slice(-1) && r.push(t[n]);
            return r.sort()
        }(t), s = function (e) {
            var r = Gr();
            if (!e || !e.match) return r;
            var n = {};
            if ((e.match(W) || []).forEach(function (e) {
                var t = ve(e);
                switch (t[0].replace(X, "<")) {
                    case"<?xml":
                        break;
                    case"<Types":
                        r.xmlns = t["xmlns" + (t[0].match(/<(\w+):/) || ["", ""])[1]];
                        break;
                    case"<Default":
                        n[t.Extension] = t.ContentType;
                        break;
                    case"<Override":
                        void 0 !== r[Wr[t.ContentType]] && r[Wr[t.ContentType]].push(t.PartName)
                }
            }), r.xmlns !== Je.CT) throw new Error("Unknown Namespace: " + r.xmlns);
            return r.calcchain = 0 < r.calcchains.length ? r.calcchains[0] : "", r.sst = 0 < r.strs.length ? r.strs[0] : "", r.style = 0 < r.styles.length ? r.styles[0] : "", r.defaults = n, delete r.calcchains, r
        }(U(t, "[Content_Types].xml")), i = !1;
        if (0 === s.workbooks.length && M(t, n = "xl/workbook.xml", !0) && s.workbooks.push(n), 0 === s.workbooks.length) {
            if (!M(t, n = "xl/workbook.bin", !0)) throw new Error("Could not find workbook");
            s.workbooks.push(n), i = !0
        }
        "bin" == s.workbooks[0].slice(-3) && (i = !0);
        var o, l = {}, c = {};
        if (!r.bookSheets && !r.bookProps) {
            if (Jo = [], s.sst) try {
                Jo = fc(M(t, Nf(s.sst)), s.sst, r)
            } catch (e) {
                if (r.WTF) throw e
            }
            r.cellStyles && s.themes.length && (o = U(t, s.themes[0].replace(/^\//, ""), !0) || "", s.themes[0], l = Hi(o, r)), s.style && (c = cc(M(t, Nf(s.style)), s.style, l, r))
        }
        s.links.map(function (e) {
            return dc(M(t, Nf(e)), e, r)
        });
        var f, h, u, d, p = ic(M(t, Nf(s.workbooks[0])), s.workbooks[0], r), m = {}, g = "";
        s.coreprops.length && ((g = M(t, Nf(s.coreprops[0]), !0)) && (m = cn(g)), 0 !== s.extprops.length && (g = M(t, Nf(s.extprops[0]), !0)) && (u = r, d = {}, h = (h = m) || {}, f = Fe(f = g), un.forEach(function (e) {
            switch (e[2]) {
                case"string":
                    h[e[1]] = (f.match(ze(e[0])) || [])[1];
                    break;
                case"bool":
                    h[e[1]] = "true" === (f.match(ze(e[0])) || [])[1];
                    break;
                case"raw":
                    var t = f.match(new RegExp("<" + e[0] + "[^>]*>([\\s\\S]*?)</" + e[0] + ">"));
                    t && 0 < t.length && (d[e[1]] = t[1])
            }
        }), d.HeadingPairs && d.TitlesOfParts && dn(d.HeadingPairs, d.TitlesOfParts, h, u)));
        var b = {};
        r.bookSheets && !r.bookProps || 0 !== s.custprops.length && (g = U(t, Nf(s.custprops[0]), !0)) && (b = function (e, t) {
            var r = {}, n = "", a = e.match(mn);
            if (a) for (var s = 0; s != a.length; ++s) {
                var i = a[s], o = ve(i);
                switch (o[0]) {
                    case"<?xml":
                    case"<Properties":
                        break;
                    case"<property":
                        n = o.name;
                        break;
                    case"</property>":
                        n = null;
                        break;
                    default:
                        if (0 === i.indexOf("<vt:")) {
                            var l = i.split(">"), c = l[0].slice(4), f = l[1];
                            switch (c) {
                                case"lpstr":
                                case"bstr":
                                case"lpwstr":
                                    r[n] = Se(f);
                                    break;
                                case"bool":
                                    r[n] = Oe(f);
                                    break;
                                case"i1":
                                case"i2":
                                case"i4":
                                case"i8":
                                case"int":
                                case"uint":
                                    r[n] = parseInt(f, 10);
                                    break;
                                case"r4":
                                case"r8":
                                case"decimal":
                                    r[n] = parseFloat(f);
                                    break;
                                case"filetime":
                                case"date":
                                    r[n] = Q(f);
                                    break;
                                case"cy":
                                case"error":
                                    r[n] = Se(f);
                                    break;
                                default:
                                    if ("/" == c.slice(-1)) break;
                                    t.WTF && "undefined" != typeof console && console.warn("Unexpected", i, c, l)
                            }
                        } else if ("</" !== i.slice(0, 2) && t.WTF) throw new Error(i)
                }
            }
            return r
        }(g, r));
        var v = {};
        if ((r.bookSheets || r.bookProps) && (p.Sheets ? e = p.Sheets.map(function (e) {
            return e.name
        }) : m.Worksheets && 0 < m.SheetNames.length && (e = m.SheetNames), r.bookProps && (v.Props = m, v.Custprops = b), r.bookSheets && void 0 !== e && (v.SheetNames = e), r.bookSheets ? v.SheetNames : r.bookProps)) return v;
        e = {};
        var E = {};
        r.bookDeps && s.calcchain && (E = uc(M(t, Nf(s.calcchain)), s.calcchain));
        var w, S, _ = 0, y = {}, C = p.Sheets;
        m.Worksheets = C.length, m.SheetNames = [];
        for (var B = 0; B != C.length; ++B) m.SheetNames[B] = C[B].name;
        var T = i ? "bin" : "xml", k = s.workbooks[0].lastIndexOf("/"),
            x = (s.workbooks[0].slice(0, k + 1) + "_rels/" + s.workbooks[0].slice(k + 1) + ".rels").replace(/^\//, "");
        P(t, x) || (x = "xl/_rels/workbook." + T + ".rels");
        var A = Jr(U(t, x, !0), x);
        A = A && Df(A, p.Sheets);
        var I = M(t, "xl/worksheets/sheet.xml", !0) ? 1 : 0;
        for (_ = 0; _ != m.Worksheets; ++_) {
            var R = "sheet";
            A && A[_] ? (w = "xl/" + A[_][1].replace(/[\/]?xl\//, ""), P(t, w) || (w = A[_][1]), P(t, w) || (w = x.replace(/_rels\/.*$/, "") + A[_][1]), R = A[_][2]) : w = (w = "xl/worksheets/sheet" + (_ + 1 - I) + "." + T).replace(/sheet0\./, "sheet."), S = w.replace(/^(.*)(\/)([^\/]*)$/, "$1/_rels/$3.rels"), Pf(t, w, S, m.SheetNames[_], _, y, e, R, r, p, l, c)
        }
        return s.comments && function (e, t, r, n, a) {
            for (var s = 0; s != t.length; ++s) {
                var i = t[s], o = hc(M(e, i.replace(/^\//, ""), !0), i, a);
                if (o && o.length) for (var l = ge(r), c = 0; c != l.length; ++c) {
                    var f = l[c], h = n[f];
                    if (h) h[i] && Gi(0, r[f], o)
                }
            }
        }(t, s.comments, e, y, r), v = {
            Directory: s,
            Workbook: p,
            Props: m,
            Custprops: b,
            Deps: E,
            Sheets: e,
            SheetNames: m.SheetNames,
            Strings: Jo,
            Styles: c,
            Themes: l,
            SSF: de.get_table()
        }, r.bookFiles && (v.keys = a, v.files = t.files), r.bookVBA && (0 < s.vba.length ? v.vbaraw = M(t, Nf(s.vba[0]), !0) : s.defaults && s.defaults.bin === Zi && (v.vbaraw = M(t, "xl/vbaProject.bin", !0))), v
    }

    function Mf(e, t) {
        var r, n, a = t || {}, s = "Workbook", i = me.find(e, s);
        try {
            if (s = "/!DataSpaces/Version", !(i = me.find(e, s)) || !i.content) throw new Error("ECMA-376 Encrypted file missing " + s);
            if (r = i.content, (n = {}).id = r.read_shift(0, "lpp4"), n.R = Os(r, 4), n.U = Os(r, 4), n.W = Os(r, 4), s = "/!DataSpaces/DataSpaceMap", !(i = me.find(e, s)) || !i.content) throw new Error("ECMA-376 Encrypted file missing " + s);
            var o = function (e) {
                var t = [];
                e.l += 4;
                for (var r = e.read_shift(4); 0 < r--;) t.push(Fs(e));
                return t
            }(i.content);
            if (1 !== o.length || 1 !== o[0].comps.length || 0 !== o[0].comps[0].t || "StrongEncryptionDataSpace" !== o[0].name || "EncryptedPackage" !== o[0].comps[0].v) throw new Error("ECMA-376 Encrypted file bad " + s);
            if (s = "/!DataSpaces/DataSpaceInfo/StrongEncryptionDataSpace", !(i = me.find(e, s)) || !i.content) throw new Error("ECMA-376 Encrypted file missing " + s);
            var l = function (e) {
                var t = [];
                e.l += 4;
                for (var r = e.read_shift(4); 0 < r--;) t.push(e.read_shift(0, "lpp4"));
                return t
            }(i.content);
            if (1 != l.length || "StrongEncryptionTransform" != l[0]) throw new Error("ECMA-376 Encrypted file bad " + s);
            if (s = "/!DataSpaces/TransformInfo/StrongEncryptionTransform/!Primary", !(i = me.find(e, s)) || !i.content) throw new Error("ECMA-376 Encrypted file missing " + s);
            Ds(i.content)
        } catch (e) {
        }
        if (s = "/EncryptionInfo", !(i = me.find(e, s)) || !i.content) throw new Error("ECMA-376 Encrypted file missing " + s);
        var c = Ls(i.content);
        if (s = "/EncryptedPackage", !(i = me.find(e, s)) || !i.content) throw new Error("ECMA-376 Encrypted file missing " + s);
        if (4 == c[0] && "undefined" != typeof decrypt_agile) return decrypt_agile(c[1], i.content, a.password || "", a);
        if (2 == c[0] && "undefined" != typeof decrypt_std76) return decrypt_std76(c[1], i.content, a.password || "", a);
        throw new Error("File is password-protected")
    }

    function Uf(e, t) {
        if (Xi = 1024, "ods" == t.bookType) return wf(e, t);
        e && !e.SSF && (e.SSF = de.get_table()), e && e.SSF && (ce(de), de.load_table(e.SSF), t.revssf = C(e.SSF), t.revssf[e.SSF[65535]] = 0, t.ssf = e.SSF), t.rels = {}, t.wbrels = {}, t.Strings = [], t.Strings.Count = 0, t.Strings.Unique = 0, el ? t.revStrings = new Map : (t.revStrings = {}, t.revStrings.foo = [], delete t.revStrings.foo);
        var r = "xlsb" == t.bookType ? "bin" : "xml", n = -1 < Qi.indexOf(t.bookType), a = Gr();
        Ff(t = t || {});
        var s, i, o, l, c, f, h, u, d, p = new I, m = "", g = 0;
        if (t.cellXfs = [], al(t.cellXfs, {}, {revssf: {General: 0}}), e.Props || (e.Props = {}), m = "docProps/core.xml", p.file(m, function (e, t) {
            var r = t || {}, n = [z, fn], a = {};
            if (!e && !r.Props) return n.join("");
            e && (null != e.CreatedDate && hn("dcterms:created", "string" == typeof e.CreatedDate ? e.CreatedDate : Qe(e.CreatedDate, r.WTF), {"xsi:type": "dcterms:W3CDTF"}, n, a), null != e.ModifiedDate && hn("dcterms:modified", "string" == typeof e.ModifiedDate ? e.ModifiedDate : Qe(e.ModifiedDate, r.WTF), {"xsi:type": "dcterms:W3CDTF"}, n, a));
            for (var s = 0; s != on.length; ++s) {
                var i = on[s], o = r.Props && null != r.Props[i[1]] ? r.Props[i[1]] : e ? e[i[1]] : null;
                !0 === o ? o = "1" : !1 === o ? o = "0" : "number" == typeof o && (o = String(o)), null != o && hn(i[0], o, null, n, a)
            }
            return 2 < n.length && (n[n.length] = "</cp:coreProperties>", n[1] = n[1].replace("/>", ">")), n.join("")
        }(e.Props, t)), a.coreprops.push(m), tn(t.rels, 2, m, Zr.CORE_PROPS), m = "docProps/app.xml", !e.Props || !e.Props.SheetNames) if (e.Workbook && e.Workbook.Sheets) {
            for (var b = [], v = 0; v < e.SheetNames.length; ++v) 2 != (e.Workbook.Sheets[v] || {}).Hidden && b.push(e.SheetNames[v]);
            e.Props.SheetNames = b
        } else e.Props.SheetNames = e.SheetNames;
        for (e.Props.Worksheets = e.Props.SheetNames.length, p.file(m, (s = e.Props, i = [], o = Ze, (s = s || {}).Application = "SheetJS", i[i.length] = z, i[i.length] = pn, un.forEach(function (e) {
            if (void 0 !== s[e[1]]) {
                var t;
                switch (e[2]) {
                    case"string":
                        t = String(s[e[1]]);
                        break;
                    case"bool":
                        t = s[e[1]] ? "true" : "false"
                }
                void 0 !== t && (i[i.length] = o(e[0], t))
            }
        }), i[i.length] = o("HeadingPairs", o("vt:vector", o("vt:variant", "<vt:lpstr>Worksheets</vt:lpstr>") + o("vt:variant", o("vt:i4", String(s.Worksheets))), {
            size: 2,
            baseType: "variant"
        })), i[i.length] = o("TitlesOfParts", o("vt:vector", s.SheetNames.map(function (e) {
            return "<vt:lpstr>" + Ce(e) + "</vt:lpstr>"
        }).join(""), {
            size: s.Worksheets,
            baseType: "lpstr"
        })), 2 < i.length && (i[i.length] = "</Properties>", i[1] = i[1].replace("/>", ">")), i.join(""))), a.extprops.push(m), tn(t.rels, 3, m, Zr.EXT_PROPS), e.Custprops !== e.Props && 0 < ge(e.Custprops || {}).length && (m = "docProps/custom.xml", p.file(m, bn(e.Custprops)), a.custprops.push(m), tn(t.rels, 4, m, Zr.CUST_PROPS)), g = 1; g <= e.SheetNames.length; ++g) {
            var E = {"!id": {}}, w = e.Sheets[e.SheetNames[g - 1]];
            switch ((w || {})["!type"] || "sheet") {
                case"chart":
                default:
                    m = "xl/worksheets/sheet" + g + "." + r, p.file(m, (l = g - 1, c = t, f = e, h = E, (".bin" === m.slice(-4) ? Xl : Al)(l, c, f, h))), a.sheets.push(m), tn(t.wbrels, -1, "worksheets/sheet" + g + "." + r, Zr.WS[0])
            }
            if (w) {
                var S = w["!comments"], _ = !1;
                if (S && 0 < S.length) {
                    var y = "xl/comments" + g + "." + r;
                    p.file(y, gc(S, y, t)), a.comments.push(y), tn(E, -1, "../comments" + g + "." + r, Zr.CMNT), _ = !0
                }
                w["!legacy"] && _ && p.file("xl/drawings/vmlDrawing" + g + ".vml", ji(g, w["!comments"])), delete w["!comments"], delete w["!legacy"]
            }
            E["!id"].rId1 && p.file(Qr(m), en(E))
        }
        return null != t.Strings && 0 < t.Strings.length && (m = "xl/sharedStrings." + r, p.file(m, mc(t.Strings, m, t)), a.strs.push(m), tn(t.wbrels, -1, "sharedStrings." + r, Zr.SST)), m = "xl/workbook." + r, p.file(m, pc(e, m, t)), a.workbooks.push(m), tn(t.rels, 1, m, Zr.WB), m = "xl/theme/theme1.xml", p.file(m, zi(e.Themes, t)), a.themes.push(m), tn(t.wbrels, -1, "theme/theme1.xml", Zr.THEME), m = "xl/styles." + r, p.file(m, (u = e, d = t, (".bin" === m.slice(-4) ? Oi : wi)(u, d))), a.styles.push(m), tn(t.wbrels, -1, "styles." + r, Zr.STY), e.vbaraw && n && (m = "xl/vbaProject.bin", p.file(m, e.vbaraw), a.vba.push(m), tn(t.wbrels, -1, "vbaProject.bin", Zr.VBA)), p.file("[Content_Types].xml", Kr(a, t)), p.file("_rels/.rels", en(t.rels)), p.file("xl/_rels/workbook." + r + ".rels", en(t.wbrels)), delete t.revssf, delete t.ssf, p
    }

    function Hf(e, t) {
        var r = "";
        switch ((t || {}).type || "base64") {
            case"buffer":
                return [e[0], e[1], e[2], e[3]];
            case"base64":
                r = q.decode(e.slice(0, 24));
                break;
            case"binary":
                r = e;
                break;
            case"array":
                return [e[0], e[1], e[2], e[3]];
            default:
                throw new Error("Unrecognized type " + (t && t.type || "undefined"))
        }
        return [r.charCodeAt(0), r.charCodeAt(1), r.charCodeAt(2), r.charCodeAt(3)]
    }

    function zf(e, t) {
        var r = 0;
        e:for (; r < e.length;) switch (e.charCodeAt(r)) {
            case 10:
            case 13:
            case 32:
                ++r;
                break;
            case 60:
                return Ac(e.slice(r), t);
            default:
                break e
        }
        return es.to_workbook(e, t)
    }

    function Vf(e, t, r, n) {
        return n ? (r.type = "string", es.to_workbook(e, r)) : es.to_workbook(t, r)
    }

    function Wf(e, t) {
        if (d(), "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer) return Wf(new Uint8Array(e), t);
        var r, n, a, s, i, o, l = e, c = !1, f = t || {};
        if (qo = {}, f.dateNF && (qo.dateNF = f.dateNF), f.type || (f.type = ee && Buffer.isBuffer(e) ? "buffer" : "base64"), "file" == f.type && (f.type = ee ? "buffer" : "binary", l = function (e) {
            if (void 0 !== b) return b.readFileSync(e);
            if ("undefined" != typeof $ && "undefined" != typeof File && "undefined" != typeof Folder) try {
                var t = File(e);
                t.open("r"), t.encoding = "binary";
                var r = t.read();
                return t.close(), r
            } catch (e) {
                if (!e.message || !e.message.match(/onstruct/)) throw e
            }
            throw new Error("Cannot access file " + e)
        }(e)), "string" == f.type && (c = !0, f.type = "binary", f.codepage = 65001, l = (n = e).match(/[^\x00-\x7F]/) ? De(n) : n), "array" == f.type && "undefined" != typeof Uint8Array && e instanceof Uint8Array && "undefined" != typeof ArrayBuffer) {
            var h = new ArrayBuffer(3), u = new Uint8Array(h);
            if (u.foo = "bar", !u.foo) return (f = be(f)).type = "array", Wf(g(l), f)
        }
        switch ((r = Hf(l, f))[0]) {
            case 208:
                return i = me.read(l, f), o = f, (me.find(i, "EncryptedPackage") ? Mf : zc)(i, o);
            case 9:
                return zc(l, f);
            case 60:
                return Ac(l, f);
            case 73:
                if (68 === r[1]) return function (t, r) {
                    var n = r || {}, a = !!n.WTF;
                    n.WTF = !0;
                    try {
                        var e = Na.to_workbook(t, n);
                        return n.WTF = a, e
                    } catch (e) {
                        if (n.WTF = a, !e.message.match(/SYLK bad record ID/) && a) throw e;
                        return es.to_workbook(t, r)
                    }
                }(l, f);
                break;
            case 84:
                if (65 === r[1] && 66 === r[2] && 76 === r[3]) return Ha.to_workbook(l, f);
                break;
            case 80:
                return 75 === r[1] && r[2] < 9 && r[3] < 9 ? function (e, t) {
                    var r, n = e, a = t || {};
                    switch (a.type || (a.type = ee && Buffer.isBuffer(e) ? "buffer" : "base64"), a.type) {
                        case"base64":
                            r = new I(n, {base64: !0});
                            break;
                        case"binary":
                        case"array":
                            r = new I(n, {base64: !1});
                            break;
                        case"buffer":
                            r = new I(n);
                            break;
                        default:
                            throw new Error("Unrecognized type " + a.type)
                    }
                    return Lf(r, a)
                }(l, f) : Vf(e, l, f, c);
            case 239:
                return 60 === r[3] ? Ac(l, f) : Vf(e, l, f, c);
            case 255:
                if (254 === r[1]) return s = l, "base64" == (a = f).type && (s = q.decode(s)), s = cptable.utils.decode(1200, s.slice(2), "str"), a.type = "binary", zf(s, a);
                break;
            case 0:
                if (0 === r[1] && 2 <= r[2] && 0 === r[3]) return os.to_workbook(l, f);
                break;
            case 3:
            case 131:
            case 139:
            case 140:
                return Da.to_workbook(l, f);
            case 123:
                if (92 === r[1] && 114 === r[2] && 116 === r[3]) return Gs.to_workbook(l, f);
                break;
            case 10:
            case 13:
            case 32:
                return function (e, t) {
                    var r = "", n = Hf(e, t);
                    switch (t.type) {
                        case"base64":
                            r = q.decode(e);
                            break;
                        case"binary":
                            r = e;
                            break;
                        case"buffer":
                            r = e.toString("binary");
                            break;
                        case"array":
                            r = k(e);
                            break;
                        default:
                            throw new Error("Unrecognized type " + t.type)
                    }
                    return 239 == n[0] && 187 == n[1] && 191 == n[2] && (r = Fe(r)), zf(r, t)
                }(l, f)
        }
        return r[2] <= 12 && r[3] <= 31 ? Da.to_workbook(l, f) : Vf(e, l, f, c)
    }

    function Xf(e, t) {
        var r = t || {};
        return r.type = "file", Wf(e, r)
    }

    function jf(e, t) {
        switch (t.type) {
            case"base64":
            case"binary":
                break;
            case"buffer":
            case"array":
                t.type = "";
                break;
            case"file":
                return E(t.file, me.write(e, {type: ee ? "buffer" : ""}));
            case"string":
                throw new Error("'string' output type invalid for '" + t.bookType + "' files");
            default:
                throw new Error("Unrecognized type " + t.type)
        }
        return me.write(e, t)
    }

    function Gf(e, t, r) {
        var n = (r = r || "") + e;
        switch (t.type) {
            case"base64":
                return q.encode(De(n));
            case"binary":
                return De(n);
            case"string":
                return e;
            case"file":
                return E(t.file, n, "utf8");
            case"buffer":
                return ee ? s(n, "utf8") : Gf(n, {type: "binary"}).split("").map(function (e) {
                    return e.charCodeAt(0)
                })
        }
        throw new Error("Unrecognized type " + t.type)
    }

    function $f(e, t) {
        switch (t.type) {
            case"string":
            case"base64":
            case"binary":
                for (var r = "", n = 0; n < e.length; ++n) r += String.fromCharCode(e[n]);
                return "base64" == t.type ? q.encode(r) : "string" == t.type ? Fe(r) : r;
            case"file":
                return E(t.file, e);
            case"buffer":
                return e;
            default:
                throw new Error("Unrecognized type " + t.type)
        }
    }

    function Yf(e, t) {
        tc(e);
        var r, n = t || {};
        if ("array" == n.type) {
            n.type = "binary";
            var a = Yf(e, n);
            return n.type = "array", i(a)
        }
        switch (n.bookType || "xlsb") {
            case"xml":
            case"xlml":
                return Gf(Dc(e, n), n);
            case"slk":
            case"sylk":
                return Gf(Cf(e, n), n);
            case"htm":
            case"html":
                return Gf(_f(e, n), n);
            case"txt":
                return function (e, t) {
                    switch (t.type) {
                        case"base64":
                            return q.encode(e);
                        case"binary":
                        case"string":
                            return e;
                        case"file":
                            return E(t.file, e, "binary");
                        case"buffer":
                            return ee ? s(e, "binary") : e.split("").map(function (e) {
                                return e.charCodeAt(0)
                            })
                    }
                    throw new Error("Unrecognized type " + t.type)
                }(xf(e, n), n);
            case"csv":
                return Gf(yf(e, n), n, "\ufeff");
            case"dif":
                return Gf(Bf(e, n), n);
            case"dbf":
                return $f(Af(e, n), n);
            case"prn":
                return Gf(Tf(e, n), n);
            case"rtf":
                return Gf(kf(e, n), n);
            case"eth":
                return Gf(If(e, n), n);
            case"fods":
                return Gf(wf(e, n), n);
            case"biff2":
                n.biff || (n.biff = 2);
            case"biff3":
                n.biff || (n.biff = 3);
            case"biff4":
                return n.biff || (n.biff = 4), $f(tf(e, n), n);
            case"biff5":
                n.biff || (n.biff = 5);
            case"biff8":
            case"xla":
            case"xls":
                return n.biff || (n.biff = 8), jf(Vc(e, r = n || {}), r);
            case"xlsx":
            case"xlsm":
            case"xlam":
            case"xlsb":
            case"ods":
                return function (e, t) {
                    var r = t || {};
                    style_builder = new hh(t);
                    var n = Uf(e, r), a = {};
                    if (r.compression && (a.compression = "DEFLATE"), r.password) a.type = ee ? "nodebuffer" : "string"; else switch (r.type) {
                        case"base64":
                            a.type = "base64";
                            break;
                        case"binary":
                            a.type = "string";
                            break;
                        case"string":
                            throw new Error("'string' output type invalid for '" + r.bookType + "' files");
                        case"buffer":
                        case"file":
                            a.type = ee ? "nodebuffer" : "string";
                            break;
                        default:
                            throw new Error("Unrecognized type " + r.type)
                    }
                    var s = n.generate(a);
                    return r.password && "undefined" != typeof encrypt_agile ? jf(encrypt_agile(s, r.password), r) : "file" === r.type ? E(r.file, s) : "string" == r.type ? Fe(s) : s
                }(e, n);
            default:
                throw new Error("Unrecognized bookType |" + n.bookType + "|")
        }
    }

    function Kf(e) {
        if (!e.bookType) {
            var t = e.file.slice(e.file.lastIndexOf(".")).toLowerCase();
            t.match(/^\.[a-z]+$/) && (e.bookType = t.slice(1)), e.bookType = {
                xls: "biff8",
                htm: "html",
                slk: "sylk",
                socialcalc: "eth",
                Sh33tJS: "WTF"
            }[e.bookType] || e.bookType
        }
    }

    function Zf(e, t, r) {
        var n = r || {};
        return n.type = "file", n.file = t, Kf(n), Yf(e, n)
    }

    function Qf(e, t, r, n, a, s, i, o) {
        var l = Xt(r), c = o.defval, f = o.raw || !o.hasOwnProperty("raw"), h = !0, u = 1 === a ? [] : {};
        if (1 !== a) if (Object.defineProperty) try {
            Object.defineProperty(u, "__rowNum__", {value: r, enumerable: !1})
        } catch (e) {
            u.__rowNum__ = r
        } else u.__rowNum__ = r;
        if (!i || e[r]) for (var d = t.s.c; d <= t.e.c; ++d) {
            var p = i ? e[r][d] : e[n[d] + l];
            if (void 0 !== p && void 0 !== p.t) {
                var m = p.v;
                switch (p.t) {
                    case"z":
                        if (null == m) break;
                        continue;
                    case"e":
                        m = void 0;
                        break;
                    case"s":
                    case"d":
                    case"b":
                    case"n":
                        break;
                    default:
                        throw new Error("unrecognized type " + p.t)
                }
                if (null != s[d]) {
                    if (null == m) if (void 0 !== c) u[s[d]] = c; else {
                        if (!f || null !== m) continue;
                        u[s[d]] = null
                    } else u[s[d]] = f ? m : er(p, m, o);
                    null != m && (h = !1)
                }
            } else {
                if (void 0 === c) continue;
                null != s[d] && (u[s[d]] = c)
            }
        }
        return {row: u, isempty: h}
    }

    function Jf(e, t) {
        if (null == e || null == e["!ref"]) return [];
        var r = {t: "n", v: 0}, n = 0, a = 1, s = [], i = 0, o = "", l = {s: {r: 0, c: 0}, e: {r: 0, c: 0}},
            c = t || {}, f = null != c.range ? c.range : e["!ref"];
        switch (1 === c.header ? n = 1 : "A" === c.header ? n = 2 : Array.isArray(c.header) && (n = 3), typeof f) {
            case"string":
                l = Jt(f);
                break;
            case"number":
                (l = Jt(e["!ref"])).s.r = f;
                break;
            default:
                l = f
        }
        0 < n && (a = 0);
        var h = Xt(l.s.r), u = [], d = [], p = 0, m = 0, g = Array.isArray(e), b = l.s.r, v = 0, E = 0;
        for (g && !e[b] && (e[b] = []), v = l.s.c; v <= l.e.c; ++v) switch (u[v] = Gt(v), r = g ? e[b][v] : e[u[v] + h], n) {
            case 1:
                s[v] = v - l.s.c;
                break;
            case 2:
                s[v] = u[v];
                break;
            case 3:
                s[v] = c.header[v - l.s.c];
                break;
            default:
                for (null == r && (r = {
                    w: "__EMPTY",
                    t: "s"
                }), o = i = er(r, null, c), E = m = 0; E < s.length; ++E) s[E] == o && (o = i + "_" + ++m);
                s[v] = o
        }
        for (b = l.s.r + a; b <= l.e.r; ++b) {
            var w = Qf(e, l, b, u, n, s, g, c);
            !1 !== w.isempty && (1 === n ? !1 === c.blankrows : !c.blankrows) || (d[p++] = w.row)
        }
        return d.length = p, d
    }

    var qf = /"/g;

    function eh(e, t, r, n, a, s, i, o) {
        for (var l = !0, c = [], f = "", h = Xt(r), u = t.s.c; u <= t.e.c; ++u) if (n[u]) {
            var d = o.dense ? (e[r] || [])[u] : e[n[u] + h];
            if (null == d) f = ""; else if (null != d.v) {
                l = !1, f = "" + er(d, null, o);
                for (var p = 0, m = 0; p !== f.length; ++p) if ((m = f.charCodeAt(p)) === a || m === s || 34 === m) {
                    f = '"' + f.replace(qf, '""') + '"';
                    break
                }
                "ID" == f && (f = '"ID"')
            } else null == d.f || d.F ? f = "" : (l = !1, 0 <= (f = "=" + d.f).indexOf(",") && (f = '"' + f.replace(qf, '""') + '"'));
            c.push(f)
        }
        return !1 === o.blankrows && l ? null : c.join(i)
    }

    function th(e, t) {
        var r = [], n = null == t ? {} : t;
        if (null == e || null == e["!ref"]) return "";
        var a = Jt(e["!ref"]), s = void 0 !== n.FS ? n.FS : ",", i = s.charCodeAt(0), o = void 0 !== n.RS ? n.RS : "\n",
            l = o.charCodeAt(0), c = new RegExp(("|" == s ? "\\|" : s) + "+$"), f = "", h = [];
        n.dense = Array.isArray(e);
        for (var u = n.skipHidden && e["!cols"] || [], d = n.skipHidden && e["!rows"] || [], p = a.s.c; p <= a.e.c; ++p) (u[p] || {}).hidden || (h[p] = Gt(p));
        for (var m = a.s.r; m <= a.e.r; ++m) (d[m] || {}).hidden || null != (f = eh(e, a, m, h, i, l, s, n)) && (n.strip && (f = f.replace(c, "")), r.push(f + o));
        return delete n.dense, r.join("")
    }

    function rh(e, t) {
        (t = t || {}).FS = "\t", t.RS = "\n";
        var r = th(e, t);
        if ("undefined" == typeof cptable || "string" == t.type) return r;
        var n = cptable.utils.encode(1200, r, "str");
        return String.fromCharCode(255) + String.fromCharCode(254) + n
    }

    function nh(e) {
        var t, r = "", n = "";
        if (null == e || null == e["!ref"]) return [];
        var a, s = Jt(e["!ref"]), i = "", o = [], l = [], c = Array.isArray(e);
        for (a = s.s.c; a <= s.e.c; ++a) o[a] = Gt(a);
        for (var f = s.s.r; f <= s.e.r; ++f) for (i = Xt(f), a = s.s.c; a <= s.e.c; ++a) if (r = o[a] + i, n = "", void 0 !== (t = c ? (e[f] || [])[a] : e[r])) {
            if (null != t.F) {
                if (r = t.F, !t.f) continue;
                n = t.f, -1 == r.indexOf(":") && (r = r + ":" + r)
            }
            if (null != t.f) n = t.f; else {
                if ("z" == t.t) continue;
                if ("n" == t.t && null != t.v) n = "" + t.v; else if ("b" == t.t) n = t.v ? "TRUE" : "FALSE"; else if (void 0 !== t.w) n = "'" + t.w; else {
                    if (void 0 === t.v) continue;
                    n = "s" == t.t ? "'" + t.v : "" + t.v
                }
            }
            l[l.length] = r + "=" + n
        }
        return l
    }

    function ah(e, t, r) {
        var i, o = r || {}, l = +!o.skipHeader, c = e || {}, f = 0, h = 0;
        if (c && null != o.origin) if ("number" == typeof o.origin) f = o.origin; else {
            var n = "string" == typeof o.origin ? Yt(o.origin) : o.origin;
            f = n.r, h = n.c
        }
        var a = {s: {c: 0, r: 0}, e: {c: h, r: f + t.length - 1 + l}};
        if (c["!ref"]) {
            var s = Jt(c["!ref"]);
            a.e.c = Math.max(a.e.c, s.e.c), a.e.r = Math.max(a.e.r, s.e.r), -1 == f && (f = a.e.r + 1, a.e.r = f + t.length - 1 + l)
        }
        var u = o.header || [], d = 0;
        t.forEach(function (a, s) {
            ge(a).forEach(function (e) {
                -1 == (d = u.indexOf(e)) && (u[d = u.length] = e);
                var t = a[e], r = "z", n = "";
                !t || "object" != typeof t || t instanceof Date ? ("number" == typeof t ? r = "n" : "boolean" == typeof t ? r = "b" : "string" == typeof t ? r = "s" : t instanceof Date && (r = "d", o.cellDates || (r = "n", t = K(t)), n = o.dateNF || de._table[14]), c[Kt({
                    c: h + d,
                    r: f + s + l
                })] = i = {t: r, v: t}, n && (i.z = n)) : c[Kt({c: h + d, r: f + s + l})] = t
            })
        }), a.e.c = Math.max(a.e.c, h + u.length - 1);
        var p = Xt(f);
        if (l) for (d = 0; d < u.length; ++d) c[Gt(d + h) + p] = {t: "s", v: u[d]};
        return c["!ref"] = Qt(a), c
    }

    var sh, ih, oh = {
        encode_col: Gt,
        encode_row: Xt,
        encode_cell: Kt,
        encode_range: Qt,
        decode_col: jt,
        decode_row: Wt,
        split_cell: $t,
        decode_cell: Yt,
        decode_range: Zt,
        format_cell: er,
        get_formulae: nh,
        make_csv: th,
        make_json: Jf,
        make_formulae: nh,
        sheet_add_aoa: rr,
        sheet_add_json: ah,
        aoa_to_sheet: nr,
        json_to_sheet: function (e, t) {
            return ah(null, e, t)
        },
        table_to_sheet: cf,
        table_to_book: function (e, t) {
            return tr(cf(e, t), t)
        },
        sheet_to_csv: th,
        sheet_to_txt: rh,
        sheet_to_json: Jf,
        sheet_to_html: af.from_sheet,
        sheet_to_dif: Ha.from_sheet,
        sheet_to_slk: Na.from_sheet,
        sheet_to_eth: Ka.from_sheet,
        sheet_to_formulae: nh,
        sheet_to_row_object_array: Jf
    };

    function lh(e, t, r) {
        return null != e[t] ? e[t] : e[t] = r
    }

    function ch(e, t, r) {
        return "string" == typeof t ? e[t] || (e[t] = {t: "z"}) : ch(e, Kt("number" != typeof t ? t : {
            r: t,
            c: r || 0
        }))
    }

    (sh = oh).consts = sh.consts || {}, sh.book_new = function () {
        return {SheetNames: [], Sheets: {}}
    }, sh.book_append_sheet = function (e, t, r) {
        if (!r) for (var n = 1; n <= 65535 && -1 != e.SheetNames.indexOf(r = "Sheet" + n); ++n) ;
        if (!r) throw new Error("Too many worksheets");
        if (ec(r), 0 <= e.SheetNames.indexOf(r)) throw new Error("Worksheet with name |" + r + "| already exists!");
        e.SheetNames.push(r), e.Sheets[r] = t
    }, sh.book_set_sheet_visibility = function (e, t, r) {
        lh(e, "Workbook", {}), lh(e.Workbook, "Sheets", []);
        var n = function (e, t) {
            if ("number" == typeof t) {
                if (0 <= t && e.SheetNames.length > t) return t;
                throw new Error("Cannot find sheet # " + t)
            }
            if ("string" != typeof t) throw new Error("Cannot find sheet |" + t + "|");
            var r = e.SheetNames.indexOf(t);
            if (-1 < r) return r;
            throw new Error("Cannot find sheet name |" + t + "|")
        }(e, t);
        switch (lh(e.Workbook.Sheets, n, {}), r) {
            case 0:
            case 1:
            case 2:
                break;
            default:
                throw new Error("Bad sheet visibility setting " + r)
        }
        e.Workbook.Sheets[n].Hidden = r
    }, [["SHEET_VISIBLE", 0], ["SHEET_HIDDEN", 1], ["SHEET_VERY_HIDDEN", 2]].forEach(function (e) {
        sh.consts[e[0]] = e[1]
    }), sh.cell_set_number_format = function (e, t) {
        return e.z = t, e
    }, sh.cell_set_hyperlink = function (e, t, r) {
        return t ? (e.l = {Target: t}, r && (e.l.Tooltip = r)) : delete e.l, e
    }, sh.cell_set_internal_link = function (e, t, r) {
        return sh.cell_set_hyperlink(e, "#" + t, r)
    }, sh.cell_add_comment = function (e, t, r) {
        e.c || (e.c = []), e.c.push({t: t, a: r || "SheetJS"})
    }, sh.sheet_set_array_formula = function (e, t, r) {
        for (var n = "string" != typeof t ? t : Jt(t), a = "string" == typeof t ? t : Qt(t), s = n.s.r; s <= n.e.r; ++s) for (var i = n.s.c; i <= n.e.c; ++i) {
            var o = ch(e, s, i);
            o.t = "n", o.F = a, delete o.v, s == n.s.r && i == n.s.c && (o.f = r)
        }
        return e
    }, ee && "undefined" != typeof require && (ih = {}.Readable, n.stream = {
        to_json: function (t, e) {
            var r = ih({objectMode: !0});
            if (null == t || null == t["!ref"]) return r.push(null), r;
            var n = {t: "n", v: 0}, a = 0, s = 1, i = [], o = 0, l = "", c = {s: {r: 0, c: 0}, e: {r: 0, c: 0}},
                f = e || {}, h = null != f.range ? f.range : t["!ref"];
            switch (1 === f.header ? a = 1 : "A" === f.header ? a = 2 : Array.isArray(f.header) && (a = 3), typeof h) {
                case"string":
                    c = Jt(h);
                    break;
                case"number":
                    (c = Jt(t["!ref"])).s.r = h;
                    break;
                default:
                    c = h
            }
            0 < a && (s = 0);
            var u = Xt(c.s.r), d = [], p = 0, m = Array.isArray(t), g = c.s.r, b = 0, v = 0;
            for (m && !t[g] && (t[g] = []), b = c.s.c; b <= c.e.c; ++b) switch (d[b] = Gt(b), n = m ? t[g][b] : t[d[b] + u], a) {
                case 1:
                    i[b] = b - c.s.c;
                    break;
                case 2:
                    i[b] = d[b];
                    break;
                case 3:
                    i[b] = f.header[b - c.s.c];
                    break;
                default:
                    for (null == n && (n = {
                        w: "__EMPTY",
                        t: "s"
                    }), l = o = er(n, null, f), v = p = 0; v < i.length; ++v) i[v] == l && (l = o + "_" + ++p);
                    i[b] = l
            }
            return g = c.s.r + s, r._read = function () {
                if (g > c.e.r) return r.push(null);
                for (; g <= c.e.r;) {
                    var e = Qf(t, c, g, d, a, i, m, f);
                    if (++g, !1 === e.isempty || (1 === a ? !1 !== f.blankrows : f.blankrows)) {
                        r.push(e.row);
                        break
                    }
                }
            }, r
        }, to_html: function (e, t) {
            var r = ih(), n = t || {}, a = null != n.header ? n.header : af.BEGIN,
                s = null != n.footer ? n.footer : af.END;
            r.push(a);
            var i = Zt(e["!ref"]);
            n.dense = Array.isArray(e), r.push(af._preamble(e, i, n));
            var o = i.s.r, l = !1;
            return r._read = function () {
                if (o > i.e.r) return l || (l = !0, r.push("</table>" + s)), r.push(null);
                for (; o <= i.e.r;) {
                    r.push(af._row(e, i, o, n)), ++o;
                    break
                }
            }, r
        }, to_csv: function (e, t) {
            var r = ih(), n = null == t ? {} : t;
            if (null == e || null == e["!ref"]) return r.push(null), r;
            var a = Jt(e["!ref"]), s = void 0 !== n.FS ? n.FS : ",", i = s.charCodeAt(0),
                o = void 0 !== n.RS ? n.RS : "\n", l = o.charCodeAt(0), c = new RegExp(("|" == s ? "\\|" : s) + "+$"),
                f = "", h = [];
            n.dense = Array.isArray(e);
            for (var u = n.skipHidden && e["!cols"] || [], d = n.skipHidden && e["!rows"] || [], p = a.s.c; p <= a.e.c; ++p) (u[p] || {}).hidden || (h[p] = Gt(p));
            var m = a.s.r, g = !1;
            return r._read = function () {
                if (!g) return g = !0, r.push("\ufeff");
                if (m > a.e.r) return r.push(null);
                for (; m <= a.e.r;) if (!(d[++m - 1] || {}).hidden && null != (f = eh(e, a, m - 1, h, i, l, s, n))) {
                    n.strip && (f = f.replace(c, "")), r.push(f + o);
                    break
                }
            }, r
        }
    });
    var fh = function () {
        function n(e, t, r) {
            return this instanceof n ? (this.tagName = e, this._attributes = t || {}, this._children = r || [], this._prefix = "", this) : new n(e, t, r)
        }

        n.prototype.createElement = function () {
            return new n(arguments)
        }, n.prototype.children = function () {
            return this._children
        }, n.prototype.append = function (e) {
            return this._children.push(e), this
        }, n.prototype.prefix = function (e) {
            return 0 == arguments.length ? this._prefix : (this._prefix = e, this)
        }, n.prototype.attr = function (e, t) {
            if (null == t) return delete this._attributes[e], this;
            if (0 == arguments.length) return this._attributes;
            if ("string" == typeof e && 1 == arguments.length) return this._attributes.attr[e];
            if ("object" == typeof e && 1 == arguments.length) for (var r in e) this._attributes[r] = e[r]; else 2 == arguments.length && "string" == typeof e && (this._attributes[e] = t);
            return this
        };
        QUOTE = '"';
        var e = {};
        return e[QUOTE] = "&quot;", e["'"] = "&apos;", n.prototype.escapeAttributeValue = function (e) {
            return '"' + e.replace(/\"/g, "&quot;") + '"'
        }, n.prototype.toXml = function (e) {
            var t = (e = e || this)._prefix;
            if (t += "<" + e.tagName, e._attributes) for (var r in e._attributes) t += " " + r + "=" + this.escapeAttributeValue("" + e._attributes[r]);
            if (e._children && 0 < e._children.length) {
                t += ">";
                for (var n = 0; n < e._children.length; n++) t += this.toXml(e._children[n]);
                t += "</" + e.tagName + ">"
            } else t += "/>";
            return t
        }, n
    }(), hh = function (e) {
        var a = 164, t = {
            0: "General",
            1: "0",
            2: "0.00",
            3: "#,##0",
            4: "#,##0.00",
            9: "0%",
            10: "0.00%",
            11: "0.00E+00",
            12: "# ?/?",
            13: "# ??/??",
            14: "m/d/yy",
            15: "d-mmm-yy",
            16: "d-mmm",
            17: "mmm-yy",
            18: "h:mm AM/PM",
            19: "h:mm:ss AM/PM",
            20: "h:mm",
            21: "h:mm:ss",
            22: "m/d/yy h:mm",
            37: "#,##0 ;(#,##0)",
            38: "#,##0 ;[Red](#,##0)",
            39: "#,##0.00;(#,##0.00)",
            40: "#,##0.00;[Red](#,##0.00)",
            45: "mm:ss",
            46: "[h]:mm:ss",
            47: "mmss.0",
            48: "##0.0E+0",
            49: "@",
            56: '"上午/下午 "hh"時"mm"分"ss"秒 "'
        }, s = {};
        for (var r in t) s[t[r]] = r;
        return _hashIndex = {}, _listIndex = [], {
            initialize: function (e) {
                this.$fonts = fh("fonts").attr("count", 0).attr("x14ac:knownFonts", "1"), this.$fills = fh("fills").attr("count", 0), this.$borders = fh("borders").attr("count", 0), this.$numFmts = fh("numFmts").attr("count", 0), this.$cellStyleXfs = fh("cellStyleXfs"), this.$xf = fh("xf").attr("numFmtId", 0).attr("fontId", 0).attr("fillId", 0).attr("borderId", 0), this.$cellXfs = fh("cellXfs").attr("count", 0), this.$cellStyles = fh("cellStyles").append(fh("cellStyle").attr("name", "Normal").attr("xfId", 0).attr("builtinId", 0)), this.$dxfs = fh("dxfs").attr("count", "0"), this.$tableStyles = fh("tableStyles").attr("count", "0").attr("defaultTableStyle", "TableStyleMedium9").attr("defaultPivotStyle", "PivotStyleMedium4"), this.$styles = fh("styleSheet").attr("xmlns:mc", "http://schemas.openxmlformats.org/markup-compatibility/2006").attr("xmlns:x14ac", "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac").attr("xmlns", "http://schemas.openxmlformats.org/spreadsheetml/2006/main").attr("mc:Ignorable", "x14ac").prefix('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>').append(this.$numFmts).append(this.$fonts).append(this.$fills).append(this.$borders).append(this.$cellStyleXfs.append(this.$xf)).append(this.$cellXfs).append(this.$cellStyles).append(this.$dxfs).append(this.$tableStyles);
                var t = e.defaultCellStyle || {};
                t.font || (t.font = {
                    name: "Calibri",
                    sz: "12"
                }), t.font.name || (t.font.name = "Calibri"), t.font.sz || (t.font.sz = 11), t.fill || (t.fill = {
                    patternType: "none",
                    fgColor: {}
                }), t.border || (t.border = {}), t.numFmt || (t.numFmt = 0), this.defaultStyle = t;
                var r = JSON.parse(JSON.stringify(t));
                return r.fill = {patternType: "gray125", fgColor: {}}, this.addStyles([t, r]), this
            }, addStyle: function (e) {
                var t = JSON.stringify(e), r = _hashIndex[t];
                return null == r ? (r = this._addXf(e), _hashIndex[t] = r) : r = _hashIndex[t], r
            }, addStyles: function (e) {
                var t = this;
                return e.map(function (e) {
                    return t.addStyle(e)
                })
            }, _duckTypeStyle: function (e) {
                return "object" == typeof e && (e.patternFill || e.fgColor) ? {fill: e} : e.font || e.numFmt || e.border || e.fill ? e : this._getStyleCSS(e)
            }, _getStyleCSS: function (e) {
                return e
            }, _addXf: function (e) {
                var t = this._addFont(e.font), r = this._addFill(e.fill), n = this._addBorder(e.border),
                    a = this._addNumFmt(e.numFmt),
                    s = fh("xf").attr("numFmtId", a).attr("fontId", t).attr("fillId", r).attr("borderId", n).attr("xfId", "0");
                if (0 < t && s.attr("applyFont", "1"), 0 < r && s.attr("applyFill", "1"), 0 < n && s.attr("applyBorder", "1"), 0 < a && s.attr("applyNumberFormat", "1"), e.alignment) {
                    var i = fh("alignment");
                    e.alignment.horizontal && i.attr("horizontal", e.alignment.horizontal), e.alignment.vertical && i.attr("vertical", e.alignment.vertical), e.alignment.indent && i.attr("indent", e.alignment.indent), e.alignment.readingOrder && i.attr("readingOrder", e.alignment.readingOrder), e.alignment.wrapText && i.attr("wrapText", e.alignment.wrapText), null != e.alignment.textRotation && i.attr("textRotation", e.alignment.textRotation), s.append(i).attr("applyAlignment", 1)
                }
                this.$cellXfs.append(s);
                var o = +this.$cellXfs.children().length;
                return this.$cellXfs.attr("count", o), o - 1
            }, _addFont: function (e) {
                if (!e) return 0;
                var t = fh("font").append(fh("sz").attr("val", e.sz || this.defaultStyle.font.sz)).append(fh("name").attr("val", e.name || this.defaultStyle.font.name));
                e.bold && t.append(fh("b")), e.underline && t.append(fh("u")), e.italic && t.append(fh("i")), e.strike && t.append(fh("strike")), e.outline && t.append(fh("outline")), e.shadow && t.append(fh("shadow")), e.vertAlign && t.append(fh("vertAlign").attr("val", e.vertAlign)), e.color && (e.color.theme ? (t.append(fh("color").attr("theme", e.color.theme)), e.color.tint && t.append(fh("tint").attr("theme", e.color.tint))) : e.color.rgb && t.append(fh("color").attr("rgb", e.color.rgb))), this.$fonts.append(t);
                var r = this.$fonts.children().length;
                return this.$fonts.attr("count", r), r - 1
            }, _addNumFmt: function (e) {
                if (!e) return 0;
                if ("string" == typeof e) {
                    var t = s[e];
                    if (0 <= t) return t
                }
                if (/^[0-9]+$/.exec(e)) return e;
                e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
                var r = fh("numFmt").attr("numFmtId", ++a).attr("formatCode", e);
                this.$numFmts.append(r);
                var n = this.$numFmts.children().length;
                return this.$numFmts.attr("count", n), a
            }, _addFill: function (e) {
                if (!e) return 0;
                var t = fh("patternFill").attr("patternType", e.patternType || "solid");
                if (e.fgColor) {
                    var r = fh("fgColor");
                    e.fgColor.rgb ? (6 == e.fgColor.rgb.length && (e.fgColor.rgb = "FF" + e.fgColor.rgb), r.attr("rgb", e.fgColor.rgb), t.append(r)) : e.fgColor.theme && (r.attr("theme", e.fgColor.theme), e.fgColor.tint && r.attr("tint", e.fgColor.tint), t.append(r)), e.bgColor || (e.bgColor = {indexed: "64"})
                }
                if (e.bgColor) {
                    var n = fh("bgColor").attr(e.bgColor);
                    t.append(n)
                }
                var a = fh("fill").append(t);
                this.$fills.append(a);
                var s = this.$fills.children().length;
                return this.$fills.attr("count", s), s - 1
            }, _getSubBorder: function (e, t) {
                var r = fh(e);
                if (t && (t.style && r.attr("style", t.style), t.color)) {
                    var n = fh("color");
                    t.color.auto ? n.attr("auto", t.color.auto) : t.color.rgb ? n.attr("rgb", t.color.rgb) : (t.color.theme || t.color.tint) && (n.attr("theme", t.color.theme || "1"), n.attr("tint", t.color.tint || "0")), r.append(n)
                }
                return r
            }, _addBorder: function (t) {
                if (!t) return 0;
                var r = this, n = fh("border").attr("diagonalUp", t.diagonalUp).attr("diagonalDown", t.diagonalDown);
                ["left", "right", "top", "bottom", "diagonal"].forEach(function (e) {
                    n.append(r._getSubBorder(e, t[e]))
                }), this.$borders.append(n);
                var e = this.$borders.children().length;
                return this.$borders.attr("count", e), e - 1
            }, toXml: function () {
                return this.$styles.toXml()
            }
        }.initialize(e || {})
    };
    n.parse_xlscfb = zc, n.parse_ods = df, n.parse_fods = pf, n.write_ods = wf, n.parse_zip = Lf, n.read = Wf, n.readFile = Xf, n.readFileSync = Xf, n.write = Yf, n.writeFile = Zf, n.writeFileSync = Zf, n.writeFileAsync = function (e, t, r, n) {
        var a = r || {};
        a.type = "file", a.file = e, Kf(a), a.type = "buffer";
        var s = n;
        return s instanceof Function || (s = r), b.writeFile(e, Yf(t, a), s)
    }, n.utils = oh, n.SSF = de, n.CFB = me
}

"undefined" != typeof exports ? make_xlsx_lib(exports) : "undefined" != typeof module && module.exports ? make_xlsx_lib(module.exports) : "function" == typeof define && define.amd ? define("xlsx", function () {
    return XLSX.version || make_xlsx_lib(XLSX), XLSX
}) : make_xlsx_lib(XLSX);
var XLS = XLSX, ODS = XLSX;
!function (d) {
    "use strict";
    var p = void 0, m = 1e5;

    function g(e) {
        switch (typeof e) {
            case"undefined":
                return "undefined";
            case"boolean":
                return "boolean";
            case"number":
                return "number";
            case"string":
                return "string";
            default:
                return null === e ? "null" : "object"
        }
    }

    function b(e) {
        return Object.prototype.toString.call(e).replace(/^\[object *|\]$/g, "")
    }

    function v(e) {
        return "function" == typeof e
    }

    function E(e) {
        if (null === e || e === p) throw TypeError();
        return Object(e)
    }

    var n, e, t, l, w = Math.LN2, S = Math.abs, _ = Math.floor, y = Math.log, C = Math.max, B = Math.min, T = Math.pow,
        r = Math.round;

    function a(e, t) {
        var r = 32 - t;
        return e << r >> r
    }

    function s(e, t) {
        var r = 32 - t;
        return e << r >>> r
    }

    function k(e) {
        return [255 & e]
    }

    function x(e) {
        return a(e[0], 8)
    }

    function A(e) {
        return [255 & e]
    }

    function I(e) {
        return s(e[0], 8)
    }

    function R(e) {
        return [(e = r(Number(e))) < 0 ? 0 : 255 < e ? 255 : 255 & e]
    }

    function O(e) {
        return [255 & e, e >> 8 & 255]
    }

    function F(e) {
        return a(e[1] << 8 | e[0], 16)
    }

    function D(e) {
        return [255 & e, e >> 8 & 255]
    }

    function P(e) {
        return s(e[1] << 8 | e[0], 16)
    }

    function N(e) {
        return [255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255]
    }

    function L(e) {
        return a(e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0], 32)
    }

    function M(e) {
        return [255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255]
    }

    function U(e) {
        return s(e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0], 32)
    }

    function i(e, t, r) {
        var n, a, s, i = (1 << t - 1) - 1;

        function o(e) {
            var t = _(e), r = e - t;
            return !(r < .5) && (.5 < r || t % 2) ? t + 1 : t
        }

        if (e != e) a = (1 << t) - 1, s = T(2, r - 1), n = 0; else if (e === 1 / 0 || e === -1 / 0) a = (1 << t) - 1, n = e < (s = 0) ? 1 : 0; else if (0 === e) n = 1 / e == -1 / (s = a = 0) ? 1 : 0; else if (n = e < 0, (e = S(e)) >= T(2, 1 - i)) {
            a = B(_(y(e) / w), 1023);
            var l = e / T(2, a);
            l < 1 && (--a, l *= 2), 2 <= l && (a += 1, l /= 2);
            var c = T(2, r);
            a += i, 1 <= (s = o(l * c) - c) / c && (a += 1, s = 0), 2 * i < a && (a = (1 << t) - 1, s = 0)
        } else a = 0, s = o(e / T(2, 1 - i - r));
        var f, h = [];
        for (f = r; f; --f) h.push(s % 2 ? 1 : 0), s = _(s / 2);
        for (f = t; f; --f) h.push(a % 2 ? 1 : 0), a = _(a / 2);
        h.push(n ? 1 : 0), h.reverse();
        for (var u = h.join(""), d = []; u.length;) d.unshift(parseInt(u.substring(0, 8), 2)), u = u.substring(8);
        return d
    }

    function o(e, t, r) {
        var n, a, s, i, o, l, c, f, h = [];
        for (n = 0; n < e.length; ++n) for (s = e[n], a = 8; a; --a) h.push(s % 2 ? 1 : 0), s >>= 1;
        return h.reverse(), i = h.join(""), o = (1 << t - 1) - 1, l = parseInt(i.substring(0, 1), 2) ? -1 : 1, c = parseInt(i.substring(1, 1 + t), 2), f = parseInt(i.substring(1 + t), 2), c === (1 << t) - 1 ? 0 !== f ? NaN : 1 / 0 * l : 0 < c ? l * T(2, c - o) * (1 + f / T(2, r)) : 0 !== f ? l * T(2, -(o - 1)) * (f / T(2, r)) : l < 0 ? -0 : 0
    }

    function H(e) {
        return o(e, 11, 52)
    }

    function z(e) {
        return i(e, 11, 52)
    }

    function V(e) {
        return o(e, 8, 23)
    }

    function W(e) {
        return i(e, 8, 23)
    }

    function c(e, t) {
        return v(e.get) ? e.get(t) : e[t]
    }

    function f(e, t, r) {
        if (!(e instanceof ArrayBuffer || "ArrayBuffer" === b(e))) throw TypeError();
        if ((t >>>= 0) > e.byteLength) throw RangeError("byteOffset out of range");
        if (r === p ? r = e.byteLength - t : r >>>= 0, t + r > e.byteLength) throw RangeError("byteOffset and length reference an area beyond the end of the buffer");
        Object.defineProperty(this, "buffer", {value: e}), Object.defineProperty(this, "byteLength", {value: r}), Object.defineProperty(this, "byteOffset", {value: t})
    }

    function h(s) {
        return function (e, t) {
            if ((e >>>= 0) + s.BYTES_PER_ELEMENT > this.byteLength) throw RangeError("Array index out of range");
            e += this.byteOffset;
            for (var r = new Uint8Array(this.buffer, e, s.BYTES_PER_ELEMENT), n = [], a = 0; a < s.BYTES_PER_ELEMENT; a += 1) n.push(c(r, a));
            return Boolean(t) === Boolean(l) && n.reverse(), c(new s(new Uint8Array(n).buffer), 0)
        }
    }

    function u(o) {
        return function (e, t, r) {
            if ((e >>>= 0) + o.BYTES_PER_ELEMENT > this.byteLength) throw RangeError("Array index out of range");
            var n, a = new o([t]), s = new Uint8Array(a.buffer), i = [];
            for (n = 0; n < o.BYTES_PER_ELEMENT; n += 1) i.push(c(s, n));
            Boolean(r) === Boolean(l) && i.reverse(), new Uint8Array(this.buffer, e, o.BYTES_PER_ELEMENT).set(i)
        }
    }

    n = Object.defineProperty, e = !function () {
        try {
            return Object.defineProperty({}, "x", {})
        } catch (e) {
            return
        }
    }(), n && !e || (Object.defineProperty = function (e, t, r) {
        if (n) try {
            return n(e, t, r)
        } catch (e) {
        }
        if (e !== Object(e)) throw TypeError("Object.defineProperty called on non-object");
        return Object.prototype.__defineGetter__ && "get" in r && Object.prototype.__defineGetter__.call(e, t, r.get), Object.prototype.__defineSetter__ && "set" in r && Object.prototype.__defineSetter__.call(e, t, r.set), "value" in r && (e[t] = r.value), e
    }), function () {
        function a(e) {
            if ((e >>= 0) < 0) throw RangeError("ArrayBuffer size is not a small enough positive integer.");
            Object.defineProperty(this, "byteLength", {value: e}), Object.defineProperty(this, "_bytes", {value: Array(e)});
            for (var t = 0; t < e; t += 1) this._bytes[t] = 0
        }

        function s() {
            if (!arguments.length || "object" != typeof arguments[0]) return function (e) {
                if ((e >>= 0) < 0) throw RangeError("length is not a small enough positive integer.");
                Object.defineProperty(this, "length", {value: e}), Object.defineProperty(this, "byteLength", {value: e * this.BYTES_PER_ELEMENT}), Object.defineProperty(this, "buffer", {value: new a(this.byteLength)}), Object.defineProperty(this, "byteOffset", {value: 0})
            }.apply(this, arguments);
            if (1 <= arguments.length && "object" === g(arguments[0]) && arguments[0] instanceof s) return function (e) {
                if (this.constructor !== e.constructor) throw TypeError();
                var t = e.length * this.BYTES_PER_ELEMENT;
                Object.defineProperty(this, "buffer", {value: new a(t)}), Object.defineProperty(this, "byteLength", {value: t}), Object.defineProperty(this, "byteOffset", {value: 0}), Object.defineProperty(this, "length", {value: e.length});
                for (var r = 0; r < this.length; r += 1) this._setter(r, e._getter(r))
            }.apply(this, arguments);
            if (1 <= arguments.length && "object" === g(arguments[0]) && !(arguments[0] instanceof s) && !(arguments[0] instanceof a || "ArrayBuffer" === b(arguments[0]))) return function (e) {
                var t = e.length * this.BYTES_PER_ELEMENT;
                Object.defineProperty(this, "buffer", {value: new a(t)}), Object.defineProperty(this, "byteLength", {value: t}), Object.defineProperty(this, "byteOffset", {value: 0}), Object.defineProperty(this, "length", {value: e.length});
                for (var r = 0; r < this.length; r += 1) {
                    var n = e[r];
                    this._setter(r, Number(n))
                }
            }.apply(this, arguments);
            if (1 <= arguments.length && "object" === g(arguments[0]) && (arguments[0] instanceof a || "ArrayBuffer" === b(arguments[0]))) return function (e, t, r) {
                if ((t >>>= 0) > e.byteLength) throw RangeError("byteOffset out of range");
                if (t % this.BYTES_PER_ELEMENT) throw RangeError("buffer length minus the byteOffset is not a multiple of the element size.");
                if (r === p) {
                    var n = e.byteLength - t;
                    if (n % this.BYTES_PER_ELEMENT) throw RangeError("length of buffer minus byteOffset not a multiple of the element size");
                    r = n / this.BYTES_PER_ELEMENT
                } else n = (r >>>= 0) * this.BYTES_PER_ELEMENT;
                if (t + n > e.byteLength) throw RangeError("byteOffset and length reference an area beyond the end of the buffer");
                Object.defineProperty(this, "buffer", {value: e}), Object.defineProperty(this, "byteLength", {value: n}), Object.defineProperty(this, "byteOffset", {value: t}), Object.defineProperty(this, "length", {value: r})
            }.apply(this, arguments);
            throw TypeError()
        }

        d.ArrayBuffer = d.ArrayBuffer || a, Object.defineProperty(s, "from", {
            value: function (e) {
                return new this(e)
            }
        }), Object.defineProperty(s, "of", {
            value: function () {
                return new this(arguments)
            }
        });
        var i = {};

        function e(e, t, r) {
            var n = function () {
                Object.defineProperty(this, "constructor", {value: n}), s.apply(this, arguments), function (r) {
                    if (!("TYPED_ARRAY_POLYFILL_NO_ARRAY_ACCESSORS" in d)) {
                        if (r.length > m) throw RangeError("Array too large for polyfill");
                        var e;
                        for (e = 0; e < r.length; e += 1) t(e)
                    }

                    function t(t) {
                        Object.defineProperty(r, t, {
                            get: function () {
                                return r._getter(t)
                            }, set: function (e) {
                                r._setter(t, e)
                            }, enumerable: !0, configurable: !1
                        })
                    }
                }(this)
            };
            "__proto__" in n ? n.__proto__ = s : (n.from = s.from, n.of = s.of), n.BYTES_PER_ELEMENT = e;

            function a() {
            }

            return a.prototype = i, n.prototype = new a, Object.defineProperty(n.prototype, "BYTES_PER_ELEMENT", {value: e}), Object.defineProperty(n.prototype, "_pack", {value: t}), Object.defineProperty(n.prototype, "_unpack", {value: r}), n
        }

        s.prototype = i, Object.defineProperty(s.prototype, "_getter", {
            value: function (e) {
                if (arguments.length < 1) throw SyntaxError("Not enough arguments");
                if ((e >>>= 0) >= this.length) return p;
                var t, r, n = [];
                for (t = 0, r = this.byteOffset + e * this.BYTES_PER_ELEMENT; t < this.BYTES_PER_ELEMENT; t += 1, r += 1) n.push(this.buffer._bytes[r]);
                return this._unpack(n)
            }
        }), Object.defineProperty(s.prototype, "get", {value: s.prototype._getter}), Object.defineProperty(s.prototype, "_setter", {
            value: function (e, t) {
                if (arguments.length < 2) throw SyntaxError("Not enough arguments");
                if (!((e >>>= 0) >= this.length)) {
                    var r, n, a = this._pack(t);
                    for (r = 0, n = this.byteOffset + e * this.BYTES_PER_ELEMENT; r < this.BYTES_PER_ELEMENT; r += 1, n += 1) this.buffer._bytes[n] = a[r]
                }
            }
        }), Object.defineProperty(s.prototype, "constructor", {value: s}), Object.defineProperty(s.prototype, "copyWithin", {
            value: function (e, t) {
                var r = arguments[2], n = E(this), a = n.length >>> 0;
                a = C(a, 0);
                var s, i = e >> 0;
                s = i < 0 ? C(a + i, 0) : B(i, a);
                var o, l, c, f = t >> 0;
                o = f < 0 ? C(a + f, 0) : B(f, a), c = (l = r === p ? a : r >> 0) < 0 ? C(a + l, 0) : B(l, a);
                var h, u = B(c - o, a - s);
                for (o < s && s < o + u ? (h = -1, o = o + u - 1, s = s + u - 1) : h = 1; 0 < u;) n._setter(s, n._getter(o)), o += h, s += h, --u;
                return n
            }
        }), Object.defineProperty(s.prototype, "every", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                for (var n = arguments[1], a = 0; a < r; a++) if (!e.call(n, t._getter(a), a, t)) return !1;
                return !0
            }
        }), Object.defineProperty(s.prototype, "fill", {
            value: function (e) {
                var t = arguments[1], r = arguments[2], n = E(this), a = n.length >>> 0;
                a = C(a, 0);
                var s, i, o, l = t >> 0;
                for (s = l < 0 ? C(a + l, 0) : B(l, a), o = (i = r === p ? a : r >> 0) < 0 ? C(a + i, 0) : B(i, a); s < o;) n._setter(s, e), s += 1;
                return n
            }
        }), Object.defineProperty(s.prototype, "filter", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                for (var n = [], a = arguments[1], s = 0; s < r; s++) {
                    var i = t._getter(s);
                    e.call(a, i, s, t) && n.push(i)
                }
                return new this.constructor(n)
            }
        }), Object.defineProperty(s.prototype, "find", {
            value: function (e) {
                var t = E(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                for (var n = 1 < arguments.length ? arguments[1] : p, a = 0; a < r;) {
                    var s = t._getter(a), i = e.call(n, s, a, t);
                    if (Boolean(i)) return s;
                    ++a
                }
                return p
            }
        }), Object.defineProperty(s.prototype, "findIndex", {
            value: function (e) {
                var t = E(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                for (var n = 1 < arguments.length ? arguments[1] : p, a = 0; a < r;) {
                    var s = t._getter(a), i = e.call(n, s, a, t);
                    if (Boolean(i)) return a;
                    ++a
                }
                return -1
            }
        }), Object.defineProperty(s.prototype, "forEach", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                for (var n = arguments[1], a = 0; a < r; a++) e.call(n, t._getter(a), a, t)
            }
        }), Object.defineProperty(s.prototype, "indexOf", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (0 == r) return -1;
                var n = 0;
                if (0 < arguments.length && ((n = Number(arguments[1])) != n ? n = 0 : 0 !== n && n !== 1 / 0 && n !== -1 / 0 && (n = (0 < n || -1) * _(S(n)))), r <= n) return -1;
                for (var a = 0 <= n ? n : C(r - S(n), 0); a < r; a++) if (t._getter(a) === e) return a;
                return -1
            }
        }), Object.defineProperty(s.prototype, "join", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                for (var t = Object(this), r = t.length >>> 0, n = Array(r), a = 0; a < r; ++a) n[a] = t._getter(a);
                return n.join(e === p ? "," : e)
            }
        }), Object.defineProperty(s.prototype, "lastIndexOf", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (0 == r) return -1;
                var n = r;
                1 < arguments.length && ((n = Number(arguments[1])) != n ? n = 0 : 0 !== n && n !== 1 / 0 && n !== -1 / 0 && (n = (0 < n || -1) * _(S(n))));
                for (var a = 0 <= n ? B(n, r - 1) : r - S(n); 0 <= a; a--) if (t._getter(a) === e) return a;
                return -1
            }
        }), Object.defineProperty(s.prototype, "map", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                var n = [];
                n.length = r;
                for (var a = arguments[1], s = 0; s < r; s++) n[s] = e.call(a, t._getter(s), s, t);
                return new this.constructor(n)
            }
        }), Object.defineProperty(s.prototype, "reduce", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                if (0 == r && 1 === arguments.length) throw TypeError();
                var n, a = 0;
                for (n = 2 <= arguments.length ? arguments[1] : t._getter(a++); a < r;) n = e.call(p, n, t._getter(a), a, t), a++;
                return n
            }
        }), Object.defineProperty(s.prototype, "reduceRight", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                if (0 == r && 1 === arguments.length) throw TypeError();
                var n, a = r - 1;
                for (n = 2 <= arguments.length ? arguments[1] : t._getter(a--); 0 <= a;) n = e.call(p, n, t._getter(a), a, t), a--;
                return n
            }
        }), Object.defineProperty(s.prototype, "reverse", {
            value: function () {
                if (this === p || null === this) throw TypeError();
                for (var e = Object(this), t = e.length >>> 0, r = _(t / 2), n = 0, a = t - 1; n < r; ++n, --a) {
                    var s = e._getter(n);
                    e._setter(n, e._getter(a)), e._setter(a, s)
                }
                return e
            }
        }), Object.defineProperty(s.prototype, "set", {
            value: function (e, t) {
                if (arguments.length < 1) throw SyntaxError("Not enough arguments");
                var r, n, a, s, i, o, l, c, f, h;
                if ("object" == typeof e && e.constructor === this.constructor) {
                    if ((a = t >>> 0) + (r = e).length > this.length) throw RangeError("Offset plus length of array is out of range");
                    if (c = this.byteOffset + a * this.BYTES_PER_ELEMENT, f = r.length * this.BYTES_PER_ELEMENT, r.buffer === this.buffer) {
                        for (h = [], i = 0, o = r.byteOffset; i < f; i += 1, o += 1) h[i] = r.buffer._bytes[o];
                        for (i = 0, l = c; i < f; i += 1, l += 1) this.buffer._bytes[l] = h[i]
                    } else for (i = 0, o = r.byteOffset, l = c; i < f; i += 1, o += 1, l += 1) this.buffer._bytes[l] = r.buffer._bytes[o]
                } else {
                    if ("object" != typeof e || void 0 === e.length) throw TypeError("Unexpected argument type(s)");
                    if ((a = t >>> 0) + (s = (n = e).length >>> 0) > this.length) throw RangeError("Offset plus length of array is out of range");
                    for (i = 0; i < s; i += 1) o = n[i], this._setter(a + i, Number(o))
                }
            }
        }), Object.defineProperty(s.prototype, "slice", {
            value: function (e, t) {
                for (var r = E(this), n = r.length >>> 0, a = e >> 0, s = a < 0 ? C(n + a, 0) : B(a, n), i = t === p ? n : t >> 0, o = i < 0 ? C(n + i, 0) : B(i, n), l = o - s, c = new r.constructor(l), f = 0; s < o;) {
                    var h = r._getter(s);
                    c._setter(f, h), ++s, ++f
                }
                return c
            }
        }), Object.defineProperty(s.prototype, "some", {
            value: function (e) {
                if (this === p || null === this) throw TypeError();
                var t = Object(this), r = t.length >>> 0;
                if (!v(e)) throw TypeError();
                for (var n = arguments[1], a = 0; a < r; a++) if (e.call(n, t._getter(a), a, t)) return !0;
                return !1
            }
        }), Object.defineProperty(s.prototype, "sort", {
            value: function (r) {
                if (this === p || null === this) throw TypeError();
                for (var e = Object(this), t = e.length >>> 0, n = Array(t), a = 0; a < t; ++a) n[a] = e._getter(a);
                for (n.sort(function (e, t) {
                    return e != e && t != t ? 0 : e != e ? 1 : t != t ? -1 : r !== p ? r(e, t) : e < t ? -1 : t < e ? 1 : 0
                }), a = 0; a < t; ++a) e._setter(a, n[a]);
                return e
            }
        }), Object.defineProperty(s.prototype, "subarray", {
            value: function (e, t) {
                function r(e, t, r) {
                    return e < t ? t : r < e ? r : e
                }

                e >>= 0, t >>= 0, arguments.length < 1 && (e = 0), arguments.length < 2 && (t = this.length), e < 0 && (e = this.length + e), t < 0 && (t = this.length + t), e = r(e, 0, this.length);
                var n = (t = r(t, 0, this.length)) - e;
                return n < 0 && (n = 0), new this.constructor(this.buffer, this.byteOffset + e * this.BYTES_PER_ELEMENT, n)
            }
        });
        var t = e(1, k, x), r = e(1, A, I), n = e(1, R, I), o = e(2, O, F), l = e(2, D, P), c = e(4, N, L),
            f = e(4, M, U), h = e(4, W, V), u = e(8, z, H);
        d.Int8Array = d.Int8Array || t, d.Uint8Array = d.Uint8Array || r, d.Uint8ClampedArray = d.Uint8ClampedArray || n, d.Int16Array = d.Int16Array || o, d.Uint16Array = d.Uint16Array || l, d.Int32Array = d.Int32Array || c, d.Uint32Array = d.Uint32Array || f, d.Float32Array = d.Float32Array || h, d.Float64Array = d.Float64Array || u
    }(), t = new Uint16Array([4660]), l = 18 === c(new Uint8Array(t.buffer), 0), Object.defineProperty(f.prototype, "getUint8", {value: h(Uint8Array)}), Object.defineProperty(f.prototype, "getInt8", {value: h(Int8Array)}), Object.defineProperty(f.prototype, "getUint16", {value: h(Uint16Array)}), Object.defineProperty(f.prototype, "getInt16", {value: h(Int16Array)}), Object.defineProperty(f.prototype, "getUint32", {value: h(Uint32Array)}), Object.defineProperty(f.prototype, "getInt32", {value: h(Int32Array)}), Object.defineProperty(f.prototype, "getFloat32", {value: h(Float32Array)}), Object.defineProperty(f.prototype, "getFloat64", {value: h(Float64Array)}), Object.defineProperty(f.prototype, "setUint8", {value: u(Uint8Array)}), Object.defineProperty(f.prototype, "setInt8", {value: u(Int8Array)}), Object.defineProperty(f.prototype, "setUint16", {value: u(Uint16Array)}), Object.defineProperty(f.prototype, "setInt16", {value: u(Int16Array)}), Object.defineProperty(f.prototype, "setUint32", {value: u(Uint32Array)}), Object.defineProperty(f.prototype, "setInt32", {value: u(Int32Array)}), Object.defineProperty(f.prototype, "setFloat32", {value: u(Float32Array)}), Object.defineProperty(f.prototype, "setFloat64", {value: u(Float64Array)}), d.DataView = d.DataView || f
}(self);