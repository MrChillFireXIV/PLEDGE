// ================================================================ V423 SIDE STORY: THE OPEN HAND (a training arc, unlocked once The Fall of Hughes is done)
// Walt Ambrose, 70, cleaned the Rec Center for thirty-one years and has been a fifth-degree black belt for twenty-nine of them (V425: a long drooping
// mustache and a wide straw hat; he calls Danny "Daniel-san"). He runs a 6 AM class on a wooden deck on the brick plaza outside the Rec Center. He saw the
// Hughes footage and takes Danny on: three lessons on a training dummy (the open hand, the wheel, the bicycle), three weeks of mornings, then the test: put him on the mat. Passing gives S.belt, the Black Belt perk: atkPick (file 21) then draws
// from a much bigger arsenal (roundhouse, spinning back kick, bicycle kick, flying knee, double palm strike, knife-hand) and Danny wears the belt.
const DOJO={n:null,dummy:null,teach:null,bias:.7,hits:0,need:0,hide:0,t:0,at:null};
const DOJO_AT=[450.6,233];
const DOJOL=[{t:'The Open Hand',mv:['palmD','chop'],need:6,nm:'palm strikes or knife-hand chops'},{t:'The Wheel',mv:['kRound','kSpin'],need:5,nm:'roundhouse or spinning back kicks'},{t:'The Bicycle',mv:['kBike','knee'],need:4,nm:'bicycle kicks or flying knees'}];
const DOJOALL=['palmD','chop','kRound','kSpin','kBike','knee'];
const DOJOGI={shirt:0xf1eee4,sleeve:0xf1eee4,pants:0xf1eee4,hair:0xd4d4d8,skin:0xe2b48e,cap:0,noLetters:1,fem:false,look:{cl2:'tee',fh:0,shoe:0xe9e4d6,sole:0xcfc8b6}};
/* V458 the training spot is the deck on the mountain summit (flat, at ground height); the campus spot is the trail sign on the plaza */
function dojoAt(){return DOJO.at||(DOJO.at=[MTN.x,MTN.z-2])}
function dojoCamp(){if(!DOJO.cp)DOJO.cp=c3Free(DOJO_AT[0],DOJO_AT[1]+.6,.6);return DOJO.cp}
/* where the sensei waits: by the trail sign until he has taken Danny up, then on the summit */
function dojoHome(){if(S&&S.dojoUp){const[x,z]=dojoAt();return[x+1.2,z-1.6]}const[x,z]=dojoCamp();return[x+.8,z-.2]}
const dojoOpen=()=>!!(S&&S.done&&S.done.c5fall);
/* a cloth belt round the hips, knot in front */
function dojoBeltMesh(col){const g=new THREE.Group(),m=mt(col,.85);g.userData.noMerge=1;const t=new THREE.Mesh(new THREE.TorusGeometry(.215,.03,6,20),m);t.rotation.x=PI/2;t.scale.set(1,.82,1.35);g.add(t);const k=new THREE.Mesh(bgeo(.08,.07,.05),m);k.position.set(0,0,.2);g.add(k);for(const sx of[-1,1]){const e=new THREE.Mesh(bgeo(.035,.17,.02),m);e.position.set(sx*.035,-.1,.215);e.rotation.z=sx*.25;g.add(e)}for(const c of g.children)c.userData.noMerge=1;g.position.y=.05;return g}
function dojoGi(n){if(!n||!n.g)return n;try{bodyBuild(n.g)}catch(e){}const h=n.g.P&&n.g.P.hips;if(h&&!h.getObjectByName('dojobelt')){const b=dojoBeltMesh(0x121214);b.name='dojobelt';h.add(b)}dojoFace(n);return n}
/* V425 the sensei's face and hat: a long grey mustache drooping down past the chin in two tapered strands, bushy brows, and a wide woven straw hat */
function dojoStraw(){return GC.dojoStraw||(GC.dojoStraw=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d');q.fillStyle='#d9b56a';q.fillRect(0,0,128,128);for(let i=0;i<128;i+=4){q.fillStyle=i%8?'rgba(140,100,40,.28)':'rgba(255,240,190,.22)';q.fillRect(0,i,128,2)}for(let i=0;i<128;i+=8){q.fillStyle='rgba(120,84,30,.18)';q.fillRect(i,0,1,128)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,1);return t})())}
function dojoFace(n){const hd=n&&n.g&&n.g.P&&n.g.P.head;if(!hd||hd.getObjectByName('dojoface'))return;const g=new THREE.Group();g.name='dojoface';hd.add(g);const hm=new THREE.MeshStandardMaterial({color:0xe2e2e4,roughness:.9}),Y=1.78-(typeof BP!=='undefined'&&BP.head?BP.head[1]:1.78);
  for(const sx of[-1,1]){/* the strand: a short bar under the nose, then a long tapered tube that curves out and down */const top=new THREE.Mesh(new THREE.CylinderGeometry(.024,.02,.11,8),hm);top.rotation.z=sx*1.25;top.position.set(sx*.05,Y-.055,.195);g.add(top);
    const pts=[];for(let i=0;i<=8;i++){const t=i/8;pts.push(new THREE.Vector3(sx*(.09+.05*Math.sin(t*1.6)),Y-.07-t*.34,.19-.06*t*t))}const tb=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,.017,7,false),hm);g.add(tb);
    const tip=new THREE.Mesh(new THREE.ConeGeometry(.017,.07,7),hm);tip.position.copy(pts[8]).add(new THREE.Vector3(0,-.03,-.004));tip.rotation.x=PI;g.add(tip);
    const br=new THREE.Mesh(bgeo(.08,.024,.03),hm);br.position.set(sx*.074,Y+.085,.19);br.rotation.z=-sx*.18;g.add(br)}
  /* a wide straw hat with a low round crown, tied under the chin */const S_=new THREE.MeshStandardMaterial({color:0xd8a850,map:dojoStraw(),roughness:.95,side:THREE.DoubleSide});
  const brim=new THREE.Mesh(new THREE.CylinderGeometry(.38,.47,.07,28,1,true),S_);brim.position.y=Y+.2;g.add(brim);const top=new THREE.Mesh(new THREE.RingGeometry(.19,.385,28),S_);top.rotation.x=-PI/2;top.position.y=Y+.234;g.add(top);
  const cr=new THREE.Mesh(new THREE.SphereGeometry(.205,20,10,0,TAU,0,PI/2),S_);cr.scale.set(1,.62,1);cr.position.y=Y+.225;g.add(cr);const und=new THREE.Mesh(new THREE.RingGeometry(.2,.47,28),S_);und.rotation.x=PI/2;und.position.y=Y+.165;g.add(und);
  const band=new THREE.Mesh(new THREE.CylinderGeometry(.207,.207,.035,20,1,true),new THREE.MeshStandardMaterial({color:0x5a2a1c,roughness:.8,side:THREE.DoubleSide}));band.position.y=Y+.245;g.add(band);
  for(const sx of[-1,1]){const st=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.3,4),new THREE.MeshStandardMaterial({color:0x5a2a1c}));st.position.set(sx*.15,Y+.03,.04);st.rotation.z=-sx*.42;g.add(st)}
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.userData.noMerge=1}});
  /* the grey hair would poke through the brim: hide the hair geometry's top by pulling the hat a touch lower on a bald-ish head */}
