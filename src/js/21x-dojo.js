// ================================================================ V423 SIDE STORY: THE OPEN HAND (a training arc, unlocked once The Fall of Hughes is done)
// Ruth Calder, 70, cleaned the Rec Center for thirty-one years and has been a fifth-degree black belt for twenty-nine of them. She runs a 6 AM class on a
// wooden deck on the brick plaza outside the Rec Center. She saw the Hughes footage, and she takes Danny on: three lessons on a training dummy (the open hand, the
// wheel, the bicycle), three weeks of mornings, then the test: put her on the mat. Passing gives S.belt, the Black Belt perk: atkPick (file 21) then draws
// from a much bigger arsenal (roundhouse, spinning back kick, bicycle kick, flying knee, double palm strike, knife-hand) and Danny wears the belt.
const DOJO={n:null,dummy:null,teach:null,bias:.7,hits:0,need:0,hide:0,t:0,at:null};
const DOJO_AT=[450.6,233];
const DOJOL=[{t:'The Open Hand',mv:['palmD','chop'],need:6,nm:'palm strikes or knife-hand chops'},{t:'The Wheel',mv:['kRound','kSpin'],need:5,nm:'roundhouse or spinning back kicks'},{t:'The Bicycle',mv:['kBike','knee'],need:4,nm:'bicycle kicks or flying knees'}];
const DOJOALL=['palmD','chop','kRound','kSpin','kBike','knee'];
const DOJOGI={shirt:0xf1eee4,sleeve:0xf1eee4,pants:0xf1eee4,hair:0xc4c4c8,skin:0xe6b894,cap:0,noLetters:1,fem:true,look:{cl2:'tee',fh:0,shoe:0xe9e4d6,sole:0xcfc8b6}};
function dojoAt(){if(!DOJO.at)DOJO.at=c3Free(DOJO_AT[0],DOJO_AT[1],.6);return DOJO.at}
const dojoOpen=()=>!!(S&&S.done&&S.done.c5fall);
/* a cloth belt round the hips, knot in front */
function dojoBeltMesh(col){const g=new THREE.Group(),m=mt(col,.85);g.userData.noMerge=1;const t=new THREE.Mesh(new THREE.TorusGeometry(.215,.03,6,20),m);t.rotation.x=PI/2;t.scale.set(1,.82,1.35);g.add(t);const k=new THREE.Mesh(bgeo(.08,.07,.05),m);k.position.set(0,0,.2);g.add(k);for(const sx of[-1,1]){const e=new THREE.Mesh(bgeo(.035,.17,.02),m);e.position.set(sx*.035,-.1,.215);e.rotation.z=sx*.25;g.add(e)}for(const c of g.children)c.userData.noMerge=1;g.position.y=.05;return g}
function dojoGi(n){if(!n||!n.g)return n;try{bodyBuild(n.g)}catch(e){}const h=n.g.P&&n.g.P.hips;if(h&&!h.getObjectByName('dojobelt')){const b=dojoBeltMesh(0x121214);b.name='dojobelt';h.add(b)}return n}
/* the black belt on Danny once he has earned it (not over a toga or a caveman skin) */
function dojoBelt(){const h=PM&&PM.P&&PM.P.hips;if(!h)return;let b=h.getObjectByName('dojobelt');const want=!!(S&&S.belt)&&!PM.userData.scBare;if(want&&!b){b=dojoBeltMesh(0x101012);b.name='dojobelt';h.add(b)}if(b)b.visible=want}
/* the deck: planks, corner posts and rope, a banner frame, a rack of staffs, two stone lanterns */
function dojoYard(on){return c4Group('dojoyard',on,g=>{const[x,z]=dojoAt(),y=terrH(x,z),W=0x8a6a44,D=0x5a4028;const dk=c4M(bgeo(9,.14,7),mt(W,.8),x,y+.07,z,g);dk.receiveShadow=true;
  for(let i=-4;i<=4;i++)c4M(bgeo(.03,.012,7),mt(D,.9),x+i,y+.146,z,g);
  for(const sx of[-1,1])for(const sz of[-1,1]){c4M(bgeo(.16,1,.16),mt(D,.8),x+sx*4.5,y+.5,z+sz*3.5,g)}
  c4M(bgeo(9,.04,.04),mt(0xd8cfae,.9),x,y+.9,z-3.5,g);c4M(bgeo(.04,.04,7),mt(0xd8cfae,.9),x+4.5,y+.9,z,g);
  /* banner frame on the north edge */for(const sx of[-1,1])c4M(bgeo(.2,3.1,.2),mt(0x6e2a22,.7),x+sx*2.6,y+1.55,z-3.9,g);c4M(bgeo(6.2,.22,.3),mt(0x6e2a22,.7),x,y+3.1,z-3.9,g);c4M(bgeo(5.6,.16,.24),mt(0x6e2a22,.7),x,y+2.6,z-3.9,g);
  try{const s=signMesh('REC CENTER MARTIAL ARTS  ·  6 AM  ·  ALL WELCOME',4.8,.62,'#f1eee4','#6e2a22','Georgia');s.position.set(x,y+2.05,z-3.88);g.add(s)}catch(e){}
  /* staff rack */c4M(bgeo(1.6,.08,.3),mt(D,.8),x-3.6,y+.3,z-3,g);c4M(bgeo(1.6,.08,.3),mt(D,.8),x-3.6,y+1.3,z-3,g);for(const sx of[-.7,.7])c4M(bgeo(.08,1.4,.3),mt(D,.8),x-3.6+sx,y+.7,z-3,g);for(let i=0;i<4;i++){const st=c4M(new THREE.CylinderGeometry(.022,.022,1.75,6),mt(0xb89460,.7),x-4.1+i*.33,y+.95,z-3,g);st.rotation.z=.05*(i-1.5)}
  /* stone lanterns */for(const sx of[-1,1]){const lx=x+sx*5.3,lz=z+3.9;c4M(bgeo(.5,.2,.5),mt(0x7c7e80,.95),lx,y+.1,lz,g);c4M(bgeo(.2,.7,.2),mt(0x7c7e80,.95),lx,y+.55,lz,g);c4M(bgeo(.46,.34,.46),new THREE.MeshStandardMaterial({color:0x8a8c8e,roughness:.9,emissive:0xffb347,emissiveIntensity:.35}),lx,y+1.07,lz,g);c4M(bgeo(.66,.1,.66),mt(0x6c6e70,.95),lx,y+1.29,lz,g)}})}
