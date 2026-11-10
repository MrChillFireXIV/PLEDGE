// ================================================================ V63 the rest of the campus from the walking tour: Rieveschl's rooftop penthouses, the Zimmer plaza,
// Mantei Center's brick drums and vaults
let ZPT=null;function zimPave(){return ZPT||(ZPT=ctex(160,160,(q,w,h)=>{q.fillStyle='#8d8a84';q.fillRect(0,0,w,h);q.save();q.translate(w/2,h/2);q.rotate(PI/4);const s=20;for(let i=-6;i<6;i++)for(let j=-6;j<6;j++){q.fillStyle=(i+j)%2?shade('#b9a27f',rnd()*10-5):shade('#6f6c67',rnd()*10-5);q.fillRect(i*s+1,j*s+1,s-2,s-2)}q.restore()}))}
function cylUV(r,h,seg,mat,tile=16){const g=new THREE.CylinderGeometry(r,r,h,seg,1,true);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*TAU*r/tile,uv.getY(i)*h/tile);return new THREE.Mesh(g,mat)}
// Rieveschl Hall: the cluster of concrete mechanical penthouses on the roof, with their round vents (the campus calls them the robots)
function rieveX(b){const ups=(b.up||[]).map(([r,hh])=>({p:gpoly(r),hh})).sort((a,c)=>c.hh-a.hh);if(!ups.length)return;const U=ups[0],[x0,z0,x1,z1]=bbox(U.p),cx=(x0+x1)/2,cz=(z0+z1)/2,a=-(b.rect[4]||0)*PI/180,C=mt(0xd8d2c5,.9),D=mt(0x2a2d31,.6);
  const P=(dx,dz)=>[cx+Math.cos(a)*dx-Math.sin(a)*dz,cz+Math.sin(a)*dx+Math.cos(a)*dz];
  for(const[dx,dz,w,dd,y0,hh]of[[-3,0,8,6,0,3.4],[-3,0,5.4,4.4,3.4,2.8],[4.5,1,6,5,0,4.2],[4.5,1,3.6,3.6,4.2,2.4],[10,-1,5,4,0,3]]){const[x,z]=P(dx,dz);if(!inPoly(x,z,U.p))continue;const m=box(x,U.hh+y0+hh/2,z,w,hh,dd,C);m.rotation.y=-a;
    for(const s of[-1,1]){const e=new THREE.Mesh(GC.rvh||(GC.rvh=new THREE.CircleGeometry(.42,14)),D);const[ex,ez]=P(dx+s*w*.22,dz+dd/2+.02);e.position.set(ex,U.hh+y0+hh*.62,ez);e.rotation.y=-a;sc.add(e)}}}
// ================================================================ V70 Zimmer Hall's roof garden (the plaza on top of the lecture halls): red-and-grey paver squares, raised lawn
// panels with clipped hedges and ornamental grasses, light concrete walks on the cross axes, black globe lamps, benches, the row of glass
// skylight boxes, the rust-red steel stair sculptures, a parapet with a black rail. It is walkable, reached by maroon steel stairs: a double
// flight with a landing from the Langsam / Rieveschl side, and a short flight from the Baldwin / Old Chemistry walk.
let ZIM=null;
const zimPave2=()=>GC.zp2||(GC.zp2=ctex(256,256,(q,w,h)=>{const n=16,s=w/n;q.fillStyle='#8f8a84';q.fillRect(0,0,w,h);
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const r=rnd(),c=r<.42?'#a8746a':r<.75?'#7f7c79':r<.9?'#9a8f88':'#b58b80';q.fillStyle=shade(c,rnd()*10-5);q.fillRect(i*s+1,j*s+1,s-2,s-2)}}));
function zimmerX(b,main,h){const lv=b.lvo!=null?b.lvo:terrH(b.fp[0]+b.fn[0]*1.6,b.fp[1]+b.fn[1]*1.6);
  const O=[321.3,179.85],U=[.9624,-.2716],V=[.2716,.9624],W=(u,v)=>[O[0]+U[0]*u+V[0]*v,O[1]+U[1]*u+V[1]*v],RY=-Math.atan2(U[1],U[0]);
  const C=mt(0xbdb8ad,.9),CK=mt(0xd6d2c9,.9),GR=mt(0x5f9446,.95),HE=mt(0x3f6b35,.85),BL=mt(0x1d1f22,.5,.4),RU=mt(0x7a3324,.7,.3),GL=SM({color:0x9fc3d6,roughness:.05,metalness:.2,transparent:true,opacity:.45,depthWrite:false});
  const bx=(u,v,w,hh,d,m,y0=0,ry=0)=>{const[x,z]=W(u,v),e=box(x,h+y0+hh/2,z,w,hh,d,m);e.rotation.y=RY+ry;return e};
  const rectP=(u0,v0,u1,v1)=>[W(u0,v0),W(u1,v0),W(u1,v1),W(u0,v1)],holes=[];
  // the stair landings: where they meet the roof the parapet opens
  const EA=[367.94,166.69],Ed=[.269,.963],En=[.963,-.269],SA=[329.57,209.01],Sd=[.9667,-.2556],Sn=[.2556,.9667];
  const gaps=[[369.2,171.0,2.0],[338.9,206.6,1.95]];   // V130: the south opening is only the walk beside the tunnel stair
  const edgeNear=(x,z)=>{let best=null;for(let i=0;i<main.length;i++){const[a,c]=main[i],[e,f]=main[(i+1)%main.length],vx=e-a,vz=f-c,L2=vx*vx+vz*vz||1,t=clamp(((x-a)*vx+(z-c)*vz)/L2,0,1),px=a+vx*t,pz=c+vz*t,dd=Math.hypot(x-px,z-pz);if(!best||dd<best[2])best=[px,pz,dd]}return best};
  const links=[];for(const br of UCD.bridges||[]){const p=br.p;if(p.length<2)continue;for(const[e,oo]of[[p[0],p],[p[p.length-1],p.slice().reverse()]]){const o=oo.find(q=>Math.hypot(q[0]-e[0],q[1]-e[1])>.8);if(!o)continue;const q=edgeNear(e[0],e[1]);if(q&&q[2]<2.5&&!(Math.hypot(e[0]-369.3,e[1]-171)<2.5)){const ye=terrH(e[0],e[1])+((br.h&&br.h[e===p[0]?0:p.length-1])||0);if(Math.abs(ye-(lv+h))<.8){gaps.push([q[0],q[1],1.6]);links.push({e,o,q})}else br.skipZ=1}}}
  // parapet: a low concrete wall with a black steel rail, broken at the stair heads
  const parM=mt(0xc9c3b6,.9);for(let i=0;i<main.length;i++){const[a,c]=main[i],[e,f]=main[(i+1)%main.length],L=Math.hypot(e-a,f-c);if(L<.3)continue;const ux=(e-a)/L,uz=(f-c)/L,ry=-Math.atan2(uz,ux);let t0=null;
    const flush=t1=>{if(t0==null||t1-t0<.2){t0=null;return}const tm=(t0+t1)/2,x=a+ux*tm,z=c+uz*tm,l=t1-t0;let m=box(x,h+.25,z,l,.5,.35,parM);m.rotation.y=ry;m=box(x,h+1.04,z,l,.06,.08,BL);m.rotation.y=ry;
      for(let t=t0;t<=t1+1e-3;t+=1.6){const p=box(a+ux*Math.min(t,t1),h+.78,c+uz*Math.min(t,t1),.05,.52,.05,BL);p.rotation.y=ry}t0=null};
    for(let t=0;t<=L+1e-3;t+=.25){const x=a+ux*t,z=c+uz*t,inG=gaps.some(([gx,gz,r])=>Math.hypot(x-gx,z-gz)<r);if(!inG&&t0==null)t0=t;if((inG||t>=L-.01)&&t0!=null)flush(inG?t:L)}}
  // light concrete walks on the cross axes
  for(const[u0,v0,u1,v1]of[[15.2,0.8,18.8,30.2],[29.2,0.8,32.8,30.2],[.8,13.2,47.6,16.8]]){const[x,z]=W((u0+u1)/2,(v0+v1)/2),g=new THREE.Mesh(new THREE.PlaneGeometry(u1-u0,v1-v0),CK);g.rotation.set(-PI/2,0,RY);g.position.set(x,h+.012,z);g.receiveShadow=true;sc.add(g)}
  // lawn panels: curbed, lawn on top, clipped hedges along the long sides, a few grasses, two small trees
  const hedge=GC.zh||(GC.zh=new THREE.IcosahedronGeometry(.32,1)),tuft=GC.zt||(GC.zt=mergeParts([[new THREE.ConeGeometry(.05,.75,4),0x55743a,0,.37,0],[new THREE.ConeGeometry(.05,.62,4),0x4d6a34,.08,.31,.05],[new THREE.ConeGeometry(.05,.68,4),0x5d7c40,-.07,.34,-.04],[new THREE.ConeGeometry(.05,.55,4),0x4a6632,.02,.28,-.09]])),TU=mt(0x55743a,.9);let k=0;
  for(const[u0,u1x]of[[5,15],[19,29],[33,43]])for(const[v0,v1]of[[4.5,12.2],[17.8,25.5]]){const u1=u0===33&&v0<5?37.4:u1x;k++;const cu=(u0+u1)/2,cv=(v0+v1)/2;bx(cu,cv,u1-u0,.42,v1-v0,C);bx(cu,cv,u1-u0-.3,.02,v1-v0-.3,GR,.42);holes.push(rectP(u0-.15,v0-.15,u1+.15,v1+.15));
    for(const v of[v0+.55,v1-.55])for(let u=u0+.6;u<u1-.4;u+=.62){const[x,z]=W(u,v),m=new THREE.Mesh(hedge,HE);m.scale.set(1,.8+rnd()*.25,1);m.position.set(x,h+.66,z);m.castShadow=true;sc.add(m)}
    for(let i=0;i<5;i++){const[x,z]=W(u0+1.5+rnd()*(u1-u0-3),v0+1.6+rnd()*(v1-v0-3.2)),t=new THREE.Mesh(tuft,TU);t.position.set(x,h+.44,z);t.scale.set(1,1+rnd()*.5,1);sc.add(t)}
    if(k===2||k===5){const[x,z]=W(cu,cv);cyl(x,h+1.5,z,.12,2.2,0x5a3d26,7);const f=new THREE.Mesh(blobGeo(),mt(0x5b8f3a,.9));f.scale.setScalar(1.35);f.position.set(x,h+3.3,z);f.castShadow=true;sc.add(f)}}
  // the row of glass skylight boxes on the Old Chemistry side
  for(const v of[8.4,15,21.6]){bx(2.9,v,2.5,.35,2.5,C);const[x,z]=W(2.9,v),g=new THREE.Mesh(bgeo(2.2,1.7,2.2),GL);g.position.set(x,h+.35+.85,z);g.rotation.y=RY;sc.add(g);
    for(const[a2,c2]of[[-1.1,-1.1],[1.1,-1.1],[-1.1,1.1],[1.1,1.1]]){const[px,pz]=W(2.9+a2,v+c2);box(px,h+.35+.85,pz,.07,1.7,.07,BL)}bx(2.9,v,2.3,.08,2.3,BL,2.05);holes.push(rectP(1.5,v-1.4,4.3,v+1.4))}
  // black globe lamps along the walks, benches beside them
  for(const[u,v]of[[17,3],[17,28],[31,3],[31,28],[10,15],[38,15],[24,15]]){const[x,z]=W(u,v);cyl(x,h+1.8,z,.06,3.6,0x1d1f22,8);const gl=new THREE.Mesh(GC.zg||(GC.zg=new THREE.SphereGeometry(.24,14,10)),bm(0xfff1d2));gl.position.set(x,h+3.75,z);sc.add(gl);markC(x,z,.15,h+4)}
  for(const[u,v,ry]of[[21,13.6,0],[27,16.4,PI],[35,13.6,0],[13,16.4,PI]]){const g=new THREE.Group(),[x,z]=W(u,v);for(const[w,hh,d,y,zz]of[[1.9,.06,.5,.46,0],[1.9,.4,.05,.7,-.25]]){const s=new THREE.Mesh(bgeo(w,hh,d),BL);s.position.set(0,y,zz);s.castShadow=true;g.add(s)}for(const sx of[-.85,.85]){const l=new THREE.Mesh(bgeo(.06,.46,.45),BL);l.position.set(sx,.23,0);g.add(l)}g.position.set(x,h,z);g.rotation.y=RY+ry;sc.add(g)}
  ZIM={lv,h,Y:lv+h,main,holes,EA,Ed,En,SA,Sd,Sn,links}}
