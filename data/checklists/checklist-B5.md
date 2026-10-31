# Checklist B5: candidate 8d1cb45d83887234e99abeb78bbde576324b2b87 vs base 83ae5a4348ba722fb1fbda1d632ef1fb3a059ac5

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `KanbanBoard` → `BoardPage`, absorbs `BoardScreen`; `BoardScreen` deleted | ✓ | rename `board/{KanbanBoard.tsx => BoardPage.tsx}` (73% similarity); BoardPage.tsx:124-131 renders `flex flex-col h-full` › `BoardHeader` › `ProgressDashboard` › `flex-1 min-h-0`; `BoardScreen.tsx` deleted |
| 2 | Route renders `<BoardPage …/>`; no plan still renders `EmptyBoard` | ✓ | app/kanban/page.tsx:20 `return <BoardPage {...board} />;` and the `EmptyBoard` branch is unchanged |
| 3 | `BoardPageContext` provides `pullToTodo`; `MobileBacklogCard` drops `onPull` | ✓ | BoardPageContext.ts:8-11 `{pullToTodo}`; MobileBacklogCard.tsx: `interface MobileBacklogCardProps { card: BoardCard; }` and `const {pullToTodo} = useBoardPageContext();` |
| 4 | `toBoardCards` and the three frames unchanged | ✓ | boardCardUtils.ts, BoardColumn.tsx, DesktopBacklog.tsx and MobileBacklog.tsx change only in doc comments (`KanbanBoard` → `BoardPage`) |
| 5 | Console: both board tabs render `BoardPage`; `MobileBacklogSheetFrame` and the gallery `MobileBacklogCard` wrapped in an inert context | ✓ | scenarios/board/page.tsx:44,57 `<BoardPage`; MobileBacklogSheetFrame.tsx:27 `<BoardPageContext value={inertBoardPageContext()}>`; DomainTab.tsx:171 the same; constants.ts `inertBoardPageContext` |
| 6 | `PriorityMatrixPage` → `PrioritiesPage`, absorbs `PrioritiesScreen`; `PrioritiesScreen` deleted | ✓ | rename (71% similarity); PrioritiesPage.tsx:357-358 `flex flex-col h-full` + `<BoardHeader periodKey={periodKey} />`; `PrioritiesScreen.tsx` deleted |
| 7 | `periodKey` fallback → adapter in `utils/`, called by route, unit-tested; `matrixService` unchanged | ✓ | oneOffUtils.ts `toPrioritiesPageProps({tasks, activePlan}: MatrixData, today)` → `activePlan?.periodKey ?? getISOWeekKey(today)`; priorities/page.tsx:9 `<PrioritiesPage {...toPrioritiesPageProps(matrix, getTodayDate())} />`; oneOffUtils.test.ts has 3 cases (incl. the New Year ISO week); services/ not in the diff |
| 8 | `groupTasksByQuadrant`, `isTrackedTask` in `utils/oneOffUtils.ts` with tests; `isTracked` in one place | ✓ | oneOffUtils.ts exports both (`isTrackedTask` goes through `getWeekPlacement`); tested in oneOffUtils.test.ts; the container's `useMemo` grouping and QuadrantCell's inline `activePlanId !== null && task.planId === activePlanId` are gone. One definition, called from PrioritiesPage (count), MatrixTaskCard and MoveToRows |
| 9 | `PrioritiesPageContext` fields (activePlanId, popover, sheet, add, track, complete) | ✓ | PrioritiesPageContext.ts:12-27: `activePlanId`, `openPopoverTaskId`, `togglePopover`, `openMoveToSheet`, `openAddTask`, `trackTask`, `completeTask` |
| 10 | Props: QuadrantCell 2, MatrixTaskCard 2, MoveToPopover 1, MoveToRows 2, MobileMoveToSheet 2, MobileMoveToPanel 1 | ✓ | `{quadrant, tasks}`, `{task, index}`, `{task}`, `{task, variant}`, `{task, onClose}`, `{task}` |
| 11 | Overlays keep props; click-away layer stays in container | ✓ | MatrixUndoToast.tsx and ui/Toast not in the diff; TaskModal call keeps `isOpen/freshData/onClose/onSaved/mode/quadrant` (inline onSaved extracted to `handleTaskSaved`); PrioritiesPage.tsx:347-353 `renderClickAwayLayer` |
| 12 | Console: 7 tabs render `PrioritiesPage`; `MobileMoveToPanelScenario` and gallery `MatrixTaskCard` wrapped in an inert context | ✓ | scenarios/priorities/page.tsx `renderPrioritiesPage(...)` on Matrix, the 2 popovers, No plan, popover no plan and the 2 Done-toast tabs (7), through the route adapter with `SCENARIO_TODAY`; MobileMoveToPanelScenario.tsx:26 `<PrioritiesPageContext value={inertPrioritiesPageContext(activePlanId)}>`; DomainTab.tsx:232; the tracked fixtures carry `planId: MATRIX_ACTIVE_PLAN_ID` / `SCENARIO_ACTIVE_PLAN.id` |
| 13 | `DumpScreen` → `DumpPage`; `DumpPageContext` provides capture, captureError, loadMore | ✓ | DumpScreen.tsx deleted and DumpPage.tsx added (same body); DumpPageContext.ts:8-15 `{capture, captureError, loadMore}` |
| 14 | Route unpacking + `periodKey` → adapter in `utils/`, unit-tested; no new action/service | ✓ | utils/dump.ts `toDumpPageProps(feed, totalCount, today): DumpPageData`; dump/page.tsx:16 `<DumpPage {...toDumpPageProps(feed, totalCount, getTodayDate())} />`; dump.test.ts adds 2 cases (Sunday-late LA week, error fallback); actions/ and services/ untouched |
| 15 | Console: both dump tabs render `DumpPage` | ✓ | scenarios/dump/page.tsx Feed and Empty both render `<DumpPage {...toDumpPageProps(...)} />` |
| 16 | No feature component in scope takes a callback prop (overlays and behavior frames excepted) | ✓ | grep `on[A-Z]…:` / `=> void` in board/priorities/dump finds only `MobileBacklogPanel.onClose` (sheet frame), `MobileMoveToSheet.onClose` and `MatrixUndoToast.onUndo/onDismiss` (overlays), plus the context interfaces |
| 17 | Context files, hook names and inert helpers follow one pattern, the same as Projects | ✓ | each is `<Feature>PageContext.ts` with `<Feature>PageContextValue`, `createContext<…\|null>(null)`, `use<Feature>PageContext()` throwing "must be used within <Feature>Page", and `const pageContext: <Feature>PageContextValue` in the container; inert helpers `inertBoardPageContext()` and `inertPrioritiesPageContext(activePlanId)` sit next to `inertProjectsPageContext` (Dump has no gallery specimen, so it needs none). Minor: Board keeps its prop type `BoardData`, while the others use `<Feature>PageData` |
| 18 | Nothing outside the plan changed (Plan, auth, app shell, services, actions, DAL) | ✓ | none of those paths is in `--stat`; the small extras are listed below |
| 19 | Docs: spike archived + links; tracker sub-items removed; AGENTS.md sentence; README Update Log; baseline Board part | ~ | Done: tracker's Board/Priorities/Dump sub-items removed and the stale `'use client'` half-sentence dropped from *Uniform page header*; AGENTS.md › Page structure now ends "Plan, the one page not on it yet: tracker › Plan week"; README Update Log 2026-10-27; baseline.md Board bullets renamed (`BoardPage`) and the "move per the tracker" line rewritten. **Not done: the spike is not archived.** `design/spike/component-structure.md` is still in `design/spike/` (unchanged), and the tracker defers the archive until the Q9 write-up ("then the spike moves to `archived/`") |
| 20 | One commit per page + one docs commit | ✓ | 5959354 Board · 5ba4f97 Dump · 35f0bf8 Priorities · 8d1cb45 Docs; linear history, no merges. `src/app/design/README.md` landed in the docs commit |

