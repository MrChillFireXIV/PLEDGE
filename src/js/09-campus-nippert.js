// ================================================================ V85 Nippert's edges: the West Pavilion as an all-glass wedge on concrete cores and columns with an open
// concourse under it along the stadium; the steel-truss balcony under the scoreboard from the MainStreet gate to the Lindner Center side;
// and the CRC's wing set down on the ground (columns to the slope, a concrete podium under the overhang)
function wpavGlassTex(){return GC.wpgt||(GC.wpgt=(()=>{const t=ctex(256,256,(q,w,h)=>{const g=q.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2c4f4b');g.addColorStop(1,'#1b3633');q.fillStyle=g;q.fillRect(0,0,w,h);
  for(let x=0;x<w;x+=64)if(rnd()<.45){q.fillStyle=`rgba(255,226,170,${.08+rnd()*.14})`;q.fillRect(x+3,20,58,h-48)}
  q.strokeStyle='rgba(12,22,20,.85)';q.lineWidth=7;q.beginPath();q.moveTo(0,h-24);q.lineTo(w,20);q.stroke();
  q.fillStyle='#0f1d1b';q.fillRect(0,h-26,w,26);q.fillStyle='#4f6e69';q.fillRect(0,h-28,w,3);
  q.fillStyle='#8fa6a2';for(let x=0;x<w;x+=64)q.fillRect(x,0,4,h);q.fillStyle='rgba(143,166,162,.5)';for(let x=32;x<w;x+=64)q.fillRect(x,0,2,h-26);
  q.fillStyle='rgba(255,255,255,.07)';q.beginPath();q.moveTo(0,0);q.lineTo(w*.45,0);q.lineTo(0,h*.6);q.fill()});t.wrapS=t.wrapT=THREE.RepeatWrapping;return SM({map:t,roughness:.18,metalness:.35,side:THREE.DoubleSide})})())}
const WPPOLY=[[351.66,386.81],[350.36,380.7],[350.31,374.51],[351.14,369.77],[353.21,361.93],[378.46,309.97],[375.33,309.88],[375.45,309.4],[363.79,309.3],[352.36,332.74],[342.42,353.9],[339.37,361.15],[337.9,368.13],[337.21,374.02],[337.48,381.3],[338.97,390.61],[342.98,399.22],[352.19,395.33],[349.55,389.69],[348.86,387.64]];
function polyNormals(p){const n=p.length,E=[];for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;let nx=(b[1]-a[1])/L,nz=-(b[0]-a[0])/L;if(inPoly((a[0]+b[0])/2+nx*.25,(a[1]+b[1])/2+nz*.25,p)){nx=-nx;nz=-nz}E.push([nx,nz])}
  return p.map((_,i)=>{const e0=E[(i+n-1)%n],e1=E[i];let x=e0[0]+e1[0],z=e0[1]+e1[1];const l=Math.hypot(x,z)||1;x/=l;z/=l;const c=Math.max(.5,x*e1[0]+z*e1[1]);return[x/c,z/c]})}
function capMesh(ring,y,mat){const v2=ring.map(([x,z])=>new THREE.Vector2(x,z)),tri=THREE.ShapeUtils.triangulateShape(v2,[]),A=[];for(const t of tri)for(const k of t)A.push(ring[k][0],y,ring[k][1]);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A,3));const N=new Float32Array(A.length);for(let i=1;i<N.length;i+=3)N[i]=1;g.setAttribute('normal',new THREE.BufferAttribute(N,3));
  {const U=new Float32Array(A.length/3*2);for(let i=0,j=0;i<A.length;i+=3,j+=2){U[j]=A[i]/1.5;U[j+1]=A[i+2]/1.5}g.setAttribute('uv',new THREE.BufferAttribute(U,2))}mat.side=THREE.DoubleSide;const m=new THREE.Mesh(g,mat);m.receiveShadow=true;sc.add(m);return m}
function loft(A,B,ya,yb,mat,uw,vh){const P=[],U=[],n=A.length;let s=0;for(let i=0;i<n;i++){const j=(i+1)%n,L=Math.hypot(A[j][0]-A[i][0],A[j][1]-A[i][1]);const a=[A[i][0],ya,A[i][1]],b=[A[j][0],ya,A[j][1]],c=[B[j][0],yb,B[j][1]],d=[B[i][0],yb,B[i][1]];
    P.push(...a,...b,...c,...a,...c,...d);const u0=s/uw,u1=(s+L)/uw,v0=ya/vh,v1=yb/vh;U.push(u0,v0,u1,v0,u1,v1,u0,v0,u1,v1,u0,v1);s+=L}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;sc.add(m);return m}
