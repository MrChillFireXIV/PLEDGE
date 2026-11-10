// ================================================================ V163 CHAPTER 10 · RITUAL (replaces the old Lantern Walk finale)
// The Lantern Walk at last: after Hell Week the brothers, in black robes and featureless masks, walk the white-cloaked pledges by lantern
// to the Lodge in the woods. Before the oath the pledges drink ayahuasca, and the clearing beside the Lodge becomes Danny's vision.
// Three phases, two quests each; progress is measured by the truths Danny is willing to face.
//  PHASE I · THE SELF          c10boy     The Boy Before            c10choice  The Choice to Belong
//  PHASE II · THE BROTHERHOOD  c10chairs  The Empty Chairs          c10room    The Room Remembers
//  PHASE III · THE OATH        c10values  The Seven Values          c10confess The Confession
// This file: the clearing, robes and masks, the trip (screen + world effects), vision sets, ghosts, steps, hooks. Part 2 (21y): scenes, quests.
const C10={T:0,tk:0,trip:0,g:{},motes:[],rib:[],win:[],lan:null,open:0,stay:null,wh:null,stones:[],hz:null,amb:0};
const C10IDS=['c10boy','c10choice','c10chairs','c10room','c10values','c10confess'];
const c10S=()=>S.c10||(S.c10={mv:{},lit:{}});
const c10On=()=>!!(AM&&C10IDS.includes(AM.m.id));

// ---------------------------------------------------------------- the old Lantern Walk quest is replaced; the Lantern Walk becomes the opening
{const i=M.findIndex(m=>m.id==='final');if(i>=0)M.splice(i,1)}
CHN[10]='Ritual';
CHT[10]='One brotherhood. One bond. One name.\n\nThe Lantern Walk, at last. The brothers walk the pledges to the Lodge in the woods for the final initiation.';

// ---------------------------------------------------------------- the clearing south of the Lodge (trees in it are moved out to its edge at world build)
const C10C={x:127,z:1061,r:9.5};
const c10X=(dx,dz)=>[C10C.x+dx,C10C.z+dz];
const c10P=(dx,dz)=>({int:null,x:C10C.x+dx,z:C10C.z+dz});
const c10W=(dx,y,dz)=>{const x=C10C.x+dx,z=C10C.z+dz;return[x,terrH(x,z)+y,z]};
{const _fd=fdBuild;fdBuild=function(){try{c10Clearing()}catch(e){console.warn('c10Clearing',e)}return _fd.apply(this,arguments)}}
function c10Clearing(){const{x:cx,z:cz,r}=C10C;for(const t of TREES){const d=Math.hypot(t[0]-cx,t[1]-cz);if(d>=r)continue;
  const k=Math.floor(t[0]/4)*65536+Math.floor(t[1]/4),a=CCOL.get(k);if(a){const j=a.findIndex(c=>c[0]===t[0]&&c[1]===t[1]);if(j>=0)a.splice(j,1)}cells(t[0]-.9,t[1]-.9,t[0]+.9,t[1]+.9,q=>{HG[q]=0});
  const ang=Math.atan2(t[1]-cz,t[0]-cx);let ok=0;for(let s=0;s<30&&!ok;s++){const aa=ang+(s%2?1:-1)*Math.ceil(s/2)*.22,rr=r+2.4+(s%3)*.8,X=cx+Math.cos(aa)*rr,Z=cz+Math.sin(aa)*rr;if(Z>1051&&freeAt(X,Z,1.7)&&!onRoad(X,Z)){t[0]=X;t[1]=Z;ok=1}}
  if(!ok){t[0]=cx+Math.cos(ang)*(r+3);t[1]=cz+Math.sin(ang)*(r+3)}markC(t[0],t[1],.5,9)}}

