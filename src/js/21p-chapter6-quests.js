// ================================================================ V131 CHAPTER 6 · THE COALITION, part 2: scenes, quests
// ---------------------------------------------------------------- shared scene wrapper: camera on, run, camera off (errors never strand the player)
async function c6Cine(run,done,o={}){try{if(o.fade)await c4Fade(async()=>{c4CamOn();await o.fade()});else c4CamOn();$('cineskip').hidden=!!o.noskip;await run()}catch(e){console.warn('c6Cine',e)}c1Sub(null);if(o.after)try{o.after()}catch(e){}c4CamOff();if(done)done()}
const c6Pt=(x,z,dx,dz)=>[x+dx,z+dz];
// the real (named) Grant sits on the throne: keep him out of the scenes where he is missing or a frog
function c6GrantHide(on){const n=NN&&NN.grant;if(!n)return;n.hidden=on?1:0;if(n.g)n.g.visible=!on}

// ---------------------------------------------------------------- chapter 6 opening: the Alliance falls apart
CHSCENE[6]=async function(){const fade=$('fade');fade.style.opacity=1;await c4Sl(500);endScene();C1.act=[];if(P.inside)goOut(78,70);c4At(17.5);c4CamOn();
  // Greek Row: houses arguing in the street
  const a=c5Greek(72,96,PI/2,'sae',{tag:'c6open',pup:1,armor:false,name:'Beau Lancaster',title:'ΣΑΕ President'}),b=c5Greek(75,96,-PI/2,'lxa',{tag:'c6open',pup:1,armor:false,name:'Hunter Shaw',title:'ΛΧΑ President'}),c=c5Greek(73.5,98.4,PI,'tchi',{tag:'c6open',pup:1,armor:false,name:'Cade Whitmore',title:'ΘΧ President'});
  c4Shot([80,3,104],[73.5,1.4,96],0);fade.style.opacity=0;big('CHAPTER 6 · THE COALITION',2800);await c4Wt(2.2);
  await c6Lines([[a,'ΣΑΕ lost its whole back porch. Where was the Alliance for that?',2.6],[b,'Where was ΣΑΕ when Hughes was in OUR basement?',2.6],[c,'The Pact was for the war. The war\'s over. ΘΧ is out.',2.6]]);
  c1Sub('','The Greek Alliance lasted eleven days.');await c4Wt(2.6);c1Sub(null);
  // the Alliance banner comes down off the ΑΣΡ house
  if(C5.ban){c4Shot([80,3.5,80],[91,4,76],1.2);await c4Wt(1);const o=C5.ban;let t=0;c5Anim(dt=>{t+=dt;o.position.y-=dt*3.5;o.rotation.z+=dt*.8;if(t>1.2){c5Banner(0);return 1}});await c4Wt(1.6)}
  // night: three presidents on the ΑΣΡ porch
  await c4Fade(async()=>{c4Off('c6open');c4At(22);c4DanAt(84,79.5,PI/2);const g=c6Pres('Grant Ashby',88.4,75,-PI/2,{tag:'c6open'}),d=c6Pres('Derek Vance',88.4,77,-PI/2,{tag:'c6open'}),s=c6Pres('Silas Okoro',88.4,73,-PI/2,{tag:'c6open'});C6.o={g,d,s};c4Shot([82,1.9,74.5],[88.4,1.6,75],0)});
  const{g,d,s}=C6.o;await c6Lines([[s,'Every house is out for itself again. Give it a month and we\'re all back to fighting over parking.'],[d,'Not all of us. ΔΤΩ doesn\'t forget who showed up.'],[g,'Then stop being three houses. One brotherhood. One set of letters. We stop competing for this campus and we start running it.'],
    [d,'Three houses.'],[s,'One coalition.'],[g,'No one above us.']]);c4Shot([84,2.4,82],[88,1.5,75],1);await c4DanSay('(Grant Ashby and Derek Vance just agreed on something. Write the date down.)',3);
  await c4Fade(async()=>{c4Off('c6open');c4CamOff()});c5Next('c6three');saveGame()};

// ---------------------------------------------------------------- quest a scenes
async function c6MeetCine(done){await c6Cine(async()=>{const[cx,cz]=C6RAM,o={tag:'c6meet'};const g=c6Pres('Grant Ashby',cx-1.6,cz-1.6,PI*.25,o),d=c6Pres('Derek Vance',cx+1.6,cz-1.6,-PI*.25,o),s=c6Pres('Silas Okoro',cx,cz-3,0,o);c4DanAt(cx,cz+1.6,PI);
  c4Shot([cx+5,2.2,cz+4],[cx,1.4,cz-1.6],0);await c4Wt(.6);await c6Lines([[g,'Danny. You know Derek.'],[d,'He beat my house in a tug-of-war and dragged me out of a burning street. Yeah, I know him.'],[s,'Silas Okoro. Gamma Gamma Eta. You\'re the pledge who talked Beau Lancaster onto a bus.'],
    [g,'Here\'s the deal. Three presidents, one vote each. Nothing passes without two of us. You\'re going to be the one who actually makes it happen.'],[DANNY,'So… I\'m the intern.'],[s,'You\'re the coalition coordinator. It sounds better on a résumé.']])},done,{after:()=>c4Off('c6meet')})}
async function c6AnnounceCine(done){await c6Cine(async()=>{const[cx,cz]=C6RAM;c6Stage(1);const y=terrH(cx,cz-4)+.4,o={tag:'c6ann',y};const g=c6Pres('Grant Ashby',cx-1.6,cz-4,0,o),d=c6Pres('Derek Vance',cx,cz-4,0,o),s=c6Pres('Silas Okoro',cx+1.6,cz-4,0,o);
  c6Crowd(1,c6Rows(cx,cz+1.6,PI,10,4),'c6ann',[0x7d1f2c,0x2a6a8a,0x2f7a3a]);const v=c6Vin(cx+3.4,cz+1.2,PI,{tag:'c6ann',shirt:0x7d1f2c,sleeve:0x7d1f2c,house:'asr'});c4DanAt(cx-4,cz,PI*.85);
  c4Shot([cx,5,cz+11],[cx,2,cz-4],0);big('THE COALITION',2200);await c4Wt(2.4);c4Shot([cx-1,2.2,cz+4.2],[cx,2.2,cz-4],1.4);
  await c6Lines([[g,'Alpha Sigma Rho.'],[d,'Delta Tau Omega.'],[s,'Gamma Gamma Eta.'],[g,'As of tonight we are one brotherhood. Same letters. Same colors. Same house, three addresses.'],[d,'Delta. Gamma. Rho.'],
    ()=>{c4Roar();for(const C of C6.crowds)C.data.forEach(q=>q.amp=.12)},[s,'Three Houses. One Coalition.'],[null,''],]);c4Shot([cx+5,1.8,cz+3],[cx+3.4,1.5,cz+1.2],1.4);c1Say(v,'NO ONE ABOVE US!',2.2);await c4Wt(2.2);c1Sub('','One voice in the crowd is louder than all the others.');await c4Wt(2.6);
  c4Shot([cx-1,2.2,cz+4.2],[cx,2.2,cz-4],1.2);await c1Line(g,'Who was that? I like that guy.')},done,{after:()=>{c4Off('c6ann');c6Crowd(0);c6Stage(0)}})}
// new shirts: two brothers per house trade their old letters for ΔΓΡ
const C6SHIRT=[['sh_tank','asr','tank','Tank Hale','"Navy? Huh. It\'s slimming. Don\'t tell anybody I said that."'],['sh_owen','asr','owen','Owen Park','"Hoodie AND a shirt? Do I get to keep the old one? …I\'m keeping the old one."'],
  ['sh_cody','kto',null,'Cody Vance','"Derek\'s cousin. Yeah. Everybody asks. Hand me an XL."'],['sh_eli','kto',null,'Eli Strand','"Delta Gamma Rho. Delta Gamma Rho. I have to practice saying it or I\'ll keep saying Tau."'],
  ['sh_mason','gwz',null,'Mason Pratt','"Silas said this was coming. He didn\'t say it was this soft."'],['sh_will','gwz',null,'Andre Okafor','"Gold letters. Classy. Gamma Gamma Eta approves."']];
