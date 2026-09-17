# HITS And HOTS Collaboration

This demo uses two complementary collaboration modes:

- **HITS (Human in the Swarm)**: the human can clarify, decide, change scope, take over, or change an agent while work is active.
- **HOTS (Human on the Swarm)**: pause for explicit human approval before destructive, irreversible, permission-expanding, publishing, deployment, or external-disclosure actions.

For delegated work, use these shared states when useful:

| State | Meaning |
| --- | --- |
| `in_progress` | Work continues within approved scope. |
| `waiting_for_human` | A named human decision is required. |
| `recommend_agent_switch` | Evidence suggests a different agent is needed. |
| `ready_for_acceptance` | Evidence is ready for review. |
| `stopped` | Work ended with a documented handoff. |

Task Cards should name the collaboration state, worthwhile human intervention points, decision owner, and escalation conditions. These are local working labels, not industry-standard claims.
