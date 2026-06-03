# 快速开始

## 1. 设置个人偏好

把适合你的模板复制到 AI 工具的个人偏好或自定义指令里：

- Codex 中文新手版：`personal-preferences/codex.zh-CN.md`
- Codex 英文新手版：`personal-preferences/codex.md`
- Ryan 完整方法：`personal-preferences/ryan-full.md`
- Claude Code：`personal-preferences/claude-code.md`

这是用户级规则。它告诉 agent：你希望跨项目都用什么方式工作。

## 2. 给项目加上 AI 友好目录

中文模板：

```bash
./scripts/init-ryan-agent-work-kit.sh --lang zh-CN ./my-project
```

英文模板：

```bash
./scripts/init-ryan-agent-work-kit.sh ./my-project
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
