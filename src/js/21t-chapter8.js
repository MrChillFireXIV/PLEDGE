// ================================================================ V161 CHAPTER 8 · INTO THE HAZE ROOM (the Lantern Walk finale moves to chapter 9)
// Danny is taken from his bunk in a red Santa sack by three masked men (the Goat, the Sheep, the Pig) and wakes up tied to a chair in the
// Haze Room, a hidden basement under the old Kappa house, beside three associates (Luke Harmon, Ezra Cole, Marcus Bell). The night turns from
// hazing into abuse: Luke dies of alcohol poisoning, the Washout, solitary rooms, a dog. The masks come off: the Goat is Carter Vaughn
// (Pledge Master), the Sheep is Andre Wallace (pledge captain), the Pig is Logan Pierce (Vice President). Andre dies in the fight that follows,
// and Grant finds the survivors and brokers a silence nobody can break.
//  c8invite  The Invitation Nobody Accepted   c8rules  The House Rules         c8drink  Drink Until the Clock Stops
//  c8wash    The Washout                      c8dark   Alone in the Dark       c8dog    The Dog's Last Test
//  c8masks   The Masks Come Off               c8nomore No More Games           c8deal   The Unspoken Agreement
// This file: renumbering, the Haze Room interior, masks, the dog, effects, special steps, hooks. Part 2 (21u): scenes and quests.
// All dialogue uses the game's conversation box (c1Line / c8Dan); narration is a subtitle.
const C8={T:0,lock:null,dog:null,hands:[],flick:null,cb:null,hose:null,drunk:0,cold:0,fight:null,prot:null,shiver:0};
const C8IDS=['c8invite','c8rules','c8drink','c8wash','c8dark','c8dog','c8masks','c8nomore','c8deal'];
const c8S=()=>S.c8||(S.c8={});

// ---------------------------------------------------------------- the Lantern Walk becomes chapter 9
for(const m of M)if(m.ch===8)m.ch=9;
CHN[8]='Into the Haze Room';CHN[9]='The Lantern Walk';CHN[10]='Epilogue';
CHT[9]=CHT[8];
CHT[8]='A criminal uprising, a coalition, a wizard. Danny Kowalski just wants one night of sleep.\n\nSomeone in Alpha Sigma Rho has other plans.';
XPM[9]=XPM[8];XPM[8]=160;

