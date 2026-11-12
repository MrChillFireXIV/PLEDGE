// ================================================================ V139 CHAPTER 1 · RUSH WEEK (rewritten)
// Danny is NOT a pledge for this whole chapter. Eight quests, chained one into the next:
//  c1arrive  Arrive on Campus      Big Ed drives down Greek Row without stopping (the talk happens in the cab), drops him at Daniels Hall, forgets how to get back. Find it with no map,
//                                  asking people for directions; ends when you talk to Marcus.
//  c1meet    Meet the Brothers     find Grant on his throne, then ask three pledges what the fraternity is like.
//  cater     First Task            Grant hands over the map (minimap unlocks) and $20 for rush-party supplies (three ways to get them).
//  c1rival   Survive the Rivalry   Kappa Theta Omega picks a fight on the front lawn: a knockout counter, reinforcements, they limp off.
//                                  Unlocks the Cliques tab.
//  c1party   Attend the Rush Party a packed house (cheap instanced crowd, non-interactive): meet 3 brothers (+20), find Dylan's phone,
//                                  get Grant to help a passed-out guest, beat a pledge at beer pong (unlocks the backyard beer-die table).
//  c1blackout Investigate the Blackout  the power dies; Grant sends you into the basement: sneak past the haze room, find 3 code notes,
//                                  open the fuse room keypad, pull the lever, sneak back up.
//  c1dean    Meet the Dean         next morning she lectures the house on the lawn, then in her office: Classes tab unlocks, and she asks
//                                  what you saw (Dean / ΑΣΡ standing).
//  c1decide  Make Your Decision    tell Grant you're in: the Pledge Machine, the propeller hat, the Pledge Class tab, the orientation.
let TSMUL=1,MINIV=null;
const C1={party:0,blackout:0,crowdIn:null,crowdOut:null,notes:new Set(),ko:0,KON:8,act:[],comp:[],flick:0};
const C1IDS=['c1arrive','c1meet','cater','c1rival','c1party','c1blackout','c1dean','c1decide','c1gather'];
QI.c1phone="Dylan's phone";
// V148 no two pledges share a job: whoever had the job the Pledge Machine gives Danny moves to a house chore nobody else has
Object.assign(PROLE,{driver:['Driver Pledge','Drives the brothers home from the bars. Stone sober, every single night.'],laundry:['Laundry Pledge','Washes, folds and irons for the whole house.'],dish:['Dish Pledge','Kitchen duty after every meal. Every. Meal.']});
function c1RoleFix(){if(!S.pledged||!S.prole||C1.roleFixed===S.prole)return;C1.roleFixed=S.prole;const used=new Set(PCLASS.map(k=>NN[k]&&NN[k].prole));
  for(const k of PCLASS){const n=NN[k];if(!n||n.prole!==S.prole)continue;for(const m of n.roleMeshes||[])m.parent&&m.parent.remove(m);n.roleMeshes=[];const f=['driver','laundry','dish'].find(r=>!used.has(r))||'dish';used.add(f);n.prole=f}}
for(const d of NAMED)if(!SPK[d.name])SPK[d.name]=d.id;
// planner tabs and HUD bits unlock as the chapter goes (old saves that finished the old chapter 1 have everything)
function tabOn(k){if(k==='pl')return!!S.pledged;const old=S.ch>=2;   /* older saves get their flags from c1Migrate; S.done.arrive is true from the first minutes, so it can't unlock anything */if(k==='map')return!!(S.uMap||old);if(k==='clq')return!!(S.uCliques||old);if(k==='cls')return!!(S.uClasses||old);if(k==='yb')return ybOn();return true}
/* V349: the yearbook is introduced by Tess Okafor's side story; saves that already took photos keep it */
function ybOn(){return!!(S.uYearbook||(S.photos&&Object.keys(S.photos).length)||S.done.yearbook)}
function clsLive(){return tabOn('cls')&&!(S.uClassesDay&&S.day<=S.uClassesDay)}
function c1Migrate(d){if(!d)return;try{c2Migrate(d)}catch(e){}if((d.done&&d.done.arrive)||d.pledged){for(const id of C1IDS)S.done[id]=1;S.uMap=S.uCliques=S.uClasses=1;setTimeout(()=>{if(S.ch===1)checkChapter()},500)}
  if((S.done.c1rival||S.ch>=2)&&!(S.fr&&S.fr.kto))c1Frat('kto',-40);
  if(S.done.c1blackout)setTimeout(()=>{try{dungDoorOpen(1)}catch(e){}},0)}
