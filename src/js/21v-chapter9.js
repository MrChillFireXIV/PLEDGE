// ================================================================ V162 CHAPTER 9 · HELL WEEK (the Lantern Walk finale moves to chapter 10)
// Seven days, seven flames, seven Nightmares. Back from the Haze Room, Danny starts the last week before initiation. Grant oversees it,
// Carter Vaughn (Pledge Master) runs the daily assignments and Logan Pierce (Vice President) helps. Every associate gets a candle that burns
// down all week. Daytime trials and Nightmare bonuses earn wax. If Danny's candle burns out, Hell Week starts over from Day 1.
//  c9d1 Day 1 · Fraternity History          c9n1 Night 1 · The Unworthy
//  c9d2 Day 2 · House Responsibilities      c9n2 Night 2 · The Endless House
//  c9d3 Day 3 · Physical Evaluation         c9n3 Night 3 · The Gauntlet of Fear
//  c9d4 Day 4 · Tradition and Endurance     c9n4 Night 4 · The Impossible Inspection
//  c9d5 Day 5 · Loyalty and Problem-Solving c9n5 Night 5 · The Betrayal Game
//  c9d6 Day 6 · Fraternity Secrets          c9n6 Night 6 · The Court of Secrets
//  c9d7 Day 7 · Final Evaluation            c9n7 Night 7 · The Final Judgment
// This file: renumbering, the candles (state, HUD, the candle table in the house), the Nightmare basement (interior c9pit) and its sets,
// robes and masks, the bandana, the minigame steps, hooks. Part 2 (21w): scenes and quests.
const C9={T:0,set:null,setN:0,doors:[],cand:null,hc:null,lap:null,vig:null,push:null,g:{},hudT:0,acts:[]};
const C9IDS=['c9d1','c9n1','c9d2','c9n2','c9d3','c9n3','c9d4','c9n4','c9d5','c9n5','c9d6','c9n6','c9d7','c9n7'];
const c9Fresh=()=>({wax:{danny:100,ezra:100,marcus:100},ach:{},day:0,lit:0});
const c9S=()=>S.c9||(S.c9=c9Fresh());
const c9On=()=>!!(AM&&C9IDS.includes(AM.m.id));

// ---------------------------------------------------------------- the Lantern Walk becomes chapter 10
for(const m of M)if(m.ch===9)m.ch=10;
CHN[9]='Hell Week';CHN[10]='The Lantern Walk';CHN[11]='Epilogue';
CHT[10]=CHT[9];
CHT[9]='Seven days. Seven flames. Seven Nightmares.\n\nThe Haze Room is still open, and the men who ran it still run Hell Week.';
XPM[10]=XPM[9];XPM[9]=170;

// ---------------------------------------------------------------- coordinates: the ASR house (days) and the Nightmare basement (nights)
const c9A=(x,z)=>{const I=INT.asr;return{int:'asr',x:I.x0+x,z:I.z0+z}};
const c9AX=(x,z)=>{const I=INT.asr;return[I.x0+x,I.z0+z]};
const c9AW=(x,y,z)=>{const I=INT.asr;return[I.x0+x,y,I.z0+z]};
// basement: main stage x 0-40 z 0-36 · the east wing (three rooms 40-48, 48-56, 56-64, z 0-18, doorways z 8-10.5) · the corridor z 36-44
const C9PIT={W:64,D:44,at:[680,1580]};
const c9Q=(x,z)=>{const I=INT.c9pit;return{int:'c9pit',x:I.x0+x,z:I.z0+z}};
const c9QX=(x,z)=>{const I=INT.c9pit;return[I.x0+x,I.z0+z]};
const c9QW=(x,y,z)=>{const I=INT.c9pit;return[I.x0+x,y,I.z0+z]};
// outside the front door of the ASR house: f metres out, s metres to the side
function c9Front(f,s){const a=B.find(b=>b.id==='asr');const[x,z]=fpos(a,a.face,a.da,f);const dx=x-a.ex,dz=z-a.ez,l=Math.hypot(dx,dz)||1;return c3Free(x+(-dz/l)*(s||0),z+(dx/l)*(s||0))}
function c9FrontFace(){const a=B.find(b=>b.id==='asr');const[x,z]=fpos(a,a.face,a.da,5);return Math.atan2(a.ex-x,a.ez-z)}

