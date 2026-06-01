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
copy_if_missing "$template_root/CLAUDE.md" "$target/CLAUDE.md"
copy_if_missing "$template_root/.github/copilot-instructions.md" "$target/.github/copilot-instructions.md"
copy_if_missing "$template_root/.cursor/rules/project.mdc" "$target/.cursor/rules/project.mdc"
copy_if_missing "$template_root/docs/project-overview.md" "$target/docs/project-overview.md"
copy_if_missing "$template_root/docs/current-goal.md" "$target/docs/current-goal.md"
copy_if_missing "$template_root/docs/roadmap.md" "$target/docs/roadmap.md"
copy_if_missing "$template_root/docs/qa/README.md" "$target/docs/qa/README.md"
copy_if_missing "$template_root/docs/handoffs/README.md" "$target/docs/handoffs/README.md"
copy_if_missing "$template_root/docs/plans/README.md" "$target/docs/plans/README.md"

echo
echo "Ryan Agent Work Kit installed for: $target"
echo "Language: $lang"
echo "Next: open the project and tell your AI tool: Read AGENTS.md first."