// the walkable roof and the steel stairs (after the footbridges: these decks render themselves)
function zimDecks(){if(!ZIM)return;const Z=ZIM,Y=Z.Y;
  // the roof: an area deck inside the parapet, with the planters, skylights and sculptures cut out
  {const q=fdContour(Z.main),n=q.length,cx=q.reduce((s,p)=>s+p[0],0)/n,cz=q.reduce((s,p)=>s+p[1],0)/n,E=q.map((a,i)=>{const b=q[(i+1)%n],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;let nx=-(b[1]-a[1])/L,nz=(b[0]-a[0])/L;if(!inPoly((a[0]+b[0])/2+nx*.1,(a[1]+b[1])/2+nz*.1,q)){nx=-nx;nz=-nz}return[nx,nz]});
    const poly=q.map((p,i)=>{const A=E[(i+n-1)%n],B=E[i];let mx=A[0]+B[0],mz=A[1]+B[1];const dd=1+A[0]*B[0]+A[1]*B[1];mx/=dd;mz/=dd;return[p[0]+mx*.55,p[1]+mz*.55]}),bb=bbox(poly);
    DECKS.push({area:{poly,holes:Z.holes},P:[[cx,cz],[cx+.1,cz]],ys:[Y,Y],s:[0,2],L:2,hw:99,w:198,k:'area',cov:0,bb:[bb[0]-.5,bb[1]-.5,bb[2]+.5,bb[3]+.5],t0:0,t1:2,y:Y})}
  const at=(A,d,t,n,o)=>[A[0]+d[0]*t+n[0]*o,A[1]+d[1]*t+n[1]*o];
  // Langsam side: the straight stair from the north-east corner down to the walk by Rhodes and Langsam, with a half landing
  {const A=[369.4,170.9],d0=[13.2,-4.8],l0=Math.hypot(...d0),d=[d0[0]/l0,d0[1]/l0];let g=terrH(A[0]+d[0]*12,A[1]+d[1]*12),m,L;for(let it=0;it<3;it++){m=Math.max(4,Math.round((Y-g)/.165));L=m*.3+1.5;g=terrH(A[0]+d[0]*L,A[1]+d[1]*L)}
    const m1=Math.ceil(m/2),r=(Y-g)/m,at2=t=>[A[0]+d[0]*t,A[1]+d[1]*t],R=18*.165,LB=3.0,LU=18*.3,LP=2.2,
      P=[at2(-(LB+LU+LP)),at2(-(LB+LU)),at2(-LB),A,at2(m1*.3),at2(m1*.3+1.5),at2(L)],ys=[Y+R,Y+R,Y,Y,Y-m1*r,Y-m1*r,g];steelStair(P,ys,3.6,[0,0,1,0,0,0]);
    // the roof keeps clear of the upper flight and its deck
    const nx=-d[1],nz=d[0],q=(t,o)=>[A[0]+d[0]*t+nx*o,A[1]+d[1]*t+nz*o];Z.holes.push([q(-LB-.3,-1.95),q(-LB-.3,1.95),q(-(LB+LU+LP)-.6,1.95),q(-(LB+LU+LP)-.6,-1.95)]);
    // the end of the lookout: a rail across, and the leaning rust-red wall that the stair seems to climb toward
    const ST=mt(0x5c1e1c,.55,.35),yaw=Math.atan2(-d[0],-d[1]),put=(w,hh,dd,t,o,y,pitch=0)=>{const[x,z]=q(t,o),e=new THREE.Mesh(bgeo(w,hh,dd),ST);e.position.set(x,y,z);e.rotation.order='YXZ';e.rotation.set(pitch,yaw,0);e.castShadow=true;e.receiveShadow=true;e.userData.ts=1;sc.add(e)},te=-(LB+LU+LP);
    put(3.6,1.05,.07,te+.03,0,Y+R+.5);put(3.6,.06,.06,te+.2,0,Y+R+.98);put(3.9,3.6,.16,te-.35,0,Y+R+1.55,-.22);for(const o of[-1.7,1.7]){put(.18,Y+R-Y+3.4,.18,te-.45,o,Y+(R+3.4)/2)}}
  // (V130: the sloping apron that used to run out of the roof here is gone: the ground between Baldwin and Old Chemistry is filled level
  //  with the roof by ZFILL, and the tunnel stair down to Zimmer's lower level, zimTunnel(), sits in it)
  // the skybridges from Rieveschl land on the roof
  for(const k of Z.links){const dx=k.e[0]-k.o[0],dz=k.e[1]-k.o[1],l=Math.hypot(dx,dz)||1,s=[k.e[0]-dx/l*1.5,k.e[1]-dz/l*1.5];deckMk([s,[k.q[0]+dx/l*2.6,k.q[1]+dz/l*2.6]],[Y,Y],2.4,'link')}}
// a maroon steel stair: grating treads with pale nosings, solid cheek plates, handrails (and a centre rail when wide), posts under the landings
function steelStair(P,ys,w,openSeg){const d=deckMk(P,ys,w,'st');const ST=mt(0x5c1e1c,.55,.35),GRT=GC.grt||(GC.grt=SM({map:ctex(64,32,q=>{q.fillStyle='#9a9d9f';q.fillRect(0,0,64,32);q.fillStyle='#4a4d50';for(let x=2;x<64;x+=6)q.fillRect(x,3,3,26)}),roughness:.5,metalness:.5})),NO=mt(0xdad8d2,.6),hw=w/2;
  const put=(geo,m,x,y,z,yaw,pitch,cast=true)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.rotation.order='YXZ';e.rotation.set(pitch||0,yaw,0);e.castShadow=cast;e.userData.ts=1;e.receiveShadow=true;sc.add(e);return e};
  for(let i=0;i<P.length-1;i++){const[a,b]=P[i],[c,e]=P[i+1],L=Math.hypot(c-a,e-b);if(L<.05)continue;const ux=(c-a)/L,uz=(e-b)/L,nx=-uz,nz=ux,yaw=Math.atan2(ux,uz),ya=ys[i],yb=ys[i+1],dy=yb-ya,open=openSeg&&openSeg[i]===1;
    const pt=(t,o)=>[a+ux*t+nx*o,b+uz*t+nz*o];
    if(Math.abs(dy)<.02){const[x,z]=pt(L/2,0);put(bgeo(w-.1,.08,L+.1),GRT,x,ya-.04,z,yaw);
      if(!open)for(const s of[-1,1]){if(openSeg&&openSeg[i]===2&&s===1)continue;const[px,pz]=pt(L/2,s*(hw-.03));put(bgeo(.07,1.05,L+.08),ST,px,ya+.5,pz,yaw);put(bgeo(.06,.06,L),ST,...[pt(L/2,s*(hw-.2))].map(([x2,z2])=>[x2,ya+.98,z2])[0],yaw)}
      for(const s of[-1,1])for(const t of[.15,L-.15]){const[px,pz]=pt(t,s*(hw-.12)),g=terrH(px,pz);if(ya-g>.5)put(bgeo(.16,ya-g,.16),ST,px,(ya+g)/2,pz,0)}continue}
    const m=Math.max(1,Math.round(Math.abs(dy)/.165)),run=L/m,pitch=-Math.atan2(dy,L),len=Math.hypot(L,dy);
    for(let k=0;k<m;k++){const t=(k+.5)*run,y=ya+dy*(dy>0?(k+1):k)/m,[x,z]=pt(t,0);put(bgeo(w-.16,.05,run+.02),GRT,x,y-.025,z,yaw,0,false);const[nx2,nz2]=pt(dy>0?t-run/2+.03:t+run/2-.03,0);put(bgeo(w-.16,.04,.06),NO,nx2,y-.01,nz2,yaw,0,false)}
    const[mx,mz]=pt(L/2,0),my=(ya+yb)/2;put(bgeo(w-.1,.06,len),ST,mx,my-.32,mz,yaw,pitch);   // soffit under the treads
    for(const s of[-1,1]){const[px,pz]=pt(L/2,s*(hw-.03));put(bgeo(.07,1.25,len+.05),ST,px,my+.32,pz,yaw,pitch);   // cheek plates
      const[rx,rz]=pt(L/2,s*(hw-.22));put(bgeo(.055,.055,len),ST,rx,my+.96,rz,yaw,pitch)}                           // handrails
    if(w>=3.4){put(bgeo(.06,.06,len),ST,mx,my+.96,mz,yaw,pitch);for(let t=.3;t<L;t+=1.2){const[px,pz]=pt(t,0),y=ya+dy*t/L;put(bgeo(.05,.95,.05),ST,px,y+.48,pz,0)}}
    // a solid flank down to the ground under a high flight
    for(const s of[-1,1])for(let t=.5;t<L;t+=Math.max(2.4,(L-1)/Math.ceil((L-1)/3))){const[px,pz]=pt(t,s*(hw-.15)),y=ya+dy*t/L-.4,g=terrH(px,pz);if(y-g>.6)put(bgeo(.14,y-g,.14),ST,px,(y+g)/2,pz,yaw)}}
  // nobody on the ground walks through the stair
  const[bx0,bz0,bx1,bz1]=d.bb;cells(bx0,bz0,bx1,bz1,(k,x,z)=>{const q=deckQ(d,x,z);if(q.out!==0||q.off>d.hw+.1)return;const g=terrH(x,z);if(q.y-g>.9){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(q.y-g)))}});
  return d}

// ================================================================ V79 the promenade to the Lindner Center (south of the building, between the tennis courts and the soccer lawn):
// red brick pavers with a trench drain, a concrete strip with young street trees, disc-head lamps and black benches, and a low brick seat wall
// with a limestone cap along the soccer lawn; planters with small trees where the walk meets the Lindner plaza
function insetPoly(p,d){const n=p.length,E=p.map((a,i)=>{const b=p[(i+1)%n],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;let nx=-(b[1]-a[1])/L,nz=(b[0]-a[0])/L;if(!inPoly((a[0]+b[0])/2+nx*.2,(a[1]+b[1])/2+nz*.2,p)){nx=-nx;nz=-nz}return[nx,nz]});
  return p.map((q,i)=>{const A=E[(i+n-1)%n],B=E[i];let mx=A[0]+B[0],mz=A[1]+B[1];const dd=1+A[0]*B[0]+A[1]*B[1];if(dd<.2)return[q[0]+B[0]*d,q[1]+B[1]*d];return[q[0]+mx/dd*d,q[1]+mz/dd*d]})}
