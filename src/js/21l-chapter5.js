// ================================================================ V129 CHAPTER 5 · THE HUGHES WAR (the Lantern Walk finale moves to chapter 6)
// Hughes Correctional Institute (the fictional facility in the old school building, file 11b) erupts. Its inmates spill into the
// streets, fraternity brothers die, and the Greek houses sign a pact against them. Danny ends up in the middle of a street war.
//  c5incident The Hughes Incident  back to the house, gather brothers inside and out, the news broadcast, Grant's meeting
//  c5lost     Brothers Lost           visit the houses, the missing-brothers board, the message to ΔΤΩ, the vigil, home;
//                                     then THE GREEK PACT: the Union meeting, the presidents, Grant vs Derek, the terms, the announcement
//  c5streets  Streets of Chaos        the rally point, stranded brothers, civilians, separated from Grant;
//                                     then FRAT VS. HUGHES: the armored Alliance, evacuate ΑΣΡ, the lawn fight, the rifle, Nippert
//  c5fall     The Fall of Hughes   the missing presidents, who runs the uprising, reunite the Alliance, brothers out, the collapse
// This file: renumbering, the burning world, fires, inmates and allies, wave fights, the rifle and molotovs, the news overlay.
// The scenes and quests are in 21m. Cast/camera helpers come from chapter 4 (c4Person, c4Pup, c4CamOn, c4Shot, c4Fade, …).
const C5={fires:[],world:0,objs:[],lights:[],hid:[],w:null,gun:0,fire:0,fireT:0,molo:0,shotFx:[],flying:[],T:0,news:null,grow:1};
const C5IDS=['c5incident','c5lost','c5streets','c5fall'];
const c5S=()=>S.c5||(S.c5={d:{},pact:{},miss:{}});

// ---------------------------------------------------------------- the Lantern Walk becomes chapter 6
for(const m of M)if(m.ch===5)m.ch=6;
CHN[5]='The Hughes War';CHN[6]='The Lantern Walk';CHN[7]='Epilogue';
CHT[6]=CHT[5];
CHT[5]='Hughes Correctional Institute is burning. Its inmates are in the streets, the police have lost the perimeter, and Greek Row is next.\n\nEvery house on the Row is about to learn whether rivalries survive a war.';
XPM[6]=XPM[5];XPM[5]=130;

// ---------------------------------------------------------------- where things are
const C5WM={door:[44.2,637.6],steps:[52.4,637.6],lawn:[57,630],tower:[44,637.6]};   // Hughes's front (faces east to the x 69 road)
const C5PILES=[[69,586,0],[69,548,.4],[118,588,1.3],[69,505,-.3]];                  // wrecked cars across the streets [x,z,angle]
const C5COPS=[[75.5,574,2.2],[101,591,1.1],[64.5,521,.5]];                            // abandoned police cruisers
const C5BURN=[[46.9,604,5],[46.9,615,9],[46.9,627,4],[46.9,650,12],[46.9,662,6],[46.9,673,9],[41,612,20],[41,664,20],[45.5,637.6,24],[44,637.6,31]];  // Hughes fires [x,z,y]
const C5RALLY=[62,401],C5BUS=[70,468],C5HOME=[84,76];

// ---------------------------------------------------------------- fire: one shared pool of flame, smoke and glow particles for every fire (3 draw calls in all)
const C5NF=2400,C5NS=960,C5NG=64,C5BK=16;
function c5Mats(){if(C5.mat)return C5.mat;const add=(c,o)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
  const soft=(k,a,b)=>GC[k]||(GC[k]=ctex(64,64,(q,w,h)=>{const g=q.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,a);g.addColorStop(.45,b);g.addColorStop(1,'rgba(0,0,0,0)');q.clearRect(0,0,w,h);q.fillStyle=g;q.fillRect(0,0,w,h)}));
  /* point sprites with a capped size: a particle right at the camera would otherwise ask for a point thousands of pixels wide (that crashes software GL) */
  const pm=(map,size,addB,op)=>new THREE.ShaderMaterial({uniforms:{map:{value:map},size:{value:size},scale:{value:360},opacity:{value:op}},transparent:true,depthWrite:false,blending:addB?THREE.AdditiveBlending:THREE.NormalBlending,
    vertexShader:'attribute vec3 color;varying vec3 vC;uniform float size;uniform float scale;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;gl_PointSize=d>.3?min(size*scale/d,90.):0.;}',
    fragmentShader:'uniform sampler2D map;uniform float opacity;varying vec3 vC;void main(){vec4 t=texture2D(map,gl_PointCoord);if(t.a<.01)discard;gl_FragColor=vec4(vC*t.rgb,t.a*opacity);}'});
  return C5.mat={f1:add(0xff6a12,.85),f2:add(0xffc23a,.8),glowG:new THREE.SphereGeometry(1,10,6),char:mt(0x2a2624,.95),
    pf:pm(soft('c5tflame','rgba(255,255,255,1)','rgba(255,255,255,.35)'),1.5,1,1),ps:pm(soft('c5tsmoke','rgba(255,255,255,.55)','rgba(255,255,255,.22)'),4.6,0,.8),pg:pm(soft('c5tglow','rgba(255,255,255,.9)','rgba(255,255,255,.2)'),11,1,1),
    lbR:new THREE.MeshBasicMaterial({color:0xff2a2a}),lbB:new THREE.MeshBasicMaterial({color:0x2a6aff}),lbOff:new THREE.MeshBasicMaterial({color:0x221818})}}
