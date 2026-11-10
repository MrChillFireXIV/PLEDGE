// ================================================================ V163 CHAPTER 10 · RITUAL, part 2: scenes, quests
// Dialogue uses the conversation box: c8Lines([[npc,text],[DANNY,text],[null,narration,secs],wait,fn]) and c8Choose for choices.
const c10Cine=(f,d,o)=>c8Cine(f,d,o);
const c10Cn=f=>({t:'cine',run:d=>c8Cine(f,d)});
const c10Go=(label,dx,dz,o={})=>c9Go(label,()=>c10P(dx,dz),Object.assign({r:2.2},o));
const c10Note=(title,text,btn)=>c9Note(title,text,btn);
function c10Tween(m,p,secs,hop){if(!m)return;const p0=m.position.clone();let t=0;c5Anim(dt=>{t+=dt/(secs||1);const k=Math.min(1,t),e=k*k*(3-2*k);m.position.set(p0.x+(p[0]-p0.x)*e,p0.y+(p[1]-p0.y)*e+Math.sin(k*PI)*(hop==null?.5:hop),p0.z+(p[2]-p0.z)*e);return k>=1})}
function c10Night(){if(S.gt>5.5&&S.gt<21)c4At(23.4)}
// everyone and everything a quest needs, rebuilt after a reload
function c10Setup(n){const S10=c10S();if(P.inside)goOut(...c10X(0,9));c10Night();try{c6GrantHide(1)}catch(e){}c10Base();c10Ring();
  c10Need('grant',0,-7,0);c10Need('carter',-2.4,-6.6,.3);c10Need('logan',2.4,-6.6,-.3);
  for(const[k,dx]of[['ezra',-2.7],['marcus',2.7]]){c10Need(k,dx,2.8,Math.atan2(-dx,-2.8))}
  if(!PM.userData.c10robe)c10Robe(PM,'white');c10WorldFx(1);c10Wins(1);C10.trip=[0,.55,.62,.72,.82,.8,1][n]||.6;
  if(n===1)c10Q1Set();if(n===2)c10Q2Set();if(n===3)c10Chairs(1);if(n===4)c10Haze(1,0);if(n===5){c10Haze(1,1);c10Stones(1)}if(n===6){c10Haze(1,0);c10Stones(1,1)}}

// ---------------------------------------------------------------- chapter 10 opening: the Lantern Walk
CHSCENE[10]=async function(){const fade=$('fade');fade.style.opacity=1;await c4Sl(500);endScene();C1.act=[];C10.open=1;const S10=c10S();try{c6GrantHide(1)}catch(e){}
  if(P.inside)goOut(...c9Front(5,0));if(S.gt<21.5&&S.gt>5)c4At(22.4);c4CamOn();c4Off('c10x');
  // the front lawn of the ASR house: robes, masks, lanterns
  const f=c9FrontFace(),out=f+PI,o={abs:1,int:null,tag:'c10x'};const at=(ff,s)=>c9Front(ff,s);
  const mk=(k,ff,s,a,mask)=>{const[x,z]=at(ff,s);const n=c9Cast(k,x,z,a,o);if(n){n.c9k=null;c10Robe(n.g,k==='ezra'||k==='marcus'?'white':'black',mask);c10HandLan(n.g,1)}return n};
  const gr=mk('grant',2,0,out,0),ca=mk('carter',2.6,-1.6,out,1),lo=mk('logan',2.6,1.6,out,1),ez=mk('ezra',5,-1.6,f,0),mc=mk('marcus',5,1.6,f,0);
  const line=[];for(let i=0;i<8;i++){const[x,z]=at(7+Math.floor(i/2)*2.4,i%2?2.6:-2.6);const n=c4Pup('brothers',x,z,i%2?-PI/2+out:PI/2+out,{tag:'c10x',int:null,name:'A robed brother',title:'ΑΣΡ',lvl:6,house:'asr'});if(n){c10Robe(n.g,'black',1);c10HandLan(n.g,1);line.push(n)}}
  {const[x,z]=at(5,0);c4DanAt(x,z,f)}c10Robe(PM,'white');c10HandLan(PM,1,1);const[sx,sz]=at(15,4),[lx,lz]=at(3,0);c4Shot([sx,terrH(sx,sz)+3.2,sz],[lx,terrH(lx,lz)+1.4,lz],0);
  fade.style.opacity=0;big('CHAPTER 10 · RITUAL',2800);await c4Wt(2.4);
  await c8Lines([[null,'Initiation night. Hell Week is over. The Lantern Walk isn\'t.',3],[null,'Black robes and blank masks for the brothers. White cloaks for the pledges.',3]]);
  {const[a,b]=at(3.2,0);c4Shot([a+1.6,1.75,b+1.2].map((v,i)=>i===1?v+terrH(a,b):v),[gr.x,terrH(gr.x,gr.z)+1.6,gr.z],1.2)}
  await c8Lines([[gr,'Every class since 1952 has walked the lantern to the Lodge. Tonight it\'s yours.'],[gr,'No faces tonight. Only the house.'],()=>{c10Mask(gr.g,1);try{noise(.2,.05,1800)}catch(e){}},1,[ez,'Danny. Did you know it was a walk into the woods?'],[DANNY,'Nobody ever told me what the Lantern Walk was. Nobody tells anybody.'],[mc,'(whispers) That\'s kind of the point, I think.']]);
  // the walk: lanterns down Lake Road, into the trees, to the Lodge
  await c4Fade(async()=>{c4Off('c10x');c10Base();c10Ring();for(let i=0;i<10;i++){const n=c10RingN(i);if(!n)continue;const[x,z]=c10X(-18+i*.9,7+(i%2)*1.2);const tx=n.pup.tx,tz=n.pup.tz;n.x=x;n.z=z;n.pup.tx=x;n.pup.tz=z;n.c10to=[tx,tz]}
    const g2=c10Cast('grant',-15,6,PI/2,{lan:1}),c2=c10Cast('carter',-16,7.6,PI/2,{lan:1}),l2=c10Cast('logan',-16.6,5,PI/2,{lan:1}),e2=c10Cast('ezra',-19,6.4,PI/2,{lan:1}),m2=c10Cast('marcus',-19.4,4.8,PI/2,{lan:1});c10Mask(g2.g,1);
    c4DanAt(...c10X(-18,5.6),PI/2);c4Shot(c10W(-2,2.8,13),c10W(-12,1.2,5),0)});
  for(let i=0;i<10;i++){const n=c10RingN(i);if(n&&n.c10to)c4To(n,...n.c10to,1.5)}c4To(c10K('grant'),...c10X(0,-7),1.5);c4To(c10K('carter'),...c10X(-2.4,-6.6),1.5);c4To(c10K('logan'),...c10X(2.4,-6.6),1.5);
  c4To(c10K('ezra'),...c10X(-2.7,2.8),1.4);c4To(c10K('marcus'),...c10X(2.7,2.8),1.4);c4DanTo(...c10X(0,3.4),1.4);
  await c8Lines([[null,'Fourteen lanterns down Lake Road. Into the trees. To the Lodge.',3]]);c4Shot(c10W(6,3.2,13),c10W(-2,1,2),1);await c4Wt(4.6);
  // the drink
  const ca2=c10K('carter'),lo2=c10K('logan'),g3=c10K('grant'),e3=c10K('ezra'),m3=c10K('marcus');c4Shot(c10W(3.6,1.9,6.4),c10W(0,1.2,0),1.2);await c4Wt(.6);
  await c8Lines([[g3,'Before the oath, the drink. It\'s older than the house.'],[lo2,'Ayahuasca. Drink all of it. Then sit down, before the ground does it for you.'],[g3,'It shows you who you are. When it\'s over, you decide whether you can say the oath and mean it.']]);
  if(ca2)c4To(ca2,...c10X(-.6,2.2),1.2);await c4Wt(1.6);for(const[who,dx]of[[e3,-2.7],[m3,2.7],[null,0]]){const[x,z]=c10X(dx,2.8);if(C10.cup)c10Tween(C10.cup,[x,terrH(x,z)+1.55,z+.1],.8,.3);await c4Wt(1.1);try{tone(150,.3,'sine',.05);noise(.25,.04,600)}catch(e){}await c4Wt(.5)}
  if(C10.cup){const[x,z]=c10X(.9,-.3);c10Tween(C10.cup,[x,terrH(x,z)+1,z],.8,.3)}
  await c8Lines([[m3,'It tastes like dirt and pennies.'],[e3,'Is it supposed to… breathe?']]);
  // the trip begins
  c10WorldFx(1);c10Wins(1);c10TripSet(.35);c4Shot(c10W(0,1.5,8),c10W(-6,3,-13),1.8);await c4Wt(2.4);c10TripSet(.6);c10WinShow(0,'',[[100,1],[170,.55]]);await c4Wt(.8);c10WinShow(3,'',[[128,.55]]);
  await c8Lines([[null,'The trees lean in. The Lodge windows glow one at a time. In every one of them, someone small is waiting.',3.6],[DANNY,'(…Oh. Oh, here it comes.)']]);
  big('PHASE I · THE SELF',2600);await c4Wt(1.6);await c4Fade(async()=>{c4CamOff()});C10.open=0;c5Next('c10boy');saveGame()};

