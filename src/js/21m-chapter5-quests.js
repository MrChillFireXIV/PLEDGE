// ================================================================ V129 CHAPTER 5 · THE HUGHES WAR, part 2: scenes, quests, hooks
const C5PRES=[['Derek Vance','dto','ΔΤΩ President'],['Nolan Pike','ble','ΒΛΕ President'],['Jace Moreno','sdr','ΣΔΡ President'],['Silas Okoro','gge','ΓΓΗ President'],['Hunter Shaw','lxa','ΛΧΑ President'],['Beau Lancaster','sae','ΣΑΕ President']];
const c5Pres=(nm,x,z,a,o={})=>{const r=C5PRES.find(p=>p[0]===nm);return c5Greek(x,z,a,r[1],Object.assign({name:nm,title:r[2],lvl:9,armor:false},o))};
const c5AI=()=>INT.asr,c5AP=(x,z,int='asr')=>({int,x:INT[int].x0+x,z:INT[int].z0+z});
function c5Anim(f){(C5.anims=C5.anims||[]).push(f)}
// a car flips over in the street and catches fire
function c5Flip(x,z,a){const car=c5Wreck(x,z,a,0),y0=car.position.y;let t=0;c5Anim(dt=>{t+=dt;const k=Math.min(1,t/.9);car.rotation.z=k*PI*.95;car.position.y=y0+Math.sin(k*PI)*1.6+k*1.3;if(k>=1){const M=c5Mats();car.traverse(o=>{if(o.isMesh)o.material=M.char});c5Fire(x,y0+1.4,z,1.2,{tag:'pile'});noise(.5,.3,400);return 1}});return car}
function c5Photo(name,L){const k='c5ph_'+name;return GC[k]||(GC[k]=ctex(128,170,(q,w,h)=>{q.fillStyle='#2a2418';q.fillRect(0,0,w,h);q.fillStyle='#e8e0cc';q.fillRect(8,8,w-16,h-46);q.fillStyle='#6a6458';q.beginPath();q.arc(w/2,52,22,0,TAU);q.fill();q.fillRect(w/2-34,80,68,40);
  q.fillStyle='#f2ead6';q.font='bold 13px Archivo,Arial,sans-serif';q.textAlign='center';q.fillText(name.toUpperCase(),w/2,h-24);q.font='12px Archivo,Arial,sans-serif';q.fillText(L,w/2,h-9)}))}

// ---------------------------------------------------------------- chapter 5 opening: Hughes erupts
CHSCENE[5]=async function(){const fade=$('fade');fade.style.opacity=1;await c4Sl(500);endScene();C1.act=[];if(P.inside)goOut(160,584);c4At(Math.max(21.5,S.gt<20?21.5:S.gt));C5.grow=.15;c5World(1);c4CamOn();
  c4Shot([110,40,560],[40,10,640],0);fade.style.opacity=0;big('CHAPTER 5 · THE HUGHES WAR',2800);let sir=0;c5Anim(dt=>{if(!CINE)return 1;C5.grow=Math.min(1,C5.grow+dt*.09);if((sir+=dt)>.5){sir=0;tone(Math.floor(TT*2)%2?640:880,.45,'sawtooth',.025)}});
  await c4Wt(3);c4Shot([72,4,646],[50,3,636],1.2);await c4Wt(.6);
  // the doors open and the inmates pour down the steps into the road
  const out=[];for(let i=0;i<12;i++){const n=c5Inmate(52.6,634+i%4*1.4,PI/2,{pup:1,tag:'c5intro',v:4.8+rnd()});n.x-=Math.floor(i/4)*1.5;out.push(n);setTimeout(()=>{if(c4Live(n))c4To(n,70+rnd()*8,624+rnd()*22,5+rnd())},i*180)}
  const pr=c4Pup('staff',58,628,PI/2,{tag:'c5intro',name:'Officer Pruitt',title:'Hughes Security',shirt:0x23272f,sleeve:0x23272f,pants:0x23272f,v:5.5});c4To(pr,76,598,5.6);c1Say(pr,'THEY\'RE OUT! ALL OF THEM! THE DOORS ARE OPEN!',2.4);
  await c4Wt(1.6);c1Say(out[2],'NO MORE LIGHTS OUT!',2);await c4Wt(2);c1Sub(null);
  // the street: a car goes over, a cruiser is left with its lights on
  c4Shot([84,2.4,612],[69,1.5,598],1.4);c5Flip(69,601,.2);await c4Wt(1.6);c1Say(out[5],'FLIP IT! FLIP IT!',1.8);await c4Wt(2.2);
  c4Shot([88,6,560],[72,1,578],1.2);await c4Wt(2.4);c1Sub(null);
  // Danny outside the diner on Calhoun, watching the smoke
  c4DanAt(...c3Free(160,584),-PI/2);c4Shot([150,2.2,588],[95,9,620],0);await c4Wt(2.2);c4Shot([163.5,1.9,582],[160,1.6,584],1.4);await c4Wt(1);await c4DanSay('Is that… Hughes?',2.2);
  await c4Phone('Grant Ashby','Hughes is loose. EVERYBODY back to the house. Now. Do not stop for anything.',4200);
  fade.style.opacity=1;await c4Sl(450);c4Off('c5intro');C5.grow=1;c4CamOff();fade.style.opacity=0;c5Next('c5incident');saveGame()};

// ---------------------------------------------------------------- quest a scenes
function c5HouseCast(){c4Off('c5house');const mk=(id,x,z,int,a,o={})=>{const p=c5AP(x,z,int),[X,Z]=c3Free(p.x,p.z);return c4Dup(id,X,Z,a,Object.assign({tag:'c5house',int},o))};
  C5.h={tank:mk('tank',53,24,'asr_top',0),reese:mk('reese',30,25,'asr_up',PI),brett:mk('brett',40,8,'asr_up',PI/2,{pup:1}),owen:mk('owen',56,24,'asr',-PI/2)};if(C5.h.brett&&C5.h.brett.pup){C5.h.brett.pup.lie=1}}
const C5IN=[['tank','Get Tank off the bench press on the third floor',()=>c5AP(53,24,'asr_top'),'"Hughes? Like, the Hughes? I\'m coming. Let me rack this."'],
  ['reese','Find Reese upstairs',()=>c5AP(30,25,'asr_up'),'"I saw it on my phone. The whole front of the building is on fire. Where\'s Grant?"'],
  ['brett','Wake Brett up',()=>c5AP(40,8,'asr_up'),'He\'s asleep with headphones on. You pull one off.\n\n"…Is it Saturday again?"'],
  ['owen','Get Owen out of the kitchen',()=>c5AP(56,24,'asr'),'"I\'m making sandwiches. Everybody\'s going to be up all night. Somebody has to make sandwiches."']];
const C5OUT=[['ben','Ben Whitaker',[70.5,182]],['jay','Jaylen Brooks',[63.5,246]],['dre','Andre Wallace',[80.5,302]]];
function c5OutCast(){c4Off('c5out');for(const[k,nm,[x,z]]of C5OUT){if(c5S().d['o_'+k])continue;const n=c5Greek(...c3Free(x,z),0,'asr',{tag:'c5out',name:nm,title:'ΑΣΡ Pledge',pup:1,armor:false,lvl:4});n.pup.st='guard'}}
async function c5NewsCine(done){const I=c5AI();try{c4Off('c5house');c4Off('c5live');const W=(x,z)=>c3Free(I.x0+x,I.z0+z),o={tag:'c5live',int:'asr',pup:1};
  const tk=c4Dup('tank',...W(9,24.6),PI,o),ow=c4Dup('owen',...W(12.6,24.4),PI,o),rs=c4Dup('reese',...W(10.6,23.4),PI,o),bt=c4Dup('brett',...W(14.2,23.8),PI*.9,o);C5.live={tk,ow,rs,bt};
  c4CamOn();c4DanAt(...W(11,22.6),PI);c4Shot([I.x0+11,2.2,I.z0+20.5],[I.x0+11,1.2,I.z0+27],0);await c4Wt(.6);$('cineskip').hidden=true;c1Say(ow,'Turn it up. TURN IT UP.',1.8);await c4Wt(1.6);
  // the broadcast: the helicopter over Hughes
  await c4Fade(async()=>{c5News(1,'UPRISING AT HUGHES CORRECTIONAL INSTITUTE','POLICE HAVE WITHDRAWN TO A PERIMETER AT CALHOUN ST · RESIDENTS NEAR GREEK ROW TOLD TO SHELTER IN PLACE · STAY AWAY FROM THE x69 CORRIDOR · UNIVERSITY CANCELS ALL CLASSES ·');let a=0;c4Follow((tp,tl,dt)=>{a+=dt*.12;tp.set(30+Math.cos(a)*70,48,637+Math.sin(a)*70);tl.set(40,8,637)},0)});
  c1Sub('Anchor · WHRG 9','We are going live to Hughes Correctional Institute, where what began as a disturbance in the east wing is now a full-scale uprising.');await c1Wait(4.2);
  c1Sub('Anchor · WHRG 9','The building is burning. Police have pulled back. Inmates have been seen moving into the streets around Calhoun and the south end of Greek Row.');await c1Wait(4.2);
  c4Follow(null);c4Shot([84,7,596],[69,1,586],1);c1Sub('Field reporter · WHRG 9','Behind me you can see cars stacked across the street. That police cruiser was abandoned about twenty minutes ago. Its lights are still on.');await c1Wait(4.4);
  c1Sub('Anchor · WHRG 9','We are hearing reports that several students have been hurt. We cannot confirm how many.');await c1Wait(3.6);c1Sub(null);
  await c4Fade(async()=>{c5News(0);c4Shot([I.x0+11,2.2,I.z0+20.5],[I.x0+11,1.2,I.z0+27],0)});
  c4Shot([I.x0+13.5,1.8,I.z0+21.2],[I.x0+11,1.4,I.z0+24.4],1.4);await c1Line(rs,'Several students. That\'s us. That\'s Greek Row, man.');await c1Line(bt,'I was asleep for this?');c1Say(tk,'Grant\'s in the throne room. He wants everybody.',2.4);await c4Wt(2.2)}catch(e){console.warn('c5NewsCine',e);c5News(0)}c4CamOff();done()}
