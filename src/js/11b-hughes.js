// ================================================================ V122 the old school building, V129 the Hughes Correctional Institute (fictional; Tudor / Collegiate Gothic)
// Built from the Hughes data pack: the OSM footprint (relation 1059640) un-rotated by 4.86° so the front faces due east, LiDAR roof
// heights (main block 19-21 m, tower 42 m with turret domes to 46 m), the 1913 plans (hollow rectangle: front, side and rear ranges round an
// assembly hall flanked by two open courts) and the photos (dark red-brown brick, cream terracotta trim, red hip roofs behind crenellated
// parapets, curved gable pavilions, a square tower with four octagonal domed turrets, an oriel, the inscription band and gargoyles).
// Nothing on the walls is painted on: every window is a real opening in the brick skin with glass set back in the reveal, and the
// sills, hoods, string courses, cornices, parapets, merlons, pinnacles and gargoyles are geometry.
// Building frame: u = metres east, v = metres north (from the footprint's own origin). World x = HU.X + u, z = HU.Z - v.
// It sits in the south-west corner of the map (west of the Greek Row road, south of Calhoun St). The rear wings run past the
// world's west edge, where they are scenery only.
const HU={X:-12,Z:645};
const huX=u=>HU.X+u,huZ=v=>HU.Z-v;
let HA=null;   // geometry accumulators, one per material, while building
function huAcc(){return{p:[],n:[],t:[]}}
// one axis-aligned face of a world box; uv in world metres / 2 (textures are 2 m tiles)
function huFace(A,k,x0,y0,z0,x1,y1,z1){const s=.5;let P,N,U;
  if(k==='px'){P=[[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]];N=[1,0,0];U=P.map(q=>[-q[2]*s,q[1]*s])}
  else if(k==='nx'){P=[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]];N=[-1,0,0];U=P.map(q=>[q[2]*s,q[1]*s])}
  else if(k==='pz'){P=[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];N=[0,0,1];U=P.map(q=>[q[0]*s,q[1]*s])}
  else if(k==='nz'){P=[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]];N=[0,0,-1];U=P.map(q=>[-q[0]*s,q[1]*s])}
  else if(k==='py'){P=[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]];N=[0,1,0];U=P.map(q=>[q[0]*s,-q[2]*s])}
  else{P=[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]];N=[0,-1,0];U=P.map(q=>[q[0]*s,q[2]*s])}
  for(const i of[0,1,2,0,2,3]){A.p.push(P[i][0],P[i][1],P[i][2]);A.n.push(N[0],N[1],N[2]);A.t.push(U[i][0],U[i][1])}}
function huBoxW(A,x0,y0,z0,x1,y1,z1,skip){if(x1-x0<1e-4||y1-y0<1e-4||z1-z0<1e-4)return;for(const k of['px','nx','py','ny','pz','nz'])if(!skip||skip.indexOf(k)<0)huFace(A,k,x0,y0,z0,x1,y1,z1)}
// facades: F={ax:'u'|'v', w: wall plane coordinate, s: outward sign}. Facade coords: t along the wall (= v for 'u' walls, u for 'v' walls),
// y up, d outward from the wall plane (the brick skin is d -0.45..0)
function huAABB(F,t0,t1,y0,y1,d0,d1){const a=F.w+F.s*d0,b=F.w+F.s*d1;let u0,u1,v0,v1;
  if(F.ax==='u'){u0=Math.min(a,b);u1=Math.max(a,b);v0=Math.min(t0,t1);v1=Math.max(t0,t1)}else{v0=Math.min(a,b);v1=Math.max(a,b);u0=Math.min(t0,t1);u1=Math.max(t0,t1)}
  return[huX(u0),y0,huZ(v1),huX(u1),y1,huZ(v0)]}
const huBack=F=>F.ax==='u'?(F.s>0?'nx':'px'):(F.s>0?'pz':'nz'),huOut=F=>F.ax==='u'?(F.s>0?'px':'nx'):(F.s>0?'nz':'pz');
function huB(A,F,t0,t1,y0,y1,d0,d1){const b=huAABB(F,t0,t1,y0,y1,d0,d1);huBoxW(A,b[0],b[1],b[2],b[3],b[4],b[5],huBack(F))}
function huQ(A,F,t0,t1,y0,y1,d){const b=huAABB(F,t0,t1,y0,y1,d,d);huFace(A,huOut(F),b[0],b[1],b[2],b[3],b[4],b[5])}
// a skin with rectangular openings: split into horizontal bands at every opening edge and fill the gaps along t
function huWall(A,F,a0,a1,y0,y1,holes,d0=-.45,d1=0){const ys=new Set([y0,y1]);for(const h of holes){if(h[2]>y0&&h[2]<y1)ys.add(h[2]);if(h[3]>y0&&h[3]<y1)ys.add(h[3])}
  const Y=[...ys].sort((a,b)=>a-b);for(let i=0;i<Y.length-1;i++){const ya=Y[i],yb=Y[i+1];if(yb-ya<1e-3)continue;const cov=holes.filter(h=>h[2]<=ya+1e-4&&h[3]>=yb-1e-4).map(h=>[h[0],h[1]]).sort((a,b)=>a[0]-b[0]);
    let t=a0;for(const[c0,c1]of cov){if(c0>t+1e-3)huB(A,F,t,Math.min(c0,a1),ya,yb,d0,d1);t=Math.max(t,c1)}if(t<a1-1e-3)huB(A,F,t,a1,ya,yb,d0,d1)}}
// any THREE geometry into an accumulator (world uv by dominant normal; mirrored transforms get their winding flipped)
const _hv=new THREE.Vector3(),_hn=new THREE.Vector3();
function huAdd(A,geo,m,flat){let g=geo.index?geo.toNonIndexed():geo;if(flat||!g.attributes.normal)g.computeVertexNormals();const P=g.attributes.position,N=g.attributes.normal,nm=new THREE.Matrix3().getNormalMatrix(m),ord=m.determinant()<0?[0,2,1]:[0,1,2];
  for(let i=0;i+2<P.count;i+=3)for(const k of ord){_hv.fromBufferAttribute(P,i+k).applyMatrix4(m);_hn.fromBufferAttribute(N,i+k).applyMatrix3(nm).normalize();A.p.push(_hv.x,_hv.y,_hv.z);A.n.push(_hn.x,_hn.y,_hn.z);
    const ax=Math.abs(_hn.x),ay=Math.abs(_hn.y),az=Math.abs(_hn.z);A.t.push((ay>=ax&&ay>=az?_hv.x:ax>=az?_hv.z:_hv.x)*.5,(ay>=ax&&ay>=az?_hv.z:_hv.y)*.5)}}
// the matrix that puts a shape drawn in facade (t, y) coords, extruded along +Z, onto facade F starting at depth d0
function huFM(F,d0){const m=new THREE.Matrix4();if(F.ax==='u'){m.makeBasis(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0),new THREE.Vector3(F.s,0,0));m.setPosition(huX(F.w+F.s*d0),0,HU.Z)}
  else{m.makeBasis(new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,-F.s));m.setPosition(HU.X,0,huZ(F.w+F.s*d0))}return m}
