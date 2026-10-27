# page-structure-parallel · try2 — controller log

协议：`experiments/page-structure-parallel/try2/instruction.md`（主仓库分支 `claude/experiments-page-structure-parallel-try1`，PR #91）。Lab 仓库 `Marsuu1994/mars-workbench-lab-try2`。本文件镜像到 lab 仓库的 `controller/try2` 分支。

## 阶段

| 阶段 | 开始（UTC） | 结束 | 备注 |
| --- | --- | --- | --- |
| 0 Fresh start | 2026-10-27 04:54 | 04:58 | 读 instruction、controller-briefs、experiments README、try1 report；dockerd 起来 |
| 1 前置 | 04:58 | 05:14 | worktree `/home/user/base-try2`；起点 `experiment/base-try2` = `83ae5a43` 推到 lab（05:13）；基线：format/lint/typecheck/knip 绿，npm test 416 通过，check:clicks 16/16 · 0 console error（64 s），design-console e2e 7/7；工具在 `experiments/_tools/`；20 份 prompt 冻结在 `try2/prompts/` |

## 协议偏差 / 判断

- 起点的第四个 commit（PlayRunner）第一版把"只点可见控件"用在所有 play step 上，本地 design-console e2e 抓到 Priorities 的 hover 才显示的 "Move task" 按钮找不到；改成只有同名控件不止一个时才按可见性取舍（83ae5a4）。起点 SHA 从 c544d94 改成 83ae5a4，prompt 重新生成；没有 run 用过旧 SHA。

- Run prompt 的"别看评估文件"一句：instruction 写的是 `experiments/`，但起点树上没有这个目录，评估说明在 `design/spike/component-structure-experiment.md`（和 try1 一样）；prompt 用 try1 的原句指向这个文件。instruction 的 prompt 正文随归档 PR 一起改。

## Run 表

| Run | session | 创建（UTC） | 状态 | PR | T_pages | T_pr | T_green | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | | | | | | | | |
| B1 | | | | | | | | |
| A2 | | | | | | | | |
| B2 | | | | | | | | |
| A3 | | | | | | | | |
| B3 | | | | | | | | |
| A4 | | | | | | | | |
| B4 | | | | | | | | |
| A5 | | | | | | | | |
| B5 | | | | | | | | |

## 事故

（无）

## 评审 session

| R | session | 状态 |
| --- | --- | --- |
