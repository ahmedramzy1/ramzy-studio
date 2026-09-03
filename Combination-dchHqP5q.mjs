import { n as e, t } from "./chunk-jwUa06l-.mjs";
import { n, t as r } from "./shim-TDw7aRD2.mjs";
import * as i from "react";
import { useLayoutEffect as a, useState as o } from "react";
import * as s from "react-dom";
//#region ../../node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.7/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js
var c = /* @__PURE__ */ t(((e) => {
	var t = n(), i = r();
	function a(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var o = typeof Object.is == "function" ? Object.is : a, s = i.useSyncExternalStore, c = t.useRef, l = t.useEffect, u = t.useMemo, d = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, i) {
		var a = c(null);
		if (a.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			a.current = f;
		} else f = a.current;
		a = u(function() {
			function e(e) {
				if (!a) {
					if (a = !0, s = e, e = r(e), i !== void 0 && f.hasValue) {
						var t = f.value;
						if (i(t, e)) return c = t;
					}
					return c = e;
				}
				if (t = c, o(s, e)) return t;
				var n = r(e);
				return i !== void 0 && i(t, n) ? (s = e, t) : (s = e, c = n);
			}
			var a = !1, s, c, l = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, l === null ? void 0 : function() {
				return e(l());
			}];
		}, [
			t,
			n,
			r,
			i
		]);
		var p = s(e, a[0], a[1]);
		return l(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), d(p), p;
	};
})), l = /* @__PURE__ */ t(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e, t) {
			return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var i = n(), a = r(), o = typeof Object.is == "function" ? Object.is : t, s = a.useSyncExternalStore, c = i.useRef, l = i.useEffect, u = i.useMemo, d = i.useDebugValue;
		e.useSyncExternalStoreWithSelector = function(e, t, n, r, i) {
			var a = c(null);
			if (a.current === null) {
				var f = {
					hasValue: !1,
					value: null
				};
				a.current = f;
			} else f = a.current;
			a = u(function() {
				function e(e) {
					if (!a) {
						if (a = !0, s = e, e = r(e), i !== void 0 && f.hasValue) {
							var t = f.value;
							if (i(t, e)) return c = t;
						}
						return c = e;
					}
					if (t = c, o(s, e)) return t;
					var n = r(e);
					return i !== void 0 && i(t, n) ? (s = e, t) : (s = e, c = n);
				}
				var a = !1, s, c, l = n === void 0 ? null : n;
				return [function() {
					return e(t());
				}, l === null ? void 0 : function() {
					return e(l());
				}];
			}, [
				t,
				n,
				r,
				i
			]);
			var p = s(e, a[0], a[1]);
			return l(function() {
				f.hasValue = !0, f.value = p;
			}, [p]), d(p), p;
		}, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), u = /* @__PURE__ */ t(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = c() : t.exports = l();
}));
//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
function d(e, t, n) {
	return M(e, j(t, n));
}
function f(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function p(e) {
	return e.split("-")[0];
}
function m(e) {
	return e.split("-")[1];
}
function h(e) {
	return e === "x" ? "y" : "x";
}
function g(e) {
	return e === "y" ? "height" : "width";
}
function _(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function v(e) {
	return h(_(e));
}
function y(e, t, n) {
	n === void 0 && (n = !1);
	let r = m(e), i = v(e), a = g(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = w(o)), [o, w(o)];
}
function b(e) {
	let t = w(e);
	return [
		x(e),
		t,
		x(t)
	];
}
function x(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
function S(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? L : I : t ? I : L;
		case "left":
		case "right": return t ? te : ne;
		default: return [];
	}
}
function C(e, t, n, r) {
	let i = m(e), a = S(p(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(x)))), a;
}
function w(e) {
	let t = p(e);
	return ee[t] + e.slice(t.length);
}
function T(e) {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...e
	};
}
function E(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : T(e);
}
function D(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
var O, k, A, j, M, N, P, F, ee, I, L, te, ne, re = e((() => {
	O = [
		"top",
		"right",
		"bottom",
		"left"
	], k = ["start", "end"], A = /*#__PURE__*/ O.reduce((e, t) => e.concat(t, t + "-" + k[0], t + "-" + k[1]), []), j = Math.min, M = Math.max, N = Math.round, P = Math.floor, F = (e) => ({
		x: e,
		y: e
	}), ee = {
		left: "right",
		right: "left",
		bottom: "top",
		top: "bottom"
	}, I = ["left", "right"], L = ["right", "left"], te = ["top", "bottom"], ne = ["bottom", "top"];
}));
//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+core@1.7.5/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function ie(e, t, n) {
	let { reference: r, floating: i } = e, a = _(t), o = v(t), s = g(o), c = p(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, h;
	switch (c) {
		case "top":
			h = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			h = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			h = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			h = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: h = {
			x: r.x,
			y: r.y
		};
	}
	switch (m(t)) {
		case "start":
			h[o] -= f * (n && l ? -1 : 1);
			break;
		case "end":
			h[o] += f * (n && l ? -1 : 1);
			break;
	}
	return h;
}
async function ae(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: p = 0 } = f(t, e), m = E(p), h = o[d ? u === "floating" ? "reference" : "floating" : u], g = D(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(h)) ?? !0 ? h : h.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), _ = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, v = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), y = await (i.isElement == null ? void 0 : i.isElement(v)) && await (i.getScale == null ? void 0 : i.getScale(v)) || {
		x: 1,
		y: 1
	}, b = D(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: _,
		offsetParent: v,
		strategy: s
	}) : _);
	return {
		top: (g.top - b.top + m.top) / y.y,
		bottom: (b.bottom - g.bottom + m.bottom) / y.y,
		left: (g.left - b.left + m.left) / y.x,
		right: (b.right - g.right + m.right) / y.x
	};
}
function oe(e, t, n) {
	return (e ? [...n.filter((t) => m(t) === e), ...n.filter((t) => m(t) !== e)] : n.filter((e) => p(e) === e)).filter((n) => e ? m(n) === e || (t ? x(n) !== n : !1) : !0);
}
function se(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function ce(e) {
	return O.some((t) => e[t] >= 0);
}
function le(e) {
	let t = j(...e.map((e) => e.left)), n = j(...e.map((e) => e.top)), r = M(...e.map((e) => e.right)), i = M(...e.map((e) => e.bottom));
	return {
		x: t,
		y: n,
		width: r - t,
		height: i - n
	};
}
function ue(e) {
	let t = e.slice().sort((e, t) => e.y - t.y), n = [], r = null;
	for (let e = 0; e < t.length; e++) {
		let i = t[e];
		!r || i.y - r.y > r.height / 2 ? n.push([i]) : n[n.length - 1].push(i), r = i;
	}
	return n.map((e) => D(le(e)));
}
async function de(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = p(n), s = m(n), c = _(n) === "y", l = ye.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = f(t, e), { mainAxis: h, crossAxis: g, alignmentAxis: v } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof v == "number" && (g = s === "end" ? v * -1 : v), c ? {
		x: g * u,
		y: h * l
	} : {
		x: h * l,
		y: g * u
	};
}
var fe, pe, me, he, ge, _e, ve, ye, be, xe, Se, Ce, we = e((() => {
	re(), fe = 50, pe = async (e, t, n) => {
		let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
			...o,
			detectOverflow: ae
		}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}), { x: u, y: d } = ie(l, r, c), f = r, p = 0, m = {};
		for (let n = 0; n < a.length; n++) {
			let h = a[n];
			if (!h) continue;
			let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
				x: u,
				y: d,
				initialPlacement: r,
				placement: f,
				strategy: i,
				middlewareData: m,
				rects: l,
				platform: s,
				elements: {
					reference: e,
					floating: t
				}
			});
			u = v ?? u, d = y ?? d, m[g] = {
				...m[g],
				...b
			}, x && p < fe && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
				reference: e,
				floating: t,
				strategy: i
			}) : x.rects), {x: u, y: d} = ie(l, f, c)), n = -1);
		}
		return {
			x: u,
			y: d,
			placement: f,
			strategy: i,
			middlewareData: m
		};
	}, me = (e) => ({
		name: "arrow",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = f(e, t) || {};
			if (l == null) return {};
			let p = E(u), h = {
				x: n,
				y: r
			}, _ = v(i), y = g(_), b = await o.getDimensions(l), x = _ === "y", S = x ? "top" : "left", C = x ? "bottom" : "right", w = x ? "clientHeight" : "clientWidth", T = a.reference[y] + a.reference[_] - h[_] - a.floating[y], D = h[_] - a.reference[_], O = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), k = O ? O[w] : 0;
			(!k || !await (o.isElement == null ? void 0 : o.isElement(O))) && (k = s.floating[w] || a.floating[y]);
			let A = T / 2 - D / 2, M = k / 2 - b[y] / 2 - 1, N = j(p[S], M), P = j(p[C], M), F = N, ee = k - b[y] - P, I = k / 2 - b[y] / 2 + A, L = d(F, I, ee), te = !c.arrow && m(i) != null && I !== L && a.reference[y] / 2 - (I < F ? N : P) - b[y] / 2 < 0, ne = te ? I < F ? I - F : I - ee : 0;
			return {
				[_]: h[_] + ne,
				data: {
					[_]: L,
					centerOffset: I - L - ne,
					...te && { alignmentOffset: ne }
				},
				reset: te
			};
		}
	}), he = function(e) {
		return e === void 0 && (e = {}), {
			name: "autoPlacement",
			options: e,
			async fn(t) {
				let { rects: n, middlewareData: r, placement: i, platform: a, elements: o } = t, { crossAxis: s = !1, alignment: c, allowedPlacements: l = A, autoAlignment: u = !0, ...d } = f(e, t), h = c !== void 0 || l === A ? oe(c || null, u, l) : l, g = await a.detectOverflow(t, d), _ = r.autoPlacement?.index || 0, v = h[_];
				if (v == null) return {};
				let b = y(v, n, await (a.isRTL == null ? void 0 : a.isRTL(o.floating)));
				if (i !== v) return { reset: { placement: h[0] } };
				let x = [
					g[p(v)],
					g[b[0]],
					g[b[1]]
				], S = [...r.autoPlacement?.overflows || [], {
					placement: v,
					overflows: x
				}], C = h[_ + 1];
				if (C) return {
					data: {
						index: _ + 1,
						overflows: S
					},
					reset: { placement: C }
				};
				let w = S.map((e) => {
					let t = m(e.placement);
					return [
						e.placement,
						t && s ? e.overflows.slice(0, 2).reduce((e, t) => e + t, 0) : e.overflows[0],
						e.overflows
					];
				}).sort((e, t) => e[1] - t[1]), T = w.filter((e) => e[2].slice(0, m(e[0]) ? 2 : 3).every((e) => e <= 0))[0]?.[0] || w[0][0];
				return T === i ? {} : {
					data: {
						index: _ + 1,
						overflows: S
					},
					reset: { placement: T }
				};
			}
		};
	}, ge = function(e) {
		return e === void 0 && (e = {}), {
			name: "flip",
			options: e,
			async fn(t) {
				var n;
				let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: m = "bestFit", fallbackAxisSideDirection: h = "none", flipAlignment: g = !0, ...v } = f(e, t);
				if ((n = i.arrow) != null && n.alignmentOffset) return {};
				let x = p(r), S = _(o), T = p(o) === o, E = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), D = d || (T || !g ? [w(o)] : b(o)), O = h !== "none";
				!d && O && D.push(...C(o, g, h, E));
				let k = [o, ...D], A = await s.detectOverflow(t, v), j = [], M = i.flip?.overflows || [];
				if (l && j.push(A[x]), u) {
					let e = y(r, a, E);
					j.push(A[e[0]], A[e[1]]);
				}
				if (M = [...M, {
					placement: r,
					overflows: j
				}], !j.every((e) => e <= 0)) {
					let e = (i.flip?.index || 0) + 1, t = k[e];
					if (t && (!(u === "alignment" && S !== _(t)) || M.every((e) => _(e.placement) === S ? e.overflows[0] > 0 : !0))) return {
						data: {
							index: e,
							overflows: M
						},
						reset: { placement: t }
					};
					let n = M.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
					if (!n) switch (m) {
						case "bestFit": {
							let e = M.filter((e) => {
								if (O) {
									let t = _(e.placement);
									return t === S || t === "y";
								}
								return !0;
							}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
							e && (n = e);
							break;
						}
						case "initialPlacement":
							n = o;
							break;
					}
					if (r !== n) return { reset: { placement: n } };
				}
				return {};
			}
		};
	}, _e = function(e) {
		return e === void 0 && (e = {}), {
			name: "hide",
			options: e,
			async fn(t) {
				let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = f(e, t);
				switch (i) {
					case "referenceHidden": {
						let e = se(await r.detectOverflow(t, {
							...a,
							elementContext: "reference"
						}), n.reference);
						return { data: {
							referenceHiddenOffsets: e,
							referenceHidden: ce(e)
						} };
					}
					case "escaped": {
						let e = se(await r.detectOverflow(t, {
							...a,
							altBoundary: !0
						}), n.floating);
						return { data: {
							escapedOffsets: e,
							escaped: ce(e)
						} };
					}
					default: return {};
				}
			}
		};
	}, ve = function(e) {
		return e === void 0 && (e = {}), {
			name: "inline",
			options: e,
			async fn(t) {
				let { placement: n, elements: r, rects: i, platform: a, strategy: o } = t, { padding: s = 2, x: c, y: l } = f(e, t), u = Array.from(await (a.getClientRects == null ? void 0 : a.getClientRects(r.reference)) || []), d = ue(u), m = D(le(u)), h = E(s);
				function g() {
					if (d.length === 2 && d[0].left > d[1].right && c != null && l != null) return d.find((e) => c > e.left - h.left && c < e.right + h.right && l > e.top - h.top && l < e.bottom + h.bottom) || m;
					if (d.length >= 2) {
						if (_(n) === "y") {
							let e = d[0], t = d[d.length - 1], r = p(n) === "top", i = e.top, a = t.bottom, o = r ? e.left : t.left, s = r ? e.right : t.right;
							return {
								top: i,
								bottom: a,
								left: o,
								right: s,
								width: s - o,
								height: a - i,
								x: o,
								y: i
							};
						}
						let e = p(n) === "left", t = M(...d.map((e) => e.right)), r = j(...d.map((e) => e.left)), i = d.filter((n) => e ? n.left === r : n.right === t), a = i[0].top, o = i[i.length - 1].bottom, s = r, c = t;
						return {
							top: a,
							bottom: o,
							left: s,
							right: c,
							width: c - s,
							height: o - a,
							x: s,
							y: a
						};
					}
					return m;
				}
				let v = await a.getElementRects({
					reference: { getBoundingClientRect: g },
					floating: r.floating,
					strategy: o
				});
				return i.reference.x !== v.reference.x || i.reference.y !== v.reference.y || i.reference.width !== v.reference.width || i.reference.height !== v.reference.height ? { reset: { rects: v } } : {};
			}
		};
	}, ye = /*#__PURE__*/ new Set(["left", "top"]), be = function(e) {
		return e === void 0 && (e = 0), {
			name: "offset",
			options: e,
			async fn(t) {
				var n;
				let { x: r, y: i, placement: a, middlewareData: o } = t, s = await de(t, e);
				return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
					x: r + s.x,
					y: i + s.y,
					data: {
						...s,
						placement: a
					}
				};
			}
		};
	}, xe = function(e) {
		return e === void 0 && (e = {}), {
			name: "shift",
			options: e,
			async fn(t) {
				let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
					let { x: t, y: n } = e;
					return {
						x: t,
						y: n
					};
				} }, ...l } = f(e, t), u = {
					x: n,
					y: r
				}, m = await a.detectOverflow(t, l), g = _(p(i)), v = h(g), y = u[v], b = u[g];
				if (o) {
					let e = v === "y" ? "top" : "left", t = v === "y" ? "bottom" : "right", n = y + m[e], r = y - m[t];
					y = d(n, y, r);
				}
				if (s) {
					let e = g === "y" ? "top" : "left", t = g === "y" ? "bottom" : "right", n = b + m[e], r = b - m[t];
					b = d(n, b, r);
				}
				let x = c.fn({
					...t,
					[v]: y,
					[g]: b
				});
				return {
					...x,
					data: {
						x: x.x - n,
						y: x.y - r,
						enabled: {
							[v]: o,
							[g]: s
						}
					}
				};
			}
		};
	}, Se = function(e) {
		return e === void 0 && (e = {}), {
			options: e,
			fn(t) {
				let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = f(e, t), u = {
					x: n,
					y: r
				}, d = _(i), m = h(d), g = u[m], v = u[d], y = f(s, t), b = typeof y == "number" ? {
					mainAxis: y,
					crossAxis: 0
				} : {
					mainAxis: 0,
					crossAxis: 0,
					...y
				};
				if (c) {
					let e = m === "y" ? "height" : "width", t = a.reference[m] - a.floating[e] + b.mainAxis, n = a.reference[m] + a.reference[e] - b.mainAxis;
					g < t ? g = t : g > n && (g = n);
				}
				if (l) {
					let e = m === "y" ? "width" : "height", t = ye.has(p(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : b.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? b.crossAxis : 0);
					v < n ? v = n : v > r && (v = r);
				}
				return {
					[m]: g,
					[d]: v
				};
			}
		};
	}, Ce = function(e) {
		return e === void 0 && (e = {}), {
			name: "size",
			options: e,
			async fn(t) {
				var n, r;
				let { placement: i, rects: a, platform: o, elements: s } = t, { apply: c = () => {}, ...l } = f(e, t), u = await o.detectOverflow(t, l), d = p(i), h = m(i), g = _(i) === "y", { width: v, height: y } = a.floating, b, x;
				d === "top" || d === "bottom" ? (b = d, x = h === (await (o.isRTL == null ? void 0 : o.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (x = d, b = h === "end" ? "top" : "bottom");
				let S = y - u.top - u.bottom, C = v - u.left - u.right, w = j(y - u[b], S), T = j(v - u[x], C), E = !t.middlewareData.shift, D = w, O = T;
				if ((n = t.middlewareData.shift) != null && n.enabled.x && (O = C), (r = t.middlewareData.shift) != null && r.enabled.y && (D = S), E && !h) {
					let e = M(u.left, 0), t = M(u.right, 0), n = M(u.top, 0), r = M(u.bottom, 0);
					g ? O = v - 2 * (e !== 0 || t !== 0 ? e + t : M(u.left, u.right)) : D = y - 2 * (n !== 0 || r !== 0 ? n + r : M(u.top, u.bottom));
				}
				await c({
					...t,
					availableWidth: O,
					availableHeight: D
				});
				let k = await o.getDimensions(s.floating);
				return v !== k.width || y !== k.height ? { reset: { rects: !0 } } : {};
			}
		};
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function Te() {
	return typeof window < "u";
}
function R(e) {
	return Ee(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function z(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function B(e) {
	return ((Ee(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Ee(e) {
	return Te() ? e instanceof Node || e instanceof z(e).Node : !1;
}
function V(e) {
	return Te() ? e instanceof Element || e instanceof z(e).Element : !1;
}
function H(e) {
	return Te() ? e instanceof HTMLElement || e instanceof z(e).HTMLElement : !1;
}
function De(e) {
	return !Te() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof z(e).ShadowRoot;
}
function U(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = G(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function Oe(e) {
	return /^(table|td|th)$/.test(R(e));
}
function ke(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
function Ae(e) {
	let t = V(e) ? G(e) : e;
	return J(t.transform) || J(t.translate) || J(t.scale) || J(t.rotate) || J(t.perspective) || !Me() && (J(t.backdropFilter) || J(t.filter)) || Ie.test(t.willChange || "") || Le.test(t.contain || "");
}
function je(e) {
	let t = K(e);
	for (; H(t) && !W(t);) {
		if (Ae(t)) return t;
		if (ke(t)) return null;
		t = K(t);
	}
	return null;
}
function Me() {
	return Re ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), Re;
}
function W(e) {
	return /^(html|body|#document)$/.test(R(e));
}
function G(e) {
	return z(e).getComputedStyle(e);
}
function Ne(e) {
	return V(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function K(e) {
	if (R(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || De(e) && e.host || B(e);
	return De(t) ? t.host : t;
}
function Pe(e) {
	let t = K(e);
	return W(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : H(t) && U(t) ? t : Pe(t);
}
function q(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = Pe(e), i = r === e.ownerDocument?.body, a = z(r);
	if (i) {
		let e = Fe(a);
		return t.concat(a, a.visualViewport || [], U(r) ? r : [], e && n ? q(e) : []);
	} else return t.concat(r, q(r, [], n));
}
function Fe(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
var Ie, Le, J, Re, ze = e((() => {
	Ie = /transform|translate|scale|rotate|perspective|filter/, Le = /paint|layout|strict|content/, J = (e) => !!e && e !== "none";
}));
we(), re(), ze();
function Be(e) {
	let t = G(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = H(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = N(n) !== a || N(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function Ve(e) {
	return V(e) ? e : e.contextElement;
}
function Y(e) {
	let t = Ve(e);
	if (!H(t)) return F(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = Be(t), o = (a ? N(n.width) : n.width) / r, s = (a ? N(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var He = /*#__PURE__*/ F(0);
function Ue(e) {
	let t = z(e);
	return !Me() || !t.visualViewport ? He : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function We(e, t, n) {
	return t === void 0 && (t = !1), !n || t && n !== z(e) ? !1 : t;
}
function X(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = Ve(e), o = F(1);
	t && (r ? V(r) && (o = Y(r)) : o = Y(e));
	let s = We(a, n, r) ? Ue(a) : F(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a) {
		let e = z(a), t = r && V(r) ? z(r) : r, n = e, i = Fe(n);
		for (; i && r && t !== n;) {
			let e = Y(i), t = i.getBoundingClientRect(), r = G(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = z(i), i = Fe(n);
		}
	}
	return D({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Ge(e, t) {
	let n = Ne(e).scrollLeft;
	return t ? t.left + n : X(B(e)).left + n;
}
function Ke(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Ge(e, n),
		y: n.top + t.scrollTop
	};
}
function qe(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = B(r), s = t ? ke(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = F(1), u = F(0), d = H(r);
	if ((d || !d && !a) && ((R(r) !== "body" || U(o)) && (c = Ne(r)), d)) {
		let e = X(r);
		l = Y(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Ke(o, c) : F(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Je(e) {
	return Array.from(e.getClientRects());
}
function Ye(e) {
	let t = B(e), n = Ne(e), r = e.ownerDocument.body, i = M(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), a = M(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight), o = -n.scrollLeft + Ge(e), s = -n.scrollTop;
	return G(r).direction === "rtl" && (o += M(t.clientWidth, r.clientWidth) - i), {
		width: i,
		height: a,
		x: o,
		y: s
	};
}
var Xe = 25;
function Ze(e, t) {
	let n = z(e), r = B(e), i = n.visualViewport, a = r.clientWidth, o = r.clientHeight, s = 0, c = 0;
	if (i) {
		a = i.width, o = i.height;
		let e = Me();
		(!e || e && t === "fixed") && (s = i.offsetLeft, c = i.offsetTop);
	}
	let l = Ge(r);
	if (l <= 0) {
		let e = r.ownerDocument, t = e.body, n = getComputedStyle(t), i = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, o = Math.abs(r.clientWidth - t.clientWidth - i);
		o <= Xe && (a -= o);
	} else l <= Xe && (a += l);
	return {
		width: a,
		height: o,
		x: s,
		y: c
	};
}
function Qe(e, t) {
	let n = X(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = H(e) ? Y(e) : F(1);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function $e(e, t, n) {
	let r;
	if (t === "viewport") r = Ze(e, n);
	else if (t === "document") r = Ye(B(e));
	else if (V(t)) r = Qe(t, n);
	else {
		let n = Ue(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return D(r);
}
function et(e, t) {
	let n = K(e);
	return n === t || !V(n) || W(n) ? !1 : G(n).position === "fixed" || et(n, t);
}
function tt(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = q(e, [], !1).filter((e) => V(e) && R(e) !== "body"), i = null, a = G(e).position === "fixed", o = a ? K(e) : e;
	for (; V(o) && !W(o);) {
		let t = G(o), n = Ae(o);
		!n && t.position === "fixed" && (i = null), (a ? !n && !i : !n && t.position === "static" && i && (i.position === "absolute" || i.position === "fixed") || U(o) && !n && et(e, o)) ? r = r.filter((e) => e !== o) : i = t, o = K(o);
	}
	return t.set(e, r), r;
}
function nt(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? ke(t) ? [] : tt(t, this._c) : [].concat(n), r], o = $e(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = $e(t, a[e], i);
		s = M(n.top, s), c = j(n.right, c), l = j(n.bottom, l), u = M(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function rt(e) {
	let { width: t, height: n } = Be(e);
	return {
		width: t,
		height: n
	};
}
function it(e, t, n) {
	let r = H(t), i = B(t), a = n === "fixed", o = X(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = F(0);
	function l() {
		c.x = Ge(i);
	}
	if (r || !r && !a) if ((R(t) !== "body" || U(i)) && (s = Ne(t)), r) {
		let e = X(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	} else i && l();
	a && !r && i && l();
	let u = i && !r && !a ? Ke(i, s) : F(0);
	return {
		x: o.left + s.scrollLeft - c.x - u.x,
		y: o.top + s.scrollTop - c.y - u.y,
		width: o.width,
		height: o.height
	};
}
function at(e) {
	return G(e).position === "static";
}
function ot(e, t) {
	if (!H(e) || G(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return B(e) === n && (n = n.ownerDocument.body), n;
}
function st(e, t) {
	let n = z(e);
	if (ke(e)) return n;
	if (!H(e)) {
		let t = K(e);
		for (; t && !W(t);) {
			if (V(t) && !at(t)) return t;
			t = K(t);
		}
		return n;
	}
	let r = ot(e, t);
	for (; r && Oe(r) && at(r);) r = ot(r, t);
	return r && W(r) && at(r) && !Ae(r) ? n : r || je(e) || n;
}
var ct = async function(e) {
	let t = this.getOffsetParent || st, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: it(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function lt(e) {
	return G(e).direction === "rtl";
}
var ut = {
	convertOffsetParentRelativeRectToViewportRelativeRect: qe,
	getDocumentElement: B,
	getClippingRect: nt,
	getOffsetParent: st,
	getElementRects: ct,
	getClientRects: Je,
	getDimensions: rt,
	getScale: Y,
	isElement: V,
	isRTL: lt
};
function dt(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function ft(e, t) {
	let n = null, r, i = B(e);
	function a() {
		var e;
		clearTimeout(r), (e = n) == null || e.disconnect(), n = null;
	}
	function o(s, c) {
		s === void 0 && (s = !1), c === void 0 && (c = 1), a();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (s || t(), !f || !p) return;
		let m = P(d), h = P(i.clientWidth - (u + f)), g = P(i.clientHeight - (d + p)), _ = P(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: M(0, j(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (n !== c) {
				if (!y) return o();
				n ? o(!1, n) : r = setTimeout(() => {
					o(!1, 1e-7);
				}, 1e3);
			}
			n === 1 && !dt(l, e.getBoundingClientRect()) && o(), y = !1;
		}
		try {
			n = new IntersectionObserver(b, {
				...v,
				root: i.ownerDocument
			});
		} catch {
			n = new IntersectionObserver(b, v);
		}
		n.observe(e);
	}
	return o(!0), a;
}
function pt(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = Ve(e), u = i || a ? [...l ? q(l) : [], ...t ? q(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n, { passive: !0 }), a && e.addEventListener("resize", n);
	});
	let d = l && s ? ft(l, n) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? X(e) : null;
	c && g();
	function g() {
		let t = X(e);
		h && !dt(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var mt = be, ht = xe, gt = ge, _t = Ce, vt = _e, yt = me, bt = ve, xt = Se, St = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = {
		platform: ut,
		...n
	}, a = {
		...i.platform,
		_c: r
	};
	return pe(e, t, {
		...i,
		platform: a
	});
}, Ct = typeof document < "u" ? a : function() {};
function wt(e, t) {
	if (e === t) return !0;
	if (typeof e != typeof t) return !1;
	if (typeof e == "function" && e.toString() === t.toString()) return !0;
	let n, r, i;
	if (e && t && typeof e == "object") {
		if (Array.isArray(e)) {
			if (n = e.length, n !== t.length) return !1;
			for (r = n; r-- !== 0;) if (!wt(e[r], t[r])) return !1;
			return !0;
		}
		if (i = Object.keys(e), n = i.length, n !== Object.keys(t).length) return !1;
		for (r = n; r-- !== 0;) if (!{}.hasOwnProperty.call(t, i[r])) return !1;
		for (r = n; r-- !== 0;) {
			let n = i[r];
			if (!(n === "_owner" && e.$$typeof) && !wt(e[n], t[n])) return !1;
		}
		return !0;
	}
	return e !== e && t !== t;
}
function Tt(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Et(e, t) {
	let n = Tt(e);
	return Math.round(t * n) / n;
}
function Dt(e) {
	let t = i.useRef(e);
	return Ct(() => {
		t.current = e;
	}), t;
}
function Ot(e) {
	e === void 0 && (e = {});
	let { placement: t = "bottom", strategy: n = "absolute", middleware: r = [], platform: a, elements: { reference: o, floating: c } = {}, transform: l = !0, whileElementsMounted: u, open: d } = e, [f, p] = i.useState({
		x: 0,
		y: 0,
		strategy: n,
		placement: t,
		middlewareData: {},
		isPositioned: !1
	}), [m, h] = i.useState(r);
	wt(m, r) || h(r);
	let [g, _] = i.useState(null), [v, y] = i.useState(null), b = i.useCallback((e) => {
		e !== w.current && (w.current = e, _(e));
	}, []), x = i.useCallback((e) => {
		e !== T.current && (T.current = e, y(e));
	}, []), S = o || g, C = c || v, w = i.useRef(null), T = i.useRef(null), E = i.useRef(f), D = u != null, O = Dt(u), k = Dt(a), A = Dt(d), j = i.useCallback(() => {
		if (!w.current || !T.current) return;
		let e = {
			placement: t,
			strategy: n,
			middleware: m
		};
		k.current && (e.platform = k.current), St(w.current, T.current, e).then((e) => {
			let t = {
				...e,
				isPositioned: A.current !== !1
			};
			M.current && !wt(E.current, t) && (E.current = t, s.flushSync(() => {
				p(t);
			}));
		});
	}, [
		m,
		t,
		n,
		k,
		A
	]);
	Ct(() => {
		d === !1 && E.current.isPositioned && (E.current.isPositioned = !1, p((e) => ({
			...e,
			isPositioned: !1
		})));
	}, [d]);
	let M = i.useRef(!1);
	Ct(() => (M.current = !0, () => {
		M.current = !1;
	}), []), Ct(() => {
		if (S && (w.current = S), C && (T.current = C), S && C) {
			if (O.current) return O.current(S, C, j);
			j();
		}
	}, [
		S,
		C,
		j,
		O,
		D
	]);
	let N = i.useMemo(() => ({
		reference: w,
		floating: T,
		setReference: b,
		setFloating: x
	}), [b, x]), P = i.useMemo(() => ({
		reference: S,
		floating: C
	}), [S, C]), F = i.useMemo(() => {
		let e = {
			position: n,
			left: 0,
			top: 0
		};
		if (!P.floating) return e;
		let t = Et(P.floating, f.x), r = Et(P.floating, f.y);
		return l ? {
			...e,
			transform: "translate(" + t + "px, " + r + "px)",
			...Tt(P.floating) >= 1.5 && { willChange: "transform" }
		} : {
			position: n,
			left: t,
			top: r
		};
	}, [
		n,
		l,
		P.floating,
		f.x,
		f.y
	]);
	return i.useMemo(() => ({
		...f,
		update: j,
		refs: N,
		elements: P,
		floatingStyles: F
	}), [
		f,
		j,
		N,
		P,
		F
	]);
}
var kt = (e) => {
	function t(e) {
		return {}.hasOwnProperty.call(e, "current");
	}
	return {
		name: "arrow",
		options: e,
		fn(n) {
			let { element: r, padding: i } = typeof e == "function" ? e(n) : e;
			return r && t(r) ? r.current == null ? {} : yt({
				element: r.current,
				padding: i
			}).fn(n) : r ? yt({
				element: r,
				padding: i
			}).fn(n) : {};
		}
	};
}, At = (e, t) => {
	let n = mt(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, jt = (e, t) => {
	let n = ht(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Mt = (e, t) => ({
	fn: xt(e).fn,
	options: [e, t]
}), Nt = (e, t) => {
	let n = gt(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Pt = (e, t) => {
	let n = _t(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Ft = (e, t) => {
	let n = vt(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, It = (e, t) => {
	let n = bt(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Lt = (e, t) => {
	let n = kt(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Z = function() {
	return Z = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, Z.apply(this, arguments);
};
function Rt(e, t) {
	var n = {};
	for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && typeof Object.getOwnPropertySymbols == "function") for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++) t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
	return n;
}
function zt(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var Bt = "right-scroll-bar-position", Vt = "width-before-scroll-bar", Ht = "with-scroll-bars-hidden", Ut = "--removed-body-scroll-bar-size";
//#endregion
//#region ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.17_react@19.2.7/node_modules/use-callback-ref/dist/es2015/assignRef.js
function Wt(e, t) {
	return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
//#endregion
//#region ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.17_react@19.2.7/node_modules/use-callback-ref/dist/es2015/useRef.js
function Gt(e, t) {
	var n = o(function() {
		return {
			value: e,
			callback: t,
			facade: {
				get current() {
					return n.value;
				},
				set current(e) {
					var t = n.value;
					t !== e && (n.value = e, n.callback(e, t));
				}
			}
		};
	})[0];
	return n.callback = t, n.facade;
}
//#endregion
//#region ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.17_react@19.2.7/node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var Kt = typeof window < "u" ? i.useLayoutEffect : i.useEffect, qt = /* @__PURE__ */ new WeakMap();
function Jt(e, t) {
	var n = Gt(t || null, function(t) {
		return e.forEach(function(e) {
			return Wt(e, t);
		});
	});
	return Kt(function() {
		var t = qt.get(n);
		if (t) {
			var r = new Set(t), i = new Set(e), a = n.current;
			r.forEach(function(e) {
				i.has(e) || Wt(e, null);
			}), i.forEach(function(e) {
				r.has(e) || Wt(e, a);
			});
		}
		qt.set(n, e);
	}, [e]), n;
}
//#endregion
//#region ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.17_react@19.2.7/node_modules/use-sidecar/dist/es2015/medium.js
function Yt(e) {
	return e;
}
function Xt(e, t) {
	t === void 0 && (t = Yt);
	var n = [], r = !1;
	return {
		read: function() {
			if (r) throw Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			return n.length ? n[n.length - 1] : e;
		},
		useMedium: function(e) {
			var i = t(e, r);
			return n.push(i), function() {
				n = n.filter(function(e) {
					return e !== i;
				});
			};
		},
		assignSyncMedium: function(e) {
			for (r = !0; n.length;) {
				var t = n;
				n = [], t.forEach(e);
			}
			n = {
				push: function(t) {
					return e(t);
				},
				filter: function() {
					return n;
				}
			};
		},
		assignMedium: function(e) {
			r = !0;
			var t = [];
			if (n.length) {
				var i = n;
				n = [], i.forEach(e), t = n;
			}
			var a = function() {
				var n = t;
				t = [], n.forEach(e);
			}, o = function() {
				return Promise.resolve().then(a);
			};
			o(), n = {
				push: function(e) {
					t.push(e), o();
				},
				filter: function(e) {
					return t = t.filter(e), n;
				}
			};
		}
	};
}
function Zt(e) {
	e === void 0 && (e = {});
	var t = Xt(null);
	return t.options = Z({
		async: !0,
		ssr: !1
	}, e), t;
}
//#endregion
//#region ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.17_react@19.2.7/node_modules/use-sidecar/dist/es2015/exports.js
var Qt = function(e) {
	var t = e.sideCar, n = Rt(e, ["sideCar"]);
	if (!t) throw Error("Sidecar: please provide `sideCar` property to import the right car");
	var r = t.read();
	if (!r) throw Error("Sidecar medium not found");
	return i.createElement(r, Z({}, n));
};
Qt.isSideCarExport = !0;
function $t(e, t) {
	return e.useMedium(t), Qt;
}
//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/medium.js
var en = Zt(), tn = function() {}, nn = i.forwardRef(function(e, t) {
	var n = i.useRef(null), r = i.useState({
		onScrollCapture: tn,
		onWheelCapture: tn,
		onTouchMoveCapture: tn
	}), a = r[0], o = r[1], s = e.forwardProps, c = e.children, l = e.className, u = e.removeScrollBar, d = e.enabled, f = e.shards, p = e.sideCar, m = e.noRelative, h = e.noIsolation, g = e.inert, _ = e.allowPinchZoom, v = e.as, y = v === void 0 ? "div" : v, b = e.gapMode, x = Rt(e, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]), S = p, C = Jt([n, t]), w = Z(Z({}, x), a);
	return i.createElement(i.Fragment, null, d && i.createElement(S, {
		sideCar: en,
		removeScrollBar: u,
		shards: f,
		noRelative: m,
		noIsolation: h,
		inert: g,
		setCallbacks: o,
		allowPinchZoom: !!_,
		lockRef: n,
		gapMode: b
	}), s ? i.cloneElement(i.Children.only(c), Z(Z({}, w), { ref: C })) : i.createElement(y, Z({}, w, {
		className: l,
		ref: C
	}), c));
});
nn.defaultProps = {
	enabled: !0,
	removeScrollBar: !0,
	inert: !1
}, nn.classNames = {
	fullWidth: Vt,
	zeroRight: Bt
};
//#endregion
//#region ../../node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
var rn, an = function() {
	if (rn) return rn;
	if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
//#endregion
//#region ../../node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.17_react@19.2.7/node_modules/react-style-singleton/dist/es2015/singleton.js
function on() {
	if (!document) return null;
	var e = document.createElement("style");
	e.type = "text/css";
	var t = an();
	return t && e.setAttribute("nonce", t), e;
}
function sn(e, t) {
	e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function cn(e) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(e);
}
var ln = function() {
	var e = 0, t = null;
	return {
		add: function(n) {
			e == 0 && (t = on()) && (sn(t, n), cn(t)), e++;
		},
		remove: function() {
			e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
		}
	};
}, un = function() {
	var e = ln();
	return function(t, n) {
		i.useEffect(function() {
			return e.add(t), function() {
				e.remove();
			};
		}, [t && n]);
	};
}, dn = function() {
	var e = un();
	return function(t) {
		var n = t.styles, r = t.dynamic;
		return e(n, r), null;
	};
}, fn = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
}, pn = function(e) {
	return parseInt(e || "", 10) || 0;
}, mn = function(e) {
	var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], i = t[e === "padding" ? "paddingRight" : "marginRight"];
	return [
		pn(n),
		pn(r),
		pn(i)
	];
}, hn = function(e) {
	if (e === void 0 && (e = "margin"), typeof window > "u") return fn;
	var t = mn(e), n = document.documentElement.clientWidth, r = window.innerWidth;
	return {
		left: t[0],
		top: t[1],
		right: t[2],
		gap: Math.max(0, r - n + t[2] - t[0])
	};
}, gn = dn(), _n = "data-scroll-locked", vn = function(e, t, n, r) {
	var i = e.left, a = e.top, o = e.right, s = e.gap;
	return n === void 0 && (n = "margin"), `
  .${Ht} {
   overflow: hidden ${r};
   padding-right: ${s}px ${r};
  }
  body[${_n}] {
    overflow: hidden ${r};
    overscroll-behavior: contain;
    ${[
		t && `position: relative ${r};`,
		n === "margin" && `
    padding-left: ${i}px;
    padding-top: ${a}px;
    padding-right: ${o}px;
    margin-left:0;
    margin-top:0;
    margin-right: ${s}px ${r};
    `,
		n === "padding" && `padding-right: ${s}px ${r};`
	].filter(Boolean).join("")}
  }
  
  .${Bt} {
    right: ${s}px ${r};
  }
  
  .${Vt} {
    margin-right: ${s}px ${r};
  }
  
  .${Bt} .${Bt} {
    right: 0 ${r};
  }
  
  .${Vt} .${Vt} {
    margin-right: 0 ${r};
  }
  
  body[${_n}] {
    ${Ut}: ${s}px;
  }
`;
}, yn = function() {
	var e = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(e) ? e : 0;
}, bn = function() {
	i.useEffect(function() {
		return document.body.setAttribute(_n, (yn() + 1).toString()), function() {
			var e = yn() - 1;
			e <= 0 ? document.body.removeAttribute(_n) : document.body.setAttribute(_n, e.toString());
		};
	}, []);
}, xn = function(e) {
	var t = e.noRelative, n = e.noImportant, r = e.gapMode, a = r === void 0 ? "margin" : r;
	bn();
	var o = i.useMemo(function() {
		return hn(a);
	}, [a]);
	return i.createElement(gn, { styles: vn(o, !t, a, n ? "" : "!important") });
}, Sn = !1;
if (typeof window < "u") try {
	var Cn = Object.defineProperty({}, "passive", { get: function() {
		return Sn = !0, !0;
	} });
	window.addEventListener("test", Cn, Cn), window.removeEventListener("test", Cn, Cn);
} catch {
	Sn = !1;
}
var Q = Sn ? { passive: !1 } : !1, wn = function(e) {
	return e.tagName === "TEXTAREA";
}, Tn = function(e, t) {
	if (!(e instanceof Element)) return !1;
	var n = window.getComputedStyle(e);
	return n[t] !== "hidden" && !(n.overflowY === n.overflowX && !wn(e) && n[t] === "visible");
}, En = function(e) {
	return Tn(e, "overflowY");
}, Dn = function(e) {
	return Tn(e, "overflowX");
}, On = function(e, t) {
	var n = t.ownerDocument, r = t;
	do {
		if (typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host), jn(e, r)) {
			var i = Mn(e, r);
			if (i[1] > i[2]) return !0;
		}
		r = r.parentNode;
	} while (r && r !== n.body);
	return !1;
}, kn = function(e) {
	return [
		e.scrollTop,
		e.scrollHeight,
		e.clientHeight
	];
}, An = function(e) {
	return [
		e.scrollLeft,
		e.scrollWidth,
		e.clientWidth
	];
}, jn = function(e, t) {
	return e === "v" ? En(t) : Dn(t);
}, Mn = function(e, t) {
	return e === "v" ? kn(t) : An(t);
}, Nn = function(e, t) {
	return e === "h" && t === "rtl" ? -1 : 1;
}, Pn = function(e, t, n, r, i) {
	var a = Nn(e, window.getComputedStyle(t).direction), o = a * r, s = n.target, c = t.contains(s), l = !1, u = o > 0, d = 0, f = 0;
	do {
		if (!s) break;
		var p = Mn(e, s), m = p[0], h = p[1] - p[2] - a * m;
		(m || h) && jn(e, s) && (d += h, f += m);
		var g = s.parentNode;
		s = g && g.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? g.host : g;
	} while (!c && s !== document.body || c && (t.contains(s) || t === s));
	return (u && (i && Math.abs(d) < 1 || !i && o > d) || !u && (i && Math.abs(f) < 1 || !i && -o > f)) && (l = !0), l;
}, Fn = function(e) {
	return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, In = function(e) {
	return [e.deltaX, e.deltaY];
}, Ln = function(e) {
	return e && "current" in e ? e.current : e;
}, Rn = function(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}, zn = function(e) {
	return `
  .block-interactivity-${e} {pointer-events: none;}
  .allow-interactivity-${e} {pointer-events: all;}
`;
}, Bn = 0, $ = [];
function Vn(e) {
	var t = i.useRef([]), n = i.useRef([0, 0]), r = i.useRef(), a = i.useState(Bn++)[0], o = i.useState(dn)[0], s = i.useRef(e);
	i.useEffect(function() {
		s.current = e;
	}, [e]), i.useEffect(function() {
		if (e.inert) {
			document.body.classList.add(`block-interactivity-${a}`);
			var t = zt([e.lockRef.current], (e.shards || []).map(Ln), !0).filter(Boolean);
			return t.forEach(function(e) {
				return e.classList.add(`allow-interactivity-${a}`);
			}), function() {
				document.body.classList.remove(`block-interactivity-${a}`), t.forEach(function(e) {
					return e.classList.remove(`allow-interactivity-${a}`);
				});
			};
		}
	}, [
		e.inert,
		e.lockRef.current,
		e.shards
	]);
	var c = i.useCallback(function(e, t) {
		if ("touches" in e && e.touches.length === 2 || e.type === "wheel" && e.ctrlKey) return !s.current.allowPinchZoom;
		var i = Fn(e), a = n.current, o = "deltaX" in e ? e.deltaX : a[0] - i[0], c = "deltaY" in e ? e.deltaY : a[1] - i[1], l, u = e.target, d = Math.abs(o) > Math.abs(c) ? "h" : "v";
		if ("touches" in e && d === "h" && u.type === "range") return !1;
		var f = window.getSelection(), p = f && f.anchorNode;
		if (p && (p === u || p.contains(u))) return !1;
		var m = On(d, u);
		if (!m) return !0;
		if (m ? l = d : (l = d === "v" ? "h" : "v", m = On(d, u)), !m) return !1;
		if (!r.current && "changedTouches" in e && (o || c) && (r.current = l), !l) return !0;
		var h = r.current || l;
		return Pn(h, t, e, h === "h" ? o : c, !0);
	}, []), l = i.useCallback(function(e) {
		var n = e;
		if (!(!$.length || $[$.length - 1] !== o)) {
			var r = "deltaY" in n ? In(n) : Fn(n), i = t.current.filter(function(e) {
				return e.name === n.type && (e.target === n.target || n.target === e.shadowParent) && Rn(e.delta, r);
			})[0];
			if (i && i.should) {
				n.cancelable && n.preventDefault();
				return;
			}
			if (!i) {
				var a = (s.current.shards || []).map(Ln).filter(Boolean).filter(function(e) {
					return e.contains(n.target);
				});
				(a.length > 0 ? c(n, a[0]) : !s.current.noIsolation) && n.cancelable && n.preventDefault();
			}
		}
	}, []), u = i.useCallback(function(e, n, r, i) {
		var a = {
			name: e,
			delta: n,
			target: r,
			should: i,
			shadowParent: Hn(r)
		};
		t.current.push(a), setTimeout(function() {
			t.current = t.current.filter(function(e) {
				return e !== a;
			});
		}, 1);
	}, []), d = i.useCallback(function(e) {
		n.current = Fn(e), r.current = void 0;
	}, []), f = i.useCallback(function(t) {
		u(t.type, In(t), t.target, c(t, e.lockRef.current));
	}, []), p = i.useCallback(function(t) {
		u(t.type, Fn(t), t.target, c(t, e.lockRef.current));
	}, []);
	i.useEffect(function() {
		return $.push(o), e.setCallbacks({
			onScrollCapture: f,
			onWheelCapture: f,
			onTouchMoveCapture: p
		}), document.addEventListener("wheel", l, Q), document.addEventListener("touchmove", l, Q), document.addEventListener("touchstart", d, Q), function() {
			$ = $.filter(function(e) {
				return e !== o;
			}), document.removeEventListener("wheel", l, Q), document.removeEventListener("touchmove", l, Q), document.removeEventListener("touchstart", d, Q);
		};
	}, []);
	var m = e.removeScrollBar, h = e.inert;
	return i.createElement(i.Fragment, null, h ? i.createElement(o, { styles: zn(a) }) : null, m ? i.createElement(xn, {
		noRelative: e.noRelative,
		gapMode: e.gapMode
	}) : null);
}
function Hn(e) {
	for (var t = null; e !== null;) e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
	return t;
}
//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/sidecar.js
var Un = $t(en, Vn), Wn = i.forwardRef(function(e, t) {
	return i.createElement(nn, Z({}, e, {
		ref: t,
		sideCar: Un
	}));
});
Wn.classNames = nn.classNames;
//#endregion
export { Me as A, be as B, V as C, De as D, U as E, ge as F, re as G, Ce as H, _e as I, D as J, M as K, we as L, he as M, pe as N, Oe as O, ae as P, ve as R, Ae as S, W as T, F as U, xe as V, P as W, u as X, N as Y, Ne as _, It as a, z as b, jt as c, pt as d, G as f, R as g, Fe as h, Ft as i, me as j, ke as k, Pt as l, B as m, Lt as n, Mt as o, je as p, j as q, Nt as r, At as s, Wn as t, Ot as u, q as v, H as w, ze as x, K as y, Se as z };
