// Optional real-browser geometry regression. Install Playwright or set RAMZY_PLAYWRIGHT_MODULE.
// Set RAMZY_CHROMIUM_EXECUTABLE for an existing browser; RAMZY_LAYOUT_BASELINE enables before/after evidence.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
const { chromium } = await import(
  process.env.RAMZY_PLAYWRIGHT_MODULE || "playwright"
);
const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(root + "/apps/client/package.json");
const postcss = require("postcss"),
  preset = require("postcss-preset-mantine"),
  vars = require("postcss-simple-vars"),
  ts = require("typescript");
const read = (file, before) =>
  before
    ? execFileSync(
        "git",
        ["show", (process.env.RAMZY_LAYOUT_BASELINE || "HEAD") + ":" + file],
        { cwd: root, encoding: "utf8" },
      )
    : readFileSync(root + "/" + file, "utf8");
const styles = [
  "core",
  "table",
  "columns",
  "portfolio-typography",
  "portfolio-elements",
];
const browser = await chromium.launch({
  executablePath: process.env.RAMZY_CHROMIUM_EXECUTABLE,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
const table = (n) =>
  `<div class="tableWrapper ramzy-rounded-table"><table style="width:${n * 350}px"><colgroup>${'<col style="width:350px">'.repeat(n)}</colgroup><tbody><tr>${Array.from({ length: n }, (_, i) => `<th><p>Header ${i}</p></th>`).join("")}</tr>${["Desktop", "iPad", "Phone"].map((x) => `<tr>${Array.from({ length: n }, (_, i) => `<td><p>${i === 0 ? x : "Pending"}</p></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const results = [];
for (const before of process.env.RAMZY_LAYOUT_BASELINE
  ? [true, false]
  : [false]) {
  await page.goto("about:blank");
  const css = (
    await postcss([
      preset(),
      vars({
        variables: {
          "mantine-breakpoint-sm": "48em",
          "mantine-breakpoint-xs": "36em",
          "mantine-breakpoint-md": "62em",
          "mantine-breakpoint-lg": "75em",
          "mantine-breakpoint-xl": "88em",
        },
      }),
    ]).process(
      styles
        .map((s) =>
          read("apps/client/src/features/editor/styles/" + s + ".css", before),
        )
        .join("\n"),
      { from: undefined },
    )
  ).css;
  let src =
    read("packages/editor-ext/src/lib/table/header-pin/offset.ts", before) +
    "\n" +
    read(
      "packages/editor-ext/src/lib/table/header-pin/controller.ts",
      before,
    ).replace(
      /import \{ computePinTop, pinOffsetWatcher \} from ['"]\.\/offset['"];?/,
      "",
    );
  src =
    src.replace(/export /g, "") +
    "\nwindow.TablePinController=TablePinController;";
  const js = ts.transpileModule(src, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.None,
    },
  }).outputText;
  await page.setContent(
    `<style>:root {--mantine-color-default-border:#ddd;--mantine-color-text:#222;--mantine-color-gray-1:#eee;--mantine-color-blue-5:blue;--mantine-line-height-xl:1.55} *{box-sizing:border-box}body{margin:0}.canvas{width:980px;margin:100px auto}.ProseMirror{padding:0!important}</style><style>${css}</style><div class="canvas"><div class="ProseMirror ramzy-portfolio-editor" contenteditable="true"><div id="hover">${table(2)}</div><div data-type="columns"><div data-type="column"><p>Sidebar</p></div><div data-type="column" id="lane"><p>Main narrative</p>${table(2)}</div></div></div></div>`,
  );
  await page.addScriptTag({ content: js });
  const hoverBefore = await page.locator("#hover table").boundingBox();
  await page.evaluate(() =>
    document.querySelectorAll("#hover tr").forEach((row) => {
      const h = document.createElement("div");
      h.className = "column-resize-handle ProseMirror-widget";
      row.cells[0].append(h);
    }),
  );
  const hoverAfter = await page.locator("#hover table").boundingBox();
  await page.evaluate(() => {
    window.ctrl = new window.TablePinController(
      document.querySelector("#lane .tableWrapper"),
      document.querySelector("#lane table"),
    );
  });
  await page.waitForTimeout(150);
  const rows = await page
    .locator("#lane table")
    .evaluate((t) => ({
      tableTop: t.getBoundingClientRect().top,
      headerTop: t.rows[0].getBoundingClientRect().top,
      headerBottom: t.rows[0].getBoundingClientRect().bottom,
      firstTop: t.rows[1].getBoundingClientRect().top,
      width: t.getBoundingClientRect().width,
      lane: document.querySelector("#lane").clientWidth,
    }));
  results.push({
    before,
    hoverDelta: hoverAfter.height - hoverBefore.height,
    rows,
  });
  if (!before) {
    assert.equal(
      hoverAfter.height,
      hoverBefore.height,
      "hover must not change height",
    );
    assert.ok(
      rows.headerTop - rows.tableTop < 2,
      "header must stay at table top",
    );
    assert.ok(
      rows.headerBottom <= rows.firstTop + 1,
      "header must not cover Desktop",
    );
    assert.ok(rows.width <= rows.lane + 1, "table must fit lane");
    await page.evaluate(() => window.ctrl.destroy());
    for (const width of [320, 390, 420, 570])
      for (const n of [1, 2, 3, 5]) {
        await page.locator("#lane").evaluate(
          (lane, { width, html }) => {
            lane.style.flex = `0 0 ${width}px`;
            lane.innerHTML = html;
          },
          { width, html: table(n) },
        );
        const geometry = await page
          .locator("#lane")
          .evaluate((lane) => ({
            lane: lane.clientWidth,
            wrapper: lane.querySelector(".tableWrapper").clientWidth,
            table: lane.querySelector("table").getBoundingClientRect().width,
            scroll: lane.querySelector(".tableWrapper").scrollWidth,
          }));
        assert.ok(geometry.wrapper <= width + 1);
        if (n <= 3)
          assert.ok(
            geometry.table <= width + 1,
            JSON.stringify({ width, n, geometry }),
          );
        else
          assert.ok(
            geometry.scroll > geometry.wrapper,
            "wide table must scroll internally",
          );
      }
  }
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
