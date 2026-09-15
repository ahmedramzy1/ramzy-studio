import type { ReactNode } from "react";
import { Button } from "@mantine/core";
import classes from "./collection-shell.module.css";

export function CollectionFrame({
  children,
  dropActive = false,
}: {
  children: ReactNode;
  dropActive?: boolean;
}) {
  return (
    <div className={classes.frame} data-drop-active={dropActive || undefined}>
      {children}
    </div>
  );
}

export function CollectionTitle({
  value,
  editable,
  label,
  onChange,
}: {
  value: string;
  editable: boolean;
  label: string;
  onChange: (value: string) => void;
}) {
  if (!editable && !value.trim()) return null;
  return (
    <div className={classes.header} contentEditable={false}>
      {editable ? (
        <input
          className={classes.title}
          aria-label={label}
          placeholder={`${label}…`}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      ) : (
        <div className={classes.title}>{value}</div>
      )}
    </div>
  );
}

export function CollectionEmpty({
  label,
  helper,
  uploading,
  onAdd,
}: {
  label: string;
  helper: string;
  uploading: boolean;
  onAdd: () => void;
}) {
  return (
    <div
      className={classes.empty}
      contentEditable={false}
      aria-busy={uploading}
    >
      <Button onClick={onAdd} loading={uploading} className={classes.add}>
        {label}
      </Button>
      <div className={classes.helper} role="status">
        {uploading ? "Uploading…" : helper}
      </div>
    </div>
  );
}

export function CollectionFeedback({ message }: { message: string }) {
  return message ? (
    <div className={classes.feedback} role="alert" contentEditable={false}>
      {message}
    </div>
  ) : null;
}
