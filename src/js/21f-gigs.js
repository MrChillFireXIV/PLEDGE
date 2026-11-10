// ================================================================ V150 ODD JOBS: endless little money missions around campus
// Five people with a green "$" over their heads wait around campus (and on the minimap). Talk to one, take the job, get paid. Finished or
// dropped, the giver leaves and somebody new shows up somewhere else a little later, so the jobs never run out. One job at a time; they run
// alongside the story (their own tracker box on the right, green markers in the world and on the map).
const GIG={givers:[],active:null,spawnT:4,mk:[],box:null};
const GIG_N=5;
const GIG_ITEMS=['backpack','chemistry textbook','laptop bag','graphing calculator','sketchbook','retainer case','lucky hoodie','house keys'];
const GIG_STU=['studentgov','activists','athletes','sororities','legacies'];
function gigName(fem){return pick(fem?FN:MN)+' '+String.fromCharCode(65+Math.floor(rnd()*26))+'.'}
function gigSpot(minD=30,from){for(let t=0;t<400;t++){const x=150+rnd()*580,z=12+rnd()*556,ix=Math.floor(x),iz=Math.floor(z);if(ix<0||iz<0||ix>=WW||iz>=WD||!PW[iz*WW+ix]||!freeAt(x,z,.55))continue;
    const f=from||[P.x,P.z];if(Math.hypot(x-f[0],z-f[1])<minD)continue;return[x,z]}return[300+rnd()*100,200+rnd()*100]}
