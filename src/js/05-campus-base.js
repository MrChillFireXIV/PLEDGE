// ================================================================ CAMPUS v3: buildings, paths, streets, fields and trees from OpenStreetMap, fitted to the world frame (0.687 game m per real m)
const UCS=.75,UCP=(px,py)=>[141+(px-42)*UCS,6+(py-122)*UCS];
let FOUNT=[0,0],STAD={cx:400,cz:360,ux:0,uz:-1,vx:1,vz:0,hl:40,hw:22};
const toField=(x,z)=>{const dx=x-STAD.cx,dz=z-STAD.cz;return[dx*STAD.ux+dz*STAD.uz,dx*STAD.vx+dz*STAD.vz]};
const fromField=(u,v)=>[STAD.cx+STAD.ux*u+STAD.vx*v,STAD.cz+STAD.uz*u+STAD.vz*v];
const gpoly=f=>{const p=[];for(let i=0;i<f.length;i+=2)p.push([f[i],f[i+1]]);return p};
function inPoly(x,z,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const[xi,zi]=p[i],[xj,zj]=p[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)c=!c}return c}
function bbox(p){let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;for(const[x,z]of p){x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z)}return[x0,z0,x1,z1]}
function markPoly(p,h){const[x0,z0,x1,z1]=bbox(p);cells(x0,z0,x1,z1,(k,x,z)=>{if(inPoly(x,z,p)){WG[k]=1;const v=Math.min(255,Math.ceil(h));if(v>HG[k])HG[k]=v}})}
function roadPoly(p){const[x0,z0,x1,z1]=bbox(p);cells(x0,z0,x1,z1,(k,x,z)=>{if(inPoly(x,z,p))RG[k]=1})}
// prism with any footprint; sides get a facade texture (16 m per tile = 4 storeys), top gets a roof material
function prism(p,y0,h,side,cap,o={}){const sh=new THREE.Shape();p.forEach(([x,z],i)=>i?sh.lineTo(x,-z):sh.moveTo(x,-z));for(const hp of(o.holes||[])){if(hp.length<3)continue;const pth=new THREE.Path();hp.forEach(([x,z],i)=>i?pth.lineTo(x,-z):pth.moveTo(x,-z));sh.holes.push(pth)}
  const g=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:false,curveSegments:24});const uv=g.attributes.uv;
  // wall UVs: u runs along each straight run of wall, aligned so no painted window wraps a corner (V68)
  if(typeof side==='string')fm(side);const EDG=fdUV(g,p,o,side);
  g.rotateX(-PI/2);g.translate(0,y0,0);const m=new THREE.Mesh(g,[typeof cap==='number'?mt(cap):cap,typeof side==='string'?fm(side):(typeof side==='number'?mt(side):side)]);m.castShadow=o.cast!==false;m.receiveShadow=true;sc.add(m);if(o.solid!==false)markPoly(p,o.mh!=null?o.mh:y0+h);fdPlace(EDG,y0,h,side,o);return m}
function flatShape(rings,y,mat,uvs){const sh=new THREE.Shape();rings[0].forEach(([x,z],i)=>i?sh.lineTo(x,-z):sh.moveTo(x,-z));for(const h of rings.slice(1)){const hp=new THREE.Path();h.forEach(([x,z],i)=>i?hp.lineTo(x,-z):hp.moveTo(x,-z));sh.holes.push(hp)}
  const g=new THREE.ShapeGeometry(sh);const uv=g.attributes.uv,pos=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,pos.getX(i)/uvs,pos.getY(i)/uvs);g.rotateX(-PI/2);g.translate(0,y,0);const m=new THREE.Mesh(g,mat);m.receiveShadow=true;sc.add(m);return m}
function decoB(id,name,p,h,mc){const[x0,z0,x1,z1]=bbox(p);const b={id,name,x0,z0,x1,z1,h,poly:p,mc};B.push(b);return b}
function strip(pts,w,mat,y=.026,o={}){const pos=[],uv=[],idx=[];let L=0;for(let i=0;i<pts.length;i++){const[a,b]=pts[Math.max(0,i-1)],[c,d]=pts[Math.min(pts.length-1,i+1)];let tx=c-a,tz=d-b;const l=Math.hypot(tx,tz)||1;tx/=l;tz/=l;const nx=-tz*w/2,nz=tx*w/2;if(i)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);const[x,z]=pts[i];pos.push(x+nx,y,z+nz,x-nx,y,z-nz);uv.push(0,L/(o.uv||4),w/(o.uv||4),L/(o.uv||4))}
  for(let i=0;i<pts.length-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();if(g.attributes.normal.getY(0)<0){for(let i=0;i<idx.length;i+=3){const t=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=t}g.setIndex(idx);g.computeVertexNormals()}
  const m=new THREE.Mesh(g,mat);m.receiveShadow=true;sc.add(m);if(o.road!==false)for(let i=0;i<pts.length-1;i++){const[a,b]=pts[i],[c,d]=pts[i+1];const r=w/2+(o.pad||0);cells(Math.min(a,c)-r,Math.min(b,d)-r,Math.max(a,c)+r,Math.max(b,d)+r,(k,x,z)=>{const vx=c-a,vz=d-b,L2=vx*vx+vz*vz||1,t=clamp(((x-a)*vx+(z-b)*vz)/L2,0,1);if(Math.hypot(x-a-vx*t,z-b-vz*t)<=r)RG[k]=1})}return m}
function curveRoad(pts,w,o={}){strip(pts,w,TM.asphalt,.04,{uv:10});const dash=[];RD.push({poly:pts,w});if(o.dash!==false){let L=0;for(let i=0;i<pts.length-1;i++){const[a,b]=pts[i],[c,d]=pts[i+1],l=Math.hypot(c-a,d-b);for(let t=(6-L%12+12)%12;t<l;t+=12){const x=a+(c-a)*t/l,z=b+(d-b)*t/l;const s=new THREE.Mesh(GC.dash||(GC.dash=new THREE.PlaneGeometry(.22,5)),mt(0xe8c34a,.9));s.rotation.x=-PI/2;s.rotation.z=-Math.atan2(c-a,d-b);s.position.set(x,.05,z);sc.add(s)}L+=l}}
  if(o.lamps!==false)for(let i=0;i<pts.length-1;i++){const[a,b]=pts[i],[c,d]=pts[i+1],L=Math.hypot(c-a,d-b);for(let t=8;t<L;t+=26){const x=a+(c-a)*t/L,z=b+(d-b)*t/L,nx=-(d-b)/L,nz=(c-a)/L;LAMPS.push([x+nx*(w/2+1.6),z+nz*(w/2+1.6)])}}}
