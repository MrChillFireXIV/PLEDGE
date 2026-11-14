// ================================================================ V128 CHAPTER 4 · HOMECOMING, part 2: football, the scenes, the quests, hooks
// ---------------------------------------------------------------- football: field yards (our goal line is 0, theirs is 100)
const c4GL=()=>STAD.hl-6,c4YD=()=>c4GL()*2/100,c4YU=y=>-c4GL()+y*c4YD(),c4UY=u=>(u+c4GL())/c4YD();
// routes: waypoints relative to where the receiver lines up, [downfield, toward his own sideline]
const C4PLAYS={
  slant:{n:'SLANT',rt:{r1:[[2,0],[6,-3.6],[13,-8]],r2:[[3.5,0],[3.5,4],[3.5,7.5]],r3:[[1.5,0],[9,0],[19,0]]},tip:'Deion breaks inside after three steps. Throw it the moment he turns: he\'ll run under it.'},
  curl:{n:'CURL FLAT',rt:{r1:[[7,0],[6.2,-.8]],r2:[[1,0],[1.6,4],[2.2,7]],r3:[[3.5,0],[3.5,-6],[3.5,-15]]},tip:'Deion runs seven yards and turns around. Kendrick is in the flat if they sit on Deion.'},
  post:{n:'DEEP POST',rt:{r1:[[9,0],[18,-5.5],[28,-10]],r2:[[12,0],[27,0]],r3:[[5,0],[5,-4],[5,-10]]},tip:'Deion goes deep and cuts to the middle. Wait for the cut, then let it fly. Cole is your safety valve.'},
  dive:{n:'HB DIVE',run:1,tip:'Turn, hand it to Marcus, get out of the way. He does the rest.'},
  verts:{n:'FOUR VERTS',rt:{r1:[[30,0]],r2:[[30,0]],r3:[[26,0]]},tip:''}};
const C4FB={on:0,phase:'',t:0,ts:1,k:{},o:{},d:[],rings:[],tags:[],ball:null};
const C4RCV=[['r1','Deion Carter'],['r2','Kendrick Hayes'],['r3','Cole Brandt']];
function c4Helmet(g,col){const h=g&&g.P&&g.P.head;if(!h||g.userData.c4helm)return;const m=new THREE.Group();
  const s=new THREE.Mesh(GC.c4helm||(GC.c4helm=new THREE.SphereGeometry(.205,14,10)),mt(col,.22,.25));s.scale.set(1.1,1.02,1.2);s.position.set(0,.21,-.02);m.add(s);
  const mask=new THREE.Mesh(GC.c4mask||(GC.c4mask=new THREE.TorusGeometry(.13,.016,4,12,PI)),mt(0xdedede,.4,.6));mask.position.set(0,.1,.2);mask.scale.setScalar(1.1);mask.rotation.set(0,0,PI);m.add(mask);
  m.traverse(o=>o.userData.noMerge=1);h.add(m);g.userData.c4helm=m}
// Danny's #7 jersey (front and back over his shirt) and a helmet
function c4JerseyTex(){return GC.c4jt||(GC.c4jt=ctex(128,128,(q,w,h)=>{q.fillStyle='#b81f2e';q.fillRect(0,0,w,h);q.fillStyle='#f6f2ea';q.fillRect(0,10,w,6);q.font='bold 74px Archivo,Arial,sans-serif';q.textAlign='center';q.textBaseline='middle';q.lineWidth=6;q.strokeStyle='#1d1d22';q.strokeText('7',w/2,h*.6);q.fillText('7',w/2,h*.6)}))}
function c4Jersey(on){const P_=PM&&PM.P;if(!P_||!P_.chest)return;if(on&&!P_.c4j){const mat=SM({map:c4JerseyTex(),roughness:.7,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});const g=new THREE.Group();
    const f=new THREE.Mesh(curvedPlane(.42,.48,false),mat);f.position.set(0,0,.008);g.add(f);const b=new THREE.Mesh(curvedPlane(.42,.48,false),mat);b.rotation.y=PI;b.position.set(0,0,-.24);g.add(b);g.traverse(o=>o.userData.noMerge=1);P_.chest.add(g);P_.c4j=g;c4Helmet(PM,0xb81f2e)}
  if(P_.c4j)P_.c4j.visible=!!on;if(PM.userData.c4helm)PM.userData.c4helm.visible=!!on;if(on)setHat(0);else setHat(S.pledged)}