const c1W=(id,lx,lz)=>{const I=INT[id];return[I.x0+lx,I.z0+lz]};
const C1PEND=new Set();/* ids of auto-chained quests about to start: their world star is hidden so it doesn't flash over the NPC */
function c1Next(id,delay=1600){C1PEND.add(id);const tryIt=()=>{if(S.done[id]){C1PEND.delete(id);return}if(AM&&AM.m.id===id){C1PEND.delete(id);return}if(AM||mode!=='play'){setTimeout(tryIt,600);return}C1PEND.delete(id);const m=M.find(m=>m.id===id);if(m&&(!m.pre||m.pre.every(mDone)))startMission(m)};setTimeout(tryIt,delay)}
function c1Hud(t){let e=$('c1hud');if(!e){e=document.createElement('div');e.id='c1hud';e.style.cssText='position:fixed;left:50%;top:86px;transform:translateX(-50%);z-index:30;padding:6px 14px;border-radius:10px;background:rgba(18,22,34,.86);border:1px solid #e2b64c;color:#f2e6c8;font:700 15px Archivo,Arial,sans-serif;letter-spacing:.06em;pointer-events:none';document.body.appendChild(e)}e.hidden=!t;if(t)e.textContent=t}
// ---------------------------------------------------------------- cinematic helpers
function c1CineOn(camf){if(!TRUCK){TRUCK=mkTruck();TRUCK.visible=false}CINE={waits:[],shot:'c1',camf:camf||null};mode='cine';unlock();document.body.classList.add('cine');$('cineskip').hidden=false}
function c1CineOff(){c1Sub(null);CINE=null;EAVES=0;mode='play';endScene();document.body.classList.remove('cine');$('cineskip').hidden=true;for(const n of C1.act)if(n.bub)n.bub.visible=false;C1.act=[]}
// V141 nobody calls Danny "pledge" before he is one, and pledges don't boss other pledges around
function c1Lines(n,L){if(!L||!L.length||(S.pledged&&!(n&&n.pclass)))return L;const f=L.filter(x=>!/^"?Pledge,|, pledge[.!?…]/.test(x));return f.length?f:L}
function c1Voc(t){if(S.pledged||typeof t!=='string')return t;return t.replace(/, pledge([.!?…])/g,', freshman$1').replace(/(^|["“] ?)Pledge, /g,'$1Freshman, ')}
const c1Esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]);
function c1Sub(nm,t){let e=$('c1sub');if(!e){e=document.createElement('div');e.id='c1sub';e.style.cssText='position:fixed;left:50%;bottom:9%;transform:translateX(-50%);z-index:31;max-width:min(760px,88vw);padding:8px 16px;border-radius:10px;background:rgba(10,12,18,.72);color:#f6efe0;font:600 18px Archivo,Arial,sans-serif;text-align:center;pointer-events:none;text-shadow:0 1px 2px #000';document.body.appendChild(e)}e.hidden=!t;if(t)e.innerHTML=(nm?'<b style="color:#e2b64c">'+c1Esc(nm)+':</b> ':'')+c1Esc(t)}
function c1Say(n,t,d=9){for(const a of C1.act){a.c1talk=0;if(a.bub)a.bub.visible=false}if(!n||!NP.includes(n))return;n.c1talk=1;bubble(n,t,d);c1Sub(n.name,t)}
function c1Card(n,title,sp,text,ch){return new Promise(res=>card({title,sp,text,focus:n,ch:(ch||[['▸ Continue',null]]).map(([l,f])=>[l,()=>{mode='cine';res(f?f():0)}])}))}
// V141 cinematic speech uses the normal conversation box (speaker framed by sceneCam); '▸ Continue' moves on without Danny butting in, ack = Danny's reply
function c1Line(n,text,ack){if(!n||!NP.includes(n))return Promise.resolve();for(const a of C1.act)a.c1talk=0;return c1Card(n,n.name,n.title||'','"'+text+'"',[[ack||'▸ Continue',null]])}
function c1Actor(cl,x,z,a,o){const n=spawn(cl,o.zone||'greek',Object.assign({x,z,a,temp:1,mode:'idle',lvl:o.lvl||3,fem:0},o));n.hx=x;n.hz=z;n.ha=a;n.g.rotation.y=a;n.g.visible=true;C1.act.push(n);if(AM)AM.temps.push(n);return n}
const c1Wait=s=>CINE?cineWait(s):new Promise(r=>setTimeout(r,s*1000));

// ================================================================ a) ARRIVE ON CAMPUS
// V183 Big Ed's truck rolls up Greek Row, slows outside Alpha Sigma Rho so he can reminisce, then drops Danny on West Daniels Street
// outside Daniels Hall (his dorm). Big Ed can't say how to get back to the house, so the quest is asking around campus for directions.
async function c1IntroCine(done){if(!TRUCK)TRUCK=mkTruck();const TX=69,Z0=230,Z1=118,ZA=79;P.inside&&goOut(64.7,ZA);P.x=64.7;P.z=ZA;CINE={waits:[],shot:'drive'};mode='cine';unlock();document.body.classList.add('cine');$('cineskip').hidden=false;
  TRUCK.visible=true;TRUCK.rotation.y=PI;TRUCK.position.set(TX,0,Z0);PM.visible=false;S.gt=15;
  const camDrive=(dt,tx,tz)=>{cam.position.set(tx+8.5,3.1,tz-8);cam.lookAt(tx-6,3.4,tz+3)};
  const ED='Your dad · ΑΣΡ, class of \'94';
  let titled=false;try{tcStart();titled=true}catch(e){console.warn('title card',e)}
  const intro='Fall semester. Big Ed Kowalski\'s truck rattles onto Greek Row…';
  if(titled){const W_=async t=>{if(!TC.skip)await cineWait(t)};CINE.shot='titleRise';await W_(TC_RISE);CINE.shot='title';TC.tp=0;await W_(TC_PUSH+TC_THRU);
    if(TC.skip){tcEnd();$('fade').style.opacity=1;setTimeout(()=>$('fade').style.opacity=0,60);CINE.shot='c1';CINE.camf=camDrive;TRUCK.position.z=Z1}
    else{CINE.shot='titlePan';TC.tp=0;const drv=cineDrive(Z0,Z1,6.5,{ease:'lin'});toast(intro,3200);await W_(3.2);CINE.shot='c1';CINE.camf=camDrive;tcEnd();await drv}}
  else{$('fade').style.opacity=1;setTimeout(()=>$('fade').style.opacity=0,60);toast(intro,3200);CINE.shot='c1';CINE.camf=camDrive;await cineDrive(Z0,Z1,6.5,{ease:'lin'})}
  tcEnd();
  // 1) V262 houses once from outside, then CUT to a windshield shot (camera ahead of the truck, looking in at the two of them) for the whole conversation
  const H=B.find(b=>b.id==='asr'),hx=H?H.ex:90.7,CAB=GFX==='enhanced'&&!!TRUCK.userData.cabOrig;
  const EDF={name:'Big Ed Kowalski',title:ED,isP:0,lvl:9,tall:0,prop:0,g:TRUCK,get x(){return TRUCK.position.x},get z(){return TRUCK.position.z}};   /* stand-in speaker so the normal conversation box can be used from inside the truck */
  const ride=(text,ch,z0,z1,dur)=>{const zs=TRUCK.position.z>z1?TRUCK.position.z:z0,drv=cineDrive(zs,z1,Math.max(.5,dur*Math.abs(z1-zs)/Math.max(.01,Math.abs(z1-z0))),{ease:'lin'});   /* V291 keeps rolling from where the truck is, same speed; the next line opens as soon as Danny answers */return new Promise(res=>openWheel({title:'Big Ed Kowalski',sp:ED+' · driving',text,story:1,focus:EDF,ch:(ch||[['Continue',null]]).map(([l,f])=>[l,()=>{mode='cine';SCENE=null;$('card').classList.remove('scene');document.body.classList.add('cine');res(f?f():0)}])}))};
  if(CAB){CINE.camf=(dt,tx,tz)=>{cam.position.set(tx-9,3.5,tz+10);cam.lookAt(hx-4,3,tz-12)};await cineDrive(Z1,84,6.5,{ease:'lin'});
    truckCabOn(TRUCK,true);cabPeople(TRUCK);cam.fov=40;cam.updateProjectionMatrix();CINE.cabT=0;CINE.cabAnim=1;CINE.ride=1;CINE.camf=cabCamSet}
  else{CINE.ride=1;CINE.camf=(dt,tx,tz)=>{cam.position.set(tx-6.2,2.7,tz+7.5);cam.lookAt((tx+hx)/2+2,2.4,tz-4)}}
  const SG=CAB?[[84,68,9],[68,52,9],[52,38,10],[38,28,9]]:[[Z1,98,9],[98,80,9],[80,62,10],[62,36,9]];
  await ride('"Whoa whoa whoa. Danny. DANNY. Red brick. Big porch. Those letters over the door. That\'s Alpha Sigma Rho, kid. That\'s MY house."',[['"That\'s where I\'m rushing?"',null]],SG[0][0],SG[0][1],SG[0][2]);
  await ride('"Spring of \'92 I carried a couch up those porch steps by myself. Upright. The brothers said it couldn\'t be done. Hernia number one. Worth it."',[['"Dad."',null]],SG[1][0],SG[1][1],SG[1][2]);
  await ride('"See that window? Second floor? I hung outta that window for a whole Homecoming game. Upside down. Two guys holding my ankles. We won by three. …Those were my brothers, Danny. You find guys like that, you hang on to \'em."',[['"…I will, Dad."',null]],SG[2][0],SG[2][1],SG[2][2]);
  await ride('"OKAY. Enough of that. You don\'t roll up to your own fraternity outta your old man\'s truck like some freshman. I\'m droppin\' you at your dorm. You walk in like a MAN."',[['"I AM a freshman."',null]],SG[3][0],SG[3][1],SG[3][2]);
  CINE.ride=0;cabEnd();
  CINE.camf=(dt,tx,tz)=>{cam.position.set(tx+6,3.2,tz+12);cam.lookAt(tx,1.6,tz-4)};tone(150,.12,'square',.05);{const zc=Math.max(TRUCK.position.z,CAB?28:36);await cineDrive(zc,20,Math.max(3.2,(zc-20)/9),{ease:'in'})}
  // 2) West Daniels Street, outside Daniels Hall
  $('fade').style.opacity=1;await cineWait(.5);
  const RZ=287.4,DX0=698,DX1=652,TZ=RZ-1.2;TRUCK.rotation.y=-PI/2;TRUCK.position.set(DX0,terrH(DX0,TZ),TZ);P.x=DX1;P.z=RZ-3.6;
  CINE.camf=(dt,tx,tz)=>{cam.position.set(DX1+9,3.4,RZ+7.5);cam.lookAt(tx-3,1.4,tz-4)};$('fade').style.opacity=0;toast('Daniels Hall · your dorm',2600);await cineDrive(DX0,DX1,5.2,{ax:'x',ease:'out'});
  const dad=spawn('staff','quad',{x:DX1-1.4,z:RZ-4.6,a:0,name:'Big Ed Kowalski',title:ED,lvl:9,mode:'idle',temp:1,actor:1});sc.remove(dad.g);dad.g=mkDad();dad.g.position.set(dad.x,terrH(dad.x,dad.z),dad.z);dad.g.rotation.y=PI/2;dad.a=PI/2;sc.add(dad.g);dad.tall=1;
  P.x=DX1+.6;P.z=RZ-4.9;P.y=terrH(P.x,P.z);P.jy=0;P.sup=0;P.dk=null;PM.position.set(P.x,P.y,P.z);P.face=-PI/2;PM.visible=true;tone(180,.12,'square',.05);tone(140,.12,'square',.05,.1);
  CINE.camf=null;CINE.shot='c1';
  const sayD=(text,ch)=>new Promise(res=>card({title:'Big Ed Kowalski',sp:ED,text,focus:dad,ch:(ch||[['Continue',null]]).map(([l,f])=>[l,()=>{mode='cine';res(f?f():0)}])}));
  await sayD('"Here we are! Daniels Hall! Your dorm, kid. Smells like gym socks and ramen. PERFECT. Just like I left it."',[['"So how do I get back to the house?"',null]]);
  const r=await sayD('"The house? It\'s on the Row! Greek Row! We JUST drove past it! Left at the… no. Right at the big… thing. It\'s been thirty years, okay? Campus moves stuff."',[['"You don\'t remember how to get to your own fraternity?"',()=>1],['"Okay. I\'ll find it."',()=>2]]);
  if(r===1)await sayD('"I remember the IMPORTANT stuff! The parties! The paddle! The night we put a cow on the— never mind. Ask somebody. That\'s what your mouth is for. It builds CHARACTER!"',[['"Great. Character."',null]]);
  await sayD('"…Look. I\'m proud of you, kid. Real proud. Here, five bucks. Don\'t spend it all in one place! Now get outta here before I get emotional in front of a dormitory."',[['"Thanks, Dad. Love you too."',null]]);
  if(S.money<5)S.money=5;bubble(dad,'MAKE ME PROUD!',2.5);if(dad.g.P&&dad.g.P.aR)dad.g.P.aR.rotation.x=-2.7;mode='cine';await cineWait(1.4);
  despawn(dad);tone(180,.12,'square',.05);CINE.shot='c1';CINE.camf=(dt,tx,tz)=>{cam.position.set(P.x+4.5,2.4,P.z+6.5);cam.lookAt(tx,1.4,tz)};$('cineskip').hidden=false;await cineWait(.4);await cineDrive(DX1,606,4.2,{ax:'x',ease:'in'});
  cabEnd();TRUCK.visible=false;TRUCK.rotation.y=PI;$('cineskip').hidden=true;CINE=null;mode='play';endScene();document.body.classList.remove('cine');P.face=-PI/2;yaw=P.face+PI;camT=6;S.c1intro=1;
  big('FIND THE HOUSE',2200);setTimeout(()=>toast('Big Ed drove right past it, and you have no map. Find Alpha Sigma Rho on Greek Row: ask people around campus for directions (press E).',7000),900);done()}
// directions, from whoever you ask
function c1Dir(n){const tx=86,tz=76,dx=tx-n.x,dz=tz-n.z,d=Math.hypot(dx,dz);
  if(d<26)return'"Alpha Sigma Rho? You\'re basically standing on their lawn. Red brick, big porch, the Greek letters over the door. Right there."';
  const a=(Math.atan2(dx,-dz)*180/PI+360)%360,D=['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(a/45)%8],min=Math.max(1,Math.round(d/110)),far=min>1?`a good ${min}-minute walk`:'a short walk';
  if(n.z>560&&n.x<150)return pick([`"Alpha Sigma Rho? Not here, pal. This is Hughes. Follow the street ${D}, cross the big avenue, and keep going. Greek Row is the long street lined with frat houses. ΑΣΡ is the red brick one with the big porch."`,`"You want the frat houses? Go ${D} up this road, past the avenue. It's ${far}. Look for a street full of porches and Greek letters."`]);
  if(n.x<140&&n.z<200)return pick([`"ΑΣΡ? Keep going ${D} along the Row. It's on the east side of the street, red brick, white trim, big porch. Can't miss it."`,n.z>90?`"That way. ${D[0].toUpperCase()+D.slice(1)}. ${far[0].toUpperCase()+far.slice(1)}. If you hit Kappa Theta Omega, you went too far, and they'll let you know."`:`"That way. ${D[0].toUpperCase()+D.slice(1)}. ${far[0].toUpperCase()+far.slice(1)}. Red brick, big porch, on the same end of the Row as Kappa Theta."`]);   /* V303 ΚΘΩ is north of ΑΣΡ: 'went too far' is only true walking north */
  return pick([`"Greek Row? That's ${D} of here. ${far[0].toUpperCase()+far.slice(1)}. Once you're on the Row, look for a red brick house with ΑΣΡ over the porch."`,`"Alpha Sigma Rho… the ones with the throne, right? Head ${D}. Greek Row is the long street on the west side of campus. ${far[0].toUpperCase()+far.slice(1)}."`,`"Hm. ${D[0].toUpperCase()+D.slice(1)}, I think? Find the street with all the frat houses on it. ΑΣΡ is the loud one."`])}

// ================================================================ b) MEET THE BROTHERS: what the pledges say about the house
const C1LORE={hunter:'"Founded 1952. Oldest house on the Row. The brothers say the Lantern Walk at the end of pledging makes you family for life. Nobody will tell me what it actually is."',
  felix:'"Honestly? Best parties on campus, best alumni network, and the brothers mostly treat us okay. Mostly."',
  andre:'"Once you pledge, it\'s roll call every night at six on the front lawn. I\'m Pledge Captain, so I call the roll, and Grant wants it run like the army. Miss it and the Pledgemaster comes and gets you. Personally."',
  ben:'"Every pledge gets a job. A pledge job. You find out what yours is when you pledge. Some of them are… a lot."',
  cody:'"Grant says ΑΣΡ makes men out of boys. So far it\'s mostly made sandwiches out of me. For the brothers. At three in the morning."',
  sanjay:'"There\'s a basement. Door\'s padlocked, and nobody talks about it. You hear stuff down there at night."',
  miles:'"The house is on its final warning with the Dean. One more incident and the charter\'s gone. So, you know. No pressure."',
  kofi:'"Food\'s free if you\'re a pledge. That\'s half the reason I\'m here, not gonna lie."',
  nate:'"Grant\'s dad is on the alumni trust. The money comes down from the Lodge by the lake. That\'s how a house gets a throne."',
  brock:'"Kappa Theta Omega across the street hates us. Like, actually hates us. Watch your back on the Row."',
  marcus:'"It\'s… a lot. It\'s a lot, and it\'s great, and sometimes it\'s terrible. Grant says that\'s the point."',
  gavin:'"I\'m the mascot pledge. I wear horns. I bleat. I regret nothing. Okay, I regret a little."'};
const C1SUM={hunter:'a Lantern Walk nobody will explain',felix:'great parties and brothers who mostly behave',andre:'roll call every night at six',ben:'a pledge job nobody will describe',cody:'sandwiches for the brothers at three in the morning',sanjay:'a padlocked basement',miles:'a charter on its final warning with the Dean',kofi:'free food for pledges',nate:'alumni money from the Lodge by the lake',brock:'a feud with Kappa Theta Omega',marcus:'a house that is a lot',gavin:'a mascot pledge in horns'};
const C1GEN=[['\"The brothers are intense. But when they\'ve got your back, they\'ve REALLY got your back.\"','brothers who are intense but loyal'],['\"Rush week is the easy part. Ask me again in a month.\"','a rush week that is only the easy part'],['\"Best decision I ever made. Probably. Ask me after the Lantern Walk.\"','a pledge who will tell you after the Lantern Walk']];
function c1Lore(id){return C1LORE[id]||pick(C1GEN)[0]}
// what this pledge said + a short phrase for the wrap-up card
function c1LoreAsk(id){let t,sm;if(C1LORE[id]){t=C1LORE[id];sm=C1SUM[id]}else{const g=pick(C1GEN);t=g[0];sm=g[1]}(AM.c1heard=AM.c1heard||{})[id]=sm;return t}
function c1MeetEnd(){const h=AM&&AM.c1heard?Object.values(AM.c1heard).filter(Boolean):[];let l=h.length>1?h.slice(0,-1).join(', ')+', and '+h[h.length-1]:(h[0]||'');
  return (l?'Three pledges, three different stories: '+l+'.':'Three pledges, three different stories.')+'\n\nGrant wants to see you again in the throne room.'}
function c1NearPledge(){const asked=AM&&AM.c1pl||new Set();let best=null,bd=1e9;for(const k of PCLASS){const n=NN[k];if(!n||n.hidden||asked.has(k))continue;const sameIn=(n.int||null)===(P.inside||null),d=Math.hypot(n.x-P.x,n.z-P.z)+(sameIn?0:400);if(d<bd){bd=d;best=n}}return best?[best.x,best.z]:null}

// ================================================================ d) SURVIVE THE RIVALRY
const KTON=['Preston Vanderhall','Chip Whitmore','Tad Ellison','Win Ashcroft','Hollis Pratt','Biff Langley','Teddy Crane','Sloane Barrow','Kip Harrington','Ford Beaumont','Spencer Lowe','Dex Thornton'];
async function c1RivalCine(done){S.c1rivalSeen=1;const cx=83.6,cz=76;let ct=0;c1CineOn((dt)=>{ct+=dt;const a=-.55+ct*.06;cam.position.set(cx+Math.sin(a)*9.5,3.4,cz+Math.cos(a)*9.5);cam.lookAt(cx,1.5,cz)});C1.act=[];
  const K=[],A=[];[[80.6,72.5],[80.2,75.8],[80.7,79.2],[79.6,77.6]].forEach(([x,z],i)=>K.push(c1Actor('legacies',x,z,PI/2,{house:'kto',name:KTON[i],title:i?'Kappa Theta Omega':'ΚΘΩ President',lvl:i?1:2})));
  [[86.4,73],[86.8,76.2],[86.2,79.4]].forEach(([x,z],i)=>A.push(c1Actor('brothers',x,z,-PI/2,{house:'asr',name:['Derek Lund','Paul Okonjo','Sam Whitley'][i],title:'ΑΣΡ Brother',lvl:4})));
  P.x=83.6;P.z=83.2;P.face=PI;PM.visible=true;await c1Wait(2.2);   // establishing shot of the standoff, then the argument plays as dialogue
  const L=[[K[0],'Nice lawn, ΑΣΡ. Shame about the house on it.'],[A[1],'Get off our grass, Vanderhall.'],[K[1],'Rush party tonight? Who\'s coming, your moms?'],[A[0],'Say that again. I dare you.'],[K[0],'Your charter\'s one strike from the shredder. We just came for the show.'],[A[2],'Kowalski! Rushee! Drop the duffel, you\'re in this now!','"Wait, what?"'],[K[2],'Oh, they\'ve got a FRESHMAN. Get him!','"Okay. Bring it."']];
  for(const[n,t,ack]of L)await c1Line(n,t,ack);sfx('whistle');c1CineOff();done()}
function c1BrawlStart(){C1.ko=0;C1.foes=[];C1.allies=[];C1.spawned=0;C1.reT=0;
  for(const n of NP){if(!n.temp||!AM||!AM.temps.includes(n))continue;if(n.cl==='legacies'){n.foe=1;n.aggro=1;n.tgt='P';n.mode='wander';C1.foes.push(n);C1.spawned++}else if(n.cl==='brothers'){n.ally=1;n.dmgMul=.25;n.noKill=1;n.hp=n.mhp=120;C1.allies.push(n)}}
  // V141 a retry (or a loaded save) skips the standoff: Kappa Theta jumps Danny the moment he steps out, with three brothers to back him up
  if(!C1.foes.length){let k=0;for(let i=0;i<14&&k<4;i++){const a=PI*.5+i*.9,x=P.x+Math.sin(a)*(5+i%3),z=P.z+Math.cos(a)*(5+i%3);if(!freeAt(x,z,.4))continue;const n=c1Foe(x,z,k===0?'Preston Vanderhall':null);if(k===0)n.title='ΚΘΩ President';bubble(n,pick(['There he is! Get the rushee!','Round two, freshman!','ΚΘΩ! Get him!']),2.6);k++}
    if(!C1.allies.length)[[86.4,73],[86.8,76.2],[86.2,79.4]].forEach(([x,z],i)=>{const n=spawn('brothers','greek',{house:'asr',fem:0,x,z,temp:1,mode:'idle',lvl:4,name:['Derek Lund','Paul Okonjo','Sam Whitley'][i],title:'ΑΣΡ Brother'});n.ally=1;n.dmgMul=.25;n.noKill=1;n.hp=n.mhp=120;C1.allies.push(n);if(AM)AM.temps.push(n)});sfx('whistle')}
  toast('Knock out Kappa Theta Omega until they give up. Don\'t get knocked out yourself.',4500)}
function c1Foe(x,z,nm){const n=spawn('legacies','greek',{house:'kto',fem:0,x,z,temp:1,mode:'wander',lvl:nm?2:1+(C1.spawned>5?1:0),name:nm||KTON[1+(3+C1.spawned)%(KTON.length-1)],title:'Kappa Theta Omega'});n.foe=1;n.aggro=1;n.tgt='P';C1.foes.push(n);C1.spawned++;if(AM)AM.temps.push(n);return n}
function c1BrawlTick(dt){if(!C1.foes)return;for(const n of C1.foes){if(!NP.includes(n))continue;
    if(n.down>0&&!n._ko){n._ko=1;n.foe=0;n.aggro=0;n.tgt=null;n.c1out=TT+6;C1.ko++;sfx('coin');bubble(n,pick(['Ow… ow… my nose…','I\'m out, I\'m out!','This isn\'t over…','Somebody call my dad.','My Vineyard Vines…']),2.4)}
    if(n._ko&&TT>n.c1out){despawn(n);if(AM)AM.temps=AM.temps.filter(m=>m!==n)}}
  C1.foes=C1.foes.filter(n=>NP.includes(n));
  const alive=C1.foes.filter(n=>!n._ko).length;C1.reT-=dt;if(C1.ko<C1.KON&&alive<3&&C1.reT<=0){C1.reT=2.2;const s=rnd()<.5?[70.5,60+rnd()*6]:[70.5,92+rnd()*6],n=c1Foe(s[0],s[1]);bubble(n,pick(['ΚΘΩ! Get in here!','Nobody touches Kappa Theta!','Where\'s the rushee?!']),2.4)}
  c1Hud(`ΚΘΩ KNOCKED OUT  ${Math.min(C1.ko,C1.KON)} / ${C1.KON}`)}
async function c1RivalEndCine(done){c1Hud(null);for(const n of(C1.foes||[]))if(NP.includes(n)){despawn(n);if(AM)AM.temps=AM.temps.filter(m=>m!==n)}C1.foes=[];
  for(const n of C1.allies||[]){n.ally=0;n.aggro=0;n.tgt=null}
  // back on the lawn: Danny and the brothers on one side, what's left of Kappa Theta on the other
  P.x=82.6;P.z=79.5;P.face=PI;PM.visible=true;let ct=0;c1CineOn(dt=>{ct+=dt;const k=Math.min(1,ct/9);cam.position.set(86.6-k*1.6,2.7+k*.5,83.8+k*.8);cam.lookAt(79.4-k*3,1.35,75.6-k*5)});C1.act=[];
  [[85,79.2],[84.4,81.4]].forEach(([x,z],i)=>{const a=(C1.allies||[])[i];if(a&&NP.includes(a)){a.x=x;a.z=z;a.a=-2.4;a.g.position.set(x,terrH(x,z),z);a.g.rotation.set(0,a.a,0);C1.act.push(a)}});
  const K=[[80.6,76.4,'Preston Vanderhall','ΚΘΩ President'],[78.8,75.2,KTON[2],'Kappa Theta Omega'],[81.6,74.6,KTON[4],'Kappa Theta Omega'],[79.4,77.8,KTON[6],'Kappa Theta Omega']].map(([x,z,name,title],i)=>{const n=c1Actor('legacies',x,z,Math.atan2(P.x-x,P.z-z),{house:'kto',name,title,lvl:2});n.c1hurt=1;return n});
  await c1Wait(1.2);
  await c1Line(K[0],'Alright, ALRIGHT. We\'re going.');
  await c1Line(K[2],'My nose… I think he broke my nose…');
  await c1Line(K[0],'Enjoy your little party, ΑΣΡ. We\'ll be back. Count on it.','"We\'ll be here."');
  K.forEach((n,i)=>{n.c1talk=0;n.c1walk=[-.9-i*.12,-1.25+i*.08]});
  const al=C1.act.find(n=>n.cl==='brothers');if(al)await c1Line(al,'Yeah, keep walking! And tell your moms we said hi!');await c1Wait(2.6);
  for(const n of K)if(NP.includes(n)){despawn(n);if(AM)AM.temps=AM.temps.filter(m=>m!==n)}
  c1CineOff();done()}
function c1BrawlEnd(){c1Hud(null);for(const n of(C1.foes||[]).concat(C1.allies||[]))if(NP.includes(n))despawn(n);C1.foes=[];C1.allies=[]}

// ================================================================ e) THE RUSH PARTY
// the crowd: four instanced meshes (shirt, pants, skin, hair) for dozens of cheap, non-interactive partygoers who bob to the music
function c1CrowdGeo(){if(C1.geo)return C1.geo;const B=(w,h,d,x,y,z)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);return g};
  const merge=gs=>{const p=[],n=[];for(const g0 of gs){const g=g0.index?g0.toNonIndexed():g0;p.push(...g.attributes.position.array);n.push(...g.attributes.normal.array)}const r=new THREE.BufferGeometry();r.setAttribute('position',new THREE.Float32BufferAttribute(p,3));r.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));return r};
  const hd=new THREE.SphereGeometry(.17,10,8);hd.translate(0,1.73,0);const hr=new THREE.SphereGeometry(.185,10,6,0,TAU,0,PI*.46);hr.translate(0,1.76,0);
  return C1.geo={shirt:merge([B(.46,.6,.27,0,1.23,0),B(.13,.52,.15,-.31,1.21,0),B(.13,.52,.15,.31,1.21,0)]),pants:merge([B(.19,.84,.21,-.11,.42,0),B(.19,.84,.21,.11,.42,0),B(.44,.12,.25,0,.9,0)]),skin:merge([hd,B(.1,.1,.1,0,1.55,0),B(.1,.13,.11,-.31,.88,0),B(.1,.13,.11,.31,.88,0)]),hair:merge([hr])}}
const C1SH=[0xc8202e,0x2a5aa8,0xe2b64c,0x2f8a4a,0xf2f2ee,0x1d1d22,0x7d1f2c,0xd88aa6,0x5a3a8a,0x3aa0b0,0xe07a2a,0x8a8d90],C1PA=[0x2e3d5c,0x1d1f24,0xcbb98f,0x4a4038,0x34486e,0x6a6d72];
// V142 partygoers are real game characters, frozen once: each look is built with mkPerson, posed, its low-detail skinned body baked to a
// plain mesh (bakeSkinned) and drawn as one InstancedMesh, so ~12 looks x however many people = ~12 draw calls, no rigs, AI or collision
function c1Look(i,pal){const key=pal?pal.k:'party';C1.looks=C1.looks||{};const L=C1.looks[key]=C1.looks[key]||[];if(L[i]!==undefined)return L[i];let r=null;
  try{if(GFX==='enhanced'){const SH=pal?pal.SH:C1SH,PA=pal?pal.PA:C1PA,HA=pal&&pal.HA?pal.HA:HAIR,sh=pick(SH),o={shirt:sh,sleeve:rnd()<.8?sh:pick(SH),pants:pick(PA),skin:pick(SKIN),hair:pick(HA),fem:rnd()<(pal&&pal.fem!=null?pal.fem:.42)};
    const g=mkPerson(o);try{animP(g,0,i*.7,'')}catch(e){}g.updateMatrixWorld(true);const Lo=g.children.find(c=>c.isLOD);
    if(Lo){const lv=Lo.levels.length>1?Lo.levels[1].object:Lo.levels[0].object,m=bakeSkinned(lv);m.material.userData.c1=1;r={geo:m.geometry,mat:m.material}}}}catch(e){console.warn('c1Look',e)}
  return L[i]=r}
function c1Crowd(spots,pal){const N=spots.length,data=spots.map(([x,z,a])=>({x,z,a:a!=null?a:rnd()*TAU,ph:rnd()*TAU,sp:2.4+rnd()*2.4,amp:.02+rnd()*.05,s:.94+rnd()*.12,ms:[]})),g=new THREE.Group(),meshes=[];
  const NL=12,looks=[];if(!(pal&&pal.block))for(let i=0;i<NL;i++){const l=c1Look(i,pal);if(l)looks.push(l)}
  if(looks.length){const by=looks.map(()=>[]);data.forEach((d,i)=>by[i%looks.length].push(d));
    looks.forEach((l,k)=>{const n=by[k].length;if(!n)return;const m=new THREE.InstancedMesh(l.geo,l.mat,n);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;m.castShadow=false;m.receiveShadow=true;m.userData.noMerge=1;by[k].forEach((d,j)=>d.ms.push([m,j]));g.add(m);meshes.push(m)})}
  else{const G=c1CrowdGeo(),col=new THREE.Color();   // classic graphics: the old block people
    for(const k of['shirt','pants','skin','hair']){const m=new THREE.InstancedMesh(G[k],new THREE.MeshLambertMaterial({color:0xffffff}),N);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;m.userData.noMerge=1;
      for(let i=0;i<N;i++){m.setColorAt(i,col.setHex(k==='shirt'?pick(C1SH):k==='pants'?pick(C1PA):k==='skin'?pick(SKIN):pick(HAIR)));data[i].ms.push([m,i])}m.instanceColor.needsUpdate=true;g.add(m);meshes.push(m)}}
  const C={g,meshes,N,data};c1CrowdUpd(C,0);return C}
const _c1m=new THREE.Matrix4(),_c1q=new THREE.Quaternion(),_c1e=new THREE.Euler(),_c1v=new THREE.Vector3(),_c1s=new THREE.Vector3();
function c1CrowdUpd(C,t){for(let i=0;i<C.N;i++){const d=C.data[i],b=Math.abs(Math.sin(t*d.sp+d.ph))*d.amp;_c1e.set(0,d.a+Math.sin(t*1.1+d.ph)*.3,Math.sin(t*d.sp*.5+d.ph)*.04);_c1q.setFromEuler(_c1e);_c1v.set(d.x,(d.y||0)+b,d.z);_c1s.set(d.s,d.s,d.s);_c1m.compose(_c1v,_c1q,_c1s);for(const[m,k]of d.ms)m.setMatrixAt(k,_c1m)}for(const m of C.meshes)m.instanceMatrix.needsUpdate=true}
function c1CrowdIn(){if(C1.crowdIn)return C1.crowdIn;const I=INT.asr,sp=[];let tries=0;
  const bad=(x,z)=>(x<14&&z<14)||(x>19.5&&x<28.5&&z<6.2)||(x>27.4&&x<32.6&&z>18.4&&z<32.4)||(x>48&&z<14.5)||(Math.abs(x-24)<1.6&&z>33)||(Math.abs(x-1.4)<1.6&&Math.abs(z-16)<1.6)||Math.hypot(x-24,z-31.5)<2.4;
  while(sp.length<96&&tries++<4000){const x=.8+rnd()*62.4,z=.8+rnd()*34.4;if(bad(x,z)||!freeAt(I.x0+x,I.z0+z,.42))continue;if(sp.some(([a,b])=>Math.hypot(a-I.x0-x,b-I.z0-z)<.75))continue;sp.push([I.x0+x,I.z0+z])}
  const C=c1Crowd(sp);I.g.add(C.g);C.g.visible=false;return C1.crowdIn=C}
function c1CrowdOut(){if(C1.crowdOut)return C1.crowdOut;const sp=[];let tries=0;
  while(sp.length<48&&tries++<3000){const x=74+rnd()*16.5,z=60+rnd()*32;if(!freeAt(x,z,.42)||Math.hypot(x-86,z-79)<1.6)continue;if(sp.some(([a,b])=>Math.hypot(a-x,b-z)<.8))continue;sp.push([x,z,Math.atan2(92-x,76-z)+(rnd()-.5)*1.4])}
  const C=c1Crowd(sp);sc.add(C.g);C.g.visible=false;return C1.crowdOut=C}
const C1BRO=[['Chase Holloway',8,22,'"Rushee! Grab a soda. Not that one. That one\'s mine."','"Kowalski. Okay. I\'ll remember that. Maybe."'],['Derek Lund',38,24,'"Hey, it\'s the kid who fought Kappa Theta! Respect."','"Danny! Dude, you were a MENACE on that lawn today."'],['Paul Okonjo',42,7,'"You any good at pool? No? Then don\'t touch the table."','"Paul. Junior. Mechanical engineering, so I\'m never here. Except parties."'],['Sam Whitley',20,30,'"Rushee, this is the foyer. You stand in the foyer, you\'re part of the decor."','"Kowalski, from the lawn. Danny, huh? We had a Danny. He transferred. Don\'t transfer."'],['Ty Barrett',56,28,'"Kitchen\'s brothers only. …Kidding. Mostly."','"Ty. Social chair. If the party\'s good, that\'s me. If it\'s bad, that\'s Grant."']];
const BIGED=['"BIG ED? Big Ed KOWALSKI? The guy who drove a riding mower into the Dean\'s fountain? Dude. There\'s a picture of that in the house."','"Wait, the Big Ed? The one who ate a whole ham at the 1993 Lantern Banquet? You\'re LEGACY, man."','"Big Ed Kowalski… my big brother\'s big brother talked about him. Something about a goat. Nobody would finish the story."'];
const C1PHONE=[['in the living room, by the couch',9,30],['in the dining room',44,33],['in the kitchen',61,30],['in the game room',46,2.5],['in the foyer, by the front door',21.5,34]];
function c1PartyOn(){C1.party=1;TSMUL=.1;const I=INT.asr;c1CrowdIn().g.visible=true;Object.assign(C1,{phone:0,phoneAsk:0,pong:0,sleeper:0,sleepSeen:0,ok:new Set()});
  if(!C1.disco){C1.disco=[];const al=GC.dGl&&GC.dGl.alphaMap;for(const c of[0xff3aa0,0x3ac8ff,0xb8ff3a]){const m=new THREE.Mesh(new THREE.PlaneGeometry(4.2,4.2),new THREE.MeshBasicMaterial({color:c,alphaMap:al,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));m.rotation.x=-PI/2;m.renderOrder=3;I.g.add(m);C1.disco.push(m)}}C1.disco.forEach(m=>m.visible=true);
  const st=curStep();C1BRO.forEach(([nm,lx,lz,g1,g2],i)=>{let x=I.x0+lx,z=I.z0+lz;for(let r=0;r<4&&!freeAt(x,z,.4);r+=.5){x+=.5}const n=spawn('brothers','asr',{house:'asr',x,z,a:rnd()*TAU,temp:1,mode:'idle',name:nm,title:'ΑΣΡ Brother',lvl:4+(i%3),greet:g1});n.c1bro=1;n.c1g1=g2;n.stepTemp=null;if(AM)AM.temps.push(n)});
  {let x=I.x0+24,z=I.z0+24;const n=spawn('brothers','asr',{house:'asr',x,z,a:0,temp:1,mode:'idle',name:'Dylan Moss',title:'ΑΣΡ Brother',lvl:4,greet:'"Have you seen my— no. Of course you haven\'t. You just got here."'});n.c1phone=1;if(AM)AM.temps.push(n)}
  // the passed-out guest on the living-room floor
  {let lx=4,lz=33.5;const s=spawn('townies','asr',{x:I.x0+lx,z:I.z0+lz,a:PI/2,temp:1,mode:'idle',name:'Passed-out Guest',title:'Rush Party',lvl:1,actor:1});s.statue=1;s.sx=s.x;s.sy=.2;s.sz=s.z;s.g.rotation.set(-PI/2,PI/2,0,'YXZ');s.g.position.set(s.sx,s.sy,s.sz);C1.sleepN=s;if(AM)AM.temps.push(s);
    c1Obj('asr',lx+1.2,lz-.6,'Check on the guy passed out on the floor',()=>{C1.sleepSeen=1;card({title:'Passed Out',sp:'',alert:1,text:'He\'s breathing, but he won\'t wake up when you shake him. His lips are pale and his hand is cold.\n\nThis is way above a rushee\'s pay grade. Find Grant. Now.',ch:[['Find Grant',null]]})},1.6)}
  c1Hud(null)}
function c1Obj(id,lx,lz,label,f,r=1.6){const I=INT[id],o={x:I.x0+lx,z:I.z0+lz,r,label,f,c1:1};I.objs.push(o);return o}
function c1ObjClear(){for(const id of['asr','asr_bsmt'])if(INT[id])INT[id].objs=INT[id].objs.filter(o=>!o.c1)}
function c1PhoneDrop(){const I=INT.asr,s=pick(C1PHONE);C1.phoneRoom=s[0];C1.rT=1;setTimeout(()=>toast('Dylan keeps calling his phone. Listen for the ring: it gets louder as you get closer.',4500),900);const m=new THREE.Mesh(bgeo(.09,.015,.17),SM({color:0x111114,emissive:0x5ab0ff,emissiveIntensity:.6}));m.position.set(I.x0+s[1],.06,I.z0+s[2]);m.rotation.y=rnd()*TAU;I.g.add(m);C1.phoneM=m;
  c1Obj('asr',s[1],s[2],'Pick up the phone',()=>{give('c1phone');sfx('coin');toast('Dylan\'s phone. Seventeen missed calls from "MOM". Take it back to Dylan: follow the gold marker.',4000);if(C1.phoneM){C1.phoneM.parent&&C1.phoneM.parent.remove(C1.phoneM);C1.phoneM=null}const I2=INT.asr;I2.objs=I2.objs.filter(o=>o.label!=='Pick up the phone')},1.4)}
function c1SleeperHelped(){const s=C1.sleepN;if(s&&NP.includes(s)){s.g.rotation.set(-PI/2,PI/2,PI/2,'YXZ');const I=INT.asr;const h=spawn('brothers','asr',{house:'asr',fem:0,x:s.x+.9,z:s.z-.9,a:-PI/2,temp:1,mode:'idle',name:'Marco Ruiz',title:'ΑΣΡ Brother',lvl:5,actor:1});h.c1help=1;if(AM)AM.temps.push(h);bubble(h,'Easy, buddy. Sip this. Slow.',4)}c1ObjClear();if(C1.phoneM){const I=INT.asr;const sp=C1PHONE.find(p=>p[0]===C1.phoneRoom);if(sp&&!has('c1phone'))c1Obj('asr',sp[1],sp[2],'Pick up the phone',()=>{give('c1phone');sfx('coin');toast('Dylan\'s phone. Seventeen missed calls from "MOM". Take it back to Dylan: follow the gold marker.',4000);if(C1.phoneM){C1.phoneM.parent&&C1.phoneM.parent.remove(C1.phoneM);C1.phoneM=null}INT.asr.objs=INT.asr.objs.filter(o=>o.label!=='Pick up the phone')},1.4)}}
const c1IsBro=n=>n&&n.cl==='brothers'&&!n.pclass&&!n.pledge&&!n.actor&&nid(n)!=='grant'&&!n.c1phone;
// V145 a brother counts the moment any conversation takes him to +20 at the party (kept by key, so it can't un-count)
function c1Rel(n,k,v){if(C1.party&&c1IsBro(n)&&v>=20){(C1.ok=C1.ok||new Set()).add(k);n.c1met=1}}
function c1BroCount(){const s=C1.ok=C1.ok||new Set();for(const n of NP)if(c1IsBro(n)&&n.c1met&&relPeek(n)>=20)s.add(relKey(n));return s.size}
// rival and allied houses for the Cliques tab, added as they enter the story
const C1FRN={kto:['Kappa Theta Omega','ΚΘΩ'],dlp:['Delta Lambda Phi','ΔΛΦ']};
function c1FratRows(){const F=S.fr||{},ks=Object.keys(F).filter(k=>C1FRN[k]);if(!ks.length)return'';const lab=v=>v<=-25?'Rival':v>=25?'Ally':'Neutral';
  return'<h3>Fraternities &amp; Sororities</h3>'+ks.map(k=>{const v=F[k],w=Math.abs(v)/2;return`<div class="rep"><span>${C1FRN[k][1]} ${C1FRN[k][0]}</span><div class="rbar"><b style="left:${v<0?50-w:50}%;width:${w}%;background:${v<0?'#c0392b':'#4f9a5a'}"></b></div><span>${v>0?'+':''}${v} · ${lab(v)}</span></div>`}).join('')}
function c1Frat(k,d,lo,hi){S.fr=S.fr||{};S.fr[k]=clamp((S.fr[k]||0)+d,lo??-100,hi??100)}
function c1PartyLab(){const b=Math.min(3,c1BroCount()),k=v=>v?'✓':'○';return`\n${k(b>=3)} Meet 3 brothers, +20 each (${b}/3)\n${k(C1.phone)} Find Dylan's phone\n${k(C1.sleeper)} Get help for the passed-out guy\n${k(C1.pong)} Beat a pledge at beer pong`}
function c1PartyDone(){return c1BroCount()>=3&&C1.phone&&C1.sleeper&&C1.pong}
function c1PartyGoal(){if(C1.sleepSeen&&!C1.sleeper)return npcSpot('grant');if(has('c1phone')&&!C1.phone){const n=AM&&AM.temps.find(n=>n.c1phone);if(n)return[n.x,n.z]}return null}
/* V152 Grant's "I'm watching you": eyes narrowed, two-finger V at his own eyes, then swung out at Danny. Grant is a posed throne statue (no animP), so the pose is set by hand and put back afterwards.
   V153: the V is now held IN FRONT of his face like the classic gesture (back of the hand to the viewer, palm to his face, fingers spread sideways with the tips just under his eyes, straddling the nose). Before, the fingers spread front-to-back (edge-on to the camera) and the hand hung off his shoulder. Arm angles were solved with forward kinematics against the rig (shoulder 0.35/1.47, upper arm .28, forearm .235) so the fingertips land at about x -.04..+.06, y 1.77, z .25 in his local frame (eyes: y 1.81, z .17). */
function c1WatchProp(g){const P_=g.g.P;if(g.vf)return g.vf;const sk=mt(0xf1c9a5,.6),u=new THREE.Group();P_.hR.add(u);
  const fist=new THREE.Mesh(roundBox(.1,.12,.12,.035,2),sk);fist.position.set(0,-.14,.005);u.add(fist);
  // index + middle finger, spread along the hand's width (local z) so the V reads face-on when the back of the hand faces the viewer
  for(const[z,r]of[[.022,-.22],[-.022,.22]]){const f=new THREE.Mesh(new THREE.CylinderGeometry(.0145,.0125,.15,8).translate(0,-.075,0),sk);f.position.set(0,-.14,z);f.rotation.x=r;
    const tip=new THREE.Mesh(new THREE.SphereGeometry(.0125,8,6),sk);tip.position.y=-.15;f.add(tip);u.add(f)}
  u.visible=false;return g.vf=u}
function c1WatchPose(g,k){const P_=g.g.P;if(!P_)return;const L=(a,b)=>a+(b-a)*k;
  // k=0: V up in front of his face, fingertips just under the eyes. k=1: arm swung out, V pointing at Danny.
  P_.aR.rotation.set(L(-1.197,-1.42),L(-.336,0),L(-.636,-.1));P_.eR.rotation.set(L(-1.289,-.45),0,0);P_.hR.rotation.set(L(-.45,0),L(.6,0),L(-.36,0));
  P_.head.rotation.x=.14;P_.neck.rotation.x=.05;try{P_.pal[24].x=.45}catch(e){}}
function c1WatchEnd(g){const P_=g.g.P;if(!P_)return;if(g.vf)g.vf.visible=false;
  P_.aR.rotation.set(-.3,0,.14);P_.eR.rotation.set(-1,0,0);P_.hR.rotation.set(0,0,0);P_.head.rotation.x=0;P_.neck.rotation.x=0;try{P_.pal[24].x=0}catch(e){}}
/* V151 the rush party opens as a real scene: the camera pushes through the packed house to Grant's throne, he sizes Danny up and mouths MINGLE, then control returns */
async function c1PartyIntro(done){
  $('fade').style.opacity=1;await new Promise(r=>setTimeout(r,450));
  if(!(S.gt>=20.5&&S.gt<23.5))S.gt=21;
  const I=INT.asr,gx=I.x0+24,gz=I.z0+2.1,G=NN.grant;
  goIn('asr',24,31.5);P.face=PI;yaw=0;camT=3;c1PartyOn();PM.visible=true;
  let ct=0,bt=0,sh=0,ws=0;
  c1CineOn(dt=>{
    ct+=dt;bt+=dt;if(bt>.5){bt=0;tone(62,.1,'sine',.09)}
    if(sh===0){const k=Math.min(1,ct/5.4),e=k*k*(3-2*k);
      cam.position.set(gx+Math.sin(ct*.7)*.9,1.55+.45*e+Math.sin(ct*1.3)*.05,I.z0+33.2-e*25);
      cam.lookAt(gx,1.5+.45*e,gz+3*(1-e))}
    else{ws+=dt;cam.position.set(gx+.55,2.05,gz+3.2);cam.lookAt(gx-.08,2.0,gz);
      if(G&&G.g.P)c1WatchPose(G,Math.min(1,Math.max(0,(ws-1.5)/.8)))}});
  $('fade').style.opacity=0;big('THE RUSH PARTY',2200);
  await c1Wait(5.6);sh=1;
  if(G&&G.g.P){c1WatchProp(G).visible=true;c1WatchPose(G,0)}
  await c1Wait(1.6);   // narrowed eyes, two fingers up to his own eyes
  if(G){c1Say(G,'MINGLE.',3);sfx('ui')}
  await c1Wait(2.6);   // fingers swing out at Danny
  c1Sub(null);if(G)c1WatchEnd(G);c1CineOff();
  P.face=PI;yaw=0;camT=3;
  toast('Mingle. Meet 3 brothers, find Dylan\'s phone, look out for anyone in trouble, and beat a pledge at beer pong.',6500);
  done()}
function c1PartyOff(){C1.party=0;TSMUL=1;if(C1.crowdIn)C1.crowdIn.g.visible=false;if(C1.crowdOut)C1.crowdOut.g.visible=false;if(C1.disco)C1.disco.forEach(m=>m.visible=false);c1ObjClear();if(C1.phoneM){C1.phoneM.parent&&C1.phoneM.parent.remove(C1.phoneM);C1.phoneM=null}take('c1phone')}

// ================================================================ f) THE BLACKOUT
async function c1BlackoutCine(done){c1CineOn(()=>{cam.position.set(P.x+Math.sin(P.face+PI)*2.2,2.5,P.z+Math.cos(P.face+PI)*2.2);cam.lookAt(P.x,1.5,P.z)});C1.act=[];
  for(let i=0;i<5;i++){C1.blackout=i%2?0:1;tone(i%2?90:60,.08,'square',.06);await c1Wait(.18+rnd()*.15)}C1.blackout=1;tone(220,.6,'sawtooth',.05);tone(110,.9,'sawtooth',.05,.1);
  if(C1.crowdIn)C1.crowdIn.g.visible=false;if(C1.disco)C1.disco.forEach(m=>m.visible=false);c1CrowdOut().g.visible=true;
  // the people who stayed by the door, complaining on the lawn
  C1.comp=[];[[80,70],[78.5,80],[83,86],[76.5,74.5],[82,64.5]].forEach(([x,z],i)=>{const n=spawn(['sororities','athletes','studentgov','legacies','townies'][i],'greek',{x,z,a:Math.atan2(92-x,76-z),temp:1,mode:'idle',lvl:2});n.c1comp=1;C1.comp.push(n);if(AM)AM.temps.push(n)});
  toast('The power\'s out. Everyone is pouring onto the lawn.',3000);await c1Wait(1.2);c1CineOff();done()}
const C1GRIPE=['Who killed the music?!','Is the party OVER?','Lame. LAME!','I left my jacket in there!','ΑΣΡ can\'t even pay their power bill.','Kappa Theta never has blackouts.','My phone\'s at 2%. Great.','Is this part of the party?'];
function c1DungIn(){S.c1dung=1;sfx('ui');try{maDoor()}catch(e){}for(const n of NP)if(n.int==='asr_bsmt'&&!n.temp){n.c1hid=1;n.hidden=1}
  fadeTo(()=>{goIn(DUNG.id,DUNG.sx,DUNG.D-8.6);P.face=PI;yaw=0;pitch=.32;camT=4;toast('Pitch dark, except the old bulbs on the emergency circuit. Follow the marker to the fuse room door in the north-west corner.',5000)})}
function c1NotesClear(){if(INT.asr_bsmt)INT.asr_bsmt.objs=INT.asr_bsmt.objs.filter(o=>!o.c1);for(const m of C1.noteM||[]){m.parent&&m.parent.remove(m);const g=m.userData.glow;g&&g.parent&&g.parent.remove(g)}C1.noteM=[];C1.glows=[];take('c1code')}
function c1HazeStart(){c1NotesClear();const I=INT.asr_bsmt,st=curStep(),Z=(lx,lz)=>[I.x0+lx,I.z0+lz];C1.notes=new Set();C1.doorSeen=0;C1.fuseOpen=0;c1Obj('asr_bsmt',10.7,7.1,'Use the keypad',()=>c1UseKeypad(),1.8);C1.code=[1+Math.floor(rnd()*9),Math.floor(rnd()*10),Math.floor(rnd()*10)];
  const mk=(cl,lx,lz,a,o)=>{const[x,z]=Z(lx,lz),n=spawn(cl,'asr_bsmt',Object.assign({x,z,a,temp:1,mode:'idle',lvl:5},o));n.hx=x;n.hz=z;n.ha=a;n.stepTemp=st;if(AM)AM.temps.push(n);return n};
  const pt=(lx,lz)=>Z(lx,lz);
  C1.haze=[mk('brothers',92,8,PI/2,{house:'asr',name:'Rhett Calder',title:'ΑΣΡ Brother',mode:'guard',patrol:[pt(92,8),pt(113,8),pt(113,15),pt(92,15)]}),
    mk('brothers',112,35,-PI/2,{house:'asr',name:'Grady Voss',title:'ΑΣΡ Brother',mode:'guard',patrol:[pt(112,35),pt(91,35),pt(91,28),pt(112,28)]}),
    mk('brothers',107,21,-PI/2,{house:'asr',name:'Luke Danner',title:'Pledgemaster\'s Assistant',ha:-PI/2})];
  C1.hazed=[mk('brothers',99.5,21.5,PI/2,{house:'asr',noLetters:1,prop:1,name:'Hazed Pledge',title:'Fall Pledge Class',lvl:1}),mk('brothers',102.5,24.5,PI,{house:'asr',noLetters:1,prop:1,name:'Hazed Pledge',title:'Fall Pledge Class',lvl:1})];
  for(const h of C1.hazed){h.blind=1;h.actor=1}
  const NOTES=[[116.5,4,'A page torn from a pledge notebook, stuffed behind a pipe in the haze room:\n\n"FUSE ROOM: the FIRST number is '+C1.code[0]+'. Don\'t let them catch you down here. — S."'],
    [116.5,56.5,'Scratched into the solitary wall, next to a tally of days:\n\n"code middle = '+C1.code[1]+'"'],
    [60,27.1,'A sticky note taped to a cage post, stained with something you decide is soda:\n\n"last digit '+C1.code[2]+'. Fuse room, NW corner. Grant changes it every semester."']];
  C1.noteM=[];NOTES.forEach(([lx,lz,tx],k)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(.36,.46),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(3,2.9,2.3)}));m.rotation.set(-PI/2,0,rnd()*PI);m.position.set(I.x0+lx,.09,I.z0+lz);I.g.add(m);C1.noteM.push(m);c1Glow(m,0xffe08a);
    c1Obj('asr_bsmt',lx,lz,'Pick up the torn note',()=>{if(C1.notes.has(k))return;C1.notes.add(k);m.visible=false;if(m.userData.glow)m.userData.glow.visible=false;QI.c1code='Fuse code: '+c1CodeStr();give('c1code');sfx('ok');card({title:'Note '+(C1.notes.size)+' of 3',sp:'',alert:1,text:tx+'\n\nCode so far: '+C1.code.map((d,i)=>C1.notes.has(i)?d:'_').join(' '),ch:[['Keep it',null]]});INT.asr_bsmt.objs=INT.asr_bsmt.objs.filter(o=>!(o.c1&&Math.abs(o.x-I.x0-lx)<.1&&Math.abs(o.z-I.z0-lz)<.1))},1.3)});
  toast('Brothers are hazing pledges in the haze room. If they see you, they\'ll throw you back to the stairs. C to sneak.',5000)}
