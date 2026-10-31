# Checklist A4: candidate 0abeb0574dd4c63f8b59efbd75d0997d890a9eb8 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

Commits: 045b8f2 Board · fb5afc6 Dump · 0ab0200 Priorities · 0abeb05 Docs (49 files, +748 −602)

| # | Item | Verdict | Evidence |
|---|------|---------|----------|
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | rename `board/{KanbanBoard.tsx => BoardPage.tsx}` (74% similarity); BoardPage.tsx end: `<div className="flex h-full flex-col"><BoardHeader …/><ProgressDashboard {...progress} /><div className="min-h-0 flex-1">{renderBoard()}</div>`; `BoardScreen.tsx` deleted |
| 2 | Route renders `<BoardPage …/>`; no plan still `EmptyBoard` | ✓ | `src/app/kanban/page.tsx`: `return <BoardPage {...board} />;`, EmptyBoard branch untouched |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` no `onPull` | ✓ | `BoardPageContext.ts:10 pullToTodo`; `MobileBacklogCard.tsx`: props `{card}`, `const {pullToTodo} = useBoardPageContext();` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | only doc-comment renames (KanbanBoard → BoardPage) in `boardCardUtils.ts:98`, `BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx`; no code change |
| 5 | Console: board tabs render `BoardPage`; sheet frame + gallery card in inert context | ✓ | `scenarios/board/page.tsx` 2× `<BoardPage`; `MobileBacklogSheetFrame.tsx` `<BoardPageContext value={inertBoardPageContext()}>`; `DomainTab.tsx` MobileBacklogCard section wrapped likewise; `constants.ts inertBoardPageContext` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; deleted | ✓ | rename `{PriorityMatrixPage.tsx => PrioritiesPage.tsx}`; `<div className="flex flex-col h-full"><BoardHeader periodKey={periodKey} />…`; `PrioritiesScreen.tsx` deleted |
| 7 | `periodKey` fallback → `utils/` adapter called by route; unit test; `matrixService` unchanged | ✓ | `oneOffUtils.ts toPrioritiesPageProps({tasks, activePlan}, today)` → `{periodKey: activePlan?.periodKey ?? getISOWeekKey(today), tasks, activePlanId}`; route `<PrioritiesPage {...toPrioritiesPageProps(matrix, getTodayDate())} />`; `oneOffUtils.test.ts` describe('toPrioritiesPageProps') 2 cases; matrixService not in diff |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in `oneOffUtils.ts` with tests; `isTracked` in one place | ✓ | both exported from `oneOffUtils.ts`, tested in new `oneOffUtils.test.ts`; container `useMemo` grouping and both inline `isTracked` gone; one definition, called in PrioritiesPage (trackedCount), MatrixTaskCard, MoveToRows |
| 9 | `PrioritiesPageContext` has all fields | ✓ | `PrioritiesPageContext.ts`: activePlanId, openPopoverTaskId, togglePopover, openMoveToSheet, openAddTask, trackTask, completeTask |
| 10 | Props QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | `{quadrant, tasks}`, `{task, index}`, `{task}`, `{task, variant}`, `{task, onClose}`, `{task}` |
| 11 | Overlays keep props; click-away layer in container | ✓ | MatrixUndoToast/Toast render functions untouched; `TaskModal` same props; `PrioritiesPage.tsx` keeps `fixed inset-0 z-40` click-away div outside Draggables |
| 12 | Console: 7 tabs render `PrioritiesPage`; MobileMoveToPanelScenario + gallery MatrixTaskCard inert-wrapped | ✓ | `scenarios/priorities/page.tsx renderPrioritiesPage` used by 7 tabs (via adapter + `SCENARIO_TODAY`); `MobileMoveToPanelScenario.tsx` `<PrioritiesPageContext value={inertPrioritiesPageContext(activePlanId)}>`; DomainTab MatrixTaskCard wrapped with `MATRIX_CARD_ACTIVE_PLAN_ID`; fixture `isTracked` replaced by `planId` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` capture, captureError, loadMore | ✓ | `DumpPage.tsx` new, `DumpScreen.tsx` deleted (git sees add+delete); `DumpPageContext.ts:10-14` |
| 14 | Route unpacking + `periodKey` → `utils/` adapter with test; no new action/service | ✓ | `utils/dump.ts toDumpPageProps(feed, totalCount, today)`; `dump.test.ts` 2 cases; route `<DumpPage {...toDumpPageProps(feed, totalCount, getTodayDate())} />`; no action/service files in diff |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | `scenarios/dump/page.tsx` 2× `<DumpPage {...toDumpPageProps(...)} />` |
| 16 | No feature component takes a callback prop (overlays/frames excepted) | ✓ | only remaining callback props in the three folders: `MobileBacklogPanel.onClose` (sheet panel, unchanged from base), `MobileMoveToSheet.onClose`, `MatrixUndoToast.onUndo/onDismiss` (overlays) |
| 17 | Context files, hook names, inert helpers follow one pattern = Projects | ✓ | `<Feature>PageContext.ts` + `<Feature>PageContextValue` + `use<Feature>PageContext` throwing `'… must be used within <Feature>Page'`, identical to ProjectsPageContext; `inertBoardPageContext()`, `inertPrioritiesPageContext(activePlanId)` beside `inertProjectsPageContext` (Dump needs none: no specimen reads it). Minor: page-props types named `…PageProps` (Priorities, Dump) vs Projects' `ProjectsPageData` |
| 18 | Nothing outside the plan changed | ✓ | no Plan, auth, app-shell, services, actions or DAL files; small extras listed below (all mechanical or comment-only) |
| 19 | Docs: spike archived + links; tracker sub-items removed; AGENTS.md sentence; README Update Log; baseline Board part | ~ | tracker's Board/Priorities/Dump sub-items + Q9 bullet removed, replaced by "Record the Q9 comparison's results … then archive both" (`tracker.md:73`); AGENTS.md: "Plan is the one page not on it yet, until Phase 2's Plan week (tracker)"; README `### 2026-10-27`; baseline Board bullets renamed to `BoardPage`. **Spike not archived** (`design/spike/component-structure.md` still in place, deliberately deferred until Q9 results), so no link fixes |
| 20 | One commit per page + one docs commit | ✓ | 045b8f2 Board, fb5afc6 Dump, 0ab0200 Priorities, 0abeb05 Docs; no merge commits |

