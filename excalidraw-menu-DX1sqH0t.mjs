import { C as e, D as t, E as n, O as r, On as i, Ot as a, g as o, in as s, it as ee, k as c, kt as l, l as u, nt as d, t as te, w as f } from "./events-DnJ4Gvgf.mjs";
import { C as p, M as m, T as h, a as g, d as _, g as v, q as y, r as ne, s as b, t as x, w as S } from "./use-alt-text-control-DM2dozBw.mjs";
import { d as re, t as ie } from "./useTranslation-Egl4mJFn.mjs";
import { X as ae, n as C, t as w } from "./excalidraw-utils-BOlRvSWI.mjs";
import { Suspense as T, lazy as E, useCallback as D, useEffect as oe, useRef as O, useState as k } from "react";
import { Fragment as A, jsx as j, jsxs as M } from "react/jsx-runtime";
//#region src/features/editor/components/excalidraw/excalidraw-menu.tsx
var N = l(), P = E(() => import("./excalidraw-utils-BOlRvSWI.mjs").then((e) => e.r).then((e) => ({ default: e.Excalidraw })));
function F({ editor: l }) {
	let { t: E } = ie(), F = g(l), [I, { open: L, close: R }] = ee(!1), [z, B] = k(null);
	C({
		excalidrawAPI: z,
		adapter: w
	});
	let [V, H] = k(null), U = re(), W = O(!1), G = O(!1), [K, q] = k(!1), [se, J] = k(!1), Y = O(!0), X = O(""), Z = a({
		editor: l,
		selector: (e) => {
			if (!e.editor) return null;
			let t = e.editor.getAttributes("excalidraw");
			return {
				isExcalidraw: e.editor.isActive("excalidraw"),
				isAlignLeft: e.editor.isActive("excalidraw", { align: "left" }),
				isAlignCenter: e.editor.isActive("excalidraw", { align: "center" }),
				isAlignRight: e.editor.isActive("excalidraw", { align: "right" }),
				src: t?.src || null,
				attachmentId: t?.attachmentId || null,
				alt: t?.alt || ""
			};
		}
	}), ce = D(({ state: e }) => e ? l.isActive("excalidraw") && l.getAttributes("excalidraw")?.src : !1, [l]), le = D(() => {
		if (!(0, N.isEditorReady)(l)) return;
		let { selection: e } = l.state, t = s((e) => e.type.name === "excalidraw")(e);
		if (t) {
			let e = l.view.nodeDOM(t?.pos).getBoundingClientRect();
			return {
				getBoundingClientRect: () => e,
				getClientRects: () => [e]
			};
		}
		let n = i(l.view, e.from, e.to);
		return {
			getBoundingClientRect: () => n,
			getClientRects: () => [n]
		};
	}, [l]), ue = D(() => {
		l.chain().focus(void 0, { scrollIntoView: !1 }).setExcalidrawAlign("left").run();
	}, [l]), de = D(() => {
		l.chain().focus(void 0, { scrollIntoView: !1 }).setExcalidrawAlign("center").run();
	}, [l]), fe = D(() => {
		l.chain().focus(void 0, { scrollIntoView: !1 }).setExcalidrawAlign("right").run();
	}, [l]), pe = D(() => {
		if (!Z?.src) return;
		let e = o(Z.src), t = document.createElement("a");
		t.href = e, t.download = "", t.click();
	}, [Z?.src]), me = D(() => {
		l.commands.deleteSelection();
	}, [l]), { button: he, panel: ge, isEditing: _e } = x({
		editor: l,
		nodeName: "excalidraw",
		currentAlt: Z?.alt || ""
	}), ve = D(async () => {
		if (Z?.src) {
			J(!0);
			try {
				let e = o(Z.src), t = await fetch(e, {
					credentials: "include",
					cache: "no-store"
				}), { loadFromBlob: n } = await import("./excalidraw-utils-BOlRvSWI.mjs").then((e) => e.r);
				H(await n(await t.blob(), null, null));
			} catch (e) {
				console.error(e);
			} finally {
				J(!1), W.current = !1, Y.current = !0, L();
			}
		}
	}, [Z?.src, L]), Q = D(async () => {
		if (!(!z || G.current)) {
			G.current = !0, q(!0);
			try {
				let { exportToSvg: t } = await import("./excalidraw-utils-BOlRvSWI.mjs").then((e) => e.r), n = await t({
					elements: z?.getSceneElements(),
					appState: {
						exportEmbedScene: !0,
						exportWithDarkMode: !1
					},
					files: z?.getFiles()
				}), r = new XMLSerializer().serializeToString(n);
				r = r.replace(/https:\/\/unpkg\.com\/@excalidraw\/excalidraw@undefined/g, "https://unpkg.com/@excalidraw/excalidraw@latest");
				let i = await e(r, "diagram.excalidraw.svg"), a = l.storage?.pageId, o = Z?.attachmentId, s = null;
				s = o ? await u(i, a, o) : await u(i, a), l.commands.updateAttributes("excalidraw", {
					src: `/api/files/${s.id}/${s.fileName}?t=${new Date(s.updatedAt).getTime()}`,
					title: s.fileName,
					size: s.fileSize,
					attachmentId: s.id
				}), W.current = !1;
			} finally {
				G.current = !1, q(!1);
			}
		}
	}, [
		l,
		z,
		Z?.attachmentId
	]), ye = D(async () => {
		try {
			await Q(), R();
		} catch {}
	}, [Q, R]), $ = D(() => {
		if (!W.current) {
			R();
			return;
		}
		te.openConfirmModal({
			title: E("Unsaved changes"),
			children: /* @__PURE__ */ j(t, {
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
				W.current = !1, R();
			}
		});
	}, [R, E]);
	return oe(() => {
		if (!I) return;
		let e = setInterval(() => {
			W.current && !G.current && Q().catch(() => {});
		}, 6e4);
		return () => clearInterval(e);
	}, [I, Q]), /* @__PURE__ */ M(A, { children: [/* @__PURE__ */ j(_, {
		editor: l,
		pluginKey: "excalidraw-menu",
		updateDelay: 0,
		getReferencedVirtualElement: le,
		options: {
			placement: F ? "bottom" : "top",
			offset: 8,
			flip: !1
		},
		shouldShow: ce,
		children: _e ? ge : /* @__PURE__ */ M("div", {
			className: b.toolbar,
			children: [
				/* @__PURE__ */ j(y, {
					position: "top",
					label: E("Align left"),
					withinPortal: !1,
					children: /* @__PURE__ */ j(c, {
						onClick: ue,
						size: "lg",
						"aria-label": E("Align left"),
						variant: "subtle",
						className: d({ [b.active]: Z?.isAlignLeft }),
						children: /* @__PURE__ */ j(S, { size: 18 })
					})
				}),
				/* @__PURE__ */ j(y, {
					position: "top",
					label: E("Align center"),
					withinPortal: !1,
					children: /* @__PURE__ */ j(c, {
						onClick: de,
						size: "lg",
						"aria-label": E("Align center"),
						variant: "subtle",
						className: d({ [b.active]: Z?.isAlignCenter }),
						children: /* @__PURE__ */ j(h, { size: 18 })
					})
				}),
				/* @__PURE__ */ j(y, {
					position: "top",
					label: E("Align right"),
					withinPortal: !1,
					children: /* @__PURE__ */ j(c, {
						onClick: fe,
						size: "lg",
						"aria-label": E("Align right"),
						variant: "subtle",
						className: d({ [b.active]: Z?.isAlignRight }),
						children: /* @__PURE__ */ j(p, { size: 18 })
					})
				}),
				/* @__PURE__ */ j("div", { className: b.divider }),
				he,
				/* @__PURE__ */ j("div", { className: b.divider }),
				/* @__PURE__ */ j(y, {
					position: "top",
					label: E("Edit"),
					withinPortal: !1,
					children: /* @__PURE__ */ j(c, {
						onClick: ve,
						size: "lg",
						"aria-label": E("Edit"),
						variant: "subtle",
						loading: se,
						children: /* @__PURE__ */ j(f, { size: 18 })
					})
				}),
				/* @__PURE__ */ j(y, {
					position: "top",
					label: E("Download"),
					withinPortal: !1,
					children: /* @__PURE__ */ j(c, {
						onClick: pe,
						size: "lg",
						"aria-label": E("Download"),
						variant: "subtle",
						children: /* @__PURE__ */ j(m, { size: 18 })
					})
				}),
				!F && /* @__PURE__ */ j(y, {
					position: "top",
					label: E("Delete"),
					withinPortal: !1,
					children: /* @__PURE__ */ j(c, {
						onClick: me,
						size: "lg",
						"aria-label": E("Delete"),
						variant: "subtle",
						children: /* @__PURE__ */ j(v, { size: 18 })
					})
				}),
				F && /* @__PURE__ */ M(A, { children: [/* @__PURE__ */ j("div", { className: b.divider }), /* @__PURE__ */ j(ne, { editor: l })] })
			]
		})
	}), /* @__PURE__ */ M(ae, {
		style: {
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			padding: 0,
			zIndex: 200
		},
		isOpen: I,
		onRequestClose: $,
		disableCloseOnBgClick: !0,
		contentProps: { style: {
			padding: 0,
			width: "90vw"
		} },
		children: [/* @__PURE__ */ M(r, {
			justify: "flex-end",
			wrap: "nowrap",
			bg: "var(--mantine-color-body)",
			p: "xs",
			children: [/* @__PURE__ */ j(n, {
				onClick: ye,
				size: "compact-sm",
				loading: K,
				children: E("Save & Exit")
			}), /* @__PURE__ */ j(n, {
				onClick: $,
				color: "red",
				size: "compact-sm",
				children: E("Exit")
			})]
		}), /* @__PURE__ */ j("div", {
			style: { height: "90vh" },
			children: /* @__PURE__ */ j(T, {
				fallback: null,
				children: /* @__PURE__ */ j(P, {
					excalidrawAPI: (e) => B(e),
					onChange: (e, t, n) => {
						let r = `${e.length}:${e.reduce((e, t) => e + (t.version || 0), 0)}:${Object.keys(n).length}`;
						if (Y.current) {
							X.current = r, Y.current = !1;
							return;
						}
						r !== X.current && (X.current = r, W.current = !0);
					},
					initialData: {
						...V,
						scrollToContent: !0
					},
					theme: U
				})
			})
		})]
	})] });
}
//#endregion
export { F as ExcalidrawMenu, F as default };