// ================================================================ QUEST 1 · THE BOY BEFORE
const C10Q1={shirt:{dec:[-6,-4.5],real:[-13.2,-11.4],name:'the tiny ΑΣΡ sweatshirt',age:5},helmet:{dec:[3,5.4],real:[8.2,-3.6],name:'the dented football helmet',age:9},letter:{dec:[-5.4,-11.4],real:[-4.4,4.6],name:'the scholarship letter',age:17}};
function c10Q1Mesh(k){const g=new THREE.Group();if(k==='shirt'){c10M(g,bgeo(.36,.3,.06),0x7d1f2c,0,.15,0);const s=signMesh('ΑΣΡ',.2,.08,'#7d1f2c','#e2b64c');s.position.set(0,.18,.035);g.add(s)}
  if(k==='helmet'){const h=c10M(g,new THREE.SphereGeometry(.18,14,10,0,TAU,0,PI*.6),mt(0x2a5aa8,.4,.2),0,.12,0);h.rotation.x=-.3;c10M(g,bgeo(.26,.03,.03),0xdddddd,0,.06,.16)}
  if(k==='letter'){const p=c10M(g,new THREE.PlaneGeometry(.32,.42),mt(0xf4efe0,.9),0,.02,0);p.rotation.x=-PI/2;const s=c10M(g,new THREE.CircleGeometry(.04,14),mt(0xb81a1a,.6),.08,.03,-.12);s.rotation.x=-PI/2}
  const r=c10M(g,new THREE.RingGeometry(.35,.48,24),c10Glow(0xffd27a),0,.03,0);r.rotation.x=-PI/2;g.userData.glow=r;return g}
function c10Q1Set(){const S10=c10S();if(C10.g.q1)return;c10Grp('q1',g=>{C10.ob={};for(const k in C10Q1){const m=c10Q1Mesh(k);g.add(m);C10.ob[k]=m;c10Q1Place(k)}})}
function c10Q1Place(k){const S10=c10S(),m=C10.ob&&C10.ob[k];if(!m)return;const o=C10Q1[k];let x,z;if(S10.on&&S10.on[k]!=null){[x,z]=c10X(-.8+S10.on[k]*.8,0);m.position.set(x,terrH(x,z)+.9,z);return}[x,z]=c10X(...(S10.mv[k]?o.real:o.dec));m.position.set(x,terrH(x,z),z)}
function c10Q1Find(k){return{k:'q10a'+k,l:'Find '+C10Q1[k].name,at:()=>c10P(...(c10S().mv[k]?C10Q1[k].real:C10Q1[k].dec)),act:'Pick it up',run:function(fin){const S10=c10S();
  if(!S10.mv[k]&&!C4.auto){S10.mv[k]=1;this.busy=0;const m=C10.ob[k];if(m){try{c6Poof(m.position.x,m.position.y+.3,m.position.z,0xb89aff);noise(.4,.04,900)}catch(e){}m.visible=false;setTimeout(()=>{c10Q1Place(k);m.visible=true;const p=m.position;try{c6Spark(p.x,p.y+.4,p.z,0xffd27a,8)}catch(e){}},700)}
    toast('It slides out from under your hand. It\'s somewhere else now. Listen for it.',3000);return}
  S10.mv[k]=1;c10Q1Place(k);toast('Got it: '+C10Q1[k].name+'.',2000);fin()}}}
async function c10Q1Open(done){await c10Cine(async()=>{c10Setup(1);const v=c10Voice('Big Ed Kowalski','an echo in the trees',-9,-1);c4DanAt(...c10X(0,3.6),PI);c4Shot(c10W(2.4,1.8,6.4),c10W(-4,1,-4),0);await c4Wt(.6);
  await c8Lines([[null,'Things from home lie in the grass where they can\'t possibly be. A sweatshirt. A helmet. A letter.',3.4],[v,'Danny! DANNY! Come here, I want everybody to see you!'],[DANNY,'(…Dad?)']])},done,{after:()=>c4Off('c10v')})}
const C10MEM={shirt:[[null,'Age five. The Kowalski living room. Big Ed\'s buddies on the couch.',2.8],'ed',[0,'Look at him! FUTURE ALPHA SIGMA RHO! Class of… whatever year it is when he\'s big!'],()=>{try{noise(.8,.12,900)}catch(e){}},[null,'Everybody clapped. Five-year-old Danny decided that clapping meant you were loved.',3.6]],
  helmet:[[null,'Age nine. A muddy field, a Saturday morning.',2.6],'kid',[1,'Dad, I don\'t want to play anymore.'],'ed',[0,'No quitting! Kowalskis don\'t quit!'],[null,'He played the whole season. He hated every minute of it. His dad never missed a game.',3.6]],
  letter:[[null,'Age seventeen. The driveway. Big Ed reading a letter out loud with his voice cracking.',3.2],'ed',[0,'A FULL SCHOLARSHIP. Harrowgate. My kid.'],'kid',[1,'Dad… I\'m not sure I even want to rush.'],'ed',[0,'NOT SURE?! Kowalskis are ALWAYS sure!'],[null,'So Danny made himself sure.',2.8]]};
async function c10Memory(k,done){await c10Cine(async()=>{c10Setup(1);const m=C10.ob[k],p=m?m.position:{x:C10C.x,z:C10C.z};c4Off('c10g');
  const kid=k==='letter'?'teen':'kid';const ed=c10Ghost('ed',p.x+1.3,p.z-.6,-PI/2,'Big Ed Kowalski','a memory',{abs:1}),kd=c10Ghost(kid,p.x-.9,p.z-.2,PI/2,'Danny','age '+C10Q1[k].age,{abs:1});c4DanAt(p.x,p.z+2.6,PI);
  c4Shot([p.x+.4,terrH(p.x,p.z)+1.5,p.z+4.2],[p.x+.2,terrH(p.x,p.z)+1,p.z],0);try{c6Spark(p.x,1.2,p.z,0xb89aff,10)}catch(e){}await c4Wt(.8);
  const who=[ed,kd];await c8Lines(C10MEM[k].map(l=>Array.isArray(l)&&typeof l[0]==='number'?[who[l[0]],l[1]]:l).filter(l=>typeof l!=='string'));c10Fade(ed);c10Fade(kd)},done)}
const C10ECHO=[[-8,-6,'Over here, kiddo!'],[-9.2,4,'No crying! Kowalskis don\'t cry!'],[0,8.4,'You make your OWN name, you hear me?'],[7.6,3,'…the table, Danny. Put it all on the table.']];
function c10Echo(i){return fin=>{c10Cine(async()=>{c10Setup(1);const[dx,dz,t]=C10ECHO[i];c4Off('c10v');const v=c10Voice('Big Ed Kowalski','an echo',dx+(i%2?-2:2),dz);c4DanAt(...c10X(dx,dz),Math.atan2(-dx,-dz));c4Shot(c10W(dx*.7,1.7,dz*.7+2.4),c10W(dx,1.2,dz),0);try{c6Spark(...c10W(dx,1.2,dz),0xffd27a,6)}catch(e){}
  await c8Lines([[v,t]]);if(i<3)await c8Lines([[null,['The voice is already somewhere else.','It moves again. Along the edge of the trees now.','Closer to the middle.'][i],2]])},fin,{after:()=>c4Off('c10v')})}}
