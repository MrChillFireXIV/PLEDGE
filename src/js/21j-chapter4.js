// ================================================================ V128 CHAPTER 4 · HOMECOMING (the Lantern Walk finale moves to chapter 5)
// Four new chapters move into the houses the cops shut down. ΑΣΡ is paired with a sorority for Homecoming week; the three star football
// players come to the party; the quarterback overdoses in the upstairs stash room; Danny saves him and then has to start the game.
//  c4welcome Welcome to Homecoming  meet the sorority president, introduce yourself to four members, help Grant plan the weekend
//  c4games   Greek Games            the kickoff at Nippert, the relay, the tug-of-war, the partner egg toss
//  c4stars   The All-Stars          meet the three stars, keep the games organized, keep the stars happy, face one of them
//  c4party   Homecoming Party       help Grant run the party, find a side piece, find Brett, the disturbance upstairs (last)
//  c4qb      Quarterback Crack      CPR on Trey Lawson, carry him down to Marcus and Deion, the ambulance
//  c4game    The Unexpected Starter the practice facility, Coach Brennan, three plays, the opening drive, the last-second touchdown
// This file: renumbering, the new houses, shared helpers, effects and the small games. The football engine and the quests are in 21k.
const C4={cast:{},mine:[],pups:[],frN:[],frM:{},applied:0,orig:{},stand:null,band:null,fx:[],keys:null,tap:null,cam:null,dan:null,carry:null,props:{},relay:null,chainT:-99,T:0,song:null};
const C4IDS=['c4welcome','c4games','c4stars','c4party','c4qb','c4game'];
const c4S=()=>S.c4||(S.c4={soro:null,met:{},org:{},fun:{},party:{},clue:{},face:null,plays:{},side:null,hold:null});

// ---------------------------------------------------------------- the Lantern Walk becomes chapter 5
for(const m of M)if(m.ch===4)m.ch=5;
CHN[4]='Homecoming';CHN[5]='The Lantern Walk';CHN[6]='Epilogue';
CHT[5]=CHT[4];
CHT[4]='Four houses on Greek Row went dark. Four new ones opened in the same buildings before the police tape hit the ground.\n\nHomecoming week. Every chapter gets paired with a sorority, the Games run all Friday, and on Saturday the whole campus packs into Nippert.\n\nGrant wants the Homecoming Cup on the mantel.';
XPM[5]=XPM[4];XPM[4]=100;

// ---------------------------------------------------------------- the four new chapters (in the shut-down houses) and the teams
//  old house, new id, letters, name, clique, shirt, letter colour, president
const C4FR=[['kto','dto','ΔΤΩ','Delta Tau Omega','legacies',0x2a6a8a,'#f2f2ee','Derek Vance'],
 ['opd','ble','ΒΛΕ','Beta Lambda Epsilon','studentgov',0xd8742a,'#1d1d22','Nolan Pike'],
 ['kan','sdr','ΣΔΡ','Sigma Delta Rho','athletes',0x4a2a7a,'#e2b64c','Jace Moreno'],
 ['gwz','gge','ΓΓΗ','Gamma Gamma Eta','legacies',0x2f7a3a,'#f2efe6','Silas Okoro']];
for(const[,k,L,,,shirt,lc]of C4FR)HOUSE[k]={L,shirt,lc};
Object.assign(HOUSE,{hawks:{L:'H',shirt:0xb81f2e,lc:'#f6f2ea'},wolves:{L:'CV',shirt:0xeeeee8,lc:'#1f5a3a'},scout:{L:'S',shirt:0x7a7e84,lc:'#f2f2ee'}});
const C4SORO=['kkg','tpa','chio','phimu','kd','atht','psr'];
// the four sisters Danny meets: [name, what they say when he introduces himself, what they say back]
const C4MEM=[['Madison Cole','"Madison. I\'m your partner for the Games, apparently. I\'ve won the egg toss three years running. Don\'t drop anything."','"We\'ll see."'],
 ['Brooke Hayden','"Brooke. Social chair. If your house plays the same four songs at the party, I am leaving. I mean it."','"Noted. No four songs."'],
 ['Sienna Park','"Sienna. Pre-med. I\'m the one sober enough to drive people home. You\'re welcome, in advance."','"Thank you, in advance."'],
 ['Jordan Ellis','"Oh my god, you\'re the pledge with the propeller hat! I love the hat. Can I wear the hat? Later. I\'m wearing the hat later."','"…Sure?"']];
Object.assign(ACT,{
  'Kayla Brooks':['studentgov',{name:'Kayla Brooks',title:'Homecoming Emcee',fem:true}],
  'Coach Hal Brennan':['athletes',{name:'Coach Hal Brennan',title:'Head Coach · Harrowgate Hawks',lvl:10}],
  'Mia Torres':['activists',{name:'Mia Torres',title:'HCN Campus News',fem:true}],
  'Hollis Grady':['brothers',{name:'Hollis Grady',title:'ΑΣΡ Senior Brother',house:'asr'}]});
function c4Soro(){const s=c4S();if(!s.soro||!FRATS.find(f=>f.id===s.soro))s.soro=pick(C4SORO);const F=FRATS.find(f=>f.id===s.soro),b=B.find(b=>b.id===s.soro);return{id:s.soro,L:F.L,name:(b&&b.name)||F.L,pres:F.pres,b}}
const c4Pres=()=>{const so=c4Soro();return so.pres+' · '+so.L+' President'};
const c4Mate=()=>C4MEM[0][0];   // Madison is Danny's partner for the Games

// ---------------------------------------------------------------- field coordinates on Nippert (u along the field toward the far end zone, v across)
const c4F=(u,v)=>[STAD.cx+STAD.ux*u+STAD.vx*v,STAD.cz+STAD.uz*u+STAD.vz*v];
const c4A=(du,dv)=>Math.atan2(STAD.ux*du+STAD.vx*dv,STAD.uz*du+STAD.vz*dv);   // facing angle for a direction on the field
const c4UV=(x,z)=>{const dx=x-STAD.cx,dz=z-STAD.cz;return[dx*STAD.ux+dz*STAD.uz,dx*STAD.vx+dz*STAD.vz]};
const c4FY=()=>terrH(STAD.cx,STAD.cz);
const c4P3=(u,v,h=0)=>{const[x,z]=c4F(u,v);return[x,terrH(x,z)+h,z]};

// ---------------------------------------------------------------- small helpers
const c4Sl=ms=>new Promise(r=>setTimeout(r,ms));
const c4LA=(a,b,k)=>{let d=((b-a+PI)%TAU+TAU)%TAU-PI;return a+d*k};
function c4At(h){if(h<=S.gt-.01){S.day++;try{newDay()}catch(e){}}S.gt=h}
async function c4Fade(f){const e=$('fade');e.style.opacity=1;await c4Sl(480);try{await f()}catch(err){console.warn('c4Fade',err)}await c4Sl(60);e.style.opacity=0}
const c4Wt=s=>CINE&&!CINE.skipped?c1Wait(s):Promise.resolve();
const c4Live=n=>n&&NP.includes(n);
function c4Cast(nm){const n=C4.cast[nm];if(!c4Live(n)||n.hidden)return null;if((n.int||null)!==(P.inside||null))return null;return Math.hypot(n.x-P.x,n.z-P.z)<30?n:null}
function c4Next(id){C4.chainT=TT;setTimeout(()=>{if(!AM&&!S.done[id]){const m=M.find(x=>x.id===id);if(m)startMission(m)}},1400)}
// a chapter 4 character who stays for the scene (tagged so the scene can clear its own people)
function c4Person(cl,x,z,a,o={}){const int=o.int!==undefined?o.int:(P.inside||null);
  const n=spawn(cl,int||o.zone||'greek',Object.assign({x,z,a,temp:1,mode:'idle',lvl:o.lvl||4,fem:false},o,{int:int||undefined}));
  n.hx=x;n.hz=z;n.ha=a;n.a=a;n.c4tag=o.tag||'scene';if(n.g){n.g.rotation.y=a;n.g.visible=true}if(o.name)C4.cast[o.name]=n;C4.mine.push(n);return n}
