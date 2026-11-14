/* ================================================================ V411 PLEDGE TRIALS ON A STAGE
   Every pledge job trial keeps its game (meter, tap-the-beat, colour memory, sorting, quiz, grid) but now plays over an animated scene built at
   the spot on campus where the trial is: the game panel docks at the bottom of the screen, the camera frames Danny and his props in the real
   surroundings, and every round is acted out (a free throw arcs to a hoop and drops or rims out, the club cracks the boulder or bounces off...).
   The engines in 22c call mgEv(type,data); the stage listens. TRL[job+index] picks the act and its options.
   The three sneaking trials are not panels at all: trSneak (bottom of this file) runs them live in the world with patrols and green sight cones.
   Stage space: a group at Danny's feet turned to face his props. Local +z is forward, +x is his right, +y is up. */
let TRS=null;
function mgEv(t,d){if(TRS&&TRS.on)try{TRS.on(t,d||{})}catch(e){console.warn('trial stage',e)}}
const TRSNEAK={burglar2:{who:'Security guard',cl:'staff',n:3,line:'Past the guards to the back door.'},grenade1:{who:'Drill sergeant',cl:'brothers',n:3,crawl:1,line:'Stay low. Crawl to the far flag.'},delinquent1:{who:'Campus police',cl:'cops',n:4,line:'Lose them. Get to the alley.'}};
const TRL={
 popstar0:{a:'beat',g:'clap',prop:'micstand'},popstar1:{a:'mem',shape:'light'},popstar2:{a:'sort',item:0xc8a24a},
 stats0:{a:'quiz'},stats1:{a:'meter',m:'count'},stats2:{a:'mem',shape:'panel'},
 skate0:{a:'meter',m:'kickflip'},skate1:{a:'beat',g:'pump',prop:'ramp'},skate2:{a:'grid',mover:'skate',wall:'bench'},
 burglar0:{a:'meter',m:'lock'},burglar1:{a:'mem',shape:'dial'},
 fruit0:{a:'sort',item:0xd8442e},fruit1:{a:'meter',m:'chop'},fruit2:{a:'mem',shape:'crate'},
 ouija0:{a:'mem',shape:'candle'},ouija1:{a:'quiz'},ouija2:{a:'meter',m:'cold'},
 caveman0:{a:'meter',m:'boulder'},caveman1:{a:'beat',g:'drum',prop:'log'},caveman2:{a:'sort',item:0x8a8a84},
 weather0:{a:'quiz'},weather1:{a:'meter',m:'baro'},weather2:{a:'mem',shape:'panel'},
 basketball0:{a:'meter',m:'hoop'},basketball1:{a:'beat',g:'dribble',prop:'ball'},basketball2:{a:'quiz'},
 pouch0:{a:'mem',shape:'person'},pouch1:{a:'sort',item:0x3a6a3a},pouch2:{a:'meter',m:'zip'},
 grenade0:{a:'meter',m:'dive'},grenade2:{a:'beat',g:'pushup'},
 morning0:{a:'beat',g:'bugle',prop:'flag'},morning1:{a:'mem',shape:'flag'},morning2:{a:'quiz'},
 delinquent0:{a:'meter',m:'tag'},delinquent2:{a:'sort',item:0xd8b048},
 captain0:{a:'mem',shape:'person'},captain1:{a:'beat',g:'march',prop:'squad'},captain2:{a:'quiz'},
 hype0:{a:'beat',g:'bounce',prop:'crowd'},hype1:{a:'mem',shape:'person'},hype2:{a:'meter',m:'crowd'},
 snack0:{a:'sort',item:0xe8a040},snack1:{a:'meter',m:'tray'},snack2:{a:'mem',shape:'person'},
 scribe0:{a:'mem',shape:'scroll'},scribe1:{a:'meter',m:'notes'},scribe2:{a:'quiz'},
 mascot0:{a:'beat',g:'dance',prop:'crowd'},mascot1:{a:'meter',m:'dummy'},mascot2:{a:'sort',item:0xe2d6b8},
 cone0:{a:'grid',mover:'cart',wall:'hole'},cone1:{a:'meter',m:'stack'},cone2:{a:'quiz'}};
const TRCOL=[0xd84a4a,0x3a8ad8,0xe2b64c,0x3aa86a];

/* ---------------------------------------------------------------- building blocks */
function trAdd(m,x,y,z){m.position.set(x||0,y||0,z||0);m.castShadow=true;m.userData.noMerge=1;TRS.g.add(m);return m}
const trBox=(w,h,d,c,x,y,z)=>trAdd(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt(c,.7)),x,y,z);
const trCyl=(a,b,h,c,x,y,z,n)=>trAdd(new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,n||14),mt(c,.7)),x,y,z);
const trSph=(r,c,x,y,z)=>trAdd(new THREE.Mesh(new THREE.SphereGeometry(r,14,10),mt(c,.6)),x,y,z);
function trGlow(r,c,x,y,z){const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.9}));return trAdd(m,x,y,z)}
function trSign(t,w,h,x,y,z,bg,fg){const s=signMesh(t,w,h,bg||'#1b2440',fg||'#f4e6c8','Archivo');const s2=s.clone();s2.rotation.y=PI;const g=new THREE.Group();g.add(s);g.add(s2);s.rotation.y=PI;s2.rotation.y=0;return trAdd(g,x,y,z)}
function trTw(d,f,end){TRS.tw.push({t:0,d,f,end});try{f(0)}catch(e){}}
function trLater(d,f){TRS.tw.push({t:0,d,f:()=>{},end:f})}
function trW(x,y,z){return TRS.g.localToWorld(new THREE.Vector3(x,y,z))}
function trHand(side){const h=PM.P[side==='L'?'hL':'hR'],v=new THREE.Vector3();PM.updateMatrixWorld(true);if(h)h.getWorldPosition(v);else v.copy(PM.position).setY(PM.position.y+1.1);return TRS.g.worldToLocal(v)}
function trPop(t,col,x,y,z){const tx=ctex(256,96,(q,w,h)=>{q.clearRect(0,0,w,h);q.font='900 58px Archivo,Arial';q.textAlign='center';q.textBaseline='middle';q.lineWidth=10;q.strokeStyle='rgba(10,10,14,.85)';q.strokeText(t,w/2,h/2);q.fillStyle=col;q.fillText(t,w/2,h/2)});
  tx.wrapS=tx.wrapT=THREE.ClampToEdgeWrapping;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthTest:false,depthWrite:false}));s.scale.set(1.5,.56,1);s.renderOrder=20;trAdd(s,x,y,z);s.castShadow=false;
  trTw(1.1,u=>{s.position.y=y+u*.8;s.material.opacity=u<.7?1:1-(u-.7)/.3},()=>{TRS.g.remove(s);s.material.dispose();tx.dispose()})}
function trBurst(c,x,y,z,n,sp){for(let i=0;i<(n||8);i++){const m=trGlow(.04+rnd()*.04,c,x,y,z),vx=(rnd()-.5)*(sp||3),vz=(rnd()-.5)*(sp||3),vy=1.5+rnd()*2.5;m.castShadow=false;
    trTw(.7,u=>{const t=u*.7;m.position.set(x+vx*t,Math.max(.03,y+vy*t-6*t*t),z+vz*t);m.material.opacity=1-u},()=>TRS.g.remove(m))}}
/* an arc from A to B (local points), peak h above the higher end */
function trArc(m,A,B,h,d,end){trTw(d,u=>{m.position.set(A.x+(B.x-A.x)*u,A.y+(B.y-A.y)*u+Math.sin(u*PI)*h,A.z+(B.z-A.z)*u);m.rotation.x+=.25},end)}
function trPerson(cl,x,z,face,o){const w=trW(x,0,z),n=c4Pup(cl,w.x,w.z,TRS.a+(face||0),Object.assign({tag:'trs',int:null,lvl:3},o||{}));try{bodyBuild(n.g)}catch(e){}n.g.visible=true;n.pup.y=TRS.gy;c4PupPlace(n,0);n.g.rotation.y=TRS.a+(face||0);try{animP(n.g,0,rnd()*9,'')}catch(e){}TRS.ppl.push(n);return n}
function trArms(n,ax,az,ex){const p=n.g&&n.g.P;if(!p||!p.aL)return;p.aL.rotation.set(ax,0,-az);p.aR.rotation.set(ax,0,az);if(p.eL){p.eL.rotation.set(ex||0,0,0);p.eR.rotation.set(ex||0,0,0)}}
function trHop(n,h,d){const y0=TRS.gy;trTw(d||.4,u=>{if(n.g)n.g.position.y=y0+Math.sin(u*PI)*h})}
/* Danny's one-shot gesture: k = pose key, d = seconds */
function trGest(k,d,ok){TRS.gs={k,t:0,d:d||.8,ok}}

