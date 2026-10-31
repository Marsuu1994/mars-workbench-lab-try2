检查全部跑完（format、lint、typecheck、knip、Vitest 全套均通过），现在汇总评审结论。

## R8 评审结论

**验证结果**：`prettier --check`、`eslint`、`tsc --noEmit`、`knip` 均无输出；Vitest 50 个文件 434 通过、2 个预期失败（既有的 `it.fails`）。e2e 和 ui-verifier 未在本环境运行。

### 评分

1. **Correctness — 5**。三页的 DOM 结构与改动前逐层一致（Board 的两层高度盒子、Priorities 的 `BoardHeader` + `DragDropContext`、Dump 原样）；`sheetTask` 从 state 对象改为按 id 在 `localTasks` 里派生，`togglePopover` 的 toggle 语义与原 `onSendToggle(isPopoverOpen ? null : id)` 等价；gallery 的 `MatrixTaskCard` 和 sheet scenario 的 tracked 状态靠 fixture 的 `planId` 与 context 的 `activePlanId` 对上，结果不变。
2. **Spec conformance — 5**。三页改名、删掉三个 screen、三个 `<Feature>PageContext` 字段与 spike 的树逐项一致；Priorities 的 props 数量正好是 spike 列的 9→2、9→2、4→1、5→2、6→2、5→1；两个 route adapter 落在 spike 指定的 `oneOffUtils.ts` / `dump.ts` 并带单测；console、`baseline.md`、tracker（含 Uniform page header 那半句）、AGENTS.md 那一句、spike 归档都做了。
3. **Consistency — 5**。三个 context 文件、三个 container 的 `pageContext` 字面量 + `<XPageContext value>`、三个 route 的 `Kanban<Feature>Page` 默认导出、`types/priorities.ts` / `types/dump.ts` 与 `types/projects.ts` 同形，inert context 都放在 console 的 `constants.ts`，和 Projects 页一模一样。
4. **Conventions — 4**。分层、命名、i18n、无魔法字面量都守住了，`FALLBACK_QUADRANT` 挪进 utils 还顺带解掉了 `domain/shared` 反向 import `domain/priorities` 的问题；但 AGENTS.md 里还留着一处 `PriorityMatrixPage`，`utils/dump.ts` 手写了一份 action 返回类型（DRY）。
5. **Scope — 5**。改动全部在 spike 列的范围内；`TaskModalPanel` 的 import 变更和 `useDumpFeed` 的注释改名都是改名的必然连带，没有漏项。
6. **Readability — 5**。每个 container 的 JSDoc 说清了它拥有什么、组件从哪取写入；return 保持 outline（`renderMatrix` / `renderPopoverClickAway` / `renderAddTaskModal`），从 route → adapter → container → context → leaf 一路可追。

### 缺陷清单

- **minor** · `AGENTS.md:115` · "Bad: `initialUndoToastTaskId` on `PriorityMatrixPage`" 仍引用已删除的组件名，本 diff 改了 AGENTS.md 却漏了这一处。
- **minor** · `src/utils/dump.ts:88-90` · `DumpFeedResult` 手写复刻 `fetchDumpEntriesAction` 的返回形状（`{data}` | `{error}`），action 改形状时这里不会报错；可用 `import type` + `Awaited<ReturnType<typeof fetchDumpEntriesAction>>` 派生。
- **nit** · `src/app/design/scenarios/priorities/fixtures.ts:14,18` · `NOW` 和新加的 `SCENARIO_TODAY` 各自硬编码同一天 2026-07-10，一个可由另一个派生。
- **nit** · `src/components/domain/priorities/PrioritiesPage.tsx:175-185` · context 字面量里只有 `togglePopover` 是 inline 箭头函数，其余 handler 都是具名函数，读起来不齐。
- **nit** · `src/utils/dump.ts:97` 对比 `src/utils/oneOffUtils.ts:96` · 两个 route adapter 一个是 `function` 声明一个是 `const` 箭头，各随所在文件的风格，但两页的同类函数写法不一。

```json
{"label": "R8", "scores": {"correctness": 5, "spec": 5, "consistency": 5, "conventions": 4, "scope": 5, "readability": 5}, "defects": [{"severity": "minor", "where": "AGENTS.md:115", "what": "The Production-first rule's Bad example still names the deleted PriorityMatrixPage; the diff edited AGENTS.md but missed this reference."}, {"severity": "minor", "where": "src/utils/dump.ts:88-90", "what": "DumpFeedResult hand-copies fetchDumpEntriesAction's return shape instead of deriving it with import type + Awaited<ReturnType<...>>, so the two can drift without a type error."}, {"severity": "nit", "where": "src/app/design/scenarios/priorities/fixtures.ts:14,18", "what": "NOW and the new SCENARIO_TODAY both hardcode 2026-07-10; one should derive from the other."}, {"severity": "nit", "where": "src/components/domain/priorities/PrioritiesPage.tsx:175-185", "what": "togglePopover is the only context handler defined inline in the literal while every other one is a named function."}, {"severity": "nit", "where": "src/utils/dump.ts:97 vs src/utils/oneOffUtils.ts:96", "what": "The two route adapters are written as a function declaration and a const arrow respectively; the same kind of function reads differently across the two pages."}]}
```