function dome(x,y,z,r,c,o={}){const d=new THREE.Mesh(new THREE.SphereGeometry(r,24,12,0,TAU,0,PI/2),typeof c==='number'?mt(c,.5,.2):c);d.position.set(x,y,z);if(o.sy)d.scale.y=o.sy;d.castShadow=true;sc.add(d);if(o.lantern!==false){cyl(x,y+r*(o.sy||1)+.6,z,r*.18,1.3,0xf3efe5,10);const t=new THREE.Mesh(new THREE.ConeGeometry(r*.22,1.1,10),mt(typeof c==='number'?c:0x5f8a7a,.5,.2));t.position.set(x,y+r*(o.sy||1)+1.8,z);sc.add(t)}return d}
function column(x,z,h,c=0xf3efe5){const m=new THREE.Mesh(COLG,mt(c,.55));m.scale.set(1,h,1);m.position.set(x,h/2,z);m.castShadow=true;sc.add(m);markC(x,z,.42,h)}
// marble podium + broad flight of steps rising to a portico: p/n = wall point and outward normal, w = width, H = podium height, k = number of risers
function marbleStairs(p,n,w,H,k){const tx=-n[1],tz=n[0],ry=Math.atan2(n[0],n[1]),M=mt(0xeeebe4,.3,.1),dep=4.2,tread=.55;
  const at=(d,y,bw,bd,bh)=>{const m=new THREE.Mesh(bgeo(bw,bh,bd),M);m.position.set(p[0]+n[0]*d,y,p[1]+n[1]*d);m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;sc.add(m);return m};
  at(.2+dep/2,H/2,w,dep,H);                                   // podium the columns stand on
  for(let i=1;i<=k;i++){const top=H*(1-i/(k+1)+0*i);at(.2+dep+tread*(i-.5),top/2,w,tread,top)}   // steps stepping down to the ground
  for(const s of[-1,1]){const L=dep+tread*k;const m=new THREE.Mesh(bgeo(.5,H+.5,L),M);m.position.set(p[0]+n[0]*(.2+L/2)+tx*s*(w/2+.1),(H+.5)/2,p[1]+n[1]*(.2+L/2)+tz*s*(w/2+.1));m.rotation.y=ry;m.castShadow=true;sc.add(m)}   // cheek walls
  const L=dep+tread*k+.2,hw=w/2+.35,q=[[-hw,.2],[hw,.2],[hw,L],[-hw,L]].map(([a,d])=>[p[0]+tx*a+n[0]*d,p[1]+tz*a+n[1]*d]);markPoly(q,H)}
// a classical portico: columns, entablature and pediment standing proud of a wall point (p) facing (n)
function porticoAt(p,n,w,h,cols=4){const tx=-n[1],tz=n[0],ry=Math.atan2(n[0],n[1]);for(let i=0;i<cols;i++){const s=-w/2+w*i/(cols-1);column(p[0]+n[0]*2.8+tx*s,p[1]+n[1]*2.8+tz*s,h)}
  const e=new THREE.Mesh(bgeo(w+1.4,.9,3.4),mt(0xf3efe5,.55));e.position.set(p[0]+n[0]*1.6,h+.45,p[1]+n[1]*1.6);e.rotation.y=ry;e.castShadow=true;sc.add(e);
  const sh=new THREE.Shape();sh.moveTo(-(w+1.4)/2,0);sh.lineTo((w+1.4)/2,0);sh.lineTo(0,(w+1.4)*.2);sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:3.2,bevelEnabled:false});g.translate(0,0,-1.6);const pd=new THREE.Mesh(g,mt(0xf3efe5,.55));pd.position.set(p[0]+n[0]*1.6,h+.9,p[1]+n[1]*1.6);pd.rotation.y=ry;pd.castShadow=true;sc.add(pd);
  const st=new THREE.Mesh(bgeo(w+2,.3,4),mt(0xd8d2c4,.9));st.position.set(p[0]+n[0]*1.8,.15,p[1]+n[1]*1.8);st.rotation.y=ry;sc.add(st)}
function finEdges(p,h,step,c){for(let i=0;i<p.length;i++){const[a,b]=p[i],[c2,d]=p[(i+1)%p.length],L=Math.hypot(c2-a,d-b);if(L<2)continue;const ux=(c2-a)/L,uz=(d-b)/L,nx=uz,nz=-ux;for(let t=step/2;t<L;t+=step){const m=new THREE.Mesh(bgeo(.35,h,.45),mt(c,.9));m.position.set(a+ux*t+nx*.22,h/2,b+uz*t+nz*.22);m.rotation.y=Math.atan2(ux,uz);m.castShadow=true;sc.add(m)}}}
function hipOnRect(r,y,rh,c){const[cx,cz,w,d,ang]=r;const m=new THREE.Mesh(HIPG,mt(c,.75));m.scale.set(w+1.2,rh,d+1.2);m.position.set(cx,y,cz);m.rotation.y=-ang*PI/180;m.castShadow=true;sc.add(m)}
// monument sign in front of a building (every building on campus gets one)
// real-campus signage: only these buildings have a name display standing on the ground out front. Every other building either wears its name on the facade (wall sign) or has no visible title.
const GROUND_SIGNS=new Set(['Clifton Court Hall']);
function monSign(name,x,z,n){const ry=Math.atan2(n[0],n[1]);const w=Math.min(6.4,1.6+name.length*.2);const gy=terrH(x,z);const b=new THREE.Mesh(bgeo(w+.4,.7,.7),mt(0x8a857a,.9));b.position.set(x,.35+gy,z);b.rotation.y=ry;b.castShadow=true;b.userData.ts=1;sc.add(b);
  const p=new THREE.Mesh(bgeo(w,1.25,.32),mt(0x1b1e24,.6));p.position.set(x,1.3+gy,z);p.rotation.y=ry;p.userData.ts=1;sc.add(p);
  for(const s of[1,-1]){const m=signMesh(name.toUpperCase(),w-.2,1.05,'#1b1e24','#f2efe6','Archivo');m.position.set(x+n[0]*.17*s,1.3+gy,z+n[1]*.17*s);m.rotation.y=ry+(s<0?PI:0);m.userData.ts=1;sc.add(m)}markC(x,z,Math.min(1.6,w/2),2)}
