#!/bin/bash
# Quick story/visual check with all story drivers loaded:  tools/q.sh OUTDIR "eval:JS" ["pcam:js:name"] ...
# Lite mode (800x450, no post). Prints only eval results, shot paths and errors. Shots land in OUTDIR/.
cd "$(dirname "$0")/.."
O=$1;shift
D1=$(tr -d '\n' < tools/story-driver.js);D4=$(tr -d '\n' < tools/story-driver4.js);D5=$(tr -d '\n' < tools/story-driver5.js)
timeout 1500 node tools/run.js --lite --out "$O" --steps 2 "eval:$D1" "eval:$D4" "eval:$D5" "$@" > "$O.log" 2>&1
grep -o '})(): .*\|shot: .*\|Error.*\|crashed.*\|no JS errors' "$O.log" | cut -c1-1500 | tail -8
