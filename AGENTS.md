# AGENTS.md

使用中文和用户对话。本项目是 Ryan Agent Work Kit，一个帮助用户快速建立 AI 友好项目标准的开源工具包。

## 项目原则

- 首版只解决一个核心问题：让 AI agent 在 60 秒内更容易理解、接管和交接一个项目。
- 面向新手：用户不需要先懂 Git、skill、hook 或多 agent 编排。
- 公共包必须保持干净：不要写入私有工作区、真实组织、真实业务、真实成员、真实项目路径或历史处理过程。
- 私人设备之间的配置同步和公开发布是两件事；公开包只能保留示例、占位符和安全说明。
- 所有子 skill 的目录名、`SKILL.md` frontmatter `name`、README 引用名都必须以 `ryan-` 开头。
- 首屏主卖点是开箱即用项目标准，不是大量 skill。

## 开始工作前

每次开始前先完成：

1. 读取本文件。
2. 读取 `docs/current-goal.md`。
3. 检查当前目录是否在 Git 仓库内。
4. 如果在 Git 仓库内，检查当前分支和工作区状态。
5. 判断本轮可能改动文件和验证命令。

## 当前目标

- 推进 Ryan Agent Work Kit v0.4。
- 在“一分钟启动 AI 友好项目”基础上，加入轻量 AI 协作自检。
- 让用户复盘委托、描述、判断和审慎四个协作习惯。
- 只保留两个核心 skill：`ryan-simple-git-workflow` 与 `ryan-multi-ai-repo-governance`。

## 内容边界

允许进入公开包：

- 通用项目治理模板。
- 通用个人偏好模板。
- 通用 AI agent 协作规则。
- 虚构 demo 项目。
- Ryan 品牌下的通用 skill。

不得进入公开包：

- 真实组织、真实业务、真实成员、真实项目路径。
- 私有会议、文档、截图、日志、数据、账号、密钥。
- 真实 `config.toml`、auth 文件、token、cookie、sqlite 状态、会话、历史记录。
- 能让读者推断内部材料或历史处理过程的文字。
- 临时文件、系统生成文件、调试输出。

## 文件结构

- `README.md`：面向用户的产品首页。
- `personal-preferences/`：给 Codex、Claude Code、Cursor 等工具使用的偏好模板。
- `templates/`：AI 友好项目标准模板。
- `skills/`：核心 `ryan-*` skills。
- `scripts/`：初始化和检查脚本。
- `docs/`：哲学、快速开始、兼容说明、安全规则、路线图。
- `examples/`：虚构示例。

## 工作规则

- 保持改动小而清楚。
- 不把二期想法塞进首版入口。
- README 要让新手 5 秒内看懂：这是什么、为什么有用、怎么开始。
- 脚本不得覆盖已有文件，遇到已存在文件只提示跳过。
- 示例必须是虚构中性场景。

## 验证

阶段收口前至少检查：

```bash
find skills -mindepth 1 -maxdepth 1 -type d -print
./scripts/check-ai-ready.sh examples/demo-project
```

如果项目在 Git 仓库内，额外检查：

```bash
git status --short
git diff --stat
```

## 交接格式

每次完成一轮后汇报：

```text
Scope:
Changed files:
Validation:
Risks:
Next:
```