const brickPave=()=>GC.bpv||(GC.bpv=ctex(256,256,(q,w,h)=>{q.fillStyle='#7d5248';q.fillRect(0,0,w,h);const bw=32,bh=16;for(let r=0;r<h/bh;r++)for(let c=-1;c<w/bw+1;c++){const x=c*bw+(r%2?bw/2:0),y=r*bh,t=rnd();q.fillStyle=t<.3?'#9a6556':t<.6?'#a86e5c':t<.85?'#b57b66':'#8e5e50';q.fillRect(x+1,y+1,bw-2,bh-2)}}));
function drape(x0,z0,x1,z1,mat,unit,lift=.05){const nx=Math.max(2,Math.ceil((x1-x0)/2)),nz=Math.max(2,Math.ceil((z1-z0)/2)),P=[],U=[],I=[];for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const x=x0+(x1-x0)*i/nx,z=z0+(z1-z0)*j/nz;P.push(x,terrH(x,z)+lift,z);U.push(x/unit,-z/unit)}
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;I.push(a,c,b,b,c,d)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
  const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.ts=1;sc.add(m);return m}
function youngTree(x,z,s=1){const g=new THREE.Group();g.position.set(x,terrH(x,z),z);g.userData.ts=1;const T=mt(0x5a4630,.9),L=SM({color:0x6f9a3e,roughness:.9,flatShading:true});
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(.07*s,.1*s,3.2*s,7),T);tr.position.y=1.6*s;tr.castShadow=true;g.add(tr);
  for(const[dx,dy,dz,r]of[[0,3.6,0,1.15],[.55,3.1,.2,.8],[-.45,3.2,-.3,.85],[.1,4.3,.1,.8],[-.2,2.7,.45,.65]]){const b=new THREE.Mesh(GC.ytb||(GC.ytb=new THREE.IcosahedronGeometry(1,1)),L);b.scale.set(r*s,r*s*1.1,r*s);b.position.set(dx*s,dy*s,dz*s);b.castShadow=true;g.add(b)}
  for(const k of[0,1,2]){const st=new THREE.Mesh(GC.yts||(GC.yts=new THREE.CylinderGeometry(.025,.025,1.6,5)),mt(0xc9a46a,.9));const a=k*TAU/3;st.position.set(Math.cos(a)*.35,.8,Math.sin(a)*.35);st.rotation.set(Math.sin(a)*.12,0,-Math.cos(a)*.12);g.add(st)}
  sc.add(g);markC(x,z,.25,5)}
function discLamp(x,z){const g=new THREE.Group();g.position.set(x,terrH(x,z),z);g.userData.ts=1;const M=mt(0x2b2622,.5,.4);const p=new THREE.Mesh(new THREE.CylinderGeometry(.075,.09,5.2,8),M);p.position.y=2.6;p.castShadow=true;g.add(p);
  const d=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.07,24),mt(0x8a8478,.5,.4));d.position.y=5.3;d.castShadow=true;g.add(d);const l=new THREE.Mesh(new THREE.CircleGeometry(.3,16),bm(0xfff3d6));l.rotation.x=PI/2;l.position.y=5.255;g.add(l);
  sc.add(g);markC(x,z,.12,5);LAMPS2&&LAMPS2.push([x,z])}
let LAMPS2=[];
function planter(x0,z0,x1,z1,trees){const C=mt(0xdcd8cf,.85);const cx=(x0+x1)/2,cz=(z0+z1)/2,y=terrH(cx,cz);
  for(const[a,b,c,d]of[[x0,z0,x1,z0+.3],[x0,z1-.3,x1,z1],[x0,z0,x0+.3,z1],[x1-.3,z0,x1,z1]]){const e=box((a+c)/2,y+.18,(b+d)/2,c-a,.62,d-b,C);e.position.y=y+.18;e.userData.ts=1}
  const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0-.6,z1-z0-.6),mt(0x5a4230,1));m.rotation.x=-PI/2;m.position.set(cx,y+.4,cz);m.userData.ts=1;sc.add(m);
  const sh=GC.psh||(GC.psh=new THREE.IcosahedronGeometry(.35,1)),SH=SM({color:0x56743c,roughness:.9,flatShading:true});for(let i=0;i<Math.round((x1-x0)*(z1-z0)/2.2);i++){const x=x0+.6+rnd()*(x1-x0-1.2),z=z0+.6+rnd()*(z1-z0-1.2),b=new THREE.Mesh(sh,SH);b.scale.set(1,.6+rnd()*.3,1);b.position.set(x,y+.5,z);b.userData.ts=1;sc.add(b)}
  for(const[x,z]of trees)youngTree(x,z,.8);markR(x0,z0,x1,z1,.8)}
function lindnerWalk(){const Z0=386,Z1=468,XW=477.6;
  drape(466.2,Z0,477.25,Z1,SM({map:brickPave(),roughness:.9}),3.2,.06);                     // brick pavers
  drape(462.9,Z0,466.2,Z1,TM.concrete,4,.055);                                               // concrete strip with the trees, lamps and benches
  drape(476.85,Z0+20,477.25,Z1,mt(0x26282c,.6,.3),4,.075);                                    // trench drain along the wall
  // the seat wall: brick with a limestone cap, along the soccer lawn
  const BRK=SM({map:ctex(128,64,(q,w,h)=>{q.fillStyle='#d8cfc0';q.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let c=-1;c<5;c++){const x=c*32+(r%2?16:0);q.fillStyle=['#8a3a2a','#7a3224','#963f2c','#6e2c22'][(r*3+c+8)%4];q.fillRect(x+1,r*8+1,30,6)}}),roughness:.9}),CAP=mt(0xe6e0d2,.8);
  for(let z=Z0+20;z<Z1;z+=4){const zl=Math.min(z+4,Z1),zc=(z+zl)/2,g=terrH(XW,zc),L=zl-z;const w=new THREE.Mesh(bgeo(.5,1.3,L),BRK);w.position.set(XW,g+.3,zc);w.castShadow=w.receiveShadow=true;w.userData.ts=1;sc.add(w);
    const c=new THREE.Mesh(bgeo(.7,.14,L+.02),CAP);c.position.set(XW,g+1.0,zc);c.castShadow=true;c.userData.ts=1;sc.add(c)}
  markR(XW-.35,Z0+20,XW+.35,Z1,1.1);
  {const L=letters('RICHARD E. LINDNER CENTER',6.6,.42,'#efe6d2');L.position.set(XW-.26,terrH(XW,Z1-5)+.55,Z1-5);L.rotation.y=-PI/2;L.userData.ts=1;sc.add(L)}
  // street trees, disc lamps and benches down the concrete strip
  for(let z=Z0+24,i=0;z<Z1-2;z+=7.2,i++){youngTree(464.4,z,1);discLamp(465.9,z+3.6);if(i%2===0)bench(464.3,z+3.6,PI/2)}
  // planters at the Lindner end of the walk
  planter(463.2,Z0+3,469.6,Z0+15,[[465,Z0+6],[467.8,Z0+12]]);planter(478.2,Z0+3,484.4,Z0+15,[[480,Z0+6.5],[482.8,Z0+11.5]])}
// the Lindner Center: a white precast drum lifted on V piers over a recessed glass lobby
function lindnerBase(p,h,b){const ip=insetPoly(p,1.9),H0=4.8;prism(ip,0,H0,'glass',0x2a2c30,{solid:false});
  const sh=new THREE.Shape(p.map(([x,z])=>new THREE.Vector2(x,z)));const sg=new THREE.ShapeGeometry(sh);sg.rotateX(PI/2);const so=new THREE.Mesh(sg,mt(0xcfcac0,.9));so.position.y=H0;sc.add(so);
  const n=p.length,M=mt(0xe2ded6,.85);let acc=0;for(let i=0;i<n;i++){const a=p[i],c=p[(i+1)%n],L=Math.hypot(c[0]-a[0],c[1]-a[1]);if(L<.01)continue;const ux=(c[0]-a[0])/L,uz=(c[1]-a[1])/L;let nx=-uz,nz=ux;if(!inPoly((a[0]+c[0])/2+nx*.3,(a[1]+c[1])/2+nz*.3,p)){nx=-nx;nz=-nz}
    for(let t=(5.2-acc%5.2);t<L;t+=5.2){const x=a[0]+ux*t+nx*.55,z=a[1]+uz*t+nz*.55;for(const s of[-1,1]){const lg=new THREE.Mesh(bgeo(.42,H0/Math.cos(.24),.5),M);lg.position.set(x+ux*s*.58,H0/2,z+uz*s*.58);lg.rotation.y=Math.atan2(ux,uz);lg.rotateX(0);lg.rotateZ(0);lg.rotation.set(0,Math.atan2(ux,uz)+PI/2,s*.24,'YXZ');lg.castShadow=true;sc.add(lg)}}acc+=L}
  return ip}