/* the black belt on Danny once he has earned it (not over a toga or a caveman skin) */
function dojoBelt(){const h=PM&&PM.P&&PM.P.hips;if(!h)return;let b=h.getObjectByName('dojobelt');const want=!!(S&&S.belt)&&!PM.userData.scBare;if(want&&!b){b=dojoBeltMesh(0x101012);b.name='dojobelt';h.add(b)}if(b)b.visible=want}
/* the deck: planks, corner posts and rope, a banner frame, a rack of staffs, two stone lanterns */
function dojoYard(on){return c4Group('dojoyard',on,g=>{const[x,z]=dojoAt(),y=terrH(x,z),W=0x8a6a44,D=0x5a4028;const dk=c4M(bgeo(9,.14,7),mt(W,.8),x,y+.07,z,g);dk.receiveShadow=true;
  for(let i=-4;i<=4;i++)c4M(bgeo(.03,.012,7),mt(D,.9),x+i,y+.146,z,g);
  for(const sx of[-1,1])for(const sz of[-1,1]){c4M(bgeo(.16,1,.16),mt(D,.8),x+sx*4.5,y+.5,z+sz*3.5,g)}
  c4M(bgeo(9,.04,.04),mt(0xd8cfae,.9),x,y+.9,z-3.5,g);c4M(bgeo(.04,.04,7),mt(0xd8cfae,.9),x+4.5,y+.9,z,g);
  /* banner frame on the north edge */for(const sx of[-1,1])c4M(bgeo(.2,3.1,.2),mt(0x6e2a22,.7),x+sx*2.6,y+1.55,z-3.9,g);c4M(bgeo(6.2,.22,.3),mt(0x6e2a22,.7),x,y+3.1,z-3.9,g);c4M(bgeo(5.6,.16,.24),mt(0x6e2a22,.7),x,y+2.6,z-3.9,g);
  try{const s=signMesh('THE OPEN HAND  ·  STAND STILL  ·  BREATHE OUT',4.8,.62,'#f1eee4','#6e2a22','Georgia');s.position.set(x,y+2.05,z-3.88);g.add(s)}catch(e){}
  /* staff rack */c4M(bgeo(1.6,.08,.3),mt(D,.8),x-3.6,y+.3,z-3,g);c4M(bgeo(1.6,.08,.3),mt(D,.8),x-3.6,y+1.3,z-3,g);for(const sx of[-.7,.7])c4M(bgeo(.08,1.4,.3),mt(D,.8),x-3.6+sx,y+.7,z-3,g);for(let i=0;i<4;i++){const st=c4M(new THREE.CylinderGeometry(.022,.022,1.75,6),mt(0xb89460,.7),x-4.1+i*.33,y+.95,z-3,g);st.rotation.z=.05*(i-1.5)}
  /* stone lanterns */for(const sx of[-1,1]){const lx=x+sx*5.3,lz=z+3.9;c4M(bgeo(.5,.2,.5),mt(0x7c7e80,.95),lx,y+.1,lz,g);c4M(bgeo(.2,.7,.2),mt(0x7c7e80,.95),lx,y+.55,lz,g);c4M(bgeo(.46,.34,.46),new THREE.MeshStandardMaterial({color:0x8a8c8e,roughness:.9,emissive:0xffb347,emissiveIntensity:.35}),lx,y+1.07,lz,g);c4M(bgeo(.66,.1,.66),mt(0x6c6e70,.95),lx,y+1.29,lz,g)}})}
function dojoSensei(){if(DOJO.n&&NP.includes(DOJO.n))return DOJO.n;const[x,z]=dojoHome();const n=spawn('staff','quad',Object.assign({x,z,a:0,mode:'idle',named:1,lvl:9,name:'Walt Ambrose',title:'Sensei · Rec Center Martial Arts'},DOJOGI));n.noTalk=1;n.mute=1;n.dojo=1;n.hx=n.x;n.hz=n.z;n.int=null;dojoGi(n);DOJO.n=n;return n}
/* the wooden training dummy: a puppet that can be hit (hitNPC stops at n.dummy) */
function dojoDummy(on){const d=DOJO.dummy;if(!on){if(d&&NP.includes(d)){C4.pups=C4.pups.filter(q=>q!==d);C4.mine=C4.mine.filter(q=>q!==d);despawn(d)}DOJO.dummy=null;return null}if(d&&NP.includes(d))return d;const[x,z]=dojoAt();
  const n=c4Pup('staff',x-1.4,z+.6,PI/2,{tag:'dojodum',int:null,name:'Training Dummy',title:'Wood and rope',lvl:1,shirt:0x9a6c3c,sleeve:0x9a6c3c,pants:0x7a5430,skin:0xa87844,hair:0x7a5430,cap:0,noLetters:1,fem:false,look:{cl2:'tee',fh:0,noMouth:1,shoe:0x7a5430,sole:0x5a3c20}});if(!n)return null;
  n.actor=0;n.dummy=1;n.temp=1;n.def=1;n.noTalk=1;n.hp=n.mhp=9999;n.pup.frozen=0;n.pup.sp=0;n.pup.arms=1.35;n.pup.look=[x+3,z+.6];n.a=PI/2;if(AM)AM.temps.push(n);/* not one of the cutscene's own puppets: the clean-up after a cutscene must not take it away */C4.mine=C4.mine.filter(q=>q!==n);DOJO.dummy=n;return n}
