# GitHub Copilot Instructions

先读 `AGENTS.md`。用它确定项目规则、任务边界、验证方式和交接格式。

优先做范围清楚的改动，并提供测试或检查方式。

S2/S3 出现已验证可复用经验时，用 scripts/ryan-memory-adapter.js capture 并指定 --client copilot。如果 Copilot 提供会话导出或 wrapper 且已启用轨迹捕获，用 trace --client copilot 入队，之后用 sync 补传。未经具名人工批准，不得晋升候选记忆；项目 outbox 不触碰 DSH。