async function c5MeetCine(done){const I=c5AI();try{c4CamOn();const W=(x,z)=>c3Free(I.x0+x,I.z0+z),o={tag:'c5live',int:'asr',pup:1};const g=c4Dup('grant',...W(24,6.4),0,o);
  const L=C5.live||{};const ring=[[20.5,10.5],[22.5,11.4],[25.5,11.4],[27.5,10.5]];[L.tk,L.ow,L.rs,L.bt].forEach((n,i)=>{if(c4Live(n)){const[x,z]=W(...ring[i]);n.x=x;n.z=z;c4To(n,x,z);c4Look(n,g.x,g.z)}});c4DanAt(...W(24,12.2),PI);
  c4Shot([I.x0+24,2.4,I.z0+15],[I.x0+24,1.4,I.z0+7],0);await c4Wt(.5);$('cineskip').hidden=true;
  await c1Line(g,'Listen to me. Nobody leaves this house alone tonight. Nobody goes south of the stadium. If you hear Hughes, you run the other way.');
  await c1Line(g,'Delta Tau Omega lost contact with two brothers an hour ago. Sigma Delta Rho is missing one. I don\'t know any more than that.');
  // Grant on the phone, working down the list of houses
  c4Shot([I.x0+26,1.8,I.z0+8.6],[I.x0+24,1.6,I.z0+6.4],1.4);c1Sub('Grant Ashby','Silas. It\'s Grant. Are your guys inside? …Good. Keep them there.');bubble(g,'📞',3);await c1Wait(3);
  c1Sub('Grant Ashby','Beau. Grant. I know. I know we hate each other. Call me back.');await c1Wait(3);
  c1Sub('Grant Ashby','Derek. …Derek, it\'s Grant Ashby. Pick up. Please pick up.');await c1Wait(3.2);c1Sub(null);
  await c1Line(g,'Danny. Tomorrow you come with me. We check on every house on the Row, ours and theirs.')}catch(e){console.warn('c5MeetCine',e)}c4CamOff();c4Off('c5live');done()}

// ---------------------------------------------------------------- quest b scenes
const C5VISIT=[['kan','Jace Moreno','"Jace is out looking. I\'m Will. We had nine guys at a party on Calhoun last night. Eight came home. Tyler was delivering food. His location stopped updating at 9:10."'],
  ['lxa','Hunter Shaw','"We locked ourselves in the basement. All thirty-one of us. Thirty-one. I counted four times." He\'s shaking. "Is Delta Tau okay? Their guys were down there."'],
  ['gwz','Silas Okoro','"All of Gamma Gamma Eta is home. All of us." He looks south, where the smoke is. "Grant called me at midnight. I didn\'t think Grant Ashby knew my name."']];
function c5VisitCast(){c4Off('c5visit');C5VISIT.forEach(([id,nm],i)=>{if(c5S().d['v_'+id])return;const b=B.find(b=>b.id===id);if(!b)return;const[x,z]=c3Free(...fpos(b,b.face,b.da,4.2)),[fx,fz]=fpos(b,b.face,b.da,30);const hs={kan:'sdr',lxa:'lxa',gwz:'gge'}[id];
  c5Greek(x,z,Math.atan2(fx-x,fz-z),hs,{tag:'c5visit',name:i===0?'Will Ostrander':nm,title:(HOUSE[hs]||HOUSE.asr).L,armor:false,lvl:6})})}
function c5DtoCast(){c4Off('c5dto');const b=B.find(b=>b.id==='kto');const[x,z]=c3Free(...fpos(b,b.face,b.da,5.2));c5Pres('Derek Vance',x,z,Math.atan2(70-x,0),{tag:'c5dto'});
  for(let i=0;i<2;i++){const[bx,bz]=c3Free(...fpos(b,b.face,b.da+(i?2:-2),4.4));c5Greek(bx,bz,PI/2,'dto',{tag:'c5dto',name:['Cody Vance','Eli Strand'][i],armor:false})}}
async function c5Vigil(done){try{await c4Fade(async()=>{c4At(21);c4Off('c5dto');if(P.inside)goOut(64,30);c4CamOn();c5VigilSet(1)});
  const cx=56.5,cz=30.4,y=terrH(cx,cz),dv=c5Pres('Derek Vance',cx+1.4,cz-2.6,0,{tag:'c5vig',pup:1}),g=c4Dup('grant',cx-1.2,cz-2.6,0,{tag:'c5vig',pup:1});c4DanAt(cx-2.6,cz+3.4,PI*.9);
  c4Shot([cx+12,6,cz+10],[cx,1.2,cz],0);big('THE VIGIL',2200);await c4Wt(3);c4Shot([cx+3,1.6,cz+4.6],[cx,1.3,cz-3.2],1);await c4Wt(2.4);$('cineskip').hidden=true;
  await c1Line(dv,'Kyle Bennett was a junior. He wanted to be a nurse. He went to the corner store for chips.');
  await c1Line(dv,'Austin Reyes went back for him. That\'s who Austin was. He always went back.');
  await c1Line(dv,'Tyler Ng wasn\'t ours. He was Sigma Delta Rho. But he delivered our food every Friday, and he knew all our names.');
  big('A MOMENT OF SILENCE',3200);c4Shot([cx-6,2.4,cz+7],[cx,1,cz-1],.6);await c4Wt(4.6);
  await c1Line(g,'Delta Tau Omega opened its doors two weeks ago. This is not how anybody should meet their neighbors.');
  await c1Line(dv,'Grant. …Thank you for coming.');c1Sub(null);c4Shot([cx+2.6,1.5,cz+5.4],[cx-2.6,1.5,cz+3.4],1.2);await c4Wt(1.4);await c4DanSay('(Three photographs. Three names. The candles keep going out in the wind.)',3.4)}catch(e){console.warn('c5Vigil',e)}
  await c4Fade(async()=>{c5VigilSet(0);c4Off('c5vig');c4CamOff()});done()}
function c5VigilSet(on){if(C5.vig){sc.remove(C5.vig.g);C5.vig.g.traverse(o=>{if(o.isPoints)o.geometry.dispose()});if(C5.vig.crowd)sc.remove(C5.vig.crowd.g);C5.vig=null}if(!on)return;const cx=56.5,cz=30.4,g=new THREE.Group();g.userData.noMerge=1;
  const sp=[],cand=[];for(let r=0;r<2;r++){const R=5+r*1.5,n=14+r*5;for(let i=0;i<n;i++){const a=i/n*TAU+r*.2;if(Math.sin(a)<-.55)continue;const x=cx+Math.cos(a)*R,z=cz+Math.sin(a)*R;sp.push([x,z,Math.atan2(cx-x,cz-z)]);cand.push(x+Math.cos(a+PI)*.35,terrH(x,z)+1.15,z+Math.sin(a+PI)*.35)}}
  const C=c1Crowd(sp,{k:'c5vig',SH:[0x1d1d22,0x2a2a30,0x3a3a44,0x7d1f2c,0x2a6a8a,0xf2f2ee],PA:[0x1d1f24,0x2e3d5c,0x3a3a40],fem:.5});C.data.forEach(d=>{d.y=terrH(d.x,d.z);d.amp=.01});sc.add(C.g);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(cand),3));const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffc86a,size:.16,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));pts.frustumCulled=false;g.add(pts);
  [['Kyle Bennett','ΔΤΩ'],['Austin Reyes','ΔΤΩ'],['Tyler Ng','ΣΔΡ']].forEach(([nm,L],i)=>{const x=cx-1.6+i*1.6,z=cz-3.6,yy=terrH(x,z),ph=new THREE.Mesh(new THREE.PlaneGeometry(.75,1),SM({map:c5Photo(nm,L),roughness:.8}));ph.position.set(x,yy+1.3,z);ph.rotation.y=0;g.add(ph);
    for(const s of[-.3,.3]){const l=new THREE.Mesh(bgeo(.04,1.3,.04),mt(0x5a3a22,.8));l.position.set(x+s,yy+.65,z-.05);g.add(l)}for(let f=0;f<5;f++){const fl=new THREE.Mesh(GC.c5fl||(GC.c5fl=new THREE.SphereGeometry(.07,6,4)),mt(pick([0xf2f2ee,0xd84a5a,0xffd84a]),.6));fl.position.set(x+(rnd()-.5)*.6,yy+.07,z+.25+rnd()*.2);g.add(fl)}});
  g.traverse(o=>o.userData.noMerge=1);sc.add(g);C5.vig={g,crowd:C,pts}}
