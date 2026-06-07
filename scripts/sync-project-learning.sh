#!/usr/bin/env bash
set -euo pipefail

project=""
source_repo=""
vault_path="${RYAN_OBSIDIAN_VAULT:-}"
config_path="${RYAN_AGENT_WORK_KIT_CONFIG:-.ryan-agent-work-kit/obsidian-bridge.env}"

usage() {
  cat <<'USAGE'
Usage:
  sync-project-learning.sh [--project name] [--source-repo path] [--vault /path/to/ObsidianVault]

Reads a Markdown learning note from stdin and writes it to:
  <vault>/AIProjects/Learnings/YYYY-MM-DD-HHMM-<project>.md

The script writes local Markdown only. It does not upload, log in, or read your vault.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      project="${2:-}"
      shift 2
      ;;
    --source-repo)
      source_repo="${2:-}"
      shift 2
      ;;
    --vault)
      vault_path="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$vault_path" && -f "$config_path" ]]; then
  # shellcheck disable=SC1090
  source "$config_path"
  vault_path="${RYAN_OBSIDIAN_VAULT:-}"
fi

if [[ -z "$vault_path" ]]; then
  echo "missing Obsidian vault path; run setup-obsidian-bridge.sh or pass --vault" >&2
  exit 1
fi

if [[ -z "$source_repo" ]]; then
  source_repo="$(pwd)"
fi

if [[ -z "$project" ]]; then
  project="$(basename "$source_repo")"
fi

body="$(cat)"
if [[ -z "${body//[[:space:]]/}" ]]; then
  echo "stdin is empty; provide a Markdown learning note" >&2
  exit 1
fi

if printf '%s\n' "$body" | grep -Eiq 'sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9_]{30,}|glpat-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{35}|(api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password)[[:space:]]*[:=][[:space:]]*[^[:space:]]{8,}'; then
  echo "possible secret detected in note body; rewrite without secrets or credentials" >&2
  exit 1
fi

safe_project="$(printf '%s' "$project" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//')"
if [[ -z "$safe_project" ]]; then
  safe_project="project"
fi

target_dir="$vault_path/AIProjects/Learnings"
mkdir -p "$target_dir"

timestamp="$(date '+%Y-%m-%d %H:%M')"
file_stamp="$(date '+%Y-%m-%d-%H%M')"
note_path="$target_dir/$file_stamp-$safe_project.md"

{
  echo "---"
  echo "title: \"$project learning\""
  echo "type: project-learning"
  echo "project: \"$project\""
  echo "source_repo: \"$source_repo\""
  echo "created: \"$timestamp\""
  echo "tags:"
  echo "  - ai-project"
  echo "  - project-learning"
  echo "  - ryan-agent-work-kit"
  echo "---"
  echo
  echo "# $project Learning"
  echo
  printf '%s\n' "$body"
  echo
} > "$note_path"

echo "$note_path"
