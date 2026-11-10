// ================================================================ V132 CHAPTER 7 · WIZARDS AND SLUTS (the Lantern Walk finale moves to chapter 8)
// After the ΔΓΡ uprising: Grant is a frog, Derek is on the wizard's glowing leash, Silas was turned into a pile of powder. Vincent Cross now runs
// Delta Gamma Rho out of the old Kappa house (ΔΤΩ's house, renamed the Delta Gamma Rho House) and pays his debt to the wizard, Merlin the
// Magnificent, with the biggest party the campus has ever seen: Wizards and Sluts. Danny wants Grant and Derek back and Vincent gone.
//  c7price   The Price of the Pact      find Grant (a frog who only talks at night), Derek on the leash, what happened to Silas, when the party is
//  c7party   Wizards and Sluts          Vincent's announcement, the arrival time, the leash, the spellbook, the opening
//  c7guest   The Guest of Honor         slip into the party, Grant as an attraction, keep up with the wizard, his magic, the staff, the book
//  c7frog    A Frog Among Men           steal Grant back, the transformation spell, the counterspell, the ingredient
//  c7leash   The Leashed President      Derek, how the leash works, the staff, the binding spell, the release, a private word
//  c7night   The Wizard's Night Out     the wizard's night, get close, the misplaced staff, the pages, the vortex
//  c7duel    The Wizard's Last Stand    boss fight in the Nexus: The Showman / The Transformation / The Magnificent / The Final Spell
//  c7vincent The Fall of Vincent        back to the ΔΓΡ house with Grant and Derek, the evidence, the vote; the ending
// This file: renumbering, speech bubbles, props, the party world, the realm, special steps, the boss fight, hooks. Part 2 (21r): scenes, quests.
// Reuses chapter 4/5/6 helpers: c4Pup/c4Dup/c4Off/c4Shot/c4Follow/c4Fade/c4Wt/c4At, c5List/c5AP/c5InAsr/c5Anim/c5Next, c6Cine/c6Wizard/c6Frog/c6LeashDerek/c6Spark/c6Beam/c6Poof.
const C7={T:0,bubs:[],crowds:[],pt:null,nx:null,boss:null,sneak:null,track:null,esc:null,dancers:[],chatT:0,fx:[],flyer:null,signs:{},persuade:0};
const C7IDS=['c7price','c7party','c7guest','c7frog','c7leash','c7night','c7duel','c7vincent'];
const c7S=()=>S.c7||(S.c7={});
const c7Restored=()=>!!(S.c7&&S.c7.restored);

// ---------------------------------------------------------------- the Lantern Walk becomes chapter 8
for(const m of M)if(m.ch===7)m.ch=8;
CHN[7]='Wizards and Sluts';CHN[8]='The Lantern Walk';CHN[9]='Epilogue';
CHT[8]=CHT[7];
CHT[7]='Three presidents went into the woods. One came out a frog, one came out on a leash, and one did not come out at all.\n\nVincent Cross runs Delta Gamma Rho now. He owes a wizard the biggest party this campus has ever seen.';
XPM[8]=XPM[7];XPM[7]=150;

// ---------------------------------------------------------------- places
const C7DOOR=[51.5,32];                      // the Delta Gamma Rho House (the old Kappa house) front walk
const C7STAGE=[68,14.5],C7DANCE=[68,25];     // the block party on Greek Row: DJ stage at the tunnel end, LED dance floor in the street
const C7BAR=[55.5,41],C7BOWL=[56.5,21.5],C7TERR=[57.5,36.5],C7RACK=[66,47.5],C7TENT=[53.5,27],C7GATE=[68,51];
const C7GWZ=()=>c6Lawn('gwz',0,7);
const C7VPATH=[[60.5,44],[60,31],[62,19.5],[74,19.5],[75.5,31],[74,44]];   // Vincent's rounds of the party
const C7WPATH=[[68,25],[59,23.5],[56.5,34],[63,42],[73.5,37],[73,22]];     // the wizard working the room

// ---------------------------------------------------------------- speech bubbles: wrapped over several lines (the core bubble is one squeezed line)
const C7BT=new Map();
function c7BubTex(t){let e=C7BT.get(t);if(e)return e;
  const c=document.createElement('canvas'),W=620,F='600 26px Archivo,Arial',lh=32;let q=c.getContext('2d');q.font=F;
  const L=[];let cur='';for(const w of String(t).split(/\s+/)){if(!w)continue;const s=cur?cur+' '+w:w;if(cur&&q.measureText(s).width>W-60){L.push(cur);cur=w}else cur=s}if(cur)L.push(cur);
  const lines=L.slice(0,6);if(L.length>6)lines[5]=lines[5]+' …';
  q.font=F;const tw=Math.max(40,...lines.map(l=>q.measureText(l).width)),bw=Math.min(W-4,tw+52),bh=lines.length*lh+24,H=bh+24;
  c.width=W;c.height=H;q=c.getContext('2d');q.font=F;const x0=(W-bw)/2;
  q.fillStyle='rgba(10,8,14,.35)';q.beginPath();if(q.roundRect)q.roundRect(x0+3,6,bw,bh,16);else q.rect(x0+3,6,bw,bh);q.fill();
  q.fillStyle='#f6f1e3';q.beginPath();if(q.roundRect)q.roundRect(x0,2,bw,bh,16);else q.rect(x0,2,bw,bh);q.fill();
  q.beginPath();q.moveTo(W/2-12,bh);q.lineTo(W/2,H-3);q.lineTo(W/2+12,bh);q.fill();
  q.fillStyle='#1d1a16';q.textAlign='center';q.textBaseline='middle';lines.forEach((l,i)=>q.fillText(l,W/2,2+12+lh/2+i*lh));
  const tex=new THREE.CanvasTexture(c);e={tex,w:W/150,h:H/150};C7BT.set(t,e);
  if(C7BT.size>140){for(const[k,v]of C7BT){if(C7.bubs.some(b=>b.e===v))continue;v.tex.dispose();C7BT.delete(k);break}}
  return e}
// show a wrapped bubble over anyone (puppet, NPC, the frog or Danny); d = seconds it stays up
function c7Bub(n,t,d=3.2){if(!n||!t)return;const g=n.isP?PM:n.g;if(!g)return;try{t=c1Voc(t)}catch(e){}if(n.bub)n.bub.visible=false;
  let s=n.c7b;if(!s||s.parent!==g){s=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthWrite:false,depthTest:false,fog:false,color:PP.hdr?0xd6d0c4:0xffffff}));s.renderOrder=21;s.userData.noMerge=1;g.add(s);n.c7b=s}
  const e=c7BubTex(t),k=n.c7bs||1;s.material.map=e.tex;s.material.needsUpdate=true;s.scale.set(e.w*k,e.h*k,1);const base=n.c7by!=null?n.c7by:n.tall?4.0:n.isP?2.85:2.95;s.position.set(0,base+e.h*k*.5-.2,0);s.visible=true;
  try{babble(n,t,0)}catch(e){}const i=C7.bubs.findIndex(b=>b.n===n);if(i>=0)C7.bubs.splice(i,1);C7.bubs.push({n,s,e,t:d})}
function c7Unbub(n){const i=C7.bubs.findIndex(b=>b.n===n);if(i>=0){C7.bubs[i].s.visible=false;C7.bubs.splice(i,1)}}
function c7BubUpd(dt){for(let i=C7.bubs.length-1;i>=0;i--){const b=C7.bubs[i];b.t-=dt;if(b.t<=0||(!b.n.isP&&!b.n.c7keep&&!c4Live(b.n))){b.s.visible=false;C7.bubs.splice(i,1)}}}
// say a line: bubble + subtitle (no card)
function c7Say(n,t,d=2.8){if(!n)return;c7Bub(n,t,d);c1Sub(n.isP?'Danny':(n.name||''),t)}
async function c7DanSay(t,d=2.8){c7Say(DANNY,t,d);await c4Wt(d);c7Unbub(DANNY);c1Sub(null)}
// a line in the conversation box (V181: no duplicate bubble over the speaker)
async function c7Line(n,t,ack){if(!c4Live(n)&&!NP.includes(n))return;await c1Line(n,t,ack)}
// scripted dialogue: [n,text] conversation box + bubble, [n,text,secs] bubble only, [null,text,secs] narration, numbers wait, functions run
async function c7Lines(L){for(const l of L){if(typeof l==='number'){await c4Wt(l);continue}if(typeof l==='function'){await l();continue}const[n,t,d]=l;
  if(n===DANNY){await c7DanSay(t,d||2.8);continue}if(!n){c1Sub('',t);await c4Wt(d||2.6);c1Sub(null);continue}if(d){c7Say(n,t,d);await c4Wt(d);continue}await c7Line(n,t)}}
