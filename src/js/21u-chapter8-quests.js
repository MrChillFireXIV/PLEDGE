// ================================================================ V161 CHAPTER 8 · INTO THE HAZE ROOM, part 2: scenes, quests
const c8Cine=(run,done,o)=>c6Cine(run,done,o);
const c8W=(x,y,z)=>{const I=INT.c8haze;return[I.x0+x,y,I.z0+z]};
// dialogue: [n,text] conversation box · [DANNY,text] Danny's box · [null,text,secs] narration · numbers wait · functions run
async function c8Lines(L){for(const l of L){if(typeof l==='number'){await c4Wt(l);continue}if(typeof l==='function'){await l();continue}const[n,t,d]=l;
  if(n===DANNY){await c8Dan(t);continue}if(!n){c1Sub('',t);await c4Wt(d||2.8);c1Sub(null);continue}if(c4Live(n))await c1Line(n,t)}}
// a choice in the conversation box; opts [[label, ok?, reply]] — a wrong pick gets its reply and the question comes back without it
async function c8Choose(n,title,text,opts){let o=opts.slice();for(let k=0;k<4;k++){const pickOk=C4.auto?o.findIndex(x=>x[1]):-1;
    const i=pickOk>=0?pickOk:await new Promise(res=>card({title,sp:n&&n.name?n.name+(n.title?' · '+n.title:''):'',text,focus:n&&NP.includes(n)?n:DANNY,ch:o.map((x,j)=>[x[0],()=>{mode='cine';res(j)}])}));const c=o[i];
    if(c[1])return c;if(c[2])await c8Lines(c[2]);o=o.filter(x=>x!==c);if(o.length===1)return o[0]}return o[0]}
// everyone the current scene needs, restored after a reload
function c8Ensure(){if(P.inside!=='c8haze')goIn('c8haze',13,17);const S8=c8S();const D_=S.done||{};if(D_.c8drink)S8.lukeDead=1;if(D_.c8drink&&!D_.c8dark)S8.strip=S8.strip||!!D_.c8wash;if(D_.c8dark)S8.dog=1;if(D_.c8dog)S8.dogCrate=1;if(D_.c8masks)S8.unmasked=1;if(D_.c8nomore)S8.andreDead=1;
  for(const[k,x,z]of[['goat',12,6.5],['sheep',9.8,7],['pig',14.6,7]]){if(k==='sheep'&&S8.andreDead)continue;if(!c8K(k))c8Keeper(k,x,z,0,{masked:!S8.unmasked})}
  if(S8.unmasked)for(const k of['goat','sheep','pig']){const n=c8K(k);if(!n)continue;if(n.c8mask)c8Unmask(n,1);n.name=C8K[k][0];n.title=C8K[k][1]}
  for(const[k,i]of[['luke',0],['ezra',2],['marcus',3]]){if(k==='luke'&&S8.lukeDead)continue;if(!c8A(k)){const[x,z]=C8CHAIRS[i];c8Assoc(k,x+.7,z+1.8,PI)}}
  if(S8.lukeDead)c8Sheet('c8sheetL',8.4,14.2);if(S8.andreDead)c8Sheet('c8sheetA',34.6,8.4);
  if(S8.strip){c8Strip(PM,1);for(const k of['ezra','marcus']){const n=c8A(k);if(n)c8Strip(n.g,1)}}
  if(S8.grant&&!c8Gr()){C8.gr=c4Dup('grant',...c8X(6,7),PI/2,{tag:'c8g',pup:1,int:'c8haze'})}
  if(S8.dog&&!C8.dog){c8Dog(1,...(S8.dogCrate?[40,18]:[12,9.5]));if(S8.dogCrate&&C8.dog){C8.dog.crate=1}}}
const c8Gr=()=>{const n=C4.cast['Grant Ashby'];return c4Live(n)&&n.int==='c8haze'?n:null};
function c8Sheet(name,x,z){c4Group(name,1,g=>{const[X,,Z]=c8W(x,0,z);const s=new THREE.Mesh(bgeo(.8,.18,1.9),mt(0xeeeae2,.95));s.position.set(X,.1,Z);s.rotation.y=.2;g.add(s);const h=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),mt(0xeeeae2,.95));h.scale.set(.2,.12,.22);h.position.set(X-.18,.2,Z+.85);g.add(h)})}
function c8PadOnP(on){if(PM.userData.c8pad){PM.userData.c8pad.parent&&PM.userData.c8pad.parent.remove(PM.userData.c8pad);PM.userData.c8pad=null}if(!on)return;const h=PM.P&&PM.P.hR;if(!h)return;const g=new THREE.Group();const p=new THREE.Mesh(bgeo(.08,.8,.22),mt(0x8a5a2a,.6));p.position.y=-.5;g.add(p);g.traverse(o=>o.userData.noMerge=1);h.add(g);PM.userData.c8pad=g;if(C8.paddles&&C8.paddles[0])C8.paddles[0].visible=false}
const C8DRINK=['It burns all the way down.','The room tilts a little.','The Goat refills your cup before it\'s empty.','Luke\'s hands are shaking. He keeps drinking.','The clock is very loud now.','You can\'t feel your face.'];
function c8DoDrink(){const S8=c8S();S8.drinks=(S8.drinks||0)+1;c8Drunk(Math.min(4,S8.drinks*.75));try{tone(180,.18,'sine',.06);noise(.12,.05,700)}catch(e){}toast(C8DRINK[(S8.drinks-1)%C8DRINK.length],2400);
  for(const k of['luke','ezra','marcus']){const n=c8A(k);if(n&&n.pup){n.pup.arms=-1.2;setTimeout(()=>{if(c4Live(n)&&n.pup)n.pup.arms=null},700)}}const l=c8A('luke');if(l&&l.pup)l.pup.lean=Math.min(.5,(l.pup.lean||0)+.1)}

