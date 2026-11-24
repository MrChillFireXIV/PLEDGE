#!/bin/bash
# V442 watch.sh URL: runs tools/xbox/steps.js in a memory cage (LIM MB, default 4000 = roomy) and prints, every 0.25 s, the cage's total use and
# each browser process's real memory as anon/shared/file MB, interleaved with the step markers. Shows which process grows at which step.
#   STEPS='["window.PLEDGE_PREVIEW=0;$(\"title\").hidden=true;chapJump(\"c3house\")","goOut(300,300)"]' WT=4000 tools/xbox/watch.sh file://$PWD/dist/PLEDGE.html
#   LIM=900 ... tools/xbox/watch.sh ...      (watch it inside a 900 MB cage, up to the crash)
D=$(cd "$(dirname "$0")" && pwd)
B=/sys/fs/cgroup/memory$(awk -F: '$2=="memory"{print $3}' /proc/self/cgroup); M=$B/xw_$$
mkdir -p $M || { echo "no writable memory cgroup here"; exit 1; }
echo $((${LIM:-4000}*1024*1024)) > $M/memory.limit_in_bytes; echo $((${LIM:-4000}*1024*1024)) > $M/memory.memsw.limit_in_bytes 2>/dev/null; t0=$(date +%s.%N)
( sh -c "echo \$\$ > $M/cgroup.procs; exec env STEPS='$STEPS' WT=$WT INIT='$INIT' NODE_PATH=$(npm root -g) node '$D/steps.js' '$1'" 2>&1 | grep -v agent-proxy | sed 's/^/>> /' ) &
pid=$!
while kill -0 $pid 2>/dev/null; do s=""; for p in $(cat $M/cgroup.procs 2>/dev/null); do ty=$(tr '\0' ' ' </proc/$p/cmdline 2>/dev/null | grep -o -- '--type=[a-z-]*' | head -1); [ -z "$ty" ] && ty=$(cat /proc/$p/comm 2>/dev/null); a=$(awk '/RssAnon/{a=int($2/1024)}/RssShmem/{s=int($2/1024)}/RssFile/{f=int($2/1024)}END{print a"a/"s"s/"f"f"}' /proc/$p/status 2>/dev/null); s="$s ${ty#--type=}:$a"; done
 printf "%5.1f use=%d %s\n" $(echo "$(date +%s.%N)-$t0"|bc) $(( $(cat $M/memory.usage_in_bytes 2>/dev/null || echo 0)/1048576 )) "$s"; sleep .25; done
sleep 1; rmdir $M 2>/dev/null