// a talk card for a checklist item: the quoted speech also shows in a bubble over the speaker; Danny's quoted reply pops over Danny
function c7Talk(n,title,text,ch,fin,bub){if(!c4Live(n)){fin&&fin();return}const b=bub||((String(text).match(/"([^"]+)"/)||[])[1]);if(b)c7Bub(n,b,90);
  card({title,sp:n.name+(n.title?' · '+n.title:''),text,focus:n,ch:(ch||[['"Okay."',null]]).map(([l,f])=>[l,()=>{c7Unbub(n);const m=/^"(.+)"$/.exec(l);if(m)c7Bub(DANNY,m[1],2.4);if(f)f();if(fin)fin()}])})}
// a quest card step spoken by someone in the scene: bubble over the speaker while the card is up
function c7C(title,sp,tx,ch,o={}){const q=(String(tx).match(/"([^"]+)"/)||[])[1];const cc=(ch||[['Continue',null]]).map(([l,f,d])=>[l,()=>{const n=sceneActor(sp);if(n)c7Unbub(n);const m=/^"(.+)"$/.exec(l);if(m)c7Bub(DANNY,m[1],2.2);return f&&f()},d]);
  return C_(title,sp,tx,cc,Object.assign({fx:()=>{const n=sceneActor(sp);if(n&&q)c7Bub(n,q,90)}},o))}
const c7Find=k=>Object.values(C4.cast).find(n=>c4Live(n)&&n.c7k===k);

// ---------------------------------------------------------------- materials and small effects
const c7Glow=(c,o=1)=>GC['c7g'+c+'_'+o]||(GC['c7g'+c+'_'+o]=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
const c7Flat=(c,o=1)=>GC['c7f'+c+'_'+o]||(GC['c7f'+c+'_'+o]=new THREE.MeshBasicMaterial({color:c,transparent:o<1,opacity:o,depthWrite:o>=1,side:THREE.DoubleSide}));
function c7Seg(a,b,r,mat){const d=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])||.01,m=new THREE.Mesh(GC.c7seg||(GC.c7seg=new THREE.CylinderGeometry(1,1,1,6,1,true)),mat);m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);m.scale.set(r,d,r);m.lookAt(b[0],b[1],b[2]);m.rotateX(PI/2);m.userData.noMerge=1;m.frustumCulled=false;return m}
// purple lightning: a jagged bolt from the sky, a white core, a flash on the ground
function c7Bolt(x,z,o={}){const y0=o.y0||16,y1=o.y1!=null?o.y1:(P.inside?0:terrH(x,z)),col=o.col||0xc9a4ff,g=new THREE.Group();g.userData.noMerge=1;let p=[x,y0,z];const n=9;
  for(let i=1;i<=n;i++){const k=i/n,q=[x+(i<n?(rnd()-.5)*1.6*(1-k*.6):0),y0+(y1-y0)*k,z+(i<n?(rnd()-.5)*1.6*(1-k*.6):0)];g.add(c7Seg(p,q,.085,c7Glow(col,.55)));g.add(c7Seg(p,q,.028,c7Glow(0xf3e6ff,.9)));if(i===4&&rnd()<.8){const br=[q[0]+(rnd()-.5)*3,q[1]-2.4,q[2]+(rnd()-.5)*3];g.add(c7Seg(q,br,.04,c7Glow(col,.6)))}p=q}
  sc.add(g);c6Spark(x,y1+.3,z,col,14);const fl=new THREE.Mesh(GC.c7disc||(GC.c7disc=new THREE.CircleGeometry(1,24)),new THREE.MeshBasicMaterial({color:0xe6d2ff,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));fl.rotation.x=-PI/2;fl.position.set(x,y1+.06,z);fl.scale.setScalar(.4);fl.userData.noMerge=1;sc.add(fl);
  let t=0;c5Anim(dt=>{t+=dt;g.visible=Math.sin(t*90)>-.3;fl.scale.setScalar(.3+t*4.5);fl.material.opacity=Math.max(0,.9-t*3);if(t>.32){sc.remove(g);sc.remove(fl);fl.material.dispose();return 1}});
  noise(.35,.22,3200);tone(70,.5,'sawtooth',.08);tone(52,.7,'square',.05,.05)}
// a telegraph circle on the floor: fills up, then fires cb
function c7Mark(x,z,r,dur,cb,col=0xb07aff){const y=(P.inside?0:terrH(x,z))+.05,ring=new THREE.Mesh(GC.c7ring||(GC.c7ring=new THREE.RingGeometry(.9,1,40)),c7Glow(col,.85)),fill=new THREE.Mesh(GC.c7disc||(GC.c7disc=new THREE.CircleGeometry(1,24)),c7Glow(col,.35));
  for(const m of[ring,fill]){m.rotation.x=-PI/2;m.position.set(x,y,z);m.userData.noMerge=1;sc.add(m)}ring.scale.setScalar(r);fill.scale.setScalar(.01);let t=0;
  c5Anim(dt=>{t+=dt;fill.scale.setScalar(Math.max(.01,r*Math.min(1,t/dur)));ring.rotation.z+=dt*2;if(t>=dur){sc.remove(ring);sc.remove(fill);try{cb&&cb()}catch(e){}return 1}})}
// an expanding shockwave ring; onR(r) every frame (for hit checks)
function c7Wave(x,z,r1,dur,col=0xb07aff,onR){const y=(P.inside?0:terrH(x,z))+.1,m=new THREE.Mesh(GC.c7wv||(GC.c7wv=new THREE.TorusGeometry(1,.06,6,48)),c7Glow(col,.9));m.rotation.x=-PI/2;m.position.set(x,y+.25,z);m.userData.noMerge=1;sc.add(m);let t=0;
  c5Anim(dt=>{t+=dt;const r=.5+(r1-.5)*Math.min(1,t/dur);m.scale.set(r,r,1+r*.08);try{onR&&onR(r)}catch(e){}if(t>=dur){sc.remove(m);return 1}});noise(.6,.16,260);tone(90,.6,'sine',.09)}
function c7Flash(ms=180,col='#fff'){const e=document.createElement('div');e.style.cssText=`position:fixed;inset:0;z-index:34;pointer-events:none;background:${col};opacity:.85;transition:opacity ${ms}ms`;document.body.appendChild(e);requestAnimationFrame(()=>{e.style.opacity=0});setTimeout(()=>e.remove(),ms+80)}
// camera-safe confetti burst in party colours
const c7Confetti=(x,y,z,n=260,r=7)=>{try{c4Confetti(x,y,z,n,r)}catch(e){}};

// ---------------------------------------------------------------- 2D art: the flyer, the anonymous photos, spellbook pages
function c7Stars(q,w,h,n,s=1){for(let i=0;i<n;i++){const x=(Math.sin(i*91.7)*.5+.5)*w,y=(Math.sin(i*37.3+2)*.5+.5)*h,r=(1+(i%3))*s;q.fillStyle=i%4?'rgba(255,240,200,.85)':'rgba(201,164,255,.9)';q.beginPath();q.arc(x,y,r,0,TAU);q.fill()}}
function c7DrawWizard(q,x,y,s){q.save();q.translate(x,y);q.scale(s,s);
  q.fillStyle='#5b2a86';q.beginPath();q.moveTo(-60,150);q.lineTo(60,150);q.lineTo(26,20);q.lineTo(-26,20);q.closePath();q.fill();
  q.fillStyle='#f2d6b8';q.beginPath();q.arc(0,0,22,0,TAU);q.fill();
  q.fillStyle='#eeeeee';q.beginPath();q.moveTo(-20,6);q.lineTo(20,6);q.lineTo(0,74);q.closePath();q.fill();
  q.fillStyle='#5b2a86';q.beginPath();q.moveTo(-34,-12);q.lineTo(34,-12);q.lineTo(6,-96);q.closePath();q.fill();q.fillRect(-40,-16,80,8);
  q.fillStyle='#ffd84a';for(const[a,b]of[[-6,-40],[8,-62],[-2,-78],[12,-28]]){q.beginPath();q.arc(a,b,3.4,0,TAU);q.fill()}
  q.fillStyle='#111';q.fillRect(-10,-4,5,4);q.fillRect(5,-4,5,4);
  q.strokeStyle='#6a4a2a';q.lineWidth=6;q.beginPath();q.moveTo(48,150);q.lineTo(62,-30);q.stroke();
  const gr=q.createRadialGradient(63,-40,2,63,-40,26);gr.addColorStop(0,'#ffffff');gr.addColorStop(.4,'#c9a4ff');gr.addColorStop(1,'rgba(176,122,255,0)');q.fillStyle=gr;q.beginPath();q.arc(63,-40,26,0,TAU);q.fill();q.restore()}
function c7DrawGuy(q,x,y,s,shirt,hair){q.save();q.translate(x,y);q.scale(s,s);q.fillStyle=shirt;q.beginPath();q.moveTo(-46,120);q.lineTo(46,120);q.lineTo(38,30);q.quadraticCurveTo(0,14,-38,30);q.closePath();q.fill();
  q.fillStyle='#e8c2a0';q.beginPath();q.arc(0,0,26,0,TAU);q.fill();q.fillStyle=hair;q.beginPath();q.arc(0,-8,27,PI,TAU);q.fill();q.fillStyle='#111';q.fillRect(-11,-2,5,4);q.fillRect(6,-2,5,4);q.strokeStyle='#7a3a2a';q.lineWidth=3;q.beginPath();q.arc(0,8,9,.2,PI-.2);q.stroke();
  q.fillStyle='#e2b64c';q.font='bold 22px serif';q.textAlign='center';q.fillText('ΔΓΡ',0,78);q.restore()}
function c7DrawFlyer(q,w,h){{const F_=q.fillText.bind(q);q.fillText=(t,x,y,m)=>F_(t,x,y,m||w-30)}const g=q.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1b0d2c');g.addColorStop(.6,'#3a1658');g.addColorStop(1,'#12091c');q.fillStyle=g;q.fillRect(0,0,w,h);c7Stars(q,w,h,70,w/512);
  const k=w/512;q.textAlign='center';q.fillStyle='#e2b64c';q.font=`800 ${22*k}px Archivo,Arial`;q.fillText('DELTA GAMMA RHO PRESENTS',w/2,46*k);
  q.fillStyle='#f3e6ff';q.font=`900 ${76*k}px Archivo,Arial`;q.fillText('WIZARDS',w/2,128*k);q.fillStyle='#c9a4ff';q.font=`900 ${40*k}px Archivo,Arial`;q.fillText('&',w/2,170*k);q.fillStyle='#ff8ac0';q.font=`900 ${76*k}px Archivo,Arial`;q.fillText('SLUTS',w/2,236*k);
  c7DrawGuy(q,150*k,350*k,1.25*k,'#1b2e57','#1a1410');c7DrawWizard(q,360*k,360*k,1.05*k);
  q.fillStyle='#e2b64c';q.font=`700 ${15*k}px Archivo,Arial`;q.fillText('VINCENT CROSS',150*k,520*k);q.fillText('MERLIN THE MAGNIFICENT',360*k,540*k);
  q.fillStyle='#f3e6ff';q.font=`800 ${19*k}px Archivo,Arial`;q.fillText('THE BIGGEST PARTY THIS CAMPUS HAS EVER SEEN',w/2,592*k);
  q.font=`600 ${17*k}px Archivo,Arial`;q.fillStyle='#d8c8ec';q.fillText('Guest of honor: Merlin the Magnificent (400+ yrs, first kegger)',w/2,624*k);q.fillText('WHEN: soon  ·  WHERE: you\'ll know  ·  costumes mandatory',w/2,652*k);q.fillStyle='#e2b64c';q.fillText('THREE HOUSES. ONE COALITION. ONE WIZARD.',w/2,690*k)}
function c7DrawFrogPic(q,w,h){{const F_=q.fillText.bind(q);q.fillText=(t,x,y,m)=>F_(t,x,y,m||w-30)}q.fillStyle='#2a3a2a';q.fillRect(0,0,w,h);q.fillStyle='#d9ceb4';q.fillRect(0,0,w,h*.62);q.fillStyle='#7d1f2c';q.fillRect(0,h*.55,w,h*.08);
  q.strokeStyle='rgba(220,240,255,.7)';q.lineWidth=4;q.strokeRect(w*.12,h*.2,w*.76,h*.66);q.fillStyle='rgba(180,210,220,.18)';q.fillRect(w*.12,h*.2,w*.76,h*.66);q.fillStyle='#6a5a3a';q.fillRect(w*.12,h*.78,w*.76,h*.08);
  const cx=w/2,cy=h*.6;q.fillStyle='#4fa83a';q.beginPath();q.ellipse(cx,cy,w*.17,h*.12,0,0,TAU);q.fill();q.beginPath();q.ellipse(cx,cy-h*.1,w*.12,h*.08,0,0,TAU);q.fill();
  q.fillStyle='#1b2e57';q.beginPath();q.ellipse(cx,cy+h*.02,w*.15,h*.075,0,0,TAU);q.fill();q.fillStyle='#e2b64c';q.font=`bold ${h*.07}px serif`;q.textAlign='center';q.fillText('ΔΓΡ',cx,cy+h*.045);
  for(const s of[-1,1]){q.fillStyle='#f6f2e8';q.beginPath();q.arc(cx+s*w*.06,cy-h*.17,w*.035,0,TAU);q.fill();q.fillStyle='#111';q.beginPath();q.arc(cx+s*w*.06,cy-h*.165,w*.016,0,TAU);q.fill()}
  q.fillStyle='#fff';q.font=`700 ${h*.05}px Archivo,Arial`;q.fillText('"house frog" lol',w/2,h*.12)}
function c7DrawLeashPic(q,w,h){{const F_=q.fillText.bind(q);q.fillText=(t,x,y,m)=>F_(t,x,y,m||w-30)}q.fillStyle='#22301e';q.fillRect(0,0,w,h);q.fillStyle='#3a4a34';q.fillRect(0,h*.7,w,h*.3);c7Stars(q,w,h*.5,18,.8);
  q.fillStyle='#5b2a86';q.beginPath();q.moveTo(w*.62,h*.92);q.lineTo(w*.86,h*.92);q.lineTo(w*.8,h*.42);q.lineTo(w*.68,h*.42);q.closePath();q.fill();q.beginPath();q.moveTo(w*.66,h*.36);q.lineTo(w*.82,h*.36);q.lineTo(w*.75,h*.12);q.closePath();q.fill();
  q.fillStyle='#8a5a3a';q.beginPath();q.ellipse(w*.28,h*.62,w*.08,h*.16,-.5,0,TAU);q.fill();q.fillStyle='#111';q.beginPath();q.arc(w*.24,h*.44,w*.05,0,TAU);q.fill();
  const gr=q.createLinearGradient(w*.28,h*.5,w*.7,h*.5);gr.addColorStop(0,'#e0ccff');gr.addColorStop(1,'#b07aff');q.strokeStyle=gr;q.lineWidth=6;q.shadowColor='#c9a4ff';q.shadowBlur=18;q.beginPath();q.moveTo(w*.27,h*.5);q.quadraticCurveTo(w*.48,h*.62,w*.69,h*.5);q.stroke();q.shadowBlur=0;
  q.fillStyle='#fff';q.font=`700 ${h*.05}px Archivo,Arial`;q.textAlign='center';q.fillText('saw this behind the quad. is that DEREK??',w/2,h*.08)}
function c7DrawPage(q,w,h,title,lines,fig){{const F_=q.fillText.bind(q);q.fillText=(t,x,y,m)=>F_(t,x,y,m||w-30)}q.fillStyle='#efe2c4';q.fillRect(0,0,w,h);q.strokeStyle='#8a6a3a';q.lineWidth=6;q.strokeRect(12,12,w-24,h-24);q.fillStyle='#4a2a6a';q.textAlign='center';q.font=`700 ${w*.06}px serif`;q.fillText(title,w/2,h*.12);
  q.strokeStyle='#6a3aa8';q.lineWidth=3;q.beginPath();q.arc(w/2,h*.33,h*.13,0,TAU);q.stroke();for(let i=0;i<5;i++){const a=-PI/2+i*4*PI/5,b=-PI/2+(i+1)*4*PI/5;q.beginPath();q.moveTo(w/2+Math.cos(a)*h*.13,h*.33+Math.sin(a)*h*.13);q.lineTo(w/2+Math.cos(b)*h*.13,h*.33+Math.sin(b)*h*.13);q.stroke()}
  if(fig){q.fillStyle='#6a3aa8';q.beginPath();q.arc(w/2,h*.33,h*.035,0,TAU);q.fill();q.strokeStyle='#e2b64c';q.lineWidth=2;q.beginPath();q.arc(w/2,h*.33,h*.06,0,TAU);q.stroke();q.fillStyle='#4a2a6a'}q.fillStyle='#3a2a1a';q.font=`italic ${w*.04}px serif`;lines.forEach((l,i)=>q.fillText(l,w/2,h*.56+i*h*.07))}
// a full-screen still (flyer, phone photos, book pages): returns when it closes (ms, or tap)
function c7Still(draws,o={}){return new Promise(res=>{const e=document.createElement('div');e.style.cssText='position:fixed;inset:0;z-index:35;display:flex;align-items:center;justify-content:center;gap:18px;background:rgba(6,4,10,.55);pointer-events:auto;opacity:0;transition:opacity .25s;flex-wrap:wrap;padding:12px';
  for(const[dw,W,H,cap]of draws){const box=document.createElement('div');box.style.cssText=`background:${o.phone?'#111':'transparent'};padding:${o.phone?'14px 10px 22px':'0'};border-radius:${o.phone?'26px':'6px'};box-shadow:0 10px 40px #000a;transform:translateY(14px) rotate(${(rnd()-.5)*3}deg);transition:transform .35s`;
    const c=document.createElement('canvas');c.width=W;c.height=H;c.style.cssText=`width:min(${W}px,${o.phone?44:80}vw);height:auto;display:block;border-radius:${o.phone?'12px':'4px'}`;dw(c.getContext('2d'),W,H);box.appendChild(c);
    if(cap){const p=document.createElement('div');p.textContent=cap;p.style.cssText='color:#f3e6ff;font:600 14px Archivo,Arial,sans-serif;text-align:center;margin-top:8px;max-width:min('+W+'px,44vw)';box.appendChild(p)}e.appendChild(box);requestAnimationFrame(()=>{box.style.transform='translateY(0)'})}
  if(o.head){const hd=document.createElement('div');hd.textContent=o.head;hd.style.cssText='position:absolute;top:6%;left:0;right:0;text-align:center;color:#e2b64c;font:800 16px Archivo,Arial,sans-serif;letter-spacing:.08em';e.appendChild(hd)}
  document.body.appendChild(e);requestAnimationFrame(()=>{e.style.opacity=1});sfx('ui');let done=0;const close=()=>{if(done)return;done=1;e.style.opacity=0;setTimeout(()=>{e.remove();res()},260)};e.onpointerdown=ev=>{ev.preventDefault();close()};setTimeout(close,C4.auto?300:(o.ms||4200))})}

// ---------------------------------------------------------------- people
function c7Merlin(x,z,a,o={}){const n=c6Wizard(x,z,a,Object.assign({name:'Merlin the Magnificent',title:o.title||'Guest of Honor',tag:'c7wiz'},o));n.c7by=3.35;return n}
// the wizard in the ΔΓΡ outfit he left the hideout in (beard and a navy cap)
function c7MerlinCasual(x,z,a,o={}){const n=c6Wizard(x,z,a,Object.assign({tag:'c7wiz',plain:1,name:'Merlin the Magnificent',title:'Honorary Member · ΔΓΡ'},DG,{pants:0x2a2a30},o));const h=n.g&&n.g.P&&n.g.P.head;
  if(h){const beard=new THREE.Mesh(GC.c6beard||(GC.c6beard=new THREE.ConeGeometry(.16,.55,10)),mt(0xeeeeee,.9));beard.rotation.x=PI;beard.position.set(0,-.08,.13);beard.userData.noMerge=1;h.add(beard);const cap=new THREE.Mesh(GC.c7cap||(GC.c7cap=new THREE.SphereGeometry(.22,12,8,0,TAU,0,PI/2)),mt(0x1b2e57,.7));cap.position.set(0,.2,0);h.add(cap)}
  c7Staff(n);return n}
function c7Staff(n){if(!n.g||n.c6orb)return;const staff=new THREE.Mesh(GC.c6staff||(GC.c6staff=new THREE.CylinderGeometry(.03,.035,1.7,6)),mt(0x5a3a22,.8));staff.position.set(.42,.85,.12);staff.userData.noMerge=1;n.g.add(staff);const orb=new THREE.Mesh(GC.c6orb||(GC.c6orb=new THREE.SphereGeometry(.09,12,8)),bm(0xc9a4ff));orb.position.y=.9;staff.add(orb);n.c6orb=orb;n.c7staff=staff}
function c7Vin(x,z,a,o={}){const n=c6Vin(x,z,a,Object.assign({tag:'c7'},o,{title:o.title||'ΔΓΡ Interim Chair'}));return n}
// Derek on the glowing leash: the leash is a strand of light beads between the wizard's hand and Derek's collar
function c7Derek(x,z,a,wiz){const d=c6LeashDerek(x,z,a,wiz);if(d){d.c7k='derek';d.c4tag='c7wiz'}if(C6.leash)C6.leash.line.material.color.set(0xc9a4ff);return d}
function c7LeashGlow(){const L=C6.leash;if(!L||!L.line||!L.line.visible){if(C7.lb)C7.lb.visible=false;return}if(!C7.lb){const m=new THREE.InstancedMesh(GC.c6sp||(GC.c6sp=new THREE.SphereGeometry(.05,6,4)),c7Glow(0xc9a4ff,.9),14);m.frustumCulled=false;m.userData.noMerge=1;sc.add(m);C7.lb=m}
  const p=L.line.geometry.attributes.position.array,m=C7.lb,o=new THREE.Object3D();m.visible=true;for(let i=0;i<14;i++){const k=(i+.5)/14,s=Math.sin(k*PI)*.35;o.position.set(p[0]+(p[3]-p[0])*k,p[1]+(p[4]-p[1])*k-s,p[2]+(p[5]-p[2])*k);o.scale.setScalar(.8+Math.sin(TT*8+i*1.3)*.4);o.updateMatrix();m.setMatrixAt(i,o.matrix)}m.instanceMatrix.needsUpdate=true}
// costume pieces for partygoers (and Danny's disguise)
function c7Hat(g,col=0x5b2a86,head){const h=head||(g&&g.P&&g.P.head);if(!h)return;const hat=new THREE.Mesh(GC.c6hat||(GC.c6hat=new THREE.ConeGeometry(.24,.7,12)),mt(col,.7));hat.position.set(0,.66,0);hat.userData.noMerge=1;h.add(hat);const br=new THREE.Mesh(GC.c6brim||(GC.c6brim=new THREE.CylinderGeometry(.36,.36,.03,16)),mt(col,.7));br.position.set(0,.33,0);h.add(br);
  for(let i=0;i<3;i++){const st=new THREE.Mesh(GC.c6star||(GC.c6star=new THREE.OctahedronGeometry(.035)),bm(0xffd84a));st.position.set(Math.cos(i*2.1)*.12,-.15+i*.12,Math.sin(i*2.1)*.12);hat.add(st)}return hat}
function c7Ears(g,col=0x1a1a1c){const h=g&&g.P&&g.P.head;if(!h)return;for(const s of[-1,1]){const e=new THREE.Mesh(GC.c7ear||(GC.c7ear=new THREE.ConeGeometry(.07,.16,4)),mt(col,.6));e.position.set(s*.12,.3,0);e.rotation.z=-s*.25;e.userData.noMerge=1;h.add(e)}}
function c7Halo(g){const h=g&&g.P&&g.P.head;if(!h)return;const r=new THREE.Mesh(GC.c7halo||(GC.c7halo=new THREE.TorusGeometry(.16,.025,6,20)),bm(0xffe27a));r.rotation.x=PI/2;r.position.set(0,.42,0);r.userData.noMerge=1;h.add(r)}
function c7Costume(on){const h=PM&&PM.P&&PM.P.head;if(PM.userData.c7cos){PM.userData.c7cos.forEach(m=>m.parent&&m.parent.remove(m));PM.userData.c7cos=null}if(!on||!h)return;const hat=c7Hat(null,0x2a3a8a,h),beard=new THREE.Mesh(GC.c6beard||(GC.c6beard=new THREE.ConeGeometry(.16,.55,10)),mt(0xdcdcdc,.9));beard.rotation.x=PI;beard.position.set(0,-.08,.13);beard.userData.noMerge=1;h.add(beard);
  PM.userData.c7cos=[hat,h.children[h.children.length-2],beard];c7S().cos=1}
// Danny carries Grant (the frog) on his shoulder, and later the wizard's staff
function c7FrogShirt(f){if(!f)return;const sh=new THREE.Mesh(bgeo(.27,.1,.3),mt(0x1b2e57,.7));sh.position.set(0,.12,.01);sh.userData.noMerge=1;f.add(sh);const s=signMesh('ΔΓΡ',.16,.06,'#1b2e57','#e2b64c');s.position.set(0,.13,.165);f.add(s);return f}
function c7FrogOnP(on){if(PM.userData.c7frog){PM.remove(PM.userData.c7frog);PM.userData.c7frog=null}if(!on)return;const f=c7FrogShirt(c6FrogMesh());f.scale.setScalar(.8);f.position.set(.24,1.5,-.02);PM.add(f);PM.userData.c7frog=f}
function c7StaffOnP(on){if(PM.userData.c7staff){PM.remove(PM.userData.c7staff);PM.userData.c7staff=null}if(!on)return;const g=new THREE.Group();const st=new THREE.Mesh(GC.c6staff||(GC.c6staff=new THREE.CylinderGeometry(.03,.035,1.7,6)),mt(0x5a3a22,.8));g.add(st);const orb=new THREE.Mesh(GC.c6orb||(GC.c6orb=new THREE.SphereGeometry(.09,12,8)),bm(0xc9a4ff));orb.position.y=.9;g.add(orb);g.position.set(-.36,.95,.1);g.rotation.z=.12;g.traverse(o=>o.userData.noMerge=1);PM.add(g);PM.userData.c7staff=g}
// a terrarium with a frog inside it (the frog is a puppet so he can talk in bubbles)
function c7Terrarium(name,x,z,a,int,y0){for(const k of['c7tr','c7tr2','c7tr3'])if(k!==name){c4Group(k,0);c4Off(k+'f')}const y=y0!=null?y0:(int?0:terrH(x,z));const g=c4Group(name,1,G=>{const T=c4M(bgeo(1.3,.06,.8),mt(0x6a4a2a,.8),0,.76,0,G);c4M(bgeo(.08,.76,.08),0x3a2614,-.58,.38,-.32,G);c4M(bgeo(.08,.76,.08),0x3a2614,.58,.38,-.32,G);c4M(bgeo(.08,.76,.08),0x3a2614,-.58,.38,.32,G);c4M(bgeo(.08,.76,.08),0x3a2614,.58,.38,.32,G);
    const gl=new THREE.Mesh(bgeo(.9,.55,.55),new THREE.MeshStandardMaterial({color:0xd8f0ff,transparent:true,opacity:.28,roughness:.05,metalness:.1,depthWrite:false}));gl.position.set(0,1.07,0);gl.userData.noMerge=1;G.add(gl);c4M(bgeo(.86,.06,.51),mt(0x6a5a3a,.95),0,.82,0,G);c4M(bgeo(.2,.12,.12),mt(0x6a7a6a,.9),.28,.89,-.1,G);
    const s=signMesh('PRESIDENT RIBBIT · DO NOT LICK',1.3,.24,'#1b2e57','#e2b64c');s.position.set(0,.6,.41);G.add(s)});g.position.set(x,y,z);g.rotation.y=a;
  c4Off(name+'f');const fr=c6Frog(x,z,a,y+.86);if(fr){fr.c4tag=name+'f';fr.int=int||null;c7FrogShirt(fr.frogM);fr.c7by=1.05;fr.c7bs=.85;fr.c7k='grantfrog'}return fr}

// ---------------------------------------------------------------- the ΔΓΡ letters on the three founding houses (all chapter 7), taken down at the end
function c7SignMk(id){if(C7.signs[id])return C7.signs[id];const b=B.find(b=>b.id===id);if(!b||!b.face)return null;const g=new THREE.Group(),ry=fry(b.face),put=(m,out,y)=>{const[x,z]=fpos(b,b.face,b.da,out);m.position.set(x,y,z);m.rotation.y=ry;m.userData.noMerge=1;g.add(m);return m};
  put(signMesh('ΔΓΡ',10.7,2.06,'#1b2e57','#e2b64c'),3.53,7.8);put(signMesh('ΔΓΡ',2.5,1.05,'#1b2e57','#e2b64c'),3.42,9.45);if(id==='kto')put(signMesh('THE DELTA GAMMA RHO HOUSE',6.4,.62,'#e2b64c','#1b2e57'),3.6,6.35);
  g.userData.noMerge=1;g.visible=false;sc.add(g);C7.signs[id]=g;return g}
function c7Signs(on){for(const id of['asr','kto','gwz']){const g=c7SignMk(id);if(g&&!g.userData.falling)g.visible=!!on;const f=C4.frM&&C4.frM[id];if(f){for(const i of[0,1])if(f.children[i])f.children[i].visible=!on}}
  const b=B.find(b=>b.id==='kto');if(b){if(on){if(!C7.ktoName)C7.ktoName=b.name;b.name='The Delta Gamma Rho House'}else if(C7.ktoName){b.name=C7.ktoName;C7.ktoName=null}}}
// the letters drop off the portico one house at a time (ending)
function c7SignFall(id){const g=c7SignMk(id);if(!g)return;g.visible=true;g.userData.falling=1;const f=C4.frM&&C4.frM[id];let t=0;const y0=g.children.map(m=>m.position.y);
  c5Anim(dt=>{t+=dt;g.children.forEach((m,i)=>{m.position.y=y0[i]-Math.max(0,t-i*.15)**2*4.9;m.rotation.z=Math.max(0,t-i*.15)*(i%2?.8:-.8)});if(t>1.6){g.visible=false;g.children.forEach((m,i)=>{m.position.y=y0[i];m.rotation.z=0});g.userData.falling=0;if(f)for(const i of[0,1])if(f.children[i])f.children[i].visible=true;return 1}});noise(.3,.12,400)}

// ---------------------------------------------------------------- the block party on Greek Row
function c7Party(on){if(!on){if(C7.pt&&C7.pt.on){c4Group('c7party',0);for(let i=C7.crowds.length-1;i>=0;i--)if(!C7.crowds[i].nx){sc.remove(C7.crowds[i].g);C7.crowds.splice(i,1)}c4Off('c7pty');C7.dancers=[];C7.pt.on=0;carsOn=CARS.length>0}return}
  if(!C7.pt||!C4.props.c7party)C7.pt={tiles:[],beams:[],fog:[],on:0};const T=C7.pt;
  c4Group('c7party',1,g=>{const Y=(x,z)=>terrH(x,z);
    // DJ stage, truss, speaker stacks, the banner, the DJ booth
    const[sx,sz]=C7STAGE,sy=Y(sx,sz);c4M(bgeo(9,.8,4.4),mt(0x1a1a20,.6),sx,sy+.4,sz,g);c4M(bgeo(9.2,.1,.2),bm(0xb07aff),sx,sy+.82,sz+2.2,g);
    for(const k of[-4.4,4.4])c4M(bgeo(.3,6.2,.3),mt(0x9a9aa2,.4,.7),sx+k,sy+3.1,sz-1.6,g);c4M(bgeo(9.1,.35,.35),mt(0x9a9aa2,.4,.7),sx,sy+6.2,sz-1.6,g);
    const ban=signMesh('WIZARDS & SLUTS',7.6,1.35,'#2a1240','#ff8ac0');ban.position.set(sx,sy+5.2,sz-1.45);g.add(ban);const ban2=signMesh('ΔΓΡ · GUEST OF HONOR: MERLIN THE MAGNIFICENT',7.6,.42,'#1b2e57','#e2b64c');ban2.position.set(sx,sy+4.25,sz-1.45);g.add(ban2);
    for(const k of[-3.6,3.6]){c4M(bgeo(1.3,2.6,1.1),mt(0x111114,.5),sx+k,sy+2.1,sz-.6,g);for(const yy of[1.4,2.4])c4M(new THREE.CylinderGeometry(.36,.36,.06,16),mt(0x2a2a30,.4),sx+k,sy+yy,sz-.02,g).rotation.x=PI/2}
    c4M(bgeo(2.4,1.1,.9),mt(0x0d0d10,.4,.3),sx,sy+1.35,sz+.4,g);const dj=signMesh('ΔΓΡ',1.6,.5,'#1b2e57','#e2b64c');dj.position.set(sx,sy+1.4,sz+.87);g.add(dj);c4M(bgeo(.5,.05,.4),mt(0x333338,.4),sx-.6,sy+1.93,sz+.4,g);c4M(bgeo(.5,.05,.4),mt(0x333338,.4),sx+.6,sy+1.93,sz+.4,g);
    // stage spotlights: four additive beams sweeping the crowd
    for(let i=0;i<4;i++){const b=new THREE.Mesh(GC.c7beamC||(GC.c7beamC=new THREE.ConeGeometry(1.6,12,16,1,true).translate(0,-6,0)),c7Glow([0xb07aff,0xff8ac0,0x7ad8ff,0xffd84a][i],.16));b.position.set(sx-3.3+i*2.2,sy+6,sz-1.4);b.userData.noMerge=1;g.add(b);T.beams.push(b)}
    // the LED dance floor: 8×8 tiles that cycle colour
    const[dx,dz]=C7DANCE,dy=Y(dx,dz)+.035;for(let i=0;i<8;i++)for(let j=0;j<8;j++){const m=new THREE.Mesh(GC.c7tile||(GC.c7tile=new THREE.BoxGeometry(1.06,.05,1.06)),new THREE.MeshBasicMaterial({color:0x5b2a86}));m.position.set(dx-3.85+i*1.1,dy,dz-3.85+j*1.1);m.userData.noMerge=1;g.add(m);T.tiles.push(m)}
    // string lights across the street, a disco ball on a wire
    for(const z of[18,24,30,36,42]){const pts=[];for(let i=0;i<=12;i++){const k=i/12;pts.push(new THREE.Vector3(61+k*14,Y(68,z)+6.2-Math.sin(k*PI)*.9,z))}const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x222222}));ln.userData.noMerge=1;g.add(ln);pts.forEach((p,i)=>{if(i%1===0)c4M(GC.c7bulb||(GC.c7bulb=new THREE.SphereGeometry(.07,6,4)),bm([0xffd27a,0xff8ac0,0xc9a4ff][i%3]),p.x,p.y-.1,p.z,g)})}
    for(const x of[61,75])for(const z of[18,30,42])c4M(bgeo(.14,6.6,.14),mt(0x5a4a3a,.8),x,Y(x,z)+3.3,z,g);
    const ball=new THREE.Mesh(GC.c7ball||(GC.c7ball=new THREE.IcosahedronGeometry(.5,1)),new THREE.MeshStandardMaterial({color:0xdadae6,metalness:1,roughness:.12,flatShading:true,emissive:0x2a2040}));ball.position.set(dx,Y(dx,dz)+5.4,dz);ball.userData.noMerge=1;g.add(ball);T.ball=ball;c4M(bgeo(.02,.8,.02),0x222222,dx,Y(dx,dz)+6.1,dz,g);
    // the bar: kegs, red cups, a sign
    const[bx,bz]=C7BAR,by=Y(bx,bz);c4M(bgeo(3.2,.08,.9),mt(0xe8e2d6,.7),bx,by+.92,bz,g);c4M(bgeo(3.24,.86,.92),mt(0x1b2e57,.7),bx,by+.46,bz,g);for(let i=0;i<4;i++)c4M(GC.c7keg||(GC.c7keg=new THREE.CylinderGeometry(.24,.24,.6,14)),mt(0xbfc4cc,.3,.8),bx-1.2+i*.8,by+.3,bz-.9,g);
    for(let i=0;i<6;i++)c4M(GC.c7cup||(GC.c7cup=new THREE.CylinderGeometry(.045,.035,.12,8)),mt(0xc8202e,.5),bx-1.2+i*.45,by+1.02,bz+.15,g);{const s=signMesh('ΔΓΡ BAR · NO ONE ABOVE US',2.6,.4,'#1b2e57','#e2b64c');s.position.set(bx,by+1.55,bz+.47);g.add(s)}
    // Merlin's personal punch bowl (glowing purple, bubbling)
    const[px,pz]=C7BOWL,py=Y(px,pz);c4M(bgeo(1.6,.06,.8),mt(0x2a1240,.6),px,py+.86,pz,g);c4M(bgeo(1.64,.82,.82),mt(0x5b2a86,.7),px,py+.43,pz,g);const bowl=c4M(new THREE.SphereGeometry(.42,16,10,0,TAU,PI*.45,PI*.55),mt(0xd8f0ff,.1,.2),px,py+1.25,pz,g);bowl.material=new THREE.MeshStandardMaterial({color:0xd8f0ff,transparent:true,opacity:.45,roughness:.05});
    const punch=new THREE.Mesh(new THREE.CircleGeometry(.37,18),new THREE.MeshBasicMaterial({color:0xb04aff}));punch.rotation.x=-PI/2;punch.position.set(px,py+1.12,pz);punch.userData.noMerge=1;g.add(punch);T.punch=punch;{const s=signMesh("MERLIN'S PURPLE PUNCH · WIZARDS ONLY",1.9,.3,'#2a1240','#c9a4ff');s.position.set(px,py+.55,pz+.42);g.add(s)}
    // the VIP tent on the lawn (coat check, Merlin's lectern)
    const[tx,tz]=C7TENT,ty=Y(tx,tz);for(const sx2 of[-1.8,1.8])for(const sz2 of[-1.6,1.6])c4M(bgeo(.08,2.4,.08),mt(0xdcdcdc,.4,.6),tx+sx2,ty+1.2,tz+sz2,g);const roof=c4M(new THREE.ConeGeometry(2.9,1.1,4),mt(0x5b2a86,.8),tx,ty+2.95,tz,g);roof.rotation.y=PI/4;
    {const s=signMesh('VIP · COAT CHECK',2.6,.42,'#2a1240','#e2b64c');s.position.set(tx+1.85,ty+2.15,tz);s.rotation.y=PI/2;g.add(s)}c4M(bgeo(.08,1.7,1.4),mt(0x3a3a40,.5,.6),tx-1.3,ty+1.1,tz,g);for(let i=0;i<5;i++)c4M(bgeo(.12,.9,.45),mt([0x5b2a86,0x1b2e57,0x7d1f2c,0x2a2a30,0xe2b64c][i],.8),tx-1.22,ty+1.25,tz-.6+i*.3,g);
    c4M(bgeo(.5,1.1,.4),mt(0x4a3020,.8),tx+.6,ty+.55,tz+.9,g);const lec=c4M(bgeo(.62,.06,.5),mt(0x4a3020,.8),tx+.6,ty+1.14,tz+.9,g);lec.rotation.x=-.3;T.book=c4M(bgeo(.46,.08,.34),mt(0x4a2a6a,.7),tx+.6,ty+1.2,tz+.88,g);T.book.rotation.x=-.3;
    // costume rack at the gate, barricades closing the street
    const[rx,rz]=C7RACK,ry=Y(rx,rz);c4M(bgeo(2.4,.06,.06),mt(0x9a9aa2,.4,.7),rx,ry+1.7,rz,g);for(const k of[-1.2,1.2])c4M(bgeo(.06,1.7,.5),mt(0x9a9aa2,.4,.7),rx+k,ry+.85,rz,g);for(let i=0;i<7;i++){const c=[0x5b2a86,0x2a3a8a,0xff8ac0,0x1a1a1c,0xf2f2ee,0x7d1f2c,0x2f7a3a][i];c4M(bgeo(.3,1,.06),mt(c,.8),rx-1+i*.33,ry+1.15,rz,g)}
    {const s=signMesh('COSTUMES MANDATORY',2.4,.4,'#2a1240','#ff8ac0');s.position.set(rx,ry+2.05,rz+.05);g.add(s)}
    for(const x of[63.5,67,70.5]){const[X,Z]=[x,C7GATE[1]+1.5];c4M(bgeo(3,.22,.08),mt(0xf2f2ee,.6),X,Y(X,Z)+.85,Z,g);c4M(bgeo(3,.22,.085),mt(0xd8402a,.6),X,Y(X,Z)+.62,Z,g);for(const k of[-1.3,1.3])c4M(bgeo(.08,.95,.5),mt(0xcfcfcf,.5),X+k,Y(X,Z)+.47,Z,g)}
    {const s=signMesh('ROAD CLOSED · ΔΓΡ WIZARDS & SLUTS',4.6,.55,'#1b2e57','#e2b64c');s.position.set(67,Y(67,53)+1.6,C7GATE[1]+1.6);s.rotation.y=PI;g.add(s)}
    // low party fog drifting over the dance floor
    for(let i=0;i<7;i++){const f=new THREE.Mesh(GC.c7fogG||(GC.c7fogG=new THREE.PlaneGeometry(5,2.2)),new THREE.MeshBasicMaterial({color:0xcab8e8,transparent:true,opacity:.13,depthWrite:false}));f.position.set(dx-4+i*1.4,Y(dx,dz)+.7,dz-3+(i%3)*2.5);f.userData={noMerge:1,ph:i*1.7};g.add(f);T.fog.push(f)}});
  if(!T.on){T.on=1;carsOn=false;
    // the crowd: costumes everywhere
    const spots=[];const[dx,dz]=C7DANCE,clear=(x,z)=>freeAt(x,z,.35)&&[C7BAR,C7BOWL,C7TERR,C7TENT,C7RACK,C6RAM,C7STAGE].every(([px,pz],i)=>Math.hypot(x-px,z-pz)>(i===3?3.4:i===6?5.4:2.6));for(const s of c6Ring(dx,dz,6.2,22,2))if(clear(s[0],s[1]))spots.push(s);for(let i=0;i<22;i++){const x=48.5+rnd()*11,z=17+rnd()*28;if(clear(x,z))spots.push([x,z,rnd()*TAU])}for(let i=0;i<12;i++){const x=63+rnd()*10,z=33+rnd()*12;if(clear(x,z))spots.push([x,z,Math.atan2(dx-x,dz-z)])}
    const C=c1Crowd(spots,{k:'c7pty',SH:[0x5b2a86,0xff8ac0,0x1a1a1c,0xf2f2ee,0x2a3a8a,0xc8202e,0x1b2e57,0xe2b64c],PA:[0x1d1f24,0x2e3d5c,0x3a3a40,0xf2f2ee,0x5b2a86],fem:.45});C.data.forEach(d=>{d.y=terrH(d.x,d.z);d.amp=.06+rnd()*.06;d.sp=4+rnd()*2.4});sc.add(C.g);C7.crowds.push(C);
    // dancers on the LED floor (puppets so they can talk)
    const looks=[[c7Hat,0x5b2a86],[c7Ears,0x1a1a1c],[c7Halo],[c7Hat,0x2a3a8a],[c7Ears,0xf2f2ee],[c7Hat,0x7d1f2c],[c7Halo],[c7Ears,0xff8ac0]];
    for(let i=0;i<8;i++){const a=i/8*TAU,[x,z]=c3Free(dx+Math.cos(a)*(1.6+(i%2)*1.6),dz+Math.sin(a)*(1.6+(i%2)*1.6)),fem=i%2===1,n=c4Pup(fem?'townies':'athletes',x,z,a+PI,{tag:'c7pty',name:(fem?pick(['Kayla','Brooke','Madison','Sierra','Jess','Tori']):pick(MN))+' ('+(i%3?'ΔΓΡ':'guest')+')',title:'Partygoer',fem,lvl:3,shirt:[0x5b2a86,0xff8ac0,0x1a1a1c,0xf2f2ee][i%4],sleeve:[0x5b2a86,0xff8ac0,0x1a1a1c,0xf2f2ee][i%4]});
      const[f,c]=looks[i];try{f(n.g,c)}catch(e){}n.pup.st=i%3?'wave':'';n.c7d={ph:rnd()*TAU,sp:5+rnd()*2};C7.dancers.push(n)}}
  C4.props.c7party.visible=true}