function c6ShirtCast(){c4Off('c6sh');const d=c5S().d;C6SHIRT.forEach(([k,id,dup,nm],i)=>{if(d[k])return;const[x,z]=c6Lawn(id,(i%2?2.2:-2.2),6.5),a=c6Face(id,x,z),house={asr:'asr',kto:'dto',gwz:'gge'}[id];const n=dup?c4Dup(dup,x,z,a,{tag:'c6sh',pup:1,int:null}):c5Greek(x,z,a,house,{tag:'c6sh',pup:1,armor:false,name:nm});n.c6k=k})}
function c6GiveShirt(k,fin){const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);const r=C6SHIRT.find(r=>r[0]===k);if(!n){fin();return}c5Talk(n,'Three Houses',r[4],[['Hand over the shirt, the hoodie and the letters',()=>{const x=n.x,z=n.z,a=n.g?n.g.rotation.y:0;despawn(n);c6Poof(x,1.2,z,0x9ab0e0);const m=r[2]?c4Dup(r[2],x,z,a,Object.assign({tag:'c6sh',pup:1,int:null},DG)):c6Bro(x,z,a,{tag:'c6sh',name:r[3]});m.c6k=k;if(m.pup)m.pup.st='wave';bubble(m,'ΔΓΡ!',1.6)}]],fin)}
async function c6GatherCine(done){await c6Cine(async()=>{const[cx,cz]=C6FIRE;c4At(21.5);c5Fire(cx,terrH(cx,cz)+.1,cz,1.5,{tag:'c6'});c4Group('c6logs',1,g=>{for(let i=0;i<5;i++){const a=i/5*TAU;c4M(new THREE.CylinderGeometry(.09,.09,1.1,6),0x4a3020,cx+Math.cos(a)*.35,terrH(cx,cz)+.12,cz+Math.sin(a)*.35,g).rotation.set(PI/2,0,a)}});
  c6Crowd(1,c6Ring(cx,cz,3.4,12,2),'c6gath');const o={tag:'c6gath'};const g=c6Pres('Grant Ashby',cx-2.4,cz-1.6,Math.atan2(2.4,1.6),Object.assign({},DG,o)),d=c6Pres('Derek Vance',cx+2.4,cz-1.6,Math.atan2(-2.4,1.6),Object.assign({},DG,o)),s=c6Pres('Silas Okoro',cx,cz-2.8,0,Object.assign({},DG,o)),v=c6Vin(cx+1.6,cz+2.4,PI*1.2,o);c4DanAt(cx-1.8,cz+2.4,PI*.8);
  c4Shot([cx+7,3,cz+6],[cx,1.2,cz],0);big('THE FIRST GATHERING',2200);await c4Wt(2.4);c4Shot([cx-3.4,1.7,cz+3.6],[cx,1.4,cz-1.6],1.4);
  await c6Lines([[g,'Six weeks ago half of us would have thrown the other half off this lawn.'],[d,'Some of us did.'],[s,'To the first night of Delta Gamma Rho.'],()=>{c4Roar(.05)}]);
  c4Shot([cx+3.6,1.6,cz+4.6],[cx+1.6,1.6,cz+2.4],1.4);await c6Lines([[v,'Can I say something? I\'m new. I\'m Vincent. Vincent Cross.'],[v,'I just want to say: this brotherhood doesn\'t belong to any one house. It belongs to every guy standing around this fire. To us.'],()=>{c4Roar(.09,2.4)},
    [g,'…Yeah. What he said.'],[DANNY,'(Everybody is cheering for the new guy. Even Derek.)',3]]);c4Shot([cx-6,4,cz+8],[cx,1,cz],.5);await c4Wt(2.4)},done,{after:()=>{c4Off('c6gath');c6Crowd(0);c4Group('c6logs',0);for(let i=C5.fires.length-1;i>=0;i--)if(C5.fires[i].tag==='c6')c5FireOff(C5.fires[i])}})}

// ---------------------------------------------------------------- quest b scenes and data
const C6COOK=[['ck_grill','Light the grill',[130,82.6],'The grill catches on the third try. Vincent gives you a thumbs-up from across the yard.'],['ck_ice','Ice down the coolers',[133.5,75],'Two bags of ice, forty cans. Vincent already labeled the coolers: ΑΣΡ, ΔΤΩ, ΓΓΗ. "So nobody feels left out."'],
  ['ck_tables','Set up the folding tables',[120.5,70.5],'You set up three tables in a row, one for each house. Vincent pushes them together into one. "There. One table."'],['ck_spk','Plug in the speaker',[124,80.5],'The speaker comes on mid-song. Vincent\'s playlist is called "BROTHERHOOD (NO SKIPS)".']];
function c6CookSet(){c4Group('c6cook',1,g=>{const y=terrH(121,72);for(let i=0;i<3;i++)c4M(bgeo(1.8,.06,.7),mt(0xe8e2d6,.7),119+i*1.9,y+.75,70.5,g);for(const[x,z,c]of[[133.5,74.4,0x2a6aa8],[133.5,75.6,0xb8332e]])c4M(bgeo(.9,.5,.55),mt(c,.6),x,y+.25,z,g);c4M(bgeo(.6,1,.5),mt(0x111111,.5),124,y+.5,80.5,g)})}
const C6INTRO=[['in_asr','asr','Reese Whitford','reese','"Reese. ΑΣΡ, junior."\n\nVincent: "Reese! Danny says you\'re the funniest guy in the house." Reese has never been called funny in his life. He\'s beaming.'],
  ['in_dto','kto','Cody Vance',null,'"Cody. Derek\'s cousin."\n\nVincent: "Cody, your cousin carried this entire Hughes thing. You must be proud." Cody stands up a little straighter.'],
  ['in_gge','gwz','Andre Okafor',null,'"Andre. ΓΓΗ."\n\nVincent: "Andre. Silas talks about you all the time." Andre: "He does?" Vincent: "All the time."']];
function c6IntroCast(){c4Off('c6in');const d=c5S().d;for(const[k,id,nm,dup]of C6INTRO){if(d[k])continue;const[x,z]=c6Lawn(id,-3,7),a=c6Face(id,x,z);const n=dup?c4Dup(dup,x,z,a,Object.assign({tag:'c6in',pup:1,int:null},DG)):c6Bro(x,z,a,{tag:'c6in',name:nm});n.c6k=k}
  if(!C4.cast['Vincent Cross']||!c4Live(C4.cast['Vincent Cross']))C6.vin=c6Vin(P.x+1.4,P.z+1.4,0,{tag:'c6in',v:4.6});else C6.vin=C4.cast['Vincent Cross']}
function c6VinFollow(){const v=C6.vin;if(!c4Live(v)||!v.pup)return;const d=Math.hypot(P.x-v.x,P.z-v.z);if(d>2.2)c4To(v,P.x-Math.sin(P.face)*1.6,P.z-Math.cos(P.face)*1.6,Math.min(6.5,2+d));if(d>40){v.x=P.x-1.5;v.z=P.z-1.5}}
const C6REC=[['rc1','A freshman with a skateboard','"Is it like a real fraternity or is it one of those fake ones?"\n\nVincent: "It\'s three real ones. That\'s the point." The kid signs.'],['rc2','A transfer student','"I heard you guys fought a prison."\n\nVincent: "We fought FOR each other. The prison was just there." She signs. Then her roommate signs.'],
  ['rc3','A sophomore in a lacrosse pinnie','"What\'s in it for me?"\n\nVincent: "Two hundred brothers who\'ll pick up the phone at 3 a.m." He signs. He doesn\'t even read the form.'],['rc4','A guy who just wants the free pizza','He takes three slices. Vincent hands him a pen anyway. He signs. He looks confused about why he signed.']];
function c6RecruitCast(){c4Off('c6rec');const[cx,cz]=C6QUAD;c6Table('c6recruit',cx,cz,0,'ΔΓΡ RUSH · SIGN UP');const d=c5S().d;C6REC.forEach(([k,nm],i)=>{if(d[k])return;const[x,z]=c3Free(cx-4+i*2.6,cz+4.5),n=c4Pup(i%2?'athletes':'townies',x,z,PI,{tag:'c6rec',name:nm,title:'Freshman',lvl:2,fem:i===1});n.c6k=k});
  {const[x,z]=c3Free(cx+.6,cz-1);c6Vin(x,z,0,{tag:'c6rec'})}}
async function c6DisputeCine(done){await c6Cine(async()=>{const[cx,cz]=[76,120];const a=c6Bro(cx-1,cz,PI/2,{tag:'c6dis',name:'Brett (ΑΣΡ)',house:'asr'}),b=c6Bro(cx+1,cz,-PI/2,{tag:'c6dis',name:'Eli Strand',house:'dto'});c4DanAt(cx,cz+2.4,PI);
  c4Shot([cx+3.6,1.8,cz+3.4],[cx,1.4,cz],0);await c4Wt(.4);await c6Lines([[a,'The Spring Bash is at ΑΣΡ. It\'s always been at ΑΣΡ. We have the backyard.'],[b,'Your backyard is a parking lot with a grill in it. ΔΤΩ has the old Kappa house. It has a BALLROOM.'],[a,'It has a ballroom that smells like Kappa Theta Omega.']]);
  const r=await new Promise(res=>card({title:'The Perfect Brother',sp:'Two founding houses, one argument',text:'They both look at you. You\'re the coalition coordinator.',focus:DANNY,ch:[['"Split it. Pregame at ΑΣΡ, party at the ballroom."',()=>res(0)],['"Ask the presidents. That\'s what the vote is for."',()=>res(1)],['"Flip a coin."',()=>res(2)]]}));
  c1Sub('',['Neither of them likes the compromise. Both of them start talking at once.','"The presidents? The presidents can\'t agree on pizza toppings," Eli says. Brett nods. That\'s new.','The coin lands in the grass. Both of them claim they won.'][r]);await c4Wt(3);c1Sub(null);
  const v=c6Vin(cx+5,cz-4,-PI*.75,{tag:'c6dis',v:3});c4To(v,cx,cz-1.2,3);c4Shot([cx+2.6,1.8,cz+3],[cx,1.5,cz-.4],1.4);await c4Wt(1.8);c4Look(v,a.x,a.z);
  await c6Lines([[v,'Guys. Guys. Brett, you\'re right about the backyard. Eli, you\'re right about the ballroom.'],[v,'You know who isn\'t right? Whoever decided we needed three presidents to pick a venue.'],()=>{c6Glint(a);c6Glint(b)},[a,'…Honestly, the presidents should have handled this.',2.4],[b,'Honestly, the presidents should have handled this.',2.4],[DANNY,'(They said it in the exact same voice.)',2.8]]);
  // later: Vincent alone on the street, a purple envelope floating down to him out of nowhere
  await c4Fade(async()=>{c4Off('c6dis');c4At(23.2);const v2=c6Vin(cx+8,cz+12,PI,{tag:'c6dis'});C6.v2=v2;c4DanAt(cx-6,cz+20,PI*.8);c4Shot([cx-3,2,cz+18],[cx+8,1.8,cz+12],0)});
  const v2=C6.v2;await c4Wt(1);const env=c4M(bgeo(.24,.02,.16),mt(0xb07aff,.6),v2.x,6,v2.z+.4);let t=0;c5Anim(dt=>{t+=dt;env.position.y=Math.max(1.4,6-t*1.5);env.rotation.y+=dt*3;if(t>3.2){sc.remove(env);return 1}});await c4Wt(2.6);c6Spark(v2.x,1.6,v2.z+.4,0xb07aff,16);
  c1Say(v2,'Right on time.',2);await c4Wt(2.2);await c4DanSay('(Where did that come from?)',2.4)},done,{after:()=>c4Off('c6dis')})}

