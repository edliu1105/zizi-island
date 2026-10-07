#!/usr/bin/env bash
# The release check: every suite, one after the other; summary -> tests/logs/<tag>_summary.txt   usage: tests/run_all.sh [tag]
set -u
cd "$(dirname "$0")/.."
TAG="${1:-rel}"
export PYTHONIOENCODING=utf-8
OUT="tests/logs/${TAG}_summary.txt"
mkdir -p tests/logs
: > "$OUT"
echo "app md5 $(md5sum index.html | cut -c1-10)  start $(date +%H:%M:%S)" >> "$OUT"
BAD=""
run() {
  local name="$1"; shift
  local t0=$(date +%s)
  python "$@" > "tests/logs/${TAG}_${name}.txt" 2>&1
  local rc=$?
  local sum=$(grep -a "SUMMARY" "tests/logs/${TAG}_${name}.txt" | tail -n 1 | sed 's/^[0-9:]* //')
  if [ "$rc" != "0" ] || [ -z "$sum" ]; then BAD="$BAD $name"; fi
  printf "%-10s rc=%s  %-40s %s min\n" "$name" "$rc" "$sum" "$(awk -v a="$t0" -v b="$(date +%s)" 'BEGIN{printf "%.1f", (b-a)/60}')" >> "$OUT"
}
run core      tests/test_core.py
run r1        tests/test_r1.py
run r2        tests/test_r2.py
run r3        tests/test_r3.py
run pointer   tests/test_pointer.py
run layout    tests/test_layout.py
run voiceflow tests/test_voiceflow.py
echo "end $(date +%H:%M:%S)" >> "$OUT"
if [ -n "$BAD" ]; then echo "ALL: FAIL -$BAD" >> "$OUT"; else echo "ALL: PASS" >> "$OUT"; fi
cat "$OUT"
[ -z "$BAD" ]
