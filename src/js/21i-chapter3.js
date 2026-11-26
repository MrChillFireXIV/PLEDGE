// ================================================================ V126 CHAPTER 3 · THE COCAINE RING (replaces "Alumni Weekend"; the chapter 4 finale stays)
// The gala money renovates the ΑΣΡ house, and the brothers get greedy. ΑΣΡ, ΚΘΩ, ΩΨΔ, ΚΑΝ and ΓΩΖ run a cocaine ring together; ΚΘΩ betrays it.
//  c3house   New Lavish House      build the new third floor (5 jobs), carry the furniture up from the moving truck (5 loads)
//  c3secret  The Executive Secret  the ring meets in the throne room, sell to the homeless downtown (5), an officer stops you
//  c3missing Disappearance         the treasurer is missing, 3 clues across campus, Danny takes them to Grant, who sends only Danny and Tank (V422); a cutscene shows Wes taped to a chair by the Tangeman loading dock guarded by hooded figures, fight them there, bring him home, cops question Grant (V274: every KTHO brother is hostile on sight for the whole quest)
//  c3accuse  Accusations           brothers accuse each other, the brawl, the safe shows ΚΘΩ took the money, recruit 5 pledges
//  c3empire  Cocaine Empire        storm ΚΘΩ with the pledges, throw coke in 10 faces, the cops shut ΚΘΩ down
//  c3frame   Framing               plant stashes in ΩΨΔ, ΚΑΝ and ΓΩΖ, the cops shut them down, ΑΣΡ's victory party
// The new floor is its own interior ('asr_top'), reached by the brothers' new staircase in the upstairs lounge. Shut houses are S.c3.shut.
const C3={top:null,up:null,truck:null,carryM:null,party:null,shutM:{},spawned:[],applied:{}};
const C3IDS=['c3house','c3secret','c3missing','c3accuse','c3empire','c3frame'];
const C3RING=['kto','opd','kan','gwz'];
const c3S=()=>S.c3||(S.c3={b:{},f:{},bags:0,sold:0,clue:{},plant:{},shut:{},pl:{},faces:0});
CHN[3]='The Cocaine Ring';
CHT[3]='The alumni checks clear. All of them.\n\nBy Monday there is a dumpster on the front lawn, a contractor\'s van in the driveway, and a new staircase going up through the ceiling of the upstairs lounge. Grant has a new watch. Tank has a new truck. Nobody will say where the rest of the money is going.\n\n"Pledge," Grant says, without looking up from his phone. "Throne room. Bring a hammer."';
Object.assign(QI,{c3cash:'Envelope of ring money'});
// retire the old chapter 3 story quests (the chapter 4 finale needs nothing from them)
for(const id of['lodge','archive','tape','boat','lena']){const i=M.findIndex(m=>m.id===id);if(i>=0)M.splice(i,1)}
// speakers who aren't standing nearby are spawned beside Danny for their card (see sceneActor)
Object.assign(ACT,{
  'Preston Vanderhall':['legacies',{name:'Preston Vanderhall',title:'ΚΘΩ President',house:'kto'}],
  'Milton Cho':['studentgov',{name:'Milton Cho',title:'ΩΨΔ President',house:'opd'}],
  'Brock Ramirez':['athletes',{name:'Brock Ramirez',title:'ΚΑΝ President',house:'kan'}],
  'Dorian Vance':['studentgov',{name:'Dorian Vance',title:'ΓΩΖ President',house:'gwz'}],
  'Officer Dale Kerrigan':['cops',{name:'Officer Dale Kerrigan',title:'Harrowgate PD'}],
  'Detective Alana Ruiz':['cops',{name:'Detective Alana Ruiz',title:'Harrowgate PD',fem:true}],
  'Wes Morrow':['brothers',{name:'Wes Morrow',title:'ΑΣΡ Treasurer',house:'asr'}]});

// ---------------------------------------------------------------- small helpers
const c3M=(geo,col,x,y,z,par)=>{const m=new THREE.Mesh(geo,typeof col==='number'?mt(col,.6):col);m.position.set(x,y,z);m.userData.noMerge=1;if(par)par.add(m);else sc.add(m);return m};
// run builder code that adds to sc (the furniture helpers do) and move what it made into an interior's group, so it shows only in there
function c3Into(id,fn){const n0=sc.children.length;try{fn(INT[id])}catch(e){console.warn('c3Into',e)}const ks=sc.children.slice(n0),g=INT[id]&&INT[id].g;if(g)for(const k of ks){k.userData.noMerge=1;g.add(k)}return ks}
function c3Free(x,z,r=.45){if(freeAt(x,z,r))return[x,z];for(let d=.75;d<10;d+=.75)for(let a=0;a<16;a++){const X=x+Math.cos(a/16*TAU)*d,Z=z+Math.sin(a/16*TAU)*d;if(freeAt(X,Z,r))return[X,Z]}return[x,z]}
function c3Temp(n){if(AM){AM.temps.push(n);AM.actors=AM.actors||{};AM.actors[n.name]=n}return n}   // lives until the quest ends (or c3TempOff)
function c3TempOff(names){if(!AM)return;for(const n of AM.temps.filter(n=>names.includes(n.name)))if(NP.includes(n))despawn(n);AM.temps=AM.temps.filter(n=>NP.includes(n))}
// a white cloud of powder (the game's stink puff, in white)
function c3Puff(x,y,z,s=.6){const g=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),new THREE.MeshBasicMaterial({color:0xf8f8f4,transparent:true,opacity:.75,depthWrite:false}));g.scale.setScalar(s);g.position.set(x,y,z);sc.add(g);puffs.push([g,0])}
// where to walk to reach a spot on the new floor (or the truck) from wherever Danny is: up the stairs, down the stairs, out the door
const C3LV={asr:0,asr_up:1,asr_top:2};
function c3Route(dst){const here=P.inside||null,to=dst.int||null;if(to===here)return[dst.x,dst.z];const gr=INT.asr,up=INT.asr_up,top=INT.asr_top;
  const lh=here in C3LV?C3LV[here]:null,lt=to in C3LV?C3LV[to]:null;
  if(lh!=null&&lt!=null){if(lt>lh)return lh===0?[gr.x0+30,gr.z0+STZT+.6]:[up.x0+26.8,up.z0+C3SW[3]-.4];return lh===2?[top.x0+26.8,top.z0+C3SW[3]-2.4]:[up.x0+30,up.z0+STZB-.4]}   // V198 trails run up/down the stairs
  if(lh===2)return[top.x0+26.8,top.z0+C3SW[3]-2.4];if(lh===1)return[up.x0+30,up.z0+STZB-.4];
  if(here){const I=INT[here];if(here.endsWith('_up'))return[I.x0+30,I.z0+21.5];return[I.x0+I.dX,I.z0+I.d-1.4]}
  const b=B.find(b=>b.id===to.replace(/_(up|top)$/,''));return b?[b.ex,b.ez]:[dst.x,dst.z]}

// ================================================================ the new third floor (built with the other interiors, at boot)
// layout (local metres, 64 × 36): game room x 0-22 · theatre x 22-42 · basketball court x 42-64; stairwell x 16.6-19.2, z 23-33.8
const C3SW=[25.4,21.2,28.2,32.4];   // V193 x0,z0 (bottom, on the 2nd floor) .. x1,z1 (top): right beside the 1st→2nd floor stairwell, rising away from you as you come up
const C3SH=6.2;
function c3BuildTop(){const I=mkInt('asr_top',64,36,{up:1,doorX:17.9,hole:[25.4,21.2,28.2,32.4],name:'Alpha Sigma Rho House, Third Floor',floor:'oak',wall:0xe8e2d2,low:0x5a1f2a,rail:0xf2ece0});
  const X=x=>I.x0+x,Z=z=>I.z0+z,T={studs:[],ply:[],clutter:[],work:[]};C3.top=T;
  // partition walls between the rooms: collision from the start (the studs are there), drywall comes later
  for(const[ax,az,bx,bz]of[[22,0,22,14],[22,18.5,22,36],[42,0,42,14],[42,18.5,42,36]])markR(X(ax)-.15,Z(az)-.15,X(bx)+.15,Z(bz)+.15,6);
  {const n=[];for(const[x,z0,z1]of[[22,0,14],[22,18.5,36],[42,0,14],[42,18.5,36]])for(let z=z0+.3;z<z1;z+=.6)n.push([x,z]);
   const sg=new THREE.BoxGeometry(.09,5.9,.14),im=new THREE.InstancedMesh(sg,mt(0xc9a46a,.85),n.length),m4=new THREE.Matrix4();n.forEach(([x,z],i)=>{m4.makeTranslation(X(x),2.95,Z(z));im.setMatrixAt(i,m4)});im.userData.noMerge=1;sc.add(im);T.studs.push(im);
   for(const[x,z0,z1]of[[22,0,14],[22,18.5,36],[42,0,14],[42,18.5,36]])for(const y of[.04,5.9])T.studs.push(c3M(new THREE.BoxGeometry(.14,.08,z1-z0),0xc9a46a,X(x),y,Z((z0+z1)/2)))}
  // plywood subfloor over everything (hidden once the floors go in)
  for(const[x0,z0,x1,z1]of[[0,0,22,36],[42,0,64,36],[22,0,42,21.2],[22,32.4,42,36],[22,21.2,25.4,32.4],[28.2,21.2,42,32.4]]){const m=c3M(new THREE.PlaneGeometry(x1-x0,z1-z0),mt(0x9a7448,.92),X((x0+x1)/2),.03,Z((z0+z1)/2));m.rotation.x=-PI/2;m.receiveShadow=true;T.ply.push(m)}
  // construction clutter (no collision, it is cleared when the building is done)
  for(const[x,z]of[[8,10],[33,26],[52,10]]){const g=new THREE.Group();g.position.set(X(x),0,Z(z));for(const s of[-1,1]){const l=new THREE.Mesh(bgeo(.08,.78,.62),mt(0x9a7444,.85));l.position.set(s*.55,.39,0);l.rotation.x=.12;g.add(l)}const t=new THREE.Mesh(bgeo(1.4,.1,.12),mt(0x9a7444,.85));t.position.y=.8;g.add(t);g.traverse(m=>{m.userData.noMerge=1});sc.add(g);T.clutter.push(g)}
  for(let i=0;i<6;i++)T.clutter.push(c3M(bgeo(3.6,.08,.24),0xc49a62,X(12),.06+i*.09,Z(16+i*.02)));
  for(let i=0;i<4;i++){const s=c3M(bgeo(2.4,1.2,.03),0xe8e6e0,X(40.6),.62,Z(28+i*.06));s.rotation.set(0,PI/2,-.18);T.clutter.push(s)}
  T.clutter.push(c3M(bgeo(.6,.28,.3),0xc0392b,X(47),.14,Z(30)));for(const[x,z]of[[47.6,31],[48.1,30.4],[30,6]])T.clutter.push(c3M(new THREE.CylinderGeometry(.16,.16,.3,12),0xdedad0,X(x),.15,Z(z)));
  for(const[x,z]of[[6,30],[30,30],[54,30]]){const g=new THREE.Group();g.position.set(X(x),0,Z(z));const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,2.2,6),mt(0x2a2a2a));p.position.y=1.1;g.add(p);const h=new THREE.Mesh(bgeo(.5,.36,.2),new THREE.MeshBasicMaterial({color:0xfff2b0}));h.position.y=2.25;g.add(h);g.traverse(m=>{m.userData.noMerge=1});sc.add(g);T.work.push(g)}
  // the stairwell coming up from the second floor: walk into it from the landing (south end) to go down
  {const[a,b,c,e]=C3SW;   // V196 an open stairwell: the real staircase from the 2nd floor shows through the hole in this floor
   for(const[x0,z0,x1,z1]of[[a-.06,b,a+.06,e],[c-.06,b,c+.06,e],[a,b-.06,c,b+.06]]){box((X(x0)+X(x1))/2,1.05,(Z(z0)+Z(z1))/2,X(x1)-X(x0),.08,Z(z1)-Z(z0),0x3a2415,0);for(let t=0;t<=1;t+=.25)box(X(x0)+(X(x1)-X(x0))*t,.52,Z(z0)+(Z(z1)-Z(z0))*t,.06,1.04,.06,0x3a2415,0)}
   markR(X(a),Z(b),X(c),Z(e-3.4),1.1);markR(X(a)-.2,Z(b),X(a)+.05,Z(e),1.1);markR(X(c)-.05,Z(b),X(c)+.2,Z(e),1.1)}
  // the same staircase on the second floor (the brothers built it): in the upstairs lounge, rising north into the ceiling
  {const U=INT.asr_up;if(U){const ks=[],[a,b,c,e]=C3SW,N=18,d=(e-b)/N,ri=C3SH/N,n0=sc.children.length;
    for(let k=0;k<N;k++){const zf=b+k*d,top=(k+1)*ri;box(U.x0+(a+c)/2,top/2,U.z0+zf+d/2,c-a,top,d,0x4a3020,0);box(U.x0+(a+c)/2,top+.03,U.z0+zf+d/2,c-a+.08,.05,d+.04,k%2?0x7d1f2c:0x9a6a3e,0)}
    for(let k=0;k<=N;k+=2){const zf=b+k*d;box(U.x0+a-.08,(k*ri)+.55,U.z0+zf,.06,1.1,.06,0x3a2415,0)}{const L=Math.hypot(e-b,C3SH),hr=new THREE.Mesh(bgeo(.08,.08,L),mt(0x3a2415,.6));hr.position.set(U.x0+a-.08,C3SH/2+1.1,U.z0+(b+e)/2);hr.rotation.x=-Math.atan2(C3SH,e-b);sc.add(hr)}
    const made=sc.children.slice(n0);{const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.04,6.94),mt(0xeee8da,.95));pl.rotation.x=PI/2;pl.position.set(U.x0+26.8,6.02,U.z0+29.05);pl.userData.noMerge=1;U.g.add(pl);C3.plug=pl}const g=new THREE.Group();for(const k of made){k.userData.noMerge=1;g.add(k)}g.userData.noMerge=1;U.g.add(g);g.visible=false;C3.up={g,on:0}}}
  return I}
// show the second-floor staircase (chapter 3 on) and its prompt
function c3StairsOn(){const U=INT.asr_up;if(!C3.up||C3.up.on||!U)return;C3.up.on=1;C3.up.g.visible=true;if(C3.plug)C3.plug.visible=false;if(P.inside==='asr_up'||P.inside==='asr_top')showInt(P.inside);const[a,b,c,e]=C3SW;markR(U.x0+a-.3,U.z0+b,U.x0+a,U.z0+e+.4,6);markR(U.x0+a,U.z0+e,U.x0+c,U.z0+e+.4,6)}
// V193 the 2nd→3rd floor stairs are walked, not prompted: climb to the top and you step out on the third floor; walk back into its well to come down
function c3StairOK(){return!!(C3.up&&C3.up.on)}
function c3StairY(){if(!c3StairOK())return null;const[a,b,c,e]=C3SW;if(P.inside==='asr_up'){const I=INT.asr_up,lx=P.x-I.x0,lz=P.z-I.z0;if(lx>a&&lx<c&&lz>b-.3&&lz<e+.1)return clamp((lz-b)/(e-b)*C3SH,0,C3SH);return null}
  if(P.inside==='asr_top'){const I=INT.asr_top,lx=P.x-I.x0,lz=P.z-I.z0;if(lx>a&&lx<c&&lz>b&&lz<e)return-clamp((e-lz)/(e-b)*C3SH,0,C3SH);return null}return null}
function c3StairCheck(){if(!c3StairOK())return;const[a,b,c,e]=C3SW;const I=INT[P.inside];if(!I||(P.inside!=='asr_up'&&P.inside!=='asr_top'))return;const lx=P.x-I.x0,lz=P.z-I.z0;if(lx<=a||lx>=c)return;
  let to=null,fz=0;if(P.inside==='asr_up'&&lz>e-.95){to='asr_top';fz=e+2}else if(P.inside==='asr_top'&&lz<e-1.45&&lz>e-2.6){to='asr_up';fz=b-1.2}if(!to)return;
  // V196 the floors line up, so the switch is invisible: same spot, same facing, same camera
  const T=INT[to],f0=P.face,y0=yaw,c0=camT;P.inside=to;showInt(to);P.x=T.x0+lx;P.z=T.z0+lz;P.face=f0;yaw=y0;camT=c0;let i=0;for(const n of NP){if(!n.follow||n.down)continue;n.int=to;n.x=T.x0+(a+c)/2+(i%2?1.4:-1.4)+(to==='asr_up'?(i%2?2.2:-3.2):0);n.z=T.z0+fz+Math.floor(i/2)*1.2;n.path=null;n.aggro=0;n.g.position.set(n.x,0,n.z);i++}}
