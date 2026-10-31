# Checklist B1: c2e7e88ae4425469f7d64d85d5509a5e8cd91bcc vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | rename KanbanBoard.tsx → BoardPage.tsx (70% similarity); BoardPage.tsx:124-131 renders `flex flex-col h-full` › BoardHeader › ProgressDashboard › `flex-1 min-h-0`; BoardScreen.tsx deleted |
| 2 | Route renders `<BoardPage …/>`; `EmptyBoard` with no plan | ✓ | src/app/kanban/page.tsx:20 `return <BoardPage {...board} />;`, :14 EmptyBoard branch unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | BoardPageContext.ts `{pullToTodo}`; BoardPage.tsx:69-72; MobileBacklogCard.tsx props `{card}`, `useBoardPageContext()` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | boardCardUtils.ts, BoardColumn, DesktopBacklog, MobileBacklog(+Panel): doc comments only (KanbanBoard → BoardPage) |
| 5 | Console: both board tabs render `BoardPage`; sheet frame and gallery card in inert context | ✓ | scenarios/board/page.tsx:44, :57 `<BoardPage`; MobileBacklogSheetFrame.tsx:27 and DomainTab.tsx:172 `<BoardPageContext value={inertBoardPageContext()}>` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; `PrioritiesScreen` deleted | ✓ | rename PriorityMatrixPage.tsx → PrioritiesPage.tsx; PrioritiesPage.tsx:349-350 `flex flex-col h-full` + `<BoardHeader periodKey={periodKey} />`; PrioritiesScreen.tsx deleted |
| 7 | `periodKey` fallback → utils adapter, called by route, unit-tested; `matrixService` unchanged | ✓ | oneOffUtils.ts:41 `toPrioritiesPageProps({tasks, activePlan}, today)`; priorities/page.tsx:9; oneOffUtils.test.ts `describe('toPrioritiesPageProps')` (2 cases); no diff under src/services |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in oneOffUtils.ts with tests; `isTracked` in one place | ✓ | oneOffUtils.ts:52, :68; tests in oneOffUtils.test.ts; the base's two inline copies (PriorityMatrixPage:78, QuadrantCell:120) and the `useMemo` grouping are gone; callers (PrioritiesPage:89, MatrixTaskCard:38, MoveToRows:71) all use the helper |
| 9 | `PrioritiesPageContext` fields (activePlanId, popover, sheet, add, track, complete) | ✓ | PrioritiesPageContext.ts: activePlanId · openPopoverTaskId · togglePopover · openMoveToSheet · openAddTask · trackTask · completeTask |
| 10 | Props QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | quadrant·tasks / task·index / task / task·variant / task·onClose / task |
| 11 | Overlays keep their props; click-away layer in container | ✓ | MatrixUndoToast and Toast are untouched; the TaskModal call keeps the same 6 props (`onSaved` now a named `handleTaskSaved`); click-away at PrioritiesPage.tsx:356-361 |
| 12 | Console: 7 tabs render `PrioritiesPage`; sheet scenario and gallery card in inert context | ✓ | scenarios/priorities/page.tsx:27, 33, 47, 61, 67, 83, 94; MobileMoveToPanelScenario.tsx:26; DomainTab.tsx:221 `inertPrioritiesPageContext(MATRIX_CARD_ACTIVE_PLAN_ID)`; fixtures go through `toPrioritiesPageProps` and `isTracked` now comes from `planId` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` provides capture, captureError, loadMore | ✓ | DumpPage.tsx (new) / DumpScreen.tsx deleted; DumpPageContext.ts the three fields; DumpPage.tsx `const pageContext = {capture, captureError, loadMore}` |
| 14 | Route unpacking + `periodKey` → utils adapter with unit test; no new action/service | ✓ | dump.ts:41 `toDumpPageProps(feed, totalCount, today)`; dump/page.tsx:16; dump.test.ts `describe('toDumpPageProps')` (success + error branch); no diff in actions/services |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | scenarios/dump/page.tsx:18, :27, both through `toDumpPageProps` |
| 16 | No feature component takes a callback prop (overlays/frames excepted) | ✓ | The only `on*` props left in board/priorities/dump: MobileBacklogPanel.onClose (inside the MobileBacklog frame), MatrixUndoToast.onUndo/onDismiss and MobileMoveToSheet.onClose (overlays) |
| 17 | Context files, hook names, inert helpers follow one pattern = Projects | ✓ | Each `<Feature>PageContext.ts` has `createContext<…Value \| null>(null)`, `use<Feature>PageContext` built on `use()`, and a throw "must be used within <Feature>Page"; container builds `const pageContext: …Value`; `inertBoardPageContext()`, `inertPrioritiesPageContext(activePlanId)` in design/constants.ts next to `inertProjectsPageContext`. Dump has no inert helper, and no specimen needs one |
| 18 | Nothing outside the plan changed | ✓ | No diff in Plan, auth, app shell, services, actions or DAL. Small spill-over: TaskModalPanel.tsx import path (FALLBACK_QUADRANT moved), useDumpFeed.ts (type import and a comment), AGENTS.md "Production first" example renamed, design/README.md console rule |
| 19 | Docs: spike archived + links; tracker 3 sub-items removed; AGENTS.md sentence; README Update Log; baseline Board part | ~ | Spike **not archived**: `design/spike/component-structure.md` is still at top level and the spike file is not in the diff. Instead a tracker item was added: "Archive the component-structure spike … once the comparison's report is in". Tracker: the parent and its 4 sub-bullets were replaced by that item ✓. AGENTS.md:132 "the Plan page, not on it yet: tracker › Week model Phase 2 › Plan week" ✓. README 2026-10-27 entry ✓. baseline.md:282-286 BoardPage plus the "every page but Plan" line ✓. The `'use client'` half-sentence was dropped from Uniform page header ✓ |
| 20 | One commit per page + one docs commit | ✓ | 4a8c8ec Board · 5235c3d Dump · 4bc02b6 Priorities · c2e7e88 Docs; linear, no merges |

**Score: 19 ✓ · 1 ~ · 0 ✗**

## Props observed (candidate, base in parentheses)

- QuadrantCell: 2 (9)
- MatrixTaskCard: 2 (9)
- MoveToPopover: 1 (4)
- MoveToRows: 2 (5)
- MobileMoveToSheet: 2 (6)
- MobileMoveToPanel: 1 (5)
- DumpComposer: 0 (2)
- DumpFeed: 3 (4)
- MobileBacklogCard: 1 (2)

## Files outside the plan

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx`: import of `FALLBACK_QUADRANT` now from `@/utils/oneOffUtils`. The constant moved out of `priorities/constants.ts` into utils, which the plan doesn't mention.
- `src/hooks/useDumpFeed.ts`: local `DumpFeedInit` replaced by `InitialDumpFeed` from `utils/dump.ts`, plus a comment rename.
- Comment-only renames in `BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx`, `MobileBacklogPanel.tsx`, `boardCardUtils.ts`.
- `AGENTS.md` UI Workflow "Bad: `initialUndoToastTaskId` on `PrioritiesPage`" (rename), `src/app/design/README.md` (page-context rule extended to route adapters), README Current State Design Console line.
- None in Plan, auth, app shell, services, actions or DAL.

## Where the page data types live

- Board: `BoardData` in `src/types/board.ts` (pre-existing, unchanged)
- Projects (reference): `ProjectsPageData` in `src/types/projects.ts`
- Priorities: `PrioritiesPageData` in `src/utils/oneOffUtils.ts` (new; `{tasks, activePlanId, periodKey}`)
- Dump: `DumpPageData` extends `InitialDumpFeed` extends (private) `DumpFeedPage` in `src/utils/dump.ts` (new)
- So the two new types sit in `utils/` next to their adapters, while the existing ones live in `types/`.

## Possible bugs

None seen. Notes:
- `src/utils/oneOffUtils.ts` now has `import type {MatrixData} from '@/services/matrixService'`. At base, nothing in `utils/` imported from services. It is type-only, so it is erased and breaks no rule, but a client-safe util now depends on a service type.
- `PrioritiesPage` takes `activePlanId` rather than `activePlan` (the adapter unwraps `.id`). The plan doesn't specify this; it is consistent with the context.
- `toDumpPageProps` is a `function` declaration, while `toPrioritiesPageProps` is a const arrow. This is a minor style mismatch.
- The README Update Log claims 26 e2e tests, a 16/16 click-through and a ui-verifier pass. None of this can be checked from git.
