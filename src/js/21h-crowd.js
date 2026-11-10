// ================================================================ V154 CAMPUS CROWD STREAMING
// 4x the ambient campus population for (about) the same memory. Every extra person is a tiny data record (class, zone, position, name);
// the expensive part, the character rig (skeleton, skinned meshes, material, outline, name tag), is a FIXED POOL: the original ambient NPCs.
// A pooled rig is lent to whichever virtual people are nearest the player (only inside CROWD.R metres, which is also the render distance for
// campus people) and handed back when they fall out of range. Rigs are only re-bound where the camera can't see it happen (far away, or behind you).
// Memory therefore stays at one rig per original ambient NPC; the 3x extra people cost a few hundred bytes each.
// Lent rigs keep their own look, so a virtual person only borrows a rig of the same class and gender.
const CROWD={on:0,V:[],slots:[],R:56,cap:240,t:0,swaps:12,EXTRA:7,fr:null,pm:null,pv:null};
function crowdBusy(n){return !!(n.aggro||n.chase||n.follow||n.ally||n.down||n.stun>0||n.flee>0||n.grab||n.temp||n.actor||n.job||n.rose||n.leaveT>0||n.named||n.statue||(n.hidden&&!n.pk)||(typeof SCENE!=='undefined'&&SCENE&&SCENE.n===n)||(P.lastHit===n&&TT-P.lastHitT<30))}
function crowdKey(o){return o.cl+(o.fem?'F':'M')}
function crowdName(fem){return(fem?pick(FN):pick(MN))+' '+String.fromCharCode(65+Math.floor(rnd()*26))+'.'}
// build the virtual population out of the ambient NPCs that spawnAll tagged (n.amb)
function crowdInit(){
  const slots=NP.filter(n=>n.amb&&!n.int);if(!slots.length)return;
  CROWD.slots=slots;CROWD.V=[];
  for(const n of slots){const v={cl:n.cl,zone:n.zone,fem:n.fem,mode:n.mode,x:n.x,z:n.z,a:n.a,lvl:n.lvl,name:n.name,slot:n,d:0,chat:n.ambPair!=null?1:0};n.vp=v;CROWD.V.push(v)}
  const lv=cl=>{const L=CL[cl].lv;return clamp(Math.round(L[0]+Math.floor(rnd()*(L[1]-L[0]+1))),1,12)};
  const pairs={};for(const n of slots)if(n.ambPair!=null)(pairs[n.ambPair]||(pairs[n.ambPair]=[])).push(n);
  for(let e=0;e<CROWD.EXTRA;e++){
    for(const n of slots){if(n.ambPair!=null)continue;const[x,z]=spotIn(ZN[n.zone]);
      CROWD.V.push({cl:n.cl,zone:n.zone,fem:n.fem,mode:n.mode==='chat'?'wander':n.mode,x,z,a:rnd()*TAU,lvl:lv(n.cl),name:crowdName(n.fem),slot:null,d:0,chat:0,extra:1})}
    for(const k in pairs){const pr=pairs[k];if(pr.length<2)continue;const[cx,cz]=spotIn(ZN[pr[0].zone]),ang=rnd()*TAU;
      pr.forEach((n,i)=>{const a=ang+i*PI,x=cx+Math.cos(a)*.9,z=cz+Math.sin(a)*.9;
        CROWD.V.push({cl:n.cl,zone:n.zone,fem:n.fem,mode:'chat',x:freeAt(x,z,.4)?x:cx,z:freeAt(x,z,.4)?z:cz,a:Math.atan2(cx-x,cz-z),lvl:lv(n.cl),name:crowdName(n.fem),slot:null,d:0,chat:1,extra:1})})}}
  CROWD.cap=Math.min(CROWD.cap,slots.length);CROWD.t=0;CROWD.on=1}