// ---------------------------------------------------------------- the basement
function c9BuildPit(){const{W,D}=C9PIT;let sd=91;const R_=()=>(sd=sd*16807%2147483647)/2147483647;
  const I=mkInt('c9pit',W,D,{at:C9PIT.at,up:1,hole:[0,0,W,D],name:'The Basement',wall:0x1e1a1e,low:0x0e0a0c,ceil:0x100c0e,
    walls:[[40,0,40,8],[40,10.5,40,18],[48,0,48,8],[48,10.5,48,18],[56,0,56,8],[56,10.5,56,18],[40,18,64,18],[4,36,64,36]]});
  const X=x=>I.x0+x,Z=z=>I.z0+z,add=m=>{m.userData.noMerge=1;sc.add(m);return m};
  const ft=ctex(512,512,(q,w,h)=>{q.fillStyle='#1c181a';q.fillRect(0,0,w,h);for(let i=0;i<1800;i++){q.fillStyle=`rgba(${30+R_()*40|0},${20+R_()*30|0},${24+R_()*30|0},${.2+R_()*.3})`;q.fillRect(R_()*w,R_()*h,2+R_()*5,2+R_()*5)}q.strokeStyle='rgba(0,0,0,.5)';q.lineWidth=3;for(let x=0;x<w;x+=128){q.beginPath();q.moveTo(x,0);q.lineTo(x,h);q.stroke();q.beginPath();q.moveTo(0,x);q.lineTo(w,x);q.stroke()}});
  ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(8,6);const fl=add(new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:ft,color:0x4a4448,roughness:.9})));fl.rotation.x=-PI/2;fl.position.set(X(W/2),.01,Z(D/2));fl.receiveShadow=true;
  // black drapes along the main-stage walls, red emergency lights
  const dr=mt(0x120c10,.95);for(let i=0;i<20;i++){const m=add(new THREE.Mesh(bgeo(1.9,5.4,.12),dr));m.position.set(X(1+i*2),2.7,Z(.2));m.rotation.y=(i%2?.06:-.06)}
  for(let i=0;i<17;i++){const m=add(new THREE.Mesh(bgeo(.12,5.4,1.9),dr));m.position.set(X(.2),2.7,Z(1+i*2));m.rotation.y=(i%2?.06:-.06)}
  for(const[x,z]of[[10,.4],[30,.4],[.4,18],[20,35.6],[44,.4],[52,.4],[60,.4],[10,43.6],[30,43.6],[50,43.6]]){const l=add(new THREE.Mesh(GC.c9rl||(GC.c9rl=new THREE.SphereGeometry(.1,8,6)),bm(0xff2a1a)));l.position.set(X(x),4.6,Z(z));C9.acts.push(l)}
  // the east wing doors (slabs moved by c9Doors) and their combination locks
  C9.doors=[];for(const x of[40,48,56]){const m=add(new THREE.Mesh(bgeo(.14,2.7,2.5),mt(0x3a3438,.5,.6)));m.position.set(X(x),1.35,Z(9.25));C9.doors.push(m)}c9Doors(0);
  // the corridor: hanging strips
  for(let i=0;i<40;i++){const m=add(new THREE.Mesh(new THREE.PlaneGeometry(.18,2.2+R_()*1.6),new THREE.MeshStandardMaterial({color:0x0a080a,roughness:1,side:THREE.DoubleSide})));m.position.set(X(4+i*1.5+R_()),4.2,Z(37+R_()*6));m.rotation.y=R_()*PI}
  ZN.c9pit=[I.x0+1,I.z0+1,I.x0+39,I.z0+35];return I}
function c9Doors(shut){const I=INT.c9pit;if(!I)return;C9.doors.forEach(m=>{m.position.z=I.z0+9.25+(shut?0:2.6)})}
// the dark: a vignette over everything while Danny is in the basement (red during a Nightmare)
function c9Dark(on,red){let e=$('c9dark');if(!on){if(e)e.remove();return}if(!e){e=document.createElement('div');e.id='c9dark';e.style.cssText='position:fixed;inset:0;z-index:27;pointer-events:none;transition:background .8s';document.body.appendChild(e)}
  e.style.background=`radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 22%,rgba(${red?'40,0,6':'0,0,0'},.78) 70%,rgba(0,0,0,.94) 100%)`}

