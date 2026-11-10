// ================================================================ V93 gold perimeter around the roll call area (ASR front lawn, 6 to 7 PM)
let RCP=null;
function rcPerim(){const on=!!(S.pledged&&S.day>=1&&S.gt>=17&&S.gt<19.2&&S.rcDone!==S.day&&!P.inside&&(mode==='play'||mode==='wheel'||mode==='card'));
  if(!RCP){if(!on)return;const[X0,Z0,X1,Z1]=RC_BOX,pts=[],step=1.4,seg=(a,b,c,d)=>{const L=Math.hypot(c-a,d-b),n=Math.max(1,Math.ceil(L/step));for(let i=0;i<n;i++)pts.push([a+(c-a)*i/n,b+(d-b)*i/n])};
    seg(X0,Z0,X1,Z0);seg(X1,Z0,X1,Z1);seg(X1,Z1,X0,Z1);seg(X0,Z1,X0,Z0);pts.push(pts[0]);
    const cx=(X0+X1)/2,cz=(Z0+Z1)/2,Pp=[],Ui=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;let nx=-dz/l,nz=dx/l;if((a[0]-cx)*nx+(a[1]-cz)*nz<0){nx=-nx;nz=-nz}const w=.16,y0=terrH(a[0],a[1])+.1,y1=terrH(b[0],b[1])+.1;
      Pp.push(a[0]-nx*w,y0,a[1]-nz*w,b[0]-nx*w,y1,b[1]-nz*w,b[0]+nx*w,y1,b[1]+nz*w,a[0]-nx*w,y0,a[1]-nz*w,b[0]+nx*w,y1,b[1]+nz*w,a[0]+nx*w,y0,a[1]+nz*w)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Pp,3));const mat=new THREE.MeshBasicMaterial({color:0xffc83a,transparent:true,opacity:.8,depthWrite:false,side:THREE.DoubleSide}),m=new THREE.Mesh(g,mat);m.renderOrder=5;m.frustumCulled=false;
    const grp=new THREE.Group();grp.add(m);const bm=new THREE.MeshBasicMaterial({color:0xffd060,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
    for(const[x,z]of[[X0,Z0],[X1,Z0],[X1,Z1],[X0,Z1]]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,7,10,1,true),bm);b.position.set(x,terrH(x,z)+3.5,z);grp.add(b)}
    sc.add(grp);RCP={grp,mat,bm}}
  RCP.grp.visible=on;if(!on)return;const inside=P.x>88&&P.x<93.5&&P.z>62&&P.z<90;RCP.mat.opacity=(inside?.95:.62)+.22*Math.sin(TT*3);RCP.bm.opacity=inside?.12:.24+.08*Math.sin(TT*2.4)}
function coneMarkers(){if(!CONES.length)return;for(const c of CONES)c.m.visible=c.gD!==S.day;
  if(!CONEPOOL){CONEPOOL=[];const g=new THREE.OctahedronGeometry(.28),m=new THREE.MeshBasicMaterial({color:0xff9a3a});for(let i=0;i<4;i++){const o=new THREE.Mesh(g,m);o.visible=false;sc.add(o);CONEPOOL.push(o)}}
  const on=isR('cone')&&!EV&&mode==='play'&&!P.inside,av=on?CONES.filter(c=>c.gD!==S.day&&Math.hypot(c.x-P.x,c.z-P.z)<70).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)).slice(0,4):[];
  CONEPOOL.forEach((o,i)=>{const c=av[i];o.visible=!!c;if(c){o.position.set(c.x,1.5+terrH(c.x,c.z)+Math.sin(TT*2.4+i)*.1,c.z);o.rotation.y=TT*1.4}})}
function wpavConcourse(D){const S=D.stands.find(s=>s.nip&&s.sl.length>20);if(!S)return;
  const lv=terrH(D.stad.cx,D.stad.cz),Y=lv+S.top+.02,YS=terrH(365.31+.009*1.6,309.31-1.6)+7.2-.04,H=YS-Y,FY=lv+.03,holes=[],DS=THREE.DoubleSide;
  const cum=P=>{const s=[0];for(let i=1;i<P.length;i++)s.push(s[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return s};
  const at=(P,s,C)=>{for(let i=1;i<C.length;i++)if(s<=C[i]||i===C.length-1){const f=clamp((s-C[i-1])/((C[i]-C[i-1])||1),0,1),dx=P[i][0]-P[i-1][0],dz=P[i][1]-P[i-1][1],l=Math.hypot(dx,dz)||1;return{x:P[i-1][0]+dx*f,z:P[i-1][1]+dz*f,tx:dx/l,tz:dz/l}}};
  const holeTN=(x,z,tx,tz,a,b,h)=>{const nx=-tz,nz=tx,p=[[1,1],[1,-1],[-1,-1],[-1,1]].map(([u,v])=>[x+nx*a*u+tx*b*v,z+nz*a*u+tz*b*v]);holes.push(p);markPoly(p,h||3)};
  const ribbon=(A,B,y,mat)=>{const P=[],N=[];for(let i=0;i<A.length-1;i++){const a=A[i],b=A[i+1],c=B[i+1],d=B[i];P.push(a[0],y,a[1],b[0],y,b[1],c[0],y,c[1],a[0],y,a[1],c[0],y,c[1],d[0],y,d[1]);for(let k=0;k<6;k++)N.push(0,1,0)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));mat.side=DS;const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.ts=1;sc.add(m)};
  const wallFace=(P,y0f,y1,mat,uw,vh,v0)=>{const Pp=[],U=[];let s=0;for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ya=y0f(a),yb=y0f(b),u0=s/uw,u1=(s+L)/uw;
      Pp.push(a[0],ya,a[1],b[0],yb,b[1],b[0],y1,b[1],a[0],ya,a[1],b[0],y1,b[1],a[0],y1,a[1]);U.push(u0,(ya-v0)/vh,u1,(yb-v0)/vh,u1,(y1-v0)/vh,u0,(ya-v0)/vh,u1,(y1-v0)/vh,u0,(y1-v0)/vh);s+=L}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Pp,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.ts=1;sc.add(m);return m};
  const BD=SM({map:boardTex(),roughness:.9,side:DS}),gnd=p=>terrH(p[0],p[1])-.8;
  // floor, red line, a utility plate
  capMesh(WPDECK,Y,slabMat()).userData.ts=1;
  ribbon(wpOff(WPRAIL,1.85),wpOff(WPRAIL,2.0),Y+.02,mt(0xa8192e,.8));
  // the wall on the TUC side: plaques above the floor, board-formed concrete below it and outside, a lit cove under the canopy
  const WI=wpOff(WPWALL,-.02);wallFace(WI,()=>Y,YS,wpPlaqueMat(),24,H,Y);wallFace(WI,gnd,Y,BD,3,3,0);wallFace(wpOff(WPWALL,.5),gnd,YS,BD,3,3,0);
  wallFace(wpOff(WPWALL,-.05),()=>YS-.5,YS-.03,new THREE.MeshBasicMaterial({color:0xffe2a4,side:DS}),24,1,0);
  {const WS=cum(WPWALL),p=at(WPWALL,WS[WS.length-1]*.4,WS),ex=p.tz,ez=-p.tx,m=new THREE.Mesh(new THREE.PlaneGeometry(11,5.2),new THREE.MeshBasicMaterial({map:wpMuralTex(),transparent:true,color:0xe2e0ea,side:DS}));
    m.position.set(p.x+ex*.06,Y+3.3,p.z+ez*.06);m.rotation.y=Math.atan2(ex,ez);m.userData.ts=1;sc.add(m)}
  {const A=WPWALL,B=wpOff(WPWALL,1.0);for(let i=0;i<A.length-1;i++)markPoly([A[i],A[i+1],B[i+1],B[i]],9)}
  // the field edge: a board-formed fascia under the rail
  {const RS=cum(WPRAIL);for(let i=0;i<WPRAIL.length-1;i++){const a=WPRAIL[i],b=WPRAIL[i+1],L=RS[i+1]-RS[i],ux=(b[0]-a[0])/L,uz=(b[1]-a[1])/L;
      for(const[s0,s1]of wpFree(L,wpGapsFor(a[0],a[1],b[0],b[1]))){if(s1-s0<.2)continue;wallFace([[a[0]+ux*s0,a[1]+uz*s0],[a[0]+ux*s1,a[1]+uz*s1]],()=>Y-3.6,Y,BD,3,3,0)}}}
  // stadium columns with the black band, one section sign on every other one
  {const RS=cum(WPRAIL),RL=RS[RS.length-1],CON=mt(0xbdb8ac,.9),BK=mt(0x15171a,.7),GD=mt(0x8f8b82,.9);let k=0;
    for(let s=6;s<RL-4;s+=8.6){const p=at(WPRAIL,s,RS);if(WPAIS.some(a=>Math.hypot(a.x-p.x,a.z-p.z)<3.6))continue;const wx=-p.tz,wz=p.tx,x=p.x+wx*.9,z=p.z+wz*.9,ry=Math.atan2(p.tx,p.tz);
      for(const[w,h,yy,mat]of[[.62,H,Y+H/2,CON],[.7,.9,Y+2.8,BK],[.8,.5,Y+.25,GD]]){const c=box(x,yy,z,w,h,w,mat);c.rotation.y=ry;c.userData.ts=1}
      if(k%2==0){const sg=new THREE.Mesh(bgeo(.04,.34,.5),wpSignMat(String(124-(k>>1))));sg.position.set(x+wx*.34,Y+1.5,z+wz*.34);sg.rotation.y=ry;sg.userData.ts=1;sc.add(sg)}
      holeTN(x,z,p.tx,p.tz,.45,.45,9);k++}}
  // wall-side furniture: a teal barrel, three wheeled carts, bollards, a silver minivan parked along the wall, the floor plate
  {const WS=cum(WPWALL),WL=WS[WS.length-1],E=s=>{const p=at(WPWALL,s,WS);return{p,ex:p.tz,ez:-p.tx}};
    {const{p,ex,ez}=E(WL*.22),x=p.x+ex*.8,z=p.z+ez*.8;cyl(x,Y+.45,z,.3,.9,0x4aa5b5,12);holeTN(x,z,p.tx,p.tz,.4,.4,2)}
    for(let i=0;i<3;i++){const{p,ex,ez}=E(WL*.3+i*1.5),x=p.x+ex*.9,z=p.z+ez*.9,ry=Math.atan2(p.tx,p.tz);const c=box(x,Y+.65,z,1.0,1.3,1.1,0x23262a);c.rotation.y=ry;const lid=box(x,Y+1.34,z,1.05,.1,1.15,0x15171a);lid.rotation.y=ry}
    {const{p,ex,ez}=E(WL*.3+1.5),x=p.x+ex*.9,z=p.z+ez*.9;holeTN(x,z,p.tx,p.tz,.7,2.4,3)}
    {const{p,ex,ez}=E(WL*.56),x=p.x+ex*1.6,z=p.z+ez*1.6,g=new THREE.Group(),SV=mt(0xa9aeb5,.45,.3),DK=mt(0x1d2430,.2,.4);g.position.set(x,Y,z);g.rotation.y=Math.atan2(p.tx,p.tz);
      const add=(geo,m,px,py,pz)=>{const e=new THREE.Mesh(geo,m);e.position.set(px,py,pz);e.castShadow=true;e.userData.ts=1;g.add(e)};
      add(bgeo(1.9,.95,5.0),SV,0,.85,0);add(bgeo(1.78,.62,3.0),SV,0,1.62,-.3);add(bgeo(1.8,.5,2.7),DK,0,1.62,-.3);add(bgeo(1.92,.2,.2),mt(0x2a2d31,.6),0,.55,2.5);
      for(const sx of[-.9,.9])for(const sz of[-1.5,1.5]){const w=new THREE.Mesh(GC.wpw||(GC.wpw=new THREE.CylinderGeometry(.36,.36,.24,14)),mt(0x151618,.8));w.rotation.z=PI/2;w.position.set(sx,.36,sz);g.add(w)}
      sc.add(g);holeTN(x,z,p.tx,p.tz,1.15,2.7,3)}
    {const RC=cum(WPRAIL),p=at(WPRAIL,RC[RC.length-1]*.45,RC),x=p.x-p.tz*4.2,z=p.z+p.tx*4.2,m=box(x,Y+.02,z,1.3,.04,.9,0x8c9096,0);m.rotation.y=Math.atan2(p.tx,p.tz)}
    for(const[bx,bz]of[[364,311.3],[372.6,311.2],[WPSS[0][0]-2.4,WPSS[0][1]+.7],[WPSS[0][0]+2.4,WPSS[0][1]-.7]]){cyl(bx,Y+.5,bz,.13,1.0,0xb8bcc2,10);markC(bx,bz,.2,2);holes.push([[bx-.22,bz-.22],[bx+.22,bz-.22],[bx+.22,bz+.22],[bx-.22,bz+.22]])}}
  // the south edge of the floor: a picket rail either side of the stair
  {const a=[351.8,394.7],b=[342.8,397.8],L=Math.hypot(b[0]-a[0],b[1]-a[1]),s=Math.hypot(WPSS[0][0]-a[0],WPSS[0][1]-a[1]);railRun(a[0],a[1],b[0],b[1],Y,[[s-1.8,s+1.8]])}
  // the floor is solid ground for people below it wherever it stands high over the slope
  const[bx0,bz0,bx1,bz1]=bbox(WPDECK);cells(bx0,bz0,bx1,bz1,(k,x,z)=>{if(inPoly(x,z,WPDECK)){const h=Y-terrH(x,z);if(h>.9){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(h)))}}});
  DECKS.push({area:{poly:WPDECK,holes},P:[[(bx0+bx1)/2,(bz0+bz1)/2],[(bx0+bx1)/2+.1,(bz0+bz1)/2]],ys:[Y,Y],s:[0,2],L:2,hw:99,w:198,k:'area',cov:0,bb:[bx0-.5,bz0-.5,bx1+.5,bz1+.5],t0:0,t1:2,y:Y});
  // aisle stairs down through the west stand to the field: each tread follows the top of its row of seats
  const top=(x,z)=>{let h=-1;for(const q of S.sl){if(q.h<=h)continue;const r=q.r;if(inPoly(x,z,r[0])&&!r.slice(1).some(hh=>inPoly(x,z,hh)))h=q.h}return h<0?null:lv+h};
  for(const a of WPAIS){const P=[[a.x,a.z]],ys=[Y];let cur=null,tp=0,lastT=0;
    for(let t=.1;t<40;t+=.1){const y=top(a.x+a.ex*t,a.z+a.ez*t);if(y==null){if(cur!=null)break;continue}
      if(cur==null){cur=y;tp=t;continue}if(y<cur-.2){if(tp-lastT>.3){P.push([a.x+a.ex*tp,a.z+a.ez*tp]);ys.push(cur);lastT=tp}cur=y}tp=t}
    if(cur==null)continue;if(tp-lastT>.3){P.push([a.x+a.ex*tp,a.z+a.ez*tp]);ys.push(cur)}
    const run=Math.max(2.5,(cur-FY)/.55);P.push([a.x+a.ex*(tp+run),a.z+a.ez*(tp+run)]);ys.push(FY);
    const d=deckMk(P,ys,3.2,'st');d.nob=1}
  // the south end: a stair down to the walk by the SW gate
  {const e=WPSS[1],d=deckMk([WPSS[0],e],[Y,terrH(e[0],e[1])],3.2,'st');d.nob=1}
  NOTREE.push([337,309,380,400])}