function huShape(A,F,sh,d0,depth,curve=10){huAdd(A,new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:curve}),huFM(F,d0))}
// a world-placed primitive: geometry, centre, rotation y, scale
function huPrim(A,geo,x,y,z,ry=0,sx=1,sy=1,sz=1,flat){const m=new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,ry,0)),new THREE.Vector3(sx,sy,sz));huAdd(A,geo,m,flat)}
// ---------------------------------------------------------------- materials: dark red-brown brick, cream terracotta, stone, red standing-seam roof
function huMats(){const T={};
  T.brick=ctex(256,256,(q,w,h)=>{q.fillStyle='#8a7b6c';q.fillRect(0,0,w,h);const C=['#5c2219','#6a281e','#742e22','#62271f','#6f2b24','#57201a','#7c3426'];
    for(let r=0;r<32;r++){const off=(r%2)*16;for(let x=-off;x<w;x+=32){q.fillStyle=C[Math.floor(rnd()*C.length)];q.fillRect(x+1,r*8+1,30,6);if(rnd()<.25){q.fillStyle='rgba(20,8,6,.25)';q.fillRect(x+1,r*8+1,30,6)}}}
    for(let i=0;i<900;i++){q.fillStyle=rnd()<.5?'rgba(0,0,0,.08)':'rgba(255,220,200,.05)';q.fillRect(rnd()*w,rnd()*h,2,1)}});
  T.cream=ctex(256,256,(q,w,h)=>{q.fillStyle='#e6d8a8';q.fillRect(0,0,w,h);for(let i=0;i<1600;i++){q.fillStyle=rnd()<.5?'rgba(120,100,50,.06)':'rgba(255,255,240,.08)';q.fillRect(rnd()*w,rnd()*h,3,2)}
    q.fillStyle='rgba(150,130,80,.35)';for(let y=0;y<h;y+=64)q.fillRect(0,y,w,1.5);for(let y=0;y<h;y+=64)for(let x=((y/64)%2)*48;x<w;x+=96)q.fillRect(x,y,1.5,64)});
  T.stone=ctex(128,128,(q,w,h)=>{q.fillStyle='#cdc4ae';q.fillRect(0,0,w,h);for(let i=0;i<700;i++){q.fillStyle=rnd()<.5?'rgba(0,0,0,.07)':'rgba(255,255,255,.07)';q.fillRect(rnd()*w,rnd()*h,2,2)}q.fillStyle='rgba(0,0,0,.18)';q.fillRect(0,0,w,1);q.fillRect(0,64,w,1);q.fillRect(0,0,1,64);q.fillRect(64,64,1,64)});
  T.roof=ctex(128,128,(q,w,h)=>{q.fillStyle='#7e2a1f';q.fillRect(0,0,w,h);for(let x=0;x<w;x+=16){q.fillStyle='#96392b';q.fillRect(x,0,2,h);q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x+2,0,1,h)}for(let i=0;i<300;i++){q.fillStyle='rgba(0,0,0,.06)';q.fillRect(rnd()*w,rnd()*h,3,3)}});
  const glL=SM({color:0x2c3b48,emissive:0xffcf8a,emissiveIntensity:0,roughness:.18,metalness:.2});FMLIST.push(glL);
  const lamp=SM({color:0xfff1cf,emissive:0xffd08a,emissiveIntensity:0,roughness:.3});FMLIST.push(lamp);
  return{brick:SM({map:T.brick,roughness:.9}),cream:SM({map:T.cream,roughness:.62}),stone:SM({map:T.stone,roughness:.9}),glass:SM({color:0x24323e,roughness:.1,metalness:.35}),glassL:glL,
    roof:SM({map:T.roof,roughness:.68,metalness:.12}),flat:SM({color:0x3b3e44,roughness:.95}),door:SM({color:0xc2652a,roughness:.45}),dark:SM({color:0x16181b,roughness:.85}),metal:SM({color:0x1c1e22,roughness:.4,metalness:.6}),lamp}}
// ---------------------------------------------------------------- windows
// a group of nl lights in one terracotta surround: the opening (incl. surround) is cut out of the skin; glass sits 0.4 m back in the reveal
// with mullions and a transom in front of it; Tudor hood mould with label stops over the top, projecting sill below
function huWin(F,t0,t1,y0,y1,nl,holes,o={}){const fw=o.base?.14:.22,lit=rnd()<(o.base?.12:.3),G=lit?HA.glassL:HA.glass,dw=(t1-t0)/nl;
  holes.push([t0-fw,t1+fw,y0-.18,y1+fw]);
  if(o.mid){huQ(G,F,t0,t1,y0,o.mid[0],-.4);huQ(G,F,t0,t1,o.mid[1],y1,-.4);huB(HA.cream,F,t0,t1,o.mid[0],o.mid[1],-.45,-.02);for(let k=0;k<nl;k++){const tc=t0+dw*(k+.5);huB(HA.cream,F,tc-.24,tc+.24,o.mid[0]+.25,o.mid[1]-.25,-.02,.08);huB(HA.cream,F,tc-.12,tc+.12,o.mid[0]+.12,o.mid[0]+.25,-.02,.06)}}
  else huQ(G,F,t0,t1,y0,y1,-.4);
  for(let k=1;k<nl;k++){const t=t0+dw*k;huB(HA.cream,F,t-.09,t+.09,y0,y1,-.43,-.1)}
  for(const[a,b]of o.mid?[[y0,o.mid[0]],[o.mid[1],y1]]:[[y0,y1]])if(b-a>2&&!o.base){const ty=a+(b-a)*.74;huB(HA.cream,F,t0,t1,ty-.07,ty+.07,-.43,-.12)}
  huB(HA.cream,F,t0-fw,t0,y0,y1,-.45,.07);huB(HA.cream,F,t1,t1+fw,y0,y1,-.45,.07);huB(HA.cream,F,t0-fw,t1+fw,y1,y1+fw,-.45,.07);
  if(!o.base&&!o.noHood){const e=fw+.16;huB(HA.cream,F,t0-e,t1+e,y1+fw,y1+fw+.15,-.45,.17);huB(HA.cream,F,t0-e,t0-fw,y1+fw-.45,y1+fw,-.45,.17);huB(HA.cream,F,t1+fw,t1+e,y1+fw-.45,y1+fw,-.45,.17)}
  huB(HA.cream,F,t0-fw-.1,t1+fw+.1,y0-.18,y0,-.45,.2)}