// sets: one group per Nightmare, rebuilt when the night starts
function c9Grp(name,build){c9Del(name);const g=new THREE.Group();g.userData.noMerge=1;try{build(g)}catch(e){console.warn('c9Grp '+name,e)}g.traverse(o=>o.userData.noMerge=1);sc.add(g);C9.g[name]=g;return g}
function c9Del(name){const g=C9.g[name];if(g){g.parent&&g.parent.remove(g);delete C9.g[name]}}
const c9M=(g,geo,mat,x,y,z,ry)=>{const m=new THREE.Mesh(geo,typeof mat==='number'?mt(mat,.8):mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;m.castShadow=true;g.add(m);return m};
function c9DoorFrame(g,x,z,ry,label,o={}){const I=INT.c9pit,X=I.x0+x,Z=I.z0+z,w=o.w||1.4,h=o.h||2.5,f=new THREE.Group();f.position.set(X,0,Z);f.rotation.y=ry||0;g.add(f);
  const fm=mt(o.col||0x3a1418,.6);c9M(f,bgeo(.16,h,.2),fm,-w/2-.08,h/2,0);c9M(f,bgeo(.16,h,.2),fm,w/2+.08,h/2,0);c9M(f,bgeo(w+.32,.18,.22),fm,0,h+.09,0);
  const hinge=new THREE.Group();hinge.position.set(-w/2,0,0);f.add(hinge);c9M(hinge,bgeo(w,h-.04,.07),mt(o.door||0x1a1214,.7),w/2,h/2,0);c9M(hinge,GC.c9knob||(GC.c9knob=new THREE.SphereGeometry(.05,8,6)),mt(0xb8962a,.3,.8),w-.15,1.05,.06);
  if(label){const s=signMesh(label,Math.max(1.4,label.length*.12),.26,'#160a0c','#e2b64c');s.position.set(0,h+.42,.02);f.add(s)}
  const sp=new THREE.Mesh(new THREE.CircleGeometry(.9,20),new THREE.MeshBasicMaterial({color:0x5a0a10,transparent:true,opacity:.45,depthWrite:false}));sp.rotation.x=-PI/2;sp.position.set(0,.03,.9);f.add(sp);
  f.userData.hinge=hinge;return f}
function c9OpenDoor(f,on){if(!f||!f.userData.hinge)return;const h=f.userData.hinge,to=on?-1.7:0;let t=0;c5Anim(dt=>{t+=dt*2;h.rotation.y+=(to-h.rotation.y)*Math.min(1,dt*6);return t>2});try{noise(.4,.06,300)}catch(e){}}
function c9Board(g,x,y,z,ry,w,h){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const t=new THREE.CanvasTexture(c);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:.9}));const I=INT.c9pit;m.position.set(I.x0+x,y,I.z0+z);m.rotation.y=ry||0;g.add(m);return{c,t,m}}
function c9BoardDraw(b,title,lines,o={}){if(!b)return;const q=b.c.getContext('2d'),w=b.c.width,h=b.c.height;q.fillStyle=o.bg||'#1a1214';q.fillRect(0,0,w,h);q.strokeStyle='#5a1a20';q.lineWidth=10;q.strokeRect(8,8,w-16,h-16);q.fillStyle='#e2b64c';q.textAlign='center';q.font='bold 64px Georgia,serif';q.fillText(title,w/2,90);q.textAlign='left';q.font=(o.fs||40)+'px Georgia,serif';
  lines.forEach((l,i)=>{const L=typeof l==='string'?{t:l}:l;q.fillStyle=L.red?'#ff6a5a':L.dim?'rgba(230,220,200,.45)':'#e8e0cc';const y=160+i*(o.lh||62);q.fillText(L.t,60,y);if(L.x){q.strokeStyle='#ff4a3a';q.lineWidth=5;q.beginPath();q.moveTo(50,y-12);q.lineTo(70+q.measureText(L.t).width,y-12);q.stroke()}});b.t.needsUpdate=true}

// ---------------------------------------------------------------- people: the day cast, robed Nightmare figures, voices
const C9C={carter:['Carter Vaughn','ΑΣΡ Pledge Master'],logan:['Logan Pierce','ΑΣΡ Vice President'],ezra:['Ezra Cole','ΑΣΡ Associate'],marcus:['Marcus Bell','ΑΣΡ Associate']};
function c9Cast(k,x,z,a,o={}){const int=o.int!==undefined?o.int:'asr',XZ=int==='c9pit'?c9QX:c9AX;const[X,Z]=o.abs?[x,z]:XZ(x,z);let n;const tag=o.tag||'c9c';
  if(k==='grant'||k==='tank')n=c4Dup(k,X,Z,a,Object.assign({pup:1,tag,int},o.p||{}));
  else if(k==='ezra'||k==='marcus'){const d=C8A[k],i=k==='ezra'?1:2;n=c4Pup('brothers',X,Z,a,Object.assign({tag,int,name:d[0],title:'ΑΣΡ Associate',lvl:3,house:null,skin:d[1],hair:d[2],shirt:[0x5a3a2a,0x2a4a3a][i-1],sleeve:[0x5a3a2a,0x2a4a3a][i-1],pants:0x2a2a30},o.p||{}))}
  else n=c4Pup('brothers',X,Z,a,Object.assign({tag,int,name:C9C[k][0],title:C9C[k][1],lvl:7,house:'asr',hair:k==='carter'?0x2a1a10:0x8a6a3a,skin:k==='carter'?SKIN[1]:SKIN[0]},o.p||{}));
  if(n)n.c9k=k;return n}
