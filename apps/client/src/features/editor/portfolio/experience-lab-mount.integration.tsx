import React, { StrictMode } from 'react';
import { readFileSync } from 'node:fs';
import { it, vi, expect } from 'vitest';
import { render, act, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Editor } from '@tiptap/core';
import { RamzyStudioPortfolioEditor } from './portfolio-editor';

// Keep real MutationObservers and ProseMirror DOM reconciliation. The limit
// turns a microtask loop into an assertion failure instead of hanging CI.
function watchMutationLoops() {
  const NativeObserver = globalThis.MutationObserver;
  const counts: number[] = [];
  const observers: MutationObserver[] = [];
  let runaway = false;
  vi.stubGlobal('MutationObserver', class extends NativeObserver {
    constructor(callback: MutationCallback) {
      const index = counts.push(0) - 1;
      super((records, observer) => {
        if (++counts[index] > 100) {
          runaway = true;
          for (const active of observers) active.disconnect();
          return;
        }
        if (!runaway) callback(records, observer);
      });
      observers.push(this);
    }
  });
  return () => expect(runaway, `DOM observer loop: ${counts.join(', ')}`).toBe(false);
}

function labDocument() {
  const fixture = JSON.parse(readFileSync('../server/src/collaboration/fixtures/experience-lab.template.json', 'utf8'));
  function resolve(value: any): any {
    if (Array.isArray(value)) return value.map(resolve);
    if (value && typeof value === 'object') {
      if (value.$media) return value.field === 'size' ? 100 : value.field === 'id'
        ? '11111111-1111-4111-8111-111111111111'
        : `/api/files/11111111-1111-4111-8111-111111111111/${value.$media}`;
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolve(child)]));
    }
    return value;
  }
  return resolve({ type: 'doc', content: [
    ...fixture.chapters.flatMap((chapter: any) => chapter.nodes),
    { type: 'footnotes', content: fixture.footnotes },
  ] });
}

it.each([true, false])('mounts all Experience Lab chapters and switches tabs (editable=%s)', async (editable) => {
  const assertSettled = watchMutationLoops();
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
    matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  })));
  let editor: Editor | null = null;
  try {
    render(<StrictMode><MemoryRouter><RamzyStudioPortfolioEditor
      pageId="experience-lab-test"
      initialContent={labDocument()}
      editable={editable}
      onEditorChange={value => { editor = value; }}
      session={{ accessToken: 'test', user: { id: 'test', name: 'Test' }, apiUrl: 'http://localhost/api', collaborationUrl: '' } as any}
    /></MemoryRouter></StrictMode>);
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 200)); });
    assertSettled();
    expect(editor).toBeTruthy();
    expect(document.querySelectorAll('.tiptap h1')).toHaveLength(11);
    const tabs = document.querySelector('[data-type="tabs"]')!;
    const panels = () => Array.from(tabs.querySelector('[data-tabs-content]')!.children) as HTMLElement[];
    const original = editor!.getJSON();
    fireEvent.mouseDown(tabs.querySelector('[data-tab-index="1"]')!);
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 60)); });
    assertSettled();
    expect(panels()[0].style.display).toBe('none');
    expect(panels()[1].style.display).toBe('block');
    expect(panels()[1].getAttribute('aria-hidden')).toBe('false');
    expect(editor!.getJSON()).toEqual(original);
  } finally {
    cleanup();
    // TipTap defers destruction; keep browser shims until it has completed.
    await new Promise(resolve => setTimeout(resolve, 100));
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  }
}, 15000);