function dojoTick(dt){if(typeof mode==='undefined'||mode==='title'||mode==='loading'||!S)return;const d=DOJO.dummy;if(d&&d.pup&&d.pup.lean>0)d.pup.lean=Math.max(0,d.pup.lean-dt*1.4);
  /* cutscene clean-up hides every prop group: the mountain, the deck and the trail sign are put back every frame (the mountain only when Danny is on it) */
  const near=mtnNear(),on=dojoOpen();if(C4.props.dojomtn)C4.props.dojomtn.visible=near;if(C4.props.dojoyard)C4.props.dojoyard.visible=on&&near;if(C4.props.dojotrail)C4.props.dojotrail.visible=on&&!near;
  if((DOJO.t-=dt)>0)return;DOJO.t=.5;const un=on;if(!un&&!C4.props.dojoyard&&!C4.props.dojotrail)return;dojoTrail(un&&!near);if(near||C4.props.dojomtn){mtnGroup(near);dojoYard(un&&near)}
  if(!un||DOJO.hide){if(DOJO.n&&NP.includes(DOJO.n)&&!DOJO.n.pup)despawn(DOJO.n);if(!un)DOJO.n=null;dojoBelt();return}
  {const n=dojoSensei();/* he lives where he is needed: far from home and not in a scene, he is simply there */if(n&&!n.pup){const[hx,hz]=dojoHome();n.hx=hx;n.hz=hz;if(Math.hypot(n.x-hx,n.z-hz)>60){n.x=hx;n.z=hz;n.vx=n.vz=0;if(n.g)n.g.position.set(hx,terrH(hx,hz),hz)}}}dojoBelt();if(!(AM&&AM.m.id==='dojo')){DOJO.teach=null;if(DOJO.dummy)dojoDummy(0)}
  else{const st=curStep();if(st&&st.dojoL!=null&&mode==='play'){/* a lesson always has its dummy, standing where it belongs and still a live puppet */const q=dojoDummy(1);if(q){if(!C4.pups.includes(q))C4.pups.push(q);const[x,z]=dojoAt();q.x=q.pup.tx=x-1.4;q.z=q.pup.tz=z+.6}}}}
/* a hit Danny landed: in a lesson, the right move on the dummy counts */
function dojoHit(n,ty){if(!AM||AM.m.id!=='dojo'||!DOJO.teach||n!==DOJO.dummy)return;const st=curStep();if(!st||st.dojoL==null)return;if(!DOJO.teach.includes(ty)){if(DOJO.n&&TT>(DOJO.nagT||0)){DOJO.nagT=TT+4;bubble(DOJO.n,pick(['That was a punch. I asked for something else.','Again. The new one.','Closed fist. Start over.']),2.2)}return}
  DOJO.hits++;sfx('ok');if(DOJO.n&&TT>(DOJO.okT||0)){DOJO.okT=TT+2.5;bubble(DOJO.n,pick(['Better.','Through him, not at him.','Again.','Hm. Acceptable.','Hips. HIPS. …Yes.','Good. Now mean it.']),1.8)}updObj()}
function dojoLesson(i){const L=DOJOL[i];DOJO.teach=L.mv;DOJO.bias=.8;DOJO.hits=0;DOJO.need=L.need;dojoDummy(1)}
const dojoRide=()=>mtnNear()?'':'\nRide up the mountain first: the trail sign on the plaza by the Rec Center';
const dojoLab=i=>dojoRide()+'\n'+DOJOL[i].t+': land '+DOJOL[i].need+' '+DOJOL[i].nm+' on the training dummy ('+Math.min(DOJO.hits,DOJO.need)+'/'+DOJOL[i].need+')\nStand next to the dummy and attack';
const dojoGoal=()=>!mtnNear()?[DOJO_AT[0],DOJO_AT[1]-1]:DOJO.dummy?[DOJO.dummy.x,DOJO.dummy.z]:dojoAt();
/* ---- cutscene helpers: Sensei and Danny perform a move (atkPose driven by hand, not by the fight code) */
function dojoPup(on){const n=dojoSensei();if(on){if(!n.pup){n.grab=1;n.pup={tx:n.x,tz:n.z,v:2.2,st:'',y:null,t:0,face:n.a||0,lean:0,lie:0};n.g.rotation.order='YXZ';if(!C4.pups.includes(n))C4.pups.push(n)}}else if(n.pup){n.pup=null;n.grab=0;C4.pups=C4.pups.filter(q=>q!==n);if(n.g){n.g.rotation.x=0;n.g.rotation.z=0}n.hx=n.x;n.hz=n.z}return n}
async function dojoMove(who,ty,hitFn){const d=ATK[ty].d*1.35;let t=0,hit=0;/* the conversation box holds a speaker's facing until it is let go */SCENE=null;if(who!=='D'&&who.pup)who.a=who.pup.look?Math.atan2(who.pup.look[0]-who.x,who.pup.look[1]-who.z):who.pup.face;const set=k=>g=>{try{atkPose(g,ty,k)}catch(e){}};
  while(t<d){const k=t/d;if(who==='D'){if(C4.dan)C4.dan.post=set(k)}else if(who.pup)who.pup.post=set(k);if(!hit&&k>=.42){hit=1;try{maWhoosh(.05)}catch(e){}if(hitFn)hitFn()}await c4Wt(.033);t+=.033}
  const clr=g=>{const q=g.P;if(q&&q.lR){q.lR.rotation.z=0;q.lR.rotation.y=0;if(q.lL){q.lL.rotation.z=0;q.lL.rotation.y=0}if(q.hR)q.hR.rotation.x=0;if(q.hL)q.hL.rotation.x=0}g.HPA=null;try{fistSet(q,null)}catch(e){}};
  if(who==='D'){if(C4.dan)C4.dan.post=null;clr(PM)}else{if(who.pup)who.pup.post=null;clr(who.g)}}