const gigArea=(x,z)=>{let b=null,bd=1e9;for(const q of B){if(q.ex==null||!q.name||q.z0>580)continue;const d=Math.hypot(q.ex-x,q.ez-z);if(d<bd){bd=d;b=q}}return b?'near '+b.name:'on campus'};
// ---------------------------------------------------------------- the jobs
const GIGT={
 lost:{w:3,cl:()=>pick(GIG_STU),title:'Student',pay:[15,25],offer:g=>`"I left my ${g.item} somewhere ${g.where}. I have a test tomorrow and I'm kind of freaking out. Bring it back and I'll pay you $${g.pay}."`,
  setup:g=>{g.item=pick(GIG_ITEMS);g.p=gigSpot(70,[g.giver.x,g.giver.z]);g.where=gigArea(g.p[0],g.p[1]);g.stage='get'},
  lab:g=>g.stage==='get'?`Find ${g.giver.name.split(' ')[0]}'s ${g.item} ${g.where}`:`Bring the ${g.item} back to ${g.giver.name}`,
  pts:g=>g.stage==='get'?[g.p]:[[g.giver.x,g.giver.z]],
  prompt:(g,add)=>{if(g.stage==='get')add(g.p[0],g.p[1],2,`Pick up the ${g.item}`,()=>{g.stage='return';sfx('coin');toast(`Found it. Take it back to ${g.giver.name}.`,2600)},0)},
  ret:g=>g.stage==='return',thanks:g=>pick([`"MY ${g.item.toUpperCase()}! You're a lifesaver."`,'"Oh thank god. Here, you earned this."','"I owe you. Well, I owe you this much, anyway."'])},
 letter:{w:3,cl:()=>pick(GIG_STU),title:'Secret Admirer',pay:[15,22],offer:g=>`"Okay, this is embarrassing. Can you get this letter to ${g.tname}? They're usually ${g.where}. Don't tell them it's from me! Just… see what they say. $${g.pay}."`,
  setup:g=>{g.fem=rnd()<.5;g.tname=gigName(g.fem);g.p=gigSpot(70,[g.giver.x,g.giver.z]);g.where=gigArea(g.p[0],g.p[1]);g.stage='give';g.target=gigNPC(pick(GIG_STU),g.p,{name:g.tname,title:'Student',fem:g.fem});g.target.gigT=g;g.like=rnd()<.62},
  lab:g=>g.stage==='give'?`Deliver the secret love letter to ${g.tname} (${g.where})`:`Tell ${g.giver.name} how it went`,pts:g=>g.stage==='give'?[[g.target.x,g.target.z]]:[[g.giver.x,g.giver.z]],
  talk:(g,n,ch,reply)=>{if(n===g.target&&g.stage==='give')ch.push(['"Somebody asked me to give you this."',()=>{g.stage='return';reply(g.like?pick(['They read it twice. Then a third time. "…Tell them yes. Tell them YES. Wait, don\'t tell them I said it like that."','"Oh my god. Is this from who I think it\'s from? …Tell them to meet me at the fountain at eight."']):pick(['They read it, wince, and fold it into a tiny square. "Tell whoever wrote this… thank you. But no."','"Is this a prank? This is a prank. …It isn\'t? Oh. Oh no. Tell them I\'m flattered."']))()},'','task'])},
  ret:g=>g.stage==='return',thanks:g=>g.like?'"They said YES?! I… I need to sit down. Here. Take it. Take all of it."':'"…Oh. Okay. No, that\'s okay. Thanks for trying. Here."'},
 setup:{w:2,cl:()=>'studentgov',title:'Event Organizer',pay:[25,35],offer:g=>`"The ${g.ev} starts in an hour and my volunteers bailed. Help me set up: ${g.parts.length} things around here. $${g.pay} from the Student Gov budget."`,
  setup:g=>{g.ev=pick(['blood drive','club fair','open-mic night','career expo','outdoor movie night','bake sale']);g.parts=['Set out the folding chairs','Hang the banner','Set up the speaker','Unfold the sign-in table'].map((l,i)=>{const a=i/4*TAU+rnd()*.5;let p=null;for(let t=0;t<30&&!p;t++){const r=4+rnd()*5,x=g.giver.x+Math.cos(a+t*.3)*r,z=g.giver.z+Math.sin(a+t*.3)*r;if(freeAt(x,z,.45))p=[x,z]}return{l,p:p||[g.giver.x+2,g.giver.z+2],done:0}});g.stage='do'},
  lab:g=>g.stage==='do'?`Set up the ${g.ev} (${g.parts.filter(p=>p.done).length}/${g.parts.length})`:`Tell ${g.giver.name} it's ready`,pts:g=>g.stage==='do'?g.parts.filter(p=>!p.done).map(p=>p.p):[[g.giver.x,g.giver.z]],
  prompt:(g,add)=>{if(g.stage==='do')for(const p of g.parts)if(!p.done)add(p.p[0],p.p[1],1.8,p.l,()=>{p.done=1;sfx('ok');gigProp(p.p);if(g.parts.every(p=>p.done)){g.stage='return';toast(`All set. Tell ${g.giver.name}.`,2400)}},0)},
  ret:g=>g.stage==='return',thanks:g=>`"You're a hero. This is the best ${g.ev} Student Gov has ever thrown. Low bar, but still."`},
 truant:{w:2,cl:()=>'staff',title:'Professor',pay:[20,30],offer:g=>`"${g.sname} has missed three of my lectures. Three! Somebody saw him around ${g.where}. Find him and get him back to class, would you? I can pay $${g.pay} out of the department coffee fund."`,
  setup:g=>{g.sname=gigName(0);g.p=gigSpot(80,[g.giver.x,g.giver.z]);g.where=gigArea(g.p[0],g.p[1]);g.target=gigNPC(pick(['athletes','activists','legacies','townies']),g.p,{name:g.sname,title:'Truant',fem:0});g.target.gigT=g;g.stage='find';g.c=[g.p[0]+(rnd()-.5)*30,g.p[1]+(rnd()-.5)*30]},
  lab:g=>g.stage==='find'?`Find ${g.sname} somewhere ${g.where} (search the green circle)`:`Tell the professor ${g.sname} is on his way`,
  pts:g=>g.stage==='find'?(Math.hypot(g.target.x-P.x,g.target.z-P.z)<18?[[g.target.x,g.target.z]]:[]):[[g.giver.x,g.giver.z]],
  talk:(g,n,ch,reply)=>{if(n!==g.target||g.stage!=='find')return;ch.push(['"Your professor is looking for you. You\'re missing class."',()=>{g.stage='return';gigLeave(n);reply(pick(['"Ugh. FINE. Tell him I was at the dentist."','"Three classes? It\'s been three? …Okay, okay, I\'m going."']))()},'','task']);
    ch.push(['"Go to class or I tell everyone you cried at the pep rally."',()=>{g.stage='return';relAdd(n,-4);gigLeave(n);reply('"…You wouldn\'t." You would. He goes.')()},'','task'])},
  ret:g=>g.stage==='return',thanks:g=>'"He walked in twenty minutes late with a granola bar. Progress! Here, as promised."'},
 delivery:{w:2,cl:()=>'staff',title:'Dining Hall',pay:[15,25],offer:g=>`"Order up for ${g.tname}, ${g.where}. Our delivery guy quit. Get it there hot and they'll tip you. Usually $${g.pay}, if they're nice."`,
  setup:g=>{g.fem=rnd()<.5;g.tname=gigName(g.fem);g.p=gigSpot(80,[g.giver.x,g.giver.z]);g.where=gigArea(g.p[0],g.p[1]);g.target=gigNPC(pick(GIG_STU),g.p,{name:g.tname,title:'Hungry Student',fem:g.fem});g.target.gigT=g;g.stage='give';g.paid=1},
  lab:g=>`Deliver ${g.tname}'s food (${g.where})`,pts:g=>[[g.target.x,g.target.z]],
  talk:(g,n,ch,reply)=>{if(n===g.target&&g.stage==='give')ch.push(['"Delivery! Still hot. Mostly."',()=>{reply(pick(['"FINALLY. I\'ve been starving for an hour. Here, keep the change."','"Is this the spicy one? It\'s the spicy one. You\'re my favorite person today."']))();gigDone(g)},'','task'])}},
 flyers:{w:2,cl:()=>'activists',title:'Organizer',pay:[20,30],offer:g=>`"The administration keeps tearing these down. Put up ${g.posts.length} flyers across campus and I'll pay you $${g.pay}. Don't let campus police catch you."`,
  setup:g=>{g.posts=[];for(let i=0;i<4;i++)g.posts.push({p:gigSpot(45,i?g.posts[i-1].p:[g.giver.x,g.giver.z]),done:0});g.stage='do';g.paid=1},
  lab:g=>`Post the flyers around campus (${g.posts.filter(p=>p.done).length}/4)`,pts:g=>g.posts.filter(p=>!p.done).map(p=>p.p),
  prompt:(g,add)=>{for(const p of g.posts)if(!p.done)add(p.p[0],p.p[1],2,'Post a flyer',()=>{p.done=1;sfx('ok');gigProp(p.p,1);if(g.posts.every(p=>p.done))gigDone(g)},0)}},
 pet:{w:2,cl:()=>pick(['sororities','studentgov','staff']),title:'Pet Owner',pay:[20,30],offer:g=>`"${g.pname} slipped her leash and ran off ${g.where}! She's small, brown, and thinks she's a lion. Please bring her back. $${g.pay}, I swear."`,
  setup:g=>{g.pname=pick(['Biscuit','Waffles','Peanut','Noodle','Mochi','Pickles']);g.p=gigSpot(70,[g.giver.x,g.giver.z]);g.where=gigArea(g.p[0],g.p[1]);g.dog=gigDog(g.p);g.stage='get'},
  lab:g=>g.stage==='get'?`Catch ${g.pname} the dog (${g.where})`:`Walk ${g.pname} back to ${g.giver.name}`,pts:g=>g.stage==='get'?[[g.dog.position.x,g.dog.position.z]]:[[g.giver.x,g.giver.z]],
  prompt:(g,add)=>{if(g.stage==='get')add(g.dog.position.x,g.dog.position.z,2,`Catch ${g.pname}`,()=>{g.stage='return';sfx('ok');tone(900,.08,'square',.04);tone(1100,.08,'square',.04,.1);toast(`${g.pname} licks your face and decides you're her new best friend. Walk her home.`,3000)},0)},
  ret:g=>g.stage==='return',thanks:g=>`"${g.pname.toUpperCase()}!" The dog goes absolutely feral with joy. "Thank you, thank you. Here."`},
 coffee:{w:2,cl:()=>'staff',title:'Professor',pay:[12,18],offer:g=>`"I have office hours in ten minutes and I am running on fumes. Large black coffee from Tangeman Center. $${g.pay} for your trouble, coffee's on me."`,
  setup:g=>{g.stage='get'},lab:g=>g.stage==='get'?'Grab a large coffee at Tangeman University Center':`Bring the coffee to ${g.giver.name}`,pts:g=>g.stage==='get'?[[SPOT.UNION[0]+2.6,SPOT.UNION[1]+1.4]]:[[g.giver.x,g.giver.z]],
  prompt:(g,add)=>{if(g.stage==='get'&&!P.inside)add(SPOT.UNION[0]+2.6,SPOT.UNION[1]+1.4,2.6,'Grab a large black coffee',()=>{g.stage='return';sfx('coin');toast('One large black coffee. It is mostly sludge.',2200)},0)},
  ret:g=>g.stage==='return',thanks:g=>'"Bless you. I can feel my neurons again. Here."'}};
