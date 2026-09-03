import { A as e, B as t, D as n, Dt as r, E as i, F as a, Hn as o, Ht as s, I as c, K as l, Kt as u, Ln as d, M as f, N as p, O as m, On as h, Ot as g, P as _, Q as v, Qn as y, Rn as b, T as x, U as S, W as C, Xn as w, Y as T, Z as E, _t as D, ct as O, dt as k, et as A, ft as j, g as M, j as N, k as P, kt as ee, lt as te, mn as ne, mt as F, nt as re, ot as ie, pn as ae, rt as I, st as oe, tt as se, ut as ce, w as le, xn as ue, zn as de, zt as fe } from "./events-DnJ4Gvgf.mjs";
import { A as pe, B as me, C as L, D as R, E as he, F as ge, G as _e, H as ve, I as ye, J as be, K as xe, L as Se, M as Ce, N as we, O as Te, R as Ee, S as De, T as Oe, U as ke, V as Ae, W as je, Y as Me, _ as Ne, a as Pe, b as Fe, c as Ie, d as Le, f as Re, g as ze, h as Be, i as Ve, j as He, k as Ue, l as We, m as Ge, n as Ke, o as qe, p as Je, q as Ye, r as Xe, s as Ze, u as Qe, v as $e, w as et, x as tt, y as nt } from "./Combination-dchHqP5q.mjs";
import { _ as rt, t as it, w as at } from "./useTranslation-Egl4mJFn.mjs";
import * as z from "react";
import ot, { Children as st, Fragment as ct, cloneElement as lt, createContext as ut, createElement as dt, use as ft, useCallback as B, useEffect as V, useEffectEvent as pt, useId as mt, useLayoutEffect as ht, useMemo as gt, useRef as H, useState as U } from "react";
import { Fragment as W, jsx as G, jsxs as K } from "react/jsx-runtime";
import { createPortal as _t } from "react-dom";
y(), o(), Se(), _e(), tt();
function vt(e) {
	let t = Re(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = et(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = Me(n) !== a || Me(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function yt(e) {
	return L(e) ? e : e.contextElement;
}
function bt(e) {
	let t = yt(e);
	if (!et(t)) return ke(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = vt(t), o = (a ? Me(n.width) : n.width) / r, s = (a ? Me(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var xt = /*#__PURE__*/ ke(0);
function St(e) {
	let t = Fe(e);
	return !pe() || !t.visualViewport ? xt : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Ct(e, t, n) {
	return t === void 0 && (t = !1), !n || t && n !== Fe(e) ? !1 : t;
}
function wt(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = yt(e), o = ke(1);
	t && (r ? L(r) && (o = bt(r)) : o = bt(e));
	let s = Ct(a, n, r) ? St(a) : ke(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a) {
		let e = Fe(a), t = r && L(r) ? Fe(r) : r, n = e, i = Be(n);
		for (; i && r && t !== n;) {
			let e = bt(i), t = i.getBoundingClientRect(), r = Re(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = Fe(i), i = Be(n);
		}
	}
	return be({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Tt(e, t) {
	let n = Ne(e).scrollLeft;
	return t ? t.left + n : wt(Ge(e)).left + n;
}
function Et(e, t, n) {
	n === void 0 && (n = !1);
	let r = e.getBoundingClientRect();
	return {
		x: r.left + t.scrollLeft - (n ? 0 : Tt(e, r)),
		y: r.top + t.scrollTop
	};
}
function Dt(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = Ge(r), s = t ? Ue(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = ke(1), u = ke(0), d = et(r);
	if ((d || !d && !a) && ((ze(r) !== "body" || he(o)) && (c = Ne(r)), et(r))) {
		let e = wt(r);
		l = bt(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Et(o, c, !0) : ke(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Ot(e) {
	return Array.from(e.getClientRects());
}
function kt(e) {
	let t = Ge(e), n = Ne(e), r = e.ownerDocument.body, i = xe(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), a = xe(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight), o = -n.scrollLeft + Tt(e), s = -n.scrollTop;
	return Re(r).direction === "rtl" && (o += xe(t.clientWidth, r.clientWidth) - i), {
		width: i,
		height: a,
		x: o,
		y: s
	};
}
function At(e, t) {
	let n = Fe(e), r = Ge(e), i = n.visualViewport, a = r.clientWidth, o = r.clientHeight, s = 0, c = 0;
	if (i) {
		a = i.width, o = i.height;
		let e = pe();
		(!e || e && t === "fixed") && (s = i.offsetLeft, c = i.offsetTop);
	}
	return {
		width: a,
		height: o,
		x: s,
		y: c
	};
}
var jt = /*#__PURE__*/ new Set(["absolute", "fixed"]);
function Mt(e, t) {
	let n = wt(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = et(e) ? bt(e) : ke(1);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Nt(e, t, n) {
	let r;
	if (t === "viewport") r = At(e, n);
	else if (t === "document") r = kt(Ge(e));
	else if (L(t)) r = Mt(t, n);
	else {
		let n = St(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return be(r);
}
function Pt(e, t) {
	let n = nt(e);
	return n === t || !L(n) || Oe(n) ? !1 : Re(n).position === "fixed" || Pt(n, t);
}
function Ft(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = $e(e, [], !1).filter((e) => L(e) && ze(e) !== "body"), i = null, a = Re(e).position === "fixed", o = a ? nt(e) : e;
	for (; L(o) && !Oe(o);) {
		let t = Re(o), n = De(o);
		!n && t.position === "fixed" && (i = null), (a ? !n && !i : !n && t.position === "static" && i && jt.has(i.position) || he(o) && !n && Pt(e, o)) ? r = r.filter((e) => e !== o) : i = t, o = nt(o);
	}
	return t.set(e, r), r;
}
function It(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? Ue(t) ? [] : Ft(t, this._c) : [].concat(n), r], o = a[0], s = a.reduce((e, n) => {
		let r = Nt(t, n, i);
		return e.top = xe(r.top, e.top), e.right = Ye(r.right, e.right), e.bottom = Ye(r.bottom, e.bottom), e.left = xe(r.left, e.left), e;
	}, Nt(t, o, i));
	return {
		width: s.right - s.left,
		height: s.bottom - s.top,
		x: s.left,
		y: s.top
	};
}
function Lt(e) {
	let { width: t, height: n } = vt(e);
	return {
		width: t,
		height: n
	};
}
function Rt(e, t, n) {
	let r = et(t), i = Ge(t), a = n === "fixed", o = wt(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = ke(0);
	function l() {
		c.x = Tt(i);
	}
	if (r || !r && !a) if ((ze(t) !== "body" || he(i)) && (s = Ne(t)), r) {
		let e = wt(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	} else i && l();
	a && !r && i && l();
	let u = i && !r && !a ? Et(i, s) : ke(0);
	return {
		x: o.left + s.scrollLeft - c.x - u.x,
		y: o.top + s.scrollTop - c.y - u.y,
		width: o.width,
		height: o.height
	};
}
function zt(e) {
	return Re(e).position === "static";
}
function Bt(e, t) {
	if (!et(e) || Re(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return Ge(e) === n && (n = n.ownerDocument.body), n;
}
function Vt(e, t) {
	let n = Fe(e);
	if (Ue(e)) return n;
	if (!et(e)) {
		let t = nt(e);
		for (; t && !Oe(t);) {
			if (L(t) && !zt(t)) return t;
			t = nt(t);
		}
		return n;
	}
	let r = Bt(e, t);
	for (; r && Te(r) && zt(r);) r = Bt(r, t);
	return r && Oe(r) && zt(r) && !De(r) ? n : r || Je(e) || n;
}
var Ht = async function(e) {
	let t = this.getOffsetParent || Vt, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Rt(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Ut(e) {
	return Re(e).direction === "rtl";
}
var Wt = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Dt,
	getDocumentElement: Ge,
	getClippingRect: It,
	getOffsetParent: Vt,
	getElementRects: Ht,
	getClientRects: Ot,
	getDimensions: Lt,
	getScale: bt,
	isElement: L,
	isRTL: Ut
};
function Gt(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Kt(e, t) {
	let n = null, r, i = Ge(e);
	function a() {
		var e;
		clearTimeout(r), (e = n) == null || e.disconnect(), n = null;
	}
	function o(s, c) {
		s === void 0 && (s = !1), c === void 0 && (c = 1), a();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (s || t(), !f || !p) return;
		let m = je(d), h = je(i.clientWidth - (u + f)), g = je(i.clientHeight - (d + p)), _ = je(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: xe(0, Ye(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (n !== c) {
				if (!y) return o();
				n ? o(!1, n) : r = setTimeout(() => {
					o(!1, 1e-7);
				}, 1e3);
			}
			n === 1 && !Gt(l, e.getBoundingClientRect()) && o(), y = !1;
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
function qt(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = yt(e), u = i || a ? [...l ? $e(l) : [], ...$e(t)] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n, { passive: !0 }), a && e.addEventListener("resize", n);
	});
	let d = l && s ? Kt(l, n) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), p.observe(t));
	let m, h = c ? wt(e) : null;
	c && g();
	function g() {
		let t = wt(e);
		h && !Gt(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var Jt = me, Yt = Ce, Xt = Ae, Zt = ge, Qt = ve, $t = ye, en = He, tn = Ee, nn = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = {
		platform: Wt,
		...n
	}, a = {
		...i.platform,
		_c: r
	};
	return we(e, t, {
		...i,
		platform: a
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/is-element/is-element.mjs
function rn(e) {
	return Array.isArray(e) || e === null ? !1 : typeof e == "object" ? e.type !== ct : !1;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/find-element-ancestor/find-element-ancestor.mjs
function an(e, t) {
	let n = e;
	for (; (n = n.parentElement) && !n.matches(t););
	return n;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/create-scoped-keydown-handler/create-scoped-keydown-handler.mjs
function on(e, t, n) {
	for (let n = e - 1; n >= 0; --n) if (!t[n].disabled) return n;
	if (n) {
		for (let e = t.length - 1; e > -1; --e) if (!t[e].disabled) return e;
	}
	return e;
}
function sn(e, t, n) {
	for (let n = e + 1; n < t.length; n += 1) if (!t[n].disabled) return n;
	if (n) {
		for (let e = 0; e < t.length; e += 1) if (!t[e].disabled) return e;
	}
	return e;
}
function cn(e, t, n) {
	return an(e, n) === an(t, n);
}
function ln({ parentSelector: e, siblingSelector: t, onKeyDown: n, loop: r = !0, activateOnFocus: i = !1, dir: a = "rtl", orientation: o }) {
	return (s) => {
		n?.(s);
		let c = Array.from(an(s.currentTarget, e)?.querySelectorAll(t) || []).filter((t) => cn(s.currentTarget, t, e)), l = c.findIndex((e) => s.currentTarget === e), u = sn(l, c, r), d = on(l, c, r), f = a === "rtl" ? d : u, p = a === "rtl" ? u : d;
		switch (s.key) {
			case "ArrowRight":
				o === "horizontal" && (s.stopPropagation(), s.preventDefault(), c[f].focus(), i && c[f].click());
				break;
			case "ArrowLeft":
				o === "horizontal" && (s.stopPropagation(), s.preventDefault(), c[p].focus(), i && c[p].click());
				break;
			case "ArrowUp":
				o === "vertical" && (s.stopPropagation(), s.preventDefault(), c[d].focus(), i && c[d].click());
				break;
			case "ArrowDown":
				o === "vertical" && (s.stopPropagation(), s.preventDefault(), c[u].focus(), i && c[u].click());
				break;
			case "Home":
				s.stopPropagation(), s.preventDefault(), !c[0].disabled && c[0].focus();
				break;
			case "End": {
				s.stopPropagation(), s.preventDefault();
				let e = c.length - 1;
				!c[e].disabled && c[e].focus();
				break;
			}
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/get-default-z-index/get-default-z-index.mjs
var un = {
	app: 100,
	modal: 200,
	popover: 300,
	overlay: 400,
	max: 9999
};
function dn(e) {
	return un[e];
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/close-on-escape/close-on-escape.mjs
function fn(e, t = { active: !0 }) {
	return typeof e != "function" || !t.active ? t.onKeyDown || at : (n) => {
		n.key === "Escape" && (e(n), t.onTrigger?.());
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/create-event-handler/create-event-handler.mjs
function q(e, t) {
	return (n) => {
		e?.(n), t?.(n);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/get-context-item-index/get-context-item-index.mjs
function pn(e, t, n) {
	return n ? Array.from(an(n, t)?.querySelectorAll(e) || []).findIndex((e) => e === n) : null;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/utils/use-callback-ref/use-callback-ref.mjs
function mn(e) {
	let t = H(e);
	return V(() => {
		t.current = e;
	}), gt(() => ((...e) => t.current?.(...e)), []);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-debounced-callback/use-debounced-callback.mjs
function hn(e, t) {
	let { delay: n, flushOnUnmount: r, leading: i, maxWait: a } = typeof t == "number" ? {
		delay: t,
		flushOnUnmount: !1,
		leading: !1,
		maxWait: void 0
	} : t, o = mn(e), s = H(0), c = H(0), l = H(null), u = gt(() => {
		let e = Object.assign((...t) => {
			window.clearTimeout(s.current), l.current = t;
			let r = e._isFirstCall;
			e._isFirstCall = !1;
			function u() {
				window.clearTimeout(s.current), window.clearTimeout(c.current), s.current = 0, c.current = 0, e._isFirstCall = !0, e._hasPendingCallback = !1;
			}
			function d() {
				a !== void 0 && c.current === 0 && (c.current = window.setTimeout(() => {
					if (s.current !== 0) {
						let e = l.current;
						u(), o(...e);
					}
				}, a));
			}
			if (i && r) {
				o(...t), e.flush = () => {
					s.current !== 0 && (u(), o(...t));
				}, e.cancel = () => {
					u();
				}, s.current = window.setTimeout(() => {
					u();
				}, n), d();
				return;
			}
			if (i && !r) {
				e._hasPendingCallback = !0, e.flush = () => {
					s.current !== 0 && (u(), o(...t));
				}, e.cancel = () => {
					u();
				}, s.current = window.setTimeout(() => {
					u();
				}, n), d();
				return;
			}
			e._hasPendingCallback = !0;
			let f = () => {
				s.current !== 0 && (u(), o(...t));
			};
			e.flush = f, e.cancel = () => {
				u();
			}, s.current = window.setTimeout(f, n), d();
		}, {
			flush: () => {},
			cancel: () => {},
			isPending: () => e._hasPendingCallback,
			_isFirstCall: !0,
			_hasPendingCallback: !1
		});
		return e;
	}, [
		o,
		n,
		i,
		a
	]);
	return V(() => () => {
		r ? u.flush() : u.cancel();
	}, [u, r]), u;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-click-outside/use-click-outside.mjs
var gn = ["mousedown", "touchstart"];
function _n(e, t, n, r = !0) {
	let i = H(null), a = t || gn, o = pt((t) => {
		let { target: r } = t ?? {};
		if (!document.body.contains(r) && r?.tagName !== "HTML") return;
		let a = t.composedPath();
		Array.isArray(n) ? n.every((e) => !!e && !a.includes(e)) && e(t) : i.current && !a.includes(i.current) && e(t);
	}), s = a.join(",");
	return V(() => {
		if (!r) return;
		let e = s.split(",");
		return e.forEach((e) => document.addEventListener(e, o)), () => {
			e.forEach((e) => document.removeEventListener(e, o));
		};
	}, [s, r]), i;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-focus-return/use-focus-return.mjs
function vn({ opened: e, shouldReturnFocus: t = !0 }) {
	let n = H(null), r = () => {
		n.current && "focus" in n.current && typeof n.current.focus == "function" && n.current?.focus({ preventScroll: !0 });
	};
	return ie(() => {
		let i = -1, a = (e) => {
			e.key === "Tab" && window.clearTimeout(i);
		};
		if (document.addEventListener("keydown", a), e) n.current = document.activeElement;
		else if (t) {
			let e = document.activeElement;
			i = window.setTimeout(() => {
				let t = document.activeElement;
				(t === null || t === document.body || t === e) && r();
			}, 10);
		}
		return () => {
			window.clearTimeout(i), document.removeEventListener("keydown", a);
		};
	}, [e, t]), r;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-focus-trap/tabbable.mjs
var yn = /input|select|textarea|button|object/, bn = "a, input, select, textarea, button, object, [tabindex]";
function xn(e) {
	return e.style.display === "none";
}
function Sn(e) {
	if (e.getAttribute("aria-hidden") || e.getAttribute("hidden") || e.getAttribute("type") === "hidden") return !1;
	let t = e;
	for (; t && !(t === document.body || t.nodeType === 11);) {
		if (xn(t)) return !1;
		t = t.parentNode;
	}
	return !0;
}
function Cn(e) {
	let t = e.getAttribute("tabindex");
	return t === null && (t = void 0), parseInt(t, 10);
}
function wn(e) {
	let t = e.nodeName.toLowerCase(), n = !Number.isNaN(Cn(e));
	return (yn.test(t) && !e.disabled || e instanceof HTMLAnchorElement && e.href || n) && Sn(e);
}
function Tn(e) {
	let t = Cn(e);
	return (Number.isNaN(t) || t >= 0) && wn(e);
}
function En(e) {
	return Array.from(e.querySelectorAll(bn)).filter(Tn);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-focus-trap/scope-tab.mjs
function Dn(e, t) {
	let n = En(e);
	if (!n.length) {
		t.preventDefault();
		return;
	}
	let r = n[t.shiftKey ? 0 : n.length - 1], i = e.getRootNode(), a = r === i.activeElement || e === i.activeElement, o = i.activeElement;
	if (o.tagName === "INPUT" && o.getAttribute("type") === "radio" && (a = n.filter((e) => e.getAttribute("type") === "radio" && e.getAttribute("name") === o.getAttribute("name")).includes(r)), !a) return;
	t.preventDefault();
	let s = n[t.shiftKey ? n.length - 1 : 0];
	s && s.focus();
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-focus-trap/use-focus-trap.mjs
function On(e = !0) {
	let t = H(null), n = (e) => {
		let t = e.querySelector("[data-autofocus]");
		if (!t) {
			let n = Array.from(e.querySelectorAll(bn));
			t = n.find(Tn) || n.find(wn) || null, !t && wn(e) && (t = e);
		}
		t ? t.focus({ preventScroll: !0 }) : console.warn("[@mantine/hooks/use-focus-trap] Failed to find focusable element within provided node", e);
	}, r = B((r) => {
		if (e) {
			if (r === null) {
				t.current = null;
				return;
			}
			t.current !== r && (setTimeout(() => {
				r.getRootNode() ? n(r) : console.warn("[@mantine/hooks/use-focus-trap] Ref node is not part of the dom", r);
			}), t.current = r);
		}
	}, [e]);
	return V(() => {
		if (!e) return;
		t.current && setTimeout(() => {
			t.current && n(t.current);
		});
		let r = (e) => {
			e.key === "Tab" && t.current && Dn(t.current, e);
		};
		return document.addEventListener("keydown", r), () => document.removeEventListener("keydown", r);
	}, [e]), r;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-id/use-id.mjs
function kn(e) {
	let [t, n] = U(`mantine-${mt().replace(/:/g, "")}`), r = H(!1);
	return oe(() => {
		r.current || (r.current = !0, n(O()));
	}, []), typeof e == "string" ? e : t;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-merged-ref/use-merged-ref.mjs
function An(e, t) {
	if (typeof e == "function") return e(t);
	typeof e == "object" && e && "current" in e && (e.current = t);
}
function jn(...e) {
	let t = /* @__PURE__ */ new Map();
	return (n) => {
		if (e.forEach((e) => {
			let r = An(e, n);
			r && t.set(e, r);
		}), t.size > 0) return () => {
			e.forEach((e) => {
				let n = t.get(e);
				n && typeof n == "function" ? n() : An(e, null);
			}), t.clear();
		};
	};
}
function Mn(...e) {
	return B(jn(...e), e);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-uncontrolled/use-uncontrolled.mjs
function Nn({ value: e, defaultValue: t, finalValue: n, onChange: r = () => {} }) {
	let [i, a] = U(t === void 0 ? n : t);
	return e === void 0 ? [
		i,
		(e, ...t) => {
			a(e), r?.(e, ...t);
		},
		!1
	] : [
		e,
		r,
		!0
	];
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-long-press/use-long-press.mjs
var Pn = ["mouse", "touch"], Fn = 10;
function In(e, t = {}) {
	let { threshold: n = 400, events: r = Pn, cancelOnMove: i = !1, onStart: a, onFinish: o, onCancel: s } = t, c = H(!1), l = H(!1), u = H(-1), d = H(null);
	return V(() => () => window.clearTimeout(u.current), []), gt(() => {
		if (typeof e != "function") return {};
		let t = i !== !1, f = i === !0 ? Fn : i === !1 ? 0 : i, p = (t) => {
			!zn(t) && !Rn(t) || (a && a(t), d.current = Ln(t), l.current = !0, u.current = window.setTimeout(() => {
				e(t), c.current = !0;
			}, n));
		}, m = (e) => {
			!zn(e) && !Rn(e) || (c.current ? o && o(e) : l.current && s && s(e), c.current = !1, l.current = !1, d.current = null, u.current !== -1 && (window.clearTimeout(u.current), u.current = -1));
		}, h = (e) => {
			if (!t || !l.current || c.current) return;
			let n = Ln(e);
			if (!n || !d.current) return;
			let r = n.x - d.current.x, i = n.y - d.current.y;
			Math.sqrt(r * r + i * i) > f && m(e);
		}, g = {};
		return r.includes("mouse") && (g.onMouseDown = p, g.onMouseUp = m, g.onMouseLeave = m, t && (g.onMouseMove = h)), r.includes("touch") && (g.onTouchStart = p, g.onTouchEnd = m, g.onTouchCancel = m, t && (g.onTouchMove = h)), g;
	}, [
		e,
		n,
		s,
		o,
		a,
		i,
		r.join(",")
	]);
}
function Ln(e) {
	if (Rn(e)) {
		let t = e.touches[0] ?? e.changedTouches[0];
		return t ? {
			x: t.clientX,
			y: t.clientY
		} : null;
	}
	return {
		x: e.clientX,
		y: e.clientY
	};
}
function Rn(e) {
	return window.TouchEvent ? e.nativeEvent instanceof TouchEvent : "touches" in e.nativeEvent;
}
function zn(e) {
	return e.nativeEvent instanceof MouseEvent;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/get-env/get-env.mjs
function Bn() {
	return "development";
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/get-ref-prop/get-ref-prop.mjs
function Vn(e) {
	let t = ot.version;
	return typeof ot.version != "string" || t.startsWith("18.") ? e?.ref : e?.props?.ref;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/get-single-element-child/get-single-element-child.mjs
function Hn(e) {
	let t = st.toArray(e);
	return t.length !== 1 || !rn(t[0]) ? null : t[0];
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/styles-api/use-resolved-styles-api/use-resolved-styles-api.mjs
function Un({ classNames: e, styles: t, props: n, stylesCtx: r }) {
	let i = l();
	return {
		resolvedClassNames: e === void 0 ? void 0 : se({
			theme: i,
			classNames: e,
			props: n,
			stylesCtx: r || void 0
		}),
		resolvedStyles: t === void 0 ? void 0 : A({
			theme: i,
			styles: t,
			props: n,
			stylesCtx: r || void 0
		})
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/Box/get-style-object/get-style-object.mjs
function Wn(e, t) {
	return Array.isArray(e) ? [...e].reduce((e, n) => ({
		...e,
		...Wn(n, t)
	}), {}) : typeof e == "function" ? e(t) : e ?? {};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/DirectionProvider/DirectionProvider.mjs
var Gn = ut({
	dir: "ltr",
	toggleDirection: () => {},
	setDirection: () => {}
});
function Kn() {
	return ft(Gn);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollArea.context.mjs
var [qn, Jn] = F("ScrollArea.Root component was not found in tree");
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/use-resize-observer.mjs
function Yn(e, t) {
	let n = pt(t);
	oe(() => {
		let t = 0;
		if (e) {
			let r = new ResizeObserver(() => {
				cancelAnimationFrame(t), t = window.requestAnimationFrame(n);
			});
			return r.observe(e), () => {
				window.cancelAnimationFrame(t), r.unobserve(e);
			};
		}
	}, [e]);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaCorner/ScrollAreaCorner.mjs
function Xn(e) {
	let { style: t, ...n } = e, r = Jn(), [i, a] = U(0), [o, s] = U(0), c = !!(i && o);
	return Yn(r.scrollbarX, () => {
		let e = r.scrollbarX?.offsetHeight || 0;
		r.onCornerHeightChange(e), s(e);
	}), Yn(r.scrollbarY, () => {
		let e = r.scrollbarY?.offsetWidth || 0;
		r.onCornerWidthChange(e), a(e);
	}), c ? /* @__PURE__ */ G("div", {
		...n,
		style: {
			...t,
			width: i,
			height: o
		}
	}) : null;
}
function Zn(e) {
	let t = Jn(), n = !!(t.scrollbarX && t.scrollbarY);
	return t.type !== "scroll" && n ? /* @__PURE__ */ G(Xn, { ...e }) : null;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaRoot/ScrollAreaRoot.mjs
var Qn = {
	scrollHideDelay: 1e3,
	type: "hover"
};
function $n(e) {
	let { type: t, scrollHideDelay: n, scrollbars: r, getStyles: i, ref: a, ...o } = C("ScrollAreaRoot", Qn, e), [s, c] = U(null), [l, u] = U(null), [d, f] = U(null), [p, m] = U(null), [h, g] = U(null), [v, y] = U(0), [b, x] = U(0), [S, w] = U(!1), [T, E] = U(!1), D = Mn(a, c);
	return /* @__PURE__ */ G(qn, {
		value: {
			type: t,
			scrollHideDelay: n,
			scrollArea: s,
			viewport: l,
			onViewportChange: u,
			content: d,
			onContentChange: f,
			scrollbarX: p,
			onScrollbarXChange: m,
			scrollbarXEnabled: S,
			onScrollbarXEnabledChange: w,
			scrollbarY: h,
			onScrollbarYChange: g,
			scrollbarYEnabled: T,
			onScrollbarYEnabledChange: E,
			onCornerWidthChange: y,
			onCornerHeightChange: x,
			getStyles: i
		},
		children: /* @__PURE__ */ G(_, {
			...o,
			ref: D,
			__vars: {
				"--sa-corner-width": r === "xy" ? `${v}px` : "0px",
				"--sa-corner-height": r === "xy" ? `${b}px` : "0px"
			}
		})
	});
}
$n.displayName = "@mantine/core/ScrollAreaRoot";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/get-thumb-ratio.mjs
function er(e, t) {
	let n = e / t;
	return Number.isNaN(n) ? 0 : n;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/get-thumb-size.mjs
function tr(e) {
	let t = er(e.viewport, e.content), n = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, r = (e.scrollbar.size - n) * t;
	return Math.max(r, 18);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/linear-scale.mjs
function nr(e, t) {
	return (n) => {
		if (e[0] === e[1] || t[0] === t[1]) return t[0];
		let r = (t[1] - t[0]) / (e[1] - e[0]);
		return t[0] + r * (n - e[0]);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/get-thumb-offset-from-scroll.mjs
function rr(e, [t, n]) {
	return Math.min(n, Math.max(t, e));
}
function ir(e, t, n = "ltr") {
	let r = tr(t), i = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, a = t.scrollbar.size - i, o = t.content - t.viewport, s = a - r, c = rr(e, n === "ltr" ? [0, o] : [o * -1, 0]);
	return nr([0, o], [0, s])(c);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/get-scroll-position-from-pointer.mjs
function ar(e, t, n, r = "ltr") {
	let i = tr(n), a = i / 2, o = t || a, s = i - o, c = n.scrollbar.paddingStart + o, l = n.scrollbar.size - n.scrollbar.paddingEnd - s, u = n.content - n.viewport, d = r === "ltr" ? [0, u] : [u * -1, 0];
	return nr([c, l], d)(e);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/is-scrolling-within-scrollbar-bounds.mjs
function or(e, t) {
	return e > 0 && e < t;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/to-int.mjs
function sr(e) {
	return e ? parseInt(e, 10) : 0;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/compose-event-handlers.mjs
function cr(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
	return (r) => {
		e?.(r), (n === !1 || !r.defaultPrevented) && t?.(r);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/Scrollbar.context.mjs
var [lr, ur] = F("ScrollAreaScrollbar was not found in tree");
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/Scrollbar.mjs
function dr(e) {
	let { sizes: t, hasThumb: n, onThumbChange: r, onThumbPointerUp: i, onThumbPointerDown: a, onThumbPositionChange: o, onDragScroll: s, onWheelScroll: c, onResize: l, ref: u, ...d } = e, f = Jn(), [p, m] = U(null), h = Mn(u, m), g = H(null), _ = H(""), { viewport: v } = f, y = t.content - t.viewport, b = pt(c), x = mn(o), S = hn(l, 10), C = (e) => {
		g.current && s({
			x: e.clientX - g.current.left,
			y: e.clientY - g.current.top
		});
	};
	return V(() => {
		let e = (e) => {
			let t = e.target;
			p?.contains(t) && b(e, y);
		};
		return document.addEventListener("wheel", e, { passive: !1 }), () => document.removeEventListener("wheel", e, { passive: !1 });
	}, [
		v,
		p,
		y
	]), V(x, [t, x]), Yn(p, S), Yn(f.content, S), /* @__PURE__ */ G(lr, {
		value: {
			scrollbar: p,
			hasThumb: n,
			onThumbChange: mn(r),
			onThumbPointerUp: mn(i),
			onThumbPositionChange: x,
			onThumbPointerDown: mn(a)
		},
		children: /* @__PURE__ */ G("div", {
			...d,
			ref: h,
			"data-mantine-scrollbar": !0,
			style: {
				position: "absolute",
				...d.style
			},
			onPointerDown: cr(e.onPointerDown, (e) => {
				e.preventDefault(), e.button === 0 && (e.target.setPointerCapture(e.pointerId), g.current = p.getBoundingClientRect(), _.current = document.body.style.webkitUserSelect, document.body.style.webkitUserSelect = "none", C(e));
			}),
			onPointerMove: cr(e.onPointerMove, C),
			onPointerUp: cr(e.onPointerUp, (e) => {
				let t = e.target;
				t.hasPointerCapture(e.pointerId) && (e.preventDefault(), t.releasePointerCapture(e.pointerId));
			}),
			onLostPointerCapture: () => {
				document.body.style.webkitUserSelect = _.current, g.current = null;
			}
		})
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/ScrollbarX.mjs
var fr = (e) => {
	let { sizes: t, onSizesChange: n, style: r, ref: i, ...a } = e, o = Jn(), [s, c] = U(), l = H(null), u = Mn(i, l, o.onScrollbarXChange);
	return V(() => {
		l.current && c(getComputedStyle(l.current));
	}, [l]), /* @__PURE__ */ G(dr, {
		"data-orientation": "horizontal",
		...a,
		ref: u,
		sizes: t,
		style: {
			...r,
			"--sa-thumb-width": `${tr(t)}px`
		},
		onThumbPointerDown: (t) => e.onThumbPointerDown(t.x),
		onDragScroll: (t) => e.onDragScroll(t.x),
		onWheelScroll: (t, n) => {
			if (o.viewport) {
				let r = o.viewport.scrollLeft + t.deltaX;
				e.onWheelScroll(r), or(r, n) && t.preventDefault();
			}
		},
		onResize: () => {
			l.current && o.viewport && s && n({
				content: o.viewport.scrollWidth,
				viewport: o.viewport.offsetWidth,
				scrollbar: {
					size: l.current.clientWidth,
					paddingStart: sr(s.paddingLeft),
					paddingEnd: sr(s.paddingRight)
				}
			});
		}
	});
};
fr.displayName = "@mantine/core/ScrollAreaScrollbarX";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/ScrollbarY.mjs
function pr(e) {
	let { sizes: t, onSizesChange: n, style: r, ref: i, ...a } = e, o = Jn(), [s, c] = U(), l = H(null), u = Mn(i, l, o.onScrollbarYChange);
	return V(() => {
		l.current && c(window.getComputedStyle(l.current));
	}, []), /* @__PURE__ */ G(dr, {
		...a,
		"data-orientation": "vertical",
		ref: u,
		sizes: t,
		style: {
			"--sa-thumb-height": `${tr(t)}px`,
			...r
		},
		onThumbPointerDown: (t) => e.onThumbPointerDown(t.y),
		onDragScroll: (t) => e.onDragScroll(t.y),
		onWheelScroll: (t, n) => {
			if (o.viewport) {
				let r = o.viewport.scrollTop + t.deltaY;
				e.onWheelScroll(r), or(r, n) && t.preventDefault();
			}
		},
		onResize: () => {
			l.current && o.viewport && s && n({
				content: o.viewport.scrollHeight,
				viewport: o.viewport.offsetHeight,
				scrollbar: {
					size: l.current.clientHeight,
					paddingStart: sr(s.paddingTop),
					paddingEnd: sr(s.paddingBottom)
				}
			});
		}
	});
}
pr.displayName = "@mantine/core/ScrollAreaScrollbarY";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/ScrollAreaScrollbarVisible.mjs
function mr(e) {
	let { orientation: t = "vertical", ...n } = e, { dir: r } = Kn(), i = Jn(), a = H(null), o = H(0), [s, c] = U({
		content: 0,
		viewport: 0,
		scrollbar: {
			size: 0,
			paddingStart: 0,
			paddingEnd: 0
		}
	}), l = er(s.viewport, s.content), u = {
		...n,
		sizes: s,
		onSizesChange: c,
		hasThumb: l > 0 && l < 1,
		onThumbChange: (e) => {
			a.current = e;
		},
		onThumbPointerUp: () => {
			o.current = 0;
		},
		onThumbPointerDown: (e) => {
			o.current = e;
		}
	}, d = (e, t) => ar(e, o.current, s, t);
	return t === "horizontal" ? /* @__PURE__ */ G(fr, {
		...u,
		onThumbPositionChange: () => {
			if (i.viewport && a.current) {
				let e = i.viewport.scrollLeft, t = ir(e, s, r);
				a.current.style.transform = `translate3d(${t}px, 0, 0)`;
			}
		},
		onWheelScroll: (e) => {
			i.viewport && (i.viewport.scrollLeft = e);
		},
		onDragScroll: (e) => {
			i.viewport && (i.viewport.scrollLeft = d(e, r));
		}
	}) : t === "vertical" ? /* @__PURE__ */ G(pr, {
		...u,
		onThumbPositionChange: () => {
			if (i.viewport && a.current) {
				let e = i.viewport.scrollTop, t = ir(e, s);
				s.scrollbar.size === 0 ? a.current.style.setProperty("--thumb-opacity", "0") : a.current.style.setProperty("--thumb-opacity", "1"), a.current.style.transform = `translate3d(0, ${t}px, 0)`;
			}
		},
		onWheelScroll: (e) => {
			i.viewport && (i.viewport.scrollTop = e);
		},
		onDragScroll: (e) => {
			i.viewport && (i.viewport.scrollTop = d(e));
		}
	}) : null;
}
mr.displayName = "@mantine/core/ScrollAreaScrollbarVisible";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/ScrollAreaScrollbarAuto.mjs
function hr(e) {
	let t = Jn(), { forceMount: n, ...r } = e, [i, a] = U(!1), o = e.orientation === "horizontal", s = hn(() => {
		if (t.viewport) {
			let e = t.viewport.offsetWidth < t.viewport.scrollWidth, n = t.viewport.offsetHeight < t.viewport.scrollHeight;
			a(o ? e : n);
		}
	}, 10);
	return Yn(t.viewport, s), Yn(t.content, s), n || i ? /* @__PURE__ */ G(mr, {
		"data-state": i ? "visible" : "hidden",
		...r
	}) : null;
}
hr.displayName = "@mantine/core/ScrollAreaScrollbarAuto";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/ScrollAreaScrollbarHover.mjs
function gr(e) {
	let { forceMount: t, ...n } = e, r = Jn(), [i, a] = U(!1);
	return V(() => {
		let { scrollArea: e } = r, t = 0;
		if (e) {
			let n = () => {
				window.clearTimeout(t), a(!0);
			}, i = () => {
				t = window.setTimeout(() => a(!1), r.scrollHideDelay);
			};
			return e.addEventListener("pointerenter", n), e.addEventListener("pointerleave", i), () => {
				window.clearTimeout(t), e.removeEventListener("pointerenter", n), e.removeEventListener("pointerleave", i);
			};
		}
	}, [r.scrollArea, r.scrollHideDelay]), t || i ? /* @__PURE__ */ G(hr, {
		"data-state": i ? "visible" : "hidden",
		...n
	}) : null;
}
gr.displayName = "@mantine/core/ScrollAreaScrollbarHover";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/ScrollAreaScrollbarScroll.mjs
function _r(e) {
	let { forceMount: t, ...n } = e, r = Jn(), i = e.orientation === "horizontal", [a, o] = U("hidden"), s = hn(() => o("idle"), 100);
	return V(() => {
		if (a === "idle") {
			let e = window.setTimeout(() => o("hidden"), r.scrollHideDelay);
			return () => window.clearTimeout(e);
		}
	}, [a, r.scrollHideDelay]), V(() => {
		let { viewport: e } = r, t = i ? "scrollLeft" : "scrollTop";
		if (e) {
			let n = e[t], r = () => {
				let r = e[t];
				n !== r && (o("scrolling"), s()), n = r;
			};
			return e.addEventListener("scroll", r), () => e.removeEventListener("scroll", r);
		}
	}, [
		r.viewport,
		i,
		s
	]), t || a !== "hidden" ? /* @__PURE__ */ G(mr, {
		"data-state": a === "hidden" ? "hidden" : "visible",
		...n,
		onPointerEnter: cr(e.onPointerEnter, () => o("interacting")),
		onPointerLeave: cr(e.onPointerLeave, () => o("idle"))
	}) : null;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaScrollbar/ScrollAreaScrollbar.mjs
function vr(e) {
	let { forceMount: t, ...n } = e, r = Jn(), { onScrollbarXEnabledChange: i, onScrollbarYEnabledChange: a } = r, o = e.orientation === "horizontal";
	return V(() => (o ? i(!0) : a(!0), () => {
		o ? i(!1) : a(!1);
	}), [
		o,
		i,
		a
	]), r.type === "hover" ? /* @__PURE__ */ G(gr, {
		...n,
		forceMount: t
	}) : r.type === "scroll" ? /* @__PURE__ */ G(_r, {
		...n,
		forceMount: t
	}) : r.type === "auto" ? /* @__PURE__ */ G(hr, {
		...n,
		forceMount: t
	}) : r.type === "always" ? /* @__PURE__ */ G(mr, { ...n }) : null;
}
vr.displayName = "@mantine/core/ScrollAreaScrollbar";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/utils/add-unlinked-scroll-listener.mjs
function yr(e, t = () => {}) {
	let n = {
		left: e.scrollLeft,
		top: e.scrollTop
	}, r = 0;
	return (function i() {
		let a = {
			left: e.scrollLeft,
			top: e.scrollTop
		}, o = n.left !== a.left, s = n.top !== a.top;
		(o || s) && t(), n = a, r = window.requestAnimationFrame(i);
	})(), () => window.cancelAnimationFrame(r);
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaThumb/ScrollAreaThumb.mjs
function br(e) {
	let { style: t, ref: n, ...r } = e, i = Jn(), a = ur(), { onThumbPositionChange: o } = a, s = Mn(n, a.onThumbChange), c = H(void 0), l = hn(() => {
		c.current &&= (c.current(), void 0);
	}, 100);
	return V(() => {
		let { viewport: e } = i;
		if (e) {
			let t = () => {
				l(), c.current || (c.current = yr(e, o), o());
			};
			return o(), e.addEventListener("scroll", t), () => e.removeEventListener("scroll", t);
		}
	}, [
		i.viewport,
		l,
		o
	]), /* @__PURE__ */ G("div", {
		"data-state": a.hasThumb ? "visible" : "hidden",
		...r,
		ref: s,
		style: {
			width: "var(--sa-thumb-width)",
			height: "var(--sa-thumb-height)",
			...t
		},
		onPointerDownCapture: cr(e.onPointerDownCapture, (e) => {
			let t = e.target.getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
			a.onThumbPointerDown({
				x: n,
				y: r
			});
		}),
		onPointerUp: cr(e.onPointerUp, a.onThumbPointerUp)
	});
}
br.displayName = "@mantine/core/ScrollAreaThumb";
function xr(e) {
	let { forceMount: t, ...n } = e, r = ur();
	return t || r.hasThumb ? /* @__PURE__ */ G(br, { ...n }) : null;
}
xr.displayName = "@mantine/core/ScrollAreaThumb";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollAreaViewport/ScrollAreaViewport.mjs
function Sr({ children: e, style: t, ref: n, onWheel: r, ...i }) {
	let a = Jn(), o = Mn(n, a.onViewportChange), s = (e) => {
		if (r?.(e), a.scrollbarXEnabled && a.viewport && e.shiftKey) {
			let { scrollTop: t, scrollHeight: n, clientHeight: r, scrollWidth: i, clientWidth: o } = a.viewport, s = t < 1, c = t >= n - r - 1;
			i > o && (s || c) && e.stopPropagation();
		}
	};
	return /* @__PURE__ */ G(_, {
		...i,
		ref: o,
		onWheel: s,
		style: {
			overflowX: a.scrollbarXEnabled ? "scroll" : "hidden",
			overflowY: a.scrollbarYEnabled ? "scroll" : "hidden",
			...t
		},
		children: /* @__PURE__ */ G("div", {
			...a.getStyles("content"),
			ref: a.onContentChange,
			children: e
		})
	});
}
Sr.displayName = "@mantine/core/ScrollAreaViewport";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollArea.module.mjs
var Cr = {
	root: "m_d57069b5",
	content: "m_b1336c6",
	viewport: "m_c0783ff9",
	viewportInner: "m_f8f631dd",
	scrollbar: "m_c44ba933",
	thumb: "m_d8b5e363",
	corner: "m_21657268"
};
//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+react@0.27.19_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@floating-ui/react/dist/floating-ui.react.utils.mjs
tt();
function wr() {
	let e = navigator.userAgentData;
	return e != null && e.platform ? e.platform : navigator.platform;
}
function Tr() {
	let e = navigator.userAgentData;
	return e && Array.isArray(e.brands) ? e.brands.map((e) => {
		let { brand: t, version: n } = e;
		return t + "/" + n;
	}).join(" ") : navigator.userAgent;
}
function Er() {
	return /apple/i.test(navigator.vendor);
}
function Dr() {
	return wr().toLowerCase().startsWith("mac") && !navigator.maxTouchPoints;
}
function Or() {
	return Tr().includes("jsdom/");
}
var kr = "data-floating-ui-focusable", Ar = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
function jr(e) {
	let t = e.activeElement;
	for (; ((n = t) == null || (n = n.shadowRoot) == null ? void 0 : n.activeElement) != null;) {
		var n;
		t = t.shadowRoot.activeElement;
	}
	return t;
}
function Mr(e, t) {
	if (!e || !t) return !1;
	let n = t.getRootNode == null ? void 0 : t.getRootNode();
	if (e.contains(t)) return !0;
	if (n && R(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function Nr(e) {
	return "composedPath" in e ? e.composedPath()[0] : e.target;
}
function Pr(e, t) {
	if (t == null) return !1;
	if ("composedPath" in e) return e.composedPath().includes(t);
	let n = e;
	return n.target != null && t.contains(n.target);
}
function Fr(e) {
	return e.matches("html,body");
}
function Ir(e) {
	return e?.ownerDocument || document;
}
function Lr(e) {
	return et(e) && e.matches(Ar);
}
function Rr(e) {
	if (!e || Or()) return !0;
	try {
		return e.matches(":focus-visible");
	} catch {
		return !0;
	}
}
function zr(e) {
	return e ? e.hasAttribute(kr) ? e : e.querySelector("[data-floating-ui-focusable]") || e : null;
}
function Br(e, t, n) {
	return n === void 0 && (n = !0), e.filter((e) => e.parentId === t && (!n || e.context?.open)).flatMap((t) => [t, ...Br(e, t.id, n)]);
}
function Vr(e) {
	return "nativeEvent" in e;
}
function Hr(e, t) {
	let n = ["mouse", "pen"];
	return t || n.push("", void 0), n.includes(e);
}
var Ur = typeof document < "u" ? ht : function() {}, Wr = { ...z };
function Gr(e) {
	let t = z.useRef(e);
	return Ur(() => {
		t.current = e;
	}), t;
}
var Kr = Wr.useInsertionEffect || ((e) => e());
function qr(e) {
	let t = z.useRef(() => {
		if (process.env.NODE_ENV !== "production") throw Error("Cannot call an event handler while rendering.");
	});
	return Kr(() => {
		t.current = e;
	}), z.useCallback(function() {
		var e = [...arguments];
		return t.current == null ? void 0 : t.current(...e);
	}, []);
}
//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+react@0.27.19_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@floating-ui/react/dist/floating-ui.react.mjs
tt();
function Jr(e) {
	let t = z.useRef(void 0), n = z.useCallback((t) => {
		let n = e.map((e) => {
			if (e != null) {
				if (typeof e == "function") {
					let n = e, r = n(t);
					return typeof r == "function" ? r : () => {
						n(null);
					};
				}
				return e.current = t, () => {
					e.current = null;
				};
			}
		});
		return () => {
			n.forEach((e) => e?.());
		};
	}, e);
	return z.useMemo(() => e.every((e) => e == null) ? null : (e) => {
		t.current &&= (t.current(), void 0), e != null && (t.current = n(e));
	}, e);
}
var Yr = "data-floating-ui-focusable", Xr = "active", Zr = "selected", Qr = "ArrowLeft", $r = "ArrowRight", ei = "ArrowUp", ti = "ArrowDown", ni = [Qr, $r], ri = [ei, ti];
[...ni, ...ri];
var ii = { ...z }, ai = !1, oi = 0, si = () => "floating-ui-" + Math.random().toString(36).slice(2, 6) + oi++;
function ci() {
	let [e, t] = z.useState(() => ai ? si() : void 0);
	return Ur(() => {
		e ?? t(si());
	}, []), z.useEffect(() => {
		ai = !0;
	}, []), e;
}
var li = ii.useId || ci, ui;
process.env.NODE_ENV !== "production" && (ui = /*#__PURE__*/ new Set());
function di() {
	var e;
	let t = "Floating UI: " + [...arguments].join(" ");
	if (!((e = ui) != null && e.has(t))) {
		var n;
		(n = ui) == null || n.add(t), console.error(t);
	}
}
function fi() {
	let e = /* @__PURE__ */ new Map();
	return {
		emit(t, n) {
			var r;
			(r = e.get(t)) == null || r.forEach((e) => e(n));
		},
		on(t, n) {
			e.has(t) || e.set(t, /* @__PURE__ */ new Set()), e.get(t).add(n);
		},
		off(t, n) {
			var r;
			(r = e.get(t)) == null || r.delete(n);
		}
	};
}
var pi = /*#__PURE__*/ z.createContext(null), mi = /*#__PURE__*/ z.createContext(null), hi = () => z.useContext(pi)?.id || null, gi = () => z.useContext(mi);
function _i(e) {
	return "data-floating-ui-" + e;
}
function vi(e) {
	e.current !== -1 && (clearTimeout(e.current), e.current = -1);
}
var yi = /*#__PURE__*/ _i("safe-polygon");
function bi(e, t, n) {
	if (n && !Hr(n)) return 0;
	if (typeof e == "number") return e;
	if (typeof e == "function") {
		let n = e();
		return typeof n == "number" ? n : n?.[t];
	}
	return e?.[t];
}
function xi(e) {
	return typeof e == "function" ? e() : e;
}
function Si(e, t) {
	t === void 0 && (t = {});
	let { open: n, onOpenChange: r, dataRef: i, events: a, elements: o } = e, { enabled: s = !0, delay: c = 0, handleClose: l = null, mouseOnly: u = !1, restMs: d = 0, move: f = !0 } = t, p = gi(), m = hi(), h = Gr(l), g = Gr(c), _ = Gr(n), v = Gr(d), y = z.useRef(), b = z.useRef(-1), x = z.useRef(), S = z.useRef(-1), C = z.useRef(!0), w = z.useRef(!1), T = z.useRef(() => {}), E = z.useRef(!1), D = qr(() => {
		let e = i.current.openEvent?.type;
		return e?.includes("mouse") && e !== "mousedown";
	});
	z.useEffect(() => {
		if (!s) return;
		function e(e) {
			let { open: t } = e;
			t || (vi(b), vi(S), C.current = !0, E.current = !1);
		}
		return a.on("openchange", e), () => {
			a.off("openchange", e);
		};
	}, [s, a]), z.useEffect(() => {
		if (!s || !h.current || !n) return;
		function e(e) {
			D() && r(!1, e, "hover");
		}
		let t = Ir(o.floating).documentElement;
		return t.addEventListener("mouseleave", e), () => {
			t.removeEventListener("mouseleave", e);
		};
	}, [
		o.floating,
		n,
		r,
		s,
		h,
		D
	]);
	let O = z.useCallback(function(e, t, n) {
		t === void 0 && (t = !0), n === void 0 && (n = "hover");
		let i = bi(g.current, "close", y.current);
		i && !x.current ? (vi(b), b.current = window.setTimeout(() => r(!1, e, n), i)) : t && (vi(b), r(!1, e, n));
	}, [g, r]), k = qr(() => {
		T.current(), x.current = void 0;
	}), A = qr(() => {
		if (w.current) {
			let e = Ir(o.floating).body;
			e.style.pointerEvents = "", e.removeAttribute(yi), w.current = !1;
		}
	}), j = qr(() => i.current.openEvent ? ["click", "mousedown"].includes(i.current.openEvent.type) : !1);
	z.useEffect(() => {
		if (!s) return;
		function e(e) {
			if (vi(b), C.current = !1, u && !Hr(y.current) || xi(v.current) > 0 && !bi(g.current, "open")) return;
			let t = bi(g.current, "open", y.current);
			t ? b.current = window.setTimeout(() => {
				_.current || r(!0, e, "hover");
			}, t) : n || r(!0, e, "hover");
		}
		function t(e) {
			if (j()) {
				A();
				return;
			}
			T.current();
			let t = Ir(o.floating);
			if (vi(S), E.current = !1, h.current && i.current.floatingContext) {
				n || vi(b), x.current = h.current({
					...i.current.floatingContext,
					tree: p,
					x: e.clientX,
					y: e.clientY,
					onClose() {
						A(), k(), j() || O(e, !0, "safe-polygon");
					}
				});
				let r = x.current;
				t.addEventListener("mousemove", r), T.current = () => {
					t.removeEventListener("mousemove", r);
				};
				return;
			}
			(y.current !== "touch" || !Mr(o.floating, e.relatedTarget)) && O(e);
		}
		function a(e) {
			j() || i.current.floatingContext && (h.current == null || h.current({
				...i.current.floatingContext,
				tree: p,
				x: e.clientX,
				y: e.clientY,
				onClose() {
					A(), k(), j() || O(e);
				}
			})(e));
		}
		function c() {
			vi(b);
		}
		function l(e) {
			j() || O(e, !1);
		}
		if (L(o.domReference)) {
			let r = o.domReference, i = o.floating;
			return n && r.addEventListener("mouseleave", a), f && r.addEventListener("mousemove", e, { once: !0 }), r.addEventListener("mouseenter", e), r.addEventListener("mouseleave", t), i && (i.addEventListener("mouseleave", a), i.addEventListener("mouseenter", c), i.addEventListener("mouseleave", l)), () => {
				n && r.removeEventListener("mouseleave", a), f && r.removeEventListener("mousemove", e), r.removeEventListener("mouseenter", e), r.removeEventListener("mouseleave", t), i && (i.removeEventListener("mouseleave", a), i.removeEventListener("mouseenter", c), i.removeEventListener("mouseleave", l));
			};
		}
	}, [
		o,
		s,
		e,
		u,
		f,
		O,
		k,
		A,
		r,
		n,
		_,
		p,
		g,
		h,
		i,
		j,
		v
	]), Ur(() => {
		var e;
		if (s && n && (e = h.current) != null && (e = e.__options) != null && e.blockPointerEvents && D()) {
			w.current = !0;
			let e = o.floating;
			if (L(o.domReference) && e) {
				var t;
				let n = Ir(o.floating).body;
				n.setAttribute(yi, "");
				let r = o.domReference, i = p == null || (t = p.nodesRef.current.find((e) => e.id === m)) == null || (t = t.context) == null ? void 0 : t.elements.floating;
				return i && (i.style.pointerEvents = ""), n.style.pointerEvents = "none", r.style.pointerEvents = "auto", e.style.pointerEvents = "auto", () => {
					n.style.pointerEvents = "", r.style.pointerEvents = "", e.style.pointerEvents = "";
				};
			}
		}
	}, [
		s,
		n,
		m,
		o,
		p,
		h,
		D
	]), Ur(() => {
		n || (y.current = void 0, E.current = !1, k(), A());
	}, [
		n,
		k,
		A
	]), z.useEffect(() => () => {
		k(), vi(b), vi(S), A();
	}, [
		s,
		o.domReference,
		k,
		A
	]);
	let M = z.useMemo(() => {
		function e(e) {
			y.current = e.pointerType;
		}
		return {
			onPointerDown: e,
			onPointerEnter: e,
			onMouseMove(e) {
				let { nativeEvent: t } = e;
				function i() {
					!C.current && !_.current && r(!0, t, "hover");
				}
				u && !Hr(y.current) || n || xi(v.current) === 0 || E.current && e.movementX ** 2 + e.movementY ** 2 < 2 || (vi(S), y.current === "touch" ? i() : (E.current = !0, S.current = window.setTimeout(i, xi(v.current))));
			}
		};
	}, [
		u,
		r,
		n,
		_,
		v
	]);
	return z.useMemo(() => s ? { reference: M } : {}, [s, M]);
}
var Ci = () => {}, wi = /*#__PURE__*/ z.createContext({
	delay: 0,
	initialDelay: 0,
	timeoutMs: 0,
	currentId: null,
	setCurrentId: Ci,
	setState: Ci,
	isInstantPhase: !1
}), Ti = () => z.useContext(wi);
function Ei(e) {
	let { children: t, delay: n, timeoutMs: r = 0 } = e, [i, a] = z.useReducer((e, t) => ({
		...e,
		...t
	}), {
		delay: n,
		timeoutMs: r,
		initialDelay: n,
		currentId: null,
		isInstantPhase: !1
	}), o = z.useRef(null), s = z.useCallback((e) => {
		a({ currentId: e });
	}, []);
	return Ur(() => {
		i.currentId ? o.current === null ? o.current = i.currentId : i.isInstantPhase || a({ isInstantPhase: !0 }) : (i.isInstantPhase && a({ isInstantPhase: !1 }), o.current = null);
	}, [i.currentId, i.isInstantPhase]), /*#__PURE__*/ G(wi.Provider, {
		value: z.useMemo(() => ({
			...i,
			setState: a,
			setCurrentId: s
		}), [i, s]),
		children: t
	});
}
function Di(e, t) {
	t === void 0 && (t = {});
	let { open: n, onOpenChange: r, floatingId: i } = e, { id: a, enabled: o = !0 } = t, s = a ?? i, c = Ti(), { currentId: l, setCurrentId: u, initialDelay: d, setState: f, timeoutMs: p } = c;
	return Ur(() => {
		o && l && (f({ delay: {
			open: 1,
			close: bi(d, "close")
		} }), l !== s && r(!1));
	}, [
		o,
		s,
		r,
		f,
		l,
		d
	]), Ur(() => {
		function e() {
			r(!1), f({
				delay: d,
				currentId: null
			});
		}
		if (o && l && !n && l === s) {
			if (p) {
				let t = window.setTimeout(e, p);
				return () => {
					clearTimeout(t);
				};
			}
			e();
		}
	}, [
		o,
		n,
		f,
		l,
		s,
		r,
		d,
		p
	]), Ur(() => {
		o && (u === Ci || !n || u(s));
	}, [
		o,
		n,
		u,
		s
	]), c;
}
function Oi(e, t) {
	if (!e || !t) return !1;
	let n = t.getRootNode == null ? void 0 : t.getRootNode();
	if (e.contains(t)) return !0;
	if (n && R(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function ki(e) {
	return "composedPath" in e ? e.composedPath()[0] : e.target;
}
var Ai = {
	pointerdown: "onPointerDown",
	mousedown: "onMouseDown",
	click: "onClick"
}, ji = {
	pointerdown: "onPointerDownCapture",
	mousedown: "onMouseDownCapture",
	click: "onClickCapture"
}, Mi = (e) => ({
	escapeKey: typeof e == "boolean" ? e : e?.escapeKey ?? !1,
	outsidePress: typeof e == "boolean" ? e : e?.outsidePress ?? !0
});
function Ni(e, t) {
	t === void 0 && (t = {});
	let { open: n, onOpenChange: r, elements: i, dataRef: a } = e, { enabled: o = !0, escapeKey: s = !0, outsidePress: c = !0, outsidePressEvent: l = "pointerdown", referencePress: u = !1, referencePressEvent: d = "pointerdown", ancestorScroll: f = !1, bubbles: p, capture: m } = t, h = gi(), g = qr(typeof c == "function" ? c : () => !1), _ = typeof c == "function" ? g : c, v = z.useRef(!1), { escapeKey: y, outsidePress: b } = Mi(p), { escapeKey: x, outsidePress: S } = Mi(m), C = z.useRef(!1), w = qr((e) => {
		if (!n || !o || !s || e.key !== "Escape" || C.current) return;
		let t = a.current.floatingContext?.nodeId, i = h ? Br(h.nodesRef.current, t) : [];
		if (!y && (e.stopPropagation(), i.length > 0)) {
			let e = !0;
			if (i.forEach((t) => {
				var n;
				if ((n = t.context) != null && n.open && !t.context.dataRef.current.__escapeKeyBubbles) {
					e = !1;
					return;
				}
			}), !e) return;
		}
		r(!1, Vr(e) ? e.nativeEvent : e, "escape-key");
	}), T = qr((e) => {
		var t;
		let n = () => {
			var t;
			w(e), (t = Nr(e)) == null || t.removeEventListener("keydown", n);
		};
		(t = Nr(e)) == null || t.addEventListener("keydown", n);
	}), E = qr((e) => {
		let t = a.current.insideReactTree;
		a.current.insideReactTree = !1;
		let n = v.current;
		if (v.current = !1, l === "click" && n || t || typeof _ == "function" && !_(e)) return;
		let o = Nr(e), s = "[" + _i("inert") + "]", c = Ir(i.floating).querySelectorAll(s), u = L(o) ? o : null;
		for (; u && !Oe(u);) {
			let e = nt(u);
			if (Oe(e) || !L(e)) break;
			u = e;
		}
		if (c.length && L(o) && !Fr(o) && !Mr(o, i.floating) && Array.from(c).every((e) => !Mr(u, e))) return;
		if (et(o) && k) {
			let t = Oe(o), n = Re(o), r = /auto|scroll/, i = t || r.test(n.overflowX), a = t || r.test(n.overflowY), s = i && o.clientWidth > 0 && o.scrollWidth > o.clientWidth, c = a && o.clientHeight > 0 && o.scrollHeight > o.clientHeight, l = n.direction === "rtl", u = c && (l ? e.offsetX <= o.offsetWidth - o.clientWidth : e.offsetX > o.clientWidth), d = s && e.offsetY > o.clientHeight;
			if (u || d) return;
		}
		let d = a.current.floatingContext?.nodeId, f = h && Br(h.nodesRef.current, d).some((t) => Pr(e, t.context?.elements.floating));
		if (Pr(e, i.floating) || Pr(e, i.domReference) || f) return;
		let p = h ? Br(h.nodesRef.current, d) : [];
		if (p.length > 0) {
			let e = !0;
			if (p.forEach((t) => {
				var n;
				if ((n = t.context) != null && n.open && !t.context.dataRef.current.__outsidePressBubbles) {
					e = !1;
					return;
				}
			}), !e) return;
		}
		r(!1, e, "outside-press");
	}), D = qr((e) => {
		var t;
		let n = () => {
			var t;
			E(e), (t = Nr(e)) == null || t.removeEventListener(l, n);
		};
		(t = Nr(e)) == null || t.addEventListener(l, n);
	});
	z.useEffect(() => {
		if (!n || !o) return;
		a.current.__escapeKeyBubbles = y, a.current.__outsidePressBubbles = b;
		let e = -1;
		function t(e) {
			r(!1, e, "ancestor-scroll");
		}
		function c() {
			window.clearTimeout(e), C.current = !0;
		}
		function u() {
			e = window.setTimeout(() => {
				C.current = !1;
			}, pe() ? 5 : 0);
		}
		let d = Ir(i.floating);
		s && (d.addEventListener("keydown", x ? T : w, x), d.addEventListener("compositionstart", c), d.addEventListener("compositionend", u)), _ && d.addEventListener(l, S ? D : E, S);
		let p = [];
		return f && (L(i.domReference) && (p = $e(i.domReference)), L(i.floating) && (p = p.concat($e(i.floating))), !L(i.reference) && i.reference && i.reference.contextElement && (p = p.concat($e(i.reference.contextElement)))), p = p.filter((e) => e !== d.defaultView?.visualViewport), p.forEach((e) => {
			e.addEventListener("scroll", t, { passive: !0 });
		}), () => {
			s && (d.removeEventListener("keydown", x ? T : w, x), d.removeEventListener("compositionstart", c), d.removeEventListener("compositionend", u)), _ && d.removeEventListener(l, S ? D : E, S), p.forEach((e) => {
				e.removeEventListener("scroll", t);
			}), window.clearTimeout(e);
		};
	}, [
		a,
		i,
		s,
		_,
		l,
		n,
		r,
		f,
		o,
		y,
		b,
		w,
		x,
		T,
		E,
		S,
		D
	]), z.useEffect(() => {
		a.current.insideReactTree = !1;
	}, [
		a,
		_,
		l
	]);
	let O = z.useMemo(() => ({
		onKeyDown: w,
		...u && {
			[Ai[d]]: (e) => {
				r(!1, e.nativeEvent, "reference-press");
			},
			...d !== "click" && { onClick(e) {
				r(!1, e.nativeEvent, "reference-press");
			} }
		}
	}), [
		w,
		r,
		u,
		d
	]), k = z.useMemo(() => {
		function e(e) {
			e.button === 0 && (v.current = !0);
		}
		return {
			onKeyDown: w,
			onMouseDown: e,
			onMouseUp: e,
			[ji[l]]: () => {
				a.current.insideReactTree = !0;
			}
		};
	}, [
		w,
		l,
		a
	]);
	return z.useMemo(() => o ? {
		reference: O,
		floating: k
	} : {}, [
		o,
		O,
		k
	]);
}
function Pi(e) {
	let { open: t = !1, onOpenChange: n, elements: r } = e, i = li(), a = z.useRef({}), [o] = z.useState(() => fi()), s = hi() != null;
	if (process.env.NODE_ENV !== "production") {
		let e = r.reference;
		e && !L(e) && di("Cannot pass a virtual element to the `elements.reference` option,", "as it must be a real DOM element. Use `refs.setPositionReference()`", "instead.");
	}
	let [c, l] = z.useState(r.reference), u = qr((e, t, r) => {
		a.current.openEvent = e ? t : void 0, o.emit("openchange", {
			open: e,
			event: t,
			reason: r,
			nested: s
		}), n?.(e, t, r);
	}), d = z.useMemo(() => ({ setPositionReference: l }), []), f = z.useMemo(() => ({
		reference: c || r.reference || null,
		floating: r.floating || null,
		domReference: r.reference
	}), [
		c,
		r.reference,
		r.floating
	]);
	return z.useMemo(() => ({
		dataRef: a,
		open: t,
		onOpenChange: u,
		elements: f,
		events: o,
		floatingId: i,
		refs: d
	}), [
		t,
		u,
		f,
		o,
		i,
		d
	]);
}
function Fi(e) {
	e === void 0 && (e = {});
	let { nodeId: t } = e, n = Pi({
		...e,
		elements: {
			reference: null,
			floating: null,
			...e.elements
		}
	}), r = e.rootContext || n, i = r.elements, [a, o] = z.useState(null), [s, c] = z.useState(null), l = i?.domReference || a, u = z.useRef(null), d = gi();
	Ur(() => {
		l && (u.current = l);
	}, [l]);
	let f = Qe({
		...e,
		elements: {
			...i,
			...s && { reference: s }
		}
	}), p = z.useCallback((e) => {
		let t = L(e) ? {
			getBoundingClientRect: () => e.getBoundingClientRect(),
			getClientRects: () => e.getClientRects(),
			contextElement: e
		} : e;
		c(t), f.refs.setReference(t);
	}, [f.refs]), m = z.useCallback((e) => {
		(L(e) || e === null) && (u.current = e, o(e)), (L(f.refs.reference.current) || f.refs.reference.current === null || e !== null && !L(e)) && f.refs.setReference(e);
	}, [f.refs]), h = z.useMemo(() => ({
		...f.refs,
		setReference: m,
		setPositionReference: p,
		domReference: u
	}), [
		f.refs,
		m,
		p
	]), g = z.useMemo(() => ({
		...f.elements,
		domReference: l
	}), [f.elements, l]), _ = z.useMemo(() => ({
		...f,
		...r,
		refs: h,
		elements: g,
		nodeId: t
	}), [
		f,
		h,
		g,
		t,
		r
	]);
	return Ur(() => {
		r.dataRef.current.floatingContext = _;
		let e = d?.nodesRef.current.find((e) => e.id === t);
		e && (e.context = _);
	}), z.useMemo(() => ({
		...f,
		context: _,
		refs: h,
		elements: g
	}), [
		f,
		h,
		g,
		_
	]);
}
function Ii() {
	return Dr() && Er();
}
function Li(e, t) {
	t === void 0 && (t = {});
	let { open: n, onOpenChange: r, events: i, dataRef: a, elements: o } = e, { enabled: s = !0, visibleOnly: c = !0 } = t, l = z.useRef(!1), u = z.useRef(-1), d = z.useRef(!0);
	z.useEffect(() => {
		if (!s) return;
		let e = Fe(o.domReference);
		function t() {
			!n && et(o.domReference) && o.domReference === jr(Ir(o.domReference)) && (l.current = !0);
		}
		function r() {
			d.current = !0;
		}
		function i() {
			d.current = !1;
		}
		return e.addEventListener("blur", t), Ii() && (e.addEventListener("keydown", r, !0), e.addEventListener("pointerdown", i, !0)), () => {
			e.removeEventListener("blur", t), Ii() && (e.removeEventListener("keydown", r, !0), e.removeEventListener("pointerdown", i, !0));
		};
	}, [
		o.domReference,
		n,
		s
	]), z.useEffect(() => {
		if (!s) return;
		function e(e) {
			let { reason: t } = e;
			(t === "reference-press" || t === "escape-key") && (l.current = !0);
		}
		return i.on("openchange", e), () => {
			i.off("openchange", e);
		};
	}, [i, s]), z.useEffect(() => () => {
		vi(u);
	}, []);
	let f = z.useMemo(() => ({
		onMouseLeave() {
			l.current = !1;
		},
		onFocus(e) {
			if (l.current) return;
			let t = Nr(e.nativeEvent);
			if (c && L(t)) {
				if (Ii() && !e.relatedTarget) {
					if (!d.current && !Lr(t)) return;
				} else if (!Rr(t)) return;
			}
			r(!0, e.nativeEvent, "focus");
		},
		onBlur(e) {
			l.current = !1;
			let t = e.relatedTarget, n = e.nativeEvent, i = L(t) && t.hasAttribute(_i("focus-guard")) && t.getAttribute("data-type") === "outside";
			u.current = window.setTimeout(() => {
				let e = jr(o.domReference ? o.domReference.ownerDocument : document);
				!t && e === o.domReference || Mr(a.current.floatingContext?.refs.floating.current, e) || Mr(o.domReference, e) || i || r(!1, n, "focus");
			});
		}
	}), [
		a,
		o.domReference,
		r,
		c
	]);
	return z.useMemo(() => s ? { reference: f } : {}, [s, f]);
}
function Ri(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = n === "item", a = e;
	if (i && e) {
		let { [Xr]: t, [Zr]: n, ...r } = e;
		a = r;
	}
	return {
		...n === "floating" && {
			tabIndex: -1,
			[Yr]: ""
		},
		...a,
		...t.map((t) => {
			let r = t ? t[n] : null;
			return typeof r == "function" ? e ? r(e) : null : r;
		}).concat(e).reduce((e, t) => (t && Object.entries(t).forEach((t) => {
			let [n, a] = t;
			if (!(i && [Xr, Zr].includes(n))) if (n.indexOf("on") === 0) {
				if (r.has(n) || r.set(n, []), typeof a == "function") {
					var o;
					(o = r.get(n)) == null || o.push(a), e[n] = function() {
						var e = [...arguments];
						return r.get(n)?.map((t) => t(...e)).find((e) => e !== void 0);
					};
				}
			} else e[n] = a;
		}), e), {})
	};
}
function zi(e) {
	e === void 0 && (e = []);
	let t = e.map((e) => e?.reference), n = e.map((e) => e?.floating), r = e.map((e) => e?.item), i = z.useCallback((t) => Ri(t, e, "reference"), t), a = z.useCallback((t) => Ri(t, e, "floating"), n), o = z.useCallback((t) => Ri(t, e, "item"), r);
	return z.useMemo(() => ({
		getReferenceProps: i,
		getFloatingProps: a,
		getItemProps: o
	}), [
		i,
		a,
		o
	]);
}
var Bi = /*#__PURE__*/ new Map([
	["select", "listbox"],
	["combobox", "listbox"],
	["label", !1]
]);
function Vi(e, t) {
	t === void 0 && (t = {});
	let { open: n, elements: r, floatingId: i } = e, { enabled: a = !0, role: o = "dialog" } = t, s = li(), c = r.domReference?.id || s, l = z.useMemo(() => zr(r.floating)?.id || i, [r.floating, i]), u = Bi.get(o) ?? o, d = hi() != null, f = z.useMemo(() => u === "tooltip" || o === "label" ? { ["aria-" + (o === "label" ? "labelledby" : "describedby")]: n ? l : void 0 } : {
		"aria-expanded": n ? "true" : "false",
		"aria-haspopup": u === "alertdialog" ? "dialog" : u,
		"aria-controls": n ? l : void 0,
		...u === "listbox" && { role: "combobox" },
		...u === "menu" && { id: c },
		...u === "menu" && d && { role: "menuitem" },
		...o === "select" && { "aria-autocomplete": "none" },
		...o === "combobox" && { "aria-autocomplete": "list" }
	}, [
		u,
		l,
		d,
		n,
		c,
		o
	]), p = z.useMemo(() => {
		let e = {
			id: l,
			...u && { role: u }
		};
		return u === "tooltip" || o === "label" ? e : {
			...e,
			...u === "menu" && { "aria-labelledby": c }
		};
	}, [
		u,
		l,
		c,
		o
	]), m = z.useCallback((e) => {
		let { active: t, selected: n } = e, r = {
			role: "option",
			...t && { id: l + "-fui-option" }
		};
		switch (o) {
			case "select":
			case "combobox": return {
				...r,
				"aria-selected": n
			};
		}
		return {};
	}, [l, o]);
	return z.useMemo(() => a ? {
		reference: f,
		floating: p,
		item: m
	} : {}, [
		a,
		f,
		p,
		m
	]);
}
function Hi(e, t, n) {
	return n === void 0 && (n = !0), e.filter((e) => e.parentId === t && (!n || e.context?.open)).flatMap((t) => [t, ...Hi(e, t.id, n)]);
}
function Ui(e, t) {
	let [n, r] = e, i = !1, a = t.length;
	for (let e = 0, o = a - 1; e < a; o = e++) {
		let [a, s] = t[e] || [0, 0], [c, l] = t[o] || [0, 0];
		s >= r != l >= r && n <= (c - a) * (r - s) / (l - s) + a && (i = !i);
	}
	return i;
}
function Wi(e, t) {
	return e[0] >= t.x && e[0] <= t.x + t.width && e[1] >= t.y && e[1] <= t.y + t.height;
}
function Gi(e) {
	e === void 0 && (e = {});
	let { buffer: t = .5, blockPointerEvents: n = !1, requireIntent: r = !0 } = e, i = { current: -1 }, a = !1, o = null, s = null, c = typeof performance < "u" ? performance.now() : 0;
	function l(e, t) {
		let n = performance.now(), r = n - c;
		if (o === null || s === null || r === 0) return o = e, s = t, c = n, null;
		let i = e - o, a = t - s, l = Math.sqrt(i * i + a * a) / r;
		return o = e, s = t, c = n, l;
	}
	let u = (e) => {
		let { x: n, y: o, placement: s, elements: c, onClose: u, nodeId: d, tree: f } = e;
		return function(e) {
			function p() {
				vi(i), u();
			}
			if (vi(i), !c.domReference || !c.floating || s == null || n == null || o == null) return;
			let { clientX: m, clientY: h } = e, g = [m, h], _ = ki(e), v = e.type === "mouseleave", y = Oi(c.floating, _), b = Oi(c.domReference, _), x = c.domReference.getBoundingClientRect(), S = c.floating.getBoundingClientRect(), C = s.split("-")[0], w = n > S.right - S.width / 2, T = o > S.bottom - S.height / 2, E = Wi(g, x), D = S.width > x.width, O = S.height > x.height, k = (D ? x : S).left, A = (D ? x : S).right, j = (O ? x : S).top, M = (O ? x : S).bottom;
			if (y && (a = !0, !v)) return;
			if (b && (a = !1), b && !v) {
				a = !0;
				return;
			}
			if (v && L(e.relatedTarget) && Oi(c.floating, e.relatedTarget) || f && Hi(f.nodesRef.current, d).length) return;
			if (C === "top" && o >= x.bottom - 1 || C === "bottom" && o <= x.top + 1 || C === "left" && n >= x.right - 1 || C === "right" && n <= x.left + 1) return p();
			let N = [];
			switch (C) {
				case "top":
					N = [
						[k, x.top + 1],
						[k, S.bottom - 1],
						[A, S.bottom - 1],
						[A, x.top + 1]
					];
					break;
				case "bottom":
					N = [
						[k, S.top + 1],
						[k, x.bottom - 1],
						[A, x.bottom - 1],
						[A, S.top + 1]
					];
					break;
				case "left":
					N = [
						[S.right - 1, M],
						[S.right - 1, j],
						[x.left + 1, j],
						[x.left + 1, M]
					];
					break;
				case "right":
					N = [
						[x.right - 1, M],
						[x.right - 1, j],
						[S.left + 1, j],
						[S.left + 1, M]
					];
					break;
			}
			function P(e) {
				let [n, r] = e;
				switch (C) {
					case "top": return [
						[D ? n + t / 2 : w ? n + t * 4 : n - t * 4, r + t + 1],
						[D ? n - t / 2 : w ? n + t * 4 : n - t * 4, r + t + 1],
						[S.left, w || D ? S.bottom - t : S.top],
						[S.right, w ? D ? S.bottom - t : S.top : S.bottom - t]
					];
					case "bottom": return [
						[D ? n + t / 2 : w ? n + t * 4 : n - t * 4, r - t],
						[D ? n - t / 2 : w ? n + t * 4 : n - t * 4, r - t],
						[S.left, w || D ? S.top + t : S.bottom],
						[S.right, w ? D ? S.top + t : S.bottom : S.top + t]
					];
					case "left": {
						let e = [n + t + 1, O ? r + t / 2 : T ? r + t * 4 : r - t * 4], i = [n + t + 1, O ? r - t / 2 : T ? r + t * 4 : r - t * 4];
						return [
							[T || O ? S.right - t : S.left, S.top],
							[T ? O ? S.right - t : S.left : S.right - t, S.bottom],
							e,
							i
						];
					}
					case "right": return [
						[n - t, O ? r + t / 2 : T ? r + t * 4 : r - t * 4],
						[n - t, O ? r - t / 2 : T ? r + t * 4 : r - t * 4],
						[T || O ? S.left + t : S.right, S.top],
						[T ? O ? S.left + t : S.right : S.left + t, S.bottom]
					];
				}
			}
			if (!Ui([m, h], N)) {
				if (a && !E) return p();
				if (!v && r) {
					let t = l(e.clientX, e.clientY);
					if (t !== null && t < .1) return p();
				}
				Ui([m, h], P([n, o])) ? !a && r && (i.current = window.setTimeout(p, 40)) : p();
			}
		};
	};
	return u.__options = { blockPointerEvents: n }, u;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/ScrollArea/ScrollArea.mjs
var Ki = {
	scrollHideDelay: 1e3,
	type: "hover",
	scrollbars: "xy"
}, qi = I((e, { scrollbarSize: t, overscrollBehavior: n, scrollbars: r }) => {
	let i = n;
	return n && r && (r === "x" ? i = `${n} auto` : r === "y" && (i = `auto ${n}`)), { root: {
		"--scrollarea-scrollbar-size": D(t),
		"--scrollarea-over-scroll-behavior": i
	} };
}), Ji = c((e) => {
	let t = C("ScrollArea", Ki, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, scrollbarSize: s, vars: c, type: l, scrollHideDelay: u, viewportProps: d, viewportRef: f, onScrollPositionChange: p, children: m, offsetScrollbars: h, scrollbars: g, onBottomReached: _, onTopReached: v, onLeftReached: y, onRightReached: b, overscrollBehavior: x, startScrollPosition: w, attributes: T, ...E } = t, [D, O] = U(!1), [k, A] = U(!1), [j, M] = U(!1), N = H(!0), P = H(!1), ee = H(!0), te = H(!1), ne = S({
		name: "ScrollArea",
		props: t,
		classes: Cr,
		className: r,
		style: i,
		classNames: n,
		styles: a,
		unstyled: o,
		attributes: T,
		vars: c,
		varsResolver: qi
	}), F = H(null), [re, ie] = U(null), ae = Jr([
		f,
		F,
		B((e) => {
			ie((t) => t === e ? t : e);
		}, [])
	]);
	return Yn(h === "present" ? re : null, () => {
		let e = F.current;
		e && (A(e.scrollHeight > e.clientHeight), M(e.scrollWidth > e.clientWidth));
	}), oe(() => {
		w && F.current && F.current.scrollTo({
			left: w.x ?? 0,
			top: w.y ?? 0
		});
	}, []), /* @__PURE__ */ K($n, {
		getStyles: ne,
		type: l === "never" ? "always" : l,
		scrollHideDelay: u,
		scrollbars: g,
		...ne("root"),
		...E,
		children: [
			/* @__PURE__ */ G(Sr, {
				...d,
				...ne("viewport", { style: d?.style }),
				ref: ae,
				"data-offset-scrollbars": h === !0 ? "xy" : h || void 0,
				"data-scrollbars": g || void 0,
				"data-horizontal-hidden": h === "present" && !j ? "true" : void 0,
				"data-vertical-hidden": h === "present" && !k ? "true" : void 0,
				onScroll: (e) => {
					d?.onScroll?.(e), p?.({
						x: e.currentTarget.scrollLeft,
						y: e.currentTarget.scrollTop
					});
					let { scrollTop: t, scrollHeight: n, clientHeight: r, scrollLeft: i, scrollWidth: a, clientWidth: o } = e.currentTarget, s = t - (n - r) >= -.8, c = t === 0;
					s && !P.current && _?.(), c && !N.current && v?.(), P.current = s, N.current = c;
					let l = i - (a - o) >= -.8, u = i === 0;
					l && !te.current && b?.(), u && !ee.current && y?.(), te.current = l, ee.current = u;
				},
				children: m
			}),
			(g === "xy" || g === "x") && /* @__PURE__ */ G(vr, {
				...ne("scrollbar"),
				orientation: "horizontal",
				"data-hidden": l === "never" || h === "present" && !j ? !0 : void 0,
				forceMount: !0,
				onMouseEnter: () => O(!0),
				onMouseLeave: () => O(!1),
				children: /* @__PURE__ */ G(xr, { ...ne("thumb") })
			}),
			(g === "xy" || g === "y") && /* @__PURE__ */ G(vr, {
				...ne("scrollbar"),
				orientation: "vertical",
				"data-hidden": l === "never" || h === "present" && !k ? !0 : void 0,
				forceMount: !0,
				onMouseEnter: () => O(!0),
				onMouseLeave: () => O(!1),
				children: /* @__PURE__ */ G(xr, { ...ne("thumb") })
			}),
			/* @__PURE__ */ G(Zn, {
				...ne("corner"),
				"data-hovered": D || void 0,
				"data-hidden": l === "never" || void 0
			})
		]
	});
});
Ji.displayName = "@mantine/core/ScrollArea";
var Yi = c((e) => {
	let { children: t, classNames: n, styles: r, scrollbarSize: i, scrollHideDelay: a, type: o, dir: s, offsetScrollbars: c, overscrollBehavior: l, viewportRef: u, onScrollPositionChange: d, unstyled: f, variant: p, viewportProps: m, scrollbars: h, style: g, vars: v, onBottomReached: y, onTopReached: b, startScrollPosition: x, onOverflowChange: S, ...w } = C("ScrollAreaAutosize", Ki, e), T = H(null), [E, D] = U(null), O = Jr([
		u,
		T,
		B((e) => {
			D((t) => t === e ? t : e);
		}, [])
	]), k = H(!1), A = H(!1), j = pt(() => {
		let e = T.current;
		if (!e || !S) return;
		let t = e.scrollHeight > e.clientHeight;
		t !== k.current && (A.current ? S(t) : (A.current = !0, t && S(!0)), k.current = t);
	});
	return Yn(S ? E : null, j), /* @__PURE__ */ G(_, {
		...w,
		variant: p,
		style: [{
			display: "flex",
			overflow: "hidden"
		}, g],
		children: /* @__PURE__ */ G(_, {
			style: {
				display: "flex",
				flexDirection: "column",
				flex: 1,
				overflow: "hidden",
				...h === "y" && { minWidth: 0 },
				...h === "x" && { minHeight: 0 },
				...h === "xy" && {
					minWidth: 0,
					minHeight: 0
				},
				...h === !1 && {
					minWidth: 0,
					minHeight: 0
				}
			},
			children: /* @__PURE__ */ G(Ji, {
				classNames: n,
				styles: r,
				scrollHideDelay: a,
				scrollbarSize: i,
				type: o,
				dir: s,
				offsetScrollbars: c,
				overscrollBehavior: l,
				viewportRef: O,
				onScrollPositionChange: d,
				unstyled: f,
				variant: p,
				viewportProps: m,
				vars: v,
				scrollbars: h,
				onBottomReached: y,
				onTopReached: b,
				startScrollPosition: x,
				"data-autosize": "true",
				children: t
			})
		})
	});
});
Ji.classes = Cr, Ji.varsResolver = qi, Yi.displayName = "@mantine/core/ScrollAreaAutosize", Yi.classes = Cr, Ji.Autosize = Yi;
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/VisuallyHidden/VisuallyHidden.module.mjs
var Xi = { root: "m_515a97f8" }, Zi = c((e) => {
	let t = C("VisuallyHidden", null, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, vars: s, attributes: c, ...l } = t;
	return /* @__PURE__ */ G(_, {
		component: "span",
		...S({
			name: "VisuallyHidden",
			classes: Xi,
			props: t,
			className: r,
			style: i,
			classNames: n,
			styles: a,
			unstyled: o,
			attributes: c
		})("root"),
		...l
	});
});
Zi.classes = Xi, Zi.displayName = "@mantine/core/VisuallyHidden";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/utils/Floating/FloatingArrow/get-arrow-position-styles.mjs
function Qi(e, t, n, r) {
	return e === "center" || r === "center" ? { top: t } : e === "end" ? { bottom: n } : e === "start" ? { top: n } : {};
}
function $i(e, t, n, r, i) {
	return e === "center" || r === "center" ? { left: t } : e === "end" ? { [i === "ltr" ? "right" : "left"]: n } : e === "start" ? { [i === "ltr" ? "left" : "right"]: n } : {};
}
var ea = {
	bottom: "borderTopLeftRadius",
	left: "borderTopRightRadius",
	right: "borderBottomLeftRadius",
	top: "borderBottomRightRadius"
};
function ta({ position: e, arrowSize: t, dir: n }) {
	let [r, i] = e.split("-");
	if (!i) return;
	let a = {
		width: t,
		height: t,
		position: "absolute"
	};
	if (r === "bottom") {
		let e = i === "start", r = e ? n === "ltr" ? "left" : "right" : n === "ltr" ? "right" : "left";
		return {
			...a,
			top: -t,
			[r]: 0,
			clipPath: e === (n === "rtl") ? "polygon(100% 0%, 0% 100%, 100% 100%)" : "polygon(0% 0%, 0% 100%, 100% 100%)"
		};
	}
	if (r === "top") {
		let e = i === "start", r = e ? n === "ltr" ? "left" : "right" : n === "ltr" ? "right" : "left";
		return {
			...a,
			bottom: -t,
			[r]: 0,
			clipPath: e === (n === "rtl") ? "polygon(0% 0%, 100% 0%, 100% 100%)" : "polygon(0% 0%, 100% 0%, 0% 100%)"
		};
	}
	if (r === "left") return {
		...a,
		right: -t,
		[i === "start" ? "top" : "bottom"]: 0,
		clipPath: i === "start" ? "polygon(0% 0%, 100% 0%, 0% 100%)" : "polygon(0% 0%, 0% 100%, 100% 100%)"
	};
	if (r === "right") return {
		...a,
		left: -t,
		[i === "start" ? "top" : "bottom"]: 0,
		clipPath: i === "start" ? "polygon(0% 0%, 100% 0%, 100% 100%)" : "polygon(100% 0%, 0% 100%, 100% 100%)"
	};
}
function na({ position: e, arrowSize: t, arrowOffset: n, arrowRadius: r, arrowPosition: i, arrowX: a, arrowY: o, dir: s }) {
	if (i === "merge") {
		let n = ta({
			position: e,
			arrowSize: t,
			dir: s
		});
		if (n) return n;
	}
	let [c, l = "center"] = e.split("-"), u = {
		width: t,
		height: t,
		transform: "rotate(45deg)",
		position: "absolute",
		[ea[c]]: r
	}, d = -t / 2;
	return c === "left" ? {
		...u,
		...Qi(l, o, n, i),
		right: d,
		borderLeftColor: "transparent",
		borderBottomColor: "transparent",
		clipPath: "polygon(100% 0, 0 0, 100% 100%)"
	} : c === "right" ? {
		...u,
		...Qi(l, o, n, i),
		left: d,
		borderRightColor: "transparent",
		borderTopColor: "transparent",
		clipPath: "polygon(0 100%, 0 0, 100% 100%)"
	} : c === "top" ? {
		...u,
		...$i(l, a, n, i, s),
		bottom: d,
		borderTopColor: "transparent",
		borderLeftColor: "transparent",
		clipPath: "polygon(0 100%, 100% 100%, 100% 0)"
	} : c === "bottom" ? {
		...u,
		...$i(l, a, n, i, s),
		top: d,
		borderBottomColor: "transparent",
		borderRightColor: "transparent",
		clipPath: "polygon(0 100%, 0 0, 100% 0)"
	} : {};
}
function ra({ position: e, dir: t }) {
	let [n, r] = e.split("-");
	if (!r) return;
	let i = r === "start" && t === "ltr" || r === "end" && t === "rtl";
	if (n === "bottom") return i ? { borderTopLeftRadius: 0 } : { borderTopRightRadius: 0 };
	if (n === "top") return i ? { borderBottomLeftRadius: 0 } : { borderBottomRightRadius: 0 };
	if (n === "left") return r === "start" ? { borderTopRightRadius: 0 } : { borderBottomRightRadius: 0 };
	if (n === "right") return r === "start" ? { borderTopLeftRadius: 0 } : { borderBottomLeftRadius: 0 };
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/utils/Floating/FloatingArrow/FloatingArrow.mjs
function ia({ position: e, arrowSize: t, arrowOffset: n, arrowRadius: r, arrowPosition: i, visible: a, arrowX: o, arrowY: s, style: c, ...l }) {
	let { dir: u } = Kn();
	return a ? /* @__PURE__ */ G("div", {
		...l,
		style: {
			...c,
			...na({
				position: e,
				arrowSize: t,
				arrowOffset: n,
				arrowRadius: r,
				arrowPosition: i,
				dir: u,
				arrowX: o,
				arrowY: s
			})
		}
	}) : null;
}
ia.displayName = "@mantine/core/FloatingArrow";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/utils/Floating/get-floating-position/get-floating-position.mjs
function aa(e, t) {
	if (e === "rtl" && (t.includes("right") || t.includes("left"))) {
		let [e, n] = t.split("-"), r = e === "right" ? "left" : "right";
		return n === void 0 ? r : `${r}-${n}`;
	}
	return t;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/utils/Floating/use-delayed-hover.mjs
function oa({ open: e, close: t, openDelay: n, closeDelay: r }) {
	let i = H(-1), a = H(-1), o = () => {
		window.clearTimeout(i.current), window.clearTimeout(a.current);
	};
	return V(() => o, []), {
		openDropdown: () => {
			o(), n === 0 || n === void 0 ? e() : i.current = window.setTimeout(e, n);
		},
		closeDropdown: () => {
			o(), r === 0 || r === void 0 ? t() : a.current = window.setTimeout(t, r);
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Overlay/Overlay.module.mjs
var sa = { root: "m_9814e45f" }, ca = { zIndex: dn("modal") }, la = I((e, { gradient: t, color: n, backgroundOpacity: r, blur: i, radius: a, zIndex: o }) => ({ root: {
	"--overlay-bg": t || (n !== void 0 || r !== void 0) && T(n || "#000", r ?? .6) || void 0,
	"--overlay-filter": i ? `blur(${D(i)})` : void 0,
	"--overlay-radius": a === void 0 ? void 0 : ce(a),
	"--overlay-z-index": o?.toString()
} })), ua = a((e) => {
	let t = C("Overlay", ca, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, vars: s, fixed: c, center: l, children: u, radius: d, zIndex: f, gradient: p, blur: m, color: h, backgroundOpacity: g, mod: v, attributes: y, ...b } = t;
	return /* @__PURE__ */ G(_, {
		...S({
			name: "Overlay",
			props: t,
			classes: sa,
			className: r,
			style: i,
			classNames: n,
			styles: a,
			unstyled: o,
			attributes: y,
			vars: s,
			varsResolver: la
		})("root"),
		mod: [{
			center: l,
			fixed: c
		}, v],
		...b,
		children: u
	});
});
ua.classes = sa, ua.varsResolver = la, ua.displayName = "@mantine/core/Overlay";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Portal/Portal.mjs
function da(e) {
	let t = document.createElement("div");
	return t.setAttribute("data-portal", "true"), typeof e.className == "string" && t.classList.add(...e.className.split(" ").filter(Boolean)), typeof e.style == "object" && Object.assign(t.style, e.style), typeof e.id == "string" && t.setAttribute("id", e.id), t;
}
function fa({ target: e, reuseTargetNode: t, ...n }) {
	if (e) return typeof e == "string" ? document.querySelector(e) || da(n) : e;
	if (t) {
		let e = document.querySelector("[data-mantine-shared-portal-node]");
		if (e) return e;
		let t = da(n);
		return t.setAttribute("data-mantine-shared-portal-node", "true"), document.body.appendChild(t), t;
	}
	return da(n);
}
var pa = { reuseTargetNode: !0 }, ma = c((e) => {
	let { children: t, target: n, reuseTargetNode: r, ref: i, ...a } = C("Portal", pa, e), [o, s] = U(!1), c = H(null);
	return oe(() => (s(!0), c.current = fa({
		target: n,
		reuseTargetNode: r,
		...a
	}), An(i, c.current), !n && !r && c.current && document.body.appendChild(c.current), () => {
		!n && !r && c.current && document.body.removeChild(c.current);
	}), [n]), !o || !c.current ? null : _t(/* @__PURE__ */ G(W, { children: t }), c.current);
});
ma.displayName = "@mantine/core/Portal";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Portal/OptionalPortal.mjs
var ha = c(({ withinPortal: e = !0, children: t, ...n }) => rt() === "test" || !e ? /* @__PURE__ */ G(W, { children: t }) : /* @__PURE__ */ G(ma, {
	...n,
	children: t
}));
ha.displayName = "@mantine/core/OptionalPortal";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Transition/get-transition-props/get-transition-props.mjs
var ga = {
	duration: 100,
	transition: "fade"
};
function _a(e, t) {
	return {
		...ga,
		...t,
		...e
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Popover/Popover.context.mjs
var [va, ya] = F("Popover component was not found in the tree");
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/utils/Floating/use-context-menu-handlers.mjs
function ba({ childProps: e, disabled: t, opened: n, longPressDelay: r = 500, setReference: i, open: a }) {
	let o = H(!1), s = H(!1), c = H(null), l = H(t);
	l.current = t;
	let u = (e, t, n) => {
		i({
			getBoundingClientRect: () => ({
				x: e,
				y: t,
				width: 0,
				height: 0,
				top: t,
				left: e,
				right: e,
				bottom: t,
				toJSON: () => void 0
			}),
			contextElement: n
		}), a();
	}, d = q(e.onMouseDown, (e) => {
		t || e.button === 2 && e.stopPropagation();
	}), f = q(e.onContextMenu, (e) => {
		t || e.defaultPrevented || (e.preventDefault(), !s.current && (u(e.clientX, e.clientY, e.currentTarget), o.current && (s.current = !0)));
	}), p = In((e) => {
		if (l.current || s.current) return;
		let t = e, n = t.touches[0] ?? t.changedTouches[0];
		n && (u(n.clientX, n.clientY, c.current), s.current = !0);
	}, {
		threshold: r,
		events: ["touch"],
		cancelOnMove: !0,
		onStart: (e) => {
			o.current = !0, s.current = !1, c.current = e.currentTarget;
		},
		onFinish: (e) => {
			o.current = !1, s.current = !1, l.current || e.preventDefault();
		},
		onCancel: () => {
			o.current = !1, s.current = !1;
		}
	});
	return {
		onContextMenu: f,
		onMouseDown: d,
		onTouchStart: q(e.onTouchStart, p.onTouchStart),
		onTouchEnd: q(e.onTouchEnd, p.onTouchEnd),
		onTouchCancel: q(e.onTouchCancel, p.onTouchCancel),
		onTouchMove: q(e.onTouchMove, p.onTouchMove),
		style: t ? e.style : {
			...e.style,
			WebkitTouchCallout: "none",
			WebkitUserSelect: "none",
			userSelect: "none"
		},
		"data-expanded": n ? !0 : void 0
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Popover/PopoverContextMenu/PopoverContextMenu.mjs
function xa(e) {
	let { children: t, disabled: n, longPressDelay: r } = C("PopoverContextMenu", null, e), i = Hn(t);
	if (!i) throw Error("Popover.ContextMenu component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");
	let a = ya();
	return lt(i, ba({
		childProps: i.props,
		disabled: n || a.disabled,
		opened: a.opened,
		longPressDelay: r,
		setReference: a.reference,
		open: () => {
			a.opened || a.onToggle();
		}
	}));
}
xa.displayName = "@mantine/core/PopoverContextMenu";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/FocusTrap/FocusTrap.mjs
function Sa({ children: e, active: t = !0, refProp: n = "ref", innerRef: r }) {
	let i = Mn(On(t), r), a = Hn(e);
	return a ? lt(a, { [n]: i }) : e;
}
function Ca(e) {
	return /* @__PURE__ */ G(Zi, {
		tabIndex: -1,
		"data-autofocus": !0,
		...e
	});
}
Sa.displayName = "@mantine/core/FocusTrap", Ca.displayName = "@mantine/core/FocusTrapInitialFocus", Sa.InitialFocus = Ca;
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Popover/Popover.module.mjs
var wa = {
	dropdown: "m_38a85659",
	arrow: "m_a31dc6c1",
	overlay: "m_3d7bc908"
}, Ta = c((e) => {
	let t = C("PopoverDropdown", null, e), { className: n, style: r, vars: i, children: a, onKeyDownCapture: o, variant: s, classNames: c, styles: l, ref: u, ...d } = t, f = ya(), { dir: p } = Kn(), m = f.arrowPosition === "merge" && f.withArrow ? ra({
		position: f.placement,
		dir: p
	}) : void 0, h = vn({
		opened: f.opened,
		shouldReturnFocus: f.returnFocus
	}), g = f.withRoles ? {
		"aria-labelledby": f.getTargetId(),
		id: f.getDropdownId(),
		role: "dialog",
		tabIndex: -1
	} : {}, v = Mn(u, f.floating);
	return f.disabled ? null : /* @__PURE__ */ G(ha, {
		...f.portalProps,
		withinPortal: f.withinPortal,
		children: /* @__PURE__ */ G(N, {
			mounted: f.opened,
			...f.transitionProps,
			transition: f.transitionProps?.transition || "fade",
			duration: f.transitionProps?.duration ?? 150,
			keepMounted: f.keepMounted,
			keepMountedMode: f.keepMountedMode,
			exitDuration: typeof f.transitionProps?.exitDuration == "number" ? f.transitionProps.exitDuration : f.transitionProps?.duration,
			children: (e) => /* @__PURE__ */ G(Sa, {
				active: f.trapFocus && f.opened,
				innerRef: v,
				children: /* @__PURE__ */ K(_, {
					...g,
					...d,
					variant: s,
					onKeyDownCapture: fn(() => {
						f.onClose?.(), f.onDismiss?.();
					}, {
						active: f.closeOnEscape,
						onTrigger: h,
						onKeyDown: o
					}),
					"data-position": f.placement,
					"data-fixed": f.floatingStrategy === "fixed" || void 0,
					...f.getStyles("dropdown", {
						className: n,
						props: t,
						classNames: c,
						styles: l,
						style: [
							{
								...e,
								...m,
								zIndex: f.zIndex,
								top: f.y ?? 0,
								left: f.x ?? 0,
								width: f.width === "target" ? void 0 : D(f.width),
								...f.referenceHidden ? { display: "none" } : null
							},
							f.resolvedStyles?.dropdown,
							l?.dropdown,
							r
						]
					}),
					children: [a, /* @__PURE__ */ G(ia, {
						ref: f.arrowRef,
						arrowX: f.arrowX,
						arrowY: f.arrowY,
						visible: f.withArrow,
						position: f.placement,
						arrowSize: f.arrowSize,
						arrowRadius: f.arrowRadius,
						arrowOffset: f.arrowOffset,
						arrowPosition: f.arrowPosition,
						...f.getStyles("arrow", {
							props: t,
							classNames: c,
							styles: l
						})
					})]
				})
			})
		})
	});
});
Ta.classes = wa, Ta.displayName = "@mantine/core/PopoverDropdown";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Popover/PopoverTarget/PopoverTarget.mjs
var Ea = {
	refProp: "ref",
	popupType: "dialog"
}, Da = c((e) => {
	let { children: t, refProp: n, popupType: r, ref: i, ...a } = C("PopoverTarget", Ea, e), o = Hn(t);
	if (!o) throw Error("Popover.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");
	let s = a, c = ya(), l = Mn(c.reference, Vn(o), i), u = c.withRoles ? {
		"aria-haspopup": r,
		"aria-expanded": c.opened,
		"aria-controls": c.opened ? c.getDropdownId() : void 0,
		id: c.getTargetId()
	} : {}, d = o.props;
	return lt(o, {
		...s,
		...u,
		...c.targetProps,
		className: re(c.targetProps.className, s.className, d.className),
		[n]: l,
		...c.controlled ? null : { onClick: (e) => {
			c.onToggle(), d.onClick?.(e);
		} }
	});
});
Da.displayName = "@mantine/core/PopoverTarget";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Popover/use-popover.mjs
function Oa(e) {
	if (e === void 0) return {
		shift: !0,
		flip: !0
	};
	let t = { ...e };
	return e.shift === void 0 && (t.shift = !0), e.flip === void 0 && (t.flip = !0), t;
}
function ka(e, t, n, r) {
	let i = Oa(e.middlewares), a = [Ze(e.offset), Ve()];
	if (i.flip && !n) {
		let e = typeof i.flip == "boolean" ? {} : i.flip, t = r ? {
			fallbackStrategy: "initialPlacement",
			...e
		} : e;
		a.push(Xe(t));
	}
	if (i.shift) {
		let t = typeof i.shift == "boolean" ? {} : i.shift;
		a.push(Ie((n) => {
			let r = n.placement.startsWith("top") || n.placement.startsWith("bottom");
			return {
				limiter: qe(),
				padding: 5,
				...e.width === "target" && r ? { mainAxis: !1 } : null,
				...t
			};
		}));
	}
	return i.inline && a.push(typeof i.inline == "boolean" ? Pe() : Pe(i.inline)), a.push(Ke({
		element: e.arrowRef,
		padding: e.arrowOffset
	})), (i.size || e.width === "target") && a.push(We({
		...typeof i.size == "boolean" ? {} : i.size,
		apply({ rects: n, availableWidth: r, availableHeight: a, ...o }) {
			let s = t().refs.floating.current?.style ?? {};
			i.size && (typeof i.size == "object" && i.size.apply ? i.size.apply({
				rects: n,
				availableWidth: r,
				availableHeight: a,
				...o
			}) : Object.assign(s, {
				maxWidth: `${r}px`,
				maxHeight: `${a}px`
			})), e.width === "target" && Object.assign(s, { width: `${n.reference.width}px` });
		}
	})), a;
}
function Aa(e) {
	let [t, n] = Nn({
		value: e.opened,
		defaultValue: e.defaultOpened,
		finalValue: !1,
		onChange: e.onChange
	}), r = H(t), [i, a] = U(null), o = e.preventPositionChangeWhenVisible !== !1, s = H(t);
	t !== s.current && (s.current = t, t && i !== null && a(null));
	let c = B(() => a(null), []), l = () => {
		t && !e.disabled && n(!1);
	}, u = () => {
		e.disabled || n(!t);
	}, d = Fi({
		open: t,
		strategy: e.strategy,
		placement: o ? i ?? e.position : e.position,
		middleware: ka(e, () => d, o && i !== null, o),
		whileElementsMounted: e.keepMounted ? void 0 : Le
	});
	V(() => {
		if (!e.keepMounted) return;
		let n = d.refs.reference.current, r = d.refs.floating.current;
		if (t && n && r) return Le(n, r, d.update);
	}, [
		e.keepMounted,
		t,
		d.update,
		d.elements.reference,
		d.elements.floating
	]);
	let f = H(!1);
	oe(() => {
		if (!t) {
			f.current = !1;
			return;
		}
		if (!o || i !== null) return;
		let e = d.refs.floating.current;
		if (!(!e || e.offsetHeight === 0 || e.offsetWidth === 0)) {
			if (!f.current) {
				f.current = !0, d.update();
				return;
			}
			d.isPositioned && a(d.placement);
		}
	}, [
		o,
		t,
		d.isPositioned,
		d.placement,
		i,
		d.update
	]);
	let p = H(d.placement);
	return oe(() => {
		p.current !== d.placement && (p.current = d.placement, e.onPositionChange?.(d.placement));
	}, [d.placement]), ie(() => {
		t !== r.current && (t ? e.onOpen?.() : e.onClose?.()), r.current = t;
	}, [
		t,
		e.onClose,
		e.onOpen
	]), {
		floating: d,
		controlled: typeof e.opened == "boolean",
		opened: t,
		onClose: l,
		onToggle: u,
		resetLockedPlacement: c
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Popover/Popover.mjs
var ja = {
	position: "bottom",
	offset: 8,
	transitionProps: {
		transition: "fade",
		duration: 150
	},
	middlewares: {
		flip: !0,
		shift: !0,
		inline: !1
	},
	arrowSize: 7,
	arrowOffset: 5,
	arrowRadius: 0,
	arrowPosition: "side",
	closeOnClickOutside: !0,
	withinPortal: !0,
	closeOnEscape: !0,
	trapFocus: !1,
	withRoles: !0,
	returnFocus: !1,
	withOverlay: !1,
	hideDetached: !0,
	preventPositionChangeWhenVisible: !0,
	clickOutsideEvents: ["mousedown", "touchstart"],
	zIndex: dn("popover"),
	__staticSelector: "Popover",
	width: "max-content"
}, Ma = I((e, { radius: t, shadow: n }) => ({ dropdown: {
	"--popover-radius": t === void 0 ? void 0 : ce(t),
	"--popover-shadow": k(n)
} }));
function J(e) {
	let t = C("Popover", ja, e), { children: n, position: r, offset: i, onPositionChange: a, opened: o, transitionProps: s, onExitTransitionEnd: c, onEnterTransitionEnd: l, width: u, middlewares: d, withArrow: f, arrowSize: p, arrowOffset: m, arrowRadius: h, arrowPosition: g, unstyled: _, classNames: v, styles: y, closeOnClickOutside: b, withinPortal: x, portalProps: w, closeOnEscape: T, clickOutsideEvents: E, trapFocus: D, onClose: O, onDismiss: k, onOpen: A, onChange: j, zIndex: M, radius: P, shadow: ee, id: te, defaultOpened: ne, __staticSelector: F, withRoles: re, disabled: ie, returnFocus: ae, variant: I, keepMounted: oe, keepMountedMode: se, vars: ce, floatingStrategy: le, withOverlay: ue, overlayProps: de, hideDetached: fe, attributes: pe, preventPositionChangeWhenVisible: me, ...L } = t, R = S({
		name: F,
		props: t,
		classes: wa,
		classNames: v,
		styles: y,
		unstyled: _,
		attributes: pe,
		rootSelector: "dropdown",
		vars: ce,
		varsResolver: Ma
	}), { resolvedStyles: he } = Un({
		classNames: v,
		styles: y,
		props: t
	}), ge = H(null), [_e, ve] = U(null), [ye, be] = U(null), { dir: xe } = Kn(), Se = rt(), Ce = kn(te), we = Aa({
		middlewares: d,
		width: u,
		position: aa(xe, r),
		offset: typeof i == "number" ? i + (f ? p / 2 : 0) : i,
		arrowRef: ge,
		arrowOffset: m,
		onPositionChange: a,
		opened: o,
		defaultOpened: ne,
		onChange: j,
		onOpen: A,
		onClose: O,
		onDismiss: k,
		strategy: le,
		disabled: ie,
		preventPositionChangeWhenVisible: me,
		keepMounted: oe
	});
	_n(() => {
		b && (we.onClose(), k?.());
	}, E, [_e, ye]);
	let Te = B((e) => {
		ve(e), we.floating.refs.setReference(e);
	}, [we.floating.refs.setReference]), Ee = B((e) => {
		be(e), we.floating.refs.setFloating(e);
	}, [we.floating.refs.setFloating]), De = B(() => {
		s?.onExited?.(), c?.(), we.resetLockedPlacement();
	}, [
		s?.onExited,
		c,
		we.resetLockedPlacement
	]), Oe = B(() => {
		s?.onEntered?.(), l?.();
	}, [s?.onEntered, l]);
	return /* @__PURE__ */ K(va, {
		value: {
			returnFocus: ae,
			disabled: ie,
			controlled: we.controlled,
			reference: Te,
			floating: Ee,
			x: we.floating.x,
			y: we.floating.y,
			arrowX: we.floating?.middlewareData?.arrow?.x,
			arrowY: we.floating?.middlewareData?.arrow?.y,
			opened: we.opened,
			arrowRef: ge,
			transitionProps: {
				...s,
				onExited: De,
				onEntered: Oe
			},
			width: u,
			withArrow: f,
			arrowSize: p,
			arrowOffset: m,
			arrowRadius: h,
			arrowPosition: g,
			placement: we.floating.placement,
			trapFocus: D,
			withinPortal: x,
			portalProps: w,
			zIndex: M,
			radius: P,
			shadow: ee,
			closeOnEscape: T,
			onDismiss: k,
			onClose: we.onClose,
			onToggle: we.onToggle,
			getTargetId: () => Ce,
			getDropdownId: () => `${Ce}-dropdown`,
			withRoles: re,
			targetProps: L,
			__staticSelector: F,
			classNames: v,
			styles: y,
			unstyled: _,
			variant: I,
			keepMounted: oe,
			keepMountedMode: se,
			getStyles: R,
			resolvedStyles: he,
			floatingStrategy: le,
			referenceHidden: fe && Se !== "test" ? we.floating.middlewareData.hide?.referenceHidden : !1
		},
		children: [n, ue && /* @__PURE__ */ G(N, {
			transition: "fade",
			mounted: we.opened,
			duration: s?.duration || 250,
			exitDuration: s?.exitDuration || 250,
			children: (e) => /* @__PURE__ */ G(ha, {
				withinPortal: x,
				children: /* @__PURE__ */ G(ua, {
					...de,
					...R("overlay", {
						className: de?.className,
						style: [e, de?.style]
					})
				})
			})
		})]
	});
}
J.Target = Da, J.Dropdown = Ta, J.ContextMenu = xa, J.varsResolver = Ma, J.displayName = "@mantine/core/Popover", J.extend = (e) => e, J.withProps = (e) => {
	let t = (t) => /* @__PURE__ */ G(J, {
		...e,
		...t
	});
	return t.extend = J.extend, t.displayName = `WithProps(${J.displayName})`, t;
};
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/CloseButton/CloseIcon.mjs
function Na({ size: e = "var(--cb-icon-size, 70%)", style: t, ...n }) {
	return /* @__PURE__ */ G("svg", {
		viewBox: "0 0 15 15",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		style: {
			...t,
			width: e,
			height: e
		},
		...n,
		children: /* @__PURE__ */ G("path", {
			d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
			fill: "currentColor",
			fillRule: "evenodd",
			clipRule: "evenodd"
		})
	});
}
Na.displayName = "@mantine/core/CloseIcon";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/CloseButton/CloseButton.module.mjs
var Pa = {
	root: "m_86a44da5",
	"root--subtle": "m_220c80f2"
}, Fa = { variant: "subtle" }, Ia = I((e, { size: t, radius: n, iconSize: r }) => ({ root: {
	"--cb-size": j(t, "cb-size"),
	"--cb-radius": n === void 0 ? void 0 : ce(n),
	"--cb-icon-size": D(r)
} })), La = a((e) => {
	let t = C("CloseButton", Fa, e), { iconSize: n, children: r, vars: i, radius: a, className: o, classNames: s, style: c, styles: l, unstyled: u, "data-disabled": d, disabled: f, variant: m, icon: h, mod: g, attributes: _, __staticSelector: v, ...y } = t, b = S({
		name: v || "CloseButton",
		props: t,
		className: o,
		style: c,
		classes: Pa,
		classNames: s,
		styles: l,
		unstyled: u,
		attributes: _,
		vars: i,
		varsResolver: Ia
	});
	return /* @__PURE__ */ K(p, {
		...y,
		unstyled: u,
		variant: m,
		disabled: f,
		mod: [{ disabled: f || d }, g],
		...b("root", {
			variant: m,
			active: !f && !d
		}),
		children: [h || /* @__PURE__ */ G(Na, {}), r]
	});
});
La.classes = Pa, La.varsResolver = Ia, La.displayName = "@mantine/core/CloseButton";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/Input.context.mjs
var Ra = ut({ size: "sm" }), za = c((e) => {
	let t = C("InputClearButton", null, e), { size: n, variant: r, vars: i, classNames: a, styles: o, ...s } = t, c = ft(Ra), { resolvedClassNames: l, resolvedStyles: u } = Un({
		classNames: a,
		styles: o,
		props: t
	});
	return /* @__PURE__ */ G(La, {
		variant: r || "transparent",
		size: n || c?.size || "sm",
		classNames: l,
		styles: u,
		__staticSelector: "InputClearButton",
		style: {
			pointerEvents: "all",
			background: "var(--input-bg)",
			...s.style
		},
		...s
	});
});
za.displayName = "@mantine/core/InputClearButton";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/InputClearSection/InputClearSection.mjs
var Ba = {
	xs: 7,
	sm: 8,
	md: 10,
	lg: 12,
	xl: 15
};
function Va({ __clearable: e, __clearSection: t, rightSection: n, __defaultRightSection: r, size: i = "sm", __clearSectionMode: a = "both" }) {
	let o = e && t;
	return a === "rightSection" ? n === null ? null : n || r : a === "clear" ? n === null ? null : o || r : o && (n || r) ? /* @__PURE__ */ K("div", {
		"data-combined-clear-section": !0,
		style: {
			display: "flex",
			gap: 2,
			alignItems: "center",
			paddingInlineEnd: Ba[i]
		},
		children: [o, n || r]
	}) : n === null ? null : n || o || r;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/InputWrapper.context.mjs
var Ha = ut({
	offsetBottom: !1,
	offsetTop: !1,
	describedBy: void 0,
	getStyles: null,
	inputId: void 0,
	labelId: void 0
}), Ua = {
	wrapper: "m_6c018570",
	input: "m_8fb7ebe7",
	bottomSection: "m_93f4ed57",
	section: "m_82577fc2",
	placeholder: "m_88bacfd0",
	root: "m_46b77525",
	label: "m_8fdc1311",
	required: "m_78a94662",
	error: "m_8f816625",
	description: "m_fe47ce59"
}, Wa = I((e, { size: t }) => ({ description: { "--input-description-size": t === void 0 ? void 0 : `calc(${te(t)} - ${D(2)})` } })), Ga = c((e) => {
	let t = C("InputDescription", null, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, vars: s, __staticSelector: c, __inheritStyles: l = !0, attributes: u, ...d } = C("InputDescription", null, t), f = ft(Ha), p = S({
		name: ["InputWrapper", c],
		props: t,
		classes: Ua,
		className: r,
		style: i,
		classNames: n,
		styles: a,
		unstyled: o,
		attributes: u,
		rootSelector: "description",
		vars: s,
		varsResolver: Wa
	});
	return /* @__PURE__ */ G(_, {
		component: "p",
		...(l && f?.getStyles || p)("description", f?.getStyles ? {
			className: r,
			style: i
		} : void 0),
		...d
	});
});
Ga.classes = Ua, Ga.varsResolver = Wa, Ga.displayName = "@mantine/core/InputDescription";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/InputError/InputError.mjs
var Ka = I((e, { size: t }) => ({ error: { "--input-error-size": t === void 0 ? void 0 : `calc(${te(t)} - ${D(2)})` } })), qa = c((e) => {
	let t = C("InputError", null, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, vars: s, attributes: c, __staticSelector: l, __inheritStyles: u = !0, ...d } = t, f = S({
		name: ["InputWrapper", l],
		props: t,
		classes: Ua,
		className: r,
		style: i,
		classNames: n,
		styles: a,
		unstyled: o,
		attributes: c,
		rootSelector: "error",
		vars: s,
		varsResolver: Ka
	}), p = ft(Ha);
	return /* @__PURE__ */ G(_, {
		component: "p",
		...(u && p?.getStyles || f)("error", p?.getStyles ? {
			className: r,
			style: i
		} : void 0),
		...d
	});
});
qa.classes = Ua, qa.varsResolver = Ka, qa.displayName = "@mantine/core/InputError";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/InputLabel/InputLabel.mjs
var Ja = { labelElement: "label" }, Ya = I((e, { size: t }) => ({ label: {
	"--input-label-size": te(t),
	"--input-asterisk-color": void 0
} })), Xa = c((e) => {
	let t = C("InputLabel", Ja, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, vars: s, labelElement: c, required: l, htmlFor: u, onMouseDown: d, children: f, __staticSelector: p, mod: m, attributes: h, ...g } = t, v = S({
		name: ["InputWrapper", p],
		props: t,
		classes: Ua,
		className: r,
		style: i,
		classNames: n,
		styles: a,
		unstyled: o,
		attributes: h,
		rootSelector: "label",
		vars: s,
		varsResolver: Ya
	}), y = ft(Ha), b = y?.getStyles || v;
	return /* @__PURE__ */ K(_, {
		...b("label", y?.getStyles ? {
			className: r,
			style: i
		} : void 0),
		component: c,
		htmlFor: c === "label" ? u : void 0,
		mod: [{ required: l }, m],
		onMouseDown: (e) => {
			d?.(e), !e.defaultPrevented && e.detail > 1 && e.preventDefault();
		},
		...g,
		children: [f, l && /* @__PURE__ */ G("span", {
			...b("required"),
			"aria-hidden": !0,
			children: " *"
		})]
	});
});
Xa.classes = Ua, Xa.varsResolver = Ya, Xa.displayName = "@mantine/core/InputLabel";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/InputPlaceholder/InputPlaceholder.mjs
var Za = c((e) => {
	let t = C("InputPlaceholder", null, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, vars: s, __staticSelector: c, error: l, mod: u, attributes: d, ...f } = t;
	return /* @__PURE__ */ G(_, {
		...S({
			name: ["InputPlaceholder", c],
			props: t,
			classes: Ua,
			className: r,
			style: i,
			classNames: n,
			styles: a,
			unstyled: o,
			attributes: d,
			rootSelector: "placeholder"
		})("placeholder"),
		mod: [{ error: !!l }, u],
		component: "span",
		...f
	});
});
Za.classes = Ua, Za.displayName = "@mantine/core/InputPlaceholder";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/InputWrapper/get-input-offsets/get-input-offsets.mjs
function Qa(e, { hasDescription: t, hasError: n }) {
	let r = e.findIndex((e) => e === "input"), i = e.slice(0, r), a = e.slice(r + 1), o = t && i.includes("description") || n && i.includes("error");
	return {
		offsetBottom: t && a.includes("description") || n && a.includes("error"),
		offsetTop: o
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/InputWrapper/InputWrapper.mjs
var $a = {
	labelElement: "label",
	inputContainer: (e) => e,
	inputWrapperOrder: [
		"label",
		"description",
		"input",
		"error"
	]
}, eo = I((e, { size: t }) => ({
	label: {
		"--input-label-size": te(t),
		"--input-asterisk-color": void 0
	},
	error: { "--input-error-size": t === void 0 ? void 0 : `calc(${te(t)} - ${D(2)})` },
	description: { "--input-description-size": t === void 0 ? void 0 : `calc(${te(t)} - ${D(2)})` }
})), to = c((e) => {
	let t = C("InputWrapper", $a, e), { classNames: n, className: r, style: i, styles: a, unstyled: o, vars: s, size: c, variant: l, __staticSelector: u, inputContainer: d, inputWrapperOrder: f, label: p, error: m, description: h, labelProps: g, descriptionProps: v, errorProps: y, labelElement: b, children: x, withAsterisk: w, id: T, required: E, __stylesApiProps: D, mod: O, attributes: k, ...A } = t, j = S({
		name: ["InputWrapper", u],
		props: D || t,
		classes: Ua,
		className: r,
		style: i,
		classNames: n,
		styles: a,
		unstyled: o,
		attributes: k,
		vars: s,
		varsResolver: eo
	}), M = {
		size: c,
		variant: l,
		__staticSelector: u
	}, N = kn(T), P = typeof w == "boolean" ? w : E, ee = y?.id || `${N}-error`, te = v?.id || `${N}-description`, ne = N, F = !!m && typeof m != "boolean", re = !!h, ie = `${F ? ee : ""} ${re ? te : ""}`, ae = ie.trim().length > 0 ? ie.trim() : void 0, I = g?.id || `${N}-label`, oe = p && /* @__PURE__ */ G(Xa, {
		labelElement: b,
		id: I,
		htmlFor: ne,
		required: P,
		...M,
		...g,
		children: p
	}, "label"), se = re && /* @__PURE__ */ G(Ga, {
		...v,
		...M,
		size: v?.size || M.size,
		id: v?.id || te,
		children: h
	}, "description"), ce = /* @__PURE__ */ G(ct, { children: d(x) }, "input"), le = F && /* @__PURE__ */ dt(qa, {
		...y,
		...M,
		size: y?.size || M.size,
		key: "error",
		id: y?.id || ee
	}, m), ue = f.map((e) => {
		switch (e) {
			case "label": return oe;
			case "input": return ce;
			case "description": return se;
			case "error": return le;
			default: return null;
		}
	});
	return /* @__PURE__ */ G(Ha, {
		value: {
			getStyles: j,
			describedBy: ae,
			inputId: ne,
			labelId: I,
			...Qa(f, {
				hasDescription: re,
				hasError: F
			})
		},
		children: /* @__PURE__ */ G(_, {
			variant: l,
			size: c,
			mod: [{ error: !!m }, O],
			id: b === "label" ? void 0 : T,
			...j("root"),
			...A,
			children: ue
		})
	});
});
to.classes = Ua, to.varsResolver = eo, to.displayName = "@mantine/core/InputWrapper";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/Input.mjs
var no = {
	variant: "default",
	leftSectionPointerEvents: "none",
	rightSectionPointerEvents: "none",
	withAria: !0,
	withErrorStyles: !0,
	size: "sm",
	loading: !1,
	loadingPosition: "right"
}, ro = I((e, t, n) => ({ wrapper: {
	"--input-margin-top": n.offsetTop ? "calc(var(--mantine-spacing-xs) / 2)" : void 0,
	"--input-margin-bottom": n.offsetBottom ? "calc(var(--mantine-spacing-xs) / 2)" : void 0,
	"--input-height": j(t.size, "input-height"),
	"--input-fz": te(t.size),
	"--input-radius": t.radius === void 0 ? void 0 : ce(t.radius),
	"--input-left-section-width": t.leftSectionWidth === void 0 ? void 0 : D(t.leftSectionWidth),
	"--input-right-section-width": t.rightSectionWidth === void 0 ? void 0 : D(t.rightSectionWidth),
	"--input-padding-y": t.multiline ? j(t.size, "input-padding-y") : void 0,
	"--input-left-section-pointer-events": t.leftSectionPointerEvents,
	"--input-right-section-pointer-events": t.rightSectionPointerEvents
} })), io = a((n) => {
	let r = C("Input", no, n), { classNames: i, className: a, style: o, styles: s, unstyled: c, required: l, __staticSelector: u, __stylesApiProps: d, size: f, wrapperProps: p, error: m, disabled: h, leftSection: g, leftSectionProps: v, leftSectionWidth: y, rightSection: b, rightSectionProps: x, rightSectionWidth: w, rightSectionPointerEvents: T, leftSectionPointerEvents: E, variant: D, vars: O, pointer: k, multiline: A, radius: j, id: M, withAria: N, withErrorStyles: P, mod: ee, inputSize: te, attributes: ne, __clearSection: F, __clearable: re, __clearSectionMode: ie, __defaultRightSection: ae, loading: I, loadingPosition: oe, __bottomSection: se, __bottomSectionProps: ce, rootRef: le, dir: ue, ...de } = r, { styleProps: fe, rest: pe } = t(de), me = ft(Ha), L = {
		offsetBottom: me?.offsetBottom,
		offsetTop: me?.offsetTop
	}, R = S({
		name: ["Input", u],
		props: d || r,
		classes: Ua,
		className: a,
		style: o,
		classNames: i,
		styles: s,
		unstyled: c,
		attributes: ne,
		stylesCtx: L,
		rootSelector: "wrapper",
		vars: O,
		varsResolver: ro
	}), he = N ? {
		required: l,
		disabled: h,
		"aria-invalid": m ? !0 : void 0,
		"aria-describedby": me?.describedBy,
		id: me?.inputId || M
	} : {}, ge = I ? /* @__PURE__ */ G(e, { size: oe === "left" ? "calc(var(--input-left-section-size) / 2)" : "calc(var(--input-right-section-size) / 2)" }) : null, _e = I && oe === "left" ? ge : g, ve = Va({
		__clearable: re,
		__clearSection: F,
		rightSection: I && oe === "right" ? ge : b,
		__defaultRightSection: ae,
		size: f,
		__clearSectionMode: ie
	});
	return /* @__PURE__ */ G(Ra, {
		value: { size: f || "sm" },
		children: /* @__PURE__ */ K(_, {
			ref: le,
			dir: ue,
			...R("wrapper"),
			...fe,
			...p,
			mod: [{
				error: !!m && P,
				pointer: k,
				disabled: h,
				multiline: A,
				"data-with-right-section": !!ve,
				"data-with-left-section": !!_e,
				"data-with-bottom-section": !!se
			}, ee],
			variant: D,
			size: f,
			children: [
				_e && /* @__PURE__ */ G("div", {
					...v,
					"data-position": "left",
					...R("section", {
						className: v?.className,
						style: v?.style
					}),
					children: _e
				}),
				/* @__PURE__ */ G(_, {
					component: "input",
					...pe,
					...he,
					required: l,
					mod: {
						disabled: h,
						error: !!m && P
					},
					variant: D,
					__size: te,
					...R("input")
				}),
				se && /* @__PURE__ */ G("div", {
					...ce,
					...R("bottomSection", {
						className: ce?.className,
						style: ce?.style
					}),
					children: se
				}),
				ve && /* @__PURE__ */ G("div", {
					...x,
					"data-position": "right",
					...R("section", {
						className: x?.className,
						style: x?.style
					}),
					children: ve
				})
			]
		})
	});
});
io.classes = Ua, io.varsResolver = ro, io.Wrapper = to, io.Label = Xa, io.Error = qa, io.Description = Ga, io.Placeholder = Za, io.ClearButton = za, io.displayName = "@mantine/core/Input";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Input/use-input-props.mjs
function ao(e, n, r) {
	let i = C([
		"Input",
		"InputWrapper",
		e
	], n, r), { label: a, description: o, error: s, required: c, classNames: l, styles: u, className: d, unstyled: f, __staticSelector: p, __stylesApiProps: m, errorProps: h, labelProps: g, descriptionProps: _, wrapperProps: v, id: y, size: b, style: x, inputContainer: S, inputWrapperOrder: w, withAsterisk: T, variant: E, vars: D, mod: O, attributes: k, ...A } = i, { styleProps: j, rest: M } = t(A), N = {
		label: a,
		description: o,
		error: s,
		required: c,
		classNames: l,
		className: d,
		__staticSelector: p,
		__stylesApiProps: m || i,
		errorProps: h,
		labelProps: g,
		descriptionProps: _,
		unstyled: f,
		styles: u,
		size: b,
		style: x,
		inputContainer: S,
		inputWrapperOrder: w,
		withAsterisk: T,
		variant: E,
		id: y,
		mod: O,
		attributes: k,
		...v
	};
	return {
		...M,
		classNames: l,
		styles: u,
		unstyled: f,
		wrapperProps: {
			...N,
			...j
		},
		inputProps: {
			required: c,
			classNames: l,
			styles: u,
			unstyled: f,
			size: b,
			__staticSelector: p,
			__stylesApiProps: m || i,
			error: s,
			variant: E,
			id: y,
			attributes: k
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/InputBase/InputBase.mjs
var oo = {
	__staticSelector: "InputBase",
	withAria: !0,
	size: "sm"
}, so = a((e) => {
	let { inputProps: t, wrapperProps: n, ...r } = ao("InputBase", oo, e);
	return /* @__PURE__ */ G(io.Wrapper, {
		...n,
		children: /* @__PURE__ */ G(io, {
			...t,
			...r
		})
	});
});
so.classes = {
	...io.classes,
	...io.Wrapper.classes
}, so.displayName = "@mantine/core/InputBase";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Accordion/AccordionChevron.mjs
function co({ style: e, size: t = 16, ...n }) {
	return /* @__PURE__ */ G("svg", {
		viewBox: "0 0 15 15",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		style: {
			...e,
			width: D(t),
			height: D(t),
			display: "block"
		},
		...n,
		children: /* @__PURE__ */ G("path", {
			d: "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
			fill: "currentColor",
			fillRule: "evenodd",
			clipRule: "evenodd"
		})
	});
}
co.displayName = "@mantine/core/AccordionChevron";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Checkbox/CheckIcon.mjs
function lo({ size: e, style: t, ...n }) {
	return /* @__PURE__ */ G("svg", {
		viewBox: "0 0 10 7",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		style: e === void 0 ? t : {
			width: D(e),
			height: D(e),
			...t
		},
		"aria-hidden": !0,
		...n,
		children: /* @__PURE__ */ G("path", {
			d: "M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z",
			fill: "currentColor",
			fillRule: "evenodd",
			clipRule: "evenodd"
		})
	});
}
function uo({ indeterminate: e, ...t }) {
	return e ? /* @__PURE__ */ G("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 32 6",
		"aria-hidden": !0,
		...t,
		children: /* @__PURE__ */ G("rect", {
			width: "32",
			height: "6",
			fill: "currentColor",
			rx: "3"
		})
	}) : /* @__PURE__ */ G(lo, { ...t });
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Textarea/Autosize.mjs
var fo = [
	"borderBottomWidth",
	"borderLeftWidth",
	"borderRightWidth",
	"borderTopWidth",
	"boxSizing",
	"fontFamily",
	"fontSize",
	"fontStyle",
	"fontWeight",
	"letterSpacing",
	"lineHeight",
	"paddingBottom",
	"paddingLeft",
	"paddingRight",
	"paddingTop",
	"tabSize",
	"textIndent",
	"textRendering",
	"textTransform",
	"width",
	"wordBreak",
	"wordSpacing",
	"scrollbarGutter"
], po = {
	"min-height": "0",
	"max-height": "none",
	height: "0",
	visibility: "hidden",
	overflow: "hidden",
	position: "absolute",
	"z-index": "-1000",
	top: "0",
	right: "0",
	display: "block"
};
function mo(e) {
	Object.keys(po).forEach((t) => {
		e.style.setProperty(t, po[t], "important");
	});
}
function ho(e) {
	let t = window.getComputedStyle(e);
	if (t === null) return null;
	let n = {};
	for (let e of fo) n[e] = t[e];
	return n.boxSizing === "" ? null : {
		sizingStyle: n,
		paddingSize: parseFloat(n.paddingBottom) + parseFloat(n.paddingTop),
		borderSize: parseFloat(n.borderBottomWidth) + parseFloat(n.borderTopWidth)
	};
}
var go = null;
function _o(e, t, n = 1, r = Infinity) {
	go || (go = document.createElement("textarea"), go.setAttribute("tabindex", "-1"), go.setAttribute("aria-hidden", "true"), go.setAttribute("aria-label", "autosize measurement"), mo(go)), go.parentNode === null && document.body.appendChild(go);
	let { paddingSize: i, borderSize: a, sizingStyle: o } = e, { boxSizing: s } = o;
	Object.keys(o).forEach((e) => {
		go.style[e] = o[e];
	}), mo(go), go.value = t;
	let c = s === "border-box" ? go.scrollHeight + a : go.scrollHeight - i;
	go.value = t, c = s === "border-box" ? go.scrollHeight + a : go.scrollHeight - i, go.value = "x";
	let l = go.scrollHeight - i, u = l * n;
	s === "border-box" && (u = u + i + a), c = Math.max(u, c);
	let d = l * r;
	return s === "border-box" && (d = d + i + a), c = Math.min(d, c), [c, l];
}
function vo({ maxRows: e, minRows: t, onChange: n, ref: r, ...i }) {
	let a = i.value !== void 0, o = H(null), s = Mn(o, r), c = H(0), l = H(0), u = () => {
		let n = o.current;
		if (!n) return;
		let r = ho(n);
		if (!r) return;
		let [i] = _o(r, n.value || n.placeholder || "x", t, e);
		c.current !== i && (c.current = i, n.style.setProperty("height", `${i}px`, "important"));
	}, d = (e) => {
		a || u(), n?.(e);
	};
	return ht(u), V(() => {
		let e = () => u();
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), V(() => {
		let e = o.current;
		if (!e || typeof ResizeObserver > "u") return;
		l.current = e.offsetWidth;
		let t = new ResizeObserver(() => {
			o.current && o.current.offsetWidth !== l.current && (l.current = o.current.offsetWidth, u());
		});
		return t.observe(e), () => t.disconnect();
	}, []), V(() => {
		let e = () => u();
		return document.fonts.addEventListener("loadingdone", e), () => document.fonts.removeEventListener("loadingdone", e);
	}, []), V(() => {
		let e = (e) => {
			if (o.current?.form === e.target && !a) {
				let e = o.current.value;
				requestAnimationFrame(() => {
					o.current && e !== o.current.value && u();
				});
			}
		};
		return document.body.addEventListener("reset", e), () => document.body.removeEventListener("reset", e);
	}, [a]), /* @__PURE__ */ G("textarea", {
		...i,
		onChange: d,
		ref: s
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Textarea/Textarea.mjs
var yo = c((e) => {
	let { autosize: t, maxRows: n, minRows: r, __staticSelector: i, resize: a, bottomSection: o, bottomSectionProps: s, ...c } = C([
		"Input",
		"InputWrapper",
		"Textarea"
	], null, e), l = t && Bn() !== "test", u = l ? {
		maxRows: n,
		minRows: r
	} : {};
	return /* @__PURE__ */ G(so, {
		component: l ? vo : "textarea",
		...c,
		__staticSelector: i || "Textarea",
		__bottomSection: o,
		__bottomSectionProps: s,
		multiline: !0,
		"data-no-overflow": t && n === void 0 || void 0,
		__vars: { "--input-resize": a },
		...u
	});
});
yo.classes = so.classes, yo.displayName = "@mantine/core/Textarea";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/Menu.context.mjs
var [bo, xo] = F("Menu component was not found in the tree"), So = ut(null);
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuCheckboxGroup/MenuCheckboxGroup.mjs
function Co(e) {
	let { value: t, defaultValue: n, onChange: r, children: i } = C("MenuCheckboxGroup", null, e), [a, o] = Nn({
		value: t,
		defaultValue: n,
		finalValue: [],
		onChange: r
	});
	return /* @__PURE__ */ G(So, {
		value: {
			values: a,
			onChange: B((e) => {
				o(a.includes(e) ? a.filter((t) => t !== e) : [...a, e]);
			}, [a, o])
		},
		children: i
	});
}
Co.displayName = "@mantine/core/MenuCheckboxGroup";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuSub/MenuSub.context.mjs
var wo = ut(null);
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuSelectableItem/MenuSelectableItem.mjs
function To({ role: e, checked: t, indicator: n, onSelect: r, color: i, closeMenuOnClick: a, rightSection: o, children: s, disabled: c, dataDisabled: u, className: d, style: f, styles: m, classNames: h, buttonRef: g, others: _ }) {
	let y = xo(), b = ft(wo), x = l(), { dir: S } = Kn(), C = H(null), w = q(_.onClick, () => {
		u || (r(), a && y.closeDropdownImmediately());
	}), T = q(_.onMouseMove, () => {
		if (!y.hasSearch) return;
		let e = C.current?.closest("[data-menu-dropdown]");
		e && e.querySelectorAll("[data-menu-active]").forEach((t) => {
			t !== C.current && t.closest("[data-menu-dropdown]") === e && t.removeAttribute("data-menu-active");
		});
	}), E = q(_.onKeyDown, (e) => {
		e.key === "ArrowLeft" && b && (b.close(), b.focusParentItem());
	}), D = i ? x.variantColorResolver({
		color: i,
		theme: x,
		variant: "light"
	}) : void 0, O = i ? v({
		color: i,
		theme: x
	}) : null, k = y.alignItemsLabels !== "none" || t;
	return /* @__PURE__ */ K(p, {
		onMouseDown: (e) => e.preventDefault(),
		..._,
		unstyled: y.unstyled,
		tabIndex: y.menuItemTabIndex,
		...y.getStyles("item", {
			className: d,
			style: f,
			styles: m,
			classNames: h
		}),
		ref: Mn(C, g),
		role: e,
		"aria-checked": t,
		disabled: c,
		"data-menu-item": !0,
		"data-checked": t || void 0,
		"data-disabled": c || u || void 0,
		"data-mantine-stop-propagation": !0,
		onClick: w,
		onMouseMove: T,
		onKeyDown: ln({
			siblingSelector: "[data-menu-item]:not([data-disabled])",
			parentSelector: "[data-menu-dropdown]",
			activateOnFocus: !1,
			loop: y.loop,
			dir: S,
			orientation: "vertical",
			onKeyDown: E
		}),
		__vars: {
			"--menu-item-color": O?.isThemeColor && O?.shade === void 0 ? `var(--mantine-color-${O.color}-6)` : D?.color,
			"--menu-item-hover": D?.hover
		},
		children: [
			k && /* @__PURE__ */ G("div", {
				...y.getStyles("itemIndicator", {
					styles: m,
					classNames: h
				}),
				"data-checked": t || void 0,
				children: t ? n : null
			}),
			s && /* @__PURE__ */ G("div", {
				...y.getStyles("itemLabel", {
					styles: m,
					classNames: h
				}),
				"data-menu-item-label": !0,
				children: s
			}),
			o && /* @__PURE__ */ G("div", {
				...y.getStyles("itemSection", {
					styles: m,
					classNames: h
				}),
				"data-position": "right",
				children: o
			})
		]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/Menu.module.mjs
var Eo = {
	dropdown: "m_dc9b7c9f",
	label: "m_9bfac126",
	divider: "m_efdf90cb",
	item: "m_99ac2aa1",
	search: "m_ef8769b6",
	itemLabel: "m_5476e0d3",
	itemIndicator: "m_8395186e",
	itemSection: "m_8b75e504",
	chevron: "m_b85b0bed"
}, Do = c((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, color: o, closeMenuOnClick: s, rightSection: c, children: l, disabled: u, "data-disabled": d, value: f, checked: p, defaultChecked: m, onChange: h, checkIcon: g, ref: _, ...v } = C("MenuCheckboxItem", null, e), y = xo(), b = ft(So), x = b && f !== void 0 ? b.values.includes(f) : void 0, [S, w] = Nn({
		value: p ?? x,
		defaultValue: m,
		finalValue: !1,
		onChange: h
	});
	return /* @__PURE__ */ G(To, {
		role: "menuitemcheckbox",
		checked: S,
		indicator: g ?? y.checkIcon ?? /* @__PURE__ */ G(lo, { size: 10 }),
		onSelect: () => {
			h ? w(!S) : b && f !== void 0 ? b.onChange(f) : w(!S);
		},
		color: o,
		closeMenuOnClick: s,
		rightSection: c,
		disabled: u,
		dataDisabled: d,
		className: n,
		style: r,
		styles: i,
		classNames: t,
		buttonRef: _,
		others: v,
		children: l
	});
});
Do.classes = Eo, Do.displayName = "@mantine/core/MenuCheckboxItem";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuContextMenu/MenuContextMenu.mjs
function Oo(e) {
	let { children: t, disabled: n, longPressDelay: r } = C("MenuContextMenu", null, e), i = Hn(t);
	if (!i) throw Error("Menu.ContextMenu component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");
	let a = xo(), o = ya();
	return lt(i, ba({
		childProps: i.props,
		disabled: n || o.disabled,
		opened: a.opened,
		longPressDelay: r,
		setReference: o.reference,
		open: () => a.openDropdown()
	}));
}
Oo.displayName = "@mantine/core/MenuContextMenu";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuDivider/MenuDivider.mjs
var ko = c((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, ...o } = C("MenuDivider", null, e);
	return /* @__PURE__ */ G(_, {
		...xo().getStyles("divider", {
			className: n,
			style: r,
			styles: i,
			classNames: t
		}),
		...o
	});
});
ko.classes = Eo, ko.displayName = "@mantine/core/MenuDivider";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/use-menu-type-ahead.mjs
var Ao = 500;
function jo(e) {
	return ((e.querySelector("[data-menu-item-label]") ?? e).textContent ?? "").trim().toLowerCase();
}
function Mo(e) {
	return e.length > 1 && e.split("").every((t) => t === e[0]);
}
function No({ enabled: e, opened: t, getDropdown: n }) {
	let r = H({
		buffer: "",
		timeoutId: null
	});
	return V(() => {
		if (t && e) return;
		let n = r.current;
		n.timeoutId !== null && (window.clearTimeout(n.timeoutId), n.timeoutId = null), n.buffer = "";
	}, [t, e]), V(() => () => {
		let { timeoutId: e } = r.current;
		e !== null && window.clearTimeout(e);
	}, []), (t) => {
		if (!e || t.defaultPrevented || t.ctrlKey || t.metaKey || t.altKey || t.key.length !== 1 || t.key === " ") return;
		let i = t.target;
		if (i && (i.tagName === "INPUT" || i.tagName === "TEXTAREA" || i.tagName === "SELECT" || i.isContentEditable)) return;
		let a = n();
		if (!a) return;
		let o = Array.from(a.querySelectorAll("[data-menu-item]:not([data-disabled])")).filter((e) => e.closest("[data-menu-dropdown]") === a);
		if (o.length === 0) return;
		let s = r.current;
		s.buffer = (s.buffer + t.key).toLowerCase(), s.timeoutId !== null && window.clearTimeout(s.timeoutId), s.timeoutId = window.setTimeout(() => {
			s.buffer = "", s.timeoutId = null;
		}, Ao);
		let c = document.activeElement, l = c ? o.indexOf(c) : -1, u = null;
		if (s.buffer.length === 1 || Mo(s.buffer)) {
			let e = s.buffer[0], t = l + 1;
			for (let n = 0; n < o.length; n += 1) {
				let r = (t + n) % o.length;
				if (jo(o[r]).startsWith(e)) {
					u = o[r];
					break;
				}
			}
		} else for (let e = 0; e < o.length; e += 1) if (jo(o[e]).startsWith(s.buffer)) {
			u = o[e];
			break;
		}
		u && (t.preventDefault(), u.focus());
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuDropdown/MenuDropdown.mjs
var Po = c((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, onMouseEnter: o, onMouseLeave: s, onKeyDown: c, children: l, ref: u, ...d } = C("MenuDropdown", null, e), f = H(null), p = xo(), m = No({
		enabled: !p.hasSearch,
		opened: p.opened,
		getDropdown: () => f.current
	}), h = q(c, (e) => {
		m(e), !(e.defaultPrevented || p.hasSearch) && (e.key === "ArrowUp" || e.key === "ArrowDown") && (e.preventDefault(), f.current?.querySelectorAll("[data-menu-item]:not(:disabled)")[0]?.focus());
	}), g = q(o, () => (p.trigger === "hover" || p.trigger === "click-hover") && p.openDropdown()), _ = q(s, () => (p.trigger === "hover" || p.trigger === "click-hover") && p.closeDropdown());
	return /* @__PURE__ */ K(J.Dropdown, {
		...d,
		onMouseEnter: g,
		onMouseLeave: _,
		role: "menu",
		"aria-orientation": "vertical",
		ref: Mn(u, f),
		...p.getStyles("dropdown", {
			className: n,
			style: r,
			styles: i,
			classNames: t,
			withStaticClass: !1
		}),
		tabIndex: -1,
		"data-menu-dropdown": !0,
		onKeyDown: h,
		children: [p.withInitialFocusPlaceholder && !p.hasSearch && /* @__PURE__ */ G("div", {
			tabIndex: -1,
			"data-autofocus": !0,
			"data-mantine-stop-propagation": !0,
			style: { outline: 0 }
		}), l]
	});
});
Po.classes = Eo, Po.displayName = "@mantine/core/MenuDropdown";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuItem/MenuItem.mjs
var Fo = a((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, color: o, closeMenuOnClick: s, leftSection: c, rightSection: u, children: d, disabled: f, "data-disabled": m, ref: h, ...g } = C("MenuItem", null, e), _ = xo(), y = ft(wo), b = l(), { dir: x } = Kn(), S = H(null), w = g, T = q(w.onClick, () => {
		m || (typeof s == "boolean" ? s && _.closeDropdownImmediately() : _.closeOnItemClick && _.closeDropdownImmediately());
	}), E = q(w.onMouseMove, () => {
		if (!_.hasSearch) return;
		let e = S.current?.closest("[data-menu-dropdown]");
		e && e.querySelectorAll("[data-menu-active]").forEach((t) => {
			t !== S.current && t.closest("[data-menu-dropdown]") === e && t.removeAttribute("data-menu-active");
		});
	}), D = o ? b.variantColorResolver({
		color: o,
		theme: b,
		variant: "light"
	}) : void 0, O = o ? v({
		color: o,
		theme: b
	}) : null, k = q(w.onKeyDown, (e) => {
		e.key === "ArrowLeft" && y && (y.close(), y.focusParentItem());
	});
	return /* @__PURE__ */ K(p, {
		onMouseDown: (e) => e.preventDefault(),
		...g,
		unstyled: _.unstyled,
		tabIndex: _.menuItemTabIndex,
		..._.getStyles("item", {
			className: n,
			style: r,
			styles: i,
			classNames: t
		}),
		ref: Mn(S, h),
		role: "menuitem",
		disabled: f,
		"data-menu-item": !0,
		"data-disabled": f || m || void 0,
		"data-mantine-stop-propagation": !0,
		onClick: T,
		onMouseMove: E,
		onKeyDown: ln({
			siblingSelector: "[data-menu-item]:not([data-disabled])",
			parentSelector: "[data-menu-dropdown]",
			activateOnFocus: !1,
			loop: _.loop,
			dir: x,
			orientation: "vertical",
			onKeyDown: k
		}),
		__vars: {
			"--menu-item-color": O?.isThemeColor && O?.shade === void 0 ? `var(--mantine-color-${O.color}-6)` : D?.color,
			"--menu-item-hover": D?.hover
		},
		children: [
			_.alignItemsLabels === "all" && /* @__PURE__ */ G("div", {
				..._.getStyles("itemIndicator", {
					styles: i,
					classNames: t
				}),
				"data-placeholder": !0
			}),
			c && /* @__PURE__ */ G("div", {
				..._.getStyles("itemSection", {
					styles: i,
					classNames: t
				}),
				"data-position": "left",
				children: c
			}),
			d && /* @__PURE__ */ G("div", {
				..._.getStyles("itemLabel", {
					styles: i,
					classNames: t
				}),
				"data-menu-item-label": !0,
				children: d
			}),
			u && /* @__PURE__ */ G("div", {
				..._.getStyles("itemSection", {
					styles: i,
					classNames: t
				}),
				"data-position": "right",
				children: u
			})
		]
	});
});
Fo.classes = Eo, Fo.displayName = "@mantine/core/MenuItem";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuLabel/MenuLabel.mjs
var Io = c((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, ...o } = C("MenuLabel", null, e);
	return /* @__PURE__ */ G(_, {
		...xo().getStyles("label", {
			className: n,
			style: r,
			styles: i,
			classNames: t
		}),
		...o
	});
});
Io.classes = Eo, Io.displayName = "@mantine/core/MenuLabel";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuRadioGroup/MenuRadioGroup.context.mjs
var Lo = ut(null);
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuRadioGroup/MenuRadioGroup.mjs
function Ro(e) {
	let { value: t, defaultValue: n, onChange: r, children: i } = C("MenuRadioGroup", null, e), [a, o] = Nn({
		value: t,
		defaultValue: n,
		finalValue: null,
		onChange: r
	});
	return /* @__PURE__ */ G(Lo, {
		value: {
			value: a,
			onChange: (e) => o(e)
		},
		children: i
	});
}
Ro.displayName = "@mantine/core/MenuRadioGroup";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Radio/RadioIcon.mjs
function zo({ size: e, style: t, ...n }) {
	return /* @__PURE__ */ G("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 5 5",
		style: {
			width: D(e),
			height: D(e),
			...t
		},
		"aria-hidden": !0,
		...n,
		children: /* @__PURE__ */ G("circle", {
			cx: "2.5",
			cy: "2.5",
			r: "2.5",
			fill: "currentColor"
		})
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuRadioItem/MenuRadioItem.mjs
var Bo = c((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, color: o, closeMenuOnClick: s, rightSection: c, children: l, disabled: u, "data-disabled": d, value: f, checked: p, onChange: m, checkIcon: h, ref: g, ..._ } = C("MenuRadioItem", null, e), v = xo(), y = ft(Lo), b = p ?? (y ? y.value === f : !1);
	return /* @__PURE__ */ G(To, {
		role: "menuitemradio",
		checked: b,
		indicator: h ?? v.checkIcon ?? /* @__PURE__ */ G(zo, { size: 5 }),
		onSelect: () => {
			b || (m ? m(f) : y && y.onChange(f));
		},
		color: o,
		closeMenuOnClick: s,
		rightSection: c,
		disabled: u,
		dataDisabled: d,
		className: n,
		style: r,
		styles: i,
		classNames: t,
		buttonRef: g,
		others: _,
		children: l
	});
});
Bo.classes = Eo, Bo.displayName = "@mantine/core/MenuRadioItem";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuSearch/MenuSearch.mjs
var Vo = "[data-menu-item]:not([data-disabled])", Ho = "[data-menu-active]";
function Uo(e) {
	return e?.closest("[data-menu-dropdown]");
}
function Wo(e) {
	return e ? Array.from(e.querySelectorAll(Vo)).filter((t) => t.closest("[data-menu-dropdown]") === e) : [];
}
function Go(e) {
	e && e.querySelectorAll(Ho).forEach((t) => {
		t.closest("[data-menu-dropdown]") === e && t.removeAttribute("data-menu-active");
	});
}
function Ko(e, t) {
	Go(t), e && (e.setAttribute("data-menu-active", "true"), e.scrollIntoView({ block: "nearest" }));
}
function qo(e) {
	return e.findIndex((e) => e.hasAttribute("data-menu-active"));
}
var Jo = { clearSearchOnClose: !0 }, Yo = c((e) => {
	let { classNames: t, styles: n, onKeyDown: r, onChange: i, size: a, clearSearchOnClose: o, ref: s, ...c } = C("MenuSearch", Jo, e), l = xo(), u = H(null), d = Mn(s, u), f = H(i);
	f.current = i, V(() => l.registerSearch(), [l.registerSearch]), V(() => {
		o ? l.searchExitClearRef.current = () => {
			f.current?.({ currentTarget: { value: "" } });
		} : l.searchExitClearRef.current = null;
	}, [o, l.searchExitClearRef]), V(() => {
		l.opened || Go(Uo(u.current));
	}, [l.opened]);
	let p = q(i, (e) => {
		Go(Uo(e.currentTarget));
	}), m = q(r, (e) => {
		if (e.defaultPrevented) return;
		let t = Uo(e.currentTarget), n = Wo(t);
		if (e.key === "ArrowDown") {
			if (e.preventDefault(), n.length === 0) return;
			let r = qo(n);
			Ko(n[r >= n.length - 1 ? l.loop ? 0 : r : r + 1] ?? null, t);
		} else if (e.key === "ArrowUp") {
			if (e.preventDefault(), n.length === 0) return;
			let r = qo(n);
			Ko(n[r <= 0 ? r === -1 || l.loop ? n.length - 1 : 0 : r - 1] ?? null, t);
		} else if (e.key === "Home") e.preventDefault(), n.length > 0 && Ko(n[0], t);
		else if (e.key === "End") e.preventDefault(), n.length > 0 && Ko(n[n.length - 1], t);
		else if (e.key === "Enter") {
			if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
			let t = n[qo(n)];
			t && (e.preventDefault(), t.hasAttribute("data-sub-menu-item") ? (t.focus(), t.dispatchEvent(new KeyboardEvent("keydown", {
				key: "ArrowRight",
				bubbles: !0
			}))) : t.click());
		}
	}), h = l.getStyles("search");
	return /* @__PURE__ */ G(io, {
		"data-autofocus": !0,
		"data-mantine-stop-propagation": !0,
		type: "search",
		size: a,
		...c,
		ref: d,
		classNames: [{ input: h.className }, t],
		styles: [{ input: h.style }, n],
		onKeyDown: m,
		onChange: p,
		__staticSelector: "Menu"
	});
});
Yo.classes = Eo, Yo.displayName = "@mantine/core/MenuSearch";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuSubDropdown/MenuSubDropdown.mjs
var Xo = c((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, onMouseEnter: o, onMouseLeave: s, onPointerEnter: c, onPointerLeave: l, onKeyDown: u, children: d, ref: f, ...p } = C("MenuSubDropdown", null, e), m = H(null), h = xo(), g = ft(wo), _ = No({
		enabled: !h.hasSearch,
		opened: g?.opened ?? !1,
		getDropdown: () => m.current
	}), v = q(u, (e) => {
		_(e), !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1 && e.key !== " " && e.stopPropagation();
	}), y = g?.getFloatingProps({
		onMouseEnter: o,
		onMouseLeave: s,
		onPointerEnter: c,
		onPointerLeave: l
	});
	return /* @__PURE__ */ G(J.Dropdown, {
		...p,
		...y,
		role: "menu",
		"aria-orientation": "vertical",
		ref: Mn(f, m, g?.setFloating),
		...h.getStyles("dropdown", {
			className: n,
			style: r,
			styles: i,
			classNames: t,
			withStaticClass: !1
		}),
		tabIndex: -1,
		"data-menu-dropdown": !0,
		onKeyDown: v,
		children: d
	});
});
Xo.classes = Eo, Xo.displayName = "@mantine/core/MenuSubDropdown";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuSubItem/MenuSubItem.mjs
var Zo = a((e) => {
	let { classNames: t, className: n, style: r, styles: i, vars: a, color: o, leftSection: s, rightSection: c, children: u, disabled: d, "data-disabled": f, closeMenuOnClick: m, ref: h, ...g } = C("MenuSubItem", null, e), _ = xo(), y = ft(wo), b = l(), { dir: x } = Kn(), S = H(null), w = g, T = o ? b.variantColorResolver({
		color: o,
		theme: b,
		variant: "light"
	}) : void 0, E = o ? v({
		color: o,
		theme: b
	}) : null, D = q(w.onKeyDown, (e) => {
		e.key === "ArrowRight" && (y?.open(), y?.focusFirstItem()), e.key === "ArrowLeft" && y?.parentContext && (y.parentContext.close(), y.parentContext.focusParentItem());
	}), O = q(w.onClick, () => {
		!f && m && _.closeDropdownImmediately();
	}), k = q(w.onMouseMove, () => {
		if (!_.hasSearch) return;
		let e = S.current?.closest("[data-menu-dropdown]");
		e && e.querySelectorAll("[data-menu-active]").forEach((t) => {
			t !== S.current && t.closest("[data-menu-dropdown]") === e && t.removeAttribute("data-menu-active");
		});
	}), A = y?.getReferenceProps({
		onMouseEnter: w.onMouseEnter,
		onMouseLeave: w.onMouseLeave,
		onPointerEnter: w.onPointerEnter,
		onPointerLeave: w.onPointerLeave
	});
	return /* @__PURE__ */ K(p, {
		onMouseDown: (e) => e.preventDefault(),
		...g,
		...A,
		unstyled: _.unstyled,
		tabIndex: _.menuItemTabIndex,
		..._.getStyles("item", {
			className: n,
			style: r,
			styles: i,
			classNames: t
		}),
		ref: Mn(S, h, y?.setReference),
		role: "menuitem",
		disabled: d,
		"data-menu-item": !0,
		"data-sub-menu-item": !0,
		"data-disabled": d || f || void 0,
		"data-mantine-stop-propagation": !0,
		onClick: O,
		onMouseMove: k,
		onKeyDown: ln({
			siblingSelector: "[data-menu-item]:not([data-disabled])",
			parentSelector: "[data-menu-dropdown]",
			activateOnFocus: !1,
			loop: _.loop,
			dir: x,
			orientation: "vertical",
			onKeyDown: D
		}),
		__vars: {
			"--menu-item-color": E?.isThemeColor && E?.shade === void 0 ? `var(--mantine-color-${E.color}-6)` : T?.color,
			"--menu-item-hover": T?.hover
		},
		children: [
			_.alignItemsLabels === "all" && /* @__PURE__ */ G("div", {
				..._.getStyles("itemIndicator", {
					styles: i,
					classNames: t
				}),
				"data-placeholder": !0
			}),
			s && /* @__PURE__ */ G("div", {
				..._.getStyles("itemSection", {
					styles: i,
					classNames: t
				}),
				"data-position": "left",
				children: s
			}),
			u && /* @__PURE__ */ G("div", {
				..._.getStyles("itemLabel", {
					styles: i,
					classNames: t
				}),
				"data-menu-item-label": !0,
				children: u
			}),
			/* @__PURE__ */ G("div", {
				..._.getStyles("itemSection", {
					styles: i,
					classNames: t
				}),
				"data-position": "right",
				children: c || /* @__PURE__ */ G(co, {
					..._.getStyles("chevron"),
					size: 14
				})
			})
		]
	});
});
Zo.classes = Eo, Zo.displayName = "@mantine/core/MenuSubItem";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuSubTarget/MenuSubTarget.mjs
function Qo({ children: e, refProp: t }) {
	if (!rn(e)) throw Error("Menu.Sub.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");
	return xo(), /* @__PURE__ */ G(J.Target, {
		refProp: t,
		popupType: "menu",
		children: e
	});
}
Qo.displayName = "@mantine/core/MenuSubTarget";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuSub/MenuSub.mjs
var $o = {
	offset: 0,
	position: "right-start",
	safeAreaPolygon: !0,
	transitionProps: { duration: 0 },
	openDelay: 0,
	middlewares: { shift: { crossAxis: !0 } }
};
function es(e) {
	let { children: t, closeDelay: n, openDelay: r, position: i, safeAreaPolygon: a, opened: o, onChange: s, ...c } = C("MenuSub", $o, e), l = kn(), [u, d] = Nn({
		value: o,
		finalValue: !1,
		onChange: s
	}), f = ft(wo), p = xo(), { dir: m } = Kn(), h = aa(m, i), g = f?.registerOpenSub ?? p.registerOpenSub, _ = H(null), v = B((e) => {
		let t = _.current;
		return t && t !== e && t(), _.current = e, () => {
			_.current === e && (_.current = null);
		};
	}, []), y = H(d);
	y.current = d;
	let b = B(() => y.current(!0), []), x = B(() => y.current(!1), []);
	V(() => {
		if (u) return g(x);
	}, [
		u,
		g,
		x
	]);
	let { context: S, refs: w } = Fi({
		placement: h,
		open: u,
		onOpenChange: (e) => {
			e ? b() : x();
		}
	}), { getReferenceProps: T, getFloatingProps: E } = zi([Si(S, {
		handleClose: a ? Gi(typeof a == "object" ? a : void 0) : void 0,
		delay: {
			open: r,
			close: n
		}
	})]);
	return /* @__PURE__ */ G(wo, {
		value: {
			opened: u,
			close: x,
			open: b,
			focusFirstItem: () => window.setTimeout(() => {
				document.getElementById(`${l}-dropdown`)?.querySelectorAll("[data-menu-item]:not([data-disabled])")[0]?.focus();
			}, 16),
			focusParentItem: () => window.setTimeout(() => {
				document.getElementById(`${l}-target`)?.focus();
			}, 16),
			parentContext: f,
			setReference: w.setReference,
			setFloating: w.setFloating,
			getReferenceProps: T,
			getFloatingProps: E,
			registerOpenSub: v
		},
		children: /* @__PURE__ */ G(J, {
			opened: u,
			onChange: (e) => e ? b() : x(),
			withinPortal: !1,
			withArrow: !1,
			id: l,
			position: i,
			...c,
			children: t
		})
	});
}
es.extend = (e) => e, es.displayName = "@mantine/core/MenuSub", es.Target = Qo, es.Dropdown = Xo, es.Item = Zo;
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/MenuTarget/MenuTarget.mjs
var ts = { refProp: "ref" };
function ns(e) {
	let { children: t, refProp: n, ...r } = C("MenuTarget", ts, e), i = Hn(t);
	if (!i) throw Error("Menu.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");
	let a = xo(), o = i.props, s = q(o.onClick, () => {
		a.trigger === "click" ? a.toggleDropdown() : a.trigger === "click-hover" && (a.setOpenedViaClick(!0), a.opened || a.openDropdown());
	}), c = q(o.onMouseEnter, () => (a.trigger === "hover" || a.trigger === "click-hover") && a.openDropdown()), l = q(o.onMouseLeave, () => {
		(a.trigger === "hover" || a.trigger === "click-hover" && !a.openedViaClick) && a.closeDropdown();
	});
	return /* @__PURE__ */ G(J.Target, {
		refProp: n,
		popupType: "menu",
		...r,
		children: lt(i, {
			onClick: s,
			onMouseEnter: c,
			onMouseLeave: l,
			"data-expanded": a.opened ? !0 : void 0
		})
	});
}
ns.displayName = "@mantine/core/MenuTarget";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Menu/Menu.mjs
var rs = {
	trapFocus: !0,
	closeOnItemClick: !0,
	withInitialFocusPlaceholder: !0,
	clickOutsideEvents: [
		"mousedown",
		"touchstart",
		"keydown"
	],
	loop: !0,
	trigger: "click",
	openDelay: 0,
	closeDelay: 100,
	menuItemTabIndex: -1,
	alignItemsLabels: "with-indicators"
}, Y = c((e) => {
	let t = C("Menu", rs, e), { children: n, onOpen: r, onClose: i, opened: a, defaultOpened: o, trapFocus: s, onChange: c, closeOnItemClick: l, loop: u, closeOnEscape: d, trigger: f, openDelay: p, closeDelay: m, classNames: h, styles: g, unstyled: _, variant: v, vars: y, menuItemTabIndex: b, keepMounted: x, withInitialFocusPlaceholder: w, attributes: T, onExitTransitionEnd: E, alignItemsLabels: D, checkIcon: O, ...k } = t, A = S({
		name: "Menu",
		classes: Eo,
		props: t,
		classNames: h,
		styles: g,
		unstyled: _,
		attributes: T
	}), [j, M] = Nn({
		value: a,
		defaultValue: o,
		finalValue: !1,
		onChange: c
	}), [N, P] = U(!1), ee = () => {
		M(!1), P(!1), j && i?.();
	}, te = () => {
		M(!0), !j && r?.();
	}, ne = () => {
		j ? ee() : te();
	}, { openDropdown: F, closeDropdown: re } = oa({
		open: te,
		close: ee,
		closeDelay: m,
		openDelay: p
	}), ie = H(null), ae = B((e) => {
		let t = ie.current;
		return t && t !== e && t(), ie.current = e, () => {
			ie.current === e && (ie.current = null);
		};
	}, []), I = H(0), [oe, se] = U(!1), ce = B(() => (I.current += 1, I.current === 1 && se(!0), () => {
		--I.current, I.current === 0 && se(!1);
	}), []), le = H(null), ue = () => {
		le.current?.(), E?.();
	}, de = (e) => pn("[data-menu-item]", "[data-menu-dropdown]", e), { resolvedClassNames: fe, resolvedStyles: pe } = Un({
		classNames: h,
		styles: g,
		props: t
	});
	return /* @__PURE__ */ G(bo, {
		value: {
			getStyles: A,
			opened: j,
			toggleDropdown: ne,
			getItemIndex: de,
			openedViaClick: N,
			setOpenedViaClick: P,
			closeOnItemClick: l,
			closeDropdown: f === "click" ? ee : re,
			openDropdown: f === "click" ? te : F,
			closeDropdownImmediately: ee,
			loop: u,
			trigger: f,
			unstyled: _,
			menuItemTabIndex: b,
			withInitialFocusPlaceholder: w,
			registerOpenSub: ae,
			hasSearch: oe,
			registerSearch: ce,
			searchExitClearRef: le,
			alignItemsLabels: D,
			checkIcon: O
		},
		children: /* @__PURE__ */ G(J, {
			returnFocus: !0,
			...k,
			opened: j,
			onChange: ne,
			defaultOpened: o,
			trapFocus: x ? !1 : s,
			closeOnEscape: d,
			__staticSelector: "Menu",
			classNames: fe,
			styles: pe,
			unstyled: _,
			variant: v,
			keepMounted: x,
			onExitTransitionEnd: ue,
			children: n
		})
	});
});
Y.displayName = "@mantine/core/Menu", Y.classes = Eo, Y.Item = Fo, Y.Label = Io, Y.Dropdown = Po, Y.Target = ns, Y.Divider = ko, Y.Search = Yo, Y.Sub = es, Y.CheckboxItem = Do, Y.CheckboxGroup = Co, Y.RadioItem = Bo, Y.RadioGroup = Ro, Y.ContextMenu = Oo;
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Tooltip/TooltipFloating/use-floating-tooltip.mjs
function is({ offset: e, position: t, defaultOpened: n }) {
	let [r, i] = U(n), a = H(null), { x: o, y: s, elements: c, refs: l, update: u, placement: d } = Fi({
		placement: t,
		middleware: [Ie({
			crossAxis: !0,
			padding: 5,
			rootBoundary: "document"
		})]
	}), f = d.includes("right") ? e : t.includes("left") ? e * -1 : 0, p = d.includes("bottom") ? e : t.includes("top") ? e * -1 : 0, m = B(({ clientX: e, clientY: t }) => {
		l.setPositionReference({ getBoundingClientRect() {
			return {
				width: 0,
				height: 0,
				x: e,
				y: t,
				left: e + f,
				top: t + p,
				right: e,
				bottom: t
			};
		} });
	}, [c.reference]);
	return V(() => {
		if (l.floating.current) {
			let e = a.current;
			e.addEventListener("mousemove", m);
			let t = $e(l.floating.current);
			return t.forEach((e) => {
				e.addEventListener("scroll", u);
			}), () => {
				e.removeEventListener("mousemove", m), t.forEach((e) => {
					e.removeEventListener("scroll", u);
				});
			};
		}
	}, [
		c.reference,
		l.floating.current,
		u,
		m,
		r
	]), {
		handleMouseMove: m,
		x: o,
		y: s,
		opened: r,
		setOpened: i,
		boundaryRef: a,
		floating: l.setFloating
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Tooltip/Tooltip.module.mjs
var as = {
	tooltip: "m_1b3c8819",
	arrow: "m_f898399f"
}, os = {
	refProp: "ref",
	withinPortal: !0,
	offset: 10,
	position: "right",
	zIndex: dn("popover")
}, ss = I((e, { radius: t, color: n }) => ({ tooltip: {
	"--tooltip-radius": t === void 0 ? void 0 : ce(t),
	"--tooltip-bg": n ? E(n, e) : void 0,
	"--tooltip-color": n ? "var(--mantine-color-white)" : void 0
} })), cs = c((e) => {
	let t = C("TooltipFloating", os, e), { children: n, refProp: r, withinPortal: i, style: a, className: o, classNames: s, styles: c, unstyled: u, radius: d, color: f, label: p, offset: m, position: h, multiline: g, zIndex: v, disabled: y, defaultOpened: b, variant: x, vars: w, portalProps: T, attributes: E, ref: D, ...O } = t, k = l(), A = S({
		name: "TooltipFloating",
		props: t,
		classes: as,
		className: o,
		style: a,
		classNames: s,
		styles: c,
		unstyled: u,
		attributes: E,
		rootSelector: "tooltip",
		vars: w,
		varsResolver: ss
	}), { handleMouseMove: j, x: M, y: N, opened: P, boundaryRef: ee, floating: te, setOpened: ne } = is({
		offset: m,
		position: h,
		defaultOpened: b
	}), F = Hn(n);
	if (!F) throw Error("[@mantine/core] Tooltip.Floating component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported");
	let re = Mn(ee, Vn(F), D), ie = F.props, ae = (e) => {
		ie.onMouseEnter?.(e), j(e), ne(!0);
	}, I = (e) => {
		ie.onMouseLeave?.(e), ne(!1);
	};
	return /* @__PURE__ */ K(W, { children: [/* @__PURE__ */ G(ha, {
		...T,
		withinPortal: i,
		children: /* @__PURE__ */ G(_, {
			...O,
			...A("tooltip", { style: {
				...Wn(a, k),
				zIndex: v,
				display: !y && P ? "block" : "none",
				top: (N && Math.round(N)) ?? "",
				left: (M && Math.round(M)) ?? ""
			} }),
			variant: x,
			ref: te,
			mod: { multiline: g },
			children: p
		})
	}), lt(F, {
		...ie,
		[r]: re,
		onMouseEnter: ae,
		onMouseLeave: I
	})] });
});
cs.classes = as, cs.varsResolver = ss, cs.displayName = "@mantine/core/TooltipFloating";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Tooltip/TooltipGroup/TooltipGroup.mjs
var ls = ut({ withinGroup: !1 }), us = {
	openDelay: 0,
	closeDelay: 0
};
function ds(e) {
	let { openDelay: t, closeDelay: n, children: r } = C("TooltipGroup", us, e);
	return /* @__PURE__ */ G(ls, {
		value: { withinGroup: !0 },
		children: /* @__PURE__ */ G(Ei, {
			delay: {
				open: t,
				close: n
			},
			children: r
		})
	});
}
ds.displayName = "@mantine/core/TooltipGroup", ds.extend = (e) => e;
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Tooltip/use-tooltip.mjs
function fs(e) {
	if (e === void 0) return {
		shift: !0,
		flip: !0
	};
	let t = { ...e };
	return e.shift === void 0 && (t.shift = !0), e.flip === void 0 && (t.flip = !0), t;
}
function ps(e) {
	let t = fs(e.middlewares), n = [Ze(e.offset)];
	return t.shift && n.push(Ie(typeof t.shift == "boolean" ? { padding: 8 } : {
		padding: 8,
		...t.shift
	})), t.flip && n.push(typeof t.flip == "boolean" ? Xe() : Xe(t.flip)), n.push(Ke({
		element: e.arrowRef,
		padding: e.arrowOffset
	})), t.inline ? n.push(typeof t.inline == "boolean" ? Pe() : Pe(t.inline)) : e.inline && n.push(Pe()), n;
}
function ms(e) {
	let [t, n] = U(e.defaultOpened), r = typeof e.opened == "boolean" ? e.opened : t, i = ft(ls).withinGroup, a = kn(), o = B((e) => {
		n(e), e && g(a);
	}, [a]), { x: s, y: c, context: l, refs: u, placement: d, middlewareData: { arrow: { x: f, y: p } = {} } } = Fi({
		strategy: e.strategy,
		placement: e.position,
		open: r,
		onOpenChange: o,
		middleware: ps(e),
		whileElementsMounted: Le
	}), { delay: m, currentId: h, setCurrentId: g } = Di(l, { id: a }), { getReferenceProps: _, getFloatingProps: v } = zi([
		Si(l, {
			enabled: e.events?.hover,
			delay: i ? m : {
				open: e.openDelay,
				close: e.closeDelay
			},
			mouseOnly: !e.events?.touch
		}),
		Li(l, {
			enabled: e.events?.focus,
			visibleOnly: !0
		}),
		Vi(l, { role: "tooltip" }),
		Ni(l, { enabled: e.opened === void 0 })
	]), y = H(d);
	oe(() => {
		y.current !== d && (y.current = d, e.onPositionChange?.(d));
	}, [d]);
	let b = r && h && h !== a;
	return {
		x: s,
		y: c,
		arrowX: f,
		arrowY: p,
		reference: u.setReference,
		floating: u.setFloating,
		getFloatingProps: v,
		getReferenceProps: _,
		isGroupPhase: b,
		opened: r,
		placement: d
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Tooltip/Tooltip.mjs
var hs = {
	position: "top",
	refProp: "ref",
	withinPortal: !0,
	arrowSize: 4,
	arrowOffset: 5,
	arrowRadius: 0,
	arrowPosition: "side",
	offset: 5,
	transitionProps: {
		duration: 100,
		transition: "fade"
	},
	events: {
		hover: !0,
		focus: !1,
		touch: !1
	},
	zIndex: dn("popover"),
	middlewares: {
		flip: !0,
		shift: !0,
		inline: !1
	}
}, gs = I((e, { radius: t, color: n, variant: r, autoContrast: i }) => {
	let a = e.variantColorResolver({
		theme: e,
		color: n || e.primaryColor,
		autoContrast: i,
		variant: r || "filled"
	});
	return { tooltip: {
		"--tooltip-radius": t === void 0 ? void 0 : ce(t),
		"--tooltip-bg": n ? a.background : void 0,
		"--tooltip-color": n ? a.color : void 0
	} };
}), X = c((e) => {
	let t = C("Tooltip", hs, e), { children: n, position: r, refProp: i, label: a, openDelay: o, closeDelay: s, onPositionChange: c, opened: l, defaultOpened: u, withinPortal: d, radius: f, color: p, classNames: m, styles: h, unstyled: g, style: v, className: y, withArrow: b, arrowSize: x, arrowOffset: w, arrowRadius: T, arrowPosition: E, offset: D, transitionProps: O, multiline: k, events: A, zIndex: j, disabled: M, onClick: P, onMouseEnter: ee, onMouseLeave: te, inline: ne, variant: F, keepMounted: ie, vars: ae, portalProps: I, mod: oe, floatingStrategy: se, middlewares: ce, autoContrast: le, attributes: ue, target: de, ref: fe, ...pe } = t, { dir: me } = Kn(), L = H(null), R = ms({
		position: aa(me, r),
		closeDelay: s,
		openDelay: o,
		onPositionChange: c,
		opened: l,
		defaultOpened: u,
		events: A,
		arrowRef: L,
		arrowOffset: w,
		offset: typeof D == "number" ? D + (b ? x / 2 : 0) : D,
		inline: ne,
		strategy: se,
		middlewares: ce
	});
	V(() => {
		let e = de instanceof HTMLElement ? de : typeof de == "string" ? document.querySelector(de) : de?.current || null;
		e && R.reference(e);
	}, [de, R]);
	let he = S({
		name: "Tooltip",
		props: t,
		classes: as,
		className: y,
		style: v,
		classNames: m,
		styles: h,
		unstyled: g,
		attributes: ue,
		rootSelector: "tooltip",
		vars: ae,
		varsResolver: gs
	}), ge = Hn(n);
	if (!de && !ge) throw Error("[@mantine/core] Tooltip component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported");
	let _e = he("tooltip"), ve = E === "merge" && b ? ra({
		position: R.placement,
		dir: me
	}) : void 0;
	if (de) {
		let e = _a(O, {
			duration: 100,
			transition: "fade"
		});
		return /* @__PURE__ */ G(W, { children: /* @__PURE__ */ G(ha, {
			...I,
			withinPortal: d,
			children: /* @__PURE__ */ G(N, {
				...e,
				keepMounted: ie,
				mounted: !M && !!R.opened,
				duration: R.isGroupPhase ? 10 : e.duration,
				children: (e) => /* @__PURE__ */ K(_, {
					...pe,
					"data-fixed": se === "fixed" || void 0,
					variant: F,
					mod: [{ multiline: k }, oe],
					..._e,
					...R.getFloatingProps({
						ref: R.floating,
						className: _e.className,
						style: {
							..._e.style,
							...e,
							...ve,
							zIndex: j,
							top: R.y ?? 0,
							left: R.x ?? 0
						}
					}),
					children: [a, /* @__PURE__ */ G(ia, {
						ref: L,
						arrowX: R.arrowX,
						arrowY: R.arrowY,
						visible: b,
						position: R.placement,
						arrowSize: x,
						arrowOffset: w,
						arrowRadius: T,
						arrowPosition: E,
						...he("arrow")
					})]
				})
			})
		}) });
	}
	let ye = ge.props, be = Mn(R.reference, Vn(ge), fe), xe = _a(O, {
		duration: 100,
		transition: "fade"
	});
	return /* @__PURE__ */ K(W, { children: [/* @__PURE__ */ G(ha, {
		...I,
		withinPortal: d,
		children: /* @__PURE__ */ G(N, {
			...xe,
			keepMounted: ie,
			mounted: !M && !!R.opened,
			duration: R.isGroupPhase ? 10 : xe.duration,
			children: (e) => /* @__PURE__ */ K(_, {
				...pe,
				"data-fixed": se === "fixed" || void 0,
				variant: F,
				mod: [{ multiline: k }, oe],
				...R.getFloatingProps({
					ref: R.floating,
					className: he("tooltip").className,
					style: {
						...he("tooltip").style,
						...e,
						...ve,
						zIndex: j,
						top: R.y ?? 0,
						left: R.x ?? 0
					}
				}),
				children: [a, /* @__PURE__ */ G(ia, {
					ref: L,
					arrowX: R.arrowX,
					arrowY: R.arrowY,
					visible: b,
					position: R.placement,
					arrowSize: x,
					arrowOffset: w,
					arrowRadius: T,
					arrowPosition: E,
					...he("arrow")
				})]
			})
		})
	}), lt(ge, R.getReferenceProps({
		onClick: P,
		onMouseEnter: ee,
		onMouseLeave: te,
		onMouseMove: t.onMouseMove,
		onPointerDown: t.onPointerDown,
		onPointerEnter: t.onPointerEnter,
		...ye,
		className: re(y, ye.className),
		[i]: be
	}))] });
});
X.classes = as, X.varsResolver = gs, X.displayName = "@mantine/core/Tooltip", X.Floating = cs, X.Group = ds;
var _s = x("outline", "align-center", "AlignCenter", [
	["path", {
		d: "M4 6l16 0",
		key: "svg-0"
	}],
	["path", {
		d: "M8 12l8 0",
		key: "svg-1"
	}],
	["path", {
		d: "M6 18l12 0",
		key: "svg-2"
	}]
]), vs = x("outline", "align-justified", "AlignJustified", [
	["path", {
		d: "M4 6l16 0",
		key: "svg-0"
	}],
	["path", {
		d: "M4 12l16 0",
		key: "svg-1"
	}],
	["path", {
		d: "M4 18l12 0",
		key: "svg-2"
	}]
]), ys = x("outline", "align-left", "AlignLeft", [
	["path", {
		d: "M4 6l16 0",
		key: "svg-0"
	}],
	["path", {
		d: "M4 12l10 0",
		key: "svg-1"
	}],
	["path", {
		d: "M4 18l14 0",
		key: "svg-2"
	}]
]), bs = x("outline", "align-right", "AlignRight", [
	["path", {
		d: "M4 6l16 0",
		key: "svg-0"
	}],
	["path", {
		d: "M10 12l10 0",
		key: "svg-1"
	}],
	["path", {
		d: "M6 18l14 0",
		key: "svg-2"
	}]
]), xs = x("outline", "alt", "Alt", [
	["path", {
		d: "M4 16v-6a2 2 0 1 1 4 0v6",
		key: "svg-0"
	}],
	["path", {
		d: "M4 13h4",
		key: "svg-1"
	}],
	["path", {
		d: "M11 8v8h4",
		key: "svg-2"
	}],
	["path", {
		d: "M16 8h4",
		key: "svg-3"
	}],
	["path", {
		d: "M18 8v8",
		key: "svg-4"
	}]
]), Ss = x("outline", "arrow-down", "ArrowDown", [
	["path", {
		d: "M12 5l0 14",
		key: "svg-0"
	}],
	["path", {
		d: "M18 13l-6 6",
		key: "svg-1"
	}],
	["path", {
		d: "M6 13l6 6",
		key: "svg-2"
	}]
]), Cs = x("outline", "arrow-left", "ArrowLeft", [
	["path", {
		d: "M5 12l14 0",
		key: "svg-0"
	}],
	["path", {
		d: "M5 12l6 6",
		key: "svg-1"
	}],
	["path", {
		d: "M5 12l6 -6",
		key: "svg-2"
	}]
]), ws = x("outline", "arrow-right", "ArrowRight", [
	["path", {
		d: "M5 12l14 0",
		key: "svg-0"
	}],
	["path", {
		d: "M13 18l6 -6",
		key: "svg-1"
	}],
	["path", {
		d: "M13 6l6 6",
		key: "svg-2"
	}]
]), Ts = x("outline", "arrow-up", "ArrowUp", [
	["path", {
		d: "M12 5l0 14",
		key: "svg-0"
	}],
	["path", {
		d: "M18 11l-6 -6",
		key: "svg-1"
	}],
	["path", {
		d: "M6 11l6 -6",
		key: "svg-2"
	}]
]), Es = x("outline", "arrows-minimize", "ArrowsMinimize", [
	["path", {
		d: "M5 9l4 0l0 -4",
		key: "svg-0"
	}],
	["path", {
		d: "M3 3l6 6",
		key: "svg-1"
	}],
	["path", {
		d: "M5 15l4 0l0 4",
		key: "svg-2"
	}],
	["path", {
		d: "M3 21l6 -6",
		key: "svg-3"
	}],
	["path", {
		d: "M19 9l-4 0l0 -4",
		key: "svg-4"
	}],
	["path", {
		d: "M15 9l6 -6",
		key: "svg-5"
	}],
	["path", {
		d: "M19 15l-4 0l0 4",
		key: "svg-6"
	}],
	["path", {
		d: "M15 15l6 6",
		key: "svg-7"
	}]
]), Ds = x("outline", "arrows-shuffle", "ArrowsShuffle", [
	["path", {
		d: "M18 4l3 3l-3 3",
		key: "svg-0"
	}],
	["path", {
		d: "M18 20l3 -3l-3 -3",
		key: "svg-1"
	}],
	["path", {
		d: "M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5",
		key: "svg-2"
	}],
	["path", {
		d: "M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3",
		key: "svg-3"
	}]
]), Os = x("outline", "blockquote", "Blockquote", [
	["path", {
		d: "M6 15h15",
		key: "svg-0"
	}],
	["path", {
		d: "M21 19h-15",
		key: "svg-1"
	}],
	["path", {
		d: "M15 11h6",
		key: "svg-2"
	}],
	["path", {
		d: "M21 7h-6",
		key: "svg-3"
	}],
	["path", {
		d: "M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2",
		key: "svg-4"
	}],
	["path", {
		d: "M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2",
		key: "svg-5"
	}]
]), Z = x("outline", "check", "Check", [["path", {
	d: "M5 12l5 5l10 -10",
	key: "svg-0"
}]]), ks = x("outline", "checkbox", "Checkbox", [["path", {
	d: "M9 11l3 3l8 -8",
	key: "svg-0"
}], ["path", {
	d: "M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9",
	key: "svg-1"
}]]), As = x("outline", "chevron-down", "ChevronDown", [["path", {
	d: "M6 9l6 6l6 -6",
	key: "svg-0"
}]]), js = x("outline", "clipboard", "Clipboard", [["path", {
	d: "M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2",
	key: "svg-0"
}], ["path", {
	d: "M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2",
	key: "svg-1"
}]]), Ms = x("outline", "code", "Code", [
	["path", {
		d: "M7 8l-4 4l4 4",
		key: "svg-0"
	}],
	["path", {
		d: "M17 8l4 4l-4 4",
		key: "svg-1"
	}],
	["path", {
		d: "M14 4l-4 16",
		key: "svg-2"
	}]
]), Ns = x("outline", "copy", "Copy", [["path", {
	d: "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
	key: "svg-0"
}], ["path", {
	d: "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
	key: "svg-1"
}]]), Ps = x("outline", "cut", "Cut", [
	["path", {
		d: "M4 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
		key: "svg-0"
	}],
	["path", {
		d: "M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
		key: "svg-1"
	}],
	["path", {
		d: "M9.15 14.85l8.85 -10.85",
		key: "svg-2"
	}],
	["path", {
		d: "M6 4l8.85 10.85",
		key: "svg-3"
	}]
]), Fs = x("outline", "dots", "Dots", [
	["path", {
		d: "M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		key: "svg-0"
	}],
	["path", {
		d: "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		key: "svg-1"
	}],
	["path", {
		d: "M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		key: "svg-2"
	}]
]), Is = x("outline", "download", "Download", [
	["path", {
		d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
		key: "svg-0"
	}],
	["path", {
		d: "M7 11l5 5l5 -5",
		key: "svg-1"
	}],
	["path", {
		d: "M12 4l0 12",
		key: "svg-2"
	}]
]), Ls = x("outline", "external-link", "ExternalLink", [
	["path", {
		d: "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6",
		key: "svg-0"
	}],
	["path", {
		d: "M11 13l9 -9",
		key: "svg-1"
	}],
	["path", {
		d: "M15 4h5v5",
		key: "svg-2"
	}]
]), Rs = x("outline", "file-type-pdf", "FileTypePdf", [
	["path", {
		d: "M14 3v4a1 1 0 0 0 1 1h4",
		key: "svg-0"
	}],
	["path", {
		d: "M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",
		key: "svg-1"
	}],
	["path", {
		d: "M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6",
		key: "svg-2"
	}],
	["path", {
		d: "M17 18h2",
		key: "svg-3"
	}],
	["path", {
		d: "M20 15h-3v6",
		key: "svg-4"
	}],
	["path", {
		d: "M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1",
		key: "svg-5"
	}]
]), zs = x("outline", "h-1", "H1", [
	["path", {
		d: "M19 18v-8l-2 2",
		key: "svg-0"
	}],
	["path", {
		d: "M4 6v12",
		key: "svg-1"
	}],
	["path", {
		d: "M12 6v12",
		key: "svg-2"
	}],
	["path", {
		d: "M11 18h2",
		key: "svg-3"
	}],
	["path", {
		d: "M3 18h2",
		key: "svg-4"
	}],
	["path", {
		d: "M4 12h8",
		key: "svg-5"
	}],
	["path", {
		d: "M3 6h2",
		key: "svg-6"
	}],
	["path", {
		d: "M11 6h2",
		key: "svg-7"
	}]
]), Bs = x("outline", "h-2", "H2", [
	["path", {
		d: "M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0",
		key: "svg-0"
	}],
	["path", {
		d: "M4 6v12",
		key: "svg-1"
	}],
	["path", {
		d: "M12 6v12",
		key: "svg-2"
	}],
	["path", {
		d: "M11 18h2",
		key: "svg-3"
	}],
	["path", {
		d: "M3 18h2",
		key: "svg-4"
	}],
	["path", {
		d: "M4 12h8",
		key: "svg-5"
	}],
	["path", {
		d: "M3 6h2",
		key: "svg-6"
	}],
	["path", {
		d: "M11 6h2",
		key: "svg-7"
	}]
]), Vs = x("outline", "h-3", "H3", [
	["path", {
		d: "M19 14a2 2 0 1 0 -2 -2",
		key: "svg-0"
	}],
	["path", {
		d: "M17 16a2 2 0 1 0 2 -2",
		key: "svg-1"
	}],
	["path", {
		d: "M4 6v12",
		key: "svg-2"
	}],
	["path", {
		d: "M12 6v12",
		key: "svg-3"
	}],
	["path", {
		d: "M11 18h2",
		key: "svg-4"
	}],
	["path", {
		d: "M3 18h2",
		key: "svg-5"
	}],
	["path", {
		d: "M4 12h8",
		key: "svg-6"
	}],
	["path", {
		d: "M3 6h2",
		key: "svg-7"
	}],
	["path", {
		d: "M11 6h2",
		key: "svg-8"
	}]
]), Hs = x("outline", "info-circle", "InfoCircle", [
	["path", {
		d: "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
		key: "svg-0"
	}],
	["path", {
		d: "M12 9h.01",
		key: "svg-1"
	}],
	["path", {
		d: "M11 12h1v4h1",
		key: "svg-2"
	}]
]), Us = x("outline", "layout-align-center", "LayoutAlignCenter", [
	["path", {
		d: "M12 4l0 5",
		key: "svg-0"
	}],
	["path", {
		d: "M12 15l0 5",
		key: "svg-1"
	}],
	["path", {
		d: "M6 11a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -2",
		key: "svg-2"
	}]
]), Ws = x("outline", "layout-align-left", "LayoutAlignLeft", [["path", {
	d: "M4 4l0 16",
	key: "svg-0"
}], ["path", {
	d: "M8 11a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -2",
	key: "svg-1"
}]]), Gs = x("outline", "layout-align-right", "LayoutAlignRight", [["path", {
	d: "M20 4l0 16",
	key: "svg-0"
}], ["path", {
	d: "M4 11a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -2",
	key: "svg-1"
}]]), Ks = x("outline", "link-off", "LinkOff", [
	["path", {
		d: "M9 15l3 -3m2 -2l1 -1",
		key: "svg-0"
	}],
	["path", {
		d: "M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464",
		key: "svg-1"
	}],
	["path", {
		d: "M3 3l18 18",
		key: "svg-2"
	}],
	["path", {
		d: "M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463",
		key: "svg-3"
	}]
]), qs = x("outline", "link", "Link", [
	["path", {
		d: "M9 15l6 -6",
		key: "svg-0"
	}],
	["path", {
		d: "M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464",
		key: "svg-1"
	}],
	["path", {
		d: "M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463",
		key: "svg-2"
	}]
]), Js = x("outline", "list-details", "ListDetails", [
	["path", {
		d: "M13 5h8",
		key: "svg-0"
	}],
	["path", {
		d: "M13 9h5",
		key: "svg-1"
	}],
	["path", {
		d: "M13 15h8",
		key: "svg-2"
	}],
	["path", {
		d: "M13 19h5",
		key: "svg-3"
	}],
	["path", {
		d: "M3 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",
		key: "svg-4"
	}],
	["path", {
		d: "M3 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",
		key: "svg-5"
	}]
]), Ys = x("outline", "list-numbers", "ListNumbers", [
	["path", {
		d: "M11 6h9",
		key: "svg-0"
	}],
	["path", {
		d: "M11 12h9",
		key: "svg-1"
	}],
	["path", {
		d: "M12 18h8",
		key: "svg-2"
	}],
	["path", {
		d: "M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4",
		key: "svg-3"
	}],
	["path", {
		d: "M6 10v-6l-2 2",
		key: "svg-4"
	}]
]), Xs = x("outline", "list", "List", [
	["path", {
		d: "M9 6l11 0",
		key: "svg-0"
	}],
	["path", {
		d: "M9 12l11 0",
		key: "svg-1"
	}],
	["path", {
		d: "M9 18l11 0",
		key: "svg-2"
	}],
	["path", {
		d: "M5 6l0 .01",
		key: "svg-3"
	}],
	["path", {
		d: "M5 12l0 .01",
		key: "svg-4"
	}],
	["path", {
		d: "M5 18l0 .01",
		key: "svg-5"
	}]
]), Zs = x("outline", "player-skip-forward", "PlayerSkipForward", [["path", {
	d: "M4 5v14l12 -7l-12 -7",
	key: "svg-0"
}], ["path", {
	d: "M20 5l0 14",
	key: "svg-1"
}]]), Qs = x("outline", "plus", "Plus", [["path", {
	d: "M12 5l0 14",
	key: "svg-0"
}], ["path", {
	d: "M5 12l14 0",
	key: "svg-1"
}]]), $s = x("outline", "quote", "Quote", [["path", {
	d: "M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5",
	key: "svg-0"
}], ["path", {
	d: "M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5",
	key: "svg-1"
}]]), ec = x("outline", "refresh", "Refresh", [["path", {
	d: "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4",
	key: "svg-0"
}], ["path", {
	d: "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4",
	key: "svg-1"
}]]), tc = x("outline", "repeat", "Repeat", [["path", {
	d: "M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3",
	key: "svg-0"
}], ["path", {
	d: "M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3",
	key: "svg-1"
}]]), nc = x("outline", "text-wrap", "TextWrap", [
	["path", {
		d: "M4 6l16 0",
		key: "svg-0"
	}],
	["path", {
		d: "M4 18l5 0",
		key: "svg-1"
	}],
	["path", {
		d: "M4 12h13a3 3 0 0 1 0 6h-4l2 -2m0 4l-2 -2",
		key: "svg-2"
	}]
]), rc = x("outline", "trash", "Trash", [
	["path", {
		d: "M4 7l16 0",
		key: "svg-0"
	}],
	["path", {
		d: "M10 11l0 6",
		key: "svg-1"
	}],
	["path", {
		d: "M14 11l0 6",
		key: "svg-2"
	}],
	["path", {
		d: "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12",
		key: "svg-3"
	}],
	["path", {
		d: "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",
		key: "svg-4"
	}]
]), ic = x("outline", "typography", "Typography", [
	["path", {
		d: "M4 20l3 0",
		key: "svg-0"
	}],
	["path", {
		d: "M14 20l7 0",
		key: "svg-1"
	}],
	["path", {
		d: "M6.9 15l6.9 0",
		key: "svg-2"
	}],
	["path", {
		d: "M10.2 6.3l5.8 13.7",
		key: "svg-3"
	}],
	["path", {
		d: "M5 20l6 -16l2 0l7 16",
		key: "svg-4"
	}]
]), ac = x("filled", "caret-right-filled", "CaretRightFilled", [["path", {
	d: "M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z",
	key: "svg-0"
}]]);
//#endregion
//#region src/hooks/use-clipboard.ts
s();
var oc = ee();
function sc(e = { timeout: 2e3 }) {
	let [t, n] = U(null), [r, i] = U(!1), [a, o] = U(null), s = (t) => {
		window.clearTimeout(a), o(window.setTimeout(() => i(!1), e.timeout)), i(t);
	};
	return {
		copy: (e) => {
			if ("clipboard" in navigator) navigator.clipboard.writeText(e).then(() => s(!0)).catch(() => {
				try {
					(0, oc.execCommandCopy)(e), s(!0);
				} catch (e) {
					n(e instanceof Error ? e : /* @__PURE__ */ Error("Failed to copy"));
				}
			});
			else try {
				(0, oc.execCommandCopy)(e), s(!0);
			} catch (e) {
				n(e instanceof Error ? e : /* @__PURE__ */ Error("Failed to copy"));
			}
		},
		reset: () => {
			i(!1), n(null), window.clearTimeout(a);
		},
		error: t,
		copied: r
	};
}
//#endregion
//#region src/components/common/copy-button.tsx
var cc = { timeout: 1e3 };
function lc(e) {
	let { children: t, timeout: n, value: r, ...i } = C("CopyButton", cc, e), a = sc({ timeout: n });
	return /* @__PURE__ */ G(W, { children: t({
		copy: () => a.copy(r),
		copied: a.copied,
		...i
	}) });
}
lc.displayName = "@mantine/core/CopyButton";
//#endregion
//#region ../../node_modules/.pnpm/@tiptap+extension-bubble-menu@3.29.2_@tiptap+core@3.29.2_@tiptap+pm@3.29.2__@tiptap+pm@3.29.2/node_modules/@tiptap/extension-bubble-menu/dist/index.js
function uc(e, t) {
	let n = Math.min(e.top, t.top), r = Math.max(e.bottom, t.bottom), i = Math.min(e.left, t.left), a = Math.max(e.right, t.right) - i, o = r - n;
	return new DOMRect(i, n, a, o);
}
var dc = class {
	constructor({ editor: e, element: t, view: n, pluginKey: r = "bubbleMenu", updateDelay: i = 250, resizeDelay: a = 60, shouldShow: o, appendTo: s, getReferencedVirtualElement: c, options: l }) {
		this.preventHide = !1, this.isVisible = !1, this.scrollTarget = window, this.floatingUIOptions = {
			strategy: "absolute",
			placement: "top",
			offset: 8,
			flip: {},
			shift: {},
			arrow: !1,
			size: !1,
			autoPlacement: !1,
			hide: !1,
			inline: !1,
			onShow: void 0,
			onHide: void 0,
			onUpdate: void 0,
			onDestroy: void 0
		}, this.shouldShow = ({ view: e, state: t, from: n, to: r }) => {
			let { doc: i, selection: a } = t, { empty: o } = a, s = !i.textBetween(n, r).length && ue(t.selection), c = this.element.contains(document.activeElement);
			return !(!(e.hasFocus() || c) || o || s || !this.editor.isEditable);
		}, this.mousedownHandler = () => {
			this.preventHide = !0;
		}, this.dragstartHandler = () => {
			this.hide();
		}, this.resizeHandler = () => {
			this.resizeDebounceTimer && clearTimeout(this.resizeDebounceTimer), this.resizeDebounceTimer = window.setTimeout(() => {
				this.updatePosition();
			}, this.resizeDelay);
		}, this.focusHandler = () => {
			setTimeout(() => this.update(this.editor.view));
		}, this.blurHandler = ({ event: e }) => {
			if (this.editor.isDestroyed) {
				this.destroy();
				return;
			}
			if (this.preventHide) {
				this.preventHide = !1;
				return;
			}
			e?.relatedTarget && this.element.parentNode?.contains(e.relatedTarget) || e?.relatedTarget !== this.editor.view.dom && this.hide();
		}, this.handleDebouncedUpdate = (e, t) => {
			let n = !t?.selection.eq(e.state.selection), r = !t?.doc.eq(e.state.doc);
			!n && !r || (this.updateDebounceTimer && clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = window.setTimeout(() => {
				this.updateHandler(e, n, r, t);
			}, this.updateDelay));
		}, this.updateHandler = (e, t, n, r) => {
			let { composing: i } = e;
			if (!(i || !t && !n)) {
				if (!this.getShouldShow(r)) {
					this.hide();
					return;
				}
				this.show(), this.updatePosition();
			}
		}, this.transactionHandler = ({ transaction: e }) => {
			let t = e.getMeta(this.pluginKey);
			t === "updatePosition" ? this.updatePosition() : t && typeof t == "object" && t.type === "updateOptions" ? this.updateOptions(t.options) : t === "hide" ? this.hide() : t === "show" && (this.updatePosition(), this.show());
		}, this.editor = e, this.element = t, this.view = n, this.pluginKey = r, this.updateDelay = i, this.resizeDelay = a, this.appendTo = s, this.scrollTarget = l?.scrollTarget ?? window, this.getReferencedVirtualElement = c, this.floatingUIOptions = {
			...this.floatingUIOptions,
			...l
		}, this.element.tabIndex = 0, o && (this.shouldShow = o), this.element.addEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.view.dom.addEventListener("dragstart", this.dragstartHandler), this.editor.on("focus", this.focusHandler), this.editor.on("blur", this.blurHandler), this.editor.on("transaction", this.transactionHandler), window.addEventListener("resize", this.resizeHandler), this.scrollTarget.addEventListener("scroll", this.resizeHandler), this.update(n, n.state), this.getShouldShow() && (this.show(), this.updatePosition());
	}
	get middlewares() {
		let e = [];
		return this.floatingUIOptions.flip && e.push(Zt(typeof this.floatingUIOptions.flip == "boolean" ? void 0 : this.floatingUIOptions.flip)), this.floatingUIOptions.shift && e.push(Xt(typeof this.floatingUIOptions.shift == "boolean" ? void 0 : this.floatingUIOptions.shift)), this.floatingUIOptions.offset && e.push(Jt(typeof this.floatingUIOptions.offset == "boolean" ? void 0 : this.floatingUIOptions.offset)), this.floatingUIOptions.arrow && e.push(en(this.floatingUIOptions.arrow)), this.floatingUIOptions.size && e.push(Qt(typeof this.floatingUIOptions.size == "boolean" ? void 0 : this.floatingUIOptions.size)), this.floatingUIOptions.autoPlacement && e.push(Yt(typeof this.floatingUIOptions.autoPlacement == "boolean" ? void 0 : this.floatingUIOptions.autoPlacement)), this.floatingUIOptions.hide && e.push($t(typeof this.floatingUIOptions.hide == "boolean" ? void 0 : this.floatingUIOptions.hide)), this.floatingUIOptions.inline && e.push(tn(typeof this.floatingUIOptions.inline == "boolean" ? void 0 : this.floatingUIOptions.inline)), e;
	}
	get virtualElement() {
		let { selection: e } = this.editor.state, t = this.getReferencedVirtualElement?.call(this);
		if (t) return t;
		if (!this.view?.dom?.parentNode) return;
		let n = h(this.view, e.from, e.to), r = {
			getBoundingClientRect: () => n,
			getClientRects: () => [n]
		};
		if (e instanceof d) {
			let t = this.view.nodeDOM(e.from), n = t.dataset.nodeViewWrapper ? t : t.querySelector("[data-node-view-wrapper]");
			n && (t = n), t && (r = {
				getBoundingClientRect: () => t.getBoundingClientRect(),
				getClientRects: () => [t.getBoundingClientRect()]
			});
		}
		if (e instanceof fe) {
			let { $anchorCell: t, $headCell: n } = e, i = t ? t.pos : n.pos, a = n ? n.pos : t.pos, o = this.view.nodeDOM(i), s = this.view.nodeDOM(a);
			if (!o || !s) return;
			let c = o === s ? o.getBoundingClientRect() : uc(o.getBoundingClientRect(), s.getBoundingClientRect());
			r = {
				getBoundingClientRect: () => c,
				getClientRects: () => [c]
			};
		}
		return r;
	}
	updatePosition() {
		if (!this.isVisible) return;
		let e = this.virtualElement;
		e && nn(e, this.element, {
			placement: this.floatingUIOptions.placement,
			strategy: this.floatingUIOptions.strategy,
			middleware: this.middlewares
		}).then(({ x: e, y: t, strategy: n, middlewareData: r }) => {
			if (!(!this.isVisible || this.editor.isDestroyed || !this.element.isConnected)) {
				if (r.hide?.referenceHidden || r.hide?.escaped) {
					this.element.style.visibility = "hidden";
					return;
				}
				this.element.style.visibility = "visible", this.element.style.width = "max-content", this.element.style.position = n, this.element.style.left = `${e}px`, this.element.style.top = `${t}px`, this.isVisible && this.floatingUIOptions.onUpdate && this.floatingUIOptions.onUpdate();
			}
		});
	}
	update(e, t) {
		let { state: n } = e, r = n.selection.from !== n.selection.to;
		if (this.updateDelay > 0 && r) {
			this.handleDebouncedUpdate(e, t);
			return;
		}
		let i = !t?.selection.eq(e.state.selection), a = !t?.doc.eq(e.state.doc);
		this.updateHandler(e, i, a, t);
	}
	getShouldShow(e) {
		let { state: t } = this.view, { selection: n } = t, { ranges: r } = n, i = Math.min(...r.map((e) => e.$from.pos)), a = Math.max(...r.map((e) => e.$to.pos));
		return this.shouldShow?.call(this, {
			editor: this.editor,
			element: this.element,
			view: this.view,
			state: t,
			oldState: e,
			from: i,
			to: a
		}) || !1;
	}
	show() {
		var e;
		this.isVisible || (this.element.style.visibility = "visible", this.element.style.opacity = "1", (e = (typeof this.appendTo == "function" ? this.appendTo() : this.appendTo) ?? this.view.dom.parentElement) == null || e.appendChild(this.element), this.floatingUIOptions.onShow && this.floatingUIOptions.onShow(), this.isVisible = !0);
	}
	hide() {
		this.isVisible &&= (this.element.style.visibility = "hidden", this.element.style.opacity = "0", this.element.remove(), this.floatingUIOptions.onHide && this.floatingUIOptions.onHide(), !1);
	}
	updateOptions(e) {
		if (e.updateDelay !== void 0 && (this.updateDelay = e.updateDelay), e.resizeDelay !== void 0 && (this.resizeDelay = e.resizeDelay), e.appendTo !== void 0 && (this.appendTo = e.appendTo), e.getReferencedVirtualElement !== void 0 && (this.getReferencedVirtualElement = e.getReferencedVirtualElement), e.shouldShow !== void 0 && e.shouldShow && (this.shouldShow = e.shouldShow), e.options !== void 0) {
			let t = e.options.scrollTarget ?? window;
			t !== this.scrollTarget && (this.scrollTarget.removeEventListener("scroll", this.resizeHandler), this.scrollTarget = t, this.scrollTarget.addEventListener("scroll", this.resizeHandler)), this.floatingUIOptions = {
				...this.floatingUIOptions,
				...e.options
			};
		}
	}
	destroy() {
		this.hide(), this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.view.dom.removeEventListener("dragstart", this.dragstartHandler), window.removeEventListener("resize", this.resizeHandler), this.scrollTarget.removeEventListener("scroll", this.resizeHandler), this.editor.off("focus", this.focusHandler), this.editor.off("blur", this.blurHandler), this.editor.off("transaction", this.transactionHandler), this.floatingUIOptions.onDestroy && this.floatingUIOptions.onDestroy();
	}
}, fc = (e) => new b({
	key: typeof e.pluginKey == "string" ? new de(e.pluginKey) : e.pluginKey,
	view: (t) => new dc({
		view: t,
		...e
	})
});
//#endregion
//#region ../../node_modules/.pnpm/@tiptap+extension-floating-menu@3.29.2_@floating-ui+dom@1.7.3_@tiptap+core@3.29.2_@tiptap+pm@3.29.2__@tiptap+pm@3.29.2/node_modules/@tiptap/extension-floating-menu/dist/index.js
u.create({
	name: "bubbleMenu",
	addOptions() {
		return {
			element: null,
			pluginKey: "bubbleMenu",
			updateDelay: void 0,
			appendTo: void 0,
			shouldShow: null
		};
	},
	addProseMirrorPlugins() {
		return this.options.element ? [fc({
			pluginKey: this.options.pluginKey,
			editor: this.editor,
			element: this.options.element,
			updateDelay: this.options.updateDelay,
			options: this.options.options,
			appendTo: this.options.appendTo,
			getReferencedVirtualElement: this.options.getReferencedVirtualElement,
			shouldShow: this.options.shouldShow
		})] : [];
	}
}), o();
var pc = class {
	constructor({ editor: e, element: t, view: n, pluginKey: r = "floatingMenu", updateDelay: i = 250, resizeDelay: a = 60, options: o, appendTo: s, shouldShow: c }) {
		this.preventHide = !1, this.isVisible = !1, this.scrollTarget = window, this.shouldShow = ({ view: e, state: t }) => {
			let { selection: n } = t, { $anchor: r, empty: i } = n, a = r.depth === 1, o = r.parent.isTextblock && !r.parent.type.spec.code && !r.parent.textContent && r.parent.childCount === 0 && !this.getTextContent(r.parent);
			return !(!e.hasFocus() || !i || !a || !o || !this.editor.isEditable);
		}, this.floatingUIOptions = {
			strategy: "absolute",
			placement: "right",
			offset: 8,
			flip: {},
			shift: {},
			arrow: !1,
			size: !1,
			autoPlacement: !1,
			hide: !1,
			inline: !1
		}, this.updateHandler = (e, t, n, r) => {
			let { composing: i } = e;
			if (!(i || !t && !n)) {
				if (!this.getShouldShow(r)) {
					this.hide();
					return;
				}
				this.updatePosition(), this.show();
			}
		}, this.mousedownHandler = () => {
			this.preventHide = !0;
		}, this.focusHandler = () => {
			setTimeout(() => this.update(this.editor.view));
		}, this.blurHandler = ({ event: e }) => {
			if (this.preventHide) {
				this.preventHide = !1;
				return;
			}
			e?.relatedTarget && this.element.parentNode?.contains(e.relatedTarget) || e?.relatedTarget !== this.editor.view.dom && this.hide();
		}, this.transactionHandler = ({ transaction: e }) => {
			let t = e.getMeta(this.pluginKey);
			t === "updatePosition" ? this.updatePosition() : t && typeof t == "object" && t.type === "updateOptions" ? this.updateOptions(t.options) : t === "hide" ? this.hide() : t === "show" && (this.updatePosition(), this.show());
		}, this.resizeHandler = () => {
			this.resizeDebounceTimer && clearTimeout(this.resizeDebounceTimer), this.resizeDebounceTimer = window.setTimeout(() => {
				this.updatePosition();
			}, this.resizeDelay);
		}, this.editor = e, this.element = t, this.view = n, this.pluginKey = r, this.updateDelay = i, this.resizeDelay = a, this.appendTo = s, this.scrollTarget = o?.scrollTarget ?? window, this.floatingUIOptions = {
			...this.floatingUIOptions,
			...o
		}, this.element.tabIndex = 0, c && (this.shouldShow = c), this.element.addEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.editor.on("focus", this.focusHandler), this.editor.on("blur", this.blurHandler), this.editor.on("transaction", this.transactionHandler), window.addEventListener("resize", this.resizeHandler), this.scrollTarget.addEventListener("scroll", this.resizeHandler), this.update(n, n.state), this.getShouldShow() && (this.show(), this.updatePosition());
	}
	getTextContent(e) {
		return ae(e, { textSerializers: ne(this.editor.schema) });
	}
	get middlewares() {
		let e = [];
		return this.floatingUIOptions.flip && e.push(Zt(typeof this.floatingUIOptions.flip == "boolean" ? void 0 : this.floatingUIOptions.flip)), this.floatingUIOptions.shift && e.push(Xt(typeof this.floatingUIOptions.shift == "boolean" ? void 0 : this.floatingUIOptions.shift)), this.floatingUIOptions.offset && e.push(Jt(typeof this.floatingUIOptions.offset == "boolean" ? void 0 : this.floatingUIOptions.offset)), this.floatingUIOptions.arrow && e.push(en(this.floatingUIOptions.arrow)), this.floatingUIOptions.size && e.push(Qt(typeof this.floatingUIOptions.size == "boolean" ? void 0 : this.floatingUIOptions.size)), this.floatingUIOptions.autoPlacement && e.push(Yt(typeof this.floatingUIOptions.autoPlacement == "boolean" ? void 0 : this.floatingUIOptions.autoPlacement)), this.floatingUIOptions.hide && e.push($t(typeof this.floatingUIOptions.hide == "boolean" ? void 0 : this.floatingUIOptions.hide)), this.floatingUIOptions.inline && e.push(tn(typeof this.floatingUIOptions.inline == "boolean" ? void 0 : this.floatingUIOptions.inline)), e;
	}
	getShouldShow(e) {
		let { state: t } = this.view, { selection: n } = t, { ranges: r } = n, i = Math.min(...r.map((e) => e.$from.pos)), a = Math.max(...r.map((e) => e.$to.pos));
		return this.shouldShow?.call(this, {
			editor: this.editor,
			view: this.view,
			state: t,
			oldState: e,
			from: i,
			to: a
		});
	}
	updateOptions(e) {
		if (e.updateDelay !== void 0 && (this.updateDelay = e.updateDelay), e.resizeDelay !== void 0 && (this.resizeDelay = e.resizeDelay), e.appendTo !== void 0 && (this.appendTo = e.appendTo), e.shouldShow !== void 0 && e.shouldShow && (this.shouldShow = e.shouldShow), e.options !== void 0) {
			let t = e.options.scrollTarget ?? window;
			t !== this.scrollTarget && (this.scrollTarget.removeEventListener("scroll", this.resizeHandler), this.scrollTarget = t, this.scrollTarget.addEventListener("scroll", this.resizeHandler)), this.floatingUIOptions = {
				...this.floatingUIOptions,
				...e.options
			};
		}
	}
	updatePosition() {
		if (!this.view?.dom?.parentNode) return;
		let { selection: e } = this.editor.state, t = h(this.view, e.from, e.to);
		nn({
			getBoundingClientRect: () => t,
			getClientRects: () => [t]
		}, this.element, {
			placement: this.floatingUIOptions.placement,
			strategy: this.floatingUIOptions.strategy,
			middleware: this.middlewares
		}).then(({ x: e, y: t, strategy: n, middlewareData: r }) => {
			if (r.hide?.referenceHidden || r.hide?.escaped) {
				this.element.style.visibility = "hidden";
				return;
			}
			this.element.style.visibility = "visible", this.element.style.width = "max-content", this.element.style.position = n, this.element.style.left = `${e}px`, this.element.style.top = `${t}px`, this.isVisible && this.floatingUIOptions.onUpdate && this.floatingUIOptions.onUpdate();
		});
	}
	update(e, t) {
		let n = !t?.selection.eq(e.state.selection), r = !t?.doc.eq(e.state.doc);
		this.updateHandler(e, n, r, t);
	}
	show() {
		var e;
		this.isVisible || (this.element.style.visibility = "visible", this.element.style.opacity = "1", (e = (typeof this.appendTo == "function" ? this.appendTo() : this.appendTo) ?? this.view.dom.parentElement) == null || e.appendChild(this.element), this.floatingUIOptions.onShow && this.floatingUIOptions.onShow(), this.isVisible = !0);
	}
	hide() {
		this.isVisible &&= (this.element.style.visibility = "hidden", this.element.style.opacity = "0", this.element.remove(), this.floatingUIOptions.onHide && this.floatingUIOptions.onHide(), !1);
	}
	destroy() {
		this.hide(), this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: !0 }), window.removeEventListener("resize", this.resizeHandler), this.scrollTarget.removeEventListener("scroll", this.resizeHandler), this.editor.off("focus", this.focusHandler), this.editor.off("blur", this.blurHandler), this.editor.off("transaction", this.transactionHandler), this.floatingUIOptions.onDestroy && this.floatingUIOptions.onDestroy();
	}
}, mc = (e) => new b({
	key: typeof e.pluginKey == "string" ? new de(e.pluginKey) : e.pluginKey,
	view: (t) => new pc({
		view: t,
		...e
	})
});
//#endregion
//#region ../../node_modules/.pnpm/@tiptap+react@3.29.2_@floating-ui+dom@1.7.3_@tiptap+core@3.29.2_@tiptap+pm@3.29.2__@tip_9e4c6b8ace824e390727a2def7f07f7f/node_modules/@tiptap/react/dist/menus/index.js
u.create({
	name: "floatingMenu",
	addOptions() {
		return {
			element: null,
			options: {},
			pluginKey: "floatingMenu",
			updateDelay: void 0,
			resizeDelay: void 0,
			appendTo: void 0,
			shouldShow: null
		};
	},
	addCommands() {
		return { updateFloatingMenuPosition: () => ({ tr: e, dispatch: t }) => (t && e.setMeta(this.options.pluginKey, "updatePosition"), !0) };
	},
	addProseMirrorPlugins() {
		return this.options.element ? [mc({
			pluginKey: this.options.pluginKey,
			editor: this.editor,
			element: this.options.element,
			updateDelay: this.options.updateDelay,
			resizeDelay: this.options.resizeDelay,
			options: this.options.options,
			appendTo: this.options.appendTo,
			shouldShow: this.options.shouldShow
		})] : [];
	}
}), o();
function hc(e, t) {
	return e ?? new de(t);
}
var gc = typeof window < "u" ? ht : V, _c = /* @__PURE__ */ new Set([
	"left",
	"opacity",
	"position",
	"top",
	"visibility",
	"width"
]), vc = /* @__PURE__ */ new Set(/* @__PURE__ */ "animationIterationCount.aspectRatio.borderImageOutset.borderImageSlice.borderImageWidth.columnCount.columns.fillOpacity.flex.flexGrow.flexShrink.fontWeight.gridArea.gridColumn.gridColumnEnd.gridColumnStart.gridRow.gridRowEnd.gridRowStart.lineClamp.lineHeight.opacity.order.orphans.scale.stopOpacity.strokeDasharray.strokeDashoffset.strokeMiterlimit.strokeOpacity.strokeWidth.tabSize.widows.zIndex.zoom".split(".")), yc = /* @__PURE__ */ new Set([
	"children",
	"className",
	"style"
]), bc = /* @__PURE__ */ new Set(["tabIndex"]), xc = /* @__PURE__ */ new Set([
	"accessKey",
	"autoCapitalize",
	"contentEditable",
	"contextMenu",
	"dir",
	"draggable",
	"enterKeyHint",
	"hidden",
	"id",
	"lang",
	"nonce",
	"role",
	"slot",
	"spellCheck",
	"tabIndex",
	"title",
	"translate"
]), Sc = {
	Blur: "focusout",
	DoubleClick: "dblclick",
	Focus: "focusin",
	MouseEnter: "mouseenter",
	MouseLeave: "mouseleave"
};
function Cc(e, t) {
	return /^on[A-Z]/.test(e) && typeof t == "function";
}
function wc(e) {
	return e.startsWith("aria-") || e.startsWith("data-"), e;
}
function Tc(e) {
	return e.startsWith("aria-") || e.startsWith("data-") || xc.has(e);
}
function Ec(e) {
	return e.startsWith("--") ? e : e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function Dc(e) {
	let t = e.endsWith("Capture"), n = (t ? e.slice(0, -7) : e).slice(2);
	return {
		eventName: Sc[n] ?? n.toLowerCase(),
		options: t ? { capture: !0 } : void 0
	};
}
function Oc(e, t) {
	let n = t.defaultPrevented, r = !1, i = Object.create(t);
	return Object.defineProperties(i, {
		nativeEvent: { value: t },
		currentTarget: { value: e },
		target: { value: t.target },
		persist: { value: () => void 0 },
		isDefaultPrevented: { value: () => n },
		isPropagationStopped: { value: () => r },
		preventDefault: { value: () => {
			n = !0, t.preventDefault();
		} },
		stopPropagation: { value: () => {
			r = !0, t.stopPropagation();
		} }
	}), i;
}
function kc(e) {
	return bc.has(e);
}
function Ac(e, t, n) {
	if (t === "tabIndex") {
		e.tabIndex = Number(n);
		return;
	}
	e[t] = n;
}
function jc(e, t) {
	if (t === "tabIndex") {
		e.removeAttribute("tabindex");
		return;
	}
	let n = e[t];
	if (typeof n == "boolean") {
		e[t] = !1;
		return;
	}
	if (typeof n == "number") {
		e[t] = 0;
		return;
	}
	e[t] = "";
}
function Mc(e, t) {
	return typeof t != "number" || t === 0 || e.startsWith("--") || vc.has(e) ? String(t) : `${t}px`;
}
function Nc(e, t) {
	_c.has(t) || e.style.removeProperty(Ec(t));
}
function Pc(e, t, n) {
	_c.has(t) || e.style.setProperty(Ec(t), Mc(t, n));
}
function Fc(e, t, n) {
	(/* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(n)])).forEach((r) => {
		if (yc.has(r) || !Tc(r) || Cc(r, t[r]) || Cc(r, n[r])) return;
		let i = t[r], a = n[r];
		if (i === a) return;
		let o = wc(r);
		if (a == null || a === !1) {
			kc(r) && jc(e, r), e.removeAttribute(o);
			return;
		}
		if (a === !0) {
			kc(r) && Ac(e, r, !0), e.setAttribute(o, "");
			return;
		}
		if (kc(r)) {
			Ac(e, r, a);
			return;
		}
		e.setAttribute(o, String(a));
	});
}
function Ic(e, t, n) {
	if (t !== n) {
		if (n) {
			e.className = n;
			return;
		}
		e.removeAttribute("class");
	}
}
function Lc(e, t, n) {
	let r = t ?? {}, i = n ?? {};
	(/* @__PURE__ */ new Set([...Object.keys(r), ...Object.keys(i)])).forEach((t) => {
		let n = r[t], a = i[t];
		if (n !== a) {
			if (a == null) {
				Nc(e, t);
				return;
			}
			Pc(e, t, a);
		}
	});
}
function Rc(e, t, n) {
	t.forEach(({ eventName: t, listener: n, options: r }) => {
		e.removeEventListener(t, n, r);
	});
	let r = [];
	return Object.entries(n).forEach(([t, n]) => {
		if (!Cc(t, n)) return;
		let { eventName: i, options: a } = Dc(t), o = (t) => {
			n(Oc(e, t));
		};
		e.addEventListener(i, o, a), r.push({
			eventName: i,
			listener: o,
			options: a
		});
	}), r;
}
function zc(e, t) {
	let n = H({}), r = H([]);
	gc(() => {
		let i = n.current;
		return Ic(e, i.className, t.className), Lc(e, i.style, t.style), Fc(e, i, t), r.current = Rc(e, r.current, t), n.current = t, () => {
			r.current.forEach(({ eventName: t, listener: n, options: r }) => {
				e.removeEventListener(t, n, r);
			}), r.current = [];
		};
	}, [e, t]);
}
var Bc = ot.forwardRef(({ pluginKey: e, editor: t, updateDelay: n, resizeDelay: i, appendTo: a, shouldShow: o = null, getReferencedVirtualElement: s, options: c, children: l, ...u }, d) => {
	let f = H(document.createElement("div")), p = H(hc(e, "bubbleMenu")).current;
	zc(f.current, u), typeof d == "function" ? d(f.current) : d && (d.current = f.current);
	let { editor: m } = r(), h = t || m, g = {
		updateDelay: n,
		resizeDelay: i,
		appendTo: a,
		pluginKey: p,
		shouldShow: o,
		getReferencedVirtualElement: s,
		options: c
	}, _ = H(g);
	_.current = g;
	let [v, y] = U(!1), b = H(!0);
	return V(() => {
		if (h?.isDestroyed) return;
		if (!h) {
			console.warn("BubbleMenu component is not rendered inside of an editor component or does not have editor prop.");
			return;
		}
		let e = f.current;
		e.style.visibility = "hidden", e.style.position = "absolute";
		let t = fc({
			..._.current,
			editor: h,
			element: e
		});
		h.registerPlugin(t);
		let n = _.current.pluginKey;
		return b.current = !0, y(!0), () => {
			y(!1), h.unregisterPlugin(n), window.requestAnimationFrame(() => {
				e.parentNode && e.parentNode.removeChild(e);
			});
		};
	}, [h]), V(() => {
		if (!(!v || !h || h.isDestroyed)) {
			if (b.current) {
				b.current = !1;
				return;
			}
			h.view.dispatch(h.state.tr.setMeta(p, {
				type: "updateOptions",
				options: _.current
			}));
		}
	}, [
		v,
		h,
		n,
		i,
		o,
		c,
		a,
		s,
		p
	]), _t(l, f.current);
});
ot.forwardRef(({ pluginKey: e, editor: t, updateDelay: n, resizeDelay: i, appendTo: a, shouldShow: o = null, options: s, children: c, ...l }, u) => {
	let d = H(document.createElement("div")), f = H(hc(e, "floatingMenu")).current;
	zc(d.current, l), typeof u == "function" ? u(d.current) : u && (u.current = d.current);
	let { editor: p } = r(), m = t || p, h = {
		updateDelay: n,
		resizeDelay: i,
		appendTo: a,
		pluginKey: f,
		shouldShow: o,
		options: s
	}, g = H(h);
	g.current = h;
	let [_, v] = U(!1), y = H(!0);
	return V(() => {
		if (m?.isDestroyed) return;
		if (!m) {
			console.warn("FloatingMenu component is not rendered inside of an editor component or does not have editor prop.");
			return;
		}
		let e = d.current;
		e.style.visibility = "hidden", e.style.position = "absolute";
		let t = mc({
			...g.current,
			editor: m,
			element: e
		});
		m.registerPlugin(t);
		let n = g.current.pluginKey;
		return y.current = !0, v(!0), () => {
			v(!1), m.unregisterPlugin(n), window.requestAnimationFrame(() => {
				e.parentNode && e.parentNode.removeChild(e);
			});
		};
	}, [m]), V(() => {
		if (!(!_ || !m || m.isDestroyed)) {
			if (y.current) {
				y.current = !1;
				return;
			}
			m.view.dispatch(m.state.tr.setMeta(f, {
				type: "updateOptions",
				options: g.current
			}));
		}
	}, [
		_,
		m,
		n,
		i,
		o,
		s,
		a,
		f
	]), _t(c, d.current);
});
var Vc = {
	bubbleMenu: "_bubbleMenu_wjr2b_1",
	active: "_active_wjr2b_26",
	colorSwatch: "_colorSwatch_wjr2b_31",
	removeColor: "_removeColor_wjr2b_38",
	buttonRoot: "_buttonRoot_wjr2b_43",
	buttonSeparator: "_buttonSeparator_wjr2b_51",
	divider: "_divider_wjr2b_56"
}, Hc = ({ editor: e, isOpen: t, setIsOpen: n }) => {
	let { t: r } = it(), a = g({
		editor: e,
		selector: (t) => e ? {
			isParagraph: t.editor.isActive("paragraph"),
			isBulletList: t.editor.isActive("bulletList"),
			isOrderedList: t.editor.isActive("orderedList"),
			isHeading1: t.editor.isActive("heading", { level: 1 }),
			isHeading2: t.editor.isActive("heading", { level: 2 }),
			isHeading3: t.editor.isActive("heading", { level: 3 }),
			isTaskItem: t.editor.isActive("taskItem"),
			isBlockquote: t.editor.isActive("blockquote"),
			isCodeBlock: t.editor.isActive("codeBlock"),
			isCallout: t.editor.isActive("callout"),
			isDetails: t.editor.isActive("details"),
			isTransclusionSource: t.editor.isActive("transclusionSource")
		} : null
	}), o = [
		{
			name: "Text",
			icon: ic,
			command: () => e.chain().focus().toggleNode("paragraph", "paragraph").run(),
			isActive: () => a?.isParagraph && !a?.isBulletList && !a?.isOrderedList
		},
		{
			name: "Heading 1",
			icon: zs,
			command: () => e.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: () => a?.isHeading1
		},
		{
			name: "Heading 2",
			icon: Bs,
			command: () => e.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: () => a?.isHeading2
		},
		{
			name: "Heading 3",
			icon: Vs,
			command: () => e.chain().focus().toggleHeading({ level: 3 }).run(),
			isActive: () => a?.isHeading3
		},
		{
			name: "To-do List",
			icon: ks,
			command: () => e.chain().focus().toggleTaskList().run(),
			isActive: () => a?.isTaskItem
		},
		{
			name: "Bullet List",
			icon: Xs,
			command: () => e.chain().focus().toggleBulletList().run(),
			isActive: () => a?.isBulletList
		},
		{
			name: "Numbered List",
			icon: Ys,
			command: () => e.chain().focus().toggleOrderedList().run(),
			isActive: () => a?.isOrderedList
		},
		{
			name: "Blockquote",
			icon: Os,
			command: () => e.chain().focus().toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
			isActive: () => a?.isBlockquote
		},
		{
			name: "Synced block",
			icon: $s,
			command: () => e.chain().focus().toggleTransclusionSource().run(),
			isActive: () => a?.isTransclusionSource
		},
		{
			name: "Code",
			icon: Ms,
			command: () => e.chain().focus().toggleCodeBlock().run(),
			isActive: () => a?.isCodeBlock
		},
		{
			name: "Callout",
			icon: Hs,
			command: () => e.chain().focus().toggleCallout().run(),
			isActive: () => a?.isCallout
		},
		{
			name: "Toggle block",
			icon: ac,
			command: () => e.chain().focus().setDetails().run(),
			isActive: () => a?.isDetails
		}
	], s = o.filter((e) => e.isActive()).pop() ?? { name: "Multiple" };
	return /* @__PURE__ */ K(J, {
		opened: t,
		onChange: n,
		withArrow: !0,
		children: [/* @__PURE__ */ G(J.Target, { children: /* @__PURE__ */ G(X, {
			label: r("Turn into"),
			withArrow: !0,
			withinPortal: !1,
			disabled: t,
			children: /* @__PURE__ */ G(i, {
				className: Vc.buttonRoot,
				variant: "default",
				style: {
					border: "none",
					height: "34px"
				},
				radius: "0",
				rightSection: /* @__PURE__ */ G(As, { size: 16 }),
				onClick: () => n(!t),
				"aria-label": r("Turn into"),
				"aria-haspopup": "menu",
				"aria-expanded": t,
				children: r(s?.name)
			})
		}) }), /* @__PURE__ */ G(J.Dropdown, { children: /* @__PURE__ */ G(Ji.Autosize, {
			type: "scroll",
			mah: 400,
			children: /* @__PURE__ */ G(i.Group, {
				orientation: "vertical",
				children: o.map((t, a) => /* @__PURE__ */ G(i, {
					variant: "default",
					leftSection: /* @__PURE__ */ G(t.icon, { size: 16 }),
					rightSection: s.name === t.name && /* @__PURE__ */ G(Z, { size: 16 }),
					justify: "left",
					fullWidth: !0,
					onClick: () => {
						(0, oc.isEditorReady)(e) && t.command(), n(!1);
					},
					style: { border: "none" },
					children: r(t.name)
				}, a))
			})
		}) })]
	});
}, Uc = ({ editor: e, isOpen: t, setIsOpen: n }) => {
	let { t: r } = it(), a = g({
		editor: e,
		selector: (e) => e.editor ? {
			isAlignLeft: e.editor.isActive({ textAlign: "left" }),
			isAlignCenter: e.editor.isActive({ textAlign: "center" }),
			isAlignRight: e.editor.isActive({ textAlign: "right" }),
			isAlignJustify: e.editor.isActive({ textAlign: "justify" })
		} : null
	});
	if (!e || !a) return null;
	let o = [
		{
			name: "Align left",
			isActive: () => a?.isAlignLeft,
			command: () => e.chain().focus().setTextAlign("left").run(),
			icon: ys
		},
		{
			name: "Align center",
			isActive: () => a?.isAlignCenter,
			command: () => e.chain().focus().setTextAlign("center").run(),
			icon: _s
		},
		{
			name: "Align right",
			isActive: () => a?.isAlignRight,
			command: () => e.chain().focus().setTextAlign("right").run(),
			icon: bs
		},
		{
			name: "Justify",
			isActive: () => a?.isAlignJustify,
			command: () => e.chain().focus().setTextAlign("justify").run(),
			icon: vs
		}
	], s = o.filter((e) => e.isActive()).pop() ?? o[0];
	return /* @__PURE__ */ K(Y, {
		shadow: "md",
		position: "bottom-start",
		withArrow: !1,
		opened: t,
		onChange: n,
		children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(X, {
			label: r("Text align"),
			withArrow: !0,
			disabled: t,
			children: /* @__PURE__ */ G(i, {
				variant: "default",
				style: {
					border: "none",
					height: "34px"
				},
				px: "5",
				radius: "0",
				rightSection: /* @__PURE__ */ G(As, { size: 16 }),
				onMouseDown: (e) => e.preventDefault(),
				onClick: () => n(!t),
				"aria-label": r("Text align"),
				"aria-haspopup": "menu",
				"aria-expanded": t,
				children: /* @__PURE__ */ G(s.icon, {
					style: { width: D(16) },
					stroke: 2
				})
			})
		}) }), /* @__PURE__ */ G(Y.Dropdown, { children: o.map((t, i) => /* @__PURE__ */ G(Y.Item, {
			leftSection: /* @__PURE__ */ G(t.icon, { size: 16 }),
			rightSection: s.name === t.name ? /* @__PURE__ */ G(Z, { size: 16 }) : null,
			onClick: () => {
				(0, oc.isEditorReady)(e) && t.command(), n(!1);
			},
			children: r(t.name)
		}, i)) })]
	});
}, Wc = {
	toolbar: "_toolbar_12o2g_1",
	elementLabel: "_elementLabel_12o2g_12",
	active: "_active_12o2g_26",
	divider: "_divider_12o2g_32"
};
//#endregion
//#region src/features/editor/portfolio/portfolio-element-menu.tsx
o();
function Gc(e) {
	return e.view.dom.classList.contains("ramzy-portfolio-editor");
}
var Kc = [
	"attachment",
	"audio",
	"base",
	"callout",
	"codeBlock",
	"columns",
	"drawio",
	"excalidraw",
	"embed",
	"image",
	"mediaPlaylist",
	"pdf",
	"photoAlbum",
	"photoGrid",
	"subpages",
	"table",
	"tabs",
	"transclusionReference",
	"transclusionSource",
	"video",
	"youtube"
], qc = new Set([
	"blockquote",
	"bulletList",
	"details",
	"heading",
	"orderedList",
	"paragraph",
	"taskList"
]), Jc = {
	attachment: "File",
	audio: "Audio",
	base: "Database",
	blockquote: "Quote",
	codeBlock: "Code block",
	heading: "Heading",
	horizontalRule: "Divider",
	embed: "Embed",
	mathBlock: "Equation",
	mediaPlaylist: "Playlist",
	pageBreak: "Page break",
	paragraph: "Text",
	photoAlbum: "Photo album",
	photoGrid: "Image grid",
	tabs: "Tabs",
	transclusionReference: "Synced block",
	transclusionSource: "Synced block source",
	toggle: "Toggle",
	youtube: "YouTube"
};
function Yc(e) {
	let { selection: t, doc: n } = e.state, r = t.$from.depth > 0 ? t.$from.before(1) : t.from, i = n.nodeAt(r);
	return i ? {
		position: r,
		node: i,
		isSectionHeading: i.type.name === "heading" && i.attrs.level === 1
	} : null;
}
function Xc(e) {
	let t = [];
	return e.state.doc.forEach((e, n) => {
		e.type.name === "heading" && e.attrs.level === 1 && t.push({
			position: n,
			title: e.textContent.trim() || "Untitled section"
		});
	}), t.map((n, r) => ({
		...n,
		end: t[r + 1]?.position ?? e.state.doc.content.size
	}));
}
function Zc(e) {
	let t = Yc(e);
	if (!t) return !1;
	let n = t.isSectionHeading ? Xc(e).find((e) => e.position === t.position) : null, r = e.state.tr.delete(t.position, n?.end ?? t.position + t.node.nodeSize);
	return r.doc.childCount === 0 && r.insert(0, e.schema.nodes.paragraph.create()), e.view.dispatch(r), e.commands.focus(), !0;
}
function Qc(e) {
	let t = Yc(e);
	if (!t) return null;
	let n = t.isSectionHeading ? Xc(e).find((e) => e.position === t.position) : null;
	return {
		...t,
		end: n?.end ?? t.position + t.node.nodeSize
	};
}
function $c(e) {
	if (e.isText) return e.type.schema.text(e.text || "", e.marks);
	let t = { ...e.attrs };
	Object.prototype.hasOwnProperty.call(t, "id") && (t.id = null);
	let n = [];
	return e.content.forEach((e) => n.push($c(e))), e.type.create(t, n.length ? w.fromArray(n) : void 0, e.marks);
}
function el(e) {
	let t = Qc(e);
	if (!t) return !1;
	let n = [];
	return e.state.doc.forEach((e, r) => {
		r >= t.position && r < t.end && n.push($c(e));
	}), n.length ? (e.view.dispatch(e.state.tr.insert(t.end, w.fromArray(n)).scrollIntoView()), e.commands.focus(), !0) : !1;
}
function tl(e, t) {
	let n = Qc(e);
	if (!n) return !1;
	let r = [];
	if (e.state.doc.forEach((e, t) => r.push({
		node: e,
		position: t
	})), n.isSectionHeading) {
		let r = Xc(e), i = r[r.findIndex((e) => e.position === n.position) + (t === "up" ? -1 : 1)];
		if (!i) return !1;
		let a = e.state.doc.slice(n.position, n.end).content, o = e.state.tr.delete(n.position, n.end), s = t === "up" ? i.position : n.position + (i.end - i.position);
		return o.insert(s, a), e.view.dispatch(o.scrollIntoView()), e.commands.setNodeSelection(s), e.commands.focus(), !0;
	}
	let i = r[r.findIndex((e) => e.position === n.position) + (t === "up" ? -1 : 1)];
	if (!i) return !1;
	let a = e.state.doc.slice(n.position, n.end).content, o = e.state.tr.delete(n.position, n.end), s = t === "up" ? i.position : n.position + i.node.nodeSize;
	return o.insert(s, a), e.view.dispatch(o.scrollIntoView()), e.commands.setNodeSelection(s), e.commands.focus(), !0;
}
function nl(e, t) {
	let n = Qc(e);
	if (!n || typeof document.execCommand != "function") return !1;
	e.commands.setNodeSelection(n.position);
	let r = document.execCommand("copy");
	return r && t && Zc(e), r;
}
async function rl(e) {
	let t = Yc(e);
	if (!t) return !1;
	let n = typeof t.node.attrs.id == "string" ? t.node.attrs.id : "";
	n || (n = window.crypto.randomUUID(), Q(e, { id: n }));
	let r = `${window.location.href.split("#")[0]}#${n}`;
	return await navigator.clipboard.writeText(r), !0;
}
function il(e, t) {
	let n = Yc(e);
	if (!n || n.isSectionHeading) return !1;
	let r = n.node.nodeSize, i = t.end, a = e.state.tr.delete(n.position, n.position + r);
	return n.position < i && (i -= r), i = Math.max(0, Math.min(i, a.doc.content.size)), a.insert(i, n.node), e.view.dispatch(a.scrollIntoView()), e.commands.focus(), !0;
}
function al(e, t) {
	let n = Yc(e);
	if (!n || n.isSectionHeading || !t.trim()) return !1;
	let r = e.state.tr.delete(n.position, n.position + n.node.nodeSize), i = e.schema.nodes.heading.create({ level: 1 }, e.schema.text(t.trim())), a = r.doc.content.size;
	return r.insert(a, i), r.insert(a + i.nodeSize, n.node), e.view.dispatch(r.scrollIntoView()), e.commands.focus(), !0;
}
function ol(e) {
	return e.type.name === "heading" && typeof e.attrs.level == "number" ? `Heading ${e.attrs.level}` : e.type.name === "mediaPlaylist" ? e.attrs.kind === "audio" ? "Audio playlist" : "Video playlist" : Jc[e.type.name] || "Element";
}
function Q(e, t) {
	let n = Yc(e);
	if (!n) return !1;
	let r = e.state.tr.setNodeMarkup(n.position, void 0, {
		...n.node.attrs,
		...t
	});
	return e.view.dispatch(r), !0;
}
function sl(e, t) {
	let n = Yc(e);
	return !n || !e.schema.nodes[t] ? !1 : e.chain().focus().insertContentAt({
		from: n.position,
		to: n.position + n.node.nodeSize
	}, { type: t }).run();
}
function $(e, t) {
	let n = Yc(e);
	if (!n) return !1;
	let r = e.view.nodeDOM(n.position);
	if (!(r instanceof HTMLElement)) return !1;
	let i = r.querySelector(`[data-ramzy-element-action="${t}"]`);
	return i ? (i.click(), !0) : !1;
}
function cl({ editor: e }) {
	let { t } = it(), [n, r] = U(!1), [i, a] = U("root"), o = g({
		editor: e,
		selector: ({ editor: e }) => {
			let t = Yc(e);
			return t ? {
				position: t.position,
				isSectionHeading: t.isSectionHeading,
				sections: Xc(e),
				canMoveUp: t.position > 0,
				canMoveDown: (t.isSectionHeading ? Xc(e).find((e) => e.position === t.position)?.end : t.position + t.node.nodeSize) !== e.state.doc.content.size
			} : null;
		}
	});
	if (!Gc(e) || !o) return null;
	function s() {
		r(!1), a("root");
	}
	function c() {
		Zc(e) && s();
	}
	function l(e) {
		Promise.resolve(e()).then((e) => {
			e && s();
		});
	}
	function u(t) {
		il(e, t) && s();
	}
	function d() {
		let t = window.prompt("Name the new section", "New section")?.trim();
		t && al(e, t) && s();
	}
	return /* @__PURE__ */ K(Y, {
		opened: n,
		onChange: (e) => {
			r(e), e || a("root");
		},
		closeOnItemClick: !1,
		withinPortal: !1,
		position: "bottom-end",
		shadow: "md",
		width: 230,
		children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(X, {
			position: "top",
			label: t("Element actions"),
			withinPortal: !1,
			children: /* @__PURE__ */ G(P, {
				size: "lg",
				variant: "subtle",
				"aria-label": t("Element actions"),
				onMouseDown: (e) => e.preventDefault(),
				children: /* @__PURE__ */ G(Fs, { size: 18 })
			})
		}) }), /* @__PURE__ */ G(Y.Dropdown, {
			"data-ramzy-block-menu": !0,
			children: i === "root" ? /* @__PURE__ */ K(W, { children: [
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(Ns, { size: 16 }),
					onClick: () => l(() => el(e)),
					children: t("Duplicate")
				}),
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(js, { size: 16 }),
					onClick: () => l(() => nl(e, !1)),
					children: t("Copy")
				}),
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(Ps, { size: 16 }),
					onClick: () => l(() => nl(e, !0)),
					children: t("Cut")
				}),
				/* @__PURE__ */ G(Y.Divider, {}),
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(Ts, { size: 16 }),
					disabled: !o.canMoveUp,
					onClick: () => l(() => tl(e, "up")),
					children: o.isSectionHeading ? t("Move section up") : t("Move up")
				}),
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(Ss, { size: 16 }),
					disabled: !o.canMoveDown,
					onClick: () => l(() => tl(e, "down")),
					children: o.isSectionHeading ? t("Move section down") : t("Move down")
				}),
				!o.isSectionHeading && /* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(ws, { size: 16 }),
					rightSection: /* @__PURE__ */ G("span", {
						"aria-hidden": !0,
						children: "›"
					}),
					onClick: () => a("sections"),
					children: t("Move to section")
				}),
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(qs, { size: 16 }),
					onClick: () => l(() => rl(e)),
					children: t("Copy link to element")
				}),
				/* @__PURE__ */ G(Y.Divider, {}),
				/* @__PURE__ */ G(Y.Item, {
					color: "red",
					leftSection: /* @__PURE__ */ G(rc, { size: 16 }),
					onClick: c,
					children: t("Delete")
				})
			] }) : /* @__PURE__ */ K(W, { children: [
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G("span", {
						"aria-hidden": !0,
						children: "‹"
					}),
					onClick: () => a("root"),
					children: /* @__PURE__ */ G("strong", { children: t("Move to section") })
				}),
				/* @__PURE__ */ G(Y.Divider, {}),
				/* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G(Qs, { size: 16 }),
					onClick: d,
					children: t("New section…")
				}),
				o.sections.map((e) => /* @__PURE__ */ G(Y.Item, {
					leftSection: /* @__PURE__ */ G("span", {
						"aria-hidden": !0,
						children: "§"
					}),
					onClick: () => u(e),
					children: e.title
				}, `${e.position}-${e.title}`))
			] })
		})]
	});
}
function ll({ editor: e }) {
	let [t, n] = U(!1), [r, a] = U(!1), o = B(({ state: t }) => !Gc(e) || !e.isEditable || !t.selection.empty && !(t.selection instanceof d) || Kc.some((t) => e.isActive(t)) ? !1 : !!Yc(e), [e]), s = B(() => {
		let t = Yc(e);
		if (!t) return;
		let n = e.view.nodeDOM(t.position);
		if (!(n instanceof HTMLElement)) return;
		let r = n.getBoundingClientRect();
		return {
			getBoundingClientRect: () => r,
			getClientRects: () => [r]
		};
	}, [e]), c = g({
		editor: e,
		selector: ({ editor: e }) => {
			let t = Yc(e);
			return t ? {
				name: t.node.type.name,
				label: ol(t.node),
				supportsTextTools: qc.has(t.node.type.name),
				isSectionHeading: t.isSectionHeading,
				navigationLabel: String(t.node.attrs.navigationLabel || ""),
				open: !!t.node.attrs.open,
				mathText: String(t.node.attrs.text || ""),
				align: String(t.node.attrs.align || "center"),
				dividerStyle: String(t.node.attrs.style || "solid"),
				dividerThickness: Number(t.node.attrs.thickness || 1),
				dividerWidth: Number(t.node.attrs.width || 100),
				dividerColor: String(t.node.attrs.color || "default"),
				dividerSpacing: String(t.node.attrs.spacing || "standard")
			} : null;
		}
	});
	return /* @__PURE__ */ G(Bc, {
		editor: e,
		pluginKey: "portfolio-generic-element-menu",
		updateDelay: 0,
		getReferencedVirtualElement: s,
		options: {
			placement: "bottom",
			offset: 8
		},
		shouldShow: o,
		style: {
			zIndex: 200,
			position: "relative"
		},
		children: /* @__PURE__ */ K("div", {
			className: Wc.toolbar,
			"data-ramzy-element-toolbar": !0,
			children: [
				c?.supportsTextTools ? /* @__PURE__ */ K(W, { children: [/* @__PURE__ */ G(Hc, {
					editor: e,
					isOpen: t,
					setIsOpen: (e) => {
						let r = typeof e == "function" ? e(t) : e;
						n(r), r && a(!1);
					}
				}), /* @__PURE__ */ G(Uc, {
					editor: e,
					isOpen: r,
					setIsOpen: (e) => {
						let t = typeof e == "function" ? e(r) : e;
						a(t), t && n(!1);
					}
				})] }) : /* @__PURE__ */ G("span", {
					className: Wc.elementLabel,
					children: c?.label || "Element"
				}),
				c?.isSectionHeading && /* @__PURE__ */ G(i, {
					size: "compact-sm",
					variant: "subtle",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => {
						let t = window.prompt("Navigation label (leave blank to use the section title)", c.navigationLabel);
						t !== null && Q(e, { navigationLabel: t.trim() || null });
					},
					children: "Navigation label"
				}),
				c?.name === "details" && /* @__PURE__ */ G(i, {
					size: "compact-sm",
					variant: "subtle",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => Q(e, { open: !c.open }),
					children: c.open ? "Open by default" : "Closed by default"
				}),
				c?.name === "mathBlock" && /* @__PURE__ */ K(W, { children: [/* @__PURE__ */ G(lc, {
					value: c.mathText,
					timeout: 2e3,
					children: ({ copied: e, copy: t }) => /* @__PURE__ */ G(X, {
						label: e ? "Copied" : "Copy LaTeX",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							color: e ? "teal" : void 0,
							"aria-label": "Copy LaTeX",
							onMouseDown: (e) => e.preventDefault(),
							onClick: t,
							children: G(e ? Z : Ns, { size: 18 })
						})
					})
				}), /* @__PURE__ */ K(Y, {
					withinPortal: !1,
					position: "bottom-start",
					shadow: "md",
					width: 160,
					children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(P, {
						size: "lg",
						variant: "subtle",
						"aria-label": "Equation alignment",
						children: c.align === "left" ? /* @__PURE__ */ G(ys, { size: 18 }) : c.align === "right" ? /* @__PURE__ */ G(bs, { size: 18 }) : /* @__PURE__ */ G(_s, { size: 18 })
					}) }), /* @__PURE__ */ G(Y.Dropdown, { children: [
						"left",
						"center",
						"right"
					].map((t) => /* @__PURE__ */ G(Y.Item, {
						rightSection: c.align === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
						onClick: () => Q(e, { align: t }),
						children: t[0].toUpperCase() + t.slice(1)
					}, t)) })]
				})] }),
				c?.name === "pageBreak" && /* @__PURE__ */ G(i, {
					size: "compact-sm",
					variant: "subtle",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => sl(e, "horizontalRule"),
					children: "Convert to divider"
				}),
				c?.name === "horizontalRule" && /* @__PURE__ */ K(W, { children: [/* @__PURE__ */ K(Y, {
					withinPortal: !1,
					position: "bottom-start",
					shadow: "md",
					width: 230,
					children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(i, {
						size: "compact-sm",
						variant: "subtle",
						children: "Divider style"
					}) }), /* @__PURE__ */ K(Y.Dropdown, { children: [
						/* @__PURE__ */ G(Y.Label, { children: "Line" }),
						[
							"solid",
							"dashed",
							"dotted"
						].map((t) => /* @__PURE__ */ G(Y.Item, {
							rightSection: c.dividerStyle === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { style: t }),
							children: t[0].toUpperCase() + t.slice(1)
						}, t)),
						/* @__PURE__ */ G(Y.Divider, {}),
						/* @__PURE__ */ G(Y.Label, { children: "Thickness" }),
						[
							1,
							2,
							4
						].map((t) => /* @__PURE__ */ K(Y.Item, {
							rightSection: c.dividerThickness === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { thickness: t }),
							children: [t, "px"]
						}, t)),
						/* @__PURE__ */ G(Y.Divider, {}),
						/* @__PURE__ */ G(Y.Label, { children: "Width" }),
						[
							25,
							50,
							75,
							100
						].map((t) => /* @__PURE__ */ K(Y.Item, {
							rightSection: c.dividerWidth === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { width: t }),
							children: [t, "%"]
						}, t)),
						/* @__PURE__ */ G(Y.Divider, {}),
						/* @__PURE__ */ G(Y.Label, { children: "Colour" }),
						[
							"default",
							"muted",
							"accent"
						].map((t) => /* @__PURE__ */ G(Y.Item, {
							rightSection: c.dividerColor === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { color: t }),
							children: t[0].toUpperCase() + t.slice(1)
						}, t)),
						/* @__PURE__ */ G(Y.Divider, {}),
						/* @__PURE__ */ G(Y.Label, { children: "Spacing" }),
						[
							"compact",
							"standard",
							"wide"
						].map((t) => /* @__PURE__ */ G(Y.Item, {
							rightSection: c.dividerSpacing === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { spacing: t }),
							children: t[0].toUpperCase() + t.slice(1)
						}, t))
					] })]
				}), /* @__PURE__ */ G(i, {
					size: "compact-sm",
					variant: "subtle",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => sl(e, "pageBreak"),
					children: "Convert to page break"
				})] }),
				/* @__PURE__ */ G("div", { className: Wc.divider }),
				/* @__PURE__ */ G(cl, { editor: e })
			]
		})
	});
}
function ul({ editor: e }) {
	let t = B(({ state: t }) => !Gc(e) || !e.isEditable || !t.selection.empty && !(t.selection instanceof d) ? !1 : e.isActive("attachment") || e.isActive("base") || e.isActive("codeBlock") || e.isActive("embed") || e.isActive("mediaPlaylist") || e.isActive("photoGrid") || e.isActive("photoAlbum") || e.isActive("tabs") || e.isActive("transclusionReference") || e.isActive("transclusionSource") || e.isActive("youtube"), [e]), n = B(() => {
		let t = Yc(e);
		if (!t) return;
		let n = e.view.nodeDOM(t.position);
		if (!(n instanceof HTMLElement)) return;
		let r = n.getBoundingClientRect();
		return {
			getBoundingClientRect: () => r,
			getClientRects: () => [r]
		};
	}, [e]), r = g({
		editor: e,
		selector: ({ editor: e }) => {
			let t = Yc(e);
			if (!t) return null;
			if (t.node.type.name === "attachment") {
				let e = String(t.node.attrs.name || ""), n = String(t.node.attrs.mime || "");
				return {
					type: "attachment",
					name: e,
					source: String(t.node.attrs.url || ""),
					display: t.node.attrs.display === "inline" ? "inline" : "card",
					canEmbedAsPdf: n === "application/pdf" || e.toLowerCase().endsWith(".pdf"),
					canDownload: !!t.node.attrs.url
				};
			}
			return t.node.type.name === "base" ? {
				type: "base",
				hasSource: !!t.node.attrs.pageId
			} : t.node.type.name === "transclusionSource" ? { type: "sync-source" } : t.node.type.name === "transclusionReference" ? {
				type: "sync-reference",
				hasSource: !!t.node.attrs.sourcePageId
			} : t.node.type.name === "codeBlock" ? {
				type: "code",
				language: String(t.node.attrs.language || ""),
				text: t.node.textContent,
				wrap: !!t.node.attrs.wrap,
				lineNumbers: !!t.node.attrs.lineNumbers,
				theme: t.node.attrs.theme === "light" ? "light" : "dark",
				collapsed: !!t.node.attrs.collapsed
			} : t.node.type.name === "embed" ? {
				type: "embed",
				hasSource: !!t.node.attrs.src,
				align: String(t.node.attrs.align || "center"),
				width: Number(t.node.attrs.width || 800)
			} : t.node.type.name === "youtube" ? {
				type: "youtube",
				source: String(t.node.attrs.src || ""),
				width: Number(t.node.attrs.width || 640),
				start: Number(t.node.attrs.start || 0)
			} : t.node.type.name === "mediaPlaylist" ? {
				type: "playlist",
				kind: t.node.attrs.kind === "audio" ? "audio" : "video",
				autoplay: !!t.node.attrs.autoplay,
				loop: !!t.node.attrs.loop,
				shuffle: !!t.node.attrs.shuffle,
				showQueue: t.node.attrs.showQueue !== !1,
				queueLayout: t.node.attrs.queueLayout === "compact" ? "compact" : "detailed"
			} : t.node.type.name === "photoGrid" || t.node.type.name === "photoAlbum" ? {
				type: "photos",
				kind: t.node.type.name === "photoAlbum" ? "album" : "grid",
				columns: Number(t.node.attrs.columns || 0),
				gap: Number(t.node.attrs.gap ?? 10),
				aspect: String(t.node.attrs.aspect || "auto"),
				fit: t.node.attrs.fit === "contain" ? "contain" : "cover",
				lightbox: t.node.attrs.lightbox !== !1,
				thumbnailPosition: t.node.attrs.thumbnailPosition === "bottom" ? "bottom" : "right",
				autoplay: !!t.node.attrs.autoplay,
				interval: Number(t.node.attrs.interval || 5)
			} : t.node.type.name === "tabs" ? { type: "tabs" } : null;
		}
	}), a = (e.extensionManager.extensions.find((e) => e.name === "codeBlock")?.options)?.lowlight?.listLanguages?.() ?? [
		"css",
		"html",
		"javascript",
		"json",
		"markdown",
		"typescript"
	];
	return /* @__PURE__ */ G(Bc, {
		editor: e,
		pluginKey: "portfolio-collection-element-menu",
		updateDelay: 0,
		getReferencedVirtualElement: n,
		options: {
			placement: "bottom",
			offset: 8
		},
		shouldShow: t,
		style: {
			zIndex: 200,
			position: "relative"
		},
		children: /* @__PURE__ */ K("div", {
			className: Wc.toolbar,
			"data-ramzy-element-toolbar": !0,
			children: [
				r?.type === "sync-source" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G("span", {
						className: Wc.elementLabel,
						children: "Synced block source"
					}),
					/* @__PURE__ */ G(X, {
						label: "Copy synced block",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Copy synced block",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "copy-synced-block"),
							children: /* @__PURE__ */ G(Ns, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Unsync block",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Unsync block",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "unsync-block"),
							children: /* @__PURE__ */ G(Ks, { size: 18 })
						})
					})
				] }) : r?.type === "sync-reference" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G("span", {
						className: Wc.elementLabel,
						children: "Synced block"
					}),
					/* @__PURE__ */ G(X, {
						label: "Refresh synced block",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Refresh synced block",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "refresh-synced-block"),
							children: /* @__PURE__ */ G(ec, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Open source",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Open synced block source",
							disabled: !r.hasSource,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "open-synced-source"),
							children: /* @__PURE__ */ G(Ls, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Unsync block",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Unsync block",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "unsync-block"),
							children: /* @__PURE__ */ G(Ks, { size: 18 })
						})
					})
				] }) : r?.type === "base" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G("span", {
						className: Wc.elementLabel,
						children: "Database"
					}),
					/* @__PURE__ */ G(X, {
						label: "Open source database",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Open source database",
							disabled: !r.hasSource,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "open-base"),
							children: /* @__PURE__ */ G(Ls, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Refresh database",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Refresh database",
							disabled: !r.hasSource,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "refresh-base"),
							children: /* @__PURE__ */ G(ec, { size: 18 })
						})
					})
				] }) : r?.type === "tabs" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G(i, {
						size: "compact-sm",
						variant: "subtle",
						leftSection: /* @__PURE__ */ G(Qs, { size: 16 }),
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => $(e, "add-tab"),
						children: "Add tab"
					}),
					/* @__PURE__ */ G(X, {
						label: "Rename active tab",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Rename active tab",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "rename-tab"),
							children: /* @__PURE__ */ G(le, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Duplicate active tab",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Duplicate active tab",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "duplicate-tab"),
							children: /* @__PURE__ */ G(Ns, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Move tab left",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Move tab left",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "move-tab-left"),
							children: /* @__PURE__ */ G(Cs, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Move tab right",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Move tab right",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "move-tab-right"),
							children: /* @__PURE__ */ G(ws, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Remove active tab",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							color: "red",
							size: "lg",
							variant: "subtle",
							"aria-label": "Remove active tab",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "remove-tab"),
							children: /* @__PURE__ */ G(rc, { size: 18 })
						})
					})
				] }) : r?.type === "youtube" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G(X, {
						label: "Edit YouTube link",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Edit YouTube link",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => {
								let t = window.prompt("Edit YouTube link", r.source)?.trim();
								t && Q(e, { src: t });
							},
							children: /* @__PURE__ */ G(le, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Open on YouTube",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Open on YouTube",
							disabled: !r.source,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => window.open(r.source, "_blank", "noopener,noreferrer"),
							children: /* @__PURE__ */ G(Ls, { size: 18 })
						})
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 180,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ K(i, {
							size: "compact-sm",
							variant: "subtle",
							children: [r.width, "px"]
						}) }), /* @__PURE__ */ G(Y.Dropdown, { children: [
							480,
							640,
							800,
							1200
						].map((t) => /* @__PURE__ */ K(Y.Item, {
							rightSection: r.width === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, {
								width: t,
								height: Math.round(t * 9 / 16)
							}),
							children: [t, "px"]
						}, t)) })]
					}),
					/* @__PURE__ */ K(i, {
						size: "compact-sm",
						variant: "subtle",
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => {
							let t = window.prompt("Start time in seconds", String(r.start));
							t !== null && Q(e, { start: Math.max(0, Math.round(Number(t) || 0)) });
						},
						children: [
							"Start ",
							r.start,
							"s"
						]
					})
				] }) : r?.type === "embed" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G(X, {
						label: "Edit embed link",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Edit embed link",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "edit-embed"),
							children: /* @__PURE__ */ G(le, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Open original",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Open original",
							disabled: !r.hasSource,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "open-embed"),
							children: /* @__PURE__ */ G(Ls, { size: 18 })
						})
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 170,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Embed alignment",
							onMouseDown: (e) => e.preventDefault(),
							children: r.align === "left" ? /* @__PURE__ */ G(ys, { size: 18 }) : r.align === "right" ? /* @__PURE__ */ G(bs, { size: 18 }) : /* @__PURE__ */ G(_s, { size: 18 })
						}) }), /* @__PURE__ */ G(Y.Dropdown, { children: [
							"left",
							"center",
							"right"
						].map((t) => /* @__PURE__ */ G(Y.Item, {
							leftSection: G(t === "left" ? ys : t === "right" ? bs : _s, { size: 16 }),
							rightSection: r.align === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { align: t }),
							children: t[0].toUpperCase() + t.slice(1)
						}, t)) })]
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 180,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ K(i, {
							size: "compact-sm",
							variant: "subtle",
							children: [r.width, "px"]
						}) }), /* @__PURE__ */ G(Y.Dropdown, { children: [
							{
								label: "Compact",
								width: 480,
								height: 360
							},
							{
								label: "Standard",
								width: 800,
								height: 600
							},
							{
								label: "Wide",
								width: 1200,
								height: 675
							}
						].map((t) => /* @__PURE__ */ G(Y.Item, {
							rightSection: r.width === t.width ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, {
								width: t.width,
								height: t.height
							}),
							children: t.label
						}, t.label)) })]
					}),
					/* @__PURE__ */ G(X, {
						label: "Refresh embed",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Refresh embed",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "refresh-embed"),
							children: /* @__PURE__ */ G(ec, { size: 18 })
						})
					})
				] }) : r?.type === "code" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 220,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(i, {
							size: "compact-sm",
							variant: "subtle",
							rightSection: /* @__PURE__ */ G(As, { size: 14 }),
							onMouseDown: (e) => e.preventDefault(),
							children: r.language || "Auto-detect"
						}) }), /* @__PURE__ */ G(Y.Dropdown, { children: /* @__PURE__ */ K(Ji.Autosize, {
							mah: 320,
							type: "scroll",
							children: [/* @__PURE__ */ G(Y.Item, {
								rightSection: r.language ? null : /* @__PURE__ */ G(Z, { size: 14 }),
								onClick: () => Q(e, { language: null }),
								children: "Auto-detect"
							}), a.map((t) => /* @__PURE__ */ G(Y.Item, {
								rightSection: r.language === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { language: t }),
								children: t
							}, t))]
						}) })]
					}),
					/* @__PURE__ */ G(lc, {
						value: r.text,
						timeout: 2e3,
						children: ({ copied: e, copy: t }) => /* @__PURE__ */ G(X, {
							label: e ? "Copied" : "Copy code",
							position: "top",
							children: /* @__PURE__ */ G(P, {
								size: "lg",
								variant: "subtle",
								color: e ? "teal" : void 0,
								"aria-label": "Copy code",
								onMouseDown: (e) => e.preventDefault(),
								onClick: t,
								children: G(e ? Z : Ns, { size: 18 })
							})
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Wrap lines",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Wrap lines",
							className: r.wrap ? Wc.active : void 0,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => Q(e, { wrap: !r.wrap }),
							children: /* @__PURE__ */ G(nc, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Show line numbers",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Show line numbers",
							className: r.lineNumbers ? Wc.active : void 0,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => Q(e, { lineNumbers: !r.lineNumbers }),
							children: /* @__PURE__ */ G(Ys, { size: 18 })
						})
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 170,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(i, {
							size: "compact-sm",
							variant: "subtle",
							children: r.theme === "light" ? "Light" : "Dark"
						}) }), /* @__PURE__ */ K(Y.Dropdown, { children: [/* @__PURE__ */ G(Y.Item, {
							rightSection: r.theme === "dark" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { theme: "dark" }),
							children: "Dark theme"
						}), /* @__PURE__ */ G(Y.Item, {
							rightSection: r.theme === "light" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { theme: "light" }),
							children: "Light theme"
						})] })]
					}),
					/* @__PURE__ */ G(X, {
						label: r.collapsed ? "Expand code" : "Collapse code",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": r.collapsed ? "Expand code" : "Collapse code",
							className: r.collapsed ? Wc.active : void 0,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => Q(e, { collapsed: !r.collapsed }),
							children: /* @__PURE__ */ G(Es, { size: 18 })
						})
					})
				] }) : r?.type === "attachment" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G(X, {
						label: "Rename file",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Rename file",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => {
								let t = window.prompt("Rename file", r.name)?.trim();
								t && Q(e, { name: t });
							},
							children: /* @__PURE__ */ G(le, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Replace file",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Replace file",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "replace-file"),
							children: /* @__PURE__ */ G(ec, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Open file",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Open file",
							disabled: !r.source,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => window.open(M(r.source), "_blank", "noopener,noreferrer"),
							children: /* @__PURE__ */ G(Ls, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(lc, {
						value: r.source ? M(r.source) : "",
						timeout: 2e3,
						children: ({ copied: e, copy: t }) => /* @__PURE__ */ G(X, {
							label: e ? "Copied" : "Copy file link",
							position: "top",
							children: /* @__PURE__ */ G(P, {
								size: "lg",
								variant: "subtle",
								color: e ? "teal" : void 0,
								"aria-label": "Copy file link",
								disabled: !r.source,
								onMouseDown: (e) => e.preventDefault(),
								onClick: t,
								children: G(e ? Z : qs, { size: 18 })
							})
						})
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 170,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(i, {
							size: "compact-sm",
							variant: "subtle",
							children: r.display === "inline" ? "Inline" : "Card"
						}) }), /* @__PURE__ */ G(Y.Dropdown, { children: ["card", "inline"].map((t) => /* @__PURE__ */ G(Y.Item, {
							rightSection: r.display === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { display: t }),
							children: t === "card" ? "Card" : "Inline"
						}, t)) })]
					}),
					r.canEmbedAsPdf && /* @__PURE__ */ G(X, {
						label: "Embed as PDF",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Embed as PDF",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "embed-as-pdf"),
							children: /* @__PURE__ */ G(Rs, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Download file",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Download file",
							disabled: !r.canDownload,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => $(e, "download-file"),
							children: /* @__PURE__ */ G(Is, { size: 18 })
						})
					})
				] }) : r?.type === "playlist" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G(i, {
						size: "compact-sm",
						variant: "subtle",
						leftSection: /* @__PURE__ */ G(Qs, { size: 16 }),
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => $(e, "add-media"),
						children: r.kind === "video" ? "Add videos" : "Add tracks"
					}),
					/* @__PURE__ */ G(X, {
						label: "Autoplay next",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Autoplay next",
							className: r.autoplay ? Wc.active : void 0,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => Q(e, { autoplay: !r.autoplay }),
							children: /* @__PURE__ */ G(Zs, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Loop playlist",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Loop playlist",
							className: r.loop ? Wc.active : void 0,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => Q(e, { loop: !r.loop }),
							children: /* @__PURE__ */ G(tc, { size: 18 })
						})
					}),
					/* @__PURE__ */ G(X, {
						label: "Shuffle playback",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Shuffle playback",
							className: r.shuffle ? Wc.active : void 0,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => Q(e, { shuffle: !r.shuffle }),
							children: /* @__PURE__ */ G(Ds, { size: 18 })
						})
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 210,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Playlist display",
							onMouseDown: (e) => e.preventDefault(),
							children: /* @__PURE__ */ G(Js, { size: 18 })
						}) }), /* @__PURE__ */ K(Y.Dropdown, { children: [
							/* @__PURE__ */ G(Y.Label, { children: "Playlist display" }),
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.showQueue ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { showQueue: !r.showQueue }),
								children: "Show queue"
							}),
							/* @__PURE__ */ G(Y.Divider, {}),
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.queueLayout === "detailed" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { queueLayout: "detailed" }),
								children: "Detailed queue"
							}),
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.queueLayout === "compact" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { queueLayout: "compact" }),
								children: "Compact queue"
							})
						] })]
					})
				] }) : r?.type === "photos" ? /* @__PURE__ */ K(W, { children: [
					/* @__PURE__ */ G(i, {
						size: "compact-sm",
						variant: "subtle",
						leftSection: /* @__PURE__ */ G(Qs, { size: 16 }),
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => $(e, "add-photos"),
						children: "Add photos"
					}),
					r.kind === "grid" && /* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 175,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(i, {
							size: "compact-sm",
							variant: "subtle",
							children: r.columns ? `${r.columns} columns` : "Auto layout"
						}) }), /* @__PURE__ */ G(Y.Dropdown, { children: [
							0,
							1,
							2,
							3,
							4
						].map((t) => /* @__PURE__ */ G(Y.Item, {
							rightSection: r.columns === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { columns: t }),
							children: t === 0 ? "Auto layout" : `${t} column${t === 1 ? "" : "s"}`
						}, t)) })]
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 180,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(i, {
							size: "compact-sm",
							variant: "subtle",
							children: r.fit === "contain" ? "Fit" : "Fill"
						}) }), /* @__PURE__ */ K(Y.Dropdown, { children: [
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.fit === "cover" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { fit: "cover" }),
								children: "Fill frame"
							}),
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.fit === "contain" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { fit: "contain" }),
								children: "Fit image"
							}),
							r.kind === "grid" && /* @__PURE__ */ K(W, { children: [/* @__PURE__ */ G(Y.Divider, {}), [
								["auto", "Natural ratio"],
								["square", "Square"],
								["landscape", "Landscape"],
								["portrait", "Portrait"]
							].map(([t, n]) => /* @__PURE__ */ G(Y.Item, {
								rightSection: r.aspect === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { aspect: t }),
								children: n
							}, t))] })
						] })]
					}),
					/* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 190,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ K(i, {
							size: "compact-sm",
							variant: "subtle",
							children: [
								"Spacing ",
								r.gap,
								"px"
							]
						}) }), /* @__PURE__ */ G(Y.Dropdown, { children: [
							0,
							8,
							16,
							24
						].map((t) => /* @__PURE__ */ G(Y.Item, {
							rightSection: r.gap === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
							onClick: () => Q(e, { gap: t }),
							children: t === 0 ? "No gap" : `${t}px gap`
						}, t)) })]
					}),
					r.kind === "album" && /* @__PURE__ */ K(Y, {
						withinPortal: !1,
						position: "bottom-start",
						shadow: "md",
						width: 200,
						children: [/* @__PURE__ */ G(Y.Target, { children: /* @__PURE__ */ G(i, {
							size: "compact-sm",
							variant: "subtle",
							children: "Album settings"
						}) }), /* @__PURE__ */ K(Y.Dropdown, { children: [
							/* @__PURE__ */ G(Y.Label, { children: "Thumbnails" }),
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.thumbnailPosition === "right" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { thumbnailPosition: "right" }),
								children: "Right side"
							}),
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.thumbnailPosition === "bottom" ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { thumbnailPosition: "bottom" }),
								children: "Below photo"
							}),
							/* @__PURE__ */ G(Y.Divider, {}),
							/* @__PURE__ */ G(Y.Item, {
								rightSection: r.autoplay ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { autoplay: !r.autoplay }),
								children: "Autoplay slideshow"
							}),
							[
								3,
								5,
								8
							].map((t) => /* @__PURE__ */ K(Y.Item, {
								disabled: !r.autoplay,
								rightSection: r.interval === t ? /* @__PURE__ */ G(Z, { size: 14 }) : null,
								onClick: () => Q(e, { interval: t }),
								children: [t, " seconds"]
							}, t))
						] })]
					}),
					/* @__PURE__ */ G(X, {
						label: "Open images in lightbox",
						position: "top",
						children: /* @__PURE__ */ G(P, {
							size: "lg",
							variant: "subtle",
							"aria-label": "Open images in lightbox",
							className: r.lightbox ? Wc.active : void 0,
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => Q(e, { lightbox: !r.lightbox }),
							children: /* @__PURE__ */ G(Ls, { size: 18 })
						})
					})
				] }) : null,
				/* @__PURE__ */ G("div", { className: Wc.divider }),
				/* @__PURE__ */ G(cl, { editor: e })
			]
		})
	});
}
//#endregion
//#region src/features/editor/components/common/use-alt-text-control.tsx
var dl = 300;
function fl(e) {
	return e.replace(/[\\\[\]!]/g, "").replace(/\s+/g, " ").trim();
}
function pl({ editor: e, nodeName: t, currentAlt: r }) {
	let { t: a } = it(), [o, s] = U(!1), [c, l] = U(""), u = B(() => {
		l(r || ""), s(!0);
	}, [r]);
	V(() => {
		let n = () => {
			e.isActive(t) || s(!1);
		};
		return e.on("selectionUpdate", n), () => {
			e.off("selectionUpdate", n);
		};
	}, [e, t]);
	let d = B(() => {
		s(!1);
	}, []), p = B(() => {
		e.chain().focus(void 0, { scrollIntoView: !1 }).updateAttributes(t, { alt: fl(c) || void 0 }).run(), s(!1);
	}, [
		e,
		t,
		c
	]), h = B((e) => {
		e.key === "Enter" && (e.metaKey || e.ctrlKey) ? (e.preventDefault(), p()) : e.key === "Escape" && (e.preventDefault(), d());
	}, [p, d]);
	return {
		button: /* @__PURE__ */ G(X, {
			position: "top",
			label: a("Alt text"),
			withinPortal: !1,
			children: /* @__PURE__ */ G(P, {
				onClick: u,
				size: "lg",
				"aria-label": a("Alt text"),
				variant: "subtle",
				children: /* @__PURE__ */ G(xs, { size: 18 })
			})
		}),
		panel: o ? /* @__PURE__ */ K(f, {
			withBorder: !0,
			shadow: "md",
			radius: 6,
			p: "sm",
			w: 320,
			style: {
				position: "relative",
				zIndex: 100
			},
			children: [
				/* @__PURE__ */ G(n, {
					size: "sm",
					fw: 600,
					mb: 2,
					children: a("Alt text")
				}),
				/* @__PURE__ */ G(n, {
					size: "xs",
					c: "dimmed",
					mb: "xs",
					children: a("Describe this for accessibility.")
				}),
				/* @__PURE__ */ G(yo, {
					size: "xs",
					placeholder: a("Add a description"),
					value: c,
					onChange: (e) => l(e.currentTarget.value),
					onKeyDown: h,
					autoFocus: !0,
					autosize: !0,
					minRows: 2,
					maxRows: 5,
					maxLength: dl
				}),
				/* @__PURE__ */ K(m, {
					justify: "space-between",
					align: "center",
					mt: "xs",
					wrap: "nowrap",
					children: [/* @__PURE__ */ K(n, {
						size: "xs",
						c: "dimmed",
						children: [
							c.length,
							"/",
							dl
						]
					}), /* @__PURE__ */ K(m, {
						gap: "xs",
						children: [/* @__PURE__ */ G(i, {
							size: "compact-xs",
							variant: "default",
							onClick: d,
							children: a("Cancel")
						}), /* @__PURE__ */ G(i, {
							size: "compact-xs",
							onClick: p,
							children: a("Save")
						})]
					})]
				})
			]
		}) : null,
		isEditing: o
	};
}
//#endregion
export { so as $, Rs as A, nn as At, Ts as B, Gs as C, _n as Ct, Vs as D, ln as Dt, Hs as E, dn as Et, Ms as F, ys as G, Cs as H, As as I, Y as J, _s as K, ks as L, Is as M, Jt as Mt, Fs as N, Xt as Nt, Bs as O, rn as Ot, Ns as P, co as Q, Z as R, Ks as S, vn as St, Us as T, mn as Tt, Ss as U, ws as V, bs as W, lo as X, yo as Y, uo as Z, ec as _, Nn as _t, Gc as a, ha as at, Ys as b, Mn as bt, Uc as c, Ji as ct, Bc as d, Kn as dt, io as et, lc as f, Wn as ft, rc as g, Bn as gt, ic as h, Vn as ht, ll as i, Sa as it, Ls as j, Zt as jt, zs as k, qt as kt, Hc as l, Fi as lt, ac as m, Hn as mt, ul as n, La as nt, Q as o, ua as ot, sc as p, Un as pt, X as q, cl as r, J as rt, Wc as s, Zi as st, pl as t, Ha as tt, Vc as u, sr as ut, Qs as v, An as vt, Ws as w, hn as wt, qs as x, kn as xt, Xs as y, jn as yt, Os as z };