// ---------------------------------------------------------------- robes, cloaks, featureless masks, letters
const C10SP=()=>GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8));
function c10Robe(g,kind,mask){const h=g&&g.P&&g.P.head;if(!g||!h)return;c10Unrobe(g);const col=kind==='white'?0xf2efe6:0x0e0c10,ms=[];const A=(par,geo,c,x,y,z,s)=>{const m=new THREE.Mesh(geo,typeof c==='number'?mt(c,.9):c);m.position.set(x,y,z);if(s)m.scale.set(...s);m.userData.noMerge=1;par.add(m);ms.push(m);return m};
  A(g,new THREE.CylinderGeometry(.3,.52,1.45,14,1,true),col,0,.72,0);A(g,new THREE.CylinderGeometry(.22,.31,.12,12),col,0,1.42,0);
  if(kind==='white'){const hd=A(h,C10SP(),col,0,-.02,-.2,[.27,.2,.14])}else A(h,C10SP(),col,0,.08,-.03,[.28,.3,.29]);
  g.userData.c10robe=ms;if(mask)c10Mask(g,1)}
function c10Unrobe(g){if(!g||!g.userData.c10robe)return;for(const m of g.userData.c10robe)m.parent&&m.parent.remove(m);g.userData.c10robe=null;c10Mask(g,0,1)}
// a featureless mask: a smooth white oval, nothing else
function c10Mask(g,on,quiet){const h=g&&g.P&&g.P.head;if(!h)return;if(g.userData.c10mask){g.userData.c10mask.parent&&g.userData.c10mask.parent.remove(g.userData.c10mask);g.userData.c10mask=null;if(!quiet&&!on){try{const p=new THREE.Vector3();h.getWorldPosition(p);c6Poof(p.x,p.y,p.z,0xeeeae0)}catch(e){}}}
  if(!on)return;const m=new THREE.Mesh(C10SP(),new THREE.MeshStandardMaterial({color:0xf4f2ec,roughness:.25,metalness:.05}));m.scale.set(.2,.25,.11);m.position.set(0,.08,.16);m.userData.noMerge=1;h.add(m);g.userData.c10mask=m}
function c10Letters(g,on){if(!g)return;if(g.userData.c10let){g.userData.c10let.parent&&g.userData.c10let.parent.remove(g.userData.c10let);g.userData.c10let=null}if(!on)return;const s=signMesh('ΑΣΡ',.36,.15,'#7d1f2c','#e2b64c');s.position.set(0,1.22,.33);s.userData.noMerge=1;g.add(s);g.userData.c10let=s}
// a lantern in someone's hand (Danny's has a real light)
function c10HandLan(g,on,light){const h=g&&g.P&&(g.P.hR||g.P.aR);if(!h)return;if(g.userData.c10lan){g.userData.c10lan.parent&&g.userData.c10lan.parent.remove(g.userData.c10lan);g.userData.c10lan=null}if(!on)return;
  const L=new THREE.Group();const fr=new THREE.Mesh(bgeo(.2,.28,.2),mt(0x2a2420,.5,.6));L.add(fr);const gl=new THREE.Mesh(bgeo(.16,.22,.16),bm(0xffcf70));L.add(gl);const hd=new THREE.Mesh(new THREE.TorusGeometry(.07,.012,5,10),mt(0x2a2420,.5,.6));hd.position.y=.2;L.add(hd);
  if(light){const lt=new THREE.PointLight(0xffb860,1.4,11,1.7);L.add(lt)}L.position.set(0,-.62,0);if(g.P.hR)L.position.y=-.08;L.traverse(o=>o.userData.noMerge=1);h.add(L);g.userData.c10lan=L}

// ---------------------------------------------------------------- people
const c10K=k=>Object.values(C4.cast).find(n=>c4Live(n)&&n.c10k===k);
function c10Cast(k,dx,dz,a,o={}){const[x,z]=c10X(dx,dz);const n=c9Cast(k,x,z,a,{abs:1,int:null,tag:o.tag||'c10c'});if(!n)return null;n.c10k=k;n.c9k=null;
  if(k==='ezra'||k==='marcus')c10Robe(n.g,'white');else c10Robe(n.g,'black',o.mask!==false);if(o.lan)c10HandLan(n.g,1);return n}