/* ---------------------------------------------------------------- open / close / tick */
function trOpen(k,i,type){if(mode==='title'||P.inside)return;const L=TRL[k+i];if(!L)return;
  /* face the direction with the most open ground, so the props and the camera aren't inside a wall */
  let best=0,bs=-1;for(let q=0;q<16;q++){const a=q/16*TAU,fx=Math.sin(a),fz=Math.cos(a);let s=0;for(let d=1;d<=9;d+=1)if(freeAt(P.x+fx*d,P.z+fz*d,.7)){s+=d<5?2:1;/* and room either side, for crowds, crates and the grid */for(const l of[-2.6,2.6])if(d<8&&freeAt(P.x+fx*d+fz*l,P.z+fz*d-fx*l,.5))s+=.6}else break;
    for(const sd of[1,-1]){const cx=P.x-fx*3+fz*2.6*sd*1,cz=P.z-fz*3-fx*2.6*sd;if(freeAt(cx,cz,.4))s+=1.5}if(s>bs){bs=s;best=a}}
  const g=new THREE.Group();g.userData.noMerge=1;const gy=PM.position.y-(P.jy||0);g.position.set(P.x,gy,P.z);g.rotation.y=best;sc.add(g);g.updateMatrixWorld(true);
  TRS={k,i,L,type,g,a:best,gy,tw:[],ppl:[],t:0,gs:null,dan:{x:0,y:0,z:0,ry:0},on:null,base:null,hid:[],face0:P.face,sk:null,cam:{p:[2.5,2.5,-3.4],l:[.2,.9,2.2]},beat:0,nb:0};
  P.face=best;P.vx=P.vz=0;
  /* clear bystanders off the stage */
  for(const n of NP){if(n.g&&n.g.visible&&!n.int&&Math.hypot(n.x-P.x,n.z-P.z)<11&&!n.c4tag){n.g.visible=false;TRS.hid.push(n)}}
  const fx=Math.sin(best),fz=Math.cos(best),free=(x,z)=>{const w=trW(x,0,z);return freeAt(w.x,w.z,.35)};
  ({meter:trMeter,beat:trBeat,mem:trMem,sort:trSort,quiz:trQuiz,grid:trGrid})[L.a](L);
  /* V413 the Pop Star's trials have an audience, and they are not kind */if(k==='popstar')trAudience();
  /* camera: over his right shoulder unless that side is blocked */
  const c=TRS.cam,clr=sd=>(free(c.p[0]*sd,c.p[2])?2:0)+(free(c.p[0]*sd*.6,c.p[2]*.6)?1:0)+(free(c.p[0]*sd*.3,c.p[2]*.3+.3)?1:0);if(clr(-1)>clr(1)){c.p[0]=-c.p[0];c.l[0]=-c.l[0]}
  $('mg').classList.add('stg');trTick(0)}
function trClose(){const T=TRS;if(!T){$('mg').classList.remove('stg');return}TRS=null;$('mg').classList.remove('stg');try{c4Off('trs')}catch(e){}sc.remove(T.g);T.g.traverse(o=>{if(o.material&&o.material.dispose&&o.userData.own)o.material.dispose()});
  for(const n of T.hid)if(n.g)n.g.visible=true;for(const f of T.undo||[])try{f()}catch(e){}PM.position.set(P.x,T.gy,P.z);PM.rotation.set(0,P.face,0);PM.visible=true;try{animP(PM,0,TT,'')}catch(e){}}
function trTick(dt){try{trSnTick(dt)}catch(e){console.warn('trSneak',e)}const T=TRS;if(!T)return;if(mode!=='mg'){trClose();return}dt=Math.min(.05,dt||0);T.t+=dt;T.beat=Math.max(0,T.beat-dt*3.2);
  for(let i=T.tw.length-1;i>=0;i--){const w=T.tw[i];w.t+=dt;const u=Math.min(1,w.t/w.d);try{w.f(u)}catch(e){}if(u>=1){T.tw.splice(i,1);if(w.end)try{w.end()}catch(e){}}}
  /* Danny */
  const d=T.dan,w=trW(d.x,d.y,d.z);PM.position.copy(w);PM.rotation.set(d.rx||0,T.a+d.ry,d.rz||0);PM.rotation.order='YXZ';
  const p=PM.P;try{animP(PM,d.sp||0,T.t,'');prPose(dt)}catch(e){}
  if(T.base)try{T.base(p,T.t)}catch(e){}
  if(T.gs){const G=T.gs;G.t+=dt;const u=Math.min(1,G.t/G.d);try{TRPOSE[G.k](p,u,G.ok)}catch(e){}if(u>=1)T.gs=null}
  for(const n of T.ppl)if(n.pose)try{n.pose(n.g.P,T.t)}catch(e){}
  if(T.upd)try{T.upd(dt)}catch(e){}
  /* camera */
  const c=T.cam,sw=Math.sin(T.t*.35)*.18,cp=trW(c.p[0]+sw,c.p[1],c.p[2]),cl=trW(c.l[0],c.l[1],c.l[2]);/* the game panel covers the bottom of the screen, so aim low and sit a little higher: the action lands in the top half */cp.y=Math.max(cp.y+.45,terrH(cp.x,cp.z)+.7);cl.y-=1.15;
  cam.position.lerp(cp,T.t<.1||cam.position.distanceTo(cp)>8?1:Math.min(1,dt*3));cam.lookAt(cl);T.camW=[cp.x,cp.y,cp.z,cl.x,cl.y,cl.z]}
const trE=u=>u*u*(3-2*u);
/* Danny's gestures: p = his bones, u = 0..1, ok = how the round went */
const TRPOSE={
 throw:(p,u)=>{const a=u<.45?trE(u/.45):1,f=u<.45?0:trE(Math.min(1,(u-.45)/.2));p.aR.rotation.set(-2.6*a-.4*f+.9*f*0,0,.1);p.eR.rotation.set(-1.5*a*(1-f),0,0);p.aL.rotation.set(-1.9*a*(1-f*.6),0,-.25);p.eL.rotation.set(-1.2*a*(1-f),0,0);if(p.kL){const k=u<.45?Math.sin(u/.45*PI)*.5:0;p.kL.rotation.x+=k;p.kR.rotation.x+=k;p.lL.rotation.x-=k*.5;p.lR.rotation.x-=k*.5}},
 toss:(p,u)=>{const a=Math.sin(Math.min(1,u*1.6)*PI);p.aR.rotation.set(-1.5*a,0,.1);p.eR.rotation.set(-.6*(1-a),0,0)},
 swing:(p,u)=>{const up=u<.4?trE(u/.4):1-trE(Math.min(1,(u-.4)/.18)),dn=u<.4?0:trE(Math.min(1,(u-.4)/.18))*(1-Math.max(0,(u-.7)/.3));p.aR.rotation.set(-2.8*up-.7*dn,0,.25*up);p.eR.rotation.set(-1.1*up-.1*dn,0,0);p.spine.rotation.x+=-.15*up+.4*dn;p.chest.rotation.y+=.4*up-.4*dn},
 click:(p,u)=>{const a=Math.sin(u*PI);p.aR.rotation.set(-.9,0,.1);p.eR.rotation.set(-1.3-.3*a,0,0)},
 cheer:(p,u)=>{const a=Math.sin(Math.min(1,u*1.3)*PI),b=Math.abs(Math.sin(u*PI*3));p.aL.rotation.set(-2.8*a,0,-.35*a);p.aR.rotation.set(-2.8*a,0,.35*a);p.eL.rotation.set(-.3,0,0);p.eR.rotation.set(-.3,0,0);if(TRS)TRS.dan.y=Math.max(TRS.dan.y,0)+0;PM.position.y+=b*.22*a},
 pump:(p,u)=>{const a=Math.sin(Math.min(1,u*1.5)*PI);p.aR.rotation.set(-2.7*a,0,.2*a);p.eR.rotation.set(-1.2*a,0,0)},
 slump:(p,u)=>{const a=Math.sin(Math.min(1,u*1.2)*PI*.5+ (u>.83?0:0));p.spine.rotation.x+=.45*a;if(p.head)p.head.rotation.x+=.5*a;p.aL.rotation.set(.1*a,0,-.05);p.aR.rotation.set(.1*a,0,.05)},
 shake:(p,u)=>{const a=Math.sin(u*PI);p.aR.rotation.set(-1.1*a,0,.3*a);p.eR.rotation.set(-1.4*a,0,0);if(p.hR)p.hR.rotation.z=Math.sin(u*40)*.5*a;if(p.head)p.head.rotation.y+=Math.sin(u*14)*.25*a},
 point:(p,u,j)=>{const a=Math.sin(Math.min(1,u*1.4)*PI),s=[-.9,-.3,.3,.9][j|0];p.aR.rotation.set(-1.45*a,0,-s*.8*a);p.eR.rotation.set(-.1,0,0);if(p.head)p.head.rotation.y-=s*.5*a},
 write:(p,u)=>{p.aL.rotation.set(-.9,0,-.1);p.eL.rotation.set(-1.2,0,0);p.aR.rotation.set(-.8,0,-.35);p.eR.rotation.set(-1.5+Math.sin(u*50)*.12,0,0);if(p.head)p.head.rotation.x+=.35}};

