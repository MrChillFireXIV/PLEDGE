// ================================================================ V374+ pledge job moves that need more than a T press (deck of slides, Nov 2026)
/* THELD = T (or the role badge on phones) is being held down. prAbility still fires once on the press; moves that care about holding read THELD */
let THELD=0;

// ---------------------------------------------------------------- V374 Delinquent Pledge: hold T to spray paint. Hold it on a wall to leave a tag.
// Whoever owns the wall comes after him: a frat's brothers fight right away; on campus, people who saw it bug him until it turns into a fight.
// A tag that starts a fight counts for the job quota.
const TAGS=[],TGP=[];let TGCUR=null,TGRC=null;
const TGWORD=['ΑΣΡ','ΑΣΡ!','ASR','PLEDGE','ΑΣΡ 4 LIFE','RAM'];
const tgTex=i=>prTex('tag'+i,256,144,(q,w,h)=>{const t=TGWORD[i%TGWORD.length];q.clearRect(0,0,w,h);q.textAlign='center';q.textBaseline='middle';let fs=t.length>6?54:t.length>4?66:84;q.font=`900 ${fs}px Impact, 'Arial Black', sans-serif`;
  q.save();q.translate(w/2,h/2);q.rotate(-.08);q.lineJoin='round';q.lineWidth=16;q.strokeStyle='#1a0d0d';q.strokeText(t,0,4);q.lineWidth=7;q.strokeStyle='#f3e9df';q.strokeText(t,0,4);
  const g=q.createLinearGradient(0,-fs/2,0,fs/2);g.addColorStop(0,'#ff4a3a');g.addColorStop(1,'#a8161a');q.fillStyle=g;q.fillText(t,0,4);
  q.globalAlpha=.85;q.fillStyle='#b81c1e';const m=q.measureText(t).width;for(let k=0;k<7;k++){const x=-m/2+m*(k+.5)/7+Math.sin(k*7.3)*6,l=10+((k*37)%28);q.fillRect(x-2,fs*.36,4,l);q.beginPath();q.arc(x,fs*.36+l,3.2,0,TAU);q.fill()}
  q.globalAlpha=.35;q.fillStyle='#d8261e';for(let k=0;k<26;k++){q.beginPath();q.arc((Math.sin(k*12.9)*.5)*m*1.1,(Math.cos(k*7.7)*.5)*fs*1.3,1+(k%3),0,TAU);q.fill()}q.restore()});