function c1Glow(m,col){const al=GC.dGl&&GC.dGl.alphaMap,g=new THREE.Group();const h=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({color:col,alphaMap:al,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));h.rotation.x=-PI/2;h.position.y=.02;h.renderOrder=4;g.add(h);
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.18,.5,2.6,12,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));c.position.y=1.3;c.renderOrder=4;g.add(c);g.position.set(m.position.x,0,m.position.z);m.parent.add(g);m.userData.glow=g;(C1.glows=C1.glows||[]).push([m,g,h,c])}
function c1CodeStr(){return(C1.code||[0,0,0]).map((d,i)=>C1.notes.has(i)?d:'_').join(' ')}
function c1DungGoal(){const kp=c1W('asr_bsmt',10.7,7.1);if(!C1.doorSeen||C1.notes.size>=3)return kp;let b=null,bd=1e9;(C1.noteM||[]).forEach((m,i)=>{if(C1.notes.has(i))return;const d=Math.hypot(m.position.x-P.x,m.position.z-P.z);if(d<bd){bd=d;b=[m.position.x,m.position.z]}});return b||kp}
function c1UseKeypad(){C1.doorSeen=1;if(C1.notes.size<3){sfx('bad');card({title:'Keypad',sp:'',alert:1,text:'A grimy keypad wants a 3-digit code. The LED stays red.\n\nThe brothers never remember it either: they leave pieces of it written on notes around the basement. Look for the glowing notes ('+C1.notes.size+' of 3 found). The marker will take you to the nearest one.',ch:[['Go find them',null]]});return}c1Keypad()}
function c1UpToLiving(){sfx('ui');try{maDoor()}catch(e){}$('fade').style.opacity=1;setTimeout(()=>$('fade').style.opacity=0,120);goIn('asr',24,30.5);P.face=PI;yaw=P.face+PI;pitch=.32;camT=3;
  /* the basement stair ramp lifts Danny ~2.4 units; the next scene starts before a normal frame can drop him back to the floor, so reset height and snap the camera here */
  P.y=0;P.jy=0;P.sup=0;P.stOn=0;P.dk=null;P.sx=P.x;P.sz=P.z;PM.position.set(P.x,0,P.z);PM.rotation.set(0,P.face,0);SCENE=null;cam.position.set(P.x,P.y+1.55+Math.sin(pitch)*camT,P.z+Math.cos(pitch)*camT);cam.lookAt(P.x,P.y+1.55,P.z)}