function c4Ball(){if(C4FB.ball)return C4FB.ball;const g=new THREE.Group(),b=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),mt(0x7a3e1c,.55));b.scale.set(1,.62,.62);g.add(b);const l=new THREE.Mesh(bgeo(.1,.012,.03),bm(0xf6f6f0));l.position.y=.078;g.add(l);g.traverse(o=>{o.userData.noMerge=1;o.castShadow=true});sc.add(g);g.visible=false;return C4FB.ball=g}
function c4Roster(def){c4Off('fb');const F=C4FB;F.def=def;F.o={};F.d=[];const dh=def==='wolves'?'wolves':'scout',hc={hawks:0xb81f2e,wolves:0x1f5a3a,scout:0x8a8d92};
  const mk=(nm,house,sc,tit,k)=>{const n=c4Pup('athletes',STAD.cx,STAD.cz,0,{tag:'fb',name:nm,title:tit,house,scale:sc,lvl:7,v:5,pants:house==='wolves'?0x1f5a3a:0xf2f2ee});c4Helmet(n.g,hc[house]);n.fbk=k;n.fb={u:0,v:0,hist:[]};return n};
  F.o.c=mk('Lou Ferraro','hawks',1.18,'Center','c');F.o.lg=mk('Tommy Nguyen','hawks',1.16,'Left Guard','lg');F.o.rg=mk('Reggie Holt','hawks',1.16,'Right Guard','rg');
  F.o.rb=mk('Marcus Booker','hawks',1.1,'Running Back','rb');F.o.r1=mk('Deion Carter','hawks',1,'Wide Receiver','r1');F.o.r2=mk('Kendrick Hayes','hawks',1,'Wide Receiver','r2');F.o.r3=mk('Cole Brandt','hawks',1.08,'Tight End','r3');
  const nm=def==='wolves'?['#91 Okafor','#55 Brandt','#97 Kessler','#44 Dunleavy','#52 Ruiz','#21 Mills','#3 Grayson','#28 Pope']:['Scout 90','Scout 72','Scout 95','Scout 41','Scout 50','Scout 24','Scout 2','Scout 31'];
  ['dl1','dl2','dl3','lb1','lb2','cb1','cb2','s'].forEach((k,i)=>F.d.push(mk(nm[i],dh,k[0]==='d'?1.17:k[0]==='l'?1.08:1,def==='wolves'?'Cedar Valley Wolves':'Scout team',k)));
  c4Ball();if(!F.rings.length)for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.RingGeometry(.55,.75,24),new THREE.MeshBasicMaterial({color:0x7fe07a,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-PI/2;r.userData.noMerge=1;r.visible=false;sc.add(r);F.rings.push(r)}}
const c4All=()=>[...Object.values(C4FB.o),...C4FB.d];
function c4FbSet(n,u,v,a){n.fb.u=u;n.fb.v=v;n.fb.su=u;n.fb.sv=v;n.fb.hist=[[0,u,v]];n.fb.wp=0;n.fb.slip=0;n.fb.vu=n.fb.vv=0;const[x,z]=c4F(u,v);n.x=x;n.z=z;c4To(n,x,z);n.pup.face=a;n.pup.look=null;n.pup.lie=0;n.pup.lean=0;n.pup.st='';n.pup.sp=0;if(n.g)n.g.rotation.y=a}
function c4Form(los){const F=C4FB,u0=c4YU(los),fwd=c4A(1,0),back=c4A(-1,0);F.u0=u0;F.los=los;const o=F.o;
  c4FbSet(o.c,u0-.45,0,fwd);c4FbSet(o.lg,u0-.6,-1.05,fwd);c4FbSet(o.rg,u0-.6,1.05,fwd);c4FbSet(o.rb,u0-3.4,-1.3,fwd);c4FbSet(o.r1,u0-.6,-10.5,fwd);c4FbSet(o.r2,u0-.9,7.5,fwd);c4FbSet(o.r3,u0-.7,2.4,fwd);
  const D={dl1:[.75,-1.5],dl2:[.75,.1],dl3:[.75,1.6],lb1:[4,-3.2],lb2:[4,3.2],cb1:[3.8,-10.5],cb2:[3.5,7.5],s:[10.5,0]};for(const n of F.d){const[du,v]=D[n.fbk];c4FbSet(n,u0+du,v,back)}
  F.q={u:u0-3.2,v:0};const[qx,qz]=c4F(F.q.u,0);c4DanAt(qx,qz,fwd);C4.dan.y=null;F.hold='spot';F.carrier=null;F.air=null;const b=c4Ball();b.visible=true;b.position.set(...c4P3(u0-.12,0,.12));b.rotation.set(0,c4A(1,0)+PI/2,0)}
// the scoreboard (top of the screen)
function c4Board(st){let e=$('c4sb');if(!st){if(e)e.hidden=true;return}if(!e){e=document.createElement('div');e.id='c4sb';e.style.cssText='position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:34;display:flex;gap:0;border-radius:10px;overflow:hidden;font:800 15px Archivo,Arial,sans-serif;color:#fff;box-shadow:0 4px 18px #0009;pointer-events:none';document.body.appendChild(e)}
  e.hidden=false;const sg=st.los>50?'CV '+(100-st.los):st.los<50?'OWN '+st.los:'50',dd=st.down?`${['','1ST','2ND','3RD','4TH'][st.down]} & ${st.first>=100?'GOAL':Math.max(1,Math.round(st.first-st.los))}`:'',clk=Math.floor((st.clock||0)/60)+':'+String(Math.floor((st.clock||0)%60)).padStart(2,'0');
  e.innerHTML=`<span style="background:#b81f2e;padding:6px 12px">HAWKS ${st.sc[0]}</span><span style="background:#1f5a3a;padding:6px 12px">WOLVES ${st.sc[1]}</span><span style="background:#1d1d22;padding:6px 12px">Q${st.q||1} ${clk}</span>`+(dd?`<span style="background:#e2b64c;color:#1d1d22;padding:6px 12px">${dd} · ${sg}</span>`:'')}
// floating number badges over the receivers (projected from 3D every frame)
function c4Tags(on){const F=C4FB;if(on&&!F.tags.length)for(let i=0;i<3;i++){const d=document.createElement('div');d.style.cssText='position:fixed;z-index:32;transform:translate(-50%,-100%);padding:2px 8px;border-radius:8px;font:800 14px Archivo,Arial,sans-serif;color:#1d1d22;background:#7fe07a;pointer-events:none;white-space:nowrap';d.hidden=true;document.body.appendChild(d);F.tags.push(d)}
  if(!on)for(const d of F.tags)d.hidden=true;F.tagsOn=!!on}
const _c4v=new THREE.Vector3();
function c4TagsUpd(){const F=C4FB;if(!F.tagsOn)return;C4RCV.forEach(([k,nm],i)=>{const n=F.o[k],d=F.tags[i],r=F.rings[i];if(!n||!d)return;_c4v.set(n.x,n.y+2.35,n.z).project(cam);const vis=_c4v.z<1&&Math.abs(_c4v.x)<1.1&&Math.abs(_c4v.y)<1.1;d.hidden=!vis;
  const sep=n.fb.sep||0,col=F.cover?'#e05a4a':sep>=2.2?'#7fe07a':sep>=1.4?'#f2d24a':'#e05a4a';if(vis){d.style.left=((_c4v.x+1)/2*innerWidth)+'px';d.style.top=((1-_c4v.y)/2*innerHeight)+'px';d.style.background=col;d.textContent=(i+1)+' '+nm.split(' ')[0].toUpperCase()+(F.cover?' · COVERED':'')}
  if(r){r.visible=true;r.position.set(n.x,n.y+.04,n.z);r.material.color.set(col)}})}
function c4Hist(n,t){const h=n.fb.hist;for(let i=h.length-1;i>=0;i--)if(h[i][0]<=t)return h[i];return h[0]}
// one snap, start to whistle. resolves {kind, gain}
async function c4Snap(st,cfg){const F=C4FB;c4Form(st.los);F.phase='pre';F.res=null;F.t=0;F.ts=1;F.cover=0;F.k={};c4Board(st);c4Follow(null);
  c4ShotF(F.u0-10.5,0,6.4,F.u0+7,0,.4,st.n?2.2:0);st.n=(st.n||0)+1;await c1Wait(.5);
  let pk=cfg.force;if(!pk&&C4.auto)pk=cfg.plays[(st.n||0)%Math.min(3,cfg.plays.length)];if(!pk){pk=await new Promise(res=>{const ui=c4Ui('<div style="margin-bottom:2px">'+(cfg.call||'Call the play (1–4)')+'</div>');cfg.plays.forEach((k,i)=>ui.appendChild(c4Btn((i+1)+' · '+C4PLAYS[k].n,()=>res(k))));
    C4.keys=(code,dn)=>{if(!dn)return;const m=/^(Digit|Numpad)([1-9])$/.exec(code);if(m&&cfg.plays[+m[2]-1])res(cfg.plays[+m[2]-1])}})}
  C4.keys=null;c4Ui(null);F.pk=pk;F.play=C4PLAYS[pk];F.cfg=cfg;
  const cad=pick(['Blue 42! Blue 42!','Red 19! Red 19!','Omaha! Omaha!','Hawk 7! Hawk 7!']);c1Sub('Danny',cad);await c1Wait(.75);c1Sub('Danny','Set… HUT!');tone(300,.06,'square',.06);await c1Wait(.3);c1Sub(null);
  // the snap: the ball goes back to Danny
  F.phase='play';F.t=0;F.hold='qb';F.thrown=0;F.scram=0;c4Tags(!F.play.run);
  c4Follow((tp,tl)=>{const b=c4Ball().position,[bu,bv]=c4UV(b.x,b.z),y=c4FY(),lu=Math.max(bu,F.u0-2),[x,z]=c4F(lu-9.5,bv*.55),[lx,lz]=c4F(lu+4,bv*.8);tp.set(x,y+6,z);tl.set(lx,y+.6,lz)},2.6);
  if(!F.play.run){const ui=c4Ui('<div style="margin-bottom:2px">'+(cfg.tip||'Throw to an open man: <b>1</b> <b>2</b> <b>3</b> · move with <b>WASD</b>')+'</div>');if(!cfg.noThrow)C4RCV.forEach(([k,nm],i)=>ui.appendChild(c4Btn((i+1)+' · '+nm.split(' ')[0],()=>c4Throw(i))))}
  C4.keys=(code,dn,ev)=>{F.k[code]=dn;if(!dn||ev.repeat)return;const m=/^(Digit|Numpad)([1-3])$/.exec(code);if(m&&!F.play.run)c4Throw(+m[2]-1);if((code==='Space'||code==='KeyE')&&F.onSpace)F.onSpace()};
  const r=await new Promise(res=>{F.done=res});C4.keys=null;c4Ui(null);c4Tags(0);for(const g of F.rings)g.visible=false;return r}
function c4Throw(i){const F=C4FB;if(F.phase!=='play'||F.hold!=='qb'||F.t<.45)return;if(F.cover||F.cfg&&F.cfg.noThrow){c1Sub('Danny',pick(['Covered…','Nobody\'s open!','Come on, come on…']));return}const k=C4RCV[i][0],n=F.o[k];if(!n)return;
  const qd=Math.hypot(n.fb.u-F.q.u,n.fb.v-F.q.v),tf=.28+qd/17,lu=n.fb.u+n.fb.vu*tf,lv=clamp(n.fb.v+n.fb.vv*tf,-STAD.hw+.5,STAD.hw-.5);
  F.hold='air';F.air={t:0,tf,a:[F.q.u,F.q.v],b:[lu,lv],h:.9+qd*.07,to:n};F.thrown=1;if(C4.dan){C4.dan.st='throw';setTimeout(()=>{if(C4.dan&&C4.dan.st==='throw')C4.dan.st=''},380)}tone(520,.05,'triangle',.05)}
function c4Dead(kind,gain,text){const F=C4FB;if(F.phase!=='play')return;F.phase='dead';F.res={kind,gain};(F.log=F.log||[]).push(F.pk+':'+kind+':'+Math.round(gain||0)+':t'+F.t.toFixed(1));sfx('whistle');if(text)big(text,1500);setTimeout(()=>{const d=F.done;F.done=null;F.phase='';d&&d(F.res)},1700)}
function c4Mv(n,tu,tv,sp,dt){const f=n.fb,du=tu-f.u,dv=tv-f.v,d=Math.hypot(du,dv);if(f.slip>0){f.slip-=dt;f.vu=f.vv=0;return 0}if(d<.02){f.vu=f.vv=0;return 0}const s=Math.min(d,sp*dt);f.u+=du/d*s;f.v+=dv/d*s;f.vu=du/d*s/dt;f.vv=dv/d*s/dt;n.pup.face=c4A(du,dv);return s/dt}
function c4FbUpd(dt0){const F=C4FB;if(!F.on)return;const dt=Math.min(dt0,.05)*(F.ts||1),pl=F.play,u0=F.u0,o=F.o,hw=STAD.hw;if(F.phase==='play'){F.t+=dt;const t=F.t,cfg=F.cfg||{};
  // quarterback (Danny): drop back, then move with WASD
  const qsp=cfg.qsp||3.1;if(t<.6&&!pl.run){F.q.u=lerp(F.q.u,u0-4.3,Math.min(1,dt*5))}else if(F.hold!=='qbdown'){let mu=0,mv=0;const K4=F.k;if(K4.KeyW||K4.ArrowUp)mu+=1;if(K4.KeyS||K4.ArrowDown)mu-=1;if(K4.KeyA||K4.ArrowLeft)mv-=1;if(K4.KeyD||K4.ArrowRight)mv+=1;
    if(cfg.flipLR)mv=-mv;if(mu||mv){const l=Math.hypot(mu,mv);F.q.u=clamp(F.q.u+mu/l*qsp*dt,u0-9,u0-.6);F.q.v=clamp(F.q.v+mv/l*qsp*dt,-hw+.6,hw-.6);F.qm=(F.qm||0)+dt;if(F.onMove)F.onMove(mv)}}
  // receivers run their routes and remember where they were (defenders react late)
  for(const[k]of C4RCV){const n=o[k],f=n.fb,R=pl.rt&&pl.rt[k];if(F.carrier===n)continue;if(F.air&&F.air.to===n&&F.air.chase){c4Mv(n,F.air.b[0],F.air.b[1],5.6,dt);f.hist.push([t,f.u,f.v]);continue}
    if(R&&!pl.run){const s=Math.sign(f.sv)||1,w=R[Math.min(f.wp,R.length-1)],tu=Math.min(f.su+w[0],STAD.hl-1.2),tv=clamp(f.sv+s*w[1],-hw+.8,hw-.8);if(c4Mv(n,tu,tv,cfg.rsp||5.1,dt)<.01&&f.wp<R.length-1)f.wp++;else if(Math.hypot(tu-f.u,tv-f.v)<.25&&f.wp<R.length-1)f.wp++}
    else{c4Mv(n,f.su+Math.min(t*3,4),f.sv,3,dt)}f.hist.push([t,f.u,f.v]);if(f.hist.length>200)f.hist.shift()}
  // running back: blocks on a pass, takes the handoff on a run
  const rb=o.rb;if(pl.run){if(t>.42&&F.hold==='qb'){F.hold='rb';F.carrier=rb}if(F.carrier!==rb)c4Mv(rb,u0-1.2,.5,4.5,dt)}else if(F.carrier!==rb)c4Mv(rb,F.q.u+.7,F.q.v-1.1,3,dt);
  // the line: guards and center stay between their man and Danny
  const DL=F.d.filter(n=>n.fbk[0]==='d'),OL=[o.lg,o.c,o.rg];DL.forEach((d,i)=>{const ol=OL[i],dq=Math.hypot(F.q.u-d.fb.u,F.q.v-d.fb.v)||1,lost=t>(cfg.shed||2.7);if(!lost)c4Mv(ol,d.fb.u+(F.q.u-d.fb.u)/dq*.72,d.fb.v+(F.q.v-d.fb.v)/dq*.72,4,dt);else c4Mv(ol,ol.fb.u,ol.fb.v,0,dt)});
  // defenders
  const car=F.carrier;for(const d of F.d){const f=d.fb,k=d.fbk;if(f.down)continue;let tu,tv,sp;
    if(car){const cf=car===DANNY?F.q:car.fb,lead=.35;tu=cf.u+(cf.vu||0)*lead;tv=cf.v+(cf.vv||0)*lead;sp=k[0]==='d'?3.8:k==='s'?5.5:k[0]==='l'?5:5.3}
    else if(k[0]==='d'){const qx=F.q.u,qv=F.q.v;tu=qx;tv=qv;sp=t<(cfg.shed||2.7)*.6?.55:t<(cfg.shed||2.7)?1.7:(cfg.rush||3.6);if(pl.run&&t>.6){tu=rb.fb.u;tv=rb.fb.v;sp=2.2}}
    else if(k==='s'){const deep=C4RCV.map(([q])=>o[q]).sort((a,b)=>b.fb.u-a.fb.u)[0];tu=Math.max(u0+8,deep.fb.u+3.2);tv=deep.fb.v*.45;sp=4.6}
    else if(k==='lb2'){tu=u0+3.8;tv=clamp(F.q.v,-4,4);sp=3.5;if(pl.run&&t>(cfg.react||.6)){tu=rb.fb.u;tv=rb.fb.v;sp=4.7}}
    else{const r=o[k==='cb1'?'r1':k==='cb2'?'r2':'r3'],h=c4Hist(r,t-(cfg.lag!=null?cfg.lag:.5)),s=Math.sign(r.fb.sv)||1;tu=h[1]+(cfg.cush!=null?cfg.cush:.7);tv=h[2]-s*.35;sp=(cfg.dsp||4.85)*(k==='lb1'?.92:1);if(pl.run&&t>(cfg.react||.6)&&k==='lb1'){tu=rb.fb.u;tv=rb.fb.v;sp=4.6}}
    c4Mv(d,tu,tv,sp,dt)}
  // openness: how far is each receiver from the nearest defender in coverage
  for(const[k]of C4RCV){const n=o[k];let m=99;for(const d of F.d){if(d.fbk[0]==='d')continue;m=Math.min(m,Math.hypot(d.fb.u-n.fb.u,d.fb.v-n.fb.v))}n.fb.sep=m}
  // the ball
  const ball=c4Ball();if(F.hold==='qb'){const[x,z]=c4F(F.q.u+.25,F.q.v+.2);ball.position.set(x,c4FY()+1.25,z);
      for(const d of DL)if(Math.hypot(d.fb.u-F.q.u,d.fb.v-F.q.v)<.75){F.hold='qbdown';c4Tackle(DANNY,d);c4Dead('sack',c4UY(F.q.u)-F.los,'SACKED');break}}
    else if(F.air){const A=F.air;A.t+=dt;const k=clamp(A.t/A.tf,0,1),u=lerp(A.a[0],A.b[0],k),v=lerp(A.a[1],A.b[1],k),[x,z]=c4F(u,v);ball.position.set(x,c4FY()+1.25+Math.sin(k*PI)*A.h-k*.15,z);ball.rotation.y=c4A(A.b[0]-A.a[0],A.b[1]-A.a[1])+PI/2;
      if(k>=1){F.air=null;const r=A.to,dr=Math.hypot(r.fb.u-A.b[0],r.fb.v-A.b[1]),sep=r.fb.sep,p=A.sure?1:dr>2.1?0:(sep>=2.2?.95:sep>=1.4?.78:sep>=.8?.42:.12)+(cfg.bonus||0);
        if(rnd()<p){F.carrier=r;F.hold='rcv';sfx('ok');if(A.td)r.pup.lean=-.35}else if(sep<1&&dr<2.1&&!cfg.noInt&&rnd()<.3){F.hold='dead';c4Dead('int',0,'INTERCEPTED')}else{F.hold='ground';c4Dead('inc',0,'INCOMPLETE')}}}
    else if(F.hold==='ground'){ball.position.y=Math.max(c4FY()+.1,ball.position.y-dt*6)}
  // the ball carrier runs for daylight
  if(F.carrier&&F.carrier!==DANNY&&F.phase==='play'){const c=F.carrier,cf=c.fb;let near=null,nd=99;for(const d of F.d){if(d.fb.down)continue;const q=Math.hypot(d.fb.u-cf.u,d.fb.v-cf.v);if(q<nd){nd=q;near=d}}
    const dodge=near&&nd<5?-Math.sign(near.fb.v-cf.v||1)*.6:0;c4Mv(c,cf.u+3,clamp(cf.v+dodge,-hw+.3,hw-.3),c===o.rb?5:5.2,dt);const[x,z]=c4F(cf.u+.2,cf.v);ball.position.set(x,c4FY()+1.05,z);
    if(cf.u>=c4GL()){c4Dead('td',100-F.los,'TOUCHDOWN!');c.pup.st='wave'}else if(Math.abs(cf.v)>=hw-.35){c4Dead('oob',c4UY(cf.u)-F.los,'OUT OF BOUNDS')}
    else if(near&&nd<.72){if(!c.fb.broke&&rnd()<.2&&!cfg.noBreak){c.fb.broke=1;near.fb.slip=.9;near.pup.lie=.7;setTimeout(()=>{if(near.pup)near.pup.lie=0},900)}else{c4Tackle(c,near);const g=c4UY(cf.u)-F.los;c4Dead(c===o.rb?'run':'catch',g,(g>=0?'+':'')+Math.round(g)+' YARDS')}}}
  if(C4.auto&&F.hold==='qb'&&!pl.run&&!cfg.noThrow&&t>1.15){let bi=0,bs=-1;C4RCV.forEach(([k],i)=>{if(o[k].fb.sep>bs){bs=o[k].fb.sep;bi=i}});if(bs>1.6||t>2.2)c4Throw(bi)}
  if(F.onTick)F.onTick(dt,t)}
  // put everyone where the sim says
  if(F.phase==='play'||F.phase==='dead'){for(const n of c4All()){if(!n.fb||!NP.includes(n))continue;const[x,z]=c4F(n.fb.u,n.fb.v);n.x=x;n.z=z;c4To(n,x,z);n.pup.sp=Math.hypot(n.fb.vu||0,n.fb.vv||0)*(F.ts||1)}
    const[qx,qz]=c4F(F.q.u,F.q.v);if(C4.dan){C4.dan.tx=qx;C4.dan.tz=qz;P.x=qx;P.z=qz;C4.dan.sp=F.phase==='play'?3:0;if(F.hold==='qb'||F.hold==='air')C4.dan.face=c4A(1,F.q.v*-.05)}}
  if(F.phase!=='play'){for(const n of c4All())if(n.fb){n.fb.vu=n.fb.vv=0}}
  c4TagsUpd()}
function c4Tackle(c,d){const n=c===DANNY?null:c;if(n&&n.pup){n.pup.lie=1;setTimeout(()=>{if(n.pup)n.pup.lie=0},1500)}else if(C4.dan){C4.dan.lean=-1.2;C4.dan.dy=.15;setTimeout(()=>{if(C4.dan){C4.dan.lean=0;C4.dan.dy=0}},1500)}if(d&&d.pup){d.pup.lie=.85;setTimeout(()=>{if(d.pup)d.pup.lie=0},1500)}noise(.12,.15,300)}
// a series of downs. cfg.goal(st,r) returns 'win' / 'fail' / null after every play
async function c4Drive(st,cfg){C4FB.on=1;for(;;){const r=await c4Snap(st,cfg);let g=r.gain||0;if(r.kind==='inc'||r.kind==='int')g=0;st.clock=Math.max(0,(st.clock||900)-(cfg.tick||32));
    if(r.kind==='td'){st.los=100}else if(r.kind!=='int'){st.los=clamp(Math.round(st.los+g),1,99);if(st.los>=st.first){st.down=1;st.first=Math.min(100,st.los+10);big('FIRST DOWN',1200);c4Roar(.07,1.2)}else st.down++}
    c4Board(st);const v=cfg.goal(st,r);if(v)return v;if(r.kind==='int'||st.down>4){return 'fail'}await c1Wait(.6)}}
// a play drawn on a whiteboard before practice reps
function c4PlayCard(k){const p=C4PLAYS[k],c=document.createElement('canvas');c.width=360;c.height=200;const q=c.getContext('2d');q.fillStyle='#f4f4f0';q.fillRect(0,0,360,200);q.strokeStyle='#c8c8c0';for(let y=20;y<200;y+=30){q.beginPath();q.moveTo(0,y);q.lineTo(360,y);q.stroke()}
  const X=v=>180+v*9,Y=u=>170-u*5.2;q.lineWidth=3;q.strokeStyle='#1d1d22';q.beginPath();q.moveTo(0,Y(0));q.lineTo(360,Y(0));q.stroke();
  const O=[['c',-.45,0],['lg',-.6,-1.05],['rg',-.6,1.05],['rb',-3.4,-1.3],['r1',-.6,-10.5],['r2',-.9,7.5],['r3',-.7,2.4],['qb',-3.2,0]];q.font='bold 12px Arial';
  for(const[kk,u,v]of O){q.strokeStyle=kk==='qb'?'#b81f2e':'#1d1d22';q.beginPath();q.arc(X(v),Y(u),7,0,TAU);q.stroke()}
  q.strokeStyle='#b81f2e';q.lineWidth=2.5;if(p.rt)for(const[kk,u,v]of O){const R=p.rt[kk];if(!R)continue;const s=Math.sign(v)||1;q.beginPath();q.moveTo(X(v),Y(u));for(const[du,dv]of R)q.lineTo(X(v+s*dv),Y(u+du));q.stroke()}
  if(p.run){q.beginPath();q.moveTo(X(-1.3),Y(-3.4));q.lineTo(X(.5),Y(-1));q.lineTo(X(.5),Y(10));q.stroke()}
  q.fillStyle='#1d1d22';q.font='bold 16px Archivo,Arial';q.fillText(p.n,10,20);return c}

// ================================================================ scenes
// ---- the new chapters on Greek Row (chapter 4 opening)
/* V366 Homecoming week runs Thursday to Saturday, as the plan board and everyone in the story says (kickoff Thursday 6 PM, the Games Friday 2 PM,
   the party Friday 10 PM, the game Saturday 3 PM). Chapter 4 opens on the next Thursday morning so the calendar matches. */
function c4ToThursday(){const dw=(S.day-1)%7;if(dw===4&&S.gt<15)return;let k=(4-dw+7)%7;if(k===0)k=7;for(let i=0;i<k;i++){S.day++;try{newDay()}catch(e){}}S.gt=9}
CHSCENE[4]=async function(){c4ToThursday();c4Apply(1);const fade=$('fade');fade.style.opacity=1;await c4Sl(500);endScene();C1.act=[];if(P.inside)goOut(81,76);c4CamOn();
  const g=c4Dup('grant',...c3Free(84.6,74.6),-PI/2,{pup:1,tag:'intro'}),tk=c4Dup('tank',...c3Free(84.4,77.4),-PI/2,{pup:1,tag:'intro'});c4DanAt(...c3Free(80.8,76.2),PI/2);
  c4Shot([66,7,24],[50,5,31],0);fade.style.opacity=0;big('CHAPTER 4',2400);await c4Wt(1.4);
  const lines=[['kto','Delta Tau Omega! Now rushing!'],['opd','ΒΛΕ. We\'re new. We\'re legit.'],['kan','Sigma Delta Rho! Free wings Thursday!'],['gwz','Gamma Gamma Eta. Yes. Two gammas.']];
  for(const[id,t]of lines){const b=B.find(b=>b.id===id),[fx,fz]=fpos(b,b.face,b.da-2,17),[lx,lz]=fpos(b,b.face,b.da-2,2),n=C4.frN.find(n=>n.title&&n.title.endsWith('President')&&n.house===C4FR.find(r=>r[0]===id)[1]);
    c4Shot([fx,7,fz],[lx,4.5,lz],1.4);await c4Wt(.9);if(n){c1Say(n,t,2.6);try{animP(n.g,0,TT,'wave')}catch(e){}}await c4Wt(2.4)}
  c1Sub(null);c4Shot([75.5,3.2,73.5],[84.5,1.7,76],1.6);await c4Wt(1.2);$('cineskip').hidden=true;CINE.hold=1;
  await c1Line(g,'Four houses go dark and four new ones open in the same buildings before the tape hits the ground. Greek Row grows back like a weed.');
  await c1Line(tk,'Homecoming\'s Saturday, man. Whole campus is gonna be at Nippert.');
  await c1Line(g,'Homecoming week. Every house gets paired with a sorority. Games all Friday, the biggest party of the year, and the Cup goes on somebody\'s mantel. Ours.');
  await c1Line(g,'Our pairing comes in today. Come find me in the throne room when you\'re ready, Danny.');
  if(CINE)CINE.hold=0;fade.style.opacity=1;await c4Sl(450);c4Off('intro');c4CamOff();P.x=81;P.z=76;P.face=PI/2;yaw=-PI/2;fade.style.opacity=0;toast('Chapter 4: Homecoming. Talk to Grant in the throne room.',5200);saveGame()};

// ---- quest a: the sorority on its lawn
function c4SoroSpot(out=5.5,da=0){const so=c4Soro(),b=so.b;return b?c3Free(...fpos(b,b.face,b.da+da,out)):[SPOT.DLP[0],SPOT.DLP[1]]}
function c4SoroCast(on){if(!on){c4Off('soro');return}if(C4.cast[c4Soro().pres]&&c4Live(C4.cast[c4Soro().pres]))return;const so=c4Soro(),b=so.b;if(!b)return;const[fx,fz]=fpos(b,b.face,b.da,30);
  const[px,pz]=c4SoroSpot(5.5);c4Person('sororities',px,pz,Math.atan2(fx-px,fz-pz),{tag:'soro',name:so.pres,title:so.L+' President',house:so.id,fem:true,lvl:9,int:null});
  C4LAWN().forEach((nm,i)=>{const[x,z]=i<4?c4SoroSpot(7.2+(i%2)*1.4,[-4.2,-2.4,2.6,4.4][i]):c4SoroSpot(9.8,[-3.3,.2,3.5][i-4]);c4Person('sororities',x,z,Math.atan2(px-x,pz-z),{tag:'soro',name:nm,title:so.L,house:so.id,fem:true,lvl:5,int:null})})}
const c4MeetN=()=>C4LAWN().filter((_,i)=>c4S().met[i]===1).length;
const c4MeetLab=()=>'\nCharm four of the sisters on the lawn ('+c4MeetN()+'/4)\n'+C4LAWN().map((n,i)=>(c4S().met[i]===1?'✓ ':c4S().met[i]===-1?'✗ ':'○ ')+n).join('\n');
const c4MeetOk=()=>c4MeetN()>=4;
function c4MeetGoal(){const s=c4S(),L=C4LAWN();let best=null,bd=1e9;for(let i=0;i<L.length;i++){if(s.met[i])continue;const n=C4.cast[L[i]];if(c4Live(n)){const d=Math.hypot(n.x-P.x,n.z-P.z);if(d<bd){bd=d;best=[n.x,n.z]}}}return best}
function c4Intro(i){const s=c4S(),so=c4Soro(),ex=i>=4,M_=ex?C4MEX[i-4]:C4MEM[i],[nm,line,rep]=M_,n=C4.cast[nm];if(!c4Live(n))return;
  const bad=ex?M_[3]:C4BAD[i],good=ex?M_[4]:'"Danny Kowalski. ΑΣΡ pledge. Nice to meet you."';
  const win=()=>{c4MeetCheck();updObj()},ch=[[good,()=>{s.met[i]=1;bubble(n,pick(['Cute.','Nice to meet you too, Danny.','Polite! Okay!']),2.4);win()}],[rep,()=>{s.met[i]=1;bubble(n,pick(['Ha!','Okay, I like him.','He\'s funny. Is he funny?']),2.4);stand(1);win()}],
    [bad[0],()=>{s.met[i]=-1;bubble(n,bad[1].replace(/^"|"$/g,'').replace(/" She.*$/,''),3);n.a+=PI*.8;sfx('bad');stand(-1);toast(nm.split(' ')[0]+' is done talking to you. Try another sister.',2600);win()}]];
  for(let k=ch.length-1;k>0;k--){const r=(i*7+k*3+S.day)%(k+1),t=ch[k];ch[k]=ch[r];ch[r]=t}
  card({title:'Welcome to Homecoming',sp:nm+' · '+so.L,text:line,focus:n,ch})}
/* if Danny has put off so many sisters that four can't be charmed any more, they forget and he can try again */
function c4MeetCheck(){const s=c4S(),L=C4LAWN();let ok=0,open=0;L.forEach((_,i)=>{if(s.met[i]===1)ok++;else if(!s.met[i])open++});if(ok<4&&ok+open<4){L.forEach((_,i)=>{if(s.met[i]===-1)s.met[i]=0});setTimeout(()=>toast('The sisters huddle, roll their eyes, and decide to give you one more chance.',3600),1200)}}
// follow Grant wherever he is (in the house, on the field)
function c4ToGrant(label,act,extra={}){return go([0,0],label,Object.assign({press:1,act,r:3.6,goal:()=>{const g=C4.cast['Grant Ashby']&&c4Live(C4.cast['Grant Ashby'])?C4.cast['Grant Ashby']:NN.grant;return g?(g.int||null)===(P.inside||null)?[g.x,g.z]:c3Route({int:g.int||null,x:g.x,z:g.z}):null},
  tick:()=>{const st=curStep(),g=C4.cast['Grant Ashby']&&c4Live(C4.cast['Grant Ashby'])?C4.cast['Grant Ashby']:NN.grant;if(st&&g&&(g.int||null)===(P.inside||null)){st.x=g.x;st.z=g.z}else if(st){st.x=1e5;st.z=1e5}}},extra))}

// ---- quest b: kickoff night at Nippert
function c4Team(tag,u,v,list,face){return list.map(([cl,o],i)=>{const[x,z]=c4F(u+(i%3-1)*1.3+(rnd()-.5)*.3,v+Math.floor(i/3)*1.2);return c4Pup(cl,x,z,face!=null?face:c4A(0,-1),Object.assign({tag},o))})}
function c4KickCast(on){c4Off('kick');if(!on)return;const so=c4Soro(),F0=c4A(0,-1);C4.kickG=[];
  const em=c4Pup('studentgov',...c4F(-1,-12.4),c4A(0,1),{tag:'kick',name:'Kayla Brooks',title:'Homecoming Emcee',fem:true,y:c4FY()+.5,lvl:6});
  const lines={dto:'ΔΤΩ! ΔΤΩ! ΔΤΩ!',ble:'Beta Lambda, baby!',sdr:'ΣΔΡ runs this Row!',gge:'Two gammas! One eta!'};
  [[-15,-3.5],[-8.5,1.5],[9,1.5],[15.5,-3.5]].forEach(([u,v],i)=>{const r=C4FR[i],ppl=c4Team('kick',u,v,[[r[4],{house:r[1],name:r[7],title:r[2]+' President'}],[r[4],{house:r[1],name:pick(MN)+' '+r[2],title:r[3]}],[r[4],{house:r[1],name:pick(MN)+' '+r[2],title:r[3]}],[r[4],{house:r[1],name:pick(MN)+' '+r[2],title:r[3]}]],F0);C4.kickG.push({ppl,lead:ppl[0],line:lines[r[1]],u,v})});
  const[gx,gz]=c4F(1.2,-7.4);C4.kickG.asr=[c4Dup('grant',gx,gz,F0,{pup:1,tag:'kick'}),c4Dup('tank',...c4F(2.6,-7.2),F0,{pup:1,tag:'kick'}),c4Dup('owen',...c4F(.1,-6.4),F0,{pup:1,tag:'kick'})];
  C4.kickG.soro=c4Team('kick',5.5,-7.4,[['sororities',{house:so.id,name:so.pres,title:so.L+' President',fem:true}],...C4MEM.map(([nm])=>['sororities',{house:so.id,name:nm,title:so.L,fem:true}])],F0);
  c4DanAt(...c4F(2,-8.6),c4A(0,-1))}
async function c4Kickoff(done){const so=c4Soro();try{
  await c4Fade(async()=>{if(P.inside)goOut(...c4F(-27,-3));c4At(18);c4StandsOn(1);c4KickSet(1);c4Band(1);c4KickCast(1);c4CamOn();c4ShotF(-34,-30,24,2,0,0,0);c4Hype(.4)});
  big('HOMECOMING KICKOFF',2800);c4Roar(.1,2.6);c4ShotF(-22,-24,13,6,-2,0,.3);await c4Wt(3.6);
  const em=C4.cast['Kayla Brooks'];c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,1.6);await c4Wt(1.1);$('cineskip').hidden=true;
  await c1Line(em,'HARROWGATE! Welcome to HOMECOMING WEEK!');c4Hype(1);c4Roar(.15,2.6);{const[x,z]=c4F(0,-5);c4Confetti(x,c4FY(),z,600,14)}await c4Wt(1.8);c4Hype(.3);
  await c1Line(em,'Four brand-new chapters on Greek Row this year! Make some noise for Delta Tau Omega, Beta Lambda Epsilon, Sigma Delta Rho and Gamma Gamma Eta!');
  for(const G of C4.kickG){c4ShotF(G.u+1,G.v-5.5,2.4,G.u,G.v,1.4,1.8);await c4Wt(.6);c1Say(G.lead,G.line,2.2);for(const n of G.ppl)n.pup.st='wave';await c4Wt(1.9);for(const n of G.ppl)n.pup.st=''}
  c1Sub(null);c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,1.6);await c4Wt(.6);
  await c1Line(em,`And the Greek Games pairings! Our new chapters drew our new chapters, and the old guard drew… Alpha Sigma Rho and ${so.name}!`);
  c4ShotF(3.4,-2.5,2.1,3.4,-7.4,1.5,1.8);await c4Wt(.4);const gr=C4.kickG.asr[0],pr=C4.kickG.soro[0];for(const n of[...C4.kickG.asr,...C4.kickG.soro])n.pup.st='wave';c1Say(gr,'THAT\'S US! THAT\'S US!',2);c4Roar(.08,1.4);await c4Wt(1.8);c1Say(pr,'Try to keep up, boys.',2.2);await c4Wt(2.2);for(const n of[...C4.kickG.asr,...C4.kickG.soro])n.pup.st='';c1Sub(null);
  c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,1.6);await c4Wt(.5);
  await c1Line(em,'The Games start tomorrow at two, right here! The relay! Tug-of-war! The partner challenge! And the winners take home… the HOMECOMING CUP!');
  if(C4.cup){const p=new THREE.Vector3();C4.cup.getWorldPosition(p);c4Shot([p.x+STAD.vx*2.2,p.y+.8,p.z+STAD.vz*2.2],[p.x,p.y+.5,p.z],2)}await c4Wt(2.4);
  c4ShotF(0,14,9,0,-10,6,1.2);c4Hype(1);for(let i=0;i<7;i++){const[x,z]=c4F(-24+i*8,-30+(i%2)*60);c4Firework(x,c4FY()+28+rnd()*8,z);await c4Wt(.38)}c4Roar(.12,2.2);await c4Wt(1.2);c4Hype(.3);
  c4ShotF(1.4,-10.5,2.2,1.4,-7.4,1.6,2);await c4Wt(.8);
  await c1Line(gr,'See that Cup? It goes on our mantel, right where the Old Guard\'s portrait used to hang. Tomorrow you run, you pull, and you do not drop anything.');
  }catch(e){console.warn('c4Kickoff',e)}done()}
// ---- Friday afternoon: the Games
function c4GamesScene(){if(c4Live(C4.cast['Derek Vance'])&&C4.cast['Derek Vance'].c4tag==='games')return;c4Off('games');const so=c4Soro(),F0=c4A(0,-1),side=-9;C4.gm={};
  C4.gm.grant=c4Dup('grant',...c4F(-1.5,side),F0,{pup:1,tag:'games'});C4.gm.tank=c4Dup('tank',...c4F(-.2,side-.6),F0,{pup:1,tag:'games'});
  C4.gm.em=c4Pup('studentgov',...c4F(-1,-12.4),c4A(0,1),{tag:'games',name:'Kayla Brooks',title:'Homecoming Emcee',fem:true,y:c4FY()+.5});
  C4.gm.pres=c4Pup('sororities',...c4F(2.5,side),F0,{tag:'games',name:so.pres,title:so.L+' President',house:so.id,fem:true,lvl:9});
  C4.gm.mem=C4MEM.map(([nm],i)=>c4Pup('sororities',...c4F(3.8+i*1.2,side-.3*(i%2)),F0,{tag:'games',name:nm,title:so.L,house:so.id,fem:true,lvl:5}));
  const fr=r=>({house:r[1],title:r[3]});const[dto,ble,sdr,gge]=C4FR;
  C4.gm.dto=[c4Pup(dto[4],...c4F(-12,side),F0,Object.assign(fr(dto),{tag:'games',name:'Derek Vance',title:'ΔΤΩ President',lvl:8}))];for(let i=0;i<4;i++)C4.gm.dto.push(c4Pup(dto[4],...c4F(-13.2-i*1.1,side-.4*(i%2)),F0,Object.assign(fr(dto),{tag:'games',name:pick(MN)+' (ΔΤΩ)',lvl:6})));
  C4.gm.other=[ble,sdr,gge].map((r,j)=>[0,1].map(i=>c4Pup(r[4],...c4F(-21+j*3.2+i*1.1,side-.3*i),F0,Object.assign(fr(r),{tag:'games',name:(i?pick(MN):r[7])+' ('+r[2]+')',lvl:5}))));
  // relay runners: leg one at the start, anchors waiting at the far line
  C4.gm.leg=[C4.gm.dto[1],C4.gm.other[0][0],C4.gm.other[1][0]];C4.gm.anc=[C4.gm.dto[2],C4.gm.other[0][1],C4.gm.other[1][1]];
  [0,2,3].forEach((l,i)=>{const n=C4.gm.leg[i],[x,z]=c4F(C4RU0,C4LANE[l]);n.x=x;n.z=z;c4To(n,x,z);c4Face(n,c4A(1,0));const a=C4.gm.anc[i],[ax,az]=c4F(C4RU1+.8,C4LANE[l]);a.x=ax;a.z=az;c4To(a,ax,az);c4Face(a,c4A(-1,0))});
  const m=C4.gm.mem[0],[mx,mz]=c4F(C4RU1+.8,C4LANE[1]);m.x=mx;m.z=mz;c4To(m,mx,mz);c4Face(m,c4A(-1,0))}
async function c4GamesDay(done){const so=c4Soro();try{
  await c4Fade(async()=>{c4Band(0);c4KickCast(0);if(S.gt<14)S.gt=14;c4Hype(.15);c4GamesSet(1);c4GamesScene();if(!C4.cam)c4CamOn();c4DanAt(...c4F(-2.5,-7.6),c4A(0,-1));c4ShotF(-30,-18,9,0,0,0,0)});
  big('FRIDAY · THE GREEK GAMES',2600);c4ShotF(-14,-16,6,-2,-6,1,.5);await c4Wt(2.6);const em=C4.gm.em,g=C4.gm.grant;
  c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,1.6);await c4Wt(.8);$('cineskip').hidden=true;
  await c1Line(em,'Event one: the relay! Fifty yards out, fifty yards back! Runners, find your lanes!');
  await c1Line(g,'First leg is yours. Madison runs it home. Hold Shift, run in a straight line, and do not look behind you. Delta Tau Omega looks behind them.');
  }catch(e){console.warn('c4GamesDay',e)}await c4Fade(async()=>{c4CamOff();const[x,z]=c4F(C4RU0-1.8,C4LANE[1]);P.x=x;P.z=z;P.y=terrH(x,z);P.face=c4A(1,0);yaw=P.face+PI;camT=4});done()}
function c4RelayStep(){return{t:'cond',lab:()=>{const R=C4.relay;return!R||R.state==='wait'?'Line up in lane 2 at the start of the relay':R.state==='count'?'On your mark…':'Sprint to Madison at the far line (hold Shift)'},ok:()=>C4.relay&&C4.relay.state==='done',
  goal:()=>{const R=C4.relay;return!R||R.state==='wait'?c4F(C4RU0,C4LANE[1]):c4F(C4RU1,C4LANE[1])},start:()=>{c4GamesScene();const so=c4Soro();c4RelayStart({opp:C4.gm.leg,lanes:[C4LANE[0],C4LANE[2],C4LANE[3]],sp:[5.15,4.9,4.75],anchor:{mate:C4.gm.mem[0],opps:C4.gm.anc},win:'ΑΣΡ × '+so.L+' WIN THE RELAY',label:'RELAY'})},tick:dt=>c4RelayTick(dt),done:()=>{C4.relay=null}}}
async function c4TugCine(done){const so=c4Soro(),gm=C4.gm;try{c4CamOn();c4DanAt(P.x,P.z,P.face);const em=gm.em;
  await c4Fade(async()=>{c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,0)});$('cineskip').hidden=true;
  await c1Line(em,`Event two! Tug-of-war! Alpha Sigma Rho and ${so.name}… against Delta Tau Omega!`);
  const ours=[DANNY,gm.tank,gm.mem[0],gm.mem[1],gm.grant],theirs=gm.dto;c4ShotF(0,18,4,0,7.5,1,1.2);await c4Wt(.4);c1Say(gm.dto[0],'We took your old rival\'s house. Now we take your Cup.',2.6);await c4Wt(2.2);c1Sub(null);
  let won=false,n=0;while(!won&&n++<6){won=await c4Tug({ours,theirs,title:'ΑΣΡ × '+so.L+' vs ΔΤΩ',col:'#2a6a8a',base:.5,taunts:['ΔΤΩ! HEAVE!','PULL, BOYS!','They\'re soft!'],win:'TUG-OF-WAR WON'});
    if(!won){c4ShotF(0,12,2.4,-2,7.5,1.4,1.5);await c4Wt(.6);await c1Line(gm.grant,'AGAIN! Their anchor had his foot past the line. The ref says rematch. Pull like they owe you money.')}}
  c1Say(gm.tank,'THAT\'S WHAT I\'M TALKING ABOUT!',2);for(const q of[gm.tank,gm.mem[0],gm.mem[1],gm.grant])q.pup.st='wave';await c4Wt(2.2);for(const q of[gm.tank,gm.mem[0],gm.mem[1],gm.grant])q.pup.st=''}catch(e){console.warn('c4TugCine',e)}done()}
async function c4EggCine(done){const so=c4Soro(),gm=C4.gm,m=gm.mem[0];try{if(!C4.cam)c4CamOn();c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,1.4);await c4Wt(.5);$('cineskip').hidden=true;
  await c1Line(gm.em,'Event three: the partner challenge! The egg toss! One brother, one sister, one egg! Every catch, take a step back!');
  await c1Line(m,'Soft hands. Catch it like it owes you nothing. Watch the egg, not my face.');
  let won=false,n=0;while(!won&&n++<6){won=await c4Egg({thrower:m,rounds:5,d0:3,dd:1.5,title:'PARTNER EGG TOSS · '+m.name,miss:pick(['Danny. DANNY.','It\'s an egg, not a grenade!','Again. From the top.']),win:'PERFECT TOSS'});if(!won){await c4Wt(.4)}}
  c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,1.4);await c4Wt(.6);await c1Line(gm.em,`Three events, three wins! After the Games so far, Alpha Sigma Rho and ${so.name} are in FIRST PLACE!`);c4Roar(.1,1.8);c4Hype(.6);
  {const[x,z]=c4F(1,-8);c4Confetti(x,c4FY(),z,260,6)}await c4Wt(1.6);c4Hype(.15)}catch(e){console.warn('c4EggCine',e)}c4CamOff();done()}

