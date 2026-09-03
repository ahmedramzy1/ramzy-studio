import { t as e } from "./chunk-jwUa06l-.mjs";
import * as t from "react";
//#region builtin:esm-external-require-react
var n = /* @__PURE__ */ e(((e, n) => {
	n.exports = { ...t };
})), r = /* @__PURE__ */ e(((e) => {
	var t = n();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = t.useState, o = t.useEffect, s = t.useLayoutEffect, c = t.useDebugValue;
	function l(e, t) {
		var n = t(), r = a({ inst: {
			value: n,
			getSnapshot: t
		} }), i = r[0].inst, l = r[1];
		return s(function() {
			i.value = n, i.getSnapshot = t, u(i) && l({ inst: i });
		}, [
			e,
			n,
			t
		]), o(function() {
			return u(i) && l({ inst: i }), e(function() {
				u(i) && l({ inst: i });
			});
		}, [e]), c(n), n;
	}
	function u(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !i(e, n);
		} catch {
			return !0;
		}
	}
	function d(e, t) {
		return t();
	}
	var f = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? d : l;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore;
})), i = /* @__PURE__ */ e(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e, t) {
			return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
		}
		function r(e, t) {
			f || o.startTransition === void 0 || (f = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
			var n = t();
			if (!p) {
				var r = t();
				s(n, r) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), p = !0);
			}
			r = c({ inst: {
				value: n,
				getSnapshot: t
			} });
			var a = r[0].inst, m = r[1];
			return u(function() {
				a.value = n, a.getSnapshot = t, i(a) && m({ inst: a });
			}, [
				e,
				n,
				t
			]), l(function() {
				return i(a) && m({ inst: a }), e(function() {
					i(a) && m({ inst: a });
				});
			}, [e]), d(n), n;
		}
		function i(e) {
			var t = e.getSnapshot;
			e = e.value;
			try {
				var n = t();
				return !s(e, n);
			} catch {
				return !0;
			}
		}
		function a(e, t) {
			return t();
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var o = n(), s = typeof Object.is == "function" ? Object.is : t, c = o.useState, l = o.useEffect, u = o.useLayoutEffect, d = o.useDebugValue, f = !1, p = !1, m = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? a : r;
		e.useSyncExternalStore = o.useSyncExternalStore === void 0 ? m : o.useSyncExternalStore, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), a = /* @__PURE__ */ e(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = r() : t.exports = i();
}));
//#endregion
export { n, a as t };
