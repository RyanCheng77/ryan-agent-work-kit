# 任务卡：<TASK_NAME>

用这个文件让一个 AI 任务范围清楚、可恢复、易交接。

## 目标

<WHAT_SHOULD_BE_DONE>

## 背景

<ONLY_THE_CONTEXT_NEEDED_FOR_THIS_TASK>

## 范围

- <ALLOWED_AREA_OR_FILE>

## 非目标

- <WHAT_NOT_TO_DO>

## 文件

- <LIKELY_FILE_OR_FOLDER>

## 协作

- 模式：<默认_HITS_或_HOTS_闸门>
- 状态：<in_progress|waiting_for_human|recommend_agent_switch|ready_for_acceptance|stopped>
- Ryan 介入点：<哪些决策值得 Ryan 关注>
- 决策负责人：<谁可以在闸门处作决定>
- 升级条件：<哪些可观察信号会暂停或改派工作>

## 任务事实源（可选）

- Taskboard 任务：<TASK_ID_或_不需要>
- 看板状态：<todo|in_progress|in_review|done|blocked|canceled>
- 交付证据：<测试、diff、截图或链接；不填写私密日志/登录态>

Taskboard 记录任务生命周期和验收；上面的协作状态记录 HITS 执行现场，两者不一一映射。只有指定的人明确验收后，才将看板任务移到 `done`。

## 可恢复状态（可选）

- 当前状态文件：<路径或未启用>
- 验证简报：<路径或不需要>
- 恢复摘要：<一句话>

仅在 S2/S3、跨会话、长等待、外部 agent、回滚风险或需要独立复核时启用。Taskboard 管生命周期，当前状态文件管执行现场，验证简报管完成证明，Git 管实现与 diff 证据。

## 禁止动作

- <ACTION_NOT_ALLOWED>

## 规则

- 遵守 `AGENTS.md`。
- 保持改动聚焦。
- 不执行破坏性 Git 命令。
- 范围变化前先询问。
- HOTS 闸门涉及的动作，必须等指定决策负责人明确批准后才能执行。

## 验证

```bash
<VALIDATION_COMMAND_OR_MANUAL_CHECK>
```

## 停止条件

<WHEN_TO_STOP_AND_HAND_BACK>

## 交接

```text
范围：
修改文件：
验证：
跳过的验证：
风险：
协作状态与决策：
经验：
下一步：
```