function dojoSensei(){if(DOJO.n&&NP.includes(DOJO.n))return DOJO.n;const[x,z]=dojoAt();const n=spawn('staff','quad',Object.assign({x:x+1.2,z:z-1.6,a:0,mode:'idle',named:1,lvl:9,name:'Ruth Calder',title:'Sensei · Rec Center Martial Arts'},DOJOGI));n.noTalk=1;n.mute=1;n.dojo=1;n.hx=n.x;n.hz=n.z;n.int=null;dojoGi(n);DOJO.n=n;return n}
/* the wooden training dummy: a puppet that can be hit (hitNPC stops at n.dummy) */
function dojoDummy(on){const d=DOJO.dummy;if(!on){if(d&&NP.includes(d)){C4.pups=C4.pups.filter(q=>q!==d);C4.mine=C4.mine.filter(q=>q!==d);despawn(d)}DOJO.dummy=null;return null}if(d&&NP.includes(d))return d;const[x,z]=dojoAt();
  const n=c4Pup('staff',x-1.4,z+.6,PI/2,{tag:'dojodum',int:null,name:'Training Dummy',title:'Wood and rope',lvl:1,shirt:0x9a6c3c,sleeve:0x9a6c3c,pants:0x7a5430,skin:0xa87844,hair:0x7a5430,cap:0,noLetters:1,fem:false,look:{cl2:'tee',fh:0,noMouth:1,shoe:0x7a5430,sole:0x5a3c20}});if(!n)return null;
  n.actor=0;n.dummy=1;n.temp=1;n.def=1;n.noTalk=1;n.hp=n.mhp=9999;n.pup.frozen=0;n.pup.sp=0;n.pup.arms=1.35;n.pup.look=[x+3,z+.6];n.a=PI/2;if(AM)AM.temps.push(n);/* not one of the cutscene's own puppets: the clean-up after a cutscene must not take it away */C4.mine=C4.mine.filter(q=>q!==n);DOJO.dummy=n;return n}
