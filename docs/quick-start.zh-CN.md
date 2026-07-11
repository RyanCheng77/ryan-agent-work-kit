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

## 可选：理解小闭环

Ryan Agent Work Kit 的 Loop Engineering 轻量版不是自动化大系统，而是让 AI 工作形成小闭环：

```text
目标清楚 → 上下文克制 → 执行可见 → 验证明确 → 经验可沉淀
```

详见：`docs/loop-engineering.zh-CN.md`。

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
