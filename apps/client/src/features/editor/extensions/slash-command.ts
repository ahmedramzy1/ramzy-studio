import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import renderItems from '@/features/editor/components/slash-menu/render-items';
import getSuggestionItems from '@/features/editor/components/slash-menu/menu-items';
import { openTableSizePicker } from '@/features/editor/components/slash-menu/open-table-size-picker';

export const slashMenuPluginKey = new PluginKey('slash-command');

const getRamzySuggestionItems = (options: any) => {
  const groups = getSuggestionItems(options);

  return Object.fromEntries(
    Object.entries(groups).map(([group, items]) => [
      group,
      (items as any[]).map((item) => {
        if (item.title !== 'Table') return item;

        // Override the actual Table item's command at the source. This keeps
        // the picker working regardless of whether selection came from mouse,
        // Enter, or TipTap's suggestion lifecycle.
        return {
          ...item,
          command: ({ editor, range }: any) => {
            openTableSizePicker(editor, range);
          },
        };
      }),
    ]),
  );
};

// @ts-ignore
const Command = Extension.create({
  name: 'slash-command',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range, props });
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          // Disable slash menu inside code blocks
          if ($from.parent.type.name === 'codeBlock') {
            return false;
          }
          return true;
        },
      } as Partial<SuggestionOptions>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: slashMenuPluginKey,
        ...this.options.suggestion,
        editor: this.editor,
      }),
    ];
  },
});

const SlashCommand = Command.configure({
  suggestion: {
    items: getRamzySuggestionItems,
    render: renderItems,
  },
});

export { Command as SlashCommandExtension };
export default SlashCommand;
