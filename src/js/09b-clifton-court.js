// ================================================================ V126 Clifton Court Hall's south corner, from the user's photos
// The glass cube stands on dark square columns over an open, two-level patio: the footbridge from the hill passes under the cube between the
// columns and lands on a balcony in front of the glass doors of the grey-panel lobby; below it the patio has curved concrete planters with
// grasses and ground cover, a concrete bench block, cafe tables, a column covered in flyers and a white soffit with linear LED strips.
// The old solid grey wing (OSM 'cchG') is gone: the patio runs open to the west under the cube, as in the photos.
// World frame: x east, z south (map north is -z). Patio level CCHD.PY, bridge/balcony level CCHD.BY (from the OSM bridge), soffit CCHD.SOF.
const CCHD={PY:3.0,BY:9.1,SOF:13.4,TOP:24,CX0:181.0,CX1:203.6,CZ0:248.2,CZ1:262.6,LX0:197.0,LZ1:257.0,
  BAL:[[192.0,257.9],[194.9,256.4],[197.0,256.4],[197.0,248.3],[192.6,248.3]],E:[193.30,256.79],deck:null,up:0,
  gd:[189.6,246.6],ud:[196.0,252.8]};
// V127 the patio is levelled at PY = the level of the Braunstein hill (the walk west of Braunstein and the stair landing), not the street:
// terrain grid points x 169..203 (z 246..260, and on to 264 west of x 190 where a hollow is filled) are set to PY. To the west the ground
// stays at street level behind a retaining wall at x 167; south and east it meets the hill at about the same height.
(function(){const T=UCT,N=T.nx,PY=CCHD.PY;
  for(let j=0;j<T.nz;j++){const z=T.z0+j*T.dx;if(z<245.5||z>264.5)continue;for(let i=0;i<N;i++){const x=T.x0+i*T.dx;if(x<168||x>204)continue;
    if(z>260.5&&x>190)continue;TRH[j*N+i]=Math.round(PY*100)}}})();
let CAMBLK=null;
// before the campus is built: retire the grey wing (a dummy keeps the building ids stable), end the footbridge at the balcony, work out the levels
function cchPrep(D){
  // V132 (not CCH, but this runs before the ground is painted): the small OSM lawn south of Dieterle sits in the middle of the brick walk and
  // read as a dark pothole; the walk is paved straight through instead
  if(D.gard)D.gard=D.gard.filter(g=>!(g.r&&g.r[0]&&Math.abs(g.r[0][0]-366.13)<.1&&Math.abs(g.r[0][1]-454.87)<.1));   // the bare dirt bed that read as the hole
  if(D.grass)D.grass=D.grass.filter(r=>!(r[0]&&r[0][0]&&Math.abs(r[0][0][0]-352.17)<.1&&Math.abs(r[0][0][1]-448.66)<.1));
  const br=(D.bridges||[]).find(b=>{const q=b.p[b.p.length-1];return Math.hypot(q[0]-189.8,q[1]-249.9)<1.5});
  if(br&&!br.cch){br.cch=1;const keep=[],hh=[];br.p.forEach((q,i)=>{if(q[1]>257.1){keep.push(q);hh.push(br.h[i])}});keep.push(CCHD.E.slice());hh.push(hh[hh.length-1]);br.p=keep;br.h=hh}
  if(br)CCHD.BY=Math.max(...br.p.map(([x,z],i)=>terrH(x,z)+br.h[i]));
  CCHD.SOF=CCHD.BY+4.3;
  const mainB=D.B.find(b=>b.s==='cch');const lvM=mainB?terrH(mainB.fp[0]+mainB.fn[0]*1.6,mainB.fp[1]+mainB.fn[1]*1.6):0;
  CCHD.TOP=Math.max(lvM+(mainB?mainB.h:21),CCHD.SOF+10.5);
  const w=D.B.find(b=>b.s==='cchG'&&b.n==='Clifton Court Hall');
  if(w&&!w.cch){w.cch=1;w.cchX=1;w.p=[[0,0,.2,0,0,.2]];w.h=.05;w.lvo=terrH(.05,.05);w.sg=0;w.u=0;w.n=''}}
