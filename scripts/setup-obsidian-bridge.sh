#!/usr/bin/env bash
set -euo pipefail

project_dir="."
vault_path=""

usage() {
  cat <<'USAGE'
Usage:
  setup-obsidian-bridge.sh [--project /path/to/project] /path/to/ObsidianVault

Creates a local Ryan Agent Work Kit Obsidian Bridge config:
  <project>/.ryan-agent-work-kit/obsidian-bridge.env

The config stores only the local vault path. It should not be committed.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      project_dir="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -z "$vault_path" ]]; then
        vault_path="$1"
        shift
      else
        echo "unexpected argument: $1" >&2
        usage >&2
        exit 2
      fi
      ;;
  esac
done

if [[ -z "$vault_path" ]]; then
  usage >&2
  exit 2
fi

if [[ ! -d "$project_dir" ]]; then
  echo "project directory does not exist: $project_dir" >&2
  exit 1
fi

mkdir -p "$vault_path"
mkdir -p \
  "$vault_path/AIProjects/AgentOps" \
  "$vault_path/AIProjects/Learnings" \
  "$vault_path/AIProjects/Handoffs" \
  "$vault_path/AIProjects/Retrospectives"

config_dir="$project_dir/.ryan-agent-work-kit"
config_path="$config_dir/obsidian-bridge.env"
mkdir -p "$config_dir"

{
  echo "# Local Obsidian Bridge config for Ryan Agent Work Kit."
  echo "# Keep this file private. It may contain a local machine path."
  printf 'RYAN_OBSIDIAN_VAULT=%q\n' "$vault_path"
} > "$config_path"

gitignore_path="$config_dir/.gitignore"
if [[ ! -f "$gitignore_path" ]]; then
  {
    echo "*.env"
    echo "*.log"
    echo "*.tmp"
  } > "$gitignore_path"
fi

echo "Obsidian Bridge configured."
echo "Project: $project_dir"
echo "Vault:   $vault_path"
echo "Config:  $config_path"
echo
echo "Next:"
echo "  ./scripts/sync-project-learning.sh --project \"my-project\" < learning.md"
echo "  ./scripts/sync-project-handoff.sh --project \"my-project\" < handoff.md"
echo "  ./scripts/sync-project-retro.sh --project \"my-project\" < retro.md"
