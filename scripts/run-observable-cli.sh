#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/run-observable-cli.sh --name <task-name> -- <command> [args...]
  scripts/run-observable-cli.sh --name <task-name> --trace-client <client> [--trace-prompt-file <file>] -- <command> [args...]

Runs an external CLI in the current terminal, ideally the Codex right-side
workspace terminal, mirrors output to the screen, and saves the same output
to .agent-runs/<timestamp>-<task-name>.log.

Examples:
  scripts/run-observable-cli.sh --name claude-review -- claude -p "Review this repo in read-only mode"
  scripts/run-observable-cli.sh --name kimi-plan -- kimi --plan -p "Review only the scoped files. Do not modify files."
  scripts/run-observable-cli.sh --name test-run -- npm test
  scripts/run-observable-cli.sh --name kimi-plan --trace-client kimi --trace-prompt-file prompt.txt -- \
    kimi --plan --output-format stream-json -p "Review the scoped files"

Safety:
  Do not put secrets, tokens, passwords, or private customer data in command args.
  Logs are local project artifacts. Review them before sharing or committing.
  For Kimi structured progress, add: --output-format stream-json
EOF
}

name=""
trace_client=""
trace_prompt_file=""
trace_session_id=""
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name)
      if [[ $# -lt 2 ]]; then
        echo "missing value for --name" >&2
        exit 2
      fi
      name="$2"
      shift 2
      ;;
    --trace-client)
      if [[ $# -lt 2 ]]; then
        echo "missing value for --trace-client" >&2
        exit 2
      fi
      trace_client="$2"
      shift 2
      ;;
    --trace-prompt-file)
      if [[ $# -lt 2 ]]; then
        echo "missing value for --trace-prompt-file" >&2
        exit 2
      fi
      trace_prompt_file="$2"
      shift 2
      ;;
    --trace-session-id)
      if [[ $# -lt 2 ]]; then
        echo "missing value for --trace-session-id" >&2
        exit 2
      fi
      trace_session_id="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    *)
      echo "unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$name" ]]; then
  echo "--name is required" >&2
  usage >&2
  exit 2
fi

if [[ $# -eq 0 ]]; then
  echo "command is required after --" >&2
  usage >&2
  exit 2
fi

safe_name="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//')"
if [[ -z "$safe_name" ]]; then
  safe_name="cli-run"
fi

run_dir="${AGENT_RUNS_DIR:-.agent-runs}"
mkdir -p "$run_dir"

timestamp="$(date '+%Y%m%d-%H%M%S')"
log_file="$run_dir/${timestamp}-${safe_name}.log"
start_epoch="$(date '+%s')"

echo "observable_cli_log=$log_file"

if [[ -n "$trace_prompt_file" && -z "$trace_client" ]]; then
  echo "--trace-prompt-file requires --trace-client" >&2
  exit 2
fi
echo "observable_cli_started_at=$(date '+%Y-%m-%d %H:%M:%S %z')"
echo "observable_cli_name=$name"
echo "observable_cli_cwd=$(pwd)"
echo "observable_cli_note=watch this terminal for progress; inspect the log for evidence"

set +e
{
  echo "## Observable CLI Run"
  echo "started_at: $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "name: $name"
  echo "cwd: $(pwd)"
  echo "command_name: $1"
  echo "note: command arguments are intentionally not repeated here; avoid putting secrets in args."
  echo
  "$@"
  status=$?
  end_epoch="$(date '+%s')"
  echo
  echo "finished_at: $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "exit_code: $status"
  echo "elapsed_seconds: $((end_epoch - start_epoch))"
  exit "$status"
} 2>&1 | tee "$log_file"
status=${PIPESTATUS[0]}
set -e

echo "observable_cli_finished_at=$(date '+%Y-%m-%d %H:%M:%S %z')"
echo "observable_cli_exit_code=$status"
echo "observable_cli_log=$log_file"

if [[ -n "$trace_client" ]]; then
  trace_args=("--client" "$trace_client" "--log-file" "$log_file" "--project" "$(pwd)")
  if [[ -n "$trace_prompt_file" ]]; then trace_args+=("--prompt-file" "$trace_prompt_file"); fi
  if [[ -n "$trace_session_id" ]]; then trace_args+=("--session-id" "$trace_session_id"); fi
  set +e
  node "$script_dir/trace-cli-run.js" "${trace_args[@]}"
  trace_status=$?
  set -e
  echo "observable_cli_trace_exit_code=$trace_status"
fi

exit "$status"