const c9K=k=>Object.values(C4.cast).find(n=>c4Live(n)&&n.c9k===k);
function c9Need(k,x,z,a,o){return c9K(k)||c9Cast(k,x,z,a,o)}
// a robed Nightmare figure: robe, hood and a blank mask (founder, judge, shade); 'grant' is a Grant look-alike in a stretched white mask
function c9Fig(kind,x,z,a,name,o={}){const int=o.int||'c9pit';const[X,Z]=(int==='asr'?c9AX:c9QX)(x,z);let n;
  if(kind==='grant')n=c4Dup('grant',X,Z,a,{pup:1,tag:o.tag||'c9m',int,name:name||'Grant?',title:'',lvl:9});
  else n=c4Pup('brothers',X,Z,a,{tag:o.tag||'c9m',int,name:name||'A masked figure',title:o.title||'',lvl:9,house:null,noLetters:1,shirt:0x141014,sleeve:0x141014,pants:0x100c10});
  if(!n)return null;n.c9fig=kind;c9Robe(n,kind);if(o.mask)c8Mask(n,o.mask);return n}
function c9Robe(n,kind){const g=n&&n.g,h=g&&g.P&&g.P.head;if(!g||!h)return;const sp=GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8));const A=(par,geo,c,x,y,z,s,r)=>{const m=new THREE.Mesh(geo,typeof c==='number'?mt(c,.85):c);m.position.set(x,y,z);if(s)m.scale.set(...s);if(r)m.rotation.set(...r);m.userData.noMerge=1;par.add(m);return m};
  const robe={founder:0x1e1418,judge:0x0c0a0c,shade:0x26222a,grant:null}[kind];const face={founder:0xe8e2d4,judge:0xf4f0e8,shade:0xa8a49a,grant:0xf2f0ea}[kind];
  if(robe!=null){A(g,new THREE.CylinderGeometry(.3,.5,1.45,12,1,true),mt(robe,.95),0,.72,0);A(h,sp,robe,0,.08,-.03,[.28,.3,.29])}
  // the mask: a smooth plate, two dark eyes; the 'grant' one is stretched long
  const st=kind==='grant'?[.2,.34,.12]:[.19,.24,.1];A(h,sp,face,0,kind==='grant'?.02:.08,.15,st);for(const s of[-1,1])A(h,sp,0x050405,s*.07,.12,.25,[.035,kind==='grant'?.05:.022,.01]);if(kind==='grant')A(h,sp,0x050405,0,-.12,.25,[.06,.015,.01]);
  if(kind==='judge')A(h,new THREE.CylinderGeometry(.16,.2,.5,12),0x0c0a0c,0,.5,0);n.c9robe=1}
// show or hide a puppet's body (the rig's visibility is managed elsewhere, so toggle its parts)
function c9Vis(n,on){if(!n||!n.g)return;n.g.children.forEach(c=>{if(c!==n.bub)c.visible=!!on});n.hidden=on?0:1}
// a voice with no body (a speaker, a pipe in the wall), so the conversation box can sit on it
function c9Voice(name,title,x,z){const[X,Z]=c9QX(x,z);const n=c4Pup('brothers',X,Z,0,{tag:'c9v',int:'c9pit',name,title,lvl:1});if(n&&n.g)n.g.children.forEach(c=>{if(c!==n.bub)c.visible=false});return n}
// the bandana: a red band over the eyes (on anybody), and the blindfold view for Danny
function c9Bandana(g,on){const h=g&&g.P&&g.P.head;if(!h)return;if(g.userData.c9band){g.userData.c9band.parent&&g.userData.c9band.parent.remove(g.userData.c9band);g.userData.c9band=null}if(!on)return;
  const b=new THREE.Group(),m=mt(0xa8141e,.85);const r=new THREE.Mesh(new THREE.TorusGeometry(.235,.05,6,22),m);r.rotation.x=PI/2;r.scale.set(1,1.1,1);b.add(r);const k=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),m);k.scale.set(.06,.05,.05);k.position.set(0,0,-.25);b.add(k);
  for(const s of[-1,1]){const t=new THREE.Mesh(bgeo(.04,.16,.02),m);t.position.set(s*.04,-.08,-.27);t.rotation.z=s*.3;b.add(t)}b.position.y=.13;b.traverse(o=>o.userData.noMerge=1);h.add(b);g.userData.c9band=b}
