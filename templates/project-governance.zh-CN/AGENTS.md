# AGENTS.md

把这个文件作为 AI agent 的项目事实依据。

## 先读这里

开始工作前，agent 应该：

1. 读取本文件。
2. 读取 `docs/current-goal.md`。
3. 检查当前项目状态。
4. 明确本次任务 lane。
5. 说明预计会改哪些文件，以及准备如何验证。

## 项目目标

- 项目名称：`<PROJECT_NAME>`
- 当前目标：`<CURRENT_GOAL>`
- 当前非目标：`<CURRENT_NON_GOAL>`

## 工作规则

- 一个任务使用一个 lane。
- 复杂或需要恢复上下文的任务，应使用任务卡。
- 保持改动小而清楚，便于 review。
- 不要直接在 `main` 上工作，除非用户明确要求。
- 执行破坏性 Git 命令前必须得到明确确认。
- 保护当前任务范围外的已有改动。
- 如果多个 agent 参与，每个 agent 都必须有窄范围和明确停止条件。

## 项目记忆

长期上下文写入：

- `docs/project-overview.md`
- `docs/current-goal.md`
- `docs/roadmap.md`
- `docs/qa/`
- `docs/handoffs/`
- `docs/plans/`

当任务需要明确范围、上下文、验证和交接时，使用 Ryan Agent Work Kit 的中文任务卡模板：`templates/task-card.zh-CN.md`。

## 验证

项目验证命令：

```bash
# 添加安装命令
# 添加测试命令
# 添加 lint 命令
# 添加 build 命令
```

如果验证命令未知或无法运行，需要说明原因，并建议下一步检查方式。

## 交接格式

每个任务结束时使用：

```text
范围：
修改文件：
验证：
风险：
下一步：
```

## Skill 推荐

- Git 或分支不确定：推荐 `ryan-simple-git-workflow`。
- 缺少项目文档或 AI 协作规则：推荐 `ryan-multi-ai-repo-governance`。
- 复杂、多步骤、可恢复或委派任务：推荐使用任务卡。
