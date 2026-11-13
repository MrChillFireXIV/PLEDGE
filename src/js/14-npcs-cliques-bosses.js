// ================================================================ CLIQUES & NPCS
const CL={
  legacies:{n:'Legacies',c:'#4a6ac0',shirt:0x1f2c52,sleeve:0x1f2c52,pants:0xcbb98f,fem:.3,lv:[3,6],say:["My grandfather endowed that wing.","Is that the scholarship kid?","Daddy's flying in for alumni weekend.","The lake house is being repainted. Again."],taunt:["Know your place, Kowalski.","Scholarship trash.","Wrong side of the row."]},
  athletes:{n:'Athletes',c:'#d0453a',shirt:0xa3232a,sleeve:0xeae4d4,pants:0x2b2d34,fem:.2,lv:[4,7],say:["Leg day, bro.","Coach is gonna run us till we puke.","You lift?","Protein shake o'clock."],taunt:["Fresh meat!","Hit the showers, pledge.","You want some?"]},
  studentgov:{n:'Student Gov',c:'#5aa86a',shirt:0x3f6e47,sleeve:0xe8e2d0,pants:0x5b524a,fem:.5,lv:[1,3],say:["Motion to adjourn.","The budget vote is Thursday.","Have you read the bylaws?","I'm running unopposed. Again."],taunt:["I'm reporting you to the honor board!","You'll never work in this town!"]},
  activists:{n:'Activists',c:'#e09a3e',shirt:0x6b6a3a,sleeve:0x6b6a3a,pants:0x3a3a44,fem:.5,lv:[2,5],say:["Abolish Greek life!","Sign our petition?","The trustees meet in secret.","Divest now!"],taunt:["Frat boy!","Patriarchy in a polo shirt.","Get off our quad."]},
  townies:{n:'Townies',c:'#b07a44',shirt:0x6d4a2e,sleeve:0x8a3a2e,pants:0x2e3d5c,fem:.25,lv:[3,7],say:["College kids think they own this town.","The mill closed in '09. Nobody up the hill cared.","Rusty Anchor's the last real bar left.","You lost, rich boy?"],taunt:["Go back up the hill!","Nice sweater, preppy.","You picked the wrong street."]},
  sororities:{n:'Sororities',c:'#e07aa8',shirt:0xdc8aa6,sleeve:0xdc8aa6,pants:0xefe7da,fem:.92,lv:[2,4],say:["Philanthropy gala is in two weeks.","Did you see her formal dress?","Chapter meeting at seven.","Don't track mud on the porch."],taunt:["Ew. Get away from me.","I'm calling campus police!"]},
  brothers:{n:'Alpha Sigma Rho',c:'#c03a4c',shirt:0x7d1f2c,sleeve:0x7d1f2c,pants:0x2a2c33,fem:0,lv:[4,7],say:["Pledge, where's my sandwich?","Initiation's gonna be legendary.","Grant's in a mood.","Your dad was a legend, kid."],taunt:["You hit a brother?","Pledges don't swing at brothers."]},
  oldguard:{n:'Old Guard',c:'#8a8f9b',shirt:0x262a33,sleeve:0x262a33,pants:0x262a33,fem:0,lv:[6,8],say:[],taunt:["You should've kept walking, kid.","Nothing personal.","Ashby says hello."]},
  staff:{n:'Staff',c:'#c9c1ad',shirt:0x5a5e66,sleeve:0x5a5e66,pants:0x2a2c33,fem:.4,lv:[3,5],say:['Can I help you?'],taunt:['Get out of my shop!']},
  police:{n:'Campus Police',c:'#5aa7e0',auth:1,shirt:0x7d9cc6,sleeve:0x7d9cc6,pants:0x1a2236,cap:0x1a2540,fem:.2,lv:[6,8],say:["Move along.","Nice day for staying out of trouble."]},
  ra:{n:'Resident Advisor',c:'#e2b64c',auth:1,shirt:0xe3b83a,sleeve:0xe3b83a,pants:0x3a3d48,fem:.4,lv:[3,5],say:["Quiet hours start at ten.","Don't make me write you up."]},
  hughes:{n:'Hughes Correctional Institute',c:'#c8202e',shirt:0xb3212c,sleeve:0xb3212c,pants:0x2a2f3a,fem:.4,lv:[3,6],say:["Tuition here costs more than my car.","Lights out is at ten. For grown adults.","They take your phone at the door.","I'm thirty-four and I have a hall pass.","Detention is every day here. That's the brand."],taunt:["You want detention too?","Wrong steps, college boy.","Hughes doesn't back down."]},
  cops:{n:'Harrowgate PD',c:'#8ab4e8',auth:1,shirt:0x23272f,sleeve:0x23272f,pants:0x23272f,cap:0x23272f,fem:.15,lv:[7,9],say:["Keep walking, college boy.","This isn't campus, kid."]}};
const CLQ=['legacies','athletes','studentgov','activists','townies','sororities'];
const CLX={
  legacies:{say:["I don't do lines. I have a guy who does lines for me.","My family has a wing in the library. Two, actually.","Summering in Nantucket is such a drag. The Vineyard's worse.","Dad says a C is just an A with a payment plan.","The club switched caviar suppliers. It's a scandal.","Father golfs with the Dean. Just so you know.","My sailboat has a name. Your car does not.","Don't touch the blazer. It's older than you are.","Tuition? I thought that was a tip.","My tutor has a tutor.","I was born on this campus. Well, the hospital next door.","Legacy admit. Legacy everything, honestly."],taunt:["Do you know who my father is?","Security? There's a stain on the lawn."]},
  athletes:{say:["Two-a-days start at five. In the morning.","Creatine's not a drug. It's a lifestyle.","I can bench your whole pledge class.","Eat. Sleep. Squat. Repeat.","Trainer taped my ankle with, like, four rolls.","Dining hall ran out of chicken again. Unacceptable.","Ice bath's at six. You wanna join?","I ran the stadium steps twice. Okay, once. It was a long once.","We're gonna crush State. Whoever State is.","I eat six meals a day. It's a job.","Film session at noon. Don't ask me what's on the film.","My GPA's fine. I think. Nobody's told me."],taunt:["Wanna go, bro?","I'll bench you right off this sidewalk."]},
  studentgov:{say:["Point of order!","I'm drafting a resolution on the vending machines.","Quorum was not met. Again.","My platform is accountability. And snacks.","Do you have a minute for the campus safety survey?","The minutes from last meeting are, regrettably, missing.","I'm on four committees. Five if the parking one comes through.","We pushed the budget amendment to next week.","Nobody reads the agenda. It's right there.","The vote was eleven to nine. Democracy!","I color-code my bylaws.","Please direct all complaints to the suggestion box. It's on fire, but still."],taunt:["That's a code of conduct violation!","I'm drafting a formal complaint right now!"]},
  activists:{say:["Ask me about the dining hall workers' contract.","The fountain uses more water than a small town!","Do you know where your tuition goes? Neither do we.","Meeting's at seven. There's vegan pizza.","We're collecting signatures against the parking garage.","Question everything. Especially the athletic budget.","The banner's still wet. Careful.","My zine drops Friday.","We're staging a sit-in at the admin building. Bring a sandwich.","Corporate sponsorship of the quad? Over my dead body.","Have you thought about composting?","Another trustee dinner. Another catered scandal."],taunt:["Wake up, sheep!","Your house is a monument to privilege."]},
  townies:{say:["Used to be a diner where that coffee shop is.","My uncle laid half the sidewalks on this campus. Nobody remembers.","Parking's a nightmare when you kids come back.","Prices went up the second the dorms did.","I've served pizza to six presidents of this school. Not one tipped.","Rusty Anchor does two-dollar drafts on Tuesdays. Don't tell the kids.","We were here before the university. We'll be here after.","You can tell who's from here. We wave.","My dad worked the line. Now it's a luxury loft.","Watch it on the ave. Drivers don't stop for you folks.","Rent doubled in March. Closed the shop in April.","Back in my day we had one bar and it was enough."],taunt:["Take your money and go home!","This street's older than your whole school."]},
  sororities:{say:["Formal's at the lake house. The dress code is brutal.","Rush is a competitive sport, honestly.","Our house mom makes the best cookies. Don't tell the others.","We're doing a bake sale for charity. Take a cookie.","My big sister dropped off a gift basket. I'm obsessed.","Can you believe the group chat last night?","Date function's Friday. I have nothing to wear.","Philanthropy hours are due. I'm at six of twenty.","Mixer with the boys next week. Pray for us.","Did you try the new smoothie place? It's life-changing.","Shh. We're practicing the chapter song. Quietly.","My little is a mess. I love her."],taunt:["Do I look like I want to talk to you?","Wow. Just wow."]},
  brothers:{say:["Who's got the keg key?","Intramural game's at four. We're gonna roll.","Don't sit on that couch. Something happened there.","Chapter's tonight. Don't be late.","Pledge, the sink's backed up again.","We've got the best house on the row. Fight me.","Grant's been holding court in the throne room all day.","Who left the pong table wet?","I swear the basement is haunted.","Brotherhood is forever. Parking spots are not.","Pledge, fetch me a water.","Philanthropy week's coming. We're doing a car wash.","Greek Row has eyes on us. Act like it.","Don't tell Grant I said this, but the throne is a lot."],taunt:["Watch the shirt, man. It's a brother's shirt."]},
  hughes:{say:["I got expelled from three schools. This is the one that stuck.","The cafeteria food is basically a punishment.","Don't mention my mother's wire transfers."]},
  staff:{say:["Mind the wet floor.","We close in ten minutes.","Cash or card?","Don't lean on that.","Lost and found's in the back."]},
  police:{say:["Report suspicious activity to the front desk.","Keep it down near the dorms.","Everything's under control, folks.","Don't make me come over there."]},
  ra:{say:["Remember, floor meeting Sunday.","Keep the door propped. No, not like that.","I'm required to remind you about the candle policy.","Yes, I can smell it from here."]},
  cops:{say:["Stay out of trouble, kid.","We've got our eye on this block.","Nothing to see here. Move along.","Don't let me catch you out after dark."]}
};
for(const k in CLX){const x=CLX[k],c=CL[k];if(!c)continue;if(x.say)c.say=(c.say||[]).concat(x.say);if(x.taunt)c.taunt=(c.taunt||[]).concat(x.taunt)}
const NPCX_FR=["Danny! Good to see you.","There he is! The man himself.","Danny, my friend! Need anything, just ask.","Good to see a friendly face around here, Danny.","Danny! You've got a good name around here.","Hey, Danny! Heard good things about you."];
const NPCX_WARM=["Danny! There's my favorite person.","Hey, buddy! What's up?","Danny! You made my day.","Perfect timing, Danny. I was just thinking about you.","My favorite person on campus!"];
const NPCX_HOT=["What do YOU want?","Ugh. You again.","Keep walking, Kowalski.","I don't have time for you.","You've got some nerve.","Not you again."];
const NPCX_PL=["Hey. Survived another day?","Rough day? Same.","Hope you're getting some sleep. I'm not.","Did you see what they assigned today?","Keep your head down and your tasks done.","Another day, another humiliating chore."];
function npcCyc(n,k,L){if(!L||!L.length)return '';n.cy=n.cy||{};let c=n.cy[k];if(!c||c.len!==L.length||c.i>=c.o.length){const o=L.map((_,i)=>i);for(let i=o.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=o[i];o[i]=o[j];o[j]=t}if(c&&c.last!=null&&o.length>1&&o[0]===c.last){const t=o[0];o[0]=o[1];o[1]=t}c=n.cy[k]={o,i:0,len:L.length,last:c?c.last:null}}const ix=c.o[c.i++];c.last=ix;return L[ix]}