// West Pavilion: built in the building loop (heights relative to its level lv; the loop lifts everything by lv)
function wpavX(b,p,h){const lv=terrH(b.fp[0]+b.fn[0]*1.6,b.fp[1]+b.fn[1]*1.6),Y0=7.2,YT=h-.4,N=polyNormals(p),SV=[STAD.vx,STAD.vz];
  const lean=p.map((_,i)=>{const[nx,nz]=N[i];return nx*SV[0]+nz*SV[1]>.35||nz<-.55?3.4:.25});
  const BOT=p.map(([x,z],i)=>[x-N[i][0]*.5,z-N[i][1]*.5]),TOP=p.map(([x,z],i)=>[x+N[i][0]*lean[i],z+N[i][1]*lean[i]]),MID=p.map(([x,z],i)=>[x+N[i][0]*lean[i]*.55,z+N[i][1]*lean[i]*.55]);
  const GLS=wpavGlassTex(),CON=SM({color:0xc9c3b6,roughness:.9}),SOF=SM({color:0xd8d3c8,roughness:.85,side:THREE.DoubleSide}),RF=SM({color:0x41464b,roughness:.8});
  // the glass wedge: the lower suites step out, the top levels lean out over the stands and the north plaza
  loft(BOT,MID,Y0,Y0+(YT-Y0)*.5,GLS,7.2,4.2);loft(MID,TOP,Y0+(YT-Y0)*.5,YT,GLS,7.2,4.2);
  capMesh(BOT,Y0,SOF,false);capMesh(TOP,YT,RF,true);
  // dark spandrel slab at the base of the glass, the white roof slab projecting past the top
  {const S2=BOT.map(([x,z],i)=>[x+N[i][0]*.35,z+N[i][1]*.35]);loft(S2,S2,Y0-.55,Y0+.05,SM({color:0x24302e,roughness:.6}),8,8)}
  {const R1=TOP.map(([x,z],i)=>[x+N[i][0]*.9,z+N[i][1]*.9]);loft(R1,R1,YT,YT+.7,SM({color:0xeceae5,roughness:.7}),8,8);capMesh(R1,YT+.7,SM({color:0xd9d6cf}),true)}
  // downlights in the soffit over the concourse
  {const[x0,z0,x1,z1]=bbox(BOT);for(let x=x0+2;x<x1;x+=5)for(let z=z0+2;z<z1;z+=6)if(inPoly(x,z,BOT)){const d=new THREE.Mesh(GC.dl2||(GC.dl2=new THREE.CircleGeometry(.2,10)),bm(0xfff1d2));d.rotation.x=PI/2;d.position.set(x,Y0-.01,z);sc.add(d)}}
  // round concrete columns round the edge every ~9 m, from the ground to the soffit
  {let carry=4;for(let i=0;i<BOT.length;i++){const a=BOT[i],c=BOT[(i+1)%BOT.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]);let t=carry;for(;t<L;t+=9){const f=t/L,x=a[0]+(c[0]-a[0])*f-N[i][0]*.6,z=a[1]+(c[1]-a[1])*f-N[i][1]*.6;if(!inPoly(x,z,p)||!wpKeepCol(x,z))continue;
      const g=terrH(x,z)-lv-.2,H=Y0-g;const m=new THREE.Mesh(GC.wpc||(GC.wpc=new THREE.CylinderGeometry(.45,.5,1,16)),CON);m.scale.y=H;m.position.set(x,g+H/2,z);m.castShadow=true;sc.add(m);markC(x,z,.5,9)}carry=t-L}}
  NOTREE.push([337,309,380,400])}