const C7CHAT=['THIS IS THE BEST NIGHT OF MY LIFE','Is that a real wizard?','Who brought the frog?','My robe has POCKETS!','Vincent said no plus-ones…','I lost my hat. And my shoe.','DELTA! GAMMA! RHO!','Do NOT drink the purple punch','This DJ only plays bangers','Is the fog supposed to sparkle?'];
function c7PartyUpd(dt){const T=C7.pt;if(!T||!T.on)return;const t=TT;
  T.tiles.forEach((m,i)=>{const k=((i%8)+Math.floor(i/8)+Math.floor(t*2.2))%4;m.material.color.setHex([0x5b2a86,0xff4a9a,0x2a6aff,0x18ffd0][k]);m.material.color.multiplyScalar(.55+.45*Math.max(0,Math.sin(t*6+i)))});
  if(T.ball)T.ball.rotation.y+=dt*.9;T.beams.forEach((b,i)=>{b.rotation.set(-.9+Math.sin(t*.7+i)*.35,0,Math.sin(t*.9+i*1.7)*.55)});
  T.fog.forEach(f=>{f.position.x+=Math.sin(t*.3+f.userData.ph)*dt*.4;f.rotation.y=Math.sin(t*.1+f.userData.ph);f.material.opacity=.1+Math.sin(t*.5+f.userData.ph)*.04});if(T.punch)T.punch.material.color.setHSL(.78+Math.sin(t*2)*.03,1,.5+Math.sin(t*5)*.06);
  for(const n of C7.dancers){if(!c4Live(n)||!n.pup)continue;n.pup.dy=Math.abs(Math.sin(t*n.c7d.sp+n.c7d.ph))*.14;n.pup.face=(n.pup.face||0)+Math.sin(t*1.3+n.c7d.ph)*dt*1.5}
  for(const C of C7.crowds)c1CrowdUpd(C,t);
  if((C7.chatT-=dt)<0){C7.chatT=2.6+rnd()*2.4;const n=pick(C7.dancers);if(c4Live(n)&&!CINE&&Math.hypot(n.x-P.x,n.z-P.z)<22)c7Bub(n,pick(C7CHAT),2.6)}}

