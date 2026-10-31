R5 审阅完毕。范围是 `git diff HEAD~1 HEAD`（47 个文件）、spike 的 Part 1 计划和 AGENTS.md。我在本地跑了 `format:check`、`lint`、`typecheck`、`knip` 和单元测试，全部通过（252 个单测，含新增的两个 adapter 测试文件）；集成和 e2e 需要数据库，未跑。

**评分与证据**

1. **Correctness — 5**。三页行为未变：`togglePopover(id)` 等价于原来的 `onSendToggle(isPopoverOpen ? null : id)`；`BoardPage` 和 `PrioritiesPage` 吸收的布局 wrapper（`flex flex-col h-full` / `flex-1 min-h-0`）原样保留，`DragDropContext` 和 fixed 定位的 click-away 层不产生 DOM 影响；`DumpFeed` 的 effect 依赖 `loadMore` 仍是 `useCallback` 的稳定引用。四项静态检查和单测全绿。
2. **Spec conformance — 4**。三个 context 字段与 spike 逐字一致（Board `{pullToTodo}`、Priorities 七项、Dump 三项），props 缩减到计划数量，两个 adapter 落在 spike 指定的 `oneOffUtils.ts` / `dump.ts` 并带单测，console 的 inert context、fixture `isTracked → planId` 改法、baseline/tracker/AGENTS.md 三处文档都按计划改了。缺一项：spike 实现完成后没有按 `design/spike/README.md` › Lifecycle 第 5 步 `git mv` 到 `archived/`。
3. **Consistency — 4**。三页的 `<Feature>PageContext.ts` 文件形状、throw 文案、route 函数名（`Kanban*Page`）、`pageContext` 对象的建法都和 Projects 一致。不一致处：页面 data 类型的位置，Board/Projects 在 `src/types/`，Priorities/Dump 放进了 `src/utils/`；两个新 adapter 一个是 arrow const、一个是 function 声明。
4. **Conventions — 5**。层级边界守住（utils 只 `import type` services 的类型，ESLint 允许）；`FALLBACK_QUADRANT` 迁到 utils 是 `groupTasksByQuadrant` 的必要结果，`TaskModalPanel` 的 import 同步改了；命名完整、无魔法字面量、无新 i18n 字符串、`switch`/`Record` 规则未触及。
5. **Scope — 4**。没有无关改动；tracker 里 Step 10 的三条已删、Uniform page header 那半句已删。遗漏只有 spike 归档。
6. **Readability — 5**。每页 route → adapter → container → context → leaf 一条线能顺着读下来；container 的 return 保持 outline（`renderBoard()` / `renderMatrix()`），每个 context 字段都有一句注释说明用途。

**缺陷清单**

- **minor** · `design/spike/component-structure.md`（整个文件未动） — 本 PR 完成了 spike 的实现（Plan 已决定推迟），按 spike README 第 5 步应移入 `archived/` 并修正 `design/tracker.md:33` 的链接。
- **minor** · `src/utils/oneOffUtils.ts:33` 和 `src/utils/dump.ts:29` — `PrioritiesPageData` / `DumpPageData` 放在 utils，而 Projects（`src/types/projects.ts`）和 Board（`src/types/board.ts`）的页面 data 类型放在 `src/types/`，位置不统一。
- **nit** · `src/utils/oneOffUtils.ts:41` vs `src/utils/dump.ts:41` — 两个新 adapter 一个 arrow const、一个 function 声明（`toBoardCards` 也是 function）。
- **nit** · `src/utils/oneOffUtils.ts:2` — client-safe 的 utils 反向引用 `services/matrixService` 的 `MatrixData` 类型；合规但让 utils 指向了 server 层，`MatrixData` 更适合落在 `src/types/`。
- **nit** · `src/components/domain/priorities/QuadrantCell.tsx:25` — context hook 插在两个 `useTranslations` 调用中间，分组略乱。

```json
{"label": "R5", "scores": {"correctness": 5, "spec": 4, "consistency": 4, "conventions": 5, "scope": 4, "readability": 5}, "defects": [{"severity": "minor", "where": "design/spike/component-structure.md", "what": "Spike not moved to design/spike/archived/ although this PR finishes its implementation (spike README Lifecycle step 5); design/tracker.md:33 still links the unarchived path."}, {"severity": "minor", "where": "src/utils/oneOffUtils.ts:33, src/utils/dump.ts:29", "what": "PrioritiesPageData and DumpPageData live in src/utils/ while the Projects and Board page data types live in src/types/."}, {"severity": "nit", "where": "src/utils/oneOffUtils.ts:41, src/utils/dump.ts:41", "what": "The two new route adapters differ in style: toPrioritiesPageProps is an arrow const, toDumpPageProps (and toBoardCards) a function declaration."}, {"severity": "nit", "where": "src/utils/oneOffUtils.ts:2", "what": "A client-safe util imports the MatrixData type from the server-only services layer; allowed as import type, but the type belongs in src/types/."}, {"severity": "nit", "where": "src/components/domain/priorities/QuadrantCell.tsx:25", "what": "usePrioritiesPageContext() sits between two useTranslations calls, splitting the hook grouping."}]}
```