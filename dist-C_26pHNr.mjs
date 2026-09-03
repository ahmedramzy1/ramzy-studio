import { n as e, r as t } from "./chunk-jwUa06l-.mjs";
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/max.js
var n, r = e((() => {
	n = "ffffffff-ffff-ffff-ffff-ffffffffffff";
})), i, a = e((() => {
	i = "00000000-0000-0000-0000-000000000000";
})), o, s = e((() => {
	o = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/validate.js
function c(e) {
	return typeof e == "string" && o.test(e);
}
var l = e((() => {
	s();
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/parse.js
function u(e) {
	if (!c(e)) throw TypeError("Invalid UUID");
	let t;
	return Uint8Array.of((t = parseInt(e.slice(0, 8), 16)) >>> 24, t >>> 16 & 255, t >>> 8 & 255, t & 255, (t = parseInt(e.slice(9, 13), 16)) >>> 8, t & 255, (t = parseInt(e.slice(14, 18), 16)) >>> 8, t & 255, (t = parseInt(e.slice(19, 23), 16)) >>> 8, t & 255, (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255, t / 4294967296 & 255, t >>> 24 & 255, t >>> 16 & 255, t >>> 8 & 255, t & 255);
}
var d = e((() => {
	l();
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/stringify.js
function f(e, t = 0) {
	return (m[e[t + 0]] + m[e[t + 1]] + m[e[t + 2]] + m[e[t + 3]] + "-" + m[e[t + 4]] + m[e[t + 5]] + "-" + m[e[t + 6]] + m[e[t + 7]] + "-" + m[e[t + 8]] + m[e[t + 9]] + "-" + m[e[t + 10]] + m[e[t + 11]] + m[e[t + 12]] + m[e[t + 13]] + m[e[t + 14]] + m[e[t + 15]]).toLowerCase();
}
function p(e, t = 0) {
	let n = f(e, t);
	if (!c(n)) throw TypeError("Stringified UUID is invalid");
	return n;
}
var m, h = e((() => {
	l(), m = [];
	for (let e = 0; e < 256; ++e) m.push((e + 256).toString(16).slice(1));
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/rng.js
function g() {
	return crypto.getRandomValues(_);
}
var _, v = e((() => {
	_ = new Uint8Array(16);
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v1.js
function y(e, t, n) {
	let r, i = e?._v6 ?? !1;
	if (e) {
		let t = Object.keys(e);
		t.length === 1 && t[0] === "_v6" && (e = void 0);
	}
	if (e) r = b(e.random ?? e.rng?.() ?? g(), e.msecs, e.nsecs, e.clockseq, e.node, t, n);
	else {
		let e = Date.now(), a = g();
		ee(x, e, a), r = b(a, x.msecs, x.nsecs, i ? void 0 : x.clockseq, i ? void 0 : x.node, t, n);
	}
	return t ?? f(r);
}
function ee(e, t, n) {
	return e.msecs ??= -Infinity, e.nsecs ??= 0, t === e.msecs ? (e.nsecs++, e.nsecs >= 1e4 && (e.node = void 0, e.nsecs = 0)) : t > e.msecs ? e.nsecs = 0 : t < e.msecs && (e.node = void 0), e.node || (e.node = n.slice(10, 16), e.node[0] |= 1, e.clockseq = (n[8] << 8 | n[9]) & 16383), e.msecs = t, e;
}
function b(e, t, n, r, i, a, o = 0) {
	if (e.length < 16) throw Error("Random bytes length must be >= 16");
	if (!a) a = new Uint8Array(16), o = 0;
	else if (o < 0 || o + 16 > a.length) throw RangeError(`UUID byte range ${o}:${o + 15} is out of buffer bounds`);
	t ??= Date.now(), n ??= 0, r ??= (e[8] << 8 | e[9]) & 16383, i ??= e.slice(10, 16), t += 0xb1d069b5400;
	let s = ((t & 268435455) * 1e4 + n) % 4294967296;
	a[o++] = s >>> 24 & 255, a[o++] = s >>> 16 & 255, a[o++] = s >>> 8 & 255, a[o++] = s & 255;
	let c = t / 4294967296 * 1e4 & 268435455;
	a[o++] = c >>> 8 & 255, a[o++] = c & 255, a[o++] = c >>> 24 & 15 | 16, a[o++] = c >>> 16 & 255, a[o++] = r >>> 8 | 128, a[o++] = r & 255;
	for (let e = 0; e < 6; ++e) a[o++] = i[e];
	return a;
}
var x, S = e((() => {
	v(), h(), x = {};
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v1ToV6.js
function C(e) {
	let t = w(typeof e == "string" ? u(e) : e);
	return typeof e == "string" ? f(t) : t;
}
function w(e) {
	return Uint8Array.of((e[6] & 15) << 4 | e[7] >> 4 & 15, (e[7] & 15) << 4 | (e[4] & 240) >> 4, (e[4] & 15) << 4 | (e[5] & 240) >> 4, (e[5] & 15) << 4 | (e[0] & 240) >> 4, (e[0] & 15) << 4 | (e[1] & 240) >> 4, (e[1] & 15) << 4 | (e[2] & 240) >> 4, 96 | e[2] & 15, e[3], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
}
var T = e((() => {
	d(), h();
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/md5.js
function te(e) {
	return E(O(ne(e), e.length * 8));
}
function E(e) {
	let t = new Uint8Array(e.length * 4);
	for (let n = 0; n < e.length * 4; n++) t[n] = e[n >> 2] >>> n % 4 * 8 & 255;
	return t;
}
function D(e) {
	return (e + 64 >>> 9 << 4) + 14 + 1;
}
function O(e, t) {
	let n = new Uint32Array(D(t)).fill(0);
	n.set(e), n[t >> 5] |= 128 << t % 32, n[n.length - 1] = t, e = n;
	let r = 1732584193, i = -271733879, a = -1732584194, o = 271733878;
	for (let t = 0; t < e.length; t += 16) {
		let n = r, s = i, c = a, l = o;
		r = j(r, i, a, o, e[t], 7, -680876936), o = j(o, r, i, a, e[t + 1], 12, -389564586), a = j(a, o, r, i, e[t + 2], 17, 606105819), i = j(i, a, o, r, e[t + 3], 22, -1044525330), r = j(r, i, a, o, e[t + 4], 7, -176418897), o = j(o, r, i, a, e[t + 5], 12, 1200080426), a = j(a, o, r, i, e[t + 6], 17, -1473231341), i = j(i, a, o, r, e[t + 7], 22, -45705983), r = j(r, i, a, o, e[t + 8], 7, 1770035416), o = j(o, r, i, a, e[t + 9], 12, -1958414417), a = j(a, o, r, i, e[t + 10], 17, -42063), i = j(i, a, o, r, e[t + 11], 22, -1990404162), r = j(r, i, a, o, e[t + 12], 7, 1804603682), o = j(o, r, i, a, e[t + 13], 12, -40341101), a = j(a, o, r, i, e[t + 14], 17, -1502002290), i = j(i, a, o, r, e[t + 15], 22, 1236535329), r = M(r, i, a, o, e[t + 1], 5, -165796510), o = M(o, r, i, a, e[t + 6], 9, -1069501632), a = M(a, o, r, i, e[t + 11], 14, 643717713), i = M(i, a, o, r, e[t], 20, -373897302), r = M(r, i, a, o, e[t + 5], 5, -701558691), o = M(o, r, i, a, e[t + 10], 9, 38016083), a = M(a, o, r, i, e[t + 15], 14, -660478335), i = M(i, a, o, r, e[t + 4], 20, -405537848), r = M(r, i, a, o, e[t + 9], 5, 568446438), o = M(o, r, i, a, e[t + 14], 9, -1019803690), a = M(a, o, r, i, e[t + 3], 14, -187363961), i = M(i, a, o, r, e[t + 8], 20, 1163531501), r = M(r, i, a, o, e[t + 13], 5, -1444681467), o = M(o, r, i, a, e[t + 2], 9, -51403784), a = M(a, o, r, i, e[t + 7], 14, 1735328473), i = M(i, a, o, r, e[t + 12], 20, -1926607734), r = N(r, i, a, o, e[t + 5], 4, -378558), o = N(o, r, i, a, e[t + 8], 11, -2022574463), a = N(a, o, r, i, e[t + 11], 16, 1839030562), i = N(i, a, o, r, e[t + 14], 23, -35309556), r = N(r, i, a, o, e[t + 1], 4, -1530992060), o = N(o, r, i, a, e[t + 4], 11, 1272893353), a = N(a, o, r, i, e[t + 7], 16, -155497632), i = N(i, a, o, r, e[t + 10], 23, -1094730640), r = N(r, i, a, o, e[t + 13], 4, 681279174), o = N(o, r, i, a, e[t], 11, -358537222), a = N(a, o, r, i, e[t + 3], 16, -722521979), i = N(i, a, o, r, e[t + 6], 23, 76029189), r = N(r, i, a, o, e[t + 9], 4, -640364487), o = N(o, r, i, a, e[t + 12], 11, -421815835), a = N(a, o, r, i, e[t + 15], 16, 530742520), i = N(i, a, o, r, e[t + 2], 23, -995338651), r = P(r, i, a, o, e[t], 6, -198630844), o = P(o, r, i, a, e[t + 7], 10, 1126891415), a = P(a, o, r, i, e[t + 14], 15, -1416354905), i = P(i, a, o, r, e[t + 5], 21, -57434055), r = P(r, i, a, o, e[t + 12], 6, 1700485571), o = P(o, r, i, a, e[t + 3], 10, -1894986606), a = P(a, o, r, i, e[t + 10], 15, -1051523), i = P(i, a, o, r, e[t + 1], 21, -2054922799), r = P(r, i, a, o, e[t + 8], 6, 1873313359), o = P(o, r, i, a, e[t + 15], 10, -30611744), a = P(a, o, r, i, e[t + 6], 15, -1560198380), i = P(i, a, o, r, e[t + 13], 21, 1309151649), r = P(r, i, a, o, e[t + 4], 6, -145523070), o = P(o, r, i, a, e[t + 11], 10, -1120210379), a = P(a, o, r, i, e[t + 2], 15, 718787259), i = P(i, a, o, r, e[t + 9], 21, -343485551), r = k(r, n), i = k(i, s), a = k(a, c), o = k(o, l);
	}
	return Uint32Array.of(r, i, a, o);
}
function ne(e) {
	if (e.length === 0) return new Uint32Array();
	let t = new Uint32Array(D(e.length * 8)).fill(0);
	for (let n = 0; n < e.length; n++) t[n >> 2] |= (e[n] & 255) << n % 4 * 8;
	return t;
}
function k(e, t) {
	let n = (e & 65535) + (t & 65535);
	return (e >> 16) + (t >> 16) + (n >> 16) << 16 | n & 65535;
}
function re(e, t) {
	return e << t | e >>> 32 - t;
}
function A(e, t, n, r, i, a) {
	return k(re(k(k(t, e), k(r, a)), i), n);
}
function j(e, t, n, r, i, a, o) {
	return A(t & n | ~t & r, e, t, i, a, o);
}
function M(e, t, n, r, i, a, o) {
	return A(t & r | n & ~r, e, t, i, a, o);
}
function N(e, t, n, r, i, a, o) {
	return A(t ^ n ^ r, e, t, i, a, o);
}
function P(e, t, n, r, i, a, o) {
	return A(n ^ (t | ~r), e, t, i, a, o);
}
var ie = e((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v35.js
function ae(e) {
	e = unescape(encodeURIComponent(e));
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; ++n) t[n] = e.charCodeAt(n);
	return t;
}
function F(e, t, n, r, i, a) {
	let o = typeof n == "string" ? ae(n) : n, s = typeof r == "string" ? u(r) : r;
	if (typeof r == "string" && (r = u(r)), r?.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
	let c = new Uint8Array(16 + o.length);
	if (c.set(s), c.set(o, s.length), c = t(c), c[6] = c[6] & 15 | e, c[8] = c[8] & 63 | 128, i) {
		if (a ??= 0, a < 0 || a + 16 > i.length) throw RangeError(`UUID byte range ${a}:${a + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; ++e) i[a + e] = c[e];
		return i;
	}
	return f(c);
}
var I, L, R = e((() => {
	d(), h(), I = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", L = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v3.js
function z(e, t, n, r) {
	return F(48, te, e, t, n, r);
}
var B = e((() => {
	ie(), R(), z.DNS = I, z.URL = L;
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v4.js
function V(e, t, n) {
	return !t && !e && crypto.randomUUID ? crypto.randomUUID() : H(e, t, n);
}
function H(e, t, n) {
	e ||= {};
	let r = e.random ?? e.rng?.() ?? g();
	if (r.length < 16) throw Error("Random bytes length must be >= 16");
	if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, t) {
		if (n ||= 0, n < 0 || n + 16 > t.length) throw RangeError(`UUID byte range ${n}:${n + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; ++e) t[n + e] = r[e];
		return t;
	}
	return f(r);
}
var U = e((() => {
	v(), h();
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/sha1.js
function W(e, t, n, r) {
	switch (e) {
		case 0: return t & n ^ ~t & r;
		case 1: return t ^ n ^ r;
		case 2: return t & n ^ t & r ^ n & r;
		case 3: return t ^ n ^ r;
	}
}
function G(e, t) {
	return e << t | e >>> 32 - t;
}
function K(e) {
	let t = [
		1518500249,
		1859775393,
		2400959708,
		3395469782
	], n = [
		1732584193,
		4023233417,
		2562383102,
		271733878,
		3285377520
	], r = new Uint8Array(e.length + 1);
	r.set(e), r[e.length] = 128, e = r;
	let i = e.length / 4 + 2, a = Math.ceil(i / 16), o = Array(a);
	for (let t = 0; t < a; ++t) {
		let n = new Uint32Array(16);
		for (let r = 0; r < 16; ++r) n[r] = e[t * 64 + r * 4] << 24 | e[t * 64 + r * 4 + 1] << 16 | e[t * 64 + r * 4 + 2] << 8 | e[t * 64 + r * 4 + 3];
		o[t] = n;
	}
	o[a - 1][14] = (e.length - 1) * 8 / 2 ** 32, o[a - 1][14] = Math.floor(o[a - 1][14]), o[a - 1][15] = (e.length - 1) * 8 & 4294967295;
	for (let e = 0; e < a; ++e) {
		let r = new Uint32Array(80);
		for (let t = 0; t < 16; ++t) r[t] = o[e][t];
		for (let e = 16; e < 80; ++e) r[e] = G(r[e - 3] ^ r[e - 8] ^ r[e - 14] ^ r[e - 16], 1);
		let i = n[0], a = n[1], s = n[2], c = n[3], l = n[4];
		for (let e = 0; e < 80; ++e) {
			let n = Math.floor(e / 20), o = G(i, 5) + W(n, a, s, c) + l + t[n] + r[e] >>> 0;
			l = c, c = s, s = G(a, 30) >>> 0, a = i, i = o;
		}
		n[0] = n[0] + i >>> 0, n[1] = n[1] + a >>> 0, n[2] = n[2] + s >>> 0, n[3] = n[3] + c >>> 0, n[4] = n[4] + l >>> 0;
	}
	return Uint8Array.of(n[0] >> 24, n[0] >> 16, n[0] >> 8, n[0], n[1] >> 24, n[1] >> 16, n[1] >> 8, n[1], n[2] >> 24, n[2] >> 16, n[2] >> 8, n[2], n[3] >> 24, n[3] >> 16, n[3] >> 8, n[3], n[4] >> 24, n[4] >> 16, n[4] >> 8, n[4]);
}
var q = e((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v5.js
function J(e, t, n, r) {
	return F(80, K, e, t, n, r);
}
var oe = e((() => {
	q(), R(), J.DNS = I, J.URL = L;
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v6.js
function se(e, t, n) {
	e ??= {}, n ??= 0;
	let r = y({
		...e,
		_v6: !0
	}, new Uint8Array(16));
	if (r = C(r), t) {
		if (n < 0 || n + 16 > t.length) throw RangeError(`UUID byte range ${n}:${n + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; e++) t[n + e] = r[e];
		return t;
	}
	return f(r);
}
var ce = e((() => {
	h(), S(), T();
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v6ToV1.js
function Y(e) {
	let t = le(typeof e == "string" ? u(e) : e);
	return typeof e == "string" ? f(t) : t;
}
function le(e) {
	return Uint8Array.of((e[3] & 15) << 4 | e[4] >> 4 & 15, (e[4] & 15) << 4 | (e[5] & 240) >> 4, (e[5] & 15) << 4 | e[6] & 15, e[7], (e[1] & 15) << 4 | (e[2] & 240) >> 4, (e[2] & 15) << 4 | (e[3] & 240) >> 4, 16 | (e[0] & 240) >> 4, (e[0] & 15) << 4 | (e[1] & 240) >> 4, e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
}
var ue = e((() => {
	d(), h();
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/v7.js
function X(e, t, n) {
	let r;
	if (e) r = Z(e.random ?? e.rng?.() ?? g(), e.msecs, e.seq, t, n);
	else {
		let e = Date.now(), i = g();
		de(Q, e, i), r = Z(i, Q.msecs, Q.seq, t, n);
	}
	return t ?? f(r);
}
function de(e, t, n) {
	return e.msecs ??= -Infinity, e.seq ??= 0, t > e.msecs ? (e.seq = n[6] << 23 | n[7] << 16 | n[8] << 8 | n[9], e.msecs = t) : (e.seq = e.seq + 1 | 0, e.seq === 0 && e.msecs++), e;
}
function Z(e, t, n, r, i = 0) {
	if (e.length < 16) throw Error("Random bytes length must be >= 16");
	if (!r) r = new Uint8Array(16), i = 0;
	else if (i < 0 || i + 16 > r.length) throw RangeError(`UUID byte range ${i}:${i + 15} is out of buffer bounds`);
	return t ??= Date.now(), n ??= e[6] * 127 << 24 | e[7] << 16 | e[8] << 8 | e[9], r[i++] = t / 1099511627776 & 255, r[i++] = t / 4294967296 & 255, r[i++] = t / 16777216 & 255, r[i++] = t / 65536 & 255, r[i++] = t / 256 & 255, r[i++] = t & 255, r[i++] = 112 | n >>> 28 & 15, r[i++] = n >>> 20 & 255, r[i++] = 128 | n >>> 14 & 63, r[i++] = n >>> 6 & 255, r[i++] = n << 2 & 255 | e[10] & 3, r[i++] = e[11], r[i++] = e[12], r[i++] = e[13], r[i++] = e[14], r[i++] = e[15], r;
}
var Q, $ = e((() => {
	v(), h(), Q = {};
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist/version.js
function fe(e) {
	if (!c(e)) throw TypeError("Invalid UUID");
	return parseInt(e.slice(14, 15), 16);
}
var pe = e((() => {
	l();
})), me = /* @__PURE__ */ t({
	MAX: () => n,
	NIL: () => i,
	parse: () => u,
	stringify: () => p,
	v1: () => y,
	v1ToV6: () => C,
	v3: () => z,
	v4: () => V,
	v5: () => J,
	v6: () => se,
	v6ToV1: () => Y,
	v7: () => X,
	validate: () => c,
	version: () => fe
}), he = e((() => {
	r(), a(), d(), h(), S(), T(), B(), U(), oe(), ce(), ue(), $(), l(), pe();
}));
//#endregion
export { U as a, c, X as i, he as n, V as o, $ as r, l as s, me as t };