function c9Blind(on){let e=$('c9blind');if(!on){if(e){e.style.opacity=0;setTimeout(()=>e&&e.remove(),700)}return}if(!e){e=document.createElement('div');e.id='c9blind';e.style.cssText='position:fixed;inset:0;z-index:33;pointer-events:none;opacity:0;transition:opacity .7s;background:radial-gradient(ellipse at 50% 50%,rgba(70,6,12,.9),rgba(16,2,4,.99) 70%),repeating-linear-gradient(35deg,rgba(255,255,255,.025) 0 3px,rgba(0,0,0,0) 3px 9px)';document.body.appendChild(e);void e.offsetWidth}e.style.opacity=1}

// ---------------------------------------------------------------- the candles
// state: c9S().wax = {danny, ezra, marcus} in percent; Danny's burns while Hell Week is being played, every new day costs a little,
// trials and Nightmares add wax back. Wax never moves between associates.
const C9BURN=1/40;   // % per second of play
function c9Wax(d,why,quiet){const W=c9S().wax;W.danny=clamp(W.danny+d,0,100);if(!quiet){toast((d>0?'+':'')+Math.round(d)+'% WAX'+(why?' · '+why:''),2600);if(d>0){try{sfx('ok')}catch(e){}c9Flare()}else{try{sfx('bad')}catch(e){}}}c9HudDraw(1)}
function c9WaxA(d){const W=c9S().wax;for(const k of['ezra','marcus'])W[k]=clamp(W[k]+d*(k==='ezra'?1:.92),8,100)}
function c9Flare(){const e=$('c9cand');if(e){e.style.boxShadow='0 0 28px 6px rgba(255,190,90,.75)';setTimeout(()=>{if(e)e.style.boxShadow=''},700)}}
// the HUD (top left, under the objective)
function c9HudOn(){const S9=c9S();return !!(S9.lit&&S.ch===9&&!S9.done)}
function c9HudDraw(force){const on=c9HudOn();let e=$('c9cand');if(!on){if(e)e.remove();return}
  if(!e){e=document.createElement('div');e.id='c9cand';e.style.cssText='position:fixed;left:14px;top:200px;z-index:29;width:252px;padding:9px 12px 10px;border-radius:10px;background:rgba(16,10,8,.82);border:1px solid rgba(226,182,76,.45);color:#f2e6cc;font:12px/1.35 system-ui,sans-serif;pointer-events:none;transition:box-shadow .4s';document.body.appendChild(e)}
  const W=c9S().wax,p=Math.max(0,Math.round(W.danny)),n=Math.round(p/5),bar='█'.repeat(n)+'░'.repeat(20-n),low=p<=20;
  const h=`<div style="display:flex;justify-content:space-between;font-weight:700;letter-spacing:.06em"><span>🕯 DANNY'S CANDLE</span><span style="color:${low?'#ff7a5a':'#ffd27a'}">${p}% REMAINING</span></div>`+
    `<div style="font:15px/1 monospace;color:${low?'#ff7a5a':'#ffcf6a'};margin:5px 0 3px;letter-spacing:-.5px">${bar}</div>`+
    `<div style="opacity:.85">${p>0?'Burning — Hell Week in progress':'Burned out'}${c9S().day?' · Day '+c9S().day+' of 7':''}</div>`+
    `<div style="opacity:.6;margin-top:2px">Ezra ${Math.round(W.ezra)}% · Marcus ${Math.round(W.marcus)}% · wax can't be shared</div>`;
  if(force||e.innerHTML!==h)e.innerHTML=h}