function c10Need(k,dx,dz,a,o){return c10K(k)||c10Cast(k,dx,dz,a,o)}
const C10RING=11;
function c10Ring(){if(C4.mine.some(n=>n.c4tag==='c10b'&&c4Live(n)))return;for(let i=0;i<10;i++){const a=PI*.32+i*(PI*1.36)/9,dx=Math.sin(a)*C10RING,dz=-Math.cos(a)*C10RING,[x,z]=c10X(dx,dz);
  const n=c4Pup('brothers',x,z,Math.atan2(-dx,-dz),{tag:'c10b',int:null,name:'A robed brother',title:'ΑΣΡ',lvl:6,house:'asr'});if(n){c10Robe(n.g,'black',1);c10HandLan(n.g,i%2===0);n.c10ring=i}}}
const c10RingN=i=>C4.mine.find(n=>c4Live(n)&&n.c10ring===i);
// a memory: a figure with a faint glowing shell around it (the Kowalskis, Andre, the brothers of 1971)
function c10Ghost(kind,dx,dz,a,name,title,o={}){const[x,z]=o.abs?[dx,dz]:c10X(dx,dz);let n;const base={tag:o.tag||'c10g',int:null,name:name||'A memory',title:title||'a memory',lvl:1};
  if(kind==='grant'||kind==='andre'||kind==='tank')n=c4Dup(kind,x,z,a,Object.assign({pup:1},base,{prop:0,pin:kind==='andre'?1:0}));
  else{const L={kid:{shirt:0x3a6ab8,pants:0x2a3a5a,hair:0x6a4a2a,s:.6},teen:{shirt:0x6a6a6a,pants:0x2a3040,hair:0x6a4a2a,s:.9},danny:{shirt:0x7d1f2c,pants:0x2a2a34,hair:0x6a4a2a,s:1},
    ed:{shirt:0x9a2f24,pants:0x2e4466,skin:0xe8b08a,hair:0x5a4030,s:1.13},luke:{shirt:0x3a4a6a,pants:0x2a2a30,skin:SKIN[0],hair:0x6a4a2a,s:1},carter:{shirt:0x1a1a1c,pants:0x141416,skin:SKIN[1],hair:0x2a1a10,s:1},brother:{shirt:0x7d1f2c,pants:0x30302e,s:1}}[kind]||{s:1};
    n=c4Pup(kind==='ed'?'staff':'brothers',x,z,a,Object.assign(base,{house:null,noLetters:1,shirt:L.shirt,sleeve:L.shirt,pants:L.pants,hair:L.hair,skin:L.skin}));if(n&&n.g)n.g.scale.setScalar(L.s)}
  if(!n)return null;n.c10g=o.key||kind;const col=o.col||0xb89aff;const sh=new THREE.Mesh(GC.c10sh||(GC.c10sh=new THREE.CylinderGeometry(.42,.42,1.95,16,1,true)),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.2,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));sh.position.y=.97;sh.userData.noMerge=1;n.g.add(sh);
  const rg=new THREE.Mesh(GC.c10rg||(GC.c10rg=new THREE.RingGeometry(.4,.62,24)),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));rg.rotation.x=-PI/2;rg.position.y=.04;rg.userData.noMerge=1;n.g.add(rg);n.c10aura=[sh,rg];try{c6Poof(x,1,z,col)}catch(e){}return n}
const c10G=k=>C4.mine.find(n=>c4Live(n)&&n.c10g===k);
function c10Fade(n){if(!c4Live(n))return;try{c6Poof(n.x,1.1,n.z,0xb89aff)}catch(e){}despawn(n);const i=C4.mine.indexOf(n);if(i>=0)C4.mine.splice(i,1);for(const k in C4.cast)if(C4.cast[k]===n)delete C4.cast[k];C4.pups=C4.pups.filter(q=>q!==n)}
// a voice with no body (an echo from the tree line)
function c10Voice(name,title,dx,dz){const[x,z]=c10X(dx,dz);const n=c4Pup('brothers',x,z,0,{tag:'c10v',int:null,name,title,lvl:1});if(n&&n.g)n.g.children.forEach(c=>{if(c!==n.bub)c.visible=false});return n}