// ---------------------------------------------------------------- the Nexus: Merlin's realm (an interior with no walls you can see, dressed as a purple void)
const C7NX={W:60,D:60,at:[600,1500]};
function c7BuildNexus(){let sd=91;const R_=()=>(sd=sd*16807%2147483647)/2147483647;const{W,D}=C7NX,n0=sc.children.length;const I=mkInt('c7nexus',W,D,{at:C7NX.at,up:1,hole:[0,0,W,D],chole:[0,0,W,D],name:'The Nexus · Merlin\'s Realm',wall:0x1a1024,low:0x2a1440});for(const k of sc.children.slice(n0))sc.remove(k);I.walls=[];
  const cx=I.x0+W/2,cz=I.z0+D/2,R={I,cx,cz,rocks:[],deb:[],obel:[],t:0};const add=m=>{m.userData.noMerge=1;sc.add(m);return m};
  // obsidian floor and the rune arena
  const fl=add(new THREE.Mesh(new THREE.PlaneGeometry(W+40,D+40),new THREE.MeshStandardMaterial({color:0x1a0f26,roughness:.32,metalness:.35})));fl.rotation.x=-PI/2;fl.position.set(cx,0,cz);fl.receiveShadow=true;
  const at=ctex(1024,1024,(q,w,h)=>{q.fillStyle='#2a2238';q.fillRect(0,0,w,h);for(let i=0;i<220;i++){const a=R_()*TAU,r=R_()*w*.5;q.fillStyle=`rgba(${60+R_()*30},${50+R_()*20},${80+R_()*30},.9)`;q.fillRect(w/2+Math.cos(a)*r-30,h/2+Math.sin(a)*r-30,60,60)}
    q.strokeStyle='#120a1c';q.lineWidth=5;for(let r=90;r<w/2;r+=90){q.beginPath();q.arc(w/2,h/2,r,0,TAU);q.stroke()}for(let i=0;i<24;i++){const a=i/24*TAU;q.beginPath();q.moveTo(w/2+Math.cos(a)*90,h/2+Math.sin(a)*90);q.lineTo(w/2+Math.cos(a)*w*.5,h/2+Math.sin(a)*h*.5);q.stroke()}
    q.strokeStyle='#c9a4ff';q.lineWidth=10;q.shadowColor='#b07aff';q.shadowBlur=24;q.beginPath();q.arc(w/2,h/2,w*.46,0,TAU);q.stroke();q.beginPath();q.arc(w/2,h/2,w*.2,0,TAU);q.stroke();q.beginPath();for(let i=0;i<5;i++){const a=-PI/2+i*4*PI/5;q[i?'lineTo':'moveTo'](w/2+Math.cos(a)*w*.2,h/2+Math.sin(a)*h*.2)}q.closePath();q.stroke();
    q.font='bold 46px serif';q.fillStyle='#e0ccff';for(let i=0;i<16;i++){const a=i/16*TAU;q.save();q.translate(w/2+Math.cos(a)*w*.42,h/2+Math.sin(a)*h*.42);q.rotate(a+PI/2);q.fillText('ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊ'[i],-14,14);q.restore()}});
  const ar=add(new THREE.Mesh(new THREE.CircleGeometry(19,72),new THREE.MeshStandardMaterial({map:at,roughness:.7,emissive:0x2a1048,emissiveMap:at,emissiveIntensity:.55})));ar.rotation.x=-PI/2;ar.position.set(cx,.02,cz);ar.receiveShadow=true;R.arena=ar;
  const rim=add(new THREE.Mesh(new THREE.TorusGeometry(19.2,.22,8,96),c7Glow(0xb07aff,.8)));rim.rotation.x=-PI/2;rim.position.set(cx,.1,cz);
  // the edge of the world: a low glowing ribbon along the (invisible) walls
  for(const[x,z,w,d]of[[cx,I.z0+.3,W,.1],[cx,I.z1-.3,W,.1],[I.x0+.3,cz,.1,D],[I.x1-.3,cz,.1,D]]){const m=add(new THREE.Mesh(new THREE.BoxGeometry(w||.1,.5,d||.1),c7Glow(0x9a5aff,.35)));m.position.set(x,.25,z)}
  // the sky: a swirling purple dome
  const dm=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{t:{value:0}},vertexShader:'varying vec3 vp;void main(){vp=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform float t;varying vec3 vp;void main(){vec3 d=normalize(vp);float a=atan(d.z,d.x);float r=acos(clamp(d.y,-1.0,1.0));float s=sin(a*5.0+r*9.0-t*1.1)*.5+.5;float s2=sin(a*3.0-r*13.0+t*1.7)*.5+.5;float sw=s*s2;vec3 c=mix(vec3(.05,.015,.1),vec3(.42,.16,.7),sw);c+=vec3(1.0,.62,1.0)*pow(sw,9.0)*.9;c+=vec3(.75,.45,1.0)*pow(max(0.0,d.y),7.0)*1.3;c=mix(c,vec3(.02,.01,.04),smoothstep(.1,-.35,d.y));gl_FragColor=vec4(c,1.0);}'});
  const dome=add(new THREE.Mesh(new THREE.SphereGeometry(54,40,24),dm));dome.position.set(cx,0,cz);dome.frustumCulled=false;R.dome=dome;
  // the vortex funnel overhead
  const sw=ctex(512,512,(q,w,h)=>{q.clearRect(0,0,w,h);for(let i=0;i<9;i++){q.strokeStyle=i%2?'rgba(201,164,255,.85)':'rgba(255,138,192,.6)';q.lineWidth=14;q.beginPath();for(let k=0;k<=60;k++){const x=k/60*w,y=(i/9*h+k/60*h*.9)%h;q[k?'lineTo':'moveTo'](x,y)}q.stroke()}});sw.wrapS=sw.wrapT=THREE.RepeatWrapping;
  const fun=add(new THREE.Mesh(new THREE.CylinderGeometry(15,2.4,20,40,1,true),new THREE.MeshBasicMaterial({map:sw,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending})));fun.position.set(cx,30,cz);R.fun=fun;R.swTex=sw;
  const eye=add(new THREE.Mesh(new THREE.SphereGeometry(2.2,20,14),c7Glow(0xf3e6ff,.9)));eye.position.set(cx,20,cz);R.eye=eye;
  // floating islands with crystals
  for(let i=0;i<16;i++){const a=i/16*TAU+R_()*.2,r=31+R_()*13,s=2+R_()*4.5,m=add(new THREE.Mesh(GC.c7rock||(GC.c7rock=new THREE.DodecahedronGeometry(1,0)),mt(0x2e2438,.9)));m.scale.set(s,s*.6,s*.9);m.position.set(cx+Math.cos(a)*r,2+R_()*15,cz+Math.sin(a)*r);m.rotation.set(R_(),R_()*TAU,R_());
    for(let k=0;k<3;k++){const c=new THREE.Mesh(GC.c7cr||(GC.c7cr=new THREE.ConeGeometry(.35,1.6,5)),c7Glow(k%2?0xff8ac0:0xb07aff,.8));c.position.set((R_()-.5)*.9,.75,(R_()-.5)*.9);c.scale.setScalar(.5+R_()*.6);c.userData.noMerge=1;m.add(c)}R.rocks.push({m,y:m.position.y,ph:R_()*TAU})}
  // obelisks around the arena, the portal arch at the north edge
  for(let i=0;i<6;i++){const a=i/6*TAU+PI/6,x=cx+Math.cos(a)*22.5,z=cz+Math.sin(a)*22.5,o=add(new THREE.Mesh(GC.c7ob||(GC.c7ob=new THREE.BoxGeometry(1.1,7,1.1)),mt(0x1f1828,.6,.2)));o.position.set(x,3.5,z);o.rotation.y=-a;
    const st=new THREE.Mesh(GC.c7obs||(GC.c7obs=new THREE.BoxGeometry(.2,5.6,1.14)),c7Glow(0xb07aff,.9));st.position.set(0,0,0);st.userData.noMerge=1;o.add(st);const tip=new THREE.Mesh(GC.c7obt||(GC.c7obt=new THREE.OctahedronGeometry(.6)),c7Glow(0xf3e6ff,.9));tip.position.y=4.4;tip.userData.noMerge=1;o.add(tip);R.obel.push(tip);markR(x-.6,z-.6,x+.6,z+.6,7)}
  const arch=add(new THREE.Mesh(new THREE.TorusGeometry(4.2,.45,10,40),mt(0x2a2038,.6,.3)));arch.position.set(cx,4.4,I.z0+5);const pv=add(new THREE.Mesh(new THREE.CircleGeometry(3.8,40),new THREE.MeshBasicMaterial({map:sw,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})));pv.position.set(cx,4.4,I.z0+5);R.portal=pv;
  // party debris caught in the vortex: cups, kegs, chairs, a couch, the disco ball
  const dk=[[GC.c7cup||(GC.c7cup=new THREE.CylinderGeometry(.045,.035,.12,8)),0xc8202e,6],[GC.c7keg||(GC.c7keg=new THREE.CylinderGeometry(.24,.24,.6,14)),0xbfc4cc,1.4],[bgeo(.5,.06,.5),0x4a3626,1.8],[bgeo(2,.7,.8),0x4a3a5a,1],[GC.c7ball||(GC.c7ball=new THREE.IcosahedronGeometry(.5,1)),0xdadae6,1.2]];
  for(let i=0;i<26;i++){const[geo,c,s]=dk[i%dk.length],m=add(new THREE.Mesh(geo,mt(c,.5,c===0xdadae6?1:.2)));m.scale.setScalar(s);R.deb.push({m,a:R_()*TAU,r:24+R_()*6,y:2.5+R_()*9,sp:(.05+R_()*.08)*(i%2?1:-1),spin:[R_()*2,R_()*2,R_()*2]})}
  C7.nx=R;ZN.c7nexus=[I.x0+3,I.z0+3,I.x1-3,I.z1-3];return I}