// the candle table in the foyer of the ASR house (west wall, beside the charter): three candles with name plates, heights follow the wax
function c9BuildCandles(){const I=INT.asr;if(!I)return;const g=new THREE.Group();g.userData.noMerge=1;const X=x=>I.x0+x,Z=z=>I.z0+z;
  const tb=new THREE.Mesh(bgeo(.62,.06,1.5),mt(0x4a2a1a,.6));tb.position.set(X(16.75),.86,Z(20.45));g.add(tb);for(const sx of[-.25,.25])for(const sz of[-.66,.66]){const l=new THREE.Mesh(bgeo(.06,.86,.06),mt(0x3a2014,.6));l.position.set(X(16.75+sx),.43,Z(20.45+sz));g.add(l)}
  const cl=new THREE.Mesh(bgeo(.64,.02,1.52),mt(0x7d1f2c,.9));cl.position.set(X(16.75),.9,Z(20.45));g.add(cl);C9.cand={g,c:[]};
  ['danny','ezra','marcus'].forEach((k,i)=>{const x=X(16.75),z=Z(20.95-i*.5);const hd=new THREE.Mesh(new THREE.CylinderGeometry(.11,.13,.05,14),mt(0xb8962a,.3,.8));hd.position.set(x,.93,z);g.add(hd);
    const w=new THREE.Mesh(new THREE.CylinderGeometry(.05,.055,1,12),mt(0xf2ead8,.6));w.position.set(x,.95,z);g.add(w);
    const f=new THREE.Mesh(GC.c9fl||(GC.c9fl=new THREE.ConeGeometry(.03,.09,8)),new THREE.MeshBasicMaterial({color:0xffb040}));g.add(f);const fg=new THREE.Mesh(GC.c9fg||(GC.c9fg=new THREE.SphereGeometry(.07,8,6)),new THREE.MeshBasicMaterial({color:0xff9a30,transparent:true,opacity:.35,depthWrite:false}));g.add(fg);
    const s=signMesh(k.toUpperCase(),.36,.09,'#2a1a10','#e2b64c');s.position.set(x+.36,.98,z);s.rotation.y=PI/2;g.add(s);C9.cand.c.push({k,w,f,fg,x,z})});
  g.traverse(o=>o.userData.noMerge=1);sc.add(g);g.visible=false}
function c9CandUpd(){if(!C9.cand&&INT.asr&&c9HudOn())c9BuildCandles();const C=C9.cand;if(!C)return;const on=c9HudOn()&&P.inside==='asr';C.g.visible=on;if(!on)return;const W=c9S().wax;
  C.c.forEach((c,i)=>{const h=.06+.4*Math.max(0,W[c.k])/100;c.w.scale.y=h;c.w.position.y=.955+h/2;const lit=W[c.k]>0&&!(C9.unlit&&C9.unlit.includes(i)),fl=1+Math.sin(TT*13+c.x*7)*.12+Math.sin(TT*31+c.z)*.06;c.f.visible=c.fg.visible=lit;c.f.position.set(c.x,.955+h+.05,c.z);c.f.scale.set(1,fl,1);c.fg.position.copy(c.f.position);c.fg.scale.setScalar(fl)})}
// a candle in Danny's hand (the vigil)
function c9HandCandle(on){if(C9.hc){C9.hc.g.parent&&C9.hc.g.parent.remove(C9.hc.g);C9.hc=null}if(!on)return;const h=PM.P&&PM.P.hR;if(!h)return;const g=new THREE.Group();
  const hd=new THREE.Mesh(new THREE.CylinderGeometry(.08,.09,.03,12),mt(0xb8962a,.3,.8));hd.position.y=-.12;g.add(hd);const w=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,.26,10),mt(0xf2ead8,.6));w.position.y=.02;g.add(w);
  const f=new THREE.Mesh(GC.c9fl||(GC.c9fl=new THREE.ConeGeometry(.03,.09,8)),new THREE.MeshBasicMaterial({color:0xffb040}));f.position.y=.2;g.add(f);const fg=new THREE.Mesh(GC.c9fg||(GC.c9fg=new THREE.SphereGeometry(.07,8,6)),new THREE.MeshBasicMaterial({color:0xff9a30,transparent:true,opacity:.35,depthWrite:false}));fg.position.y=.2;g.add(fg);
  g.position.set(0,-.55,.08);g.traverse(o=>o.userData.noMerge=1);h.add(g);C9.hc={g,f,fg,lit:1}}
function c9HandLit(on){const c=C9.hc;if(!c)return;c.lit=on;c.f.visible=c.fg.visible=!!on;if(!on)try{c6Poof(P.x,1.4,P.z,0x888888)}catch(e){}}