// the little north bleachers below the scoreboard: seven clean rows facing the field, each riser clear of the grass bank, aisle steps, concrete cheeks
function nipNorthStand(st){const F=(u,v)=>[st.cx+st.ux*u+st.vx*v,st.cz+st.uz*u+st.vz*v],ry=Math.atan2(-st.vz,st.vx),RED=mt(0xa8192e,.8),TRD=mt(0x8f8c86,.9),CON=mt(0xc9c3b6,.9),SEAT=mt(0xb81d33,.6);
  const V0=-15,V1=15,U0=41.6,D=1.05,gF=terrH(...F(U0,0));let prev=gF;
  for(let k=0;k<7;k++){const u0=U0+k*D,uc=u0+D/2;let g=-1e9,gl=1e9;for(let v=V0;v<=V1;v+=3){const t=terrH(...F(uc,v));g=Math.max(g,t);gl=Math.min(gl,t)}
    const top=Math.max(gF+.5+k*.55,g+.45,prev+.4);prev=top;const base=gl-.6,[x,z]=F(uc,0);
    const b=box(x,(top+base)/2,z,V1-V0,top-base,D,RED);b.rotation.y=ry;b.userData.ts=1;
    const t=box(x,top+.02,z,V1-V0,.06,D,TRD);t.rotation.y=ry;t.userData.ts=1;
    {const[sx,sz]=F(u0+.32,0);const s=box(sx,top+.24,sz,V1-V0-.2,.1,.42,SEAT);s.rotation.y=ry;s.userData.ts=1;for(const v of[-10,-3,3,10]){const[px,pz]=F(u0+.32,v);const l=box(px,top+.1,pz,.08,.2,.08,TRD,0);l.userData.ts=1}}
    for(const v of[V0-.25,V1+.25]){const[cx,cz]=F(uc,v);const c=box(cx,(top+.3+base)/2,cz,.5,top+.3-base,D,CON);c.rotation.y=ry;c.userData.ts=1}
    for(const v of[-6.5,6.5]){const[ax,az]=F(uc,v);const a=box(ax,top+.04,az,1.1,.08,D,CON,0);a.rotation.y=ry;a.userData.ts=1}}
  const C=[F(U0,V0-.5),F(U0+7*D,V0-.5),F(U0+7*D,V1+.5),F(U0,V1+.5)];markPoly(C,5)}

function slabMat(){return GC.slabm||(GC.slabm=(()=>{const t=ctex(64,64,(q,w,h)=>{q.fillStyle='#c3bdb2';q.fillRect(0,0,w,h);for(let k=0;k<160;k++){const v=180+rnd()*30|0;q.fillStyle=`rgba(${v},${v-6},${v-14},.25)`;q.fillRect(rnd()*w,rnd()*h,2,2)}q.fillStyle='rgba(84,76,64,.55)';q.fillRect(0,0,w,1.5);q.fillRect(0,0,1.5,h)});t.wrapS=t.wrapT=THREE.RepeatWrapping;return SM({map:t,roughness:.9,emissive:0x2c2a26})})())}
// the gate landing: everything below bridge level between the MainStreet slope, the gate, the CRC podium and the bridge is filled flat at the
// bridge's level and paved in the same concrete slabs, so the floor runs straight from the plaza into the bridge (the slope meets it where it
// comes down to that level)
const GATEP=[[394.2,288],[389.6,290],[386,292],[383.6,294],[381.6,296],[380,298],[378.5,300],[377.3,302],[376.3,304],[375.6,305.4],[377.4,307.2],[381,307.6],[385,306],[389.5,302.5],[391.5,296],[395.6,288.6]];
function nipLink(){const GY=terrH(377.4,302.2)+.04,poly=GATEP;
  const m=capMesh(poly,GY,slabMat());m.userData.ts=1;
  const Pw=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length];const k=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/1.2));for(let j=0;j<k;j++){const x0=a[0]+(c[0]-a[0])*j/k,z0=a[1]+(c[1]-a[1])*j/k,x1=a[0]+(c[0]-a[0])*(j+1)/k,z1=a[1]+(c[1]-a[1])*(j+1)/k,g0=terrH(x0,z0)-.4,g1=terrH(x1,z1)-.4;if(g0>GY-.3&&g1>GY-.3)continue;Pw.push(x0,g0,z0,x1,g1,z1,x1,GY,z1,x0,g0,z0,x1,GY,z1,x0,GY,z0)}}
  if(Pw.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Pw,3));g.computeVertexNormals();g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(Pw.length/3*2),2));const w=new THREE.Mesh(g,SM({map:boardTex(),roughness:.9,side:THREE.DoubleSide}));w.userData.ts=1;sc.add(w)}
  const[x0,z0,x1,z1]=bbox(poly);DECKS.push({area:{poly,holes:[]},P:[[(x0+x1)/2,(z0+z1)/2],[(x0+x1)/2+.1,(z0+z1)/2]],ys:[GY,GY],s:[0,2],L:2,hw:99,w:198,k:'area',bb:[x0,z0,x1,z1],t0:0,t1:2,y:GY})}

// Mantei Center (Engineering Research Center, Michael Graves): four bays under shallow barrel vaults with skylight lanterns, round brick drums with portholes at the north corners
function ercX(b,main,h){const[cx,cz,w,d,ang]=b.rect,a=-ang*PI/180,L=Math.max(w,d),W=Math.min(w,d),along=w>=d?[Math.cos(a),-Math.sin(a)]:[Math.sin(a),Math.cos(a)],acr=[-along[1],along[0]];
  const lv=b.lvo!=null?b.lvo:terrH(b.fp[0]+b.fn[0]*1.6,b.fp[1]+b.fn[1]*1.6),ry=Math.atan2(along[0],along[1]);
  // V131 fit the roof to the real outline: the bounding rectangle includes the east wing, so measure the main body's cross-sections instead
  // (the barrel uses the narrowest section, the drums the typical one) and run the parapet band round the footprint itself
  let W0=W,oc=0;{const ws=[],cs=[];for(let k=1;k<24;k++){const t=-L/2+L*k/24;let lo=null,hi=null;for(let o=-W;o<=W;o+=.2){const x=cx+along[0]*t+acr[0]*o,z=cz+along[1]*t+acr[1]*o;if(inPoly(x,z,main)){if(lo==null)lo=o;hi=o}}if(lo!=null){ws.push(hi-lo);cs.push((lo+hi)/2)}}
    if(ws.length>4){const sw=ws.slice().sort((p,q)=>p-q),med=sw[sw.length>>1],ok=ws.map((w_,i)=>w_<=med+.5?i:-1).filter(i=>i>=0);W0=sw[0];const c=ok.map(i=>cs[i]).sort((p,q)=>p-q);oc=c[c.length>>1];b.ercWd=med}}
  const ocx=acr[0]*oc,ocz=acr[1]*oc;
  // one long barrel roof like the top of a passenger rail car: green standing-seam metal, closed rounded ends, seam ribs, a raised clerestory with glass sides and roof vents
  const VM=mt(0x5f7268,.5,.35),RB=mt(0x44524b,.5,.4),RL=L-3.2,R0=W0/2-1.1,SY=.36,g=new THREE.Group();g.position.set(cx+ocx,h,cz+ocz);g.rotation.y=ry;sc.add(g);
  const add=(geo,m,x,y,z,sx=1,sy=1,sz=1)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.scale.set(sx,sy,sz);e.castShadow=true;e.receiveShadow=true;g.add(e);return e};
  prism(main,h,.9,0xd6c3a2,0xd6c3a2,{solid:false});                                                      // buff parapet band the roof sits on, following the outline
  {const cy=new THREE.CylinderGeometry(R0,R0,RL,40,1,false,-PI/2,PI);cy.rotateX(-PI/2);add(cy,VM,0,.9,0,1,SY,1)}   // the barrel
  for(const s of[-1,1]){const cap=new THREE.SphereGeometry(R0,40,12,0,PI,0,PI/2);cap.rotateY(s>0?0:PI);add(cap,VM,0,.9,s*RL/2,1,SY,.28)}   // rounded ends
  for(let t=-RL/2+2;t<=RL/2-2+1e-3;t+=(RL-4)/Math.round((RL-4)/3.4)){const rb=new THREE.TorusGeometry(R0+.02,.07,5,40,PI);add(rb,RB,0,.9,t,1,SY,1)}   // seams
  add(new THREE.BoxGeometry(2.6,1.1,RL*.78),mt(0x4a5a52,.5,.35),0,.9+R0*SY+.45,0);                                   // clerestory
  for(const s of[-1,1])add(new THREE.BoxGeometry(.06,.6,RL*.76),mt(0x9fc3d6,.08,.4),s*1.31,.9+R0*SY+.5,0);
  add(new THREE.BoxGeometry(3.1,.14,RL*.8),RB,0,.9+R0*SY+1.06,0);
  for(const t of[-RL*.3,0,RL*.3])add(new THREE.CylinderGeometry(.35,.42,.6,10),mt(0xb8bcc2,.4,.6),0,.9+R0*SY+1.4,t);

  // round brick drums with portholes at the north corners, standing on the lowest ground under them
  const s=along[1]<0?1:-1,BR=fm('erc2'),Wd=b.ercWd||W;for(const q of[-1,1]){const x=cx+ocx+along[0]*s*(L/2-3.6)+acr[0]*q*(Wd/2-3.0),z=cz+ocz+along[1]*s*(L/2-3.6)+acr[1]*q*(Wd/2-3.0);
    let gm=terrH(x,z);for(let k=0;k<12;k++){const t=k/12*TAU;gm=Math.min(gm,terrH(x+Math.cos(t)*3.7,z+Math.sin(t)*3.7))}const DT=h+.9+R0*SY+1.6,y0=Math.min(0,gm-lv-.6),H=DT-y0;
    const m=cylUV(3.6,H,28,BR);m.position.set(x,y0+H/2,z);m.castShadow=true;sc.add(m);cyl(x,DT+.15,z,3.8,.3,0xd6c3a2,28);const cap=new THREE.Mesh(new THREE.CircleGeometry(3.6,28),mt(0x6b7a72,.6));cap.rotation.x=-PI/2;cap.position.set(x,DT,z);sc.add(cap);const dm=new THREE.Mesh(new THREE.SphereGeometry(3.4,24,8,0,TAU,0,PI/2),VM);dm.scale.y=.35;dm.position.set(x,DT+.3,z);dm.castShadow=true;sc.add(dm);markC(x,z,3.6,DT+1)}}