function c7NexusUpd(dt){const R=C7.nx;if(!R||P.inside!=='c7nexus')return;R.t+=dt;R.dome.material.uniforms.t.value=R.t;R.fun.rotation.y+=dt*.6;R.swTex.offset.y-=dt*.25;R.eye.scale.setScalar(1+Math.sin(R.t*3)*.08);R.portal.rotation.z-=dt*.8;
  for(const r of R.rocks){r.m.position.y=r.y+Math.sin(R.t*.6+r.ph)*.6;r.m.rotation.y+=dt*.05}for(const d of R.deb){d.a+=d.sp*dt;d.m.position.set(R.cx+Math.cos(d.a)*d.r,d.y+Math.sin(R.t+d.a*3)*.5,R.cz+Math.sin(d.a)*d.r);d.m.rotation.x+=d.spin[0]*dt;d.m.rotation.y+=d.spin[1]*dt;d.m.rotation.z+=d.spin[2]*dt}
  R.obel.forEach((o,i)=>{o.rotation.y+=dt*1.5;o.scale.setScalar(1+Math.sin(R.t*2+i)*.15)});
  if((R.bt=(R.bt||2)-dt)<0){R.bt=1.5+rnd()*3;const a=rnd()*TAU,r=34+rnd()*10;c7Bolt(R.cx+Math.cos(a)*r,R.cz+Math.sin(a)*r,{y0:30,y1:rnd()*6,col:rnd()<.5?0xc9a4ff:0xff8ac0})}
  for(const C of C7.crowds)if(C.nx)c1CrowdUpd(C,TT);if(C7.nxB)C7.nxB.rotation.y+=dt*.02}