function wallSign(name,p,n,y,w,bg='#14203a',fg='#e2b64c'){const m=signMesh(name,w,Math.max(.9,w*.1),bg,fg);m.position.set(p[0]+n[0]*.16,y,p[1]+n[1]*.16);m.rotation.y=Math.atan2(n[0],n[1]);sc.add(m)}
function doorAt(p,n){FD.doors.push([p[0],p[1]]);const ry=Math.atan2(n[0],n[1]);const f=new THREE.Mesh(bgeo(3.6,4.3,.34),mt(0xefe9db));f.position.set(p[0]+n[0]*.05,2.15,p[1]+n[1]*.05);f.rotation.y=ry;sc.add(f);const d=new THREE.Mesh(bgeo(2.4,3.5,.3),mt(0x3d2617));d.position.set(p[0]+n[0]*.2,1.75,p[1]+n[1]*.2);d.rotation.y=ry;sc.add(d);
  const st=new THREE.Mesh(bgeo(4.6,.28,2),mt(0x9a9286));st.position.set(p[0]+n[0]*1,.14,p[1]+n[1]*1);st.rotation.y=ry;sc.add(st);const l=new THREE.Mesh(bgeo(.5,.5,.12),bm(0xffe2a0));l.position.set(p[0]+n[0]*.4,4.6,p[1]+n[1]*.4);l.rotation.y=ry;sc.add(l)}
const UCFUNC={arts:['arts','art'],chem:['hollis','chem'],lib:['lib','lib'],gym:['gym','gym'],union:['union','union'],econ:['whit','econ'],main:['main','main'],speech:['banc','speech'],phys:['braun','phys']};
const UCMC={brick:'#9a5a48',brick2:'#7d5a4a',stone:'#c9bfa6',conc:'#9a958a',concT:'#9a958a',glass:'#8aa0b0',metal:'#9aa0a8',terra:'#c98a5a',white:'#e9e3d3',stripe:'#a8604c',daap:'#c9a9b8',steger:'#b88a6a',crc:'#9aa0a8',tuc:'#a8604c',morgens:'#8aa0b0',garage:'#8f8c86',stands:'#8a4a4a',diag:'#e3e0d8'};
function roadRingsSlow(r){const p=r[0],hs=r.slice(1);const[x0,z0,x1,z1]=bbox(p);cells(x0,z0,x1,z1,(k,x,z)=>{if(inPoly(x,z,p)&&!hs.some(h=>inPoly(x,z,h)))RG[k]=1})}   /* the original, kept for tests/compare */
/* V295 same cells as roadRingsSlow, ~50x faster: per grid row, the crossing points of each ring (same arithmetic as inPoly) give the inside spans */
function ringXs(p,z){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const[xi,zi]=p[i],[xj,zj]=p[j];if((zi>z)!==(zj>z))xs.push((xj-xi)*(z-zi)/(zj-zi)+xi)}return xs.sort((a,b)=>a-b)}
function roadRings(r,G){G=G||RG;const p=r[0],hs=r.slice(1);const[x0,z0,x1,z1]=bbox(p);const a=Math.max(0,Math.floor(x0*CR)),b=Math.min(GW-1,Math.ceil(x1*CR)-1),c=Math.max(0,Math.floor(z0*CR)),d=Math.min(GD-1,Math.ceil(z1*CR)-1);
  for(let j=c;j<=d;j++){const z=(j+.5)/CR,xo=ringXs(p,z);if(!xo.length)continue;const hx=hs.map(h=>ringXs(h,z)).filter(v=>v.length);
    for(let q=0;q+1<xo.length;q+=2){const i0=Math.max(a,Math.ceil(xo[q]*CR-.5)),i1=Math.min(b,Math.ceil(xo[q+1]*CR-.5)-1);
      for(let i=i0;i<=i1;i++){const x=(i+.5)/CR;if(x<xo[q]||x>=xo[q+1])continue;let hole=false;for(const H of hx){let n=0;for(const v of H)if(v>x)n++;if(n&1){hole=true;break}}if(!hole)G[j*GW+i]=1}}}}
// a chain-link style fence or low wall along any polyline (rails, posts, collision); gap = [segment index, metres] leaves an opening
function fenceLine(pts,o={}){const h=o.h||1.8,col=o.c||0x1d1f24,wall=o.wall;for(let i=0;i<pts.length-1;i++){let[a,b]=pts[i],[c,d]=pts[i+1];let L=Math.hypot(c-a,d-b);if(L<.3)continue;const ux=(c-a)/L,uz=(d-b)/L;
    const segs=[];if(o.gap&&o.gap[0]===i){const g=Math.min(o.gap[1],L-1),m=L/2;segs.push([0,m-g/2],[m+g/2,L])}else segs.push([0,L]);
    for(const[s0,s1]of segs){const l=s1-s0;if(l<.2)continue;const mx=a+ux*(s0+s1)/2,mz=b+uz*(s0+s1)/2,ry=Math.atan2(-uz,ux);
      if(wall){const m=new THREE.Mesh(bgeo(+(l+.2).toFixed(2),h,.35),typeof col==='number'?mt(col):col);m.position.set(mx,h/2,mz);m.rotation.y=ry;m.castShadow=true;sc.add(m)}
      else{for(const y of[h-.05,.3]){const m=new THREE.Mesh(bgeo(+l.toFixed(2),.07,.07),mt(col));m.position.set(mx,y,mz);m.rotation.y=ry;sc.add(m)}for(let t=s0;t<=s1+.01;t+=2.5)box(a+ux*t,h/2,b+uz*t,.09,h,.09,col,0);
        const mesh=new THREE.Mesh(bgeo(+l.toFixed(2),h-.3,.02),FENCEM);mesh.position.set(mx,h/2+.05,mz);mesh.rotation.y=ry;sc.add(mesh)}
      const nx=-uz*.5,nz=ux*.5,p0=[a+ux*s0,b+uz*s0],p1=[a+ux*s1,b+uz*s1];markPoly([[p0[0]+nx,p0[1]+nz],[p1[0]+nx,p1[1]+nz],[p1[0]-nx,p1[1]-nz],[p0[0]-nx,p0[1]-nz]],h)}}}
