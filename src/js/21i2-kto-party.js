// ================================================================ V278 KTHO PARTY (before the Cocaine Empire raid)
/* From the moment Grant sends Danny after KTHO until the cops shut the house down, Kappa Theta Omega looks like it is throwing a party:
   coloured lights cycle behind every window and spill over both lawns, the inside has a dancing crowd and a disco ball, two brothers guard the
   front door, and nobody else is standing on the front lawn or in the back yard (house members are hidden, strangers are walked off).
   Everything is merged meshes with shared materials (6 pane colours + 6 spill colours), no real lights, so it costs about a dozen draw calls. */
const C3KP={on:0,chk:0,wins:null,g:null,pm:[],sm:[],guards:[],hid:[],crowd:null,disco:null,ej:0};
/* front lawn (x0,z0,x1,z1) and back yard */
const C3KL=[[46.5,15.5,63,48.5],[-2,15.5,22.5,48.5]];
const c3kIn=(x,z)=>{for(const r of C3KL)if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3])return true;return false};
const c3kHold=(x,z)=>!!(C3KP.on||(typeof C3KR!=='undefined'&&C3KR.on))&&c3kIn(x,z);
const c3kWant=()=>{if(!S||S.ch!==3||!S.done)return false;const sh=S.c3&&S.c3.shut;if((sh&&sh.kto)||S.done.c3empire)return false;const id=AM&&AM.m&&AM.m.id;return !!(S.done.c3accuse||id==='c3accuse'||id==='c3empire')};
/* nearest spot just outside both lawn rectangles */
function c3kOut(x,z){let best=null,bd=1e9;for(const r of C3KL){if(!(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3]))continue;
  for(const[X,Z]of[[r[0]-1.3,z],[r[2]+1.3,z],[x,r[1]-1.3],[x,r[3]+1.3]]){if(c3kIn(X,Z)||X<1||Z<1)continue;const d=Math.hypot(X-x,Z-z);if(d>=bd)continue;const[fx,fz]=nearFree(X,Z,.4);if(!c3kIn(fx,fz)){bd=d;best=[fx,fz]}}}
  return best||[x,z]}
/* window rectangles of the KTHO facade, found the same way the 3D window frames are laid over the painted windows (fdBuild) */
function c3kWins(){const b=B.find(q=>q.id==='kto');if(!b||!FD.rec.stone)return[];
  const E=fdEdges([[b.x0,b.z0],[b.x1,b.z0],[b.x1,b.z1],[b.x0,b.z1]],'stone',0),bands=fdBands('stone'),h=b.h,out=[];
  for(const e of E){if(e.L<1.3)continue;
    for(const bd of bands){const bx0=bd.x0/32,bx1=bd.x1/32,zt=(1-bd.y/512)*16,zb=(1-(bd.y+bd.h)/512)*16,tall=zt-zb>3.3,wide=bx1-bx0>3.3;
      for(let j=Math.floor(-zt/16)-1;j<=Math.ceil((h-zb)/16)+1;j++){let z0=16*j+zb,z1=16*j+zt;if(tall){z0=Math.max(z0,.15);z1=Math.min(z1,h-.2)}if(z1-z0<.5||z0<.1||z1>h-.15)continue;
        for(let k=Math.floor((e.u0-bx1)/16);k<=Math.ceil((e.u0+e.L-bx0)/16);k++){let U0=16*k+bx0,U1=16*k+bx1;const lo=e.u0+.18,hi=e.u0+e.L-.18;if(wide){U0=Math.max(U0,lo);U1=Math.min(U1,hi);if(U1-U0<.7)continue}else if(U0<lo||U1>hi)continue;
          const tc=(U0+U1)/2-e.u0,cx=e.a[0]+e.dx*tc,cz=e.a[1]+e.dz*tc;
          if(z0<4.6&&FD.doors.some(d=>Math.hypot(d[0]-cx,d[1]-cz)<(U1-U0)/2+2.2))continue;
          out.push({e,cx,cz,W:U1-U0,H:z1-z0,y:(z0+z1)/2,low:z0<4.6})}}}}
  return out}
