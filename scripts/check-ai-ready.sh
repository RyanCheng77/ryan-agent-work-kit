#!/usr/bin/env bash
set -euo pipefail

target="${1:-.}"
missing=0

require_file() {
  local path="$target/$1"
  if [[ -f "$path" ]]; then
    echo "ok: $1"
  else
    echo "missing: $1"
    missing=1
  fi
}

require_dir() {
  local path="$target/$1"
  if [[ -d "$path" ]]; then
    echo "ok: $1/"
  else
    echo "missing: $1/"
    missing=1
  fi
}

require_file "AGENTS.md"
require_file "docs/project-overview.md"
require_file "docs/current-goal.md"
require_file "docs/roadmap.md"
require_dir "docs/qa"
require_dir "docs/handoffs"
require_dir "docs/plans"

if [[ "$missing" -eq 0 ]]; then
  echo "AI-ready project structure: pass"
else
  echo "AI-ready project structure: needs setup"
  exit 1
fi