const MN="Chase Tyler Logan Dylan Cody Hunter Wyatt Derek Colton Preston Landon Brett Tanner Reid Miles Ryan Owen Gavin Cole Troy Kofi Sanjay Felix Theo Earl Dwayne Ricky Vince Buck Jimmy Mateo Andre Hiro Malik".split(' '),FN="Madison Kayla Brooke Avery Lauren Hailey Sloane Tessa Paige Morgan Priya Grace Ruth Ingrid Nadia Marisol Jules Sage Darla Tammy Rhonda Aisha Mei Lucia".split(' ');
const SKIN=[0xf1c9a5,0xe0ac80,0xc68a5c,0x9b6640,0x6e4630,0xf6d6be],HAIR=[0x2a1d14,0x4a3020,0x6b4a2a,0xc9a46a,0x151515,0x8a4a2a,0x9a9a9a];
const ZN={greek:[18,10,132,206],greekN:[18,10,64,52],quad:[160,75,560,560],ath:[380,300,700,560],down:[144,592,358,710],lake:[6,544+LZ,694,1320],ave:[0,574,WW,588],heights:[10,210,136,570],hughes:[47.5,591,62.4,688]};
const NP=[];const NN={};
function spotIn(r,tries=80){for(let i=0;i<tries;i++){const x=r[0]+rnd()*(r[2]-r[0]),z=r[1]+rnd()*(r[3]-r[1]);if(freeAt(x,z,.7)&&!inLake(x,z))return[x,z]}return[(r[0]+r[2])/2,(r[1]+r[3])/2]}
/* V274 fraternity members are always men and sorority members always women: true/false for a house id (FRATS or CHAPTERS) or the sororities clique, null when it says nothing */
function houseFem(id,cl){const F=id?FRATS.find(f=>f.id===id):null;if(F)return !!F.fem;const c=id?CHAPTERS.find(c=>c[0]===id):null;if(c)return c[1]==='sororities';return cl==='sororities'?true:null}
let UID=0;
/* V369 police uniforms: a peaked patrol cap with a black visor and a gold cap badge, a star badge and name bar on the chest, shoulder patches,
   a shoulder radio and a duty belt with a holster, cuffs and a baton. Campus Police wear light blue shirts; Harrowgate PD wear navy. Attached to the
   bones, so they move with the body. */
const UNIM={};function uniMat(c,r=.6,m=0){const k=c+'|'+r+'|'+m;return UNIM[k]||(UNIM[k]=SM({color:c,roughness:r,metalness:m}))}
function uniAdd(g,kind){const P=g.P;if(!P||!P.head||g.userData.uni)return;g.userData.uni=1;const M=(geo,c,b,x,y,z,r,m)=>{const e=new THREE.Mesh(geo,uniMat(c,r,m));e.position.set(x,y,z);e.castShadow=true;b.add(e);return e};
  const cap=kind==='cops'?0x14181f:0x1a2540,GOLD=0xd8b24a,SIL=0xc9ccd2,BLK=0x111215,BLT=0x15161a;
  const hs=(typeof CHR_PROP!=='undefined'&&CHR_PROP.hs)||1;
  {const h=P.head,s=hs;   /* the cap */
   const cr=M(GC.uCrown||(GC.uCrown=new THREE.CylinderGeometry(.19,.15,.085,24)),cap,h,0,.268*s,.004,.7);cr.scale.set(s,s,s*1.08);
   M(GC.uBand||(GC.uBand=new THREE.CylinderGeometry(.152,.152,.04,24,1,true)),BLK,h,0,.215*s,.004,.4).scale.set(s,s,s*1.08);
   const v=M(GC.uVis||(GC.uVis=new THREE.CylinderGeometry(.13,.13,.012,20,1,false,-PI/2,PI)),BLK,h,0,.198*s,.085*s,.15,.2);v.scale.set(s,s,s*.95);v.rotation.x=.22;
   const bd=M(GC.uCapB||(GC.uCapB=new THREE.CircleGeometry(.034,6)),GOLD,h,0,.262*s,.178*s,.3,.8);bd.rotation.x=-.18}
  {const c=P.chest;   /* badge, name bar, patches, radio */
   const st=M(GC.uStar||(GC.uStar=(()=>{const sh=new THREE.Shape();for(let i=0;i<10;i++){const a=i/10*TAU+PI/2,r=i%2?.025:.055;i?sh.lineTo(Math.cos(a)*r,Math.sin(a)*r):sh.moveTo(Math.cos(a)*r,Math.sin(a)*r)}return new THREE.ExtrudeGeometry(sh,{depth:.006,bevelEnabled:false})})()),GOLD,c,-.085,.085,.172,.25,.9);st.scale.setScalar(1);
   M(GC.uName||(GC.uName=new THREE.BoxGeometry(.07,.016,.006)),SIL,c,.085,.07,.168,.25,.9);
   M(GC.uPocket||(GC.uPocket=new THREE.BoxGeometry(.075,.055,.008)),kind==='cops'?0x1d222b:0x6f8bb2,c,-.085,.0,.124,.85);M(GC.uPocket,kind==='cops'?0x1d222b:0x6f8bb2,c,.085,.0,.124,.85);
   M(GC.uRadio||(GC.uRadio=new THREE.BoxGeometry(.035,.06,.022)),BLK,c,.12,.16,.11,.5);
   for(const sx of[-1,1]){const pa=M(GC.uPatch||(GC.uPatch=new THREE.CircleGeometry(.032,10)),0x2a4a7a,c,sx*.205,.13,.0,.8);pa.rotation.y=sx*PI/2;const pb=M(GC.uPatchR||(GC.uPatchR=new THREE.RingGeometry(.026,.032,10)),GOLD,c,sx*.2052,.13,.0,.5,.5);pb.rotation.y=sx*PI/2}}
  {const b=P.hips;   /* duty belt */
   M(GC.uBelt||(GC.uBelt=new THREE.CylinderGeometry(.168,.168,.055,22,1,true)),BLT,b,0,.0,.005,.45).scale.set(1,1,.82);
   M(GC.uBuck||(GC.uBuck=new THREE.BoxGeometry(.04,.032,.012)),SIL,b,0,0,.143,.3,.8);
   M(GC.uHol||(GC.uHol=new THREE.BoxGeometry(.045,.13,.07)),BLT,b,.17,-.06,.02,.5);
   M(GC.uCuff||(GC.uCuff=new THREE.BoxGeometry(.05,.035,.03)),BLT,b,-.12,-.005,.11,.5);
   M(GC.uBat||(GC.uBat=new THREE.CylinderGeometry(.012,.012,.32,8)),BLK,b,-.17,-.13,.0,.4)}
}
/* V360 bodies on demand. A spawned character starts as an empty group: it has a position and can be hidden or moved, but no body. The body (skeleton,
   skin, face, fingers) is built the first time anything reads its parts (g.P) or it is about to be drawn, then stays. About a thousand characters are
   spawned at startup and most are far away or inside buildings, so this takes most of the character stage out of the loading screen. ?eagerbodies=1 turns it off. */