// ------------------------------------------------ UC's outdoor statues and sculptures, each placed where it stands on campus (DAAP's UC Art Collection list + photos)
function campusArt(D){const pt=k=>({bearcatR:[606.0,192.6],towerL:[569.96,172.77]})[k]||D.pts[k];const BR=mt(0x5b4630,.5),BRD=mt(0x3e3024,.6),GR=mt(0x313238,.35),LS=mt(0xe7e2d6,.9),ST=mt(0xd4dade,.3),PV=mt(0x9b968c,.9);
  const G=(x,z,face=[0,1])=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=Math.atan2(face[0],face[1]);sc.add(g);return g};
  const P=(g,geo,mat,x,y,z,rx=0,ry=0,rz=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;g.add(m);return m};
  const B=(w,h,d)=>bgeo(w,h,d),C=(r1,r2,h,s=12)=>new THREE.CylinderGeometry(r1,r2,h,s),Sp=(r,s=12)=>new THREE.SphereGeometry(r,s,Math.max(6,s*.6|0));
  const rod=(g,a,b,r,mat)=>{const[x0,y0,z0]=a,[x1,y1,z1]=b,L=Math.hypot(x1-x0,y1-y0,z1-z0);const m=P(g,C(r,r,L,8),mat,(x0+x1)/2,(y0+y1)/2,(z0+z1)/2);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3((x1-x0)/L,(y1-y0)/L,(z1-z0)/L));return m};
  const bld=k=>D.B.find(b=>b.k===k||b.n===k);
  // the Bearcat (Jon Hair, 2011): 15-ft bronze bearcat snarling as it climbs a twisted branch, on a black granite block; reinstalled 2026 in the roundabout at W University Ave & Commons Way
  {const[x,z]=pt('bearcatR'),g=G(x,z,[0,1]);P(g,C(3.85,3.95,.22,32),GR,0,.11,0);P(g,C(3.6,3.6,.08,32),PV,0,.25,0);P(g,B(2.7,1.3,1.5),GR,0,.94,0);P(g,B(2.9,.12,1.7),GR,0,1.62,0);
    const br=[[.2,1.6,.1],[.75,2.5,.35],[-.25,3.4,-.05],[.35,4.3,.25],[-.1,5.2,.05],[.55,5.9,-.2]];for(let i=0;i<br.length-1;i++)rod(g,br[i],br[i+1],.3-.035*i,BRD);
    {const t=P(g,new THREE.TorusGeometry(.75,.17,8,20,PI*1.6),BRD,.15,2.05,.15,PI/2,0,.4)}
    const body=P(g,Sp(.5,14),BR,-.25,3.25,.55,0,0,-.35);body.scale.set(1,1.75,.95);P(g,Sp(.42,14),BR,-.62,4.25,.82);P(g,B(.3,.24,.42),BR,-.72,4.12,1.12,.25);P(g,B(.32,.08,.34),mt(0x2a2018),-.72,3.98,1.1,.4);
    for(const s of[-1,1])P(g,C(.04,.11,.22,6),BR,-.62+s*.25,4.62,.78);
    rod(g,[-.35,3.85,.75],[.55,4.55,.35],.13,BR);rod(g,[-.05,3.75,.65],[.75,3.1,.45],.13,BR);rod(g,[-.4,2.65,.6],[.6,2.55,.45],.14,BR);rod(g,[-.2,2.5,.35],[.15,1.95,.2],.14,BR);
    P(g,new THREE.TorusGeometry(.55,.12,8,18,PI*1.5),BR,.25,2.3,.45,0,.3,1.2);markC(x,z,3.9,6)}
  // Oscar Robertson "Big O" (Blair Buswell, 1994): bronze, dribbling, on a round granite drum outside Fifth Third Arena's main doors
  {const b=bld('Fifth Third Arena');if(b){const[fx,fz]=b.fp,[nx,nz]=b.fn,x=fx+nx*7.5,z=fz+nz*7.5,g=G(x,z,[nx,nz]);P(g,C(1.3,1.35,.85,28),GR,0,.43,0);
    const f=mkPerson({shirt:0xc8a272,pants:0xc8a272,skin:0xc8a272,hair:0xc8a272,metal:1});f.scale.setScalar(1.3);f.position.set(0,.86,0);f.rotation.x=.18;f.P.lL.rotation.x=-.55;f.P.lR.rotation.x=.45;f.P.aR.rotation.x=-.35;f.P.aR.rotation.z=.25;f.P.aL.rotation.x=.5;if(f.P.kL){f.P.kL.rotation.x=.35;f.P.kR.rotation.x=.55;f.P.eR.rotation.x=-.55;f.P.eL.rotation.x=-.35;f.P.spine.rotation.x=.12;f.P.head.rotation.x=-.08;freezePerson(f)}g.add(f);
    P(g,Sp(.16,12),BR,.5,1.15,.55);markC(x,z,1.5,3.4)}}
  // Mick and Mack: the two white stone lions (19th c.) guarding McMicken Hall's front steps toward Clifton Ave
  {const b=bld('as');if(b){const main=gpoly(b.p[0]),[cx,cz]=b.c;let wx=null;for(let i=0,j=main.length-1;i<main.length;j=i++){const[x1,z1]=main[i],[x2,z2]=main[j];if((z1>cz)!==(z2>cz)){const xx=x1+(cz-z1)*(x2-x1)/(z2-z1);if(wx==null||xx<wx)wx=xx}}if(wx==null)wx=cx-8;
    for(const s of[-1,1]){const x=wx-2.6,z=cz+s*3.4,g=G(x,z,[-1,0]);P(g,B(1.2,1.05,1.9),LS,0,.52,0);P(g,B(1.32,.1,2.02),LS,0,1.08,0);
      const bd=P(g,Sp(.4,12),LS,0,1.62,-.15);bd.scale.set(.85,.95,1.75);P(g,Sp(.42,12),LS,0,1.95,.45);P(g,Sp(.27,12),LS,0,2.1,.72);P(g,B(.24,.2,.22),LS,0,2.02,.92);
      for(const[lx,lz,up]of[[-.2,.45,0],[.2,.45,1],[-.2,-.6,0],[.2,-.6,0]])P(g,B(.17,up?.45:.62,.2),LS,lx,up?1.45:1.44,lz+(up?.12:0));P(g,Sp(.19,10),LS,.2,1.32,.74);rod(g,[0,1.6,-.85],[0,1.35,-1.05],.05,LS)}
    }}
  // Herman Schneider (Anna Christoforidis, 2007): bronze bust on a tall black granite pillar in front of Baldwin Hall
  // V129 it stands on the lawn beside Baldwin's front steps (north side), facing out the way the building does. The bust is modelled as
  // an old man: a jacket with lapels, collar and tie, a long lined face with a big nose, heavy brows, a moustache, ears, a bald crown
  // and a fringe of hair round the back.
  {const bw=bld('Baldwin Hall');let[x,z]=pt('schneider'),face=[-1,0];
    if(bw){const[fx,fz]=bw.fp,[nx,nz]=bw.fn,tx=-nz,tz=nx;face=[nx,nz];for(const s0 of[6.6,7.4,8.2,5.8])for(const d of[5.2,6.2,4.4]){const cx=fx+nx*d+tx*s0,cz=fz+nz*d+tz*s0;if(freeAt(cx,cz,1)&&!onRoad(cx,cz)){x=cx;z=cz;break}}
      D.pts.schneider=[x,z]}
    const g=G(x,z,face),BZ=mt(0x5e4a33,.42,.35),BZD=mt(0x45362a,.5,.3);
    P(g,B(1.1,.25,.9),GR,0,.12,0);P(g,B(.7,1.95,.55),GR,0,1.22,0);P(g,B(.82,.1,.66),GR,0,2.24,0);
    {const pl=signMesh('HERMAN SCHNEIDER  1872 · 1939',.62,.16,'#26272c','#d8c7a0','Georgia');pl.position.set(0,1.75,.282);g.add(pl)}
    // chest and shoulders in a jacket, cut off in a curve like a real bust
    const ch=P(g,Sp(.4,18),BZ,0,2.56,0);ch.scale.set(.98,.66,.55);
    for(const sx of[-1,1]){const l=P(g,B(.17,.42,.04),BZD,sx*.1,2.6,.225,-.12,0,sx*.32);l.castShadow=false}
    P(g,B(.1,.3,.05),BZD,0,2.58,.24).rotation.x=-.1;P(g,C(.115,.13,.08,14),BZ,0,2.79,.01);
    // neck, then the head: long skull, jaw, cheekbones
    P(g,C(.085,.1,.17,12),BZ,0,2.87,0);
    const hd=P(g,Sp(.165,18),BZ,0,3.08,0);hd.scale.set(.86,1.1,1.0);
    const jw=P(g,Sp(.12,14),BZ,0,2.97,.04);jw.scale.set(.95,.8,.95);
    for(const sx of[-1,1]){const ck=P(g,Sp(.05,10),BZ,sx*.075,3.04,.11);ck.scale.set(1,.7,.8);
      const br=P(g,Sp(.045,10),BZD,sx*.058,3.125,.135);br.scale.set(1.05,.32,.5);           // heavy brows
      const ey=P(g,Sp(.022,8),BZD,sx*.055,3.09,.14);ey.scale.set(1.3,.6,.5);                // deep-set eyes
      const er=P(g,Sp(.045,10),BZ,sx*.142,3.07,0);er.scale.set(.35,1,.7);                   // ears
      const hr=P(g,Sp(.07,10),BZD,sx*.125,3.12,-.06);hr.scale.set(.5,.75,1.1)}            // side hair
    const ns=P(g,C(.012,.032,.085,8),BZ,0,3.065,.158);ns.rotation.x=.35;P(g,Sp(.024,8),BZ,0,3.03,.17);  // a long nose
    const ms=P(g,Sp(.06,12),BZD,0,3.0,.15);ms.scale.set(1.25,.4,.55);                     // moustache
    P(g,Sp(.022,8),BZD,0,2.955,.155).scale.set(1.6,.5,.6);                                // lower lip
    const bk=P(g,Sp(.15,14),BZD,0,3.09,-.06);bk.scale.set(.82,.62,.75);                   // fringe of hair round the back, bald crown above
    for(let k=0;k<3;k++){const w=P(g,B(.11-.02*k,.006,.01),BZD,0,3.15+k*.022,.148-.004*k);w.castShadow=false}  // forehead lines
    markC(x,z,.9,3.4)}
  // Chief Justice William Howard Taft (William T. Moore III, 1991): bronze in judicial robes outside the College of Law
  {const b=bld('College of Law');if(b){const[fx,fz]=b.fp,[nx,nz]=b.fn,x=fx+nx*6-nz*5,z=fz+nz*6+nx*5,g=G(x,z,[nx,nz]);P(g,C(.78,.82,.55,24),GR,0,.27,0);
    P(g,C(.42,.6,1.75,16),BRD,0,1.43,0);P(g,Sp(.45,14),BRD,0,2.3,0).scale.set(1,.5,.8);P(g,C(.12,.13,.14,10),BRD,0,2.5,0);P(g,Sp(.2,14),BRD,0,2.72,.02);for(const s of[-1,1])rod(g,[s*.44,2.25,0],[s*.48,1.5,.12],.1,BRD);markC(x,z,1,3)}}
  // Ronald Walker Tower of Light (Machado Silvetti / Zahner, 1998): 64 ft — white stone base with U and C portals, timber "hammer" shafts, white block,
  // a folded stainless-steel star and a lit torch on top; south end of Campus Green, just north-west of the Bearcat roundabout
  {const[x,z]=pt('towerL'),g=G(x,z,[0,1]);const W=mt(0xeeeae2,.9),WD=mt(0x5a3822,.8),WL=mt(0x7a5236,.8);
    for(const[a,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])P(g,B(.9,3.4,.9),W,a*1.07,1.7,c*1.07);P(g,B(3.05,.85,3.05),W,0,3.8,0);
    // V129 the base is filled in with white concrete between the corner piers, as on the real tower: a tall portal on the front, a square
    // window on one side, solid walls behind, and a dark floor inside
    {const t=.5,gp=1.24,o=1.07;P(g,B(gp,3.4,t),W,0,1.7,-o);P(g,B(t,3.4,gp),W,-o,1.7,0);
      P(g,B(.2,3.4,t),W,-.52,1.7,o);P(g,B(.2,3.4,t),W,.52,1.7,o);P(g,B(gp,.95,t),W,0,2.93,o);
      P(g,B(t,1.25,gp),W,o,.625,0);P(g,B(t,1.05,gp),W,o,2.875,0);P(g,B(t,1.1,.28),W,o,1.8,-.48);P(g,B(t,1.1,.28),W,o,1.8,.48);
      P(g,B(1.7,.06,1.7),mt(0x2a2826,.9),0,.03,0);P(g,B(1.6,.1,1.6),mt(0x3a3836,.9),0,3.32,0)}
    P(g,B(2.5,9,2.5),WD,0,8.7,0);for(let y=4.6;y<13;y+=.62)P(g,B(2.58,.16,2.58),WL,0,y,0);for(const[a,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])P(g,B(.32,9,.32),WL,a*1.18,8.7,c*1.18);
    P(g,B(2.7,2.2,2.7),W,0,14.3,0);P(g,B(2.3,2.2,2.3),ST,0,16.3,0,0,PI/4);P(g,B(2.6,1.2,1.2),ST,0,16.8,0,0,0,.35);P(g,B(1.2,1.2,2.6),ST,0,17.1,0,.35);
    {const o=P(g,new THREE.OctahedronGeometry(1.2,0),ST,0,18.2,0);o.scale.set(.9,1.1,.9)}{const fl=P(g,Sp(.42,12),bm(0xfff0c8),0,19.6,0);fl.scale.set(1,2.1,1)}
    markR(x-1.6,z-1.6,x+1.6,z+1.6,21)}
  // Forest Devil (Kenneth Snelson, 1975): tensegrity of aluminium tubes held only by steel cables, on a gravel bed by Zimmer Hall
  {const b=bld('zimmer');if(b){const[fx,fz]=b.fp,[nx,nz]=b.fn,x=fx+nx*13+nz*9,z=fz+nz*13-nx*9,g=G(x,z,[nx,nz]);P(g,C(4.2,4.2,.06,24),mt(0x4a4744,.95),0,.03,0);
    const T=[[[-3.2,.2,-1],[1.5,4.6,.8]],[[2.8,.2,1.2],[-1.2,4.9,-.6]],[[-2.6,3.8,1.4],[3.4,2.2,-1.1]],[[-.4,.2,-2],[.9,5.4,1.6]],[[3.6,4.4,.2],[-3.4,2.9,.6]],[[1.6,.2,-1.6],[-2.2,3.4,1.9]],[[-1.8,5.1,-1.5],[2.2,3.1,1.8]],[[0,2,2.4],[0,3.9,-2.4]]];
    const pts=[];for(const[a,c]of T){rod(g,a,c,.075,ST);pts.push(...a,...c)}const lg=new THREE.BufferGeometry(),lp=[];for(let i=0;i<T.length;i++){const a=T[i][1],c=T[(i+3)%T.length][0],d=T[(i+1)%T.length][1];lp.push(...a,...c,...a,...d)}
    lg.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));g.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x6d7378})));markC(x,z,3.2,5.5)}}
  // Figura-Prima (Magdalena Abakanowicz, 1995): a 14-ft headless bronze figure, rough as bark, at Mary Emery Hall's front entrance (CCM)
  {const b=bld('Mary Emery Hall');if(b){const[fx,fz]=b.fp,[nx,nz]=b.fn,x=fx+nx*6+nz*5,z=fz+nz*6-nx*5,g=G(x,z,[nx,nz]),M=mt(0x4b3d30,.95);
    for(const s of[-1,1])P(g,C(.24,.36,2.3,8),M,s*.3,1.15,0,0,0,s*.04);P(g,B(.95,.5,.55),M,0,2.45,0);P(g,C(.5,.42,1.7,9),M,0,3.5,0).scale.set(1,1,.62);P(g,C(.18,.5,.3,9),M,0,4.42,0).scale.set(1,1,.62);markC(x,z,.9,4.6)}}
  // Rock of Truth (Jon Isherwood, 2024): split black granite boulder on Sigma Sigma Commons
  {const[x,z]=pt('sigma'),g=G(x+5,z+3.5,[0,1]),K=mt(0x1c1d21,.3);P(g,B(3.2,.14,2.6),mt(0xb8b4aa,.9),0,.07,0);for(const s of[-1,1]){const r=P(g,new THREE.DodecahedronGeometry(1,0),K,s*.55,1.1,0,0,s*.2,s*.08);r.scale.set(.55,1.05,.95)}markC(x+5,z+3.5,1.6,2.2)}
}
// Peter Eisenman's Aronoff Center: the walls break into shifted pastel blocks of different heights (mint, salmon, lavender, sage, pale grey),
// boxes cantilever off the facade a few degrees out of square, more boxes are stacked on the roof, and a tall lavender stair tower rises over the north front
function bandUV(g,w,h,d){const uv=g.attributes.uv,D=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*D[f][0]/16,uv.getY(i)*D[f][1]/4.5)}uv.needsUpdate=true;return g}
function eisenmanBoxes(main,h,big,fp,occ){const cols=['dpG','dpP','dpL','dpS','dpW'],lv=terrH(fp[0],fp[1]);let n=0,best=null,bl=0;
  const blk=(x,z,w,hh,dd,ry,y0,kind,rx=0,rz=0,band=false)=>{const g=new THREE.Mesh(band?bandUV(new THREE.BoxGeometry(w,hh,dd),w,hh,dd):boxUV(new THREE.BoxGeometry(w,hh,dd),w,hh,dd,16),typeof kind==='string'?fm(kind):mt(kind,.5));g.position.set(x,y0+hh/2,z);g.rotation.set(rx,ry,rz,'YXZ');g.castShadow=true;g.receiveShadow=true;sc.add(g);return g};
  const rectP=(x,z,w,d,ry)=>{const c=Math.cos(ry),s=Math.sin(ry);return[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([a,b])=>[x+a*c+b*s,z-a*s+b*c])};
  for(let i=0;i<main.length;i++){const[a,b2]=main[i],[c,d]=main[(i+1)%main.length],L=Math.hypot(c-a,d-b2);if(L<2.5)continue;
    const ux=(c-a)/L,uz=(d-b2)/L;let nx=uz,nz=-ux;const mx=(a+c)/2,mz=(b2+d)/2;if(inPoly(mx+nx*.6,mz+nz*.6,main)){nx=-nx;nz=-nz}
    if(occ(mx+nx*2.5,mz+nz*2.5))continue;// edge hidden against a neighbouring wing
    const ry=Math.atan2(-uz,ux);if(L>bl&&L>12){bl=L;best=i}
    // storey bands: each floor is its own slab, stepping further out as it rises and twisted a little out of line (the corbelled look of the north front)
    const nf=Math.max(2,Math.round(h/4.5)),fh=h/nf,m=Math.max(1,Math.round(L/15)),UP=['dbG','dbG','dbT','dbP','dbL','dbG','dbW','dbT'];
    for(let f=0;f<nf;f++)for(let q=0;q<m;q++){const k=(i*7+q*13+f*5)%31,t=(q+.5)*L/m,w=L/m+.3+(f?.5:0),dd=1.6,out=.2+f*.42+(k%3)*.12;
      const x=a+ux*t+nx*(out-dd/2),z=b2+uz*t+nz*(out-dd/2);if(f===0&&Math.hypot(x-fp[0],z-fp[1])<w/2+2.6)continue;// keep the entrance clear
      const r=ry+(f?((k%5)-2)*.011:0),y0=f*fh,yb=f?y0:Math.min(0,terrH(x,z)-lv-.3),top=y0+fh+(f===nf-1&&k%4===0?.9:0),kind=f?UP[k%UP.length]:(k%3===0?'dbP':'dbGl');
      if(yb<-.4){blk(x,z,w,top,dd,r,0,kind,0,0,true);let y=0,j=0;while(y-yb>1.6){const hh=Math.min(fh,y-yb);blk(x,z,w,hh+.02,dd-.1*j,r,y-hh,j%2?'dbGl':UP[(k+j*3)%UP.length],0,0,true);y-=hh;j++}if(y>yb)blk(x,z,w,y-yb+.05,dd,r,yb,'conc')}else blk(x,z,w,top-yb,dd,r,yb,kind,0,0,true);if(!f)markPoly(rectP(x,z,w,dd,r),top)}
    // cantilevered boxes above head height
    for(let t=6;t<L-5&&n<(big?12:4);t+=16){const k=n++,w=6+(k*5)%4,dd=4+(k*3)%3,hh=3.2+((k*7)%3)*1.5,y0=Math.min(h-hh+2.5,4+((k*11)%4)*2.6),out=1+((k*13)%5)*.45;
      blk(a+ux*t+nx*(out-dd/2),b2+uz*t+nz*(out-dd/2),w,hh,dd,ry+((k*29)%7-3)*.045,y0,cols[(k+3)%5],((k*17)%5-2)*.03,((k*23)%5-2)*.03)}}
  // boxes stacked on the roof, twisted against the grid
  const[x0,z0,x1,z1]=bbox(main);let r=0;for(let x=x0+7;x<x1-5&&r<(big?7:3);x+=15)for(let z=z0+5;z<z1-4&&r<(big?7:3);z+=11){if(!inPoly(x,z,main)||!inPoly(x+5,z+4,main)||!inPoly(x-5,z-4,main)||!inPoly(x+5,z-4,main)||!inPoly(x-5,z+4,main))continue;const k=r++;
    blk(x,z,8+(k*7)%4,3+(k%2)*1.8,6+(k*5)%3,((k*37)%9-4)*.07,h-.3,k%3===1?'dpG':k%3===2?'dpW':0xdedcd6)}
  // the stair tower: a tall lavender shaft standing proud of the longest open front
  if(big&&best!=null){const[a,b2]=main[best],[c,d]=main[(best+1)%main.length],L=Math.hypot(c-a,d-b2),ux=(c-a)/L,uz=(d-b2)/L;let nx=uz,nz=-ux;if(inPoly((a+c)/2+nx*.6,(b2+d)/2+nz*.6,main)){nx=-nx;nz=-nz}
    const ry=Math.atan2(-uz,ux)+.05,x=a+ux*L*.38+nx*.9,z=b2+uz*L*.38+nz*.9,H=h+9,yb=Math.min(0,terrH(x+nx*2,z+nz*2)-lv-.3);blk(x,z,4.2,H-yb,4.8,ry,yb,'dpL');markPoly(rectP(x,z,4.2,4.8,ry),H);
    for(let y=3;y<H-2;y+=3.4)blk(x+nx*2.45,z+nz*2.45,1.4,1.9,.12,ry,y,0x5e2626)}}
