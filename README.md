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

这套闭环分三层：

- **内环**：当前任务怎么快速读、改、测、修。
- **中环**：复杂任务怎么拆分、调 agent、观察进度、减少返工。
- **外环**：项目规则、个人偏好、Obsidian、skill、hook 和 agent 角色如何持续沉淀。

小任务留在内环，复杂任务进入中环，反复出现且能降低风险/返工的经验才进入外环。

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

这些偏好会让 agent 默认采用 AI 原生工作方式：JIT 规划、任务卡、原型验证、重复流程自动化和工作流审视。

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

### 4. 重复流程做工作流审视

如果一件事重复发生 3 次以上，或者某个流程开始消耗大量时间、token、沟通和返工成本，用工作流审视模板判断它应该保留、简化、自动化、替换还是停用：

```bash
cp templates/workflow-review.zh-CN.md ./my-project/docs/plans/<workflow-name>-review.md
```

### 5. 可选：记录多 agent 协作质量

当你开始使用子 agent、Claude CLI、Codex、Cursor 等多个工具协作时，可以用轻量 AgentOps 记录追踪耗时、等待、返工、采纳和错误类型：

```bash
./scripts/record-agent-ops-observation.sh --help
```

它不记录 token，也不估算 token。Markdown 给人读，TSV 给后续分析。详见：[docs/agent-ops-observability.zh-CN.md](docs/agent-ops-observability.zh-CN.md)。

### 6. 可选：做 AI 协作自检

复杂任务结束后，用 30 秒看四件事：委托是否合适、描述是否清楚、判断是否有证据、审慎是否守住边界。

```bash
cp templates/ai-collaboration-reflect.zh-CN.md ./my-project/docs/handoffs/<task-name>-reflect.md
```

它不打分、不排名、不读取完整聊天记录，只帮助你下次更少返工。详见：[docs/ai-collaboration-reflect.zh-CN.md](docs/ai-collaboration-reflect.zh-CN.md)。

### 7. 可选：接入 Obsidian 知识库

如果你有自己的 Obsidian vault，只提供本地路径即可把项目经验、交接、复盘和 AgentOps 记录写入知识库：

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

它只写本地 Markdown，不登录、不上传、不读取整个知识库。详见：[docs/obsidian-bridge.zh-CN.md](docs/obsidian-bridge.zh-CN.md)。

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

## 推荐 Skill

推荐 skill 不进入默认首屏，只在场景匹配时使用：

- `recommended-skills/ryan-codex-automation-workflow`：当你要让 Codex 稍后继续、定时运行、周期检查或管理提醒时，优先使用 Codex 原生 automation，而不是临时写 shell cron。

## 核心原则

- AI 先理解项目，再开始执行。
- 项目记忆写进文件，不只留在聊天里。
- 一个任务使用一个 lane。
- 主控 agent 负责验收，子 agent 只做窄任务。
- 让 AI 工作形成小闭环：目标、执行、验证和学习都可追踪。
- 小事跑内环，复杂事进中环，重复经验才沉淀到外环。
- 复杂协作后做轻量 4D 自检：委托、描述、判断、审慎。
- 重复 3 次的工作要考虑自动化。
- 旧流程要定期证明自己仍然值得存在。
- 少重复解释，少浪费 token，少出错。

更多说明见：[docs/philosophy.md](docs/philosophy.md)。

## 检查项目是否 AI-ready

```bash
node bin/ryan-agent-work-kit.js check examples/demo-project
```

更完整的体检：

```bash
node bin/ryan-agent-work-kit.js doctor examples/demo-project
```

`doctor` 会检查项目入口文件、Claude Code / Cursor / GitHub Copilot 适配文件、`.agent-runs/` 是否忽略、基础验证信号、当前分支和明显敏感文件名。它是提醒和体检，不会修改项目。

本仓库脚本方式：

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