// ---- quest c: the All-Stars
const C4STAR=[['Trey Lawson','Quarterback · #12','"Trey Lawson. You\'ve seen me on the jumbotron. Probably in your dreams too. Don\'t ask for a selfie, I\'ll offer."'],['Marcus Booker','Running Back · #22','"Marcus. They told us there would be wings. I see a lot of eggs and no wings."'],['Deion Carter','Wide Receiver · #1','"Deion. I heard somebody in a propeller hat beat Delta Tau Omega in the relay. That you? Respect."']];
function c4StarsScene(){if(c4Live(C4.cast['Trey Lawson'])&&C4.cast['Trey Lawson'].c4tag==='stars')return;c4Off('stars');C4.st=C4STAR.map(([nm,ti],i)=>c4Pup('athletes',...c4F(-2+i*1.4,-6.2),c4A(0,-1),{tag:'stars',name:nm,title:ti,house:'hawks',scale:[1.06,1.14,1.02][i],lvl:9,v:3.2}))}
async function c4StarsArrive(done){try{c4GamesSet(1);c4GamesScene();c4StandsOn(1);c4KickSet(1);c4CamOn();c4DanAt(...c4F(-2.5,-7.6),c4A(1,0));c4StarsScene();
  C4.st.forEach((n,i)=>{const[x,z]=c4F(-34-i*1.2,-2+i*1.5);n.x=x;n.z=z;c4To(n,x,z)});c4ShotF(-24,-8,2.6,-34,-1,1.4,0);c4Hype(.6);
  await c4Wt(.3);C4.st.forEach((n,i)=>c4ToF(n,-4+i*1.5,-6.2,3.1));c1Say(C4.gm.mem[3],'Oh my god. Is that Trey Lawson?',2.2);c4Roar(.1,2.2);await c4Wt(1.6);c1Say(C4.st[0],'Relax, relax. Autographs after.',2.2);c4Follow((tp,tl)=>{const n=C4.st[1],[u,v]=c4UV(n.x,n.z),y=c4FY(),[x,z]=c4F(u+5,v-4.5),[lx,lz]=c4F(u,v);tp.set(x,y+2.2,z);tl.set(lx,y+1.4,lz)},1.5);
  await c4Wt(4.4);c1Sub(null);c4Follow(null);c4ShotF(-2.5,-11,2.4,-1,-6.6,1.5,1.5);await c4Wt(1.4);c1Say(C4.gm.grant,'Danny. Those are the three best players on the team. Go say hi. Do NOT be weird.',3);await c4Wt(2.6)}catch(e){console.warn('c4StarsArrive',e)}c4CamOff();done()}