function dojoTick(dt){if(typeof mode==='undefined'||mode==='title'||mode==='loading'||!S)return;const d=DOJO.dummy;if(d&&d.pup&&d.pup.lean>0)d.pup.lean=Math.max(0,d.pup.lean-dt*1.4);
  /* cutscene clean-up hides every prop group: the deck is put back every frame */if(C4.props.dojoyard)C4.props.dojoyard.visible=dojoOpen();
  if((DOJO.t-=dt)>0)return;DOJO.t=.5;const un=dojoOpen();if(!un&&!C4.props.dojoyard)return;dojoYard(un);
  if(!un||DOJO.hide){if(DOJO.n&&NP.includes(DOJO.n)&&!DOJO.n.pup)despawn(DOJO.n);if(!un)DOJO.n=null;dojoBelt();return}
  dojoSensei();dojoBelt();if(!(AM&&AM.m.id==='dojo')){DOJO.teach=null;if(DOJO.dummy)dojoDummy(0)}
  else{const st=curStep();if(st&&st.dojoL!=null&&mode==='play'){/* a lesson always has its dummy, standing where it belongs and still a live puppet */const q=dojoDummy(1);if(q){if(!C4.pups.includes(q))C4.pups.push(q);const[x,z]=dojoAt();q.x=q.pup.tx=x-1.4;q.z=q.pup.tz=z+.6}}}}
/* a hit Danny landed: in a lesson, the right move on the dummy counts */
function dojoHit(n,ty){if(!AM||AM.m.id!=='dojo'||!DOJO.teach||n!==DOJO.dummy)return;const st=curStep();if(!st||st.dojoL==null)return;if(!DOJO.teach.includes(ty)){if(DOJO.n&&TT>(DOJO.nagT||0)){DOJO.nagT=TT+4;bubble(DOJO.n,pick(['That was a punch. I asked for something else.','Again. The new one.','Closed fist. Start over.']),2.2)}return}
  DOJO.hits++;sfx('ok');if(DOJO.n&&TT>(DOJO.okT||0)){DOJO.okT=TT+2.5;bubble(DOJO.n,pick(['Better.','Through him, not at him.','Again.','Hm. Acceptable.','Hips. HIPS. …Yes.','Good. Now mean it.']),1.8)}updObj()}
function dojoLesson(i){const L=DOJOL[i];DOJO.teach=L.mv;DOJO.bias=.8;DOJO.hits=0;DOJO.need=L.need;dojoDummy(1);if(P.inside)goOut(dojoAt()[0]+1.6,dojoAt()[1]+1.6)}
const dojoLab=i=>'\n'+DOJOL[i].t+': land '+DOJOL[i].need+' '+DOJOL[i].nm+' on the training dummy ('+Math.min(DOJO.hits,DOJO.need)+'/'+DOJOL[i].need+')\nStand next to the dummy and attack';
const dojoGoal=()=>DOJO.dummy?[DOJO.dummy.x,DOJO.dummy.z]:dojoAt();
/* ---- cutscene helpers: Sensei and Danny perform a move (atkPose driven by hand, not by the fight code) */
function dojoPup(on){const n=dojoSensei();if(on){if(!n.pup){n.grab=1;n.pup={tx:n.x,tz:n.z,v:2.2,st:'',y:null,t:0,face:n.a||0,lean:0,lie:0};n.g.rotation.order='YXZ';if(!C4.pups.includes(n))C4.pups.push(n)}}else if(n.pup){n.pup=null;n.grab=0;C4.pups=C4.pups.filter(q=>q!==n);if(n.g){n.g.rotation.x=0;n.g.rotation.z=0}n.hx=n.x;n.hz=n.z}return n}
async function dojoMove(who,ty,hitFn){const d=ATK[ty].d*1.35;let t=0,hit=0;/* the conversation box holds a speaker's facing until it is let go */SCENE=null;if(who!=='D'&&who.pup)who.a=who.pup.look?Math.atan2(who.pup.look[0]-who.x,who.pup.look[1]-who.z):who.pup.face;const set=k=>g=>{try{atkPose(g,ty,k)}catch(e){}};
  while(t<d){const k=t/d;if(who==='D'){if(C4.dan)C4.dan.post=set(k)}else if(who.pup)who.pup.post=set(k);if(!hit&&k>=.42){hit=1;try{maWhoosh(.05)}catch(e){}if(hitFn)hitFn()}await c4Wt(.033);t+=.033}
  const clr=g=>{const q=g.P;if(q&&q.lR){q.lR.rotation.z=0;q.lR.rotation.y=0;if(q.lL){q.lL.rotation.z=0;q.lL.rotation.y=0}if(q.hR)q.hR.rotation.x=0;if(q.hL)q.hL.rotation.x=0}g.HPA=null;try{fistSet(q,null)}catch(e){}};
  if(who==='D'){if(C4.dan)C4.dan.post=null;clr(PM)}else{if(who.pup)who.pup.post=null;clr(who.g)}}