**Score: 19 ✓ · 1 ~ · 0 ✗**

## Props observed

| Component | Base | Candidate | Props now |
|---|---|---|---|
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

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx`: import of `FALLBACK_QUADRANT` moved from `@/components/domain/priorities/constants` to `@/utils/oneOffUtils` (the constant moved with `groupTasksByQuadrant`); `priorities/constants.ts` loses it.
- `src/hooks/useDumpFeed.ts`: doc comment only ("mirroring PriorityMatrixPage" → "mirroring the other pages' containers").
- `src/utils/boardCardUtils.ts`, `board/BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx`, `MobileBacklogPanel.tsx`: doc-comment renames only.
- New type files `src/types/dump.ts`, `src/types/priorities.ts` (not named by the plan, but where Projects keeps its page type).
- Console fixtures: `scenarios/dump/fixtures.ts` (`DUMP_PERIOD_KEY` → `DUMP_TODAY`), `scenarios/priorities/fixtures.ts` (`SCENARIO_TODAY`), `scenarios/board/fixtures.ts` (comments).

## Where the page data types live

- Board: `BoardData` in `src/types/board.ts` (pre-existing; `BoardPage` now takes it directly, its local `KanbanBoardProps` removed).
- Priorities: `PrioritiesPageProps {periodKey, tasks, activePlanId}` in new `src/types/priorities.ts`; the adapter takes `MatrixData` (type import from `src/services/matrixService`).
- Dump: `DumpPageProps {periodKey, initialEntries, initialNextCursor, initialTotalCount}` and `DumpFeedPage {entries, nextCursor}` in new `src/types/dump.ts`.
- Context value types live with their contexts in `src/components/domain/<feature>/<Feature>PageContext.ts`.
- None in `utils/`. Naming differs from Projects (`ProjectsPageData` in `src/types/projects.ts`): `…PageProps` here.

## Possible bugs

None seen. Minor stale text: `AGENTS.md:115` still uses `PriorityMatrixPage` in the "Production first" Bad example (`initialUndoToastTaskId on PriorityMatrixPage`). Behavior-preserving checks done: `togglePopover` (prev === id ? null : id) matches the old `isPopoverOpen ? null : task.id`; the sheet's tracked state now derives from the `sheetTask` snapshot's `planId`, as before; no-plan scenario tabs still show W28 via `SCENARIO_TODAY = new Date(2026, 6, 10)`; dump scenarios still W29 via `DUMP_TODAY`.