// ---------------------------------------------------------------- chapter 8 opening: the Santa sack
CHSCENE[8]=async function(){const fade=$('fade');fade.style.opacity=1;await c4Sl(500);endScene();C1.act=[];c4At(Math.max(S.gt,23.6));goIn('asr',4,8);const I=INT.asr;c4CamOn();c8S().open=1;
  // Danny's bunk, past midnight
  c4DanAt(I.x0+2.5,I.z0+4.6,0);C4.dan.lean=PI/2;C4.dan.y=.6;c4Shot([I.x0+5.4,2.2,I.z0+7.4],[I.x0+2.5,.7,I.z0+4.6],0);fade.style.opacity=0;big('CHAPTER 8 · INTO THE HAZE ROOM',2800);await c4Wt(2.4);
  await c8Lines([[null,'After a criminal uprising, a coalition, a wizard and the end of Delta Gamma Rho, Danny Kowalski wants one thing: sleep.',3.6],()=>{c1Sub('','z z z');},1.6]);c1Sub(null);
  // three masked men come in
  const o={tag:'c8x',int:'asr'};const mk=(k,x,z)=>{const n=c4Pup('brothers',I.x0+x,I.z0+z,PI,Object.assign({name:{goat:'The Goat',sheep:'The Sheep',pig:'The Pig'}[k],title:'???',lvl:7,house:null,noLetters:1,shirt:0x1a1a1c,sleeve:0x1a1a1c,pants:0x141416},o));c8Mask(n,k);return n};
  const gt=mk('goat',8,9),sh=mk('sheep',8.8,10),pg=mk('pig',7.4,10.2);for(const[n,x,z]of[[gt,4,5.6],[sh,4.4,4],[pg,3.6,6.6]])c4To(n,I.x0+x,I.z0+z,1.4);
  c4Shot([I.x0+7.6,1.8,I.z0+8.6],[I.x0+5,1.4,I.z0+6.4],1);try{noise(.3,.05,500)}catch(e){}await c4Wt(3.2);
  C4.dan.lean=.6;c4Shot([I.x0+4.4,1.4,I.z0+3.2],[I.x0+3,1.3,I.z0+5.4],1.4);await c4Wt(.8);await c8Lines([[DANNY,'…Who\'s there? Tank?'],[DANNY,'What the— GET OFF ME—']]);
  // the sack
  const sack=c4Group('c8sack',1,g=>{const b=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),mt(0xc8202e,.85));b.scale.set(.55,.8,.5);g.add(b);const t=new THREE.Mesh(new THREE.ConeGeometry(.22,.4,10),mt(0xb81a24,.85));t.position.y=.85;g.add(t);const r=new THREE.Mesh(new THREE.TorusGeometry(.12,.03,6,12),mt(0xf2f2ee,.6));r.rotation.x=PI/2;r.position.y=.7;g.add(r)});
  sack.position.set(P.x,.9,P.z);PM.visible=false;try{c6Poof(P.x,1,P.z,0xc8202e)}catch(e){}try{noise(.4,.12,300)}catch(e){}await c4Wt(1);
  pg.pup.st='carry';let t=0;c5Anim(dt=>{t+=dt;if(!c4Live(pg)){return 1}sack.position.set(pg.x,1.55,pg.z);sack.rotation.z=.6;return t>7});for(const n of[gt,sh,pg])c4To(n,I.x0+8,I.z0+12,1.6);c4Shot([I.x0+4,2.2,I.z0+2.4],[I.x0+7,1.4,I.z0+10],1);await c4Wt(2.8);
  // the Haze Room
  await c4Fade(async()=>{c4Off('c8x');c4Group('c8sack',0);PM.visible=true;c4At(Math.max(S.gt,23.8));c8Ensure();for(const[k,i]of[['luke',0],['ezra',2],['marcus',3]]){const n=c8A(k),[x,z]=C8CHAIRS[i],[X,,Z]=c8W(x,0,z-.25);n.x=X;n.z=Z;n.pup.tx=X;n.pup.tz=Z;n.pup.face=PI;c8Tie(n)}
    const[dx,,dz]=c8W(C8CHAIRS[1][0],0,C8CHAIRS[1][1]-.25);c4DanAt(dx,dz,PI);C4.dan.st='sit';c8DanTie(1);c4Shot(c8W(13,1.4,16.5),c8W(12,1.1,11),0)});
  const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig');await c8Lines([[null,'Danny wakes up tied to a chair. Three other associates sit beside him, just as confused.',3.4]]);
  c4Shot(c8W(3,2,9),c8W(.5,1.4,5),1.2);await c8Lines([[null,'A steel door, chained and locked.',2.4]]);c4Shot(c8W(13,2.6,7),c8W(13,3.3,.4),1.2);await c8Lines([[null,'An old clock ticks above a chalkboard.',2.6]]);
  c4Shot(c8W(11,1.6,14),c8W(12,1.7,6.5),1.4);await c4Wt(.6);if(g)c4To(g,...c8X(12,8.4),1.2);await c4Wt(1.2);
  await c8Lines([[g,'Welcome to the Haze Room.'],[DANNY,'What the fuck is this?'],[p,'An opportunity.'],[s,'A very exclusive opportunity.'],[g,'You boys thought the semester was over? Not quite.']]);
  c4Shot(c8W(13,3,5),c8W(13,3.5,.4),1.4);for(let i=0;i<4;i++){try{tone(1600,.04,'square',.03)}catch(e){}await c4Wt(.9)}
  await c4Fade(async()=>{c4CamOff()});c5Next('c8invite');saveGame()};

// ---------------------------------------------------------------- quest a
async function c8UntieCine(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),p=c8K('pig');c4Shot(c8W(12,2,16),c8W(12,1.2,11),0);await c4Wt(.4);
  await c8Lines([[g,'Untie them. All of them. Stand up, associates. Stretch your legs.'],()=>{if(p)c4To(p,...c8X(11.5,13),2)},1.4,()=>{for(const k of['luke','ezra','marcus']){const n=c8A(k);c8Untie(n);if(n){const[x,z]=c8X(n.x-INT.c8haze.x0,n.z-INT.c8haze.z0+1.4);c4To(n,x,z,1.5)}}c8DanTie(0)},[g,'You\'ll want them.']])},done)}
async function c8NoExit(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig');c4At(Math.max(S.gt,.4));
  const key=c4M(bgeo(.05,.16,.02),mt(0xd8b040,.3,.8),0,0,0);c5Anim(()=>{if(!c4Live(g)){sc.remove(key);return 1}key.position.set(g.x+.25,1.5,g.z+.25);key.rotation.y+=.05});
  c4Shot(c8W(12,1.8,12),c8W(12,1.6,6.5),0);await c8Lines([[g,'This is the only key to that door. It stays with me.'],()=>{sc.remove(key)},[s,'Nobody leaves tonight.'],[p,'Nobody.'],[DANNY,'You can\'t keep us down here.'],[g,'Watch me.']])},done)}

// ---------------------------------------------------------------- quest b: the House Rules
const C8RULES=[['goat','1. The Goat always speaks first.'],['sheep','2. The Sheep never answers the same question twice.'],['pig','3. The Pig gets the final word.'],['goat','4. Nobody leaves without permission.'],['sheep','5. Nobody questions the rules.'],['goat','6. The rules can change whenever the Goat decides.']];
async function c8RulesCine(done){await c8Cine(async()=>{c8Ensure();c8Chalk([]);const g=c8K('goat');if(g)c4To(g,...c8X(11,2),1.4);c4Shot(c8W(13,2,8),c8W(13,1.9,.4),0);await c4Wt(1.4);
  await c8Lines([[g,'The House Rules. Learn them. Live by them.']]);const L=[];
  for(const[k,r]of C8RULES){L.push(r);c8Chalk(L.slice());try{noise(.5,.05,2800)}catch(e){}const n=c8K(k);await c8Lines([[n,r.replace(/^\d\. /,'')]])}
  c4Shot(c8W(12,1.8,13),c8W(12,1.6,6.5),1.2);await c8Lines([[c8K('pig'),'And the Pig gets the final word.']])},done)}
async function c8QuizCine(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),p=c8K('pig');c8Chalk([],'POP QUIZ');c4Shot(c8W(12,1.8,13),c8W(12,1.6,6.5),0);
  await c8Lines([[g,'Board\'s clean. Let\'s see what you memorized, Kowalski.']]);
  const Q=[['Who always speaks first?',[['"The Goat."',1],['"The Pig."',0,[[p,'Wrong. Again.']]],['"Whoever\'s loudest."',0,[[g,'Wrong. And loud.']]]]],
    ['How many times will the Sheep answer the same question?',[['"Twice."',0,[[c8K('sheep'),'No.']]],['"Once."',1],['"Never."',0,[[p,'Wrong. Again.']]]]],
    ['And who gets the final word?',[['"The Goat."',0,[[p,'WRONG.']]],['"Grant."',0,[[g,'Grant isn\'t here. Grant doesn\'t know you\'re here.']]],['"The Pig."',1]]]];
  for(const[q,opts]of Q){await c8Choose(g,'The House Rules','The Goat: "'+q+'"',opts);try{sfx('ok')}catch(e){}}
  await c8Lines([[p,'Good.'],()=>{c8Chalk(C8RULES.map(r=>r[1]))}])},done)}
async function c8RuleChange(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig');c4Shot(c8W(13,2,8.4),c8W(13,1.9,.4),0);
  await c8Lines([[g,'New rule. Rule three: the Goat gets the final word.'],()=>{const L=C8RULES.map(r=>r[1]);L[2]={t:L[2],x:1};L.push('3. The GOAT gets the final word.');c8Chalk(L);try{noise(.6,.06,2600)}catch(e){}},
    [p,'That\'s not— Rule three is the Pig gets the final word.'],[g,'Rule six.'],[s,'The rules can change whenever the Goat decides.'],[p,'…Fine.'],
    [DANNY,'(The rules are whatever the one talking wants them to be.)']])},done)}