// ---------------------------------------------------------------- quest c data and scenes
const C6VISIT=[['vs_asr','asr','Check on the ΑΣΡ house','The ΑΣΡ charter is gone from the wall. Just a clean rectangle on the paint where it hung for a hundred years.\n\nOwen: "I didn\'t touch it. Nobody touched it. I was here all night."',()=>c5AP(18,23)],
  ['vs_dto','kto','Check on the ΔΤΩ house','Cody: "Danny! Did we have a meeting yesterday? Derek says we did. I was there? I don\'t remember being there. I remember the pizza."',()=>c6Lawn('kto',0,5)],
  ['vs_gge','gwz','Check on the ΓΓΗ house','Two ΓΓΗ brothers are arguing about chore charts. They don\'t remember what started it. "It\'s the principle," one says. Neither can say which principle.',()=>c6Lawn('gwz',0,5)]];
const C6PARTY=[['pt_lights','String the lights over the backyard',[126,77],'Two hundred bulbs. Vincent holds the ladder.'],['pt_dj','Set up the DJ booth',[124,80.5],'You plug everything in. The speakers are already playing something. You haven\'t pressed play.'],
  ['pt_kegs','Tap the kegs',[131.8,73.2],'Six kegs, three houses. Somebody wrote "NO ONE ABOVE US" on every one in Sharpie.'],['pt_list','Check the guest list with Vincent',[129,70],'Vincent\'s guest list is perfect: every brother, every sorority, every alum. One line at the very bottom has been scribbled out so hard the pen went through the paper.']];
async function c6PartyCine(done){await c6Cine(async()=>{const cx=126,cz=74;c4At(22.5);c6Party(1);c6Crowd(1,[...c6Ring(cx,cz,3.6,16,3)],'c6party',[0x1b2e57,0x1b2e57,0xe2b64c,0xb84a76,0xf2f2ee]);const o=Object.assign({tag:'c6pty'},DG);
  const g=c6Pres('Grant Ashby',cx-1,cz-1.4,0,o),d=c6Pres('Derek Vance',cx,cz-1.6,0,o),s=c6Pres('Silas Okoro',cx+1,cz-1.4,0,o),b1=c6Bro(cx-2.4,cz+1.6,PI,{tag:'c6pty'}),b2=c6Bro(cx+2.2,cz+1.8,PI,{tag:'c6pty'}),b3=c6Bro(cx,cz+2.6,PI,{tag:'c6pty'});c4DanAt(cx+3.2,cz,-PI/2);
  c4Shot([cx+9,4,cz+8],[cx,1.2,cz],0);big('THE DELTA GAMMA RHO PARTY',2400);let a=0;c4Follow((tp,tl,dt)=>{a+=dt*.2;tp.set(cx+Math.cos(a)*8,3.2,cz+Math.sin(a)*8);tl.set(cx,1.3,cz)},0);for(let i=0;i<3;i++){c4Confetti(cx,terrH(cx,cz)+4,cz,260,6);await c4Wt(1.4)}c4Follow(null);
  c4Shot([cx,1.9,cz+4.6],[cx,1.5,cz-1.4],1.4);await c6Lines([[g,'A toast. To three houses that—'],[b1,'Why do the presidents get to give the toast?',2.2],[b2,'Why do the presidents get to give the toast?',2.2],[b3,'Why do the presidents get to give the toast?',2.4],[d,'…What?'],[s,'Who taught them that?']]);
  c4Shot([cx+4.4,1.7,cz+1],[cx+3.2,1.6,cz],1.2);await c4DanSay('(Three guys from three houses. Same sentence, same words, same second.)',3.2)},done,{after:()=>{c4Off('c6pty');c6Crowd(0);c6Party(0)}})}
const C6FAIRT=[['fr_table','Set up the ΔΓΡ booth',()=>C6FAIR,'Front row of the Activities Fair. Right between the a cappella group and the club that only talks about cheese.'],['fr_banner','Hang the ΔΓΡ banner',()=>[C6FAIR[0]+1.4,C6FAIR[1]-1],'Gold letters, navy vinyl. It looks expensive. Vincent paid for it. Nobody knows where he got the money.'],
  ['fr_sheet','Put out the sign-up sheet',()=>[C6FAIR[0]-1.2,C6FAIR[1]],'By noon it has ninety names. By one, the brothers working the booth have started telling freshmen what\'s wrong with the presidents.']];
async function c6FairCine(done){await c6Cine(async()=>{const[cx,cz]=C6FAIR;const b=[0,1,2].map(i=>c6Bro(cx-1.6+i*1.6,cz-.9,PI,{tag:'c6fair'})),f=[0,1,2].map(i=>c4Pup('townies',cx-1.6+i*1.6,cz+1.6,0,{tag:'c6fair',name:'Freshman',lvl:2,fem:i===1}));c4DanAt(cx+3.4,cz+.4,-PI/2);
  c4Shot([cx+4.4,1.8,cz+3],[cx,1.4,cz],0);await c4Wt(.6);await c6Lines([[f[0],'So who\'s in charge?',1.8],[b[0],'The presidents. For now. They never ask us anything.',2.6],[f[1],'Who\'s in charge?',1.6],[b[1],'The presidents. For now. They never ask us anything.',2.6],[f[2],'Is it, like, a dictatorship?',1.8],[b[2],'The presidents. For now. They never ask us anything.',2.6],
    ()=>{b.forEach(c6Glint)},[DANNY,'(It\'s word for word. Every time.)',2.6]])},done,{after:()=>c4Off('c6fair')})}
function c6UnionSet(){c4Off('c6u');const I=INT.union,cx=I.x0+22,cz=I.z0+9.5,o={tag:'c6u',int:'union'};c4Group('c6table',1,g=>{c4M(bgeo(5.4,.08,1.6),0x6a4a2a,0,.78,0,g);for(const q of[[-2.5,-.7],[2.5,-.7],[-2.5,.7],[2.5,.7]])c4M(bgeo(.08,.78,.08),0x3a2614,q[0],.39,q[1],g)}).position.set(cx,0,cz);
  const g=c6Pres('Grant Ashby',cx-3.2,cz,PI/2,Object.assign({},DG,o)),d=c6Pres('Derek Vance',cx-1,cz-1.5,0,Object.assign({},DG,o)),s=c6Pres('Silas Okoro',cx+1,cz-1.5,0,Object.assign({},DG,o));const br=[];for(let i=0;i<5;i++){const[x,z]=c3Free(cx-2+i,cz+1.7);br.push(c6Bro(x,z,PI,Object.assign({int:'union'},o)))}C6.u={g,d,s,br,cx,cz};return C6.u}
async function c6JointCine(done){await c6Cine(async()=>{const U=c6UnionSet();c4DanAt(...c3Free(U.cx+3.4,U.cz+.4),-PI/2);c4Shot([U.cx+3.6,2.3,U.cz+3.6],[U.cx-.6,1.3,U.cz],0);await c4Wt(.5);
  await c6Lines([[U.s,'First item: the alumni dinner. Danny, the contracts?'],[DANNY,'They were in the folder. I put them in the folder. The folder\'s empty.',2.8],[U.d,'Second item, then. The budget—'],[U.br[0],'Who approved this budget?',2],[U.br[2],'Who approved this budget?',2],[U.g,'WE did. Last week. All of you were here.'],
    [U.br[3],'I don\'t remember that.',1.8],[U.br[1],'I don\'t remember that either.',1.8],()=>{c4Roar(.05,1.4);for(const n of U.br)if(n.pup)n.pup.st='talk'},[U.d,'This is the third meeting in a row that turns into this.'],[U.g,'Meeting adjourned. Everybody go home.']]);
  c4Shot([U.cx+2.6,1.7,U.cz+2.2],[U.cx+3.4,1.6,U.cz+.4],1.2);await c4DanSay('(Missing papers. Missing memories. The same complaint in every mouth. This isn\'t normal.)',3.6)},done,{after:()=>{c4Off('c6u');c4Group('c6table',0)}})}

