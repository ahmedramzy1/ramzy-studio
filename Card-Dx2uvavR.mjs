import { F as e, M as t, P as n, U as r, W as i, mt as a, pt as o, rt as s } from "./events-DnJ4Gvgf.mjs";
import { Children as c, cloneElement as l } from "react";
import { jsx as u } from "react/jsx-runtime";
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Card/Card.context.mjs
var [d, f] = a("Card component was not found in tree"), p = {
	root: "m_e615b15f",
	section: "m_599a2148"
}, m = e((e) => {
	let { classNames: t, className: r, style: a, styles: o, vars: s, withBorder: c, inheritPadding: l, mod: d, ...p } = i("CardSection", null, e), m = f();
	return /* @__PURE__ */ u(n, {
		mod: [{
			"with-border": c,
			"inherit-padding": l
		}, d],
		...m.getStyles("section", {
			className: r,
			style: a,
			styles: o,
			classNames: t
		}),
		...p
	});
});
m.classes = p, m.displayName = "@mantine/core/CardSection";
//#endregion
//#region ../../node_modules/.pnpm/@mantine+core@9.3.2_@mantine+hooks@9.3.2_react@19.2.7__@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@mantine/core/esm/components/Card/Card.mjs
var h = s((e, { padding: t }) => ({ root: { "--card-padding": o(t) } })), g = { orientation: "vertical" }, _ = e((e) => {
	let n = i("Card", g, e), { classNames: a, className: o, style: s, styles: f, unstyled: _, vars: v, children: y, padding: b, attributes: x, orientation: S, ...C } = n, w = r({
		name: "Card",
		props: n,
		classes: p,
		className: o,
		style: s,
		classNames: a,
		styles: f,
		unstyled: _,
		attributes: x,
		vars: v,
		varsResolver: h
	}), T = c.toArray(y), E = T.map((e, t) => typeof e == "object" && e && "type" in e && (e.type === m || e.type?.displayName === "@mantine/core/CardSection") ? l(e, {
		"data-orientation": S,
		"data-first-section": t === 0 || void 0,
		"data-last-section": t === T.length - 1 || void 0
	}) : e);
	return /* @__PURE__ */ u(d, {
		value: { getStyles: w },
		children: /* @__PURE__ */ u(t, {
			unstyled: _,
			"data-orientation": S,
			...w("root"),
			...C,
			children: E
		})
	});
});
_.classes = p, _.varsResolver = h, _.displayName = "@mantine/core/Card", _.Section = m;
//#endregion
export { _ as t };
