# Claude Code Instructions

先读 `AGENTS.md`，并把它作为项目事实依据。

修改文件前，先说明：

- 当前任务
- 当前项目状态
- 本次任务 lane
- 预计修改文件
- 验证计划

优先做小范围改动，给出清楚验证，并在结束时留下交接信息。

S2/S3 出现已验证可复用经验时，用 scripts/ryan-memory-adapter.js capture 并指定 --client claude，只写短候选摘要和证据；晋升必须由具名人工批准。