// --- building jobs (quest a.i): each makes its part of the floor appear
const C3B=[['walls','Hang drywall on the new walls',22,24],['floor','Lay the new floors (carpet, and hardwood for the court)',53,24],['lights','Wire up the lights at the breaker panel',1.6,34],['screen','Mount the theatre screen and speakers',11,3],['hoop','Set up the basketball hoops',53,3.2]];
function c3Part(k){const A=C3.applied;if(A['b'+k])return;A['b'+k]=1;const T=C3.top;
  c3Into('asr_top',I=>{const X=x=>I.x0+x,Z=z=>I.z0+z;
    if(k==='walls'){for(const s of T.studs)s.visible=false;for(const[ax,az,bx,bz]of[[22,0,22,14],[22,18.5,22,36],[42,0,42,14],[42,18.5,42,36]])iwall(I,ax,az,bx,bz)}
    else if(k==='floor'){for(const p of T.ply)p.visible=false;flat(X(.2),Z(.2),X(21.8),Z(35.8),.028,ifloorX('carpet:'+0x5a1a24),3);for(const[a,b,c,e]of[[22.2,.2,41.8,21.2],[22.2,32.4,41.8,35.8],[22.2,21.2,25.4,32.4],[28.2,21.2,41.8,32.4]])flat(X(a),Z(b),X(c),Z(e),.028,ifloorX('carpet:'+0x1d2440),3);   // V208 theatre west (x 0-22), game room east around the stairwell   // V196 leaves the stairwell open
   
      const ct=ctex(512,288,(q,W,H)=>{q.fillStyle='#c8904e';q.fillRect(0,0,W,H);for(let x=0;x<W;x+=12){q.fillStyle=x%24?'rgba(120,70,30,.12)':'rgba(255,255,255,.06)';q.fillRect(x,0,1,H)}q.strokeStyle='#f4f0e6';q.lineWidth=4;q.strokeRect(10,10,W-20,H-20);
        q.beginPath();q.moveTo(W/2,10);q.lineTo(W/2,H-10);q.stroke();q.beginPath();q.arc(W/2,H/2,38,0,TAU);q.stroke();q.fillStyle='#7d1f2c';q.fillRect(W-120,H/2-50,110,100);q.strokeRect(W-120,H/2-50,110,100);q.beginPath();q.arc(W-120,H/2,50,PI/2,PI*1.5);q.stroke();q.fillRect(10,H/2-50,110,100);q.strokeRect(10,H/2-50,110,100);q.beginPath();q.arc(120,H/2,50,-PI/2,PI/2);q.stroke();
        q.fillStyle='#e2b64c';q.font='bold 44px Georgia,serif';q.textAlign='center';q.textBaseline='middle';q.fillText('ΑΣΡ',W/2,H/2+2)});
      const cm=c3M(new THREE.PlaneGeometry(35.6,21.6),SM({map:ct,roughness:.35}),X(53),.03,Z(18));cm.rotation.set(-PI/2,0,PI/2);   // V202 sized so it stays inside the court (x 42-64)
     cm.receiveShadow=true}
    else if(k==='lights'){for(const w of T.work)w.visible=false;const em=new THREE.MeshBasicMaterial({color:0xffd6a0});for(const z of[.35,35.65])c3M(bgeo(19.4,.06,.06),em,X(32),5.7,Z(z));for(const x of[22.4,41.6])c3M(bgeo(.06,.06,35),em,X(x),5.7,Z(18));
      const s=signMesh('ΑΣΡ GAME ROOM',3.4,.6,'#120a1e','#ff6ad8','Archivo');s.position.set(X(32),4.3,Z(.32));sc.add(s);const s2=signMesh('THE ALUMNI THEATRE',3.6,.5,'#1a0a0a','#f2c230','Georgia');s2.position.set(X(11),5.2,Z(35.7));s2.rotation.y=PI;sc.add(s2)}
    else if(k==='screen'){const st=ctex(512,224,(q,W,H)=>{const g=q.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a3a6a');g.addColorStop(1,'#0e1428');q.fillStyle=g;q.fillRect(0,0,W,H);q.fillStyle='#f2efe6';q.font='bold 40px Georgia,serif';q.textAlign='center';q.fillText('NOW SHOWING',W/2,90);q.font='italic 26px Georgia,serif';q.fillText('"Old Money" · a ΑΣΡ production',W/2,140)});
      c3M(bgeo(14.6,6.4,.08),0x0a0a0a,X(11),3.2,Z(.22));c3M(new THREE.PlaneGeometry(14,5.8),new THREE.MeshBasicMaterial({map:st}),X(11),3.2,Z(.28));for(const x of[1.6,20.4])c3M(bgeo(1.1,2.6,.8),0x18181c,X(x),1.3,Z(.8));c3M(bgeo(.6,.35,.6),0x22222a,X(11),5.4,Z(33))}
    else if(k==='hoop'){   // V201 two standing hoops, one at each end of the court, facing each other
      for(const[z0,d]of[[.7,1],[35.3,-1]]){const zz=z=>Z(z0+d*z);c3M(bgeo(1.1,.32,1.5),0x1e2430,X(53),.16,zz(.15));c3M(new THREE.CylinderGeometry(.08,.1,3.4,10),0x2a2e36,X(53),1.85,zz(.15));
        const arm=c3M(bgeo(.1,.1,1.05),0x2a2e36,X(53),3.45,zz(.62));c3M(bgeo(1.8,1.05,.06),0xf4f4f2,X(53),3.55,zz(1.15));c3M(bgeo(.6,.45,.065),0x7d1f2c,X(53),3.3,zz(1.12+d*.0));
        const r=c3M(new THREE.TorusGeometry(.23,.02,6,16),0xe8642a,X(53),3.05,zz(1.45));r.rotation.x=PI/2;c3M(new THREE.CylinderGeometry(.23,.16,.4,12,1,true),new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.55,side:THREE.DoubleSide}),X(53),2.83,zz(1.45));
        markR(X(52.4),Math.min(zz(-.1),zz(.95)),X(53.6),Math.max(zz(-.1),zz(.95)),3.5)}
      for(const[x,z]of[[46,4],[47.5,3.2],[45,5.1]])c3M(GC.c3ball||(GC.c3ball=new THREE.SphereGeometry(.12,12,8)),0xd86a2a,X(x),.12,Z(z));fb(I,52,1.2,6,.6,.5,0x3a2415)}});
  if(C3B.every(([kk])=>c3S().b[kk]))for(const c of T.clutter)c.visible=false}
// --- the furniture loads (quest a.ii): picked up at the truck, put down upstairs
const C3F=[['couch','Leather sectional','game room',36,27],['recliners','Theatre recliners','theatre',11,20],['arcade','Arcade cabinets','game room',26,4],['paint1','Painting: "The Founders, 1952"','game room wall',37,.5],['paint2','Painting: Pell\'s yacht, The Lantern','theatre wall',17,35.5]];
function c3Furn(k){const A=C3.applied;if(A['f'+k])return;A['f'+k]=1;
  c3Into('asr_top',I=>{if(k==='couch'){fsofa(I,36,28,6,'n',0x4a2a1e);fsofa(I,32.4,24.5,4,'e',0x4a2a1e);fb(I,36,24.6,2.6,1.2,.42,0x2a1a10);ftv(I,36,19.2,'s');frugP(I,35.5,25,9,8,0x7d1f2c,'border')}
    else if(k==='recliners'){for(const[z,h]of[[14,0],[19,.35],[24,.7]]){if(h)fb(I,11,z,15,3.4,h,0x2a1a14,0);for(let x=4;x<=18.4;x+=1.8){fb(I,x,z+.2,1.5,1.4,.5,0x1a1a1e,h);fb(I,x,z+.8,1.5,.3,.7,0x1a1a1e,h+.5)}}}
    else if(k==='arcade'){for(const[x,c]of[[24,0x2a2a50],[26,0x5a1a2a],[28,0x1a4a3a]])farcade(I,x,.8,'s',c);fpool(I,33,10);ffoos(I,26,14);flampF(I,23.2,20)}
    else if(k==='paint1')frameAt(I,37,.2,'s',3.1,3.0,1.6,portraitTex(),0xb08a3a,.1);
    else if(k==='paint2')frameAt(I,17,35.8,'n',3.1,3.0,1.8,pellYachtTex(),0xb08a3a,.1)})}
// the brothers bring up the rest once Danny's loads are in
function c3FloorDone(){if(C3.applied.fin)return;C3.applied.fin=1;c3Into('asr_top',I=>{fpong(I,38,4.5);fhockey(I,39.5,10);fplant(I,21,1);fplant(I,43,1);fplant(I,63,35);fb(I,63.4,30,.5,4,1.9,0x3a2415)})}
// bring the floor up to date with the save (also used by chapter select and loading)
function c3ApplyFloor(){if(!C3.top)return;const s=c3S();if(S.ch>=3)c3StairsOn();const all=S.done.c3house||S.ch>=4;
  for(const[k]of C3B)if(s.b[k]||all)c3Part(k);for(const[k]of C3F)if(s.f[k]||all)c3Furn(k);if(all)c3FloorDone()}

// ================================================================ shut-down houses (ΚΘΩ in quest e, the rest in quest f)
function c3ShutVis(id){if(C3.shutM[id])return;const b=B.find(b=>b.id===id);if(!b)return;const cx=(b.x0+b.x1)/2,cz=(b.z0+b.z1)/2,dx=b.ex-cx,dz=b.ez-cz,ew=Math.abs(dx)>Math.abs(dz);
  const nx=ew?Math.sign(dx):0,nz=ew?0:Math.sign(dz),dxp=b.ex-nx*2.1,dzp=b.ez-nz*2.1,g=new THREE.Group();g.position.set(dxp,terrH(dxp,dzp),dzp);g.rotation.y=Math.atan2(nx,nz);
  const tape=mt(0xf2c230,.6);for(const s of[-1,1]){const t=new THREE.Mesh(bgeo(3.2,.16,.02),tape);t.position.set(0,1.7,.25);t.rotation.z=s*.55;g.add(t)}
  const sg=signMesh('CLOSED · HARROWGATE PD',2.4,.6,'#f2f2ee','#c8202e','Archivo');sg.position.set(0,2.7,.3);g.add(sg);
  for(const s of[-1,1]){const bar=new THREE.Group();bar.position.set(s*2.6,0,1.6);const t=new THREE.Mesh(bgeo(1.6,.22,.06),mt(0xf4f4f2,.6));t.position.y=.85;bar.add(t);for(const q of[-.6,.6]){const l=new THREE.Mesh(bgeo(.06,.9,.06),mt(0x2a2a2a));l.position.set(q,.45,0);bar.add(l)}const st=new THREE.Mesh(bgeo(1.6,.06,.065),mt(0xd83a2a,.6));st.position.y=.85;bar.add(st);g.add(bar)}
  sc.add(g);C3.shutM[id]=g}
function c3Shut(id){c3S().shut[id]=1;c3ShutVis(id);c3HideHouse(id)}
function c3HideHouse(id){for(const n of NP){if(n.temp)continue;if(n.house===id||n.int===id||n.int===id+'_up'){n.hidden=1;n.c3shut=1}}}
const c3IsShut=id=>!!(S.c3&&S.c3.shut&&S.c3.shut[id]);

// ================================================================ quest a · New Lavish House
function c3BuildLab(){const s=c3S();return'\n'+C3B.map(([k,l])=>(s.b[k]?'✓ ':'○ ')+l).join('\n')}
function c3BuildGoal(){const s=c3S(),n=C3B.find(([k])=>!s.b[k]);if(!n)return null;const I=INT.asr_top;return c3Route({int:'asr_top',x:I.x0+n[2],z:I.z0+n[3]})}
function c3BuildStart(){c3ApplyFloor();const s=c3S(),I=INT.asr_top;I.objs=I.objs.filter(o=>!o.c3);
  for(const[k,l,x,z]of C3B){if(s.b[k])continue;const o={x:I.x0+x,z:I.z0+z,r:2,label:l,c3:1,f:()=>{if(s.b[k])return;s.b[k]=1;advance(.5);sfx('ok');c3Part(k);I.objs=I.objs.filter(q=>q!==o);
    toast(pick(['Tank: "Not bad, pledge. Not good either."','The brothers watch you work. Nobody helps.','Owen: "Measure twice, cut once. Or, you know, whatever."']),2600);updObj()}};I.objs.push(o)}}
// carrying: one load at a time, held over Danny's head
const C3TRUCK=[80.5,65.5];
function c3CarryMesh(k){if(C3.carryM){PM.remove(C3.carryM);C3.carryM=null}if(PM.HOLD==='overhead')PM.HOLD=null;if(!k)return;PM.HOLD='overhead';   // V194 Danny holds each load up over his head with both hands
 const g=new THREE.Group();
  if(k==='couch'){const a=new THREE.Mesh(bgeo(1.8,.45,.7),mt(0x4a2a1e,.7));g.add(a);const b=new THREE.Mesh(bgeo(1.8,.45,.18),mt(0x4a2a1e,.7));b.position.set(0,.35,-.26);g.add(b)}
  else if(k==='recliners'){for(const s of[-.45,.45]){const a=new THREE.Mesh(bgeo(.8,.5,.8),mt(0x1a1a1e,.7));a.position.x=s;g.add(a)}}
  else if(k==='arcade'){const a=new THREE.Mesh(bgeo(.7,1.2,.6),mt(0x2a2a50,.6));g.add(a);const s=new THREE.Mesh(bgeo(.5,.36,.02),new THREE.MeshBasicMaterial({color:0x6ad8ff}));s.position.set(0,.2,.31);g.add(s)}
  else{const f=new THREE.Mesh(bgeo(1.4,.9,.06),mt(0xb08a3a,.4,.4));g.add(f);const p=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.72),new THREE.MeshBasicMaterial({map:k==='paint1'?portraitTex():pellYachtTex()}));p.position.z=.035;g.add(p)}
  g.position.set(0,{couch:2.38,recliners:2.4,arcade:2.75,paint1:2.55,paint2:2.55}[k]||2.45,.02);g.traverse(m=>{if(m.isMesh)m.castShadow=true});PM.add(g);C3.carryM=g}
function c3CarryLab(){const s=c3S();return'\n'+C3F.map(([k,l,where])=>(s.f[k]?'✓ ':s.carry===k?'▶ ':'○ ')+l+' → '+where).join('\n')+(s.carry?'':'\nGrab the next load from the moving truck on the front lawn')}
function c3CarryGoal(){const s=c3S(),I=INT.asr_top;if(s.carry){const f=C3F.find(f=>f[0]===s.carry);return c3Route({int:'asr_top',x:I.x0+f[3],z:I.z0+f[4]})}if(C3F.every(([k])=>s.f[k]))return null;return c3Route({int:null,x:C3TRUCK[0],z:C3TRUCK[1]-4.6})}   // V193 the marker sits on the ramp, where you grab each load
function c3Truck(on){if(on&&!C3.truck){const g=new THREE.Group(),x=C3TRUCK[0],z=C3TRUCK[1],y=terrH(x,z);g.position.set(x,y,z);
    const cab=new THREE.Mesh(bgeo(2.3,2.0,2.0),mt(0xf2f2ee,.5));cab.position.set(0,1.25,-3.1);g.add(cab);const wnd=new THREE.Mesh(bgeo(2.32,.7,.9),mt(0x1a2a3a,.2,.3));wnd.position.set(0,1.75,-3.6);g.add(wnd);
    const bx=new THREE.Mesh(bgeo(2.5,2.7,5.2),mt(0xe8642a,.55));bx.position.set(0,1.75,.6);g.add(bx);const lab=signMesh('HAUL-IT MOVERS',2.8,.6,'#e8642a','#ffffff','Archivo');lab.position.set(1.27,2.2,.6);lab.rotation.y=PI/2;g.add(lab);
    const lab2=lab.clone();lab2.position.x=-1.27;lab2.rotation.y=-PI/2;g.add(lab2);const ramp=new THREE.Mesh(bgeo(1.4,.06,2.2),mt(0x8a8a8a,.4,.5));ramp.position.set(0,.45,4.1);ramp.rotation.x=.34;g.add(ramp);
    for(const[a,b]of[[-1.15,-3],[1.15,-3],[-1.15,1.6],[1.15,1.6]]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.3,14).rotateZ(PI/2),mt(0x18181a,.8));w.position.set(a,.42,b);g.add(w)}
    g.rotation.y=PI;g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.userData.noMerge=1}});sc.add(g);C3.truck=g;markR(x-1.3,z-4.2,x+1.3,z+3.8,3)}
  else if(!on&&C3.truck){sc.remove(C3.truck);C3.truck=null;const x=C3TRUCK[0],z=C3TRUCK[1];cells(x-1.3,z-4.2,x+1.3,z+3.8,k=>{WG[k]=0;HG[k]=0;SH[k]=0})}}
function c3CarryStart(){c3Truck(1);const s=c3S();if(s.carry)c3CarryMesh(s.carry)}
function c3HousePrompts(add){const st=curStep();if(!st||st.t!=='cond'||st.ok!==c3CarryOk)return;const s=c3S(),I=INT.asr_top;
  if(!s.carry&&!P.inside){const nx=C3F.find(([k])=>!s.f[k]);if(nx)add(C3TRUCK[0],C3TRUCK[1]-4.6,2.6,'Grab the '+nx[1].replace(/^Painting: /,'painting ')+' from the truck',()=>{s.carry=nx[0];c3CarryMesh(nx[0]);sfx('ui');toast('Up three flights. Don\'t scratch anything.',2200);updObj()},3)}
  if(s.carry&&P.inside==='asr_top'){const f=C3F.find(f=>f[0]===s.carry);add(I.x0+f[3],I.z0+f[4],2.6,'Put down the '+f[1].replace(/^Painting: /,'painting '),()=>{s.f[f[0]]=1;s.carry=null;c3CarryMesh(null);c3Furn(f[0]);sfx('ok');advance(.25);toast(pick(['It looks like a magazine up here.','Grant would call this "tasteful".','You check for scratches. None. Probably.']),2200);updObj()},3)}}
const c3CarryOk=()=>C3F.every(([k])=>c3S().f[k]);

// ================================================================ quest b · The Executive Secret
const C3PRES=[['Preston Vanderhall','legacies','kto'],['Milton Cho','studentgov','opd'],['Brock Ramirez','athletes','kan'],['Dorian Vance','studentgov','gwz']];
function c3Summit(){const g=NN.grant;if(!g)return;const st=curStep(),id=g.int||'asr';C3PRES.forEach(([nm,cl,h],i)=>{const a=(i-1.5)*.62,r=3.4,[x,z]=c3Free(g.x+Math.sin(g.a+a)*r,g.z+Math.cos(g.a+a)*r);
    const n=spawn(cl,id,{x,z,a:Math.atan2(g.x-x,g.z-z),temp:1,mode:'idle',actor:1,name:nm,title:ACT[nm][1].title,house:h,lvl:7,int:id});n.hx=x;n.hz=z;c3Temp(n)});
  // the product, on a silver tray at Grant's feet
  const I=INT[id],tx=g.x+Math.sin(g.a)*1.6,tz=g.z+Math.cos(g.a)*1.6;
  /* V289 the product has to read from across the room: a wider tray on a dark velvet pad, big glowing white bricks with a blue wrap stripe, and a soft gold beam over them */
  const st2=c3M(bgeo(1.3,.6,1.3),0x3a2415,tx,.3,tz,I.g),tr=c3M(new THREE.CylinderGeometry(.98,.98,.04,28),mt(0xd8d8dc,.25,.8),tx,.62,tz,I.g),pad=c3M(new THREE.CylinderGeometry(.86,.86,.03,28),mt(0x140b18,.95),tx,.655,tz,I.g);
  const bm2=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xfffff0,emissiveIntensity:.55,roughness:.5}),tp2=new THREE.MeshStandardMaterial({color:0x3a78c0,emissive:0x2a5898,emissiveIntensity:.4,roughness:.5});
  const br=[];for(let i=0;i<5;i++){const row=i<3?0:1,k=row?i-3:i,x=row?-.25+k*.5:-.5+k*.5,y=.69+.08+row*.16,z=-.05;br.push(c3M(bgeo(.44,.15,.3),bm2,tx+x,y,tz+z,I.g),c3M(bgeo(.07,.16,.31),tp2,tx+x,y,tz+z,I.g))}
  const bc=c3M(new THREE.CylinderGeometry(.55,1.0,3.2,24,1,true),new THREE.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:.16,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}),tx,.67+1.6,tz,I.g);
  C3.spawned.push(tr,st2,pad,bc,...br)}
