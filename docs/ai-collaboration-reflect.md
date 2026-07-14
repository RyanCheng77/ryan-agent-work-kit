# AI Collaboration Reflect

Ryan Agent Work Kit does not only make projects easier for AI agents to take over. It also helps users build better AI collaboration habits over time.

This module borrows from the 4D AI Fluency idea, but keeps it lightweight:

```text
Delegation
  ↓
Description
  ↓
Discernment
  ↓
Diligence
```

The goal is not to judge whether a user is "good at AI". The goal is to notice what would reduce rework, improve safety, and make the next AI handoff easier.

## Four Questions

| Dimension | Plain meaning | In this kit |
| --- | --- | --- |
| Delegation | Should this work go to AI, and to which agent or tool? | S0/S1/S2/S3, lead/helper agents, task lanes |
| Description | Did I describe the task clearly enough? | `docs/current-goal.md`, Task Cards, prompt templates |
| Discernment | Did I verify the AI output? | `doctor`, tests, diffs, screenshots, logs, human confirmation |
| Diligence | Did I protect safety and public/private boundaries? | Safety rules, minimum disclosure, Obsidian boundaries, public-package scans |

## When To Use

Do not fill this out for every small task. Use it when:

- The task is S2/S3 complexity.
- Multi-agent or external CLI collaboration was involved.
- There was rework, low acceptance, wrong execution, timeout, or weak validation.
- The user says the work felt slow, wasteful, repetitive, or poorly split.
- A reusable prompt, validation method, or safety rule appears.

## How To Use

Copy the template:

```bash
cp templates/ai-collaboration-reflect.md ./my-project/docs/handoffs/<task-name>-reflect.md
```

Or include one lightweight line in the closeout:

```text
AI Collaboration Reflect: delegation was right, description missed acceptance criteria, discernment used tests and diff review, diligence found no public-package risk. Next time, define acceptance criteria first.
```

## Principles

- Do not score the user.
- Do not rank people.
- Do not capture full chat history.
- Do not write secrets, full logs, session transcripts, customer data, or private paths.
- Only capture learning that reduces rework, improves validation, lowers risk, or saves context.

## Relationship To AgentOps

AgentOps looks at collaboration outcomes, such as elapsed time, rework, acceptance, and error types.

AI Collaboration Reflect looks at collaboration habits, such as whether the task was delegated well, described clearly, verified properly, and handled safely.

They can be used together, but both should stay lightweight.