// ---------------------------------------------------------------- the 1910 block's facade, as in the photos: stone plinth; raised basement;
// cream water table; three tall storeys of 3-4-light groups between brick piers, cream string courses at every floor; frieze with a corbel
// table; cream cornice and crenellated parapet; cream pinnacles on the piers with a gargoyle under each; pavilions get one tall terracotta frame
// over the 2nd and 3rd floors and a curved gable with a carved crest
const HL={pl:.45,b:[.8,2.05],wt:[2.3,2.7],f:[[3.25,6.35],[7.75,10.85],[12.25,15.25]],sc:[[6.95,7.25],[11.45,11.75]],fr:16.45,top:17.9};
let HGARG=[];
function huMain(F,a0,a1,o){const W=a1-a0,n=o.n,holes=[],pw=o.pav?1.15:.9,piers=[];
  for(let i=0;i<=n;i++){if((i===0&&!o.pierL)||(i===n&&!o.pierR))continue;piers.push(a0+W*i/n)}
  for(let i=0;i<n;i++){let b0=a0+W*i/n,b1=a0+W*(i+1)/n;b0+=(i>0||o.pierL)?pw/2+.4:.55;b1-=(i<n-1||o.pierR)?pw/2+.4:.55;if(b1-b0<1)continue;const nl=o.nl||(b1-b0>4.6?4:b1-b0>2.6?3:2);
    huWin(F,b0+.2,b1-.2,HL.b[0],HL.b[1],nl,holes,{base:1});huWin(F,b0,b1,HL.f[0][0],HL.f[0][1],nl,holes);
    if(o.pav)huWin(F,b0,b1,HL.f[1][0],HL.f[2][1],nl,holes,{mid:[HL.f[1][1],HL.f[2][0]]});
    else{huWin(F,b0,b1,HL.f[1][0],HL.f[1][1],nl,holes);huWin(F,b0,b1,HL.f[2][0],HL.f[2][1],nl,holes)}}
  const e0=a0-.45,e1=a1+.45;
  huWall(HA.brick,F,a0,a1,HL.pl,HL.fr,holes);huB(HA.stone,F,e0,e1,0,HL.pl,-.45,.12);huB(HA.cream,F,e0,e1,HL.wt[0],HL.wt[1],-.45,.18);
  for(const[y0,y1]of HL.sc)huWall(HA.cream,F,e0,e1,y0,y1,holes,-.45,.12);
  for(const t of piers){huB(HA.brick,F,t-pw/2,t+pw/2,HL.pl,HL.fr,-.45,.25);for(const[y0,y1]of[HL.wt,...HL.sc])huB(HA.cream,F,t-pw/2-.06,t+pw/2+.06,y0,y1,-.45,.32)}
  // frieze corbel table, cornice, parapet
  for(let t=a0+.35;t<a1-.2;t+=.7)huB(HA.cream,F,t-.1,t+.1,15.95,HL.fr,-.45,.2);
  huB(HA.cream,F,e0,e1,HL.fr,16.95,-.45,.42);huB(HA.cream,F,e0,e1,16.95,17.05,-.45,.3);huB(HA.cream,F,e0,e1,17.05,HL.top,-.45,.1);
  for(let t=a0+.5;t<a1-.4;t+=1.6)huB(HA.cream,F,t,t+.24,17.25,17.7,.1,.14);
  const tc=(a0+a1)/2,gw=o.gable?Math.min(4.4,W*.3):0;
  for(let t=a0+.35;t+.7<=a1-.2;t+=1.35){if(o.gable&&t+.7>tc-gw-.3&&t<tc+gw+.3)continue;huB(HA.cream,F,t,t+.7,HL.top,18.55,-.45,.1)}
  if(o.gable)huGable(F,tc,gw);
  for(const t of piers){huB(HA.cream,F,t-.32,t+.32,16.95,19.35,-.25,.45);huPin(F,t,19.35,.48);if(o.garg)HGARG.push({F,t,y:15.35,d:.25,k:0})}
}
// a small square pyramid cap on a pinnacle
function huPin(F,t,y,s){const b=huAABB(F,t,t,y,y,.1,.1),c=new THREE.ConeGeometry(s*.72,s*1.3,4,1);huPrim(HA.cream,c,(b[0]+b[3])/2,y+s*.65,(b[2]+b[5])/2,PI/4,1,1,1,true);
  huPrim(HA.cream,new THREE.SphereGeometry(.09,6,4),(b[0]+b[3])/2,y+s*1.32,(b[2]+b[5])/2)}
// curved (ogee) gable parapet with a cartouche, a shield crest and a finial
function huGable(F,tc,gw){const y0=17.05,s=new THREE.Shape();s.moveTo(tc-gw,y0);s.lineTo(tc-gw,18.35);s.bezierCurveTo(tc-gw*.55,18.35,tc-gw*.62,19.95,tc-.95,20.1);s.lineTo(tc-.95,20.45);s.lineTo(tc+.95,20.45);s.lineTo(tc+.95,20.1);
  s.bezierCurveTo(tc+gw*.62,19.95,tc+gw*.55,18.35,tc+gw,18.35);s.lineTo(tc+gw,y0);s.closePath();huShape(HA.cream,F,s,-.45,.6,12);
  // raised moulding along the curve
  const m=new THREE.Shape();m.moveTo(tc-gw-.12,18.25);m.lineTo(tc-gw-.12,18.5);m.bezierCurveTo(tc-gw*.55,18.5,tc-gw*.62,20.1,tc-.95,20.25);m.lineTo(tc-.95,20.05);m.bezierCurveTo(tc-gw*.62,19.85,tc-gw*.55,18.25,tc-gw-.12,18.25);huShape(HA.cream,F,m,.15,.1,10);
  const m2=new THREE.Shape();m2.moveTo(tc+gw+.12,18.25);m2.lineTo(tc+gw+.12,18.5);m2.bezierCurveTo(tc+gw*.55,18.5,tc+gw*.62,20.1,tc+.95,20.25);m2.lineTo(tc+.95,20.05);m2.bezierCurveTo(tc+gw*.62,19.85,tc+gw*.55,18.25,tc+gw+.12,18.25);huShape(HA.cream,F,m2,.15,.1,10);
  const c=new THREE.Shape();c.absellipse(tc,18.85,Math.min(1.3,gw*.42),.62,0,TAU,false,0);huShape(HA.cream,F,c,.15,.12,16);
  const sh=new THREE.Shape();sh.moveTo(tc-.42,20.45);sh.lineTo(tc-.42,21.05);sh.lineTo(tc+.42,21.05);sh.lineTo(tc+.42,20.45);sh.quadraticCurveTo(tc+.38,20.15,tc,20.0);sh.quadraticCurveTo(tc-.38,20.15,tc-.42,20.45);huShape(HA.cream,F,sh,.12,.16,8);
  huPin(F,tc,21.05,.4);huB(HA.cream,F,tc-.55,tc+.55,20.45,20.6,-.4,.2)}
// ---------------------------------------------------------------- plainer walls (rear ranges, court walls, the later wings): single 2-light
// windows in real openings, a coping on top
function huSimple(F,a0,a1,top,o={}){const holes=[],W=a1-a0,sp=o.sp||3.4,n=Math.max(1,Math.floor((W-.6)/sp)),fl=(o.floors||[[3.25,6.2],[7.75,10.7],[12.25,15]]).filter(f=>f[1]<top-1);
  for(let i=0;i<n;i++){const tc=a0+W*(i+.5)/n,hw=(o.ww||1.5)/2;for(const[y0,y1]of fl)huWin(F,tc-hw,tc+hw,y0,y1,o.nl||2,holes,{noHood:o.hood?0:1})}
  huWall(HA[o.mat||'brick'],F,a0,a1,o.y0||0,top,holes);if(o.wt)huB(HA.cream,F,a0-.45,a1+.45,HL.wt[0],HL.wt[1],-.45,.15);
  if(!o.noTop)huB(HA.cream,F,a0-.45,a1+.45,top,top+.4,-.45,.14)}
// ---------------------------------------------------------------- roofs
function huTri(A,a,b,c){let ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2],nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;if(ny<0){[b,c]=[c,b];nx=-nx;ny=-ny;nz=-nz}
  const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;const ax=Math.abs(nz)>=Math.abs(nx);for(const q of[a,b,c]){A.p.push(q[0],q[1],q[2]);A.n.push(nx,ny,nz);A.t.push((ax?q[0]:q[2])*.5,(ax?q[2]:q[0])*.5+q[1]*.5)}}