// ================================================================ V80 CCM / Mary Emery Hall: the TUC bridge head is filled in level with the plaza; the walk on Mary Emery's
// podium is brick and open (no railing between the bridge walk and the roof), and the podium roof runs to a grand brick-walled stair down into the CCM plaza
const CCMG={"area": [[304.0, 406.75], [305.5, 406.75], [307.0, 407.75], [308.0, 407.75], [309.0, 408.75], [311.5, 409.25], [314.0, 410.75], [320.0, 412.75], [321.25, 414.0], [321.0, 414.75], [326.03, 416.76], [324.41, 420.76], [332.36, 420.31], [334.78, 421.31], [335.95, 417.89], [335.92, 416.33], [335.0, 417.25], [327.5, 414.25], [326.75, 413.5], [327.47, 411.34], [325.25, 410.25], [324.5, 410.25], [323.0, 409.25], [321.5, 409.25], [315.5, 406.25], [315.0, 406.25], [312.25, 404.88], [310.5, 405.75], [309.75, 405.0], [309.75, 404.0], [310.5, 403.25], [311.5, 403.25], [312.14, 402.18], [312.03, 401.84], [310.5, 400.75], [308.5, 402.25], [307.5, 402.25], [306.75, 401.5], [307.75, 399.5], [306.87, 397.74], [305.15, 396.94], [301.39, 405.06], [303.11, 405.86]], "ups": [[[336.22, 413.97], [336.22, 413.97], [336.23, 413.95], [335.95, 413.1], [338.25, 408.5], [338.25, 407.5], [337.54, 406.79], [333.0, 405.25], [332.77, 405.03], [332.75, 405.0], [332.56, 404.83], [326.73, 399.29], [325.43, 398.51], [324.19, 397.41], [323.29, 397.22], [323.0, 397.05], [321.0, 396.75], [318.92, 395.82], [313.71, 395.35], [313.69, 395.34], [313.67, 395.34], [313.21, 395.3], [312.85, 395.43], [310.0, 395.75], [307.75, 397.5], [307.25, 398.5], [307.75, 399.5], [306.75, 401.5], [307.5, 402.25], [308.5, 402.25], [310.5, 400.75], [312.03, 401.84], [312.14, 402.18], [311.5, 403.25], [310.5, 403.25], [309.75, 404.0], [309.75, 405.0], [310.5, 405.75], [312.25, 404.88], [315.0, 406.25], [315.5, 406.25], [321.5, 409.25], [323.0, 409.25], [324.5, 410.25], [325.25, 410.25], [326.5, 410.81], [327.47, 411.34], [326.75, 413.5], [327.5, 414.25], [335.0, 417.25], [335.75, 416.5], [335.75, 414.5]], [[311.68, 463.2], [311.3, 459.45], [310.71, 457.93], [310.57, 457.76], [310.25, 457.0], [309.0, 455.75], [305.1, 453.9], [310.67, 440.6], [311.75, 437.0], [313.4, 434.07], [316.25, 426.0], [319.25, 420.0], [321.25, 414.0], [320.0, 412.75], [314.0, 410.75], [311.5, 409.25], [309.0, 408.75], [308.0, 407.75], [307.0, 407.75], [305.5, 406.75], [304.0, 406.75], [303.5, 406.25], [302.5, 407.25], [293.48, 403.27], [292.45, 404.3], [290.69, 409.26], [289.62, 411.66], [288.75, 413.28], [288.75, 413.63], [286.75, 418.13], [286.75, 419.5], [289.0, 421.25], [295.5, 423.25], [296.75, 425.0], [295.25, 427.0], [295.25, 429.5], [289.75, 441.42], [289.75, 442.5], [287.61, 446.22], [287.25, 448.0], [286.04, 449.78], [284.48, 449.35], [284.42, 449.33], [283.33, 450.42], [282.81, 451.7], [282.7, 451.86], [280.25, 458.0], [282.32, 459.32], [288.78, 461.56], [290.11, 462.16], [290.23, 462.06], [298.0, 464.75], [299.0, 465.41], [313.0, 470.25], [316.07, 471.66], [317.74, 469.51], [309.75, 465.0], [310.5, 465.25]]], "main": [[310.84, 465.8], [311.63, 463.19], [311.33, 459.67], [310.01, 456.23], [305.04, 453.93], [321.12, 415.48], [320.72, 415.3], [320.95, 414.73], [326.03, 416.76], [324.41, 420.76], [332.36, 420.31], [334.78, 421.31], [335.95, 417.89], [335.88, 414.71], [338.82, 407.35], [332.47, 404.85], [329.08, 401.08], [324.17, 397.45], [318.91, 395.87], [313.25, 395.35], [309.45, 395.82], [309.55, 396.09], [307.78, 396.73], [306.9, 397.67], [302.56, 407.05], [292.98, 403.13], [284.28, 424.25], [295.51, 428.64], [286.0, 449.94], [283.92, 449.21], [279.88, 458.37], [316.74, 471.85], [317.81, 469.21]]};
function ccmDecks(){const lv=.53,Y=4.2+lv,BRK=SM({map:brickPave(),roughness:.9});
  const flatPoly=(p,y,mat,unit)=>{const sh=new THREE.Shape(p.map(([x,z])=>new THREE.Vector2(x,-z))),g=new THREE.ShapeGeometry(sh);const uv=g.attributes.uv,ps=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,ps.getX(i)/unit,ps.getY(i)/unit);g.rotateX(-PI/2);const m=new THREE.Mesh(g,mat);m.position.y=y;m.receiveShadow=true;m.userData.ts=1;sc.add(m);return m};
  const areaDeck=(poly,y)=>{const bb=bbox(poly),n=poly.length,cx=poly.reduce((s,p)=>s+p[0],0)/n,cz=poly.reduce((s,p)=>s+p[1],0)/n;const d={area:{poly,holes:[]},P:[[cx,cz],[cx+.1,cz]],ys:[y,y],s:[0,2],L:2,hw:99,w:198,k:'area',cov:0,bb:[bb[0]-.5,bb[1]-.5,bb[2]+.5,bb[3]+.5],t0:0,t1:2,y};DECKS.push(d);return d};
  const RL=mt(0x22252a,.5,.4),rail=(x0,z0,x1,z1,y)=>{const L=Math.hypot(x1-x0,z1-z0);if(L<.2)return;const cx=(x0+x1)/2,cz=(z0+z1)/2,ry=Math.atan2(x1-x0,z1-z0);const t=new THREE.Mesh(bgeo(.06,.06,L),RL);t.position.set(cx,y+1.05,cz);t.rotation.y=ry;t.userData.ts=1;sc.add(t);
    const m=new THREE.Mesh(bgeo(.04,.04,L),RL);m.position.set(cx,y+.12,cz);m.rotation.y=ry;m.userData.ts=1;sc.add(m);for(let s=0;s<=L+1e-3;s+=.14){const x=x0+(x1-x0)*s/L,z=z0+(z1-z0)*s/L,b=new THREE.Mesh(GC.rbal||(GC.rbal=new THREE.BoxGeometry(.025,.95,.025)),RL);b.position.set(x,y+.58,z);b.userData.ts=1;sc.add(b)}
    cells(Math.min(x0,x1)-.2,Math.min(z0,z1)-.2,Math.max(x0,x1)+.2,Math.max(z0,z1)+.2,(k,x,z)=>{const vx=x1-x0,vz=z1-z0,t=clamp(((x-x0)*vx+(z-z0)*vz)/(L*L),0,1);if(Math.hypot(x-x0-vx*t,z-z0-vz*t)<.3){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(y+1.1-terrH(x,z))))}})};
  // 1) the TUC bridge head: fill the hollow between the plaza and the bridge with a paved platform
  {const p=[[299.8,362.4],[305.7,362.4],[305.7,377.6],[299.8,377.6]],y=3.18;areaDeck(p,y);{const tm=sc.children.find(o=>o.userData&&o.userData.terrain),m=flatPoly(p,y+.02,TM.concrete,4);if(tm){const G=tm.geometry,ps=G.attributes.position,uv=G.attributes.uv,n=ps.count-1;tm.updateMatrixWorld();const v0=new THREE.Vector3().fromBufferAttribute(ps,0).applyMatrix4(tm.matrixWorld),v1=new THREE.Vector3().fromBufferAttribute(ps,n).applyMatrix4(tm.matrixWorld);
      const ku=(uv.getX(n)-uv.getX(0))/((v1.x-v0.x)||1),kv=(uv.getY(n)-uv.getY(0))/((v1.z-v0.z)||1),U=m.geometry.attributes.uv,Pp=m.geometry.attributes.position;m.updateMatrixWorld();const w=new THREE.Vector3();for(let i=0;i<U.count;i++){w.fromBufferAttribute(Pp,i);U.setXY(i,uv.getX(0)+(w.x-v0.x)*ku,uv.getY(0)+(w.z-v0.z)*kv)}U.needsUpdate=true;m.material=tm.material}}
    const C=mt(0xb8b2a6,.9);for(const[x0,z0,x1,z1]of[[299.8,377.4,305.7,377.65],[305.45,362.4,305.7,377.65]]){const xm=(x0+x1)/2,zm=(z0+z1)/2;let g=y;for(let t=0;t<=1;t+=.1)g=Math.min(g,terrH(x0+(x1-x0)*t,z0+(z1-z0)*t));const w=new THREE.Mesh(bgeo(x1-x0,y-g+.6,z1-z0),C);w.position.set(xm,(y+g-.6)/2,zm);w.castShadow=w.receiveShadow=true;w.userData.ts=1;sc.add(w)}
    {const dx=-.378,dz=.926,ex=.926*1.5,ez=.378*1.5,c0=[302.5,375.4],tz=(377.6-c0[1])/dz,R0=[c0[0]+dx*tz+ex,377.6],L0=[c0[0]+dx*tz-ex,377.6];
      rail(R0[0],377.6,305.6,377.6,y);rail(305.6,377.6,305.6,375.4,y);rail(R0[0],377.6,R0[0]+dx*1.6,377.6+dz*1.6,y);rail(L0[0],377.6,L0[0]+dx*1.6,377.6+dz*1.6,y);if(L0[0]>299.85)rail(299.8,377.6,L0[0],377.6,y)}
    cells(299.8,362.4,305.7,377.6,(k,x,z)=>{if(y-terrH(x,z)>.9){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(y-terrH(x,z))))}})}
  // 2) Mary Emery's podium roof: brick, walkable, open to the bridge walk; railings only where it drops to the ground
  const A=CCMG.area,inUp=(x,z)=>CCMG.ups.some(u=>inPoly(x,z,u)),inMain=(x,z)=>inPoly(x,z,CCMG.main);areaDeck(A,Y);flatPoly(A,Y+.03,BRK,3.2);
  const SX0=327.4,SX1=331.6,SZ=420.55;  // the stair opening on the plaza edge
  for(let i=0;i<A.length;i++){const[a,b]=A[i],[c,d]=A[(i+1)%A.length],L=Math.hypot(c-a,d-b);if(L<.3)continue;let nx=-(d-b)/L,nz=(c-a)/L;if(inPoly((a+c)/2+nx*.3,(b+d)/2+nz*.3,A)){nx=-nx;nz=-nz}
    const segs=[];let st=null;for(let t=0;t<=L+1e-3;t+=.25){const x=a+(c-a)*t/L,z=b+(d-b)*t/L,ox=x+nx*.6,oz=z+nz*.6,drop=!inUp(ox,oz)&&!(inMain(ox,oz)&&!inPoly(ox,oz,A))&&!(x>SX0&&x<SX1&&z>SZ-.6)&&!pod_(ox,oz);
      if(drop&&!st)st=[x,z];if((!drop||t+.25>L+1e-3)&&st){segs.push([st[0],st[1],x,z]);st=null}}
    for(const s of segs)rail(s[0],s[1],s[2],s[3],Y)}
  // 3) the grand stair down into the CCM plaza: stone treads between brick cheek walls with limestone coping and steel handrails
  {const x=(SX0+SX1)/2,W=SX1-SX0,z0=SZ;let g=terrH(x,z0+10),m,L;for(let it=0;it<4;it++){m=Math.round((Y-g)/.162);L=m*.31;g=terrH(x,z0+L)}const r=(Y-g)/m;
    const d=deckMk([[x,z0-1.2],[x,z0],[x,z0+L]],[Y,Y,g],W,'st');d.cst=1;d.t0=0;d.t1=d.L;
    const ST=mt(0xd9d3c4,.85),CAP=mt(0xe6e0d2,.8),BW=SM({map:ctex(128,64,(q,w,h)=>{q.fillStyle='#d8cfc0';q.fillRect(0,0,w,h);for(let rr=0;rr<8;rr++)for(let c=-1;c<5;c++){const xx=c*32+(rr%2?16:0);q.fillStyle=['#8a3a2a','#7a3224','#963f2c','#6e2c22'][(rr*3+c+8)%4];q.fillRect(xx+1,rr*8+1,30,6)}}),roughness:.9});
    for(let k=0;k<m;k++){const yk=Y-r*(k+1),zc=z0+.31*(k+.5),gb=Math.min(terrH(x,zc),yk)-.4,e=new THREE.Mesh(bgeo(W,yk-gb+.02,.31),ST);e.position.set(x,(yk+gb)/2,zc);e.castShadow=e.receiveShadow=true;e.userData.ts=1;sc.add(e)}
    for(const sx of[-1,1]){const wx=x+sx*(W/2+.25);for(let k=0;k<m;k+=3){const k1=Math.min(m,k+3),za=z0+.31*k,zb=z0+.31*k1,ya=Y-r*k,yb=Y-r*k1,top=(ya+yb)/2+1.0,gb=Math.min(terrH(wx,(za+zb)/2),yb)-.5;
        const w=new THREE.Mesh(bgeo(.5,top-gb,zb-za+.01),BW);w.position.set(wx,(top+gb)/2,(za+zb)/2);w.castShadow=w.receiveShadow=true;w.userData.ts=1;sc.add(w);const c=new THREE.Mesh(bgeo(.62,.12,zb-za+.02),CAP);c.position.set(wx,top+.06,(za+zb)/2);c.userData.ts=1;sc.add(c)}
      {const p0=new THREE.Vector3(x+sx*(W/2-.08),Y+.95,z0+.15),p1=new THREE.Vector3(x+sx*(W/2-.08),g+.95,z0+L-.15),Lr=p0.distanceTo(p1),hr=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,Lr,8),mt(0xb8bcc2,.35,.7));hr.position.copy(p0).add(p1).multiplyScalar(.5);hr.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p1.clone().sub(p0).normalize());hr.userData.ts=1;sc.add(hr);
        for(let t=.4;t<L;t+=1.8){const pz=z0+t,py=Y-(t/L)*(Y-g),pp=new THREE.Mesh(GC.hrp||(GC.hrp=new THREE.CylinderGeometry(.025,.025,.95,6)),mt(0xb8bcc2,.35,.7));pp.position.set(x+sx*(W/2-.08),py+.47,pz);pp.userData.ts=1;sc.add(pp)}}
      markR(wx-.3,z0,wx+.3,z0+L,2)}
    cells(x-W/2,z0,x+W/2,z0+L,(k,xx,zz)=>{const t=zz-z0,yy=Y-(t/L)*(Y-g),h=yy-terrH(xx,zz);if(h>.9){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(h)))}})}
  // the bridge walk along the podium gets the same brick
  {const P=[[292.8,401],[301.6,404.6],[305.3,396.6],[306.7,395.1],[308.9,394.3]],w=1.42,Pa=[],Ua=[];for(let i=0;i<P.length-1;i++){const[a,b]=P[i],[c,d]=P[i+1],L=Math.hypot(c-a,d-b),nx=-(d-b)/L*w,nz=(c-a)/L*w,q=[[a+nx,b+nz],[a-nx,b-nz],[c-nx,d-nz],[c+nx,d+nz]];for(const j of[0,1,2,0,2,3]){Pa.push(q[j][0],4.57+.045,q[j][1]);Ua.push(q[j][0]/3.2,-q[j][1]/3.2)}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Pa,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(Ua,2));g.computeVertexNormals();const mm=new THREE.Mesh(g,new THREE.MeshStandardMaterial?BRK:BRK);mm.material.side=THREE.DoubleSide;mm.receiveShadow=true;mm.userData.ts=1;sc.add(mm)}}
