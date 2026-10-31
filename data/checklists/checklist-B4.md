# Checklist B4 — candidate ba75fce915dd72f510c620399606adcc7007e777 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | `R075 KanbanBoard.tsx → BoardPage.tsx`; `BoardPage.tsx` return wraps `<div className="flex flex-col h-full"><BoardHeader …/><ProgressDashboard {...progress} /><div className="flex-1 min-h-0">{renderBoard()}</div>`; `D BoardScreen.tsx` |
| 2 | Route renders `<BoardPage …/>`; no plan → `EmptyBoard` | ✓ | `src/app/kanban/page.tsx:20` `return <BoardPage {...board} />;` EmptyBoard branch untouched |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | `BoardPageContext.ts:8-11` `{pullToTodo}`; `MobileBacklogCard.tsx` props `{card}`, `const {pullToTodo} = useBoardPageContext();` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | `boardCardUtils.ts`, `BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx`: comment-only renames (KanbanBoard → BoardPage); `isDragActive` still a `BoardColumn` prop |
| 5 | Console: both board tabs render `BoardPage`; sheet frame + gallery card in inert context | ✓ | `scenarios/board/page.tsx:44,57` `<BoardPage`; `MobileBacklogSheetFrame.tsx:27` `<BoardPageContext value={inertBoardPageContext()}>`; `DomainTab.tsx:169` same; `constants.ts` `inertBoardPageContext = (): BoardPageContextValue` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; deleted | ✓ | `R072 PriorityMatrixPage.tsx → PrioritiesPage.tsx`; renders `<BoardHeader periodKey={periodKey} />` inside `flex flex-col h-full`; `D PrioritiesScreen.tsx` (DOM order identical: DragDropContext renders no node) |
| 7 | `periodKey` fallback → `utils/` adapter called by route, unit-tested; `matrixService` unchanged | ✓ | `oneOffUtils.ts` `toPrioritiesPageProps(matrix, today)` → `{...matrix, periodKey: matrix.activePlan?.periodKey ?? getISOWeekKey(today)}`; `kanban/priorities/page.tsx:9`; `oneOffUtils.test.ts` `describe('toPrioritiesPageProps')` (2 cases); no diff under `src/services` |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in `utils/oneOffUtils.ts`, tested; `isTracked` in one place | ✓ | Both exported from `oneOffUtils.ts`; tests in new `oneOffUtils.test.ts`; container `useMemo` and QuadrantCell's inline `activePlanId !== null && task.planId === activePlanId` gone — one definition (via `getWeekPlacement`), called by container (trackedCount), `MatrixTaskCard`, `MoveToRows` |
| 9 | `PrioritiesPageContext` fields complete | ✓ | `PrioritiesPageContext.ts:13-28`: activePlanId, openPopoverTaskId, togglePopover, openMoveToSheet, openAddTask, trackTask, completeTask |
| 10 | Props: QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | `{quadrant, tasks}`, `{task, index}`, `{task}`, `{task, variant}`, `{task, onClose}`, `{task}` |
| 11 | Overlays keep props; click-away layer in container | ✓ | `MatrixUndoToast.tsx`, `Toast` untouched; `TaskModal` same props in `renderAddTaskModal`; `renderClickAwayLayer()` in `PrioritiesPage.tsx` |
| 12 | Console: 7 tabs render `PrioritiesPage`; panel scenario + gallery card in inert context | ✓ | 7 `<PrioritiesPage {...prioritiesPage(…)} />` in `scenarios/priorities/page.tsx` (adapter via `fixtures.ts` `prioritiesPage`); `MobileMoveToPanelScenario.tsx:25` `inertPrioritiesPageContext(activePlanId)`; `DomainTab.tsx:221`; fixture `isTracked` replaced by `planId: MATRIX_CARD_ACTIVE_PLAN_ID` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` provides capture, captureError, loadMore | ✓ | `A DumpPage.tsx`, `D DumpScreen.tsx` (content moved, git sees add+delete); `DumpPageContext.ts:8-16` |
| 14 | Route unpacking + `periodKey` → `utils/` adapter, unit-tested; no new action/service | ✓ | `utils/dump.ts` `toDumpPageProps(feed, totalCount, today)`; `kanban/dump/page.tsx:16`; `dump.test.ts` `describe('toDumpPageProps')` (success + error fallback); no diff in `src/actions`, `src/services` |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | `scenarios/dump/page.tsx` `renderDumpPage` → `<DumpPage {...toDumpPageProps(…, DUMP_TODAY)} />` for Feed and Empty |
| 16 | No feature component in scope takes a callback prop (overlays/frames excepted) | ✓ | Remaining callback props only `MobileBacklogPanel.onClose`, `MobileMoveToSheet.onClose`, `MatrixUndoToast.onUndo/onDismiss` — overlays |
| 17 | Context files, hook names, inert helpers follow one pattern, same as Projects | ✓ | All three `<Feature>PageContext.ts` with `createContext<…Value \| null>(null)` + `use<Feature>PageContext` throwing `must be used within <Feature>Page`; containers build `const pageContext: <Feature>PageContextValue`; `inert<Feature>PageContext(…)` in `src/app/design/constants.ts` |
| 18 | Nothing outside the plan changed | ✓ | No Plan/auth/shell/services/actions/DAL diffs; small supporting edits only (see below) |
| 19 | Docs: spike archived + links; tracker sub-items; AGENTS sentence; README Update Log; baseline Board | ~ | Tracker sub-items removed, AGENTS.md "the Plan page, not on it yet: tracker › Week model Phase 2", README `### 2026-10-27`, baseline `BoardPage` — but `design/spike/component-structure.md` is still in `design/spike/` (not moved to `archived/`, Status unchanged), so no links fixed |
| 20 | One commit per page + one docs commit | ✓ | `cdc847f` Board, `a4b1bc8` Dump, `a027245` Priorities, `ba75fce` Docs; no merges |