// red standing-seam hip roof inside a rectangle of the building frame (eave just behind the parapet); returns the ridge height
function huHip(u0,u1,v0,v1,y,pitch=.6,ins=.35){const x0=huX(u0)+ins,x1=huX(u1)-ins,z0=huZ(v1)+ins,z1=huZ(v0)-ins,w=x1-x0,d=z1-z0,A=HA.roof;let Y;
  if(w>=d){const h=d/2*pitch,r0=x0+d/2,r1=x1-d/2,zc=(z0+z1)/2;Y=y+h;huTri(A,[x0,y,z1],[x1,y,z1],[r1,Y,zc]);huTri(A,[x0,y,z1],[r1,Y,zc],[r0,Y,zc]);huTri(A,[x1,y,z0],[x0,y,z0],[r0,Y,zc]);huTri(A,[x1,y,z0],[r0,Y,zc],[r1,Y,zc]);huTri(A,[x0,y,z0],[x0,y,z1],[r0,Y,zc]);huTri(A,[x1,y,z1],[x1,y,z0],[r1,Y,zc]);
    huBoxW(HA.cream,r0-.1,Y-.05,zc-.09,r1+.1,Y+.08,zc+.09)}
  else{const h=w/2*pitch,r0=z0+w/2,r1=z1-w/2,xc=(x0+x1)/2;Y=y+h;huTri(A,[x1,y,z0],[x1,y,z1],[xc,Y,r1]);huTri(A,[x1,y,z0],[xc,Y,r1],[xc,Y,r0]);huTri(A,[x0,y,z1],[x0,y,z0],[xc,Y,r0]);huTri(A,[x0,y,z1],[xc,Y,r0],[xc,Y,r1]);huTri(A,[x0,y,z0],[x1,y,z0],[xc,Y,r0]);huTri(A,[x1,y,z1],[x0,y,z1],[xc,Y,r1]);
    huBoxW(HA.cream,xc-.09,Y-.05,r0-.1,xc+.09,Y+.08,r1+.1)}
  return Y}
function huFlat(u0,u1,v0,v1,y,mat){huFace(mat||HA.flat,'py',huX(u0)+.3,y,huZ(v1)+.3,huX(u1)-.3,y,huZ(v0)-.3)}
// cylindrical red roof ventilator with a conical cap
function huVent(u,v,y){const x=huX(u),z=huZ(v);huPrim(HA.roof,new THREE.CylinderGeometry(.85,.85,1.5,14),x,y+.75,z);huPrim(HA.roof,new THREE.CylinderGeometry(.95,.95,.16,14),x,y+1.5,z);huPrim(HA.roof,new THREE.ConeGeometry(.9,.55,14),x,y+1.86,z);huPrim(HA.dark,new THREE.CylinderGeometry(.6,.6,.1,12),x,y+.05,z)}
// ---------------------------------------------------------------- the tower: 13.6 m square, front centre, 42 m roof, four octagonal turrets with domes to 46 m
const HT={u0:42.8,u1:56.4,v0:.5,v1:14.2,R:2.0};
// Tudor-arched window: a terracotta tracery screen (lights with round heads, small roundels in the arch) over glass set back in the opening,
// cream spandrels filling the corners above the springing, a hood mould following the arch
function huArchWin(F,t0,t1,yb,ys,ya,n,holes,o={}){const tc=(t0+t1)/2,rx=(t1-t0)/2,ry=ya-ys;holes.push([t0,t1,yb,ya+.06]);
  huQ(rnd()<.35?HA.glassL:HA.glass,F,t0,t1,yb,ya+.06,-.4);
  const out=new THREE.Shape();out.moveTo(t0,yb);out.lineTo(t1,yb);out.lineTo(t1,ys);out.absellipse(tc,ys,rx,ry,0,PI,false,0);out.lineTo(t0,yb);
  const m=.16,g=.14,lw=(t1-t0-2*m-(n-1)*g)/n,top=ys-.15;
  for(let k=0;k<n;k++){const a=t0+m+k*(lw+g),h=new THREE.Path();h.moveTo(a,yb+.16);h.lineTo(a+lw,yb+.16);h.lineTo(a+lw,top);h.absarc(a+lw/2,top,lw/2,0,PI,false);h.lineTo(a,yb+.16);out.holes.push(h)}
  if(ry>1.1)for(let k=-1;k<=1;k++){const cx=tc+k*rx*.36,cy=ys+ry*.62-(k?ry*.06:0),r=Math.min(.28,ry*.2);const h=new THREE.Path();h.absarc(cx,cy,r,0,TAU,false);out.holes.push(h)}
  huShape(HA.cream,F,out,-.3,.3,14);
  const sp=new THREE.Shape();sp.moveTo(t0,ys);sp.lineTo(t0,ya+.06);sp.lineTo(t1,ya+.06);sp.lineTo(t1,ys);sp.absellipse(tc,ys,rx,ry,0,PI,false,0);huShape(HA.cream,F,sp,-.45,.45,14);
  const hd=new THREE.Shape();hd.moveTo(t1+.3,ys);hd.absellipse(tc,ys,rx+.3,ry+.3,0,PI,false,0);hd.lineTo(t0-.3,ys-.5);hd.lineTo(t0-.12,ys-.5);hd.lineTo(t0-.12,ys);hd.absellipse(tc,ys,rx+.12,ry+.12,PI,0,true,0);hd.lineTo(t1+.12,ys-.5);hd.lineTo(t1+.3,ys-.5);hd.lineTo(t1+.3,ys);
  huShape(HA.cream,F,hd,-.05,.22,14);
  huB(HA.cream,F,t0-.12,t0,yb,ys,-.45,.12);huB(HA.cream,F,t1,t1+.12,yb,ys,-.45,.12);huB(HA.cream,F,t0-.35,t1+.35,yb-.3,yb,-.45,o.ledge||.25)}
// entrance frontispiece: a cream terracotta frame round the arched doorway, crenellated, with a carved panel and shield; orange doors under a fanlight
function huFrontis(F){const t0=3.3,t1=11.4,top=9.6,a0=5.55,a1=9.15,ys=5.4,ya=6.95,tc=7.35;
  const s=new THREE.Shape();s.moveTo(t0,0);s.lineTo(t1,0);s.lineTo(t1,top);const N=9,w=(t1-t0)/N;for(let k=N-1;k>=0;k--){const x=t0+k*w;if(k%2===0){s.lineTo(x+w,top+.6);s.lineTo(x,top+.6)}else{s.lineTo(x+w,top);s.lineTo(x,top)}}s.lineTo(t0,0);
  const h=new THREE.Path();h.moveTo(a0,2.6);h.lineTo(a1,2.6);h.lineTo(a1,ys);h.absellipse(tc,ys,(a1-a0)/2,ya-ys,0,PI,false,0);h.lineTo(a0,2.6);s.holes.push(h);huShape(HA.cream,F,s,0,.7,16);
  // archivolt mouldings and jamb shafts
  for(const[r0,r1,d]of[[.18,.36,.7],[.42,.55,.7]]){const m=new THREE.Shape();m.moveTo(a1+r1,ys);m.absellipse(tc,ys,(a1-a0)/2+r1,ya-ys+r1,0,PI,false,0);m.lineTo(a0-r1,2.6);m.lineTo(a0-r0,2.6);m.lineTo(a0-r0,ys);m.absellipse(tc,ys,(a1-a0)/2+r0,ya-ys+r0,PI,0,true,0);m.lineTo(a1+r0,2.6);m.lineTo(a1+r1,2.6);m.lineTo(a1+r1,ys);huShape(HA.cream,F,m,d,.14,16)}
  // carved panel with a shield and two rosettes
  huB(HA.cream,F,4.9,9.8,7.4,9.15,.7,.8);huB(HA.cream,F,5.1,9.6,7.55,9.0,.8,.84);
  const sh=new THREE.Shape();sh.moveTo(tc-.55,8.85);sh.lineTo(tc+.55,8.85);sh.lineTo(tc+.55,8.2);sh.quadraticCurveTo(tc+.5,7.75,tc,7.6);sh.quadraticCurveTo(tc-.5,7.75,tc-.55,8.2);sh.closePath();huShape(HA.cream,F,sh,.84,.18,8);
  for(const x of[5.85,8.85]){const r=new THREE.Shape();r.absarc(x,8.25,.32,0,TAU,false);huShape(HA.cream,F,r,.84,.12,12);const r2=new THREE.Shape();r2.absarc(x,8.25,.14,0,TAU,false);huShape(HA.cream,F,r2,.96,.08,8)}
  // the doorway: cream lining, a step-up floor, two orange doors with glazed panels and a fanlight with glazing bars
  huB(HA.cream,F,a0,a0+.16,2.6,ya,-.45,0);huB(HA.cream,F,a1-.16,a1,2.6,ya,-.45,0);
  for(const[d0,d1]of[[a0+.16,tc-.03],[tc+.03,a1-.16]]){huB(HA.door,F,d0,d1,2.6,ys,-.47,-.37);huB(HA.glass,F,d0+.22,d1-.22,3.75,ys-.25,-.37,-.35);huB(HA.door,F,d0+.22,d1-.22,4.55,4.68,-.37,-.33);huB(HA.metal,F,d1-.3,d1-.22,3.4,4.0,-.37,-.3)}
  huB(HA.cream,F,a0,a1,ys-.08,ys+.08,-.45,-.33);const fl=new THREE.Shape();fl.moveTo(a0,ys);fl.lineTo(a1,ys);fl.absellipse(tc,ys,(a1-a0)/2,ya-ys,0,PI,false,0);huShape(HA.glassL,F,fl,-.47,.04,14);
  for(const k of[-1,0,1]){const a=PI/2+k*.55,x=tc+Math.cos(a)*.9,y=ys+Math.sin(a)*.8;huB(HA.cream,F,x-.04,x+.04,ys,y+.65,-.44,-.4)}
  // lanterns either side of the arch
  for(const x of[4.35,10.35]){huB(HA.metal,F,x-.18,x+.18,4.3,4.38,.7,1.05);huB(HA.lamp,F,x-.15,x+.15,4.38,4.95,.75,1.0);huB(HA.metal,F,x-.18,x+.18,4.95,5.05,.7,1.05)}}