const pod_=(x,z)=>{const P=[[292.8,401],[301.6,404.6],[305.3,396.6],[306.7,395.1],[308.9,394.3]];for(let i=0;i<P.length-1;i++){const[a,b]=P[i],[c,d]=P[i+1],vx=c-a,vz=d-b,L2=vx*vx+vz*vz,t=clamp(((x-a)*vx+(z-b)*vz)/L2,0,1);if(Math.hypot(x-a-vx*t,z-b-vz*t)<1.8)return true}return false};

// ================================================================ V82 CCM Village: the glass breezeway between Corbett and Memorial Hall (its roof a brick terrace at the upper level),
// the grand stair up from the CCM plaza beside it, Memorial Hall as the Collegiate Gothic "castle" with its tower, cornices, ledges and gargoyles,
// Mary Emery Hall's brick with horizontal ribbon windows and the glass sails on its roof, and the plaza's stone spheres and bollards
const BZ={W:[317.27,470.53],u:[.931,.372],n:[.372,-.931],L:28.7,oN:1.43,oS:-3.05,yF:-3.15,yR:.42};
const bzP=(t,o)=>[BZ.W[0]+BZ.u[0]*t+BZ.n[0]*o,BZ.W[1]+BZ.u[1]*t+BZ.n[1]*o];
const BZRY=-Math.atan2(BZ.u[1],BZ.u[0]);
function bzBox(t,o,y,lt,lo,h,mat,cast=true){const[x,z]=bzP(t,o),m=new THREE.Mesh(bgeo(lt,h,lo),mat);m.position.set(x,y,z);m.rotation.y=BZRY;m.castShadow=cast;m.receiveShadow=true;m.userData.ts=1;sc.add(m);return m}
function ccmRibbon(q,lit,glassG,S){// Mary Emery Hall: dark red-brown brick with continuous ribbon windows, one band per storey
  q.fillStyle='#7f4130';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*9;for(let x=-off;x<S;x+=18){q.fillStyle=shade('#8e4a36',rnd()*16-8);q.fillRect(x+1,y+1,16,6)}}
  for(let r=0;r<4;r++){const y=r*128+52;q.fillStyle='#5e2f22';q.fillRect(0,y-5,S,5);glassG(q,0,y,S,46);for(let x=0;x<S;x+=24){q.fillStyle='#3a3f46';q.fillRect(x,y,3,46);lit(x+3,y,21,46)}q.fillStyle='#3a3f46';q.fillRect(0,y+20,S,2);q.fillStyle='rgba(0,0,0,.3)';q.fillRect(0,y+46,S,4)}}
