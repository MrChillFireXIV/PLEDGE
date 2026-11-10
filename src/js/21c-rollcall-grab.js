// ================================================================ V116 roll-call grab
// If Danny isn't inside the gold roll-call perimeter when roll call starts, the ASR pledgemaster appears behind him, grabs him by the
// neck one-handed, hoists him up and sprints him back to the ASR lawn, eyes glowing red. The camera is Danny's own point of view,
// dangling above the pledgemaster. Inside the perimeter he's dropped and the normal camera comes back.
const GRAB={on:0};
const GRAB_LINES=['"Why are you out so late, pledge?"',"\"Don't let me get angry with you now.\"",'"Roll call is at SIX. Not six-oh-one. SIX."','"You think this is a game, Kowalski?"','"Next time I won\'t be this nice."'];
// the eyes are drawn from the character's palette, so the glow is done by swapping the iris/eye-white palette entries for over-bright red
function grabEyes(pm,on){const pal=pm.g&&pm.g.P&&pm.g.P.pal;if(!pal||!pal[PS.iris])return;
  if(on){if(!pm.eyeSave)pm.eyeSave=[pal[PS.iris].clone(),pal[PS.eyeW].clone(),pal[PS.dark]&&pal[PS.dark].clone()];pal[PS.iris].set(6,.35,.12,.05);pal[PS.eyeW].set(2.2,.1,.06,.05)}
  else if(pm.eyeSave){pal[PS.iris].copy(pm.eyeSave[0]);pal[PS.eyeW].copy(pm.eyeSave[1]);pm.eyeSave=null}}
function grabStart(pm){
  if(P.inside){const b=B.find(b=>b.id===P.inside||b.id+'_up'===P.inside);goOut(b?b.ex:RC_ME[0]-6,b?b.ez:RC_ME[1])}
  P.bike=0;P.vx=P.vz=0;P.jy=0;P.jv=0;P.roll=0;P.punch=0;if(P.med)try{toggleMed()}catch(e){}
  pm.int=null;pm.path=null;pm.job=null;pm.aggro=0;pm.grab=1;pm.sp=0;
  const bx=P.x-Math.sin(P.face)*.9,bz=P.z-Math.cos(P.face)*.9;if(freeAt(bx,bz,.3)){pm.x=bx;pm.z=bz}else{pm.x=P.x;pm.z=P.z}pm.a=Math.atan2(P.x-pm.x,P.z-pm.z);
  if(pm.g){pm.g.visible=true;if(!pm.g.parent)sc.add(pm.g)}
  const T=[81.4,clamp(P.z,60,92)],near=Math.hypot(T[0]-P.x,T[1]-P.z)<40&&losPW([P.x,P.z],T);
  Object.assign(GRAB,{on:1,pm,moved:0,t:0,ph:'lift',pt:0,far:!near,route:near?[T]:null,ri:0,lt:1.1,li:0,hx:P.x,hz:P.z,h:0});
  grabEyes(pm,1);PM.visible=false;try{sfx('bad')}catch(e){}try{voxOof&&voxOof(DANNY)}catch(e){}
  for(const k in K)K[k]=0}
// where Danny dangles: just in front of the pledgemaster's raised hand
function grabHold(){const pm=GRAB.pm,a=pm.a;return[pm.x+Math.sin(a)*.75,pm.z+Math.cos(a)*.75]}
// V117 his lines appear in a speech balloon over his head, typed out with his voice, like every other conversation
function grabSay(pm,l){let b=GRAB.bal;if(!b){b=GRAB.bal=document.createElement('div');b.className='gbal';b.innerHTML='<div class="gn"></div><div class="gl"></div>';document.body.appendChild(b)}
  b.querySelector('.gn').textContent=pm.name+' · ΑΣΡ Pledgemaster';b.hidden=false;try{typeOut(b.querySelector('.gl'),l,pm,0,null)}catch(e){b.querySelector('.gl').textContent=l}}
function grabBalPos(){const b=GRAB.bal,pm=GRAB.pm;if(!b||b.hidden||!pm)return;const v=new THREE.Vector3(pm.x,terrH(pm.x,pm.z)+2.3,pm.z).project(cam);
  b.style.left=clamp((v.x*.5+.5)*innerWidth,180,innerWidth-180)+'px';b.style.top=clamp((-v.y*.5+.5)*innerHeight,120,innerHeight*.6)+'px'}