// ---------------------------------------------------------------- quest d
async function c6LeaderMtg(done){await c6Cine(async()=>{const I=c5AI();const W=(x,z)=>c3Free(I.x0+x,I.z0+z),o={tag:'c6lm',int:'asr'};const v=c6Vin(...W(11,24.6),0,o);const ppl=[];for(let i=0;i<9;i++)ppl.push(c6Bro(...W(7.5+(i%5)*1.8,28+Math.floor(i/5)*1.6),PI,Object.assign({int:'asr'},o)));c4DanAt(...W(16.5,27.4),-PI*.7);
  c4Shot([I.x0+15,2.2,I.z0+30.5],[I.x0+11,1.5,I.z0+24.6],0);big('BROTHERHOOD MEETING',2000);await c4Wt(2);
  await c6Lines([[v,'Nobody here is against the presidents. I want to be really clear about that.'],[v,'But Delta Gamma Rho belongs to its members. Not to three guys who signed a piece of paper on a porch.'],()=>{c4Roar(.06,1.6);ppl.forEach((n,i)=>{if(n.pup&&i%2)n.pup.st='wave'})},
    [ppl[2],'Members should elect the leadership!',2.2],[ppl[5],'One brother, one vote!',2.2],[v,'I\'m not saying anything. I\'m just saying we should talk about it.'],[DANNY,'(He says "I\'m not saying anything" and then everybody says it for him.)',3.2]])},done,{after:()=>c4Off('c6lm')})}
const C6OPIN=[['op1','asr','Tank Hale','tank','"Grant\'s great. Grant\'s my guy. But honestly? They forgot who this brotherhood belongs to."'],['op2','kto','Cody Vance',null,'"Derek\'s my cousin. I love him. They forgot who this brotherhood belongs to."'],
  ['op3','gwz','Mason Pratt',null,'"Silas? Silas is the best of them. But they forgot who this brotherhood belongs to."'],['op4','asr','Brett','brett','"…They forgot who this brotherhood belongs to." He blinks. "Why did I say that? I was going to say something about pizza."']];
function c6OpinCast(){c4Off('c6op');const d=c5S().d;C6OPIN.forEach(([k,id,nm,dup],i)=>{if(d[k])return;const[x,z]=c6Lawn(id,i===3?3:-1.5,6),a=c6Face(id,x,z);const n=dup?c4Dup(dup,x,z,a,Object.assign({tag:'c6op',pup:1,int:null},DG)):c6Bro(x,z,a,{tag:'c6op',name:nm});n.c6k=k})}
async function c6PresMtg(done){await c6Cine(async()=>{const b=B.find(b=>b.id==='gwz'),[ex,ez]=fpos(b,b.face,b.da,6),o={tag:'c6pm'};c4At(23);const g=c6Pres('Grant Ashby',ex-1,ez-1,0,Object.assign({},DG,o)),d=c6Pres('Derek Vance',ex+1,ez-1,0,Object.assign({},DG,o)),s=c6Pres('Silas Okoro',ex,ez+1.4,PI,Object.assign({},DG,o));c4DanAt(ex-2,ez+1.2,PI/2);
  c4Shot([ex-4.4,1.8,ez+2.6],[ex,1.4,ez],0);await c4Wt(.4);await c6Lines([[s,'I pulled Vincent\'s rush file. There isn\'t one.'],[d,'There has to be. Somebody bid him.'],[s,'Nobody remembers bidding him. Nobody remembers his first day. Ask anybody when they met Vincent and they say "I feel like he\'s always been here."'],
    [g,'Danny\'s right. This is organized. The same words, the missing contracts, the meetings.'],[d,'Organized by who? A sophomore with a nice smile? That\'s not a crime.'],[g,'Then we find something that is.']])},done,{after:()=>c4Off('c6pm')})}
async function c6Confront(done){await c6Cine(async()=>{const[cx,cz]=C6RAM;c4At(23.5);const v=c6Vin(cx,cz-2.2,0,{tag:'c6cf'});c4DanAt(cx,cz+.8,PI);c4Shot([cx+2.6,1.7,cz+1.6],[cx,1.5,cz-2.2],0);await c4Wt(.4);
  await c1Line(v,'Danny. Out here at midnight. You want to talk about the presidents.');
  const r=await new Promise(res=>card({title:'The Brotherhood\'s Favorite',sp:'Vincent Cross · ΔΓΡ Brother',text:'He\'s smiling. He\'s been smiling the whole time.',focus:v,ch:[['"Everybody says the same thing about them. Word for word. Why?"',()=>res(0)],['"Nobody remembers bidding you, Vincent."',()=>res(1)],['"Whatever you\'re doing, stop."',()=>res(2)]]}));
  await c6Lines([[v,['Because it\'s true, Danny. When something\'s true, everybody notices it at once.','I\'m very memorable. People just forget the boring parts.','I\'m not doing anything. I\'m just the guy everybody likes. You should try it.'][r]],[v,'Get some sleep. You look like you haven\'t been sleeping.']]);
  c4Shot([cx+.8,1.6,cz-.4],[cx,1.65,cz-2.2],1.6);await c4Wt(.8);c6Glint(v);c1Sub('','For half a second, his eyes are purple.');await c4Wt(2.4);c1Sub(null);c4Shot([cx+2.6,1.7,cz+1.6],[cx,1.5,cz],1.2);await c4DanSay('(…Was that real?)',2.2)},done,{after:()=>c4Off('c6cf')})}

// ---------------------------------------------------------------- quest e
async function c6UprisingCine(done){await c6Cine(async()=>{c4At(20.5);const cx=78,cz=76;c6Crowd(1,c6Rows(cx,cz,PI/2,9,5,1.05).map(s=>[s[0]-3,s[1],PI/2]),'c6up');const o=Object.assign({tag:'c6upr',y:terrH(89,76)+.6},DG);
  const g=c6Pres('Grant Ashby',88.6,74.5,-PI/2,o),d=c6Pres('Derek Vance',88.6,76.2,-PI/2,o),s=c6Pres('Silas Okoro',88.6,77.9,-PI/2,o);const v=c6Vin(80.5,79.6,PI/2,{tag:'c6upr'});c4DanAt(84,82.5,PI*.9);
  c4Shot([70,4.5,76],[88,2,76],0);big('EMERGENCY MEETING',2200);await c4Wt(2.2);c4Shot([84,2.3,71.5],[88.6,2,76],1.4);
  await c6Lines([[g,'We called this meeting so we can talk like brothers—'],[null,''],()=>{c4Roar(.1,2)}]);
  for(const L of['RESIGN!','THE MEMBERS DECIDE!','NO ONE ABOVE US!']){c1Sub('Two hundred brothers',L);c4Roar(.08,1.2);await c4Wt(1.6)}c1Sub(null);
  await c6Lines([[d,'We BUILT this! Three weeks ago none of you had these letters!'],[s,'Everybody calm down. Please.'],[null,'']]);
  c4Shot([82.5,1.8,81.5],[80.5,1.6,79.6],1.3);await c4Wt(.6);c1Say(v,'Brothers! Let\'s hear them out!',2.2);await c4Wt(1.4);c6Glint(v);c4Roar(.12,2.4);c1Sub('','He says "hear them out". The crowd surges forward anyway.');await c4Wt(2.4);
  c4Shot([72,3.5,70],[88,1.8,76],1.2);for(const n of[g,d,s])if(n.pup){c4To(n,94+rnd(),70+rnd()*12,3)}await c4Wt(2.4);await c4DanSay('(Vincent is the only one not shouting. He doesn\'t need to.)',3)},done,{after:()=>{c4Off('c6upr');c6Crowd(0)}})}
const C6FIND=[['fd_g','Grant Ashby','asr',()=>c5AP(24,4),'Grant is in the throne room with the door barricaded by a couch.\n\n"They voted me out of my own house, Danny. MY house. A vote I didn\'t call." He laughs. It isn\'t a good laugh.'],
  ['fd_d','Derek Vance','kto',()=>c6Lawn('kto',2,4.5),'Derek is on the ΔΤΩ porch. Someone spray-painted "NO ONE ABOVE US" across the door.\n\n"My own cousin did this. He doesn\'t even know why. I asked him and he just said it again."'],
  ['fd_s','Silas Okoro','gwz',()=>c6Lawn('gwz',-2,4.5),'Silas is sitting on the ΓΓΗ steps with his phone.\n\n"I have four hundred unread messages and they all say the same thing." He shows you. They do.']];
function c6FindCast(){c4Off('c6fd');const d=c5S().d;for(const[k,nm,id,at]of C6FIND){if(d[k])continue;const p=c5At(at()),n=nm==='Grant Ashby'?c4Dup('grant',p.x,p.z+1.2,PI,Object.assign({tag:'c6fd',pup:1,int:p.int||undefined},DG)):c6Pres(nm,p.x,p.z,c6Face(id,p.x,p.z),Object.assign({tag:'c6fd'},DG));n.c6k=k}}
const C6HOLD=[['ho1','A ΔΓΡ brother at the library',[172.3,141],'"Sorry, Danny. I\'m not taking orders from the founding houses anymore. Vincent says we don\'t have to."'],['ho2','A ΔΓΡ brother at the diner',[165,597.5],'"The members decide now." He says it to his pancakes. "The members decide now."'],
  ['ho3','A ΔΓΡ brother outside the Union',[204,127],'He\'s handing out flyers. Every flyer has the same three words printed in gold: NO ONE ABOVE US. The ink is still warm. There\'s no printer anywhere.']];