// a puppet: positioned, turned and animated by this file every frame (npcUpd skips anyone with n.grab)
function c4Pup(cl,x,z,a,o={}){const n=c4Person(cl,x,z,a,o);n.grab=1;n.actor=1;n.noTalk=1;n.pup={tx:x,tz:z,v:o.v||3.4,st:o.st||'',y:o.y,t:rnd()*9,face:a,lean:0,lie:0};if(n.g)n.g.rotation.order='YXZ';C4.pups.push(n);c4PupPlace(n,0);return n}
function c4PupPlace(n,dt){const p=n.pup,g=n.g;if(!g)return;const y=p.y!=null?p.y:terrH(n.x,n.z);n.y=y;
  g.position.set(n.x,y+(p.lie?.16:0)+(p.dy||0),n.z);g.rotation.x=p.lie?-PI/2*p.lie:-p.lean;g.rotation.z=p.shake?Math.sin(TT*31+p.t)*.05*p.shake:0}
function c4To(n,x,z,v){if(!n||!n.pup)return;n.pup.tx=x;n.pup.tz=z;if(v)n.pup.v=v}
function c4ToF(n,u,v,s){const[x,z]=c4F(u,v);c4To(n,x,z,s)}
function c4Face(n,a){if(n&&n.pup){n.pup.face=a;n.pup.look=null}}
function c4Look(n,x,z){if(n&&n.pup)n.pup.look=[x,z]}
function c4PupUpd(dt){for(let i=C4.pups.length-1;i>=0;i--){const n=C4.pups[i];if(!c4Live(n)){C4.pups.splice(i,1);continue}const p=n.pup;
  if(n.bub&&n.bub.visible&&n.bubT!=null){n.bubT-=dt;if(n.bubT<=0){n.bub.visible=false;n.c1talk=0}}if(p.carried)continue;
  const dx=p.tx-n.x,dz=p.tz-n.z,d=Math.hypot(dx,dz);let sp=0;if(d>.04&&dt>0){const s=Math.min(d,p.v*dt);n.x+=dx/d*s;n.z+=dz/d*s;sp=s/dt;if(!p.back)p.face=Math.atan2(dx,dz)}
  if(p.look)p.face=Math.atan2(p.look[0]-n.x,p.look[1]-n.z);const ta=SCENE&&SCENE.n===n?n.a:p.face;
  if(n.g){n.g.rotation.y=c4LA(n.g.rotation.y,ta,Math.min(1,dt*9));p.t+=dt;c4PupPlace(n,dt);if(!p.frozen){try{animP(n.g,p.sp!=null?p.sp:sp,p.t,p.st||(n.c1talk?'talk':''));if(p.arms!=null)c4Arms(n.g,p.arms);if(p.post)p.post(n.g)}catch(e){}}}}}
function c4Off(tag){for(const n of C4.mine.slice())if(!tag||n.c4tag===tag){if(NP.includes(n))despawn(n);C4.mine.splice(C4.mine.indexOf(n),1);for(const k in C4.cast)if(C4.cast[k]===n)delete C4.cast[k]}C4.pups=C4.pups.filter(n=>C4.mine.includes(n))}
function c4Dup(id,x,z,a,o={}){const d=NAMED.find(d=>d.id===id);if(!d)return null;const f=o.pup?c4Pup:c4Person;
  return f(d.cl,x,z,a,Object.assign({name:d.name,title:d.title,lvl:d.lvl,shirt:d.shirt,sleeve:d.sleeve,pants:d.pants,hair:d.hair,skin:d.skin,fem:d.fem||false,scale:d.scale,pin:d.pin,prop:d.prop,house:d.house,noLetters:d.noLetters,named:1},o))}
// Danny in a cutscene: placed, turned and animated like a puppet
function c4DanAt(x,z,a){P.x=x;P.z=z;P.y=terrH(x,z);P.jy=0;P.vx=P.vz=0;P.face=a;PM.visible=true;PM.rotation.order='YXZ';PM.position.set(x,P.y,z);PM.rotation.set(0,a,0);C4.dan={tx:x,tz:z,v:3.3,st:'',face:a,lean:0,dy:0}}
function c4DanTo(x,z,v){if(!C4.dan)c4DanAt(P.x,P.z,P.face);C4.dan.tx=x;C4.dan.tz=z;if(v)C4.dan.v=v}
function c4DanUpd(dt){const D=C4.dan;if(!D||mode==='play')return;const dx=D.tx-P.x,dz=D.tz-P.z,d=Math.hypot(dx,dz);let sp=0;if(d>.04&&dt>0){const s=Math.min(d,D.v*dt);P.x+=dx/d*s;P.z+=dz/d*s;sp=s/dt;if(!D.back)D.face=Math.atan2(dx,dz)}
  if(D.look)D.face=Math.atan2(D.look[0]-P.x,D.look[1]-P.z);if(!(SCENE&&SCENE.n))P.face=c4LA(P.face,D.face,Math.min(1,dt*9));P.y=D.y!=null?D.y:terrH(P.x,P.z);
  PM.position.set(P.x,P.y+(D.dy||0),P.z);PM.rotation.set(-(D.lean||0),P.face,0);try{animP(PM,D.sp!=null?D.sp:sp,TT,D.st||'');if(D.arms!=null)c4Arms(PM,D.arms)}catch(e){}}
