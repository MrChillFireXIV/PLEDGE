// V442 steps.js URL: Xbox identity load, then runs STEPS (JSON array of JS strings, env) one by one, WT ms apart (env, default 4000), printing
// each result and the time; INIT (env) is added as an init script. Used by tools/xbox/watch.sh.
// step.js URL : load in Xbox identity, then run step list from env STEPS (JSON array of JS strings), waiting WT ms after each; prints marker lines with time
const {chromium}=require('playwright');(async()=>{const t0=Date.now();const b=await chromium.launch({args:['--use-gl=swiftshader','--ignore-gpu-blocklist','--js-flags=--max-old-space-size=740 --expose-gc','--enable-precise-memory-info','--renderer-process-limit=1']});
const ctx=await b.newContext({viewport:{width:1280,height:639},userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0'});const p=await ctx.newPage();
if(process.env.INIT)await p.addInitScript(process.env.INIT);const T=()=>((Date.now()-t0)/1000).toFixed(1);p.on('crash',()=>console.log(T(),'CRASH'));
await p.goto(process.argv[2],{waitUntil:'commit'});await p.waitForFunction(()=>typeof mode!=='undefined'&&mode==='title',null,{timeout:150000});console.log(T(),'title');
for(const s of JSON.parse(process.env.STEPS||'[]')){console.log(T(),'step',s.slice(0,40));try{const rv=await p.evaluate(s);if(rv!==undefined)console.log("   =",JSON.stringify(rv).slice(0,200))}catch(e){console.log('err',e.message.slice(0,80))}await p.waitForTimeout(+process.env.WT||4000)}
console.log(T(),'end');await b.close()})();
