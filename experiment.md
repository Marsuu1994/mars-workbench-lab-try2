# page-structure-parallel · try2 — controller log

协议：`experiments/page-structure-parallel/try2/instruction.md`（主仓库分支 `claude/experiments-page-structure-parallel-try1`，PR #91）。Lab 仓库 `Marsuu1994/mars-workbench-lab-try2`。本文件镜像到 lab 仓库的 `controller/try2` 分支。

## 阶段

| 阶段 | 开始（UTC） | 结束 | 备注 |
| --- | --- | --- | --- |
| 0 Fresh start | 2026-10-27 04:54 | 04:58 | 读 instruction、controller-briefs、experiments README、try1 report；dockerd 起来 |
| 1 前置 | 04:58 | 05:14 | worktree `/home/user/base-try2`；起点 `experiment/base-try2` = `83ae5a43` 推到 lab（05:13）；基线：format/lint/typecheck/knip 绿，npm test 416 通过，check:clicks 16/16 · 0 console error（64 s），design-console e2e 7/7；工具在 `experiments/_tools/`；20 份 prompt 冻结在 `try2/prompts/` |
| 2 起 run | 05:14 | 05:34 | 十个 session 05:14:33–05:14:41 创建，base `83ae5a43`，model claude-opus-5-5，env 现有；首次检查 05:35，之后每 30 min；心跳每小时；05:36 首次检查时十个 PR 都已开（05:26:56–05:33:51），九个 session completed，B5 等 CI |
| 3 结束条件 | 05:36 | | 九个 CI 绿，B5 的跑着 |
| 4 收数据 | 05:40 | | 行为检查串行批跑起（A1,B1,…）；十个 transcript subagent 05:41 起、十个清单 subagent 05:45 起；05:46 撞到账号用量限制（21 个 subagent 并发），05:50 重置后 05:52 先恢复 11 个 transcript/首检 subagent，清单的稍后（05:58 先恢复 5 个）；行为检查 05:41–05:55 十个分支都 16/16、0 console error（每个分支约 80 s，冷服务器也没失败） |
| 5 盲审 | 05:52 | 暂停 | 十个 review 分支 05:52–05:54 建好推到 lab（base commit `c9784f40`，scrub 泄漏 grep 只剩通用条目）；十个评审 session 05:54:36–05:54:44 创建 |

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

## 首次检查（05:36）

- 十个 run 全部在 05:26:56–05:33:51 开出 PR，九个 session completed，B5 等 CI（05:38:13 绿）。CI 十个都第一次就绿。
- B 组五个都合规：`setup -- --no-db` 结束后 23–35 s 内一条消息里派出三个 worktree agent，没有等数据库（db-setup.log 第一次被看是第一次 cherry-pick 时，约 05:18–05:19）；主 session 没自己写页面代码（B4 在合并时 Edit 过一次 `src/app/design/constants.ts` 解冲突）。五个都在 Priorities agent 还在跑时先 cherry-pick 了 Board 和 Dump。
- effort：init 事件里没有 effort 字段（只有 `per_turn_effort_active: true`），`get_session` 也没有；按配置（起点的 `.claude/settings.json`）应为 high，未能验证。

## PR 描述里看到的（05:59）

- 十个 PR 都是 4 个 commit、无 merge commit，CI 第一次推就绿，自报 e2e 26/26、check:clicks 16/16、ui-verifier PASS（起点修掉 play-step 问题后六个 run 提到 390 px 下桌面 tab 的 play 会打开手机 sheet，都判为 pre-existing、不改）。
- Spike 归档：A1、A2、A3 归档并改链接（含用 sed 改 experiment 文件里的路径、没打开）；A4、A5 和 B 组五个都不归档（理由都是 Q9 结果要写进 spike、experiment 文件链接着它）。
- B4：三个 agent 的 worktree 建在 `96d9c63`（lab 的 main）而不是起点 `83ae5a4`，agent 各自把 commit 挪到起点上再提交；worktree 里 knip 报 `scripts/` 未用（起点本身就这样，主 checkout 干净）。
- B1、B3：grep 链接时打印了 experiment 文件的几行（没打开文件），PR 里自己披露。
- Priorities 的页面类型放哪：B2 放在 `utils/`（和 try1 的 B1 一样），B4、B5 的主 session 把 agent 放在 utils 的类型挪到 `types/`；A 组都在 `types/`。

## 事故