// both arms reaching forward (a rope, an egg, a chest to push on); a is the shoulder swing, -PI/2 is straight out in front
function c4Arms(g,a){const p=g&&g.P;if(!p||!p.aL||!p.aR)return;p.aL.rotation.set(a,0,.14);p.aR.rotation.set(a,0,-.14);if(p.eL)p.eL.rotation.set(-.3,0,0);if(p.eR)p.eR.rotation.set(-.3,0,0)}
async function c4DanSay(t,s=2.6){bubble(DANNY,t,s);c1Sub('Danny',t);await c1Wait(s);if(DANNY.bub)DANNY.bub.visible=false;c1Sub(null)}
function c4BubUpd(dt){if(mode==='play')return;for(const n of C4.mine)if(!n.grab&&n.bub&&n.bub.visible&&n.bubT!=null){n.bubT-=dt;if(n.bubT<=0)n.bub.visible=false}}
function c4DanFree(){C4.dan=null;if(PM){PM.rotation.order='XYZ';PM.rotation.set(0,P.face,0);PM.position.y=P.y}}
// the cutscene camera: glides toward the current shot (or follows a function that returns one each frame)
function c4CamOn(){c1CineOn();CINE.shot='c4';const d=new THREE.Vector3();cam.getWorldDirection(d);C4.cam={p:cam.position.clone(),l:cam.position.clone().addScaledVector(d,10),tp:cam.position.clone(),tl:cam.position.clone().addScaledVector(d,10),k:2.4,f:null};CINE.camf=dt=>c4CamUpd(dt)}
function c4Shot(p,l,k){const c=C4.cam;if(!c)return;c.f=null;c.tp.set(p[0],p[1],p[2]);c.tl.set(l[0],l[1],l[2]);c.k=k==null?2.4:k;if(!k){c.p.copy(c.tp);c.l.copy(c.tl)}}
function c4ShotF(u,v,h,lu,lv,lh,k){const y=c4FY(),[x,z]=c4F(u,v),[lx,lz]=c4F(lu,lv);c4Shot([x,y+h,z],[lx,y+lh,lz],k)}
function c4Follow(f,k){const c=C4.cam;if(c){c.f=f;if(k!=null)c.k=k}}
function c4CamUpd(dt){const c=C4.cam;if(!c)return;if(c.f){try{c.f(c.tp,c.tl,dt)}catch(e){c.f=null}}const a=c.k<=0?1:1-Math.exp(-c.k*dt);c.p.lerp(c.tp,a);c.l.lerp(c.tl,a);cam.position.copy(c.p);cam.lookAt(c.l)}
function c4CamOff(){C4.cam=null;C4.keys=null;C4.noskip=0;C4.tap=null;c4Ui(null);c1Hud(null);try{c1CineOff()}catch(e){}c4DanFree()}
// keys and taps for the cutscene games (captured before the game's own handlers, so Space doesn't skip the scene)
addEventListener('keydown',e=>{if(!C4.keys){if(C4.noskip&&mode==='cine'&&(e.code==='Space'||e.code==='Enter'||e.code==='Escape')){e.preventDefault();e.stopImmediatePropagation()}return}const r=C4.keys(e.code,1,e);if(r!==false){e.preventDefault();e.stopImmediatePropagation()}},true);
addEventListener('keyup',e=>{if(!C4.keys)return;C4.keys(e.code,0,e);e.stopImmediatePropagation()},true);
// one panel at the bottom of the screen for the games' controls
function c4Ui(html,cls){let e=$('c4ui');if(!e){e=document.createElement('div');e.id='c4ui';e.style.cssText='position:fixed;left:50%;bottom:4%;transform:translateX(-50%);z-index:33;max-width:min(860px,94vw);padding:10px 16px;border-radius:12px;background:rgba(14,16,24,.86);border:1px solid #e2b64c;color:#f2e6c8;font:600 15px Archivo,Arial,sans-serif;text-align:center;box-shadow:0 6px 24px #0008';document.body.appendChild(e)}
  if(!html){e.hidden=true;e.innerHTML='';return e}e.hidden=false;e.innerHTML=html;e.className=cls||'';return e}
function c4Btn(label,f){const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='margin:6px 5px 0;padding:9px 16px;border-radius:9px;border:1px solid #e2b64c;background:#2a2230;color:#f6efe0;font:700 15px Archivo,Arial,sans-serif;cursor:pointer;touch-action:manipulation';b.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();f()};return b}
// a phone notification sliding down from the top (texts are shown, not narrated)
function c4Phone(from,text,ms=4200){const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;top:-140px;transform:translateX(-50%);z-index:40;width:min(380px,90vw);padding:12px 14px;border-radius:16px;background:rgba(245,245,248,.97);color:#16161c;font:500 15px -apple-system,Segoe UI,Arial,sans-serif;box-shadow:0 10px 30px #0009;transition:top .45s cubic-bezier(.2,.9,.3,1.2)';
  e.innerHTML='<div style="font-size:12px;color:#6a6a78;margin-bottom:4px">💬 MESSAGES · now</div><b></b><div style="margin-top:3px"></div>';e.querySelector('b').textContent=from;e.querySelector('div:last-child').textContent=text;document.body.appendChild(e);
  sfx('ui');requestAnimationFrame(()=>e.style.top='18px');setTimeout(()=>{e.style.top='-160px';setTimeout(()=>e.remove(),600)},ms);return c4Sl(ms+300)}

// ---------------------------------------------------------------- the new houses (sign over the old letters, a banner on the lawn, three new brothers)
function c4FrVis(row){const[id,k,L,name]=row;if(C4.frM[id])return C4.frM[id];const b=B.find(b=>b.id===id);if(!b||!b.face)return null;const H=HOUSE[k],bg=hexS(H.shirt),g=new THREE.Group(),ph=7.4,ry=fry(b.face);
  const put=(m,out,y,da=0)=>{const[x,z]=fpos(b,b.face,b.da+da,out);m.position.set(x,y,z);m.rotation.y=ry;m.userData.noMerge=1;g.add(m);return m};
  put(signMesh(L,10.7,2.06,bg,H.lc),3.47,ph+.4);put(signMesh(L,2.5,1.05,bg,H.lc),3.36,ph+2.05);
  // a vinyl banner between two poles on the lawn
  const by=terrH(...fpos(b,b.face,b.da,9.5));put(signMesh(L+' · NOW RUSHING',5.4,1.1,bg,H.lc),9.5,by+2.25,-5.5);
  for(const s of[-2.75,2.75]){const p=new THREE.Mesh(bgeo(.08,2.9,.08),mt(0xcfcfcf,.4,.6));put(p,9.5,by+1.45,-5.5+s)}
  sc.add(g);C4.frM[id]=g;return g}
function c4FrPeople(){if(C4.frN.length)return;for(const row of C4FR){const[id,k,L,name,cl,,,pres]=row,b=B.find(b=>b.id===id);if(!b)continue;
  for(let i=0;i<3;i++){const[x0,z0]=fpos(b,b.face,b.da-5.5+(i-1)*1.8,8.2+(i%2)*.9),[x,z]=c3Free(x0,z0),[fx,fz]=fpos(b,b.face,b.da,40);
    const n=spawn(cl,'greek',{x,z,a:Math.atan2(fx-x,fz-z),temp:1,mode:'idle',house:k,lvl:4+i,name:i?pick(MN)+' '+String.fromCharCode(65+Math.floor(rnd()*26))+'.':pres,title:i?name:L+' President',greet:i?'"'+L+'. We\'re new. We\'re legit. Rush is Thursday."':'"Brand new chapter, same old house. Tell your friends."'});n.hx=x;n.hz=z;n.c4fr=1;C4.frN.push(n)}}}
const c4Moving=id=>!!(C4.applied&&C4FR.some(r=>r[0]===id));
function c4Apply(on){on=!!on;if(on===!!C4.applied)return;C4.applied=on?1:0;
  for(const row of C4FR){const[id,k,L,name,,,,pres]=row,b=B.find(b=>b.id===id),ch=CHAPTERS.find(c=>c[0]===id);
    if(on){if(!C4.orig[id])C4.orig[id]={L:HOUSE[id]&&HOUSE[id].L,name:b&&b.name,pres:ch&&ch[3]};if(HOUSE[id])HOUSE[id].L=L;if(b)b.name=name;if(ch)ch[3]=pres;const g=c4FrVis(row);if(g)g.visible=true;if(C3.shutM[id])C3.shutM[id].visible=false}
    else{const o=C4.orig[id];if(o){if(HOUSE[id])HOUSE[id].L=o.L;if(b&&o.name)b.name=o.name;if(ch)ch[3]=o.pres}if(C4.frM[id])C4.frM[id].visible=false;if(C3.shutM[id])C3.shutM[id].visible=true}}
  if(on)c4FrPeople();else{for(const n of C4.frN)if(NP.includes(n))despawn(n);C4.frN=[]}}