const GIGW=Object.entries(GIGT).flatMap(([k,v])=>Array(v.w).fill(k));
// ---------------------------------------------------------------- people, props, markers
function gigNPC(cl,p,o){const n=spawn(cl,'quad',Object.assign({x:p[0],z:p[1],a:rnd()*TAU,temp:1,mode:'idle',lvl:2},o||{}));n.hx=n.x;n.hz=n.z;n.gigNPC=1;return n}
function gigLeave(n){setTimeout(()=>{if(NP.includes(n))despawn(n)},4000)}
function gigProp(p,flyer){const m=new THREE.Mesh(flyer?bgeo(.5,.65,.04):bgeo(.8,.5,.5),mt(flyer?0xf2ead6:0x2a4a7a,.7));m.position.set(p[0],flyer?1.5:.25,p[1]);m.userData.noMerge=1;sc.add(m);setTimeout(()=>sc.remove(m),90000)}
function gigDog(p){const g=new THREE.Group(),c=mt(0x8a5a2a,.8),d=mt(0x3a2414,.8);const B_=(w,h,dd,x,y,z,m)=>{const b=new THREE.Mesh(bgeo(w,h,dd),m||c);b.position.set(x,y,z);g.add(b)};
  B_(.28,.24,.55,0,.32,0);B_(.22,.22,.24,0,.46,.34);B_(.1,.08,.12,0,.42,.5,d);for(const[x,z]of[[-.1,-.18],[.1,-.18],[-.1,.18],[.1,.18]])B_(.07,.22,.07,x,.11,z);B_(.06,.06,.22,0,.42,-.34);B_(.06,.12,.04,-.08,.6,.3,d);B_(.06,.12,.04,.08,.6,.3,d);
  g.position.set(p[0],terrH(p[0],p[1]),p[1]);sc.add(g);return g}
