// ================================================================ V149 CHAPTER 2 · THE ALUMNI GALA (replaces "Rivalries"; the Big Brother quests stay)
// Danny is a pledge now. Five quests, chained, all at the ΑΣΡ house (the living/dining rooms become the ballroom, the after-party is the basement):
//  c2prep   Pledge Labor        rent a tux ($40, earn it first), decorate the ballroom (5 spots), champagne + catering, hide the eyesores (4)
//  c2room   Working the Room    gala night: meet 3 alumni, learn who'll donate (ask 4), keep the champagne flowing (6 pours), never admit the pledges did it
//  c2pitch  The Donation Pitch  impress Augustus Pell, a 3-line pitch, find out why everyone asks about the pledges' fitness, the reveal
//  c2after  The After Party     follow them into the basement: deliver supplies (6) without walking into a live match, your pledge-job task, sneak past the creeps
//  c2koth   King of the Hill    three rounds in the cage against the pledge class; last pledge standing
const C2={gala:0,after:0,deco:{},sore:{},alums:[],crowd:null,crowdB:null,hid:[],mk:[]};
const C2IDS=['c2prep','c2room','c2pitch','c2after','c2koth'];
CHN[2]='The Alumni Gala';
CHT[2]='Grant gathers the pledge class in the living room.\n\n"Rush is over. Now you earn it. Saturday night, this house hosts the Alumni Gala: every rich old man who ever wore these letters, in one room, with his checkbook. If they write checks, we keep the lights on. If they don\'t, the Dean gets her wish."\n\n"Pledges do the work. Brothers take the credit. That\'s how it\'s always been."\n\nYour Big Brother quests are open too: talk to Tank, Reese or Owen on the porch if you haven\'t picked one yet.';
Object.assign(QI,{c2champ:'Champagne (house account)',c2cater:'Catering trays',c2tray:'Tray of champagne'});
// retire the old chapter 2 story quests
for(const id of['ram','phone','football']){const i=M.findIndex(m=>m.id===id);if(i>=0)M.splice(i,1)}
const c2B=(lx,lz)=>c1W('asr',lx,lz);
const c2OnStair=(lx,lz)=>lx>STX0-1&&lx<STX1+1&&lz>STZT-1.2&&lz<STZB+1.4;   // V157 the staircase isn't solid in the grid: never stand people on it
function c2Free(id,lx,lz,r=.45){const I=INT[id];for(let d=0;d<6;d+=.5)for(let a=0;a<12;a++){const x=I.x0+lx+Math.cos(a/12*TAU)*d,z=I.z0+lz+Math.sin(a/12*TAU)*d;if(freeAt(x,z,r)&&!c2OnStair(x-I.x0,z-I.z0))return[x-I.x0,z-I.z0];if(!d)break}return[lx,lz]}
function c2Obj(id,lx,lz,label,f,r=1.6){const I=INT[id],o={x:I.x0+lx,z:I.z0+lz,r,label,f,c2:1};I.objs.push(o);return o}
function c2ObjDel(o){for(const id of['asr','asr_bsmt'])if(INT[id])INT[id].objs=INT[id].objs.filter(q=>q!==o)}
function c2ObjClear(){for(const id of['asr','asr_bsmt'])if(INT[id])INT[id].objs=INT[id].objs.filter(o=>!o.c2)}
const c2M=(geo,col,x,y,z,par)=>{const m=new THREE.Mesh(geo,typeof col==='number'?mt(col,.6):col);m.position.set(x,y,z);m.userData.noMerge=1;(par||INT.asr.g).add(m);return m};
// V123 tux front, drawn on a chest-shaped plane over the black jacket: satin lapels, white shirt with buttons and collar wings, black tie.
// Canvas maps 0.40 m × 0.46 m of chest (top = just under the collar, y≈1.55; bottom ≈1.09). Transparent elsewhere, so the jacket shows through.
function tuxTex(){return ctex(256,296,(q,W,H)=>{q.clearRect(0,0,W,H);const cx=W/2,vb=250;
  // white shirt inside the V
  q.fillStyle='#f4f2ec';q.beginPath();q.moveTo(cx-58,0);q.lineTo(cx+58,0);q.lineTo(cx,vb);q.closePath();q.fill();
  q.strokeStyle='rgba(120,120,130,.35)';q.lineWidth=1.5;q.beginPath();q.moveTo(cx+9,30);q.lineTo(cx+5,vb-20);q.stroke();
  q.fillStyle='#d8d6d0';for(let y=60;y<vb-24;y+=34){q.beginPath();q.arc(cx+15-(y/vb)*12,y,3.2,0,TAU);q.fill()}
  // satin lapels (peak lapels, lighter sheen toward the edge)
  for(const s of[-1,1]){const g=q.createLinearGradient(cx+s*58,0,cx+s*96,0);g.addColorStop(0,'#2e2e36');g.addColorStop(.5,'#3c3c46');g.addColorStop(1,'#1c1c22');q.fillStyle=g;
    q.beginPath();q.moveTo(cx+s*58,0);q.lineTo(cx+s*96,0);q.lineTo(cx+s*108,58);q.lineTo(cx+s*84,70);q.lineTo(cx+s*14,vb+18);q.lineTo(cx,vb);q.closePath();q.fill();
    q.strokeStyle='rgba(0,0,0,.55)';q.lineWidth=2;q.beginPath();q.moveTo(cx+s*58,0);q.lineTo(cx,vb);q.stroke()}
  // shirt collar wings
  q.fillStyle='#ffffff';for(const s of[-1,1]){q.beginPath();q.moveTo(cx+s*6,4);q.lineTo(cx+s*40,0);q.lineTo(cx+s*30,30);q.lineTo(cx+s*12,26);q.closePath();q.fill();q.strokeStyle='rgba(0,0,0,.18)';q.lineWidth=1;q.stroke()}
  // black tie: knot + blade with a pointed tip and a little sheen
  q.fillStyle='#0c0c10';q.beginPath();q.moveTo(cx-13,6);q.lineTo(cx+13,6);q.lineTo(cx+9,30);q.lineTo(cx-9,30);q.closePath();q.fill();
  const tg=q.createLinearGradient(cx-14,0,cx+14,0);tg.addColorStop(0,'#08080b');tg.addColorStop(.45,'#24242c');tg.addColorStop(1,'#08080b');q.fillStyle=tg;
  q.beginPath();q.moveTo(cx-8,30);q.lineTo(cx+8,30);q.lineTo(cx+15,214);q.lineTo(cx,236);q.lineTo(cx-15,214);q.closePath();q.fill();
  // two jacket buttons below the V
  q.fillStyle='#050507';for(const y of[268,288]){q.beginPath();q.arc(cx,y,4.5,0,TAU);q.fill()}q.fillStyle='rgba(255,255,255,.18)';for(const y of[268,288]){q.beginPath();q.arc(cx-1.5,y-1.5,1.6,0,TAU);q.fill()}})}
let TUXM=null;
function tuxFront(on){tuxOn(PM,on)}
function tuxOn(g,on){const P_=g&&g.P;if(!P_||!P_.chest)return;if(on&&!P_.tux){if(!TUXM)TUXM=SM({map:tuxTex(),transparent:true,alphaTest:.4,roughness:.55,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
    const m=new THREE.Mesh(curvedPlane(.40,.46,!!(P_._o&&P_._o.fem)),TUXM);m.position.set(0,.0,.006);m.userData.noMerge=1;P_.chest.add(m);P_.tux=m}
  if(P_.tux)P_.tux.visible=!!on}
// V125 a champagne flute held at chest height: the right arm is posed after the animation each frame and the glass, a child of the rig root
// (so it stays upright), follows the right hand
let FLUTEM=null;
function mkFlute(){if(!FLUTEM)FLUTEM={gl:new THREE.MeshStandardMaterial({color:0xe8f0f4,roughness:.05,metalness:.1,transparent:true,opacity:.45,depthWrite:false}),ch:new THREE.MeshStandardMaterial({color:0xf2d46a,emissive:0x4a3a10,roughness:.2,transparent:true,opacity:.85})};
  const g=new THREE.Group(),add=(geo,m,y)=>{const o=new THREE.Mesh(geo,m);o.position.y=y;o.userData.noMerge=1;g.add(o)};
  add(GC.flB||(GC.flB=new THREE.CylinderGeometry(.034,.022,.13,12)),FLUTEM.gl,.1);add(GC.flC||(GC.flC=new THREE.CylinderGeometry(.03,.019,.09,12)),FLUTEM.ch,.08);
  add(GC.flS||(GC.flS=new THREE.CylinderGeometry(.005,.005,.1,6)),FLUTEM.gl,0);add(GC.flF||(GC.flF=new THREE.CylinderGeometry(.03,.03,.006,12)),FLUTEM.gl,-.05);return g}
const _flHV=new THREE.Vector3();
function holdPose(g){const P_=g.P,F=g.HOLD;if(!P_||!P_.aR||!P_.eR||typeof F==='string')return;   // V166 only a held flute (an object); 'tray'/'box'/'up' are posed in animP0
  P_.aR.rotation.x=-.32;P_.aR.rotation.z=.16;P_.eR.rotation.x=-1.5;
  if(F&&P_.hR){P_.hR.getWorldPosition(_flHV);g.worldToLocal(_flHV);F.position.copy(_flHV)}}
// Danny's rented tux: recolour his palette (jacket, sleeves, trousers, collar → white), put it back afterwards
function c2Suit(on){if(!PM)return;tuxFront(on);const mats=[];PM.traverse(o=>{const m=o.material;if(m&&m.userData&&m.userData.pal&&!mats.includes(m))mats.push(m)});
  const SL=[PS.shirt,PS.sleeve,PS.pants,PS.acc],TC=[0x18181d,0x18181d,0x121216,0xf4f2ec];
  for(const m of mats){const p=m.userData.pal;if(!m.userData.c2o||m.userData.c2o.length<SL.length)m.userData.c2o=SL.map(i=>p[i].clone());
    SL.forEach((i,k)=>{if(on){const q=chrGrade(TC[k],1,1);p[i].set(q.r,q.g,q.b,p[i].w)}else p[i].copy(m.userData.c2o[k])})}S.c2suit=on?1:0}
const C2PAL={k:'gala',SH:[0x18181d,0x1d2440,0x2a2a30,0x3a2a22,0x5a1a24,0x1d3a5a,0x4a2a5a,0x0f0f12],PA:[0x141418,0x1a1a22,0x22222a],HA:[0x8a8a8a,0xa8a8a8,0x6a5a4a,0x2a1a10,0xc8c8c8,0x151515],fem:.3};

// ================================================================ a) PLEDGE LABOR
const C2DECO=[['table','Clear out the long dinner table',38.5,27],['banner','Hang the WELCOME HOME banner',24,33],['lights','String up the twinkle lights',8,24],['tables','Set the round tables',42,28],['tower','Build the champagne tower',50,31],['runner','Roll out the gold runner',30,16.5]];
const C2SORE=[['cans','Bag up the mountain of empty Genesee cans',12,30],['stain','Cover the mystery stain on the carpet',22,26.5],['board','Take down the PLEDGE PUNISHMENT BOARD',20.5,21.5],['junk','Hide the pile of broken furniture',46,20]];
function c2DecoBuild(k,lx,lz){const I=INT.asr,X=x=>I.x0+x,Z=z=>I.z0+z,G=[];const push=m=>{G.push(m);return m};
  if(k==='table'){c2ClearDine()}
  else if(k==='banner'){const s=signMesh('WELCOME HOME, ALUMNI',6,.9,'#7d1f2c','#e2b64c');s.position.set(X(lx),3.4,Z(lz));s.userData.noMerge=1;I.g.add(s);push(s);const s2=s.clone();s2.rotation.y=PI;s2.position.z-=.02;I.g.add(s2);push(s2);
    // V123 hung properly: a brass rod across the top with ball finials, two cords up to hooks in the ceiling (y 6.02)
    const br=mt(0xc9a046,.35,.7),rt=3.4+.45+.03,cl=6.02-rt;push(c2M(new THREE.CylinderGeometry(.035,.035,6.5,10).rotateZ(PI/2),br,X(lx),rt,Z(lz)-.01));
    for(const dx of[-3.25,3.25])push(c2M(GC.c2fin||(GC.c2fin=new THREE.SphereGeometry(.07,10,8)),br,X(lx+dx),rt,Z(lz)-.01));
    for(const dx of[-2.6,2.6]){push(c2M(new THREE.CylinderGeometry(.012,.012,cl,6),0x2a2018,X(lx+dx),rt+cl/2,Z(lz)-.01));push(c2M(GC.c2hook||(GC.c2hook=new THREE.TorusGeometry(.05,.015,6,12)),br,X(lx+dx),6.0-.05,Z(lz)-.01))}}
  else if(k==='lights'){for(let i=0;i<16;i++){const b=c2M(GC.bulb||(GC.bulb=new THREE.SphereGeometry(.09,8,6)),bm(0xffe39a),X(lx-7+i*.95),3.5-Math.sin(i/15*PI)*.5,Z(lz));push(b)}}
  else if(k==='tables'){for(const dx of[-2.4,2.4]){push(c2M(new THREE.CylinderGeometry(1.1,1.1,.06,20),0xf4f0e6,X(lx+dx),.78,Z(lz)));push(c2M(new THREE.CylinderGeometry(1.12,1.12,.72,20,1,true),new THREE.MeshStandardMaterial({color:0xf4f0e6,side:THREE.DoubleSide,roughness:.9}),X(lx+dx),.39,Z(lz)))}}
  else if(k==='tower'){push(c2M(new THREE.CylinderGeometry(.6,.6,.8,16),0xf4f0e6,X(lx),.4,Z(lz)));const gl=new THREE.MeshStandardMaterial({color:0xfff2c0,emissive:0x6a5a20,roughness:.15,metalness:.1,transparent:true,opacity:.85});
    for(let l=0;l<4;l++){const n=4-l,rr=.12*n;for(let i=0;i<Math.max(1,n*3);i++){const a=i/Math.max(1,n*3)*TAU;push(c2M(new THREE.CylinderGeometry(.06,.03,.14,8),gl,X(lx)+Math.cos(a)*rr,.88+l*.15,Z(lz)+Math.sin(a)*rr))}}}
  else if(k==='runner'){const m=c2M(new THREE.PlaneGeometry(1.4,22),new THREE.MeshStandardMaterial({color:0xc8a24a,roughness:.5,metalness:.3}),X(lx),.05,Z(lz));m.rotation.set(-PI/2,0,PI/2);push(m)}
  return G}
// V123 'Clear out the long dinner table': hide ΑΣΡ's dining table + chairs (kept unmerged by dineGrab, 17b) and free the floor they blocked
function c2ClearDine(){const I=INT.asr,D=I&&I.dine;if(!D||D.cleared)return;D.cleared=1;const bb=new THREE.Box3();
  for(const m of D.objs){m.updateMatrixWorld(true);bb.setFromObject(m);m.visible=false;cells(bb.min.x-.02,bb.min.z-.02,bb.max.x+.02,bb.max.z+.02,k=>{WG[k]=0;HG[k]=0;SH[k]=0})}}
function c2SoreBuild(k,lx,lz){const I=INT.asr,X=x=>I.x0+x,Z=z=>I.z0+z,G=[];
  if(k==='cans'){const can=new THREE.CylinderGeometry(.06,.06,.17,8),cm=mt(0xc8c8d0,.4,.6);for(let i=0;i<34;i++){const a=rnd()*TAU,r=rnd()*.7,m=c2M(can,cm,X(lx)+Math.cos(a)*r,.09+Math.floor(i/14)*.16,Z(lz)+Math.sin(a)*r);m.rotation.set(rnd()<.4?PI/2:0,rnd()*3,0);G.push(m)}}
  else if(k==='stain'){const m=c2M(new THREE.CircleGeometry(.9,18),new THREE.MeshBasicMaterial({color:0x2a1a0e,transparent:true,opacity:.7,depthWrite:false}),X(lx),.045,Z(lz));m.rotation.x=-PI/2;m.scale.set(1,.7,1);G.push(m)}
  else if(k==='board'){const s=signMesh('PLEDGE PUNISHMENT BOARD',1.8,1.3,'#f2f2ee','#c8202e');s.position.set(X(lx),1.6,Z(lz));s.userData.noMerge=1;I.g.add(s);G.push(s);for(const dx of[-.6,.6])G.push(c2M(bgeo(.05,1.8,.05),0x5a3a24,X(lx+dx),.9,Z(lz+.1)))}
  else if(k==='junk'){for(let i=0;i<6;i++){const m=c2M(bgeo(.5+rnd()*.6,.08,.4+rnd()*.4),0x5a3a24,X(lx)+rnd()-.5,.2+i*.12,Z(lz)+rnd()-.5);m.rotation.set(rnd()-.5,rnd()*3,rnd()-.5);G.push(m)}}
  return G}
// V164 the tux is bought at the Lucky Pawn counter (Pete's shop menu), not from a prompt outside the door
function c2BuyTux(){const p=C2.p;if(!p||p.suit||S.c2suit){toast('You already have the tux.');return}const pr=priceOf(75);if(S.money<pr){toast(`The tux is ${money$(pr)}. You have ${money$(Math.floor(S.money))}. Work a shift at Ruby's, call your dad, or pick up odd jobs around campus (green $ on the map).`,4200);sfx('bad');return}money(-pr);p.suit=1;c2Suit(1);sfx('lvl');big('LOOKING SHARP',1600);toast('Pete: "No refunds." The tux smells like mothballs and somebody else\'s cologne. It fits. Mostly.',3800);updObj()}
// V165 the champagne is picked up at Hank's counter (house account), not from a prompt outside
function c2BuyChamp(){const p=C2.p;if(!p||p.champ||has('c2champ')){toast('You already have that.');return}give('c2champ');p.champ=1;sfx('coin');toast('Hank: "Twelve bottles of the good stuff. And by good I mean cheapest I had."',3400);updObj()}
function c2PrepStart(){C2.p=Object.assign({suit:!!S.c2suit,shift:0,dad:0,champ:0,cater:0,center:0,unload:0,deco:0,sore:0},C2.p||{});C2.p.suit=!!S.c2suit;
  for(const[k,lab,lx1,lz1]of C2DECO){if(C2.deco[k])continue;const D_=INT.asr&&INT.asr.dine,[lx0,lz0]=k==='table'&&D_?[D_.c[0],D_.c[1]+(D_.v===0?4.2:0)]:[lx1,lz1];const[lx,lz]=c2Free('asr',lx0,lz0);C2.deco[k]={o:c2Obj('asr',lx,lz,lab,()=>{const d=C2.deco[k];if(d.done)return;if(k==='tables'&&C2.deco.table&&!C2.deco.table.done){toast('Clear the long dinner table out of the way first.',2200);return}d.done=1;d.G=c2DecoBuild(k,lx,lz);c2ObjDel(d.o);sfx('ok');toast(pick(['Looks expensive. It isn\'t.','Fancy.','The house almost looks respectable.']),1600)}),lx,lz}}
  for(const[k,lab,lx0,lz0]of C2SORE){if(C2.sore[k])continue;const[lx,lz]=c2Free('asr',lx0,lz0);const G=c2SoreBuild(k,lx,lz);C2.sore[k]={G,lx,lz,o:c2Obj('asr',lx,lz,lab,()=>{const s=C2.sore[k];if(s.done)return;s.done=1;for(const m of s.G)m.parent&&m.parent.remove(m);if(k==='stain'){const r=c2M(new THREE.PlaneGeometry(2.2,1.5),new THREE.MeshStandardMaterial({color:0x7d1f2c,roughness:.95}),INT.asr.x0+lx,.05,INT.asr.z0+lz);r.rotation.x=-PI/2;s.G=[r]}else s.G=[];c2ObjDel(s.o);sfx('ok');toast(pick(['Out of sight, out of mind.','Nobody will ever know.','The alumni will never suspect a thing.']),1600)})}}
  if(!C2.unloadO){const[lx,lz]=c2Free('asr',58,30);C2.unloadO=c2Obj('asr',lx,lz,'Unload the gala supplies in the kitchen',()=>{const P_=C2.p;const n=['c2champ','c2cater'].filter(has);if(!n.length){toast('You don\'t have any supplies yet: champagne from Hank\'s, catering from Ruby\'s.',4000);sfx('bad');return}n.forEach(take);P_.unload+=n.length;P_.unG=P_.unG||[];for(const q of n)P_.unG.push(...c2SupplyBuild(q,lx,lz));if(P_.unload>=2)c2ObjDel(C2.unloadO);sfx('ok');toast(`Unloaded ${n.map(q=>q==='c2champ'?'the champagne':'the catering').join(' and ')}. Supplies in the kitchen: ${P_.unload}/2.`,2600)})}}
// V118 unloading the gala supplies now puts them in the kitchen: a crate of champagne and a stack of foil catering trays
function c2SupplyBuild(kind,lx,lz){const I=INT.asr,X=I.x0+lx,Z=I.z0+lz,G=[];
  if(kind==='c2champ'){G.push(c2M(bgeo(.9,.3,.6),0x6a4a2a,X-.7,.15,Z));const gl=mt(0x1f4d2a,.25,.1),foil=mt(0xe2b64c,.3,.6),bo=new THREE.CylinderGeometry(.04,.05,.34,8),tp=new THREE.CylinderGeometry(.045,.045,.07,8);
    for(let i=0;i<4;i++)for(let j=0;j<3;j++){const bx=X-.7-.3+i*.2,bz=Z-.18+j*.18;G.push(c2M(bo,gl,bx,.47,bz));G.push(c2M(tp,foil,bx,.67,bz))}}
  else if(kind==='c2cater'){const tr=mt(0xc8c8d0,.35,.6);for(let i=0;i<3;i++)G.push(c2M(bgeo(.85,.1,.55),tr,X+.7,.05+i*.11,Z));
    const dm=new THREE.SphereGeometry(.3,14,8,0,TAU,0,PI/2);dm.scale(1.3,.7,.85);G.push(c2M(dm,mt(0xdcdce2,.3,.7),X+.7,.35,Z))}
  return G}
const c2Cnt=o=>Object.values(o).filter(d=>d.done).length;
function c2PrepLab(){const p=C2.p||{},k=v=>v?'✓':'○',d=c2Cnt(C2.deco),s=c2Cnt(C2.sore);
  return`\n${k(p.suit)} Buy a formal tux at the Lucky Pawn counter ($75${p.suit?'':` · you have $${Math.floor(S.money)}`})\n\u00a0\u00a0\u00a0\u00a0${k(p.champ)} Champagne at Hank's (house account)\n\u00a0\u00a0\u00a0\u00a0${k(p.cater)} Catering at Ruby's (house account)\n${k(d>=C2DECO.length)} Decorate the ballroom (${d}/${C2DECO.length})\n${k(p.unload>=2)} Gala supplies to the kitchen (${p.unload||0}/2)\n${k(s>=4)} Hide the house's questionable condition (${s}/4)`}
function c2PrepDone(){const p=C2.p||{};return p.suit&&c2Cnt(C2.deco)>=C2DECO.length&&p.unload>=2&&c2Cnt(C2.sore)>=4}
// short on cash: point at the nearest odd job (or the one you're doing)
function c2GigGoal(){const g=GIG.active;if(g){const p=GIGT[g.k].pts(g)[0];if(p)return p}const n=GIG.givers.filter(n=>NP.includes(n)).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z))[0];return n?[n.x,n.z]:null}
function c2PrepGoal(){const p=C2.p||{};
  if(!p.suit){if(S.money>=75)return SPOT.PAWN;if(!p.shift)return c2Sp(SPOT.DINER);if(!p.dad)return[SPOT.ASR[0]-3,SPOT.ASR[1]+4];return c2GigGoal()||SPOT.PAWN}   // V123 the tux is bought inside (Pete's counter), so the marker sits on the pawn shop door, not beside it
  if(!p.champ&&!has('c2champ'))return c2Sp(SPOT.HANK);if(!p.cater&&!has('c2cater'))return c2Sp(SPOT.DINER);
  if(['c2champ','c2cater'].some(has))return[C2.unloadO.x,C2.unloadO.z];
  for(const d of Object.values(C2.deco))if(!d.done)return[d.o.x,d.o.z];for(const s of Object.values(C2.sore))if(!s.done)return[s.o.x,s.o.z];return null}