/* V416 the board arrives: Danny is stepped back off the tray spot (the bricks used to appear under his feet) and one wide shot shows the whole board in its half-circle before the talking carries on */
function c3BoardCine(done){const g=NN.grant;if(!g){c3Summit();done();return}const fx=Math.sin(g.a),fz=Math.cos(g.a),sx=fz,sz=-fx;
  c6Cine(async()=>{await c4Fade(async()=>{c3Summit();/* people are only built and placed by the play loop: do it by hand so they are in the shot */for(const n of (AM&&AM.temps)||[])if(C3PRES.some(q=>q[0]===n.name)&&n.g){try{bodyBuild(n.g)}catch(e){}n.g.visible=true;n.g.position.set(n.x,terrH(n.x,n.z),n.z);n.g.rotation.set(0,n.a,0)}c4DanAt(g.x+fx*2.95,g.z+fz*2.95,Math.atan2(-fx,-fz));const y=P.y;
    c4Shot([g.x+sx*5.6-fx*.25,y+2.9,g.z+sz*5.6-fz*.25],[g.x-sx*.8+fx*2.45,y+1.2,g.z-sz*.8+fz*2.45]);c4Shot([g.x+sx*5.2+fx*.5,y+2.7,g.z+sz*5.2+fz*.5],[g.x-sx*.8+fx*2.45,y+1.2,g.z-sz*.8+fz*2.45],.3)});
    c1Sub('','Four men in good coats file in and stand in a half-circle around the throne.');await c4Wt(2.8);
    c4Shot([g.x+fx*8.2+sx*2.6,y+3.5,g.z+fz*8.2+sz*2.6],[g.x+fx*1.9,y+1.15,g.z+fz*1.9]);c4Shot([g.x+fx*7.2+sx*1.6,y+3.1,g.z+fz*7.2+sz*1.6],[g.x+fx*1.9,y+1.15,g.z+fz*1.9],.35);
    c1Sub('','Nobody sits. Everybody is looking at the silver tray at Grant\'s feet.');await c4Wt(3)},done)}
function c3SummitOff(){for(const m of C3.spawned)m.parent&&m.parent.remove(m);C3.spawned=[];c3TempOff(C3PRES.map(p=>p[0]))}
// five people downtown and around campus who'll buy
const C3BUY=[['Rusty',[268,612]],['Dolores',[301,614]],['Sarge',[230,612]],['Big Lou',[175,616]],['Mickey',[320,592]]];
function c3Homeless(on){for(const n of C3.homeless||[]){if(n.decor)for(const m of n.decor)m.parent&&m.parent.remove(m);else if(NP.includes(n))despawn(n)}C3.homeless=[];if(!on)return;const s=c3S();
  C3BUY.forEach(([nm,p],i)=>{if(s.sold>i)return;const[x,z]=c3Free(p[0],p[1]);const n=spawn('townies','down',{x,z,a:rnd()*TAU,temp:1,mode:'idle',name:nm,title:'Down on his luck',lvl:2,shirt:[0x5a5048,0x4a3a2a,0x3a4030,0x6a5a4a,0x2e2e34][i],sleeve:[0x4a4038,0x3a2a1a,0x2a3020,0x5a4a3a,0x24242a][i],pants:0x2a2a2a,hair:[0x8a8a8a,0x5a4a3a,0x3a3a3a,0xb0b0b0,0x6a5a4a][i],cap:i%2?0x3a3a42:null,look:{fh:i===1?0:'beard',cl2:'hoodie',hs2:'buzz',fv:i%3,iris:0x4a3a2a}});
    n.hx=x;n.hz=z;n.c3buy=i;C3.homeless.push(n);
    // a bedroll and a cardboard sign at their feet
    const fx=x+Math.sin(n.a+1.2)*.9,fz=z+Math.cos(n.a+1.2)*.9,y=terrH(fx,fz);const bed=c3M(new THREE.CylinderGeometry(.22,.22,1.5,10).rotateZ(PI/2),[0x3a5a3a,0x5a3a2a,0x2a3a5a,0x6a2a2a,0x4a4a3a][i],fx,y+.22,fz);bed.rotation.y=n.a;
    const sg=signMesh(['ANYTHING HELPS','GOD BLESS','VETERAN · HUNGRY','NEED BUS FARE','SMILE :)'][i],.62,.44,'#b8915a','#2a1a0e','Kalam');sg.position.set(x+Math.sin(n.a)*.55,y+.3,z+Math.cos(n.a)*.55);sg.rotation.set(-.5,n.a,0);sg.userData.noMerge=1;sc.add(sg);C3.homeless.push({decor:[bed,sg]})})}
function c3SellLab(){const s=c3S();return`\nSell the five 8 balls to the people sleeping rough downtown (${s.sold}/5)`}
function c3SellGoal(){const n=(C3.homeless||[]).filter(n=>!n.decor&&NP.includes(n)&&!n.c3sold).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z))[0];return n?[n.x,n.z]:null}
/* V246/V248 a buyer wears the powder after the sale: a puff of white, and the powder is painted into the head skin itself by the character shader (uDust), blotchy and see-through to the eyes, brows and lips; no extra mesh */
function c3Dust(n){const g=n.g;if(!g||n.c3dust)return;const v=new THREE.Vector3();if(g.P&&g.P.head){g.P.head.getWorldPosition(v);c3Puff(v.x,v.y+.1,v.z,.5)}
  g.traverse(o=>{const d=o.material&&o.material.userData&&o.material.userData.dust;if(d)d.value=1});n.c3dust=1}
/* V249 a buyer who got an 8 ball goes hyper: darts around his spot, snaps his head about, shakes his arms and chatters (npcUpd calls c3WiredTick/c3WiredPose while n.c3wired is set; the buyer is removed with the rest at quest end/reset) */
const C3WIRED_SAY=['WOOOOO!','Whoa whoa whoa!','I can see COLORS!','Is it hot out here?!','I could run a marathon!','Gotta MOVE gotta MOVE!','Best. Day. EVER.','My teeth are buzzing!','You are a GENIUS, kid!','Did you hear that?! Did you?!'];
function c3Wired(n){n.c3wired=1;n.hx=n.x;n.hz=n.z;n.wT=0;n.wb=2+rnd()*2;if(NP.includes(n))bubble(n,'WOOOOO!',2.2)}
function c3WiredTick(n,dt){if(n.wT>0)n.wT-=dt;if(n.wT<=0||n.wx==null){n.wT=.25+rnd()*.6;const a=rnd()*TAU,r=.6+rnd()*2;n.wx=n.hx+Math.cos(a)*r;n.wz=n.hz+Math.sin(a)*r}
  moveTo(n,n.wx,n.wz,4.2,dt);
  const want=n.dp<6?Math.atan2(P.x-n.x,P.z-n.z):Math.atan2(n.wx-n.x,n.wz-n.z);n.a+=((((want-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*14);
  if(n.dp<20&&(n.wb-=dt)<=0){n.wb=2.5+rnd()*3.5;bubble(n,pick(C3WIRED_SAY),1.8)}
  return''}
function c3WiredPose(n){const p=n.g&&n.g.P;if(!p)return;const t=n.t,j=(f,a,o)=>Math.sin(t*f+o)*a;
  if(p.head){p.head.rotation.y+=j(31,.24,0)+j(13,.2,1.3);p.head.rotation.x+=j(37,.1,.5)}
  if(p.neck)p.neck.rotation.z+=j(29,.07,.9);
  if(p.aL)p.aL.rotation.x+=j(27,.4,0);if(p.aR)p.aR.rotation.x+=j(29,.4,2);
  if(p.eL)p.eL.rotation.x+=j(33,.25,1);if(p.eR)p.eR.rotation.x+=j(35,.25,3);
  if(p.chest)p.chest.rotation.z+=j(23,.05,1);
  if(p.hips)p.hips.position.y+=Math.abs(j(17,.04,0));
  const pa=p.pal&&p.pal[24];if(pa){pa.z=j(23,.9,0);pa.w=j(17,.6,1)}}
/* V250 selling is a conversation now: walk up, talk, make the offer, hand over the bag. Each buyer opens in his own voice; Danny picks how to pitch it; the sale lands on the last choice */
const C3TALK=[
 `Rusty squints up from his bedroll, a cardboard sign propped on his knees.\n\n"Anything helps, kid. Spare a little?"`,
 `Dolores pats the blanket beside her and looks at the paper bag in your hand.\n\n"God bless, honey. You look like a boy with somewhere to be. And something in that bag."`,
 `Sarge sits up straight out of habit.\n\n"Veteran, hungry, and not in the mood for a lecture. What do you want?"`,
 `Big Lou looks up from counting a small pile of coins.\n\n"Need bus fare. Forty-five cents short for about three years. You a bus?"`,
 `Mickey grins with about half his teeth.\n\n"Smile! It's free. Everything else costs. Whatcha got?"`];
const C3PITCH=[
 ['"I\'ve got something that\'ll make today better."','"Better? Kid, I\'d settle for dry. What are we talking about?"'],
 ['"Twenty bucks. You won\'t regret it."','"Twenty? That\'s a week of coffee. It had better be good."'],
 ['"Free sample. Well, almost free."','"Almost free. Those are the two scariest words there are. Go on."']];
function c3Talk(n,beat,pitch){if(!n||!NP.includes(n)||n.c3sold)return;const i=n.c3buy||0;
  if(!beat)return card({title:'The Executive Secret',sp:n.name+' · Down on his luck',focus:n,text:C3TALK[i%5],ch:C3PITCH.map((o,k)=>[o[0],()=>c3Talk(n,1,k)])});
  card({title:'The Executive Secret',sp:n.name+' · Down on his luck',focus:n,text:C3PITCH[pitch][1],ch:[['Open the bag and show him the 8 ball',()=>c3Haggle(n,0)],['Press it into his hand. "Don\'t ask. Just try it."',()=>c3Haggle(n,1)]]})}
/* V251 haggling: each buyer opens low and has a ceiling. Ask at or under it and he pays; ask over it and he counters at his ceiling (take it or walk away and come back). Grant wants a flat $80 for the four bags, so a good haggle is profit and a bad one comes out of Danny's pocket */
const C3LIM=[[10,20],[12,22],[15,25],[8,18],[10,30]];
function c3Haggle(n,how){const[o]=C3LIM[(n.c3buy||0)%5];
  card({title:'The Executive Secret',sp:n.name+' · Down on his luck',focus:n,text:(how?'He closes his fist around the bag before he even looks.':'He looks at the 8 ball the way other people look at a sunrise.')+'\n\n"Hmm. I\'ll give you $'+o+' for it."',
    ch:[['"Deal. $'+o+'."',()=>c3Ask(n,o)],['"Twenty. Firm."',()=>c3Ask(n,20)],['"Thirty. It\'s top shelf."',()=>c3Ask(n,30)]]})}
function c3Ask(n,a){const[o,L]=C3LIM[(n.c3buy||0)%5];
  if(a<=L)return c3Deal(n,a,a<=o?'He doesn\'t even blink.':a>20?'He whistles, then pays up. "Premium, huh?"':a<20?'He grumbles, then counts out the bills.':'He sighs and digs out the cash.');
  card({title:'The Executive Secret',sp:n.name+' · Down on his luck',focus:n,text:'"$'+a+'?! Kid, I sleep on the sidewalk. Best I can do is $'+L+'."',
    ch:[['"Fine. $'+L+'."',()=>c3Deal(n,L,'You shake on it.')],['Walk away',()=>{if(NP.includes(n))bubble(n,'Come back when you\'re serious!',2.4)}]]})}
function c3Deal(n,price,note){const s=c3S();if(n.c3sold)return;n.c3sold=1;s.sold++;s.earn=(s.earn||0)+price;c3Dust(n);c3Wired(n);money(price);sfx('coin');dmgNum(P.x,2.6,P.z,'+$'+price,'#7fe07a');updObj();
  card({title:'The Executive Secret',sp:n.name+' · Down on his luck',focus:n,text:note+' $'+price+' lands in your palm. Then his pupils blow wide open.\n\n"'+pick(['Oh. OH. Bless you, college boy.','Okay. OKAY. Okay!','Don\'t tell nobody. Don\'t tell nobody! Wooo!','You\'re the best frat kid this week!'])+'"',ch:[['Back away slowly',()=>{}]]})}
function c3SecretPrompts(add){const st=curStep();if(!st||st.ok!==c3SellOk)return;const s=c3S();
  for(const n of C3.homeless||[]){if(n.decor||n.c3sold||!NP.includes(n)||P.inside)continue;add(n.x,n.z,2.4,'Talk to '+n.name,()=>{if(s.sold>=4&&!s.ucDone)c3UcStart(n);else c3Talk(n,0)},0)}}/* V240 priority 0 so the sell prompt beats the plain 'Talk to' prompt on the same person */
const c3SellOk=()=>c3S().sold>=5;
function c3Officer(){const st=curStep(),[x,z]=c3Free(P.x+Math.sin(P.face)*3.2,P.z+Math.cos(P.face)*3.2);const n=spawn('cops','down',{x,z,a:Math.atan2(P.x-x,P.z-z),temp:1,mode:'idle',actor:1,name:'Officer Dale Kerrigan',title:'Harrowgate PD',lvl:9});n.hx=x;n.hz=z;c3Temp(n);sfx('whistle');bubble(n,'Hold up, son.',2)}
/* V268 the cop encounter happens once: after it (arrest or pass) s.ucDone is set and the retry sells the last bag like the others. V245 the last bag is always an undercover cop. He asks three things; one wrong answer and Danny is arrested and the quest resets */
const C3UC=[
 {t:`The last man on your list doesn't shuffle over the way the others did. He walks straight at you, and for someone who sleeps rough his boots are spotless.\n\n"Hey, kid. You're the one with the bags. Twenty a bag, right? I've got it right here."`,
  a:[['"Twenty. Cash first."',0,'You take his twenty. He takes your wrist.'],['"I never told anybody the price. Who sent you?"',1],['Turn around and run',0,'You make it about forty feet.']]},
 {t:`He doesn't flinch. "Dolores. Everybody on this block is talking about you." He glances up and down the street the way you'd check for traffic. Or for somebody.\n\n"Look, I'm picky. Let me see it first. Take it out. And who's your supplier? I like to know who I'm buying from."`,
  a:[['"Alpha Sigma Rho. Grant Ashby runs the whole thing."',0,'Grant\'s name goes into a notebook. A very tidy little notebook.'],['Take the 8 ball out and show him',0,'He looks at the bag for exactly as long as it takes to take a photo of it.'],['"I don\'t show anything. I don\'t have a supplier. Go ask Dolores again."',1]]},
 {t:`"Okay. Okay." He laughs, a little too easily, and pulls a roll of bills from his hoodie. The roll is much too thick. Something small and silver swings out on a chain at his collar before he tucks it away.\n\n"A hundred. For one bag. Right now, before somebody walks by. Nobody's looking."`,
  a:[['"A hundred? Deal."',0,'Nobody was looking. Except everybody.'],['"Make it two hundred."',0,'The haggling is the last thing the arresting officer writes down.'],['Say nothing. Hands in your pockets. Wait him out.',1]]}
];
function c3UcStart(n){c3UcAsk(n,0)}
function c3UcAsk(n,r){if(!n||!NP.includes(n))return;const R=C3UC[r];
  const ch=R.a.map(([l,ok,why])=>[l,()=>{if(!ok)c3UcBust(n,why);else if(r<2)c3UcAsk(n,r+1);else c3UcPass(n)}]).sort(()=>rnd()-.5);
  card({title:'The Executive Secret',sp:n.name+' · Down on his luck',focus:n,text:R.t,ch})}
function c3UcBust(n,why){c3S().ucDone=1;sfx('whistle');if(NP.includes(n))bubble(n,'Harrowgate PD! Hands where I can see them!',3);
  [['Officer Dale Kerrigan',-1.1,0],['Detective Alana Ruiz',1.1,1]].forEach(([nm,d,fem])=>{const[x,z]=c3Free(P.x+Math.sin(P.face+d)*2.6,P.z+Math.cos(P.face+d)*2.6);
    const c=spawn('cops','down',{x,z,a:Math.atan2(P.x-x,P.z-z),temp:1,mode:'idle',actor:1,name:nm,title:'Harrowgate PD',fem:!!fem,lvl:9});c.hx=x;c.hz=z;c3Temp(c)});
  card({title:'ARRESTED',sp:'Harrowgate PD · Narcotics',alert:1,text:why+'\n\nCuffs. The back of a cruiser. A very long night. Grant\'s lawyer has you out by morning, but the cops keep the cash from the bags and the last 8 ball.',ch:[['Go quietly',()=>c3UcCuffs()]]})}
function c3UcCuffs(){const s=c3S();s.busted=1;S.stats.busts++;money(-Math.min(S.money,s.earn||0));
  if(S.pledged)classSpirit(-5,'Grant makes the whole pledge class do push-ups because you got arrested. Class Spirit −5.');
  S.trouble=0;NP.forEach(n=>{n.chase=0});goOut(SPOT.ASR[0]-1,SPOT.ASR[1]);advance(3);
  failMission('You were arrested selling to an undercover cop.')}
/* V419 the stand-off with the undercover is played out as a scene (it used to be one text card): Danny waits him out with his hands in his pockets, the badge comes out, the cop talks in the normal conversation box and walks off, and Danny drops the last bag down a storm drain */
function c3UcPass(n){const s=c3S();s.ucDone=1;const M_=[];let fin=0;
  const end=()=>{if(fin)return;fin=1;for(const m of M_)m.parent&&m.parent.remove(m);n.c3sold=1;s.sold++;sfx('ok');toast('Close call. Four sold, one gone.',2800);if(NP.includes(n)){C4.pups=C4.pups.filter(q=>q!==n);despawn(n)}updObj()};
  if(!n||!NP.includes(n)||!n.g){end();return}
  c6Cine(async()=>{let dx=n.x-P.x,dz=n.z-P.z,L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;if(L<1.5||L>2.6){const[x,z]=c3Free(n.x-dx*1.9,n.z-dz*1.9);P.x=x;P.z=z;dx=n.x-P.x;dz=n.z-P.z;L=Math.hypot(dx,dz)||1;dx/=L;dz/=L}
    const y=terrH(P.x,P.z),mx=(P.x+n.x)/2,mz=(P.z+n.z)/2,fa=Math.atan2(dx,dz);/* the camera works from whichever side of the pair is open ground */const open=k=>freeAt(mx+dz*3.6*k,mz-dx*3.6*k,.7)&&freeAt(mx+dz*2*k,mz-dx*2*k,.5),sk=open(1)?1:open(-1)?-1:1,sx=dz*sk,sz=-dx*sk;
    c4DanAt(P.x,P.z,fa);C4.dan.arms=.16;
    n.grab=1;n.noTalk=1;n.a=fa+PI;n.pup={tx:n.x,tz:n.z,v:1.7,st:'',y:null,t:0,face:fa+PI,lean:0,lie:0};n.g.rotation.order='YXZ';if(!C4.pups.includes(n))C4.pups.push(n);c4PupPlace(n,0);
    c4Shot([mx+sx*3.6,y+1.7,mz+sz*3.6],[mx,y+1.2,mz]);c4Shot([mx+sx*3.1,y+1.6,mz+sz*3.1],[mx,y+1.2,mz],.25);
    c1Sub('','Danny puts his hands in his pockets and keeps his mouth shut.');await c4Wt(2.6);c1Sub(null);
    c4Shot([P.x-dx*.9+sx*.75,y+1.75,P.z-dz*.9+sz*.75],[n.x,y+1.45,n.z]);
    await c1Line(n,'A hundred, kid. One bag. Nobody\'s looking. …Well?');SCENE=null;
    c4Shot([n.x+dx*.6-sx*.7,y+1.7,n.z+dz*.6-sz*.7],[P.x,y+1.5,P.z]);c1Sub('','He waits. Danny waits longer.');await c4Wt(2.8);c1Sub(null);
    /* the act drops: head down, shoulders down, and the badge swings out on its chain */
    const bd=new THREE.Group(),sil=mt(0xdfe4ee,.22,.9);const ch1=new THREE.Mesh(bgeo(.012,.2,.012),sil);ch1.position.y=-.1;const pl=new THREE.Mesh(new THREE.CylinderGeometry(.095,.075,.025,6),new THREE.MeshStandardMaterial({color:0xe8ecf4,metalness:.9,roughness:.2,emissive:0x8a94a8,emissiveIntensity:.5}));pl.rotation.x=PI/2;pl.position.y=-.24;bd.add(ch1,pl);bd.position.set(0,1.46,.235);n.g.add(bd);M_.push(bd);let bt=0;
    n.pup.post=g=>{bt+=1/30;bd.rotation.z=Math.sin(bt*6)*.3*Math.exp(-bt*.7);const q=g.P;if(q&&q.head)q.head.rotation.x=.3*Math.min(1,bt*2);if(q&&q.aL&&q.aR){q.aL.rotation.set(.05,0,.1);q.aR.rotation.set(.05,0,-.1)}};
    c4Shot([n.x-dx*1.05+sx*.62,y+1.42,n.z-dz*1.05+sz*.62],[n.x,y+1.28,n.z]);c4Shot([n.x-dx*.9+sx*.5,y+1.4,n.z-dz*.9+sz*.5],[n.x,y+1.26,n.z],.3);sfx('ui');
    c1Sub('','His shoulders drop. A silver badge swings out on its chain.');await c4Wt(2.4);c1Sub(null);
    n.title='Harrowgate PD · Narcotics';c4Shot([P.x-dx*.9+sx*.75,y+1.75,P.z-dz*.9+sz*.75],[n.x,y+1.45,n.z]);
    await c1Line(n,'Narcotics. Smart kid. Next time I won\'t be this patient.');SCENE=null;/* the conversation box holds Danny's facing until it is let go */
    /* he walks off without looking back: pick the clearest way that leads away from Danny */
    let wa=fa;for(const o of[0,.8,-.8,1.5,-1.5]){const a=fa+o;if(freeAt(n.x+Math.sin(a)*4,n.z+Math.cos(a)*4,.4)&&freeAt(n.x+Math.sin(a)*8,n.z+Math.cos(a)*8,.4)){wa=a;break}}
    n.pup.post=null;c4To(n,n.x+Math.sin(wa)*15,n.z+Math.cos(wa)*15,1.9);
    c4Shot([P.x-dx*2.3+sx*1.3,y+1.9,P.z-dz*2.3+sz*1.3],[n.x+Math.sin(wa)*5,y+1.2,n.z+Math.cos(wa)*5]);c1Sub('','He walks away without looking back.');await c4Wt(3.6);c1Sub(null);
    n.hidden=1;n.g.visible=false;
    /* the storm drain */
    const[gx,gz]=c3Free(P.x+sx*2.1-dx*.3,P.z+sz*2.1-dz*.3),gy=terrH(gx,gz);const dr=new THREE.Group();dr.add(new THREE.Mesh(bgeo(.9,.04,.55),mt(0x121316,.9)));for(let i=0;i<5;i++){const b=new THREE.Mesh(bgeo(.05,.05,.55),mt(0x5a5e66,.5,.7));b.position.set(-.34+i*.17,.02,0);dr.add(b)}dr.position.set(gx,gy+.03,gz);dr.rotation.y=fa;sc.add(dr);M_.push(dr);
    const da=Math.atan2(gx-P.x,gz-P.z);c4DanTo(gx-Math.sin(da)*.55,gz-Math.cos(da)*.55,1.8);C4.dan.arms=null;
    c4Shot([gx+sx*2.3+dx*.6,gy+1.7,gz+sz*2.3+dz*.6],[gx-sx*.2,gy+.6,gz-sz*.2]);await c4Wt(1.9);
    C4.dan.look=[gx,gz];C4.dan.lean=-.42;C4.dan.arms=-.55;await c4Wt(.6);
    const bag=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xfffff0,emissiveIntensity:.5,roughness:.5}));sc.add(bag);M_.push(bag);
    const bx=P.x+Math.sin(da)*.5,bz=P.z+Math.cos(da)*.5;for(let t=0;t<1;t+=.05){bag.position.set(bx+(gx-bx)*t,gy+.85-(.95*t*t),bz+(gz-bz)*t);await c4Wt(.035)}bag.visible=false;sfx('coin');
    c1Sub('','The last 8 ball goes down a storm drain.');await c4Wt(1.2);C4.dan.lean=0;C4.dan.arms=null;await c4Wt(1.3);c1Sub(null)},end)}
