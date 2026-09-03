import { o as e } from "./chunk-jwUa06l-.mjs";
import { t } from "./dist-CBm5yHDZ.mjs";
import { n } from "./index.mjs";
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs
var r = Object.defineProperty, i = (e, t) => r(e, "name", {
	value: t,
	configurable: !0
}), a = (e, t) => {
	for (var n in t) r(e, n, {
		get: t[n],
		enumerable: !0
	});
}, o = /* @__PURE__ */ e(n(), 1), s = {
	trace: 0,
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
	fatal: 5
}, c = {
	trace: /* @__PURE__ */ i((...e) => {}, "trace"),
	debug: /* @__PURE__ */ i((...e) => {}, "debug"),
	info: /* @__PURE__ */ i((...e) => {}, "info"),
	warn: /* @__PURE__ */ i((...e) => {}, "warn"),
	error: /* @__PURE__ */ i((...e) => {}, "error"),
	fatal: /* @__PURE__ */ i((...e) => {}, "fatal")
}, l = /* @__PURE__ */ i(function(e = "fatal") {
	let t = s.fatal;
	typeof e == "string" ? e.toLowerCase() in s && (t = s[e]) : typeof e == "number" && (t = e), c.trace = () => {}, c.debug = () => {}, c.info = () => {}, c.warn = () => {}, c.error = () => {}, c.fatal = () => {}, t <= s.fatal && (c.fatal = console.error ? console.error.bind(console, u("FATAL"), "color: orange") : console.log.bind(console, "\x1B[35m", u("FATAL"))), t <= s.error && (c.error = console.error ? console.error.bind(console, u("ERROR"), "color: orange") : console.log.bind(console, "\x1B[31m", u("ERROR"))), t <= s.warn && (c.warn = console.warn ? console.warn.bind(console, u("WARN"), "color: orange") : console.log.bind(console, "\x1B[33m", u("WARN"))), t <= s.info && (c.info = console.info ? console.info.bind(console, u("INFO"), "color: lightblue") : console.log.bind(console, "\x1B[34m", u("INFO"))), t <= s.debug && (c.debug = console.debug ? console.debug.bind(console, u("DEBUG"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", u("DEBUG"))), t <= s.trace && (c.trace = console.debug ? console.debug.bind(console, u("TRACE"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", u("TRACE")));
}, "setLogLevel"), u = /* @__PURE__ */ i((e) => `%c${(0, o.default)().format("ss.SSS")} : ${e} : `, "format"), d = {
	min: {
		r: 0,
		g: 0,
		b: 0,
		s: 0,
		l: 0,
		a: 0
	},
	max: {
		r: 255,
		g: 255,
		b: 255,
		h: 360,
		s: 100,
		l: 100,
		a: 1
	},
	clamp: {
		r: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
		g: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
		b: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
		h: (e) => e % 360,
		s: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
		l: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
		a: (e) => e >= 1 ? 1 : e < 0 ? 0 : e
	},
	toLinear: (e) => {
		let t = e / 255;
		return e > .03928 ? ((t + .055) / 1.055) ** 2.4 : t / 12.92;
	},
	hue2rgb: (e, t, n) => (n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e),
	hsl2rgb: ({ h: e, s: t, l: n }, r) => {
		if (!t) return n * 2.55;
		e /= 360, t /= 100, n /= 100;
		let i = n < .5 ? n * (1 + t) : n + t - n * t, a = 2 * n - i;
		switch (r) {
			case "r": return d.hue2rgb(a, i, e + 1 / 3) * 255;
			case "g": return d.hue2rgb(a, i, e) * 255;
			case "b": return d.hue2rgb(a, i, e - 1 / 3) * 255;
		}
	},
	rgb2hsl: ({ r: e, g: t, b: n }, r) => {
		e /= 255, t /= 255, n /= 255;
		let i = Math.max(e, t, n), a = Math.min(e, t, n), o = (i + a) / 2;
		if (r === "l") return o * 100;
		if (i === a) return 0;
		let s = i - a, c = o > .5 ? s / (2 - i - a) : s / (i + a);
		if (r === "s") return c * 100;
		switch (i) {
			case e: return ((t - n) / s + (t < n ? 6 : 0)) * 60;
			case t: return ((n - e) / s + 2) * 60;
			case n: return ((e - t) / s + 4) * 60;
			default: return -1;
		}
	}
}, f = {
	channel: d,
	lang: {
		clamp: (e, t, n) => t > n ? Math.min(t, Math.max(n, e)) : Math.min(n, Math.max(t, e)),
		round: (e) => Math.round(e * 1e10) / 1e10
	},
	unit: { dec2hex: (e) => {
		let t = Math.round(e).toString(16);
		return t.length > 1 ? t : `0${t}`;
	} }
}, p = {};
for (let e = 0; e <= 255; e++) p[e] = f.unit.dec2hex(e);
var m = {
	ALL: 0,
	RGB: 1,
	HSL: 2
}, h = class {
	constructor() {
		this.type = m.ALL;
	}
	get() {
		return this.type;
	}
	set(e) {
		if (this.type && this.type !== e) throw Error("Cannot change both RGB and HSL channels at the same time");
		this.type = e;
	}
	reset() {
		this.type = m.ALL;
	}
	is(e) {
		return this.type === e;
	}
}, g = new class {
	constructor(e, t) {
		this.color = t, this.changed = !1, this.data = e, this.type = new h();
	}
	set(e, t) {
		return this.color = t, this.changed = !1, this.data = e, this.type.type = m.ALL, this;
	}
	_ensureHSL() {
		let e = this.data, { h: t, s: n, l: r } = e;
		t === void 0 && (e.h = f.channel.rgb2hsl(e, "h")), n === void 0 && (e.s = f.channel.rgb2hsl(e, "s")), r === void 0 && (e.l = f.channel.rgb2hsl(e, "l"));
	}
	_ensureRGB() {
		let e = this.data, { r: t, g: n, b: r } = e;
		t === void 0 && (e.r = f.channel.hsl2rgb(e, "r")), n === void 0 && (e.g = f.channel.hsl2rgb(e, "g")), r === void 0 && (e.b = f.channel.hsl2rgb(e, "b"));
	}
	get r() {
		let e = this.data, t = e.r;
		return !this.type.is(m.HSL) && t !== void 0 ? t : (this._ensureHSL(), f.channel.hsl2rgb(e, "r"));
	}
	get g() {
		let e = this.data, t = e.g;
		return !this.type.is(m.HSL) && t !== void 0 ? t : (this._ensureHSL(), f.channel.hsl2rgb(e, "g"));
	}
	get b() {
		let e = this.data, t = e.b;
		return !this.type.is(m.HSL) && t !== void 0 ? t : (this._ensureHSL(), f.channel.hsl2rgb(e, "b"));
	}
	get h() {
		let e = this.data, t = e.h;
		return !this.type.is(m.RGB) && t !== void 0 ? t : (this._ensureRGB(), f.channel.rgb2hsl(e, "h"));
	}
	get s() {
		let e = this.data, t = e.s;
		return !this.type.is(m.RGB) && t !== void 0 ? t : (this._ensureRGB(), f.channel.rgb2hsl(e, "s"));
	}
	get l() {
		let e = this.data, t = e.l;
		return !this.type.is(m.RGB) && t !== void 0 ? t : (this._ensureRGB(), f.channel.rgb2hsl(e, "l"));
	}
	get a() {
		return this.data.a;
	}
	set r(e) {
		this.type.set(m.RGB), this.changed = !0, this.data.r = e;
	}
	set g(e) {
		this.type.set(m.RGB), this.changed = !0, this.data.g = e;
	}
	set b(e) {
		this.type.set(m.RGB), this.changed = !0, this.data.b = e;
	}
	set h(e) {
		this.type.set(m.HSL), this.changed = !0, this.data.h = e;
	}
	set s(e) {
		this.type.set(m.HSL), this.changed = !0, this.data.s = e;
	}
	set l(e) {
		this.type.set(m.HSL), this.changed = !0, this.data.l = e;
	}
	set a(e) {
		this.changed = !0, this.data.a = e;
	}
}({
	r: 0,
	g: 0,
	b: 0,
	a: 0
}, "transparent"), _ = {
	re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
	parse: (e) => {
		if (e.charCodeAt(0) !== 35) return;
		let t = e.match(_.re);
		if (!t) return;
		let n = t[1], r = parseInt(n, 16), i = n.length, a = i % 4 == 0, o = i > 4, s = o ? 1 : 17, c = o ? 8 : 4, l = a ? 0 : -1, u = o ? 255 : 15;
		return g.set({
			r: (r >> c * (l + 3) & u) * s,
			g: (r >> c * (l + 2) & u) * s,
			b: (r >> c * (l + 1) & u) * s,
			a: a ? (r & u) * s / 255 : 1
		}, e);
	},
	stringify: (e) => {
		let { r: t, g: n, b: r, a: i } = e;
		return i < 1 ? `#${p[Math.round(t)]}${p[Math.round(n)]}${p[Math.round(r)]}${p[Math.round(i * 255)]}` : `#${p[Math.round(t)]}${p[Math.round(n)]}${p[Math.round(r)]}`;
	}
}, v = {
	re: /^hsla?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(?:deg|grad|rad|turn)?)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(%)?))?\s*?\)$/i,
	hueRe: /^(.+?)(deg|grad|rad|turn)$/i,
	_hue2deg: (e) => {
		let t = e.match(v.hueRe);
		if (t) {
			let [, e, n] = t;
			switch (n) {
				case "grad": return f.channel.clamp.h(parseFloat(e) * .9);
				case "rad": return f.channel.clamp.h(parseFloat(e) * 180 / Math.PI);
				case "turn": return f.channel.clamp.h(parseFloat(e) * 360);
			}
		}
		return f.channel.clamp.h(parseFloat(e));
	},
	parse: (e) => {
		let t = e.charCodeAt(0);
		if (t !== 104 && t !== 72) return;
		let n = e.match(v.re);
		if (!n) return;
		let [, r, i, a, o, s] = n;
		return g.set({
			h: v._hue2deg(r),
			s: f.channel.clamp.s(parseFloat(i)),
			l: f.channel.clamp.l(parseFloat(a)),
			a: o ? f.channel.clamp.a(s ? parseFloat(o) / 100 : parseFloat(o)) : 1
		}, e);
	},
	stringify: (e) => {
		let { h: t, s: n, l: r, a: i } = e;
		return i < 1 ? `hsla(${f.lang.round(t)}, ${f.lang.round(n)}%, ${f.lang.round(r)}%, ${i})` : `hsl(${f.lang.round(t)}, ${f.lang.round(n)}%, ${f.lang.round(r)}%)`;
	}
}, y = {
	colors: {
		aliceblue: "#f0f8ff",
		antiquewhite: "#faebd7",
		aqua: "#00ffff",
		aquamarine: "#7fffd4",
		azure: "#f0ffff",
		beige: "#f5f5dc",
		bisque: "#ffe4c4",
		black: "#000000",
		blanchedalmond: "#ffebcd",
		blue: "#0000ff",
		blueviolet: "#8a2be2",
		brown: "#a52a2a",
		burlywood: "#deb887",
		cadetblue: "#5f9ea0",
		chartreuse: "#7fff00",
		chocolate: "#d2691e",
		coral: "#ff7f50",
		cornflowerblue: "#6495ed",
		cornsilk: "#fff8dc",
		crimson: "#dc143c",
		cyanaqua: "#00ffff",
		darkblue: "#00008b",
		darkcyan: "#008b8b",
		darkgoldenrod: "#b8860b",
		darkgray: "#a9a9a9",
		darkgreen: "#006400",
		darkgrey: "#a9a9a9",
		darkkhaki: "#bdb76b",
		darkmagenta: "#8b008b",
		darkolivegreen: "#556b2f",
		darkorange: "#ff8c00",
		darkorchid: "#9932cc",
		darkred: "#8b0000",
		darksalmon: "#e9967a",
		darkseagreen: "#8fbc8f",
		darkslateblue: "#483d8b",
		darkslategray: "#2f4f4f",
		darkslategrey: "#2f4f4f",
		darkturquoise: "#00ced1",
		darkviolet: "#9400d3",
		deeppink: "#ff1493",
		deepskyblue: "#00bfff",
		dimgray: "#696969",
		dimgrey: "#696969",
		dodgerblue: "#1e90ff",
		firebrick: "#b22222",
		floralwhite: "#fffaf0",
		forestgreen: "#228b22",
		fuchsia: "#ff00ff",
		gainsboro: "#dcdcdc",
		ghostwhite: "#f8f8ff",
		gold: "#ffd700",
		goldenrod: "#daa520",
		gray: "#808080",
		green: "#008000",
		greenyellow: "#adff2f",
		grey: "#808080",
		honeydew: "#f0fff0",
		hotpink: "#ff69b4",
		indianred: "#cd5c5c",
		indigo: "#4b0082",
		ivory: "#fffff0",
		khaki: "#f0e68c",
		lavender: "#e6e6fa",
		lavenderblush: "#fff0f5",
		lawngreen: "#7cfc00",
		lemonchiffon: "#fffacd",
		lightblue: "#add8e6",
		lightcoral: "#f08080",
		lightcyan: "#e0ffff",
		lightgoldenrodyellow: "#fafad2",
		lightgray: "#d3d3d3",
		lightgreen: "#90ee90",
		lightgrey: "#d3d3d3",
		lightpink: "#ffb6c1",
		lightsalmon: "#ffa07a",
		lightseagreen: "#20b2aa",
		lightskyblue: "#87cefa",
		lightslategray: "#778899",
		lightslategrey: "#778899",
		lightsteelblue: "#b0c4de",
		lightyellow: "#ffffe0",
		lime: "#00ff00",
		limegreen: "#32cd32",
		linen: "#faf0e6",
		magenta: "#ff00ff",
		maroon: "#800000",
		mediumaquamarine: "#66cdaa",
		mediumblue: "#0000cd",
		mediumorchid: "#ba55d3",
		mediumpurple: "#9370db",
		mediumseagreen: "#3cb371",
		mediumslateblue: "#7b68ee",
		mediumspringgreen: "#00fa9a",
		mediumturquoise: "#48d1cc",
		mediumvioletred: "#c71585",
		midnightblue: "#191970",
		mintcream: "#f5fffa",
		mistyrose: "#ffe4e1",
		moccasin: "#ffe4b5",
		navajowhite: "#ffdead",
		navy: "#000080",
		oldlace: "#fdf5e6",
		olive: "#808000",
		olivedrab: "#6b8e23",
		orange: "#ffa500",
		orangered: "#ff4500",
		orchid: "#da70d6",
		palegoldenrod: "#eee8aa",
		palegreen: "#98fb98",
		paleturquoise: "#afeeee",
		palevioletred: "#db7093",
		papayawhip: "#ffefd5",
		peachpuff: "#ffdab9",
		peru: "#cd853f",
		pink: "#ffc0cb",
		plum: "#dda0dd",
		powderblue: "#b0e0e6",
		purple: "#800080",
		rebeccapurple: "#663399",
		red: "#ff0000",
		rosybrown: "#bc8f8f",
		royalblue: "#4169e1",
		saddlebrown: "#8b4513",
		salmon: "#fa8072",
		sandybrown: "#f4a460",
		seagreen: "#2e8b57",
		seashell: "#fff5ee",
		sienna: "#a0522d",
		silver: "#c0c0c0",
		skyblue: "#87ceeb",
		slateblue: "#6a5acd",
		slategray: "#708090",
		slategrey: "#708090",
		snow: "#fffafa",
		springgreen: "#00ff7f",
		tan: "#d2b48c",
		teal: "#008080",
		thistle: "#d8bfd8",
		transparent: "#00000000",
		turquoise: "#40e0d0",
		violet: "#ee82ee",
		wheat: "#f5deb3",
		white: "#ffffff",
		whitesmoke: "#f5f5f5",
		yellow: "#ffff00",
		yellowgreen: "#9acd32"
	},
	parse: (e) => {
		e = e.toLowerCase();
		let t = y.colors[e];
		if (t) return _.parse(t);
	},
	stringify: (e) => {
		let t = _.stringify(e);
		for (let e in y.colors) if (y.colors[e] === t) return e;
	}
}, b = {
	re: /^rgba?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?)))?\s*?\)$/i,
	parse: (e) => {
		let t = e.charCodeAt(0);
		if (t !== 114 && t !== 82) return;
		let n = e.match(b.re);
		if (!n) return;
		let [, r, i, a, o, s, c, l, u] = n;
		return g.set({
			r: f.channel.clamp.r(i ? parseFloat(r) * 2.55 : parseFloat(r)),
			g: f.channel.clamp.g(o ? parseFloat(a) * 2.55 : parseFloat(a)),
			b: f.channel.clamp.b(c ? parseFloat(s) * 2.55 : parseFloat(s)),
			a: l ? f.channel.clamp.a(u ? parseFloat(l) / 100 : parseFloat(l)) : 1
		}, e);
	},
	stringify: (e) => {
		let { r: t, g: n, b: r, a: i } = e;
		return i < 1 ? `rgba(${f.lang.round(t)}, ${f.lang.round(n)}, ${f.lang.round(r)}, ${f.lang.round(i)})` : `rgb(${f.lang.round(t)}, ${f.lang.round(n)}, ${f.lang.round(r)})`;
	}
}, x = {
	format: {
		keyword: y,
		hex: _,
		rgb: b,
		rgba: b,
		hsl: v,
		hsla: v
	},
	parse: (e) => {
		if (typeof e != "string") return e;
		let t = _.parse(e) || b.parse(e) || v.parse(e) || y.parse(e);
		if (t) return t;
		throw Error(`Unsupported color format: "${e}"`);
	},
	stringify: (e) => !e.changed && e.color ? e.color : e.type.is(m.HSL) || e.data.r === void 0 ? v.stringify(e) : e.a < 1 || !Number.isInteger(e.r) || !Number.isInteger(e.g) || !Number.isInteger(e.b) ? b.stringify(e) : _.stringify(e)
}, S = (e, t) => {
	let n = x.parse(e);
	for (let e in t) n[e] = f.channel.clamp[e](t[e]);
	return x.stringify(n);
}, C = (e, t, n = 0, r = 1) => {
	if (typeof e != "number") return S(e, { a: t });
	let i = g.set({
		r: f.channel.clamp.r(e),
		g: f.channel.clamp.g(t),
		b: f.channel.clamp.b(n),
		a: f.channel.clamp.a(r)
	});
	return x.stringify(i);
}, w = (e) => {
	let { r: t, g: n, b: r } = x.parse(e), i = .2126 * f.channel.toLinear(t) + .7152 * f.channel.toLinear(n) + .0722 * f.channel.toLinear(r);
	return f.lang.round(i);
}, T = (e) => w(e) >= .5, E = (e) => !T(e), D = (e, t, n) => {
	let r = x.parse(e), i = r[t], a = f.channel.clamp[t](i + n);
	return i !== a && (r[t] = a), x.stringify(r);
}, O = (e, t) => D(e, "l", t), k = (e, t) => D(e, "l", -t), A = (e, t) => {
	let n = x.parse(e), r = {};
	for (let e in t) t[e] && (r[e] = n[e] + t[e]);
	return S(e, r);
}, ee = (e, t, n = 50) => {
	let { r, g: i, b: a, a: o } = x.parse(e), { r: s, g: c, b: l, a: u } = x.parse(t), d = n / 100, f = d * 2 - 1, p = o - u, m = ((f * p === -1 ? f : (f + p) / (1 + f * p)) + 1) / 2, h = 1 - m;
	return C(r * m + s * h, i * m + c * h, a * m + l * h, o * d + u * (1 - d));
}, j = (e, t = 100) => {
	let n = x.parse(e);
	return n.r = 255 - n.r, n.g = 255 - n.g, n.b = 255 - n.b, ee(n, e, t);
};
//#endregion
//#region ../../node_modules/.pnpm/dompurify@3.4.13/node_modules/dompurify/dist/purify.es.mjs
function te(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function ne(e) {
	if (Array.isArray(e)) return e;
}
function re(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t !== 0) for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function ie() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function M(e, t) {
	return ne(e) || re(e, t) || ae(e, t) || ie();
}
function ae(e, t) {
	if (e) {
		if (typeof e == "string") return te(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? te(e, t) : void 0;
	}
}
var oe = Object.entries, se = Object.setPrototypeOf, ce = Object.isFrozen, le = Object.getPrototypeOf, ue = Object.getOwnPropertyDescriptor, de = Object.freeze, fe = Object.seal, pe = Object.create, me = typeof Reflect < "u" && Reflect, he = me.apply, ge = me.construct;
de ||= function(e) {
	return e;
}, fe ||= function(e) {
	return e;
}, he ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, ge ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var _e = F(Array.prototype.forEach), ve = F(Array.prototype.lastIndexOf), ye = F(Array.prototype.pop), be = F(Array.prototype.push), xe = F(Array.prototype.splice), Se = Array.isArray, Ce = F(String.prototype.toLowerCase), we = F(String.prototype.toString), Te = F(String.prototype.match), Ee = F(String.prototype.replace), De = F(String.prototype.indexOf), Oe = F(String.prototype.trim), ke = F(Number.prototype.toString), N = F(Boolean.prototype.toString), Ae = typeof BigInt > "u" ? null : F(BigInt.prototype.toString), P = typeof Symbol > "u" ? null : F(Symbol.prototype.toString), je = F(Object.prototype.hasOwnProperty), Me = F(Object.prototype.toString), Ne = F(RegExp.prototype.test), Pe = Fe(TypeError);
function F(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return he(e, t, n);
	};
}
function Fe(e) {
	return function() {
		return ge(e, [...arguments]);
	};
}
function I(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ce;
	if (se && se(e, null), !Se(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (ce(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function Ie(e) {
	for (let t = 0; t < e.length; t++) je(e, t) || (e[t] = null);
	return e;
}
function Le(e) {
	let t = pe(null);
	for (let r of oe(e)) {
		var n = M(r, 2);
		let i = n[0], a = n[1];
		je(e, i) && (Se(a) ? t[i] = Ie(a) : a && typeof a == "object" && a.constructor === Object ? t[i] = Le(a) : t[i] = a);
	}
	return t;
}
function Re(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return ke(e);
		case "boolean": return N(e);
		case "bigint": return Ae ? Ae(e) : "0";
		case "symbol": return P ? P(e) : "Symbol()";
		case "undefined": return Me(e);
		case "function":
		case "object": {
			if (e === null) return Me(e);
			let t = e, n = ze(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : Me(e);
			}
			return Me(e);
		}
		default: return Me(e);
	}
}
function ze(e, t) {
	for (; e !== null;) {
		let n = ue(e, t);
		if (n) {
			if (n.get) return F(n.get);
			if (typeof n.value == "function") return F(n.value);
		}
		e = le(e);
	}
	function n() {
		return null;
	}
	return n;
}
function Be(e) {
	try {
		return Ne(e, ""), !0;
	} catch {
		return !1;
	}
}
var Ve = de(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), He = de(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Ue = de([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), We = de([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), Ge = de(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Ke = de([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), qe = de(["#text"]), Je = de(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), Ye = de(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Xe = de(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), Ze = de([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Qe = fe(/{{[\w\W]*|^[\w\W]*}}/g), $e = fe(/<%[\w\W]*|^[\w\W]*%>/g), et = fe(/\${[\w\W]*/g), tt = fe(/^data-[\-\w.\u00B7-\uFFFF]+$/), nt = fe(/^aria-[\-\w]+$/), rt = fe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), it = fe(/^(?:\w+script|data):/i), at = fe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), ot = fe(/^html$/i), st = fe(/^[a-z][.\w]*(-[.\w]+)+$/i), ct = fe(/<[/\w!]/g), lt = fe(/<[/\w]/g), ut = fe(/<\/no(script|embed|frames)/i), dt = fe(/\/>/i), ft = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, pt = function() {
	return typeof window > "u" ? null : window;
}, mt = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, ht = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, gt = function(e, t, n, r) {
	return je(e, t) && Se(e[t]) ? I(r.base ? Le(r.base) : {}, e[t], r.transform) : n;
};
function _t() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : pt(), t = (e) => _t(e);
	if (t.version = "3.4.13", t.removed = [], !e || !e.document || e.document.nodeType !== ft.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = ze(d, "cloneNode"), p = ze(d, "remove"), m = ze(d, "nextSibling"), h = ze(d, "childNodes"), g = ze(d, "parentNode"), _ = ze(d, "shadowRoot"), v = ze(d, "attributes"), y = o && o.prototype ? ze(o.prototype, "nodeType") : null, b = o && o.prototype ? ze(o.prototype, "nodeName") : null, x = o && o.prototype ? ze(o.prototype, "ownerDocument") : null;
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let S, C = "", w, T = !1, E = 0, D = function() {
		if (E > 0) throw Pe("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, O = function(e) {
		D(), E++;
		try {
			return S.createHTML(e);
		} finally {
			E--;
		}
	}, k = function(e) {
		D(), E++;
		try {
			return S.createScriptURL(e);
		} finally {
			E--;
		}
	}, A = function() {
		return T ||= (w = mt(u, i), !0), w;
	}, ee = n, j = ee.implementation, te = ee.createNodeIterator, ne = ee.createDocumentFragment, re = ee.getElementsByTagName, ie = r.importNode, M = ht();
	t.isSupported = typeof oe == "function" && typeof g == "function" && j && j.createHTMLDocument !== void 0;
	let ae = Qe, se = $e, ce = et, le = tt, ue = nt, me = it, he = at, ge = st, ke = rt, N = null, Ae = I({}, [
		...Ve,
		...He,
		...Ue,
		...Ge,
		...qe
	]), P = null, Me = I({}, [
		...Je,
		...Ye,
		...Xe,
		...Ze
	]), F = Object.seal(pe(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), Fe = null, Ie = null, vt = Object.seal(pe(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), yt = !0, bt = !0, xt = !1, St = !0, L = !1, Ct = !0, wt = !1, Tt = !1, Et = null, Dt = null, Ot = !1, kt = !1, At = !1, jt = !1, Mt = !0, Nt = !1, Pt = "user-content-", Ft = !0, It = !1, Lt = {}, Rt = null, zt = I({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Bt = null, Vt = I({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Ht = null, Ut = I({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), Wt = "http://www.w3.org/1998/Math/MathML", Gt = "http://www.w3.org/2000/svg", Kt = "http://www.w3.org/1999/xhtml", qt = Kt, Jt = !1, Yt = null, Xt = I({}, [
		Wt,
		Gt,
		Kt
	], we), Zt = de([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), Qt = I({}, Zt), $t = de(["annotation-xml"]), en = I({}, $t), tn = I({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), nn = null, rn = ["application/xhtml+xml", "text/html"], R = null, an = null, on = n.createElement("form"), sn = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, cn = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (an && an === e) return;
		(!e || typeof e != "object") && (e = {}), e = Le(e), nn = rn.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, R = nn === "application/xhtml+xml" ? we : Ce, N = gt(e, "ALLOWED_TAGS", Ae, { transform: R }), P = gt(e, "ALLOWED_ATTR", Me, { transform: R }), Yt = gt(e, "ALLOWED_NAMESPACES", Xt, { transform: we }), Ht = gt(e, "ADD_URI_SAFE_ATTR", Ut, {
			transform: R,
			base: Ut
		}), Bt = gt(e, "ADD_DATA_URI_TAGS", Vt, {
			transform: R,
			base: Vt
		}), Rt = gt(e, "FORBID_CONTENTS", zt, { transform: R }), Fe = gt(e, "FORBID_TAGS", Le({}), { transform: R }), Ie = gt(e, "FORBID_ATTR", Le({}), { transform: R }), Lt = je(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? Le(e.USE_PROFILES) : e.USE_PROFILES : !1, yt = e.ALLOW_ARIA_ATTR !== !1, bt = e.ALLOW_DATA_ATTR !== !1, xt = e.ALLOW_UNKNOWN_PROTOCOLS || !1, St = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, L = e.SAFE_FOR_TEMPLATES || !1, Ct = e.SAFE_FOR_XML !== !1, wt = e.WHOLE_DOCUMENT || !1, kt = e.RETURN_DOM || !1, At = e.RETURN_DOM_FRAGMENT || !1, jt = e.RETURN_TRUSTED_TYPE || !1, Ot = e.FORCE_BODY || !1, Mt = e.SANITIZE_DOM !== !1, Nt = e.SANITIZE_NAMED_PROPS || !1, Ft = e.KEEP_CONTENT !== !1, It = e.IN_PLACE || !1, ke = Be(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : rt, qt = typeof e.NAMESPACE == "string" ? e.NAMESPACE : Kt, Qt = je(e, "MATHML_TEXT_INTEGRATION_POINTS") && e.MATHML_TEXT_INTEGRATION_POINTS && typeof e.MATHML_TEXT_INTEGRATION_POINTS == "object" ? Le(e.MATHML_TEXT_INTEGRATION_POINTS) : I({}, Zt), en = je(e, "HTML_INTEGRATION_POINTS") && e.HTML_INTEGRATION_POINTS && typeof e.HTML_INTEGRATION_POINTS == "object" ? Le(e.HTML_INTEGRATION_POINTS) : I({}, $t);
		let t = je(e, "CUSTOM_ELEMENT_HANDLING") && e.CUSTOM_ELEMENT_HANDLING && typeof e.CUSTOM_ELEMENT_HANDLING == "object" ? Le(e.CUSTOM_ELEMENT_HANDLING) : pe(null);
		if (F = pe(null), je(t, "tagNameCheck") && sn(t.tagNameCheck) && (F.tagNameCheck = t.tagNameCheck), je(t, "attributeNameCheck") && sn(t.attributeNameCheck) && (F.attributeNameCheck = t.attributeNameCheck), je(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (F.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), fe(F), L && (bt = !1), At && (kt = !0), Lt && (N = I({}, qe), P = pe(null), Lt.html === !0 && (I(N, Ve), I(P, Je)), Lt.svg === !0 && (I(N, He), I(P, Ye), I(P, Ze)), Lt.svgFilters === !0 && (I(N, Ue), I(P, Ye), I(P, Ze)), Lt.mathMl === !0 && (I(N, Ge), I(P, Xe), I(P, Ze))), vt.tagCheck = null, vt.attributeCheck = null, je(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? vt.tagCheck = e.ADD_TAGS : Se(e.ADD_TAGS) && (N === Ae && (N = Le(N)), I(N, e.ADD_TAGS, R))), je(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? vt.attributeCheck = e.ADD_ATTR : Se(e.ADD_ATTR) && (P === Me && (P = Le(P)), I(P, e.ADD_ATTR, R))), je(e, "ADD_URI_SAFE_ATTR") && Se(e.ADD_URI_SAFE_ATTR) && I(Ht, e.ADD_URI_SAFE_ATTR, R), je(e, "FORBID_CONTENTS") && Se(e.FORBID_CONTENTS) && (Rt === zt && (Rt = Le(Rt)), I(Rt, e.FORBID_CONTENTS, R)), je(e, "ADD_FORBID_CONTENTS") && Se(e.ADD_FORBID_CONTENTS) && (Rt === zt && (Rt = Le(Rt)), I(Rt, e.ADD_FORBID_CONTENTS, R)), Ft && (N["#text"] = !0), wt && I(N, [
			"html",
			"head",
			"body"
		]), N.table && (I(N, ["tbody"]), delete Fe.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw Pe("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Pe("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = S;
			S = e.TRUSTED_TYPES_POLICY;
			try {
				C = O("");
			} catch (e) {
				throw S = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (S = void 0, C = "") : (S === void 0 && (S = A()), S && typeof C == "string" && (C = O("")));
		de && de(e), an = e;
	}, ln = I({}, [
		...He,
		...Ue,
		...We
	]), un = I({}, [...Ge, ...Ke]), dn = function(e, t, n) {
		return t.namespaceURI === Kt ? e === "svg" : t.namespaceURI === Wt ? e === "svg" && (n === "annotation-xml" || Qt[n]) : !!ln[e];
	}, fn = function(e, t, n) {
		return t.namespaceURI === Kt ? e === "math" : t.namespaceURI === Gt ? e === "math" && en[n] : !!un[e];
	}, pn = function(e, t, n) {
		return t.namespaceURI === Gt && !en[n] || t.namespaceURI === Wt && !Qt[n] ? !1 : !un[e] && (tn[e] || !ln[e]);
	}, mn = function(e) {
		let t = g(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: qt,
			tagName: "template"
		});
		let n = Ce(e.tagName), r = Ce(t.tagName);
		return Yt[e.namespaceURI] ? e.namespaceURI === Gt ? dn(n, t, r) : e.namespaceURI === Wt ? fn(n, t, r) : e.namespaceURI === Kt ? pn(n, t, r) : !!(nn === "application/xhtml+xml" && Yt[e.namespaceURI]) : !1;
	}, hn = function(e) {
		be(t.removed, { element: e });
		try {
			g(e).removeChild(e);
		} catch {
			if (p(e), !g(e)) throw Pe("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, gn = function(e) {
		yn(e);
		let t = h(e);
		if (t) {
			let e = [];
			_e(t, (t) => {
				be(e, t);
			}), _e(e, (e) => {
				try {
					p(e);
				} catch {}
			});
		}
		let n = v(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			if (typeof i == "string") try {
				e.removeAttribute(i);
			} catch {}
		}
	}, _n = function(e, n) {
		try {
			be(t.removed, {
				attribute: n.getAttributeNode(e),
				from: n
			});
		} catch {
			be(t.removed, {
				attribute: null,
				from: n
			});
		}
		if (n.removeAttribute(e), e === "is") if (kt || At) try {
			hn(n);
		} catch {}
		else try {
			n.setAttribute(e, "");
		} catch {}
	}, vn = function(e) {
		let t = v(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			if (!(typeof i != "string" || P[R(i)])) try {
				e.removeAttribute(i);
			} catch {}
		}
	}, yn = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			(y ? y(e) : e.nodeType) === ft.element && vn(e);
			let n = h(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, bn = function(e) {
		if (!Ct) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = y ? y(e) : e.nodeType;
			if (n === ft.processingInstruction || n === ft.comment && Ne(lt, e.data)) {
				try {
					p(e);
				} catch {}
				continue;
			}
			if (n === ft.element) {
				let t = e, n = R(b ? b(e) : e.nodeName);
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && n !== "label" && n !== "output" && t.removeAttribute("for");
				} catch {}
			}
			let r = h(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, xn = function(e) {
		let t = null, r = null;
		if (Ot) e = "<remove></remove>" + e;
		else {
			let t = Te(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		nn === "application/xhtml+xml" && qt === Kt && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = S ? O(e) : e;
		if (qt === Kt) try {
			t = new l().parseFromString(i, nn);
		} catch {}
		if (!t || !t.documentElement) {
			t = j.createDocument(qt, "template", null);
			try {
				t.documentElement.innerHTML = Jt ? C : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), qt === Kt ? re.call(t, wt ? "html" : "body")[0] : wt ? t.documentElement : a;
	}, Sn = function(e) {
		let t = x ? x(e) : e.ownerDocument;
		return te.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, Cn = function(e) {
		return e = Ee(e, ae, " "), e = Ee(e, se, " "), e = Ee(e, ce, " "), e;
	}, wn = function(e) {
		e.normalize();
		let t = x ? x(e) : e.ownerDocument, n = te.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = Cn(r.data), r = n.nextNode();
		let i = e.querySelectorAll?.call(e, "template");
		i && _e(i, (e) => {
			En(e.content) && wn(e.content);
		});
	}, Tn = function(e) {
		let t = b ? b(e) : null;
		return typeof t != "string" || R(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== v(e) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== y(e) || e.childNodes !== h(e);
	}, En = function(e) {
		if (!y || typeof e != "object" || !e) return !1;
		try {
			return y(e) === ft.documentFragment;
		} catch {
			return !1;
		}
	}, Dn = function(e) {
		if (!y || typeof e != "object" || !e) return !1;
		try {
			return typeof y(e) == "number";
		} catch {
			return !1;
		}
	};
	function On(e, n, r) {
		e.length !== 0 && _e(e, (e) => {
			e.call(t, n, r, an);
		});
	}
	let kn = function(e, t) {
		return !!(Ct && e.hasChildNodes() && !Dn(e.firstElementChild) && Ne(ct, e.textContent) && Ne(ct, e.innerHTML) || Ct && e.namespaceURI === Kt && t === "style" && Dn(e.firstElementChild) || e.nodeType === ft.processingInstruction || Ct && e.nodeType === ft.comment && Ne(lt, e.data));
	}, An = function(e, t, n) {
		if (!Fe[t] && Fn(t) && (F.tagNameCheck instanceof RegExp && Ne(F.tagNameCheck, t) || F.tagNameCheck instanceof Function && F.tagNameCheck(t))) return !1;
		if (Ft && !Rt[t]) {
			let t = g(e), r = h(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? f(r[a], !0) : r[a];
					t.insertBefore(i, m(e));
				}
			}
		}
		return hn(e), !0;
	}, jn = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? Le(t) : t;
	}, Mn = function(e, n) {
		if (On(M.beforeSanitizeElements, e, null), e !== n && g(e) === null) return It && yn(e), !0;
		if (Tn(e)) return hn(e), !0;
		let r = R(b ? b(e) : e.nodeName);
		if (N = jn(M.uponSanitizeElement, N, Ae, Et), On(M.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: N
		}), e !== n && g(e) === null) return It && yn(e), !0;
		if (kn(e, r)) return hn(e), !0;
		if (Fe[r] || !(vt.tagCheck instanceof Function && vt.tagCheck(r)) && !N[r]) {
			let t = An(e, r, n);
			return t === !1 && On(M.afterSanitizeElements, e, null), t;
		}
		if ((y ? y(e) : e.nodeType) === ft.element && !mn(e) || (r === "noscript" || r === "noembed" || r === "noframes") && Ne(ut, e.innerHTML)) return hn(e), !0;
		if (L && e.nodeType === ft.text) {
			let n = Cn(e.textContent);
			e.textContent !== n && (be(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return On(M.afterSanitizeElements, e, null), !1;
	}, Nn = function(e, t, r) {
		if (Ie[t] || Ct && t === "patchsrc" || Ct && t === "for" && e !== "label" && e !== "output" || Mt && (t === "id" || t === "name") && (r in n || r in on)) return !1;
		let i = P[t] || vt.attributeCheck instanceof Function && vt.attributeCheck(t, e);
		if (!(bt && Ne(le, t)) && !(yt && Ne(ue, t))) {
			if (!i) {
				if (!(Fn(e) && (F.tagNameCheck instanceof RegExp && Ne(F.tagNameCheck, e) || F.tagNameCheck instanceof Function && F.tagNameCheck(e)) && (F.attributeNameCheck instanceof RegExp && Ne(F.attributeNameCheck, t) || F.attributeNameCheck instanceof Function && F.attributeNameCheck(t, e)) || t === "is" && F.allowCustomizedBuiltInElements && (F.tagNameCheck instanceof RegExp && Ne(F.tagNameCheck, r) || F.tagNameCheck instanceof Function && F.tagNameCheck(r)))) return !1;
			} else if (!Ht[t] && !Ne(ke, Ee(r, he, "")) && !((t === "src" || t === "xlink:href" || t === "href") && e !== "script" && De(r, "data:") === 0 && Bt[e]) && !(xt && !Ne(me, Ee(r, he, ""))) && r) return !1;
		}
		return !0;
	}, Pn = I({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Fn = function(e) {
		return !Pn[Ce(e)] && Ne(ge, e);
	}, In = function(e, t, n, r) {
		if (S && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return O(r);
			case "TrustedScriptURL": return k(r);
		}
		return r;
	}, Ln = function(e, n, r, i) {
		try {
			r ? e.setAttributeNS(r, n, i) : e.setAttribute(n, i), Tn(e) ? hn(e) : ye(t.removed);
		} catch {
			_n(n, e);
		}
	}, Rn = function(e) {
		On(M.beforeSanitizeAttributes, e, null);
		let t = e.attributes;
		if (!t || Tn(e)) return;
		P = jn(M.uponSanitizeAttribute, P, Me, Dt);
		let n = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: P,
			forceKeepAttr: void 0
		}, r = t.length, i = R(e.nodeName);
		for (; r--;) {
			let a = t[r], o = a.name, s = a.namespaceURI, c = a.value, l = R(o), u = c, d = o === "value" ? u : Oe(u);
			if (n.attrName = l, n.attrValue = d, n.keepAttr = !0, n.forceKeepAttr = void 0, On(M.uponSanitizeAttribute, e, n), d = n.attrValue, Nt && (l === "id" || l === "name") && De(d, Pt) !== 0 && (_n(o, e), d = Pt + d), Ct && Ne(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, d)) {
				_n(o, e);
				continue;
			}
			if (l === "attributename" && Te(d, "href")) {
				_n(o, e);
				continue;
			}
			if (!n.forceKeepAttr) {
				if (!n.keepAttr) {
					_n(o, e);
					continue;
				}
				if (!St && Ne(dt, d)) {
					_n(o, e);
					continue;
				}
				if (L && (d = Cn(d)), !Nn(i, l, d)) {
					_n(o, e);
					continue;
				}
				d = In(i, l, s, d), d !== u && Ln(e, o, s, d);
			}
		}
		On(M.afterSanitizeAttributes, e, null);
	}, zn = function(e) {
		let t = null, n = Sn(e);
		for (On(M.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (On(M.uponSanitizeShadowNode, t, null), Mn(t, e), Rn(t), En(t.content) && zn(t.content), (y ? y(t) : t.nodeType) === ft.element) {
			let e = _(t);
			En(e) && (Bn(e), zn(e));
		}
		On(M.afterSanitizeShadowDOM, e, null);
	}, Bn = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				zn(e.shadow);
				continue;
			}
			let n = e.node, r = (y ? y(n) : n.nodeType) === ft.element, i = h(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = b ? b(n) : null;
				if (typeof e == "string" && R(e) === "template") {
					let e = n.content;
					En(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = _(n);
				En(e) && t.push({
					node: null,
					shadow: e
				}, {
					node: e,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, o = null, s = null;
		if (Jt = !e, Jt && (e = "<!-->"), typeof e != "string" && !Dn(e) && (e = Re(e), typeof e != "string")) throw Pe("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		Tt ? (N = Et, P = Dt) : cn(n), (M.uponSanitizeElement.length > 0 || M.uponSanitizeAttribute.length > 0) && (N = Le(N)), M.uponSanitizeAttribute.length > 0 && (P = Le(P)), t.removed = [];
		let c = It && typeof e != "string" && Dn(e);
		if (c) {
			bn(e);
			let t = b ? b(e) : e.nodeName;
			if (typeof t == "string") {
				let n = R(t);
				if (!N[n] || Fe[n]) throw gn(e), Pe("root node is forbidden and cannot be sanitized in-place");
			}
			if (Tn(e)) throw gn(e), Pe("root node is clobbered and cannot be sanitized in-place");
			try {
				Bn(e);
			} catch (t) {
				throw gn(e), t;
			}
		} else if (Dn(e)) i = xn("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === ft.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Bn(a);
		else {
			if (!kt && !L && !wt && e.indexOf("<") === -1) return S && jt ? O(e) : e;
			if (i = xn(e), !i) return kt ? null : jt ? C : "";
		}
		i && Ot && hn(i.firstChild);
		let l = c ? e : i;
		try {
			let e = Sn(l);
			for (; o = e.nextNode();) Mn(o, l), Rn(o), En(o.content) && zn(o.content);
		} catch (n) {
			throw c && (gn(e), _e(t.removed, (e) => {
				e.element && yn(e.element);
			})), n;
		}
		if (c) return _e(t.removed, (e) => {
			e.element && yn(e.element);
		}), L && wn(e), e;
		if (kt) {
			if (L && wn(i), At) for (s = ne.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (P.shadowroot || P.shadowrootmode) && (s = ie.call(r, s, !0)), s;
		}
		let u = wt ? i.outerHTML : i.innerHTML;
		return wt && N["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && Ne(ot, i.ownerDocument.doctype.name) && (u = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + u), L && (u = Cn(u)), S && jt ? O(u) : u;
	}, t.setConfig = function() {
		cn(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), Tt = !0, Et = N, Dt = P;
	}, t.clearConfig = function() {
		an = null, Tt = !1, Et = null, Dt = null, S = w, C = "";
	}, t.isValidAttribute = function(e, t, n) {
		return an || cn({}), Nn(R(e), R(t), n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && je(M, e) && be(M[e], t);
	}, t.removeHook = function(e, t) {
		if (je(M, e)) {
			if (t !== void 0) {
				let n = ve(M[e], t);
				return n === -1 ? void 0 : xe(M[e], n, 1)[0];
			}
			return ye(M[e]);
		}
	}, t.removeHooks = function(e) {
		je(M, e) && (M[e] = []);
	}, t.removeAllHooks = function() {
		M = ht();
	}, t;
}
var vt = _t(), yt = /* @__PURE__ */ i((e, t, { depth: n = 2 } = {}) => {
	let r = { depth: n };
	if (Array.isArray(t) && !Array.isArray(e)) return t.forEach((t) => yt(e, t, r)), e;
	if (Array.isArray(t) && Array.isArray(e)) return t.forEach((t) => {
		e.includes(t) || e.push(t);
	}), e;
	if (e == null || n <= 0) return typeof e == "object" && e && typeof t == "object" ? Object.assign(e, t) : t;
	if (t != null && typeof e == "object" && typeof t == "object") {
		let r = e;
		Object.entries(t).forEach(([t, i]) => {
			if (typeof i == "object") {
				if (i === null) return;
				Object.hasOwn(e, t) || Object.defineProperty(e, t, {
					value: void 0,
					writable: !0,
					enumerable: !0,
					configurable: !0
				}), r[t] === void 0 && (r[t] = Array.isArray(i) ? [] : {}), typeof r[t] == "object" && (r[t] = yt(r[t], i, { depth: n - 1 }));
			} else typeof r[t] != "object" && (Object.hasOwn(e, t) ? r[t] = i : Object.defineProperty(e, t, {
				value: i,
				writable: !0,
				enumerable: !0,
				configurable: !0
			}));
		});
	}
	return e;
}, "assignWithDepth"), bt = yt, xt = "#ffffff", St = "#f2f2f2", L = /* @__PURE__ */ i((e, t) => t ? A(e, {
	s: -40,
	l: 10
}) : A(e, {
	s: -40,
	l: -10
}), "mkBorder"), Ct = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#f4f4f4", this.primaryColor = "#fff4dd", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.fontFamily = "\"trebuchet ms\", verdana, arial, sans-serif", this.fontSize = "16px", this.useGradient = !0, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
	}
	updateColors() {
		if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || A(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || A(this.primaryColor, {
			h: 180,
			l: 5
		}), this.primaryBorderColor = this.primaryBorderColor || L(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || L(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || L(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || j(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || j(this.tertiaryColor), this.lineColor = this.lineColor || j(this.background), this.arrowheadColor = this.arrowheadColor || j(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || k(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || j(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || "navy", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.darkMode ? (this.rowOdd = this.rowOdd || k(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || k(this.mainBkg, 10)) : (this.rowOdd = this.rowOdd || O(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || O(this.mainBkg, 5)), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || this.tertiaryColor, this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || A(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || A(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || A(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || A(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || A(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || A(this.primaryColor, {
			h: 210,
			l: 150
		}), this.cScale9 = this.cScale9 || A(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || A(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || A(this.primaryColor, { h: 330 }), this.darkMode) for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 75);
		else for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 25);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		let e = this.darkMode ? -4 : -1;
		for (let t = 0; t < 5; t++) this["surface" + t] = this["surface" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (5 + t * 3)
		}), this["surfacePeer" + t] = this["surfacePeer" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (8 + t * 3)
		});
		this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || A(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || A(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || A(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || A(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || A(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || A(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || A(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || A(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || A(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || A(this.primaryColor, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(this.primaryColor, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(this.primaryColor, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(this.primaryColor, {
			h: 60,
			l: -20
		}), this.pie11 = this.pie11 || A(this.primaryColor, {
			h: -60,
			l: -20
		}), this.pie12 = this.pie12 || A(this.primaryColor, {
			h: 120,
			l: -10
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? A(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? A(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? A(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? A(this.primaryColor, {
			h: 60,
			l: -30
		}), this.venn5 = this.venn5 ?? A(this.primaryColor, {
			h: -60,
			l: -30
		}), this.venn6 = this.venn6 ?? A(this.secondaryColor, {
			h: 60,
			l: -30
		}), this.venn7 = this.venn7 ?? A(this.primaryColor, {
			h: 120,
			l: -30
		}), this.venn8 = this.venn8 ?? A(this.secondaryColor, {
			h: 120,
			l: -30
		}), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
			domainFontSize: this.cynefin?.domainFontSize || 16,
			itemFontSize: this.cynefin?.itemFontSize || 12,
			boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
			boundaryWidth: this.cynefin?.boundaryWidth || 2,
			cliffColor: this.cynefin?.cliffColor || "#8B0000",
			cliffWidth: this.cynefin?.cliffWidth || 4,
			arrowColor: this.cynefin?.arrowColor || this.lineColor,
			arrowWidth: this.cynefin?.arrowWidth || 2,
			complexBg: this.cynefin?.complexBg || "#E8F5E9",
			complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
			chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
			clearBg: this.cynefin?.clearBg || "#FFF8E1",
			confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
			textColor: this.cynefin?.textColor || this.textColor,
			labelColor: this.cynefin?.labelColor || this.primaryTextColor
		}, this.radar = {
			axisColor: this.radar?.axisColor || this.lineColor,
			axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
			axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
			curveOpacity: this.radar?.curveOpacity || .5,
			curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
			graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
			graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
			graticuleOpacity: this.radar?.graticuleOpacity || .3,
			legendBoxSize: this.radar?.legendBoxSize || 12,
			legendFontSize: this.radar?.legendFontSize || 12
		}, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
			backgroundColor: this.wardley?.backgroundColor || this.background,
			axisColor: this.wardley?.axisColor || this.lineColor,
			axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
			gridColor: this.wardley?.gridColor || this.gridColor,
			componentFill: this.wardley?.componentFill || this.background,
			componentStroke: this.wardley?.componentStroke || this.lineColor,
			componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
			linkStroke: this.wardley?.linkStroke || this.lineColor,
			evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
			annotationStroke: this.wardley?.annotationStroke || this.lineColor,
			annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
			annotationFill: this.wardley?.annotationFill || this.background
		}, this.archEdgeColor = this.archEdgeColor || "#777", this.archEdgeArrowColor = this.archEdgeArrowColor || "#777", this.archEdgeWidth = this.archEdgeWidth || "3", this.archGroupBorderColor = this.archGroupBorderColor || "#000", this.archGroupBorderWidth = this.archGroupBorderWidth || "2px", this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
		}, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || A(this.primaryColor, { h: -30 }), this.git4 = this.git4 || A(this.primaryColor, { h: -60 }), this.git5 = this.git5 || A(this.primaryColor, { h: -90 }), this.git6 = this.git6 || A(this.primaryColor, { h: 60 }), this.git7 = this.git7 || A(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, wt = /* @__PURE__ */ i((e) => {
	let t = new Ct();
	return t.calculate(e), t;
}, "getThemeVariables"), Tt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = A(this.primaryColor, { h: -160 }), this.primaryBorderColor = j(this.background), this.secondaryBorderColor = L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = L(this.tertiaryColor, this.darkMode), this.primaryTextColor = j(this.primaryColor), this.secondaryTextColor = j(this.secondaryColor), this.tertiaryTextColor = j(this.tertiaryColor), this.lineColor = j(this.background), this.textColor = j(this.background), this.mainBkg = "#1f2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(j("#323D47"), 10), this.lineColor = "calculated", this.border1 = "#ccc", this.border2 = C(255, 255, 255, .25), this.arrowheadColor = "calculated", this.fontFamily = "\"trebuchet ms\", verdana, arial, sans-serif", this.fontSize = "16px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#F9FFFE", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "calculated", this.activationBkgColor = "calculated", this.sequenceNumberColor = "black", this.clusterBkg = "#302F3D", this.sectionBkgColor = k("#EAE8D9", 30), this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "#EAE8D9", this.excludeBkgColor = k(this.sectionBkgColor, 10), this.taskBorderColor = C(255, 255, 255, 70), this.taskBkgColor = "calculated", this.taskTextColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = C(255, 255, 255, 50), this.activeTaskBkgColor = "#81B1DB", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "grey", this.critBorderColor = "#E83737", this.critBkgColor = "#E83737", this.taskTextDarkColor = "calculated", this.todayLineColor = "#DB5757", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = this.rowOdd || O(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || k(this.mainBkg, 10), this.labelColor = "calculated", this.errorBkgColor = "#a44141", this.errorTextColor = "#ddd", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal";
	}
	updateColors() {
		this.secondBkg = O(this.mainBkg, 16), this.lineColor = this.mainContrastColor, this.arrowheadColor = this.mainContrastColor, this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.edgeLabelBackground = O(this.labelBackground, 25), this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.actorTextColor = this.mainContrastColor, this.actorLineColor = this.actorBorder, this.signalColor = this.mainContrastColor, this.signalTextColor = this.mainContrastColor, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.mainContrastColor, this.loopTextColor = this.mainContrastColor, this.noteBorderColor = this.secondaryBorderColor, this.noteBkgColor = this.secondBkg, this.noteTextColor = this.secondaryTextColor, this.activationBorderColor = this.border1, this.activationBkgColor = this.secondBkg, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.background, this.taskBkgColor = O(this.mainBkg, 23), this.taskTextColor = this.darkTextColor, this.taskTextLightColor = this.mainContrastColor, this.taskTextOutsideColor = this.taskTextLightColor, this.gridColor = this.mainContrastColor, this.doneTaskBkgColor = this.mainContrastColor, this.taskTextDarkColor = j(this.doneTaskBkgColor), this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#555", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#f4f4f4", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = A(this.primaryColor, { h: 64 }), this.fillType3 = A(this.secondaryColor, { h: 64 }), this.fillType4 = A(this.primaryColor, { h: -64 }), this.fillType5 = A(this.secondaryColor, { h: -64 }), this.fillType6 = A(this.primaryColor, { h: 128 }), this.fillType7 = A(this.secondaryColor, { h: 128 }), this.cScale1 = this.cScale1 || "#0b0000", this.cScale2 = this.cScale2 || "#4d1037", this.cScale3 = this.cScale3 || "#3f5258", this.cScale4 = this.cScale4 || "#4f2f1b", this.cScale5 = this.cScale5 || "#6e0a0a", this.cScale6 = this.cScale6 || "#3b0048", this.cScale7 = this.cScale7 || "#995a01", this.cScale8 = this.cScale8 || "#154706", this.cScale9 = this.cScale9 || "#161722", this.cScale10 = this.cScale10 || "#00296f", this.cScale11 = this.cScale11 || "#01629c", this.cScale12 = this.cScale12 || "#010029", this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || A(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || A(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || A(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || A(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || A(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || A(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || A(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || A(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || A(this.primaryColor, { h: 330 });
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10);
		for (let e = 0; e < 5; e++) this["surface" + e] = this["surface" + e] || A(this.mainBkg, {
			h: 30,
			s: -30,
			l: -(-10 + e * 4)
		}), this["surfacePeer" + e] = this["surfacePeer" + e] || A(this.mainBkg, {
			h: 30,
			s: -30,
			l: -(-7 + e * 4)
		});
		this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["pie" + e] = this["cScale" + e];
		this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.mainContrastColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.mainContrastColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
		for (let e = 0; e < 8; e++) this["venn" + (e + 1)] = this["venn" + (e + 1)] ?? O(this["cScale" + e], 30);
		this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
			domainFontSize: this.cynefin?.domainFontSize || 16,
			itemFontSize: this.cynefin?.itemFontSize || 12,
			boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
			boundaryWidth: this.cynefin?.boundaryWidth || 2,
			cliffColor: this.cynefin?.cliffColor || "#FF6B6B",
			cliffWidth: this.cynefin?.cliffWidth || 4,
			arrowColor: this.cynefin?.arrowColor || this.lineColor,
			arrowWidth: this.cynefin?.arrowWidth || 2,
			complexBg: this.cynefin?.complexBg || "#1B5E20",
			complicatedBg: this.cynefin?.complicatedBg || "#0D47A1",
			chaoticBg: this.cynefin?.chaoticBg || "#BF360C",
			clearBg: this.cynefin?.clearBg || "#F57F17",
			confusionBg: this.cynefin?.confusionBg || "#4A148C",
			textColor: this.cynefin?.textColor || this.textColor,
			labelColor: this.cynefin?.labelColor || this.primaryTextColor
		}, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#3498db,#2ecc71,#e74c3c,#f1c40f,#bdc3c7,#ffffff,#34495e,#9b59b6,#1abc9c,#e67e22"
		}, this.packet = {
			startByteColor: this.primaryTextColor,
			endByteColor: this.primaryTextColor,
			labelColor: this.primaryTextColor,
			titleColor: this.primaryTextColor,
			blockStrokeColor: this.primaryTextColor,
			blockFillColor: this.background
		}, this.radar = {
			axisColor: this.radar?.axisColor || this.lineColor,
			axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
			axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
			curveOpacity: this.radar?.curveOpacity || .5,
			curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
			graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
			graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
			graticuleOpacity: this.radar?.graticuleOpacity || .3,
			legendBoxSize: this.radar?.legendBoxSize || 12,
			legendFontSize: this.radar?.legendFontSize || 12
		}, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#ff6b6b", this.wardley = {
			backgroundColor: this.wardley?.backgroundColor || this.background,
			axisColor: this.wardley?.axisColor || this.lineColor,
			axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
			gridColor: this.wardley?.gridColor || this.gridColor,
			componentFill: this.wardley?.componentFill || this.mainBkg,
			componentStroke: this.wardley?.componentStroke || this.lineColor,
			componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
			linkStroke: this.wardley?.linkStroke || this.lineColor,
			evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
			annotationStroke: this.wardley?.annotationStroke || this.lineColor,
			annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
			annotationFill: this.wardley?.annotationFill || this.mainBkg
		}, this.classText = this.primaryTextColor, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = O(this.secondaryColor, 20), this.git1 = O(this.pie2 || this.secondaryColor, 20), this.git2 = O(this.pie3 || this.tertiaryColor, 20), this.git3 = O(this.pie4 || A(this.primaryColor, { h: -30 }), 20), this.git4 = O(this.pie5 || A(this.primaryColor, { h: -60 }), 20), this.git5 = O(this.pie6 || A(this.primaryColor, { h: -90 }), 10), this.git6 = O(this.pie7 || A(this.primaryColor, { h: 60 }), 10), this.git7 = O(this.pie8 || A(this.primaryColor, { h: 120 }), 20), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || j(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || j(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "#2d2d2d", this.emUiStroke = this.emUiStroke || "#555", this.emProcessorFill = this.emProcessorFill || O("#5a3d5c", 10), this.emProcessorStroke = this.emProcessorStroke || "#8a6d8c", this.emReadModelFill = this.emReadModelFill || O("#3d5a2d", 10), this.emReadModelStroke = this.emReadModelStroke || "#6d8c5c", this.emCommandFill = this.emCommandFill || O("#2d3d5a", 10), this.emCommandStroke = this.emCommandStroke || "#5c6d8c", this.emEventFill = this.emEventFill || O("#5a452d", 10), this.emEventStroke = this.emEventStroke || "#8c755c", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || O(this.background, 5), this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || O(this.background, 12), this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || O(this.background, 12), this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || O(this.background, 2), this.nodeBorder = this.nodeBorder || "#999";
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Et = /* @__PURE__ */ i((e) => {
	let t = new Tt();
	return t.calculate(e), t;
}, "getThemeVariables"), Dt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#f4f4f4", this.primaryColor = "#ECECFF", this.secondaryColor = A(this.primaryColor, { h: 120 }), this.secondaryColor = "#ffffde", this.tertiaryColor = A(this.primaryColor, { h: -160 }), this.primaryBorderColor = L(this.primaryColor, this.darkMode), this.secondaryBorderColor = L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = L(this.tertiaryColor, this.darkMode), this.primaryTextColor = j(this.primaryColor), this.secondaryTextColor = j(this.secondaryColor), this.tertiaryTextColor = j(this.tertiaryColor), this.lineColor = j(this.background), this.textColor = j(this.background), this.background = "white", this.mainBkg = "#ECECFF", this.secondBkg = "#ffffde", this.lineColor = "#333333", this.border1 = "#9370DB", this.primaryBorderColor = L(this.primaryColor, this.darkMode), this.border2 = "#aaaa33", this.arrowheadColor = "#333333", this.fontFamily = "\"trebuchet ms\", verdana, arial, sans-serif", this.fontSize = "16px", this.labelBackground = "rgba(232,232,232, 0.8)", this.textColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.clusterBkg = "#FBFBFF", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = this.taskTextDarkColor, this.taskTextClickableColor = "calculated", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBorderColor = "calculated", this.critBkgColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.sectionBkgColor = C(102, 102, 255, .49), this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#fff400", this.taskBorderColor = "#534fbc", this.taskBkgColor = "#8a90dd", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "#534fbc", this.activeTaskBkgColor = "#bfc7ff", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "navy", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = "calculated", this.rowEven = "calculated", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !1, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow(1px 2px 2px rgba(185, 185, 185, 1))", this.updateColors();
	}
	updateColors() {
		this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || A(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || A(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || A(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || A(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || A(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || A(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || A(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || A(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || A(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || k(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || k(this.tertiaryColor, 40);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 10), this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 25);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || A(this["cScale" + e], { h: 180 });
		for (let e = 0; e < 5; e++) this["surface" + e] = this["surface" + e] || A(this.mainBkg, {
			h: 30,
			l: -(5 + e * 5)
		}), this["surfacePeer" + e] = this["surfacePeer" + e] || A(this.mainBkg, {
			h: 30,
			l: -(7 + e * 5)
		});
		if (this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor, this.labelTextColor !== "calculated") {
			this.cScaleLabel0 = this.cScaleLabel0 || j(this.labelTextColor), this.cScaleLabel3 = this.cScaleLabel3 || j(this.labelTextColor);
			for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.labelTextColor;
		}
		this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.textColor, this.edgeLabelBackground = this.labelBackground, this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.signalColor = this.textColor, this.signalTextColor = this.textColor, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || O(this.primaryColor, 75) || "#ffffff", this.rowEven = this.rowEven || O(this.primaryColor, 1), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = A(this.primaryColor, { h: 64 }), this.fillType3 = A(this.secondaryColor, { h: 64 }), this.fillType4 = A(this.primaryColor, { h: -64 }), this.fillType5 = A(this.secondaryColor, { h: -64 }), this.fillType6 = A(this.primaryColor, { h: 128 }), this.fillType7 = A(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || A(this.tertiaryColor, { l: -40 }), this.pie4 = this.pie4 || A(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || A(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || A(this.tertiaryColor, { l: -20 }), this.pie7 = this.pie7 || A(this.primaryColor, {
			h: 60,
			l: -20
		}), this.pie8 = this.pie8 || A(this.primaryColor, {
			h: -60,
			l: -40
		}), this.pie9 = this.pie9 || A(this.primaryColor, {
			h: 120,
			l: -40
		}), this.pie10 = this.pie10 || A(this.primaryColor, {
			h: 60,
			l: -40
		}), this.pie11 = this.pie11 || A(this.primaryColor, {
			h: -90,
			l: -40
		}), this.pie12 = this.pie12 || A(this.primaryColor, {
			h: 120,
			l: -30
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? A(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? A(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? A(this.tertiaryColor, { l: -40 }), this.venn4 = this.venn4 ?? A(this.primaryColor, {
			h: 60,
			l: -30
		}), this.venn5 = this.venn5 ?? A(this.primaryColor, {
			h: -60,
			l: -30
		}), this.venn6 = this.venn6 ?? A(this.secondaryColor, {
			h: 60,
			l: -30
		}), this.venn7 = this.venn7 ?? A(this.primaryColor, {
			h: 120,
			l: -30
		}), this.venn8 = this.venn8 ?? A(this.secondaryColor, {
			h: 120,
			l: -30
		}), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
			domainFontSize: this.cynefin?.domainFontSize || 16,
			itemFontSize: this.cynefin?.itemFontSize || 12,
			boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
			boundaryWidth: this.cynefin?.boundaryWidth || 2,
			cliffColor: this.cynefin?.cliffColor || "#8B0000",
			cliffWidth: this.cynefin?.cliffWidth || 4,
			arrowColor: this.cynefin?.arrowColor || this.lineColor,
			arrowWidth: this.cynefin?.arrowWidth || 2,
			complexBg: this.cynefin?.complexBg || "#E8F5E9",
			complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
			chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
			clearBg: this.cynefin?.clearBg || "#FFF8E1",
			confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
			textColor: this.cynefin?.textColor || this.textColor,
			labelColor: this.cynefin?.labelColor || this.primaryTextColor
		}, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.radar = {
			axisColor: this.radar?.axisColor || this.lineColor,
			axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
			axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
			curveOpacity: this.radar?.curveOpacity || .5,
			curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
			graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
			graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
			graticuleOpacity: this.radar?.graticuleOpacity || .3,
			legendBoxSize: this.radar?.legendBoxSize || 12,
			legendFontSize: this.radar?.legendFontSize || 12
		}, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
			backgroundColor: this.wardley?.backgroundColor || this.background,
			axisColor: this.wardley?.axisColor || this.lineColor,
			axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
			gridColor: this.wardley?.gridColor || this.gridColor,
			componentFill: this.wardley?.componentFill || this.background,
			componentStroke: this.wardley?.componentStroke || this.lineColor,
			componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
			linkStroke: this.wardley?.linkStroke || this.lineColor,
			evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
			annotationStroke: this.wardley?.annotationStroke || this.lineColor,
			annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
			annotationFill: this.wardley?.annotationFill || this.background
		}, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#ECECFF,#8493A6,#FFC3A0,#DCDDE1,#B8E994,#D1A36F,#C3CDE6,#FFB6C1,#496078,#F8F3E3"
		}, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.labelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || A(this.primaryColor, { h: -30 }), this.git4 = this.git4 || A(this.primaryColor, { h: -60 }), this.git5 = this.git5 || A(this.primaryColor, { h: -90 }), this.git6 = this.git6 || A(this.primaryColor, { h: 60 }), this.git7 = this.git7 || A(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || k(j(this.git0), 25), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || j(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || j(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (Object.keys(this).forEach((e) => {
			this[e] === "calculated" && (this[e] = void 0);
		}), typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Ot = /* @__PURE__ */ i((e) => {
	let t = new Dt();
	return t.calculate(e), t;
}, "getThemeVariables"), kt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#f4f4f4", this.primaryColor = "#cde498", this.secondaryColor = "#cdffb2", this.background = "white", this.mainBkg = "#cde498", this.secondBkg = "#cdffb2", this.lineColor = "green", this.border1 = "#13540c", this.border2 = "#6eaa49", this.arrowheadColor = "green", this.fontFamily = "\"trebuchet ms\", verdana, arial, sans-serif", this.fontSize = "16px", this.tertiaryColor = O("#cde498", 10), this.primaryBorderColor = L(this.primaryColor, this.darkMode), this.secondaryBorderColor = L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = L(this.tertiaryColor, this.darkMode), this.primaryTextColor = j(this.primaryColor), this.secondaryTextColor = j(this.secondaryColor), this.tertiaryTextColor = j(this.primaryColor), this.lineColor = j(this.background), this.textColor = j(this.background), this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#333", this.edgeLabelBackground = "#e8e8e8", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "#333", this.signalTextColor = "#333", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "#326932", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "#6eaa49", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#6eaa49", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "#487e3a", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.5))";
	}
	updateColors() {
		this.actorBorder = k(this.mainBkg, 20), this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || A(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || A(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || A(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || A(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || A(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || A(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || A(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || A(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || A(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || k(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || k(this.tertiaryColor, 40);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 10), this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 25);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || A(this["cScale" + e], { h: 180 });
		this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		for (let e = 0; e < 5; e++) this["surface" + e] = this["surface" + e] || A(this.mainBkg, {
			h: 30,
			s: -30,
			l: -(5 + e * 5)
		}), this["surfacePeer" + e] = this["surfacePeer" + e] || A(this.mainBkg, {
			h: 30,
			s: -30,
			l: -(8 + e * 5)
		});
		this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.taskBorderColor = this.border1, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || O(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || O(this.mainBkg, 20), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = A(this.primaryColor, { h: 64 }), this.fillType3 = A(this.secondaryColor, { h: 64 }), this.fillType4 = A(this.primaryColor, { h: -64 }), this.fillType5 = A(this.secondaryColor, { h: -64 }), this.fillType6 = A(this.primaryColor, { h: 128 }), this.fillType7 = A(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || A(this.primaryColor, { l: -30 }), this.pie5 = this.pie5 || A(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || A(this.tertiaryColor, {
			h: 40,
			l: -40
		}), this.pie7 = this.pie7 || A(this.primaryColor, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(this.primaryColor, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(this.primaryColor, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(this.primaryColor, {
			h: 60,
			l: -50
		}), this.pie11 = this.pie11 || A(this.primaryColor, {
			h: -60,
			l: -50
		}), this.pie12 = this.pie12 || A(this.primaryColor, {
			h: 120,
			l: -50
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? A(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? A(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? A(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? A(this.primaryColor, {
			h: 60,
			l: -30
		}), this.venn5 = this.venn5 ?? A(this.primaryColor, {
			h: -60,
			l: -30
		}), this.venn6 = this.venn6 ?? A(this.secondaryColor, {
			h: 60,
			l: -30
		}), this.venn7 = this.venn7 ?? A(this.primaryColor, {
			h: 120,
			l: -30
		}), this.venn8 = this.venn8 ?? A(this.secondaryColor, {
			h: 120,
			l: -30
		}), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
			domainFontSize: this.cynefin?.domainFontSize || 16,
			itemFontSize: this.cynefin?.itemFontSize || 12,
			boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
			boundaryWidth: this.cynefin?.boundaryWidth || 2,
			cliffColor: this.cynefin?.cliffColor || "#8B4513",
			cliffWidth: this.cynefin?.cliffWidth || 4,
			arrowColor: this.cynefin?.arrowColor || this.lineColor,
			arrowWidth: this.cynefin?.arrowWidth || 2,
			complexBg: this.cynefin?.complexBg || "#C8E6C9",
			complicatedBg: this.cynefin?.complicatedBg || "#DCEDC8",
			chaoticBg: this.cynefin?.chaoticBg || "#FFE0B2",
			clearBg: this.cynefin?.clearBg || "#FFF9C4",
			confusionBg: this.cynefin?.confusionBg || "#D7CCC8",
			textColor: this.cynefin?.textColor || this.textColor,
			labelColor: this.cynefin?.labelColor || this.primaryTextColor
		}, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.packet = {
			startByteColor: this.primaryTextColor,
			endByteColor: this.primaryTextColor,
			labelColor: this.primaryTextColor,
			titleColor: this.primaryTextColor,
			blockStrokeColor: this.primaryTextColor,
			blockFillColor: this.mainBkg
		}, this.radar = {
			axisColor: this.radar?.axisColor || this.lineColor,
			axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
			axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
			curveOpacity: this.radar?.curveOpacity || .5,
			curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
			graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
			graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
			graticuleOpacity: this.radar?.graticuleOpacity || .3,
			legendBoxSize: this.radar?.legendBoxSize || 12,
			legendFontSize: this.radar?.legendFontSize || 12
		}, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
			backgroundColor: this.wardley?.backgroundColor || this.background,
			axisColor: this.wardley?.axisColor || this.lineColor,
			axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
			gridColor: this.wardley?.gridColor || this.gridColor,
			componentFill: this.wardley?.componentFill || this.background,
			componentStroke: this.wardley?.componentStroke || this.lineColor,
			componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
			linkStroke: this.wardley?.linkStroke || this.lineColor,
			evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
			annotationStroke: this.wardley?.annotationStroke || this.lineColor,
			annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
			annotationFill: this.wardley?.annotationFill || this.background
		}, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#CDE498,#FF6B6B,#A0D2DB,#D7BDE2,#F0F0F0,#FFC3A0,#7FD8BE,#FF9A8B,#FAF3E0,#FFF176"
		}, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || A(this.primaryColor, { h: -30 }), this.git4 = this.git4 || A(this.primaryColor, { h: -60 }), this.git5 = this.git5 || A(this.primaryColor, { h: -90 }), this.git6 = this.git6 || A(this.primaryColor, { h: 60 }), this.git7 = this.git7 || A(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || j(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || j(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, At = /* @__PURE__ */ i((e) => {
	let t = new kt();
	return t.calculate(e), t;
}, "getThemeVariables"), jt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.primaryColor = "#eee", this.contrast = "#707070", this.secondaryColor = O(this.contrast, 55), this.background = "#ffffff", this.tertiaryColor = A(this.primaryColor, { h: -160 }), this.primaryBorderColor = L(this.primaryColor, this.darkMode), this.secondaryBorderColor = L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = L(this.tertiaryColor, this.darkMode), this.primaryTextColor = j(this.primaryColor), this.secondaryTextColor = j(this.secondaryColor), this.tertiaryTextColor = j(this.tertiaryColor), this.lineColor = j(this.background), this.textColor = j(this.background), this.mainBkg = "#eee", this.secondBkg = "calculated", this.lineColor = "#666", this.border1 = "#999", this.border2 = "calculated", this.note = "#ffa", this.text = "#333", this.critical = "#d42", this.done = "#bbb", this.arrowheadColor = "#333333", this.fontFamily = "\"trebuchet ms\", verdana, arial, sans-serif", this.fontSize = "16px", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "white", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = this.actorBorder, this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "calculated", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBkgColor = "calculated", this.critBorderColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.rowOdd = this.rowOdd || O(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || "#f4f4f4", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
	}
	updateColors() {
		this.secondBkg = O(this.contrast, 55), this.border2 = this.contrast, this.actorBorder = O(this.border1, 23), this.actorBkg = this.mainBkg, this.actorTextColor = this.text, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.signalColor = this.text, this.signalTextColor = this.text, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.text, this.loopTextColor = this.text, this.noteBorderColor = "#999", this.noteBkgColor = "#666", this.noteTextColor = "#fff", this.cScale0 = this.cScale0 || "#555", this.cScale1 = this.cScale1 || "#F4F4F4", this.cScale2 = this.cScale2 || "#555", this.cScale3 = this.cScale3 || "#BBB", this.cScale4 = this.cScale4 || "#777", this.cScale5 = this.cScale5 || "#999", this.cScale6 = this.cScale6 || "#DDD", this.cScale7 = this.cScale7 || "#FFF", this.cScale8 = this.cScale8 || "#DDD", this.cScale9 = this.cScale9 || "#BBB", this.cScale10 = this.cScale10 || "#999", this.cScale11 = this.cScale11 || "#777";
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.cScaleLabel0 = this.cScaleLabel0 || this.cScale1, this.cScaleLabel2 = this.cScaleLabel2 || this.cScale1;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		for (let e = 0; e < 5; e++) this["surface" + e] = this["surface" + e] || A(this.mainBkg, { l: -(5 + e * 5) }), this["surfacePeer" + e] = this["surfacePeer" + e] || A(this.mainBkg, { l: -(8 + e * 5) });
		this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.text, this.sectionBkgColor = O(this.contrast, 30), this.sectionBkgColor2 = O(this.contrast, 30), this.taskBorderColor = k(this.contrast, 10), this.taskBkgColor = this.contrast, this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = this.text, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.gridColor = O(this.border1, 30), this.doneTaskBkgColor = this.done, this.doneTaskBorderColor = this.lineColor, this.critBkgColor = this.critical, this.critBorderColor = k(this.critBkgColor, 10), this.todayLineColor = this.critBkgColor, this.vertLineColor = this.critBkgColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || "#000", this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f4f4f4", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.stateBorder = this.stateBorder || "#000", this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#222", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = A(this.primaryColor, { h: 64 }), this.fillType3 = A(this.secondaryColor, { h: 64 }), this.fillType4 = A(this.primaryColor, { h: -64 }), this.fillType5 = A(this.secondaryColor, { h: -64 }), this.fillType6 = A(this.primaryColor, { h: 128 }), this.fillType7 = A(this.secondaryColor, { h: 128 });
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["pie" + e] = this["cScale" + e];
		this.pie12 = this.pie0, this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
		for (let e = 0; e < 8; e++) this["venn" + (e + 1)] = this["venn" + (e + 1)] ?? this["cScale" + e];
		this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
			domainFontSize: this.cynefin?.domainFontSize || 16,
			itemFontSize: this.cynefin?.itemFontSize || 12,
			boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
			boundaryWidth: this.cynefin?.boundaryWidth || 2,
			cliffColor: this.cynefin?.cliffColor || "#8B0000",
			cliffWidth: this.cynefin?.cliffWidth || 4,
			arrowColor: this.cynefin?.arrowColor || this.lineColor,
			arrowWidth: this.cynefin?.arrowWidth || 2,
			complexBg: this.cynefin?.complexBg || "#E8F5E9",
			complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
			chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
			clearBg: this.cynefin?.clearBg || "#FFF8E1",
			confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
			textColor: this.cynefin?.textColor || this.textColor,
			labelColor: this.cynefin?.labelColor || this.primaryTextColor
		}, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#EEE,#6BB8E4,#8ACB88,#C7ACD6,#E8DCC2,#FFB2A8,#FFF380,#7E8D91,#FFD8B1,#FAF3E0"
		}, this.radar = {
			axisColor: this.radar?.axisColor || this.lineColor,
			axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
			axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
			curveOpacity: this.radar?.curveOpacity || .5,
			curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
			graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
			graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
			graticuleOpacity: this.radar?.graticuleOpacity || .3,
			legendBoxSize: this.radar?.legendBoxSize || 12,
			legendFontSize: this.radar?.legendFontSize || 12
		}, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
			backgroundColor: this.wardley?.backgroundColor || this.background,
			axisColor: this.wardley?.axisColor || this.lineColor,
			axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
			gridColor: this.wardley?.gridColor || this.gridColor,
			componentFill: this.wardley?.componentFill || this.background,
			componentStroke: this.wardley?.componentStroke || this.lineColor,
			componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
			linkStroke: this.wardley?.linkStroke || this.lineColor,
			evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
			annotationStroke: this.wardley?.annotationStroke || this.lineColor,
			annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
			annotationFill: this.wardley?.annotationFill || this.background
		}, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = k(this.pie1, 25) || this.primaryColor, this.git1 = this.pie2 || this.secondaryColor, this.git2 = this.pie3 || this.tertiaryColor, this.git3 = this.pie4 || A(this.primaryColor, { h: -30 }), this.git4 = this.pie5 || A(this.primaryColor, { h: -60 }), this.git5 = this.pie6 || A(this.primaryColor, { h: -90 }), this.git6 = this.pie7 || A(this.primaryColor, { h: 60 }), this.git7 = this.pie8 || A(this.primaryColor, { h: 120 }), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || this.labelTextColor, this.gitBranchLabel0 = this.branchLabelColor, this.gitBranchLabel1 = "white", this.gitBranchLabel2 = this.branchLabelColor, this.gitBranchLabel3 = "white", this.gitBranchLabel4 = this.branchLabelColor, this.gitBranchLabel5 = this.branchLabelColor, this.gitBranchLabel6 = this.branchLabelColor, this.gitBranchLabel7 = this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Mt = /* @__PURE__ */ i((e) => {
	let t = new jt();
	return t.calculate(e), t;
}, "getThemeVariables"), Nt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 2, this.primaryBorderColor = L(this.primaryColor, this.darkMode), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#000000", this.stateBorder = "#000000", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 0px 1px 2px rgba(0, 0, 0, 0.25));", this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
	}
	updateColors() {
		this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || A(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || A(this.primaryColor, {
			h: 180,
			l: 5
		}), this.primaryBorderColor = this.primaryBorderColor || L(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || L(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || L(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || j(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || j(this.tertiaryColor), this.lineColor = this.lineColor || j(this.background), this.arrowheadColor = this.arrowheadColor || j(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || k(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || j(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
		let e = "#ECECFE", t = "#E9E9F1", n = A(e, {
			h: 180,
			l: 5
		});
		if (this.sectionBkgColor = this.sectionBkgColor || n, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || t, this.sectionBkgColor2 = this.sectionBkgColor2 || e, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || e, this.activeTaskBorderColor = this.activeTaskBorderColor || e, this.activeTaskBkgColor = this.activeTaskBkgColor || O(e, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || e, this.cScale1 = this.cScale1 || t, this.cScale2 = this.cScale2 || n, this.cScale3 = this.cScale3 || A(e, { h: 30 }), this.cScale4 = this.cScale4 || A(e, { h: 60 }), this.cScale5 = this.cScale5 || A(e, { h: 90 }), this.cScale6 = this.cScale6 || A(e, { h: 120 }), this.cScale7 = this.cScale7 || A(e, { h: 150 }), this.cScale8 = this.cScale8 || A(e, {
			h: 210,
			l: 150
		}), this.cScale9 = this.cScale9 || A(e, { h: 270 }), this.cScale10 = this.cScale10 || A(e, { h: 300 }), this.cScale11 = this.cScale11 || A(e, { h: 330 }), this.darkMode) for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 75);
		else for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 25);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		let r = this.darkMode ? -4 : -1;
		for (let e = 0; e < 5; e++) this["surface" + e] = this["surface" + e] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: r * (5 + e * 3)
		}), this["surfacePeer" + e] = this["surfacePeer" + e] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: r * (8 + e * 3)
		});
		this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || e, this.fillType1 = this.fillType1 || t, this.fillType2 = this.fillType2 || A(e, { h: 64 }), this.fillType3 = this.fillType3 || A(t, { h: 64 }), this.fillType4 = this.fillType4 || A(e, { h: -64 }), this.fillType5 = this.fillType5 || A(t, { h: -64 }), this.fillType6 = this.fillType6 || A(e, { h: 128 }), this.fillType7 = this.fillType7 || A(t, { h: 128 }), this.pie1 = this.pie1 || e, this.pie2 = this.pie2 || t, this.pie3 = this.pie3 || n, this.pie4 = this.pie4 || A(e, { l: -10 }), this.pie5 = this.pie5 || A(t, { l: -10 }), this.pie6 = this.pie6 || A(n, { l: -10 }), this.pie7 = this.pie7 || A(e, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(e, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(e, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(e, {
			h: 60,
			l: -20
		}), this.pie11 = this.pie11 || A(e, {
			h: -60,
			l: -20
		}), this.pie12 = this.pie12 || A(e, {
			h: 120,
			l: -10
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || e, this.quadrant2Fill = this.quadrant2Fill || A(e, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(e, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(e, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
		}, this.requirementBackground = this.requirementBackground || e, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || e, this.git1 = this.git1 || t, this.git2 = this.git2 || n, this.git3 = this.git3 || A(e, { h: -30 }), this.git4 = this.git4 || A(e, { h: -60 }), this.git5 = this.git5 || A(e, { h: -90 }), this.git6 = this.git6 || A(e, { h: 60 }), this.git7 = this.git7 || A(e, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Pt = /* @__PURE__ */ i((e) => {
	let t = new Nt();
	return t.calculate(e), t;
}, "getThemeVariables"), Ft = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = A(this.primaryColor, { h: -160 }), this.primaryBorderColor = j(this.background), this.secondaryBorderColor = L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = L(this.tertiaryColor, this.darkMode), this.primaryTextColor = j(this.primaryColor), this.secondaryTextColor = j(this.secondaryColor), this.tertiaryTextColor = j(this.tertiaryColor), this.mainBkg = "#2a2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(j("#323D47"), 10), this.border1 = "#ccc", this.border2 = C(255, 255, 255, .25), this.arrowheadColor = j(this.background), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 1, this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.2))", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
	}
	updateColors() {
		if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || A(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || A(this.primaryColor, {
			h: 180,
			l: 5
		}), this.primaryBorderColor = this.primaryBorderColor || L(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || L(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || L(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || j(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || j(this.tertiaryColor), this.lineColor = this.lineColor || j(this.background), this.arrowheadColor = this.arrowheadColor || j(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || k(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || j(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || A(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || A(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || A(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || A(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || A(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || A(this.primaryColor, {
			h: 210,
			l: 150
		}), this.cScale9 = this.cScale9 || A(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || A(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || A(this.primaryColor, { h: 330 }), this.darkMode) for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 75);
		else for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 25);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		let e = this.darkMode ? -4 : -1;
		for (let t = 0; t < 5; t++) this["surface" + t] = this["surface" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (5 + t * 3)
		}), this["surfacePeer" + t] = this["surfacePeer" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (8 + t * 3)
		});
		this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || A(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || A(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || A(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || A(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || A(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || A(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || A(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || A(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || A(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || A(this.primaryColor, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(this.primaryColor, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(this.primaryColor, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(this.primaryColor, {
			h: 60,
			l: -20
		}), this.pie11 = this.pie11 || A(this.primaryColor, {
			h: -60,
			l: -20
		}), this.pie12 = this.pie12 || A(this.primaryColor, {
			h: 120,
			l: -10
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
		}, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || "#0b0000", this.git1 = this.git1 || "#4d1037", this.git2 = this.git2 || "#3f5258", this.git3 = this.git3 || "#4f2f1b", this.git4 = this.git4 || "#6e0a0a", this.git5 = this.git5 || "#3b0048", this.git6 = this.git6 || "#995a01", this.git7 = this.git7 || "#154706", this.gitDarkMode = !0, this.gitDarkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, It = /* @__PURE__ */ i((e) => {
	let t = new Ft();
	return t.calculate(e), t;
}, "getThemeVariables"), Lt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = L("#28253D", this.darkMode), this.fontFamily = "\"Recursive Variable\", arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.clusterBkg = "#F9F9FB", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.filterColor = "#000000";
	}
	updateColors() {
		this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || A(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || A(this.primaryColor, {
			h: 180,
			l: 5
		}), this.primaryBorderColor = this.primaryBorderColor || L(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || L(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || L(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#FEF9C3", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || j(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || j(this.tertiaryColor), this.lineColor = this.lineColor || j(this.background), this.arrowheadColor = this.arrowheadColor || j(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.noteFontWeight = 600, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || k(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || j(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
		let e = "#ECECFE", t = "#E9E9F1", n = A(e, {
			h: 180,
			l: 5
		});
		this.sectionBkgColor = this.sectionBkgColor || n, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || t, this.sectionBkgColor2 = this.sectionBkgColor2 || e, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || e, this.activeTaskBorderColor = this.activeTaskBorderColor || e, this.activeTaskBkgColor = this.activeTaskBkgColor || O(e, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.compositeTitleBackground = "#F9F9FB", this.altBackground = "#F9F9FB", this.stateEdgeLabelBackground = "#FFFFFF", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = this.mainBkg;
		if (this.darkMode) for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 75);
		else for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 25);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		let r = this.darkMode ? -4 : -1;
		for (let e = 0; e < 5; e++) this["surface" + e] = this["surface" + e] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: r * (5 + e * 3)
		}), this["surfacePeer" + e] = this["surfacePeer" + e] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: r * (8 + e * 3)
		});
		this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || e, this.fillType1 = this.fillType1 || t, this.fillType2 = this.fillType2 || A(e, { h: 64 }), this.fillType3 = this.fillType3 || A(t, { h: 64 }), this.fillType4 = this.fillType4 || A(e, { h: -64 }), this.fillType5 = this.fillType5 || A(t, { h: -64 }), this.fillType6 = this.fillType6 || A(e, { h: 128 }), this.fillType7 = this.fillType7 || A(t, { h: 128 }), this.pie1 = this.pie1 || e, this.pie2 = this.pie2 || t, this.pie3 = this.pie3 || n, this.pie4 = this.pie4 || A(e, { l: -10 }), this.pie5 = this.pie5 || A(t, { l: -10 }), this.pie6 = this.pie6 || A(n, { l: -10 }), this.pie7 = this.pie7 || A(e, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(e, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(e, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(e, {
			h: 60,
			l: -20
		}), this.pie11 = this.pie11 || A(e, {
			h: -60,
			l: -20
		}), this.pie12 = this.pie12 || A(e, {
			h: 120,
			l: -10
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || e, this.quadrant2Fill = this.quadrant2Fill || A(e, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(e, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(e, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
		}, this.requirementBackground = this.requirementBackground || e, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#FFFFFF", this.git0 = this.git0 || e, this.git1 = this.git1 || t, this.git2 = this.git2 || n, this.git3 = this.git3 || A(e, { h: -30 }), this.git4 = this.git4 || A(e, { h: -60 }), this.git5 = this.git5 || A(e, { h: -90 }), this.git6 = this.git6 || A(e, { h: 60 }), this.git7 = this.git7 || A(e, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Rt = /* @__PURE__ */ i((e) => {
	let t = new Lt();
	return t.calculate(e), t;
}, "getThemeVariables"), zt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = A(this.primaryColor, { h: -160 }), this.primaryBorderColor = j(this.background), this.secondaryBorderColor = L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = L(this.tertiaryColor, this.darkMode), this.primaryTextColor = j(this.primaryColor), this.secondaryTextColor = j(this.secondaryColor), this.tertiaryTextColor = j(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(j("#323D47"), 10), this.border1 = "#ccc", this.border2 = C(255, 255, 255, .25), this.arrowheadColor = j(this.background), this.fontFamily = "\"Recursive Variable\", arial, sans-serif", this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = "\"Recursive Variable\", arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.filterColor = "#FFFFFF";
	}
	updateColors() {
		if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || A(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || A(this.primaryColor, {
			h: 180,
			l: 5
		}), this.primaryBorderColor = this.primaryBorderColor || L(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || L(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || L(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || j(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || j(this.tertiaryColor), this.lineColor = this.lineColor || j(this.background), this.arrowheadColor = this.arrowheadColor || j(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || k(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || j(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.compositeBackground = "#16141F", this.altBackground = "#16141F", this.compositeTitleBackground = "#16141F", this.stateEdgeLabelBackground = "#16141F", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || A(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || A(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || A(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || A(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || A(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || A(this.primaryColor, {
			h: 210,
			l: 150
		}), this.cScale9 = this.cScale9 || A(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || A(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || A(this.primaryColor, { h: 330 }), this.darkMode) for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 75);
		else for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScale" + e] = k(this["cScale" + e], 25);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		let e = this.darkMode ? -4 : -1;
		for (let t = 0; t < 5; t++) this["surface" + t] = this["surface" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (5 + t * 3)
		}), this["surfacePeer" + t] = this["surfacePeer" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (8 + t * 3)
		});
		this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || A(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || A(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || A(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || A(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || A(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || A(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || A(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || A(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || A(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || A(this.primaryColor, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(this.primaryColor, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(this.primaryColor, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(this.primaryColor, {
			h: 60,
			l: -20
		}), this.pie11 = this.pie11 || A(this.primaryColor, {
			h: -60,
			l: -20
		}), this.pie12 = this.pie12 || A(this.primaryColor, {
			h: 120,
			l: -10
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
		}, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#16141F", this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || A(this.primaryColor, { h: -30 }), this.git4 = this.git4 || A(this.primaryColor, { h: -60 }), this.git5 = this.git5 || A(this.primaryColor, { h: -90 }), this.git6 = this.git6 || A(this.primaryColor, { h: 60 }), this.git7 = this.git7 || A(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Bt = /* @__PURE__ */ i((e) => {
	let t = new zt();
	return t.calculate(e), t;
}, "getThemeVariables"), Vt = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = L(this.primaryColor, this.darkMode), this.fontFamily = "\"Recursive Variable\", arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
			"#E879F9",
			"#2DD4BF",
			"#FB923C",
			"#22D3EE",
			"#4ADE80",
			"#A78BFA",
			"#F87171",
			"#FACC15",
			"#818CF8",
			"#A3E635 ",
			"#38BDF8",
			"#FB7185"
		], this.bkgColorArray = [
			"#FDF4FF",
			"#F0FDFA",
			"#FFF7ED",
			"#ECFEFF",
			"#F0FDF4",
			"#F5F3FF",
			"#FEF2F2",
			"#FEFCE8",
			"#EEF2FF",
			"#F7FEE7",
			"#F0F9FF",
			"#FFF1F2"
		], this.filterColor = "#000000";
	}
	updateColors() {
		this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || A(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || A(this.primaryColor, {
			h: 180,
			l: 5
		}), this.primaryBorderColor = this.primaryBorderColor || L(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || L(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || L(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || j(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || j(this.tertiaryColor), this.lineColor = this.lineColor || j(this.background), this.arrowheadColor = this.arrowheadColor || j(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || k(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || j(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
		let e = "#ECECFE", t = "#E9E9F1", n = A(e, {
			h: 180,
			l: 5
		});
		this.sectionBkgColor = this.sectionBkgColor || n, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || t, this.sectionBkgColor2 = this.sectionBkgColor2 || e, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || e, this.activeTaskBorderColor = this.activeTaskBorderColor || e, this.activeTaskBkgColor = this.activeTaskBkgColor || O(e, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = this["cScaleLabel" + e] || this.scaleLabelColor;
		let r = this.darkMode ? -4 : -1;
		for (let e = 0; e < 5; e++) this["surface" + e] = this["surface" + e] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: r * (5 + e * 3)
		}), this["surfacePeer" + e] = this["surfacePeer" + e] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: r * (8 + e * 3)
		});
		this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || e, this.fillType1 = this.fillType1 || t, this.fillType2 = this.fillType2 || A(e, { h: 64 }), this.fillType3 = this.fillType3 || A(t, { h: 64 }), this.fillType4 = this.fillType4 || A(e, { h: -64 }), this.fillType5 = this.fillType5 || A(t, { h: -64 }), this.fillType6 = this.fillType6 || A(e, { h: 128 }), this.fillType7 = this.fillType7 || A(t, { h: 128 }), this.pie1 = this.pie1 || e, this.pie2 = this.pie2 || t, this.pie3 = this.pie3 || n, this.pie4 = this.pie4 || A(e, { l: -10 }), this.pie5 = this.pie5 || A(t, { l: -10 }), this.pie6 = this.pie6 || A(n, { l: -10 }), this.pie7 = this.pie7 || A(e, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(e, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(e, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(e, {
			h: 60,
			l: -20
		}), this.pie11 = this.pie11 || A(e, {
			h: -60,
			l: -20
		}), this.pie12 = this.pie12 || A(e, {
			h: 120,
			l: -10
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || e, this.quadrant2Fill = this.quadrant2Fill || A(e, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(e, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(e, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
		}, this.requirementBackground = this.requirementBackground || e, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || e, this.git1 = this.git1 || t, this.git2 = this.git2 || n, this.git3 = this.git3 || A(e, { h: -30 }), this.git4 = this.git4 || A(e, { h: -60 }), this.git5 = this.git5 || A(e, { h: -90 }), this.git6 = this.git6 || A(e, { h: 60 }), this.git7 = this.git7 || A(e, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.fontWeight = 600, this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Ht = /* @__PURE__ */ i((e) => {
	let t = new Vt();
	return t.calculate(e), t;
}, "getThemeVariables"), Ut = class {
	static {
		i(this, "Theme");
	}
	constructor() {
		this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = A(this.primaryColor, { h: -160 }), this.primaryBorderColor = j(this.background), this.secondaryBorderColor = L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = L(this.tertiaryColor, this.darkMode), this.primaryTextColor = j(this.primaryColor), this.secondaryTextColor = j(this.secondaryColor), this.tertiaryTextColor = j(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(j("#323D47"), 10), this.border1 = "#ccc", this.border2 = C(255, 255, 255, .25), this.arrowheadColor = j(this.background), this.fontFamily = "\"Recursive Variable\", arial, sans-serif", this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = "\"Recursive Variable\", arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
			"#E879F9",
			"#2DD4BF",
			"#FB923C",
			"#22D3EE",
			"#4ADE80",
			"#A78BFA",
			"#F87171",
			"#FACC15",
			"#818CF8",
			"#A3E635 ",
			"#38BDF8",
			"#FB7185"
		], this.bkgColorArray = [], this.filterColor = "#FFFFFF";
	}
	updateColors() {
		this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || A(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || A(this.primaryColor, {
			h: 180,
			l: 5
		}), this.primaryBorderColor = this.primaryBorderColor || L(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || L(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || L(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || L(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || j(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || j(this.tertiaryColor), this.lineColor = this.lineColor || j(this.background), this.arrowheadColor = this.arrowheadColor || j(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || k(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || j(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.rootLabelColor = "#FFFFFF", this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleInv" + e] = this["cScaleInv" + e] || j(this["cScale" + e]);
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this.darkMode ? this["cScalePeer" + e] = this["cScalePeer" + e] || O(this["cScale" + e], 10) : this["cScalePeer" + e] = this["cScalePeer" + e] || k(this["cScale" + e], 10);
		this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
		for (let e = 0; e < this.THEME_COLOR_LIMIT; e++) this["cScaleLabel" + e] = k(this["cScale" + e], 75);
		let e = this.darkMode ? -4 : -1;
		for (let t = 0; t < 5; t++) this["surface" + t] = this["surface" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (5 + t * 3)
		}), this["surfacePeer" + t] = this["surfacePeer" + t] || A(this.mainBkg, {
			h: 180,
			s: -15,
			l: e * (8 + t * 3)
		});
		this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || A(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || A(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || A(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || A(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || A(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || A(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || A(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || A(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || A(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || A(this.primaryColor, {
			h: 60,
			l: -10
		}), this.pie8 = this.pie8 || A(this.primaryColor, {
			h: -60,
			l: -10
		}), this.pie9 = this.pie9 || A(this.primaryColor, {
			h: 120,
			l: 0
		}), this.pie10 = this.pie10 || A(this.primaryColor, {
			h: 60,
			l: -20
		}), this.pie11 = this.pie11 || A(this.primaryColor, {
			h: -60,
			l: -20
		}), this.pie12 = this.pie12 || A(this.primaryColor, {
			h: 120,
			l: -10
		}), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || A(this.primaryColor, {
			r: 5,
			g: 5,
			b: 5
		}), this.quadrant3Fill = this.quadrant3Fill || A(this.primaryColor, {
			r: 10,
			g: 10,
			b: 10
		}), this.quadrant4Fill = this.quadrant4Fill || A(this.primaryColor, {
			r: 15,
			g: 15,
			b: 15
		}), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || A(this.primaryTextColor, {
			r: -5,
			g: -5,
			b: -5
		}), this.quadrant3TextFill = this.quadrant3TextFill || A(this.primaryTextColor, {
			r: -10,
			g: -10,
			b: -10
		}), this.quadrant4TextFill = this.quadrant4TextFill || A(this.primaryTextColor, {
			r: -15,
			g: -15,
			b: -15
		}), this.quadrantPointFill = this.quadrantPointFill || E(this.quadrant1Fill) ? O(this.quadrant1Fill) : k(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
			backgroundColor: this.xyChart?.backgroundColor || this.background,
			titleColor: this.xyChart?.titleColor || this.primaryTextColor,
			xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
			xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
			xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
			xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
			yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
			yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
			yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
			yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
			plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
		}, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? k(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || A(this.primaryColor, { h: -30 }), this.git4 = this.git4 || A(this.primaryColor, { h: -60 }), this.git5 = this.git5 || A(this.primaryColor, { h: -90 }), this.git6 = this.git6 || A(this.primaryColor, { h: 60 }), this.git7 = this.git7 || A(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = k(this.git0, 25), this.git1 = k(this.git1, 25), this.git2 = k(this.git2, 25), this.git3 = k(this.git3, 25), this.git4 = k(this.git4, 25), this.git5 = k(this.git5, 25), this.git6 = k(this.git6, 25), this.git7 = k(this.git7, 25)), this.gitInv0 = this.gitInv0 || j(this.git0), this.gitInv1 = this.gitInv1 || j(this.git1), this.gitInv2 = this.gitInv2 || j(this.git2), this.gitInv3 = this.gitInv3 || j(this.git3), this.gitInv4 = this.gitInv4 || j(this.git4), this.gitInv5 = this.gitInv5 || j(this.git5), this.gitInv6 = this.gitInv6 || j(this.git6), this.gitInv7 = this.gitInv7 || j(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.fontWeight = 600, this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || xt, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || St;
	}
	calculate(e) {
		if (typeof e != "object") {
			this.updateColors();
			return;
		}
		let t = Object.keys(e);
		t.forEach((t) => {
			this[t] = e[t];
		}), this.updateColors(), t.forEach((t) => {
			this[t] = e[t];
		});
	}
}, Wt = {
	base: { getThemeVariables: wt },
	dark: { getThemeVariables: Et },
	default: { getThemeVariables: Ot },
	forest: { getThemeVariables: At },
	neutral: { getThemeVariables: Mt },
	neo: { getThemeVariables: Pt },
	"neo-dark": { getThemeVariables: It },
	redux: { getThemeVariables: Rt },
	"redux-dark": { getThemeVariables: Bt },
	"redux-color": { getThemeVariables: Ht },
	"redux-dark-color": { getThemeVariables: /* @__PURE__ */ i((e) => {
		let t = new Ut();
		return t.calculate(e), t;
	}, "getThemeVariables") }
}, Gt = {
	flowchart: {
		useMaxWidth: !0,
		titleTopMargin: 25,
		subGraphTitleMargin: {
			top: 0,
			bottom: 0
		},
		diagramPadding: 8,
		htmlLabels: null,
		nodeSpacing: 50,
		rankSpacing: 50,
		curve: "basis",
		padding: 15,
		defaultRenderer: "dagre-wrapper",
		wrappingWidth: 200,
		inheritDir: !1
	},
	swimlane: {
		useMaxWidth: !0,
		lineHops: "arc",
		ignoreCrossLaneEdges: !0,
		optimizeRanksByCrossings: !0,
		automaticLaneOrdering: !1
	},
	sequence: {
		useMaxWidth: !0,
		hideUnusedParticipants: !1,
		activationWidth: 10,
		diagramMarginX: 50,
		diagramMarginY: 10,
		actorMargin: 50,
		width: 150,
		height: 65,
		boxMargin: 10,
		boxTextMargin: 5,
		noteMargin: 10,
		messageMargin: 35,
		messageAlign: "center",
		mirrorActors: !0,
		forceMenus: !1,
		bottomMarginAdj: 1,
		rightAngles: !1,
		showSequenceNumbers: !1,
		actorFontSize: 14,
		actorFontFamily: "\"Open Sans\", sans-serif",
		actorFontWeight: 400,
		noteFontSize: 14,
		noteFontFamily: "\"trebuchet ms\", verdana, arial, sans-serif",
		noteFontWeight: 400,
		noteAlign: "center",
		messageFontSize: 16,
		messageFontFamily: "\"trebuchet ms\", verdana, arial, sans-serif",
		messageFontWeight: 400,
		wrap: !1,
		wrapPadding: 10,
		labelBoxWidth: 50,
		labelBoxHeight: 20
	},
	gantt: {
		useMaxWidth: !0,
		titleTopMargin: 25,
		barHeight: 20,
		barGap: 4,
		topPadding: 50,
		rightPadding: 75,
		leftPadding: 75,
		gridLineStartPadding: 35,
		fontSize: 11,
		sectionFontSize: 11,
		numberSectionStyles: 4,
		axisFormat: "%Y-%m-%d",
		topAxis: !1,
		displayMode: "",
		weekday: "sunday"
	},
	journey: {
		useMaxWidth: !0,
		diagramMarginX: 50,
		diagramMarginY: 10,
		leftMargin: 150,
		maxLabelWidth: 360,
		width: 150,
		height: 50,
		boxMargin: 10,
		boxTextMargin: 5,
		noteMargin: 10,
		messageMargin: 35,
		messageAlign: "center",
		bottomMarginAdj: 1,
		rightAngles: !1,
		taskFontSize: 14,
		taskFontFamily: "\"Open Sans\", sans-serif",
		taskMargin: 50,
		activationWidth: 10,
		textPlacement: "fo",
		actorColours: [
			"#8FBC8F",
			"#7CFC00",
			"#00FFFF",
			"#20B2AA",
			"#B0E0E6",
			"#FFFFE0"
		],
		sectionFills: [
			"#191970",
			"#8B008B",
			"#4B0082",
			"#2F4F4F",
			"#800000",
			"#8B4513",
			"#00008B"
		],
		sectionColours: ["#fff"],
		titleColor: "",
		titleFontFamily: "\"trebuchet ms\", verdana, arial, sans-serif",
		titleFontSize: "4ex"
	},
	class: {
		useMaxWidth: !0,
		titleTopMargin: 25,
		arrowMarkerAbsolute: !1,
		dividerMargin: 10,
		padding: 5,
		textHeight: 10,
		defaultRenderer: "dagre-wrapper",
		htmlLabels: !1,
		hideEmptyMembersBox: !1,
		hierarchicalNamespaces: !0
	},
	state: {
		useMaxWidth: !0,
		titleTopMargin: 25,
		dividerMargin: 10,
		sizeUnit: 5,
		padding: 8,
		textHeight: 10,
		titleShift: -15,
		noteMargin: 10,
		forkWidth: 70,
		forkHeight: 7,
		miniPadding: 2,
		fontSizeFactor: 5.02,
		fontSize: 24,
		labelHeight: 16,
		edgeLengthFactor: "20",
		compositTitleSize: 35,
		radius: 5,
		defaultRenderer: "dagre-wrapper"
	},
	er: {
		useMaxWidth: !0,
		titleTopMargin: 25,
		diagramPadding: 20,
		layoutDirection: "TB",
		minEntityWidth: 100,
		minEntityHeight: 75,
		entityPadding: 15,
		nodeSpacing: 140,
		rankSpacing: 80,
		stroke: "gray",
		fill: "honeydew",
		fontSize: 12
	},
	pie: {
		useMaxWidth: !0,
		textPosition: .75,
		donutHole: 0,
		legendPosition: "right",
		highlightSlice: ""
	},
	quadrantChart: {
		useMaxWidth: !0,
		chartWidth: 500,
		chartHeight: 500,
		titleFontSize: 20,
		titlePadding: 10,
		quadrantPadding: 5,
		xAxisLabelPadding: 5,
		yAxisLabelPadding: 5,
		xAxisLabelFontSize: 16,
		yAxisLabelFontSize: 16,
		quadrantLabelFontSize: 16,
		quadrantTextTopPadding: 5,
		pointTextPadding: 5,
		pointLabelFontSize: 12,
		pointRadius: 5,
		xAxisPosition: "top",
		yAxisPosition: "left",
		quadrantInternalBorderStrokeWidth: 1,
		quadrantExternalBorderStrokeWidth: 2
	},
	xyChart: {
		useMaxWidth: !0,
		width: 700,
		height: 500,
		titleFontSize: 20,
		titlePadding: 10,
		showDataLabel: !1,
		showDataLabelOutsideBar: !1,
		showTitle: !0,
		xAxis: {
			$ref: "#/$defs/XYChartAxisConfig",
			showLabel: !0,
			labelFontSize: 14,
			labelPadding: 5,
			showTitle: !0,
			titleFontSize: 16,
			titlePadding: 5,
			showTick: !0,
			tickLength: 5,
			tickWidth: 2,
			showAxisLine: !0,
			axisLineWidth: 2,
			labelRotation: 0
		},
		yAxis: {
			$ref: "#/$defs/XYChartAxisConfig",
			showLabel: !0,
			labelFontSize: 14,
			labelPadding: 5,
			showTitle: !0,
			titleFontSize: 16,
			titlePadding: 5,
			showTick: !0,
			tickLength: 5,
			tickWidth: 2,
			showAxisLine: !0,
			axisLineWidth: 2,
			labelRotation: 0
		},
		chartOrientation: "vertical",
		plotReservedSpacePercent: 50
	},
	requirement: {
		useMaxWidth: !0,
		rect_fill: "#f9f9f9",
		text_color: "#333",
		rect_border_size: "0.5px",
		rect_border_color: "#bbb",
		rect_min_width: 200,
		rect_min_height: 200,
		fontSize: 14,
		rect_padding: 10,
		line_height: 20
	},
	mindmap: {
		useMaxWidth: !0,
		padding: 10,
		maxNodeWidth: 200,
		layoutAlgorithm: "cose-bilkent"
	},
	ishikawa: {
		useMaxWidth: !0,
		diagramPadding: 20
	},
	kanban: {
		useMaxWidth: !0,
		padding: 8,
		sectionWidth: 200,
		ticketBaseUrl: ""
	},
	timeline: {
		useMaxWidth: !0,
		diagramMarginX: 50,
		diagramMarginY: 10,
		leftMargin: 150,
		width: 150,
		height: 50,
		boxMargin: 10,
		boxTextMargin: 5,
		noteMargin: 10,
		messageMargin: 35,
		messageAlign: "center",
		bottomMarginAdj: 1,
		rightAngles: !1,
		taskFontSize: 14,
		taskFontFamily: "\"Open Sans\", sans-serif",
		taskMargin: 50,
		activationWidth: 10,
		textPlacement: "fo",
		actorColours: [
			"#8FBC8F",
			"#7CFC00",
			"#00FFFF",
			"#20B2AA",
			"#B0E0E6",
			"#FFFFE0"
		],
		sectionFills: [
			"#191970",
			"#8B008B",
			"#4B0082",
			"#2F4F4F",
			"#800000",
			"#8B4513",
			"#00008B"
		],
		sectionColours: ["#fff"],
		disableMulticolor: !1
	},
	gitGraph: {
		useMaxWidth: !0,
		titleTopMargin: 25,
		diagramPadding: 8,
		nodeLabel: {
			width: 75,
			height: 100,
			x: -25,
			y: 0
		},
		mainBranchName: "main",
		mainBranchOrder: 0,
		showCommitLabel: !0,
		showBranches: !0,
		rotateCommitLabel: !0,
		parallelCommits: !1,
		arrowMarkerAbsolute: !1
	},
	c4: {
		useMaxWidth: !0,
		diagramMarginX: 50,
		diagramMarginY: 10,
		c4ShapeMargin: 50,
		c4ShapePadding: 20,
		width: 216,
		height: 60,
		boxMargin: 10,
		c4ShapeInRow: 4,
		nextLinePaddingX: 0,
		c4BoundaryInRow: 2,
		personFontSize: 14,
		personFontFamily: "\"Open Sans\", sans-serif",
		personFontWeight: "normal",
		external_personFontSize: 14,
		external_personFontFamily: "\"Open Sans\", sans-serif",
		external_personFontWeight: "normal",
		systemFontSize: 14,
		systemFontFamily: "\"Open Sans\", sans-serif",
		systemFontWeight: "normal",
		external_systemFontSize: 14,
		external_systemFontFamily: "\"Open Sans\", sans-serif",
		external_systemFontWeight: "normal",
		system_dbFontSize: 14,
		system_dbFontFamily: "\"Open Sans\", sans-serif",
		system_dbFontWeight: "normal",
		external_system_dbFontSize: 14,
		external_system_dbFontFamily: "\"Open Sans\", sans-serif",
		external_system_dbFontWeight: "normal",
		system_queueFontSize: 14,
		system_queueFontFamily: "\"Open Sans\", sans-serif",
		system_queueFontWeight: "normal",
		external_system_queueFontSize: 14,
		external_system_queueFontFamily: "\"Open Sans\", sans-serif",
		external_system_queueFontWeight: "normal",
		boundaryFontSize: 14,
		boundaryFontFamily: "\"Open Sans\", sans-serif",
		boundaryFontWeight: "normal",
		messageFontSize: 12,
		messageFontFamily: "\"Open Sans\", sans-serif",
		messageFontWeight: "normal",
		containerFontSize: 14,
		containerFontFamily: "\"Open Sans\", sans-serif",
		containerFontWeight: "normal",
		external_containerFontSize: 14,
		external_containerFontFamily: "\"Open Sans\", sans-serif",
		external_containerFontWeight: "normal",
		container_dbFontSize: 14,
		container_dbFontFamily: "\"Open Sans\", sans-serif",
		container_dbFontWeight: "normal",
		external_container_dbFontSize: 14,
		external_container_dbFontFamily: "\"Open Sans\", sans-serif",
		external_container_dbFontWeight: "normal",
		container_queueFontSize: 14,
		container_queueFontFamily: "\"Open Sans\", sans-serif",
		container_queueFontWeight: "normal",
		external_container_queueFontSize: 14,
		external_container_queueFontFamily: "\"Open Sans\", sans-serif",
		external_container_queueFontWeight: "normal",
		componentFontSize: 14,
		componentFontFamily: "\"Open Sans\", sans-serif",
		componentFontWeight: "normal",
		external_componentFontSize: 14,
		external_componentFontFamily: "\"Open Sans\", sans-serif",
		external_componentFontWeight: "normal",
		component_dbFontSize: 14,
		component_dbFontFamily: "\"Open Sans\", sans-serif",
		component_dbFontWeight: "normal",
		external_component_dbFontSize: 14,
		external_component_dbFontFamily: "\"Open Sans\", sans-serif",
		external_component_dbFontWeight: "normal",
		component_queueFontSize: 14,
		component_queueFontFamily: "\"Open Sans\", sans-serif",
		component_queueFontWeight: "normal",
		external_component_queueFontSize: 14,
		external_component_queueFontFamily: "\"Open Sans\", sans-serif",
		external_component_queueFontWeight: "normal",
		wrap: !0,
		wrapPadding: 10,
		person_bg_color: "#08427B",
		person_border_color: "#073B6F",
		external_person_bg_color: "#686868",
		external_person_border_color: "#8A8A8A",
		system_bg_color: "#1168BD",
		system_border_color: "#3C7FC0",
		system_db_bg_color: "#1168BD",
		system_db_border_color: "#3C7FC0",
		system_queue_bg_color: "#1168BD",
		system_queue_border_color: "#3C7FC0",
		external_system_bg_color: "#999999",
		external_system_border_color: "#8A8A8A",
		external_system_db_bg_color: "#999999",
		external_system_db_border_color: "#8A8A8A",
		external_system_queue_bg_color: "#999999",
		external_system_queue_border_color: "#8A8A8A",
		container_bg_color: "#438DD5",
		container_border_color: "#3C7FC0",
		container_db_bg_color: "#438DD5",
		container_db_border_color: "#3C7FC0",
		container_queue_bg_color: "#438DD5",
		container_queue_border_color: "#3C7FC0",
		external_container_bg_color: "#B3B3B3",
		external_container_border_color: "#A6A6A6",
		external_container_db_bg_color: "#B3B3B3",
		external_container_db_border_color: "#A6A6A6",
		external_container_queue_bg_color: "#B3B3B3",
		external_container_queue_border_color: "#A6A6A6",
		component_bg_color: "#85BBF0",
		component_border_color: "#78A8D8",
		component_db_bg_color: "#85BBF0",
		component_db_border_color: "#78A8D8",
		component_queue_bg_color: "#85BBF0",
		component_queue_border_color: "#78A8D8",
		external_component_bg_color: "#CCCCCC",
		external_component_border_color: "#BFBFBF",
		external_component_db_bg_color: "#CCCCCC",
		external_component_db_border_color: "#BFBFBF",
		external_component_queue_bg_color: "#CCCCCC",
		external_component_queue_border_color: "#BFBFBF"
	},
	sankey: {
		useMaxWidth: !0,
		width: 600,
		height: 400,
		linkColor: "gradient",
		nodeAlignment: "justify",
		showValues: !0,
		prefix: "",
		suffix: "",
		nodeWidth: 10,
		nodePadding: 12,
		labelStyle: "legacy"
	},
	block: {
		useMaxWidth: !0,
		padding: 8
	},
	packet: {
		useMaxWidth: !0,
		rowHeight: 32,
		bitWidth: 32,
		bitsPerRow: 32,
		showBits: !0,
		paddingX: 5,
		paddingY: 5
	},
	treeView: {
		useMaxWidth: !0,
		rowIndent: 10,
		paddingX: 5,
		paddingY: 5,
		lineThickness: 1,
		showIcons: !1,
		defaultIconPack: "",
		filenameIcons: {},
		extensionIcons: {}
	},
	architecture: {
		useMaxWidth: !0,
		padding: 40,
		iconSize: 80,
		fontSize: 16,
		randomize: !1,
		nodeSeparation: 75,
		idealEdgeLengthMultiplier: 1.5,
		edgeElasticity: .45,
		numIter: 2500,
		seed: 1
	},
	eventmodeling: {
		useMaxWidth: !0,
		padding: 30,
		rowHeight: 32
	},
	radar: {
		useMaxWidth: !0,
		width: 600,
		height: 600,
		marginTop: 50,
		marginRight: 50,
		marginBottom: 50,
		marginLeft: 50,
		axisScaleFactor: 1,
		axisLabelFactor: 1.05,
		curveTension: .17
	},
	venn: {
		useMaxWidth: !0,
		width: 800,
		height: 450,
		padding: 8,
		useDebugLayout: !1
	},
	cynefin: {
		useMaxWidth: !0,
		width: 800,
		height: 600,
		padding: 40,
		showDomainDescriptions: !0,
		boundaryAmplitude: 8,
		seed: 0
	},
	theme: "default",
	look: "classic",
	handDrawnSeed: 0,
	layout: "dagre",
	maxTextSize: 5e4,
	maxEdges: 500,
	darkMode: !1,
	fontFamily: "\"trebuchet ms\", verdana, arial, sans-serif;",
	logLevel: 5,
	securityLevel: "strict",
	startOnLoad: !0,
	arrowMarkerAbsolute: !1,
	secure: [
		"secure",
		"securityLevel",
		"startOnLoad",
		"maxTextSize",
		"suppressErrorRendering",
		"maxEdges"
	],
	legacyMathML: !1,
	forceLegacyMathML: !1,
	deterministicIds: !1,
	fontSize: 16,
	markdownAutoWrap: !0,
	suppressErrorRendering: !1
}, Kt = {
	...Gt,
	deterministicIDSeed: void 0,
	elk: {
		mergeEdges: !1,
		nodePlacementStrategy: "BRANDES_KOEPF",
		forceNodeModelOrder: !1,
		considerModelOrder: "NODES_AND_EDGES"
	},
	themeCSS: void 0,
	themeVariables: Wt.default.getThemeVariables(),
	sequence: {
		...Gt.sequence,
		messageFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.messageFontFamily,
				fontSize: this.messageFontSize,
				fontWeight: this.messageFontWeight
			};
		}, "messageFont"),
		noteFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.noteFontFamily,
				fontSize: this.noteFontSize,
				fontWeight: this.noteFontWeight
			};
		}, "noteFont"),
		actorFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.actorFontFamily,
				fontSize: this.actorFontSize,
				fontWeight: this.actorFontWeight
			};
		}, "actorFont")
	},
	class: {
		hideEmptyMembersBox: !1,
		hierarchicalNamespaces: !0
	},
	gantt: {
		...Gt.gantt,
		tickInterval: void 0,
		useWidth: void 0
	},
	c4: {
		...Gt.c4,
		useWidth: void 0,
		personFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.personFontFamily,
				fontSize: this.personFontSize,
				fontWeight: this.personFontWeight
			};
		}, "personFont"),
		flowchart: {
			...Gt.flowchart,
			inheritDir: !1
		},
		external_personFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_personFontFamily,
				fontSize: this.external_personFontSize,
				fontWeight: this.external_personFontWeight
			};
		}, "external_personFont"),
		systemFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.systemFontFamily,
				fontSize: this.systemFontSize,
				fontWeight: this.systemFontWeight
			};
		}, "systemFont"),
		external_systemFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_systemFontFamily,
				fontSize: this.external_systemFontSize,
				fontWeight: this.external_systemFontWeight
			};
		}, "external_systemFont"),
		system_dbFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.system_dbFontFamily,
				fontSize: this.system_dbFontSize,
				fontWeight: this.system_dbFontWeight
			};
		}, "system_dbFont"),
		external_system_dbFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_system_dbFontFamily,
				fontSize: this.external_system_dbFontSize,
				fontWeight: this.external_system_dbFontWeight
			};
		}, "external_system_dbFont"),
		system_queueFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.system_queueFontFamily,
				fontSize: this.system_queueFontSize,
				fontWeight: this.system_queueFontWeight
			};
		}, "system_queueFont"),
		external_system_queueFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_system_queueFontFamily,
				fontSize: this.external_system_queueFontSize,
				fontWeight: this.external_system_queueFontWeight
			};
		}, "external_system_queueFont"),
		containerFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.containerFontFamily,
				fontSize: this.containerFontSize,
				fontWeight: this.containerFontWeight
			};
		}, "containerFont"),
		external_containerFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_containerFontFamily,
				fontSize: this.external_containerFontSize,
				fontWeight: this.external_containerFontWeight
			};
		}, "external_containerFont"),
		container_dbFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.container_dbFontFamily,
				fontSize: this.container_dbFontSize,
				fontWeight: this.container_dbFontWeight
			};
		}, "container_dbFont"),
		external_container_dbFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_container_dbFontFamily,
				fontSize: this.external_container_dbFontSize,
				fontWeight: this.external_container_dbFontWeight
			};
		}, "external_container_dbFont"),
		container_queueFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.container_queueFontFamily,
				fontSize: this.container_queueFontSize,
				fontWeight: this.container_queueFontWeight
			};
		}, "container_queueFont"),
		external_container_queueFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_container_queueFontFamily,
				fontSize: this.external_container_queueFontSize,
				fontWeight: this.external_container_queueFontWeight
			};
		}, "external_container_queueFont"),
		componentFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.componentFontFamily,
				fontSize: this.componentFontSize,
				fontWeight: this.componentFontWeight
			};
		}, "componentFont"),
		external_componentFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_componentFontFamily,
				fontSize: this.external_componentFontSize,
				fontWeight: this.external_componentFontWeight
			};
		}, "external_componentFont"),
		component_dbFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.component_dbFontFamily,
				fontSize: this.component_dbFontSize,
				fontWeight: this.component_dbFontWeight
			};
		}, "component_dbFont"),
		external_component_dbFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_component_dbFontFamily,
				fontSize: this.external_component_dbFontSize,
				fontWeight: this.external_component_dbFontWeight
			};
		}, "external_component_dbFont"),
		component_queueFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.component_queueFontFamily,
				fontSize: this.component_queueFontSize,
				fontWeight: this.component_queueFontWeight
			};
		}, "component_queueFont"),
		external_component_queueFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.external_component_queueFontFamily,
				fontSize: this.external_component_queueFontSize,
				fontWeight: this.external_component_queueFontWeight
			};
		}, "external_component_queueFont"),
		boundaryFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.boundaryFontFamily,
				fontSize: this.boundaryFontSize,
				fontWeight: this.boundaryFontWeight
			};
		}, "boundaryFont"),
		messageFont: /* @__PURE__ */ i(function() {
			return {
				fontFamily: this.messageFontFamily,
				fontSize: this.messageFontSize,
				fontWeight: this.messageFontWeight
			};
		}, "messageFont")
	},
	pie: {
		...Gt.pie,
		useWidth: 984
	},
	xyChart: {
		...Gt.xyChart,
		useWidth: void 0
	},
	requirement: {
		...Gt.requirement,
		useWidth: void 0
	},
	packet: { ...Gt.packet },
	eventmodeling: { ...Gt.eventmodeling },
	treeView: {
		...Gt.treeView,
		useWidth: void 0
	},
	radar: { ...Gt.radar },
	railroad: {
		...Gt.railroad,
		fontSize: void 0,
		fontFamily: void 0,
		terminalFill: void 0,
		terminalStroke: void 0,
		terminalTextColor: void 0,
		nonTerminalFill: void 0,
		nonTerminalStroke: void 0,
		nonTerminalTextColor: void 0,
		lineColor: void 0,
		markerFill: void 0,
		commentFill: void 0,
		commentStroke: void 0,
		commentTextColor: void 0,
		specialFill: void 0,
		specialStroke: void 0,
		ruleNameColor: void 0
	},
	ishikawa: { ...Gt.ishikawa },
	sankey: {
		...Gt.sankey,
		nodeColors: void 0
	},
	treemap: {
		useMaxWidth: !0,
		padding: 10,
		diagramPadding: 8,
		showValues: !0,
		nodeWidth: 100,
		nodeHeight: 40,
		borderWidth: 1,
		valueFontSize: 12,
		labelFontSize: 14,
		valueFormat: ","
	},
	venn: { ...Gt.venn },
	cynefin: { ...Gt.cynefin }
}, qt = /* @__PURE__ */ i((e, t = "") => Object.keys(e).reduce((n, r) => Array.isArray(e[r]) ? n : typeof e[r] == "object" && e[r] !== null ? [
	...n,
	t + r,
	...qt(e[r], "")
] : [...n, t + r], []), "keyify"), Jt = new Set(qt(Kt, "")), Yt = Kt, Xt = {
	nodeColors: /^#[\da-f]{3,8}$|^rgb\([\d\s%,.]+\)$|^hsl\([\d\s%,.]+\)$|^[a-z]+$/i,
	filenameIcons: /^[\w-]+(?::[\w-]+)?$/,
	extensionIcons: /^[\w-]+(?::[\w-]+)?$/
}, Zt = /* @__PURE__ */ i((e, t) => {
	for (let n of Object.keys(e)) {
		let r = e[n];
		(n.startsWith("__") || n.includes("proto") || n.includes("constr") || typeof r != "string" || !t.test(r)) && (c.debug("sanitize deleting dictionary entry:", n, r), delete e[n]);
	}
}, "sanitizeDictionaryConfig"), Qt = /* @__PURE__ */ i((e) => {
	if (c.debug("sanitizeDirective called with", e), !(typeof e != "object" || !e)) {
		if (Array.isArray(e)) {
			e.forEach((e) => Qt(e));
			return;
		}
		for (let t of Object.keys(e)) {
			if (c.debug("Checking key", t), t.startsWith("__") || t.includes("proto") || t.includes("constr") || !Jt.has(t) || e[t] == null) {
				c.debug("sanitize deleting key: ", t), delete e[t];
				continue;
			}
			if (typeof e[t] == "object") {
				let n = Xt[t];
				n ? Zt(e[t], n) : (c.debug("sanitizing object", t), Qt(e[t]));
				continue;
			}
			for (let n of [
				"themeCSS",
				"fontFamily",
				"altFontFamily"
			]) t.includes(n) && (c.debug("sanitizing css option", t), e[t] = $t(e[t]));
		}
		if (e.themeVariables) for (let t of Object.keys(e.themeVariables)) {
			let n = e.themeVariables[t];
			n?.match && !n.match(/^[\d "#%(),.;A-Za-z]+$/) && (e.themeVariables[t] = "");
		}
		c.debug("After sanitization", e);
	}
}, "sanitizeDirective"), $t = /* @__PURE__ */ i((e) => {
	let t = 0, n = 0;
	for (let r of e) {
		if (t < n) return "{ /* ERROR: Unbalanced CSS */ }";
		r === "{" ? t++ : r === "}" && n++;
	}
	return t === n ? e : "{ /* ERROR: Unbalanced CSS */ }";
}, "sanitizeCss"), en = Object.freeze(Yt), tn = /* @__PURE__ */ i((e) => !(e === !1 || [
	"false",
	"null",
	"0"
].includes(String(e).trim().toLowerCase())), "evaluate"), nn = bt({}, en), rn, R = [], an = bt({}, en), on = /* @__PURE__ */ i((e, t) => {
	let n = bt({}, e), r = {};
	for (let e of t) pn(e), r = bt(r, e);
	if (n = bt(n, r), r.theme && r.theme in Wt) {
		let e = bt(bt({}, rn).themeVariables || {}, r.themeVariables);
		n.theme && n.theme in Wt && (n.themeVariables = Wt[n.theme].getThemeVariables(e));
	}
	return an = n, yn(an), an;
}, "updateCurrentConfig"), sn = /* @__PURE__ */ i((e) => (nn = bt({}, en), nn = bt(nn, e), e.theme && Wt[e.theme] && (nn.themeVariables = Wt[e.theme].getThemeVariables(e.themeVariables)), on(nn, R), nn), "setSiteConfig"), cn = /* @__PURE__ */ i((e) => {
	rn = bt({}, e);
}, "saveConfigFromInitialize"), ln = /* @__PURE__ */ i((e) => (nn = bt(nn, e), on(nn, R), nn), "updateSiteConfig"), un = /* @__PURE__ */ i(() => bt({}, nn), "getSiteConfig"), dn = /* @__PURE__ */ i((e) => (on(an, [e]), fn()), "setConfig"), fn = /* @__PURE__ */ i(() => bt({}, an), "getConfig"), pn = /* @__PURE__ */ i((e) => {
	e && (["secure", ...nn.secure ?? []].forEach((t) => {
		Object.hasOwn(e, t) && (c.debug(`Denied attempt to modify a secure key ${t}`, e[t]), delete e[t]);
	}), Object.keys(e).forEach((t) => {
		t.startsWith("__") && delete e[t];
	}), Object.keys(e).forEach((t) => {
		typeof e[t] == "string" && (e[t].includes("<") || e[t].includes(">") || e[t].includes("url(data:")) && delete e[t], typeof e[t] == "object" && pn(e[t]);
	}));
}, "sanitize"), mn = /* @__PURE__ */ i((e) => {
	Qt(e), e.fontFamily && !e.themeVariables?.fontFamily && (e.themeVariables = {
		...e.themeVariables,
		fontFamily: e.fontFamily
	}), R.push(e), on(nn, R);
}, "addDirective"), hn = /* @__PURE__ */ i((e = nn) => {
	R = [], on(e, R);
}, "reset"), gn = {
	LAZY_LOAD_DEPRECATED: "The configuration options lazyLoadedDiagrams and loadExternalDiagramsAtStartup are deprecated. Please use registerExternalDiagrams instead.",
	FLOWCHART_HTML_LABELS_DEPRECATED: "flowchart.htmlLabels is deprecated. Please use global htmlLabels instead."
}, _n = {}, vn = /* @__PURE__ */ i((e) => {
	_n[e] || (c.warn(gn[e]), _n[e] = !0);
}, "issueWarning"), yn = /* @__PURE__ */ i((e) => {
	e && (e.lazyLoadedDiagrams || e.loadExternalDiagramsAtStartup) && vn("LAZY_LOAD_DEPRECATED");
}, "checkConfig"), bn = /* @__PURE__ */ i(() => {
	let e = {};
	rn && (e = bt(e, rn));
	for (let t of R) e = bt(e, t);
	return e;
}, "getUserDefinedConfig"), xn = /* @__PURE__ */ i((e) => (e.flowchart?.htmlLabels != null && vn("FLOWCHART_HTML_LABELS_DEPRECATED"), tn(e.htmlLabels ?? e.flowchart?.htmlLabels ?? !0)), "getEffectiveHtmlLabels"), Sn = /^([^\S\n\r]*)-{3}\s*[\n\r](.*?)[\n\r]\1-{3}\s*[\n\r]+/s, Cn = /%{2}{\s*(?:(\w+)\s*:|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, wn = /\s*%%.*\n/gm, Tn = class extends Error {
	static {
		i(this, "UnknownDiagramError");
	}
	constructor(e) {
		super(e), this.name = "UnknownDiagramError";
	}
}, En = {}, Dn = /* @__PURE__ */ i(function(e, t) {
	e = e.replace(Sn, "").replace(Cn, "").replace(wn, "\n");
	for (let [n, { detector: r }] of Object.entries(En)) if (r(e, t)) return n;
	throw new Tn(`No diagram type detected matching given configuration for text: ${e}`);
}, "detectType"), On = /* @__PURE__ */ i((...e) => {
	for (let { id: t, detector: n, loader: r } of e) kn(t, n, r);
}, "registerLazyLoadedDiagrams"), kn = /* @__PURE__ */ i((e, t, n) => {
	En[e] && c.warn(`Detector with key ${e} already exists. Overwriting.`), En[e] = {
		detector: t,
		loader: n
	}, c.debug(`Detector with key ${e} added${n ? " with loader" : ""}`);
}, "addDetector"), An = /* @__PURE__ */ i((e) => En[e].loader, "getDiagramLoader"), jn = /<br\s*\/?>/gi, Mn = /* @__PURE__ */ i((e) => e ? Hn(e).replace(/\\n/g, "#br#").split("#br#") : [""], "getRows"), Nn = /* @__PURE__ */ (() => {
	let e = !1;
	return () => {
		e ||= (Pn(), !0);
	};
})();
function Pn() {
	let e = "data-temp-href-target";
	vt.addHook("beforeSanitizeAttributes", (t) => {
		t.tagName === "A" && t.hasAttribute("target") && t.setAttribute(e, t.getAttribute("target") ?? "");
	}), vt.addHook("afterSanitizeAttributes", (t) => {
		t.tagName === "A" && t.hasAttribute(e) && (t.setAttribute("target", t.getAttribute(e) ?? ""), t.removeAttribute(e), t.getAttribute("target") === "_blank" && t.setAttribute("rel", "noopener"));
	});
}
i(Pn, "setupDompurifyHooks");
var Fn = /* @__PURE__ */ i((e) => (Nn(), vt.sanitize(e)), "removeScript"), In = /* @__PURE__ */ i((e, t) => {
	if (xn(t)) {
		let n = t.securityLevel;
		n === "antiscript" || n === "strict" || n === "sandbox" ? e = Fn(e) : n !== "loose" && (e = Hn(e), e = e.replace(/</g, "&lt;").replace(/>/g, "&gt;"), e = e.replace(/=/g, "&equals;"), e = Vn(e));
	}
	return e;
}, "sanitizeMore"), Ln = /* @__PURE__ */ i((e, t) => e && (e = t.dompurifyConfig ? vt.sanitize(In(e, t), t.dompurifyConfig).toString() : vt.sanitize(In(e, t), { FORBID_TAGS: ["style"] }).toString(), e), "sanitizeText"), Rn = /* @__PURE__ */ i((e, t) => typeof e == "string" ? Ln(e, t) : e.flat().map((e) => Ln(e, t)), "sanitizeTextOrArray"), zn = /* @__PURE__ */ i((e) => jn.test(e), "hasBreaks"), Bn = /* @__PURE__ */ i((e) => e.split(jn), "splitBreaks"), Vn = /* @__PURE__ */ i((e) => e.replace(/#br#/g, "<br/>"), "placeholderToBreak"), Hn = /* @__PURE__ */ i((e) => e.replace(jn, "#br#"), "breakToPlaceholder"), Un = /* @__PURE__ */ i((e) => {
	let t = "";
	return e && (t = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, t = CSS.escape(t)), t;
}, "getUrl"), Wn = /* @__PURE__ */ i(function(...e) {
	let t = e.filter((e) => !isNaN(e));
	return Math.max(...t);
}, "getMax"), Gn = /* @__PURE__ */ i(function(...e) {
	let t = e.filter((e) => !isNaN(e));
	return Math.min(...t);
}, "getMin"), Kn = /* @__PURE__ */ i(function(e) {
	let t = e.split(/(,)/), n = [];
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (r === "," && e > 0 && e + 1 < t.length) {
			let i = t[e - 1], a = t[e + 1];
			Jn(i, a) && (r = i + "," + a, e++, n.pop());
		}
		n.push(Yn(r));
	}
	return n.join("");
}, "parseGenericTypes"), qn = /* @__PURE__ */ i((e, t) => Math.max(0, e.split(t).length - 1), "countOccurrence"), Jn = /* @__PURE__ */ i((e, t) => {
	let n = qn(e, "~"), r = qn(t, "~");
	return n === 1 && r === 1;
}, "shouldCombineSets"), Yn = /* @__PURE__ */ i((e) => {
	let t = qn(e, "~"), n = !1;
	if (t <= 1) return e;
	t % 2 != 0 && e.startsWith("~") && (e = e.substring(1), n = !0);
	let r = [...e], i = r.indexOf("~"), a = r.lastIndexOf("~");
	for (; i !== -1 && a !== -1 && i !== a;) r[i] = "<", r[a] = ">", i = r.indexOf("~"), a = r.lastIndexOf("~");
	return n && r.unshift("~"), r.join("");
}, "processSet"), Xn = /* @__PURE__ */ i(() => window.MathMLElement !== void 0, "isMathMLSupported"), Zn = /\$\$(.*?)\$\$/g, Qn = /* @__PURE__ */ i((e) => (e.match(Zn)?.length ?? 0) > 0, "hasKatex"), $n = /* @__PURE__ */ i(async (e, t) => {
	let n = document.createElement("div");
	n.innerHTML = await tr(e, t), n.id = "katex-temp", n.style.visibility = "hidden", n.style.position = "absolute", n.style.top = "0", document.querySelector("body")?.insertAdjacentElement("beforeend", n);
	let r = {
		width: n.clientWidth,
		height: n.clientHeight
	};
	return n.remove(), r;
}, "calculateMathMLDimensions"), er = /* @__PURE__ */ i(async (e, t) => {
	if (!Qn(e)) return e;
	if (!(Xn() || t.legacyMathML || t.forceLegacyMathML)) return e.replace(Zn, "MathML is unsupported in this environment.");
	{
		let { default: n } = await import("./katex-D2dVcWYI.mjs"), r = t.forceLegacyMathML || !Xn() && t.legacyMathML ? "htmlAndMathml" : "mathml";
		return e.split(jn).map((e) => Qn(e) ? `<div style="display: flex; align-items: center; justify-content: center; white-space: nowrap;">${e}</div>` : `<div>${e}</div>`).join("").replace(Zn, (e, t) => n.renderToString(t, {
			throwOnError: !0,
			displayMode: !0,
			output: r
		}).replace(/\n/g, " ").replace(/<annotation.*<\/annotation>/g, ""));
	}
	return e.replace(Zn, "Katex is not supported in @mermaid-js/tiny. Please use the full mermaid library.");
}, "renderKatexUnsanitized"), tr = /* @__PURE__ */ i(async (e, t) => Ln(await er(e, t), t), "renderKatexSanitized"), nr = {
	getRows: Mn,
	sanitizeText: Ln,
	sanitizeTextOrArray: Rn,
	hasBreaks: zn,
	splitBreaks: Bn,
	lineBreakRegex: jn,
	removeScript: Fn,
	getUrl: Un,
	evaluate: tn,
	getMax: Wn,
	getMin: Gn
}, rr = /* @__PURE__ */ i(function(e, t) {
	for (let n of t) e.attr(n[0], n[1]);
}, "d3Attrs"), ir = /* @__PURE__ */ i(function(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	return n ? (r.set("width", "100%"), r.set("style", `max-width: ${t}px;`)) : (r.set("height", e), r.set("width", t)), r;
}, "calculateSvgSizeAttrs"), ar = /* @__PURE__ */ i(function(e, t, n, r) {
	rr(e, ir(t, n, r));
}, "configureSvgSize"), or = /* @__PURE__ */ i(function(e, t, n, r) {
	let i = t.node().getBBox(), a = i.width, o = i.height;
	c.info(`SVG bounds: ${a}x${o}`, i);
	let s = 0, l = 0;
	c.info(`Graph bounds: ${s}x${l}`, e), s = a + n * 2, l = o + n * 2, c.info(`Calculated bounds: ${s}x${l}`), ar(t, l, s, r);
	let u = `${i.x - n} ${i.y - n} ${i.width + 2 * n} ${i.height + 2 * n}`;
	t.attr("viewBox", u);
}, "setupGraphViewbox"), sr = {};
function cr(e) {
	return [...e.cssRules].map((e) => e.cssText).join("\n");
}
i(cr, "cssStyleSheetToString");
var lr = /* @__PURE__ */ i((e, t, n, r) => {
	let i = "";
	return e in sr && sr[e] ? i = sr[e]({
		...n,
		svgId: r
	}) : c.warn(`No theme found for ${e}`), `& {
    font-family: ${n.fontFamily};
    font-size: ${n.fontSize};
    fill: ${n.textColor}
  }
  @keyframes edge-animation-frame {
    from {
      stroke-dashoffset: 0;
    }
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  & .edge-animation-slow {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 50s linear infinite;
    stroke-linecap: round;
  }
  & .edge-animation-fast {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 20s linear infinite;
    stroke-linecap: round;
  }
  /* Classes common for multiple diagrams */

  & .error-icon {
    fill: ${n.errorBkgColor};
  }
  & .error-text {
    fill: ${n.errorTextColor};
    stroke: ${n.errorTextColor};
  }

  & .edge-thickness-normal {
    stroke-width: ${n.strokeWidth ?? 1}px;
  }
  & .edge-thickness-thick {
    stroke-width: 3.5px
  }
  & .edge-pattern-solid {
    stroke-dasharray: 0;
  }
  & .edge-thickness-invisible {
    stroke-width: 0;
    fill: none;
  }
  & .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  & .marker {
    fill: ${n.lineColor};
    stroke: ${n.lineColor};
  }
  & .marker.cross {
    stroke: ${n.lineColor};
  }

  & svg {
    font-family: ${n.fontFamily};
    font-size: ${n.fontSize};
  }
   & p {
    margin: 0
   }

  ${i}
  .node .neo-node {
    stroke: ${n.nodeBorder};
  }

  [data-look="neo"].node rect, [data-look="neo"].cluster rect, [data-look="neo"].node polygon {
    stroke: ${n.useGradient ? "url(" + r + "-gradient)" : n.nodeBorder};
    filter: ${n.dropShadow ? n.dropShadow.replace("url(#drop-shadow)", `url(${r}-drop-shadow)`) : "none"};
  }
  [data-look="neo"].swimlane.cluster rect {
    filter: none;
  }


  [data-look="neo"].node path {
    stroke: ${n.useGradient ? "url(" + r + "-gradient)" : n.nodeBorder};
    stroke-width: ${n.strokeWidth ?? 1}px;
  }

  [data-look="neo"].node .outer-path {
    filter: ${n.dropShadow ? n.dropShadow.replace("url(#drop-shadow)", `url(${r}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node .neo-line path {
    stroke: ${n.nodeBorder};
    filter: none;
  }

  [data-look="neo"].node circle{
    stroke: ${n.useGradient ? "url(" + r + "-gradient)" : n.nodeBorder};
    filter: ${n.dropShadow ? n.dropShadow.replace("url(#drop-shadow)", `url(${r}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node circle .state-start{
    fill: #000000;
  }

  [data-look="neo"].icon-shape .icon {
    fill: ${n.useGradient ? "url(" + r + "-gradient)" : n.nodeBorder};
    filter: ${n.dropShadow ? n.dropShadow.replace("url(#drop-shadow)", `url(${r}-drop-shadow)`) : "none"};
  }

    [data-look="neo"].icon-shape .icon-neo path {
    stroke: ${n.useGradient ? "url(" + r + "-gradient)" : n.nodeBorder};
    filter: ${n.dropShadow ? n.dropShadow.replace("url(#drop-shadow)", `url(${r}-drop-shadow)`) : "none"};
  }

  ${t}
`;
}, "getStyles"), ur = /* @__PURE__ */ i((e, t) => {
	t !== void 0 && (sr[e] = t);
}, "addStylesForDiagram"), dr = lr, fr = {};
a(fr, {
	clear: () => _r,
	getAccDescription: () => xr,
	getAccTitle: () => yr,
	getDiagramTitle: () => Cr,
	setAccDescription: () => br,
	setAccTitle: () => vr,
	setDiagramTitle: () => Sr
});
var pr = "", mr = "", hr = "", gr = /* @__PURE__ */ i((e) => Ln(e, fn()), "sanitizeText"), _r = /* @__PURE__ */ i(() => {
	pr = "", hr = "", mr = "";
}, "clear"), vr = /* @__PURE__ */ i((e) => {
	pr = gr(e).replace(/^\s+/g, "");
}, "setAccTitle"), yr = /* @__PURE__ */ i(() => pr, "getAccTitle"), br = /* @__PURE__ */ i((e) => {
	hr = gr(e).replace(/\n\s+/g, "\n");
}, "setAccDescription"), xr = /* @__PURE__ */ i(() => hr, "getAccDescription"), Sr = /* @__PURE__ */ i((e) => {
	mr = gr(e);
}, "setDiagramTitle"), Cr = /* @__PURE__ */ i(() => mr, "getDiagramTitle"), wr = c, Tr = l, z = fn, Er = dn, Dr = en, Or = /* @__PURE__ */ i((e) => Ln(e, z()), "sanitizeText"), kr = or, Ar = /* @__PURE__ */ i(() => fr, "getCommonDb"), jr = {}, Mr = /* @__PURE__ */ i((e, t, n) => {
	jr[e] && wr.warn(`Diagram with id ${e} already registered. Overwriting.`), jr[e] = t, n && kn(e, n), ur(e, t.styles), t.injectUtils?.(wr, Tr, z, Or, kr, Ar(), () => {});
}, "registerDiagram"), Nr = /* @__PURE__ */ i((e) => {
	if (e in jr) return jr[e];
	throw new Pr(e);
}, "getDiagram"), Pr = class extends Error {
	static {
		i(this, "DiagramNotFoundError");
	}
	constructor(e) {
		super(`Diagram ${e} not found.`);
	}
}, Fr = { value: () => {} };
function Ir() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new Lr(n);
}
function Lr(e) {
	this._ = e;
}
function Rr(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
Lr.prototype = Ir.prototype = {
	constructor: Lr,
	on: function(e, t) {
		var n = this._, r = Rr(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = zr(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = Br(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = Br(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new Lr(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function zr(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function Br(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = Fr, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var Vr = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/namespace.js
function Hr(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Vr.hasOwnProperty(t) ? {
		space: Vr[t],
		local: e
	} : e;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/creator.js
function Ur(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function Wr(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function Gr(e) {
	var t = Hr(e);
	return (t.local ? Wr : Ur)(t);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selector.js
function Kr() {}
function qr(e) {
	return e == null ? Kr : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/select.js
function Jr(e) {
	typeof e != "function" && (e = qr(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new Ia(r, this._parents);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/array.js
function Yr(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selectorAll.js
function Xr() {
	return [];
}
function Zr(e) {
	return e == null ? Xr : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectAll.js
function Qr(e) {
	return function() {
		return Yr(e.apply(this, arguments));
	};
}
function $r(e) {
	e = typeof e == "function" ? Qr(e) : Zr(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new Ia(r, i);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/matcher.js
function ei(e) {
	return function() {
		return this.matches(e);
	};
}
function ti(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChild.js
var ni = Array.prototype.find;
function ri(e) {
	return function() {
		return ni.call(this.children, e);
	};
}
function ii() {
	return this.firstElementChild;
}
function ai(e) {
	return this.select(e == null ? ii : ri(typeof e == "function" ? e : ti(e)));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChildren.js
var oi = Array.prototype.filter;
function si() {
	return Array.from(this.children);
}
function ci(e) {
	return function() {
		return oi.call(this.children, e);
	};
}
function li(e) {
	return this.selectAll(e == null ? si : ci(typeof e == "function" ? e : ti(e)));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/filter.js
function ui(e) {
	typeof e != "function" && (e = ei(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Ia(r, this._parents);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sparse.js
function di(e) {
	return Array(e.length);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/enter.js
function fi() {
	return new Ia(this._enter || this._groups.map(di), this._parents);
}
function pi(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
pi.prototype = {
	constructor: pi,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/constant.js
function mi(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/data.js
function hi(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new pi(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function gi(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new pi(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function _i(e) {
	return e.__data__;
}
function vi(e, t) {
	if (!arguments.length) return Array.from(this, _i);
	var n = t ? gi : hi, r = this._parents, i = this._groups;
	typeof e != "function" && (e = mi(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = yi(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new Ia(o, r), o._enter = s, o._exit = c, o;
}
function yi(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/exit.js
function bi() {
	return new Ia(this._exit || this._groups.map(di), this._parents);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/join.js
function xi(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/merge.js
function Si(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new Ia(s, this._parents);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/order.js
function Ci() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sort.js
function wi(e) {
	e ||= Ti;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new Ia(i, this._parents).order();
}
function Ti(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/call.js
function Ei() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/nodes.js
function Di() {
	return Array.from(this);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/node.js
function Oi() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/size.js
function ki() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/empty.js
function Ai() {
	return !this.node();
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/each.js
function ji(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/attr.js
function Mi(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Ni(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Pi(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Fi(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ii(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Li(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Ri(e, t) {
	var n = Hr(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? Ni : Mi : typeof t == "function" ? n.local ? Li : Ii : n.local ? Fi : Pi)(n, t));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/window.js
function zi(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/style.js
function Bi(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Vi(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function Hi(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Ui(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Bi : typeof t == "function" ? Hi : Vi)(e, t, n ?? "")) : Wi(this.node(), e);
}
function Wi(e, t) {
	return e.style.getPropertyValue(t) || zi(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/property.js
function Gi(e) {
	return function() {
		delete this[e];
	};
}
function Ki(e, t) {
	return function() {
		this[e] = t;
	};
}
function qi(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function Ji(e, t) {
	return arguments.length > 1 ? this.each((t == null ? Gi : typeof t == "function" ? qi : Ki)(e, t)) : this.node()[e];
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/classed.js
function Yi(e) {
	return e.trim().split(/^|\s+/);
}
function Xi(e) {
	return e.classList || new Zi(e);
}
function Zi(e) {
	this._node = e, this._names = Yi(e.getAttribute("class") || "");
}
Zi.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function Qi(e, t) {
	for (var n = Xi(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function $i(e, t) {
	for (var n = Xi(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function ea(e) {
	return function() {
		Qi(this, e);
	};
}
function ta(e) {
	return function() {
		$i(this, e);
	};
}
function na(e, t) {
	return function() {
		(t.apply(this, arguments) ? Qi : $i)(this, e);
	};
}
function ra(e, t) {
	var n = Yi(e + "");
	if (arguments.length < 2) {
		for (var r = Xi(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? na : t ? ea : ta)(n, t));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/text.js
function ia() {
	this.textContent = "";
}
function aa(e) {
	return function() {
		this.textContent = e;
	};
}
function oa(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function sa(e) {
	return arguments.length ? this.each(e == null ? ia : (typeof e == "function" ? oa : aa)(e)) : this.node().textContent;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/html.js
function ca() {
	this.innerHTML = "";
}
function la(e) {
	return function() {
		this.innerHTML = e;
	};
}
function ua(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function da(e) {
	return arguments.length ? this.each(e == null ? ca : (typeof e == "function" ? ua : la)(e)) : this.node().innerHTML;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/raise.js
function fa() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function pa() {
	return this.each(fa);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/lower.js
function ma() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ha() {
	return this.each(ma);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/append.js
function ga(e) {
	var t = typeof e == "function" ? e : Gr(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/insert.js
function _a() {
	return null;
}
function va(e, t) {
	var n = typeof e == "function" ? e : Gr(e), r = t == null ? _a : typeof t == "function" ? t : qr(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/remove.js
function ya() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function ba() {
	return this.each(ya);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/clone.js
function xa() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Sa() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ca(e) {
	return this.select(e ? Sa : xa);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/datum.js
function wa(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/on.js
function Ta(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Ea(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function Da(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Oa(e, t, n) {
	return function() {
		var r = this.__on, i, a = Ta(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function ka(e, t, n) {
	var r = Ea(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Oa : Da, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/dispatch.js
function Aa(e, t, n) {
	var r = zi(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function ja(e, t) {
	return function() {
		return Aa(this, e, t);
	};
}
function Ma(e, t) {
	return function() {
		return Aa(this, e, t.apply(this, arguments));
	};
}
function Na(e, t) {
	return this.each((typeof t == "function" ? Ma : ja)(e, t));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/iterator.js
function* Pa() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/index.js
var Fa = [null];
function Ia(e, t) {
	this._groups = e, this._parents = t;
}
function La() {
	return new Ia([[document.documentElement]], Fa);
}
function Ra() {
	return this;
}
Ia.prototype = La.prototype = {
	constructor: Ia,
	select: Jr,
	selectAll: $r,
	selectChild: ai,
	selectChildren: li,
	filter: ui,
	data: vi,
	enter: fi,
	exit: bi,
	join: xi,
	merge: Si,
	selection: Ra,
	order: Ci,
	sort: wi,
	call: Ei,
	nodes: Di,
	node: Oi,
	size: ki,
	empty: Ai,
	each: ji,
	attr: Ri,
	style: Ui,
	property: Ji,
	classed: ra,
	text: sa,
	html: da,
	raise: pa,
	lower: ha,
	append: ga,
	insert: va,
	remove: ba,
	clone: Ca,
	datum: wa,
	on: ka,
	dispatch: Na,
	[Symbol.iterator]: Pa
};
//#endregion
//#region ../../node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/select.js
function B(e) {
	return typeof e == "string" ? new Ia([[document.querySelector(e)]], [document.documentElement]) : new Ia([[e]], Fa);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/define.js
function za(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function Ba(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/color.js
function Va() {}
var Ha = .7, Ua = 1 / Ha, Wa = "\\s*([+-]?\\d+)\\s*", Ga = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ka = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", qa = /^#([0-9a-f]{3,8})$/, Ja = RegExp(`^rgb\\(${Wa},${Wa},${Wa}\\)$`), Ya = RegExp(`^rgb\\(${Ka},${Ka},${Ka}\\)$`), Xa = RegExp(`^rgba\\(${Wa},${Wa},${Wa},${Ga}\\)$`), Za = RegExp(`^rgba\\(${Ka},${Ka},${Ka},${Ga}\\)$`), Qa = RegExp(`^hsl\\(${Ga},${Ka},${Ka}\\)$`), $a = RegExp(`^hsla\\(${Ga},${Ka},${Ka},${Ga}\\)$`), eo = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
za(Va, ao, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: to,
	formatHex: to,
	formatHex8: no,
	formatHsl: ro,
	formatRgb: io,
	toString: io
});
function to() {
	return this.rgb().formatHex();
}
function no() {
	return this.rgb().formatHex8();
}
function ro() {
	return yo(this).formatHsl();
}
function io() {
	return this.rgb().formatRgb();
}
function ao(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = qa.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? oo(t) : n === 3 ? new uo(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? so(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? so(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Ja.exec(e)) ? new uo(t[1], t[2], t[3], 1) : (t = Ya.exec(e)) ? new uo(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Xa.exec(e)) ? so(t[1], t[2], t[3], t[4]) : (t = Za.exec(e)) ? so(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Qa.exec(e)) ? vo(t[1], t[2] / 100, t[3] / 100, 1) : (t = $a.exec(e)) ? vo(t[1], t[2] / 100, t[3] / 100, t[4]) : eo.hasOwnProperty(e) ? oo(eo[e]) : e === "transparent" ? new uo(NaN, NaN, NaN, 0) : null;
}
function oo(e) {
	return new uo(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function so(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new uo(e, t, n, r);
}
function co(e) {
	return e instanceof Va || (e = ao(e)), e ? (e = e.rgb(), new uo(e.r, e.g, e.b, e.opacity)) : new uo();
}
function lo(e, t, n, r) {
	return arguments.length === 1 ? co(e) : new uo(e, t, n, r ?? 1);
}
function uo(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
za(uo, lo, Ba(Va, {
	brighter(e) {
		return e = e == null ? Ua : Ua ** +e, new uo(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Ha : Ha ** +e, new uo(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new uo(go(this.r), go(this.g), go(this.b), ho(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: fo,
	formatHex: fo,
	formatHex8: po,
	formatRgb: mo,
	toString: mo
}));
function fo() {
	return `#${_o(this.r)}${_o(this.g)}${_o(this.b)}`;
}
function po() {
	return `#${_o(this.r)}${_o(this.g)}${_o(this.b)}${_o((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function mo() {
	let e = ho(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${go(this.r)}, ${go(this.g)}, ${go(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function ho(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function go(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function _o(e) {
	return e = go(e), (e < 16 ? "0" : "") + e.toString(16);
}
function vo(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new xo(e, t, n, r);
}
function yo(e) {
	if (e instanceof xo) return new xo(e.h, e.s, e.l, e.opacity);
	if (e instanceof Va || (e = ao(e)), !e) return new xo();
	if (e instanceof xo) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new xo(o, s, c, e.opacity);
}
function bo(e, t, n, r) {
	return arguments.length === 1 ? yo(e) : new xo(e, t, n, r ?? 1);
}
function xo(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
za(xo, bo, Ba(Va, {
	brighter(e) {
		return e = e == null ? Ua : Ua ** +e, new xo(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Ha : Ha ** +e, new xo(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new uo(wo(e >= 240 ? e - 240 : e + 120, i, r), wo(e, i, r), wo(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new xo(So(this.h), Co(this.s), Co(this.l), ho(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = ho(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${So(this.h)}, ${Co(this.s) * 100}%, ${Co(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function So(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Co(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function wo(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/constant.js
var To = (e) => () => e;
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/color.js
function Eo(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Do(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Oo(e, t) {
	var n = t - e;
	return n ? Eo(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : To(isNaN(e) ? t : e);
}
function ko(e) {
	return (e = +e) == 1 ? Ao : function(t, n) {
		return n - t ? Do(t, n, e) : To(isNaN(t) ? n : t);
	};
}
function Ao(e, t) {
	var n = t - e;
	return n ? Eo(e, n) : To(isNaN(e) ? t : e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/rgb.js
var jo = (function e(t) {
	var n = ko(t);
	function r(e, t) {
		var r = n((e = lo(e)).r, (t = lo(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Ao(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/number.js
function Mo(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/string.js
var No = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Po = new RegExp(No.source, "g");
function Fo(e) {
	return function() {
		return e;
	};
}
function Io(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Lo(e, t) {
	var n = No.lastIndex = Po.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = No.exec(e)) && (i = Po.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: Mo(r, i)
	})), n = Po.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Io(c[0].x) : Fo(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/decompose.js
var Ro = 180 / Math.PI, zo = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function Bo(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * Ro,
		skewX: Math.atan(c) * Ro,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/parse.js
var Vo;
function Ho(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? zo : Bo(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Uo(e) {
	return e == null || (Vo ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), Vo.setAttribute("transform", e), !(e = Vo.transform.baseVal.consolidate())) ? zo : (e = e.matrix, Bo(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/index.js
function Wo(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: Mo(e, i)
			}, {
				i: c - 2,
				x: Mo(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: Mo(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: Mo(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: Mo(e, n)
			}, {
				i: s - 2,
				x: Mo(t, r)
			});
		} else (n !== 1 || r !== 1) && a.push(i(a) + "scale(" + n + "," + r + ")");
	}
	return function(t, n) {
		var r = [], i = [];
		return t = e(t), n = e(n), a(t.translateX, t.translateY, n.translateX, n.translateY, r, i), o(t.rotate, n.rotate, r, i), s(t.skewX, n.skewX, r, i), c(t.scaleX, t.scaleY, n.scaleX, n.scaleY, r, i), t = n = null, function(e) {
			for (var t = -1, n = i.length, a; ++t < n;) r[(a = i[t]).i] = a.x(e);
			return r.join("");
		};
	};
}
var Go = Wo(Ho, "px, ", "px)", "deg)"), Ko = Wo(Uo, ", ", ")", ")"), qo = 0, Jo = 0, Yo = 0, Xo = 1e3, Zo, Qo, $o = 0, es = 0, ts = 0, ns = typeof performance == "object" && performance.now ? performance : Date, rs = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function is() {
	return es ||= (rs(as), ns.now() + ts);
}
function as() {
	es = 0;
}
function os() {
	this._call = this._time = this._next = null;
}
os.prototype = ss.prototype = {
	constructor: os,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? is() : +n) + (t == null ? 0 : +t), !this._next && Qo !== this && (Qo ? Qo._next = this : Zo = this, Qo = this), this._call = e, this._time = n, fs();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, fs());
	}
};
function ss(e, t, n) {
	var r = new os();
	return r.restart(e, t, n), r;
}
function cs() {
	is(), ++qo;
	for (var e = Zo, t; e;) (t = es - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--qo;
}
function ls() {
	es = ($o = ns.now()) + ts, qo = Jo = 0;
	try {
		cs();
	} finally {
		qo = 0, ds(), es = 0;
	}
}
function us() {
	var e = ns.now(), t = e - $o;
	t > Xo && (ts -= t, $o = e);
}
function ds() {
	for (var e, t = Zo, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Zo = n);
	Qo = e, fs(r);
}
function fs(e) {
	qo || (Jo &&= clearTimeout(Jo), e - es > 24 ? (e < Infinity && (Jo = setTimeout(ls, e - ns.now() - ts)), Yo &&= clearInterval(Yo)) : (Yo ||= ($o = ns.now(), setInterval(us, Xo)), qo = 1, rs(ls)));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-timer@3.0.1/node_modules/d3-timer/src/timeout.js
function ps(e, t, n) {
	var r = new os();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/schedule.js
var ms = Ir("start", "end", "cancel", "interrupt"), hs = [];
function gs(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	bs(e, n, {
		name: t,
		index: r,
		group: i,
		on: ms,
		tween: hs,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function _s(e, t) {
	var n = ys(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function vs(e, t) {
	var n = ys(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function ys(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function bs(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = ss(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return ps(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (ps(function() {
			n.state === 3 && (n.state = 4, n.timer.restart(s, n.delay, n.time), s(a));
		}), n.state = 2, n.on.call("start", e, e.__data__, n.index, n.group), n.state === 2) {
			for (n.state = 3, i = Array(d = n.tween.length), l = 0, u = -1; l < d; ++l) (f = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++u] = f);
			i.length = u + 1;
		}
	}
	function s(t) {
		for (var r = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(c), n.state = 5, 1), a = -1, o = i.length; ++a < o;) i[a].call(e, r);
		n.state === 5 && (n.on.call("end", e, e.__data__, n.index, n.group), c());
	}
	function c() {
		for (var i in n.state = 6, n.timer.stop(), delete r[t], r) return;
		delete e.__transition;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/interrupt.js
function xs(e, t) {
	var n = e.__transition, r, i, a = !0, o;
	if (n) {
		for (o in t = t == null ? null : t + "", n) {
			if ((r = n[o]).name !== t) {
				a = !1;
				continue;
			}
			i = r.state > 2 && r.state < 5, r.state = 6, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[o];
		}
		a && delete e.__transition;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/interrupt.js
function Ss(e) {
	return this.each(function() {
		xs(this, e);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/tween.js
function Cs(e, t) {
	var n, r;
	return function() {
		var i = vs(this, e), a = i.tween;
		if (a !== n) {
			r = n = a;
			for (var o = 0, s = r.length; o < s; ++o) if (r[o].name === t) {
				r = r.slice(), r.splice(o, 1);
				break;
			}
		}
		i.tween = r;
	};
}
function ws(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = vs(this, e), o = a.tween;
		if (o !== r) {
			i = (r = o).slice();
			for (var s = {
				name: t,
				value: n
			}, c = 0, l = i.length; c < l; ++c) if (i[c].name === t) {
				i[c] = s;
				break;
			}
			c === l && i.push(s);
		}
		a.tween = i;
	};
}
function Ts(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = ys(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Cs : ws)(n, e, t));
}
function Es(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = vs(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return ys(e, r).value[t];
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/interpolate.js
function Ds(e, t) {
	var n;
	return (typeof t == "number" ? Mo : t instanceof ao ? jo : (n = ao(t)) ? (t = n, jo) : Lo)(e, t);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attr.js
function Os(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function ks(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function As(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function js(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Ms(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Ns(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Ps(e, t) {
	var n = Hr(e), r = n === "transform" ? Ko : Ds;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Ns : Ms)(n, r, Es(this, "attr." + e, t)) : t == null ? (n.local ? ks : Os)(n) : (n.local ? js : As)(n, r, t));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attrTween.js
function Fs(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function Is(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function Ls(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Is(e, i)), n;
	}
	return i._value = t, i;
}
function Rs(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Fs(e, i)), n;
	}
	return i._value = t, i;
}
function zs(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = Hr(e);
	return this.tween(n, (r.local ? Ls : Rs)(r, t));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/delay.js
function Bs(e, t) {
	return function() {
		_s(this, e).delay = +t.apply(this, arguments);
	};
}
function Vs(e, t) {
	return t = +t, function() {
		_s(this, e).delay = t;
	};
}
function Hs(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Bs : Vs)(t, e)) : ys(this.node(), t).delay;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/duration.js
function Us(e, t) {
	return function() {
		vs(this, e).duration = +t.apply(this, arguments);
	};
}
function Ws(e, t) {
	return t = +t, function() {
		vs(this, e).duration = t;
	};
}
function Gs(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Us : Ws)(t, e)) : ys(this.node(), t).duration;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/ease.js
function Ks(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		vs(this, e).ease = t;
	};
}
function qs(e) {
	var t = this._id;
	return arguments.length ? this.each(Ks(t, e)) : ys(this.node(), t).ease;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/easeVarying.js
function Js(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		vs(this, e).ease = n;
	};
}
function Ys(e) {
	if (typeof e != "function") throw Error();
	return this.each(Js(this._id, e));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/filter.js
function Xs(e) {
	typeof e != "function" && (e = ei(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Tc(r, this._parents, this._name, this._id);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/merge.js
function Zs(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Tc(o, this._parents, this._name, this._id);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/on.js
function Qs(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function $s(e, t, n) {
	var r, i, a = Qs(t) ? _s : vs;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function ec(e, t) {
	var n = this._id;
	return arguments.length < 2 ? ys(this.node(), n).on.on(e) : this.each($s(n, e, t));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/remove.js
function tc(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function nc() {
	return this.on("end.remove", tc(this._id));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/select.js
function rc(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = qr(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, gs(l[f], t, n, f, l, ys(u, n)));
	return new Tc(a, this._parents, t, n);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selectAll.js
function ic(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = Zr(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = ys(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && gs(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Tc(a, o, t, n);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selection.js
var ac = La.prototype.constructor;
function oc() {
	return new ac(this._groups, this._parents);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/style.js
function sc(e, t) {
	var n, r, i;
	return function() {
		var a = Wi(this, e), o = (this.style.removeProperty(e), Wi(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function cc(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function lc(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Wi(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function uc(e, t, n) {
	var r, i, a;
	return function() {
		var o = Wi(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Wi(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function dc(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = vs(this, e), l = c.on, u = c.value[a] == null ? s ||= cc(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function fc(e, t, n) {
	var r = (e += "") == "transform" ? Go : Ds;
	return t == null ? this.styleTween(e, sc(e, r)).on("end.style." + e, cc(e)) : typeof t == "function" ? this.styleTween(e, uc(e, r, Es(this, "style." + e, t))).each(dc(this._id, e)) : this.styleTween(e, lc(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/styleTween.js
function pc(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function mc(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && pc(e, a, n)), r;
	}
	return a._value = t, a;
}
function hc(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, mc(e, t, n ?? ""));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/text.js
function gc(e) {
	return function() {
		this.textContent = e;
	};
}
function _c(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function vc(e) {
	return this.tween("text", typeof e == "function" ? _c(Es(this, "text", e)) : gc(e == null ? "" : e + ""));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/textTween.js
function yc(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function bc(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && yc(r)), t;
	}
	return r._value = e, r;
}
function xc(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, bc(e));
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/transition.js
function Sc() {
	for (var e = this._name, t = this._id, n = Dc(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = ys(c, t);
		gs(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Tc(r, this._parents, e, n);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/end.js
function Cc() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = vs(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/index.js
var wc = 0;
function Tc(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ec(e) {
	return La().transition(e);
}
function Dc() {
	return ++wc;
}
var Oc = La.prototype;
Tc.prototype = Ec.prototype = {
	constructor: Tc,
	select: rc,
	selectAll: ic,
	selectChild: Oc.selectChild,
	selectChildren: Oc.selectChildren,
	filter: Xs,
	merge: Zs,
	selection: oc,
	transition: Sc,
	call: Oc.call,
	nodes: Oc.nodes,
	node: Oc.node,
	size: Oc.size,
	empty: Oc.empty,
	each: Oc.each,
	on: ec,
	attr: Ps,
	attrTween: zs,
	style: fc,
	styleTween: hc,
	text: vc,
	textTween: xc,
	remove: nc,
	tween: Ts,
	delay: Hs,
	duration: Gs,
	ease: qs,
	easeVarying: Ys,
	end: Cc,
	[Symbol.iterator]: Oc[Symbol.iterator]
};
//#endregion
//#region ../../node_modules/.pnpm/d3-ease@3.0.1/node_modules/d3-ease/src/cubic.js
function kc(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/transition.js
var Ac = {
	time: null,
	delay: 0,
	duration: 250,
	ease: kc
};
function jc(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function Mc(e) {
	var t, n;
	e instanceof Tc ? (t = e._id, e = e._name) : (t = Dc(), (n = Ac).time = is(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && gs(c, e, t, l, o, n || jc(c, t));
	return new Tc(r, this._parents, e, t);
}
La.prototype.interrupt = Ss, La.prototype.transition = Mc;
//#endregion
//#region ../../node_modules/.pnpm/d3-brush@3.0.0/node_modules/d3-brush/src/brush.js
var { abs: Nc, max: Pc, min: Fc } = Math;
["w", "e"].map(Ic), ["n", "s"].map(Ic), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(Ic);
function Ic(e) {
	return { type: e };
}
//#endregion
//#region ../../node_modules/.pnpm/d3-path@3.1.0/node_modules/d3-path/src/path.js
var Lc = Math.PI, Rc = 2 * Lc, zc = 1e-6, Bc = Rc - zc;
function Vc(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function Hc(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return Vc;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var Uc = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? Vc : Hc(e);
	}
	moveTo(e, t) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}`;
	}
	closePath() {
		this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
	}
	lineTo(e, t) {
		this._append`L${this._x1 = +e},${this._y1 = +t}`;
	}
	quadraticCurveTo(e, t, n, r) {
		this._append`Q${+e},${+t},${this._x1 = +n},${this._y1 = +r}`;
	}
	bezierCurveTo(e, t, n, r, i, a) {
		this._append`C${+e},${+t},${+n},${+r},${this._x1 = +i},${this._y1 = +a}`;
	}
	arcTo(e, t, n, r, i) {
		if (e = +e, t = +t, n = +n, r = +r, i = +i, i < 0) throw Error(`negative radius: ${i}`);
		let a = this._x1, o = this._y1, s = n - e, c = r - t, l = a - e, u = o - t, d = l * l + u * u;
		if (this._x1 === null) this._append`M${this._x1 = e},${this._y1 = t}`;
		else if (d > zc) if (!(Math.abs(u * s - c * l) > zc) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((Lc - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > zc && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > zc || Math.abs(this._y1 - l) > zc) && this._append`L${c},${l}`, n && (d < 0 && (d = d % Rc + Rc), d > Bc ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > zc && this._append`A${n},${n},0,${+(d >= Lc)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function Wc() {
	return new Uc();
}
Wc.prototype = Uc.prototype;
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/constant.js
function Gc(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/math.js
var Kc = Math.abs, qc = Math.atan2, Jc = Math.cos, Yc = Math.max, Xc = Math.min, Zc = Math.sin, Qc = Math.sqrt, $c = 1e-12, el = Math.PI, tl = el / 2, nl = 2 * el;
function rl(e) {
	return e > 1 ? 0 : e < -1 ? el : Math.acos(e);
}
function il(e) {
	return e >= 1 ? tl : e <= -1 ? -tl : Math.asin(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/path.js
function al(e) {
	let t = 3;
	return e.digits = function(n) {
		if (!arguments.length) return t;
		if (n == null) t = null;
		else {
			let e = Math.floor(n);
			if (!(e >= 0)) throw RangeError(`invalid digits: ${n}`);
			t = e;
		}
		return e;
	}, () => new Uc(t);
}
Array.prototype.slice;
function ol(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/linear.js
function sl(e) {
	this._context = e;
}
sl.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default:
				this._context.lineTo(e, t);
				break;
		}
	}
};
function cl(e) {
	return new sl(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/point.js
function ll(e) {
	return e[0];
}
function ul(e) {
	return e[1];
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/line.js
function dl(e, t) {
	var n = Gc(!0), r = null, i = cl, a = null, o = al(s);
	e = typeof e == "function" ? e : e === void 0 ? ll : Gc(e), t = typeof t == "function" ? t : t === void 0 ? ul : Gc(t);
	function s(s) {
		var c, l = (s = ol(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Gc(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Gc(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Gc(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/bump.js
var fl = class {
	constructor(e, t) {
		this._context = e, this._x = t;
	}
	areaStart() {
		this._line = 0;
	}
	areaEnd() {
		this._line = NaN;
	}
	lineStart() {
		this._point = 0;
	}
	lineEnd() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	}
	point(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default:
				this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + e) / 2, this._y0, this._x0, t, e, t) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + t) / 2, e, this._y0, e, t);
				break;
		}
		this._x0 = e, this._y0 = t;
	}
};
function pl(e) {
	return new fl(e, !0);
}
function ml(e) {
	return new fl(e, !1);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/noop.js
function hl() {}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/basis.js
function gl(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function _l(e) {
	this._context = e;
}
_l.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 3: gl(this, this._x1, this._y1);
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
			default:
				gl(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function vl(e) {
	return new _l(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/basisClosed.js
function yl(e) {
	this._context = e;
}
yl.prototype = {
	areaStart: hl,
	areaEnd: hl,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x2, this._y2), this._context.closePath();
				break;
			case 2:
				this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
				break;
			case 3:
				this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
				break;
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x2 = e, this._y2 = t;
				break;
			case 1:
				this._point = 2, this._x3 = e, this._y3 = t;
				break;
			case 2:
				this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
				break;
			default:
				gl(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function bl(e) {
	return new yl(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/basisOpen.js
function xl(e) {
	this._context = e;
}
xl.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				var n = (this._x0 + 4 * this._x1 + e) / 6, r = (this._y0 + 4 * this._y1 + t) / 6;
				this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
				break;
			case 3: this._point = 4;
			default:
				gl(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function Sl(e) {
	return new xl(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/bundle.js
function Cl(e, t) {
	this._basis = new _l(e), this._beta = t;
}
Cl.prototype = {
	lineStart: function() {
		this._x = [], this._y = [], this._basis.lineStart();
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length - 1;
		if (n > 0) for (var r = e[0], i = t[0], a = e[n] - r, o = t[n] - i, s = -1, c; ++s <= n;) c = s / n, this._basis.point(this._beta * e[s] + (1 - this._beta) * (r + c * a), this._beta * t[s] + (1 - this._beta) * (i + c * o));
		this._x = this._y = null, this._basis.lineEnd();
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
};
var wl = (function e(t) {
	function n(e) {
		return t === 1 ? new _l(e) : new Cl(e, t);
	}
	return n.beta = function(t) {
		return e(+t);
	}, n;
})(.85);
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/cardinal.js
function Tl(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function El(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
El.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3:
				Tl(this, this._x1, this._y1);
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2, this._x1 = e, this._y1 = t;
				break;
			case 2: this._point = 3;
			default:
				Tl(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Dl = (function e(t) {
	function n(e) {
		return new El(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/cardinalClosed.js
function Ol(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
Ol.prototype = {
	areaStart: hl,
	areaEnd: hl,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3:
				this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
				break;
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default:
				Tl(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var kl = (function e(t) {
	function n(e) {
		return new Ol(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/cardinalOpen.js
function Al(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
Al.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
				break;
			case 3: this._point = 4;
			default:
				Tl(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var jl = (function e(t) {
	function n(e) {
		return new Al(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/catmullRom.js
function Ml(e, t, n) {
	var r = e._x1, i = e._y1, a = e._x2, o = e._y2;
	if (e._l01_a > 1e-12) {
		var s = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, c = 3 * e._l01_a * (e._l01_a + e._l12_a);
		r = (r * s - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / c, i = (i * s - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / c;
	}
	if (e._l23_a > 1e-12) {
		var l = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, u = 3 * e._l23_a * (e._l23_a + e._l12_a);
		a = (a * l + e._x1 * e._l23_2a - t * e._l12_2a) / u, o = (o * l + e._y1 * e._l23_2a - n * e._l12_2a) / u;
	}
	e._context.bezierCurveTo(r, i, a, o, e._x2, e._y2);
}
function Nl(e, t) {
	this._context = e, this._alpha = t;
}
Nl.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3:
				this.point(this._x2, this._y2);
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3;
			default:
				Ml(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Pl = (function e(t) {
	function n(e) {
		return t ? new Nl(e, t) : new El(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/catmullRomClosed.js
function Fl(e, t) {
	this._context = e, this._alpha = t;
}
Fl.prototype = {
	areaStart: hl,
	areaEnd: hl,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3:
				this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
				break;
		}
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default:
				Ml(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Il = (function e(t) {
	function n(e) {
		return t ? new Fl(e, t) : new Ol(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/catmullRomOpen.js
function Ll(e, t) {
	this._context = e, this._alpha = t;
}
Ll.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
				break;
			case 3: this._point = 4;
			default:
				Ml(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Rl = (function e(t) {
	function n(e) {
		return t ? new Ll(e, t) : new Al(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/linearClosed.js
function zl(e) {
	this._context = e;
}
zl.prototype = {
	areaStart: hl,
	areaEnd: hl,
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		this._point && this._context.closePath();
	},
	point: function(e, t) {
		e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
	}
};
function Bl(e) {
	return new zl(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/monotone.js
function Vl(e) {
	return e < 0 ? -1 : 1;
}
function Hl(e, t, n) {
	var r = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (r || i < 0 && -0), o = (n - e._y1) / (i || r < 0 && -0), s = (a * i + o * r) / (r + i);
	return (Vl(a) + Vl(o)) * Math.min(Math.abs(a), Math.abs(o), .5 * Math.abs(s)) || 0;
}
function Ul(e, t) {
	var n = e._x1 - e._x0;
	return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Wl(e, t, n) {
	var r = e._x0, i = e._y0, a = e._x1, o = e._y1, s = (a - r) / 3;
	e._context.bezierCurveTo(r + s, i + s * t, a - s, o - s * n, a, o);
}
function Gl(e) {
	this._context = e;
}
Gl.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
			case 3:
				Wl(this, this._t0, Ul(this, this._t0));
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		var n = NaN;
		if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
			switch (this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
					break;
				case 2:
					this._point = 3, Wl(this, Ul(this, n = Hl(this, e, t)), n);
					break;
				default:
					Wl(this, this._t0, n = Hl(this, e, t));
					break;
			}
			this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
		}
	}
};
function Kl(e) {
	this._context = new ql(e);
}
(Kl.prototype = Object.create(Gl.prototype)).point = function(e, t) {
	Gl.prototype.point.call(this, t, e);
};
function ql(e) {
	this._context = e;
}
ql.prototype = {
	moveTo: function(e, t) {
		this._context.moveTo(t, e);
	},
	closePath: function() {
		this._context.closePath();
	},
	lineTo: function(e, t) {
		this._context.lineTo(t, e);
	},
	bezierCurveTo: function(e, t, n, r, i, a) {
		this._context.bezierCurveTo(t, e, r, n, a, i);
	}
};
function Jl(e) {
	return new Gl(e);
}
function Yl(e) {
	return new Kl(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/natural.js
function Xl(e) {
	this._context = e;
}
Xl.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = [], this._y = [];
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length;
		if (n) if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), n === 2) this._context.lineTo(e[1], t[1]);
		else for (var r = Zl(e), i = Zl(t), a = 0, o = 1; o < n; ++a, ++o) this._context.bezierCurveTo(r[0][a], i[0][a], r[1][a], i[1][a], e[o], t[o]);
		(this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
};
function Zl(e) {
	var t, n = e.length - 1, r, i = Array(n), a = Array(n), o = Array(n);
	for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
	for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t) r = i[t] / a[t - 1], a[t] -= r, o[t] -= r * o[t - 1];
	for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
	for (a[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
	return [i, a];
}
function Ql(e) {
	return new Xl(e);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/curve/step.js
function $l(e, t) {
	this._context = e, this._t = t;
}
$l.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = this._y = NaN, this._point = 0;
	},
	lineEnd: function() {
		0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default:
				if (this._t <= 0) this._context.lineTo(this._x, t), this._context.lineTo(e, t);
				else {
					var n = this._x * (1 - this._t) + e * this._t;
					this._context.lineTo(n, this._y), this._context.lineTo(n, t);
				}
				break;
		}
		this._x = e, this._y = t;
	}
};
function eu(e) {
	return new $l(e, .5);
}
function tu(e) {
	return new $l(e, 0);
}
function nu(e) {
	return new $l(e, 1);
}
//#endregion
//#region ../../node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/transform.js
function ru(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
ru.prototype = {
	constructor: ru,
	scale: function(e) {
		return e === 1 ? this : new ru(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new ru(this.k, this.x + this.k * e, this.y + this.k * t);
	},
	apply: function(e) {
		return [e[0] * this.k + this.x, e[1] * this.k + this.y];
	},
	applyX: function(e) {
		return e * this.k + this.x;
	},
	applyY: function(e) {
		return e * this.k + this.y;
	},
	invert: function(e) {
		return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
	},
	invertX: function(e) {
		return (e - this.x) / this.k;
	},
	invertY: function(e) {
		return (e - this.y) / this.k;
	},
	rescaleX: function(e) {
		return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
	},
	rescaleY: function(e) {
		return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var iu = new ru(1, 0, 0);
au.prototype = ru.prototype;
function au(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return iu;
	return e.__zoom;
}
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-3NCLNEKW.mjs
var ou = /* @__PURE__ */ i((e) => {
	let { securityLevel: t } = z(), n = B("body");
	return t === "sandbox" && (n = B((B(`#i${e}`).node()?.contentDocument ?? document).body)), n.select(`#${e}`);
}, "selectSvgElement");
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-ZIRB5QZD.mjs
function su(e) {
	return e == null;
}
i(su, "isNothing");
function cu(e) {
	return typeof e == "object" && !!e;
}
i(cu, "isObject");
function lu(e) {
	return Array.isArray(e) ? e : su(e) ? [] : [e];
}
i(lu, "toArray");
function uu(e, t) {
	var n, r, i, a;
	if (t) for (a = Object.keys(t), n = 0, r = a.length; n < r; n += 1) i = a[n], e[i] = t[i];
	return e;
}
i(uu, "extend");
function du(e, t) {
	var n = "", r;
	for (r = 0; r < t; r += 1) n += e;
	return n;
}
i(du, "repeat");
function fu(e) {
	return e === 0 && 1 / e == -Infinity;
}
i(fu, "isNegativeZero");
var pu = {
	isNothing: su,
	isObject: cu,
	toArray: lu,
	repeat: du,
	isNegativeZero: fu,
	extend: uu
};
function mu(e, t) {
	var n = "", r = e.reason || "(unknown reason)";
	return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
}
i(mu, "formatError");
function hu(e, t) {
	Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = mu(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
}
i(hu, "YAMLException$1"), hu.prototype = Object.create(Error.prototype), hu.prototype.constructor = hu, hu.prototype.toString = /* @__PURE__ */ i(function(e) {
	return this.name + ": " + mu(this, e);
}, "toString");
var gu = hu;
function _u(e, t, n, r, i) {
	var a = "", o = "", s = Math.floor(i / 2) - 1;
	return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
		str: a + e.slice(t, n).replace(/\t/g, "→") + o,
		pos: r - t + a.length
	};
}
i(_u, "getLine");
function vu(e, t) {
	return pu.repeat(" ", t - e.length) + e;
}
i(vu, "padStart");
function yu(e, t) {
	if (t = Object.create(t || null), !e.buffer) return null;
	t.maxLength ||= 79, typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
	for (var n = /\r?\n|\r|\0/g, r = [0], i = [], a, o = -1; a = n.exec(e.buffer);) i.push(a.index), r.push(a.index + a[0].length), e.position <= a.index && o < 0 && (o = r.length - 2);
	o < 0 && (o = r.length - 1);
	var s = "", c, l, u = Math.min(e.line + t.linesAfter, i.length).toString().length, d = t.maxLength - (t.indent + u + 3);
	for (c = 1; c <= t.linesBefore && !(o - c < 0); c++) l = _u(e.buffer, r[o - c], i[o - c], e.position - (r[o] - r[o - c]), d), s = pu.repeat(" ", t.indent) + vu((e.line - c + 1).toString(), u) + " | " + l.str + "\n" + s;
	for (l = _u(e.buffer, r[o], i[o], e.position, d), s += pu.repeat(" ", t.indent) + vu((e.line + 1).toString(), u) + " | " + l.str + "\n", s += pu.repeat("-", t.indent + u + 3 + l.pos) + "^\n", c = 1; c <= t.linesAfter && !(o + c >= i.length); c++) l = _u(e.buffer, r[o + c], i[o + c], e.position - (r[o] - r[o + c]), d), s += pu.repeat(" ", t.indent) + vu((e.line + c + 1).toString(), u) + " | " + l.str + "\n";
	return s.replace(/\n$/, "");
}
i(yu, "makeSnippet");
var bu = yu, xu = [
	"kind",
	"multi",
	"resolve",
	"construct",
	"instanceOf",
	"predicate",
	"represent",
	"representName",
	"defaultStyle",
	"styleAliases"
], Su = [
	"scalar",
	"sequence",
	"mapping"
];
function Cu(e) {
	var t = {};
	return e !== null && Object.keys(e).forEach(function(n) {
		e[n].forEach(function(e) {
			t[String(e)] = n;
		});
	}), t;
}
i(Cu, "compileStyleAliases");
function wu(e, t) {
	if (t ||= {}, Object.keys(t).forEach(function(t) {
		if (xu.indexOf(t) === -1) throw new gu("Unknown option \"" + t + "\" is met in definition of \"" + e + "\" YAML type.");
	}), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
		return !0;
	}, this.construct = t.construct || function(e) {
		return e;
	}, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Cu(t.styleAliases || null), Su.indexOf(this.kind) === -1) throw new gu("Unknown kind \"" + this.kind + "\" is specified for \"" + e + "\" YAML type.");
}
i(wu, "Type$1");
var Tu = wu;
function Eu(e, t) {
	var n = [];
	return e[t].forEach(function(e) {
		var t = n.length;
		n.forEach(function(n, r) {
			n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
		}), n[t] = e;
	}), n;
}
i(Eu, "compileList");
function Du() {
	var e = {
		scalar: {},
		sequence: {},
		mapping: {},
		fallback: {},
		multi: {
			scalar: [],
			sequence: [],
			mapping: [],
			fallback: []
		}
	}, t, n;
	function r(t) {
		t.multi ? (e.multi[t.kind].push(t), e.multi.fallback.push(t)) : e[t.kind][t.tag] = e.fallback[t.tag] = t;
	}
	for (i(r, "collectType"), t = 0, n = arguments.length; t < n; t += 1) arguments[t].forEach(r);
	return e;
}
i(Du, "compileMap");
function Ou(e) {
	return this.extend(e);
}
i(Ou, "Schema$1"), Ou.prototype.extend = /* @__PURE__ */ i(function(e) {
	var t = [], n = [];
	if (e instanceof Tu) n.push(e);
	else if (Array.isArray(e)) n = n.concat(e);
	else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (t = t.concat(e.implicit)), e.explicit && (n = n.concat(e.explicit));
	else throw new gu("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
	t.forEach(function(e) {
		if (!(e instanceof Tu)) throw new gu("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		if (e.loadKind && e.loadKind !== "scalar") throw new gu("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
		if (e.multi) throw new gu("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
	}), n.forEach(function(e) {
		if (!(e instanceof Tu)) throw new gu("Specified list of YAML types (or a single Type object) contains a non-Type object.");
	});
	var r = Object.create(Ou.prototype);
	return r.implicit = (this.implicit || []).concat(t), r.explicit = (this.explicit || []).concat(n), r.compiledImplicit = Eu(r, "implicit"), r.compiledExplicit = Eu(r, "explicit"), r.compiledTypeMap = Du(r.compiledImplicit, r.compiledExplicit), r;
}, "extend");
var ku = new Ou({ explicit: [
	new Tu("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: /* @__PURE__ */ i(function(e) {
			return e === null ? "" : e;
		}, "construct")
	}),
	new Tu("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: /* @__PURE__ */ i(function(e) {
			return e === null ? [] : e;
		}, "construct")
	}),
	new Tu("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: /* @__PURE__ */ i(function(e) {
			return e === null ? {} : e;
		}, "construct")
	})
] });
function Au(e) {
	if (e === null) return !0;
	var t = e.length;
	return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
i(Au, "resolveYamlNull");
function ju() {
	return null;
}
i(ju, "constructYamlNull");
function Mu(e) {
	return e === null;
}
i(Mu, "isNull");
var Nu = new Tu("tag:yaml.org,2002:null", {
	kind: "scalar",
	resolve: Au,
	construct: ju,
	predicate: Mu,
	represent: {
		canonical: /* @__PURE__ */ i(function() {
			return "~";
		}, "canonical"),
		lowercase: /* @__PURE__ */ i(function() {
			return "null";
		}, "lowercase"),
		uppercase: /* @__PURE__ */ i(function() {
			return "NULL";
		}, "uppercase"),
		camelcase: /* @__PURE__ */ i(function() {
			return "Null";
		}, "camelcase"),
		empty: /* @__PURE__ */ i(function() {
			return "";
		}, "empty")
	},
	defaultStyle: "lowercase"
});
function Pu(e) {
	if (e === null) return !1;
	var t = e.length;
	return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
i(Pu, "resolveYamlBoolean");
function Fu(e) {
	return e === "true" || e === "True" || e === "TRUE";
}
i(Fu, "constructYamlBoolean");
function Iu(e) {
	return Object.prototype.toString.call(e) === "[object Boolean]";
}
i(Iu, "isBoolean");
var Lu = new Tu("tag:yaml.org,2002:bool", {
	kind: "scalar",
	resolve: Pu,
	construct: Fu,
	predicate: Iu,
	represent: {
		lowercase: /* @__PURE__ */ i(function(e) {
			return e ? "true" : "false";
		}, "lowercase"),
		uppercase: /* @__PURE__ */ i(function(e) {
			return e ? "TRUE" : "FALSE";
		}, "uppercase"),
		camelcase: /* @__PURE__ */ i(function(e) {
			return e ? "True" : "False";
		}, "camelcase")
	},
	defaultStyle: "lowercase"
});
function Ru(e) {
	return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
i(Ru, "isHexCode");
function zu(e) {
	return 48 <= e && e <= 55;
}
i(zu, "isOctCode");
function Bu(e) {
	return 48 <= e && e <= 57;
}
i(Bu, "isDecCode");
function Vu(e) {
	if (e === null) return !1;
	var t = e.length, n = 0, r = !1, i;
	if (!t) return !1;
	if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
		if (n + 1 === t) return !0;
		if (i = e[++n], i === "b") {
			for (n++; n < t; n++) if (i = e[n], i !== "_") {
				if (i !== "0" && i !== "1") return !1;
				r = !0;
			}
			return r && i !== "_";
		}
		if (i === "x") {
			for (n++; n < t; n++) if (i = e[n], i !== "_") {
				if (!Ru(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== "_";
		}
		if (i === "o") {
			for (n++; n < t; n++) if (i = e[n], i !== "_") {
				if (!zu(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== "_";
		}
	}
	if (i === "_") return !1;
	for (; n < t; n++) if (i = e[n], i !== "_") {
		if (!Bu(e.charCodeAt(n))) return !1;
		r = !0;
	}
	return !(!r || i === "_");
}
i(Vu, "resolveYamlInteger");
function Hu(e) {
	var t = e, n = 1, r;
	if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
	if (r === "0") {
		if (t[1] === "b") return n * parseInt(t.slice(2), 2);
		if (t[1] === "x") return n * parseInt(t.slice(2), 16);
		if (t[1] === "o") return n * parseInt(t.slice(2), 8);
	}
	return n * parseInt(t, 10);
}
i(Hu, "constructYamlInteger");
function Uu(e) {
	return Object.prototype.toString.call(e) === "[object Number]" && e % 1 == 0 && !pu.isNegativeZero(e);
}
i(Uu, "isInteger");
var Wu = new Tu("tag:yaml.org,2002:int", {
	kind: "scalar",
	resolve: Vu,
	construct: Hu,
	predicate: Uu,
	represent: {
		binary: /* @__PURE__ */ i(function(e) {
			return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
		}, "binary"),
		octal: /* @__PURE__ */ i(function(e) {
			return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
		}, "octal"),
		decimal: /* @__PURE__ */ i(function(e) {
			return e.toString(10);
		}, "decimal"),
		hexadecimal: /* @__PURE__ */ i(function(e) {
			return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
		}, "hexadecimal")
	},
	defaultStyle: "decimal",
	styleAliases: {
		binary: [2, "bin"],
		octal: [8, "oct"],
		decimal: [10, "dec"],
		hexadecimal: [16, "hex"]
	}
}), Gu = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Ku(e) {
	return !(e === null || !Gu.test(e) || e[e.length - 1] === "_");
}
i(Ku, "resolveYamlFloat");
function qu(e) {
	var t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1;
	return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
i(qu, "constructYamlFloat");
var Ju = /^[-+]?[0-9]+e/;
function Yu(e, t) {
	var n;
	if (isNaN(e)) switch (t) {
		case "lowercase": return ".nan";
		case "uppercase": return ".NAN";
		case "camelcase": return ".NaN";
	}
	else if (e === Infinity) switch (t) {
		case "lowercase": return ".inf";
		case "uppercase": return ".INF";
		case "camelcase": return ".Inf";
	}
	else if (e === -Infinity) switch (t) {
		case "lowercase": return "-.inf";
		case "uppercase": return "-.INF";
		case "camelcase": return "-.Inf";
	}
	else if (pu.isNegativeZero(e)) return "-0.0";
	return n = e.toString(10), Ju.test(n) ? n.replace("e", ".e") : n;
}
i(Yu, "representYamlFloat");
function Xu(e) {
	return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 != 0 || pu.isNegativeZero(e));
}
i(Xu, "isFloat");
var Zu = new Tu("tag:yaml.org,2002:float", {
	kind: "scalar",
	resolve: Ku,
	construct: qu,
	predicate: Xu,
	represent: Yu,
	defaultStyle: "lowercase"
}), Qu = ku.extend({ implicit: [
	Nu,
	Lu,
	Wu,
	Zu
] }), $u = Qu, ed = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), td = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function nd(e) {
	return e === null ? !1 : ed.exec(e) !== null || td.exec(e) !== null;
}
i(nd, "resolveYamlTimestamp");
function rd(e) {
	var t, n, r, i, a, o, s, c = 0, l = null, u, d, f;
	if (t = ed.exec(e), t === null && (t = td.exec(e)), t === null) throw Error("Date resolve error");
	if (n = +t[1], r = t[2] - 1, i = +t[3], !t[4]) return new Date(Date.UTC(n, r, i));
	if (a = +t[4], o = +t[5], s = +t[6], t[7]) {
		for (c = t[7].slice(0, 3); c.length < 3;) c += "0";
		c = +c;
	}
	return t[9] && (u = +t[10], d = +(t[11] || 0), l = (u * 60 + d) * 6e4, t[9] === "-" && (l = -l)), f = new Date(Date.UTC(n, r, i, a, o, s, c)), l && f.setTime(f.getTime() - l), f;
}
i(rd, "constructYamlTimestamp");
function id(e) {
	return e.toISOString();
}
i(id, "representYamlTimestamp");
var ad = new Tu("tag:yaml.org,2002:timestamp", {
	kind: "scalar",
	resolve: nd,
	construct: rd,
	instanceOf: Date,
	represent: id
});
function od(e) {
	return e === "<<" || e === null;
}
i(od, "resolveYamlMerge");
var sd = new Tu("tag:yaml.org,2002:merge", {
	kind: "scalar",
	resolve: od
}), cd = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function ld(e) {
	if (e === null) return !1;
	var t, n, r = 0, i = e.length, a = cd;
	for (n = 0; n < i; n++) if (t = a.indexOf(e.charAt(n)), !(t > 64)) {
		if (t < 0) return !1;
		r += 6;
	}
	return r % 8 == 0;
}
i(ld, "resolveYamlBinary");
function ud(e) {
	var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, a = cd, o = 0, s = [];
	for (t = 0; t < i; t++) t % 4 == 0 && t && (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)), o = o << 6 | a.indexOf(r.charAt(t));
	return n = i % 4 * 6, n === 0 ? (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)) : n === 18 ? (s.push(o >> 10 & 255), s.push(o >> 2 & 255)) : n === 12 && s.push(o >> 4 & 255), new Uint8Array(s);
}
i(ud, "constructYamlBinary");
function dd(e) {
	var t = "", n = 0, r, i, a = e.length, o = cd;
	for (r = 0; r < a; r++) r % 3 == 0 && r && (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]), n = (n << 8) + e[r];
	return i = a % 3, i === 0 ? (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]) : i === 2 ? (t += o[n >> 10 & 63], t += o[n >> 4 & 63], t += o[n << 2 & 63], t += o[64]) : i === 1 && (t += o[n >> 2 & 63], t += o[n << 4 & 63], t += o[64], t += o[64]), t;
}
i(dd, "representYamlBinary");
function fd(e) {
	return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
i(fd, "isBinary");
var pd = new Tu("tag:yaml.org,2002:binary", {
	kind: "scalar",
	resolve: ld,
	construct: ud,
	predicate: fd,
	represent: dd
}), md = Object.prototype.hasOwnProperty, hd = Object.prototype.toString;
function gd(e) {
	if (e === null) return !0;
	var t = [], n, r, i, a, o, s = e;
	for (n = 0, r = s.length; n < r; n += 1) {
		if (i = s[n], o = !1, hd.call(i) !== "[object Object]") return !1;
		for (a in i) if (md.call(i, a)) if (!o) o = !0;
		else return !1;
		if (!o) return !1;
		if (t.indexOf(a) === -1) t.push(a);
		else return !1;
	}
	return !0;
}
i(gd, "resolveYamlOmap");
function _d(e) {
	return e === null ? [] : e;
}
i(_d, "constructYamlOmap");
var vd = new Tu("tag:yaml.org,2002:omap", {
	kind: "sequence",
	resolve: gd,
	construct: _d
}), yd = Object.prototype.toString;
function bd(e) {
	if (e === null) return !0;
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) {
		if (r = o[t], yd.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
		a[t] = [i[0], r[i[0]]];
	}
	return !0;
}
i(bd, "resolveYamlPairs");
function xd(e) {
	if (e === null) return [];
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) r = o[t], i = Object.keys(r), a[t] = [i[0], r[i[0]]];
	return a;
}
i(xd, "constructYamlPairs");
var Sd = new Tu("tag:yaml.org,2002:pairs", {
	kind: "sequence",
	resolve: bd,
	construct: xd
}), Cd = Object.prototype.hasOwnProperty;
function wd(e) {
	if (e === null) return !0;
	var t, n = e;
	for (t in n) if (Cd.call(n, t) && n[t] !== null) return !1;
	return !0;
}
i(wd, "resolveYamlSet");
function Td(e) {
	return e === null ? {} : e;
}
i(Td, "constructYamlSet");
var Ed = new Tu("tag:yaml.org,2002:set", {
	kind: "mapping",
	resolve: wd,
	construct: Td
}), Dd = $u.extend({
	implicit: [ad, sd],
	explicit: [
		pd,
		vd,
		Sd,
		Ed
	]
}), Od = Object.prototype.hasOwnProperty, kd = 1, Ad = 2, jd = 3, Md = 4, Nd = 1, Pd = 2, Fd = 3, Id = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Ld = /[\x85\u2028\u2029]/, Rd = /[,\[\]\{\}]/, zd = /^(?:!|!!|![a-z\-]+!)$/i, Bd = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Vd(e) {
	return Object.prototype.toString.call(e);
}
i(Vd, "_class");
function Hd(e) {
	return e === 10 || e === 13;
}
i(Hd, "is_EOL");
function Ud(e) {
	return e === 9 || e === 32;
}
i(Ud, "is_WHITE_SPACE");
function Wd(e) {
	return e === 9 || e === 32 || e === 10 || e === 13;
}
i(Wd, "is_WS_OR_EOL");
function Gd(e) {
	return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
i(Gd, "is_FLOW_INDICATOR");
function Kd(e) {
	var t;
	return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
i(Kd, "fromHexCode");
function qd(e) {
	return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
i(qd, "escapedHexLen");
function Jd(e) {
	return 48 <= e && e <= 57 ? e - 48 : -1;
}
i(Jd, "fromDecimalCode");
function Yd(e) {
	return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? "\n" : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? "\"" : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? "\xA0" : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
i(Yd, "simpleEscapeSequence");
function Xd(e) {
	return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
}
i(Xd, "charFromCodepoint");
function Zd(e, t, n) {
	t === "__proto__" ? Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !0,
		writable: !0,
		value: n
	}) : e[t] = n;
}
i(Zd, "setProperty");
var Qd = Array(256), $d = Array(256);
for (ef = 0; ef < 256; ef++) Qd[ef] = +!!Yd(ef), $d[ef] = Yd(ef);
var ef;
function tf(e, t) {
	this.input = e, this.filename = t.filename || null, this.schema = t.schema || Dd, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
i(tf, "State$1");
function nf(e, t) {
	var n = {
		name: e.filename,
		buffer: e.input.slice(0, -1),
		position: e.position,
		line: e.line,
		column: e.position - e.lineStart
	};
	return n.snippet = bu(n), new gu(t, n);
}
i(nf, "generateError");
function V(e, t) {
	throw nf(e, t);
}
i(V, "throwError");
function rf(e, t) {
	e.onWarning && e.onWarning.call(null, nf(e, t));
}
i(rf, "throwWarning");
var af = {
	YAML: /* @__PURE__ */ i(function(e, t, n) {
		var r, i, a;
		e.version !== null && V(e, "duplication of %YAML directive"), n.length !== 1 && V(e, "YAML directive accepts exactly one argument"), r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), r === null && V(e, "ill-formed argument of the YAML directive"), i = parseInt(r[1], 10), a = parseInt(r[2], 10), i !== 1 && V(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && rf(e, "unsupported YAML version of the document");
	}, "handleYamlDirective"),
	TAG: /* @__PURE__ */ i(function(e, t, n) {
		var r, i;
		n.length !== 2 && V(e, "TAG directive accepts exactly two arguments"), r = n[0], i = n[1], zd.test(r) || V(e, "ill-formed tag handle (first argument) of the TAG directive"), Od.call(e.tagMap, r) && V(e, "there is a previously declared suffix for \"" + r + "\" tag handle"), Bd.test(i) || V(e, "ill-formed tag prefix (second argument) of the TAG directive");
		try {
			i = decodeURIComponent(i);
		} catch {
			V(e, "tag prefix is malformed: " + i);
		}
		e.tagMap[r] = i;
	}, "handleTagDirective")
};
function of(e, t, n, r) {
	var i, a, o, s;
	if (t < n) {
		if (s = e.input.slice(t, n), r) for (i = 0, a = s.length; i < a; i += 1) o = s.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || V(e, "expected valid JSON character");
		else Id.test(s) && V(e, "the stream contains non-printable characters");
		e.result += s;
	}
}
i(of, "captureSegment");
function sf(e, t, n, r) {
	var i, a, o, s;
	for (pu.isObject(n) || V(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), o = 0, s = i.length; o < s; o += 1) a = i[o], Od.call(t, a) || (Zd(t, a, n[a]), r[a] = !0);
}
i(sf, "mergeMappings");
function cf(e, t, n, r, i, a, o, s, c) {
	var l, u;
	if (Array.isArray(i)) for (i = Array.prototype.slice.call(i), l = 0, u = i.length; l < u; l += 1) Array.isArray(i[l]) && V(e, "nested arrays are not supported inside keys"), typeof i == "object" && Vd(i[l]) === "[object Object]" && (i[l] = "[object Object]");
	if (typeof i == "object" && Vd(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") if (Array.isArray(a)) for (l = 0, u = a.length; l < u; l += 1) sf(e, t, a[l], n);
	else sf(e, t, a, n);
	else !e.json && !Od.call(n, i) && Od.call(t, i) && (e.line = o || e.line, e.lineStart = s || e.lineStart, e.position = c || e.position, V(e, "duplicated mapping key")), Zd(t, i, a), delete n[i];
	return t;
}
i(cf, "storeMappingPair");
function lf(e) {
	var t = e.input.charCodeAt(e.position);
	t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : V(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
i(lf, "readLineBreak");
function uf(e, t, n) {
	for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0;) {
		for (; Ud(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
		if (t && i === 35) do
			i = e.input.charCodeAt(++e.position);
		while (i !== 10 && i !== 13 && i !== 0);
		if (Hd(i)) for (lf(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
		else break;
	}
	return n !== -1 && r !== 0 && e.lineIndent < n && rf(e, "deficient indentation"), r;
}
i(uf, "skipSeparationSpace");
function df(e) {
	var t = e.position, n = e.input.charCodeAt(t);
	return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Wd(n)));
}
i(df, "testDocumentSeparator");
function ff(e, t) {
	t === 1 ? e.result += " " : t > 1 && (e.result += pu.repeat("\n", t - 1));
}
i(ff, "writeFoldedLines");
function pf(e, t, n) {
	var r, i, a, o, s, c, l, u, d = e.kind, f = e.result, p = e.input.charCodeAt(e.position);
	if (Wd(p) || Gd(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), Wd(i) || n && Gd(i))) return !1;
	for (e.kind = "scalar", e.result = "", a = o = e.position, s = !1; p !== 0;) {
		if (p === 58) {
			if (i = e.input.charCodeAt(e.position + 1), Wd(i) || n && Gd(i)) break;
		} else if (p === 35) {
			if (r = e.input.charCodeAt(e.position - 1), Wd(r)) break;
		} else if (e.position === e.lineStart && df(e) || n && Gd(p)) break;
		else if (Hd(p)) if (c = e.line, l = e.lineStart, u = e.lineIndent, uf(e, !1, -1), e.lineIndent >= t) {
			s = !0, p = e.input.charCodeAt(e.position);
			continue;
		} else {
			e.position = o, e.line = c, e.lineStart = l, e.lineIndent = u;
			break;
		}
		s &&= (of(e, a, o, !1), ff(e, e.line - c), a = o = e.position, !1), Ud(p) || (o = e.position + 1), p = e.input.charCodeAt(++e.position);
	}
	return of(e, a, o, !1), e.result ? !0 : (e.kind = d, e.result = f, !1);
}
i(pf, "readPlainScalar");
function mf(e, t) {
	var n = e.input.charCodeAt(e.position), r, i;
	if (n !== 39) return !1;
	for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0;) if (n === 39) if (of(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39) r = e.position, e.position++, i = e.position;
	else return !0;
	else Hd(n) ? (of(e, r, i, !0), ff(e, uf(e, !1, t)), r = i = e.position) : e.position === e.lineStart && df(e) ? V(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
	V(e, "unexpected end of the stream within a single quoted scalar");
}
i(mf, "readSingleQuotedScalar");
function hf(e, t) {
	var n, r, i, a, o, s = e.input.charCodeAt(e.position);
	if (s !== 34) return !1;
	for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0;) if (s === 34) return of(e, n, e.position, !0), e.position++, !0;
	else if (s === 92) {
		if (of(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), Hd(s)) uf(e, !1, t);
		else if (s < 256 && Qd[s]) e.result += $d[s], e.position++;
		else if ((o = qd(s)) > 0) {
			for (i = o, a = 0; i > 0; i--) s = e.input.charCodeAt(++e.position), (o = Kd(s)) >= 0 ? a = (a << 4) + o : V(e, "expected hexadecimal character");
			e.result += Xd(a), e.position++;
		} else V(e, "unknown escape sequence");
		n = r = e.position;
	} else Hd(s) ? (of(e, n, r, !0), ff(e, uf(e, !1, t)), n = r = e.position) : e.position === e.lineStart && df(e) ? V(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
	V(e, "unexpected end of the stream within a double quoted scalar");
}
i(hf, "readDoubleQuotedScalar");
function gf(e, t) {
	var n = !0, r, i, a, o = e.tag, s, c = e.anchor, l, u, d, f, p, m = /* @__PURE__ */ Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
	if (v === 91) u = 93, p = !1, s = [];
	else if (v === 123) u = 125, p = !0, s = {};
	else return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = s), v = e.input.charCodeAt(++e.position); v !== 0;) {
		if (uf(e, !0, t), v = e.input.charCodeAt(e.position), v === u) return e.position++, e.tag = o, e.anchor = c, e.kind = p ? "mapping" : "sequence", e.result = s, !0;
		n ? v === 44 && V(e, "expected the node content, but found ','") : V(e, "missed comma between flow collection entries"), g = h = _ = null, d = f = !1, v === 63 && (l = e.input.charCodeAt(e.position + 1), Wd(l) && (d = f = !0, e.position++, uf(e, !0, t))), r = e.line, i = e.lineStart, a = e.position, Cf(e, t, kd, !1, !0), g = e.tag, h = e.result, uf(e, !0, t), v = e.input.charCodeAt(e.position), (f || e.line === r) && v === 58 && (d = !0, v = e.input.charCodeAt(++e.position), uf(e, !0, t), Cf(e, t, kd, !1, !0), _ = e.result), p ? cf(e, s, m, g, h, _, r, i, a) : d ? s.push(cf(e, null, m, g, h, _, r, i, a)) : s.push(h), uf(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
	}
	V(e, "unexpected end of the stream within a flow collection");
}
i(gf, "readFlowCollection");
function _f(e, t) {
	var n, r, i = Nd, a = !1, o = !1, s = t, c = 0, l = !1, u, d = e.input.charCodeAt(e.position);
	if (d === 124) r = !1;
	else if (d === 62) r = !0;
	else return !1;
	for (e.kind = "scalar", e.result = ""; d !== 0;) if (d = e.input.charCodeAt(++e.position), d === 43 || d === 45) Nd === i ? i = d === 43 ? Fd : Pd : V(e, "repeat of a chomping mode identifier");
	else if ((u = Jd(d)) >= 0) u === 0 ? V(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? V(e, "repeat of an indentation width identifier") : (s = t + u - 1, o = !0);
	else break;
	if (Ud(d)) {
		do
			d = e.input.charCodeAt(++e.position);
		while (Ud(d));
		if (d === 35) do
			d = e.input.charCodeAt(++e.position);
		while (!Hd(d) && d !== 0);
	}
	for (; d !== 0;) {
		for (lf(e), e.lineIndent = 0, d = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && d === 32;) e.lineIndent++, d = e.input.charCodeAt(++e.position);
		if (!o && e.lineIndent > s && (s = e.lineIndent), Hd(d)) {
			c++;
			continue;
		}
		if (e.lineIndent < s) {
			i === Fd ? e.result += pu.repeat("\n", a ? 1 + c : c) : i === Nd && a && (e.result += "\n");
			break;
		}
		for (r ? Ud(d) ? (l = !0, e.result += pu.repeat("\n", a ? 1 + c : c)) : l ? (l = !1, e.result += pu.repeat("\n", c + 1)) : c === 0 ? a && (e.result += " ") : e.result += pu.repeat("\n", c) : e.result += pu.repeat("\n", a ? 1 + c : c), a = !0, o = !0, c = 0, n = e.position; !Hd(d) && d !== 0;) d = e.input.charCodeAt(++e.position);
		of(e, n, e.position, !1);
	}
	return !0;
}
i(_f, "readBlockScalar");
function vf(e, t) {
	var n, r = e.tag, i = e.anchor, a = [], o, s = !1, c;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, V(e, "tab characters must not be used in indentation")), !(c !== 45 || (o = e.input.charCodeAt(e.position + 1), !Wd(o))));) {
		if (s = !0, e.position++, uf(e, !0, -1) && e.lineIndent <= t) {
			a.push(null), c = e.input.charCodeAt(e.position);
			continue;
		}
		if (n = e.line, Cf(e, t, jd, !1, !0), a.push(e.result), uf(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0) V(e, "bad indentation of a sequence entry");
		else if (e.lineIndent < t) break;
	}
	return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
i(vf, "readBlockSequence");
function yf(e, t, n) {
	var r, i, a, o, s, c, l = e.tag, u = e.anchor, d = {}, f = /* @__PURE__ */ Object.create(null), p = null, m = null, h = null, g = !1, _ = !1, v;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = d), v = e.input.charCodeAt(e.position); v !== 0;) {
		if (!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, V(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), a = e.line, (v === 63 || v === 58) && Wd(r)) v === 63 ? (g && (cf(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !0, i = !0) : g ? (g = !1, i = !0) : V(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, v = r;
		else {
			if (o = e.line, s = e.lineStart, c = e.position, !Cf(e, n, Ad, !1, !0)) break;
			if (e.line === a) {
				for (v = e.input.charCodeAt(e.position); Ud(v);) v = e.input.charCodeAt(++e.position);
				if (v === 58) v = e.input.charCodeAt(++e.position), Wd(v) || V(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (cf(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !1, i = !1, p = e.tag, m = e.result;
				else if (_) V(e, "can not read an implicit mapping pair; a colon is missed");
				else return e.tag = l, e.anchor = u, !0;
			} else if (_) V(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
			else return e.tag = l, e.anchor = u, !0;
		}
		if ((e.line === a || e.lineIndent > t) && (g && (o = e.line, s = e.lineStart, c = e.position), Cf(e, t, Md, !0, i) && (g ? m = e.result : h = e.result), g || (cf(e, d, f, p, m, h, o, s, c), p = m = h = null), uf(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && v !== 0) V(e, "bad indentation of a mapping entry");
		else if (e.lineIndent < t) break;
	}
	return g && cf(e, d, f, p, m, null, o, s, c), _ && (e.tag = l, e.anchor = u, e.kind = "mapping", e.result = d), _;
}
i(yf, "readBlockMapping");
function bf(e) {
	var t, n = !1, r = !1, i, a, o = e.input.charCodeAt(e.position);
	if (o !== 33) return !1;
	if (e.tag !== null && V(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (n = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (r = !0, i = "!!", o = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
		do
			o = e.input.charCodeAt(++e.position);
		while (o !== 0 && o !== 62);
		e.position < e.length ? (a = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : V(e, "unexpected end of the stream within a verbatim tag");
	} else {
		for (; o !== 0 && !Wd(o);) o === 33 && (r ? V(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), zd.test(i) || V(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
		a = e.input.slice(t, e.position), Rd.test(a) && V(e, "tag suffix cannot contain flow indicator characters");
	}
	a && !Bd.test(a) && V(e, "tag name cannot contain such characters: " + a);
	try {
		a = decodeURIComponent(a);
	} catch {
		V(e, "tag name is malformed: " + a);
	}
	return n ? e.tag = a : Od.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : V(e, "undeclared tag handle \"" + i + "\""), !0;
}
i(bf, "readTagProperty");
function xf(e) {
	var t, n = e.input.charCodeAt(e.position);
	if (n !== 38) return !1;
	for (e.anchor !== null && V(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Wd(n) && !Gd(n);) n = e.input.charCodeAt(++e.position);
	return e.position === t && V(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
i(xf, "readAnchorProperty");
function Sf(e) {
	var t, n, r = e.input.charCodeAt(e.position);
	if (r !== 42) return !1;
	for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Wd(r) && !Gd(r);) r = e.input.charCodeAt(++e.position);
	return e.position === t && V(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), Od.call(e.anchorMap, n) || V(e, "unidentified alias \"" + n + "\""), e.result = e.anchorMap[n], uf(e, !0, -1), !0;
}
i(Sf, "readAlias");
function Cf(e, t, n, r, i) {
	var a, o, s, c = 1, l = !1, u = !1, d, f, p, m, h, g;
	if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = o = s = Md === n || jd === n, r && uf(e, !0, -1) && (l = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1) for (; bf(e) || xf(e);) uf(e, !0, -1) ? (l = !0, s = a, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : s = !1;
	if (s &&= l || i, (c === 1 || Md === n) && (h = kd === n || Ad === n ? t : t + 1, g = e.position - e.lineStart, c === 1 ? s && (vf(e, g) || yf(e, g, h)) || gf(e, h) ? u = !0 : (o && _f(e, h) || mf(e, h) || hf(e, h) ? u = !0 : Sf(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && V(e, "alias node should not have any properties")) : pf(e, h, kd === n) && (u = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (u = s && vf(e, g))), e.tag === null) e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
	else if (e.tag === "?") {
		for (e.result !== null && e.kind !== "scalar" && V(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\""), d = 0, f = e.implicitTypes.length; d < f; d += 1) if (m = e.implicitTypes[d], m.resolve(e.result)) {
			e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
			break;
		}
	} else if (e.tag !== "!") {
		if (Od.call(e.typeMap[e.kind || "fallback"], e.tag)) m = e.typeMap[e.kind || "fallback"][e.tag];
		else for (m = null, p = e.typeMap.multi[e.kind || "fallback"], d = 0, f = p.length; d < f; d += 1) if (e.tag.slice(0, p[d].tag.length) === p[d].tag) {
			m = p[d];
			break;
		}
		m || V(e, "unknown tag !<" + e.tag + ">"), e.result !== null && m.kind !== e.kind && V(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + m.kind + "\", not \"" + e.kind + "\""), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : V(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
	}
	return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || u;
}
i(Cf, "composeNode");
function wf(e) {
	var t = e.position, n, r, i, a = !1, o;
	for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (uf(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37));) {
		for (a = !0, o = e.input.charCodeAt(++e.position), n = e.position; o !== 0 && !Wd(o);) o = e.input.charCodeAt(++e.position);
		for (r = e.input.slice(n, e.position), i = [], r.length < 1 && V(e, "directive name must not be less than one character in length"); o !== 0;) {
			for (; Ud(o);) o = e.input.charCodeAt(++e.position);
			if (o === 35) {
				do
					o = e.input.charCodeAt(++e.position);
				while (o !== 0 && !Hd(o));
				break;
			}
			if (Hd(o)) break;
			for (n = e.position; o !== 0 && !Wd(o);) o = e.input.charCodeAt(++e.position);
			i.push(e.input.slice(n, e.position));
		}
		o !== 0 && lf(e), Od.call(af, r) ? af[r](e, r, i) : rf(e, "unknown document directive \"" + r + "\"");
	}
	if (uf(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, uf(e, !0, -1)) : a && V(e, "directives end mark is expected"), Cf(e, e.lineIndent - 1, Md, !1, !0), uf(e, !0, -1), e.checkLineBreaks && Ld.test(e.input.slice(t, e.position)) && rf(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && df(e)) {
		e.input.charCodeAt(e.position) === 46 && (e.position += 3, uf(e, !0, -1));
		return;
	}
	if (e.position < e.length - 1) V(e, "end of the stream or a document separator is expected");
	else return;
}
i(wf, "readDocument");
function Tf(e, t) {
	e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
	var n = new tf(e, t), r = e.indexOf("\0");
	for (r !== -1 && (n.position = r, V(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
	for (; n.position < n.length - 1;) wf(n);
	return n.documents;
}
i(Tf, "loadDocuments");
function Ef(e, t, n) {
	typeof t == "object" && t && n === void 0 && (n = t, t = null);
	var r = Tf(e, n);
	if (typeof t != "function") return r;
	for (var i = 0, a = r.length; i < a; i += 1) t(r[i]);
}
i(Ef, "loadAll$1");
function Df(e, t) {
	var n = Tf(e, t);
	if (n.length !== 0) {
		if (n.length === 1) return n[0];
		throw new gu("expected a single document in the stream, but found more");
	}
}
i(Df, "load$1");
var Of = {
	loadAll: Ef,
	load: Df
}, kf = Object.prototype.toString, Af = Object.prototype.hasOwnProperty, jf = 65279, Mf = 9, Nf = 10, Pf = 13, Ff = 32, If = 33, Lf = 34, Rf = 35, zf = 37, Bf = 38, Vf = 39, Hf = 42, Uf = 44, Wf = 45, Gf = 58, Kf = 61, qf = 62, Jf = 63, Yf = 64, Xf = 91, Zf = 93, Qf = 96, $f = 123, ep = 124, tp = 125, np = {};
np[0] = "\\0", np[7] = "\\a", np[8] = "\\b", np[9] = "\\t", np[10] = "\\n", np[11] = "\\v", np[12] = "\\f", np[13] = "\\r", np[27] = "\\e", np[34] = "\\\"", np[92] = "\\\\", np[133] = "\\N", np[160] = "\\_", np[8232] = "\\L", np[8233] = "\\P";
var rp = [
	"y",
	"Y",
	"yes",
	"Yes",
	"YES",
	"on",
	"On",
	"ON",
	"n",
	"N",
	"no",
	"No",
	"NO",
	"off",
	"Off",
	"OFF"
], ip = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function ap(e, t) {
	var n, r, i, a, o, s, c;
	if (t === null) return {};
	for (n = {}, r = Object.keys(t), i = 0, a = r.length; i < a; i += 1) o = r[i], s = String(t[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), c = e.compiledTypeMap.fallback[o], c && Af.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[o] = s;
	return n;
}
i(ap, "compileStyleMap");
function op(e) {
	var t = e.toString(16).toUpperCase(), n, r;
	if (e <= 255) n = "x", r = 2;
	else if (e <= 65535) n = "u", r = 4;
	else if (e <= 4294967295) n = "U", r = 8;
	else throw new gu("code point within a string may not be greater than 0xFFFFFFFF");
	return "\\" + n + pu.repeat("0", r - t.length) + t;
}
i(op, "encodeHex");
var sp = 1, cp = 2;
function lp(e) {
	this.schema = e.schema || Dd, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = pu.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = ap(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === "\"" ? cp : sp, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
i(lp, "State");
function up(e, t) {
	for (var n = pu.repeat(" ", t), r = 0, i = -1, a = "", o, s = e.length; r < s;) i = e.indexOf("\n", r), i === -1 ? (o = e.slice(r), r = s) : (o = e.slice(r, i + 1), r = i + 1), o.length && o !== "\n" && (a += n), a += o;
	return a;
}
i(up, "indentString");
function dp(e, t) {
	return "\n" + pu.repeat(" ", e.indent * t);
}
i(dp, "generateNextLine");
function fp(e, t) {
	var n, r, i;
	for (n = 0, r = e.implicitTypes.length; n < r; n += 1) if (i = e.implicitTypes[n], i.resolve(t)) return !0;
	return !1;
}
i(fp, "testImplicitResolving");
function pp(e) {
	return e === Ff || e === Mf;
}
i(pp, "isWhitespace");
function mp(e) {
	return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== jf || 65536 <= e && e <= 1114111;
}
i(mp, "isPrintable");
function hp(e) {
	return mp(e) && e !== jf && e !== Pf && e !== Nf;
}
i(hp, "isNsCharOrWhitespace");
function gp(e, t, n) {
	var r = hp(e), i = r && !pp(e);
	return (n ? r : r && e !== Uf && e !== Xf && e !== Zf && e !== $f && e !== tp) && e !== Rf && !(t === Gf && !i) || hp(t) && !pp(t) && e === Rf || t === Gf && i;
}
i(gp, "isPlainSafe");
function _p(e) {
	return mp(e) && e !== jf && !pp(e) && e !== Wf && e !== Jf && e !== Gf && e !== Uf && e !== Xf && e !== Zf && e !== $f && e !== tp && e !== Rf && e !== Bf && e !== Hf && e !== If && e !== ep && e !== Kf && e !== qf && e !== Vf && e !== Lf && e !== zf && e !== Yf && e !== Qf;
}
i(_p, "isPlainSafeFirst");
function vp(e) {
	return !pp(e) && e !== Gf;
}
i(vp, "isPlainSafeLast");
function yp(e, t) {
	var n = e.charCodeAt(t), r;
	return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
i(yp, "codePointAt");
function bp(e) {
	return /^\n* /.test(e);
}
i(bp, "needIndentIndicator");
var xp = 1, Sp = 2, Cp = 3, wp = 4, Tp = 5;
function Ep(e, t, n, r, i, a, o, s) {
	var c, l = 0, u = null, d = !1, f = !1, p = r !== -1, m = -1, h = _p(yp(e, 0)) && vp(yp(e, e.length - 1));
	if (t || o) for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
		if (l = yp(e, c), !mp(l)) return Tp;
		h &&= gp(l, u, s), u = l;
	}
	else {
		for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
			if (l = yp(e, c), l === Nf) d = !0, p && (f ||= c - m - 1 > r && e[m + 1] !== " ", m = c);
			else if (!mp(l)) return Tp;
			h &&= gp(l, u, s), u = l;
		}
		f ||= p && c - m - 1 > r && e[m + 1] !== " ";
	}
	return !d && !f ? h && !o && !i(e) ? xp : a === cp ? Tp : Sp : n > 9 && bp(e) ? Tp : o ? a === cp ? Tp : Sp : f ? wp : Cp;
}
i(Ep, "chooseScalarStyle");
function Dp(e, t, n, r, a) {
	e.dump = (function() {
		if (t.length === 0) return e.quotingType === cp ? "\"\"" : "''";
		if (!e.noCompatMode && (rp.indexOf(t) !== -1 || ip.test(t))) return e.quotingType === cp ? "\"" + t + "\"" : "'" + t + "'";
		var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), c = r || e.flowLevel > -1 && n >= e.flowLevel;
		function l(t) {
			return fp(e, t);
		}
		switch (i(l, "testAmbiguity"), Ep(t, c, e.indent, s, l, e.quotingType, e.forceQuotes && !r, a)) {
			case xp: return t;
			case Sp: return "'" + t.replace(/'/g, "''") + "'";
			case Cp: return "|" + Op(t, e.indent) + kp(up(t, o));
			case wp: return ">" + Op(t, e.indent) + kp(up(Ap(t, s), o));
			case Tp: return "\"" + Mp(t) + "\"";
			default: throw new gu("impossible error: invalid scalar style");
		}
	})();
}
i(Dp, "writeScalar");
function Op(e, t) {
	var n = bp(e) ? String(t) : "", r = e[e.length - 1] === "\n";
	return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
}
i(Op, "blockHeader");
function kp(e) {
	return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
}
i(kp, "dropEndingNewline");
function Ap(e, t) {
	for (var n = /(\n+)([^\n]*)/g, r = (function() {
		var r = e.indexOf("\n");
		return r = r === -1 ? e.length : r, n.lastIndex = r, jp(e.slice(0, r), t);
	})(), i = e[0] === "\n" || e[0] === " ", a, o; o = n.exec(e);) {
		var s = o[1], c = o[2];
		a = c[0] === " ", r += s + (!i && !a && c !== "" ? "\n" : "") + jp(c, t), i = a;
	}
	return r;
}
i(Ap, "foldString");
function jp(e, t) {
	if (e === "" || e[0] === " ") return e;
	for (var n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = ""; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
	return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
}
i(jp, "foldLine");
function Mp(e) {
	for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++) n = yp(e, i), r = np[n], !r && mp(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || op(n);
	return t;
}
i(Mp, "escapeString");
function Np(e, t, n) {
	var r = "", i = e.tag, a, o, s;
	for (a = 0, o = n.length; a < o; a += 1) s = n[a], e.replacer && (s = e.replacer.call(n, String(a), s)), (Rp(e, t, s, !1, !1) || s === void 0 && Rp(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
	e.tag = i, e.dump = "[" + r + "]";
}
i(Np, "writeFlowSequence");
function Pp(e, t, n, r) {
	var i = "", a = e.tag, o, s, c;
	for (o = 0, s = n.length; o < s; o += 1) c = n[o], e.replacer && (c = e.replacer.call(n, String(o), c)), (Rp(e, t + 1, c, !0, !0, !1, !0) || c === void 0 && Rp(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += dp(e, t)), e.dump && Nf === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
	e.tag = a, e.dump = i || "[]";
}
i(Pp, "writeBlockSequence");
function Fp(e, t, n) {
	var r = "", i = e.tag, a = Object.keys(n), o, s, c, l, u;
	for (o = 0, s = a.length; o < s; o += 1) u = "", r !== "" && (u += ", "), e.condenseFlow && (u += "\""), c = a[o], l = n[c], e.replacer && (l = e.replacer.call(n, c, l)), Rp(e, t, c, !1, !1) && (e.dump.length > 1024 && (u += "? "), u += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), Rp(e, t, l, !1, !1) && (u += e.dump, r += u));
	e.tag = i, e.dump = "{" + r + "}";
}
i(Fp, "writeFlowMapping");
function Ip(e, t, n, r) {
	var i = "", a = e.tag, o = Object.keys(n), s, c, l, u, d, f;
	if (e.sortKeys === !0) o.sort();
	else if (typeof e.sortKeys == "function") o.sort(e.sortKeys);
	else if (e.sortKeys) throw new gu("sortKeys must be a boolean or a function");
	for (s = 0, c = o.length; s < c; s += 1) f = "", (!r || i !== "") && (f += dp(e, t)), l = o[s], u = n[l], e.replacer && (u = e.replacer.call(n, l, u)), Rp(e, t + 1, l, !0, !0, !0) && (d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, d && (e.dump && Nf === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, d && (f += dp(e, t)), Rp(e, t + 1, u, !0, d) && (e.dump && Nf === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, i += f));
	e.tag = a, e.dump = i || "{}";
}
i(Ip, "writeBlockMapping");
function Lp(e, t, n) {
	var r, i = n ? e.explicitTypes : e.implicitTypes, a, o, s, c;
	for (a = 0, o = i.length; a < o; a += 1) if (s = i[a], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
		if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
			if (c = e.styleMap[s.tag] || s.defaultStyle, kf.call(s.represent) === "[object Function]") r = s.represent(t, c);
			else if (Af.call(s.represent, c)) r = s.represent[c](t, c);
			else throw new gu("!<" + s.tag + "> tag resolver accepts not \"" + c + "\" style");
			e.dump = r;
		}
		return !0;
	}
	return !1;
}
i(Lp, "detectType");
function Rp(e, t, n, r, i, a, o) {
	e.tag = null, e.dump = n, Lp(e, n, !1) || Lp(e, n, !0);
	var s = kf.call(e.dump), c = r, l;
	r &&= e.flowLevel < 0 || e.flowLevel > t;
	var u = s === "[object Object]" || s === "[object Array]", d, f;
	if (u && (d = e.duplicates.indexOf(n), f = d !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && t > 0) && (i = !1), f && e.usedDuplicates[d]) e.dump = "*ref_" + d;
	else {
		if (u && f && !e.usedDuplicates[d] && (e.usedDuplicates[d] = !0), s === "[object Object]") r && Object.keys(e.dump).length !== 0 ? (Ip(e, t, e.dump, i), f && (e.dump = "&ref_" + d + e.dump)) : (Fp(e, t, e.dump), f && (e.dump = "&ref_" + d + " " + e.dump));
		else if (s === "[object Array]") r && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? Pp(e, t - 1, e.dump, i) : Pp(e, t, e.dump, i), f && (e.dump = "&ref_" + d + e.dump)) : (Np(e, t, e.dump), f && (e.dump = "&ref_" + d + " " + e.dump));
		else if (s === "[object String]") e.tag !== "?" && Dp(e, e.dump, t, a, c);
		else if (s === "[object Undefined]") return !1;
		else {
			if (e.skipInvalid) return !1;
			throw new gu("unacceptable kind of an object to dump " + s);
		}
		e.tag !== null && e.tag !== "?" && (l = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21"), l = e.tag[0] === "!" ? "!" + l : l.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + l.slice(18) : "!<" + l + ">", e.dump = l + " " + e.dump);
	}
	return !0;
}
i(Rp, "writeNode");
function zp(e, t) {
	var n = [], r = [], i, a;
	for (Bp(e, n, r), i = 0, a = r.length; i < a; i += 1) t.duplicates.push(n[r[i]]);
	t.usedDuplicates = Array(a);
}
i(zp, "getDuplicateReferences");
function Bp(e, t, n) {
	var r, i, a;
	if (typeof e == "object" && e) if (i = t.indexOf(e), i !== -1) n.indexOf(i) === -1 && n.push(i);
	else if (t.push(e), Array.isArray(e)) for (i = 0, a = e.length; i < a; i += 1) Bp(e[i], t, n);
	else for (r = Object.keys(e), i = 0, a = r.length; i < a; i += 1) Bp(e[r[i]], t, n);
}
i(Bp, "inspectNode");
function Vp(e, t) {
	t ||= {};
	var n = new lp(t);
	n.noRefs || zp(e, n);
	var r = e;
	return n.replacer && (r = n.replacer.call({ "": r }, "", r)), Rp(n, 0, r, !0, !0) ? n.dump + "\n" : "";
}
i(Vp, "dump$1");
var Hp = { dump: Vp };
function Up(e, t) {
	return function() {
		throw Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
	};
}
i(Up, "renamed");
var Wp = Qu, Gp = Of.load;
Of.loadAll, Hp.dump;
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-W5SLKNZC.mjs
var Kp = /* @__PURE__ */ i((e) => {
	let { handDrawnSeed: t } = z();
	return {
		fill: e,
		hachureAngle: 120,
		hachureGap: 4,
		fillWeight: 2,
		roughness: .7,
		stroke: e,
		seed: t
	};
}, "solidStateFill"), qp = /* @__PURE__ */ i((e) => {
	let t = Jp([
		...e.cssCompiledStyles || [],
		...e.cssStyles || [],
		...e.labelStyle || []
	]);
	return {
		stylesMap: t,
		stylesArray: [...t]
	};
}, "compileStyles"), Jp = /* @__PURE__ */ i((e) => {
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let [n, r] = e.split(":");
		t.set(n.trim(), r?.trim());
	}), t;
}, "styles2Map"), Yp = /* @__PURE__ */ i((e) => e === "color" || e === "font-size" || e === "font-family" || e === "font-weight" || e === "font-style" || e === "text-decoration" || e === "text-align" || e === "text-transform" || e === "line-height" || e === "letter-spacing" || e === "word-spacing" || e === "text-shadow" || e === "text-overflow" || e === "white-space" || e === "word-wrap" || e === "word-break" || e === "overflow-wrap" || e === "hyphens", "isLabelStyle"), H = /* @__PURE__ */ i((e) => {
	let { stylesArray: t } = qp(e), n = [], r = [], i = [], a = [];
	return t.forEach((e) => {
		let t = e[0];
		Yp(t) ? n.push(e.join(":") + " !important") : (r.push(e.join(":") + " !important"), t.includes("stroke") && i.push(e.join(":") + " !important"), t === "fill" && a.push(e.join(":") + " !important"));
	}), {
		labelStyles: n.join(";"),
		nodeStyles: r.join(";"),
		stylesArray: t,
		borderStyles: i,
		backgroundStyles: a
	};
}, "styles2String"), U = /* @__PURE__ */ i((e, t) => {
	let { themeVariables: n, handDrawnSeed: r } = z(), { nodeBorder: i, mainBkg: a } = n, { stylesMap: o } = qp(e);
	return Object.assign({
		roughness: .7,
		fill: o.get("fill") || a,
		fillStyle: "hachure",
		fillWeight: 4,
		hachureGap: 5.2,
		stroke: o.get("stroke") || i,
		seed: r,
		strokeWidth: o.get("stroke-width")?.replace("px", "") || 1.3,
		fillLineDash: [0, 0],
		strokeLineDash: Xp(o.get("stroke-dasharray"))
	}, t);
}, "userNodeOverrides"), Xp = /* @__PURE__ */ i((e) => {
	if (!e) return [0, 0];
	let t = e.trim().split(/\s+/).map(Number);
	if (t.length === 1) {
		let e = isNaN(t[0]) ? 0 : t[0];
		return [e, e];
	}
	return [isNaN(t[0]) ? 0 : t[0], isNaN(t[1]) ? 0 : t[1]];
}, "getStrokeDashArray");
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/predicate/isLength.mjs
function Zp(e) {
	return Number.isSafeInteger(e) && e >= 0;
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/predicate/isArrayLike.mjs
function Qp(e) {
	return e != null && typeof e != "function" && Zp(e.length);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs
function $p(e) {
	return e === "__proto__";
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
function em(e) {
	return e == null || typeof e != "object" && typeof e != "function";
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function tm(e) {
	return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function nm(e) {
	return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var rm = "[object RegExp]", im = "[object String]", am = "[object Number]", om = "[object Boolean]", sm = "[object Arguments]", cm = "[object Symbol]", lm = "[object Date]", um = "[object Map]", dm = "[object Set]", fm = "[object Array]", pm = "[object ArrayBuffer]", mm = "[object Object]", hm = "[object DataView]", gm = "[object Uint8Array]", _m = "[object Uint8ClampedArray]", vm = "[object Uint16Array]", ym = "[object Uint32Array]", bm = "[object Int8Array]", xm = "[object Int16Array]", Sm = "[object Int32Array]", Cm = "[object Float32Array]", wm = "[object Float64Array]", Tm = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || (function() {
	return this;
})() || Function("return this")();
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/predicate/isBuffer.mjs
function Em(e) {
	return Tm.Buffer !== void 0 && Tm.Buffer.isBuffer(e);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/predicate/isTypedArray.mjs
function Dm(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/object/cloneDeepWith.mjs
function Om(e, t) {
	return km(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function km(e, t, n, r = /* @__PURE__ */ new Map(), i = void 0) {
	let a = i?.(e, t, n, r);
	if (a !== void 0) return a;
	if (em(e)) return e;
	if (r.has(e)) return r.get(e);
	if (Array.isArray(e)) {
		let t = Array(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = km(e[a], a, n, r, i);
		return Object.hasOwn(e, "index") && (t.index = e.index), Object.hasOwn(e, "input") && (t.input = e.input), t;
	}
	if (e instanceof Date) return new Date(e.getTime());
	if (e instanceof RegExp) {
		let t = new RegExp(e.source, e.flags);
		return t.lastIndex = e.lastIndex, t;
	}
	if (e instanceof Map) {
		let t = /* @__PURE__ */ new Map();
		r.set(e, t);
		for (let [a, o] of e) t.set(a, km(o, a, n, r, i));
		return t;
	}
	if (e instanceof Set) {
		let t = /* @__PURE__ */ new Set();
		r.set(e, t);
		for (let a of e) t.add(km(a, void 0, n, r, i));
		return t;
	}
	if (Em(e)) return e.subarray();
	if (Dm(e)) {
		let t = new (Object.getPrototypeOf(e)).constructor(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = km(e[a], a, n, r, i);
		return t;
	}
	if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
	if (e instanceof DataView) {
		let t = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
		return r.set(e, t), Am(t, e, n, r, i), t;
	}
	if (typeof File < "u" && e instanceof File) {
		let t = new File([e], e.name, { type: e.type });
		return r.set(e, t), Am(t, e, n, r, i), t;
	}
	if (typeof Blob < "u" && e instanceof Blob) {
		let t = new Blob([e], { type: e.type });
		return r.set(e, t), Am(t, e, n, r, i), t;
	}
	if (e instanceof Error) {
		let t = structuredClone(e);
		return r.set(e, t), t.message = e.message, t.name = e.name, t.stack = e.stack, t.cause = e.cause, t.constructor = e.constructor, Am(t, e, n, r, i), t;
	}
	if (e instanceof Boolean) {
		let t = new Boolean(e.valueOf());
		return r.set(e, t), Am(t, e, n, r, i), t;
	}
	if (e instanceof Number) {
		let t = new Number(e.valueOf());
		return r.set(e, t), Am(t, e, n, r, i), t;
	}
	if (e instanceof String) {
		let t = new String(e.valueOf());
		return r.set(e, t), Am(t, e, n, r, i), t;
	}
	if (typeof e == "object" && jm(e)) {
		let t = Object.create(Object.getPrototypeOf(e));
		return r.set(e, t), Am(t, e, n, r, i), t;
	}
	return e;
}
function Am(e, t, n = e, r, i) {
	let a = [...Object.keys(t), ...tm(t)];
	for (let o = 0; o < a.length; o++) {
		let s = a[o], c = Object.getOwnPropertyDescriptor(e, s);
		(c == null || c.writable) && (e[s] = km(t[s], s, n, r, i));
	}
}
function jm(e) {
	switch (nm(e)) {
		case sm:
		case fm:
		case pm:
		case hm:
		case om:
		case lm:
		case Cm:
		case wm:
		case bm:
		case xm:
		case Sm:
		case um:
		case am:
		case mm:
		case rm:
		case dm:
		case im:
		case cm:
		case gm:
		case _m:
		case vm:
		case ym: return !0;
		default: return !1;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/object/cloneDeepWith.mjs
function Mm(e, t) {
	return Om(e, (n, r, i, a) => {
		let o = t?.(n, r, i, a);
		if (o !== void 0) return o;
		if (typeof e == "object") {
			if (nm(e) === "[object Object]" && typeof e.constructor != "function") {
				let t = {};
				return a.set(e, t), Am(t, e, i, a), t;
			}
			switch (Object.prototype.toString.call(e)) {
				case am:
				case im:
				case om: {
					let t = new e.constructor(e?.valueOf());
					return Am(t, e), t;
				}
				case sm: {
					let t = {};
					return Am(t, e), t.length = e.length, t[Symbol.iterator] = e[Symbol.iterator], t;
				}
				default: return;
			}
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/object/cloneDeep.mjs
function Nm(e) {
	return Mm(e);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/predicate/isArguments.mjs
function Pm(e) {
	return typeof e == "object" && !!e && nm(e) === "[object Arguments]";
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/predicate/isObjectLike.mjs
function Fm(e) {
	return typeof e == "object" && !!e;
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/predicate/isArrayLikeObject.mjs
function Im(e) {
	return Fm(e) && Qp(e);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/function/memoize.mjs
function Lm(e, t) {
	if (typeof e != "function" || t != null && typeof t != "function") throw TypeError("Expected a function");
	let n = function(...r) {
		let i = t ? t.apply(this, r) : r[0], a = n.cache;
		if (a.has(i)) return a.get(i);
		let o = e.apply(this, r);
		return n.cache = a.set(i, o) || a, o;
	};
	return n.cache = new (Lm.Cache || Map)(), n;
}
Lm.Cache = Map;
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/function/noop.mjs
function Rm() {}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/predicate/isTypedArray.mjs
function zm(e) {
	return Dm(e);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs
function Bm(e) {
	if (typeof e != "object" || !e) return !1;
	if (Object.getPrototypeOf(e) === null) return !0;
	if (Object.prototype.toString.call(e) !== "[object Object]") {
		let t = e[Symbol.toStringTag];
		return t == null || !Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)?.writable ? !1 : e.toString() === `[object ${t}]`;
	}
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t;
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/object/clone.mjs
function Vm(e) {
	if (em(e)) return e;
	if (Array.isArray(e) || Dm(e) || e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
	let t = Object.getPrototypeOf(e);
	if (t == null) return Object.assign(Object.create(t), e);
	let n = t.constructor;
	if (e instanceof Date || e instanceof Map || e instanceof Set) return new n(e);
	if (e instanceof RegExp) {
		let t = new n(e);
		return t.lastIndex = e.lastIndex, t;
	}
	if (e instanceof DataView) return new n(e.buffer.slice(0));
	if (e instanceof Error) {
		let t;
		return t = e instanceof AggregateError ? new n(e.errors, e.message, { cause: e.cause }) : new n(e.message, { cause: e.cause }), t.stack = e.stack, Object.assign(t, e), t;
	}
	return typeof File < "u" && e instanceof File ? new n([e], e.name, {
		type: e.type,
		lastModified: e.lastModified
	}) : typeof e == "object" ? Object.assign(Object.create(t), e) : e;
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/object/mergeWith.mjs
function Hm(e, ...t) {
	let n = t.slice(0, -1), r = t[t.length - 1], i = e;
	for (let e = 0; e < n.length; e++) {
		let t = n[e];
		i = Um(i, t, r, /* @__PURE__ */ new Map());
	}
	return i;
}
function Um(e, t, n, r) {
	if (em(e) && (e = Object(e)), typeof t != "object" || !t) return e;
	if (r.has(t)) return Vm(r.get(t));
	if (r.set(t, e), Array.isArray(t)) {
		t = t.slice();
		for (let e = 0; e < t.length; e++) t[e] = t[e] ?? void 0;
	}
	let i = [...Object.keys(t), ...tm(t)];
	for (let a = 0; a < i.length; a++) {
		let o = i[a];
		if ($p(o)) continue;
		let s = t[o], c = e[o];
		if (Pm(s) && (s = { ...s }), Pm(c) && (c = { ...c }), Em(s) && (s = Nm(s)), Array.isArray(s)) if (Array.isArray(c)) {
			let e = [], t = Reflect.ownKeys(c);
			for (let n = 0; n < t.length; n++) {
				let r = t[n];
				e[r] = c[r];
			}
			c = e;
		} else if (Im(c)) {
			let e = [];
			for (let t = 0; t < c.length; t++) e[t] = c[t];
			c = e;
		} else c = [];
		let l = n(c, s, o, e, t, r);
		l === void 0 ? Array.isArray(s) || Fm(c) && Fm(s) && (Bm(c) || Bm(s) || zm(c) || zm(s)) ? e[o] = Um(c, s, n, r) : c == null && Bm(s) ? e[o] = Um({}, s, n, r) : c == null && zm(s) ? e[o] = Nm(s) : (c === void 0 || s !== void 0) && (e[o] = s) : e[o] = l;
	}
	return e;
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/object/merge.mjs
function Wm(e, ...t) {
	return Hm(e, ...t, Rm);
}
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-NSK5VX7P.mjs
var Gm = t(), Km = {
	curveBasis: vl,
	curveBasisClosed: bl,
	curveBasisOpen: Sl,
	curveBumpX: pl,
	curveBumpY: ml,
	curveBundle: wl,
	curveCardinalClosed: kl,
	curveCardinalOpen: jl,
	curveCardinal: Dl,
	curveCatmullRomClosed: Il,
	curveCatmullRomOpen: Rl,
	curveCatmullRom: Pl,
	curveLinear: cl,
	curveLinearClosed: Bl,
	curveMonotoneX: Jl,
	curveMonotoneY: Yl,
	curveNatural: Ql,
	curveStep: eu,
	curveStepAfter: nu,
	curveStepBefore: tu
}, qm = /\s*(?:(\w+)(?=:):|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, Jm = /* @__PURE__ */ i(function(e, t) {
	let n = Ym(e, /(?:init\b)|(?:initialize\b)/), r = {};
	if (Array.isArray(n)) {
		let e = n.map((e) => e.args);
		Qt(e), r = bt(r, [...e]);
	} else r = n.args;
	if (!r) return;
	let i = Dn(e, t), a = "config";
	return r[a] !== void 0 && (i === "flowchart-v2" && (i = "flowchart"), r[i] = r[a], delete r[a]), r;
}, "detectInit"), Ym = /* @__PURE__ */ i(function(e, t = null) {
	try {
		let n = RegExp(`[%]{2}(?![{]${qm.source})(?=[}][%]{2}).*
`, "ig");
		e = e.trim().replace(n, "").replace(/'/gm, "\""), c.debug(`Detecting diagram directive${t === null ? "" : " type:" + t} based on the text:${e}`);
		let r, i = [];
		for (; (r = Cn.exec(e)) !== null;) if (r.index === Cn.lastIndex && Cn.lastIndex++, r && !t || t && r[1]?.match(t) || t && r[2]?.match(t)) {
			let e = r[1] ? r[1] : r[2], t = r[3] ? r[3].trim() : r[4] ? JSON.parse(r[4].trim()) : null;
			i.push({
				type: e,
				args: t
			});
		}
		return i.length === 0 ? {
			type: e,
			args: null
		} : i.length === 1 ? i[0] : i;
	} catch (n) {
		return c.error(`ERROR: ${n.message} - Unable to parse directive type: '${t}' based on the text: '${e}'`), {
			type: void 0,
			args: null
		};
	}
}, "detectDirective"), Xm = /* @__PURE__ */ i(function(e) {
	return e.replace(Cn, "");
}, "removeDirectives"), Zm = /* @__PURE__ */ i(function(e, t) {
	for (let [n, r] of t.entries()) if (r.match(e)) return n;
	return -1;
}, "isSubstringInArray");
function Qm(e, t) {
	return e ? Km[`curve${e.charAt(0).toUpperCase() + e.slice(1)}`] ?? t : t;
}
i(Qm, "interpolateToCurve");
function $m(e, t) {
	let n = e.trim();
	if (n) return t.securityLevel === "loose" ? n : (0, Gm.sanitizeUrl)(n);
}
i($m, "formatUrl");
var eh = /* @__PURE__ */ i((e, ...t) => {
	let n = e.split("."), r = n.length - 1, i = n[r], a = window;
	for (let t = 0; t < r; t++) if (a = a[n[t]], !a) {
		c.error(`Function name: ${e} not found in window`);
		return;
	}
	a[i](...t);
}, "runFunc");
function th(e, t) {
	return !e || !t ? 0 : Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
i(th, "distance");
function nh(e) {
	let t, n = 0;
	return e.forEach((e) => {
		n += th(e, t), t = e;
	}), ah(e, n / 2);
}
i(nh, "traverseEdge");
function rh(e) {
	return e.length === 1 ? e[0] : nh(e);
}
i(rh, "calcLabelPosition");
var ih = /* @__PURE__ */ i((e, t = 2) => {
	let n = 10 ** t;
	return Math.round(e * n) / n;
}, "roundNumber"), ah = /* @__PURE__ */ i((e, t) => {
	let n, r = t;
	for (let t of e) {
		if (n) {
			let e = th(t, n);
			if (e === 0) return n;
			if (e < r) r -= e;
			else {
				let i = r / e;
				if (i <= 0) return n;
				if (i >= 1) return {
					x: t.x,
					y: t.y
				};
				if (i > 0 && i < 1) return {
					x: ih((1 - i) * n.x + i * t.x, 5),
					y: ih((1 - i) * n.y + i * t.y, 5)
				};
			}
		}
		n = t;
	}
	throw Error("Could not find a suitable point for the given distance");
}, "calculatePoint"), oh = /* @__PURE__ */ i((e, t, n) => {
	c.info(`our points ${JSON.stringify(t)}`), t[0] !== n && (t = t.reverse());
	let r = ah(t, 25), i = e ? 10 : 5, a = Math.atan2(t[0].y - r.y, t[0].x - r.x), o = {
		x: 0,
		y: 0
	};
	return o.x = Math.sin(a) * i + (t[0].x + r.x) / 2, o.y = -Math.cos(a) * i + (t[0].y + r.y) / 2, o;
}, "calcCardinalityPosition");
function sh(e, t, n) {
	let r = structuredClone(n);
	c.info("our points", r), t !== "start_left" && t !== "start_right" && r.reverse();
	let i = ah(r, 25 + e), a = 10 + e * .5, o = Math.atan2(r[0].y - i.y, r[0].x - i.x), s = {
		x: 0,
		y: 0
	};
	return t === "start_left" ? (s.x = Math.sin(o + Math.PI) * a + (r[0].x + i.x) / 2, s.y = -Math.cos(o + Math.PI) * a + (r[0].y + i.y) / 2) : t === "end_right" ? (s.x = Math.sin(o - Math.PI) * a + (r[0].x + i.x) / 2 - 5, s.y = -Math.cos(o - Math.PI) * a + (r[0].y + i.y) / 2 - 5) : t === "end_left" ? (s.x = Math.sin(o) * a + (r[0].x + i.x) / 2 - 5, s.y = -Math.cos(o) * a + (r[0].y + i.y) / 2 - 5) : (s.x = Math.sin(o) * a + (r[0].x + i.x) / 2, s.y = -Math.cos(o) * a + (r[0].y + i.y) / 2), s;
}
i(sh, "calcTerminalLabelPosition");
function ch(e) {
	let t = "", n = "";
	for (let r of e) r !== void 0 && (r.startsWith("color:") || r.startsWith("text-align:") ? n = n + r + ";" : t = t + r + ";");
	return {
		style: t,
		labelStyle: n
	};
}
i(ch, "getStylesFromArray");
var lh = 0, uh = /* @__PURE__ */ i(() => (lh++, "id-" + Math.random().toString(36).substr(2, 12) + "-" + lh), "generateId");
function dh(e) {
	let t = "";
	for (let n = 0; n < e; n++) t += "0123456789abcdef".charAt(Math.floor(Math.random() * 16));
	return t;
}
i(dh, "makeRandomHex");
var fh = /* @__PURE__ */ i((e) => dh(e.length), "random"), ph = /* @__PURE__ */ i(function() {
	return {
		x: 0,
		y: 0,
		fill: void 0,
		anchor: "start",
		style: "#666",
		width: 100,
		height: 100,
		textMargin: 0,
		rx: 0,
		ry: 0,
		valign: void 0,
		text: ""
	};
}, "getTextObj"), mh = /* @__PURE__ */ i(function(e, t) {
	let n = t.text.replace(nr.lineBreakRegex, " "), [, r] = Th(t.fontSize), i = e.append("text");
	i.attr("x", t.x), i.attr("y", t.y), i.style("text-anchor", t.anchor), i.style("font-family", t.fontFamily), i.style("font-size", r), i.style("font-weight", t.fontWeight), i.attr("fill", t.fill), t.class !== void 0 && i.attr("class", t.class);
	let a = i.append("tspan");
	return a.attr("x", t.x + t.textMargin * 2), a.attr("fill", t.fill), a.text(n), i;
}, "drawSimpleText"), hh = Lm((e, t, n) => {
	if (!e || (n = Object.assign({
		fontSize: 12,
		fontWeight: 400,
		fontFamily: "Arial",
		joinWith: "<br/>"
	}, n), nr.lineBreakRegex.test(e))) return e;
	let r = e.split(" ").filter(Boolean), i = [], a = "";
	return r.forEach((e, o) => {
		let s = vh(`${e} `, n), c = vh(a, n);
		if (s > t) {
			let { hyphenatedStrings: r, remainingWord: o } = gh(e, t, "-", n);
			i.push(a, ...r), a = o;
		} else c + s >= t ? (i.push(a), a = e) : a = [a, e].filter(Boolean).join(" ");
		o + 1 === r.length && i.push(a);
	}), i.filter((e) => e !== "").join(n.joinWith);
}, (e, t, n) => `${e}${t}${n.fontSize}${n.fontWeight}${n.fontFamily}${n.joinWith}`), gh = Lm((e, t, n = "-", r) => {
	r = Object.assign({
		fontSize: 12,
		fontWeight: 400,
		fontFamily: "Arial",
		margin: 0
	}, r);
	let i = [...e], a = [], o = "";
	return i.forEach((e, s) => {
		let c = `${o}${e}`;
		if (vh(c, r) >= t) {
			let e = s + 1, t = i.length === e, r = `${c}${n}`;
			a.push(t ? c : r), o = "";
		} else o = c;
	}), {
		hyphenatedStrings: a,
		remainingWord: o
	};
}, (e, t, n = "-", r) => `${e}${t}${n}${r.fontSize}${r.fontWeight}${r.fontFamily}`);
function _h(e, t) {
	return yh(e, t).height;
}
i(_h, "calculateTextHeight");
function vh(e, t) {
	return yh(e, t).width;
}
i(vh, "calculateTextWidth");
var yh = Lm((e, t) => {
	let { fontSize: n = 12, fontFamily: r = "Arial", fontWeight: i = 400 } = t;
	if (!e) return {
		width: 0,
		height: 0
	};
	let [, a] = Th(n), o = ["sans-serif", r], s = e.split(nr.lineBreakRegex), c = [], l = B("body");
	if (!l.remove) return {
		width: 0,
		height: 0,
		lineHeight: 0
	};
	let u = l.append("svg");
	for (let e of o) {
		let t = 0, n = {
			width: 0,
			height: 0,
			lineHeight: 0
		};
		for (let r of s) {
			let o = ph();
			o.text = r || "​";
			let s = mh(u, o).style("font-size", a).style("font-weight", i).style("font-family", e), c = (s._groups || s)[0][0].getBBox();
			if (c.width === 0 && c.height === 0) throw Error("svg element not in render tree");
			n.width = Math.round(Math.max(n.width, c.width)), t = Math.round(c.height), n.height += t, n.lineHeight = Math.round(Math.max(n.lineHeight, t));
		}
		c.push(n);
	}
	return u.remove(), c[isNaN(c[1].height) || isNaN(c[1].width) || isNaN(c[1].lineHeight) || c[0].height > c[1].height && c[0].width > c[1].width && c[0].lineHeight > c[1].lineHeight ? 0 : 1];
}, (e, t) => `${e}${t.fontSize}${t.fontWeight}${t.fontFamily}`), bh = class {
	constructor(e = !1, t) {
		this.count = 0, this.count = t ? t.length : 0, this.next = e ? () => this.count++ : () => Date.now();
	}
	static {
		i(this, "InitIDGenerator");
	}
}, xh, Sh = /* @__PURE__ */ i(function(e) {
	return xh ||= document.createElement("div"), e = escape(e).replace(/%26/g, "&").replace(/%23/g, "#").replace(/%3B/g, ";"), xh.innerHTML = e, unescape(xh.textContent);
}, "entityDecode");
function Ch(e) {
	return "str" in e;
}
i(Ch, "isDetailedError");
var wh = /* @__PURE__ */ i((e, t, n, r) => {
	if (!r) return;
	let i = e.node()?.getBBox();
	i && e.append("text").text(r).attr("text-anchor", "middle").attr("x", i.x + i.width / 2).attr("y", -n).attr("class", t);
}, "insertTitle"), Th = /* @__PURE__ */ i((e) => {
	if (typeof e == "number") return [e, e + "px"];
	let t = parseInt(e ?? "", 10);
	return Number.isNaN(t) ? [void 0, void 0] : e === String(t) ? [t, e + "px"] : [t, e];
}, "parseFontSize");
function Eh(e, t) {
	return Wm({}, e, t);
}
i(Eh, "cleanAndMerge");
var Dh = {
	assignWithDepth: bt,
	wrapLabel: hh,
	calculateTextHeight: _h,
	calculateTextWidth: vh,
	calculateTextDimensions: yh,
	cleanAndMerge: Eh,
	detectInit: Jm,
	detectDirective: Ym,
	isSubstringInArray: Zm,
	interpolateToCurve: Qm,
	calcLabelPosition: rh,
	calcCardinalityPosition: oh,
	calcTerminalLabelPosition: sh,
	formatUrl: $m,
	getStylesFromArray: ch,
	generateId: uh,
	random: fh,
	runFunc: eh,
	entityDecode: Sh,
	insertTitle: wh,
	isLabelCoordinateInPath: Mh,
	parseFontSize: Th,
	InitIDGenerator: bh
}, Oh = /* @__PURE__ */ i(function(e) {
	let t = e;
	return t = t.replace(/style.*:\S*#.*;/g, function(e) {
		return e.substring(0, e.length - 1);
	}), t = t.replace(/classDef.*:\S*#.*;/g, function(e) {
		return e.substring(0, e.length - 1);
	}), t = t.replace(/#\w+;/g, function(e) {
		let t = e.substring(1, e.length - 1);
		return /^\+?\d+$/.test(t) ? "ﬂ°°" + t + "¶ß" : "ﬂ°" + t + "¶ß";
	}), t;
}, "encodeEntities"), kh = /* @__PURE__ */ i(function(e) {
	return e.replace(/ﬂ°°/g, "&#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, "decodeEntities"), Ah = /* @__PURE__ */ i((e, t, { counter: n = 0, prefix: r, suffix: i }, a) => a || `${r ? `${r}_` : ""}${e}_${t}_${n}${i ? `_${i}` : ""}`, "getEdgeId");
function jh(e) {
	return e ?? null;
}
i(jh, "handleUndefinedAttr");
function Mh(e, t) {
	let n = Math.round(e.x), r = Math.round(e.y), i = t.replace(/(\d+\.\d+)/g, (e) => Math.round(parseFloat(e)).toString());
	return i.includes(n.toString()) || i.includes(r.toString());
}
i(Mh, "isLabelCoordinateInPath");
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-UBXNYLIW.mjs
var Nh = /* @__PURE__ */ i(({ flowchart: e }) => {
	let t = e?.subGraphTitleMargin?.top ?? 0, n = e?.subGraphTitleMargin?.bottom ?? 0;
	return {
		subGraphTitleTopMargin: t,
		subGraphTitleBottomMargin: n,
		subGraphTitleTotalMargin: t + n
	};
}, "getSubGraphTitleMargins");
async function Ph(e, t) {
	let n = e.getElementsByTagName("img");
	if (!n || n.length === 0) return;
	let r = t.replace(/<img[^>]*>/g, "").trim() === "";
	await Promise.all([...n].map((e) => new Promise((t) => {
		function n() {
			if (e.style.display = "flex", e.style.flexDirection = "column", r) {
				let [t = Yt.fontSize] = Th(z().fontSize ? z().fontSize : window.getComputedStyle(document.body).fontSize), n = t * 5 + "px";
				e.style.minWidth = n, e.style.maxWidth = n;
			} else e.style.width = "100%";
			t(e);
		}
		i(n, "setupImage"), setTimeout(() => {
			e.complete && n();
		}), e.addEventListener("error", n), e.addEventListener("load", n);
	})));
}
i(Ph, "configureLabelImages");
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/icon/defaults.js
var Fh = Object.freeze({
	left: 0,
	top: 0,
	width: 16,
	height: 16
}), Ih = Object.freeze({
	rotate: 0,
	vFlip: !1,
	hFlip: !1
}), Lh = Object.freeze({
	...Fh,
	...Ih
}), Rh = Object.freeze({
	...Lh,
	body: "",
	hidden: !1
}), zh = Object.freeze({
	width: null,
	height: null
}), Bh = Object.freeze({
	...zh,
	...Ih
}), Vh = (e, t, n, r = "") => {
	let i = e.split(":");
	if (e.slice(0, 1) === "@") {
		if (i.length < 2 || i.length > 3) return null;
		r = i.shift().slice(1);
	}
	if (i.length > 3 || !i.length) return null;
	if (i.length > 1) {
		let e = i.pop(), n = i.pop(), a = {
			provider: i.length > 0 ? i[0] : r,
			prefix: n,
			name: e
		};
		return t && !Hh(a) ? null : a;
	}
	let a = i[0], o = a.split("-");
	if (o.length > 1) {
		let e = {
			provider: r,
			prefix: o.shift(),
			name: o.join("-")
		};
		return t && !Hh(e) ? null : e;
	}
	if (n && r === "") {
		let e = {
			provider: r,
			prefix: "",
			name: a
		};
		return t && !Hh(e, n) ? null : e;
	}
	return null;
}, Hh = (e, t) => e ? !!((t && e.prefix === "" || e.prefix) && e.name) : !1;
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/icon/transformations.js
function Uh(e, t) {
	let n = {};
	!e.hFlip != !t.hFlip && (n.hFlip = !0), !e.vFlip != !t.vFlip && (n.vFlip = !0);
	let r = ((e.rotate || 0) + (t.rotate || 0)) % 4;
	return r && (n.rotate = r), n;
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/icon/merge.js
function Wh(e, t) {
	let n = Uh(e, t);
	for (let r in Rh) r in Ih ? r in e && !(r in n) && (n[r] = Ih[r]) : r in t ? n[r] = t[r] : r in e && (n[r] = e[r]);
	return n;
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/icon-set/tree.js
function Gh(e, t) {
	let n = e.icons, r = e.aliases || Object.create(null), i = Object.create(null);
	function a(e) {
		if (n[e]) return i[e] = [];
		if (!(e in i)) {
			i[e] = null;
			let t = r[e] && r[e].parent, n = t && a(t);
			n && (i[e] = [t].concat(n));
		}
		return i[e];
	}
	return (t || Object.keys(n).concat(Object.keys(r))).forEach(a), i;
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/icon-set/get-icon.js
function Kh(e, t, n) {
	let r = e.icons, i = e.aliases || Object.create(null), a = {};
	function o(e) {
		a = Wh(r[e] || i[e], a);
	}
	return o(t), n.forEach(o), Wh(e, a);
}
function qh(e, t) {
	if (e.icons[t]) return Kh(e, t, []);
	let n = Gh(e, [t])[t];
	return n ? Kh(e, t, n) : null;
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/svg/size.js
var Jh = /(-?[0-9.]*[0-9]+[0-9.]*)/g, Yh = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function Xh(e, t, n) {
	if (t === 1) return e;
	if (n ||= 100, typeof e == "number") return Math.ceil(e * t * n) / n;
	if (typeof e != "string") return e;
	let r = e.split(Jh);
	if (r === null || !r.length) return e;
	let i = [], a = r.shift(), o = Yh.test(a);
	for (;;) {
		if (o) {
			let e = parseFloat(a);
			isNaN(e) ? i.push(a) : i.push(Math.ceil(e * t * n) / n);
		} else i.push(a);
		if (a = r.shift(), a === void 0) return i.join("");
		o = !o;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/svg/defs.js
function Zh(e, t = "defs") {
	let n = "", r = e.indexOf("<" + t);
	for (; r >= 0;) {
		let i = e.indexOf(">", r), a = e.indexOf("</" + t);
		if (i === -1 || a === -1) break;
		let o = e.indexOf(">", a);
		if (o === -1) break;
		n += e.slice(i + 1, a).trim(), e = e.slice(0, r).trim() + e.slice(o + 1);
	}
	return {
		defs: n,
		content: e
	};
}
function Qh(e, t) {
	return e ? "<defs>" + e + "</defs>" + t : t;
}
function $h(e, t, n) {
	let r = Zh(e);
	return Qh(r.defs, t + r.content + n);
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/svg/build.js
var eg = (e) => e === "unset" || e === "undefined" || e === "none";
function tg(e, t) {
	let n = {
		...Lh,
		...e
	}, r = {
		...Bh,
		...t
	}, i = {
		left: n.left,
		top: n.top,
		width: n.width,
		height: n.height
	}, a = n.body;
	[n, r].forEach((e) => {
		let t = [], n = e.hFlip, r = e.vFlip, o = e.rotate;
		n ? r ? o += 2 : (t.push("translate(" + (i.width + i.left).toString() + " " + (0 - i.top).toString() + ")"), t.push("scale(-1 1)"), i.top = i.left = 0) : r && (t.push("translate(" + (0 - i.left).toString() + " " + (i.height + i.top).toString() + ")"), t.push("scale(1 -1)"), i.top = i.left = 0);
		let s;
		switch (o < 0 && (o -= Math.floor(o / 4) * 4), o %= 4, o) {
			case 1:
				s = i.height / 2 + i.top, t.unshift("rotate(90 " + s.toString() + " " + s.toString() + ")");
				break;
			case 2:
				t.unshift("rotate(180 " + (i.width / 2 + i.left).toString() + " " + (i.height / 2 + i.top).toString() + ")");
				break;
			case 3:
				s = i.width / 2 + i.left, t.unshift("rotate(-90 " + s.toString() + " " + s.toString() + ")");
				break;
		}
		o % 2 == 1 && (i.left !== i.top && (s = i.left, i.left = i.top, i.top = s), i.width !== i.height && (s = i.width, i.width = i.height, i.height = s)), t.length && (a = $h(a, "<g transform=\"" + t.join(" ") + "\">", "</g>"));
	});
	let o = r.width, s = r.height, c = i.width, l = i.height, u, d;
	o === null ? (d = s === null ? "1em" : s === "auto" ? l : s, u = Xh(d, c / l)) : (u = o === "auto" ? c : o, d = s === null ? Xh(u, l / c) : s === "auto" ? l : s);
	let f = {}, p = (e, t) => {
		eg(t) || (f[e] = t.toString());
	};
	p("width", u), p("height", d);
	let m = [
		i.left,
		i.top,
		c,
		l
	];
	return f.viewBox = m.join(" "), {
		attributes: f,
		viewBox: m,
		body: a
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/svg/id.js
var ng = /\sid="(\S+)"/g, rg = /* @__PURE__ */ new Map();
function ig(e) {
	e = e.replace(/[0-9]+$/, "") || "a";
	let t = rg.get(e) || 0;
	return rg.set(e, t + 1), t ? `${e}${t}` : e;
}
function ag(e) {
	let t = [], n;
	for (; n = ng.exec(e);) t.push(n[1]);
	if (!t.length) return e;
	let r = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
	return t.forEach((t) => {
		let n = ig(t), i = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		e = e.replace(RegExp("([#;\"])(" + i + ")([\")]|\\.[a-z])", "g"), "$1" + n + r + "$3");
	}), e = e.replace(new RegExp(r, "g"), ""), e;
}
//#endregion
//#region ../../node_modules/.pnpm/@iconify+utils@3.1.0/node_modules/@iconify/utils/lib/svg/html.js
function og(e, t) {
	let n = e.indexOf("xlink:") === -1 ? "" : " xmlns:xlink=\"http://www.w3.org/1999/xlink\"";
	for (let e in t) n += " " + e + "=\"" + t[e] + "\"";
	return "<svg xmlns=\"http://www.w3.org/2000/svg\"" + n + ">" + e + "</svg>";
}
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4I5QYGJK.mjs
var sg = {
	body: "<g><rect width=\"80\" height=\"80\" style=\"fill: #087ebf; stroke-width: 0px;\"/><text transform=\"translate(21.16 64.67)\" style=\"fill: #fff; font-family: ArialMT, Arial; font-size: 67.75px;\"><tspan x=\"0\" y=\"0\">?</tspan></text></g>",
	height: 80,
	width: 80
}, cg = /* @__PURE__ */ new Map(), lg = /* @__PURE__ */ new Map(), ug = /* @__PURE__ */ i((e) => {
	for (let t of e) {
		if (!t.name) throw Error("Invalid icon loader. Must have a \"name\" property with non-empty string value.");
		if (c.debug("Registering icon pack:", t.name), "loader" in t) lg.set(t.name, t.loader);
		else if ("icons" in t) cg.set(t.name, t.icons);
		else throw c.error("Invalid icon loader:", t), Error("Invalid icon loader. Must have either \"icons\" or \"loader\" property.");
	}
}, "registerIconPacks"), dg = /* @__PURE__ */ i(async (e, t) => {
	let n = Vh(e, !0, t !== void 0);
	if (!n) throw Error(`Invalid icon name: ${e}`);
	let r = n.prefix || t;
	if (!r) throw Error(`Icon name must contain a prefix: ${e}`);
	let i = cg.get(r);
	if (!i) {
		let e = lg.get(r);
		if (!e) throw Error(`Icon set not found: ${n.prefix}`);
		try {
			i = {
				...await e(),
				prefix: r
			}, cg.set(r, i);
		} catch (e) {
			throw c.error(e), Error(`Failed to load icon set: ${n.prefix}`);
		}
	}
	let a = qh(i, n.name);
	if (!a) throw Error(`Icon not found: ${e}`);
	return a;
}, "getRegisteredIconData"), fg = /* @__PURE__ */ i(async (e) => {
	try {
		return await dg(e), !0;
	} catch {
		return !1;
	}
}, "isIconAvailable"), pg = /* @__PURE__ */ i(async (e, t, n) => {
	let r;
	try {
		r = await dg(e, t?.fallbackPrefix);
	} catch (e) {
		c.error(e), r = sg;
	}
	let i = tg(r, t);
	return Ln(og(ag(i.body), {
		...i.attributes,
		...n
	}), fn());
}, "getIconSVG");
//#endregion
//#region ../../node_modules/.pnpm/marked@16.4.2/node_modules/marked/lib/marked.esm.js
function mg() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var hg = mg();
function gg(e) {
	hg = e;
}
var _g = { exec: () => null };
function W(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(yg.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var vg = (() => {
	try {
		return !0;
	} catch {
		return !1;
	}
})(), yg = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceTabs: /^\t+/,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] /,
	listReplaceTask: /^\[[ xX]\] +/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
	hrRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
	fencesBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
	headingBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
	htmlBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i")
}, bg = /^(?:[ \t]*(?:\n|$))+/, xg = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Sg = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Cg = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, wg = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Tg = /(?:[*+-]|\d{1,9}[.)])/, Eg = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Dg = W(Eg).replace(/bull/g, Tg).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Og = W(Eg).replace(/bull/g, Tg).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), kg = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ag = /^[^\n]+/, jg = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Mg = W(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", jg).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ng = W(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Tg).getRegex(), Pg = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Fg = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ig = W("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Fg).replace("tag", Pg).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Lg = W(kg).replace("hr", Cg).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Pg).getRegex(), Rg = {
	blockquote: W(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Lg).getRegex(),
	code: xg,
	def: Mg,
	fences: Sg,
	heading: wg,
	hr: Cg,
	html: Ig,
	lheading: Dg,
	list: Ng,
	newline: bg,
	paragraph: Lg,
	table: _g,
	text: Ag
}, zg = W("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Cg).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Pg).getRegex(), Bg = {
	...Rg,
	lheading: Og,
	table: zg,
	paragraph: W(kg).replace("hr", Cg).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", zg).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Pg).getRegex()
}, Vg = {
	...Rg,
	html: W("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", Fg).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: _g,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: W(kg).replace("hr", Cg).replace("heading", " *#{1,6} *[^\n]").replace("lheading", Dg).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Hg = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ug = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Wg = /^( {2,}|\\)\n(?!\s*$)/, Gg = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Kg = /[\p{P}\p{S}]/u, qg = /[\s\p{P}\p{S}]/u, Jg = /[^\s\p{P}\p{S}]/u, Yg = W(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, qg).getRegex(), Xg = /(?!~)[\p{P}\p{S}]/u, Zg = /(?!~)[\s\p{P}\p{S}]/u, Qg = /(?:[^\s\p{P}\p{S}]|~)/u, $g = W(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", vg ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), e_ = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, t_ = W(e_, "u").replace(/punct/g, Kg).getRegex(), n_ = W(e_, "u").replace(/punct/g, Xg).getRegex(), r_ = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", i_ = W(r_, "gu").replace(/notPunctSpace/g, Jg).replace(/punctSpace/g, qg).replace(/punct/g, Kg).getRegex(), a_ = W(r_, "gu").replace(/notPunctSpace/g, Qg).replace(/punctSpace/g, Zg).replace(/punct/g, Xg).getRegex(), o_ = W("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Jg).replace(/punctSpace/g, qg).replace(/punct/g, Kg).getRegex(), s_ = W(/\\(punct)/, "gu").replace(/punct/g, Kg).getRegex(), c_ = W(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), l_ = W(Fg).replace("(?:-->|$)", "-->").getRegex(), u_ = W("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", l_).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), d_ = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, f_ = W(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", d_).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), p_ = W(/^!?\[(label)\]\[(ref)\]/).replace("label", d_).replace("ref", jg).getRegex(), m_ = W(/^!?\[(ref)\](?:\[\])?/).replace("ref", jg).getRegex(), h_ = W("reflink|nolink(?!\\()", "g").replace("reflink", p_).replace("nolink", m_).getRegex(), g_ = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, __ = {
	_backpedal: _g,
	anyPunctuation: s_,
	autolink: c_,
	blockSkip: $g,
	br: Wg,
	code: Ug,
	del: _g,
	emStrongLDelim: t_,
	emStrongRDelimAst: i_,
	emStrongRDelimUnd: o_,
	escape: Hg,
	link: f_,
	nolink: m_,
	punctuation: Yg,
	reflink: p_,
	reflinkSearch: h_,
	tag: u_,
	text: Gg,
	url: _g
}, v_ = {
	...__,
	link: W(/^!?\[(label)\]\((.*?)\)/).replace("label", d_).getRegex(),
	reflink: W(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", d_).getRegex()
}, y_ = {
	...__,
	emStrongRDelimAst: a_,
	emStrongLDelim: n_,
	url: W(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", g_).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: W(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", g_).getRegex()
}, b_ = {
	...y_,
	br: W(Wg).replace("{2,}", "*").getRegex(),
	text: W(y_.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, x_ = {
	normal: Rg,
	gfm: Bg,
	pedantic: Vg
}, S_ = {
	normal: __,
	gfm: y_,
	breaks: b_,
	pedantic: v_
}, C_ = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, w_ = (e) => C_[e];
function T_(e, t) {
	if (t) {
		if (yg.escapeTest.test(e)) return e.replace(yg.escapeReplace, w_);
	} else if (yg.escapeTestNoEncode.test(e)) return e.replace(yg.escapeReplaceNoEncode, w_);
	return e;
}
function E_(e) {
	try {
		e = encodeURI(e).replace(yg.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function D_(e, t) {
	let n = e.replace(yg.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(yg.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
	else for (; n.length < t;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(yg.slashPipe, "|");
	return n;
}
function O_(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function k_(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function A_(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1");
	r.state.inLink = !0;
	let c = {
		type: e[0].charAt(0) === "!" ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: r.inlineTokens(s)
	};
	return r.state.inLink = !1, c;
}
function j_(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return r.length >= i.length ? e.slice(i.length) : e;
	}).join("\n");
}
var M_ = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || hg;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = t[0].replace(this.rules.other.codeRemoveIndent, "");
			return {
				type: "code",
				raw: t[0],
				codeBlockStyle: "indented",
				text: this.options.pedantic ? e : O_(e, "\n")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = j_(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = O_(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: t[0],
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: O_(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = O_(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o;
				for (o = 0; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.blockquote(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - t.raw.length) + o.raw, r = r.substring(0, r.length - t.text.length) + o.text;
					break;
				} else if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let n = !1, r = "", s = "";
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				r = t[0], e = e.substring(r.length);
				let c = t[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (e) => " ".repeat(3 * e.length)), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
				if (this.options.pedantic ? (d = 2, s = c.trimStart()) : u ? d = t[1].length + 1 : (d = t[2].search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, s = c.slice(d), d += t[1].length), u && this.rules.other.blankLine.test(l) && (r += l + "\n", e = e.substring(l.length + 1), n = !0), !n) {
					let t = this.rules.other.nextBulletRegex(d), n = this.rules.other.hrRegex(d), i = this.rules.other.fencesBeginRegex(d), a = this.rules.other.headingBeginRegex(d), o = this.rules.other.htmlBeginRegex(d);
					for (; e;) {
						let f = e.split("\n", 1)[0], p;
						if (l = f, this.options.pedantic ? (l = l.replace(this.rules.other.listReplaceNesting, "  "), p = l) : p = l.replace(this.rules.other.tabCharGlobal, "    "), i.test(l) || a.test(l) || o.test(l) || t.test(l) || n.test(l)) break;
						if (p.search(this.rules.other.nonSpaceChar) >= d || !l.trim()) s += "\n" + p.slice(d);
						else {
							if (u || c.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || i.test(c) || a.test(c) || n.test(c)) break;
							s += "\n" + l;
						}
						!u && !l.trim() && (u = !0), r += f + "\n", e = e.substring(f.length + 1), c = p.slice(d);
					}
				}
				i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(r) && (o = !0));
				let f = null, p;
				this.options.gfm && (f = this.rules.other.listIsTask.exec(s), f && (p = f[0] !== "[ ] ", s = s.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
					type: "list_item",
					raw: r,
					task: !!f,
					checked: p,
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += r;
			}
			let s = i.items.at(-1);
			if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let e = 0; e < i.items.length; e++) if (this.lexer.state.top = !1, i.items[e].tokens = this.lexer.blockTokens(i.items[e].text, []), !i.loose) {
				let t = i.items[e].tokens.filter((e) => e.type === "space");
				i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
			}
			if (i.loose) for (let e = 0; e < i.items.length; e++) i.items[e].loose = !0;
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) return {
			type: "html",
			block: !0,
			raw: t[0],
			pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
			text: t[0]
		};
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: t[0],
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = D_(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: t[0],
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(D_(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) return {
			type: "heading",
			raw: t[0],
			depth: t[2].charAt(0) === "=" ? 1 : 2,
			text: t[1],
			tokens: this.lexer.inline(t[1])
		};
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let e = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(e)) {
				if (!this.rules.other.endAngleBracket.test(e)) return;
				let t = O_(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = k_(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let n = t[2], r = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(n);
				e && (n = e[1], r = e[3]);
			} else r = t[3] ? t[3].slice(1, -1) : "";
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), A_(t, {
				href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
				title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let e = t[(n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!e) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return A_(n, e, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (c.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = c.exec(t)) != null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
				if (a = [...i].length, r[3] || r[4]) {
					o += a;
					continue;
				} else if ((r[5] || r[6]) && n % 3 && !((n + a) % 3)) {
					s += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o + s);
				let t = [...r[0]][0].length, c = e.slice(0, n + r.index + t + a);
				if (Math.min(n, a) % 2) {
					let e = c.slice(1, -1);
					return {
						type: "em",
						raw: c,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = c.slice(2, -2);
				return {
					type: "strong",
					raw: c,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e) {
		let t = this.rules.inline.del.exec(e);
		if (t) return {
			type: "del",
			raw: t[0],
			text: t[2],
			tokens: this.lexer.inlineTokens(t[2])
		};
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: t[0],
				escaped: e
			};
		}
	}
}, N_ = class e {
	tokens;
	options;
	state;
	tokenizer;
	inlineQueue;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || hg, this.options.tokenizer = this.options.tokenizer || new M_(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			top: !0
		};
		let t = {
			other: yg,
			block: x_.normal,
			inline: S_.normal
		};
		this.options.pedantic ? (t.block = x_.pedantic, t.inline = S_.pedantic) : this.options.gfm && (t.block = x_.gfm, this.options.breaks ? t.inline = S_.breaks : t.inline = S_.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: x_,
			inline: S_
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(yg.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		for (this.options.pedantic && (e = e.replace(yg.tabCharGlobal, "    ").replace(yg.spaceLine, "")); e;) {
			let r;
			if (this.options.extensions?.block?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.space(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(r);
				continue;
			}
			if (r = this.tokenizer.code(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.fences(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.heading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.hr(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.blockquote(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.list(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.html(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.def(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
					href: r.href,
					title: r.title
				}, t.push(r));
				continue;
			}
			if (r = this.tokenizer.table(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.lheading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startBlock) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (this.state.top && (r = this.tokenizer.paragraph(i))) {
				let a = t.at(-1);
				n && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith("\n") ? "" : "\n") + r.raw, a.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
				continue;
			}
			if (r = this.tokenizer.text(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	inlineTokens(e, t = []) {
		let n = e, r = null;
		if (this.tokens.links) {
			let e = Object.keys(this.tokens.links);
			if (e.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null;) e.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
		}
		for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null;) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
		let i;
		for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null;) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
		n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let a = !1, o = "";
		for (; e;) {
			a || (o = ""), a = !1;
			let r;
			if (this.options.extensions?.inline?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.escape(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.tag(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.link(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.type === "text" && n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.emStrong(e, n, o)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.codespan(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.br(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.del(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.autolink(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (!this.state.inLink && (r = this.tokenizer.url(e))) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startInline) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (r = this.tokenizer.inlineText(i)) {
				e = e.substring(r.raw.length), r.raw.slice(-1) !== "_" && (o = r.raw.slice(-1)), a = !0;
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return t;
	}
}, P_ = class {
	options;
	parser;
	constructor(e) {
		this.options = e || hg;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(yg.notSpaceStart)?.[0], i = e.replace(yg.endingNewline, "") + "\n";
		return r ? "<pre><code class=\"language-" + T_(r) + "\">" + (n ? i : T_(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : T_(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		let t = "";
		if (e.task) {
			let n = this.checkbox({ checked: !!e.checked });
			e.loose ? e.tokens[0]?.type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + T_(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = !0)) : e.tokens.unshift({
				type: "text",
				raw: n + " ",
				text: n + " ",
				escaped: !0
			}) : t += n + " ";
		}
		return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\">";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${T_(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, tokens: n }) {
		let r = this.parser.parseInline(n), i = E_(e);
		if (i === null) return r;
		e = i;
		let a = "<a href=\"" + e + "\"";
		return t && (a += " title=\"" + T_(t) + "\""), a += ">" + r + "</a>", a;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = E_(e);
		if (i === null) return T_(n);
		e = i;
		let a = `<img src="${e}" alt="${n}"`;
		return t && (a += ` title="${T_(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : T_(e.text);
	}
}, F_ = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
}, I_ = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || hg, this.options.renderer = this.options.renderer || new P_(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new F_();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e, t = !0) {
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = i, t = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (t !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					n += t || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "space":
					n += this.renderer.space(a);
					continue;
				case "hr":
					n += this.renderer.hr(a);
					continue;
				case "heading":
					n += this.renderer.heading(a);
					continue;
				case "code":
					n += this.renderer.code(a);
					continue;
				case "table":
					n += this.renderer.table(a);
					continue;
				case "blockquote":
					n += this.renderer.blockquote(a);
					continue;
				case "list":
					n += this.renderer.list(a);
					continue;
				case "html":
					n += this.renderer.html(a);
					continue;
				case "def":
					n += this.renderer.def(a);
					continue;
				case "paragraph":
					n += this.renderer.paragraph(a);
					continue;
				case "text": {
					let i = a, o = this.renderer.text(i);
					for (; r + 1 < e.length && e[r + 1].type === "text";) i = e[++r], o += "\n" + this.renderer.text(i);
					t ? n += this.renderer.paragraph({
						type: "paragraph",
						raw: o,
						text: o,
						tokens: [{
							type: "text",
							raw: o,
							text: o,
							escaped: !0
						}]
					}) : n += o;
					continue;
				}
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
	parseInline(e, t = this.renderer) {
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, L_ = class {
	options;
	block;
	constructor(e) {
		this.options = e || hg;
	}
	static passThroughHooks = new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer() {
		return this.block ? N_.lex : N_.lexInline;
	}
	provideParser() {
		return this.block ? I_.parse : I_.parseInline;
	}
}, R_ = new class {
	defaults = mg();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = I_;
	Renderer = P_;
	TextRenderer = F_;
	Lexer = N_;
	Tokenizer = M_;
	Hooks = L_;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(Infinity);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new P_(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new M_(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new L_();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					L_.passThroughHooks.has(n) ? t[r] = (e) => {
						if (this.defaults.async && L_.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : t[r] = (...e) => {
						if (this.defaults.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return N_.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return I_.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer() : e ? N_.lex : N_.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser() : e ? I_.parse : I_.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer() : e ? N_.lex : N_.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser() : e ? I_.parse : I_.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + T_(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function G(e, t) {
	return R_.parse(e, t);
}
G.options = G.setOptions = function(e) {
	return R_.setOptions(e), G.defaults = R_.defaults, gg(G.defaults), G;
}, G.getDefaults = mg, G.defaults = hg, G.use = function(...e) {
	return R_.use(...e), G.defaults = R_.defaults, gg(G.defaults), G;
}, G.walkTokens = function(e, t) {
	return R_.walkTokens(e, t);
}, G.parseInline = R_.parseInline, G.Parser = I_, G.parser = I_.parse, G.Renderer = P_, G.TextRenderer = F_, G.Lexer = N_, G.lexer = N_.lex, G.Tokenizer = M_, G.Hooks = L_, G.parse = G, G.options, G.setOptions, G.use, G.walkTokens, G.parseInline, I_.parse, N_.lex;
//#endregion
//#region ../../node_modules/.pnpm/ts-dedent@2.2.0/node_modules/ts-dedent/esm/index.js
function z_(e) {
	var t = [...arguments].slice(1), n = Array.from(typeof e == "string" ? [e] : e);
	n[n.length - 1] = n[n.length - 1].replace(/\r?\n([\t ]*)$/, "");
	var r = n.reduce(function(e, t) {
		var n = t.match(/\n([\t ]+|(?!\s).)/g);
		return n ? e.concat(n.map(function(e) {
			return e.match(/[\t ]/g)?.length ?? 0;
		})) : e;
	}, []);
	if (r.length) {
		var i = RegExp("\n[	 ]{" + Math.min.apply(Math, r) + "}", "g");
		n = n.map(function(e) {
			return e.replace(i, "\n");
		});
	}
	n[0] = n[0].replace(/^\r?\n/, "");
	var a = n[0];
	return t.forEach(function(e, t) {
		var r = a.match(/(?:^|\n)( *)$/), i = r ? r[1] : "", o = e;
		typeof e == "string" && e.includes("\n") && (o = String(e).split("\n").map(function(e, t) {
			return t === 0 ? e : "" + i + e;
		}).join("\n")), a += o + n[t + 1];
	}), a;
}
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/chunk-WRU74C26.mjs
function B_(e, { markdownAutoWrap: t }) {
	return z_(e.replace(/<br\/>/g, "\n").replace(/\n{2,}/g, "\n"));
}
i(B_, "preprocessMarkdown");
function V_(e) {
	return e.split(/\\n|\n|<br\s*\/?>/gi).map((e) => e.trim().match(/<[^>]+>|[^\s<>]+/g)?.map((e) => ({
		content: e,
		type: "normal"
	})) ?? []);
}
i(V_, "nonMarkdownToLines");
function H_(e, t = {}) {
	let n = B_(e, t), r = G.lexer(n), a = [[]], o = 0;
	function s(e, t = "normal") {
		e.type === "text" ? e.text.split("\n").forEach((e, n) => {
			n !== 0 && (o++, a.push([])), e.split(" ").forEach((e) => {
				e = e.replace(/&#39;/g, "'"), e && a[o].push({
					content: e,
					type: t
				});
			});
		}) : e.type === "strong" || e.type === "em" ? e.tokens.forEach((t) => {
			s(t, e.type);
		}) : e.type === "html" && a[o].push({
			content: e.text,
			type: "normal"
		});
	}
	return i(s, "processNode"), r.forEach((e) => {
		e.type === "paragraph" ? e.tokens?.forEach((e) => {
			s(e);
		}) : e.type === "html" ? a[o].push({
			content: e.text,
			type: "normal"
		}) : a[o].push({
			content: e.raw,
			type: "normal"
		});
	}), a;
}
i(H_, "markdownToLines");
function U_(e) {
	return e ? `<p>${e.replace(/\\n|\n/g, "<br />")}</p>` : "";
}
i(U_, "nonMarkdownToHTML");
function W_(e, { markdownAutoWrap: t } = {}) {
	let n = G.lexer(e);
	function r(e) {
		return e.type === "text" ? t === !1 ? e.text.replace(/\n */g, "<br/>").replace(/ /g, "&nbsp;") : e.text.replace(/\n */g, "<br/>") : e.type === "strong" ? `<strong>${e.tokens?.map(r).join("")}</strong>` : e.type === "em" ? `<em>${e.tokens?.map(r).join("")}</em>` : e.type === "paragraph" ? `<p>${e.tokens?.map(r).join("")}</p>` : e.type === "space" ? "" : e.type === "html" ? `${e.text}` : e.type === "escape" ? e.text : (c.warn(`Unsupported markdown: ${e.type}`), e.raw);
	}
	return i(r, "output"), n.map(r).join("");
}
i(W_, "markdownToHTML");
function G_(e) {
	return Intl.Segmenter ? [...new Intl.Segmenter().segment(e)].map((e) => e.segment) : [...e];
}
i(G_, "splitTextToChars");
function K_(e, t) {
	return q_(e, [], G_(t.content), t.type);
}
i(K_, "splitWordToFitWidth");
function q_(e, t, n, r) {
	if (n.length === 0) return [{
		content: t.join(""),
		type: r
	}, {
		content: "",
		type: r
	}];
	let [i, ...a] = n, o = [...t, i];
	return e([{
		content: o.join(""),
		type: r
	}]) ? q_(e, o, a, r) : (t.length === 0 && i && (t.push(i), n.shift()), [{
		content: t.join(""),
		type: r
	}, {
		content: n.join(""),
		type: r
	}]);
}
i(q_, "splitWordToFitWidthRecursion");
function J_(e, t) {
	if (e.some(({ content: e }) => e.includes("\n"))) throw Error("splitLineToFitWidth does not support newlines in the line");
	return Y_(e, t);
}
i(J_, "splitLineToFitWidth");
function Y_(e, t, n = [], r = []) {
	if (e.length === 0) return r.length > 0 && n.push(r), n.length > 0 ? n : [];
	let i = "";
	e[0].content === " " && (i = " ", e.shift());
	let a = e.shift() ?? {
		content: " ",
		type: "normal"
	}, o = [...r];
	if (i !== "" && o.push({
		content: i,
		type: "normal"
	}), o.push(a), t(o)) return Y_(e, t, n, o);
	if (r.length > 0) n.push(r), e.unshift(a);
	else if (a.content) {
		let [r, i] = K_(t, a);
		n.push([r]), i.content && e.unshift(i);
	}
	return Y_(e, t, n);
}
i(Y_, "splitLineToFitWidthRecursion");
function X_(e, t) {
	t && e.attr("style", t);
}
i(X_, "applyStyle");
var Z_ = 16384;
async function Q_(e, t, n, r, i = !1, a = fn()) {
	let o = e.append("foreignObject");
	o.attr("width", `${Math.min(10 * n, Z_)}px`), o.attr("height", `${Math.min(10 * n, Z_)}px`);
	let s = o.append("xhtml:div"), c = Qn(t.label) ? await tr(t.label.replace(nr.lineBreakRegex, "\n"), a) : Ln(t.label, a), l = t.isNode ? "nodeLabel" : "edgeLabel", u = s.append("span");
	u.html(c), X_(u, t.labelStyle), u.attr("class", `${l} ${r}`), X_(s, t.labelStyle), s.style("display", "table-cell"), s.style("white-space", "nowrap"), s.style("line-height", "1.5"), n !== Infinity && (s.style("max-width", n + "px"), s.style("text-align", "center")), s.attr("xmlns", "http://www.w3.org/1999/xhtml"), i && s.attr("class", "labelBkg");
	let d = s.node().getBoundingClientRect();
	return d.width === n && (s.style("display", "table"), s.style("white-space", "break-spaces"), s.style("width", n + "px"), d = s.node().getBoundingClientRect()), o.node();
}
i(Q_, "addHtmlSpan");
function $_(e, t, n, r = !1) {
	let i = e.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", t * n - .1 + "em").attr("dy", n + "em");
	return r && i.attr("text-anchor", "middle"), i;
}
i($_, "createTspan");
function ev(e, t, n) {
	let r = e.append("text"), i = $_(r, 1, t);
	iv(i, n);
	let a = i.node().getComputedTextLength();
	return r.remove(), a;
}
i(ev, "computeWidthOfText");
function tv(e, t, n) {
	let r = e.append("text"), i = $_(r, 1, t);
	iv(i, [{
		content: n,
		type: "normal"
	}]);
	let a = i.node()?.getBoundingClientRect();
	return a && r.remove(), a;
}
i(tv, "computeDimensionOfText");
function nv(e, t, n, r = !1, a = !1) {
	let o = 1.1, s = t.append("g"), c = s.insert("rect").attr("class", "background").attr("style", "stroke: none"), l = s.append("text").attr("y", "-10.1");
	a && l.attr("text-anchor", "middle");
	let u = 0;
	for (let t of n) {
		let n = /* @__PURE__ */ i((t) => ev(s, o, t) <= e, "checkWidth"), r = n(t) ? [t] : J_(t, n);
		for (let e of r) iv($_(l, u, o, a), e), u++;
	}
	if (r) {
		let e = l.node().getBBox();
		return c.attr("x", e.x - 2).attr("y", e.y - 2).attr("width", e.width + 4).attr("height", e.height + 4), s.node();
	} else return l.node();
}
i(nv, "createFormattedText");
function rv(e) {
	return e.replace(/&(amp|lt|gt);/g, (e, t) => {
		switch (t) {
			case "amp": return "&";
			case "lt": return "<";
			case "gt": return ">";
			default: return e;
		}
	});
}
i(rv, "decodeHTMLEntities");
function iv(e, t) {
	e.text(""), t.forEach((t, n) => {
		let r = e.append("tspan").attr("font-style", t.type === "em" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", t.type === "strong" ? "bold" : "normal");
		n === 0 ? r.text(rv(t.content)) : r.text(" " + rv(t.content));
	});
}
i(iv, "updateTextContentAndStyles");
async function av(e, t = {}) {
	let n = [];
	e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, (e, r, i) => (n.push((async () => {
		let n = `${r}:${i}`;
		return await fg(n) ? await pg(n, void 0, { class: "label-icon" }) : `<i class='${Ln(e, t).replace(":", " ")}'></i>`;
	})()), e));
	let r = await Promise.all(n);
	return e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, () => r.shift() ?? "");
}
i(av, "replaceIconSubstring");
var ov = /* @__PURE__ */ i(async (e, t = "", { style: n = "", isTitle: r = !1, classes: i = "", useHtmlLabels: a = !0, markdown: o = !0, isNode: s = !0, width: l = 200, addSvgBackground: u = !1 } = {}, d) => {
	if (c.debug("XYZ createText", t, n, r, i, a, s, "addSvgBackground: ", u), a) {
		let r = await av(kh(o ? W_(t, d) : U_(t)), d), a = t.replace(/\\\\/g, "\\");
		return await Q_(e, {
			isNode: s,
			label: Qn(t) ? a : r,
			labelStyle: n.replace("fill:", "color:")
		}, l, i, u, d);
	} else {
		let i = kh(t.replace(/<br\s*\/?>/g, "<br/>")), a = nv(l, e, o ? H_(i.replace("<br>", "<br/>"), d) : V_(i), t ? u : !1, !s);
		if (s) {
			/stroke:/.exec(n) && (n = n.replace("stroke:", "lineColor:"));
			let e = n.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
			B(a).attr("style", e);
		} else {
			let e = n.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/background:/g, "fill:");
			B(a).select("rect").attr("style", e.replace(/background:/g, "fill:"));
			let t = n.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
			B(a).select("text").attr("style", t);
		}
		return r ? B(a).selectAll("tspan.text-outer-tspan").classed("title-row", !0) : B(a).selectAll("tspan.text-outer-tspan").classed("row", !0), a;
	}
}, "createText");
//#endregion
//#region ../../node_modules/.pnpm/roughjs@4.6.6/node_modules/roughjs/bundled/rough.esm.js
function sv(e, t, n) {
	if (e && e.length) {
		let [r, i] = t, a = Math.PI / 180 * n, o = Math.cos(a), s = Math.sin(a);
		for (let t of e) {
			let [e, n] = t;
			t[0] = (e - r) * o - (n - i) * s + r, t[1] = (e - r) * s + (n - i) * o + i;
		}
	}
}
function cv(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}
function lv(e, t, n, r = 1) {
	let i = n, a = Math.max(t, .1), o = e[0] && e[0][0] && typeof e[0][0] == "number" ? [e] : e, s = [0, 0];
	if (i) for (let e of o) sv(e, s, i);
	let c = function(e, t, n) {
		let r = [];
		for (let t of e) {
			let e = [...t];
			cv(e[0], e[e.length - 1]) || e.push([e[0][0], e[0][1]]), e.length > 2 && r.push(e);
		}
		let i = [];
		t = Math.max(t, .1);
		let a = [];
		for (let e of r) for (let t = 0; t < e.length - 1; t++) {
			let n = e[t], r = e[t + 1];
			if (n[1] !== r[1]) {
				let e = Math.min(n[1], r[1]);
				a.push({
					ymin: e,
					ymax: Math.max(n[1], r[1]),
					x: e === n[1] ? n[0] : r[0],
					islope: (r[0] - n[0]) / (r[1] - n[1])
				});
			}
		}
		if (a.sort(((e, t) => e.ymin < t.ymin ? -1 : e.ymin > t.ymin ? 1 : e.x < t.x ? -1 : e.x > t.x ? 1 : e.ymax === t.ymax ? 0 : (e.ymax - t.ymax) / Math.abs(e.ymax - t.ymax))), !a.length) return i;
		let o = [], s = a[0].ymin, c = 0;
		for (; o.length || a.length;) {
			if (a.length) {
				let e = -1;
				for (let t = 0; t < a.length && !(a[t].ymin > s); t++) e = t;
				a.splice(0, e + 1).forEach(((e) => {
					o.push({
						s,
						edge: e
					});
				}));
			}
			if (o = o.filter(((e) => !(e.edge.ymax <= s))), o.sort(((e, t) => e.edge.x === t.edge.x ? 0 : (e.edge.x - t.edge.x) / Math.abs(e.edge.x - t.edge.x))), (n !== 1 || c % t == 0) && o.length > 1) for (let e = 0; e < o.length; e += 2) {
				let t = e + 1;
				if (t >= o.length) break;
				let n = o[e].edge, r = o[t].edge;
				i.push([[Math.round(n.x), s], [Math.round(r.x), s]]);
			}
			s += n, o.forEach(((e) => {
				e.edge.x = e.edge.x + n * e.edge.islope;
			})), c++;
		}
		return i;
	}(o, a, r);
	if (i) {
		for (let e of o) sv(e, s, -i);
		(function(e, t, n) {
			let r = [];
			e.forEach(((e) => r.push(...e))), sv(r, t, n);
		})(c, s, -i);
	}
	return c;
}
function uv(e, t) {
	let n = t.hachureAngle + 90, r = t.hachureGap;
	r < 0 && (r = 4 * t.strokeWidth), r = Math.round(Math.max(r, .1));
	let i = 1;
	return t.roughness >= 1 && (t.randomizer?.next() || Math.random()) > .7 && (i = r), lv(e, r, n, i || 1);
}
var dv = class {
	constructor(e) {
		this.helper = e;
	}
	fillPolygons(e, t) {
		return this._fillPolygons(e, t);
	}
	_fillPolygons(e, t) {
		let n = uv(e, t);
		return {
			type: "fillSketch",
			ops: this.renderLines(n, t)
		};
	}
	renderLines(e, t) {
		let n = [];
		for (let r of e) n.push(...this.helper.doubleLineOps(r[0][0], r[0][1], r[1][0], r[1][1], t));
		return n;
	}
};
function fv(e) {
	let t = e[0], n = e[1];
	return Math.sqrt((t[0] - n[0]) ** 2 + (t[1] - n[1]) ** 2);
}
var pv = class extends dv {
	fillPolygons(e, t) {
		let n = t.hachureGap;
		n < 0 && (n = 4 * t.strokeWidth), n = Math.max(n, .1);
		let r = uv(e, Object.assign({}, t, { hachureGap: n })), i = Math.PI / 180 * t.hachureAngle, a = [], o = .5 * n * Math.cos(i), s = .5 * n * Math.sin(i);
		for (let [e, t] of r) fv([e, t]) && a.push([[e[0] - o, e[1] + s], [...t]], [[e[0] + o, e[1] - s], [...t]]);
		return {
			type: "fillSketch",
			ops: this.renderLines(a, t)
		};
	}
}, mv = class extends dv {
	fillPolygons(e, t) {
		let n = this._fillPolygons(e, t), r = Object.assign({}, t, { hachureAngle: t.hachureAngle + 90 }), i = this._fillPolygons(e, r);
		return n.ops = n.ops.concat(i.ops), n;
	}
}, hv = class {
	constructor(e) {
		this.helper = e;
	}
	fillPolygons(e, t) {
		let n = uv(e, t = Object.assign({}, t, { hachureAngle: 0 }));
		return this.dotsOnLines(n, t);
	}
	dotsOnLines(e, t) {
		let n = [], r = t.hachureGap;
		r < 0 && (r = 4 * t.strokeWidth), r = Math.max(r, .1);
		let i = t.fillWeight;
		i < 0 && (i = t.strokeWidth / 2);
		let a = r / 4;
		for (let o of e) {
			let e = fv(o), s = e / r, c = Math.ceil(s) - 1, l = e - c * r, u = (o[0][0] + o[1][0]) / 2 - r / 4, d = Math.min(o[0][1], o[1][1]);
			for (let e = 0; e < c; e++) {
				let o = d + l + e * r, s = u - a + 2 * Math.random() * a, c = o - a + 2 * Math.random() * a, f = this.helper.ellipse(s, c, i, i, t);
				n.push(...f.ops);
			}
		}
		return {
			type: "fillSketch",
			ops: n
		};
	}
}, gv = class {
	constructor(e) {
		this.helper = e;
	}
	fillPolygons(e, t) {
		let n = uv(e, t);
		return {
			type: "fillSketch",
			ops: this.dashedLine(n, t)
		};
	}
	dashedLine(e, t) {
		let n = t.dashOffset < 0 ? t.hachureGap < 0 ? 4 * t.strokeWidth : t.hachureGap : t.dashOffset, r = t.dashGap < 0 ? t.hachureGap < 0 ? 4 * t.strokeWidth : t.hachureGap : t.dashGap, i = [];
		return e.forEach(((e) => {
			let a = fv(e), o = Math.floor(a / (n + r)), s = (a + r - o * (n + r)) / 2, c = e[0], l = e[1];
			c[0] > l[0] && (c = e[1], l = e[0]);
			let u = Math.atan((l[1] - c[1]) / (l[0] - c[0]));
			for (let e = 0; e < o; e++) {
				let a = e * (n + r), o = a + n, l = [c[0] + a * Math.cos(u) + s * Math.cos(u), c[1] + a * Math.sin(u) + s * Math.sin(u)], d = [c[0] + o * Math.cos(u) + s * Math.cos(u), c[1] + o * Math.sin(u) + s * Math.sin(u)];
				i.push(...this.helper.doubleLineOps(l[0], l[1], d[0], d[1], t));
			}
		})), i;
	}
}, _v = class {
	constructor(e) {
		this.helper = e;
	}
	fillPolygons(e, t) {
		let n = t.hachureGap < 0 ? 4 * t.strokeWidth : t.hachureGap, r = t.zigzagOffset < 0 ? n : t.zigzagOffset, i = uv(e, t = Object.assign({}, t, { hachureGap: n + r }));
		return {
			type: "fillSketch",
			ops: this.zigzagLines(i, r, t)
		};
	}
	zigzagLines(e, t, n) {
		let r = [];
		return e.forEach(((e) => {
			let i = fv(e), a = Math.round(i / (2 * t)), o = e[0], s = e[1];
			o[0] > s[0] && (o = e[1], s = e[0]);
			let c = Math.atan((s[1] - o[1]) / (s[0] - o[0]));
			for (let e = 0; e < a; e++) {
				let i = 2 * e * t, a = 2 * (e + 1) * t, s = Math.sqrt(2 * t ** 2), l = [o[0] + i * Math.cos(c), o[1] + i * Math.sin(c)], u = [o[0] + a * Math.cos(c), o[1] + a * Math.sin(c)], d = [l[0] + s * Math.cos(c + Math.PI / 4), l[1] + s * Math.sin(c + Math.PI / 4)];
				r.push(...this.helper.doubleLineOps(l[0], l[1], d[0], d[1], n), ...this.helper.doubleLineOps(d[0], d[1], u[0], u[1], n));
			}
		})), r;
	}
}, vv = {}, yv = class {
	constructor(e) {
		this.seed = e;
	}
	next() {
		return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
	}
}, bv = 0, xv = 1, Sv = 2, Cv = {
	A: 7,
	a: 7,
	C: 6,
	c: 6,
	H: 1,
	h: 1,
	L: 2,
	l: 2,
	M: 2,
	m: 2,
	Q: 4,
	q: 4,
	S: 4,
	s: 4,
	T: 2,
	t: 2,
	V: 1,
	v: 1,
	Z: 0,
	z: 0
};
function wv(e, t) {
	return e.type === t;
}
function Tv(e) {
	let t = [], n = function(e) {
		let t = [];
		for (; e !== "";) if (e.match(/^([ \t\r\n,]+)/)) e = e.substr(RegExp.$1.length);
		else if (e.match(/^([aAcChHlLmMqQsStTvVzZ])/)) t[t.length] = {
			type: bv,
			text: RegExp.$1
		}, e = e.substr(RegExp.$1.length);
		else {
			if (!e.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return [];
			t[t.length] = {
				type: xv,
				text: `${parseFloat(RegExp.$1)}`
			}, e = e.substr(RegExp.$1.length);
		}
		return t[t.length] = {
			type: Sv,
			text: ""
		}, t;
	}(e), r = "BOD", i = 0, a = n[i];
	for (; !wv(a, Sv);) {
		let o = 0, s = [];
		if (r === "BOD") {
			if (a.text !== "M" && a.text !== "m") return Tv("M0,0" + e);
			i++, o = Cv[a.text], r = a.text;
		} else wv(a, xv) ? o = Cv[r] : (i++, o = Cv[a.text], r = a.text);
		if (!(i + o < n.length)) throw Error("Path data ended short");
		for (let e = i; e < i + o; e++) {
			let t = n[e];
			if (!wv(t, xv)) throw Error("Param not a number: " + r + "," + t.text);
			s[s.length] = +t.text;
		}
		if (typeof Cv[r] != "number") throw Error("Bad segment: " + r);
		{
			let e = {
				key: r,
				data: s
			};
			t.push(e), i += o, a = n[i], r === "M" && (r = "L"), r === "m" && (r = "l");
		}
	}
	return t;
}
function Ev(e) {
	let t = 0, n = 0, r = 0, i = 0, a = [];
	for (let { key: o, data: s } of e) switch (o) {
		case "M":
			a.push({
				key: "M",
				data: [...s]
			}), [t, n] = s, [r, i] = s;
			break;
		case "m":
			t += s[0], n += s[1], a.push({
				key: "M",
				data: [t, n]
			}), r = t, i = n;
			break;
		case "L":
			a.push({
				key: "L",
				data: [...s]
			}), [t, n] = s;
			break;
		case "l":
			t += s[0], n += s[1], a.push({
				key: "L",
				data: [t, n]
			});
			break;
		case "C":
			a.push({
				key: "C",
				data: [...s]
			}), t = s[4], n = s[5];
			break;
		case "c": {
			let e = s.map(((e, r) => r % 2 ? e + n : e + t));
			a.push({
				key: "C",
				data: e
			}), t = e[4], n = e[5];
			break;
		}
		case "Q":
			a.push({
				key: "Q",
				data: [...s]
			}), t = s[2], n = s[3];
			break;
		case "q": {
			let e = s.map(((e, r) => r % 2 ? e + n : e + t));
			a.push({
				key: "Q",
				data: e
			}), t = e[2], n = e[3];
			break;
		}
		case "A":
			a.push({
				key: "A",
				data: [...s]
			}), t = s[5], n = s[6];
			break;
		case "a":
			t += s[5], n += s[6], a.push({
				key: "A",
				data: [
					s[0],
					s[1],
					s[2],
					s[3],
					s[4],
					t,
					n
				]
			});
			break;
		case "H":
			a.push({
				key: "H",
				data: [...s]
			}), t = s[0];
			break;
		case "h":
			t += s[0], a.push({
				key: "H",
				data: [t]
			});
			break;
		case "V":
			a.push({
				key: "V",
				data: [...s]
			}), n = s[0];
			break;
		case "v":
			n += s[0], a.push({
				key: "V",
				data: [n]
			});
			break;
		case "S":
			a.push({
				key: "S",
				data: [...s]
			}), t = s[2], n = s[3];
			break;
		case "s": {
			let e = s.map(((e, r) => r % 2 ? e + n : e + t));
			a.push({
				key: "S",
				data: e
			}), t = e[2], n = e[3];
			break;
		}
		case "T":
			a.push({
				key: "T",
				data: [...s]
			}), t = s[0], n = s[1];
			break;
		case "t":
			t += s[0], n += s[1], a.push({
				key: "T",
				data: [t, n]
			});
			break;
		case "Z":
		case "z": a.push({
			key: "Z",
			data: []
		}), t = r, n = i;
	}
	return a;
}
function Dv(e) {
	let t = [], n = "", r = 0, i = 0, a = 0, o = 0, s = 0, c = 0;
	for (let { key: l, data: u } of e) {
		switch (l) {
			case "M":
				t.push({
					key: "M",
					data: [...u]
				}), [r, i] = u, [a, o] = u;
				break;
			case "C":
				t.push({
					key: "C",
					data: [...u]
				}), r = u[4], i = u[5], s = u[2], c = u[3];
				break;
			case "L":
				t.push({
					key: "L",
					data: [...u]
				}), [r, i] = u;
				break;
			case "H":
				r = u[0], t.push({
					key: "L",
					data: [r, i]
				});
				break;
			case "V":
				i = u[0], t.push({
					key: "L",
					data: [r, i]
				});
				break;
			case "S": {
				let e = 0, a = 0;
				n === "C" || n === "S" ? (e = r + (r - s), a = i + (i - c)) : (e = r, a = i), t.push({
					key: "C",
					data: [
						e,
						a,
						...u
					]
				}), s = u[0], c = u[1], r = u[2], i = u[3];
				break;
			}
			case "T": {
				let [e, a] = u, o = 0, l = 0;
				n === "Q" || n === "T" ? (o = r + (r - s), l = i + (i - c)) : (o = r, l = i);
				let d = r + 2 * (o - r) / 3, f = i + 2 * (l - i) / 3, p = e + 2 * (o - e) / 3, m = a + 2 * (l - a) / 3;
				t.push({
					key: "C",
					data: [
						d,
						f,
						p,
						m,
						e,
						a
					]
				}), s = o, c = l, r = e, i = a;
				break;
			}
			case "Q": {
				let [e, n, a, o] = u, l = r + 2 * (e - r) / 3, d = i + 2 * (n - i) / 3, f = a + 2 * (e - a) / 3, p = o + 2 * (n - o) / 3;
				t.push({
					key: "C",
					data: [
						l,
						d,
						f,
						p,
						a,
						o
					]
				}), s = e, c = n, r = a, i = o;
				break;
			}
			case "A": {
				let e = Math.abs(u[0]), n = Math.abs(u[1]), a = u[2], o = u[3], s = u[4], c = u[5], l = u[6];
				e === 0 || n === 0 ? (t.push({
					key: "C",
					data: [
						r,
						i,
						c,
						l,
						c,
						l
					]
				}), r = c, i = l) : (r !== c || i !== l) && (kv(r, i, c, l, e, n, a, o, s).forEach((function(e) {
					t.push({
						key: "C",
						data: e
					});
				})), r = c, i = l);
				break;
			}
			case "Z": t.push({
				key: "Z",
				data: []
			}), r = a, i = o;
		}
		n = l;
	}
	return t;
}
function Ov(e, t, n) {
	return [e * Math.cos(n) - t * Math.sin(n), e * Math.sin(n) + t * Math.cos(n)];
}
function kv(e, t, n, r, i, a, o, s, c, l) {
	let u = (d = o, Math.PI * d / 180);
	var d;
	let f = [], p = 0, m = 0, h = 0, g = 0;
	if (l) [p, m, h, g] = l;
	else {
		[e, t] = Ov(e, t, -u), [n, r] = Ov(n, r, -u);
		let o = (e - n) / 2, l = (t - r) / 2, d = o * o / (i * i) + l * l / (a * a);
		d > 1 && (d = Math.sqrt(d), i *= d, a *= d);
		let f = i * i, _ = a * a, v = f * _ - f * l * l - _ * o * o, y = f * l * l + _ * o * o, b = (s === c ? -1 : 1) * Math.sqrt(Math.abs(v / y));
		h = b * i * l / a + (e + n) / 2, g = b * -a * o / i + (t + r) / 2, p = Math.asin(parseFloat(((t - g) / a).toFixed(9))), m = Math.asin(parseFloat(((r - g) / a).toFixed(9))), e < h && (p = Math.PI - p), n < h && (m = Math.PI - m), p < 0 && (p = 2 * Math.PI + p), m < 0 && (m = 2 * Math.PI + m), c && p > m && (p -= 2 * Math.PI), !c && m > p && (m -= 2 * Math.PI);
	}
	let _ = m - p;
	if (Math.abs(_) > 120 * Math.PI / 180) {
		let e = m, t = n, s = r;
		m = c && m > p ? p + 120 * Math.PI / 180 * 1 : p + 120 * Math.PI / 180 * -1, f = kv(n = h + i * Math.cos(m), r = g + a * Math.sin(m), t, s, i, a, o, 0, c, [
			m,
			e,
			h,
			g
		]);
	}
	_ = m - p;
	let v = Math.cos(p), y = Math.sin(p), b = Math.cos(m), x = Math.sin(m), S = Math.tan(_ / 4), C = 4 / 3 * i * S, w = 4 / 3 * a * S, T = [e, t], E = [e + C * y, t - w * v], D = [n + C * x, r - w * b], O = [n, r];
	if (E[0] = 2 * T[0] - E[0], E[1] = 2 * T[1] - E[1], l) return [
		E,
		D,
		O
	].concat(f);
	{
		f = [
			E,
			D,
			O
		].concat(f);
		let e = [];
		for (let t = 0; t < f.length; t += 3) {
			let n = Ov(f[t][0], f[t][1], u), r = Ov(f[t + 1][0], f[t + 1][1], u), i = Ov(f[t + 2][0], f[t + 2][1], u);
			e.push([
				n[0],
				n[1],
				r[0],
				r[1],
				i[0],
				i[1]
			]);
		}
		return e;
	}
}
var Av = {
	randOffset: function(e, t) {
		return K(e, t);
	},
	randOffsetWithRange: function(e, t, n) {
		return Uv(e, t, n);
	},
	ellipse: function(e, t, n, r, i) {
		return Iv(e, t, i, Fv(n, r, i)).opset;
	},
	doubleLineOps: function(e, t, n, r, i) {
		return Wv(e, t, n, r, i, !0);
	}
};
function jv(e, t, n, r, i) {
	return {
		type: "path",
		ops: Wv(e, t, n, r, i)
	};
}
function Mv(e, t, n) {
	let r = (e || []).length;
	if (r > 2) {
		let i = [];
		for (let t = 0; t < r - 1; t++) i.push(...Wv(e[t][0], e[t][1], e[t + 1][0], e[t + 1][1], n));
		return t && i.push(...Wv(e[r - 1][0], e[r - 1][1], e[0][0], e[0][1], n)), {
			type: "path",
			ops: i
		};
	}
	return r === 2 ? jv(e[0][0], e[0][1], e[1][0], e[1][1], n) : {
		type: "path",
		ops: []
	};
}
function Nv(e, t, n, r, i) {
	return function(e, t) {
		return Mv(e, !0, t);
	}([
		[e, t],
		[e + n, t],
		[e + n, t + r],
		[e, t + r]
	], i);
}
function Pv(e, t) {
	if (e.length) {
		let n = typeof e[0][0] == "number" ? [e] : e, r = Kv(n[0], 1 * (1 + .2 * t.roughness), t), i = t.disableMultiStroke ? [] : Kv(n[0], 1.5 * (1 + .22 * t.roughness), Vv(t));
		for (let e = 1; e < n.length; e++) {
			let a = n[e];
			if (a.length) {
				let e = Kv(a, 1 * (1 + .2 * t.roughness), t), n = t.disableMultiStroke ? [] : Kv(a, 1.5 * (1 + .22 * t.roughness), Vv(t));
				for (let t of e) t.op !== "move" && r.push(t);
				for (let e of n) e.op !== "move" && i.push(e);
			}
		}
		return {
			type: "path",
			ops: r.concat(i)
		};
	}
	return {
		type: "path",
		ops: []
	};
}
function Fv(e, t, n) {
	let r = Math.sqrt(2 * Math.PI * Math.sqrt(((e / 2) ** 2 + (t / 2) ** 2) / 2)), i = Math.ceil(Math.max(n.curveStepCount, n.curveStepCount / Math.sqrt(200) * r)), a = 2 * Math.PI / i, o = Math.abs(e / 2), s = Math.abs(t / 2), c = 1 - n.curveFitting;
	return o += K(o * c, n), s += K(s * c, n), {
		increment: a,
		rx: o,
		ry: s
	};
}
function Iv(e, t, n, r) {
	let [i, a] = Jv(r.increment, e, t, r.rx, r.ry, 1, r.increment * Uv(.1, Uv(.4, 1, n), n), n), o = qv(i, null, n);
	if (!n.disableMultiStroke && n.roughness !== 0) {
		let [i] = Jv(r.increment, e, t, r.rx, r.ry, 1.5, 0, n), a = qv(i, null, n);
		o = o.concat(a);
	}
	return {
		estimatedPoints: a,
		opset: {
			type: "path",
			ops: o
		}
	};
}
function Lv(e, t, n, r, i, a, o, s, c) {
	let l = e, u = t, d = Math.abs(n / 2), f = Math.abs(r / 2);
	d += K(.01 * d, c), f += K(.01 * f, c);
	let p = i, m = a;
	for (; p < 0;) p += 2 * Math.PI, m += 2 * Math.PI;
	m - p > 2 * Math.PI && (p = 0, m = 2 * Math.PI);
	let h = 2 * Math.PI / c.curveStepCount, g = Math.min(h / 2, (m - p) / 2), _ = Yv(g, l, u, d, f, p, m, 1, c);
	if (!c.disableMultiStroke) {
		let e = Yv(g, l, u, d, f, p, m, 1.5, c);
		_.push(...e);
	}
	return o && (s ? _.push(...Wv(l, u, l + d * Math.cos(p), u + f * Math.sin(p), c), ...Wv(l, u, l + d * Math.cos(m), u + f * Math.sin(m), c)) : _.push({
		op: "lineTo",
		data: [l, u]
	}, {
		op: "lineTo",
		data: [l + d * Math.cos(p), u + f * Math.sin(p)]
	})), {
		type: "path",
		ops: _
	};
}
function Rv(e, t) {
	let n = Dv(Ev(Tv(e))), r = [], i = [0, 0], a = [0, 0];
	for (let { key: e, data: o } of n) switch (e) {
		case "M":
			a = [o[0], o[1]], i = [o[0], o[1]];
			break;
		case "L":
			r.push(...Wv(a[0], a[1], o[0], o[1], t)), a = [o[0], o[1]];
			break;
		case "C": {
			let [e, n, i, s, c, l] = o;
			r.push(...Xv(e, n, i, s, c, l, a, t)), a = [c, l];
			break;
		}
		case "Z": r.push(...Wv(a[0], a[1], i[0], i[1], t)), a = [i[0], i[1]];
	}
	return {
		type: "path",
		ops: r
	};
}
function zv(e, t) {
	let n = [];
	for (let r of e) if (r.length) {
		let e = t.maxRandomnessOffset || 0, i = r.length;
		if (i > 2) {
			n.push({
				op: "move",
				data: [r[0][0] + K(e, t), r[0][1] + K(e, t)]
			});
			for (let a = 1; a < i; a++) n.push({
				op: "lineTo",
				data: [r[a][0] + K(e, t), r[a][1] + K(e, t)]
			});
		}
	}
	return {
		type: "fillPath",
		ops: n
	};
}
function Bv(e, t) {
	return function(e, t) {
		let n = e.fillStyle || "hachure";
		if (!vv[n]) switch (n) {
			case "zigzag":
				vv[n] || (vv[n] = new pv(t));
				break;
			case "cross-hatch":
				vv[n] || (vv[n] = new mv(t));
				break;
			case "dots":
				vv[n] || (vv[n] = new hv(t));
				break;
			case "dashed":
				vv[n] || (vv[n] = new gv(t));
				break;
			case "zigzag-line":
				vv[n] || (vv[n] = new _v(t));
				break;
			default: n = "hachure", vv[n] || (vv[n] = new dv(t));
		}
		return vv[n];
	}(t, Av).fillPolygons(e, t);
}
function Vv(e) {
	let t = Object.assign({}, e);
	return t.randomizer = void 0, e.seed && (t.seed = e.seed + 1), t;
}
function Hv(e) {
	return e.randomizer ||= new yv(e.seed || 0), e.randomizer.next();
}
function Uv(e, t, n, r = 1) {
	return n.roughness * r * (Hv(n) * (t - e) + e);
}
function K(e, t, n = 1) {
	return Uv(-e, e, t, n);
}
function Wv(e, t, n, r, i, a = !1) {
	let o = a ? i.disableMultiStrokeFill : i.disableMultiStroke, s = Gv(e, t, n, r, i, !0, !1);
	if (o) return s;
	let c = Gv(e, t, n, r, i, !0, !0);
	return s.concat(c);
}
function Gv(e, t, n, r, i, a, o) {
	let s = (e - n) ** 2 + (t - r) ** 2, c = Math.sqrt(s), l = 1;
	l = c < 200 ? 1 : c > 500 ? .4 : -.0016668 * c + 1.233334;
	let u = i.maxRandomnessOffset || 0;
	u * u * 100 > s && (u = c / 10);
	let d = u / 2, f = .2 + .2 * Hv(i), p = i.bowing * i.maxRandomnessOffset * (r - t) / 200, m = i.bowing * i.maxRandomnessOffset * (e - n) / 200;
	p = K(p, i, l), m = K(m, i, l);
	let h = [], g = () => K(d, i, l), _ = () => K(u, i, l), v = i.preserveVertices;
	return a && (o ? h.push({
		op: "move",
		data: [e + (v ? 0 : g()), t + (v ? 0 : g())]
	}) : h.push({
		op: "move",
		data: [e + (v ? 0 : K(u, i, l)), t + (v ? 0 : K(u, i, l))]
	})), o ? h.push({
		op: "bcurveTo",
		data: [
			p + e + (n - e) * f + g(),
			m + t + (r - t) * f + g(),
			p + e + 2 * (n - e) * f + g(),
			m + t + 2 * (r - t) * f + g(),
			n + (v ? 0 : g()),
			r + (v ? 0 : g())
		]
	}) : h.push({
		op: "bcurveTo",
		data: [
			p + e + (n - e) * f + _(),
			m + t + (r - t) * f + _(),
			p + e + 2 * (n - e) * f + _(),
			m + t + 2 * (r - t) * f + _(),
			n + (v ? 0 : _()),
			r + (v ? 0 : _())
		]
	}), h;
}
function Kv(e, t, n) {
	if (!e.length) return [];
	let r = [];
	r.push([e[0][0] + K(t, n), e[0][1] + K(t, n)]), r.push([e[0][0] + K(t, n), e[0][1] + K(t, n)]);
	for (let i = 1; i < e.length; i++) r.push([e[i][0] + K(t, n), e[i][1] + K(t, n)]), i === e.length - 1 && r.push([e[i][0] + K(t, n), e[i][1] + K(t, n)]);
	return qv(r, null, n);
}
function qv(e, t, n) {
	let r = e.length, i = [];
	if (r > 3) {
		let a = [], o = 1 - n.curveTightness;
		i.push({
			op: "move",
			data: [e[1][0], e[1][1]]
		});
		for (let t = 1; t + 2 < r; t++) {
			let n = e[t];
			a[0] = [n[0], n[1]], a[1] = [n[0] + (o * e[t + 1][0] - o * e[t - 1][0]) / 6, n[1] + (o * e[t + 1][1] - o * e[t - 1][1]) / 6], a[2] = [e[t + 1][0] + (o * e[t][0] - o * e[t + 2][0]) / 6, e[t + 1][1] + (o * e[t][1] - o * e[t + 2][1]) / 6], a[3] = [e[t + 1][0], e[t + 1][1]], i.push({
				op: "bcurveTo",
				data: [
					a[1][0],
					a[1][1],
					a[2][0],
					a[2][1],
					a[3][0],
					a[3][1]
				]
			});
		}
		if (t && t.length === 2) {
			let e = n.maxRandomnessOffset;
			i.push({
				op: "lineTo",
				data: [t[0] + K(e, n), t[1] + K(e, n)]
			});
		}
	} else r === 3 ? (i.push({
		op: "move",
		data: [e[1][0], e[1][1]]
	}), i.push({
		op: "bcurveTo",
		data: [
			e[1][0],
			e[1][1],
			e[2][0],
			e[2][1],
			e[2][0],
			e[2][1]
		]
	})) : r === 2 && i.push(...Gv(e[0][0], e[0][1], e[1][0], e[1][1], n, !0, !0));
	return i;
}
function Jv(e, t, n, r, i, a, o, s) {
	let c = [], l = [];
	if (s.roughness === 0) {
		e /= 4, l.push([t + r * Math.cos(-e), n + i * Math.sin(-e)]);
		for (let a = 0; a <= 2 * Math.PI; a += e) {
			let e = [t + r * Math.cos(a), n + i * Math.sin(a)];
			c.push(e), l.push(e);
		}
		l.push([t + r * Math.cos(0), n + i * Math.sin(0)]), l.push([t + r * Math.cos(e), n + i * Math.sin(e)]);
	} else {
		let u = K(.5, s) - Math.PI / 2;
		l.push([K(a, s) + t + .9 * r * Math.cos(u - e), K(a, s) + n + .9 * i * Math.sin(u - e)]);
		let d = 2 * Math.PI + u - .01;
		for (let o = u; o < d; o += e) {
			let e = [K(a, s) + t + r * Math.cos(o), K(a, s) + n + i * Math.sin(o)];
			c.push(e), l.push(e);
		}
		l.push([K(a, s) + t + r * Math.cos(u + 2 * Math.PI + .5 * o), K(a, s) + n + i * Math.sin(u + 2 * Math.PI + .5 * o)]), l.push([K(a, s) + t + .98 * r * Math.cos(u + o), K(a, s) + n + .98 * i * Math.sin(u + o)]), l.push([K(a, s) + t + .9 * r * Math.cos(u + .5 * o), K(a, s) + n + .9 * i * Math.sin(u + .5 * o)]);
	}
	return [l, c];
}
function Yv(e, t, n, r, i, a, o, s, c) {
	let l = a + K(.1, c), u = [];
	u.push([K(s, c) + t + .9 * r * Math.cos(l - e), K(s, c) + n + .9 * i * Math.sin(l - e)]);
	for (let a = l; a <= o; a += e) u.push([K(s, c) + t + r * Math.cos(a), K(s, c) + n + i * Math.sin(a)]);
	return u.push([t + r * Math.cos(o), n + i * Math.sin(o)]), u.push([t + r * Math.cos(o), n + i * Math.sin(o)]), qv(u, null, c);
}
function Xv(e, t, n, r, i, a, o, s) {
	let c = [], l = [s.maxRandomnessOffset || 1, (s.maxRandomnessOffset || 1) + .3], u = [0, 0], d = s.disableMultiStroke ? 1 : 2, f = s.preserveVertices;
	for (let p = 0; p < d; p++) p === 0 ? c.push({
		op: "move",
		data: [o[0], o[1]]
	}) : c.push({
		op: "move",
		data: [o[0] + (f ? 0 : K(l[0], s)), o[1] + (f ? 0 : K(l[0], s))]
	}), u = f ? [i, a] : [i + K(l[p], s), a + K(l[p], s)], c.push({
		op: "bcurveTo",
		data: [
			e + K(l[p], s),
			t + K(l[p], s),
			n + K(l[p], s),
			r + K(l[p], s),
			u[0],
			u[1]
		]
	});
	return c;
}
function Zv(e) {
	return [...e];
}
function Qv(e, t = 0) {
	let n = e.length;
	if (n < 3) throw Error("A curve must have at least three points.");
	let r = [];
	if (n === 3) r.push(Zv(e[0]), Zv(e[1]), Zv(e[2]), Zv(e[2]));
	else {
		let n = [];
		n.push(e[0], e[0]);
		for (let t = 1; t < e.length; t++) n.push(e[t]), t === e.length - 1 && n.push(e[t]);
		let i = [], a = 1 - t;
		r.push(Zv(n[0]));
		for (let e = 1; e + 2 < n.length; e++) {
			let t = n[e];
			i[0] = [t[0], t[1]], i[1] = [t[0] + (a * n[e + 1][0] - a * n[e - 1][0]) / 6, t[1] + (a * n[e + 1][1] - a * n[e - 1][1]) / 6], i[2] = [n[e + 1][0] + (a * n[e][0] - a * n[e + 2][0]) / 6, n[e + 1][1] + (a * n[e][1] - a * n[e + 2][1]) / 6], i[3] = [n[e + 1][0], n[e + 1][1]], r.push(i[1], i[2], i[3]);
		}
	}
	return r;
}
function $v(e, t) {
	return (e[0] - t[0]) ** 2 + (e[1] - t[1]) ** 2;
}
function ey(e, t, n) {
	let r = $v(t, n);
	if (r === 0) return $v(e, t);
	let i = ((e[0] - t[0]) * (n[0] - t[0]) + (e[1] - t[1]) * (n[1] - t[1])) / r;
	return i = Math.max(0, Math.min(1, i)), $v(e, ty(t, n, i));
}
function ty(e, t, n) {
	return [e[0] + (t[0] - e[0]) * n, e[1] + (t[1] - e[1]) * n];
}
function ny(e, t, n, r) {
	let i = r || [];
	if (function(e, t) {
		let n = e[t + 0], r = e[t + 1], i = e[t + 2], a = e[t + 3], o = 3 * r[0] - 2 * n[0] - a[0];
		o *= o;
		let s = 3 * r[1] - 2 * n[1] - a[1];
		s *= s;
		let c = 3 * i[0] - 2 * a[0] - n[0];
		c *= c;
		let l = 3 * i[1] - 2 * a[1] - n[1];
		return l *= l, o < c && (o = c), s < l && (s = l), o + s;
	}(e, t) < n) {
		let n = e[t + 0];
		i.length ? (a = i[i.length - 1], o = n, Math.sqrt($v(a, o))) > 1 && i.push(n) : i.push(n), i.push(e[t + 3]);
	} else {
		let r = .5, a = e[t + 0], o = e[t + 1], s = e[t + 2], c = e[t + 3], l = ty(a, o, r), u = ty(o, s, r), d = ty(s, c, r), f = ty(l, u, r), p = ty(u, d, r), m = ty(f, p, r);
		ny([
			a,
			l,
			f,
			m
		], 0, n, i), ny([
			m,
			p,
			d,
			c
		], 0, n, i);
	}
	var a, o;
	return i;
}
function ry(e, t) {
	return iy(e, 0, e.length, t);
}
function iy(e, t, n, r, i) {
	let a = i || [], o = e[t], s = e[n - 1], c = 0, l = 1;
	for (let r = t + 1; r < n - 1; ++r) {
		let t = ey(e[r], o, s);
		t > c && (c = t, l = r);
	}
	return Math.sqrt(c) > r ? (iy(e, t, l + 1, r, a), iy(e, l, n, r, a)) : (a.length || a.push(o), a.push(s)), a;
}
function ay(e, t = .15, n) {
	let r = [], i = (e.length - 1) / 3;
	for (let n = 0; n < i; n++) ny(e, 3 * n, t, r);
	return n && n > 0 ? iy(r, 0, r.length, n) : r;
}
var oy = "none", sy = class {
	constructor(e) {
		this.defaultOptions = {
			maxRandomnessOffset: 2,
			roughness: 1,
			bowing: 1,
			stroke: "#000",
			strokeWidth: 1,
			curveTightness: 0,
			curveFitting: .95,
			curveStepCount: 9,
			fillStyle: "hachure",
			fillWeight: -1,
			hachureAngle: -41,
			hachureGap: -1,
			dashOffset: -1,
			dashGap: -1,
			zigzagOffset: -1,
			seed: 0,
			disableMultiStroke: !1,
			disableMultiStrokeFill: !1,
			preserveVertices: !1,
			fillShapeRoughnessGain: .8
		}, this.config = e || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
	}
	static newSeed() {
		return Math.floor(Math.random() * 2 ** 31);
	}
	_o(e) {
		return e ? Object.assign({}, this.defaultOptions, e) : this.defaultOptions;
	}
	_d(e, t, n) {
		return {
			shape: e,
			sets: t || [],
			options: n || this.defaultOptions
		};
	}
	line(e, t, n, r, i) {
		let a = this._o(i);
		return this._d("line", [jv(e, t, n, r, a)], a);
	}
	rectangle(e, t, n, r, i) {
		let a = this._o(i), o = [], s = Nv(e, t, n, r, a);
		if (a.fill) {
			let i = [
				[e, t],
				[e + n, t],
				[e + n, t + r],
				[e, t + r]
			];
			a.fillStyle === "solid" ? o.push(zv([i], a)) : o.push(Bv([i], a));
		}
		return a.stroke !== oy && o.push(s), this._d("rectangle", o, a);
	}
	ellipse(e, t, n, r, i) {
		let a = this._o(i), o = [], s = Fv(n, r, a), c = Iv(e, t, a, s);
		if (a.fill) if (a.fillStyle === "solid") {
			let n = Iv(e, t, a, s).opset;
			n.type = "fillPath", o.push(n);
		} else o.push(Bv([c.estimatedPoints], a));
		return a.stroke !== oy && o.push(c.opset), this._d("ellipse", o, a);
	}
	circle(e, t, n, r) {
		let i = this.ellipse(e, t, n, n, r);
		return i.shape = "circle", i;
	}
	linearPath(e, t) {
		let n = this._o(t);
		return this._d("linearPath", [Mv(e, !1, n)], n);
	}
	arc(e, t, n, r, i, a, o = !1, s) {
		let c = this._o(s), l = [], u = Lv(e, t, n, r, i, a, o, !0, c);
		if (o && c.fill) if (c.fillStyle === "solid") {
			let o = Object.assign({}, c);
			o.disableMultiStroke = !0;
			let s = Lv(e, t, n, r, i, a, !0, !1, o);
			s.type = "fillPath", l.push(s);
		} else l.push(function(e, t, n, r, i, a, o) {
			let s = e, c = t, l = Math.abs(n / 2), u = Math.abs(r / 2);
			l += K(.01 * l, o), u += K(.01 * u, o);
			let d = i, f = a;
			for (; d < 0;) d += 2 * Math.PI, f += 2 * Math.PI;
			f - d > 2 * Math.PI && (d = 0, f = 2 * Math.PI);
			let p = (f - d) / o.curveStepCount, m = [];
			for (let e = d; e <= f; e += p) m.push([s + l * Math.cos(e), c + u * Math.sin(e)]);
			return m.push([s + l * Math.cos(f), c + u * Math.sin(f)]), m.push([s, c]), Bv([m], o);
		}(e, t, n, r, i, a, c));
		return c.stroke !== oy && l.push(u), this._d("arc", l, c);
	}
	curve(e, t) {
		let n = this._o(t), r = [], i = Pv(e, n);
		if (n.fill && n.fill !== oy) if (n.fillStyle === "solid") {
			let t = Pv(e, Object.assign(Object.assign({}, n), {
				disableMultiStroke: !0,
				roughness: n.roughness ? n.roughness + n.fillShapeRoughnessGain : 0
			}));
			r.push({
				type: "fillPath",
				ops: this._mergedShape(t.ops)
			});
		} else {
			let t = [], i = e;
			if (i.length) {
				let e = typeof i[0][0] == "number" ? [i] : i;
				for (let r of e) r.length < 3 ? t.push(...r) : r.length === 3 ? t.push(...ay(Qv([
					r[0],
					r[0],
					r[1],
					r[2]
				]), 10, (1 + n.roughness) / 2)) : t.push(...ay(Qv(r), 10, (1 + n.roughness) / 2));
			}
			t.length && r.push(Bv([t], n));
		}
		return n.stroke !== oy && r.push(i), this._d("curve", r, n);
	}
	polygon(e, t) {
		let n = this._o(t), r = [], i = Mv(e, !0, n);
		return n.fill && (n.fillStyle === "solid" ? r.push(zv([e], n)) : r.push(Bv([e], n))), n.stroke !== oy && r.push(i), this._d("polygon", r, n);
	}
	path(e, t) {
		let n = this._o(t), r = [];
		if (!e) return this._d("path", r, n);
		e = (e || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
		let i = n.fill && n.fill !== "transparent" && n.fill !== oy, a = n.stroke !== oy, o = !!(n.simplification && n.simplification < 1), s = function(e, t, n) {
			let r = Dv(Ev(Tv(e))), i = [], a = [], o = [0, 0], s = [], c = () => {
				s.length >= 4 && a.push(...ay(s, t)), s = [];
			}, l = () => {
				c(), a.length && (i.push(a), a = []);
			};
			for (let { key: e, data: t } of r) switch (e) {
				case "M":
					l(), o = [t[0], t[1]], a.push(o);
					break;
				case "L":
					c(), a.push([t[0], t[1]]);
					break;
				case "C":
					if (!s.length) {
						let e = a.length ? a[a.length - 1] : o;
						s.push([e[0], e[1]]);
					}
					s.push([t[0], t[1]]), s.push([t[2], t[3]]), s.push([t[4], t[5]]);
					break;
				case "Z": c(), a.push([o[0], o[1]]);
			}
			if (l(), !n) return i;
			let u = [];
			for (let e of i) {
				let t = ry(e, n);
				t.length && u.push(t);
			}
			return u;
		}(e, 1, o ? 4 - 4 * (n.simplification || 1) : (1 + n.roughness) / 2), c = Rv(e, n);
		if (i) if (n.fillStyle === "solid") if (s.length === 1) {
			let t = Rv(e, Object.assign(Object.assign({}, n), {
				disableMultiStroke: !0,
				roughness: n.roughness ? n.roughness + n.fillShapeRoughnessGain : 0
			}));
			r.push({
				type: "fillPath",
				ops: this._mergedShape(t.ops)
			});
		} else r.push(zv(s, n));
		else r.push(Bv(s, n));
		return a && (o ? s.forEach(((e) => {
			r.push(Mv(e, !1, n));
		})) : r.push(c)), this._d("path", r, n);
	}
	opsToPath(e, t) {
		let n = "";
		for (let r of e.ops) {
			let e = typeof t == "number" && t >= 0 ? r.data.map(((e) => +e.toFixed(t))) : r.data;
			switch (r.op) {
				case "move":
					n += `M${e[0]} ${e[1]} `;
					break;
				case "bcurveTo":
					n += `C${e[0]} ${e[1]}, ${e[2]} ${e[3]}, ${e[4]} ${e[5]} `;
					break;
				case "lineTo": n += `L${e[0]} ${e[1]} `;
			}
		}
		return n.trim();
	}
	toPaths(e) {
		let t = e.sets || [], n = e.options || this.defaultOptions, r = [];
		for (let e of t) {
			let t = null;
			switch (e.type) {
				case "path":
					t = {
						d: this.opsToPath(e),
						stroke: n.stroke,
						strokeWidth: n.strokeWidth,
						fill: oy
					};
					break;
				case "fillPath":
					t = {
						d: this.opsToPath(e),
						stroke: oy,
						strokeWidth: 0,
						fill: n.fill || oy
					};
					break;
				case "fillSketch": t = this.fillSketch(e, n);
			}
			t && r.push(t);
		}
		return r;
	}
	fillSketch(e, t) {
		let n = t.fillWeight;
		return n < 0 && (n = t.strokeWidth / 2), {
			d: this.opsToPath(e),
			stroke: t.fill || oy,
			strokeWidth: n,
			fill: oy
		};
	}
	_mergedShape(e) {
		return e.filter(((e, t) => t === 0 || e.op !== "move"));
	}
}, cy = class {
	constructor(e, t) {
		this.canvas = e, this.ctx = this.canvas.getContext("2d"), this.gen = new sy(t);
	}
	draw(e) {
		let t = e.sets || [], n = e.options || this.getDefaultOptions(), r = this.ctx, i = e.options.fixedDecimalPlaceDigits;
		for (let a of t) switch (a.type) {
			case "path":
				r.save(), r.strokeStyle = n.stroke === "none" ? "transparent" : n.stroke, r.lineWidth = n.strokeWidth, n.strokeLineDash && r.setLineDash(n.strokeLineDash), n.strokeLineDashOffset && (r.lineDashOffset = n.strokeLineDashOffset), this._drawToContext(r, a, i), r.restore();
				break;
			case "fillPath": {
				r.save(), r.fillStyle = n.fill || "";
				let t = e.shape === "curve" || e.shape === "polygon" || e.shape === "path" ? "evenodd" : "nonzero";
				this._drawToContext(r, a, i, t), r.restore();
				break;
			}
			case "fillSketch": this.fillSketch(r, a, n);
		}
	}
	fillSketch(e, t, n) {
		let r = n.fillWeight;
		r < 0 && (r = n.strokeWidth / 2), e.save(), n.fillLineDash && e.setLineDash(n.fillLineDash), n.fillLineDashOffset && (e.lineDashOffset = n.fillLineDashOffset), e.strokeStyle = n.fill || "", e.lineWidth = r, this._drawToContext(e, t, n.fixedDecimalPlaceDigits), e.restore();
	}
	_drawToContext(e, t, n, r = "nonzero") {
		e.beginPath();
		for (let r of t.ops) {
			let t = typeof n == "number" && n >= 0 ? r.data.map(((e) => +e.toFixed(n))) : r.data;
			switch (r.op) {
				case "move":
					e.moveTo(t[0], t[1]);
					break;
				case "bcurveTo":
					e.bezierCurveTo(t[0], t[1], t[2], t[3], t[4], t[5]);
					break;
				case "lineTo": e.lineTo(t[0], t[1]);
			}
		}
		t.type === "fillPath" ? e.fill(r) : e.stroke();
	}
	get generator() {
		return this.gen;
	}
	getDefaultOptions() {
		return this.gen.defaultOptions;
	}
	line(e, t, n, r, i) {
		let a = this.gen.line(e, t, n, r, i);
		return this.draw(a), a;
	}
	rectangle(e, t, n, r, i) {
		let a = this.gen.rectangle(e, t, n, r, i);
		return this.draw(a), a;
	}
	ellipse(e, t, n, r, i) {
		let a = this.gen.ellipse(e, t, n, r, i);
		return this.draw(a), a;
	}
	circle(e, t, n, r) {
		let i = this.gen.circle(e, t, n, r);
		return this.draw(i), i;
	}
	linearPath(e, t) {
		let n = this.gen.linearPath(e, t);
		return this.draw(n), n;
	}
	polygon(e, t) {
		let n = this.gen.polygon(e, t);
		return this.draw(n), n;
	}
	arc(e, t, n, r, i, a, o = !1, s) {
		let c = this.gen.arc(e, t, n, r, i, a, o, s);
		return this.draw(c), c;
	}
	curve(e, t) {
		let n = this.gen.curve(e, t);
		return this.draw(n), n;
	}
	path(e, t) {
		let n = this.gen.path(e, t);
		return this.draw(n), n;
	}
}, ly = "http://www.w3.org/2000/svg", uy = class {
	constructor(e, t) {
		this.svg = e, this.gen = new sy(t);
	}
	draw(e) {
		let t = e.sets || [], n = e.options || this.getDefaultOptions(), r = this.svg.ownerDocument || window.document, i = r.createElementNS(ly, "g"), a = e.options.fixedDecimalPlaceDigits;
		for (let o of t) {
			let t = null;
			switch (o.type) {
				case "path":
					t = r.createElementNS(ly, "path"), t.setAttribute("d", this.opsToPath(o, a)), t.setAttribute("stroke", n.stroke), t.setAttribute("stroke-width", n.strokeWidth + ""), t.setAttribute("fill", "none"), n.strokeLineDash && t.setAttribute("stroke-dasharray", n.strokeLineDash.join(" ").trim()), n.strokeLineDashOffset && t.setAttribute("stroke-dashoffset", `${n.strokeLineDashOffset}`);
					break;
				case "fillPath":
					t = r.createElementNS(ly, "path"), t.setAttribute("d", this.opsToPath(o, a)), t.setAttribute("stroke", "none"), t.setAttribute("stroke-width", "0"), t.setAttribute("fill", n.fill || ""), e.shape !== "curve" && e.shape !== "polygon" || t.setAttribute("fill-rule", "evenodd");
					break;
				case "fillSketch": t = this.fillSketch(r, o, n);
			}
			t && i.appendChild(t);
		}
		return i;
	}
	fillSketch(e, t, n) {
		let r = n.fillWeight;
		r < 0 && (r = n.strokeWidth / 2);
		let i = e.createElementNS(ly, "path");
		return i.setAttribute("d", this.opsToPath(t, n.fixedDecimalPlaceDigits)), i.setAttribute("stroke", n.fill || ""), i.setAttribute("stroke-width", r + ""), i.setAttribute("fill", "none"), n.fillLineDash && i.setAttribute("stroke-dasharray", n.fillLineDash.join(" ").trim()), n.fillLineDashOffset && i.setAttribute("stroke-dashoffset", `${n.fillLineDashOffset}`), i;
	}
	get generator() {
		return this.gen;
	}
	getDefaultOptions() {
		return this.gen.defaultOptions;
	}
	opsToPath(e, t) {
		return this.gen.opsToPath(e, t);
	}
	line(e, t, n, r, i) {
		let a = this.gen.line(e, t, n, r, i);
		return this.draw(a);
	}
	rectangle(e, t, n, r, i) {
		let a = this.gen.rectangle(e, t, n, r, i);
		return this.draw(a);
	}
	ellipse(e, t, n, r, i) {
		let a = this.gen.ellipse(e, t, n, r, i);
		return this.draw(a);
	}
	circle(e, t, n, r) {
		let i = this.gen.circle(e, t, n, r);
		return this.draw(i);
	}
	linearPath(e, t) {
		let n = this.gen.linearPath(e, t);
		return this.draw(n);
	}
	polygon(e, t) {
		let n = this.gen.polygon(e, t);
		return this.draw(n);
	}
	arc(e, t, n, r, i, a, o = !1, s) {
		let c = this.gen.arc(e, t, n, r, i, a, o, s);
		return this.draw(c);
	}
	curve(e, t) {
		let n = this.gen.curve(e, t);
		return this.draw(n);
	}
	path(e, t) {
		let n = this.gen.path(e, t);
		return this.draw(n);
	}
}, q = {
	canvas: (e, t) => new cy(e, t),
	svg: (e, t) => new uy(e, t),
	generator: (e) => new sy(e),
	newSeed: () => sy.newSeed()
}, J = /* @__PURE__ */ i(async (e, t, n) => {
	let r, i = t.useHtmlLabels || tn(z()?.htmlLabels);
	r = n || "node default";
	let a = e.insert("g").attr("class", r).attr("id", t.domId || t.id), o = a.insert("g").attr("class", "label").attr("style", jh(t.labelStyle)), s;
	s = t.label === void 0 ? "" : typeof t.label == "string" ? t.label : t.label[0];
	let c = !!t.icon || !!t.img, l = t.labelType === "markdown", u = await ov(o, Ln(kh(s), z()), {
		useHtmlLabels: i,
		width: t.width || z().flowchart?.wrappingWidth,
		classes: l ? "markdown-node-label" : "",
		style: t.labelStyle,
		addSvgBackground: c,
		markdown: l
	}, z()), d = u.getBBox(), f = (t?.padding ?? 0) / 2;
	if (i) {
		let e = u.children[0], t = B(u);
		await Ph(e, s), d = e.getBoundingClientRect(), t.attr("width", d.width), t.attr("height", d.height);
	}
	return i ? o.attr("transform", "translate(" + -d.width / 2 + ", " + -d.height / 2 + ")") : o.attr("transform", "translate(0, " + -d.height / 2 + ")"), t.centerLabel && o.attr("transform", "translate(" + -d.width / 2 + ", " + -d.height / 2 + ")"), o.insert("rect", ":first-child"), {
		shapeSvg: a,
		bbox: d,
		halfPadding: f,
		label: o
	};
}, "labelHelper"), dy = /* @__PURE__ */ i(async (e, t, n) => {
	let r = n.useHtmlLabels ?? xn(z()), i = e.insert("g").attr("class", "label").attr("style", n.labelStyle || ""), a = await ov(i, Ln(kh(t), z()), {
		useHtmlLabels: r,
		width: n.width || z()?.flowchart?.wrappingWidth,
		style: n.labelStyle,
		addSvgBackground: !!n.icon || !!n.img
	}), o = a.getBBox(), s = n.padding / 2;
	if (xn(z())) {
		let e = a.children[0], t = B(a);
		o = e.getBoundingClientRect(), t.attr("width", o.width), t.attr("height", o.height);
	}
	return r ? i.attr("transform", "translate(" + -o.width / 2 + ", " + -o.height / 2 + ")") : i.attr("transform", "translate(0, " + -o.height / 2 + ")"), n.centerLabel && i.attr("transform", "translate(" + -o.width / 2 + ", " + -o.height / 2 + ")"), i.insert("rect", ":first-child"), {
		shapeSvg: e,
		bbox: o,
		halfPadding: s,
		label: i
	};
}, "insertLabel"), Y = /* @__PURE__ */ i((e, t) => {
	let n = t.node().getBBox();
	e.width = n.width, e.height = n.height;
}, "updateNodeBounds"), X = /* @__PURE__ */ i((e, t) => (e.look === "handDrawn" ? "rough-node" : "node") + " " + e.cssClasses + " " + (t || ""), "getNodeClasses");
function Z(e) {
	let t = e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x},${e.y}`);
	return t.push("Z"), t.join(" ");
}
i(Z, "createPathFromPoints");
function fy(e, t, n, r, i, a) {
	let o = [], s = n - e, c = r - t, l = s / a, u = 2 * Math.PI / l, d = t + c / 2;
	for (let t = 0; t <= 50; t++) {
		let n = e + t / 50 * s, r = d + i * Math.sin(u * (n - e));
		o.push({
			x: n,
			y: r
		});
	}
	return o;
}
i(fy, "generateFullSineWavePoints");
function py(e, t, n, r, i, a) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: -a,
			y: -l
		});
	}
	return o;
}
i(py, "generateCirclePoints");
function my(e) {
	let t = Array.from(e.childNodes).filter((e) => e.tagName === "path"), n = document.createElementNS("http://www.w3.org/2000/svg", "path"), r = t.map((e) => e.getAttribute("d")).filter((e) => e !== null).join(" ");
	n.setAttribute("d", r);
	let a = t.find((e) => e.getAttribute("fill") !== "none"), o = t.find((e) => e.getAttribute("stroke") !== "none"), s = /* @__PURE__ */ i((e, t) => e?.getAttribute(t) ?? void 0, "getAttr");
	if (a) {
		let e = {
			fill: s(a, "fill"),
			"fill-opacity": s(a, "fill-opacity") ?? "1"
		};
		Object.entries(e).forEach(([e, t]) => {
			t && n.setAttribute(e, t);
		});
	}
	if (o) {
		let e = {
			stroke: s(o, "stroke"),
			"stroke-width": s(o, "stroke-width") ?? "1",
			"stroke-opacity": s(o, "stroke-opacity") ?? "1"
		};
		Object.entries(e).forEach(([e, t]) => {
			t && n.setAttribute(e, t);
		});
	}
	let c = document.createElementNS("http://www.w3.org/2000/svg", "g");
	return c.appendChild(n), c;
}
i(my, "mergePaths");
var hy = /* @__PURE__ */ i((e, t) => {
	var n = e.x, r = e.y, i = t.x - n, a = t.y - r, o = e.width / 2, s = e.height / 2, c, l;
	return Math.abs(a) * o > Math.abs(i) * s ? (a < 0 && (s = -s), c = a === 0 ? 0 : s * i / a, l = s) : (i < 0 && (o = -o), c = o, l = i === 0 ? 0 : o * a / i), {
		x: n + c,
		y: r + l
	};
}, "intersectRect"), gy = /* @__PURE__ */ i(async (e, t, n, r = !1, i = !1) => {
	let a = t || "";
	typeof a == "object" && (a = a[0]);
	let o = z(), s = xn(o);
	return await ov(e, a, {
		style: n,
		isTitle: r,
		useHtmlLabels: s,
		markdown: !1,
		isNode: i,
		width: Infinity
	}, o);
}, "createLabel"), _y = /* @__PURE__ */ i((e, t, n, r, i) => [
	"M",
	e + i,
	t,
	"H",
	e + n - i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e + n,
	t + i,
	"V",
	t + r - i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e + n - i,
	t + r,
	"H",
	e + i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e,
	t + r - i,
	"V",
	t + i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e + i,
	t,
	"Z"
].join(" "), "createRoundedRectPathD"), vy = /* @__PURE__ */ i(async (e, t) => {
	let n = z(), { themeVariables: r, handDrawnSeed: i } = n, { clusterBkg: a, clusterBorder: o } = r, s = o, { labelStyles: l, nodeStyles: u, borderStyles: d, backgroundStyles: f } = H(t), p = e.insert("g").attr("class", "cluster swimlane " + (t.cssClasses || "")).attr("id", t.id).attr("data-id", t.id).attr("data-et", "cluster").attr("data-look", t.look), m = tn(n.flowchart.htmlLabels), h = t.direction === "LR", g = p.insert("g").attr("class", "cluster-label swimlane-label"), _ = await ov(g, t.label, {
		style: t.labelStyle,
		useHtmlLabels: m,
		isNode: !0,
		width: t.width
	}), v = _.getBBox();
	if (m) {
		let e = _.children[0], t = B(_);
		v = e.getBoundingClientRect(), t.attr("width", v.width), t.attr("height", v.height);
	}
	let y = t.padding ?? 0, b = t.width <= v.width + y ? v.width + y : t.width;
	t.width <= v.width + y ? t.diff = (b - t.width) / 2 - y : t.diff = -y;
	let x = t.height, S = t.y - x / 2, C = t.y + x / 2, w = t.x - b / 2, T = t.swimlaneContentTop === void 0 ? S + x / 3 : t.swimlaneContentTop, E = h ? 4 : 0, D = v.height + 2 * E, O, k;
	if (h) {
		let e = Math.max(D, v.height + 2 * E), n = w + e, r = Math.max(0, b - e);
		if (t.look === "handDrawn") {
			let o = q.svg(p), c = U(t, {
				roughness: .7,
				fill: a,
				stroke: s,
				fillWeight: 3,
				seed: i
			}), l = U(t, {
				roughness: .7,
				fill: "none",
				stroke: s,
				seed: i
			}), u = o.rectangle(w, S, e, x, c);
			O = p.insert(() => u, ":first-child");
			let m = o.rectangle(n, S, r, x, l);
			k = p.insert(() => m, ":first-child"), O.select("path:nth-child(2)").attr("style", d.join(";")), O.select("path").attr("style", f.join(";").replace("fill", "stroke"));
		} else O = p.insert("rect", ":first-child"), k = p.insert("rect", ":first-child"), O.attr("class", "swimlane-title").attr("style", u).attr("x", w).attr("y", S).attr("width", e).attr("height", x).attr("fill", a).attr("stroke", s), k.attr("class", "swimlane-body").attr("style", u).attr("x", n).attr("y", S).attr("width", r).attr("height", x).attr("fill", "none").attr("stroke", s);
		let o = w + e / 2, c = t.y;
		g.attr("transform", `translate(${o}, ${c}) rotate(-90) translate(${-v.width / 2}, ${-v.height / 2})`);
	} else {
		let e = Math.max(0, T - S), n = Math.min(D, e), r = S + n, o = Math.max(0, C - r), c = t.x - b / 2;
		if (t.look === "handDrawn") {
			let e = q.svg(p), l = U(t, {
				roughness: .7,
				fill: a,
				stroke: s,
				fillWeight: 3,
				seed: i
			}), u = U(t, {
				roughness: .7,
				fill: "none",
				stroke: s,
				seed: i
			}), m = e.rectangle(c, S, b, n, l);
			O = p.insert(() => m, ":first-child");
			let h = e.rectangle(c, r, b, o, u);
			k = p.insert(() => h, ":first-child"), O.select("path:nth-child(2)").attr("style", d.join(";")), O.select("path").attr("style", f.join(";").replace("fill", "stroke"));
		} else O = p.insert("rect", ":first-child"), k = p.insert("rect", ":first-child"), O.attr("class", "swimlane-title").attr("style", u).attr("x", c).attr("y", S).attr("width", b).attr("height", n).attr("fill", a).attr("stroke", s), k.attr("class", "swimlane-body").attr("style", u).attr("x", c).attr("y", r).attr("width", b).attr("height", o).attr("fill", "none").attr("stroke", s);
		let l = t.x - v.width / 2, m = S + (n - v.height) / 2;
		g.attr("transform", `translate(${l}, ${m})`);
	}
	if (c.trace("Swimlane data ", t, JSON.stringify(t)), l) {
		let e = g.select("span");
		e && e.attr("style", l);
	}
	return t.offsetX = 0, t.width = b, t.height = x, t.offsetY = v.height - y / 2, t.intersect = function(e) {
		return hy(t, e);
	}, {
		cluster: p,
		labelBBox: v
	};
}, "swimlane"), yy = /* @__PURE__ */ i(async (e, t) => {
	c.info("Creating subgraph rect for ", t.id, t);
	let n = z(), { themeVariables: r, handDrawnSeed: i } = n, { clusterBkg: a, clusterBorder: o } = r, { labelStyles: s, nodeStyles: l, borderStyles: u, backgroundStyles: d } = H(t), f = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), p = xn(n), m = f.insert("g").attr("class", "cluster-label "), h;
	h = t.labelType === "markdown" ? await ov(m, t.label, {
		style: t.labelStyle,
		useHtmlLabels: p,
		isNode: !0,
		width: t.width
	}) : await gy(m, t.label, t.labelStyle || "", !1, !0);
	let g = h.getBBox();
	if (xn(n)) {
		let e = h.children[0], t = B(h);
		g = e.getBoundingClientRect(), t.attr("width", g.width), t.attr("height", g.height);
	}
	let _ = t.width <= g.width + t.padding ? g.width + t.padding : t.width;
	t.width <= g.width + t.padding ? t.diff = (_ - t.width) / 2 - t.padding : t.diff = -t.padding;
	let v = t.height, y = t.x - _ / 2, b = t.y - v / 2;
	c.trace("Data ", t, JSON.stringify(t));
	let x;
	if (t.look === "handDrawn") {
		let e = q.svg(f), n = U(t, {
			roughness: .7,
			fill: a,
			stroke: o,
			fillWeight: 3,
			seed: i
		}), r = e.path(_y(y, b, _, v, 0), n);
		x = f.insert(() => (c.debug("Rough node insert CXC", r), r), ":first-child"), x.select("path:nth-child(2)").attr("style", u.join(";")), x.select("path").attr("style", d.join(";").replace("fill", "stroke"));
	} else x = f.insert("rect", ":first-child"), x.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", y).attr("y", b).attr("width", _).attr("height", v);
	let { subGraphTitleTopMargin: S } = Nh(n);
	if (m.attr("transform", `translate(${t.x - g.width / 2}, ${t.y - t.height / 2 + S})`), s) {
		let e = m.select("span");
		e && e.attr("style", s);
	}
	let C = x.node().getBBox();
	return t.offsetX = 0, t.width = C.width, t.height = C.height, t.offsetY = g.height - t.padding / 2, t.intersect = function(e) {
		return hy(t, e);
	}, {
		cluster: f,
		labelBBox: g
	};
}, "rect"), by = {
	rect: yy,
	squareRect: yy,
	roundedWithTitle: /* @__PURE__ */ i(async (e, t) => {
		let n = z(), { themeVariables: r, handDrawnSeed: i } = n, { altBackground: a, compositeBackground: o, compositeTitleBackground: s, nodeBorder: c } = r, l = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-id", t.id).attr("data-look", t.look), u = l.insert("g", ":first-child"), d = l.insert("g").attr("class", "cluster-label"), f = l.append("rect"), p = await gy(d, t.label, t.labelStyle, void 0, !0), m = p.getBBox();
		if (xn(n)) {
			let e = p.children[0], t = B(p);
			m = e.getBoundingClientRect(), t.attr("width", m.width), t.attr("height", m.height);
		}
		let h = 0 * t.padding, g = h / 2, _ = (t.width <= m.width + t.padding ? m.width + t.padding : t.width) + h;
		t.width <= m.width + t.padding ? t.diff = (_ - t.width) / 2 - t.padding : t.diff = -t.padding;
		let v = t.height + h, y = t.height + h - m.height - 6, b = t.x - _ / 2, x = t.y - v / 2;
		t.width = _;
		let S = t.y - t.height / 2 - g + m.height + 2, C;
		if (t.look === "handDrawn") {
			let e = t.cssClasses.includes("statediagram-cluster-alt"), n = q.svg(l), r = t.rx || t.ry ? n.path(_y(b, x, _, v, 10), {
				roughness: .7,
				fill: s,
				fillStyle: "solid",
				stroke: c,
				seed: i
			}) : n.rectangle(b, x, _, v, { seed: i });
			C = l.insert(() => r, ":first-child");
			let u = n.rectangle(b, S, _, y, {
				fill: e ? a : o,
				fillStyle: e ? "hachure" : "solid",
				stroke: c,
				seed: i
			});
			C = l.insert(() => r, ":first-child"), f = l.insert(() => u);
		} else C = u.insert("rect", ":first-child"), C.attr("class", "outer").attr("x", b).attr("y", x).attr("width", _).attr("height", v).attr("data-look", t.look), f.attr("class", "inner").attr("x", b).attr("y", S).attr("width", _).attr("height", y);
		return d.attr("transform", `translate(${t.x - m.width / 2}, ${x + 1 - (xn(n) ? 0 : 3)})`), t.height = C.node().getBBox().height, t.offsetX = 0, t.offsetY = m.height - t.padding / 2, t.labelBBox = m, t.intersect = function(e) {
			return hy(t, e);
		}, {
			cluster: l,
			labelBBox: m
		};
	}, "roundedWithTitle"),
	noteGroup: /* @__PURE__ */ i((e, t) => {
		let n = e.insert("g").attr("class", "note-cluster").attr("id", t.domId), r = n.insert("rect", ":first-child"), i = 0 * t.padding, a = i / 2;
		r.attr("rx", t.rx).attr("ry", t.ry).attr("x", t.x - t.width / 2 - a).attr("y", t.y - t.height / 2 - a).attr("width", t.width + i).attr("height", t.height + i).attr("fill", "none");
		let o = r.node().getBBox();
		return t.width = o.width, t.height = o.height, t.intersect = function(e) {
			return hy(t, e);
		}, {
			cluster: n,
			labelBBox: {
				width: 0,
				height: 0
			}
		};
	}, "noteGroup"),
	divider: /* @__PURE__ */ i((e, t) => {
		let { themeVariables: n, handDrawnSeed: r } = z(), { nodeBorder: i } = n, a = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-look", t.look), o = a.insert("g", ":first-child"), s = 0 * t.padding, c = t.width + s;
		t.diff = -t.padding;
		let l = t.height + s, u = t.x - c / 2, d = t.y - l / 2;
		t.width = c;
		let f;
		if (t.look === "handDrawn") {
			let e = q.svg(a).rectangle(u, d, c, l, {
				fill: "lightgrey",
				roughness: .5,
				strokeLineDash: [5],
				stroke: i,
				seed: r
			});
			f = a.insert(() => e, ":first-child");
		} else {
			f = o.insert("rect", ":first-child");
			let e = "outer";
			e = (t.look, "divider"), f.attr("class", e).attr("x", u).attr("y", d).attr("width", c).attr("height", l).attr("data-look", t.look);
		}
		return t.height = f.node().getBBox().height, t.offsetX = 0, t.offsetY = 0, t.intersect = function(e) {
			return hy(t, e);
		}, {
			cluster: a,
			labelBBox: {}
		};
	}, "divider"),
	kanbanSection: /* @__PURE__ */ i(async (e, t) => {
		c.info("Creating subgraph rect for ", t.id, t);
		let n = z(), { themeVariables: r, handDrawnSeed: i } = n, { clusterBkg: a, clusterBorder: o } = r, { labelStyles: s, nodeStyles: l, borderStyles: u, backgroundStyles: d } = H(t), f = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), p = xn(n), m = f.insert("g").attr("class", "cluster-label "), h = await ov(m, t.label, {
			style: t.labelStyle,
			useHtmlLabels: p,
			isNode: !0,
			width: t.width
		}), g = h.getBBox();
		if (xn(n)) {
			let e = h.children[0], t = B(h);
			g = e.getBoundingClientRect(), t.attr("width", g.width), t.attr("height", g.height);
		}
		let _ = t.width <= g.width + t.padding ? g.width + t.padding : t.width;
		t.width <= g.width + t.padding ? t.diff = (_ - t.width) / 2 - t.padding : t.diff = -t.padding;
		let v = t.height, y = t.x - _ / 2, b = t.y - v / 2;
		c.trace("Data ", t, JSON.stringify(t));
		let x;
		if (t.look === "handDrawn") {
			let e = q.svg(f), n = U(t, {
				roughness: .7,
				fill: a,
				stroke: o,
				fillWeight: 4,
				seed: i
			}), r = e.path(_y(y, b, _, v, t.rx), n);
			x = f.insert(() => (c.debug("Rough node insert CXC", r), r), ":first-child"), x.select("path:nth-child(2)").attr("style", u.join(";")), x.select("path").attr("style", d.join(";").replace("fill", "stroke"));
		} else x = f.insert("rect", ":first-child"), x.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", y).attr("y", b).attr("width", _).attr("height", v);
		let { subGraphTitleTopMargin: S } = Nh(n);
		if (m.attr("transform", `translate(${t.x - g.width / 2}, ${t.y - t.height / 2 + S})`), s) {
			let e = m.select("span");
			e && e.attr("style", s);
		}
		let C = x.node().getBBox();
		return t.offsetX = 0, t.width = C.width, t.height = C.height, t.offsetY = g.height - t.padding / 2, t.intersect = function(e) {
			return hy(t, e);
		}, {
			cluster: f,
			labelBBox: g
		};
	}, "kanbanSection"),
	swimlane: vy
}, xy = /* @__PURE__ */ new Map(), Sy = /* @__PURE__ */ i(async (e, t) => {
	let n = await by[t.shape || "rect"](e, t);
	return xy.set(t.id, n), n;
}, "insertCluster"), Cy = /* @__PURE__ */ i(() => {
	xy = /* @__PURE__ */ new Map();
}, "clear");
function wy(e, t) {
	return e.intersect(t);
}
i(wy, "intersectNode");
var Ty = wy;
function Ey(e, t, n, r) {
	var i = e.x, a = e.y, o = i - r.x, s = a - r.y, c = Math.sqrt(t * t * s * s + n * n * o * o), l = Math.abs(t * n * o / c);
	r.x < i && (l = -l);
	var u = Math.abs(t * n * s / c);
	return r.y < a && (u = -u), {
		x: i + l,
		y: a + u
	};
}
i(Ey, "intersectEllipse");
var Dy = Ey;
function Oy(e, t, n) {
	return Dy(e, t, t, n);
}
i(Oy, "intersectCircle");
var ky = Oy;
function Ay(e, t, n, r) {
	{
		let i = t.y - e.y, a = e.x - t.x, o = t.x * e.y - e.x * t.y, s = i * n.x + a * n.y + o, c = i * r.x + a * r.y + o, l = 1e-6;
		if (s !== 0 && c !== 0 && jy(s, c)) return;
		let u = r.y - n.y, d = n.x - r.x, f = r.x * n.y - n.x * r.y, p = u * e.x + d * e.y + f, m = u * t.x + d * t.y + f;
		if (Math.abs(p) < l && Math.abs(m) < l && jy(p, m)) return;
		let h = i * d - u * a;
		if (h === 0) return;
		let g = Math.abs(h / 2), _ = a * f - d * o, v = _ < 0 ? (_ - g) / h : (_ + g) / h;
		return _ = u * o - i * f, {
			x: v,
			y: _ < 0 ? (_ - g) / h : (_ + g) / h
		};
	}
}
i(Ay, "intersectLine");
function jy(e, t) {
	return e * t > 0;
}
i(jy, "sameSign");
var My = Ay;
function Ny(e, t, n) {
	let r = e.x, i = e.y, a = [], o = Infinity, s = Infinity;
	typeof t.forEach == "function" ? t.forEach(function(e) {
		o = Math.min(o, e.x), s = Math.min(s, e.y);
	}) : (o = Math.min(o, t.x), s = Math.min(s, t.y));
	let c = r - e.width / 2 - o, l = i - e.height / 2 - s;
	for (let r = 0; r < t.length; r++) {
		let i = t[r], o = t[r < t.length - 1 ? r + 1 : 0], s = My(e, n, {
			x: c + i.x,
			y: l + i.y
		}, {
			x: c + o.x,
			y: l + o.y
		});
		s && a.push(s);
	}
	return a.length ? (a.length > 1 && a.sort(function(e, t) {
		let r = e.x - n.x, i = e.y - n.y, a = Math.sqrt(r * r + i * i), o = t.x - n.x, s = t.y - n.y, c = Math.sqrt(o * o + s * s);
		return a < c ? -1 : a === c ? 0 : 1;
	}), a[0]) : e;
}
i(Ny, "intersectPolygon");
var Q = {
	node: Ty,
	circle: ky,
	ellipse: Dy,
	polygon: Ny,
	rect: hy
};
function Py(e, t) {
	let { labelStyles: n } = H(t);
	t.labelStyle = n;
	let r = X(t), i = r;
	r || (i = "anchor");
	let a = e.insert("g").attr("class", i).attr("id", t.domId || t.id), { cssStyles: o } = t, s = q.svg(a), l = U(t, {
		fill: "black",
		stroke: "none",
		fillStyle: "solid"
	});
	t.look !== "handDrawn" && (l.roughness = 0);
	let u = s.circle(0, 0, 2, l), d = a.insert(() => u, ":first-child");
	return d.attr("class", "anchor").attr("style", jh(o)), Y(t, d), t.intersect = function(e) {
		return c.info("Circle intersect", t, 1, e), Q.circle(t, 1, e);
	}, a;
}
i(Py, "anchor");
function Fy(e, t, n, r, i, a, o) {
	let s = (e + n) / 2, c = (t + r) / 2, l = Math.atan2(r - t, n - e), u = (n - e) / 2, d = (r - t) / 2, f = u / i, p = d / a, m = Math.sqrt(f ** 2 + p ** 2);
	if (m > 1) throw Error("The given radii are too small to create an arc between the points.");
	let h = Math.sqrt(1 - m ** 2), g = s + h * a * Math.sin(l) * (o ? -1 : 1), _ = c - h * i * Math.cos(l) * (o ? -1 : 1), v = Math.atan2((t - _) / a, (e - g) / i), y = Math.atan2((r - _) / a, (n - g) / i) - v;
	o && y < 0 && (y += 2 * Math.PI), !o && y > 0 && (y -= 2 * Math.PI);
	let b = [];
	for (let e = 0; e < 20; e++) {
		let t = v + e / 19 * y, n = g + i * Math.cos(t), r = _ + a * Math.sin(t);
		b.push({
			x: n,
			y: r
		});
	}
	return b;
}
i(Fy, "generateArcPoints");
function Iy(e, t, n) {
	let [r, i] = [t, n].sort((e, t) => t - e);
	return i * (1 - Math.sqrt(1 - (e / r / 2) ** 2));
}
i(Iy, "calculateArcSagitta");
async function Ly(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let a = t.padding ?? 0, o = t.look === "neo" ? 16 : a, s = t.look === "neo" ? 12 : a, c = /* @__PURE__ */ i((e) => e + s, "calcTotalHeight"), l = /* @__PURE__ */ i((e) => {
		let t = e / 2;
		return [t / (2.5 + e / 50), t];
	}, "calcEllipseRadius"), { shapeSvg: u, bbox: d } = await J(e, t, X(t)), f = c(t?.height ? t?.height : d.height), [p, m] = l(f), h = Iy(f, p, m), g = (t?.width ? t?.width : d.width) + o * 2 + h - h, _ = f, { cssStyles: v } = t, y = [
		{
			x: g / 2,
			y: -_ / 2
		},
		{
			x: -g / 2,
			y: -_ / 2
		},
		...Fy(-g / 2, -_ / 2, -g / 2, _ / 2, p, m, !1),
		{
			x: g / 2,
			y: _ / 2
		},
		...Fy(g / 2, _ / 2, g / 2, -_ / 2, p, m, !0)
	], b = q.svg(u), x = U(t, {});
	t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
	let S = Z(y), C = b.path(S, x), w = u.insert(() => C, ":first-child");
	return w.attr("class", "basic label-container outer-path"), v && t.look !== "handDrawn" && w.selectAll("path").attr("style", v), r && t.look !== "handDrawn" && w.selectAll("path").attr("style", r), w.attr("transform", `translate(${p / 2}, 0)`), Y(t, w), t.intersect = function(e) {
		return Q.polygon(t, y, e);
	}, u;
}
i(Ly, "bowTieRect");
function Ry(e, t, n, r) {
	return e.insert("polygon", ":first-child").attr("points", r.map(function(e) {
		return e.x + "," + e.y;
	}).join(" ")).attr("class", "label-container").attr("transform", "translate(" + -t / 2 + "," + n / 2 + ")");
}
i(Ry, "insertPolygonShape");
var zy = 12;
async function By(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 28 : i, o = t.look === "neo" ? 24 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.width ?? c.width) + (t.look === "neo" ? a * 2 : a + zy), u = (t?.height ?? c.height) + (t.look === "neo" ? o * 2 : o), d = l, f = -u, p = [
		{
			x: 0 + zy,
			y: f
		},
		{
			x: d,
			y: f
		},
		{
			x: d,
			y: 0
		},
		{
			x: 0,
			y: 0
		},
		{
			x: 0,
			y: f + zy
		},
		{
			x: 0 + zy,
			y: f
		}
	], m, { cssStyles: h } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = U(t, {}), r = Z(p), i = e.path(r, n);
		m = s.insert(() => i, ":first-child").attr("transform", `translate(${-l / 2}, ${u / 2})`), h && m.attr("style", h);
	} else m = Ry(s, l, u, p);
	return r && m.attr("style", r), Y(t, m), t.intersect = function(e) {
		return Q.polygon(t, p, e);
	}, s;
}
i(By, "card");
function Vy(e, t) {
	let { nodeStyles: n } = H(t);
	t.label = "";
	let r = e.insert("g").attr("class", X(t)).attr("id", t.domId ?? t.id), { cssStyles: i } = t, a = Math.max(28, t.width ?? 0), o = [
		{
			x: 0,
			y: a / 2
		},
		{
			x: a / 2,
			y: 0
		},
		{
			x: 0,
			y: -a / 2
		},
		{
			x: -a / 2,
			y: 0
		}
	], s = q.svg(r), c = U(t, {});
	t.look !== "handDrawn" && (c.roughness = 0, c.fillStyle = "solid");
	let l = Z(o), u = s.path(l, c), d = r.insert(() => u, ":first-child");
	return i && t.look !== "handDrawn" && d.selectAll("path").attr("style", i), n && t.look !== "handDrawn" && d.selectAll("path").attr("style", n), t.width = 28, t.height = 28, t.intersect = function(e) {
		return Q.polygon(t, o, e);
	}, r;
}
i(Vy, "choice");
async function Hy(e, t, n) {
	let { labelStyles: r, nodeStyles: i } = H(t);
	t.labelStyle = r;
	let { shapeSvg: a, bbox: o, halfPadding: s } = await J(e, t, X(t)), l = n?.padding ?? s, u = t.look === "neo" ? o.width / 2 + 32 : o.width / 2 + l, d, { cssStyles: f } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(a), n = U(t, {}), r = e.circle(0, 0, u * 2, n);
		d = a.insert(() => r, ":first-child"), d.attr("class", "basic label-container").attr("style", jh(f));
	} else d = a.insert("circle", ":first-child").attr("class", "basic label-container").attr("style", i).attr("r", u).attr("cx", 0).attr("cy", 0);
	return Y(t, d), t.calcIntersect = function(e, t) {
		let n = e.width / 2;
		return Q.circle(e, n, t);
	}, t.intersect = function(e) {
		return c.info("Circle intersect", t, u, e), Q.circle(t, u, e);
	}, a;
}
i(Hy, "circle");
function Uy(e) {
	let t = Math.cos(Math.PI / 4), n = Math.sin(Math.PI / 4), r = e * 2, i = {
		x: r / 2 * t,
		y: r / 2 * n
	}, a = {
		x: -(r / 2) * t,
		y: r / 2 * n
	}, o = {
		x: -(r / 2) * t,
		y: -(r / 2) * n
	}, s = {
		x: r / 2 * t,
		y: -(r / 2) * n
	};
	return `M ${a.x},${a.y} L ${s.x},${s.y}
                   M ${i.x},${i.y} L ${o.x},${o.y}`;
}
i(Uy, "createLine");
function Wy(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n, t.label = "";
	let i = e.insert("g").attr("class", X(t)).attr("id", t.domId ?? t.id), a = Math.max(30, t?.width ?? 0), { cssStyles: o } = t, s = q.svg(i), l = U(t, {});
	t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
	let u = s.circle(0, 0, a * 2, l), d = Uy(a), f = s.path(d, l), p = i.insert(() => u, ":first-child");
	return p.insert(() => f), p.attr("class", "outer-path"), o && t.look !== "handDrawn" && p.selectAll("path").attr("style", o), r && t.look !== "handDrawn" && p.selectAll("path").attr("style", r), Y(t, p), t.intersect = function(e) {
		return c.info("crossedCircle intersect", t, {
			radius: a,
			point: e
		}), Q.circle(t, a, e);
	}, i;
}
i(Wy, "crossedCircle");
function Gy(e, t, n, r = 100, i = 0, a = 180) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: -a,
			y: -l
		});
	}
	return o;
}
i(Gy, "generateCirclePoints");
async function Ky(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, label: o } = await J(e, t, X(t)), s = t.look === "neo" ? 18 : t.padding ?? 0, c = t.look === "neo" ? 12 : t.padding ?? 0, l = a.width + s, u = a.height + c, d = Math.max(5, u * .1), { cssStyles: f } = t, p = [
		...Gy(l / 2, -u / 2, d, 30, -90, 0),
		{
			x: -l / 2 - d,
			y: d
		},
		...Gy(l / 2 + d * 2, -d, d, 20, -180, -270),
		...Gy(l / 2 + d * 2, d, d, 20, -90, -180),
		{
			x: -l / 2 - d,
			y: -u / 2
		},
		...Gy(l / 2, u / 2, d, 20, 0, 90)
	], m = [
		{
			x: l / 2,
			y: -u / 2 - d
		},
		{
			x: -l / 2,
			y: -u / 2 - d
		},
		...Gy(l / 2, -u / 2, d, 20, -90, 0),
		{
			x: -l / 2 - d,
			y: -d
		},
		...Gy(l / 2 + l * .1, -d, d, 20, -180, -270),
		...Gy(l / 2 + l * .1, d, d, 20, -90, -180),
		{
			x: -l / 2 - d,
			y: u / 2
		},
		...Gy(l / 2, u / 2, d, 20, 0, 90),
		{
			x: -l / 2,
			y: u / 2 + d
		},
		{
			x: l / 2,
			y: u / 2 + d
		}
	], h = q.svg(i), g = U(t, { fill: "none" });
	t.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = Z(p).replace("Z", ""), v = h.path(_, g), y = Z(m), b = h.path(y, { ...g }), x = i.insert("g", ":first-child");
	return x.insert(() => b, ":first-child").attr("stroke-opacity", 0), x.insert(() => v, ":first-child"), x.attr("class", "text"), f && t.look !== "handDrawn" && x.selectAll("path").attr("style", f), r && t.look !== "handDrawn" && x.selectAll("path").attr("style", r), x.attr("transform", `translate(${d}, 0)`), o.attr("transform", `translate(${-l / 2 + d - (a.x - (a.left ?? 0))},${-u / 2 + (t.padding ?? 0) / 2 - (a.y - (a.top ?? 0))})`), Y(t, x), t.intersect = function(e) {
		return Q.polygon(t, m, e);
	}, i;
}
i(Ky, "curlyBraceLeft");
function qy(e, t, n, r = 100, i = 0, a = 180) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: a,
			y: l
		});
	}
	return o;
}
i(qy, "generateCirclePoints");
async function Jy(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, label: o } = await J(e, t, X(t)), s = t.look === "neo" ? 18 : t.padding ?? 0, c = t.look === "neo" ? 12 : t.padding ?? 0, l = a.width + (t.look === "neo" ? s * 2 : s), u = a.height + (t.look === "neo" ? c * 2 : c), d = Math.max(5, u * .1), { cssStyles: f } = t, p = [
		...qy(l / 2, -u / 2, d, 20, -90, 0),
		{
			x: l / 2 + d,
			y: -d
		},
		...qy(l / 2 + d * 2, -d, d, 20, -180, -270),
		...qy(l / 2 + d * 2, d, d, 20, -90, -180),
		{
			x: l / 2 + d,
			y: u / 2
		},
		...qy(l / 2, u / 2, d, 20, 0, 90)
	], m = [
		{
			x: -l / 2,
			y: -u / 2 - d
		},
		{
			x: l / 2,
			y: -u / 2 - d
		},
		...qy(l / 2, -u / 2, d, 20, -90, 0),
		{
			x: l / 2 + d,
			y: -d
		},
		...qy(l / 2 + d * 2, -d, d, 20, -180, -270),
		...qy(l / 2 + d * 2, d, d, 20, -90, -180),
		{
			x: l / 2 + d,
			y: u / 2
		},
		...qy(l / 2, u / 2, d, 20, 0, 90),
		{
			x: l / 2,
			y: u / 2 + d
		},
		{
			x: -l / 2,
			y: u / 2 + d
		}
	], h = q.svg(i), g = U(t, { fill: "none" });
	t.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = Z(p).replace("Z", ""), v = h.path(_, g), y = Z(m), b = h.path(y, { ...g }), x = i.insert("g", ":first-child");
	return x.insert(() => b, ":first-child").attr("stroke-opacity", 0), x.insert(() => v, ":first-child"), x.attr("class", "text"), f && t.look !== "handDrawn" && x.selectAll("path").attr("style", f), r && t.look !== "handDrawn" && x.selectAll("path").attr("style", r), x.attr("transform", `translate(${-d}, 0)`), o.attr("transform", `translate(${-l / 2 + (t.padding ?? 0) / 2 - (a.x - (a.left ?? 0))},${-u / 2 + (t.padding ?? 0) / 2 - (a.y - (a.top ?? 0))})`), Y(t, x), t.intersect = function(e) {
		return Q.polygon(t, m, e);
	}, i;
}
i(Jy, "curlyBraceRight");
function Yy(e, t, n, r = 100, i = 0, a = 180) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: -a,
			y: -l
		});
	}
	return o;
}
i(Yy, "generateCirclePoints");
async function Xy(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, label: o } = await J(e, t, X(t)), s = t.look === "neo" ? 18 : t.padding ?? 0, c = t.look === "neo" ? 12 : t.padding ?? 0, l = a.width + (t.look === "neo" ? s * 2 : s), u = a.height + (t.look === "neo" ? c * 2 : c), d = Math.max(5, u * .1), { cssStyles: f } = t, p = [
		...Yy(l / 2, -u / 2, d, 30, -90, 0),
		{
			x: -l / 2 - d,
			y: d
		},
		...Yy(l / 2 + d * 2, -d, d, 20, -180, -270),
		...Yy(l / 2 + d * 2, d, d, 20, -90, -180),
		{
			x: -l / 2 - d,
			y: -u / 2
		},
		...Yy(l / 2, u / 2, d, 20, 0, 90)
	], m = [
		...Yy(-l / 2 + d + d / 2, -u / 2, d, 20, -90, -180),
		{
			x: l / 2 - d / 2,
			y: d
		},
		...Yy(-l / 2 - d / 2, -d, d, 20, 0, 90),
		...Yy(-l / 2 - d / 2, d, d, 20, -90, 0),
		{
			x: l / 2 - d / 2,
			y: -d
		},
		...Yy(-l / 2 + d + d / 2, u / 2, d, 30, -180, -270)
	], h = [
		{
			x: l / 2,
			y: -u / 2 - d
		},
		{
			x: -l / 2,
			y: -u / 2 - d
		},
		...Yy(l / 2, -u / 2, d, 20, -90, 0),
		{
			x: -l / 2 - d,
			y: -d
		},
		...Yy(l / 2 + d * 2, -d, d, 20, -180, -270),
		...Yy(l / 2 + d * 2, d, d, 20, -90, -180),
		{
			x: -l / 2 - d,
			y: u / 2
		},
		...Yy(l / 2, u / 2, d, 20, 0, 90),
		{
			x: -l / 2,
			y: u / 2 + d
		},
		{
			x: l / 2 - d - d / 2,
			y: u / 2 + d
		},
		...Yy(-l / 2 + d + d / 2, -u / 2, d, 20, -90, -180),
		{
			x: l / 2 - d / 2,
			y: d
		},
		...Yy(-l / 2 - d / 2, -d, d, 20, 0, 90),
		...Yy(-l / 2 - d / 2, d, d, 20, -90, 0),
		{
			x: l / 2 - d / 2,
			y: -d
		},
		...Yy(-l / 2 + d + d / 2, u / 2, d, 30, -180, -270)
	], g = q.svg(i), _ = U(t, { fill: "none" });
	t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
	let v = Z(p).replace("Z", ""), y = g.path(v, _), b = Z(m).replace("Z", ""), x = g.path(b, _), S = Z(h), C = g.path(S, { ..._ }), w = i.insert("g", ":first-child");
	return w.insert(() => C, ":first-child").attr("stroke-opacity", 0), w.insert(() => y, ":first-child"), w.insert(() => x, ":first-child"), w.attr("class", "text"), f && t.look !== "handDrawn" && w.selectAll("path").attr("style", f), r && t.look !== "handDrawn" && w.selectAll("path").attr("style", r), w.attr("transform", `translate(${d - d / 4}, 0)`), o.attr("transform", `translate(${-l / 2 + (t.padding ?? 0) / 2 - (a.x - (a.left ?? 0))},${-u / 2 + (t.padding ?? 0) / 2 - (a.y - (a.top ?? 0))})`), Y(t, w), t.intersect = function(e) {
		return Q.polygon(t, h, e);
	}, i;
}
i(Xy, "curlyBraces");
async function Zy(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 12 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = Math.max(20, (c.width + a * 2) * 1.25, t?.width ?? 0), u = Math.max(5, c.height + o * 2, t?.height ?? 0), d = u / 2, { cssStyles: f } = t, p = q.svg(s), m = U(t, {});
	t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
	let h = l, g = u, _ = h - d, v = g / 4, y = [
		{
			x: _,
			y: 0
		},
		{
			x: v,
			y: 0
		},
		{
			x: 0,
			y: g / 2
		},
		{
			x: v,
			y: g
		},
		{
			x: _,
			y: g
		},
		...py(-_, -g / 2, d, 50, 270, 90)
	], b = Z(y), x = p.path(b, m), S = s.insert(() => x, ":first-child");
	return S.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && S.selectChildren("path").attr("style", f), r && t.look !== "handDrawn" && S.selectChildren("path").attr("style", r), S.attr("transform", `translate(${-l / 2}, ${-u / 2})`), Y(t, S), t.intersect = function(e) {
		return Q.polygon(t, y, e);
	}, s;
}
i(Zy, "curvedTrapezoid");
var Qy = /* @__PURE__ */ i((e, t, n, r, i, a) => [
	`M${e},${t + a}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`
].join(" "), "createCylinderPathD"), $y = /* @__PURE__ */ i((e, t, n, r, i, a) => [
	`M${e},${t + a}`,
	`M${e + n},${t + a}`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`
].join(" "), "createOuterCylinderPathD"), eb = /* @__PURE__ */ i((e, t, n, r, i, a) => [`M${e - n / 2},${-r / 2}`, `a${i},${a} 0,0,0 ${n},0`].join(" "), "createInnerCylinderPathD"), tb = 8, nb = 8;
async function rb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 24 : i, o = t.look === "neo" ? 24 : i;
	if (t.width || t.height) {
		let e = t.width ?? 0;
		t.width = (t.width ?? 0) - o, t.width < nb && (t.width = nb);
		let n = e / 2 / (2.5 + e / 50);
		t.height = (t.height ?? 0) - a - n * 3, t.height < tb && (t.height = tb);
	}
	let { shapeSvg: s, bbox: c, label: l } = await J(e, t, X(t)), u = (t.width ? t.width : c.width) + o, d = u / 2, f = d / (2.5 + u / 50), p = (t.height ? t.height : c.height) + a + f, m, { cssStyles: h } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = $y(0, 0, u, p, d, f), r = eb(0, f, u, p, d, f), i = U(t, {}), a = e.path(n, i), o = e.path(r, U(t, { fill: "none" }));
		m = s.insert(() => o, ":first-child"), m = s.insert(() => a, ":first-child"), m.attr("class", "basic label-container"), h && m.attr("style", h);
	} else {
		let e = Qy(0, 0, u, p, d, f);
		m = s.insert("path", ":first-child").attr("d", e).attr("class", "basic label-container outer-path").attr("style", jh(h)).attr("style", r);
	}
	return m.attr("label-offset-y", f), m.attr("transform", `translate(${-u / 2}, ${-(p / 2 + f)})`), Y(t, m), l.attr("transform", `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + (t.padding ?? 0) / 1.5 - (c.y - (c.top ?? 0))})`), t.intersect = function(e) {
		let n = Q.rect(t, e), r = n.x - (t.x ?? 0);
		if (d != 0 && (Math.abs(r) < (t.width ?? 0) / 2 || Math.abs(r) == (t.width ?? 0) / 2 && Math.abs(n.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - f)) {
			let i = f * f * (1 - r * r / (d * d));
			i > 0 && (i = Math.sqrt(i)), i = f - i, e.y - (t.y ?? 0) > 0 && (i = -i), n.y += i;
		}
		return n;
	}, s;
}
i(rb, "cylinder");
async function ib(e, t, n) {
	let { labelStyles: r, nodeStyles: i } = H(t);
	t.labelStyle = r;
	let { shapeSvg: a, bbox: o } = await J(e, t, X(t)), s = Math.max(o.width + n.labelPaddingX * 2, t?.width || 0), c = Math.max(o.height + n.labelPaddingY * 2, t?.height || 0), l = -s / 2, u = -c / 2, d, { rx: f, ry: p } = t, { cssStyles: m } = t;
	if (n?.rx && n.ry && (f = n.rx, p = n.ry), t.look === "handDrawn") {
		let e = q.svg(a), n = U(t, {}), r = f || p ? e.path(_y(l, u, s, c, f || 0), n) : e.rectangle(l, u, s, c, n);
		d = a.insert(() => r, ":first-child"), d.attr("class", "basic label-container").attr("style", jh(m));
	} else d = a.insert("rect", ":first-child"), d.attr("class", "basic label-container").attr("style", i).attr("rx", jh(f)).attr("ry", jh(p)).attr("x", l).attr("y", u).attr("width", s).attr("height", c);
	return Y(t, d), t.calcIntersect = function(e, t) {
		return Q.rect(e, t);
	}, t.intersect = function(e) {
		return Q.rect(t, e);
	}, a;
}
i(ib, "drawRect");
async function ab(e, t) {
	let { cssClasses: n, labelPaddingX: r, labelPaddingY: i, padding: a, width: o, height: s } = t, c = await ib(e, t, {
		rx: 0,
		ry: 0,
		classes: n ?? "",
		labelPaddingX: r ?? (a ?? 0) * 2,
		labelPaddingY: i ?? a ?? 0
	});
	if (t.look === "handDrawn") {
		let e = q.svg(c), n = U(t, {}), r = c.select(".basic.label-container > path:nth-child(2)"), i = r.node();
		if (!i) return c;
		let a = null;
		if (i instanceof SVGGraphicsElement) a = i.getBBox();
		else return c;
		return c.insert(() => e.line(a.x, a.y, a.x + a.width, a.y, n), ".basic.label-container g.label"), c.insert(() => e.line(a.x, a.y + a.height, a.x + a.width, a.y + a.height, n), ".basic.label-container g.label"), r.remove(), c;
	}
	let l = c.select(".basic.label-container"), u = (Number(l.attr("width")) || o) ?? 0, d = (Number(l.attr("height")) || s) ?? 0;
	return u > 0 && d > 0 && l.attr("stroke-dasharray", `${u} ${d}`), c;
}
i(ab, "datastore");
async function ob(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.look === "neo" ? 16 : t.padding ?? 0, a = t.look === "neo" ? 16 : t.padding ?? 0, { shapeSvg: o, bbox: s, label: c } = await J(e, t, X(t)), l = s.width + i, u = s.height + a, d = u * .2, f = -l / 2, p = -u / 2 - d / 2, { cssStyles: m } = t, h = q.svg(o), g = U(t, {});
	t.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = [
		{
			x: f,
			y: p + d
		},
		{
			x: -f,
			y: p + d
		},
		{
			x: -f,
			y: -p
		},
		{
			x: f,
			y: -p
		},
		{
			x: f,
			y: p
		},
		{
			x: -f,
			y: p
		},
		{
			x: -f,
			y: p + d
		}
	], v = h.polygon(_.map((e) => [e.x, e.y]), g), y = o.insert(() => v, ":first-child");
	return y.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && y.selectAll("path").attr("style", m), r && t.look !== "handDrawn" && y.selectAll("path").attr("style", r), c.attr("transform", `translate(${f + (t.padding ?? 0) / 2 - (s.x - (s.left ?? 0))}, ${p + d + (t.padding ?? 0) / 2 - (s.y - (s.top ?? 0))})`), Y(t, y), t.intersect = function(e) {
		return Q.rect(t, e);
	}, o;
}
i(ob, "dividedRectangle");
async function sb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t), i = t.look === "neo" ? 12 : 5;
	t.labelStyle = n;
	let a = t.padding ?? 0, o = t.look === "neo" ? 16 : a, { shapeSvg: s, bbox: l } = await J(e, t, X(t)), u = (t?.width ? t?.width / 2 : l.width / 2) + (o ?? 0), d = u - i, f, { cssStyles: p } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = U(t, {
			roughness: .2,
			strokeWidth: 2.5
		}), r = U(t, {
			roughness: .2,
			strokeWidth: 1.5
		}), i = e.circle(0, 0, u * 2, n), a = e.circle(0, 0, d * 2, r);
		f = s.insert("g", ":first-child"), f.attr("class", jh(t.cssClasses)).attr("style", jh(p)), f.node()?.appendChild(i), f.node()?.appendChild(a);
	} else {
		f = s.insert("g", ":first-child");
		let e = f.insert("circle", ":first-child"), t = f.insert("circle");
		f.attr("class", "basic label-container").attr("style", r), e.attr("class", "outer-circle").attr("style", r).attr("r", u).attr("cx", 0).attr("cy", 0), t.attr("class", "inner-circle").attr("style", r).attr("r", d).attr("cx", 0).attr("cy", 0);
	}
	return Y(t, f), t.intersect = function(e) {
		return c.info("DoubleCircle intersect", t, u, e), Q.circle(t, u, e);
	}, s;
}
i(sb, "doublecircle");
function cb(e, t, { config: { themeVariables: n } }) {
	let { labelStyles: r, nodeStyles: i } = H(t);
	t.label = "", t.labelStyle = r;
	let a = e.insert("g").attr("class", X(t)).attr("id", t.domId ?? t.id), { cssStyles: o } = t, s = q.svg(a), { nodeBorder: l } = n, u = U(t, { fillStyle: "solid" });
	t.look !== "handDrawn" && (u.roughness = 0);
	let d = s.circle(0, 0, 14, u), f = a.insert(() => d, ":first-child");
	return f.selectAll("path").attr("style", `fill: ${l} !important;`), o && o.length > 0 && t.look !== "handDrawn" && f.selectAll("path").attr("style", o), i && t.look !== "handDrawn" && f.selectAll("path").attr("style", i), Y(t, f), t.intersect = function(e) {
		return c.info("filledCircle intersect", t, {
			radius: 7,
			point: e
		}), Q.circle(t, 7, e);
	}, a;
}
i(cb, "filledCircle");
var lb = 10, ub = 10;
async function db(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? i * 2 : i;
	(t.width || t.height) && (t.height = t?.height ?? 0, t.height < lb && (t.height = lb), t.width = (t?.width ?? 0) - a - a / 2, t.width < ub && (t.width = ub));
	let { shapeSvg: o, bbox: s, label: l } = await J(e, t, X(t)), u = (t?.width ? t?.width : s.width) + (a ?? 0), d = t?.height ? t?.height : u + s.height, f = d, p = [
		{
			x: 0,
			y: -d
		},
		{
			x: f,
			y: -d
		},
		{
			x: f / 2,
			y: 0
		}
	], { cssStyles: m } = t, h = q.svg(o), g = U(t, {});
	t.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = Z(p), v = h.path(_, g), y = o.insert(() => v, ":first-child").attr("transform", `translate(${-d / 2}, ${d / 2})`).attr("class", "outer-path");
	return m && t.look !== "handDrawn" && y.selectChildren("path").attr("style", m), r && t.look !== "handDrawn" && y.selectChildren("path").attr("style", r), t.width = u, t.height = d, Y(t, y), l.attr("transform", `translate(${-s.width / 2 - (s.x - (s.left ?? 0))}, ${-d / 2 + (t.padding ?? 0) / 2 + (s.y - (s.top ?? 0))})`), t.intersect = function(e) {
		return c.info("Triangle intersect", t, p, e), Q.polygon(t, p, e);
	}, o;
}
i(db, "flippedTriangle");
function fb(e, t, { dir: n, config: { state: r, themeVariables: i } }) {
	let { nodeStyles: a } = H(t);
	t.label = "";
	let o = e.insert("g").attr("class", X(t)).attr("id", t.domId ?? t.id), { cssStyles: s } = t, c = Math.max(70, t?.width ?? 0), l = Math.max(10, t?.height ?? 0);
	n === "LR" && (c = Math.max(10, t?.width ?? 0), l = Math.max(70, t?.height ?? 0));
	let u = -1 * c / 2, d = -1 * l / 2, f = q.svg(o), p = U(t, {
		stroke: i.lineColor,
		fill: i.lineColor
	});
	t.look !== "handDrawn" && (p.roughness = 0, p.fillStyle = "solid");
	let m = f.rectangle(u, d, c, l, p), h = o.insert(() => m, ":first-child");
	s && t.look !== "handDrawn" && h.selectAll("path").attr("style", s), a && t.look !== "handDrawn" && h.selectAll("path").attr("style", a), Y(t, h);
	let g = r?.padding ?? 0;
	return t.width && t.height && (t.width += g / 2 || 0, t.height += g / 2 || 0), t.intersect = function(e) {
		return Q.rect(t, e);
	}, o;
}
i(fb, "forkJoin");
async function pb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.look === "neo" ? 16 : t.padding ?? 0, a = t.look === "neo" ? 12 : t.padding ?? 0;
	(t.width || t.height) && (t.height = (t?.height ?? 0) - a * 2, t.height < 10 && (t.height = 10), t.width = (t?.width ?? 0) - i * 2, t.width < 15 && (t.width = 15));
	let { shapeSvg: o, bbox: s } = await J(e, t, X(t)), l = (t?.width ? t?.width : Math.max(15, s.width)) + i * 2, u = (t?.height ? t?.height : Math.max(10, s.height)) + a * 2, d = u / 2, { cssStyles: f } = t, p = q.svg(o), m = U(t, {});
	t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
	let h = [
		{
			x: -l / 2,
			y: -u / 2
		},
		{
			x: l / 2 - d,
			y: -u / 2
		},
		...py(-l / 2 + d, 0, d, 50, 90, 270),
		{
			x: l / 2 - d,
			y: u / 2
		},
		{
			x: -l / 2,
			y: u / 2
		}
	], g = Z(h), _ = p.path(g, m), v = o.insert(() => _, ":first-child");
	return v.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && v.selectChildren("path").attr("style", f), r && t.look !== "handDrawn" && v.selectChildren("path").attr("style", r), Y(t, v), t.intersect = function(e) {
		return c.info("Pill intersect", t, {
			radius: d,
			point: e
		}), Q.polygon(t, h, e);
	}, o;
}
i(pb, "halfRoundedRectangle");
var mb = /* @__PURE__ */ i((e, t, n, r, i) => [
	`M${e + i},${t}`,
	`L${e + n - i},${t}`,
	`L${e + n},${t - r / 2}`,
	`L${e + n - i},${t - r}`,
	`L${e + i},${t - r}`,
	`L${e},${t - r / 2}`,
	"Z"
].join(" "), "createHexagonPathD");
async function hb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t), i = t.look === "neo" ? 3.5 : 4;
	t.labelStyle = n;
	let a = t.padding ?? 0, o = t.look === "neo" ? 70 : a, s = t.look === "neo" ? 32 : a;
	if (t.width || t.height) {
		let e = (t.height ?? 0) / i;
		t.width = (t?.width ?? 0) - 2 * e - s, t.height = (t.height ?? 0) - o;
	}
	let { shapeSvg: c, bbox: l } = await J(e, t, X(t)), u = (t?.height ? t?.height : l.height) + o, d = u / i, f = (t?.width ? t?.width : l.width) + 2 * d + s, p = [
		{
			x: d,
			y: 0
		},
		{
			x: f - d,
			y: 0
		},
		{
			x: f,
			y: -u / 2
		},
		{
			x: f - d,
			y: -u
		},
		{
			x: d,
			y: -u
		},
		{
			x: 0,
			y: -u / 2
		}
	], m, { cssStyles: h } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(c), n = U(t, {}), r = mb(0, 0, f, u, d), i = e.path(r, n);
		m = c.insert(() => i, ":first-child").attr("transform", `translate(${-f / 2}, ${u / 2})`), h && m.attr("style", h);
	} else m = Ry(c, f, u, p);
	return r && m.attr("style", r), t.width = f, t.height = u, Y(t, m), t.intersect = function(e) {
		return Q.polygon(t, p, e);
	}, c;
}
i(hb, "hexagon");
async function gb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.label = "", t.labelStyle = n;
	let { shapeSvg: i } = await J(e, t, X(t)), a = Math.max(30, t?.width ?? 0), o = Math.max(30, t?.height ?? 0), { cssStyles: s } = t, l = q.svg(i), u = U(t, {});
	t.look !== "handDrawn" && (u.roughness = 0, u.fillStyle = "solid");
	let d = [
		{
			x: 0,
			y: 0
		},
		{
			x: a,
			y: 0
		},
		{
			x: 0,
			y: o
		},
		{
			x: a,
			y: o
		}
	], f = Z(d), p = l.path(f, u), m = i.insert(() => p, ":first-child");
	return m.attr("class", "basic label-container outer-path"), s && t.look !== "handDrawn" && m.selectChildren("path").attr("style", s), r && t.look !== "handDrawn" && m.selectChildren("path").attr("style", r), m.attr("transform", `translate(${-a / 2}, ${-o / 2})`), Y(t, m), t.intersect = function(e) {
		return c.info("Pill intersect", t, { points: d }), Q.polygon(t, d, e);
	}, i;
}
i(gb, "hourglass");
async function _b(e, t, { config: { themeVariables: n, flowchart: r } }) {
	let { labelStyles: i } = H(t);
	t.labelStyle = i;
	let a = t.assetHeight ?? 48, o = t.assetWidth ?? 48, s = Math.max(a, o), l = r?.wrappingWidth;
	t.width = Math.max(s, l ?? 0);
	let { shapeSvg: u, bbox: d, label: f } = await J(e, t, "icon-shape default"), p = t.pos === "t", m = s, h = s, { nodeBorder: g } = n, { stylesMap: _ } = qp(t), v = -h / 2, y = -m / 2, b = t.label ? 8 : 0, x = q.svg(u), S = U(t, {
		stroke: "none",
		fill: "none"
	});
	t.look !== "handDrawn" && (S.roughness = 0, S.fillStyle = "solid");
	let C = x.rectangle(v, y, h, m, S), w = Math.max(h, d.width), T = m + d.height + b, E = x.rectangle(-w / 2, -T / 2, w, T, {
		...S,
		fill: "transparent",
		stroke: "none"
	}), D = u.insert(() => C, ":first-child"), O = u.insert(() => E);
	if (t.icon) {
		let e = u.append("g");
		e.html(`<g>${await pg(t.icon, {
			height: s,
			width: s,
			fallbackPrefix: ""
		})}</g>`);
		let n = e.node().getBBox(), r = n.width, i = n.height, a = n.x, o = n.y;
		e.attr("transform", `translate(${-r / 2 - a},${p ? d.height / 2 + b / 2 - i / 2 - o : -d.height / 2 - b / 2 - i / 2 - o})`), e.attr("style", `color: ${_.get("stroke") ?? g};`);
	}
	return f.attr("transform", `translate(${-d.width / 2 - (d.x - (d.left ?? 0))},${p ? -T / 2 : T / 2 - d.height})`), D.attr("transform", `translate(0,${p ? d.height / 2 + b / 2 : -d.height / 2 - b / 2})`), Y(t, O), t.intersect = function(e) {
		if (c.info("iconSquare intersect", t, e), !t.label) return Q.rect(t, e);
		let n = t.x ?? 0, r = t.y ?? 0, i = t.height ?? 0, a = [];
		return a = p ? [
			{
				x: n - d.width / 2,
				y: r - i / 2
			},
			{
				x: n + d.width / 2,
				y: r - i / 2
			},
			{
				x: n + d.width / 2,
				y: r - i / 2 + d.height + b
			},
			{
				x: n + h / 2,
				y: r - i / 2 + d.height + b
			},
			{
				x: n + h / 2,
				y: r + i / 2
			},
			{
				x: n - h / 2,
				y: r + i / 2
			},
			{
				x: n - h / 2,
				y: r - i / 2 + d.height + b
			},
			{
				x: n - d.width / 2,
				y: r - i / 2 + d.height + b
			}
		] : [
			{
				x: n - h / 2,
				y: r - i / 2
			},
			{
				x: n + h / 2,
				y: r - i / 2
			},
			{
				x: n + h / 2,
				y: r - i / 2 + m
			},
			{
				x: n + d.width / 2,
				y: r - i / 2 + m
			},
			{
				x: n + d.width / 2 / 2,
				y: r + i / 2
			},
			{
				x: n - d.width / 2,
				y: r + i / 2
			},
			{
				x: n - d.width / 2,
				y: r - i / 2 + m
			},
			{
				x: n - h / 2,
				y: r - i / 2 + m
			}
		], Q.polygon(t, a, e);
	}, u;
}
i(_b, "icon");
async function vb(e, t, { config: { themeVariables: n, flowchart: r } }) {
	let { labelStyles: i } = H(t);
	t.labelStyle = i;
	let a = t.assetHeight ?? 48, o = t.assetWidth ?? 48, s = Math.max(a, o), l = r?.wrappingWidth;
	t.width = Math.max(s, l ?? 0);
	let { shapeSvg: u, bbox: d, label: f } = await J(e, t, "icon-shape default"), p = t.label ? 8 : 0, m = t.pos === "t", { nodeBorder: h, mainBkg: g } = n, { stylesMap: _ } = qp(t), v = q.svg(u), y = U(t, {});
	t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid"), y.stroke = _.get("fill") ?? g;
	let b = u.append("g");
	t.icon && b.html(`<g>${await pg(t.icon, {
		height: s,
		width: s,
		fallbackPrefix: ""
	})}</g>`);
	let x = b.node().getBBox(), S = x.width, C = x.height, w = x.x, T = x.y, E = Math.max(S, C) * Math.SQRT2 + 40, D = v.circle(0, 0, E, y), O = Math.max(E, d.width), k = E + d.height + p, A = v.rectangle(-O / 2, -k / 2, O, k, {
		...y,
		fill: "transparent",
		stroke: "none"
	}), ee = u.insert(() => D, ":first-child"), j = u.insert(() => A);
	return b.attr("transform", `translate(${-S / 2 - w},${m ? d.height / 2 + p / 2 - C / 2 - T : -d.height / 2 - p / 2 - C / 2 - T})`), b.attr("style", `color: ${_.get("stroke") ?? h};`), f.attr("transform", `translate(${-d.width / 2 - (d.x - (d.left ?? 0))},${m ? -k / 2 : k / 2 - d.height})`), ee.attr("transform", `translate(0,${m ? d.height / 2 + p / 2 : -d.height / 2 - p / 2})`), Y(t, j), t.intersect = function(e) {
		return c.info("iconSquare intersect", t, e), Q.rect(t, e);
	}, u;
}
i(vb, "iconCircle");
async function yb(e, t, { config: { themeVariables: n, flowchart: r } }) {
	let { labelStyles: i } = H(t);
	t.labelStyle = i;
	let a = t.assetHeight ?? 48, o = t.assetWidth ?? 48, s = Math.max(a, o), l = r?.wrappingWidth;
	t.width = Math.max(s, l ?? 0);
	let { shapeSvg: u, bbox: d, halfPadding: f, label: p } = await J(e, t, "icon-shape default"), m = t.pos === "t", h = s + f * 2, g = s + f * 2, { nodeBorder: _, mainBkg: v } = n, { stylesMap: y } = qp(t), b = -g / 2, x = -h / 2, S = t.label ? 8 : 0, C = q.svg(u), w = U(t, {});
	t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid"), w.stroke = y.get("fill") ?? v;
	let T = C.path(_y(b, x, g, h, 5), w), E = Math.max(g, d.width), D = h + d.height + S, O = C.rectangle(-E / 2, -D / 2, E, D, {
		...w,
		fill: "transparent",
		stroke: "none"
	}), k = u.insert(() => T, ":first-child").attr("class", "icon-shape2"), A = u.insert(() => O);
	if (t.icon) {
		let e = u.append("g");
		e.html(`<g>${await pg(t.icon, {
			height: s,
			width: s,
			fallbackPrefix: ""
		})}</g>`);
		let n = e.node().getBBox(), r = n.width, i = n.height, a = n.x, o = n.y;
		e.attr("transform", `translate(${-r / 2 - a},${m ? d.height / 2 + S / 2 - i / 2 - o : -d.height / 2 - S / 2 - i / 2 - o})`), e.attr("style", `color: ${y.get("stroke") ?? _};`);
	}
	return p.attr("transform", `translate(${-d.width / 2 - (d.x - (d.left ?? 0))},${m ? -D / 2 : D / 2 - d.height})`), k.attr("transform", `translate(0,${m ? d.height / 2 + S / 2 : -d.height / 2 - S / 2})`), Y(t, A), t.intersect = function(e) {
		if (c.info("iconSquare intersect", t, e), !t.label) return Q.rect(t, e);
		let n = t.x ?? 0, r = t.y ?? 0, i = t.height ?? 0, a = [];
		return a = m ? [
			{
				x: n - d.width / 2,
				y: r - i / 2
			},
			{
				x: n + d.width / 2,
				y: r - i / 2
			},
			{
				x: n + d.width / 2,
				y: r - i / 2 + d.height + S
			},
			{
				x: n + g / 2,
				y: r - i / 2 + d.height + S
			},
			{
				x: n + g / 2,
				y: r + i / 2
			},
			{
				x: n - g / 2,
				y: r + i / 2
			},
			{
				x: n - g / 2,
				y: r - i / 2 + d.height + S
			},
			{
				x: n - d.width / 2,
				y: r - i / 2 + d.height + S
			}
		] : [
			{
				x: n - g / 2,
				y: r - i / 2
			},
			{
				x: n + g / 2,
				y: r - i / 2
			},
			{
				x: n + g / 2,
				y: r - i / 2 + h
			},
			{
				x: n + d.width / 2,
				y: r - i / 2 + h
			},
			{
				x: n + d.width / 2 / 2,
				y: r + i / 2
			},
			{
				x: n - d.width / 2,
				y: r + i / 2
			},
			{
				x: n - d.width / 2,
				y: r - i / 2 + h
			},
			{
				x: n - g / 2,
				y: r - i / 2 + h
			}
		], Q.polygon(t, a, e);
	}, u;
}
i(yb, "iconRounded");
async function bb(e, t, { config: { themeVariables: n, flowchart: r } }) {
	let { labelStyles: i } = H(t);
	t.labelStyle = i;
	let a = t.assetHeight ?? 48, o = t.assetWidth ?? 48, s = Math.max(a, o), l = r?.wrappingWidth;
	t.width = Math.max(s, l ?? 0);
	let { shapeSvg: u, bbox: d, halfPadding: f, label: p } = await J(e, t, "icon-shape default"), m = t.pos === "t", h = s + f * 2, g = s + f * 2, { nodeBorder: _, mainBkg: v } = n, { stylesMap: y } = qp(t), b = -g / 2, x = -h / 2, S = t.label ? 8 : 0, C = q.svg(u), w = U(t, {});
	t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid"), w.stroke = y.get("fill") ?? v;
	let T = C.path(_y(b, x, g, h, .1), w), E = Math.max(g, d.width), D = h + d.height + S, O = C.rectangle(-E / 2, -D / 2, E, D, {
		...w,
		fill: "transparent",
		stroke: "none"
	}), k = u.insert(() => T, ":first-child"), A = u.insert(() => O);
	if (t.icon) {
		let e = u.append("g");
		e.html(`<g>${await pg(t.icon, {
			height: s,
			width: s,
			fallbackPrefix: ""
		})}</g>`);
		let n = e.node().getBBox(), r = n.width, i = n.height, a = n.x, o = n.y;
		e.attr("transform", `translate(${-r / 2 - a},${m ? d.height / 2 + S / 2 - i / 2 - o : -d.height / 2 - S / 2 - i / 2 - o})`), e.attr("style", `color: ${y.get("stroke") ?? _};`);
	}
	return p.attr("transform", `translate(${-d.width / 2 - (d.x - (d.left ?? 0))},${m ? -D / 2 : D / 2 - d.height})`), k.attr("transform", `translate(0,${m ? d.height / 2 + S / 2 : -d.height / 2 - S / 2})`), Y(t, A), t.intersect = function(e) {
		if (c.info("iconSquare intersect", t, e), !t.label) return Q.rect(t, e);
		let n = t.x ?? 0, r = t.y ?? 0, i = t.height ?? 0, a = [];
		return a = m ? [
			{
				x: n - d.width / 2,
				y: r - i / 2
			},
			{
				x: n + d.width / 2,
				y: r - i / 2
			},
			{
				x: n + d.width / 2,
				y: r - i / 2 + d.height + S
			},
			{
				x: n + g / 2,
				y: r - i / 2 + d.height + S
			},
			{
				x: n + g / 2,
				y: r + i / 2
			},
			{
				x: n - g / 2,
				y: r + i / 2
			},
			{
				x: n - g / 2,
				y: r - i / 2 + d.height + S
			},
			{
				x: n - d.width / 2,
				y: r - i / 2 + d.height + S
			}
		] : [
			{
				x: n - g / 2,
				y: r - i / 2
			},
			{
				x: n + g / 2,
				y: r - i / 2
			},
			{
				x: n + g / 2,
				y: r - i / 2 + h
			},
			{
				x: n + d.width / 2,
				y: r - i / 2 + h
			},
			{
				x: n + d.width / 2 / 2,
				y: r + i / 2
			},
			{
				x: n - d.width / 2,
				y: r + i / 2
			},
			{
				x: n - d.width / 2,
				y: r - i / 2 + h
			},
			{
				x: n - g / 2,
				y: r - i / 2 + h
			}
		], Q.polygon(t, a, e);
	}, u;
}
i(bb, "iconSquare");
async function xb(e, t, { config: { flowchart: n } }) {
	let r = new Image();
	r.src = t?.img ?? "", await r.decode();
	let i = Number(r.naturalWidth.toString().replace("px", "")), a = Number(r.naturalHeight.toString().replace("px", ""));
	t.imageAspectRatio = i / a;
	let { labelStyles: o } = H(t);
	t.labelStyle = o;
	let s = n?.wrappingWidth;
	t.defaultWidth = n?.wrappingWidth;
	let l = Math.max(t.label ? s ?? 0 : 0, t?.assetWidth ?? i), u = t.constraint === "on" && t?.assetHeight ? t.assetHeight * t.imageAspectRatio : l, d = t.constraint === "on" ? u / t.imageAspectRatio : t?.assetHeight ?? a;
	t.width = Math.max(u, s ?? 0);
	let { shapeSvg: f, bbox: p, label: m } = await J(e, t, "image-shape default"), h = t.pos === "t", g = -u / 2, _ = -d / 2, v = t.label ? 8 : 0, y = q.svg(f), b = U(t, {});
	t.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
	let x = y.rectangle(g, _, u, d, b), S = Math.max(u, p.width), C = d + p.height + v, w = y.rectangle(-S / 2, -C / 2, S, C, {
		...b,
		fill: "none",
		stroke: "none"
	}), T = f.insert(() => x, ":first-child"), E = f.insert(() => w);
	if (t.img) {
		let e = f.append("image");
		e.attr("href", t.img), e.attr("width", u), e.attr("height", d), e.attr("preserveAspectRatio", "none"), e.attr("transform", `translate(${-u / 2},${h ? C / 2 - d : -C / 2})`);
	}
	return m.attr("transform", `translate(${-p.width / 2 - (p.x - (p.left ?? 0))},${h ? -d / 2 - p.height / 2 - v / 2 : d / 2 - p.height / 2 + v / 2})`), T.attr("transform", `translate(0,${h ? p.height / 2 + v / 2 : -p.height / 2 - v / 2})`), Y(t, E), t.intersect = function(e) {
		if (c.info("iconSquare intersect", t, e), !t.label) return Q.rect(t, e);
		let n = t.x ?? 0, r = t.y ?? 0, i = t.height ?? 0, a = [];
		return a = h ? [
			{
				x: n - p.width / 2,
				y: r - i / 2
			},
			{
				x: n + p.width / 2,
				y: r - i / 2
			},
			{
				x: n + p.width / 2,
				y: r - i / 2 + p.height + v
			},
			{
				x: n + u / 2,
				y: r - i / 2 + p.height + v
			},
			{
				x: n + u / 2,
				y: r + i / 2
			},
			{
				x: n - u / 2,
				y: r + i / 2
			},
			{
				x: n - u / 2,
				y: r - i / 2 + p.height + v
			},
			{
				x: n - p.width / 2,
				y: r - i / 2 + p.height + v
			}
		] : [
			{
				x: n - u / 2,
				y: r - i / 2
			},
			{
				x: n + u / 2,
				y: r - i / 2
			},
			{
				x: n + u / 2,
				y: r - i / 2 + d
			},
			{
				x: n + p.width / 2,
				y: r - i / 2 + d
			},
			{
				x: n + p.width / 2 / 2,
				y: r + i / 2
			},
			{
				x: n - p.width / 2,
				y: r + i / 2
			},
			{
				x: n - p.width / 2,
				y: r - i / 2 + d
			},
			{
				x: n - u / 2,
				y: r - i / 2 + d
			}
		], Q.polygon(t, a, e);
	}, f;
}
i(xb, "imageSquare");
async function Sb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = i, o = t.look === "neo" ? i * 2 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = Math.max(c.width + (o ?? 0) * 2, t?.width ?? 0), u = Math.max(c.height + (a ?? 0) * 2, t?.height ?? 0), d = [
		{
			x: 0,
			y: 0
		},
		{
			x: l,
			y: 0
		},
		{
			x: l + 3 * u / 6,
			y: -u
		},
		{
			x: -3 * u / 6,
			y: -u
		}
	], f, { cssStyles: p } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = U(t, {}), r = Z(d), i = e.path(r, n);
		f = s.insert(() => i, ":first-child").attr("transform", `translate(${-l / 2}, ${u / 2})`), p && f.attr("style", p);
	} else f = Ry(s, l, u, d);
	return r && f.attr("style", r), t.width = l, t.height = u, Y(t, f), t.intersect = function(e) {
		return Q.polygon(t, d, e);
	}, s;
}
i(Sb, "inv_trapezoid");
async function Cb(e, t) {
	let { shapeSvg: n, bbox: r, label: i } = await J(e, t, "label"), a = n.insert("rect", ":first-child");
	return a.attr("width", .1).attr("height", .1), n.attr("class", "label edgeLabel"), i.attr("transform", `translate(${-(r.width / 2) - (r.x - (r.left ?? 0))}, ${-(r.height / 2) - (r.y - (r.top ?? 0))})`), Y(t, a), t.intersect = function(e) {
		return Q.rect(t, e);
	}, n;
}
i(Cb, "labelRect");
async function wb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = i, o = t.look === "neo" ? i * 2 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.height ?? c.height) + a, u = (t?.width ?? c.width) + o, d = [
		{
			x: 0,
			y: 0
		},
		{
			x: u + 3 * l / 6,
			y: 0
		},
		{
			x: u,
			y: -l
		},
		{
			x: -(3 * l) / 6,
			y: -l
		}
	], f, { cssStyles: p } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = U(t, {}), r = Z(d), i = e.path(r, n);
		f = s.insert(() => i, ":first-child").attr("transform", `translate(${-u / 2}, ${l / 2})`), p && f.attr("style", p);
	} else f = Ry(s, u, l, d);
	return r && f.attr("style", r), t.width = u, t.height = l, Y(t, f), t.intersect = function(e) {
		return Q.polygon(t, d, e);
	}, s;
}
i(wb, "lean_left");
async function Tb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = i, o = t.look === "neo" ? i * 2 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.height ?? c.height) + a, u = (t?.width ?? c.width) + o, d = [
		{
			x: -3 * l / 6,
			y: 0
		},
		{
			x: u,
			y: 0
		},
		{
			x: u + 3 * l / 6,
			y: -l
		},
		{
			x: 0,
			y: -l
		}
	], f, { cssStyles: p } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = U(t, {}), r = Z(d), i = e.path(r, n);
		f = s.insert(() => i, ":first-child").attr("transform", `translate(${-u / 2}, ${l / 2})`), p && f.attr("style", p);
	} else f = Ry(s, u, l, d);
	return r && f.attr("style", r), t.width = u, t.height = l, Y(t, f), t.intersect = function(e) {
		return Q.polygon(t, d, e);
	}, s;
}
i(Tb, "lean_right");
function Eb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.label = "", t.labelStyle = n;
	let i = e.insert("g").attr("class", X(t)).attr("id", t.domId ?? t.id), { cssStyles: a } = t, o = Math.max(35, t?.width ?? 0), s = Math.max(35, t?.height ?? 0), l = [
		{
			x: o,
			y: 0
		},
		{
			x: 0,
			y: s + 7 / 2
		},
		{
			x: o - 14,
			y: s + 7 / 2
		},
		{
			x: 0,
			y: 2 * s
		},
		{
			x: o,
			y: s - 7 / 2
		},
		{
			x: 14,
			y: s - 7 / 2
		}
	], u = q.svg(i), d = U(t, {});
	t.look !== "handDrawn" && (d.roughness = 0, d.fillStyle = "solid");
	let f = Z(l), p = u.path(f, d), m = i.insert(() => p, ":first-child");
	return m.attr("class", "outer-path"), a && t.look !== "handDrawn" && m.selectAll("path").attr("style", a), r && t.look !== "handDrawn" && m.selectAll("path").attr("style", r), m.attr("transform", `translate(-${o / 2},${-s})`), Y(t, m), t.intersect = function(e) {
		return c.info("lightningBolt intersect", t, e), Q.polygon(t, l, e);
	}, i;
}
i(Eb, "lightningBolt");
var Db = /* @__PURE__ */ i((e, t, n, r, i, a, o) => [
	`M${e},${t + a}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`,
	`M${e},${t + a + o}`,
	`a${i},${a} 0,0,0 ${n},0`
].join(" "), "createCylinderPathD"), Ob = /* @__PURE__ */ i((e, t, n, r, i, a, o) => [
	`M${e},${t + a}`,
	`M${e + n},${t + a}`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`,
	`M${e},${t + a + o}`,
	`a${i},${a} 0,0,0 ${n},0`
].join(" "), "createOuterCylinderPathD"), kb = /* @__PURE__ */ i((e, t, n, r, i, a) => [`M${e - n / 2},${-r / 2}`, `a${i},${a} 0,0,0 ${n},0`].join(" "), "createInnerCylinderPathD"), Ab = 10, jb = 10;
async function Mb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 24 : i;
	if (t.width || t.height) {
		let e = t.width ?? 0;
		t.width = (t.width ?? 0) - a, t.width < jb && (t.width = jb);
		let n = e / 2 / (2.5 + e / 50);
		t.height = (t.height ?? 0) - o - n * 3, t.height < Ab && (t.height = Ab);
	}
	let { shapeSvg: s, bbox: c, label: l } = await J(e, t, X(t)), u = (t?.width ? t?.width : c.width) + a * 2, d = u / 2, f = d / (2.5 + u / 50), p = (t?.height ? t?.height : c.height) + f + o * 2, m = p * .1, h, { cssStyles: g } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = Ob(0, 0, u, p, d, f, m), r = kb(0, f, u, p, d, f), i = U(t, {}), a = e.path(n, i), o = e.path(r, i);
		s.insert(() => o, ":first-child").attr("class", "line"), h = s.insert(() => a, ":first-child"), h.attr("class", "basic label-container"), g && h.attr("style", g);
	} else {
		let e = Db(0, 0, u, p, d, f, m);
		h = s.insert("path", ":first-child").attr("d", e).attr("class", "basic label-container outer-path").attr("style", jh(g)).attr("style", r);
	}
	return h.attr("label-offset-y", f), h.attr("transform", `translate(${-u / 2}, ${-(p / 2 + f)})`), Y(t, h), l.attr("transform", `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + f - (c.y - (c.top ?? 0))})`), t.intersect = function(e) {
		let n = Q.rect(t, e), r = n.x - (t.x ?? 0);
		if (d != 0 && (Math.abs(r) < (t.width ?? 0) / 2 || Math.abs(r) == (t.width ?? 0) / 2 && Math.abs(n.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - f)) {
			let i = f * f * (1 - r * r / (d * d));
			i > 0 && (i = Math.sqrt(i)), i = f - i, e.y - (t.y ?? 0) > 0 && (i = -i), n.y += i;
		}
		return n;
	}, s;
}
i(Mb, "linedCylinder");
async function Nb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 12 : i;
	(t.width || t.height) && (t.width = (t.width ?? 0) * 10 / 11 - a * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - o * 2, t.height < 10 && (t.height = 10));
	let { shapeSvg: s, bbox: c, label: l } = await J(e, t, X(t)), u = (t?.width ? t?.width : c.width) + (a ?? 0) * 2, d = (t?.height ? t?.height : c.height) + (o ?? 0) * 2, f = t.look === "neo" ? d / 4 : d / 8, p = d + f, { cssStyles: m } = t, h = q.svg(s), g = U(t, {});
	t.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = [
		{
			x: -u / 2 - u / 2 * .1,
			y: -p / 2
		},
		{
			x: -u / 2 - u / 2 * .1,
			y: p / 2
		},
		...fy(-u / 2 - u / 2 * .1, p / 2, u / 2 + u / 2 * .1, p / 2, f, .8),
		{
			x: u / 2 + u / 2 * .1,
			y: -p / 2
		},
		{
			x: -u / 2 - u / 2 * .1,
			y: -p / 2
		},
		{
			x: -u / 2,
			y: -p / 2
		},
		{
			x: -u / 2,
			y: p / 2 * 1.1
		},
		{
			x: -u / 2,
			y: -p / 2
		}
	], v = h.polygon(_.map((e) => [e.x, e.y]), g), y = s.insert(() => v, ":first-child");
	return y.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && y.selectAll("path").attr("style", m), r && t.look !== "handDrawn" && y.selectAll("path").attr("style", r), y.attr("transform", `translate(0,${-f / 2})`), l.attr("transform", `translate(${-u / 2 + (t.padding ?? 0) + u / 2 * .1 / 2 - (c.x - (c.left ?? 0))},${-d / 2 + (t.padding ?? 0) - f / 2 - (c.y - (c.top ?? 0))})`), Y(t, y), t.intersect = function(e) {
		return Q.polygon(t, _, e);
	}, s;
}
i(Nb, "linedWaveEdgedRect");
async function Pb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 12 : i, s = t.look === "neo" ? 10 : 5;
	(t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - a * 2 - 2 * s, 10), t.height = Math.max((t?.height ?? 0) - o * 2 - 2 * s, 10));
	let { shapeSvg: c, bbox: l, label: u } = await J(e, t, X(t)), d = (t?.width ? t?.width : l.width) + a * 2 + 2 * s, f = (t?.height ? t?.height : l.height) + o * 2 + 2 * s, p = d - 2 * s, m = f - 2 * s, h = -p / 2, g = -m / 2, { cssStyles: _ } = t, v = q.svg(c), y = U(t, {}), b = [
		{
			x: h - s,
			y: g + s
		},
		{
			x: h - s,
			y: g + m + s
		},
		{
			x: h + p - s,
			y: g + m + s
		},
		{
			x: h + p - s,
			y: g + m
		},
		{
			x: h + p,
			y: g + m
		},
		{
			x: h + p,
			y: g + m - s
		},
		{
			x: h + p + s,
			y: g + m - s
		},
		{
			x: h + p + s,
			y: g - s
		},
		{
			x: h + s,
			y: g - s
		},
		{
			x: h + s,
			y: g
		},
		{
			x: h,
			y: g
		},
		{
			x: h,
			y: g + s
		}
	], x = [
		{
			x: h,
			y: g + s
		},
		{
			x: h + p - s,
			y: g + s
		},
		{
			x: h + p - s,
			y: g + m
		},
		{
			x: h + p,
			y: g + m
		},
		{
			x: h + p,
			y: g
		},
		{
			x: h,
			y: g
		}
	];
	t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
	let S = Z(b), C = v.path(S, y), w = Z(x), T = v.path(w, y);
	t.look !== "handDrawn" && (C = my(C), T = my(T));
	let E = c.insert("g", ":first-child");
	return E.insert(() => C), E.insert(() => T), E.attr("class", "basic label-container outer-path"), _ && t.look !== "handDrawn" && E.selectAll("path").attr("style", _), r && t.look !== "handDrawn" && E.selectAll("path").attr("style", r), u.attr("transform", `translate(${-(l.width / 2) - s - (l.x - (l.left ?? 0))}, ${-(l.height / 2) + s - (l.y - (l.top ?? 0))})`), Y(t, E), t.intersect = function(e) {
		return Q.polygon(t, b, e);
	}, c;
}
i(Pb, "multiRect");
async function Fb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, label: o } = await J(e, t, X(t)), s = t.padding ?? 0, c = t.look === "neo" ? 16 : s, l = t.look === "neo" ? 12 : s, u = !0;
	(t.width || t.height) && (u = !1, t.width = (t?.width ?? 0) - c * 2, t.height = (t?.height ?? 0) - l * 3);
	let d = Math.max(a.width, t?.width ?? 0) + c * 2, f = Math.max(a.height, t?.height ?? 0) + l * 3, p = t.look === "neo" ? f / 4 : f / 8, m = f + (u ? p / 2 : -p / 2), h = -d / 2, g = -m / 2, { cssStyles: _ } = t, v = fy(h - 10, g + m + 10, h + d - 10, g + m + 10, p, .8), y = v?.[v.length - 1], b = [
		{
			x: h - 10,
			y: g + 10
		},
		{
			x: h - 10,
			y: g + m + 10
		},
		...v,
		{
			x: h + d - 10,
			y: y.y - 10
		},
		{
			x: h + d,
			y: y.y - 10
		},
		{
			x: h + d,
			y: y.y - 20
		},
		{
			x: h + d + 10,
			y: y.y - 20
		},
		{
			x: h + d + 10,
			y: g - 10
		},
		{
			x: h + 10,
			y: g - 10
		},
		{
			x: h + 10,
			y: g
		},
		{
			x: h,
			y: g
		},
		{
			x: h,
			y: g + 10
		}
	], x = [
		{
			x: h,
			y: g + 10
		},
		{
			x: h + d - 10,
			y: g + 10
		},
		{
			x: h + d - 10,
			y: y.y - 10
		},
		{
			x: h + d,
			y: y.y - 10
		},
		{
			x: h + d,
			y: g
		},
		{
			x: h,
			y: g
		}
	], S = q.svg(i), C = U(t, {});
	t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
	let w = Z(b), T = S.path(w, C), E = Z(x), D = S.path(E, C), O = i.insert(() => T, ":first-child");
	return O.insert(() => D), O.attr("class", "basic label-container outer-path"), _ && t.look !== "handDrawn" && O.selectAll("path").attr("style", _), r && t.look !== "handDrawn" && O.selectAll("path").attr("style", r), O.attr("transform", `translate(0,${-p / 2})`), o.attr("transform", `translate(${-(a.width / 2) - 10 - (a.x - (a.left ?? 0))}, ${-(a.height / 2) + 10 - p / 2 - (a.y - (a.top ?? 0))})`), Y(t, O), t.intersect = function(e) {
		return Q.polygon(t, b, e);
	}, i;
}
i(Fb, "multiWaveEdgedRectangle");
async function Ib(e, t, { config: { themeVariables: n } }) {
	let { labelStyles: r, nodeStyles: i } = H(t);
	t.labelStyle = r, t.useHtmlLabels || xn(fn()) || (t.centerLabel = !0);
	let { shapeSvg: a, bbox: o, label: s } = await J(e, t, X(t)), c = Math.max(o.width + (t.padding ?? 0) * 2, t?.width ?? 0), l = Math.max(o.height + (t.padding ?? 0) * 2, t?.height ?? 0), u = -c / 2, d = -l / 2, { cssStyles: f } = t, p = q.svg(a), m = U(t, {
		fill: n.noteBkgColor,
		stroke: n.noteBorderColor
	});
	t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
	let h = p.rectangle(u, d, c, l, m), g = a.insert(() => h, ":first-child");
	return g.attr("class", "basic label-container outer-path"), s.attr("class", "label noteLabel"), f && t.look !== "handDrawn" && g.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && g.selectAll("path").attr("style", i), s.attr("transform", `translate(${-o.width / 2 - (o.x - (o.left ?? 0))}, ${-(o.height / 2) - (o.y - (o.top ?? 0))})`), Y(t, g), t.intersect = function(e) {
		return Q.rect(t, e);
	}, a;
}
i(Ib, "note");
var Lb = /* @__PURE__ */ i((e, t, n) => [
	`M${e + n / 2},${t}`,
	`L${e + n},${t - n / 2}`,
	`L${e + n / 2},${t - n}`,
	`L${e},${t - n / 2}`,
	"Z"
].join(" "), "createDecisionBoxPathD");
async function Rb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a } = await J(e, t, X(t)), o = a.width + (t.padding ?? 0) + (a.height + (t.padding ?? 0)), s = .5, c = [
		{
			x: o / 2,
			y: 0
		},
		{
			x: o,
			y: -o / 2
		},
		{
			x: o / 2,
			y: -o
		},
		{
			x: 0,
			y: -o / 2
		}
	], l, { cssStyles: u } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(i), n = U(t, {}), r = Lb(0, 0, o), a = e.path(r, n);
		l = i.insert(() => a, ":first-child").attr("transform", `translate(${-o / 2 + s}, ${o / 2})`), u && l.attr("style", u);
	} else l = Ry(i, o, o, c), l.attr("transform", `translate(${-o / 2 + s}, ${o / 2})`);
	return r && l.attr("style", r), Y(t, l), t.calcIntersect = function(e, t) {
		let n = e.width, r = [
			{
				x: n / 2,
				y: 0
			},
			{
				x: n,
				y: -n / 2
			},
			{
				x: n / 2,
				y: -n
			},
			{
				x: 0,
				y: -n / 2
			}
		], i = Q.polygon(e, r, t);
		return {
			x: i.x - .5,
			y: i.y - .5
		};
	}, t.intersect = function(e) {
		return this.calcIntersect(t, e);
	}, i;
}
i(Rb, "question");
async function zb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 21 : i ?? 0, o = t.look === "neo" ? 12 : i ?? 0, { shapeSvg: s, bbox: c, label: l } = await J(e, t, X(t)), u = (t?.width ?? c.width) + (t.look === "neo" ? a * 2 : a), d = (t?.height ?? c.height) + (t.look === "neo" ? o * 2 : o), f = -u / 2, p = -d / 2, m = p / 2, h = [
		{
			x: f + m,
			y: p
		},
		{
			x: f,
			y: 0
		},
		{
			x: f + m,
			y: -p
		},
		{
			x: -f,
			y: -p
		},
		{
			x: -f,
			y: p
		}
	], { cssStyles: g } = t, _ = q.svg(s), v = U(t, {});
	t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let y = Z(h), b = _.path(y, v), x = s.insert(() => b, ":first-child");
	return x.attr("class", "basic label-container outer-path"), g && t.look !== "handDrawn" && x.selectAll("path").attr("style", g), r && t.look !== "handDrawn" && x.selectAll("path").attr("style", r), x.attr("transform", `translate(${-m / 2},0)`), l.attr("transform", `translate(${-m / 2 - c.width / 2 - (c.x - (c.left ?? 0))}, ${-(c.height / 2) - (c.y - (c.top ?? 0))})`), Y(t, x), t.intersect = function(e) {
		return Q.polygon(t, h, e);
	}, s;
}
i(zb, "rect_left_inv_arrow");
async function Bb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i;
	i = t.cssClasses ? "node " + t.cssClasses : "node default";
	let a = e.insert("g").attr("class", i).attr("id", t.domId || t.id), o = a.insert("g"), s = a.insert("g").attr("class", "label").attr("style", r), l = t.description, u = t.label, d = await gy(s, u, t.labelStyle, !0, !0), f = {
		width: 0,
		height: 0
	};
	if (xn(z())) {
		let e = d.children[0], t = B(d);
		f = e.getBoundingClientRect(), t.attr("width", f.width), t.attr("height", f.height);
	}
	c.info("Text 2", l);
	let p = l || [], m = d.getBBox(), h = await gy(s, Array.isArray(p) ? p.join("<br/>") : p, t.labelStyle, !0, !0), g = h.children[0], _ = B(h);
	f = g.getBoundingClientRect(), _.attr("width", f.width), _.attr("height", f.height);
	let v = (t.padding || 0) / 2;
	B(h).attr("transform", "translate( " + (f.width > m.width ? 0 : (m.width - f.width) / 2) + ", " + (m.height + v + 5) + ")"), B(d).attr("transform", "translate( " + (f.width < m.width ? 0 : -(m.width - f.width) / 2) + ", 0)"), f = s.node().getBBox(), s.attr("transform", "translate(" + -f.width / 2 + ", " + (-f.height / 2 - v + 3) + ")");
	let y = f.width + (t.padding || 0), b = f.height + (t.padding || 0), x = -f.width / 2 - v, S = -f.height / 2 - v, C, w;
	if (t.look === "handDrawn") {
		let e = q.svg(a), n = U(t, {}), r = e.path(_y(x, S, y, b, t.rx || 0), n), i = e.line(-f.width / 2 - v, -f.height / 2 - v + m.height + v, f.width / 2 + v, -f.height / 2 - v + m.height + v, n);
		w = a.insert(() => (c.debug("Rough node insert CXC", r), i), ":first-child"), C = a.insert(() => (c.debug("Rough node insert CXC", r), r), ":first-child");
	} else C = o.insert("rect", ":first-child"), w = o.insert("line"), C.attr("class", "outer title-state").attr("style", r).attr("x", -f.width / 2 - v).attr("y", -f.height / 2 - v).attr("width", f.width + (t.padding || 0)).attr("height", f.height + (t.padding || 0)), w.attr("class", "divider").attr("x1", -f.width / 2 - v).attr("x2", f.width / 2 + v).attr("y1", -f.height / 2 - v + m.height + v).attr("y2", -f.height / 2 - v + m.height + v);
	return Y(t, C), t.intersect = function(e) {
		return Q.rect(t, e);
	}, a;
}
i(Bb, "rectWithTitle");
async function Vb(e, t, { config: { themeVariables: n } }) {
	let r = n?.radius ?? 5;
	return ib(e, t, {
		rx: r,
		ry: r,
		classes: "",
		labelPaddingX: (t?.padding ?? 0) * 1,
		labelPaddingY: (t?.padding ?? 0) * 1
	});
}
i(Vb, "roundedRect");
var Hb = 8;
async function Ub(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.look === "neo" ? 16 : t.padding ?? 0, a = t.look === "neo" ? 12 : t.padding ?? 0, { shapeSvg: o, bbox: s, label: c } = await J(e, t, X(t)), l = (t?.width ?? s.width) + i * 2 + (t.look === "neo" ? Hb : Hb * 2), u = (t?.height ?? s.height) + a * 2, d = l - Hb, f = u, p = Hb - l / 2, m = -u / 2, { cssStyles: h } = t, g = q.svg(o), _ = U(t, {});
	t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
	let v = [
		{
			x: p,
			y: m
		},
		{
			x: p + d,
			y: m
		},
		{
			x: p + d,
			y: m + f
		},
		{
			x: p - Hb,
			y: m + f
		},
		{
			x: p - Hb,
			y: m
		},
		{
			x: p,
			y: m
		},
		{
			x: p,
			y: m + f
		}
	], y = g.polygon(v.map((e) => [e.x, e.y]), _), b = o.insert(() => y, ":first-child");
	return b.attr("class", "basic label-container outer-path").attr("style", jh(h)), r && t.look !== "handDrawn" && b.selectAll("path").attr("style", r), h && t.look !== "handDrawn" && b.selectAll("path").attr("style", r), c.attr("transform", `translate(${Hb / 2 - s.width / 2 - (s.x - (s.left ?? 0))}, ${-(s.height / 2) - (s.y - (s.top ?? 0))})`), Y(t, b), t.intersect = function(e) {
		return Q.rect(t, e);
	}, o;
}
i(Ub, "shadedProcess");
async function Wb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 12 : i;
	(t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - a * 2, 10), t.height = Math.max((t?.height ?? 0) / 1.5 - o * 2, 10));
	let { shapeSvg: s, bbox: c, label: l } = await J(e, t, X(t)), u = (t?.width ? t?.width : c.width) + a * 2, d = ((t?.height ? t?.height : c.height) + o * 2) * 1.5, f = u, p = d / 1.5, m = -f / 2, h = -p / 2, { cssStyles: g } = t, _ = q.svg(s), v = U(t, {});
	t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let y = [
		{
			x: m,
			y: h
		},
		{
			x: m,
			y: h + p
		},
		{
			x: m + f,
			y: h + p
		},
		{
			x: m + f,
			y: h - p / 2
		}
	], b = Z(y), x = _.path(b, v), S = s.insert(() => x, ":first-child");
	return S.attr("class", "basic label-container  outer-path"), g && t.look !== "handDrawn" && S.selectChildren("path").attr("style", g), r && t.look !== "handDrawn" && S.selectChildren("path").attr("style", r), S.attr("transform", `translate(0, ${p / 4})`), l.attr("transform", `translate(${-f / 2 + (t.padding ?? 0) - (c.x - (c.left ?? 0))}, ${-p / 4 + (t.padding ?? 0) - (c.y - (c.top ?? 0))})`), Y(t, S), t.intersect = function(e) {
		return Q.polygon(t, y, e);
	}, s;
}
i(Wb, "slopedRect");
async function Gb(e, t) {
	let n = t.padding ?? 0, r = t.look === "neo" ? 16 : n * 2, i = t.look === "neo" ? 12 : n;
	return ib(e, t, {
		rx: 0,
		ry: 0,
		classes: "",
		labelPaddingX: t.labelPaddingX ?? r,
		labelPaddingY: i
	});
}
i(Gb, "squareRect");
async function Kb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 20 : i, o = t.look === "neo" ? 12 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = c.height + (t.look === "neo" ? o * 2 : o), u = c.width + l / 4 + (t.look === "neo" ? a * 2 : a), d = l / 2, { cssStyles: f } = t, p = q.svg(s), m = U(t, {});
	t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
	let h = [
		{
			x: -u / 2 + d,
			y: -l / 2
		},
		{
			x: u / 2 - d,
			y: -l / 2
		},
		...py(-u / 2 + d, 0, d, 50, 90, 270),
		{
			x: u / 2 - d,
			y: l / 2
		},
		...py(u / 2 - d, 0, d, 50, 270, 450)
	], g = Z(h), _ = p.path(g, m), v = s.insert(() => _, ":first-child");
	return v.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && v.selectChildren("path").attr("style", f), r && t.look !== "handDrawn" && v.selectChildren("path").attr("style", r), Y(t, v), t.intersect = function(e) {
		return Q.polygon(t, h, e);
	}, s;
}
i(Kb, "stadium");
async function qb(e, t) {
	return ib(e, t, {
		rx: t.look === "neo" ? 3 : 5,
		ry: t.look === "neo" ? 3 : 5,
		classes: "flowchart-node"
	});
}
i(qb, "state");
function Jb(e, t, { config: { themeVariables: n } }) {
	let { labelStyles: r, nodeStyles: i } = H(t);
	t.labelStyle = r;
	let { cssStyles: a } = t, { lineColor: o, stateBorder: s, nodeBorder: c, nodeShadow: l } = n;
	(t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width ||= 14, t.height ||= 14;
	let u = e.insert("g").attr("class", "node default").attr("id", t.domId ?? t.id), d = q.svg(u), f = U(t, {});
	t.look !== "handDrawn" && (f.roughness = 0, f.fillStyle = "solid");
	let p = d.circle(0, 0, t.width, {
		...f,
		stroke: o,
		strokeWidth: 2
	}), m = s ?? c, h = (t.width ?? 0) * 5 / 14, g = d.circle(0, 0, h, {
		...f,
		fill: m,
		stroke: m,
		strokeWidth: 2,
		fillStyle: "solid"
	}), _ = u.insert(() => p, ":first-child");
	if (_.insert(() => g), t.look !== "handDrawn" && _.attr("class", "outer-path"), a && _.selectAll("path").attr("style", a), i && _.selectAll("path").attr("style", i), t.width < 25 && l && t.look !== "handDrawn") {
		let t = e.node()?.ownerSVGElement?.id ?? "", n = t ? `${t}-drop-shadow-small` : "drop-shadow-small";
		_.attr("style", `filter:url(#${n})`);
	}
	return Y(t, _), t.intersect = function(e) {
		return Q.circle(t, (t.width ?? 0) / 2, e);
	}, u;
}
i(Jb, "stateEnd");
function Yb(e, t, { config: { themeVariables: n } }) {
	let { lineColor: r, nodeShadow: i } = n;
	(t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width ||= 14, t.height ||= 14;
	let a = e.insert("g").attr("class", "node default").attr("id", t.domId || t.id), o;
	if (t.look === "handDrawn") {
		let e = q.svg(a).circle(0, 0, t.width, Kp(r));
		o = a.insert(() => e), o.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
	} else o = a.insert("circle", ":first-child"), o.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
	if (t.width < 25 && i && t.look !== "handDrawn") {
		let t = e.node()?.ownerSVGElement?.id ?? "", n = t ? `${t}-drop-shadow-small` : "drop-shadow-small";
		o.attr("style", `filter:url(#${n})`);
	}
	return Y(t, o), t.intersect = function(e) {
		return Q.circle(t, (t.width ?? 7) / 2, e);
	}, a;
}
i(Yb, "stateStart");
var Xb = 8;
async function Zb(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t?.padding ?? 8, a = t.look === "neo" ? 28 : i, o = t.look === "neo" ? 12 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.width ?? c.width) + 2 * Xb + a, u = (t?.height ?? c.height) + o, d = l - 2 * Xb, f = u, p = -l / 2, m = -u / 2, h = [
		{
			x: 0,
			y: 0
		},
		{
			x: d,
			y: 0
		},
		{
			x: d,
			y: -f
		},
		{
			x: 0,
			y: -f
		},
		{
			x: 0,
			y: 0
		},
		{
			x: -8,
			y: 0
		},
		{
			x: d + 8,
			y: 0
		},
		{
			x: d + 8,
			y: -f
		},
		{
			x: -8,
			y: -f
		},
		{
			x: -8,
			y: 0
		}
	];
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = U(t, {}), r = e.rectangle(p, m, d + 16, f, n), i = e.line(p + Xb, m, p + Xb, m + f, n), a = e.line(p + Xb + d, m, p + Xb + d, m + f, n);
		s.insert(() => i, ":first-child"), s.insert(() => a, ":first-child");
		let o = s.insert(() => r, ":first-child"), { cssStyles: c } = t;
		o.attr("class", "basic label-container").attr("style", jh(c)), Y(t, o);
	} else {
		let e = Ry(s, d, f, h);
		r && e.attr("style", r), Y(t, e);
	}
	return t.intersect = function(e) {
		return Q.polygon(t, h, e);
	}, s;
}
i(Zb, "subroutine");
var Qb = .2;
async function $b(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 12 : i;
	(t.width || t.height) && (t.height = Math.max((t?.height ?? 0) - o * 2, 10), t.width = Math.max((t?.width ?? 0) - a * 2 - Qb * (t.height + o * 2), 10));
	let { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.height ? t?.height : c.height) + o * 2, u = Qb * l, d = Qb * l, f = (t?.width ? t?.width : c.width) + a * 2 + u - u, p = l, m = -f / 2, h = -p / 2, { cssStyles: g } = t, _ = q.svg(s), v = U(t, {}), y = [
		{
			x: m - u / 2,
			y: h
		},
		{
			x: m + f + u / 2,
			y: h
		},
		{
			x: m + f + u / 2,
			y: h + p
		},
		{
			x: m - u / 2,
			y: h + p
		}
	], b = [
		{
			x: m + f - u / 2,
			y: h + p
		},
		{
			x: m + f + u / 2,
			y: h + p
		},
		{
			x: m + f + u / 2,
			y: h + p - d
		}
	];
	t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let x = Z(y), S = _.path(x, v), C = Z(b), w = _.path(C, {
		...v,
		fillStyle: "solid"
	}), T = s.insert(() => w, ":first-child");
	return T.insert(() => S, ":first-child"), T.attr("class", "basic label-container outer-path"), g && t.look !== "handDrawn" && T.selectAll("path").attr("style", g), r && t.look !== "handDrawn" && T.selectAll("path").attr("style", r), Y(t, T), t.intersect = function(e) {
		return Q.polygon(t, y, e);
	}, s;
}
i($b, "taggedRect");
async function ex(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, label: o } = await J(e, t, X(t)), s = Math.max(a.width + (t.padding ?? 0) * 2, t?.width ?? 0), c = Math.max(a.height + (t.padding ?? 0) * 2, t?.height ?? 0), l = c / 8, u = .2 * s, d = .2 * c, f = c + l, { cssStyles: p } = t, m = q.svg(i), h = U(t, {});
	t.look !== "handDrawn" && (h.roughness = 0, h.fillStyle = "solid");
	let g = [
		{
			x: -s / 2 - s / 2 * .1,
			y: f / 2
		},
		...fy(-s / 2 - s / 2 * .1, f / 2, s / 2 + s / 2 * .1, f / 2, l, .8),
		{
			x: s / 2 + s / 2 * .1,
			y: -f / 2
		},
		{
			x: -s / 2 - s / 2 * .1,
			y: -f / 2
		}
	], _ = -s / 2 + s / 2 * .1, v = -f / 2 - d * .4, y = [
		{
			x: _ + s - u,
			y: (v + c) * 1.3
		},
		{
			x: _ + s,
			y: v + c - d
		},
		{
			x: _ + s,
			y: (v + c) * .9
		},
		...fy(_ + s, (v + c) * 1.25, _ + s - u, (v + c) * 1.3, -c * .02, .5)
	], b = Z(g), x = m.path(b, h), S = Z(y), C = m.path(S, {
		...h,
		fillStyle: "solid"
	}), w = i.insert(() => C, ":first-child");
	return w.insert(() => x, ":first-child"), w.attr("class", "basic label-container outer-path"), p && t.look !== "handDrawn" && w.selectAll("path").attr("style", p), r && t.look !== "handDrawn" && w.selectAll("path").attr("style", r), w.attr("transform", `translate(0,${-l / 2})`), o.attr("transform", `translate(${-s / 2 + (t.padding ?? 0) - (a.x - (a.left ?? 0))},${-c / 2 + (t.padding ?? 0) - l / 2 - (a.y - (a.top ?? 0))})`), Y(t, w), t.intersect = function(e) {
		return Q.polygon(t, g, e);
	}, i;
}
i(ex, "taggedWaveEdgedRectangle");
async function tx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a } = await J(e, t, X(t)), o = Math.max(a.width + (t.padding ?? 0), t?.width || 0), s = Math.max(a.height + (t.padding ?? 0), t?.height || 0), c = -o / 2, l = -s / 2, u = i.insert("rect", ":first-child");
	return u.attr("class", "text").attr("style", r).attr("rx", 0).attr("ry", 0).attr("x", c).attr("y", l).attr("width", o).attr("height", s), Y(t, u), t.intersect = function(e) {
		return Q.rect(t, e);
	}, i;
}
i(tx, "text");
var nx = /* @__PURE__ */ i((e, t, n, r, i, a) => `M${e},${t}
    a${i},${a} 0,0,1 0,${-r}
    l${n},0
    a${i},${a} 0,0,1 0,${r}
    M${n},${-r}
    a${i},${a} 0,0,0 0,${r}
    l${-n},0`, "createCylinderPathD"), rx = /* @__PURE__ */ i((e, t, n, r, i, a) => [
	`M${e},${t}`,
	`M${e + n},${t}`,
	`a${i},${a} 0,0,0 0,${-r}`,
	`l${-n},0`,
	`a${i},${a} 0,0,0 0,${r}`,
	`l${n},0`
].join(" "), "createOuterCylinderPathD"), ix = /* @__PURE__ */ i((e, t, n, r, i, a) => [`M${e + n / 2},${-r / 2}`, `a${i},${a} 0,0,0 0,${r}`].join(" "), "createInnerCylinderPathD"), ax = 5, ox = 10;
async function sx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 12 : i / 2;
	if (t.width || t.height) {
		let e = t.height ?? 0;
		t.height = (t.height ?? 0) - a, t.height < ax && (t.height = ax);
		let n = e / 2 / (2.5 + e / 50);
		t.width = (t.width ?? 0) - a - n * 3, t.width < ox && (t.width = ox);
	}
	let { shapeSvg: o, bbox: s, label: c } = await J(e, t, X(t)), l = (t.height ? t.height : s.height) + a, u = l / 2, d = u / (2.5 + l / 50), f = (t.width ? t.width : s.width) + d + a, { cssStyles: p } = t, m;
	if (t.look === "handDrawn") {
		let e = q.svg(o), n = rx(0, 0, f, l, d, u), r = ix(0, 0, f, l, d, u), i = e.path(n, U(t, {})), a = e.path(r, U(t, { fill: "none" }));
		m = o.insert(() => a, ":first-child"), m = o.insert(() => i, ":first-child"), m.attr("class", "basic label-container"), p && m.attr("style", p);
	} else {
		let e = nx(0, 0, f, l, d, u);
		m = o.insert("path", ":first-child").attr("d", e).attr("class", "basic label-container").attr("style", jh(p)).attr("style", r), m.attr("class", "basic label-container outer-path"), p && m.selectAll("path").attr("style", p), r && m.selectAll("path").attr("style", r);
	}
	return m.attr("label-offset-x", d), m.attr("transform", `translate(${-f / 2}, ${l / 2} )`), c.attr("transform", `translate(${-(s.width / 2) - d - (s.x - (s.left ?? 0))}, ${-(s.height / 2) - (s.y - (s.top ?? 0))})`), Y(t, m), t.intersect = function(e) {
		let n = Q.rect(t, e), r = n.y - (t.y ?? 0);
		if (u != 0 && (Math.abs(r) < (t.height ?? 0) / 2 || Math.abs(r) == (t.height ?? 0) / 2 && Math.abs(n.x - (t.x ?? 0)) > (t.width ?? 0) / 2 - d)) {
			let i = d * d * (1 - r * r / (u * u));
			i != 0 && (i = Math.sqrt(Math.abs(i))), i = d - i, e.x - (t.x ?? 0) > 0 && (i = -i), n.x += i;
		}
		return n;
	}, o;
}
i(sx, "tiltedCylinder");
async function cx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = (t.look, i), o = t.look === "neo" ? i * 2 : i, { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.height ?? c.height) + a, u = (t?.width ?? c.width) + o, d = [
		{
			x: -3 * l / 6,
			y: 0
		},
		{
			x: u + 3 * l / 6,
			y: 0
		},
		{
			x: u,
			y: -l
		},
		{
			x: 0,
			y: -l
		}
	], f, { cssStyles: p } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(s), n = U(t, {}), r = Z(d), i = e.path(r, n);
		f = s.insert(() => i, ":first-child").attr("transform", `translate(${-u / 2}, ${l / 2})`), p && f.attr("style", p);
	} else f = Ry(s, u, l, d);
	return r && f.attr("style", r), t.width = u, t.height = l, Y(t, f), t.intersect = function(e) {
		return Q.polygon(t, d, e);
	}, s;
}
i(cx, "trapezoid");
async function lx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 12 : i;
	(t.width || t.height) && (t.height = (t.height ?? 0) - o * 2, t.height < 5 && (t.height = 5), t.width = (t.width ?? 0) - a * 2, t.width < 15 && (t.width = 15));
	let { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.width ? t?.width : c.width) + a * 2, u = (t?.height ? t?.height : c.height) + o * 2, { cssStyles: d } = t, f = q.svg(s), p = U(t, {});
	t.look !== "handDrawn" && (p.roughness = 0, p.fillStyle = "solid");
	let m = [
		{
			x: -l / 2 * .8,
			y: -u / 2
		},
		{
			x: l / 2 * .8,
			y: -u / 2
		},
		{
			x: l / 2,
			y: -u / 2 * .6
		},
		{
			x: l / 2,
			y: u / 2
		},
		{
			x: -l / 2,
			y: u / 2
		},
		{
			x: -l / 2,
			y: -u / 2 * .6
		}
	], h = Z(m), g = f.path(h, p), _ = s.insert(() => g, ":first-child");
	return _.attr("class", "basic label-container outer-path"), d && t.look !== "handDrawn" && _.selectChildren("path").attr("style", d), r && t.look !== "handDrawn" && _.selectChildren("path").attr("style", r), Y(t, _), t.intersect = function(e) {
		return Q.polygon(t, m, e);
	}, s;
}
i(lx, "trapezoidalPentagon");
var ux = 10, dx = 10;
async function fx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? i * 2 : i;
	(t.width || t.height) && (t.width = ((t?.width ?? 0) - a) / 2, t.width < dx && (t.width = dx), t.height = t?.height ?? 0, t.height < ux && (t.height = ux));
	let { shapeSvg: o, bbox: s, label: l } = await J(e, t, X(t)), u = tn(z().flowchart?.htmlLabels), d = (t?.width ? t?.width : s.width) + a, f = t?.height ? t?.height : d + s.height, p = f, m = [
		{
			x: 0,
			y: 0
		},
		{
			x: p,
			y: 0
		},
		{
			x: p / 2,
			y: -f
		}
	], { cssStyles: h } = t, g = q.svg(o), _ = U(t, {});
	t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
	let v = Z(m), y = g.path(v, _), b = o.insert(() => y, ":first-child").attr("transform", `translate(${-f / 2}, ${f / 2})`).attr("class", "outer-path");
	return h && t.look !== "handDrawn" && b.selectChildren("path").attr("style", h), r && t.look !== "handDrawn" && b.selectChildren("path").attr("style", r), t.width = d, t.height = f, Y(t, b), l.attr("transform", `translate(${-s.width / 2 - (s.x - (s.left ?? 0))}, ${f / 2 - (s.height + (t.padding ?? 0) / (u ? 2 : 1) - (s.y - (s.top ?? 0)))})`), t.intersect = function(e) {
		return c.info("Triangle intersect", t, m, e), Q.polygon(t, m, e);
	}, o;
}
i(fx, "triangle");
async function px(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 12 : i, s = !0;
	(t.width || t.height) && (s = !1, t.width = (t?.width ?? 0) - a * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - o * 2, t.height < 10 && (t.height = 10));
	let { shapeSvg: c, bbox: l, label: u } = await J(e, t, X(t)), d = (t?.width ? t?.width : l.width) + (a ?? 0) * 2, f = (t?.height ? t?.height : l.height) + (o ?? 0) * 2, p = t.look === "neo" ? f / 4 : f / 8, m = f + (s ? p : -p), { cssStyles: h } = t, g = 14 - d, _ = g > 0 ? g / 2 : 0, v = q.svg(c), y = U(t, {});
	t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
	let b = [
		{
			x: -d / 2 - _,
			y: m / 2
		},
		...fy(-d / 2 - _, m / 2, d / 2 + _, m / 2, p, .8),
		{
			x: d / 2 + _,
			y: -m / 2
		},
		{
			x: -d / 2 - _,
			y: -m / 2
		}
	], x = Z(b), S = v.path(x, y), C = c.insert(() => S, ":first-child");
	return C.attr("class", "basic label-container outer-path"), h && t.look !== "handDrawn" && C.selectAll("path").attr("style", h), r && t.look !== "handDrawn" && C.selectAll("path").attr("style", r), C.attr("transform", `translate(0,${-p / 2})`), u.attr("transform", `translate(${-d / 2 + (t.padding ?? 0) - (l.x - (l.left ?? 0))},${-f / 2 + (t.padding ?? 0) - p - (l.y - (l.top ?? 0))})`), Y(t, C), t.intersect = function(e) {
		return Q.polygon(t, b, e);
	}, c;
}
i(px, "waveEdgedRectangle");
async function mx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.padding ?? 0, a = t.look === "neo" ? 16 : i, o = t.look === "neo" ? 20 : i;
	if (t.width || t.height) {
		t.width = t?.width ?? 0, t.width < 20 && (t.width = 20), t.height = t?.height ?? 0, t.height < 10 && (t.height = 10);
		let e = Math.min(t.height * .2, t.height / 4);
		t.height = Math.ceil(t.height - o - 20 / 9 * e), t.width -= a * 2;
	}
	let { shapeSvg: s, bbox: c } = await J(e, t, X(t)), l = (t?.width ? t?.width : c.width) + a * 2, u = (t?.height ? t?.height : c.height) + o, d = u / 8, f = u + d * 2, { cssStyles: p } = t, m = q.svg(s), h = U(t, {});
	t.look !== "handDrawn" && (h.roughness = 0, h.fillStyle = "solid");
	let g = [
		{
			x: -l / 2,
			y: f / 2
		},
		...fy(-l / 2, f / 2, l / 2, f / 2, d, 1),
		{
			x: l / 2,
			y: -f / 2
		},
		...fy(l / 2, -f / 2, -l / 2, -f / 2, d, -1)
	], _ = Z(g), v = m.path(_, h), y = s.insert(() => v, ":first-child");
	return y.attr("class", "basic label-container"), p && t.look !== "handDrawn" && y.selectAll("path").attr("style", p), r && t.look !== "handDrawn" && y.selectAll("path").attr("style", r), Y(t, y), t.intersect = function(e) {
		return Q.polygon(t, g, e);
	}, s;
}
i(mx, "waveRectangle");
var hx = 10;
async function gx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t.look === "neo" ? 16 : t.padding ?? 0, a = t.look === "neo" ? 12 : t.padding ?? 0;
	(t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - i * 2 - hx, 10), t.height = Math.max((t?.height ?? 0) - a * 2 - hx, 10));
	let { shapeSvg: o, bbox: s, label: c } = await J(e, t, X(t)), l = (t?.width ? t?.width : s.width) + i * 2 + hx, u = (t?.height ? t?.height : s.height) + a * 2 + hx, d = l - hx, f = u - hx, p = -d / 2, m = -f / 2, { cssStyles: h } = t, g = q.svg(o), _ = U(t, {}), v = [
		{
			x: p - hx,
			y: m - hx
		},
		{
			x: p - hx,
			y: m + f
		},
		{
			x: p + d,
			y: m + f
		},
		{
			x: p + d,
			y: m - hx
		}
	], y = `M${p - hx},${m - hx} L${p + d},${m - hx} L${p + d},${m + f} L${p - hx},${m + f} L${p - hx},${m - hx}
                M${p - hx},${m} L${p + d},${m}
                M${p},${m - hx} L${p},${m + f}`;
	t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
	let b = g.path(y, _), x = o.insert(() => b, ":first-child");
	return x.attr("transform", `translate(${hx / 2}, ${hx / 2})`), x.attr("class", "basic label-container outer-path"), h && t.look !== "handDrawn" && x.selectAll("path").attr("style", h), r && t.look !== "handDrawn" && x.selectAll("path").attr("style", r), c.attr("transform", `translate(${-(s.width / 2) + hx / 2 - (s.x - (s.left ?? 0))}, ${-(s.height / 2) + hx / 2 - (s.y - (s.top ?? 0))})`), Y(t, x), t.intersect = function(e) {
		return Q.polygon(t, v, e);
	}, o;
}
i(gx, "windowPane");
var _x = /* @__PURE__ */ new Set(["redux-color", "redux-dark-color"]), vx = /* @__PURE__ */ new Set([
	"redux",
	"redux-dark",
	"redux-color",
	"redux-dark-color"
]);
async function yx(e, t) {
	let n = t;
	n.alias && (t.label = n.alias);
	let { theme: r, themeVariables: i } = fn(), { rowEven: a, rowOdd: o, nodeBorder: s, borderColorArray: c } = i;
	if (t.look === "handDrawn") {
		let { themeVariables: n } = fn(), { background: r } = n;
		await yx(e, {
			...t,
			id: t.id + "-background",
			domId: (t.domId || t.id) + "-background",
			look: "default",
			cssStyles: ["stroke: none", `fill: ${r}`]
		});
	}
	let l = fn();
	t.useHtmlLabels = l.htmlLabels;
	let u = l.er?.diagramPadding ?? 10, d = l.er?.entityPadding ?? 6, { cssStyles: f } = t, { labelStyles: p, nodeStyles: m } = H(t);
	if (n.attributes.length === 0 && t.label) {
		let i = {
			rx: 0,
			ry: 0,
			labelPaddingX: u,
			labelPaddingY: u * 1.5,
			classes: ""
		};
		vh(t.label, l) + i.labelPaddingX * 2 < l.er.minEntityWidth && (t.width = l.er.minEntityWidth);
		let a = await ib(e, t, i);
		if (r != null && _x.has(r)) {
			let e = n.colorIndex ?? 0;
			a.attr("data-color-id", `color-${e % c.length}`);
		}
		if (!tn(l.htmlLabels)) {
			let e = a.select("text"), t = e.node()?.getBBox();
			e.attr("transform", `translate(${-t.width / 2}, 0)`);
		}
		return a;
	}
	l.htmlLabels || (u *= 1.25, d *= 1.25);
	let h = X(t);
	h ||= "node default";
	let g = e.insert("g").attr("class", h).attr("id", t.domId || t.id), _ = await bx(g, t.label ?? "", l, 0, 0, ["name"], p);
	_.height += d;
	let v = 0, y = [], b = [], x = 0, S = 0, C = 0, w = 0, T = !0, E = !0;
	for (let e of n.attributes) {
		let t = await bx(g, e.type, l, 0, v, ["attribute-type"], p);
		x = Math.max(x, t.width + u);
		let n = await bx(g, e.name, l, 0, v, ["attribute-name"], p);
		S = Math.max(S, n.width + u);
		let r = await bx(g, e.keys.join(), l, 0, v, ["attribute-keys"], p);
		C = Math.max(C, r.width + u);
		let i = await bx(g, e.comment, l, 0, v, ["attribute-comment"], p);
		w = Math.max(w, i.width + u);
		let a = Math.max(t.height, n.height, r.height, i.height) + d;
		b.push({
			yOffset: v,
			rowHeight: a
		}), v += a;
	}
	let D = 4;
	C <= u && (T = !1, C = 0, D--), w <= u && (E = !1, w = 0, D--);
	let O = g.node().getBBox();
	if (_.width + u * 2 - (x + S + C + w) > 0) {
		let e = _.width + u * 2 - (x + S + C + w);
		x += e / D, S += e / D, C > 0 && (C += e / D), w > 0 && (w += e / D);
	}
	let k = x + S + C + w, A = q.svg(g), ee = U(t, {});
	t.look !== "handDrawn" && (ee.roughness = 0, ee.fillStyle = "solid");
	let j = 0;
	b.length > 0 && (j = b.reduce((e, t) => e + (t?.rowHeight ?? 0), 0));
	let te = Math.max(O.width + u * 2, t?.width || 0, k), ne = Math.max((j ?? 0) + _.height, t?.height || 0), re = -te / 2, ie = -ne / 2;
	if (g.selectAll("g:not(:first-child)").each((e, t, n) => {
		let r = B(n[t]), i = r.attr("transform"), a = 0, o = 0;
		if (i) {
			let e = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(i);
			e && (a = parseFloat(e[1]), o = parseFloat(e[2]), r.attr("class").includes("attribute-name") ? a += x : r.attr("class").includes("attribute-keys") ? a += x + S : r.attr("class").includes("attribute-comment") && (a += x + S + C));
		}
		r.attr("transform", `translate(${re + u / 2 + a}, ${o + ie + _.height + d / 2})`);
	}), g.select(".name").attr("transform", "translate(" + -_.width / 2 + ", " + (ie + d / 2) + ")"), r != null && _x.has(r)) {
		let e = n.colorIndex ?? 0;
		g.attr("data-color-id", `color-${e % c.length}`);
	}
	let M = A.rectangle(re, ie, te, ne, ee), ae = g.insert(() => M, ":first-child").attr("class", "outer-path").attr("style", f.join(""));
	y.push(0);
	for (let [e, t] of b.entries()) {
		let n = (e + 1) % 2 == 0 && t.yOffset !== 0, r = A.rectangle(re, _.height + ie + t?.yOffset, te, t?.rowHeight, {
			...ee,
			fill: n ? a : o,
			stroke: s
		});
		g.insert(() => r, "g.label").attr("style", f.join("")).attr("class", `row-rect-${n ? "even" : "odd"}`);
	}
	let oe = 1e-4, se = xx(re, _.height + ie, te + re, _.height + ie, oe), ce = A.polygon(se.map((e) => [e.x, e.y]), ee);
	if (g.insert(() => ce).attr("class", "divider"), se = xx(x + re, _.height + ie, x + re, ne + ie, oe), ce = A.polygon(se.map((e) => [e.x, e.y]), ee), g.insert(() => ce).attr("class", "divider"), T) {
		let e = x + S + re;
		se = xx(e, _.height + ie, e, ne + ie, oe), ce = A.polygon(se.map((e) => [e.x, e.y]), ee), g.insert(() => ce).attr("class", "divider");
	}
	if (E) {
		let e = x + S + C + re;
		se = xx(e, _.height + ie, e, ne + ie, oe), ce = A.polygon(se.map((e) => [e.x, e.y]), ee), g.insert(() => ce).attr("class", "divider");
	}
	for (let e of y) {
		let t = _.height + ie + e;
		se = xx(re, t, te + re, t, oe), ce = A.polygon(se.map((e) => [e.x, e.y]), ee), g.insert(() => ce).attr("class", "divider");
	}
	if (Y(t, ae), m && t.look !== "handDrawn") if (r != null && vx.has(r)) g.selectAll("path").attr("style", m);
	else {
		let e = m.split(";")?.filter((e) => e.includes("stroke"))?.map((e) => `${e}`).join("; ");
		g.selectAll("path").attr("style", e ?? ""), g.selectAll(".row-rect-even path").attr("style", m);
	}
	return t.intersect = function(e) {
		return Q.rect(t, e);
	}, g;
}
i(yx, "erBox");
async function bx(e, t, n, r = 0, i = 0, a = [], o = "") {
	let s = e.insert("g").attr("class", `label ${a.join(" ")}`).attr("transform", `translate(${r}, ${i})`).attr("style", o);
	t !== Kn(t) && (t = Kn(t), t = t.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
	let c = s.node().appendChild(await ov(s, t, {
		width: vh(t, n) + 100,
		style: o,
		useHtmlLabels: n.htmlLabels
	}, n));
	if (t.includes("&lt;") || t.includes("&gt;")) {
		let e = c.children[0];
		for (e.textContent = e.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">"); e.childNodes[0];) e = e.childNodes[0], e.textContent = e.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
	}
	let l = c.getBBox();
	if (tn(n.htmlLabels)) {
		let e = c.children[0];
		e.style.textAlign = "start";
		let t = B(c);
		l = e.getBoundingClientRect(), t.attr("width", l.width), t.attr("height", l.height);
	}
	return l;
}
i(bx, "addText");
function xx(e, t, n, r, i) {
	return e === n ? [
		{
			x: e - i / 2,
			y: t
		},
		{
			x: e + i / 2,
			y: t
		},
		{
			x: n + i / 2,
			y: r
		},
		{
			x: n - i / 2,
			y: r
		}
	] : [
		{
			x: e,
			y: t - i / 2
		},
		{
			x: e,
			y: t + i / 2
		},
		{
			x: n,
			y: r + i / 2
		},
		{
			x: n,
			y: r - i / 2
		}
	];
}
i(xx, "lineToPolygon");
async function Sx(e, t, n, r, i = n.class.padding ?? 12) {
	let a = r ? 0 : 3, o = e.insert("g").attr("class", X(t)).attr("id", t.domId || t.id), s = null, c = null, l = null, u = null, d = 0, f = 0, p = 0;
	if (s = o.insert("g").attr("class", "annotation-group text"), t.annotations.length > 0) {
		let e = t.annotations[0];
		await Cx(s, { text: `\xAB${e}\xBB` }, 0), d = s.node().getBBox().height;
	}
	c = o.insert("g").attr("class", "label-group text"), await Cx(c, t, 0, ["font-weight: bolder"]);
	let m = c.node().getBBox();
	f = m.height, l = o.insert("g").attr("class", "members-group text");
	let h = 0;
	for (let e of t.members) {
		let t = await Cx(l, e, h, [e.parseClassifier()]);
		h += t + a;
	}
	p = l.node().getBBox().height, p <= 0 && (p = i / 2), u = o.insert("g").attr("class", "methods-group text");
	let g = 0;
	for (let e of t.methods) {
		let t = await Cx(u, e, g, [e.parseClassifier()]);
		g += t + a;
	}
	let _ = o.node().getBBox();
	if (s !== null) {
		let e = s.node().getBBox();
		s.attr("transform", `translate(${-e.width / 2})`);
	}
	return c.attr("transform", `translate(${-m.width / 2}, ${d})`), _ = o.node().getBBox(), l.attr("transform", `translate(0, ${d + f + i * 2})`), _ = o.node().getBBox(), u.attr("transform", `translate(0, ${d + f + (p ? p + i * 4 : i * 2)})`), _ = o.node().getBBox(), {
		shapeSvg: o,
		bbox: _
	};
}
i(Sx, "textHelper");
async function Cx(e, t, n, r = []) {
	let a = e.insert("g").attr("class", "label").attr("style", r.join("; ")), o = fn(), s = "useHtmlLabels" in t ? t.useHtmlLabels : tn(o.htmlLabels) ?? !0, c = "";
	c = "text" in t ? t.text : t.label, !s && c.startsWith("\\") && (c = c.substring(1)), Qn(c) && (s = !0);
	let l = await ov(a, Or(kh(c)), {
		width: vh(c, o) + 50,
		classes: "markdown-node-label",
		useHtmlLabels: s
	}, o), u, d = 1;
	if (s) {
		let e = l.children[0], t = B(l);
		d = e.innerHTML.split("<br>").length, e.innerHTML.includes("</math>") && (d += e.innerHTML.split("<mrow>").length - 1);
		let n = e.getElementsByTagName("img");
		if (n) {
			let e = c.replace(/<img[^>]*>/g, "").trim() === "";
			await Promise.all([...n].map((t) => new Promise((n) => {
				function r() {
					if (t.style.display = "flex", t.style.flexDirection = "column", e) {
						let e = o.fontSize?.toString() ?? window.getComputedStyle(document.body).fontSize, n = parseInt(e, 10) * 5 + "px";
						t.style.minWidth = n, t.style.maxWidth = n;
					} else t.style.width = "100%";
					n(t);
				}
				i(r, "setupImage"), setTimeout(() => {
					t.complete && r();
				}), t.addEventListener("error", r), t.addEventListener("load", r);
			})));
		}
		u = e.getBoundingClientRect(), t.attr("width", u.width), t.attr("height", u.height);
	} else {
		r.includes("font-weight: bolder") && B(l).selectAll("tspan").attr("font-weight", ""), d = l.children.length;
		let e = l.children[0];
		(l.textContent === "" || l.textContent.includes("&gt")) && (e.textContent = c[0] + c.substring(1).replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim(), c[1] === " " && (e.textContent = e.textContent[0] + " " + e.textContent.substring(1))), e.textContent === "undefined" && (e.textContent = ""), u = l.getBBox();
	}
	return a.attr("transform", "translate(0," + (-u.height / (2 * d) + n) + ")"), u.height;
}
i(Cx, "addText");
async function wx(e, t) {
	let n = z(), { themeVariables: r } = n, { useGradient: i } = r, a = n.class.padding ?? 12, o = a, s = t.useHtmlLabels ?? tn(n.htmlLabels) ?? !0, c = t;
	c.annotations = c.annotations ?? [], c.members = c.members ?? [], c.methods = c.methods ?? [];
	let { shapeSvg: l, bbox: u } = await Sx(e, t, n, s, o), { labelStyles: d, nodeStyles: f } = H(t);
	t.labelStyle = d, t.cssStyles = c.styles || "";
	let p = c.styles?.join(";") || f || "";
	t.cssStyles ||= p.replaceAll("!important", "").split(";");
	let m = c.members.length === 0 && c.methods.length === 0 && !n.class?.hideEmptyMembersBox, h = q.svg(l), g = U(t, {});
	t.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = Math.max(t.width ?? 0, u.width), v = Math.max(t.height ?? 0, u.height), y = (t.height ?? 0) > u.height;
	c.members.length === 0 && c.methods.length === 0 ? v += o : c.members.length > 0 && c.methods.length === 0 && (v += o * 2);
	let b = -_ / 2, x = -v / 2, S = m ? a * 2 : c.members.length === 0 && c.methods.length === 0 ? -a : 0;
	y && (S = a * 2);
	let C = h.rectangle(b - a, x - a - (m ? a : c.members.length === 0 && c.methods.length === 0 ? -a / 2 : 0), _ + 2 * a, v + 2 * a + S, g), w = l.insert(() => C, ":first-child");
	w.attr("class", "basic label-container outer-path");
	let T = w.node().getBBox(), E = l.select(".annotation-group").node().getBBox().height - (m ? a / 2 : 0) || 0, D = l.select(".label-group").node().getBBox().height - (m ? a / 2 : 0) || 0, O = l.select(".members-group").node().getBBox().height - (m ? a / 2 : 0) || 0, k = (E + D + x + a - (x - a - (m ? a : c.members.length === 0 && c.methods.length === 0 ? -a / 2 : 0))) / 2;
	if (l.selectAll(".text").each((e, t, r) => {
		let i = B(r[t]), u = i.attr("transform"), d = 0;
		if (u) {
			let e = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(u);
			e && (d = parseFloat(e[2]));
		}
		let f = d + x + a - (m ? a : c.members.length === 0 && c.methods.length === 0 ? -a / 2 : 0);
		if (i.attr("class").includes("methods-group")) {
			let e = Math.max(O, o / 2);
			f = y ? Math.max(k, E + D + e + x + o * 2 + a) + o * 2 : E + D + e + x + o * 4 + a;
		}
		c.members.length === 0 && c.methods.length === 0 && n.class?.hideEmptyMembersBox && (f = c.annotations.length > 0 ? d - o : d), s || (f -= 4);
		let p = b;
		(i.attr("class").includes("label-group") || i.attr("class").includes("annotation-group")) && (p = -i.node()?.getBBox().width / 2 || 0, l.selectAll("text").each(function(e, t, n) {
			window.getComputedStyle(n[t]).textAnchor === "middle" && (p = 0);
		})), i.attr("transform", `translate(${p}, ${f})`);
	}), c.members.length > 0 || c.methods.length > 0 || m) {
		let e = E + D + x + a, n = h.line(T.x, e, T.x + T.width, e + .001, g);
		l.insert(() => n).attr("class", `divider${t.look === "neo" && !i ? " neo-line" : ""}`).attr("style", p);
	}
	if (m || c.members.length > 0 || c.methods.length > 0) {
		let e = E + D + O + x + o * 2 + a, n = h.line(T.x, y ? Math.max(k, e) : e, T.x + T.width, (y ? Math.max(k, e) : e) + .001, g);
		l.insert(() => n).attr("class", `divider${t.look === "neo" && !i ? " neo-line" : ""}`).attr("style", p);
	}
	if (c.look !== "handDrawn" && l.selectAll("path").attr("style", p), w.select(":nth-child(2)").attr("style", p), l.selectAll(".divider").select("path").attr("style", p), t.labelStyle ? l.selectAll("span").attr("style", t.labelStyle) : l.selectAll("span").attr("style", p), !s) {
		let e = RegExp(/color\s*:\s*([^;]*)/), t = e.exec(p);
		if (t) {
			let e = t[0].replace("color", "fill");
			l.selectAll("tspan").attr("style", e);
		} else if (d) {
			let t = e.exec(d);
			if (t) {
				let e = t[0].replace("color", "fill");
				l.selectAll("tspan").attr("style", e);
			}
		}
	}
	return Y(t, w), t.intersect = function(e) {
		return Q.rect(t, e);
	}, l;
}
i(wx, "classBox");
async function Tx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let i = t, a = t, o = "verifyMethod" in t, s = X(t), { themeVariables: c } = z(), { borderColorArray: l, requirementEdgeLabelBackground: u } = c, d = e.insert("g").attr("class", s).attr("id", t.domId ?? t.id), f;
	f = o ? await Ex(d, `&lt;&lt;${i.type}&gt;&gt;`, 0, t.labelStyle) : await Ex(d, "&lt;&lt;Element&gt;&gt;", 0, t.labelStyle);
	let p = f, m = await Ex(d, i.name, p, t.labelStyle + "; font-weight: bold;");
	if (p += m + 20, o) {
		let e = await Ex(d, `${i.requirementId ? `ID: ${i.requirementId}` : ""}`, p, t.labelStyle);
		p += e;
		let n = await Ex(d, `${i.text ? `Text: ${i.text}` : ""}`, p, t.labelStyle);
		p += n;
		let r = await Ex(d, `${i.risk ? `Risk: ${i.risk}` : ""}`, p, t.labelStyle);
		p += r, await Ex(d, `${i.verifyMethod ? `Verification: ${i.verifyMethod}` : ""}`, p, t.labelStyle);
	} else {
		let e = await Ex(d, `${a.type ? `Type: ${a.type}` : ""}`, p, t.labelStyle);
		p += e, await Ex(d, `${a.docRef ? `Doc Ref: ${a.docRef}` : ""}`, p, t.labelStyle);
	}
	let h = (d.node()?.getBBox().width ?? 200) + 20, g = (d.node()?.getBBox().height ?? 200) + 20, _ = -h / 2, v = -g / 2, y = q.svg(d), b = U(t, {});
	t.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
	let x = y.rectangle(_, v, h, g, b), S = d.insert(() => x, ":first-child");
	if (S.attr("class", "basic label-container outer-path").attr("style", r), l?.length) {
		let e = t.colorIndex ?? 0;
		d.attr("data-color-id", `color-${e % l.length}`);
	}
	if (d.selectAll(".label").each((e, t, n) => {
		let r = B(n[t]), i = r.attr("transform"), a = 0, o = 0;
		if (i) {
			let e = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(i);
			e && (a = parseFloat(e[1]), o = parseFloat(e[2]));
		}
		let s = o - g / 2, c = _ + 20 / 2;
		(t === 0 || t === 1) && (c = a), r.attr("transform", `translate(${c}, ${s + 20})`);
	}), p > f + m + 20) {
		let e = v + f + m + 20, n;
		if (t.look === "neo") {
			let t = .001, r = [
				[_, e],
				[_ + h, e],
				[_ + h, e + t],
				[_, e + t]
			];
			n = y.polygon(r, b);
		} else n = y.line(_, e, _ + h, e, b);
		d.insert(() => n).attr("class", "divider");
	}
	return Y(t, S), t.intersect = function(e) {
		return Q.rect(t, e);
	}, r && t.look !== "handDrawn" && (u || l?.length) && d.selectAll("path").attr("style", r), d;
}
i(Tx, "requirementBox");
async function Ex(e, t, n, r = "") {
	if (t === "") return 0;
	let i = e.insert("g").attr("class", "label").attr("style", r), a = z(), o = a.htmlLabels ?? !0, s = await ov(i, Or(kh(t)), {
		width: vh(t, a) + 50,
		classes: "markdown-node-label",
		useHtmlLabels: o,
		style: r
	}, a), c;
	if (o) {
		let e = s.children[0], t = B(s);
		c = e.getBoundingClientRect(), t.attr("width", c.width), t.attr("height", c.height);
	} else {
		let e = s.children[0];
		for (let t of e.children) r && t.setAttribute("style", r);
		c = s.getBBox(), c.height += 6;
	}
	return i.attr("transform", `translate(${-c.width / 2},${-c.height / 2 + n})`), c.height;
}
i(Ex, "addText");
var Dx = /* @__PURE__ */ i((e) => {
	switch (e) {
		case "Very High": return "red";
		case "High": return "orange";
		case "Medium": return null;
		case "Low": return "blue";
		case "Very Low": return "lightblue";
	}
}, "colorFromPriority");
async function Ox(e, t, { config: n }) {
	let { labelStyles: r, nodeStyles: i } = H(t);
	t.labelStyle = r || "";
	let a = t.width;
	t.width = (t.width ?? 200) - 10;
	let { shapeSvg: o, bbox: s, label: c } = await J(e, t, X(t)), l = t.padding || 10, u = "", d;
	"ticket" in t && t.ticket && n?.kanban?.ticketBaseUrl && (u = n?.kanban?.ticketBaseUrl.replace("#TICKET#", t.ticket), d = o.insert("svg:a", ":first-child").attr("class", "kanban-ticket-link").attr("xlink:href", u).attr("target", "_blank"));
	let f = {
		useHtmlLabels: t.useHtmlLabels,
		labelStyle: t.labelStyle || "",
		width: t.width,
		img: t.img,
		padding: t.padding || 8,
		centerLabel: !1
	}, p, m;
	d ? {label: p, bbox: m} = await dy(d, "ticket" in t && t.ticket || "", f) : {label: p, bbox: m} = await dy(o, "ticket" in t && t.ticket || "", f);
	let { label: h, bbox: g } = await dy(o, "assigned" in t && t.assigned || "", f);
	t.width = a;
	let _ = t?.width || 0, v = Math.max(m.height, g.height) / 2, y = Math.max(s.height + 20, t?.height || 0) + v, b = -_ / 2, x = -y / 2;
	c.attr("transform", "translate(" + (l - _ / 2) + ", " + (-v - s.height / 2) + ")"), p.attr("transform", "translate(" + (l - _ / 2) + ", " + (-v + s.height / 2) + ")"), h.attr("transform", "translate(" + (l + _ / 2 - g.width - 20) + ", " + (-v + s.height / 2) + ")");
	let S, { rx: C, ry: w } = t, { cssStyles: T } = t;
	if (t.look === "handDrawn") {
		let e = q.svg(o), n = U(t, {}), r = C || w ? e.path(_y(b, x, _, y, C || 0), n) : e.rectangle(b, x, _, y, n);
		S = o.insert(() => r, ":first-child"), S.attr("class", "basic label-container").attr("style", T || null);
	} else {
		S = o.insert("rect", ":first-child"), S.attr("class", "basic label-container __APA__").attr("style", i).attr("rx", C ?? 5).attr("ry", w ?? 5).attr("x", b).attr("y", x).attr("width", _).attr("height", y);
		let e = "priority" in t && t.priority;
		if (e) {
			let t = o.append("line"), n = b + 2, r = x + Math.floor((C ?? 0) / 2), i = x + y - Math.floor((C ?? 0) / 2);
			t.attr("x1", n).attr("y1", r).attr("x2", n).attr("y2", i).attr("stroke-width", "4").attr("stroke", Dx(e));
		}
	}
	return Y(t, S), t.height = y, t.intersect = function(e) {
		return Q.rect(t, e);
	}, o;
}
i(Ox, "kanbanItem");
async function kx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, halfPadding: o, label: s } = await J(e, t, X(t)), l = a.width + 10 * o, u = a.height + 8 * o, d = .15 * l, { cssStyles: f } = t, p = a.width + 20, m = a.height + 20, h = Math.max(l, p), g = Math.max(u, m);
	s.attr("transform", `translate(${-a.width / 2}, ${-a.height / 2})`);
	let _, v = `M0 0 
    a${d},${d} 1 0,0 ${h * .25},${-1 * g * .1}
    a${d},${d} 1 0,0 ${h * .25},0
    a${d},${d} 1 0,0 ${h * .25},0
    a${d},${d} 1 0,0 ${h * .25},${g * .1}

    a${d},${d} 1 0,0 ${h * .15},${g * .33}
    a${d * .8},${d * .8} 1 0,0 0,${g * .34}
    a${d},${d} 1 0,0 ${-1 * h * .15},${g * .33}

    a${d},${d} 1 0,0 ${-1 * h * .25},${g * .15}
    a${d},${d} 1 0,0 ${-1 * h * .25},0
    a${d},${d} 1 0,0 ${-1 * h * .25},0
    a${d},${d} 1 0,0 ${-1 * h * .25},${-1 * g * .15}

    a${d},${d} 1 0,0 ${-1 * h * .1},${-1 * g * .33}
    a${d * .8},${d * .8} 1 0,0 0,${-1 * g * .34}
    a${d},${d} 1 0,0 ${h * .1},${-1 * g * .33}
  H0 V0 Z`;
	if (t.look === "handDrawn") {
		let e = q.svg(i), n = U(t, {}), r = e.path(v, n);
		_ = i.insert(() => r, ":first-child"), _.attr("class", "basic label-container").attr("style", jh(f));
	} else _ = i.insert("path", ":first-child").attr("class", "basic label-container").attr("style", r).attr("d", v);
	return _.attr("transform", `translate(${-h / 2}, ${-g / 2})`), Y(t, _), t.calcIntersect = function(e, t) {
		return Q.rect(e, t);
	}, t.intersect = function(e) {
		return c.info("Bang intersect", t, e), Q.rect(t, e);
	}, i;
}
i(kx, "bang");
async function Ax(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, halfPadding: o, label: s } = await J(e, t, X(t)), l = a.width + 2 * o, u = a.height + 2 * o, d = .15 * l, f = .25 * l, p = .35 * l, m = .2 * l, { cssStyles: h } = t, g, _ = `M0 0 
    a${d},${d} 0 0,1 ${l * .25},${-1 * l * .1}
    a${p},${p} 1 0,1 ${l * .4},${-1 * l * .1}
    a${f},${f} 1 0,1 ${l * .35},${l * .2}

    a${d},${d} 1 0,1 ${l * .15},${u * .35}
    a${m},${m} 1 0,1 ${-1 * l * .15},${u * .65}

    a${f},${d} 1 0,1 ${-1 * l * .25},${l * .15}
    a${p},${p} 1 0,1 ${-1 * l * .5},0
    a${d},${d} 1 0,1 ${-1 * l * .25},${-1 * l * .15}

    a${d},${d} 1 0,1 ${-1 * l * .1},${-1 * u * .35}
    a${m},${m} 1 0,1 ${l * .1},${-1 * u * .65}
  H0 V0 Z`;
	if (t.look === "handDrawn") {
		let e = q.svg(i), n = U(t, {}), r = e.path(_, n);
		g = i.insert(() => r, ":first-child"), g.attr("class", "basic label-container").attr("style", jh(h));
	} else g = i.insert("path", ":first-child").attr("class", "basic label-container").attr("style", r).attr("d", _);
	return s.attr("transform", `translate(${-a.width / 2}, ${-a.height / 2})`), g.attr("transform", `translate(${-l / 2}, ${-u / 2})`), Y(t, g), t.calcIntersect = function(e, t) {
		return Q.rect(e, t);
	}, t.intersect = function(e) {
		return c.info("Cloud intersect", t, e), Q.rect(t, e);
	}, i;
}
i(Ax, "cloud");
async function jx(e, t) {
	let { labelStyles: n, nodeStyles: r } = H(t);
	t.labelStyle = n;
	let { shapeSvg: i, bbox: a, halfPadding: o, label: s } = await J(e, t, X(t)), c = a.width + 8 * o, l = a.height + 2 * o, u = t.look === "neo" ? `
    M${-c / 2} ${l / 2 - 5}
    v${-l + 10}
    q0,-5 5,-5
    h${c - 10}
    q5,0 5,5
    v${l - 5}
    H${-c / 2}
    Z
  ` : `
    M${-c / 2} ${l / 2 - 5}
    v${-l + 10}
    q0,-5 5,-5
    h${c - 10}
    q5,0 5,5
    v${l - 10}
    q0,5 -5,5
    h${-(c - 10)}
    q-5,0 -5,-5
    Z
  `;
	if (!t.domId) throw Error(`defaultMindmapNode: node "${t.id}" is missing a domId \u2014 was render.ts domId prefixing skipped?`);
	let d = i.append("path").attr("id", t.domId).attr("class", "node-bkg node-" + t.type).attr("style", r).attr("d", u);
	return i.append("line").attr("class", "node-line-").attr("x1", -c / 2).attr("y1", l / 2).attr("x2", c / 2).attr("y2", l / 2), s.attr("transform", `translate(${-a.width / 2}, ${-a.height / 2})`), i.append(() => s.node()), Y(t, d), t.calcIntersect = function(e, t) {
		return Q.rect(e, t);
	}, t.intersect = function(e) {
		return Q.rect(t, e);
	}, i;
}
i(jx, "defaultMindmapNode");
async function Mx(e, t) {
	return Hy(e, t, { padding: t.padding ?? 0 });
}
i(Mx, "mindmapCircle");
var Nx = [
	{
		semanticName: "Process",
		name: "Rectangle",
		shortName: "rect",
		description: "Standard process shape",
		aliases: [
			"proc",
			"process",
			"rectangle"
		],
		internalAliases: ["squareRect"],
		handler: Gb
	},
	{
		semanticName: "Event",
		name: "Rounded Rectangle",
		shortName: "rounded",
		description: "Represents an event",
		aliases: ["event"],
		internalAliases: ["roundedRect"],
		handler: Vb
	},
	{
		semanticName: "Terminal Point",
		name: "Stadium",
		shortName: "stadium",
		description: "Terminal point",
		aliases: ["terminal", "pill"],
		handler: Kb
	},
	{
		semanticName: "Subprocess",
		name: "Framed Rectangle",
		shortName: "fr-rect",
		description: "Subprocess",
		aliases: [
			"subprocess",
			"subproc",
			"framed-rectangle",
			"subroutine"
		],
		handler: Zb
	},
	{
		semanticName: "Database",
		name: "Cylinder",
		shortName: "cyl",
		description: "Database storage",
		aliases: [
			"db",
			"database",
			"cylinder"
		],
		handler: rb
	},
	{
		semanticName: "Data Store",
		name: "Data Store",
		shortName: "datastore",
		description: "Data flow diagram data store",
		aliases: ["data-store"],
		handler: ab
	},
	{
		semanticName: "Start",
		name: "Circle",
		shortName: "circle",
		description: "Starting point",
		aliases: ["circ"],
		handler: Hy
	},
	{
		semanticName: "Bang",
		name: "Bang",
		shortName: "bang",
		description: "Bang",
		aliases: ["bang"],
		handler: kx
	},
	{
		semanticName: "Cloud",
		name: "Cloud",
		shortName: "cloud",
		description: "cloud",
		aliases: ["cloud"],
		handler: Ax
	},
	{
		semanticName: "Decision",
		name: "Diamond",
		shortName: "diam",
		description: "Decision-making step",
		aliases: [
			"decision",
			"diamond",
			"question"
		],
		handler: Rb
	},
	{
		semanticName: "Prepare Conditional",
		name: "Hexagon",
		shortName: "hex",
		description: "Preparation or condition step",
		aliases: ["hexagon", "prepare"],
		handler: hb
	},
	{
		semanticName: "Data Input/Output",
		name: "Lean Right",
		shortName: "lean-r",
		description: "Represents input or output",
		aliases: ["lean-right", "in-out"],
		internalAliases: ["lean_right"],
		handler: Tb
	},
	{
		semanticName: "Data Input/Output",
		name: "Lean Left",
		shortName: "lean-l",
		description: "Represents output or input",
		aliases: ["lean-left", "out-in"],
		internalAliases: ["lean_left"],
		handler: wb
	},
	{
		semanticName: "Priority Action",
		name: "Trapezoid Base Bottom",
		shortName: "trap-b",
		description: "Priority action",
		aliases: [
			"priority",
			"trapezoid-bottom",
			"trapezoid"
		],
		handler: cx
	},
	{
		semanticName: "Manual Operation",
		name: "Trapezoid Base Top",
		shortName: "trap-t",
		description: "Represents a manual task",
		aliases: [
			"manual",
			"trapezoid-top",
			"inv-trapezoid"
		],
		internalAliases: ["inv_trapezoid"],
		handler: Sb
	},
	{
		semanticName: "Stop",
		name: "Double Circle",
		shortName: "dbl-circ",
		description: "Represents a stop point",
		aliases: ["double-circle"],
		internalAliases: ["doublecircle"],
		handler: sb
	},
	{
		semanticName: "Text Block",
		name: "Text Block",
		shortName: "text",
		description: "Text block",
		handler: tx
	},
	{
		semanticName: "Card",
		name: "Notched Rectangle",
		shortName: "notch-rect",
		description: "Represents a card",
		aliases: ["card", "notched-rectangle"],
		handler: By
	},
	{
		semanticName: "Lined/Shaded Process",
		name: "Lined Rectangle",
		shortName: "lin-rect",
		description: "Lined process shape",
		aliases: [
			"lined-rectangle",
			"lined-process",
			"lin-proc",
			"shaded-process"
		],
		handler: Ub
	},
	{
		semanticName: "Start",
		name: "Small Circle",
		shortName: "sm-circ",
		description: "Small starting point",
		aliases: ["start", "small-circle"],
		internalAliases: ["stateStart"],
		handler: Yb
	},
	{
		semanticName: "Stop",
		name: "Framed Circle",
		shortName: "fr-circ",
		description: "Stop point",
		aliases: ["stop", "framed-circle"],
		internalAliases: ["stateEnd"],
		handler: Jb
	},
	{
		semanticName: "Fork/Join",
		name: "Filled Rectangle",
		shortName: "fork",
		description: "Fork or join in process flow",
		aliases: ["join"],
		internalAliases: ["forkJoin"],
		handler: fb
	},
	{
		semanticName: "Collate",
		name: "Hourglass",
		shortName: "hourglass",
		description: "Represents a collate operation",
		aliases: ["hourglass", "collate"],
		handler: gb
	},
	{
		semanticName: "Comment",
		name: "Curly Brace",
		shortName: "brace",
		description: "Adds a comment",
		aliases: ["comment", "brace-l"],
		handler: Ky
	},
	{
		semanticName: "Comment Right",
		name: "Curly Brace",
		shortName: "brace-r",
		description: "Adds a comment",
		handler: Jy
	},
	{
		semanticName: "Comment with braces on both sides",
		name: "Curly Braces",
		shortName: "braces",
		description: "Adds a comment",
		handler: Xy
	},
	{
		semanticName: "Com Link",
		name: "Lightning Bolt",
		shortName: "bolt",
		description: "Communication link",
		aliases: ["com-link", "lightning-bolt"],
		handler: Eb
	},
	{
		semanticName: "Document",
		name: "Document",
		shortName: "doc",
		description: "Represents a document",
		aliases: ["doc", "document"],
		handler: px
	},
	{
		semanticName: "Delay",
		name: "Half-Rounded Rectangle",
		shortName: "delay",
		description: "Represents a delay",
		aliases: ["half-rounded-rectangle"],
		handler: pb
	},
	{
		semanticName: "Direct Access Storage",
		name: "Horizontal Cylinder",
		shortName: "h-cyl",
		description: "Direct access storage",
		aliases: ["das", "horizontal-cylinder"],
		handler: sx
	},
	{
		semanticName: "Disk Storage",
		name: "Lined Cylinder",
		shortName: "lin-cyl",
		description: "Disk storage",
		aliases: ["disk", "lined-cylinder"],
		handler: Mb
	},
	{
		semanticName: "Display",
		name: "Curved Trapezoid",
		shortName: "curv-trap",
		description: "Represents a display",
		aliases: ["curved-trapezoid", "display"],
		handler: Zy
	},
	{
		semanticName: "Divided Process",
		name: "Divided Rectangle",
		shortName: "div-rect",
		description: "Divided process shape",
		aliases: [
			"div-proc",
			"divided-rectangle",
			"divided-process"
		],
		handler: ob
	},
	{
		semanticName: "Extract",
		name: "Triangle",
		shortName: "tri",
		description: "Extraction process",
		aliases: ["extract", "triangle"],
		handler: fx
	},
	{
		semanticName: "Internal Storage",
		name: "Window Pane",
		shortName: "win-pane",
		description: "Internal storage",
		aliases: ["internal-storage", "window-pane"],
		handler: gx
	},
	{
		semanticName: "Junction",
		name: "Filled Circle",
		shortName: "f-circ",
		description: "Junction point",
		aliases: ["junction", "filled-circle"],
		handler: cb
	},
	{
		semanticName: "Loop Limit",
		name: "Trapezoidal Pentagon",
		shortName: "notch-pent",
		description: "Loop limit step",
		aliases: ["loop-limit", "notched-pentagon"],
		handler: lx
	},
	{
		semanticName: "Manual File",
		name: "Flipped Triangle",
		shortName: "flip-tri",
		description: "Manual file operation",
		aliases: ["manual-file", "flipped-triangle"],
		handler: db
	},
	{
		semanticName: "Manual Input",
		name: "Sloped Rectangle",
		shortName: "sl-rect",
		description: "Manual input step",
		aliases: ["manual-input", "sloped-rectangle"],
		handler: Wb
	},
	{
		semanticName: "Multi-Document",
		name: "Stacked Document",
		shortName: "docs",
		description: "Multiple documents",
		aliases: [
			"documents",
			"st-doc",
			"stacked-document"
		],
		handler: Fb
	},
	{
		semanticName: "Multi-Process",
		name: "Stacked Rectangle",
		shortName: "st-rect",
		description: "Multiple processes",
		aliases: [
			"procs",
			"processes",
			"stacked-rectangle"
		],
		handler: Pb
	},
	{
		semanticName: "Stored Data",
		name: "Bow Tie Rectangle",
		shortName: "bow-rect",
		description: "Stored data",
		aliases: ["stored-data", "bow-tie-rectangle"],
		handler: Ly
	},
	{
		semanticName: "Summary",
		name: "Crossed Circle",
		shortName: "cross-circ",
		description: "Summary",
		aliases: ["summary", "crossed-circle"],
		handler: Wy
	},
	{
		semanticName: "Tagged Document",
		name: "Tagged Document",
		shortName: "tag-doc",
		description: "Tagged document",
		aliases: ["tag-doc", "tagged-document"],
		handler: ex
	},
	{
		semanticName: "Tagged Process",
		name: "Tagged Rectangle",
		shortName: "tag-rect",
		description: "Tagged process",
		aliases: [
			"tagged-rectangle",
			"tag-proc",
			"tagged-process"
		],
		handler: $b
	},
	{
		semanticName: "Paper Tape",
		name: "Flag",
		shortName: "flag",
		description: "Paper tape",
		aliases: ["paper-tape"],
		handler: mx
	},
	{
		semanticName: "Odd",
		name: "Odd",
		shortName: "odd",
		description: "Odd shape",
		internalAliases: ["rect_left_inv_arrow"],
		handler: zb
	},
	{
		semanticName: "Lined Document",
		name: "Lined Document",
		shortName: "lin-doc",
		description: "Lined document",
		aliases: ["lined-document"],
		handler: Nb
	}
], Px = (/* @__PURE__ */ i(() => {
	let e = [...Object.entries({
		state: qb,
		choice: Vy,
		note: Ib,
		rectWithTitle: Bb,
		labelRect: Cb,
		iconSquare: bb,
		iconCircle: vb,
		icon: _b,
		iconRounded: yb,
		imageSquare: xb,
		anchor: Py,
		kanbanItem: Ox,
		mindmapCircle: Mx,
		defaultMindmapNode: jx,
		classBox: wx,
		erBox: yx,
		requirementBox: Tx
	}), ...Nx.flatMap((e) => [
		e.shortName,
		..."aliases" in e ? e.aliases : [],
		..."internalAliases" in e ? e.internalAliases : []
	].map((t) => [t, e.handler]))];
	return Object.fromEntries(e);
}, "generateShapeMap"))();
function Fx(e) {
	return e in Px;
}
i(Fx, "isValidShape");
var Ix = /* @__PURE__ */ new Map();
async function Lx(e, t, n) {
	let r, i;
	t.shape === "rect" && (t.rx && t.ry ? t.shape = "roundedRect" : t.shape = "squareRect");
	let a = t.shape ? Px[t.shape] : void 0;
	if (!a) throw Error(`No such shape: ${t.shape}. Please check your syntax.`);
	if (t.link) {
		let o;
		n.config.securityLevel === "sandbox" ? o = "_top" : t.linkTarget && (o = t.linkTarget || "_blank"), r = e.insert("svg:a").attr("xlink:href", t.link).attr("target", o ?? null), i = await a(r, t, n);
	} else i = await a(e, t, n), r = i;
	return r.attr("data-look", jh(t.look)), t.tooltip && i.attr("title", t.tooltip), Ix.set(t.id, r), t.haveCallback && r.attr("class", r.attr("class") + " clickable"), r;
}
i(Lx, "insertNode");
var Rx = /* @__PURE__ */ i((e, t) => {
	Ix.set(t.id, e);
}, "setNodeElem"), zx = /* @__PURE__ */ i(() => {
	Ix.clear();
}, "clear"), Bx = /* @__PURE__ */ i((e) => {
	let t = Ix.get(e.id);
	c.trace("Transforming node", e.diff, e, "translate(" + (e.x - e.width / 2 - 5) + ", " + e.width / 2 + ")");
	let n = e.diff || 0;
	return e.clusterNode ? t.attr("transform", "translate(" + (e.x + n - e.width / 2) + ", " + (e.y - e.height / 2 - 8) + ")") : t.attr("transform", "translate(" + e.x + ", " + e.y + ")"), n;
}, "positionNode"), Vx = /* @__PURE__ */ i((e, t) => {
	if (t) return "translate(" + -e.width / 2 + ", " + -e.height / 2 + ")";
	let n = e.x ?? 0, r = e.y ?? 0;
	return "translate(" + -(n + e.width / 2) + ", " + -(r + e.height / 2) + ")";
}, "computeLabelTransform"), Hx = {
	aggregation: 17.25,
	extension: 17.25,
	composition: 17.25,
	dependency: 6,
	lollipop: 13.5,
	arrow_point: 4,
	arrow_barb: 0,
	arrow_barb_neo: 5.5
}, Ux = {
	arrow_point: 4,
	arrow_cross: 12.5,
	arrow_circle: 12.5
};
function Wx(e, t) {
	if (e === void 0 || t === void 0) return {
		angle: 0,
		deltaX: 0,
		deltaY: 0
	};
	e = $(e), t = $(t);
	let [n, r] = [e.x, e.y], [i, a] = [t.x, t.y], o = i - n, s = a - r;
	return {
		angle: Math.atan(s / o),
		deltaX: o,
		deltaY: s
	};
}
i(Wx, "calculateDeltaAndAngle");
var $ = /* @__PURE__ */ i((e) => Array.isArray(e) ? {
	x: e[0],
	y: e[1]
} : e, "pointTransformer"), Gx = /* @__PURE__ */ i((e) => ({
	x: /* @__PURE__ */ i(function(t, n, r) {
		let i = 0, a = $(r[0]).x < $(r[r.length - 1]).x ? "left" : "right";
		if (n === 0 && Object.hasOwn(Hx, e.arrowTypeStart)) {
			let { angle: t, deltaX: n } = Wx(r[0], r[1]);
			i = Hx[e.arrowTypeStart] * Math.cos(t) * (n >= 0 ? 1 : -1);
		} else if (n === r.length - 1 && Object.hasOwn(Hx, e.arrowTypeEnd)) {
			let { angle: t, deltaX: n } = Wx(r[r.length - 1], r[r.length - 2]);
			i = Hx[e.arrowTypeEnd] * Math.cos(t) * (n >= 0 ? 1 : -1);
		}
		let o = Math.abs($(t).x - $(r[r.length - 1]).x), s = Math.abs($(t).y - $(r[r.length - 1]).y), c = Math.abs($(t).x - $(r[0]).x), l = Math.abs($(t).y - $(r[0]).y), u = Hx[e.arrowTypeStart], d = Hx[e.arrowTypeEnd];
		if (o < d && o > 0 && s < d) {
			let e = d + 1 - o;
			e *= a === "right" ? -1 : 1, i -= e;
		}
		if (c < u && c > 0 && l < u) {
			let e = u + 1 - c;
			e *= a === "right" ? -1 : 1, i += e;
		}
		return $(t).x + i;
	}, "x"),
	y: /* @__PURE__ */ i(function(t, n, r) {
		let i = 0, a = $(r[0]).y < $(r[r.length - 1]).y ? "down" : "up";
		if (n === 0 && Object.hasOwn(Hx, e.arrowTypeStart)) {
			let { angle: t, deltaY: n } = Wx(r[0], r[1]);
			i = Hx[e.arrowTypeStart] * Math.abs(Math.sin(t)) * (n >= 0 ? 1 : -1);
		} else if (n === r.length - 1 && Object.hasOwn(Hx, e.arrowTypeEnd)) {
			let { angle: t, deltaY: n } = Wx(r[r.length - 1], r[r.length - 2]);
			i = Hx[e.arrowTypeEnd] * Math.abs(Math.sin(t)) * (n >= 0 ? 1 : -1);
		}
		let o = Math.abs($(t).y - $(r[r.length - 1]).y), s = Math.abs($(t).x - $(r[r.length - 1]).x), c = Math.abs($(t).y - $(r[0]).y), l = Math.abs($(t).x - $(r[0]).x), u = Hx[e.arrowTypeStart], d = Hx[e.arrowTypeEnd];
		if (o < d && o > 0 && s < d) {
			let e = d + 1 - o;
			e *= a === "up" ? -1 : 1, i -= e;
		}
		if (c < u && c > 0 && l < u) {
			let e = u + 1 - c;
			e *= a === "up" ? -1 : 1, i += e;
		}
		return $(t).y + i;
	}, "y")
}), "getLineFunctionsWithOffset"), Kx = /* @__PURE__ */ i((e, t, n, r, i, a = !1, o) => {
	t.arrowTypeStart && Yx(e, "start", t.arrowTypeStart, n, r, i, a, o), t.arrowTypeEnd && Yx(e, "end", t.arrowTypeEnd, n, r, i, a, o);
}, "addEdgeMarkers"), qx = {
	arrow_cross: {
		type: "cross",
		fill: !1
	},
	arrow_point: {
		type: "point",
		fill: !0
	},
	arrow_barb: {
		type: "barb",
		fill: !0
	},
	arrow_barb_neo: {
		type: "barb",
		fill: !0
	},
	arrow_circle: {
		type: "circle",
		fill: !1
	},
	aggregation: {
		type: "aggregation",
		fill: !1
	},
	extension: {
		type: "extension",
		fill: !1
	},
	composition: {
		type: "composition",
		fill: !0
	},
	dependency: {
		type: "dependency",
		fill: !0
	},
	lollipop: {
		type: "lollipop",
		fill: !1
	},
	only_one: {
		type: "onlyOne",
		fill: !1
	},
	zero_or_one: {
		type: "zeroOrOne",
		fill: !1
	},
	one_or_more: {
		type: "oneOrMore",
		fill: !1
	},
	zero_or_more: {
		type: "zeroOrMore",
		fill: !1
	},
	requirement_arrow: {
		type: "requirement_arrow",
		fill: !1
	},
	requirement_contains: {
		type: "requirement_contains",
		fill: !1
	}
}, Jx = [
	"cross",
	"point",
	"circle",
	"lollipop",
	"aggregation",
	"extension",
	"composition",
	"dependency",
	"barb"
], Yx = /* @__PURE__ */ i((e, t, n, r, i, a, o = !1, s) => {
	let l = qx[n], u = l && Jx.includes(l.type);
	if (!l) {
		c.warn(`Unknown arrow type: ${n}`);
		return;
	}
	let d = `${i}_${a}-${l.type}${t === "start" ? "Start" : "End"}${o && u ? "-margin" : ""}`;
	if (s && s.trim() !== "") {
		let n = `${d}_${s.replace(/[^\dA-Za-z]/g, "_")}`;
		if (!document.getElementById(n)) {
			let e = document.getElementById(d);
			if (e) {
				let t = e.cloneNode(!0);
				t.id = n, t.querySelectorAll("path, circle, line").forEach((e) => {
					e.setAttribute("stroke", s), l.fill && e.setAttribute("fill", s);
				}), e.parentNode?.appendChild(t);
			}
		}
		e.attr(`marker-${t}`, `url(${r}#${n})`);
	} else e.attr(`marker-${t}`, `url(${r}#${d})`);
}, "addEdgeMarker"), Xx = /* @__PURE__ */ i((e) => typeof e == "string" ? e : z()?.flowchart?.curve, "resolveEdgeCurveType"), Zx = /* @__PURE__ */ new Map(), Qx = /* @__PURE__ */ new Map(), $x = /* @__PURE__ */ i(() => {
	Zx.clear(), Qx.clear();
}, "clear"), eS = /* @__PURE__ */ i((e) => e ? typeof e == "string" ? e : e.reduce((e, t) => e + ";" + t, "") : "", "getLabelStyles"), tS = /* @__PURE__ */ i(async (e, t) => {
	let n = z(), r = xn(n), { labelStyles: i } = H(t);
	t.labelStyle = i;
	let a = e.insert("g").attr("class", "edgeLabel"), o = a.insert("g").attr("class", "label").attr("data-id", t.id), s = t.labelType === "markdown", l = await ov(e, t.label, {
		style: eS(t.labelStyle),
		useHtmlLabels: r,
		addSvgBackground: !0,
		isNode: !1,
		markdown: s,
		width: void 0
	}, n);
	o.node().appendChild(l), c.info("abc82", t, t.labelType);
	let u = l.getBBox(), d = u;
	if (r) {
		let e = l.children[0], t = B(l);
		u = e.getBoundingClientRect(), d = u, t.attr("width", u.width), t.attr("height", u.height);
	} else {
		let e = B(l).select("text").node();
		e && typeof e.getBBox == "function" && (d = e.getBBox());
	}
	o.attr("transform", Vx(d, r)), Zx.set(t.id, a), t.width = u.width, t.height = u.height;
	let f;
	if (t.startLabelLeft) {
		let n = e.insert("g").attr("class", "edgeTerminals"), i = n.insert("g").attr("class", "inner"), a = await gy(i, t.startLabelLeft, eS(t.labelStyle) || "", !1, !1);
		f = a;
		let o = a.getBBox();
		if (r) {
			let e = a.children[0], t = B(a);
			o = e.getBoundingClientRect(), t.attr("width", o.width), t.attr("height", o.height);
		}
		i.attr("transform", Vx(o, r)), Qx.get(t.id) || Qx.set(t.id, {}), Qx.get(t.id).startLeft = n, nS(f, t.startLabelLeft);
	}
	if (t.startLabelRight) {
		let n = e.insert("g").attr("class", "edgeTerminals"), i = n.insert("g").attr("class", "inner"), a = await gy(i, t.startLabelRight, eS(t.labelStyle) || "", !1, !1);
		f = a;
		let o = a.getBBox();
		if (r) {
			let e = a.children[0], t = B(a);
			o = e.getBoundingClientRect(), t.attr("width", o.width), t.attr("height", o.height);
		}
		i.attr("transform", Vx(o, r)), Qx.get(t.id) || Qx.set(t.id, {}), Qx.get(t.id).startRight = n, nS(f, t.startLabelRight);
	}
	if (t.endLabelLeft) {
		let n = e.insert("g").attr("class", "edgeTerminals"), i = n.insert("g").attr("class", "inner"), a = await gy(n, t.endLabelLeft, eS(t.labelStyle) || "", !1, !1);
		f = a;
		let o = a.getBBox();
		if (r) {
			let e = a.children[0], t = B(a);
			o = e.getBoundingClientRect(), t.attr("width", o.width), t.attr("height", o.height);
		}
		i.attr("transform", Vx(o, r)), Qx.get(t.id) || Qx.set(t.id, {}), Qx.get(t.id).endLeft = n, nS(f, t.endLabelLeft);
	}
	if (t.endLabelRight) {
		let n = e.insert("g").attr("class", "edgeTerminals"), i = n.insert("g").attr("class", "inner"), a = await gy(n, t.endLabelRight, eS(t.labelStyle) || "", !1, !1);
		f = a;
		let o = a.getBBox();
		if (r) {
			let e = a.children[0], t = B(a);
			o = e.getBoundingClientRect(), t.attr("width", o.width), t.attr("height", o.height);
		}
		i.attr("transform", Vx(o, r)), Qx.get(t.id) || Qx.set(t.id, {}), Qx.get(t.id).endRight = n, nS(f, t.endLabelRight);
	}
	return l;
}, "insertEdgeLabel");
function nS(e, t) {
	xn(z()) && e && (e.style.width = t.length * 9 + "px", e.style.height = "12px");
}
i(nS, "setTerminalWidth");
var rS = /* @__PURE__ */ i((e, t) => {
	c.debug("Moving label abc88 ", e.id, e.label, Zx.get(e.id), t);
	let n = t.updatedPath ? t.updatedPath : t.originalPath, { subGraphTitleTotalMargin: r } = Nh(z());
	if (e.label) {
		let i = Zx.get(e.id), a = e.x, o = e.y;
		if (n) {
			let r = Dh.calcLabelPosition(n);
			c.debug("Moving label " + e.label + " from (", a, ",", o, ") to (", r.x, ",", r.y, ") abc88"), t.updatedPath && (a = r.x, o = r.y);
		}
		i.attr("transform", `translate(${a}, ${o + r / 2})`);
	}
	if (e.startLabelLeft) {
		let t = Qx.get(e.id).startLeft, r = e.x, i = e.y;
		if (n) {
			let t = Dh.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
	if (e.startLabelRight) {
		let t = Qx.get(e.id).startRight, r = e.x, i = e.y;
		if (n) {
			let t = Dh.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_right", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
	if (e.endLabelLeft) {
		let t = Qx.get(e.id).endLeft, r = e.x, i = e.y;
		if (n) {
			let t = Dh.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
	if (e.endLabelRight) {
		let t = Qx.get(e.id).endRight, r = e.x, i = e.y;
		if (n) {
			let t = Dh.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", n);
			r = t.x, i = t.y;
		}
		t.attr("transform", `translate(${r}, ${i})`);
	}
}, "positionEdgeLabel"), iS = /* @__PURE__ */ i((e, t) => {
	if (!e?.isLabelEdge || !e?.id?.endsWith("-to-label") || !Array.isArray(t) || t.length !== 2) return t;
	let [n, r] = t, i = Math.abs(r.x - n.x), a = Math.abs(r.y - n.y);
	return i < .001 || a < .001 ? t : a >= i ? [
		n,
		{
			x: n.x,
			y: r.y
		},
		r
	] : [
		n,
		{
			x: r.x,
			y: n.y
		},
		r
	];
}, "orthogonalizeToLabelClippedPoints"), aS = /* @__PURE__ */ i((e, t) => {
	let n = e.x, r = e.y, i = Math.abs(t.x - n), a = Math.abs(t.y - r), o = e.width / 2, s = e.height / 2;
	return i >= o || a >= s;
}, "outsideNode"), oS = /* @__PURE__ */ i((e, t, n) => {
	c.debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(t)}
  insidePoint : ${JSON.stringify(n)}
  node        : x:${e.x} y:${e.y} w:${e.width} h:${e.height}`);
	let r = e.x, i = e.y, a = Math.abs(r - n.x), o = e.width / 2, s = n.x < t.x ? o - a : o + a, l = e.height / 2, u = Math.abs(t.y - n.y), d = Math.abs(t.x - n.x);
	if (Math.abs(i - t.y) * o > Math.abs(r - t.x) * l) {
		let e = n.y < t.y ? t.y - l - i : i - l - t.y;
		s = d * e / u;
		let r = {
			x: n.x < t.x ? n.x + s : n.x - d + s,
			y: n.y < t.y ? n.y + u - e : n.y - u + e
		};
		return s === 0 && (r.x = t.x, r.y = t.y), d === 0 && (r.x = t.x), u === 0 && (r.y = t.y), c.debug(`abc89 top/bottom calc, Q ${u}, q ${e}, R ${d}, r ${s}`, r), r;
	} else {
		s = n.x < t.x ? t.x - o - r : r - o - t.x;
		let e = u * s / d, i = n.x < t.x ? n.x + d - s : n.x - d + s, a = n.y < t.y ? n.y + e : n.y - e;
		return c.debug(`sides calc abc89, Q ${u}, q ${e}, R ${d}, r ${s}`, {
			_x: i,
			_y: a
		}), s === 0 && (i = t.x, a = t.y), d === 0 && (i = t.x), u === 0 && (a = t.y), {
			x: i,
			y: a
		};
	}
}, "intersection"), sS = /* @__PURE__ */ i((e, t) => {
	c.warn("abc88 cutPathAtIntersect", e, t);
	let n = [], r = e[0], i = !1;
	return e.forEach((e) => {
		if (c.info("abc88 checking point", e, t), !aS(t, e) && !i) {
			let a = oS(t, r, e);
			c.debug("abc88 inside", e, r, a), c.debug("abc88 intersection", a, t);
			let o = !1;
			n.forEach((e) => {
				o ||= e.x === a.x && e.y === a.y;
			}), n.some((e) => e.x === a.x && e.y === a.y) ? c.warn("abc88 no intersect", a, n) : n.push(a), i = !0;
		} else c.warn("abc88 outside", e, r), r = e, i || n.push(e);
	}), c.debug("returning points", n), n;
}, "cutPathAtIntersect");
function cS(e) {
	let t = [], n = [];
	for (let r = 1; r < e.length - 1; r++) {
		let i = e[r - 1], a = e[r], o = e[r + 1];
		(i.x === a.x && a.y === o.y && Math.abs(a.x - o.x) > 5 && Math.abs(a.y - i.y) > 5 || i.y === a.y && a.x === o.x && Math.abs(a.x - i.x) > 5 && Math.abs(a.y - o.y) > 5) && (t.push(a), n.push(r));
	}
	return {
		cornerPoints: t,
		cornerPointPositions: n
	};
}
i(cS, "extractCornerPoints");
var lS = /* @__PURE__ */ i(function(e, t, n) {
	let r = t.x - e.x, i = t.y - e.y, a = n / Math.sqrt(r * r + i * i);
	return {
		x: t.x - a * r,
		y: t.y - a * i
	};
}, "findAdjacentPoint"), uS = /* @__PURE__ */ i(function(e) {
	let { cornerPointPositions: t } = cS(e), n = [];
	for (let r = 0; r < e.length; r++) if (t.includes(r)) {
		let t = e[r - 1], i = e[r + 1], a = e[r], o = lS(t, a, 5), s = lS(i, a, 5), l = s.x - o.x, u = s.y - o.y;
		n.push(o);
		let d = Math.sqrt(2) * 2, f = {
			x: a.x,
			y: a.y
		};
		Math.abs(i.x - t.x) > 10 && Math.abs(i.y - t.y) >= 10 ? (c.debug("Corner point fixing", Math.abs(i.x - t.x), Math.abs(i.y - t.y)), f = a.x === o.x ? {
			x: l < 0 ? o.x - 5 + d : o.x + 5 - d,
			y: u < 0 ? o.y - d : o.y + d
		} : {
			x: l < 0 ? o.x - d : o.x + d,
			y: u < 0 ? o.y - 5 + d : o.y + 5 - d
		}) : c.debug("Corner point skipping fixing", Math.abs(i.x - t.x), Math.abs(i.y - t.y)), n.push(f, s);
	} else n.push(e[r]);
	return n;
}, "fixCorners"), dS = /* @__PURE__ */ i((e, t, n) => {
	let r = e - t - n, i = Math.floor(r / 4);
	return `0 ${t} ${Array(i).fill("2 2").join(" ")} ${n}`;
}, "generateDashArray"), fS = /* @__PURE__ */ i(function(e, t, n, r, i, a, o, s = !1) {
	if (!o) throw Error(`insertEdge: missing diagramId for edge "${t.id}" \u2014 edge IDs require a diagram prefix for uniqueness`);
	let { handDrawnSeed: l, layout: u } = z(), d = t.points, f = !1, p = i;
	var m = a;
	let h = [];
	for (let e in t.cssCompiledStyles) Yp(e) || h.push(t.cssCompiledStyles[e]);
	if (u === "swimlane") {
		if (m.intersect && p.intersect && Array.isArray(d) && d.length >= 2) if (d.length === 2) d = [p.intersect(d[0]), m.intersect(d[1])];
		else {
			let e = d.slice(1, -1), t = e[0], n = e[e.length - 1], r = .5, i = Math.abs(d[d.length - 1].x - n.x) < r && Math.abs(d[d.length - 1].y - n.y) < r, a = p.intersect(t), o = i ? n : m.intersect(n), s = Math.abs(o.x - n.x) < r && Math.abs(o.y - n.y) < r, c = Math.abs(a.x - t.x) < r && Math.abs(a.y - t.y) < r ? [] : [a], l = s ? [] : [o];
			d = [
				...c,
				...e,
				...l
			];
		}
		d = iS(t, d);
	} else m.intersect && p.intersect && !s && (d = d.slice(1, t.points.length - 1), d.unshift(p.intersect(d[0])), d.push(m.intersect(d[d.length - 1])));
	let g = btoa(JSON.stringify(d));
	t.toCluster && (c.info("to cluster abc88", n.get(t.toCluster)), d = sS(t.points, n.get(t.toCluster).node), f = !0), t.fromCluster && (c.debug("from cluster abc88", n.get(t.fromCluster), JSON.stringify(d, null, 2)), d = sS(d.reverse(), n.get(t.fromCluster).node).reverse(), f = !0);
	let _ = d.filter((e) => !Number.isNaN(e.y)), v = Xx(t.curve);
	v !== "rounded" && (_ = uS(_));
	let y = cl;
	switch (v) {
		case "linear":
			y = cl;
			break;
		case "basis":
			y = vl;
			break;
		case "cardinal":
			y = Dl;
			break;
		case "bumpX":
			y = pl;
			break;
		case "bumpY":
			y = ml;
			break;
		case "catmullRom":
			y = Pl;
			break;
		case "monotoneX":
			y = Jl;
			break;
		case "monotoneY":
			y = Yl;
			break;
		case "natural":
			y = Ql;
			break;
		case "step":
			y = eu;
			break;
		case "stepAfter":
			y = nu;
			break;
		case "stepBefore":
			y = tu;
			break;
		case "rounded":
			y = cl;
			break;
		default: y = vl;
	}
	let { x: b, y: x } = Gx(t), S = dl().x(b).y(x).curve(y), C;
	switch (t.thickness) {
		case "normal":
			C = "edge-thickness-normal";
			break;
		case "thick":
			C = "edge-thickness-thick";
			break;
		case "invisible":
			C = "edge-thickness-invisible";
			break;
		default: C = "edge-thickness-normal";
	}
	switch (t.pattern) {
		case "solid":
			C += " edge-pattern-solid";
			break;
		case "dotted":
			C += " edge-pattern-dotted";
			break;
		case "dashed":
			C += " edge-pattern-dashed";
			break;
		default: C += " edge-pattern-solid";
	}
	let w, T = v === "rounded" ? pS(hS(_, t), 5) : S(_), E = Array.isArray(t.style) ? t.style : [t.style], D = E.find((e) => e?.startsWith("stroke:")), O = "";
	t.animate && (O = "edge-animation-fast"), t.animation && (O = "edge-animation-" + t.animation);
	let k = !1;
	if (t.look === "handDrawn") {
		let n = q.svg(e);
		Object.assign([], _);
		let r = n.path(T, {
			roughness: .3,
			seed: l
		});
		C += " transition", w = B(r).select("path").attr("id", `${o}-${t.id}`).attr("class", " " + C + (t.classes ? " " + t.classes : "") + (O ? " " + O : "")).attr("style", E ? E.reduce((e, t) => e + ";" + t, "") : "");
		let i = w.attr("d");
		w.attr("d", i), e.node().appendChild(w.node());
	} else {
		let n = h.join(";"), r = E ? E.reduce((e, t) => e + t + ";", "") : "", i = (n ? n + ";" + r + ";" : r) + ";" + (E ? E.reduce((e, t) => e + ";" + t, "") : "");
		w = e.append("path").attr("d", T).attr("id", `${o}-${t.id}`).attr("class", " " + C + (t.classes ? " " + t.classes : "") + (O ? " " + O : "")).attr("style", i), D = i.match(/stroke:([^;]+)/)?.[1], k = t.animate === !0 || !!t.animation || n.includes("animation");
		let a = w.node(), s = typeof a.getTotalLength == "function" ? a.getTotalLength() : 0, c = Ux[t.arrowTypeStart] || 0, l = Ux[t.arrowTypeEnd] || 0;
		if (t.look === "neo" && !k) {
			let e = `stroke-dasharray: ${t.pattern === "dotted" || t.pattern === "dashed" ? dS(s, c, l) : `0 ${c} ${s - c - l} ${l}`}; stroke-dashoffset: 0;`;
			w.attr("style", e + w.attr("style"));
		}
	}
	w.attr("data-edge", !0), w.attr("data-et", "edge"), w.attr("data-id", t.id), w.attr("data-points", g), w.attr("data-look", jh(t.look)), t.showPoints && _.forEach((t) => {
		e.append("circle").style("stroke", "red").style("fill", "red").attr("r", 1).attr("cx", t.x).attr("cy", t.y);
	});
	let A = "";
	(z().flowchart.arrowMarkerAbsolute || z().state.arrowMarkerAbsolute) && (A = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, A = A.replace(/\(/g, "\\(").replace(/\)/g, "\\)")), c.info("arrowTypeStart", t.arrowTypeStart), c.info("arrowTypeEnd", t.arrowTypeEnd);
	let ee = !k && t?.look === "neo";
	Kx(w, t, A, o, r, ee, D);
	let j = Math.floor(d.length / 2), te = d[j];
	Dh.isLabelCoordinateInPath(te, w.attr("d")) || (f = !0);
	let ne = {};
	return f && (ne.updatedPath = d), ne.originalPath = t.points, ne;
}, "insertEdge");
function pS(e, t) {
	if (e.length < 2) return "";
	let n = "", r = e.length, i = 1e-5;
	for (let a = 0; a < r; a++) {
		let o = e[a], s = e[a - 1], c = e[a + 1];
		if (a === 0) n += `M${o.x},${o.y}`;
		else if (a === r - 1) n += `L${o.x},${o.y}`;
		else {
			let e = o.x - s.x, r = o.y - s.y, a = c.x - o.x, l = c.y - o.y, u = Math.hypot(e, r), d = Math.hypot(a, l);
			if (u < i || d < i) {
				n += `L${o.x},${o.y}`;
				continue;
			}
			let f = e / u, p = r / u, m = a / d, h = l / d, g = f * m + p * h, _ = Math.acos(Math.max(-1, Math.min(1, g)));
			if (_ < i || Math.abs(Math.PI - _) < i) {
				n += `L${o.x},${o.y}`;
				continue;
			}
			let v = Math.min(t / Math.sin(_ / 2), u / 2, d / 2), y = o.x - f * v, b = o.y - p * v, x = o.x + m * v, S = o.y + h * v;
			n += `L${y},${b}`, n += `Q${o.x},${o.y} ${x},${S}`;
		}
	}
	return n;
}
i(pS, "generateRoundedPath");
function mS(e, t) {
	if (!e || !t) return {
		angle: 0,
		deltaX: 0,
		deltaY: 0
	};
	let n = t.x - e.x, r = t.y - e.y;
	return {
		angle: Math.atan2(r, n),
		deltaX: n,
		deltaY: r
	};
}
i(mS, "calculateDeltaAndAngle");
function hS(e, t) {
	let n = e.map((e) => ({ ...e }));
	if (e.length >= 2 && Hx[t.arrowTypeStart]) {
		let r = Hx[t.arrowTypeStart], i = e[0], a = e[1], { angle: o } = mS(i, a), s = r * Math.cos(o), c = r * Math.sin(o);
		n[0].x = i.x + s, n[0].y = i.y + c;
	}
	let r = e.length;
	if (r >= 2 && Hx[t.arrowTypeEnd]) {
		let i = Hx[t.arrowTypeEnd], a = e[r - 1], o = e[r - 2], { angle: s } = mS(o, a), c = i * Math.cos(s), l = i * Math.sin(s);
		n[r - 1].x = a.x - c, n[r - 1].y = a.y - l;
	}
	return n;
}
i(hS, "applyMarkerOffsetsToPoints");
var gS = /* @__PURE__ */ i((e, t, n, r) => {
	t.forEach((t) => {
		_S[t](e, n, r);
	});
}, "insertMarkers"), _S = {
	extension: /* @__PURE__ */ i((e, t, n) => {
		c.trace("Making markers for ", n), e.append("defs").append("marker").attr("id", n + "_" + t + "-extensionStart").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,7 L18,13 V 1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-extensionEnd").attr("class", "marker extension " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 1,1 V 13 L18,7 Z"), e.append("marker").attr("id", n + "_" + t + "-extensionStart-margin").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,7 18,13 18,1").style("stroke-width", 2).style("stroke-dasharray", "0"), e.append("defs").append("marker").attr("id", n + "_" + t + "-extensionEnd-margin").attr("class", "marker extension " + t).attr("refX", 9).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,1 10,13 18,7").style("stroke-width", 2).style("stroke-dasharray", "0");
	}, "extension"),
	composition: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-compositionStart").attr("class", "marker composition " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-compositionEnd").attr("class", "marker composition " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-compositionStart-margin").attr("class", "marker composition " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("viewBox", "0 0 15 15").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-compositionEnd-margin").attr("class", "marker composition " + t).attr("refX", 3.5).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
	}, "composition"),
	aggregation: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-aggregationStart").attr("class", "marker aggregation " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-aggregationEnd").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-aggregationStart-margin").attr("class", "marker aggregation " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-aggregationEnd-margin").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
	}, "aggregation"),
	dependency: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-dependencyStart").attr("class", "marker dependency " + t).attr("refX", 6).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-dependencyEnd").attr("class", "marker dependency " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-dependencyStart-margin").attr("class", "marker dependency " + t).attr("refX", 4).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-dependencyEnd-margin").attr("class", "marker dependency " + t).attr("refX", 16).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
	}, "dependency"),
	lollipop: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-lollipopStart").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", n + "_" + t + "-lollipopEnd").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", n + "_" + t + "-lollipopStart-margin").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2), e.append("defs").append("marker").attr("id", n + "_" + t + "-lollipopEnd-margin").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2);
	}, "lollipop"),
	point: /* @__PURE__ */ i((e, t, n) => {
		e.append("marker").attr("id", n + "_" + t + "-pointEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-pointStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 4.5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 5 L 10 10 L 10 0 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-pointEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 11.5).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 10.5).attr("markerHeight", 14).attr("orient", "auto").append("path").attr("d", "M 0 0 L 11.5 7 L 0 14 z").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-pointStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 1).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11.5).attr("markerHeight", 14).attr("orient", "auto").append("polygon").attr("points", "0,7 11.5,14 11.5,0").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
	}, "point"),
	circle: /* @__PURE__ */ i((e, t, n) => {
		e.append("marker").attr("id", n + "_" + t + "-circleEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 11).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-circleStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-circleEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refY", 5).attr("refX", 12.25).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-circleStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -2).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
	}, "circle"),
	cross: /* @__PURE__ */ i((e, t, n) => {
		e.append("marker").attr("id", n + "_" + t + "-crossEnd").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", 12).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-crossStart").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", -1).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", n + "_" + t + "-crossEnd-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", 17.7).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5), e.append("marker").attr("id", n + "_" + t + "-crossStart-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", -3.5).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5).style("stroke-dasharray", "1,0");
	}, "cross"),
	barb: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
	}, "barb"),
	barbNeo: /* @__PURE__ */ i((e, t, n) => {
		let { themeVariables: r } = fn(), { transitionColor: i } = r;
		e.append("defs").append("marker").attr("id", n + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "strokeWidth").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z"), e.append("defs").append("marker").attr("id", n + "_" + t + "-barbEnd-margin").attr("refX", 17).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z").attr("fill", `${i}`);
	}, "barbNeo"),
	only_one: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18"), e.append("defs").append("marker").attr("id", n + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18");
	}, "only_one"),
	zero_or_one: /* @__PURE__ */ i((e, t, n) => {
		let r = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
		r.append("circle").attr("fill", "white").attr("cx", 21).attr("cy", 9).attr("r", 6), r.append("path").attr("d", "M9,0 L9,18");
		let i = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
		i.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 9).attr("r", 6), i.append("path").attr("d", "M21,0 L21,18");
	}, "zero_or_one"),
	one_or_more: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27"), e.append("defs").append("marker").attr("id", n + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18");
	}, "one_or_more"),
	zero_or_more: /* @__PURE__ */ i((e, t, n) => {
		let r = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
		r.append("circle").attr("fill", "white").attr("cx", 48).attr("cy", 18).attr("r", 6), r.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18");
		let i = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
		i.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 18).attr("r", 6), i.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18");
	}, "zero_or_more"),
	only_one_neo: /* @__PURE__ */ i((e, t, n) => {
		let { themeVariables: r } = fn(), { strokeWidth: i } = r;
		e.append("defs").append("marker").attr("id", n + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18").attr("stroke-width", `${i}`), e.append("defs").append("marker").attr("id", n + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18").attr("stroke-width", `${i}`);
	}, "only_one_neo"),
	zero_or_one_neo: /* @__PURE__ */ i((e, t, n) => {
		let { themeVariables: r } = fn(), { strokeWidth: i, mainBkg: a } = r, o = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
		o.append("circle").attr("fill", a ?? "white").attr("cx", 21).attr("cy", 9).attr("stroke-width", `${i}`).attr("r", 6), o.append("path").attr("d", "M9,0 L9,18").attr("stroke-width", `${i}`);
		let s = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
		s.append("circle").attr("fill", a ?? "white").attr("cx", 9).attr("cy", 9).attr("stroke-width", `${i}`).attr("r", 6), s.append("path").attr("d", "M21,0 L21,18").attr("stroke-width", `${i}`);
	}, "zero_or_one_neo"),
	one_or_more_neo: /* @__PURE__ */ i((e, t, n) => {
		let { themeVariables: r } = fn(), { strokeWidth: i } = r;
		e.append("defs").append("marker").attr("id", n + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27").attr("stroke-width", `${i}`), e.append("defs").append("marker").attr("id", n + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18").attr("stroke-width", `${i}`);
	}, "one_or_more_neo"),
	zero_or_more_neo: /* @__PURE__ */ i((e, t, n) => {
		let { themeVariables: r } = fn(), { strokeWidth: i, mainBkg: a } = r, o = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
		o.append("circle").attr("fill", a ?? "white").attr("cx", 45.5).attr("cy", 18).attr("r", 6).attr("stroke-width", `${i}`), o.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18").attr("stroke-width", `${i}`);
		let s = e.append("defs").append("marker").attr("id", n + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
		s.append("circle").attr("fill", a ?? "white").attr("cx", 11).attr("cy", 18).attr("r", 6).attr("stroke-width", `${i}`), s.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18").attr("stroke-width", `${i}`);
	}, "zero_or_more_neo"),
	requirement_arrow: /* @__PURE__ */ i((e, t, n) => {
		e.append("defs").append("marker").attr("id", n + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("path").attr("d", "M0,0\n      L20,10\n      M20,10\n      L0,20");
	}, "requirement_arrow"),
	requirement_contains: /* @__PURE__ */ i((e, t, n) => {
		let r = e.append("defs").append("marker").attr("id", n + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("g");
		r.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), r.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), r.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10);
	}, "requirement_contains"),
	requirement_arrow_neo: /* @__PURE__ */ i((e, t, n) => {
		let { themeVariables: r } = fn(), { strokeWidth: i } = r;
		e.append("defs").append("marker").attr("id", n + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("stroke-width", `${i}`).attr("viewBox", "0 0 25 20").append("path").attr("d", "M0,0\n      L20,10\n      M20,10\n      L0,20").attr("stroke-linejoin", "miter");
	}, "requirement_arrow_neo"),
	requirement_contains_neo: /* @__PURE__ */ i((e, t, n) => {
		let { themeVariables: r } = fn(), { strokeWidth: i } = r, a = e.append("defs").append("marker").attr("id", n + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("g");
		a.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), a.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), a.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10), a.selectAll("*").attr("stroke-width", `${i}`);
	}, "requirement_contains_neo")
}, vS = gS, yS = {
	common: nr,
	getConfig: fn,
	insertCluster: Sy,
	insertEdge: fS,
	insertEdgeLabel: tS,
	insertMarkers: vS,
	insertNode: Lx,
	interpolateToCurve: Qm,
	labelHelper: J,
	log: c,
	positionEdgeLabel: rS
}, bS = {}, xS = /* @__PURE__ */ i((e) => {
	for (let t of e) bS[t.name] = t;
}, "registerLayoutLoaders");
(/* @__PURE__ */ i(() => {
	xS([
		{
			name: "dagre",
			loader: /* @__PURE__ */ i(async () => await import("./dagre-VZM6K2ZE-BWkKWghe.mjs"), "loader")
		},
		{
			name: "swimlane",
			loader: /* @__PURE__ */ i(async () => await import("./swimlanes-SLNWSIFB-DRZJF2oV.mjs"), "loader")
		},
		{
			name: "cose-bilkent",
			loader: /* @__PURE__ */ i(async () => await import("./cose-bilkent-JH36ORCC-BS2xQ8nF.mjs"), "loader")
		}
	]);
}, "registerDefaultLayoutLoaders"))();
var SS = /* @__PURE__ */ i(async (e, t, n) => {
	if (!(e.layoutAlgorithm in bS)) throw Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
	if (e.diagramId) for (let t of e.nodes) {
		let n = t.domId || t.id;
		t.domId = `${e.diagramId}-${n}`;
	}
	let r = bS[e.layoutAlgorithm], i = await r.loader(), { theme: a, themeVariables: o } = e.config, { useGradient: s, gradientStart: c, gradientStop: l } = o, u = t.attr("id");
	if (t.append("defs").append("filter").attr("id", `${u}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${a?.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${u}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${a?.includes("dark") ? "#FFFFFF" : "#000000"}`), s) {
		let e = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
		e.append("svg:stop").attr("offset", "0%").attr("stop-color", c).attr("stop-opacity", 1), e.append("svg:stop").attr("offset", "100%").attr("stop-color", l).attr("stop-opacity", 1);
	}
	return i.render(e, t, yS, { algorithm: r.algorithm }, n);
}, "render"), CS = /* @__PURE__ */ i((e = "", { fallback: t = "dagre" } = {}) => {
	if (e in bS) return e;
	if (t in bS) return c.warn(`Layout algorithm ${e} is not registered. Using ${t} as fallback.`), t;
	throw Error(`Both layout algorithms ${e} and ${t} are not registered.`);
}, "getRegisteredLayoutAlgorithm");
//#endregion
export { hm as $, O as $n, za as $t, Nh as A, Qn as An, rl as At, Ch as B, br as Bn, Qc as Bt, tv as C, An as Cn, Gp as Ct, ug as D, Ot as Dn, ol as Dt, pg as E, un as En, dl as Et, kh as F, tr as Fn, tl as Ft, hh as G, sn as Gn, jo as Gt, fh as H, dn as Hn, Gc as Ht, Oh as I, hn as In, Yc as It, Em as J, dr as Jn, To as Jt, zm as K, or as Kn, Oo as Kt, uh as L, $t as Ln, Xc as Lt, _h as M, Kn as Mn, qc as Mt, vh as N, Mr as Nn, Jc as Nt, sg as O, Un as On, al as Ot, Eh as P, On as Pn, $c as Pt, om as Q, k as Qn, co as Qt, Ah as R, Ln as Rn, el as Rt, q as S, Nr as Sn, Wp as St, z_ as T, xn as Tn, vl as Tt, Xm as U, Er as Un, Lo as Ut, Th as V, vr as Vn, nl as Vt, Dh as W, Sr as Wn, Mo as Wt, pm as X, ln as Xn, uo as Xt, sm as Y, Wt as Yn, Va as Yt, fm as Z, vt as Zn, ao as Zt, Lx as _, Sn as _n, nm as _t, Zx as a, $n as an, c as ar, bm as at, Rx as b, fn as bn, Yp as bt, vS as c, nr as cn, i as cr, mm as ct, Vx as d, en as dn, im as dt, Ba as en, D as er, lm as et, Gx as f, Dr as fn, cm as ft, Sy as g, tn as gn, _m as gt, zx as h, En as hn, gm as ht, $x as i, bt as in, f as ir, Sm as it, yh as j, jn, il as jt, Ph as k, bn as kn, Kc as kt, rS as l, ar as ln, rm as lt, Cy as m, Dn as mn, ym as mt, xS as n, Tn as nn, C as nr, wm as nt, fS as o, _r as on, l as or, um as ot, Hx as p, Yt as pn, vm as pt, Pm as q, kr as qn, Ao as qt, SS as r, mn as rn, x as rr, xm as rt, tS as s, fr as sn, a as sr, am as st, CS as t, B as tn, E as tr, Cm as tt, Qx as u, cr as un, dm as ut, Fx as v, xr as vn, em as vt, ov as w, Cr as wn, ou as wt, Y as x, z as xn, H as xt, Bx as y, yr as yn, Qp as yt, ch as z, cn as zn, Zc as zt };
