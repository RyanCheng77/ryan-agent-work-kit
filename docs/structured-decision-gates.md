# Structured Decision Gates

A structured decision gate is a lightweight routing aid inspired by the idea behind Jev / System One models: turn semantic judgments into small, explicit outputs that software and people can act on.

It is not another orchestration system. It does not require Jev, an external API, or a new service. The goal is to make an agent state, before acting: **how it will proceed, how confident it is, whether parallel work is safe, how it will verify the result, and when a human must decide**.

## When to use it

Do not add a form to small S0 work. Copy `templates/decision-gate.md`, or add the optional fields to a Task Card, when:

- an S1+ task has meaningful misrouting or rework risk;
- work may be split across agents or external tools;
- publishing, permissions, data, privacy, or irreversible actions are involved;
- scope may drift or the completion standard is unclear.

## Six fields

| Field | Values | Purpose |
| --- | --- | --- |
| Route | S0 direct / S1 think first / S2 split in parallel / S3 plan and Task Card | Choose the smallest reasonable workflow |
| Confidence | high / medium / low | Express confidence in the route and assumptions, not a guarantee of correctness |
| Parallel-safe | yes / no | Check for independent, low-conflict side work |
| External-tool risk | low / medium / high | Consider disclosure and write risk from browsers, MCP, CLIs, APIs, or external agents |
| Verification strength | light / normal / strict | Agree on the proof required for completion |
| Ask Ryan first | yes / no | Mark decisions that require human judgment, authorization, or trade-offs |

## Gate rules

1. **Low confidence:** reduce scope, gather evidence, or ask the decision owner; do not guess forward.
2. **High external-tool risk:** enter a HOTS gate and state the minimum disclosure, impact, and recovery path.
3. **S2 and parallel-safe:** keep the critical path with the lead; delegate narrow side tasks with file boundaries and stop conditions.
4. **Strict verification:** define acceptance evidence and rollback or recovery before execution.
5. **Uncertainty is not automatically human-waiting:** use `waiting_for_human` only when there is a concrete decision, owner, and impact.

## Relationship to Jev / TypeSafe

If a project later adopts Jev or another structured judgment service, these fields can map to Choice, Score, and Noul-style questions. **Ryan Agent Work Kit remains vendor-neutral:**

- code, project docs, and the named owner keep control of rules and thresholds;
- model output is advice and cannot bypass Git, safety, or HOTS gates;
- minimize disclosure of source, logs, customer data, keys, and internal plans;
- low confidence should trigger confirmation or scope reduction, not blind retries.

## Retrospective use

Record the gate outcome only when it changed scope, delegation, verification, or risk handling. Do not add form-filling overhead to ordinary S0 work.
