# Obsidian Bridge

Obsidian Bridge 是 Ryan Agent Work Kit 的可选模块。

你只需要提供自己的 Obsidian vault 本地路径，它就能把项目经验、交接、复盘和 AgentOps 记录写进你的知识库。

它只写本地 Markdown：

- 不登录。
- 不上传。
- 不读取整个知识库。
- 不碰 Obsidian Sync、iCloud、NAS 或第三方网盘账号。
- 不保存密钥、认证文件、完整日志或完整会话。

## 一分钟接入

在你的项目根目录运行：

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

脚本会创建：

```text
<ObsidianVault>/
  AIProjects/
    AgentOps/
    Learnings/
    Handoffs/
    Retrospectives/
```

并在当前项目写入本地配置：

```text
.ryan-agent-work-kit/obsidian-bridge.env
```

这个文件包含你的本机 vault 路径，不应该提交到公开仓库。脚本会自动创建 `.ryan-agent-work-kit/.gitignore` 来忽略 `*.env`。

## 同步项目经验

```bash
cat <<'EOF' | ./scripts/sync-project-learning.sh --project "demo-project"
## Summary

- Task Cards help reduce repeated context for multi-agent work.

## Evidence

- Local validation passed.

## Next Adjustment

- Use a narrower task card before dispatching review agents.
EOF
```

写入位置：

```text
<ObsidianVault>/AIProjects/Learnings/YYYY-MM-DD-HHMM-demo-project.md
```

## 同步交接

```bash
cat <<'EOF' | ./scripts/sync-project-handoff.sh --project "demo-project" --status active
## Current State

- Feature branch is ready for review.

## Next

- Run smoke tests and review the PR.
EOF
```

写入位置：

```text
<ObsidianVault>/AIProjects/Handoffs/YYYY-MM-DD-HHMM-demo-project-handoff.md
```

## 同步项目复盘

```bash
cat <<'EOF' | ./scripts/sync-project-retro.sh --project "demo-project"
## Outcome

- Goal: ship a small feature safely.
- Result: accepted.

## What Caused Rework

- The first task card was too broad.

## Changes For Next Time

- Split review and implementation earlier.
EOF
```

写入位置：

```text
<ObsidianVault>/AIProjects/Retrospectives/YYYY-MM-DD-HHMM-demo-project-retro.md
```

## AgentOps 写入 Obsidian

配置 Obsidian Bridge 后，AgentOps 默认写入：

```text
<ObsidianVault>/AIProjects/AgentOps/YYYY-MM-agent-ops.md
<ObsidianVault>/AIProjects/AgentOps/YYYY-MM-agent-ops.tsv
```

也可以临时覆盖：

```bash
AGENT_OPS_DIR=./docs/agent-ops ./scripts/record-agent-ops-observation.sh
```

## 安全边界

公开包只提供脚本和模板，不包含任何真实 vault 路径。

使用时也要遵守：

- 只写可复用经验、验证方式、风险模式和后续建议。
- 不写 API key、token、密码、cookie、认证文件。
- 不写完整日志、完整会话、私有客户资料或非公开组织信息。
- 不让 agent 默认读取整个 vault；只有用户指定文件或目录时才读取。

## 推荐工作流

复杂任务结束时：

1. 如果产生可复用经验，写一条 Learning。
2. 如果任务要换会话或换工具继续，写一条 Handoff。
3. 如果涉及多 agent、等待、返工或低采纳，写一条 AgentOps。
4. 完成汇报里告诉用户写入了哪些 Obsidian 文件。
