import { n as e, o as t } from "./dist-C_26pHNr.mjs";
import { d as n, t as r } from "./useTranslation-Egl4mJFn.mjs";
import { t as i } from "./code-block.module-CDcfuF59.mjs";
import { Zn as a } from "./chunk-J7OUQ5F2-BUGcDHyW.mjs";
import { t as o } from "./mermaid.core-B5WVPIYt.mjs";
import { useEffect as s, useState as c } from "react";
import { jsx as l } from "react/jsx-runtime";
//#region src/features/editor/components/code-block/mermaid-view.tsx
e();
function u({ props: e }) {
	let { t: u } = r(), d = n(), { node: f } = e, [p, m] = c("");
	return s(() => {
		o.initialize({
			startOnLoad: !1,
			suppressErrorRendering: !0,
			theme: d === "light" ? "default" : "dark"
		});
	}, [d]), s(() => {
		let n = `mermaid-${t()}`;
		f.textContent.length > 0 && o.render(n, f.textContent).then((e) => {
			m(e.svg);
		}).catch((t) => {
			e.editor.isEditable ? m(`<div class="${i.error}">${u("Mermaid diagram error:")} ${a.sanitize(t)}</div>`) : m(`<div class="${i.error}">${u("Invalid Mermaid diagram")}</div>`);
		});
	}, [f.textContent, d]), /* @__PURE__ */ l("div", {
		className: i.mermaid,
		contentEditable: !1,
		dangerouslySetInnerHTML: { __html: p }
	});
}
//#endregion
export { u as default };
