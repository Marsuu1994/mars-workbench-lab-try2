审查完成。先说验证结果：我在这份 checkout 上跑了 `format:check`、`lint`、`typecheck`、`knip`，全部通过；单测 30 个文件 258 条全部通过。集成测试和 e2e 需要本地 Postgres 和浏览器栈，没有跑。

**逐项评分**

1. **Correctness — 5**。三页的 DOM 结构和 handler 语义与改前一致：`BoardPage` 把 `BoardScreen` 的两层 wrapper 原样吸收，`PrioritiesPage`、`DumpPage` 同理；`togglePopover` 的 current===id→null 逻辑等价于原来的 `onSendToggle(isPopoverOpen ? null : id)`；sheet 从存 `TaskItem` 快照改为存 `sheetTaskId` 再从 `localTasks` 派生，只会让 sheet 跟上乐观更新。所有读 context 的 specimen（`MobileBacklogCard`、`MatrixTaskCard`、`MobileMoveToPanel`）在 console 里都包了 inert context，不会触发 provider 外的 throw。
2. **Spec conformance — 5**。三页的改名、删 screen 层、context 字段（Priorities 的七个字段和 spike 列的一字不差）、props 缩减数（9→2、9→2、4→1、5→2、6→2、5→1、2→0、4→3）、两个 adapter 的位置和签名（`toPrioritiesPageProps(matrix, today)` 在 `oneOffUtils.ts`，`toDumpPageProps(feed, totalCount, today)` 在 `dump.ts`）、`groupTasksByQuadrant` / `isTrackedTask` 加 unit test、console 用同一 adapter 转 fixture、`isTracked` fixture 改为 `planId`、baseline/AGENTS/tracker/console README 的更新、spike 归档并修链接，全部落地。
3. **Consistency — 4**。三个 context 文件与 `ProjectsPageContext.ts` 同构（interface、`createContext(null)`、同句式的 throw），三个 container 都以 `<Feature>PageContext value={pageContext}` 包 `flex flex-col h-full`，inert context 都在 console 的 `constants.ts`。两处不齐：`PrioritiesPageData` 是 `extends` service 层的 `MatrixData`，而 `BoardData`、`ProjectsPageData`、`DumpPageData` 都从 DAL 类型自建；`BoardPage` 里 `pageContext` 声明夹在两个 render 函数之间，其他两页都放在 handler 之后。
4. **Conventions — 5**。route→action→container 的分层守住了，service 类型只以 `import type` 进入客户端代码；`FALLBACK_QUADRANT` 随 `groupTasksByQuadrant` 一起迁到 utils 并更新了 `TaskModalPanel` 的 import；新增字面量 `MATRIX_CARD_PLAN_ID` 进了常量；没有新增用户文案；`isTracked` 从两处计算收成一个纯函数。
5. **Scope — 5**。改动都围绕三页和它们的 console、文档；`useDumpFeed` 注释里删掉 `PriorityMatrixPage` 的引用属于改名收尾。spike 计划的项没有遗漏。
6. **Readability — 5**。每页从 route 一行 adapter 调用到 container，再到 context 和叶子都能顺着读；container 的 return 保持 outline（`renderBoard()` / `renderMatrix()`），context 字段都有一行注释。

**缺陷清单**

- minor · `AGENTS.md:115` · UI Workflow 的 Bad 示例仍写 `PriorityMatrixPage`，这个组件本次已改名为 `PrioritiesPage`。
- minor · `src/types/priorities.ts:1` · `PrioritiesPageData extends MatrixData` 让 `src/types` 依赖 `src/services`，与 `BoardData`、`ProjectsPageData` 由 DAL 类型自建的写法不一致。
- nit · `src/components/domain/board/BoardPage.tsx:77` · `pageContext` 声明在 `renderDraggableCards` 和 `renderMobileBacklogCards` 之间，Projects 和 Priorities 都放在 handler 之后、render 函数之前。
- nit · `src/app/design/scenarios/priorities/page.tsx:28-140` · 同一句 `toPrioritiesPageProps({tasks: …, activePlan: …}, SCENARIO_TODAY)` 展开写了七遍，一个 fixture helper 会更好读。
- nit · `src/app/design/scenarios/priorities/MobileMoveToPanelScenario.tsx:10` · `activePlanId` 的注释写 "The week the task could be tracked into"，它是 plan id 不是 week。

```json
{"label": "R4", "scores": {"correctness": 5, "spec": 5, "consistency": 4, "conventions": 5, "scope": 5, "readability": 5}, "defects": [{"severity": "minor", "where": "AGENTS.md:115", "what": "The UI Workflow 'Bad' example still names PriorityMatrixPage, which this change renamed to PrioritiesPage."}, {"severity": "minor", "where": "src/types/priorities.ts:1", "what": "PrioritiesPageData extends the service-layer MatrixData, so src/types now depends on src/services, unlike BoardData and ProjectsPageData which are built from DAL types."}, {"severity": "nit", "where": "src/components/domain/board/BoardPage.tsx:77", "what": "pageContext is declared between two render functions, whereas ProjectsPage and PrioritiesPage declare it after the handlers and before the render functions."}, {"severity": "nit", "where": "src/app/design/scenarios/priorities/page.tsx:28-140", "what": "The same toPrioritiesPageProps({tasks, activePlan}, SCENARIO_TODAY) call is spelled out seven times; a fixture helper would read better."}, {"severity": "nit", "where": "src/app/design/scenarios/priorities/MobileMoveToPanelScenario.tsx:10", "what": "The activePlanId prop doc says 'The week the task could be tracked into' but the value is a plan id."}]}
```