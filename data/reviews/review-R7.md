审查完成。工具检查全部通过：`format:check`、`lint`、`typecheck`、`knip` 均为 0 退出码，单元测试 30 个文件 252 条全部通过。工作树未改动。e2e 和浏览器检查未运行，无法从 diff 判断 Board 布局搬迁是否做过 `ui-verifier`。

**评分与证据**

| 维度 | 分 | 证据 |
| --- | --- | --- |
| Correctness | 5 | 三页 handler 函数体原样搬迁，DOM 层级与删除的 Screen 完全一致；`togglePopover` 的 `prev === id ? null : id` 等价于原 `onSendToggle(isPopoverOpen ? null : id)`；console 的 tracked fixture 已用 `planId` 对齐 `activePlanId`。 |
| Spec | 4 | 改名、三个 context 字段、props 数量（QuadrantCell 9→2、MatrixTaskCard 9→2、DumpComposer 2→0 等）、两个 adapter 及其 unit test、`groupTasksByQuadrant`/`isTrackedTask`、inert context、baseline/tracker/AGENTS.md 都按 spike 落地；但 spike 本身没有按 lifecycle 第 5 步移入 `archived/`。 |
| Consistency | 4 | 三个 `*PageContext.ts` 与 `ProjectsPageContext.ts` 同构（null context + `use()` + throw），route 函数名统一为 `Kanban<Feature>Page`，scenario 统一经 adapter 喂数据；页面输入类型命名不一致：`ProjectsPageData`/`BoardData` 对 `PrioritiesPageProps`/`DumpPageProps`。 |
| Conventions | 4 | 层级边界、命名、常量、i18n 均合规，`isTracked` 两处重复收敛成一个纯函数；`DumpFeedInit` 与新建的 `DumpFeedPage` 共享核心却未 extend。 |
| Scope | 4 | 无无关改动；`FALLBACK_QUADRANT` 迁到 utils 是 `groupTasksByQuadrant` 的必要前提，合理；遗漏 spike 归档。 |
| Readability | 5 | route → adapter → `<Feature>Page` → context → 叶子，每页一条路径；容器 JSDoc 说清了 state 归属，Dump 为何不走 `useOptimisticTasks` 也写进了 baseline。 |

**缺陷**

- **major** `design/spike/component-structure.md:1` — spike 计划已全部实现（Plan 按决定推迟），按 `design/spike/README.md` 第 5 步应在本 PR `git mv` 到 `archived/` 并修 `design/tracker.md:33` 的链接。
- **minor** `src/types/priorities.ts:9`、`src/types/dump.ts:14` — 页面输入类型叫 `*PageProps`，参照页用 `ProjectsPageData`、Board 用 `BoardData`，三种命名并存。
- **minor** `src/hooks/useDumpFeed.ts:34` — `DumpFeedInit` 与 `DumpFeedPage` 的 `entries`/`nextCursor` 重复声明，应 `extends DumpFeedPage` 只加 `totalCount`。
- **nit** `AGENTS.md:115` — Bad 示例仍引用已不存在的 `PriorityMatrixPage`。
- **nit** `src/components/domain/board/BoardPage.tsx:126` — 容器根 class 写成 `flex h-full flex-col`，Dump 和 Priorities 为 `flex flex-col h-full`。
- **nit** `src/utils/dump.ts:95` — adapter 参数手写 `{data} | {error: unknown}` 联合，而非引用 action 的返回类型，action 形状变化时不会报错。

```json
{"label": "R7", "scores": {"correctness": 5, "spec": 4, "consistency": 4, "conventions": 4, "scope": 4, "readability": 5}, "defects": [{"severity": "major", "where": "design/spike/component-structure.md:1", "what": "The spike is fully implemented but still sits in design/spike/ instead of being git mv'd to archived/ with its tracker link fixed, as the spike README's step 5 requires."}, {"severity": "minor", "where": "src/types/priorities.ts:9", "what": "Page input types are named PrioritiesPageProps / DumpPageProps while the reference page uses ProjectsPageData and Board uses BoardData, leaving three naming schemes."}, {"severity": "minor", "where": "src/hooks/useDumpFeed.ts:34", "what": "DumpFeedInit redeclares entries and nextCursor instead of extending the new DumpFeedPage type."}, {"severity": "nit", "where": "AGENTS.md:115", "what": "The Bad example still names PriorityMatrixPage, a component this change deleted."}, {"severity": "nit", "where": "src/components/domain/board/BoardPage.tsx:126", "what": "Root class order 'flex h-full flex-col' differs from the 'flex flex-col h-full' used by DumpPage and PrioritiesPage."}, {"severity": "nit", "where": "src/utils/dump.ts:95", "what": "toDumpPageProps hand-types the action result as {data} | {error: unknown} rather than deriving it from fetchDumpEntriesAction's return type."}]}
```