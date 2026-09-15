import { n as e, r as t } from "./chunk-jwUa06l-.mjs";
//#region ../../node_modules/.pnpm/nanoid@3.3.18/node_modules/nanoid/url-alphabet/index.js
var n, r = e((() => {
	n = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
})), i = /* @__PURE__ */ t({
	customAlphabet: () => s,
	customRandom: () => o,
	nanoid: () => c,
	random: () => a,
	urlAlphabet: () => n
}), a, o, s, c, l = e((() => {
	r(), a = (e) => crypto.getRandomValues(new Uint8Array(e)), o = (e, t, n) => {
		let r = (2 << Math.log(e.length - 1) / Math.LN2) - 1, i = -~(1.6 * r * t / e.length);
		return (a = t) => {
			if (a <= 0) return "";
			let o = "";
			for (;;) {
				let t = n(i), s = i | 0;
				for (; s--;) if (o += e[t[s] & r] || "", o.length === a) return o;
			}
		};
	}, s = (e, t = 21) => o(e, t, a), c = (e = 21) => crypto.getRandomValues(new Uint8Array(e)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
}));
//#endregion
export { c as i, i as n, l as r, s as t };