function c1HazeKeep(){for(const n of(C1.haze||[]).concat(C1.hazed||[]))n.stepTemp=null}
function c1Caught(k){const I=INT.asr_bsmt;$('fade').style.opacity=1;setTimeout(()=>{if(k===0){P.x=I.x0+DUNG.sx;P.z=I.z0+DUNG.D-8.5;P.face=PI}else{P.x=I.x0+5;P.z=I.z0+6;P.face=0}P.vx=P.vz=0;yaw=P.face+PI;$('fade').style.opacity=0},300);sfx('bad');
  toast(k===0?'"HEY! Party\'s UPSTAIRS, rushee." A brother shoves you back toward the stairs.':'"Who\'s there?!" You duck back into the fuse room before they get a good look.',3800)}
// the keypad on the fuse room door
function c1Keypad(){const st=curStep();let ent='';const el=document.createElement('div');el.id='c1kp';el.style.cssText='position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45)';
  el.innerHTML=`<div style="background:#1d2026;border:2px solid #5a5e66;border-radius:14px;padding:18px 18px 14px;width:236px;box-shadow:0 12px 40px rgba(0,0,0,.6);font-family:Archivo,Arial,sans-serif;color:#e8e2d0"><div style="font:700 12px Archivo;letter-spacing:.14em;color:#d8b030;margin-bottom:8px">ELECTRICAL · KEEP OUT</div><div id="c1kd" style="background:#0c1a10;color:#5aff7a;font:700 30px monospace;letter-spacing:.4em;text-align:center;padding:8px 0;border-radius:6px;margin-bottom:12px">_ _ _</div><div id="c1kb" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"></div><div style="font-size:13px;margin-top:10px;text-align:center;color:#f2d06a">Your notes: <b style="letter-spacing:.2em">${c1CodeStr()}</b></div><div style="font-size:11px;opacity:.7;margin-top:4px;text-align:center">Type the code · Esc to step away</div></div>`;
  document.body.appendChild(el);const disp=el.querySelector('#c1kd'),bx=el.querySelector('#c1kb');const show=()=>{disp.textContent=[0,1,2].map(i=>ent[i]||'_').join(' ')};
  const close=()=>{el.remove();MGK=null;mode='play'};
  const press=k=>{if(k==='C'){ent='';show();tone(500,.05,'square',.04);return}if(ent.length>=3)return;ent+=k;show();tone(700+(+k)*30,.06,'square',.05);if(ent.length===3)setTimeout(()=>{if(ent===C1.code.join('')){tone(880,.1,'triangle',.07);tone(1320,.15,'triangle',.07,.1);disp.style.color='#9aff9a';setTimeout(()=>{close();dungDoorOpen(1);C1.fuseOpen=1;sfx('ok');toast('Click. The fuse room door swings open.',2600);INT.asr_bsmt.objs=INT.asr_bsmt.objs.filter(o=>o.label!=='Use the keypad')},380)}else{tone(140,.3,'sawtooth',.07);disp.style.color='#ff5a4a';disp.textContent='ERR';setTimeout(()=>{ent='';disp.style.color='#5aff7a';show()},700)}},160)};
  for(const k of['1','2','3','4','5','6','7','8','9','C','0','✕']){const b=document.createElement('button');b.textContent=k;b.style.cssText='font:700 18px Archivo,Arial;padding:10px 0;border-radius:8px;border:1px solid #4a4e56;background:#2a2e36;color:#f2e6c8;cursor:pointer';b.onclick=()=>{if(k==='✕')close();else press(k)};bx.appendChild(b)}
  mode='mg';unlock();MGK=e=>{if(/^Digit\d$/.test(e.code)){e.preventDefault();press(e.code.slice(5))}else if(/^Numpad\d$/.test(e.code)){e.preventDefault();press(e.code.slice(6))}else if(e.code==='Backspace'){e.preventDefault();ent=ent.slice(0,-1);show()}else if(e.code==='Escape'){e.preventDefault();close()}};show()}
