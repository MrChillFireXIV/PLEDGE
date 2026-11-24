// V442 memdump.js URL: Xbox identity load, runs PRE (env, JS, may be async) then waits WT ms, then asks Chromium for a memory-infra dump and prints
// the biggest allocators per process (renderer: v8, blink_gc, malloc, canvas, webgl...). DET=1 cleans up first (live memory only); default shows
// what is really held, garbage included. Run: PRE="..." WT=1000 NODE_PATH=$(npm root -g) node --max-old-space-size=4000 tools/xbox/memdump.js URL
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--js-flags=--max-old-space-size=740','--enable-precise-memory-info']});
const ctx=await b.newContext({viewport:{width:1280,height:639},userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0'});const p=await ctx.newPage();
await p.goto(process.argv[2],{waitUntil:'commit'});await p.waitForFunction(()=>typeof mode!=='undefined'&&mode==='title',null,{timeout:150000});
if(process.env.PRE){await p.evaluate(process.env.PRE);await p.waitForTimeout(+process.env.WT||1500)}
const s=await b.newBrowserCDPSession();const chunks=[];s.on('Tracing.dataCollected',e=>{for(const x of e.value)if(x.ph==='v'||x.ph==='M')chunks.push(x)});const done=new Promise(r=>s.on('Tracing.tracingComplete',r));
await s.send('Tracing.start',{traceConfig:{includedCategories:['disabled-by-default-memory-infra'],excludedCategories:['*'],memoryDumpConfig:{triggers:[]}},transferMode:'ReportEvents'});
await s.send('Tracing.requestMemoryDump',{deterministic:!!process.env.DET,levelOfDetail:'detailed'});await s.send('Tracing.end');await done;
const pn={};for(const e of chunks)if(e.ph==='M'&&e.name==='process_name')pn[e.pid]=e.args.name;
console.log('events',chunks.length,[...new Set(chunks.map(e=>e.ph+':'+e.name))].slice(0,15).join(','));for(const e of chunks){if(e.ph!=='v'||!e.args||!e.args.dumps||!e.args.dumps.allocators)continue;const A=e.args.dumps.allocators;const name=pn[e.pid]||e.pid;const rows=[];
  for(const k in A){const sz=A[k].attrs&&A[k].attrs.size?parseInt(A[k].attrs.size.value,16):0;if(sz>4e6&&k.split("/").length<=2)rows.push([k,Math.round(sz/1e6)])}
  rows.sort((a,b)=>b[1]-a[1]);console.log(name+': '+rows.slice(0,60).map(r=>r[0]+' '+r[1]).join(' · '))}
await b.close()})();