// ---------------------------------------------------------------- quest c: drink until the clock stops
async function c8DrinkIntro(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),s=c8K('sheep'),l=c8A('luke');c4Shot(c8W(18,2,12),c8W(20.5,1,7),0);
  await c8Lines([[g,'Associates. Pick up a bottle.'],[g,'See the clock? That\'s your timer. You drink until it stops.'],[s,'And it stops when he says it stops.'],[l,'I told you guys. I don\'t drink. Like, ever.'],[g,'Tonight you do.']])},done)}
async function c8Unwell(done){await c8Cine(async()=>{c8Ensure();const l=c8A('luke'),e=c8A('ezra'),g=c8K('goat');if(!l){done();return}c4Shot(c8W(l.x-INT.c8haze.x0+2,1.6,l.z-INT.c8haze.z0+2.4),[l.x,.9,l.z],0);await c4Wt(.6);
  l.pup.lean=.9;await c4Wt(.8);l.pup.lie=1;try{noise(.3,.1,300)}catch(x){}await c4Wt(1.2);await c8Lines([[DANNY,'Luke? Hey. LUKE.'],[e,'He\'s not answering. Danny, he\'s not answering.'],[g,'He\'s fine. Keep drinking.']])},done)}
async function c8Death(done){await c8Cine(async()=>{c8Ensure();const l=c8A('luke'),g=c8K('goat'),s=c8K('sheep'),p=c8K('pig'),e=c8A('ezra'),m=c8A('marcus');
  if(l){l.pup.lie=1;c4Shot([l.x+2,1.4,l.z+2],[l.x,.5,l.z],0)}if(p&&l){c4To(p,l.x+.6,l.z+.3,2);await c4Wt(1.4);p.pup.st='sit'}await c4Wt(1.6);
  await c8Lines([[p,'…'],[p,'He\'s not breathing.'],()=>{for(const h of C8.hands)h.run=0},[null,'The clock stops.',3.2],[DANNY,'You killed him.'],[g,'Nobody killed anybody. He drank.'],[s,'We keep going.'],[null,'Luke Harmon was nineteen.',3.4]]);
  c8S().lukeDead=1;if(l)despawn(l);c8Sheet('c8sheetL',8.4,14.2);if(p&&p.pup)p.pup.st='';c8Drunk(0);await c4Wt(1)},done)}

// ---------------------------------------------------------------- quest d: the Washout
async function c8HoseIntro(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig');if(p){const[x,z]=c8X(42,7);p.x=x;p.z=z;p.pup.tx=x;p.pup.tz=z;p.pup.face=-PI/2;const h=c4M(new THREE.CylinderGeometry(.03,.04,.3,8),mt(0x2a8a2a,.6),0,0,0,p.g);h.position.set(.25,1.15,.3);h.rotation.x=PI/2}
  for(const[k,x,z]of[['ezra',33,6],['marcus',35,9.5]]){const n=c8A(k);if(n){const[X,Z]=c8X(x,z);n.x=X;n.z=Z;n.pup.tx=X;n.pup.tz=Z}}
  c4Shot(c8W(30,2.2,11),c8W(38,1.2,7),0);await c8Lines([[g,'Rinse off. All of you.'],[s,'It\'s cold. That\'s the point.'],[p,'Hold still. Or don\'t. Your call.']])},done)}
async function c8RefuseHose(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),e=c8A('ezra');c4Shot(c8W(31,1.8,10),c8W(34,1.5,6.5),0);
  await c8Lines([[g,'Your turn, Kowalski. Take the hose. Spray them down and you\'re done for the night.']]);
  await c8Choose(g,'The Washout','The Goat holds out the hose.',[['"(Take the hose and spray Ezra.)"',0,[[DANNY,'(…No. Not them.)']]],['"No."',1],['"Spray them yourself."',1]]);
  await c8Lines([[g,'Suit yourself.'],[e,'…Thanks, Danny.']])},done)}

// ---------------------------------------------------------------- quest e: alone in the dark
async function c8Separate(done){await c8Cine(async()=>{c8Ensure();c8Cold(0);const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig'),e=c8A('ezra'),m=c8A('marcus');
  c4Shot(c8W(13,2.6,19),c8W(13,1.4,24),0);await c8Lines([[g,'Separate them.']]);
  if(m&&p){c4To(m,...c8X(7,29),1.8);c4To(p,...c8X(7.6,27.4),1.8)}if(e&&s){c4To(e,...c8X(20,29),1.8);c4To(s,...c8X(20,27.4),1.8)}c4DanTo(...c8X(32,24.6),1.8);if(g)c4To(g,...c8X(31,23.6),1.8);await c4Wt(3.4);
  c8Doors(1);for(const n of[p,s])if(n)c4To(n,...c8X(n===p?7.6:20,24),1.8);try{noise(.25,.16,200);noise(.25,.16,220)}catch(x){}await c8Lines([[g,'You get the room with your name in it. You\'re welcome.']])},done,{after:()=>{const g=c8K('goat');if(g)c4To(g,...c8X(31,23.6),1.8)}})}
async function c8SpeakerCine(done){await c8Cine(async()=>{c8Ensure();c4Off('c8v');const v=c8Voice('The Goat','over the speaker',42.4,30);c4Shot(c8W(36,2.2,29),c8W(43,4.4,30),0);
  await c8Lines([[v,'Can you hear me, Kowalski?'],[v,'Ezra already quit on you. He says this is all your fault.'],[v,'Marcus told us Luke was your idea.'],[v,'Nobody is coming. Grant doesn\'t even know you\'re gone.'],[DANNY,'You\'re lying.'],[v,'Am I?']])},done,{after:()=>c4Off('c8v')})}
async function c8Crawl(done){await c8Cine(async()=>{c8Ensure();const e=c8A('ezra'),m=c8A('marcus');try{noise(.3,.1,1600)}catch(x){}if(C8.vent)C8.vent.visible=false;
  await c4Fade(async()=>{c4DanAt(...c8X(24.4,31),-PI/2);if(e){const[x,z]=c8X(22,30.4);e.x=x;e.z=z;e.pup.tx=x;e.pup.tz=z}c4Shot(c8W(20,1.8,33),c8W(24,1,31),0)});
  await c8Lines([[null,'The vent is tight, filthy and freezing. You come out the other side on your elbows.',3.2],[e,'Danny! You came through the WALL.'],[DANNY,'They\'re lying to all three of us. Come on.']]);
  await c4Fade(async()=>{c8Doors(0);C8.lock=null;c4DanAt(...c8X(8,24.4),PI);if(e){const[x,z]=c8X(9.4,24.2);e.x=x;e.z=z;e.pup.tx=x;e.pup.tz=z}if(m){const[x,z]=c8X(7.2,27.4);m.x=x;m.z=z;m.pup.tx=x;m.pup.tz=z}c4Shot(c8W(11,2,23),c8W(8,1.4,26),0)});
  await c8Lines([[null,'The bolt on Marcus\'s door slides open from the outside.',2.4],[m,'You guys didn\'t leave.'],[DANNY,'Nobody\'s leaving anybody.']])},done)}

