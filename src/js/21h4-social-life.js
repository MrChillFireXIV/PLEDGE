// ================================================================ V300 SOCIAL LIFE
// Campus people (the ambient ones that ambOK lets run free) no longer pick random points and drift there. Each one decides what to do
// next, with a reason, and the world shows it:
//   talk   walk over to someone nearby (they notice, turn, sometimes wave), stand together and talk: one speaks with hand gestures
//          while the others listen and nod, turns pass around, someone laughs; a third or fourth person may join; then goodbyes
//   errand walk to a building entrance (07b ENTL), go inside, come out of another door a while later
//   sit    walk to a bench seat and sit with a phone or a coffee, or just watch people
//   wander walk somewhere in their zone (some with their phone out, walking slower, head down; a few jog)
//   solo   phone, call, coffee, look around, stretch, selfie, photo… and dance once in a while (more on Greek Row at night)
//   watch  a fight nearby: they stop and watch, some film it, some put their hands on their head, some back off
// Static 'chat' pairs (spawned talking) take turns speaking and listening instead of both gesturing forever (chatTick).
// Called from npcUpd (21) via ambLife; poses live in ambPose (21h2). Stats for tests: socStats().
const SEATS=[];let SOCC=[];const SOCF={f:-1,pts:[]};
function seatAdd(x,z,a){const cx=Math.cos(a),sx=Math.sin(a);for(const s of[-.45,.45])SEATS.push({x:x+cx*s+sx*.02,z:z-sx*s+cx*.02,a,by:null,sx:x+cx*s+sx*.9,sz:z-sx*s+cx*.9})}
/* V301 all lines live in CHAT (21h5-dialogue-*.js) */
const angTo=(n,x,z,dt,k)=>{n.a+=((((Math.atan2(x-n.x,z-n.z)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*(k||4))};
const socVis=m=>m&&NP.includes(m)&&m.g&&m.g.visible&&!m.hidden&&!m.down;
function socFree(m){return socVis(m)&&m.al&&m.al.k==='act'&&!m.al.cv&&ambOK(m)&&!m.aggro}
// what a person does when standing around (context-weighted): phone most, dancing rarely except on Greek Row at night
function socAct(n){const night=NIGHT>.55,row=n.zone==='greek'||n.zone==='greekN';const W=[['phone',5],['call',2],['coffee',2],['look',3],['stretch',.8],['dance',night&&row?3:.35],['selfie',.8],['pic',.8],['pose',.6],['tie',.4],['wave',.6],['pray',.03]];
  let s=0;for(const a of W)s+=a[1];let r=rnd()*s;for(const a of W){r-=a[1];if(r<=0)return a[0]}return'phone'}
function socSet(n,A,k,o){A.k=k;A.t=0;A.goal=null;n.path=null;Object.assign(A,o||{})}
function socAt(n,A,act,t){socSet(n,A,'act',{act:act||socAct(n),t:t||4+rnd()*9});ambStart(n,A)}
// once per frame: where fights are happening (anyone fighting outdoors, or Danny just landed a hit)
function socFights(){if(SOCF.f===TT)return SOCF.pts;SOCF.f=TT;const L=SOCF.pts=[];if(P.inside)return L;
  for(const m of NP)if(m.aggro&&!m.down&&!m.int&&m.g.visible)L.push([m.x,m.z]);if(P.lastHit&&TT-P.lastHitT<4)L.push([P.x,P.z]);return L}

// ---------------------------------------------------------------- the state machine
function ambLife(n,dt){let A=n.al;if(!A){A=n.al={k:'act',t:1+rnd()*6,act:socAct(n)};n.ws=n.ws||1.18+rnd()*.32;n.lst=n.lst==null?(rnd()<.45?1:0):n.lst;ambStart(n,A)}
  n.alPose=null;n.alSub=null;
  if(A.k!=='away'&&A.k!=='watch'&&(A.rt=(A.rt||0)-dt)<=0){A.rt=.6;const F=socFights();for(const f of F){const d=Math.hypot(f[0]-n.x,f[1]-n.z);if(d<16&&d>1.5){socWatch(n,A,f);break}}}
  switch(A.k){
    case'act':{A.t-=dt;if(n.dp<1.8)angTo(n,P.x,P.z,dt,3);else if(A.act==='wave'&&A.fr&&NP.includes(A.fr))angTo(n,A.fr.x,A.fr.z,dt,3);
      if(A.t<=0)socDecide(n,A);n.alPose=A.k==='act'?A.act:n.alPose;return A.act==='wave'?'wave':''}
    case'wait':return socWait(n,A,dt);
    case'go':return socGo(n,A,dt);
    case'talk':return convTick(n,A,dt);
    case'sit':return socSit(n,A,dt);
    case'away':return socAway(n,A,dt);
    case'watch':return socWatchTick(n,A,dt);
    case'bye':{A.t-=dt;if(A.t<=0)socDecide(n,A);return'wave'}}
  return''}

// pick the next thing to do, with a reason; anything that can't happen falls through to the next option
function socDecide(n,A){const home=n.mode==='idle',night=NIGHT>.55,opts=[['talk',.3],['join',.1],['door',home?0:(night?.28:.17)],['seat',.12],['wander',home?.16:.22],['act',.16]];
  let s=0;for(const o of opts)s+=o[1];let r=rnd()*s,first=opts.length-1;for(let i=0;i<opts.length;i++){r-=opts[i][1];if(r<=0){first=i;break}}
  for(let i=0;i<opts.length;i++){const k=opts[(first+i)%opts.length][0];if(k==='act'){socAt(n,A);return}
    if(k==='talk'&&socTalkStart(n,A,home?9:22))return;if(k==='join'&&socJoin(n,A,home?8:18))return;if(k==='door'&&socDoor(n,A))return;if(k==='seat'&&socSeat(n,A,home?10:26))return;if(k==='wander'&&socWander(n,A))return}
  socAt(n,A)}

// talk: pick someone free nearby, they wait for you (and wave when you get close), you walk over
function socTalkStart(n,A,R){let best=null,bd=1e9;for(const m of NP){if(m===n||!m.g.visible)continue;const d=Math.hypot(m.x-n.x,m.z-n.z);if(d<R&&d>1.6&&d<bd&&socFree(m)&&m.cl!=='police'&&m.cl!=='cops'){best=m;bd=d}}
  if(!best)return false;const B=best.al;socSet(best,B,'wait',{fr:n,t:25});socSet(n,A,'go',{goal:{k:'friend',ref:best}});return true}
function socWait(n,A,dt){const m=A.fr;A.t-=dt;if(!socVis(m)||!m.al||m.al.k!=='go'||!m.al.goal||m.al.goal.ref!==n||A.t<=0){socAt(n,A,'look',2+rnd()*3);return''}
  angTo(n,m.x,m.z,dt,2.5);const d=Math.hypot(m.x-n.x,m.z-n.z);if(d<8&&!A.wv){A.wv=1;if(rnd()<.55){A.wt=1.3}}
  if(A.wt>0){A.wt-=dt;return'wave'}n.alPose='look2';return''}
// join a conversation with room for one more
function socJoin(n,A,R){SOCC=SOCC.filter(c=>c.m.length>1&&!c.done);for(const c of SOCC){if(c.m.length>=4||c.end-TT<8)continue;const d=Math.hypot(c.cx-n.x,c.cz-n.z);if(d>R||d<1.2)continue;
    A.k='go';A.t=0;n.path=null;A.goal={k:'join',ref:c};return true}return false}
// errand: a building entrance within reach; walk up, go in, come out later from another door
function socDoor(n,A){if(typeof ENTL==='undefined'||!ENTL.length)return false;const C=[];for(const e of ENTL){const x=e[0]+e[2]*1.3,z=e[1]+e[3]*1.3,d=Math.hypot(x-n.x,z-n.z);if(d>5&&d<27&&freeAt(x,z,.4))C.push(e)}
  if(!C.length)return false;const e=pick(C);socSet(n,A,'go',{goal:{k:'door',e,x:e[0]+e[2]*1.3,z:e[1]+e[3]*1.3}});return true}
function socSeat(n,A,R){let best=null,bd=1e9;for(const s of SEATS){if(s.by)continue;const d=Math.hypot(s.sx-n.x,s.sz-n.z);if(d<R&&d<bd&&freeAt(s.sx,s.sz,.35)){best=s;bd=d}}
  if(!best)return false;best.by=n;socSet(n,A,'go',{goal:{k:'seat',s:best,x:best.sx,z:best.sz},seat:best});return true}
function socWander(n,A){if(n.mode==='idle'){for(let i=0;i<6;i++){const a=rnd()*TAU,d=2+rnd()*7,x=n.hx+Math.cos(a)*d,z=n.hz+Math.sin(a)*d;if(freeAt(x,z,.4)&&!(typeof inLane==='function'&&inLane(x,z))){socSet(n,A,'go',{goal:{k:'spot',x,z}});return true}}return false}
  socSet(n,A,'go',{goal:{k:'zone'}});return true}

// walking somewhere on purpose
function socGo(n,A,dt){const G=A.goal;if(!G){socAt(n,A);return''}
  if(A.mode==null){const r=rnd();A.mode=G.k==='friend'||G.k==='join'?(r<.12?'phone':''):(r<.2?'phone':r<.27?'jog':'');A.to=40;if(n.dp<14&&G.k!=='friend'&&G.k!=='join'&&rnd()<.06&&(!n.bub||!n.bub.visible))bubble(n,dlgLine(CHAT.solo.walk),2)}
  A.to-=dt;if(A.to<=0){socGiveUp(n,A);return''}
  let tx=G.x,tz=G.z;
  if(G.k==='friend'){const m=G.ref;if(!socVis(m)||!m.al||m.al.k!=='wait'||m.al.fr!==n){socGiveUp(n,A);return''}const dx=n.x-m.x,dz=n.z-m.z,d=Math.hypot(dx,dz)||1;tx=m.x+dx/d*1.15;tz=m.z+dz/d*1.15;
    if(d<1.5){convStart([m,n]);return'talk'}}
  else if(G.k==='join'){const c=G.ref;if(c.done||c.m.length<2||c.m.length>=4){socGiveUp(n,A);return''}const s=convSlot(c);tx=s[0];tz=s[1];if(Math.hypot(tx-n.x,tz-n.z)<.55||Math.hypot(c.cx-n.x,c.cz-n.z)<1.1){convAdd(c,n);return'talk'}}
  else if(G.k==='zone'&&!n.path){if(navBudget<=0)return'';navBudget--;newWander(n);if(!n.path){socAt(n,A);return''}G.k='zpath'}
  const sp=A.mode==='jog'?4.6:A.mode==='phone'?.95:n.ws;
  if(G.k==='zpath'){if(follow(n,sp,dt)){n.path=null;socArrive(n,A);return''}}
  else{const far=Math.hypot(tx-n.x,tz-n.z);
    if(G.k==='friend'||G.k==='join'){if((!n.path||(A.rp=(A.rp||0)-dt)<=0)&&far>2.2){if(navBudget<=0)return'';navBudget--;A.rp=1.2;const B=navBFS(n.x,n.z,tx,tz,null,0);if(B.found<0){socGiveUp(n,A);return''}n.path=navPath(B,B.found,n.x,n.z);n.pi2=0}
      if(far<=2.2){n.path=null;if(moveTo(n,tx,tz,n.ws,dt)===false){socGiveUp(n,A);return''}}else follow(n,sp,dt)}
    else{if(!n.path){if(navBudget<=0)return'';navBudget--;const B=navBFS(n.x,n.z,tx,tz,null,0);if(B.found<0){socGiveUp(n,A);return''}n.path=navPath(B,B.found,n.x,n.z);n.pi2=0}
      if(follow(n,sp,dt)){n.path=null;socArrive(n,A);return''}}}
  if(n.dp<1.4&&Math.hypot(P.vx||0,P.vz||0)>4&&rnd()<dt*1.2&&(!n.bub||!n.bub.visible))bubble(n,dlgLine(CHAT.bump),1.6);
  if(A.mode==='phone')n.alPose='phoneWalk';return''}
function socGiveUp(n,A){if(A.seat&&A.seat.by===n)A.seat.by=null;A.seat=null;socAt(n,A,'look',2+rnd()*3)}
function socArrive(n,A){const G=A.goal;
  if(G.k==='door'){const e=G.e;socSet(n,A,'away',{e,t:-1,ph:0});return}
  if(G.k==='seat'){const s=G.s;if(s.by!==n){socAt(n,A);return}n.x=s.x;n.z=s.z;n.a=s.a;const r=rnd();socSet(n,A,'sit',{seat:s,t:18+rnd()*50,sub:r<.55?'phone':r<.72?'coffee':''});if(n.dp<14&&rnd()<.3)bubble(n,dlgLine(CHAT.solo.sit),2.2);return}
  socAt(n,A,null,3+rnd()*7)}

// errand: step up to the door, disappear inside, come out of another door later
function socAway(n,A,dt){const e=A.e;
  if(A.ph===0){const dx=e[0]+e[2]*.35,dz=e[1]+e[3]*.35;angTo(n,e[0],e[1],dt,6);const r=moveTo(n,dx,dz,1.1,dt);if(r===true||r===false||Math.hypot(dx-n.x,dz-n.z)<.25){A.ph=1;A.t=20+rnd()*90}return''}
  n.g.visible=false;if(n.tag)n.tag.visible=false;A.t-=dt;
  if(A.t<=0){const C=ENTL.filter(q=>Math.hypot(q[0]-e[0],q[1]-e[1])<45&&freeAt(q[0]+q[2]*1.2,q[1]+q[3]*1.2,.4)),o=C.length?pick(C):e;
    n.x=o[0]+o[2]*.5;n.z=o[1]+o[3]*.5;n.a=Math.atan2(o[2],o[3]);n.g.visible=n.dp<60;socSet(n,A,'go',{goal:{k:'spot',x:o[0]+o[2]*3.5,z:o[1]+o[3]*3.5}})}
  return''}
function socSit(n,A,dt){A.t-=dt;const s=A.seat;n.x=s.x;n.z=s.z;n.a=s.a;n.alPose='sit';n.alSub=A.sub;if(A.t<=0){s.by=null;A.seat=null;n.x=s.sx;n.z=s.sz;socDecide(n,A)}return'sit'}

// a fight nearby: stop and watch (film it, hands on head, or back off a bit)
function socWatch(n,A,f){if(A.cv)convLeave(n,A.cv);if(A.seat&&A.seat.by===n){const s=A.seat;s.by=null;n.x=s.sx;n.z=s.sz}A.seat=null;
  const r=rnd();socSet(n,A,'watch',{fx:f[0],fz:f[1],t:7+rnd()*7,how:r<.35?'pic':r<.6?'shock':'look2',back:rnd()<.2?1.6:0});
  if(n.dp<18&&rnd()<.3)bubble(n,dlgLine(CHAT.watch),2)}
function socWatchTick(n,A,dt){A.t-=dt;angTo(n,A.fx,A.fz,dt,5);const F=socFights();let live=false;for(const f of F)if(Math.hypot(f[0]-A.fx,f[1]-A.fz)<8){live=true;A.fx=f[0];A.fz=f[1]}
  if(!live)A.t=Math.min(A.t,2.5);if(A.back>0){const dx=n.x-A.fx,dz=n.z-A.fz,d=Math.hypot(dx,dz)||1;if(moveTo(n,n.x+dx/d,n.z+dz/d,2.2,dt)===false)A.back=0;else A.back-=dt*2.2;return''}
  n.alPose=A.how;if(A.t<=0)socAt(n,A,'look',2+rnd()*3);return''}

// ---------------------------------------------------------------- conversations
function convStart(ms){const cx=ms.reduce((s,m)=>s+m.x,0)/ms.length,cz=ms.reduce((s,m)=>s+m.z,0)/ms.length;
  /* the one who walked over (last) opens; lines of a script alternate between speakers */
  const c={m:[],cx,cz,sp:ms.length-1,cur:ms[ms.length-1],sw:1.8+rnd()*.6,end:TT+600,lines:dlgConv(ms[0]),ti:0,laugh:0,done:0,B:{}};SOCC.push(c);for(const m of ms)convAdd(c,m,1);
  const g=ms[ms.length-1];if(g.dp<16&&rnd()<.6)bubble(g,dlgLine(CHAT.hi,c.B),1.6);return c}
function convAdd(c,m,first){const A=m.al;if(!A)return;socSet(m,A,'talk',{cv:c});if(!c.m.includes(m))c.m.push(m);if(!first){if(m.dp<16&&rnd()<.4)bubble(m,dlgLine(CHAT.hi,c.B),1.4)}}
function convLeave(m,c){c.m=c.m.filter(q=>q!==m);if(m.al)m.al.cv=null;if(c.m.length<2){c.done=1;for(const q of c.m)if(q.al&&q.al.cv===c){q.al.cv=null;socAt(q,q.al,'look',1.5+rnd()*2)}}}
// a free spot on the circle round the group (the middle of the widest gap)
function convSlot(c){const r=c.m.length>=2?.85:.6,a=c.m.map(m=>Math.atan2(m.x-c.cx,m.z-c.cz)).sort((x,y)=>x-y);let ga=0,gw=-1;for(let i=0;i<a.length;i++){const w=((a[(i+1)%a.length]-a[i])+TAU)%TAU||TAU;if(w>gw){gw=w;ga=a[i]+w/2}}return[c.cx+Math.sin(ga)*r,c.cz+Math.cos(ga)*r]}
function convTick(n,A,dt){const c=A.cv;if(!c||c.done){socAt(n,A,'look',2);return''}
  c.m=c.m.filter(m=>m.al&&m.al.cv===c&&socVis(m));if(c.m.length<2){convLeave(n,c);return''}
  const lead=c.m[0];if(n===lead){c.sw-=dt;c.laugh-=dt;
    if(c.sw<=0){const k=c.m.length;
      if(c.ti>=c.lines.length){if(rnd()<.3){c.lines=dlgConv(c.m[0]);c.ti=0;c.B={};c.sw=1.2}else c.end=0}
      else{const sp=c.m[c.sp%k],line=c.lines[c.ti++];c.cur=sp;if(sp.dp<16)bubble(sp,line,Math.min(4.4,1.7+line.length*.06));c.sw=1.6+line.length*.055+rnd()*.7;
        c.sp=k>2?(c.sp+1+Math.floor(rnd()*(k-1)))%k:(c.sp+1)%k;
        const l=c.m.filter(m=>m!==sp);const ls=l.length?l[Math.floor(rnd()*l.length)]:null;
        if(ls&&rnd()<.16){c.laugh=1.6;if(ls.dp<16&&rnd()<.6)bubble(ls,dlgLine(CHAT.laugh,c.B),1.6)}else if(ls&&ls.dp<16&&rnd()<.1&&k>2)bubble(ls,dlgLine(CHAT.react,c.B),1.5)}}
    if(TT>c.end){c.done=1;for(const m of c.m){if(m.al&&m.al.cv===c){m.al.cv=null;socSet(m,m.al,'bye',{t:1+rnd()*.8});if(m.dp<15&&rnd()<.45)bubble(m,dlgLine(CHAT.bye,c.B),1.5)}}return'wave'}}
  /* stand on the circle, facing the speaker (the speaker faces the group) */
  const r=c.m.length>2?.85:.62,a=Math.atan2(n.x-c.cx,n.z-c.cz),hx=c.cx+Math.sin(a)*r,hz=c.cz+Math.cos(a)*r;if(Math.hypot(hx-n.x,hz-n.z)>.12)moveTo(n,hx,hz,.8,dt);
  const sp=c.m.includes(c.cur)?c.cur:c.m[0];if(sp===n){angTo(n,c.cx,c.cz,dt,3);n.alPose='talkS';return'talk'}
  angTo(n,sp.x,sp.z,dt,3);n.alPose=c.laugh>0&&n!==sp?'laugh':'talkL';if(n.dp<1.6)angTo(n,P.x,P.z,dt,1.5);return''}

// static pairs spawned talking (mode 'chat'): take turns instead of both talking forever
function chatTick(n,dt){if(!n.chP||!socVis(n.chP)||n.chP.mode!=='chat'||(n.chT=(n.chT||0)-dt)<=0){n.chT=3;n.chP=null;let bd=2.6;for(const m of NP){if(m===n||m.mode!=='chat'||!m.g.visible)continue;const d=Math.hypot(m.x-n.x,m.z-n.z);if(d<bd){bd=d;n.chP=m}}}
  const m=n.chP;if(!m){n.alPose='phone';return''}angTo(n,m.x,m.z,dt,2);
  const seed=((n.x+m.x)*13.7+(n.z+m.z)*7.1)%17,ph=Math.floor((TT+Math.abs(seed))/3.4),me=(n.x+n.z*1.31)<(m.x+m.z*1.31),speak=(ph%2===0)===me;
  /* the pair shares a script: each new turn the speaker says the next line (bubbles only near Danny) */
  const C=n.chC&&n.chC===m.chC?n.chC:(m.chC&&m.chC.p===n?m.chC:null)||(n.chC={p:m,lines:dlgConv(n),i:0,ph:-1});n.chC=C;m.chC=C;
  /* V362 a person says at most one line every 3.4 s. In a big group (five sorority sisters on a lawn) people kept re-pairing, two pairs overwrote each
     other's shared script every frame, and someone like Hailey Z. fired a new bubble every frame */
  if(speak&&C.ph!==ph&&TT-(n.saidT||-99)>=3.4){C.ph=ph;n.saidT=TT;if(C.i>=C.lines.length){C.lines=dlgConv(n);C.i=0}const line=C.lines[C.i++];if(n.dp<14&&rnd()<.75)bubble(n,line,Math.min(3.2,1.6+line.length*.05))}
  if(speak){n.alPose='talkS';return'talk'}n.alPose=(ph%5===3)?'laugh':'talkL';return''}

function socStats(){const S_={};let seated=0;for(const n of NP){if(!n.al||!n.g)continue;const k=n.al.k;S_[k]=(S_[k]||0)+1}for(const s of SEATS)if(s.by)seated++;return{states:S_,convs:SOCC.filter(c=>!c.done&&c.m.length>1).length,seats:SEATS.length,seated}}