function c1FuseOn(){C1.lev=1;C1.blackout=0;tone(70,.3,'square',.1);tone(140,.5,'sawtooth',.05,.15);[262,330,392,523].forEach((f,i)=>tone(f,.15,'triangle',.05,.4+i*.08));
  if(C1.crowdOut)C1.crowdOut.g.visible=false;if(C1.crowdIn)C1.crowdIn.g.visible=true;if(C1.disco)C1.disco.forEach(m=>m.visible=true);for(const n of C1.comp)if(NP.includes(n)){despawn(n);if(AM)AM.temps=AM.temps.filter(m=>m!==n)}C1.comp=[];
  toast('CLUNK. Upstairs, the bass kicks back in and the whole house cheers.',3500)}
function c1CheckersStart(){const I=INT.asr_bsmt,st=curStep(),Z=(lx,lz)=>[I.x0+lx,I.z0+lz];C1.check=[];
  for(const[nm,pat]of[['Rhett Calder',[[30,72],[30,30],[52,30],[52,72]]],['Luke Danner',[[14,70],[74,70],[74,80],[14,80]]]]){const[x,z]=Z(...pat[0]),n=spawn('brothers','asr_bsmt',{house:'asr',x,z,temp:1,mode:'guard',lvl:5,name:nm,title:'ΑΣΡ Brother',patrol:pat.map(p=>Z(...p))});n.stepTemp=st;if(AM)AM.temps.push(n);C1.check.push(n)}
  bubble(C1.check[0],'Who flipped the breaker?! Somebody\'s DOWN here.',3);toast('Two brothers are coming down to check. Get back up the stairs without being seen (C to sneak).',4500)}
async function c1NightEnd(done){$('fade').style.opacity=1;await new Promise(r=>setTimeout(r,500));c1PartyOff();c1NotesClear();for(const n of NP)if(n.c1hid){n.hidden=0;n.c1hid=0}
  S.gt=9;S.day++;newDay();goIn('asr',10.6,27);P.face=0;yaw=PI;camT=3;$('fade').style.opacity=0;
  card({title:'The Morning After',sp:'',alert:1,text:'The party rages until three in the morning. You fall asleep on the living-room couch with a party hat stuck to your face.\n\nAt nine, someone starts pounding on the front door like they own the place.',ch:[['Get up',()=>done()]]})}
function c1BlackoutReset(){C1.blackout=0;C1.lev=0;if(DUNG.lever)DUNG.lever.rotation.x=1.1;try{dungDoorOpen(0)}catch(e){}c1PartyOff();for(const n of NP)if(n.c1hid){n.hidden=0;n.c1hid=0}const kp=$('c1kp');if(kp){kp.remove();MGK=null;if(mode==='mg')mode='play'}}