const LAZYB=!/[?&]eagerbodies/.test(location.search);let LAZYN=0,BODYF=-1,BODYQ=0;
function bodyBuild(g){const o=g.userData.lazy;if(!o)return;g.userData.lazy=null;delete g.P;delete g.CS;const r=mkPerson(o);while(r.children.length)g.add(r.children[0]);g.P=r.P;if(r.CS)g.CS=r.CS;LAZYN++;if(o.uni)uniAdd(g,o.uni)}
function lazyPerson(o){if(!LAZYB){const g=mkPerson(o);if(o.uni)uniAdd(g,o.uni);return g}const g=new THREE.Group();g.userData.lazy=o;
  for(const k of['P','CS'])Object.defineProperty(g,k,{configurable:true,enumerable:true,get(){bodyBuild(g);return g[k]},set(v){Object.defineProperty(g,k,{value:v,writable:true,configurable:true,enumerable:true})}});
  return g}
function spawn(cl,zone,o={}){o=presLook(o);const C=CL[cl],sd=o.name?nameSeed(o.name):null,R_=sd!=null?mulberry(sd^0x5bd1e995):rnd,PK_=a=>a[Math.floor(R_()*a.length)],HF=houseFem(o.house,cl),fem=HF!=null?HF:o.fem!=null?o.fem:R_()<C.fem;const Hh=o.house&&HOUSE[o.house];const g=o.stone?lazyPerson({shirt:0x6e7075,sleeve:0x6e7075,pants:0x66686d,skin:0x76787d,hair:0x5e6065,stone:1,noMouth:1}):lazyPerson(Object.assign({letters:Hh&&!o.pledge&&!o.noLetters?o.house:null,shirt:Hh?Hh.shirt:(o.shirt||C.shirt),sleeve:Hh?Hh.shirt:(o.sleeve||C.sleeve),pants:o.pants||C.pants,skin:o.skin||PK_(SKIN),hair:o.hair||PK_(HAIR),fem,sd,cap:o.prop?null:(o.cap!=null?o.cap:C.cap),pin:o.pin,prop:o.prop,gl:o.glasses,hs:o.hs,uni:(cl==='police'||cl==='cops')&&!o.stone?cl:null},o.look||{}));   // V125 o.look: extra mkPerson fields (cl2, hs2, fh, fv, iris, shoe, sole, sacc …)if(o.scale)g.scale.setScalar(o.scale);if(o.build)g.scale.set(o.build[0]*(o.scale||1),o.build[1]*(o.scale||1),o.build[2]*(o.scale||1));
  let x=o.x,z=o.z;if(x==null){[x,z]=spotIn(ZN[zone])}const lv0=Math.round(o.lvl||(C.lv[0]+Math.floor(rnd()*(C.lv[1]-C.lv[0]+1)))),lvl=clamp(o.lvAbs?lv0:lv0-lvShift(),1,12);
  const n={uid:++UID,nick:(!fem&&(['brothers','athletes','legacies'].includes(cl)||o.house==='kan'||o.house==='kto')&&rnd()<.45)?pick(['Browalski','Broski','Brochacho']):null,fem:!!fem,cl,zone,int:(typeof INT!=='undefined'&&INT[zone])?zone:(o.int||null),auth:!!C.auth,name:o.name||((fem?pick(FN):pick(MN))+' '+String.fromCharCode(65+Math.floor(rnd()*26))+'.'),title:o.title,lvl,lv0:o.lvAbs?null:lv0,hp:20+lvl*12,mhp:20+lvl*12,x,z,a:o.a!=null?o.a:rnd()*TAU,hx:x,hz:z,ha:o.a,g,tx:x,tz:z,wait:rnd()*4,t:rnd()*10,mode:o.mode||'wander',aggro:0,tgt:null,cd:0,down:0,stun:0,temp:o.temp||0,named:o.named||0,ally:o.ally||0,sus:0,chase:0,lastSeen:9,bub:null,bubT:0,bubCd:3+rnd()*10,hostCd:rnd()*2,dp:999,sp:0,tag:null,patrol:o.patrol,pi:0,flee:0,shop:o.shop,role:o.role,pledge:o.pledge||0,fb:(!fem&&Hh&&!o.pledge&&!o.prop&&!o.stone&&!o.temp)?1:0,actor:o.actor||0,prop:!!o.prop,greet:o.greet,kid:!!C.kid,lines:o.lines||null};
  g.position.set(x,terrH(x,z),z);g.rotation.y=n.a;sc.add(g);NP.push(n);return n}