function boardTex(){if(GC.bdt)return GC.bdt;const t=ctex(128,128,(q,w,h)=>{q.fillStyle='#b9b3a7';q.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){q.fillStyle=shade('#b2ac9f',rnd()*14-7);q.fillRect(0,y,w,7);q.fillStyle='rgba(80,74,64,.25)';q.fillRect(0,y+7,w,1)}});t.wrapS=t.wrapT=THREE.RepeatWrapping;return GC.bdt=t}
// CRC: the colonnade's columns reach the slope, and the wing that hangs over the stadium corner sits on a concrete podium with a paved top
function crcGround(b,p){const lv=b.lvo!=null?b.lvo:terrH(b.fp[0]+b.fn[0]*1.6,b.fp[1]+b.fn[1]*1.6),GY=terrH(377.4,302.2)+.04,PY=GY-lv,pb=gpoly(b.pb),CON=SM({color:0xd6d2c8,roughness:.85}),PAV=slabMat();
  for(const[x,z]of b.cols||[]){const g=terrH(x,z)-lv-.3;if(g<-.05){const m=new THREE.Mesh(GC.crcc||(GC.crcc=new THREE.CylinderGeometry(1.1,1.1,1,20)),CON);m.scale.y=-g+.05;m.position.set(x,g/2,z);m.castShadow=true;sc.add(m)}}
  const rings=[p,...(b.up||[]).map(r=>gpoly(r[0]))];
  for(const r of rings){const n=r.length,Pw=[],U=[];let any=false;
    for(let i=0;i<n;i++){const a=r[i],c=r[(i+1)%n],L=Math.hypot(c[0]-a[0],c[1]-a[1]),k=Math.max(1,Math.ceil(L/1.5));for(let j=0;j<k;j++){const x0=a[0]+(c[0]-a[0])*j/k,z0=a[1]+(c[1]-a[1])*j/k,x1=a[0]+(c[0]-a[0])*(j+1)/k,z1=a[1]+(c[1]-a[1])*(j+1)/k;
        if(inPoly((x0+x1)/2,(z0+z1)/2,pb))continue;const g0=terrH(x0,z0)-lv,g1=terrH(x1,z1)-lv;if(g0>-.4&&g1>-.4)continue;any=true;
        Pw.push(x0,g0-.4,z0,x1,g1-.4,z1,x1,PY,z1,x0,g0-.4,z0,x1,PY,z1,x0,PY,z0);U.push(0,g0/3,1,g1/3,1,0,0,g0/3,1,0,0,0)}}
    if(!any)continue;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Pw,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();
    const m=new THREE.Mesh(g,SM({map:boardTex(),roughness:.9,side:THREE.DoubleSide}));m.castShadow=m.receiveShadow=true;sc.add(m);
    // the podium top: paving at plaza level, walkable as an area deck
    const sub=[];const[x0,z0,x1,z1]=bbox(r);let low=0;for(let x=x0+1;x<x1;x+=2)for(let z=z0+1;z<z1;z+=2)if(inPoly(x,z,r)&&!inPoly(x,z,pb)&&terrH(x,z)-lv<-.4)low++;
    if(low>3){capMesh(r,PY,PAV,true);CRCPOD.push({poly:r,y:GY})}}}
