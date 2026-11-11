// ================================================================ V179 AMBIENT LIFE
// Random campus people no longer stand around staring at Danny. Every ambient (non-story) person outdoors runs a small loop:
// walk somewhere (sometimes jogging), stop and do something for a while (check a phone, take a call, stretch, dance, look around,
// wave to a friend), then move on. Home-anchored loungers (porch/lawn people) wander a few metres from their spot and come back.
// They only glance at Danny when he is right next to them. Hooks: npcUpd (21) calls ambOK/ambLife and ambPose.
const AMBACTS=[['phone',3],['call',2],['stretch',1],['dance',1],['look',2],['wave',1],['coffee',2],['tie',1],['pray',1],['pic',2],['selfie',1],['pose',2]];
function ambOK(n){return!!(!n.named&&!n.temp&&!n.actor&&!n.int&&!n.auth&&!n.pclass&&!n.pledge&&!n.statue&&!n.fb&&!n.shop&&!n.role&&!n.roam&&!n.def&&!n.rob&&!n.kid&&n.mode!=='chat'&&n.mode!=='play'&&n.mode!=='guard'&&!EV)}
function ambPick(){let s=0;for(const a of AMBACTS)s+=a[1];let r=rnd()*s;for(const a of AMBACTS){r-=a[1];if(r<=0)return a[0]}return'look'}
function ambReset(n){const A=n.al;if(A){try{if(A.cv)convLeave(n,A.cv);if(A.seat&&A.seat.by===n)A.seat.by=null}catch(e){}}n.al=null;n.alPose=null;n.alSub=null;if(n.alProp)for(const k in n.alProp)n.alProp[k].visible=false}
/* V300 ambLife moved to 21h4-social-life.js (purposeful behaviour: talk, errands, benches, watching fights) */
function ambStart(n,A){A.fr=null;if(A.act==='wave'){const fr=NP.find(m=>m!==n&&!m.hidden&&!m.int&&m.g.visible&&Math.hypot(m.x-n.x,m.z-n.z)<12&&Math.hypot(m.x-n.x,m.z-n.z)>2);if(fr)A.fr=fr;else A.act='look'}
  if(n.dp<14&&rnd()<.35&&!n.named&&!n.temp){const L=CHAT.solo[A.act];if(L)bubble(n,dlgLine(L),2.2)}}   /* V301 lines from CHAT.solo */
// poses layered over the base animation
function ambProp(n,k){n.alProp=n.alProp||{};let m=n.alProp[k];if(m)return m;const P_=n.g.P,h=P_&&(P_.hR||P_.aR);if(!h)return null;
  if(k==='phone'){m=new THREE.Mesh(GC.amPh||(GC.amPh=new THREE.BoxGeometry(.085,.16,.016)),GC.amPhM||(GC.amPhM=new THREE.MeshStandardMaterial({color:0x15171c,roughness:.35,emissive:0x4a78c8,emissiveIntensity:.9})));m.position.set(0,-.09,.03);m.rotation.x=-.3}
  else{m=new THREE.Mesh(GC.amCup||(GC.amCup=new THREE.CylinderGeometry(.04,.032,.12,10)),GC.amCupM||(GC.amCupM=new THREE.MeshStandardMaterial({color:0xf2ede2,roughness:.7})));m.position.set(0,-.09,.03)}
  m.userData.noMerge=1;h.add(m);m.visible=false;return n.alProp[k]=m}
