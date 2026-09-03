import { B as e, Cn as t, Ct as n, D as r, En as i, F as a, Gn as o, Hn as s, I as c, In as l, J as u, Jn as d, K as f, Ln as p, Nn as m, P as h, Pn as g, Sn as _, St as v, T as y, Tn as b, U as x, W as S, Xn as C, Yn as w, Zn as ee, _n as te, ar as T, bn as E, cr as D, dn as O, gn as ne, hn as k, in as re, ln as ie, mn as ae, n as oe, nn as se, or as ce, q as le, rn as ue, tn as A, un as de, wt as fe, yt as pe, zn as me } from "./chunk-J7OUQ5F2-BUGcDHyW.mjs";
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/_internal/isPrototype.mjs
function he(e) {
	let t = e?.constructor;
	return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.46.1/node_modules/es-toolkit/dist/compat/predicate/isEmpty.mjs
function ge(e) {
	if (e == null) return !0;
	if (pe(e)) return typeof e.splice != "function" && typeof e != "string" && !u(e) && !f(e) && !le(e) ? !1 : e.length === 0;
	if (typeof e == "object") {
		if (e instanceof Map || e instanceof Set) return e.size === 0;
		let t = Object.keys(e);
		return he(e) ? t.filter((e) => e !== "constructor").length === 0 : t.length === 0;
	}
	return !0;
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.3.6/node_modules/stylis/src/Enum.js
var _e = "comm", ve = "rule", ye = "decl", be = "@import", xe = "@namespace", Se = "@keyframes", Ce = "@layer", we = Math.abs, Te = String.fromCharCode;
function Ee(e) {
	return e.trim();
}
function j(e, t, n) {
	return e.replace(t, n);
}
function De(e, t, n) {
	return e.indexOf(t, n);
}
function M(e, t) {
	return e.charCodeAt(t) | 0;
}
function N(e, t, n) {
	return e.slice(t, n);
}
function P(e) {
	return e.length;
}
function Oe(e) {
	return e.length;
}
function F(e, t) {
	return t.push(e), e;
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.3.6/node_modules/stylis/src/Tokenizer.js
var I = 1, L = 1, ke = 0, R = 0, z = 0, B = "";
function V(e, t, n, r, i, a, o, s) {
	return {
		value: e,
		root: t,
		parent: n,
		type: r,
		props: i,
		children: a,
		line: I,
		column: L,
		length: o,
		return: "",
		siblings: s
	};
}
function Ae() {
	return z;
}
function je() {
	return z = R > 0 ? M(B, --R) : 0, L--, z === 10 && (L = 1, I--), z;
}
function H() {
	return z = R < ke ? M(B, R++) : 0, L++, z === 10 && (L = 1, I++), z;
}
function U() {
	return M(B, R);
}
function W() {
	return R;
}
function G(e, t) {
	return N(B, e, t);
}
function K(e) {
	switch (e) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
function Me(e) {
	return I = L = 1, ke = P(B = e), R = 0, [];
}
function Ne(e) {
	return B = "", e;
}
function q(e) {
	return Ee(G(R - 1, J(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Pe(e) {
	for (; (z = U()) && z < 33;) H();
	return K(e) > 2 || K(z) > 3 ? "" : " ";
}
function Fe(e, t) {
	for (; --t && H() && !(z < 48 || z > 102 || z > 57 && z < 65 || z > 70 && z < 97););
	return G(e, W() + (t < 6 && U() == 32 && H() == 32));
}
function J(e) {
	for (; H();) switch (z) {
		case e: return R;
		case 34:
		case 39:
			e !== 34 && e !== 39 && J(z);
			break;
		case 40:
			e === 41 && J(e);
			break;
		case 92:
			H();
			break;
	}
	return R;
}
function Ie(e, t) {
	for (; H() && e + z !== 57 && !(e + z === 84 && U() === 47););
	return "/*" + G(t, R - 1) + "*" + Te(e === 47 ? e : H());
}
function Le(e) {
	for (; !K(U());) H();
	return G(e, R);
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.3.6/node_modules/stylis/src/Parser.js
function Re(e) {
	return Ne(Y("", null, null, null, [""], e = Me(e), 0, [0], e));
}
function Y(e, t, n, r, i, a, o, s, c) {
	for (var l = 0, u = 0, d = o, f = 0, p = 0, m = 0, h = 1, g = 1, _ = 1, v = 0, y = "", b = i, x = a, S = r, C = y; g;) switch (m = v, v = H()) {
		case 40: if (m != 108 && M(C, d - 1) == 58) {
			De(C += j(q(v), "&", "&\f"), "&\f", we(l ? s[l - 1] : 0)) != -1 && (_ = -1);
			break;
		}
		case 34:
		case 39:
		case 91:
			C += q(v);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			C += Pe(m);
			break;
		case 92:
			C += Fe(W() - 1, 7);
			continue;
		case 47:
			switch (U()) {
				case 42:
				case 47:
					F(Be(Ie(H(), W()), t, n, c), c), (K(m || 1) == 5 || K(U() || 1) == 5) && P(C) && N(C, -1, void 0) !== " " && (C += " ");
					break;
				default: C += "/";
			}
			break;
		case 123 * h: s[l++] = P(C) * _;
		case 125 * h:
		case 59:
		case 0:
			switch (v) {
				case 0:
				case 125: g = 0;
				case 59 + u:
					_ == -1 && (C = j(C, /\f/g, "")), p > 0 && (P(C) - d || h === 0 && m === 47) && F(p > 32 ? Ve(C + ";", r, n, d - 1, c) : Ve(j(C, " ", "") + ";", r, n, d - 2, c), c);
					break;
				case 59: C += ";";
				default: if (F(S = ze(C, t, n, l, u, i, s, y, b = [], x = [], d, a), a), v === 123) if (u === 0) Y(C, t, S, S, b, a, d, s, x);
				else {
					switch (f) {
						case 99: if (M(C, 3) === 110) break;
						case 108: if (M(C, 2) === 97) break;
						default: u = 0;
						case 100:
						case 109:
						case 115:
					}
					u ? Y(e, S, S, r && F(ze(e, S, S, 0, 0, i, s, y, i, b = [], d, x), x), i, x, d, s, r ? b : x) : Y(C, S, S, S, [""], x, 0, s, x);
				}
			}
			l = u = p = 0, h = _ = 1, y = C = "", d = o;
			break;
		case 58: d = 1 + P(C), p = m;
		default:
			if (h < 1) {
				if (v == 123) --h;
				else if (v == 125 && h++ == 0 && je() == 125) continue;
			}
			switch (C += Te(v), v * h) {
				case 38:
					_ = u > 0 ? 1 : (C += "\f", -1);
					break;
				case 44:
					s[l++] = (P(C) - 1) * _, _ = 1;
					break;
				case 64:
					U() === 45 && (C += q(H())), f = U(), u = d = P(y = C += Le(W())), v++;
					break;
				case 45: m === 45 && P(C) == 2 && (h = 0);
			}
	}
	return a;
}
function ze(e, t, n, r, i, a, o, s, c, l, u, d) {
	for (var f = i - 1, p = i === 0 ? a : [""], m = Oe(p), h = 0, g = 0, _ = 0; h < r; ++h) for (var v = 0, y = N(e, f + 1, f = we(g = o[h])), b = e; v < m; ++v) (b = Ee(g > 0 ? p[v] + " " + y : j(y, /&\f/g, p[v]))) && (c[_++] = b);
	return V(e, t, n, i === 0 ? ve : s, c, l, u, d);
}
function Be(e, t, n, r) {
	return V(e, t, n, _e, Te(Ae()), N(e, 2, -2), 0, r);
}
function Ve(e, t, n, r, i) {
	return V(e, t, n, ye, N(e, 0, r), N(e, r + 1, -1), r, i);
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.3.6/node_modules/stylis/src/Serializer.js
function He(e, t) {
	for (var n = "", r = 0; r < e.length; r++) n += t(e[r], r, e, t) || "";
	return n;
}
function Ue(e, t, n, r) {
	switch (e.type) {
		case Ce: if (e.children.length) break;
		case be:
		case xe:
		case ye: return e.return = e.return || e.value;
		case _e: return "";
		case Se: return e.return = e.value + "{" + He(e.children, r) + "}";
		case ve: if (!P(e.value = e.props.join(","))) return "";
	}
	return P(n = He(e.children, r)) ? e.return = e.value + "{" + n + "}" : "";
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.3.6/node_modules/stylis/src/Middleware.js
function We(e) {
	var t = Oe(e);
	return function(n, r, i, a) {
		for (var o = "", s = 0; s < t; s++) o += e[s](n, r, i, a) || "";
		return o;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/mermaid.core.mjs
var Ge = "c4", Ke = {
	id: Ge,
	detector: /* @__PURE__ */ D((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./c4Diagram-5PPSVZJV-0H1niZHc.mjs");
		return {
			id: Ge,
			diagram: e
		};
	}, "loader")
}, qe = "flowchart", Je = {
	id: qe,
	detector: /* @__PURE__ */ D((e, t) => t?.flowchart?.defaultRenderer === "dagre-wrapper" || t?.flowchart?.defaultRenderer === "elk" ? !1 : /^\s*graph/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./flowDiagram-UKHOOZJN-B331JIwR.mjs");
		return {
			id: qe,
			diagram: e
		};
	}, "loader")
}, Ye = "flowchart-v2", Xe = {
	id: Ye,
	detector: /* @__PURE__ */ D((e, t) => t?.flowchart?.defaultRenderer === "dagre-d3" ? !1 : (t?.flowchart?.defaultRenderer === "elk" && (t.layout = "elk"), /^\s*graph/.test(e) && t?.flowchart?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*flowchart/.test(e)), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./flowDiagram-UKHOOZJN-B331JIwR.mjs");
		return {
			id: Ye,
			diagram: e
		};
	}, "loader")
}, Ze = "swimlane", Qe = {
	id: Ze,
	detector: /* @__PURE__ */ D((e) => /^\s*swimlane-beta\b/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./swimlanesDiagram-ULZ7WXOC-DwxImv6_.mjs");
		return {
			id: Ze,
			diagram: e
		};
	}, "loader")
}, $e = "er", et = {
	id: $e,
	detector: /* @__PURE__ */ D((e) => /^\s*erDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./erDiagram-JOGREHBK-D9xc6GOe.mjs");
		return {
			id: $e,
			diagram: e
		};
	}, "loader")
}, tt = "gitGraph", nt = {
	id: tt,
	detector: /* @__PURE__ */ D((e) => /^\s*gitGraph/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./gitGraphDiagram-DS77QQ5N-BclrMvJ9.mjs");
		return {
			id: tt,
			diagram: e
		};
	}, "loader")
}, rt = "gantt", it = {
	id: rt,
	detector: /* @__PURE__ */ D((e) => /^\s*gantt/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./ganttDiagram-PKOTCBZU-337ARsy5.mjs");
		return {
			id: rt,
			diagram: e
		};
	}, "loader")
}, at = "info", ot = {
	id: at,
	detector: /* @__PURE__ */ D((e) => /^\s*info/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./infoDiagram-6WML65LV-COkazaN_.mjs");
		return {
			id: at,
			diagram: e
		};
	}, "loader")
}, st = "pie", ct = {
	id: st,
	detector: /* @__PURE__ */ D((e) => /^\s*pie/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./pieDiagram-7S7Q4E2Y-ZdGPifZ5.mjs");
		return {
			id: st,
			diagram: e
		};
	}, "loader")
}, lt = "quadrantChart", ut = {
	id: lt,
	detector: /* @__PURE__ */ D((e) => /^\s*quadrantChart/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./quadrantDiagram-CIZ2JOQS-8btfG_u3.mjs");
		return {
			id: lt,
			diagram: e
		};
	}, "loader")
}, dt = "xychart", ft = {
	id: dt,
	detector: /* @__PURE__ */ D((e) => /^\s*xychart(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./xychartDiagram-ELKLHX3M-BuAEWbUS.mjs");
		return {
			id: dt,
			diagram: e
		};
	}, "loader")
}, pt = "requirement", mt = {
	id: pt,
	detector: /* @__PURE__ */ D((e) => /^\s*requirement(Diagram)?/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./requirementDiagram-LRYGKXZP-DsEZQcTv.mjs");
		return {
			id: pt,
			diagram: e
		};
	}, "loader")
}, ht = "sequence", gt = {
	id: ht,
	detector: /* @__PURE__ */ D((e) => /^\s*sequenceDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./sequenceDiagram-SI44F4Z6-DyfhYyqb.mjs");
		return {
			id: ht,
			diagram: e
		};
	}, "loader")
}, _t = "class", vt = {
	id: _t,
	detector: /* @__PURE__ */ D((e, t) => t?.class?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*classDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./classDiagram-JCYQIIEL-D0jdMBCZ.mjs");
		return {
			id: _t,
			diagram: e
		};
	}, "loader")
}, yt = "classDiagram", bt = {
	id: yt,
	detector: /* @__PURE__ */ D((e, t) => /^\s*classDiagram/.test(e) && t?.class?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*classDiagram-v2/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./classDiagram-v2-OCEON4UE-hnoP4YWx.mjs");
		return {
			id: yt,
			diagram: e
		};
	}, "loader")
}, xt = "state", St = {
	id: xt,
	detector: /* @__PURE__ */ D((e, t) => t?.state?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*stateDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./stateDiagram-OKZ733FA-CRu1FQjZ.mjs");
		return {
			id: xt,
			diagram: e
		};
	}, "loader")
}, Ct = "stateDiagram", wt = {
	id: Ct,
	detector: /* @__PURE__ */ D((e, t) => !!(/^\s*stateDiagram-v2/.test(e) || /^\s*stateDiagram/.test(e) && t?.state?.defaultRenderer === "dagre-wrapper"), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./stateDiagram-v2-UEYNNEHI-DBgevUaT.mjs");
		return {
			id: Ct,
			diagram: e
		};
	}, "loader")
}, Tt = "journey", Et = {
	id: Tt,
	detector: /* @__PURE__ */ D((e) => /^\s*journey/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./journeyDiagram-NVQOT4AX-BUDePIlE.mjs");
		return {
			id: Tt,
			diagram: e
		};
	}, "loader")
}, Dt = { draw: /* @__PURE__ */ D((e, t, n) => {
	T.debug("rendering svg for syntax error\n");
	let r = fe(t), i = r.append("g");
	r.attr("viewBox", "0 0 2412 512"), ie(r, 100, 512, !0), i.append("path").attr("class", "error-icon").attr("d", "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"), i.append("path").attr("class", "error-icon").attr("d", "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"), i.append("path").attr("class", "error-icon").attr("d", "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"), i.append("path").attr("class", "error-icon").attr("d", "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"), i.append("path").attr("class", "error-icon").attr("d", "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"), i.append("path").attr("class", "error-icon").attr("d", "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"), i.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), i.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${n}`);
}, "draw") }, Ot = Dt, kt = {
	db: {},
	renderer: Dt,
	parser: { parse: /* @__PURE__ */ D(() => {}, "parse") }
}, At = "flowchart-elk", jt = {
	id: At,
	detector: /* @__PURE__ */ D((e, t = {}) => /^\s*flowchart-elk/.test(e) || /^\s*(flowchart|graph)/.test(e) && t?.flowchart?.defaultRenderer === "elk" ? (t.layout = "elk", !0) : !1, "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./flowDiagram-UKHOOZJN-B331JIwR.mjs");
		return {
			id: At,
			diagram: e
		};
	}, "loader")
}, Mt = "timeline", Nt = {
	id: Mt,
	detector: /* @__PURE__ */ D((e) => /^\s*timeline/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./timeline-definition-Z64GVDOM-CehyEgm7.mjs");
		return {
			id: Mt,
			diagram: e
		};
	}, "loader")
}, Pt = "mindmap", Ft = {
	id: Pt,
	detector: /* @__PURE__ */ D((e) => /^\s*mindmap/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./mindmap-definition-FAOFIHXS-wGZlTDBh.mjs");
		return {
			id: Pt,
			diagram: e
		};
	}, "loader")
}, It = "kanban", Lt = {
	id: It,
	detector: /* @__PURE__ */ D((e) => /^\s*kanban/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./kanban-definition-27J2QSJJ-j1nQq5lr.mjs");
		return {
			id: It,
			diagram: e
		};
	}, "loader")
}, Rt = "sankey", zt = {
	id: Rt,
	detector: /* @__PURE__ */ D((e) => /^\s*sankey(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./sankeyDiagram-W5VNT64P-CIbVFUUZ.mjs");
		return {
			id: Rt,
			diagram: e
		};
	}, "loader")
}, Bt = "packet", Vt = {
	id: Bt,
	detector: /* @__PURE__ */ D((e) => /^\s*packet(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./diagram-LBJQPF4R-B3zRiwn1.mjs");
		return {
			id: Bt,
			diagram: e
		};
	}, "loader")
}, Ht = "radar", Ut = {
	id: Ht,
	detector: /* @__PURE__ */ D((e) => /^\s*radar-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./diagram-UB23O5K3-CwCTjY4r.mjs");
		return {
			id: Ht,
			diagram: e
		};
	}, "loader")
}, Wt = "block", Gt = {
	id: Wt,
	detector: /* @__PURE__ */ D((e) => /^\s*block(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./blockDiagram-VBNYF7ZC-DA4ZoMlZ.mjs");
		return {
			id: Wt,
			diagram: e
		};
	}, "loader")
}, Kt = "treeView", qt = {
	id: Kt,
	detector: /* @__PURE__ */ D((e) => /^\s*treeView-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./diagram-7IWD3JNH-DH60rF2B.mjs");
		return {
			id: Kt,
			diagram: e
		};
	}, "loader")
}, Jt = "architecture", Yt = {
	id: Jt,
	detector: /* @__PURE__ */ D((e) => /^\s*architecture/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./architectureDiagram-T3A2C74G-Z2rdUZEx.mjs");
		return {
			id: Jt,
			diagram: e
		};
	}, "loader")
}, Xt = "eventmodeling", Zt = {
	id: Xt,
	detector: /* @__PURE__ */ D((e) => /^\s*eventmodeling/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./diagram-B4RE2ZJO-lq_xJkqG.mjs");
		return {
			id: Xt,
			diagram: e
		};
	}, "loader")
}, Qt = "ishikawa", $t = {
	id: Qt,
	detector: /* @__PURE__ */ D((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./ishikawaDiagram-WSZJBQD7-Cn25d-a0.mjs");
		return {
			id: Qt,
			diagram: e
		};
	}, "loader")
}, en = "venn", tn = {
	id: en,
	detector: /* @__PURE__ */ D((e) => /^\s*venn-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./vennDiagram-T6HMQDX7-CSWjZ_pt.mjs");
		return {
			id: en,
			diagram: e
		};
	}, "loader")
}, nn = "treemap", rn = {
	id: nn,
	detector: /* @__PURE__ */ D((e) => /^\s*treemap/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./diagram-Q27KOJAE-DFYwkvru.mjs");
		return {
			id: nn,
			diagram: e
		};
	}, "loader")
}, an = "wardley", on = {
	id: an,
	detector: /* @__PURE__ */ D((e) => /^\s*wardley-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./wardleyDiagram-T6FBY63Y-BqI-MTg3.mjs");
		return {
			id: an,
			diagram: e
		};
	}, "loader")
}, sn = "cynefin", cn = {
	id: sn,
	detector: /* @__PURE__ */ D((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./cynefinDiagram-MW4NZA55-B0lQImIl.mjs");
		return {
			id: sn,
			diagram: e
		};
	}, "loader")
}, ln = "railroad", un = {
	id: ln,
	detector: /* @__PURE__ */ D((e) => /^\s*railroad-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./railroadDiagram-AXF67PYL-mlW3QJ2G.mjs");
		return {
			id: ln,
			diagram: e
		};
	}, "loader")
}, dn = "railroadEbnf", fn = {
	id: dn,
	detector: /* @__PURE__ */ D((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./ebnfDiagram-BXEA7PRR-6qztPcCx.mjs");
		return {
			id: dn,
			diagram: e
		};
	}, "loader")
}, pn = "railroadAbnf", mn = {
	id: pn,
	detector: /* @__PURE__ */ D((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./abnfDiagram-N423BO3Z-3bjAvBdG.mjs");
		return {
			id: pn,
			diagram: e
		};
	}, "loader")
}, hn = "railroadPeg", gn = {
	id: hn,
	detector: /* @__PURE__ */ D((e) => /^\s*railroad-peg-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ D(async () => {
		let { diagram: e } = await import("./pegDiagram-VL7TDLO6-yPR8QOtk.mjs");
		return {
			id: hn,
			diagram: e
		};
	}, "loader")
}, _n = !1, X = /* @__PURE__ */ D(() => {
	_n || (_n = !0, m("error", kt, (e) => e.toLowerCase().trim() === "error"), m("---", {
		db: { clear: /* @__PURE__ */ D(() => {}, "clear") },
		styles: {},
		renderer: { draw: /* @__PURE__ */ D(() => {}, "draw") },
		parser: { parse: /* @__PURE__ */ D(() => {
			throw Error("Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks");
		}, "parse") },
		init: /* @__PURE__ */ D(() => null, "init")
	}, (e) => e.toLowerCase().trimStart().startsWith("---")), g(jt, Ft, Yt), g(Ke, Lt, bt, vt, et, it, ot, ct, mt, gt, Qe, Xe, Je, Nt, nt, wt, St, Et, ut, zt, Vt, ft, Gt, Zt, qt, Ut, $t, rn, un, fn, mn, gn, tn, on, cn));
}, "addDiagrams"), vn = /* @__PURE__ */ D(async () => {
	T.debug("Loading registered diagrams");
	let e = (await Promise.allSettled(Object.entries(k).map(async ([e, { detector: t, loader: n }]) => {
		if (n) try {
			_(e);
		} catch {
			try {
				let { diagram: e, id: r } = await n();
				m(r, e, t);
			} catch (t) {
				throw T.error(`Failed to load external diagram with key ${e}. Removing from detectors.`), delete k[e], t;
			}
		}
	}))).filter((e) => e.status === "rejected");
	if (e.length > 0) {
		T.error(`Failed to load ${e.length} external diagrams`);
		for (let t of e) T.error(t);
		throw Error(`Failed to load ${e.length} external diagrams`);
	}
}, "loadRegisteredDiagrams"), yn = "graphics-document document";
function bn(e, t) {
	e.attr("role", yn), t !== "" && e.attr("aria-roledescription", t);
}
D(bn, "setA11yDiagramInfo");
function xn(e, t, n, r) {
	if (e.insert !== void 0) {
		if (n) {
			let t = `chart-desc-${r}`;
			e.attr("aria-describedby", t), e.insert("desc", ":first-child").attr("id", t).text(n);
		}
		if (t) {
			let n = `chart-title-${r}`;
			e.attr("aria-labelledby", n), e.insert("title", ":first-child").attr("id", n).text(t);
		}
	}
}
D(xn, "addSVGa11yTitleDescription");
var Sn = class e {
	constructor(e, t, n, r, i) {
		this.type = e, this.text = t, this.db = n, this.parser = r, this.renderer = i;
	}
	static {
		D(this, "Diagram");
	}
	static async fromText(n, r = {}) {
		let i = E(), a = ae(n, i);
		n = c(n) + "\n";
		try {
			_(a);
		} catch {
			let e = t(a);
			if (!e) throw new se(`Diagram ${a} not found.`);
			let { id: n, diagram: r } = await e();
			m(n, r);
		}
		let { db: o, parser: s, renderer: l, init: u } = _(a);
		return s.parser && (s.parser.yy = o), o.clear?.(), u?.(i), r.title && o.setDiagramTitle?.(r.title), await s.parse(n), new e(a, n, o, s, l);
	}
	async render(e, t) {
		await this.renderer.draw(this.text, e, t, this);
	}
	getParser() {
		return this.parser;
	}
	getType() {
		return this.type;
	}
}, Cn = [], wn = /* @__PURE__ */ D(() => {
	Cn.forEach((e) => {
		e();
	}), Cn = [];
}, "attachFunctions"), Tn = /* @__PURE__ */ D((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function En(e) {
	let t = e.match(te);
	if (!t) return {
		text: e,
		metadata: {}
	};
	let r = t[1], i = n(r ? t[2].split("\n").map((e) => e.startsWith(r) ? e.slice(r.length) : e).join("\n") : t[2], { schema: v }) ?? {};
	i = typeof i == "object" && !Array.isArray(i) ? i : {};
	let a = {};
	return i.displayMode && (a.displayMode = i.displayMode.toString()), i.title && (a.title = i.title.toString()), i.config && (a.config = i.config), {
		text: e.slice(t[0].length),
		metadata: a
	};
}
D(En, "extractFrontMatter");
var Dn = /* @__PURE__ */ D((e) => e.replace(/\r\n?/g, "\n").replace(/<(\w+)([^>]*)>/g, (e, t, n) => "<" + t + n.replace(/="([^"]*)"/g, "='$1'") + ">"), "cleanupText"), On = /* @__PURE__ */ D((e) => {
	let { text: t, metadata: n } = En(e), { displayMode: r, title: i, config: a = {} } = n;
	return r && (a.gantt ||= {}, a.gantt.displayMode = r), {
		title: i,
		config: a,
		text: t
	};
}, "processFrontmatter"), kn = /* @__PURE__ */ D((e) => {
	let t = S.detectInit(e) ?? {}, n = S.detectDirective(e, "wrap");
	return Array.isArray(n) ? t.wrap = n.some(({ type: e }) => e === "wrap") : n?.type === "wrap" && (t.wrap = !0), {
		text: x(e),
		directive: t
	};
}, "processDirectives");
function An(e) {
	let t = On(Dn(e)), n = kn(t.text), r = h(t.config, n.directive);
	return e = Tn(n.text), {
		code: e,
		title: t.title,
		config: r
	};
}
D(An, "preprocessDiagram");
function jn(e) {
	let t = new TextEncoder().encode(e), n = Array.from(t, (e) => String.fromCodePoint(e)).join("");
	return btoa(n);
}
D(jn, "toBase64");
var Mn = 5e4, Nn = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", Pn = "sandbox", Fn = "loose", In = "http://www.w3.org/2000/svg", Ln = "http://www.w3.org/1999/xlink", Rn = "http://www.w3.org/1999/xhtml", zn = "100%", Bn = "100%", Vn = "border:0;margin:0;", Hn = "margin:0", Un = "allow-top-navigation-by-user-activation allow-popups", Wn = "The \"iframe\" tag is not supported by your browser.", Gn = ["foreignobject"], Kn = ["dominant-baseline"];
function qn(e) {
	let t = An(e);
	return l(), ue(t.config ?? {}), t;
}
D(qn, "processAndSetConfigs");
async function Jn(e, t) {
	X();
	try {
		let { code: t, config: n } = qn(e);
		return {
			diagramType: (await or(t)).type,
			config: n
		};
	} catch (e) {
		if (t?.suppressErrors) return !1;
		throw e;
	}
}
D(Jn, "parse");
var Yn = /* @__PURE__ */ D((e, t, n = []) => `.${e} ${t} ${p(`{ ${n.join(" !important; ")} !important; }`)}`, "cssImportantStyles"), Xn = /* @__PURE__ */ D((e, t = /* @__PURE__ */ new Map()) => {
	let n = new CSSStyleSheet();
	if (e.fontFamily !== void 0 && n.insertRule(`:root { --mermaid-font-family: ${e.fontFamily}}`, n.cssRules.length), e.altFontFamily !== void 0 && n.insertRule(`:root { --mermaid-alt-font-family: ${e.altFontFamily}}`, n.cssRules.length), t instanceof Map) {
		let r = b(e) ? ["> *", "span"] : [
			"rect",
			"polygon",
			"ellipse",
			"circle",
			"path"
		];
		t.forEach((e) => {
			ge(e.styles) || r.forEach((t) => {
				n.insertRule(Yn(e.id, t, e.styles), n.cssRules.length);
			}), ge(e.textStyles) || n.insertRule(Yn(e.id, "tspan", (e?.textStyles || []).map((e) => e.replace("color", "fill"))), n.cssRules.length);
		});
	}
	let r = "";
	if (e.themeCSS !== void 0) if (typeof n.replaceSync == "function") {
		let t = new CSSStyleSheet();
		t.replaceSync(e.themeCSS), r = de(t) + "\n";
	} else r += `${e.themeCSS}
`;
	return r + de(n);
}, "createCssStyles"), Zn = /* @__PURE__ */ D((e, t) => He(Re(`${e}{${t}}`), We([/* @__PURE__ */ D(function(t, n, r, i) {
	if (t.type === "rule" && Array.isArray(t.props)) {
		if (t.parent && t.parent.type === "@keyframes") return;
		t.props = t.props.map((n) => n === e && Array.isArray(t.children) && t.children.every((e) => e.type === "decl" ? (/* @__PURE__ */ new Set([
			"font-family",
			"font-size",
			"fill"
		])).has(e.props) : !1) || (n.startsWith(`${e} `) || n.startsWith(`${e}>`)) && !n.startsWith(`${e} ||`) ? n : `${e} ${n}`);
	} else t.type.startsWith("@") && ([
		"@media",
		"@supports",
		"@layer",
		"@scope",
		"@container",
		"@starting-style",
		"@keyframes"
	].includes(t.type) || (T.warn(`Removing unsupported at-rule ${t.type} from CSS`), t.type = _e));
}, "addNamespace"), Ue])), "compileCSS"), Qn = /* @__PURE__ */ D((e, t, n, r) => Zn(r, d(t, Xn(e, n), {
	...e.themeVariables,
	theme: e.theme,
	look: e.look
}, r)), "createUserStyles"), $n = /* @__PURE__ */ D((e = "", t, n) => {
	let r = e;
	return !n && !t && (r = r.replace(/marker-end="url\([\d+./:=?A-Za-z-]*?#/g, "marker-end=\"url(#")), r = a(r), r = r.replace(/<br>/g, "<br/>"), r;
}, "cleanUpSvgCode"), er = /* @__PURE__ */ D((e = "", t) => `<iframe style="width:${zn};height:${t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : Bn};${Vn}" src="data:text/html;charset=UTF-8;base64,${jn(`<body style="${Hn}">${e}</body>`)}" sandbox="${Un}">
  ${Wn}
</iframe>`, "putIntoIFrame"), tr = /* @__PURE__ */ D((e, t, n, r, i) => {
	let a = e.append("div");
	a.attr("id", n), r && a.attr("style", r);
	let o = a.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", In);
	return i && o.attr("xmlns:xlink", i), o.append("g"), e;
}, "appendDivSvgG");
function nr(e, t) {
	return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
D(nr, "sandboxedIframe");
var rr = /* @__PURE__ */ D((e, t, n, r) => {
	e.getElementById(t)?.remove(), e.getElementById(n)?.remove(), e.getElementById(r)?.remove();
}, "removeExistingElements"), ir = /* @__PURE__ */ D(async function(e, t, n) {
	X();
	let r = qn(t);
	t = r.code;
	let i = E();
	T.debug(i), t.length > (i?.maxTextSize ?? Mn) && (t = Nn);
	let a = `#${e}`, o = "i" + e, s = "#" + o, c = "d" + e, l = "#" + c, u = /* @__PURE__ */ D(() => {
		let e = A(f ? s : l).node();
		e && "remove" in e && e.remove();
	}, "removeTempElements"), d = A(document.body), f = i.securityLevel === Pn, p = i.securityLevel === Fn, m = i.fontFamily;
	n === void 0 ? (rr(document, e, c, o), f ? (d = A(nr(A(document.body), o).nodes()[0].contentDocument.body), d.node().style.margin = "0") : d = A("body"), tr(d, e, c)) : (n && (n.innerHTML = ""), f ? (d = A(nr(A(n), o).nodes()[0].contentDocument.body), d.node().style.margin = "0") : d = A(n), tr(d, e, c, `font-family: ${m}`, Ln));
	let h, g;
	try {
		h = await Sn.fromText(t, { title: r.title });
	} catch (e) {
		if (i.suppressErrorRendering) throw u(), e;
		h = await Sn.fromText("error"), g = e;
	}
	let _ = d.select(l).node(), v = h.type, y = _.firstChild, b = y.firstChild, x = h.renderer.getClasses?.(t, h), S = Qn(i, v, x, a), C = document.createElement("style");
	C.innerHTML = S, y.insertBefore(C, b);
	try {
		await h.renderer.draw(t, e, "11.16.1", h);
	} catch (n) {
		throw i.suppressErrorRendering ? u() : Ot.draw(t, e, "11.16.1"), n;
	}
	let w = d.select(`${l} svg`), te = h.db.getAccTitle?.(), O = h.db.getAccDescription?.();
	sr(v, w, te, O), d.select(`[id="${e}"]`).selectAll("foreignobject > *").attr("xmlns", Rn);
	let k = d.select(l).node().innerHTML;
	if (T.debug("config.arrowMarkerAbsolute", i.arrowMarkerAbsolute), k = $n(k, f, ne(i.arrowMarkerAbsolute)), f) {
		let e = d.select(l + " svg").node();
		k = er(k, e);
	} else p || (k = ee.sanitize(k, {
		ADD_TAGS: Gn,
		ADD_ATTR: Kn,
		HTML_INTEGRATION_POINTS: { foreignobject: !0 }
	}));
	if (wn(), g) throw g;
	return u(), {
		diagramType: v,
		svg: k,
		bindFunctions: h.db.bindFunctions
	};
}, "render");
function ar(e = {}) {
	let t = re({}, e);
	t?.fontFamily && !t.themeVariables?.fontFamily && (t.themeVariables ||= {}, t.themeVariables.fontFamily = t.fontFamily), me(t), t?.theme && t.theme in w ? t.themeVariables = w[t.theme].getThemeVariables(t.themeVariables) : t && (t.themeVariables = w.default.getThemeVariables(t.themeVariables)), ce((typeof t == "object" ? o(t) : i()).logLevel), X();
}
D(ar, "initialize");
var or = /* @__PURE__ */ D((e, t = {}) => {
	let { code: n } = An(e);
	return Sn.fromText(n, t);
}, "getDiagramFromText");
function sr(e, t, n, r) {
	bn(t, e), xn(t, n, r, t.attr("id"));
}
D(sr, "addA11yInfo");
var Z = Object.freeze({
	render: ir,
	parse: Jn,
	getDiagramFromText: or,
	initialize: ar,
	getConfig: E,
	setConfig: s,
	getSiteConfig: i,
	updateSiteConfig: C,
	reset: /* @__PURE__ */ D(() => {
		l();
	}, "reset"),
	globalReset: /* @__PURE__ */ D(() => {
		l(O);
	}, "globalReset"),
	defaultConfig: O
});
ce(E().logLevel), l(E());
var cr = /* @__PURE__ */ D((t, n, r) => {
	T.warn(t), e(t) ? (r && r(t.str, t.hash), n.push({
		...t,
		message: t.str,
		error: t
	})) : (r && r(t), t instanceof Error && n.push({
		str: t.message,
		message: t.message,
		hash: t.name,
		error: t
	}));
}, "handleError"), lr = /* @__PURE__ */ D(async function(t = { querySelector: ".mermaid" }) {
	try {
		await ur(t);
	} catch (n) {
		if (e(n) && T.error(n.str), $.parseError && $.parseError(n), !t.suppressErrors) throw T.error("Use the suppressErrors option to suppress these errors"), n;
	}
}, "run"), ur = /* @__PURE__ */ D(async function({ postRenderCallback: e, querySelector: t, nodes: n } = { querySelector: ".mermaid" }) {
	let r = Z.getConfig();
	T.debug(`${e ? "" : "No "}Callback function found`);
	let i;
	if (n) i = n;
	else if (t) i = document.querySelectorAll(t);
	else throw Error("Nodes and querySelector are both undefined");
	T.debug(`Found ${i.length} diagrams`), r?.startOnLoad !== void 0 && (T.debug("Start On Load: " + r?.startOnLoad), Z.updateSiteConfig({ startOnLoad: r?.startOnLoad }));
	let a = new S.InitIDGenerator(r.deterministicIds, r.deterministicIDSeed), o, s = [];
	for (let t of Array.from(i)) {
		if (T.info("Rendering diagram: " + t.id), t.getAttribute("data-processed")) continue;
		t.setAttribute("data-processed", "true");
		let n = `mermaid-${a.next()}`;
		o = t.innerHTML, o = y(S.entityDecode(o)).trim().replace(/<br\s*\/?>/gi, "<br/>");
		let r = S.detectInit(o);
		r && T.debug("Detected early reinit: ", r);
		try {
			let { svg: r, bindFunctions: i } = await yr(n, o, t);
			t.innerHTML = r, e && await e(n), i && i(t);
		} catch (e) {
			cr(e, s, $.parseError);
		}
	}
	if (s.length > 0) throw s[0];
}, "runThrowsErrors"), dr = /* @__PURE__ */ D(function(e) {
	Z.initialize(e);
}, "initialize"), fr = /* @__PURE__ */ D(async function(e, t, n) {
	T.warn("mermaid.init is deprecated. Please use run instead."), e && dr(e);
	let r = {
		postRenderCallback: n,
		querySelector: ".mermaid"
	};
	typeof t == "string" ? r.querySelector = t : t && (t instanceof HTMLElement ? r.nodes = [t] : r.nodes = t), await lr(r);
}, "init"), pr = /* @__PURE__ */ D(async (e, { lazyLoad: t = !0 } = {}) => {
	X(), g(...e), t === !1 && await vn();
}, "registerExternalDiagrams"), mr = /* @__PURE__ */ D(function() {
	if ($.startOnLoad) {
		let { startOnLoad: e } = Z.getConfig();
		e && $.run().catch((e) => T.error("Mermaid failed to initialize", e));
	}
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", mr, !1);
var hr = /* @__PURE__ */ D(function(e) {
	$.parseError = e;
}, "setParseErrorHandler"), Q = [], gr = !1, _r = /* @__PURE__ */ D(async () => {
	if (!gr) {
		for (gr = !0; Q.length > 0;) {
			let e = Q.shift();
			if (e) try {
				await e();
			} catch (e) {
				T.error("Error executing queue", e);
			}
		}
		gr = !1;
	}
}, "executeQueue"), vr = /* @__PURE__ */ D(async (e, t) => new Promise((n, r) => {
	let i = /* @__PURE__ */ D(() => new Promise((i, a) => {
		Z.parse(e, t).then((e) => {
			i(e), n(e);
		}, (e) => {
			T.error("Error parsing", e), $.parseError?.(e), a(e), r(e);
		});
	}), "performCall");
	Q.push(i), _r().catch(r);
}), "parse"), yr = /* @__PURE__ */ D((e, t, n) => new Promise((r, i) => {
	let a = /* @__PURE__ */ D(() => new Promise((a, o) => {
		Z.render(e, t, n).then((e) => {
			a(e), r(e);
		}, (e) => {
			T.error("Error parsing", e), $.parseError?.(e), o(e), i(e);
		});
	}), "performCall");
	Q.push(a), _r().catch(i);
}), "render"), $ = {
	startOnLoad: !0,
	mermaidAPI: Z,
	parse: vr,
	render: yr,
	init: fr,
	run: lr,
	registerExternalDiagrams: pr,
	registerLayoutLoaders: oe,
	initialize: dr,
	parseError: void 0,
	contentLoaded: mr,
	setParseErrorHandler: hr,
	detectType: ae,
	registerIconPacks: r,
	getRegisteredDiagramsMetadata: /* @__PURE__ */ D(() => Object.keys(k).map((e) => ({ id: e })), "getRegisteredDiagramsMetadata")
}, br = $;
//#endregion
export { br as t };
