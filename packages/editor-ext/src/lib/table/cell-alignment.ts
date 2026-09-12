import type { Attribute } from '@tiptap/core';

function alignmentAttribute(
  name: 'textAlign' | 'verticalAlign',
  cssName: string,
  values: readonly string[],
): Attribute {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => {
      const value = element.style[name];
      return values.includes(value) ? value : null;
    },
    renderHTML: (attributes) => {
      const value = attributes[name];
      return values.includes(value) ? { style: `${cssName}: ${value}` } : {};
    },
  };
}

// The same schema is consumed by editing, readonly rendering and collaboration.
export function cellAlignmentAttributes() {
  return {
    textAlign: alignmentAttribute('textAlign', 'text-align', [
      'left',
      'center',
      'right',
      'justify',
      'start',
      'end',
    ]),
    verticalAlign: alignmentAttribute('verticalAlign', 'vertical-align', [
      'top',
      'middle',
      'bottom',
    ]),
  };
}