// the Union meeting
function c5UnionCast(){c4Off('c5union');const I=INT.union,cx=I.x0+22,cz=I.z0+9.5,o={tag:'c5union',int:'union'};
  const t=c4Group('c5table',1,g=>{c4M(bgeo(5.4,.08,1.6),0x6a4a2a,0,.78,0,g);for(const q of[[-2.5,-.7],[2.5,-.7],[-2.5,.7],[2.5,.7]])c4M(bgeo(.08,.78,.08),0x3a2614,q[0],.39,q[1],g)});t.position.set(cx,0,cz);
  const seat=[[-2,-1.5],[0,-1.6],[2,-1.5],[-2,1.5],[0,1.6],[2,1.5],[3.4,0]];C5PRES.forEach(([nm],i)=>{const[x,z]=c3Free(cx+seat[i][0],cz+seat[i][1]);c5Pres(nm,x,z,Math.atan2(cx-x,cz-z),o)});
  {const[x,z]=c3Free(cx-3.4,cz);c4Dup('grant',x,z,PI/2,o)}}
const C5PRESL={'Nolan Pike':'"Beta Lambda Epsilon has twenty-two guys and one fire extinguisher. Tell me what the plan is and we\'re in."','Jace Moreno':'"Tyler was ours. Tyler was the nicest guy in our house. I want whoever did this."','Silas Okoro':'"Gamma Gamma Eta signs whatever keeps people alive. That\'s the whole platform."','Hunter Shaw':'"Thirty-one guys in a basement. I\'m not doing that again. We need a plan for the next night, and the one after that."','Beau Lancaster':'"ΣΑΕ and ΑΣΡ in the same room. Somebody take a picture. …I\'m kidding. We\'re in."'};
async function c5Argue(done){const I=INT.union;try{c4CamOn();const g=C4.cast['Grant Ashby'],d=C4.cast['Derek Vance'];if(!g||!d)throw new Error('no cast');const cx=I.x0+22,cz=I.z0+9.5;c4DanAt(...c3Free(cx-1.2,cz+3.2),PI);
  c4Shot([cx-.6,2.2,cz+4.6],[cx-1.4,1.4,cz],0);$('cineskip').hidden=true;
  await c1Line(d,'You want me to take orders from Alpha Sigma Rho. Two weeks ago your pledge beat my house in a tug-of-war and your president laughed in my face.');
  await c1Line(g,'Nobody is taking orders. We share information. We protect each other\'s people. That\'s it.');
  await c1Line(d,'My brothers are DEAD, Grant. Kyle and Austin are dead and you want to talk about sharing information?');
  await c1Line(g,'I want to make sure there isn\'t a fourth photograph.');
  await c1Line(d,'Don\'t. Don\'t you dare use them to—');
  const r=await new Promise(res=>card({title:'The Greek Pact',sp:'Everybody is looking at you',text:'Derek is on his feet. Grant is on his. Six presidents are waiting to see who walks out first.',focus:DANNY,ch:[['"Derek. Grant called you twelve times last night. I watched him do it."',()=>res(0)],['"Kyle went to the corner store for chips. It could have been any of us. That\'s the point."',()=>res(1)],['"Sit down. Both of you. You can hate each other after Hughes."',()=>res(2)]]}));
  const rep=['Derek looks at Grant for a long time. "…Twelve times?" Grant shrugs. "You didn\'t pick up."','Derek sits down. Slowly. "Any of us," he says. "Fine. Any of us."','Somebody at the end of the table laughs. Then Derek does too, a little, and sits. Grant sits a second later.'][r];
  c1Sub('',rep);await c1Wait(3.6);c1Sub(null);c4To(d,(d.x+g.x)/2+.5,(d.z+g.z)/2,1.4);c4To(g,(d.x+g.x)/2-.5,(d.z+g.z)/2,1.4);c4Look(d,g.x,g.z);c4Look(g,d.x,d.z);await c4Wt(1.6);d.pup&&(d.pup.st='wave');g.pup&&(g.pup.st='wave');
  c4Shot([cx-.4,1.7,cz+2.6],[(d.x+g.x)/2,1.4,(d.z+g.z)/2],1.4);await c4Wt(1.2);await c1Line(d,'Truce. Until Hughes is over. Then I go back to hating you.');await c1Line(g,'I would expect nothing less.')}catch(e){console.warn('c5Argue',e)}c4CamOff();done()}
function c5Banner(on){if(C5.ban){sc.remove(C5.ban);C5.ban=null}if(!on)return;const b=B.find(b=>b.id==='asr');if(!b)return;const m=signMesh('GREEK ALLIANCE · ΑΣΡ ΔΤΩ ΒΛΕ ΣΔΡ ΓΓΗ ΛΧΑ ΣΑΕ',8.4,1.05,'#1d1d22','#e2b64c');const[x,z]=fpos(b,b.face,b.da,3.6);m.position.set(x,terrH(x,z)+4.4,z);m.rotation.y=fry(b.face);m.userData.noMerge=1;sc.add(m);C5.ban=m}
async function c5Announce(done){const I=c5AI();try{const W=(x,z)=>c3Free(I.x0+x,I.z0+z),o={tag:'c5live',int:'asr',pup:1};c4Off('c5live');c4CamOn();const g=c4Dup('grant',...W(24,6.4),0,o);
  const crowd=['tank','owen','reese','brett'].map((id,i)=>c4Dup(id,...W(20.5+i*2.2,11+(i%2)*.8),PI,o));for(let i=0;i<5;i++)c5Greek(...W(19.5+i*2.4,13.4),PI,'asr',{tag:'c5live',int:'asr',pup:1,armor:false,lvl:4,name:pick(MN)+' (ΑΣΡ)'});c4DanAt(...W(22.2,8.6),PI);
  c4Shot([I.x0+24,2.4,I.z0+16.5],[I.x0+23,1.4,I.z0+7],0);await c4Wt(.6);$('cineskip').hidden=true;
  await c1Line(g,'As of tonight, every house on Greek Row is in the Greek Alliance. Delta Tau Omega too. Especially Delta Tau Omega.');
  await c1Line(g,'If a brother from any house needs help, he gets ours. Danny, tell them the rest.');
  c4Shot([I.x0+21,1.8,I.z0+11.6],[I.x0+22.2,1.5,I.z0+8.6],1.2);await c1Wait(1);await c4DanSay('Nobody moves alone. The Union is neutral ground. And the rivalries are off until Hughes is over.',3.6);
  c1Say(crowd[0],'Even ΣΑΕ?',1.8);await c4Wt(1.8);await c1Line(g,'Even ΣΑΕ. Somebody go hang the banner.');for(const n of crowd)if(n.pup)n.pup.st='wave';await c4Wt(1.6);c5Banner(1)}catch(e){console.warn('c5Announce',e)}c4CamOff();c4Off('c5live');done()}

