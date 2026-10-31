审查完成，工具链全部跑过。结论和评分如下。

**核对结果**

- `format:check`、`lint`、`typecheck`、`knip` 全部通过，`test:unit` 30 个文件 254 个用例全绿（含新增的 `oneOffUtils.test.ts` 和 `dump.test.ts` 里的 adapter 测试）。
- 三页的每个 handler 都能从 route 追到叶子：Board 的 `pullToTodo`、Dump 的 `capture / captureError / loadMore`、Priorities 的七个 context 字段都与 spike 树一一对应。`togglePopover` 用函数式 setState 实现，与旧的 `onSendToggle(isPopoverOpen ? null : id)` 语义一致；`isTracked`、`hasActivePlan` 的推导位置下移到 `MatrixTaskCard` / `MoveToRows`，结果不变。
- 旧组件名在代码、e2e、design 文档里都已清干净，只剩 AGENTS.md 第 115 行一个历史 Bad 示例。
- 三个 scenario 页都改为渲染 container 并复用 route 的 adapter；`SCENARIO_TODAY` / `DUMP_TODAY` 算出的周与原先硬编码的 `periodKey` 相同（W28 / W29），console 画面不变。
- 无法从 diff 判断的两项：spike 要求 Board 布局搬迁后做一次 `ui-verifier`，以及 e2e 是否跑过；这是单个 squash commit，「一页一个 commit」也无法核对。

**评分**

1. Correctness 5：静态检查和单测全绿，所有写入路径保留，没有发现行为变化。
2. Spec conformance 5：改名、context 字段、props 数量（9→2、9→2、4→1、5→2、6→2、5→1）、两个 adapter 及其测试、console 的 inert context、baseline / tracker / AGENTS.md 的句子、spike 归档，全部按 Part 1 落地。
3. Consistency 5：三页与 Projects 用同一套命名和文件布局——`<Feature>Page`、`<Feature>PageContext.ts` 同样的注释与 throw、`pageContext` 变量、`types/<feature>.ts` 的 `<Feature>PageData`、route 函数 `Kanban<Feature>Page`、`inert<Feature>PageContext`，adapter 测试连 `sunday` 夹具都一致。
4. Conventions 4：命名、分层、常量都合规；扣分点是 `DumpFeedInit` 与新 `DumpFeedPage` 重复两个字段没有 extends，以及 AGENTS.md 里残留已删组件名。
5. Scope 5：没有无关改动；`FALLBACK_QUADRANT` 迁到 `oneOffUtils` 是 `groupTasksByQuadrant` 必需的，顺带去掉了 `shared/` 对 `priorities/` 的反向依赖。
6. Readability 5：每个 container 和 context 都有一段说明其职责的 JSDoc，route 只剩一行 adapter 调用。

**缺陷清单**

- minor · `AGENTS.md:115` · Bad 示例仍写 `PriorityMatrixPage`，该组件本次已改名为 `PrioritiesPage`。
- nit · `src/hooks/useDumpFeed.ts:34` · `DumpFeedInit` 手写 `entries` / `nextCursor`，与 `src/types/dump.ts` 的 `DumpFeedPage` 重复，按 DRY 规则应 extends。
- nit · `src/utils/dump.ts:93` · adapter 参数类型 `{data: DumpFeedPage} | {error: unknown}` 是手写的 action 结果形状，action 返回类型变了这里不会跟着报错。
- nit · `src/components/domain/priorities/PrioritiesPage.tsx:89` · spike 写的是替掉 container 里的 `useMemo` 分组，这里只换了函数体仍保留 `useMemo`；React Compiler 开着，属多余但无害，且与 `ProjectsPage` 用法一致。

```json
{"label": "R2", "scores": {"correctness": 5, "spec": 5, "consistency": 5, "conventions": 4, "scope": 5, "readability": 5}, "defects": [{"severity": "minor", "where": "AGENTS.md:115", "what": "The Bad example still names PriorityMatrixPage, which this change renamed to PrioritiesPage."}, {"severity": "nit", "where": "src/hooks/useDumpFeed.ts:34", "what": "DumpFeedInit re-declares entries and nextCursor instead of extending the new DumpFeedPage type."}, {"severity": "nit", "where": "src/utils/dump.ts:93", "what": "The adapter's feed parameter hand-writes the action's result shape rather than deriving it, so a changed action return type would not be caught here."}, {"severity": "nit", "where": "src/components/domain/priorities/PrioritiesPage.tsx:89", "what": "The useMemo around groupTasksByQuadrant is kept although the spike asked to replace the useMemo grouping and the React Compiler already memoizes."}]}
```