function c5Pool(){if(C5.pool)return C5.pool;const M=c5Mats(),mk=(n,mat)=>{const geo=new THREE.BufferGeometry(),p=new Float32Array(n*3).fill(-999),c=new Float32Array(n*3);geo.setAttribute('position',new THREE.BufferAttribute(p,3));geo.setAttribute('color',new THREE.BufferAttribute(c,3));
    const pts=new THREE.Points(geo,mat);pts.frustumCulled=false;pts.userData.noMerge=1;pts.renderOrder=6;sc.add(pts);return{pts,p,c,n,age:new Float32Array(n),life:new Float32Array(n).fill(1),v:new Float32Array(n*3),free:Array.from({length:Math.floor(n/C5BK)},(_,i)=>i)}};
  return C5.pool={f:mk(C5NF,M.pf),s:mk(C5NS,M.ps),g:mk(C5NG*C5BK,M.pg)}}
const c5Take=(L,k)=>{const r=[];while(k-->0&&L.free.length)r.push(L.free.shift());return r};
function c5Give(L,bl){for(const b of bl){for(let i=b*C5BK;i<(b+1)*C5BK;i++){L.p[i*3+1]=-999;L.c[i*3]=L.c[i*3+1]=L.c[i*3+2]=0}L.free.push(b)}}
function c5Fire(x,y,z,s=1,o={}){const Q=c5Pool(),F={x,y,z,s,t:0,life:o.life||1e9,dmg:o.dmg||0,dT:0,r:o.r||2.6*s,tag:o.tag||'world',big:o.big,gas:o.gas,sw:o.sw||.45*s};
  F.fb=o.gas?[]:c5Take(Q.f,Math.max(1,Math.round(s*s*1.4)));F.sb=o.smoke===false?[]:c5Take(Q.s,o.gas?3:o.big?3:s>1.3?2:1);F.gb=o.gas?[]:c5Take(Q.g,1);
  for(const[L,bl]of[[Q.f,F.fb],[Q.s,F.sb]])for(const b of bl)for(let i=b*C5BK;i<(b+1)*C5BK;i++){L.age[i]=rnd()*.8;L.life[i]=L===Q.s?(o.gas?0:-1):0}
  C5.fires.push(F);return F}