function cchCube(D){const C=CCHD,{PY,BY,SOF,TOP,CX0,CX1,CZ0,CZ1,LX0,LZ1}=C,W=CX1-CX0,DP=CZ1-CZ0,H=TOP-SOF;const n0=sc.children.length;
  const add=m=>{m.castShadow=true;m.receiveShadow=true;sc.add(m);return m};
  const bx=(mat,x,y,z,w,h,d,ry)=>{const m=add(new THREE.Mesh(bgeo(w,h,d),mat));m.position.set(x,y,z);if(ry)m.rotation.y=ry;return m};
  const plane=(mat,x,y,z,w,h,ry)=>{const m=add(new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat));m.position.set(x,y,z);m.rotation.y=ry||0;m.castShadow=false;return m};
  // ---- textures, each drawn for its own face so nothing stretches (40 px per metre)
  const PX=40;
  const glassTex=(em)=>ctex(Math.round(W*PX),Math.round(H*PX),(q,w,h)=>{const m=v=>v*PX,fl=[[0,.9],[.9,4.5],[5.3,4.4],[9.7,H-9.7]];
    if(!em){const g=q.createLinearGradient(0,0,0,h);g.addColorStop(0,'#9fb4c4');g.addColorStop(.45,'#6f8799');g.addColorStop(1,'#4a5d6b');q.fillStyle=g;q.fillRect(0,0,w,h)}else{q.fillStyle='#000';q.fillRect(0,0,w,h)}
    // floors (from the bottom): a dark spandrel, then two tall glazed floors with a spandrel between, then the clerestory
    const yb=v=>h-m(v);
    for(let f=1;f<fl.length;f++){const[y0,hh]=fl[f];if(em){q.fillStyle=f===1?'rgba(255,244,214,.42)':f===2?'rgba(255,248,226,.3)':'rgba(255,248,232,.18)';q.fillRect(0,yb(y0+hh),w,m(hh));
        if(f===1){q.fillStyle='rgba(60,110,255,.8)';q.fillRect(w*.3,yb(y0+hh-.6),w*.28,m(1.6))}continue}
      // what you see through the glass: the ceiling's light lines, tables, people, and the blue screens
      q.fillStyle='rgba(30,38,46,.35)';q.fillRect(0,yb(y0+hh),w,m(hh));
      q.fillStyle='rgba(235,240,240,.55)';for(let k=0;k<3;k++)q.fillRect(w*.08+k*w*.07,yb(y0+hh-.25-k*.18),w*.62,2);
      if(f<3){q.fillStyle='rgba(20,22,26,.6)';for(let x=m(.8);x<w-m(.8);x+=m(1.9)){q.fillRect(x,yb(y0+1.0),m(1.1),m(.12));q.fillRect(x+m(.2),yb(y0+.95),m(.08),m(.9));if(rnd()<.6){q.beginPath();q.arc(x+m(.75),yb(y0+1.45),m(.17),0,TAU);q.fill();q.fillRect(x+m(.62),yb(y0+1.3),m(.3),m(.5))}}}
      if(f===1){q.fillStyle='rgba(70,110,230,.75)';q.fillRect(w*.3,yb(y0+hh-.6),w*.28,m(1.6))}
      // sky reflection streaks
      q.fillStyle='rgba(255,255,255,.08)';for(let k=0;k<5;k++){const x=rnd()*w;q.beginPath();q.moveTo(x,yb(y0+hh));q.lineTo(x+m(1.5),yb(y0+hh));q.lineTo(x+m(.4),yb(y0));q.lineTo(x-m(1.1),yb(y0));q.fill()}}
    if(em)return;
    // spandrels and slab edges
    q.fillStyle='#2b3035';for(const[y0,hh]of[[0,.9],[5.4-.1,.75],[9.7-.1,.55]])q.fillRect(0,yb(y0+hh),w,m(hh));
    q.fillStyle='rgba(200,206,212,.5)';for(const y of[.9,5.3,9.7])q.fillRect(0,yb(y)-1,w,2);
    // mullions: seven bays, each split in two
    q.fillStyle='#c4cad0';const nb=7;for(let k=0;k<=nb*2;k++){const x=k*w/(nb*2),t=k%2?2:5;q.fillRect(x-t/2,0,t,h)}
    q.fillStyle='#d6dbe0';q.fillRect(0,0,w,5)});
  const terraTex=(fw,win)=>ctex(Math.round(fw*PX),Math.round(H*PX),(q,w,h)=>{
    for(let x=0,c=0;x<w;x+=PX*.6,c++){q.fillStyle=shade('#b06244',((c*37)%11)-5);q.fillRect(x,0,PX*.6,h)}
    q.fillStyle='rgba(70,30,20,.35)';for(let x=0;x<w;x+=PX*.6)q.fillRect(x,0,1.5,h);for(let y=0;y<h;y+=PX*1.2)q.fillRect(0,y,w,1);
    if(win){q.fillStyle='#3a4652';for(let x=PX*1.2,k=0;x<w-PX;x+=PX*2.4,k++){const y0=(k%2)?PX*1.2:PX*2.6;for(let y=y0;y<h-PX*1.6;y+=PX*4.4){q.fillRect(x,y,PX*.8,PX*2.6);q.fillStyle='#8aa0b2';q.fillRect(x+3,y+3,PX*.8-6,PX*1.1);q.fillStyle='#3a4652'}}}
    q.fillStyle='#d9dde1';q.fillRect(0,0,w,PX*.25)});
  const gm=SM({map:glassTex(0),roughness:.18,metalness:.35,emissive:0xffffff,emissiveMap:glassTex(1),emissiveIntensity:0});FMLIST.push(gm);
  const tW=SM({map:terraTex(DP,0),roughness:.8}),tE=SM({map:terraTex(DP,1),roughness:.8}),tN=SM({map:terraTex(W,1),roughness:.8});
  const SOFM=SM({color:0xf2f2ef,emissive:0x8c8c88,roughness:.9}),ROOF=mt(0x8a8d90,.9),ALU=mt(0xc9ced3,.35,.55),DARK=mt(0x3b4046,.55,.3),FR=mt(0x2a2d31,.5,.4);
  const LED=SM({color:0xfcfaf4,emissive:0xfff3dc,emissiveIntensity:0,roughness:.4});FMLIST.push(LED);
  // ---- the cube (BoxGeometry faces: +x, -x, +y, -y, +z, -z)
  {const m=add(new THREE.Mesh(new THREE.BoxGeometry(W,H,DP+.4),[tE,tW,ROOF,SOFM,gm,tN]));m.position.set((CX0+CX1)/2,SOF+H/2,(CZ0+CZ1)/2-.2);m.userData.noMerge=1}   // the north face sits just inside the main building's wall
  // the bright aluminium frame round the glass face, and a parapet cap
  {const z=CZ1+.18;bx(ALU,(CX0+CX1)/2,TOP-.2,z,W+.5,.4,.5);bx(ALU,(CX0+CX1)/2,SOF+.2,z,W+.5,.4,.5);bx(ALU,CX0-.05,SOF+H/2,z,.45,H,.5);bx(ALU,CX1+.05,SOF+H/2,z,.45,H,.5);
    bx(ALU,(CX0+CX1)/2,TOP+.25,(CZ0+CZ1)/2,W+.2,.5,DP+.2)}
  // west face: aluminium fins in staggered runs (the vertical blades on the left of the photo), deep enough to throw shadows
  for(let z=CZ0+.7,k=0;z<CZ1-.4;z+=.85,k++){const segs=k%3===0?[[0,H]]:k%3===1?[[.6,H*.55],[H*.62,H-.3]]:[[H*.25,H-.8]];
    for(const[a,b]of segs)bx(ALU,CX0-.3,SOF+(a+b)/2,z,.6,b-a,.07)}
  // soffit: linear LED strips of staggered lengths, and a bulkhead edge
  for(let k=0;k<5;k++){const L=W*(.42+.1*((k*3)%4)),x=CX0+W*.5+(k%2?1.2:-.6);bx(LED,x,SOF-.05,CZ0+DP*.42+k*1.25,L,.08,.14).castShadow=false}
  bx(SOFM,(CX0+CX1)/2,SOF-.3,CZ1-.15,W,.6,.3);bx(SOFM,CX0+.15,SOF-.3,(CZ0+CZ1)/2,.3,.6,DP);
  // ---- columns: dark square panels on a concrete collar
  for(const[x,z]of[[181.9,261.7],[202.6,261.7],[190.6,253.4],[181.9,251.6]]){const g=terrH(x,z),h=SOF-g;bx(DARK,x,g+h/2,z,.9,h,.9);bx(mt(0xc9c4ba,.85),x,g+.12,z,1.0,.24,1.0);markR(x-.5,z-.5,x+.5,z+.5,h);
    for(let k=0;k<4;k++)bx(mt(0x7c8187,.6,.3),x,g+1.6+k*2.8,z,.94,.03,.94)}
  // flyers taped to the patio column
  {const x=190.6,z=253.4,g=PY,FL=[0xf2efe8,0xffffff,0xf4e6c8,0xe8eef4,0xf6d8d0];for(let k=0;k<9;k++){const s=k%4,ry=s*PI/2,o=.46,dx=Math.sin(ry)*o,dz=Math.cos(ry)*o,u=(k*.37%1-.5)*.5;
    const p=plane(mt(FL[k%5],.95),x+dx+Math.cos(ry)*u,g+1.35+((k*7)%5)*.22,z+dz-Math.sin(ry)*u,.28,.36,ry);p.receiveShadow=true}}
  // ---- the lobby: grey panel box under the cube's east side, standing on the patio
  const LP=[[LX0,CZ0-.3],[CX1,CZ0-.3],[CX1,LZ1],[LX0,LZ1]];prism(LP,PY-4.5,SOF-PY+4.5,'cchG',0x4a4d52,{solid:false});markR(LX0,CZ0,CX1,LZ1,SOF-PY);
  // ---- glass doors: dark bronze frames, glass, push bars (n = outward normal, along = the wall direction)
  const GLS=SM({color:0x7f98a8,transparent:true,opacity:.55,roughness:.1,metalness:.2,depthWrite:false});
  const doors=(cx,y0,cz,nx,nz,wd,ht,tr)=>{const ry=Math.atan2(nx,nz),ax=nz,az=-nx,o=.08,at=(u,v,d)=>[cx+ax*u+nx*(o+d),y0+v,cz+az*u+nz*(o+d)];
    const b=(u,v,w,h,d,dd,mat)=>{const[x,y,z]=at(u,v,dd);bx(mat,x,y,z,w,h,d,ry)};
    b(0,ht/2,wd,ht,.06,-.05,GLS);b(-wd/2,ht/2,.14,ht,.18,0,FR);b(wd/2,ht/2,.14,ht,.18,0,FR);b(0,ht,wd+.14,.16,.2,0,FR);
    const n=Math.max(2,Math.round(wd/1.0));for(let k=1;k<n;k++)b(-wd/2+k*wd/n,ht/2,.08,ht,.14,0,FR);
    for(let k=0;k<n;k++){const u=-wd/2+(k+.5)*wd/n+(k%2?-.3:.3);b(u,1.05,.04,.9,.05,.1,ALU)}
    if(tr>0){b(0,ht+tr/2,wd,tr,.06,-.05,GLS);b(0,ht+tr,wd+.14,.14,.18,0,FR);for(let k=0;k<=n;k++)b(-wd/2+k*wd/n,ht+tr/2,.08,tr,.12,0,FR)}};
  doors(C.gd[0],PY,CZ0,0,1,3.6,3.1,1.0);            // ground floor, main building's south wall (enters the building)
  doors(LX0,PY,252.8,-1,0,4.2,3.1,1.1);              // ground floor, lobby (under the balcony)
  doors(LX0,BY,252.8,-1,0,4.2,3.0,SOF-BY-3.6);       // bridge level, onto the balcony (enters the building)
  // ---- the balcony the bridge lands on: concrete slab, picket railing with a light strip under the handrail
  const PKT=new THREE.MeshLambertMaterial({map:ctex(64,64,q=>{q.clearRect(0,0,64,64);q.fillStyle='#8f969c';for(let x=6;x<64;x+=12)q.fillRect(x,0,4,64);q.fillRect(0,0,64,5);q.fillRect(0,59,64,5)}),transparent:true,alphaTest:.5,side:THREE.DoubleSide});
  const rail=(a,b,y)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]),ry=Math.atan2(-(b[1]-a[1]),b[0]-a[0]),cx=(a[0]+b[0])/2,cz=(a[1]+b[1])/2;
    const g=new THREE.PlaneGeometry(L,.9),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*L/.7);const p=add(new THREE.Mesh(g,PKT));p.position.set(cx,y+.6,cz);p.rotation.y=ry;p.castShadow=false;
    bx(ALU,cx,y+1.08,cz,L+.05,.07,.1,ry);bx(LED,cx,y+1.0,cz,L,.03,.05,ry).castShadow=false;bx(ALU,cx,y+.12,cz,L,.06,.06,ry);
    for(let t=0;t<=L+.01;t+=Math.max(.9,L/Math.ceil(L/1.4))){const f=t/L;bx(FR,a[0]+(b[0]-a[0])*f,y+.55,a[1]+(b[1]-a[1])*f,.07,1.1,.07)}};
  {const B_=C.BAL;prism(B_,BY-.65,.65,0xc9c5bd,SM({color:0xc4c2bc,emissive:0x3c3c3a,roughness:.9}),{solid:false});
    for(const[i,j]of[[1,2],[4,0]])rail(B_[i],B_[j],BY);
    // brackets under the slab edge (the photo's row of steel cleats)
    for(const[i,j]of[[1,2],[4,0]]){const a=B_[i],b=B_[j],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let t=.5;t<L;t+=1.2){const f=t/L;bx(mt(0x9aa0a6,.5,.4),a[0]+(b[0]-a[0])*f,BY-.45,a[1]+(b[1]-a[1])*f,.18,.32,.18)}}
    const[x0,z0,x1,z1]=bbox(B_);C.deck={area:{poly:B_,holes:[]},P:[[(x0+x1)/2,(z0+z1)/2],[(x0+x1)/2+.1,(z0+z1)/2]],ys:[BY,BY],s:[0,2],L:2,hw:99,w:198,k:'area',bb:[x0-.5,z0-.5,x1+.5,z1+.5],t0:0,t1:2,y:BY};DECKS.push(C.deck)}
  // ---- patio floor: concrete slabs with saw-cut joints and a couple of drain covers
  {const PT=[[169.0,246.7],[203.5,246.7],[203.5,260.0],[197.8,260.6],[192.8,260.0],[186,258.9],[179,258.6],[172,259.6],[169.0,261.2]];const m=capMesh(PT,PY+.03,GC.cchPav||(GC.cchPav=(()=>{const t=ctex(128,128,(q,w,h)=>{q.fillStyle='#d9d9d5';q.fillRect(0,0,w,h);for(let k=0;k<500;k++){const v=190+rnd()*40|0;q.fillStyle=`rgba(${v},${v},${v},.35)`;q.fillRect(rnd()*w,rnd()*h,2,2)}q.fillStyle='rgba(110,110,106,.55)';q.fillRect(0,0,w,2);q.fillRect(0,0,2,h)});t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.625,.625);return SM({map:t,roughness:.92,emissive:0x2a2a2a})})()));m.receiveShadow=true;
    for(const[x,z]of[[193.6,254.6],[199.4,258.6]]){const d=add(new THREE.Mesh(new THREE.CircleGeometry(.38,16),mt(0x7a5a3e,.6,.3)));d.rotation.x=-PI/2;d.position.set(x,PY+.045,z);d.castShadow=false}}
  // ---- at night the soffit's LED lines light the patio evenly (an additive glow sheet, like the yard string lights)
  {const gT=ctex(64,64,(q,w,h)=>{const g=q.createRadialGradient(w/2,h/2,4,w/2,h/2,w*.62);g.addColorStop(0,'#fff');g.addColorStop(.55,'#bbb');g.addColorStop(1,'#000');q.fillStyle=g;q.fillRect(0,0,w,h)});
    const m=SM({color:0x000000,emissive:0x3a3428,emissiveIntensity:0,alphaMap:gT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});FMLIST.push(m);
    const g=new THREE.Mesh(new THREE.PlaneGeometry(CX1-CX0+6,16),m);g.rotation.x=-PI/2;g.position.set((CX0+CX1)/2-1,PY+.07,253.6);g.renderOrder=2;g.userData.noMerge=1;sc.add(g)}
  // ---- curved planters: concrete walls, soil, grasses, ground cover and river stones
  const CON=mt(0xd4cfc4,.88),SOIL=mt(0x4a3a2c,.95),GC_=SM({color:0x5f8a3a,roughness:.95,flatShading:true}),STN=mt(0xd8d2c4,.8);
  const GRS=mt(0x9c9a5a,.95),GRS2=mt(0xb8a874,.95);
  const bez=(a,c,b,n)=>{const P=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;P.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]])}return P};
  const wall=(P,top,th)=>{for(let i=0;i<P.length-1;i++){const[a,b]=[P[i],P[i+1]],L=Math.hypot(b[0]-a[0],b[1]-a[1]),cx=(a[0]+b[0])/2,cz=(a[1]+b[1])/2,ry=Math.atan2(-(b[1]-a[1]),b[0]-a[0]);
    bx(CON,cx,(PY+top)/2,cz,L+.06,top-PY+.02,th,ry);markC(cx,cz,th/2+.05,top-PY)}};
  const bed=(P,back,top)=>{// soil strip behind a curved wall (towards 'back' metres along the inner normal), planted
    for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/L*back,nz=(b[0]-a[0])/L*back;
      const q=[[a[0],a[1]],[b[0],b[1]],[b[0]+nx,b[1]+nz],[a[0]+nx,a[1]+nz]],ys=q.map(()=>top),A=[];for(const t of[[0,1,2],[0,2,3]])for(const k of t)A.push(q[k][0],ys[k],q[k][1]);
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A,3));g.computeVertexNormals();const m=add(new THREE.Mesh(g,SOIL));m.castShadow=false;
      for(let k=0;k<3;k++){const f=rnd(),d=.3+rnd()*(Math.abs(back)-.4),x=a[0]+(b[0]-a[0])*f+nx/Math.abs(back)*d,z=a[1]+(b[1]-a[1])*f+nz/Math.abs(back)*d,y=Math.max(top,terrH(x,z)+.04);if(y>top+.35)continue;
        if(rnd()<.45){const s=.7+rnd()*.6;for(let r=0;r<9;r++){const p=add(new THREE.Mesh(GC.cgq||(GC.cgq=new THREE.ConeGeometry(.035,1,4)),r%3?GRS:GRS2));const a=r*2.4,t=.18+rnd()*.25;p.scale.set(1,s*(.7+rnd()*.5),1);p.position.set(x+Math.sin(a)*t*.5,y+p.scale.y*.45,z+Math.cos(a)*t*.5);p.rotation.set(Math.cos(a)*t,0,-Math.sin(a)*t);p.castShadow=false}}
        else if(rnd()<.7){const p=add(new THREE.Mesh(GC.cgc||(GC.cgc=new THREE.IcosahedronGeometry(.4,0)),GC_));p.scale.set(1.3,.35,1.1);p.position.set(x,y+.08,z);p.castShadow=false}
        else{const p=add(new THREE.Mesh(GC.cgs||(GC.cgs=new THREE.IcosahedronGeometry(.22,0)),STN));p.scale.set(1.2,.45,.9);p.position.set(x,y+.04,z);p.rotation.y=rnd()*3}}}};
  {const P1=bez([167.0,261.2],[178,256.6],[192.8,260.0],16);wall(P1,PY+.78,.36);bed(P1,2.4,PY+.62);
   const P3=bez([192.8,260.0],[195.0,260.5],[197.8,260.6],5);wall(P3,PY+.5,.34)}
  // ---- west edge: the street side drops away, so a retaining wall with a railing, and a planted strip along its top
  {const z0=246.7,z1=264.8,zc=(z0+z1)/2,L=z1-z0,yl=-2;bx(CON,167.2,(yl+PY+.45)/2,zc,.4,PY+.45-yl,L);bx(SOIL,168.2,PY+.25,zc,1.6,.1,L);bx(CON,169.05,PY+.2,zc,.16,.42,L);
    markR(167.0,z0,169.1,z1,2);rail([167.2,z0+.1],[167.2,z1-.1],PY+.45);
    for(let z=z0+.8;z<z1-.4;z+=1.3+rnd()*.6){const x=167.8+rnd()*.9;if(rnd()<.5){const p=add(new THREE.Mesh(GC.cgc||(GC.cgc=new THREE.IcosahedronGeometry(.4,0)),GC_));p.scale.set(1.2,.5,1.2);p.position.set(x,PY+.35,z);p.castShadow=false}
      else for(let r=0;r<8;r++){const p=add(new THREE.Mesh(GC.cgq||(GC.cgq=new THREE.ConeGeometry(.035,1,4)),r%3?GRS:GRS2));const a=r*2.4,t=.18+rnd()*.25;p.scale.set(1,.8+rnd()*.4,1);p.position.set(x+Math.sin(a)*t*.5,PY+.3+p.scale.y*.45,z+Math.cos(a)*t*.5);p.rotation.set(Math.cos(a)*t,0,-Math.sin(a)*t);p.castShadow=false}}}
  // ---- the way in from Braunstein: a short flight off the west side of the Braunstein hill stair's landing, past the lobby's south side
  {const st=(D.decks||[]).find(d=>d.k==='st'&&d.p.some(([x,z])=>Math.hypot(x-207.2,z-254.4)<.6));
    if(st){const zj=259.7;let yj=null;for(let i=0;i<st.p.length-1;i++){const[a,b]=st.p[i],[c,e]=st.p[i+1];if((zj-b)*(zj-e)<=0&&Math.abs(e-b)>1e-6){const ya=st.y[i]!=null?st.y[i]:terrH(a,b),yb=st.y[i+1]!=null?st.y[i+1]:terrH(c,e);yj=ya+(yb-ya)*(zj-b)/(e-b);break}}
      if(yj!=null){const d=deckMk([[206.5,zj],[205.5,zj],[202.2,zj]],[yj+.015,yj+.015,PY],2.2,'st');d.nob=1;C.jdeck=d}}}
  // ---- concrete bench block with a dark shadow recess, cafe tables and mesh chairs, bins, a bollard light, the blue-light phone, lamps
  for(const[x,z]of[[194.9,258.5],[183.5,257.1]]){bx(CON,x,PY+.38,z,3.2,.36,1.0);bx(mt(0x2b2b2e,.9),x,PY+.12,z+.05,3.0,.24,.85);markR(x-1.6,z-.5,x+1.6,z+.5,.55)}
  {const TB=mt(0x2e3236,.5,.4);for(const[x,z]of[[171.5,252.0],[175.0,254.6],[178.5,251.4],[171.8,256.2],[188.0,253.2],[193.6,251.8]]){const top=add(new THREE.Mesh(GC.cct||(GC.cct=new THREE.CylinderGeometry(.48,.48,.05,16)),TB));top.position.set(x,PY+.75,z);
      const pole=add(new THREE.Mesh(GC.ccp||(GC.ccp=new THREE.CylinderGeometry(.05,.05,.72,6)),TB));pole.position.set(x,PY+.38,z);markC(x,z,.5,.8);
      for(let k=0;k<4;k++){const a=k*PI/2+.4,cx=x+Math.sin(a)*.82,cz=z+Math.cos(a)*.82;bx(TB,cx,PY+.45,cz,.44,.05,.44,a);bx(TB,cx+Math.sin(a)*.2,PY+.7,cz+Math.cos(a)*.2,.44,.5,.04,a);for(const s of[-1,1])bx(TB,cx+Math.cos(a)*s*.18,PY+.22,cz-Math.sin(a)*s*.18,.03,.44,.03,a)}}}
  for(const x of[191.9,192.6]){const c=add(new THREE.Mesh(GC.ccb||(GC.ccb=new THREE.CylinderGeometry(.3,.28,1.0,12)),mt(0x1c1d20,.6)));c.position.set(x,PY+.5,247.2);markC(x,247.2,.32,1)}
  {const x=193.3,z=248.4;bx(FR,x,PY+.55,z,.2,1.1,.2);bx(LED,x,PY+1.02,z,.21,.12,.21).castShadow=false}
  {const x=197.6,z=258.0,BL=bm(0x3a7aff);cyl(x,PY+1.5,z,.09,3,mt(0x2a2d31,.5,.4),8);const b=new THREE.Mesh(GC.ccbl||(GC.ccbl=new THREE.SphereGeometry(.16,10,8)),BL);b.position.set(x,PY+3.05,z);sc.add(b);
    bx(mt(0x2a4aa8,.5),x,PY+1.5,z+.1,.25,.5,.08);markC(x,z,.15,3)}
  try{discLamp(199.6,262.0);discLamp(187.6,259.9);discLamp(172.6,260.8)}catch(e){}
  try{youngTree(201.4,261.6,.85);youngTree(170.2,261.9,.9);youngTree(177.6,259.9,.8)}catch(e){}
  // ---- the building record: map footprint, the doors and the interior
  const poly=[[CX0,CZ0],[CX1,CZ0],[CX1,CZ1],[CX0,CZ1]];B.push({id:'cch',name:'Clifton Court Hall',x0:CX0,z0:CZ0,x1:CX1,z1:CZ1,h:TOP,poly,mc:'#9a5a48',face:'s',da:C.gd[0],ex:C.gd[0],ez:C.gd[1]+2.3,fp:C.gd.slice(),fn:[0,1]});
  NOTREE.push([164,246,CX1,CZ1]);
  // the camera never pokes up into the cube from under it, or from the balcony
  CAMBLK=(x,y,z)=>x>CX0-.3&&x<CX1+.3&&z>CZ0-.3&&z<CZ1+.3&&y>SOF-.35&&y<TOP+.3;
  // everything here is placed at its true height: keep buildCampus's final ground shift (shiftFrom(iFree,...terrH)) off it
  for(let i=n0;i<sc.children.length;i++)sc.children[i].userData.ts=1}