/* ---------------------------------------------------------------- METER trials: one act per trial */
function trMeter(L){const T=TRS,M=TRMETER[L.m];T.cam={p:[2.6,2.4,-3.2],l:[.1,.9,2.4]};const st=M.build(T)||{};T.st=st;
  T.on=(t,d)=>{if(t==='pos'){T.pos=d.p;T.zc=d.z+d.zw/2}else if(t==='res'){M.act(T,st,d.ok,d.i|0)}else if(t==='end')trEnd(d.pass)}}
function trEnd(pass){const T=TRS;if(!T)return;trLater(.35,()=>{if(!TRS)return;if(pass){trGest('cheer',1.3);trPop('PASSED','#7ef0a0',0,2.5,0);trBurst(0xffd34a,0,2.1,0,14,4);for(const n of T.ppl){trHop(n,.25,.5);trArms(n,-2.7,.4,-.3)}}else{trGest('slump',1.3);trPop('NOT YET','#ff8a7a',0,2.5,0)}})}
const TRMETER={
 /* Free Throws: from the three-point line, 6.75 m out */
 hoop:{build:T=>{T.cam={p:[3.4,2.6,-3.6],l:[.3,1.9,4]};trCyl(.08,.1,3.2,0x3a3d44,0,1.6,7.4);trBox(.16,.12,.9,0x3a3d44,0,3.12,7);trBox(1.8,1.05,.06,0xf4f4f0,0,3.25,6.75+.42);trBox(.6,.45,.02,0xd8442e,0,3.12,6.75+.385);
    const rim=trAdd(new THREE.Mesh(new THREE.TorusGeometry(.23,.02,8,24),mt(0xe8641c,.5)),0,3.05,6.75);rim.rotation.x=PI/2;const net=trAdd(new THREE.Mesh(new THREE.CylinderGeometry(.23,.14,.42,12,1,true),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.8})),0,2.83,6.75);
    const line=trAdd(new THREE.Mesh(new THREE.RingGeometry(6.7,6.78,48,1,PI*.72,PI*.56).rotateX(-PI/2),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,side:THREE.DoubleSide})),0,.03,6.75);line.rotation.y=PI/2*0;
    const hb=PM.userData.ball;T.undo=[()=>{if(hb)hb.visible=true}];return{net,hb}},
  act:(T,s,ok)=>{trGest('throw',.8);trLater(.42,()=>{if(!TRS)return;if(s.hb)s.hb.visible=false;const b=trSph(.12,0xe8641c,0,0,0),A=trHand('R').add(new THREE.Vector3(0,.25,.1)),B=new THREE.Vector3(ok?0:(rnd()<.5?-.26:.27),3.08,ok?6.75:6.6);tone(300,.05,'sine',.05);
      trArc(b,A,B,1.9,.75,()=>{if(!TRS)return;if(ok){tone(880,.08,'triangle',.07);trTw(.25,u=>{b.position.set(0,3.05-u*1.1,6.75);s.net.scale.set(1+Math.sin(u*PI)*.25,1,1+Math.sin(u*PI)*.25)},()=>{trPop('SWISH','#ffb14a',0,3.6,6.4);trTw(.5,u=>{b.position.y=1.95-u*1.8+Math.sin(u*PI)*.4},()=>{TRS&&TRS.g.remove(b);if(s.hb)s.hb.visible=true})})}
        else{noise(.06,.1,1200);trPop('CLANK','#ff8a7a',0,3.6,6.4);const vx=B.x*5;trTw(.7,u=>{b.position.set(B.x+vx*u,3.1+Math.sin(u*PI)*.5-u*u*2.9,6.6-u*1.8)},()=>{TRS&&TRS.g.remove(b);if(s.hb)s.hb.visible=true})}})})}},
 /* Click the Counter: people cross a chalk line; he thumbs the clicker */
 count:{build:T=>{trBox(5,.02,.1,0xffffff,0,.02,2.6);const W=[];for(let i=0;i<3;i++){const n=trPerson(pick(['studentgov','athletes','activists','studentgov']),-4-i*2.6,2.6+(i%2?.5:-.3),PI/2);n.wx=-4-i*2.6;W.push(n)}T.base=(p)=>{p.aR.rotation.set(-.9,0,.1);p.eR.rotation.set(-1.3,0,0)};
    T.upd=dt=>{for(const n of W){n.wx+=dt*1.5;if(n.wx>5)n.wx=-5;const w=trW(n.wx,0,2.6);n.x=w.x;n.z=w.z;n.g.position.set(w.x,T.gy,w.z);try{animP(n.g,1.5,T.t+n.uid,'')}catch(e){}}};return{W}},
  act:(T,s,ok)=>{trGest('click',.5);tone(1500,.03,'square',.04);trPop(ok?'+1':'??',ok?'#7ef0a0':'#ff8a7a',.3,1.9,.4)}},
 /* Land the Kickflip */
 kickflip:{build:T=>{const sk=PM.userData.sk||PM.userData.board;const b=new THREE.Group();const d=new THREE.Mesh(roundBox(.24,.03,.82,.02,2),mt(0x2a2c33,.7));b.add(d);for(const z of[-.28,.28])for(const x of[-.09,.09]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.03,10),mt(0xf2e8c8,.5));w.rotation.z=PI/2;w.position.set(x,-.05,z);b.add(w)}trAdd(b,0,.09,0);T.dan.y=.11;trBox(3,.02,.5,0x6a6f78,0,.01,0);return{b}},
  act:(T,s,ok)=>{const b=s.b;tone(220,.06,'square',.06);trTw(.7,u=>{const h=Math.sin(u*PI)*.75;T.dan.y=.11+h;b.position.y=.09+h*.8;b.rotation.z=u*TAU*(ok?1:.72);if(u>.99){b.rotation.z=ok?0:PI/2}const p=PM.P;if(p.kL){p.kL.rotation.x+=Math.sin(u*PI)*1.1;p.kR.rotation.x+=Math.sin(u*PI)*1.1;p.lL.rotation.x-=Math.sin(u*PI)*.8;p.lR.rotation.x-=Math.sin(u*PI)*.8}},()=>{if(!TRS)return;if(ok){noise(.06,.1,500);trPop('BOLTS','#7ef0a0',0,2.3,0)}else{sfx('hit');trPop('PRIMO','#ff8a7a',0,2.3,0);trTw(.6,u=>{T.dan.rz=Math.sin(u*PI)*.5;T.dan.y=.11*(1-Math.sin(u*PI))},()=>{T.dan.rz=0;b.rotation.z=0})}})}},
 /* Pick the Lock: a door, five pin lights over it */
 lock:{build:T=>{T.cam={p:[2,1.7,-1.6],l:[0,1,1.2]};trBox(1.5,2.5,.14,0x5a3a26,0,1.25,1.25);trBox(1.9,2.8,.1,0x8a8f98,0,1.4,1.33);trSph(.06,0xd8b048,.5,1.02,1.15);const L=[];for(let i=0;i<5;i++)L.push(trGlow(.07,0x444850,-.4+i*.2,2.75,1.2));T.dan.z=.35;T.dan.x=.25;
    T.base=(p)=>{p.hips.position.y-=.34;p.lL.rotation.x=-1.3;p.kL.rotation.x=2.1;p.lR.rotation.x=-.2;p.kR.rotation.x=1.5;p.spine.rotation.x+=.3;p.aR.rotation.set(-1.25,0,.05);p.eR.rotation.set(-.5+Math.sin(T.t*9)*.06,0,0);p.aL.rotation.set(-1.1,0,-.15);p.eL.rotation.set(-.7,0,0)};return{L}},
  act:(T,s,ok,i)=>{const m=s.L[Math.min(4,i)];m.material.color.set(ok?0x4ad06a:0xd84a4a);if(ok){tone(1200,.04,'square',.06);trBurst(0xffe2a0,.5,1.02,1.1,5,1.5)}else{noise(.08,.08,2400);trGest('shake',.6)}}},
 /* Slice It Clean: a table, the fruit, a cleaver */
 chop:{build:T=>{T.cam={p:[2.1,2.1,-1.9],l:[0,.95,.8]};trBox(1.5,.08,.8,0x8a6a40,0,.92,.85);for(const[x,z]of[[-.65,.55],[.65,.55],[-.65,1.15],[.65,1.15]])trBox(.07,.9,.07,0x5a4630,x,.45,z);trBox(.6,.04,.4,0xd8c8a0,0,.98,.8);const f=trSph(.13,0x6aa84a,0,1.12,.8);f.scale.set(1.25,1,1);return{f}},
  act:(T,s,ok)=>{trGest('swing',.75);trLater(.4,()=>{if(!TRS)return;noise(.05,.12,ok?900:300);if(ok){const f=s.f;f.visible=false;const h=[-1,1].map(d=>{const m=trSph(.13,0xd8442e,d*.02,1.12,.8);m.scale.set(.6,1,1);return m});trTw(.5,u=>{h.forEach((m,k)=>{m.position.x=(k?1:-1)*(.02+u*.22);m.rotation.z=(k?-1:1)*u*1.2})},()=>{h.forEach(m=>TRS&&TRS.g.remove(m));f.visible=true;f.material=mt(pick([0x6aa84a,0xe8a040,0xd8442e,0xe8d048]),.6)});trPop('CLEAN','#7ef0a0',0,1.9,.8)}else{trBurst(0xd8442e,0,1.15,.8,12,3);trPop('SPLAT','#ff8a7a',0,1.9,.8)}})}},
 /* Find the Cold Spot */
 cold:{build:T=>{const o=trGlow(.5,0x7ac8ff,0,1.2,2.6);o.material.opacity=0;o.scale.set(.7,1.5,.7);T.base=(p)=>{p.aR.rotation.set(-1.3,0,Math.sin(T.t*1.3)*.5);p.eR.rotation.set(-.2,0,0)};return{o}},
  act:(T,s,ok)=>{if(ok){tone(180,.5,'sine',.08);const x=(rnd()-.5)*2.4;s.o.position.x=x;trTw(.85,u=>{s.o.material.opacity=Math.sin(u*PI)*.55;s.o.position.y=1.2+u*.3});trPop('ICE COLD','#9adcff',x,2.4,2.6)}else{trGest('shake',.6);trPop('NOTHING','#c8c8c8',0,2.2,1)}}},
 /* Club the Boulder */
 boulder:{build:T=>{const r=trAdd(new THREE.Mesh(new THREE.DodecahedronGeometry(.7,1),mt(0x7a7a74,.95)),0,.55,1.25);r.scale.set(1.2,.9,1);const cr=trBox(.05,.5,.03,0x1b1b1b,.1,.8,.6);cr.rotation.z=.4;cr.visible=false;return{r,cr,n:0}},
  act:(T,s,ok)=>{trGest('swing',.75);trLater(.4,()=>{if(!TRS)return;if(ok){s.n++;tone(70,.2,'sine',.25);noise(.12,.2,400);s.cr.visible=true;s.cr.scale.y=.6+s.n*.35;trBurst(0x8a8a84,0,.9,.7,10,3.5);s.r.scale.y=Math.max(.5,.9-s.n*.07);trPop('CRACK','#ffb14a',0,2,1.1)}else{noise(.06,.12,1800);trPop('BONK','#ff8a7a',0,2,1.1);trLater(.1,()=>trGest('shake',.55))}})}},
 /* Stack the Cones */
 stack:{build:T=>{T.cam={p:[2.4,2.3,-2.4],l:[0,1.1,1.2]};const cone=(y)=>{const g=new THREE.Group();const c=new THREE.Mesh(new THREE.ConeGeometry(.2,.62,14,1,true),SM({color:0xff6a1a,roughness:.6,side:THREE.DoubleSide}));c.position.y=.31;g.add(c);const b=new THREE.Mesh(new THREE.BoxGeometry(.46,.04,.46),mt(0x2a2a30,.7));b.position.y=.02;g.add(b);return trAdd(g,0,y,1.3)};return{cone,L:[cone(0)]}},
  act:(T,s,ok)=>{trGest('toss',.6);const y=s.L.length*.16,c=s.cone(0),A=trHand('R');trTw(.45,u=>{c.position.set(A.x*(1-u),A.y+(y-A.y)*u+Math.sin(u*PI)*.5,A.z+(1.3-A.z)*u)},()=>{if(!TRS)return;if(ok){s.L.push(c);tone(500+s.L.length*60,.05,'triangle',.07)}else{sfx('hit');const all=s.L.splice(1).concat([c]);all.forEach((m,k)=>{const dx=(rnd()-.5)*3,dz=(rnd()-.3)*2.5,y0=m.position.y;trTw(.6,u=>{m.position.set(dx*u,Math.max(.1,y0+Math.sin(u*PI)*.5-u*y0),1.3+dz*u);m.rotation.z=u*1.5*(k%2?1:-1)},()=>TRS&&TRS.g.remove(m))});trPop('TIMBER','#ff8a7a',0,2.2,1.3)}})}},
 /* Read the Barometer: an instrument on a tripod, Danny logs it */
 baro:{build:T=>{T.cam={p:[2,1.9,-2],l:[0,1.2,1]};for(const a of[0,2.1,4.2])trCyl(.02,.02,1.4,0x3a3d44,Math.sin(a)*.3,.65,1.3+Math.cos(a)*.3).rotation.set(Math.cos(a)*.25,0,-Math.sin(a)*.25);const d=trCyl(.28,.28,.08,0xd8b048,0,1.45,1.3);d.rotation.x=PI/2;const f=trCyl(.24,.24,.09,0xf4f1e4,0,1.45,1.29);f.rotation.x=PI/2;const nd=trBox(.02,.22,.01,0xc8202e,0,1.45,1.24);
    T.base=(p)=>{TRPOSE.write(p,T.t*.02);nd.rotation.z=((T.pos||.5)-.5)*2.4};return{}},
  act:(T,s,ok)=>{trPop(ok?'LOGGED':'SMUDGE',ok?'#7ef0a0':'#ff8a7a',0,2.2,1.2);if(!ok)trGest('shake',.6);else tone(900,.05,'triangle',.06)}},
 /* Quick Zip: a brother with his hand out */
 zip:{build:T=>{const n=trPerson('brothers',0,1.7,PI,{name:'Brother'});n.pose=(p)=>{p.aR.rotation.set(-1.2,0,.1);p.eR.rotation.set(-.3,0,0)};return{n}},
  act:(T,s,ok)=>{trGest('toss',.55);const it=trBox(.1,.06,.14,pick([0xf2f2ee,0xc8202e,0x3a8ad8]),0,0,0),A=new THREE.Vector3(.2,.95,.15),B=ok?new THREE.Vector3(.15,1.15,1.35):new THREE.Vector3(.6,.04,.9);noise(.05,.06,3000);trArc(it,A,B,ok?.35:.5,.45,()=>{if(!TRS)return;trPop(ok?'GOT IT':'DROPPED',ok?'#7ef0a0':'#ff8a7a',0,2.2,1.2);trLater(.35,()=>TRS&&TRS.g.remove(it))})}},
 /* Time the Dive: something lands, he throws himself on it */
 dive:{build:T=>{T.cam={p:[3.2,2.4,-2.2],l:[0,.5,1.8]};const ring=trAdd(new THREE.Mesh(new THREE.RingGeometry(.35,.45,24).rotateX(-PI/2),new THREE.MeshBasicMaterial({color:0xffd34a,transparent:true,opacity:.85,side:THREE.DoubleSide})),0,.03,2.6);const it=trSph(.09,0x4a6a2a,0,.09,2.6);return{ring,it}},
  act:(T,s,ok)=>{const land=ok?2.1:1.1;tone(160,.2,'sawtooth',.06);trTw(.5,u=>{T.dan.z=land*trE(u);T.dan.y=Math.sin(u*PI)*.45;T.dan.rx=1.35*trE(u);const p=PM.P;p.aL.rotation.set(-2.9,0,-.2);p.aR.rotation.set(-2.9,0,.2)},()=>{if(!TRS)return;noise(.1,.15,300);trPop(ok?'SMOTHERED':'SHORT','#'+(ok?'9ac84a':'ff8a7a'),0,1.4,land);trTw(.38,u=>{T.dan.rx=1.35;const p=PM.P;p.aL.rotation.set(-2.9,0,-.2);p.aR.rotation.set(-2.9,0,.2)},()=>{T.dan.z=0;T.dan.y=0;T.dan.rx=0})})}},
 /* Tag the Wall: a plywood board, one letter per good spray */
 tag:{build:T=>{T.cam={p:[2.4,2,-2.2],l:[0,1.3,1.4]};trBox(3.2,2,.08,0xc8b48a,0,1.3,1.6);for(const x of[-1.4,1.4])trBox(.1,2.3,.1,0x6a5a40,x,1.15,1.68);const L=[];'ΑΣΡ!!'.split('').forEach((ch,i)=>{const s=trSign(ch,.5,.7,-1.1+i*.55,1.35,1.55,'#c8b48a','#d8261e');s.visible=false;L.push(s)});return{L,can:PM.userData.can}},
  act:(T,s,ok,i)=>{trTw(.7,u=>{const p=PM.P;p.aR.rotation.set(-1.32,0,-.18+Math.sin(u*20)*.1);p.eR.rotation.set(-.12,0,0)});noise(.4,.04,6500);const x=-1.1+Math.min(4,i)*.55;if(ok){trLater(.3,()=>{if(TRS)s.L[Math.min(4,i)].visible=true});trBurst(0xd8261e,x,1.35,1.5,6,1)}else{const d=trBox(.06,.5,.01,0xd8261e,x,1.2,1.55);trTw(.6,u=>{d.scale.y=.2+u;d.position.y=1.35-u*.25});trPop('DRIP','#ff8a7a',x,2.5,1.5)}}},
 /* Peak the Crowd */
 crowd:{build:T=>{T.cam={p:[3.2,2.8,-3.2],l:[0,1,2.6]};const C=[];for(let i=0;i<6;i++)C.push(trPerson(pick(['athletes','sororities','brothers','activists','studentgov']),-2.5+i,3+(i%2)*.9,PI));T.base=(p)=>{const b=Math.abs(Math.sin(T.t*4));p.aL.rotation.set(-2.5+b*.3,0,-.3);p.eL.rotation.set(-.4,0,0)};return{C}},
  act:(T,s,ok)=>{if(ok){trGest('pump',.7);s.C.forEach((n,i)=>trLater(i*.05,()=>{trHop(n,.4,.5);trArms(n,-2.7,.4,-.3);trLater(.6,()=>trArms(n,0,.1,0))}));trPop('YEAHHH','#ffd34a',0,2.9,3)}else{s.C.forEach(n=>{trArms(n,-.3,.5,-1.2);trLater(.7,()=>trArms(n,0,.1,0))});trPop('...','#c8c8c8',0,2.6,3);trGest('slump',.7)}}},
 /* Balance the Tray: a walk down a line of cones */
 tray:{build:T=>{T.cam={p:[3.4,2.4,1.5],l:[0,1,2.5]};for(let i=0;i<6;i++)trAdd(new THREE.Mesh(new THREE.ConeGeometry(.12,.35,10),mt(0xff6a1a,.6)),i%2?.9:-.9,.18,i*1+.5);trBox(1.8,.03,.12,0x3aa86a,0,.02,5.6);return{}},
  act:(T,s,ok,i)=>{const z0=T.dan.z,tr=PM.userData.tray;T.dan.sp=1.4;trTw(.8,u=>{T.dan.z=z0+u*1;if(tr)tr.rotation.z=ok?Math.sin(u*14)*.05:Math.sin(u*PI)*.7},()=>{if(!TRS)return;T.dan.sp=0;if(tr)tr.rotation.z=0;if(ok)tone(700,.05,'triangle',.06);else{sfx('hit');trBurst(0xe8a040,0,1.2,T.dan.z+.3,10,2.5);trPop('SPILL','#ff8a7a',0,2.3,T.dan.z)}})}},
 /* Keep Up With the Speaker: a lecturer at a lectern */
 notes:{build:T=>{trBox(.6,1.1,.45,0x5a3a26,0,.55,2.6);trBox(.7,.05,.55,0x6a4630,0,1.12,2.6);const n=trPerson('staff',0,3.1,PI,{name:'Speaker'});n.pose=(p,t)=>{p.aR.rotation.set(-1.1+Math.sin(t*3)*.5,0,.3);p.eR.rotation.set(-.9,0,0);p.aL.rotation.set(-.6,0,-.2+Math.sin(t*2.2)*.2);if(p.head)p.head.rotation.y=Math.sin(t*1.1)*.35};T.base=(p)=>TRPOSE.write(p,T.t*.02);return{}},
  act:(T,s,ok)=>{if(ok){tone(1100,.04,'square',.04);trPop('GOT THAT','#7ef0a0',.3,2.1,.3)}else{trGest('shake',.6);const pen=trBox(.015,.14,.015,0x1b1b1b,0,0,0),A=trHand('R');trArc(pen,A,new THREE.Vector3(1.4,.03,1),.9,.6,()=>trLater(.3,()=>TRS&&TRS.g.remove(pen)));trPop('WAIT, WHAT?','#ff8a7a',.3,2.1,.3)}}},
 /* Charge the Tackling Dummy */
 dummy:{build:T=>{T.cam={p:[3.6,2.3,-1.5],l:[0,.9,2.2]};const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.32,.36,1.5,16),mt(0x7a1f2b,.8));b.position.y=.85;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.24,14,10),mt(0x7a1f2b,.8));h.position.y=1.75;g.add(h);const bs=new THREE.Mesh(new THREE.CylinderGeometry(.5,.55,.14,16),mt(0x2a2a30,.8));bs.position.y=.07;g.add(bs);trAdd(g,0,0,4);return{d:g}},
  act:(T,s,ok)=>{tone(220,.25,'sawtooth',.07);trTw(.42,u=>{T.dan.z=3.3*trE(u);const p=PM.P;p.spine.rotation.x=.75;if(p.head)p.head.rotation.x=.35;p.aL.rotation.set(.5,0,-.3);p.aR.rotation.set(.5,0,.3);T.dan.sp=6},()=>{if(!TRS)return;T.dan.sp=0;noise(.15,.2,300);if(ok){trPop('BAAAM','#e8dcc0',0,2.4,4);trTw(.4,u=>{s.d.rotation.x=trE(u)*1.45})}else{trPop('OOF','#ff8a7a',0,2.4,3.4);trTw(.3,u=>{s.d.rotation.x=Math.sin(u*PI)*.25})}
      trTw(.45,u=>{T.dan.z=3.3-(ok?0:1)*Math.sin(u*PI*.5)*.8;if(!ok)T.dan.rx=-Math.sin(u*PI)*.4},()=>{T.dan.z=0;T.dan.rx=0;s.d.rotation.x=0})})}}};