// the oriel bay over the entrance: a projecting terracotta frame, two tiers of four lights, carved shields between the tiers, corbelled base
function huOriel(F){const t0=4.15,t1=10.55,y0=10.4,y1=17.0,dw=(t1-t0-.6)/4;
  huB(HA.cream,F,t0-.15,t1+.15,9.8,y0,0,.78);for(const x of[4.7,7.35,10.0])huB(HA.cream,F,x-.25,x+.25,9.15,9.8,0,.6);huB(HA.cream,F,t0+.3,t1-.3,9.45,9.8,0,.45);
  huB(HA.cream,F,t0,t0+.3,y0,y1,0,.66);huB(HA.cream,F,t1-.3,t1,y0,y1,0,.66);huB(HA.cream,F,t0,t1,y1-.45,y1,0,.7);huB(HA.cream,F,t0-.12,t1+.12,y1,y1+.18,0,.78);
  const G=rnd()<.5?HA.glassL:HA.glass;huQ(G,F,t0+.3,t1-.3,y0,13.25,.24);huQ(HA.glass,F,t0+.3,t1-.3,13.95,y1-.45,.24);
  huB(HA.cream,F,t0+.3,t1-.3,13.25,13.95,0,.58);for(let k=0;k<4;k++){const tc=t0+.3+dw*(k+.5);huB(HA.cream,F,tc-.2,tc+.2,13.35,13.85,.58,.66)}
  for(let k=1;k<4;k++){const t=t0+.3+dw*k;huB(HA.cream,F,t-.08,t+.08,y0,y1-.45,.2,.56)}for(const y of[12.5,15.8])huB(HA.cream,F,t0+.3,t1-.3,y-.06,y+.06,.2,.54)}
// V124 "Hughes Correctional Institute" in gothic lettering on the terracotta band
function huInscription(F,t0,t1,y0,y1){const tex=ctex(1024,112,(q,w,h)=>{q.fillStyle='#e6d8a8';q.fillRect(0,0,w,h);q.strokeStyle='rgba(150,130,80,.6)';q.lineWidth=3;q.strokeRect(6,6,w-12,h-12);
    q.font='italic bold 64px "Old English Text MT","UnifrakturMaguntia","Luminari","Blackletter",Georgia,serif';q.textAlign='center';q.textBaseline='middle';q.fillStyle='rgba(255,250,230,.8)';q.fillText('Hughes Correctional Institute',w/2+2,h/2+3,w-60);q.fillStyle='#6b4a26';q.fillText('Hughes Correctional Institute',w/2,h/2,w-60)});
  tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;const b=huAABB(F,t0,t1,y0,y1,.13,.13),m=new THREE.Mesh(new THREE.PlaneGeometry(t1-t0,y1-y0),SM({map:tex,roughness:.6}));
  m.position.set((b[0]+b[3])/2,(y0+y1)/2,(b[2]+b[5])/2);m.rotation.y=F.ax==='u'?(F.s>0?PI/2:-PI/2):(F.s>0?PI:0);m.receiveShadow=true;sc.add(m)}
function huTower(){const T=HT,FF={ax:'u',w:T.u1,s:1},FS={ax:'v',w:T.v0,s:-1},FN={ax:'v',w:T.v1,s:1},FR={ax:'u',w:T.u0,s:-1},TOP=38.0;
  // front face
  {const F=FF,h=[[5.55,9.15,2.6,6.95]];huArchWin(F,4.35,10.35,18.6,21.4,22.95,5,h,{ledge:.4});huWin(F,5.35,9.35,25.4,28.2,3,h);huArchWin(F,4.35,10.35,30.2,35.2,36.8,6,h);
    huWall(HA.brick,F,T.v0,T.v1,.45,TOP,h);huB(HA.stone,F,T.v0,T.v1,0,.45,-.45,.12);huFrontis(F);huOriel(F);huInscription(F,2.85,11.85,23.55,24.55);
    for(const x of[4.75,6.4,8.3,9.95])HGARG.push({F,t:x,y:18.62,d:.05,k:2});HGARG.push({F,t:3.0,y:16.4,d:0,k:0},{F,t:11.7,y:16.4,d:0,k:0})}
  // the two sides and the back: brick above the main roof, the arched window, a 3-light group and the top arcade
  for(const[F,c]of[[FS,(T.u0+T.u1)/2],[FN,(T.u0+T.u1)/2],[FR,(T.v0+T.v1)/2]]){const lo=F===FR?T.v0:T.u0,hi=F===FR?T.v1:T.u1,h=[];
    huArchWin(F,c-1.8,c+1.8,18.6,21.2,22.6,3,h);huWin(F,c-1.8,c+1.8,25.4,28.2,3,h);huArchWin(F,c-3,c+3,30.2,35.2,36.8,6,h);huWall(HA.brick,F,lo,hi,17.2,TOP,h);
    if(F!==FR){huWall(HA.brick,F,53.4,hi,.45,17.2,[]);huB(HA.stone,F,53.4,hi,0,.45,-.45,.12);huB(HA.cream,F,53.4,hi,HL.wt[0],HL.wt[1],-.45,.18);for(const[y0,y1]of HL.sc)huB(HA.cream,F,53.4,hi,y0,y1,-.45,.12)}}
  // bands, cornice, parapet with blind tracery ribs, merlons, roof
  for(const[F,lo,hi]of[[FF,T.v0,T.v1],[FS,T.u0,T.u1],[FN,T.u0,T.u1],[FR,T.v0,T.v1]]){huB(HA.cream,F,lo,hi,17.2,17.6,-.45,.3);huB(HA.cream,F,lo,hi,23.5,24.6,-.45,.12);huB(HA.cream,F,lo,hi,29.0,29.3,-.45,.15);
    huB(HA.cream,F,lo,hi,TOP,38.4,-.45,.34);huB(HA.cream,F,lo,hi,38.4,40.4,-.45,.12);for(let t=lo+2.3;t<hi-2.2;t+=.55)huB(HA.cream,F,t-.05,t+.05,38.6,40.2,.12,.2);
    for(let t=lo+2.6;t+.7<=hi-2.4;t+=1.25)huB(HA.cream,F,t,t+.7,40.4,41.2,-.45,.12)}
  huFace(HA.flat,'py',huX(T.u0)+.45,40.25,huZ(T.v1)+.45,huX(T.u1)-.45,40.25,huZ(T.v0)-.45);
  for(const[u,v]of[[T.u1,T.v0],[T.u1,T.v1],[T.u0,T.v0],[T.u0,T.v1]])huTurret(u,v)}