function c5FireOff(F){const Q=c5Pool();c5Give(Q.f,F.fb);c5Give(Q.s,F.sb);c5Give(Q.g,F.gb);F.fb=F.sb=F.gb=[];const i=C5.fires.indexOf(F);if(i>=0)C5.fires.splice(i,1)}
// flame colour over a particle's life: white-yellow at the base, orange, deep red, then black (invisible with additive blending)
function c5FlameC(t,k,o,c){let r,g,b;if(t<.2){const u=t/.2;r=1;g=.92-.3*u;b=.5-.38*u}else if(t<.55){const u=(t-.2)/.35;r=1;g=.62-.34*u;b=.12-.08*u}else{const u=(t-.55)/.45;r=1-.75*u;g=.28-.26*u;b=.04-.04*u}c[o]=r*k;c[o+1]=g*k;c[o+2]=b*k}
function c5FireUpd(dt){if(!C5.pool)return;const Q=C5.pool,cx=cam.position.x,cz=cam.position.z,wind=.7;let any=0;
  for(let fi=C5.fires.length-1;fi>=0;fi--){const F=C5.fires[fi];F.t+=dt;if(F.t>F.life){c5FireOff(F);continue}any=1;const far=Math.hypot(F.x-cx,F.z-cz)>230||(P.inside&&!CINE);
    const k=far?0:Math.min(1,F.t/1.2)*(F.life<1e8?Math.min(1,(F.life-F.t)/1.5):1)*C5.grow,s=F.s;
    {const L=Q.f;for(const b of F.fb)for(let i=b*C5BK;i<(b+1)*C5BK;i++){const o=i*3;L.age[i]+=dt;if(L.age[i]>=L.life[i]){L.age[i]=0;L.life[i]=.45+rnd()*.5;const a=rnd()*TAU,r=Math.sqrt(rnd())*F.sw;L.p[o]=F.x+Math.cos(a)*r;L.p[o+1]=F.y+rnd()*.15*s;L.p[o+2]=F.z+Math.sin(a)*r;L.v[o]=-Math.cos(a)*r*.9;L.v[o+1]=(1.5+rnd()*1.2)*Math.sqrt(s);L.v[o+2]=-Math.sin(a)*r*.9}
      const t=L.age[i]/L.life[i];L.p[o]+=(L.v[o]+wind*t)*dt;L.p[o+1]+=L.v[o+1]*dt;L.p[o+2]+=L.v[o+2]*dt;c5FlameC(t,k*(1-t*.2)*(.75+.25*Math.sin(TT*17+i)),o,L.c)}}
    {const L=Q.s,gas=F.gas,top=(F.big?4.8:3.6)*(gas?.8:1);for(const b of F.sb)for(let i=b*C5BK;i<(b+1)*C5BK;i++){const o=i*3;if(!(k>0)){L.p[o+1]=-999;L.life[i]=-1;continue}const pre=L.life[i]<0;L.age[i]+=dt;if(pre||L.age[i]>=L.life[i]){L.age[i]=0;L.life[i]=top+rnd()*1.6;const sp=gas?2.6:F.sw*.8;L.p[o]=F.x+(rnd()-.5)*sp;L.p[o+1]=F.y+(gas?.3:1.1*s);L.p[o+2]=F.z+(rnd()-.5)*sp;L.v[o]=(rnd()-.5)*.5;L.v[o+1]=gas?.35+rnd()*.3:(1.1+rnd()*.7)*Math.sqrt(s);L.v[o+2]=(rnd()-.5)*.5;
        /* a plume that comes back into view is already full height */if(pre){const a=rnd()*L.life[i];L.age[i]=a;L.p[o]+=L.v[o]*a+wind*a*a/L.life[i]*.7;L.p[o+1]+=L.v[o+1]*a*.8;L.p[o+2]+=L.v[o+2]*a}}
      const t=L.age[i]/L.life[i];L.p[o]+=(L.v[o]+wind*t*(gas?.6:1.4))*dt;L.p[o+1]+=L.v[o+1]*dt*(1-t*.4);L.p[o+2]+=L.v[o+2]*dt+(gas?(rnd()-.5)*dt:0);
      /* smoke is lit warm by the fire near the base and cools to grey as it rises */if(gas){const sh=.86-.18*t;L.c[o]=L.c[o+1]=L.c[o+2]=sh}else{L.c[o]=.36-.14*t;L.c[o+1]=.27-.05*t;L.c[o+2]=.21+.03*t}}}
    for(const b of F.gb){const i=b*C5BK,o=i*3,f=k*(.5+.08*Math.sin(TT*9+fi)+.05*Math.sin(TT*23))*Math.min(1.8,s);Q.g.p[o]=F.x;Q.g.p[o+1]=F.y+.8*s;Q.g.p[o+2]=F.z;Q.g.c[o]=f;Q.g.c[o+1]=f*.42;Q.g.c[o+2]=f*.1}
    // a molotov fire burns whoever is standing in it
    if(F.dmg&&(F.dT-=dt)<=0){F.dT=.5;for(const n of NP){if(!n.foe||n.down||n.int||!n.g)continue;if(Math.hypot(n.x-F.x,n.z-F.z)<F.r){hitNPC(n,13,'P');n.c5burn=1.2}}}}
  const sy=R.getDrawingBufferSize(GC.c5v2||(GC.c5v2=new THREE.Vector2())).y/2;for(const L of[Q.f,Q.s,Q.g]){L.pts.material.uniforms.scale.value=sy;L.pts.visible=any;if(any){L.pts.geometry.attributes.position.needsUpdate=true;L.pts.geometry.attributes.color.needsUpdate=true}}}

// ---------------------------------------------------------------- the burning world (while chapter 5 is running)
function c5Wreck(x,z,a,burnt){const car=mkCarMesh();if(car.children[2])car.children[2].visible=false;car.position.set(x,terrH(x,z),z);car.rotation.y=a;if(burnt){const M=c5Mats();car.traverse(o=>{if(o.isMesh)o.material=M.char})}car.traverse(o=>o.userData.noMerge=1);sc.add(car);C5.objs.push(car);return car}
function c5Cop(x,z,a){const car=c5Wreck(x,z,a,0),M=c5Mats(),bar=new THREE.Group();if(car.children[0])car.children[0].material=GC.c5copM||(GC.c5copM=SM({color:0xf2f2f2,roughness:.35,metalness:.3,vertexColors:true}));const L=[];for(const s of[-.4,.4]){const l=new THREE.Mesh(bgeo(.7,.16,.3),s<0?M.lbR:M.lbB);l.position.x=s;bar.add(l);L.push(l)}bar.position.y=1.72;car.add(bar);C5.lights.push(L);
  // the driver's door hangs open
  return car}