// McMicken Hall's (Arts & Sciences Hall) landmark: the red-brick tower over the west entrance, stone bands and clock faces,
// a white balustrade, octagonal belfry and tall spire; pedimented entrance pavilion with an oculus and arched window below
function mcmickenTower(b,main,h){const[cx,cz]=b.c;let wx=null;for(let i=0,j=main.length-1;i<main.length;j=i++){const[x1,z1]=main[i],[x2,z2]=main[j];if((z1>cz)!==(z2>cz)){const x=x1+(cz-z1)*(x2-x1)/(z2-z1);if(wx==null||x<wx)wx=x}}if(wx==null)wx=cx-8;
  const tx=wx+3.4,tz=cz,W=5.6,WH=0xf3efe5,ST=0xe6dfcf;
  if(b.pp)box(tx,h+4,tz,W,10,W,fm('brick'));else box(tx,(h+9)/2,tz,W,h+9,W,fm('brick'));for(const y of[h+.2,h+4.6,h+8.8])box(tx,y,tz,W+.5,.5,W+.5,ST);
  {const fc=SM({color:0xf6f2e6}),rim=mt(0x2a2d34);for(const[dx,dz,ry]of[[0,W/2+.03,0],[0,-W/2-.03,PI],[W/2+.03,0,PI/2],[-W/2-.03,0,-PI/2]]){const m=new THREE.Mesh(GC.mcf||(GC.mcf=new THREE.CircleGeometry(1.05,24)),fc);m.position.set(tx+dx,h+6.7,tz+dz);m.rotation.y=ry;sc.add(m);const r=new THREE.Mesh(GC.mcr||(GC.mcr=new THREE.RingGeometry(1.05,1.25,24)),rim);r.position.set(tx+dx*1.002,h+6.7,tz+dz*1.002);r.rotation.y=ry;sc.add(r)}}
  box(tx,h+9.6,tz,W+.9,.35,W+.9,WH);box(tx,h+10.25,tz,W+.5,.95,W+.5,WH);for(let k=-2;k<=2;k++)for(const[dx,dz]of[[k*1.05,W/2+.27],[k*1.05,-W/2-.27],[W/2+.27,k*1.05],[-W/2-.27,k*1.05]])box(tx+dx,h+10.25,tz+dz,.5,.55,.05,0xb8b2a4,0)
  cyl(tx,h+12.2,tz,2.1,4.2,mt(WH,.6),8);for(let k=0;k<8;k++){const a=k/8*TAU+PI/8;const o=box(tx+Math.cos(a)*2.05,h+12.3,tz+Math.sin(a)*2.05,.1,2.6,.8,0x2a2d34,0);o.rotation.y=-a}
  box(tx,h+14.45,tz,4.8,.3,4.8,WH);cyl(tx,h+15.3,tz,1.6,1.4,mt(WH,.6),8);
  {const sp=new THREE.Mesh(GC.mcs||(GC.mcs=new THREE.CylinderGeometry(.05,1.45,7.5,8)),mt(WH,.55));sp.position.set(tx,h+19.75,tz);sp.castShadow=true;sc.add(sp);cyl(tx,h+24,tz,.05,1.2,0x2a2d34,4)}
  if(!b.pp)markR(tx-W/2,tz-W/2,tx+W/2,tz+W/2,h+24);
  // entrance pavilion on the west front
  {const ry=-PI/2,g=new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-6.4,0),new THREE.Vector2(6.4,0),new THREE.Vector2(0,3.3)]),{depth:.8,bevelEnabled:false});const pm=new THREE.Mesh(g,fm('brick'));pm.position.set(wx,h,tz);pm.rotation.y=ry;pm.castShadow=true;sc.add(pm);
    const cor=new THREE.Mesh(bgeo(.9,.5,13.4),mt(WH,.6));cor.position.set(wx-.35,h+.15,tz);sc.add(cor);
    const oc=new THREE.Mesh(GC.mco||(GC.mco=new THREE.RingGeometry(.45,.7,20)),mt(WH,.6));oc.position.set(wx-.82,h+1.35,tz);oc.rotation.y=ry;sc.add(oc);
    for(const s of[-1,1])box(wx-.12,h/2,tz+s*6.1,.3,h,.8,ST);
    if(!b.pp){box(wx-.1,h*.56,tz,.14,h*.42,2.3,0x283038);const ar=new THREE.Mesh(GC.mca||(GC.mca=new THREE.CircleGeometry(1.15,16,0,PI)),mt(0x283038));ar.position.set(wx-.18,h*.56+h*.21,tz);ar.rotation.y=ry;sc.add(ar);
    box(wx-.12,h*.56+h*.21+1.3,tz,.2,.25,3,ST);box(wx-.2,1.6,tz,.3,3.2,2.8,0x3a2a20);box(wx-.25,3.5,tz,.4,.5,3.6,ST)}}}