// ---------------------------------------------------------------- the trip: the screen (colour drift, a turning pattern, a vignette) and the clearing (motes, a ground mandala, light ribbons)
function c10TripSet(k){C10.trip=k}
function c10Css(){if($('c10css'))return;const s=document.createElement('style');s.id='c10css';s.textContent='@keyframes c10spin{from{transform:translate(-50%,-50%) rotate(0deg) scale(1)}50%{transform:translate(-50%,-50%) rotate(180deg) scale(1.15)}to{transform:translate(-50%,-50%) rotate(360deg) scale(1)}}@keyframes c10breathe{0%,100%{opacity:.55}50%{opacity:1}}';document.head.appendChild(s)}
function c10Overlay(k){let e=$('c10ov');if(k<=.01){if(e)e.remove();const cv=document.querySelector('canvas');if(cv&&cv.style.filter&&cv.style.filter.includes('hue-rotate')&&!C8.drunk)cv.style.filter='';return}
  if(!e){c10Css();e=document.createElement('div');e.id='c10ov';e.style.cssText='position:fixed;inset:0;z-index:26;pointer-events:none;overflow:hidden';
    e.innerHTML='<div style="position:absolute;left:50%;top:50%;width:170vmax;height:170vmax;animation:c10spin 46s linear infinite;mix-blend-mode:screen;background:repeating-conic-gradient(from 0deg,rgba(255,60,200,.16) 0deg 6deg,rgba(60,220,255,.0) 6deg 15deg,rgba(255,210,80,.12) 15deg 21deg,rgba(0,0,0,0) 21deg 30deg)"></div>'+
      '<div style="position:absolute;inset:0;animation:c10breathe 6s ease-in-out infinite;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 30%,rgba(60,0,90,.55) 78%,rgba(10,0,20,.85) 100%)"></div>';document.body.appendChild(e)}
  e.style.opacity=Math.min(1,k*1.1).toFixed(3);const cv=document.querySelector('canvas');if(cv&&!C8.drunk){const h=(Math.sin(TT*.21)*55+Math.sin(TT*.07)*40)*k;cv.style.filter=`hue-rotate(${h.toFixed(1)}deg) saturate(${(1+k*.9).toFixed(2)}) contrast(${(1+k*.12).toFixed(2)})`}}
function c10WorldFx(on){if(!on){c10Del('fx');C10.motes=[];C10.rib=[];return}if(C10.g.fx)return;const{x:cx,z:cz}=C10C,y0=terrH(cx,cz);
  c10Grp('fx',g=>{const cols=[0xff4ad8,0x5ae8ff,0xffd25a,0x9a6aff,0x6aff9a];C10.motes=[];for(let i=0;i<46;i++){const geo=i%3?(GC.c10oct||(GC.c10oct=new THREE.OctahedronGeometry(.12))):(GC.c10tor||(GC.c10tor=new THREE.TorusGeometry(.14,.025,6,16)));
      const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:cols[i%5],transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}));g.add(m);C10.motes.push({m,a:rnd()*TAU,r:2+rnd()*10,y:.6+rnd()*4.5,s:.15+rnd()*.35,ph:rnd()*9})}
    const tex=ctex(1024,1024,(q,w,h)=>{q.translate(w/2,h/2);for(let ring=0;ring<7;ring++){const R=60+ring*62;q.strokeStyle=`hsla(${ring*48},90%,65%,${.5-ring*.04})`;q.lineWidth=5;q.beginPath();q.arc(0,0,R,0,TAU);q.stroke();const n=6+ring*3;for(let i=0;i<n;i++){q.save();q.rotate(i/n*TAU+ring*.3);q.beginPath();q.moveTo(R,0);q.quadraticCurveTo(R+30,22,R+62,0);q.quadraticCurveTo(R+30,-22,R,0);q.stroke();q.restore()}}});
    const md=new THREE.Mesh(new THREE.CircleGeometry(9.2,48),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending}));md.rotation.x=-PI/2;md.position.set(cx,y0+.06,cz);g.add(md);C10.mand=md;
    C10.rib=[];for(let i=0;i<30;i++){const a=i/30*TAU,r=12.4+(i%3)*.6;const m=new THREE.Mesh(new THREE.PlaneGeometry(.5,7+(i%4)),new THREE.MeshBasicMaterial({color:cols[i%5],transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));m.position.set(cx+Math.cos(a)*r,y0+3.6,cz+Math.sin(a)*r);m.rotation.y=-a;g.add(m);C10.rib.push({m,a,ph:i})}})}