const CRCPOD=[];
function crcPodDecks(){for(const{poly,y}of CRCPOD){const[x0,z0,x1,z1]=bbox(poly),cx=(x0+x1)/2,cz=(z0+z1)/2;DECKS.push({area:{poly,holes:[gpoly(UCD.B.find(u=>u.s==='crc').pb)]},P:[[cx,cz],[cx+.1,cz]],ys:[y,y],s:[0,2],L:2,hw:99,w:198,k:'area',bb:[x0,z0,x1,z1],t0:0,t1:2,y})}}
// the balcony under the scoreboard: hung off the CRC's stadium wall (no legs in the bowl), high over the north bleachers, from the north-west
// gate (MainStreet) to the east concourse by Lindner Center
let NIPW=[];
function nipWalk(){const u_=UCD.B.find(u=>u.s==='crc'),R=[gpoly(u_.pb),gpoly(u_.p[0]),...(u_.up||[]).map(r=>gpoly(r[0]))],inC=(x,z)=>R.some(r=>inPoly(x,z,r));
  const W=[];for(let v=-36;v<=36;v+=3){let uw=null;for(let u=26;u<100;u+=.25){const[x,z]=fromField(u,v);if(inC(x,z)){uw=u;break}}if(uw!=null)W.push([uw,v])}
  const Wm=W.map((p,i)=>[Math.min(p[0],(W[Math.max(0,i-1)][0]+p[0]*2+W[Math.min(W.length-1,i+1)][0])/4),p[1]]);
  NIPW=[[37,-42.2],...Wm.map(([u,v])=>[u-1.45,v]),[47.5,38.5],[44,43.5]];
  const P=NIPW.map(([u,v])=>fromField(u,v)),n=P.length,Yw=terrH(P[0][0],P[0][1])+.04,ys=P.map((p,i)=>i===n-1?terrH(p[0],p[1])+.04:Yw);
  const d=deckMk(P,ys,3.2,'wk');d.nip=1;
  // steel brackets from the deck's outer edge back up into the CRC wall
  const ST=SM({color:0x8b9095,roughness:.55,metalness:.4}),beam=(a,c,t)=>{const dx=c[0]-a[0],dy=c[1]-a[1],dz=c[2]-a[2],L=Math.hypot(dx,dy,dz);const m=new THREE.Mesh(GC.stb||(GC.stb=new THREE.BoxGeometry(1,1,1)),ST);m.scale.set(t,t,L);m.position.set((a[0]+c[0])/2,(a[1]+c[1])/2,(a[2]+c[2])/2);m.lookAt(c[0],c[1],c[2]);m.castShadow=true;m.userData.ts=1;sc.add(m)};
  for(let t=4;t<d.L-6;t+=6){const[x,z]=deckPt(d,t),y=deckY(d,t),[xa,za]=deckPt(d,Math.min(d.L,t+.5)),l=Math.hypot(xa-x,za-z)||1;let nx=-(za-z)/l,nz=(xa-x)/l;if(!inC(x+nx*2.4,z+nz*2.4)){nx=-nx;nz=-nz}if(!inC(x+nx*2.4,z+nz*2.4))continue;
    const ox=x-nx*1.5,oz=z-nz*1.5,wx=x+nx*1.9,wz=z+nz*1.9;beam([ox,y-.55,oz],[wx,y-.55,wz],.2);beam([ox,y-.6,oz],[wx,y-2.6,wz],.16)}}
// along the concourse under the West Pavilion the stands' back wall becomes a steel picket railing, so the field is open to the walkway
// ================================================================ V90 Nippert West Pavilion: the covered concourse along the stadium
// The ground floor of the West Pavilion is a flat concourse at the top of the west stand: stadium columns and a picket rail on the field side,
// a long plaque-and-mural wall on the TUC side, a concrete canopy over it, a red painted line, carts, bollards and a parked van. Stairs run
// down through the stands to the field, and a stair runs down the south end to the SW gate.
function wpKeepCol(x,z){if(inPoly(x,z,WPDECK))return false;const r=wpStandRing();if(r.length>2&&inPoly(x,z,r))return false;
  const[a,b]=WPSS,vx=b[0]-a[0],vz=b[1]-a[1],t=clamp(((x-a[0])*vx+(z-a[1])*vz)/(vx*vx+vz*vz),0,1);return Math.hypot(x-a[0]-vx*t,z-a[1]-vz*t)>3}
// polyline offset to its west side (the polylines run north to south), mitred
function wpOff(P,d){return P.map((p,i)=>{const sg=[];if(i>0)sg.push([p[0]-P[i-1][0],p[1]-P[i-1][1]]);if(i<P.length-1)sg.push([P[i+1][0]-p[0],P[i+1][1]-p[1]]);let nx=0,nz=0;for(const[dx,dz]of sg){const l=Math.hypot(dx,dz)||1;nx+=-dz/l;nz+=dx/l}const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;
  let c=1;if(sg.length>1){const l0=Math.hypot(sg[0][0],sg[0][1])||1;c=Math.max(.5,nx*(-sg[0][1]/l0)+nz*(sg[0][0]/l0))}return[p[0]+nx*d/c,p[1]+nz*d/c]})}
