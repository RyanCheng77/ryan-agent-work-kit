# 快速开始

## 1. 设置个人偏好

把适合你的模板复制到 AI 工具的个人偏好或自定义指令里：

- Codex 中文新手版：`personal-preferences/codex.zh-CN.md`
- Codex 英文新手版：`personal-preferences/codex.md`
- Ryan 完整方法：`personal-preferences/ryan-full.md`
- Claude Code：`personal-preferences/claude-code.md`

这是用户级规则。它告诉 agent：你希望跨项目都用什么方式工作。

这组偏好也会让 agent 默认采用 AI 原生工作方式：JIT 规划、任务卡、原型验证、重复流程自动化和工作流审视。

## 2. 给项目加上 AI 友好目录

当前仓库方式：

```bash
./scripts/init-ryan-agent-work-kit.sh --lang zh-CN ./my-project
```

也可以使用本地 Node CLI：

中文模板：

```bash
node bin/ryan-agent-work-kit.js init --lang zh-CN ./my-project
```

英文模板：

```bash
node bin/ryan-agent-work-kit.js init ./my-project
```

npm 包发布后可使用：

```bash
npx ryan-agent-work-kit init --lang zh-CN ./my-project
```

脚本会创建项目规则和文档，不会覆盖已有文件。

其中 `docs/visual-explanation.zh-CN.md` 会告诉 agent：回答里出现流程、分支判断、任务编排、状态流转或系统关系时，优先用 Mermaid 图辅助说明；`docs/design-principles.zh-CN.md` 补充了解耦和 UI/交互的轻量尼尔森原则检查；`docs/hits-hots-collaboration.zh-CN.md` 说明普通协作中人如何持续参与，以及高风险动作如何暂停等待明确决策；`docs/taskboard-ego-workflow.zh-CN.md` 则说明 Taskboard、Codex、ego browser、Git 和项目 docs 的分工。复杂 UI/演示需求再考虑可视化草图、截图、HTML mockup 或 Hyperframes。

## 3. 在 AI 工具中打开目标项目

告诉 agent：

```text
先读 AGENTS.md，再帮我安全开始这个任务。
```

## 4. 使用默认任务流程

agent 应该：

1. 读取 `AGENTS.md`。
2. 读取 `docs/current-goal.md`。
3. 检查项目状态。
4. 在一个任务 lane 内工作。
5. 执行验证。
6. 汇报风险和下一步。

如果任务本身包含流程或协作路径，agent 应优先用 Mermaid 图说明关键路径。

## 5. 检查项目是否 AI-ready

```bash
node bin/ryan-agent-work-kit.js check ./my-project
```

如果想做更完整的体检：

```bash
node bin/ryan-agent-work-kit.js doctor ./my-project
```

`doctor` 会检查：

- 必需的 `AGENTS.md` 和 `docs/` 项目记忆。
- Claude Code、Cursor、GitHub Copilot 的适配文件。
- `.agent-runs/` 是否被 `.gitignore` 忽略。
- 是否能看到测试、构建或 README 等基础验证信号。
- 当前是否在默认分支。
- 顶层目录是否有明显不该公开的本地文件名。

它只提醒，不会修改文件。

本仓库脚本方式：

```bash
./scripts/check-ai-ready.sh ./my-project
```

## 可选：使用任务卡

复杂或需要恢复上下文的任务，可以复制中文任务卡到项目里：

```bash
cp templates/task-card.zh-CN.md ./my-project/docs/plans/<task-name>.md
```

任务卡适合这些情况：

- 任务会在新会话继续。
- 子 agent 或外部 CLI 会处理部分工作。
- 任务有严格范围或验证要求。
- 你想减少重复解释和 token 消耗。

有协作或委派时，只补充真正有用的 HITS 字段：协作状态、Ryan 介入点、决策负责人和升级条件。详见 `docs/hits-hots-collaboration.zh-CN.md`。

### 可选：使用轻量决策门

如果任务容易返工、要委托给 agent、涉及外部工具，或完成标准不够清楚，再复制：

```bash
cp templates/decision-gate.zh-CN.md ./my-project/docs/plans/<task-name>-decision-gate.md
```

它受 Jev 一类结构化判断思路启发，但不要求安装 Jev 或接入外部服务。小任务直接做，不要为了填表增加负担。详见 `docs/structured-decision-gates.zh-CN.md`。

## 可选：让 S2/S3 任务可恢复

跨会话、长等待、外部 agent 或需要独立复核时，再复制状态和验证模板：

    cp templates/active-task-state.zh-CN.md ./my-project/docs/handoffs/active-task-state.zh-CN.md
    cp templates/verification-brief.zh-CN.md ./my-project/docs/qa/verification-brief.zh-CN.md

状态文件记录恢复摘要，验证简报记录完成定义和证据。S0/S1 不需要它们；doctor 也不会因缺少它们而报警。

## 可选：接入 Taskboard 与 ego browser