// ---------------------------------------------------------------- the Haze Room (interior c8haze, a fixed slot next to the Nexus)
// main room x 0-26 z 0-22 · Washout Station x 26-44 z 0-14 · storage x 26-44 z 14-22 · hallway z 22-26 · isolation rooms z 26-36:
// Marcus (clock) x 0-14 · Ezra (flicker) x 14-26 · Danny (chalkboard) x 26-44
const C8HZ={W:44,D:36,at:[600,1580]};
const c8P=(x,z)=>{const I=INT.c8haze;return{int:'c8haze',x:I.x0+x,z:I.z0+z}};
const c8X=(x,z)=>{const I=INT.c8haze;return[I.x0+x,I.z0+z]};
const C8CHAIRS=[[8.2,12],[10.8,12],[13.4,12],[16,12]];   // Luke, Danny, Ezra, Marcus
const C8ROOM={marcus:[0.6,26.6,13.4,35.4],ezra:[14.6,26.6,25.4,35.4],danny:[26.6,26.6,43.4,35.4]};
function c8BuildHaze(){const{W,D}=C8HZ;let sd=37;const R_=()=>(sd=sd*16807%2147483647)/2147483647;
  const I=mkInt('c8haze',W,D,{at:C8HZ.at,up:1,hole:[0,0,W,D],name:'The Haze Room',wall:0x6e6a60,low:0x2a2622,ceil:0x4a4640,
    walls:[[26,0,26,5],[26,8,26,22],[26,14,32,14],[35,14,44,14],[0,22,12,22],[15,22,44,22],[0,26,7,26],[9,26,19,26],[21,26,31,26],[33,26,44,26],[14,26,14,36],[26,26,26,36]]});
  const X=x=>I.x0+x,Z=z=>I.z0+z,add=m=>{m.userData.noMerge=1;sc.add(m);return m},B_=(x,y,z,w,h,d,c,col)=>{const m=add(new THREE.Mesh(bgeo(w,h,d),typeof c==='number'?mt(c,.85):c));m.position.set(X(x),y,Z(z));m.castShadow=true;m.receiveShadow=true;if(col)markR(X(x-w/2),Z(z-d/2),X(x+w/2),Z(z+d/2),h);return m};
  // a stained concrete floor with a drain in the Washout
  const ft=ctex(512,512,(q,w,h)=>{q.fillStyle='#4a4741';q.fillRect(0,0,w,h);for(let i=0;i<2600;i++){q.fillStyle=`rgba(${40+R_()*60|0},${38+R_()*55|0},${34+R_()*50|0},${.15+R_()*.25})`;q.fillRect(R_()*w,R_()*h,2+R_()*4,2+R_()*4)}for(let i=0;i<14;i++){q.fillStyle=`rgba(30,26,20,${.08+R_()*.1})`;q.beginPath();q.ellipse(R_()*w,R_()*h,20+R_()*50,12+R_()*30,R_()*3,0,TAU);q.fill()}q.strokeStyle='rgba(20,18,14,.35)';q.lineWidth=2;for(let x=0;x<w;x+=128){q.beginPath();q.moveTo(x,0);q.lineTo(x,h);q.stroke();q.beginPath();q.moveTo(0,x);q.lineTo(w,x);q.stroke()}});
  ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(5,4);const fl=add(new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:ft,roughness:.92})));fl.rotation.x=-PI/2;fl.position.set(X(W/2),.01,Z(D/2));fl.receiveShadow=true;
  {const dr=add(new THREE.Mesh(new THREE.CircleGeometry(.35,20),mt(0x1a1a1a,.4,.6)));dr.rotation.x=-PI/2;dr.position.set(X(36),.02,Z(7));for(let i=-2;i<=2;i++){const s=add(new THREE.Mesh(bgeo(.6,.01,.04),mt(0x555555,.4,.7)));s.position.set(X(36),.03,Z(7+i*.11))}const wet=add(new THREE.Mesh(new THREE.CircleGeometry(3.4,28),new THREE.MeshStandardMaterial({color:0x3a3a3c,roughness:.08,metalness:.3,transparent:true,opacity:.5})));wet.rotation.x=-PI/2;wet.position.set(X(36),.015,Z(7))}
  // the locked metal door (west wall), chained and padlocked
  B_(.3,1.35,5,.12,2.7,1.5,mt(0x5a5e62,.45,.7));B_(.38,1.35,5,.04,2.5,1.3,mt(0x4a4e52,.5,.7));for(const z of[4.6,5.4])B_(.45,1.25,z,.06,.06,.12,mt(0x9a9a9a,.3,.8));
  for(let i=0;i<7;i++){const ln=add(new THREE.Mesh(GC.c8lk||(GC.c8lk=new THREE.TorusGeometry(.05,.012,5,10)),mt(0x8a8a8a,.3,.8)));ln.position.set(X(.48),1.0+i*.07,Z(4.4+i*.18));ln.rotation.y=i%2?PI/2:0}B_(.52,1.1,5.1,.06,.16,.12,mt(0xb8962a,.3,.8));
  {const s=signMesh('NO EXIT',.9,.24,'#2a1a1a','#e2b64c');s.position.set(X(.36),2.9,Z(5));s.rotation.y=PI/2;add(s)}
  // the chalkboard (redrawn by the scenes) and the clock over it
  const cbc=document.createElement('canvas');cbc.width=1024;cbc.height=512;const cbt=new THREE.CanvasTexture(cbc);C8.cb={c:cbc,t:cbt,lines:[]};c8Chalk([]);
  B_(13,1.85,.3,6.3,2.7,.12,mt(0x4a3220,.8));{const m=add(new THREE.Mesh(new THREE.PlaneGeometry(6,2.4),new THREE.MeshStandardMaterial({map:cbt,roughness:.95})));m.position.set(X(13),1.85,Z(.38))}B_(13,.55,.42,6,.06,.2,mt(0x4a3220,.8));
  c8Clock(X(13),3.55,Z(.32),0,.55);
  // chairs, the bottle table, paddles on the east wall, bare bulbs
  for(const[x,z]of C8CHAIRS){B_(x,.46,z,.55,.06,.55,0x4a3626);B_(x,.85,z+.26,.55,.7,.06,0x4a3626);for(const sx of[-.24,.24])for(const sz of[-.24,.24])B_(x+sx,.23,z+sz,.05,.46,.05,0x3a2a1e)}
  B_(20.5,.78,7,2.6,.06,1.1,0x5a4030,1);for(const sx of[-1.2,1.2])for(const sz of[-.5,.5])B_(20.5+sx,.39,7+sz,.07,.78,.07,0x3a2a1e);
  const gl=new THREE.MeshStandardMaterial({color:0x6a4a1a,roughness:.15,metalness:.1,transparent:true,opacity:.8});for(let i=0;i<9;i++){const x=19.5+(i%5)*.45,z=6.7+Math.floor(i/5)*.5;B_(x,.97,z,.11,.32,.11,gl);B_(x,1.18,z,.05,.1,.05,gl)}for(let i=0;i<8;i++)B_(19.4+i*.3,.87,7.45,.08,.12,.08,mt(0xc8202e,.5));
  C8.paddles=[];for(let i=0;i<3;i++){const g=new THREE.Group();const p=new THREE.Mesh(bgeo(.08,.9,.24),mt(0x8a5a2a,.6));p.position.y=-.1;g.add(p);const hd=new THREE.Mesh(bgeo(.06,.35,.08),mt(0x5a3a1a,.6));hd.position.y=.5;g.add(hd);const s=signMesh(['ΑΣΡ','HAZE','KEEP'][i],.2,.08,'#7d1f2c','#e2b64c');s.position.set(-.05,-.05,0);s.rotation.y=-PI/2;g.add(s);g.position.set(X(25.8),1.6,Z(15+i*1.4));g.traverse(o=>o.userData.noMerge=1);sc.add(g);C8.paddles.push(g)}
  for(const[x,z]of[[7,6],[19,6],[13,17],[35,7],[35,18],[7,31],[20,31],[35,31]]){B_(x,5.1,z,.02,1.8,.02,0x222222);const b=add(new THREE.Mesh(GC.c8bulb||(GC.c8bulb=new THREE.SphereGeometry(.12,10,8)),bm(0xffd9a0)));b.position.set(X(x),4.15,Z(z))}
  // the Washout Station: lockers, a bench, the hose reel
  for(let i=0;i<5;i++){B_(28+i*.8,1,.45,.76,2,.6,mt(0x5a6a5a,.5,.5),1);B_(28+i*.8,1.6,.77,.4,.04,.02,mt(0x2a2a2a,.5))}B_(31,.45,11.6,3,.08,.5,0x5a4030,1);
  {const r=add(new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.25,18),mt(0x2a6a2a,.6)));r.rotation.z=PI/2;r.position.set(X(43.6),1.1,Z(7));const hb=add(new THREE.Mesh(new THREE.TorusGeometry(.42,.06,6,20),mt(0x2a8a2a,.6)));hb.rotation.y=PI/2;hb.position.set(X(43.45),1.1,Z(7))}
  {const s=signMesh('WASHOUT',2,.5,'#1a1a1a','#e2e2e2');s.position.set(X(35),3.2,Z(.2));add(s)}
  // storage: boxes and the dog crate
  for(let i=0;i<6;i++)B_(28+R_()*4,.3+(i%2)*.6,17+R_()*4,.8,.6,.6,0x8a6a42,1);
  C8.crate=new THREE.Group();{const wm=mt(0x8a8a8a,.4,.7);const pt=[];for(const[w,h,d,x,y,z]of[[1.2,.04,.8,0,.9,0],[1.2,.04,.8,0,.02,0]])pt.push([w,h,d,x,y,z]);for(let i=0;i<7;i++){pt.push([.02,.9,.02,-.6+i*.2,.45,-.4]);pt.push([.02,.9,.02,-.6+i*.2,.45,.4])}for(let i=0;i<5;i++)pt.push([.02,.9,.02,.6,.45,-.4+i*.2]);for(const[w,h,d,x,y,z]of pt){const m=new THREE.Mesh(bgeo(w,h,d),wm);m.position.set(x,y,z);C8.crate.add(m)}C8.crate.position.set(X(40),0,Z(18));C8.crate.traverse(o=>o.userData.noMerge=1);sc.add(C8.crate)}
  // the isolation rooms: a huge clock (Marcus), a flickering tube (Ezra), a chalkboard with Danny's name (Danny); a speaker in each; a vent between Ezra and Danny
  c8Clock(X(7),2.4,Z(35.7),PI,1.1);
  {const tube=add(new THREE.Mesh(bgeo(1.6,.08,.24),new THREE.MeshBasicMaterial({color:0xe8f6ff})));tube.position.set(X(20),5.9,Z(31));C8.flick=tube}
  {const dt=ctex(768,384,(q,w,h)=>{q.fillStyle='#1e2a22';q.fillRect(0,0,w,h);q.fillStyle='rgba(240,240,230,.85)';q.textAlign='center';q.font='bold 120px "Comic Sans MS",cursive';q.fillText('DANNY',w/2,170);q.font='bold 44px cursive';q.fillStyle='rgba(240,240,230,.7)';['ARROGANT','GRANT\'S FAVORITE','TOO POPULAR','HUMBLE HIM'].forEach((t,i)=>q.fillText(t,140+(i%2)*490,250+Math.floor(i/2)*70));});
    B_(35,1.85,35.7,4.6,2.3,.1,mt(0x4a3220,.8));const m=add(new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.1),new THREE.MeshStandardMaterial({map:dt,roughness:.95})));m.position.set(X(35),1.85,Z(35.62));m.rotation.y=PI}
  for(const[x,z,ry]of[[1,30,PI/2],[25,30,-PI/2],[43,30,-PI/2],[1,4,PI/2]]){const sp=add(new THREE.Mesh(bgeo(.5,.4,.12),mt(0x2a2a2a,.5)));sp.position.set(X(x),4.6,Z(z));sp.rotation.y=ry;const gr=add(new THREE.Mesh(new THREE.CircleGeometry(.16,14),mt(0x111111,.6)));gr.position.set(X(x)+Math.sin(ry)*.07,4.6,Z(z)+Math.cos(ry)*.07);gr.rotation.y=ry}
  {const v=add(new THREE.Mesh(bgeo(.08,.5,.8),mt(0x9a9a9a,.4,.7)));v.position.set(X(26.2),.45,Z(31));C8.vent=v;for(let i=0;i<5;i++){const s=add(new THREE.Mesh(bgeo(.1,.04,.7),mt(0x5a5a5a,.4,.7)));s.position.set(X(26.26),.27+i*.09,Z(31))}}
  for(const[x,name]of[[8,'MARCUS'],[20,'EZRA'],[32,'DANNY']]){B_(x,1.35,26,1.9,2.7,.12,mt(0x5a5e62,.45,.7));}   // door slabs drawn open (moved by c8Doors)
  C8.doorM=[];{const kids=sc.children;for(let i=kids.length-3;i<kids.length;i++)C8.doorM.push(kids[i])}
  ZN.c8haze=[I.x0+1,I.z0+1,I.x0+25,I.z0+21];c8Doors(0);return I}
