# Checklist A1 — candidate 6ef9dad822ebb8f560203ed76838d77fd72579b4 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | Rename `board/{KanbanBoard.tsx => BoardPage.tsx}` (75% similarity); `BoardPage.tsx` returns `<div className="flex h-full flex-col"><BoardHeader …/><ProgressDashboard {...progress} /><div className="min-h-0 flex-1">{renderBoard()}</div>`; `BoardScreen.tsx` deleted |
| 2 | Route renders `<BoardPage …/>`; no plan → `EmptyBoard` | ✓ | `src/app/kanban/page.tsx:20` `return <BoardPage {...board} />;`, the `EmptyBoard` branch unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | `board/BoardPageContext.ts:8-11` `{pullToTodo}`; `MobileBacklogCard.tsx` props `{card}`, `const {pullToTodo} = useBoardPageContext();` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | `boardCardUtils.ts`, `BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx` (and `MobileBacklogPanel.tsx`) change only in doc comments (`KanbanBoard` → `BoardPage`) |
| 5 | Console: both board tabs → `BoardPage`; sheet frame + gallery `MobileBacklogCard` in inert context | ✓ | `scenarios/board/page.tsx:44,57` `<BoardPage`; `MobileBacklogSheetFrame.tsx:28` `<BoardPageContext value={inertBoardPageContext()}>`; `DomainTab.tsx:172` the same around the specimen; helper `constants.ts` `inertBoardPageContext` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; deleted | ✓ | Rename `{PriorityMatrixPage.tsx => PrioritiesPage.tsx}`; renders `<div className="flex h-full flex-col"><BoardHeader periodKey={periodKey} />{renderMatrix()}</div>`; `PrioritiesScreen.tsx` deleted |
| 7 | `periodKey` fallback → `utils/` adapter called by route, unit-tested; `matrixService` unchanged | ✓ | `oneOffUtils.ts` `toPrioritiesPageProps(matrix, today)` (`…activePlan?.periodKey ?? getISOWeekKey(today)`); `kanban/priorities/page.tsx:9`; tests `oneOffUtils.test.ts` › `toPrioritiesPageProps` (2 cases); no diff under `src/services/` |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in `utils/oneOffUtils.ts`, tested; `isTracked` one place | ✓ | Both in `oneOffUtils.ts`, tests in new `oneOffUtils.test.ts`; container's `useMemo` grouping and both inline `isTracked` checks (container + `QuadrantCell`) gone; one definition, called by `MatrixTaskCard`, `MoveToRows` and the container's `trackedCount` |
| 9 | `PrioritiesPageContext` has all fields | ✓ | `PrioritiesPageContext.ts:13-28`: `activePlanId`, `openPopoverTaskId`, `togglePopover`, `openMoveToSheet`, `openAddTask`, `trackTask`, `completeTask` |
| 10 | Props QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | All six exact (see Props observed) |
| 11 | Overlays keep props; click-away layer stays in container | ✓ | `MatrixUndoToast.tsx`/`Toast` untouched, `TaskModal` call unchanged; `PrioritiesPage.tsx` keeps `{openPopoverTaskId !== null && <div className="fixed inset-0 z-40 …" onClick={() => setOpenPopoverTaskId(null)} />}` |
| 12 | Console: 7 tabs → `PrioritiesPage`; `MobileMoveToPanelScenario` + gallery `MatrixTaskCard` inert | ✓ | `scenarios/priorities/page.tsx`: 7 `<PrioritiesPage {...matrixPage(…)} />` through the route's adapter; `MobileMoveToPanelScenario.tsx:27` `<PrioritiesPageContext value={inertPrioritiesPageContext(activePlanId)}>`; `DomainTab.tsx:221`; fixture `isTracked` replaced by `planId: MATRIX_CARD_ACTIVE_PLAN_ID` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` provides capture, captureError, loadMore | ✓ | Rename `{DumpScreen.tsx => DumpPage.tsx}`; `DumpPageContext.ts:8-15` |
| 14 | Route unpacking + `periodKey` → `utils/` adapter, tested; no new action/service | ✓ | `utils/dump.ts` `toDumpPageProps(feed, totalCount, today)`; `kanban/dump/page.tsx:16`; `dump.test.ts` › `toDumpPageProps` (2 cases); no diff in `src/actions/` or `src/services/` |
| 15 | Console: both dump tabs → `DumpPage` | ✓ | `scenarios/dump/page.tsx:13,27` `<DumpPage {...toDumpPageProps(…, DUMP_TODAY)} />` |
| 16 | No feature component takes a callback prop (overlays/frames excepted) | ✓ | Remaining callback props in board/priorities/dump: `MobileBacklogPanel.onClose` (frame), `MobileMoveToSheet.onClose`, `MatrixUndoToast.onUndo/onDismiss` (overlays) only |
| 17 | Context files, hooks, inert helpers follow one pattern = Projects | ✓ | `<Feature>PageContext.ts` with `<Feature>PageContextValue`, `createContext<…\| null>(null)`, `use<Feature>PageContext()` throwing "must be used within <Feature>Page"; container builds `const pageContext: …Value = {…}` like `ProjectsPage`; `inertBoardPageContext()`, `inertPrioritiesPageContext(activePlanId)` next to `inertProjectsPageContext` in `src/app/design/constants.ts` |
| 18 | Nothing outside the plan changed | ✓ | No diff in Plan, auth, app shell, services, actions, DAL. Small supporting edits only (see Files outside the plan) |
| 19 | Docs: spike archived + links; tracker sub-items; AGENTS.md sentence; Update Log; baseline Board | ✓ | `git mv` to `design/spike/archived/component-structure.md`; tracker:33 link fixed, experiment doc's links updated; tracker Step 10 sub-items (and the Q9 line) removed, `'use client'` half-sentence dropped from *Uniform page header*; AGENTS.md:132 "the one page not on it yet, Plan, moves with Phase 2's Plan week (tracker)"; README Update Log 2026-10-27 + Design Console line in Current State; `baseline.md:282-286` `BoardPage`. Nit: older Update Log entry README:119 still names `design/spike/component-structure.md` (historical; repo leaves old log links, e.g. README:340) |
| 20 | One commit per page + one docs commit | ✓ | `34b183e` Board, `b2c2146` Dump, `0cb9c9c` Priorities, `6ef9dad` Docs; linear, no merges; code commits contain no docs |

