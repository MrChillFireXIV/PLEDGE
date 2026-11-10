#!/usr/bin/env bash
# Update the PLEDGE repo with a new game version and publish it (Mac/Linux/Git Bash).
#   scripts/update.sh ~/Downloads/pledge-split-v290.zip     (or a project folder)
# Add --no-push to commit without pushing.
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
KEEP=" .git .github pages scripts README.md .gitignore dist _site "
SRC="${1:?give the new game zip or folder}"; PUSH=1; [ "${2:-}" = "--no-push" ] && PUSH=0
TMP=""
cleanup(){ [ -n "$TMP" ] && rm -rf "$TMP"; }; trap cleanup EXIT

if [ -d "$SRC" ]; then FROM="$SRC"
else
  case "$SRC" in *.zip) ;; *) echo "Give the project zip (with src/ and build.py), not the .html file." >&2; exit 1;; esac
  TMP="$(mktemp -d)"; unzip -q "$SRC" -d "$TMP"; FROM="$TMP"
fi
PROJ=""
while IFS= read -r f; do d="$(dirname "$f")"; [ -f "$d/src/order.txt" ] && { PROJ="$d"; break; }; done \
  < <(find "$FROM" -name build.py -type f | awk '{print length, $0}' | sort -n | cut -d' ' -f2-)
[ -n "$PROJ" ] || { echo "No build.py with src/order.txt found." >&2; exit 1; }

cd "$REPO"
for f in $(ls -A); do case "$KEEP" in *" $f "*) ;; *) rm -rf "$f";; esac; done
for f in $(ls -A "$PROJ"); do case "$KEEP" in *" $f "*) ;; *) cp -R "$PROJ/$f" "$REPO/";; esac; done

VER="$(grep -oE '^- V[0-9]+' docs/HISTORY.md 2>/dev/null | grep -oE '[0-9]+' | sort -n | tail -1 || true)"
VER="${VER:+V$VER}"; VER="${VER:-new version}"
git add -A
if git diff --cached --quiet; then echo "Nothing changed; the repo already has this version."; exit 0; fi
git commit -m "Update game to $VER"
if [ $PUSH = 1 ]; then git push; echo "Pushed $VER. The site updates in about a minute."; else echo "Committed $VER (not pushed)."; fi