// McMicken's walk-through passage (photos, Oct 2026): campus side = a round brick arch with a stone keystone and an iron balcony above,
// a wide stone stair climbing to it between black railings, carriage lanterns and steel bollards on the plaza; inside = flagstone floor,
// plain brick walls, flat plaster ceiling with three hanging lanterns; Clifton Ave side = arch between brick piers topped by carved stone
// figures, a stone frieze reading ARTS & SCIENCES HALL with the WISDOM inscription above, two low steps, Mick and Mack on their pedestals
function mcPass(b){const[x0,z0,x1,z1]=bbox(gpoly(b.arch)),lv=terrH(b.fp[0]+b.fn[0]*1.6,b.fp[1]+b.fn[1]*1.6),zc=(z0+z1)/2,hw=(z1-z0)/2,yF=terrH((x0+x1)/2,zc)-lv,ys=yF+3.1;return{x0,x1,z0,z1,zc,hw,lv,yF,ys,yc:ys+hw+.4}}
let FLAGT=null;function flagTex(){if(FLAGT)return FLAGT;const c=document.createElement('canvas');c.width=c.height=256;const q=c.getContext('2d');q.fillStyle='#4f5560';q.fillRect(0,0,256,256);
  let y=0;while(y<256){const h=36+Math.floor(rnd()*30);let x=-Math.floor(rnd()*40);while(x<256){const w=40+Math.floor(rnd()*60),v=70+Math.floor(rnd()*30);q.fillStyle=`rgb(${v-6},${v+2},${v+14})`;q.fillRect(x+2,y+2,w-3,h-3);x+=w}y+=h}
  FLAGT=new THREE.CanvasTexture(c);FLAGT.wrapS=FLAGT.wrapT=THREE.RepeatWrapping;return FLAGT}
let BRKT=null;function brickTex(){if(BRKT)return BRKT;const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d');q.fillStyle='#b9b0a2';q.fillRect(0,0,128,128);
  for(let r=0;r<8;r++)for(let k=-1;k<4;k++){const x=k*32+(r%2?16:0),v=Math.floor(rnd()*26);q.fillStyle=`rgb(${128+v},${62+v*.5},${48+v*.4})`;q.fillRect(x+1,r*16+1,30,14)}
  BRKT=new THREE.CanvasTexture(c);BRKT.wrapS=BRKT.wrapT=THREE.RepeatWrapping;return BRKT}
function lanternAt(x,y,z,sz,IRON,GLOW){box(x,y,z,sz*.78,sz*1.05,sz*.78,GLOW,0);for(const[a,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])box(x+a*sz*.4,y,z+c*sz*.4,sz*.08,sz*1.1,sz*.08,IRON,0);box(x,y-sz*.58,z,sz*.9,sz*.1,sz*.9,IRON,0);box(x,y+sz*.58,z,sz*.9,sz*.1,sz*.9,IRON,0)}
function mcmickenPassage(b){const M=mcPass(b),{x0,x1,zc,hw,yF,ys,yc}=M,L=x1-x0,BRK=mt(0x8a4a3a,.92),BRK2=mt(0x9c5a46,.9),STN=mt(0xdcd3c0,.7),IRON=mt(0x18191c,.5,.4),GLOW=bm(0xffe2a6);
  const sh=(pts)=>{const s_=new THREE.Shape();pts.forEach(([a,c],i)=>i?s_.lineTo(a,c):s_.moveTo(a,c));return s_};
  const placeZY=(geo,x,mat)=>{const m=new THREE.Mesh(geo,mat);m.rotation.y=-PI/2;m.position.x=x;m.castShadow=true;m.receiveShadow=true;sc.add(m);return m};
  // arch spandrels (fill the square opening's top corners) + a lighter voussoir ring + keystone, on both portals
  for(const[xf,out]of[[x1,1],[x0,-1]]){const sp=new THREE.Shape();sp.moveTo(zc-hw,ys);sp.lineTo(zc-hw,yc+.02);sp.lineTo(zc+hw,yc+.02);sp.lineTo(zc+hw,ys);sp.absarc(zc,ys,hw,0,PI,false);
    placeZY(new THREE.ExtrudeGeometry(sp,{depth:.7,bevelEnabled:false,curveSegments:20}),out>0?xf+.02:xf+.68,BRK);
    const rg=new THREE.Shape();rg.absarc(zc,ys,hw+.55,0,PI,false);rg.absarc(zc,ys,hw,PI,0,true);placeZY(new THREE.ExtrudeGeometry(rg,{depth:.1,bevelEnabled:false,curveSegments:20}),out>0?xf+.12:xf-.02,BRK2);
    box(xf+out*.12,ys+hw+.35,zc,.26,1.05,.75,STN);
    for(const s of[-1,1])box(xf+out*.06,ys-.12,zc+s*(hw+.25),.14,.24,.55,STN)}                      // impost stones at the springline
  // tunnel: plain brick lining over the facade texture, stone base course, plaster ceiling, flagstone floor, three hanging lanterns
  for(const s of[-1,1]){const t=brickTex().clone();t.needsUpdate=true;t.repeat.set(L/1.4,(yc-yF)/1.1);const wm=new THREE.Mesh(new THREE.PlaneGeometry(L-.05,yc-yF),SM({map:t}));wm.position.set((x0+x1)/2,(yF+yc)/2,zc+s*(hw-.12));wm.rotation.y=s>0?PI:0;wm.receiveShadow=true;sc.add(wm);box((x0+x1)/2,yF+.18,zc+s*(hw-.11),L-.05,.36,.06,STN,0)}
  box((x0+x1)/2,yc-.05,zc,L-.05,.1,hw*2-.1,bm(0xbdb6a8),0);
  {const t=flagTex().clone();t.needsUpdate=true;t.repeat.set(L/3,hw*2/3);const f=new THREE.Mesh(new THREE.PlaneGeometry(L+.6,hw*2-.12),SM({map:t}));f.rotation.x=-PI/2;f.position.set((x0+x1)/2+.3,yF+.03,zc);f.receiveShadow=true;sc.add(f);box((x0+x1)/2+.3,yF-.25,zc,L+.6,.5,hw*2-.12,mt(0x4f5560),0)}
  for(const f of[.22,.5,.78]){const x=x0+L*f;cyl(x,yc-.55,zc,.02,1.1,IRON,4,0);lanternAt(x,yc-1.3,zc,.42,IRON,GLOW);const cp=new THREE.Mesh(GC.lcap||(GC.lcap=new THREE.ConeGeometry(.3,.25,4)),IRON);cp.position.set(x,yc-.95,zc);cp.rotation.y=PI/4;sc.add(cp)}
  // the campus-side stair: ~15 risers down to the plaza, the lowest flight wider, iron rails on both sides and down the middle
  const yP=terrH(x1+7,zc)-M.lv,run=5.6,n=Math.max(6,Math.round((yF-yP)/.165)),tr=run/n,rise=(yF-yP)/n;
  for(let k=0;k<n;k++){const top=yF-(k+1)*rise+.02,w=k>=n-5?hw*2+2.2:hw*2+.5,xa=x1+k*tr;box(xa+tr/2,(top+yP-.6)/2,zc,tr+.02,top-yP+.6,w,mt(0xcfc8ba,.85),0)}
  box(x1+.15,yF-.2,zc,.3,.4,hw*2+.5,mt(0xcfc8ba,.85),0);
  const rail=(z,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy),r=new THREE.Mesh(bgeo(l,.06,.06),IRON);r.position.set((ax+bx)/2,(ay+by)/2+1,z);r.rotation.z=Math.atan2(dy,dx);sc.add(r);for(let t=0;t<=l;t+=.55){const x=ax+dx*t/l,y=ay+dy*t/l;box(x,y+.5,z,.04,1,.04,IRON,0)}};
  for(const s of[-1,1]){rail(zc+s*(hw+.18),x1,yF,x1+run*(n-5)/n,yF-rise*(n-5));rail(zc+s*(hw+1.05),x1+run*(n-5)/n,yF-rise*(n-5),x1+run,yP)}
  rail(zc,x1+.6,yF-rise*1.5,x1+run,yP);
  // carriage lanterns at the foot and the steel bollards marching across the plaza
  for(const s of[-1,1]){const x=x1+run+.6,z=zc+s*(hw+2.4);cyl(x,1.6+yP,z,.08,3.2,IRON,8);lanternAt(x,3.45+yP,z,.55,IRON,GLOW);const cp=new THREE.Mesh(GC.lcap2||(GC.lcap2=new THREE.ConeGeometry(.42,.32,4)),IRON);cp.position.set(x,3.95+yP,z);cp.rotation.y=PI/4;sc.add(cp);markC(x,z,.15,3.5)}
  for(const d of[2.2,3.6,5]){const x=x1+run+d;cyl(x,.45+yP,zc,.2,.9,mt(0xbfc3c8,.25,.6),14);cyl(x,.93+yP,zc,.23,.06,mt(0xbfc3c8,.25,.6),14);markC(x,zc,.24,1)}
  // iron balcony on stone corbels over the campus-side arch
  {const yb=yc+1.15,W=6.2;box(x1+.55,yb,zc,1.1,.22,W,STN);for(const dz of[-2.4,-.9,.9,2.4])box(x1+.22,yb-.36,zc+dz,.44,.5,.34,STN);
    box(x1+1.07,yb+1.0,zc,.07,.07,W,IRON,0);box(x1+1.07,yb+.2,zc,.05,.05,W,IRON,0);for(let z=-W/2;z<=W/2+.01;z+=.32)box(x1+1.07,yb+.6,zc+z,.03,.8,.03,IRON,0);
    for(const s of[-1,1]){box(x1+.55,yb+1.0,zc+s*W/2,1.05,.07,.07,IRON,0);for(let x=.15;x<1.05;x+=.32)box(x1+x,yb+.6,zc+s*W/2,.03,.8,.03,IRON,0)}
    box(x1+.03,yb+1.35,zc,.06,2.3,1.7,0x2a2f36,0)}
  // Clifton Ave side: brick piers with carved stone figures, frieze lettering and the inscription panel, two low steps, cheek walls, hedges
  for(const s of[-1,1]){const z=zc+s*(hw+.75),top=ys+.7;box(x0-.35,(yF-.6+top)/2,z,.7,top-yF+.6,1.1,BRK);box(x0-.37,top+.13,z,.86,.26,1.3,STN);
    cyl(x0-.37,top+.6,z,.32,.7,STN,10);const hd=new THREE.Mesh(GC.fig||(GC.fig=new THREE.SphereGeometry(.3,10,8)),STN);hd.position.set(x0-.37,top+1.15,z);sc.add(hd);for(const e of[-1,1]){const ea=new THREE.Mesh(GC.figE||(GC.figE=new THREE.ConeGeometry(.08,.22,5)),STN);ea.position.set(x0-.37,top+1.45,z+e*.15);sc.add(ea)}markR(x0-.7,z-.55,x0,z+.55,top)}
  {const yb=yc+.95,band=box(x0-.08,yb,zc,.16,.95,13.2,STN);const t=signMesh('ARTS & SCIENCES HALL',8.6,.8,'#e3dccb','#28406a','Georgia');t.position.set(x0-.17,yb,zc);t.rotation.y=-PI/2;sc.add(t);
    const k1=signMesh('',1.9,.42,'#e3dccb','#8a8270');for(const s of[-1,1]){const k=k1.clone();k.position.set(x0-.17,yb,zc+s*5.4);k.rotation.y=-PI/2;sc.add(k)}
    box(x0-.07,yb+1.5,zc,.14,1.25,4.6,STN);const ins=signMesh('WISDOM IS THE PRINCIPAL THING · THEREFORE GET WISDOM',4.2,.75,'#ddd5c2','#6a6252','Georgia');ins.position.set(x0-.15,yb+1.5,zc);ins.rotation.y=-PI/2;sc.add(ins)}
  {const yW=terrH(x0-2,zc)-M.lv;for(const[d,y]of[[.45,yF-.05],[.95,(yF+yW)/2]])box(x0-d,(y+yW-.3)/2,zc,.5,y-yW+.3,hw*2+1,mt(0xcfc8ba,.85),0);
    for(const s of[-1,1]){box(x0-1.3,yW+.38,zc+s*(hw+1.3),2.4,.76,.6,STN);markR(x0-2.5,zc+s*(hw+1.3)-.3,x0-.1,zc+s*(hw+1.3)+.3,.8);
      const hz=zc+s*(hw+4.4),he=new THREE.Mesh(GC.hdg||(GC.hdg=new THREE.SphereGeometry(1,10,8)),mt(0x2f5a2a,.95));he.scale.set(1.2,.95,2.4);he.position.set(x0-1.6,yW+.8,hz);he.castShadow=true;sc.add(he);markR(x0-2.8,hz-2.4,x0-.4,hz+2.4,1.6)}}}