// ---------------------------------------------------------------- quest f: the dog
async function c8DogDemand(done){await c8Cine(async()=>{c8Ensure();if(!C8.dog)c8Dog(1,12,9.5);c8S().dog=1;const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig');
  c4Shot(c8W(15,1.4,13),c8W(12,.5,9.5),0);await c4Wt(.4);c8Bark();await c4Wt(.8);
  const pad=c4Group('c8pad',1,G=>{const[x,,z]=c8W(20.5,0,7.6);const m=new THREE.Mesh(bgeo(.8,.06,.22),mt(0x8a5a2a,.6));m.position.set(x,.84,z);G.add(m)});
  c4Shot(c8W(13,1.9,12),c8W(12,1.5,7),1.2);await c8Lines([[g,'One last test.'],[g,'Nobody leaves this room until the dog is dead.'],[s,'It\'s a dog. Don\'t overthink it.'],[p,'…Goat. Come on, man.']])},done)}
async function c8RefuseDog(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),s=c8K('sheep'),e=c8A('ezra'),m=c8A('marcus');c4Shot(c8W(11,1.8,13),c8W(12,1.5,7),0);
  await c8Choose(g,'The Dog\'s Last Test','The Goat nods at the paddle on the table.',[['"(Pick up the paddle.)"',0,[[DANNY,'(…No. Not a chance.)']]],['"No."',1],['"Touch that dog and you go through me."',1]]);
  await c8Lines([[s,'Luke died for nothing if you quit now. Think about that.'],[e,'I\'m with Danny.'],[m,'…Me too.']])},done)}
async function c8Argue(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig');c4Shot(c8W(12,1.8,13),c8W(12,1.6,6.5),0);
  await c8Lines([[p,'This is too far. We\'re done, Goat.'],[g,'We\'re done when I say we\'re done.'],[s,'We do what the Goat says. Rule six.'],[p,'There\'s a kid under a SHEET over there!'],[g,'Then don\'t look at him.']])},done)}

// ---------------------------------------------------------------- quest g: the masks come off
async function c8UnmaskCine(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),s=c8K('sheep'),p=c8K('pig');for(const[n,x]of[[g,12],[s,9.8],[p,14.6]])if(n){const[X,Z]=c8X(x,7);n.x=X;n.z=Z;n.pup.tx=X;n.pup.tz=Z;n.pup.face=0}
  c4Shot(c8W(12,1.8,13),c8W(12,1.7,7),0);await c8Lines([[g,'Fine. You want to see who we are? Look.']]);
  for(const[n,k]of[[g,'goat'],[s,'sheep'],[p,'pig']]){if(!n)continue;c4Shot([n.x+.2,1.75,n.z+2.6],[n.x,1.65,n.z],1.2);await c4Wt(1);c8Unmask(n);n.name=C8K[k][0];n.title=C8K[k][1];big(C8K[k][0].toUpperCase()+' · '+C8K[k][1].replace('ΑΣΡ ','').toUpperCase(),2200);await c4Wt(2.2)}
  c8S().unmasked=1;await c8Lines([[DANNY,'Carter. Andre. Logan.'],[p,'Don\'t look at me like that, Kowalski.']])},done)}
async function c8Why(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat');c4Shot(c8W(11.4,1.75,10),c8W(12,1.65,7),0);
  await c8Lines([[g,'You want to know why you\'re here? You\'re the reason this whole night exists.'],[g,'Brothers have been complaining about you for weeks. Arrogant. Grant\'s little favorite. Too popular for a pledge who hasn\'t earned a thing.'],[g,'They wanted you humbled. So I organized it.']])},done)}
async function c8VPCine(done){await c8Cine(async()=>{c8Ensure();const p=c8K('pig');c4Shot(c8W(14,1.75,10),c8W(14.6,1.65,7),0);
  await c8Lines([[p,'Look, it\'s tradition. Discipline. Every pledge class before you went through this room.']]);
  await c8Choose(p,'The Masks Come Off','Logan waits for you to agree.',[['"That\'s not fair."',0,[[p,'Fair? Life isn\'t fair, Kowalski.']]],['"Okay."',0,[[DANNY,'(No. Not okay.)']]],['"Tradition? Luke Harmon is DEAD under a sheet. Tell his mom about tradition."',1]]);
  await c8Lines([[p,'…'],[null,'Logan Pierce doesn\'t have an answer. He looks at the floor.',3]])},done)}

// ---------------------------------------------------------------- quest h: no more games
async function c8Snap(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat');c4Shot(c8W(12,1.9,12),c8W(12,1.6,7),0);
  await c8Lines([[g,'Here\'s what happens now. Nobody walks out of here and tells anybody about Luke.'],[g,'Logan. Andre. Paddles. Hold them down.']])},done)}
async function c8AndreScene(done){await c8Cine(async()=>{c4Off('c8f');c4Off('c8k');c4Off('c8a');const a=c8Keeper('sheep',34.6,8.2,PI,{masked:false,tag:'c8x'}),e=c8Assoc('ezra',34.6,9.2,0,{tag:'c8x'}),m=c8Assoc('marcus',31,11,PI*.7,{tag:'c8x'});for(const n of[e,m])c8Strip(n.g,1);e.pup.lie=1;a.pup.st='punch';
  c4DanAt(...c8X(30.4,9.6),PI/2);c4Shot(c8W(30,1.8,13.4),c8W(34,1,8.6),0);await c4Wt(.6);
  await c8Lines([[a,'This is YOUR fault! All of you!'],[e,'DANNY!']]);c4DanTo(...c8X(33.6,8.8),4);c4Shot(c8W(32,1.6,10.6),c8W(34.4,1.2,8.4),1.4);await c4Wt(1);C4.dan.st='punch';
  $('fade').style.opacity=1;await c4Wt(.6);for(let i=0;i<3;i++){try{noise(.12,.2,160);tone(60,.12,'sine',.12)}catch(x){}await c4Wt(.6)}
  a.pup.st='';a.pup.lie=1;e.pup.lie=0;C4.dan.st='';c8PadOnP(0);c4Group('c8pdrop',1,G=>{const[x,,z]=c8W(33,0,9.4);const p=new THREE.Mesh(bgeo(.8,.06,.22),mt(0x8a5a2a,.6));p.position.set(x,.04,z);p.rotation.y=.7;G.add(p)});
  $('fade').style.opacity=0;await c8Lines([[null,'Danny doesn\'t remember deciding to swing. He remembers the sound.',3.4],[e,'Danny… he\'s not moving.'],[m,'Is he—'],[null,'Andre Wallace doesn\'t get up.',3]]);c8S().andreDead=1},done,{after:()=>{c4Off('c8x')}})}
async function c8ConfrontPM(done){await c8Cine(async()=>{c4Off('c8f');c8Ensure();const g=c8K('goat'),p=c8K('pig');if(g){const[x,z]=c8X(31,6.4);g.x=x;g.z=z;g.pup.tx=x;g.pup.tz=z}if(p){const[x,z]=c8X(29.4,5.6);p.x=x;p.z=z;p.pup.tx=x;p.pup.tz=z}
  c8Sheet('c8sheetA',34.6,8.4);c4DanAt(...c8X(32,8.6),PI*1.1);c4Shot(c8W(33.6,1.8,10),c8W(31,1.6,6.4),0);
  await c8Lines([[g,'Look at him. Look at what you did.'],[DANNY,'What WE did? You killed Luke.'],[g,'Then we both have a body, don\'t we.'],[g,'Here\'s the deal. Nobody tells anyone what happened to Andre. Andre panicked and ran. You never saw him again.'],
    [p,'Carter—'],[g,'If you talk, I tell them who swung the paddle. If I talk, they find this room, and Luke, and everything else. Both sides have too much to lose.'],[DANNY,'(He\'s right. That\'s the worst part.)']])},done)}