// the outdoor errands (called from nearest() through c2Prompts)
const c2Sp=S_=>[S_[0]+2.6,S_[1]+1.6];   // errand prompts sit beside each door so 'Enter …' still works
function c2PrepPrompts(add){const p=C2.p;if(!p||P.inside)return;const DI=c2Sp(SPOT.DINER),PA=c2Sp(SPOT.PAWN),HA=c2Sp(SPOT.HANK),AS=[SPOT.ASR[0]-3,SPOT.ASR[1]+4];
  if(!p.suit&&S.money<75&&!p.shift)add(DI[0],DI[1],2.4,'Work a dinner shift at Ruby\'s (+$25, 3 hours)',()=>{p.shift=1;card({title:"Ruby's Diner",sp:'Marisol Vega · Waitress',alert:1,text:'Marisol throws you an apron. "Dish pit. Don\'t break anything. Don\'t eat anything."\n\nThree hours, four hundred plates and one grease fire later, she counts twenty-five dollars into your hand.',ch:[['Take the money',()=>{advance(3);money(25);sfx('coin')}]]})},0);
  else if(p.suit&&!p.cater&&!has('c2cater'))add(DI[0],DI[1],2.4,'Pick up the catering trays (house account)',()=>{give('c2cater');p.cater=1;sfx('coin');toast('Four foil trays of tiny food. Marisol: "Tell Grant he still owes me for the last party."',3200)},0);
  if(!p.suit&&!p.dad&&S.money<75)add(AS[0],AS[1],2.6,'Call Big Ed about money for a tux',()=>{p.dad=1;card({title:'Big Ed Kowalski',sp:'On the phone',alert:1,text:'"A TUX? For an ALUMNI GALA? Son, I wore a rented tux to that gala in \'93 and I spilled a whole shrimp cocktail on a senator! Best night of my life!"\n\nThe line crackles. "I\'m sending you fifteen bucks. Don\'t tell your mother. And DON\'T go near the shrimp."',ch:[['"Thanks, Dad."',()=>{money(15);sfx('coin')}]]})},0);
}

// ================================================================ the gala night (shared by b, c and the start of d)
const C2AL={pell:['Augustus Pell',"Class of '71",3,0,'"Pell. Augustus Pell. Class of \'71. I paid for the roof over your head, son. And the throne your president sits on."','"Shipping, mostly. And I just christened my third yacht. The Lantern. Rowed crew here for four years, you know. Best years of my life."','"Sizing you up? Ha! A man\'s body is his résumé, son. We like to see what the new résumés look like. You\'ll understand after dessert."'],
 whitford:['Walter Whitford Jr.',"Class of '88 · Alumni Trust",2,1,'"Whitford. My son Reese is one of your actives. Tell me, pledge: did you boys do all this decorating yourselves?"','"I sit on the alumni trust. I decide where the money goes, not how much of it there is."','"Ask your Big Brother. Or don\'t. Some traditions are better experienced than explained."'],
 fisk:['Dr. Leonard Fisk',"Class of '79 · Orthopedics",0,1,'"Dr. Fisk. Orthopedic surgeon. You\'ve got good shoulders, kid. Who set up all these tables, the pledges?"','"Retired. My pension wouldn\'t buy one of these centerpieces. Don\'t look at me for a check."','"I\'m a doctor. I like to know who\'ll need one by the end of the night. The real gala is downstairs."'],
 brandt:['Hal "Hammer" Brandt',"Class of '85 · Golden Gloves",2,0,'"Hammer Brandt. Golden Gloves, \'84. You look like you can take a punch. Can you?"','"Gyms. Twelve of them across the state. Business is good. Business is very good."','"Because a man likes to know what he\'s investing in, pledge. Fight night is the oldest tradition this house has."'],
 dunmore:['Senator Roy Dunmore',"Class of '76",3,0,'"Senator Dunmore. My nephew Brock is in your pledge class. Big kid. Fists like hams."','"Public service. And a few private holdings the newspapers don\'t need to hear about. I give generously to causes I believe in."','"Brock\'s been training all month for tonight. I wouldn\'t bet against him. Don\'t tell the Dean."'],
 kincaid:['Bradley Kincaid',"Class of '02 · Founder",0,1,'"Brad Kincaid. Three startups, two exits. Who built all this? You pledges? Be honest with me."','"Crypto took a bath this quarter. Honestly I\'m here for the open bar."','"I heard there\'s action in the basement later. I don\'t know the rules, but I know there\'s a spread."'],
 ostrander:['Gil Ostrander',"Class of '95 · Ostrander Motors",3,0,'"Gil Ostrander! Ostrander Motors! You\'ve seen the commercials! DRIVE IT LIKE YOU STOLE IT!"','"Moved four hundred cars last quarter. I write checks with a smile, kid. Ask anybody in this room."','"Ha! Every year the alumni size up the pledges like horses at an auction. It\'s a whole thing downstairs."'],
 reddick:['Tom Reddick',"Class of '90 · Attorney",1,0,'"Reddick. Attorney. If anyone from the Dean\'s office asks, I was never here tonight."','"Litigation. I keep this chapter out of court, and that\'s worth more than any check."','"Off the record? Some traditions are best kept out of any deposition."']};
const C2ALPOS=[['pell',20,30],['whitford',8,22],['fisk',38,24],['brandt',44,32],['dunmore',25,25.5],['kincaid',52,28],['ostrander',12,32],['reddick',36,32]];
function c2Alum(k,id,lx,lz,a){const d=C2AL[k],[x,z]=c2Free(id,lx,lz),I=INT[id],n=spawn('oldguard',id,{x:I.x0+x,z:I.z0+z,a:a!=null?a:rnd()*TAU,temp:1,mode:'idle',lvl:6,fem:0,name:d[0],title:d[1],shirt:0x18181d,sleeve:0x18181d,pants:0x141418,hair:k==='pell'?0xeeeeea:[0x9a9a9a,0xb8b8b8,0xd2d2d0,0x8a8680][nameSeed(d[0])%4],greet:'"Ah. One of the pledges."',
    // V125 old money in black tie: long-sleeved jacket with white shirt cuffs, the tux front, grey/white swept-back hair, dress shoes, a flute of champagne
    look:{cl2:'flannel',sacc:0xf4f2ec,shoe:0x121214,sole:0x0a0a0a,hs2:k==='pell'?'swept':['swept','short','swept','buzz'][nameSeed(d[0])%4],fh:k==='pell'?'beard':['goatee',0,0,'stubble'][nameSeed(d[0])%4],fv:nameSeed(d[0])%3,iris:0x4a3a2a,gl:k==='pell'||k==='fisk'||k==='whitford'?1:0}});
  tuxOn(n.g,1);n.hx=n.x;n.hz=n.z;n.c2a=k;n.actor=0;C2.alums.push(n);if(C2.served&&C2.served.has(k))c2GiveFlute(n);return n}
function c2ToSat(){const n=(13-(S.day-1)%7)%7;if(!n)return false;S.day+=n;S.gt=20;/* skipped days are not played, so no newDay(): it would fire the pledge-job "yesterday" penalties during the gala. Only its stink-item refresh and the cone prop are repeated */if(skv('stkD')>=1&&!invHas('stink'))invAdd('stink');try{if(S.pledged&&S.prole)prApply()}catch(e){}setTimeout(()=>big('SATURDAY NIGHT',2400),400);return true}
function c2GalaOn(){if(C2.gala)return;C2.gala=1;TSMUL=.1;c2ToSat();S.rcDone=S.day;if(!(S.gt>=19.5&&S.gt<23.5))S.gt=20;
  for(const k in C2.deco)if(!C2.deco[k].done){C2.deco[k].done=1;C2.deco[k].G=c2DecoBuild(k,C2.deco[k].lx,C2.deco[k].lz);c2ObjDel(C2.deco[k].o)}   // a loaded save: the brothers finished it
  for(const k in C2.sore){const s=C2.sore[k];if(!s.done){s.done=1;for(const m of s.G)m.parent&&m.parent.remove(m);c2ObjDel(s.o)}}
  for(const[k,lx,lz]of C2ALPOS)c2Alum(k,'asr',lx,lz);
  if(!C2.crowd){const I=INT.asr,sp=[];let t=0;const busy=(x,z)=>C2.alums.some(n=>Math.hypot(n.x-x,n.z-z)<1.4)||Math.hypot(x-I.x0-24,z-I.z0-31)<2.6||(x-I.x0<14&&z-I.z0<14)||(x-I.x0>19.5&&x-I.x0<28.5&&z-I.z0<9)||Math.abs(x-I.x0-1.4)<2&&Math.abs(z-I.z0-16)<2||c2OnStair(x-I.x0,z-I.z0);
    while(sp.length<46&&t++<3000){const x=I.x0+1+rnd()*62,z=I.z0+1+rnd()*34;if(busy(x,z)||!freeAt(x,z,.42)||sp.some(([a,b])=>Math.hypot(a-x,b-z)<.9))continue;sp.push([x,z])}C2.crowd=c1Crowd(sp,C2PAL);I.g.add(C2.crowd.g)}
  C2.crowd.g.visible=true;for(const k of PCLASS){const n=NN[k];if(n&&!n.hidden){n.hidden=1;n.c2hid=1;C2.hid.push(n)}}   // pledges are working the kitchen tonight
  if(!S.c2suit)c2Suit(1)}
function c2GalaOff(){c2Bar(0);C2.gala=0;C2.after=0;TSMUL=1;for(const n of C2.alums)if(NP.includes(n))despawn(n);C2.alums=[];if(C2.crowd)C2.crowd.g.visible=false;if(C2.crowdB)C2.crowdB.g.visible=false;
  for(const n of C2.hid){n.hidden=0;n.c2hid=0}C2.hid=[];c2Mk([]);c1Hud(null);c2ObjClear();C2.unloadO=null;if(C2.p&&C2.p.unG){for(const m of C2.p.unG)m.parent&&m.parent.remove(m);C2.p.unG=[]}}
