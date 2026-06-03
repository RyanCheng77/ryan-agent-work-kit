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

### 4. 重复流程做工作流审视

如果一件事重复发生 3 次以上，或者某个流程开始消耗大量时间、token、沟通和返工成本，用工作流审视模板判断它应该保留、简化、自动化、替换还是停用：

```bash
cp templates/workflow-review.zh-CN.md ./my-project/docs/plans/<workflow-name>-review.md
```

## 这个工具包做什么

```text
个人偏好
  ↓
用户提出任务
  ↓
Agent 读取 AGENTS.md
  ↓
Agent 检查当前目标和项目状态
  ↓
必要时创建或读取任务卡
  ↓
Agent 在一个任务 lane 内工作
  ↓
Agent 验证结果
  ↓
Agent 留下交接记录
```

## 适合谁

- AI 编程新手，不想一开始就被 Git 和仓库管理卡住。
- 同时使用 Codex、Claude Code、Cursor 或多个 AI 工具的人。
- 希望每次 AI 会话都先理解同一套项目事实的小团队。
- 关心低 token 成本、少重复解释、少 AI 乱改的人。

## 核心 Skill

你不需要先理解 skill 系统。先用项目模板即可。遇到需要时，agent 可以推荐：

- `ryan-simple-git-workflow`：给新手用的安全 Git 和任务 lane 指南。
- `ryan-multi-ai-repo-governance`：项目文档、AI 协作和仓库治理。

任务卡是 v0.2 的核心标准，用于让复杂任务更清晰、可恢复、可交接。未来的产品工作流、质量门禁、hook 和 GenUI 能力都应保持可选。

## 核心原则

- AI 先理解项目，再开始执行。
- 项目记忆写进文件，不只留在聊天里。
- 一个任务使用一个 lane。
- 主控 agent 负责验收，子 agent 只做窄任务。
- 重复 3 次的工作要考虑自动化。
- 旧流程要定期证明自己仍然值得存在。
- 少重复解释，少浪费 token，少出错。

更多说明见：[docs/philosophy.md](docs/philosophy.md)。

## 检查项目是否 AI-ready

```bash
./scripts/check-ai-ready.sh examples/demo-project
```

示例项目是虚构项目，用于展示推荐的项目结构。

## 兼容性

模板是普通 Markdown，脚本是 shell 脚本，可配合这些工具使用：

- Codex
- Claude Code
- Cursor
- GitHub Copilot
- 其他能读取项目文件的 agent

更多中文说明见：[docs/quick-start.zh-CN.md](docs/quick-start.zh-CN.md)。
