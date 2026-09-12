import { describe, expect, it } from "vitest";
import { Editor, getSchema } from "@tiptap/core";
import { DOMSerializer } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import { FootnoteReference } from "@docmost/editor-ext";

describe("footnote DOM rendering", () => {
  it.each([1, "1", null])(
    "mounts and serializes reference %s",
    (referenceNumber) => {
      const editor = new Editor({
        extensions: [StarterKit, FootnoteReference],
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "footnoteReference",
                  attrs: { "data-id": "reference", referenceNumber },
                },
              ],
            },
          ],
        },
      });
      try {
        expect(editor.view.dom.querySelector("sup a")?.textContent).toBe(
          referenceNumber == null ? "" : String(referenceNumber),
        );
        expect(() => editor.getHTML()).not.toThrow();
      } finally {
        editor.destroy();
      }
    },
  );
});

import { readFileSync } from "node:fs";
import { mainExtensions } from "../extensions/extensions";
import { Tabs, TabPanel } from "@docmost/editor-ext";

it("serializes the complete imported Experience Lab through the client DOM schema", () => {
  const fixture = JSON.parse(
    readFileSync(
      "../server/src/collaboration/fixtures/experience-lab.template.json",
      "utf8",
    ),
  );
  function resolve(value: any): any {
    if (Array.isArray(value)) return value.map(resolve);
    if (value && typeof value === "object") {
      if (value.$media)
        return value.field === "size"
          ? 100
          : value.field === "id"
            ? "11111111-1111-4111-8111-111111111111"
            : "/api/files/11111111-1111-4111-8111-111111111111/" + value.$media;
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, resolve(v)]),
      );
    }
    return value;
  }
  const schema = getSchema([...mainExtensions, Tabs, TabPanel]);
  const json = resolve({
    type: "doc",
    content: [
      ...fixture.chapters.flatMap((c: any) => c.nodes),
      { type: "footnotes", content: fixture.footnotes },
    ],
  });
  const doc = schema.nodeFromJSON(json);
  doc.check();
  const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
    doc.content,
  );
  expect(fragment.querySelector("sup a")?.textContent).toBe("1");
});
