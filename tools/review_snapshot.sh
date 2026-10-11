#!/usr/bin/env bash
# A frozen snapshot of the app for an independent review (the reviewer works on the copy, never on the app).
# usage: tools/review_snapshot.sh <Rn>      brief = docs/REVIEW-<Rn>-TASK.md -> review/<Rn>/REVIEW_TASK.md
set -u
cd "$(dirname "$0")/.."
RN="$1"; SNAP="review/$RN"
rm -rf "$SNAP"; mkdir -p "$SNAP"
# exactly what is published (HEAD): no local leftovers (scratch pages, unpublished tests) in the reviewer's copy
git archive HEAD | tar -x -C "$SNAP"
rm -rf "$SNAP/tests/logs"; mkdir -p "$SNAP/tests/logs"
cp "docs/REVIEW-$RN-TASK.md" "$SNAP/REVIEW_TASK.md"
echo "snapshot $SNAP $(md5sum index.html | cut -c1-10)"