// ---------------------------------------------------------------- quest c scenes
function c5RallyCast(armor){c4Off('c5rally');const[cx,cz]=C5RALLY,o={tag:'c5rally',pup:1};C5.ra={};C5.ra.g=c4Dup('grant',cx-1,cz-1.8,PI/2,o);C5.ra.d=c5Pres('Derek Vance',cx+1.4,cz-1.6,-PI/2,Object.assign({armor:!!armor},o));C5.ra.ppl=[];
  C5HOUSES.forEach((h,i)=>{if(i>8)return;const a=i/9*TAU,[x,z]=c3Free(cx+Math.cos(a)*4.6,cz+Math.sin(a)*4.6);C5.ra.ppl.push(c5Greek(x,z,Math.atan2(cx-x,cz-z),h,Object.assign({armor:!!armor},o)))});
  if(armor&&C5.ra.g)c5Gear(C5.ra.g.g,{helm:0xb81f2e,pad:0xe8e2d6});
  c4Group('c5rallyset',1,g=>{for(let i=0;i<5;i++){const a=PI*.6+i*.28,x=cx+Math.cos(a)*7.5,z=cz+Math.sin(a)*7.5;const t=c4M(bgeo(1.8,.9,.7),0x6a4a2a,x,terrH(x,z)+.45,z,g);t.rotation.y=a}
    const f=signMesh('GREEK ALLIANCE',2.6,.7,'#1d1d22','#e2b64c');f.position.set(cx,terrH(cx,cz)+3.1,cz-3.2);g.add(f);c4M(bgeo(.08,3.2,.08),0xcfcfcf,cx-1.35,terrH(cx,cz)+1.6,cz-3.2,g);c4M(bgeo(.08,3.2,.08),0xcfcfcf,cx+1.35,terrH(cx,cz)+1.6,cz-3.2,g)})}
async function c5RallyCine(done){try{c5RallyCast(0);c4CamOn();const[cx,cz]=C5RALLY,g=C5.ra.g,d=C5.ra.d;c4DanAt(cx-3,cz+1,PI*.75);c4Shot([cx+9,4,cz+8],[cx,1.4,cz],0);await c4Wt(1.4);$('cineskip').hidden=true;
  c4Shot([cx-4.6,1.9,cz+2.4],[cx,1.5,cz-1.6],1.4);await c4Wt(.6);
  await c1Line(d,'Three of ours never made it out of the south end. Two ΒΘΠ guys and a girl from ΚΔ, last seen near the car pile on Greek Row.');
  await c1Line(g,'Danny. You\'re fast and you know those streets from the pizza runs. Find them, send them here. Then the people on Calhoun. Go.')}catch(e){console.warn('c5RallyCine',e)}c4CamOff();done()}
const C5STR=[['s1','Ethan Kroll','btp',[60,533],'He\'s on the ΒΘΠ porch with a lacrosse stick. "I\'ve been holding this porch for three hours. Rally point? Where? GO where?"'],
  ['s2','Lucas Ferrante','dtd',[87,541],'He\'s under the ΔΤΔ steps. "My ankle\'s busted. If you point me the right way I can hop."'],
  ['s3','Priya Raman','kd',[66,566],'She\'s crouched behind the stacked cars, filming. "Do you know how many people are going to see this? …Okay. Okay, I\'m going."']];
function c5StrCast(){c4Off('c5str');for(const[k,nm,h,[x,z]]of C5STR){if(c5S().d[k])continue;const n=c5Greek(...c3Free(x,z),PI,h,{tag:'c5str',name:nm,title:'Stranded',pup:1,armor:false,fem:k==='s3',lvl:4});n.pup.st='guard'}}
const C5CIV=[['c1','Mrs. Alvarez',[152,587],'She\'s in a bathrobe holding a cat carrier. "They broke my front window. My cat\'s name is Biscuit."'],['c2','Mr. Delgado',[171,583],'"I closed the diner. I don\'t know why I came back. The register, I guess."'],['c3','A kid on a bike',[189,588],'"Is this real? This looks fake. This looks like a game."'],['c4','Night-shift nurse',[206,585],'"I\'m trying to get to University Hospital. My shift started an hour ago."']];
function c5CivCast(){c4Off('c5civ');for(const[k,nm,[x,z]]of C5CIV){if(c5S().d[k])continue;const n=c4Pup('townies',...c3Free(x,z),PI,{tag:'c5civ',name:nm,title:'Neighbor',lvl:2,fem:k==='c1'||k==='c4'});n.pup.st='guard'}
  // a few inmates are roaming the block
  C5.roam=[];for(let i=0;i<3;i++){const n=c5Inmate(...c3Free(160+i*18,579),0,{tag:'c5civ',lvl:6});n.foe=1;C5.roam.push(n)}}
function c5Run(n,x,z,sp=5.4){if(!c4Live(n))return;if(n.pup){n.pup.st='';c4To(n,x,z,sp);const d=Math.hypot(x-n.x,z-n.z)/sp;setTimeout(()=>{if(c4Live(n))despawn(n)},d*1000+600)}}
async function c5SplitCine(done){try{c4CamOn();const g=c4Dup('grant',96,577,-PI/2,{tag:'c5split',pup:1});c4DanAt(99,578.5,-PI/2);c4Shot([104,2.6,584],[95,1.4,577],0);await c4Wt(.6);$('cineskip').hidden=true;
  c1Say(g,'Good. That\'s the last of them. Back to ΣΑΜ—',1.8);await c4Wt(1.2);
  // the car pile on the corner goes up
  noise(.9,.4,300);tone(50,.6,'sawtooth',.12);for(let i=0;i<3;i++)c4Firework(118+(rnd()-.5)*3,terrH(118,588)+2+rnd(),588+(rnd()-.5)*3,0xff8a2a);c5Fire(118,terrH(118,588)+.8,588,2.2,{tag:'pile'});c4Shot([108,2,592],[117,2,588],3);await c4Wt(1.2);
  const rush=[];for(let i=0;i<8;i++){const n=c5Inmate(118+i%3*1.4,596+Math.floor(i/3)*1.4,PI*1.2,{pup:1,tag:'c5split',v:5.4});rush.push(n);c4To(n,97.5+(rnd()-.5)*3,577.5+(rnd()-.5)*2,5.4)}c1Say(rush[0],'FRAT BOYS! RIGHT THERE!',1.8);
  c4Shot([101,3.6,571],[97.5,1.4,578],1.4);await c4Wt(1.2);c4To(g,84,604,5.6);c4DanTo(96,560,5.6);c1Say(g,'DANNY! Go around! Meet me at ΦΔΘ! GO!',2.6);await c4Wt(2.6);c1Sub(null)}catch(e){console.warn('c5SplitCine',e)}
  await c4Fade(async()=>{c4Off('c5split');c4CamOff();P.x=96;P.z=560;P.y=terrH(96,560)});done()}
async function c5ArmorCine(done){try{c5RallyCast(1);c4CamOn();const[cx,cz]=C5RALLY,g=C5.ra.g,d=C5.ra.d;c4DanAt(cx-2.6,cz+1.6,PI*.75);c4Helmet(PM,0xb81f2e);if(PM.userData.c4helm)PM.userData.c4helm.visible=true;setHat(0);
  c4Shot([cx+7.5,1.6,cz+5.5],[cx,1.3,cz],0);big('FRAT VS. HUGHES',2600);await c4Wt(1);let a=0;c4Follow((tp,tl,dt)=>{a+=dt*.25;tp.set(cx+Math.cos(a)*7,1.9,cz+Math.sin(a)*7);tl.set(cx,1.3,cz)},0);await c4Wt(4.2);c4Follow(null);
  $('cineskip').hidden=true;c4Shot([cx-4.4,1.9,cz+2.6],[cx,1.5,cz-1.6],1.4);await c4Wt(.6);
  c1Sub('','Football helmets. Hockey pads. Trash-can lids. A brother from ΘΧ has a couch cushion duct-taped to his chest. Nobody is laughing.');await c1Wait(3.8);c1Sub(null);
  await c1Line(d,'They\'re not wandering anymore. They\'re coming up the Row in groups. Our scouts saw them pointing at houses. Yours was first.');
  await c1Line(g,'Then we get everybody out of ΑΣΡ before they get there. Danny, with me. The rest of you hold the street.')}catch(e){console.warn('c5ArmorCine',e)}c4CamOff();done()}
function c5Van(on){if(C5.van){sc.remove(C5.van);C5.van=null}if(!on)return;const g=new THREE.Group(),w=mt(0xe8e8e4,.45);c4M(bgeo(2.1,2.1,4.4),w,0,1.45,-.3,g);c4M(bgeo(2,1.4,1.4),w,0,1.1,2.4,g);c4M(bgeo(1.9,.6,.05),mt(0x223040,.2,.4),0,1.5,3.12,g);for(const[x,z]of[[-.95,2],[.95,2],[-.95,-1.6],[.95,-1.6]])c4M(new THREE.CylinderGeometry(.4,.4,.28,12),0x1a1a1a,x,.4,z,g).rotation.z=PI/2;
  g.position.set(76.5,terrH(76.5,84),84);g.rotation.y=PI;g.traverse(o=>o.userData.noMerge=1);sc.add(g);C5.van=g}
const C5EVAC=[['e_owen','Get Owen out of the basement door',()=>c5AP(3,16),'"I\'m not leaving the sandwiches." He leaves the sandwiches.'],['e_chart','Take the chapter charter off the wall',()=>c5AP(18,23),'The ΑΣΡ charter, 1922, in a frame that weighs more than it should. You tuck it under your arm.'],
  ['e_cup','Take the Homecoming Cup off the mantel',()=>c5AP(24,3.2),'The Cup is still sticky. Somebody drank out of it Saturday. You take it anyway.'],['e_brett','Wake Brett up. Again.',()=>c5AP(40,8,'asr_up'),'"…Is it Saturday again?" "BRETT."']];