// place the story's fixed spots on the new campus (mutated in place so missions keep their references)
function campusSpots(){const sp=(k,x,z)=>{SPOT[k][0]=x;SPOT[k][1]=z};{const uu=B.find(b=>b.id==='union');if(uu&&uu.oex==null){uu.oex=uu.ex;uu.oez=uu.ez;uu.ofn=uu.fn;uu.ex=TUCDOOR.x+TUCDOOR.n[0]*2.3;uu.ez=TUCDOOR.z+TUCDOOR.n[1]*2.3;uu.fn=TUCDOOR.n;uu.face='n'}}const d=id=>{const b=B.find(b=>b.id===id);return[b.ex,b.ez]};
  sp('MAIN',...d('main'));sp('LIB',...d('lib'));sp('UNION',...d('union'));sp('GYM',...d('gym'));
  {const t=B.find(b=>b.id==='union');let s=t.poly[0];for(const p of t.poly)if(p[1]>s[1])s=p;let x=s[0],z=s[1]+3;for(let k=0;k<30&&!freeAt(x,z,.6);k++)z+=1;sp('DOCK',x,z)}
  sp('FIELD',...fromField(-STAD.hl+3,0));
  const N=(id,x,z,a)=>{const n=NAMED.find(n=>n.id===id);if(n){n.x=x;n.z=z;if(a!=null)n.a=a}};
  const m=B.find(b=>b.id==='main');N('dean',m.ex+m.fn[0]*1.3,m.ez+m.fn[1]*1.3,Math.atan2(m.fn[0],m.fn[1]));
  {const c=UCD.lbl['Bearcats Commons'];let x=c[0]+2,z=c[1]+5;for(let k=0;k<20&&!freeAt(x,z,.6);k++)x+=1;N('vinny',x,z)}N('gus',FOUNT[0]-6.5,FOUNT[1]+2,PI/2);const u=B.find(b=>b.id==='union');N('priya',u.ex+u.fn[0]*1.2-u.fn[1]*1.4,u.ez+u.fn[1]*1.2+u.fn[0]*1.4,Math.atan2(u.fn[0],u.fn[1]));
  const PH=(k,x,z)=>{const p=PHOTOS.find(p=>p[0]===k);if(p){p[2]=x;p[3]=z}};
  PH('clock',u.oex+u.ofn[0]*8,u.oez+u.ofn[1]*8);PH('fount',FOUNT[0],FOUNT[1]+8);PH('statue',UCD.pts.schneider[0]-4,UCD.pts.schneider[1]);PH('goal',...fromField(-STAD.hl+3,4));PH('gym',SPOT.GYM[0],SPOT.GYM[1]);const l=B.find(b=>b.id==='lib');PH('lib',l.ex+l.fn[0]*2,l.ez+l.fn[1]*2)}
const stadWest=()=>fromField(0,-STAD.hw-1.5);