**Score: 19 ✓ · 1 ~ · 0 ✗**

## Props observed

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

- `src/components/domain/shared/task-modal/TaskModalPanel.tsx`: changes only its import path. `FALLBACK_QUADRANT` moved from `priorities/constants.ts` to `utils/oneOffUtils.ts` so `groupTasksByQuadrant` can use it.
- `src/components/domain/priorities/constants.ts`: `FALLBACK_QUADRANT` removed (the move above).
- `src/hooks/useDumpFeed.ts`: the local `DumpFeedInit` is replaced by `InitialDumpFeed` from `types/dump`, and a doc comment is renamed.
- New type files: `src/types/dump.ts` and `src/types/priorities.ts`.
- Comment-only renames in `BoardColumn.tsx`, `DesktopBacklog.tsx`, `MobileBacklog.tsx`, `MobileBacklogPanel.tsx` and `utils/boardCardUtils.ts`.
- Route default exports renamed to `KanbanPrioritiesPage` and `KanbanDumpPage`, to avoid clashing with the container names. This matches `KanbanProjectsPage` and `KanbanPage`.
- `src/app/design/README.md`: the console rule now covers the new inert contexts and the scenarios' adapters (docs).
- None of these touch Plan, auth, the app shell, services, actions or the DAL.

## Where the page data types live

- **types/**:
  - `types/priorities.ts`: `PrioritiesPageData {periodKey, tasks, activePlanId}`.
  - `types/dump.ts`: `DumpEntriesPage {entries, nextCursor}`, `InitialDumpFeed extends DumpEntriesPage {totalCount}` and `DumpPageData {periodKey, initialFeed}`.
  - Board reuses the existing `types/board.ts` `BoardData` (not renamed to `BoardPageData`).
  - Projects (base) uses `types/projects.ts` `ProjectsPageData`.
- **utils/**: only the adapters, `toPrioritiesPageProps` (oneOffUtils.ts) and `toDumpPageProps` (dump.ts). No types are defined there.
- **Elsewhere**:
  - The context value types sit in each `<Feature>PageContext.ts`.
  - The input type `MatrixData` comes from `services/matrixService` and is imported as a type only into `utils/oneOffUtils.ts`, which is client-safe. That is allowed, since the rule permits `import type`.

## Possible bugs

None seen. Checks made:

- `isTrackedTask` built on `getWeekPlacement` gives the same result as the old `activePlanId !== null && planId === activePlanId`.
- `togglePopover` keeps the old toggle semantics.
- The no-plan scenario header still shows 2026-W28 through `SCENARIO_TODAY`.
- The Dump header still shows 2026-W29 through `DUMP_SCENARIO_TODAY`.
- Typecheck and tests were not run (the audit is read-only through git). The README's claims of 26 e2e tests and a 16/16 click-through are unverified.