const dojoThud=()=>{const d=DOJO.dummy;if(d&&d.pup)d.pup.lean=.24;sfx('hit')};
async function dojoIntro(done){const[x,z]=dojoAt(),y=terrH(x,z);await c6Cine(async()=>{const s=dojoPup(1);
    c4Shot([x+7.5,y+2.6,z+6.5],[x,y+1,z-.5]);c4Shot([x+6,y+2.2,z+5.2],[x,y+1.1,z-.5],.3);
    await c8Lines([[null,'Six in the morning. On a wooden deck behind the Rec Center, a small grey-haired woman in a white uniform is waiting like she has been waiting a while.',4.2]]);
    c4Shot([x+3.4,y+1.7,z+2.4],[s.x,y+1.4,s.z]);
    await c8Lines([[s,'You are the boy from the Hughes footage.'],[DANNY,'We won that.'],[s,'You survived that. I watched it four times. You throw a punch like you are trying to get rid of your own arm.'],[DANNY,'…Who are you?'],
      [s,'Ruth Calder. Thirty-one years I mopped that building. Fifth-degree black belt for twenty-nine of them. Nobody ever asks the custodian.'],
      [s,'The war is over and you are still walking around with your fists closed. That is how the next one starts. Open your hand.'],[DANNY,'Like this?'],[s,'Worse than I thought. Good. Then there is plenty to do. Stand there.']])},done,
    {fade:async()=>{const s=dojoPup(1);c4DanAt(x+1.6,z+1.4,Math.atan2(s.x-(x+1.6),s.z-(z+1.4)));s.pup.look=[P.x,P.z]},after:()=>{dojoPup(0)}})}
/* lesson i: she shows the two moves on the dummy, with a line for each */
const DOJOSAY=[[['The fist is a hammer. The open hand is a door. Heel of the palm, both hands, through him. Not at him.','And the edge of the hand. Small. Fast. It does not announce itself.'],'Through him.','Six. On the dummy. Go.'],
  [['You kick like you are closing a car door. A kick is a wheel. The hip turns. The leg only comes along for the ride.','And when your back is to him you are not running away. You are loading.'],'A wheel.','Five. And breathe out when it lands.'],
  [['Everybody says never leave the ground. Everybody is right, mostly. The left knee lies. The right foot tells the truth.','And if he is too close for any of it: the knee. Pull him down onto it.'],'That cannot be legal.','It is a bicycle. Four. Then we see what three weeks does to you.']];