// the whole party, floating frozen in bubbles around the arena
function c7NexusCrowd(on){for(let i=C7.crowds.length-1;i>=0;i--)if(C7.crowds[i].nx){sc.remove(C7.crowds[i].g);C7.crowds.splice(i,1)}if(C7.nxB){sc.remove(C7.nxB);C7.nxB=null}if(!on||!C7.nx)return;const R=C7.nx,spots=[];
  for(let i=0;i<34;i++){const a=i/34*TAU+rnd()*.1,r=24.5+rnd()*3.5;spots.push([R.cx+Math.cos(a)*r,R.cz+Math.sin(a)*r,a+PI*1.5])}
  const C=c1Crowd(spots,{k:'c7nx',SH:[0x5b2a86,0xff8ac0,0x1a1a1c,0xf2f2ee,0x2a3a8a,0x1b2e57],PA:[0x1d1f24,0x3a3a40,0xf2f2ee],fem:.45});C.nx=1;C.data.forEach(d=>{d.y=1.4+rnd()*3.2;d.amp=.05;d.sp=1.4});sc.add(C.g);C7.crowds.push(C);
  const B_=new THREE.InstancedMesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),new THREE.MeshBasicMaterial({color:0xc9a4ff,transparent:true,opacity:.16,depthWrite:false}),spots.length),o=new THREE.Object3D();C.data.forEach((d,i)=>{o.position.set(d.x,d.y+.9,d.z);o.scale.setScalar(1.25);o.updateMatrix();B_.setMatrixAt(i,o.matrix)});B_.frustumCulled=false;B_.userData.noMerge=1;sc.add(B_);C7.nxB=B_}

// ---------------------------------------------------------------- special steps: sneak past Vincent, keep up with the wizard, escort Grant and Derek
// sneak: Vincent walks his rounds; reach the goal without being in his sight cone (range shrinks with the costume and with C held)
function c7SneakStep(cfg){return{t:'cond',lab:()=>{const T=C7.sneak;return cfg.label+(T?` · ${T.seen?'he saw you, back to the gate':'stay out of Vincent\'s sight'} · hold C to crouch`:'')},ok:()=>!!(C7.sneak&&C7.sneak.done),goal:()=>cfg.to,
  start:()=>{c4Off('c7sn');if(cfg.pre)cfg.pre();const v=c7Vin(...C7VPATH[0],0,{tag:'c7sn',v:2.1});C7.sneak={v,i:1,done:0,from:cfg.from,cd:0};toast(cfg.tip||'Vincent is walking the party. Don\'t let him see you.',4200)},
  tick:dt=>{const T=C7.sneak;if(!T||T.done)return;const v=T.v;if(!c4Live(v)){T.done=1;return}if(C4.auto){P.x=cfg.to[0];P.z=cfg.to[1];P.y=terrH(P.x,P.z)}
    const w=C7VPATH[T.i%C7VPATH.length];c4To(v,w[0],w[1],2.1);if(Math.hypot(v.x-w[0],v.z-w[1])<.5)T.i++;
    const dx=P.x-v.x,dz=P.z-v.z,d=Math.hypot(dx,dz),crouch=K.KeyC||toggles.KeyC,rng=(PM.userData.c7cos?6.5:10)*(crouch?.6:1),ang=c6AngD(v.pup.face,Math.atan2(dx,dz));
    c1Hud(`VINCENT · ${Math.round(d)} m`+(d<rng*1.4&&ang<1.1?' · CAREFUL':'')+(crouch?' · crouched':'')+(PM.userData.c7cos?' · in costume':''));T.cd-=dt;
    if(T.cd<=0&&d<rng&&ang<.95){T.cd=2.2;T.seen=1;c7Bub(v,pick(['Danny? Is that you?','Hey! You weren\'t on the list.','…Danny Kowalski?']),2.4);sfx('bad');fadeTo(()=>{P.x=T.from[0];P.z=T.from[1];P.y=terrH(P.x,P.z)});toast('Vincent almost saw you. Wait for him to turn away.',3000);setTimeout(()=>{if(C7.sneak)C7.sneak.seen=0},2400)}
    if(Math.hypot(P.x-cfg.to[0],P.z-cfg.to[1])<(cfg.r||3)){T.done=1;c1Hud(null)}},done:()=>{c1Hud(null);c4Off('c7sn');C7.sneak=null}}}
// track: stay within r of the wizard while he walks the party, for secs seconds
function c7TrackStep(cfg){return{t:'cond',lab:()=>{const T=C7.track;return cfg.label+(T?` · ${Math.min(100,Math.round(T.k/cfg.secs*100))}%`+(T.far>0?' · you\'re falling behind':''):'')},ok:()=>!!(C7.track&&C7.track.done),goal:()=>{const T=C7.track;return T&&c4Live(T.w)?[T.w.x,T.w.z]:C7WPATH[0]},
  start:()=>{const r=cfg.mk();C7.track={w:r.w,d:r.d,i:1,k:0,far:0,done:0,lt:0}},
  tick:dt=>{const T=C7.track;if(!T||T.done)return;const w=T.w;if(!c4Live(w)){T.done=1;return}const p=C7WPATH[T.i%C7WPATH.length];c4To(w,p[0],p[1],1.6);if(Math.hypot(w.x-p[0],w.z-p[1])<.5){T.i++;if(cfg.lines&&T.i%2===0)c7Bub(w,pick(cfg.lines),2.8)}
    const d=Math.hypot(P.x-w.x,P.z-w.z);if(C4.auto)T.k=cfg.secs;if(d<(cfg.r||9)){T.k+=dt;T.far=0}else{T.far+=dt;if(T.far>6){T.k=Math.max(0,T.k-dt*2)}}c1Hud(`KEEP TRACK OF THE WIZARD · ${Math.round(d)} m · ${Math.min(100,Math.round(T.k/cfg.secs*100))}%`);if(T.k>=cfg.secs){T.done=1;c1Hud(null)}},done:()=>{c1Hud(null);C7.track=null}}}
// escort: the people in list follow Danny to the goal
function c7EscortStep(cfg){return{t:'cond',lab:()=>cfg.label,ok:()=>{const E=C7.esc;if(!E)return false;const near=Math.hypot(P.x-cfg.to[0],P.z-cfg.to[1])<(cfg.r||4);return near&&E.fol.every(n=>!c4Live(n)||Math.hypot(n.x-P.x,n.z-P.z)<6)},goal:()=>P.inside?null:cfg.to,
  start:()=>{const fol=cfg.mk();C7.esc={fol}},tick:dt=>{const E=C7.esc;if(!E)return;if(C4.auto&&!P.inside){P.x=cfg.to[0];P.z=cfg.to[1];P.y=terrH(P.x,P.z)}
    E.fol.forEach((n,i)=>{if(!c4Live(n)||!n.pup)return;const d=Math.hypot(P.x-n.x,P.z-n.z),bx=P.x-Math.sin(P.face+(i?.7:-.7))*1.8,bz=P.z-Math.cos(P.face+(i?.7:-.7))*1.8;if(d>2.4)c4To(n,bx,bz,Math.min(7,2+d));if(d>30){n.x=bx;n.z=bz}});
    if((E.ct=(E.ct||5)-dt)<0){E.ct=7+rnd()*4;const n=pick(E.fol);if(c4Live(n)&&cfg.lines)c7Bub(n,pick(cfg.lines),3)}},done:()=>{C7.esc=null}}}

// ---------------------------------------------------------------- the boss: Merlin the Magnificent, four phases
const C7PH=[null,{n:'THE SHOWMAN',hi:1,lo:.7},{n:'THE TRANSFORMATION',hi:.7,lo:.4},{n:'THE MAGNIFICENT',hi:.4,lo:.15},{n:'THE FINAL SPELL',hi:.15,lo:0}];
function c7BossBar(on,name,f,sub){let e=$('c7boss');if(!on){if(e)e.remove();return}if(!e){e=document.createElement('div');e.id='c7boss';e.style.cssText='position:fixed;left:50%;top:4.5%;transform:translateX(-50%);z-index:32;width:min(640px,88vw);pointer-events:none;font:800 15px Archivo,Arial,sans-serif;color:#f3e6ff;text-align:center;text-shadow:0 1px 3px #000;letter-spacing:.06em';
    e.innerHTML='<div id="c7bn"></div><div style="height:14px;margin-top:5px;border-radius:8px;background:#1a1024;border:1px solid #b07aff;overflow:hidden;box-shadow:0 0 14px #7a2aa888"><div id="c7bf" style="height:100%;width:100%;background:linear-gradient(90deg,#7a2aa8,#c9a4ff,#ff8ac0);transition:width .2s"></div></div><div id="c7bs" style="margin-top:5px;font:700 13px Archivo,Arial,sans-serif;color:#e2b64c;letter-spacing:.03em"></div>';document.body.appendChild(e)}
  $('c7bn').textContent=name||'';$('c7bf').style.width=Math.max(0,Math.min(1,f||0))*100+'%';$('c7bs').textContent=sub||''}