function c2Ensure(){if(!C2.gala){if(!C2.p)c2PrepStart();c2GalaOn()}}
// V164 the gala opens as a cutscene: the camera tours the dressed-up house, two alumni compare yachts, Grant fixes Danny's bow tie (all lines in the conversation box)
function c2GalaIntro(done){const I=INT.asr,W=(x,y,z)=>[I.x0+x,y,I.z0+z],X=(x,z)=>[I.x0+x,I.z0+z];let ost=null,oPos=null;
  c6Cine(async()=>{await c4Fade(async()=>{c2Ensure();goIn('asr',24,31.5);c4DanAt(...X(24,31.5),PI);c4Shot(W(24,2.8,33.6),W(24,1.6,22),0)});
    big('THE ALUMNI GALA',2400);await c4Wt(1.4);
    // the tables, the runner, the tower
    c1Sub('','By eight, the house is unrecognizable.');c4Shot(W(37.6,3.2,33.4),W(43,1,26),.5);await c4Wt(3.4);
    c1Sub('','White tablecloths. A gold runner the whole length of the hall.');c4Shot(W(18.6,1.4,16.5),W(42,.3,16.5),0);await c4Wt(.2);c4Shot(W(27,1.15,16.5),W(44,.3,16.5),.35);await c4Wt(3.2);
    c1Sub('','A champagne tower, glowing like it cost more than the house.');c4Shot(W(46.8,1.9,33.6),W(50,1.1,31),0);for(let i=0;i<5;i++){try{c6Spark(I.x0+50,1.5+i*.18,I.z0+31,0xfff2c0,5);tone(1400+i*160,.08,'sine',.02)}catch(e){}await c4Wt(.6)}
    // forty men in tuxedos who all seem to know each other's yacht
    const pell=C2.alums.find(n=>n.c2a==='pell');ost=C2.alums.find(n=>n.c2a==='ostrander');
    if(pell&&ost){oPos=[ost.x,ost.z,ost.hx,ost.hz];ost.x=pell.x-1.3;ost.z=pell.z+.5;ost.hx=ost.x;ost.hz=ost.z;if(ost.g)ost.g.position.set(ost.x,0,ost.z);c4Shot([pell.x-.6,1.75,pell.z+3],[pell.x-.65,1.55,pell.z+.2],0)}
    c1Sub('','And forty men in tuxedos who all seem to know each other\'s yacht.');await c4Wt(2.8);c1Sub(null);
    if(pell&&ost)await c8Lines([[ost,'Augustus! I hear the new boat is parked in my slip.'],[pell,'Your slip, Gil? I bought that marina in 1988.'],[ost,'…Ha! HA! Good one. Good one.']]);
    // Grant, the bow tie
    try{c6GrantHide(1)}catch(e){}const gr=c4Dup('grant',...X(24,23.6),0,{pup:1,tag:'c2gi',int:'asr'});if(gr){try{c2RedTux(gr,1)}catch(e){}c4To(gr,...X(24,30.4),1.5)}
    c4Shot(W(21.4,1.8,33.2),W(24,1.5,28.4),0);await c4Wt(1.2);c4Shot(W(25.7,1.75,32.6),W(24,1.6,30.8),1);await c4Wt(3);
    if(gr&&gr.pup){gr.pup.arms=-1.45;await c4Wt(.7);try{noise(.12,.07,1400)}catch(e){}if(C4.dan)C4.dan.lean=.16;await c4Wt(.35);if(C4.dan)C4.dan.lean=0;gr.pup.arms=null}
    await c8Lines([[gr,'Smile. Pour. Listen.'],[gr,'And if anybody asks, the BROTHERS did all of this.'],[DANNY,'(Smile. Pour. Listen. Got it.)']]);
    if(gr)c4To(gr,...X(24,22),1.5);await c4Wt(.8)},
   ()=>{c4Off('c2gi');P.face=PI;yaw=0;pitch=.32;camT=3;done()},
   {after:()=>{c4Off('c2gi');try{c6GrantHide(0)}catch(e){}if(ost&&oPos){[ost.x,ost.z,ost.hx,ost.hz]=oPos;if(ost.g)ost.g.position.set(ost.x,0,ost.z)}}})}
// gold markers over whoever you need to go to (thirsty alumni, supply requests)
// V158 the gala dress code and props: ASR brothers in red tuxedos (the same tux front the pledges and alumni wear), Danny carries a real tray,
// alumni only hold a flute once Danny has poured them one
const C2RED=[0x9c1424,0x9c1424,0x121216,0xf4f2ec];
function c2RedTux(n,on){const g=n&&n.g;if(!g)return;const mats=[];g.traverse(o=>{const m=o.material;if(m&&m.userData&&m.userData.pal&&!mats.includes(m))mats.push(m)});const SL=[PS.shirt,PS.sleeve,PS.pants,PS.acc];
  for(const m of mats){const p=m.userData.pal;if(on){if(!m.userData.c2r)m.userData.c2r=SL.map(i=>p[i].clone());SL.forEach((i,k)=>{const q=chrGrade(C2RED[k],1,1);p[i].set(q.r,q.g,q.b,p[i].w)})}else if(m.userData.c2r){SL.forEach((i,k)=>p[i].copy(m.userData.c2r[k]));m.userData.c2r=null}}
  tuxOn(g,on);n.c2red=on?1:0}
function c2Dress(){const on=!!C2.gala;if(on){if((C2.dT=(C2.dT||0)-1)<=0){C2.dT=20;for(const n of NP)if(n.cl==='brothers'&&!n.c2red&&!n.prop&&n.name!=='Pledge'&&n.g&&(n.int==='asr'||n.int==='asr_bsmt'))c2RedTux(n,1)}}else if(C2.redOn){for(const n of NP)if(n.c2red)c2RedTux(n,0)}C2.redOn=on;c2TrayUpd()}
function c2TrayUpd(){const n=(C2.r&&C2.r.glasses)||0,p=PM&&PM.P;if(!p||!p.chest)return;let T=PM.userData.c2tray;
  if(n>0&&C2.gala){if(!T){T=new THREE.Group();T.add(new THREE.Mesh(GC.c2tp||(GC.c2tp=new THREE.CylinderGeometry(.25,.25,.018,22)),mt(0xd8dade,.25,.85)));T.add(new THREE.Mesh(GC.c2tr||(GC.c2tr=new THREE.TorusGeometry(.25,.012,6,24)),mt(0xc8cacf,.25,.85)));T.children[1].rotation.x=PI/2;T.children[1].position.y=.01;
      T.fl=[0,1,2].map(i=>{const f=mkFlute();f.position.set(Math.cos(i*2.1+.4)*.13,.062,Math.sin(i*2.1+.4)*.13);T.add(f);return f});T.traverse(o=>o.userData.noMerge=1);T.position.set(0,-.135,.27);p.chest.add(T);PM.userData.c2tray=T}
    T.visible=true;T.fl.forEach((f,i)=>f.visible=i<n);PM.HOLD='tray'}
  else if(T&&T.visible){T.visible=false;if(PM.HOLD==='tray')PM.HOLD=null}}
function c2GiveFlute(n){if(!n||!n.g)return;(C2.served||(C2.served=new Set())).add(n.c2a);if(n.g.HOLD)return;n.g.HOLD=mkFlute();n.g.add(n.g.HOLD)}
function c2Mk(list){while(C2.mk.length<list.length){const m=new THREE.Mesh(new THREE.ConeGeometry(.26,.5,4),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(2.4,1.9,.4)}));m.rotation.x=PI;m.renderOrder=6;sc.add(m);C2.mk.push(m)}
  C2.mk.forEach((m,i)=>{const n=list[i];m.visible=!!n&&NP.includes(n)&&(n.int||null)===(P.inside||null);if(m.visible){m.position.set(n.x,2.65+Math.sin(TT*3.2+i)*.15,n.z);m.rotation.y=TT*2}})}

// ================================================================ b) WORKING THE ROOM
function c2RoomStart(){c2Ensure();C2.r=Object.assign({met:new Set(),learn:new Set(),pours:0,slips:0,glasses:0,tT:3},C2.r&&C2.r.keep?C2.r:{});for(const n of C2.alums)n.c2thirst=0;
  if(C2.unloadO){c2ObjDel(C2.unloadO);C2.unloadO=null}   // the prep is over: its kitchen prompt would compete with the bar's
  c2Bar(1);if(!C2.barO){const I=INT.asr,ok=freeAt(I.x0+56,I.z0+27.95,.3),[lx,lz]=ok?[56,27.95]:c2Free('asr',56,28.6);C2.barO=c2Obj('asr',lx,lz,'Grab a tray of champagne (3 glasses)',()=>{C2.r.glasses=3;give('c2tray');sfx('coin');c2BarTake();toast('A full tray. Look for the gold markers: those glasses are empty.',2800)},1.3)}}
// V165 the champagne service on the kitchen island (top y .95, x 54-58, z 25-27.1): three trays of filled flutes, bottles on ice, a tent card.
// The pickup sits at the island's edge between the two stools; each tray Danny takes leaves the table, and the kitchen restocks all three once they're gone.
function c2Bar(on){const I=INT.asr;if(!I)return;if(!on){if(C2.barG)C2.barG.visible=false;return}if(C2.barG){C2.barG.visible=true;return}
  const g=new THREE.Group(),Y=.95,X=x=>I.x0+x,Z=z=>I.z0+z,A=(par,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.userData.noMerge=1;par.add(o);return o};
  const silver=mt(0xe6e8ec,.3,.35),glassG=new THREE.MeshStandardMaterial({color:0x1e4a2a,roughness:.15,metalness:.2}),foil=mt(0xd8b040,.3,.8);
  A(g,new THREE.PlaneGeometry(3.6,.9),mt(0xf4f0e6,.9),X(56),Y+.004,Z(26.55)).rotation.x=-PI/2;   // a white runner of linen along the front edge
  C2.barTrays=[];for(const tx of[55,56,57]){const t=new THREE.Group();t.position.set(X(tx),Y,Z(26.6));A(t,new THREE.CylinderGeometry(.27,.27,.02,20),silver,0,.012,0);A(t,new THREE.TorusGeometry(.27,.012,6,24),silver,0,.024,0).rotation.x=PI/2;
    for(const[fx,fz]of[[-.1,-.07],[.1,-.07],[0,.11]]){const f=mkFlute();f.position.set(fx,.075,fz);t.add(f)}g.add(t);C2.barTrays.push(t)}
  for(const bx of[54.45,57.55]){const b=new THREE.Group();b.position.set(X(bx),Y,Z(25.7));A(b,new THREE.CylinderGeometry(.16,.13,.26,16),silver,0,.13,0);A(b,new THREE.CylinderGeometry(.15,.15,.02,16),mt(0xe8f4fa,.1,.1),0,.24,0);
    for(const[ox,oz,lean]of[[-.05,0,.25],[.05,.03,-.2]]){const bt=new THREE.Group();bt.position.set(ox,.12,oz);bt.rotation.z=lean;A(bt,new THREE.CylinderGeometry(.04,.045,.26,12),glassG,0,.13,0);A(bt,new THREE.CylinderGeometry(.015,.035,.1,10),glassG,0,.31,0);A(bt,new THREE.CylinderGeometry(.017,.017,.05,10),foil,0,.37,0);b.add(bt)}g.add(b)}
  {const c=signMesh('CHAMPAGNE · PLEASE ENJOY',.5,.1,'#f4f0e6','#7d1f2c');c.position.set(X(56),Y+.07,Z(26.12));c.rotation.x=-.35;c.userData.noMerge=1;g.add(c)}
  g.traverse(o=>o.userData.noMerge=1);I.g.add(g);C2.barG=g}
function c2BarTake(){const T=C2.barTrays||[];let t=T.find(q=>q.visible);if(!t){T.forEach(q=>q.visible=true);t=T[0];toast('Someone from the kitchen brings out three fresh trays.',2200)}if(t)t.visible=false}
function c2RoomLab(){const r=C2.r||{},k=v=>v?'✓':'○';return`\n${k(r.met&&r.met.size>=3)} Introduce yourself to three wealthy alumni (${Math.min(3,r.met?r.met.size:0)}/3)\n${k(r.learn&&r.learn.size>=4)} Learn who's likely to donate: ask what they do (${Math.min(4,r.learn?r.learn.size:0)}/4)\n${k(r.pours>=6)} Keep the champagne flowing (${Math.min(6,r.pours||0)}/6)${r.glasses?` · tray: ${r.glasses}`:''}\n${r.slips?'✗':'✓'} Never admit the pledges did all the work${r.slips?' (1 slip: one more and Grant pulls you)':''}`}
function c2RoomDone(){const r=C2.r;return r&&r.met.size>=3&&r.learn.size>=4&&r.pours>=6&&r.slips<2}
function c2RoomTick(dt){const r=C2.r;if(!r)return;r.tT-=dt;const th=C2.alums.filter(n=>n.c2thirst&&NP.includes(n));if(r.tT<=0&&th.length<2&&r.pours<6){r.tT=5+rnd()*4;const c=C2.alums.filter(n=>!n.c2thirst&&NP.includes(n));if(c.length){const n=pick(c);n.c2thirst=1;bubble(n,n.g&&n.g.HOLD?pick(['Pledge! My glass is empty.','Is there more champagne?','Waiter? Ah, pledge. A refill.']):pick(['Pledge! Where\'s the champagne?','Is anybody pouring tonight?','A glass, pledge. Chop chop.']),2.4)}}
  c2Mk(th)}
function c2RoomGoal(){const r=C2.r;if(!r)return null;const th=C2.alums.filter(n=>n.c2thirst&&NP.includes(n));if(r.pours<6&&th.length){if(!r.glasses)return[C2.barO.x,C2.barO.z];const n=th[0];return[n.x,n.z]}
  const near=C2.alums.filter(n=>NP.includes(n)&&(r.met.size<3?!r.met.has(n.c2a):!r.learn.has(n.c2a))).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z))[0];return near?[near.x,near.z]:null}
function c2RoomPrompts(add){const r=C2.r;if(!r||!r.glasses||P.inside!=='asr')return;for(const n of C2.alums)if(n.c2thirst&&NP.includes(n))add(n.x,n.z,2.2,'Pour '+n.name.split(' ').slice(-1)[0]+' some champagne',()=>{n.c2thirst=0;r.glasses--;r.pours++;c2GiveFlute(n);if(!r.glasses)take('c2tray');relAdd(n,3);sfx('coin');bubble(n,pick(['Good man.','Ah. Much better.','Keep it coming, pledge.','Now THAT\'S service.']),2)},0)}

// ================================================================ c) THE DONATION PITCH
function c2PellScene(done){c2Ensure();const pell=C2.alums.find(n=>n.c2a==='pell');const I=INT.asr;$('fade').style.opacity=1;
  setTimeout(()=>{goIn('asr',24,9.6);P.face=PI;yaw=0;pitch=.3;camT=3;if(pell){c2GiveFlute(pell);pell.x=I.x0+26.4;pell.z=I.z0+7.8;pell.hx=pell.x;pell.hz=pell.z;pell.a=-2.4;pell.g.position.set(pell.x,0,pell.z)}$('fade').style.opacity=0;done()},450)}
function c2ImpressChoices(){const kn=C2.r&&C2.r.learn.has('pell'),R=[];
  if(kn)R.push(['"Mr. Pell, I hear The Lantern is the finest yacht on the lake."',()=>c2Imp(3,'Pell actually laughs. "You\'ve done your homework, son. Grant, I like this one." Grant looks like he just won the lottery.')]);
  if(kn)R.push(['"I hear you rowed crew here, sir. Four years."',()=>c2Imp(2,'"Stroke seat, three seasons!" Pell lights up and talks about oarlocks for ten minutes. Grant mouths: GOOD.')]);
  R.push(['"That\'s a beautiful watch, sir. Is that a Rolex?"',()=>c2Imp(1,'"Patek." He says it like you insulted his mother. Grant changes the subject, fast.')]);
  R.push(['"So… you\'re, like, really rich, right?"',()=>c2Imp(0,'Silence. Pell stares at you over his glass. Grant laughs a little too loud. "Pledges. Ha. They say the darndest things."')]);
  return R}
function c2Imp(v,t){C2.imp=v;stand(v>=2?4:v?0:-4);return[C_('Impress the Donor','',t,null,{alert:1})]}
// V157 the pitch: Grant makes the case to Pell, Danny backs him up. Each round: Grant's point, Pell's objection, Danny's help.
// value 2 = strong, 1 = weak, -1 = the pitch is over (Pell walks out, the task fails and restarts from Grant)
const C2PITCH=[
 ['Mr. Pell, Alpha Sigma Rho has put more men in boardrooms than any house on the Row. Your gift keeps that going.','Every house on the Row tells me that, Grant. Why should I believe you?',[
   ['"Sir, your pledge class composite hangs in the hallway right outside this room. Every brother walks past the class of \'71 every single day."',2,'Pell glances toward the hallway. He doesn\'t say anything, but his shoulders drop an inch. Grant gives you the smallest nod.'],
   ['"Because Grant is honestly a really good president, sir."',1,'"I\'m sure he is." Pell does not sound sure. Grant keeps smiling anyway.'],
   ['"Because the other houses are full of losers, sir. Especially Kappa Theta Omega."',-1,'"My brother-in-law was Kappa Theta Omega." Pell sets his glass down on the arm of the throne. Grant goes pale.']]],
 ['We want to renovate the chapter house top to bottom. New roof, new study hall, new everything.','I paid for a roof in 1994, Grant. What happened to it?',[
   ['"It held for thirty years, sir. That\'s why we came to you first. Nobody builds things like your class did."',2,'"Damn right they don\'t." Pell almost smiles. Grant jumps in with the renovation numbers while he\'s warm.'],
   ['"Weather, mostly, sir. And time."',1,'Pell nods slowly. It\'s an answer. It isn\'t a good one.'],
   ['"Somebody threw a keg through it at Spring Bash. Honestly, sir, it was awesome."',-1,'Grant closes his eyes. Pell stares at you for a long, long time.']]],
 ['We\'d be honored to put the Pell name on it. On the whole wing.','Names are cheap, son. What do I actually get?',[
   ['"Your name over the door, sir. Every pledge class that walks in learns who built their house. Forever."',2,'Pell turns the idea over like a coin. "The Pell Wing," he says, to nobody. Grant squeezes your shoulder.'],
   ['"A plaque, sir. A really nice one."',1,'"A plaque." Pell sips his champagne. "Wonderful."'],
   ['"Grant said you\'d be an easy sell, sir. Old guys love having stuff named after them."',-1,'Total silence. Somewhere in the throne room, a champagne flute hits the floor.']]]];
