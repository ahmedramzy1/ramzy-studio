import "./excalidraw-utils-BOlRvSWI.mjs";
import { n as e, r as t } from "./chunk-Z5NKEFVG-C9FOP92K.mjs";
//#region ../../node_modules/.pnpm/@excalidraw+excalidraw@0.18.0-3a5ef40_@types+react-dom@19.2.3_@types+react@19.2.17__@ty_b5c0bb913e6bf58bb5b24f479fd5a57a/node_modules/@excalidraw/excalidraw/dist/prod/subset-worker.chunk.js
var n = import.meta.url ? new URL(import.meta.url) : void 0;
typeof window > "u" && typeof self < "u" && (self.onmessage = async (n) => {
	switch (n.data.command) {
		case e.Subset:
			let r = await t(n.data.arrayBuffer, n.data.codePoints);
			self.postMessage(r, { transfer: [r] });
			break;
	}
});
//#endregion
export { n as WorkerUrl };