function c6HoldCast(){c4Off('c6ho');const d=c5S().d;C6HOLD.forEach(([k,nm,[x,z]])=>{if(d[k])return;const[X,Z]=c3Free(x,z),n=c6Bro(X,Z,PI,{tag:'c6ho',name:nm.replace(/^A /,'').replace(/^ΔΓΡ brother /,'ΔΓΡ brother ')});n.c6k=k})}
const c6Organizer=(x,z,a,o)=>c6Bro(x,z,a,Object.assign({lvl:o.lvl||5,name:pick(MN)+' (ΔΓΡ)',pup:0,int:null},o));
const C6CLUE=[['cl_chat','Read the group chat on a dropped phone',[288,300],'The "ΔΓΡ MEMBERS ONLY" group chat. Two hundred people. One admin: VINCENT CROSS. Every message he sent was deleted a second later, but the replies are still there. All the same reply.'],
  ['cl_flyer','Look at the flyers',[283,309],'The flyers aren\'t printed. They\'re hand-lettered. Two hundred of them, all in the same perfect handwriting. The ink smells like a burnt-out candle.'],
  ['cl_sheet','Check the sign-in sheet',[292,307],'The sign-in sheet for every "spontaneous" protest this week. The first name on every page is the same: V. Cross.']];
async function c6WhoCine(done){await c6Cine(async()=>{const[cx,cz]=C6QUAD;c6Crowd(1,c6Ring(cx,cz,4.5,14,2),'c6who');const v=c6Vin(cx,cz-7,0,{tag:'c6who'});c4DanAt(cx+5.5,cz+3,-PI*.75);
  c4Shot([cx+6.5,1.8,cz+4],[cx,1.6,cz-7],0);await c4Wt(.6);c1Say(v,'This is YOUR brotherhood. Never forget that.',2.8);await c4Wt(2.6);c4Roar(.07,1.6);c4Shot([cx+5.6,1.7,cz+3.8],[cx,1.7,cz-7],1.6);await c4Wt(1);c6Glint(v);
  await c6Lines([[DANNY,'(Every chat, every flyer, every sign-in sheet. Vincent.)',3],[DANNY,'(And nobody else here thinks he\'s doing anything at all.)',3]]);c1Say(v,'Danny! Good to see you, brother!',2.2);await c4Wt(2.2)},done,{after:()=>{c4Off('c6who');c6Crowd(0)}})}

// ---------------------------------------------------------------- quest f
async function c6EmptyThrone(done){await c6Cine(async()=>{const I=c5AI();c6GrantHide(1);c4DanAt(I.x0+24,I.z0+9,PI);c4Shot([I.x0+26,2,I.z0+11],[I.x0+24,1.2,I.z0+3.5],0);c4Group('c6scorch',1,g=>{const m=new THREE.Mesh(new THREE.CircleGeometry(.8,20),new THREE.MeshBasicMaterial({color:0x2a1440,transparent:true,opacity:.75,depthWrite:false}));m.rotation.x=-PI/2;m.position.set(I.x0+24,.03,I.z0+5);g.add(m)});
  await c4Wt(1);await c6Lines([[DANNY,'Grant?',1.6],[DANNY,'(His phone is on the floor. Next to the throne, a burn mark the size of a manhole cover. It smells like lavender.)',3.6]]);
  await c4Phone('Vincent Cross','Brothers: with all three presidents unavailable, emergency meeting on temporary leadership. Union. 7pm. Every voice matters. 💙💛',4200);
  c1Sub('','Derek\'s and Silas\'s phones go straight to voicemail.');await c4Wt(2.6)},done,{after:()=>c6GrantHide(0)})}
async function c6TempLead(done){await c6Cine(async()=>{const I=INT.union,cx=I.x0+22,cz=I.z0+12,o={tag:'c6tl',int:'union'};const v=c6Vin(cx,cz-3.4,0,o);const ppl=[];for(let i=0;i<10;i++){const[x,z]=c3Free(cx-4+(i%5)*2,cz+.5+Math.floor(i/5)*1.6);ppl.push(c6Bro(x,z,PI,Object.assign({int:'union'},o)))}c4DanAt(...c3Free(cx+5,cz+2.4),-PI*.7);
  c4Shot([cx+4,2.4,cz+5],[cx,1.5,cz-3],0);big('TEMPORARY LEADERSHIP',2000);await c4Wt(2);
  await c6Lines([[ppl[0],'I nominate Vincent. As interim chair.',2.4],[ppl[3],'Second!',1.4],[ppl[6],'All in favor!',1.6],()=>{c4Roar(.08,1.6);ppl.forEach(n=>{if(n.pup){n.pup.st='wave';n.pup.arms=null}})},
    [v,'I didn\'t ask for this. I want everybody to know I didn\'t ask for this.'],[v,'But if the brotherhood needs me, I\'ll serve. Temporarily. Until Grant, Derek and Silas are back.'],[DANNY,'(He knows exactly where they are.)',2.6]])},done,{after:()=>c4Off('c6tl')})}
const C6COORD=[['co_asr','Deliver the new chore schedule to ΑΣΡ',()=>c6Door('asr'),'Owen reads the schedule. "Vincent made this? It\'s so fair." Every founding-house brother is on bathroom duty. Every new member has the week off.'],
  ['co_dto','Deliver the new chore schedule to ΔΤΩ',()=>c6Door('kto'),'Cody takes the schedule without reading it. "Interim chair says. So." He shrugs.'],['co_gge','Deliver the new chore schedule to ΓΓΗ',()=>c6Door('gwz'),'Andre pins the schedule to the door. Someone has already pinned an identical copy there. Nobody delivered it.']];
const C6ORD=[['or_tres','Ask the ΔΓΡ treasurer who approved the new spending',()=>c6Lawn('asr',3.5,6),'"Eleven thousand on banners and a fog machine? Vincent said it was approved. By who? He just said approved."'],
  ['or_desk','Check the paperwork in the ΑΣΡ office',()=>c5AP(46,24),'Twenty "official decisions" this week. No votes recorded. Every one initialed in the same tiny, perfect handwriting: V.C.'],['or_alum','Call the alumni chairman',()=>c6Lawn('asr',-3.5,6),'"Vincent? Lovely young man. He called this morning to say the founders had stepped down. I said I\'d send the donation to him directly. Was that wrong?"']];
const C6EVID=[['ev_desk','Search Vincent\'s desk',()=>c5AP(12,8,'asr_up'),'No books. No laptop. A single feather pen and a stack of thick cream paper. One sheet says, in that perfect handwriting: "Payment upon delivery: ONE (1) invitation. Signed in ink. No plus-ones."'],
  ['ev_bed','Look under the bed',()=>c5AP(9,5,'asr_up'),'A wooden box full of dried herbs, a jar of something that moves, and three Polaroids: Grant, Derek and Silas. Each one has a purple circle drawn around the face.'],
  ['ev_map','Check the map on the wall',()=>c5AP(14,3,'asr_up'),'A hand-drawn map of the Lake District. A path from the gate into the east woods, ending at a little drawing of a hut with smoke coming out of it. Next to it: "Tues. Midnight. Bring the three."']];

// ---------------------------------------------------------------- quest g: the hideout
async function c6HutArrive(done){await c6Cine(async()=>{const[hx,hz]=C6HUT;c6Hut(1);c4DanAt(hx-7,hz-10,PI*.25);c4Shot([hx-9,2.2,hz-13],[hx,1.6,hz+1],0);await c4Wt(1.2);c4Shot([hx-4,1.9,hz-7],[hx,1.6,hz+2],1.2);await c4Wt(1.2);
  await c6Lines([[DANNY,'(A stone hut. In the middle of the woods. With purple light coming out of it.)',3],[DANNY,'(Vincent went inside. Then he went out the back. I should look before he comes back.)',3.2]])},done)}
const C6MAG=[['mg_rune','Look at the glowing circle on the floor',c6HutP(0,1.6),'A star inside a circle, drawn in something that glows. The letters around it aren\'t any alphabet you\'ve seen. When you step closer, the brew in the cauldron bubbles faster.'],
  ['mg_books','Look at the floating books',c6HutP(-.4,2),'Four books are floating at eye level, slowly turning. One of them is open to a page titled "PERSUASION, MASS (FOR STUDENT ORGANIZATIONS)".'],
  ['mg_ball','Look into the crystal ball',c6HutP(2.4,2.7),'Inside the crystal ball: the ΑΣΡ living room, live. Tank is eating cereal on the couch. He looks right at you, and doesn\'t see you.'],
  ['mg_shelf','Read the shelves',c6HutP(-2.4,2.2),'"Hexes for Beginners." "Memory and How to Misplace It." "Fraternity Life: A Field Guide (1974)." The last one is heavily annotated.']];