/* ---------------------------------------------------------------- BEAT trials: every tap is a move */
function trBeat(L){const T=TRS;T.cam={p:[2.6,2.3,-3],l:[0,1,1.2]};const pr=L.prop,st={};
  if(pr==='micstand'){trCyl(.02,.02,1.5,0x3a3d44,0,.75,.7);trSph(.06,0x8a8f98,0,1.52,.7);st.band=[['studentgov',-1.6,2.6],['activists',0,3.1],['studentgov',1.6,2.6]].map(([c,x,z])=>trPerson(c,x,z,PI))}
  else if(pr==='ramp'){T.cam={p:[0,2.6,-5.5],l:[0,.8,0]};for(const s of[-1,1]){const m=trAdd(new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,3,20,1,true,s>0?PI*1.5:0,PI/2),SM({color:0x8a6a40,roughness:.8,side:THREE.DoubleSide})),s*.9,2.4,0);m.rotation.x=PI/2}trBox(1.8,.06,3,0x8a6a40,0,.03,0);const b=trBox(.82,.03,.24,0x2a2c33,0,.08,0);st.b=b;T.dan.ry=PI/2}
  else if(pr==='log'){const l=trCyl(.34,.34,1.5,0x6a4a2c,0,.5,.75,16);l.rotation.z=PI/2;st.l=l;st.band=[[-2,2.4],[2,2.4]].map(([x,z])=>trPerson('athletes',x,z,PI))}
  else if(pr==='ball'){st.ball=trSph(.12,0xe8641c,.28,.9,.25);const hb=PM.userData.ball;if(hb)hb.visible=false;T.undo=[()=>{if(hb)hb.visible=true}];for(let i=0;i<5;i++)trAdd(new THREE.Mesh(new THREE.ConeGeometry(.12,.35,10),mt(0xff6a1a,.6)),i%2?.8:-.8,.18,1+i)}
  else if(pr==='flag'){trCyl(.04,.05,6,0xc8ccd4,1.6,3,2.4);st.fl=trBox(1.3,.8,.03,0x7a1f2b,2.3,.9,2.4)}
  else if(pr==='squad'){st.band=[[-1,-1.3],[1,-1.3],[-1,-2.6],[1,-2.6]].map(([x,z])=>trPerson('brothers',x,z,0,{name:'Pledge'}));T.cam={p:[3.4,2.6,2.6],l:[0,1,-1]}}
  else if(pr==='crowd'){st.band=[];for(let i=0;i<6;i++)st.band.push(trPerson(pick(['athletes','sororities','brothers','activists']),-2.5+i,2.8+(i%2)*.9,PI));T.cam={p:[3.2,2.8,-3.2],l:[0,1,2]}}
  const G=L.g;T.base=(p,t)=>{const b=T.beat,n=T.nb;
    if(G==='clap'){const c=1-b;p.aL.rotation.set(-1.3,0,.25-c*.5);p.aR.rotation.set(-1.3,0,-.25+c*.5);p.eL.rotation.set(-.9,0,0);p.eR.rotation.set(-.9,0,0)}
    else if(G==='drum'){const s=n%2;p.aL.rotation.set(-1.2-(s?0:b*1.2),0,-.1);p.aR.rotation.set(-1.2-(s?b*1.2:0),0,.1);p.eL.rotation.set(-.6,0,0);p.eR.rotation.set(-.6,0,0);p.spine.rotation.x+=.25;if(st.l)st.l.scale.y=1+b*.04}
    else if(G==='dribble'){p.aR.rotation.set(-.55,0,.15);p.eR.rotation.set(-.9+b*.5,0,0);p.spine.rotation.x+=.2;if(st.ball)st.ball.position.y=.9-Math.sin(b*PI)*.77}
    else if(G==='pushup'){const d=b;T.dan.rx=1.38;T.dan.y=.22+(1-d)*.3;p.aL.rotation.set(-1.45,0,-.2);p.aR.rotation.set(-1.45,0,.2);p.eL.rotation.set(-1.6*d,0,0);p.eR.rotation.set(-1.6*d,0,0);p.lL.rotation.x=0;p.lR.rotation.x=0;if(p.kL){p.kL.rotation.x=0;p.kR.rotation.x=0}if(p.head)p.head.rotation.x=-.6}
    else if(G==='bugle'){p.aR.rotation.set(-1.5,0,-.42);p.eR.rotation.set(-1.5,0,0);if(p.head)p.head.rotation.x-=.15+b*.1;if(st.fl)st.fl.position.y=Math.min(5.5,.9+T.nb*.4)}
    else if(G==='march'){const s=n%2,k=b;p.lL.rotation.x=s?0:-1.1*k;p.kL.rotation.x=s?0:1.2*k;p.lR.rotation.x=s?-1.1*k:0;p.kR.rotation.x=s?1.2*k:0;p.aL.rotation.set(s?-.9*k:.5*k,0,-.05);p.aR.rotation.set(s?.5*k:-.9*k,0,.05)}
    else if(G==='bounce'||G==='dance'){PM.position.y+=b*.22;const s=n%2?1:-1;p.aL.rotation.set(-2.6+b*.3,0,-.3);if(G==='dance'){p.aR.rotation.set(-2.6+b*.3,0,.3);p.hips.rotation.y=s*.35*b;p.spine.rotation.z=s*.2*b}}
    else if(G==='pump'){const ph=Math.sin(T.swing||0),x=ph*1.9,h=Math.max(0,Math.abs(x)-.9);T.dan.x=x;T.dan.y=.12+h*h*.9;T.dan.rz=-ph*Math.min(1,h*1.2);if(st.b){st.b.position.set(x,.08+h*h*.9,0);st.b.rotation.z=-ph*Math.min(1,h*1.2)}p.kL.rotation.x+=.5+b*.5;p.kR.rotation.x+=.5+b*.5;p.lL.rotation.x-=.4;p.lR.rotation.x-=.4;p.aL.rotation.z=-.9;p.aR.rotation.z=.9}};
  T.upd=dt=>{if(T.per)T.swing=(T.swing||0)+dt*PI/(T.per/1000)*.5;if(st.band&&(G==='march'||G==='bounce'||G==='dance'||G==='clap'||G==='drum')){for(const n of st.band){const p=n.g.P;if(!p)continue;try{animP(n.g,0,T.t,'')}catch(e){}const b=T.beat;if(G==='march'){const s=T.nb%2;p.lL.rotation.x=s?0:-1.1*b;p.kL.rotation.x=s?0:1.2*b;p.lR.rotation.x=s?-1.1*b:0;p.kR.rotation.x=s?1.2*b:0}else if(G==='clap'||G==='drum'){if(p.head)p.head.rotation.x=b*.25}else{n.g.position.y=T.gy+b*.25;trArms(n,-2.6+b*.3,.35,-.3)}}}};
  T.on=(t,d)=>{if(t==='start'){T.per=d.per}else if(t==='beat'){T.beat=1;T.nb=d.n;if(G==='bugle'||G==='bounce'||G==='clap'&&d.n%2){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texNote(),transparent:true,depthWrite:false}));s.scale.setScalar(.34);const A=G==='bounce'&&PM.userData.box?TRS.g.worldToLocal(PM.userData.box.getWorldPosition(new THREE.Vector3())):new THREE.Vector3(.1,1.75,.4);trAdd(s,A.x,A.y,A.z);s.castShadow=false;const vx=(rnd()-.5)*1.4;trTw(1,u=>{s.position.set(A.x+vx*u,A.y+u*1.1,A.z+u*.5);s.material.opacity=1-u},()=>TRS&&TRS.g.remove(s))}
      if(G==='drum')trBurst(0xc8a878,0,.9,.75,2,1)}else if(t==='end')trEnd(d.pass)}}