const tgDot=()=>prTex('tgdot',32,32,(q,w,h)=>{const g=q.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(214,40,32,.9)');g.addColorStop(1,'rgba(214,40,32,0)');q.fillStyle=g;q.fillRect(0,0,w,h)});
function tgTip(){const u=PM&&PM.userData.can,v=new THREE.Vector3(0,.13,0);if(u){PM.updateMatrixWorld(true);u.localToWorld(v)}else v.set(P.x,PM.position.y+1.3,P.z);return v}
/* what the can is pointed at: the first vertical surface within 2.2 m in front of him at chest height (people and his own body don't count) */
function tgRay(){const fx=Math.sin(P.face),fz=Math.cos(P.face),y=PM.position.y+1.3,c=tgTip(),o=new THREE.Vector3(c.x-fx*.3,y,c.z-fz*.3),d=new THREE.Vector3(fx,0,fz);/* from the can's side of his body, so the tag lands where the spray goes */
  const rc=TGRC||(TGRC=new THREE.Raycaster());rc.set(o,d);rc.near=0;rc.far=2.2;const skip=new Set([PM]);for(const n of NP)if(n.g)skip.add(n.g);for(const t of TAGS)skip.add(t.m);
  const L=[];sc.traverseVisible(m=>{if(m.isMesh&&!m.isInstancedMesh&&m.geometry&&!(m.material&&m.material.transparent&&m.material.opacity<.6))L.push(m)});let hits;try{hits=rc.intersectObjects(L,false)}catch(e){return null}
  for(const h of hits){let a=h.object;while(a&&!skip.has(a))a=a.parent;if(a||!h.face)continue;const n=h.face.normal.clone().transformDirection(h.object.matrixWorld);if(Math.abs(n.y)>.45)continue;n.y=0;n.normalize();if(n.dot(d)>0)n.negate();
    const bx=h.point.x-n.x*.3,bz=h.point.z-n.z*.3;if(!solid(bx,bz))continue;return{p:h.point.clone(),n}}return null}
function tgOwner(p){if(P.inside){const f=FRATS.find(f=>P.inside===f.id||P.inside.indexOf(f.id+'_')===0);return f?{f}:{camp:1}}const b=B.find(b=>p.x>=b.x0-1.2&&p.x<=b.x1+1.2&&p.z>=b.z0-1.2&&p.z<=b.z1+1.2);const f=b&&FRATS.find(f=>f.id===b.id);return f?{f,b}:{b,camp:1}}
function tgNew(h){const i=Math.floor(rnd()*TGWORD.length),M=new THREE.MeshStandardMaterial({map:tgTex(i),transparent:true,opacity:0,depthWrite:false,roughness:.85,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});
  const m=new THREE.Mesh(GC.tgPlane||(GC.tgPlane=new THREE.PlaneGeometry(1.25,.7)),M);m.position.copy(h.p).addScaledVector(h.n,.025);m.lookAt(m.position.clone().add(h.n));m.rotateZ((rnd()-.5)*.12);m.userData.tag=1;sc.add(m);
  const t={m,p:h.p,n:h.n,prog:0,done:0,fought:0,t:TT,int:P.inside||null,own:tgOwner(h.p)};TAGS.push(t);while(TAGS.length>30){const o=TAGS.shift();sc.remove(o.m);o.m.material.dispose()}return t}
function tgMist(){if(TGP.length>60)return;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tgDot(),transparent:true,depthWrite:false,opacity:.75}));const v=tgTip();s.position.copy(v);s.scale.setScalar(.1);sc.add(s);
  const sp=3.2+rnd()*1.2,fx=Math.sin(P.face),fz=Math.cos(P.face),sd=(rnd()-.5)*.5;TGP.push({s,t:0,vx:fx*sp+fz*sd,vz:fz*sp-fx*sd,vy:(rnd()-.45)*.6})}
/* the people who might care: not the police (they just get you in trouble), not kids, actors or anyone busy */
const tgCand=(t,r)=>NP.filter(n=>!n.down&&!n.kid&&!n.hidden&&n.g&&n.g.visible&&!n.actor&&!n.statue&&!n.auth&&!n.pclass&&!n.ally&&!n.follow&&!n.aggro&&!n.chase&&!n.job&&!n.nag&&!n.temp&&!n.mute&&(n.int||null)===t.int&&Math.hypot(n.x-t.p.x,n.z-t.p.z)<r);
const tgOwns=(n,f)=>(n.title||'').indexOf(f.L)===0||(n.cl===f.cl&&!n.pledge&&Math.hypot(n.x-P.x,n.z-P.z)<14);
const TGNAG=['Hey! Did you just spray that?','That\'s not your wall, man. Clean it up.','I\'m not asking again. Clean. It. Up.'];
function tgFight(n,t){n.nag=null;n.aggro=1;n.tgt='P';n.wait=0;n.path=null;bubble(n,pick(['Alright. You asked for it.','You think that\'s funny?!','Now you\'re gonna clean it with your face.']),2.4);
  if(t&&!t.cnt){t.cnt=t.fought=1;const r=RS();r.tgF=(r.tgF||0)+1;try{pqUse(1)}catch(e){}toast('Your tag started a fight. That counts for the job.',2600)}}