async function c6Deal(done){const[hx,hz]=C6HUT,P3=(dx,dz)=>[hx+dx,hz+dz];await c6Cine(async()=>{c6Hut(1);const H=C6.hut;
  const o={tag:'c6deal'};const W=c6Wizard(...P3(0,2.2),PI,Object.assign({},o,{tag:'c6wiz'})),v=c6Vin(...P3(-1.6,.4),PI*.7,o);c4Face(W,Math.atan2(v.x-W.x,v.z-W.z));
  const seats=[[-1.6,3.2],[0,3.5],[1.6,3.2]];seats.forEach(([dx,dz])=>c6Chair(hx+dx,hz+dz,PI));const g=c6Pres('Grant Ashby',...P3(-1.6,3.2),PI,Object.assign({},DG,o)),s=c6Pres('Silas Okoro',...P3(0,3.5),PI,Object.assign({},DG,o)),d=c6Pres('Derek Vance',...P3(1.6,3.2),PI,Object.assign({},DG,o));for(const n of[g,s,d])c6Tie(n);
  H.tarp.visible=true;c4DanAt(...P3(-5,-6),PI*.25);c4Shot([hx-5.6,1.2,hz-6.8],[hx,1.5,hz+2],0);$('cineskip').hidden=true;await c4Wt(.6);c1Sub('','You crouch behind the woodpile and hold your breath.');await c4Wt(2.2);
  c4Shot([hx-2.6,1.7,hz-2.4],[hx-.6,1.7,hz+1.4],1.2);await c6Lines([[W,'You are LATE, Vincent Cross.'],[v,'Traffic. And I had to make sure nobody followed me.'],[W,'Four hundred and twelve years I have waited. You can wait for traffic.'],[v,'And I brought what you asked for.']]);
  // the tarp comes off: the three presidents, tied and gagged
  {let t=0;c5Anim(dt=>{t+=dt;H.tarp.position.x=-t*6;H.tarp.rotation.z=t*1.4;if(t>.6){H.tarp.visible=false;H.tarp.position.x=0;H.tarp.rotation.z=0;return 1}})}c4Shot([hx,1.6,hz-.8],[hx,1,hz+3.3],1.6);await c4Wt(1.2);
  for(const n of[g,s,d]){c1Say(n,'MMMPH!',1.4);await c4Wt(.6)}await c4Wt(.6);await c6Lines([[W,'The three founders. Lovely. Now the fun part.']]);
  // Grant: a frog
  c4Shot([hx-.4,1.6,hz+.8],[hx-1.6,1,hz+3.2],1.4);await c4Wt(.6);W.pup.st='throw';c6Beam(c6Orb(W),[g.x,1.2,g.z]);await c4Wt(.7);c6Poof(g.x,1,g.z,0xb4e0a0);c6Spark(g.x,1,g.z,0x7fe07a);despawn(g);const fy=terrH(g.x,g.z)+.5;const fr=c6Frog(g.x,g.z,PI,fy);await c4Wt(.6);c6FrogSay(fr,'Ribbit?!',1.8);await c4Wt(1.8);
  await c6Lines([[v,'A frog. Classic.'],[W,'He talked too much at your meetings. Frogs only talk at night.']]);
  // Silas: a pile of cocaine
  c4Shot([hx+.4,1.5,hz+.9],[hx,1,hz+3.5],1.4);await c4Wt(.6);W.pup.st='throw';c6Beam(c6Orb(W),[s.x,1.2,s.z],0xf2f2ee);await c4Wt(.7);c6Poof(s.x,1,s.z,0xffffff);const sx=s.x,sz=s.z;despawn(s);
  const pile=c4M(GC.c6pile||(GC.c6pile=new THREE.ConeGeometry(.32,.3,18)),mt(0xf6f6f2,.95),sx,terrH(sx,sz)+.62,sz);c4M(bgeo(.08,.004,.012),mt(0xf6f6f2,.9),sx+.32,terrH(sx,sz)+.495,sz+.1);H.pile=pile;await c4Wt(1.4);
  await c6Lines([[v,'…Is he—'],[W,'Gone, I am afraid. Very pure, though. Ninety-eight percent, at least.'],[v,'You said nobody would get hurt.'],[W,'I said nobody would get hurt who MATTERED. Do try to keep up.']]);
  // Derek: leashed, shirtless, a leather mask
  c4Shot([hx+1,1.6,hz+.7],[hx+1.6,1.1,hz+3.2],1.4);await c4Wt(.6);W.pup.st='throw';c6Beam(c6Orb(W),[d.x,1.2,d.z],0xff4a8a);await c4Wt(.7);c6Poof(d.x,1,d.z,0x2a2a2e);const dx=d.x,dz=d.z;despawn(d);const dl=c6LeashDerek(dx-.6,dz-.8,PI,W);await c4Wt(1);c1Say(dl,'MMMMPH?!',1.8);await c4Wt(1.8);
  await c6Lines([[W,'And this one I keep. Every wizard needs a familiar. The leather is from 1611. Very breathable.'],[v,'I\'m not going to ask.'],[W,'Now. My payment.'],[v,'One invitation to the biggest party of the year. The Delta Gamma Rho Spring Bash. You\'ll have it in your hand tonight.'],[W,'Four hundred and twelve years I have wanted to attend a proper kegger.'],[W,'Do they still do the thing with the funnel?'],[v,'They still do the thing with the funnel.']]);
  // the frog hops out toward the woodpile; Danny grabs him and runs
  c4Shot([hx-5.4,1.3,hz-6.4],[hx-3,.8,hz-3],1.2);let t=0;const f0=[fr.x,fr.z],f1=[hx-4.6,hz-5.4];c5Anim(dt=>{t+=dt;const k=Math.min(1,t/2);fr.x=f0[0]+(f1[0]-f0[0])*k;fr.z=f0[1]+(f1[1]-f0[1])*k;fr.pup.y=terrH(fr.x,fr.z)+Math.abs(Math.sin(k*PI*4))*.4+(1-k)*.5*(fy-terrH(fr.x,fr.z));fr.pup.tx=fr.x;fr.pup.tz=fr.z;return k>=1});await c4Wt(2.2);
  noise(.08,.3,1800);c1Say(W,'Who is THERE?',1.8);await c4Wt(.8);c6FrogSay(fr,'Danny. DANNY. Pick me up.',2);await c4Wt(1.8);despawn(fr);C6.frog=null;const fm=c6FrogMesh();fm.position.set(0,1.05,.38);PM.add(fm);PM.userData.c6frog=fm;await c4DanSay('(Grabbing the frog. Running.)',1.8)},done,
  {after:()=>{c4Off('c6deal');c4Off('c6wiz');c4Off('c6frog');if(C6.hut&&C6.hut.pile){sc.remove(C6.hut.pile)}for(const k in C4.props)if(/^c6chair/.test(k))c4Group(k,0)}})}
// the end of the chapter: Grant the frog, then the wizard's new outfit
async function c6Finale(done){const I=c5AI();await c6Cine(async()=>{c4At(1.5);if(PM.userData.c6frog){PM.remove(PM.userData.c6frog);PM.userData.c6frog=null}c6GrantHide(1);const fr=c6Frog(I.x0+24,I.z0+3.0,0,.98);fr.int='asr';c4DanAt(I.x0+24,I.z0+6.4,PI);
  c4Shot([I.x0+25.6,1.5,I.z0+7],[I.x0+24,1.05,I.z0+3],0);await c4Wt(.8);c1Sub('','Danny sets the frog on the throne. The frog adjusts its tie.');await c4Wt(2.6);
  c6FrogSay(fr,'Talk.',1.6);await c4Wt(1.6);await c4DanSay('It\'s Vincent. All of it. The meetings, the chants, the missing contracts. He planned the whole uprising.',3.6);
  c6FrogSay(fr,'One sophomore did all that? Nobody\'s that good.',2.6);await c4Wt(2.6);await c4DanSay('He had help.',1.8);c6FrogSay(fr,'Help? From WHO?',1.8);await c4Wt(1.8);
  c4Shot([I.x0+24.4,1.6,I.z0+5.4],[I.x0+24,1.6,I.z0+6.4],1.6);await c4Wt(1);await c4DanSay('A fucking wizard.',2.6);
  c4Shot([I.x0+24.4,1.2,I.z0+4.8],[I.x0+24,1.05,I.z0+3],1.8);await c4Wt(2.6);c1Sub('','Grant stares at him. He blinks one eye, and then the other.');await c4Wt(2.8);c6FrogSay(fr,'…Ribbit.',1.6);await c4Wt(2);
  // the hideout: the invitation and the wizard's new outfit
  await c4Fade(async()=>{c4Off('c6frog');goOut(C6HUT[0]-6,C6HUT[1]-8);c6Hut(1);const[hx,hz]=C6HUT,o={tag:'c6fin'};const W=c6Wizard(hx,hz+1,PI,Object.assign({},o,{tag:'c6wiz'})),v=c6Vin(hx-.6,hz-.9,0,o);c4Face(W,Math.atan2(v.x-W.x,v.z-W.z));c4Face(v,Math.atan2(W.x-v.x,W.z-v.z));c6LeashDerek(hx+1.1,hz+1.6,PI,W);C6.fin={W,v};PM.visible=false;c4Shot([hx-2.6,1.8,hz-3.4],[hx,1.5,hz+.5],0)});
  const{W,v}=C6.fin,[hx,hz]=C6HUT;const inv=c4M(bgeo(.22,.3,.01),mt(0xf2ead6,.6),0,0,0);const v3=new THREE.Vector3();c5Anim(()=>{if(!c4Live(v)){sc.remove(inv);return 1}inv.position.set(v.x+Math.sin(v.g.rotation.y)*.4,1.35,v.z+Math.cos(v.g.rotation.y)*.4);inv.rotation.y=v.g.rotation.y});
  await c6Lines([[v,'As promised. One invitation. Delta Gamma Rho Spring Bash. Saturday.'],[W,'Ohhh. Cardstock. Embossed letters.'],[W,'Well. I can hardly go dressed like THIS.']]);
  c4Shot([hx-1.6,1.6,hz-1.6],[hx,1.4,hz+1],1.2);await c4Wt(.4);for(let i=0;i<4;i++){c6Spark(W.x,.6+i*.45,W.z,i%2?0xb07aff:0xe2b64c,14);await c4Wt(.22)}c6Poof(W.x,1.2,W.z,0xc9a4ff);
  const wx=W.x,wz=W.z,wa=W.g.rotation.y;despawn(W);const W2=c6Wizard(wx,wz,wa,Object.assign({tag:'c6wiz',plain:1},DG,{pants:0x2a2a30,name:'The Wizard',title:'Honorary Member · ΔΓΡ'}));
  {const h=W2.g&&W2.g.P&&W2.g.P.head;if(h){const beard=new THREE.Mesh(GC.c6beard,mt(0xeeeeee,.9));beard.rotation.x=PI;beard.position.set(0,-.08,.13);beard.userData.noMerge=1;h.add(beard);const cap=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8,0,TAU,0,PI/2),mt(0x1b2e57,.7));cap.position.set(0,.2,0);h.add(cap)}}
  if(C6.leash)C6.leash.a=W2;W2.pup.st='wave';await c4Wt(1);await c6Lines([[W2,'BEHOLD. An honorary member of the brotherhood!'],[v,'You look… great.'],[W2,'Delta! Gamma! RHO!'],[C6.leash&&C6.leash.b,'Mmmph.',1.6]]);
  c4Shot([hx-9,3.4,hz-11],[hx,1.6,hz+1],.4);await c4Wt(2.6);big('THREE HOUSES. ONE COALITION. ONE WIZARD.',3600);await c4Wt(3.6)},done,{after:()=>{c4Off('c6fin');c4Off('c6wiz');c6Hut(0);PM.visible=true;c6GrantHide(0);goIn('asr',24,9)}})}

