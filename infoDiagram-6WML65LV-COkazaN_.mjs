import { ar as e, cr as t, ln as n, wt as r } from "./chunk-J7OUQ5F2-BUGcDHyW.mjs";
import { n as i } from "./mermaid-parser.core-DgJi7O7s.mjs";
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-6WML65LV.mjs
var a = { parse: /* @__PURE__ */ t(async (t) => {
	let n = await i("info", t);
	e.debug(n);
}, "parse") }, o = { version: "11.16.1" }, s = {
	parser: a,
	db: { getVersion: /* @__PURE__ */ t(() => o.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ t((t, i, a) => {
		e.debug("rendering info diagram\n" + t);
		let o = r(i);
		n(o, 100, 400, !0), o.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${a}`);
	}, "draw") }
};
//#endregion
export { s as diagram };