// doors of the isolation rooms: shut = slab in the doorway, open = slid aside
function c8Doors(shut){const I=INT.c8haze;if(!I||!C8.doorM)return;C8.doorM.forEach((m,i)=>{const x=[8,20,32][i];m.position.x=I.x0+x+(shut?0:1.9)})}
function c8Clock(x,y,z,ry,s){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;const f=new THREE.Mesh(new THREE.CylinderGeometry(s,s,.08,28),mt(0xf2ece0,.6));f.rotation.x=PI/2;g.add(f);const rim=new THREE.Mesh(new THREE.TorusGeometry(s,.05*s+.02,6,28),mt(0x3a2a1a,.5));g.add(rim);
  for(let i=0;i<12;i++){const t=new THREE.Mesh(bgeo(.04*s+.01,.14*s,.02),mt(0x1a1a1a,.6));t.position.set(Math.sin(i/12*TAU)*s*.82,Math.cos(i/12*TAU)*s*.82,.05);t.rotation.z=-i/12*TAU;g.add(t)}
  const hand=(l,w,c)=>{const p=new THREE.Group();const m=new THREE.Mesh(bgeo(w,l,.02),mt(c,.6));m.position.y=l/2;p.add(m);p.position.z=.06;g.add(p);return p};const hh=hand(s*.45,.06*s+.02,0x1a1a1a),mh=hand(s*.7,.04*s+.015,0x1a1a1a),sh=hand(s*.78,.015+.01*s,0xb81a1a);hh.rotation.z=-1.2;mh.rotation.z=-2.6;
  g.traverse(o=>o.userData.noMerge=1);sc.add(g);C8.hands.push({sh,mh,run:1,big:s>.8})}