/* ---------------------------------------------------------------- MEMORY trials: four coloured things light up around him */
function trMem(L){const T=TRS,sh=L.shape,P4=[[-2.4,2.2],[-.85,3.1],[.85,3.1],[2.4,2.2]],O=[];T.cam={p:[2.2,3,-3.4],l:[0,1,2.2]};
  P4.forEach(([x,z],j)=>{const c=TRCOL[j],face=Math.atan2(-x,-z);let o,gl;
    if(sh==='person'){const n=trPerson(pick(['brothers','athletes','sororities','studentgov']),x,z,face,{shirt:c,sleeve:c});o=n.g;gl=trAdd(new THREE.Mesh(new THREE.RingGeometry(.45,.62,24).rotateX(-PI/2),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.35,side:THREE.DoubleSide})),x,.04,z);O.push({o,gl,n,y0:T.gy,per:1})}
    else{const g=new THREE.Group();const M=new THREE.MeshStandardMaterial({color:c,roughness:.5,emissive:c,emissiveIntensity:.08});M.userData.own=1;const A=(geo,x,y,z,m)=>{const e=new THREE.Mesh(geo,m||M);e.position.set(x,y,z);e.castShadow=true;g.add(e);return e},dk=mt(0x2a2c33,.7);
      if(sh==='light'){A(new THREE.CylinderGeometry(.03,.04,2.2,8),0,1.1,0,dk);A(new THREE.CylinderGeometry(.22,.14,.36,14),0,2.3,0).rotation.x=.5}
      else if(sh==='panel'){A(new THREE.BoxGeometry(.08,1.2,.08),0,.6,0,dk);A(new THREE.BoxGeometry(1,.75,.08),0,1.5,0)}
      else if(sh==='dial'){A(new THREE.BoxGeometry(.9,1.1,.7),0,.55,0,mt(0x4a4e58,.5));A(new THREE.CylinderGeometry(.2,.2,.08,18),0,.65,-.38).rotation.x=PI/2}
      else if(sh==='crate'){A(new THREE.BoxGeometry(.8,.5,.6),0,.25,0,mt(0x8a6a40,.9));for(let k=0;k<5;k++)A(new THREE.SphereGeometry(.13,10,8),-.25+(k%3)*.25,.56,-.12+Math.floor(k/3)*.24)}
      else if(sh==='candle'){A(new THREE.CylinderGeometry(.07,.08,.5,10),0,1.05,0,mt(0xf2efe6,.6));A(new THREE.SphereGeometry(.09,10,8),0,1.38,0).scale.set(.7,1.4,.7);A(new THREE.CylinderGeometry(.3,.3,.8,12),0,.4,0,mt(0x3a2a4a,.8))}
      else if(sh==='flag'){A(new THREE.CylinderGeometry(.03,.04,2.6,8),0,1.3,0,mt(0xc8ccd4,.4));A(new THREE.BoxGeometry(.8,.5,.03),.42,2.3,0)}
      else{A(new THREE.BoxGeometry(.5,.9,.4),0,.45,0,mt(0x5a3a26,.8));const s=A(new THREE.CylinderGeometry(.09,.09,.7,12),0,1,0);s.rotation.z=PI/2}
      trAdd(g,x,0,z);g.rotation.y=face;O.push({o:g,M,y0:0})}});
  if(sh==='candle'){trCyl(1.1,1.1,.08,0x3a2a4a,0,.78,2.65);trCyl(.1,.14,.78,0x2a2030,0,.39,2.65)}
  const flash=(j,play)=>{const q=O[j];if(!q)return;tone(330+j*110,.01,'sine',.001);if(q.per){q.gl.material.opacity=1;trHop(q.n,.3,.32);trArms(q.n,-2.7,.3,-.3);trLater(.34,()=>{q.gl.material.opacity=.35;trArms(q.n,0,.1,0)})}
    else{q.M.emissiveIntensity=1.3;trTw(.32,u=>{q.o.scale.setScalar(1+Math.sin(u*PI)*.18)},()=>{q.M.emissiveIntensity=.08;q.o.scale.setScalar(1)})}if(!play)trGest('point',.35,j)};
  T.on=(t,d)=>{if(t==='pad')flash(d.j,d.play);else if(t==='res'){if(d.ok){trGest('pump',.8);trPop('PERFECT','#7ef0a0',0,2.6,1)}else{trGest('shake',.8);trPop('LOST IT','#ff8a7a',0,2.6,1)}}else if(t==='end')trEnd(d.pass)}}

