import { A as e, _ as t, ar as n, b as r, c as i, cr as a, g as o, h as s, i as c, l, m as u, o as d, s as f, x as p, xn as m, y as h } from "./chunk-J7OUQ5F2-BUGcDHyW.mjs";
import { t as g } from "./graphlib-ZWHIaefB.mjs";
import { t as _ } from "./dagre-BSE9hWJW.mjs";
import { a as v, i as y, n as b, o as x, r as S, t as C } from "./chunk-RYQCIY6F-464IjAOI.mjs";
//#region ../../node_modules/.pnpm/mermaid@11.16.1/node_modules/mermaid/dist/chunks/mermaid.core/dagre-VZM6K2ZE.mjs
var w = /* @__PURE__ */ a((e, t, n) => Math.max(t, Math.min(n, e)), "clamp"), T = /* @__PURE__ */ a((e = "TB") => {
	switch (e) {
		case "BT": return "bottom";
		case "LR": return "right";
		case "RL": return "left";
		default: return "top";
	}
}, "getDefaultSelfLoopSide"), E = /* @__PURE__ */ a((e) => e === "flowchart" || e === "flowchart-v2" || e === "stateDiagram", "shouldMergeSelfLoopSegments"), D = /* @__PURE__ */ a((e, t, n, r, i) => {
	let a = [], o = /* @__PURE__ */ new Set();
	if (n.forEach(({ start: e, end: t }) => {
		e !== r && o.add(e), t !== r && o.add(t);
	}), o.forEach((t) => {
		let n = e.node(t);
		typeof n?.x == "number" && typeof n?.y == "number" && a.push(n);
	}), a.length === 0 && n.forEach(({ edge: e }) => {
		(e.points ?? []).forEach((e) => {
			typeof e?.x == "number" && typeof e?.y == "number" && a.push(e);
		});
	}), a.length === 0) return T(i);
	let s = a.reduce((e, t) => ({
		x: e.x + t.x / a.length,
		y: e.y + t.y / a.length
	}), {
		x: 0,
		y: 0
	}), c = s.x - t.x, l = s.y - t.y;
	return Math.abs(c) > Math.abs(l) ? c > 0 ? "right" : "left" : Math.abs(l) > 0 ? l > 0 ? "bottom" : "top" : T(i);
}, "getSelfLoopSide"), O = /* @__PURE__ */ a((e, t = "top", n = 0, r = 0) => {
	let i = e.x, a = e.y - n, o = e.width / 2, s = e.height / 2, c = Math.max(36, Math.min(100, e.width * .8)), l = w(Math.max(r, e.width * .35), 36, c), u = w(Math.min(e.width, e.height) * .45, 24, 48);
	switch (t) {
		case "bottom": {
			let e = a + s;
			return [
				{
					x: i - l / 2,
					y: e
				},
				{
					x: i - l / 2,
					y: e + u
				},
				{
					x: i + l / 2,
					y: e + u
				},
				{
					x: i + l / 2,
					y: e
				}
			];
		}
		case "right": {
			let e = i + o;
			return [
				{
					x: e,
					y: a - l / 2
				},
				{
					x: e + u,
					y: a - l / 2
				},
				{
					x: e + u,
					y: a + l / 2
				},
				{
					x: e,
					y: a + l / 2
				}
			];
		}
		case "left": {
			let e = i - o;
			return [
				{
					x: e,
					y: a - l / 2
				},
				{
					x: e - u,
					y: a - l / 2
				},
				{
					x: e - u,
					y: a + l / 2
				},
				{
					x: e,
					y: a + l / 2
				}
			];
		}
		default: {
			let e = a - s;
			return [
				{
					x: i - l / 2,
					y: e
				},
				{
					x: i - l / 2,
					y: e - u
				},
				{
					x: i + l / 2,
					y: e - u
				},
				{
					x: i + l / 2,
					y: e
				}
			];
		}
	}
}, "getSelfLoopPoints"), k = /* @__PURE__ */ a((e, t, n = "top", r = 0, i = {}) => {
	let a = e.x, o = e.y - r, s = i.width ?? 0, c = i.height ?? 0;
	switch (n) {
		case "bottom": return {
			x: a,
			y: Math.max(...t.map((e) => e.y)) + c / 2 + 4
		};
		case "right": return {
			x: Math.max(...t.map((e) => e.x)) + s / 2 + 4,
			y: o
		};
		case "left": return {
			x: Math.min(...t.map((e) => e.x)) - s / 2 - 4,
			y: o
		};
		default: return {
			x: a,
			y: Math.min(...t.map((e) => e.y)) - c / 2 - 4
		};
	}
}, "getSelfLoopLabelPosition"), A = /* @__PURE__ */ a((e, t = 0, { mergeSelfLoops: n = !0 } = {}) => {
	let r = /* @__PURE__ */ new Map(), i = [], a = e.graph()?.rankdir;
	return e.edges().forEach((t) => {
		let a = e.edge(t);
		if (n && a.selfLoop) {
			let e = a.selfLoop.id;
			r.has(e) || r.set(e, []), r.get(e).push({
				edge: a,
				start: t.v,
				end: t.w
			});
		} else i.push({
			edge: a,
			start: t.v,
			end: t.w
		});
	}), r.forEach((n) => {
		if (n.length !== 3) {
			n.forEach((e) => i.push(e));
			return;
		}
		n.sort((e, t) => e.edge.selfLoop.order - t.edge.selfLoop.order);
		let [r, o, s] = n, c = r.edge.originalEdge ?? o.edge.originalEdge ?? s.edge.originalEdge ?? o.edge, l = e.node(c.start);
		if (!l) {
			n.forEach((e) => i.push(e));
			return;
		}
		let u = {
			width: o.edge.width,
			height: o.edge.height
		}, d = D(e, l, n, c.start, a), f = O(l, d, t, u.width ?? 0), p = k(l, f, d, t, u), m = {
			...o.edge,
			...c,
			id: c.id,
			points: f,
			start: c.start,
			end: c.end,
			x: p.x,
			y: p.y,
			width: u.width,
			height: u.height,
			labelStyle: o.edge.labelStyle,
			fromCluster: r.edge.fromCluster ?? o.edge.fromCluster ?? s.edge.fromCluster,
			toCluster: r.edge.toCluster ?? o.edge.toCluster ?? s.edge.toCluster
		};
		delete m.selfLoop, delete m.originalEdge, i.push({
			edge: m,
			start: m.start,
			end: m.end
		});
	}), i;
}, "getEdgesToRender"), j = /* @__PURE__ */ a(async (i, s, c, u, m, g) => {
	n.warn("Graph in recursive render:XAX", x(s), m);
	let b = s.graph().rankdir;
	n.trace("Dir in recursive render - dir:", b);
	let C = i.insert("g").attr("class", "root");
	s.nodes() ? n.info("Recursive render XXX", s.nodes()) : n.info("No nodes found for", s), s.edges().length > 0 && n.info("Recursive edges", s.edge(s.edges()[0]));
	let w = C.insert("g").attr("class", "clusters"), T = C.insert("g").attr("class", "edgePaths"), D = C.insert("g").attr("class", "edgeLabels"), O = C.insert("g").attr("class", "nodes"), k = E(c);
	await Promise.all(s.nodes().map(async function(e) {
		let i = s.node(e);
		if (m !== void 0) {
			let t = JSON.parse(JSON.stringify(m.clusterData));
			n.trace("Setting data for parent cluster XXX\n Node.id = ", e, "\n data=", t.height, "\nParent cluster", m.height), s.setNode(m.id, t), s.parent(e) || (n.trace("Setting parent", e, m.id), s.setParent(e, m.id, t));
		}
		if (n.info("(Insert) Node XXX" + e + ": " + JSON.stringify(s.node(e))), i?.clusterNode) {
			n.info("Cluster identified XBX", e, i.width, s.node(e));
			let { ranksep: t, nodesep: a } = s.graph();
			i.graph.setGraph({
				...i.graph.graph(),
				ranksep: t + 25,
				nodesep: a
			});
			let o = await j(O, i.graph, c, u, s.node(e), g), l = o.elem;
			p(i, l), i.diff = o.diff || 0, n.info("New compound node after recursive render XAX", e, "width", i.width, "height", i.height), r(l, i);
		} else s.children(e).length > 0 ? (n.trace("Cluster - the non recursive path XBX", e, i.id, i, i.width, "Graph:", s), n.trace(y(i.id, s)), S.set(i.id, {
			id: y(i.id, s),
			node: i
		})) : (n.trace("Node - the non recursive path XAX", e, O, s.node(e), b), await t(O, s.node(e), {
			config: g,
			dir: b
		}));
	})), await (/* @__PURE__ */ a(async () => {
		let e = s.edges().map(async function(e) {
			let t = s.edge(e.v, e.w, e.name);
			if (n.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e)), n.info("Edge " + e.v + " -> " + e.w + ": ", e, " ", JSON.stringify(s.edge(e))), n.info("Fix", S, "ids:", e.v, e.w, "Translating: ", S.get(e.v), S.get(e.w)), k && t.selfLoop) {
				if (t.selfLoop.order !== 1) return;
				let e = t.id;
				t.id = t.selfLoop.id, await f(D, t), t.id = e;
				return;
			}
			await f(D, t);
		});
		await Promise.all(e);
	}, "processEdges"))(), n.info("Graph before layout:", JSON.stringify(x(s))), n.info("############################################# XXX"), n.info("###                Layout                 ### XXX"), n.info("############################################# XXX"), _(s), n.info("Graph after layout:", JSON.stringify(x(s)));
	let M = 0, { subGraphTitleTotalMargin: N } = e(g);
	await Promise.all(v(s).map(async function(e) {
		let t = s.node(e);
		if (n.info("Position XBX => " + e + ": (" + t.x, "," + t.y, ") width: ", t.width, " height: ", t.height), t?.clusterNode) t.y += N, n.info("A tainted cluster node XBX1", e, t.id, t.width, t.height, t.x, t.y, s.parent(e)), S.get(t.id).node = t, h(t);
		else if (s.children(e).length > 0) {
			n.info("A pure cluster node XBX1", e, t.id, t.x, t.y, t.width, t.height, s.parent(e)), t.height += N, s.node(t.parentId);
			let r = t?.padding / 2 || 0, i = t?.labelBBox?.height || 0, a = i - r || 0;
			n.debug("OffsetY", a, "labelHeight", i, "halfPadding", r), await o(w, t), S.get(t.id).node = t;
		} else {
			let e = s.node(t.parentId);
			t.y += N / 2, n.info("A regular node XBX1 - using the padding", t.id, "parent", t.parentId, t.width, t.height, t.x, t.y, "offsetY", t.offsetY, "parent", e, e?.offsetY, t), h(t);
		}
	}));
	let P = N / 2;
	return A(s, P, { mergeSelfLoops: k }).forEach(function({ edge: e, start: t, end: r }) {
		n.info("Edge " + t + " -> " + r + ": " + JSON.stringify(e), e), e.points.forEach((e) => e.y += P), l(e, d(T, e, S, c, s.node(t), s.node(r), u));
	}), s.nodes().forEach(function(e) {
		let t = s.node(e);
		n.info(e, t.type, t.diff), t.isGroup && (M = t.diff);
	}), n.warn("Returning from recursive render XAX", C, M), {
		elem: C,
		diff: M
	};
}, "recursiveRender"), M = /* @__PURE__ */ a(async (e, t) => {
	let r = new g({
		multigraph: !0,
		compound: !0
	}).setGraph({
		rankdir: e.direction,
		nodesep: e.config?.nodeSpacing || e.config?.flowchart?.nodeSpacing || e.nodeSpacing,
		ranksep: e.config?.rankSpacing || e.config?.flowchart?.rankSpacing || e.rankSpacing,
		marginx: 8,
		marginy: 8
	}).setDefaultEdgeLabel(function() {
		return {};
	}), a = t.select("g");
	i(a, e.markers, e.type, e.diagramId), s(), c(), u(), b(), e.nodes.forEach((e) => {
		r.setNode(e.id, { ...e }), e.parentId && r.setParent(e.id, e.parentId);
	}), n.debug("Edges:", e.edges), e.edges.forEach((e) => {
		if (e.start === e.end) {
			let t = e.start, n = t + "---" + t + "---1", i = t + "---" + t + "---2", a = r.node(t);
			r.setNode(n, {
				domId: n,
				id: n,
				parentId: a.parentId,
				labelStyle: "",
				label: "",
				padding: 0,
				shape: "labelRect",
				style: "",
				width: 10,
				height: 10
			}), r.setParent(n, a.parentId), r.setNode(i, {
				domId: i,
				id: i,
				parentId: a.parentId,
				labelStyle: "",
				padding: 0,
				shape: "labelRect",
				label: "",
				style: "",
				width: 10,
				height: 10
			}), r.setParent(i, a.parentId);
			let o = structuredClone(e), s = structuredClone(e), c = structuredClone(e), l = structuredClone(e);
			s.originalEdge = o, s.selfLoop = {
				id: o.id,
				order: 0
			}, c.originalEdge = o, c.selfLoop = {
				id: o.id,
				order: 1
			}, l.originalEdge = o, l.selfLoop = {
				id: o.id,
				order: 2
			}, s.label = "", s.arrowTypeEnd = "none", s.endLabelLeft = "", s.endLabelRight = "", s.startLabelLeft = "", s.id = t + "-cyclic-special-1", c.startLabelRight = "", c.startLabelLeft = "", c.endLabelLeft = "", c.endLabelRight = "", c.arrowTypeStart = "none", c.arrowTypeEnd = "none", c.id = t + "-cyclic-special-mid", l.label = "", l.startLabelRight = "", l.startLabelLeft = "", l.arrowTypeStart = "none", a.isGroup && (s.fromCluster = t, l.toCluster = t), l.id = t + "-cyclic-special-2", l.arrowTypeStart = "none", r.setEdge(t, n, s, t + "-cyclic-special-0"), r.setEdge(n, i, c, t + "-cyclic-special-1"), r.setEdge(i, t, l, t + "-cyclic-special-2");
		} else r.setEdge(e.start, e.end, { ...e }, e.id);
	}), n.warn("Graph at first:", JSON.stringify(x(r))), C(r), n.warn("Graph after XAX:", JSON.stringify(x(r)));
	let o = m();
	await j(a, r, e.type, e.diagramId, void 0, o);
}, "render");
//#endregion
export { A as getEdgesToRender, M as render };
