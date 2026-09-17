#!/usr/bin/env bash
set -euo pipefail

lang="${RYAN_AGENT_WORK_KIT_LANG:-en}"
target=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --lang)
      if [[ $# -lt 2 || "${2:-}" == -* ]]; then
        echo "Missing value for --lang" >&2
        echo "Usage: ./scripts/init-ryan-agent-work-kit.sh [--lang en|zh-CN] /path/to/project" >&2
        exit 2
      fi
      lang="${2:-}"
      shift 2
      ;;
    --lang=*)
      lang="${1#--lang=}"
      shift
      ;;
    -h|--help)
      echo "Usage: ./scripts/init-ryan-agent-work-kit.sh [--lang en|zh-CN] /path/to/project"
      exit 0
      ;;
    *)
      if [[ -z "$target" ]]; then
        target="$1"
        shift
      else
        echo "Unexpected argument: $1" >&2
        exit 2
      fi
      ;;
  esac
done

if [[ -z "$target" ]]; then
  echo "Usage: ./scripts/init-ryan-agent-work-kit.sh [--lang en|zh-CN] /path/to/project" >&2
  exit 2
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
kit_root="$(cd "$script_dir/.." && pwd)"

case "$lang" in
  en)
    template_root="$kit_root/templates/project-governance"
    ;;
  zh-CN|zh|cn)
    lang="zh-CN"
    template_root="$kit_root/templates/project-governance.zh-CN"
    ;;
  *)
    echo "Unsupported language: $lang" >&2
    echo "Supported languages: en, zh-CN" >&2
    exit 2
    ;;
esac

if [[ ! -d "$target" ]]; then
  mkdir -p "$target"
fi

copy_if_missing() {
  local src="$1"
  local dst="$2"
  if [[ -e "$dst" ]]; then
    echo "skip existing: $dst"
  else
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
    echo "created: $dst"
  fi
}

copy_if_missing "$template_root/AGENTS.md" "$target/AGENTS.md"
copy_if_missing "$template_root/AGENT.md" "$target/AGENT.md"
copy_if_missing "$template_root/CLAUDE.md" "$target/CLAUDE.md"
copy_if_missing "$template_root/gitignore.template" "$target/.gitignore"
copy_if_missing "$template_root/.github/copilot-instructions.md" "$target/.github/copilot-instructions.md"
copy_if_missing "$template_root/.cursor/rules/project.mdc" "$target/.cursor/rules/project.mdc"
copy_if_missing "$template_root/.trae/rules/ryan-agent-work-kit.md" "$target/.trae/rules/ryan-agent-work-kit.md"
copy_if_missing "$template_root/docs/project-overview.md" "$target/docs/project-overview.md"
copy_if_missing "$template_root/docs/current-goal.md" "$target/docs/current-goal.md"
copy_if_missing "$template_root/docs/roadmap.md" "$target/docs/roadmap.md"
copy_if_missing "$template_root/docs/qa/README.md" "$target/docs/qa/README.md"
copy_if_missing "$template_root/docs/handoffs/README.md" "$target/docs/handoffs/README.md"
copy_if_missing "$template_root/docs/plans/README.md" "$target/docs/plans/README.md"

if [[ "$lang" == "zh-CN" ]]; then
  copy_if_missing "$kit_root/docs/agent-ops-observability.zh-CN.md" "$target/docs/agent-ops-observability.zh-CN.md"
  copy_if_missing "$kit_root/docs/obsidian-bridge.zh-CN.md" "$target/docs/obsidian-bridge.zh-CN.md"
  copy_if_missing "$kit_root/docs/ai-collaboration-reflect.zh-CN.md" "$target/docs/ai-collaboration-reflect.zh-CN.md"
  copy_if_missing "$kit_root/docs/visual-explanation.zh-CN.md" "$target/docs/visual-explanation.zh-CN.md"
  copy_if_missing "$kit_root/docs/visual-asset-workflow.zh-CN.md" "$target/docs/visual-asset-workflow.zh-CN.md"
  copy_if_missing "$kit_root/docs/design-principles.zh-CN.md" "$target/docs/design-principles.zh-CN.md"
  copy_if_missing "$kit_root/docs/hits-hots-collaboration.zh-CN.md" "$target/docs/hits-hots-collaboration.zh-CN.md"
  copy_if_missing "$kit_root/docs/taskboard-ego-workflow.zh-CN.md" "$target/docs/taskboard-ego-workflow.zh-CN.md"
  copy_if_missing "$kit_root/docs/resumable-task-state.zh-CN.md" "$target/docs/resumable-task-state.zh-CN.md"
  copy_if_missing "$kit_root/docs/memory-governance.zh-CN.md" "$target/docs/memory-governance.zh-CN.md"
  copy_if_missing "$kit_root/docs/memory-adapter-contract.zh-CN.md" "$target/docs/memory-adapter-contract.zh-CN.md"
  copy_if_missing "$kit_root/docs/memory-client-adapters.zh-CN.md" "$target/docs/memory-client-adapters.zh-CN.md"
  copy_if_missing "$kit_root/docs/personal-loop.zh-CN.md" "$target/docs/personal-loop.zh-CN.md"