// ---------------------------------------------------------------- quest i: the unspoken agreement
function c8Bulk(on){if(!on){c4Group('c8bulk',0);return}c4Group('c8bulk',1,g=>{const[x,z]=c3Free(19.5,40),y=terrH(x,z);for(const s of[-1,1]){const d=new THREE.Mesh(bgeo(.75,.06,1.6),mt(0x4a4e52,.5,.6));d.position.set(x+s*.4,y+.35,z);d.rotation.z=s*.35;g.add(d)}const fr=new THREE.Mesh(bgeo(1.8,.3,1.8),mt(0x8a8478,.9));fr.position.set(x,y+.12,z);g.add(fr);const sg=signMesh('HAZE ROOM',.9,.2,'#2a2a2a','#c8c0b0');sg.position.set(x,y+.45,z+.92);g.add(sg);C8.bulkP=[x,z]})}
async function c8GrantSearch(done){await c8Cine(async()=>{c4At(Math.max(S.gt,3.2)<5?3.2:S.gt);goIn('asr',16,26);const I=INT.asr,o={tag:'c8g',int:'asr'};const g=c4Dup('grant',I.x0+16,I.z0+24,PI,Object.assign({pup:1},o)),t=c4Dup('tank',I.x0+18,I.z0+26,-PI/2,Object.assign({pup:1},o));
  c4DanAt(I.x0+60,I.z0+30,0);PM.visible=false;c4Shot([I.x0+19.4,1.9,I.z0+28.4],[I.x0+16.8,1.5,I.z0+24.6],0);await c4Wt(.4);
  await c8Lines([[null,'3:12 AM. The ΑΣΡ house.',2.4],[g,'Tank. Have you seen Danny?'],[t,'Not since he went to bed. Why?'],[g,'His phone\'s been going to voicemail for four hours.']]);
  await c4Fade(async()=>{c4To(g,I.x0+3,I.z0+6,2);g.x=I.x0+4;g.z=I.z0+7;c4Group('c8tinsel',1,G=>{for(let i=0;i<9;i++){const m=new THREE.Mesh(bgeo(.12,.01,.03),mt(0xc8202e,.5));m.position.set(I.x0+2.6+i*.5,.02,I.z0+5+i*.6);m.rotation.y=i;G.add(m)}});c4Shot([I.x0+6,1.6,I.z0+9],[I.x0+3,.6,I.z0+5.4],0)});
  await c8Lines([[null,'Danny\'s bunk is empty. The sheets are on the floor. A trail of red fabric leads out the door.',3.4],[g,'…Red felt. Like a Santa sack.'],[g,'Carter\'s been carrying a Santa sack around all week.']]);
  await c4Fade(async()=>{c4Off('c8g');c4Group('c8tinsel',0);goOut(24,40);c8Bulk(1);const[bx,bz]=C8.bulkP;const g2=c4Dup('grant',bx+3,bz+4,Math.atan2(-3,-4),{tag:'c8g',pup:1,int:null});c4To(g2,bx+.4,bz+1.2,2.4);c4Shot([bx+5,2.2,bz+6],[bx,.6,bz],0)});
  await c4Wt(2.2);await c8Lines([[null,'Behind the old Kappa house, under the ivy: a cellar door nobody has opened in years. Fresh scratches around the lock.',3.6],[C4.cast['Grant Ashby'],'HAZE ROOM.'],[null,'Grant goes down.',2]]);
  // the Haze Room door comes open
  await c4Fade(async()=>{c4Off('c8g');PM.visible=true;c8Ensure();c4DanAt(...c8X(14,14),-PI/2);const g3=c4Dup('grant',...c8X(1.2,5),PI/2,{tag:'c8g',pup:1,int:'c8haze'});C8.gr=g3;c8S().grant=1;c4Shot(c8W(6,2,9),c8W(1,1.5,5),0)});
  try{noise(.3,.25,180);noise(.4,.2,900)}catch(x){}await c4Wt(.4);c4To(C8.gr,...c8X(6,7),2.6);await c4Wt(1.6);c4Shot(c8W(8,1.9,12),c8W(5,1.6,7),1.2);
  await c8Lines([[null,'Grant takes it in: the survivors, the dog, a sheet over Luke, another over Andre, Carter and Logan by the Washout.',3.8],[C8.gr,'What the hell happened down here?'],[C8.gr,'Nobody move. Nobody leaves. I\'m in charge now.']])},done,{after:()=>{PM.visible=true}})}
async function c8Negotiate(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),gr=c8Gr();c4Shot(c8W(10,1.8,12),c8W(8,1.6,7.5),0);
  await c8Lines([[gr,'Here\'s where we are. Two dead. Six people who know why. Nobody here wants the police in this room.']]);
  await c8Choose(gr,'The Unspoken Agreement','Grant looks at you. "Danny. What do you want out of this?"',[['"I want Carter to pay for Luke."',1],['"I want to go home."',1],['"I want this room bricked up. Forever."',1]]);
  await c8Lines([[gr,'Carter. The Haze Room is done. Tonight. You never run a pledge class again.'],[g,'…Fine.'],[gr,'And Andre panicked and ran. That\'s the story. From everybody.']])},done)}
async function c8Pact(done){await c8Cine(async()=>{c8Ensure();const g=c8K('goat'),p=c8K('pig'),gr=c8Gr(),e=c8A('ezra'),m=c8A('marcus');c4Shot(c8W(10,1.9,12.4),c8W(10,1.5,8),0);
  await c8Lines([[gr,'Nobody says what happened to Andre. Not you, not them, not me. Ever.'],[g,'Agreed.'],[p,'…Agreed.'],[e,'Agreed.'],[m,'Agreed.'],[DANNY,'…Agreed.']]);
  if(g)c4To(g,P.x+.8,P.z-.6,1.5);await c4Wt(1.6);c4Shot([P.x+1.6,1.5,P.z+1.2],[P.x+.4,1.2,P.z-.3],1.2);await c8Lines([[null,'Danny shakes Carter Vaughn\'s hand. Neither of them looks at the sheets.',3.2]])},done)}
async function c8Ending(done){await c8Cine(async()=>{c4At(Math.max(S.gt,5.8)<7?5.8:S.gt);c4Off('c8k');c4Off('c8a');c4Off('c8g');goOut(24,40);c8Bulk(1);const[bx,bz]=C8.bulkP;const o={tag:'c8g',pup:1,int:null};
  const gr=c4Dup('grant',bx+1.6,bz+2,PI*.8,o),e=c8Assoc('ezra',0,0,0,{tag:'c8g',int:null}),m=c8Assoc('marcus',0,0,0,{tag:'c8g',int:null});for(const[n,dx,dz]of[[e,-1.4,2.4],[m,-.4,3]]){n.x=bx+dx;n.z=bz+dz;n.pup.tx=n.x;n.pup.tz=n.z}
  c4DanAt(bx+.2,bz+2.2,PI);c8Strip(PM,0);c8Cold(0);c8Dog(1,0,0);if(C8.dog){C8.dog.x=bx+.9;C8.dog.z=bz+2.6;C8.dog.tx=C8.dog.x;C8.dog.tz=C8.dog.z;C8.dog.out=1}
  c4Shot([bx+5,2,bz+6],[bx,1.2,bz+2],0);await c4Wt(.8);await c8Lines([[null,'Dawn. Greek Row is quiet. The cellar door closes behind them.',3],[gr,'Go home. Sleep. We never talk about tonight.'],[e,'…See you around, Danny.']]);
  for(const n of[e,m])c4To(n,n.x+14,n.z+10,1.6);await c4Wt(1.6);
  await c4Fade(async()=>{c4Off('c8g');c4Group('c8bulk',0);goOut(80,80);const a=B.find(b=>b.id==='asr');const[x,z]=fpos(a,a.face,a.da,9);c4DanAt(x,z+.6,fry(a.face)+PI);if(C8.dog){C8.dog.x=x+.9;C8.dog.z=z+1.2;C8.dog.tx=C8.dog.x;C8.dog.tz=C8.dog.z}c4Shot([x-5,2.2,z+3],[a.ex,4,a.ez],0)});
  const a=B.find(b=>b.id==='asr');await c4Wt(1.4);await c8Lines([[null,'Danny Kowalski goes home with a dog nobody else wanted…',3],[null,'…and a secret that could destroy what\'s left of Alpha Sigma Rho.',3.4]]);
  c4DanTo(a.ex,a.ez+.6,1.4);if(C8.dog){C8.dog.tx=a.ex+.6;C8.dog.tz=a.ez+.9}let t=0;const[x,z]=fpos(a,a.face,a.da,9);c4Follow((tp,tl,dt)=>{t+=dt;tp.set(x-5-t*2.2,2.2+t*1.2,z+3+t*.4);tl.set(a.ex,4,a.ez)},0);await c4Wt(4.6);c4Follow(null);
  big('CHAPTER 8 · INTO THE HAZE ROOM · COMPLETE',3200);await c4Wt(3.4)},done,{after:()=>{c4Off('c8g');c8Dog(0);PM.visible=true}})}

