// ================================================================ V272 HOUSE PLEDGES: every fraternity keeps its own pledges, each with a pledge role
// (ASR has the 19-strong pledge class in PCLASS; these are the other houses' small pledge classes.)  Each pledge carries his role's prop, stands on his
// house's front lawn, says his role's lines now and then, and tells you his job if you ask.  Sororities are not included (their FRATS entries are fem).
const HP_PER=3;   // pledges per house (each one is a full character rig, so lower this if the frame rate suffers)
const HPR={
 // --- legacy houses (KTHO, SAE, KS, VTHP)
 butler:{n:'Butler Pledge',d:'Carries the tray. Sparkling cider, because the house is "between champagne shipments".',g:'Sparkling cider, sir? The brothers insist it is champagne.',l:['Sparkling cider, sir? The brothers insist it is champagne.','Napkin, sir? I have forty.','I have not sat down since September.','Another round for the lawn, sir?']},
 blazer:{n:'Blazer Pledge',d:'Holds every brother\'s blazer and steams it before they ask. They always ask.',g:'Your blazer, sir. I steamed it. Twice.',l:['Your blazer, sir. I steamed it. Twice.','That is a two-button day, sir. I checked.','Do not touch the lapel.','Somebody sat on the navy one. We do not talk about it.']},
 oar:{n:'Oar Pledge',d:'Carries a rowing oar everywhere. The house has no boat. Nobody explains why.',g:'My 2k erg score was a 6:48. Nobody asked, but there it is.',l:['My 2k erg score was a 6:48. Nobody asked.','Stroke! Stroke! ...Sorry. Habit.','We do not own a boat. The oar is for morale.','Catch, drive, finish, recover. Always recover.']},
 caddy:{n:'Caddy Pledge',d:'Carries a full golf bag on a campus with no golf course.',g:'Nine iron, sir? It is a lawn, but the principle stands.',l:['Nine iron, sir? It is a lawn, but the principle stands.','Fore! ...It is a reflex.','The bag weighs forty pounds. The brothers have never used it.','Wind is out of the west, sir.']},
 flag:{n:'Flag Pledge',d:'Holds the house flag. Must keep it upright in all weather. It has been a long week.',g:'Hold the flag. Hold it straighter. Straighter!',l:['Hold the flag. Hold it straighter. Straighter!','It has been raised since sunrise. So have I.','Never let it touch the ground. That is the whole job.','Wind check: strong. Arms: tired.']},
 umbrella:{n:'Umbrella Pledge',d:'Holds an umbrella over himself and any brother who walks by. It has not rained in weeks.',g:'It is not raining, sir. It might. I stay ready.',l:['It is not raining, sir. It might. I stay ready.','Sun is also a form of weather, sir.','Care to share the umbrella? Only brothers.','I have been sunburned on the inside of my wrists. How?']},
 // --- athlete houses (KAN, THCH, PKA, DTD, PDT)
 whistle:{n:'Whistle Pledge',d:'Wears the whistle. Blows it to start every drill. There are no drills.',g:'Two laps around the lawn. Go. ...I was not talking to you. Go anyway.',l:['Two laps around the lawn! Go!','TWEET! ...That was for nobody.','Hands on your knees! Breathe!','Coach says the whistle is a responsibility.'],s:()=>tone(2300,.2,'square',.035)},
 jug:{n:'Water Jug Pledge',d:'Carries the big orange water jug. Mandatory hydration, any brother, any time.',g:'Hydrate, sir! The jug is full! Always full!',l:['Hydrate, sir! The jug is full!','Water break! Everybody water break!','Sip it. Do not chug it. Okay, chug it.','I refill this four times a day. My arms are huge now.']},
 towel:{n:'Towel Pledge',d:'Carries a clean towel over the shoulder. Hands it to any sweaty brother on request.',g:'Towel, sir? It is clean. Mostly.',l:['Towel, sir? It is clean. Mostly.','Sweat check. You are good.','I fold them in thirds. The brothers noticed.','Is this one wet, or is it just you?']},
 football:{n:'Football Pledge',d:'Carries a football everywhere. Must be ready to catch a pass from any brother at any time.',g:'Throw it, sir! Anywhere! I will make the catch!',l:['Throw it, sir! Anywhere! I will make the catch!','Go long! Go long! ...Wait for me!','I have not dropped one yet. That is a lie.','Hut hut! Hike! ...Nobody is here. Fine.']},
 pump:{n:'Dumbbell Pledge',d:'Does curls all day with a house dumbbell. Counts out loud. Gets lost at nine.',g:'One... two... three... do you even lift? I am asking for me.',l:['One... two... three... four...','Do you even lift? I am asking for me.','Pump! Pump! Pump! ...It is just arms.','I lost count at nine. Starting over.']},
 // --- student government houses (OPSD, GOZ, PKP, D)
 gavel:{n:'Gavel Pledge',d:'Bangs the gavel to open every conversation. Has called order on a squirrel.',g:'Order! Order! ...Fine. You may speak.',l:['Order! Order!','Point of order!','The chair recognizes nobody.','I move that this lawn be adjourned. Seconded by me.'],s:()=>tone(180,.12,'square',.05)},
 minutes:{n:'Minutes Pledge',d:'Writes down everything said on the lawn. The brothers have never once read it.',g:'Minutes of the last meeting: nobody remembers. I wrote that down.',l:['Minutes of the last meeting: nobody remembers.','Say that again, sir. For the record.','I am forty pages behind.','Motion carried. Motion for what? I did not catch it.']},
 podium:{n:'Podium Pledge',d:'Carries the podium. Any brother may deliver a speech on it, anywhere, with no warning.',g:'Please direct all comments to the podium. I am the podium.',l:['Please direct all comments to the podium. I am the podium.','Speech, sir? Just step up. It is stable. Mostly.','Mic check! There is no mic. It is a podium.','My Fridays are for filibusters.']},
 ballot:{n:'Ballot Pledge',d:'Carries the ballot box. Runs every house vote, including which pizza to order.',g:'Vote early. Vote often. Vote for him. Not me. Him.',l:['Vote early. Vote often. Vote for him.','The ballot box is secure. It has a sticker.','Pizza vote at six! Pepperoni is winning.','I counted twice. The count is the count.']},
 // --- activist house (SAM)
 megaphone:{n:'Megaphone Pledge',d:'Announces everything through a megaphone. Including his own lunch order.',g:'HEY HEY! HO HO! ...Sorry. You were close. Is it too loud?',l:['HEY HEY! HO HO!','TESTING! IS THIS ON? IT IS ALWAYS ON!','I AM TALKING NORMALLY.','WHAT DO WE WANT? NAP TIME! WHEN DO WE WANT IT? NOW!']},
 sign:{n:'Picket Pledge',d:'Holds the picket sign. The sign changes each morning. So does the cause.',g:'Today\'s cause is on the sign. Do not ask me what it says.',l:['Today\'s cause is on the sign.','It said something else yesterday. I stand by both.','Honk if you agree! Nobody honks. It is a lawn.','My arms are tired. That is the cause.']},
 petition:{n:'Petition Pledge',d:'Carries a petition clipboard. Needs ten signatures a day. Has four. They are all his.',g:'Got a minute for a petition? ...Any petition. Please sign something.',l:['Got a minute for a petition?','Sign here. And here. And initial here.','I have four signatures. All mine. Different pens.','It is for the greater good. I will explain on the way there.']},
 // --- the other house (ST)
 grill:{n:'Grill Pledge',d:'Wears the apron. Holds the spatula. Waits for a grill that has been "on its way" since August.',g:'Burgers at two. Grill arrives at... soon. Very soon.',l:['Burgers at two. Grill arrives soon.','Medium or well, sir? Order now, cook later.','The spatula is the only part I have been given.','Smell that? That is me hoping.']},
 drum:{n:'Drum Pledge',d:'Beats the snare drum on his hip. Sets the pace for everything. Nobody asked for a pace.',g:'Ba-dum-tss. ...That was for the bit. Hello.',l:['Ba-dum-tss.','Rat-a-tat-tat! March, you animals!','I know exactly one beat. It is a good beat.','Keep time, keep time, keep time.'],s:()=>tone(130,.1,'triangle',.08)},
 cooler:{n:'Cooler Pledge',d:'Drags the big cooler everywhere. Ice cold on request. Never says what is inside.',g:'Ice cold, sir. Do not ask what is in it.',l:['Ice cold, sir. Do not ask what is in it.','It is heavy. The cooler is heavy. I am fine.','Cooler rule one: nobody opens the cooler.','I replace the ice every two hours. Day and night.']}
};
// each house's trio (roles are matched to what the house is about)
const HP_HOUSE={kto:['butler','oar','blazer'],sae:['caddy','flag','butler'],ksig:['umbrella','blazer','flag'],btp:['caddy','umbrella','oar'],
 kan:['whistle','jug','football'],tchi:['towel','jug','pump'],pka:['football','whistle','towel'],dtd:['pump','jug','whistle'],pdt:['towel','football','pump'],
 opd:['gavel','minutes','podium'],gwz:['ballot','gavel','minutes'],pkp:['podium','ballot','minutes'],tri:['gavel','ballot','podium'],
 sam:['megaphone','sign','petition'],stau:['grill','drum','cooler']};