function ambPose(n){let k=n.alPose;const p=n.g.P;if(n.alProp)for(const q in n.alProp)n.alProp[q].visible=false;if(!k||!p||!p.aR)return;const t=n.t,R=(o,x,y,z)=>{if(o)o.rotation.set(x,y,z)};
  /* V300 social poses */
  if(k==='sit'){n.g.position.y-=.42;if(p.kL){p.kL.rotation.x=1.5;p.kR.rotation.x=1.5}if(!n.alSub){R(p.aL,-.35,0,-.1);R(p.aR,-.35,0,.1);R(p.eL,-1.1,0,0);R(p.eR,-1.1,0,0);return}k=n.alSub}
  if(k==='talkS'){if(p.head)p.head.rotation.x+=Math.sin(t*2.6)*.06;if(p.chest)p.chest.rotation.y+=Math.sin(t*.9)*.12;return}
  if(k==='talkL'){if(n.lst){R(p.aL,-.42,0,.62);R(p.eL,-1.75,0,0);R(p.aR,-.42,0,-.62);R(p.eR,-1.75,0,0)}if(p.head){const nod=Math.max(0,Math.sin(t*2.4))*Math.max(0,Math.sin(t*.37+1));p.head.rotation.x+=.06+nod*.22}return}
  if(k==='laugh'){const s=Math.abs(Math.sin(t*13));n.g.position.y+=s*.02;if(p.head)p.head.rotation.x-=.28;if(p.chest)p.chest.rotation.x-=.12+s*.05;R(p.aL,-.5,0,.45);R(p.eL,-1.5,0,0);R(p.aR,-.25,0,-.25);R(p.eR,-.7,0,0);return}
  if(k==='phoneWalk'){R(p.aR,-.5,0,-.3);R(p.eR,-1.5,0,0);if(p.head)p.head.rotation.x+=.32;const m=ambProp(n,'phone');if(m)m.visible=true;return}
  if(k==='shock'){R(p.aL,-2.45,0,-.35);R(p.aR,-2.45,0,.35);R(p.eL,-2.05,0,0);R(p.eR,-2.05,0,0);if(p.head)p.head.rotation.x-=.08;return}
  if(k==='phone'||k==='coffee'){R(p.aR,-.55,0,-.32);R(p.eR,-1.55,0,0);if(p.head)p.head.rotation.x=k==='phone'?.38:.1;const m=ambProp(n,k==='phone'?'phone':'cup');if(m)m.visible=true;if(k==='coffee'&&Math.sin(t*.7)>.85){R(p.aR,-.9,0,-.4);R(p.eR,-2.2,0,0)}}
  else if(k==='call'){R(p.aR,-.15,0,-.55);R(p.eR,-2.45,0,0);const m=ambProp(n,'phone');if(m)m.visible=true;if(p.head)p.head.rotation.z=-.12}
  else if(k==='stretch'){const s=Math.sin(t*1.1);R(p.aL,-2.9,0,-.25+s*.15);R(p.aR,-2.9,0,.25+s*.15);R(p.eL,-.15,0,0);R(p.eR,-.15,0,0);n.g.rotation.z=s*.08}
  else if(k==='dance'){const s=Math.sin(t*6.5),c=Math.cos(t*6.5);R(p.aL,-.7+s*.45,0,-.45);R(p.aR,-.7-s*.45,0,.45);R(p.eL,-1.5,0,0);R(p.eR,-1.5,0,0);n.g.position.y+=Math.abs(s)*.07;n.g.rotation.y+=c*.25}
  else if(k==='look'){if(p.head)p.head.rotation.y=Math.sin(t*.9)*.85}
  else if(k==='pray'){n.g.position.y-=.3;R(p.aL,-1.05,0,.18);R(p.aR,-1.05,0,-.18);R(p.eL,-1.7,0,0);R(p.eR,-1.7,0,0);if(p.head)p.head.rotation.x=.55;if(p.lL&&p.kL){p.lL.rotation.x=-1.35;p.kL.rotation.x=1.95;p.lR.rotation.x=-.25;p.kR.rotation.x=1.7}}
  else if(k==='pic'){R(p.aR,-1.35,0,-.12);R(p.eR,-.25,0,0);R(p.aL,-.9,0,.35);R(p.eL,-1.2,0,0);if(p.head)p.head.rotation.x=.08;const m=ambProp(n,'phone');if(m){m.visible=true;m.rotation.x=-1.2}}
  else if(k==='selfie'){R(p.aR,-2.15,0,-.3);R(p.eR,-1.15,0,0);if(p.head){p.head.rotation.z=.18;p.head.rotation.x=-.05}n.g.rotation.z=Math.sin(t*.9)*.05;const m=ambProp(n,'phone');if(m){m.visible=true;m.rotation.x=-.4}}
  else if(k==='pose'){const s=Math.sin(t*.7);R(p.aL,.05,0,-.62);R(p.eL,-1.9,0,0);R(p.aR,-2.55,0,.3+s*.1);R(p.eR,-.3,0,0);n.g.rotation.z=.07+s*.03;n.g.rotation.y+=Math.sin(t*.5)*.35;if(p.head){p.head.rotation.z=-.15;p.head.rotation.y=s*.25}}
  else if(k==='tie'){n.g.position.y-=.32;R(p.aL,-1.1,0,-.1);R(p.aR,-1.1,0,.1);R(p.eL,-.4,0,0);R(p.eR,-.4,0,0);if(p.head)p.head.rotation.x=.5;if(p.lL&&p.kL){p.lL.rotation.x=-1.4;p.kL.rotation.x=1.9;p.lR.rotation.x=-.2;p.kR.rotation.x=1.6}}}
/* V252 nobody just stands there: the people who are not covered by ambLife (named, quest, interior, shop, pledge, guard and the like) get a small home-anchored version: walk a few metres around their spot (some jog), then do something (phone, call, stretch, dance, look, coffee, pray, take a photo, selfie, pose), then move again. Talking, scenes, jobs, fights, fixed-role modes and statues still stand still. */
function ambLiteOK(n){return(n.mode==='idle'||(n.mode==='guard'&&!n.patrol))&&!n.statue&&!n.job&&!n.follow&&!n.actor&&!n.c3wired&&!n.down&&!n.chase&&!n.aggro&&!n.flee&&!n.grab&&!EV}
function ambR(n){return n.shop||n.role?1.2:(n.named||n.temp||n.int)?2.5:4}
function ambLite(n,dt,r){let A=n.alt;if(!A){A=n.alt={k:'act',t:.5+rnd()*3,act:ambPick(),jog:0};ambStart(n,A)}
  n.alPose=null;
  if(A.k==='act'){A.t-=dt;
    if(n.dp<2.2&&!n.named&&!n.shop&&!n.role){n.a+=((((Math.atan2(P.x-n.x,P.z-n.z)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*3)}
    if(A.t<=0){if(rnd()<.7){let tx=null,tz=0;for(let i=0;i<6;i++){const a=rnd()*TAU,d=.8+rnd()*r,x=n.hx+Math.cos(a)*d,z=n.hz+Math.sin(a)*d;if(n.int||(freeAt(x,z,.4)&&!(typeof inLane==='function'&&inLane(x,z)))){tx=x;tz=z;break}}
        if(tx!=null){A.k='walk';A.tx=tx;A.tz=tz;A.to=3+rnd()*5;A.jog=rnd()<.25}else{A.act=ambPick();A.t=3+rnd()*6;ambStart(n,A)}}
      else{A.act=ambPick();A.t=3+rnd()*8;ambStart(n,A)}}
    n.alPose=A.act;return''}
  A.to-=dt;const ok=moveTo(n,A.tx,A.tz,A.jog?4.2:1.3,dt);
  if(ok===false||Math.hypot(A.tx-n.x,A.tz-n.z)<.45||A.to<=0){A.k='act';A.act=ambPick();A.t=3+rnd()*8;A.jog=0;ambStart(n,A)}
  return''}