function tgReact(t,now){const o=t.own;if(t.seen)return 1;if(o.f&&o.f.id==='asr'){const n=NP.find(n=>n.cl==='brothers'&&!n.pledge&&!n.down&&n.g&&n.g.visible&&(n.int||null)===t.int&&Math.hypot(n.x-t.p.x,n.z-t.p.z)<18);if(n){bubble(n,pick(['Not on OUR house, pledge!','You\'re scrubbing that off before roll call.']),2.6);stand(-1);t.seen=t.fought=1}return 1}
  if(o.f){const own=tgCand(t,now?24:14).filter(n=>tgOwns(n,o.f)).sort((a,b)=>a.dp-b.dp).slice(0,2);if(own.length){t.seen=1;own.forEach((n,i)=>setTimeout(()=>{if(mode==='play'&&!n.down){bubble(n,pick(['Did you just tag OUR house?!','That\'s '+o.f.L+' property, pledge!']),2);setTimeout(()=>tgFight(n,t),900)}},i*500));if(o.f.cl)rep(o.f.cl,-3);return 1}return 0}
  const w=tgCand(t,now?16:11).filter(n=>n.dp<5||canSee(n,16)).sort((a,b)=>a.dp-b.dp).slice(0,2);if(w.length)t.seen=1;w.forEach((n,i)=>{n.nag={t,c:1,nx:TT+2.4+i*.8};n.path=null;bubble(n,TGNAG[0],2.4)});return w.length}
function tgDone(t,r){t.done=1;t.t=TT;t.m.material.opacity=1;TGCUR=null;tone(880,.06,'triangle',.05);dmgNum(t.p.x,1.9,t.p.z,'TAGGED!','#ff6a5a');if(r.tgD!==S.day){r.tgD=S.day;r.tgN=0}r.tgN++;gainXP(2);
  if(r.dlD!==S.day){r.dlD=S.day;gainXP(10);stand(1)}const cop=NP.find(m=>m.auth&&m.dp<18&&canSee(m,18));if(cop){bubble(cop,pick(['Hey! That\'s vandalism!','Drop the can, pledge!']),2.4);trouble(25)}
  if(!tgReact(t,1))toast(t.own.f&&t.own.f.id!=='asr'?'Tagged. When a '+t.own.f.L+' brother sees it, he\'ll come for you.':t.own.f?'You tagged your own house. Bold.':'Tagged. Nobody saw it... yet.',2400)}
function tgTick(dt,r){const can=PM&&PM.userData.can,on=!!(THELD&&can&&mode==='play'&&!CINE&&!EV&&!P.dead&&!P.kart&&!P.bike&&!P.med&&P.punch<=0&&!(P.roll>0));P.spray=on?1:0;
  if(on){if((tgTick.e=(tgTick.e||0)-dt)<=0){tgTick.e=.03;tgMist();tgMist()}if((tgTick.s=(tgTick.s||0)-dt)<=0){tgTick.s=.12;noise(.14,.035,6500)}
    if((tgTick.r=(tgTick.r||0)-dt)<=0||!tgTick.hit){tgTick.r=.2;tgTick.hit=tgRay()}const h=tgTick.hit;
    if(h&&!TAGS.some(t=>t.done&&t.p.distanceTo(h.p)<.9&&t.n.dot(h.n)>.8)){/* no second tag on top of a finished one */let t=TGCUR&&!TGCUR.done&&TGCUR.p.distanceTo(h.p)<.8&&TGCUR.n.dot(h.n)>.8?TGCUR:null;if(!t)t=TGCUR=tgNew(h);t.prog=Math.min(1,t.prog+dt/1.5);t.m.material.opacity=Math.min(1,.08+t.prog*.92);t.m.scale.setScalar(.75+t.prog*.25);if(t.prog>=1)tgDone(t,r)}}
  else tgTick.hit=null}
/* runs whatever his job: the spray mist, fresh tags somebody walks past, and people nagging him */
function tgWorld(dt){for(let i=TGP.length-1;i>=0;i--){const o=TGP[i];o.t+=dt;o.s.position.x+=o.vx*dt;o.s.position.z+=o.vz*dt;o.s.position.y+=o.vy*dt;o.vx*=.9;o.vz*=.9;o.s.scale.setScalar(.1+o.t*.9);o.s.material.opacity=.75*(1-o.t/.55);if(o.t>.55){sc.remove(o.s);o.s.material.dispose();TGP.splice(i,1)}}
  if((tgWorld.w=(tgWorld.w||0)-dt)>0||mode!=='play')return;tgWorld.w=.6;for(const t of TAGS)if(t.done&&!t.seen&&TT-t.t<150&&t.int===(P.inside||null)&&Math.hypot(t.p.x-P.x,t.p.z-P.z)<30)tgReact(t,0)}