// ---------------------------------------------------------------- effects: confetti, fireworks, a crowd roar, the fight song
function c4Confetti(x,y,z,n=700,r=16){const pos=new Float32Array(n*3),col=new Float32Array(n*3),vel=new Float32Array(n*2),c=new THREE.Color(),PAL=[0xc8202e,0xe2b64c,0xf2f2ee,0x2a5aa8,0xd88aa6,0xc8202e];
  for(let i=0;i<n;i++){const a=rnd()*TAU,d=Math.sqrt(rnd())*r;pos[i*3]=x+Math.cos(a)*d;pos[i*3+1]=y+2+rnd()*10;pos[i*3+2]=z+Math.sin(a)*d;c.setHex(pick(PAL));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;vel[i*2]=rnd()*TAU;vel[i*2+1]=.7+rnd()*.9}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const m=new THREE.Points(g,GC.c4confM||(GC.c4confM=new THREE.PointsMaterial({size:.2,vertexColors:true,sizeAttenuation:true})));m.frustumCulled=false;m.userData.noMerge=1;sc.add(m);C4.fx.push({m,t:0,life:11,k:'conf',vel,floor:y})}
function c4Firework(x,y,z,col){const n=140,pos=new Float32Array(n*3),vel=new Float32Array(n*3);for(let i=0;i<n;i++){const u=rnd()*2-1,a=rnd()*TAU,s=Math.sqrt(1-u*u),sp=7+rnd()*3;vel[i*3]=s*Math.cos(a)*sp;vel[i*3+1]=u*sp;vel[i*3+2]=s*Math.sin(a)*sp;pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));const m=new THREE.Points(g,new THREE.PointsMaterial({color:col||pick([0xffd84a,0xff4a5a,0x6ad8ff,0xf2f2ee]),size:.55,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  m.frustumCulled=false;m.userData.noMerge=1;sc.add(m);C4.fx.push({m,t:0,life:1.9,k:'fw',vel});tone(90,.25,'sawtooth',.06);noise(.35,.12,500)}
function c4FxUpd(dt){for(let i=C4.fx.length-1;i>=0;i--){const f=C4.fx[i];f.t+=dt;const a=f.m.geometry.attributes.position,p=a.array;
    if(f.k==='conf'){for(let j=0;j<p.length/3;j++){if(p[j*3+1]<=f.floor)continue;const w=f.vel[j*2];p[j*3]+=Math.sin(f.t*2+w)*dt*.8;p[j*3+2]+=Math.cos(f.t*1.7+w)*dt*.8;p[j*3+1]-=f.vel[j*2+1]*dt}}
    else{for(let j=0;j<p.length/3;j++){p[j*3]+=f.vel[j*3]*dt;p[j*3+1]+=f.vel[j*3+1]*dt;p[j*3+2]+=f.vel[j*3+2]*dt;f.vel[j*3+1]-=4*dt;f.vel[j*3]*=.985;f.vel[j*3+2]*=.985}f.m.material.opacity=Math.max(0,1-f.t/f.life)}
    a.needsUpdate=true;if(f.t>f.life){sc.remove(f.m);if(f.k==='fw')f.m.material.dispose();f.m.geometry.dispose();C4.fx.splice(i,1)}}}
function c4Roar(v=.09,d=1.8){noise(d,v,650);noise(d*.8,v*.6,1400)}
// the Harrowgate fight song, square-wave brass and a bass drum, looping while the band is out
const C4SONG=[[392,.25],[523,.25],[659,.25],[784,.5],[659,.25],[523,.25],[587,.5],[659,.25],[523,.25],[440,.25],[494,.25],[523,.75],[0,.25],[392,.25],[440,.25],[494,.25],[523,.25],[587,.25],[659,.25],[698,.25],[784,.75],[659,.25],[587,.25],[523,1]];
function c4Song(on){C4.song=on?{t:0,i:0,next:0}:null}
function c4SongUpd(dt){const s=C4.song;if(!s||typeof AC==='undefined'||!AC)return;s.t+=dt;while(s.t>=s.next){const[f,d]=C4SONG[s.i];if(f){tone(f,d*.9,'square',.035);tone(f/2,d*.9,'triangle',.03)}if(s.i%2===0)noise(.07,.1,140);s.next+=d*.55;s.i=(s.i+1)%C4SONG.length;if(s.i===0)s.next+=.6}}

// ---------------------------------------------------------------- the stadium crowd (instanced fans on the stands, both sides) and the band
function c4Stands(){if(C4.stand)return C4.stand;const mk=(s,pal)=>{const sp=[],ys=[];for(let v=25.4;v<=38.5;v+=1.3)for(let u=-33;u<=33;u+=1.12){if(rnd()<.1)continue;const[x,z]=c4F(u+(rnd()-.5)*.3,s*(v+(rnd()-.5)*.25));let y0,y1;try{y0=terrH(x,z);y1=camTop(x,z)}catch(e){continue}if(!(y1-y0>=1.5&&y1-y0<=13))continue;sp.push([x,z,c4A(0,-s)+(rnd()-.5)*.5]);ys.push(y1)}
    const C=c1Crowd(sp,pal);C.data.forEach((d,i)=>{d.y=ys[i];d.amp0=d.amp;d.sp0=d.sp});sc.add(C.g);C.g.visible=false;return C};
  C4.stand={home:mk(-1,{block:1,k:'c4home',SH:[0xc8202e,0xc8202e,0xc8202e,0x1d1d22,0xf2f2ee,0xe2b64c,0x7d1f2c],PA:[0x2e3d5c,0x1d1f24,0x34486e,0x4a4038],fem:.45}),away:mk(1,{block:1,k:'c4away',SH:[0xc8202e,0xc8202e,0xf2f2ee,0x1f5a3a,0x1d1d22,0xc8202e],PA:[0x2e3d5c,0x1d1f24,0x34486e],fem:.4}),hype:0,storm:0};return C4.stand}
function c4StandsOn(on){const C=c4Stands();for(const k of['home','away'])C[k].g.visible=!!on;if(!on){C.storm=0;c4Hype(0);for(const k of['home','away'])for(const d of C[k].data)if(d.x0!=null){d.x=d.x0;d.z=d.z0;d.y=d.y00;d.x0=null}}}
function c4Hype(h){const C=c4Stands();C.hype=h;for(const k of['home','away'])for(const d of C[k].data){d.amp=d.amp0*(1+h*6);d.sp=d.sp0*(1+h*.8)}}
// the student section pours down onto the field
function c4Storm(){const C=c4Stands();C.storm=1;C.stT=0;for(const d of C.home.data){if(rnd()<.55)continue;d.x0=d.x;d.z0=d.z;d.y00=d.y;const[u]=c4UV(d.x,d.z);const[x,z]=c4F(clamp(u*.6+(rnd()-.5)*8,-28,28),-(rnd()*11+1));d.gx=x;d.gz=z;d.gy=terrH(x,z);d.dl=rnd()*2.5}}
function c4StandUpd(dt){const C=C4.stand;if(!C||!C.home.g.visible)return;if(C.storm){C.stT+=dt;for(const d of C.home.data){if(d.x0==null)continue;const k=clamp((C.stT-d.dl)/3.2,0,1),e=k*k*(3-2*k);d.x=lerp(d.x0,d.gx,e);d.z=lerp(d.z0,d.gz,e);d.y=lerp(d.y00,d.gy,e)+Math.sin(e*PI)*1.2}}
  c1CrowdUpd(C.home,TT);c1CrowdUpd(C.away,TT)}
function c4Band(on){if(!C4.band){const sp=[];for(let r=0;r<4;r++)for(let c=0;c<6;c++)sp.push([0,0,0]);const C=c1Crowd(sp,{k:'c4band',SH:[0xc8202e],PA:[0xf2f2ee],HA:[0x151515],fem:.3});C.data.forEach((d,i)=>{d.r=Math.floor(i/6);d.c=i%6;d.amp=.05;d.sp=6});sc.add(C.g);C.g.visible=false;C4.band=C}
  C4.band.g.visible=!!on;C4.band.t=0;c4Song(on)}
function c4BandUpd(dt){const C=C4.band;if(!C||!C.g.visible)return;C.t+=dt;const y=c4FY(),u0=-18+((C.t*1.1)%36);for(const d of C.data){const[x,z]=c4F(u0-d.r*1.4,-5+d.c*1.6);d.x=x;d.z=z;d.y=y;d.a=c4A(1,0)}c1CrowdUpd(C,TT)}

// ---------------------------------------------------------------- props
const c4M=(geo,col,x,y,z,par)=>{const m=new THREE.Mesh(geo,typeof col==='number'?mt(col,.6):col);m.position.set(x,y,z);m.userData.noMerge=1;m.castShadow=true;(par||sc).add(m);return m};
function c4Group(name,on,build){let g=C4.props[name];if(on&&!g){g=new THREE.Group();g.userData.noMerge=1;try{build(g)}catch(e){console.warn('c4Group '+name,e)}sc.add(g);C4.props[name]=g}if(g)g.visible=!!on;return g}
function c4Cup(par,x,y,z){const g=new THREE.Group(),gold=mt(0xe2b64c,.25,.85);const b=c4M(new THREE.CylinderGeometry(.16,.22,.12,16),gold,0,.06,0,g);c4M(new THREE.CylinderGeometry(.04,.06,.32,10),gold,0,.28,0,g);c4M(new THREE.CylinderGeometry(.24,.1,.36,18),gold,0,.6,0,g);
  for(const s of[-1,1]){const h=c4M(new THREE.TorusGeometry(.1,.025,6,12),gold,s*.26,.62,0,g);h.rotation.y=PI/2}g.position.set(x,y,z);par.add(g);return g}
// Nippert dressed for the kickoff: a stage with a podium, the Homecoming banner and the Cup on a table
function c4KickSet(on){return c4Group('kick',on,g=>{const y=c4FY(),[x,z]=c4F(0,-12.6),a=c4A(0,1);const s=new THREE.Group();s.position.set(x,y,z);s.rotation.y=a;g.add(s);
  c4M(bgeo(7,.5,3.2),0x2a2a32,0,.25,0,s);c4M(bgeo(.8,1.1,.5),0x7d1f2c,-1.4,1.05,.6,s);
  const bn=signMesh('HOMECOMING · HARROWGATE',6.4,1.2,'#c8202e','#f6efe0','Archivo');bn.position.set(0,3.1,-1.5);s.add(bn);for(const q of[-3.1,3.1])c4M(bgeo(.1,3.6,.1),0xcfcfcf,q,1.8,-1.5,s);
  c4M(bgeo(1.4,.06,.7),0xf2f2ee,1.6,1.25,.4,s);for(const q of[[-.6,-.25],[.6,-.25],[-.6,.25],[.6,.25]])c4M(bgeo(.05,.75,.05),0xbcbcbc,1.6+q[0],.87,.4+q[1],s);C4.cup=c4Cup(s,1.6,1.28,.4)})}
// the Greek Games: four relay lanes, the tug-of-war rope, egg crates, the snack sideline
const C4LANE=[-4.2,-1.4,1.4,4.2],C4RU0=-25,C4RU1=21;
function c4GamesSet(on){return c4Group('games',on,g=>{const y=c4FY()+.03,cone=mt(0xf07a1a,.6),white=bm(0xf6f6f0);
  for(const v of C4LANE)for(const u of[C4RU0,C4RU1]){const[x,z]=c4F(u,v-1.4);c4M(new THREE.ConeGeometry(.16,.42,10),cone,x,y+.21,z,g)}
  for(const u of[C4RU0,C4RU1]){const[x,z]=c4F(u,0),l=new THREE.Mesh(bgeo(.12,.02,11.4),white);l.position.set(x,y,z);l.rotation.y=c4A(1,0);l.userData.noMerge=1;g.add(l)}
  // relay finish ring for Danny's lane
  {const[x,z]=c4F(C4RU1,C4LANE[1]);const r=new THREE.Mesh(new THREE.RingGeometry(.9,1.15,28),new THREE.MeshBasicMaterial({color:0xe2b64c,transparent:true,opacity:.85,side:THREE.DoubleSide}));r.rotation.x=-PI/2;r.position.set(x,y+.02,z);r.userData.noMerge=1;g.add(r);C4.ring=r}
  // snacks, a cooler and a speaker on the home sideline (for the stars)
  const[cx,cz]=c4F(-6,-13.4);c4M(bgeo(.9,.55,.55),0x2a6ad8,cx,y+.28,cz,g);c4M(bgeo(.95,.08,.6),0xf2f2ee,cx,y+.58,cz,g);
  const[tx,tz]=c4F(4,-13.4);c4M(bgeo(1.8,.05,.8),0xe8e2d6,tx,y+.78,tz,g);for(const q of[-.8,.8])c4M(bgeo(.05,.76,.7),0x8a8d90,tx+STAD.ux*q,y+.38,tz+STAD.uz*q,g);c4M(new THREE.CylinderGeometry(.3,.3,.06,14),0xb8672a,tx,y+.84,tz,g);
  const[sx,sz]=c4F(9,-13.4);const sp=c4M(bgeo(.6,1.1,.5),0x1d1d22,sx,y+.55,sz,g);sp.rotation.y=c4A(0,1);c4M(new THREE.CylinderGeometry(.18,.18,.03,14),0x3a3a40,sx+STAD.vx*.26,y+.75,sz+STAD.vz*.26,g).rotation.x=PI/2;
  // an egg crate by the egg toss
  const[ex,ez]=c4F(-15.5,8);c4M(bgeo(.6,.2,.4),0xd8c8a0,ex,y+.1,ez,g)})}

// ================================================================ the small games
// ---- relay: a real race (Danny runs it himself, hold Shift to sprint); the anchor leg is a cutscene
// cfg: {opp:[pup...], lanes:[v of each opp], sp:[speeds], anchor:{mate, opps}, win, label}
function c4RelayStart(cfg){const R=C4.relay={cfg,state:'wait',t:0};c4RelayReset();return R}
function c4RelayReset(){const R=C4.relay;if(!R)return;R.state='wait';R.t=0;R.first=null;const c=R.cfg;c.opp.forEach((n,i)=>{const[x,z]=c4F(C4RU0,c.lanes[i]);n.x=x;n.z=z;c4To(n,x,z,c.sp[i]);c4Face(n,c4A(1,0));n.pup.st=''})}
function c4RelayGo(){const R=C4.relay;if(!R||R.state!=='wait')return;R.state='count';R.t=3.4;R.cd=4;P.bike=0;S.sta=staMax();const[x,z]=c4F(C4RU0,C4LANE[1]);if(P.inside)goOut(x,z);else{P.x=x;P.z=z;P.y=terrH(x,z)}P.face=c4A(1,0);yaw=P.face+PI;R.px=x;R.pz=z}
function c4RelayTick(dt){const R=C4.relay;if(!R||mode!=='play')return;const c=R.cfg;
  if(R.state==='count'){R.t-=dt;P.x=R.px;P.z=R.pz;PM.position.set(P.x,P.y,P.z);P.face=c4A(1,0);const k=Math.ceil(R.t-.4);if(k!==R.cd&&k>=1&&k<=3){R.cd=k;big(String(k),700);tone(440,.12,'square',.08)}
    if(R.t<=.4){R.state='run';R.t=0;big('GO!',800);sfx('whistle');c.opp.forEach((n,i)=>{const[x,z]=c4F(C4RU1+.6,c.lanes[i]);c4To(n,x,z,c.sp[i])})}return}
  if(C4.auto&&R.state==='wait')c4RelayGo();if(R.state!=='run')return;R.t+=dt;if(C4.auto){const[au,av]=c4UV(P.x,P.z),[x,z]=c4F(au+6.6*dt,av);P.x=x;P.z=z}const[u]=c4UV(P.x,P.z);c1Hud(`${c.label||'RELAY'} · ${Math.max(0,Math.round((C4RU1-u)/.6076))} YARDS TO GO`);
  for(const n of c.opp){const[ou]=c4UV(n.x,n.z);if(ou>=C4RU1-.05&&!R.first)R.first=n}
  if(u>=C4RU1-.3){c1Hud(null);R.state=R.first?'lost':'won';if(R.state==='lost'){sfx('bad');R.state='lostc';card({title:c.label||'The Relay',sp:R.first.name+' · '+(R.first.title||''),text:'"'+pick(['Too slow, pledge!','Was that your sprint? That was your SPRINT?','Better luck next year.'])+'"',ch:[['Line up again',()=>{c4RelayReset()}]]})}
    else{sfx('ok');c4Roar();if(c.anchor)c4RelayAnchor();else R.state='done'}}}
async function c4RelayAnchor(){const R=C4.relay,a=R.cfg.anchor;R.state='anchor';try{c4CamOn();$('cineskip').hidden=true;c4DanAt(P.x,P.z,c4A(1,0));
  const ops=a.opps,lanes=R.cfg.lanes;// the anchors wait at the handoff line and run back to the start
  const[mx,mz]=c4F(C4RU1+.8,C4LANE[1]);a.mate.x=mx;a.mate.z=mz;c4Face(a.mate,c4A(-1,0));ops.forEach((n,i)=>{const[x,z]=c4F(C4RU1+.8+(i+1)*.35,lanes[i]);n.x=x;n.z=z;c4Face(n,c4A(-1,0))});
  c4Follow((tp,tl)=>{const[u]=c4UV(a.mate.x,a.mate.z),y=c4FY();const[x,z]=c4F(u-1,-15);tp.set(x,y+4,z);const[lx,lz]=c4F(u-3,0);tl.set(lx,y+1,lz)},3);
  c1Say(a.mate,'GO GO GO!',2);await c4Wt(.5);sfx('ok');
  const[ex,ez]=c4F(C4RU0-1.5,C4LANE[1]);c4To(a.mate,ex,ez,6.1);ops.forEach((n,i)=>{const[x,z]=c4F(C4RU0-1.5,lanes[i]);c4To(n,x,z,5.6+i*-.25)});
  await c4Wt(4.2);c4Roar(.12,2.2);big(R.cfg.win||'RELAY WON',2400);c1Say(a.mate,'That\'s how it\'s DONE!',2.4);{const[cx,cz]=c4F(C4RU0,0);c4Confetti(cx,c4FY(),cz,500,10)}await c4Wt(2.6)}catch(e){console.warn('relay anchor',e)}
  c4CamOff();R.state='done'}

// ---- tug-of-war: mash A / D (or tap PULL). ours pull toward -u; o > 0 means the rope is coming our way
async function c4Tug(cfg){C4.noskip=1;const uc=cfg.u||0,vt=cfg.v||7.5,y=c4FY(),ours=cfg.ours,theirs=cfg.theirs,T={o:0,vel:0,t:0,surge:0,sT:1.5,done:0};
  if(!C4.cam)c4CamOn();$('cineskip').hidden=true;const flagM=new THREE.Mesh(bgeo(.05,.5,.35),mt(0xc8202e,.6)),rope=new THREE.Mesh(GC.c4rope||(GC.c4rope=new THREE.CylinderGeometry(.035,.035,1,6)),mt(0xc8a46a,.8));rope.userData.noMerge=flagM.userData.noMerge=1;sc.add(rope);sc.add(flagM);
  const mk=(u0,v)=>{const[x,z]=c4F(u0,vt+v);return new THREE.Mesh(bgeo(.08,.02,1.6),bm(0xf6f6f0))};const lines=[-2.4,2.4].map(q=>{const m=mk(uc+q,0),[x,z]=c4F(uc+q,vt);m.position.set(x,y+.02,z);m.rotation.y=c4A(1,0);m.userData.noMerge=1;sc.add(m);return m});
  const all=[...ours.map((n,i)=>({n,side:-1,i})),...theirs.map((n,i)=>({n,side:1,i}))];
  const place=()=>{for(const q of all){const u=uc+q.side*(1.2+q.i*1.05)-T.o,v=vt+(q.i%2?.28:-.28);const[x,z]=c4F(u,v);const face=c4A(-q.side,0),lean=.32+Math.min(.25,Math.abs(T.vel)*.25);
      if(q.n===DANNY){c4DanTo(x,z,20);P.x=x;P.z=z;C4.dan.face=face;C4.dan.back=1;C4.dan.st='';C4.dan.arms=-1.2;C4.dan.lean=lean;C4.dan.sp=Math.abs(T.vel)*3}else{q.n.x=x;q.n.z=z;c4To(q.n,x,z);c4Face(q.n,face);q.n.pup.back=1;q.n.pup.st='';q.n.pup.arms=-1.2;q.n.pup.lean=lean;q.n.pup.sp=Math.abs(T.vel)*3}}
    const a=c4P3(uc-(1.2+(ours.length-1)*1.05)-.4-T.o,vt,1.0),b=c4P3(uc+(1.2+(theirs.length-1)*1.05)+.4-T.o,vt,1.0),A=new THREE.Vector3(...a),Bv=new THREE.Vector3(...b),d=Bv.clone().sub(A);rope.position.copy(A).addScaledVector(d,.5);rope.scale.set(1,d.length(),1);rope.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
    const[fx,fz]=c4F(uc-T.o,vt);flagM.position.set(fx,y+.78,fz);flagM.rotation.y=c4A(1,0)};
  if(ours.includes(DANNY))c4DanAt(P.x,P.z,0);place();c4ShotF(uc,vt+10.5,3.6,uc,vt,1,0);
  const bar=()=>`<div style="margin-bottom:6px">${cfg.title||'TUG-OF-WAR'} · mash <b>A</b> / <b>D</b> (or tap PULL)</div><div style="position:relative;height:14px;border-radius:7px;background:linear-gradient(90deg,#c8202e 0 18%,#3a3442 18% 82%,${cfg.col||'#2a6a8a'} 82%);width:min(420px,80vw);margin:0 auto"><div style="position:absolute;top:-4px;left:${clamp(50-T.o/2.4*32,2,98)}%;width:6px;height:22px;margin-left:-3px;background:#f6efe0;border-radius:3px"></div></div>`;
  const e=c4Ui(bar());const btn=c4Btn('PULL',()=>pull());e.appendChild(btn);
  let last='';const pull=()=>{if(T.done||T.t<0)return;T.vel+=.2;tone(150+rnd()*40,.04,'square',.03)};
  C4.keys=(code,dn,ev)=>{if(!dn||ev.repeat)return;if(['KeyA','KeyD','ArrowLeft','ArrowRight','Space','KeyE'].includes(code)){if(code!==last||code==='Space'||code==='KeyE')pull();last=code}};
  big('READY…',900);await c1Wait(1);big('PULL!',800);sfx('whistle');
  const res=await new Promise(res=>{C4.tugUpd=dt=>{T.t+=dt;if(C4.auto)T.vel+=2.1*dt;T.sT-=dt;if(T.sT<=0){T.surge=.75+rnd()*.5;T.sT=1.6+rnd()*1.6;const n=pick(theirs);if(n&&n.pup)bubble(n,pick(cfg.taunts||['HEAVE!','PULL!','Again!']),1)}const sv=T.surge>0?(T.surge-=dt,.9):0;
      T.vel-=(cfg.base||.5)*dt+sv*dt;T.vel*=Math.pow(.18,dt);T.o+=T.vel*dt*1.6;place();const bb=e.firstChild&&e.firstChild.nextSibling&&e.firstChild.nextSibling.firstChild;if(bb)bb.style.left=clamp(50-T.o/2.4*32,2,98)+'%';
      if(T.o>=2.4||T.o<=-2.4||T.t>30){T.done=1;C4.tugUpd=null;res(T.o>0)}}});
  C4.keys=null;c4Ui(null);for(const n of[rope,flagM,...lines])sc.remove(n);
  for(const q of all){if(q.n===DANNY){C4.dan.st='';C4.dan.arms=null;C4.dan.lean=0;C4.dan.back=0;C4.dan.sp=null}else if(q.n.pup){q.n.pup.st='';q.n.pup.arms=null;q.n.pup.lean=0;q.n.pup.back=0;q.n.pup.sp=null}}
  // the losing side goes down in a heap
  for(const q of all)if((q.side>0)===res&&q.n!==DANNY&&q.n.pup){q.n.pup.lie=.8;setTimeout(()=>{if(q.n.pup)q.n.pup.lie=0},2600)}
  if(res){c4Roar();big(cfg.win||'YOU WIN!',2000);sfx('ok')}else{big('THEY WIN',1600);sfx('bad')}await c4Wt(2.2);return res}

// ---- egg toss: the egg arcs over; press when the shrinking ring meets the circle (Space / E / tap)
async function c4Egg(cfg){C4.noskip=1;const thrower=cfg.thrower,rounds=cfg.rounds||5,ue=cfg.u!=null?cfg.u:-15.5,ve=cfg.v!=null?cfg.v:6.5,y=c4FY();let ok=0;
  if(!C4.cam)c4CamOn();$('cineskip').hidden=true;const egg=c4M(GC.c4egg||(GC.c4egg=new THREE.SphereGeometry(.07,10,8)),mt(0xf6f0e2,.5),0,0,0);egg.scale.set(1,1.3,1);
  const ring=c4Ui('');ring.innerHTML=`<div style="margin-bottom:6px">${cfg.title||'PARTNER EGG TOSS'} · press <b>Space</b> when the rings meet</div><div style="position:relative;width:110px;height:110px;margin:0 auto"><div id="c4rt" style="position:absolute;left:35px;top:35px;width:40px;height:40px;border-radius:50%;border:3px solid #e2b64c"></div><div id="c4ro" style="position:absolute;border-radius:50%;border:3px solid #f6efe0"></div></div><div id="c4rs" style="margin-top:4px;font-size:13px;color:#cfc6b0"></div>`;
  let pressed=null;const press=()=>{if(pressed===null)pressed=TT};ring.appendChild(c4Btn('CATCH',press));C4.keys=(code,dn,ev)=>{if(dn&&!ev.repeat&&(code==='Space'||code==='KeyE'||code==='Enter'))press()};
  const ro=$('c4ro'),rs=$('c4rs');
  for(let r=0;r<rounds;r++){const d=(cfg.d0||3)+r*(cfg.dd||1.5),[dx,dz]=c4F(ue,ve),[tx,tz]=c4F(ue+d,ve);if(!r){c4DanAt(dx,dz,c4A(1,0));thrower.x=tx;thrower.z=tz}else if(!C4.dan)c4DanAt(P.x,P.z,P.face);c4DanTo(dx,dz,3);C4.dan.look=[tx,tz];c4To(thrower,tx,tz,3);c4Look(thrower,dx,dz);thrower.a=Math.atan2(dx-tx,dz-tz);   /* V367 she faces Danny even while the last conversation still holds her (SCENE uses n.a) */
    c4ShotF(ue+d/2,ve+6+d*.55,2.6+d*.12,ue+d/2,ve,1,r?2:0);rs.textContent=`Toss ${r+1} of ${rounds}`+(cfg.need?` · catch all ${rounds}`:'');await c1Wait(r?1.1:.6);
    // the throw
    thrower.pup.st='throw';setTimeout(()=>{if(thrower.pup)thrower.pup.st=''},450);const fl=.75+d*.07,win=Math.max(.09,(cfg.w0||.24)-r*.03);pressed=null;const t0=TT+.3;let caught=null;
    await new Promise(res=>{C4.eggUpd=()=>{const k=clamp((TT-t0)/fl,0,1.15),A=c4P3(ue+d-.3,ve,1.35),Bp=c4P3(ue+.35,ve,1.2);egg.position.set(lerp(A[0],Bp[0],k),lerp(A[1],Bp[1],k)+Math.sin(Math.min(k,1)*PI)*(1+d*.25),lerp(A[2],Bp[2],k));egg.rotation.x+=.3;
        const left=t0+fl-TT,s=40+Math.max(0,left)*70;ro.style.width=ro.style.height=s+'px';ro.style.left=ro.style.top=(55-s/2-3)+'px';ro.style.borderColor=Math.abs(left)<win?'#7fe07a':'#f6efe0';
        if(C4.auto&&pressed===null&&Math.abs(TT-(t0+fl))<.04)pressed=TT;if(pressed!==null&&caught===null){caught=Math.abs(pressed-(t0+fl))<win}if(TT>t0+fl+win+.05||caught!==null&&TT>t0+fl-.02){C4.eggUpd=null;res()}}});
    if(caught){ok++;sfx('ok');C4.dan.arms=-1.1;rs.textContent='Caught!';const P3=c4P3(ue+.35,ve,1.2);egg.position.set(...P3);await c1Wait(.5);C4.dan.arms=null;C4.dan.st='throw';
      // Danny tosses it back
      const t1=TT;await new Promise(res=>{C4.eggUpd=()=>{const k=clamp((TT-t1)/fl,0,1),A=c4P3(ue+.35,ve,1.3),Bp=c4P3(ue+d-.3,ve,1.3);egg.position.set(lerp(A[0],Bp[0],k),lerp(A[1],Bp[1],k)+Math.sin(k*PI)*(1+d*.25),lerp(A[2],Bp[2],k));if(k>=1){C4.eggUpd=null;res()}}});C4.dan.st='';thrower.pup.arms=-1.1;setTimeout(()=>{if(thrower.pup)thrower.pup.arms=null},500)}
    else{sfx('bad');const[px,py,pz]=c4P3(ue+.35,ve,1.25);const s=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),new THREE.MeshBasicMaterial({color:0xf2d24a,transparent:true,opacity:.8,depthWrite:false}));s.scale.setScalar(.35);s.position.set(px,py,pz);sc.add(s);puffs.push([s,0]);egg.visible=false;rs.textContent='SPLAT.';
      if(cfg.miss)c1Say(thrower,cfg.miss,2.2);await c1Wait(1.8);break}}
  C4.keys=null;c4Ui(null);sc.remove(egg);const won=ok>=rounds;if(won){c4Roar();big(cfg.win||'PERFECT TOSS',2000)}await c1Wait(won?1.8:.2);return won}

