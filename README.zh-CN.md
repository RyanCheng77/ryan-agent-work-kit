# Ryan Agent Work Kit

一分钟把项目变成 AI 友好项目。

Ryan Agent Work Kit 帮助 Codex、Claude Code、Cursor 和其他 AI coding agent 更快理解你的项目，在更安全的边界内工作，并留下清楚的交接记录。

English: [README.en.md](README.en.md)

## 为什么需要

很多 AI 编程新手会遇到相同问题：

- 不懂 Git，担心 AI 把项目弄乱。
- 每个 AI 工具都要重复解释项目背景。
- 多工具之间没有共享记忆，浪费 token。
- AI 还没理解规则就开始改文件。
- 任务结束后不知道验证了什么、还有什么风险、下一步做什么。

Ryan Agent Work Kit 给项目加上一套简单标准：

| Before | After |
| --- | --- |
| AI 每次都问项目背景 | AI 先读 `AGENTS.md` |
| 当前目标只在聊天里 | 当前目标写进 `docs/current-goal.md` |
| 可能改错分支或范围 | 一个任务使用一个清楚 lane |
| 多个工具容易互相覆盖 | Agent 有范围、边界和交接规则 |
| 复杂任务难恢复 | 任务卡保存目标、范围、文件、验证和交接 |

## 快速开始

### 1. 设置个人偏好

把模板复制到你的 AI 工具个人偏好里：

- [Codex 中文偏好](personal-preferences/codex.zh-CN.md)
- [Codex 英文偏好](personal-preferences/codex.md)
- [Ryan 完整偏好](personal-preferences/ryan-full.md)
- [Claude Code 偏好](personal-preferences/claude-code.md)

### 2. 初始化中文项目骨架

```bash
./scripts/init-ryan-agent-work-kit.sh --lang zh-CN ./my-project
```

英文默认模板：

```bash
./scripts/init-ryan-agent-work-kit.sh ./my-project
```

脚本会创建：

```text
AGENTS.md
CLAUDE.md
.github/copilot-instructions.md
.cursor/rules/project.mdc
docs/project-overview.md
docs/current-goal.md
docs/roadmap.md
docs/qa/README.md
docs/handoffs/README.md
docs/plans/README.md
```

然后告诉 AI：

```text
先读 AGENTS.md，再帮我安全开始这个任务。
```

### 3. 复杂任务使用任务卡

```bash
cp templates/task-card.zh-CN.md ./my-project/docs/plans/<task-name>.md
```

任务卡不是新流程负担。它的作用是用最少上下文固定目标、范围、相关文件、验证方式和交接格式。

## 核心原则

- AI 先理解项目，再开始执行。
- 项目记忆写进文件，不只留在聊天里。
- 一个任务使用一个 lane。
- 主控 agent 负责验收，子 agent 只做窄任务。
- 少重复解释，少浪费 token，少出错。

## 检查项目是否 AI-ready

```bash
./scripts/check-ai-ready.sh ./my-project
```

更多中文说明见：[docs/quick-start.zh-CN.md](docs/quick-start.zh-CN.md)。
