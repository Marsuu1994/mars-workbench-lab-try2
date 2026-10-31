检查全部通过（format、lint、typecheck、knip、256 个单测），工作区未改动任何受跟踪文件。下面是 R3 的评审结论。

## R3 评审

**总体**：三页（Board、Priorities、Dump）都按 spike 的计划搬到了 Projects 页的结构上，行为没有变化，console 和文档跟着改了。唯一实质遗漏是 spike 本身没有归档。

### 评分

1. **Correctness — 5**。`togglePopover(task.id)` 与原先 `onSendToggle(isPopoverOpen ? null : task.id)` 等价；`isTrackedTask` 经 `getWeekPlacement` 得到的结果与原先 `activePlanId !== null && planId === activePlanId` 在四种组合下完全一致（单测覆盖）。Priorities 的 overlay 原本就在 `flex-col h-full` 那层 div 里（`DragDropContext` 不产生 DOM），搬进 container 后 DOM 结构不变。format、lint、typecheck、knip、单测全绿。
2. **Spec conformance — 4**。改名、三个 context 的字段、六个组件的 props 数量（9→2、9→2、4→1、5→2、6→2、5→1）、两个 adapter 及其单测、inert context、tracker 和 baseline 的改动都与 spike 一一对应。缺的是 `design/spike/README.md` 生命周期第 5 步：完成实现的 PR 要把 spike `git mv` 到 `archived/` 并修链接；spike 仍在原处，`design/tracker.md:33` 还指向旧路径。
3. **Consistency — 4**。三页与 Projects 同构：`types/<feature>.ts` 的 `<Feature>PageData`、`<Feature>PageContext.ts` 同样的注释和 throw、container 里同样的 `pageContext` 字面量、console 的 `inert<Feature>PageContext`。小差异：两个 adapter 一个是 const 箭头函数一个是 function 声明；Dump 的 scenario 包装放在 `page.tsx`，Priorities 的放在 `fixtures.ts`；`DumpPageData` 保留 `initial*` 前缀而其他页用裸行名。
4. **Conventions — 4**。分层、命名、i18n、无 magic literal 都合规；`FALLBACK_QUADRANT` 搬到 `utils/` 是 `groupTasksByQuadrant` 必需的。`DumpFeedResult` 手写了 action 的返回形状，而不是从 `fetchDumpEntriesAction` 的返回类型推导，属 DRY 瑕疵。
5. **Scope — 4**。没有无关改动；遗漏的只有 spike 归档。spike 里要求的 e2e、Board 的 `ui-verifier` 和真实页面点一遍无法从 diff 验证，这里不计分。
6. **Readability — 5**。每页从 route → adapter → container → context → 叶子都能顺着读下来；container 的 `renderMatrix` / `renderClickAwayLayer` / `renderAddTaskModal` 把 return 保持为提纲，context 每个字段都有一句注释说明用途。

### 缺陷清单

- **major** · `design/spike/component-structure.md`（及 `design/tracker.md:33`）· 计划已实现（Plan 按决定推迟），spike 没有 `git mv` 到 `archived/`，tracker 的链接也没改，违反 spike README 生命周期第 5 步。
- **minor** · `src/utils/dump.ts:18` · `DumpFeedResult` 手写 `{data} | {error}`，没有从 `fetchDumpEntriesAction` 的返回类型推导，action 改形状时这里会静默漂移。
- **nit** · `src/utils/oneOffUtils.ts:31` vs `src/utils/dump.ts:27` · 两个 route adapter 写法不一致（const 箭头函数 vs function 声明）。
- **nit** · `src/app/design/scenarios/dump/page.tsx:11` · Dump 的 scenario adapter 包装 `renderDumpPage` 放在 page.tsx，Priorities 的 `prioritiesPage` 放在 fixtures.ts，位置不统一。
- **nit** · `src/components/domain/priorities/PrioritiesPage.tsx:172` · `openAddTask` 是 const 箭头函数，同级的 `trackTask` / `completeTask` 是 function 声明。
- **nit** · `src/types/dump.ts:15` · `DumpPageData` 用 `initialEntries` / `initialNextCursor` / `initialTotalCount`，其他页的 `<Feature>PageData` 直接用行名；spike 没规定名字，仅是风格差异。

```json
{"label": "R3", "scores": {"correctness": 5, "spec": 4, "consistency": 4, "conventions": 4, "scope": 4, "readability": 5}, "defects": [{"severity": "major", "where": "design/spike/component-structure.md; design/tracker.md:33", "what": "The spike's plan is implemented but the spike was not moved to design/spike/archived/ and the tracker still links the old path, against the spike README's lifecycle step 5."}, {"severity": "minor", "where": "src/utils/dump.ts:18", "what": "DumpFeedResult hand-writes the action's {data}|{error} shape instead of deriving it from fetchDumpEntriesAction's return type, so it drifts silently if the action changes."}, {"severity": "nit", "where": "src/utils/oneOffUtils.ts:31 vs src/utils/dump.ts:27", "what": "The two route adapters differ in form (const arrow vs function declaration)."}, {"severity": "nit", "where": "src/app/design/scenarios/dump/page.tsx:11", "what": "Dump's scenario adapter wrapper lives in page.tsx while Priorities' prioritiesPage helper lives in fixtures.ts."}, {"severity": "nit", "where": "src/components/domain/priorities/PrioritiesPage.tsx:172", "what": "openAddTask is a const arrow while its sibling writes trackTask and completeTask are function declarations."}, {"severity": "nit", "where": "src/types/dump.ts:15", "what": "DumpPageData keeps initial*-prefixed prop names while the other pages' <Feature>PageData types name their rows plainly."}]}
```