function ccmVillage(){const GLS=SM({color:0xa9cbe0,roughness:.05,metalness:.25,transparent:true,opacity:.26,depthWrite:false,side:THREE.DoubleSide}),MUL=mt(0x2a2e34,.4,.5),SLAB=mt(0xc9c3b6,.85),BRK=SM({map:brickPave(),roughness:.9});
  const BW=SM({map:ctex(128,64,(q,w,h)=>{q.fillStyle='#d8cfc0';q.fillRect(0,0,w,h);for(let rr=0;rr<8;rr++)for(let c=-1;c<5;c++){const xx=c*32+(rr%2?16:0);q.fillStyle=['#8a3a2a','#7a3224','#963f2c','#6e2c22'][(rr*3+c+8)%4];q.fillRect(xx+1,rr*8+1,30,6)}}),roughness:.9}),CAP=mt(0xe6e0d2,.8),RLM=mt(0x22252a,.5,.4);
  const{L,oN,oS,yF,yR}=BZ,oM=(oN+oS)/2,W_=oN-oS;
  // ---- the breezeway: glass on both long sides so you see straight through, a thin roof slab, a floor on a plinth, lights inside
  bzBox(L/2,oM,yR-.16,L+.6,W_+.9,.32,SLAB);bzBox(L/2,oM,yF-.1,L,W_,.2,mt(0x9a948a,.9),false);
  {let gmin=yF;for(let t=0;t<=L;t+=2)for(const o of[oN,oS])gmin=Math.min(gmin,terrH(...bzP(t,o)));if(gmin<yF-.2)bzBox(L/2,oM,(yF-.2+gmin-.4)/2,L,W_,yF-.2-gmin+.4,mt(0xb8b2a6,.9))}
  const gh=yR-.32-yF;for(const o of[oN,oS]){bzBox(L/2,o,yF+gh/2,L-.2,.04,gh,GLS,false);for(let t=.2;t<=L-.1;t+=1.6)bzBox(t,o,yF+gh/2,.09,.12,gh,MUL);bzBox(L/2,o,yF+2.45,L-.2,.1,.08,MUL);bzBox(L/2,o,yF+.06,L-.2,.14,.12,MUL)}
  for(let t=1.6;t<L-1;t+=3.2){const lt=new THREE.Mesh(bgeo(1.4,.05,.3),bm(0xfff4d8));const[x,z]=bzP(t,oM);lt.position.set(x,yR-.35,z);lt.rotation.y=BZRY;lt.userData.ts=1;sc.add(lt)}
  {const poly=[bzP(0,oN),bzP(L,oN),bzP(L,oS),bzP(0,oS)];markPoly(poly,4)}
  // ---- the terrace on the breezeway roof: brick, at the hill's level, leads on toward Calhoun
  const TY=yR+.03,TP=[bzP(.15,2.0),bzP(26.4,2.0),bzP(26.4,2.7),bzP(L-.1,2.7),bzP(L-.1,oS),bzP(.15,oS)];{const sh=new THREE.Shape(TP.map(([x,z])=>new THREE.Vector2(x,-z))),g=new THREE.ShapeGeometry(sh);const uv=g.attributes.uv,ps=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,ps.getX(i)/3.2,ps.getY(i)/3.2);g.rotateX(-PI/2);const m=new THREE.Mesh(g,BRK);m.position.y=TY;m.receiveShadow=true;m.userData.ts=1;sc.add(m)}
  {const bb=bbox(TP),cx=TP.reduce((s,p)=>s+p[0],0)/TP.length,cz=TP.reduce((s,p)=>s+p[1],0)/TP.length;DECKS.push({area:{poly:TP,holes:[]},P:[[cx,cz],[cx+.1,cz]],ys:[TY,TY],s:[0,2],L:2,hw:99,w:198,k:'area',cov:0,bb:[bb[0]-.5,bb[1]-.5,bb[2]+.5,bb[3]+.5],t0:0,t1:2,y:TY})}
  const rail=(a,b,y)=>{const L2=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L2<.2)return;const cx=(a[0]+b[0])/2,cz=(a[1]+b[1])/2,ry=Math.atan2(b[0]-a[0],b[1]-a[1]);const t=new THREE.Mesh(bgeo(.06,.06,L2),RLM);t.position.set(cx,y+1.05,cz);t.rotation.y=ry;t.userData.ts=1;sc.add(t);
    const m=new THREE.Mesh(bgeo(.04,.04,L2),RLM);m.position.set(cx,y+.12,cz);m.rotation.y=ry;m.userData.ts=1;sc.add(m);for(let s=0;s<=L2+1e-3;s+=.14){const x=a[0]+(b[0]-a[0])*s/L2,z=a[1]+(b[1]-a[1])*s/L2,p=new THREE.Mesh(GC.rbal||(GC.rbal=new THREE.BoxGeometry(.025,.95,.025)),RLM);p.position.set(x,y+.58,z);p.userData.ts=1;sc.add(p)}
    cells(Math.min(a[0],b[0])-.2,Math.min(a[1],b[1])-.2,Math.max(a[0],b[0])+.2,Math.max(a[1],b[1])+.2,(k,x,z)=>{const vx=b[0]-a[0],vz=b[1]-a[1],t2=clamp(((x-a[0])*vx+(z-a[1])*vz)/(L2*L2),0,1);if(Math.hypot(x-a[0]-vx*t2,z-a[1]-vz*t2)<.3){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(y+1.1-terrH(x,z))))}})};
  rail(bzP(.15,2.0),bzP(26.3,2.0),TY);rail(bzP(.15,2.0),bzP(.15,oS),TY);
  {let st=null;for(let t=.15;t<=L+.01;t+=.5){const drop=terrH(...bzP(t,oS-.5))<TY-.7&&!(t>22.3&&t<25.7);if(drop&&!st)st=t;if((!drop||t+.5>L)&&st!=null){rail(bzP(st,oS),bzP(t,oS),TY);st=null}}}
  // ---- the grand stair from the plaza: stone treads, two landings, brick cheek walls with limestone coping, steel handrails
  {const oC=oN+.5+2.1,SW=4.2,T=[13.2,15,20,22,27,29.6],Y=[yF,yF,-1.4,-1.4,TY,TY],P=T.map(t=>bzP(t,oC));const d=deckMk(P,Y,SW,'st');d.cst=1;d.t0=0;d.t1=d.L;
    const ST=mt(0xd6d0c2,.85);for(let i=0;i<T.length-1;i++){const ta=T[i],tb=T[i+1],ya=Y[i],yb=Y[i+1],l=tb-ta;if(Math.abs(yb-ya)<.02){const g=Math.min(terrH(...bzP((ta+tb)/2,oC)),ya)-.4;bzBox((ta+tb)/2,oC,(ya+g)/2,l,SW,ya-g,ST);continue}
      const m=Math.round(Math.abs(yb-ya)/.16),r=(yb-ya)/m,run=l/m;for(let k=0;k<m;k++){const yk=ya+r*(k+1),tc=ta+run*(k+.5),g=Math.min(terrH(...bzP(tc,oC)),yk)-.4;bzBox(tc,oC,(yk+g)/2,run+.01,SW,yk-g,ST)}}
    for(const[o,hi,tEnd]of[[oC+SW/2+.25,1.0,T[T.length-1]],[oC-SW/2-.25,.55,26.8]]){for(let t=T[0];t<tEnd-.01;t+=1.2){const t2=Math.min(tEnd,t+1.2),yy=deckY(d,(t+t2)/2-T[0]),top=yy+hi,g=Math.min(terrH(...bzP((t+t2)/2,o)),yy)-.5;
        bzBox((t+t2)/2,o,(top+g)/2,t2-t+.01,.5,top-g,BW);bzBox((t+t2)/2,o,top+.06,t2-t+.03,.62,.12,CAP)}}
    for(const o of[oC+SW/2-.1,oC-SW/2+.1,oC]){for(let i=0;i<T.length-1;i++){const[a0,b0]=bzP(T[i],o),[a1,b1]=bzP(T[i+1],o),p0=new THREE.Vector3(a0,Y[i]+.95,b0),p1=new THREE.Vector3(a1,Y[i+1]+.95,b1),Lr=p0.distanceTo(p1);if(Lr<.1)continue;
        const hr=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,Lr,8),mt(0xb8bcc2,.35,.7));hr.position.copy(p0).add(p1).multiplyScalar(.5);hr.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p1.clone().sub(p0).normalize());hr.userData.ts=1;sc.add(hr);
        for(const f of[.1,.9]){const pp=new THREE.Mesh(GC.hrp||(GC.hrp=new THREE.CylinderGeometry(.025,.025,.95,6)),mt(0xb8bcc2,.35,.7));pp.position.set(a0+(a1-a0)*f,Y[i]+(Y[i+1]-Y[i])*f+.47,b0+(b1-b0)*f);pp.userData.ts=1;sc.add(pp)}}}
    {const q=[bzP(T[0],oC+SW/2+.5),bzP(T[T.length-1],oC+SW/2+.5),bzP(T[T.length-1],oC+SW/2),bzP(T[0],oC+SW/2)];markPoly(q,2)}
    cells(...bbox(P.map(p=>p)).map((v,i)=>v+(i<2?-3:3)),(k,x,z)=>{const q=deckQ(d,x,z);if(q.out!==0||q.off>d.hw)return;const h=q.y-terrH(x,z);if(h>.9){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(h)))}})}
  // ---- steps down from the terrace's south edge onto the hill
  let oB=oS-2;{for(let it=0;it<4;it++){const g=terrH(...bzP(24,oB)),m=Math.max(3,Math.round((TY-g)/.16));oB=oS-m*.32}const g=terrH(...bzP(24,oB));const d=deckMk([bzP(24,oS+.6),bzP(24,oS),bzP(24,oB)],[TY,TY,g],3.0,'st');d.t0=0;d.t1=d.L}
  // ---- a paved walk from the terrace across the hill to the steps down to Calhoun Street beside Siddall Hall
  {const pts=[bzP(24,oB-.3),[331,494],[323,507],[318.9,519],[318.5,531]];for(let i=0;i<pts.length-1;i++){const[a,b]=pts[i],[c,e]=pts[i+1],Lw=Math.hypot(c-a,e-b),n=Math.ceil(Lw/1.5),nx=-(e-b)/Lw*1.3,nz=(c-a)/Lw*1.3,Pa=[];
      for(let k=0;k<n;k++){const f0=k/n,f1=(k+1)/n,x0=a+(c-a)*f0,z0=b+(e-b)*f0,x1=a+(c-a)*f1,z1=b+(e-b)*f1,Q=[[x0+nx,z0+nz],[x0-nx,z0-nz],[x1-nx,z1-nz],[x1+nx,z1+nz]].map(([x,z])=>[x,terrH(x,z)+.05,z]);for(const j of[0,1,2,0,2,3])Pa.push(...Q[j])}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Pa,3));g.computeVertexNormals();const m=new THREE.Mesh(g,TM.concrete);m.material.side=THREE.DoubleSide;m.receiveShadow=true;m.userData.ts=1;sc.add(m)}}
  // ---- Mary Emery Hall's glass sails over the curved roof
  {const Y0=.53+13.8,dir=[-.161,.987],ry=-Math.atan2(dir[1],dir[0]),sh=new THREE.Shape();sh.moveTo(-2.2,0);sh.lineTo(2.2,0);sh.lineTo(.9,5.2);sh.lineTo(-2.2,0);const G=new THREE.ExtrudeGeometry(sh,{depth:.5,bevelEnabled:false});G.translate(0,0,-.25);
    for(const[x,z]of[[306.6,417.1],[304.6,429.7],[302.5,442.3],[300.4,454.9]]){const g=new THREE.Group();g.position.set(x,Y0,z);g.rotation.y=ry;g.scale.setScalar(1.6);g.userData.ts=1;sc.add(g);const m=new THREE.Mesh(G,SM({color:0xb9d4e4,roughness:.08,metalness:.35,transparent:true,opacity:.7}));m.castShadow=true;g.add(m);
      for(const[a,b]of[[[-2.2,0],[.9,5.2]],[[2.2,0],[.9,5.2]]]){const L3=Math.hypot(b[0]-a[0],b[1]-a[1]),e=new THREE.Mesh(bgeo(.12,L3,.6),mt(0xd8dcdf,.4,.5));e.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,0);e.rotation.z=Math.atan2(-(b[0]-a[0]),b[1]-a[1]);g.add(e)}
      const bs=new THREE.Mesh(bgeo(4.8,.5,1.2),mt(0x8e4a36,.9));bs.position.y=-.1;g.add(bs)}}
  // ---- the plaza's stone spheres and white bollards along Mary Emery's curved front
  {const A=[330.6,434.5],B=[319.2,462];const n=10;for(let i=0;i<=n;i++){const x=A[0]+(B[0]-A[0])*i/n,z=A[1]+(B[1]-A[1])*i/n,g=terrH(x,z);if(solid(x,z))continue;
      if(i%2===0){const s=new THREE.Mesh(GC.cball||(GC.cball=new THREE.SphereGeometry(.42,18,12)),mt(0xb9b4aa,.85));s.position.set(x,g+.4,z);s.castShadow=true;s.userData.ts=1;sc.add(s);markC(x,z,.42,.9)}
      else{const p=new THREE.Mesh(GC.cbol||(GC.cbol=new THREE.CylinderGeometry(.11,.11,.95,10)),mt(0xe8e6e0,.6));p.position.set(x,g+.47,z);p.castShadow=true;p.userData.ts=1;sc.add(p);const band=new THREE.Mesh(GC.cbolb||(GC.cbolb=new THREE.CylinderGeometry(.115,.115,.08,10)),mt(0xc8102e,.5));band.position.set(x,g+.82,z);band.userData.ts=1;sc.add(band);markC(x,z,.12,1)}}}}