Taskboard 只记录跨会话、需要验收、多 agent/外部工具参与或容易返工的工作。它是任务生命周期与验收事实源；不要把 HITS 执行状态一一映射到看板状态，也不要写入私密日志、会话或登录态。

需要真实网页状态时再使用 ego browser 做隔离操作、截图或冒烟验证。登录、验证码、付款、授权、删除、发布等动作需要 Ryan 明确接管或批准。完整规则见 `docs/taskboard-ego-workflow.zh-CN.md`。

## 可选：从会议纪要进入行动闭环

当 Ryan 明确提供会议纪要并要求跟进时，先把 Ryan 本人的行动项写进 `templates/meeting-action-plan.json` 对应的结构化计划，再先预览、后写入：

```bash
node scripts/ryan-personal-loop.js validate meeting-actions.json
node scripts/ryan-personal-loop.js preview meeting-actions.json --taskboard-project your-project-id
```

详见 `docs/personal-loop.zh-CN.md`。高风险、人工执行或等待决策的事项会留在 `backlog`，不会被自动认领。

## 可选：把 Kimi CLI 作为子 agent

Kimi CLI 和其他外部工具共用 `AGENTS.md` 与任务卡契约。先从可观察的规划或评审任务开始：

```bash
./scripts/run-observable-cli.sh --name kimi-plan -- \
  kimi --plan --output-format stream-json -p "只评审任务卡指定的文件，不修改文件。"
```

提示词保持窄范围，不传密钥或私有数据；完成后结合日志、diff 和验证证据再采纳结果。

## 可选：审视重复工作流

如果一个流程重复 3 次以上，或者开始消耗太多时间、token、沟通和返工成本，可以复制工作流审视模板：

```bash
cp templates/workflow-review.zh-CN.md ./my-project/docs/plans/<workflow-name>-review.md
```

用它判断这个流程应该保留、简化、自动化、替换还是停用。

## 可选：记录多 agent 协作质量

如果任务涉及子 agent、外部 CLI agent、等待、返工或低采纳，可以记录一条 AgentOps 观察：

```bash
cat <<'EOF' | ./scripts/record-agent-ops-observation.sh
## Observation
- project: my-project
- task_id: 2026-06-example
- trigger_reason: multi_agent
- route: S2
- task_type: qa
- agents_used: 1
- agent_roles: readonly-reviewer
- wall_time_min: 12
- agent_wait_time_min: 3
- local_work_while_waiting: yes
- acceptance: partial
- rework_count: 1
- error_type: low_quality
- validation_evidence: test + diff review
- evidence_ref: local check summary
- lesson: Use a narrower reviewer task card next time.
EOF
```

这个记录不追踪 token。它只帮助你判断下次怎样更少返工、更快交付、更会协作。

## 可选：AI 协作自检

如果任务复杂、返工、验证不足，或你觉得“这次慢、绕、重复消耗、不该这么拆”，可以复制 4D 自检模板：

```bash
cp templates/ai-collaboration-reflect.zh-CN.md ./my-project/docs/handoffs/<task-name>-reflect.md
```

它只问四件事：

- 委托：这件事是否交给了合适的 AI、agent 或工具？
- 描述：目标、范围、验收和禁止事项是否说清？
- 判断：AI 结果是否有测试、diff、截图、日志或人工确认？
- 审慎：是否守住隐私、安全、公开包和最小披露边界？

它不是评分系统，只用于找下一次最值得改的一件事。

## 可选：理解小闭环

Ryan Agent Work Kit 的 Loop Engineering 轻量版不是自动化大系统，而是让 AI 工作形成小闭环：

```text
目标清楚 → 上下文克制 → 执行可见 → 验证明确 → 经验可沉淀
```

详见：`docs/loop-engineering.zh-CN.md`。

## 可选：接入动态记忆后端

如果本机已经运行 MemOS，可以把它作为动态历史经验层使用。先阅读 docs/memory-governance.zh-CN.md 和 docs/memory-adapter-contract.zh-CN.md。

召回内容只是不可信的历史参考；项目规则、当前任务、测试、验收证据和 Ryan 明确决定优先。后端不可用时，任务仍应依赖项目文件继续工作。

Codex、Claude、Cursor、Copilot、Trae 和 Kimi 共用 scripts/ryan-memory-adapter.js。它只写短的已验证候选摘要，MemOS 不可用或未授权时退回被忽略的本地存储。开启 MemOS 模式前先读 docs/memory-client-adapters.zh-CN.md。

## 可选：接入 Obsidian 知识库

如果你想把项目经验、交接、复盘和 AgentOps 写入自己的 Obsidian vault：

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

之后可以写入项目经验：

```bash
cat <<'EOF' | ./scripts/sync-project-learning.sh --project "my-project"
## Summary

- A narrower task card reduced rework.

## Evidence

- Smoke test passed.

## Next Adjustment

- Use the same validation checklist next time.
EOF
```

这个能力只写本地 Markdown，不上传、不登录、不读取整个知识库。
