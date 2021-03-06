/**
 *
 * @name:  子表格扩展
 * @author: yelog
 * @link: https://github.com/yelog/layui-soul-table
 * @license: MIT
 * @version: v1.5.21
 */
layui.define(["table", "element", "form", "laytpl"], function (exports) {
    var $ = layui.jquery, table = layui.table, laytpl = layui.laytpl, tableChildren = {}, HIDE = "layui-hide",
        ELEM_HOVER = "soul-table-hover", mod = {
            render: function (x) {
                var t, g = this, l = $(x.elem), e = l.next().children(".layui-table-box"), i = x.id,
                    C = e.children(".layui-table-header").children("table"),
                    E = e.children(".layui-table-fixed").children(".layui-table-body").children("table"),
                    w = e.children(".layui-table-body").children("table"),
                    S = $.merge(e.children(".layui-table-body").children("table"), E), a = g.getCompleteCols(x.cols),
                    n = [], r = void 0 === x.soulSort || x.soulSort;
                for (g.fixHoverStyle(x), t = 0; t < a.length; t++) a[t].children && 0 < a[t].children.length && n.push(t);
                if (void 0 === l.attr("lay-filter") && l.attr("lay-filter", i), 0 === l.parents(".childTr").length && ("function" == typeof x.rowEvent && table.on("row(" + l.attr("lay-filter") + ")", function (e) {
                    x.rowEvent(g.commonMember.call(this, g, x, e))
                }), "function" == typeof x.rowDoubleEvent && table.on("rowDouble(" + l.attr("lay-filter") + ")", function (e) {
                    x.rowDoubleEvent(g.commonMember.call(this, g, x, e))
                }), "function" == typeof x.checkboxEvent && table.on("checkbox(" + l.attr("lay-filter") + ")", function (e) {
                    x.checkboxEvent(g.commonMember.call(this, g, x, e))
                }), "function" == typeof x.editEvent && table.on("edit(" + l.attr("lay-filter") + ")", function (e) {
                    x.editEvent(g.commonMember.call(this, g, x, e))
                }), "function" == typeof x.toolEvent && table.on("tool(" + l.attr("lay-filter") + ")", function (e) {
                    x.toolEvent(g.commonMember.call(this, g, x, e))
                }), "function" == typeof x.toolbarEvent && table.on("toolbar(" + l.attr("lay-filter") + ")", function (e) {
                    x.toolbarEvent(g.commonMember.call(this, g, x, e))
                })), 0 < n.length) for (t = 0; t < n.length; t++) !function () {
                    var m = a[n[t]], e = n[t], v = m.icon || ["layui-icon layui-icon-right", "layui-icon layui-icon-down"];
                    !r || x.url && x.page || table.on("sort(" + l.attr("lay-filter") + ")", function () {
                        g.render(x)
                    }), m.isChild && "function" == typeof m.isChild ? S.find("tr").find('td[data-key$="' + m.key + '"]>div').each(function (e) {
                        m.isChild(layui.table.cache[i][e]) && (m.field ? $(this).prepend('<i style="cursor: pointer" class="childTable ' + v[0] + '"></i>') : $(this).html('<i style="cursor: pointer" class="childTable ' + v[0] + '"></i>'))
                    }) : m.field ? S.find("tr").find('td[data-key$="' + m.key + '"]>div').prepend('<i style="cursor: pointer" class="childTable ' + v[0] + '"></i>') : S.find("tr").find('td[data-key$="' + m.key + '"]>div').html('<i style="cursor: pointer" class="childTable ' + v[0] + '"></i>'), S.children("tbody").children("tr").each(function () {
                        $(this).children("td:eq(" + e + ")").find(".childTable").on("click", function (e) {
                            layui.stope(e);
                            var t = $(this).parents("tr:eq(0)").data("index"), a = x.id,
                                l = $(this).parents("td:eq(0)").data("key"),
                                i = w.children("tbody").children("tr[data-index=" + t + "]").children('td[data-key="' + l + '"]').find(".childTable:eq(0)"),
                                n = E.find("tr[data-index=" + t + "]").children('td[data-key="' + l + '"]').find(".childTable:eq(0)"),
                                r = table.cache[a][t], d = m.children, o = !1, c = "",
                                h = S.children("tbody").children('tr[data-index="' + t + '"]'), s = {
                                    data: r, tr: h, del: function () {
                                        table.cache[a][t] = [], g.destroyChildren(t, x, v), h.remove(), table.resize(a)
                                    }, update: function (e) {
                                        e = e || {}, layui.each(e, function (l, e) {
                                            if (l in r) {
                                                var i, t = h.children('td[data-field="' + l + '"]');
                                                r[l] = e, table.eachCols(a, function (e, t) {
                                                    t.field == l && t.templet && (i = t.templet)
                                                }), t.children(".layui-table-cell").html(i ? "function" == typeof i ? i(r) : laytpl($(i).html() || e).render(r) : e), t.data("content", e)
                                            }
                                        })
                                    }, close: function () {
                                        g.destroyChildren(t, x, v), table.resize(a)
                                    }
                                };
                            if (i.hasClass(v[1])) {
                                if ("function" == typeof m.childClose && !1 === m.childClose(s)) return
                            } else if ("function" == typeof m.childOpen && !1 === m.childOpen(s)) return;
                            if ("function" == typeof d && (d = d(r)), "string" == typeof d && (o = !0, c = g.parseTempData(m, m.field ? r[m.field] : null, r)), 2 === m.show) !m.layerOption || "function" == typeof m.layerOption.title && (m.layerOption.title = m.layerOption.title(r)), layer.open($.extend({
                                type: 1,
                                title: "子表",
                                maxmin: !0,
                                content: g.getTables(this, r, m, x, d, o, c),
                                area: "1000px",
                                offset: "100px",
                                cancel: function () {
                                    "function" != typeof m.childClose || m.childClose(s)
                                }
                            }, m.layerOption || {})), o || g.renderTable(this, r, m, x, d, v); else {
                                !i.hasClass(v[1]) && m.collapse && S.children("tbody").children("tr").children("td").find(".childTable").each(function () {
                                    $(this).hasClass(v[1]) && g.destroyChildren($(this).parents("tr:eq(0)").data("index"), x, v)
                                }), i.hasClass(v[1]) || i.parents("tr:eq(0)").children("td").find(".childTable").each(function () {
                                    $(this).hasClass(v[1]) && ($(this).removeClass(v[1]).addClass(v[0]), g.destroyChildren($(this).parents("tr:eq(0)").data("index"), x, v))
                                }), i.hasClass(v[1]) ? (i.removeClass(v[1]).addClass(v[0]), n.removeClass(v[1]).addClass(v[0])) : (i.removeClass(v[0]).addClass(v[1]), n.removeClass(v[0]).addClass(v[1]));
                                var u = i.parents("td:eq(0)").attr("rowspan");
                                if (i.hasClass(v[1])) {
                                    var b = [];
                                    if (b.push('<tr data-tpl="' + o + '" class="noHover childTr"><td colspan="' + C.find("th:visible").length + '"  style="cursor: inherit; padding: 0;">'), b.push(g.getTables(this, r, m, x, d, o, c)), b.push("</td></tr>"), u) {
                                        var f = parseInt(i.parents("tr:eq(0)").data("index")) + parseInt(u) - 1;
                                        i.parents("table:eq(0)").children().children("[data-index='" + f + "']").after(b.join(""))
                                    } else i.parents("tr:eq(0)").after(b.join(""));
                                    if (layui.element.init("tab"), o || (g.renderTable(this, r, m, x, d, v), i.parents("tr:eq(0)").next().children("td").children(".layui-tab").children(".layui-tab-content").on("click", function (e) {
                                        $(e.target.parentElement).hasClass("layui-tab-title") || e.stopPropagation()
                                    }).off("dblclick").on("dblclick", function (e) {
                                        e.stopPropagation()
                                    }).on("mouseenter", "td", function (e) {
                                        e.stopPropagation()
                                    }).on("change", function (e) {
                                        layui.stope(e)
                                    })), 0 < E.length) {
                                        var y = i.parents("tr:eq(0)").next(),
                                            p = '<div class="soul-table-child-patch" style="height: ' + y.children("td").height() + 'px"></div>';
                                        y.children("td").children(".soul-table-child-wrapper").css({
                                            position: "absolute",
                                            top: 0,
                                            width: "100%",
                                            background: "white",
                                            "z-index": 200
                                        }), y.children("td").append(p), E.find('tr[data-index="' + t + '"]').each(function () {
                                            $(this).after('<tr><td style="padding: 0;" colspan="' + $(this).children("[data-key]").length + '">' + p + "</td></tr>")
                                        }), table.resize(a)
                                    }
                                    3 === m.show && (i.parents("tr:eq(0)").next().find(".layui-table-view").css({
                                        margin: 0,
                                        "border-width": 0
                                    }), i.parents("tr:eq(0)").next().find(".layui-table-header").css("display", "none"))
                                } else g.destroyChildren(t, x, v), table.resize(a)
                            }
                        })
                    }), m.spread && 2 !== m.show && S.children("tbody").children("tr").children("td").find(".childTable").trigger("click")
                }()
            }, getTables: function (e, t, l, i, a, n, r) {
                var d, o = [], c = $(i.elem), h = c.next().children(".layui-table-box"),
                    s = i.id + $(e).parents("tr:eq(0)").data("index"),
                    u = h.children(".layui-table-header").children("table"),
                    b = c.next().children(".layui-table-box").children(".layui-table-body"), f = b.children("table"), y = 0;
                if (n ? o.push('<div class="soul-table-child-wrapper" style="margin: 0;border: 0;box-shadow: none;') : o.push('<div class="layui-tab layui-tab-card soul-table-child-wrapper" lay-filter="table-child-tab-' + s + '" style="margin: 0;border: 0;box-shadow: none;'), 2 === l.show) o.push("max-width: " + (f.width() - 2) + 'px">'); else if (3 === l.show) o.push('">'); else if ("full" === l.childWidth) o.push('">'); else {
                    b.prop("scrollHeight") + (0 < a.length ? a[0].height : 0) > b.height() && (y = this.getScrollWidth());
                    var p = b.width() - 1 - y;
                    o.push("max-width: " + (p > u.width() ? u.width() : p) + 'px">')
                }
                if (n) o.push(r); else {
                    if (3 !== l.show && (void 0 === l.childTitle || l.childTitle)) {
                        for (o.push('<ul class="layui-tab-title">'), d = 0; d < a.length; d++) o.push('<li class="' + (0 === d ? "layui-this" : "") + '">' + ("function" == typeof a[d].title ? a[d].title(t) : a[d].title) + "</li>");
                        o.push("</ul>")
                    }
                    for (3 === l.show ? o.push('<div class="layui-tab-content" style="padding: 0">') : o.push('<div class="layui-tab-content" style="padding: 0 10px">'), d = 0; d < a.length; d++) {
                        var m = s + d;
                        o.push('<div class="layui-tab-item layui-show"><form action="" class="layui-form" ><table id="' + m + '" lay-filter="' + m + '"></table></form></div>')
                    }
                    o.push("</div>")
                }
                return o.push("</div>"), o.join("")
            }, renderTable: function (a, n, r, d, o, e) {
                var t = [], c = this, h = d.id, s = h + $(a).parents("tr:eq(0)").data("index");
                if (r.lazy) t.push(b(c, a, n, r, d, 0, o, e)); else for (var u = 0; u < o.length; u++) t.push(b(c, a, n, r, d, u, o, e));

                function b(t, e, l, i, a, n, r, d) {
                    var o, c = t.deepClone(r[n]), h = a.id, s = $(e).parents("tr:eq(0)").data("index"), u = h + s + n,
                        b = $(a.elem).next().children(".layui-table-box"),
                        f = $.merge(b.children(".layui-table-body").children("table"), b.children(".layui-table-fixed").children(".layui-table-body").children("table")).children("tbody").children('tr[data-index="' + s + '"]'),
                        y = table.cache[h][s], p = {
                            data: y, tr: f, del: function () {
                                table.cache[h][s] = [], t.destroyChildren(s, a, d), f.remove(), table.resize(h)
                            }, update: function (e) {
                                e = e || {}, layui.each(e, function (l, e) {
                                    if (l in y) {
                                        var i, t = f.children('td[data-field="' + l + '"]');
                                        y[l] = e, table.eachCols(h, function (e, t) {
                                            t.field == l && t.templet && (i = t.templet)
                                        }), t.children(".layui-table-cell").html(i ? "function" == typeof i ? i(y) : laytpl($(i).html() || e).render(y) : e), t.data("content", e)
                                    }
                                })
                            }, close: function () {
                                t.destroyChildren(s, a, d), table.resize(h)
                            }
                        };
                    return c.id = u, c.elem = "#" + u, "function" == typeof c.where && (c.where = c.where(l)), "function" == typeof c.data && (c.data = c.data(l)), "function" == typeof c.url && (c.url = c.url(l)), o = table.render(c), i.lazy || 0 === n || $("#" + u).parents(".layui-tab-item:eq(0)").removeClass("layui-show"), "function" == typeof c.checkboxEvent && table.on("checkbox(" + u + ")", function (e) {
                        c.checkboxEvent(t.commonMember.call(this, t, c, e), p)
                    }), "function" == typeof c.editEvent && table.on("edit(" + u + ")", function (e) {
                        c.editEvent(t.commonMember.call(this, t, c, e), p)
                    }), "function" == typeof c.toolEvent && table.on("tool(" + u + ")", function (e) {
                        c.toolEvent(t.commonMember.call(this, t, c, e), p)
                    }), "function" == typeof c.toolbarEvent && table.on("toolbar(" + u + ")", function (e) {
                        c.toolbarEvent(t.commonMember.call(this, t, c, e), p)
                    }), "function" == typeof c.rowEvent && table.on("row(" + u + ")", function (e) {
                        c.rowEvent(t.commonMember.call(this, t, c, e), p)
                    }), "function" == typeof c.rowDoubleEvent && table.on("rowDouble(" + u + ")", function (e) {
                        c.rowDoubleEvent(t.commonMember.call(this, t, c, e), p)
                    }), o
                }

                tableChildren[s] = t, layui.element.on("tab(table-child-tab-" + s + ")", function (e) {
                    if (r.lazy) {
                        var t = !1;
                        for (u = 0; u < tableChildren[s].length; u++) if (tableChildren[s][u].config.id === s + e.index) {
                            t = !0;
                            break
                        }
                        t || tableChildren[s].push(b(c, a, n, r, d, e.index, o))
                    }
                    var l = $(a).parents("tr:eq(0)").data("index"), i = $(e.elem).height();
                    $(a).parents(".layui-table-box:eq(0)").children(".layui-table-body").children("table").children("tbody").children("tr[data-index=" + l + "]").next().children().children(".soul-table-child-patch").css("height", i), $(a).parents(".layui-table-box:eq(0)").children(".layui-table-fixed").children(".layui-table-body").children("table").children("tbody").children("tr[data-index=" + l + "]").next().children().children(".soul-table-child-patch").css("height", i), table.resize(h)
                })
            }, destroyChildren: function (e, t, l) {
                var i = t.id, a = $(t.elem).next().children(".layui-table-box"),
                    n = a.children(".layui-table-fixed").children(".layui-table-body").children("table"),
                    r = $.merge(a.children(".layui-table-body").children("table"), n).children("tbody").children('tr[data-index="' + e + '"]'),
                    d = r.next().data("tpl");
                if (r.find(".childTable").removeClass(l[1]).addClass(l[0]), r.next().remove(), "false" === d) {
                    var o = tableChildren[i + e];
                    if (layui.tableFilter && layui.tableFilter.destroy(o), layui.soulTable) for (var c = 0; c < tableChildren[i + e].length; c++) layui.soulTable.clearOriginCols(tableChildren[i + e][c].config.id)
                }
                delete tableChildren[i + e]
            }, cloneJSON: function (obj) {
                var JSON_SERIALIZE_FIX = {PREFIX: "[[JSON_FUN_PREFIX_", SUFFIX: "_JSON_FUN_SUFFIX]]"},
                    sobj = JSON.stringify(obj, function (e, t) {
                        return "function" == typeof t ? JSON_SERIALIZE_FIX.PREFIX + t.toString() + JSON_SERIALIZE_FIX.SUFFIX : t
                    });
                return JSON.parse(sobj, function (key, value) {
                    return "string" == typeof value && 0 < value.indexOf(JSON_SERIALIZE_FIX.SUFFIX) && 0 === value.indexOf(JSON_SERIALIZE_FIX.PREFIX) ? eval("(" + value.replace(JSON_SERIALIZE_FIX.PREFIX, "").replace(JSON_SERIALIZE_FIX.SUFFIX, "") + ")") : value
                }) || {}
            }, fixHoverStyle: function (e) {
                var t = $(e.elem),
                    l = t.next().children(".layui-table-box").children(".layui-table-body").children("table"),
                    i = t.next().children(".layui-table-box").children(".layui-table-fixed").children(".layui-table-body").children("table"),
                    a = t.next().find("style")[0], n = a.sheet || a.styleSheet || {};
                this.addCSSRule(n, ".layui-table-hover", "background-color: inherit"), this.addCSSRule(n, ".layui-table-hover.soul-table-hover", "background-color: #F2F2F2"), $.merge(i.children("tbody").children("tr"), l.children("tbody").children("tr")).on("mouseenter", function () {
                    var e = $(this), t = $(this).data("index");
                    e.data("off") || (i.children("tbody").children("tr[data-index=" + t + "]").addClass(ELEM_HOVER), l.children("tbody").children("tr[data-index=" + t + "]").addClass(ELEM_HOVER))
                }).on("mouseleave", function () {
                    var e = $(this), t = $(this).data("index");
                    e.data("off") || (i.children("tbody").children("tr[data-index=" + t + "]").removeClass(ELEM_HOVER), l.children("tbody").children("tr[data-index=" + t + "]").removeClass(ELEM_HOVER))
                })
            }, addCSSRule: function (e, t, l, i) {
                "insertRule" in e ? e.insertRule(t + "{" + l + "}", i) : "addRule" in e && e.addRule(t, l, i)
            }, deepClone: function (e) {
                var t = Array.isArray(e) ? [] : {};
                if (e && "object" == typeof e) for (var l in e) e.hasOwnProperty(l) && (t[l] = e && "object" == typeof e[l] ? this.deepClone(e[l]) : e[l]);
                return t
            }, getCompleteCols: function (e) {
                var t, l, i, a, n = this.deepClone(e);
                for (t = 0; t < n.length; t++) for (l = 0; l < n[t].length; l++) if (!n[t][l].exportHandled) {
                    if (1 < n[t][l].rowspan) for ((a = this.deepClone(n[t][l])).exportHandled = !0, i = t + 1; i < n.length;) n[i].splice(l, 0, a), i++;
                    if (1 < n[t][l].colspan) {
                        for ((a = this.deepClone(n[t][l])).exportHandled = !0, i = 1; i < n[t][l].colspan; i++) n[t].splice(l, 0, a);
                        l = l + parseInt(n[t][l].colspan) - 1
                    }
                }
                return n[n.length - 1]
            }, getScrollWidth: function (e) {
                var t = 0;
                return e ? t = e.offsetWidth - e.clientWidth : ((e = document.createElement("div")).style.width = "100px", e.style.height = "100px", e.style.overflowY = "scroll", document.body.appendChild(e), t = e.offsetWidth - e.clientWidth, document.body.removeChild(e)), t
            }, parseTempData: function (e, t, l, i) {
                var a = e.children ? "function" == typeof e.children ? e.children(l) : laytpl($(e.children).html() || String(t)).render(l) : t;
                return i ? $("<div>" + a + "</div>").text() : a
            }, commonMember: function (a, e, t) {
                var l = $(this), n = e.id, i = $(e.elem).next().children(".layui-table-box"),
                    r = i.children(".layui-table-fixed").children(".layui-table-body").children("table"),
                    d = $.merge(i.children(".layui-table-body").children("table"), r),
                    o = "TR" === l[0].tagName ? $(this).data("index") : l.parents("tr:eq(0)").data("index"),
                    c = d.children("tbody").children('tr[data-index="' + o + '"]'), h = table.cache[n] || [];
                return h = h[o] || {}, $.extend(t, {
                    tr: c, oldValue: l.prev() ? l.prev().text() : null, del: function () {
                        table.cache[n][o] = [], c.remove(), a.scrollPatch(e)
                    }, update: function (e) {
                        e = e || {}, layui.each(e, function (l, e) {
                            if (l in h) {
                                var i, t = c.children('td[data-field="' + l + '"]');
                                h[l] = e, table.eachCols(n, function (e, t) {
                                    t.field == l && t.templet && (i = t.templet)
                                }), t.children(".layui-table-cell").html(a.parseTempData({templet: i}, e, h)), t.data("content", e)
                            }
                        })
                    }
                })
            }, scrollPatch: function (e) {
                function t(e) {
                    if (c && h) {
                        if (!(e = e.eq(0)).find(".layui-table-patch")[0]) {
                            var t = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>');
                            t.find("div").css({width: c}), e.find("tr").append(t)
                        }
                    } else e.find(".layui-table-patch").remove()
                }

                var l = $(e.elem), i = l.next().children(".layui-table-box").children(".layui-table-header"),
                    a = l.next().children(".layui-table-total"),
                    n = l.next().children(".layui-table-box").children(".layui-table-main"),
                    r = l.next().children(".layui-table-box").children(".layui-table-fixed"),
                    d = l.next().children(".layui-table-box").children(".layui-table-fixed-r"), o = n.children("table"),
                    c = n.width() - n.prop("clientWidth"), h = n.height() - n.prop("clientHeight"),
                    s = o.outerWidth() - n.width();
                t(i), t(a);
                var u = n.height() - h;
                r.find(".layui-table-body").css("height", o.height() >= u ? u : "auto"), d[0 < s ? "removeClass" : "addClass"](HIDE), d.css("right", c - 1)
            }
        };
    exports("tableChild", mod)
});