// ---- CPR: thirty compressions on the beat, two breaths, until he breathes (Space / tap on each beat)
async function c4CPR(cfg){C4.noskip=1;const beat=60/110;let good=0,cyc=0,ok=false;$('cineskip').hidden=true;
  const e=c4Ui('');e.innerHTML=`<div style="margin-bottom:6px">CPR · press <b>Space</b> on every beat · 30 compressions, then 2 breaths</div><div style="display:flex;align-items:center;justify-content:center;gap:14px"><div id="c4cb" style="width:54px;height:54px;border-radius:50%;background:#c8202e;box-shadow:0 0 0 0 #c8202e88;transition:transform .08s"></div><div style="text-align:left;min-width:170px"><div id="c4cn" style="font-size:22px">0 / 30</div><div id="c4cq" style="font-size:13px;color:#cfc6b0"></div></div></div>`;
  let hit=null;const press=()=>{if(hit===null)hit=TT};e.appendChild(c4Btn('PUSH',press));C4.keys=(code,dn,ev)=>{if(dn&&!ev.repeat&&(code==='Space'||code==='KeyE'||code==='Enter'))press()};
  const cb=$('c4cb'),cn=$('c4cn'),cq=$('c4cq');
  while(!ok&&cyc<4){cyc++;good=0;let n=0;const t0=TT+.8;cq.textContent=cyc>1?'Again. Keep the rhythm.':'Hands in the middle of his chest. Push hard and fast.';
    while(n<30){const tb=t0+n*beat;hit=null;await new Promise(res=>{C4.cprUpd=()=>{if(C4.auto&&hit===null&&Math.abs(TT-tb)<.05)hit=TT;const k=1-clamp(Math.abs(TT-tb)/(beat/2),0,1);cb.style.transform=`scale(${1+k*.35})`;if(TT>tb+beat*.45){C4.cprUpd=null;res()}}});
      n++;const g=hit!==null&&Math.abs(hit-tb)<.17;if(g){good++;tone(70,.08,'sine',.12)}else tone(220,.05,'square',.03);cn.textContent=n+' / 30';if(C4.dan){C4.dan.dy=-.62;setTimeout(()=>{if(C4.dan)C4.dan.dy=-.55},90)}if(cfg.onPush)cfg.onPush(g)}
    cq.textContent='Two breaths.';cn.textContent='Breathe';for(let b=0;b<2;b++){hit=null;const tb=TT+1.1;await new Promise(res=>{C4.cprUpd=()=>{if(C4.auto&&hit===null&&TT>tb-.3)hit=TT;cb.style.transform=`scale(${1+clamp(1-Math.abs(TT-tb),0,1)*.25})`;if(hit!==null||TT>tb+1){C4.cprUpd=null;res()}}});noise(.5,.04,500);await c1Wait(.4)}
    ok=good>=20||cyc>=3;if(!ok&&cfg.onFail)await cfg.onFail(cyc)}
  C4.keys=null;c4Ui(null);return ok}