// the "Enter Clifton Court Hall" spot at the bridge-level doors (only while you stand on the balcony)
function cchUpDoor(add){const C=CCHD;if(!C.deck||P.inside||P.dk==null||DECKS[P.dk]!==C.deck)return;const b=B.find(b=>b.id==='cch');if(b)add(C.ud[0],C.ud[1],2.2,'Enter Clifton Court Hall',()=>{C.up=1;enterBld(b)},3)}
// coming back out through the bridge-level doors puts you on the balcony
function cchExitUp(){const C=CCHD;if(!C.up||!C.deck)return false;C.up=0;goOut(C.ud[0]-.6,C.ud[1]);P.dk=DECKS.indexOf(C.deck);P.y=C.BY;P.face=-PI/2;yaw=P.face+PI;camT=3;return true}
// inside: the ground-floor commons (study tables, lounge seating, the big blue screens, an advising desk)
function cchInt(){const I=mkInt('cch',40,28,{name:'Clifton Court Hall · Commons',floor:'wood',wall:0xe9e6df,low:0x3b4046});
  {const s=new THREE.Mesh(bgeo(12,3.2,.15),bm(0x2f5fd8));s.position.set(I.x0+20,3.1,I.z0+.32);sc.add(s);const t=signMesh('CLIFTON COURT HALL · ARTS & SCIENCES',11,.9,'#2f5fd8','#eef4ff','Archivo');t.position.set(I.x0+20,3.1,I.z0+.42);sc.add(t)}
  for(const x of[7,15,25,33])for(const z of[9,15]){ftable(I,x,z,2.4,1.2,0x8a6a44);fchair(I,x-.7,z-1.05,0x2e3236);fchair(I,x+.7,z-1.05,0x2e3236);fchair(I,x-.7,z+1.05,0x2e3236);fchair(I,x+.7,z+1.05,0x2e3236)}
  fsofa(I,3,21,5,'e',0xb06244);fsofa(I,37,21,5,'w',0x5a6470);frug(I,20,21.5,10,4,0x5a6470);fb(I,20,3.2,5,1.2,1.05,0x3b4046);
  for(const[x,z]of[[2,2],[38,2],[2,26],[38,26],[12,21],[28,21]])fplant(I,x,z);
  iobj(I,15,12,'Study for an hour (helps your next class)',()=>{advance(1);S.studied=1;toast('You study in the commons. Your next class will go a little easier.')},1.6);
  iobj(I,20,4.6,'Read the screens',()=>card({title:'Clifton Court Hall',sp:'',text:'The screens cycle through Arts & Sciences events: a poetry reading, a career fair, a lecture on the history of the Harrowgate Herald.\n\nOne slide just says "THE CUBE IS NOT A STUDY ROOM AFTER 11 PM."'}),1.8);
  I.staff.push(['staff',20,2.2,0,{name:'Dana Okafor',title:'Arts & Sciences Advisor',role:'advisor',lvl:3,fem:true,greet:'"Advising is walk-in until four. Which major are you pretending to have?"'}]);return I}