- 05:46 账号用量限制（five_hour 窗口，05:50 重置）打断了 21 个 subagent（10 transcript、10 清单、1 首检）；05:52 恢复了 11 个，05:58 又恢复 5 个清单的，05:54 起了十个评审 session。
- 05:59–06:05 新窗口（05:50–10:50）在约 9 分钟内被耗尽：十个评审 session（fable，high，每个 $2.7–4.2、cache read 1.6–3.4M）+ 17 个 subagent（fable，继承主 session 的 effort max）+ 主 session 自己（context 46 万 token，每次工具往返都重读）。九个评审 session 中途 failed（R1–R3、R5–R10），R4 显示 review_ready；清单审计 0/10 写出；transcript 8/10 写出（缺 B4、B5）；PR 描述导出的 subagent 没来得及写文件。
- 11:18 限制重置后按 owner 要求暂停：没有恢复任何 subagent 或评审 session，心跳任务已停（trig_019H7aDpmxErKvst3RUrxTbN enabled=false），等 owner 决定怎么继续。
- 原因分析见给 owner 的消息（11:20）。
- 17:05 owner 发现 PR #91 diff 3.3 万行：81% 是导出的 patch（try2/takeaways §2 有拆分、原因、对 limit 的影响和四个选项）；没动分支。
- 18:50 owner 问中途改协议和暂停的影响：答案记在 takeaways §3、§4。owner 说晚点给继续的指示；在那之前不起任何 subagent 或评审 session。
- 18:45 十个 run session 的 usage 重新拉了一遍（都已 idle，是最终值）：B5 从 $9.16 修正为 $9.39（首检后多了一轮等 CI 的 turn），其余不变；A 均值 $6.30、B $9.39，1.49 倍。十个 run 的 `rate_limit_info.resetsAt` 都是 05:50，最后活动 05:30–05:38，两次撞限都没碰到 run。
- 16:50 按 owner 要求把 drain 的经过、原因和对策写成 `try2/takeaways.md`（归档分支），experiments README 的 Controller notes 加一条窗口规则，README Update Log 当天条目重写。

## 评审 session

| R | session | 状态 |
| --- | --- | --- |
| R1 | `session_01KCt6pLmW7pbkc8N5AYCfHi` | working（05:54 创建） |
| R2 | `session_01KCt6pLjii8hGXpQuDQbyZ3` | working（05:54 创建） |
| R3 | `session_01KCt6pMxyxJLEfCpQL2sLKi` | working（05:54 创建） |
| R4 | `session_01KCt6pMy88qbg4DRcfJupLJ` | working（05:54 创建） |
| R5 | `session_01KCt6pK3geD5XxZqtY3SB4g` | working（05:54 创建） |
| R6 | `session_01KCt6pMk1qy7WjCHRAvuMCg` | working（05:54 创建） |
| R7 | `session_01KCt6pNLN4wDvSzvZSmLzJu` | working（05:54 创建） |
| R8 | `session_01KCt6pLAAr9Dvk7pNTK56Lf` | working（05:54 创建） |
| R9 | `session_01KCt6pMad3TEgd2M8nEtfbn` | working（05:54 创建） |
| R10 | `session_01KCt6pHruDYkUaMWkqvdXR1` | working（05:54 创建） |

## 2026-10-28 owner 宣告 try2 失败

- owner 宣告 try2 失败（结果不采用），暂不清理：session 不归档、lab 仓库不动、归档分支不改；owner 要先 review instruction。owner 的看法：run 的代码没必要保留（都在 lab 仓库），归档留一份 high level 的 instruction 就够；下一轮要把 budget 纳入 setup（主 session、run、评审的模型分开定）。
- owner 把 harness engineering 做成系列（tracker 新开 `Harness engineering` 一节：setup、1a 页面结构 / 1b error framework、2 每阶段的模型和 effort、3 code review agent）；本 session 聚焦 1a 和 setup，之后回到实验。
- 已有的 run 阶段数据完整可用（十个 run 的 T_pr、T_green、成本、行为检查、B 组合规），缺的是清单审计和盲审。

## 2026-10-29 收口的决定

