$ErrorActionPreference = "Stop"

$extensionsPath = "apps/client/src/features/editor/extensions/extensions.ts"
$menuPath = "apps/client/src/features/editor/components/slash-menu/menu-items.ts"

$extensions = Get-Content $extensionsPath -Raw

if ($extensions -notmatch 'features/editor/extensions/tabs') {
  $anchor = 'import { CleanStyles } from "@/features/editor/extensions/clean-styles.ts";'
  if (-not $extensions.Contains($anchor)) {
    throw "Could not find the extensions import anchor."
  }
  $extensions = $extensions.Replace(
    $anchor,
    $anchor + "`r`n" + 'import { Tabs, Tab } from "@/features/editor/extensions/tabs";'
  )
}

if ($extensions -notmatch '(?m)^  Tabs,$') {
  $anchor = "  Columns,`r`n  Column,`r`n  Footnotes,"
  if (-not $extensions.Contains($anchor)) {
    $anchor = "  Columns,`n  Column,`n  Footnotes,"
  }
  if (-not $extensions.Contains($anchor)) {
    throw "Could not find the mainExtensions columns anchor."
  }
  $replacement = $anchor.Replace("  Footnotes,", "  Tabs,`r`n  Tab,`r`n  Footnotes,")
  $extensions = $extensions.Replace($anchor, $replacement)
}

Set-Content $extensionsPath $extensions -NoNewline

$menu = Get-Content $menuPath -Raw
if ($menu -notmatch 'title: "Tabs"') {
  $anchor = '    {' + "`r`n" + '      title: "Toggle block",'
  if (-not $menu.Contains($anchor)) {
    $anchor = '    {' + "`n" + '      title: "Toggle block",'
  }
  if (-not $menu.Contains($anchor)) {
    throw "Could not find the slash-menu Toggle block anchor."
  }

  $tabsItem = @'
    {
      title: "Tabs",
      description: "Organize content into switchable tabs.",
      searchTerms: ["tabs", "tabbed", "sections", "switch"],
      icon: IconAppWindow,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTabs({ count: 3 })
          .run(),
    },
'@

  $menu = $menu.Replace($anchor, $tabsItem + $anchor)
}

Set-Content $menuPath $menu -NoNewline

if (Test-Path $MyInvocation.MyCommand.Path) {
  Remove-Item $MyInvocation.MyCommand.Path -Force
}

git add $extensionsPath $menuPath ramzy-tabs-bootstrap.ps1
git commit -m "feat(editor): register Ramzy tabs block"
git push
