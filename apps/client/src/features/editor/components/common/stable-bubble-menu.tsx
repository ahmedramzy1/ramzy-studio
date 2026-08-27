import { BubbleMenu, type BubbleMenuProps } from "@tiptap/react/menus";
import React, { forwardRef, useCallback, useRef } from "react";

export type { BubbleMenuProps };

/**
 * TipTap's BubbleMenu registers a ProseMirror plugin in an effect whose
 * dependencies include options and positioning callbacks. Editor menus render
 * on every transaction, so inline objects/callbacks otherwise cause continuous
 * plugin teardown/re-registration and event-listener growth.
 *
 * Keep the identities passed to TipTap stable while forwarding the latest
 * values through refs.
 */
export const StableBubbleMenu = forwardRef<HTMLDivElement, BubbleMenuProps>(
  function StableBubbleMenu(props, forwardedRef) {
    const shouldShowRef = useRef(props.shouldShow);
    shouldShowRef.current = props.shouldShow;

    const getReferenceRef = useRef(props.getReferencedVirtualElement);
    getReferenceRef.current = props.getReferencedVirtualElement;

    const optionsRef = useRef(props.options ? { ...props.options } : undefined);
    if (props.options) {
      if (!optionsRef.current) optionsRef.current = {};
      for (const key of Object.keys(optionsRef.current)) {
        if (!(key in props.options)) {
          delete (optionsRef.current as Record<string, unknown>)[key];
        }
      }
      Object.assign(optionsRef.current, props.options);
    } else {
      optionsRef.current = undefined;
    }

    const stableShouldShow = useCallback(
      (...args: Parameters<NonNullable<BubbleMenuProps["shouldShow"]>>) =>
        shouldShowRef.current?.(...args) ?? false,
      [],
    );

    const stableGetReferencedVirtualElement = useCallback(
      (...args: Parameters<
        NonNullable<BubbleMenuProps["getReferencedVirtualElement"]>
      >) => getReferenceRef.current?.(...args),
      [],
    );

    return (
      <BubbleMenu
        {...props}
        ref={forwardedRef}
        shouldShow={props.shouldShow ? stableShouldShow : undefined}
        getReferencedVirtualElement={
          props.getReferencedVirtualElement
            ? stableGetReferencedVirtualElement
            : undefined
        }
        options={optionsRef.current}
      />
    );
  },
);