function c10FxUpd(dt){const k=C10.tk;if(C10.mand){C10.mand.rotation.z+=dt*.06;C10.mand.material.opacity=.42*k}const{x:cx,z:cz}=C10C,y0=terrH(cx,cz);
  for(const p of C10.motes){p.a+=dt*p.s*.4;p.m.position.set(cx+Math.cos(p.a)*p.r,y0+p.y+Math.sin(TT*p.s*2+p.ph)*.5,cz+Math.sin(p.a)*p.r);p.m.rotation.x+=dt;p.m.rotation.y+=dt*1.3;p.m.material.opacity=.85*k;p.m.visible=k>.03}
  for(const r of C10.rib){r.m.material.opacity=(.08+.08*Math.sin(TT*.8+r.ph))*k;r.m.scale.x=1+Math.sin(TT*.5+r.ph)*.5}}
// the Lodge windows: scenes from Danny's past glow in the glass
function c10Wins(on){if(!on){c10Del('wins');C10.win=[];return}if(C10.g.wins)return;c10Grp('wins',g=>{C10.win=[];for(const x of[103.6,108.4,126.4,131.2]){const c=document.createElement('canvas');c.width=256;c.height=384;const t=new THREE.CanvasTexture(c);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.85),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));m.position.set(x,terrH(x,1046.3)+2.35,1046.3);g.add(m);C10.win.push({m,c,t,on:0})}})}
function c10WinShow(i,cap,figs){const W=C10.win[i];if(!W)return;const q=W.c.getContext('2d'),w=256,h=384;const gr=q.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ffd08a');gr.addColorStop(1,'#a85a2a');q.fillStyle=gr;q.fillRect(0,0,w,h);
  q.fillStyle='rgba(30,12,20,.92)';for(const[x,s]of figs||[]){const H=210*s,y=h-40;q.beginPath();q.arc(x,y-H,22*s,0,TAU);q.fill();q.fillRect(x-26*s,y-H+20*s,52*s,H-20*s)}q.fillStyle='rgba(40,14,10,.85)';q.font='bold 22px Georgia';q.textAlign='center';q.fillText(cap||'',w/2,34);W.t.needsUpdate=true;W.on=1}
function c10WinOff(i){const W=C10.win[i];if(W)W.on=0}

