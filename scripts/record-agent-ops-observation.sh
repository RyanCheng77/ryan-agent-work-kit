#!/usr/bin/env bash
set -euo pipefail

target_dir="${AGENT_OPS_DIR:-}"
vault_path="${RYAN_OBSIDIAN_VAULT:-}"
config_path="${RYAN_AGENT_WORK_KIT_CONFIG:-.ryan-agent-work-kit/obsidian-bridge.env}"
dry_run=0
capture_method="assisted"
confidence="medium"
measurement="mixed"
source="agent"
allow_missing_evidence=0
schema_version="0.3"
migrate_tsv=0

usage() {
  cat <<'USAGE'
Usage:
  record-agent-ops-observation.sh [--dry-run] [--capture-method manual|assisted|hook|script] [--confidence low|medium|high] [--measurement measured|estimated|mixed|unknown] [--source <name>] [--vault /path/to/ObsidianVault] [--allow-missing-evidence] [--migrate-tsv]

Reads a Markdown observation from stdin and appends it to:
  $AGENT_OPS_DIR/YYYY-MM-agent-ops.md
  or <ObsidianVault>/AIProjects/AgentOps/YYYY-MM-agent-ops.md
  or ./docs/agent-ops/YYYY-MM-agent-ops.md

Also appends a machine-readable TSV row to:
  matching YYYY-MM-agent-ops.tsv beside the Markdown file

By default, observations must include one evidence marker:
  validation_evidence, evidence_ref, Evidence, or 证据

If the monthly TSV was created by an older 0.1 or 0.2 schema, rerun once with:
  --migrate-tsv
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      dry_run=1
      shift
      ;;
    --capture-method)
      capture_method="${2:-}"
      shift 2
      ;;
    --confidence)
      confidence="${2:-}"
      shift 2
      ;;
    --measurement)
      measurement="${2:-}"
      shift 2
      ;;
    --source)
      source="${2:-}"
      shift 2
      ;;
    --vault)
      vault_path="${2:-}"
      shift 2
      ;;
    --allow-missing-evidence)
      allow_missing_evidence=1
      shift
      ;;
    --migrate-tsv)
      migrate_tsv=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

case "$capture_method" in
  manual|assisted|hook|script) ;;
  *)
    echo "invalid --capture-method: $capture_method" >&2
    echo "allowed: manual, assisted, hook, script" >&2
    exit 1
    ;;
esac

case "$confidence" in
  low|medium|high) ;;
  *)
    echo "invalid --confidence: $confidence" >&2
    echo "allowed: low, medium, high" >&2
    exit 1
    ;;
esac

case "$measurement" in
  measured|estimated|mixed|unknown) ;;
  *)
    echo "invalid --measurement: $measurement" >&2
    echo "allowed: measured, estimated, mixed, unknown" >&2
    exit 1
    ;;
esac

if [[ "$allow_missing_evidence" -eq 1 && "$confidence" != "low" ]]; then
  echo "--allow-missing-evidence requires --confidence low" >&2
  exit 1
fi

if [[ -z "$vault_path" && -f "$config_path" ]]; then
  # shellcheck disable=SC1090
  source "$config_path"
  vault_path="${RYAN_OBSIDIAN_VAULT:-}"
fi

if [[ -z "$target_dir" ]]; then
  if [[ -n "$vault_path" ]]; then
    target_dir="$vault_path/AIProjects/AgentOps"
  else
    target_dir="./docs/agent-ops"
  fi
fi

body="$(cat)"
if [[ -z "${body//[[:space:]]/}" ]]; then
  echo "stdin is empty; provide a Markdown observation" >&2
  exit 1
fi

if [[ "$allow_missing_evidence" -eq 0 ]]; then
  if ! printf '%s\n' "$body" | grep -Eiq 'validation_evidence|evidence_ref|Evidence|证据'; then
    echo "missing evidence marker; include validation_evidence, evidence_ref, Evidence, or 证据" >&2
    echo "or rerun with --allow-missing-evidence and --confidence low" >&2
    exit 1
  fi
fi

if printf '%s\n' "$body" | grep -Eiq 'sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9_]{30,}|glpat-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{35}|(api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password)[[:space:]]*[:=][[:space:]]*[^[:space:]]{8,}'; then
  echo "possible secret detected in observation body; rewrite the observation without secrets or credentials" >&2
  exit 1
fi

month="$(date '+%Y-%m')"
timestamp="$(date '+%Y-%m-%d %H:%M')"
record_id="$(date '+%Y%m%d%H%M%S')-$$"
note_path="$target_dir/$month-agent-ops.md"
tsv_path="$target_dir/$month-agent-ops.tsv"

if [[ "$dry_run" -eq 1 ]]; then
  echo "$note_path"
  echo "$tsv_path"
  exit 0
fi

mkdir -p "$target_dir"

if [[ ! -f "$note_path" ]]; then
  {
    echo "---"
    echo "title: \"$month Agent Ops\""
    echo "type: agent-ops-observability"
    echo "created: \"$(date '+%Y-%m-%d')\""
    echo "tags:"
    echo "  - agent-ops"
    echo "  - ai-ready-project"
    echo "---"
    echo
    echo "# $month Agent Ops"
    echo
  } > "$note_path"
fi

{
  echo
  echo "## $timestamp"
  echo
  echo "Record ID: $record_id"
  echo
  echo "Capture:"
  echo "- capture_method: $capture_method"
  echo "- confidence: $confidence"
  echo "- measurement: $measurement"
  echo "- source: $source"
  echo
  printf '%s\n' "$body"
  echo
} >> "$note_path"