// ================================================================ g) THE DEAN
/* V153 during Meet the Dean she is in her office in Van Wormer Hall, not standing outside on the steps. Idempotent; run from c1Tick. */
function c1DeanSync(){const n=NN.dean,I=INT.deanoff;if(!n||!I||n.grab||n.down)return;const want=!!(S.done.c1blackout&&!S.done.c1dean);
  if(want&&n.int!=='deanoff'){if(!n.dhome)n.dhome={x:n.hx,z:n.hz,a:n.ha,int:n.int||null};n.int='deanoff';n.x=n.hx=n.tx=I.x0+7;n.z=n.hz=n.tz=I.z0+2.5;n.a=n.ha=0;n.path=null;n.job=null;n.aggro=0;n.chase=0}
  else if(!want&&n.int==='deanoff'&&P.inside!=='deanoff'&&n.dhome){const h=n.dhome;n.int=h.int;n.x=n.hx=n.tx=h.x;n.z=n.hz=n.tz=h.z;n.a=n.ha=h.a;n.path=null}}
async function c1DeanOffice(done){$('fade').style.opacity=1;await new Promise(r=>setTimeout(r,350));c1DeanSync();goIn('deanoff',7,8.6);P.face=PI;yaw=P.face+PI;pitch=.32;camT=3;
  /* the Dean was culled while she stood on the front steps; the card starts before the NPC loop can show her again, so reveal her in the office now */
  {const d=NN.dean;if(d&&d.int==='deanoff'&&!d.hidden&&!d.down){d.g.visible=true;d.g.position.set(d.x,terrH(d.x,d.z),d.z);d.g.rotation.set(0,d.a,0);d.sp=0;d.vx=d.vz=0}}
  $('fade').style.opacity=0;toast('The Dean\'s office, Van Wormer Hall.',2200);done()}
async function c1DeanCine(done){S.c1deanSeen=1;$('fade').style.opacity=1;await new Promise(r=>setTimeout(r,350));goOut(84.6,80.2);P.face=-PI/2-.5;yaw=P.face+PI;
  c1CineOn(()=>{cam.position.set(77.2,3,85.5);cam.lookAt(84.5,1.8,76)});C1.act=[];$('fade').style.opacity=0;
  const dn=c1Actor('studentgov',80.6,76.6,PI/2,{name:'Dean Halvorsen',title:'Dean of Students',shirt:0x50545e,sleeve:0x50545e,pants:0x2a2c33,fem:1,hair:0x9a9a9a,lvl:5,actor:1});
  const bros=[[87.6,73.6],[88,77],[87.5,80.4]].map(([x,z],i)=>c1Actor('brothers',x,z,-PI/2,{house:'asr',name:['Derek Lund','Ty Barrett','Sam Whitley'][i],title:'ΑΣΡ Brother',lvl:4,actor:1}));
  await c1Wait(.8);const sp='Dean of Students';
  await c1Card(dn,'Dean Halvorsen',sp,'"Alpha Sigma Rho. Good morning, gentlemen. I hear you threw quite a party last night. So did the rest of Greek Row: four noise complaints, a 911 call that got cancelled at the last minute, and a blackout."');
  await c1Line(bros[1],'Old house. Bad wiring.');
  await c1Card(dn,'Dean Halvorsen',sp,'"Old house. Old wiring. Old traditions." She smiles without any warmth at all. "I have read this chapter\'s file, gentlemen. All of it. You are on your final warning. Hazing, drinking, anything that walks like either one, and your charter goes through my shredder. I look under rocks for a living."');
  await c1Line(bros[0],'…Yes, ma\'am.');
  await c1Card(dn,'Dean Halvorsen',sp,'She turns to you. "And you are? …Kowalski. No propeller hat yet, I see. Good. My office, Van Wormer Hall. Today. Don\'t make me come find you."',[['"Yes, ma\'am."',null]]);
  c1CineOff();for(const n of[dn,...bros])if(NP.includes(n)){despawn(n);if(AM)AM.temps=AM.temps.filter(m=>m!==n)}try{saveGame()}catch(e){}done()}

// ================================================================ dialogue hooks (called from talkTo)
// V168: any ΑΣΡ member can be the one who greets Danny: they take over Marcus's two intro cards (own name, same pointer to Grant)
function c1HostIntro(n,st){const f=n.name.split(' ')[0],role=(n.pclass||n.pledge)?'Pledge':'Brother',cs=AM.steps.slice(AM.i+1,AM.i+4).filter(q=>q.t==='card'&&/Marcus/.test(q.sp||''));
  if(cs.length>=2){const sp=n.name+' \u00b7 '+(n.title||('ΑΣΡ '+role)).trim();cs[0].sp=cs[1].sp=sp;cs[0].focus=cs[1].focus=n;
    cs[0].tx=f+' looks you over from the porch.\n\n"You lost? You\'ve got the look. Duffel bag, no map, slightly sunburned. I\'m '+f+'. Alpha Sigma Rho. '+role+'."'}
  completeGo(st)}
function c1Talk(n,ch,reply){try{c2Talk(n,ch,reply)}catch(e){console.warn('c2Talk',e)}try{gigTalk(n,ch,reply)}catch(e){console.warn('gigTalk',e)}const st=curStep(),mid=AM&&AM.m.id,id=nid(n);
  const asr=n.house==='asr'||n.cl==='brothers'||/^asr/.test(n.int||'');
  if(mid==='c1arrive'&&st&&st.find&&!asr&&!n.auth)ch.push(['"Do you know where Alpha Sigma Rho is?"',()=>reply(c1Dir(n))(),'','task']);
  else if(mid==='c1arrive'&&st&&st.find&&n.auth)ch.push(['"Officer, which way is Greek Row?"',()=>reply(c1Dir(n))(),'','task']);
  if(mid==='c1arrive'&&st&&st.find&&!n.auth&&(asr||n.fb))ch.push(['"I\'m Danny Kowalski. I\'m here for rush."',()=>c1HostIntro(n,st),'','task']);
  if(mid==='c1meet'&&st&&st.pledgeTalk&&n.pclass){const asked=AM.c1pl&&AM.c1pl.has(id);ch.push(['"So what\'s Alpha Sigma Rho actually like?"',()=>{(AM.c1pl=AM.c1pl||new Set()).add(id);reply(c1LoreAsk(id))()},asked?'You already asked':'','task'])}
  if(mid==='c1party'){
    if(c1IsBro(n)){n.c1met=1;if(!n.c1in)ch.push(['"Hey, I\'m Danny. Danny Kowalski. I\'m rushing."',()=>{n.c1in=1;relAdd(n,11+Math.round(rnd()*4+talkOdds(n)*3));reply(n.c1g1||pick(['"Kowalski. Okay, rushee. Let\'s see if you stick around."','"Rushing, huh? Grab a soda and don\'t touch the pool table."','"Welcome to rush. Don\'t embarrass us."']))()},'','task']);
      else if(!n.c1dad)ch.push(['"My dad was a brother here. Big Ed Kowalski, class of \'94."',()=>{n.c1dad=1;relAdd(n,7+Math.round(rnd()*4));reply(pick(BIGED))()},'','task'])}
    if(n.c1phone){if(!C1.phoneAsk)ch.push(['"You look like you lost something."',()=>{C1.phoneAsk=1;c1PhoneDrop();reply(`"My PHONE, man. I had it like ten minutes ago. I was ${C1.phoneRoom}, I think? Find it and I owe you."`)()},'','task']);
      else if(has('c1phone')&&!C1.phone)ch.push(['"Found your phone."',()=>{take('c1phone');C1.phone=1;relAdd(n,12);reply('"NO WAY. You\'re a lifesaver, rushee. My mom was about to call the police. Again."')()},'','task'])}
    if(id==='grant'&&C1.sleepSeen&&!C1.sleeper)ch.push(['"Grant, there\'s a guy passed out cold in the living room."',()=>{C1.sleeper=1;stand(4);c1SleeperHelped();reply('Grant is on his feet before you finish. "Marco! Living room, NOW. Get him on his side and get water in him. Nobody leaves him alone until he\'s talking." He looks back at you. "Good catch, Kowalski. That\'s exactly the kind of thing that ends a house."')()},'','task']);
    if(n.pclass&&!C1.pong)ch.push(['"Beer pong. You and me, right now."',()=>startEvent('pong',w=>{if(w){C1.pong=1;S.uDie=1;stand(2);card({title:'Beer Pong',sp:'',alert:1,text:`You sink the last cup and the room goes nuts. ${n.name.split(' ')[0]} buries his face in his hands.\n\nThe brothers drag the old beer die table out of the shed: the backyard game table is open for business.`,ch:[['Nice',null]]})}else toast(n.name.split(' ')[0]+' wins this one. Talk to a pledge for a rematch.',3500)}),'','task'])}}

// ================================================================ per-frame (crowd, music, bubbles, the fuse lever) and lighting
// V163 compass: bearing is clockwise from north (north = -z, east = +x); the camera looks along (-sin yaw, -cos yaw), so bearing = -yaw
const CMP={q:null,h:1e9},CMPL={0:'N',45:'NE',90:'E',135:'SE',180:'S',225:'SW',270:'W',315:'NW'};
function compassTick(){const q=CMP.q||(CMP.q=$('cmpc').getContext('2d')),e=cam.matrixWorld.elements,h=(((Math.atan2(-e[8],e[10])*180/PI)%360)+360)%360,dd=Math.abs(h-CMP.h);if(CMP.h<=360&&Math.min(dd,360-dd)<.05)return;CMP.h=h;
  const W=560,H=34,PPD=W/110,ctr=W/2;q.clearRect(0,0,W,H);q.textAlign='center';q.textBaseline='middle';
  for(let a=Math.ceil((h-58)/5)*5;a<=h+58;a+=5){const x=ctr+(a-h)*PPD,n=((a%360)+360)%360,l=CMPL[n];
    if(l){q.font=(l.length===1?'700 17px':'700 12px')+' Graduate,Georgia';q.fillStyle=l==='N'?'#e2b64c':'#f2e6c8';q.shadowColor='rgba(0,0,0,.8)';q.shadowBlur=3;q.fillText(l,x,13);q.shadowBlur=0;q.fillRect(x-.75,26,1.5,7)}
    else{q.fillStyle=n%15===0?'rgba(242,230,200,.85)':'rgba(242,230,200,.45)';q.fillRect(x-.5,n%15===0?24:28,1,n%15===0?9:5)}}
  q.fillStyle='#e2b64c';q.beginPath();q.moveTo(ctr-5,0);q.lineTo(ctr+5,0);q.lineTo(ctr,6);q.closePath();q.fill()}
