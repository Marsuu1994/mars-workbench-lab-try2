# Checklist A2: candidate d723edbb720281255ea0f7cce03923c45726138f (origin/claude/page-structure-try2-a2) vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | git rename KanbanBoard.tsx → BoardPage.tsx (75% similarity); BoardPage renders `flex h-full flex-col` > BoardHeader + ProgressDashboard + `min-h-0 flex-1`; BoardScreen.tsx deleted |
| 2 | Route renders `<BoardPage …/>`; no plan → `EmptyBoard` | ✓ | src/app/kanban/page.tsx:20 `return <BoardPage {...board} />;` with the EmptyBoard branch unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | board/BoardPageContext.ts `{pullToTodo}`; MobileBacklogCard props `{card}`, `const {pullToTodo} = useBoardPageContext()` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | boardCardUtils.ts, BoardColumn, DesktopBacklog, MobileBacklog: only comment lines renamed KanbanBoard → BoardPage |
| 5 | Console: both board tabs → `BoardPage`; `MobileBacklogSheetFrame` and gallery `MobileBacklogCard` wrapped in an inert context | ✓ | scenarios/board/page.tsx two `<BoardPage …>` tabs; MobileBacklogSheetFrame and DomainTab wrap in `<BoardPageContext value={inertBoardPageContext()}>` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; deleted | ✓ | rename PriorityMatrixPage.tsx → PrioritiesPage.tsx; PrioritiesPage.tsx:369-370 `flex flex-col h-full` + `<BoardHeader periodKey={periodKey} />`; PrioritiesScreen.tsx deleted |
| 7 | `periodKey` fallback → adapter in `utils/`, called by route; unit test; `matrixService` unchanged | ✓ | oneOffUtils.ts `toPrioritiesPageProps({tasks, activePlan}, today)`; kanban/priorities/page.tsx `<PrioritiesPage {...toPrioritiesPageProps(matrix, getTodayDate())} />`; oneOffUtils.test.ts two cases; src/services untouched |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in `utils/oneOffUtils.ts` with tests; `isTracked` in one place | ✓ | both exported from oneOffUtils.ts with tests in the new oneOffUtils.test.ts; the predicate is defined once and called by PrioritiesPage (count), MatrixTaskCard and MoveToRows; FALLBACK_QUADRANT moved there too |
| 9 | `PrioritiesPageContext` has all fields | ✓ | PrioritiesPageContext.ts: activePlanId, openPopoverTaskId, togglePopover, openMoveToSheet, openAddTask, trackTask, completeTask |
| 10 | Props: QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | `{quadrant, tasks}`, `{task, index}`, `{task}`, `{variant, task}`, `{task, onClose}`, `{task}` |
| 11 | Overlays keep props; click-away stays in container | ✓ | MatrixUndoToast, Toast, TaskModal untouched and called the same way; `renderPopoverClickAway()` in PrioritiesPage.tsx:341 |
| 12 | Console: 7 tabs → `PrioritiesPage`; `MobileMoveToPanelScenario` and gallery `MatrixTaskCard` in inert context | ✓ | scenarios/priorities/page.tsx `renderPrioritiesPage(...)` ×7 through `toPrioritiesPageProps(..., SCENARIO_TODAY)`; MobileMoveToPanelScenario wraps `inertPrioritiesPageContext(activePlanId)`; DomainTab wraps `inertPrioritiesPageContext(MATRIX_CARD_ACTIVE_PLAN_ID)`, fixture `isTracked` replaced by `planId` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` provides capture, captureError, loadMore | ✓ | DumpPage.tsx new / DumpScreen.tsx deleted (no rename detected; same body); DumpPageContext.ts `{capture, captureError, loadMore}` |
| 14 | Route unpacking + `periodKey` → adapter in `utils/`, unit test; no new action/service | ✓ | utils/dump.ts `toDumpPageProps(feed, totalCount, today)`; kanban/dump/page.tsx calls it; dump.test.ts two cases; actions and services untouched |
| 15 | Console: both dump tabs → `DumpPage` | ✓ | scenarios/dump/page.tsx two `<DumpPage {...toDumpPageProps(...)} />` |
| 16 | No feature component takes a callback prop (overlays/frames excepted) | ✓ | the only remaining `on*` props in board/priorities/dump are MobileBacklogPanel.onClose, MobileMoveToSheet.onClose, MatrixUndoToast.onUndo/onDismiss (overlays) |
| 17 | Context files, hook names, inert helpers follow one pattern like Projects | ✓ | `<Feature>PageContext.ts` with `<Feature>PageContextValue`, `createContext<…\|null>(null)`, `use<Feature>PageContext` that throws "must be used within <Feature>Page"; `inertBoardPageContext()`, `inertPrioritiesPageContext(activePlanId)` next to `inertProjectsPageContext` in design/constants.ts (Dump needs none) |
| 18 | Nothing outside the plan changed | ✓ | src/services, src/actions, src/lib, application/, ui/, plan/, projects/ untouched; small spillover only: TaskModalPanel import path (FALLBACK_QUADRANT move), comment renames |
| 19 | Docs: spike archived and links fixed; tracker sub-items removed; AGENTS.md sentence; README Update Log; baseline Board part | ✓ | spike moved to archived/ (100%); tracker Step 10 page-structure item and its sub-bullets removed, Plan-week link → archived/; AGENTS.md "the Plan page isn't on it yet: tracker › Week model Phase 2"; README 2026-10-27 log + Current State Design Console line; baseline Board bullets renamed. Nit: AGENTS.md:115 Bad example still names `PriorityMatrixPage` |
| 20 | One commit per page + one docs commit | ✓ | c0e1a68 Board, 150cecd Dump, 3c7c8fb Priorities, d723edb Docs; linear, no merges |

**Score: 20 ✓ · 0 ~ · 0 ✗**

## Props observed

| Component | Base | Candidate |
| --- | --- | --- |
| QuadrantCell | 9 | 2 (quadrant, tasks) |
| MatrixTaskCard | 9 | 2 (task, index) |
| MoveToPopover | 4 | 1 (task) |
| MoveToRows | 5 | 2 (variant, task) |
| MobileMoveToSheet | 6 | 2 (task, onClose) |
| MobileMoveToPanel | 5 | 1 (task) |
| DumpComposer | 2 | 0 |
| DumpFeed | 4 | 3 (entries, hasMore, isAppending) |
| MobileBacklogCard | 2 | 1 (card) |

## Files outside the plan

- src/components/domain/shared/task-modal/TaskModalPanel.tsx: import of `FALLBACK_QUADRANT` changed from priorities/constants to utils/oneOffUtils (the constant moved so `groupTasksByQuadrant` in utils can use it).
- src/components/domain/priorities/constants.ts: `FALLBACK_QUADRANT` removed (moved).
- Comment-only renames: src/hooks/useDumpFeed.ts, src/utils/boardCardUtils.ts, board/BoardColumn.tsx, DesktopBacklog.tsx, MobileBacklog.tsx, MobileBacklogPanel.tsx, scenarios/priorities/DoneToastScenario.tsx, scenarios/board/fixtures.ts.
- New type files: src/types/priorities.ts, src/types/dump.ts.
- Docs beyond the checklist: src/app/design/README.md (page-context rule broadened to inline sheets and route adapters); design/spike/component-structure-experiment.md (8 lines; not read, per the brief); tracker *Uniform page header* drops the `'use client'` half-sentence (as the plan asks).
- Not touched: services, actions, DAL, auth, app shell, Plan, Projects.

## Where the page data types live

- types/: `BoardData` (src/types/board.ts, already at base, now BoardPage's props directly); `PrioritiesPageData extends MatrixData` (src/types/priorities.ts, new; `MatrixData` is a type-only import from services/matrixService); `DumpPageData` (src/types/dump.ts, new: periodKey, initialEntries, initialNextCursor, initialTotalCount).
- utils/: `DumpFeedResult` (unexported, in src/utils/dump.ts): a hand-written mirror of fetchDumpEntriesAction's return shape for the adapter's input.
- Elsewhere: context value types `BoardPageContextValue`, `PrioritiesPageContextValue`, `DumpPageContextValue` in each feature's `<Feature>PageContext.ts`.

## Possible bugs

None seen that change behavior. Minor:
- PrioritiesPage now stores `sheetTaskId` and derives `sheetTask` from `localTasks` (it used to store a TaskItem snapshot). This is behavior-neutral for track/complete (both clear it), and the sheet now follows optimistic changes. It is a small change the plan didn't spell out.
- `DumpFeedResult` duplicates the action's return type instead of deriving it, so it could drift (DRY).
- oneOffUtils.test.ts `it.each` title `'%s → %s'` prints the planId as the second value, not the expected boolean (cosmetic).
- Stale `PriorityMatrixPage` name in AGENTS.md:115 (Production first › Bad example).
- Tests, typecheck and lint were not run (read-only audit).