// the chalkboard: chalk text, redrawn as the rules are written (and changed)
function c8Chalk(lines,title){const C=C8.cb;if(!C)return;C.lines=lines;const q=C.c.getContext('2d'),w=1024,h=512;q.fillStyle='#22302a';q.fillRect(0,0,w,h);for(let i=0;i<60;i++){q.fillStyle='rgba(255,255,255,.03)';q.fillRect((i*389)%w,(i*211)%h,60,8)}
  q.fillStyle='rgba(240,240,230,.92)';q.textAlign='left';q.font='bold 54px "Comic Sans MS",cursive';q.fillText(title||'THE HOUSE RULES',60,72);q.font='36px "Comic Sans MS",cursive';lines.forEach((l,i)=>{q.fillStyle=l.x?'rgba(240,240,230,.5)':'rgba(240,240,230,.9)';q.fillText(l.t||l,60,140+i*58);if(l.x){q.strokeStyle='rgba(240,240,230,.85)';q.lineWidth=4;q.beginPath();q.moveTo(50,128+i*58);q.lineTo(60+q.measureText(l.t).width+10,128+i*58);q.stroke()}});C.t.needsUpdate=true}

// ---------------------------------------------------------------- people: Keepers in masks, the associates, the speaker voices
function c8Mask(n,kind){const h=n&&n.g&&n.g.P&&n.g.P.head;if(!h)return;c8Unmask(n,1);const g=new THREE.Group(),A=(geo,c,x,y,z,s,r)=>{const m=new THREE.Mesh(geo,typeof c==='number'?mt(c,.7):c);m.position.set(x,y,z);if(s)m.scale.set(...s);if(r)m.rotation.set(...r);m.userData.noMerge=1;g.add(m);return m},sp=GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8));
  if(kind==='goat'){A(sp,0xd8d2c4,0,.1,.02,[.23,.26,.24]);A(sp,0xd0c8b8,0,.02,.2,[.12,.1,.17]);A(sp,0x2a2420,0,.04,.35,[.05,.035,.03]);for(const s of[-1,1]){A(GC.c8horn||(GC.c8horn=new THREE.ConeGeometry(.05,.34,8)),0x6a5a40,s*.11,.34,-.02,null,[-.5,0,s*.35]);A(sp,0xc8c0b0,s*.23,.12,0,[.09,.04,.06]);A(sp,0xe8c020,s*.09,.14,.21,[.035,.03,.02]);A(sp,0x111111,s*.09,.14,.225,[.012,.025,.01])}A(GC.c8beard||(GC.c8beard=new THREE.ConeGeometry(.06,.22,8)),0xd8d2c4,0,-.2,.2,null,[PI,0,0])}
  if(kind==='sheep'){for(let i=0;i<14;i++){const a=i/14*TAU,b=i%2?.35:.1;A(sp,0xf4f2ea,Math.sin(a)*.2,.14+Math.cos(a*2)*.05+b*.2,Math.cos(a)*.17-.04,[.11,.1,.11])}A(sp,0x2a2622,0,.04,.16,[.15,.17,.12]);for(const s of[-1,1]){A(sp,0x2a2622,s*.22,.08,.06,[.09,.04,.06]);A(sp,0xf2ece0,s*.06,.1,.27,[.03,.03,.015]);A(sp,0x111111,s*.06,.1,.282,[.013,.013,.01])}}
  if(kind==='pig'){A(sp,0xf0a8a8,0,.08,.04,[.24,.25,.24]);A(new THREE.CylinderGeometry(.08,.09,.09,16),0xe8909a,0,.03,.27,null,[PI/2,0,0]);for(const s of[-1,1]){A(sp,0x5a2a2a,s*.03,.03,.318,[.015,.022,.01]);A(GC.c8ear||(GC.c8ear=new THREE.ConeGeometry(.08,.14,4)),0xe8909a,s*.15,.33,0,null,[0,0,-s*.5]);A(sp,0x111111,s*.08,.15,.25,[.022,.022,.012])}}
  h.add(g);n.c8mask=g;n.c8kind=kind}