/* after an arrest the quest restarts at the bag hand-off: the board meeting is not replayed */
const c3SecretRedo=L=>{if(!c3S().redo)return L;const i=L.findIndex(x=>x.t==='cond');
  return[C_('The Executive Secret','Grant Ashby · Chapter president','\"The lawyer\'s bill is on me this time. Five fresh bags, same street. And Danny: that undercover is burned. He won\'t be back on this beat. Just sell.\"',[['Take the bag',()=>{c3S().bags=5}]]),...L.slice(i)]};

// ================================================================ quest c · Disappearance
const C3CLUES=[['phone','His phone, face-down in the hedge outside the library. Forty missed calls from Grant.',[166,140.5]],['button','A torn strip of black hood, snagged on the rail of the campus fountain. No letters on it. No name.',[214,212]],['note','A note taped to his bike outside the Union, in block capitals, unsigned: "WANT HIM BACK? LOADING DOCK BEHIND TANGEMAN. COME ALONE. BRING THE BOOKS."',[203,127]]];/* V422 the kidnappers are anonymous: no ΚΘΩ button, no ΚΘΩ backyard */
function c3ClueP(k){C3.clueP=C3.clueP||{};if(C3.clueP[k])return C3.clueP[k];const c=C3CLUES.find(c=>c[0]===k);let p=c[2];if(k==='button'&&typeof FOUNT!=='undefined')p=[FOUNT[0]+3.2,FOUNT[1]];else if(k==='note')p=[SPOT.UNION[0]+2.4,SPOT.UNION[1]-.6];else if(k==='phone')p=[SPOT.LIB[0]-2.4,SPOT.LIB[1]+.6];/* beside the entrances, at street level */return C3.clueP[k]=c3Free(p[0],p[1],.5)}
function c3ClueProps(on){for(const m of C3.clueM||[])m.parent&&m.parent.remove(m);C3.clueM=[];if(!on)return;const s=c3S();
  for(const[k]of C3CLUES){const p=c3ClueP(k);if(s.clue[k])continue;const y=terrH(p[0],p[1]);let m;if(k==='phone')m=c3M(bgeo(.09,.015,.17),0x101014,p[0],y+.02,p[1]);else if(k==='button')m=c3M(bgeo(.3,.012,.11),mt(0x111114,.95),p[0],y+.02,p[1]);else{m=new THREE.Group();m.position.set(p[0],y,p[1]);const fr=new THREE.Mesh(new THREE.TorusGeometry(.33,.03,6,16),mt(0x2a5a9a,.5));fr.position.y=.35;m.add(fr);const n=new THREE.Mesh(new THREE.PlaneGeometry(.22,.16),new THREE.MeshBasicMaterial({color:0xf4f0e0,side:THREE.DoubleSide}));n.position.set(0,.75,0);m.add(n);sc.add(m)}
    const glint=c3M(GC.c3gl||(GC.c3gl=new THREE.OctahedronGeometry(.12,0)),new THREE.MeshBasicMaterial({color:0xffe27a}),p[0],y+1.1,p[1]);glint.userData.spin=1;C3.clueM.push(m,glint)}}
function c3ClueLab(){const s=c3S();return'\nFind what happened to Wes ('+C3CLUES.filter(([k])=>s.clue[k]).length+'/3)\n'+C3CLUES.map(([k,t])=>(s.clue[k]?'✓ ':'○ ')+(s.clue[k]?t.split('.')[0]:'A clue somewhere on campus')).join('\n')}
function c3ClueGoal(){const s=c3S(),c=C3CLUES.find(([k])=>!s.clue[k]);return c?c3ClueP(c[0]):null}
function c3CluePrompts(add){const st=curStep();if(!st||st.ok!==c3ClueOk||P.inside)return;const s=c3S();
  for(const[k,t]of C3CLUES){if(s.clue[k])continue;const p=c3ClueP(k);add(p[0],p[1],2.2,'Look closer',()=>{s.clue[k]=1;sfx('ok');c3ClueProps(1);card({title:'A Clue',sp:'',text:t});updObj()},3)}}
const c3ClueOk=()=>C3CLUES.every(([k])=>c3S().clue[k]);
// V269 Wes, duct-taped to a lawn chair in the KTHO BACKYARD (the note says "KTHO BACKYARD"). A seated puppet, so a cutscene can show him with no marker to press.
const C3WESB=[17.6,35.2],C3WESA=-PI/2;
/* V422 Wes is held by the loading dock behind the Tangeman Center (it used to be the ΚΘΩ backyard). SPOT.DOCK is only known once the world is built, so the spot is worked out on first use */
function c3WesB(){if(!C3WESB.set&&typeof SPOT!=='undefined'&&SPOT.DOCK&&typeof freeAt==='function'){C3WESB.set=1;const[x,z]=c3Free(SPOT.DOCK[0]-2,SPOT.DOCK[1]+5,.6);C3WESB[0]=x;C3WESB[1]=z}return C3WESB}
/* the kidnappers: black hoodie, hood up, a black mask over the mouth. Nothing on them says which house they are from */
const C3HOODLOOK={cl2:'hoodie',fh:0,shoe:0x101012,sole:0x08080a};const C3HOODOPT={skin:0xeec6a4,shirt:0x141418,sleeve:0x141418,pants:0x17171c,cap:0,noLetters:1,look:C3HOODLOOK};
function c3Hood(n){if(!n||!n.g||n.c3hood)return n;try{bodyBuild(n.g)}catch(e){}const h=n.g.P&&n.g.P.head;if(!h)return n;n.c3hood=1;const M_=new THREE.MeshStandardMaterial({color:0x121216,roughness:.95,side:THREE.DoubleSide});
  /* V454 no hood shell over the head (the user found it ugly): just the face mask */
  /* V452 the mask is cut from his own head: the head's surface from under the chin to just below the eyes (and a strap round the back), lifted 7 mm
     off the skin, so it follows his face like cloth instead of sitting on it like a block. Falls back to the V451 shell if the body has no head data */
  {const MK=new THREE.MeshStandardMaterial({color:0x1d1d24,roughness:1,side:THREE.DoubleSide}),mg=c3MaskGeo(n);if(mg){const mk=new THREE.Mesh(mg,MK);mk.userData.noMerge=1;mk.castShadow=false;h.add(mk)}
   else{const mk=new THREE.Mesh(new THREE.SphereGeometry(.262,22,10,PI/2-1.25,2.5,PI*.53,PI*.33),MK);mk.scale.set(1.02,1.1,1.1);mk.position.set(0,.12,.008);mk.userData.noMerge=1;h.add(mk)}}
  n.title='Unknown';n.taunt=['Wrong place, pledge.','He said come ALONE.','Where are the books?','Put him down. Both of them.'];return n}
function c3WesChair(on){return c4Group('c3weschair',on,g=>{const[x,z]=c3WesB(),W=mt(0x4a3626,.8),h=new THREE.Group();h.position.set(x,terrH(x,z),z);h.rotation.y=C3WESA;h.userData.noMerge=1;g.add(h);c4M(bgeo(.5,.06,.5),W,0,.46,0,h);c4M(bgeo(.5,.6,.06),W,0,.8,-.25,h);for(const sx of[-.22,.22])for(const sz of[-.22,.22])c4M(bgeo(.05,.46,.05),W,sx,.23,sz,h)})}
function c3WesSpawn(){if(C3.wes&&NP.includes(C3.wes))return C3.wes;const[x,z]=c3WesB();c3WesChair(1);
  const n=c4Pup('brothers',x,z,C3WESA,{tag:'c3wes',int:null,name:'Wes Morrow',title:'ASR Treasurer',house:'asr',lvl:5,st:'sit',look:{gl:1,hs2:'short',cl2:'tee',fh:0,fv:1,iris:0x4a3a2a}});
  if(!n)return null;/* V460 arms straight down, pressed to his sides, so the tape round his chest holds them there */n.pup.arms=null;n.pup.post=g=>{const q=g.P;if(!q)return;for(const k of['aL','aR','eL','eR','hL','hR'])if(q[k])q[k].rotation.set(0,0,0)};n.c3bound=1;C3.wes=n;if(AM)AM.temps.push(n);const P_=n.g&&n.g.P;n.c3tape=[];
  if(P_){/* V460 duct tape wrapped round his own body (chest and arms together, the belly and forearms, the thighs, the ankles) and a strip over his mouth,
     all skinned to his skeleton so it sits on him and moves with him. The old ring-and-slab tape is only the fallback */
    try{bodyBuild(n.g)}catch(e){}const tm=new THREE.MeshStandardMaterial({color:0x9c9ea4,roughness:.55,metalness:.25,side:THREE.DoubleSide}),gm=new THREE.MeshStandardMaterial({color:0xb4b6bc,roughness:.5,metalness:.2,side:THREE.DoubleSide});
    const sk=P_.torso&&P_.torso.skeleton,bi=b=>sk?sk.bones.indexOf(b):-1,TOR=[bi(P_.chest),bi(P_.spine),bi(P_.hips)],ARM=[bi(P_.aL),bi(P_.aR),bi(P_.eL),bi(P_.eR)],LEG=[bi(P_.lL),bi(P_.lR),bi(P_.kL),bi(P_.kR),bi(P_.fL),bi(P_.fR)],HD=bi(P_.head);
    const W=[c3Wrap(n,[1.2,1.235,1.27,1.305],b=>TOR.includes(b)||ARM.includes(b),.01,tm),c3Wrap(n,[1.04,1.075,1.11],b=>TOR.includes(b)||ARM.includes(b),.012,tm),c3Wrap(n,[.66,.7,.74],b=>LEG.includes(b),.01,tm),c3Wrap(n,[.19,.23,.27],b=>LEG.includes(b),.01,tm),c3Wrap(n,[1.645,1.67,1.695],b=>b===HD,.006,gm)];
    if(W.every(Boolean))n.c3tape.push(...W);else{for(const w of W)if(w&&w.parent)w.parent.remove(w);
    for(const[b,y,r]of[[P_.chest,0,.27],[P_.chest,-.18,.26],[P_.hips,-.12,.22]]){if(!b)continue;const t=new THREE.Mesh(new THREE.TorusGeometry(r,.035,6,18),tm);t.rotation.x=PI/2;t.position.y=y;b.add(t);n.c3tape.push(t)}
    if(P_.head){const gag=new THREE.Mesh(bgeo(.44,.06,.44),tm);gag.position.set(0,.08,0);P_.head.add(gag);n.c3tape.push(gag)}}}
  bubble(n,'MMPH! MMMPH!',2);return n}
/* V460 the guards stand round the chair facing out, three to five metres off, before the fight starts */
function c3Guards(){const st=curStep();if(!st||!st.foes_)return;const[x,z]=c3WesB();st.foes_.forEach((n,i)=>{const a=-PI/2+(i-(st.foes_.length-1)/2)*.75+(i%2?PI:0),r=3+(i%3)*.8;let gx=x+Math.sin(a)*r,gz=z+Math.cos(a)*r;if(typeof freeAt==='function'&&!freeAt(gx,gz,.4)){const f=c3Free(gx,gz,.4);gx=f[0];gz=f[1]}n.x=n.hx=gx;n.z=n.hz=gz;n.a=Math.atan2(gx-x,gz-z);n.mode='idle';n.path=null;if(n.g)n.g.position.set(gx,terrH(gx,gz),gz)})}
/* cut the tape: the puppet becomes a normal follower NPC again */
function c3WesFree(w){if(!w)return;for(const t of w.c3tape||[])t.parent&&t.parent.remove(t);w.c3tape=[];w.c3bound=0;
  if(w.pup){w.pup=null;w.grab=0;w.noTalk=0;C4.pups=C4.pups.filter(n=>n!==w);C4.mine=C4.mine.filter(n=>n!==w);for(const k in C4.cast)if(C4.cast[k]===w)delete C4.cast[k];if(w.g){w.g.rotation.x=0;w.g.rotation.z=0}}
  w.actor=0;w.follow=1;w.mode='idle';C3.wesFreed=1;c3WesChair(0)}
/* while the backyard steps are active Wes is always there (also after a load), and he mumbles when you come near */
function c3WesTick(){const st=curStep();if(!st||!st.c3wb)return;if(st.c3wake&&st.foes_&&!st.c3g){st.c3g=1;c3Guards()}if(st.c3wake&&st.woke&&!st.c3lab){st.c3lab=1;st.label='Hooded figures are guarding Wes. Take them down with Tank';try{updObj()}catch(e){}}if(!(C3.wes&&NP.includes(C3.wes))&&!C3.wesFreed&&c3ClueOk())c3WesSpawn();
  const w=C3.wes;if(w&&w.c3bound&&NP.includes(w)&&Math.hypot(w.x-P.x,w.z-P.z)<14&&TT>(C3.wbT||0)){C3.wbT=TT+5;bubble(w,pick(['MMPH!','MMMPH! MMPH!','MMM-MMPH!']),1.8)}}
