# Checklist B2 — candidate e50c7afb00c3903cb478e6242dd1a6c3e3df8303 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | Rename at 75% similarity (`board/{KanbanBoard.tsx => BoardPage.tsx}`); the `flex flex-col h-full` > `BoardHeader` + `ProgressDashboard` + `flex-1 min-h-0` wrapper now sits in `BoardPage`'s return; `BoardScreen.tsx` deleted |
| 2 | Route renders `<BoardPage …/>`; `EmptyBoard` with no plan | ✓ | `src/app/kanban/page.tsx:20` `return <BoardPage {...board} />;`; the `EmptyBoard` branch at :12-17 is unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | `board/BoardPageContext.ts:10` `pullToTodo: (taskId: string) => void`; `MobileBacklogCard.tsx:10-11` props `{card}` only, :21 `useBoardPageContext()` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | `boardCardUtils.ts`, `BoardColumn`, `DesktopBacklog` and `MobileBacklog` change only in comments (KanbanBoard → BoardPage); `isDragActive` is still a `BoardColumn` prop |
| 5 | Console: both board tabs render `BoardPage`; sheet frame + gallery card in an inert context | ✓ | `scenarios/board/page.tsx:44,57` `<BoardPage`; `MobileBacklogSheetFrame.tsx` wraps in `<BoardPageContext value={inertBoardPageContext()}>`; `DomainTab.tsx:172` the same; helper at `constants.ts:702` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; `PrioritiesScreen` deleted | ✓ | Rename at 71% similarity; `PrioritiesPage.tsx:366-367` `flex flex-col h-full` + `<BoardHeader periodKey={periodKey} />`; `PrioritiesScreen.tsx` deleted |
| 7 | `periodKey` fallback → `utils/` adapter called by the route, unit-tested; `matrixService` unchanged | ✓ | `oneOffUtils.ts:125` `toPrioritiesPageProps`, `periodKey: activePlan?.periodKey ?? getISOWeekKey(today)`; `kanban/priorities/page.tsx:9`; `oneOffUtils.test.ts` › `toPrioritiesPageProps` (2 cases); `matrixService.ts` not in the diff |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in `oneOffUtils.ts` with tests; `isTracked` in one place | ✓ | `oneOffUtils.ts:94,110`; tests: 3 for grouping, 3 for tracking. The `useMemo` grouping and both inline `isTracked` checks (container, `QuadrantCell`) are gone. `isTrackedTask` is now called at three sites (`MatrixTaskCard`, `MoveToRows`, the container's `trackedCount`), all through the one definition |
| 9 | `PrioritiesPageContext` has every field | ✓ | `PrioritiesPageContext.ts:14-24`: `activePlanId`, `openPopoverTaskId`, `togglePopover`, `openMoveToSheet`, `openAddTask`, `trackTask`, `completeTask` |
| 10 | Props 2 / 2 / 1 / 2 / 2 / 1 | ✓ | `QuadrantCell {quadrant, tasks}`, `MatrixTaskCard {task, index}`, `MoveToPopover {task}`, `MoveToRows {task, variant}`, `MobileMoveToSheet {task, onClose}`, `MobileMoveToPanel {task}` |
| 11 | Overlays keep their props; click-away stays in the container | ✓ | `MatrixUndoToast`, `Toast` and `TaskModal` calls are unchanged (`PrioritiesPage.tsx:190-196, 205-214, 347-361`); click-away is the container's `renderPopoverClickAway` (:338-344), outside every Draggable |
| 12 | Console: 7 tabs render `PrioritiesPage`; panel scenario + gallery card in an inert context | ✓ | `scenarios/priorities/page.tsx:26-27` `renderPrioritiesPage` (runs `toPrioritiesPageProps`), used by the 7 tabs at :35,41,55,69,75,91,102; `MobileMoveToPanelScenario` wraps in `inertPrioritiesPageContext(activePlanId)`; `DomainTab` wraps `MatrixTaskCard` in `inertPrioritiesPageContext(MATRIX_CARD_ACTIVE_PLAN_ID)`. Fixture `isTracked` is replaced by the task's `planId` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` has capture, captureError, loadMore | ✓ | `dump/DumpPage.tsx` new, `DumpScreen.tsx` deleted (git sees no rename, but the body is the same); `DumpPageContext.ts:11-15` |
| 14 | Route unpacking + `periodKey` → `utils/` adapter with a test; no new action or service | ✓ | `utils/dump.ts:108` `toDumpPageProps(feed, totalCount, today)`; `kanban/dump/page.tsx:16`; `dump.test.ts` › `toDumpPageProps` (2 cases); no action or service files in the diff |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | `scenarios/dump/page.tsx:18,25` `<DumpPage {...toDumpPageProps(...)} />` |
| 16 | No feature component takes a callback prop (overlays and frames excepted) | ✓ | The only `on*` props left in board/, priorities/ and dump/ are `MobileBacklogPanel.onClose`, `MobileMoveToSheet.onClose` and `MatrixUndoToast.onUndo/onDismiss`, all overlays |
| 17 | Context files, hook names and inert helpers follow one pattern, same as Projects | ✓ | All three contexts follow the Projects shape: `createContext<XValue \| null>(null)`, a `useXPageContext` hook built on `use()` that throws "must be used within XPage", and `pageContext: XPageContextValue` built in the container. Inert helpers are `inertBoardPageContext()` and `inertPrioritiesPageContext(activePlanId)` (Dump needs none). Minor: `inertPrioritiesPageContext` sits in the "Matrix card fixtures" section (`constants.ts:459`), away from the other two (:683, :702) |
| 18 | Nothing outside the plan changed | ✓ | No Plan, auth, app shell, service, action or DAL files in the diff. Outside the three folders: `shared/task-modal/TaskModalPanel.tsx` (import path for `FALLBACK_QUADRANT`, which moved to `oneOffUtils`), `hooks/useDumpFeed.ts` (comment only), `src/app/design/README.md` (console rule) |
| 19 | Docs: spike archived + links; tracker sub-items removed; AGENTS.md sentence; README Update Log; baseline Board part | ~ | Tracker: the 4 sub-bullets are replaced by one "Q9 comparison report" item (`tracker.md:73`), and the stale `'use client'` half-sentence is removed. AGENTS.md:132 now reads "the Plan page moves onto it with Phase 2's Plan week". README has a 2026-10-27 Update Log entry plus the Design System line. `baseline.md` renames `BoardScreen`/`KanbanBoard`. **Not done: the spike is not archived** — on purpose, "stays open for its Q9 comparison report" (README, tracker). Also stale: AGENTS.md:115 still uses `PriorityMatrixPage` in the *Production first* Bad example |
| 20 | One commit per page + one docs commit | ✓ | `16f7c7e` Board, `fb201fb` Dump, `a433d07` Priorities, `e50c7af` Docs. History is linear, no merge commits |

**Score: 19 ✓ · 1 ~ · 0 ✗**

## Props observed (base → candidate)

| Component | Base | Candidate | Props now |
| --- | --- | --- | --- |
| QuadrantCell | 9 | 2 | quadrant, tasks |
| MatrixTaskCard | 9 | 2 | task, index |
| MoveToPopover | 4 | 1 | task |
| MoveToRows | 5 | 2 | task, variant |
| MobileMoveToSheet | 6 | 2 | task, onClose |
| MobileMoveToPanel | 5 | 1 | task |
| DumpComposer | 2 | 0 | — |
| DumpFeed | 4 | 3 | entries, hasMore, isAppending |
| MobileBacklogCard | 2 | 1 | card |

## Files outside the plan

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx`: imports `FALLBACK_QUADRANT` from `@/utils/oneOffUtils` now, because the constant moved out of `priorities/constants.ts` so that `groupTasksByQuadrant` (in utils) can use it. A necessary consequence of the move.
- `src/hooks/useDumpFeed.ts`, `src/utils/boardCardUtils.ts`, `BoardColumn`, `DesktopBacklog`, `MobileBacklog`, `MobileBacklogPanel`: comment-only renames.
- `src/app/design/README.md`: the console rule now names one `inert<Feature>PageContext` per page and says scenarios use the route adapters. This is in the plan's spirit, but the plan's shared-file list doesn't name it.
- Nothing in services, actions, the DAL, Plan, auth or the app shell.

## Where the page data types live

- Board: `BoardData` in `src/types/board.ts` (already there at base). `BoardPage` takes it directly, as `ProjectsPage` takes `ProjectsPageData` from `src/types/projects.ts`.
- Priorities: `PrioritiesPageProps` in `src/utils/oneOffUtils.ts`, next to its adapter. Its input `MatrixData` / `MatrixActivePlan` stays in `src/services/matrixService.ts`, and `oneOffUtils.ts` now does `import type {MatrixData} from '@/services/matrixService'` (type-only, so allowed).
- Dump: `DumpPageProps` (exported) and `DumpFeedResult` (private, a hand-written copy of `fetchDumpEntriesAction`'s return union) in `src/utils/dump.ts`.
- So the types are split: Board and Projects keep theirs in `types/`, while the two new adapter-backed props types live in `utils/` beside their adapters.

## Possible bugs

None seen. The DOM nesting of all three pages is unchanged: the absorbed wrapper divs are the same, and `DragDropContext` renders no DOM. The no-plan Priorities scenarios now take their header week from `SCENARIO_TODAY` (2026-07-10 → 2026-W28), the same as before. Minor risks, not bugs:
- `DumpFeedResult` duplicates the action's return shape by hand, so it can drift if the action changes (typecheck would catch that at the route).
- I didn't run the checks (read-only audit).
