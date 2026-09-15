import { n as e, o as t } from "./dist-C_26pHNr.mjs";
import { d as n, t as r } from "./useTranslation-Egl4mJFn.mjs";
import { t as i } from "./code-block.module-BoFFNlq6.mjs";
import { Zn as a } from "./chunk-J7OUQ5F2-BUGcDHyW.mjs";
import { t as o } from "./mermaid.core-B5WVPIYt.mjs";
import { useEffect as s, useState as c } from "react";
import { jsx as l } from "react/jsx-runtime";
//#region src/features/editor/components/code-block/mermaid-view.tsx
e();
function u({ props: e, colorScheme: u }) {
	let { t: d } = r(), f = n("light"), p = u ?? f, { node: m } = e, [h, g] = c("");
	return s(() => {
		o.initialize({
			startOnLoad: !1,
			suppressErrorRendering: !0,
			theme: p === "light" ? "default" : "dark"
		});
	}, [p]), s(() => {
		let n = !1, r = `mermaid-${t()}`;
		return m.textContent.length > 0 && o.render(r, m.textContent).then((e) => {
			n || g(e.svg);
		}).catch((t) => {
			n || (e.editor.isEditable ? g(`<div class="${i.error}">${d("Mermaid diagram error:")} ${a.sanitize(t)}</div>`) : g(`<div class="${i.error}">${d("Invalid Mermaid diagram")}</div>`));
		}), () => {
			n = !0;
		};
	}, [m.textContent, p]), /* @__PURE__ */ l("div", {
		className: i.mermaid,
		contentEditable: !1,
		dangerouslySetInnerHTML: { __html: h }
	});
}
//#endregion
export { u as default };