/* V274 during Disappearance every ΚΘΩ brother turns hostile when Danny comes within range (no button, no card) */
const C3KTOR=11;
/* spawn() does not keep the house id on the NPC, but every ΚΘΩ brother and officer is titled 'ΚΘΩ ...' */
const c3IsKto=n=>typeof n.title==='string'&&n.title.indexOf('ΚΘΩ')===0;
function c3KtoTick(){if(mode!=='play'||CINE||EV)return;for(const n of NP){if(!c3IsKto(n)||n.down||n.hidden||n.kid||n.auth||n.actor||n.pledge||n.prop||n.mute||n.statue||n.grab||n.ally||n.follow||n.aggro)continue;if((n.int||null)!==(P.inside||null)||n.dp>C3KTOR)continue;n.aggro=1;n.tgt='P';n.job=null;n.path=null;n.c3k=1;if(TT>(n.c3kT||0)){n.c3kT=TT+6;bubble(n,pick(['That\'s Kowalski! Get him!','You\'ve got a lot of nerve showing up here, ΑΣΡ!','Where\'s your treasurer, pledge? Oh, right.','Jump him!']),2.2)}}}
function c3KtoCalm(){for(const n of NP){if(!n.c3k)continue;n.c3k=0;if(n.aggro&&n.tgt==='P'&&!n.temp){n.aggro=0;n.tgt=null}}}
/* shown automatically when the last clue is found: no marker, no button */
async function c3WesBackCine(done){const[wx,wz]=c3WesB(),gy=terrH(wx,wz);
  /* the dock is a sunken service lane with a building on each side: every shot looks along the lane from the west */
  await c6Cine(async()=>{const w=C3.wes,g1=C3.g1,g2=C3.g2;
    c4Shot([wx-6.2,gy+2,wz+1.2],[wx,gy+1,wz],1.1);bubble(w,'MMPH! MMMPH!',2.4);await c4Wt(2.2);
    c1Sub('','Behind the Tangeman Center, down by the loading dock: a lawn chair, a roll of duct tape, and one very annoyed treasurer.');await c4Wt(3.6);c1Sub(null);
    c4Shot([wx-3.4,gy+1.7,wz+2.4],[wx+1.2,gy+1.25,wz+.4],1.4);
    if(c4Live(g1)){c1Say(g1,'Nobody touches him until he tells us where the books are.',4.4);await c4Wt(4.6)}
    if(c4Live(g2)){c1Say(g2,'He keeps saying \'mmph.\' I think that means no.',4);await c4Wt(4.2)}c1Sub(null);
    c4Shot([wx-2.5,gy+1.45,wz+.9],[wx,gy+1.15,wz],1.6);bubble(w,'MMMPH!!',2.2);await c4Wt(1.8);
    c1Sub('','Black hoods. No letters. No names.');await c4Wt(2.4);c1Sub(null);
    await c4Fade(async()=>{c4Off('c3g')})},done,{fade:async()=>{c3WesSpawn();const o=Object.assign({tag:'c3g',int:null,lvl:6,name:'Hooded Figure',title:'Unknown'},C3HOODOPT);
      C3.g1=c3Hood(c4Pup('legacies',wx+1.9,wz+1.3,PI,Object.assign({},o)));C3.g2=c3Hood(c4Pup('legacies',wx+.9,wz-1.8,-PI/2,Object.assign({},o)));
      c4Look(C3.g1,wx-4,wz+1);c4Look(C3.g2,wx-4,wz);c4Shot([wx-9,gy+2.7,wz+1.6],[wx,gy+1,wz],0)},after:()=>{c4Off('c3g');C3.g1=C3.g2=null}})}
/* V461 Wes, just cut loose, tells Danny and Tank what happened: a conversation in the usual boxes */
async function c3WesTalk(done){const w=C3.wes,t=AM&&AM.temps.find(n=>n.ally&&NP.includes(n));await c6Cine(async()=>{const wx=w?w.x:P.x,wz=w?w.z:P.z,y=terrH(wx,wz);
    c4Shot([(wx+P.x)/2-2.6,y+1.8,(wz+P.z)/2+2.4],[(wx+P.x)/2,y+1.2,(wz+P.z)/2]);
    const T=t||null,L=[[w,'They grabbed me after the Thursday drop. Bag over my head, then hoods the whole time.'],[w,'Nobody used a name. All they wanted was the ledgers. Every sale, every house, every name.'],[DANNY,'Did you give them anything?'],[w,'No. I think. They had a lot of questions and a lot of tequila.']];
    if(T)L.push([T,'Who were they?']);else L.push([DANNY,'Who were they?']);L.push([w,'One of them did all the talking. That\'s everything I\'ve got.'],[w,'The books are fine. They\'re where I always hide them. Tell Grant.'],[DANNY,'Let\'s get you home.']);
    await c8Lines(L.filter(l=>l[0]))},done,{fade:async()=>{if(w&&NP.includes(w)){const[x,z]=c3Free(P.x+1.3,P.z+.6,.4);w.x=x;w.z=z;w.a=Math.atan2(P.x-x,P.z-z);if(w.g){w.g.position.set(x,terrH(x,z),z);w.g.rotation.y=w.a}}c4DanAt(P.x,P.z,w?Math.atan2(w.x-P.x,w.z-P.z):P.face);if(t&&NP.includes(t)){const[x,z]=c3Free(P.x-1.2,P.z+1.4,.4);t.x=x;t.z=z;t.a=Math.atan2(P.x-x,P.z-z);if(t.g){t.g.position.set(x,terrH(x,z),z);t.g.rotation.y=t.a}}}})}
/* V463 Grant's stash: an army footlocker on the floor beside the throne, lid propped open, baggies packed in rows */
const C3STASH=[27.45,1.35];
function c3StashP(){const I=INT.asr;return[I.x0+C3STASH[0],I.z0+C3STASH[1]]}
function c3Stash(on){if(C3.stash){C3.stash.parent&&C3.stash.parent.remove(C3.stash);C3.stash=null}const I=INT.asr;if(!on||!I)return;const[x,z]=c3StashP(),g=new THREE.Group();g.position.set(x,.3,z);/* on the throne dais */g.userData.noMerge=1;
  const OD=mt(0x3d4a2c,.75),BR=mt(0xb08a3a,.35,.7),IN=mt(0x2a2418,.9);
  c3M(bgeo(.9,.42,.52),OD,0,.21,0,g);c3M(bgeo(.84,.02,.46),IN,0,.41,0,g);
  for(const sx of[-.45,.45])for(const sz of[-.26,.26])c3M(bgeo(.06,.44,.06),BR,sx,.22,sz,g);
  for(const sx of[-.47,.47])c3M(bgeo(.03,.06,.2),BR,sx,.3,0,g);
  const lid=new THREE.Group();lid.position.set(0,.42,-.26);lid.rotation.x=-1.85;g.add(lid);c3M(bgeo(.92,.06,.54),OD,0,.03,.27,lid);c3M(bgeo(.16,.05,.04),BR,0,.03,.54,lid);
  const bags=[];const BM=new THREE.MeshStandardMaterial({color:0xf6f6f2,roughness:.35,transparent:true,opacity:.92});for(let r=0;r<3;r++)for(let c=0;c<5;c++){const b=c3M(bgeo(.13,.07,.11),BM,-.3+c*.15,.42+(r%2)*.03,-.15+r*.15,g);b.rotation.y=(r*5+c)%3*.2-.2;bags.push(b)}
  g.userData.bags=bags;g.userData.lid=lid;I.g.add(g);C3.stash=g}
function c3StashTake(){const g=C3.stash;if(!g)return;sfx('ok');let i=0;for(const b of g.userData.bags){if(i++<10)b.visible=false}setTimeout(()=>{if(C3.stash===g)c3Stash(0)},4000)}
/* V464 Grant hands over the three bags for Framing: three baggies pass from his hand to Danny's, one by one */
async function c3FrameBags(done){const g=NN.grant;if(!g||!g.g||P.inside!=='asr'){if(done)done();return}await c6Cine(async()=>{const gp=g.g.position,a=g.a||0,hx=gp.x+Math.sin(a)*.45,hz=gp.z+Math.cos(a)*.45,hy=gp.y+1.0;
    c4Shot([(gp.x+P.x)/2+2.4,gp.y+1.9,(gp.z+P.z)/2+.6],[(gp.x+P.x)/2,gp.y+1.05,(gp.z+P.z)/2]);await c4Wt(.4);
    const M_=new THREE.MeshStandardMaterial({color:0xf6f6f2,roughness:.35});const bs=[];
    for(let i=0;i<3;i++){const b=new THREE.Mesh(bgeo(.12,.04,.09),M_);b.userData.noMerge=1;b.position.set(hx+(i-1)*.12,hy,hz);sc.add(b);bs.push(b)}
    bubble(g,'Three. One per house.',2);await c4Wt(.9);
    for(let i=0;i<3;i++){const b=bs[i],x0=b.position.x,z0=b.position.z,x1=P.x+Math.sin(P.face)*.3,z1=P.z+Math.cos(P.face)*.3,y1=(P.y||0)+1.0;
      for(let t=0;t<=1.001;t+=.08){b.position.set(x0+(x1-x0)*t,hy+(y1-hy)*t+Math.sin(t*PI)*.25,z0+(z1-z0)*t);b.rotation.y=t*3;await c4Wt(.03)}sfx('ui');b.visible=false;await c4Wt(.25)}
    for(const b of bs)sc.remove(b);M_.dispose();c1Sub('','Three small bags go into your jacket.');await c4Wt(2);c1Sub(null)},done,
    {fade:async()=>{const g2=NN.grant;if(g2){const a=g2.a||0,[x,z]=c3Free(g2.x+Math.sin(a)*1.5,g2.z+Math.cos(a)*1.5,.4);c4DanAt(x,z,Math.atan2(g2.x-x,g2.z-z))}}})}
/* V422 Tank comes along on the rescue (Grant sends only the two of them): one Tank, made again after a load */
function c3TankAlly(){if(!AM)return;if(AM.temps.some(n=>n.ally&&NP.includes(n)))return;spawnAlly('tank')}
function c3CopsAtHouse(on){for(const n of C3.cops||[])if(NP.includes(n))despawn(n);C3.cops=[];if(C3.copCar){sc.remove(C3.copCar);C3.copCar=null}if(!on)return;
  const car=mkCarMesh();car.position.set(80,terrH(80,82),82);car.rotation.y=PI;const bar=new THREE.Group();for(const[s,c]of[[-.4,0xff2a2a],[.4,0x2a6aff]]){const l=new THREE.Mesh(bgeo(.7,.16,.3),new THREE.MeshBasicMaterial({color:c}));l.position.x=s;bar.add(l)}bar.position.y=1.72;car.add(bar);sc.add(car);C3.copCar=car;
  for(const[nm,x,z,fem]of[['Detective Alana Ruiz',86.5,79,1],['Officer Dale Kerrigan',87.6,74.8,0]]){const n=spawn('cops','greek',{x,z,a:Math.atan2(89.2-x,76.6-z),temp:1,mode:'idle',actor:1,name:nm,title:'Harrowgate PD',fem:!!fem,lvl:9});n.hx=x;n.hz=z;C3.cops.push(n);if(AM){AM.temps.push(n);AM.actors=AM.actors||{};AM.actors[nm]=n}}
  const[gx,gz]=c3Free(89.4,76.8);const g=spawn('brothers','greek',{x:gx,z:gz,a:-PI/2,temp:1,mode:'idle',actor:1,name:'Grant Ashby',title:'Chapter President',house:'asr',lvl:10,hair:0xc8a24a});g.hx=gx;g.hz=gz;C3.cops.push(g);if(AM){AM.temps.push(g);AM.actors['Grant Ashby']=g}/* V276 in the card scenes Grant and the detective face each other, not Danny */const det=C3.cops[0];g.faceTo=det;det.faceTo=g}

// ================================================================ quest d · Accusations
function c3Brawl(){const st=curStep(),I=INT.asr,F=[];const nm=['Chase Holloway','Garrett Shaw','Colin Mercer','Drew Halsey','Jake Steele','Nolan Pryor','Wyatt Crane','Simon Locke'];
  nm.forEach((name,i)=>{const[x,z]=c2Free('asr',6+(i%4)*2.4,24+Math.floor(i/4)*3.2);const n=spawn('brothers','asr',{x:I.x0+x,z:I.z0+z,a:rnd()*TAU,temp:1,mode:'idle',name,title:'Brother',house:'asr',lvl:5+(i%3),int:'asr'});n.stepTemp=st;AM.temps.push(n);F.push(n)});
  // half of them go for each other, half for Danny (the one who 'knows something')
  F.forEach((n,i)=>{if(i<4){n.foe=1;n.aggro=1;n.tgt='P'}else{n.aggro=1;n.tgt=F[(i+1)%4+4]}bubble(n,pick(['Where\'s the money?!','You took it!','I\'ve seen your new shoes!','Liar!','Get off me!']),2.4)});st.foes_=F.slice(0,4);sfx('whistle')}
const c3BrawlOk=()=>{const st=curStep();return st&&st.foes_&&st.foes_.every(n=>n.down>0||!NP.includes(n))};
/* V462 the safe stands with its back against the wall, just left of the bedroom doorway (the dresser on the other side would hide it from the camera), its door facing into the room (it used to stand out in the middle of the floor) */
const C3SAFE=[4.1,15.42];const C3BAG=[2.8,14.7];
/* ================================================================ V279 the security camera in the ΑΣΡ upstairs bedroom, and its footage */
const C3CAM=[11.92,3.45,7.4];                  /* where the camera's wall bracket is, in the second floor's own coordinates */
const C3CCV={pos:[11.06,3.09,7.82],look:[4.3,.8,14.2],fov:50};   /* what the camera sees: the safe, the open door behind it, the bed corner */
const C3CC={on:0,tw:[],t:0,ts:'',fov0:0,flt:''};
function c3CctvProp(on){
  if(C3.cctv){C3.cctv.parent&&C3.cctv.parent.remove(C3.cctv);C3.cctv=null}
  const U=INT.asr_up;if(!on||!U)return;
  const g=new THREE.Group();g.position.set(U.x0+C3CAM[0],C3CAM[1],U.z0+C3CAM[2]);
  const W=mt(0xe4e4de,.45,.25),D=mt(0x1b1b20,.4,.4);
  c3M(bgeo(.05,.3,.3),W,.02,0,0,g);c3M(bgeo(.34,.07,.07),W,-.17,-.02,0,g);
  const head=new THREE.Group();head.position.set(-.34,-.1,0);head.rotation.order='YXZ';g.add(head);
  const cyl=new THREE.CylinderGeometry(.085,.085,.4,14).rotateX(PI/2);
  c3M(cyl,W,0,0,0,head);c3M(bgeo(.2,.02,.46),W,0,.1,.03,head);
  c3M(new THREE.CylinderGeometry(.095,.095,.03,14).rotateX(PI/2),D,0,0,.21,head);
  c3M(new THREE.CylinderGeometry(.062,.062,.02,14).rotateX(PI/2),new THREE.MeshBasicMaterial({color:0x0c1c2c}),0,0,.228,head);
  c3M(new THREE.SphereGeometry(.07,10,8),D,0,0,-.2,head);
  const led=c3M(new THREE.SphereGeometry(.014,8,6),new THREE.MeshBasicMaterial({color:0xff2a2a}),.07,.055,.215,head);
  const tx=U.x0+C3CCV.look[0]-(U.x0+C3CAM[0]-.34),tz=U.z0+C3CCV.look[2]-(U.z0+C3CAM[2]),ty=C3CCV.look[1]-(C3CAM[1]-.1);
  head.rotation.set(Math.atan2(-ty,Math.hypot(tx,tz)),Math.atan2(tx,tz),0);
  g.scale.setScalar(1.4);g.userData.noMerge=1;g.userData.led=led;U.g.add(g);C3.cctv=g}
const C3SAFEOPEN=1.9;
/* the safe: its door hangs on a hinge so the footage can swing it open; shut and full until then */
function c3SafeProp(on){if(C3.safe){C3.safe.parent&&C3.safe.parent.remove(C3.safe);C3.safe=null}c3CctvProp(0);if(!on)return;const U=INT.asr_up;if(!U)return;
  const g=new THREE.Group();g.position.set(U.x0+C3SAFE[0],0,U.z0+C3SAFE[1]);g.rotation.y=PI;
  const b=new THREE.Mesh(bgeo(.8,.9,.7),mt(0x2a2a30,.4,.6));b.position.y=.45;g.add(b);
  c3M(bgeo(.6,.72,.02),mt(0x050506,.9),0,.45,.355,g);
  const cash=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++){const m=c3M(bgeo(.19,.1,.1),mt(r%2?0xaed0a0:0xbcdcae,.8),-.2+c*.2,.2+r*.2,.4,g);m.visible=false;cash.push(m)}
  const hg=new THREE.Group();hg.position.set(-.36,.45,.46);g.add(hg);
  const d=new THREE.Mesh(bgeo(.62,.72,.04),mt(0x3a3a42,.35,.7));d.position.set(.31,0,0);hg.add(d);
  const k=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.04,12).rotateX(PI/2),mt(0xc9a046,.3,.8));k.position.set(.34,.06,.04);hg.add(k);
  c3M(bgeo(.16,.03,.03),mt(0xc9a046,.3,.8),.34,-.1,.04,hg);
  g.userData.noMerge=1;g.userData.door=hg;g.userData.cash=cash;U.g.add(g);C3.safe=g;c3CctvProp(1)}