// ---------------------------------------------------------------- burning out: the mission fails and Hell Week starts over
function c9Burnout(){if(C9.burnt)return;C9.burnt=1;if(AM){AM.temps.forEach(despawn);AM=null;setGoal(null);updObj()}try{if(CINE)c4CamOff()}catch(e){}
  c9CleanAll(1);for(const id of C9IDS)delete S.done[id];const d=c5S().d;for(const k in d)if(/^q9/.test(k))delete d[k];S.c9=c9Fresh();sfx('bad');
  card({title:'MISSION FAILED',sp:'Hell Week',alert:1,text:'YOUR CANDLE HAS BURNED OUT.\n\nHell Week starts over from Day 1.',ch:[['Restart Hell Week',()=>{C9.burnt=0;if(P.inside!=='asr')goIn('asr',24,25);c4Next('c9d1')}]]})}

// ---------------------------------------------------------------- minigame steps (each one finishes itself when C4.auto)
// Day 3: run the flag course out front against the clock
function c9LapStep(secs){const pts=[[8,-9],[17,-4],[17,7],[8,10],[4,0]];return{t:'cond',lab:()=>{const L=C9.lap;return'Run the evaluation course'+(L?` · flag ${Math.min(L.i+1,pts.length)}/${pts.length} · ${Math.max(0,Math.ceil(secs-L.t))}s`:'')},ok:()=>!!(C9.lap&&C9.lap.done),
  goal:()=>{const L=C9.lap;return L&&!L.done?L.p[L.i]:null},
  start:()=>{const p=pts.map(([f,s])=>c9Front(f,s));C9.lap={i:0,t:0,p,done:0,go:0};c9Grp('c9cones',g=>{p.forEach(([x,z],i)=>{const y=terrH(x,z);c9M(g,new THREE.CylinderGeometry(.03,.03,1.4,6),0xdddddd,x,y+.7,z);const fl=c9M(g,bgeo(.02,.3,.45),mt(i===p.length-1?0x2a8a3a:0x7d1f2c,.7),x,y+1.25,z+.24);fl.name='f'+i})});toast('Hit every flag before the clock runs out.',2600)},
  tick:dt=>{const L=C9.lap;if(!L||L.done)return;if(C4.auto){L.done=1;return}L.t+=dt;const[x,z]=L.p[L.i];if(Math.hypot(P.x-x,P.z-z)<1.6){L.i++;try{sfx('ok')}catch(e){}if(L.i>=L.p.length){L.done=1;c1Hud(null);big('COURSE COMPLETE · '+L.t.toFixed(1)+'s',1600);return}}
    c1Hud(`EVALUATION COURSE · FLAG ${L.i+1}/${L.p.length} · ${Math.max(0,Math.ceil(secs-L.t))}s`);if(L.t>=secs){L.t=0;L.i=0;c9Wax(-3,'Too slow. Again.');toast('Out of time. Back to the first flag.',2400)}},done:()=>{c1Hud(null);c9Del('c9cones')}}}
// Day 3: push-ups, one press each
function c9PushStep(n){return{t:'cond',push:1,lab:()=>`Do ${n} push-ups (${Math.min(n,C9.push||0)}/${n})`,ok:()=>(C9.push||0)>=n,start:()=>{C9.push=0},tick:()=>{if(C4.auto)C9.push=n},done:()=>{C9.push=0}}}
function c9DoPush(){C9.push=(C9.push||0)+1;const t0=TT;PM.userData.c9push=1;c5Anim(()=>{const k=TT-t0;PM.rotation.x=k<.35?-Math.sin(k/.35*PI)*.25:0;return k>.4});try{tone(160+C9.push*8,.06,'sine',.04)}catch(e){}if(C9.push%5===0)toast(C9.push+'…',900)}
// Day 4: the vigil. Stand on the mark holding your candle; shield it when the wind comes; wander off or miss a gust and it goes out
function c9VigilStep(secs){return{t:'cond',vigil:1,lab:()=>{const V=C9.vig;return'Hold the vigil'+(V?` · ${Math.max(0,Math.ceil(secs-V.t))}s`+(V.gust>0?' · SHIELD THE FLAME':''):'')},ok:()=>!!(C9.vig&&C9.vig.done),goal:()=>{const V=C9.vig;return V?[V.x,V.z]:null},
  start:()=>{const[x,z]=c9Front(2.6,0);C9.vig={x,z,t:0,gust:0,next:5,done:0,out:0};c9HandCandle(1);c9Grp('c9mark',g=>{const m=c9M(g,new THREE.RingGeometry(.8,.95,24),new THREE.MeshBasicMaterial({color:0xe2b64c,transparent:true,opacity:.7,side:THREE.DoubleSide}),x,terrH(x,z)+.05,z);m.rotation.x=-PI/2});toast('Stand on the mark. Keep the flame alive.',2600)},
  tick:dt=>{const V=C9.vig;if(!V||V.done)return;if(C4.auto){V.done=1;return}const onMark=Math.hypot(P.x-V.x,P.z-V.z)<1;
    if(V.out>0){V.out-=dt;if(V.out<=0){c9HandLit(1);toast('Relit. From the top.',1600)}c1Hud('THE VIGIL · THE FLAME WENT OUT');return}
    if(!onMark){c1Hud('THE VIGIL · GET BACK ON THE MARK');V.off=(V.off||0)+dt;if(V.off>2.5){V.off=0;c9VigOut('You wandered off the mark.')}return}V.off=0;
    V.t+=dt;V.next-=dt;if(V.gust>0){V.gust-=dt;if(C9.hc)C9.hc.f.scale.set(1+Math.sin(TT*40)*.4,.6+Math.random()*.8,1);if(V.gust<=0)c9VigOut('A gust took the flame.')}
    else if(V.next<=0){V.gust=2.4;V.next=5+rnd()*3.5;try{noise(.8,.08,500)}catch(e){}toast('Wind!',900)}
    c1Hud(`THE VIGIL · ${Math.max(0,Math.ceil(secs-V.t))}s`+(V.gust>0?' · SHIELD THE FLAME':''));if(V.t>=secs){V.done=1;c1Hud(null)}},done:()=>{c1Hud(null);c9Del('c9mark');c9HandCandle(0)}}}