/* ---------------------------------------------------------------- SORT trials: toss each thing into a labelled crate */
function trSort(L){const T=TRS;T.cam={p:[2.4,2.9,-3.2],l:[0,.9,2.2]};let B=[],it=null;
  const bins=names=>{const n=names.length;names.forEach((nm,i)=>{const x=(i-(n-1)/2)*1.9,z=3-Math.abs(i-(n-1)/2)*.35;trBox(1.2,.7,.9,0x8a6a40,x,.35,z);trBox(1.08,.05,.78,0x2a2018,x,.69,z);trSign(nm,1.5,.36,x,1.25,z+.1,'#1b2440','#f4e6c8');B.push({x,z})})};
  const hold=()=>{if(it)TRS.g.remove(it);it=trBox(.22,.22,.22,L.item||0xc8a24a,.3,1.05,.45)};
  T.base=(p)=>{if(it&&it.userData.held!==0){p.aR.rotation.set(-.9,0,.1);p.eR.rotation.set(-1.2,0,0);const h=trHand('R');it.position.set(h.x,h.y-.05,h.z+.1)}};
  T.on=(t,d)=>{if(t==='bins')bins(d.bins);else if(t==='item')hold();else if(t==='res'){const b=B[d.bin]||B[0],m=it;if(!m||!b)return;m.userData.held=0;it=null;trGest('toss',.55);const A=m.position.clone(),Bp=new THREE.Vector3(b.x,.8,b.z);
      trArc(m,A,Bp,1.1,.5,()=>{if(!TRS)return;if(d.ok){tone(760,.06,'triangle',.07);trPop('✓','#7ef0a0',b.x,1.9,b.z);trTw(.2,u=>{m.position.y=.8-u*.3;m.scale.setScalar(1-u*.5)},()=>TRS&&TRS.g.remove(m))}
        else{sfx('hit');trPop('✗','#ff6a5a',b.x,1.9,b.z);const dx=(rnd()-.5)*2;trTw(.5,u=>{m.position.set(b.x+dx*u,.8+Math.sin(u*PI)*.6-u*.7,b.z-u*1.3)},()=>trLater(.3,()=>TRS&&TRS.g.remove(m)))}})}
    else if(t==='end')trEnd(d.pass)}}

