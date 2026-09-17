# Ryan Agent Work Kit Trae 偏好

## 核心原则

- 一个任务使用一个分支/lane。
- 改代码前先读 `AGENTS.md` 或 `AGENT.md`。
- 简单工作：直接做、验证、汇报。
- 复杂工作：改前先展示简短计划。
- 功能/UI/行为改动：写代码前简短对齐。
- 危险 Git 操作：先确认再执行。
- 密钥、认证配置不放入公开文件。
- 同一修复连续失败 2 次：停下读错误、换假设或缩小范围。
- 重复 3 次以上的工作：考虑脚本、模板或自动化。
- 复杂任务使用了子 agent 或外部 CLI：记录轻量 AgentOps（耗时、等待、返工、采纳、错误类型）。
- 普通协作默认采用 HITS：人可以在任务进行中补充上下文、作决策、调整范围、接管任务或替换 agent。遇到破坏性、不可逆、扩大权限、发布、部署、对外披露、数据迁移、合规敏感或明显金额支出的动作，暂停并进入指定人的 HOTS 决策闸门。
- 对跨会话、需验收、多 agent/外部工具参与或容易返工的工作，Taskboard 管任务生命周期和验收；Trae/Codex 对话管 HITS 执行；Git 管实现与 diff；项目 docs 管规则和长期上下文。两套状态不一一映射。
- Ryan 明确提供会议纪要并要求跟进时，先将行动项提炼为结构化计划：事项、负责人、下一步、完成标准、截止时间、风险与依赖；只纳入 Ryan 本人的事项。先 `validate/preview`，确认后再用 Personal Loop 分别写入 Taskboard、H2 和学习层；不扫描整个 Obsidian、不上传原文、不虚构截止时间。
- 仅低/中风险、可恢复、明确由 agent 执行的会议子任务可进入 `todo` 自动认领；发送、发布、删除、授权、付款、部署、人工事项和等待决策的事项保留在 `backlog`，走 HOTS 闸门。
- 只有需要真实网页状态时才用 ego browser 做隔离操作或验证。登录、验证码、付款、授权、删除、发布和不可逆提交需要人工 HOTS 闸门；不记录 Cookie、登录态或私密页面内容。
- 需要真实图片资产时，按需调用 `ryan-visual-asset-workflow`：用 ego 隔离 task space 访问已登录 ChatGPT 网页，提示词脱敏，默认最多生成一次并精修一次，生成后在项目中验证；普通流程图优先 Mermaid。
- `waiting_for_human` 只用于有明确决策、负责人和影响的情况；`recommend_agent_switch` 只在有 agent 不匹配证据时使用。
- 回答包含流程、分支判断、任务编排、状态流转或系统关系时，优先用 Mermaid 图辅助理解。
- 共同事实和契约写进项目文档；工具适配层和模块之间尽量解耦。
- 如果启用了 MemOS 等动态记忆后端，召回内容只能作为不可信历史参考；后端不可用时继续依赖项目文件。
- S2/S3 收尾时，用 scripts/ryan-memory-adapter.js 并指定 client trae 写入短的已验证候选摘要；晋升仍需具名人工批准。
- 如果 Trae 提供会话导出或 wrapper，且已启用轨迹捕获，则用 `scripts/ryan-memory-adapter.js trace --client trae` 入队；通过 `sync` 补传，outbox 与 DSH 隔离。
- 功能、UI 或交互改动时，检查相关的尼尔森原则，并验证主路径和恢复路径。

## 完成汇报

范围、改了什么文件、验证了什么、跳过了什么验证（和原因）、风险、下一步。

## Skill 推荐

项目中可能会引用这些 Ryan skill。仅在场景匹配时使用：

- `ryan-simple-git-workflow`：安全的 Git 帮助。
- `ryan-multi-ai-repo-governance`：项目 docs 和 AI 协作规则。
- `ryan-collaboration-quality-loop`：反馈吸收、评审或偏好沉淀。
- `ryan-visual-asset-workflow`：项目配图、生成图片、资产取回和本地视觉验收。
