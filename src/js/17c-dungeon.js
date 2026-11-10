// ================================================================ V135 the ASR "dungeon": the basement under the Alpha Sigma Rho house
// A heavy locked door at the west end of the ground-floor hall opens (once you're a pledge) onto a stair down to one huge concrete basement:
// the fight club floor with four boxing rings under hanging lights, a bar and benches; the haze room (a smaller room of dirty, spray-painted
// concrete); and a row of solitary confinement cells. It is its own interior ('asr_bsmt', 120 x 90 m since V137).
const DUNG={id:'asr_bsmt',W:120,D:90,sx:9,sz:85};   // V137: 1.5x bigger, placed in its own slot east of the other interiors
// spray-painted concrete for the haze room walls, and grimy concrete everywhere else
function dungTex(kind){const k='dng'+kind;if(HTEX[k])return HTEX[k];return HTEX[k]=ctex(512,256,(q,W,H)=>{
  q.fillStyle=kind==='haze'?'#7d7a74':'#8a8780';q.fillRect(0,0,W,H);for(let i=0;i<2600;i++){const v=110+rnd()*60|0;q.fillStyle=`rgba(${v},${v-2},${v-6},.22)`;q.fillRect(rnd()*W,rnd()*H,1+rnd()*3,1+rnd()*3)}
  q.fillStyle='rgba(60,55,48,.18)';for(let x=0;x<W;x+=128)q.fillRect(x,0,2,H);for(let y=0;y<H;y+=64)q.fillRect(0,y,W,2);                       // block joints
  for(let i=0;i<6;i++){const x=rnd()*W,g=q.createLinearGradient(x,H*.3,x,H);g.addColorStop(0,'rgba(50,40,30,0)');g.addColorStop(1,'rgba(50,40,30,.35)');q.fillStyle=g;q.fillRect(x,H*.3,8+rnd()*30,H)}   // water stains
  if(kind!=='haze')return;
  const tags=['ΑΣΡ','PLEDGE','NO MERCY','HELL WEEK','DROP?','DON\'T QUIT','SIX A.M.','ΑΣΡ ΑΣΡ','BROTHERHOOD','WE ALL DID IT'];
  for(let i=0;i<9;i++){q.save();q.translate(30+rnd()*(W-60),40+rnd()*(H-60));q.rotate((rnd()-.5)*.5);const c=pick(['#c8202e','#f2f2f2','#1d1d22','#e2b64c','#2f8f4a','#3a6ad8']);
    q.font=`bold ${22+rnd()*26|0}px Impact,"Arial Black",sans-serif`;q.fillStyle=c;q.shadowColor=c;q.shadowBlur=6;q.fillText(pick(tags),0,0);q.shadowBlur=0;
    q.globalAlpha=.7;for(let d=0;d<4;d++)q.fillRect(rnd()*80,4+rnd()*4,2,10+rnd()*22);q.restore()}
  q.strokeStyle='rgba(200,30,40,.8)';q.lineWidth=4;for(let i=0;i<3;i++){q.beginPath();const x=rnd()*W,y=rnd()*H;q.moveTo(x,y);for(let k=0;k<5;k++)q.lineTo(x+rnd()*120-60,y+rnd()*60-30);q.stroke()}})}