extract_field() {
  local key="$1"
  printf '%s\n' "$body" \
    | sed -n -E "s/^[[:space:]]*-[[:space:]]*$key:[[:space:]]*(.*)[[:space:]]*$/\\1/ip" \
    | head -n 1 \
    | tr '\t\r\n' '   ' \
    | sed -E 's/[[:space:]]+$//'
}

tsv_columns=(
  "schema_version" "record_id" "timestamp" "capture_method" "confidence" "measurement" "source"
  "project" "task_id" "trigger_reason" "route" "task_type" "agents_used" "agent_roles"
  "collaboration_mode" "human_intervention_type" "decision_changed_scope" "handoff_or_takeover"
  "wall_time_min" "agent_wait_time_min" "local_work_while_waiting" "acceptance" "rework_count" "error_type"
  "task_card_quality" "context_scope" "waste_pattern" "primary_bottleneck" "improvement_action" "validation_evidence"
  "evidence_ref" "lesson"
)
tsv_header="$(IFS=$'\t'; printf '%s' "${tsv_columns[*]}")"

tsv_v0_2_columns=(
  "schema_version" "record_id" "timestamp" "capture_method" "confidence" "measurement" "source"
  "project" "task_id" "trigger_reason" "route" "task_type" "agents_used" "agent_roles" "wall_time_min" "agent_wait_time_min"
  "local_work_while_waiting" "acceptance" "rework_count" "error_type" "task_card_quality" "context_scope" "waste_pattern"
  "primary_bottleneck" "improvement_action" "validation_evidence" "evidence_ref" "lesson"
)
tsv_v0_2_header="$(IFS=$'\t'; printf '%s' "${tsv_v0_2_columns[*]}")"

tsv_v0_1_columns=(
  "record_id" "timestamp" "capture_method" "confidence" "measurement" "source" "route" "task_type" "agents_used"
  "wall_time_min" "agent_wait_time_min" "local_work_while_waiting" "acceptance" "rework_count" "error_type"
  "task_card_quality" "context_scope" "waste_pattern" "validation_evidence" "evidence_ref" "lesson"
)
tsv_v0_1_header="$(IFS=$'\t'; printf '%s' "${tsv_v0_1_columns[*]}")"

if [[ ! -f "$tsv_path" ]]; then
  printf '%s\n' "$tsv_header" > "$tsv_path"
fi

actual_header="$(head -n 1 "$tsv_path")"
if [[ "$actual_header" != "$tsv_header" ]]; then
  if [[ "$migrate_tsv" -eq 1 && "$actual_header" == "$tsv_v0_2_header" ]]; then
    backup_path="$tsv_path.pre-v0.3.$(date '+%Y%m%d%H%M%S').bak"
    cp "$tsv_path" "$backup_path"
    awk -F '\t' -v OFS='\t' -v header="$tsv_header" '
      NR == 1 { print header; next }
      {
        print $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, "", "", "", "", $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
      }
    ' "$backup_path" > "$tsv_path"
    echo "migrated TSV schema to $schema_version; backup: $backup_path" >&2
  elif [[ "$migrate_tsv" -eq 1 && "$actual_header" == "$tsv_v0_1_header" ]]; then
    backup_path="$tsv_path.pre-v0.3.$(date '+%Y%m%d%H%M%S').bak"
    cp "$tsv_path" "$backup_path"
    awk -F '\t' -v OFS='\t' -v header="$tsv_header" '
      NR == 1 { print header; next }
      {
        print "0.1", $1, $2, $3, $4, $5, $6, "", "", "", $7, $8, $9, "", "", "", "", "", $10, $11, $12, $13, $14, $15, $16, $17, $18, "", "", $19, $20, $21
      }
    ' "$backup_path" > "$tsv_path"
    echo "migrated TSV schema to $schema_version; backup: $backup_path" >&2
  else
    echo "TSV schema mismatch: $tsv_path" >&2
    echo "Expected schema_version $schema_version." >&2
    echo "If this is an old 0.1 or 0.2 schema, rerun once with --migrate-tsv to create a backup and add the new columns." >&2
    echo "If it is another schema, stop and migrate manually before appending." >&2
    exit 1
  fi
fi

tsv_row=(
  "$schema_version" "$record_id" "$timestamp" "$capture_method" "$confidence" "$measurement" "$source"
  "$(extract_field project)" "$(extract_field task_id)" "$(extract_field trigger_reason)" "$(extract_field route)"
  "$(extract_field task_type)" "$(extract_field agents_used)" "$(extract_field agent_roles)"
  "$(extract_field collaboration_mode)" "$(extract_field human_intervention_type)" "$(extract_field decision_changed_scope)" "$(extract_field handoff_or_takeover)"
  "$(extract_field wall_time_min)" "$(extract_field agent_wait_time_min)" "$(extract_field local_work_while_waiting)"
  "$(extract_field acceptance)" "$(extract_field rework_count)" "$(extract_field error_type)" "$(extract_field task_card_quality)"
  "$(extract_field context_scope)" "$(extract_field waste_pattern)" "$(extract_field primary_bottleneck)" "$(extract_field improvement_action)"
  "$(extract_field validation_evidence)" "$(extract_field evidence_ref)" "$(extract_field lesson)"
)
(IFS=$'\t'; printf '%s\n' "${tsv_row[*]}") >> "$tsv_path"

echo "$note_path"
echo "$tsv_path"