let FENCEM=null;
function signAt(name,x,z,n,o={}){const t=[-n[1],n[0]];for(const[a,b]of[[0,0],[1.2,0],[2.4,0],[-1,0],[0,2.5],[0,-2.5],[3.6,0],[1.2,3],[1.2,-3],[5,0]]){const sx=x+n[0]*a+t[0]*b,sz=z+n[1]*a+t[1]*b;if(freeAt(sx,sz,1.7)&&!onRoad(sx,sz)||o.any&&freeAt(sx,sz,1.7)){monSign(name,sx,sz,n);return true}}for(const[a,b]of[[0,0],[1.2,0],[2.4,0]]){const sx=x+n[0]*a+t[0]*b,sz=z+n[1]*a+t[1]*b;if(freeAt(sx,sz,1.7)){monSign(name,sx,sz,n);return true}}return false}
// ---------------------------------------------------------------- terrain: UC sits on hills (McMicken hill, the Nippert ravine, the Campus Green valley)
const TRH=(()=>{const b=atob(UCT.d),n=b.length>>1,a=new Int16Array(n);for(let i=0;i<n;i++)a[i]=((b.charCodeAt(2*i)|(b.charCodeAt(2*i+1)<<8))<<16)>>16;return a})();
function terrH(x,z){const fx=(x-UCT.x0)/UCT.dx,fz=(z-UCT.z0)/UCT.dx;if(!(fx>=0&&fz>=0&&fx<UCT.nx-1&&fz<UCT.nz-1))return 0;const i=fx|0,j=fz|0,u=fx-i,v=fz-j,N=UCT.nx,k=j*N+i;return((TRH[k]*(1-u)+TRH[k+1]*u)*(1-v)+(TRH[k+N]*(1-u)+TRH[k+N+1]*u)*v)/100}
// V62 runtime terrain shaping (before any mesh reads the ground): TUC's terrace along the McMicken commons (the top of its granite steps),
// the TUC plaza carried flat to its edge above Backstage Drive, and the ground cut to the line of each outdoor deck stair
(function(){const T=UCT,N=T.nx,ix=x=>Math.round((x-T.x0)/T.dx),iz=z=>Math.round((z-T.z0)/T.dx),g=(i,j)=>TRH[j*N+i]/100,st=(i,j,v)=>{if(i>=0&&j>=0&&i<N&&j<T.nz)TRH[j*N+i]=Math.round(v*100)};
  const tb=UCD.B.find(b=>b.k==='tuc');
  if(tb&&tb.tt!=null){for(let z=304;z<=338;z+=2){const j=iz(z);for(const x of[304,306,308,310])st(ix(x),j,tb.tt);st(ix(302),j,(tb.tt+g(ix(300),j))/2)}
    for(let x=278;x<=304;x+=2)st(ix(x),iz(376),g(ix(x),iz(374)))}
  for(const d of UCD.decks||[]){if(!d.cut)continue;const P=d.p,hw=d.w/2+.9;let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;for(const[x,z]of P){x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z)}
    const S_=[0];for(let i=1;i<P.length;i++)S_.push(S_[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
    for(let j=iz(z0-hw);j<=iz(z1+hw);j++)for(let i=ix(x0-hw);i<=ix(x1+hw);i++){const x=T.x0+i*T.dx,z=T.z0+j*T.dx;let best=null;
      for(let k=0;k<P.length-1;k++){const[a,b]=P[k],[c,e]=P[k+1],vx=c-a,vz=e-b,L2=vx*vx+vz*vz||1e-9,u=Math.max(0,Math.min(1,((x-a)*vx+(z-b)*vz)/L2)),o=Math.hypot(x-a-vx*u,z-b-vz*u);if(!best||o<best[0])best=[o,S_[k]+u*(S_[k+1]-S_[k])]}
      if(best[0]>hw)continue;const t=best[1];let y=d.y[d.y.length-1];for(let k=1;k<S_.length;k++)if(t<=S_[k]){y=d.y[k-1]+(d.y[k]-d.y[k-1])*(t-S_[k-1])/((S_[k]-S_[k-1])||1);break}st(i,j,y-.05)}}})();
function markRoad(pts,w){for(let i=0;i<pts.length-1;i++){const[a,b]=pts[i],[c,d]=pts[i+1];const r=w/2;cells(Math.min(a,c)-r,Math.min(b,d)-r,Math.max(a,c)+r,Math.max(b,d)+r,(k,x,z)=>{const vx=c-a,vz=d-b,L2=vx*vx+vz*vz||1,t=clamp(((x-a)*vx+(z-b)*vz)/L2,0,1);if(Math.hypot(x-a-vx*t,z-b-vz*t)<=r)RG[k]=1})}}
// everything on the ground (paving, lawns, woods, paths, plazas, streets, lines, courts) is painted into one big texture draped over the terrain
// ================================================================ V64 what the walking tour actually shows between the buildings: UC's own signs, help phones, lamps,
// planted beds, bike racks, cafe tables and the paving of each plaza (no invented signage)
const UCRED='#c8102e';
// the UC monogram (a heavy open C round a U) and the wordmark, white on the red cap of every UC sign
function ucMark(q,cx,cy,s,col='#fff'){q.save();q.strokeStyle=col;q.lineCap='butt';q.lineWidth=s*.2;q.beginPath();q.arc(cx,cy,s*.5,PI*.3,PI*1.7);q.stroke();
  q.lineWidth=s*.15;q.beginPath();q.moveTo(cx-s*.2,cy-s*.4);q.lineTo(cx-s*.2,cy+s*.04);q.arc(cx,cy+s*.04,s*.2,PI,0,true);q.lineTo(cx+s*.2,cy-s*.4);q.stroke();q.restore()}
function ucCap(q,w,y0,h){q.fillStyle=UCRED;q.fillRect(0,y0,w,h);ucMark(q,w/2,y0+h*.32,h*.4);q.fillStyle='#fff';q.textAlign='center';q.textBaseline='middle';
  q.font=`${Math.round(h*.12)}px Georgia,serif`;q.fillText('University of',w/2,y0+h*.67);q.font=`bold ${Math.round(Math.min(h*.17,w*.11))}px Georgia,serif`;q.fillText('CINCINNATI',w/2,y0+h*.85)}
function wrapText(q,t,maxW){const out=[];let cur='';for(const w of t.split(' ')){const s=cur?cur+' '+w:w;if(q.measureText(s).width>maxW&&cur){out.push(cur);cur=w}else cur=s}out.push(cur);return out}
const cvTex=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
// building ID monolith (tour 570 / 606 s, Teachers-Dyer Complex; 708 s in front of TUC): charcoal slab, red cap, white serif name, rule, street address, both faces
function ucIdSign(name,addr,x,z,n){const tx=cvTex(320,448,(q,w,h)=>{q.fillStyle='#2b2d31';q.fillRect(0,0,w,h);ucCap(q,w,0,118);q.fillStyle='#fff';q.textAlign='left';q.textBaseline='alphabetic';
    q.font='bold 40px Georgia,serif';let y=178;for(const l of wrapText(q,name,276)){q.fillText(l,22,y);y+=44}q.fillStyle='rgba(255,255,255,.85)';q.fillRect(22,y-20,276,2);if(addr){q.font='22px Georgia,serif';q.fillStyle='#fff';q.fillText(addr,22,y+14)}});
  const g=new THREE.Group(),W=1.5,H=2.1,T=.26,fmM=new THREE.MeshLambertMaterial({map:tx});g.position.set(x,0,z);g.rotation.y=Math.atan2(n[0],n[1]);
  const b=new THREE.Mesh(bgeo(W,H,T),mt(0x2b2d31,.6));b.position.y=.1+H/2;b.castShadow=true;g.add(b);const p=new THREE.Mesh(bgeo(W+.1,.1,T+.12),mt(0x45474b,.8));p.position.y=.05;g.add(p);
  for(const s of[1,-1]){const f=new THREE.Mesh(GC.uid||(GC.uid=new THREE.PlaneGeometry(W-.04,H-.04)),fmM);f.position.set(0,.1+H/2,s*(T/2+.005));if(s<0)f.rotation.y=PI;g.add(f)}
  sc.add(g);markC(x,z,.8,2.3);return g}
// pedestrian wayfinding blade (tour 1650 s): charcoal blade on a dark post, red cap with the wordmark, destinations with arrows
function ucWaySign(items,x,z,n,body='#3d4044'){const tx=cvTex(192,704,(q,w,h)=>{q.fillStyle=body;q.fillRect(0,0,w,h);ucCap(q,w,0,190);q.fillStyle='#fff';q.textAlign='left';q.textBaseline='middle';let y=236;
    for(const[t,a]of items){q.font='bold 26px Arial,Helvetica,sans-serif';q.fillText(a,12,y);q.font='21px Arial,Helvetica,sans-serif';const ls=wrapText(q,t,138);for(const l of ls){q.fillText(l,46,y);y+=24}y+=26}});
  const g=new THREE.Group(),W=.62,H=2.3,fmM=new THREE.MeshLambertMaterial({map:tx});g.position.set(x,0,z);g.rotation.y=Math.atan2(n[0],n[1]);
  const pst=new THREE.Mesh(bgeo(.1,2.75,.1),mt(0x26282b,.5));pst.position.set(-W/2-.06,1.375,0);pst.castShadow=true;g.add(pst);
  const b=new THREE.Mesh(bgeo(W,H,.06),mt(0x3d4044,.6));b.position.set(0,.35+H/2,0);b.castShadow=true;g.add(b);
  for(const s of[1,-1]){const f=new THREE.Mesh(new THREE.PlaneGeometry(W-.02,H-.02),fmM);f.position.set(0,.35+H/2,s*.032);if(s<0)f.rotation.y=PI;g.add(f)}
  sc.add(g);markC(x,z,.45,2.8);return g}
// UC's emergency "Help Phone" posts (tour 240, 1206, 1404, 1704 s): blue column, white serif lettering up the side, call box, blue beacon under a cap
let HPT=null,HPL=null;function helpPhone(x,z,ry=0){if(!HPT){HPT=cvTex(256,512,(q,w,h)=>{q.fillStyle='#2e6c98';q.fillRect(0,0,w,h);q.fillStyle='#fff';q.font='bold 62px Georgia,serif';q.textAlign='center';q.textBaseline='middle';
    for(const u of[.25,.75]){q.save();q.translate(w*u,h/2);q.rotate(PI/2);q.fillText('Help Phone',0,0);q.restore()}});HPL=new THREE.MeshBasicMaterial({color:0x5cb8ff})}
  const g=new THREE.Group(),D=mt(0x1d1f22,.5);g.position.set(x,0,z);g.rotation.y=ry;const A=(geo,m,y,z=0)=>{const e=new THREE.Mesh(geo,m);e.position.set(0,y,z);e.castShadow=true;g.add(e);return e};
  A(GC.hpb||(GC.hpb=new THREE.CylinderGeometry(.17,.19,.9,14)),D,.45);A(GC.hpm||(GC.hpm=new THREE.CylinderGeometry(.165,.165,1.55,14)),new THREE.MeshLambertMaterial({map:HPT}),1.675);
  A(bgeo(.17,.26,.06),mt(0xb9bec4,.35,.6),1.5,.17);A(GC.hpl||(GC.hpl=new THREE.CylinderGeometry(.12,.12,.26,12)),HPL,2.58);A(GC.hpc||(GC.hpc=new THREE.CylinderGeometry(.19,.17,.1,14)),D,2.76);
  sc.add(g);markC(x,z,.25,3);return g}
// raised lettering that takes the light (the Lambert twin of letters())
function lettersL(text,w,h,col,font='Georgia,serif',bold=1){const c=document.createElement('canvas'),W=1024,H=Math.max(32,Math.round(W*h/w));c.width=W;c.height=H;const q=c.getContext('2d');q.fillStyle=col;let fs=Math.floor(H*.8);const F=s=>`${bold?'bold ':''}${s}px ${font}`;q.font=F(fs);
  while(q.measureText(text).width>W*.98&&fs>8){fs-=2;q.font=F(fs)}q.textAlign='center';q.textBaseline='middle';q.fillText(text,W/2,H/2);const t=new THREE.CanvasTexture(c);t.anisotropy=4;
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:t,transparent:true,alphaTest:.3}))}
// black inverted-U bike racks in a row along the walk (OSM amenity=bicycle_parking; black loops at TUC north, tour 348-360 s)
function bikeRacks(D){const L=D.bike||[];if(!L.length)return;const n=L.length*4,M=mt(0x1c1e21,.45,.4),po=new THREE.InstancedMesh(GC.brp||(GC.brp=new THREE.CylinderGeometry(.03,.03,.82,6)),M,n*2),ar=new THREE.InstancedMesh(GC.bra||(GC.bra=new THREE.TorusGeometry(.34,.03,5,12,PI)),M,n),m=new THREE.Matrix4(),r=new THREE.Matrix4();let k=0,j=0;
  for(const[x,z,a]of L){const vx=Math.sin(a),vz=Math.cos(a),tx=Math.cos(a),tz=-Math.sin(a);for(let i=0;i<4;i++){const s=(i-1.5)*.95,cx=x+tx*s,cz=z+tz*s;if(solid(cx,cz))continue;const gy=terrH(cx,cz);
      for(const e of[-.34,.34]){m.makeTranslation(cx+vx*e,gy+.41,cz+vz*e);po.setMatrixAt(k++,m)}m.makeRotationY(a-PI/2);m.setPosition(cx,gy+.82,cz);ar.setMatrixAt(j++,m);markC(cx,cz,.3,1)}}
  po.count=k;ar.count=j;for(const o of[po,ar]){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;o.userData.ts=1;o.userData.chunk=120;sc.add(o)}}