// ---- Memorial Hall: Collegiate Gothic brick with limestone plinth, string courses, a crenellated cornice, a central tower with an arched entry,
// corner turrets and gargoyles (called inside the building loop: y is measured from the building's own base)
function castleX(b,main,h){const LS=mt(0xd9cfb8,.85),LSD=mt(0xbfb5a0,.9),GG=mt(0x8f8a80,.9),DK=mt(0x1d2228,.4,.2),BR=fm('brick');
  const ob=(x,y,z,w,hh,d,ry,mat,cast=true)=>{const m=new THREE.Mesh(bgeo(w,hh,d),mat);m.position.set(x,y,z);m.rotation.y=ry;m.castShadow=cast;m.receiveShadow=true;sc.add(m);return m};
  const gargoyle=(x,y,z,ox,oz)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=Math.atan2(ox,oz);sc.add(g);
    const P=(geo,px,py,pz,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,GG);m.position.set(px,py,pz);m.rotation.set(rx,ry,rz);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m};
    P(bgeo(.32,.3,1.1),0,0,.45);P(new THREE.IcosahedronGeometry(.24,1),0,.08,1.05,0,0,0,1,.9,1.15);P(bgeo(.2,.12,.32),0,0,1.32);P(new THREE.ConeGeometry(.06,.26,5),-.12,.32,1.0,-.4,0,.3);P(new THREE.ConeGeometry(.06,.26,5),.12,.32,1.0,-.4,0,-.3);
    for(const s of[-1,1]){P(new THREE.ConeGeometry(.22,.6,3),s*.28,.12,.55,0,0,s*1.2,1,1,.5);P(bgeo(.07,.28,.07),s*.12,-.22,.85,.3)}
    const sp=P(new THREE.CylinderGeometry(.04,.04,.25,6),0,-.02,1.48,PI/2);return g};
  // limestone plinth, string courses (ledges) and the crenellated cornice along every wall
  const n=main.length;for(let i=0;i<n;i++){const[a,c]=main[i],[e,f]=main[(i+1)%n],L=Math.hypot(e-a,f-c);if(L<.6)continue;const ux=(e-a)/L,uz=(f-c)/L;let nx=-uz,nz=ux;if(inPoly((a+e)/2+nx*.3,(c+f)/2+nz*.3,main)){nx=-nx;nz=-nz}const ry=-Math.atan2(uz,ux),cx=(a+e)/2,cz=(c+f)/2;
    ob(cx+nx*.1,.45,cz+nz*.1,L+.2,.9,.3,ry,LS);for(const y of[3.9,7.5,11.1])ob(cx+nx*.12,y,cz+nz*.12,L+.24,.2,.26,ry,LS,false);
    ob(cx+nx*.22,h-.15,cz+nz*.22,L+.44,.5,.5,ry,LS);ob(cx+nx*.12,h+.25,cz+nz*.12,L+.24,.3,.3,ry,LSD);
    for(let t=.45;t<L-.3;t+=1.5){ob(a+ux*t+nx*.12,h+.82,c+uz*t+nz*.12,.75,.85,.32,ry,LS)}}
  // stone quoins and gargoyles at the outside corners of the wings
  for(let i=0;i<n;i++){const p0=main[(i+n-1)%n],p1=main[i],p2=main[(i+1)%n],a1=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),a2=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);if(a1<2.5||a2<2.5)continue;
    const bx=(p0[0]-p1[0])/a1+(p2[0]-p1[0])/a2,bz=(p0[1]-p1[1])/a1+(p2[1]-p1[1])/a2,bl=Math.hypot(bx,bz)||1;if(inPoly(p1[0]+bx/bl*.5,p1[1]+bz/bl*.5,main)){const ox=-bx/bl,oz=-bz/bl;
      for(let y=.9;y<h-.6;y+=.62)ob(p1[0]+ox*.12,y+.15,p1[1]+oz*.12,.55,.3,.55,Math.atan2(ox,oz)+PI/4,LS,false);gargoyle(p1[0]+ox*.25,h-.8,p1[1]+oz*.25,ox,oz);
      const tu=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,2.2,8),LS);tu.position.set(p1[0]+ox*.2,h+1.2,p1[1]+oz*.2);tu.castShadow=true;sc.add(tu);const cp=new THREE.Mesh(new THREE.ConeGeometry(.5,1.1,8),mt(0x5b6066,.7));cp.position.set(p1[0]+ox*.2,h+2.85,p1[1]+oz*.2);sc.add(cp)}}
  // the tower on the north end of the west wing, facing the grand stair
  {const TC=[351.2,477.6],ax=[-.462,.887],aw=[-.887,-.462],S2=3.5,TH=h+11.5,ry=-Math.atan2(ax[1],ax[0]);const at=(a,w)=>[TC[0]+ax[0]*a+aw[0]*w,TC[1]+ax[1]*a+aw[1]*w];
    ob(TC[0],TH/2,TC[1],2*S2,TH,2*S2,ry,BR);
    for(const y of[3.9,7.5,11.1,h-.15,h+3.6,h+7.2])ob(TC[0],y,TC[1],2*S2+.3,y===h-.15?.5:.2,2*S2+.3,ry,LS,false);
    for(const sa of[-1,1])for(const sw of[-1,1]){const[x,z]=at(sa*S2,sw*S2);for(let y=.9,k=0;y<TH-.5;y+=.62,k++)ob(x,y+.15,z,k%2?.5:.75,.3,k%2?.75:.5,ry,LS,false);gargoyle(x,TH-1.1,z,ax[0]*sa+aw[0]*sw,ax[1]*sa+aw[1]*sw);
      const tu=new THREE.Mesh(new THREE.CylinderGeometry(.7,.75,4,8),LS);tu.position.set(x,TH+1.4,z);tu.castShadow=true;sc.add(tu);for(let k=0;k<8;k++){const a2=k/8*TAU,mer=new THREE.Mesh(bgeo(.32,.5,.2),LS);mer.position.set(x+Math.cos(a2)*.62,TH+3.65,z+Math.sin(a2)*.62);mer.rotation.y=-a2;sc.add(mer)}const cp=new THREE.Mesh(new THREE.ConeGeometry(.8,2.2,8),mt(0x5b6066,.7));cp.position.set(x,TH+4.9,z);cp.castShadow=true;sc.add(cp)}
    ob(TC[0],TH+.25,TC[1],2*S2+.7,.5,2*S2+.7,ry,LS);for(const[fa,fw]of[[1,0],[-1,0],[0,1],[0,-1]])for(let s=-S2+.6;s<=S2-.6;s+=1.3){const[x,z]=at(fa?fa*(S2+.15):s,fw?fw*(S2+.15):s);ob(x,TH+.95,z,fa?.3:.7,.9,fa?.7:.3,ry,LS)}
    // the faces: tall pointed windows with stone tracery, and the arched stone entry toward the stair
    for(const[fa,fw]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=ax[0]*fa+aw[0]*fw,nz=ax[1]*fa+aw[1]*fw,frot=Math.atan2(nx,nz);const[fx,fz]=at(fa*(S2+.03),fw*(S2+.03));
      for(const[y0,hh]of[[h+1.2,4.2],[h+6,3.8]]){const w=ob(fx,y0+hh/2,fz,.08,hh,1.5,frot+PI/2,DK,false);const ar=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,.08,12,1,false,0,PI),DK);ar.rotation.set(PI/2,0,frot+PI/2,'YXZ');ar.position.set(fx,y0+hh,fz);sc.add(ar);
        ob(fx+nx*.02,y0+hh/2,fz+nz*.02,.1,hh,.1,frot,LS,false);ob(fx+nx*.02,y0+hh*.55,fz+nz*.02,1.5,.1,.1,frot+PI/2,LS,false)}
      if(fw===1){const ex=fx+nx*.05,ez=fz+nz*.05;ob(ex,1.9,ez,.1,3.8,2.6,frot+PI/2,DK,false);const ar=new THREE.Mesh(new THREE.TorusGeometry(1.45,.22,6,16,PI),LS);ar.position.set(ex+nx*.1,3.8,ez+nz*.1);ar.rotation.y=frot;sc.add(ar);for(const s of[-1,1]){const[px,pz]=[ex+nz*s*1.45+nx*.1,ez-nx*s*1.45+nz*.1];ob(px,1.9,pz,.44,3.8,.44,frot,LS)}
        const sg=letters('MEMORIAL HALL',3.4,.34,'#d9cfb8');sg.position.set(ex+nx*.12,h-1.2,ez+nz*.12);sg.rotation.y=frot;sc.add(sg)}}
    markR(...bbox([at(-S2,-S2),at(S2,-S2),at(S2,S2),at(-S2,S2)]),TH)}}

// the entrance bay, built inside tucBuild so it rides the building's level shift (LV = TUC's ground level)
function tucEntry(LV,letters,WH,DKG){const D=TUCDOOR,g=new THREE.Group(),gy=terrH(D.x+D.n[0]*2,D.z+D.n[1]*2)-LV;g.position.set(D.x,gy,D.z);g.rotation.y=Math.atan2(D.n[0],D.n[1]);
  const B=(x,y,z,w,h,d,m,sh=1)=>{const e=new THREE.Mesh(bgeo(w,h,d),m);e.position.set(x,y,z);e.castShadow=!!sh;e.receiveShadow=true;g.add(e);return e};
  const ZN=mt(0x4d535b,.75),GL=SM({color:0x2a3a48,metalness:.3,roughness:.15,transparent:true,opacity:.82}),ST=mt(0x9aa1a8,.4,.5),LT=bm(0xfff1d2);
  // set-back zinc reveal so the doors read as a recess, white pilasters each side
  B(0,1.75,.02,4.6,3.5,.1,ZN);for(const s of[-1,1])B(s*2.2,1.8,.42,.55,3.6,.85,WH);
  // two pairs of glass doors in a white frame, with push bars
  B(0,1.35,.12,3.6,2.7,.06,GL,0);B(0,2.74,.14,3.84,.14,.1,WH,0);for(const x of[-1.8,-.9,0,.9,1.8])B(x,1.35,.15,.08,2.7,.08,WH,0);
  for(const x of[-1.35,-.45,.45,1.35])B(x,1.1,.2,.55,.04,.05,ST,0);
  // the transom glazing over the doors up to the band
  B(0,3.05,.12,3.84,.5,.05,GL,0);
  // projecting white band with the name, soffit downlights under it
  B(0,3.75,.95,6.6,.9,1.9,WH);B(0,3.28,.95,6.5,.04,1.8,mt(0xe7e3da,.8),0);
  for(const x of[-2.4,-.8,.8,2.4]){const d=new THREE.Mesh(GC.dl2||(GC.dl2=new THREE.CircleGeometry(.2,10)),LT);d.rotation.x=PI/2;d.position.set(x,3.255,1.1);g.add(d)}
  const L=letters('UNIVERSITY CENTER',5.6,.42,'#4b5058');L.position.set(0,3.78,1.91);g.add(L);
  // balcony on top of the band: glass balustrade with a steel cap rail on three sides
  const GB=SM({color:0xbfd8e4,transparent:true,opacity:.42});B(0,4.68,1.82,6.5,.95,.05,GB,0);B(0,5.18,1.82,6.6,.06,.08,ST,0);
  for(const s of[-1,1]){B(s*3.25,4.68,.95,.05,.95,1.75,GB,0);B(s*3.25,5.18,.95,.08,.06,1.8,ST,0)}
  for(const x of[-3.2,-1.6,0,1.6,3.2])B(x,4.68,1.82,.05,1,.05,ST,0);
  // a low granite threshold
  B(0,.04,.9,4.4,.08,1.6,mt(0xa8a39b,.8),0);
  sc.add(g)}
// the plaza furniture: young trees in iron grates toward MainStreet, patio sets with umbrellas against Nippert West Pavilion
function tucPlaza(){const inZ=(x,z)=>inPoly(x,z,TUCPLZ);for(let i=TREES.length-1;i>=0;i--)if(inZ(TREES[i][0],TREES[i][1]))TREES.splice(i,1);NOTREE.push([336,283,383,309],[344,309,362,334]);
  const GR=mt(0x2e2a26,.6,.4);
  for(const[x,z]of TUCTREES){if(!freeAt(x,z,.8))continue;const y=terrH(x,z);youngTree(x,z,1.05);
    const r=new THREE.Mesh(GC.tgr||(GC.tgr=new THREE.RingGeometry(.18,.85,24,1)),GR);r.rotation.x=-PI/2;r.position.set(x,y+.035,z);r.userData.ts=1;r.receiveShadow=true;sc.add(r);
    for(let k=1;k<4;k++){const c=new THREE.Mesh(new THREE.RingGeometry(.18+k*.2,.21+k*.2,24,1),mt(0x15130f,.8));c.rotation.x=-PI/2;c.position.set(x,y+.04,z);c.userData.ts=1;sc.add(c)}}
  const UM=mt(0xc8102e,.8),PO=mt(0x1f2124,.5,.35);
  const umb=(x,z)=>{const g=new THREE.Group();g.position.set(x,0,z);const p=new THREE.Mesh(GC.ump||(GC.ump=new THREE.CylinderGeometry(.035,.035,2.5,6)),PO);p.position.y=1.25;g.add(p);
    const c=new THREE.Mesh(GC.umc||(GC.umc=new THREE.ConeGeometry(1.45,.55,8,1,true)),UM);c.material.side=THREE.DoubleSide;c.position.y=2.55;c.castShadow=true;g.add(c);sc.add(g)};
  for(const[x,z,a,u]of[[366.8,303.2,.3,1],[370.6,304.6,1.1,0],[374.4,303.4,.2,1],[368.6,299.4,.9,0],[372.6,299.8,-.3,1],[362.6,299.8,.5,0]]){
    if(!freeAt(x,z,.9)||tucNoLamp(x,z))continue;cafeSet(x,z,a);if(u)umb(x,z)}}

// V129 the ground between Baldwin, Old Chemistry and Zimmer's roof (the strip along Zimmer's south edge and the two trenches beside the
// sloping apron) is filled up to the roof/apron level and paved in the same brick as the roof, so there are no hollows to fall into.
// The terrain grid is raised at load (before any mesh reads it); zimFill() lays the brick over it.
// V130 the tunnel stair (the real one between Baldwin and Old Chemistry): down from the walk, north, to glass doors in Zimmer's lower level
const ZTUN={x:333.6,w:3.0,z0:208.3,zb:212.6,z1:223.6,drop:3.2,y:null};
const ZFILL=[[328.9,208.8],[365.6,199.1],[366.4,203.0],[359.8,205.5],[341.4,210.6],[343.8,220.5],[344.2,224.5],[331.9,225.3],[328.5,213.3],[330.7,212.7]];
const ZFILLY=(()=>{const zb=UCD.B.find(b=>b.k==='zimmer');if(!zb)return null;const lv=zb.lvo!=null?zb.lvo:terrH(zb.fp[0]+zb.fn[0]*1.6,zb.fp[1]+zb.fn[1]*1.6),Y=lv+6.6,gE=terrH(336.5,224);
  const zm=zb.p&&gpoly(zb.p[0]);return{Y,gE,zm,at:z=>z<=207.2?Y:z>=224?gE:Y+(gE-Y)*(z-207.2)/16.8}})();