const c4StarN=()=>[0,1,2].filter(i=>c4S().stars&&c4S().stars[i]).length;
function c4Star(i){const s=c4S();s.stars=s.stars||{};const[nm,ti,line]=C4STAR[i],n=C4.cast[nm];if(!c4Live(n))return;
  card({title:'The All-Stars',sp:nm+' · '+ti,text:line,focus:n,ch:[['"Danny Kowalski. Big fan."',()=>{s.stars[i]=1;bubble(n,pick(['Course you are.','Appreciate you, pledge.','Love the hat, man.']),2.4);updObj()}],['"I deliver pizza to your dorm. You tip two dollars."',()=>{s.stars[i]=1;bubble(n,pick(['…That was YOU?','Okay, that\'s fair.','Bro.']),2.4);updObj()}]]})}
const C4ORG=[['rope','Get the tug-of-war rope back from Delta Tau Omega'],['cones','Reset the relay cones at the far line'],['eggs','Take the egg crate back from Gamma Gamma Eta']];
const C4FUN=[['gator','Get Trey a blue Gatorade from the cooler','Trey Lawson'],['wings','Bring Marcus a plate of wings from the grill table','Marcus Booker'],['music','Fix the music at the speaker for Deion','Deion Carter']];
function c4OrgSpots(){return{rope:C4.gm.dto[1],cones:c4F(C4RU1,C4LANE[3]-1.4),eggs:C4.gm.other[2][0]}}
function c4FunSpots(){return{cooler:c4F(-6,-12.6),grill:c4F(4,-12.6),speaker:c4F(9,-12.6)}}
async function c4Spiral(done){const[t,m,d]=C4.st;try{c4CamOn();c4DanAt(...c4F(-6,-4),c4A(1,0));t.x=c4F(-4.8,-4.3)[0];t.z=c4F(-4.8,-4.3)[1];c4To(t,t.x,t.z);c4Look(t,P.x,P.z);
  const[dx,dz]=c4F(-3,3);d.x=dx;d.z=dz;c4To(d,dx,dz);c4ShotF(-9,-7.5,2.3,-4.5,-3.6,1.4,0);await c4Wt(.4);$('cineskip').hidden=true;
  await c1Line(t,'Alright. Last thing. Deion\'s going deep. Throw it to him. If you can reach him, I\'ll stop calling you pledge. For one day.');
  const ball=c4Ball();ball.visible=true;c4ToF(d,22,1,6.4);d.pup.look=null;c1Say(d,'Let\'s see it!',1.6);c4Follow((tp,tl)=>{const y=c4FY(),[x,z]=c4F(-11,-6.5),[lx,lz]=c4F(4,0);tp.set(x,y+3.2,z);tl.set(lx,y+1,lz)},2);
  C4.dan.st='throw';await c4Wt(1.6);sfx('ok');const a=[...c4P3(-5.7,-3.8,1.8)],b0=c4P3(22,1,1.3),t0=TT,fl=2.1;
  await new Promise(res=>{const f=()=>{const k=clamp((TT-t0)/fl,0,1);ball.position.set(lerp(a[0],b0[0],k),lerp(a[1],b0[1],k)+Math.sin(k*PI)*7,lerp(a[2],b0[2],k));ball.rotation.y=c4A(1,0)+PI/2;ball.rotation.x+=.4;if(k<1)setTimeout(f,16);else res()};f()});
  C4.dan.st='';d.pup.arms=-1.4;c4Follow(null);c4ShotF(17,-4,2.2,22,1,1.3,2.5);c4Roar(.1,1.6);await c4Wt(1.2);c1Say(d,'YO! Forty yards! On a rope!',2.2);await c4Wt(1.6);d.pup.arms=null;ball.visible=false;
  c4ShotF(-8.5,-7,2.2,-4.8,-4.3,1.5,1.6);await c4Wt(.8);c1Say(m,'…Yo.',1.4);await c4Wt(1.2);await c1Line(t,'Lucky. Pizza boy got lucky. …Do it again and I\'ll be worried.')}catch(e){console.warn('c4Spiral',e)}c4CamOff();done()}
async function c4CupCine(done){const so=c4Soro(),gm=C4.gm;try{c4CamOn();c4DanAt(...c4F(1.6,-9.2),c4A(0,-1));c4ShotF(1,-5.5,2.3,-1,-12.4,2.4,0);c4Hype(.4);await c4Wt(.4);$('cineskip').hidden=true;
  await c1Line(gm.em,`That's the Games! And your Homecoming Cup champions… Alpha Sigma Rho and ${so.name}!`);c4Hype(1);c4Roar(.15,2.6);{const[x,z]=c4F(0,-9);c4Confetti(x,c4FY(),z,700,12)}
  // the president lifts the Cup over her head
  if(C4.cup){const p=gm.pres,[x,z]=c4F(1.4,-10.6);p.x=x;p.z=z;c4To(p,x,z);c4Face(p,c4A(0,1));p.pup.st='wave';C4.cupHome={par:C4.cup.parent,pos:C4.cup.position.clone()};C4.cup.parent.remove(C4.cup);sc.add(C4.cup);C4.cupHeld=p}
  c4ShotF(1.6,-5.6,1.8,1.4,-10.6,2.3,1.6);for(const n of[gm.grant,gm.tank,...gm.mem])n.pup.st='wave';await c4Wt(3);c4Hype(.3);for(const n of[gm.grant,gm.tank,...gm.mem])n.pup.st='';
  const t=C4.st[0];t.x=c4F(3,-7.8)[0];t.z=c4F(3,-7.8)[1];c4To(t,t.x,t.z);c4Look(t,P.x,P.z);await c1Line(t,'Okay, ΑΣΡ. You\'re having a party tonight?');
  await c1Line(gm.grant,'The biggest party of the year. Every sorority on the Row is coming.');await c1Line(C4.st[1],'Coach said no parties the night before a game.');
  await c1Line(t,'Coach says a lot of things. We\'ll be there. Ten o\'clock.')}catch(e){console.warn('c4CupCine',e)}C4.cupHeld=null;if(C4.cupHome&&C4.cup){sc.remove(C4.cup);C4.cupHome.par.add(C4.cup);C4.cup.position.copy(C4.cupHome.pos);C4.cupHome=null}c4CamOff();done()}
function c4FaceSteps(k){if(k==='race')return[{t:'cond',lab:()=>{const R=C4.relay;return!R||R.state==='wait'?'Line up next to Deion for the forty':R.state==='count'?'On your mark…':'Beat Deion to the far line (hold Shift)'},ok:()=>C4.relay&&C4.relay.state==='done',
    goal:()=>{const R=C4.relay;return!R||R.state==='wait'?c4F(C4RU0,C4LANE[1]):c4F(C4RU1,C4LANE[1])},start:()=>{const d=C4.cast['Deion Carter'];c4RelayStart({opp:[d],lanes:[C4LANE[2]],sp:[5.2],label:'DANNY vs DEION'})},tick:dt=>c4RelayTick(dt),done:()=>{C4.relay=null;c4S().face='race'}},
    C_('The All-Stars','Deion Carter · Wide Receiver · #1','He\'s bent over with his hands on his knees. "Where did you learn to run like that?"',[['"Pizza delivery. Hills. No car."',()=>{bubble(C4.cast['Deion Carter'],'…Respect.',2)}]])];
  if(k==='tug')return[{t:'cine',run:async done=>{const mm=C4.cast['Marcus Booker'];let w=false,n=0;try{while(!w&&n++<6){w=await c4Tug({ours:[DANNY],theirs:[mm],title:'DANNY vs MARCUS',col:'#b81f2e',base:.62,u:-4,taunts:['Come on, little man.','Is that it?','Hmm.'],win:'YOU OUT-PULLED MARCUS BOOKER'})}}catch(e){console.warn(e)}c4CamOff();c4S().face='tug';done()}},
    C_('The All-Stars','Marcus Booker · Running Back · #22','He sits down on the grass and laughs. "Two hundred and forty pounds. You pulled two hundred and forty pounds. Who ARE you?"',[['"I carried a ram statue across campus once."',null]])];
  return[{t:'cine',run:async done=>{const tr=C4.cast['Trey Lawson'];let w=false,n=0;try{while(!w&&n++<6){w=await c4Egg({thrower:tr,rounds:5,d0:4.5,dd:2.2,w0:.2,title:'EGG TOSS vs TREY LAWSON',miss:pick(['Ha! Butterfingers.','Quarterback 1, pledge 0.','Again. I\'ve got all day.']),win:'NOT ONE DROP'})}}catch(e){console.warn(e)}c4CamOff();c4S().face='egg';done()}},
    C_('The All-Stars','Trey Lawson · Quarterback · #12','He wipes yolk off somebody else\'s shirt. "Nobody catches my throws like that. Nobody. Not even Deion, and don\'t tell Deion."',[['"Your secret\'s safe."',null]])]}

// ---- quest d: the party at the house
const C4SIDE=[['Camila Reyes','She\'s leaning on the bookshelf, rolling her eyes at a brother explaining crypto.','"Let me guess. You also have a podcast."',[['"I have a propeller hat. That\'s my whole personality."',1],['"Want to hear about my portfolio?"',0],['"You look bored. Want to go look at the coat of arms with me? It\'s ugly."',1]]],
 ['Nora Whitfield','She\'s standing alone by the beer pong table with her arms crossed.','"If you\'re here to tell me I\'m holding the cup wrong, keep walking."',[['"You\'re holding it wrong."',0],['"I\'m here to get destroyed at beer pong. Partner?"',1],['"Nice night, huh?"',0]]],
 ['Jess Tran','She\'s dancing alone, badly, on purpose.','"Are you going to dance or are you going to stand there holding that cup?"',[['"Stand here. It\'s my best move."',0],['(Dance. Badly. On purpose.)',1],['"I don\'t dance. I deliver pizza."',0]]]];
const C4JOB=[['keg','Tap the fresh keg in the kitchen',56,24.5],['crash','Throw the ΔΤΩ crashers out the back door',46.5,3.2],['dj','Fix the music at the DJ table',12.5,30.5]];
function c4PartyScene(){if(C4.pt&&c4Live(C4.pt.marcus)&&C4.pt.marcus.c4tag==='party')return;c4Off('party');c4Off('stars');const I=INT.asr,so=c4Soro(),W=(x,z)=>c3Free(I.x0+x,I.z0+z),o={tag:'party',int:'asr'};c3Party(1);C4.partyOn=1;C4.pt={};
  const fx=(x,z,a)=>Object.assign({},o,a);
  C4.pt.trey=c4Person('athletes',...W(39.5,8.6),PI,fx(0,0,{name:'Trey Lawson',title:'Quarterback · #12',house:'hawks',scale:1.06,lvl:9}));
  C4.pt.marcus=c4Person('athletes',...W(30,26),0,fx(0,0,{name:'Marcus Booker',title:'Running Back · #22',house:'hawks',scale:1.14,lvl:9}));
  C4.pt.deion=c4Person('athletes',...W(32.2,27),-PI/2,fx(0,0,{name:'Deion Carter',title:'Wide Receiver · #1',house:'hawks',lvl:9}));
  C4.pt.side=C4SIDE.map(([nm],i)=>c4Person('sororities',...W([18.5,43,24][i],[27.5,9.5,21][i]),rnd()*TAU,fx(0,0,{name:nm,title:'Party guest',fem:true,lvl:4})));
  C4.pt.soro=[so.pres,...C4MEM.map(m=>m[0])].map((nm,i)=>c4Person('sororities',...W(8+i*2.2,22+(i%2)*1.6),rnd()*TAU,fx(0,0,{name:nm,title:i?so.L:so.L+' President',house:so.id,fem:true,lvl:5})));
  C4.pt.crash=[0,1].map(i=>c4Person('legacies',...W(45.4+i*1.4,4.4),PI,fx(0,0,{name:pick(MN)+' (ΔΤΩ)',title:'Delta Tau Omega',house:'dto',lvl:5})));
  // props: a keg, a DJ table with speakers
  const g=c4Group('party',1,g=>{c4M(new THREE.CylinderGeometry(.3,.3,.75,14),mt(0xb8bcc2,.3,.8),I.x0+56,.38,I.z0+23.4,g);c4M(bgeo(1.8,.8,.7),0x1d1d22,I.x0+12.5,.4,I.z0+31.2,g);for(const s of[-1.1,1.1])c4M(bgeo(.5,1.2,.5),0x2a2a30,I.x0+12.5+s,.6,I.z0+31.6,g);c4M(bgeo(.6,.06,.4),0x6ad8ff,I.x0+12.5,.83,I.z0+31.1,g)});if(INT.asr.g&&g.parent!==INT.asr.g)INT.asr.g.add(g)}