async function c10Q1Order(done){await c10Cine(async()=>{c10Setup(1);const S10=c10S();S10.on={};c4DanAt(...c10X(0,1.6),PI);c4Shot(c10W(1.6,1.9,3.4),c10W(0,.9,0),0);
  const names={shirt:'The sweatshirt (age five)',helmet:'The helmet (age nine)',letter:'The letter (age seventeen)'},order=['shirt','helmet','letter'],left=order.slice();
  for(let slot=0;slot<3;slot++){const opts=left.map(k=>[names[k].replace(/ \(.*/,''),k===order[slot],[()=>{try{noise(.3,.08,300)}catch(e){}},[null,'The objects shiver and slide back off the table. That isn\'t when it happened.',2.4]]]);
    const c=await c8Choose(null,'The Boy Before',['Which memory comes first?','Which one comes next?','And the last one?'][slot],opts);const k=order[slot];left.splice(left.indexOf(k),1);S10.on[k]=slot;const m=C10.ob[k];if(m){const[x,z]=c10X(-.8+slot*.8,0);c10Tween(m,[x,terrH(x,z)+.9,z],.8)}await c4Wt(.9)}
  await c8Lines([[null,'Five. Nine. Seventeen. A light comes up from the table, and the memories start to play.',3]])},done)}
async function c10Q1Project(done){await c10Cine(async()=>{c10Setup(1);c4Off('c10g');const ed=c10Ghost('ed',...c10X(1.4,-.4).map((v,i)=>v),-PI/2,'Big Ed Kowalski','a memory',{abs:1}),kd=c10Ghost('kid',...c10X(-1.2,-.2),PI/2,'Danny','age eight',{abs:1});
  c4DanAt(...c10X(0,1.4),PI);c4Shot(c10W(2.6,1.6,3.6),c10W(0,1.1,-.2),0);c10WinShow(1,'',[[90,1],[160,.6]]);
  await c8Lines([[null,'The kitchen table, every night. Big Ed tells the same stories about Alpha Sigma Rho.',3],[ed,'…and the whole house is chanting my name, and I\'m standing on the roof with the Dean\'s fountain mower, and THAT\'S when I knew. I belonged.'],[ed,'You\'ll know it too, kid. When they want you. You\'ll feel it.']]);
  await c8Choose(null,'The Boy Before','The memory keeps going. It\'s hard to watch.',[['"(Turn away.)"',0,[[DANNY,'(…No. Stay. Watch the whole thing.)']]],['"(Stay.)"',1]]);
  await c8Lines([[kd,'What if they don\'t want me?'],[ed,'Then you MAKE \'em want you.'],[null,'He nodded. He spent the next ten years making people want him.',3.2]]);
  await c8Choose(null,'The Boy Before','What do you see?',[['"Dad did this to me."',0,[[DANNY,'(It\'s not that simple. He loved me. He just loved it loud.)']]],['"None of this matters."',0,[[DANNY,'(Then why does it hurt to watch?)']]],['"This is where it started. I\'ve needed people to accept me since I was a kid."',1]]);
  c10Fade(ed);c10Fade(kd);c10WinOff(1);
  // a moment of ordinary: the effects drop away, then come back
  C10.trip=0;C10.tk=0;c10Overlay(0);await c4Wt(1.6);c4Shot(c10W(3,2.4,8),c10W(-4,2,-8),1.2);await c8Lines([[null,'For a few seconds, the clearing is just a clearing. Crickets. The Lodge. Ezra breathing.',3],[DANNY,'(I wanted to belong long before Alpha Sigma Rho. Long before Grant. Long before any of them.)']]);
  C10.trip=.62;await c4Wt(1);await c8Lines([[null,'Then the grass starts moving again. New things lie in it: a duffel bag, a prison sign, a five-dollar bill.',3.2]])},done)}

// ================================================================ QUEST 2 · THE CHOICE TO BELONG
const C10Q2={duffel:[-7.4,5.6],hughes:[7.4,5.8],five:[-1.2,-4.6]};
const C10FR={hat:[8.6,-1,'Your propeller hat','pressure','"Every pledge wears one." You wore it to class. People laughed. You kept it on.'],photo:[4.4,2.6,'A rush-party photo','belonging','You, Ezra and Marcus, mid-laugh, holding a cooler between you like a trophy.'],
  twenty:[8.8,3.6,'A crumpled twenty','pressure','Grant\'s twenty for rush supplies. "Don\'t come back without them." You didn\'t sleep until you had them.'],comp:[1.4,6.8,'Big Ed\'s 1994 composite','pressure','Your dad at nineteen, grinning in a frame in the basement. You checked it every time you walked past.'],
  ball:[5.2,6.6,'A beer pong ball with a signature','belonging','Tank signed it after you sank the last cup. "To my guy." He meant it.'],mug:[0,8.4,'Marcus\'s coffee mug','belonging','Marcus left it on your bunk the morning after the Haze Room. Full. Still warm.']};
function c10Q2Set(){if(C10.g.q2)return;c10Grp('q2',g=>{const it=(k,dx,dz,build)=>{const[x,z]=c10X(dx,dz),y=terrH(x,z),gr=new THREE.Group();gr.position.set(x,y,z);build(gr);g.add(gr);c10Ring2(g,x,z,0xffd27a,.55);return gr};
  it('duffel',...C10Q2.duffel,gr=>{c10M(gr,new THREE.CylinderGeometry(.22,.22,.7,12),mt(0x3a4a3a,.9),0,.22,0).rotation.z=PI/2});
  it('hughes',...C10Q2.hughes,gr=>{c10M(gr,bgeo(.06,1.2,.06),0x5a5a5a,0,.6,0);const s=signMesh('HUGHES CORRECTIONAL',1.3,.32,'#2a3a2a','#e2e2d2');s.position.set(0,1.2,.05);gr.add(s)});
  it('five',...C10Q2.five,gr=>{const p=c10M(gr,new THREE.PlaneGeometry(.34,.15),mt(0x8ab88a,.8),0,.03,0);p.rotation.x=-PI/2});
  C10.fr={};for(const k in C10FR){const[dx,dz]=C10FR[k];C10.fr[k]=it('fr_'+k,dx,dz,gr=>{const c={hat:0x7d1f2c,photo:0xf2ece0,twenty:0x8ab88a,comp:0x3a2a1a,ball:0xf4f4f4,mug:0xe8e0d0}[k];if(k==='ball')c10M(gr,GC.c10ball||(GC.c10ball=new THREE.SphereGeometry(.07,10,8)),c,0,.08,0);else if(k==='mug')c10M(gr,new THREE.CylinderGeometry(.07,.07,.14,12),c,0,.07,0);else{const p=c10M(gr,bgeo(.3,.04,.24),c,0,.04,0)}});C10.fr[k].visible=false}
  // the memory cues and the throne they lead to
  C10.cues=[];for(const[dx,dz]of[[-7.4,.6],[-3.4,-3.6],[1.6,-5.4]]){const[x,z]=c10X(dx,dz);const l=c10M(g,bgeo(.24,.3,.24),bm(0xffcf70),x,terrH(x,z)+1.7,z);l.visible=false;C10.cues.push(l)}
  const[tx,tz]=c10X(6.4,-6.2),ty=terrH(tx,tz);const th=new THREE.Group();th.position.set(tx,ty,tz);th.rotation.y=-.7;c10M(th,bgeo(1,.12,.9),c10Glow(0xd8b44a),0,.55,0);c10M(th,bgeo(1,1.6,.12),c10Glow(0xd8b44a),0,1.3,-.42);g.add(th);th.visible=false;C10.throne=th})}
function c10FrShow(on){for(const k in C10.fr||{})C10.fr[k].visible=on}
function c10College(k){return fin=>{c10Cine(async()=>{c10Setup(2);const[dx,dz]=C10Q2[k];c4Off('c10g');c4DanAt(...c10X(dx,dz+2),PI);c4Shot(c10W(dx+1.6,1.6,dz+4),c10W(dx,1,dz),0);await c4Wt(.4);
  if(k==='duffel'){const t=c10Ghost('teen',...c10X(dx+.9,dz),-PI/2,'Danny','freshman year',{abs:1});await c8Lines([[null,'One duffel bag. Everything he owned fit inside it, with room left over for the nerves.',3.2],[t,'Okay. Okay. You can do this.']]);c10Fade(t)}
  if(k==='hughes')await c8Lines([[null,'Move-in day. Big Ed drove six hours on a busted transmission and dropped him off at the front gate of a prison.',3.4],[DANNY,'(He was so proud he didn\'t even read the sign.)']]);
  if(k==='five'){const e=c10Ghost('ed',...c10X(dx+1,dz),-PI/2,'Big Ed Kowalski','a memory',{abs:1});await c8Lines([[e,'Here. Five bucks. Don\'t spend it all in one place.'],[null,'He never spent it. It\'s still in his wallet.',2.6]]);c10Fade(e)}},fin)}}
async function c10BigEd(fin){await c10Cine(async()=>{c10Setup(2);c4Off('c10g');const e=c10Ghost('ed',...c10X(-3.4,-8),0,'Big Ed Kowalski','Your dad · a memory',{abs:1});c4DanAt(...c10X(-3.4,-5.6),PI);c4Shot(c10W(-1.4,1.7,-3.6),c10W(-3.4,1.6,-8),0);await c4Wt(.6);
  await c8Lines([[e,'Here it is, Danny! HARROWGATE UNIVERSITY! Founded 1791! And now a KOWALSKI on a full scholarship!'],[e,'You are going to march up that walk and EARN those letters! No quitting! No crying!'],[DANNY,'Dad… what if I don\'t want them?'],[e,'NOT SURE?! I did not drive six hours on a busted transmission for NOT SURE!'],
    [e,'…I\'m proud of you, kid. Real proud. Now get up there before I get emotional in front of these preppies.'],[DANNY,'(I went up there for him. At least at first.)']]);c10Fade(e)},fin)}
function c10Cue(i){return fin=>{c10Cine(async()=>{c10Setup(2);const l=C10.cues&&C10.cues[i];if(l)l.visible=true;const p=l?l.position:{x:C10C.x,z:C10C.z};c4DanAt(p.x,p.z+1.4,PI);c4Shot([p.x+1.6,terrH(p.x,p.z)+1.9,p.z+3],[p.x,terrH(p.x,p.z)+1.6,p.z],0);try{c6Spark(p.x,terrH(p.x,p.z)+1.7,p.z,0xffd27a,8)}catch(e){}
  await c8Lines([[null,['A floating lantern. Then another, further on.','Greek Row, the first night. Music from every porch.','A throne made of light, and somebody sitting on it.'][i],2.6]]);if(i===2&&C10.throne)C10.throne.visible=true;if(C10.cues&&C10.cues[i+1])C10.cues[i+1].visible=true},fin)}}
async function c10Throne(done){await c10Cine(async()=>{c10Setup(2);c4Off('c10g');const[tx,tz]=c10X(6.4,-6.2);const g=c10Ghost('grant',tx,tz,-.7+PI,'Grant Ashby','a memory',{abs:1});if(C10.throne)C10.throne.visible=true;if(g&&g.pup)g.pup.st='sit';c4DanAt(...c10X(4.2,-3.6),PI*.8);c4Shot(c10W(2.6,1.7,-2),c10W(6.2,1.4,-6),0);await c4Wt(.6);
  await c8Lines([[g,'Marcus says you\'re Big Ed\'s kid. That true?'],[DANNY,'Yeah.'],[g,'Then you already know what this house is. The question is whether you want it.'],[DANNY,'(That was the first time I really wanted it. Not for Dad. For me.)'],[null,'Things he carried that semester lie in the grass around the throne. Some of them felt like home. Some of them felt like a hand on the back of his neck.',4]]);c10FrShow(1);c10Fade(g)},done)}
function c10FrItem(k){const[dx,dz,name,kind,desc]=C10FR[k];return{k:'q10f'+k,l:name,at:()=>c10P(dx,dz),act:'Look at it',run:fin=>{c10Cine(async()=>{c4Shot(c10W(dx+1.2,1.4,dz+1.8),c10W(dx,.3,dz),0);await c8Lines([[null,desc,3.6]]);
  await c8Choose(null,'The Choice to Belong','"'+name+'." What was it, really?',[['Belonging',kind==='belonging',[[DANNY,'(…No. Be honest about it.)']]],['Pressure to fit in',kind==='pressure',[[DANNY,'(…No. Be honest about it.)']]]]);const m=C10.fr[k];if(m){try{c6Spark(m.position.x,m.position.y+.3,m.position.z,kind==='belonging'?0xffd27a:0x8a6aff,8)}catch(e){}}},fin)}}}
async function c10Q2End(done){await c10Cine(async()=>{c10Setup(2);c4DanAt(...c10X(0,2),PI);c4Shot(c10W(2.4,1.8,4.6),c10W(0,1.3,-1),0);
  await c8Choose(null,'The Choice to Belong','The memories go quiet. Whose decision was it?',[['"Dad made me rush."',0,[[DANNY,'(He pushed. I\'m the one who walked up the steps.)']]],['"Grant picked me. I just went along."',0,[[DANNY,'(I could have said no on any of those nights.)']]],['"It was my decision. Nobody made me join."',1]]);
  await c8Choose(null,'The Choice to Belong','One more thing to admit.',[['"Wanting acceptance excuses all of it."',0,[[DANNY,'(No it doesn\'t.)']]],['"I never hurt anybody."',0,[[DANNY,'(Andre.)']]],['"Wanting acceptance explains my choices. It doesn\'t excuse the harm I caused."',1]]);
  c10Del('q2');c4Shot(c10W(0,2.2,7.6),c10W(0,.8,-2),1.4);await c4Wt(.6);c10Chairs(1,1);await c4Wt(1.2);await c8Lines([[null,'The memories sink back into the grass. Where they were, a row of empty chairs is waiting.',3.2]]);big('PHASE II · THE BROTHERHOOD',2600);await c4Wt(1.4)},done)}

// ================================================================ QUEST 3 · THE EMPTY CHAIRS
const C10CH=[{k:'luke',l:'The chair with a clock hanging over it',snd:'tick',txt:'A clock ticks over the chair, very loud, and then stops. Luke Harmon. Nineteen. He told them he didn\'t drink.'},
  {k:'y2019',l:'The chair that\'s soaking wet',snd:'water',txt:'Lake water drips off the seat. Somebody in 2019 carried a lantern down the boathouse steps blindfolded. His frame on the wall is still empty.'},
  {k:'reyes',l:'The chair tagged SPRING \'87',snd:'rain',txt:'Rain on basement stairs. A pledge named Thomas Reyes, and twelve brothers with the same story.'},
  {k:'andre'},
  {k:'next',l:'The chair with a blank tag',snd:'wind',txt:'Wind, and nothing else. A chair for whoever the house hurts next, if nobody says anything.'}];
function c10Chairs(on,row){if(!on){c10Del('chairs');return}if(C10.g.chairs&&!row)return;c10Grp('chairs',g=>{C10.chm=[];C10CH.forEach((c,i)=>{let x,z;if(row)[x,z]=c10X(-4+i*2,-1.4);else[x,z]=c10ChairXZ(i);const y=terrH(x,z),ch=new THREE.Group();ch.position.set(x,y,z);ch.rotation.y=row?PI:Math.atan2(C10C.x-x,C10C.z-z);
  const m=mt(0x4a3626,.8);c10M(ch,bgeo(.55,.06,.55),m,0,.46,0);c10M(ch,bgeo(.55,.7,.06),m,0,.85,-.26);for(const sx of[-.24,.24])for(const sz of[-.24,.24])c10M(ch,bgeo(.05,.46,.05),0x3a2a1e,sx,.23,sz);
  if(c.k==='luke')c10M(ch,new THREE.CylinderGeometry(.2,.2,.04,18),mt(0xf2ece0,.6),0,1.55,-.3).rotation.x=PI/2;if(c.k==='reyes'){const s=signMesh('SPRING \'87',.36,.1,'#2a1a10','#e2b64c');s.position.set(0,.9,-.22);ch.add(s)}if(c.k==='next'){const s=signMesh('',.3,.1,'#e8e0d0','#2a1a10');s.position.set(0,.9,-.22);ch.add(s)}
  if(c.k==='y2019'){const p=c10M(ch,new THREE.CircleGeometry(.4,16),new THREE.MeshStandardMaterial({color:0x3a4a5a,roughness:.1,metalness:.3,transparent:true,opacity:.6}),0,.02,0);p.rotation.x=-PI/2}
  c10Ring2(g,x,z,0x9a8aff,.62);g.add(ch);C10.chm.push(ch)})})}
function c10ChairSnd(s){try{if(s==='tick')for(let i=0;i<6;i++)tone(1700,.03,'square',.03,i*.5);if(s==='water')noise(1.6,.05,500);if(s==='rain')noise(2,.05,2600);if(s==='wind')noise(2,.04,300)}catch(e){}}
function c10ChairItem(i){const c=C10CH[i];return{k:'q10c'+c.k,l:c.l,at:()=>{const[x,z]=c10ChairXZ(i);return{int:null,x,z}},act:'Look at the chair',run:fin=>{c10ChairSnd(c.snd);c10Cine(async()=>{const[x,z]=c10ChairXZ(i);c4Shot([x+(C10C.x-x)*.35,terrH(x,z)+1.5,z+(C10C.z-z)*.35],[x,terrH(x,z)+.8,z],0);await c4Wt(1.2);await c8Lines([[null,c.txt,4]])},fin)}}}
async function c10Q3Open(done){await c10Cine(async()=>{c10Setup(3);c10Chairs(1,1);c4DanAt(...c10X(0,4.4),PI);c4Shot(c10W(0,2.6,8.4),c10W(0,.8,0),0);await c4Wt(.8);
  // the row bends into a circle under the trees
  const tg=C10.chm||[];tg.forEach((ch,i)=>{const[x,z]=c10ChairXZ(i);c10Tween(ch,[x,terrH(x,z),z],1.6,.8);const ry=Math.atan2(C10C.x-x,C10C.z-z);let t=0;const r0=ch.rotation.y;c5Anim(dt=>{t+=dt/1.6;ch.rotation.y=r0+(ry-r0)*Math.min(1,t);return t>=1})});await c4Wt(2);c10Chairs(1);
  await c8Lines([[null,'The chairs slide into a circle beneath the trees. Five of them. Nobody is sitting in any.',3.2],[DANNY,'(One of these is his. I already know it is.)']])},done)}
function c10AndreObj(on){if(!on){c10Del('aobj');return}c10Grp('aobj',g=>{const[x,z]=c10ChairXZ(C10ANDRE),a=Math.atan2(C10C.x-x,C10C.z-z),ox=Math.sin(a+PI/2),oz=Math.cos(a+PI/2),y=terrH(x,z);
  C10.ao={clip:c10M(g,bgeo(.24,.03,.32),0x8a6a3a,x+ox*.9,y+.02,z+oz*.9),pin:c10M(g,new THREE.CylinderGeometry(.05,.05,.02,12),mt(0xd8b040,.3,.8),x-ox*.9,y+.02,z-oz*.9),mask:c10M(g,GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),0xf4f2ea,x-Math.sin(a)*.9,y+.12,z-Math.cos(a)*.9)};C10.ao.mask.scale.set(.18,.12,.2)})}