function c5World(on){on=!!on;if(on===!!C5.world)return;C5.world=on?1:0;
  if(on){c5Mats();for(const[x,z,y]of C5BURN)c5Fire(x,y,z,y>15?3:2,{big:y>15,tag:'wm'});
    for(const[x,z,a]of C5PILES){const fx=Math.cos(a),fz=-Math.sin(a);const c1=c5Wreck(x-fx*2.4,z-fz*2.4,a+.3,1),c2=c5Wreck(x+fx*2.2,z+fz*2.2,a-.2,1),c3=c5Wreck(x,z,a+PI/2,1);c3.position.y+=1.35;c3.rotation.z=PI*.92;const c4=c5Wreck(x+fz*2.6,z-fx*2.6,a+PI/2+.4,1);c4.rotation.x=PI/2*.96;c4.position.y+=.9;c5Fire(x,terrH(x,z)+1.2,z,1.7,{tag:'pile'})}
    for(const[x,z,a]of C5COPS)c5Cop(x,z,a);
    // the house across from Hughes (ΦΔΘ) is burning too
    {const b=B.find(b=>b.id==='pdt');if(b&&b.face)for(const[da,out,y]of[[-4,1,4],[3,1,8],[0,-3,13]]){const[x,z]=fpos(b,b.face,b.da+da,out);c5Fire(x,y,z,1.4,{tag:'pdt'})}}
    // Hughes's own people are in the streets now
    for(const n of NP)if(n.cl==='hughes'&&!n.temp&&!n.hidden){n.hidden=1;n.c5hid=1;C5.hid.push(n)}}
  /* the city has shut down: no traffic while Hughes burns */carsOn=!on&&CARS.length>0;if(on)for(const c of CARS)c.g.visible=false;
  if(!on){for(let i=C5.fires.length-1;i>=0;i--){const F=C5.fires[i];if(F.tag==='wm'||F.tag==='pile'||F.tag==='pdt')c5FireOff(F)}for(const o of C5.objs)sc.remove(o);C5.objs=[];C5.lights=[];for(const n of C5.hid)n.hidden=0;C5.hid=[]}}
function c5LightUpd(){if(!C5.lights.length)return;const M=c5Mats(),on=Math.floor(TT*5)%2;for(const[a,b]of C5.lights){a.material=on?M.lbR:M.lbOff;b.material=on?M.lbOff:M.lbB}}

// ---------------------------------------------------------------- people: inmates in orange, Greek Alliance fighters in their letters
const C5HELM=[0x2a2a30,0x5a5e64,0x8a2a1a,0x1d3a5a];
function c5Gear(g,o){if(!g)return;if(o.helm)c4Helmet(g,o.helm);if(o.shield){const s=new THREE.Mesh(GC.c5lid||(GC.c5lid=new THREE.CylinderGeometry(.36,.36,.05,14)),mt(o.shield,.5,.6));s.rotation.set(PI/2,0,0);s.position.set(-.42,1.05,.18);s.userData.noMerge=1;g.add(s)}
  if(o.pad){const p=new THREE.Mesh(GC.c5pad||(GC.c5pad=new THREE.BoxGeometry(.56,.34,.34)),mt(o.pad,.7));p.position.set(0,1.42,0);p.userData.noMerge=1;g.add(p)}}
function c5Inmate(x,z,a,o={}){const f=o.pup?c4Pup:c4Person,n=f('hughes',x,z,a,Object.assign({tag:'c5',name:o.name||pick(MN)+' '+pick(['R.','T.','K.','M.','D.','J.']),title:'Hughes inmate',lvl:o.lvl||6,shirt:0xe0702a,sleeve:0xe0702a,pants:0xe0702a,skin:pick(SKIN),hair:pick(HAIR),int:null,scale:.96+rnd()*.12},o));
  c5Gear(n.g,{helm:rnd()<.45?pick(C5HELM):0,shield:rnd()<.35?pick([0x8a8d90,0x6a6e72]):0,pad:rnd()<.2?0x3a3a40:0});return n}
const C5HOUSES=['asr','dto','ble','sdr','gge','lxa','tchi','pkp','sae','ksig','pka'];
function c5Greek(x,z,a,house,o={}){const f=o.pup?c4Pup:c4Person,H=HOUSE[house]||HOUSE.asr,n=f(o.cl||'athletes',x,z,a,Object.assign({tag:'c5',name:o.name||pick(MN)+' ('+H.L+')',title:o.title||H.L,house,lvl:o.lvl||7,int:null},o));
  if(o.armor!==false)c5Gear(n.g,{helm:o.helm!=null?o.helm:H.shirt,shield:rnd()<.4?0x9a9da2:0,pad:rnd()<.5?0xe8e2d6:0});return n}

// ---------------------------------------------------------------- wave fights: allies (n.ally) fight beside Danny, inmates come in waves from the street
// cfg {at:[x,z], waves:[[count,lvl],…], allies:[[house,name],…], from:[a0,a1] (spawn arc, radians), gun, molo, label, win, floor}
function c5WarStart(cfg){c5WarEnd();const W=C5.w={cfg,i:-1,foes:[],allies:[],done:0,nextT:TT+1.4,total:cfg.waves.reduce((s,w)=>s+w[0],0)};
  (cfg.allies||[]).forEach(([house,name],j)=>{const a=j/Math.max(1,cfg.allies.length)*TAU,[x,z]=c3Free(cfg.at[0]+Math.cos(a)*2.6,cfg.at[1]+Math.sin(a)*2.6),n=c5Greek(x,z,a,house,{tag:'c5w',name});n.ally=1;n.hp=n.mhp=260;n.mode='idle';W.allies.push(n)});
  if(cfg.gun){c5Gun(1);C5.molo=cfg.molo||6;c5GunHud()}if(S.hp<S.mhp*.7)S.hp=Math.round(S.mhp*.7)}