function c1Tick(dt){if(mode==='title'||mode==='loading')return;mapHintTick();try{turfEnsure()}catch(e){console.warn('turfEnsure',e)}try{crowdTick(dt)}catch(e){console.warn('crowdTick',e)}try{crowdSolid()}catch(e){console.warn('crowdSolid',e)}try{c1DeanSync()}catch(e){console.warn('c1DeanSync',e)}try{c2Tick(dt)}catch(e){console.warn('c2Tick',e)}try{c3Tick(dt)}catch(e){console.warn('c3Tick',e)}try{c4Tick(dt)}catch(e){console.warn('c4Tick',e)}try{c5Tick(dt)}catch(e){console.warn('c5Tick',e)}try{c6Tick(dt)}catch(e){console.warn('c6Tick',e)}try{c7Tick(dt)}catch(e){console.warn('c7Tick',e)}try{c8Tick(dt)}catch(e){console.warn('c8Tick',e)}try{c9Tick(dt)}catch(e){console.warn('c9Tick',e)}try{c10Tick(dt)}catch(e){console.warn('c10Tick',e)}try{gigTick(dt)}catch(e){console.warn('gigTick',e)}if(S.pledged&&S.prole&&C1.roleFixed!==S.prole)c1RoleFix();
  if(!AM&&mode==='play'&&!P.inside&&S.ch===1&&S.done.cater&&!S.done.c1rival&&Math.hypot(P.x-84,P.z-76)<30){const m=M.find(m=>m.id==='c1rival');if(m)startMission(m)}
  if(C1.crowdIn&&C1.crowdIn.g.visible&&P.inside==='asr')c1CrowdUpd(C1.crowdIn,TT);
  if(C1.crowdOut&&C1.crowdOut.g.visible&&!P.inside&&Math.hypot(P.x-84,P.z-76)<80)c1CrowdUpd(C1.crowdOut,TT*.3);
  if(C1.party&&!C1.blackout&&P.inside==='asr'&&mode!=='mg'){C1.bt=(C1.bt||0)-dt;if(C1.bt<=0){C1.bt=.47;C1.bc=(C1.bc||0)+1;tone(52,.16,'sine',.07);if(C1.bc%2)noise(.04,.018,7000);if(C1.bc%8===4)tone(196,.12,'square',.02)}
    if(C1.disco){const I=INT.asr;C1.disco.forEach((m,i)=>{const a=TT*(.5+i*.17)+i*2.1;m.position.set(I.x0+[8,24,39][i]+Math.cos(a)*3.2,.07,I.z0+27+Math.sin(a*1.3)*4)})}}
  if(C1.phoneM&&C1.party&&!C1.blackout&&P.inside==='asr'&&mode==='play'){C1.rT=(C1.rT||0)-dt;const d=Math.hypot(C1.phoneM.position.x-P.x,C1.phoneM.position.z-P.z),v=clamp(.16*(1-d/40),0,.16);
    C1.phoneM.material.emissiveIntensity=.4+Math.max(0,Math.sin(TT*9))*1.4;if(C1.rT<=0){C1.rT=d<8?1.4:2.4;if(v>.003){tone(1320,.07,'square',v);tone(1320,.07,'square',v,.11);tone(1760,.1,'triangle',v*.8,.24);tone(1320,.07,'square',v,.5);tone(1760,.1,'triangle',v*.8,.62)}}}
  if(C1.comp&&C1.comp.length&&!P.inside){C1.gT=(C1.gT||0)-dt;if(C1.gT<=0){C1.gT=1.6+rnd()*1.4;const n=pick(C1.comp);if(NP.includes(n))bubble(n,pick(C1GRIPE),2.4)}}
  if(C1.haze&&P.inside==='asr_bsmt'&&AM&&AM.m.id==='c1blackout'){C1.hT=(C1.hT||0)-dt;if(C1.hT<=0){C1.hT=2.4+rnd()*1.6;const b=pick(C1.haze.concat(C1.hazed||[]));if(NP.includes(b))bubble(b,b.blind?pick(['…forty-one… forty-two…','Yes, sir!','I\'m sorry, sir!','…forty-three…']):pick(['AGAIN! From the top!','Louder, pledges!','Who told you to stop?!','You call that a push-up?']),2)}
    for(const h of C1.hazed||[])if(NP.includes(h)&&h.g.P){const p=h.g.P,k=Math.abs(Math.sin(TT*2.2+h.uid));h.g.rotation.set(1.22,h.a,0,'YXZ');h.g.position.set(h.x,.22+k*.2,h.z);if(p.aL){p.aL.rotation.x=p.aR.rotation.x=-1.25-k*.35}}}
  {let tg=null;if(C1.party&&AM&&AM.m.id==='c1party'){if(C1.sleepSeen&&!C1.sleeper)tg=NN.grant;else if(has('c1phone')&&!C1.phone)tg=AM.temps.find(n=>n.c1phone)}
    if(tg&&NP.includes(tg)&&(tg.int||null)===(P.inside||null)){if(!C1.mk){const m=new THREE.Mesh(new THREE.ConeGeometry(.32,.6,4),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(2.4,1.9,.4)}));m.rotation.x=PI;m.renderOrder=6;sc.add(m);C1.mk=m}
      C1.mk.visible=true;C1.mk.position.set(tg.x,(tg.throne?3.3:2.75)+Math.sin(TT*3.2)*.15,tg.z);C1.mk.rotation.y=TT*2}else if(C1.mk)C1.mk.visible=false}
  if(C1.glows)for(const[m,g,h]of C1.glows)if(g.visible){const k=.75+Math.sin(TT*3+m.position.x)*.25;h.material.opacity=.9*k;h.scale.setScalar(.9+k*.25)}
  if(C1.lev&&DUNG.lever){DUNG.lever.rotation.x+=(-.7-DUNG.lever.rotation.x)*Math.min(1,dt*6)}
  if(CINE&&CINE.shot==='c1'&&mode==='cine'&&PM.visible){PM.position.set(P.x,P.inside?P.y:terrH(P.x,P.z),P.z);PM.rotation.set(0,P.face,0);animP(PM,0,TT,'')}
  if(CINE&&C1.act.length)for(const n of C1.act){if(!NP.includes(n)||!n.g.P)continue;if(n.c1walk){const w=n.c1walk,l=Math.abs(Math.sin(TT*4.2+n.uid));n.x+=w[0]*dt;n.z+=w[1]*dt;n.hx=n.x;n.hz=n.z;n.vx=n.vz=0;n.a=Math.atan2(w[0],w[1]);n.g.position.set(n.x,terrH(n.x,n.z)+l*.05,n.z);n.g.rotation.set(0,n.a,Math.sin(TT*4.2+n.uid)*.13);animP(n.g,1.3,TT,'')}else{if(n.c1hurt)n.g.rotation.z=Math.sin(TT*1.4+n.uid)*.05;animP(n.g,0,TT,n.c1talk?'talk':'')}}}
function c1Light(){try{if(c2Light())return}catch(e){}if(!P.inside)return;const a=P.inside==='asr'||P.inside==='asr_up';
  /* the basement: pitch black while the power is out, lights snap on when the fuse is pulled */
  if(P.inside==='asr_bsmt'){const am=!!(AM&&AM.m&&AM.m.id==='c1blackout'),out=am&&C1.blackout&&!C1.lev,on=am&&C1.lev;
    if(out||on){const tgt=on?1:0;C1.blv=(C1.blv==null?0:C1.blv)+(tgt-(C1.blv==null?0:C1.blv))*(on?.12:1);const v=C1.blv,L=(a,b)=>a+(b-a)*v;
      hemi.intensity=L(.05,.9);hemi.color.setHex(v>.5?0xffe6c0:0x7a86a8);hemi.groundColor.setHex(v>.5?0x4a3c30:0x07070a);sun.intensity=L(.0,.5);sc.fog.color.setHex(v>.5?0x14100c:0x010102);sc.fog.near=L(2.5,30);sc.fog.far=L(22,140);
      if(GC.dGl2)GC.dGl2.color.setRGB(L(.02,.62),L(.015,.5),L(.01,.3))}
    else if(C1.blv!=null){C1.blv=null;if(GC.dGl2)GC.dGl2.color.setHex(0x2e2414)}
    return}
  else if(GC.dGl2&&C1.blv!=null){C1.blv=null;GC.dGl2.color.setHex(0x2e2414)}
  if(C1.blackout&&a){hemi.intensity=.2;hemi.color.setHex(0x8a9ac8);hemi.groundColor.setHex(0x0e0e16);sun.intensity=.05;sc.fog.color.setHex(0x040508);sc.fog.near=5;sc.fog.far=34}
  else if(C1.party&&a){hemi.intensity=.62;hemi.color.setHex(0xffc0dc);hemi.groundColor.setHex(0x2a1838);sun.intensity=.3;sun.color.setHex(0xd0a8ff);sc.fog.color.setHex(0x160c18);sc.fog.near=16;sc.fog.far=70}}

// ================================================================ the chapter's quests
const T1={
 slap:'Grant is off the throne before you see him move. The crack echoes off the throne room walls, and your head snaps sideways.\n\nBy the time your ears stop ringing he\'s sitting down again. "You listen to me. You listen, and you do what I tell you, because that\'s the only way you ever become a brother in this house. Now go talk to my pledges."',
 marcus:'A guy in a maroon pledge shirt and a propeller beanie looks up from the porch steps.\n\n"You lost? You\'ve got the look. Duffel bag, no map, slightly sunburned. I\'m Marcus. Pledge. Weather Pledge, technically. Don\'t ask."',
 marcus2:'"Kowalski? Wait. BIG ED? The guy who drove a riding mower into the Dean\'s fountain? There\'s a picture of that in the house." He grins. "Okay. Grant\'s gonna want to meet you. He\'s inside, in the throne room."',
 grant:'Grant Ashby doesn\'t get up from the throne.\n\n"Kowalski. Big Ed\'s kid. Word is your old man drove a mower into a fountain. Legends don\'t pay dues, Kowalski, and they don\'t get you letters. It\'s rush week. You\'re nobody here until I say you\'re somebody."\n\n"Go talk to my pledges. Find out what this house is. Then we\'ll see if you\'re worth a bid."',
 meetEnd:'Three pledges, three different stories: a throne, a padlocked basement, a Lantern Walk nobody will explain, and a Dean with her finger on the shredder.\n\nGrant wants to see you again in the throne room.',
 cater:'Grant pulls a folded campus map out of his back pocket and slaps it against your chest, then a crumpled twenty.\n\n"Take this. It\'s a map, and you\'re going to use it, because I\'m not sending a search party after you. Now listen. Rush party is TONIGHT and this house has nothing. No chips, no Genesee, no decorations. Here\'s twenty bucks. That\'s every dollar the chapter can spare, so make it stretch. Bring it all back to the front yard, and don\'t embarrass me."\n\nYour campus map is now unlocked. Press M any time to open it. (Tab opens your planner.)',
 rivalEnd:'Tank Hale comes down off the porch steps and looks at you like he\'s seeing you for the first time.\n\n"Rushee! Where\'d a scrawny kid like you learn to hit like that? Kappa Theta\'s gonna remember your face now. That\'s good AND bad."',
 blackout:'Grant finds you in the dark with his phone flashlight in your face.\n\n"Kowalski. The fuse box is in the basement. Door at the west end of the hall. Padlock\'s off; some of the brothers are already down there. The fuse room has a keypad. I change the code every semester and I never remember it, so don\'t ask me. Get the lights back on before these people walk across the street and tell Kappa Theta we can\'t throw a party."\n\nHe lowers his voice. "And whatever you see down there, you didn\'t see it."',
 lightsOn:'Grant is waiting at the top of the basement stairs. Behind him, the house is thumping again.\n\n"Lights are on, and the whole Row came back inside like nothing happened. Not bad, rushee." His eyes go to the basement door. "You went past the haze room to get there." It isn\'t a question. "Whatever you saw down there, you didn\'t see. Understood?"',
 classes:'"Sit. You\'re a scholarship student, Mr. Kowalski. That means this university is paying for you to be here, and it expects something back."\n\n"Classes meet every weekday: nine in the morning and one in the afternoon. Economics, Chemistry, Public Speaking, Art History and Physics. Yours start tomorrow. Curfew is eleven."',
 ask:'"Now." She folds her hands. "You were in that house last night. You went down into that basement, didn\'t you? Don\'t look so surprised. Somebody always tells me."\n\n"Have you seen anything I should know about?"',
 decide:'Grant leans forward on the throne.\n\n"Kowalski. You fought for this house. You fixed my lights. And the Dean had you in her office today." He lets that hang. "So. Are you in, or are you out?"',
 hat:'\"One more thing.\" Grant reaches under the throne and tosses you a maroon beanie with a plastic propeller on top.\n\n\"That\'s your propeller hat. Every pledge wears the propeller hat. Every day. Until the Lantern Walk. Take it off and I will hear about it.\"',
 gather:'The throne room goes quiet. Grant stands, and the propeller on your head hums when you turn.\n\n\"Good. Pledge class, living room, now. I have something to tell all of you, and I\'m only saying it once.\"',
 orient:'You are now an Alpha Sigma Rho pledge.\n\nClasses: every weekday at 9:00 AM and 1:00 PM.\n\nRoll call: every night at 6:00 PM on the ΑΣΡ front lawn. Miss it and the Pledgemaster comes looking for you.\n\nCurfew: 11:00 PM. Stay on Greek Row after that. At 2 AM you pass out wherever you are standing.\n\nYour pledge job, your pledge class and your Class Spirit are in the Planner (Tab › Pledge Class). Every pledge also gets a Big Brother: ask Tank, Reese or Owen on the porch.\n\nSleep in your bunk to save. Welcome to the bottom of the totem pole.'};
