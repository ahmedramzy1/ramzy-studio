import { C as e, Ct as t, D as n, E as r, O as i, it as a, k as o, l as s, nt as c, t as l, w as u } from "./events-DnJ4Gvgf.mjs";
import { d, t as f } from "./useTranslation-Egl4mJFn.mjs";
import { t as p } from "./Card-Dx2uvavR.mjs";
import { X as m, n as h, t as g } from "./excalidraw-utils-BOlRvSWI.mjs";
import { Suspense as _, lazy as v, useCallback as y, useEffect as b, useRef as x, useState as S } from "react";
import { jsx as C, jsxs as w } from "react/jsx-runtime";
//#region src/features/editor/components/excalidraw/excalidraw-view.tsx
var T = v(() => import("./excalidraw-utils-BOlRvSWI.mjs").then((e) => e.r).then((e) => ({ default: e.Excalidraw })));
function E(v) {
	let { t: E } = f(), { node: D, updateAttributes: O, editor: k, selected: A } = v, { attachmentId: j } = D.attrs, [M, N] = S(null);
	h({
		excalidrawAPI: M,
		adapter: g
	});
	let [P, F] = S(null), [I, { open: L, close: R }] = a(!1), z = d(), B = x(!1), V = x(!1), [H, U] = S(!1), W = x(!0), G = x(""), K = async () => {
		k.isEditable && (B.current = !1, W.current = !0, L());
	}, q = y(async (t = !0) => {
		if (!(!M || V.current)) {
			V.current = !0, U(!0);
			try {
				let { exportToSvg: n } = await import("./excalidraw-utils-BOlRvSWI.mjs").then((e) => e.r), r = await n({
					elements: M?.getSceneElements(),
					appState: {
						exportEmbedScene: !0,
						exportWithDarkMode: !1
					},
					files: M?.getFiles()
				}), i = new XMLSerializer().serializeToString(r);
				i = i.replace(/https:\/\/unpkg\.com\/@excalidraw\/excalidraw@undefined/g, "https://unpkg.com/@excalidraw/excalidraw@latest");
				let a = await e(i, "diagram.excalidraw.svg"), o = k.storage?.pageId, c = null;
				c = j ? await s(a, o, j) : await s(a, o), O(t ? {
					src: `/api/files/${c.id}/${c.fileName}?t=${new Date(c.updatedAt).getTime()}`,
					title: c.fileName,
					size: c.fileSize,
					attachmentId: c.id
				} : { attachmentId: c.id }), B.current = !1;
			} finally {
				V.current = !1, U(!1);
			}
		}
	}, [
		M,
		k,
		j,
		O
	]), J = y(async () => {
		try {
			await q(), R();
		} catch {}
	}, [q, R]), Y = y(() => {
		if (!B.current) {
			R();
			return;
		}
		l.openConfirmModal({
			title: E("Unsaved changes"),
			children: /* @__PURE__ */ C(n, {
				size: "sm",
				children: E("You have unsaved changes that will be lost.")
			}),
			centered: !0,
			labels: {
				confirm: E("Discard"),
				cancel: E("Cancel")
			},
			confirmProps: { color: "red" },
			onConfirm: () => {
				B.current = !1, R();
			}
		});
	}, [R, E]);
	return b(() => {
		if (!I) return;
		let e = setInterval(() => {
			B.current && !V.current && q(!1).catch(() => {});
		}, 3e4);
		return () => clearInterval(e);
	}, [I, q]), /* @__PURE__ */ w(t, {
		"data-drag-handle": !0,
		children: [/* @__PURE__ */ w(m, {
			style: {
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				padding: 0,
				zIndex: 200
			},
			isOpen: I,
			onRequestClose: Y,
			disableCloseOnBgClick: !0,
			contentProps: { style: {
				padding: 0,
				width: "90vw"
			} },
			children: [/* @__PURE__ */ w(i, {
				justify: "flex-end",
				wrap: "nowrap",
				bg: "var(--mantine-color-body)",
				p: "xs",
				children: [/* @__PURE__ */ C(r, {
					onClick: J,
					size: "compact-sm",
					loading: H,
					children: E("Save & Exit")
				}), /* @__PURE__ */ C(r, {
					onClick: Y,
					color: "red",
					size: "compact-sm",
					children: E("Exit")
				})]
			}), /* @__PURE__ */ C("div", {
				style: { height: "90vh" },
				children: /* @__PURE__ */ C(_, {
					fallback: null,
					children: /* @__PURE__ */ C(T, {
						excalidrawAPI: (e) => N(e),
						onChange: (e, t, n) => {
							let r = `${e.length}:${e.reduce((e, t) => e + (t.version || 0), 0)}:${Object.keys(n).length}`;
							if (W.current) {
								G.current = r, W.current = !1;
								return;
							}
							r !== G.current && (G.current = r, B.current = !0);
						},
						initialData: {
							...P,
							scrollToContent: !0
						},
						theme: z
					})
				})
			})]
		}), /* @__PURE__ */ C(p, {
			radius: "md",
			onClick: (e) => e.detail === 2 && K(),
			p: "xs",
			style: {
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			},
			withBorder: !0,
			className: c(A ? "ProseMirror-selectednode" : ""),
			children: /* @__PURE__ */ w("div", {
				style: {
					display: "flex",
					alignItems: "center"
				},
				children: [/* @__PURE__ */ C(o, {
					variant: "transparent",
					color: "gray",
					"aria-label": E("Edit drawing"),
					children: /* @__PURE__ */ C(u, { size: 18 })
				}), /* @__PURE__ */ C(n, {
					component: "span",
					size: "lg",
					c: "dimmed",
					children: E("Double-click to edit Excalidraw diagram")
				})]
			})
		})]
	});
}
//#endregion
export { E as default };