const C10AO={clip:[1,'Andre\'s roll-call clipboard',[[0,'Roll call! Six o\'clock! Kowalski!'],[DANNY,'Here.'],[null,'Every night at six. He never once marked Danny late, even on the nights he was.',3.2]]],
  pin:[-1,'His pledge captain pin',[[0,'Pledge captain. It means I take the heat first. That\'s the job.'],[null,'He took a lot of it. Most of it, nobody saw.',2.8]]],
  mask:[0,'A sheep mask in the grass',[[0,'Carter told me to wear the mask. I\'m the pledge captain. You do what the Pledge Master says.'],[DANNY,'(He followed orders. Then he followed them right into that room.)']]]};
function c10AndreItem(k){const[s,label,lines]=C10AO[k];return{k:'q10o'+k,l:label,at:()=>{const[x,z]=c10ChairXZ(C10ANDRE),a=Math.atan2(C10C.x-x,C10C.z-z);if(k==='mask')return{int:null,x:x-Math.sin(a)*1.3,z:z-Math.cos(a)*1.3};const ox=Math.sin(a+PI/2)*s,oz=Math.cos(a+PI/2)*s;return{int:null,x:x+ox*1.3,z:z+oz*1.3}},act:'Pick it up',
  run:fin=>{c10Cine(async()=>{const[x,z]=c10ChairXZ(C10ANDRE);c4Off('c10g');const an=c10Ghost('andre',x,z,Math.atan2(C10C.x-x,C10C.z-z),'Andre Wallace','a memory',{abs:1});if(an&&an.pup)an.pup.st='sit';c4Shot([x+(C10C.x-x)*.45,terrH(x,z)+1.5,z+(C10C.z-z)*.45],[x,terrH(x,z)+1,z],0);await c4Wt(.6);
    await c8Lines(lines.map(l=>l[0]===0?[an,l[1]]:l));c10Fade(an)},fin)}}}
async function c10Q3Place(fin){await c10Cine(async()=>{const[x,z]=c10ChairXZ(C10ANDRE);c4Shot([x+(C10C.x-x)*.4,terrH(x,z)+1.4,z+(C10C.z-z)*.4],[x,terrH(x,z)+.6,z],0);await c4Wt(.4);
  c10Grp('whistle',g=>{const y=terrH(x,z);c10M(g,new THREE.CylinderGeometry(.03,.04,.12,10),mt(0xc8c8c8,.3,.8),x,y+.52,z).rotation.z=PI/2;c10Ring2(g,x,z,0xffd27a,.5)});try{tone(2350,.2,'sine',.05)}catch(e){}
  await c8Lines([[null,'He sets Andre\'s roll-call whistle on the seat. It looks very small there.',3]])},fin)}