const C1M=[
 {id:'c1arrive',ch:1,main:1,name:'Arrive on Campus',who:'marcus',steps:()=>{const L=[];if(!S.c1intro)L.push({t:'cine',run:c1IntroCine});
   L.push(go(npcSpot('marcus'),'Ask around campus how to get to Alpha Sigma Rho on Greek Row. No map: press E to ask people for directions.',{press:1,act:'Talk to Marcus Bell',nogoal:1,find:1,r:2.8,tick:function(){const n=NN.marcus;if(n&&!n.hidden){this.x=n.x;this.z=n.z}}}));
   L.push(C_('Alpha Sigma Rho','Marcus Bell · ΑΣΡ Pledge',T1.marcus,[['"Danny Kowalski. My dad says he was the best brother this house ever had."',null]]),C_('Alpha Sigma Rho','Marcus Bell · ΑΣΡ Pledge',T1.marcus2,[['"…A throne. Okay."',null]]));return L},
  fin:()=>c1Next('c1meet')},
 {id:'c1meet',ch:1,main:1,pre:['c1arrive'],name:'Meet the Brothers',who:'marcus',talkFirst:1,steps:()=>[
   go(npcSpot('grant'),'Find Grant Ashby, the chapter president. He\'s inside the ΑΣΡ house, in the throne room.',{press:1,act:'Talk to Grant Ashby',r:4.6}),
   C_('Meet the Brothers','Grant Ashby · Chapter president',T1.grant,[['"Yes, sir."',()=>stand(3)],['"I\'m not my dad."',()=>{stand(-1);return[{t:'fx',f:()=>{c1Slap()}},C_('Meet the Brothers','Grant Ashby · Chapter president',T1.slap,[['Hold your cheek and nod',null]])]}]]),
   {t:'cond',pledgeTalk:1,lab:()=>`Talk to the pledges about the fraternity (${AM&&AM.c1pl?AM.c1pl.size:0}/3). Look for the propeller hats.`,ok:()=>!!(AM.c1pl&&AM.c1pl.size>=3),goal:()=>c1NearPledge()},
   Object.defineProperty(C_('Meet the Brothers','','',null,{alert:1}),'tx',{get:c1MeetEnd,enumerable:true})],
  fin:()=>c1Next('cater')},
 {id:'cater',ch:1,main:1,pre:['c1meet'],name:'First Task',who:'grant',steps:()=>[
   go(npcSpot('grant'),'Go back to Grant in the throne room.',{press:1,act:'Talk to Grant Ashby',r:4.6}),
   fx(()=>{if(!S.uMap){S.uMap=1;S.mapHint=1;sfx('lvl');big('MAP UNLOCKED · PRESS M',2400)}}),   /* V297 the 'press M' hint stays under the minimap until the map is opened (mapHintTick) */
   C_('First Task','Grant Ashby · Chapter president',T1.cater,[
    ["Shop at Hank's Market downtown and make the money stretch",()=>{S.budget=20;return[items(SPOT.HANK,"Buy chips, Genesee and decorations at Hank's Market. Budget: $20",['chips','soda','deco'])]}],
    ['"Borrow" supplies from the Tangeman Center loading dock after 9 PM',()=>[go(SPOT.DOCK,'Raid the Tangeman University Center loading dock after 9 PM. Avoid campus police.',{press:1,act:'Load up the supplies',when:[21,4],stealth:1,watch:['auth','studentgov'],spot:'trouble',done:()=>{give('chips');give('soda');give('deco');rep('studentgov',-10);toast('Supplies acquired. Student Government is going to notice.')}})]],
    ['Ask the sisters of Delta Lambda Phi for help',()=>[go(SPOT.DLP,'Knock at Delta Lambda Phi',{press:1,act:'Knock'}),C_('Delta Lambda Phi','Madison · Chapter president',"\"We have leftover snacks and decorations from our gala. But first, a favor. A group of townies outside Ruby's Diner has been harassing our members every night. Run them off.\""),fight([165,599],"Run off the townies outside Ruby's Diner",[['townies',1],['townies',2],['townies',1]],{done:()=>rep('townies',-10)}),go(SPOT.DLP,'Collect the supplies at Delta Lambda Phi',{press:1,act:'Collect supplies',done:()=>{give('chips');give('soda');give('deco');rep('sororities',15);c1Frat('dlp',30)}})]]]),
   go([84,76],'Bring the party supplies back to the ΑΣΡ front yard',{press:1,act:'Drop off the supplies',need:['chips','soda','deco']})],
  fin:()=>{['chips','soda','deco'].forEach(take);if(S.budget>0){money(Math.round(S.budget*100)/100);toast('Grant lets you keep the change.',2500)}S.budget=0;stand(5);c1Next('c1rival',900)},reset:()=>{S.budget=0}},
 {id:'c1rival',ch:1,main:1,pre:['cater'],name:'Survive the Rivalry',hint:'Survive the Rivalry: Kappa Theta Omega is waiting on the ΑΣΡ front lawn',retry:'Kappa Theta Omega is still hanging around the ΑΣΡ lawn. Step outside when you\'re ready for round two.',steps:()=>[
   ...(S.c1rivalSeen?[]:[{t:'cine',run:c1RivalCine}]),
   {t:'cond',lab:()=>`Fight off Kappa Theta Omega. Knocked out: ${Math.min(C1.ko,C1.KON)} of ${C1.KON}. Don't go down.`,start:()=>c1BrawlStart(),tick:dt=>c1BrawlTick(dt),ok:()=>C1.ko>=C1.KON},
   {t:'cine',run:c1RivalEndCine},
   C_('Survive the Rivalry','Tank Hale · ΑΣΡ Brother',T1.rivalEnd,[['\"My dad taught me. Big Ed Kowalski.\"',()=>{stand(4);return[C_('Survive the Rivalry','Tank Hale · ΑΣΡ Brother','Tank\'s eyebrows climb.\n\n\"Big Ed\'s kid. Grant said you were rushing. I figured you\'d be bigger.\"\n\nHe looks at your knuckles, then grins.\n\n\"Guess the hands are what you got. Every brother in this house grew up on stories about your old man, and he\'d be proud of that. Just don\'t lean on his name around Grant. Legends don\'t pay dues. He\'s told you that already, right?\"',[['\"Yeah. That\'s my dad. Why did Kappa Theta Omega come after us?\"',()=>[C_('The Rivalry','Tank Hale · ΑΣΡ Brother','Tank snorts and jerks a thumb at the Kappa Theta Omega house across the road.\n\n\"Those are Legacies, rushee. Their dads sit on the board of trustees, their granddads got buildings named after them, and they figure the whole campus is a family heirloom. We\'re the one house that never bowed to them, and they\'ve hated us for it since before we were born. Ask anyone about the bell they stole in \'87. Same grudge.\"\n\n\"Today they came because we\'ve got a new rushee and they wanted to see if he\'d fold. You didn\'t. Now it\'s personal.\"\n\n\"But the real fight is bigger than one lawn. Every house on campus is scrapping over the same thing, and it\'s the ground under their feet.\"',[['\"The ground?\"',null]])]]])]}]]),
   fx(()=>{S.uCliques=1;rep('legacies',-10);c1Frat('kto',-40);sfx('lvl');big('CLIQUES UNLOCKED',2000);setTimeout(()=>toast('Tab › Cliques: who on campus likes you, and who wants a piece of you. Kappa Theta Omega (Legacies) is not a fan.',6000),600)}),
   C_('Frat Turf','Tank Hale · ΑΣΡ Brother','Tank leans on the porch rail and nods out at the road.\n\n\"Kappa Theta was never the only house with a chip on its shoulder, rushee. Every chapter on campus holds a piece of ground. We call it turf. A house\'s brothers stand on theirs, and nobody else\'s brothers set foot on it. Everyone who isn\'t in a house just cheers for whoever\'s ground they\'re standing on.\"',[['\"Turf. Got it.\"',()=>stand(1)]]),
   fx(()=>{S.uTurf=1;turfEnsure()}),
   {t:'cond',lab:()=>'Look over your campus map. Press M to open it, and M again to close it.',start:()=>turfMapNote(),ok:()=>TURFNOTE.done,done:()=>{sfx('lvl');big('FRAT TURF UNLOCKED',2000);setTimeout(()=>toast('Each house\'s turf is shaded in its colours, with a letters tag where its brothers hang out. Click a tag for the group.',6500),600)}}],
  fin:()=>{c1BrawlEnd();setTimeout(()=>toast('Grant wants to see you in the throne room before the rush party.',5000),2200)},reset:()=>c1BrawlEnd()},
 {id:'c1party',ch:1,main:1,pre:['c1rival'],name:'Attend the Rush Party',who:'grant',steps:()=>[
   {t:'cine',run:c1PartyIntro},
   {t:'cond',lab:c1PartyLab,ok:c1PartyDone,goal:c1PartyGoal}],
  fin:()=>c1Next('c1blackout',700),reset:()=>c1PartyOff()},
 {id:'c1blackout',ch:1,main:1,pre:['c1party'],name:'Investigate the Blackout',who:'grant',steps:()=>{const L=[];if(!C1.party){L.push({t:'cine',run:d=>{c1PartyIntro(d)}})}return L.concat([
   {t:'cine',run:c1BlackoutCine},
   C_('Blackout','Grant Ashby · Chapter president',T1.blackout,[['"On it."',null]]),
   go(c1W('asr',1.4,16),'Go down to the basement. The door is at the west end of the hallway.',{press:1,act:'Go down to the basement',done:()=>c1DungIn()}),
   {t:'cond',stealth:1,watch:['brothers'],spot:'back',back:()=>c1Caught(0),start:()=>c1HazeStart(),ok:()=>!!C1.fuseOpen,done:()=>c1HazeKeep(),goal:()=>c1DungGoal(),
    lab:()=>!C1.doorSeen?'Find the fuse room door with the keypad (north-west corner of the basement).':C1.notes.size<3?`Find the 3 glowing notes with the door code (${C1.notes.size}/3) · code so far: ${c1CodeStr()}. Stay out of sight of the brothers in the haze room (C to sneak).`:`Enter the code ${c1CodeStr()} on the fuse room keypad.`},
   go(c1W('asr_bsmt',6.6,1.4),'Pull the main fuse lever.',{press:1,act:'Pull the main fuse lever',done:()=>c1FuseOn(),r:1.8}),
   go(c1W('asr_bsmt',DUNG.sx,DUNG.D-.9),'Sneak back up the stairs. Two brothers are checking the basement (C to sneak).',{press:1,act:'Sneak back upstairs',stealth:1,watch:['brothers'],spot:'back',back:()=>c1Caught(1),start:()=>c1CheckersStart(),done:()=>c1UpToLiving(),r:1.6}),
   C_('Lights On','Grant Ashby · Chapter president',T1.lightsOn,[['"I didn\'t see anything."',()=>stand(5)],['"I saw plenty."',()=>stand(-3)]]),
   {t:'cine',run:c1NightEnd}])},
  fin:()=>c1Next('c1dean',900),reset:()=>c1BlackoutReset()},
 {id:'c1dean',ch:1,main:1,pre:['c1blackout'],name:'Meet the Dean',who:'dean',steps:()=>[
   ...(S.c1deanSeen?[{t:'cine',run:c1DeanOffice}]:[{t:'cine',run:c1DeanCine},
   go(c1W('main',32,2.2),'Go to the Dean\'s office in Van Wormer Hall.',{press:1,act:'Knock on the Dean\'s door',r:1.8,done:()=>{sfx('ui');toast('"Come in, Mr. Kowalski. Shut the door."',2400)}}),{t:'cine',run:c1DeanOffice}]),
   C_('Classes','Dean Margaret Halvorsen · Dean of Students',T1.classes,[['"Understood."',null]]),
   fx(()=>{S.uClasses=1;S.uClassesDay=S.day;sfx('lvl');big('CLASSES UNLOCKED',2000);setTimeout(()=>toast('Tab › Classes: your schedule. Classes start tomorrow.',5000),600)}),
   C_('A Question','Dean Margaret Halvorsen · Dean of Students',T1.ask,[
    ['Tell her about the haze room in the basement',()=>{rep('studentgov',15);S.deanDeal=1;S.deanTold=1;stand(-15);return[C_('A Question','Dean Margaret Halvorsen · Dean of Students','"…A haze room. With a chair." She writes it down very slowly. "Thank you, Mr. Kowalski. This stays between us, for now. My door is always open to you."\n\nThe Dean likes you more. If Alpha Sigma Rho ever finds out who told her, they will like you a lot less.')]}],
    ['"It\'s a good house. I didn\'t see anything."',()=>{rep('studentgov',-10);stand(10);return[C_('A Question','Dean Margaret Halvorsen · Dean of Students','"A good house." She doesn\'t write anything down. "Loyalty is admirable, Mr. Kowalski. It\'s also how people get hurt. You\'ll come back to me when you\'re ready."\n\nThe Dean trusts you less. Alpha Sigma Rho will hear that you kept your mouth shut.')]}],
    ['"I just got here. Ask me in a month."',()=>{stand(2);return[C_('A Question','Dean Margaret Halvorsen · Dean of Students','"Smart answer. Wrong answer, but smart." She stands, and the meeting is over. "Then I\'ll ask you in a month."')]}]])],
  fin:()=>c1Next('c1decide',900)},
 {id:'c1decide',ch:1,main:1,pre:['c1dean'],name:'Make Your Decision',who:'grant',steps:()=>[
   go(npcSpot('grant'),'Go to the throne room and give Grant your answer.',{press:1,act:'Talk to Grant Ashby',r:4.6}),
   C_('Make Your Decision','Grant Ashby · Chapter president',T1.decide,[['"I\'m in."',()=>stand(3)],['"My dad would kill me if I said no. …I\'m in."',()=>stand(1)]]),
   fx(()=>{S.pledged=1;sfx('lvl');throneMachine()}),
   C_('The Propeller Hat','Grant Ashby · Chapter president',T1.hat,[['Put it on',()=>{setHat(1);sfx('lvl');big('PLEDGE CLASS UNLOCKED',2000);toast('Tab › Pledge Class: your pledge job, your classmates, roll call and Class Spirit.',6000)}]])],
  fin:()=>{c1Next('c1gather',2500);setTimeout(()=>{if(!S.done.c1gather)toast('Grant wants a word with the new pledge. Go see him in the throne room.',5000)},3000)}},
 {id:'c1gather',ch:1,main:1,noCount:1,pre:['c1decide'],name:'Pledge Class Meeting',who:'grant',hint:'Pledge Class Meeting: Grant wants a word with the new pledge in the throne room',steps:()=>[
   go(npcSpot('grant'),'Grant wants a word with the new pledge. Go see him in the throne room.',{press:1,act:'Talk to Grant Ashby',r:4.6}),
   C_('Pledge Class Meeting','Grant Ashby · Chapter president',T1.gather,[['\"Yes, sir.\"',()=>stand(2)]]),
   {t:'cine',run:d=>{pqIntro().then(d,d)}}]}];
// swap the old chapter 1 out: the old intro/cater/dean go, the Big Brother errand moves to chapter 2
for(const id of['arrive','cater','dean']){const i=M.findIndex(m=>m.id===id);if(i>=0)M.splice(i,1)}
{for(const m of M)if(m.bbm){m.main=0;m.side=1}   // V199 the Big Brother story is a side mission: optional, and the chapter moves on without it
 const b=M.find(m=>m.id==='bb1');if(b)b.ch=2;const b2=M.find(m=>m.id==='bb2');if(b2&&!(b2.pre||[]).includes('bb1'))b2.pre=(b2.pre||[]).concat('bb1')}
M.unshift(...C1M);

/* slap: Grant smacks Danny when he says "I'm not my dad" */
function c1Slap(){try{sfx('hit');setTimeout(()=>sfx('hit'),60);if(typeof voxOuch==='function')setTimeout(voxOuch,120);const f=$('flash');if(f){f.style.background='#ff5a4a';f.style.opacity=.7;setTimeout(()=>{f.style.opacity=0;setTimeout(()=>f.style.background='#fff',400)},120)}big('SLAP!',900)}catch(e){}}
// V297 'Press M' hint pill under the minimap: shown in free play after the map is unlocked, until the player opens the map once
function mapHintTick(){const on=!!(S.uMap&&S.mapHint)&&mode==='play'&&!CINE;let e=$('maphint');if(!e){if(!on)return;e=document.createElement('div');e.id='maphint';e.className='patch';
  e.style.cssText='font:700 13px Archivo,Arial,sans-serif;color:var(--cream,#f6efe0);padding:6px 11px;text-align:center;line-height:1.3;cursor:pointer;animation:mhpulse 1.6s ease-in-out infinite';
  e.innerHTML=matchMedia('(pointer:coarse)').matches?'🗺 Open the <b style="color:#e2b64c">campus map</b> from your planner':'🗺 Press <b style="color:#e2b64c;border:1px solid #e2b64c;border-radius:4px;padding:0 5px">M</b> to open the campus map';
  e.onclick=()=>openPlanner('map');const st=document.createElement('style');st.textContent='@keyframes mhpulse{0%,100%{box-shadow:0 0 0 0 rgba(226,182,76,.0)}50%{box-shadow:0 0 0 4px rgba(226,182,76,.45)}}';document.head.appendChild(st);$('tr').appendChild(e)}
  e.hidden=!on}

