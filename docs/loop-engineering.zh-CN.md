# Loop Engineering 轻量版

Loop Engineering 在这个工具包里不是“大型自动化引擎”，而是一组小而安全的 AI 工作闭环。

目标很简单：

```text
目标清楚
  ↓
上下文克制
  ↓
执行可见
  ↓
验证明确
  ↓
经验可沉淀
```

## 为什么需要 loop

只让 AI 更快生成内容，不一定会减少返工。真正影响交付质量的，通常是：

- AI 有没有读到正确项目规则。
- 任务范围是否清楚。
- 执行过程是否能被观察。
- 结果是否有测试、截图、diff、日志或人工确认。
- 踩坑经验是否能被下一次复用。

所以 Ryan Agent Work Kit 不追求“无人值守一直跑”，而是先把常见 AI 协作做成可停止、可验证、可复盘的小 loop。

## 三个默认小闭环

### 1. Project Context Loop

```text
用户提出任务
  ↓
Agent 读取 AGENTS.md
  ↓
Agent 读取 docs/current-goal.md
  ↓
Agent 检查分支、工作区和风险
  ↓
Agent 决定直接做、先想清或分头查
```

这个 loop 解决“AI 每次都从零理解项目”的问题。

### 2. Observable Execution Loop

```text
任务卡或口头范围
  ↓
本地执行或外部 CLI 子 agent
  ↓
Codex 右侧 workspace 终端可见
  ↓
.agent-runs/ 保存日志
  ↓
主控用终端、日志、产物和 diff 判断进展
```

这个 loop 解决“外部 CLI 跑到哪了、是不是卡住了”的问题。

### 3. Verify And Learn Loop

```text
完成改动
  ↓
运行验证或说明无法验证
  ↓
汇报风险和下一步
  ↓
必要时记录 AgentOps
  ↓
必要时同步 Obsidian 或沉淀 skill
```

这个 loop 解决“做完不知道是否可靠、经验没有留下来”的问题。

## 反模式

这些不是 Ryan Agent Work Kit 想鼓励的 loop：

- 没有停止条件，让 agent 一直自动尝试。
- 没有验证，只相信 agent 自评。
- 没有边界，把完整仓库、日志、私有资料都发给外部工具。
- 没有记录，下次又从同一个坑开始。
- 为了显得专业而写很多流程，但实际不减少返工。

## 判断一个 loop 是否值得保留

一个 loop 应该至少满足其中两条：

- 能减少重复解释。
- 能减少返工。
- 能提高验证质量。
- 能降低误改、误删、误提交风险。
- 能帮助多 agent 更好协作。
- 能把经验沉淀给下一次任务。

如果一个 loop 只增加步骤，却没有减少风险、返工或上下文成本，就应该简化、自动化、替换或停用。