const HP_FN=['Archer','Beckett','Calvin','Dashiell','Emmett','Finn','Griffin','Harlan','Jasper','Kendrick','Leo','Mercer','Nolan','Osgood','Percy','Quincy','Rhett','Sutton','Tobias','Wells'];
const HP_LN=['Ashford','Pemberton','Kowalczyk','Boyd','Marsh','Tillman','Nakamura','Okonkwo','Vasquez','Lindgren','Dunbar','Pratt','Hollister','Reyes','Sutter','Whelan','Brandt','Fitch','Moreau','Haas'];
// the role's prop: held in a hand, slung on the body or carried in front
function hpProp(n,k){const g=n.g,P_=g.P;if(!P_)return;const att=(geo,c,par,x,y,z)=>{const m=new THREE.Mesh(geo,mt(c,.6));m.position.set(x,y,z);m.castShadow=true;par.add(m);return m};
  const hr=P_.hR||P_.aR,hl=P_.hL||P_.aL,y0=P_.hR?-.12:-.64,R=(geo,c,x,y,z)=>att(geo,c,hr,x,y0+y,z),L=(geo,c,x,y,z)=>att(geo,c,hl,x,y0+y,z),B=(geo,c,x,y,z)=>att(geo,c,g,x,y,z),C=THREE.CylinderGeometry,
   hc=((n.hid||'').split('').reduce((a,ch)=>a*31+ch.charCodeAt(0),7))%3,hcol=[0x7d1f2c,0x1f3f7d,0x1f6a3a][hc];
  if(k==='butler'){B(bgeo(.42,.025,.3),0xc9ccd2,0,.98,.34);for(let i=0;i<3;i++)B(new C(.03,.025,.09,8),0xe8f4ff,-.12+i*.12,1.04,.34);L(bgeo(.1,.26,.04),0xf2efe6,0,-.02,.05)}
  else if(k==='blazer')L(bgeo(.14,.34,.08),0x1c2a4a,0,-.06,.07);
  else if(k==='oar'){const o=B(new C(.022,.022,1.9,6),0x8a5a2a,-.3,1.05,-.2);o.rotation.z=.28;const bl=B(bgeo(.05,.5,.16),0xe8dcc0,-.3-Math.sin(.28)*.95,1.05+Math.cos(.28)*.95+.25,-.2);bl.rotation.z=.28}
  else if(k==='caddy'){const bag=B(new C(.1,.09,.68,10),0x2a4a2a,0,1.0,-.27);bag.rotation.x=.12;for(let i=0;i<3;i++){const c=B(new C(.012,.012,.5,5),[0xaaaaaa,0xc0302a,0xd8b048][i],-.04+i*.04,1.5,-.3);c.rotation.x=.12}}
  else if(k==='flag'){R(new C(.014,.014,1.8,6),0x555555,0,.5,.05);const f=R(bgeo(.02,.42,.62),hcol,0,1.2,.36);n.hpSway=f}
  else if(k==='umbrella'){B(new C(.012,.012,.7,6),0x333333,0,1.95,0);const u=B(new THREE.ConeGeometry(.62,.3,14),0x15151c,0,2.34,0);u.material.side=THREE.DoubleSide}
  else if(k==='whistle'){const ch=P_.chest||g;att(bgeo(.06,.03,.1),0xcfd2d8,ch,0,.22,.16);const cb=L(bgeo(.03,.28,.2),0x8a6a44,.012,-.06,.05);att(bgeo(.034,.24,.17),0xf2efe6,cb,.001,-.01,0)}
  else if(k==='jug'){R(new C(.13,.13,.36,12),0xe8742a,0,-.02,.14);R(new C(.07,.07,.05,10),0xf2efe6,0,.18,.14)}
  else if(k==='towel')B(bgeo(.1,.5,.34),0xf2f2f2,.26,1.35,0);
  else if(k==='football'){const f=R(new THREE.SphereGeometry(.1,10,8),0x6b3a1e,0,-.02,.1);f.scale.set(1,1,1.6)}
  else if(k==='pump'){R(new C(.018,.018,.36,6).rotateZ(PI/2),0x333333,0,-.02,.04);for(const s of[-1,1])R(bgeo(.05,.16,.16),0x222222,s*.17,-.02,.04)}
  else if(k==='gavel'){R(new C(.014,.014,.3,6),0x6a4a2a,0,-.05,.06);R(bgeo(.1,.07,.07),0x6a4a2a,0,.1,.06)}
  else if(k==='minutes')L(bgeo(.04,.26,.19),0x5a2a2a,.012,-.17,.03);
  else if(k==='podium'){B(bgeo(.5,.55,.36),0x6a4a2a,0,.88,.42);B(bgeo(.54,.04,.42),0x7a5a34,0,1.17,.42)}
  else if(k==='ballot'){B(bgeo(.36,.3,.28),0x2a4a8a,0,.95,.36);B(bgeo(.2,.012,.02),0x111111,0,1.11,.36)}
  else if(k==='megaphone'){const m=R(new THREE.ConeGeometry(.1,.3,10),0xd33a2a,0,-.04,.14);m.rotation.x=-PI/2}
  else if(k==='sign'){R(new C(.014,.014,1.5,6),0x8a6a44,0,.45,.05);const s=R(bgeo(.02,.42,.58),0xf2efe6,0,1.05,.05);R(bgeo(.025,.1,.5),0xc0302a,0,1.05,.05);n.hpSway=s}
  else if(k==='petition')L(bgeo(.03,.28,.2),0x8a6a44,.012,-.06,.05);
  else if(k==='grill'){R(new C(.012,.012,.32,6),0xaaaaaa,0,-.02,.06);R(bgeo(.1,.012,.12),0x999999,0,.16,.06);B(bgeo(.42,.55,.02),0xf2efe6,0,.8,.2)}
  else if(k==='drum'){B(new C(.2,.2,.24,14),0xc0302a,0,.9,.32);B(new C(.19,.19,.02,14),0xf2efe6,0,1.03,.32);R(new C(.01,.01,.28,5),0xd8c8a0,0,-.02,.1)}
  else if(k==='cooler'){B(bgeo(.5,.3,.32),0x2a6aa8,.58,.18,.08);B(bgeo(.52,.06,.34),0xf2efe6,.58,.36,.08)}}