const dojoThud=()=>{const d=DOJO.dummy;if(d&&d.pup)d.pup.lean=.24;sfx('hit')};
/* V458 the intro: on the plaza by the trail sign, then the truck, then the last of the stairs to the summit */
function mtnPath(){const P_=[];for(let i=22;i>=0;i-=.5){const q=mtnStep(i);P_.push([q.x,q.z])}P_.push([MTN.x-.4,MTN.z+18.2],[MTN.x,MTN.z+16.4],[MTN.x+.2,MTN.z+12.5],[MTN.x+.6,MTN.z+3.2]);const L=[0];for(let k=1;k<P_.length;k++)L.push(L[k-1]+Math.hypot(P_[k][0]-P_[k-1][0],P_[k][1]-P_[k-1][1]));
  return{len:L[L.length-1],at:d=>{d=Math.max(0,Math.min(L[L.length-1],d));let k=1;while(k<L.length-1&&L[k]<d)k++;const t=(d-L[k-1])/Math.max(1e-6,L[k]-L[k-1]);return[P_[k-1][0]+(P_[k][0]-P_[k-1][0])*t,P_[k-1][1]+(P_[k][1]-P_[k-1][1])*t]}}}
async function dojoClimb(s,from,to,secs,camF){const W=mtnPath(),D=C4.dan;let t=0;s.pup.look=null;s.pup.v=D.v=2.4;
  while(t<secs){const k=t/secs,d=from+(to-from)*k;const a=W.at(d+.45),b=W.at(d+2.4);D.tx=a[0];D.tz=a[1];s.pup.tx=b[0];s.pup.tz=b[1];D.y=mtnStairY(P.x,P.z);s.pup.y=mtnStairY(s.x,s.z);if(camF)camF(k);await c4Wt(.033);t+=.033}}
async function dojoIntro(done){const[cx,cz]=dojoCamp(),cy=terrH(cx,cz),[x,z]=dojoAt();await c6Cine(async()=>{const s=dojoPup(1);
    c4Shot([cx+7.5,cy+2.6,cz+6.5],[cx,cy+1,cz-.5]);c4Shot([cx+6,cy+2.2,cz+5.2],[cx,cy+1.1,cz-.5],.3);
    await c8Lines([[null,'Six in the morning. On the brick plaza by the Rec Center, under a wooden trail sign nobody has ever read, a small old man in a white uniform and a wide straw hat is waiting like he has been waiting a while. His grey mustache hangs down past his chin.',4.4]]);
    c4Shot([cx+3.4,cy+1.7,cz+2.4],[s.x,cy+1.4,s.z]);
    await c8Lines([[s,'You are the boy from the Hughes footage. Daniel.'],[DANNY,'It\'s Danny.'],[s,'Daniel-san.'],[DANNY,'…We won that, you know.'],[s,'You survived that. I watched it four times. You throw a punch like you are trying to get rid of your own arm.'],[DANNY,'…Who are you?'],
      [s,'Walt Ambrose. Thirty-one years I mopped that building. Fifth-degree black belt for twenty-nine of them. Nobody ever asks the custodian.'],
      [s,'The war is over and you are still walking around with your fists closed. That is how the next one starts. Open your hand, Daniel-san.'],[DANNY,'Like this?'],[s,'Worse than I thought. Good. Then there is plenty to do.'],
      [DANNY,'So we train here? On the plaza?'],[s,'Here there are leaf blowers and people with opinions. Not here. Up.'],[DANNY,'Up where?'],[s,'Get in the truck, Daniel-san.']]);
    /* the mountain: stone pillars standing in a sea of cloud */
    await c4Fade(async()=>{S.dojoUp=1;mtnGroup(1);dojoYard(1);dojoTrail(0);
      const W=mtnPath(),a=W.at(.3),b=W.at(2.3);c4DanAt(a[0],a[1],0);C4.dan.y=mtnStairY(a[0],a[1]);s.x=s.pup.tx=b[0];s.z=s.pup.tz=b[1];s.pup.y=mtnStairY(b[0],b[1]);c4PupPlace(s,0);
      c4Shot([x+95,30,z+120],[x,-12,z]);c4Shot([x+70,22,z+92],[x,-6,z],.12)});
    big('THE MOUNTAIN',2000);c1Sub('','Two hours north, past the end of the last bus line, the road gives out at the foot of a stone stair. He does not say how many steps there are. He does not have to.');await c4Wt(5.2);c1Sub(null);
    /* up the last of the stairs, the camera out over the drop */
    const W=mtnPath(),half=W.len-13;
    await dojoClimb(s,.3,half,7.5,k=>{const a=Math.atan2(P.z-MTN.z,P.x-MTN.x),r=31-4*k;c4Shot([MTN.x+Math.cos(a+.18)*r,(C4.dan.y||0)+4.5-k,MTN.z+Math.sin(a+.18)*r],[P.x,(C4.dan.y||0)+1.1,P.z],2.2)});
    await c8Lines([[DANNY,'How many… steps… was that?'],[s,'Two thousand one hundred and eight. You will count them yourself tomorrow.']]);
    /* through the red gate onto the summit */
    c4Shot([x+5,3.6,z+9],[x,1.6,z+15.5]);
    await dojoClimb(s,half,W.len-.5,6.2,k=>c4Shot([x+4.2,2.6+.6*k,Math.min(z+12,P.z-6.5)],[P.x,1.2,P.z],2));dojoStop(s);
    c4Shot([x+3.6,1.9,z+6.2],[x+.6,1.3,z+2.4],1.6);
    await c8Lines([[null,'A flat stone courtyard at the top of the world. A wooden deck, a rack of staffs, a pavilion, and nothing in any direction but stone and cloud.',3.6],[DANNY,'…Okay. This is better than the plaza.'],[s,'Everything is better than the plaza. Stand there.']])},done,
    {fade:async()=>{const s=dojoPup(1);mtnGroup(0);c4DanAt(cx+1.6,cz+1.4,Math.atan2(s.x-(cx+1.6),s.z-(cz+1.4)));s.pup.look=[P.x,P.z]},
     after:()=>{const s=dojoPup(0);if(C4.dan)C4.dan.y=null;const[hx,hz]=dojoHome();if(s){s.x=s.hx=hx;s.z=s.hz=hz;if(s.g)s.g.position.set(hx,0,hz)}if(!mtnNear()){goOut(x+1.6,z+1.4)}}})}