function c8Unmask(n,quiet){if(!n||!n.c8mask)return;n.c8mask.parent&&n.c8mask.parent.remove(n.c8mask);n.c8mask=null;if(!quiet){try{c6Poof(n.x,1.7,n.z,0xdcd4c8)}catch(e){}}}
const C8K={goat:['Carter Vaughn','ΑΣΡ Pledge Master'],sheep:['Andre Wallace','ΑΣΡ Pledge Captain'],pig:['Logan Pierce','ΑΣΡ Vice President']};
function c8Keeper(kind,x,z,a,o={}){const[x_,z_]=c8X(x,z),masked=o.masked!==false;let n;const nm=masked?{goat:'The Goat',sheep:'The Sheep',pig:'The Pig'}[kind]:C8K[kind][0],tt=masked?'Keeper':C8K[kind][1];
  if(kind==='sheep')n=c4Dup('andre',x_,z_,a,Object.assign({tag:'c8k',pup:1,int:'c8haze',name:nm,title:tt,house:null,prop:0,pin:0,cap:null,shirt:0x1a1a1c,sleeve:0x1a1a1c,pants:0x141416},o));
  else n=c4Pup('brothers',x_,z_,a,Object.assign({tag:'c8k',int:'c8haze',name:nm,title:tt,lvl:7,house:null,noLetters:1,shirt:0x1a1a1c,sleeve:0x1a1a1c,pants:0x141416,hair:kind==='goat'?0x2a1a10:0x8a6a3a,skin:kind==='goat'?SKIN[1]:SKIN[0]},o));
  if(n){n.c8k=kind;if(masked)c8Mask(n,kind)}return n}
const c8K=k=>Object.values(C4.cast).find(n=>c4Live(n)&&n.c8k===k);
const C8A={luke:['Luke Harmon',SKIN[0],0x6a4a2a],ezra:['Ezra Cole',SKIN[3]||SKIN[2],0x1a1410],marcus:['Marcus Bell',SKIN[2],0x2a1a10]};
function c8Assoc(k,x,z,a,o={}){const[x_,z_]=c8X(x,z),d=C8A[k];const n=c4Pup('brothers',x_,z_,a,Object.assign({tag:'c8a',int:'c8haze',name:d[0],title:'ΑΣΡ Associate',lvl:3,house:null,skin:d[1],hair:d[2],shirt:[0x3a4a6a,0x5a3a2a,0x2a4a3a][Object.keys(C8A).indexOf(k)],sleeve:[0x3a4a6a,0x5a3a2a,0x2a4a3a][Object.keys(C8A).indexOf(k)],pants:0x2a2a30},o));if(n)n.c8a=k;return n}
const c8A=k=>Object.values(C4.cast).find(n=>c4Live(n)&&n.c8a===k);
// a voice with no body (the speaker in the wall, a whisper through the vent): a puppet with its rig hidden, so the conversation box can sit on it
function c8Voice(name,title,x,z){const[x_,z_]=c8X(x,z);const n=c4Pup('brothers',x_,z_,0,{tag:'c8v',int:'c8haze',name,title,lvl:1});if(n&&n.g)n.g.children.forEach(c=>{if(c!==n.bub)c.visible=false});return n}
// tied to a chair (no gag), and Danny's own rope
function c8Tie(n){if(!n||!n.g)return;const r=new THREE.Mesh(GC.c6rope||(GC.c6rope=new THREE.TorusGeometry(.27,.035,6,16)),mt(0x9a7a4a,.9));r.rotation.x=PI/2;r.position.set(0,.95,0);r.userData.noMerge=1;n.g.add(r);n.c8rope=r;if(n.pup){n.pup.st='sit';n.pup.arms=.55}}
function c8Untie(n){if(n&&n.c8rope){n.c8rope.parent&&n.c8rope.parent.remove(n.c8rope);n.c8rope=null;if(n.pup){n.pup.st='';n.pup.arms=null}}}
function c8DanTie(on){if(PM.userData.c8rope){PM.remove(PM.userData.c8rope);PM.userData.c8rope=null}if(on){const r=new THREE.Mesh(GC.c6rope||(GC.c6rope=new THREE.TorusGeometry(.27,.035,6,16)),mt(0x9a7a4a,.9));r.rotation.x=PI/2;r.position.set(0,.95,0);r.userData.noMerge=1;PM.add(r);PM.userData.c8rope=r}}
// Danny's lines in the conversation box
function c8Dan(t,title){return c1Card(DANNY,title||'Danny Kowalski','','"'+t+'"',[['▸ Continue',null]])}
function c8Talk(n,title,text,ch,fin){if(!c4Live(n)){fin&&fin();return}card({title,sp:n.name+(n.title?' · '+n.title:''),text,focus:n,ch:(ch||[['▸ Continue',null]]).map(([l,f])=>[l,()=>{if(f)f();if(fin)fin()}])})}
// down to the underwear: shirt and sleeves to bare skin, trousers to white thermals (and back)
function c8Strip(g,on){if(!g)return;const mats=[];g.traverse(o=>{const m=o.material;if(m&&m.userData&&m.userData.pal&&!mats.includes(m))mats.push(m)});const SL=[PS.shirt,PS.sleeve,PS.pants];
  for(const m of mats){const p=m.userData.pal;if(on){if(!m.userData.c8o)m.userData.c8o=SL.map(i=>p[i].clone());const sk=p[PS.skin].clone();p[PS.shirt].copy(sk);p[PS.sleeve].copy(sk);const q=chrGrade(0xeeeae0,1,1);p[PS.pants].set(q.r,q.g,q.b,p[PS.pants].w)}else if(m.userData.c8o){SL.forEach((i,k)=>p[i].copy(m.userData.c8o[k]));m.userData.c8o=null}}
  if(g===PM)c8S().strip=on?1:0}