function c2PitchCard(n,title,text,ch){return new Promise(res=>card({title,sp:n?n.name+(n.title?' · '+n.title:''):'',text,focus:n&&NP.includes(n)?n:null,ch:ch.map(([l,v])=>[l,()=>res(v)])}))}
function c2PitchRun(done){(async()=>{C2.pitch=0;const pell=C2.alums.find(n=>n.c2a==='pell'),g=NN.grant;const say=(n,t)=>{try{if(n&&NP.includes(n))c7Bub(n,t,90)}catch(e){}},hush=n=>{try{if(n)c7Unbub(n)}catch(e){}};
  for(const[gl,pl,opts]of C2PITCH){say(g,gl);await c2PitchCard(g,'The Pitch','Grant: "'+gl+'"',[['(Back him up.)',0]]);hush(g);
    say(pell,pl);const v=await c2PitchCard(pell,'The Pitch','Pell: "'+pl+'"\n\nGrant glances at you. Help him out.',opts.map(([l,v,r])=>[l,[v,r,l]]));hush(pell);
    const[val,react,line]=v;try{c7Bub(DANNY,line.replace(/^"|"$/g,''),3)}catch(e){}
    if(val<0){sfx('bad');say(pell,'We\'re done here.');await c2PitchCard(null,'The Pitch',react+'\n\n"We\'re done here," Pell says, and walks out of the throne room.',[['…',0]]);hush(pell);stand(-4);failMission('You talked Augustus Pell right out of the house. Grant is not happy.');return}
    C2.pitch+=val;if(val===2)sfx('ok');await c2PitchCard(null,'The Pitch',react,[['Keep going',0]])}
  done()})()}
function c2PitchSteps(){C2.pitch=0;const L=[{t:'cine',run:c2PitchRun}];
  L.push(fx(()=>{const s=C2.pitch+(C2.imp||0),amt=s>=8?250:s>=6?150:s>=4?75:25;C2.pledge=amt;stand(s>=6?6:s>=4?2:-3);S.c2donation=amt}));
  L.push({t:'cine',run:d=>{const amt=C2.pledge,pell=C2.alums.find(n=>n.c2a==='pell'),g=NN.grant;S.c2bet=amt;
    const line=amt>=150?'I don\'t write checks at parties, son. But I like you. '+amt+' thousand. Not on the house. On YOU.':amt>=75?amt+' thousand. On the right horse. We\'ll see which one that is after dessert.':'Twenty-five thousand. On whoever\'s still standing at the end. I don\'t bet on pitches.';
    const text=amt>=150?`Pell doesn't reach for his checkbook. He looks you up and down instead.\n\n"${line}" He taps your chest with his glass. "You'll understand after dessert."\n\nGrant's smile freezes for half a second. Then he claps you on the back, hard.`:amt>=75?`Pell swirls his glass.\n\n"${line}"\n\nGrant nods slowly, like he isn't sure whether that was good.`:`Pell finishes his champagne.\n\n"${line}"\n\nGrant's smile doesn't reach his eyes.`;
    try{if(pell&&NP.includes(pell))c7Bub(pell,line,90)}catch(e){}card({title:'The Pitch',sp:pell?pell.name+' · '+pell.title:'',text,focus:pell&&NP.includes(pell)?pell:null,ch:[[amt>=150?'"…On me?"':amt>=75?'"…The right horse?"':'"…Still standing?"',()=>{try{if(pell)c7Unbub(pell);c7Bub(DANNY,amt>=150?'…On me?':amt>=75?'…The right horse?':'…Still standing?',2.4);if(g&&NP.includes(g))c7Bub(g,'Back to work, Kowalski. Now.',2.6)}catch(e){}d()}]]})}});return L}
function c2WhyStart(){C2.why=C2.why||{n:new Set(),ear:0};if(!C2.earO){const[lx,lz]=c2Free('asr',3.4,17.8);C2.earO=c2Obj('asr',lx,lz,'Listen to the alumni by the basement door',()=>c2Eaves())}}
function c2Eaves(){if(C2.why.ear)return;C2.why.ear=1;const o=C2.earO,ex=o?o.x:P.x,ez=o?o.z:P.z;c2ObjDel(C2.earO);
  const a=C2.alums.find(n=>n.c2a==='brandt'&&NP.includes(n)),b=C2.alums.find(n=>n.c2a==='ostrander'&&NP.includes(n));if(!a||!b){card({title:'Overheard',sp:'By the basement door',alert:1,text:'"…Kowalski at five to one. Last pledge standing takes the pot, same as always."',ch:[['…Last pledge standing?',null]]});return}
  const put=(n,x,z,f)=>{n.x=n.hx=x;n.z=n.hz=z;n.a=n.ha=f;n.mode='idle';n.g.position.set(x,0,z);n.g.rotation.y=f};
  // V174 Danny eavesdrops: he stays tucked inside the basement-door alcove by the wall's end while the two alumni talk past the corner, turned to each other and away from him
  const ok=(x,z)=>freeAt(x,z,.35);let ax=ex+3.6,az=ez+2.9,bx=ex+4.8,bz=ez+2.1;if(!ok(ax,az)||!ok(bx,bz)){ax=ex+3.6;az=ez-.6;bx=ex+4.8;bz=ez+.4}
  put(a,ax,az,Math.atan2(bx-ax,bz-az));put(b,bx,bz,Math.atan2(ax-bx,az-bz));
  let dx=ex+1.75,dz=ez+.45;if(!ok(dx,dz)){dx=ex+.9;dz=ez+.3}P.x=dx;P.z=dz;P.face=Math.atan2((ax+bx)/2-dx,(az+bz)/2-dz);P.vx=P.vz=0;
  let hx=ex+4.6,hz=ez-1.6;if(!ok(hx,hz)){hx=dx-Math.sin(P.face)*1.4;hz=dz-Math.cos(P.face)*1.4}const lx=ex+3.1,lz=ez+1.45;
  c1CineOn(()=>{cam.position.set(hx,1.7,hz);cam.lookAt(lx,1.25,lz)});C1.act=[a,b];EAVES=1;
  const heard=(n,t)=>NP.includes(n)?c1Card(n,n.name,'Overheard · '+(n.title||''),'"'+t+'"',[['▸ Keep listening',null]]):Promise.resolve();
  (async()=>{try{
    c1Sub('','Two alumni are talking low past the corner. Danny stays out of sight and listens.');await c1Wait(2.6);c1Sub(null);
    await heard(a,'…the Dunmore kid looks strong. Everybody\'s on him. The book has him at two to one.');
    await heard(b,'The Kowalski boy\'s scrappy. Big Ed\'s son. Big Ed broke my nose in \'93.');
    await c1Card(DANNY,'Danny','Thinking','(…Are they talking about me?)',[['▸ Keep listening',null]]);
    await heard(a,'Then I\'ll take Kowalski at five to one. Last pledge standing takes the pot, same as always.');
    c2GiveFlute(a);c2GiveFlute(b);tone(2600,.12,'sine',.05);tone(3100,.16,'sine',.04,.05);c1Sub('','They clink glasses and head for the bar. Neither of them saw him.');
    const bar=C2.barO?[C2.barO.x,C2.barO.z]:[ex+8,ez];for(const[n,k]of[[a,-1],[b,1]]){n.hx=bar[0]+k*1.2;n.hz=bar[1]+1.3}await c1Wait(2.4);c1Sub(null);
    await c1Card(DANNY,'Overheard','','(…Last pledge standing?)',[['▸ Continue',null]])}catch(e){console.warn('c2Eaves',e)}EAVES=0;c1Sub(null);c1CineOff();toast('Somebody here is betting on the pledges. Find out what\'s going on.',3200)})()}
function c2WhyLab(){const w=C2.why||{n:new Set()},c=w.n.size+(w.ear?1:0);return`Find out why the alumni keep sizing up the pledges (${Math.min(3,c)}/3 clues). Ask alumni, and listen near the basement door.`}
function c2Reveal(done){const pell=C2.alums.find(n=>n.c2a==='pell')||C2.alums[0],brandt=C2.alums.find(n=>n.c2a==='brandt')||C2.alums[1];const I=INT.asr;
  c1CineOn(()=>{cam.position.set(P.x+3.4,2.3,P.z+2.6);cam.lookAt(P.x-.5,1.5,P.z-1.4)});C1.act=[];
  for(const[n,dx,dz]of[[pell,-1.6,-1.4],[brandt,1.4,-1.8]])if(n&&NP.includes(n)){n.x=P.x+dx;n.z=P.z+dz;n.hx=n.x;n.hz=n.z;n.a=Math.atan2(P.x-n.x,P.z-n.z);n.g.position.set(n.x,P.y||0,n.z);n.g.rotation.set(0,n.a,0);C1.act.push(n)}
  (async()=>{await c1Wait(1);
    await c1Line(pell,'You\'ve been asking questions, Kowalski. Good. Curious men make the best investments.');
    await c1Line(pell,'Let me be straight with you. A house is just bricks. We don\'t write checks for bricks.','"Then what are the checks for?"');
    await c1Line(brandt,'For you, kid. The new class. Every year we come back, we have a nice dinner, and then we find out what the new boys are made of.');
    await c1Line(pell,'Downstairs. Where it counts. The pledge who\'s still standing at the end of the night? That\'s where the real money goes. Half to the house, half to whoever backed him.','"…You\'re betting on us."');
    await c1Line(brandt,'Betting, investing. Tomato, tomahto.');
    c1CineOff();done()})()}

// ================================================================ d) THE AFTER PARTY (the basement)
const C2RINGS=[[21,19.5],[60,19.5],[21,55.5]],C2KOTH=[60,55.5];
const C2ROLE={popstar:['Sing the fighters into the ring','Sing the walk-out song'],stats:['Record each fight\'s result (and log the alumni wagers)','Record the result'],skate:['Skate the ring cards around each cage','Skate the round card'],
 burglar:['Lift a souvenir from each ringside','Swipe a souvenir'],fruit:['Feed each corner a fruit snack','Hand out fruit'],ouija:['Predict each winner with the board','Consult the spirits'],caveman:['Bang the gong at each cage','BANG THE GONG'],
 cone:['Set traffic cones around each cage','Place the cones'],weather:['Give a "forecast" for each fight','Give the forecast'],basketball:['Bounce the ball as each round bell','Bounce the bell'],pouch:['Hand each corner what they need','Hand over supplies'],
 grenade:['Dive on dropped mouthguards at each cage','GRENADE!'],morning:['Wake up the knocked-out fighters','Wake him up'],delinquent:['Cause a little ringside chaos','Start some chaos'],captain:['Line up the next fighters at each cage','Line them up'],
 hype:['Hype up the crowd at each cage','HYPE THEM UP'],snack:['Bring snacks to each ringside','Serve snacks'],scribe:['Write up each fight for the chapter log','Write it up'],mascot:['Do the mascot dance at each cage','Do the dance']};
function c2AfterOn(){if(C2.after)return;c2Ensure();C2.after=1;const I=INT.asr_bsmt,X=x=>I.x0+x,Z=z=>I.z0+z,st=curStep();
  for(const n of C2.alums)if(NP.includes(n))despawn(n);C2.alums=[];
  for(const n of NP)if(n.int==='asr_bsmt'&&!n.temp&&!n.hidden){n.hidden=1;n.c2hid=1;C2.hid.push(n)}
  [['pell',21,28.6],['brandt',60,28.6],['dunmore',12,40],['ostrander',45,37],['whitford',31,62],['reddick',70,44]].forEach(([k,lx,lz])=>c2Alum(k,'asr_bsmt',lx,lz));
  // sparring pairs in three of the cages
  C2.match=C2RINGS.map(([cx,cz],i)=>{const a=spawn('brothers','asr_bsmt',{house:'asr',noLetters:1,prop:1,fem:0,x:X(cx-1.1),z:Z(cz),temp:1,mode:'idle',name:'Pledge',title:'In the ring',lvl:2}),b=spawn('brothers','asr_bsmt',{house:'asr',noLetters:1,prop:1,fem:0,x:X(cx+1.1),z:Z(cz),temp:1,mode:'idle',name:'Pledge',title:'In the ring',lvl:2});for(const n of[a,b]){n.actor=1;n.c2spar=1;c2Fighter(n.g,1)}return{a,b,cx:X(cx),cz:Z(cz),ph:i*1.7}});
  // the creeps: alumni who've cornered a pledge, watching for anyone to take their place
  C2.creeps=[[45,70,PI/2],[30,41,-PI/2],[74,64,PI],[100,62,-PI/2],[86,11,0],[104,84,-PI/2]].map(([lx,lz,a],ci)=>{const[x,z]=c2Free('asr_bsmt',lx,lz);const c=spawn('oldguard','asr_bsmt',{x:X(x),z:Z(z),a,temp:1,mode:'idle',lvl:6,fem:0,name:['Dale Prentiss','Warren Hale','Monty Glass','Chet Aldridge','Rufus Pike','Lyle Tarkington'][ci],title:'Alumnus',shirt:0x18181d,sleeve:0x18181d,pants:0x141418,hair:0xa8a8a8});c.hx=c.x;c.hz=c.z;c.ha=a;c.c2creep=1;
    const v=spawn('brothers','asr_bsmt',{house:'asr',noLetters:1,prop:1,fem:0,x:X(x)+Math.sin(a)*.9,z:Z(z)+Math.cos(a)*.9,a:a+PI,temp:1,mode:'idle',name:'Pledge',title:'Cornered',lvl:1});v.actor=1;v.blind=1;return[c,v]});
  {const[hx,hz]=c2Free('asr_bsmt',94,34);const p=spawn('brothers','asr_bsmt',{house:'asr',noLetters:1,prop:1,fem:0,x:X(hx),z:Z(hz),a:0,temp:1,mode:'idle',name:'Pledge',title:'Getting hazed',lvl:1});p.actor=1;p.blind=1;p.hx=p.x;p.hz=p.z;p.ha=0;
    const br=[[-1.3,1],[1.3,1]].map(([dx,dz],i)=>{const b=spawn('brothers','asr_bsmt',{house:'asr',fem:0,x:X(hx+dx),z:Z(hz+dz),a:Math.atan2(-dx,-dz),temp:1,mode:'idle',name:['Chase K.','Colton R.'][i],title:'ΑΣΡ Brother',lvl:4});b.hx=b.x;b.hz=b.z;b.ha=b.a;b.blind=1;return b});C2.haze={p,br}}
  if(!C2.crowdB)C2.crowdB=c2CrowdB(I);C2.crowdB.g.visible=true;c2FxOn(1)}
// V175 a packed, rowdy fight-night basement: a dense posed crowd that cheers, throws arms up and tosses bills at the cages, plus a standing cigar haze
const C2POSE={idle:null,up:{R:[-2.85,0,.35,-.25],L:[-2.85,0,-.35,-.25]},fist:{R:[-2.9,0,.15,-.6],L:[0,0,-.05,-.4]},toss:{R:[-2.0,0,.1,-.2],L:[-.3,0,-.05,-.9]}},C2PN=['idle','up','fist','toss'];
function c2PoseLook(i){C2.lookB=C2.lookB||[];if(C2.lookB[i]!==undefined)return C2.lookB[i];let r=null;
  try{const sh=pick(C2PAL.SH),o={shirt:sh,sleeve:sh,pants:pick(C2PAL.PA),skin:pick(SKIN),hair:pick(C2PAL.HA),fem:rnd()<.2};r={};
    for(const pn of C2PN){const g=mkPerson(o);try{animP(g,0,i*.7,'')}catch(e){}const q=C2POSE[pn],p=g.P;if(q&&p&&p.aL)for(const[a,e,v]of[[p.aL,p.eL,q.L],[p.aR,p.eR,q.R]]){a.rotation.set(v[0]+(rnd()-.5)*.15,v[1],v[2]);e.rotation.set(v[3],0,0)}
      g.updateMatrixWorld(true);const Lo=g.children.find(c=>c.isLOD);if(!Lo){r=null;break}const lv=Lo.levels.length>1?Lo.levels[1].object:Lo.levels[0].object,m=bakeSkinned(lv);r[pn]={geo:m.geometry,mat:m.material}}}catch(e){console.warn('c2PoseLook',e);r=null}
  return C2.lookB[i]=r}
