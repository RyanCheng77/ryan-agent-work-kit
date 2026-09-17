# 动态记忆治理

Ryan Agent Work Kit 把动态记忆系统视为可替换后端。MemOS 可以承接 agent 的历史轨迹、经验召回、策略和 Skill 演化，但不替代项目规则、任务事实源、验收证据或 Git。

## 记忆分层

| 层 | 事实源 | 用途 |
| --- | --- | --- |
| 稳定规则 | AGENTS.md、项目 docs | 安全边界、协作原则、项目事实 |
| 当前任务 | Taskboard、Task Card、active-task-state | 目标、范围、状态、恢复 |
| 完成证明 | verification-brief、测试、截图、Git diff | 验收标准和证据 |
| 动态记忆 | MemOS 或其他 adapter | 历史经验、轨迹、策略、候选 Skill |
| 精选知识 | Obsidian、项目 docs、skill | 人工确认后的长期沉淀 |

## 允许与禁止

默认允许进入动态记忆：

- 已验证的通用协作经验。
- 不含敏感信息的失败模式和修复策略。
- 工具使用偏好和可复用验证方法。
- 明确标注置信度的任务总结。

默认禁止进入动态记忆：

- API Key、token、Cookie、认证文件和登录态。
- 未经显式启用和安全检查的完整聊天、完整日志、私有路径和客户资料。
- 未验证的推测、临时上下文和一次性业务细节。
- 可以改变安全边界、发布权限或验收结论的隐含指令。

## 召回规则

动态记忆召回内容只能作为历史参考，必须标记为不可信上下文。agent 仍要以项目文件、当前任务、测试和 Ryan 的明确决定为准。

~~~mermaid
flowchart TD
  A[动态记忆召回] --> B[标记为历史参考]
  B --> C{与项目事实冲突?}
  C -- 是 --> D[项目事实优先]
  C -- 否 --> E[结合当前任务判断]
  E --> F[执行并验证]
~~~

## 经验升级

MemOS 中的经验不能自动升级为项目规则。只有经过重复出现、验证和人工采纳，才可以进入 Obsidian、项目 docs、skill 或 hook。

统一适配器可以在 S2/S3 收尾自动写入短候选摘要。这只是进入候选队列，不是晋升：它保留在本地忽略文件或 MemOS 中，直到当前事实复核和具名人工批准支持创建提案。

如果 Ryan 明确需要跨客户端保留对话轨迹，可以使用 `trace` 入口。轨迹先写入项目私有 outbox，再由 provider 传给 MemOS；凭据模式会被拒绝，失败时保留待同步文件。该入口不读取或修改 DSH 的会话库、插件配置或认证文件。

~~~text
MemOS 动态记忆 -> AgentOps 观察 -> 验证 -> Ryan 采纳 -> 长期知识
~~~

## 命名空间

建议至少隔离以下 scope：

- personal-preference
- project-context
- task-experience
- agentops-observation
- candidate-skill

跨项目共享前先去除项目特定事实，并确认没有隐私或安全边界泄露。