// ---- planning the weekend on Grant's corkboard (a 2D board in the minigame window)
function c4PlanBoard(done){const so=c4Soro(),EV={kick:'Homecoming Kickoff · Nippert Stadium',games:'Greek Games · Nippert field',party:'ΑΣΡ × '+so.L+' Party · the house',game:'Homecoming Game · Hawks vs. Cedar Valley'},SL=[['thu','Thursday · 6 PM'],['fri','Friday · 2 PM'],['frin','Friday · 10 PM'],['sat','Saturday · 3 PM']],ANS={thu:'kick',fri:'games',frin:'party',sat:'game'};
  openMG('Homecoming Weekend',"Grant's corkboard · pin every event in its slot",(el,close)=>{const at={};let sel=null;
    el.innerHTML='<p class="mgintro">Click an event card, then click the slot it belongs in. Grant\'s sticky notes are the rules.</p><div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center"><div id="c4pe" style="display:flex;flex-direction:column;gap:8px;min-width:230px"></div><div id="c4ps" style="display:flex;flex-direction:column;gap:8px;min-width:250px"></div></div><div id="c4pn" style="margin:12px auto 0;max-width:520px;padding:8px 12px;background:#f4e27a;color:#3a3010;border-radius:4px;transform:rotate(-1deg);font:600 14px \'Comic Sans MS\',Archivo,sans-serif;text-align:left">• The game is Saturday. It is always Saturday.<br>• The athletes can\'t come to anything until the Games are over.<br>• Kickoff opens the week. That\'s why it\'s called kickoff.</div><div style="text-align:center;margin-top:10px" id="c4pb"></div>';
    const pe=el.querySelector('#c4pe'),ps=el.querySelector('#c4ps'),pn=el.querySelector('#c4pn'),pb=el.querySelector('#c4pb');
    const st='padding:10px 12px;border-radius:8px;border:1px solid #6a5a3a;background:#f2ead6;color:#2a2418;font:700 14px Archivo,Arial,sans-serif;cursor:pointer;text-align:left';
    const draw=()=>{pe.innerHTML='';ps.innerHTML='';for(const k in EV){if(Object.values(at).includes(k))continue;const b=document.createElement('button');b.type='button';b.style.cssText=st+(sel===k?';outline:3px solid #c8202e':'');b.textContent=EV[k];b.onclick=()=>{sel=k;sfx('ui');draw()};pe.appendChild(b)}
      for(const[s,l]of SL){const b=document.createElement('button');b.type='button';b.style.cssText=st+';background:#e6dcc4;min-height:52px';b.innerHTML='<small style="color:#7d1f2c">'+l+'</small><br>';b.appendChild(document.createTextNode(at[s]?EV[at[s]]:'— empty —'));b.onclick=()=>{if(sel){for(const q in at)if(at[q]===sel)delete at[q];at[s]=sel;sel=null}else if(at[s]){sel=at[s];delete at[s]}sfx('ui');draw()};ps.appendChild(b)}
      pb.innerHTML='';const lk=document.createElement('button');lk.type='button';lk.className='mgbtn';lk.textContent='Lock it in';lk.disabled=Object.keys(at).length<4;lk.onclick=()=>{const bad=SL.filter(([s])=>at[s]!==ANS[s]);if(!bad.length){sfx('ok');pn.innerHTML='<b>GRANT:</b> "Look at that. A pledge who can read a calendar."';setTimeout(()=>close(done),1400);return}
        sfx('bad');const why=at.sat!=='game'?'"Saturday. The GAME is Saturday."':at.thu!=='kick'?'"Kickoff. Opens. The. Week."':'"If the party is before the Games, nobody wins the Games. Party after."';pn.innerHTML='<b>GRANT:</b> '+why;for(const[s]of bad)delete at[s];draw()};pb.appendChild(lk)};
    draw();if(C4.auto)setTimeout(()=>close(done),60)})}