function c2CrowdSpots(I){const X=x=>I.x0+x,Z=z=>I.z0+z,sp=[],rings=C2RINGS.concat([C2KOTH]),keep=[];
  for(const n of C2.alums||[])keep.push([n.x,n.z,1.7]);for(const[c,v]of C2.creeps||[])keep.push([c.x,c.z,2],[v.x,v.z,1.4]);if(C2.haze)keep.push([C2.haze.p.x,C2.haze.p.z,2.8]);
  for(const[tx,tz]of[[16,78],[76,78],[40.5,5]])keep.push([X(tx),Z(tz),2.6]);keep.push([X(DUNG.sx),Z(DUNG.D),7]);
  const ok=(x,z)=>freeAt(x,z,.4)&&!keep.some(([a,b,r])=>Math.hypot(x-a,z-b)<r)&&!sp.some(([a,b])=>Math.hypot(a-x,b-z)<.72);
  for(const[cx,cz]of rings)for(const[rr,dn]of[[7.1,.92],[8.25,1.0]]){const n=Math.floor(TAU*rr/dn);for(let k=0;k<n;k++){const an=k/n*TAU+rr,  // two aisles per ring so Danny can still walk up to the cage
      gap=Math.min(Math.abs(Math.sin((an-.6)/2)),Math.abs(Math.sin((an-.6-PI)/2)));if(gap<.1)continue;if(rnd()<.15)continue;
      const x=X(cx)+Math.sin(an)*(rr+(rnd()-.5)*.35),z=Z(cz)+Math.cos(an)*(rr+(rnd()-.5)*.35);if(ok(x,z))sp.push([x,z,Math.atan2(X(cx)-x,Z(cz)-z)+(rnd()-.5)*.4,1])}}
  let t=0;const tgt=sp.length+120;while(sp.length<tgt&&t++<5000){const x=X(2+rnd()*80),z=Z(8+rnd()*78);if(rings.some(([cx,cz])=>Math.hypot(x-X(cx),z-Z(cz))<9.8))continue;if(ok(x,z))sp.push([x,z,rnd()*TAU,0])}
  return sp}
function c2CrowdB(I){if(GFX!=='enhanced'){const C=c1Crowd(c2CrowdSpots(I).map(([x,z,a])=>[x,z,a]),C2PAL);I.g.add(C.g);C.old=1;return C}
  const sp=c2CrowdSpots(I),NL=10,looks=[];for(let i=0;i<NL;i++){const l=c2PoseLook(i);if(l)looks.push(l)}
  if(!looks.length){const C=c1Crowd(sp.map(([x,z,a])=>[x,z,a]),C2PAL);I.g.add(C.g);C.old=1;return C}
  const g=new THREE.Group(),meshes=[],data=sp.map(([x,z,a,ring],i)=>({x,z,a,ring,ph:rnd()*TAU,s:.94+rnd()*.12,pose:0,pt:rnd()*2,L:i%looks.length,ms:[]}));
  looks.forEach((l,k)=>{const mem=data.filter(d=>d.L===k);if(!mem.length)return;C2PN.forEach((pn,pi)=>{const m=new THREE.InstancedMesh(l[pn].geo,l[pn].mat,mem.length);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;m.receiveShadow=true;m.userData.noMerge=1;mem.forEach((d,j)=>{d.ms[pi]=[m,j]});g.add(m);meshes.push(m)})});
  I.g.add(g);const C={g,meshes,data,N:data.length,t:0};c2CrowdTick(C,0);return C}
const _c2z=new THREE.Matrix4().makeScale(0,0,0);
function c2CrowdTick(C,dt){if(C.old){c1CrowdUpd(C,TT*1.3);return}C.t+=dt;const t=C.t,near=(d)=>Math.hypot(d.x-P.x,d.z-P.z)<34;
  for(const d of C.data){d.pt-=dt;if(d.pt<=0){const r=rnd(),hot=d.ring?1:.45;d.pose=r<1-.7*hot?0:r<1-.45*hot?1:r<1-.15*hot?2:3;d.pt=.5+rnd()*(d.pose?1.1:2.2);
      if(d.pose===3&&d.ring&&near(d))c2Bill(d)}
    const jump=d.pose===1||d.pose===2?Math.abs(Math.sin(t*7+d.ph))*.09:Math.abs(Math.sin(t*3+d.ph))*.02;
    _c1e.set(0,d.a+Math.sin(t*1.3+d.ph)*(d.pose?.12:.3),Math.sin(t*2+d.ph)*.03);_c1q.setFromEuler(_c1e);_c1v.set(d.x,jump,d.z);_c1s.set(d.s,d.s,d.s);_c1m.compose(_c1v,_c1q,_c1s);
    for(let pi=0;pi<d.ms.length;pi++){const e=d.ms[pi];if(e)e[0].setMatrixAt(e[1],pi===d.pose?_c1m:_c2z)}}
  for(const m of C.meshes)m.instanceMatrix.needsUpdate=true;c2FxTick(dt,C)}
// bills and cigar smoke live in one group that only shows while Danny is in the basement during the after party
function c2Fx(){if(C2.fx)return C2.fx;const g=new THREE.Group();g.userData.noMerge=1;sc.add(g);
  const bg=new THREE.PlaneGeometry(.24,.11),bm=new THREE.MeshBasicMaterial({color:0x8fc27a,side:THREE.DoubleSide}),bills=new THREE.InstancedMesh(bg,bm,120);bills.instanceMatrix.setUsage(THREE.DynamicDrawUsage);bills.frustumCulled=false;g.add(bills);
  if(!GC.c2smk){const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.45,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);GC.c2smk=new THREE.CanvasTexture(cv)}
  const haze=[],wisps=[],SP=(c)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:GC.c2smk,color:c,transparent:true,opacity:0,depthWrite:false,fog:true}));m.renderOrder=3;return m};
  for(let i=0;i<95;i++){const m=SP(0xd8cfbf);g.add(m);haze.push({m,t:rnd()*24,life:22+rnd()*10,vx:(rnd()-.5)*.25,vz:(rnd()-.5)*.25,o:.2+rnd()*.14})}
  for(let i=0;i<30;i++){const m=SP(0xe6e0d4);m.visible=false;g.add(m);wisps.push({m,t:9,life:4})}
  return C2.fx={g,bills,B:Array.from({length:120},()=>({on:0})),haze,wisps,wt:0,i:0}}
function c2FxOn(on){if(on)c2Fx();if(C2.fx)C2.fx.g.visible=!!on;if(!on&&C2.fx){for(const b of C2.fx.B)b.on=0}}
function c2HazeSpot(h){const I=INT.asr_bsmt;h.m.position.set(I.x0+3+rnd()*78,1.4+rnd()*2.4,I.z0+8+rnd()*78);h.m.scale.setScalar(4+rnd()*5);h.t=0}
function c2Bill(d){const F=C2.fx;if(!F)return;const rings=C2RINGS.concat([C2KOTH]),I=INT.asr_bsmt;let c=null,cd=1e9;for(const[cx,cz]of rings){const q=Math.hypot(d.x-I.x0-cx,d.z-I.z0-cz);if(q<cd){cd=q;c=[I.x0+cx,I.z0+cz]}}if(!c)return;
  for(let k=0;k<2+(rnd()*3|0);k++){const b=F.B[F.i=(F.i+1)%F.B.length],dx=c[0]-d.x,dz=c[1]-d.z,l=Math.hypot(dx,dz)||1,v=2.2+rnd()*1.4;Object.assign(b,{on:1,t:0,x:d.x+dx/l*.3,y:2.05,z:d.z+dz/l*.3,vx:dx/l*v+(rnd()-.5)*.8,vy:2+rnd()*1.4,vz:dz/l*v+(rnd()-.5)*.8,r:rnd()*TAU,w:(rnd()-.5)*14,land:0})}}
function c2FxTick(dt,C){const F=C2.fx;if(!F)return;const vis=F.g.visible=C2.after&&P.inside==='asr_bsmt';if(!vis)return;
  for(let i=0;i<F.B.length;i++){const b=F.B[i];if(b.on){b.t+=dt;if(!b.land){b.vy-=5.5*dt;b.vx*=1-dt*.9;b.vz*=1-dt*.9;if(b.vy<-1.1)b.vy=-1.1;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;b.r+=b.w*dt;if(b.y<=.02){b.y=.012;b.land=1}}if(b.t>9)b.on=0;
      _c1e.set(b.land?-PI/2:Math.sin(b.r)*1.2,b.r*.4,b.land?0:Math.cos(b.r*1.3)*.8);_c1q.setFromEuler(_c1e);_c1v.set(b.x,b.y,b.z);_c1s.set(1,1,1);_c1m.compose(_c1v,_c1q,_c1s);F.bills.setMatrixAt(i,_c1m)}else F.bills.setMatrixAt(i,_c2z)}
  F.bills.instanceMatrix.needsUpdate=true;
  for(const h of F.haze){h.t+=dt;if(h.t>h.life||h.m.position.x===0)c2HazeSpot(h);h.m.position.x+=h.vx*dt;h.m.position.z+=h.vz*dt;h.m.position.y+=dt*.03;h.m.material.opacity=h.o*Math.min(1,h.t/4)*Math.min(1,Math.max(0,(h.life-h.t)/4))}
  F.wt-=dt;if(F.wt<=0&&C&&C.data&&C.data.length){F.wt=.12;const d=pick(C.data);if(Math.hypot(d.x-P.x,d.z-P.z)<26){const w=F.wisps.find(w=>w.t>=w.life);if(w){w.t=0;w.life=3+rnd()*2;w.x=d.x+Math.sin(d.a)*.22+(rnd()-.5)*.1;w.z=d.z+Math.cos(d.a)*.22;w.y=1.62;w.m.visible=true}}}
  for(const w of F.wisps){if(w.t>=w.life){w.m.visible=false;continue}w.t+=dt;const k=w.t/w.life;w.m.position.set(w.x+Math.sin(w.t*2+w.y)*.08*k,w.y+w.t*.32,w.z);w.m.scale.setScalar(.15+k*1.1);w.m.material.opacity=.45*Math.min(1,w.t*3)*(1-k)}}
function c2AfterOff(){c2TablesOff();C2.heldK=undefined;if(C2.heldM){C2.heldM.parent&&C2.heldM.parent.remove(C2.heldM);C2.heldM=null;if(PM.HOLD==='up'||PM.HOLD==='bucket')PM.HOLD=null}if(C2.haze){for(const n of[C2.haze.p,...C2.haze.br])NP.includes(n)&&despawn(n);C2.haze=null}for(const m of C2.match||[])for(const n of[m.a,m.b])NP.includes(n)&&despawn(n);C2.match=[];for(const[c,v]of C2.creeps||[])for(const n of[c,v])NP.includes(n)&&despawn(n);C2.creeps=[];if(C2.crowdB)C2.crowdB.g.visible=false;c2FxOn(0);
  for(const o of C2.roleO||[])c2ObjDel(o);C2.roleO=[];take('c2item')}
function c2DownStart(){c2AfterOn();const I=INT.asr_bsmt,st=curStep();for(const[c]of C2.creeps)c.stepTemp=st;
  C2.a=Object.assign({del:0,strikes:0,hold:null,reqT:2,role:0,wager:new Set(),roleK:S.prole&&C2ROLE[S.prole]?S.prole:'pouch'},{});for(const n of C2.alums)n.c2req=null;
  c2Tables();
  C2.roleO=[];for(const n of C2.alums)n.c2role=null;if(0)C2RINGS.map(([cx,cz],i)=>{const[x,z]=c2Free('asr_bsmt',cx,cz+8);const o=c2Obj('asr_bsmt',x,z,R[1]+` (cage ${i+1})`,()=>{if(o.done)return;o.done=1;C2.a.role++;c2ObjDel(o);sfx('ok');c2RoleLine(i)});return o})}
// V160 pledge-role favours: the alumni call Danny over for something only his pledge job can do. [task label, prompt, [ask, result]×3]
const C2RREQ={
 pouch:['Fetch what the alumni need from your pouch','Dig through your pouch',[['Pouch pledge! Got a lighter in that thing?','A lighter, under three gum wrappers and a parking ticket. He lights a cigar off it and keeps it.'],['Pledge, there a pen in there? I need to write something down.','A pen. He writes a number on a napkin, folds it and tucks it in his jacket. He doesn\'t show you.'],['Pouch! Breath mints. Now. Don\'t ask why.','A tin of mints. He takes the whole tin.']]],
 popstar:['Sing for the alumni who ask','Sing',[['You! The singer! Give my fighter a walk-out song.','You belt a walk-out song so loud the fighter in cage two starts bouncing on his toes.'],['Sing something for my wife. She\'s not here. Sing it anyway.','You sing a slow ballad to an empty chair. He wipes his eye and tips you a twenty.'],['Pledge! The old fight song. From the top.','Half the alumni join in on the chorus. Nobody knows the second verse, so you make one up.']]],
 stats:['Run the numbers the alumni ask for','Run the numbers',[['Stats boy! What are the odds on cage two?','Three to one on the short kid. He nods like he already knew, and goes to place his bet.'],['What\'s Brock\'s record tonight?','Two and oh, both by knockout. He whistles.'],['Write down my bet. Two hundred. On the tall one.','You log it in the ledger. Two hundred, the tall one, a signature that looks like a seismograph.']]],
 skate:['Skate errands for the alumni','Skate it over',[['Skater! Take this note to the man with the biggest cigar.','You weave through the crowd and hand it over. The man with the cigar reads it, laughs, and eats it.'],['Skate me a fresh cigar from the humidor, pledge.','A clean lap there and back. He times you. Eleven seconds. "Not bad."'],['Do a lap around the cage. For luck.','You do a full lap around cage one on one skate. The alumni cheer louder than they do for the fight.']]],
 burglar:['Lift what the alumni ask you to','Lift it',[['Pssst. Get me that guy\'s lighter, the one by the bar. He owes me one.','In and out. The mark never notices. The alumnus pockets it, grinning.'],['The ref has my flask. Get it back without him seeing.','You lift it right off the ref\'s belt mid-count. Smooth.'],['See that man\'s pocket square? I want it. Don\'t ask.','You come back with the pocket square. He tucks it into his own jacket, very pleased.']]],
 fruit:['Serve the alumni fruit','Serve the fruit',[['Fruit pledge! One grape. Peeled.','You peel a grape with your thumbnails. He eats it slowly while staring at you.'],['Is that a melon? Cube it.','Twelve perfect cubes on a napkin. He says it\'s the best thing he\'s eaten all night.'],['Orange slices for my fighter. Between rounds.','You pass orange slices through the cage. The pledge in the corner nearly cries.']]],
 ouija:['Ask the spirits for the alumni','Consult the board',[['Ask your board who wins cage one.','The planchette slides to the left side. Two minutes later, the left side wins. He looks a little scared of you.'],['Spirit board! Will my third wife leave me?','The planchette spells Y-E-S. He laughs too loud and orders another drink.'],['Ask the dead what number I should bet.','It spells S-E-V-E-N. He bets seven hundred. You hope the dead know what they\'re doing.']]],
 caveman:['Bang the gong when the alumni say','BANG THE GONG',[['Caveman! When I raise my glass, ring that thing.','He raises his glass. BONNNNG. Three alumni spill their champagne.'],['GONG. NOW. For my boy in cage three.','BONNNNG. His boy wins the round. You get full credit.'],['Bang it twice. It\'s my birthday.','BONNNNG. BONNNNG. The whole basement sings Happy Birthday, badly.']]],
 cone:['Cone off what the alumni point at','Place the cones',[['Put a cone around my good shoes. Nobody steps on them.','Four cones around a pair of Italian loafers. He takes a photo.'],['Cone off my seat. Nobody sits there.','The chair is now a restricted area. He sits in it like a king.'],['Cones around that puddle. It isn\'t water.','You don\'t ask. The puddle is coned.']]],
 weather:['Give the alumni their forecast','Give the forecast',[['Weatherman! What\'s the forecast for cage three?','"Seventy percent chance of a broken nose, folks." Big laugh.'],['I\'m sailing tomorrow. Give me the forecast.','"Clear skies, light chop, and a hangover moving in from the west." He laughs and tips you.'],['Is it going to rain blood in there?','"Scattered nosebleeds, clearing by midnight." He writes it down.']]],
 basketball:['Do ball tricks for the alumni','Do the trick',[['Spin it on your finger, pledge. I\'ll tip you.','Twelve full seconds. He tips you five bucks and makes you do it again.'],['Bounce it off the cage. Bet you can\'t.','Off the cage, off the floor, into your hands. He loses a ten-dollar bet to his friend.'],['Behind the back. For my grandson. I\'m filming.','Behind the back, through the legs, a spin to finish. His grandson is going to love it.']]],
 grenade:['Throw yourself on what the alumni drop','GRENADE!',[['I dropped my cigar. GRENADE, pledge!','"GRENADE!" You dive on a lit cigar. Your tux has a new hole. The crowd roars.'],['Somebody spilled. Grenade on the spill.','You land in the spill face first. An alumnus gives you a slow clap.'],['My ice cube fell. You know what to do.','"GRENADE!" You save the ice cube. He doesn\'t take it back.']]],
 morning:['Wake up the alumni who nodded off','Wake him up',[['Wake up my buddy over there. He\'s snoring through the main event.','"GOOD MORNING, SIR!" He wakes up swinging, then thanks you.'],['Shake that old guy awake. Gently. He bites.','"Rise and shine, sir!" He blinks, asks what year it is, and bets a thousand dollars.'],['Our man in the corner fell asleep in his chair.','You blast a wake-up call into his ear. He jumps three feet and orders coffee.']]],
 delinquent:['Cause the trouble the alumni pay for','Make trouble',[['Ten bucks if you untie the ref\'s shoes.','Both shoes, mid-fight. The ref trips over his own laces at the bell. Ten bucks, as promised.'],['Swap that guy\'s champagne for tap water. The one by the stairs.','He takes a sip, makes a face, and blames the caterer. The alumnus who asked is crying laughing.'],['Start a chant. Something rude.','You start a chant about Kappa Theta Omega. The whole basement picks it up.']]],
 captain:['Organize what the alumni ask for','Get it organized',[['Captain! Line the next fighters up by height. I want to see.','Six pledges, shortest to tallest, in thirty seconds. He picks one to bet on like he\'s buying a horse.'],['Sort out the fight card for cage two. It\'s a mess.','You rewrite the fight card on a napkin. It\'s the most organized thing in the basement.'],['Get the betting line moving. It\'s backed up to the stairs.','You split it into two lines. The alumni call you a natural leader.']]],
 hype:['Hype up the alumni who ask','HYPE IT UP',[['Hype my fighter up, pledge. LOUD.','"ARE YOU READY?!" His fighter is ready. The whole basement is ready.'],['Get the whole room chanting my name.','The whole basement chants his name. He raises both fists like he just won the fight himself.'],['Get them on their feet for the main event.','Every alumnus in the room is on his feet, spilling champagne.']]],
 snack:['Bring the alumni their snacks','Bring the snack',[['Snack pledge! Pigs in a blanket.','Six pigs in a blanket on a napkin. He eats all six before you walk away.'],['Cheese. Any cheese. Fast.','A wedge of brie and a cracker. He looks at you like you saved his life.'],['Something fried. I don\'t care what.','Mozzarella sticks. He doesn\'t say thank you, but he does say "good boy."']]],
 scribe:['Take down what the alumni dictate','Write it down',[['Write this down: "I was ROBBED."','You write it in your best handwriting and he signs it. He wants it framed.'],['Take a note for my memoir. Chapter twelve.','Three paragraphs about the night he met a duchess. You use the word "resplendent."'],['Write my toast for later. Make me sound smart.','You write him a toast with a Latin quote in it. He practices it under his breath.']]],
 mascot:['Do the mascot routine for the alumni','Do the dance',[['Do the goat thing, pledge. My buddies don\'t believe you know it.','You do the goat dance. Somebody\'s grandfather films it in portrait mode.'],['Mascot! Dance during the break.','You dance through the whole break. The alumni throw dollar bills.'],['Do the routine. The whole routine.','The full routine, splits included. You will feel this tomorrow.']]]};