async function dojoDemo(done,i){const[x,z]=dojoAt(),y=terrH(x,z),L=DOJOL[i],T=DOJOSAY[i];await c6Cine(async()=>{const s=dojoPup(1),d=DOJO.dummy;
    c4Shot([x+2.6,y+1.9,z+4.6],[d.x+.5,y+1.15,d.z]);if(i===0)big('LESSON ONE',1400);else if(i===1)big('LESSON TWO',1400);else big('LESSON THREE',1400);
    await c8Lines([[s,T[0][0]]]);c4Shot([d.x+1.2,y+1.5,d.z+3.4],[d.x+.6,y+1.1,d.z]);await dojoMove(s,L.mv[0],dojoThud);await c4Wt(.35);await dojoMove(s,L.mv[0],dojoThud);await c4Wt(.4);
    await c8Lines([[s,T[0][1]]]);await dojoMove(s,L.mv[1],dojoThud);await c4Wt(.35);await dojoMove(s,L.mv[1],dojoThud);await c4Wt(.4);
    c4Shot([x+3.6,y+1.7,z+3.2],[x+.6,y+1.3,z]);await c8Lines([[DANNY,T[1]],[s,T[2]]])},done,
    {fade:async()=>{const d=dojoDummy(1),s=dojoPup(1);s.x=d.x+1.25;s.z=d.z;s.pup.tx=s.x;s.pup.tz=s.z;s.pup.look=[d.x,d.z];s.pup.face=-PI/2;c4PupPlace(s,0);c4DanAt(d.x+2.3,d.z+2.2,Math.atan2(-1.6,-2.2))},
     after:()=>{const s=dojoPup(0),[x2,z2]=dojoAt();s.x=x2+2.6;s.z=z2-1.8;s.hx=s.x;s.hz=s.z;s.a=-.6;if(s.g){s.g.position.set(s.x,terrH(s.x,s.z),s.z);s.g.rotation.y=s.a}}})}
/* three weeks of mornings: the two of them side by side, the same form, at dawn, at noon, at dusk */
async function dojoMontage(done){const[x,z]=dojoAt(),y=terrH(x,z),gt0=S.gt;await c6Cine(async()=>{const s=dojoPup(1);big('THREE WEEKS',1800);
    const beat=async(gt,cam,mv,sub)=>{await c4Fade(async()=>{S.gt=gt;try{lighting()}catch(e){}c4Shot(cam[0],cam[1]);c4Shot(cam[2],cam[1],.2)});c1Sub('',sub);for(const m of mv){await Promise.all([dojoMove(s,m),dojoMove('D',m)]);await c4Wt(.25)}c1Sub(null)};
    await beat(6.2,[[x+1,y+1.5,z+6.2],[x+1,y+1.15,z],[x+1,y+1.7,z+5.2]],['palmD','chop','palmD'],'Every morning at six. The open hand, two hundred times.');
    await beat(12.5,[[x+6,y+1.9,z+2.6],[x+1,y+1.2,z],[x+5,y+1.7,z+2.2]],['kRound','kSpin','kRound'],'Then the wheel, until the hip stops arguing.');
    await beat(19.4,[[x-3.4,y+1.3,z+4.4],[x+1,y+1.3,z],[x-2.6,y+1.2,z+3.8]],['knee','kBike','kBike'],'Then the bicycle. He lands on his back eleven times. She counts every one out loud.');
    await c4Fade(async()=>{S.gt=6.1;try{lighting()}catch(e){}c4Shot([x+3.6,y+1.7,z+3.2],[x+.6,y+1.3,z])});
    await c8Lines([[s,'Three weeks. You are no longer embarrassing. That is not the same as good.'],[DANNY,'What\'s left?'],[s,'Me. Put me on the mat, and you leave here with a belt. I will not go easy. I am seventy. I do not have the time.']])},done,
    {fade:async()=>{dojoDummy(0);const s=dojoPup(1);s.x=x+1.9;s.z=z;s.pup.tx=s.x;s.pup.tz=s.z;s.pup.look=null;s.pup.face=0;c4PupPlace(s,0);c4DanAt(x+.1,z,0)},after:()=>{dojoPup(0);S.gt=6.2;try{lighting()}catch(e){}}})}