function c9VigOut(why){const V=C9.vig;if(!V)return;V.gust=0;V.t=0;V.out=1.4;V.next=5;c9HandLit(0);c9Wax(-3,why)}
function c9Shield(){const V=C9.vig;if(!V||V.gust<=0)return;V.gust=0;if(C9.hc)C9.hc.f.scale.set(1,1,1);try{sfx('ok')}catch(e){}PM.userData.c9sh=TT}

// ---------------------------------------------------------------- hooks
function c9Prompts(add){if(!c9On())return;const st=curStep();
  if(st&&st.c5items){const d=c5S().d;for(const it of st.c5items){if(d[it.k]||it.busy||(it.need&&!it.need()))continue;const p=c5At(it.at());if(!p||(p.int||null)!==(P.inside||null))continue;add(p.x,p.z,it.r||2.2,it.act,()=>c5Do(it),0)}}
  if(st&&st.push)add(P.x,P.z,5,'Do a push-up',()=>c9DoPush(),0);
  if(st&&st.vigil&&C9.vig&&C9.vig.gust>0)add(P.x,P.z,5,'Shield the flame',()=>c9Shield(),0)}
function c9CleanAll(keepHud){for(const t of['c9c','c9m','c9v','c9x','c9g'])c4Off(t);for(const k in C9.g)c9Del(k);c9Dark(0);c9Blind(0);c9Bandana(PM,0);c9HandCandle(0);c9Doors(0);C9.lap=C9.vig=null;C9.push=0;c1Hud(null);
  try{c6GrantHide(0)}catch(e){}if(P.inside==='c9pit')goIn('asr',24,25);if(!keepHud)c9HudDraw()}
function c9Tick(dt){if(mode==='title'||mode==='loading')return;const S9=S.c9;
  if(S9&&S9.lit&&c9On()&&mode==='play'&&!CINE&&!C4.auto&&!P.dead){S9.wax.danny-=dt*C9BURN;c9WaxA(-dt*C9BURN*.9);if(S9.wax.danny<=0){S9.wax.danny=0;c9HudDraw(1);c9Burnout();return}}
  if((C9.hudT-=dt)<0){C9.hudT=.25;c9HudDraw()}c9CandUpd();
  if(P.inside==='c9pit'){c9Dark(1,c9On());for(const l of C9.acts)l.visible=Math.sin(TT*2.2+l.position.x)>-.7}else if($('c9dark'))c9Dark(0);
  if((C9.T-=dt)>0)return;C9.T=1.2;
  if(!CINE&&mode==='play'&&!c9On()&&TT-C4.chainT>8&&(P.inside==='c9pit'||Object.keys(C9.g).length||C4.mine.some(n=>/^c9/.test(n.c4tag||''))))c9CleanAll()}
function c9Migrate(d){if(!d)return;if(S.ch>=10)for(const id of C9IDS)S.done[id]=1;setTimeout(()=>{try{if(!c9On())c9CleanAll();c9HudDraw()}catch(e){console.warn('c9Migrate',e)}},14)}