function gigTag(n){const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');q.fillStyle='#2f9a4a';q.beginPath();q.arc(32,32,29,0,TAU);q.fill();q.lineWidth=4;q.strokeStyle='#e8ffe0';q.stroke();q.fillStyle='#fff';q.font='bold 40px Arial';q.textAlign='center';q.textBaseline='middle';q.fillText('$',32,35);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(.55,.55,1);s.position.y=2.55;s.renderOrder=21;n.g.add(s);n.gigTagS=s}
function gigSpawn(){const k=pick(GIGW),T=GIGT[k],cl=T.cl(),fem=cl==='sororities'?1:cl==='staff'?rnd()<.4:rnd()<.45;const p=gigSpot(35);
  const n=gigNPC(cl,p,{name:(cl==='staff'&&T.title==='Professor'?'Prof. ':'')+gigName(fem),title:T.title+' · Odd job',fem});n.gigOffer={k,pay:T.pay[0]+Math.round(rnd()*(T.pay[1]-T.pay[0]))};gigTag(n);GIG.givers.push(n)}
function gigDone(g){const pay=g.pay+(g.k==='delivery'?Math.round(rnd()*6):0);money(pay);sfx('coin');tone(1320,.1,'triangle',.06,.12);big('+$'+pay,1200);S.gigs=(S.gigs||0)+1;
  toast(`Odd job done: +$${pay}. (${S.gigs} odd job${S.gigs>1?'s':''} done)`,2600);gigEnd(g)}
function gigEnd(g){if(g.dog){const d=g.dog;setTimeout(()=>sc.remove(d),3000)}if(g.target&&NP.includes(g.target)&&g.k!=='truant')gigLeave(g.target);
  const n=g.giver;GIG.givers=GIG.givers.filter(m=>m!==n);if(n.gigTagS){n.g.remove(n.gigTagS);n.gigTagS=null}n.gigOffer=null;gigLeave(n);GIG.active=null;GIG.spawnT=12+rnd()*15;gigBox()}
function gigStart(n,g){GIG.active=g;if(n.gigTagS)n.gigTagS.visible=false;sfx('ok');gigBox()}
// ---------------------------------------------------------------- hooks (talk wheel, prompts, per-frame, map)
function gigTalk(n,ch,reply){const g=GIG.active;
  if(n.gigOffer&&!(g&&g.giver===n)){const T=GIGT[n.gigOffer.k];if(g)ch.push(['"Need a hand with something?"',null,'Finish your current odd job first','task']);
    else ch.push([`"Need a hand with something?" (odd job · $${n.gigOffer.pay})`,()=>{const pre={k:n.gigOffer.k,pay:n.gigOffer.pay,giver:n};T.setup(pre);
      card({title:'Odd Job · $'+n.gigOffer.pay,sp:n.name+' · '+T.title,text:T.offer(pre),focus:n,ch:[['"Deal."',()=>gigStart(n,pre)],['"Not right now."',()=>{if(pre.target&&NP.includes(pre.target))despawn(pre.target);if(pre.dog)sc.remove(pre.dog)}]]})},'','task'])}
  if(!g)return;const T=GIGT[g.k];if(T.talk)T.talk(g,n,ch,reply);
  if(n===g.giver){if(T.ret&&T.ret(g))ch.push(['"All done."',()=>{reply(T.thanks(g))();gigDone(g)},'','task']);else ch.push(['"Actually, I can\'t do this job."',()=>{reply('"Oh. Okay. I\'ll find somebody else."')();if(g.target&&NP.includes(g.target))despawn(g.target);gigEnd(g)},'','chat'])}}
function gigPrompts(add){const g=GIG.active;if(!g)return;const T=GIGT[g.k];if(T.prompt)T.prompt(g,add)}
function gigTick(dt){if(mode==='title'||mode==='loading')return;GIG.givers=GIG.givers.filter(n=>NP.includes(n));
  GIG.spawnT-=dt;if(GIG.spawnT<=0){GIG.spawnT=6;if(GIG.givers.length<GIG_N)gigSpawn()}
  const g=GIG.active;if(g){if(!NP.includes(g.giver)){toast('Your odd job fell through.',2200);GIG.active=null;gigBox()}else{
    if(g.dog){const d=g.dog;if(g.stage==='return'){const tx=P.x-Math.sin(P.face)*1.3,tz=P.z-Math.cos(P.face)*1.3,dx=tx-d.position.x,dz=tz-d.position.z,dd=Math.hypot(dx,dz);if(dd>.2){const s=Math.min(dd,dt*Math.max(3,dd*2.4));d.position.x+=dx/dd*s;d.position.z+=dz/dd*s;d.rotation.y=Math.atan2(dx,dz)}d.position.y=terrH(d.position.x,d.position.z)+Math.abs(Math.sin(TT*14))*.05;d.visible=!P.inside}
      else{d.rotation.y+=Math.sin(TT*.7)*dt;d.position.y=terrH(d.position.x,d.position.z)+Math.abs(Math.sin(TT*9))*.04}}
    if(g.k==='truant'&&g.stage==='find'&&g.target&&!NP.includes(g.target)){g.stage='return'}}}
  // green cones over the job's targets (closest three), hidden indoors
  const pts=g&&!P.inside?GIGT[g.k].pts(g).filter(p=>p&&Math.hypot(p[0]-P.x,p[1]-P.z)<90).slice(0,3):[];
  while(GIG.mk.length<pts.length){const m=new THREE.Mesh(new THREE.ConeGeometry(.26,.5,4),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(.5,2.2,.7)}));m.rotation.x=PI;m.renderOrder=6;sc.add(m);GIG.mk.push(m)}
  GIG.mk.forEach((m,i)=>{const p=pts[i];m.visible=!!p&&mode!=='cine';if(p){m.position.set(p[0],terrH(p[0],p[1])+2.7+Math.sin(TT*3+i)*.15,p[1]);m.rotation.y=TT*2}});
  for(const n of GIG.givers)if(n.gigTagS){n.gigTagS.visible=!g||g.giver!==n;n.gigTagS.position.y=2.55+Math.sin(TT*2.4+n.uid)*.08}
  GIG.bt=(GIG.bt||0)-dt;if(GIG.bt<=0){GIG.bt=.4;gigBox()}}