// an octagonal corner turret: brick shaft with the tower's string courses and small framed windows on its outer faces, a cream upper stage
// with blind arcading, a corbelled crenellated rim, a cream dome and finial, and a gargoyle looking out from the corner
function huTurret(u,v){const T=HT,x=huX(u),z=huZ(v),R=T.R,ap=R*Math.cos(PI/8),oct=(r,h)=>new THREE.CylinderGeometry(r,r,h,8,1),cx=huX((T.u0+T.u1)/2),cz=huZ((T.v0+T.v1)/2);
  huPrim(HA.brick,oct(R,37.95),x,.45+37.95/2,z,PI/8,1,1,1,true);huPrim(HA.stone,oct(R*1.06,.45),x,.225,z,PI/8,1,1,1,true);
  for(const[y0,y1,k]of[[2.3,2.7,1.07],[6.95,7.25,1.05],[11.45,11.75,1.05],[17.2,17.6,1.08],[23.5,24.6,1.05],[29.0,29.3,1.05],[38.0,38.4,1.1]])huPrim(HA.cream,oct(R*k,y1-y0),x,(y0+y1)/2,z,PI/8,1,1,1,true);
  huPrim(HA.cream,oct(R,4.6),x,38.4+2.3,z,PI/8,1,1,1,true);huPrim(HA.cream,oct(R*1.17,.4),x,42.8,z,PI/8,1,1,1,true);huPrim(HA.cream,oct(R*1.22,.45),x,43.2,z,PI/8,1,1,1,true);
  const ox=x-cx,oz=z-cz,ol=Math.hypot(ox,oz);
  for(let k=0;k<8;k++){const a=k*PI/4,nx=Math.sin(a),nz=Math.cos(a),out=(nx*ox+nz*oz)/ol;
    // merlons all round the rim, blind arcade on the upper stage
    huPrim(HA.cream,new THREE.BoxGeometry(.62,.5,.32),x+nx*ap*1.12,43.68,z+nz*ap*1.12,a);
    huPrim(HA.dark,new THREE.BoxGeometry(.38,2.6,.06),x+nx*(ap+.02),40.5,z+nz*(ap+.02),a);huPrim(HA.cream,new THREE.BoxGeometry(.56,.12,.1),x+nx*(ap+.05),39.15,z+nz*(ap+.05),a);huPrim(HA.cream,new THREE.BoxGeometry(.9,.16,.12),x+nx*(ap+.05),42.1,z+nz*(ap+.05),a);
    if(out<.2)continue;
    for(const y of[9.2,13.2,20.0,26.3,32.6]){huPrim(HA.glass,new THREE.BoxGeometry(.62,1.25,.06),x+nx*(ap+.01),y,z+nz*(ap+.01),a);
      for(const[w,h,dx,dy]of[[.16,1.57,-.39,0],[.16,1.57,.39,0],[.94,.16,0,.71],[1.1,.14,0,-.7]])huPrim(HA.cream,new THREE.BoxGeometry(w,h,.14),x+nx*(ap+.05)+Math.cos(a)*dx,y+dy,z+nz*(ap+.05)-Math.sin(a)*dx,a)}}
  huPrim(HA.cream,new THREE.SphereGeometry(R*.82,12,7,0,TAU,0,PI/2),x,43.42,z,0,1,1.45,1);huPrim(HA.cream,new THREE.CylinderGeometry(.1,.16,.55,8),x,46.0,z);huPrim(HA.cream,new THREE.SphereGeometry(.16,8,6),x,46.35,z);
  const yaw=Math.atan2(ox,oz);HGARG.push({x:x+Math.sin(yaw)*(R*1.05),y:37.3,z:z+Math.cos(yaw)*(R*1.05),yaw,k:0})}
// ---------------------------------------------------------------- gargoyles and grotesques: life-sized cream terracotta beasts (the school's
// were carved for its subjects). k=0 a winged waterspout beast crouching on a corbel, k=1 the same holding a book, k=2 a seated
// grotesque statue with an emblem (flask, book, ball, drawing board) for the figures on the tower's window ledge
function huGargGeo(k){const A=huAcc(),add=(g,x,y,z,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1)=>huAdd(A,g,new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)),new THREE.Vector3(sx,sy,sz)),true),
  S=(r)=>new THREE.SphereGeometry(r,8,6),B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(r,h,n=6)=>new THREE.ConeGeometry(r,h,n);
  if(k<2){add(B(.44,.3,.5),0,-.08,.22);add(S(1),0,.2,.58,-.15,0,0,.27,.24,.44);for(const s of[-1,1]){add(S(.15),s*.17,.13,.38);add(B(.09,.34,.09),s*.13,.02,.8);add(B(.12,.06,.16),s*.13,-.14,.86);
      add(B(.04,.46,.52),s*.29,.48,.42,-.3,0,s*-.55);add(C(.05,.24),s*.1,.6,.9,-.5,0,s*.2);add(C(.04,.14),s*.17,.47,.96,0,0,s*1.2)}
    add(S(.19),0,.36,.96);add(B(.21,.13,.22),0,.31,1.12);add(B(.19,.06,.2),0,.19,1.09);add(B(.3,.06,.09),0,.47,1.06);add(C(.06,.38),0,.16,.14,1.3,0,0);
    if(k===1){add(B(.26,.07,.2),0,.07,.98,.3,0,0)}}
  else{add(B(.5,.18,.4),0,.09,.1);add(S(1),0,.5,.12,0,0,0,.22,.33,.2);add(S(.17),0,.95,.16);add(B(.18,.1,.13),0,.9,.3);add(B(.26,.05,.08),0,1.04,.26);for(const s of[-1,1]){add(C(.04,.18),s*.09,1.14,.12,-.3,0,s*.2);add(B(.07,.3,.08),s*.18,.48,.28,-.9,0,0);add(B(.05,.38,.3),s*.24,.62,-.05,.2,0,s*-.25)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(A.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(A.t,2));return g}
function huGargoyles(mat){const G=[huGargGeo(0),huGargGeo(1),huGargGeo(2)],L=[[],[],[]];let pi=0;
  for(const e of HGARG){let x,y,z,yaw;if(e.F){const b=huAABB(e.F,e.t,e.t,e.y,e.y,e.d,e.d);x=(b[0]+b[3])/2;y=e.y;z=(b[2]+b[5])/2;yaw=e.F.ax==='u'?(e.F.s>0?PI/2:-PI/2):(e.F.s>0?PI:0)}else{x=e.x;y=e.y;z=e.z;yaw=e.yaw}
    let k=e.k;if(k===0&&(pi++)%5===2)k=1;L[k].push([x,y,z,yaw])}
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),one=new THREE.Vector3(1.35,1.35,1.35);
  L.forEach((arr,k)=>{if(!arr.length)return;const im=new THREE.InstancedMesh(G[k],mat,arr.length);arr.forEach(([x,y,z,yaw],i)=>{e.set(0,yaw,0);q.setFromEuler(e);m.compose(new THREE.Vector3(x,y,z),q,k===2?new THREE.Vector3(.95,.95,.95):one);im.setMatrixAt(i,m)});
    im.castShadow=true;im.receiveShadow=true;im.userData.noMerge=1;sc.add(im)});
  // the tower statues carry the school's subjects: a flask, a book, a ball and a drawing board
  const props=[[new THREE.ConeGeometry(.09,.2,8),0,.6,.38],[new THREE.BoxGeometry(.22,.06,.16),0,.58,.38],[new THREE.SphereGeometry(.11,8,6),0,.6,.38],[new THREE.BoxGeometry(.24,.3,.03),0,.66,.36]];
  L[2].forEach(([x,y,z,yaw],i)=>{const[g,px,py,pz]=props[i%4],c=Math.cos(yaw),s=Math.sin(yaw);huPrim(HA.cream,g,x+s*pz*.85,y+py*.85,z+c*pz*.85,yaw)})}