function c5Wave(){const W=C5.w,[cnt,lvl]=W.cfg.waves[W.i],[a0,a1]=W.cfg.from||[0,TAU];for(let k=0;k<cnt;k++){const a=a0+(a1-a0)*rnd(),r=15+rnd()*9,[x,z]=c3Free(W.cfg.at[0]+Math.cos(a)*r,W.cfg.at[1]+Math.sin(a)*r);
    const n=(W.cfg.mk||c5Inmate)(x,z,a+PI,{tag:'c5w',lvl:lvl+Math.floor(rnd()*2)});n.foe=1;n.aggro=1;n.mode='wander';n.tgt=W.allies.length&&rnd()<.35?pick(W.allies):'P';if(k<2)bubble(n,pick(W.cfg.taunts||['GREEKS! THERE THEY ARE!','Burn the Row!','Get the frat boys!','You put us in there!','NO MORE LIGHTS OUT!']),2.2);W.foes.push(n)}}
function c5WarTick(dt){const W=C5.w;if(!W||W.done)return;if(S.hp<(W.cfg.floor||34))S.hp=Math.min(S.mhp,S.hp+dt*14);
  for(const a of W.allies)if(c4Live(a)&&a.hp<a.mhp*.5){a.hp=a.mhp;if(a.down){a.down=0}}
  for(const n of W.foes){if(n.c5burn>0){n.c5burn-=dt;n.stun=Math.max(n.stun||0,.15)}if(n.down&&!n.c5gone){n.c5dT=(n.c5dT||0)+dt;if(n.c5dT>8){n.c5gone=1;despawn(n)}}if(!n.down&&c4Live(n)&&n.aggro&&!n.tgt)n.tgt='P'}
  const left=W.foes.filter(n=>c4Live(n)&&!n.down&&!n.c5gone).length,downs=W.foes.filter(n=>n.down||n.c5gone).length;W.left=left;
  c1Hud(`${W.cfg.label||'HOLD THE LINE'} · WAVE ${Math.max(1,W.i+1)}/${W.cfg.waves.length} · HUGHES DOWN ${downs}/${W.total}`);
  if(left===0&&TT>W.nextT){if(W.i+1>=W.cfg.waves.length){W.done=1;c1Hud(null);big(W.cfg.win||'THE LINE HOLDS',2000);sfx('ok');return}W.i++;c5Wave();W.nextT=TT+2.5;if(W.i)big('WAVE '+(W.i+1),1100);if(C5.gun)C5.molo+=2;c5GunHud()}}
function c5WarEnd(){const W=C5.w;C5.w=null;c1Hud(null);if(!W)return;for(const n of W.foes)if(c4Live(n))despawn(n);c4Off('c5w')}
function c5WarStep(cfg){return{t:'cond',lab:()=>{const W=C5.w;return(cfg.task||(cfg.label?cfg.label.charAt(0)+cfg.label.slice(1).toLowerCase():'Fight'))+(W&&!W.done?` (wave ${Math.max(1,W.i+1)} of ${cfg.waves.length})`:'')},ok:()=>!!(C5.w&&C5.w.done),goal:()=>cfg.at,start:()=>{if(P.inside)goOut(...cfg.at);c5WarStart(cfg)},tick:dt=>c5WarTick(dt),done:()=>{const keep=cfg.keepGun;c5WarEnd();if(!keep)c5Gun(0)}}}

// ---------------------------------------------------------------- the rifle (hold F or left-click) and molotovs (Q)
function c5Gun(on){C5.gun=on?1:0;C5.fire=0;if(on&&!C5.gunM){const g=new THREE.Group(),bk=mt(0x1a1a1c,.4,.5);c4M(bgeo(.07,.11,.62),bk,0,0,0,g);c4M(bgeo(.06,.08,.26),bk,0,-.02,-.4,g);c4M(bgeo(.05,.17,.07),bk,0,-.12,.05,g);c4M(new THREE.CylinderGeometry(.018,.018,.34,6),bk,0,.02,.46,g).rotation.x=PI/2;c4M(bgeo(.03,.05,.12),bk,0,.08,.1,g);
    g.position.set(.14,1.2,.36);g.traverse(o=>o.userData.noMerge=1);PM.add(g);C5.gunM=g}if(C5.gunM)C5.gunM.visible=!!on;c5GunHud()}
