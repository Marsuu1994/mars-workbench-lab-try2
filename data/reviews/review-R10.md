审查完成。结论先行：R10 实现质量很高，三页按 spike 的逐页计划落地，自动检查全绿，只有几处文档/生命周期层面的小问题。

**验证方式**：读完 `git diff HEAD~1 HEAD` 全部 49 个文件、spike Part 1 和 AGENTS.md；本地跑了 `format:check`、`lint`、`typecheck`、`knip`、`test:unit`，全部通过（260 个单测）。e2e 和 ui-verifier 的浏览器检查不在本次审查可验证范围内。

**逐项评分**

1. **Correctness — 5**。三页的 DOM 结构和原来逐层一致（Board 的两层布局 wrapper、Priorities 的 header + matrix、Dump 完全相同）；`isTrackedTask` 经 `getWeekPlacement` 实现，语义与旧的 `activePlanId !== null && planId === activePlanId` 等价；`togglePopover` 的函数式更新等价于旧的三元切换；`sheetTask` 改为按 id 从 `localTasks` 派生，与原快照行为一致且更符合「派生不入 state」。
2. **Spec conformance — 5**。三个 context 的字段与 spike 树图逐字一致（Board `{pullToTodo}`、Dump `{capture, captureError, loadMore}`、Priorities 七个字段）；props 缩减数全部命中（QuadrantCell 9→2、MatrixTaskCard 9→2、MoveToPopover 4→1、MoveToRows 5→2、Sheet 6→2、Panel 5→1、DumpComposer 2→0、DumpFeed 4→3）；两个 adapter 放在指定文件并带单测；console、baseline、tracker 的改动与计划一致。
3. **Consistency — 5**。三个 `*PageContext.ts` 与 `ProjectsPageContext.ts` 同一模板（注释、`createContext<… | null>`、`use` + throw）；`types/<feature>.ts` 的 `*PageData`、`to<Feature>PageProps`、`inert<Feature>PageContext`、route 默认导出 `Kanban<Feature>Page` 全部对齐 Projects 页。
4. **Conventions — 4**。分层、命名、i18n、常量（`MATRIX_CARD_ACTIVE_PLAN_ID`、`DUMP_TODAY`）都合规；`FALLBACK_QUADRANT` 迁到 utils 消除了 shared → priorities 的反向依赖。扣分点：`DumpFeedResult` 手写了 action 返回形状的平行定义；AGENTS.md 的 Bad 示例仍引用已不存在的 `PriorityMatrixPage`。
5. **Scope — 4**。没有无关改动，`FALLBACK_QUADRANT` 的迁移是 adapter 进 utils 的必要前提。遗漏：spike 的最后一个计划 PR 已落地，但 spike 仍在 `design/spike/` 未按 README 生命周期第 5 步移入 `archived/`。
6. **Readability — 5**。每页从 route → adapter → `<Feature>Page` → context → 叶子一条线可循；container 的 `renderColumns` / `renderMatrix` 让 return 保持大纲式；每个 context 字段都有一句注释。

**缺陷清单**

- minor · `design/spike/component-structure.md` · spike 实现完毕后仍留在 `design/spike/`，README 生命周期要求在完成实现的 PR 里 `git mv` 到 `archived/`。
- nit · `AGENTS.md:115` · Bad 示例里的 `PriorityMatrixPage` 已改名为 `PrioritiesPage`，名字过时。
- nit · `src/utils/dump.ts:88` · `DumpFeedResult` 手写了 `fetchDumpEntriesAction` 的返回形状，可直接用 `Awaited<ReturnType<typeof fetchDumpEntriesAction>>` 派生，避免两处定义漂移。

```json
{"label": "R10", "scores": {"correctness": 5, "spec": 5, "consistency": 5, "conventions": 4, "scope": 4, "readability": 5}, "defects": [{"severity": "minor", "where": "design/spike/component-structure.md", "what": "Spike still sits in design/spike/ although its last planned PR landed; the spike README's lifecycle step 5 says to git mv it to archived/ in that PR."}, {"severity": "nit", "where": "AGENTS.md:115", "what": "The Bad example still names PriorityMatrixPage, which this change renamed to PrioritiesPage."}, {"severity": "nit", "where": "src/utils/dump.ts:88", "what": "DumpFeedResult re-declares fetchDumpEntriesAction's result shape by hand instead of deriving it from the action's return type."}]}
```