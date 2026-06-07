# AgentOps 轻量观察

AgentOps 用来追踪和改善多 agent 协作，不是为了做漂亮报表。

目标只有四个：

- 少返工。
- 快交付。
- agent 更会协作。
- 避免无意义循环和低级重复。

## 什么时候记录

不要每个小任务都记录。只在这些情况记录：

- 复杂任务，或明显适合拆给多个 agent。
- 使用了子 agent、外部 CLI agent 或多个 AI 工具。
- 等待外部 agent 超过 3 分钟。
- 出现返工、超时、误跑、权限失败、低采纳。
- 用户反馈“慢”“绕”“重复消耗”“不该这么拆”。

## 不记录什么

- 不记录 token。
- 不估算 token。
- 不写完整日志、完整会话、真实密钥、认证配置、客户资料或私有路径。

疑似 token 浪费时，只记录可观察原因：

- `repeated_search`
- `repeated_failure`
- `idle_wait`
- `over_context`
- `wrong_agent`

## 数据结构

Markdown 给人读，TSV 给后续分析。

默认输出：

```text
docs/agent-ops/YYYY-MM-agent-ops.md
docs/agent-ops/YYYY-MM-agent-ops.tsv
```

核心字段：

```text
schema_version
record_id
timestamp
capture_method
confidence
measurement
source
project
task_id
trigger_reason
route
task_type
agents_used
agent_roles
wall_time_min
agent_wait_time_min
local_work_while_waiting
acceptance
rework_count
error_type
task_card_quality
context_scope
waste_pattern
primary_bottleneck
improvement_action
validation_evidence
evidence_ref
lesson
```

其中：

- `validation_evidence`：证据类型或验证方式，例如 test、diff、screenshot、rg check、install dry-run、user confirm。
- `evidence_ref`：证据位置或短引用，例如文件路径、命令名、截图文件名、PR/commit/任务编号或一句可复核摘要。
- `primary_bottleneck`：主要瓶颈，例如 task_card、context、wait_strategy、role_fit、validation、permission、tool_limit。
- `improvement_action`：下一次具体动作，例如 narrow_task_card、change_role、keep_local_work、add_validation、add_hook、stop_recording。

## 真实性规则

- 每条记录默认必须有 `validation_evidence` 或 `evidence_ref`。
- 没有证据时只能用 `--allow-missing-evidence --confidence low`，并且不进入趋势统计。
- 趋势只统计 `confidence=medium/high`。
- 子 agent 自评不能单独作为高可信数据。

## 使用脚本

```bash
cat <<'EOF' | ./scripts/record-agent-ops-observation.sh
## Observation
- project: demo-project
- task_id: 2026-06-demo-agentops
- trigger_reason: workflow_review
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
- task_card_quality: clear
- context_scope: focused
- waste_pattern: none
- primary_bottleneck: role_fit
- improvement_action: change_role
- validation_evidence: test + diff review
- evidence_ref: local test output summary
- lesson: Use a narrower reviewer role for schema changes.
EOF
```

自定义输出目录：

```bash
AGENT_OPS_DIR=./docs/agent-ops ./scripts/record-agent-ops-observation.sh
```

## 收尾汇报

复杂任务或多 agent/外部 agent 任务结束时，要告诉用户 AgentOps 是否触发：

- 已记录：给出记录 ID 或任务 ID、Markdown/TSV 写入位置、采纳情况、返工次数、主要瓶颈和下次动作。
- 未记录：如果任务复杂但没有记录，用一句话说明原因，例如“本轮没有等待、返工或低采纳，记录成本大于收益”。

## Schema 迁移

当前 TSV schema 是 `0.2`。

如果旧月份 TSV 是 0.1 表头，写入时会提示 schema mismatch。确认要继续使用同一个月份文件时，给同一条命令加：

```bash
--migrate-tsv
```

脚本会创建 `.pre-v0.2.<timestamp>.bak` 备份，再为旧行补空列。缺失字段保持为空，不猜历史。

## 月度复盘

累计 5-10 条记录后再复盘：

- 哪类任务最值得并行？
- 哪些角色采纳率低？
- 哪些等待窗口不合理？
- 哪些任务卡字段经常缺？
- 哪些规则应该进入 AGENTS、skill、hook 或脚本？