async function c5RifleCine(done){try{c4CamOn();const[hx,hz]=C5HOME;c5Cop(73.4,81.5,PI*.6);c4DanAt(hx-4,hz+2.4,-PI/2);C4.dan.lean=-1.3;C4.dan.dy=.12;c4Shot([hx-1.5,1.2,hz+5],[hx-4,.4,hz+2.4],0);$('cineskip').hidden=true;
  c1Sub('','Somebody hits Danny from behind. The grass comes up fast. There are more of them coming up the street than there were a minute ago.');await c1Wait(3.2);c1Sub(null);
  c4Shot([72,1.6,86],[73.4,1,81.5],1.4);await c1Wait(1.2);C4.dan.lean=0;C4.dan.dy=0;c4DanTo(74.4,83.2,2.4);await c1Wait(1.6);c1Sub('','The cruiser\'s trunk is open. The officer left in a hurry. The rack inside isn\'t empty.');await c1Wait(3);c1Sub(null);
  c5Gun(1);C5.gunM.visible=true;C4.dan.arms=-1.42;c4Shot([76,1.6,86.5],[74.4,1.4,83.2],1.4);await c1Wait(1.2);
  const t=c4Dup('tank',76.6,84.6,PI,{tag:'c5rifle',pup:1});if(t){c4Look(t,P.x,P.z);await c1Line(t,'Molotovs. Beer bottles and gas from the ΣΔΡ mower. It was their idea. Don\'t tell Grant it was their idea.')}
  await c4DanSay('Okay.',1.6);c4Shot([hx-9,1.8,hz+2],[74.4,1.5,83.2],2.4);await c1Wait(1.2);c4Off('c5rifle')}catch(e){console.warn('c5RifleCine',e)}c4CamOff();C5.gun=1;c5GunHud();done()}
async function c5NippertCine(done){try{c5Gun(0);c4CamOn();const u=-28,o={tag:'c5nip',pup:1};c4Off('c5rally');const P3=(du,dv)=>c4F(u+du,dv);c4DanAt(...P3(-2,1.5),c4A(1,0));
  const g=c4Dup('grant',...P3(1,-1),c4A(-1,0),o),d=c5Pres('Derek Vance',...P3(1.6,1.2),c4A(-1,0),o);for(let i=0;i<14;i++){const[x,z]=P3(3+(i%5)*1.4,-4+Math.floor(i/5)*3.4);c5Greek(x,z,c4A(-1,0),C5HOUSES[i%C5HOUSES.length],o)}
  c4Group('c5nipset',1,gg=>{for(let i=0;i<7;i++){const[x,z]=P3(-5,-6+i*2);const b=c4M(bgeo(.8,1.1,1.9),0x6a4a2a,x,c4FY()+.55,z,gg)}});c4ShotF(u-12,-12,7,u+3,0,1,0);big('NIPPERT STADIUM · FINAL RALLY POINT',2600);await c4Wt(3);
  $('cineskip').hidden=true;c4ShotF(u-4,3.4,1.9,u+1,0,1.5,1.4);await c4Wt(.6);await c1Line(g,'Everybody\'s here?');
  await c1Line(d,'Not everybody. Nolan, Jace and Silas went to Hughes an hour ago to try and talk to whoever is running this. They\'re not answering.');
  await c1Line(g,'Then we go get them. Danny.')}catch(e){console.warn('c5NippertCine',e)}c4CamOff();done()}

// ---------------------------------------------------------------- quest d scenes
const C5REP=[['r_nolan','Nolan Pike',[66.5,592],'He\'s inside a wrecked car on its side, holding the door shut from the inside. "Is it you? Is it actually you? Okay. Okay, I\'m coming out."'],
  ['r_jace','Jace Moreno',[86,604],'He\'s hiding behind the burning ΦΔΘ porch rail with a fire extinguisher. "It\'s empty. I\'ve been holding an empty extinguisher for forty minutes."'],
  ['r_silas','Silas Okoro',[58.5,627],'His wrists are zip-tied to the Hughes flagpole. "They let Nolan and Jace run. They kept me to send a message. Get me off this pole and I\'ll tell you the message."']];
function c5RepCast(){c4Off('c5rep');C5.guard=[];for(const[k,nm,[x,z]]of C5REP){if(c5S().d[k])continue;const n=c5Pres(nm,...c3Free(x,z),PI/2,{tag:'c5rep',pup:1});n.pup.st=k==='r_silas'?'':'guard';if(k==='r_silas'){n.pup.arms=-2.6;for(let i=0;i<3;i++){const g=c5Inmate(...c3Free(x+2+i*1.2,z+(i-1)*1.5),-PI/2,{tag:'c5rep',lvl:7});g.foe=1;C5.guard.push(g)}}}}
const c5GuardsDown=()=>(C5.guard||[]).every(n=>!c4Live(n)||n.down);
const C5CLUE=[['k_radio','Pick up the radio an inmate dropped on the lawn',[61,618],'The radio crackles in your hand.\n\n"—Greeks are pulling back to Nippert. Hit the houses while they\'re empty. Start with Delta Tau Omega. That house is mine. —P."'],
  ['k_map','Look at the map taped to the police cruiser',[75.5,574],'A campus map, taped to the hood. Every house on Greek Row is circled in red marker. One is circled four times: the old Kappa Theta Omega house. Next to it, in neat handwriting: "MINE."']];
async function c5Reveal(done){try{c4CamOn();const[lx,lz]=C5WM.lawn;c4DanAt(lx+4,lz-2,-PI/2);const pv=c4Pup('hughes',46.1,626,PI/2,{tag:'c5rev',name:'Preston Vanderhall',title:'Former ΚΘΩ President',shirt:0xe0702a,sleeve:0xe0702a,pants:0xe0702a,y:terrH(46,626)+21.1,lvl:10,hair:0x8a6a4a,skin:SKIN[1]});
  const mg=c4M(new THREE.ConeGeometry(.12,.3,10,1,true),0xf2f2ee,.18,1.45,.35,pv.g);mg.rotation.x=-PI/2;
  c4Shot([70,2.5,612],[46,20,626],0);$('cineskip').hidden=true;await c4Wt(.6);c1Say(pv,'ALPHA SIGMA RHO!',2);noise(.4,.1,900);await c4Wt(1.8);c4Shot([64,3.5,612],[46.1,22.4,626],1.2);await c4Wt(1);
  c1Say(pv,'GRANT ASHBY! I know you can hear me! Tell them whose cocaine was under Kappa Theta Omega\'s dining table!',4);await c4Wt(4);
  c1Say(pv,'You took my house. You put me in HERE. Now I\'m taking the whole Row back!',3.4);await c4Wt(3.4);c1Sub(null);
  c4Shot([lx+6.4,1.7,lz-3.2],[lx+4,1.6,lz-2],1.2);await c4Wt(.8);await c4DanSay('Preston Vanderhall. Kappa Theta Omega\'s president.',2.6);await c4DanSay('(The dining-table plant. Chapter three. Grant\'s idea.)',3)}catch(e){console.warn('c5Reveal',e)}
  await c4Fade(async()=>{c4Off('c5rev');c4CamOff()});done()}
function c5CampCast(){c4Off('c5camp');const[bx,bz]=C5BUS,o={tag:'c5camp',pup:1};c4Group('c5buses',1,g=>{for(const dz of[-6,6]){const y=terrH(bx+6,bz+dz);c4M(bgeo(2.6,2.8,10),mt(0xf2b71a,.5),bx+6,y+1.7,bz+dz,g);c4M(bgeo(2.62,.7,9.4),mt(0x223040,.2,.4),bx+6,y+2.4,bz+dz,g)}});
  C5.camp={g:c4Dup('grant',bx-1,bz,PI/2,o),d:c5Pres('Derek Vance',bx+1.4,bz-1.6,-PI/2,o),b:c5Pres('Beau Lancaster',bx+1.2,bz+1.8,-PI/2,o),h:c5Pres('Hunter Shaw',bx-.4,bz+2.6,PI,o),n:c5Pres('Nolan Pike',bx+2.4,bz,-PI/2,o)}}