**Score: 19 ✓ · 1 ~ · 0 ✗**

## Props observed (base → candidate)

| Component | Base | Candidate |
| --- | --- | --- |
| QuadrantCell | 9 | 2 (`quadrant`, `tasks`) |
| MatrixTaskCard | 9 | 2 (`task`, `index`) |
| MoveToPopover | 4 | 1 (`task`) |
| MoveToRows | 5 | 2 (`task`, `variant`) |
| MobileMoveToSheet | 6 | 2 (`task`, `onClose`) |
| MobileMoveToPanel | 5 | 1 (`task`) |
| DumpComposer | 2 | 0 |
| DumpFeed | 4 | 3 (`entries`, `hasMore`, `isAppending`) |
| MobileBacklogCard | 2 | 1 (`card`) |

## Files outside the plan

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx` — import of `FALLBACK_QUADRANT` switched to `@/utils/oneOffUtils` (constant moved from `priorities/constants.ts` so `groupTasksByQuadrant` can use it).
- `src/components/domain/priorities/constants.ts` — `FALLBACK_QUADRANT` removed (moved).
- `src/hooks/useDumpFeed.ts` — `DumpFeedInit extends DumpFeedPage` (shared type), comment rename.
- `src/types/dump.ts`, `src/types/priorities.ts` — new page-data types (supporting).
- `src/utils/boardCardUtils.ts`, board frames, `DoneToastScenario.tsx`, `src/app/design/README.md` — comment/doc renames only.
- Route default-export names changed: `DumpPage` → `KanbanDumpPage`, `PrioritiesPage` → `KanbanPrioritiesPage` (to free the container name).

## Where the page data types live

- `src/types/`: `BoardData` (`types/board.ts`, pre-existing, used as `BoardPage` props), `PrioritiesPageData extends MatrixData` (`types/priorities.ts`, new), `DumpPageData` and `DumpFeedPage` (`types/dump.ts`, new). Same home as Projects' `ProjectsPageData` (`types/projects.ts`).
- `src/utils/`: `DumpFeedResult` (module-local in `utils/dump.ts`, the action's result shape).
- Elsewhere: `MatrixData` / `MatrixActivePlan` still in `services/matrixService.ts` (imported as type by `utils/oneOffUtils.ts` and `types/priorities.ts`).
- Naming: Board keeps `BoardData` rather than `BoardPageData` (pre-existing name; not renamed).

## Possible bugs

None seen. `isTrackedTask` via `getWeekPlacement` matches the old test (planId non-null and equal to a non-null activePlanId). Priorities DOM is unchanged (DragDropContext renders no node, so toasts/sheet/modal stay siblings in the same flex column). Dump scenario `DUMP_TODAY = new Date(2026, 6, 16)` is a Thursday in 2026-W29, matching the old fixed key; Priorities' no-plan tabs now show `NOW`'s week (2026-W28, same as before).