function crowdInView(x,z){const C=CROWD;if(!C.fr){C.fr=new THREE.Frustum();C.pm=new THREE.Matrix4();C.pv=new THREE.Vector3()}return C.fr.containsPoint(C.pv.set(x,terrH(x,z)+1,z))}
function crowdBind(n,v){const x=v.x,z=v.z,y=terrH(x,z);
  n.x=n.hx=n.tx=x;n.z=n.hz=n.tz=z;n.a=n.ha=v.a;n.mode=v.mode;n.name=v.name;n.lvl=v.lvl;n.mhp=20+v.lvl*12;n.hp=n.mhp;
  n.path=null;n.job=null;n.aggro=0;n.tgt=null;n.chase=0;n.flee=0;n.stun=0;n.sus=0;n.wait=rnd()*3;n.bubT=0;if(n.bub)n.bub.visible=false;n.tagHp=-1;
  n.pk=0;n.hidden=0;n.vp=v;v.slot=n;n.mute=0;/* V179 everyone on campus can be talked to and fought */ambReset(n);n.g.AX=null;n.g.position.set(x,y,z);n.g.rotation.y=v.a}
function crowdRelease(n){ambReset(n);const v=n.vp;if(v){v.x=n.x;v.z=n.z;v.a=n.a;v.slot=null}n.vp=null;n.pk=1;n.hidden=1;n.g.visible=false;n.dp=999;n.path=null;if(n.bub)n.bub.visible=false}
function crowdTick(dt){const C=CROWD;if(!C.on||P.inside||CINE||mode!=='play')return;if((C.t-=dt)>0)return;C.t=.4;
  const live=new Set(NP);if(C.slots.some(n=>!live.has(n))){C.slots=C.slots.filter(n=>live.has(n));for(const v of C.V)if(v.slot&&!live.has(v.slot))v.slot=null}
  // parked rigs stay parked even if some story code un-hid them
  for(const n of C.slots)if(n.pk&&!n.hidden)n.hidden=1;
  if(!C.fr){C.fr=new THREE.Frustum();C.pm=new THREE.Matrix4();C.pv=new THREE.Vector3()}
  C.pm.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);C.fr.setFromProjectionMatrix(C.pm);
  const R=C.R,cand=[];
  for(const v of C.V){const s=v.slot,x=s?s.x:v.x,z=s?s.z:v.z,d=Math.hypot(x-P.x,z-P.z);v.d=d;if(d<R||s)cand.push(v)}
  cand.sort((a,b)=>a.d-b.d);
  // wanted = nearest people inside R, limited by the pool (per class+gender) and by the overall cap
  const cnt={},cap={},want=new Set();for(const n of C.slots)cap[crowdKey(n)]=(cap[crowdKey(n)]||0)+1;
  let tot=0;for(const v of cand){if(v.d>=R||tot>=C.cap)break;const k=crowdKey(v);if((cnt[k]||0)>=cap[k])continue;cnt[k]=(cnt[k]||0)+1;tot++;want.add(v)}
  let sw=C.swaps;
  // 1) hand back rigs of people who are no longer wanted (only when nobody can watch it happen)
  for(let i=cand.length-1;i>=0&&sw>0;i--){const v=cand[i],n=v.slot;if(!n||want.has(v)||crowdBusy(n))continue;if(v.d>R+4||(v.d>14&&!crowdInView(n.x,n.z))){crowdRelease(n);sw--}}
  // 2) lend free rigs to wanted people who have none yet
  const free={};for(const n of C.slots)if(!n.vp&&!crowdBusy(n)&&n.pk)(free[crowdKey(n)]||(free[crowdKey(n)]=[])).push(n);
  for(const v of cand){if(sw<=0)break;if(v.slot||!want.has(v))continue;const f=free[crowdKey(v)];if(!f||!f.length)continue;if(v.d<6)continue;if(v.d<34&&crowdInView(v.x,v.z))continue;crowdBind(f.pop(),v);sw--}}
// V156 the extra crowd people are background only (no name tag, no talk, can't be hit, never hostile) but solid: Danny can't walk through them
function crowdSolid(){if(!CROWD.on||P.inside||mode!=='play')return;const r=.62;for(const n of CROWD.slots){if(n.hidden||n.down||n.aggro||n.chase||!n.g.visible)continue;const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz);if(d>=r||d<1e-4)continue;const k=(r-d)/d,nx=P.x+dx*k,nz=P.z+dz*k;if(mvOK(nx,nz,.34)){P.x=nx;P.z=nz}else{n.x-=dx*k;n.z-=dz*k}}}
function crowdStats(){const C=CROWD;let bound=0,vis=0;for(const n of C.slots){if(n.vp)bound++;if(n.g&&n.g.visible)vis++}return{people:C.V.length,rigs:C.slots.length,bound,visible:vis}}