const C5UNITE=[['u_derek','Derek Vance','"Preston is on that roof. We have forty guys in helmets. We go in tonight and we end it."',[['"And then who goes to the next vigil?"','He looks at the buses for a long time. "…Fine. People first."'],['"If we go in, we\'re what the news says we are."','"…I hate that you\'re right."']]],
  ['u_beau','Beau Lancaster','"ΣΑΕ is getting on the bus. We\'re done. This isn\'t our fight, it\'s Alpha Sigma Rho\'s mess, and you heard that lunatic on the roof."',[['"The Pact says nobody moves alone. That includes leaving."','"…Then we leave together. When everybody\'s out."'],['"Preston burned your neighbors\' houses too, Beau."','He swears. "Fine. FINE. Last bus. Not first."']]],
  ['u_hunter','Hunter Shaw','"Police say an hour. They said an hour four hours ago."',[['"Then we don\'t wait for them. We get our people out ourselves."','"Thirty-one guys, one basement. Never again. Okay. Let\'s go."'],['"Help me get ΦΔΘ out. They\'re still in the house."','"ΦΔΘ? They\'re still in there? Go. We\'ll hold the buses."']]]];
const C5PDT=['Cooper Whitlock','Gavin Rhodes','Miles Arden','Theo Brandt'];
function c5PdtCast(){c4Off('c5pdt');const b=B.find(b=>b.id==='pdt');C5.pdt=C5PDT.map((nm,i)=>{const[x,z]=c3Free(...fpos(b,b.face,b.da-3+i*2,5.5));return c5Greek(x,z,PI/2,'pdt',{tag:'c5pdt',name:nm,title:HOUSE.pdt?HOUSE.pdt.L:'ΦΔΘ',armor:false,lvl:5})});
  C5.roam=[];for(let i=0;i<3;i++){const n=c5Inmate(...c3Free(68+i*2,540+i*6),0,{tag:'c5pdt',lvl:7});n.foe=1;C5.roam.push(n)}}
const c5Safe=()=>(C5.pdt||[]).filter(n=>c4Live(n)&&Math.hypot(n.x-C5BUS[0],n.z-C5BUS[1])<9).length;
async function c5Collapse(done){try{await c4Fade(async()=>{c4Off();c5Gun(0);c4At(6.1);c4CamOn();C5.grow=1;const[lx,lz]=C5WM.lawn;c4DanAt(78,612,-PI/2);
    // the police line on the road, the Alliance behind it
    for(let i=0;i<4;i++)c5Cop(72+(i%2)*2,600+i*7,PI/2+(rnd()-.5)*.4);C5.sw=[];for(let i=0;i<8;i++){const n=c4Pup('cops',66.5,604+i*3.4,-PI/2,{tag:'c5end',name:'SWAT',title:'Harrowgate PD',shirt:0x1d2028,sleeve:0x1d2028,pants:0x1d2028,lvl:9,v:2.2});c5Gear(n.g,{helm:0x1a1a1c,shield:0x9ab0c8});C5.sw.push(n)}
    for(let i=0;i<10;i++){const n=c5Inmate(lx+(i%5)*1.4-2,lz-4+Math.floor(i/5)*2.4,PI/2,{pup:1,tag:'c5end'});n.pup.st='sit';n.pup.arms=-2.7}
    const g=c4Dup('grant',80,616,-PI/2,{tag:'c5end',pup:1}),d=c5Pres('Derek Vance',80.2,608.6,-PI/2,{tag:'c5end',pup:1});C5.end={g,d};c4Shot([96,14,640],[50,8,630],0)});
  big('DAWN',2200);c5Anim(dt=>{if(!CINE)return 1;C5.grow=Math.max(.05,C5.grow-dt*.03)});await c4Wt(2.6);
  // tear gas, then the line walks forward
  for(let i=0;i<5;i++){const x=58+rnd()*6,z=610+i*7;const F=c5Fire(x,terrH(x,z)+.2,z,.01,{gas:true,life:30,tag:'gas'})}noise(.3,.2,800);c4Shot([84,3,598],[60,2,622],1.2);for(const n of C5.sw)c4To(n,n.x-9,n.z,1.8);await c4Wt(4.4);
  // Preston, out the front doors between two officers
  const pv=c4Pup('hughes',C5WM.steps[0],C5WM.steps[1],PI/2,{tag:'c5end',name:'Preston Vanderhall',title:'Former ΚΘΩ President',shirt:0xe0702a,sleeve:0xe0702a,pants:0xe0702a,lvl:10,hair:0x8a6a4a,skin:SKIN[1],v:1.4});pv.pup.arms=.45;
  const c1=c4Pup('cops',C5WM.steps[0]+.1,C5WM.steps[1]-.9,PI/2,{tag:'c5end',name:'Officer',shirt:0x1d2028,sleeve:0x1d2028,pants:0x1d2028,v:1.4}),c2=c4Pup('cops',C5WM.steps[0]+.1,C5WM.steps[1]+.9,PI/2,{tag:'c5end',name:'Officer',shirt:0x1d2028,sleeve:0x1d2028,pants:0x1d2028,v:1.4});
  for(const n of[pv,c1,c2])c4To(n,n.x+15,n.z-12,1.4);c4Shot([70,2.2,618],[57,1.5,632],1.2);$('cineskip').hidden=true;await c4Wt(2.4);
  c1Say(pv,'ASHBY! TELL THEM! TELL THEM WHO PUT IT UNDER OUR TABLE!',3.2);await c4Wt(2.8);c4Shot([79,1.8,619],[80,1.6,616],1.6);await c4Wt(1.2);c1Sub('','Grant doesn\'t move. He doesn\'t look at Preston. He looks at the ground.');await c1Wait(3);c1Sub(null);
  c4Shot([70,2,620],[pv.x,1.5,pv.z],1.4);c1Say(pv,'Ask him, Danny! Ask your president what he did!',3);await c4Wt(3);c1Sub(null);
  const{g,d}=C5.end;c4DanTo(79,614.4,1.6);c4Look(g,P.x,P.z);await c4Wt(1.4);c4Shot([77,1.7,612],[79.8,1.6,616],1.4);await c4Wt(.6);await c1Line(g,'He\'s sick, Danny. That place made him sick. Don\'t listen to him.');
  await c1Line(d,'Grant. What was he talking about? What table?');await c1Line(g,'Nothing. He\'s talking about nothing.');c1Sub(null);
  // the fires go out, the sun comes up over the tower
  c4Shot([110,26,600],[42,14,637],.35);await c4Wt(4.4);big('THE HUGHES WAR IS OVER',3200);await c4Wt(3.4)}catch(e){console.warn('c5Collapse',e)}
  await c4Fade(async()=>{c4Off();c4CamOff();c5World(0);c5Banner(1);if(PM.userData.c4helm)PM.userData.c4helm.visible=false;setHat(S.pledged);goIn('asr',24,24)});done()}