function gigBox(){let e=GIG.box;if(!e){const host=$('mq');if(!host)return;e=GIG.box=document.createElement('div');e.id='gigq';e.style.cssText='margin-top:8px;padding-top:7px;border-top:1px dashed rgba(226,182,76,.45)';host.appendChild(e)}
  const g=GIG.active;e.hidden=!g||mode==='title';if(g)e.innerHTML=`<span class="lbl" style="color:#7fe0a0">$ Side quest · Odd job · $${g.pay}</span><div style="font-size:13.5px;line-height:1.3;color:var(--cream);margin-top:2px">${GIGT[g.k].lab(g).replace(/[<>&]/g,'')}</div>`}
function gigMap(q,X,Z,k,full,hit){const s=full?1.3:1,dot=(x,z,col,txt,title,sub,card)=>{const px=X(x),py=Z(z);q.fillStyle=col;q.strokeStyle='#0d2a14';q.lineWidth=2;q.beginPath();q.arc(px,py,7*s,0,TAU);q.fill();q.stroke();if(hit&&title)hit(px,py,7*s,title,sub,x,z,card);if(txt){q.fillStyle='#fff';q.font=`bold ${Math.round(10*s)}px Arial`;q.textAlign='center';q.textBaseline='middle';q.fillText(txt,px,py+.5)}};
  for(const n of GIG.givers)if(!GIG.active||GIG.active.giver!==n)dot(n.x,n.z,'#2f9a4a','$','Odd job: '+n.name,'$'+(n.gigOffer?n.gigOffer.pay:'?')+' · '+((GIGT[n.gigOffer&&n.gigOffer.k]||{}).title||'Odd job'),()=>cardForGiver(n));
  const g=GIG.active;if(!g)return;if(g.k==='truant'&&g.stage==='find'){q.strokeStyle='rgba(90,220,120,.9)';q.fillStyle='rgba(90,220,120,.15)';q.lineWidth=2;q.beginPath();q.arc(X(g.c[0]),Z(g.c[1]),28*k,0,TAU);q.fill();q.stroke()}
  for(const p of GIGT[g.k].pts(g))if(p)dot(p[0],p[1],'#5ae07a','!','Odd job objective',(GIGT[g.k].lab?GIGT[g.k].lab(g):''),()=>cardForGigPoint(g))}