// ---------------------------------------------------------------- the dog
function c8DogMesh(){const g=new THREE.Group(),c=mt(0xc89a5a,.8),d=mt(0x6a4a2a,.8),sp=GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),A=(geo,m,x,y,z,s)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(s)o.scale.set(...s);o.castShadow=true;o.userData.noMerge=1;g.add(o);return o};
  A(sp,c,0,.42,0,[.2,.18,.36]);A(sp,c,0,.6,.36,[.15,.14,.16]);A(sp,c,0,.56,.5,[.08,.07,.1]);A(sp,mt(0x1a1a1a,.4),0,.58,.6,[.03,.025,.02]);for(const s of[-1,1]){A(sp,d,s*.1,.68,.3,[.04,.09,.06]);A(sp,mt(0x1a1a1a,.3),s*.06,.65,.47,[.02,.02,.015])}
  const legs=[];for(const[x,z]of[[-.11,-.22],[.11,-.22],[-.11,.2],[.11,.2]]){const l=A(GC.c8leg||(GC.c8leg=new THREE.CylinderGeometry(.04,.035,.32,6)),c,x,.16,z);legs.push(l)}const tail=new THREE.Group();tail.position.set(0,.52,-.34);const tm=new THREE.Mesh(GC.c8leg,c);tm.scale.set(.7,.8,.7);tm.position.y=.12;tm.userData.noMerge=1;tail.add(tm);tail.rotation.x=-.7;g.add(tail);
  const col=A(GC.c8col||(GC.c8col=new THREE.TorusGeometry(.12,.02,6,14)),mt(0xc8202e,.5),0,.56,.27);col.rotation.x=PI/2.4;g.userData.noMerge=1;g.legs=legs;g.tail=tail;return g}
function c8Dog(on,x,z){if(C8.dog){C8.dog.g.parent&&C8.dog.g.parent.remove(C8.dog.g);C8.dog=null}if(!on)return;const[x_,z_]=c8X(x,z),g=c8DogMesh();g.position.set(x_,0,z_);sc.add(g);C8.dog={g,x:x_,z:z_,a:0,tx:x_,tz:z_,t:0,fear:0,follow:0,crate:0}}
function c8DogUpd(dt){const D=C8.dog;if(!D)return;D.t+=dt;if(D.follow&&P.inside==='c8haze'){const bx=P.x-Math.sin(P.face)*1.2+Math.cos(P.face)*.7,bz=P.z-Math.cos(P.face)*1.2-Math.sin(P.face)*.7;if(Math.hypot(bx-D.x,bz-D.z)>.7){D.tx=bx;D.tz=bz}}
  const dx=D.tx-D.x,dz=D.tz-D.z,d=Math.hypot(dx,dz);let mv=0;if(d>.05){const s=Math.min(d,(D.fear>0?4:2.6)*dt);D.x+=dx/d*s;D.z+=dz/d*s;D.a=Math.atan2(dx,dz);mv=1}D.fear=Math.max(0,D.fear-dt);
  D.g.position.set(D.x,0,D.z);D.g.rotation.y=D.a;D.g.legs.forEach((l,i)=>l.rotation.x=mv?Math.sin(D.t*14+i*PI)*.5:0);D.g.tail.rotation.z=Math.sin(D.t*(D.fear>0?4:12))*(D.fear>0?.1:.6);D.g.tail.rotation.x=D.fear>0?.4:-.7;D.g.position.y=(D.out?terrH(D.x,D.z):0)+(D.crate?0:mv?Math.abs(Math.sin(D.t*14))*.03:0)}
const c8Bark=()=>{try{tone(420,.08,'square',.06);tone(300,.12,'square',.05,.09)}catch(e){}};

// ---------------------------------------------------------------- effects: drunk vision, shivering, the hose
function c8Drunk(k){C8.drunk=k;const cv=document.querySelector('canvas');if(cv)cv.style.filter=k>0?`blur(${(k*.45).toFixed(2)}px) saturate(${1+k*.15}) hue-rotate(${k*4}deg)`:''}
function c8Cold(on){let e=$('c8cold');if(!on){if(e)e.remove();C8.shiver=0;return}if(!e){e=document.createElement('div');e.id='c8cold';e.style.cssText='position:fixed;inset:0;z-index:28;pointer-events:none;box-shadow:inset 0 0 180px 50px rgba(150,200,255,.55);opacity:.8';document.body.appendChild(e)}C8.shiver=1}
function c8HoseFx(from,to,on){if(!on){if(C8.hose){sc.remove(C8.hose);C8.hose=null}return}if(!C8.hose){C8.hose=new THREE.Group();C8.hose.userData.noMerge=1;sc.add(C8.hose)}const g=C8.hose;while(g.children.length)g.remove(g.children[0]);
  const m=c7Seg(from,to,.07,GC.c8wat||(GC.c8wat=new THREE.MeshBasicMaterial({color:0xcfe8ff,transparent:true,opacity:.55,depthWrite:false})));g.add(m);if(rnd()<.6)c6Spark(to[0],to[1],to[2],0xdcefff,4)}

