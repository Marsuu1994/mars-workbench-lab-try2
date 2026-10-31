审查完成。静态检查全部通过：`typecheck`、`lint`、`knip`、`format:check` 零报错，30 个单测文件 258 个用例通过（integration / e2e 需要数据库，未跑）。

**1. Correctness — 5**
三页的 handler 语义逐一对得上：`togglePopover` 的 prev 比较等价于旧的 `onSendToggle(isPopoverOpen ? null : id)`，sheet 和 popover 里的 `isTracked` 改成在 `MoveToRows` 用同一个 task 快照算，`pullToTodo`、`capture`、`loadMore` 只是换了取法。布局 wrapper（`flex flex-col h-full` + `flex-1 min-h-0`）原样搬进 container，`DragDropContext` 仍包住 sheet、toast 和 modal，`onDragStart` 关 popover 的行为保留。

**2. Spec conformance — 4**
每页计划项都落了：三个 `<Feature>Page` + `<Feature>PageContext.ts`，context 字段和 spike 一字不差（Priorities 的 7 个、Board 的 `pullToTodo`、Dump 的 `capture · captureError · loadMore`），prop 数量（QuadrantCell 9→2、MatrixTaskCard 9→2、MoveToRows 5→2、MobileMoveToSheet 6→2、DumpComposer 2→0、DumpFeed 4→3）、两个 adapter 及其单测、console 的 inert context 和 adapter 复用、baseline / tracker / AGENTS.md / console README 都按计划改。缺的一项：spike 没有 `git mv` 到 `archived/`，而 `design/spike/README.md` › Lifecycle 第 5 步要求完成实现的 PR 做这件事（Plan 已由 Decision 推迟到 Phase 2，和 `board-prop-drilling` 的归档先例一致）。

**3. Consistency — 5**
三个 context 文件同一个模板（接口 + doc、`createContext<… | null>`、`use<Feature>PageContext` 在 provider 外 throw），container 里都是 `const pageContext: <Feature>PageContextValue = {…}` 后接 render 函数，route 都是 `Kanban<Feature>Page` 一行渲染，inert context 都在 `design/constants.ts`，adapter 都在 `src/utils/` 带单测——和 `ProjectsPage` / `ProjectsPageContext` 完全同形。

**4. Conventions — 4**
Layers、命名（`trackTask`、`tasksByQuadrant`、`openMoveToSheet`）、`Record<PriorityQuadrant, …>`、`import type` 跨 server 边界、无 magic literal 都守住了；`FALLBACK_QUADRANT` 随 `groupTasksByQuadrant` 迁到 utils 是必要的（utils 不能 import components）。扣分点：`DumpFeedResult` 手写了 action 的返回 union 而不是从 `fetchDumpEntriesAction` 推导（DRY）；AGENTS.md:115 的 Bad 例子仍叫 `PriorityMatrixPage`；spike 未归档。

**5. Scope — 5**
diff 里没有无关改动：`TaskModalPanel` 只换了 `FALLBACK_QUADRANT` 的 import 路径，`useDumpFeed` 只改了注释里的组件名，tracker 的 *Uniform page header* 半句按 spike 要求删掉。计划内的实现项没有遗漏（Plan 按 Decision 推迟）。

**6. Readability — 5**
每页都能从 route 一行读到 adapter、container、context 再到叶子；`PrioritiesPage` 的 return 拆成 `renderMatrix` / `renderPopoverClickAway` / `renderTaskModal`，比旧版 70 行的 JSX 块清楚得多；每个 context 字段都有一句 doc。

**Defects**

- **major** · `design/spike/component-structure.md` · 实现本 spike 的 PR 没把它移到 `design/spike/archived/`，违反 `design/spike/README.md` › Lifecycle 第 5 步。
- **minor** · `AGENTS.md:115` · "Bad: `initialUndoToastTaskId` on `PriorityMatrixPage`" 引用了本 diff 删掉的组件名，应改为 `PrioritiesPage`。
- **nit** · `src/utils/dump.ts:87` · `DumpFeedResult` 重新声明了 `fetchDumpEntriesAction` 的返回形状，而不是 `Awaited<ReturnType<typeof fetchDumpEntriesAction>>`，action 形状变化时只能靠 route 调用点报错。
- **nit** · `src/components/domain/priorities/PrioritiesPage.tsx:172` · 新加的 `openAddTask` 是 const 箭头函数，旁边同为 context handler 的 `trackTask` / `completeTask` 是 function 声明，同一组东西两种写法。

未能核验：spike 要求的 `ui-verifier`（Board 5 个 tab）和 e2e 跑过没有，这从 diff 里看不出来。

```json
{"label": "R1", "scores": {"correctness": 5, "spec": 4, "consistency": 5, "conventions": 4, "scope": 5, "readability": 5}, "defects": [{"severity": "major", "where": "design/spike/component-structure.md", "what": "The PR that finishes the spike's implementation did not git mv it to design/spike/archived/, as design/spike/README.md › Lifecycle step 5 requires."}, {"severity": "minor", "where": "AGENTS.md:115", "what": "The Bad example still names PriorityMatrixPage, a component this diff renamed to PrioritiesPage."}, {"severity": "nit", "where": "src/utils/dump.ts:87", "what": "DumpFeedResult re-declares fetchDumpEntriesAction's result union instead of deriving it from the action's return type."}, {"severity": "nit", "where": "src/components/domain/priorities/PrioritiesPage.tsx:172", "what": "openAddTask is a const arrow while the sibling context handlers trackTask and completeTask are function declarations."}]}
```