// gaps in the stand rail where the aisle stairs start
function wpGapsFor(x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0)||1,ux=(x1-x0)/L,uz=(z1-z0)/L,G=[];for(const a of WPAIS){const s=(a.x-x0)*ux+(a.z-z0)*uz;if(Math.hypot(a.x-(x0+ux*s),a.z-(z0+uz*s))<1.2&&s>-1.8&&s<L+1.8)G.push([s-1.8,s+1.8])}return G}
function wpFree(L,gaps){let f=[[0,L]];for(const[g0,g1]of gaps||[]){const n=[];for(const[a,b]of f){if(g1<=a||g0>=b){n.push([a,b]);continue}if(g0>a)n.push([a,g0]);if(g1<b)n.push([g1,b])}f=n}return f}
// steel picket rail with openings
function railRun(x0,z0,x1,z1,top,gaps){const L=Math.hypot(x1-x0,z1-z0)||1,ux=(x1-x0)/L,uz=(z1-z0)/L;
  const RM=GC.nrm||(GC.nrm=SM({color:0x3a3f45,roughness:.5,metalness:.4})),ry=Math.atan2(-(z1-z0),x1-x0),F=wpFree(L,gaps),P=[];
  for(const[a,b]of F){const l=b-a;if(l<.05)continue;const mx=x0+ux*(a+b)/2,mz=z0+uz*(a+b)/2;
    for(const[y,t]of[[top+1.05,.07],[top+.12,.06]]){const r=new THREE.Mesh(bgeo(l,t,t),RM);r.position.set(mx,y,mz);r.rotation.y=ry;r.userData.ts=1;sc.add(r)}
    const n=Math.max(1,Math.round(l/.14));for(let i=0;i<=n;i++)P.push([x0+ux*(a+l*i/n),z0+uz*(a+l*i/n)]);
    for(const e of[a,b]){if(e>.01&&e<L-.01){const p=new THREE.Mesh(bgeo(.09,1.2,.09),RM);p.position.set(x0+ux*e,top+.6,z0+uz*e);p.userData.ts=1;sc.add(p)}}}
  if(!P.length)return;const im=new THREE.InstancedMesh(GC.nrp||(GC.nrp=new THREE.BoxGeometry(.025,.95,.025)),RM,P.length),m=new THREE.Matrix4();
  P.forEach(([x,z],i)=>{m.makeTranslation(x,top+.58,z);im.setMatrixAt(i,m)});im.userData.ts=1;sc.add(im)}
// along the concourse under the West Pavilion the stands' back wall becomes a steel picket railing, so the field is open to the walkway
function nipRailSeg(x0,z0,x1,z1,top){const L=Math.hypot(x1-x0,z1-z0)||1,mx=(x0+x1)/2,mz=(z0+z1)/2,nx=-(z1-z0)/L,nz=(x1-x0)/L;
  if(!(inPoly(mx,mz,WPPOLY0)||inPoly(mx+nx*4,mz+nz*4,WPPOLY0)||inPoly(mx-nx*4,mz-nz*4,WPPOLY0)))return false;
  railRun(x0,z0,x1,z1,top,wpGapsFor(x0,z0,x1,z1));return true}
function wpPlaqueMat(){return GC.wpq||(GC.wpq=(()=>{const t=ctex(1024,512,(q,w,h)=>{q.fillStyle='#d9d1bd';q.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=9){q.fillStyle=shade('#d4ccb8',rnd()*10-5);q.fillRect(0,y,w,8);q.fillStyle='rgba(90,80,62,.12)';q.fillRect(0,y+8,w,1)}
  for(let x=0;x<w;x+=128){q.fillStyle='rgba(70,62,48,.18)';q.fillRect(x,0,2,h)}
  let y=130;for(let r=0;r<5;r++){let x=20+rnd()*30;const ph=34+rnd()*14;while(x<w-90){const pw=70+rnd()*90;if(x+pw>w-10)break;q.fillStyle='#ece9df';q.fillRect(x,y,pw,ph);q.strokeStyle='rgba(60,56,48,.55)';q.lineWidth=2;q.strokeRect(x,y,pw,ph);q.fillStyle='rgba(70,70,76,.55)';for(let l=0;l<3;l++)q.fillRect(x+6,y+7+l*9,(pw-12)*(.5+rnd()*.5),3);x+=pw+10+rnd()*14}y+=ph+14}
  const g=q.createLinearGradient(0,0,0,70);g.addColorStop(0,'rgba(255,236,170,.6)');g.addColorStop(1,'rgba(255,236,170,0)');q.fillStyle=g;q.fillRect(0,0,w,70);
  const g2=q.createLinearGradient(0,h-90,0,h);g2.addColorStop(0,'rgba(40,36,30,0)');g2.addColorStop(1,'rgba(40,36,30,.35)');q.fillStyle=g2;q.fillRect(0,h-90,w,90)});
  return SM({map:t,roughness:.9,emissive:0x40382a,side:THREE.DoubleSide})})())}
