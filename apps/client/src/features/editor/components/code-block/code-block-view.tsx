import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { ActionIcon, Group, Select, Tooltip } from "@mantine/core";
import { CopyButton } from "@/components/common/copy-button";
import { useEffect, useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import classes from "./code-block.module.css";
import React from "react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const MermaidView = React.lazy(
  () => import("@/features/editor/components/code-block/mermaid-view.tsx"),
);

export default function CodeBlockView(props: NodeViewProps) {
  const { t } = useTranslation();
  const { node, updateAttributes, extension, editor, getPos } = props;
  const { language, wrap, lineNumbers, theme, collapsed } = node.attrs;
  const [languageValue, setLanguageValue] = useState<string | null>(
    language || null,
  );
  const [isSelected, setIsSelected] = useState(false);
  const portfolioMode = editor.view.dom.classList.contains(
    "ramzy-portfolio-editor",
  );

  useEffect(() => {
    const updateSelection = () => {
      const { state } = editor;
      const { from, to } = state.selection;
      // Check if the selection intersects with the node's range
      const isNodeSelected =
        (from >= getPos() && from < getPos() + node.nodeSize) ||
        (to > getPos() && to <= getPos() + node.nodeSize);
      setIsSelected(isNodeSelected);
    };

    editor.on("selectionUpdate", updateSelection);
    return () => {
      editor.off("selectionUpdate", updateSelection);
    };
  }, [editor, getPos(), node.nodeSize]);

  function changeLanguage(language: string) {
    setLanguageValue(language);
    updateAttributes({
      language: language,
    });
  }

  return (
    <NodeViewWrapper
      className="codeBlock"
      data-code-theme={theme === "light" ? "light" : "dark"}
      style={{
        background: theme === "light" ? "#f6f7f9" : undefined,
        color: theme === "light" ? "#202124" : undefined,
        borderRadius: 8,
      }}
    >
      {!portfolioMode && (
        <Group
          justify="flex-end"
          contentEditable={false}
          className={classes.menuGroup}
        >
          <Select
            placeholder="auto"
            checkIconPosition="right"
            data={extension.options.lowlight.listLanguages().sort()}
            value={languageValue}
            onChange={changeLanguage}
            searchable
            style={{ maxWidth: "130px" }}
            classNames={{ input: classes.selectInput }}
            disabled={!editor.isEditable}
          />

          <CopyButton value={node?.textContent} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? t("Copied") : t("Copy")}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      )}

      <pre
        spellCheck="false"
        style={{
          display: lineNumbers ? "flex" : undefined,
          maxHeight: collapsed ? 240 : undefined,
          overflow: collapsed ? "auto" : undefined,
          whiteSpace: wrap ? "pre-wrap" : "pre",
          overflowWrap: wrap ? "anywhere" : undefined,
        }}
        hidden={
          ((language === "mermaid" && !editor.isEditable) ||
            (language === "mermaid" && !isSelected)) &&
          node.textContent.length > 0
        }
      >
        {lineNumbers && (
          <span
            contentEditable={false}
            aria-hidden="true"
            style={{
              display: "block",
              paddingRight: 14,
              marginRight: 14,
              borderRight: "1px solid rgba(127,127,127,.25)",
              textAlign: "right",
              userSelect: "none",
              opacity: 0.48,
            }}
          >
            {Array.from(
              { length: Math.max(1, node.textContent.split("\n").length) },
              (_, index) => `${index + 1}\n`,
            )}
          </span>
        )}
        {/* @ts-ignore */}
        <NodeViewContent
          as={"code" as any}
          className={`language-${language}`}
          style={{ flex: lineNumbers ? 1 : undefined, minWidth: 0 }}
        />
      </pre>

      {language === "mermaid" && (
        <Suspense fallback={null}>
          <MermaidView props={props} />
        </Suspense>
      )}
    </NodeViewWrapper>
  );
}
