#!/bin/bash
# Publish the CURRENT working tree (committed or not) as a test build at https://mrchillfirexiv.github.io/PLEDGE/preview/
# It goes to the 'preview' branch only: main, the real game and players' saves are untouched (the preview has its own save storage).
# Then open that URL in the person's browser (built-in browser / Chrome) to test on a real graphics card. Ready in ~1-2 min.
set -e
cd "$(dirname "$0")/.."
python3 build.py --check >/dev/null || { echo "build failed; not published"; exit 1; }
T=$(mktemp); trap 'rm -f "$T"' EXIT
GIT_INDEX_FILE=$T git read-tree HEAD
GIT_INDEX_FILE=$T git add -A
TREE=$(GIT_INDEX_FILE=$T git write-tree)
C=$(git commit-tree "$TREE" -p HEAD -m "Preview of $(git rev-parse --short HEAD) + working changes ($(date -u +%H:%MZ))")
git push -q -f origin "$C:refs/heads/preview" 2>&1 | grep -v "acknowledgments\|negotiation" || true
echo "pushed preview $C"
# Pages only deploys from main: re-run the main workflow, which also builds the preview branch into /preview/ (needs the gh CLI)
command -v gh >/dev/null || { echo "now run the 'Publish game to GitHub Pages' workflow on main (Actions tab)"; exit 0; }
T0=$(date -u +%Y-%m-%dT%H:%M:%SZ)
gh api -X POST repos/MrChillFireXIV/PLEDGE/actions/workflows/pages.yml/dispatches -f ref=main >/dev/null
sleep 6
for i in $(seq 1 40); do
    s=$(gh api repos/MrChillFireXIV/PLEDGE/actions/runs --jq "[.workflow_runs[]|select(.event==\"workflow_dispatch\" and .created_at>=\"$T0\")][0]|(.status+\" \"+(.conclusion//\"\"))" 2>/dev/null || true)
    case "$s" in "completed success") echo "preview live: https://mrchillfirexiv.github.io/PLEDGE/preview/"; exit 0;; completed*) echo "preview build failed: $s"; exit 1;; esac
    sleep 10
done; echo "still deploying; check the Actions tab"