// ---------------------------------------------------------------- the whole building
function buildHughes(){HA={};const M=huMats();for(const k in M)HA[k]=huAcc();HGARG=[];
  const U=(w,s)=>({ax:'u',w,s}),V=(w,s)=>({ax:'v',w,s});
  // ---- 1910 block, front (east): corner pavilions, the front range either side of the tower
  huMain(U(57.4,1),-35.5,-19.9,{n:2,pav:1,gable:1,pierL:1,pierR:1,garg:1});
  huMain(U(53.4,1),-19.9,.5,{n:3,garg:1});huMain(U(53.4,1),14.2,34.5,{n:3,garg:1});
  huMain(U(56.9,1),34.5,50.4,{n:2,pav:1,gable:1,pierL:1,pierR:1,garg:1});
  huMain(V(-19.9,1),53.4,57.4,{n:1,nl:2,pierR:1});huMain(V(34.5,-1),53.4,56.9,{n:1,nl:2,pierR:1});
  // ---- north side: NE pavilion, the north range (5 bays), NW pavilion
  huMain(V(50.4,1),42,56.9,{n:2,pav:1,gable:1,pierL:1,pierR:1,garg:1});huMain(U(42,-1),45.45,50.4,{n:1,nl:2,pierR:1});
  huMain(V(45.45,1),6.8,42,{n:5,garg:1});huMain(U(6.8,1),45.45,50.6,{n:1,nl:2,pierR:1});
  huMain(V(50.6,1),-7.7,6.8,{n:2,pav:1,gable:1,pierL:1,pierR:1});huMain(U(-7.7,-1),38.2,50.6,{n:2,pierL:1,pierR:1});
  // ---- south side: SE pavilion, the south range, SW pavilion
  huMain(V(-35.5,-1),41.9,57.4,{n:2,pav:1,gable:1,pierL:1,pierR:1,garg:1});huMain(U(41.9,-1),-35.5,-31.4,{n:1,nl:2,pierL:1});
  huMain(V(-31.4,-1),7.4,41.9,{n:5,garg:1});huMain(U(7.4,1),-35.7,-31.4,{n:1,nl:2,pierL:1});
  huMain(V(-35.7,-1),-7.6,7.4,{n:2,pav:1,gable:1,pierL:1,pierR:1});huMain(U(-7.6,-1),-35.7,-19.8,{n:2,pierL:1,pierR:1});
  // ---- the two open courts round the assembly hall, and the hall itself (flat roof)
  for(const[F,a0,a1,top]of[[V(23.3,-1),14.2,38.8,18.4],[V(32.7,1),14.2,38.8,17],[U(14.2,1),23.3,32.7,14],[U(38.8,-1),23.3,32.7,17],
    [V(-8.3,1),14.1,39.2,18.4],[V(-17.1,-1),14.1,39.2,17],[U(14.1,1),-17.1,-8.3,14],[U(39.2,-1),-17.1,-8.3,17]])huSimple(F,a0,a1,top,{sp:3.2,wt:1});
  // ---- rear range (shop wings) and the later blocks west of the 1910 building
  huSimple(V(-16,-1),-37.6,-7.7,13,{sp:3.6});huSimple(U(-37.6,-1),-2,38.2,13,{sp:3.6});huSimple(V(38.2,1),-17.2,-7.7,13,{sp:3.6});
  const NWF=[[5.8,8.2],[9.6,12],[13.4,15.8],[17.2,19.6]];
  for(const[F,a0,a1]of[[V(54,1),-40.7,-17.2],[U(-40.7,-1),38.2,54],[U(-17.2,1),38.2,54]]){huSimple(F,a0,a1,5,{mat:'stone',floors:[[1.6,3.8]],noTop:1,sp:3.2,ww:1.3});huSimple(F,a0,a1,22,{y0:5,floors:NWF,sp:3.2,ww:1.3})}
  for(const[F,a0,a1,top]of[[V(-51.8,-1),-86.3,-45.4,17],[U(-86.3,-1),-51.8,-29.1,17],[U(-79.2,-1),-29.1,1.5,17],[V(1.5,1),-79.2,-46.8,17],[U(-29.5,1),-32.6,-24.5,15],[V(-35.6,-1),-42.9,-36.1,15],[U(-45.4,1),-51.8,-47.2,17],[V(-24.5,-1),-37,-29.5,15]])
    huSimple(F,a0,a1,top,{sp:3.6,floors:[[3.25,6.2],[7.5,10.4],[11.8,14.6]]});
  // ---- roofs: red hips over the ranges and pavilions, flat roofs over the hall, the rear range and the later wings
  const yE=17.35;huHip(39.3,53.4,-31.4,.5,yE);huHip(39.3,53.4,14.2,45.45,yE);huHip(6.8,39.3,32.7,45.45,yE);huHip(7.4,39.3,-31.4,-17.1,yE);
  for(const r of[[41.9,57.4,-35.5,-19.9],[42,56.9,34.5,50.4],[-7.7,6.8,38.2,50.6],[-7.6,7.4,-35.7,-19.8]])huHip(r[0],r[1],r[2],r[3],yE,.75);
  huFace(HA.flat,'py',huX(39.3)+.3,yE+.1,huZ(14.2),huX(42.8),yE+.1,huZ(.5));
  huFlat(14.1,39.3,-8.3,23.3,18.4);huFlat(-7.7,14.2,-19.8,38.2,14);huFlat(-37.6,-7.7,-16,38.2,13);huFlat(-40.7,-17.2,38.2,54,22.4);
  for(const r of[[-86.3,-45.4,-51.8,-29.1],[-79.2,-39.8,-29.1,1.5],[-42.9,-29.5,-35.6,-24.5],[-39.8,-37,-24.5,-7.8]])huFlat(r[0],r[1],r[2],r[3],r[0]<-45?17:15);
  for(const[u,v]of[[30,39.1],[20,39.1],[30,-24.25],[20,-24.25],[46.4,-15],[46.4,30]])huVent(u,v,yE+3.4);
  huPrim(HA.brick,new THREE.BoxGeometry(2.2,9,2.2),huX(2),14+4.5,huZ(4));huPrim(HA.cream,new THREE.BoxGeometry(2.6,.5,2.6),huX(2),23.2,huZ(4));
  // light well walls (tan) in the rear range roof
  for(const[u0,u1,v0,v1]of[[-9.6,-4,6.6,13.9]])huBoxW(HA.stone,huX(u0),12,huZ(v1),huX(u1),14.6,huZ(v0),'py');
  // ---- tower
  huTower();
  // ---- front steps (raised basement: the entrance is 2.6 m up), cheek walls with lamp standards
  {const X=u=>huX(u),Z=v=>huZ(v);huBoxW(HA.stone,X(56.4),0,Z(13.35),X(58.9),2.6,Z(1.35));huBoxW(HA.stone,X(55.95),0,Z(9.15),X(56.4),2.6,Z(5.55));
    for(let i=0;i<14;i++){const top=2.6-(i+1)*2.6/14,u0=58.9+i*.35;huBoxW(HA.stone,X(u0),0,Z(13.35),X(u0+.35),Math.max(.06,top),Z(1.35),'nx')}
    for(const v0 of[.75,13.35]){const F=V(v0,1),s=new THREE.Shape();s.moveTo(56.4,0);s.lineTo(63.8,0);s.lineTo(63.8,1.0);s.lineTo(58.9,3.4);s.lineTo(56.4,3.4);s.closePath();huShape(HA.cream,F,s,0,.6,4);
      const lx=X(63.5),lz=Z(v0+.3);huPrim(HA.metal,new THREE.CylinderGeometry(.08,.12,2.4,8),lx,1.0+1.2,lz);huPrim(HA.lamp,new THREE.SphereGeometry(.28,10,8),lx,3.55,lz);huPrim(HA.metal,new THREE.CylinderGeometry(.18,.22,.18,8),lx,3.25,lz)}}
  huGargoyles(M.cream);
  for(const k in HA){const A=HA[k];if(!A.p.length)continue;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(A.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(A.t,2));
    const m=new THREE.Mesh(g,M[k]);m.castShadow=k!=='glass'&&k!=='glassL';m.receiveShadow=true;m.userData.noMerge=1;sc.add(m)}
  HA=null;
  huSite()}