function dungFloor(){const k='dngF';if(HTEX[k])return HTEX[k];const t=ctex(256,256,(q,W,H)=>{q.fillStyle='#4f4c47';q.fillRect(0,0,W,H);for(let i=0;i<3000;i++){const v=60+rnd()*50|0;q.fillStyle=`rgba(${v},${v},${v-4},.25)`;q.fillRect(rnd()*W,rnd()*H,2,2)}
  for(let i=0;i<10;i++){const x=rnd()*W,y=rnd()*H,r=10+rnd()*30,g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(30,25,20,.35)');g.addColorStop(1,'rgba(30,25,20,0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}
  q.strokeStyle='rgba(40,38,34,.45)';q.lineWidth=1;for(let i=0;i<5;i++){q.beginPath();let x=rnd()*W,y=rnd()*H;q.moveTo(x,y);for(let k=0;k<6;k++){x+=rnd()*30-15;y+=rnd()*30-15;q.lineTo(x,y)}q.stroke()}
  q.fillStyle='rgba(40,38,34,.5)';q.fillRect(0,0,W,2);q.fillRect(0,0,2,H)});return HTEX[k]=SM({map:t,roughness:.95})}
function asrDungeon(){const{W,D}=DUNG,I=mkInt(DUNG.id,W,D,{at:[360,OD+640],up:1,name:'Alpha Sigma Rho House · The Dungeon',floor:'tile',wall:0x8a8780,low:0x55524c,wm:SM({map:dungTex('wall'),roughness:.95}),lm:mt(0x4a4742,.95),ceil:0x3e3c38,
    walls:[[10,0,10,4],[10,6.6,10,10],[0,10,10,10],[84,0,84,20],[84,22.2,84,42],[84,42,120,42],[84,48,84,90],[84,48,87,48],[91.5,48,120,48]]});
  const X=x=>I.x0+x,Z=z=>I.z0+z,IRON=mt(0x2a2c30,.5,.5),RED=mt(0x9a1f24,.7),CAN=mt(0xd8d2c4,.9),GLOW=bm(0xfff0c8);
  // concrete floor over the default one, a low ceiling look with exposed beams and pipes
  {const m=flat(X(0),Z(0),X(W),Z(D),.03,dungFloor(),4);m.receiveShadow=true}
  for(let z=6;z<D;z+=12)box(X(W/2),5.6,Z(z),W,.4,.3,mt(0x5a5650,.9),0);
  for(const x of[9,45,78])box(X(x),5.2,Z(D/2),.25,.25,D,mt(0x6a5040,.5,.4),0);
  // ---- the fight club floor: four rings under hanging lights
  // V136 the fight pits: run-down octagonal cages of rusty chain-link on bent posts, bolted to a scuffed plywood floor with stained mats;
  // a gap in one side is the way in, there's tape, old tyres and a bare bulb in a cage lamp over each one, and a pool of light under it
  const CHL=GC.dCh||(GC.dCh=new THREE.MeshLambertMaterial({map:(()=>{const t=ctex(64,64,q=>{q.clearRect(0,0,64,64);q.strokeStyle='#6a5e50';q.lineWidth=2.2;for(let k=-64;k<128;k+=11){q.beginPath();q.moveTo(k,0);q.lineTo(k+64,64);q.stroke();q.beginPath();q.moveTo(k+64,0);q.lineTo(k,64);q.stroke()}
      q.fillStyle='rgba(120,70,30,.6)';for(let i=0;i<14;i++)q.fillRect(rnd()*64,rnd()*64,3,3)});return t})(),transparent:true,alphaTest:.35,side:THREE.DoubleSide}));
  const RUST=mt(0x5a3a26,.85,.35),PLY=SM({map:ctex(128,128,q=>{q.fillStyle='#6a5236';q.fillRect(0,0,128,128);for(let i=0;i<40;i++){q.strokeStyle=`rgba(40,28,18,${.2+rnd()*.3})`;q.beginPath();q.moveTo(0,rnd()*128);q.lineTo(128,rnd()*128);q.stroke()}
      for(let i=0;i<10;i++){const x=rnd()*128,y=rnd()*128,r=6+rnd()*16,g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rnd()<.4?'rgba(90,20,15,.55)':'rgba(20,15,10,.5)');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}
      q.fillStyle='rgba(30,22,14,.6)';q.fillRect(0,62,128,3);q.fillRect(62,0,3,128)}),roughness:.95});
  const GLW=GC.dGl||(GC.dGl=(()=>{const t=ctex(64,64,(q,w,h)=>{const g=q.createRadialGradient(32,32,2,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.5,'#888');g.addColorStop(1,'#000');q.fillStyle=g;q.fillRect(0,0,w,h)});
      return new THREE.MeshBasicMaterial({color:0x8a6a3a,alphaMap:t,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})})());
  const ring=(cx,cz)=>{const R=6.6,h=.18,n=8,H=3.2;
    // plywood deck on pallets, a couple of torn mats, duct tape
    {const sh=new THREE.Shape();for(let k=0;k<n;k++){const a=(k+.5)/n*TAU;k?sh.lineTo(Math.cos(a)*R,Math.sin(a)*R):sh.moveTo(Math.cos(a)*R,Math.sin(a)*R)}const g=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:false});g.rotateX(-PI/2);
      const m=new THREE.Mesh(g,[PLY,mt(0x3a2a1a,.95)]);m.position.set(X(cx),0,Z(cz));m.receiveShadow=true;sc.add(m)}
    for(let k=0;k<3;k++){const mt_=new THREE.Mesh(new THREE.PlaneGeometry(2.5+rnd()*1.5,1.6+rnd()),mt(pick([0x3a4a3a,0x4a3030,0x2a3040]),.95));mt_.rotation.set(-PI/2,0,rnd()*PI);mt_.position.set(X(cx+(rnd()-.5)*5),h+.02,Z(cz+(rnd()-.5)*5));sc.add(mt_)}
    for(let k=0;k<5;k++){const t=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.06),mt(0x9a9a92,.6));t.rotation.set(-PI/2,0,rnd()*PI);t.position.set(X(cx+(rnd()-.5)*8),h+.025,Z(cz+(rnd()-.5)*8));sc.add(t)}
    // posts (some leaning), chain-link panels with a sagging top rail, the open gate side
    const gate=Math.floor(rnd()*n);for(let k=0;k<n;k++){const a0=k/n*TAU-PI/n,a1=(k+1)/n*TAU-PI/n,x0=Math.cos(a0)*R,z0=Math.sin(a0)*R,x1=Math.cos(a1)*R,z1=Math.sin(a1)*R;
      const lean=(rnd()-.5)*.12;{const p=new THREE.Mesh(GC.dPo||(GC.dPo=new THREE.CylinderGeometry(.06,.07,H+.2,6)),RUST);p.position.set(X(cx+x0),h+H/2,Z(cz+z0));p.rotation.set(lean,0,lean*.7);p.castShadow=true;sc.add(p)}
      if(k===gate)continue;const L=Math.hypot(x1-x0,z1-z0),mx=(x0+x1)/2,mz=(z0+z1)/2,ry=Math.atan2(-(z1-z0),x1-x0),sag=.05+rnd()*.25;
      const pg=new THREE.PlaneGeometry(L,H-sag),uv=pg.attributes.uv;for(let q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q)*L/.5,uv.getY(q)*(H-sag)/.5);
      const pn=new THREE.Mesh(pg,CHL);pn.position.set(X(cx+mx),h+(H-sag)/2,Z(cz+mz));pn.rotation.set(0,ry,(rnd()-.5)*.04);sc.add(pn);
      const tr=box(X(cx+mx),h+H-sag,Z(cz+mz),L,.05,.05,RUST,0);tr.rotation.y=ry;
      if(rnd()<.35){const pd=box(X(cx+mx*.98),h+1.2,Z(cz+mz*.98),L*.5,.6,.08,mt(pick([0x2a2a3a,0x5a1a1a]),.9),0);pd.rotation.set(0,ry,(rnd()-.5)*.3)}   // a padding scrap zip-tied on
      for(let t=.4;t<L;t+=.9)markC(X(cx+x0+(x1-x0)*t/L),Z(cz+z0+(z1-z0)*t/L),.18,H)}
    // the cage lamp: a bare bulb in a wire guard on a chain, a dim pool of light under it
    box(X(cx),4.7,Z(cz),.03,1.8,.03,IRON,0);const bl=new THREE.Mesh(GC.dbl||(GC.dbl=new THREE.SphereGeometry(.18,10,8)),bm(0xffd690));bl.position.set(X(cx),3.6,Z(cz));sc.add(bl);
    {const cg=new THREE.Mesh(GC.dcg||(GC.dcg=new THREE.CylinderGeometry(.26,.26,.4,8,1,true)),new THREE.MeshBasicMaterial({color:0x222222,wireframe:true}));cg.position.set(X(cx),3.6,Z(cz));sc.add(cg)}
    {const gl=new THREE.Mesh(new THREE.PlaneGeometry(19,19),GLW);gl.rotation.x=-PI/2;gl.position.set(X(cx),h+.04,Z(cz));gl.renderOrder=2;sc.add(gl)}
    // old tyres and a cinder-block seat outside
    for(let k=0;k<2;k++){const a=rnd()*TAU,t=new THREE.Mesh(GC.dTy||(GC.dTy=new THREE.TorusGeometry(.38,.14,8,14)),mt(0x161616,.9));t.rotation.x=PI/2;t.position.set(X(cx+Math.cos(a)*(R+1.2)),.14+k*.28,Z(cz+Math.sin(a)*(R+1.2)));sc.add(t)}
    {const a=rnd()*TAU;fb(I,cx+Math.cos(a)*(R+1.6),cz+Math.sin(a)*(R+1.6),.8,.4,.4,0x7a7670)}
    iobj(I,cx,cz+R+1.2,'Look into the cage',()=>card({title:'The Pit',sp:'Alpha Sigma Rho · Fight Night',text:'Chain-link on bent poles, zip-tied together where it has torn. The plywood floor is soft in the middle and stained brown in a way nobody talks about.\n\nFriday nights the brothers pack in around it two deep and the pledges fight whoever Grant points at.'}),1.6)};
  for(const[cx,cz]of[[21,19.5],[60,19.5],[21,55.5],[60,55.5]])ring(cx,cz);
  // crowd barriers between the rings, benches, a bar with a keg along the south wall, a scoreboard chalkboard and banners
  for(const z of[37.5])for(let x=4.5;x<81;x+=6)if(x<36||x>45){fb(I,x,z,4,.2,1.0,0x4a3a2c,0,1);for(const s of[-1.8,1.8])fb(I,x+s,z,.1,.6,1.0,0x3a2a1e,0,0)}
  for(const[x,z]of[[40.5,12],[40.5,27],[40.5,48],[40.5,63],[8,37.5],[73,37.5]])fb(I,x,z,1.2,4,.5,0x5a3a24);
  fb(I,60,87.6,18,1.0,1.1,0x3a2415);fb(I,60,89.6,18,.4,2.4,0x2a1a10);for(const x of[53,57,61,65,69])fb(I,x,86.2,.5,.5,.75,0x2a2a30);
  {const k=new THREE.Mesh(GC.keg||(GC.keg=new THREE.CylinderGeometry(.32,.32,.7,14)),mt(0xb8bcc2,.3,.7));k.position.set(X(67),1.45,Z(87.6));sc.add(k)}
  wsign(I,60,89.75,'n',3.3,'FIGHT NIGHT · FRIDAYS',6,.8,'#1d1d22','#e2b64c','Archivo');
  {const t=ctex(512,256,(q,w,h)=>{q.fillStyle='#1e2a24';q.fillRect(0,0,w,h);q.fillStyle='#e8e8e0';q.font='bold 34px "Kalam","Comic Sans MS",cursive';q.fillText('FIGHT CARD',30,50);q.font='24px "Kalam","Comic Sans MS",cursive';
    ['Ring 1 · Brock vs. ???','Ring 2 · pledges, all night','Ring 3 · grudge match','Ring 4 · whoever\'s left','No biting. No crying.'].forEach((l,i)=>q.fillText(l,40,100+i*32))});frameAt(I,.2,37.5,'e',3,4.8,2.4,t,0x3a2415,0)}
  for(const z of[12,24,51,63]){const b=wbanner;b(I,.2,z,'e',3.4,'ΑΣΡ',0x7d1f2c)}
  // ---- the haze room (x 56-80, z 0-28): graffiti on the concrete, a single bulb, a chair in the middle, buckets, a hose, paddles on hooks
  {const HZ=SM({map:dungTex('haze'),roughness:.95});for(const[x,z,f,w]of[[102,.25,'s',35.4],[119.75,21,'w',41.4],[102,41.7,'n',35.4],[84.3,9,'e',17.4],[84.3,33,'e',17.4]]){const g=wallGrp(I,x,z,f,3);const p=new THREE.Mesh(new THREE.PlaneGeometry(w,5.9),HZ);p.position.z=.02;g.add(p)}
    flat(X(84.2),Z(.2),X(119.8),Z(41.8),.05,SM({map:HTEX.dngF.map,roughness:1,color:0x6a645a}),4);
    for(let i=0;i<7;i++){const c=pick([0xc8202e,0x2f8f4a,0x3a6ad8,0xe2b64c]),s=new THREE.Mesh(new THREE.CircleGeometry(.3+rnd()*.6,10),mt(c,.8));s.rotation.x=-PI/2;s.scale.set(1,.5+rnd(),1);s.position.set(X(87+rnd()*30),.065,Z(3+rnd()*36));sc.add(s)}
    for(let i=0;i<8;i++){const s=new THREE.Mesh(new THREE.CircleGeometry(.6+rnd()*1.2,14),mt(0x3a2e24,.95));s.rotation.x=-PI/2;s.position.set(X(90+rnd()*24),.07,Z(6+rnd()*30));sc.add(s)}
    fchair(I,102,21,0x3a3a3c);box(X(102),.9,Z(21.3),.55,.6,.06,0x3a3a3c,1);box(X(102),4.4,Z(21),.02,2.6,.02,IRON,0);const bb=new THREE.Mesh(GC.dbl,GLOW);bb.position.set(X(102),3.05,Z(21));sc.add(bb);
    for(const[x,z]of[[90,4.5],[91,4.8],[115,37]]){const k=new THREE.Mesh(GC.bkt||(GC.bkt=new THREE.CylinderGeometry(.28,.22,.45,12)),mt(0xd8d0b0,.7));k.position.set(X(x),.27,Z(z));sc.add(k)}
    {const h=new THREE.Mesh(new THREE.TorusGeometry(.5,.06,6,18),mt(0x2a6a3a,.6));h.position.set(X(119.6),1.5,Z(7.5));h.rotation.y=PI/2;sc.add(h)}
    for(let k=0;k<4;k++)fb(I,119.55,15+k*1.3,.12,.35,1.0,0x8a5a34,1.2,0);
    wsign(I,102,.4,'s',4.6,'THE HAZE ROOM',5,.9,'#111','#d22','Impact');
    iobj(I,102,23.2,'Sit in the chair',()=>card({title:'The Haze Room',sp:'Alpha Sigma Rho',text:'The chair is bolted to the floor. Someone has scratched tally marks into the armrest — hundreds of them — and the paint on the walls has been sprayed over so many times it has started to peel in layers.\n\nUnder the newest coat, you can just read: FALL 2019.'}),1.6)}
  // ---- solitary confinement (x 56-80, z 32-60): a corridor and three cells behind bars
  {const CW=12;for(let c=0;c<3;c++){const x0=84+c*CW;if(c>0)iwall(I,x0,60,x0,90);
      // bars across the front of the cell (z 40), with a barred door
      for(let x=x0+.3;x<x0+CW;x+=.32)box(X(x),2.6,Z(60),.05,5.2,.05,IRON,0);box(X(x0+CW/2),5.1,Z(60),CW,.12,.12,IRON,0);box(X(x0+CW/2),1.2,Z(60),CW,.08,.08,IRON,0);markR(X(x0),Z(59.85),X(x0+CW),Z(60.15),5);
      fb(I,x0+1.4,84,1.1,2.4,.45,0x6a6a5a);fb(I,x0+1.4,84,1.0,2.2,.08,0xa89a7a,.45,0);
      const k=new THREE.Mesh(GC.bkt,mt(0x7a7a6a,.7));k.position.set(X(x0+CW-1.2),.27,Z(88.5));sc.add(k);
      const l=new THREE.Mesh(bgeo(.6,.06,.6),GLOW);l.position.set(X(x0+CW/2),5.9,Z(75));sc.add(l);
      for(let t=0;t<4;t++)box(X(x0+.3),1.6+t*.18,Z(72+t*.04),.02,.08,.6,mt(0x3a3a3a,.9),0)}
    wsign(I,102,48.35,'s',4.4,'SOLITARY',3.4,.6,'#111','#e2b64c','Archivo');
    iobj(I,96,61.2,'Spend an hour in solitary (clears your head: +stamina, +health)',()=>{advance(1);S.sta=staMax();S.hp=Math.min(S.mhp,S.hp+10);toast('An hour alone in the dark. You come out calmer. +10 health, stamina restored.')},1.8)}
  // ---- the way back up: a concrete stair in the south-west corner with a door at the top
  // V138 the stair rises toward the door in the south wall: a landing at the top (z D-2..D, 2.5 m up), ten steps down to the floor at z D-7
  {const SC=mt(0x7a7670,.9);fb(I,DUNG.sx,D-1,3,2,2.5,SC,0,0);for(let k=1;k<=10;k++)fb(I,DUNG.sx,D-2-(k-.5)*.5,3,.5,2.5-k*.25,SC,0,0);fb(I,DUNG.sx,D-.3,3.4,.2,3.2,0x3a2415,2.5,0);
    for(const s of[-1,1]){box(X(DUNG.sx+s*1.55),3.4,Z(D-3.5),.06,.06,7,IRON,0);for(let z=D-6.6;z<D;z+=1.2)box(X(DUNG.sx+s*1.55),(Math.min(2.5,Math.max(0,(z-(D-7))/5*2.5))+3.4)/2,Z(z),.05,3.4-Math.min(2.5,Math.max(0,(z-(D-7))/5*2.5)),.05,IRON,0)}
    wsign(I,DUNG.sx,D-.45,'n',5.6,'UP TO THE HOUSE',2.8,.5,'#1d1d22','#e2b64c','Archivo');markR(X(DUNG.sx-1.7),Z(D-6.5),X(DUNG.sx-1.5),Z(D),3);markR(X(DUNG.sx+1.5),Z(D-6.5),X(DUNG.sx+1.7),Z(D),3);
    iobj(I,DUNG.sx,D-.9,'Go back up to the house',()=>dungUp(),1.3)}
  // V138 the haze room's steel door, hanging part-open on the gap in its wall
  {const g=new THREE.Group();g.position.set(X(84),0,Z(22.2));g.rotation.y=-1.15;sc.add(g);const dr=new THREE.Mesh(bgeo(.08,2.6,2.1),mt(0x4a4c4a,.6,.5));dr.position.set(.04,1.3,-1.05);dr.castShadow=true;g.add(dr);
    for(const y of[.5,1.3,2.1]){const st=new THREE.Mesh(bgeo(.1,.1,2.1),mt(0x6a3a26,.8,.3));st.position.set(.09,y,-1.05);g.add(st)}const hd=new THREE.Mesh(bgeo(.1,.2,.06),mt(0x2a2c30,.4,.6));hd.position.set(.12,1.1,-1.85);g.add(hd);
    box(X(84),2.75,Z(21.1),.4,.3,2.6,mt(0x55524c,.9),0)}
  // a few very dim bare bulbs in every room, each with a faint pool of light under it
  {const DIM=GC.dGl2||(GC.dGl2=new THREE.MeshBasicMaterial({color:0x2e2414,alphaMap:GLW.alphaMap,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})),BUL=bm(0xc89850);
    for(const[x,z]of[[40.5,8],[40.5,37.5],[40.5,70],[12,37.5],[72,80],[18,80],[94,10],[110,32],[102,54],[90,75],[102,75],[114,75]]){box(X(x),5.2,Z(z),.02,1.6,.02,IRON,0);const b=new THREE.Mesh(GC.dbs||(GC.dbs=new THREE.SphereGeometry(.1,8,6)),BUL);b.position.set(X(x),4.35,Z(z));sc.add(b);
      const gl=new THREE.Mesh(new THREE.PlaneGeometry(9,9),DIM);gl.rotation.x=-PI/2;gl.position.set(X(x),.08,Z(z));gl.renderOrder=2;sc.add(gl)}}
  // V139 the fuse room (north-west corner, x 0-10, z 0-10): a steel door with a keypad, the main breaker panel and its big lever inside
  {const g=new THREE.Group();g.position.set(X(10),0,Z(4));sc.add(g);const dr=new THREE.Mesh(bgeo(.1,2.7,2.6),mt(0x5a5c5e,.55,.6));dr.position.set(0,1.35,1.3);dr.castShadow=true;g.add(dr);
    for(const y of[.6,1.35,2.1]){const st=new THREE.Mesh(bgeo(.14,.08,2.6),mt(0x3a3c3e,.6,.5));st.position.set(.03,y,1.3);g.add(st)}const hd=new THREE.Mesh(bgeo(.12,.3,.06),mt(0x2a2c30,.4,.6));hd.position.set(.1,1.1,2.3);g.add(hd);
    box(X(10),2.95,Z(5.3),.4,.3,2.8,mt(0x55524c,.9),0);DUNG.door=g;markR(X(9.9),Z(4),X(10.15),Z(6.6),3);
    const kp=new THREE.Mesh(bgeo(.06,.36,.26),mt(0x1e2024,.5,.4));kp.position.set(X(10.25),1.45,Z(7.1));sc.add(kp);const kl=new THREE.Mesh(bgeo(.02,.06,.06),bm(0xd8302a));kl.position.set(X(10.29),1.6,Z(7.1));sc.add(kl);DUNG.kled=kl;
    wsign(I,10.24,8.6,'e',2.5,'ELECTRICAL · KEEP OUT',1.8,.3,'#d8b030','#111','Archivo');
    // the breaker panel on the north wall, and the main lever
    box(X(5),2.2,Z(.3),3.2,2.2,.3,mt(0x6a6e70,.5,.5),1);for(let k=0;k<12;k++)box(X(3.8+(k%6)*.48),1.75+Math.floor(k/6)*.6,Z(.48),.26,.4,.06,mt(0x2a2c30,.6),0);
    const lv=new THREE.Group();lv.position.set(X(6.6),2.5,Z(.55));sc.add(lv);const arm=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.7,8),mt(0xb8bcc2,.3,.8));arm.position.y=.35;lv.add(arm);
    const kb=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),mt(0xc8302a,.5));kb.position.y=.72;lv.add(kb);lv.rotation.x=1.1;DUNG.lever=lv;
    const bb=new THREE.Mesh(GC.dbs||(GC.dbs=new THREE.SphereGeometry(.1,8,6)),bm(0xc89850));bb.position.set(X(5),4.3,Z(5));sc.add(bb);
    for(const o of[DUNG.door,DUNG.lever,DUNG.kled])o.traverse(m=>{m.userData.noMerge=1})}   // V147 these move/change, so keep them out of the static merge
  for(const[x,z]of[[3,3],[3,8],[8,8]])box(X(x),.4,Z(z),.8,.8,.8,mt(0x6a5236,.9),1);
  I.staff.push(['brothers',60,36,0,{name:'Tank Morrow',title:'Fight Night Referee',lvl:6,greet:'"Pledge. You lost? Or you want a turn in the ring?"'}],
               ['brothers',18,38.4,PI,{title:'Alpha Sigma Rho',lvl:5}],['brothers',54,73,0,{title:'Alpha Sigma Rho',lvl:5}]);
  return I}
