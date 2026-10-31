# Checklist A5: candidate 92bc898ec4b0fd091f3d5a1781f51b9909b7d7c6 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5 (origin/claude/page-structure-try2-a5)

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` renamed `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | `KanbanBoard.tsx => BoardPage.tsx` (75% similarity); BoardPage.tsx:124-131 renders `flex h-full flex-col` + BoardHeader + ProgressDashboard + `min-h-0 flex-1` wrapper; BoardScreen.tsx deleted |
| 2 | Route renders `<BoardPage …/>`; no plan still `EmptyBoard` | ✓ | src/app/kanban/page.tsx:20 `return <BoardPage {...board} />;`, :14 `<EmptyBoard` branch unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | BoardPageContext.ts:8-11 `{pullToTodo}`; MobileBacklogCard.tsx props `{card}` only, `const {pullToTodo} = useBoardPageContext();` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | boardCardUtils.ts, BoardColumn.tsx, DesktopBacklog.tsx, MobileBacklog.tsx: comment-only diffs ("rendered by BoardPage") |
| 5 | Console: both board tabs render `BoardPage`; sheet frame + gallery card in inert context | ✓ | scenarios/board/page.tsx:44, :57 `<BoardPage`; MobileBacklogSheetFrame.tsx:27 and DomainTab.tsx:172 `<BoardPageContext value={inertBoardPageContext()}>` |
| 6 | `PriorityMatrixPage` renamed `PrioritiesPage`, absorbs `PrioritiesScreen`; deleted | ✓ | `PriorityMatrixPage.tsx => PrioritiesPage.tsx`; PrioritiesPage.tsx:370-382 wraps `flex flex-col h-full` + `<BoardHeader periodKey>`; PrioritiesScreen.tsx deleted |
| 7 | `periodKey` fallback in a `utils/` adapter called by the route, unit-tested; `matrixService` unchanged | ✓ | oneOffUtils.ts:120 `toPrioritiesPageProps`; kanban/priorities/page.tsx:9; oneOffUtils.test.ts `describe('toPrioritiesPageProps')` (two cases); no diff under src/services |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in `utils/oneOffUtils.ts` with tests; `isTracked` in one place | ✓ | oneOffUtils.ts:95, :111; oneOffUtils.test.ts covers both; the container's `useMemo` grouping and inline `isTrackedTask` closure are gone. One definition, called in PrioritiesPage.tsx:91 (count), MatrixTaskCard.tsx:36, MoveToRows.tsx:68, matching the plan's tree (both read `activePlanId`) |
| 9 | `PrioritiesPageContext` has all fields | ✓ | PrioritiesPageContext.ts:12-29: activePlanId, openPopoverTaskId, togglePopover, openMoveToSheet, openAddTask, trackTask, completeTask |
| 10 | Props QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | `{quadrant, tasks}`, `{task, index}`, `{task}`, `{task, variant}`, `{task, onClose}`, `{task}` |
| 11 | Overlays keep props; click-away layer stays in container | ✓ | MatrixUndoToast / Toast / TaskModal call sites identical (moved into `renderUndoToast`/`renderAddedToast`/`renderAddModal`); PrioritiesPage.tsx:360-364 `fixed inset-0 z-40` layer inside `renderMatrix`'s DragDropContext |
| 12 | Console: 7 tabs render `PrioritiesPage`; panel scenario + gallery card in inert context | ✓ | scenarios/priorities/page.tsx:27, 33, 47, 61, 67, 83, 94; MobileMoveToPanelScenario.tsx:26 and DomainTab.tsx:221 wrap `inertPrioritiesPageContext(...)`; fixtures go through `toPrioritiesPageProps` (fixtures.ts:147); `isTracked` fixture field replaced by `planId: MATRIX_CARD_ACTIVE_PLAN_ID` |
| 13 | `DumpScreen` → `DumpPage`; context provides capture, captureError, loadMore | ✓ | DumpPage.tsx new / DumpScreen.tsx deleted; DumpPageContext.ts:9-17; DumpPage.tsx:40 `{capture, captureError, loadMore}` |
| 14 | Route unpacking + `periodKey` in `utils/` adapter with test; no new action/service | ✓ | utils/dump.ts:93 `toDumpPageProps(feed, totalCount, today)`; kanban/dump/page.tsx:17; dump.test.ts adds success + error-branch cases; no actions/services diff |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | scenarios/dump/page.tsx:11, :17, fixtures via `toDumpPageProps` (fixtures.ts:64, :71) |
| 16 | No feature component takes a callback prop (overlays/frames excepted) | ✓ | Remaining callback props in board/priorities/dump: `MobileBacklogPanel.onClose` (overlay content of the MobileBacklog frame), `MatrixUndoToast.onUndo/onDismiss`, `MobileMoveToSheet.onClose` (overlays). All others now come from context |
| 17 | Context files, hooks, inert helpers follow one pattern, same as Projects | ✓ | All three `<Feature>PageContext.ts` copy ProjectsPageContext.ts: doc comment, `…ContextValue` interface, `createContext<…|null>(null)`, `use<Feature>PageContext` with `use()` + throw "must be used within <Feature>Page"; `inertBoardPageContext()` / `inertPrioritiesPageContext(activePlanId)` beside `inertProjectsPageContext` in design/constants.ts:691, :698 (no Dump helper needed: no Dump specimen reads the context) |
| 18 | Nothing outside the plan changed | ✓ | No diff in services, actions, DAL, Plan, auth, app shell. Small knock-ons only (see "Files outside the plan") |
| 19 | Docs: spike archived + links; tracker 3 sub-items removed; AGENTS.md sentence; README Update Log; baseline Board part | ~ | Tracker sub-items (and the Q9 bullet and parent) removed; AGENTS.md:132 now "the Plan page, not on it yet, is rebuilt on it as Phase 2's Plan week (tracker)"; README 2026-10-27 entry; baseline.md:282-286 renamed + "Every page but Plan follows…". **Spike not archived**: `design/spike/component-structure.md` unchanged and still at its old path (tracker.md:33 still links it there) |
| 20 | One commit per page plus one docs commit | ✓ | 0f4ec7d Board · d7adcbf Dump · 242fbf3 Priorities · 92bc898 Docs; linear, no merges, no cross-page files |