function c3SafeDoor(k){const s=C3.safe;if(!s)return;const e=k*k*(3-2*k);s.userData.door.rotation.y=-C3SAFEOPEN*e;for(const m of s.userData.cash)if(m.userData.gone!==1)m.visible=k>.55}
/* ---- the footage overlay (HTML on top of the 3D frame) and the little animation clock the footage runs on */
function c3CctvOverlay(on){let e=$('c3cc');
  if(!e){e=document.createElement('div');e.id='c3cc';e.hidden=true;
    e.innerHTML='<div class="cc-noise"></div><div class="cc-scan"></div><div class="cc-roll"></div><div class="cc-vig"></div><i class="cc-k a"></i><i class="cc-k b"></i><i class="cc-k c"></i><i class="cc-k d"></i><div class="cc-top"><span class="cc-rec"><i></i>REC</span><span>CAM 02</span></div><div class="cc-bot"><div class="cc-ts" id="c3ccts">THU 03:11:58 AM</div><div class="cc-sub">ΑΣΡ HOUSE · 2F BEDROOM</div></div><div class="cc-mot" id="c3ccmot" hidden>● MOTION DETECTED</div><div class="cc-aud">NO AUDIO</div>';
    document.body.appendChild(e);
    const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d'),d=q.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}q.putImageData(d,0,0);e.firstChild.style.backgroundImage='url('+c.toDataURL('image/png')+')'}
  e.hidden=!on;if(on){$('c3ccmot').hidden=true}
  /* grey-green, contrasty, a touch bright: the look of an old night camera */
  R.domElement.style.filter=on?'grayscale(.88) sepia(.45) hue-rotate(72deg) saturate(.95) contrast(1.18) brightness(1.0)':''}
function c3cTw(sec,fn){if(!C3CC.on||!CINE||CINE.skipped){fn(1);return Promise.resolve()}return new Promise(res=>{C3CC.tw.push({t:0,d:Math.max(.01,sec),fn,res})})}
function c3CctvTick(dt){
  c3CopsTick(dt);
  {const st=typeof curStep==='function'?curStep():null;if(st&&st.foes_c3)for(const n of st.foes_c3)if(n.c3wiredAt&&TT>n.c3wiredAt&&!(n.down>0)){n.c3wiredAt=0;c3Wired(n)}}
  if(C3.cctv&&C3.cctv.userData.led)C3.cctv.userData.led.visible=Math.sin(TT*5)>0;
  if(!C3CC.on)return;C3CC.t+=dt;
  const s=58+Math.floor(C3CC.t),ts='THU 03:'+String(11+Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')+' AM';
  if(ts!==C3CC.ts){C3CC.ts=ts;const e=$('c3ccts');if(e)e.textContent=ts}
  const fl=CINE&&CINE.skipped;
  for(let i=C3CC.tw.length-1;i>=0;i--){const w=C3CC.tw[i];w.t+=dt;const k=fl?1:Math.min(1,w.t/w.d);try{w.fn(k)}catch(e){console.warn('c3cTw',e)}if(k>=1){C3CC.tw.splice(i,1);w.res()}}
  const b=C3CC.bag,ch=C3CC.chip;
  if(b&&ch&&C3CC.carry&&ch.g){const a=ch.g.rotation.y,ca=Math.cos(a),sa=Math.sin(a);b.position.set(ch.x-.38*ca+.05*sa,.5,ch.z+.38*sa+.05*ca);b.rotation.y=a}}
/* the raised-fist pose and the finger, applied after the walk animation every frame (see c4PupUpd) */
function c3FlipPose(g,k,left){const p=g&&g.P;if(!p)return;const a=left?p.aL:p.aR,e=left?p.eL:p.eR,h=left?p.hL:p.hR,s=left?-1:1;if(!a)return;
  /* V420 the hand is turned so its back faces the camera (it used to sit sideways) and the real fingers do the work: three curled, the middle one straight, thumb tucked */
  if(h)h.rotation.y=s*PI/2*Math.max(0,k);if(k<=0)return;
  a.rotation.set(-1.25*k,0,s*.12*k);if(e)e.rotation.set(-1.7*k,0,0);
  const F=p.fing&&p.fing[left?'L':'R'];if(F){for(let i=0;i<4;i++){const c=i===1?0:1.3*k;F.a[i].rotation.set(0,0,-s*c);F.b[i].rotation.set(0,0,-s*Math.min(1.7,c*1.25))}F.ta.rotation.set(.1+.75*k,0,-s*(.12+.42*k));F.tb.rotation.set(0,0,-s*(.12+.82*k))}}
/* only for a body without finger bones: a plain block finger on the hand */
function c3FingerAdd(n){const g=n&&n.g,p=g&&g.P;if(!p||p.fing)return;const hand=p.hR||p.aR;if(!hand)return;
  const o=p._o||{},m=new THREE.Mesh(bgeo(.04,.2,.04),mt(o.skin||0xf0c8a8,.8));m.position.set(0,-.17,.03);m.visible=false;m.userData.noMerge=1;hand.add(m);n.c3fin=m}
async function c3CctvCine(done){
  const U=INT.asr_up;if(!U){if(done)done();return}
  const W=(x,z)=>[U.x0+x,U.z0+z],cc=C3CCV,cx=U.x0+cc.pos[0],cz=U.z0+cc.pos[2];
  let pre=null,chip=null,bag=null;const fly=[];
  const door=W(6,17.6),sf=C3SAFE;
  await c6Cine(async()=>{
    await c4Wt(2.1);
    /* in through the door: Preston first, with the key */
    c4To(pre,...W(6,14.6),2.3);await c4Wt(.55);c4To(chip,...W(7.4,15),2.3);await c4Wt(1.25);c4To(pre,...W(5.1,13.8),2.1);c4To(chip,...W(3.8,13.6),2.1);await c4Wt(.8);c4To(pre,...W(sf[0],sf[1]-1.05),1.6);c4To(chip,...W(C3BAG[0]-.1,C3BAG[1]-.75),1.6);await c4Wt(1.2);
    $('c3ccmot').hidden=false;c4Look(pre,...W(sf[0],sf[1]));c4Look(chip,...W(C3BAG[0],C3BAG[1]));
    await c4Wt(.5);
    /* Preston bends to the lock; the door swings open */
    pre.pup.arms=-1.15;pre.pup.lean=-.38;pre.pup.dy=-.1;await c3cTw(.8,k=>{pre.pup.lean=-.38*k;pre.pup.dy=-.1*k});await c4Wt(.5);
    await c3cTw(1.1,c3SafeDoor);await c4Wt(.4);
    chip.pup.arms=-1.0;chip.pup.lean=-.3;chip.pup.dy=-.12;
    /* the cash goes into the duffel, bundle by bundle */
    const cash=C3.safe.userData.cash,mound=bag.userData.mound;let landed=0;const all=[];
    for(let i=0;i<cash.length;i++){
      const m=cash[i],f=new THREE.Mesh(bgeo(.19,.1,.1),m.material);f.userData.noMerge=1;
      const wp=m.getWorldPosition(new THREE.Vector3()),sx=wp.x,sy=wp.y,sz=wp.z,ex=U.x0+C3BAG[0],ez=U.z0+C3BAG[1];
      m.userData.gone=1;m.visible=false;f.position.set(sx,sy,sz);U.g.add(f);fly.push(f);
      all.push(c3cTw(.6,k=>{f.position.set(sx+(ex-sx)*k,sy+(.36-sy)*k+Math.sin(k*PI)*.55,sz+(ez-sz)*k);f.rotation.set(0,k*2.2,k*1.1);if(k>=1){f.visible=false;mound[i].visible=true;mound[i].userData.l=1}}));
      await c4Wt(.42)}
    await Promise.all(all);await c4Wt(.5);
    /* Chip zips the bag and picks it up */
    bag.userData.lid.visible=true;for(const m of mound)m.visible=false;await c4Wt(.7);
    C3CC.carry=1;chip.pup.arms=null;chip.pup.lean=0;chip.pup.dy=0;pre.pup.arms=null;pre.pup.lean=0;pre.pup.dy=0;await c4Wt(.7);
    /* Preston looks up and finds the camera */
    c4Look(pre,cx,cz);await c4Wt(.9);c4Look(chip,cx,cz);await c4Wt(.6);
    pre.pup.post=g=>c3FlipPose(g,pre.c3flip||0,false);chip.pup.post=g=>c3FlipPose(g,chip.c3flip||0,false);/* V420 his free hand: the other one is carrying the bag */
    await Promise.all([c3cTw(.35,k=>{pre.c3flip=k;if(pre.c3fin)pre.c3fin.visible=k>.5}),c4Wt(.25).then(()=>c3cTw(.35,k=>{chip.c3flip=k;if(chip.c3fin)chip.c3fin.visible=k>.5}))]);
    await c4Wt(3.6);
    /* and out, backwards, still looking into the lens */
    pre.pup.back=1;chip.pup.back=1;c4To(pre,...W(5.1,13.6),1.7);c4To(chip,...W(3.8,13.7),1.7);await c4Wt(1.6);c4To(pre,...W(6,16.4),1.7);c4To(chip,...W(6.8,17.6),1.7);await c4Wt(2.4);
    await c4Fade(async()=>{})
  },done,{fade:async()=>{
      c3SafeProp(1);const g=new THREE.Group();g.userData.noMerge=1;
      const body=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.74,14).rotateZ(PI/2),mt(0x22262e,.7));body.position.y=.18;g.add(body);
      c3M(bgeo(.5,.03,.345),mt(0xb02a2a,.7),0,.18,0,g);
      for(const s of[-.2,.2]){const h=new THREE.Mesh(new THREE.TorusGeometry(.1,.012,6,12,PI),mt(0x15151a,.8));h.position.set(s,.33,0);h.rotation.y=PI/2;g.add(h)}
      const lid=c3M(bgeo(.62,.05,.26),mt(0x22262e,.7),0,.35,0,g);lid.visible=false;g.userData.lid=lid;
      const mound=[];for(let i=0;i<9;i++){const m=c3M(bgeo(.19,.1,.1),mt(i%2?0xaed0a0:0xbcdcae,.8),-.2+(i%3)*.2,.26+Math.floor(i/3)*.07,((i*5)%3-1)*.05,g);m.visible=false;mound.push(m)}g.userData.mound=mound;
      g.position.set(U.x0+C3BAG[0],0,U.z0+C3BAG[1]);U.g.add(g);bag=g;C3CC.bag=bag;C3CC.carry=0;
      const o={tag:'c3cc',int:'asr_up',house:'kto',lvl:6,title:'Kappa Theta Omega'};
      const a=W(6,19.2),b=W(7.2,20.2);
      pre=c4Pup('legacies',a[0],a[1],PI,Object.assign({name:'KTO Brother A'},o));chip=c4Pup('legacies',b[0],b[1],PI,Object.assign({name:'KTO Brother B'},o));
      C3CC.chip=chip;c3FingerAdd(pre);c3FingerAdd(chip);
      C3CC.on=1;C3CC.t=0;C3CC.ts='';C3CC.tw=[];c3CctvOverlay(true);
      C3CC.fov0=cam.fov;cam.fov=cc.fov;cam.updateProjectionMatrix();PM.visible=false;
      c4Shot(cc.pos.map((v,i)=>i==1?v:(i==0?U.x0+v:U.z0+v)),[U.x0+cc.look[0],cc.look[1],U.z0+cc.look[2]],0)},
    after:()=>{C3CC.on=0;C3CC.tw=[];C3CC.carry=0;c3CctvOverlay(false);cam.fov=C3CC.fov0||60;cam.updateProjectionMatrix();PM.visible=true;c4Off('c3cc');
      if(bag&&bag.parent)bag.parent.remove(bag);for(const f of fly)f.parent&&f.parent.remove(f);C3CC.bag=C3CC.chip=null}})}
const c3PledgeList=()=>PCLASS.map(k=>NN[k]).filter(n=>n&&NP.includes(n)&&!n.hidden&&!n.down);
function c3RecruitLab(){const s=c3S(),n=Object.keys(s.pl).length;return`\nRecruit pledges for the hit on ΚΘΩ (${Math.min(5,n)}/5): find them around the house and campus`}
function c3RecruitGoal(){const s=c3S(),L=c3PledgeList().filter(n=>!s.pl[nid(n)]).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z));const n=L[0];if(!n)return null;if((n.int||null)===(P.inside||null))return[n.x,n.z];return n.int?c3Route({int:n.int,x:n.x,z:n.z}):(P.inside?c3Route({int:null,x:n.x,z:n.z}):[n.x,n.z])}
/* V270 recruiting works from the E prompt AND from the talk wheel, and ignores the "must be Lv {player}" follow rule: these are the quest's pledges */
function c3RecruitDo(n){const s=c3S();s.pl[nid(n)]=1;n.follow=1;n.job=null;n.mode='idle';bubble(n,pick(['About time.','I\'m in. For the house.','Let\'s ruin their whole year.','Say less.']),2.4);sfx('ok');updObj()}
function c3RecruitChoice(n){if(!AM||AM.m.id!=='c3accuse')return null;const st=curStep();if(!st||st.ok!==c3RecruitOk||c3S().pl[nid(n)]||!c3PledgeList().includes(n))return null;
  return['"We\'re hitting ΚΘΩ tonight. Come with me."',()=>{c3RecruitDo(n)},'','follow']}
function c3RecruitPrompts(add){const st=curStep();if(!st||st.ok!==c3RecruitOk)return;const s=c3S();
  for(const n of c3PledgeList()){if(s.pl[nid(n)]||(n.int||null)!==(P.inside||null))continue;add(n.x,n.z,2.2,'Recruit '+n.name.split(' ')[0]+': "We\'re hitting ΚΘΩ tonight."',()=>c3RecruitDo(n),2)}}
const c3RecruitOk=()=>Object.keys(c3S().pl).length>=5;
/* V462 a pledge recruited for the hit stays with Danny for the rest of Accusations: no 'go home' on the talk wheel, and if anything else switches his following off it is put back */
const c3Keep=n=>!!(n&&((AM&&AM.m.id==='c3accuse')||(!AM&&S.done.c3accuse&&!S.done.c3empire))&&c3S().pl&&c3S().pl[nid(n)]);
function c3KeepTick(){if(!AM||AM.m.id!=='c3accuse')return;const s=c3S();for(const k in s.pl||{}){const n=NN[k];if(n&&!n.down&&!n.follow){n.follow=1;n.job=null;n.leaveT=0;n.path=null}}}
function c3Followers(on){const s=c3S();let i=0;for(const k in s.pl){const n=NN[k];if(!n)continue;if(on){n.follow=1;n.job=null;n.hidden=0;if((n.int||null)!==(P.inside||null)||Math.hypot(n.x-P.x,n.z-P.z)>20){const[x,z]=c3Free(P.x-1.5+(i%3)*1.5,P.z-2-Math.floor(i/3)*1.4);n.x=x;n.z=z;n.path=null}n.int=P.inside||null;i++}else{n.follow=0;n.aggro=0;n.tgt=null;n.coked=0;if(n.c3nose){n.c3nose.parent&&n.c3nose.parent.remove(n.c3nose);n.c3nose=null}}}}

// ================================================================ quest e · Cocaine Empire
function c3Storm(){const st=curStep(),I=INT.kto,F=[];if(!I)return;const nm=['Chip Van Dorn','Thurston Lowell','Biff Ashcroft','Graham Pierce','Spencer Hale','Winston Cole','Tucker Grey','Brooks Merriman','Hunter Blaine','Kip Lancaster','Sterling Voss','Langston Pryce'];
  nm.forEach((name,i)=>{const[x,z]=c2Free('kto',8+(i%6)*6,22+Math.floor(i/6)*6);const n=spawn('legacies','kto',{x:I.x0+x,z:I.z0+z,a:rnd()*TAU,temp:1,mode:'idle',name,title:'ΚΘΩ Brother',house:'kto',lvl:5+(i%4),int:'kto'});n.foe=1;AM.temps.push(n);F.push(n)});   // not step temps: they're still sitting there, coked, when the cops walk in
  st.foes_c3=F;C3.foesLast=F;F.forEach(n=>{n.aggro=1;n.tgt='P'});
  // the product, everywhere: lines on the coffee tables, bricks on the dining table
  const ms=[];for(let i=0;i<10;i++){const[x,z]=c2Free('kto',6+rnd()*36,20+rnd()*14);ms.push(c3M(bgeo(.28,.09,.18),0xf8f8f4,I.x0+x,.05,I.z0+z,I.g))}C3.kto=ms;
  // the pledges are on it too
  c3Followers(1);for(const k in c3S().pl){const n=NN[k];if(!n)continue;n.coked=1;if(!n.c3nose&&n.g.P&&n.g.P.head){const d=new THREE.Mesh(GC.c3nose||(GC.c3nose=new THREE.SphereGeometry(.035,8,6)),new THREE.MeshBasicMaterial({color:0xffffff}));d.position.set(0,.06,.2);n.g.P.head.add(d);n.c3nose=d}bubble(n,pick(['I CAN HEAR COLORS!','LET\'S GOOOO!','I feel like a GOD!','My heart is SO FAST!']),2.6)}
  sfx('whistle')}
function c3FaceLab(){const s=c3S();return`\nStorm ΚΘΩ: throw coke in their faces (${s.faces}/10)`}
function c3EmpirePrompts(add){const st=curStep();if(!st||!st.foes_c3||P.inside!=='kto')return;const s=c3S();
  for(const n of st.foes_c3){if(n.c3face||!NP.includes(n))continue;add(n.x,n.z,2.3,'Throw coke in '+n.name.split(' ')[0]+'\'s face',()=>{n.c3face=1;s.faces++;const h=n.g.P&&n.g.P.head;const v=new THREE.Vector3();(h||n.g).getWorldPosition(v);c3Puff(v.x,v.y+.1,v.z,.55);
    c3Dust(n);/* V282 the same painted-on powder the rough sleepers wear, not a mask */
    n.aggro=0;n.tgt=null;if(rnd()<.55){n.down=Math.max(n.down||0,8);n.c3wiredAt=TT+8}else c3Wired(n);/* knocked out ones jitter as soon as they come round; the rest go hyper right away */
    bubble(n,pick(['MY EYES!','Is that… oh no.','*sneezes for eleven seconds*','I\'m calling my father!']),2.4);sfx('hit');dmgNum(n.x,2.6,n.z,'COKED','#ffffff');updObj()},1)}}
const c3FaceOk=()=>c3S().faces>=10;
// the floor plan of the stash: each of the three houses has a spot under its dining table (recorded for every house by dineGrab)
const C3PLANT=[['opd','ΩΨΔ',[91,32]],['kan','ΚΑΝ',[91,120]],['gwz','ΓΩΖ',[91,164]]];
function c3PlantSpot(id){const I=INT[id];if(!I)return null;const c=I.dine&&I.dine.c?I.dine.c:[38.5,27];const[x,z]=c2Free(id,c[0],c[1]+2.4);return[I.x0+x,I.z0+z]}
function c3PlantLab(){const s=c3S(),left=3-C3PLANT.filter(([k])=>s.plant[k]).length;return'\nPlant a stash in each ring house without being seen ('+(3-left)+'/3) · bags on you: '+left+'\n'+C3PLANT.map(([k,L])=>(s.plant[k]?'✓ ':'○ ')+L+' house, under the dining table').join('\n')}
function c3PlantGoal(){const s=c3S(),n=C3PLANT.find(([k])=>!s.plant[k]);if(!n)return null;const[k,,door]=n;if(P.inside===k)return c3PlantSpot(k);if(P.inside)return[INT[P.inside].x0+INT[P.inside].dX,INT[P.inside].z0+INT[P.inside].d-1.4];return door}
function c3PlantPrompts(add){const st=curStep();if(!st||st.ok!==c3PlantOk)return;const s=c3S();for(const[k,L]of C3PLANT){if(s.plant[k]||P.inside!==k)continue;const p=c3PlantSpot(k);if(!p)continue;
  add(p[0],p[1],2,'Plant the stash under the '+L+' dining table',()=>{const w=NP.find(n=>!n.down&&!n.hidden&&(n.int||null)===k&&Math.hypot(n.x-P.x,n.z-P.z)<9&&canSee(n,9));if(w){bubble(w,'Hey! What are you doing back there?',2.2);sfx('bad');trouble(15);toast('Someone saw you. Wait until nobody\'s looking.',2600);return}
    s.plant[k]=1;sfx('ok');toast('Stash planted. Now get out before anyone sits down to eat.',2600);const I=INT[k];c3M(bgeo(.3,.1,.2),0xf8f8f4,p[0],.05,p[1],I.g);updObj()},2)}}
const c3PlantOk=()=>C3PLANT.every(([k])=>c3S().plant[k]);
// the victory party in the ΑΣΡ house
function c3Party(on){const I=INT.asr;if(!I)return;if(on){if(!C3.party){const sp=[];let t=0;while(sp.length<40&&t++<3000){const x=I.x0+1+rnd()*46,z=I.z0+17+rnd()*18;if(!freeAt(x,z,.42)||sp.some(([a,b])=>Math.hypot(a-x,b-z)<.9))continue;sp.push([x,z])}
      C3.party=c1Crowd(sp,{k:'c3party',SH:[0x7d1f2c,0x7d1f2c,0xdc8aa6,0x1d2440,0xf2f2ee,0x2a2a30,0x3a6a3a],PA:[0x2a2a30,0x34486e,0x1a1a22],HA:[0x151515,0x4a3020,0xc8a24a,0x6a3a1a],fem:.45});I.g.add(C3.party.g);
      // a disco ball and glowing party lights (meshes, not real lights: adding lights would recompile every shader)
      const ball=c3M(new THREE.SphereGeometry(.45,16,12),mt(0xe8e8f0,.12,.95),I.x0+24,4.9,I.z0+26,I.g),d=[ball];for(const[x,z,c]of[[8,26,0xff3ad8],[24,30,0x3ad8ff],[40,26,0xffd83a],[16,21,0x7aff6a],[32,21,0xff6a3a]])d.push(c3M(new THREE.SphereGeometry(.16,10,8),new THREE.MeshBasicMaterial({color:c}),I.x0+x,5.6,I.z0+z,I.g));C3.disco=d}
    C3.party.g.visible=true}else{if(C3.party)C3.party.g.visible=false;if(C3.mound){C3.mound.parent&&C3.mound.parent.remove(C3.mound);C3.mound=null}}}