/* the two of them come to a stop on the deck, facing each other */
function dojoStop(s){const[x,z]=dojoAt();C4.dan.y=null;s.pup.y=null;C4.dan.tx=x+.6;C4.dan.tz=z+1.6;s.pup.tx=x+1.6;s.pup.tz=z-.4;s.pup.look=[x+.6,z+1.6];C4.dan.look=[x+1.6,z-.4]}
/* lesson i: he shows the two moves on the dummy, with a line for each */
const DOJOSAY=[[['The fist is a hammer, Daniel-san. The open hand is a door. Heel of the palm, both hands, through him. Not at him.','And the edge of the hand. Small. Fast. It does not announce itself.'],'Through him.','Six. On the dummy. Go.'],
  [['Daniel-san. You kick like you are closing a car door. A kick is a wheel. The hip turns. The leg only comes along for the ride.','And when your back is to him you are not running away. You are loading.'],'A wheel.','Five. And breathe out when it lands.'],
  [['Everybody says never leave the ground. Everybody is right, mostly. The left knee lies. The right foot tells the truth.','And if he is too close for any of it: the knee. Pull him down onto it.'],'That cannot be legal.','It is a bicycle, Daniel-san. Four. Then we see what three weeks does to you.']];
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
    await beat(19.4,[[x-3.4,y+1.3,z+4.4],[x+1,y+1.3,z],[x-2.6,y+1.2,z+3.8]],['knee','kBike','kBike'],'Then the bicycle. He lands on his back eleven times. He counts every one out loud.');
    await c4Fade(async()=>{S.gt=6.1;try{lighting()}catch(e){}c4Shot([x+3.6,y+1.7,z+3.2],[x+.6,y+1.3,z])});
    await c8Lines([[s,'Three weeks, Daniel-san. You are no longer embarrassing. That is not the same as good.'],[DANNY,'What\'s left?'],[s,'Me. Put me on the mat, and you leave here with a belt. I will not go easy. I am seventy. I do not have the time.']])},done,
    {fade:async()=>{dojoDummy(0);const s=dojoPup(1);s.x=x+1.9;s.z=z;s.pup.tx=s.x;s.pup.tz=s.z;s.pup.look=null;s.pup.face=0;c4PupPlace(s,0);c4DanAt(x+.1,z,0)},after:()=>{dojoPup(0);S.gt=6.2;try{lighting()}catch(e){}}})}
async function dojoBeltCine(done){const[x,z]=dojoAt(),y=terrH(x,z);await c6Cine(async()=>{const s=dojoPup(1);
    c4Shot([x+3.2,y+1.6,z+3],[x+.4,y+1.25,z]);
    await c8Lines([[s,'Hm. Thirty-one years, and a pledge in a propeller hat puts me on my own mat.'],[DANNY,'Are you okay?'],[s,'I am seventy. Nothing is okay. Stand still.']]);
    c4Shot([x+1.6,y+1.25,z+1.9],[x+.35,y+1,z]);c1Sub('','He ties a black belt round his waist, twice, and pulls the knot hard enough to hurt.');S.belt=1;dojoBelt();sfx('lvl');await c4Wt(3.4);c1Sub(null);big('BLACK BELT',2200);
    c4Shot([x+3,y+1.6,z+2.6],[x+.4,y+1.3,z]);
    await c8Lines([[s,'A belt holds up your pants. What you learned holds up everything else.'],[s,'Do not start fights, Daniel-san. Finish them. And come back up at six tomorrow. Somebody has to carry the water.']])},done,
    {fade:async()=>{DOJO.hide=0;const st=curStep();for(const n of AM?AM.temps.slice():[])if(n.dojoFoe&&NP.includes(n)){despawn(n)}const s=dojoPup(1);s.x=x+.9;s.z=z;s.pup.tx=s.x;s.pup.tz=s.z;s.pup.face=-PI/2;c4PupPlace(s,0);c4DanAt(x-.3,z,PI/2);s.pup.look=[P.x,P.z]},after:()=>{dojoPup(0)}})}
const DOJOM=[{id:'dojo',ch:5,side:1,name:'Side: The Open Hand',at:DOJO_AT,pre:['c5fall'],steps:()=>{const[x,z]=dojoAt();return[
   {t:'cine',run:dojoIntro},
   {t:'cine',run:d=>dojoDemo(d,0)},{t:'cond',dojoL:0,lab:()=>dojoLab(0),ok:()=>DOJO.hits>=DOJO.need,start:()=>dojoLesson(0),goal:dojoGoal},
   {t:'cine',run:d=>dojoDemo(d,1)},{t:'cond',dojoL:1,lab:()=>dojoLab(1),ok:()=>DOJO.hits>=DOJO.need,start:()=>dojoLesson(1),goal:dojoGoal},
   {t:'cine',run:d=>dojoDemo(d,2)},{t:'cond',dojoL:2,lab:()=>dojoLab(2),ok:()=>DOJO.hits>=DOJO.need,start:()=>dojoLesson(2),goal:dojoGoal},
   {t:'cine',run:dojoMontage},
   {t:'fight',x:x+.6,z:z+.2,label:'The test: put Sensei Ambrose on the mat',goal:()=>mtnNear()?[x+.6,z+.2]:[DOJO_AT[0],DOJO_AT[1]-1],foes:[['staff',Math.max(6,(S.lvl||1)+1),'Walt Ambrose']],fo:Object.assign({lvAbs:1,title:'Sensei · Rec Center Martial Arts'},DOJOGI),mk:n=>{dojoGi(n);n.dojoFoe=1;n.taunt=['Show me three weeks, Daniel-san.','Hands open. Begin.','Do not be polite about it, Daniel-san.']},start:()=>{DOJO.hide=1;if(DOJO.n&&NP.includes(DOJO.n))despawn(DOJO.n);DOJO.n=null;dojoDummy(0);DOJO.teach=DOJOALL;DOJO.bias=.55;if(P.inside||!mtnNear()){mtnGroup(1);dojoYard(1);goOut(x+2,z+2)}}},
   {t:'cine',run:dojoBeltCine}]},
  fin:()=>{S.belt=1;DOJO.teach=null;DOJO.hide=0;dojoBelt();rep('athletes',10);big('SIDE STORY COMPLETE',1800);toast('Black Belt: roundhouse, spinning back kick, bicycle kick, flying knee, double palm strike and knife-hand are now part of every fight. The third hit of a combo is always a big kick.',8000);try{saveGame()}catch(e){}},
  reset:()=>{DOJO.teach=null;DOJO.hide=0;dojoDummy(0);if(DOJO.n&&DOJO.n.pup)dojoPup(0)}}];
