# Checklist A3 — candidate 2ed0bbe6b102f808bfc632db616dd9ed9eac6df5 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | Rename `board/{KanbanBoard.tsx => BoardPage.tsx}` (75% similarity); BoardPage.tsx return: `<div className="flex flex-col h-full"><BoardHeader …/><ProgressDashboard {...progress} /><div className="flex-1 min-h-0">{renderBoard()}</div>`; `BoardScreen.tsx` deleted |
| 2 | Route renders `<BoardPage …/>`; no plan → `EmptyBoard` | ✓ | `src/app/kanban/page.tsx`: `return <BoardPage {...board} />;`, the EmptyBoard branch is unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | `board/BoardPageContext.ts:10` `pullToTodo: (taskId: string) => void`; MobileBacklogCard props `{card}` only, `const {pullToTodo} = useBoardPageContext();` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | `boardCardUtils.ts`, `BoardColumn`, `DesktopBacklog` and `MobileBacklog` change only in comments (KanbanBoard → BoardPage) |
| 5 | Console: both board tabs render `BoardPage`; `MobileBacklogSheetFrame` and the gallery `MobileBacklogCard` in an inert context | ✓ | `scenarios/board/page.tsx` two `<BoardPage …>`; `MobileBacklogSheetFrame.tsx` wraps in `<BoardPageContext value={inertBoardPageContext()}>`; `DomainTab.tsx` the same; helper in `design/constants.ts` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; Screen deleted | ✓ | Rename `{PriorityMatrixPage.tsx => PrioritiesPage.tsx}`; return `<PrioritiesPageContext …><div className="flex flex-col h-full"><BoardHeader periodKey={periodKey} />{renderMatrix()}`; `PrioritiesScreen.tsx` deleted |
| 7 | `periodKey` fallback → adapter in `utils/`, called by the route, unit tested; `matrixService` unchanged | ✓ | `utils/oneOffUtils.ts` `toPrioritiesPageProps({tasks, activePlan}, today)`; route `<PrioritiesPage {...toPrioritiesPageProps(matrix, getTodayDate())} />`; `oneOffUtils.test.ts` has 2 cases; no diff under `src/services` |
| 8 | `groupTasksByQuadrant` and `isTrackedTask` in `utils/oneOffUtils.ts` with tests; `isTracked` in one place | ✓ | Both in oneOffUtils.ts and tested (2 cases + a 4-row `it.each`). One definition; called from the container (trackedCount), `MatrixTaskCard` and `MoveToRows`; the inline check in QuadrantCell is gone |
| 9 | `PrioritiesPageContext` fields complete | ✓ | `activePlanId, openPopoverTaskId, togglePopover, openMoveToSheet, openAddTask, trackTask, completeTask` (PrioritiesPageContext.ts:12-27) |
| 10 | Props: QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | `{quadrant, tasks}`, `{task, index}`, `{task}`, `{task, variant}`, `{task, onClose}`, `{task}` |
| 11 | Overlays keep their props; the click-away layer stays in the container | ✓ | `MatrixUndoToast`/`Toast`/`TaskModal` call sites untouched; the `fixed inset-0 z-40` click-away div is still in `PrioritiesPage.renderMatrix` |
| 12 | Console: 7 tabs render `PrioritiesPage`; `MobileMoveToPanelScenario` and gallery `MatrixTaskCard` in an inert context | ✓ | 7 `<PrioritiesPage {...toPrioritiesPageProps(…, SCENARIO_TODAY)} />`; `MobileMoveToPanelScenario` takes `activePlanId` and wraps in `inertPrioritiesPageContext(activePlanId)`; the gallery wraps in `inertPrioritiesPageContext(MATRIX_CARD_PLAN_ID)`, fixture `isTracked` → `planId: MATRIX_CARD_PLAN_ID` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` gives capture, captureError, loadMore | ✓ | `dump/DumpPage.tsx` added, `DumpScreen.tsx` deleted (git sees an add plus a delete, not a rename); `DumpPageContext.ts:9-15` |
| 14 | Route unpacking + `periodKey` → adapter in `utils/`, unit tested; no new action/service | ✓ | `utils/dump.ts` `toDumpPageProps(feed, totalCount, today)`; route `<DumpPage {...toDumpPageProps(feed, totalCount, getTodayDate())} />`; 2 tests in `dump.test.ts`; actions and services unchanged |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | `scenarios/dump/page.tsx`: 2× `<DumpPage {...toDumpPageProps(…, DUMP_TODAY)} />` |
| 16 | No feature component takes a callback prop (overlays and frames with behavior excepted) | ✓ | Grep of the board/priorities/dump folders: the only callback props left are `MobileBacklogPanel.onClose` (sheet, owned by MobileBacklog's open state), `MobileMoveToSheet.onClose` and `MatrixUndoToast.onUndo/onDismiss` (overlays) |
| 17 | Context files, hook names, inert helpers follow one pattern, the same as Projects | ✓ | Each is `<Feature>PageContext.ts`: `createContext<…Value \| null>(null)`, `use<Feature>PageContext()` throwing "must be used within <Feature>Page", and the container builds `const pageContext: <Feature>PageContextValue`; inert helpers `inertBoardPageContext()` / `inertPrioritiesPageContext(activePlanId)` sit next to `inertProjectsPageContext` in design/constants.ts; page data types `PrioritiesPageData` / `DumpPageData` in `types/`, like `ProjectsPageData`; route functions renamed `KanbanPrioritiesPage` / `KanbanDumpPage`, like `KanbanProjectsPage` |
| 18 | Nothing outside the plan changed | ✓ | No diff in services, actions, DAL, Plan, auth or app shell. Small knock-ons: `FALLBACK_QUADRANT` moved from `priorities/constants.ts` to `utils/oneOffUtils.ts`, so the import in `shared/task-modal/TaskModalPanel.tsx` changed (1 line); a comment in `hooks/useDumpFeed.ts`; `src/app/design/README.md` (1 line); `component-structure-experiment.md` (2 path fixes) |
| 19 | Docs: spike archived + links fixed; tracker's three sub-items removed; AGENTS.md sentence; README Update Log; baseline Board part | ✓ | `git mv` to `design/spike/archived/`; tracker and the experiment doc now point at `archived/`; tracker Step 10 sub-bullets (Q9/Board/Priorities/Dump) gone; AGENTS.md now reads "Plan, the one page not on it yet: tracker › Plan week"; README Update Log 2026-10-27 (3 bullets); baseline.md now names `BoardPage`. Minor leftovers: AGENTS.md:115's Bad example still names `PriorityMatrixPage`; the archived spike is byte-identical, so its own backticked relative refs (`archived/…`, `component-structure-experiment.md`) no longer resolve from the new location |
| 20 | One commit per page + one docs commit | ✓ | `1b5ea6e` Board, `5c9dc44` Dump, `8407235` Priorities, `2ed0bbe` Docs; linear, no merges |

**Score: 20 ✓ · 0 ~ · 0 ✗**

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

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx`: one import line, because `FALLBACK_QUADRANT` moved to `utils/oneOffUtils.ts` (needed so `groupTasksByQuadrant` can live in utils; the plan doesn't mention the move).
- `src/components/domain/priorities/constants.ts`: `FALLBACK_QUADRANT` removed (same move).
- `src/hooks/useDumpFeed.ts`: a comment drops "mirroring PriorityMatrixPage" (in the Priorities commit).
- `design/spike/component-structure-experiment.md`: 2 lines, spike path updated to `archived/` (the link fix the archive step requires; it does change the experiment doc's prompt text).
- `src/app/design/README.md`: one sentence added (scenarios pass raw fixtures through the route's adapter).
- None in services, actions, DAL, Plan, auth or app shell.

## Where the page data types live

- `src/types/`: `PrioritiesPageData extends MatrixData {periodKey}` (`types/priorities.ts`, new); `DumpPageData {periodKey, initialEntries, initialNextCursor, initialTotalCount}` and `DumpFeedPage {entries, nextCursor}` (`types/dump.ts`, new); Board reuses the existing `BoardData` (`types/board.ts`).
- `src/utils/dump.ts`: a module-private `DumpFeedResult = {data: DumpFeedPage} | {error: unknown}`.
- Elsewhere: `MatrixData` / `MatrixActivePlan` stay in `services/matrixService.ts`; `types/priorities.ts` and `utils/oneOffUtils.ts` import them as types only.

## Possible bugs

None seen. Notes:
- Small behaviour change (the README says "no behavior change"): the mobile sheet now keeps `sheetTaskId` and looks the task up in `localTasks` by id, instead of holding a `TaskItem` snapshot. So the sheet reflects optimistic patches and closes by itself if its task leaves the rows. This is harmless and arguably better.
- Layering smell: the client-safe `utils/oneOffUtils.ts` now type-imports `MatrixData` from `services/matrixService` (type-only, so the ESLint boundary isn't crossed).
- Mild type overlap: `DumpPageData` / `DumpFeedPage` against `useDumpFeed`'s private `DumpFeedInit {entries, nextCursor, totalCount}`.
- The context's `loadMore: () => void` is assigned the hook's async `loadMore`. That type-checks, but it hides the Promise.