**Score: 20 ✓ · 0 ~ · 0 ✗**

## Props observed

| Component | Base | Candidate | Plan |
| --- | --- | --- | --- |
| QuadrantCell | 9 | 2 (`quadrant`, `tasks`) | 2 |
| MatrixTaskCard | 9 | 2 (`task`, `index`) | 2 |
| MoveToPopover | 4 | 1 (`task`) | 1 |
| MoveToRows | 5 | 2 (`task`, `variant`) | 2 |
| MobileMoveToSheet | 6 | 2 (`task`, `onClose`) | 2 |
| MobileMoveToPanel | 5 | 1 (`task`) | 1 |
| DumpComposer | 2 | 0 | 0 |
| DumpFeed | 4 | 3 (`entries`, `hasMore`, `isAppending`) | 3 |
| MobileBacklogCard | 2 | 1 (`card`) | 1 |

## Files outside the plan

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx` — import of `FALLBACK_QUADRANT` switched to `@/utils/oneOffUtils` (the constant moved there from `priorities/constants.ts` so `groupTasksByQuadrant` in `utils/` can use it). One-line, justified.
- `src/components/domain/priorities/constants.ts` — `FALLBACK_QUADRANT` removed (moved, above).
- `src/hooks/useDumpFeed.ts`, `board/BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx`, `MobileBacklogPanel.tsx`, `utils/boardCardUtils.ts` — doc-comment renames only.
- `src/types/dump.ts`, `src/types/priorities.ts` — new page-data types (see below).
- `design/spike/component-structure-experiment.md` — 2-line link update for the archive (not read beyond the diff's paths, per brief).
- Docs: `AGENTS.md:115` still uses `PriorityMatrixPage` in the *Production first* Bad example (illustrative, now a stale name; not required by the plan).

## Where the page data types live

- `src/types/`: `BoardData` (`types/board.ts`, pre-existing, used as `BoardPage`'s props), `PrioritiesPageData extends MatrixData` (+`periodKey`, new `types/priorities.ts`), `DumpPageData` and `DumpFeedPage` (new `types/dump.ts`). Matches Projects' `ProjectsPageData` in `types/projects.ts`.
- `src/utils/`: none (adapters import types from `types/`).
- Elsewhere: `MatrixData` / `MatrixActivePlan` stay in `src/services/matrixService.ts` (type-only imports from `types/priorities.ts`, `utils/oneOffUtils.ts` and the scenario page).

## Possible bugs

None seen. Behavior preserved: `togglePopover` (functional `current === taskId ? null : taskId`) is equivalent to the old `onSendToggle(isPopoverOpen ? null : task.id)`; no-plan scenario tabs still show W28 (`SCENARIO_TODAY` = 2026-07-10), dump tabs W29 (`DUMP_TODAY` = 2026-07-16); the layout wrappers keep their classes. Nits: `DumpFeedPage {entries, nextCursor}` overlaps `useDumpFeed`'s `DumpFeedInit` and the action's return shape (DRY); the archived spike's in-text reference to `component-structure-experiment.md` is now relative to the wrong folder (backticked, not a link). Checks (lint/typecheck/tests) were not run, per the read-only brief.
