# Philosophy

Ryan Agent Work Kit is built around one simple belief:

AI agents work better when the project has memory, rules, and handoff habits.

## Seven Rules

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

6. **Decouple by default, integrate through clear contracts**
   Keep project facts in shared files, keep tool adapters thin, and make task scope and validation explicit. A CLI or agent backend should be replaceable without rewriting the workflow.

7. **Design for human control**
   UI and interaction work should respect Nielsen's usability heuristics: make status visible, prevent avoidable errors, preserve user control, and keep recovery understandable.

8. **Humans collaborate by default and gate risk explicitly**
   Use HITS for ongoing human-agent collaboration. Pause for a HOTS gate before high-impact actions that need a named human decision.

## Decouple By Default

The kit separates stable contracts from replaceable tools:

- `AGENTS.md`, project docs, Task Cards, and validation evidence are the shared contract.
- Codex, Claude Code, Cursor, Copilot, Trae, Kimi CLI, and other tools are adapters or execution backends.
- Tool-specific files should stay short and point back to the shared contract instead of becoming competing sources of truth.
- Add a shared abstraction only when the boundary is stable and it removes real duplication. Otherwise keep the dependency local and explicit.

This makes it easier to change tools, delegate a narrow task, or recover work without carrying one tool's assumptions into the whole project.

For implementation details and a lightweight Nielsen review, see [docs/design-principles.md](design-principles.md).

## Small Safe Loops

Ryan Agent Work Kit treats Loop Engineering as a practical habit, not a large automation promise.

The useful loop is:

```text
clear goal -> scoped context -> visible execution -> hard verification -> reusable learning
```

The kit supports this through project docs, Task Cards, observable CLI runs, AgentOps records, Obsidian sync, and skill capture decisions.

For the shared states, decision ownership, and risk gates, see [docs/hits-hots-collaboration.md](hits-hots-collaboration.md).

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