M.push(...DOJOM);

// ================================================================ V458 THE MOUNTAIN (user: train up a mountain like the tall rocky mountains of China)
// The Open Hand no longer trains on a deck on the plaza. Sensei Ambrose meets Danny by a trail sign on the plaza (the intro), then drives him up to a
// mountain of sheer stone pillars standing in a sea of cloud (Zhangjiajie / Guilin style): the lessons, the three weeks, the test and the belt all happen
// on the summit. It is its own outdoor area far south of the map (past the building interiors, which are hidden whenever Danny is outdoors), so nothing
// from campus is in view. The summit is flat at ground height; every other pillar, the stairway and the clouds are built below and around it. Getting
// there and back: "Ride up the mountain" at the trail sign, "Head back down" at the red gate on the summit.
const MTN={x:560,z:2200,R:16.8};
const mtnNear=()=>!P.inside&&Math.abs(P.x-MTN.x)<420&&Math.abs(P.z-MTN.z)<420;
function mtnRnd(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* geometry for many pieces gathered into one mesh per material (vertex colours carry the variation) */
function mtnBatch(){return{p:[],n:[],c:[]}}
function mtnAdd(B,geo,colFn){const g=geo.index?geo.toNonIndexed():geo;g.computeVertexNormals();const P_=g.attributes.position.array,N_=g.attributes.normal.array;for(let i=0;i<P_.length;i+=3){B.p.push(P_[i],P_[i+1],P_[i+2]);B.n.push(N_[i],N_[i+1],N_[i+2]);const c=colFn(P_[i],P_[i+1],P_[i+2]);B.c.push(c[0],c[1],c[2])}g.dispose();if(g!==geo)geo.dispose()}
function mtnMesh(B,mat,par){if(!B.p.length)return null;const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(B.p,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(B.n,3));G.setAttribute('color',new THREE.Float32BufferAttribute(B.c,3));G.computeBoundingSphere();const m=new THREE.Mesh(G,mat);m.userData.noMerge=1;m.receiveShadow=true;par.add(m);return m}
/* one stone pillar: a tall open column, wider at the foot, with ledges, bulges and vertical cracks; moss on the top band */
function mtnPillar(B,cx,cz,top,bot,rt,rb,seed,calm){const h=top-bot,seg=Math.max(8,Math.min(30,Math.round(h/11))),r=mtnRnd(seed),ph=[r()*6,r()*6,r()*6,r()*6],lx=(r()-.5)*.06,lz=(r()-.5)*.06;
  const g=new THREE.CylinderGeometry(1,1,h,13,seg,true),A=g.attributes.position;
  for(let i=0;i<A.count;i++){const x=A.getX(i),y=A.getY(i),z=A.getZ(i),a=Math.atan2(z,x),t=Math.min(1,Math.max(0,(y+h/2)/h)),yy=bot+t*h;let rr=rb+(rt-rb)*Math.pow(t,.7);
    let w=.17*Math.sin(a*3+ph[0]+t*5)+.09*Math.sin(a*7+ph[1])+.07*Math.sin(t*29+ph[2]+a*2)+.05*Math.round(Math.sin(t*11+ph[3])*2)/2;if(calm)w*=Math.min(1,Math.max(0,(1-t)*9));rr*=1+w;
    A.setXYZ(i,cx+Math.cos(a)*rr+lx*(yy-top),yy,cz+Math.sin(a)*rr+lz*(yy-top))}
  const gr=.48+r()*.08;mtnAdd(B.rock,g,(x,y,z)=>{const t=(y-bot)/h,a=Math.atan2(z-cz,x-cx),cr=.86+.14*Math.sin(a*17+ph[1])*Math.sin(t*41);let k=gr*cr*(.78+.22*t);
    if(top-y<Math.min(h*.07,3.2)*(1-.3*Math.sin(a*5+ph[2])))return[.26*cr,.36*cr,.2*cr];return[k*1.02,k,k*.92]});
  /* the grassy top, a touch wider so it overhangs the rock like turf */
  const cap=new THREE.CircleGeometry(calm?rt+.25:rt*1.32,calm?40:13);cap.rotateX(-PI/2);cap.translate(cx,top+(calm?.04:.05),cz);mtnAdd(B.moss,cap,(x,y,z)=>{const v=.9+.1*Math.sin(x*1.7+z*1.3);return[.3*v,.42*v,.21*v]})}
/* a cliff pine: a bent trunk and three flat layers of needles */
function mtnPine(B,x,y,z,s,seed){const r=mtnRnd(seed),lean=(r()-.5)*.5,a=r()*TAU;const tr=new THREE.CylinderGeometry(.12*s,.22*s,2.6*s,6);tr.rotateZ(lean);tr.rotateY(a);tr.translate(x,y+1.25*s,z);mtnAdd(B.wood,tr,()=>[.3,.22,.15]);
  const tx=x+Math.sin(-lean)*1.3*s*Math.cos(a),tz=z+Math.sin(-lean)*1.3*s*Math.sin(-a);for(let i=0;i<3;i++){const c=new THREE.ConeGeometry((1.9-i*.45)*s,.75*s,8);c.scale(1,1,.8+r()*.3);c.rotateY(r()*TAU);c.translate(tx+(r()-.5)*.5*s,y+(2.2+i*.62)*s,tz+(r()-.5)*.5*s);mtnAdd(B.pine,c,()=>{const v=.85+r()*.2;return[.12*v,.26*v,.13*v]})}}
/* the stairway: steps cut into the summit pillar, winding down and around it from the red gate */
const MTNST={r:18.6,a0:PI/2,da:.0245,rise:.3,n:96};
/* the first tread starts just past the landing (four tread widths round from the gate) */
function mtnStep(i){const a=MTNST.a0+(i+4)*MTNST.da;return{x:MTN.x+Math.cos(a)*MTNST.r,z:MTN.z+Math.sin(a)*MTNST.r,y:-MTNST.rise*(i+1),a}}
function mtnStairY(x,z){if(Math.hypot(x-MTN.x,z-MTN.z)<MTN.R)return 0;let a=Math.atan2(z-MTN.z,x-MTN.x);if(a<MTNST.a0-.2)a+=TAU;const i=Math.max(-1,Math.min(MTNST.n-1,Math.round((a-MTNST.a0)/MTNST.da)-4));return i<0?0:mtnStep(i).y}
/* soft cloud texture for the sea of clouds */
function mtnMist(){return GC.mtnMist||(GC.mtnMist=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const q=c.getContext('2d'),r=mtnRnd(77);for(let i=0;i<46;i++){const x=r()*256,y=r()*256,R=20+r()*60,g=q.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,'rgba(255,255,255,'+(.35+r()*.35)+')');g.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=g;
  for(const dx of[-256,0,256])for(const dy of[-256,0,256]){q.save();q.translate(dx,dy);q.beginPath();q.arc(x,y,R,0,TAU);q.fill();q.restore()}}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,4);return t})())}
