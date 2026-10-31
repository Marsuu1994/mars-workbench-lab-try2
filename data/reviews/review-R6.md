审查完成。本地验证结果：`format:check`、`lint`、`typecheck`、`knip` 全部通过，`test:unit` 30 个文件 260 个用例全部通过（集成测试与 e2e 需要数据库，未跑）。

## 评分

**1. Correctness — 5**
三页行为逐条可追溯为等价：`isTrackedTask` 经 `getWeekPlacement` 判定 THIS_WEEK，与旧的 `activePlanId !== null && planId === activePlanId` 结果一致；`togglePopover(task.id)` 与旧的 `onSendToggle(isPopoverOpen ? null : id)` 等价；`DragDropContext` 不产生 DOM，Priorities 把它移进 `flex flex-col h-full` 内不改变布局；Board/Dump 的 wrapper 原样搬进 container。lint/typecheck/unit 全绿。

**2. Spec conformance — 5**
与 spike 每页计划一一对应：三个改名（`BoardPage`/`PrioritiesPage`/`DumpPage`）、三个 context 的字段与 spike 树完全相同、props 数量按表落地（QuadrantCell 9→2、MatrixTaskCard 9→2、MoveToPopover 4→1、MoveToRows 5→2、Sheet 6→2、Panel 5→1、DumpComposer 2→0、DumpFeed 4→3）、两个 route adapter 加 `groupTasksByQuadrant`/`isTrackedTask` 均带单测、console 的 inert context 放在 constants、scenario 走同一 adapter、baseline/tracker/AGENTS.md/console README 均按计划改。

**3. Consistency — 4**
三页都是 `types/<feature>.ts` 数据接口 → route 调 adapter → `<Feature>Page` 提供 `<Feature>PageContext`，context 文件注释和 throw 文案与 Projects 同模板。小瑕疵：`toPrioritiesPageProps` 是箭头 const 而 `toDumpPageProps` 是 function 声明；priorities fixture 标注了 `MatrixData` 类型而 dump 的 `DUMP_FEED_PAGE` 未标注。

**4. Conventions — 4**
分层、命名、i18n、无 magic literal、文件位置都合规；`FALLBACK_QUADRANT` 迁到 utils 消除了 shared 组件对 priorities/constants 的跨 feature 依赖。未遵守 `design/spike/README.md` 生命周期第 5 步：完成实现的 PR 应 `git mv` spike 到 `archived/` 并修链接。

**5. Scope — 5**
未见无关改动；计划内每项（含 tracker 里失效半句的删除、README 中 `inert*` 说明）都在。Plan 页按 Q5 决定不动。

**6. Readability — 5**
每页从 route 一行 `<XPage {...adapter(...)} />` 到 leaf 的 `useXPageContext()` 都能顺着读；container 的 return 是 `renderMatrix()/renderClickAwayLayer()/...` 大纲，context 接口逐字段有注释。

## 缺陷清单

- **minor** · `design/spike/component-structure.md`（整文件）· 实现落地后 spike 仍留在 `design/spike/`，未按 spike README 第 5 步移到 `archived/`，`design/tracker.md:33` 的链接也未更新。
- **nit** · `src/utils/oneOffUtils.ts:29` vs `src/utils/dump.ts:93` · 两个 route adapter 一个用箭头 const、一个用 function 声明，同类函数风格不一。
- **nit** · `src/utils/dump.ts:94` · 参数类型 `{data: DumpEntriesPage} | {error: unknown}` 手写而非从 `fetchDumpEntriesAction` 的返回类型推导，action 返回形状变化时可能漂移。
- **nit** · `src/app/design/scenarios/dump/fixtures.ts:59` · `DUMP_FEED_PAGE`/`DUMP_EMPTY_PAGE` 未标注类型，而 priorities 的同类 fixture 标注了 `MatrixData`。
- **nit** · `src/components/domain/priorities/PrioritiesPage.tsx:185` · `togglePopover` 是 context 对象里的内联闭包，其余 handler 都是具名函数；同文件新增的 `openAddTask`/`handleTaskSaved` 用箭头而 `trackTask`/`completeTask` 用 function 声明。
- **nit** · `src/app/design/tabs/DomainTab.tsx:232` · 每张 `MatrixTaskCard` specimen 各包一个 `PrioritiesPageContext` provider，可以按 fixture 的 `activePlanId` 分组后共用。

未能在本审查中验证：spike 要求 Board 搬动 layout wrapper 后做一次 `ui-verifier` 浏览器检查，diff 中无法判断是否执行。

```json
{"label": "R6", "scores": {"correctness": 5, "spec": 5, "consistency": 4, "conventions": 4, "scope": 5, "readability": 5}, "defects": [{"severity": "minor", "where": "design/spike/component-structure.md", "what": "Spike not moved to design/spike/archived/ after its implementation landed (spike README step 5); tracker.md:33 link not updated."}, {"severity": "nit", "where": "src/utils/oneOffUtils.ts:29 / src/utils/dump.ts:93", "what": "toPrioritiesPageProps is an arrow const while toDumpPageProps is a function declaration; sibling adapters differ in style."}, {"severity": "nit", "where": "src/utils/dump.ts:94", "what": "The feed parameter type is hand-written rather than derived from fetchDumpEntriesAction's return type, so it can drift."}, {"severity": "nit", "where": "src/app/design/scenarios/dump/fixtures.ts:59", "what": "DUMP_FEED_PAGE / DUMP_EMPTY_PAGE carry no type annotation while the priorities fixtures are typed MatrixData."}, {"severity": "nit", "where": "src/components/domain/priorities/PrioritiesPage.tsx:185", "what": "togglePopover is an inline closure in the context object while the other handlers are named; new arrow handlers sit beside function-declaration handlers."}, {"severity": "nit", "where": "src/app/design/tabs/DomainTab.tsx:232", "what": "Each MatrixTaskCard specimen gets its own PrioritiesPageContext provider inside the map instead of one shared per activePlanId."}]}
```