// ---------------------------------------------------------------- special steps
// keep Danny inside a rectangle (a locked room)
function c8LockUpd(){const L=C8.lock;if(!L||P.inside!=='c8haze')return;const I=INT.c8haze,[x0,z0,x1,z1]=L;P.x=clamp(P.x,I.x0+x0,I.x0+x1);P.z=clamp(P.z,I.z0+z0,I.z0+z1)}
// drink: press E at the table N times while the clock runs; vision blurs; Luke goes quiet
function c8DrinkStep(n){return{t:'cond',lab:()=>`Participate in the drinking challenge (${Math.min(n,c8S().drinks||0)}/${n} drinks)`,ok:()=>(c8S().drinks||0)>=n,goal:()=>{const p=c8P(20.5,8.6);return[p.x,p.z]},start:()=>{c8S().drinks=0},tick:dt=>{if(C4.auto)c8S().drinks=n},drink:1}}
// flee the hose: the Pig tracks you with the spray; keep the cold meter under 100 for the time limit
function c8HoseStep(secs){return{t:'cond',lab:()=>{const H=C8.hz;return'Flee the freezing water'+(H?` · ${Math.max(0,Math.ceil(secs-H.t))}s · COLD ${Math.round(H.cold)}%`:'')},ok:()=>!!(C8.hz&&C8.hz.done),goal:()=>{const p=c8P(30,3);return[p.x,p.z]},
  start:()=>{const pig=c8K('pig');C8.hz={t:0,cold:0,done:0,a:pig?pig.pup.face:0,swing:0};toast('Keep moving. Don\'t stay in the spray.',3000)},
  tick:dt=>{const H=C8.hz;if(!H||H.done)return;const pig=c8K('pig');if(C4.auto)H.t=secs;H.t+=dt;if(!pig){H.done=1;return}
    // the Pig swings the hose: mostly at Danny, now and then across the other two
    H.swing-=dt;let tx=P.x,tz=P.z;if(H.swing<0){if(H.swing<-2.2)H.swing=3+rnd()*3;const o=c8A(rnd()<.5?'ezra':'marcus');if(o){tx=o.x;tz=o.z}}
    const want=Math.atan2(tx-pig.x,tz-pig.z);let d=((want-H.a+PI*3)%TAU)-PI;H.a+=clamp(d,-1.3*dt,1.3*dt);pig.pup.face=H.a;pig.pup.look=null;
    const fx=Math.sin(H.a),fz=Math.cos(H.a),px=P.x-pig.x,pz=P.z-pig.z,pd=Math.hypot(px,pz)||1,hit=pd<10&&(px*fx+pz*fz)/pd>.985;const L=Math.min(10,pd);
    c8HoseFx([pig.x+fx*.4,1.2,pig.z+fz*.4],[pig.x+fx*L,hit?1.1:.4,pig.z+fz*L],1);if(hit){H.cold=Math.min(100,H.cold+dt*38);if(rnd()<dt*3)noise(.2,.08,2400)}else H.cold=Math.max(0,H.cold-dt*9);
    c1Hud(`THE WASHOUT · COLD ${Math.round(H.cold)}% · ${Math.max(0,Math.ceil(secs-H.t))}s`);if(H.cold>=100){H.cold=40;H.t=Math.max(0,H.t-6);toast('You go down on the wet concrete. Get up and keep moving.',2600);sfx('bad')}
    if(H.t>=secs){H.done=1;c8HoseFx(0,0,0);c1Hud(null)}},done:()=>{c8HoseFx(0,0,0);c1Hud(null)}}}
// protect the dog: the Goat and the Sheep take turns going for it; get between them and the dog
function c8ProtectStep(secs){return{t:'cond',lab:()=>{const T=C8.prot;return'Protect the dog from the Keepers'+(T?` · hold out ${Math.max(0,Math.ceil(secs-T.t))}s`:'')},ok:()=>!!(C8.prot&&C8.prot.done),goal:()=>{const D=C8.dog;return D?[D.x,D.z]:null},
  start:()=>{C8.prot={t:0,done:0,who:null,cd:1.5}},
  tick:dt=>{const T=C8.prot,D=C8.dog;if(!T||T.done||!D)return;if(C4.auto)T.t=secs;T.t+=dt;T.cd-=dt;
    if(!T.who&&T.cd<=0){const k=rnd()<.5?'goat':'sheep',n=c8K(k);if(n){T.who=n;n.pup.v=2.2;toast((k==='goat'?'The Goat':'The Sheep')+' goes for the dog.',1800)}}
    const n=T.who;if(n&&c4Live(n)){c4To(n,D.x,D.z,2.2);const dn=Math.hypot(n.x-D.x,n.z-D.z),dp=Math.hypot(n.x-P.x,n.z-P.z);
      if(dp<1.8){c4To(n,n.x+(n.x-P.x)*2,n.z+(n.z-P.z)*2,3);T.who=null;T.cd=2+rnd()*1.5;sfx('ok')}
      else if(dn<1.1){D.fear=2;c8Bark();D.tx=D.x+(D.x-n.x)*2.5;D.tz=D.z+(D.z-n.z)*2.5;T.t=Math.max(0,T.t-5);T.who=null;T.cd=1.5;toast('He got to the dog. Stay between them.',2200);sfx('bad')}}
    c1Hud(`PROTECT THE DOG · ${Math.max(0,Math.ceil(secs-T.t))}s`);if(T.t>=secs){T.done=1;c1Hud(null)}},done:()=>{c1Hud(null);const T=C8.prot;if(T&&T.who&&c4Live(T.who))c4To(T.who,T.who.x,T.who.z)}}}
