# Design Principles

Use this guide for feature, interaction, UI, and workflow design. It is a practical review lens, not a requirement to make every small change pass a ten-item ceremony.

## Default Architecture: Loose Coupling

- Keep each module responsible for one clear concern.
- Depend on stable interfaces, data contracts, and events instead of another module's private state.
- Keep shared project truth in `AGENTS.md`, `docs/`, Task Cards, and tests; keep tool adapters thin.
- Prefer explicit inputs and outputs over hidden global behavior.
- Before adding a shared abstraction, prove that the behavior is stable across more than one caller. Otherwise keep the dependency local.
- When a boundary changes, update its contract and verification together.

## Nielsen's Ten Usability Heuristics

For a UI or user-facing workflow, review the heuristics that apply and record the evidence in the task closeout or test notes when the change is meaningful.

| Heuristic | Practical check |
| --- | --- |
| Visibility of system status | Does the user see progress, success, loading, and failure at the right time? |
| Match between system and the real world | Does the wording, order, and model match the user's domain instead of implementation details? |
| User control and freedom | Can the user cancel, undo, go back, or safely escape a mistaken action? |
| Consistency and standards | Do labels, controls, behaviors, and platform conventions mean the same thing everywhere? |
| Error prevention | Can constraints, defaults, confirmation, or validation prevent predictable mistakes before they happen? |
| Recognition rather than recall | Are choices, state, and next actions visible instead of requiring users to remember them? |
| Flexibility and efficiency of use | Are common actions fast for experienced users without making the first use confusing? |
| Aesthetic and minimalist design | Is each screen focused on the task, with unnecessary controls and copy removed? |
| Help users recognize, diagnose, and recover from errors | Do errors state what happened, why it matters, and a safe next action in plain language? |
| Help and documentation | When guidance is necessary, is it short, searchable, contextual, and action-oriented? |

## How To Apply It

1. Before a meaningful UI or behavior change, name the user goal, the primary path, and the failure or recovery path.
2. Choose only the relevant heuristics. A destructive action may need error prevention and user control; a dashboard may need status visibility and recognition.
3. Verify with the smallest useful evidence: a test, prototype, screenshot, interaction recording, accessibility check, or manual scenario.
4. Keep the result decoupled: the UI should consume a stable contract rather than duplicate business rules or tool-specific behavior.

For an explanation that includes a complex flow, use a compact Mermaid diagram. For visual design choices, use a prototype, screenshot, HTML mockup, or recording when that provides better evidence than prose.