// ================================================================ the quests
const c8T=(n,title,text,ch)=>fin=>c8Talk(n(),title,text,ch,fin);
const c8Note=(title,text,btn)=>fin=>{card({title,sp:'',alert:1,text,ch:[[btn||'Keep going',null]]});fin()};
const c8At=(x,z)=>()=>c8P(x,z);
const c8AtN=f=>()=>{const n=f();return n?{int:'c8haze',x:n.x,z:n.z}:c8P(12,12)};
const C8M=[
 {id:'c8invite',ch:8,main:1,name:'The Invitation Nobody Accepted',at:[84,79],steps:()=>[
   {t:'fx',f:()=>{c8Ensure();if(!c8S().untied){for(const k of['luke','ezra','marcus'])c8Tie(c8A(k));c8DanTie(1)}}},
   {t:'cine',run:d=>{c8UntieCine(()=>{c8S().untied=1;d()})}},
   c5List('Look around the Haze Room',[
     {k:'q8a1',l:'Look at the chalkboard',at:c8At(12,1.6),act:'Look at the chalkboard',run:c8Note('The Haze Room','A chalkboard, wiped almost clean. In one corner, in old chalk nobody ever erased: HAZE ROOM · EST. 1971. Under it, dozens of names. Every one crossed out.')},
     {k:'q8a2',l:'Look at the clock',at:c8At(14,1.8),act:'Look at the clock',run:c8Note('The Haze Room','The clock is the loudest thing in the room. It\'s ten minutes fast. Or slow. You can\'t tell anymore.')},
     {k:'q8a3',l:'Look at the table of bottles',at:c8At(20.5,8.4),act:'Look at the table',run:c8Note('The Haze Room','Nine bottles of the cheapest whiskey money can buy. A sleeve of red cups. A bucket on the floor beside the table.')},
     {k:'q8a4',l:'Look at the paddles on the wall',at:c8At(24.8,16.4),act:'Look at the paddles',run:c8Note('The Haze Room','Three wooden paddles on hooks. Painted letters: ΑΣΡ. HAZE. KEEP. One has a crack running down the middle.')}]),
   c5List('Identify the three other associates',[
     {k:'q8a5',l:'Talk to the associate on the end',at:c8AtN(()=>c8A('luke')),act:'Talk to him',run:c8T(()=>c8A('luke'),'The Invitation Nobody Accepted','"Luke. Luke Harmon. Associate. I don\'t drink, man. Like, at all. I told them that."')},
     {k:'q8a6',l:'Talk to the associate who keeps looking at the door',at:c8AtN(()=>c8A('ezra')),act:'Talk to him',run:c8T(()=>c8A('ezra'),'The Invitation Nobody Accepted','"Ezra Cole. They grabbed me out of the LIBRARY. Who gets kidnapped from a library?"')},
     {k:'q8a7',l:'Talk to the associate who\'s laughing a little too much',at:c8AtN(()=>c8A('marcus')),act:'Talk to him',run:c8T(()=>c8A('marcus'),'The Invitation Nobody Accepted','"Marcus Bell. I thought it was a prank. It\'s not a prank, is it."')}]),
   c5List('Examine the locked basement door',[
     {k:'q8a8',l:'Try the door',at:c8At(1.2,5),act:'Try the door',run:fin=>{try{noise(.35,.12,900)}catch(e){}c8Note('The Haze Room','A steel door, chained twice and padlocked. You pull. The chain clanks. Somewhere upstairs, nothing moves.')(fin)}},
     {k:'q8a9',l:'Check the hinges',at:c8At(1.2,6.2),act:'Check the hinges',run:c8Note('The Haze Room','The hinges are on the other side. Whoever built this room built it to keep people in.')}]),
   c5List('Speak with the Goat, the Sheep and the Pig',[
     {k:'q8a10',l:'Speak with the Goat',at:c8AtN(()=>c8K('goat')),act:'Talk to the Goat',run:c8T(()=>c8K('goat'),'The Invitation Nobody Accepted','"You\'ll speak when spoken to, associate. But I\'ll allow it. Once. We are the Keepers. Tonight you belong to us."')},
     {k:'q8a11',l:'Speak with the Sheep',at:c8AtN(()=>c8K('sheep')),act:'Talk to the Sheep',run:c8T(()=>c8K('sheep'),'The Invitation Nobody Accepted','"Don\'t ask me who I am. You\'ll find out when he decides."')},
     {k:'q8a12',l:'Speak with the Pig',at:c8AtN(()=>c8K('pig')),act:'Talk to the Pig',run:c8T(()=>c8K('pig'),'The Invitation Nobody Accepted','"Do what he says and this goes faster. Don\'t make it harder than it has to be."')}]),
   {t:'cine',run:c8NoExit}],
  fin:()=>c5Next('c8rules')},

 {id:'c8rules',ch:8,main:1,name:'The House Rules',at:[84,79],pre:['c8invite'],steps:()=>[
   {t:'fx',f:()=>c8Ensure()},
   {t:'cine',run:c8RulesCine},
   {t:'cine',run:c8QuizCine},
   c5List('Ask the Sheep for clarification',[
     {k:'q8b1',l:'Ask the Sheep what "permission" means',at:c8AtN(()=>c8K('sheep')),act:'Ask the Sheep',run:c8T(()=>c8K('sheep'),'The House Rules','"Permission comes from the Goat. Not from me. Not from the Pig. Not from you."')},
     {k:'q8b2',l:'Ask him the same thing again',need:()=>c5S().d.q8b1,at:c8AtN(()=>c8K('sheep')),act:'Ask him again',run:c8T(()=>c8K('sheep'),'The House Rules','"Rule two."\n\nHe doesn\'t say anything else. He doesn\'t even look at you.')}]),
   {t:'cine',run:c8RuleChange}],
  fin:()=>c5Next('c8drink')},

 {id:'c8drink',ch:8,main:1,name:'Drink Until the Clock Stops',at:[84,79],pre:['c8rules'],steps:()=>[
   {t:'fx',f:()=>{c8Ensure();for(const h of C8.hands)h.run=1}},
   {t:'cine',run:c8DrinkIntro},
   c8DrinkStep(5),
   c5List('Watch the other associates',[
     {k:'q8c1',l:'Watch Ezra',at:c8AtN(()=>c8A('ezra')),act:'Watch Ezra',run:c8Note('Drink Until the Clock Stops','Ezra is matching you cup for cup, eyes on the floor. His hands are steady. His face isn\'t.')},
     {k:'q8c2',l:'Watch Marcus',at:c8AtN(()=>c8A('marcus')),act:'Watch Marcus',run:c8Note('Drink Until the Clock Stops','Marcus pours half of every cup into his sleeve when the Pig isn\'t looking.')},
     {k:'q8c3',l:'Watch Luke',at:c8AtN(()=>c8A('luke')),act:'Watch Luke',run:fin=>{const l=c8A('luke');if(l&&l.pup)l.pup.lean=.55;c8Note('Drink Until the Clock Stops','Luke is grey. He stopped talking a while ago. He\'s breathing slow, and his cup is shaking in his hand.','(Something is wrong with Luke.)')(fin)}}]),
   {t:'cine',run:c8Unwell},
   c5List('Attempt to get help for Luke',[
     {k:'q8c4',l:'Shout for the Goat',at:c8AtN(()=>c8K('goat')),act:'Shout for the Goat',run:c8T(()=>c8K('goat'),'Drink Until the Clock Stops','"He\'s a lightweight. He\'ll sleep it off. Sit down and drink."')},
     {k:'q8c5',l:'Roll Luke onto his side',at:c8AtN(()=>c8A('luke')),act:'Roll him onto his side',run:fin=>{const l=c8A('luke');if(l&&l.pup){l.pup.face=(l.pup.face||0)+PI/2}c8Note('Drink Until the Clock Stops','You roll him onto his side the way they taught you in health class. He doesn\'t wake up. He doesn\'t do anything.')(fin)}},
     {k:'q8c6',l:'Pound on the steel door',at:c8At(1.2,5),act:'Pound on the door',run:fin=>{try{noise(.4,.2,200);noise(.4,.2,180)}catch(e){}c8Note('Drink Until the Clock Stops','You pound on the steel door until your fists hurt. Nobody upstairs comes.')(fin)}},
     {k:'q8c7',l:'Beg the Pig to call 911',at:c8AtN(()=>c8K('pig')),act:'Beg the Pig',run:c8T(()=>c8K('pig'),'Drink Until the Clock Stops','"…Goat. Maybe we should—"\n\nThe Goat: "Nobody calls anybody."')}]),
   {t:'cine',run:c8Death}],
  fin:()=>c5Next('c8wash')},

 {id:'c8wash',ch:8,main:1,name:'The Washout',at:[84,79],pre:['c8drink'],steps:()=>[
   {t:'fx',f:()=>{c8Ensure();for(const[k,x,z]of[['goat',30,4],['sheep',31.5,6],['pig',40,7]]){const n=c8K(k);if(n)c4To(n,...c8X(x,z),1.8)}}},
   go([0,0],'Follow the Keepers to the Washout Station',{r:3,goal:()=>{const p=c8P(32,7);return[p.x,p.z]},start:()=>{const st=curStep(),p=c8P(32,7);st.x=p.x;st.z=p.z}}),
   c5List('Change into your underwear',[{k:'q8d1',l:'Strip down at the lockers',at:c8At(29.6,1.6),act:'Strip down',run:fin=>{c8Strip(PM,1);for(const k of['ezra','marcus']){const n=c8A(k);if(n)c8Strip(n.g,1)}c8Note('The Washout','Down to your underwear on wet concrete. The others do the same without looking at each other.')(fin)}}]),
   {t:'cine',run:c8HoseIntro},
   c8HoseStep(18),
   {t:'cine',run:c8RefuseHose},
   go([0,0],'Return to the Haze Room, soaked and shivering',{r:3,goal:()=>{const p=c8P(13,15);return[p.x,p.z]},start:()=>{c8Cold(1);const st=curStep(),p=c8P(13,15);st.x=p.x;st.z=p.z}})],
  fin:()=>{c5Next('c8dark')}},

 {id:'c8dark',ch:8,main:1,name:'Alone in the Dark',at:[84,79],pre:['c8wash'],steps:()=>[
   {t:'fx',f:()=>{c8Ensure();c8Cold(1)}},
   {t:'cine',run:c8Separate},
   go([0,0],'Enter Danny\'s assigned room',{r:2.6,goal:()=>{const p=c8P(32,29);return[p.x,p.z]},start:()=>{const st=curStep(),p=c8P(32,29);st.x=p.x;st.z=p.z}}),
   c5List('Examine the room and its surroundings',[
     {k:'q8e1',l:'Read the chalkboard',at:c8At(35,34.6),act:'Read the chalkboard',run:c8Note('Alone in the Dark','DANNY. Written big, in fresh chalk. Under it, smaller: ARROGANT. GRANT\'S FAVORITE. TOO POPULAR. HUMBLE HIM.')},
     {k:'q8e2',l:'Look at the speaker on the wall',at:c8At(42.2,30),act:'Look at the speaker',run:c8Note('Alone in the Dark','A speaker grille, screwed high into the concrete. A thin wire runs from it into the ceiling. It hisses.')},
     {k:'q8e3',l:'Try the door',at:c8At(32,27),act:'Try the door',run:c8Note('Alone in the Dark','Bolted from the outside. You can hear the clock in Marcus\'s room through the wall.')},
     {k:'q8e4',l:'Look at the vent by the floor',at:c8At(26.9,31),act:'Look at the vent',run:c8Note('Alone in the Dark','A rusty vent, low on the wall you share with the next room. Four screws. Air moves through it.')}],{start:()=>{C8.lock=C8ROOM.danny;c8Doors(1);c8Cold(0)}}),
   {t:'cine',run:c8SpeakerCine},
   c5List('Find a way to communicate with the other survivors',[
     {k:'q8e5',l:'Tap on the vent',at:c8At(26.9,31),act:'Tap on the vent',run:fin=>{for(let i=0;i<3;i++)setTimeout(()=>{try{tone(900,.05,'square',.04)}catch(e){}},i*350);for(let i=0;i<3;i++)setTimeout(()=>{try{tone(760,.05,'square',.03)}catch(e){}},1600+i*350);setTimeout(()=>c8Note('Alone in the Dark','Tap. Tap. Tap.\n\nA second later, from the other side: tap. tap. tap.')(fin),2800)}},
     {k:'q8e6',l:'Whisper through the vent',need:()=>c5S().d.q8e5,at:c8At(26.9,31),act:'Whisper through the vent',run:fin=>{c4Off('c8v');const v=c8Voice('Ezra','through the vent',25.6,31);c8Talk(v,'Alone in the Dark','"Danny? Is that you? They told me you sold us out. They said you\'re the reason Luke—"',[['"They\'re lying to all of us. Every one of us."',()=>{setTimeout(()=>c4Off('c8v'),200)}]],fin)}}]),
   c5List('Reunite with the other two associates',[{k:'q8e7',l:'Unscrew the vent cover with your belt buckle',need:()=>c5S().d.q8e6,at:c8At(26.9,31),act:'Unscrew the vent',run:fin=>c8Crawl(fin)}])],
  fin:()=>{C8.lock=null;c8Doors(0);c5Next('c8dog')}},

 {id:'c8dog',ch:8,main:1,name:'The Dog\'s Last Test',at:[84,79],pre:['c8dark'],steps:()=>[
   {t:'fx',f:()=>{c8Ensure();C8.lock=null;c8Doors(0);c8Dog(1,12,9.5);c8S().dog=1}},
   go([0,0],'Discover the dog in the Haze Room',{r:3,goal:()=>{const p=c8P(12,11.5);return[p.x,p.z]},start:()=>{const st=curStep(),p=c8P(12,11.5);st.x=p.x;st.z=p.z}}),
   {t:'cine',run:c8DogDemand},
   {t:'cine',run:c8RefuseDog},
   c8ProtectStep(22),
   {t:'cine',run:c8Argue},
   c5List('Find a way to keep the dog safe',[
     {k:'q8f1',l:'Untie the dog',at:()=>{const D=C8.dog;return D?{int:'c8haze',x:D.x,z:D.z}:c8P(12,9.5)},act:'Untie the dog',run:fin=>{if(C8.dog)C8.dog.follow=1;c8Bark();c8Note('The Dog\'s Last Test','The rope comes off. The dog presses its whole body against your leg and won\'t leave it.')(fin)}},
     {k:'q8f2',l:'Get the dog some water in the Washout',need:()=>c5S().d.q8f1,at:c8At(42.6,7),act:'Get some water',run:c8Note('The Dog\'s Last Test','You fill a red cup at the spigot. The dog drinks three cups. Its tail starts going again.')},
     {k:'q8f3',l:'Lead the dog into the crate in the storage room',need:()=>c5S().d.q8f2,at:c8At(40,19.2),act:'Put the dog in the crate',run:fin=>{const D=C8.dog;if(D){D.follow=0;const[x,z]=c8X(40,18);D.tx=x;D.tz=z;D.crate=1}c8S().dogCrate=1;c8Note('The Dog\'s Last Test','The dog walks into the crate on its own and lies down. Nobody gets to it now without going through you.')(fin)}}])],
  fin:()=>c5Next('c8masks')},

 {id:'c8masks',ch:8,main:1,name:'The Masks Come Off',at:[84,79],pre:['c8dog'],steps:()=>[
   {t:'fx',f:()=>c8Ensure()},
   c5List('Find a way to keep the dog safe',[{k:'q8g1',l:'Latch the crate and cover it with a blanket',at:c8At(40,19.2),act:'Latch the crate',run:c8Note('The Masks Come Off','Latch. Blanket. A small, safe dark. The dog sighs once and goes quiet.')}]),
   {t:'cine',run:c8UnmaskCine},
   {t:'cine',run:c8Why},
   c5List('Hear Andre\'s explanation',[{k:'q8g2',l:'Ask Andre why he did it',at:c8AtN(()=>c8K('sheep')),act:'Talk to Andre',run:c8T(()=>c8K('sheep'),'The Masks Come Off','"I didn\'t have anything against you, Danny. I swear. Carter told me to wear the mask. I\'m the pledge captain. You do what the Pledge Master says."')}]),
   {t:'cine',run:c8VPCine},
   c5List('Discover that the Pledge Master organized the entire operation',[
     {k:'q8g3',l:'Read the clipboard on the table',at:c8At(20.5,8.4),act:'Read the clipboard',run:c8Note('The Masks Come Off','HAZE ROOM · NIGHT ONE\nTargets: KOWALSKI (priority). Harmon. Cole. Bell.\nSack: rented, receipt attached.\nKeys: C. VAUGHN ONLY.\n\nEvery line in the same handwriting.')},
     {k:'q8g4',l:'Look at Logan\'s phone',at:c8AtN(()=>c8K('pig')),act:'Look at the phone',run:c8Note('The Masks Come Off','A group chat called "HUMBLE THE PLEDGE." Thirty-one brothers. One admin: Carter Vaughn.')},
     {k:'q8g5',l:'Check the Santa sack in the corner',at:c8At(3,20),act:'Check the sack',run:c8Note('The Masks Come Off','The red sack they carried you in. A tag on the drawstring, in Sharpie: PROPERTY OF THE PLEDGE MASTER.','(Carter planned all of it.)')}],{start:()=>c4Group('c8sack2',1,g=>{const[x,,z]=c8W(3,0,20.4);const b=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),mt(0xc8202e,.85));b.scale.set(.6,.3,.5);b.position.set(x,.3,z);g.add(b)})})],
  fin:()=>c5Next('c8nomore')},

 {id:'c8nomore',ch:8,main:1,name:'No More Games',at:[84,79],pre:['c8masks'],steps:()=>[
   {t:'fx',f:()=>c8Ensure()},
   {t:'cine',run:c8Snap},
   c8FightStep(),
   c5List('Help the other surviving associates',[
     {k:'q8h1',l:'Help Ezra up',at:()=>{const n=C8.fight&&C8.fight.al[0];return n&&c4Live(n)?{int:'c8haze',x:n.x,z:n.z}:c8P(11,15)},act:'Help Ezra up',run:c8Note('No More Games','Ezra takes your hand. His lip is split. "I\'m good. I\'m good. Where\'s Marcus?"')},
     {k:'q8h2',l:'Pull Marcus away from the wall',at:()=>{const n=C8.fight&&C8.fight.al[1];return n&&c4Live(n)?{int:'c8haze',x:n.x,z:n.z}:c8P(15,15)},act:'Help Marcus',run:c8Note('No More Games','Marcus is shaking, but he\'s standing. "Okay. Okay. Get the dog. Get the dog, Danny."')}]),
   go([0,0],'Escape the immediate confrontation',{r:2.4,goal:()=>{const p=c8P(13.5,23.6);return[p.x,p.z]},start:()=>{const st=curStep(),p=c8P(13.5,23.6);st.x=p.x;st.z=p.z}}),
   c5List('Protect the dog',[{k:'q8h3',l:'Get the dog out of the crate',at:c8At(40,19.2),act:'Get the dog',run:fin=>{const D=C8.dog;if(D){D.crate=0;D.follow=1}c8Bark();c8Note('No More Games','The dog comes out of the crate and sticks to your heels.')(fin)}}]),
   c5List('Grab a paddle and beat Andre to death',[
     {k:'q8h4',l:'Grab a paddle off the wall',at:c8At(24.9,15.2),act:'Grab the paddle',run:fin=>{c8PadOnP(1);try{noise(.15,.1,600)}catch(e){}fin()}},
     {k:'q8h5',l:'Andre has Ezra pinned in the Washout: stop him',need:()=>c5S().d.q8h4,at:c8At(32,9),act:'Stop Andre',run:fin=>c8AndreScene(fin)}]),
   {t:'cine',run:c8ConfrontPM}],
  fin:()=>{c4Off('c8f');C8.fight=null;c5Next('c8deal')}},

 {id:'c8deal',ch:8,main:1,name:'The Unspoken Agreement',at:[84,79],pre:['c8nomore'],steps:()=>[
   {t:'cine',run:c8GrantSearch},
   c5List('Discuss the circumstances of Andre\'s death',[
     {k:'q8i1',l:'Talk to Grant',at:c8AtN(()=>c8Gr()),act:'Talk to Grant',run:c8T(()=>c8Gr(),'The Unspoken Agreement','"Tell me exactly what happened, Danny. Exactly. Leave nothing out. Not one thing."')},
     {k:'q8i2',l:'Talk to Ezra',at:c8AtN(()=>c8A('ezra')),act:'Talk to Ezra',run:c8T(()=>c8A('ezra'),'The Unspoken Agreement','"He was on top of me. He had his hands on my neck. Danny didn\'t have a choice. Nobody had a choice down here."')},
     {k:'q8i3',l:'Talk to Marcus',at:c8AtN(()=>c8A('marcus')),act:'Talk to Marcus',run:c8T(()=>c8A('marcus'),'The Unspoken Agreement','"Luke died first. Remember that. Whatever anybody says later, Luke died first, and they wouldn\'t call anyone."')}]),
   c5List('Hear the Pledge Master\'s concerns about the investigation',[{k:'q8i4',l:'Hear Carter out',at:c8AtN(()=>c8K('goat')),act:'Talk to Carter',run:c8T(()=>c8K('goat'),'The Unspoken Agreement','"If police come down those stairs, they find two bodies. One of them has a paddle-shaped answer. Your pledges go to prison, Grant. And the house goes down with them."')}]),
   {t:'cine',run:c8Negotiate},
   {t:'cine',run:c8Pact},
   go([0,0],'Leave the room with the agreement intact',{r:2.4,goal:()=>{const p=c8P(1.6,5);return[p.x,p.z]},start:()=>{const st=curStep(),p=c8P(1.6,5);st.x=p.x;st.z=p.z;if(C8.dog)C8.dog.follow=1}}),
   {t:'cine',run:c8Ending}],
  fin:()=>{c8CleanAll();c8S().done=1;toast('Chapter 8 complete. Nobody talks about the Haze Room.',5200)}}];
M.push(...C8M);