**Score: 19 ✓ · 1 ~ · 0 ✗**

## Props observed

| Component | Base | Candidate | Plan |
| --- | --- | --- | --- |
| QuadrantCell | 9 | 2 (quadrant, tasks) | 2 |
| MatrixTaskCard | 9 | 2 (task, index) | 2 |
| MoveToPopover | 4 | 1 (task) | 1 |
| MoveToRows | 5 | 2 (task, variant) | 2 |
| MobileMoveToSheet | 6 | 2 (task, onClose) | 2 |
| MobileMoveToPanel | 5 | 1 (task) | 1 |
| DumpComposer | 2 | 0 | 0 |
| DumpFeed | 4 | 3 (entries, hasMore, isAppending) | 3 |
| MobileBacklogCard | 2 | 1 (card) | 1 |

## Files outside the plan

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx`: import only. `FALLBACK_QUADRANT` moved from `priorities/constants.ts` to `utils/oneOffUtils.ts`, because `groupTasksByQuadrant` needs it in utils.
- `src/hooks/useDumpFeed.ts`: comment only (PriorityMatrixPage → PrioritiesPage).
- `src/utils/boardCardUtils.ts`, `BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx`, `MobileBacklogPanel.tsx`: comment-only renames.
- `src/types/priorities.ts`, `src/types/dump.ts`: new type files the plan didn't name (they hold the adapters' return types).
- Docs: tracker *Uniform page header* drops the "needless `'use client'`" half-sentence, as the plan's Board section expected; README Design System line now says "page containers".

## Where the page data types live

- `src/types/board.ts`: `BoardData` (existing, unchanged; BoardPage now takes it directly instead of its own `KanbanBoardProps`).
- `src/types/priorities.ts`: `PrioritiesPageData extends MatrixData { periodKey }`, with `MatrixData` imported as a type **from `@/services/matrixService`**. This reverses the base direction, where `types/projects.ts` owns `ProjectsPageData` and the service imports it.
- `src/types/dump.ts`: `DumpPageData` (periodKey, initialEntries, initialNextCursor, initialTotalCount) and `DumpFeedPage` (entries, nextCursor).
- Context value types sit next to each container (`BoardPageContextValue`, `PrioritiesPageContextValue`, `DumpPageContextValue`). `utils/oneOffUtils.ts` also type-imports `MatrixData` from the service (type-only, so it's allowed).

## Possible bugs

None seen. Things I checked:
- In Priorities, the toasts, sheet and modal moved out of the DragDropContext into the column div. The DOM stays the same, because the base PrioritiesScreen div was already their parent and DragDropContext renders no element.
- `togglePopover` keeps the old toggle semantics.
- The no-plan scenario tabs now get their header week from the adapter (NOW = 2026-07-10 → W28), which is the same badge as before (`SCENARIO_ACTIVE_PLAN.periodKey` = W28).
- Dump scenario `DUMP_TODAY` = 2026-07-15 → W29, which matches the old `DUMP_PERIOD_KEY`.
- The test dates (`new Date(2026, 9, 21)` → W43) are local-midnight Wednesdays, so they're safe under UTC and Los Angeles.

Minor style notes:
- `toDumpPageProps` is a `function` declaration while `toPrioritiesPageProps` is a const arrow (each follows its file's existing style).
- The `types/` → `services/` type dependency noted above.