const c4JobN=()=>C4JOB.filter(([k])=>c4S().party[k]).length;
function c4Job(k){const s=c4S(),n=k==='crash'?C4.pt.crash:null;s.party[k]=1;sfx('ok');
  if(k==='keg'){toast('Fresh keg tapped. Somebody cheers like you saved a life.',2600);dmgNum(P.x,2.6,P.z,'TAPPED','#e2b64c')}
  if(k==='crash'){for(const c of C4.pt.crash){if(!c4Live(c))continue;bubble(c,pick(['Fine, FINE. Your party sucks anyway.','We\'re leaving! We were leaving!']),2.2);c.mode='wander';const cc=c;setTimeout(()=>{if(c4Live(cc))despawn(cc)},2600)}}
  if(k==='dj'){toast('You unplug the brother\'s acoustic playlist. The room starts moving.',2800);c4Song(1);setTimeout(()=>{if(C4.song&&!C4.band)c4Song(0)},16000)}updObj()}
function c4Flirt(i){const s=c4S(),[nm,desc,open,opts]=C4SIDE[i],n=C4.cast[nm];if(!c4Live(n)||s.side!=null)return;
  card({title:'Homecoming Party',sp:nm+' · Party guest',text:desc+'\n\n'+open,focus:n,ch:opts.map(([l,ok])=>[l,()=>{if(ok){s.side=i;bubble(n,pick(['Okay. You\'re funny. Find me later, Kowalski.','Fine. You\'re cute. Don\'t ruin it.']),3);sfx('ok');stand(2);updObj()}else{s.no=s.no||{};s.no[i]=1;bubble(n,pick(['Wow. No.','Keep walking, hat boy.','Mm. Pass.']),2.4);sfx('bad');if(Object.keys(s.no).length>=3)s.no={};updObj()}}])})}
// Brett is asleep in the theatre on the new third floor
function c4BrettOn(){if(c4Live(C4.cast['Brett Calloway'])&&C4.cast['Brett Calloway'].c4tag==='party')return;const T=INT.asr_top;if(!T)return;const[x,z]=c3Free(T.x0+10.5,T.z0+19);const b=c4Dup('brett',x,z,PI,{pup:1,tag:'party',int:'asr_top'});if(b){b.pup.lie=1;b.pup.face=PI;C4.pt.brett=b;
    const cone=c4M(new THREE.ConeGeometry(.16,.42,10),mt(0xf07a1a,.6),0,0,0);b.g.add(cone);cone.position.set(0,1.95,.05)}}
const C4CLUE=[['coat','Check the coat pile by the front door',22,32.5,'Brett\'s jacket is on the pile. His phone is in the pocket: 14 missed calls from GRANT. One unread text from himself: "theatre. nap. dont tell"'],['girl','Ask the girl by the stairs','girl']];
const c4BrettGoal=()=>{const s=c4S(),I=INT.asr;if(!s.clue.coat)return[I.x0+22,I.z0+32.5];const b=C4.cast['Brett Calloway'];if(!c4Live(b))return null;return P.inside==='asr_top'?[b.x,b.z]:c3Route({int:'asr_top',x:b.x,z:b.z})};
async function c4Disturb(){const I=INT.asr;sfx('hit');noise(.25,.2,180);await c4Sl(380);noise(.25,.2,160);toast('THUD. Upstairs. Then another one.',2600);await c4Sl(700);
  c4Song(0);const[x,z]=c3Free(I.x0+29.5,I.z0+31.2),gl=c4Person('sororities',x,z,PI,{tag:'party',int:'asr',name:'Tessa Moore',title:'Party guest',fem:true,lvl:3});C4.pt.girl=gl;bubble(gl,'SOMEBODY HELP! UPSTAIRS!',3.2);sfx('bad')}
const c4Stash=()=>{const U=INT.asr_up;return{U,trey:[U.x0+9.2,U.z0+8.4],desk:[U.x0+6,U.z0+7]}};
function c4StashScene(on){const g=c4Group('stash',on,g=>{const{U,desk}=c4Stash();const t=c4M(bgeo(1.4,.06,.8),0x5a3a22,desk[0],.74,desk[1],g);for(const q of[[-.62,-.32],[.62,-.32],[-.62,.32],[.62,.32]])c4M(bgeo(.06,.74,.06),0x3a2614,desk[0]+q[0],.37,desk[1]+q[1],g);
    c4M(new THREE.ConeGeometry(.42,.42,18),mt(0xf8f8f4,.95),desk[0]-.1,.98,desk[1],g);for(let i=0;i<5;i++)c4M(bgeo(.28,.1,.18),mt(0xf2f2ec,.8),desk[0]+.35+(i%2)*.12,.82+Math.floor(i/2)*.1,desk[1]+.22-(i%3)*.1,g);
    c4M(new THREE.CylinderGeometry(.06,.06,.01,10),0xd8d8d4,desk[0]-.45,.775,desk[1]+.25,g);c4M(bgeo(.12,.01,.06),0xe2b64c,desk[0]+.5,.775,desk[1]-.25,g)});if(g&&INT.asr_up.g&&g.parent!==INT.asr_up.g)INT.asr_up.g.add(g);return g}
function c4TreyDown(){const{trey}=c4Stash();let t=C4.pt&&C4.pt.trey;if(t&&t.c4tag==='party'&&t.int!=='asr_up'){despawn(t);C4.mine.splice(C4.mine.indexOf(t),1)}if(!(t&&c4Live(t)&&t.grab)){t=c4Pup('athletes',trey[0],trey[1],PI/2,{tag:'party',int:'asr_up',name:'Trey Lawson',title:'Quarterback · #12',house:'hawks',scale:1.06,lvl:9})}t.pup.lie=1;t.pup.shake=1;t.x=trey[0];t.z=trey[1];c4To(t,t.x,t.z);C4.pt=C4.pt||{};C4.pt.trey=t;return t}
async function c4Discover(done){const{U,trey,desk}=c4Stash();try{c4StashScene(1);const t=c4TreyDown();c4CamOn();const[dx,dz]=c3Free(U.x0+9.5,U.z0+13.2);c4DanAt(dx,dz,PI);
  c4Shot([U.x0+10.6,2.5,U.z0+13.8],[U.x0+8.2,.6,U.z0+8.2],0);sfx('bust');await c4Wt(.6);c4Shot([U.x0+8.6,1.8,U.z0+10.6],[desk[0],.9,desk[1]],.9);await c4Wt(2.2);
  c4Shot([U.x0+10.8,1.4,U.z0+9.4],[trey[0],.25,trey[1]],1.4);await c4Wt(1.6);c4DanTo(trey[0]+.7,trey[1]+.9,3);C4.dan.look=[trey[0],trey[1]];await c4Wt(1.1);
  await c4DanSay('Trey? TREY. Hey. Hey, look at me.',2.4)}catch(e){console.warn('c4Discover',e)}done()}

// ---- quest e: CPR, the carry, the ambulance
async function c4CprCine(done){const{U,trey}=c4Stash();try{c4StashScene(1);const t=c4TreyDown();if(!C4.cam)c4CamOn();c4DanAt(trey[0]-1.05,trey[1]+.62,PI);C4.dan.look=[trey[0]-1.05,trey[1]];C4.dan.arms=-.75;C4.dan.dy=-.55;C4.dan.lean=-.55;
  c4Shot([trey[0]+1.2,1.75,trey[1]-1.2],[trey[0]-.8,.35,trey[1]+.2],0);$('cineskip').hidden=true;c1Sub('Danny','He\'s not breathing right. Okay. Okay. Like the video in health class.');await c1Wait(2.2);c1Sub(null);
  t.pup.shake=.4;const ok=await c4CPR({onPush:g=>{t.pup.dy=g?-.03:0;setTimeout(()=>{if(t.pup)t.pup.dy=0},100)},onFail:async c=>{c1Sub('Danny',c<2?'Come on. Come on, Trey.':'Don\'t you dare. Don\'t you DARE.');await c1Wait(1.4);c1Sub(null)}});
  t.pup.shake=0;noise(.4,.08,700);c4Shot([trey[0]+1.2,1.2,trey[1]+1.6],[trey[0],.35,trey[1]],1.4);c1Sub('','Trey coughs. A long, ugly breath. Then another one.');bubble(t,'*gasp*',2.2);await c1Wait(2.6);c1Sub(null);
  C4.dan.arms=null;C4.dan.dy=0;C4.dan.lean=0;const[gx,gz]=c3Free(U.x0+9.4,U.z0+14.4),gl=c4Person('sororities',gx,gz,PI,{tag:'party',int:'asr_up',name:'Tessa Moore',title:'Party guest',fem:true,lvl:3});c4Shot([U.x0+8,2,U.z0+11],[gx,1.4,gz],1.6);await c4Wt(.6);
  await c1Line(gl,'Is he… is he okay? He was fine. He came up here with somebody and then he was on the floor and he was SHAKING.');await c1Line(gl,'Marcus and Deion are downstairs. On the dance floor.')}catch(e){console.warn('c4CprCine',e)}c4CamOff();done()}
function c4CarryQB(on){const t=C4.pt&&C4.pt.trey;if(on){if(!c4Live(t)||C4.carry)return;t.pup.carried=1;t.pup.shake=0;t.pup.lie=0;if(t.g.parent)t.g.parent.remove(t.g);PM.add(t.g);t.g.position.set(.95,1.62,-.16);t.g.rotation.set(0,0,PI/2);C4.carry={t,px:P.x,pz:P.z}}
  else{const c=C4.carry;if(!c)return;C4.carry=null;const n=c.t;if(n.g.parent)n.g.parent.remove(n.g);const I=INT[P.inside]||null;(I&&I.g?I.g:sc).add(n.g);n.int=P.inside||undefined;n.pup.carried=0;n.g.rotation.set(0,0,0);n.g.rotation.order='YXZ';const[x,z]=c3Free(P.x+Math.sin(P.face)*1.1,P.z+Math.cos(P.face)*1.1);n.x=x;n.z=z;c4To(n,x,z);n.pup.lie=1;n.pup.face=P.face}}
function c4CarryUpd(dt){const c=C4.carry;if(!c||!c4Live(c.t))return;c.t.x=P.x;c.t.z=P.z;c.t.pup.tx=P.x;c.t.pup.tz=P.z;if(mode==='play'){const sp=Math.hypot(P.x-c.px,P.z-c.pz)/Math.max(dt,1e-3);try{animP(PM,Math.min(sp,4),TT,'carry')}catch(e){}}c.px=P.x;c.pz=P.z}
async function c4Ambulance(done){const I=INT.asr,pt=C4.pt;try{c4CamOn();const m=pt.marcus,d=pt.deion,t=pt.trey;c4DanAt(P.x,P.z,P.face);c4Song(0);
  c4Shot([P.x+3.2,2.2,P.z+2.6],[m.x,1.3,m.z],0);$('cineskip').hidden=true;await c1Line(m,'TREY! No no no no. Trey, wake up, man. WAKE UP.');
  c1Sub('Deion Carter','…Yes. Alpha Sigma Rho house, Greek Row. He\'s breathing but he won\'t wake up. Please hurry.');bubble(d,'911? Yeah…',2.6);await c4Wt(3);c1Sub(null);
  const g=c4Dup('grant',...c3Free(I.x0+28.5,I.z0+31),0,{tag:'party',int:'asr'}),tk=c4Dup('tank',...c3Free(I.x0+26.8,I.z0+31.4),0,{tag:'party',int:'asr'});if(g){await c1Line(g,'What happened? What is— Tank. Upstairs bedroom. Lock it. Right now. Nobody goes in there.');bubble(tk,'On it.',1.6);if(tk){tk.mode='wander';setTimeout(()=>{if(c4Live(tk))despawn(tk)},1800)}}
  // outside: the ambulance
  await c4Fade(async()=>{goOut(81,76.5);c4DanAt(80.5,77.8,-PI/2);const A=c4AmbMesh();A.visible=true;A.position.set(71.2,terrH(71.2,40),40);A.rotation.y=0;C4.amb={g:A,z0:40,z1:74.5,t:0,dur:4};c4Shot([63,3.2,86],[72,1.4,72],0)});
  sfx('bad');await c4Wt(4.4);const[p1,p2]=[c4Person('studentgov',72.8,72.4,PI/2,{tag:'party',int:null,name:'Paramedic Ruiz',title:'Harrowgate EMS',shirt:0xf2f2ee,sleeve:0xf2f2ee,pants:0x1d2440}),c4Person('studentgov',72.8,74.8,PI/2,{tag:'party',int:null,name:'Paramedic Hale',title:'Harrowgate EMS',shirt:0xf2f2ee,sleeve:0xf2f2ee,pants:0x1d2440})];
  const tr=c4Pup('athletes',82.4,75.8,PI/2,{tag:'party',int:null,name:'Trey Lawson',title:'Quarterback · #12',house:'hawks',scale:1.06,lvl:9});tr.pup.lie=1;const st=c4M(bgeo(.62,.12,2),mt(0xe8e8ec,.5),0,0,0);tr.g.add(st);st.position.set(0,-.08,.9);st.rotation.x=PI/2;
  const m2=c4Pup('athletes',83.6,77.6,-PI/2,{tag:'party',int:null,name:'Marcus Booker',title:'Running Back · #22',house:'hawks',scale:1.14,lvl:9}),d2=c4Pup('athletes',83.8,74.4,-PI/2,{tag:'party',int:null,name:'Deion Carter',title:'Wide Receiver · #1',house:'hawks',lvl:9});
  c4Shot([64.5,2.6,80],[74,1.2,74.5],1.4);await c4Wt(.6);tr.pup.y=terrH(82.4,75.8)+.6;c4To(tr,73.2,73.6,1.6);for(const p of[p1,p2]){p.mode='idle';p.hx=74.6;p.hz=73.6+(p===p1?-.8:.8)}await c4Wt(4.2);tr.g.visible=false;c1Say(p1,'Pulse is weak but steady. Let\'s go, let\'s go.',2.6);await c4Wt(1.8);
  C4.amb.z0=74.5;C4.amb.z1=150;C4.amb.t=0;C4.amb.dur=5;C4.amb.ease='in';for(const p of[p1,p2])despawn(p);await c4Wt(1.4);
  c4Shot([79.6,2.1,79.8],[83.6,1.5,76.2],1.2);await c4Wt(.6);
  await c1Line(m2,'Coach is gonna lose his mind. Trey\'s the whole offense. Our backup\'s got mono. Our third string is a kicker.');
  await c1Line(d2,'…You threw that ball forty yards today. On a rope. In sneakers.');
  await c1Line(m2,'No. No way. He\'s a pledge, D.');await c1Line(d2,'You got a better idea?');
  c4Shot([81.2,1.9,79.6],[80.5,1.55,77.8],1.4);await c4Wt(1.6);
  await c4Fade(async()=>{c4AmbMesh().visible=false;C4.amb=null;c4CamOff();c3Party(0);C4.partyOn=0;c4Group('party',0);c4Group('stash',0);c4Off('party');c4At(7.5);goIn('asr',10.6,27);P.face=0;yaw=PI});
  await c4Phone('Coach Hal Brennan','Kowalski. Armory Fieldhouse. 8 AM. Booker and Carter told me what you did last night. Both things. Bring cleats if you own cleats.',5200)}catch(e){console.warn('c4Ambulance',e);c4CamOff()}done()}
function c4AmbMesh(){if(C4.ambM)return C4.ambM;const g=new THREE.Group(),w=mt(0xf2f2ee,.45);c4M(bgeo(2.3,2.3,4.2),w,0,1.55,-.6,g);c4M(bgeo(2.2,1.6,1.6),w,0,1.2,2.1,g);c4M(bgeo(2.32,.32,4.22),mt(0xc8202e,.5),0,1.2,-.6,g);c4M(bgeo(2.05,.7,.06),mt(0x223040,.2,.4),0,1.65,2.9,g);
  const L=[c4M(bgeo(.5,.18,.3),new THREE.MeshBasicMaterial({color:0xff2a2a}),-.55,2.8,1.8,g),c4M(bgeo(.5,.18,.3),new THREE.MeshBasicMaterial({color:0x3a6aff}),.55,2.8,1.8,g)];for(const[x,z]of[[-1,1.9],[1,1.9],[-1,-1.6],[1,-1.6]]){const wh=c4M(new THREE.CylinderGeometry(.42,.42,.3,14),0x1a1a1a,x,.42,z,g);wh.rotation.z=PI/2}
  g.userData.L=L;g.traverse(o=>o.userData.noMerge=1);sc.add(g);g.visible=false;return C4.ambM=g}
function c4AmbUpd(dt){const A=C4.amb;if(!A)return;A.t+=dt;const k=clamp(A.t/A.dur,0,1),e=A.ease==='in'?k*k:1-Math.pow(1-k,2.2);A.g.position.z=lerp(A.z0,A.z1,e);A.g.position.y=terrH(A.g.position.x,A.g.position.z);const L=A.g.userData.L,on=Math.floor(TT*6)%2;L[0].visible=!!on;L[1].visible=!on;if(Math.floor(TT*2)!==A.sir){A.sir=Math.floor(TT*2);tone(A.sir%2?720:960,.42,'sine',.035)}}

