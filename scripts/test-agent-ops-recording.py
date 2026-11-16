#!/usr/bin/env python3
"""Isolated regression checks for AgentOps recording."""
import csv
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/record-agent-ops-observation.sh'
BODY = '''project: test
task_id: test-1
trigger_reason: workflow_review
route: S2
task_type: research
acceptance: unknown
rework_count: unknown
primary_bottleneck: unknown
improvement_action: unknown
lesson: check extraction
validation_evidence: isolated test
'''

class Recording(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name)
    def run_record(self, body=BODY, *args):
        env = {**os.environ, 'AGENT_OPS_DIR': str(self.path)}
        return subprocess.run(['bash', str(SCRIPT), *args], input=body, text=True, capture_output=True, env=env)
    def test_plain_and_list_fields(self):
        for body in (BODY, ''.join('- ' + line for line in BODY.splitlines(keepends=True))):
            result = self.run_record(body)
            self.assertEqual(result.returncode, 0, result.stderr)
        with next(self.path.glob('*.tsv')).open() as f:
            rows = list(csv.DictReader(f, delimiter='\t'))
        self.assertEqual([r['project'] for r in rows], ['test', 'test'])
        self.assertEqual([r['acceptance'] for r in rows], ['unknown', 'unknown'])
    def test_bad_input_never_writes_including_dry_run(self):
        cases = [BODY.replace('task_id: test-1\n', ''), BODY.replace('validation_evidence: isolated test', 'validation_evidence:'), BODY.replace('acceptance: unknown', 'acceptance: prose'), BODY.replace('rework_count: unknown', 'rework_count: 1'), BODY + 'password: abcdefghijkl\n']
        for body in cases:
            for args in ((), ('--dry-run',)):
                self.assertNotEqual(self.run_record(body, *args).returncode, 0)
                self.assertEqual(list(self.path.iterdir()), [])
    def test_missing_evidence_low_only(self):
        body = BODY.replace('validation_evidence: isolated test\n', '')
        self.assertNotEqual(self.run_record(body, '--allow-missing-evidence').returncode, 0)
        self.assertEqual(self.run_record(body, '--allow-missing-evidence', '--confidence', 'low').returncode, 0)
    def test_schema_mismatch_does_not_write_markdown(self):
        import datetime
        target = self.path / (datetime.datetime.now().strftime('%Y-%m') + '-agent-ops.tsv')
        target.write_text('old\theader\n', encoding='utf-8')
        self.assertNotEqual(self.run_record().returncode, 0)
        self.assertEqual(target.read_text(), 'old\theader\n')
        self.assertEqual(list(self.path.glob('*.md')), [])

if __name__ == '__main__':
    unittest.main()