async function c10Q3End(done){await c10Cine(async()=>{const[x,z]=c10ChairXZ(C10ANDRE);c4DanAt(x+(C10C.x-x)*.3,z+(C10C.z-z)*.3,Math.atan2(x-C10C.x,z-C10C.z));c4Shot([x+(C10C.x-x)*.7,terrH(x,z)+1.7,z+(C10C.z-z)*.7],[x,terrH(x,z)+.8,z],0);
  await c8Choose(null,'The Empty Chairs','Andre\'s chair. What do you say to it?',[['"He ran away. That\'s the story."',0,[[DANNY,'(That\'s the lie. Not here. Not to him.)']]],['"(Walk away from the chair.)"',0,[[DANNY,'(…No. I\'ve been walking away from it for weeks.)']]],['"You\'re not here because of what happened in the Haze Room. I\'m not going to pretend you just left."',1]]);
  await c8Lines([[null,'Brotherhood isn\'t only the people still in the room. It\'s the ones who got hurt. The ones who didn\'t come back.',3.8]]);
  c4Shot(c10W(0,3,9),c10W(0,1,-2),1.4);await c4Wt(.4);for(const ch of C10.chm||[]){let t=0;ch.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.transparent=true}});c5Anim(dt=>{t+=dt/1.8;ch.traverse(o=>{if(o.material)o.material.opacity=Math.max(0,1-t)});return t>=1})}await c4Wt(2);
  c10Chairs(0);c10AndreObj(0);c10Del('whistle');c10Haze(1,0);try{noise(1,.08,180)}catch(e){}await c8Lines([[null,'The chairs fade. Smoke comes up out of the grass, and in the smoke, a room he knows: a chalkboard, a clock, a steel door.',3.6]])},done)}

// ================================================================ QUEST 4 · THE ROOM REMEMBERS
// the Haze Room as a vision: translucent, standing in the clearing; 'cer' turns it into a formal ceremonial space
function c10Haze(on,cer){if(!on){c10Del('haze');return}if(C10.g.haze&&C10.hzCer===cer)return;C10.hzCer=cer;c10Grp('haze',g=>{const gm=c10Glow(cer?0xd8b44a:0x9a6aff);gm.opacity=.32;const{x:cx,z:cz}=C10C,y=terrH(cx,cz);
  if(!cer){const cb=ctex(512,256,(q,w,h)=>{q.fillStyle='rgba(30,40,34,.9)';q.fillRect(0,0,w,h);q.fillStyle='rgba(240,240,230,.9)';q.font='bold 30px "Comic Sans MS",cursive';q.fillText('THE HOUSE RULES',30,44);q.font='20px "Comic Sans MS",cursive';['1. The Goat always speaks first.','2. The Sheep never answers twice.','3. The Pig gets the final word.','4. Nobody leaves without permission.','5. Nobody questions the rules.','6. The rules change when the Goat decides.'].forEach((t,i)=>q.fillText(t,30,86+i*28))});
      c10M(g,new THREE.PlaneGeometry(4,2),new THREE.MeshBasicMaterial({map:cb,transparent:true,opacity:.55,depthWrite:false}),cx,y+1.9,cz-4.4);const ck=c10M(g,new THREE.CylinderGeometry(.4,.4,.05,24),gm,cx,y+3.4,cz-4.4);ck.rotation.x=PI/2;
      c10M(g,bgeo(.12,2.6,1.4),gm,cx-6.6,y+1.3,cz-1);for(let i=0;i<4;i++){c10M(g,bgeo(.55,.06,.55),gm,cx-2.4+i*1.6,y+.46,cz+1.2);c10M(g,bgeo(.55,.7,.06),gm,cx-2.4+i*1.6,y+.85,cz+1.46)}
      for(let i=0;i<4;i++){const s=c10M(g,new THREE.PlaneGeometry(.3,4.6),gm,cx+(i-1.5)*3,y+2.3,cz-4.9)}}
    else{c10M(g,bgeo(2.4,1,1),gm,cx,y+.5,cz-4.2);const t=signMesh('ONE BROTHERHOOD · ONE BOND · ONE NAME',3.6,.36,'#1a1206','#e2b64c');t.position.set(cx,y+1.35,cz-3.68);g.add(t);for(const s of[-1,1])c10M(g,new THREE.CylinderGeometry(.12,.14,2.6,10),gm,cx+s*2,y+1.3,cz-4.2)}})}
const C10RM=[{k:'bel',dx:-8.2,dz:-4.6,src:'record',srcL:'the record player',snd:'laugh',obj:'photo',objL:'A photo from 1971',where:'by the Lodge porch'},
  {k:'pre',dx:8.6,dz:-2.4,src:'mega',srcL:'the megaphone',snd:'shout',obj:'paddle',objL:'A wooden paddle',where:'at the tree line'},
  {k:'sil',dx:-3.4,dz:8,src:'door',srcL:'the steel door',snd:'slam',obj:'key',objL:'A single brass key',where:'on the path'}];
function c10RmSnd(s){try{if(s==='laugh'){noise(.5,.05,1400);tone(330,.2,'triangle',.03,.1);tone(392,.2,'triangle',.03,.35)}if(s==='shout'){tone(180,.4,'sawtooth',.04);tone(160,.4,'sawtooth',.04,.45)}if(s==='slam'){noise(.3,.25,150)}}catch(e){}}
function c10RmSet(){if(C10.g.rmp)return;const S10=c10S();c10Grp('rmp',g=>{C10.rmp={};for(const p of C10RM){const[x,z]=c10X(p.dx,p.dz),y=terrH(x,z),grp=new THREE.Group();grp.position.set(x,y,z);g.add(grp);
  const col=c10M(grp,new THREE.CylinderGeometry(.6,.9,4,16,1,true),c10Glow(0xb89aff),0,2,0);col.material.opacity=.18;
  const src=new THREE.Group();src.position.set(1.4,0,.6);grp.add(src);if(p.src==='record'){c10M(src,bgeo(.5,.12,.4),0x5a3a22,0,.5,0);c10M(src,new THREE.CylinderGeometry(.17,.17,.02,18),0x111111,0,.57,0)}if(p.src==='mega'){c10M(src,new THREE.ConeGeometry(.16,.4,12,1,true),mt(0xe8e8e0,.5),0,.7,0).rotation.z=PI/2}if(p.src==='door'){c10M(src,bgeo(.1,2.2,1.1),mt(0x5a5e62,.45,.7),0,1.1,0)}src.visible=!!S10['rp'+p.k];
  const ob=new THREE.Group();ob.position.set(-1.2,0,.4);grp.add(ob);if(p.obj==='photo'){const m=c10M(ob,bgeo(.3,.02,.24),0xf2ece0,0,.02,0)}if(p.obj==='paddle')c10M(ob,bgeo(.7,.04,.2),0x8a5a2a,0,.03,0).rotation.y=.5;if(p.obj==='key')c10M(ob,bgeo(.05,.02,.16),mt(0xd8b040,.3,.8),0,.02,0);ob.visible=!!S10['rv'+p.k];
  C10.rmp[p.k]={grp,col,src,ob}}})}
function c10RmFind(p){return{k:'q10r'+p.k,l:'The distortion '+p.where,at:()=>c10P(p.dx,p.dz),act:'Step into the distortion',r:2.6,run:fin=>{c10RmSnd(p.snd);c10S()['rp'+p.k]=1;const r=C10.rmp&&C10.rmp[p.k];if(r){r.col.material.opacity=.32;try{c6Spark(r.grp.position.x,1.6,r.grp.position.z,0xb89aff,10)}catch(e){}}toast('Something is here. Sounds leak out of the air.',2400);fin()}}}
const C10RMS={bel:[[null,'1971. The basement under the old Kappa house, before anyone called it anything.',3],[1,'Pull up a crate! This is OUR room now.'],[2,'Nobody upstairs can hear us down here. Best room in the house.'],[null,'They\'re laughing. All of them. It\'s just a room where brothers went to be themselves.',3.4]],
  pre:[[null,'Hell Week. The Haze Room, the way Danny knows it.',2.6],[1,'DRINK. Until the clock stops.'],[2,'Rule six! The rules change when the Goat decides!'],[null,'The laughing is gone. Only the shouting is left.',2.8]],
  sil:[[null,'After. Andre under a sheet. Everybody standing very still.',2.8],[1,'Nobody says what happened to Andre. Not you, not them, not me. Ever.'],[0,'…Agreed.'],[null,'Then no one says anything at all, for weeks.',2.8]]};