// fight back: the three Keepers come at you with paddles; Ezra and Marcus fight beside you; it ends when all three are staggered
function c8FightStep(){return{t:'cond',lab:()=>{const F=C8.fight;return'Fight back against the Keepers'+(F?` (${F.foes.filter(n=>c4Live(n)&&(n.c8beat||n.down)).length}/${F.foes.length})`:'')},ok:()=>!!(C8.fight&&C8.fight.done),goal:()=>{const F=C8.fight;const n=F&&F.foes.find(n=>c4Live(n)&&!n.c8beat);return n?[n.x,n.z]:null},
  start:()=>{c4Off('c8k');c4Off('c8a');const mk=(kind,x,z)=>{const[x_,z_]=c8X(x,z);let n;if(kind==='sheep')n=c4Dup('andre',x_,z_,0,{tag:'c8f',int:'c8haze',name:C8K[kind][0],title:C8K[kind][1],lvl:Math.max(2,S.lvl),lvAbs:1,house:null,prop:0,pin:0,cap:null,shirt:0x1a1a1c,sleeve:0x1a1a1c,pants:0x141416});else n=c4Person('brothers',x_,z_,0,{tag:'c8f',int:'c8haze',name:C8K[kind][0],title:C8K[kind][1],lvl:Math.max(2,S.lvl),lvAbs:1,house:null,noLetters:1,shirt:0x1a1a1c,sleeve:0x1a1a1c,pants:0x141416,hair:kind==='goat'?0x2a1a10:0x8a6a3a,skin:kind==='goat'?SKIN[1]:SKIN[0]});n.foe=1;n.aggro=1;n.tgt='P';n.mode='wander';n.hp=n.mhp=70+S.lvl*8;n.c8k=kind;return n};
    const foes=[mk('goat',13,6),mk('sheep',10,8),mk('pig',16,8)];const al=[['ezra',11,15],['marcus',15,15]].map(([k,x,z])=>{const[x_,z_]=c8X(x,z);const n=c4Person('brothers',x_,z_,PI,{tag:'c8f',int:'c8haze',name:C8A[k][0],title:'ΑΣΡ Associate',lvl:Math.max(2,S.lvl-1),lvAbs:1,house:null,skin:C8A[k][1],hair:C8A[k][2]});n.ally=1;n.hp=n.mhp=400;n.mode='idle';n.c8a=k;c8Strip(n.g,1);return n});
    C8.fight={foes,al,done:0};if(S.hp<S.mhp*.8)S.hp=Math.round(S.mhp*.8);toast('They\'re coming. Fight back.',2400)},
  tick:dt=>{const F=C8.fight;if(!F||F.done)return;if(S.hp<S.mhp*.3)S.hp=Math.min(S.mhp,S.hp+dt*20);for(const a of F.al)if(c4Live(a)&&a.hp<a.mhp*.5)a.hp=a.mhp;
    for(const n of F.foes){if(!c4Live(n))continue;if(C4.auto&&!n.c8beat)n.hp=1;if(!n.c8beat&&n.hp<=n.mhp*.3){n.c8beat=1;n.aggro=0;n.tgt=null;n.foe=0;n.stun=3;n.hp=Math.max(1,n.hp);n.mode='idle';n.hx=n.x;n.hz=n.z;dmgNum(n.x,2.6,n.z,'STAGGERED','#ffd27a')}if(n.c8beat){n.aggro=0;n.tgt=null;if(n.down){n.down=0;n.hp=1}}}
    const left=F.foes.filter(n=>c4Live(n)&&!n.c8beat).length;c1Hud(`FIGHT BACK · ${F.foes.length-left}/${F.foes.length} KEEPERS DOWN`);if(!left){F.done=1;c1Hud(null);big('THE KEEPERS ARE DOWN',1600)}},done:()=>{c1Hud(null)}}}

// ---------------------------------------------------------------- hooks
function c8Prompts(add){if(!AM||!C8IDS.includes(AM.m.id))return;const st=curStep();
  if(st&&st.c5items){const d=c5S().d;for(const it of st.c5items){if(d[it.k]||it.busy||(it.need&&!it.need()))continue;const p=c5At(it.at());if(!p||(p.int||null)!==(P.inside||null))continue;add(p.x,p.z,it.r||2.4,it.act,()=>c5Do(it),0)}}
  if(st&&st.drink&&P.inside==='c8haze'){const p=c8P(20.5,8.2);add(p.x,p.z,2.4,'Drink',()=>c8DoDrink(),0)}}
function c8CleanAll(){for(const t of['c8k','c8a','c8v','c8f','c8x','c8g'])c4Off(t);c8Dog(0);c8Drunk(0);c8Cold(0);c8HoseFx(0,0,0);c8DanTie(0);if(c8S().strip)c8Strip(PM,0);C8.lock=null;C8.fight=null;C8.prot=null;C8.hz=null;c8Doors(0);for(const k in C4.props)if(/^c8/.test(k))c4Group(k,0);try{c8PadOnP(0)}catch(e){}if(P.inside==='c8haze')goOut(84,79)}
function c8Tick(dt){if(mode==='title'||mode==='loading')return;c8DogUpd(dt);c8LockUpd();
  for(const h of C8.hands){if(!h.run)continue;const t=TT;h.sh.rotation.z=-Math.floor(t)*TAU/60;h.mh.rotation.z=-2.6-t*TAU/3600}
  if(C8.flick&&P.inside==='c8haze'){C8.flick.visible=Math.sin(TT*23)+Math.sin(TT*7.3)>-.6}
  if(P.inside==='c8haze'&&(C8.tk=(C8.tk||0)-dt)<0&&C8.hands.some(h=>h.run)){C8.tk=1;try{tone(1800,.02,'square',.012)}catch(e){}}
  if(C8.shiver&&(C8.sh=(C8.sh||0)-dt)<0){C8.sh=.9;try{noise(.12,.03,3200)}catch(e){}}
  if((C8.T-=dt)>0)return;C8.T=1.2;
  if(!CINE&&mode==='play'&&(!AM||!C8IDS.includes(AM.m.id))&&TT-C4.chainT>8&&(C8.dog||C8.lock||C8.fight||P.inside==='c8haze'||c8S().strip))c8CleanAll()}
function c8Migrate(d){if(!d)return;if(S.ch>=9)for(const id of C8IDS)S.done[id]=1;setTimeout(()=>{try{if(!AM||!C8IDS.includes(AM.m.id))c8CleanAll()}catch(e){console.warn('c8Migrate',e)}},12)}