// ---------------------------------------------------------------- vision sets (one group each)
function c10Grp(name,build){c10Del(name);const g=new THREE.Group();g.userData.noMerge=1;try{build(g)}catch(e){console.warn('c10Grp '+name,e)}g.traverse(o=>o.userData.noMerge=1);sc.add(g);C10.g[name]=g;return g}
function c10Del(name){const g=C10.g[name];if(g){g.parent&&g.parent.remove(g);delete C10.g[name]}}
const c10M=(g,geo,mat,x,y,z,ry)=>{const m=new THREE.Mesh(geo,typeof mat==='number'?mt(mat,.8):mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;m.castShadow=true;g.add(m);return m};
const c10Glow=c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
function c10Ring2(g,x,z,col,r){const y=terrH(x,z);const m=c10M(g,new THREE.RingGeometry((r||.7)*.7,r||.7,28),c10Glow(col||0xb89aff),x,y+.05,z);m.rotation.x=-PI/2;return m}
// the base: the central table, the cup, lanterns on posts around the clearing edge and the Lodge porch
function c10Base(){if(C10.g.base)return;c10Grp('base',g=>{const{x:cx,z:cz}=C10C,y=terrH(cx,cz);c10M(g,bgeo(2.6,.1,1.2),0x5a3a22,cx,y+.85,cz);for(const sx of[-1.15,1.15])for(const sz of[-.48,.48])c10M(g,bgeo(.12,.85,.12),0x3a2416,cx+sx,y+.42,cz+sz);
    for(let i=0;i<3;i++){const sl=c10M(g,new THREE.RingGeometry(.2,.26,20),c10Glow(0xffd27a),cx-.8+i*.8,y+.91,cz);sl.rotation.x=-PI/2;sl.name='slot'+i}
    C10.cup=c10M(g,new THREE.CylinderGeometry(.16,.11,.2,14),mt(0x6a3a1a,.6),cx+.9,y+1,cz-.3);C10.jug=c10M(g,new THREE.CylinderGeometry(.14,.2,.42,12),mt(0x8a5a3a,.8),cx-1,y+1.11,cz-.32);
    for(let i=0;i<12;i++){const a=i/12*TAU+.13,r=10.2,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(z<1050.5)continue;const yy=terrH(x,z);c10M(g,new THREE.CylinderGeometry(.04,.05,1.6,6),0x2a2420,x,yy+.8,z);c10M(g,bgeo(.24,.3,.24),bm(0xffcf70),x,yy+1.75,z)}
    for(const x of[112,122.2]){const z=1049.2,yy=terrH(x,z);c10M(g,new THREE.CylinderGeometry(.04,.05,1.8,6),0x2a2420,x,yy+.9,z);c10M(g,bgeo(.26,.32,.26),bm(0xffcf70),x,yy+1.95,z)}})}

// ---------------------------------------------------------------- special steps
// stay inside a circle while a memory plays out (narration); leave and it starts over
function c10StayStep(label,pf,r,lines,each){each=each||4;return{t:'cond',lab:()=>{const T=C10.stay;return label+(T&&T.t>0?` · ${Math.max(0,Math.ceil(lines.length*each-T.t))}s`:'')},ok:()=>!!(C10.stay&&C10.stay.done),goal:()=>{const p=pf();return[p.x,p.z]},
  start:()=>{C10.stay={t:0,i:-1,done:0}},
  tick:dt=>{const T=C10.stay;if(!T||T.done)return;if(C4.auto){T.done=1;return}const p=pf(),d=Math.hypot(P.x-p.x,P.z-p.z);
    if(d>r){if(T.t>0){T.t=0;T.i=-1;c1Sub(null);toast('You stepped away. The memory starts over.',2200)}c1Hud('STAND IN THE MEMORY');return}
    T.t+=dt;const i=Math.min(lines.length-1,Math.floor(T.t/each));if(i!==T.i){T.i=i;c1Sub('',lines[i])}c1Hud(`STAY WITH IT · ${Math.max(0,Math.ceil(lines.length*each-T.t))}s`);if(T.t>=lines.length*each){T.done=1;c1Sub(null);c1Hud(null)}},done:()=>{c1Sub(null);c1Hud(null);C10.stay=null}}}
// follow the whistle: louder as Danny gets closer to Andre's chair
function c10WhistleStep(){return{t:'cond',whistle:1,lab:()=>'Find Andre\'s chair by following the whistle'+(C10.wh?' · '+C10.wh.lab:''),ok:()=>!!(C10.wh&&C10.wh.done),goal:()=>null,
  start:()=>{C10.wh={t:0,done:0,lab:'listen'}},
  tick:dt=>{const W=C10.wh;if(!W||W.done)return;if(C4.auto){W.done=1;return}const[x,z]=c10ChairXZ(C10ANDRE),d=Math.hypot(P.x-x,P.z-z);W.t-=dt;
    const v=Math.max(.004,.1*(1-d/15));W.lab=d<1.9?'right here':d<4?'close':d<8?'closer':'faint';if(W.t<=0){W.t=d<4?.9:1.7;try{tone(2350,.12,'sine',v);tone(2350,.12,'sine',v*.8,.18)}catch(e){}}c1Hud('THE WHISTLE · '+W.lab.toUpperCase())},done:()=>{c1Hud(null)}}}
// the five chairs (Andre's is the fourth)
const C10ANDRE=3;
function c10ChairXZ(i){const a=-PI/2+.63+i*TAU/5;return c10X(Math.cos(a)*5.2,Math.sin(a)*5.2)}

// ---------------------------------------------------------------- hooks
function c10Prompts(add){if(!c10On())return;const st=curStep();
  if(st&&st.c5items){const d=c5S().d;for(const it of st.c5items){if(d[it.k]||it.busy||(it.need&&!it.need()))continue;const p=c5At(it.at());if(!p||(p.int||null)!==(P.inside||null))continue;add(p.x,p.z,it.r||2.2,it.act,()=>c5Do(it),0)}}
  if(st&&st.whistle&&C10.wh&&!C10.wh.done){const[x,z]=c10ChairXZ(C10ANDRE);add(x,z,1.9,'This one. Andre\'s chair.',()=>{C10.wh.done=1;try{sfx('ok')}catch(e){}},0)}}
function c10CleanAll(){for(const t of['c10c','c10b','c10g','c10v','c10x','c10e'])c4Off(t);for(const k in C10.g)c10Del(k);C10.motes=[];C10.rib=[];C10.win=[];C10.stones=[];C10.trip=0;C10.tk=0;c10Overlay(0);
  c10Unrobe(PM);c10Letters(PM,0);c10HandLan(PM,0);C10.stay=C10.wh=null;C10.open=0;c1Hud(null)}
function c10Tick(dt){if(mode==='title'||mode==='loading')return;const live=c10On()||C10.open;
  // Danny's lantern burns all night
  if(live&&!PM.userData.c10lan)c10HandLan(PM,1,1);else if(!live&&PM.userData.c10lan&&!CINE)c10HandLan(PM,0);
  C10.tk+=(C10.trip-C10.tk)*Math.min(1,dt*.7);if(C10.tk>.01||$('c10ov'))c10Overlay(C10.tk);if(C10.motes.length)c10FxUpd(dt);
  for(const W of C10.win){const o=W.on?.55+Math.sin(TT*3+W.m.position.x)*.15:0;W.m.material.opacity+=(o-W.m.material.opacity)*Math.min(1,dt*2)}
  for(const s of C10.stones){if(s.glow)s.glow.material.opacity=s.lit?.45+Math.sin(TT*2+s.i)*.15:0}
  if(live&&C10.tk>.2&&(C10.amb-=dt)<0){C10.amb=3+rnd()*4;try{tone(70+rnd()*40,2.4,'sine',.018*C10.tk);tone(220+rnd()*120,1.8,'sine',.008*C10.tk,.6)}catch(e){}}
  if((C10.T-=dt)>0)return;C10.T=1.2;
  if(!CINE&&mode==='play'&&!live&&TT-C4.chainT>8&&(Object.keys(C10.g).length||C10.tk>.02||PM.userData.c10robe||C4.mine.some(n=>/^c10/.test(n.c4tag||''))))c10CleanAll()}
function c10Migrate(d){if(!d)return;if(S.done.final)for(const id of C10IDS)S.done[id]=1;setTimeout(()=>{try{if(!c10On())c10CleanAll()}catch(e){console.warn('c10Migrate',e)}},16)}
