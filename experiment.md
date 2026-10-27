# page-structure-parallel · try2 — controller log

协议：`experiments/page-structure-parallel/try2/instruction.md`（主仓库分支 `claude/experiments-page-structure-parallel-try1`，PR #91）。Lab 仓库 `Marsuu1994/mars-workbench-lab-try2`。本文件镜像到 lab 仓库的 `controller/try2` 分支。

## 阶段

| 阶段 | 开始（UTC） | 结束 | 备注 |
| --- | --- | --- | --- |
| 0 Fresh start | 2026-10-27 04:54 | 04:58 | 读 instruction、controller-briefs、experiments README、try1 report；dockerd 起来 |
| 1 前置 | 04:58 | 05:14 | worktree `/home/user/base-try2`；起点 `experiment/base-try2` = `83ae5a43` 推到 lab（05:13）；基线：format/lint/typecheck/knip 绿，npm test 416 通过，check:clicks 16/16 · 0 console error（64 s），design-console e2e 7/7；工具在 `experiments/_tools/`；20 份 prompt 冻结在 `try2/prompts/` |
| 2 起 run | 05:14 | 05:34 | 十个 session 05:14:33–05:14:41 创建，base `83ae5a43`，model claude-opus-5-5，env 现有；首次检查 05:35，之后每 30 min；心跳每小时；05:36 首次检查时十个 PR 都已开（05:26:56–05:33:51），九个 session completed，B5 等 CI |
| 3 结束条件 | 05:36 | | 九个 CI 绿，B5 的跑着 |
| 4 收数据 | 05:40 | | 行为检查串行批跑起（A1,B1,…）；十个 transcript subagent |

## 协议偏差 / 判断

- 起点的第四个 commit（PlayRunner）第一版把"只点可见控件"用在所有 play step 上，本地 design-console e2e 抓到 Priorities 的 hover 才显示的 "Move task" 按钮找不到；改成只有同名控件不止一个时才按可见性取舍（83ae5a4）。起点 SHA 从 c544d94 改成 83ae5a4，prompt 重新生成；没有 run 用过旧 SHA。

- Run prompt 的"别看评估文件"一句：instruction 写的是 `experiments/`，但起点树上没有这个目录，评估说明在 `design/spike/component-structure-experiment.md`（和 try1 一样）；prompt 用 try1 的原句指向这个文件。instruction 的 prompt 正文随归档 PR 一起改。

## Run 表

| Run | session | 创建（UTC） | 状态 | PR | T_pages | T_pr | T_green | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | `session_01KCt6pJaBvNn7yvCqBdL9ib` | 05:14:33 | completed | #1（05:26:56，head `6ef9dad8`） | | 12.4 | CI 绿 05:29:57 | $6.66 |
| B1 | `session_01KCt6pMxatw9JrN3TasCRUY` | 05:14:34 | completed | #8（05:31:35，head `c2e7e88a`） | | 17.0 | CI 绿 05:34:47 | $8.37 |
| A2 | `session_01KCt6pNEEiysMZJhTNDRjPF` | 05:14:35 | completed | #4（05:29:41，head `d723edbb`） | | 15.1 | CI 绿 05:33:09 | $6.45 |
| B2 | `session_01KCt6pMa91jhjUM2oez842a` | 05:14:36 | completed | #6（05:30:02，head `e50c7afb`） | | 15.4 | CI 绿 05:33:04 | $8.22 |
| A3 | `session_01KCt6pJr7csnx2HnTic3q2U` | 05:14:37 | completed | #5（05:29:52，head `2ed0bbe6`） | | 15.2 | CI 绿 05:32:50 | $5.93 |
| B3 | `session_01KCt6pLaQcffbbgWyRsYruK` | 05:14:38 | completed | #9（05:32:02，head `0cab8f6f`） | | 17.4 | CI 绿 05:35:11 | $9.72 |
| A4 | `session_01KCt6pJKhmnyCUuHCYcfmPq` | 05:14:38 | completed | #2（05:27:02，head `0abeb057`） | | 12.4 | CI 绿 05:29:55 | $5.95 |
| B4 | `session_01KCt6pJqa8KhamA3TH91m92` | 05:14:39 | completed | #7（05:31:32，head `ba75fce9`） | | 16.9 | CI 绿 05:34:43 | $11.26 |
| A5 | `session_01KCt6pK3LZBUahDFNY2DecX` | 05:14:40 | completed | #3（05:28:20，head `92bc898e`） | | 13.7 | CI 绿 05:31:11 | $6.48 |
| B5 | `session_01KCt6pLLUiRAHZu45QycSRC` | 05:14:41 | idle（PR 开了，等 CI） | #10（05:33:51，head `8d1cb45d`） | | 19.2 | CI 跑着（05:33:55 起） | $9.16 |

## 事故

（无）

## 评审 session

| R | session | 状态 |
| --- | --- | --- |