function despawn(n){sc.remove(n.g);const i=NP.indexOf(n);if(i>=0)NP.splice(i,1)}
function bubble(n,t,d=3.2){try{if(t&&t.indexOf('{')>=0)t=dlgFill(t)}catch(e){}try{t=c1Voc(t)}catch(e){}try{babble(n,t,0)}catch(e){}if(!n.bub){n.bub=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthWrite:false,depthTest:false,alphaTest:.1,color:PP.hdr?new THREE.Color().setRGB(1.3,1.3,1.34):0xffffff}));n.bub.renderOrder=20;n.bub.scale.set(4.2,.72,1);n.bub.position.y=n.tall?4.2:n.prop?3.45:3.2;n.g.add(n.bub)}n.bub.material.map=bubbleTex(t);n.bub.material.needsUpdate=true;n.bub.visible=true;n.bubT=d}
const NAMED=[
  {id:'grant',house:'asr',name:'Grant Ashby',title:'ΑΣΡ President',cl:'brothers',int:'asr',x:24,z:2.1,a:0,throne:1,lvl:10,shirt:0x7d1f2c,sleeve:0x7d1f2c,pants:0xcbb98f,hair:0xc9a46a,skin:0xf1c9a5},
  {id:'tank',house:'asr',name:'Tank Hale',title:'Big Brother',cl:'brothers',x:87.5,z:81,a:-PI/2,lvl:8,shirt:0x7d1f2c,sleeve:0xeae4d4,scale:1.12,hair:0x151515,skin:0x9b6640},
  {id:'reese',house:'asr',name:'Reese Whitford',title:'Big Brother',cl:'brothers',x:87.0,z:69.5,a:-PI/2,lvl:6,shirt:0x24305a,sleeve:0x24305a,pants:0xcbb98f,hair:0x6b4a2a,skin:0xf6d6be},
  {id:'owen',house:'asr',name:'Owen Park',title:'Big Brother',cl:'brothers',x:88.0,z:84.8,a:-PI/2,lvl:5,shirt:0x3f5a3a,sleeve:0x3f5a3a,pants:0x4a4038,hair:0x151515,skin:0xe0ac80},
  {id:'brett',house:'asr',name:'Brett Calloway',title:'ΑΣΡ Brother',cl:'brothers',x:86.0,z:87.5,a:-PI/2,lvl:6,hair:0x4a3020},
  {id:'marcus',house:'asr',noLetters:1,prole:'weather',pclass:1,name:'Marcus Bell',title:'Fellow Pledge',cl:'brothers',x:86.0,z:79,a:-PI/2,lvl:3,prop:1,shirt:0x7d1f2c,pin:1,hair:0x151515,skin:0x6e4630},
  {id:'hunter',name:'Hunter Briggs',title:'ΑΣΡ Pledge',prole:'basketball',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:87.4,z:65.5,a:-PI/2,lvl:2,hair:0xc9a46a,skin:0xf1c9a5},
  {id:'felix',name:'Felix Ortega',title:'ΑΣΡ Pledge',prole:'pouch',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:87.3,z:86,a:-PI/2,lvl:1,hair:0x151515,skin:0xc68a5c},
  {id:'cody',name:'Cody Ramsey',title:'ΑΣΡ Pledge',prole:'grenade',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr',x:21,z:25,a:0,lvl:2,hair:0x8a4a2a,skin:0xf6d6be},
  {id:'sanjay',name:'Sanjay Mehta',title:'ΑΣΡ Pledge',prole:'morning',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr',x:12,z:16,a:PI/2,lvl:1,hair:0x151515,skin:0x9b6640},
  {id:'vinny',name:'Vinny Russo',title:'ΑΣΡ Pledge',prole:'delinquent',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:200,z:62,a:0,lvl:3,mode:'wander',zone:'quad',hair:0x2a1d14,skin:0xe0ac80},
  {id:'andre',name:'Andre Wallace',title:'ΑΣΡ Pledge',prole:'captain',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:87.4,z:74,a:-PI/2,lvl:3,hair:0x151515,skin:0x6e4630},
  {id:'miles',name:'Miles Tanaka',title:'ΑΣΡ Pledge',prole:'hype',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr',x:40,z:9,a:PI,lvl:2,hair:0x151515,skin:0xf1c9a5},
  {id:'kofi',name:'Kofi Mensah',title:'ΑΣΡ Pledge',prole:'snack',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr',x:55,z:26,a:0,lvl:1,hair:0x151515,skin:0x6e4630},
  {id:'theo',name:'Theo Lindgren',title:'ΑΣΡ Pledge',prole:'scribe',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr_up',x:6,z:31,a:PI,lvl:1,hair:0xc9a46a,skin:0xf6d6be},
  {id:'gavin',name:'Gavin Price',title:'ΑΣΡ Pledge',prole:'mascot',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:61,z:69,a:PI/2,lvl:2,hair:0x6b4a2a,skin:0xe0ac80},
  {id:'jaylen',name:'Jaylen Brooks',title:'ΑΣΡ Pledge',prole:'popstar',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:196,z:58,a:0,mode:'wander',zone:'quad',lvl:2,hair:0x151515,skin:0x8a5a3a},
  {id:'nate',name:'Nate Okafor',title:'ΑΣΡ Pledge',prole:'stats',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr',x:30,z:14,a:PI/2,lvl:1,hair:0x151515,skin:0x6e4630},
  {id:'tyler',name:'Tyler Voss',title:'ΑΣΡ Pledge',prole:'skate',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:206,z:66,a:0,mode:'wander',zone:'quad',lvl:2,hair:0xc9a46a,skin:0xf6d6be},
  {id:'rico',name:'Rico Alvarez',title:'ΑΣΡ Pledge',prole:'burglar',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:190,z:70,a:0,mode:'wander',zone:'quad',lvl:2,hair:0x151515,skin:0xc68a5c},
  {id:'ben',name:'Ben Whitaker',title:'ΑΣΡ Pledge',prole:'fruit',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:87.4,z:70,a:-PI/2,lvl:1,hair:0x8a4a2a,skin:0xf1c9a5},
  {id:'wes',name:'Wes Hollis',title:'ΑΣΡ Pledge',prole:'ouija',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr_up',x:14,z:30,a:PI,lvl:1,hair:0x151515,skin:0xf6d6be},
  {id:'pruitt',name:'Owen Pruitt',title:'ΑΣΡ Pledge',prole:'cone',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,x:198,z:74,a:0,mode:'wander',zone:'quad',lvl:2,hair:0x3a2a1a,skin:0xf1c9a5},
  {id:'brock',name:'Brock Dunmore',title:'ΑΣΡ Pledge',prole:'caveman',pclass:1,cl:'brothers',house:'asr',noLetters:1,prop:1,pin:1,int:'asr',x:46,z:20,a:PI,lvl:3,hair:0x6b4a2a,skin:0xe0ac80},
  {id:'dean',name:'Dean Halvorsen',title:'Dean of Students',cl:'studentgov',x:205,z:37.5,a:0,lvl:5,shirt:0x50545e,sleeve:0x50545e,pants:0x2a2c33,fem:1,hair:0x9a9a9a},
  {id:'lena',name:'Lena Reyes',title:'Organizer',cl:'activists',x:172,z:607.5,a:PI,lvl:5,fem:1,hair:0x151515,skin:0xc68a5c,ch:3},
  {id:'charles',name:'Charles Ashby',title:'ΑΣΡ Alumni Trust',cl:'oldguard',x:121,z:570,a:0,lvl:9,shirt:0x1d2440,sleeve:0x1d2440,hair:0x9a9a9a,ch:3},
  {id:'gus',name:'Gus Pappas',title:'Groundskeeper',cl:'staff',x:196,z:86,a:PI/2,lvl:5,shirt:0x3a5a3a,sleeve:0x3a5a3a,pants:0x4a4038,hair:0x9a9a9a,skin:0xe0ac80},
  {id:'marisol',name:'Marisol Vega',title:"Waitress at Ruby's",cl:'townies',x:176,z:595.2,a:PI,lvl:4,fem:1,shirt:0xb3262e,sleeve:0xb3262e,hair:0x151515,skin:0xc68a5c},
  {id:'priya',name:'Priya Nair',title:'Student Gov Treasurer',cl:'studentgov',x:212,z:116.5,a:0,lvl:3,fem:1,hair:0x151515,skin:0x9b6640},
  /* V349 yearbook editor: gives the side story that introduces the yearbook */
  {id:'tess',name:'Tess Okafor',title:'Yearbook Editor',cl:'studentgov',x:199,z:121,a:-PI/2,lvl:3,fem:1,shirt:0xe2b64c,sleeve:0xe2b64c,pants:0x2a2c40,hair:0x2a1a12,skin:0x8a5a36}];

// ---------- Lambda Chi Alpha roster (green shirts, purple letters, yellow outline)
const LXA_BUILD={skinny:[.84,1,.84],avg:[1,1,1],semi:[1.14,1,1.2],fat:[1.38,1,1.45],big:[1.34,1.05,1.4],shortSkinny:[.84,.88,.84],short:[1,.88,1],shortSemi:[1.14,.88,1.2],tallSkinny:[.84,1.1,.84],builder:[1.5,1.04,1.25]};
const LXA_SK={lt:0xf6d6be,fair:0xf1c9a5,tan:0xe0ac80,brown:0xb27c4f,black:0x6e4630};
const LXA_HC={brown:0x5a3a22,lbrown:0x8a6a40,black:0x151515,blonde:0xd8b870,orange:0xc8591f};
const LXA_ROSTER=[
 ['Jon S.','ΛΧΑ President',10,0,'lt','blonde',null,0,'avg',1],
 ['Porter C.','ΛΧΑ Vice President',8,0,'fair','brown','curly',0,'semi'],
 ['Brit A.','ΛΧΑ Recruitment Chair',10,0,'tan','black','afro',0,'skinny'],
 ['Alex H.','ΛΧΑ Philanthropy Chair',8,0,'lt','brown',null,1,'skinny'],
 ['Kyle F.','ΛΧΑ Secretary',8,0,'fair','brown','curly',1,'shortSkinny'],
 ['Tyrese J.','ΛΧΑ Frat Unc',9,0,'black','black',null,1,'big',2],
 ['Nick M.','ΛΧΑ Alumni Advisor',9,0,'lt','orange',null,0,'skinny'],
 ['Carter H.','ΛΧΑ Party Planner',9,0,'fair','black',null,0,'semi'],
 ['Joel O.','ΛΧΑ Treasurer',9,0,'lt','brown','curly',0,'skinny'],
 ['Tyler F.','ΛΧΑ New Member Educator',9,0,'lt','orange',null,0,'skinny'],
 ['Marvin P.','ΛΧΑ Brother',7,0,'black','black',null,0,'big'],
 ['Nate K.','ΛΧΑ Brother',7,0,'fair','brown',null,0,'semi'],
 ['Scott R.','ΛΧΑ Brother',7,0,'lt','black',null,0,'skinny'],
 ['Colin H.','ΛΧΑ Ritualist',11,1,'fair','brown',null,0,'skinny',3],
 ['Alex O.','ΛΧΑ Brother',7,1,'lt','brown',null,0,'shortSemi'],
 ['Anid G.','ΛΧΑ Brother',6,1,'brown','black',null,1,'shortSkinny'],
 ['Connor L.','ΛΧΑ Brother',7,1,'fair','brown','curly',0,'short'],
 ['Luke H.','ΛΧΑ Brother',7,1,'lt','black',null,0,'semi'],
 ['Alex C.','ΛΧΑ Associate Member',4,1,'fair','brown',null,0,'skinny'],
 ['Anthony H.','ΛΧΑ Associate Member',3,1,'lt','black',null,0,'shortSkinny'],
 ['Chase M.','ΛΧΑ Associate Member',3,1,'lt','blonde','curly',0,'semi'],
 ['Cody N.','ΛΧΑ Associate Member',4,1,'fair','black','bucket',0,'fat'],
 ['Collin G.','ΛΧΑ Associate Member',3,1,'lt','brown',null,1,'skinny'],
 ['Ethan B.','ΛΧΑ Associate Member',4,1,'fair','lbrown','curly',0,'tallSkinny'],
 ['Lucas B.','ΛΧΑ Associate Member',5,1,'lt','black',null,0,'tallSkinny'],
 ['Luke F.','ΛΧΑ Associate Member',4,1,'fair','brown',null,0,'builder']];
const LXA_GREET={1:'"Welcome to Lambda Chi. Wipe your feet and keep your hands off the composites."',2:'"Back in my day we did this with half the budget. Grab a seat, kid."',3:'"The ritual book stays in the room, and so do you."'};
function spawnLXA(){for(const[nm,title,l,up,sk,hc,hs,gl,bd,g]of LXA_ROSTER){const I=INT.lxa,o={house:'lxa',fem:false,name:nm,title,lvl:l,skin:LXA_SK[sk],hair:LXA_HC[hc],hs,glasses:gl,build:LXA_BUILD[bd]};if(g===1){o.x=I.x0+24;o.z=I.z0+24;o.a=0;o.mode='idle';o.named=1}if(g)o.greet=LXA_GREET[g];if(LXA_OUTN.includes(nm)){LXA_POOL.push(o);continue}spawn('brothers',up?'lxa_up':'lxa',o)}}
const FRATS=[{id:'asr',L:'ΑΣΡ',cl:'brothers',front:0},{id:'kto',L:'ΚΘΩ',cl:'legacies'},{id:'opd',L:'ΩΨΔ',cl:'studentgov'},{id:'kan',L:'ΚΑΝ',cl:'athletes'},{id:'lxa',L:'ΛΧΑ',cl:'brothers'},
 {id:'gwz',L:'ΓΩΖ',cl:'studentgov',pres:'Dominic Rao'},{id:'tchi',L:'ΘΧ',cl:'athletes',pres:'Cade Whitmore'},{id:'pkp',L:'ΠΚΦ',cl:'studentgov',pres:'Elliot Banerjee'},{id:'pka',L:'ΠΚΑ',cl:'athletes',pres:'Wade Pruitt'},{id:'sae',L:'ΣΑΕ',cl:'legacies',pres:'Beau Lancaster'},{id:'ksig',L:'ΚΣ',cl:'legacies',pres:'Tripp Donnelly'},
 {id:'kkg',L:'ΚΚΓ',cl:'sororities',fem:true,pres:'Avery Lindqvist'},
 {id:'tri',L:'Δ',cl:'studentgov',pres:'Owen Pritchard'},
 {id:'tpa',L:'ΘΦΑ',cl:'sororities',fem:true,pres:'Harper Sinclair'},
 {id:'sam',L:'ΣΑΜ',cl:'activists',pres:'Isaac Feldman'},
 {id:'chio',L:'ΧΩ',cl:'sororities',fem:true,pres:'Riley Castellano'},
 {id:'stau',L:'ΣΤ',cl:'brothers',pres:'Declan Ruiz'},
 {id:'phimu',L:'ΦΜ',cl:'sororities',fem:true,pres:'Paige Winslow'},
 {id:'kd',L:'ΚΔ',cl:'sororities',fem:true,pres:'Quinn Alvarez'},
 {id:'atht',L:'ΑΘΤ',cl:'sororities',fem:true,pres:'Tessa Brandt'},
 {id:'btp',L:'ΒΘΠ',cl:'legacies',pres:'Garrett Holloway'},
 {id:'dtd',L:'ΔΤΔ',cl:'athletes',pres:'Reid Calloway'},
 {id:'psr',L:'ΦΣΡ',cl:'sororities',fem:true,pres:'Marin Eldridge'},
 {id:'pdt',L:'ΦΔΘ',cl:'athletes',pres:'Cooper Whitlock'}];
const LXA_POOL=[],LXA_OUTN=['Porter C.','Brit A.','Alex H.','Kyle F.','Alex C.','Anthony H.','Chase M.','Cody N.'];
function sp(id,cl,zone,o){if(id==='lxa'){const q=LXA_POOL.shift();if(!q)return null;return spawn('brothers',zone,Object.assign({},q,{x:o.x,z:o.z,a:o.a,mode:o.mode}))}return spawn(cl,zone,o)}
function nearFree(x,z,r=.45){if(freeAt(x,z,r))return[x,z];for(let d=.5;d<5;d+=.5)for(let k=0;k<12;k++){const a=k/12*TAU,px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d;if(freeAt(px,pz,r))return[px,pz]}return[x,z]}
function yardPlayers(Y,tab,n,cl,id,L){if(!n)return;const T=tab==='p'?{x:Y.ptx,z:Y.ptz,e:2.1,dz:.5,B:Y.pb}:{x:Y.dtx,z:Y.dtz,e:1.85,dz:.38,B:Y.db};
  const slots=n>=4?[[-1,-1,0],[1,1,.25],[-1,1,.5],[1,-1,.75]]:[[-1,0,0],[1,0,.5]],base=rnd()*10;
  for(const[sx,sz,off]of slots){const p=sp(id,cl,Y.zone,{x:T.x+sx*T.e,z:T.z+sz*T.dz,a:-sx*PI/2,mode:'play',house:id,title:L+' Brother',lvl:3+Math.floor(rnd()*4)});if(!p)continue;p.t=base+off/.36;T.B.p.push(p);T.B.tx.push(T.x-sx*T.B.cupx);T.B.tz.push(T.z)}}
// ---- the Gargoyle Pledge: every fraternity except Lambda Chi Alpha keeps one. Stone-grey, perched on a chair like Spider-Man, and he never moves.
function gargoyle(F,b){const out=b.face==='e'?1:-1,a=out*PI/2;let[x,z]=nearFree(b.ex+out*3.2,b.ez+(F.id.length%2?-2.8:2.8),.6);
  const ch=new THREE.Group(),WD=mt(0x4a3626,.8),gy=terrH(x,z);ch.position.set(x,gy,z);ch.rotation.y=a;const A=(w,h,d,px,py,pz)=>{const m=new THREE.Mesh(bgeo(w,h,d),WD);m.position.set(px,py,pz);m.castShadow=true;ch.add(m)};
  A(.62,.07,.6,0,.46,0);for(const sx of[-.27,.27])for(const sz of[-.26,.26])A(.05,.46,.05,sx,.23,sz);A(.62,.62,.06,0,.8,-.28);for(const sx of[-.27,.27])A(.05,.62,.05,sx,.8,-.28);
  ch.userData.ts=1;sc.add(ch);markC(x,z,.45,1.2);
  const n=spawn('brothers',b.z0<206?'greek':'heights',{x,z,a,house:F.id,noLetters:1,stone:1,mode:'idle',name:pick(MN)+' '+String.fromCharCode(65+Math.floor(rnd()*26))+'.',title:F.L+' Gargoyle Pledge',lvl:1,
    greet:'*He doesn’t move. He doesn’t blink. He just watches the street from his chair.*'});
  n.statue=1;n.gargoyle=1;const g=n.g,P_=g.P,fx=Math.sin(a),fz=Math.cos(a);if(P_.kL){n.sx=x-fx*.06;n.sz=z-fz*.06;n.sy=gy-.11}else{n.sx=x-fx*.6;n.sz=z-fz*.6;n.sy=gy}n.x=n.sx;n.z=n.sz;g.position.set(n.sx,n.sy,n.sz);g.rotation.set(P_.kL?0:.5,a,0,'YXZ');
  // crouched on the seat like Spider-Man: body pitched forward, folded legs with the feet on the seat edge, knees out, hands hanging straight down between them
  if(P_.kL){g.RAG=1;for(const[l,k_,s_]of[[P_.lL,P_.kL,-1],[P_.lR,P_.kR,1]]){l.rotation.set(-1.95,0,s_*.36);k_.rotation.set(2.3,0,0)}P_.spine.rotation.x=.42;P_.chest.rotation.x=.22;P_.neck.rotation.x=-.2;P_.head.rotation.x=-.42;for(const[ar,e_,s_]of[[P_.aL,P_.eL,-1],[P_.aR,P_.eR,1]]){ar.rotation.set(-.2,0,s_*.16);e_.rotation.set(-.35,0,0)}}else for(const[l,s_]of[[P_.lL,-1],[P_.lR,1]]){l.scale.y=.5;l.rotation.set(-.42,0,s_*.3)}
  if(!P_.kL)for(const[ar,s_]of[[P_.aL,-1],[P_.aR,1]]){ar.rotation.set(.5,0,s_*.1)}
  return n}
// ================================================================ V94 President Grant on his throne in the throne room (ASR house)
function throneRoom(I,o){const TX=24,TZ=2.1,ST=1.15,G=mt(0xd8b048,.3,.8),R=mt(0x7d1f2c,.8),M=mt(0x2a1a24,.9),MB=mt(0xe6dfd0,.6),DK=mt(0x1f1a24,.9);
  // black marble floor, red runner with gold edging, a two-step dais
  fb(I,24,7,19.2,13.2,.045,DK,0,0);fb(I,24,8.4,3.0,11.6,.06,R,0,0);for(const s of[-1,1])fb(I,24+s*1.56,8.4,.12,11.6,.072,G,0,0);
  fb(I,24,2.7,8.4,4.2,.3,M,0,0);fb(I,24,2.2,5,2.8,.3,mt(0x3a2430,.8),.3,0);for(const s of[-1,1])fb(I,24+s*4.25,2.7,.1,4.2,.34,G,0,0);fb(I,24,4.85,8.4,.1,.34,G,0,0);
  // the huge throne
  fb(I,TX,TZ,2.0,1.6,.55,R,.6,1);fb(I,TX,TZ+.82,2.1,.08,.12,G,.6,0);fb(I,TX,TZ+.82,2.1,.08,.1,G,1.05,0);
  fb(I,TX,TZ+.95,1.3,.7,.15,M,.6,0);
  fb(I,TX,TZ-.62,2.6,.4,3.2,R,ST,1);fb(I,TX,TZ-.86,3.0,.16,3.9,G,ST,0);fb(I,TX,TZ-.62,3.2,.5,.25,G,4.35,0);
  for(const dx of[-1.3,-.65,0,.65,1.3])fb(I,TX+dx,TZ-.62,.22,.22,dx===0?1.5:.9,G,4.6,0);
  for(const s of[-1,1]){fb(I,TX+s*.82,TZ,.4,1.5,.7,G,ST,1);fb(I,TX+s*.82,TZ+.65,.46,.3,.95,G,.6,0);fb(I,TX+s*1.5,TZ-.62,.3,.3,4.6,G,.6,0);fb(I,TX+s*1.5,TZ-.62,.42,.42,.2,G,5.2,0)}
  // marble pillars, banners and braziers down both sides
  for(const px of[16.4,31.6])for(const z of[4.4,7.6,10.8]){fb(I,px,z,.7,.7,5.4,MB,0,1);fb(I,px,z,.95,.95,.2,G,0,0);fb(I,px,z,.95,.95,.2,G,5.2,0);
    const bx=px<24?px-1.15:px+1.15,br=new THREE.Mesh(bgeo(.5,.5,.5),bm(0xff8a2a));fb(I,bx,z,.35,.35,1.2,0x2a2a30,0,0);br.position.set(I.x0+bx,1.45,I.z0+z);sc.add(br)}
  // V181 the banners hang on the aisle side of the pillars, so the composite walls behind them stay in view
  for(const px of[16.4,31.6])for(const z of[4.4,7.6,10.8]){const bx=px<24?px+.38:px-.38;fb(I,bx,z,.05,.6,2.7,R,1.9,0);fb(I,bx,z,.07,.66,.1,G,4.6,0)}
  chand(I,24,9);wsign(I,24,.2,'s',5.35,o.letters,5,.9,o.lb,'#e2b64c')}
const THRONE_LIFT=.1;   // raise/lower Grant on his seat (metres)
// V98: punch Grant and he climbs down off the throne and fights; once he's calmed down (8 s without a fight, or you leave) he sits back down
function throneRise(n){if(!n.throne||!n.statue)return;const g=n.g,P_=g.P;n.seat=n.seat||[n.sx,n.sz-.05,n.a];n.statue=0;n.throne=0;n.rose=1;n.calm=0;g.RAG=0;
  for(const k of BN)if(P_[k]&&P_[k].rotation)P_[k].rotation.set(0,0,0);if(P_.kL&&P_.hips)P_.hips.position.set(0,.92,0);
  let x=n.seat[0],z=n.seat[1]+3.3;if(!freeAt(x,z,.34)){let ok=0;for(let r=.5;r<4&&!ok;r+=.5)for(let k=0;k<12&&!ok;k++){const a=k/12*TAU,xx=x+Math.cos(a)*r,zz=z+Math.sin(a)*r;if(freeAt(xx,zz,.34)){x=xx;z=zz;ok=1}}}
  n.x=x;n.z=z;n.path=null;n.job=null;n.a=Math.atan2(P.x-x,P.z-z);g.position.set(x,terrH(x,z),z);g.rotation.set(0,n.a,0);
  bubble(n,pick(['Oh, you did NOT just do that.','Get off my dais, pledge.','You just made the biggest mistake of your pledgeship.','I was hoping you would try that.']),2.6);tone(110,.25,'sawtooth',.06)}
function throneReseat(n){if(!n.seat)return;n.rose=0;n.aggro=0;n.tgt=null;n.chase=0;n.path=null;n.job=null;n.x=n.seat[0];n.z=n.seat[1];n.a=n.seat[2];n.g.rotation.set(0,n.a,0);throneSit(n)}
function throneSit(n){const g=n.g,P_=g.P;n.statue=1;n.throne=1;n.sx=n.x;n.sz=n.z;n.sy=.35;g.position.set(n.sx,n.sy,n.sz);g.rotation.set(0,n.a,0);
  if(P_.kL){g.RAG=1;for(const[l,k_,s_]of[[P_.lL,P_.kL,-1],[P_.lR,P_.kR,1]]){l.rotation.set(-1.55,0,s_*.07);k_.rotation.set(1.55,0,0)}P_.spine.rotation.x=-.04;for(const[ar,e_,s_]of[[P_.aL,P_.eL,-1],[P_.aR,P_.eR,1]]){ar.rotation.set(-.3,0,s_*.14);e_.rotation.set(-1,0,0)}}
  else{for(const[l,s_]of[[P_.lL,-1],[P_.lR,1]])l.rotation.set(-1.45,0,s_*.07);for(const[ar,s_]of[[P_.aL,-1],[P_.aR,1]])ar.rotation.set(-.5,0,s_*.1)}
  // sit ON the cushion: measure where his hip joint really is and lift him so his thighs rest on the seat top (1.15) instead of sinking into it
  try{g.position.set(n.sx,0,n.sz);g.updateMatrixWorld(true);const hv=new THREE.Vector3();P_.lL.getWorldPosition(hv);const sy=1.27-(hv.y)+THRONE_LIFT;n.sy=isFinite(sy)?sy:.55}catch(e){n.sy=.55}g.position.set(n.sx,n.sy,n.sz);n.sz+=.05;g.position.z=n.sz}
// ================================================================ V95 the Pledge Machine rises out of the throne room floor when Grant pulls the lever
let THM=null;
const TMK=[[0,[19.6,3.9,13],[25.8,1.5,5.2]],[2.4,[20.2,3.6,12.6],[26,1.5,5.2]],[4.4,[20.8,3.3,12.2],[26.5,1.5,5.8]],[7.4,[21.4,3.1,11.8],[26.8,1.6,6]],[8.6,[21.4,3.1,11.8],[26.8,1.6,6]]];
const TMDX=25.9,TMDZ=5.0;
function tmBuild(){const I=INT.asr,HX=28.3,HZ=8.2,wx=I.x0+HX,wz=I.z0+HZ,dk=mt(0x1f1a24,.9),G=mt(0xd8b048,.3,.8),R=mt(0x7d1f2c,.6),ML=mt(0x6a1520,.55,.2);
  const mk=(geo,m,x,y,z,par)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.castShadow=true;e.userData.ts=1;(par||sc).add(e);return e};
  const T={I,wx,wz};T.mask=mk(bgeo(2.4,.08,2.4),new THREE.MeshBasicMaterial({color:0x040406}),wx,.04,wz);
  T.pA=mk(bgeo(1.2,.1,2.4),dk,wx-.6,.05,wz);T.pB=mk(bgeo(1.2,.1,2.4),dk,wx+.6,.05,wz);
  for(const s of[-1,1])mk(bgeo(2.64,.06,.12),G,wx,.09,wz+s*1.26);
  // the lever beside the throne
  const lx=I.x0+25.25,lz=I.z0+2.2;mk(bgeo(.3,.08,.4),G,lx,.64,lz);mk(bgeo(.18,.9,.18),G,lx,1.05,lz);
  const lg=new THREE.Group();lg.position.set(lx,1.5,lz);sc.add(lg);mk(new THREE.CylinderGeometry(.035,.035,.8,8),mt(0xb8bcc2,.3,.8),0,.4,0,lg);mk(new THREE.SphereGeometry(.1,12,10),R,0,.85,0,lg);T.lever=lg;lg.rotation.x=-.7;
  // the machine
  const mg=new THREE.Group(),face=Math.atan2(I.x0+24-wx,I.z0+6-wz);mg.rotation.y=face;mg.position.set(wx,-3.4,wz);sc.add(mg);mg.visible=false;
  mk(bgeo(1.5,2.6,1),ML,0,1.3,0,mg);mk(bgeo(1.74,.7,1.1),G,0,2.95,0,mg);mk(bgeo(.1,2.5,1.04),G,-.8,1.3,0,mg);mk(bgeo(.1,2.5,1.04),G,.8,1.3,0,mg);
  const sg=signMesh('PLEDGE MACHINE',1.6,.5,'#5a1020','#e2b64c');sg.position.set(0,2.95,.57);mg.add(sg);
  mk(bgeo(1.24,.76,.06),mt(0x0c0c10,.4),0,1.9,.51,mg);for(const[i,c]of[[-1,0xe2584a],[0,0xf2c230],[1,0x3aa06a]]){mk(bgeo(.34,.58,.04),mt(0xf6f2e8,.5),i*.4,1.9,.55,mg);mk(bgeo(.2,.2,.03),bm(c),i*.4,1.9,.58,mg)}
  mk(bgeo(1.0,.2,.34),mt(0x1a1a1e,.6),0,.55,.55,mg);for(const[i,c]of[[-1,0xe2584a],[0,0xf2c230],[1,0x3aa06a]])mk(new THREE.CylinderGeometry(.07,.07,.05,10).rotateX(PI/2),bm(c),i*.3,1.12,.52,mg);
  const sl=new THREE.Group();sl.position.set(.9,1.7,0);mg.add(sl);mk(new THREE.CylinderGeometry(.03,.03,.8,8),mt(0xb8bcc2,.3,.8),0,.4,0,sl);mk(new THREE.SphereGeometry(.1,12,10),R,0,.85,0,sl);sl.rotation.z=-.3;
  const bulbs=[],B1=bm(0xffe08a),B2=bm(0x6a4a20);for(let i=0;i<14;i++){const a=i<7?-.78+i*.26:-.78+(i-7)*.26,b=mk(new THREE.SphereGeometry(.05,8,6),B2,a,i<7?3.34:2.56,.58,mg);bulbs.push(b)}
  T.mg=mg;T.bulbs=bulbs;T.B1=B1;T.B2=B2;T.sl=sl;T.lt=new THREE.PointLight(0xffd070,0,9);T.lt.position.set(wx,2.6,wz);sc.add(T.lt);return T}
function tmSolid(on){if(!THM)return;const x0=THM.wx-1.2,z0=THM.wz-1.2;cells(x0,z0,x0+2.4,z0+2.4,(k)=>{if(on){WG[k]=1;HG[k]=Math.max(HG[k],3)}else{WG[k]=0;HG[k]=0}})}
function throneMachine(){const g=NN.grant;if(!INT.asr||!g||!g.throne||prSpinOn){prSpin();return}
  if(!THM)THM=tmBuild();THM.t=0;THM.state='cine';THM.skip=0;THM.said=0;THM.chime=0;THM.rum=0;THM.mg.visible=false;THM.mg.position.y=-3.4;THM.pA.position.x=THM.wx-.6;THM.pB.position.x=THM.wx+.6;THM.lever.rotation.x=-.7;
  endScene();THM.ox=P.x;THM.oz=P.z;THM.of=P.face;P.x=THM.I.x0+TMDX;P.z=THM.I.z0+TMDZ;P.vx=P.vz=0;P.face=Math.atan2(THM.wx-P.x,THM.wz-P.z);THM.dsaid=0;
  CINE={waits:[{t:9999,res:()=>{THM&&(THM.skip=1)}}],shot:'throne'};mode='cine';unlock();document.body.classList.add('cine');$('cineskip').hidden=false}
function tmArm(g,a){const P_=g.g.P;if(!P_.kL)return;P_.aR.rotation.set(lerp(-.3,-1,a),0,lerp(.14,.55,a));P_.eR.rotation.set(lerp(-1,-.35,a),0,0)}
function tmTick(dt){if(!THM)return;const ss=x=>{x=clamp(x,0,1);return x*x*(3-2*x)},T=THM,g=NN.grant,I=T.I;
  if(T.state==='cine'){if(T.skip)T.t=Math.max(T.t,7.4);T.t+=dt;const t=T.t;
    PM.position.set(P.x,P.y,P.z);PM.rotation.set(0,P.face,0);animP(PM,0,TT,'')
    if(!T.said&&t>.3){T.said=1;bubble(g,'Time for the machine, Kowalski.',2.6)}
    const reach=ss((t-1.1)/.7),pull=ss((t-1.9)/.5);tmArm(g,t<5.5?Math.max(reach,0):1-ss((t-5.5)/1));
    T.lever.rotation.x=t<1.9?-.7:(t<5.5?lerp(-.7,.8,pull):lerp(.8,-.7,ss((t-5.5)/1.5)));
    if(!T.clunk&&t>2.4){T.clunk=1;tone(90,.18,'square',.14);tone(60,.3,'sawtooth',.1,.05)}
    const sl=ss((t-2.6)/1.8);T.pA.position.x=T.wx-.6-sl*1.35;T.pB.position.x=T.wx+.6+sl*1.35;
    T.rum-=dt;if(t>2.4&&t<7&&T.rum<=0){T.rum=.36;tone(46+rnd()*8,.4,'sawtooth',.06)}
    const k=ss((t-4.4)/3);T.mg.visible=t>4.3;T.mg.position.y=lerp(-3.4,0,k);if(t>4.4&&!T.solid){T.solid=1;tmSolid(true)}
    if(t>4.3){T.lt.intensity=lerp(0,1.6,k);const ph=Math.floor(TT*8);T.bulbs.forEach((b,i)=>b.material=((i+ph)%3===0)?T.B1:T.B2);T.sl.rotation.z=-.3+Math.sin(TT*3)*.05}
    if(!T.chime&&t>7.1){T.chime=1;[523,659,784,1046].forEach((f,i)=>tone(f,.2,'triangle',.07,i*.1));bubble(g,'Pull it. Whatever it lands on, that\'s you.',2.8)}
    let a=0;while(a<TMK.length-2&&t>TMK[a+1][0])a++;const A=TMK[a],B=TMK[a+1],u=ss((t-A[0])/(B[0]-A[0])),sh=(t>2.4&&t<7)?.025:0;
    cam.position.set(I.x0+lerp(A[1][0],B[1][0],u)+Math.sin(TT*40)*sh,lerp(A[1][1],B[1][1],u)+Math.cos(TT*37)*sh,I.z0+lerp(A[1][2],B[1][2],u));cam.lookAt(I.x0+lerp(A[2][0],B[2][0],u),lerp(A[2][1],B[2][1],u),I.z0+lerp(A[2][2],B[2][2],u));
    if(t>=8.6){CINE=null;mode='play';document.body.classList.remove('cine');$('cineskip').hidden=true;tmArm(g,0);T.lever.rotation.x=-.7;T.state='spin';prSpin()}}
  else if(T.state==='spin'){const ph=Math.floor(TT*6);T.bulbs.forEach((b,i)=>b.material=((i+ph)%3===0)?T.B1:T.B2);if(!prSpinOn){T.state='retract';T.t=0;T.skip=0;tone(300,.3,'sawtooth',.06)}}
  else if(T.state==='retract'){T.t+=dt;const t=T.t,k=ss(t/2.2);T.mg.position.y=lerp(0,-3.4,k);T.lt.intensity=lerp(1.6,0,k);if(t>1.8){const c=ss((t-1.8)/1.6);T.pA.position.x=T.wx-.6-(1-c)*1.35;T.pB.position.x=T.wx+.6+(1-c)*1.35}
    if(t>3.5){T.mg.visible=false;T.lt.intensity=0;tmSolid(false);T.solid=0;T.clunk=0;T.ox=null;T.state='done'}}}
function spawnFrats(){for(const F of FRATS){const id=F.id,L=F.L,cl=F.cl,fm=!!F.fem,BR=fm?' Sister':' Brother',NM=()=>fm?pick(FN):pick(MN),b=B.find(q=>q.id===id);if(!b)continue;const zone=b.z0<206?'greek':'heights',lv=()=>3+Math.floor(rnd()*4);
    if(F.pres&&INT[id]){const I=INT[id];spawn(cl,id,{house:id,x:I.x0+24,z:I.z0+24,a:0,mode:'idle',named:1,name:F.pres,title:L+' Chapter President',fem:fm||undefined,lvl:10,greet:'"You\'re standing in my house. Make it quick."'});
      for(const role of OFFICERS.slice(0,4))spawn(cl,id,{house:id,name:NM()+' '+String.fromCharCode(65+Math.floor(rnd()*26))+'.',title:L+' '+role,fem:fm||undefined,lvl:6+Math.floor(rnd()*4)});
      for(let i=0;i<2;i++)spawn(cl,id,{house:id,title:L+BR,fem:fm||undefined,lvl:lv()});
      if(INT[id+'_up'])for(let i=0;i<2;i++)spawn(cl,id+'_up',{house:id,title:L+BR,fem:fm||undefined,lvl:lv()})}
    if(F.front!==0){const out=b.face==='e'?1:-1,ex=b.ex+out,ez=b.ez,mk=(x,z,a,mode)=>{[x,z]=nearFree(x,z);const n=sp(id,cl,zone,{x,z,a,mode,house:id,title:L+BR,fem:fm||undefined,lvl:lv()});if(n&&id==='asr')n.roam=1;return n};
      mk(ex,ez-3.4,out*PI/2,'idle');mk(ex,ez+3.4,out*PI/2,'idle');const qx=b.ex+out*3,qz=ez+(id.length%2?5.4:-5.4);for(let i=0;i<3;i++){const t=.5+i/3*TAU,x=qx+Math.cos(t)*.95,z=qz+Math.sin(t)*.95;mk(x,z,Math.atan2(qx-x,qz-z),'chat')}}
    const Y=YARDS[id],D=YDEF[id];if(Y&&D){yardPlayers(Y,'p',D.p,cl,id,L);yardPlayers(Y,'d',D.d,cl,id,L);
      for(const[dx,dz]of D.p+D.d>=4?[[3.4,-.6],[-3.8,.5]]:[[3.4,-.6]]){const x=Y.cx+dx,z=Y.cz+dz;{const n=sp(id,cl,Y.zone,{x,z,a:Math.atan2(Y.cx-x,Y.cz-z),mode:'idle',house:id,title:L+BR,fem:fm||undefined,lvl:lv()});if(n&&id==='asr')n.roam=1}}}
    if(!fm&&id!=='lxa')gargoyle(F,b);if(typeof housePledges==='function')housePledges(F,b)}}
/* V229 campus population x4: AMBX = real character rigs (x2, each one costs memory and draw time); CROWD.EXTRA (21h) fills the rest with cheap virtual people so the total is x4 */
const AMBX=(()=>{try{return/[?&]fast\b/.test(location.search)?.5:2}catch(e){return 2}})();   /* V295 ?fast (test server): a quarter of the ambient crowd */
function spawnAll(){
  const SP=[['legacies','greekN',4],['legacies','lake',8],['townies','lake',10],['activists','lake',6],['athletes','ath',10],['athletes','quad',4],['studentgov','quad',9],['activists','quad',6],['legacies','quad',4],['townies','heights',5],['activists','down',2],['townies','down',9],['sororities','greek',5],['sororities','quad',6],['brothers','greek',4],['police','quad',2],['police','greek',1],['police','ave',1],['ra','greek',2],['ra','quad',1],['cops','down',2],['studentgov','quad',8],['activists','quad',6],['athletes','quad',5],['sororities','quad',7],['legacies','quad',5],['townies','quad',4],['athletes','ath',6],['studentgov','ath',3],
    /* V184 more townies off campus: Clifton Heights, the Calhoun/U-Square strip, downtown and the Lake District */['townies','heights',9],['townies','ave',5],['townies','down',9],['townies','lake',12]];
  for(const[cl,z,k]of SP)for(let i=0;i<k*AMBX;i++){const n=spawn(cl,z,{house:cl==='brothers'?'asr':cl==='sororities'?pick(['dlp','tz']):cl==='legacies'&&z==='greekN'?'kto':undefined});n.amb=1;n.zone=z}
  for(let k=0;k<22*AMBX;k++){const zone=k<14*AMBX?pick(['quad','greek','down','quad','quad','ath']):pick(['heights','down','lake','down']);const cl=k<14*AMBX?pick(CLQ.filter(c=>c!=='legacies')):'townies';const[cx,cz]=spotIn(ZN[zone]);for(let i=0;i<2;i++){const a=i*PI,x=cx+Math.cos(a)*.9,z=cz+Math.sin(a)*.9;if(freeAt(x,z,.4)){const n=spawn(cl,zone,{x,z,mode:'chat',a:Math.atan2(cx-x,cz-z)});n.amb=1;n.zone=zone;n.ambPair=k}}}
  for(const d of NAMED){let dx_=d.x,dz_=d.z;if(d.int&&INT[d.int]){dx_+=INT[d.int].x0;dz_+=INT[d.int].z0}const n=spawn(d.cl,d.int||d.zone||'greek',{x:dx_,z:dz_,a:d.a,name:d.name,title:d.title,lvl:d.lvl,shirt:d.shirt,sleeve:d.sleeve,pants:d.pants,hair:d.hair,skin:d.skin,fem:d.fem||false,scale:d.scale,pin:d.pin,prop:d.prop,house:d.house,noLetters:d.noLetters,named:1,mode:d.mode||'idle'});n.minCh=d.ch||1;NN[d.id]=n;/* V173: a pinned pledge placed on or against a wall (house layouts vary) is moved to the nearest clear spot, home position included */if(d.pin&&!d.throne&&!freeAt(n.x,n.z,.3)){const q=nearFree(n.x,n.z,.36);if(q[0]!==n.x||q[1]!==n.z){n.x=n.hx=n.tx=q[0];n.z=n.hz=n.tz=q[1];n.g.position.set(q[0],terrH(q[0],q[1]),q[1])}}if(d.throne)throneSit(n);if(d.pclass){n.pclass=1;n.prole=d.prole;n.homeInt=n.int;n.rt=5+rnd()*20;{const pre=new Set();n.g.traverse(o=>pre.add(o));addRoleProp(n);n.roleMeshes=[];n.g.traverse(o=>{if(!pre.has(o))n.roleMeshes.push(o)})}}}
  
  for(const[id,cl,L,pres]of CHAPTERS){const I=INT[id],fem=cl==='sororities';if(pres)spawn(cl,id,{house:id,x:I.x0+24,z:I.z0+24,a:0,mode:'idle',named:1,fem,name:pres,title:L+' Chapter President',lvl:10,greet:'"You\'re standing in my house. Make it quick."'});for(const role of OFFICERS)spawn(cl,id,{house:id,fem,name:(fem?pick(FN):pick(MN))+' '+String.fromCharCode(65+Math.floor(rnd()*26))+'.',title:L+' '+role,lvl:6+Math.floor(rnd()*4),officer:1});
    if(INT[id+'_up']){for(let i=0;i<3;i++)spawn(cl,id,{house:id,title:L+' Brother',lvl:3+Math.floor(rnd()*3)});for(let i=0;i<3;i++)spawn(cl,id+'_up',{house:id,title:L+' Brother',lvl:3+Math.floor(rnd()*3)})}}
  spawnLXA();spawnFrats();turfReset();spawnHughes();
  for(const id in RES)for(const[cl,k]of RES[id])for(let i=0;i<k;i++){if(cl==='pledge')spawn('brothers',id,{house:'asr',prop:1,pin:1,pledge:1,title:'ΑΣΡ Pledge',name:'Pledge '+pick(MN),lvl:1+Math.floor(rnd()*3)});else spawn(cl,id,{house:HOUSE[id.replace(/_up$/,'')]?id.replace(/_up$/,''):undefined})}
  for(const id in INT){const I=INT[id];for(const[cl,x,z,a,o]of I.staff)spawn(cl,id,Object.assign({x:I.x0+x,z:I.z0+z,a,mode:'idle',named:1},o))}
  // nobody starts the day stuck inside a tree or a wall
  for(const n of NP){if(n.int||n.statue||freeAt(n.x,n.z,.3))continue;let done=0;for(let r=.5;r<6&&!done;r+=.5)for(let k=0;k<12;k++){const a=k/12*TAU,x=n.x+Math.cos(a)*r,z=n.z+Math.sin(a)*r;if(freeAt(x,z,.35)){n.x=n.hx=x;n.z=n.hz=z;n.g.position.set(x,terrH(x,z),z);done=1;break}}};try{crowdInit()}catch(e){console.warn('crowdInit',e)}try{roadClearAll()}catch(e){console.warn('roadClearAll',e)}}


// ================================================================ V124/V129 Hughes Correctional Institute's crowd (the building is built in 11b-hughes.js).
// Grown men and women enrolled at this famously strict academy (rich parents, second chances, career changes) hang out on the front lawn, each with their own lines.
// They are adults: ordinary NPCs who can be talked to, flirted with, insulted and fought like anyone else.
const HUK=[['Hughes Night Student',{glasses:1,sleeve:0xefe9dc},["I'm getting my diploma at forty-one. Don't laugh.","Night classes, day job. Sleep is a rumor.","The tuition here is wild.","I used to run a hedge fund. Now I run laps at recess."]],
  ['Hughes Weightroom Regular',{shirt:0x9c1b26,sleeve:0xf2ead8},["The yard has the best bench press in Clifton.","You lift? You should lift.","Rec time is the only good part of the day.","Yard time is at three. Do not be late to yard time."]],
  ['Hughes Theater Program',{shirt:0x1d1d22,sleeve:0x1d1d22,pants:0x3a3a44},["Rehabilitation through Shakespeare. I'm Lady Macbeth.","All the world's a stage. Especially the front steps.","The dean loved our Hamlet. Gave us an extra recess.","Is the tower haunted? I hope it's haunted."]],
  ['Hughes Commuter',{cap:0x2a2a30,shirt:0x4a5a6a,sleeve:0x4a5a6a,pants:0x3d4a5a},["Forty minutes each way on the 17 bus.","Hall monitors check our passes twice an hour.","They call it a campus. It has a fence. Very exclusive.","Ever see a school with a check-in window? Now you have."]],
  ['Hughes Honor Student',{glasses:1,shirt:0xe8e2d2,sleeve:0xb3212c},["Good behavior gets you library time.","I've read every book in this building. Twice.","My family pays for the private wing. It has carpet.","I color-code my planner. It's a system."]],
  ['Hughes Senior',{},["Graduation is in May. Allegedly.","I've been a 'senior' here for six years.","Is a frat basically a group project that never ends?","College guy! What's it actually like out there?"]],
  ['Hughes Choir',{shirt:0xb3212c,sleeve:0xf2ead8,cap:0xb3212c},["Choir practice at six AM. Mandatory.","We sang so loud at assembly a window rattled.","Baritone section is the best section. Fact."]],
  ['Hughes Class President',{shirt:0x2e3b5a,sleeve:0x2e3b5a},["Class president gets to stand on the lawn. Perks.","They gave me my phone back for an hour. I'm on four percent.","The WiFi in this building is older than the tower."]]];
// V129 Hughes Correctional Institute (a fictional facility in the old school building): its crowd looks like everyone else on campus
const huLook=o=>Object.assign({skin:pick(SKIN),hair:pick(HAIR)},o);
function spawnHughes(){for(let i=0;i<13;i++){const[t,o,lines]=HUK[i%HUK.length];spawn('hughes','hughes',huLook(Object.assign({title:t,lines,scale:.97+rnd()*.06},o)))}
  for(let k=0;k<2;k++){const[cx,cz]=spotIn(ZN.hughes);for(let i=0;i<2;i++){const a=i*PI,x=cx+Math.cos(a)*.9,z=cz+Math.sin(a)*.9,[t,o,lines]=HUK[(k*2+i+3)%HUK.length];if(freeAt(x,z,.4))spawn('hughes','hughes',huLook(Object.assign({x,z,mode:'chat',a:Math.atan2(cx-x,cz-z),title:t,lines,scale:1},o)))}}
  spawn('staff','hughes',{skin:0x4a2f20,hair:0x151515,x:huX(64.6),z:huZ(15.4),a:PI/2,mode:'idle',name:'Officer Pruitt',title:'Hughes Correctional Institute Security',lvl:5,shirt:0x23272f,sleeve:0x23272f,pants:0x23272f,greet:'"Visitors sign in at the front window. You here to tour the school?"'})}
// V294 Preston Vanderhall (ΚΘΩ president) has one fixed look in every chapter: brown hair, the same skin as his chapter 5 cameo, a KΘΩ polo when he's in house colours
function presLook(o){if(!o||o.name!=='Preston Vanderhall')return o;o=Object.assign({hair:0x8a6a4a,skin:SKIN[1]},o);if(o.house==='kto')o.look=Object.assign({cl2:'polo'},o.look||{});return o}