// ---------------------------------------------------------------- grounds: the front walk and lawn, the flagpole, lamp posts, a sign, trees;
// collision for the building, and its outline on the maps
function huSite(){const X=huX,Z=huZ;
  // collision (the grid stops at x=0, so only the parts east of the world edge matter)
  for(const[u0,u1,v0,v1,h]of[[39.3,53.4,-31.4,45.45,19],[41.9,57.4,-35.5,-19.9,19],[42,56.9,34.5,50.4,19],[6.8,42,32.7,45.45,19],[7.4,42,-31.4,-17.1,19],[14,39.3,-17.1,32.7,19],[-8,14.2,-35.7,50.6,19],
    [HT.u0-2,HT.u1+2,HT.v0-2,HT.v1+2,42],[56.4,63.9,.7,14,3.5]])markR(X(u0),Z(v1),X(u1),Z(v0),h);
  // V124 the front steps are walkable: a stair deck from the walk (u 64.2, ground) up the flight (u 58.9, 2.6 m) onto the landing at the doors.
  // The grid keeps the steps solid from the sides; the deck is only entered from its bottom end.
  {const zc=Z(7.35),g=terrH(X(64.4),zc),d=deckMk([[X(64.4),zc],[X(63.8),zc],[X(58.9),zc],[X(56.2),zc]],[g,g+.03,2.6,2.6],11.4,'st');d.cst=1;d.t0=0;d.t1=d.L}
  for(const v of[.75,13.35])markC(X(63.5),Z(v+.3),.25,4);
  // front walk from the steps to the Greek Row sidewalk, and a walk along the front of the building
  path(X(63.8),Z(12.35),62.8,Z(2.35));path(48.2,Z(48.5),50.6,Z(14.6));path(48.2,Z(.1),50.6,Z(-33.5));path(50.6,Z(10.2),X(63.8),Z(4.5));
  // flagpole on the lawn
  {const fx=57.5,fz=Z(-10),pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.11,13,10),mt(0xd8d8d8,.3,.6));pole.position.set(fx,6.5,fz);pole.castShadow=true;sc.add(pole);
    const tex=ctex(192,100,(q,w,h)=>{for(let i=0;i<13;i++){q.fillStyle=i%2?'#f4f1ea':'#b0242c';q.fillRect(0,i*h/13,w,h/13+1)}q.fillStyle='#24356b';q.fillRect(0,0,w*.42,h*7/13);q.fillStyle='#f4f1ea';for(let r=0;r<5;r++)for(let c=0;c<6;c++){q.beginPath();q.arc(8+c*12.5+(r%2)*6,6+r*10.5,1.7,0,TAU);q.fill()}});
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.3,8,1),SM({map:tex,side:THREE.DoubleSide,roughness:.8}));fl.position.set(fx,12.2,fz-1.25);fl.rotation.y=PI/2;sc.add(fl);markC(fx,fz,.2,13);
    const ba=new THREE.Mesh(new THREE.CylinderGeometry(.5,.6,.4,10),mt(0x9a9286,.9));ba.position.set(fx,.2,fz);sc.add(ba)}
  // lamp posts along the walk, a low brick monument sign by the sidewalk
  for(const[x,z]of[[54,Z(13.2)],[54,Z(1.5)],[60,Z(13.2)],[60,Z(1.5)]]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,3.6,8),mt(0x1c1e22,.4,.6));p.position.set(x,1.8,z);sc.add(p);
    const gl=new THREE.Mesh(new THREE.SphereGeometry(.26,10,8),HUGLOW||(HUGLOW=(()=>{const m=SM({color:0xfff1cf,emissive:0xffd08a,emissiveIntensity:0,roughness:.3});FMLIST.push(m);return m})()));gl.position.set(x,3.75,z);sc.add(gl);markC(x,z,.15,4)}
  {const sx=61.2,sz=Z(-4.5),b=new THREE.Mesh(new THREE.BoxGeometry(.7,1.3,5.2),SM({map:null,color:0x6a2a20,roughness:.9}));b.position.set(sx,.65,sz);b.castShadow=true;sc.add(b);
    const cap=new THREE.Mesh(new THREE.BoxGeometry(.85,.14,5.4),mt(0xe6d8a8,.6));cap.position.set(sx,1.37,sz);sc.add(cap);
    const sg=signMesh('HUGHES DETENTION CENTER',4.6,.75,'#e6d8a8','#6b2a20','Georgia');sg.position.set(sx+.37,.7,sz);sg.rotation.y=PI/2;sc.add(sg);markR(sx-.4,sz-2.7,sx+.4,sz+2.7,1.5)}
  // a few lawn trees, then keep the random trees off the building and its lawn
  for(const[x,z]of[[58.5,Z(42)],[58.5,Z(28)],[58.5,Z(-26)],[58.5,Z(-38)],[20,Z(48)],[20,Z(-38.4)]])tryTree(x,z,1.05);
  NOTREE.push([0,588,62.6,689.5]);
  // on the maps
  const poly=[[X(-7.7),Z(50.6)],[X(6.8),Z(50.6)],[X(6.8),Z(45.45)],[X(42),Z(45.45)],[X(42),Z(50.4)],[X(56.9),Z(50.4)],[X(56.9),Z(34.5)],[X(53.4),Z(34.5)],[X(53.4),Z(14.2)],[X(58.4),Z(14.2)],[X(58.4),Z(.5)],[X(53.4),Z(.5)],[X(53.4),Z(-19.9)],[X(57.4),Z(-19.9)],[X(57.4),Z(-35.5)],[X(41.9),Z(-35.5)],[X(41.9),Z(-31.4)],[X(7.4),Z(-31.4)],[X(7.4),Z(-35.7)],[X(-7.6),Z(-35.7)]];
  B.push({id:'hughes',name:'Hughes Correctional Institute',x0:0,z0:Z(50.6),x1:X(58.4),z1:Z(-35.7),h:19,poly,mc:'#7a3326'})}
let HUGLOW=null;