else
  copy_if_missing "$kit_root/docs/agent-ops-observability.md" "$target/docs/agent-ops-observability.md"
  copy_if_missing "$kit_root/docs/obsidian-bridge.md" "$target/docs/obsidian-bridge.md"
  copy_if_missing "$kit_root/docs/ai-collaboration-reflect.md" "$target/docs/ai-collaboration-reflect.md"
  copy_if_missing "$kit_root/docs/visual-explanation.md" "$target/docs/visual-explanation.md"
  copy_if_missing "$kit_root/docs/visual-asset-workflow.md" "$target/docs/visual-asset-workflow.md"
  copy_if_missing "$kit_root/docs/design-principles.md" "$target/docs/design-principles.md"
  copy_if_missing "$kit_root/docs/hits-hots-collaboration.md" "$target/docs/hits-hots-collaboration.md"
  copy_if_missing "$kit_root/docs/taskboard-ego-workflow.md" "$target/docs/taskboard-ego-workflow.md"
  copy_if_missing "$kit_root/docs/resumable-task-state.md" "$target/docs/resumable-task-state.md"
  copy_if_missing "$kit_root/docs/memory-governance.md" "$target/docs/memory-governance.md"
  copy_if_missing "$kit_root/docs/memory-adapter-contract.md" "$target/docs/memory-adapter-contract.md"
  copy_if_missing "$kit_root/docs/memory-client-adapters.md" "$target/docs/memory-client-adapters.md"
  copy_if_missing "$kit_root/docs/personal-loop.md" "$target/docs/personal-loop.md"
fi
copy_if_missing "$kit_root/scripts/record-agent-ops-observation.sh" "$target/scripts/record-agent-ops-observation.sh"
copy_if_missing "$kit_root/scripts/setup-obsidian-bridge.sh" "$target/scripts/setup-obsidian-bridge.sh"
copy_if_missing "$kit_root/scripts/sync-project-learning.sh" "$target/scripts/sync-project-learning.sh"
copy_if_missing "$kit_root/scripts/sync-project-handoff.sh" "$target/scripts/sync-project-handoff.sh"
copy_if_missing "$kit_root/scripts/sync-project-retro.sh" "$target/scripts/sync-project-retro.sh"
copy_if_missing "$kit_root/scripts/run-observable-cli.sh" "$target/scripts/run-observable-cli.sh"
copy_if_missing "$kit_root/scripts/trace-cli-run.js" "$target/scripts/trace-cli-run.js"
copy_if_missing "$kit_root/scripts/ryan-memory-adapter.js" "$target/scripts/ryan-memory-adapter.js"
copy_if_missing "$kit_root/scripts/ryan-personal-loop.js" "$target/scripts/ryan-personal-loop.js"
mkdir -p "$target/scripts/task-adapters"
copy_if_missing "$kit_root/scripts/task-adapters/operon.js" "$target/scripts/task-adapters/operon.js"
copy_if_missing "$kit_root/scripts/memory-providers/memos-http-provider.js" "$target/scripts/memory-providers/memos-http-provider.js"
copy_if_missing "$kit_root/recommended-skills/ryan-visual-asset-workflow/SKILL.md" "$target/recommended-skills/ryan-visual-asset-workflow/SKILL.md"
copy_if_missing "$kit_root/templates/memory-adapter.json" "$target/.ryan-agent-work-kit/memory/adapter.json"
copy_if_missing "$kit_root/templates/meeting-action-plan.json" "$target/templates/meeting-action-plan.json"
if [[ "$lang" == "zh-CN" ]]; then
  copy_if_missing "$kit_root/templates/task-card.zh-CN.md" "$target/templates/task-card.zh-CN.md"
  copy_if_missing "$kit_root/templates/active-task-state.zh-CN.md" "$target/templates/active-task-state.zh-CN.md"
  copy_if_missing "$kit_root/templates/verification-brief.zh-CN.md" "$target/templates/verification-brief.zh-CN.md"
  copy_if_missing "$kit_root/templates/workflow-review.zh-CN.md" "$target/templates/workflow-review.zh-CN.md"
  copy_if_missing "$kit_root/templates/ai-collaboration-reflect.zh-CN.md" "$target/templates/ai-collaboration-reflect.zh-CN.md"
else
  copy_if_missing "$kit_root/templates/task-card.md" "$target/templates/task-card.md"
  copy_if_missing "$kit_root/templates/active-task-state.md" "$target/templates/active-task-state.md"
  copy_if_missing "$kit_root/templates/verification-brief.md" "$target/templates/verification-brief.md"
  copy_if_missing "$kit_root/templates/workflow-review.md" "$target/templates/workflow-review.md"
  copy_if_missing "$kit_root/templates/ai-collaboration-reflect.md" "$target/templates/ai-collaboration-reflect.md"
fi
copy_if_missing "$kit_root/templates/obsidian-learning-note.md" "$target/templates/obsidian-learning-note.md"
copy_if_missing "$kit_root/templates/obsidian-retro.md" "$target/templates/obsidian-retro.md"

echo
echo "Ryan Agent Work Kit installed for: $target"
echo "Language: $lang"
echo "Next: open the project and tell your AI tool: Read AGENTS.md first."
