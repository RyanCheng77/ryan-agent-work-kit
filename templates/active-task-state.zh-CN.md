# 当前任务状态（可选）

仅在 S2/S3、跨会话、长等待、外部 agent、回滚风险或需要独立复核时启用。只记录下一位 agent 恢复工作所需的最小事实，不复制完整聊天、私密日志、Cookie、认证信息或密钥。

## 任务

- 项目：<PROJECT_NAME>
- 任务：<TASK_NAME_OR_ID>
- 路由：<S0|S1|S2|S3>
- 更新时间：<YYYY-MM-DD HH:MM TIMEZONE>
- 当前负责人：<HUMAN_OR_AGENT>
- Taskboard：<TASK_ID_OR_NOT_ENABLED>

## 当前状态

- HITS 状态：<in_progress|waiting_for_human|recommend_agent_switch|ready_for_acceptance|stopped>
- 阶段：<ROUTE|IMPLEMENT|VERIFY|HANDOFF>
- 已完成：<SHORT_LIST>
- 当前工作：<ONE_SENTENCE>
- 下一步：<ONE_CONCRETE_ACTION>

## 已验证事实

- 分支或工作区结论：<BRANCH_AND_WORKTREE_FACT>
- 已运行命令：<COMMAND_AND_RESULT>
- 测试、截图、日志或其他证据：<EVIDENCE_REFERENCE>
- 已知不确定项：<UNVERIFIED_ITEM_OR_NONE>

## 阻塞与下一步

- 阻塞：<BLOCKER_OR_NONE>
- 需要的输入：<MISSING_INPUT_OR_NONE>
- 停止条件：<WHEN_TO_STOP>
- 恢复动作：<FIRST_ACTION_AFTER_RESUME>

## 交接与风险

- Ryan 介入点：<DECISION_OR_HOTS_GATE>
- 决策负责人：<DECISION_OWNER>
- 未验证项：<UNVERIFIED_RISK>
- 已知风险：<KNOWN_RISK>
- 公开边界：不写入密钥、认证文件、登录态、完整日志、内部路径或敏感业务数据。