const c2RQ=()=>C2RREQ[C2.a&&C2.a.roleK]||C2RREQ.pouch;
// V168 three supply tables around the basement; each has three pickups along its front edge (champagne, towels, ice) and pushes Danny out of its footprint
const C2SUPW=2.66,C2SUPD=1.04,C2ITEMS=[['champagne','Take a bottle of champagne',-.75],['towel','Take a towel',.05],['ice','Take the ice bucket',.8]];
function c2TableSpot(lx,lz){const I=INT.asr_bsmt,ok=(x,z)=>{for(let dx=-1.7;dx<=1.7;dx+=.425)for(let dz=-.8;dz<=2;dz+=.4)if(!freeAt(I.x0+x+dx,I.z0+z+dz,.2))return false;return!C2RINGS.concat([C2KOTH]).some(([cx,cz])=>Math.hypot(cx-x,cz-z)<9)};
  for(let d=0;d<14;d+=.75)for(let a=0;a<16;a++){const x=lx+Math.cos(a/16*TAU)*d,z=lz+Math.sin(a/16*TAU)*d;if(ok(x,z))return[x,z];if(!d)break}return[lx,lz]}
function c2Tables(){const I=INT.asr_bsmt;if(!C2.tabs){C2.tabs=[[16,78],[76,78],[40.5,5]].map(([x,z])=>{const[lx,lz]=c2TableSpot(x,z);return{lx,lz,g:c2SupplyTable(lx,lz)}})}
  for(const t of C2.tabs){t.g.visible=true;t.objs=C2ITEMS.map(([k,l,dx])=>c2Obj('asr_bsmt',t.lx+dx,t.lz+C2SUPD/2+.55,l,()=>{const a=C2.a;if(!a)return;if(a.hold===k){toast('You already have the '+k+'.',1400);return}a.hold=k;sfx('ok');toast(a.hold==='ice'?'Ice bucket in hand. Find who asked for it.':'Got the '+k+'. Find who asked for it.',2000)},.75))}
  C2.tableO=C2.tabs[0].objs[1]}
function c2TablesOff(){for(const t of C2.tabs||[]){t.g.visible=false;for(const o of t.objs||[])c2ObjDel(o);t.objs=[]}C2.tableO=null}
function c2TableNear(k){const I=INT.asr_bsmt;let best=null,bd=1e9;for(const t of C2.tabs||[]){const o=(t.objs||[])[Math.max(0,C2ITEMS.findIndex(q=>q[0]===k))];if(!o)continue;const d=Math.hypot(o.x-P.x,o.z-P.z);if(d<bd){bd=d;best=o}}return best}
function c2TableBlock(){if(P.inside!=='asr_bsmt'||!C2.tabs)return;const I=INT.asr_bsmt,hw=C2SUPW/2+.32,hd=C2SUPD/2+.32;for(const t of C2.tabs){if(!t.g.visible)continue;const x=I.x0+t.lx,z=I.z0+t.lz,dx=P.x-x,dz=P.z-z;
  if(Math.abs(dx)<hw&&Math.abs(dz)<hd){const px=hw-Math.abs(dx),pz=hd-Math.abs(dz);if(px<pz)P.x=x+Math.sign(dx||1)*hw;else P.z=z+Math.sign(dz||1)*hd}}}
function c2SupplyTable(lx,lz){const I=INT.asr_bsmt;const g=new THREE.Group(),A=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.userData.noMerge=1;g.add(o);return o};
  A(bgeo(2.6,.06,1),mt(0x5a3a22,.7),0,.82,0);A(bgeo(2.66,.5,1.04),mt(0xf2efe6,.9),0,.6,0);for(const sx of[-1.2,1.2])for(const sz of[-.4,.4])A(bgeo(.07,.82,.07),mt(0x3a2614,.7),sx,.41,sz);
  const gl=new THREE.MeshStandardMaterial({color:0x1f4a2a,roughness:.15,metalness:.2,transparent:true,opacity:.85});for(let i=0;i<5;i++){const x=-1+i*.18;A(GC.c2bt||(GC.c2bt=new THREE.CylinderGeometry(.045,.05,.26,10)),gl,x,.98,-.2);A(GC.c2bn||(GC.c2bn=new THREE.CylinderGeometry(.018,.03,.1,8)),gl,x,1.16,-.2);A(GC.c2bf||(GC.c2bf=new THREE.CylinderGeometry(.02,.02,.04,8)),mt(0xe2b64c,.3,.6),x,1.22,-.2)}
  for(let i=0;i<6;i++)A(bgeo(.34,.07,.24),mt(i%2?0xffffff:0xf4f0e6,.95),.05,.89+i*.07,.15);
  A(new THREE.CylinderGeometry(.2,.16,.26,16),mt(0xc8ccd2,.25,.85),.8,.98,.05);for(let i=0;i<7;i++)A(bgeo(.08,.07,.08),new THREE.MeshStandardMaterial({color:0xe8f6ff,roughness:.05,transparent:true,opacity:.7}),.8+(rnd()-.5)*.22,1.12+(i%3)*.03,.05+(rnd()-.5)*.2);
  {const s=signMesh('SUPPLIES',.9,.22,'#1d1a16','#e2b64c');s.position.set(0,.62,.53);g.add(s)}g.position.set(I.x0+lx,0,I.z0+lz);g.userData.noMerge=1;I.g.add(g);return g}
function c2Held(){const a=C2.a,p=PM&&PM.P;if(!p||!p.hR)return;const want=a&&P.inside==='asr_bsmt'?a.hold:null;if(want===C2.heldK)return;C2.heldK=want;if(C2.heldM){C2.heldM.parent&&C2.heldM.parent.remove(C2.heldM);C2.heldM=null;if(PM.HOLD==='up'||PM.HOLD==='bucket')PM.HOLD=null}if(!want)return;
  const g=new THREE.Group(),A=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.userData.noMerge=1;g.add(o);return o};
  if(want==='champagne'){const gl=new THREE.MeshStandardMaterial({color:0x1f4a2a,roughness:.15,metalness:.2});A(new THREE.CylinderGeometry(.045,.05,.26,10),gl,0,-.06,.04);A(new THREE.CylinderGeometry(.018,.03,.1,8),gl,0,.12,.04);A(new THREE.CylinderGeometry(.02,.02,.04,8),mt(0xe2b64c,.3,.6),0,.18,.04)}
  else if(want==='towel'){const t=A(bgeo(.3,.05,.2),mt(0xffffff,.95),0,-.06,.08);t.rotation.z=.2;A(bgeo(.3,.05,.2),mt(0xf4f0e6,.95),0,-.01,.08).rotation.z=.2}
  else{// V182 ice bucket hangs from its wire bail: Danny's fist closes on the top of the handle, the bucket swings below his hand
    const steel=mt(0xc8ccd2,.25,.85),Y=-.31;A(new THREE.CylinderGeometry(.14,.115,.22,16,1,true),new THREE.MeshStandardMaterial({color:0xc8ccd2,roughness:.25,metalness:.85,side:THREE.DoubleSide}),0,Y,0);A(new THREE.CylinderGeometry(.115,.115,.012,16),steel,0,Y-.105,0);
    const rim=A(new THREE.TorusGeometry(.14,.008,6,20),steel,0,Y+.11,0);rim.rotation.x=PI/2;
    const bail=A(new THREE.TorusGeometry(.142,.007,6,18,PI),steel,0,Y+.11,0);bail.scale.y=1.42;   // the arc peaks right in the grip
    for(const sx of[-1,1])A(new THREE.SphereGeometry(.014,6,4),steel,sx*.142,Y+.11,0);
    const ice=new THREE.MeshStandardMaterial({color:0xe8f6ff,roughness:.05,transparent:true,opacity:.75});for(let i=0;i<7;i++)A(bgeo(.06,.055,.06),ice,((i%3)-1)*.06,Y+.085+(i%2)*.025,((i/3|0)-1)*.05).rotation.y=i*.7}
  p.hR.add(g);C2.heldM=g;PM.HOLD=want==='ice'?'bucket':'up'}
function c2RoleLine(i){const k=C2.a.roleK,who=pick(['Felix','Hunter','Kofi','Theo','Nate','Miles']);const T={stats:`Cage ${i+1}: ${who} by TKO, round 2. You write it in the ledger next to the alumni's bets.`,popstar:'You belt out a walk-out song. The alumni throw dollar bills into the cage.',caveman:'BONNNNG. Three alumni spill their champagne.',grenade:'"GRENADE!" You dive on a spat-out mouthguard. The crowd roars. You regret everything.',weather:'"Seventy percent chance of a broken nose, folks." Big laugh.',mascot:'You do the goat dance. Somebody\'s grandfather films it.',hype:'"ARE YOU READY?!" They are, apparently, ready.',ouija:'The planchette spells B-R-O-C-K. Senator Dunmore tips you twenty bucks.',scribe:`Cage ${i+1}: a two-paragraph account for the chapter log. You use the word "gladiatorial".`};
  toast(T[k]||`Cage ${i+1}: done. ${pick(['An alumnus nods at you.','Nobody stops the fight.','The crowd barely notices you, which is the point.'])}`,3600)}
function c2AfterLab(){const a=C2.a||{},k=v=>v?'✓':'○',R=C2ROLE[a.roleK]||C2ROLE.pouch,stats=a.roleK==='stats',roleOK=a.role>=3&&(!stats||(a.wager&&a.wager.size>=3));
  return`\n${k(a.del>=6)} Deliver champagne, towels and ice to the alumni (${Math.min(6,a.del||0)}/6)${a.hold?` · holding: ${a.hold}`:''}\n${k(roleOK)} ${c2RQ()[0]} (${Math.min(3,a.role||0)}/3${stats?` · wagers ${a.wager?a.wager.size:0}/3`:''})`}   // V160 the two rules (no walking into matches, avoid the creeps) still apply, they just aren't listed
