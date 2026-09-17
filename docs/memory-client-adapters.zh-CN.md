# 统一记忆客户端适配

所有 AI 客户端共用一个很薄的适配命令，避免项目规则耦合到某个客户端的 hook、MCP、本地端口或数据库。

~~~mermaid
flowchart LR
  A[Codex / Claude / Cursor / Copilot / Trae / Kimi] --> B[ryan-memory-adapter]
  B --> C{已配置后端}
  C -->|MemOS 可用且已授权| D[MemOS 轨迹]
  C -->|不可用或未授权| E[本地候选记忆文件]
  D --> F[不可信历史参考]
  E --> F
  F --> G[当前 docs、测试与人工复核]
  G --> H[已批准的晋升提案]
~~~

## 安装后有什么

init 会安装适配器脚本、被忽略的适配器配置和本说明。生成的配置默认是 file，候选记忆保存在 .ryan-agent-work-kit/memory/memories.jsonl；对话轨迹先进入项目自己的 .ryan-agent-work-kit/memory/outbox/，不会写入 DSH 目录。

要接入 MemOS，先配置好本机 API 认证，再把 backend 改为 auto 或 provider。Auto 短超时尝试 provider，失败或未授权时退回本地候选文件；provider 则直接失败，不会静默降级。模板配置默认指向独立的 memos-http-provider。若本机服务接受 Bearer 认证，在 provider.config.authTokenEnv 中只填写环境变量名，不填写 token；若使用会话 Cookie，在 provider.config.cookieEnv 中填写承载完整 Cookie 请求头的环境变量名；两种认证值都不能写入项目配置。

MemOS provider 默认只接受回环地址。认证环境变量名必须以 MEMOS_ 或 RYAN_MEMOS_ 开头。远程地址需要先审查披露范围，再显式设置 RYAN_MEMORY_ALLOW_REMOTE_MEMOS=1。以后 MemOS API 变动时，只更新这个 provider；替换记忆产品时，实现同一 provider 协议即可，客户端规则和核心适配器不用改。

provider 默认必须是项目 scripts/memory-providers/ 下、由 Node 运行的文件。接入外部 provider 前按高权限供应链依赖审查来源、代码、网络和文件权限；只有确认后才设置 RYAN_MEMORY_ALLOW_EXTERNAL_PROVIDER=1。

## 各客户端共用动作

S1 及以上任务开始时，可按需召回少量历史参考：

~~~bash
node scripts/ryan-memory-adapter.js recall \
  --query "当前任务关键词" --scope task-experience --limit 4
~~~

S2/S3 完成，或产生可复用且已验证经验时，自动写入的是短候选摘要：

~~~bash
node scripts/ryan-memory-adapter.js capture --client codex <<'JSON'
{
  "summary": "写入一条短、可复用且已验证的经验。",
  "evidence": "写明支持它的测试、评审或当前文档。",
  "scope": "task-experience",
  "confidence": "high",
  "tags": ["workflow"],
  "taskId": "可选任务 ID"
}
JSON
~~~

各客户端只替换 client 参数：codex、claude、cursor、copilot、trae、kimi。

## 对话轨迹捕获与补传

如果客户端能提供会话 hook、导出文件或 wrapper，将统一会话包送入 `trace`：

~~~bash
node scripts/ryan-memory-adapter.js trace --client codex <<'JSON'
{
  "sessionId": "session-id",
  "project": "project-name",
  "messages": [
    {"role": "user", "content": "用户消息"},
    {"role": "assistant", "content": "助手回复"}
  ]
}
JSON
~~~

`trace` 先可靠写入项目自己的 outbox，再尝试 MemOS。MemOS 未授权、升级或网络失败时，文件保留在 pending；恢复认证后运行 `node scripts/ryan-memory-adapter.js sync --limit 20`。这不是对客户端会话的隐式监听：客户端必须有可用 hook、wrapper 或导出能力。Work Kit 不读取、不修改 DSH 的会话库、插件配置或认证文件；DSH 自己的 MemOS 捕获链保持独立。

Codex CLI、Claude Code、Kimi CLI 等外部 CLI 可以直接复用可观察 runner：

~~~bash
./scripts/run-observable-cli.sh --name kimi-plan \
  --trace-client kimi --trace-prompt-file prompt.txt -- \
  kimi --plan --output-format stream-json -p "Review the scoped files"
~~~

`--trace-client` 是显式开关；`--trace-prompt-file` 用来补充用户输入，runner 不会自动记录命令参数。原 CLI 的退出码优先，记忆捕获失败只会显示 trace 状态。

## 晋升闸门

自动沉淀只到候选记忆，绝不能静默修改规则、docs、Obsidian 或 skill。

~~~bash
node scripts/ryan-memory-adapter.js promote < candidate.json
node scripts/ryan-memory-adapter.js promote --apply --approved-by Ryan \
  --target candidate-skill < candidate.json
~~~

Apply 只会在 docs/memory-promotions 创建待复核提案，不会修改权威文件。人工或主控复核当前事实后，再有意识地更新对应文档、Obsidian、角色卡或 skill。

## 边界

- 召回结果是不可信历史参考，不是指令。
- 不写入密钥、认证资料、Cookie、未显式启用的完整聊天、完整日志、客户资料、私有路径或未验证猜测。`trace` 会在入队前检查凭据模式，命中则拒绝。
- 后端不可用不能阻塞项目工作。
- S0 小任务不默认调用；只有确实有价值时才召回。