function wpMuralTex(){return GC.wpm||(GC.wpm=cvTex(512,256,(q,w,h)=>{q.clearRect(0,0,w,h);q.lineCap='round';q.lineJoin='round';
  const L=(w2,c,pts)=>{q.strokeStyle=c;q.lineWidth=w2;q.beginPath();pts.forEach(([x,y],i)=>i?q.lineTo(x,y):q.moveTo(x,y));q.stroke()};
  for(const[c,o]of[['rgba(120,112,160,.55)',6],['rgba(222,216,242,.95)',0]]){L(34,c,[[225+o,72+o],[200+o,132+o]]);L(16,c,[[225+o,86+o],[285+o,104+o],[335+o,84+o]]);L(16,c,[[222+o,86+o],[178+o,98+o],[146+o,128+o]]);
    L(24,c,[[200+o,132+o],[252+o,166+o],[262+o,218+o]]);L(22,c,[[200+o,132+o],[150+o,160+o],[96+o,178+o]]);q.fillStyle=c;q.beginPath();q.arc(246+o,44+o,21,0,TAU);q.fill();q.beginPath();q.ellipse(346+o,76+o,20,11,-.4,0,TAU);q.fill()}}))}
function wpSignMat(txt){const k='wps'+txt;return GC[k]||(GC[k]=new THREE.MeshLambertMaterial({map:cvTex(128,80,(q,w,h)=>{q.fillStyle='#f4f1e8';q.fillRect(0,0,w,h);q.fillStyle='#1d2a44';q.fillRect(0,0,w,14);q.fillStyle='#1d2a44';q.font='bold 46px Arial,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(txt,w/2,50)}),emissive:0x2a2a28}))}

// ================================================================ V92 traffic cones along the campus roads, for the Cone Pledge
let CONES=[],CONEPOOL=null;
function coneInit(D){const hs=(x,z)=>{const v=Math.sin(x*12.9898+z*78.233)*43758.5453;return v-Math.floor(v)},cand=[];
  for(const r of D.roads){if(r.w<3.6||r.pts.length<2)continue;let acc=10,side=1;for(let i=0;i<r.pts.length-1;i++){const[a,b]=r.pts[i],[c,d]=r.pts[i+1],L=Math.hypot(c-a,d-b)||1e-6,nx=-(d-b)/L,nz=(c-a)/L;
      while(acc<L){const t=acc/L,x=a+(c-a)*t+nx*side*(r.w/2+.6),z=b+(d-b)*t+nz*side*(r.w/2+.6);side=-side;acc+=34;if(freeAt(x,z,.4)&&terrH(x,z)>-30)cand.push([x,z,hs(x,z)])}acc-=L}}
  cand.sort((p,q)=>p[2]-q[2]);const pick_=[];for(const c of cand){if(pick_.length>=40)break;if(pick_.every(p=>Math.hypot(p[0]-c[0],p[1]-c[1])>60))pick_.push(c)}
  const OR=SM({color:0xff6a1a,roughness:.6}),WH=mt(0xf6f2e8,.6),BK=mt(0x2a2a30,.7),G1=new THREE.ConeGeometry(.2,.62,14),G2=new THREE.CylinderGeometry(.12,.145,.1,14),G3=new THREE.BoxGeometry(.46,.04,.46);
  for(const[x,z]of pick_){const g=new THREE.Group();g.position.set(x,terrH(x,z),z);g.rotation.y=hs(z,x)*6;const A=(geo,m,y)=>{const e=new THREE.Mesh(geo,m);e.position.y=y;e.castShadow=true;e.userData.ts=1;g.add(e)};A(G3,BK,.02);A(G1,OR,.35);A(G2,WH,.36);sc.add(g);CONES.push({x,z,m:g,gD:-1})}}
function coneGrab(c){const r=RS(),first=r.cnD!==S.day;c.gD=S.day;c.m.visible=false;r.cnD=S.day;r.cnN=(r.cnN||0)+1;sfx('ok');noise(.05,.1,2500);
  if(first){gainXP(10);money(.5);stand(1);big('CONE GET',1000);toast('Snagged a traffic cone. Andre will want to see it at roll call. +10 XP.',3200)}else toast('Another cone. Your room is going to look great. ('+r.cnN+' total)',2200);
  if(NP.some(m=>m.auth&&m.dp<18&&canSee(m,18))){trouble(20);toast('Campus police saw you take that cone!',2600)}prApply()}
