# Checklist B3: candidate 0cab8f6fb0f78e3610d4145eef6ef06e4e7e1a70 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5 (origin/claude/page-structure-try2-b3)

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | Git rename `KanbanBoard.tsx => BoardPage.tsx` (51% similarity); the return wraps `<div className="flex flex-col h-full"><BoardHeader …/><ProgressDashboard {...progress}/><div className="flex-1 min-h-0">{renderBoard()}</div>`; `BoardScreen.tsx` deleted |
| 2 | Route renders `<BoardPage …/>`; with no plan still `EmptyBoard` | ✓ | `src/app/kanban/page.tsx:20` `return <BoardPage {...board} />;`; the `EmptyBoard` branch is unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | `board/BoardPageContext.ts:10` `pullToTodo`; `MobileBacklogCard.tsx` props are `{card}` only and it reads `useBoardPageContext()` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | `boardCardUtils.ts`, `BoardColumn`, `DesktopBacklog` and `MobileBacklog` change only in their comments (KanbanBoard → BoardPage); `isDragActive` is still a prop |
| 5 | Console: both board tabs render `BoardPage`; sheet frame and gallery card in an inert context | ✓ | `scenarios/board/page.tsx:44,57` `<BoardPage`; `MobileBacklogSheetFrame.tsx` and `DomainTab.tsx` wrap in `<BoardPageContext value={inertBoardPageContext()}>` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; `PrioritiesScreen` deleted | ✓ | Git rename `PriorityMatrixPage.tsx => PrioritiesPage.tsx`; `PrioritiesPage.tsx:340-341` `flex flex-col h-full` + `<BoardHeader periodKey={periodKey} />`; `PrioritiesScreen.tsx` deleted |
| 7 | `periodKey` fallback is a `utils/` adapter called by the route, with a unit test; `matrixService` unchanged | ✓ | `oneOffUtils.ts` `toPrioritiesPageProps({tasks, activePlan}, today)`; `kanban/priorities/page.tsx:9`; 3 tests in `oneOffUtils.test.ts`; no diff under `src/services/` |
| 8 | `groupTasksByQuadrant` and `isTrackedTask` in `oneOffUtils.ts` with tests; `isTracked` computed in one place | ✓ | Both exported from `oneOffUtils.ts`, 2 + 4 tests. The predicate is defined once (`getWeekPlacement(...) === THIS_WEEK`, same semantics as the old check) and called from `MatrixTaskCard`, `MoveToRows` and the container's `trackedCount` |
| 9 | `PrioritiesPageContext` has every field | ✓ | `PrioritiesPageContext.ts:12-28`: activePlanId, openPopoverTaskId, togglePopover, openMoveToSheet, openAddTask, trackTask, completeTask |
| 10 | Prop counts 2/2/1/2/2/1 | ✓ | QuadrantCell {quadrant, tasks}; MatrixTaskCard {task, index}; MoveToPopover {task}; MoveToRows {task, variant}; MobileMoveToSheet {task, onClose}; MobileMoveToPanel {task} |
| 11 | Overlays keep their props; click-away layer stays in the container | ✓ | `MatrixUndoToast`, `Toast` and `TaskModal` have no diff and the same call sites; click-away at `PrioritiesPage.tsx:350-355` |
| 12 | Console: the 7 tabs render `PrioritiesPage`; the Move-to panel scenario and the gallery card in an inert context | ✓ | `renderPrioritiesPage(matrix)` → `<PrioritiesPage {...toPrioritiesPageProps(matrix, SCENARIO_TODAY)} />`, used by all 7 tabs; `MobileMoveToPanelScenario` and `DomainTab` use `inertPrioritiesPageContext(activePlanId)`; fixture `isTracked` replaced by `planId: MATRIX_CARD_ACTIVE_PLAN_ID` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` provides capture, captureError, loadMore | ✓ | `DumpPage.tsx` is new and `DumpScreen.tsx` is deleted (git shows it as an add plus a delete, not a rename); `DumpPageContext.ts:9-16` |
| 14 | Route unpacking and `periodKey` move into a `utils/` adapter with a unit test; no new action or service | ✓ | `utils/dump.ts` `toDumpPageProps(feed, totalCount, today)`; `kanban/dump/page.tsx:16`; 2 tests in `dump.test.ts`; actions and services untouched |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | `scenarios/dump/page.tsx` renders `<DumpPage {...toDumpPageProps(...)} />` in both tabs |
| 16 | No feature component takes a callback prop (overlays and frames excepted) | ✓ | The only `on*` props left in board/, priorities/ and dump/ are `MobileBacklogPanel.onClose`, `MobileMoveToSheet.onClose` and `MatrixUndoToast.onUndo/onDismiss`, all overlays or panels |
| 17 | The three contexts, hooks and inert helpers follow one pattern, the same as Projects | ✓ | Each one is `createContext<…Value \| null>(null)`, `use<Feature>PageContext` with `use()` and a "must be used within <Feature>Page" throw, and the same doc-comment shape; `inertBoardPageContext()` and `inertPrioritiesPageContext(activePlanId)` sit next to `inertProjectsPageContext` in the console constants. Dump has no inert helper, and none is needed (no specimen reads its context) |
| 18 | Nothing outside the plan changed (Plan, auth, app shell, services, actions, DAL) | ✓ | None of those areas is touched. Small adjacent changes are listed under Files outside the plan below |
| 19 | Docs: spike archived and links fixed; tracker sub-items removed; AGENTS.md sentence; README Update Log; baseline's Board part | ~ | Spike **not archived**: `design/spike/component-structure.md` has no diff (no status or Decision update) and the tracker line deferring its archiving was added on purpose. Tracker: the 3 sub-items and the Q9 line are replaced by a "Q9 comparison report" item. AGENTS.md now ends "Plan isn't on it yet: tracker › Plan week" ✓. README Update Log 2026-10-27 ✓. Baseline Board bullets renamed + "Every page but Plan…" ✓. Left over: AGENTS.md:115 still cites `PriorityMatrixPage` in its Bad example |
| 20 | One commit per page plus one docs commit | ✓ | 97dfcb6 Board, cb3a4d2 Dump, 0130204 Priorities, 0cab8f6 Docs; linear history, no merge commits |

**Score: 19 ✓ · 1 ~ · 0 ✗**

## Props observed

| Component | Base | Candidate |
| --- | --- | --- |
| QuadrantCell | 9 | 2 (quadrant, tasks) |
| MatrixTaskCard | 9 | 2 (task, index) |
| MoveToPopover | 4 | 1 (task) |
| MoveToRows | 5 | 2 (task, variant) |
| MobileMoveToSheet | 6 | 2 (task, onClose) |
| MobileMoveToPanel | 5 | 1 (task) |
| DumpComposer | 2 | 0 |
| DumpFeed | 4 | 3 (entries, hasMore, isAppending) |
| MobileBacklogCard | 2 | 1 (card) |

## Files outside the plan

- `src/components/domain/priorities/constants.ts` and `src/components/domain/shared/task-modal/TaskModalPanel.tsx`: `FALLBACK_QUADRANT` moved into `utils/oneOffUtils.ts`, since `groupTasksByQuadrant` in utils needs it; `TaskModalPanel`'s import was updated to match.
- `src/hooks/useDumpFeed.ts`: the local `DumpFeedInit` interface was replaced by the shared `DumpFeedSeed` type; a comment was updated.
- `src/types/dump.ts` and `src/types/priorities.ts`: new page-data type files.
- `src/app/design/README.md`: the page-context rule was generalized to `inert<Feature>PageContext` and adapter-backed scenarios.
- The tracker's "Uniform page header" item lost its "drop the needless `'use client'`" half, which the spike's Board plan calls for.

## Where the page data types live

- `types/`:
  - `BoardData` (existing, `types/board.ts`, not renamed `BoardPageData`).
  - `PrioritiesPageData {periodKey, tasks, activePlanId}` (new, `types/priorities.ts`).
  - `DumpFeedSeed {entries, nextCursor, totalCount}` and `DumpPageData extends DumpFeedSeed {periodKey}` (new, `types/dump.ts`).
  - This mirrors Projects' `ProjectsPageData` in `types/projects.ts`.
- `utils/`: `DumpFeedResult`, a non-exported union mirroring the action's result, in `utils/dump.ts`.
- Elsewhere:
  - The adapter's input `MatrixData` stays in `services/matrixService.ts`; `oneOffUtils.ts` type-imports it, so a client-safe util now has a type dependency on a service.
  - The priorities scenario fixtures also import `MatrixData` from the service.
  - The context value types sit in each `<Feature>PageContext.ts`.

## Possible bugs

None seen.

- `isTrackedTask` uses `getWeekPlacement`, which matches the old `activePlanId !== null && planId === activePlanId` check.
- `sheetTask` is now looked up by id in `localTasks` instead of kept as a snapshot. That is equivalent for track and complete (both close the sheet), and the sheet now closes by itself if its task disappears.
- The fallback week in the no-plan scenarios is unchanged: `SCENARIO_TODAY` is 2026-07-10, ISO week W28.