function c10RmView(p){return{k:'q10v'+p.k,l:'View the memory '+p.where,need:()=>c5S().d['q10r'+p.k],at:()=>c10P(p.dx,p.dz),act:'Watch the memory',r:2.6,run:fin=>{c10Cine(async()=>{c10Setup(4);c10RmSet();c4Off('c10g');const[x,z]=c10X(p.dx,p.dz);
  const a=c10Ghost(p.k==='bel'?'brother':p.k==='pre'?'carter':'grant',x+1.2,z-.6,-PI/2,p.k==='bel'?'A brother, 1971':p.k==='pre'?'The Goat':'Grant Ashby','a memory',{abs:1}),b=c10Ghost(p.k==='bel'?'brother':'brother',x-1.2,z-.6,PI/2,p.k==='bel'?'Another brother, 1971':p.k==='pre'?'The Pig':'Danny','a memory',{abs:1});
  if(p.k==='pre'&&a)c8Mask(a,'goat');if(p.k==='pre'&&b)c8Mask(b,'pig');c4DanAt(x,z+2.4,PI);c4Shot([x+.6,terrH(x,z)+1.6,z+4],[x,terrH(x,z)+1.2,z-.4],0);c10RmSnd(p.snd);await c4Wt(.6);
  await c8Lines(C10RMS[p.k].map(l=>typeof l[0]==='number'?[[DANNY,a,b][l[0]],l[1]]:l).map(l=>l[0]===DANNY?[DANNY,l[1]]:l));c10S()['rv'+p.k]=1;const r=C10.rmp&&C10.rmp[p.k];if(r)r.ob.visible=true;c10Fade(a);c10Fade(b)},fin)}}}
function c10RmSrc(p){return{k:'q10s'+p.k,l:'Find what\'s making the '+({laugh:'laughter',shout:'shouting',slam:'slamming'})[p.snd],need:()=>c5S().d['q10v'+p.k],at:()=>{const[x,z]=c10X(p.dx+1.4,p.dz+.6);return{int:null,x,z}},act:'Touch '+p.srcL,r:2,
  run:fin=>{c10RmSnd(p.snd);const r=C10.rmp&&C10.rmp[p.k];c10S()['rs'+p.k]=1;if(r){r.src.visible=true;const s=r.src.position.clone().add(r.grp.position);try{c6Spark(s.x,s.y+.8,s.z,0xffd27a,10)}catch(e){}}c10Note('The Room Remembers','It was '+p.srcL+'. When you touch it, the sound finally stops.')(fin)}}}
function c10RmObj(p){const txt={photo:'Eleven brothers on crates, arms around each other, grinning. On the back: "HAZE ROOM · EST. 1971 · OURS."',paddle:'ΑΣΡ. HAZE. KEEP. Smooth where hands held it, over and over.',key:'The only key to the steel door. It stayed in one pocket. Silence needs somebody to hold it.'}[p.obj];
  return{k:'q10b'+p.k,l:p.objL,need:()=>c5S().d['q10s'+p.k],at:()=>{const[x,z]=c10X(p.dx-1.2,p.dz+.4);return{int:null,x,z}},act:'Look at it',r:2,run:c10Note('The Room Remembers',txt)}}