// black metal cafe table with chairs (OSM picnic tables: the TUC north concourse, tour 336-354 s)
function cafeSet(x,z,a){if(solid(x,z))return;const g=new THREE.Group(),M=mt(0x1f2124,.5,.35);g.position.set(x,0,z);g.rotation.y=a;const A=(geo,px,py,pz,ry=0)=>{const e=new THREE.Mesh(geo,M);e.position.set(px,py,pz);e.rotation.y=ry;e.castShadow=true;g.add(e)};
  A(GC.ctt||(GC.ctt=new THREE.CylinderGeometry(.42,.42,.04,16)),0,.74,0);A(GC.ctp||(GC.ctp=new THREE.CylinderGeometry(.04,.04,.72,8)),0,.37,0);A(GC.ctb||(GC.ctb=new THREE.CylinderGeometry(.24,.26,.04,12)),0,.02,0);
  for(const s of[-1,1]){const cz=s*.78;A(bgeo(.44,.04,.42),0,.45,cz);A(bgeo(.44,.42,.04),0,.68,cz+s*.21);for(const lx of[-.19,.19])for(const lz of[-.18,.18])A(bgeo(.03,.45,.03),lx,.225,cz+lz)}
  sc.add(g);markC(x,z,.55,1);markC(x+Math.sin(a)*.78,z+Math.cos(a)*.78,.3,1);markC(x-Math.sin(a)*.78,z-Math.cos(a)*.78,.3,1)}
