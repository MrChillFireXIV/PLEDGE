// PLEDGE bug report server: no dependencies, Node 18+.
//   node server.js                      -> http://localhost:8787
//   PORT=8080 ADMIN_KEY=secret node server.js
// The game sends reports to  POST <this server>/api/bugs  (set BUG_URL in src/js/24a-bug-report.js to this server's address).
// Open  <this server>/?key=ADMIN_KEY  in a browser to read reports, see the pictures, and mark them open / fixed / deleted.
// Reports are stored as files in ./reports (one .json per report, plus a .jpg/.png if a picture was attached).
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=+process.env.PORT||8787,KEY=process.env.ADMIN_KEY||'',DIR=path.resolve(process.env.REPORTS_DIR||path.join(__dirname,'reports'));
const MAX=12*1024*1024;   // 12 MB per report (pictures are shrunk to 1280 px by the game, so real reports are ~200 KB)
fs.mkdirSync(DIR,{recursive:true});
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
const send=(res,code,body,type='application/json',extra={})=>{res.writeHead(code,Object.assign({'Content-Type':type,'Cache-Control':'no-store'},cors,extra));res.end(typeof body==='string'||Buffer.isBuffer(body)?body:JSON.stringify(body))};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cookieKey=req=>((req.headers.cookie||'').match(/(?:^|;\s*)bugkey=([^;]+)/)||[])[1];
const admin=(req,url)=>!KEY||url.searchParams.get('key')===KEY||decodeURIComponent(cookieKey(req)||'')===KEY;
const list=()=>fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).map(f=>{try{return JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8'))}catch(e){return null}}).filter(Boolean).sort((a,b)=>b.received.localeCompare(a.received));
const readBody=req=>new Promise((ok,bad)=>{let n=0;const ch=[];req.on('data',c=>{n+=c.length;if(n>MAX){bad(new Error('too big'));req.destroy()}else ch.push(c)});req.on('end',()=>ok(Buffer.concat(ch)));req.on('error',bad)});
// simple flood guard: 20 reports per address per 10 minutes
const hits=new Map();const limited=ip=>{const now=Date.now(),a=(hits.get(ip)||[]).filter(t=>now-t<600000);a.push(now);hits.set(ip,a);return a.length>20};

function page(reps,key){const q=key?'?key='+encodeURIComponent(key):'';const counts={open:0,fixed:0};for(const r of reps)counts[r.status==='fixed'?'fixed':'open']++;
  const card=r=>{const m=r.meta||{};return`<article class="${r.status==='fixed'?'fixed':''}" id="r${esc(r.id)}">
    <header><b>${r.status==='fixed'?'✅ Fixed':'🐞 Open'}</b><time>${esc(new Date(r.received).toLocaleString())}</time><code>#${esc(r.id)}</code></header>
    <p class="txt">${esc(r.text)}</p>
    ${r.image?`<a href="/img/${esc(r.image)}${q}" target="_blank"><img src="/img/${esc(r.image)}${q}" alt="attached picture"></a>`:'<p class="none">No picture attached.</p>'}
    <dl>${[['Chapter',m.ch],['Day',m.day],['Time',m.time],['Quest',m.quest],['Where',(m.inside||'outdoors')+(m.pos?' · '+m.pos.join(', '):'')],['Level',m.lvl],['Graphics',m.gfx],['Screen',m.screen],['Version',m.ver],['Browser',m.ua]].filter(x=>x[1]!==undefined&&x[1]!=='').map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    <form method="post" action="/api/bugs/${esc(r.id)}/status${q}"><button name="s" value="${r.status==='fixed'?'open':'fixed'}">${r.status==='fixed'?'Reopen':'Mark fixed'}</button><button name="s" value="delete" class="del" onclick="return confirm('Delete this report?')">Delete</button></form></article>`};
  return`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PLEDGE bug reports</title>
<style>body{font:15px/1.45 system-ui,sans-serif;margin:0;background:#f4efe4;color:#2a2118}main{max-width:900px;margin:0 auto;padding:20px 16px}h1{color:#7d1f2c;margin:0 0 4px}
.top{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;margin-bottom:16px}.top a{color:#7d1f2c}article{background:#fffdf6;border:1px solid #d8c9a6;border-radius:10px;padding:14px 16px;margin:0 0 14px}
article.fixed{opacity:.62}header{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}header time{color:#6b5b45}header code{color:#9a8a70;font-size:12px}.txt{white-space:pre-wrap;font-size:16px}
img{max-width:100%;max-height:420px;border-radius:8px;border:1px solid #d8c9a6;display:block}.none{color:#9a8a70;font-style:italic}dl{display:grid;grid-template-columns:max-content 1fr;gap:2px 12px;font-size:13px;color:#4a3d2c;margin:10px 0}
dt{font-weight:600}dd{margin:0;word-break:break-word}form{display:flex;gap:8px}button{font:inherit;padding:6px 12px;border-radius:6px;border:1px solid #7d1f2c;background:#7d1f2c;color:#fff;cursor:pointer}button.del{background:#fff;color:#7d1f2c}
.filt a{margin-right:10px}</style><main><h1>PLEDGE bug reports</h1>
<div class="top"><span>${counts.open} open · ${counts.fixed} fixed</span><span class="filt"><a href="/${q}">All</a><a href="/${q}${q?'&':'?'}show=open">Open</a><a href="/${q}${q?'&':'?'}show=fixed">Fixed</a></span></div>
${reps.length?reps.map(card).join(''):'<p>No reports yet.</p>'}</main>`}

http.createServer(async(req,res)=>{const url=new URL(req.url,'http://x');const p=url.pathname;
  try{
    if(req.method==='OPTIONS')return send(res,204,'');
    if(req.method==='POST'&&p==='/api/bugs'){const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim();if(limited(ip))return send(res,429,{error:'too many reports, try again later'});
      const raw=await readBody(req);let b;try{b=JSON.parse(raw)}catch(e){return send(res,400,{error:'bad json'})}
      const text=String(b.text||'').trim().slice(0,4000);if(text.length<2)return send(res,400,{error:'no text'});
      const id=Date.now().toString(36)+'-'+crypto.randomBytes(3).toString('hex');let image=null;
      const m=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(b.image||''));if(m){const ext=m[1]==='jpeg'?'jpg':m[1];image=id+'.'+ext;fs.writeFileSync(path.join(DIR,image),Buffer.from(m[2],'base64'))}
      const meta=b.meta&&typeof b.meta==='object'?b.meta:{};const rep={id,text,image,meta,sentAt:String(b.at||''),received:new Date().toISOString(),status:'open'};
      fs.writeFileSync(path.join(DIR,id+'.json'),JSON.stringify(rep,null,1));console.log('report',id,text.slice(0,80).replace(/\s+/g,' '));return send(res,201,{ok:true,id})}
    const isAdmin=admin(req,url),key=url.searchParams.get('key');const setCookie=key&&KEY&&key===KEY?{'Set-Cookie':'bugkey='+encodeURIComponent(key)+'; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000'}:{};
    if(!isAdmin)return send(res,401,'<p style="font:16px system-ui;padding:20px">Add <code>?key=YOUR_ADMIN_KEY</code> to the address to read reports.</p>','text/html');
    const mi=/^\/api\/bugs\/([\w-]+)\/status$/.exec(p);
    if(req.method==='POST'&&mi){const f=path.join(DIR,mi[1]+'.json');if(!fs.existsSync(f))return send(res,404,{error:'not found'});const raw=(await readBody(req)).toString();const s=new URLSearchParams(raw).get('s')||(()=>{try{return JSON.parse(raw).s}catch(e){return''}})();
      const r=JSON.parse(fs.readFileSync(f,'utf8'));if(s==='delete'){fs.unlinkSync(f);if(r.image)try{fs.unlinkSync(path.join(DIR,r.image))}catch(e){}}else if(s==='fixed'||s==='open'){r.status=s;fs.writeFileSync(f,JSON.stringify(r,null,1))}
      return send(res,303,'','text/plain',{Location:'/'+(key?'?key='+encodeURIComponent(key):'')})}
    if(req.method==='GET'&&p==='/api/bugs')return send(res,200,list(),'application/json',setCookie);
    const im=/^\/img\/([\w-]+\.(jpg|png|webp))$/.exec(p);if(req.method==='GET'&&im){const f=path.join(DIR,im[1]);if(!fs.existsSync(f))return send(res,404,'');return send(res,200,fs.readFileSync(f),{jpg:'image/jpeg',png:'image/png',webp:'image/webp'}[im[2]])}
    if(req.method==='GET'&&p==='/'){const show=url.searchParams.get('show');let reps=list();if(show==='open')reps=reps.filter(r=>r.status!=='fixed');if(show==='fixed')reps=reps.filter(r=>r.status==='fixed');return send(res,200,page(reps,key&&KEY?key:''),'text/html; charset=utf-8',setCookie)}
    send(res,404,{error:'not found'})}
  catch(e){console.error(e);send(res,500,{error:'server error'})}
}).listen(PORT,()=>console.log('PLEDGE bug server on http://localhost:'+PORT+(KEY?'  (viewer: /?key=…)':'  (no ADMIN_KEY set: the viewer is open to anyone)')+'  reports in '+DIR));
