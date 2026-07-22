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
- 回答包含流程、分支判断、任务编排、状态流转或系统关系时，优先用 Mermaid 图辅助理解。

## 完成汇报

范围、改了什么文件、验证了什么、跳过了什么验证（和原因）、风险、下一步。

## Skill 推荐

项目中可能会引用这些 Ryan skill。仅在场景匹配时使用：

- `ryan-simple-git-workflow`：安全的 Git 帮助。
- `ryan-multi-ai-repo-governance`：项目 docs 和 AI 协作规则。
- `ryan-collaboration-quality-loop`：反馈吸收、评审或偏好沉淀。