// ================================================================ the quests
/* V305 time skips that keep the story's days straight. Skipped days are not played, so no newDay() (it would fire the pledge-job 'yesterday' penalties), same as c2ToSat */
function c3ToFri(){const w=(S.day-1)%7;if(w===5||w===6)return;const n=(5-w+7)%7;S.day+=n;S.gt=10;try{if(S.pledged&&S.prole)prApply()}catch(e){}setTimeout(()=>big('FRIDAY',2200),300)}
function c3Morning(){if(S.gt>=6&&S.gt<12)return;if(S.gt>=12)S.day++;S.gt=9;try{if(S.pledged&&S.prole)prApply()}catch(e){}setTimeout(()=>big('THE NEXT MORNING',2200),300)}
const C3M=[
 {id:'c3house',ch:3,main:1,name:'New Lavish House',who:'grant',steps:()=>[
   C_('New Lavish House','Grant Ashby · Chapter president','"The alumni were generous. Very generous. So we\'re building a third floor: a game room, a theatre, and a basketball court, because I have always wanted to dunk on Tank indoors."\n\n"The brothers already built the stairs. You\'re building everything else."',[['"Where do I start?"',null]]),
   {t:'cond',lab:c3BuildLab,ok:()=>C3B.every(([k])=>c3S().b[k]),goal:c3BuildGoal,start:c3BuildStart},
   C_('New Lavish House','Tank Hale · Big Brother','"Walls up, floors down, lights on. Not bad for a pledge."\n\n"Truck\'s on the front lawn. Couches, the theatre seats, the arcade, two paintings that cost more than your car. Up three flights. One at a time. Scratch anything and you\'re paying for it."',[['"Up three flights. Got it."',null]]),
   {t:'cond',lab:c3CarryLab,ok:c3CarryOk,goal:c3CarryGoal,start:c3CarryStart}],
  fin:()=>{c3Truck(0);c3CarryMesh(null);c3FloorDone();toast('The third floor is open. Brothers only. And you, apparently.',4200);setTimeout(()=>{if(!S.done.c3secret)toast('Grant wants you in the throne room. Alone.',5000)},4600)}},

 {id:'c3secret',ch:3,main:1,name:'The Executive Secret',who:'grant',pre:['c3house'],steps:()=>c3SecretRedo([
   CR_('The Executive Secret','Grant Ashby · Chapter president','"Come here, Danny. Closer. What I\'m about to say doesn\'t leave this house.\n\nThe floors, the arcade, the theatre screen. You really think one gala paid for all of that? The gala paid for the walls. Something else paid for everything inside them. There\'s a ring on this campus, and Alpha Sigma Rho sits at the middle of it. Cocaine. Five houses, one supply, and I am the one who holds it together."',[['"…Cocaine?"','"Keep your voice down. Yes, Danny. Cocaine. Say it like that again and I will start wondering whether you can keep it behind your teeth."','c3react'],['"You\'re joking."','"Do I look like a man who jokes from a throne? Look at the floor you are standing on, then ask me again."','c3react']]),
   CR_('The Executive Secret','Grant Ashby · Chapter president','"Don\'t look at me like that. Half this campus is already buying it. The only question was ever who sells it, and whether they do it clean. We do. No freelancers, no stupid kids with a scale and a mouth.\n\nThe product moves through five chapters. The money comes back through me. Everybody takes a cut, and nobody has to get their own hands dirty. Mostly nobody."',[['"And I\'m in this how?"','"Straight to it. Good. That is the right question."',undefined,1],['"I should walk away."','"You could. It would be the last easy thing you ever did in this house. Sit down. Hear the rest, then decide."',undefined,-1]]),
   CR_('The Executive Secret','Grant Ashby · Chapter president','"You\'re in it because the house needs a new pair of hands, and yours are clean. Nobody has looked at you twice yet. That\'s worth more than money right now.\n\nThe people who make the ring work are on their way up. Time you met the board."',[['"Alright. I\'m ready."','"Nobody is. Stand up straight and keep your hands where they can see them."',undefined,1],['"Who are they?"','"Four men who think they run this campus. Let them think it."']]),
   {t:'cine',run:done=>c3BoardCine(done)},
   CR_('The Executive Secret','Grant Ashby · Chapter president','Four men in good coats have filed in and stand in a loose half-circle around the throne. Nobody is sitting. Nobody is touching the silver tray at Grant\'s feet, where five bricks wrapped in plastic catch the light. Everybody is looking at it anyway.\n\nGrant does not get up.\n\n"Danny. Step up where they can see you. Gentlemen, this is the pledge I told you about."',[['"Gentlemen."','"Manners. Good. They notice that kind of thing."',undefined,1],['"You told them about me?"','"I told them you were clean and quiet. Do not make a liar out of me."',undefined,-1]]),
   C_('The Executive Secret','Grant Ashby · Chapter president','"Five houses. Every man in this room could ruin me with one phone call, and every one of them needs me more than they\'d admit. Be polite. Let them talk first. Don\'t shake a hand that isn\'t offered."',[['"Got it."',null]]),
   C_('The Executive Secret','Preston Vanderhall · ΚΘΩ President','Preston Vanderhall turns a crystal glass in his fingers, one he clearly brought from home. He does not offer you one.\n\n"Preston Vanderhall. Kappa Theta Omega, fourth generation. My grandfather\'s name is on the building you walked past to get here. We don\'t sell anything, Danny. We make introductions. A trustee takes your call. A bank forgets to ask a question. Old money never carries. It just knows exactly who does."',[['"Nice to meet you, sir."',null,undefined,undefined,1],['"Your guys jumped me on our lawn."',()=>[C_('The Executive Secret','Preston Vanderhall · ΚΘΩ President','"That was rush week, Danny. Rush week is theatre. The lawn is for the pledges." He sips. "This room is for business. Try to keep the two apart."',[['"…Noted."',null]])],undefined,undefined,-1]]),
   C_('The Executive Secret','Milton Cho · ΩΨΔ President','Milton Cho is writing in a leather planner and does not look up until he has finished the sentence. When he does, his smile is perfectly polite and completely empty.\n\n"Milton Cho. Omega Psi Delta, student government. Every event permit, every noise complaint, every room reservation on this campus crosses my desk. Paperwork only exists if somebody files it. I know which Dean is free on Thursdays, and which one isn\'t."',[['"Thursdays. Noted."',null]]),
   C_('The Executive Secret','Brock Ramirez · ΚΑΝ President','Brock Ramirez crushes your hand, then pats it afterwards like he\'s sorry he broke something. He is grinning the whole time.\n\n"Brock! Kappa Alpha Nu! Bro. Every lacrosse guy, every linebacker, every Friday night in the county. Biggest crowd on campus, and nobody on my side is gonna ask where it came from. I just need it to show up. Cold. On time. Cool?"',[['"Ow. Yeah. Cool."',null]]),
   C_('The Executive Secret','Dorian Vance · ΓΩΖ President','Dorian Vance leans in the doorway, a key ring spinning on one finger. He has been watching your hands since you walked in.\n\n"Dorian Vance. Gamma Omega Zeta. I bring the wheels nobody pulls over, and a family lawyer who has never lost a case that mattered. If a bag has to move at three in the morning, it moves. If a cop gets curious, he gets a phone call. Try not to be the reason I need either."',[['"I\'ll be careful."',null]]),
   C_('The Executive Secret','Grant Ashby · Chapter president','"And Alpha Sigma Rho brings the house. Five chapters, one supply, nobody steps on anybody\'s turf. The gala paid for the walls. This pays for everything else."\n\nHe holds out a paper bag. "Five eight-balls. Downtown, by the shops, there are people who will pay cash and never ask a question. I want eighty back. Whatever you get over that is yours. Don\'t get creative."\n\n"Everybody starts at the bottom, Danny. Even me, once. Prove you can move it quietly, and you never stand on a sidewalk again."',[['Take the bag',()=>{c3S().bags=5;c3SummitOff()}],['"This is insane." (take it anyway)',()=>{c3S().bags=5;c3SummitOff();stand(-2)}]]),
   {t:'cond',lab:c3SellLab,ok:c3SellOk,goal:c3SellGoal,start:()=>c3Homeless(1),done:()=>{c3Homeless(0)}},
   /* V457 no second police stop after the sales (user: the one undercover cop is enough) */
   go(SPOT.ASR,'Bring the money back to Grant at the house',{press:1,act:'Go inside',r:3,goal:()=>{const g=NN.grant;return g&&P.inside?(g.int===P.inside?[g.x,g.z]:c3Route({int:g.int,x:g.x,z:g.z})):SPOT.ASR},start:()=>{const st=curStep();st.x=SPOT.ASR[0];st.z=SPOT.ASR[1]}}),
   C_('The Executive Secret','Grant Ashby · Chapter president','',[['"Great."',()=>money(-Math.min(S.money,80))]],{fx:()=>{const st=curStep(),e=c3S().earn||0,d=e-80;st.tx=(d>0?'He counts out eighty and waves you off the rest. "$'+d+' over. Keep it. Good salesman."':d===0?'He counts out eighty and nods. "On the nose."':'"$'+e+'? I said eighty." He holds out his hand. "You cover the gap. Lesson learned."')+'\n\n"And you got stopped by a cop. Next time, don\'t look like a pledge. Look like a customer."\n\n"Welcome to the executive board, Danny. Junior member. Unpaid."'}})]),
  retry:'Talk to Grant at the house. He\'ll hand you five fresh bags.',reset:()=>{c3Homeless(0);const q=c3S();q.bags=0;q.sold=0;q.earn=0;q.redo=1},
  fin:()=>{c3Homeless(0);c3S().bags=0;c3S().redo=0;c3S().earn=0;setTimeout(()=>{if(!S.done.c3missing)toast('Lie low for a few days. Grant will send for you: check in with him in the throne room.',5500)},2500)}},

 {id:'c3missing',ch:3,main:1,name:'Disappearance',who:'grant',pre:['c3secret'],steps:()=>[
   {t:'fx',f:()=>c3ToFri()},   /* V305 Wes went missing Thursday night: this quest happens on Friday */
   C_('Disappearance','Grant Ashby · Chapter president','"Wes didn\'t come home Thursday. Phone\'s off, bed\'s untouched. That guy has never missed a night in his life."\n\n"Start where he hides: the library, the fountain, the Union. And Danny? Wes doesn\'t go anywhere without the books. If you find them first, they come straight to me."',[['"On it."',null]]),
   {t:'cond',lab:c3ClueLab,ok:c3ClueOk,goal:c3ClueGoal,start:()=>{c3ClueProps(1);C3.wesFreed=0},done:()=>{c3ClueProps(0)}},
   /* V422 Danny takes what he found to Grant first. Grant will not send the house: that would be a war between fraternities. Danny and Tank go */
   /* V460 the note goes to Grant himself, in the throne room (it used to stop at the front door and pull Danny inside mid-card, where Grant was still hidden) */
   go(npcSpot('grant'),'Take the note to Grant. He\'s inside the ΑΣΡ house, in the throne room.',{press:1,act:'Show Grant the note',r:4.6,start:()=>{const st=curStep(),g=NN.grant;if(g&&g.int==='asr'){st.x=g.x;st.z=g.z}},done:()=>{const g=NN.grant;if(g&&g.g&&!g.hidden&&(g.int||null)===(P.inside||null))g.g.visible=true}}),
   C_('Disappearance','Grant Ashby · Chapter president','He reads the note twice. Then he turns it over, like the back might have a signature on it.\n\n"No name. No letters. \'Bring the books.\'" He folds it into his pocket. "Somebody on this campus knows exactly what my treasurer carries around."',[['"So who has him?"',null]]),
   C_('Disappearance','Reese Whitford · Brother','"Who cares who? There are fourteen of us. We walk over to that loading dock right now and we take him back."\n\nHalf the room is already standing up.',[['Continue',null]]),
   C_('Disappearance','Grant Ashby · Chapter president','"Sit. Down."\n\n"Whoever did this wears letters too. I send this whole house across campus in daylight and by tonight it\'s a war between fraternities, with every brother on the Row picking a side and the police taking pictures from the curb. That is exactly what somebody wants."\n\n"So nobody goes. Nobody but two." He points. "Danny. They asked for you alone, so they get you. And Tank, because \'alone\' is a suggestion."',[['"Just the two of us."',null],['"Two against how many?"',()=>[C_('Disappearance','Tank Hale · Big Brother','Tank is already cracking his neck. "Doesn\'t matter, little bro. I counted myself twice."',[['▸ Continue',null]])]]]),
   C_('Disappearance','Tank Hale · Big Brother','"Loading dock behind Tangeman. I know it." He grabs his keys off the hook and heads for the door. "Stay behind me until it starts. Then stay next to me."',[['"Let\'s go get Wes."',()=>{if(P.inside)goOut(SPOT.ASR[0],SPOT.ASR[1]);c3TankAlly()}]]),
   {t:'cine',run:c3WesBackCine},
   /* V460 the hooded figures are already standing guard round Wes; the fight starts when Danny gets close to him (no marker to walk onto first) */
   {t:'fight',x:c3WesB()[0],z:c3WesB()[1],c3wb:1,c3wake:1,label:'Go to the loading dock behind the Tangeman Center with Tank',foes:[['legacies',6,'Hooded Figure'],['legacies',5,'Hooded Figure'],['legacies',6,'Hooded Figure'],['legacies',5,'Hooded Figure'],['legacies',7,'Hooded Figure']],fo:C3HOODOPT,mk:n=>c3Hood(n),ally:'tank',start:()=>{c3WesSpawn();c3TankAlly()}},
   go(c3WesB(),'Untie Wes from the lawn chair',{press:1,act:'Cut the duct tape',r:2.6,c3wb:1,done:()=>{const w=c3WesSpawn();c3WesFree(w);bubble(w,'They wanted the BOOKS, Danny.',2.4)}}),
   /* V461 Wes tells it as a conversation (it was one long card) */
   {t:'cine',run:c3WesTalk},
   go(SPOT.ASR,'Walk Wes home to the ΑΣΡ house',{r:4,act:'Bring Wes home',done:()=>{const w=C3.wes;if(w&&NP.includes(w)&&Math.hypot(w.x-P.x,w.z-P.z)>9){w.x=P.x+1.2;w.z=P.z+1.2}c3CopsAtHouse(1)}}),
   C_('Disappearance','Detective Alana Ruiz · Harrowgate PD','A police cruiser is parked on the ΑΣΡ lawn, lights turning slowly. A detective in a grey coat is standing very close to Grant.\n\n"A bag of cocaine was found at a Gamma Omega Zeta party this week, Mr. Ashby. The kid who had it says he got it downtown, and the man who sold it to him got it from \'a guy in a propeller hat\'. You have a lot of those over here."'+(c3S().busted?'\n\nHer eyes find you over Grant\'s shoulder. "We\'ve met, Mr. Kowalski."':''),[['Continue',null]]),
   C_('Disappearance','Grant Ashby · Chapter president','"Detective, our pledges wear those hats so the whole campus can see them doing community service. It\'s a tradition. It builds character."\n\nHe smiles. She doesn\'t.',[['Continue',null]]),
   C_('Disappearance','Detective Alana Ruiz · Harrowgate PD','"I shut down a chapter in Ohio last spring for less than this." She hands Grant a card. "Call me when you remember something."\n\nThe cruiser leaves. Grant waits until it turns the corner, then looks at Wes, then at you.\n\n"Inside. Now."',[['Go inside',()=>{c3CopsAtHouse(0);if(C3.wes&&NP.includes(C3.wes))despawn(C3.wes);C3.wes=null;if(P.inside!=='asr')goIn('asr')}]])],
  fin:()=>{c3ClueProps(0);c3CopsAtHouse(0);c3WesChair(0);c3KtoCalm();c1Next('c3accuse',900)}},

 {id:'c3accuse',ch:3,main:1,name:'Accusations',who:'grant',pre:['c3missing'],steps:()=>[
   /* V422 Accusations picks up in the same room, straight after the detective leaves: nobody knows who took Wes, then the money turns up missing too */
   C_('Accusations','Grant Ashby · Chapter president','The front door shuts on the cruiser\'s lights. Grant doesn\'t sit down.\n\n"My treasurer gets taken off the street on Thursday. On Friday there is a detective on my lawn. That is not two problems. That is one problem." He looks at Wes. "Who was under the hoods?"',[['Continue',null]]),
   C_('Accusations','Wes Morrow · ΑΣΡ Treasurer','"I never saw a face. I told Danny. One of them did the talking, the rest just stood there." He swallows. "But it gets worse. I checked the safe the second I got upstairs."',[['Continue',null]]),
   C_('Accusations','Owen Park · Big Brother','Owen has a torn ledger page balled in his fist.\n\n"Four thousand dollars. That\'s what\'s missing from the ring fund. Wes counted it twice. And nobody broke that lock." He looks around the room. "Somebody used a key."',[['Continue',null]]),
   C_('Accusations','Brett Calloway · Brother','"Funny how YOU got a new truck last week, Tank."',[['Continue',null]]),
   C_('Accusations','Tank Hale · Big Brother','"It was a gift, Brett. Back off. You want to talk about money? Funny how Reese pulled up in a brand-new Range Rover on Monday."',[['Continue',null]]),
   C_('Accusations','Reese Whitford · Brother','"Don\'t look at me, Tank. My dad paid for the Range Rover. My dad paid for this FLOOR. If anyone\'s stealing, it\'s the pledge." Everyone looks at you.',[['"I gave Grant what I owed him. Ask him."',()=>[C_('Accusations','Grant Ashby · Chapter president','"He did. I counted it myself. Sit down, Reese."',[['▸ Continue',null]])]],['"Wow. Okay."',()=>[C_('Accusations','Tank Hale · Big Brother','"Leave the kid alone, Reese. He has done more for this house this week than your dad\'s check."',[['▸ Continue',null]])]]]),
   C_('Accusations','','Somebody throws the first punch. Nobody remembers who. Then the whole living room is swinging.',[['Break it up',null]]),
   {t:'cond',lab:()=>'\nBreak up the brawl: put down the four brothers swinging at you',ok:c3BrawlOk,start:()=>{if(P.inside!=='asr')goIn('asr');c3Brawl()},goal:()=>{const st=curStep(),n=st&&st.foes_&&st.foes_.find(n=>!(n.down>0));return n?[n.x,n.z]:null}},
   C_('Accusations','Wes Morrow · ΑΣΡ Treasurer','Wes is standing in the doorway with a laptop. "Can everybody stop hitting each other? The safe upstairs has a camera. Nobody ever checks the camera."',[['"Show me."',()=>c3SafeProp(1)]]),
   go([0,0],'Check the safe and the security camera in the upstairs bedroom',{press:1,act:'Check the camera footage',r:2.2,goal:()=>{const U=INT.asr_up;return P.inside==='asr_up'?[U.x0+C3SAFE[0],U.z0+C3SAFE[1]-1.1]:c3Route({int:'asr_up',x:U.x0+C3SAFE[0],z:U.z0+C3SAFE[1]-1.1})},start:()=>{const st=curStep(),U=INT.asr_up;st.x=U.x0+C3SAFE[0];st.z=U.z0+C3SAFE[1]-1.1}}),
   {t:'cine',run:c3CctvCine},
   C_('Accusations','','On the laptop, timestamped 3:12 AM Thursday: two guys in navy blazers walk into the bedroom with a key, open the safe, and fill a gym bag. One of them looks straight into the camera and gives it the finger.\n\nThe ring on his finger has three Greek letters on it. ΚΘΩ.',[['"Kappa Theta Omega."',null]]),
   C_('Accusations','Wes Morrow · ΑΣΡ Treasurer','Wes has gone white. He leans in until his nose is almost on the screen.\n\n"That ring. Pause it. That RING." He points with a hand that still has tape glue on the wrist. "The one under the hood who did all the talking. He kept tapping it on the arm of my chair. All night. Tap, tap, tap."\n\n"It was them. The money and me. The same guys."',[['"Preston."',null]]),
   C_('Accusations','Grant Ashby · Chapter president','"Kappa Theta Omega. They robbed my safe, they taped my treasurer to a lawn chair, and the same week there\'s a detective on my lawn asking about hats." He cracks his knuckles. "They wanted the books so they could hand us to the police and keep the Row for themselves. Fine. Now I know whose house to burn down."\n\n"I told you this morning: fourteen brothers on their lawn is a war. So the brothers will be nowhere near that house. The pledges will."\n\n"Get the pledge class together. Five of them. Tonight you storm ΚΘΩ."',[['"Five pledges. Tonight."',()=>c3SafeProp(0)]]),
   {t:'cond',lab:c3RecruitLab,ok:c3RecruitOk,goal:c3RecruitGoal},
   /* V463 the bags come out of a real stash: a footlocker beside Grant's throne, lid up, full of baggies */
   go([0,0],'Grab ten bags from Grant\'s stash: the footlocker beside the throne',{press:1,act:'Grab 10 bags',r:1.9,start:()=>{const st=curStep(),[x,z]=c3StashP();st.x=x;st.z=z+.9;c3Stash(1)},done:()=>{c3S().kbags=10;c3StashTake();toast('You stuff ten bags into your jacket.',3000)}})],
  fin:()=>{toast('Your pledges and ten bags are with you. Take them to the ΚΘΩ house.',4200)}},

 {id:'c3empire',ch:3,main:1,name:'Cocaine Empire',at:[60.5,30.5],pre:['c3accuse'],steps:()=>[
   {t:'fx',f:()=>{c3Followers(1)}},
   {t:'cine',run:c3WindowCine},
   C_('Cocaine Empire','','The six of you stand on the ΚΘΩ lawn. Through the windows you can see the party: navy blazers, a DJ, and on every flat surface, white powder.\n\nOne of your pledges finds a bag on the porch, does something to it with a car key, and passes it around. You don\'t take any. Everybody else does.',[['Kick the door in',()=>{goIn('kto')}]]),
   {t:'cond',lab:c3FaceLab,ok:c3FaceOk,start:()=>{if(P.inside!=='kto')goIn('kto');c3Storm()},goal:()=>{const st=curStep(),n=st&&st.foes_c3&&st.foes_c3.filter(n=>!n.c3face&&NP.includes(n)).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z))[0];return n?[n.x,n.z]:null}},
   {t:'cine',run:c3CopsCine},
   C_('Cocaine Empire','','Sirens. Somebody on the Row called it in. Then the front door opens and there is a lot of shouting about hands.\n\nTen ΚΘΩ brothers are sitting on their own floor with white faces, sneezing. The pledges are gone out the back. You are somehow standing behind a pillar.',[['Stay behind the pillar',null]]),
   C_('Cocaine Empire','Detective Alana Ruiz · Harrowgate PD','She walks the room slowly, the way Grant walked the ballroom. She stops at Preston Vanderhall, who is sobbing into a throw pillow with his face dusted white.\n\n"Kappa Theta Omega. Possession with intent, on your own floor, in front of a detective." She almost smiles. "This chapter is closed."',[['Slip out the back',()=>{c3Shut('kto');c3Followers(0);for(const m of C3.kto||[])m.parent&&m.parent.remove(m);C3.kto=[];goOut(60.5,33);toast('ΚΘΩ has been shut down by the Harrowgate PD.',4200)}]])],
  fin:()=>{c3Followers(0);c3S().pl={};c3S().kbags=0;for(const n of C3.foesLast||[]){C4.pups=C4.pups.filter(q=>q!==n);if(NP.includes(n))despawn(n)}C3.foesLast=null;setTimeout(()=>{if(!S.done.c3frame)toast('By morning the whole campus will have seen the news. Go see Grant in the throne room.',5500)},3000)}},

 {id:'c3frame',ch:3,main:1,name:'Framing',who:'grant',pre:['c3empire'],steps:()=>[
   {t:'fx',f:()=>c3Morning()},   /* V305 Grant reads about the raid in the morning paper */
   CR_('Framing','Grant Ashby · Chapter president','He has the Herald open on his lap. KTO SHUT DOWN IN COCAINE RAID. He looks happier than you have ever seen him.\n\n"One down. Three houses still know everything we know. ΩΨΔ, ΚΑΝ, ΓΩΖ." He slides three small packages across the arm of the throne. "Under the dining table, in each house. Then one anonymous phone call, and Alpha Sigma Rho is the only house left that knows anything."',[['Take the packages',null,undefined,1],['"These are our partners."','"Partners get greedy. Partners get curious. Kappa Theta Omega already stabbed us in the back, Danny."\n\nHe doesn\'t raise his voice, which is worse. "We can\'t take a second chance. Under the table. Three houses, tonight."',undefined,-1]]),
   /* V464 the three bags go from Grant's hand into Danny's: a short scene, and a count in the objective */
   {t:'cine',run:c3FrameBags},
   {t:'cond',lab:c3PlantLab,ok:c3PlantOk,goal:c3PlantGoal,trs:1},
   /* V401 the call, the raids and the front page are a scene now (c3FrameCine) */{t:'cine',run:c3FrameCine},
   go(SPOT.ASR,'Go home. ΑΣΡ is throwing a party tonight',{r:3,act:'Go to the party',done:()=>{c3Party(1);if(P.inside!=='asr')goIn('asr')}}),
   /* V464 the victory party is a scene: powdered faces, a mound of it in the middle of the living room, snow angels, powder thrown up and raining down */
   {t:'cine',run:c3CokeParty},
   C_('Framing','Grant Ashby · Chapter president','Grant climbs onto the coffee table, white to the eyebrows, and raises a glass. "To the last house standing!"\n\nFourteen brothers and a pledge class roar back. You raise your glass too. It\'s water. Nobody notices.',[['"To the last house standing."',()=>{stand(10);gainXP(40)}]])],
  fin:()=>{setTimeout(()=>c3Party(0),20000)}}];