// ---- quest f: Coach, practice, the game
const c4Armory=()=>{const b=B.find(b=>b.name==='Armory Fieldhouse');return b?c3Free(b.x0-2.5,(b.z0+b.z1)/2,.5):[500,297]};
async function c4CoachMeet(done){try{const[ax,az]=c4Armory();c4CamOn();if(P.inside)goOut(ax,az);c4At(Math.max(8,S.gt));
  const co=c4Pup('athletes',...c3Free(ax+1.2,az+1.4),PI*1.5,{tag:'coach',name:'Coach Hal Brennan',title:'Head Coach · Harrowgate Hawks',lvl:10,shirt:0x1d1d22,sleeve:0x1d1d22,pants:0x8a8d90,hair:0x9a9a9a,skin:0xe0ac80,scale:1.08}),
    mb=c4Pup('athletes',...c3Free(ax+.2,az+3.2),PI*1.5,{tag:'coach',name:'Marcus Booker',title:'Running Back · #22',house:'hawks',scale:1.14}),dc=c4Pup('athletes',...c3Free(ax+.3,az-1.2),PI*1.5,{tag:'coach',name:'Deion Carter',title:'Wide Receiver · #1',house:'hawks'});
  const[dx,dz]=c3Free(ax-3.4,az+.4);c4DanAt(dx,dz,PI/2);{const mx=(dx+ax)/2,y=terrH(mx,az);c4Shot([mx-.6,y+2.1,az+6.2],[mx,y+1.3,az+.4],0)}await c4Wt(.6);$('cineskip').hidden=true;
  await c1Line(co,'So you\'re the pledge. Kowalski. You know how many snaps you\'ve taken in a college game? I looked it up. Zero.');
  await c1Line(co,'Trey Lawson is at University Hospital and he is going to be fine. No thanks to whoever owns that bedroom. The doctors say a kid who knew CPR kept him alive till the ambulance got there.');
  await c1Line(co,'My backup has mono. My third string is a kicker. And these two clowns say you throw a forty-yard spiral in sneakers.');
  await c1Line(mb,'He does, Coach.');await c1Line(dc,'On a rope.');
  await c1Line(co,'Then you\'re my quarterback until somebody better walks through that door. Field. Ten minutes. You learn three plays or you go home.')}catch(e){console.warn('c4CoachMeet',e)}c4CamOff();done()}
async function c4PracticeCine(done){C4.noskip=1;const s=c4S();s.plays=s.plays||{};try{
  await c4Fade(async()=>{c4Off('coach');goOut(...c4F(-20,-12));c4At(Math.max(9,S.gt));c4Roster('scout');c4Jersey(1);if(!C4.cam)c4CamOn();C4FB.on=1;c4Form(30);
    C4.coach=c4Pup('athletes',...c4F(c4YU(30)-5,-8),c4A(0,1),{tag:'fb2',name:'Coach Hal Brennan',title:'Head Coach · Harrowgate Hawks',lvl:10,shirt:0x1d1d22,sleeve:0x1d1d22,pants:0x8a8d90,hair:0x9a9a9a,skin:0xe0ac80,scale:1.08})});
  big('PRACTICE · NIPPERT STADIUM',2200);c4ShotF(c4YU(30)-14,-10,6,c4YU(30)+4,0,0,0);await c4Wt(2.2);$('cineskip').hidden=true;
  const order=['slant','curl','post'];for(const k of order){if(s.plays[k])continue;const P_=C4PLAYS[k];
    c4ShotF(c4YU(30)-6.5,-6.4,2,c4YU(30)-5,-8,1.6,1.6);await c4Wt(.4);const ui=c4Ui('<div style="margin-bottom:6px">Coach draws it on the whiteboard</div>');ui.appendChild(c4PlayCard(k));
    await c1Line(C4.coach,P_.n+'. '+P_.tip);c4Ui(null);
    let ok=false,n=0;while(!ok&&n++<8){const st={los:30,down:1,first:40,sc:[0,0],q:0,clock:0};const r=await c4Snap(st,{plays:[k],force:k,call:P_.n,lag:.62,dsp:4.5,bonus:.12,noInt:1,shed:3.4,tick:0});ok=r.kind==='catch'||r.kind==='td'||r.kind==='oob'&&r.gain>0;
      if(!ok){c4Board(null);c1Say(C4.coach,pick(['Again!','Eyes up! AGAIN!','You held it like a pizza box. Again.','Throw it BEFORE he\'s open.']),2.2);await c4Wt(1.6)}}
    s.plays[k]=1;c4Board(null);c1Say(C4.coach,pick(['That\'s it. That\'s the play.','Better. Ugly, but better.','Okay. Okay!']),2.2);toast('Play learned: '+P_.n+' ('+Object.keys(s.plays).length+'/3)',2600);await c4Wt(1.6)}
  c4ShotF(c4YU(30)-6.5,-6.4,2,c4YU(30)-5,-8,1.6,1.6);await c4Wt(.6);
  await c1Line(C4.coach,'It\'s ugly. It\'ll have to do. Kickoff\'s at three. Eat something with vegetables in it.')}catch(e){console.warn('c4PracticeCine',e)}C4FB.on=0;c4Board(null);done()}
// game day: the tunnel, the crowd, Grant in the student section
function c4Section(on){c4Off('sec');const C=on?c4Stands():C4.stand;if(C)for(const d of C.home.data)if(d.sH!=null){d.s=d.sH;d.sH=null}if(!on)return;{const[cx,cz]=c4F(1,-27.6);for(const d of C.home.data)if(Math.hypot(d.x-cx,d.z-cz)<3.4){d.sH=d.s;d.s=.001}}const y=(u,v)=>{const[x,z]=c4F(u,v);try{return camTop(x,z)}catch(e){return terrH(x,z)}};
  const at=(u,v)=>{const[x,z]=c4F(u,v);return[x,z,y(u,v)]};const g=(()=>{const[x,z,yy]=at(0,-27.6);return c4Dup('grant',x,z,c4A(0,1),{pup:1,tag:'sec',y:yy})})();
  const br=[['tank',-1.3],['owen',1.2],['reese',2.4]].map(([id,du])=>{const[x,z,yy]=at(du,-27.6-(du>2?1.3:0));return c4Dup(id,x,z,c4A(0,1),{pup:1,tag:'sec',y:yy})});C4.sec={g,br};
  const sg=signMesh('ΑΣΡ ♥ #7',1.8,.6,'#7d1f2c','#e2b64c','Archivo');const[sx,sz,sy]=at(1.8,-27.2);sg.position.set(sx,sy+2.4,sz);sg.rotation.y=c4A(0,1);sg.userData.noMerge=1;sc.add(sg);C4.secSign=sg}
async function c4Pregame(done){try{await c4Fade(async()=>{c4Off('fb2');c4At(15);if(!C4.cam)c4CamOn();c4StandsOn(1);c4Hype(.5);c4Band(1);c4Section(1);c4Roster('wolves');c4Jersey(1);C4FB.on=0;
    c4All().forEach((n,i)=>{const[x,z]=c4F(-36-(i%4)*1.2,-2+Math.floor(i/4)*1.3);n.x=x;n.z=z;c4To(n,x,z);n.pup.face=c4A(1,0)});C4.FB_hide=1;C4FB.d.forEach(n=>n.g.visible=false);c4DanAt(...c4F(-35,0),c4A(1,0));c4ShotF(-22,-6,2.4,-35,0,1.5,0);c4Ball().visible=false});
  big('HOMECOMING · HAWKS vs WOLVES',2800);c4Roar(.14,3);await c4Wt(.4);for(const n of Object.values(C4FB.o)){const[u,v]=c4UV(n.x,n.z);c4ToF(n,u+18,v*.8-6,5.2)}c4DanTo(...c4F(-17,-5.5),5);
  c4Follow((tp,tl)=>{const[u]=c4UV(P.x,P.z),y=c4FY(),[x,z]=c4F(u+6,-9),[lx,lz]=c4F(u,-3);tp.set(x,y+2.2,z);tl.set(lx,y+1.4,lz)},2);await c4Wt(4.2);c4Follow(null);c4Band(0);
  // Grant in the student section
  const g=C4.sec.g;c4Shot([g.x+STAD.vx*3.2,g.y+2.2,g.z+STAD.vz*3.2],[g.x,g.y+1.6,g.z],1.4);await c4Wt(.8);g.pup.st='wave';c1Say(g,'THAT\'S OUR PLEDGE! NUMBER SEVEN! ALPHA SIGMA RHO!',3);for(const b of C4.sec.br)b.pup.st='wave';await c4Wt(3);g.pup.st='';for(const b of C4.sec.br)b.pup.st='';c1Sub(null);
  C4FB.d.forEach(n=>n.g.visible=true);C4.FB_hide=0;c4Hype(.25)}catch(e){console.warn('c4Pregame',e)}done()}
async function c4Drive1(done){C4.noskip=1;const st={los:25,down:1,first:35,sc:[0,0],q:1,clock:900};try{C4FB.on=1;$('cineskip').hidden=true;c4ShotF(c4YU(25)-11,0,6.4,c4YU(25)+7,0,.4,0);
  await c4Wt(.3);c1Say(C4FB.o.rb,'Your huddle, QB. Call it.',2.2);await c4Wt(1.2);c1Sub(null);toast('Opening drive: get the ball past midfield. 1–3 throw to a receiver · 4 hand off · WASD to move in the pocket',6500);
  for(;;){const v=await c4Drive(st,{plays:['slant','curl','post','dive'],call:'Opening drive · get past midfield (1–4)',tick:34,goal:s=>s.los>=50?'win':null});if(v==='win')break;
    c4Board(st);big(v==='fail'?'TURNOVER':'',1400);await c4Wt(1.4);c1Sub('','The Wolves go three-and-out. The Hawks get it back on their own 25.');await c4Wt(2.4);c1Sub(null);st.los=25;st.down=1;st.first=35;st.clock=Math.max(240,st.clock-120)}
  c4Board(st);c4Roar(.12,2);if(st.los>=100){st.sc[0]=7;C4.sc0=7;c4Board(st);c4Hype(.9);await c4Wt(2.4);c4Hype(.25);C4FB.on=0;C4.noskip=0;done();return}big('PAST MIDFIELD',1600);await c4Wt(1.6);
  // the drive stalls and the kicker puts it through
  st.los=Math.max(st.los,68);c4Form(st.los);c4Board(st);const K=C4FB.o.r3;c4ShotF(c4YU(st.los)-12,0,4,c4GL()+6,0,4,1.4);await c4Wt(1.2);sfx('ok');const b=c4Ball(),a=c4P3(c4YU(st.los)-6,0,.3),e=c4P3(STAD.hl+2,0,6.5),t0=TT;
  await new Promise(r=>{const f=()=>{const k=clamp((TT-t0)/2.2,0,1);b.position.set(lerp(a[0],e[0],k),lerp(a[1],e[1],k)+Math.sin(k*PI)*7,lerp(a[2],e[2],k));b.rotation.x+=.35;if(k<1)setTimeout(f,16);else r()};f()});
  st.sc[0]=3;C4.sc0=3;c4Board(st);big('FIELD GOAL · HAWKS 3',2000);c4Roar(.14,2.2);c4Hype(.8);await c4Wt(2);c4Hype(.25)}catch(e){console.warn('c4Drive1',e)}C4FB.on=0;done()}
async function c4Montage(done){const h0=C4.sc0||3,st={los:72,down:0,first:0,sc:[h0,0],q:1,clock:420};try{if(!C4.cam)c4CamOn();
  const beats=[[1,0,[h0,7],'Wolves touchdown. The Cedar Valley section goes nuts.'],[2,240,[10,7],h0===3?'Marcus Booker, 31 yards, untouched. Hawks touchdown.':'Hawks field goal from 41.'],[2,9,[10,10],'Wolves field goal at the half.'],[3,512,[17,10],'Kowalski to Carter on the slant. It works. It actually works.'],[4,62,[17,17],'Wolves touchdown with a minute left. Tied.'],[4,8,[17,17],'Hawks ball on the Wolves 28. Eight seconds. One play.']];
  const shots=[[-30,-24,14,0,0,0],[20,-22,10,-5,0,0],[0,30,18,0,0,0],[-10,-18,6,6,0,1],[28,24,12,0,0,0],[0,-27.6,4,0,-20,2]];
  for(let i=0;i<beats.length;i++){const[q,c,sc,t]=beats[i];st.q=q;st.clock=c;st.sc=sc;c4Board(st);const s=shots[i];c4ShotF(s[0],s[1],s[2],s[3],s[4],s[5],.5);c1Sub('',t);if(i===1||i===3)c4Roar(.12,1.6);if(i===4){c4Hype(0)}await c1Wait(2.6)}
  c1Sub(null);const g=C4.sec&&C4.sec.g;if(g){c4Shot([g.x+STAD.vx*2.6,g.y+2,g.z+STAD.vz*2.6],[g.x,g.y+1.6,g.z],1.2);c1Say(g,'Come on, Danny. Come on, come on, come on…',2.6);await c1Wait(2.6);c1Sub(null)}
  // a nervous student section
  for(const b of(C4.sec&&C4.sec.br)||[])b.pup.st='guard';await c1Wait(.4)}catch(e){console.warn('c4Montage',e)}done()}
// the last play: four verticals, nobody open, scramble right, throw it into the corner
async function c4FinalCine(done){C4.noskip=1;const st={los:72,down:1,first:100,sc:[17,17],q:4,clock:8};const F=C4FB;try{if(!C4.cam)c4CamOn();C4FB.on=1;c4Hype(.1);$('cineskip').hidden=true;
  for(let tries=0;tries<8;tries++){let phase=0,throwT=0;c4Form(st.los);c4Board(st);c4ShotF(c4YU(72)-10.5,0,6.4,c4YU(72)+7,0,.4,1.6);
    if(!tries){const co=C4.coach&&c4Live(C4.coach)?C4.coach:null;c1Sub('Coach Hal Brennan','Four verticals. Somebody gets open. Somebody always gets open. Then you throw it.');await c1Wait(2.8);c1Sub(null)}
    F.onMove=null;F.onSpace=null;F.onTick=null;const cfg={force:'verts',lag:.06,cush:.35,dsp:5.6,rsp:5.1,shed:1.3,rush:3.4,qsp:4.9,noInt:1,noBreak:1,noThrow:1,tip:'<b>NOBODY\'S OPEN</b> · scramble with <b>A</b> / <b>D</b>'};F.cover=1;
    let scrT=0,dir=0,thr=null,sack=0;
    F.onTick=(dt,t)=>{if(F.hold==='qbdown'){sack=1;return}
      if(phase===0&&t>1.2){phase=1;big('SCRAMBLE!',900);c4Ui('<div><b>SCRAMBLE!</b> hold <b>A</b> or <b>D</b> to run for the sideline</div>')}
      if(C4.auto&&phase===1)F.k.KeyD=1;if(C4.auto&&phase===2&&throwT>.4)F.onSpace();if(phase===1){const mv=(F.k.KeyD||F.k.ArrowRight?1:0)-(F.k.KeyA||F.k.ArrowLeft?1:0);if(mv){dir=dir||mv;scrT+=dt}if(Math.abs(F.q.v)>STAD.hw-4.2||scrT>1.5){phase=2;F.ts=.3;throwT=0;c4Hype(.6);
          // Deion's man slips; Deion breaks for the corner on Danny's side
          const side=Math.sign(F.q.v)||1,dd=F.o.r1,cb=F.d.find(n=>n.fbk==='cb1');if(cb){cb.fb.slip=9;cb.pup.lie=.8}const corner=[c4GL()+2.6,clamp(dd.fb.v*1.04,-(STAD.hw-2.6),STAD.hw-2.6)];dd.fb.su=dd.fb.u;dd.fb.sv=dd.fb.v;F.air=null;F.cover=0;F.deion=corner;
          c4Ui('<div style="font-size:18px"><b>THROW IT!</b> press <b>Space</b></div>').appendChild(c4Btn('THROW',()=>F.onSpace&&F.onSpace()));big('THROW IT!',900)}}
      if(phase===2){throwT+=dt/F.ts;const dd=F.o.r1;if(F.deion&&!F.air&&F.hold==='qb')c4Mv(dd,F.deion[0],F.deion[1],5.4,dt);if(throwT>3.4&&F.hold==='qb'){phase=3;for(const d of F.d)if(d.fbk[0]==='d'){d.fb.u=F.q.u+.5;d.fb.v=F.q.v}}}};
    F.onSpace=()=>{if(phase!==2||F.hold!=='qb')return;const dd=F.o.r1,c=F.deion,qd=Math.hypot(c[0]-F.q.u,c[1]-F.q.v),tf=.35+qd/16;F.hold='air';F.air={t:0,tf,a:[F.q.u,F.q.v],b:c,h:2.2+qd*.06,to:dd,sure:1,td:1,chase:1};F.thrown=1;if(C4.dan){C4.dan.st='throw'}tone(520,.05,'triangle',.05);c4Ui(null);
      c4Follow((tp,tl)=>{const b=c4Ball().position,y=c4FY(),[bu,bv]=c4UV(b.x,b.z),[x,z]=c4F(bu-7,bv*.4-6),[lx,lz]=c4F(bu+2,bv);tp.set(x,y+4.2,z);tl.set(lx,b.y*.3+y*.7+.5,lz)},3)};
    const r=await c4Snap(st,cfg);F.ts=1;F.onTick=null;F.onSpace=null;c4Ui(null);
    if(r.kind==='td'||r.kind==='catch'&&c4UY(F.o.r1.fb.u)>=99){st.sc[0]+=6;st.clock=0;c4Board(st);break}
    c4Board(st);await c1Wait(.8);c1Sub('','FLAG ON THE PLAY. Holding, Cedar Valley. Replay the down. Eight seconds.');big('FLAG',1200);await c1Wait(2.4);c1Sub(null);F.cover=0}
  F.cover=0;await c4Celebrate();await c4Interview()}catch(e){console.warn('c4FinalCine',e)}C4FB.on=0;c4Board(null);done()}