function housePledges(F,b){const R=HP_HOUSE[F.id];if(!R||F.fem)return;const out=b.face==='e'?1:-1,zone=b.z0<206?'greek':'heights',ez=b.ez,
  spots=[[b.ex+out*2.6,ez-7.8],[b.ex+out*2.6,ez+7.8],[b.ex+out*5.6,ez+(F.id.length%2?-2.6:2.6)]],h=[...F.id].reduce((a,c)=>a*31+c.charCodeAt(0),7);
  for(let i=0;i<Math.min(HP_PER,R.length);i++){const k=R[i],def=HPR[k];let[x,z]=nearFree(spots[i][0],spots[i][1],.5);
    const n=spawn(F.cl,zone,{x,z,a:out*PI/2,mode:'idle',house:F.id,fem:false,noLetters:1,prop:1,pledge:1,title:F.L+' '+def.n,lvl:1+i%2,name:HP_FN[(h+i*7)%HP_FN.length]+' '+HP_LN[(h*3+i*11)%HP_LN.length],greet:'"'+def.g+'"'});
    if(!n)continue;n.hid=F.id;n.hpr=k;n.hpT=3+rnd()*16;hpProp(n,k)}}
// the role in action: little animation, and a line every so often when you are around
function hpTick(n,dt){if(n.aggro||n.follow||n.job||n.down||mode!=='play')return;const d=HPR[n.hpr];if(!d)return;
  if(n.hpSway)n.hpSway.rotation.z=Math.sin(TT*2.2+n.uid)*.1;n.hpT-=dt;if(n.hpT>0||n.dp>26)return;n.hpT=16+rnd()*22;bubble(n,pick(d.l),3.4);if(d.s&&n.dp<16)d.s()}
