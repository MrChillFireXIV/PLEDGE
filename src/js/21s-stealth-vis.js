// ================================================================ V159 STEALTH READABILITY (every stealth step: st.stealth + st.watch)
// For each watcher: a sight cone on the floor (green → yellow → red with their suspicion, pulsing while they can see you; matches canSee:
// range 10.5 m, 6.5 m crouched, ±72.5°, anyone within 2.2 m always sees you), and an eye over their head that fills up and turns into ? and !.
// The screen edges glow red and a heartbeat plays as the highest suspicion climbs. Driven from the stealth block in stepTick (file 16).
const STV={last:-9,cones:new Map(),edge:null,hbT:0};
const SVCOL=new THREE.Color();
function svCol(s){return s<.5?SVCOL.setRGB(.3+s*1.3,.85,.3):SVCOL.setRGB(.95,Math.max(.15,.85-(s-.5)*1.5),.2)}
function svEyeTex(k){const key='sveye'+k;return GC[key]||(GC[key]=ctex(128,128,(q,w,h)=>{q.clearRect(0,0,w,h);const s=k/10,col=s>=1?'#ff3a3a':s>.5?'#ffb43a':'#ffe27a';
  q.fillStyle='rgba(16,12,20,.8)';q.beginPath();q.arc(64,64,46,0,TAU);q.fill();q.lineWidth=11;q.strokeStyle='rgba(255,255,255,.18)';q.beginPath();q.arc(64,64,50,0,TAU);q.stroke();
  q.strokeStyle=col;q.beginPath();q.arc(64,64,50,-PI/2,-PI/2+TAU*Math.min(1,s));q.stroke();
  if(s>.25){q.fillStyle=col;q.font='bold 62px Archivo,Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(s>=1?'!':'?',64,68)}
  else{q.strokeStyle='#ffffff';q.lineWidth=5;q.beginPath();q.ellipse(64,64,26,14,0,0,TAU);q.stroke();q.fillStyle='#ffffff';q.beginPath();q.arc(64,64,8,0,TAU);q.fill()}}))}
function svFor(n){let v=STV.cones.get(n);if(v)return v;const half=Math.acos(.3),g=new THREE.Group();g.userData.noMerge=1;
  const mat=()=>new THREE.MeshBasicMaterial({color:0x4ad04a,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide,fog:false,toneMapped:false});
  const cone=new THREE.Mesh(GC.svCone||(GC.svCone=new THREE.CircleGeometry(1,32,-half,half*2).rotateX(-PI/2)),mat());
  const rim=new THREE.Mesh(GC.svRim||(GC.svRim=new THREE.RingGeometry(.97,1,48,1,-half,half*2).rotateX(-PI/2)),mat());
  const near=new THREE.Mesh(GC.svNear||(GC.svNear=new THREE.RingGeometry(2.1,2.2,40).rotateX(-PI/2)),mat());
  for(const m of[cone,rim,near]){m.renderOrder=3;m.userData.noMerge=1;g.add(m)}sc.add(g);
  const eye=new THREE.Sprite(new THREE.SpriteMaterial({map:svEyeTex(0),transparent:true,depthTest:false,depthWrite:false,fog:false}));eye.scale.set(.6,.6,1);eye.renderOrder=22;eye.userData.noMerge=1;sc.add(eye);
  v={g,cone,rim,near,eye,k:-1};STV.cones.set(n,v);return v}
function stealthVis(st,mx){STV.last=TT;const seen=new Set(),crouch=K.KeyC||toggles.KeyC,base=10.5,mul=(typeof prSeeMul==='function'?prSeeMul():1)*(crouch?CROUCHSEE:1),R=base*mul,play=mode==='play';
  if(st)for(const n of NP){if(n.down||n.blind||n.hidden||n.temp&&!n.stepTemp||!n.g||!n.g.visible)continue;const w=st.trs?st.trs.has(n):st.pqg?n.pqg:st.watch.includes(n.cl)||(n.auth&&st.watch.includes('auth'));if(!w||n.dp>26||(n.int||null)!==(P.inside||null))continue;
    const v=svFor(n);seen.add(n);const y=(n.g.position.y||0)+.06,s=Math.min(1,n.sus||0),sees=canSee(n,base);
    v.g.position.set(n.x,y,n.z);v.g.rotation.y=n.a-PI/2;v.cone.scale.set(R,1,R);v.rim.scale.set(R,1,R);v.g.visible=play;
    const c=svCol(s);for(const m of[v.cone,v.rim,v.near])m.material.color.copy(c);v.cone.material.opacity=sees?.26+.08*Math.sin(TT*14):.13;v.rim.material.opacity=sees?1:.6;v.near.material.opacity=sees?.75:.4;
    const k=Math.round(s*10);if(k!==v.k){v.k=k;v.eye.material.map=svEyeTex(k);v.eye.material.needsUpdate=true}v.eye.position.set(n.x,y+2.8,n.z);v.eye.visible=play&&(s>.02||n.dp<14)}
  for(const[n,v]of STV.cones)if(!seen.has(n)){v.g.visible=false;v.eye.visible=false;if(!NP.includes(n)){sc.remove(v.g);sc.remove(v.eye);v.eye.material.dispose();for(const m of[v.cone,v.rim,v.near])m.material.dispose();STV.cones.delete(n)}}
  let e=STV.edge;if(!e){e=document.createElement('div');e.style.cssText='position:fixed;inset:0;z-index:29;pointer-events:none;transition:opacity .15s;box-shadow:inset 0 0 160px 40px rgba(215,30,30,.95);opacity:0';document.body.appendChild(e);STV.edge=e}
  const glow=st&&play?Math.min(.9,Math.max(0,(mx-.12)*1.15)):0;e.style.opacity=glow;
  if(glow>.3&&TT-STV.hbT>(mx>.8?.42:.7)){STV.hbT=TT;try{tone(62,.11,'sine',.13);tone(52,.12,'sine',.1,.14)}catch(x){}}}
// called every frame (c7Tick): hide everything once no stealth step is driving it
function stealthVisIdle(){if(TT-STV.last<.25)return;if(STV.edge&&STV.edge.style.opacity!=='0')STV.edge.style.opacity=0;for(const v of STV.cones.values()){if(v.g.visible)v.g.visible=false;if(v.eye.visible)v.eye.visible=false}}

// ================================================================ V464 TRESPASSING: inside another fraternity or sorority's house, every brother (or sister) there has a sight cone.
// Danny doesn't belong there: if one of them sees him long enough, he is stopped and asked what he's doing, and he either leaves or fights that guy.
// Crouching shrinks the cones (canSee). Not while a story step has business in that house (its target is inside), unless the step says trs:1 (planting).
const TRSP={fight:null,cool:0,h:null};
function trsHouse(){const id=P.inside;if(!id)return null;const b=id.replace(/_(up|bsmt|top)$/,'');if(b==='asr'||typeof HOUSE==='undefined'||!HOUSE[b])return null;return b}
function trsInHere(x,z){const I=INT[P.inside];return!!(I&&x!=null&&x>=I.x0&&x<=I.x1&&z>=I.z0&&z<=I.z1)}
function trsActive(){if(mode!=='play'||EV||CINE)return null;const h=trsHouse();if(!h)return null;const st=curStep();if(st&&(st.stealth||st.pqg))return null;
  if(st&&!st.trs){let t=null;try{t=st.goal?st.goal():(st.x!=null?[st.x,st.z]:null)}catch(e){}if(t&&trsInHere(t[0],t[1]))return null}
  if(S.party&&S.party===h)return null;return h}
function trsWatchers(){const L=new Set();for(const n of NP){if(n.down>0||n.hidden||n.temp||n.ally||n.follow||n.kid||n.auth||n.statue||n.prop||!n.g||!n.g.visible)continue;if((n.int||null)!==(P.inside||null)||n.dp>18)continue;L.add(n)}return L}
function trsTick(dt){const h=trsActive();if(h!==TRSP.h){if(TRSP.h)for(const n of NP)if(n.trsW){n.sus=0;n.trsW=0}TRSP.h=h;TRSP.fight=null}
  if(!h||TRSP.fight===h){return}if(TRSP.cool>0){TRSP.cool-=dt;return}
  const W=trsWatchers();let mx=0,who=null;for(const n of W){n.trsW=1;const sees=canSee(n,10.5);n.sus=clamp((n.sus||0)+(sees?dt*1.5:-dt*.5),0,1.2);if(n.sus>.3&&sees&&(!n.bub||!n.bub.visible))bubble(n,'?',1);if(n.sus>mx){mx=n.sus;who=n}}
  try{stealthVis({trs:W,watch:[]},mx)}catch(e){}
  if(who&&mx>=1)trsCaught(who,h)}
function trsCaught(n,h){for(const m of NP)if(m.trsW)m.sus=0;TRSP.cool=2;bubble(n,'!',1.6);sfx('whistle');P.vx=P.vz=0;const L=HOUSE[h].L,nm=n.name||'Brother';
  card({title:'Trespassing',sp:nm+' · '+L,focus:n,text:'"Whoa. Whoa. Who let you in? This is the '+L+' house, man. You don\'t live here."',ch:[
    ['"My bad. Wrong house. I\'m going."',()=>{bubble(n,'Yeah. Out.',1.6);const b=B.find(b=>b.id===h);fadeTo(()=>{const[x,z]=b&&b.ex!=null?nearFree(b.ex,b.ez,.5):[P.x,P.z];goOut(x,z);toast('Shown the door.',1600)})}],
    ['"Make me."',()=>{TRSP.fight=h;n.aggro=1;n.tgt='P';n.job=null;bubble(n,'Gladly.',1.4);for(const m of NP)if(m!==n&&m.trsW&&!m.down&&Math.hypot(m.x-n.x,m.z-n.z)<7){m.aggro=1;m.tgt='P';m.job=null}}]]})}