async function dojoBeltCine(done){const[x,z]=dojoAt(),y=terrH(x,z);await c6Cine(async()=>{const s=dojoPup(1);
    c4Shot([x+3.2,y+1.6,z+3],[x+.4,y+1.25,z]);
    await c8Lines([[s,'Hm. Thirty-one years, and a pledge in a propeller hat puts me on my own mat.'],[DANNY,'Are you okay?'],[s,'I am seventy. Nothing is okay. Stand still.']]);
    c4Shot([x+1.6,y+1.25,z+1.9],[x+.35,y+1,z]);c1Sub('','She ties a black belt round his waist, twice, and pulls the knot hard enough to hurt.');S.belt=1;dojoBelt();sfx('lvl');await c4Wt(3.4);c1Sub(null);big('BLACK BELT',2200);
    c4Shot([x+3,y+1.6,z+2.6],[x+.4,y+1.3,z]);
    await c8Lines([[s,'A belt holds up your pants. What you learned holds up everything else.'],[s,'Do not start fights, Kowalski. Finish them. And be here at six tomorrow. The class needs someone to hold the pads.']])},done,
    {fade:async()=>{DOJO.hide=0;const st=curStep();for(const n of AM?AM.temps.slice():[])if(n.dojoFoe&&NP.includes(n)){despawn(n)}const s=dojoPup(1);s.x=x+.9;s.z=z;s.pup.tx=s.x;s.pup.tz=s.z;s.pup.face=-PI/2;c4PupPlace(s,0);c4DanAt(x-.3,z,PI/2);s.pup.look=[P.x,P.z]},after:()=>{dojoPup(0)}})}
const DOJOM=[{id:'dojo',ch:5,side:1,name:'Side: The Open Hand',at:DOJO_AT,pre:['c5fall'],steps:()=>{const[x,z]=dojoAt();return[
   {t:'cine',run:dojoIntro},
   {t:'cine',run:d=>dojoDemo(d,0)},{t:'cond',dojoL:0,lab:()=>dojoLab(0),ok:()=>DOJO.hits>=DOJO.need,start:()=>dojoLesson(0),goal:dojoGoal},
   {t:'cine',run:d=>dojoDemo(d,1)},{t:'cond',dojoL:1,lab:()=>dojoLab(1),ok:()=>DOJO.hits>=DOJO.need,start:()=>dojoLesson(1),goal:dojoGoal},
   {t:'cine',run:d=>dojoDemo(d,2)},{t:'cond',dojoL:2,lab:()=>dojoLab(2),ok:()=>DOJO.hits>=DOJO.need,start:()=>dojoLesson(2),goal:dojoGoal},
   {t:'cine',run:dojoMontage},
   {t:'fight',x:x+.6,z:z+.2,label:'The test: put Sensei Calder on the mat',foes:[['staff',Math.max(6,(S.lvl||1)+1),'Ruth Calder']],fo:Object.assign({lvAbs:1,title:'Sensei · Rec Center Martial Arts'},DOJOGI),mk:n=>{dojoGi(n);n.dojoFoe=1;n.taunt=['Show me three weeks.','Hands open. Begin.','Do not be polite about it.']},start:()=>{DOJO.hide=1;if(DOJO.n&&NP.includes(DOJO.n))despawn(DOJO.n);DOJO.n=null;dojoDummy(0);DOJO.teach=DOJOALL;DOJO.bias=.55;if(P.inside)goOut(x+2,z+2)}},
   {t:'cine',run:dojoBeltCine}]},
  fin:()=>{S.belt=1;DOJO.teach=null;DOJO.hide=0;dojoBelt();rep('athletes',10);big('SIDE STORY COMPLETE',1800);toast('Black Belt: roundhouse, spinning back kick, bicycle kick, flying knee, double palm strike and knife-hand are now part of every fight. The third hit of a combo is always a big kick.',8000);try{saveGame()}catch(e){}},
  reset:()=>{DOJO.teach=null;DOJO.hide=0;dojoDummy(0);if(DOJO.n&&DOJO.n.pup)dojoPup(0)}}];
M.push(...DOJOM);
