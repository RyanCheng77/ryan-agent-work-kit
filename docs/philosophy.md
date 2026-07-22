# Philosophy

Ryan Agent Work Kit is built around one simple belief:

AI agents work better when the project has memory, rules, and handoff habits.

## Five Rules

1. **Understand before acting**
   The agent should read project rules and current goals before making changes.

2. **Project memory lives in files**
   Important context should live in `AGENTS.md` and `docs/`, not only in chat.

3. **One task, one lane**
   Each task should have a clear scope. This makes review and recovery easier.

4. **Agents do not all own the project**
   A lead agent coordinates. Helper agents do narrow tasks and report back.

5. **Less repeated context, fewer mistakes**
   Good project memory lowers token cost and reduces repeated explanations.

## Small Safe Loops

Ryan Agent Work Kit treats Loop Engineering as a practical habit, not a large automation promise.

The useful loop is:

```text
clear goal -> scoped context -> visible execution -> hard verification -> reusable learning
```

The kit supports this through project docs, Task Cards, observable CLI runs, AgentOps records, Obsidian sync, and skill capture decisions.

The loop must stay small. If a workflow adds ceremony without reducing rework, risk, or context cost, simplify it or stop it.

## Inner, Middle, And Outer Loops

The kit uses three loop layers:

- **Inner loop**: the current task. Read the right rules, load only necessary context, make small changes, validate, and avoid repeated failure loops.
- **Middle loop**: complex work. Use S0/S1/S2/S3 routing, Task Cards, helper agents, observable CLI runs, and AgentOps when coordination quality matters.
- **Outer loop**: durable improvement. Capture only repeated, cross-project, risk-reducing, rework-reducing, or token-saving lessons into docs, Obsidian, scripts, hooks, skills, or role agents.

This keeps the kit beginner-friendly. Small work should not feel like a process framework. Complex work should not be forced through a single-threaded chat. Repeated lessons should not be forgotten.

## What This Kit Is Not

- It is not a large process framework.
- It is not a replacement for human judgment.
- It is not a full Git course.
- It is not a promise that AI will never fail.
- It is not an unattended agent runtime.

It is a small operating standard that makes AI work easier to steer.