async function c4Celebrate(){const F=C4FB,st={los:100,down:0,first:0,sc:[23,17],q:4,clock:0};c4Board(st);
  // the catch, frozen for a beat
  const dd=F.o.r1;dd.pup.lean=0;dd.pup.lie=.55;c4Shot([dd.x+STAD.vx*-4+STAD.ux*-3,c4FY()+1.4,dd.z+STAD.vz*-4+STAD.uz*-3],[dd.x,c4FY()+.6,dd.z],1.6);await c1Wait(1.3);dd.pup.lie=0;dd.pup.st='wave';
  big('TOUCHDOWN HAWKS!',2600);c4Hype(1);c4Roar(.18,3.6);c4Band(1);for(let i=0;i<8;i++){const[x,z]=c4F(-28+i*8,-34+(i%2)*68);setTimeout(()=>c4Firework(x,c4FY()+26+rnd()*8,z),i*260)}{const[x,z]=c4F(0,0);c4Confetti(x,c4FY(),z,900,22)}
  // the team runs to Danny
  await c1Wait(1.2);c4DanAt(P.x,P.z,c4A(1,0));const[du,dv]=c4UV(P.x,P.z);Object.values(F.o).forEach((n,i)=>{const a=i/7*TAU;c4ToF(n,du+Math.cos(a)*1.4,dv+Math.sin(a)*1.4,6);n.pup.st='';setTimeout(()=>{if(n.pup)n.pup.st='wave'},1500)});
  for(const n of F.d){n.pup.lie=0;n.pup.st='';c4ToF(n,c4UV(n.x,n.z)[0],c4UV(n.x,n.z)[1]*.6+8,2);n.pup.sp=null}
  c4Shot(c4P3(du-5,dv-5.5,2.6),c4P3(du,dv,1.4),1.4);c4Storm();await c1Wait(2.4);C4.dan.st='wave';C4.dan.dy=.35;await c1Wait(1.6);C4.dan.dy=0;
  // Grant, in the stands, losing his mind
  const g=C4.sec&&C4.sec.g;if(g){c4Shot([g.x+STAD.vx*2.4,g.y+2,g.z+STAD.vz*2.4],[g.x,g.y+1.6,g.z],1.6);g.pup.st='wave';c1Say(g,'I KNEW IT! I ALWAYS KNEW HE HAD IT IN HIM! THAT\'S MY PLEDGE! I PICKED HIM! I PICKED HIM!',4.2);for(const b of C4.sec.br)b.pup.st='wave';await c1Wait(3.6);c1Say(C4.sec.br[0],'You literally made him clean the toilets with a toothbrush.',2.6);await c1Wait(2.4);c1Say(g,'CHARACTER BUILDING! LOOK AT HIM!',2.6);await c1Wait(2.6)}
  c1Sub(null);c4Shot(c4P3(du+7,dv-12,7),c4P3(du,dv,1),.6);await c1Wait(3.2);c4Band(0)}
async function c4Interview(){let rep,camop;await c4Fade(async()=>{c4StandsOn(1);c4Hype(.2);c4Board(null);c4Off('sec');if(C4.secSign){sc.remove(C4.secSign);C4.secSign=null}c4Off('fb');c4Ball().visible=false;for(const r of C4FB.rings)r.visible=false;
    const[x,z]=c4F(-6,-11.5);c4DanAt(x,z,c4A(0,-1));const[rx,rz]=c4F(-5.2,-12.4),[cx,cz]=c4F(-3.8,-14.6);rep=c4Pup('activists',rx,rz,c4A(-1,1),{tag:'tv',name:'Mia Torres',title:'HCN Campus News',fem:true,lvl:4});camop=c4Pup('studentgov',cx,cz,c4A(-1,1),{tag:'tv',name:'Camera operator',title:'HCN',lvl:3});
    const mic=c4M(new THREE.CylinderGeometry(.025,.02,.22,8),0x1d1d22,.18,1.25,.25,rep.g);mic.rotation.x=-.6;c4M(new THREE.SphereGeometry(.045,8,6),0x3a3a40,.18,1.37,.33,rep.g);const tv=c4M(bgeo(.24,.24,.5),0x2a2a30,.18,1.62,.1,camop.g);c4M(new THREE.CylinderGeometry(.07,.07,.14,10),0x111111,.18,1.62,.4,camop.g).rotation.x=PI/2;
    camop.pup.st='carry';c4Shot(c4P3(-3.9,-14.2,1.62),c4P3(-5.9,-11.8,1.55),0)});
  const lt=document.createElement('div');lt.style.cssText='position:fixed;left:6%;bottom:14%;z-index:34;font:800 18px Archivo,Arial,sans-serif;color:#fff;pointer-events:none';lt.innerHTML='<div style="display:inline-block;background:#c8202e;padding:4px 10px">HCN LIVE · NIPPERT STADIUM</div><br><div style="display:inline-block;background:#f6f2ea;color:#1d1d22;padding:6px 12px">DANNY KOWALSKI · #7 · ΑΣΡ PLEDGE, WALK-ON QUARTERBACK</div><div style="position:fixed;right:5%;top:12%;color:#ff4a4a;font-size:16px">● REC</div>';document.body.appendChild(lt);
  try{$('cineskip').hidden=true;c1Say(rep,'Danny! Danny! Mia Torres, HCN Campus News!',2.4);await c1Wait(2);
    await c1Line(rep,'Two days ago you were a pledge in a propeller hat. You had never taken a college snap. You just beat Cedar Valley on the last play of Homecoming. How?');
    c4Shot(c4P3(-4.4,-13.6,1.65),c4P3(-6,-11.5,1.6),1.2);await c1Wait(1.2);await c4DanSay('I guess I just wanted it more.',3.6);
    c4Shot(c4P3(-3.9,-14.2,1.62),c4P3(-5.9,-11.8,1.55),1.2);c1Say(rep,'"I guess I just wanted it more." Back to you in the studio.',3);await c1Wait(3)}catch(e){console.warn(e)}lt.remove()}
// the after-party: and Grant, by the back door, with a senior brother
async function c4AfterParty(done){const I=INT.asr;try{await c4Fade(async()=>{c4Jersey(0);c4StandsOn(0);c4Band(0);c4Off();c4GamesSet(0);c4KickSet(0);c4At(22.5);goIn('asr',24,24);c3Party(1);C4.partyOn=1;if(!C4.cam)c4CamOn();
    const W=(x,z)=>c3Free(I.x0+x,I.z0+z);c4DanAt(...W(24,22),PI);const tk=c4Dup('tank',...W(22.6,20.8),PI/3,{pup:1,tag:'after',int:'asr'}),ow=c4Dup('owen',...W(25.6,20.6),-PI/3,{pup:1,tag:'after',int:'asr'});C4.af={tk,ow};
    const g=c4Dup('grant',...W(45.6,4.4),-PI/2,{pup:1,tag:'after',int:'asr'}),h=c4Pup('brothers',...W(44.2,4.6),PI/2,{tag:'after',int:'asr',name:'Hollis Grady',title:'ΑΣΡ Senior Brother',house:'asr',lvl:9,hair:0x8a6a4a});C4.af.g=g;C4.af.h=h;
    c4Shot([I.x0+24,2.6,I.z0+27],[I.x0+24,1.6,I.z0+21],0)});
  c4Song(1);big('SATURDAY NIGHT',2000);await c4Wt(1.2);$('cineskip').hidden=true;c1Say(C4.af.tk,'SEVEN! SEVEN! SEVEN!',2.2);C4.af.tk.pup.st='wave';C4.af.ow.pup.st='wave';await c4Wt(2.2);C4.af.tk.pup.st='';C4.af.ow.pup.st='';
  await c1Line(C4.af.ow,'They put the Cup on the mantel, Danny. Right where the Old Guard used to be. You did that.');
  // Danny drifts toward the kitchen and sees them through the doorway
  c4DanTo(I.x0+38.5,I.z0+12,2.4);c4Follow((tp,tl)=>{tp.set(P.x+1.6,2.4,P.z+3);tl.set(P.x-.4,1.5,P.z-3)},2);await c4Wt(4.6);c4Follow(null);c4Song(0);C4.dan.look=[C4.af.g.x,C4.af.g.z];
  const g=C4.af.g,h=C4.af.h;c4Look(g,h.x,h.z);c4Look(h,g.x,g.z);c4Shot([P.x+.4,1.75,P.z+.6],[(g.x+h.x)/2,1.5,(g.z+h.z)/2],1.4);await c4Wt(1.4);
  const say=async(n,t,s)=>{c1Say(n,t,s);await c4Wt(s)};
  await say(h,'Upstairs. Our room, Grant. Our stash. A quarterback nearly died on our floor.',3.2);
  await say(g,'Keep your voice down.',1.8);
  await say(h,'Half the team was in this house. The hospital ran a tox screen. The cops are going to ask whose cocaine that was.',3.6);
  await say(g,'Then we make sure they ask somebody else. Delta Tau Omega has been open for a week and they already have a reputation.',3.6);
  await say(h,'You can\'t frame your way out of everything.',2.4);
  await say(g,'Watch me.',1.8);c1Sub(null);
  // Grant notices Danny in the doorway
  c4Face(g,Math.atan2(P.x-g.x,P.z-g.z));c4Look(g,P.x,P.z);await c4Wt(.6);c4Shot([g.x+(P.x-g.x)*.35+1,1.7,g.z+(P.z-g.z)*.35+1],[g.x,1.6,g.z],1.6);await c4Wt(1);
  await c1Line(g,'Danny! The man of the hour. What are you doing back here? Go. Enjoy it. You earned it.');
  await c1Line(g,'And Danny? Whatever you heard back here, you didn\'t.')}catch(e){console.warn('c4AfterParty',e)}
  await c4Fade(async()=>{c4CamOff();c4Off('after');P.x=I.x0+30;P.z=I.z0+20;P.y=0;P.face=PI;yaw=0;camT=3});done()}