// ================================================================ the quests
const c5InAsr=lab=>({t:'cond',lab:()=>lab,ok:()=>P.inside==='asr'||P.inside==='asr_up'||P.inside==='asr_top',goal:()=>P.inside?null:SPOT.ASR});
const C5M=[
 {id:'c5incident',ch:5,main:1,name:'The Hughes Incident',at:[160,584],steps:()=>[
   {t:'fx',f:()=>{c5World(1);if(S.gt<20&&S.gt>6)c4At(21.5)}},
   c5InAsr('Return to Alpha Sigma Rho'),
   c5List('Gather the brothers inside the house',C5IN.map(([k,l,at,line])=>({k:'i_'+k,l,at,act:l.split(' ').slice(0,3).join(' '),run:fin=>{const n=C5.h&&C5.h[k];if(n&&n.pup)n.pup.lie=0;c5Talk(n,'The Hughes Incident',line,[['"Throne room. Now."',()=>{if(c4Live(n)){bubble(n,'Going.',1.4);setTimeout(()=>{if(c4Live(n))despawn(n)},1600)}}]],fin)}})),{start:()=>c5HouseCast()}),
   c5List('Bring in the brothers still out on Greek Row',C5OUT.map(([k,nm,p])=>({k:'o_'+k,l:'Find '+nm,at:()=>p,act:'Bring '+nm.split(' ')[0]+' home',run:fin=>{const n=C4.cast[nm];c5Talk(n,'The Hughes Incident',pick(['"I was walking back from the library and there was a guy in an orange jumpsuit setting a mailbox on fire."','"I can\'t get Grant on the phone. Is the house okay?"','"I\'ve been hiding behind this car for twenty minutes. Is that weird?"']),[['"Run. Straight to the house. Don\'t stop."',()=>c5Run(n,...C5HOME,5.6)]],fin)}})),{start:()=>c5OutCast()}),
   go([0,0],'Watch the emergency news broadcast in the living room',{press:1,act:'Turn on the news',r:2.6,goal:()=>c5Goal(c5AP(11,27)),start:()=>{const st=curStep(),p=c5AP(11,27);st.x=p.x;st.z=p.z}}),
   {t:'cine',run:c5NewsCine},
   go([0,0],'Attend Grant\'s emergency meeting in the throne room',{press:1,act:'Join the meeting',r:3,goal:()=>c5Goal(c5AP(24,8)),start:()=>{const st=curStep(),p=c5AP(24,8);st.x=p.x;st.z=p.z}}),
   {t:'cine',run:c5MeetCine}],
  fin:()=>{c4Off('c5house');c4Off('c5out');c5Next('c5lost')}},

 {id:'c5lost',ch:5,main:1,name:'Brothers Lost',who:'grant',pre:['c5incident'],steps:()=>[
   {t:'fx',f:()=>{c5World(1);c4At(Math.max(9,S.gt>20||S.gt<6?9:S.gt))}},
   C_('Brothers Lost','Grant Ashby · Chapter president','Grant hasn\'t slept. There are three phones on the throne in front of him.\n\n"Sigma Delta Rho, Lambda Chi Alpha, Gamma Gamma Eta. They\'re closest to the south end. Go door to door with me. Find out who\'s home and who isn\'t."',[['"Let\'s go."',null]]),
   c5List('Visit the neighboring fraternity houses',C5VISIT.map(([id,nm,line])=>{const b=()=>B.find(b=>b.id===id);return{k:'v_'+id,l:'Check on '+(HOUSE[{kan:'sdr',lxa:'lxa',gwz:'gge'}[id]]||{}).L+' ('+(b()?b().name:id)+')',at:()=>{const bb=b();return fpos(bb,bb.face,bb.da,4.2)},act:'Knock on the door',run:fin=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c4tag==='c5visit'&&Math.hypot(n.x-P.x,n.z-P.z)<6);c5Talk(n,'Brothers Lost',line,[['"Stay inside. We\'ll be back."',null]],fin)}}}),{start:()=>c5VisitCast()}),
   C_('Brothers Lost','Your phone','Danny\'s phone is buzzing nonstop. Four group chats: ΔΤΩ, ΣΔΡ, ΛΧΑ, ΓΓΗ. Grant wants a list of everyone nobody has heard from.',[['Go through the check-ins',null]]),
   {t:'cine',run:done=>c5RollBoard(()=>done())},
   go([0,0],'Deliver Grant\'s message to the surviving members of Delta Tau Omega',{press:1,act:'Talk to Derek',r:3.6,goal:()=>{const n=C4.cast['Derek Vance'];return n?[n.x,n.z]:[60,32]},start:()=>{c5DtoCast();const st=curStep(),n=C4.cast['Derek Vance'];if(n){st.x=n.x;st.z=n.z}}}),
   C_('Brothers Lost','Derek Vance · ΔΤΩ President','Derek is sitting on the steps of the house that used to be Kappa Theta Omega\'s. He hasn\'t changed clothes since yesterday.\n\n"Kyle and Austin. And Sigma Delta Rho\'s Tyler. We found out an hour ago." He doesn\'t look up. "What does Alpha Sigma Rho want?"',[
     ['"Grant says whatever you need. Food, beds, people. It\'s yours."',()=>[C_('Brothers Lost','Derek Vance · ΔΤΩ President','"Grant Ashby said that." A long pause. "Tell him there\'s a vigil tonight. Here, by the ram. Tell him he can come."',[['"He\'ll be here."',null]])]],
     ['"I\'m sorry, Derek. I\'m so sorry."',()=>[C_('Brothers Lost','Derek Vance · ΔΤΩ President','"Yeah." He wipes his face with his sleeve. "There\'s a vigil tonight. By the ram. Your house can come. All of you."',[['"We\'ll be there."',null]])]]]),
   {t:'cine',run:c5Vigil},
   c5InAsr('Return to Alpha Sigma Rho'),
   {t:'fx',f:()=>{big('THE GREEK PACT',2800);c4At(10);toast('Next morning: every president on the Row is meeting at the Student Union.',4200)}},
   {t:'cond',lab:()=>'Attend the emergency Greek meeting at the Student Union',ok:()=>P.inside==='union',goal:()=>P.inside&&P.inside!=='union'?null:[340.4,300.6],done:()=>c5UnionCast()},
   c5List('Meet the presidents of the other fraternities',Object.keys(C5PRESL).map(nm=>({k:'p_'+nm.split(' ')[0],l:'Meet '+nm+' ('+C5PRES.find(p=>p[0]===nm)[2].split(' ')[0]+')',at:()=>{const n=C4.cast[nm];return n?{int:'union',x:n.x,z:n.z}:null},act:'Talk to '+nm,run:fin=>c5Talk(C4.cast[nm],'The Greek Pact',C5PRESL[nm],[['"Thanks for coming."',null]],fin)})),{start:()=>{if(!C4.cast['Nolan Pike']||C4.cast['Nolan Pike'].c4tag!=='c5union')c5UnionCast()}}),
   {t:'cine',run:c5Argue},
   {t:'cine',run:done=>c5PactBoard(()=>done())},
   c5InAsr('Return to Alpha Sigma Rho with the Alliance\'s announcement'),
   {t:'cine',run:c5Announce}],
  fin:()=>{c4Off('c5union');c4Group('c5table',0);c4Off('c5visit');c4Off('c5dto');c5Next('c5streets')}},

 {id:'c5streets',ch:5,main:1,name:'Streets of Chaos',who:'grant',pre:['c5lost'],steps:()=>[
   {t:'fx',f:()=>{c5World(1);c4At(Math.max(19.5,S.gt<12?19.5:S.gt));c5Banner(1)}},
   C_('Streets of Chaos','Grant Ashby · Chapter president','"The Alliance set up a gathering point on the Sigma Alpha Mu lawn. Every house sends whoever can walk. We find the people who are still stuck down there and we bring them up."\n\n"Stay close to me tonight."',[['"Close. Got it."',null]]),
   go(C5RALLY,'Reach the Greek Alliance meeting point on the ΣΑΜ lawn',{r:6}),
   {t:'cine',run:c5RallyCine},
   c5List('Locate the stranded members',C5STR.map(([k,nm,h,p,line])=>({k,l:'Find '+nm,at:()=>p,act:'Help '+nm.split(' ')[0],run:fin=>c5Talk(C4.cast[nm],'Streets of Chaos',line,[['"ΣΑΜ lawn. Go."',()=>c5Run(C4.cast[nm],...C5RALLY,4.6)]],fin)})),{start:()=>c5StrCast()}),
   c5List('Help the civilians escape the neighborhood',C5CIV.map(([k,nm,p,line])=>({k,l:'Get '+nm+' out',at:()=>p,act:'Help '+nm.split(' ').slice(0,2).join(' '),run:fin=>c5Talk(C4.cast[nm],'Streets of Chaos',line,[['"Go north. The police line is on Greek Row. Don\'t stop."',()=>c5Run(C4.cast[nm],105+rnd()*10,470,4.6)]],fin)})),{start:()=>c5CivCast(),tick:()=>{if(S.hp<30)S.hp+=.3}}),
   {t:'cine',run:c5SplitCine},
   Object.assign(c5WarStep({at:[84,606],label:'GET TO GRANT',waves:[[4,6]],allies:[],from:[-.4,1.2],win:'GRANT\'S OKAY'}),{lab:()=>'Reunite with Grant at the ΦΔΘ house'+(C5.w&&!C5.w.done?' (fight your way to him)':''),start:()=>{if(P.inside)goOut(90,580);c5WarStart({at:[84,606],label:'GET TO GRANT',waves:[[4,6]],allies:[],from:[-.4,1.2],win:'GRANT\'S OKAY'});const g=c4Dup('grant',...c3Free(84,606),0,{tag:'c5w'});if(g){g.ally=1;g.hp=g.mhp=300;C5.w.allies.push(g)}}}),
   C_('Streets of Chaos','Grant Ashby · Chapter president','Grant has a cut over his eye and somebody\'s hockey stick in his hand.\n\n"I told you to stay close." He almost laughs. "You did good. Back to the Alliance. This is about to get a lot worse."',[['"Worse how?"',null]]),
   {t:'fx',f:()=>{c4Off('c5w');big('FRAT VS. HUGHES',2600)}},
   go(C5RALLY,'Reunite with the Greek Alliance at the ΣΑΜ lawn',{r:6}),
   {t:'cine',run:c5ArmorCine},
   c5List('Help evacuate the Alpha Sigma Rho house',[...C5EVAC.map(([k,l,at,line])=>({k,l,at,act:l.split(' ').slice(0,4).join(' '),run:fin=>{card({title:'Frat vs. Hughes',sp:'',text:line,ch:[['Keep moving',null]]});fin()}})),
     {k:'e_van',l:'Load everything into the van out front',at:()=>[78,82],act:'Load the van',need:()=>C5EVAC.every(([k])=>c5S().d[k]),run:fin=>{toast('Charter, Cup, Owen and Brett: in the van. The van pulls away toward Nippert.',3600);fin()}}],{start:()=>c5Van(1)}),
   c5WarStep({at:C5HOME,label:'HOLD THE ΑΣΡ LAWN',task:'Survive the confrontation with Hughes on the ΑΣΡ lawn',waves:[[5,6],[6,7]],allies:[['asr','Tank Hale'],['dto','Derek Vance'],['sdr','Will Ostrander'],['gge','Mason Pratt']],from:[PI*.75,PI*1.3],win:'THEY\'RE PULLING BACK… NO. MORE ARE COMING.'}),
   {t:'cine',run:c5RifleCine},
   Object.assign(c5WarStep({at:C5HOME,label:'BERSERK',waves:[[8,6],[10,7],[12,7]],gun:1,molo:6,floor:52,allies:[['asr','Tank Hale'],['dto','Derek Vance'],['sdr','Will Ostrander'],['gge','Mason Pratt'],['lxa','Hunter Shaw']],from:[PI*.6,PI*1.45],win:'GREEK ROW IS STILL STANDING'}),{lab:()=>'Take up the rifle: hold F (or left-click) to fire, Q to throw a molotov'+(C5.w&&!C5.w.done?` · wave ${Math.max(1,C5.w.i+1)} of 3`:'')}),
   go(c4F(-28,0),'Reach the final rally point at Nippert Stadium',{r:12,start:()=>{c5Van(0)}}),
   {t:'cine',run:c5NippertCine}],
  fin:()=>{c4Off('c5rally');c4Group('c5rallyset',0);c5Next('c5fall')}},

 {id:'c5fall',ch:5,main:1,name:'The Fall of Hughes',at:[384,384],pre:['c5streets'],steps:()=>[
   {t:'fx',f:()=>{c5World(1);if(S.gt>6&&S.gt<20)c4At(23)}},
   C_('The Fall of Hughes','Grant Ashby · Chapter president','"Nolan, Jace and Silas. They went to Hughes to talk. Whoever is running this let them in and didn\'t let them out."\n\n"Find them. And Danny, find out who we\'re fighting."',[['"I\'ll find them."',null]]),
   c5List('Find the missing fraternity representatives',C5REP.map(([k,nm,p,line])=>({k,l:'Find '+nm,at:()=>p,act:k==='r_silas'?'Cut Silas loose':'Help '+nm.split(' ')[0],need:k==='r_silas'?c5GuardsDown:null,run:fin=>{const n=C4.cast[nm];if(n&&n.pup){n.pup.st='';n.pup.arms=null}c5Talk(n,'The Fall of Hughes',line,[['"Nippert. Run."',()=>c5Run(n,96,520,4.8)]],fin)}})),{start:()=>c5RepCast(),tick:()=>{for(const g of C5.guard||[])if(c4Live(g)&&!g.down&&!g.aggro&&Math.hypot(g.x-P.x,g.z-P.z)<11){g.aggro=1;g.tgt='P';g.mode='wander';bubble(g,'Back off, Greek!',1.6)}if(S.hp<30)S.hp+=.3}}),
   c5List('Discover who is organizing the uprising',C5CLUE.map(([k,l,p,text])=>({k,l,at:()=>p,act:l.split(' ').slice(0,3).join(' '),run:fin=>{card({title:'The Fall of Hughes',sp:'',text,ch:[['"P."',null]]});fin()}}))),
   {t:'cine',run:c5Reveal},
   go(C5BUS,'Get to the Alliance\'s forward camp by the evacuation buses',{r:7,start:()=>c5CampCast()}),
   c5List('Help Grant reunite the Greek Alliance',C5UNITE.map(([k,nm,open,opts])=>({k,l:'Talk '+nm+' down',at:()=>{const n=C4.cast[nm];return n?[n.x,n.z]:C5BUS},act:'Talk to '+nm,run:fin=>{const n=C4.cast[nm];if(!c4Live(n)){fin();return}card({title:'The Fall of Hughes',sp:n.name+' · '+n.title,text:open,focus:n,ch:opts.map(([l,rep])=>[l,()=>{bubble(n,rep.replace(/^"|"$/g,'').slice(0,90),3.2);fin()}])})}})),{start:()=>{if(!C4.cast['Beau Lancaster']||C4.cast['Beau Lancaster'].c4tag!=='c5camp')c5CampCast()}}),
   C_('The Fall of Hughes','Grant Ashby · Chapter president','Grant looks at the presidents, then at the buses, then at the smoke over Hughes.\n\n"Everybody out first. Preston can have the roof. ΦΔΘ is still in their house across from Hughes, four guys. Danny, bring them to the buses."',[['"Four guys. On it."',()=>c5PdtCast()]]),
   {t:'cond',lab:()=>'Get the remaining ΦΔΘ brothers to the buses ('+c5Safe()+'/4)',ok:()=>c5Safe()>=4,goal:()=>{const f=(C5.pdt||[]).find(n=>c4Live(n)&&!n.follow);return f?[f.x,f.z]:C5BUS},start:()=>{if(!C5.pdt||!C5.pdt.some(c4Live))c5PdtCast()},
     tick:()=>{for(const n of C5.pdt||[]){if(!c4Live(n))continue;if(!n.follow&&Math.hypot(n.x-P.x,n.z-P.z)<4){n.follow=1;n.mode='follow';bubble(n,pick(['Right behind you.','GO GO GO.','Is the bus real?']),1.8)}if(n.follow&&Math.hypot(n.x-C5BUS[0],n.z-C5BUS[1])<8){n.follow=0;n.mode='idle';n.hx=C5BUS[0]+4;n.hz=C5BUS[1]+(rnd()-.5)*8}}
       for(const g of C5.roam||[])if(c4Live(g)&&!g.down&&!g.aggro&&Math.hypot(g.x-P.x,g.z-P.z)<10){g.aggro=1;g.tgt='P';g.mode='wander'}if(S.hp<30)S.hp+=.3}},
   {t:'cine',run:c5Collapse}],
  fin:()=>{c5CleanAll();stand(12);toast('The Hughes War is over. Grant still hasn\'t said what Preston meant.',5200)}}];