async function c10RmOrder(done){await c10Cine(async()=>{c10Setup(4);c4DanAt(...c10X(0,-2.2),PI);c4Shot(c10W(1.4,1.8,0),c10W(0,1.8,-4.4),0);
  const L={bel:'The photo (belonging)',pre:'The paddle (pressure)',sil:'The key (silence)'},order=['bel','pre','sil'],left=order.slice();const lab=k=>L[k].replace(/ \(.*/,'');
  for(let s=0;s<3;s++){await c8Choose(null,'The Room Remembers',['The chalkboard is blank. What goes first?','And then?','And at the end?'][s],left.map(k=>[lab(k),k===order[s],[()=>{try{noise(.3,.08,300)}catch(e){}},[null,'The chalk smears and runs. That isn\'t how it happened.',2.2]]]));left.splice(left.indexOf(order[s]),1);try{sfx('ok')}catch(e){}}
  await c8Lines([[null,'Belonging. Then pressure. Then silence. The room wrote it in that order every single time.',3.4]]);
  await c8Choose(null,'The Room Remembers','What does loyalty owe a room like this?',[['"Loyalty means protecting the house, whatever it did."',0,[[DANNY,'(That\'s how the room got its name.)']]],['"Loyalty means keeping quiet."',0,[[DANNY,'(Quiet is how Andre ended up under a sheet.)']]],['"Loyalty doesn\'t mean protecting what\'s wrong, or hiding the truth because it hurts."',1]]);
  await c8Lines([[null,'The house gave him a place to belong. Then it used that belonging to buy his silence.',3.4]]);
  c10Del('rmp');c4Shot(c10W(0,3,7),c10W(0,1.2,-4),1.6);await c4Wt(.4);c10Haze(1,1);c10Stones(1);try{tone(196,1.4,'sine',.04);tone(294,1.4,'sine',.03,.4)}catch(e){}await c4Wt(.8);
  await c8Lines([[null,'The smoke changes. The chalkboard becomes an altar. The steel door becomes two pillars. Seven stones rise out of the grass around the clearing.',4]]);big('PHASE III · THE OATH',2600);await c4Wt(1.4)},done)}

// ================================================================ QUEST 5 · THE SEVEN VALUES (the canon from Hell Week: C9VAL)
function c10StoneXZ(i){const a=-PI/2+PI/7+i*TAU/7;return c10X(Math.cos(a)*7.6,Math.sin(a)*7.6)}
function c10Stones(on,dark){if(!on){c10Del('stones');C10.stones=[];return}if(!C10.g.stones)c10Grp('stones',g=>{C10.stones=[];C9VAL.forEach((v,i)=>{const[x,z]=c10StoneXZ(i),y=terrH(x,z),ry=Math.atan2(C10C.x-x,C10C.z-z);
  const tx=ctex(256,384,(q,w,h)=>{q.fillStyle='#3a3630';q.fillRect(0,0,w,h);q.fillStyle='rgba(240,220,160,.9)';q.textAlign='center';q.font='bold 30px Georgia';const words=v.split(' ');let yy=150;for(let j=0;j<words.length;j+=2){q.fillText(words.slice(j,j+2).join(' '),w/2,yy);yy+=40}q.strokeStyle='rgba(240,220,160,.6)';q.lineWidth=4;q.strokeRect(16,16,w-32,h-32)});
  const s=c10M(g,bgeo(.9,1.5,.22),new THREE.MeshStandardMaterial({map:tx,roughness:.9}),x,y+.75,z,ry);const gl=c10M(g,new THREE.PlaneGeometry(1.1,1.7),c10Glow(0xffd27a),x+Math.sin(ry)*.13,y+.78,z+Math.cos(ry)*.13,ry);gl.material.opacity=0;
  C10.stones.push({m:s,glow:gl,lit:0,i})})});const S10=c10S();for(const s of C10.stones)s.lit=dark?0:!!S10.lit[s.i]}
function c10Light(i){const S10=c10S();S10.lit[i]=1;const s=C10.stones[i];if(s){s.lit=1;const p=s.m.position;try{c6Spark(p.x,p.y+.6,p.z,0xffd27a,12);tone(392+i*40,.5,'sine',.04)}catch(e){}}}
const C10VQ=[['Night 5. Three locked cells and a lock with three symbols.',[['"I kept my symbol to myself until I knew it was safe."',0],['"I told Ezra and Marcus my symbol and trusted them."',1],['"I believed the speaker."',0]]],
  ['The Haze Room. Luke stopped answering.',[['"I kept drinking, like they said."',0],['"I tried to get help for Luke while the Keepers laughed."',1],['"I looked away."',0]]],
  ['The Washout. The Goat held out the hose.',[['"I sprayed them so it would end."',0],['"I wouldn\'t turn the hose on the others."',1]]],
  ['Night 2. The house that never ended.',[['"I walked out the exit and left it messy."',0],['"I swept the floor again when nobody was watching."',1]]],
  ['Day 7. Carter held out a lit candle stub.',[['"I took the wax."',0],['"I turned down Carter\'s wax and wouldn\'t sell out Ezra."',1]]],
  ['The night Andre died. Grant brokered a silence.',[['"I\'ve always told the truth."',0,'(The stone stays dark. That isn\'t true, and you know it.)'],['"I agreed to keep what happened to Andre a secret."',1]]],
  ['The Haze Room. The Goat said nobody leaves until the dog is dead.',[['"I did what the Goat said."',0],['"I stood between the Keepers and the dog."',1]]]];
function c10Value(i){return fin=>{c10Cine(async()=>{c10Setup(5);const[x,z]=c10StoneXZ(i),ry=Math.atan2(C10C.x-x,C10C.z-z);c4DanAt(x+Math.sin(ry)*1.6,z+Math.cos(ry)*1.6,ry+PI);c4Shot([x+Math.sin(ry)*3.4+Math.cos(ry)*1,terrH(x,z)+1.7,z+Math.cos(ry)*3.4-Math.sin(ry)*1],[x,terrH(x,z)+1,z],0);await c4Wt(.4);
  const[sc_,opts]=C10VQ[i];await c8Lines([[null,C9VAL[i].charAt(0)+C9VAL[i].slice(1).toLowerCase()+'. '+sc_,3.4]]);
  await c8Choose(null,'The Seven Values · '+C9VAL[i],'Which choice of yours belongs to this stone?',opts.map(([l,ok,r])=>[l,ok,[[DANNY,r||'(The stone stays dark. Be honest.)']]]));
  c10Light(i);await c8Lines([[null,i===5?'The stone lights, dimly. Integrity isn\'t a thing you have. It\'s a thing you owe.':'The stone lights up.',2.6]])},fin)}}
async function c10ValReview(done){await c10Cine(async()=>{c10Setup(5);for(let i=0;i<7;i++)if(!c10S().lit[i])c10Light(i);c4DanAt(...c10X(0,0),PI);c4Shot(c10W(0,4.6,5),c10W(0,.4,-1),0);await c4Wt(.6);
  for(let i=0;i<7;i++){const[x,z]=c10StoneXZ(i);c4Shot(c10W((x-C10C.x)*.4,1.8,(z-C10C.z)*.4),[x,terrH(x,z)+1,z],1.6);c1Sub('',C9VAL[i].charAt(0)+C9VAL[i].slice(1).toLowerCase()+'.');try{tone(392+i*40,.4,'sine',.035)}catch(e){}await c4Wt(1.3)}c1Sub(null);
  c4Shot(c10W(0,2,4),c10W(0,1.2,-2),1.2);await c8Choose(null,'The Seven Values','Seven words around a fire. What are they for?',[['"To memorize, so I can recite them at the oath."',0,[[DANNY,'(Anybody can recite them. Carter can recite them.)']]],['"To put on a plaque."',0,[[DANNY,'(There\'s a plaque. It didn\'t stop anything.)']]],['"To practice. They mean nothing if I only say them."',1]])},done)}
async function c10ValOath(done){await c10Cine(async()=>{c10Setup(5);const gr=c10K('grant'),ca=c10K('carter'),lo=c10K('logan');c4DanAt(...c10X(0,-4.6),PI);c4Shot(c10W(1.6,1.75,-3),c10W(0,1.7,-7),0);await c4Wt(.4);
  await c8Lines([[gr,'Pledge. The oath isn\'t words. It\'s a weight. Every brother carries it the rest of his life.'],[gr,'Will you accept the responsibility that comes with it?']]);
  await c8Choose(gr,'The Seven Values','The masked brothers wait in silence.',[['"I\'ll say the words."',0,[[gr,'That\'s not what I asked.']]],['"I will. All of it."',1]]);
  await c8Lines([[null,'All seven stones go dark at once. In the middle of the clearing, the smoke pulls together into one last memory.',3.4]]);c10Stones(1,1);c10Haze(1,0)},done)}

// ================================================================ QUEST 6 · THE CONFESSION
async function c10ConfMem(done){await c10Cine(async()=>{c10Setup(6);c4Off('c10g');c4DanAt(...c10X(0,3.2),PI);c4Shot(c10W(3.2,1.8,4.6),c10W(0,1.1,-.4),0);await c4Wt(.6);
  const an=c10Ghost('andre',...c10X(-.6,-.6),PI/2,'Andre Wallace','a memory',{abs:1}),ez=c10Ghost('luke',...c10X(.4,-.4),-PI/2,'Ezra Cole','a memory',{abs:1}),dn=c10Ghost('danny',...c10X(2.6,1),-PI*.7,'Danny','a memory',{abs:1});if(ez&&ez.pup)ez.pup.lie=1;if(an&&an.pup)an.pup.st='punch';
  await c8Lines([[null,'The Washout. Andre has Ezra pinned on the wet concrete.',3],[an,'This is YOUR fault! All of you!'],[ez,'DANNY!']]);c4To(dn,...c10X(.6,-.2),4);await c4Wt(.9);if(dn&&dn.pup)dn.pup.st='punch';
  $('fade').style.opacity=1;await c4Wt(.5);for(let i=0;i<3;i++){try{noise(.12,.2,160);tone(60,.12,'sine',.12)}catch(e){}await c4Wt(.55)}$('fade').style.opacity=0;if(an&&an.pup){an.pup.st='';an.pup.lie=1}if(dn&&dn.pup)dn.pup.st='';if(ez&&ez.pup)ez.pup.lie=0;
  await c8Lines([[null,'Andre doesn\'t get up.',2.6]]);c10Fade(ez);const gm=c10Ghost('grant',...c10X(-3,-2),PI/2,'Grant Ashby','a memory',{abs:1});
  await c8Lines([[gm,'Andre panicked and ran. That\'s the story. From everybody.'],[dn,'…Agreed.'],[null,'And every day since, he has let the whole house believe it.',3]]);c10Fade(an);c10Fade(dn);c10Fade(gm)},done)}
async function c10ConfAsk(done){await c10Cine(async()=>{c10Setup(6);c4Shot(c10W(1,1.7,4.6),c10W(0,1.6,1),0);
  await c8Choose(null,'The Confession','The memory is gone. The question isn\'t. Will you keep hiding it?',[['"Keep it hidden. Carter\'s right, both sides have too much to lose."',0,[[DANNY,'(I\'ve been saying that for weeks. I\'m done saying it.)']]],['"No. Not anymore."',1]])},done)}
async function c10Confess(done){await c10Cine(async()=>{c10Setup(6);const gr=c10K('grant'),ca=c10K('carter'),lo=c10K('logan'),ez=c10K('ezra'),mc=c10K('marcus');for(const n of[ez,mc])if(n&&n.pup)n.pup.st='';c10S().risen=1;c4DanAt(...c10X(0,-4.4),PI);c4Shot(c10W(2.2,1.8,-1.8),c10W(0,1.6,-5),0);await c4Wt(.4);
  await c8Lines([[DANNY,'I have something to say before the oath. To all of you.'],[DANNY,'Andre Wallace didn\'t run away. He died in the Haze Room. He had Ezra on the ground, and I hit him with a paddle, and he didn\'t get up.'],[DANNY,'I didn\'t mean to kill him. He\'s dead anyway. That\'s on me.'],[DANNY,'And afterwards I agreed to keep it hidden. I let every one of you put up MISSING flyers. That\'s on me too.'],[DANNY,'I\'m not asking anybody to forgive me. I just won\'t say an oath on top of a lie.']]);
  c4Shot(c10W(0,3.4,4),c10W(0,1.2,-5),1.6);await c4Wt(.4)},done)}
async function c10ConfResp(done){await c10Cine(async()=>{c10Setup(6);const gr=c10K('grant'),ca=c10K('carter'),lo=c10K('logan'),b1=c10RingN(2),b2=c10RingN(6),ez=c10K('ezra');c4DanAt(...c10X(0,-4.4),PI);c4Shot(c10W(-3,1.8,-1),c10W(0,1.5,-5),0);
  await c8Lines([[b1,'We put his face on every telephone pole in town.'],[b2,'His mom called the house. I answered.'],[ez,'He was choking me. Danny pulled him off me. That\'s what happened. I was there.'],[lo,'…'],[ca,'This is a vision talking. Nobody listen to—'],[gr,'Carter. Quiet.']]);
  c4Shot(c10W(1,1.7,-3.4),c10W(0,1.7,-7),1.2);await c4Wt(.6);c10Mask(gr.g,0);await c4Wt(1);
  await c8Lines([[gr,'Honesty doesn\'t erase what happened, Danny. Nothing does. Andre is still gone.'],[gr,'But you can accept it and carry the responsibility for it, and still stand in this circle. Both of those can be true at the same time. They have to be.']])},done)}
async function c10Initiate(done){await c10Cine(async()=>{c10Setup(6);const gr=c10K('grant'),ez=c10K('ezra'),mc=c10K('marcus');c10Mask(gr.g,0,1);for(const n of[ez,mc])if(n&&n.pup)n.pup.st='';c4DanAt(...c10X(0,-4.4),PI);if(ez)c4To(ez,...c10X(-1.4,-4.2),1.2);if(mc)c4To(mc,...c10X(1.4,-4.2),1.2);c4Shot(c10W(0,2,-.4),c10W(0,1.4,-5.4),0);await c4Wt(1.6);c10Haze(1,1);
  await c8Lines([[gr,'Ezra Cole. Marcus Bell. Danny Kowalski. Say it with me.'],[gr,'One brotherhood.'],[DANNY,'One brotherhood.'],[gr,'One bond.'],[DANNY,'One bond.'],[gr,'One name.'],[DANNY,'One name.']]);
  for(const g of[ez&&ez.g,PM,mc&&mc.g]){if(!g)continue;c10Letters(g,1);const p=new THREE.Vector3();g.getWorldPosition(p);try{c6Spark(p.x,p.y+1.3,p.z,0xe2b64c,10);tone(523,.2,'sine',.05)}catch(e){}await c4Wt(.8)}
  big('ΑΣΡ',2200);try{noise(1.2,.1,1100)}catch(e){}await c8Lines([[null,'Three sets of letters. The circle closes around them.',2.8]])},done)}
async function c10Final(done){await c10Cine(async()=>{c10Setup(6);const gr=c10K('grant'),ca=c10K('carter'),lo=c10K('logan');
  // the vision lets go: masks come off, the lights come back, the woods go quiet
  c4Shot(c10W(0,3.6,8),c10W(0,1.2,-3),1.6);C10.trip=0;await c4Wt(1.4);c10WorldFx(0);c10Wins(0);c10Haze(0);c10Stones(0);
  for(let i=0;i<10;i++){const n=c10RingN(i);if(n){c10Mask(n.g,0);await c4Wt(.15)}}c10Mask(ca.g,0);c10Mask(lo.g,0);await c4Wt(.6);
  await c8Lines([[null,'The colours drain back out of the world. The Lodge windows are only windows. The trees are only trees.',3.4],[null,'The clearing looks exactly the way it did before the ritual. Nothing out here has changed.',3.2],[null,'Danny has.',2.4]]);
  // sunrise on the Lodge steps
  await c4Fade(async()=>{c4At(6.1);c4DanAt(115.4,1050,PI*.15);gr.x=116.8;gr.z=1050.2;gr.pup.tx=gr.x;gr.pup.tz=gr.z;gr.pup.face=-PI*.15;c4Shot([118.4,terrH(118,1053)+1.5,1053.6],[116.2,terrH(116,1050)+1.3,1050],0)});await c4Wt(.6);
  await c8Lines([[gr,'You know, you could\'ve waited until after initiation to tell us that.'],[DANNY,'I know.'],[gr,'Hell of a way to start your brotherhood.'],[DANNY,'Figured it was better than starting it with another lie.']]);
  // the Pledge Master and the Vice President, alone at the tree line
  await c4Fade(async()=>{const[x,z]=c10X(9.6,-3.4);ca.x=x;ca.z=z;ca.pup.tx=x;ca.pup.tz=z;ca.pup.face=-PI/2;lo.x=x-1.3;lo.z=z+.3;lo.pup.tx=lo.x;lo.pup.tz=lo.z;lo.pup.face=PI/2;c4Shot([x-.6,terrH(x,z)+1.6,z+2.8],[x-.6,terrH(x,z)+1.5,z],0)});await c4Wt(.6);
  await c8Lines([[lo,'So what happens now?'],[ca,'Nothing. We\'re still brothers. We\'re still in our positions. And tomorrow, everything goes back to normal.'],[lo,'You really think it\'s that simple?'],[ca,'It has to be.'],[lo,'Danny isn\'t the same person who walked in here tonight.'],[ca,'Then let\'s hope he remembers whose side he\'s on.']]);
  c4Shot([ca.x+.3,terrH(ca.x,ca.z)+1.75,ca.z+1.6],[ca.x,terrH(ca.x,ca.z)+1.65,ca.z],1);await c4Wt(.8);c10Mask(ca.g,1);try{noise(.2,.04,1800)}catch(e){}await c4Wt(1.4);
  // the celebration
  await c4Fade(async()=>{const tk=c10Cast('tank',-1.4,1.6,PI*.9,{mask:false});c10Mask(tk.g,0,1);gr.x=C10C.x+1.4;gr.z=C10C.z+1.2;gr.pup.tx=gr.x;gr.pup.tz=gr.z;c4DanAt(...c10X(0,0),0);c4Shot(c10W(0,2.4,6.6),c10W(0,1.4,0),0);
    for(let i=0;i<10;i++){const n=c10RingN(i);if(n){const a=i/10*TAU,[x,z]=c10X(Math.sin(a)*3.4,Math.cos(a)*3.4);c4To(n,x,z,2)}}});
  try{noise(1.4,.14,1000)}catch(e){}const T=TT;c5Anim(()=>{if(rnd()<.12){const[x,y,z]=c10W((rnd()-.5)*8,4+rnd()*3,(rnd()-.5)*8);try{c6Spark(x,y,z,[0xe2b64c,0x7d1f2c,0xffffff][Math.floor(rnd()*3)],10)}catch(e){}}return TT-T>6});
  await c8Lines([[c10K('tank'),'BROTHER DANNY! BROTHER EZRA! BROTHER MARCUS!'],[null,'They lift him onto their shoulders. Danny has changed. The house around him hasn\'t. Not yet.',3.6]]);
  big('CHAPTER 10 · RITUAL · COMPLETE',3200);await c4Wt(3.4)},done)}

// ================================================================ the quests
const c10Q=(n,id,name,steps,fin)=>({id,ch:10,main:1,name,at:[127,1073],pre:n>1?[C10IDS[n-2]]:undefined,steps:()=>[{t:'fx',f:()=>c10Setup(n)},...steps()],fin:fin||(()=>c5Next(C10IDS[n]))});
const C10M=[
 c10Q(1,'c10boy','The Boy Before',()=>[
   {t:'cine',run:c10Q1Open},
   c5List('Find the three things from home',['shirt','helmet','letter'].map(c10Q1Find)),
   c5List('Touch each memory',['shirt','helmet','letter'].map(k=>({k:'q10m'+k,l:'Remember '+C10Q1[k].name,at:()=>c10P(...C10Q1[k].real),act:'Remember',run:fin=>c10Memory(k,fin)}))),
   c5List('Follow the voice',C10ECHO.map(([dx,dz],i)=>({k:'q10e'+i,l:['The voice by the Lodge','The voice by the trees','The voice on the path','The voice near the middle'][i],need:i?()=>c5S().d['q10e'+(i-1)]:null,at:()=>c10P(dx,dz),act:'Follow the voice',r:2.6,run:c10Echo(i)}))),
   c10Go('Arrange the memories on the table',0,1.4,{act:'Set the memories down'}),
   {t:'cine',run:c10Q1Order},
   c10Go('Step into the memory',0,1.4,{act:'Step into the light'}),
   {t:'cine',run:c10Q1Project}]),
 c10Q(2,'c10choice','The Choice to Belong',()=>[
   c5List('Look at the things from college',[
     {k:'q10ca',l:'The duffel bag',at:()=>c10P(...C10Q2.duffel),act:'Look at it',run:c10College('duffel')},
     {k:'q10cb',l:'The prison sign',at:()=>c10P(...C10Q2.hughes),act:'Look at it',run:c10College('hughes')},
     {k:'q10cc',l:'The five-dollar bill',at:()=>c10P(...C10Q2.five),act:'Pick it up',run:c10College('five')}]),
   c5List('Find the memory of Big Ed',[{k:'q10ed',l:'Big Ed, by the Lodge porch',at:()=>c10P(-3.4,-6),act:'Go to him',run:fin=>c10BigEd(fin)}],{start:()=>{c4Off('c10g');c10Ghost('ed',...c10X(-3.4,-8),0,'Big Ed Kowalski','a memory',{abs:1,key:'edwait'})}}),
   {t:'fx',f:()=>{const e=c10G('edwait');if(e)c10Fade(e)}},
   c5List('Follow the memory cues',[0,1,2].map(i=>({k:'q10q'+i,l:['The first lantern','The second lantern','The third lantern'][i],need:i?()=>c5S().d['q10q'+(i-1)]:null,at:()=>c10P(...[[-7.4,.6],[-3.4,-3.6],[1.6,-5.4]][i]),act:'Follow the light',r:2.4,run:c10Cue(i)})),{start:()=>{if(C10.cues)C10.cues[0].visible=true}}),
   {t:'cine',run:c10Throne},
   c5List('Belonging, or pressure to fit in?',Object.keys(C10FR).map(c10FrItem),{start:()=>c10FrShow(1)}),
   {t:'cine',run:c10Q2End}]),
 c10Q(3,'c10chairs','The Empty Chairs',()=>[
   {t:'cine',run:c10Q3Open},
   c5List('Look at each empty chair',[0,1,2,4].map(c10ChairItem)),
   c10WhistleStep(),
   c5List('What was left around his chair',['clip','pin','mask'].map(c10AndreItem),{start:()=>c10AndreObj(1)}),
   c10StayStep('Stay by Andre\'s chair through the whole memory',()=>{const[x,z]=c10ChairXZ(C10ANDRE);return{x,z}},2.8,['Andre running roll call in the rain, clipboard over his head.','Andre splitting a sandwich with Ezra at two in the morning, during Hell Week.','Andre telling a freshman where the good bathroom is.','Andre in a sheep mask, doing what he was told.','Andre on the wet concrete, not getting up.'],4),
   c5List('Leave something for Andre',[{k:'q10w',l:'Set his roll-call whistle on the chair',at:()=>{const[x,z]=c10ChairXZ(C10ANDRE);return{int:null,x,z}},act:'Set it down',run:fin=>c10Q3Place(fin)}]),
   {t:'cine',run:c10Q3End}]),
 c10Q(4,'c10room','The Room Remembers',()=>[
   {t:'fx',f:()=>c10RmSet()},
   c5List('Find the three places the room remembers',C10RM.map(c10RmFind)),
   c5List('Watch each memory',C10RM.map(c10RmView)),
   c5List('Find the source of each sound',C10RM.map(c10RmSrc)),
   c5List('Compare what each memory left behind',C10RM.map(c10RmObj)),
   c10Go('Go to the chalkboard',0,-2.2,{act:'Put the memories in order'}),
   {t:'cine',run:c10RmOrder}]),
 c10Q(5,'c10values','The Seven Values',()=>[
   c9Go('Go to the first inscription: Loyalty',()=>{const[x,z]=c10StoneXZ(0);return{int:null,x,z}},{r:2.4,act:'Touch the stone'}),
   {t:'cine',run:d=>c10Value(0)(d)},
   c5List('Identify the choice behind each value',[1,2,3,4,5,6].map(i=>({k:'q10v'+i,l:C9VAL[i].charAt(0)+C9VAL[i].slice(1).toLowerCase(),at:()=>{const[x,z]=c10StoneXZ(i);return{int:null,x,z}},act:'Touch the stone',r:2.4,run:c10Value(i)}))),
   c10Go('Return to the center and review the seven values',0,0,{act:'Look at all seven'}),
   {t:'cine',run:c10ValReview},
   c10Go('Stand before the masked brothers',0,-4.6,{act:'Step up to Grant'}),
   {t:'cine',run:c10ValOath}]),
 c10Q(6,'c10confess','The Confession',()=>[
   c10Go('Approach the final memory',0,1.6,{act:'Reach into the memory'}),
   {t:'cine',run:c10ConfMem},
   {t:'cine',run:c10ConfAsk},
   c10Go('Step forward',0,-4.4,{act:'Step forward'}),
   {t:'cine',run:c10Confess},
   c10StayStep('Stay where you are. Let them answer.',()=>c10P(0,-4.4),1.8,['Nobody moves.','Somebody in the circle swears under his breath.','Ezra is crying. Marcus has a hand on his shoulder.','The Pig mask turns away. The Goat mask doesn\'t.'],3),
   {t:'cine',run:c10ConfResp},
   {t:'cine',run:c10Initiate},
   {t:'cine',run:c10Final},
   {t:'fx',f:()=>{c10CleanAll();try{c6GrantHide(0)}catch(e){}ending('ritual')}}],()=>{})];
M.push(...C10M);