M.push(...C3M);

// ================================================================ hooks: prompts, tick, saves
function c3Prompts(add){if(!AM)return;const id=AM.m.id;if(id==='c3accuse')c3KeepTick();if(id==='c3house')c3HousePrompts(add);else if(id==='c3secret')c3SecretPrompts(add);else if(id==='c3missing'){c3CluePrompts(add);c3WesTick()/* V422 ΚΘΩ is not hostile here any more: nobody knows it was them yet */}else if(id==='c3accuse')c3RecruitPrompts(add);else if(id==='c3empire')c3EmpirePrompts(add);else if(id==='c3frame')c3PlantPrompts(add)}
let C3T=0;
// V200 a gold marker over every set-up job still to do (and every furniture drop spot while carrying), on the third floor
function c3JobMarks(){const st=AM&&AM.m.id==='c3house'&&curStep(),s=c3S(),I=INT.asr_top,L=[];
  if(st&&P.inside==='asr_top'&&I){if(st.ok&&st.lab===c3BuildLab){for(const[k,l,x,z]of C3B)if(!s.b[k])L.push([I.x0+x,I.z0+z])}else if(s.carry){const f=C3F.find(f=>f[0]===s.carry);if(f)L.push([I.x0+f[3],I.z0+f[4]])}}
  /* V231 yellow marker on the truck ramp while there is another load to grab */
  if(st&&st.t==='cond'&&st.ok===c3CarryOk&&!s.carry&&!P.inside&&C3.truck&&C3F.some(([k])=>!s.f[k]))L.push([C3TRUCK[0],C3TRUCK[1]-4.6,1]);
  if(!C3.jm){C3.jm=[];const bg=new THREE.CylinderGeometry(.42,.42,5,14,1,true),cg=new THREE.ConeGeometry(.34,.62,4),rg=new THREE.RingGeometry(.55,.75,28);
    for(let i=0;i<5;i++){const g=new THREE.Group();const b=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:0xffd060,transparent:true,opacity:.16,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));b.position.y=2.5;g.add(b);
      const c=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({color:0xffd060}));c.rotation.x=PI;c.position.y=2.6;g.add(c);const r=new THREE.Mesh(rg,new THREE.MeshBasicMaterial({color:0xffd060,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-PI/2;r.position.y=.06;g.add(r);
      g.userData.noMerge=1;g.userData.c=c;g.visible=false;sc.add(g);C3.jm.push(g)}}
  const talk=mode!=='play'||!!CINE;C3.jm.forEach((g,i)=>{const p=L[i];g.visible=!!p&&!talk;if(p){g.position.set(p[0],p[2]?terrH(p[0],p[1]):0,p[1]);g.userData.c.position.y=2.6+Math.sin(TT*3+i)*.18;g.userData.c.rotation.y=TT*2}})}
function c3Tick(dt){try{c3CctvTick(dt)}catch(e){console.warn('c3CctvTick',e)}if(mode!=='play'&&mode!=='card'&&mode!=='wheel')return;try{c3JobMarks()}catch(e){}if(C3.party&&C3.party.g.visible)c1CrowdUpd(C3.party,TT);for(const m of C3.clueM||[])if(m.userData.spin){m.rotation.y+=dt*2;m.position.y+=Math.sin(TT*3)*.002}
  if(C3.disco&&C3.party&&C3.party.g.visible){C3.disco[0].rotation.y+=dt*1.5;C3.disco.forEach((m,i)=>{if(i)m.scale.setScalar(.8+.4*Math.abs(Math.sin(TT*5+i*1.7)))})}
  if((C3T-=dt)>0)return;C3T=2;if(S.c3&&S.c3.shut)for(const id in S.c3.shut)c3HideHouse(id);if(S.ch>=3)c3StairsOn();try{asrxSync()}catch(e){console.warn('asrxSync',e)}
  // coked-up pledges move fast and talk faster
  for(const k in (S.c3&&S.c3.pl)||{}){const n=NN[k];if(n&&n.coked&&rnd()<.25)bubble(n,pick(['WHO WANTS SOME?!','I could run a marathon!','Is it hot in here?!','I LOVE YOU GUYS!']),1.8)}}
// loading a save / jumping in from chapter select: rebuild what the story would have built by now
function c3Migrate(d){if(!d)return;if(S.ch>=4)for(const id of C3IDS)S.done[id]=1;const s=c3S();
  if(S.done.c3house||S.ch>=4){for(const[k]of C3B)s.b[k]=1;for(const[k]of C3F)s.f[k]=1;s.carry=null}
  if(S.done.c3empire||S.ch>=4)s.shut.kto=1;if(S.done.c3frame||S.ch>=4)for(const id of['opd','kan','gwz'])s.shut[id]=1;
  if(!AM||AM.m.id!=='c3house')s.carry=null;
  // jumping straight to the storm: the five pledges you would have recruited
  if(S.done.c3accuse&&!S.done.c3empire&&Object.keys(s.pl).length<5){for(const k of PCLASS){if(Object.keys(s.pl).length>=5)break;const n=NN[k];if(n&&!n.hidden)s.pl[k]=1}}
  setTimeout(()=>{try{c3ApplyFloor();for(const id in s.shut)if(s.shut[id]){c3ShutVis(id);c3HideHouse(id)}}catch(e){console.warn('c3Migrate',e)}},0)}

/* V460 tape that is part of the body: a band of rows (bind-pose heights ys) shrink-wrapped round the character's own skinned mesh (the 2D convex hull of
   the body at each height, so a band round the chest takes the arms in with it), lifted a few mm off the skin and skinned to the same skeleton,
   bone by bone, so it moves with him in any pose. ok(bone) picks which parts of the body the band goes round. Returns a SkinnedMesh or null */
function c3Wrap(n,ys,ok,lift,mat){try{const m=n.g&&n.g.P&&n.g.P.torso;if(!m||!m.isSkinnedMesh||!m.skeleton)return null;const K=44;
  /* the body's cross-section at each height: every triangle edge of every skinned layer on this skeleton (skin, clothes) that crosses the height */
  const MS=[];n.g.traverse(o=>{if(o.isSkinnedMesh&&o.skeleton===m.skeleton&&o.geometry.attributes.skinIndex)MS.push(o.geometry)});const bone=(G,i)=>{const W=G.attributes.skinWeight.array,I=G.attributes.skinIndex.array;let bb=-1,bw=-1;for(let j=0;j<4;j++)if(W[i*4+j]>bw){bw=W[i*4+j];bb=I[i*4+j]}return bb};
  const rows=[];for(const yr of ys){const pts=[];for(const G of MS){const Q=G.attributes.position,X=Q.array,ix=G.index?G.index.array:null,T=ix?ix.length:Q.count;for(let t=0;t<T;t+=3){for(let e=0;e<3;e++){const a=ix?ix[t+e]:t+e,b=ix?ix[t+(e+1)%3]:t+(e+1)%3,ya=X[a*3+1]-yr,yb=X[b*3+1]-yr;if(ya*yb>0||ya===yb)continue;const u=ya/(ya-yb),k=u<.5?a:b,bb=bone(G,k);if(!ok(bb))continue;pts.push([X[a*3]+(X[b*3]-X[a*3])*u,X[a*3+2]+(X[b*3+2]-X[a*3+2])*u,bb])}}}
    if(pts.length<8)return null;pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
    for(const p of pts){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}for(let k=pts.length-1;k>=0;k--){const p=pts[k];while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
    const H=lo.slice(0,-1).concat(up.slice(0,-1));let cx=0,cz=0;for(const h of H){cx+=h[0];cz+=h[1]}cx/=H.length;cz/=H.length;const R=[];
    for(let k=0;k<K;k++){const a=k/K*TAU,dx=Math.sin(a),dz=Math.cos(a);let best=null;for(let e=0;e<H.length;e++){const p=H[e],q=H[(e+1)%H.length],ex=q[0]-p[0],ez=q[1]-p[1],den=dx*ez-dz*ex;if(Math.abs(den)<1e-9)continue;const t=((p[0]-cx)*ez-(p[1]-cz)*ex)/den,u=((p[0]-cx)*dz-(p[1]-cz)*dx)/den;if(t>0&&u>=-1e-6&&u<=1+1e-6&&(!best||t<best[0]))best=[t,u<.5?p[2]:q[2]]}
      if(!best)return null;R.push([cx+dx*(best[0]+lift),yr,cz+dz*(best[0]+lift),best[1]])}rows.push(R)}
  const pos=[],si=[],sw=[],idx=[];for(const R of rows)for(const r of R){pos.push(r[0],r[1],r[2]);si.push(r[3],0,0,0);sw.push(1,0,0,0)}
  for(let a=0;a<rows.length-1;a++)for(let k=0;k<K;k++){const i0=a*K+k,i1=a*K+(k+1)%K,j0=i0+K,j1=i1+K;idx.push(i0,j0,i1,i1,j0,j1)}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(si,4));G.setAttribute('skinWeight',new THREE.Float32BufferAttribute(sw,4));G.setIndex(idx);G.computeVertexNormals();
  const sm=new THREE.SkinnedMesh(G,mat);sm.position.copy(m.position);sm.quaternion.copy(m.quaternion);sm.scale.copy(m.scale);m.parent.add(sm);sm.bind(m.skeleton,m.bindMatrix);sm.frustumCulled=false;sm.castShadow=false;sm.userData.noMerge=1;return sm}catch(e){console.warn('c3Wrap',e);return null}}
function c3MaskGeo(n){try{const m=n.g.P.torso;if(!m||!m.isSkinnedMesh||!m.skeleton)return null;const sk=m.skeleton,hb=sk.bones.indexOf(n.g.P.head);if(hb<0)return null;
  const g=m.geometry,A=g.attributes,SI=A.skinIndex.array,SW=A.skinWeight.array,Pp=A.position,N=A.normal,ws=A.skinWeight.normalized?1/255:1,ns=N.normalized?(N.array instanceof Int8Array?1/127:1/32767):1;
  const M=new THREE.Matrix4().multiplyMatrices(sk.boneInverses[hb],m.bindMatrix),NM=new THREE.Matrix3().getNormalMatrix(M),cnt=Pp.count,ok=new Uint8Array(cnt),L=new Float32Array(cnt*3),LN=new Float32Array(cnt*3),v=new THREE.Vector3(),nv=new THREE.Vector3();
  for(let i=0;i<cnt;i++){let w=0;for(let j=0;j<4;j++)if(SI[i*4+j]===hb)w+=SW[i*4+j]*ws;if(w<.5)continue;v.fromBufferAttribute(Pp,i).applyMatrix4(M);nv.set(N.array[i*N.itemSize]*ns,N.array[i*N.itemSize+1]*ns,N.array[i*N.itemSize+2]*ns).applyMatrix3(NM).normalize();
    const front=v.z>-.03;if(front?(v.y<-.095||v.y>.115):(v.y<.03||v.y>.1))continue;ok[i]=1;L[i*3]=v.x+nv.x*.007;L[i*3+1]=v.y+nv.y*.007;L[i*3+2]=v.z+nv.z*.007;LN[i*3]=nv.x;LN[i*3+1]=nv.y;LN[i*3+2]=nv.z}
  const I=g.index?g.index.array:null,T=I?I.length:cnt,pos=[],nor=[];for(let t=0;t<T;t+=3){const a=I?I[t]:t,b=I?I[t+1]:t+1,c=I?I[t+2]:t+2;if(!ok[a]||!ok[b]||!ok[c])continue;for(const k of[a,b,c]){pos.push(L[k*3],L[k*3+1],L[k*3+2]);nor.push(LN[k*3],LN[k*3+1],LN[k*3+2])}}
  if(pos.length<90)return null;const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return G}catch(e){console.warn('c3MaskGeo',e);return null}}