// ================================================================ the quests
const C4M=[
 {id:'c4welcome',ch:4,main:1,name:'Welcome to Homecoming',who:'grant',steps:()=>{const so=c4Soro(),sp=c4SoroSpot(5.5);return[
   /* V384 Grant and Danny talk it through instead of one speech that explains everything */{t:'cine',run:done=>{const g=NN.grant;c8Lines([[g,'Homecoming week, Danny. You feel that? The whole Row is buzzing.'],[DANNY,'I thought that was the speakers next door.'],[g,'Four new houses opened this year. And every chapter gets paired with a sorority for the week.'],[DANNY,'Paired how?'],
     [g,'Games on Friday together. The party together. Then the whole school sits at Nippert on Saturday, and we sit with them.'],[DANNY,'So who did we get?'],[null,`He flicks an index card at you. It says ${so.L} in purple marker.`,2.6],[g,`${so.name}. Go meet their president.`],[DANNY,'And say what?'],[g,'Anything you want. Just be the most charming pledge she has ever met.']]).then(done,done)}},
   C_('Welcome to Homecoming','Grant Ashby · Chapter president','"Can you do that?"',[['"I can be charming."',null],['"Define charming."',()=>[C_('Welcome to Homecoming','Grant Ashby · Chapter president','"Don\'t talk about the pizza place. Don\'t talk about the business upstairs. Compliment the house. Smile with your eyes."',[['"With my eyes. Got it."',null]])]]]),
   go(sp,`Meet the ${so.L} president outside the ${so.name} house`,{press:1,act:'Introduce yourself to '+so.pres,r:3.4,start:()=>c4SoroCast(1)}),
   C_('Welcome to Homecoming',c4Pres(),`"${so.pres}. You must be Alpha Sigma Rho's pledge." She looks at the hat for a long time. "We drew your house out of a hat. Half my girls wanted Delta Tau Omega."\n\n"Here's how this works. My sisters show up, my sisters win the Games, and your party is the best party of the year. If one of my girls has a bad night, I end your house."`,[
     ['"Your house is beautiful. Did you pick the shutters?"',()=>[C_('Welcome to Homecoming',c4Pres(),'"…I did, actually." She almost smiles. "Okay. Go meet the girls."',[['"Thank you."',()=>stand(2)]])]],
     ['"We\'re going to win that Cup."',()=>[C_('Welcome to Homecoming',c4Pres(),'"WE are going to win that Cup. You are going to carry things." She points at the lawn. "Introduce yourself. Be quick. Be polite."',[['"Quick and polite."',null]])]],
     ['"Delta Tau Omega has been open for four days."',()=>[C_('Welcome to Homecoming',c4Pres(),'"And they already have a noise complaint." She laughs, once. "Fine. Go meet my sisters."',[['"Going."',null]])]]]),
   {t:'cond',lab:c4MeetLab,ok:c4MeetOk,goal:c4MeetGoal,start:()=>c4SoroCast(1)},
   C_('Welcome to Homecoming',c4Pres(),'"They like you. Mostly Jordan likes the hat." She hands you a folded sheet of paper. "Our schedule. Your schedule. Tell Grant to make them the same schedule."',[['"I\'ll tell him."',null]]),
   c4ToGrant('Bring the sorority\'s schedule to Grant','Show Grant the schedule'),
   C_('Welcome to Homecoming','Grant Ashby · Chapter president','He holds their schedule next to his. They do not match. He pins both to the corkboard beside the throne, next to a magazine photo of the Homecoming Cup.\n\n"Kickoff, Games, party, game. Help me put it in order before Sigma Delta Rho books Nippert for a crawfish boil."',[['Look at the corkboard',null]]),
   {t:'cine',run:done=>c4PlanBoard(()=>done())},
   C_('Welcome to Homecoming','Grant Ashby · Chapter president','"Kickoff at Nippert, six o\'clock. Every house on the Row, the band, the cheerleaders. They read the pairings out loud."\n\n"Don\'t be late. And Danny? Wear the hat."',[['"I always wear the hat."',null]])]},
  fin:()=>{c4Off('soro');c4Next('c4games')}},

 {id:'c4games',ch:4,main:1,name:'Greek Games',who:'grant',pre:['c4welcome'],steps:()=>[
   go(c4F(-27,-3),'Go to Nippert Stadium for the Homecoming Kickoff at 6 PM',{r:9,when:[17,23.9]}),
   {t:'cine',run:d=>{C4.kickDay=S.day;c4Kickoff(d)}},
   /* V366 the Games are the next afternoon at 2:00 PM, as the kickoff and the plan board say: Danny has to come back to Nippert then, and waits there if he is early */
   {t:'cond',lab:()=>{const tm=S.day<=(C4.kickDay||S.day);return tm?'The Greek Games start tomorrow at 2:00 PM at Nippert. Rest up (sleep, or Z to meditate).':S.gt<14?`Be at Nippert for the Greek Games. They start at 2:00 PM (${fmtT(S.gt)} now). Wait on the field or press Z to meditate.`:'Get to Nippert for the Greek Games. They started at 2:00 PM!'},
    ok:()=>S.day>(C4.kickDay||S.day-1)&&S.gt>=14&&!P.inside&&Math.hypot(P.x-c4F(-27,-3)[0],P.z-c4F(-27,-3)[1])<14,goal:()=>c4F(-27,-3)},
   {t:'cine',run:c4GamesDay},
   c4RelayStep(),
   {t:'cine',run:c4TugCine},
   {t:'cine',run:c4EggCine}],
  fin:()=>{c4Next('c4stars')}},

 {id:'c4stars',ch:4,main:1,name:'The All-Stars',at:[384,384],pre:['c4games'],steps:()=>[
   {t:'cine',run:c4StarsArrive},
   {t:'cond',lab:()=>'\nMeet the three star players ('+c4StarN()+'/3)\n'+C4STAR.map(([n],i)=>(c4S().stars&&c4S().stars[i]?'✓ ':'○ ')+n).join('\n'),ok:()=>c4StarN()>=3,goal:()=>{for(let i=0;i<3;i++){if(c4S().stars&&c4S().stars[i])continue;const n=C4.cast[C4STAR[i][0]];if(c4Live(n))return[n.x,n.z]}return null},start:()=>{c4GamesScene();c4StarsScene()}},
   C_('The All-Stars','Grant Ashby · Chapter president','Grant has a clipboard in one hand and his phone in the other, and he is losing.\n\n"Delta Tau Omega took the rope. The cones are in the end zone. Gamma Gamma Eta is drinking out of the egg crate. Help me get this back together before the Wolves\' scouts see us."',[['"On it."',null]]),
   {t:'cond',lab:()=>'\nKeep the Games organized\n'+C4ORG.map(([k,l])=>(c4S().org[k]?'✓ ':'○ ')+l).join('\n'),ok:()=>C4ORG.every(([k])=>c4S().org[k]),goal:()=>{const s=c4S(),sp=c4OrgSpots();for(const[k]of C4ORG){if(s.org[k])continue;const p=sp[k];return Array.isArray(p)?p:[p.x,p.z]}return null}},
   C_('The All-Stars','Grant Ashby · Chapter president','"Better. Now the athletes. If Trey Lawson leaves this field bored, he tells the whole team, and the whole team skips our party. Keep them happy, Danny. Whatever they want."',[['"Whatever they want."',null]]),
   {t:'cond',lab:()=>'\nMake sure the stars have a good time\n'+C4FUN.map(([k,l])=>(c4S().fun[k]===2?'✓ ':c4S().fun[k]?'◐ ':'○ ')+l).join('\n'),ok:()=>C4FUN.every(([k])=>c4S().fun[k]===2),goal:c4FunGoal,start:()=>{c4StarsScene();for(const[k,,who]of C4FUN){const n=C4.cast[who];if(c4Live(n)&&!c4S().fun[k])bubble(n,{gator:'Somebody get me a Gatorade. BLUE.',wings:'Is there food at this thing?',music:'Who picked this music? Who hurt you?'}[k],4)}}},
   C_('The All-Stars','Trey Lawson · Quarterback · #12','"Alright, pledge. You\'ve been running around for us all day. Let\'s see if you can do anything besides fetch." He points at the field. "Pick your poison."',[
     ['"Race Deion. The forty."',()=>c4FaceSteps('race')],['"Tug-of-war. Me against Marcus."',()=>c4FaceSteps('tug')],['"Egg toss. You throw."',()=>c4FaceSteps('egg')]]),
   {t:'cine',run:c4Spiral},
   {t:'cine',run:c4CupCine}],
  fin:()=>{c4Off('games');c4Off('stars');c4StandsOn(0);c4GamesSet(0);c4KickSet(0);c4Next('c4party')}},

 {id:'c4party',ch:4,main:1,name:'Homecoming Party',who:'grant',pre:['c4stars'],steps:()=>[
   {t:'cond',lab:()=>'Go home to the ΑΣΡ house. The party starts at ten',ok:()=>P.inside==='asr',goal:()=>P.inside?c3Route({int:'asr',x:INT.asr.x0+24,z:INT.asr.z0+20}):SPOT.ASR,done:()=>{c4At(Math.max(22,S.gt));c4PartyScene()}},
   {t:'fx',f:()=>{c4At(Math.max(22,S.gt));c4PartyScene();const g=NN.grant;if(g)bubble(g,'Danny! Throne room!',2.4)}},
   C_('Homecoming Party','Grant Ashby · Chapter president','The house is shaking. Two hundred people, three football players, every sorority on the Row, and a cardboard cutout of the Homecoming Cup somebody made in an art class.\n\n"One rule tonight: nothing happens in this house that ends up in the Herald. Now go make me look good."',[['"Making you look good."',null]]),
   {t:'cond',lab:()=>'\nHelp Grant run the party\n'+C4JOB.map(([k,l])=>(c4S().party[k]?'✓ ':'○ ')+l).join('\n'),ok:()=>c4JobN()>=3,goal:()=>{const I=INT.asr,s=c4S();for(const[k,,x,z]of C4JOB)if(!s.party[k])return P.inside==='asr'?[I.x0+x,I.z0+z]:c3Route({int:'asr',x:I.x0+x,z:I.z0+z});return null},start:()=>c4PartyScene()},
   {t:'cond',lab:()=>'\nFind a side piece for the night\n'+C4SIDE.map(([n],i)=>((c4S().no||{})[i]?'✗ ':'○ ')+n).join('\n'),ok:()=>c4S().side!=null,goal:()=>{for(let i=0;i<3;i++){if((c4S().no||{})[i])continue;const n=C4.cast[C4SIDE[i][0]];if(c4Live(n))return[n.x,n.z]}return null},start:()=>c4PartyScene()},
   C_('Homecoming Party','Grant Ashby · Chapter president','Grant grabs your arm. "Where\'s Brett? Brett was supposed to be on the door an HOUR ago. There are Delta Tau Omega guys in my kitchen. Find him."',[['"Finding Brett."',()=>c4BrettOn()]]),
   {t:'cond',lab:()=>{const s=c4S();return!s.clue.coat?'Find Brett. Start with the coat pile by the front door':'Find Brett. His text says: "theatre. nap."'},ok:()=>!!c4S().clue.brett,goal:c4BrettGoal,start:()=>c4BrettOn()},
   {t:'fx',f:()=>{c4Disturb()}},
   C_('Homecoming Party','Tessa Moore · Party guest','A girl comes down the stairs so fast she nearly falls. Her face is grey.\n\n"There\'s a guy upstairs on the floor. He\'s SHAKING. He\'s not— somebody HELP!"',[['Run upstairs',null]]),
   go([0,0],'Investigate the disturbance in the upstairs bedroom',{press:1,act:'Open the door',r:2.4,goal:()=>{const{U}=c4Stash(),x=U.x0+8.6,z=U.z0+12.2;return P.inside==='asr_up'?[x,z]:c3Route({int:'asr_up',x,z})},start:()=>{const st=curStep(),{U}=c4Stash();st.x=U.x0+8.6;st.z=U.z0+12.2;c4StashScene(1);c4TreyDown()}}),
   {t:'cine',run:c4Discover}],
  fin:()=>{c4Next('c4qb')}},

 {id:'c4qb',ch:4,main:1,name:'Quarterback Crack',at:[91,76],pre:['c4party'],steps:()=>[
   {t:'fx',f:()=>{if(!(C4.pt&&c4Live(C4.pt.marcus)))c4PartyScene();if(P.inside!=='asr_up'){goIn('asr_up');const{U}=c4Stash();P.x=U.x0+9.5;P.z=U.z0+13;P.y=0}c4StashScene(1);c4TreyDown()}},
   {t:'cine',run:c4CprCine},
   go([0,0],'Carry Trey downstairs to Marcus and Deion',{press:1,act:'Get Marcus and Deion',r:2.8,goal:()=>{const m=C4.pt&&C4.pt.marcus;return!c4Live(m)?null:P.inside==='asr'?[m.x,m.z]:c3Route({int:'asr',x:m.x,z:m.z})},start:()=>{c4CarryQB(1);toast('You get Trey over your shoulders. He weighs a ton.',3000)},
     tick:()=>{const st=curStep(),m=C4.pt&&C4.pt.marcus;if(st&&c4Live(m)&&P.inside==='asr'){st.x=m.x;st.z=m.z}else if(st){st.x=1e5;st.z=1e5}},done:()=>{c4CarryQB(0)}}),
   {t:'cine',run:c4Ambulance}],
  fin:()=>{c4Next('c4game')}},

 {id:'c4game',ch:4,main:1,name:'The Unexpected Starter',at:[500,297],pre:['c4qb'],steps:()=>{const ar=c4Armory();return[
   go(ar,'Visit the team\'s practice facility at the Armory Fieldhouse',{r:5.5}),
   {t:'cine',run:c4CoachMeet},
   {t:'cine',run:c4PracticeCine},
   {t:'cine',run:c4Pregame},
   {t:'cine',run:c4Drive1},
   {t:'cine',run:c4Montage},
   {t:'cine',run:c4FinalCine},
   {t:'cine',run:c4AfterParty}]},
  fin:()=>{c4CleanAll();stand(10);rep('athletes',15);toast('Homecoming is over. Alpha Sigma Rho has a Cup, and Grant has a problem.',5200)}}];
M.push(...C4M);
function c4FunGoal(){const s=c4S(),sp=c4FunSpots();for(const[k,,who]of C4FUN){if(s.fun[k]===2)continue;if(k==='music')return sp.speaker;if(s.hold===k){const n=C4.cast[who];return c4Live(n)?[n.x,n.z]:null}if(!s.hold)return k==='gator'?sp.cooler:sp.grill}return null}

// ================================================================ hooks: prompts, tick, saves
function c4Prompts(add){if(!AM||!C4IDS.includes(AM.m.id))return;const st=curStep(),s=c4S();if(!st)return;
  if(st.ok===c4MeetOk){C4LAWN().forEach((nm,i)=>{const n=C4.cast[nm];if(!s.met[i]&&c4Live(n)&&!P.inside)add(n.x,n.z,2.3,'Introduce yourself to '+nm,()=>c4Intro(i),0)})}
  const R=C4.relay;if(R&&R.state==='wait'&&!P.inside){const[x,z]=c4F(C4RU0,C4LANE[1]);add(x,z,3,'Take your mark',()=>c4RelayGo(),0)}
  if(AM.m.id==='c4stars'&&!P.inside){s.stars=s.stars||{};C4STAR.forEach(([nm],i)=>{const n=C4.cast[nm];if(!s.stars[i]&&c4Live(n)&&st.t==='cond'&&/Meet the three/.test(st.lab()))add(n.x,n.z,2.4,'Talk to '+nm,()=>c4Star(i),0)});
    if(st.t==='cond'&&/organized/.test(st.lab())){const sp=c4OrgSpots();for(const[k,l]of C4ORG){if(s.org[k])continue;const p=sp[k],x=Array.isArray(p)?p[0]:p.x,z=Array.isArray(p)?p[1]:p.z;add(x,z,2.4,{rope:'Take the rope back',cones:'Reset the cones',eggs:'Take the egg crate back'}[k],()=>{s.org[k]=1;sfx('ok');if(!Array.isArray(p))bubble(p,{rope:'Fine! FINE. Take your rope.',eggs:'We were using that…'}[k]||'Okay okay.',2.2);else toast('Cones back on the line.',2000);updObj()},0)}}
    if(st.t==='cond'&&/good time/.test(st.lab())){const sp=c4FunSpots();
      if(!s.hold&&s.fun.gator!==2)add(sp.cooler[0],sp.cooler[1],2,'Grab a blue Gatorade',()=>{s.hold='gator';s.fun.gator=1;sfx('coin');updObj()},0);
      if(!s.hold&&s.fun.wings!==2)add(sp.grill[0],sp.grill[1],2,'Grab a plate of wings',()=>{s.hold='wings';s.fun.wings=1;sfx('coin');updObj()},0);
      if(s.fun.music!==2)add(sp.speaker[0],sp.speaker[1],2,'Change the playlist',()=>{s.fun.music=2;c4Song(1);setTimeout(()=>{if(!C4.band||!C4.band.g.visible)c4Song(0)},14000);const d=C4.cast['Deion Carter'];if(c4Live(d)){bubble(d,'…Okay. OKAY. That\'s a song.',2.6);d.pup.st='wave';setTimeout(()=>{if(d.pup)d.pup.st=''},3000)}updObj()},0);
      for(const[k,,who]of C4FUN){if(s.hold!==k)continue;const n=C4.cast[who];if(c4Live(n))add(n.x,n.z,2.4,k==='gator'?'Hand Trey the Gatorade':'Give Marcus the wings',()=>{s.hold=null;s.fun[k]=2;sfx('ok');bubble(n,k==='gator'?'Blue. Correct. You might go places, pledge.':'Now THIS is a pairing.',2.8);updObj()},0)}}}
  if(AM.m.id==='c4party'&&P.inside){const I=INT.asr;if(P.inside==='asr'&&st.t==='cond'&&/run the party/.test(st.lab()))for(const[k,l,x,z]of C4JOB)if(!s.party[k])add(I.x0+x,I.z0+z,2.4,l.replace(/ at the.*| in the.*| out the.*/,''),()=>c4Job(k),0);
    if(P.inside==='asr'&&st.t==='cond'&&/side piece/.test(st.lab()))C4SIDE.forEach(([nm],i)=>{const n=C4.cast[nm];if(c4Live(n)&&!(s.no||{})[i])add(n.x,n.z,2.3,'Talk to '+nm,()=>c4Flirt(i),0)});
    if(st.t==='cond'&&/Find Brett/.test(st.lab())){if(P.inside==='asr'&&!s.clue.coat)add(I.x0+22,I.z0+32.5,2.4,'Check the coat pile',()=>{s.clue.coat=1;card({title:'Homecoming Party',sp:'The coat pile',text:C4CLUE[0][4],ch:[['"The theatre. Of course."',null]]});updObj()},0);
      const b=C4.cast['Brett Calloway'];if(P.inside==='asr_top'&&c4Live(b))add(b.x,b.z,2.4,'Wake Brett up',()=>{s.clue.brett=1;bubble(b,'Five more minutes, Mom…',2.4);setTimeout(()=>{if(c4Live(b))bubble(b,'…Is it Saturday? Did we win? I\'m going, I\'m GOING.',2.6)},1600);b.pup.lie=0;setTimeout(()=>{if(c4Live(b))despawn(b)},4200);updObj()},0)}}}
// campus walkers keep out of the way while the field is in use
function c4FieldClear(){for(const n of NP){if(n.c4tag||n.c4fr||n.grab||n.int||!n.g||!n.g.visible)continue;const[u,v]=c4UV(n.x,n.z);if(Math.abs(u)<40&&Math.abs(v)<17.5)n.g.visible=false}}
function c4CleanAll(){c4Off();c4Section(0);c4StandsOn(0);c4Band(0);c4Song(0);for(const k in C4.props)C4.props[k].visible=false;if(C4.partyOn){c3Party(0);C4.partyOn=0}if(C4.carry)c4CarryQB(0);C4FB.on=0;c4Board(null);c4Tags(0);if(C4FB.ball)C4FB.ball.visible=false;for(const r of C4FB.rings)r.visible=false;c4Jersey(0);C4.relay=null;if(C4.secSign){sc.remove(C4.secSign);C4.secSign=null}if(C4.ambM)C4.ambM.visible=false;C4.amb=null;c1Hud(null)}
function c4Tick(dt){if(mode==='title'||mode==='loading')return;if(C4FB.on||C4.stand&&C4.stand.home.g.visible||C4.props.games&&C4.props.games.visible)c4FieldClear();c4PupUpd(dt);c4DanUpd(dt);c4FxUpd(dt);c4StandUpd(dt);c4BandUpd(dt);c4SongUpd(dt);c4AmbUpd(dt);c4BubUpd(dt);
  if(C4.tugUpd)C4.tugUpd(dt);if(C4.eggUpd)C4.eggUpd(dt);if(C4.cprUpd)C4.cprUpd(dt);if(C4FB.on)c4FbUpd(dt);if(C4.carry)c4CarryUpd(dt);
  if(C4.cupHeld&&C4.cup&&c4Live(C4.cupHeld)){const p=C4.cupHeld;C4.cup.position.set(p.x,p.y+2.25+Math.sin(TT*4)*.05,p.z)}
  if((C4.T-=dt)>0)return;C4.T=1.5;if(S.ch>=4&&!C4.applied)c4Apply(1);else if(S.ch<4&&C4.applied)c4Apply(0);
  if(!CINE&&mode==='play'&&(!AM||!C4IDS.includes(AM.m.id)&&!C5IDS.includes(AM.m.id)&&!C6IDS.includes(AM.m.id)&&!C7IDS.includes(AM.m.id)&&!C8IDS.includes(AM.m.id)&&!C9IDS.includes(AM.m.id)&&!C10IDS.includes(AM.m.id))&&TT-C4.chainT>8&&(C4.mine.length||C4.partyOn||C4.stand&&C4.stand.home.g.visible))c4CleanAll()}
function c4Migrate(d){if(!d)return;if(S.done.final&&S.ch<11)S.ch=11;if(S.ch>=5)for(const id of C4IDS)S.done[id]=1;const s=c4S();s.hold=null;
  setTimeout(()=>{try{if(!AM||!C4IDS.includes(AM.m.id)&&!C5IDS.includes(AM.m.id)&&!C6IDS.includes(AM.m.id)&&!C7IDS.includes(AM.m.id)&&!C8IDS.includes(AM.m.id)&&!C9IDS.includes(AM.m.id)&&!C10IDS.includes(AM.m.id))c4CleanAll()}catch(e){}},0);setTimeout(()=>{try{c4Apply(S.ch>=4)}catch(e){console.warn('c4Migrate',e)}},5)}
