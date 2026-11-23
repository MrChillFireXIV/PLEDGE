#!/bin/bash
# V439 Xbox-sized memory test. Runs the built game in Chromium (Edge's engine) inside a memory cgroup of MB megabytes, with an Edge-on-Xbox
# user agent (so LITE switches on by itself), a 1280x639 window and a 740 MB script limit, like the Xbox's own reports. Software graphics,
# so "graphics card" memory comes out of the same cage, like the Xbox's shared memory. Prints what happened and the peak memory.
#   tools/xbox/cage.sh 900                 title screen only
#   PLAY=1 tools/xbox/cage.sh 900          also skip into a quest, walk around campus and go into two buildings
# Needs a writable cgroup v1 memory controller (true in the Claude cloud container). Includes ~100 MB for the test driver itself.
MB=${1:-900}; URL=${2:-file://$(cd "$(dirname "$0")/../.." && pwd)/dist/PLEDGE.html}; SECS=${3:-30}
BASE=/sys/fs/cgroup/memory$(awk -F: '$2=="memory"{print $3}' /proc/self/cgroup); M=$BASE/xbox_$$
mkdir -p "$M" || { echo "no writable memory cgroup here"; exit 1; }
echo $((MB*1024*1024)) > "$M/memory.limit_in_bytes"; echo $((MB*1024*1024)) > "$M/memory.memsw.limit_in_bytes" 2>/dev/null
sh -c "echo \$\$ > '$M/cgroup.procs'; exec env PLAY=$PLAY NODE_PATH=$(npm root -g) node '$(dirname "$0")/run.js' '$URL' $SECS" 2>&1 | grep -v '^\s*at ' | tail -2
echo "peak $(( $(cat "$M/memory.max_usage_in_bytes")/1024/1024 )) MB of $MB MB"; sleep 1; rmdir "$M" 2>/dev/null
