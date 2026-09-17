# 动态记忆适配器契约

这是一个能力契约，不是 MemOS 专属 API。任何动态记忆后端都可以实现它；CLI 和项目规则不应直接依赖某个本地端口、数据库或厂商 SDK。

## 最小接口

~~~text
health() -> { available, provider, version? }
recall(query, scope, limit, timeout_ms) -> { memories[], timed_out, source }
capture(event, scope, confidence) -> { accepted, id? }
feedback(memory_id, correction, confidence) -> { accepted }
trace(session, safe_capture_policy) -> { accepted, delivered, queued }
sync(limit) -> { delivered, pending, failed }
~~~

## Provider 协议

核心适配器与可选后端通过一行 JSON 通信，不依赖任何厂商 SDK：

~~~text
request:  { protocolVersion: 1, operation, request, config }
response: { protocolVersion: 1, provider, available?, memories?, accepted?, result?, error? }
~~~

- 核心只理解 protocolVersion、通用 operation 和标准输出字段。
- provider 自己拥有厂商 URL、认证传递和响应格式映射。
- provider 升级失败时，auto 模式回退本地候选层；project docs、任务和验收不受影响。
- 新后端只需实现同一协议，不需要修改客户端规则或核心适配器。
- 默认只允许 Node 运行项目内 scripts/memory-providers/ 下的 provider；外部 provider 要经过供应链审查并显式设置 RYAN_MEMORY_ALLOW_EXTERNAL_PROVIDER=1。

## 能力要求

- recall 必须有数量上限和超时上限。
- 召回结果必须带来源、scope 和置信度；默认作为不可信历史参考。
- capture 只能接收经过最小披露处理的内容。
- feedback 要支持纠正、补充或拒绝错误记忆。
- 后端不可用时，任务仍能依赖项目文件继续运行。
- 适配器不能修改 AGENTS.md、Taskboard、验收文件或 Git 状态。
- 跨客户端可以自动写入有边界的候选记忆；但晋升必须先生成待复核提案，任何权威更新都需要具名人工批准。

## MemOS 映射

MemOS Local 可以作为一个实现：

- trace / episode：对应任务轨迹和动态经验。
- policy：对应反复验证后的候选策略。
- world model：对应压缩后的环境认知。
- skill：对应经验证后可调用的能力包。
- Viewer：用于观察、修正和人工管理，不作为项目事实源。

当前本地 MemOS 通过 DeepSeek Harness 插件提供动态召回和后台捕获。Ryan Agent Work Kit 使用独立的 memos-http-provider 适配其 HTTP API；核心 CLI 只约束协议和安全边界，不直接依赖 MemOS API。

## 超时与降级

~~~mermaid
sequenceDiagram
  participant A as Agent
  participant M as Memory Adapter
  participant P as Project Files
  A->>M: recall(query, scope, limit, timeout)
  alt 返回且可用
    M-->>A: 历史参考
  else 超时或不可用
    M-->>A: 空结果或降级
    A->>P: 继续读取项目事实
  end
  A->>M: capture(已验证摘要)
~~~

## 不做的事

- 不把 MemOS 作为安装前置依赖。
- 不把动态记忆当作系统指令。
- 不自动把记忆升级为规则或 Skill。
- 不在未显式启用 `trace` 且未通过安全检查时批量上传或写入完整聊天和日志。
- `trace` 与 `sync` 是可选能力；核心只负责队列、协议和降级，客户端必须通过公开 hook、导出或 wrapper 提供会话输入。
