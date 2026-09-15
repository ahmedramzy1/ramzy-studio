import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Tabs } from '../../../../../../packages/editor-ext/src/lib/tabs/tabs';
import { TabPanel } from '../../../../../../packages/editor-ext/src/lib/tabs/tab-panel';
import { afterEach, expect, it, vi } from 'vitest';

let editor: Editor;
const tick = () => new Promise(resolve => setTimeout(resolve, 60));
function mount() {
  const element = document.createElement('div');
  document.body.append(element);
  editor = new Editor({ element, extensions: [Document, Paragraph, Text, Tabs, TabPanel], content: {
    type: 'doc', content: [{ type: 'tabs', content: ['First', 'Second'].map(label => ({
      type: 'tabPanel', attrs: { label }, content: [{ type: 'paragraph', content: [{ type: 'text', text: label + ' body' }] }],
    })) }],
  } });
  return element;
}
afterEach(() => { editor?.destroy(); document.body.replaceChildren(); vi.restoreAllMocks(); });

it('does not ignore text edits inside a tab panel', async () => {
  const element = mount();
  await tick();
  const text = element.querySelector('[data-tab-panel] p')!.firstChild!;
  text.nodeValue = 'Edited in the browser';
  await tick();
  expect(editor.state.doc.textContent).toContain('Edited in the browser');
});

it('reconciles renamed, inserted and removed panels without replacing unchanged panels', async () => {
  const element = mount();
  await tick();
  const first = element.querySelector('[data-tab-panel]');
  const input = element.querySelector('input[aria-label="Tab 2 label"]') as HTMLInputElement;
  input.value = 'Renamed';
  input.dispatchEvent(new Event('change', { bubbles: true }));
  await tick();
  expect(editor.state.doc.firstChild!.child(1).attrs.label).toBe('Renamed');
  expect(element.querySelector('[data-tab-panel]')).toBe(first);
  const tabs = editor.state.doc.firstChild!;
  editor.view.dispatch(editor.state.tr.insert(tabs.nodeSize - 1,
    editor.schema.nodes.tabPanel.create({ label: 'Third' }, editor.schema.nodes.paragraph.create())));
  await tick();
  const panels = element.querySelectorAll<HTMLElement>('[data-tab-panel]');
  expect(panels).toHaveLength(3);
  expect(panels[2].getAttribute('aria-hidden')).toBe('true');
  const end = editor.state.doc.firstChild!.nodeSize - 1;
  editor.view.dispatch(editor.state.tr.delete(end - editor.state.doc.firstChild!.lastChild!.nodeSize, end));
  await tick();
  expect(element.querySelectorAll('[data-tab-panel]')).toHaveLength(2);
  expect(editor.state.doc.textContent).toContain('Second body');
});

it('cancels pending panel work when the editor is destroyed', async () => {
  const cancel = vi.spyOn(window, 'cancelAnimationFrame');
  mount();
  editor.destroy();
  expect(cancel).toHaveBeenCalled();
  await tick();
});