function buildWorld(){
  // V123 Clifton Avenue's last block (map data) ran 4 m under Ruby's Diner and stopped 2 m short of the downtown avenue, so the avenue's
  // sidewalk capped it. Move it 2 m west, narrow it to clear the diner wall, and run it down to the avenue (the mouth is paved below).
  {const r=(UCD.roads||[]).find(r=>r.n==='Clifton Avenue'&&r.pts.some(p=>p[1]>570));if(r){r.pts=[[147,576.2],[147,559],[149,553]];r.w=9.6}}
  makeTextures();FD.on=true;FD.built=GFX==='enhanced';
  flat(0,0,141,OD,0,TM.grass,6);flat(141,576,WW,OD,0,TM.grass,6);
  flat(0,530+LZ,701,1332,0,TM.grass,6);flat(-500,OD+500,WW+500,1345,-.05,TM.grass2,8);flat(-500,-500,WW+500,0,-.05,TM.grass2,8);flat(-500,OD,WW+500,OD+500,-.05,TM.grass2,8);flat(-500,0,0,OD,-.05,TM.grass2,8);flat(WW,0,WW+500,OD,-.05,TM.grass2,8);
  // ---------- roads
  // V144 the avenue used to run straight through downtown's north row; now it jogs south at x 140-150 and x 350-362 onto a real main street
  // (z 595-607) between the two rows of shops, so the shop doors face the street and the traffic drives between the buildings
  road(0,576,150,586);flat(142.2,573.6,151.8,576.2,.04,TM.asphalt,10);roadR(142.2,573.6,151.8,576.2);road(140,576,150,607);road(140,595,362,607);road(350,576,362,607);road(350,576,WW,586);road(65,8,75,576);road(245,595,255,710);road(145,646,WW,656);road(65,586,75,690);road(65,646,145,656);road(65,540+LZ,75,619+LZ);
  // greek row front walks
  for(const z of[32,76,120]){path(47,z-1.5,63,z+1.5,TM.concrete);path(77,z-1.5,93,z+1.5,TM.concrete)}
  path(118,70,132,82,TM.concrete);path(132,77.5,140,80.5,TM.concrete);
  // ---------- GREEK ROW
  bld('kto',22,18,47,46,12,'stone',{roof:'hip',rc:0x2c3646,door:[32,'e'],portico:1,letters:'ΚΘΩ',lb:'#1f2c52',name:'Kappa Theta Omega',menu:'kto'});
  bld('dlp',22,62,47,90,8,'sidingP',{roof:'hip',rc:0x6a3a4a,door:[76,'e'],portico:1,letters:'ΔΛΦ',lb:'#b84a76',name:'Delta Lambda Phi',menu:'dlp'});
  bld('tz',22,106,47,134,8,'sidingT',{roof:'hip',rc:0x2f5a5a,door:[120,'e'],portico:1,letters:'ΘΖ',lb:'#2f8a8a',name:'Theta Zeta',menu:'tz'});
  bld('opd',93,18,118,46,8,'brick2',{roof:'hip',rc:0x3a3a3a,door:[32,'w'],portico:1,letters:'ΩΨΔ',lb:'#2d3a36',name:'Omega Psi Delta',menu:'opd'});
  {const n0=sc.children.length;bld('asr',93,62,118,90,8,'brick',{roof:'hip',rc:0x2e2f36,door:[76,'w'],portico:1,letters:'ΑΣΡ',lb:'#7d1f2c',name:'Alpha Sigma Rho',menu:'asr',mc:'#a8323f'});const rf=sc.children.slice(n0).find(o=>o.geometry===HIPG);if(rf){rf.userData.noMerge=1;ASRX.roof=rf}}   /* V285 two floors (8 high) until chapter 3; asrxSync() adds the third floor (see 21i3-asr-exterior.js) */
  bld('kan',93,106,118,134,8,'brick2',{roof:'hip',rc:0x3a3030,door:[120,'w'],portico:1,letters:'ΚΑΝ',lb:'#4a3a2a',name:'Kappa Alpha Nu',menu:'kan'});
  bld('lxa',22,150,47,178,8,'brick',{roof:'hip',rc:0x24392b,door:[164,'e'],portico:1,letters:'ΛΧΑ',lb:'#4b2a7a',name:'Lambda Chi Alpha',menu:'lxa',mc:'#4b2a7a'});
  bld('gwz',93,150,118,178,8,'siding',{roof:'hip',rc:0x3a3a3a,door:[164,'w'],portico:1,letters:'ΓΩΖ',lb:'#5a3a6a',name:'Gamma Omega Zeta'});
  // hedges & lawns
  for(const[x,z0,z1]of[[48.2,18,46],[48.2,62,90],[48.2,106,134],[91.8,18,46],[91.8,62,90],[91.8,106,134]]){box(x,.45,(z0+z1)/2-8.5,.9,.9,(z1-z0)/2-6,0x2f5a2a);box(x,.45,(z0+z1)/2+8.5,.9,.9,(z1-z0)/2-6,0x2f5a2a);markR(x-.45,z0+1,x+.45,(z0+z1)/2-3.5,1);markR(x-.45,(z0+z1)/2+3.5,x+.45,z1-1,1)}
  // ram statue on KTO lawn
  ramHome=[59.5,24];box(59.5,.6,24,1.6,1.2,2.4,0xb9ad92);markC(59.5,24,1.3,2.5);ram=mkRam();ram.position.set(59.5,1.2,24);sc.add(ram);
  // ASR backyard: pong table, grill, string lights
  {const g=new THREE.Group();const t=new THREE.Mesh(bgeo(2.6,.08,1.2),mt(0x2b4a7a,.6));t.position.y=.95;t.castShadow=true;g.add(t);for(const[a,b]of[[-1.2,-.5],[1.2,-.5],[-1.2,.5],[1.2,.5]]){const l=new THREE.Mesh(bgeo(.08,.95,.08),mt(0x333));l.position.set(a,.47,b);g.add(l)}pongCups=[];const cg=new THREE.CylinderGeometry(.06,.045,.14,10);for(const s of[-1,1])for(let r=0;r<3;r++)for(let c=0;c<3-r;c++){const m=new THREE.Mesh(cg,mt(0xc0302a,.5));m.position.set(s*(1.05-r*.12),1.06,(c-(2-r)/2)*.13);g.add(m)}g.position.set(127,0,70);sc.add(g);markR(125.6,69.2,128.4,70.8,1.1);
    box(130,.5,84,1.4,1,.9,0x2a2a2e);for(let i=0;i<9;i++){const b=new THREE.Mesh(GC.bulb||(GC.bulb=new THREE.SphereGeometry(.09,8,6)),bm(0xffe39a));b.position.set(120+i*2.2,3.4-Math.sin(i/8*PI)*.6,66);sc.add(b)}}
  buildFratYards();
  buildCampus();
  // ---------- DOWNTOWN
  bld('diner',152,558,178,592,8,'stucco',{door:[165,'s'],sign:"RUBY'S DINER",sbg:'#b3262e',sfg:'#fff3d6',awning:0xb3262e,name:"Ruby's Diner",menu:'diner'});
  bld('pawn',182,562,200,592,8,'brick2',{door:[191,'s'],sign:'LUCKY PAWN',sbg:'#1b2a1a',sfg:'#8fe07a',awning:0x2a6a3a,name:'Lucky Pawn',menu:'pawn'});
  bld('police',204,558,236,592,12,'stone',{door:[220,'s'],sign:'HARROWGATE POLICE',sbg:'#16223c',sfg:'#dfe8f6',name:'Police Station',menu:'police'});
  bld('anchor',260,560,286,592,8,'wood',{door:[273,'s'],sign:'THE RUSTY ANCHOR',sbg:'#2b1a10',sfg:'#f0a440',awning:0x5a3a22,name:'The Rusty Anchor',menu:'anchor'});
  bld('hank',290,568,318,592,8,'brick',{door:[304,'s'],sign:"HANK'S MARKET",sbg:'#f2ead6',sfg:'#24304a',awning:0x2a4a7a,name:"Hank's Market",menu:'hank'});
  bld('apt1',322,554,347,592,16,'brick2',{roof:'flat'});
  bld('herald',152,610,180,642,12,'brick',{door:[166,'n'],sign:'THE HARROWGATE HERALD',sbg:'#f2ead6',sfg:'#111',sfont:'Georgia',name:'The Harrowgate Herald',menu:'herald'});
  bld('laund',184,610,206,636,8,'stucco',{sign:'SPIN CITY LAUNDRY',signFace:'n',sbg:'#2a8aa8',sfg:'#fff'});
  bld('town1',210,610,238,648,12,'brick2');
  bld('arcade',260,610,290,638,8,'stucco',{sign:'STARLITE ARCADE',signFace:'n',sbg:'#1a0f2e',sfg:'#ff6ad8'});
  bld('apt2',296,610,352,652,16,'brick');
  /* V144 downtown's parked cars removed: the main street is a traffic road now */
  // ---------- LAKE DISTRICT
  fence(0,690,63,690);fence(77,690,140,690);fence(63,690,63,708);fence(77,690,77,708);fence(63,708,77,708);fence(0,540+LZ,700,540+LZ);fence(700,540+LZ,700,1330);fence(0,1330,700,1330);fence(0,540+LZ,0,1330);
  box(63,1.5,690,1.4,3,1.4,0xb9ad92);box(77,1.5,690,1.4,3,1.4,0xb9ad92);markR(62.2,689.2,63.8,690.8,3);markR(76.2,689.2,77.8,690.8,3);box(63,1.5,540+LZ,1.4,3,1.4,0xb9ad92);box(77,1.5,540+LZ,1.4,3,1.4,0xb9ad92);
  gateMesh=new THREE.Group();for(let i=0;i<=24;i++){const e=new THREE.Mesh(bgeo(.08,2.4,.08),mt(0x1d1f24));e.position.set(64+i*.5,1.2,690);gateMesh.add(e)}{const t=new THREE.Mesh(bgeo(12,.14,.12),mt(0x1d1f24));t.position.set(70,2.3,690);gateMesh.add(t)}sc.add(gateMesh);markR(63.8,689.6,76.2,690.4,2.5);
  {const s=signMesh('LAKE DISTRICT · PRIVATE',6,1,'#1d1f24','#e2b64c');s.position.set(70,3.1,689.9);s.rotation.y=PI;sc.add(s)}{const s2=signMesh('CAMPUS GATE',6,1,'#1d1f24','#e2b64c');s2.position.set(70,3.1,540.1+LZ);sc.add(s2)}
  bld('lodge',100,548+LZ,134,566+LZ,8,'stone',{roof:'hip',rc:0x2e4030,door:[117,'s'],portico:1,letters:'ΑΣΡ',name:'The Lodge',menu:'lodge'});
  bld('mansion',10,548+LZ,40,566+LZ,12,'stucco',{roof:'hip',rc:0x5a3a2a});
  bld('pdt',90,598,122,626,10,'brick2',{roof:'hip',rc:0x3a3030,door:[612,'w'],portico:1,letters:'ΦΔΘ',lb:'#c8602a',name:'Phi Delta Theta'});
  bld('boat',63,577+LZ,77,585+LZ,5,'wood',{roof:'hip',rc:0x3a2a1c,door:[70,'n'],name:'Boathouse',menu:'boat'});
  {const sand=new THREE.Mesh(new THREE.CircleGeometry(1,64),TM.sand);sand.scale.set(LK.rx+3,LK.rz+3,1);sand.rotation.x=-PI/2;sand.position.set(LK.x,.02,LK.z);sand.receiveShadow=true;sc.add(sand);
   const w=new THREE.Mesh(new THREE.CircleGeometry(1,64),SM({color:0x2a5f7e,roughness:.06,metalness:.35}));w.scale.set(LK.rx,LK.rz,1);w.rotation.x=-PI/2;w.position.set(LK.x,.08,LK.z);sc.add(w)}
  cells(LK.x-LK.rx,LK.z-LK.rz,LK.x+LK.rx,LK.z+LK.rz,(k,x,z)=>{if(inLake(x,z)&&!onDock(x,z))WG[k]=1});
  {const d=new THREE.Mesh(boxUV(new THREE.BoxGeometry(4.6,.3,22.5),4.6,.3,22.5,3),TM.plank);d.position.set(70,.35,591.2+LZ);d.castShadow=d.receiveShadow=true;sc.add(d);for(let z=582+LZ;z<=602+LZ;z+=4){cyl(67.8,.3,z,.14,1.2,0x4a3420);cyl(72.2,.3,z,.14,1.2,0x4a3420)}}
  {// kart track strip
    const N=128,pos=[],uv=[],idx=[];for(let i=0;i<=N;i++){const th=i/N*TAU;for(const s of[-1,1]){const rx=TK.rx+s*TK.w,rz=TK.rz+s*TK.w;pos.push(TK.x+rx*Math.cos(th),.04,TK.z+rz*Math.sin(th));uv.push(i/N*45,s>0?1:0)}}for(let i=0;i<N;i++){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,SM({map:TX.asphalt,roughness:.95,side:THREE.DoubleSide}));m.receiveShadow=true;sc.add(m);
    cells(TK.x-TK.rx-5,TK.z-TK.rz-5,TK.x+TK.rx+5,TK.z+TK.rz+5,(k,x,z)=>{if(Math.abs(trackR(x,z)-1)<.11)RG[k]=1});
    const sl=new THREE.Mesh(new THREE.PlaneGeometry(1.2,TK.w*2),new THREE.MeshBasicMaterial({color:0xf2efe6}));sl.rotation.x=-PI/2;sl.position.set(70,.06,572+LZ);sc.add(sl);
    const gm=new THREE.MeshBasicMaterial({color:0xe2b64c,transparent:true,opacity:.85});for(let k=0;k<12;k++){const th=-PI/2+k*TAU/12,[x,z]=trackPos(th);const t=new THREE.Mesh(new THREE.TorusGeometry(4.2,.18,6,24,PI),gm.clone());t.position.set(x,0,z);t.rotation.y=Math.atan2(-TK.rx*Math.sin(th),TK.rz*Math.cos(th));t.visible=false;sc.add(t);kartGates.push(t)}}
  // ---------- CAMP HOLLOW: one big forest campground around Hollow Lake (cabins, lakeside docks, campsites, trails)
  {road(75,1021,690,1027);road(640,1021,648,1302);road(150,1294,648,1302);road(150,1135,158,1302);
   const CC=[0x4a3320,0x3a4a2e,0x5a2f26,0x2e3d4a];
   const cabin=(id,x0,z0,face,i)=>{const w=14,d=12,a=(face==='n'||face==='s')?x0+w/2:z0+d/2;return bld(id,x0,z0,x0+w,z0+d,4.4,'wood',{roof:'hip',rc:CC[i%4],rh:2.4,trim:0x5a3d22,door:[a,face]})};
   let cn=0;
   for(let i=0;i<8;i++)cabin('cab'+(cn++),170+i*56,1034,'n',i);
   for(let i=0;i<5;i++)cabin('cab'+(cn++),612,1070+i*44,'e',i);
   for(let i=0;i<7;i++)cabin('cab'+(cn++),190+i*60,1272,'s',i);
   for(let i=0;i<4;i++)cabin('cab'+(cn++),164,1160+i*40,'w',i);
   for(const[x,z,f]of[[290,1078,'s'],[322,1078,'s'],[452,1078,'s'],[484,1078,'s'],[250,1150,'e'],[250,1196,'e'],[548,1150,'w'],[548,1196,'w']])cabin('cab'+(cn++),x,z,f,cn);
   bld('rng',150,1034,166,1050,5,'wood',{roof:'hip',rc:0x2e4030,rh:2.6,trim:0x5a3d22,door:[158,'n'],name:'Ranger Station'});
   bld('pavil',360,1062,420,1088,5,'wood',{roof:'hip',rc:0x3a2a1c,rh:3,trim:0x5a3d22,door:[390,'s'],name:'Camp Pavilion'});
   const lake=(cx,cz,rx,rz)=>{const sd=new THREE.Mesh(new THREE.CircleGeometry(1,64),TM.sand);sd.scale.set(rx+2.5,rz+2.5,1);sd.rotation.x=-PI/2;sd.position.set(cx,.02,cz);sd.receiveShadow=true;sc.add(sd);const w=new THREE.Mesh(new THREE.CircleGeometry(1,64),SM({color:0x2a5f7e,roughness:.06,metalness:.35}));w.scale.set(rx,rz,1);w.rotation.x=-PI/2;w.position.set(cx,.08,cz);sc.add(w);cells(cx-rx,cz-rz,cx+rx,cz+rz,(k,x,z)=>{if(((x-cx)/rx)**2+((z-cz)/rz)**2<1&&!onDock(x,z))WG[k]=1})};
   for(const w of HOLLOW_W)lake(...w);
   for(const d of HOLLOW_D){const L=d[3]-d[1];box((d[0]+d[2])/2,.35,(d[1]+d[3])/2,3.4,.25,L,0x6a4a2a);for(let z=d[1]+2;z<=d[3];z+=5){cyl(d[0]-.1,.3,z,.14,1.2,0x4a3420);cyl(d[2]+.1,.3,z,.14,1.2,0x4a3420)}}
   for(const[x,z,r,c]of[[398.5,1119,.2,0x9a5a2a],[410,1125,-.15,0xb8a02a],[375,1222,.1,0x2a6a8a],[386,1226,-.2,0xa83232],[440,1170,1.2,0x6a8a2a],[360,1190,.5,0xc8602a],[470,1150,-.6,0x2a6a8a]]){const bt=box(x,.14,z,1.4,.3,3.6,c);bt.rotation.y=r}
   const fire=(x,z,r)=>{for(let k=0;k<10;k++){const a=k/10*TAU;cyl(x+Math.cos(a)*r,.25,z+Math.sin(a)*r,.45,.5,0x7a7468,7)}const f=new THREE.Mesh(new THREE.ConeGeometry(.6,1.5,8),bm(0xff8a2a));f.position.set(x,.9,z);sc.add(f);const f2=new THREE.Mesh(new THREE.ConeGeometry(.3,.9,8),bm(0xffd060));f2.position.set(x,.8,z);sc.add(f2);for(let k=0;k<4;k++){const a=k*PI/2+.4;const lg=box(x+Math.cos(a)*(r+1.5),.35,z+Math.sin(a)*(r+1.5),2.2,.5,.5,0x5a3d22);lg.rotation.y=-a+PI/2}markC(x,z,r+.6,1)};
   const TC=[0xc8602a,0x2a6a8a,0x6a8a2a,0xb8a02a,0x7a3a6a,0xa83232];
   const table=(x,z)=>{box(x,.85,z,2.4,.12,1.1,0x6a4a2a);box(x,.45,z-1.1,2.4,.1,.4,0x5a3d22);box(x,.45,z+1.1,2.4,.1,.4,0x5a3d22);markR(x-1.3,z-1.5,x+1.3,z+1.5,1)};
   [[205,1105],[205,1215],[335,1250],[485,1250],[560,1100],[590,1170]].forEach(([x,z],i)=>{fire(x,z,1.6);for(let k=0;k<3;k++){const a=k*TAU/3+i,tx=x+Math.cos(a)*6.5,tz=z+Math.sin(a)*6.5;const t=new THREE.Mesh(new THREE.ConeGeometry(2.6,2.6,4),mt(TC[(i+k)%6],.8));t.position.set(tx,1.3,tz);t.rotation.y=PI/4+k+i;t.castShadow=true;sc.add(t);markC(tx,tz,2,2.4)}table(x+(i%2?-1:1)*3.5,z+4.2);NOTREE.push([x-11,z-11,x+11,z+11])});
   fire(430,1100,2.1);table(418,1106);table(442,1106);NOTREE.push([410,1094,452,1112]);
   for(const r of HOLLOW_T){flat(r[0],r[1],r[2],r[3],.03,TM.sand,6);NOTREE.push(r)}
   NOTREE.push([290,1125,530,1225],[330,1111,490,1239],[565,1215,615,1262]);
   {const sg=signMesh('CAMP HOLLOW',6,1,'#3a2a1c','#e2b64c');sg.position.set(110,3.4,1030.2);sc.add(sg);cyl(107.5,1.6,1030.2,.12,3.2,0x4a3420);cyl(112.5,1.6,1030.2,.12,3.2,0x4a3420)}
   {const sg=signMesh('HOLLOW LAKE',5,1,'#3a2a1c','#e2b64c');sg.position.set(444,3,1103.8);sg.rotation.y=PI;sc.add(sg);cyl(441.5,1.5,1103.8,.12,3,0x4a3420);cyl(446.5,1.5,1103.8,.12,3,0x4a3420)}
  }
  // ---------- west of Clifton: Greek Row continues south into Clifton Heights
  {const HC=['siding','sidingT','brick2','stucco','brick','sidingP'];
   // the next fraternity houses down the row, in the first lots of Clifton Heights
   const FR=[['tchi','ΘΧ','Theta Chi','brick','#9a2a2a',0x2e2f36],['pkp','ΠΚΦ','Pi Kappa Phi','stone','#c8a43a',0x2c3646],['pka','ΠΚΑ','Pi Kappa Alpha','brick2','#8a1f2c',0x3a3030],['sae','ΣΑΕ','Sigma Alpha Epsilon','sidingT','#6a4a9a',0x2f3a5a],['ksig','ΚΣ','Kappa Sigma','brick','#2a6a3a',0x30343c],
   ['kkg','ΚΚΓ','Kappa Kappa Gamma','stone','#3a6fa8',0x2f3a52],
   ['tri','Δ','Triangle','brick','#23408a',0x2e2f36],
   ['tpa','ΘΦΑ','Theta Phi Alpha','sidingP','#2f4f8f',0x3a4a6a],
   ['sam','ΣΑΜ','Sigma Alpha Mu','brick2','#4a2a7a',0x3a3030],
   ['chio','ΧΩ','Chi Omega','stucco','#a8203a',0x5a3a2a],
   ['stau','ΣΤ','Sigma Tau','sidingT','#3a5a6a',0x30343c],
   ['phimu','ΦΜ','Phi Mu','siding','#d98aa4',0x4a3a3a],
   ['kd','ΚΔ','Kappa Delta','sidingP','#6a7a3a',0x3a4150],
   ['atht','ΑΘΤ','Alpha Theta Tau','stucco','#d9772a',0x4a3a3a],
   ['btp','ΒΘΠ','Beta Theta Pi','brick2','#2a5a9a',0x3a3030],
   ['dtd','ΔΤΔ','Delta Tau Delta','stone','#6a3a9a',0x2c3646]];
   let i=0;for(let z=212;z<560;z+=44){for(const[x0,x1,f]of[[24,52,'e'],[88,116,'w']]){if(i<FR.length){const[id,lt,nm,kd,lb,rc]=FR[i];bld(id,x0,z,x1,z+26,10,kd,{roof:'hip',rc,door:[z+13,f],portico:1,letters:lt,lb,name:nm});i++;continue}const k=HC[i%HC.length];bld('ch'+i,x0,z,x1,z+26,7+(i%3),k,{roof:'hip',rc:[0x3a3a3a,0x4a3a3a,0x30343c][i%3],door:[z+13,f]});i++}}}
  bld('psr',88,182,116,208,10,'sidingP',{roof:'hip',rc:0x4a3a3a,door:[195,'w'],portico:1,letters:'ΦΣΡ',lb:'#7a2a5a',name:'Phi Sigma Rho'});
  // ---------- yard paths (after every house exists, before trees so trees keep off them)
  try{buildYardPaths()}catch(e){console.warn('yard paths',e)}
  try{buildTunnel()}catch(e){console.warn('tunnel',e)}
  try{braunEntry()}catch(e){console.warn('braunstein',e)}
  try{buildHughes()}catch(e){console.warn('hughes',e)}
  // ---------- trees
  for(let z=14;z<572;z+=11){tryTree(60.5+rnd(),z+rnd()*2);tryTree(79.5-rnd(),z+rnd()*2)}
  for(let x=4;x<WW;x+=13){tryTree(x+rnd()*3,571.5+rnd()*1.2);tryTree(x+rnd()*3,591.2+rnd()*1.5)}
  for(let i=0;i<4600;i++)tryTree(5+rnd()*690,1030+rnd()*290,1+rnd()*.4);for(let i=0;i<110;i++)tryTree(6+rnd()*132,596+rnd()*110,1.1);
  for(let i=0;i<420;i++)tryTree(10+rnd()*126,140+rnd()*430,1.05);
  for(let i=0;i<500;i++){const x=rnd()*WW,z=rnd()*OD;if(x<16||x>714||z<4||z>712)tryTree(x,z,1.1)}
  for(let i=0;i<160;i++)tryTree(120+rnd()*18,10+rnd()*560);
  for(let i=0;i<90;i++)tryTree(140+rnd()*560,694+rnd()*18);
  fdBuild();buildTrees();buildLamps();nightLights();buildSurroundings();buildDressing();
  // shrubs
  {const sg=new THREE.IcosahedronGeometry(.8,0),pts=[];for(const b of B){if(!b.face||b.poly)continue;for(let k=-3;k<=3;k++){if(Math.abs(k)<2)continue;const[x,z]=fpos(b,b.face,b.da+k*2.2,.8);if(!onRoad(x,z))pts.push([x,z])}}const im=new THREE.InstancedMesh(sg,SM({roughness:.9,flatShading:true}),pts.length),m=new THREE.Matrix4(),c=new THREE.Color();pts.forEach(([x,z],i)=>{m.makeScale(1,.75,1);m.setPosition(x,.5,z);im.setMatrixAt(i,m);c.setHSL(.27+rnd()*.06,.45,.22+rnd()*.06);im.setColorAt(i,c)});im.castShadow=true;im.frustumCulled=false;im.userData.chunk=999;sc.add(im)}
  campusSpots();buildInteriors();buildPW();WORLDC=prerenderMap();
}
// V131 Gettler Stadium (the sunken soccer field and track by Varsity Village): a simple steel chain-link fence round the outside of the
// track, as in the photo; the stand/garage side (the south straight) is left open, and there are gaps at the middle of the north straight
// and at the west end so you can still walk in
function gettlerFence(D){const r=(D.track||[]).find(t=>t&&t[0]&&t[0].length>20);if(!r)return;const ring=r[0],n0=sc.children.length;
  const cx=ring.reduce((s,p)=>s+p[0],0)/ring.length,cz=ring.reduce((s,p)=>s+p[1],0)/ring.length;
  const off=p=>{const dx=p[0]-cx,dz=p[1]-cz,l=Math.hypot(dx,dz)||1;return[p[0]+dx/l*.6,p[1]+dz/l*.6]};
  const CL=GC.chainL||(GC.chainL=new THREE.MeshLambertMaterial({map:(()=>{const t=ctex(64,64,q=>{q.clearRect(0,0,64,64);q.strokeStyle='#7f868c';q.lineWidth=2;for(let k=-64;k<128;k+=12){q.beginPath();q.moveTo(k,0);q.lineTo(k+64,64);q.stroke();q.beginPath();q.moveTo(k+64,0);q.lineTo(k,64);q.stroke()}});return t})(),transparent:true,alphaTest:.35,side:THREE.DoubleSide}));
  const ST=mt(0x3a3f44,.45,.55),H=1.8,gaps=[[458,476.6,1.8],[396.9,505.6,1.8]];
  for(let i=0;i<ring.length-1;i++){const a=ring[i],b=ring[i+1];if(a[1]>529&&b[1]>529)continue;if(Math.abs(a[1]-b[1])<.5&&Math.abs(a[0]-b[0])<8&&a[1]>528)continue;
    const A=off(a),Bp=off(b),L=Math.hypot(Bp[0]-A[0],Bp[1]-A[1]);if(L<.2)continue;const ux=(Bp[0]-A[0])/L,uz=(Bp[1]-A[1])/L,ry=Math.atan2(-uz,ux);
    // split the run at the gaps, then fence each piece
    const cuts=[[0,L]];for(const[gx,gz,gr]of gaps){const t=(gx-A[0])*ux+(gz-A[1])*uz,o=Math.abs(-(gx-A[0])*uz+(gz-A[1])*ux);if(o<1.5&&t>-gr&&t<L+gr){const k=cuts.pop();if(t-gr>k[0])cuts.push([k[0],t-gr]);if(t+gr<k[1])cuts.push([t+gr,k[1]])}}
    for(const[t0,t1]of cuts){const l=t1-t0;if(l<.3)continue;const mx=A[0]+ux*(t0+t1)/2,mz=A[1]+uz*(t0+t1)/2,g0=terrH(A[0]+ux*t0,A[1]+uz*t0),g1=terrH(A[0]+ux*t1,A[1]+uz*t1),gy=(g0+g1)/2;
      const pg=new THREE.PlaneGeometry(l,H-.1),uv=pg.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*l/.6,uv.getY(k)*(H-.1)/.6);
      const p=new THREE.Mesh(pg,CL);p.position.set(mx,gy+.05+(H-.1)/2,mz);p.rotation.y=ry;sc.add(p);
      for(const y of[H,.08]){const rl=box(mx,gy+y,mz,l,.045,.045,ST,0);rl.rotation.y=ry}
      for(let t=t0;t<=t1+1e-3;t+=Math.max(1,l/Math.ceil(l/3))){const x=A[0]+ux*Math.min(t,t1),z=A[1]+uz*Math.min(t,t1),g=terrH(x,z);cyl(x,g+H/2,z,.04,H+.05,ST,6)}
      for(let t=t0;t<=t1;t+=.45)markC(A[0]+ux*t,A[1]+uz*t,.12,H)}}
  for(let i=n0;i<sc.children.length;i++)sc.children[i].userData.ts=1}