function tuftGeo(){if(GC.tuft)return GC.tuft;const P=[],N=11;for(let k=0;k<N;k++){const a=k/N*TAU+rnd()*.4,lean=.25+rnd()*.3,h=.8+rnd()*.35,w=.07,cx=Math.cos(a),cz=Math.sin(a),px=-cz*w,pz=cx*w;
    P.push(-px,0,-pz, px,0,pz, cx*lean,h,cz*lean)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.computeVertexNormals();return GC.tuft=g}
// planted beds (OSM leisure=garden): low concrete curbs where a bed meets the walk, mulch, ornamental grasses and autumn shrubs (tour 372-414, 480-606, 672-750, 1248-1278 s)
function plantBeds(D){const G=D.gard||[];if(!G.length)return;const pos=[],Q=(a,b,c,d)=>pos.push(...a,...b,...c,...a,...c,...d),SH=[],GR=[];
  const ALLZ=PAVZ.filter(z=>z[3]).map(z=>z[2]);for(const g of G){const r=g.r,n=r.length;if(n<3||g.a>300)continue;{const[cx,cz]=r.reduce((a,p)=>[a[0]+p[0]/n,a[1]+p[1]/n],[0,0]);if(ALLZ.some(p=>inPoly(cx,cz,p)))continue}
    if(g.w)for(let i=0;i<n;i++){const[ax,az]=r[i],[bx,bz]=r[(i+1)%n],L=Math.hypot(bx-ax,bz-az);if(L<.25)continue;let nx=-(bz-az)/L,nz=(bx-ax)/L;if(!inPoly((ax+bx)/2+nx*.3,(az+bz)/2+nz*.3,r)){nx=-nx;nz=-nz}
      const w=.2,h=.3,ga=terrH(ax,az),gb=terrH(bx,bz),A0=[ax,ga-.08,az],B0=[bx,gb-.08,bz],A1=[ax,ga+h,az],B1=[bx,gb+h,bz],A2=[ax+nx*w,ga+h,az+nz*w],B2=[bx+nx*w,gb+h,bz+nz*w],A3=[ax+nx*w,ga+.04,az+nz*w],B3=[bx+nx*w,gb+.04,bz+nz*w];
      Q(A0,B0,B1,A1);Q(A1,B1,B2,A2);Q(A2,B2,B3,A3)}
    const theme=rnd(),[x0,z0,x1,z1]=bbox(r),sp=g.a>150?1.35:1.1;
    for(let x=x0+sp*.5;x<x1;x+=sp)for(let z=z0+sp*.5;z<z1;z+=sp){const px=x+(rnd()-.5)*sp*.8,pz=z+(rnd()-.5)*sp*.8;if(!inPoly(px,pz,r)||solid(px,pz))continue;
      let e=1e9;for(let i=0;i<n;i++){const[ax,az]=r[i],[bx,bz]=r[(i+1)%n],L2=(bx-ax)**2+(bz-az)**2||1,t=Math.max(0,Math.min(1,((px-ax)*(bx-ax)+(pz-az)*(bz-az))/L2));e=Math.min(e,Math.hypot(ax+(bx-ax)*t-px,az+(bz-az)*t-pz))}if(e<.35)continue;
      const y=terrH(px,pz);(rnd()<(theme<.45?.75:theme<.8?.2:.45)?GR:SH).push([px,y,pz,.75+rnd()*.5])}}
  if(pos.length){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();const m=new THREE.Mesh(geo,SM({color:0xb7b1a5,side:THREE.DoubleSide}));m.receiveShadow=true;m.castShadow=true;m.userData.ts=1;sc.add(m)}
  const c=new THREE.Color(),mm=new THREE.Matrix4(),q=new THREE.Quaternion(),sv=new THREE.Vector3(),pv=new THREE.Vector3(),UP=new THREE.Vector3(0,1,0);
  if(SH.length){const im=new THREE.InstancedMesh(GC.shr||(GC.shr=new THREE.IcosahedronGeometry(1,0)),SM({color:0xffffff}),SH.length),PAL=['#c99a22','#d47a26','#b8482a','#517b34','#6e8f3e','#8c3b2b','#d9b13a','#5f7d3a'];
    SH.forEach(([x,y,z,s],i)=>{const r=.32*s+.12;q.setFromAxisAngle(UP,rnd()*TAU);sv.set(r,r*.72,r);pv.set(x,y+r*.45,z);mm.compose(pv,q,sv);im.setMatrixAt(i,mm);c.set(pick(PAL)).offsetHSL(0,0,(rnd()-.5)*.08);im.setColorAt(i,c)});
    im.receiveShadow=true;im.frustumCulled=false;im.userData.ts=1;im.userData.chunk=110;sc.add(im)}
  if(GR.length){const im=new THREE.InstancedMesh(tuftGeo(),SM({color:0xffffff,side:THREE.DoubleSide}),GR.length),PAL=['#c9ad74','#b89b62','#d3bf8a','#a48d58','#bda56a','#8f9a5a'];
    GR.forEach(([x,y,z,s],i)=>{q.setFromAxisAngle(UP,rnd()*TAU);sv.set(s,s*(.9+rnd()*.3),s);pv.set(x,y-.02,z);mm.compose(pv,q,sv);im.setMatrixAt(i,mm);c.set(pick(PAL)).offsetHSL(0,0,(rnd()-.5)*.06);im.setColorAt(i,c)});
    im.receiveShadow=true;im.frustumCulled=false;im.userData.ts=1;im.userData.chunk=110;sc.add(im)}}
const brick64=()=>GC.brk64||(GC.brk64=SM({map:tucTex().brick}));
// Nippert's brick gate piers with limestone caps (tour 86-96 s, 146 s) in place of the old maroon arches
function nippertGates(D){const BR=brick64(),LS=mt(0xd9cfb8,.85);for(const g of D.gates){const tx=g.dz,tz=-g.dx,ry=Math.atan2(g.dx,g.dz),gy=terrH(g.x,g.z);
    for(const s of[-1,1]){const x=g.x+tx*s*3.3,z=g.z+tz*s*3.3,P=new THREE.Group();P.position.set(x,gy,z);P.rotation.y=ry;
      const sh=new THREE.Mesh(boxUV(new THREE.BoxGeometry(1.25,4.6,1.25),1.25,4.6,1.25,1.6),BR);sh.position.y=2.3;sh.castShadow=true;P.add(sh);
      const cb=new THREE.Mesh(boxUV(new THREE.BoxGeometry(1.45,.32,1.45),1.45,.32,1.45,1.6),BR);cb.position.y=4.5;P.add(cb);
      for(const[w,y,hh]of[[1.6,4.78,.24],[1.3,5.0,.22]]){const m=new THREE.Mesh(bgeo(w,hh,w),LS);m.position.y=y;m.castShadow=true;P.add(m)}
      const pc=new THREE.Mesh(GC.gpc||(GC.gpc=new THREE.ConeGeometry(.82,.5,4)),LS);pc.position.y=5.36;pc.rotation.y=PI/4;P.add(pc);
      const bs=new THREE.Mesh(bgeo(1.45,.3,1.45),LS);bs.position.y=.15;P.add(bs);P.userData.ts=1;sc.add(P);markR(x-.7,z-.7,x+.7,z+.7,5.6)}}}
// the poster kiosk at the head of MainStreet (tour 312 s)
function mainKiosk(x,z,ry){const tx=cvTex(160,384,(q,w,h)=>{q.fillStyle='#2b2b2e';q.fillRect(0,0,w,h);q.fillStyle=UCRED;q.fillRect(0,0,w,46);q.fillStyle='#fff';q.font='bold 24px Arial,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText('MAINSTREET',w/2,24);
    for(let i=0;i<14;i++){const pw=36+rnd()*40,ph=46+rnd()*50;q.fillStyle=pick(['#f2efe6','#e8c547','#d65a3a','#3a78b5','#f4f4f4','#7cb85a','#e88ab4','#222']);q.fillRect(6+rnd()*(w-pw-12),54+rnd()*(h-ph-60),pw,ph);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(10+rnd()*(w-30),60+rnd()*(h-80),18,3)}});
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;const b=new THREE.Mesh(bgeo(.95,2.35,.6),mt(0x2b2b2e,.6));b.position.y=1.175;b.castShadow=true;g.add(b);
  const fmM=new THREE.MeshLambertMaterial({map:tx});for(const s of[1,-1]){const f=new THREE.Mesh(new THREE.PlaneGeometry(.9,2.2),fmM);f.position.set(0,1.2,s*.302);if(s<0)f.rotation.y=PI;g.add(f)}
  const cp=new THREE.Mesh(bgeo(1.05,.08,.7),mt(0x1d1d20,.5));cp.position.y=2.39;g.add(cp);sc.add(g);markC(x,z,.6,2.5)}
// Campus Green's sports-light masts (tour 1296-1374, 1512 s)
function greenMasts(){for(const[x,z]of[[561,72],[590,108],[556,141],[586,170]]){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rnd()*PI;const M=mt(0x8c9096,.4,.5);
    const p=new THREE.Mesh(GC.gmp||(GC.gmp=new THREE.CylinderGeometry(.12,.2,12,8)),M);p.position.y=6;p.castShadow=true;g.add(p);const ar=new THREE.Mesh(bgeo(1.9,.1,.1),M);ar.position.y=11.7;g.add(ar);
    for(const s of[-.7,-.23,.23,.7])for(const yy of[11.45,12.05]){const h=new THREE.Mesh(bgeo(.34,.3,.22),mt(0x5d6166,.5));h.position.set(s,yy,.1);g.add(h);const l=new THREE.Mesh(GC.gml||(GC.gml=new THREE.PlaneGeometry(.28,.24)),bm(0xeef2f4));l.position.set(s,yy,.215);g.add(l)}
    sc.add(g);markC(x,z,.3,12)}}
function v64Campus(D){const B_=k=>D.B.find(b=>b.n===k);
  bikeRacks(D);plantBeds(D);nippertGates(D);greenMasts();
  for(const[x,z,a]of D.oseat||[])if(!tucNoLamp(x,z))cafeSet(x,z,a);
  // UC building ID monoliths the tour passes: Teachers-Dyer Complex (570/606 s) and Tangeman University Center (708 s, at the commons walk to the west portico)
  ucIdSign('Teachers-Dyer Complex','2610 McMicken Circle',273.6,419.8,[0,-1]);
  ucIdSign('Tangeman University Center','2766 UC MainStreet',291.2,330.6,[-1,0]);
  // wayfinding: the red blade at TUC's west steps (the user's photo) and the charcoal blade east of Campus Green (1650 s)
  ucWaySign([['University Pavilion','↘'],['CCM Village','↓'],['MainStreet','↖']],300.6,329.2,[-1,0],UCRED);
  ucWaySign([['University Ave. Garage','↗'],['Spencer Hall','↑'],['Scioto/Morgens Hall','↑'],['Campus Green','↖'],['Lindner Hall','↖'],['ERC','←'],['Campus Rec Center','←'],['MainStreet','←']],616,207,[0,1]);
  for(const[x,z]of[[396,299],[469,251],[601,163],[646,301]])helpPhone(x,z,rnd()*TAU);
  mainKiosk(356.5,293.5,-.4);
  // Dieterle: brick wall right of the front steps with the centre's name across it (tour 45-54 s)
  {const b=B_('Dieterle Vocal Arts Center');if(b){const[fx,fz]=b.fp,[nx,nz]=b.fn,rx=-nz,rz=nx,cx=fx+nx*4.4-rx*9.2,cz=fz+nz*4.4-rz*9.2,ry=Math.atan2(nx,nz),gy=terrH(cx,cz),Lw=8.2;
    const w=new THREE.Mesh(boxUV(new THREE.BoxGeometry(Lw,1.15,.45),Lw,1.15,.45,1.6),brick64());w.position.set(cx,gy+.575,cz);w.rotation.y=ry;w.castShadow=true;w.userData.ts=1;sc.add(w);
    const cp=new THREE.Mesh(bgeo(Lw+.1,.1,.55),mt(0xd9cfb8,.85));cp.position.set(cx,gy+1.2,cz);cp.rotation.y=ry;cp.userData.ts=1;sc.add(cp);
    const t=lettersL('DIETERLE VOCAL ARTS CENTER',7.4,.4,'#efe7d4');t.position.set(cx+nx*.235,gy+.86,cz+nz*.235);t.rotation.y=ry;t.userData.ts=1;sc.add(t);const hx=rx*Lw/2,hz=rz*Lw/2;markPoly([[cx-hx-nx*.3,cz-hz-nz*.3],[cx+hx-nx*.3,cz+hz-nz*.3],[cx+hx+nx*.3,cz+hz+nz*.3],[cx-hx+nx*.3,cz-hz+nz*.3]],1.3)}}
  // University Pavilion: its name in dark letters on the white panel beside the doors, square planters either side (tour 535 s)
  {const b=B_('University Pavilion');if(b){const[fx,fz]=b.fp,[nx,nz]=b.fn,rx=nz,rz=-nx,lv=terrH(fx+nx*1.6,fz+nz*1.6),ry=Math.atan2(nx,nz);
    for(const[t,dy]of[['University',.0],['Pavilion',-.42]]){const m=lettersL(t,1.5,.36,'#4d5056','Georgia,serif',0);m.position.set(fx+nx*.14+rx*3.6,lv+2.7+dy,fz+nz*.14+rz*3.6);m.rotation.y=ry;m.userData.ts=1;sc.add(m)}
    for(const s of[-1,1]){const x=fx+nx*1.9+rx*s*2.4,z=fz+nz*1.9+rz*s*2.4,gy=terrH(x,z);const pl=new THREE.Mesh(bgeo(1,.7,1),mt(0xb9b4aa,.85));pl.position.set(x,gy+.35,z);pl.castShadow=true;pl.userData.ts=1;sc.add(pl);
      const sh=new THREE.Mesh(GC.shr||(GC.shr=new THREE.IcosahedronGeometry(1,0)),mt(0x3f6a35,.9));sh.scale.set(.42,.55,.42);sh.position.set(x,gy+1.1,z);sh.castShadow=true;sh.userData.ts=1;sc.add(sh);markC(x,z,.6,1.4)}}}
}
// ---------------------------------------------------------------- paving: one colour per plaza in the baked ground plus a per-pixel paver pattern near the eye
// [pattern 0 brick running bond | 1 herringbone | 2 square pavers | 3 concrete slabs (joints painted), colour, polygon, paint over everything (else only the paved areas)]
