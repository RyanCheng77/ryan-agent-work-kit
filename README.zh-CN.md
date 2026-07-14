# Ryan Agent Work Kit

一分钟把项目变成 AI 友好项目。

Ryan Agent Work Kit 帮助 Codex、Claude Code、Cursor 和其他 AI coding agent 更快理解你的项目，在更安全的边界内工作，并留下清楚的交接记录。它也帮助你复盘自己的 AI 协作习惯：哪些事该委托、任务是否说清、结果是否验证、安全边界是否守住。

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

## 核心概念：小闭环

Ryan Agent Work Kit 吸收了 Loop Engineering 的思路，但不做沉重的自动化系统。它先帮你建立几个小而安全的 AI 工作闭环：

```text
目标清楚 → 上下文克制 → 执行可见 → 验证明确 → 经验可沉淀
```

详见：[docs/loop-engineering.zh-CN.md](docs/loop-engineering.zh-CN.md)。

## 快速开始

当前仓库方式：

```bash
./scripts/init-ryan-agent-work-kit.sh --lang zh-CN ./my-project
```

也可以使用本地 Node CLI：

```bash
node bin/ryan-agent-work-kit.js init --lang zh-CN ./my-project
```

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

本地 Node CLI：

```bash
node bin/ryan-agent-work-kit.js init --lang zh-CN ./my-project
```

英文默认模板：

```bash
node bin/ryan-agent-work-kit.js init ./my-project
```

npm 包发布后可使用：

```bash
npx ryan-agent-work-kit init --lang zh-CN ./my-project
```

脚本会创建：

```text
AGENTS.md
CLAUDE.md
.gitignore
.github/copilot-instructions.md
.cursor/rules/project.mdc
docs/project-overview.md
docs/current-goal.md
docs/roadmap.md
docs/qa/README.md
docs/handoffs/README.md
docs/plans/README.md
docs/agent-ops-observability.zh-CN.md
docs/obsidian-bridge.zh-CN.md
docs/ai-collaboration-reflect.zh-CN.md
scripts/record-agent-ops-observation.sh
scripts/setup-obsidian-bridge.sh
scripts/sync-project-learning.sh
scripts/sync-project-handoff.sh
scripts/sync-project-retro.sh
scripts/run-observable-cli.sh
templates/task-card.zh-CN.md
templates/workflow-review.zh-CN.md
templates/ai-collaboration-reflect.zh-CN.md
templates/obsidian-learning-note.md
templates/obsidian-retro.md
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

### 4. 可选：记录多 agent 协作质量

当任务涉及多个 agent、外部 CLI agent、等待、返工或低采纳时，可以用轻量 AgentOps 记录改善协作：

```bash
./scripts/record-agent-ops-observation.sh --help
```

它不记录 token，也不估算 token。详见：[docs/agent-ops-observability.zh-CN.md](docs/agent-ops-observability.zh-CN.md)。

### 5. 可选：做 AI 协作自检

复杂任务结束后，用 30 秒看四件事：委托是否合适、描述是否清楚、判断是否有证据、审慎是否守住边界。

```bash
cp templates/ai-collaboration-reflect.zh-CN.md ./my-project/docs/handoffs/<task-name>-reflect.md
```

它不打分、不排名、不读取完整聊天记录，只帮助你下次更少返工。详见：[docs/ai-collaboration-reflect.zh-CN.md](docs/ai-collaboration-reflect.zh-CN.md)。

### 6. 可选：接入 Obsidian 知识库

如果你有自己的 Obsidian vault，只提供本地路径即可把项目经验、交接、复盘和 AgentOps 记录写入知识库：

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

它只写本地 Markdown，不登录、不上传、不读取整个知识库。详见：[docs/obsidian-bridge.zh-CN.md](docs/obsidian-bridge.zh-CN.md)。

## 核心原则

- AI 先理解项目，再开始执行。
- 项目记忆写进文件，不只留在聊天里。
- 一个任务使用一个 lane。
- 主控 agent 负责验收，子 agent 只做窄任务。
- 让 AI 工作形成小闭环：目标、执行、验证和学习都可追踪。
- 复杂协作后做轻量 4D 自检：委托、描述、判断、审慎。
- 少重复解释，少浪费 token，少出错。

## 检查项目是否 AI-ready

```bash
node bin/ryan-agent-work-kit.js check ./my-project
```

更完整的体检：

```bash
node bin/ryan-agent-work-kit.js doctor ./my-project
```

`doctor` 会检查项目入口文件、Claude Code / Cursor / GitHub Copilot 适配文件、`.agent-runs/` 是否忽略、基础验证信号、当前分支和明显敏感文件名。它是提醒和体检，不会修改项目。

本仓库脚本方式：

```bash
./scripts/check-ai-ready.sh ./my-project
```

更多中文说明见：[docs/quick-start.zh-CN.md](docs/quick-start.zh-CN.md)。