/* ---------------------------------------------------------------- QUIZ trials: the examiner, a clipboard and four lamps */
function trQuiz(L){const T=TRS;T.cam={p:[2.3,2.2,-2.6],l:[0,1.2,1.4]};const h=trPerson('staff',0,2.3,PI,{name:PQ[T.k].host});h.pose=(p,t)=>{if(h.nod>0){h.nod-=.016;p.head.rotation.x=Math.sin(h.nod*16)*.3*(h.yes?1:0);p.head.rotation.y=Math.sin(h.nod*16)*.45*(h.yes?0:1)}p.aL.rotation.set(-.9,0,-.1);p.eL.rotation.set(-1.2,0,0)};
  if(h.g.P&&h.g.P.hL){const cb=new THREE.Mesh(new THREE.BoxGeometry(.22,.3,.02),mt(0x8a6a40,.7));cb.position.set(0,-.1,.08);cb.userData.noMerge=1;h.g.P.hL.add(cb)}
  trBox(.08,1.5,.08,0x3a3d44,1.5,.75,2.6);trBox(1.1,.4,.06,0x1b2440,1.5,1.7,2.6);const Lp=[0,1,2,3].map(i=>trGlow(.09,0x444850,1.14+i*.24,1.7,2.55));let n=0;
  T.base=(p)=>{p.aR.rotation.set(-.4,0,-.5);p.eR.rotation.set(-2.2,0,0);if(p.head)p.head.rotation.x+=.1};
  T.on=(t,d)=>{if(t==='res'){const m=Lp[Math.min(3,n++)];m.material.color.set(d.ok?0x4ad06a:0xd84a4a);h.nod=.8;h.yes=d.ok;if(d.ok){trGest('pump',.8);trArms(h,-1.6,.2,-.4);trLater(.8,()=>trArms(h,0,.1,0));trPop('RIGHT','#7ef0a0',0,2.5,.6)}else{trGest('slump',.9);trPop('NOPE','#ff8a7a',0,2.5,.6)}}else if(t==='end')trEnd(d.pass)}}

/* ---------------------------------------------------------------- GRID trials (the two that aren't sneaking): the course is laid out on the ground */
function trGrid(L){const T=TRS,cs=.95;let N=5,obj=[],mv=null,Z0=1.2;T.cam={p:[0,7.2,-3.4],l:[0,0,4.2]};
  const cell=(x,y)=>[(x-(N-1)/2)*cs,Z0+(N-1-y)*cs];
  const lay=d=>{for(const o of obj)TRS.g.remove(o);obj=[];N=d.N;T.cam.p=[0,6.2+N*.25,-3.2];T.cam.l=[0,0,Z0+N*cs*.45];
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const[px,pz]=cell(x,y),t=trBox(cs-.08,.04,cs-.08,(x+y)%2?0x55606a:0x4a545e,px,.02,pz);t.castShadow=false;obj.push(t);
      if(d.grid[y][x]){if(L.wall==='bench'){obj.push(trBox(cs*.8,.42,cs*.36,0x8a5a36,px,.25,pz))}else{const h=trCyl(cs*.36,cs*.36,.05,0x111114,px,.05,pz,18);obj.push(h);obj.push(trAdd(new THREE.Mesh(new THREE.TorusGeometry(cs*.37,.03,6,20).rotateX(PI/2),mt(0xff6a1a,.6)),px,.07,pz))}}}
    const[gx,gz]=cell(d.gl[0],d.gl[1]);obj.push(trBox(cs-.2,.06,cs-.2,0x3aa86a,gx,.04,gz));
    const[sx,sz]=cell(d.st[0],d.st[1]);if(L.mover==='cart'){if(!mv){mv=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.6,.3,.8),mt(0xd8b048,.6));b.position.y=.32;mv.add(b);for(const[x,z]of[[-.3,.3],[.3,.3],[-.3,-.3],[.3,-.3]]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.08,12),mt(0x1b1b1b,.6));w.rotation.z=PI/2;w.position.set(x,.12,z);mv.add(w)}const c=new THREE.Mesh(new THREE.ConeGeometry(.16,.45,12),mt(0xff6a1a,.6));c.position.y=.7;mv.add(c);trAdd(mv,sx,0,sz)}mv.position.set(sx,0,sz);T.dan.x=-(N/2)*cs-.9;T.dan.z=Z0;T.dan.ry=.5}
    else{T.dan.x=sx;T.dan.z=sz;T.dan.y=.1;if(!mv){mv=trBox(.24,.03,.82,0x2a2c33,sx,.08,sz)}mv.position.set(sx,.08,sz)}T.cur=[sx,sz]};
  T.on=(t,d)=>{if(t==='grid')lay(d);else if(t==='step'){const[tx,tz]=cell(d.x,d.y),[ox,oz]=T.cur,k=d.crash?.45:1,ex=ox+(tx-ox)*k,ez=oz+(tz-oz)*k,ang=Math.atan2(tx-ox,tz-oz);
      trTw(.22,u=>{const x=ox+(ex-ox)*u,z=oz+(ez-oz)*u;if(L.mover==='cart'){mv.position.set(x,0,z);mv.rotation.y=ang}else{T.dan.x=x;T.dan.z=z;T.dan.ry=ang;mv.position.set(x,.08,z);mv.rotation.y=ang}},()=>{if(!TRS)return;if(d.crash){trPop(L.mover==='cart'?'CLUNK':'WIPEOUT','#ff8a7a',ex,1.6,ez);trBurst(0xc8c8c8,ex,.3,ez,8,3);if(L.mover!=='cart')trTw(.6,u=>{T.dan.rx=Math.sin(u*PI)*1.2},()=>{T.dan.rx=0})}else T.cur=[tx,tz]})}
    else if(t==='res'){if(d.ok){trPop('MADE IT','#7ef0a0',T.cur[0],2,T.cur[1]);if(L.mover==='cart')trGest('pump',.8)}}else if(t==='end')trEnd(d.pass)};
  T.base=(p)=>{if(L.mover==='cart'){p.aR.rotation.set(-1.4,0,-.4);p.eR.rotation.set(-.1,0,0)}else{p.kL.rotation.x+=.35;p.kR.rotation.x+=.35;p.lL.rotation.x-=.3;p.lR.rotation.x-=.3;p.aL.rotation.z=-.7;p.aR.rotation.z=.7}}}