// ================================================================ the quests
const C6M=[
 {id:'c6three',ch:6,main:1,name:'Three Houses',at:[84,79],steps:()=>[
   {t:'fx',f:()=>{c4At(Math.max(10,S.gt<8||S.gt>20?11:S.gt))}},
   C_('Three Houses','Your phone','Grant: "Meet me at the ram. Bring your good attitude. Derek and Silas will be there and Derek is already in a mood."',[['Head to the ram',null]]),
   go(C6RAM,'Meet Grant, Derek and Silas Okoro at the ram',{r:4}),
   {t:'cine',run:c6MeetCine},
   go([C6RAM[0],C6RAM[1]+3],'Attend the official coalition announcement at the ram',{press:1,act:'Join the crowd',r:4,start:()=>c4At(19.5)}),
   {t:'cine',run:c6AnnounceCine},
   c5List('Distribute the new ΔΓΡ shirts, hoodies and letters',C6SHIRT.map(([k,id,dup,nm])=>({k,l:'Give '+nm+' his ΔΓΡ gear',at:()=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);return n?[n.x,n.z]:c6Door(id)},act:'Hand '+nm.split(' ')[0]+' the gear',run:fin=>c6GiveShirt(k,fin)})),{start:()=>{c4At(11);c6ShirtCast()}}),
   c5List('Replace the old banners at all three founding houses',C6HOUSES.map(([id,name])=>({k:'bn_'+id,l:'Hang the ΔΓΡ banner at '+name,at:()=>c6Door(id),act:'Hang the ΔΓΡ banner',run:fin=>{c6BanRaise(id);toast(name+': the old banner comes down, Delta Gamma Rho goes up.',3000);fin()}})),{start:()=>c4Off('c6sh')}),
   go(C6FIRE,'Attend the first official Delta Gamma Rho brotherhood gathering in the ΑΣΡ backyard',{r:5,start:()=>c4At(21)}),
   {t:'cine',run:c6GatherCine}],
  fin:()=>{c4Off('c6sh');c6S().shirts=1;c5Next('c6perfect')}},

 {id:'c6perfect',ch:6,main:1,name:'The Perfect Brother',at:[124,74],pre:['c6three'],steps:()=>[
   {t:'fx',f:()=>{c4At(12)}},
   C_('The Perfect Brother','Vincent Cross · ΔΓΡ Brother','"Danny! Grant said you\'re the guy who gets things done. I\'m throwing a joint cookout, all three houses, this afternoon. Help me set up? I want everybody to feel like they belong."',[['"Sure. What do you need?"',null]]),
   c5List('Help Vincent organize the joint ΔΓΡ cookout',C6COOK.map(([k,l,p,t])=>({k,l,at:()=>p,act:l,run:fin=>{card({title:'The Perfect Brother',sp:'',text:t,ch:[['Keep going',null]]});fin()}})),{start:()=>{c6CookSet();if(!C4.cast['Vincent Cross'])c6Vin(...c3Free(127,77),PI,{tag:'c6cook'})}}),
   {t:'fx',f:()=>{c4Off('c6cook');c4Group('c6cook',0);toast('The cookout goes off without a hitch. Somebody from every house tells you it was the best one yet.',4000)}},
   c5List('Introduce Vincent to members from all three founding houses',C6INTRO.map(([k,id,nm,,line])=>({k,l:'Introduce Vincent to '+nm,at:()=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);return n?[n.x,n.z]:c6Door(id)},act:'Introduce Vincent',run:fin=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);if(C6.vin&&n){C6.vin.x=n.x-1.2;C6.vin.z=n.z+1.2;c4Look(C6.vin,n.x,n.z)}c5Talk(n,'The Perfect Brother',line,[['"Vincent\'s new. Be nice."',()=>{if(n&&n.pup)n.pup.st='wave'}]],fin)}})),{start:()=>c6IntroCast(),tick:()=>c6VinFollow()}),
   go(C6QUAD,'Assist with the ΔΓΡ recruitment table on the quad',{r:5,start:()=>{c4Off('c6in');c4At(13)}}),
   c5List('Help recruit at the table',C6REC.map(([k,nm,t])=>({k,l:'Talk to '+nm.replace(/^A /,'a '),at:()=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);return n?[n.x,n.z]:C6QUAD},act:'Pitch ΔΓΡ',run:fin=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);c5Talk(n,'The Perfect Brother',t,[['Hand over a pen',()=>{if(n){bubble(n,'Signed!',1.4);setTimeout(()=>{if(c4Live(n))despawn(n)},1600)}}]],fin)}})),{start:()=>c6RecruitCast()}),
   {t:'fx',f:()=>{c4Off('c6rec');c4Group('c6recruit',0);toast('Forty-one sign-ups. Vincent thanks you for "basically doing all of it." You did four.',4000)}},
   go([76,122.5],'Help resolve a disagreement between two founding-house members on Greek Row',{r:4}),
   {t:'cine',run:c6DisputeCine}],
  fin:()=>{c5Next('c6establish')}},

 {id:'c6establish',ch:6,main:1,name:'Establishing the Brotherhood',who:'grant',pre:['c6perfect'],steps:()=>[
   {t:'fx',f:()=>{c4At(10.5)}},
   C_('Establishing the Brotherhood','Grant Ashby · ΔΓΡ Founder','"Delta Gamma Rho is the biggest Greek organization this campus has ever had. Now we act like it. Alumni, businesses, the whole city. Check on all three houses for me first. Something\'s off and I can\'t put my finger on it."',[['"Off how?"',()=>[C_('Establishing the Brotherhood','Grant Ashby · ΔΓΡ Founder','"Like the house is a little quieter when I walk into a room. Go look."',[['"On it."',null]])]]]),
   c5List('Visit all three founding houses',C6VISIT.map(([k,id,l,t,at])=>({k,l,at,act:l,run:fin=>{card({title:'Establishing the Brotherhood',sp:'',text:t,ch:[['"Weird."',null]]});fin()}}))),
   {t:'fx',f:()=>{c4At(18.5)}},
   c5List('Help organize the massive joint ΔΓΡ party in the ΑΣΡ backyard',C6PARTY.map(([k,l,p,t])=>({k,l,at:()=>p,act:l.split(' ').slice(0,3).join(' '),run:fin=>{card({title:'Establishing the Brotherhood',sp:'',text:t,ch:[['Keep going',null]]});fin()}})),{start:()=>{c6Party(1);if(!C4.cast['Vincent Cross'])c6Vin(...c3Free(128,76),PI,{tag:'c6pset'})}}),
   {t:'cine',run:c6PartyCine},
   {t:'fx',f:()=>{c4Off('c6pset');c4At(10);toast('Next day: the campus Activities Fair on the quad.',3200)}},
   c5List('Organize a Delta Gamma Rho presence at the Activities Fair',C6FAIRT.map(([k,l,at,t])=>({k,l,at,act:l.split(' ').slice(0,3).join(' '),run:fin=>{if(k==='fr_table')c6Table('c6fair',C6FAIR[0],C6FAIR[1],PI,'DELTA GAMMA RHO · ΔΓΡ');card({title:'Establishing the Brotherhood',sp:'',text:t,ch:[['Keep going',null]]});fin()}}))),
   {t:'cine',run:c6FairCine},
   {t:'fx',f:()=>{c4Group('c6fair',0);c4At(19)}},
   {t:'cond',lab:()=>'Attend the presidents\' joint meeting at the Student Union',ok:()=>P.inside==='union',goal:()=>P.inside&&P.inside!=='union'?null:[340.4,300.6]},
   {t:'cine',run:c6JointCine}],
  fin:()=>{c5Next('c6favorite')}},

 {id:'c6favorite',ch:6,main:1,name:'The Brotherhood\'s Favorite',at:[84,79],pre:['c6establish'],steps:()=>[
   {t:'fx',f:()=>{c4At(20)}},
   C_('The Brotherhood\'s Favorite','Your phone','Group chat, ΔΓΡ MEMBERS ONLY: "Living room, 8pm. Let\'s talk about leadership. Bring your voice. — V"',[['Go to the meeting',null]]),
   go([0,0],'Attend the meeting in the ΑΣΡ living room where members discuss changing leadership',{press:1,act:'Sit in on the meeting',r:3,goal:()=>c5Goal(c5AP(16,27)),start:()=>{const st=curStep(),p=c5AP(16,27);st.x=p.x;st.z=p.z}}),
   {t:'cine',run:c6LeaderMtg},
   c5List('Ask brothers what they think of the three presidents',C6OPIN.map(([k,id,nm,,t])=>({k,l:'Ask '+nm,at:()=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);return n?[n.x,n.z]:c6Door(id)},act:'Ask '+nm.split(' ')[0],run:fin=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);c6Glint(n);c5Talk(n,'The Brotherhood\'s Favorite',t,[['"…Okay. Thanks."',null]],fin)}})),{start:()=>{c4At(11);c6OpinCast()}}),
   {t:'fx',f:()=>c4Off('c6op')},
   c5InAsr('Report the suspicious activity to Grant in the throne room'),
   C_('The Brotherhood\'s Favorite','Grant Ashby · ΔΓΡ Founder','You tell Grant everything. The identical sentences. The missing charter. The contracts. Vincent.\n\nGrant is quiet for a long time. "I thought I was going crazy. I asked Tank what he thought of me yesterday and he said I\'d forgotten who the brotherhood belongs to. Tank. TANK."',[['"Get Derek and Silas. Tonight."',()=>[C_('The Brotherhood\'s Favorite','Grant Ashby · ΔΓΡ Founder','"ΓΓΗ porch, eleven. Just the three of us. And you."',[['"I\'ll be there."',null]])]]]),
   go(c6Door('gwz'),'Attend the private meeting between the three presidents at the ΓΓΗ house',{r:5,start:()=>c4At(22.8)}),
   {t:'cine',run:c6PresMtg},
   go(C6RAM,'Confront Vincent privately at the ram',{r:4}),
   {t:'cine',run:c6Confront}],
  fin:()=>{c5Next('c6uprising')}},

 {id:'c6uprising',ch:6,main:1,name:'The Brotherhood Uprising',at:[84,79],pre:['c6favorite'],steps:()=>[
   {t:'fx',f:()=>{c4At(19.5)}},
   C_('The Brotherhood Uprising','Your phone','EVERY ΔΓΡ group chat at once: "EMERGENCY MEETING. ΑΣΡ LAWN. NOW. The presidents have something to explain."',[['Run',null]]),
   go([82,80],'Attend the emergency Delta Gamma Rho meeting on the ΑΣΡ lawn',{r:5}),
   {t:'cine',run:c6UprisingCine},
   c5List('Find Grant, Derek and Silas',C6FIND.map(([k,nm,id,at,t])=>({k,l:'Find '+nm,at,act:'Talk to '+nm.split(' ')[0],run:fin=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);c5Talk(n,'The Brotherhood Uprising',t,[['"Stay here. Lock the door."',null]],fin)}})),{start:()=>{c4At(21);c6FindCast()}}),
   {t:'fx',f:()=>{c4Off('c6fd');c4At(11)}},
   c5List('Locate the brothers who have stopped cooperating with the founding houses',C6HOLD.map(([k,nm,p,t])=>({k,l:'Find '+nm.replace(/^A /,'the '),at:()=>p,act:'Talk to him',run:fin=>{const n=Object.values(C4.cast).find(n=>c4Live(n)&&n.c6k===k);c6Glint(n);c5Talk(n,'The Brotherhood Uprising',t,[['"…Right."',null]],fin)}})),{start:()=>c6HoldCast()}),
   {t:'fx',f:()=>c4Off('c6ho')},
   Object.assign(c5WarStep({at:C6QUAD,label:'THE ORGANIZERS',task:'Confront the members organizing against the presidents on the quad',waves:[[4,4],[5,5]],allies:[],from:[0,TAU],floor:40,mk:c6Organizer,taunts:['The members decide!','NO ONE ABOVE US!','Founder\'s pet!','Get the coordinator!','Vincent was right about you!'],win:'THE ORGANIZERS BACK DOWN'}),{}),
   c5List('Discover who is coordinating the uprising',C6CLUE.map(([k,l,p,t])=>({k,l,at:()=>p,act:l.split(' ').slice(0,3).join(' '),run:fin=>{card({title:'The Brotherhood Uprising',sp:'',text:t,ch:[['"Vincent."',null]]});fin()}}))),
   {t:'cine',run:c6WhoCine}],
  fin:()=>{c5Next('c6down')}},

 {id:'c6down',ch:6,main:1,name:'The Presidents Go Down',at:[84,79],pre:['c6uprising'],steps:()=>[
   {t:'fx',f:()=>{c4At(9.5)}},
   C_('The Presidents Go Down','Your phone','Nothing from Grant since last night. Nothing from Derek. Nothing from Silas. The ΔΓΡ chat is quiet for the first time in weeks.',[['Find Grant',null]]),
   go([0,0],'Find Grant in the throne room',{press:1,act:'Look for Grant',r:3,goal:()=>c5Goal(c5AP(24,8)),start:()=>{const st=curStep(),p=c5AP(24,8);st.x=p.x;st.z=p.z}}),
   {t:'cine',run:c6EmptyThrone},
   {t:'fx',f:()=>{c4Group('c6scorch',0);c4At(18.8)}},
   {t:'cond',lab:()=>'Temporary leadership meeting at the Student Union',ok:()=>P.inside==='union',goal:()=>P.inside&&P.inside!=='union'?null:[340.4,300.6]},
   {t:'cine',run:c6TempLead},
   {t:'fx',f:()=>c4At(10)},
   c5List('Help coordinate activities between the three houses',C6COORD.map(([k,l,at,t])=>({k,l,at,act:'Deliver the schedule',run:fin=>{card({title:'The Presidents Go Down',sp:'',text:t,ch:[['Move on',null]]});fin()}}))),
   c5List('Investigate who is making the unofficial decisions',C6ORD.map(([k,l,at,t])=>({k,l,at,act:l.split(' ').slice(0,3).join(' '),run:fin=>{card({title:'The Presidents Go Down',sp:'',text:t,ch:[['"V.C."',null]]});fin()}}))),
   {t:'fx',f:()=>{c4At(15);toast('Vincent is at the Union all afternoon. His room is empty.',3600)}},
   c5List('Search Vincent\'s room on the second floor for evidence',C6EVID.map(([k,l,at,t])=>({k,l,at,act:l.split(' ').slice(0,3).join(' '),run:fin=>{card({title:'The Presidents Go Down',sp:'',text:t,ch:[['Keep looking',null]]});fin()}}))),
   C_('The Presidents Go Down','','Someone, or something, has been helping Vincent. And tonight he is bringing them "the three."',[['"Tuesday. Midnight. The Lake District."',null]])],
  fin:()=>{c5Next('c6ingredient')}},

 {id:'c6ingredient',ch:6,main:1,name:'The Final Ingredient',at:[70,1031],pre:['c6down'],steps:()=>[
   c6TailStep(),
   {t:'cine',run:c6HutArrive},
   {t:'fx',f:()=>c4Off('c6tail')},
   c5List('Discover the mysterious symbols and magical objects inside',C6MAG.map(([k,l,p,t])=>({k,l,at:()=>p,act:l.split(' ').slice(0,3).join(' '),run:fin=>{card({title:'The Final Ingredient',sp:'',text:t,ch:[['"Okay. Okay okay okay."',null]]});fin()}})),{start:()=>c6Hut(1)}),
   go(c6HutP(-5,-6),'Hide behind the woodpile and listen in on Vincent\'s meeting',{press:1,act:'Hide and listen',r:2.6}),
   {t:'cine',run:c6Deal},
   c5InAsr('Get the frog back to the ΑΣΡ house'),
   go([0,0],'Return to Grant (the frog) in the throne room and reveal what you witnessed',{press:1,act:'Put the frog on the throne',r:3,goal:()=>c5Goal(c5AP(24,6)),start:()=>{const st=curStep(),p=c5AP(24,6);st.x=p.x;st.z=p.z}}),
   {t:'cine',run:c6Finale}],
  fin:()=>{c6CleanAll();toast('Chapter 6 complete. Grant is still a frog.',5200)}}];
// the hideout and the stealth tail live in the Lake District: unlock it if an old save somehow hasn't
M.push(...C6M);
