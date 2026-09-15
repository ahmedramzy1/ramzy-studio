import { NodeViewProps } from "@tiptap/react";
import { useEffect, useState } from "react";
import mermaid from "mermaid";
import { v4 as uuidv4 } from "uuid";
import classes from "./code-block.module.css";
import { useTranslation } from "react-i18next";
import { useComputedColorScheme } from "@mantine/core";
import DOMPurify from "dompurify";

interface MermaidViewProps {
  props: NodeViewProps;
  colorScheme?: "light" | "dark";
}

export default function MermaidView({ props, colorScheme }: MermaidViewProps) {
  const { t } = useTranslation();
  const hostTheme = useComputedColorScheme("light");
  const computedColorScheme = colorScheme ?? hostTheme;
  const { node } = props;
  const [preview, setPreview] = useState<string>("");

  // Update Mermaid config when theme changes.
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      suppressErrorRendering: true,
      theme: computedColorScheme === "light" ? "default" : "dark",
    });
  }, [computedColorScheme]);

  // Re-render the diagram whenever the node content or theme changes.
  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${uuidv4()}`;
    if (node.textContent.length > 0) {
      mermaid
        .render(id, node.textContent)
        .then((item) => {
          if (!cancelled) setPreview(item.svg);
        })
        .catch((err) => {
          if (cancelled) return;
          if (props.editor.isEditable) {
            setPreview(
              `<div class="${classes.error}">${t("Mermaid diagram error:")} ${DOMPurify.sanitize(err)}</div>`,
            );
          } else {
            setPreview(
              `<div class="${classes.error}">${t("Invalid Mermaid diagram")}</div>`,
            );
          }
        });
    }
    return () => { cancelled = true; };
  }, [node.textContent, computedColorScheme]);

  return (
    <div
      className={classes.mermaid}
      contentEditable={false}
      dangerouslySetInnerHTML={{ __html: preview }}
    ></div>
  );
}