M.push(...C5M);

// ================================================================ hooks
function c5Prompts(add){if(!AM||!C5IDS.includes(AM.m.id))return;const st=curStep();if(!st||!st.c5items)return;const d=c5S().d;
  for(const it of st.c5items){if(d[it.k]||it.busy||(it.need&&!it.need()))continue;const p=c5At(it.at());if(!p||(p.int||null)!==(P.inside||null))continue;add(p.x,p.z,it.r||2.5,it.act,()=>c5Do(it),0)}}
function c5CleanAll(){c5WarEnd();c5Gun(0);c5News(0);c5Van(0);c5VigilSet(0);c4Group('c5table',0);c4Group('c5rallyset',0);c4Group('c5nipset',0);c4Group('c5buses',0);C5.roam=[];C5.guard=[];
  for(let i=C5.fires.length-1;i>=0;i--)if(C5.fires[i].tag==='molo'||C5.fires[i].tag==='gas')c5FireOff(C5.fires[i])}
function c5Tick(dt){if(mode==='title'||mode==='loading')return;c5FireUpd(dt);c5LightUpd();c5GunUpd(dt);if(C5.anims)C5.anims=C5.anims.filter(f=>{try{return!f(dt)}catch(e){return false}});if(C5.vig&&C5.vig.crowd)c1CrowdUpd(C5.vig.crowd,TT);
  for(const g of C5.roam||[])if(c4Live(g)&&!g.down&&!g.aggro&&Math.hypot(g.x-P.x,g.z-P.z)<9){g.aggro=1;g.tgt='P';g.mode='wander';bubble(g,pick(['Greek!','Get him!','Frat boy!']),1.4)}
  if((C5.T-=dt)>0)return;C5.T=1.5;if(S.ch===5&&!C5.world)c5World(1);else if(S.ch!==5&&C5.world)c5World(0);if(S.ch>=5&&!C5.ban&&S.done.c5lost&&!c6Ban('asr')&&S.ch<7)c5Banner(1);
  if(!CINE&&mode==='play'&&(!AM||!C5IDS.includes(AM.m.id)&&!C6IDS.includes(AM.m.id)&&!C7IDS.includes(AM.m.id)&&!C8IDS.includes(AM.m.id)&&!C9IDS.includes(AM.m.id)&&!C10IDS.includes(AM.m.id))&&TT-C4.chainT>8&&(C5.w||C5.gun||C5.van||C5.vig))c5CleanAll()}
function c5Migrate(d){if(!d)return;if(S.done.final&&S.ch<11)S.ch=11;if(S.ch>=6)for(const id of C5IDS)S.done[id]=1;setTimeout(()=>{try{if(!AM||!C5IDS.includes(AM.m.id))c5CleanAll();c5World(S.ch===5);c5Banner(S.ch>=5&&!!S.done.c5lost&&!c6Ban('asr')&&S.ch<7)}catch(e){console.warn('c5Migrate',e)}},6)}