function c2AfterDone(){const a=C2.a;if(!a)return false;return a.del>=6&&a.role>=3&&(a.roleK!=='stats'||a.wager.size>=3)}
function c2AfterTick(dt){const a=C2.a;if(!a)return;try{c2Held()}catch(e){}try{c2TableBlock()}catch(e){}
  if(C2.haze&&(C2.hzT=(C2.hzT||2)-dt)<0){C2.hzT=4.5+rnd()*3;const H=C2.haze,b=pick(H.br);if(NP.includes(b)&&b.dp<26){bubble(b,pick(['DROP AND GIVE ME TWENTY!','Chug, pledge! CHUG!','Who said you could stop?','Sing the house song. Backwards.']),2.6);setTimeout(()=>{if(NP.includes(H.p))bubble(H.p,pick(['…eighteen… nineteen…','Yes sir!','I don\'t know the words, sir!','Sir, yes sir!']),2.2)},1300)}}a.reqT-=dt;const rq=C2.alums.filter(n=>n.c2req&&NP.includes(n));
  if(a.reqT<=0&&rq.length<2&&a.del<6){a.reqT=4+rnd()*4;const c=C2.alums.filter(n=>!n.c2req&&NP.includes(n));if(c.length){const n=pick(c);n.c2req=pick(['champagne','towel','ice']);bubble(n,{champagne:'More champagne, pledge!',towel:'Towel! He\'s bleeding on my shoes!',ice:'Ice! I need ice down here!'}[n.c2req],3)}}
  const rr=C2.alums.filter(n=>n.c2role!=null&&NP.includes(n));a.rrT=(a.rrT==null?3:a.rrT)-dt;
  if(a.role<3&&!rr.length&&a.rrT<=0){a.rrT=6+rnd()*4;const c=C2.alums.filter(n=>!n.c2req&&n.c2role==null&&NP.includes(n));if(c.length){const n=pick(c);n.c2role=a.role;const q=c2RQ()[2][a.role%3];bubble(n,q[0],4);toast(n.name.replace(/"[^"]*"\s*/,'')+' wants something from the '+(S.prole||'pouch')+' pledge.',2600)}}
  c2Mk(rq.concat(rr));
  // walking into a cage during a match
  if(mode==='play'&&P.inside==='asr_bsmt'){const I=INT.asr_bsmt;for(const[cx,cz]of C2RINGS){const x=I.x0+cx,z=I.z0+cz,d=Math.hypot(P.x-x,P.z-z);if(d<6.2){a.strikes++;const k=(7.4)/Math.max(d,.1);P.x=x+(P.x-x)*k;P.z=z+(P.z-z)*k;P.vx=P.vz=0;sfx('bad');
    toast(a.strikes>=3?'You walked into the fight. Again.':`"GET OUT OF THE RING, PLEDGE!" The referee shoves you out. (${a.strikes}/3)`,2600);if(a.strikes>=3)failMission('You kept walking into the matches. Grant drags you out by your collar.');break}}}}
function c2AfterGoal(){const a=C2.a;if(!a)return null;const rq=C2.alums.filter(n=>n.c2req&&NP.includes(n));if(a.del<6&&rq.length){const n=a.hold?rq.find(n=>n.c2req===a.hold):null;if(n)return[n.x,n.z];if(!a.hold||!rq.some(n=>n.c2req===a.hold)){const o=c2TableNear(rq[0].c2req);if(o)return[o.x,o.z]}}
  {const n=C2.alums.find(n=>n.c2role!=null&&NP.includes(n));if(n)return[n.x,n.z]}if(a.roleK==='stats'&&a.wager.size<3){const n=C2.alums.find(n=>!a.wager.has(n.c2a)&&NP.includes(n));if(n)return[n.x,n.z]}return null}
function c2AfterPrompts(add){const a=C2.a;if(!a||P.inside!=='asr_bsmt')return;
  for(const n of C2.alums)if(n.c2role!=null&&NP.includes(n)){const R=c2RQ(),q=R[2][n.c2role%3];add(n.x,n.z,2.3,`${R[1]} for ${n.name.split(' ').slice(-1)[0].replace(/"/g,'')}`,()=>{if(n.c2role==null)return;n.c2role=null;a.role++;relAdd(n,3);sfx('ok');S.money+=5;
    card({title:'The After Party',sp:n.name+' · '+(n.title||'Alumnus'),text:'"'+q[0]+'"\n\n'+q[1],focus:n,ch:[['"Anything else, sir?"',()=>{bubble(n,pick(['Good pledge.','That\'s the spirit.','Now THAT\'S a pledge.','Ha! Keep it up.']),2.2)}]]})},0)}
  if(!a.hold)return;for(const n of C2.alums)if(n.c2req&&NP.includes(n))add(n.x,n.z,2.2,`Hand ${n.name.split(' ').slice(-1)[0].replace(/"/g,'')} the ${a.hold}`,()=>{if(a.hold!==n.c2req){bubble(n,`I asked for ${n.c2req==='ice'?'ICE':'a '+n.c2req}, pledge.`,2.4);sfx('bad');return}n.c2req=null;a.hold=null;a.del++;relAdd(n,2);sfx('coin');bubble(n,pick(['Good boy.','About time.','Now get out of my sightline.']),2)},0)}
function c2Creeped(n){sfx('bad');card({title:n?n.name:'Alumnus',sp:'Alumnus',alert:1,text:'A hand lands on your shoulder and stays there.\n\n"Well. Aren\'t you a strapping young pledge. Why don\'t you sit with me a while, keep an old man company…"\n\nYou mumble something about towels and get out of there as fast as you can.',ch:[['Get away',()=>{if(C2.a)C2.a.hold=null;const t=c2TableNear('towel');if(t){P.x=t.x+1;P.z=t.z+.6;P.vx=P.vz=0}}]]})}
// V159 the after party opens on a camera tour: the room, a cage fight, the alumni betting, a cornered pledge, the hazing, then Grant
function c2Smoke(I){if(1){c2FxOn(1);return}/* V175 the standing sprite haze replaces these hard puffs */for(let i=0;i<14;i++){const m=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),new THREE.MeshBasicMaterial({color:0xcfc8bc,transparent:true,opacity:.1,depthWrite:false}));m.position.set(I.x0+8+rnd()*100,2.6+rnd()*1.6,I.z0+10+rnd()*70);m.scale.setScalar(1.2+rnd()*1.6);m.userData.noMerge=1;sc.add(m);let t=0;const vx=(rnd()-.5)*.3;c5Anim(dt=>{t+=dt;m.position.x+=vx*dt;m.position.y+=dt*.08;m.material.opacity=.1*Math.min(1,t/2)*Math.max(0,1-(t-22)/4);if(t>26){sc.remove(m);m.material.dispose();return 1}})}}
function c2AfterIntro(done){$('fade').style.opacity=1;setTimeout(()=>{c2AfterOn();goIn(DUNG.id,DUNG.sx,DUNG.D-8.6);P.face=PI;yaw=0;pitch=.32;camT=4;const I=INT.asr_bsmt,X=x=>I.x0+x,Z=z=>I.z0+z;
  const sh={p:new THREE.Vector3(X(60),14,Z(88)),l:new THREE.Vector3(X(60),1,Z(45)),tp:null,tl:null,f:null},shot=(p,l,cut)=>{sh.f=null;sh.tp=new THREE.Vector3(...p);sh.tl=new THREE.Vector3(...l);if(cut){sh.p.copy(sh.tp);sh.l.copy(sh.tl)}};
  c1CineOn(dt=>{dt=Math.min(dt||.016,.05);if(sh.f)sh.f(dt);else if(sh.tp){const k=Math.min(1,dt*1.5);sh.p.lerp(sh.tp,k);sh.l.lerp(sh.tl,k)}cam.position.copy(sh.p);cam.lookAt(sh.l)});C1.act=[];c2Smoke(I);$('fade').style.opacity=0;
  const say=(n,t,d)=>{if(n&&NP.includes(n)){try{c7Bub(n,t,d)}catch(e){bubble(n,t,d)}}},A=k=>C2.alums.find(n=>n.c2a===k);
  (async()=>{try{
    // 1) the room
    let t=0;sh.f=dt=>{t+=dt;const a=-.6+t*.16;sh.p.set(X(60)+Math.sin(a)*34,12-t*.5,Z(45)+Math.cos(a)*34);sh.l.set(X(48),1.2,Z(40))};big('FIGHT NIGHT',2200);
    c1Sub('','The basement is packed. Cigar smoke hangs under the bare bulbs.');for(const C of[C2.crowdB])if(C)C.data.forEach(q=>q.amp=.12);await c1Wait(4.6);
    // 2) a cage fight
    const m0=C2.match&&C2.match[0];shot([X(21)+5.5,2.5,Z(19.5)+6.5],[X(21),1.3,Z(19.5)]);c1Sub('','In three of the cages, pledges in propeller hats are already swinging at each other…');
    if(m0){say(m0.a,'OOF!',1.4);setTimeout(()=>say(m0.b,'Is that all you got?!',1.8),900)}await c1Wait(3.4);
    // 3) the alumni betting, shouting numbers
    shot([X(60)-6,2.4,Z(34)],[X(60),1.6,Z(24)]);c1Sub('','…while men in tuxedos shout numbers.');say(A('brandt'),'FIFTY ON THE LEFT ONE!',2.4);setTimeout(()=>say(A('pell'),'Two to one! Who\'s taking two to one?',2.6),800);setTimeout(()=>say(A('ostrander'),'HIT HIM! I HAVE MONEY ON YOU!',2.4),1700);await c1Wait(3.8);
    // 4) a pledge cornered by an alumnus
    const cr=C2.creeps&&C2.creeps[0];if(cr){const[c,v]=cr;shot([c.x+3.4,2,c.z+3],[(c.x+v.x)/2,1.4,(c.z+v.z)/2]);c1Sub('','In the corners, the alumni have found pledges of their own.');say(c,'Sit with me a while, son. Keep an old man company…',3);setTimeout(()=>say(v,'I… should really get back to work, sir.',2.4),1600);await c1Wait(3.8)}
    // 5) brothers hazing a pledge
    const H=C2.haze;if(H){shot([H.p.x+3.6,2.2,H.p.z+3.2],[H.p.x,1.1,H.p.z]);c1Sub('','And the brothers are having fun too.');say(H.br[0],'DROP AND GIVE ME TWENTY, PLEDGE!',2.6);setTimeout(()=>say(H.p,'…one… two… three…',2.2),1300);setTimeout(()=>say(H.br[1],'Count LOUDER!',1.8),2600);await c1Wait(3.8)}
    c1Sub(null);
    // 6) Grant, with towels
    const gx=X(DUNG.sx)+1.3,gz=Z(DUNG.D-9.6);let g=null;try{g=c4Dup('grant',gx,gz,Math.atan2(P.x-gx,P.z-gz),{tag:'c2gr',pup:1,int:'asr_bsmt'})}catch(e){}shot([P.x+2.6,1.9,P.z+2.8],[(P.x+gx)/2,1.45,(P.z+gz)/2]);await c1Wait(1.2);
    if(g){await c1Line(g,'Supplies to the alumni. Do your pledge job. Don\'t get in the way of a fight, and don\'t get… cornered.','"Cornered?"');await c1Line(g,'Get to work, Kowalski.')}
  }catch(e){console.warn('c2AfterIntro',e)}c1Sub(null);try{c4Off('c2gr')}catch(e){}c1CineOff();done()})()},450)}

// V169 cage fighters: shirtless, in fight shorts. Shirt and sleeves take the skin colour, the trousers become shorts, and a skin-coloured shin
// (knee to ankle, plus the bottom of the thigh) covers each lower leg so the shorts end above the knee.
const C2SHORTS=[0x7d1f2c,0x1f2a5a,0x1e1e22,0x2e5a36,0x5a3a6a];
// V170 swap the body to a shirtless build (no collar, hem, pocket or sleeves) and hide chest letters/pins
function c2BareGeo(g,on){const P_=g&&g.P;if(!P_||!P_.torso||!P_._o)return;const ms=[[P_.torso,0],[P_.lo,1]];
  if(on&&!g.userData.c2geo){const o=Object.assign({},P_._o,{cl2:'bare',letters:0,pin:0},g===PM&&P_.geoHat&&P_.torso.geometry===P_.geoHat?{prop:1}:{});/* V182 Danny keeps his propeller hat */g.userData.c2geo=[];
    for(const[m,l]of ms){if(!m)continue;const ng=buildBody(o,l),og=m.geometry;g.userData.c2geo.push([m,og]);m.geometry=ng;for(const c of m.children)if(c.userData&&c.userData.outline){g.userData.c2geo.push([c,c.geometry]);c.geometry=ng}}
    g.userData.c2hid=[];for(const b of[P_.chest,P_.spine,P_.hips])if(b)for(const c of b.children)if(c.isMesh&&c.visible){c.visible=false;g.userData.c2hid.push(c)}}
  else if(!on&&g.userData.c2geo){for(const[m,og]of g.userData.c2geo)m.geometry=og;g.userData.c2geo=null;for(const c of g.userData.c2hid||[])c.visible=true;g.userData.c2hid=null}}
function c2Fighter(g,on){if(!g)return;const mats=[];g.traverse(o=>{const m=o.material;if(m&&m.userData&&m.userData.pal&&!mats.includes(m))mats.push(m)});const SL=[PS.shirt,PS.sleeve,PS.pants];
  if(g.userData.c2fl){for(const m of g.userData.c2fl)m.parent&&m.parent.remove(m);g.userData.c2fl=null}
  let sk=null;for(const m of mats){const p=m.userData.pal;if(on){if(!m.userData.c2fo)m.userData.c2fo=SL.map(i=>p[i].clone());sk=p[PS.skin].clone();p[PS.shirt].copy(sk);p[PS.sleeve].copy(sk);const q=chrGrade(C2SHORTS[(g.id||0)%C2SHORTS.length],1,1);p[PS.pants].set(q.r,q.g,q.b,p[PS.pants].w)}
    else if(m.userData.c2fo){SL.forEach((i,k)=>p[i].copy(m.userData.c2fo[k]));m.userData.c2fo=null}}
  c2BareGeo(g,on);g.userData.c2fight=on?1:0;const P_=g.P;if(!on||!P_||!P_.kL||!sk||g.userData.c2geo)return;const skin=new THREE.MeshStandardMaterial({color:new THREE.Color(sk.x*.8,sk.y*.74,sk.z*.68),roughness:.8,envMapIntensity:.5});g.userData.c2fl=[];
  for(const[k,l]of[[P_.kL,P_.lL],[P_.kR,P_.lR]]){const sh=new THREE.Mesh(GC.c2shin||(GC.c2shin=new THREE.CylinderGeometry(.088,.078,.34,12)),skin);sh.position.y=-.19;sh.userData.noMerge=1;k.add(sh);g.userData.c2fl.push(sh);
    if(l){const th=new THREE.Mesh(GC.c2thigh||(GC.c2thigh=new THREE.CylinderGeometry(.095,.09,.1,12)),skin);th.position.y=-.36;th.userData.noMerge=1;l.add(th);g.userData.c2fl.push(th)}}}
// ================================================================ e) KING OF THE HILL
const C2BR=[[['felix',2],['hunter',2],['kofi',3]],[['theo',4],['nate',4],['miles',5]],[['andre',6],['brock',7]]];
function c2KothIntro(done){c2AfterOn();if(P.inside!==DUNG.id)goIn(DUNG.id,C2KOTH[0],C2KOTH[1]+2);const I=INT.asr_bsmt;   // V167 a chapter skip lands outside the basement: enter it, or the room isn't drawn and Danny's punches can't reach anyone
  c1CineOn(()=>{cam.position.set(I.x0+C2KOTH[0]+7,4.2,I.z0+C2KOTH[1]+9);cam.lookAt(I.x0+C2KOTH[0],1,I.z0+C2KOTH[1])});C1.act=[];S.c2kothSeen=1;
  P.x=I.x0+C2KOTH[0];P.z=I.z0+C2KOTH[1]+2;P.face=PI;const g=spawn('brothers','asr_bsmt',{house:'asr',x:I.x0+C2KOTH[0]+3,z:I.z0+C2KOTH[1]+8.6,a:PI,temp:1,mode:'idle',name:'Grant Ashby',title:'Chapter president',lvl:10,shirt:0x7d1f2c,sleeve:0x7d1f2c,pants:0xcbb98f,hair:0xc9a46a,skin:0xf1c9a5,fem:0});g.actor=1;C1.act.push(g);
  (async()=>{await c1Wait(1.2);sfx('whistle');
    await c1Line(g,'GENTLEMEN! The main event! King of the Hill!');
    await c1Line(g,'Every pledge who wants his letters steps into that cage. Three rounds. Last pledge standing takes the hill, and our generous alumni take their winnings.');
    await c1Line(g,'Kowalski. You\'re first in. Don\'t embarrass me in front of Mr. Pell.','"Wait, what—"');
    despawn(g);c1CineOff();done()})()}
function c2KothStart(){c2AfterOn();for(const m of C2.match||[])for(const n of[m.a,m.b])NP.includes(n)&&despawn(n);C2.match=[];for(const[c,v]of C2.creeps||[])for(const n of[c,v])NP.includes(n)&&despawn(n);C2.creeps=[];
  if(P.inside!==DUNG.id)goIn(DUNG.id,C2KOTH[0],C2KOTH[1]+2);c2Suit(0);c2Fighter(PM,1);const I=INT.asr_bsmt;P.x=I.x0+C2KOTH[0];P.z=I.z0+C2KOTH[1]+2;P.vx=P.vz=0;S.hp=S.mhp;C2.k={r:0,q:C2BR.map(r=>r.slice()),cur:[],down:0,brk:0};c2KothRound()}
function c2KothRound(){const k=C2.k;big('ROUND '+(k.r+1),1600);sfx('whistle');k.brk=0;if(k.r===2){for(const e of k.q[2])c2KothFoe(e)}else c2KothFoe(k.q[k.r].shift())}
function c2KothFoe([id,lv]){const I=INT.asr_bsmt,a=rnd()*TAU,x=I.x0+C2KOTH[0]+Math.cos(a)*4.4,z=I.z0+C2KOTH[1]+Math.sin(a)*4.4,src=NN[id];
  const n=spawn('brothers','asr_bsmt',{house:'asr',noLetters:1,prop:1,fem:0,x,z,temp:1,mode:'wander',lvl:lv,name:src?src.name:'Pledge',title:'Pledge · '+(k=>k===2?'Final round':'Challenger')(C2.k.r),skin:src&&src.g?undefined:undefined});
  n.foe=1;n.aggro=1;n.tgt='P';n.c2foe=1;c2Fighter(n.g,1);if(AM)AM.temps.push(n);C2.k.cur.push(n);bubble(n,pick(['You\'re going DOWN, Kowalski!','Sorry, Danny. I\'ve got money riding on me!','Nothing personal!','The hill is MINE!']),2.4);return n}
function c2KothTick(dt){const k=C2.k;if(!k)return;
  for(const n of k.cur){if(n.down>0&&!n.c2out){n.c2out=TT+2.5;k.down++;sfx('coin');bubble(n,pick(['Ugh…','I yield!','Tell my mom…']),2)}if(n.c2out&&TT>n.c2out){despawn(n);if(AM)AM.temps=AM.temps.filter(m=>m!==n)}}
  k.cur=k.cur.filter(n=>NP.includes(n));const up=k.cur.filter(n=>!n.down).length;
  if(!up&&!k.brk){if(k.r<2&&k.q[k.r].length){c2KothFoe(k.q[k.r].shift())}else if(k.r<2){k.brk=TT+3;S.hp=Math.min(S.mhp,S.hp+S.mhp*.45);toast(`Round ${k.r+1} survived. Somebody throws you a towel. (Health restored a bit.)`,2600)}else k.won=1}
  if(k.brk&&TT>k.brk){k.r++;c2KothRound()}
  const left=k.r<2?k.q[k.r].length+up:up;c1Hud(k.won?null:`KING OF THE HILL · ROUND ${k.r+1}/3 · ${left} LEFT`)}
function c2KothWin(done){c1Hud(null);const I=INT.asr_bsmt;c1CineOn(dt=>{const a=TT*.2;cam.position.set(P.x+Math.sin(a)*5,2.8,P.z+Math.cos(a)*5);cam.lookAt(P.x,1.4,P.z)});C1.act=[];
  const pell=C2.alums.find(n=>n.c2a==='pell');sfx('lvl');big('LAST PLEDGE STANDING',2400);
  (async()=>{await c1Wait(2.6);if(pell&&NP.includes(pell)){pell.x=P.x+2.2;pell.z=P.z+2;pell.hx=pell.x;pell.hz=pell.z;pell.g.position.set(pell.x,0,pell.z);C1.act.push(pell);
      {const b=S.c2bet||25;await c1Line(pell,b>=150?'Big Ed\'s boy. Well, well. '+b+' thousand on you at five to one. I just made a great deal of money on you, son.':b>=75?'Big Ed\'s boy. Well, well. '+b+' thousand on the right horse, and the right horse was you. Five to one, son.':'Big Ed\'s boy. Well, well. Twenty-five thousand on whoever was still standing, and that\'s you. Five to one, son.')}await c1Line(pell,'Consider Alpha Sigma Rho… funded. Half of it goes to the house, as promised. And consider yourself noticed.','"…Thank you, sir?"')}
    c1CineOff();done()})()}
function c2End(done){$('fade').style.opacity=1;setTimeout(()=>{c2Fighter(PM,0);c2AfterOff();c2GalaOff();c2Suit(0);S.gt=10;S.day++;newDay();goIn('asr',10.6,27);P.face=0;yaw=PI;$('fade').style.opacity=0;
  card({title:'The Morning After',sp:'',alert:1,text:'You wake up on the couch with your tux in a heap on the floor and one shoe missing. Your hands ache. Your phone has forty texts from numbers you don\'t know, all saying some version of "Congrats, champ."\n\nThe propeller hat is still on your head. Somebody taped a hundred-dollar bill to it.',ch:[['Peel it off',()=>{money(100);sfx('coin');done()}]]})},500)}

// ================================================================ hooks (called from chapter 1's c1Tick / c1Talk / c1Light / c1Migrate and nearest())
function c2Prompts(add){try{gigPrompts(add)}catch(e){}if(!AM)return;const id=AM.m.id;if(id==='c2prep')c2PrepPrompts(add);else if(id==='c2room')c2RoomPrompts(add);else if(id==='c2after')c2AfterPrompts(add)}
function c2Tick(dt){try{c2Dress()}catch(e){}if(!AM){if(mode==='play'&&S.ch===2&&S.done.c2after&&!S.done.c2koth&&P.inside==='asr_bsmt'){const m=M.find(m=>m.id==='c2koth');if(m)startMission(m)}if(C2.mk.length)c2Mk([]);return}
  const id=AM.m.id;if(id==='c2room')c2RoomTick(dt);else if(id==='c2after')c2AfterTick(dt);else if(C2.mk.length&&id!=='c2room')c2Mk([]);
  if(C2.gala&&P.inside==='asr'&&C2.crowd)c1CrowdUpd(C2.crowd,TT*.4);if(C2.after&&P.inside==='asr_bsmt'&&C2.crowdB){c2CrowdTick(C2.crowdB,dt);
    for(const m of C2.match||[]){const p=TT*5+m.ph,s=Math.sin(p);for(const[n,sg]of[[m.a,-1],[m.b,1]]){if(!NP.includes(n)||!n.g.P)continue;n.x=m.cx+sg*(1.05+.25*Math.max(0,sg*s));n.z=m.cz;n.hx=n.x;n.hz=n.z;n.a=sg<0?PI/2:-PI/2;n.g.position.set(n.x,0,n.z);n.g.rotation.set(0,n.a,0);const P_=n.g.P;if(P_.aR){P_.aR.rotation.x=-1.4*Math.max(0,Math.sin(p+(sg>0?PI:0)));P_.aL.rotation.x=-.9}}
      if(Math.sin(p)>.98&&rnd()<.3&&Math.hypot(P.x-m.cx,P.z-m.cz)<22)tone(90,.08,'square',.04)}
    C2.roarT=(C2.roarT||0)-dt;if(C2.roarT<=0){C2.roarT=1.2+rnd()*2;noise(.6+rnd()*.5,.016,700+rnd()*500)}}else if(C2.fx&&C2.fx.g.visible)C2.fx.g.visible=false;
  if(id==='c2koth')c2KothTick(dt);
  if(C2.gala&&P.inside==='asr'&&!C2.after&&mode!=='mg'){C2.muT=(C2.muT||0)-dt;if(C2.muT<=0){C2.muT=.62;C2.mi=(C2.mi||0)+1;const ch=[[262,330,392],[220,262,330],[175,220,262],[196,247,294]][Math.floor(C2.mi/4)%4];tone(ch[C2.mi%3],.5,'triangle',.018);if(C2.mi%4===0)tone(ch[0]/2,.9,'sine',.02)}}}
function c2Talk(n,ch,reply){if(!AM)return;const id=AM.m.id,k=n.c2a,d=k&&C2AL[k];if(!d)return;
  if(id==='c2room'){const r=C2.r;
    if(!r.met.has(k))ch.push(['"Good evening, sir. Danny Kowalski, ΑΣΡ pledge."',()=>{r.met.add(k);relAdd(n,6);if(d[3])n.c2trap=1;reply(d[4])()},'','task']);
    else if(n.c2trap&&!n.c2trapDone){ch.push(['"The brothers planned every detail, sir. We just carried chairs."',()=>{n.c2trapDone=1;relAdd(n,3);reply('"Ha! Good answer. Grant\'s got you trained already."')()},'','task']);
      ch.push(['"Honestly? The pledges did everything. The brothers just watched."',()=>{n.c2trapDone=1;r.slips++;stand(-5);toast(r.slips>=2?'Grant heard that.':'Across the room, Grant\'s eyes narrow. (1 slip)',2600);if(r.slips>=2){setTimeout(()=>failMission('You told the alumni the pledges did all the work. Twice. Grant pulls you into the hallway, smiling for the guests the whole time.'),400);return}reply('"Is that so." He looks across the room at Grant for a long, cold second.')()},'','task'])}
    if(r.met.has(k)&&!r.learn.has(k))ch.push(['"What keeps you busy these days, sir?"',()=>{r.learn.add(k);reply(d[5])();if(r.learn.size===4)setTimeout(()=>toast('Most likely to donate tonight: Augustus Pell, Senator Dunmore and Gil Ostrander. Pell is the big fish.',6000),600)},'','task'])}
  if(id==='c2pitch'&&C2.why&&!C2.why.n.has(k)&&AM.steps[AM.i]&&AM.steps[AM.i].why)ch.push(['"Why does everybody keep sizing me up, sir?"',()=>{C2.why.n.add(k);reply(d[6])()},'','task']);
  if(id==='c2after'&&C2.a&&C2.a.roleK==='stats'&&!C2.a.wager.has(k))ch.push(['"Putting money on a fight tonight, sir?"',()=>{C2.a.wager.add(k);reply(pick(['"Five hundred on the big kid with the fists like hams. Write it down."','"A thousand on whoever bleeds less."','"Put me down for two hundred on Kowalski. Don\'t look so surprised."']))();sfx('coin')},'','task'])}
function c2Light(){if(!P.inside)return false;if(C2.gala&&!C2.after&&(P.inside==='asr'||P.inside==='asr_up')){hemi.intensity=.72;hemi.color.setHex(0xffe2b0);hemi.groundColor.setHex(0x3a2418);sun.intensity=.32;sun.color.setHex(0xffd8a0);sc.fog.color.setHex(0x1a120c);sc.fog.near=18;sc.fog.far=80;return true}
  if(C2.after&&P.inside==='asr_bsmt'){hemi.intensity=.44;hemi.color.setHex(0xe8c898);hemi.groundColor.setHex(0x1a1410);sun.intensity=.14;sun.color.setHex(0xffd8a0);sc.fog.color.setHex(0x0e0a08);sc.fog.near=12;sc.fog.far=78;return true}return false}
function c2Migrate(d){if(!d)return;try{c3Migrate(d)}catch(e){console.warn('c3Migrate',e)}try{c4Migrate(d)}catch(e){console.warn('c4Migrate',e)}try{c5Migrate(d)}catch(e){console.warn('c5Migrate',e)}try{c6Migrate(d)}catch(e){console.warn('c6Migrate',e)}try{c7Migrate(d)}catch(e){console.warn('c7Migrate',e)}try{c8Migrate(d)}catch(e){console.warn('c8Migrate',e)}try{c9Migrate(d)}catch(e){console.warn('c9Migrate',e)}try{c10Migrate(d)}catch(e){console.warn('c10Migrate',e)}if(S.ch>=3)for(const id of C2IDS)S.done[id]=1;if(S.c2suit&&S.ch===2&&!S.done.c2koth)setTimeout(()=>c2Suit(1),0)}

// ================================================================ the chapter's quests
const C2M=[
 {id:'c2prep',ch:2,main:1,name:'Pledge Labor',who:'grant',steps:()=>[
   C_('Pledge Labor','Grant Ashby · Chapter president','"You heard the speech. Here\'s the actual work."\n\n"One: nobody serves my alumni in a hoodie. Get a tux. Your own money. Two: make my house look like a ballroom. Three: champagne from Hank\'s, catering from Ruby\'s. Both go on the house account, so don\'t make me regret it. Four…" He looks around the living room. "…hide everything the alumni shouldn\'t see."',[['"On it."',null]]),
   {t:'cond',lab:c2PrepLab,ok:c2PrepDone,goal:c2PrepGoal,start:()=>c2PrepStart()},
   go(npcSpot('grant'),'Tell Grant the house is ready. He\'s on his throne in the throne room',{press:1,act:'Tell Grant the house is ready',r:4.6}),   // V125 he says his line face to face, not wherever the last chore was
   C_('Pledge Labor','Grant Ashby · Chapter president','Grant walks the house slowly. He straightens one tablecloth, nods at the champagne tower, and almost smiles.\n\n"It\'ll do. Gala starts at eight. Be in that tux and be invisible."',[['"Yes, sir."',()=>stand(3)]])],
  fin:()=>{toast('Talk to Grant when you\'re ready for the gala to start.',4500)}},
 {id:'c2room',ch:2,main:1,pre:['c2prep'],name:'Working the Room',who:'grant',steps:()=>[
   {t:'cine',run:c2GalaIntro},
   {t:'cond',lab:c2RoomLab,ok:c2RoomDone,goal:c2RoomGoal,start:()=>c2RoomStart()}],
  fin:()=>{C2.r.keep=1;c2Mk([]);take('c2tray');c1Next('c2pitch',900)},reset:()=>{c2GalaOff();take('c2tray');C2.r=null}},
 {id:'c2pitch',ch:2,main:1,pre:['c2room'],name:'The Donation Pitch',who:'grant',retry:'Grant is back on the throne, rubbing his temples. Pell only made it as far as the porch before the brothers talked him back inside. Talk to Grant to try the pitch again, and this time, help.',steps:()=>[
   {t:'cine',run:c2PellScene},
   C_('Impress the Donor','Grant Ashby · Chapter president','Grant waves you over to the throne room, where Augustus Pell is inspecting the throne like he\'s thinking of buying it back.\n\n"Mr. Pell, this is Kowalski. One of our most promising pledges." Under his breath: "Say something impressive."',null,{ch:null}),
   {t:'cine',run:d=>card({title:'Impress the Donor',sp:'Augustus Pell · Class of \'71',text:'"Well, pledge? Impress me."',focus:C2.alums.find(n=>n.c2a==='pell'),ch:c2ImpressChoices().map(([l,f])=>[l,()=>{const ins=f();AM.steps.splice(AM.i+1,0,...ins);d()}])})},
   ...c2PitchSteps(),
   {t:'cond',why:1,lab:c2WhyLab,ok:()=>C2.why&&(C2.why.n.size+(C2.why.ear?1:0))>=3,goal:()=>{if(C2.why&&!C2.why.ear&&C2.earO)return[C2.earO.x,C2.earO.z];const n=C2.alums.find(n=>NP.includes(n)&&!(C2.why&&C2.why.n.has(n.c2a)));return n?[n.x,n.z]:null},start:()=>{c2Ensure();c2WhyStart()}},
   {t:'cine',run:c2Reveal}],
  fin:()=>{if(C2.earO){c2ObjDel(C2.earO);C2.earO=null}c1Next('c2after',900)},reset:()=>{c2GalaOff()}},
 {id:'c2after',ch:2,main:1,pre:['c2pitch'],name:'The After Party',who:'grant',retry:'Grant is waiting by the basement door. The fights are still going.',steps:()=>[
   {t:'cine',run:d=>{c2Ensure();d()}},
   go(c2B(1.4,16),'Follow the alumni and brothers down into the basement.',{press:1,act:'Follow them downstairs',done:()=>{}}),
   {t:'cine',run:c2AfterIntro},
   {t:'cond',stealth:1,watch:['oldguard'],spot:'back',back:n=>c2Creeped(n),lab:c2AfterLab,ok:c2AfterDone,goal:c2AfterGoal,start:()=>c2DownStart()}],
  fin:()=>{c2Mk([]);if(C2.a)C2.a.hold=null;try{c2Held()}catch(e){}c1Next('c2koth',600)},reset:()=>{c2AfterOff();C2.after=0;C2.a=null}},
 {id:'c2koth',ch:2,main:1,pre:['c2after'],name:'King of the Hill',retry:'Somebody drags you upstairs to sleep it off. The tournament is still going in the basement: go back down when you\'re ready.',hint:'King of the Hill: the tournament is waiting in the basement',at:()=>c2B(1.4,16),   // V180 the marker leads back to the basement door; going down puts Danny straight into the ring
  steps:()=>[
   ...(S.c2kothSeen?[]:[{t:'cine',run:c2KothIntro}]),
   {t:'cond',lab:()=>{const k=C2.k;return k?`Survive each round and become the last pledge standing. Round ${k.r+1}/3.`:'Become the last pledge standing.'},start:()=>c2KothStart(),ok:()=>C2.k&&C2.k.won},
   {t:'cine',run:c2KothWin},
   {t:'cine',run:c2End}],
  fin:()=>{C2.k=null},reset:()=>{c1Hud(null);c2Fighter(PM,0);if(C2.k)for(const n of C2.k.cur)NP.includes(n)&&despawn(n);C2.k=null}}];
{const i=M.findIndex(m=>m.ch>=2&&!m.side);M.splice(i<0?M.length:i,0,...C2M)}   // gala first, then the Big Brother quests

// ================================================================ V162 CHAPTER 2 INTRO CUTSCENE: the whole pledge class stands in the throne room while Grant gives the speech from the throne
const C2G=[
 ['Rush is over. Now you earn it.',3.2],
 ['Saturday night, this house hosts the Alumni Gala: every rich old man who ever wore these letters, in one room, with his checkbook.',6.4],
 ['If they write checks, we keep the lights on. If they don\'t, the Dean gets her wish.',5.2],
 ['Pledges do the work. Brothers take the credit. That\'s how it\'s always been.',4.8]];
CHSCENE[2]=async function(){
  const g=NN.grant,I=INT.asr;if(!g||!I){chapterIntro2Plain();return}
  const W=(x,z)=>[I.x0+x,I.z0+z],fade=$('fade'),sl=ms=>new Promise(r=>setTimeout(r,ms));
  fade.style.opacity=1;await sl(500);
  endScene();C1.act=[];c1CineOn();
  if(P.inside!=='asr')goIn('asr');
  // everyone who is in the pledge class, in three rows facing the throne; Danny stands in the middle row
  const defs=NAMED.filter(d=>d.pclass),xs=[17.1,19.4,21.7,24,26.3,28.6,30.9],spots=[];
  [6.8,8.8,10.8].forEach((z,ri)=>xs.forEach(x=>{if(ri===0&&x===24)return;spots.push([x+(rnd()-.5)*.3,z+(rnd()-.5)*.25])}));
  defs.slice(0,spots.length).forEach((d,i)=>{const[x,z]=W(...spots[i]);const n=c1Actor('brothers',x,z,PI+(rnd()-.5)*.25,{zone:'asr',name:d.name,title:d.title,lvl:d.lvl,shirt:d.shirt,sleeve:d.sleeve,pants:d.pants,hair:d.hair,skin:d.skin,fem:d.fem||false,scale:d.scale,pin:d.pin,prop:d.prop,house:d.house,noLetters:d.noLetters,named:1});n.noTalk=1});
  const[px,pz]=W(24,6.8);P.x=px;P.z=pz;P.y=terrH(px,pz);P.jy=0;P.vx=P.vz=0;P.face=PI;PM.visible=true;PM.position.set(P.x,P.y,P.z);PM.rotation.set(0,P.face,0);
  const shot={k:0};const shots=[
    [[24,3.1,13.3],[24,1.9,3.3],0],      // wide from the back of the room: backs of the pledges, Grant on the throne
    [[22.85,2.4,8.7],[24,1.85,2.3],1],    // Grant close-up, a little low so he looms
    [[26.6,2.1,3.3],[23.6,1.4,9.2],2]];  // over his shoulder at the class
  let cur=shots[0],lk=cur[0].slice(),ll=cur[1].slice();
  CINE.camf=(dt)=>{const A=shots[shot.k],k=1-Math.pow(.0009,dt);for(let i=0;i<3;i++){lk[i]+=(A[0][i]-lk[i])*k;ll[i]+=(A[1][i]-ll[i])*k}cam.position.set(I.x0+lk[0],lk[1],I.z0+lk[2]);cam.lookAt(I.x0+ll[0],ll[1],I.z0+ll[2])};
  cam.position.set(I.x0+lk[0],lk[1],I.z0+lk[2]);cam.lookAt(I.x0+ll[0],ll[1],I.z0+ll[2]);
  $('cineskip').hidden=false;fade.style.opacity=0;big('CHAPTER 2',2400);
  const wt=async s=>{if(CINE&&!CINE.skipped)await c1Wait(s)};
  await wt(2.6);
  c1Sub(null);shot.k=0;await wt(1.2);
  // the speech uses the game's normal conversation box (speaker framed by the scene camera); the Skip button hides while a box is open
  CINE.hold=1;   // V117 keep the conversation camera where it is between Grant's lines (no pan back out to the wide shot on Continue)
  for(const[t]of C2G){if(CINE.skipped)break;$('cineskip').hidden=true;await c1Line(g,t);$('cineskip').hidden=false;await wt(.25)}
  if(CINE)CINE.hold=0;
  fade.style.opacity=1;await sl(450);
  for(const n of C1.act)if(NP.includes(n))despawn(n);
  c1CineOff();P.x=I.x0+24;P.z=I.z0+8.2;P.y=terrH(P.x,P.z);P.face=PI;yaw=0;camT=3;PM.position.set(P.x,P.y,P.z);
  fade.style.opacity=0;
  toast('Chapter 2: The Alumni Gala. Your Big Brother quests are open too: talk to Tank, Reese or Owen on the porch if you haven\'t picked one yet.',6200);
  saveGame()};
function chapterIntro2Plain(){card({title:'Chapter 2: '+CHN[2],sp:'',text:CHT[2]})}