if(ZFILLY){const yt=ZFILLY.at(ZTUN.z1),yb=yt-ZTUN.drop;ZTUN.yt=yt;ZTUN.yb=yb;ZTUN.y=z=>z<=ZTUN.zb?yb:z>=ZTUN.z1?yt:yb+(yt-yb)*(z-ZTUN.zb)/(ZTUN.z1-ZTUN.zb)}else ZTUN.y=()=>0;
(function(){if(!ZFILLY)return;const T=UCT,N=T.nx,R=ZFILL,dE=(x,z)=>{let d=1e9;for(let i=0;i<R.length;i++){const[a,b]=R[i],[c,e]=R[(i+1)%R.length],vx=c-a,vz=e-b,L2=vx*vx+vz*vz||1,u=Math.max(0,Math.min(1,((x-a)*vx+(z-b)*vz)/L2));d=Math.min(d,Math.hypot(x-a-vx*u,z-b-vz*u))}return d};
  for(let j=0;j<T.nz;j++){const z=T.z0+j*T.dx;if(z<196||z>228)continue;for(let i=0;i<N;i++){const x=T.x0+i*T.dx;if(x<326||x>370)continue;
    const k=j*N+i,inR=inPoly(x,z,R),d=inR?0:dE(x,z);
    if(ZFILLY.zm&&inPoly(x,z,ZFILLY.zm)){if(d<2.6){const y=ZFILLY.Y-.35;if(y*100>TRH[k])TRH[k]=Math.round(y*100)}continue}   // just under the roof edge, so you can step up onto it
    if(!(inR||d<2.9))continue;const y=ZFILLY.at(z);if(y*100>TRH[k])TRH[k]=Math.round(y*100)}}
  // V130 the tunnel stairwell: grid points x 331..335 along the stair are cut down to just under the treads
  const T_=ZTUN;for(let j=0;j<T.nz;j++){const z=T.z0+j*T.dx;if(z<207.5||z>T_.z1-1)continue;for(let i=0;i<N;i++){const x=T.x0+i*T.dx;if(x<330.5||x>335.5)continue;TRH[j*N+i]=Math.round((ZTUN.y(z)-.2)*100)}}})();
function zimFill(){if(!ZFILLY)return;const R=ZFILL,[x0,z0,x1,z1]=bbox(R),S=.5,polys=UCD.B.map(b=>gpoly(b.p[0])),A=[],U=[];
  const skip=(x,z)=>!inPoly(x,z,R)||(x>329&&x<337.25&&z>207.4&&z<ZTUN.z1)||polys.some(p=>inPoly(x,z,p));
  for(let x=x0;x<x1;x+=S)for(let z=z0;z<z1;z+=S){if(skip(x+S/2,z+S/2))continue;const v=(a,b)=>[a,terrH(a,b)+.09,b],q=[v(x,z),v(x+S,z),v(x+S,z+S),v(x,z+S)];
    for(const k of[0,2,1,0,3,2]){A.push(...q[k]);U.push(q[k][0]/8,q[k][2]/8)}}
  if(!A.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();
  const m=new THREE.Mesh(g,SM({map:zimPave2(),roughness:.85}));m.receiveShadow=true;m.userData.ts=1;sc.add(m)}

// the tunnel stair: a 'st' deck (made before bridges() so the deck renderer draws its treads, cheek walls and rails), thick concrete
// walls either side with a rail on top, and a pair of glass doors with a dark lobby behind at the bottom, in Zimmer's south wall
function zimTunnel(){if(!ZFILLY)return;const T=ZTUN,x=T.x,n0=sc.children.length,CON=mt(0xcfcac0,.88),BL=mt(0x1d1f22,.5,.4),FR=mt(0x2a2d31,.5,.4);
  const d=deckMk([[x,T.z1],[x,T.zb],[x,T.z0]],[T.yt,T.yb,T.yb],T.w,'st');d.nob=1;
  // the step from the walk up through the parapet gap onto the roof (the roof's own deck starts inside its parapet line)
  {const poly=[[337.36,207.99],[340.96,207.04],[340.19,204.14],[336.59,205.09]],Y=ZFILLY.Y,bb=bbox(poly);DECKS.push({area:{poly,holes:[]},P:[[338.8,206],[338.9,206]],ys:[Y,Y],s:[0,2],L:2,hw:99,w:198,k:'area',cov:0,bb:[bb[0]-.5,bb[1]-.5,bb[2]+.5,bb[3]+.5],t0:0,t1:2,y:Y})}
  const top=T.yt+.85,bot=T.yb-1.2;
  for(const[a,b]of[[329.2,x-T.w/2],[x+T.w/2,337.25]]){const w=b-a,cx=(a+b)/2,L=T.z1-T.z0+.4,cz=(T.z0+T.z1)/2-.1;box(cx,(top+bot)/2,cz,w,top-bot,L,CON);box(cx,top+.04,cz,w+.06,.08,L+.06,mt(0xe2ded6,.85));
    markR(a,T.z0-.2,b,T.z1+.2,4);const rx=a<x?b-.15:a+.15;box(rx,top+1.0,cz,.06,.06,L,BL);for(let z=T.z0+.2;z<=T.z1;z+=1.6)box(rx,top+.5,z,.05,1.0,.05,BL)}
  box(336.15,(top+bot)/2,207.75,2.2,top-bot,1.3,CON);   // closes the corner where the slanted Zimmer wall meets the east wall
  // the end of the walls at the top of the stair, and the doors at the bottom
  {const y=T.yb,nx=.2556,nz=.9667,ry=Math.asin(.2556),ez=209.01-(x-329.57)*(.2556/.9667),P_=(u,o)=>[x+nz*u+nx*o,ez-nx*u+nz*o];
    const bx=(u,o,yy,w,h,dd,mat)=>{const[px,pz]=P_(u,o);const m=box(px,yy,pz,w,h,dd,mat);m.rotation.y=ry;return m};
    const G=SM({color:0x7f98a8,transparent:true,opacity:.5,roughness:.1,metalness:.2,depthWrite:false});
    bx(0,.02,y+1.45,T.w+.4,2.9,.1,bm(0x111214));bx(0,.12,y+1.35,T.w-.2,2.7,.05,G);for(const u of[-T.w/2+.1,0,T.w/2-.1])bx(u,.15,y+1.35,.12,2.7,.14,FR);bx(0,.15,y+2.72,T.w,.16,.16,FR);
    for(const u of[-.35,.35])bx(u,.24,y+1.1,.04,.8,.04,mt(0xc9ced3,.35,.55));
    {const s=signMesh('ZIMMER HALL · LOWER LEVEL',2.6,.32,'#1d1f22','#eef0f2','Archivo'),[px,pz]=P_(0,.2);s.position.set(px,y+3.05,pz);s.rotation.y=ry;sc.add(s)}
    {const lt=new THREE.Mesh(bgeo(1.6,.08,.3),SM({color:0xfcfaf4,emissive:0xfff3dc,emissiveIntensity:0}));FMLIST.push(lt.material);const[px,pz]=P_(0,.5);lt.position.set(px,y+3.35,pz);lt.rotation.y=ry;sc.add(lt)}}
  for(let i=n0;i<sc.children.length;i++)sc.children[i].userData.ts=1}
// V132 the walk south of Dieterle had a 3 m pit in the LiDAR ground (a "pothole" in the brick): fill it smoothly from the ground round it
(function(){const T=UCT,N=T.nx,X0=361,X1=385,Z0=452,Z1=470,G=(x,z)=>TRH[Math.round((z-T.z0)/T.dx)*N+Math.round((x-T.x0)/T.dx)]/100;
  const vals=[];for(let z=Z0+2;z<Z1;z+=2)for(let x=X0+2;x<X1;x+=2){const fx=(x-X0)/(X1-X0),fz=(z-Z0)/(Z1-Z0);
    const yx=G(X0,z)*(1-fx)+G(X1,z)*fx,yz=G(x,Z0)*(1-fz)+G(x,Z1)*fz,yc=(1-fx)*(1-fz)*G(X0,Z0)+fx*(1-fz)*G(X1,Z0)+(1-fx)*fz*G(X0,Z1)+fx*fz*G(X1,Z1);vals.push([x,z,yx+yz-yc])}
  for(const[x,z,y]of vals){const k=Math.round((z-T.z0)/T.dx)*N+Math.round((x-T.x0)/T.dx);if(y*100>TRH[k])TRH[k]=Math.round(y*100)}})();
// V133 Lindner Center's precast skin as real geometry: one ring of concrete panels per floor, each with a deep downward-triangle opening,
// set just outside the glass wall (the 'diag' facade is now plain glass and mullions, seen through the openings). Instanced, chord by chord
// round the drum so the panels follow the curve.
function lindnerScreen(p,h){const y0=4.8,RH=4,rows=Math.max(1,Math.floor((h-y0-.6)/RH)),D=.6,n=p.length;
  const sh=new THREE.Shape();sh.moveTo(-.5,0);sh.lineTo(.5,0);sh.lineTo(.5,RH);sh.lineTo(-.5,RH);sh.closePath();
  const ho=new THREE.Path();ho.moveTo(-.41,RH-.42);ho.lineTo(0,.42);ho.lineTo(.41,RH-.42);ho.closePath();sh.holes.push(ho);
  const geo=new THREE.ExtrudeGeometry(sh,{depth:D,bevelEnabled:false});
  // perimeter, outward normals
  const S=[0];for(let i=0;i<n;i++){const a=p[i],c=p[(i+1)%n];S.push(S[i]+Math.hypot(c[0]-a[0],c[1]-a[1]))}const PER=S[n];
  const at=s=>{s=((s%PER)+PER)%PER;let i=0;while(i<n-1&&S[i+1]<s)i++;const a=p[i],c=p[(i+1)%n],L=S[i+1]-S[i]||1,f=(s-S[i])/L;return[a[0]+(c[0]-a[0])*f,a[1]+(c[1]-a[1])*f]};
  const top=y0+rows*RH,hb=Math.max(.3,h-top+.15),bg=new THREE.BoxGeometry(1,hb,D);bg.translate(0,hb/2,D/2);
  const cols=Math.max(8,Math.round(PER/3.6)),w=PER/cols,cnt=cols*(rows),im=new THREE.InstancedMesh(geo,SM({color:0xe9e6df,roughness:.8}),cnt);const band=new THREE.InstancedMesh(bg,im.material,cols);
  const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sc3=new THREE.Vector3();let k=0;
  for(let c=0;c<cols;c++){const A=at(c*w),B=at((c+1)*w),L=Math.hypot(B[0]-A[0],B[1]-A[1])||.01,ux=(B[0]-A[0])/L,uz=(B[1]-A[1])/L,mx=(A[0]+B[0])/2,mz=(A[1]+B[1])/2;
    let nx=-uz,nz=ux;if(inPoly(mx+nx*.3,mz+nz*.3,p)){nx=-nx;nz=-nz}const th=Math.atan2(nx,nz);
    for(let r=0;r<=rows;r++){e.set(0,th,0);q.setFromEuler(e);v.set(mx-nx*.05,y0+r*RH,mz-nz*.05);sc3.set(L+.04,1,1);m4.compose(v,q,sc3);if(r<rows)im.setMatrixAt(k++,m4);else band.setMatrixAt(c,m4)}}
  band.castShadow=true;band.receiveShadow=true;band.userData.noMerge=1;sc.add(band);
  im.castShadow=true;im.receiveShadow=true;im.userData.noMerge=1;sc.add(im);
  return y0+rows*RH}
