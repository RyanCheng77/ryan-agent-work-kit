# 可恢复任务状态与验证契约

Ryan Agent Work Kit 借鉴 Harness Engineering 的核心价值：让 agent 能从可验证事实继续工作，而不是依赖完整聊天记录。这里采用轻量、显式启用的两份文件：

- active-task-state：当前执行现场的恢复摘要。
- verification-brief：目标、验收标准、验证方法和独立复核结果。

## 什么时候启用

只在以下情况启用：

- S2/S3 任务或跨多个会话的任务。
- 外部 agent、长时间等待、任务交接或可能需要换 agent。
- 有回滚风险、独立复核要求或验收标准容易被遗忘。

S0/S1 不需要创建它们，也不会因为缺少它们而被 doctor 阻塞。

## 怎么使用

从模板复制到项目后再填写：

    cp templates/active-task-state.zh-CN.md docs/handoffs/active-task-state.zh-CN.md
    cp templates/verification-brief.zh-CN.md docs/qa/verification-brief.zh-CN.md

doctor 只检查显式存在的 docs/handoffs/active-task-state*.md，并确认五个恢复段落存在。验证简报由人或 agent 按任务需要填写，不作为默认阻塞检查。

## 四类事实源如何分工

~~~mermaid
flowchart LR
  T[Taskboard\n任务生命周期与验收] --> C[Task Card\n目标、范围、停止条件]
  C --> S[active-task-state\n执行现场与恢复摘要]
  C --> V[verification-brief\n可执行验收契约]
  G[Git] --> V
  G --> S
  S --> R[下一位 agent 或新会话]
  V --> A[Ryan 最终验收]
~~~

Taskboard 不保存逐步命令或私密日志；状态文件不替代 Git；验证简报不替代测试；Maker/Checker 也不是默认双 agent。Graph 或更强的编排只在 S3 任务确实需要时再引入。

## 安全边界

状态和验证文件只写恢复所需的最小事实。不要写入密钥、认证文件、Cookie、登录态、完整日志、内部路径、客户资料或其他敏感数据。