function mtnBuild(g){const X=MTN.x,Z=MTN.z,r=mtnRnd(4581),B={rock:mtnBatch(),moss:mtnBatch(),pine:mtnBatch(),wood:mtnBatch(),stone:mtnBatch(),red:mtnBatch(),tile:mtnBatch()};
  /* the summit pillar (flat top at walking height) and a crowd of others around it, some taller, some far below */
  mtnPillar(B,X,Z,0,-320,MTN.R,25,11,1);
  const spots=[];for(let k=0;k<46;k++){let tries=0,x,z,d;do{const a=r()*TAU;d=36+Math.pow(r(),.85)*230;x=X+Math.cos(a)*d;z=Z+Math.sin(a)*d;tries++}while(tries<20&&spots.some(s=>Math.hypot(s[0]-x,s[1]-z)<s[2]+14));
    const rt=5+r()*13,top=d<70?-22-r()*40+r()*58:-60+r()*150;spots.push([x,z,rt]);mtnPillar(B,x,z,top,-320,rt,rt*(1.25+r()*.5),100+k,0);
    const np=1+Math.floor(r()*Math.min(5,rt/3));for(let j=0;j<np;j++){const a=r()*TAU,dd=r()*rt*.7;mtnPine(B,x+Math.cos(a)*dd,top,z+Math.sin(a)*dd,.8+r()*1.1,300+k*7+j)}}
  /* the summit: a paved courtyard, pines leaning out over the edge */
  const pv=new THREE.BoxGeometry(20,.05,14);pv.translate(X,.02,Z-1.5);mtnAdd(B.stone,pv,(x,y,z)=>{const v=.92+.08*Math.sin(Math.floor(x*1.1)*3.1+Math.floor(z*1.1)*1.7);return[.66*v,.63*v,.57*v]});
  for(const[a,s]of[[.4,1.2],[1.15,1],[2.45,1.3],[3.5,.95],[4.3,1.15],[5.6,1.05]]){mtnPine(B,X+Math.cos(a)*(MTN.R-1.4),0,Z+Math.sin(a)*(MTN.R-1.4),s,900+Math.round(a*10))}
  /* stone balustrade round the edge, open only where the gate stands */
  const bn=64;for(let i=0;i<bn;i++){const a=i/bn*TAU;if(Math.abs(((a-PI/2+PI)%TAU)-PI)<.09)continue;const x=X+Math.cos(a)*(MTN.R-.45),z=Z+Math.sin(a)*(MTN.R-.45);const p=new THREE.BoxGeometry(.28,.95,.28);p.rotateY(-a);p.translate(x,.47,z);mtnAdd(B.stone,p,()=>[.7,.68,.62]);
    const a2=(i+1)/bn*TAU;if(Math.abs(((a2-PI/2+PI)%TAU)-PI)<.09)continue;const x2=X+Math.cos(a2)*(MTN.R-.45),z2=Z+Math.sin(a2)*(MTN.R-.45),L=Math.hypot(x2-x,z2-z);const rl=new THREE.BoxGeometry(L,.12,.2);rl.rotateY(-Math.atan2(z2-z,x2-x));rl.translate((x+x2)/2,.9,(z+z2)/2);mtnAdd(B.stone,rl,()=>[.74,.72,.66])}
  /* the red gate at the top of the stairs (a paifang): two posts, two beams, a tiled roof with upturned ends */
  const gx=X,gz=Z+MTN.R-.3;for(const sx of[-1,1]){const c=new THREE.CylinderGeometry(.2,.22,3.6,10);c.translate(gx+sx*1.7,1.8,gz);mtnAdd(B.red,c,()=>[.6,.12,.09]);const ft=new THREE.BoxGeometry(.6,.4,.6);ft.translate(gx+sx*1.7,.2,gz);mtnAdd(B.stone,ft,()=>[.6,.58,.53])}
  for(const[y,w]of[[3.05,4.2],[3.55,4.6]]){const bm=new THREE.BoxGeometry(w,.24,.3);bm.translate(gx,y,gz);mtnAdd(B.red,bm,()=>[.62,.13,.1])}
  {const rf=new THREE.CylinderGeometry(.01,1,1,4,1);rf.rotateY(PI/4);rf.scale(3.6,.5,.75);rf.translate(gx,4.05,gz);mtnAdd(B.tile,rf,()=>[.2,.22,.25]);for(const sx of[-1,1]){const t=new THREE.ConeGeometry(.16,.7,6);t.rotateZ(-sx*1.05);t.translate(gx+sx*2.7,3.98,gz);mtnAdd(B.tile,t,()=>[.2,.22,.25])}}
  /* a small open pavilion on the north side of the courtyard */
  {const px=X+8.6,pz=Z-8.2,base=new THREE.BoxGeometry(4.4,.3,4.4);base.translate(px,.15,pz);mtnAdd(B.stone,base,()=>[.62,.6,.55]);for(const sx of[-1,1])for(const sz of[-1,1]){const c=new THREE.CylinderGeometry(.13,.15,2.7,8);c.translate(px+sx*1.7,1.65,pz+sz*1.7);mtnAdd(B.red,c,()=>[.6,.12,.09])}
   const rf=new THREE.CylinderGeometry(.05,3.5,1.5,4,1);rf.rotateY(PI/4);rf.translate(px,3.7,pz);mtnAdd(B.tile,rf,()=>[.2,.22,.25]);const rb=new THREE.BoxGeometry(3.9,.18,3.9);rb.translate(px,3,pz);mtnAdd(B.red,rb,()=>[.55,.11,.08]);
   for(const sx of[-1,1])for(const sz of[-1,1]){const t=new THREE.ConeGeometry(.13,.8,6);t.rotateZ(-sx*1.0);t.rotateX(sz*1.0);t.translate(px+sx*2.45,3.05,pz+sz*2.45);mtnAdd(B.tile,t,()=>[.2,.22,.25])}
   const fn=new THREE.ConeGeometry(.12,.5,6);fn.translate(px,4.6,pz);mtnAdd(B.red,fn,()=>[.62,.5,.15])}
  /* the stairway, cut into the summit pillar, winding down out of sight with a low rail on the open side */
  {const l=new THREE.BoxGeometry(3,.3,3.2);l.translate(gx,-.15,gz+1.6);mtnAdd(B.stone,l,()=>[.6,.58,.52]);
   for(let i=0;i<MTNST.n;i++){const s=mtnStep(i),st=new THREE.BoxGeometry(.5,1.4,2.7);st.rotateY(PI/2-s.a);st.translate(s.x,s.y-.7,s.z);mtnAdd(B.stone,st,()=>{const v=.88+.12*Math.sin(i*1.9);return[.6*v,.58*v,.52*v]});
     if(i%3===0){const ox=Math.cos(s.a)*1.45,oz=Math.sin(s.a)*1.45,pp=new THREE.BoxGeometry(.16,.85,.16);pp.translate(s.x+ox,s.y+.42,s.z+oz);mtnAdd(B.stone,pp,()=>[.66,.64,.58])}}}
  const M_=(c,rough=.95,extra)=>new THREE.MeshStandardMaterial(Object.assign({color:c,vertexColors:true,roughness:rough,flatShading:true},extra||{}));
  mtnMesh(B.rock,M_(0xffffff),g);mtnMesh(B.moss,M_(0xffffff),g);mtnMesh(B.pine,M_(0xffffff),g);mtnMesh(B.wood,M_(0xffffff),g);mtnMesh(B.stone,M_(0xffffff,.9),g);mtnMesh(B.red,M_(0xffffff,.6),g);mtnMesh(B.tile,M_(0xffffff,.7),g);
  /* the gate's name board */try{const s=signMesh('THE OPEN HAND',2.4,.42,'#f3d27a','#6e1a12','Georgia');s.position.set(gx,3.3,gz+.17);g.add(s);const s2=signMesh('THE OPEN HAND',2.4,.42,'#f3d27a','#6e1a12','Georgia');s2.position.set(gx,3.3,gz-.17);s2.rotation.y=PI;g.add(s2)}catch(e){}
  /* a sea of cloud: three soft layers between the pillars, and a thin veil round the summit's foot */
  for(const[y,o,rp]of[[-34,.55,4],[-58,.8,3],[-95,.95,2]]){const t=mtnMist().clone();t.needsUpdate=true;t.repeat.set(rp,rp);const m=new THREE.Mesh(new THREE.PlaneGeometry(760,760),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:o,depthWrite:false,color:0xf4f6f8}));m.rotation.x=-PI/2;m.position.set(X,y,Z);m.userData.noMerge=1;m.renderOrder=2;g.add(m)}
  g.traverse(o=>{if(o.isMesh)o.castShadow=false});
  /* walls: the balustrade ring (the gate too: the stairs go down by the prompt, not on foot) */
  for(let a=0;a<TAU;a+=.035){const x=X+Math.cos(a)*(MTN.R-.2),z=Z+Math.sin(a)*(MTN.R-.2);markR(x-.45,z-.45,x+.45,z+.45,2.6)}
  {const px=X+8.6,pz=Z-8.2;markR(px-2.2,pz-2.2,px+2.2,pz+2.2,.3)}}