function c3kBuild(){if(C3KP.g)return;const W=c3kWins();if(!W.length)return;C3KP.wins=W;const b=B.find(q=>q.id==='kto'),NC=6;
  const g=new THREE.Group();g.userData.noMerge=1;
  const tex=GC.c3kgl||(GC.c3kgl=cvTex(128,128,(q,w,h)=>{const gr=q.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(.45,'rgba(255,255,255,.4)');gr.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=gr;q.fillRect(0,0,w,h)}));
  const PA=[],PI_=[],SP=[],SI=[],SU=[];for(let k=0;k<NC;k++){PA.push([]);PI_.push([]);SP.push([]);SI.push([]);SU.push([])}
  const quad=(A,I,x,y,z,rx,rz,hw,hh,vert,U)=>{const n=A.length/3;
    if(vert){A.push(x-rx*hw,y-hh,z-rz*hw,x+rx*hw,y-hh,z+rz*hw,x+rx*hw,y+hh,z+rz*hw,x-rx*hw,y+hh,z-rz*hw)}
    else{A.push(x-hw,y,z-hw,x+hw,y,z-hw,x+hw,y,z+hw,x-hw,y,z+hw)}
    I.push(n,n+1,n+2,n,n+2,n+3);if(U)U.push(0,0,1,0,1,1,0,1)};
  W.forEach((w,i)=>{const k=(i*5+Math.floor(w.y))%NC,e=w.e;
    quad(PA[k],PI_[k],w.cx+e.nx*.055,w.y,w.cz+e.nz*.055,e.dx,e.dz,w.W/2,w.H/2,1);
    if(w.low&&Math.abs(e.nx)>.5){const sx=w.cx+e.nx*3.2,sz=w.cz+e.nz*3.2,k2=(k+2)%NC;quad(SP[k2],SI[k2],sx,terrH(sx,sz)+.09,sz,0,0,3.4,0,0,SU[k2])}});
  /* the front door and porch glow */
  {const dx=b.ex+1.4,dz=32;for(let q=0;q<2;q++){const k=q*3;quad(SP[k],SI[k],dx+q*.6,terrH(dx,dz)+.1,dz,0,0,6.2-q*1.8,0,0,SU[k])}}
  for(let k=0;k<NC;k++){
    if(PA[k].length){const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(PA[k],3));ge.setIndex(PI_[k]);
      const m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
      const me=new THREE.Mesh(ge,m);me.renderOrder=4;me.frustumCulled=false;me.userData.noMerge=1;g.add(me);C3KP.pm.push(m)}
    if(SP[k].length){const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(SP[k],3));ge.setAttribute('uv',new THREE.Float32BufferAttribute(SU[k],2));ge.setIndex(SI[k]);
      const m=new THREE.MeshBasicMaterial({color:0xffffff,map:tex,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
      const me=new THREE.Mesh(ge,m);me.renderOrder=3;me.frustumCulled=false;me.userData.noMerge=1;g.add(me);C3KP.sm.push(m)}}
  sc.add(g);C3KP.g=g}