function grabTick(dt){const G=GRAB,pm=G.pm;if(!pm||!NP.includes(pm)){grabEnd(true);return}G.t+=dt;G.pt+=dt;ePress=0;if(pm.tag)pm.tag.visible=false;
  const say=()=>{const l=GRAB_LINES[G.li%GRAB_LINES.length];G.li++;grabSay(pm,l)};
  if(G.ph==='lift'){pm.a=Math.atan2(G.hx-pm.x,G.hz-pm.z);G.h=tcSm(G.pt/.55);if(G.pt>=.55){G.ph='run';G.pt=0;say()}}
  else if(G.ph==='run'||G.ph==='run2'){
    if((G.lt-=dt)<=0){G.lt=2.4;say()}
    if(G.ph==='run'&&G.far){const tx=72.4,tz=pm.z+(76>pm.z?18:-18);navTo(pm,tx,tz,8.5,dt);if(G.pt>2.2){G.ph='fade';G.pt=0;$('fade').style.opacity=1}}
    else{const w=G.route[G.ri];navTo(pm,w[0],w[1],8.5,dt);if(Math.hypot(w[0]-pm.x,w[1]-pm.z)<.8&&G.ri<G.route.length-1)G.ri++}
    const[hx,hz]=grabHold();if(hx>RC_BOX[0]+.4&&hx<RC_BOX[2]&&hz>RC_BOX[1]&&hz<RC_BOX[3]){G.ph='drop';G.pt=0;say()}}
  else if(G.ph==='fade'){if(G.pt>.35&&!G.moved){G.moved=1;const sg=G.hz>76?1:-1,z0=76+sg*24;pm.x=72.4;pm.z=z0;pm.path=null;G.route=[[72.6,76+sg*5],[81.4,76+sg*1.2]];G.ri=0;pm.a=sg>0?PI:0;$('fade').style.opacity=0}
    if(G.pt>.5){G.ph='run2';G.pt=0}}
  else if(G.ph==='drop'){pm.sp=0;G.h=1-tcSm(G.pt/.45);if(G.pt>=.5){grabEnd(false);return}}
  if(G.t>16){grabEnd(true);return}
  // pose: the pledgemaster sprints with his right arm locked out and up, Danny hanging from it
  const sp=G.ph==='run'||G.ph==='run2'?8.5:0,gy=terrH(pm.x,pm.z);pm.g.position.set(pm.x,gy,pm.z);pm.g.rotation.set(0,pm.a,0);
  try{animP(pm.g,sp,TT,'')}catch(e){}const pp=pm.g.P;if(pp&&pp.aR){pp.aR.rotation.x=-2.25-.08*Math.sin(TT*14);pp.aR.rotation.z=.15}
  const[hx,hz]=G.ph==='lift'?[lerp(G.hx,grabHold()[0],G.h),lerp(G.hz,grabHold()[1],G.h)]:grabHold();P.x=hx;P.z=hz;P.face=pm.a+PI;
  {const pal=pm.g.P&&pm.g.P.pal;if(pal&&pm.eyeSave){const k=5+1.5*Math.sin(TT*9);pal[PS.iris].x=k}}}
function grabEnd(force){const G=GRAB,pm=G.pm;G.on=0;G.moved=0;if(G.bal){G.bal.hidden=true;try{typeStop(true)}catch(e){}}$('fade').style.opacity=0;
  if(pm){grabEyes(pm,0);pm.grab=0;pm.path=null;pm.job=null}
  if(force||!(P.x>RC_BOX[0]&&P.x<RC_BOX[2]&&P.z>RC_BOX[1]&&P.z<RC_BOX[3])){P.x=RC_ME[0];P.z=RC_ME[1]+1.5}
  if(!freeAt(P.x,P.z,.34)){for(let d=.3;d<3;d+=.3){let ok=false;for(let a=0;a<8;a++){const x=P.x+Math.cos(a*PI/4)*d,z=P.z+Math.sin(a*PI/4)*d;if(freeAt(x,z,.34)){P.x=x;P.z=z;ok=true;break}}if(ok)break}}
  P.y=0;P.flatT=0;P.vx=P.vz=0;P.face=PI/2;yaw=P.face+PI;PM.visible=true;try{maLand&&maLand(1)}catch(e){}}
// Danny's eyes: dangling over the pledgemaster's head, looking down into his face
function grabCam(dt){const G=GRAB,pm=G.pm;const gy=terrH(P.x,P.z),lift=G.h*.62,run=G.ph==='run'||G.ph==='run2';
  const sh=run?.045:.015,bx=Math.sin(TT*17)*sh,by=Math.abs(Math.sin(TT*8.5))*sh*1.6;
  cam.position.set(P.x+bx,gy+1.62+lift+by,P.z);const fy=terrH(pm.x,pm.z)+1.72;cam.lookAt(pm.x+Math.sin(pm.a)*.12,fy,pm.z+Math.cos(pm.a)*.12);grabBalPos()}