function c7Hurt(d,src){if(P.roll>0||P.jy>.55){dmgNum(P.x,2.5,P.z,'DODGE','#7fd8ff');return 0}S.hp-=d;P.hurt=.45;try{flinch(PM)}catch(e){}sfx('hit');try{voxOuch()}catch(e){}dmgNum(P.x,2.5,P.z,'-'+d,'#d89aff');if(src){const dx=P.x-src[0],dz=P.z-src[1],l=Math.hypot(dx,dz)||1;P.vx+=dx/l*5;P.vz+=dz/l*5}return 1}
function c7Imp(x,z){const n=c4Person('townies',x,z,rnd()*TAU,{tag:'c7imp',int:'c7nexus',name:pick(['Cup Imp','Keg Goblin','Chair Fiend','Couch Gremlin']),title:'Transformed party prop',lvl:Math.max(1,S.lvl-1),lvAbs:1,scale:.62,shirt:0x7a2aa8,sleeve:0x7a2aa8,pants:0x3a1a4a,skin:0x8ad04a,hair:0x2a1440});
  n.foe=1;n.aggro=1;n.tgt='P';n.mode='wander';n.hp=n.mhp=28;const h=n.g&&n.g.P&&n.g.P.head;if(h){const c=new THREE.Mesh(GC.c7cupH||(GC.c7cupH=new THREE.CylinderGeometry(.2,.15,.36,12)),mt(0xc8202e,.5));c.position.set(0,.36,0);c.userData.noMerge=1;h.add(c)}c6Poof(x,1,z,0xb4e0a0);return n}
function c7Clone(B_,x,z,life){const c=c7Merlin(x,z,0,{tag:'c7clone',int:'c7nexus',title:'Merlin the Magnificent?'});c.actor=0;c.hp=c.mhp=9999;c.lvl=Math.max(1,S.lvl);c.c7life=life||0;c6Poof(x,1.2,z,0xc9a4ff);B_.clones.push(c);return c}
function c7Duck(on){const B_=C7.boss;if(on){if(!B_.duckM){const g=new THREE.Group(),Y=mt(0xffd23a,.5);const b=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),Y);b.scale.set(.45,.32,.55);b.position.y=.32;g.add(b);const h=new THREE.Mesh(GC.c3puff,Y);h.scale.setScalar(.24);h.position.set(0,.72,.22);g.add(h);const bk=new THREE.Mesh(bgeo(.16,.05,.16),mt(0xff8a2a,.5));bk.position.set(0,.68,.46);g.add(bk);for(const s of[-1,1]){const e=new THREE.Mesh(GC.c6sp||(GC.c6sp=new THREE.SphereGeometry(.05,6,4)),bm(0x111111));e.position.set(s*.09,.78,.4);g.add(e)}g.traverse(o=>o.userData.noMerge=1);sc.add(g);B_.duckM=g}
    B_.duckM.visible=true;PM.visible=false;c6Poof(P.x,1,P.z,0xffe27a);tone(1400,.12,'square',.05);tone(1800,.1,'square',.04,.1);c1Sub('Danny','(…I\'m a rubber duck.)')}else{if(B_&&B_.duckM)B_.duckM.visible=false;PM.visible=true;c6Poof(P.x,1,P.z,0xffe27a);c1Sub(null)}}
function c7BossStart(){const I=INT.c7nexus;if(!I)return;if(P.inside!=='c7nexus')goIn('c7nexus',30,46);c7NexusCrowd(1);c4Off('c7boss');c4Off('c7clone');c4Off('c7imp');const cx=I.x0+30,cz=I.z0+30;
  const m=c7Merlin(cx,cz-6,0,{tag:'c7boss',int:'c7nexus'});m.actor=0;m.hp=m.mhp=9999;m.lvl=Math.max(1,S.lvl);m.pup.v=5;
  const crys=[0,1,2].map(i=>{const a=-PI/2+i*TAU/3,x=cx+Math.cos(a)*15,z=cz+Math.sin(a)*15,c=new THREE.Mesh(GC.c7cry||(GC.c7cry=new THREE.OctahedronGeometry(.8)),c7Glow(0xff8ac0,.85));c.scale.set(1,1.8,1);c.position.set(x,1.6,z);c.visible=false;c.userData.noMerge=1;sc.add(c);return{c,x,z,on:0}});
  const alt=[0,1,2].map(i=>{const a=PI/2+i*TAU/3,x=cx+Math.cos(a)*9,z=cz+Math.sin(a)*9,g=new THREE.Group();g.position.set(x,0,z);g.userData.noMerge=1;const p=new THREE.Mesh(bgeo(1,1,1),mt(0x3a2a4a,.6));p.position.y=.5;g.add(p);const ic=new THREE.Mesh(GC.c7obt||(GC.c7obt=new THREE.OctahedronGeometry(.6)),c7Glow([0xe2b64c,0xb04aff,0x7ad8ff][i],.9));ic.position.y=1.6;ic.scale.setScalar(.6);g.add(ic);g.visible=false;sc.add(g);return{g,ic,x,z}});
  const sh=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),new THREE.MeshBasicMaterial({color:0xc9a4ff,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending}));sh.scale.setScalar(1.7);sh.visible=false;sh.userData.noMerge=1;sc.add(sh);
  C7.boss={m,cx,cz,hp:440,mhp:440,ph:1,next:2.4,blink:6,clones:[],imps:[],crys,alt,sh,orbs:[],fin:null,duck:0,done:0,said:{},near:0};c7BossBar(1,'MERLIN THE MAGNIFICENT',1,'PHASE 1 · THE SHOWMAN');if(S.hp<S.mhp*.85)S.hp=Math.round(S.mhp*.85)}
function c7BossEnd(){const B_=C7.boss;C7.boss=null;c7BossBar(0);c1Hud(null);if(!B_)return;for(const c of B_.crys)sc.remove(c.c);for(const a of B_.alt)sc.remove(a.g);sc.remove(B_.sh);for(const o of B_.orbs)sc.remove(o.m);if(B_.duckM){sc.remove(B_.duckM)}PM.visible=true;if(B_.fin&&B_.fin.orb)sc.remove(B_.fin.orb);c4Off('c7clone');c4Off('c7imp')}
const c7Arena=(B_,r)=>{const a=rnd()*TAU,d=(r||6)+rnd()*6;return[B_.cx+Math.cos(a)*d,B_.cz+Math.sin(a)*d]};
function c7Blink(B_,x,z){const m=B_.m;c6Poof(m.x,1.2,m.z,0xc9a4ff);c6Spark(m.x,1.4,m.z,0xb07aff,10);m.x=x;m.z=z;m.pup.tx=x;m.pup.tz=z;c6Poof(x,1.2,z,0xc9a4ff)}
function c7Phase(B_,ph){B_.ph=ph;B_.next=2.2;const m=B_.m,L=C7PH[ph];big('PHASE '+ph+' · '+L.n,1800);sfx('ok');
  if(ph===2){c7Say(m,'You hit me. ME. Fine, let\'s make the furniture INTERESTING.',3);for(let i=0;i<3;i++){const[x,z]=c7Arena(B_,9);B_.imps.push(c7Imp(x,z))}}
  if(ph===3){c7Say(m,'Enough. You want MAGNIFICENT? I will SHOW you magnificent.',3);for(const c of B_.crys){c.on=1;c.c.visible=true}for(let i=0;i<2;i++){const[x,z]=c7Arena(B_,7);c7Clone(B_,x,z,0)}toast('A barrier! Smash the three rune crystals at the edge of the arena.',4200)}
  if(ph===4){c7Say(m,'Ladies and gentlemen… THE GRAND FINALE!',3);c4Off('c7clone');B_.clones=[];c7Blink(B_,B_.cx,B_.cz);const orb=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),c7Glow(0xf3e6ff,.85));orb.position.set(B_.cx,7.5,B_.cz);orb.scale.setScalar(.5);orb.userData.noMerge=1;sc.add(orb);
    B_.fin={t:28,step:0,orb,done:0};for(const a of B_.alt)a.g.visible=true;toast('Use what you took from him: the torn pages, the purple punch, his own staff. Hurry.',5200)}}
function c7Attack(B_){const m=B_.m,ph=B_.ph;m.pup.st='throw';setTimeout(()=>{if(c4Live(m)&&m.pup)m.pup.st=''},700);
  const kind=ph===1?pick(['bolts','bolts','ring','illusion']):ph===2?pick(['bolts','ring','duck','bolts']):ph===3?pick(['bolts','orbs','ring','bolts']):'bolts';const strong=ph>=3;
  if(kind==='bolts'){const n=ph===4?2:strong?6:3+ph;for(let i=0;i<n;i++){const x=P.x+(i?(rnd()-.5)*7:0),z=P.z+(i?(rnd()-.5)*7:0);c6Beam(c6Orb(m),[x,4,z],0xb07aff,.4);c7Mark(x,z,1.5,strong?.8:1.05,()=>{c7Bolt(x,z,{y1:0});if(Math.hypot(P.x-x,P.z-z)<1.6)c7Hurt(strong?15:12,[x,z])})}if(!B_.said.b){B_.said.b=1;c7Say(m,'Purple LIGHTNING! The crowd goes WILD!',2.6)}}
  if(kind==='ring'){let hit=0;c7Wave(m.x,m.z,17,1.5,0xff8ac0,r=>{if(!hit&&Math.abs(Math.hypot(P.x-m.x,P.z-m.z)-r)<.6){hit=1;c7Hurt(strong?14:10,[m.x,m.z])}});if(!B_.said.r){B_.said.r=1;toast('Jump (Space) over the shockwave!',2600)}}
  if(kind==='illusion'){for(let i=0;i<2;i++){const[x,z]=c7Arena(B_,5);c7Clone(B_,x,z,6)}c7Say(m,'Which one is the REAL Merlin? (It\'s me. I\'m the real one.)',3)}
  if(kind==='duck'&&!B_.duck){c6Beam(c6Orb(m),[P.x,1,P.z],0xffe27a,.6);B_.duck=3.4;c7Duck(1);c7Say(m,'Behold! A pledge… into a DUCK!',2.6)}
  if(kind==='orbs'){for(let i=0;i<3;i++){const o=new THREE.Mesh(GC.c6orb||(GC.c6orb=new THREE.SphereGeometry(.09,12,8)),c7Glow(0xff8ac0,.95));o.scale.setScalar(3.4);const[ox,oy,oz]=c6Orb(m);o.position.set(ox+(i-1)*.6,oy,oz);o.userData.noMerge=1;sc.add(o);B_.orbs.push({m:o,t:4.2})}}}
