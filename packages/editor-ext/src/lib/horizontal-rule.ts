import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { mergeAttributes } from '@tiptap/core';

export interface PortfolioHorizontalRuleAttributes {
  style?: 'solid' | 'dashed' | 'dotted';
  thickness?: 1 | 2 | 4;
  width?: 25 | 50 | 75 | 100;
  color?: 'default' | 'muted' | 'accent';
  spacing?: 'compact' | 'standard' | 'wide';
}

export const PortfolioHorizontalRule = HorizontalRule.extend({
  addAttributes() {
    return {
      style: {
        default: 'solid',
        parseHTML: (element) => element.getAttribute('data-style') || 'solid',
        renderHTML: (attributes: PortfolioHorizontalRuleAttributes) => ({
          'data-style': attributes.style || 'solid',
        }),
      },
      thickness: {
        default: 1,
        parseHTML: (element) =>
          Number(element.getAttribute('data-thickness') || 1),
        renderHTML: (attributes: PortfolioHorizontalRuleAttributes) => ({
          'data-thickness': attributes.thickness || 1,
        }),
      },
      width: {
        default: 100,
        parseHTML: (element) =>
          Number(element.getAttribute('data-width') || 100),
        renderHTML: (attributes: PortfolioHorizontalRuleAttributes) => ({
          'data-width': attributes.width || 100,
        }),
      },
      color: {
        default: 'default',
        parseHTML: (element) => element.getAttribute('data-color') || 'default',
        renderHTML: (attributes: PortfolioHorizontalRuleAttributes) => ({
          'data-color': attributes.color || 'default',
        }),
      },
      spacing: {
        default: 'standard',
        parseHTML: (element) =>
          element.getAttribute('data-spacing') || 'standard',
        renderHTML: (attributes: PortfolioHorizontalRuleAttributes) => ({
          'data-spacing': attributes.spacing || 'standard',
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const color =
      HTMLAttributes['data-color'] === 'accent'
        ? 'var(--mantine-primary-color-filled)'
        : HTMLAttributes['data-color'] === 'muted'
          ? 'var(--mantine-color-dimmed)'
          : 'var(--mantine-color-default-border)';
    const spacing =
      HTMLAttributes['data-spacing'] === 'wide'
        ? 48
        : HTMLAttributes['data-spacing'] === 'compact'
          ? 16
          : 32;
    return [
      'hr',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: [
          `border:0`,
          `border-top:${Number(HTMLAttributes['data-thickness'] || 1)}px ${HTMLAttributes['data-style'] || 'solid'} ${color}`,
          `width:${Number(HTMLAttributes['data-width'] || 100)}%`,
          `margin:${spacing}px auto`,
        ].join(';'),
      }),
    ];
  },
});