function c5GunHud(){let e=$('c5gun');if(!C5.gun){if(e)e.hidden=true;return}if(!e){e=document.createElement('div');e.id='c5gun';e.style.cssText='position:fixed;right:14px;bottom:16%;z-index:33;padding:8px 12px;border-radius:10px;background:rgba(14,16,24,.85);border:1px solid #e2b64c;color:#f2e6c8;font:600 13px Archivo,Arial,sans-serif;text-align:center';document.body.appendChild(e);
    e.innerHTML='<div id="c5gt"></div>';const f=c4Btn('FIRE',()=>{C5.fire=1});f.onpointerup=f.onpointerleave=()=>{C5.fire=0};e.appendChild(f);e.appendChild(c4Btn('MOLOTOV',()=>c5Molotov()))}
  e.hidden=false;const t=$('c5gt');if(t)t.innerHTML=`RIFLE · hold <b>F</b> / left-click · <b>Q</b> molotov ×${C5.molo}`}
addEventListener('keydown',e=>{if(!C5.gun||mode!=='play')return;if(e.code==='KeyF'){C5.fire=1;e.preventDefault();e.stopImmediatePropagation()}else if(e.code==='KeyQ'){if(!e.repeat)c5Molotov();e.preventDefault();e.stopImmediatePropagation()}},true);
addEventListener('keyup',e=>{if(e.code==='KeyF')C5.fire=0},true);
addEventListener('mousedown',e=>{if(C5.gun&&mode==='play'&&e.button===0&&e.target&&e.target.tagName==='CANVAS'){C5.fire=1;e.stopImmediatePropagation()}},true);
addEventListener('mouseup',e=>{if(e.button===0)C5.fire=0},true);
// who is Danny aiming at: the inmate closest to where the camera looks (or anyone close if nobody is in front)
function c5Aim(range,cone){const aim=yaw+PI;let best=null,bs=1e9;for(const n of NP){if(!n.foe||n.down||n.hidden||!n.g||(n.int||null)!==(P.inside||null))continue;const dx=n.x-P.x,dz=n.z-P.z,d=Math.hypot(dx,dz);if(d>range)continue;
    let da=Math.abs(((Math.atan2(dx,dz)-aim+PI)%TAU+TAU)%TAU-PI);if(da>cone&&d>7)continue;const s=da*12+d;if(s<bs){bs=s;best=n}}return best}
const _c5a=new THREE.Vector3(),_c5b=new THREE.Vector3();
function c5Shoot(){const t=c5Aim(34,.5);if(t)P.face=Math.atan2(t.x-P.x,t.z-P.z);else P.face=yaw+PI;PM.rotation.y=P.face;PM.updateMatrixWorld(true);
  _c5a.set(.14,1.22,.95);PM.localToWorld(_c5a);if(t)_c5b.set(t.x+(rnd()-.5)*.3,(t.y||terrH(t.x,t.z))+1.15+(rnd()-.5)*.3,t.z+(rnd()-.5)*.3);else _c5b.set(P.x+Math.sin(P.face)*28,_c5a.y,P.z+Math.cos(P.face)*28);
  const M=c5Mats(),tr=new THREE.Mesh(GC.c5tr||(GC.c5tr=new THREE.BoxGeometry(.035,.035,1)),M.f2),d=_c5a.distanceTo(_c5b);tr.position.copy(_c5a).lerp(_c5b,.5);tr.lookAt(_c5b);tr.scale.z=d;tr.userData.noMerge=1;sc.add(tr);
  const fl=new THREE.Mesh(M.glowG,M.f1);fl.scale.setScalar(.12);fl.position.copy(_c5a);sc.add(fl);C5.shotFx.push([tr,.05],[fl,.04]);noise(.05,.16,1700);tone(120,.04,'square',.05);
  if(t&&rnd()<.88)hitNPC(t,20+Math.round(rnd()*10),'P')}
function c5Molotov(){if(!C5.gun)return;if(C5.molo<=0){toast('Out of molotovs. Somebody\'s making more.',1600);return}C5.molo--;c5GunHud();const t=c5Aim(20,.6),aim=t?Math.atan2(t.x-P.x,t.z-P.z):yaw+PI;P.face=aim;
  const tx=t?t.x:P.x+Math.sin(aim)*11,tz=t?t.z:P.z+Math.cos(aim)*11,b=new THREE.Group();c4M(GC.c5bot||(GC.c5bot=new THREE.CylinderGeometry(.05,.06,.24,8)),mt(0x2f6a2a,.3,.2),0,0,0,b);const wick=new THREE.Mesh(c5Mats().glowG,c5Mats().f2);wick.scale.setScalar(.06);wick.position.y=.16;b.add(wick);sc.add(b);
  C5.flying.push({b,a:[P.x,P.y+1.6,P.z],e:[tx,terrH(tx,tz)+.1,tz],t:0,fl:.85});C5.throwT=TT+.35;sfx('whiff')}