- owner：page structure 不再测，try2 跑完就 wrap up；放几天，额度重置后用 Opus 的 controller session 补完（评审由 code review agent 或 Opus session 做）。
- T_pages 从 8 份 transcript 算出：A 7.3 / 7.8 / 7.8 / 7.5 / 8.5（均值 7.8），B1–B3 8.4 / 8.3 / 9.7（均值 8.8）；B 的关键路径是 Priorities agent（6.8–7.4 min，冷启动加最大的一页），串行 session setup 后写三页 6.3–7.3 min；B 合并后到 PR 的尾巴也更长（7.1–8.6 对 4.6–6.7 min）。H1 目前不成立，H2 不成立，H3 成立。
- 归档分支 `9ef4359`（PR #91）：去掉 `try2/data/patches/`；experiments README 改成原始测量留在 lab 仓库（归档不删）、加 `_tools/` 和预算模板行、Controller notes 改角色规则；try2 instruction Status 改 paused、加"预算和角色"一节、改第 4–7 步和差异表；takeaways §4 加决定；tracker 1a 改下一步；README Update Log 10-29。
- 盲审 setup 推到 `claude/code-reviewer-agent-spike`（PR #82，commit `9197799`）：`try2/review-setup.md` 加 `_tools/make-review-branch.sh`、`scrub.py`、十份评审 prompt、模板、scrub 规则、controller-briefs，路径和归档分支一致。
- 仍未动：二十个 session（都 idle）、lab 仓库、patch 以外的归档内容、心跳（停着）。

## 待 owner 决定（随继续的指示一起）

1. patch 的处理：去掉（留 diffstat，lab 仓库归档不删）/ 推 run 分支到主仓库 / 只留推荐 run 的 / 保持并加 `.ignore`。去掉的话：加删除 commit，还是从分支历史里拿掉 `ec1647e` 再 force push。
2. 盲审：重跑九个（R4 保留）还是 `send_message` 续跑；重跑用 `try2/prompts/review-R*.txt` 原文、同一批 review 分支、新 session，一个窗口刚重置时单独起。
3. 剩余 subagent（清单审计 ×10、B4/B5 transcript、评审收集）的模型和 effort；不说就沿用 fable、继承 max，但一次只起 2–3 个。
4. instruction 要不要按 takeaways §3 的记法改（第 6、7 步和收数据的执行方式），Status 行注明。

## 恢复步骤（owner 给指示后）

1. `get_session` 看 `rate_limit_info`；评审放在窗口开头，期间不起 subagent。
2. 盲审按决定执行；完成后一个 subagent 收齐十份 JSON 并审计（有没有 GitHub 工具、别的 ref）。
3. 收数据串行：B4、B5 transcript（续 agent a37e0a9055a2b8171 / a4b6b63aa9ad3c592，或脚本）；清单审计一次 2–3 个（agent id 在 §4 收数据的记录里，可续）；PR 描述从 lab 仓库 PR #1–#10 重新拉（`pull_request_read` get）存 `try2/data/pr-<RUN>.md`。
4. 汇总脚本出表（transcript 指标、成本、T_pr/T_green、清单、行为、评审），H1–H4 判定，和 try1 并排；报告 `try2/report.md`。
5. 推荐 run 的分支同名推到主仓库、对 `main` 开 PR；归档 PR 更新（README Update Log、tracker）；二十个 session 归档；lab 仓库交 owner。

## 2026-10-31 决定

- PR #91 合并（main 上 `experiments/` 只留 README、AGENTS.md、CLAUDE.md 和每个 try 的 instruction / report）；try2 的完整协议、模板、工具、controller notes 在本分支 `protocol/`、`tools/`。
- 盲审：按原协议重跑全部十份，R4 也重跑（十个新 session，`claude-fable-5-1`，`source_revision` 各自的 `experiment/review-R<n>`，prompt 是 `protocol/prompts/review-template.txt` 填 `{R}`，effort 来自 review 分支上的 settings 文件 = high）。窗口刚重置时单独起，期间不起 subagent；先查 `rate_limit_info`。10-27 那十个评审 session 作废，不续跑。
- 盲审跑完后：收齐十份 JSON 并审计（一个 subagent，`protocol/prompts/controller-briefs.md` › Review collection），结果先给 owner 看，再做清单审计、B4/B5 transcript 和报告。
- `experiment-controller` skill（tracker › Harness engineering › Setup）：try2 收完之后在新 session 单独开 PR；controller notes（`protocol/controller-notes.md`）变成 SKILL.md，加 session usage、transcript metrics、窗口预算、review 分支、行为检查五个脚本，`disable-model-invocation`，起点分支要删掉 skill。

