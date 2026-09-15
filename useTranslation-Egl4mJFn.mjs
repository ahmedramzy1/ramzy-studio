import { t as e } from "./shim-TDw7aRD2.mjs";
import { createContext as t, use as n, useCallback as r, useContext as i, useEffect as a, useMemo as o, useRef as s, useState as c } from "react";
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/utils/noop/noop.mjs
var l = () => {};
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-media-query/use-media-query.mjs
function u(e, t) {
	return typeof t == "boolean" ? t : typeof window < "u" && "matchMedia" in window ? window.matchMedia(e).matches : !1;
}
function d(e, t, { getInitialValueInEffect: n } = { getInitialValueInEffect: !0 }) {
	let [r, i] = c(n ? t : u(e));
	return a(() => {
		try {
			if ("matchMedia" in window) {
				let t = window.matchMedia(e);
				i(t.matches);
				let n = (e) => i(e.matches);
				return t.addEventListener("change", n), () => {
					t.removeEventListener("change", n);
				};
			}
		} catch {
			return;
		}
	}, [e]), r || !1;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+hooks@9.3.2_react@19.2.7/node_modules/@mantine/hooks/esm/use-color-scheme/use-color-scheme.mjs
function f(e, t) {
	return d("(prefers-color-scheme: dark)", e === "dark", t) ? "dark" : "light";
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/MantineProvider/Mantine.context.mjs
var p = t(null);
function m() {
	let e = n(p);
	if (!e) throw Error("[@mantine/core] MantineProvider was not found in tree");
	return e;
}
function h() {
	return m().cssVariablesResolver;
}
function g() {
	return m().classNamesPrefix;
}
function _() {
	return m().getStyleNonce;
}
function v() {
	return m().withStaticClasses;
}
function y() {
	return m().headless;
}
function b() {
	return m().stylesTransform?.sx;
}
function x() {
	return m().stylesTransform?.styles;
}
function S() {
	return m().env || "default";
}
function C() {
	return m().deduplicateInlineStyles;
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/MantineProvider/use-mantine-color-scheme/use-mantine-color-scheme.mjs
function w(e) {
	let t = document.createElement("style");
	return t.setAttribute("data-mantine-styles", "inline"), t.innerHTML = "*, *::before, *::after {transition: none !important;}", t.setAttribute("data-mantine-disable-transition", "true"), e && t.setAttribute("nonce", e), document.head.appendChild(t), () => document.querySelectorAll("[data-mantine-disable-transition]").forEach((e) => e.remove());
}
function T({ keepTransitions: e } = {}) {
	let t = s(l), i = s(-1), o = n(p), c = s(_()?.());
	if (!o) throw Error("[@mantine/core] MantineProvider was not found in tree");
	let u = (n) => {
		o.setColorScheme(n), t.current = e ? () => {} : w(c.current), window.clearTimeout(i.current), i.current = window.setTimeout(() => {
			t.current?.();
		}, 10);
	}, d = () => {
		o.clearColorScheme(), t.current = e ? () => {} : w(c.current), window.clearTimeout(i.current), i.current = window.setTimeout(() => {
			t.current?.();
		}, 10);
	}, m = f("light", { getInitialValueInEffect: !1 }), h = o.colorScheme === "auto" ? m : o.colorScheme, g = r(() => u(h === "light" ? "dark" : "light"), [u, h]);
	return a(() => () => {
		t.current?.(), window.clearTimeout(i.current);
	}, []), {
		colorScheme: o.colorScheme,
		setColorScheme: u,
		clearColorScheme: d,
		toggleColorScheme: g
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/core/MantineProvider/use-mantine-color-scheme/use-computed-color-scheme.mjs
function E(e, t = { getInitialValueInEffect: !0 }) {
	let n = f(e, t), { colorScheme: r } = T();
	return r === "auto" ? n : r;
}
//#endregion
//#region ../../node_modules/.pnpm/react-i18next@16.5.8_i18next@25.10.1_typescript@5.9.3__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@5.9.3/node_modules/react-i18next/dist/es/utils.js
var D = e(), O = (e, t, n, r) => {
	let i = [n, {
		code: t,
		...r || {}
	}];
	if (e?.services?.logger?.forward) return e.services.logger.forward(i, "warn", "react-i18next::", !0);
	F(i[0]) && (i[0] = `react-i18next:: ${i[0]}`), e?.services?.logger?.warn ? e.services.logger.warn(...i) : console?.warn && console.warn(...i);
}, k = {}, A = (e, t, n, r) => {
	F(n) && k[n] || (F(n) && (k[n] = /* @__PURE__ */ new Date()), O(e, t, n, r));
}, j = (e, t) => () => {
	if (e.isInitialized) t();
	else {
		let n = () => {
			setTimeout(() => {
				e.off("initialized", n);
			}, 0), t();
		};
		e.on("initialized", n);
	}
}, M = (e, t, n) => {
	e.loadNamespaces(t, j(e, n));
}, N = (e, t, n, r) => {
	if (F(n) && (n = [n]), e.options.preload && e.options.preload.indexOf(t) > -1) return M(e, n, r);
	n.forEach((t) => {
		e.options.ns.indexOf(t) < 0 && e.options.ns.push(t);
	}), e.loadLanguages(t, j(e, r));
}, P = (e, t, n = {}) => !t.languages || !t.languages.length ? (A(t, "NO_LANGUAGES", "i18n.languages were undefined or empty", { languages: t.languages }), !0) : t.hasLoadedNamespace(e, {
	lng: n.lng,
	precheck: (t, r) => {
		if (n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && t.services.backendConnector.backend && t.isLanguageChangingTo && !r(t.isLanguageChangingTo, e)) return !1;
	}
}), F = (e) => typeof e == "string", I = (e) => typeof e == "object" && !!e, L = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, R = {
	"&amp;": "&",
	"&#38;": "&",
	"&lt;": "<",
	"&#60;": "<",
	"&gt;": ">",
	"&#62;": ">",
	"&apos;": "'",
	"&#39;": "'",
	"&quot;": "\"",
	"&#34;": "\"",
	"&nbsp;": " ",
	"&#160;": " ",
	"&copy;": "©",
	"&#169;": "©",
	"&reg;": "®",
	"&#174;": "®",
	"&hellip;": "…",
	"&#8230;": "…",
	"&#x2F;": "/",
	"&#47;": "/"
}, z = (e) => R[e], B = (e) => e.replace(L, z), V = {
	bindI18n: "languageChanged",
	bindI18nStore: "",
	transEmptyNodeValue: "",
	transSupportBasicHtmlNodes: !0,
	transWrapTextNodes: "",
	transKeepBasicHtmlNodesFor: [
		"br",
		"strong",
		"i",
		"p"
	],
	useSuspense: !0,
	unescape: B,
	transDefaultProps: void 0
}, H = (e = {}) => {
	V = {
		...V,
		...e
	};
}, U = () => V, W, G = (e) => {
	W = e;
}, K = () => W, q = {
	type: "3rdParty",
	init(e) {
		H(e.options.react), G(e);
	}
}, J = t(), Y = class {
	constructor() {
		this.usedNamespaces = {};
	}
	addUsedNamespaces(e) {
		e.forEach((e) => {
			this.usedNamespaces[e] || (this.usedNamespaces[e] = !0);
		});
	}
	getUsedNamespaces() {
		return Object.keys(this.usedNamespaces);
	}
}, X = {
	t: (e, t) => {
		if (F(t)) return t;
		if (I(t) && F(t.defaultValue)) return t.defaultValue;
		if (typeof e == "function") return "";
		if (Array.isArray(e)) {
			let t = e[e.length - 1];
			return typeof t == "function" ? "" : t;
		}
		return e;
	},
	ready: !1
}, Z = () => () => {}, Q = (e, t = {}) => {
	let { i18n: n } = t, { i18n: l, defaultNS: u } = i(J) || {}, d = n || l || K();
	d && !d.reportNamespaces && (d.reportNamespaces = new Y()), d || A(d, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
	let f = o(() => ({
		...U(),
		...d?.options?.react,
		...t
	}), [d, t]), { useSuspense: p, keyPrefix: m } = f, h = e || u || d?.options?.defaultNS, g = F(h) ? [h] : h || ["translation"], _ = o(() => g, g);
	d?.reportNamespaces?.addUsedNamespaces?.(_);
	let v = s(0), y = r((e) => {
		if (!d) return Z;
		let { bindI18n: t, bindI18nStore: n } = f, r = () => {
			v.current += 1, e();
		};
		return t && d.on(t, r), n && d.store.on(n, r), () => {
			t && t.split(" ").forEach((e) => d.off(e, r)), n && n.split(" ").forEach((e) => d.store.off(e, r));
		};
	}, [d, f]), b = s(), x = r(() => {
		if (!d) return X;
		let e = !!(d.isInitialized || d.initializedStoreOnce) && _.every((e) => P(e, d, f)), n = t.lng || d.language, r = v.current, i = b.current;
		if (i && i.ready === e && i.lng === n && i.keyPrefix === m && i.revision === r) return i;
		let a = {
			t: d.getFixedT(n, f.nsMode === "fallback" ? _ : _[0], m),
			ready: e,
			lng: n,
			keyPrefix: m,
			revision: r
		};
		return b.current = a, a;
	}, [
		d,
		_,
		m,
		f,
		t.lng
	]), [S, C] = c(0), { t: w, ready: T } = (0, D.useSyncExternalStore)(y, x, x);
	a(() => {
		if (d && !T && !p) {
			let e = () => C((e) => e + 1);
			t.lng ? N(d, t.lng, _, e) : M(d, _, e);
		}
	}, [
		d,
		t.lng,
		_,
		T,
		p,
		S
	]);
	let E = d || {}, O = s(null), k = s(), j = (e) => {
		let t = Object.getOwnPropertyDescriptors(e);
		t.__original && delete t.__original;
		let n = Object.create(Object.getPrototypeOf(e), t);
		if (!Object.prototype.hasOwnProperty.call(n, "__original")) try {
			Object.defineProperty(n, "__original", {
				value: e,
				writable: !1,
				enumerable: !1,
				configurable: !1
			});
		} catch {}
		return n;
	}, I = o(() => {
		let e = E, t = e?.language, n = e;
		e && (O.current && O.current.__original === e && k.current === t ? n = O.current : (n = j(e), O.current = n, k.current = t));
		let r = [
			w,
			n,
			T
		];
		return r.t = w, r.i18n = n, r.ready = T, r;
	}, [
		w,
		E,
		T,
		E.resolvedLanguage,
		E.language,
		E.languages
	]);
	if (d && p && !T) throw new Promise((e) => {
		let n = () => e();
		t.lng ? N(d, t.lng, _, n) : M(d, _, n);
	});
	return I;
};
//#endregion
export { d as C, v as S, S as _, U as a, x as b, F as c, E as d, T as f, C as g, h, K as i, O as l, g as m, J as n, B as o, p, q as r, I as s, Q as t, A as u, y as v, l as w, b as x, _ as y };