function c5GunUpd(dt){for(let i=C5.shotFx.length-1;i>=0;i--){const f=C5.shotFx[i];f[1]-=dt;if(f[1]<=0){sc.remove(f[0]);C5.shotFx.splice(i,1)}}
  for(let i=C5.flying.length-1;i>=0;i--){const f=C5.flying[i];f.t+=dt;const k=Math.min(1,f.t/f.fl);f.b.position.set(lerp(f.a[0],f.e[0],k),lerp(f.a[1],f.e[1],k)+Math.sin(k*PI)*2.6,lerp(f.a[2],f.e[2],k));f.b.rotation.x+=dt*12;
    if(k>=1){sc.remove(f.b);C5.flying.splice(i,1);c5Fire(f.e[0],f.e[1],f.e[2],1.2,{life:6.5,dmg:1,r:3.1,tag:'molo'});noise(.4,.3,500);tone(70,.3,'sawtooth',.08);sfx('hit')}}
  if(!C5.gun)return;if(mode==='play'){if(C5.fire&&TT>C5.fireT){C5.fireT=TT+.11;c5Shoot()}if(C5.throwT>TT){try{animP(PM,0,TT,'throw')}catch(e){}}else c4Arms(PM,-1.42)}}

// ---------------------------------------------------------------- the news broadcast overlay (the camera is the helicopter)
function c5News(on,head,tick){let e=$('c5news');if(!on){if(e)e.remove();return}if(!e){e=document.createElement('div');e.id='c5news';e.style.cssText='position:fixed;inset:0;z-index:31;pointer-events:none;font:800 16px Archivo,Arial,sans-serif;color:#fff';document.body.appendChild(e)}
  e.innerHTML=`<div style="position:absolute;left:4%;top:5%;background:#c8202e;padding:5px 12px;letter-spacing:.06em">WHRG 9 NEWS · <span style="color:#ffd84a">● LIVE</span></div><div style="position:absolute;left:0;right:0;bottom:9%;"><div style="display:inline-block;margin-left:4%;background:#ffd84a;color:#1d1d22;padding:4px 10px">BREAKING</div><div style="margin:0 4%;background:rgba(200,32,46,.95);padding:9px 14px;font-size:20px">${head}</div><div style="margin:0 4%;background:rgba(14,16,24,.92);padding:6px 14px;font:600 14px Archivo,Arial,sans-serif;white-space:nowrap;overflow:hidden"><span id="c5tk" style="display:inline-block;padding-left:100%;animation:c5tk 22s linear infinite">${tick}</span></div></div><style>@keyframes c5tk{to{transform:translateX(-100%)}}</style>`}

// ---------------------------------------------------------------- boards in the minigame window
// the missing-brothers board: everybody's last check-in, flag the ones who never answered
const C5ROLL=[['Kyle Bennett','ΔΤΩ','Last seen at the Hughes corner store, 9:02 PM. No reply since.',1],['Will Ostrander','ΣΔΡ','"im ok, at my gfs" 10:41 PM',0],['Austin Reyes','ΔΤΩ','Went back for Kyle, 9:20 PM. Phone off.',1],['Hunter Shaw','ΛΧΑ','"Locked in the basement. Safe." 10:55 PM',0],
  ['Tyler Ng','ΣΔΡ','Delivering food on Calhoun, 9:10 PM. Location stopped updating.',1],['Mason Pratt','ΓΓΗ','"we r all in the house" 10:30 PM',0],['Cody Vance','ΔΤΩ','"At Derek\'s, safe" 11:02 PM',0],['Silas Okoro','ΓΓΗ','On the phone with Grant, 11:10 PM',0]];
function c5RollBoard(done){openMG('Who\'s Missing','Every name from the three houses and ΔΤΩ · flag the brothers nobody has heard from',(el,close)=>{const pick_={};
  el.innerHTML='<p class="mgintro">Read the last check-ins. Click a card to flag it as missing.</p><div id="c5rb" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px"></div><div id="c5rn" style="margin-top:10px;text-align:center;font:600 14px Archivo,sans-serif;color:#e8d8a8"></div><div style="text-align:center;margin-top:8px" id="c5rbb"></div>';
  const g=el.querySelector('#c5rb'),note=el.querySelector('#c5rn'),bb=el.querySelector('#c5rbb');
  const draw=()=>{g.innerHTML='';C5ROLL.forEach(([nm,L,msg],i)=>{const b=document.createElement('button');b.type='button';b.style.cssText='text-align:left;padding:9px 11px;border-radius:8px;cursor:pointer;font:600 13px Archivo,Arial,sans-serif;border:2px solid '+(pick_[i]?'#c8202e':'#6a5a3a')+';background:'+(pick_[i]?'#3a1418':'#f2ead6')+';color:'+(pick_[i]?'#ffd8d8':'#2a2418');b.innerHTML='<b>'+nm+'</b> · '+L+'<br><span style="font-weight:500">'+msg+'</span>';b.onclick=()=>{pick_[i]=!pick_[i];sfx('ui');draw()};g.appendChild(b)});
    bb.innerHTML='';const k=document.createElement('button');k.type='button';k.className='mgbtn';k.textContent='Send the list to Grant';k.onclick=()=>{const want=C5ROLL.map(r=>!!r[3]),got=C5ROLL.map((_,i)=>!!pick_[i]);if(want.every((w,i)=>w===got[i])){sfx('bad');note.textContent='Kyle Bennett. Austin Reyes. Tyler Ng. Grant reads the names twice and doesn\'t say anything.';setTimeout(()=>close(done),1900)}else{sfx('ui');note.textContent=got.some((g_,i)=>g_&&!want[i])?'Somebody on your list checked in. Read it again.':'Somebody is still missing from your list.'}};bb.appendChild(k)};
  draw();if(C4.auto)setTimeout(()=>close(done),60)})}