/* someone who saw the tag walks up and bugs him; the third time, he swings */
function tgNagTick(n,dt){const g=n.nag;if(!g||mode!=='play'){n.nag=null;return''}if(n.dp>26||(n.int||null)!==(P.inside||null)||P.dead){if(n.dp<40)bubble(n,pick(['Yeah, keep walking!','Coward.']),2);n.nag=null;return''}
  if(n.dp>1.8)navTo(n,P.x,P.z,2.8,dt);else n.a+=((((Math.atan2(P.x-n.x,P.z-n.z)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*6);
  if(TT>=g.nx&&n.dp<9){g.nx=TT+2.6;if(g.c>=TGNAG.length){tgFight(n,g.t);return'guard'}bubble(n,TGNAG[g.c++],2.4)}return n.dp<=1.8?'talk':''}

// ---------------------------------------------------------------- V376 Hype Pledge: T drops the beat for 5 s. He jumps with the boombox, notes fly out of it,
// and people nearby put their hands up, come in close and jump with him. He can walk off whenever he wants; the dancers stop when it ends or he leaves.
const HYN=[];
function hyStart(){P.hype=5;const B=[98,98,131,110],M=[523,659,784,659,587,698,880,698];for(let i=0;i<10;i++){const t=i*.5;tone(B[i%4],.16,'sine',.16,t);tone(B[i%4]*2,.08,'square',.03,t);noise(.05,.05,i%2?5200:900);if(i%2)tone(M[(i/2|0)%8],.22,'triangle',.05,t+.25)}
  for(let i=1;i<10;i++)setTimeout(()=>{if(P.hype>0&&mode==='play')noise(.05,.05,i%2?5200:900)},i*500);
  const L=NP.filter(n=>!n.down&&!n.kid&&!n.hidden&&n.g&&n.g.visible&&!n.actor&&!n.statue&&!n.auth&&!n.aggro&&!n.chase&&!n.job&&!n.nag&&!n.follow&&!n.ally&&!n.mute&&!n.named&&!n.dance&&(n.int||null)===(P.inside||null)&&n.dp<13).sort((a,b)=>a.dp-b.dp).slice(0,7);
  L.forEach((n,i)=>{n.dance={t:5,a:Math.atan2(n.z-P.z,n.x-P.x)+(rnd()-.5)*.6,r:1.7+(i%3)*.55,ph:rnd()};n.path=null;n.wait=0;if(i<3)setTimeout(()=>{if(n.dance)bubble(n,pick(['AYYY!','This is my SONG!','Hands up!','LET\'S GO!','Okay, okay, I see you!']),1.8)},300+i*400)})}
function hyEnd(n,ok){n.dance=null;n.path=null;if(n.g)n.g.HPF=null;if(ok&&rnd()<.4)bubble(n,pick(['That was fire.','Again tomorrow?','My legs, man.']),1.8)}
function hyDanceTick(n,d_){const D=n.dance;D.t-=d_;if(D.t<=0||P.hype<=0||n.dp>16||(n.int||null)!==(P.inside||null)){hyEnd(n,D.t<=0||P.hype<=0);return''}
  const tx=P.x+Math.cos(D.a)*D.r,tz=P.z+Math.sin(D.a)*D.r,ds=Math.hypot(tx-n.x,tz-n.z);if(ds>.35){navTo(n,tx,tz,ds>2.5?3.4:1.8,d_);D.at=0;return''}D.at=1;n.a+=((((Math.atan2(P.x-n.x,P.z-n.z)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,d_*5);return''}
function hyDancePose(n){const D=n.dance,p=n.g.P;if(!D||!p||!p.aL)return;n.g.HPF='open';const k=D.at?1:.5,b=Math.abs(Math.sin((TT+D.ph*.5)*PI*2));if(D.at)n.g.position.y+=b*.22;
  p.aL.rotation.set((-2.65+b*.3)*k,0,-.4*k);p.aR.rotation.set((-2.65+(1-b)*.3)*k,0,.4*k);p.eL.rotation.set(-.3,0,0);p.eR.rotation.set(-.3,0,0);if(p.head)p.head.rotation.x+=(b-.5)*.18;if(p.kL&&D.at){p.kL.rotation.x=.35*b;p.kR.rotation.x=.35*b}}
function hyTick(dt){if(!(P.hype>0))return;P.hype-=dt;if(!isR('hype')||mode!=='play'){P.hype=0;return}const bx=PM.userData.box;if(bx&&(hyTick.n=(hyTick.n||0)-dt)<=0){hyTick.n=.22;const v=new THREE.Vector3();bx.getWorldPosition(v);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texNote(),transparent:true,depthWrite:false}));s.scale.setScalar(.34);s.position.set(v.x+(rnd()-.5)*.3,v.y+.15,v.z+(rnd()-.5)*.3);sc.add(s);prNotes.push({s,t:0,vx:(rnd()-.5)*1.2})}}

// ---------------------------------------------------------------- V377 Snack Pledge: T hands the person next to him a snack. They eat it, and it's a coin flip whether they like it:
// strangers and high-level people are harder to please, friends easier. Only snacks people like count for the quota.
const SNACKS=[['pretzels',0xd8a040],['a pizza roll',0xc0302a],['a brownie',0x5a3420],['a cheese puff',0xf2a030],['a mini taco',0xe8c060],['a gummy worm',0x7ad04a]];
function snOdds(n){return clamp(.64-n.lvl*.04+relOf(n)/250,.12,.9)}
function snGive(n){const it=pick(SNACKS),ok=rnd()<snOdds(n);n.eat={t:0,ok,it,said:0};n.path=null;n.wait=0;prSay(pick(['Snack?','Try one!','Fresh off the tray!']),1.4);tone(700,.05,'triangle',.05)}
function snEatTick(n,dt){const E=n.eat;E.t+=dt;n.a+=((((Math.atan2(P.x-n.x,P.z-n.z)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*6);
  if(E.t>1.9&&!E.said){E.said=1;const r=RS();if(E.ok){bubble(n,pick(['Mmm! Okay, that\'s actually good.','Oh, that hits.','You\'re alright, Snack Pledge.','Can I get another one of those tomorrow?']),2.4);relAdd(n,4);gainXP(1);money(.25);r.snOk=(r.snD===S.day?r.snOk||0:0)+1;try{pqUse(1)}catch(e){}dmgNum(n.x,2.5,n.z,'♥','#ff7aa0')}
    else{bubble(n,pick(['Ugh. What IS this?','...Is this stale?','Nope. No thank you.','Did you drop this on the floor?']),2.4);relAdd(n,-1);dmgNum(n.x,2.5,n.z,'BLEH','#9ab84a')}}
  if(E.t>3){if(E.m&&E.m.parent)E.m.parent.remove(E.m);n.eat=null}return''}
function snEatPose(n){const E=n.eat,p=n.g.P;if(!E||!p||!p.aR)return;if(!E.m&&p.hR){E.m=new THREE.Mesh(GC.snBite||(GC.snBite=new THREE.SphereGeometry(.045,8,6)),mt(E.it[1],.6));E.m.position.set(-.03,-.1,.03);p.hR.add(E.m)}
  const u=E.t<.35?E.t/.35:E.t<1.8?1:Math.max(0,1-(E.t-1.8)/.4),chew=E.t>.35&&E.t<1.8?Math.sin(E.t*18)*.06:0;p.aR.rotation.set(-.8*u,0,.45*u);p.eR.rotation.set(-2.6*u+chew,0,0);if(E.m){E.m.visible=E.t<1.5;if(E.t>.9)E.m.scale.setScalar(Math.max(.2,1-(E.t-.9)))}
  if(E.said&&!E.ok&&p.head)p.head.rotation.y+=Math.sin(E.t*14)*.18*Math.max(0,1-(E.t-1.9))}
/* blocking with the tray: his right knee comes up and the tray rests on it while his arms guard */
function snKnee(){const T=PM.userData.tray,p=PM.P;if(!T||!p||!p.kR)return;const b=P.blk||0,e=b*b*(3-2*b);if(e<.001){T.position.set(0,-.135,.27);return}
  p.lR.rotation.x+=(-1.5-p.lR.rotation.x)*e;p.kR.rotation.x+=(1.55-p.kR.rotation.x)*e;p.lR.rotation.z*=1-e;PM.updateMatrixWorld(true);
  const k=new THREE.Vector3();p.kR.getWorldPosition(k);k.y+=.11;const l=p.chest.worldToLocal(k);T.position.set(l.x*e,-.135+(l.y+.135)*e,.27+(l.z-.27)*e)}

// ---------------------------------------------------------------- V378 Scribe Pledge: whenever someone nearby says something out loud (a speech bubble) while Danny
// isn't in a conversation, a ✎ pops up over them for a few seconds and T writes the line into the minutes. The minutes are in the Planner's pledge job box.
let SCH=null,SCM=null;
function scHear(n,t){if(!t||!n||n===DANNY||mode!=='play'||!S.pledged||S.prole!=='scribe'||!n.name||!n.g||n.scQuiet||!NP.includes(n))return;if((n.int||null)!==(P.inside||null)||Math.hypot(n.x-P.x,n.z-P.z)>14)return;
  SCH={n,t:String(t).replace(/\s+/g,' ').trim(),at:TT,done:0};if(SCM&&SCM.s.parent)SCM.s.parent.remove(SCM.s);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texMark(),transparent:true,depthWrite:false,depthTest:false}));s.scale.set(.9,.45,1);s.position.y=3.35;s.renderOrder=6;n.g.add(s);SCM={s,at:TT}}
function scTick(){if(SCM){SCM.s.position.y=3.35+Math.sin((TT-SCM.at)*6)*.05;if(TT-SCM.at>4.5||(SCH&&SCH.done)){if(SCM.s.parent)SCM.s.parent.remove(SCM.s);SCM=null}}}
function scTally(r){const h=SCH;if(!h||h.done||TT-h.at>4.5||!NP.includes(h.n)||Math.hypot(h.n.x-P.x,h.n.z-P.z)>16){toast('Nothing to write down. Wait for someone to say something (✎ over them), then press T.',2400);return}
  h.done=1;const L=r.min||(r.min=[]);L.push({w:h.n.name,t:h.t,d:S.day});if(L.length>80)L.shift();r.notes=(r.notes||0)+1;gainXP(2);prSay('*scribbling*',1.4);tone(1300,.04,'square',.03);tone(1100,.04,'square',.03,.07);
  toast(`Minutes: ${h.n.name}: "${h.t.length>70?h.t.slice(0,68)+'…':h.t}"`,2600);try{pqUse(1)}catch(e){}if(r.notes%5===0){money(1.5);setTimeout(()=>toast('Five more quotes in the minutes. Grant slips you $1.50.',2600),900)}
  if(rnd()<.25){const n=h.n;n.scQuiet=1;setTimeout(()=>{try{bubble(n,pick(['Are you... writing that down?','Do NOT put that in the minutes.','Wait, are you quoting me?']),2)}catch(e){}n.scQuiet=0},900)}}
function scMinutesHTML(r){const L=(r.min||[]).slice(-8).reverse(),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  return`<div class="scmin"><div class="scmh">The minutes <span>${(r.min||[]).length} quote${(r.min||[]).length===1?'':'s'}</span></div>${L.length?L.map(e=>`<div class="scq"><b>${esc(e.w)}</b><q>${esc(e.t)}</q><i>Day ${e.d}</i></div>`).join(''):'<div class="scq"><q>Nothing yet. Stand near people and wait for them to talk.</q></div>'}</div>`}

// ---------------------------------------------------------------- V380 Mascot Pledge costume: ram horns through the pledge hat, purple feathered poncho
/* a tapered, ridged ram horn along a curve that starts inside the cap, rises, sweeps back and down past the ear and curls forward */
function ramHornGeo(s){const key='mhorn2'+s;if(GC[key])return GC[key];const C=new THREE.CatmullRomCurve3([[.1,.33,-.01],[.16,.43,-.05],[.24,.44,-.11],[.31,.37,-.14],[.34,.27,-.1],[.33,.18,-.01],[.29,.13,.09],[.24,.15,.17],[.21,.21,.2]].map(([x,y,z])=>new THREE.Vector3(s*x,y,z)));
  const g=new THREE.TubeGeometry(C,40,.058,10,false),a=g.attributes.position,v=new THREE.Vector3();for(let i=0;i<=40;i++){const t=i/40,c=C.getPointAt(t),k=(1-t*.72)*(1+Math.sin(t*46)*.07);for(let j=0;j<=10;j++){const q=i*11+j;v.fromBufferAttribute(a,q).sub(c).multiplyScalar(k).add(c);a.setXYZ(q,v.x,v.y,v.z)}}g.computeVertexNormals();return GC[key]=g}
function mascotHorns(p){const H=SM({color:0xe2d6b8,roughness:.75}),DK=mt(0x2a2420,.9);for(const s of[-1,1]){prMesh(ramHornGeo(s),H,p.head,0,0,0);
    /* the hole cut in the hat: a dark ragged rim with a few frayed flaps of hat fabric around the horn */const rim=prMesh(new THREE.TorusGeometry(.052,.011,6,14),DK,p.head,s*.105,.345,0,0,0,s*.75);
    const cap=s>0?0xd8332e:0x2f9a46;for(let i=0;i<5;i++){const a=i/5*TAU+.3,f=prMesh(new THREE.ConeGeometry(.018,.05,3),mt(cap,.8),rim,Math.cos(a)*.058,0,Math.sin(a)*.058,0,0,0);f.lookAt(rim.localToWorld(new THREE.Vector3(Math.cos(a)*.3,.15,Math.sin(a)*.3)));f.rotateX(PI/2);f.scale.set(1,1,.35)}}}
function mascotPoncho(p){const pts=[[.115,.3],[.2,.285],[.33,.24],[.42,.15],[.455,.02],[.465,-.12],[.47,-.22]].map(([r,y])=>new THREE.Vector2(r,y));const L=new THREE.LatheGeometry(pts,30),PU=SM({color:0x5b2a86,roughness:.95,side:THREE.DoubleSide});const po=prMesh(L,PU,p.chest,0,0,0);po.scale.set(1,1,.72);
  /* trim bands: gold, then a row of white diamonds */prMesh(new THREE.TorusGeometry(.465,.012,5,36),SM({color:0xd8b048,roughness:.5,metalness:.4}),po,0,-.19,0,PI/2,0,0);for(let i=0;i<18;i++){const a=i/18*TAU;prMesh(bgeo(.034,.034,.01),mt(0xf2efe6,.8),po,Math.sin(a)*.462,-.11,Math.cos(a)*.462,0,a,PI/4)}
  prMesh(new THREE.TorusGeometry(.12,.02,6,20),mt(0x3a1a5a,.9),po,0,.3,0,PI/2,0,0);
  /* feather fringe along the hem: white feathers with purple and gold tips */const FG=GC.mfeather||(GC.mfeather=(()=>{const g=new THREE.SphereGeometry(1,8,6);g.scale(.022,.075,.006);g.translate(0,-.07,0);return g})());
  for(let i=0;i<26;i++){const a=i/26*TAU,f=prMesh(FG,mt([0xf4f1e8,0x7a3ab0,0xd8b048][i%3],.8),po,Math.sin(a)*.472,-.22,Math.cos(a)*.472,0,a,0);f.rotation.x=.18}
  for(const s of[-1,1]){const f=prMesh(FG,mt(0xf4f1e8,.8),p.head,s*.06,.3,-.17,-.9,0,s*.25);f.scale.setScalar(1.2)}}