/* the group: built on first need, shown only near the mountain */
function mtnGroup(on){const g=c4Group('dojomtn',on,mtnBuild);if(g)g.visible=!!on;return g}
/* the trail sign on the plaza where the sensei waits (campus side) */
function dojoTrail(on){return c4Group('dojotrail',on,g=>{const[x,z]=DOJO_AT,y=terrH(x,z),D=0x5a4028;c4M(bgeo(.16,2.4,.16),mt(D,.8),x-1,y+1.2,z-1.2,g);c4M(bgeo(.16,2.4,.16),mt(D,.8),x+1,y+1.2,z-1.2,g);
  try{const s=signMesh('MOUNTAIN TRAIL  ·  SENSEI AMBROSE  ·  6 AM',2.3,.5,'#f1eee4','#6e2a22','Georgia');s.position.set(x,y+1.9,z-1.12);g.add(s)}catch(e){}
  for(const sx of[-1,1]){const lx=x+sx*2,lz=z-1.2;c4M(bgeo(.5,.2,.5),mt(0x7c7e80,.95),lx,y+.1,lz,g);c4M(bgeo(.2,.7,.2),mt(0x7c7e80,.95),lx,y+.55,lz,g);c4M(bgeo(.46,.34,.46),new THREE.MeshStandardMaterial({color:0xf2d48a,emissive:0x7a5520,emissiveIntensity:.6}),lx,y+1.07,lz,g);c4M(bgeo(.62,.12,.62),mt(0x6a6c6e,.95),lx,y+1.3,lz,g)}})}
/* going up and down: a fade, like the Lake District */
function mtnGo(up){sfx('ui');fadeTo(()=>{if(up){mtnGroup(1);dojoYard(1);goOut(MTN.x+.6,MTN.z+MTN.R-2.2);P.face=PI}else goOut(DOJO_AT[0]+.6,DOJO_AT[1]+1.4);try{if(GREAL)setGoal(GREAL[0],GREAL[1])}catch(e){}toast(up?'The mountain':'Back on campus',1600)})}
const dojoUpOk=()=>!!(S&&S.done&&(S.done.dojo||(S.dojoUp&&AM&&AM.m.id==='dojo')));
function dojoPrompts(add){if(P.inside||!dojoOpen())return;if(mtnNear())add(MTN.x,MTN.z+MTN.R-1,2.8,'Head back down the mountain',()=>mtnGo(0),2);else if(S.dojoUp||(S.done&&S.done.dojo)){const[x,z]=DOJO_AT;if(Math.hypot(P.x-x,P.z-z)<6)add(x,z-1,3,'Ride up the mountain',()=>mtnGo(1),2)}}