// the Greek Pact: four terms, then every president signs
const C5TERMS=['No house moves alone. Every chapter reports to the Alliance before it acts.','Every Greek is protected. A brother from any house gets the same help as your own.','The old rivalries are suspended until Hughes is over. All of them.','The Union is neutral ground. Nobody fights there.'];
function c5PactBoard(done){openMG('The Greek Pact','Student Union · signed by every chapter on Greek Row',(el,close)=>{const ok={};
  el.innerHTML='<div style="max-width:620px;margin:0 auto;padding:16px 20px;background:#efe4c8;color:#2a2214;border-radius:4px;box-shadow:inset 0 0 40px #c8b48a;font:16px Georgia,serif"><div style="text-align:center;font:bold 22px Georgia,serif;letter-spacing:.1em">THE GREEK PACT</div><div style="text-align:center;font-size:13px;margin-bottom:10px">ΑΣΡ · ΔΤΩ · ΒΛΕ · ΣΔΡ · ΓΓΗ · ΛΧΑ · ΘΧ · ΣΑΕ</div><div id="c5pt"></div><div id="c5ps" style="margin-top:12px;font:italic 20px \'Brush Script MT\',\'Segoe Script\',cursive;min-height:28px;line-height:1.5"></div></div><div style="text-align:center;margin-top:10px" id="c5pb"></div>';
  const T=el.querySelector('#c5pt'),Sg=el.querySelector('#c5ps'),pb=el.querySelector('#c5pb');
  const draw=()=>{T.innerHTML='';C5TERMS.forEach((t,i)=>{const r=document.createElement('label');r.style.cssText='display:flex;gap:10px;align-items:flex-start;margin:6px 0;cursor:pointer';const c=document.createElement('input');c.type='checkbox';c.checked=!!ok[i];c.onchange=()=>{ok[i]=c.checked;sfx('ui');draw()};r.appendChild(c);r.appendChild(document.createTextNode((i+1)+'. '+t));T.appendChild(r)});
    pb.innerHTML='';const s=document.createElement('button');s.type='button';s.className='mgbtn';s.textContent='Sign for Alpha Sigma Rho';s.disabled=!C5TERMS.every((_,i)=>ok[i]);s.onclick=()=>{s.disabled=true;sfx('ok');const names=['Grant Ashby','Derek Vance','Nolan Pike','Jace Moreno','Silas Okoro','Hunter Shaw','Cade Whitmore','Beau Lancaster'];names.forEach((n,i)=>setTimeout(()=>{Sg.textContent+=(i?'  ·  ':'')+n;tone(600+i*40,.05,'triangle',.03)},300+i*330));setTimeout(()=>close(done),300+names.length*330+900)};pb.appendChild(s)};
  draw();if(C4.auto)setTimeout(()=>close(done),60)})}

// ---------------------------------------------------------------- small helpers for the quests
// a list task: items [{k, l (label), at:()=>[x,z] | {int,x,z}, act (prompt), run(done) (optional), need:()=>bool (optional), r}]
function c5At(p){if(!p)return null;if(Array.isArray(p))return{int:null,x:p[0],z:p[1]};return p}
function c5Goal(p){p=c5At(p);if(!p)return null;if((p.int||null)===(P.inside||null))return[p.x,p.z];if(p.int&&/^asr/.test(p.int))return c3Route(p);if(p.int==='union')return P.inside?null:[340.4,300.6];return[p.x,p.z]}
function c5List(title,items,o={}){const s=()=>c5S().d;return Object.assign({t:'cond',c5items:items,lab:()=>'\n'+title+'\n'+items.map(it=>(s()[it.k]?'✓ ':'○ ')+it.l).join('\n'),ok:()=>items.every(it=>s()[it.k]),
  goal:()=>{for(const it of items){if(s()[it.k]||(it.need&&!it.need()))continue;return c5Goal(it.at())}return null}},o)}
function c5Do(it){const d=c5S().d;if(d[it.k]||it.busy)return;const fin=()=>{it.busy=0;d[it.k]=1;sfx('ok');updObj()};if(it.run){it.busy=1;try{it.run(fin)}catch(e){console.warn('c5Do',e);fin()}}else fin()}
// a person standing at a spot for a task, created when the task needs them
function c5Who(name,mk){const n=C4.cast[name];if(c4Live(n))return n;return mk()}
function c5Talk(n,title,text,ch,fin){if(!c4Live(n)){fin&&fin();return}card({title,sp:n.name+(n.title?' · '+n.title:''),text,focus:n,ch:(ch||[['"Okay."',null]]).map(([l,f])=>[l,()=>{if(f)f();if(fin)fin()}])})}
const c5Next=id=>c4Next(id);
