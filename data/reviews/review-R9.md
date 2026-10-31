审查完成。工作树未改动；本地跑了 `format:check`、`lint`、`typecheck`、`knip` 和 250 个单元测试，全部通过（集成和 e2e 需要 Postgres，未跑）。

## 评分

**1. Correctness — 5**
三页的 DOM 结构和 handler 语义逐一对照旧代码后一致：Board 的 `flex-col h-full` / `flex-1 min-h-0` 两层原位搬进 `BoardPage`；Priorities 的 toast、sheet、modal 仍是矩阵根 div 的兄弟节点，`togglePopover(taskId)` 的 toggle 语义等价于旧的 `onSendToggle(isPopoverOpen ? null : id)`；Dump 的 `loadMore` 仍是 `useCallback` 稳定引用，effect 依赖不变。"No plan" scenario 的 badge 从固定 `periodKey` 改为由 `NOW` 推导，`NOW`（2026-07-10）落在 W28，与原值相同。

**2. Spec conformance — 4**
三页的 context 字段、props 缩减数（QuadrantCell 9→2、MatrixTaskCard 9→2、MoveToRows 5→2、MobileMoveToSheet 6→2、DumpComposer 2→0、DumpFeed 4→3）、两个 adapter 的签名和位置、`groupTasksByQuadrant` / `isTrackedTask` 及其单元测试、console 的 `inert*PageContext` 与 fixture `planId` 改法、baseline/tracker/AGENTS.md 三处文档，全部与 spike 一致。缺的是 spike README 第 5 步：实现落地的 PR 应 `git mv` spike 到 `archived/` 并修链接，R9 没做。

**3. Consistency — 5**
三页与 Projects 页同构：route 命名 `Kanban<Feature>Page`，`src/types/<feature>.ts` 的 `<Feature>PageData` 作 container 的 props 类型，`<Feature>PageContext.ts` 的接口注释、`createContext<... | null>` 和 `use<Feature>PageContext()` 的 throw 文案格式与 `ProjectsPageContext` 逐字同款，`pageContext` 对象在 container 内同样方式构造。

**4. Conventions — 5**
Layers 守住了：routes 只经 action，utils 对 service 只 `import type`；`FALLBACK_QUADRANT` 搬到 `utils/oneOffUtils.ts` 后，`domain/shared/` 的 `TaskModalPanel` 不再反向 import 一个 feature 的 constants，顺带修正了一处层级倒置。命名完整、没有新的魔法字面量、无 i18n 变动需求、lint/knip 零告警。

**5. Scope — 4**
没有无关改动；`TaskModalPanel` 的 import 变动由常量搬家连带，合理。遗漏项同第 2 条：spike 归档。

**6. Readability — 5**
每页从 route → adapter → container → context → leaf 都能线性读下来；container 的 return 是 `renderMatrix()` / `renderAddModal()` / `renderBoard()` 这类大纲；context 接口每个字段都有一句说明。

## 缺陷清单

- **minor** · `design/spike/component-structure.md`（整文件）· Board/Priorities/Dump 是 spike 剩下的实现项（Plan 已决定推迟），按 `design/spike/README.md` 第 5 步本 PR 应把它移到 `archived/` 并修 `design/tracker.md:33` 的链接，R9 未做。
- **nit** · `AGENTS.md:115` · "Bad: `initialUndoToastTaskId` on `PriorityMatrixPage`" 仍用旧组件名，应改为 `PrioritiesPage`。
- **nit** · `src/types/priorities.ts:1` · `PrioritiesPageData extends MatrixData`，让 `src/types` 依赖 service 的类型；`types/board.ts` 的 `BoardData` 是自含定义，方向相反，二选一统一更好。
- **nit** · `src/components/domain/board/BoardPage.tsx:125` · 外层 class 写成 `flex h-full flex-col`，而 `DumpPage.tsx:41` 和 `PrioritiesPage.tsx:371` 沿用 `flex flex-col h-full`；三页同一层的 wrapper 顺序不一致。
- **nit** · `src/components/domain/priorities/PrioritiesPage.tsx:88` · 去掉了分组的 `useMemo`，而 `BoardPage.tsx:31` 的 `toBoardCards` 仍包 `useMemo`；两页对「每次 render 算一次」的写法不统一（React Compiler 开着，功能上无差）。

```json
{"label": "R9", "scores": {"correctness": 5, "spec": 4, "consistency": 5, "conventions": 5, "scope": 4, "readability": 5}, "defects": [{"severity": "minor", "where": "design/spike/component-structure.md", "what": "Spike not moved to design/spike/archived/ (and tracker.md:33 link not updated) although this PR finishes its remaining implementation, as design/spike/README.md step 5 requires."}, {"severity": "nit", "where": "AGENTS.md:115", "what": "Stale component name PriorityMatrixPage in the Production-first example; should read PrioritiesPage."}, {"severity": "nit", "where": "src/types/priorities.ts:1", "what": "PrioritiesPageData extends a service type (MatrixData), unlike BoardData/ProjectsPageData which are self-contained in src/types."}, {"severity": "nit", "where": "src/components/domain/board/BoardPage.tsx:125", "what": "Outer wrapper class order 'flex h-full flex-col' differs from DumpPage/PrioritiesPage's 'flex flex-col h-full'."}, {"severity": "nit", "where": "src/components/domain/priorities/PrioritiesPage.tsx:88", "what": "groupTasksByQuadrant runs unmemoized while BoardPage still wraps toBoardCards in useMemo; the two containers derive differently."}]}
```