// the locked door at the west end of the ASR ground-floor hall
function dungDoor(I){const g=wallGrp(I,.16,16,'e',0),W=mt(0x2a1a10,.7),IR=mt(0x26282c,.45,.6);
  const d=new THREE.Mesh(bgeo(1.6,2.7,.12),W);d.position.set(0,1.35,.06);g.add(d);for(const y of[.6,1.35,2.1]){const s=new THREE.Mesh(bgeo(1.7,.12,.05),IR);s.position.set(0,y,.14);g.add(s)}
  const lk=new THREE.Mesh(bgeo(.16,.24,.08),mt(0xc9a046,.3,.7));lk.position.set(.55,1.25,.18);g.add(lk);
  const s=signMesh('PRIVATE · MEMBERS ONLY',1.3,.22,'#1a0a0a','#d8b048','Georgia');s.position.set(0,2.9,.13);g.add(s);
  iobj(I,1.4,16,'Go down to the basement',()=>{if(!S.pledged&&!S.c1dung){toast('The basement door is padlocked. A brass plate reads MEMBERS ONLY.',2600);sfx('bad');return}
    sfx('ui');try{maDoor()}catch(e){}fadeTo(()=>{goIn(DUNG.id,DUNG.sx,DUNG.D-8.6);P.face=PI;yaw=0;pitch=.32;camT=4;toast('The Dungeon',1800);if(!S.dungSeen){S.dungSeen=1;setTimeout(()=>big('THE DUNGEON',1800),300)}})},1.7)}
function dungUp(){sfx('ui');try{maDoor()}catch(e){}fadeTo(()=>{goIn('asr',1.6,16);P.face=PI/2;yaw=P.face+PI;camT=3})}
// open/close the fuse room door (the keypad unlocks it in chapter 1; it stays open after that)
function dungDoorOpen(on){const g=DUNG.door;if(!g)return;const I=INT.asr_bsmt;g.rotation.y=on?-1.25:0;cells(I.x0+9.9,I.z0+4,I.x0+10.15,I.z0+6.6,k=>{if(on){WG[k]=0;HG[k]=0}else{WG[k]=1;HG[k]=Math.max(HG[k],3)}});if(DUNG.kled)DUNG.kled.material=bm(on?0x3ad85a:0xd8302a)}