function c7BossTick(dt){const B_=C7.boss;if(!B_||B_.done)return;const m=B_.m;if(!c4Live(m)){B_.done=1;return}const f=B_.hp/B_.mhp,L=C7PH[B_.ph];
  // damage: every hit on Merlin's puppet is moved into the boss pool (blocked while a barrier is up)
  if(m.hp<m.mhp){const d=m.mhp-m.hp;m.hp=m.mhp;m.down=0;m.aggro=0;m.tgt=null;const shielded=(B_.ph===2&&B_.imps.filter(n=>c4Live(n)&&!n.down).length>=2)||(B_.ph===3&&B_.crys.some(c=>c.on))||(B_.ph===4&&!(B_.fin&&B_.fin.done));
    if(shielded){dmgNum(m.x,3,m.z,'BARRIER','#c9a4ff');c6Spark(m.x,1.5,m.z,0xc9a4ff,6)}else{B_.hp=Math.max(B_.ph<4?B_.mhp*L.lo:0,B_.hp-d);if(rnd()<.25)c7Say(m,pick(['OW! My robe!','That was a cheap shot!','Not the BEARD!','I am FOUR HUNDRED YEARS OLD!']),1.6)}}
  m.aggro=0;m.tgt=null;m.down=0;
  if(C4.auto){if(!(B_.ph===4&&!(B_.fin&&B_.fin.done)))B_.hp=Math.max(B_.ph<4?B_.mhp*L.lo-1:0,B_.hp-dt*140);for(const n of B_.imps)if(c4Live(n))despawn(n);for(const c of B_.crys)if(c.on){c.on=0;c.c.visible=false}if(B_.ph===4&&B_.fin&&!B_.fin.done&&(B_.fin.at=(B_.fin.at||0)+dt)>.6){B_.fin.at=0;c7FinStep(B_)}}
  // phase changes
  if(B_.ph<4&&B_.hp<=B_.mhp*L.lo+.5)c7Phase(B_,B_.ph+1);
  // shields and barrier visuals
  const shield=(B_.ph===2&&B_.imps.filter(n=>c4Live(n)&&!n.down).length>=2)||(B_.ph===3&&B_.crys.some(c=>c.on))||(B_.ph===4&&!(B_.fin&&B_.fin.done));B_.sh.visible=shield;B_.sh.position.set(m.x,(m.pup.y||0)+1.2,m.z);B_.sh.scale.setScalar(1.7+Math.sin(TT*6)*.06);
  for(const c of B_.crys)if(c.on){c.c.rotation.y+=dt*2;c.c.position.y=1.6+Math.sin(TT*3+c.x)*.2}
  // imps: tidy up the beaten ones, more furniture comes alive while phase 2 lasts
  for(const n of B_.imps)if(c4Live(n)&&n.down&&!n.c7g){n.c7g=1;setTimeout(()=>{if(c4Live(n)){c6Poof(n.x,.8,n.z,0xb4e0a0);despawn(n)}},700)}B_.imps=B_.imps.filter(c4Live);
  if(B_.ph===2&&B_.imps.length===0&&(B_.it=(B_.it||0)+dt)>9){B_.it=0;for(let i=0;i<2;i++){const[x,z]=c7Arena(B_,9);B_.imps.push(c7Imp(x,z))}}
  // clones: a hit pops them; illusions time out
  for(const c of B_.clones){if(!c4Live(c))continue;if(c.hp<c.mhp||(c.c7life&&(c.c7life-=dt)<=0)){const hit=c.hp<c.mhp;c7Confetti(c.x,2,c.z,120,3);c6Poof(c.x,1.2,c.z,0xc9a4ff);despawn(c);if(hit)dmgNum(c.x,2.8,c.z,'WRONG MERLIN!','#ff8ac0')}else{c.pup.look=[P.x,P.z];if(rnd()<dt*.25){const[x,z]=c7Arena(B_,6);c4To(c,x,z,4)}}}B_.clones=B_.clones.filter(c4Live);
  // homing orbs
  for(const o of B_.orbs){o.t-=dt;const p=o.m.position,dx=P.x-p.x,dy=1.2-p.y,dz=P.z-p.z,l=Math.hypot(dx,dy,dz)||1;p.x+=dx/l*5.2*dt;p.y+=dy/l*5.2*dt;p.z+=dz/l*5.2*dt;if(l<.8){o.t=0;c7Hurt(13,[p.x,p.z]);c6Spark(p.x,p.y,p.z,0xff8ac0,10)}if(o.t<=0)sc.remove(o.m)}B_.orbs=B_.orbs.filter(o=>o.t>0);
  // the duck
  if(B_.duck>0){B_.duck-=dt;P.pcd=Math.max(P.pcd||0,.3);if(B_.duckM)B_.duckM.position.set(P.x,P.y||0,P.z),B_.duckM.rotation.y=P.face;if(B_.duck<=0)c7Duck(0)}
  // the final spell
  if(B_.ph===4&&B_.fin){const F=B_.fin;if(!F.done){F.t-=dt;m.pup.y=Math.min(3,(m.pup.y||0)+dt*1.5);m.pup.look=[P.x,P.z];m.pup.st='throw';const k=1-F.t/28;F.orb.scale.setScalar(.5+k*3.6-F.step*.7);F.orb.position.y=7.5+Math.sin(TT*4)*.2;if(rnd()<dt*3)c6Beam(c6Orb(m),[F.orb.position.x,F.orb.position.y,F.orb.position.z],0xf3e6ff,.25);
      B_.alt.forEach((a,i)=>{a.ic.visible=i===F.step;a.ic.rotation.y+=dt*2;a.ic.position.y=1.6+Math.sin(TT*3)*.15});
      c7BossBar(1,'MERLIN THE MAGNIFICENT',f,`THE GRAND FINALE IN ${Math.ceil(Math.max(0,F.t))}s · ${['read the torn pages at the gold altar','pour the purple punch at the purple altar','break the spell with his staff at the blue altar'][F.step]}`);
      if((F.bt=(F.bt||3)-dt)<0){F.bt=3.4;c7Attack(B_)}
      if(F.t<=0){c7Flash(420);c6Poof(P.x,1,P.z,0xffffff);S.hp=Math.max(1,Math.round(S.mhp*.35));c7Hurt(0);F.t=28;c7Say(m,'The crowd LOVES an encore! Again!',2.6);toast('The spell went off. Faster this time.',2600)}}
    else{if(F.lie==null){F.lie=0;m.pup.y=0}F.lie=Math.min(1,F.lie+dt*2);m.pup.lie=F.lie;m.pup.st='';c7BossBar(1,'MERLIN THE MAGNIFICENT',f,'HE\'S DOWN · FINISH THE WIZARD');if(B_.hp<=0){B_.done=1;c7Duck(0);c7BossBar(0);c1Hud(null);big('MERLIN THE MAGNIFICENT · DEFEATED',2600);sfx('ok');c7Confetti(m.x,3,m.z,500,8)}}}
  if(B_.ph<4||!B_.fin)c7BossBar(1,'MERLIN THE MAGNIFICENT',f,'PHASE '+B_.ph+' · '+L.n+(B_.ph===3&&B_.crys.some(c=>c.on)?` · CRYSTALS LEFT ${B_.crys.filter(c=>c.on).length}`:'')+(B_.ph===2&&B_.imps.length>=2?' · BEAT THE TRANSFORMED FURNITURE':''));
  if(B_.ph===4&&B_.fin&&B_.fin.done)return;
  // movement: face Danny, drift, blink away when crowded
  if(B_.ph<4){m.pup.look=[P.x,P.z];const d=Math.hypot(P.x-m.x,P.z-m.z);if(d<1.8)B_.near+=dt;else B_.near=Math.max(0,B_.near-dt);B_.blink-=dt;if(B_.blink<=0||(B_.ph>=3&&B_.near>1.6)){B_.blink=B_.ph===1?7:5;B_.near=0;const[x,z]=c7Arena(B_,6);c7Blink(B_,x,z)}else if(rnd()<dt*.4){const[x,z]=c7Arena(B_,5);c4To(m,x,z,2.4)}}
  B_.next-=dt;if(B_.next<=0&&B_.ph<4){B_.next=(B_.ph===1?3:B_.ph===2?2.6:2.1)+rnd()*.8;c7Attack(B_)}
  // the floor: Merlin will not let you die in front of his audience
  if(S.hp<S.mhp*.2){S.hp=Math.round(S.mhp*.6);c7Flash(240,'#c9a4ff');B_.hp=Math.min(B_.mhp*L.hi,B_.hp+B_.mhp*.05);c7Say(m,'Up, UP! The audience paid for a SHOW!',2.6);fadeTo(()=>{const[x,z]=c7Arena(B_,12);P.x=x;P.z=z})}}
// the final spell: the three things Danny took from him, in order
function c7FinStep(B_){const F=B_.fin;if(!F||F.done)return;const a=B_.alt[F.step],m=B_.m,op=[F.orb.position.x,F.orb.position.y,F.orb.position.z];
  c6Beam([a.x,1.6,a.z],op,[0xe2b64c,0xb04aff,0x7ad8ff][F.step],.9);c6Spark(op[0],op[1],op[2],0xffffff,24);c7Flash(160,'#e6d2ff');
  c7Bub(DANNY,['"MUSICA… REVERSO… KEGGERUS!" (It\'s on the page. I\'m reading what\'s on the page.)','A whole cup of your own purple punch. Right in the rune.','Hey Merlin. Looking for this?'][F.step],3);
  c7Bub(m,['NO! Who taught you to read Old Latin?!','That was a LIMITED EDITION punch!','My STAFF! Give that BACK!'][F.step],2.6);F.step++;F.t=Math.min(28,F.t+6);
  if(F.step>=3){F.done=1;const o=F.orb;let t=0;c5Anim(dt=>{t+=dt;o.scale.setScalar(Math.max(.01,(1-t*2)*3));if(t>.5){sc.remove(o);return 1}});c7Flash(500);c7Bolt(B_.cx,B_.cz,{y0:20,y1:0,col:0xffffff});B_.hp=Math.min(B_.hp,B_.mhp*.15);for(const x of B_.alt)x.g.visible=false;big('THE SPELL BREAKS',1800);setTimeout(()=>big('FINISH THE WIZARD',1600),1900)}}
function c7BossStep(){return{t:'cond',lab:()=>{const B_=C7.boss;return'Defeat Merlin the Magnificent'+(B_?` · phase ${B_.ph} of 4: ${C7PH[B_.ph].n.toLowerCase()}`:'')},ok:()=>!!(C7.boss&&C7.boss.done),goal:()=>{const B_=C7.boss;if(!B_)return null;if(B_.ph===3){const c=B_.crys.find(c=>c.on);if(c)return[c.x,c.z]}if(B_.ph===4&&B_.fin&&!B_.fin.done){const a=B_.alt[B_.fin.step];return[a.x,a.z]}return[B_.m.x,B_.m.z]},
  start:()=>c7BossStart(),tick:dt=>c7BossTick(dt),done:()=>{}}}

// ---------------------------------------------------------------- hooks
function c7Prompts(add){if(!AM||!C7IDS.includes(AM.m.id))return;const st=curStep();
  if(st&&st.c5items){const d=c5S().d;for(const it of st.c5items){if(d[it.k]||it.busy||(it.need&&!it.need()))continue;const p=c5At(it.at());if(!p||(p.int||null)!==(P.inside||null))continue;add(p.x,p.z,it.r||2.5,it.act,()=>c5Do(it),0)}}
  const B_=C7.boss;if(B_&&!B_.done&&P.inside==='c7nexus'){if(B_.ph===3)for(const c of B_.crys)if(c.on)add(c.x,c.z,2.6,'Smash the rune crystal',()=>{c.on=0;c.c.visible=false;c6Poof(c.x,1.6,c.z,0xff8ac0);c6Spark(c.x,1.6,c.z,0xff8ac0,24);noise(.3,.2,2600);sfx('ok');if(!B_.crys.some(c=>c.on)){big('THE BARRIER FALLS',1400);c7Say(B_.m,'My crystals! Do you know what those COST?',2.4)}},0);
    if(B_.ph===4&&B_.fin&&!B_.fin.done){const a=B_.alt[B_.fin.step];add(a.x,a.z,2.4,['Read the torn pages aloud','Pour the purple punch into the rune','Point his staff at the spell'][B_.fin.step],()=>c7FinStep(B_),0)}}}
function c7CleanAll(){c7Party(0);c7BossEnd();c7NexusCrowd(0);for(const k of['c7stage','c7pre','c7mem','c7box','c7flyer','c7tr','c7tr2','c7tr3','c7vroom'])c4Group(k,0);for(const k in C4.props)if(/^c7/.test(k))c4Group(k,0);c4Off('c7');c4Off('c7wiz');c4Off('c7sn');c4Off('c7pty');
  if(C6.leash){sc.remove(C6.leash.line);C6.leash=null}if(C7.lb)C7.lb.visible=false;c7FrogOnP(0);c7StaffOnP(0);c7Costume(0);C7.sneak=C7.track=C7.esc=null;for(const b of C7.bubs)b.s.visible=false;C7.bubs=[];if(P.inside==='c7nexus')goOut(...C7DOOR)}
function c7Tick(dt){if(mode==='title'||mode==='loading')return;try{stealthVisIdle()}catch(e){}c7BubUpd(dt);c7LeashGlow();c7PartyUpd(dt);c7NexusUpd(dt);c7FollowUpd();
  if((C7.T-=dt)>0)return;C7.T=1.2;c7Signs(S.ch===7&&!c7Restored());if(S.ch>=7&&C5.ban)c5Banner(0);
  if(S.ch===7&&!c7Restored()){const s6=c6S();if(!s6.ban)s6.ban={};for(const id of['asr','kto','gwz'])s6.ban[id]=1}
  {const gh=S.ch===7&&!(S.c7&&S.c7.grantBack);if(gh){c6GrantHide(1);C7.gh=1}else if(C7.gh){c6GrantHide(0);C7.gh=0}}
  {const want=S.ch===7&&!!(S.c7&&S.c7.party&&!S.c7.partyDone)&&P.inside!=='c7nexus';if(want&&!(C7.pt&&C7.pt.on))c7Party(1);else if(!want&&C7.pt&&C7.pt.on&&!CINE)c7Party(0)}
  if(!CINE&&mode==='play'&&(!AM||!C7IDS.includes(AM.m.id))&&TT-C4.chainT>8&&(C7.boss||C7.sneak||C7.track||C7.esc||C6.leash||PM.userData.c7frog||PM.userData.c7staff||P.inside==='c7nexus'))c7CleanAll()}
function c7Migrate(d){if(!d)return;if(S.ch>=8)for(const id of C7IDS)S.done[id]=1;if(S.ch>=8&&S.c7)S.c7.restored=1;if(S.ch>=8&&!S.c7)S.c7={restored:1};setTimeout(()=>{try{if(!AM||!C7IDS.includes(AM.m.id))c7CleanAll();c7Signs(S.ch===7&&!c7Restored())}catch(e){console.warn('c7Migrate',e)}},10)}