/* the inside: a crowd in navy blazers, a disco ball and coloured floor lights (meshes, not real lights: adding lights would recompile every shader) */
function c3kInt(on){const I=INT.kto;if(!I)return;
  if(on){if(!C3KP.crowd){const sp=[];let t=0;while(sp.length<34&&t++<3000){const x=I.x0+1+rnd()*46,z=I.z0+17+rnd()*18;if(!freeAt(x,z,.42)||sp.some(([a,b])=>Math.hypot(a-x,b-z)<.9))continue;sp.push([x,z])}
      C3KP.crowd=c1Crowd(sp,{k:'c3kparty',SH:[0x1f2c52,0x1f2c52,0xf2f2ee,0x2c3646,0xdc8aa6,0x7a2230,0x3a6a3a],PA:[0x2a2a30,0x34486e,0x1a1a22,0xc8b89a],HA:[0x151515,0x4a3020,0xc8a24a,0x6a3a1a],fem:.4});I.g.add(C3KP.crowd.g);
      const ball=c3M(new THREE.SphereGeometry(.45,16,12),mt(0xe8e8f0,.12,.95),I.x0+24,4.9,I.z0+26,I.g),d=[ball];
      for(const[x,z,c]of[[8,26,0xff3ad8],[24,30,0x3ad8ff],[40,26,0xffd83a],[16,21,0x7aff6a],[32,21,0xff6a3a]])d.push(c3M(new THREE.SphereGeometry(.16,10,8),new THREE.MeshBasicMaterial({color:c}),I.x0+x,5.6,I.z0+z,I.g));
      for(const[x,z]of[[10,26],[24,28],[38,26]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(5,5),new THREE.MeshBasicMaterial({color:0xff3aa0,map:GC.c3kgl,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));m.rotation.x=-PI/2;m.position.set(I.x0+x,.08,I.z0+z);m.renderOrder=3;m.userData.noMerge=1;I.g.add(m);d.push(m);m.userData.fl=1}
      C3KP.disco=d}
    C3KP.crowd.g.visible=true;for(const m of C3KP.disco)m.visible=true}
  else{if(C3KP.crowd)C3KP.crowd.g.visible=false;if(C3KP.disco)for(const m of C3KP.disco)m.visible=false}}
/* two KTHO brothers stand guard at the front door */
function c3kGuards(){if(C3KP.guards.length===2&&C3KP.guards.every(n=>NP.includes(n)))return;
  for(const n of C3KP.guards)if(NP.includes(n))despawn(n);C3KP.guards=[];
  for(const[nm,z]of[['Hartley Ames',29.3],['Beau Whitcomb',34.7]]){const[x,zz]=nearFree(48.9,z,.4);
    const n=spawn('legacies','greek',{x,z:zz,a:PI/2,mode:'idle',temp:1,house:'kto',name:nm,title:'KTHO Brother',lvl:8,greet:'"Private party. Brothers and invited guests only. You are neither."'});
    if(!n)continue;n.c3guard=1;n.ha=PI/2;n.hx=x;n.hz=zz;C3KP.guards.push(n)}}
function c3kGuardTick(n,dt){if(n.c3rk)return c3kRaidTick(n,dt);const near=n.dp<7&&!P.inside;const tg=near?Math.atan2(P.x-n.x,P.z-n.z):PI/2;n.a+=((((tg-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*(near?4:3));
  if(Math.hypot(n.x-n.hx,n.z-n.hz)>.4)moveTo(n,n.hx,n.hz,1.6,dt);
  if(near&&n.dp<6&&TT>(n.c3gT||0)){n.c3gT=TT+9;bubble(n,pick(['Private party, pledge.','Not on the list.','Keep walking.','Invite only. Read the sign.']),2.4)}
  return''}
/* arms folded */
function c3kGuardPose(n){const p=n.g.P;if(!p||!p.aL||!p.aR)return;const R=(o,x,y,z)=>{if(o)o.rotation.set(x,y,z)};
  if(n.c3rk==='cuff'){R(p.aL,.55,0,.12);R(p.aR,.55,0,-.12);R(p.eL,.25,0,0);R(p.eR,.25,0,0);if(p.head)p.head.rotation.x=.3;return}
  if(n.c3rk==='carry'){if(n.box&&n.box.visible){R(p.aL,-1.1,0,.1);R(p.aR,-1.1,0,-.1);R(p.eL,-.5,0,0);R(p.eR,-.5,0,0)}return}R(p.aL,-.65,0,.5);R(p.eL,-2.2,0,0);R(p.aR,-.65,0,-.5);R(p.eR,-2.2,0,0);if(p.head)p.head.rotation.y=Math.sin(n.t*.5+n.uid)*.35}
/* KTHO members: titles read 'KTHO ...' or, for the gargoyle, in Greek letters */
const c3kMember=n=>typeof n.title==='string'&&(n.title.indexOf('KTHO')===0||n.title.indexOf('\u039A\u0398\u03A9')===0||n.hid==='kto');
/* nobody else on the lawns */
function c3kClear(){const sc_=typeof SCENE!=='undefined'?SCENE:null;
  for(const n of NP){if(n.hidden||n.int||n.c3guard||n.follow||n.ally||n.actor||n.temp||n.grab||n.aggro||n.chase||(n.statue&&!n.gargoyle)||n.job||n.down>0||n.leaveT>0||(sc_&&sc_.n===n))continue;
    if(!c3kIn(n.x,n.z))continue;
    if(c3kMember(n)){n.hidden=1;n.c3pk=1;n.g.visible=false;if(n.bub)n.bub.visible=false;C3KP.hid.push(n);continue}
    const[x,z]=c3kOut(n.x,n.z);n.x=x;n.z=z;n.path=null;n.wait=1+rnd()*2;if(n.hx!=null&&c3kIn(n.hx,n.hz)){n.hx=x;n.hz=z}n.g.position.set(x,terrH(x,z),z)}}
function c3kOn(){c3kBuild();if(C3KP.g)C3KP.g.visible=true;c3kInt(1);C3KP.on=1;try{c3kGuards()}catch(e){console.warn('c3kGuards',e)}c3kClear()}
function c3kOff(){C3KP.on=0;if(C3KP.g)C3KP.g.visible=false;c3kInt(0);for(const n of C3KP.guards)if(NP.includes(n))despawn(n);C3KP.guards=[];
  const closed=!!(S.done&&S.done.c3empire)||!!(S.c3&&S.c3.shut&&S.c3.shut.kto)||S.ch>=4;
  if(!closed)for(const n of C3KP.hid){if(n.c3pk){n.c3pk=0;n.hidden=0}}C3KP.hid=[]}
function c3kTick(dt){if(mode==='title'||mode==='loading'||!INT.kto)return;
  C3KP.chk-=dt;if(C3KP.chk<=0){C3KP.chk=1;const w=c3kWant();if(w&&!C3KP.on)c3kOn();else if(!w&&C3KP.on)c3kOff();if(C3KP.on){try{c3kGuards()}catch(e){}}}
  if(!C3KP.on)return;
  C3KP.pm.forEach((m,k)=>{m.color.setHSL(((TT*.2+k/6)%1+1)%1,1,.55);m.opacity=.45+.4*Math.abs(Math.sin(TT*4.4+k*1.3))});
  C3KP.sm.forEach((m,k)=>{m.color.setHSL(((TT*.2+k/6+.5)%1+1)%1,1,.5);m.opacity=.32+.3*Math.abs(Math.sin(TT*4.4+k*1.3+.8))});
  if(P.inside==='kto'&&C3KP.crowd&&C3KP.crowd.g.visible){c1CrowdUpd(C3KP.crowd,TT);const d=C3KP.disco;if(d){d[0].rotation.y+=dt*1.5;d.forEach((m,i)=>{if(!i)return;if(m.userData.fl){m.material.color.setHSL((TT*.3+i*.21)%1,1,.55)}else m.scale.setScalar(.8+.4*Math.abs(Math.sin(TT*5+i*1.7)))})}}
  C3KP.ej-=dt;if(C3KP.ej<=0){C3KP.ej=.4;c3kClear()}}
{const _t=c3Tick;c3Tick=function(dt){try{c3kTick(dt)}catch(e){console.warn('c3kTick',e)}return _t.apply(this,arguments)}}
/* virtual campus people bound to a rig inside the lawns are moved out first */
{const _cb=crowdBind;crowdBind=function(n,v){if(c3kHold(v.x,v.z)){const[x,z]=c3kOut(v.x,v.z);v.x=x;v.z=z}return _cb.apply(this,arguments)}}
/* ================================================================ V281 the lawn: the pledges peek through a window at the coke party */
function c3WinOverlay(on){let e=$('c3win');
  if(!e){e=document.createElement('div');e.id='c3win';e.hidden=true;e.innerHTML='<div class="wn-glow"></div><i class="wn-v"></i><i class="wn-h"></i><div class="wn-fr"></div>';document.body.appendChild(e)}
  e.hidden=!on}
async function c3WindowCine(done){
  const b=B.find(q=>q.id==='kto'),I=INT.kto,s=c3S(),keys=Object.keys(s.pl||{}).filter(k=>NN[k]);
  if(!b||!I){if(done)done();return}
  /* a low window on the front of the house, nearest the door */
  let w=null;if(C3KP.wins){let bd=1e9;for(const q of C3KP.wins){if(!q.low||Math.abs(q.e.nx)<.5)continue;const d=Math.hypot(q.cx-(b.ex+1.4),q.cz-32);if(d>7&&d<bd){bd=d;w=q}}}
  const nx=w?w.e.nx:1,nz=w?w.e.nz:0,cx=w?w.cx:b.ex,cz=w?w.cz:27,lx=-nz,lz=nx,gy=terrH(cx+nx*2,cz+nz*2);
  const at=(d,l)=>[cx+nx*d+lx*l,cz+nz*d+lz*l],face=Math.atan2(-nx,-nz),sv={x:P.x,z:P.z,hid:[]};
  const pups=[];
  await c6Cine(async()=>{
    await c4Wt(1.6);
    c1Say(pups[0],pick(['Is that... a DJ?','Oh my god. Look at the DJ.']),2.6);await c4Wt(1.5);
    pups.forEach((p,i)=>{if(i<3){p.pup.arms=-1.1;p.pup.lean=-.18}});
    if(pups[2])c1Say(pups[2],'Is that powder on the piano?',2.6);await c4Wt(1.8);
    if(pups[1])c1Say(pups[1],'It is on every surface in there.',2.6);await c4Wt(1.6);
    /* what they see */
    await c4Fade(async()=>{try{c1Sub(null)}catch(e){}c3WinOverlay(true);PM.visible=false;goIn('kto',24,15);
      c4Shot([I.x0+24,1.9,I.z0+18.5],[I.x0+24,3.2,I.z0+27],0)});
    c4Shot([I.x0+16,1.9,I.z0+19],[I.x0+30,2.4,I.z0+28],.3);await c4Wt(3.4);
    c4Shot([I.x0+30,1.9,I.z0+19],[I.x0+20,2.2,I.z0+28],.3);await c4Wt(2.8);
    await c4Fade(async()=>{c3WinOverlay(false);goOut(sv.x,sv.z)})
  },done,{fade:async()=>{
      for(const k of keys){const n=NN[k];if(!n.hidden){n.hidden=1;sv.hid.push(n)}}
      keys.slice(0,5).forEach((k,i)=>{const[x,z]=at(1.5+(i%2)*.4,(i-2)*.95),p=c4Dup(k,x,z,face,{tag:'c3win',pup:1});if(p)pups.push(p)});
      c4DanAt(...at(5,5),face);
      c4Shot([...at(8,2.4)].reduce((a,v,i)=>(a[i?2:0]=v,a),[0,gy+2.6,0]),[cx,gy+1.7,cz],0);
      c4Shot([...at(5.2,1.6)].reduce((a,v,i)=>(a[i?2:0]=v,a),[0,gy+1.9,0]),[cx,gy+1.7,cz],.25)},
    after:()=>{c3WinOverlay(false);if(P.inside)goOut(sv.x,sv.z);PM.visible=true;c4Off('c3win');for(const n of sv.hid)n.hidden=0;c3Followers(1)}})}
/* ================================================================ V283 the raid: the police come through the front door */
const C3CP={on:0,bros:[],nx:0};
function c3SirenOverlay(on){let e=$('c3sir');if(!e){e=document.createElement('div');e.id='c3sir';e.hidden=true;document.body.appendChild(e)}e.hidden=!on}
/* sneezing, sitting brothers: a head-jerk on each sneeze, and a bubble from one of them every so often */
function c3CopsTick(dt){if(!C3CP.on)return;C3CP.nx-=dt;if(C3CP.nx>0)return;C3CP.nx=.7+rnd()*.9;
  const b=C3CP.bros.filter(n=>NP.includes(n));if(!b.length)return;const n=pick(b);n.c3snA=TT;bubble(n,pick(['*ACHOO!*','*sniff* *ACHOO!*','*cough cough*','*sneezes for eleven seconds*','My eyes…','I can\'t feel my teeth.']),1.5)}
function c3SneezePose(n,g){const p=g&&g.P;if(!p)return;const t=n.t||0,k=n.c3snA!=null?TT-n.c3snA:9;
  if(p.head){p.head.rotation.x+=(k<.45?Math.sin(k/.45*PI)*.65:0)+Math.sin(t*2.3+n.uid)*.06;p.head.rotation.y+=Math.sin(t*1.1+n.uid)*.2}
  if(p.chest&&k<.45)p.chest.rotation.x+=Math.sin(k/.45*PI)*.25;
  if(p.aL)p.aL.rotation.x=-.5;if(p.aR)p.aR.rotation.x=-.5}
async function c3CopsCine(done){
  const I=INT.kto,F=(C3.foesLast||[]).filter(n=>NP.includes(n)),s=c3S();
  if(!I||!F.length){if(done)done();return}
  const X=I.x0,Z=I.z0,sv={pl:[],hid:[]},cops=[],pls=[];let pillar=null;
  const bros=F.filter(n=>n.c3face).concat(F.filter(n=>!n.c3face)).slice(0,10);
  for(const n of F)if(!bros.includes(n)){n.hidden=1;sv.hid.push(n)}
  const SP=[[-3,-2],[0,-3],[3,-2.5],[-4.5,.5],[-1.5,0],[1.5,.5],[4.5,0],[-3,3],[0,3.2],[3,3]];
  await c6Cine(async()=>{
    await c4Wt(.6);
    pls.forEach((p,i)=>c4To(p,X+14+i*4.5,Z+16.6,5.6));
    c1Say(pls[1],'SIRENS! GO GO GO!',1.6);await c4Wt(.8);c1Say(pls[3],'The back door! THE BACK DOOR!',1.6);await c4Wt(1.4);
    c4Off('c3pl');
    /* the front door bursts open */
    cops.forEach((p,i)=>c4To(p,X+[20,24,28,31][i],Z+[32.5,33.5,32.5,30.5][i],5));
    c1Say(cops[0],'HARROWGATE PD! HANDS! LET ME SEE HANDS!',2.6);await c4Wt(2.2);
    cops.forEach(p=>{p.pup.arms=-1.45;p.pup.look=[X+24,Z+27]});
    c1Say(bros[0],'*ACHOO* It\'s flour. This is a baking party.',2.6);await c4Wt(2.4);
    c1Say(cops[2],'Nobody move. Everybody stays on the floor.',2.4);await c4Wt(2.2);
    c1Say(bros[4],'My father is going to hear about this.',2.4);await c4Wt(2.2);
    c1Sub('Danny','...do not move. Do not breathe.',2.4);await c4Wt(2.4);
    c1Say(cops[1],'Somebody get Detective Ruiz in here.',2.4);await c4Wt(2.2);
    await c4Fade(async()=>{})
  },done,{fade:async()=>{
      C3CP.bros=bros;C3CP.on=1;C3CP.nx=.5;c3SirenOverlay(true);
      bros.forEach((n,i)=>{const x=X+24+SP[i][0],z=Z+27+SP[i][1];n.hidden=0;n.c3wired=0;n.c3wiredAt=0;n.aggro=0;n.tgt=null;n.down=0;n.x=x;n.z=z;n.path=null;
        n.grab=1;n.actor=1;n.noTalk=1;n.pup={tx:x,tz:z,v:3.4,st:'sit',y:null,t:rnd()*9,face:Math.atan2(24-SP[i][0]*.5-x+X,Z+36-z)*0+PI*(.7+rnd()*.6),lean:0,lie:0,dy:-.42,post:null};
        n.pup.post=g=>c3SneezePose(n,g);n.g.rotation.order='YXZ';if(!C4.pups.includes(n))C4.pups.push(n);c3Dust(n);c4PupPlace(n,0)});
      pillar=new THREE.Mesh(new THREE.CylinderGeometry(.42,.48,4.6,14),mt(0xd8d4c8,.8));pillar.position.set(X+13,2.3,Z+26);pillar.userData.noMerge=1;I.g.add(pillar);
      c4DanAt(X+13,Z+24.7,0);
      const keys=Object.keys(s.pl||{}).filter(k=>NN[k]);keys.slice(0,5).forEach((k,i)=>{const p=c4Dup(k,X+14+i*4.5,Z+21.5+(i%2)*1.2,PI,{tag:'c3pl',pup:1,int:'kto'});if(p)pls.push(p)});
      for(let i=0;i<4;i++){const p=c4Pup('cops',X+22+i*1.3,Z+37.6,PI,{tag:'c3cp',int:'kto',name:'Officer '+['Dunn','Okafor','Brandt','Silva'][i],title:'Harrowgate PD',lvl:6});if(p)cops.push(p)}
      c4Shot([X+24,2.5,Z+18.3],[X+24,1.2,Z+30],0);c4Shot([X+24,2.3,Z+19.6],[X+24,1.2,Z+30],.1)},
    after:()=>{C3CP.on=0;c3SirenOverlay(false);c4Off('c3pl');c4Off('c3cp');if(pillar&&pillar.parent)pillar.parent.remove(pillar);for(const n of sv.hid)n.hidden=0}})}