/* ================================================================ SNEAKING TRIALS, played live
   Slip Past the Cameras, Low Crawl and Lose the Campus Cops: a start, a green beacon about 26 m away, and patrols walking back and forth across
   the way between. Each patrol has the same sight as the alumni at the chapter 2 after-party (the game's stealth system): a green cone on the
   ground ahead of them that turns yellow and red as they notice Danny, 10.5 m long (6.5 m if he's sneaking with C), blocked by walls.
   Seen for too long = caught and sent back to the start. Three catches fail the trial. */
let TSN=null;
function trSneak(k,i,sp,done){if(TSN)return;const C=TRSNEAK[k+i],a=PQ[k].mg[i];
  /* the way: the direction from the spot with the longest clear run */
  let best=null;for(let q=0;q<24;q++){const an=q/24*TAU,fx=Math.sin(an),fz=Math.cos(an);let d=0;for(d=2;d<=30;d+=1)if(!freeAt(P.x+fx*d,P.z+fz*d,.6))break;if(!best||d>best.d)best={d,fx,fz}}
  const D=Math.max(12,Math.min(26,best.d-2)),sx=P.x,sz=P.z,gx=sx+best.fx*D,gz=sz+best.fz*D,rx=best.fz,rz=-best.fx,G=[];
  for(let j=0;j<C.n;j++){const t=(j+1)/(C.n+1),cx=sx+best.fx*D*t,cz=sz+best.fz*D*t,ends=[1,-1].map(s=>{let w=0;for(w=1;w<=8;w+=.5)if(!freeAt(cx+rx*w*s,cz+rz*w*s,.5))break;return[cx+rx*(w-.6)*s,cz+rz*(w-.6)*s]});
    const st=j%2?ends[0]:ends[1],n=spawn(C.cl,'greek',{x:st[0],z:st[1],lvl:5,temp:1,mode:'guard',patrol:j%2?[ends[1],ends[0]]:[ends[0],ends[1]],name:C.who,title:PR[k].n+' trial'});n.stepTemp=1;n.pqg=1;n.auth=false;n.noTalk=1;n.sus=0;n.pi=0;try{bodyBuild(n.g)}catch(e){}G.push(n)}
  const gy=terrH(gx,gz),bm=new THREE.Group();bm.userData.noMerge=1;const beam=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,14,16,1,true),new THREE.MeshBasicMaterial({color:0x4ad06a,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=7;bm.add(beam);
  const ring=new THREE.Mesh(new THREE.RingGeometry(1.1,1.5,32).rotateX(-PI/2),new THREE.MeshBasicMaterial({color:0x4ad06a,transparent:true,opacity:.85,side:THREE.DoubleSide}));ring.position.y=.05;bm.add(ring);bm.position.set(gx,gy,gz);sc.add(bm);
  let e=$('trsn');if(!e){e=document.createElement('div');e.id='trsn';document.body.appendChild(e)}e.hidden=false;
  TSN={k,i,C,name:a[1],sx,sz,gx,gz,G,bm,ring,done,caught:0,st:{pqg:1,watch:[]},t:0,grace:1.5,face:Math.atan2(best.fx,best.fz),c0:!!toggles.KeyC};
  if(C.crawl)toggles.KeyC=1;P.face=TSN.face;yaw=TSN.face+PI;trSnHud();
  toast(a[1]+': '+C.line+' Stay out of the green sight cones'+(C.crawl?'.':' (C to sneak: they see less far).'),5200)}
function trSnHud(){const T=TSN,e=$('trsn');if(!T||!e)return;e.innerHTML=`<b>${T.name}</b><span>Reach the green beacon unseen</span><span class="c">Caught ${T.caught} of 3</span><button type="button" id="trsnq">Give up</button>`;const b=$('trsnq');if(b)b.onclick=()=>trSnEnd(null)}
function trSnEnd(pass){const T=TSN;if(!T)return;TSN=null;for(const n of T.G)if(NP.includes(n))despawn(n);sc.remove(T.bm);const e=$('trsn');if(e)e.hidden=true;$('evhud').hidden=true;if(T.C.crawl)toggles.KeyC=T.c0?1:0;try{stealthVis(null,0)}catch(x){}
  if(pass==null)toast('You walk away from the trial. It will still be here.',2800);else T.done(pass)}
function trSnTick(dt){const T=TSN;if(!T)return;if(mode!=='play')return;T.t+=dt;T.grace-=dt;if(P.inside||P.dead||Math.hypot(P.x-T.sx,P.z-T.sz)>60){trSnEnd(null);return}
  if(T.C.crawl)toggles.KeyC=1;T.ring.scale.setScalar(1+Math.sin(T.t*4)*.08);
  let mx=0;const crouch=K.KeyC||toggles.KeyC;for(const n of T.G){if(!NP.includes(n))continue;const sees=T.grace<=0&&canSee(n,crouch?6.5:10.5);n.sus=clamp((n.sus||0)+(sees?dt*1.7:-dt*.6),0,1.2);if(n.sus>.25&&sees&&(!n.bub||!n.bub.visible))bubble(n,'?',1);mx=Math.max(mx,n.sus);
    if(n.sus>=1){T.caught++;bubble(n,pick(['HEY! YOU!','I see you, pledge!','Back to the start!']),2);sfx('whistle');for(const m of T.G)m.sus=0;trSnHud();
      if(T.caught>=3){trSnEnd(false);return}const f=$('fade');f.style.opacity=1;setTimeout(()=>{if(TSN===T){P.x=T.sx;P.z=T.sz;P.vx=P.vz=0;P.face=T.face;yaw=T.face+PI;T.grace=1.5}f.style.opacity=0},350);toast('Spotted. Back to the start. ('+T.caught+' of 3)',2400);break}}
  try{stealthVis(T.st,mx)}catch(e){}
  const h=$('evhud');h.hidden=!(mx>.05);if(mx>.05)h.textContent=mx>=1?'SPOTTED':'Suspicion '+'▮'.repeat(Math.ceil(mx*5))+'▯'.repeat(5-Math.ceil(mx*5));
  if(Math.hypot(P.x-T.gx,P.z-T.gz)<1.7){sfx('ok');trSnEnd(true)}}

/* ---------------------------------------------------------------- V413 Pop Star trials: a few people stand by and listen. A bad round gets a boo and a tomato in the face;
   failing the trial gets a volley. Passing gets applause (trEnd hops everyone on the stage). */
function trAudience(){const T=TRS,A=[];for(let i=0;i<4;i++){const x=-2.7+i*1.8+(rnd()-.5)*.4,z=4.7+(i%2)*.7,n=trPerson(pick(['athletes','sororities','activists','studentgov','townies']),x,z,PI+Math.atan2(x,z)*-1+0);n.g.rotation.y=T.a+Math.atan2(-x,-z);n.ax=x;n.az=z;A.push(n)}
  const on0=T.on;T.on=(t,d)=>{on0&&on0(t,d);if(t==='res'&&d.ok===false){trBoo(A[Math.floor(rnd()*A.length)],0);if(rnd()<.5)trBoo(A[Math.floor(rnd()*A.length)],.25)}else if(t==='end'&&!d.pass)A.forEach((n,i)=>trBoo(n,.2+i*.22))}}
function trBoo(n,delay){trLater(delay||0,()=>{if(!TRS||!n.g)return;const T=TRS;tone(118,.55,'sawtooth',.05);tone(98,.6,'sawtooth',.04,.08);trPop('BOO!','#ff8a7a',n.ax,2.5,n.az);trArms(n,-2.2,.2,-.6);trLater(.5,()=>trArms(n,0,.1,0));
    const tm=trSph(.085,0xd8261e,n.ax,1.5,n.az);tm.scale.set(1,.85,1);const A=new THREE.Vector3(n.ax+.2,1.55,n.az-.2),hd=TRS.g.worldToLocal(PM.P.head.getWorldPosition(new THREE.Vector3())),B=new THREE.Vector3(hd.x,hd.y+.18,hd.z+.16);
    trArc(tm,A,B,.9,.5,()=>{if(!TRS)return;TRS.g.remove(tm);noise(.09,.16,500);trBurst(0xd8261e,B.x,B.y,B.z,10,2.6);trGest('shake',.7);
      /* the splat stays on his face for a few seconds and slides down */const h=PM.P.head,sp=new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),mt(0xc81e1a,.4));sp.scale.set(1+rnd()*.4,.9+rnd()*.3,.22);sp.position.set((rnd()-.5)*.1,.17+rnd()*.06,.172);sp.userData.noMerge=1;h.add(sp);
      const dr=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),mt(0xc81e1a,.4));dr.scale.set(1,1.8,.4);dr.position.set(sp.position.x+.03,sp.position.y-.06,.176);h.add(dr);const kill=()=>{h.remove(sp);h.remove(dr)};T.undo=(T.undo||[]).concat(kill);
      trTw(3.2,u=>{dr.position.y=sp.position.y-.06-u*.09;if(u>.8){const k=1-(u-.8)/.2;sp.scale.z=.22*k;dr.scale.y=1.8*k}},kill)})})}
