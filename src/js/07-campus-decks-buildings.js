// ================================================================ V62 walkable decks: every footbridge, the raised footway on Mary Emery Hall, the outdoor stairs.
// A deck is a centreline with a height at each vertex. The player walks on it between its parapets and steps off only where the
// ground (or another deck) meets it; NPCs keep to the ground (they walk under the bridges, never through the stair masses).
const DECKS=[];
function deckMk(P,ys,w,k,o={}){const n=P.length,s=[0];for(let i=1;i<n;i++)s.push(s[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;for(const[x,z]of P){x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z)}
  const d={P,ys,s,L:s[n-1],hw:w/2,w,k,cov:o.cov||0,bb:[x0-w,z0-w,x1+w,z1+w],t0:0,t1:s[n-1]};DECKS.push(d);return d}
function deckY(d,t){const s=d.s,y=d.ys;if(t<=0)return y[0];for(let i=1;i<s.length;i++)if(t<=s[i])return y[i-1]+(y[i]-y[i-1])*(t-s[i-1])/((s[i]-s[i-1])||1);return y[y.length-1]}
function deckPt(d,t){const s=d.s,P=d.P;for(let i=1;i<s.length;i++)if(t<=s[i]||i===s.length-1){const f=Math.max(0,Math.min(1,(t-s[i-1])/((s[i]-s[i-1])||1)));return[P[i-1][0]+(P[i][0]-P[i-1][0])*f,P[i-1][1]+(P[i][1]-P[i-1][1])*f]}return P[0]}
function deckQ(d,x,z){if(d.area){const ins=inPoly(x,z,d.area.poly)&&!d.area.holes.some(h=>inPoly(x,z,h));return{i:0,u:.5,off:ins?0:200,t:1,out:ins?0:1,y:d.y}}let b=null;const P=d.P,n=P.length;for(let i=0;i<n-1;i++){const a=P[i][0],c=P[i][1],vx=P[i+1][0]-a,vz=P[i+1][1]-c,L2=vx*vx+vz*vz||1e-9,u=((x-a)*vx+(z-c)*vz)/L2,uc=u<0?0:u>1?1:u,off=Math.hypot(x-a-vx*uc,z-c-vz*uc);if(!b||off<b.off-1e-6)b={i,u,off,t:d.s[i]+uc*(d.s[i+1]-d.s[i])}}
  b.out=(b.i===0&&b.u<0)?-1:(b.i===n-2&&b.u>1)?1:0;b.y=deckY(d,b.t);return b}
const deckOn=(d,q,m=.34)=>q.out===0&&q.off<=d.hw-m&&q.t>=d.t0&&q.t<=d.t1;
const inBB=(e,x,z)=>x>=e.bb[0]&&x<=e.bb[2]&&z>=e.bb[1]&&z<=e.bb[3];
// stepping onto a deck from the ground: only through one of its open ends, where it meets the ground
function deckEnter(x,z){const g=terrH(x,z);for(let k=0;k<DECKS.length;k++){const e=DECKS[k];if(!inBB(e,x,z))continue;const q=deckQ(e,x,z);if(deckOn(e,q)&&Math.abs(q.y-g)<.75&&(q.t<e.t0+1.8||q.t>e.t1-1.8))return k}return null}
function mvOK(x,z,r){if(P.inside||P.kart)return freeAt(x,z,r);
  if(P.dk!=null){const d=DECKS[P.dk],q=deckQ(d,x,z);if(deckOn(d,q))return true;const y=deckQ(d,P.x,P.z).y;
    for(let k=0;k<DECKS.length;k++){if(k===P.dk)continue;const e=DECKS[k];if(!inBB(e,x,z))continue;const q2=deckQ(e,x,z);if(deckOn(e,q2)&&Math.abs(q2.y-y)<.6){P.dk=k;return true}}
    if(q.out===0&&q.t>=d.t0&&q.t<=d.t1&&q.off<d.hw+.8)return false;          // the parapet
    if(Math.abs(terrH(x,z)-y)<.75&&freeAt(x,z,r)){P.dk=null;return true}return false}
  if(freeAt(x,z,r)){const k=deckEnter(x,z);if(k!=null)P.dk=k;return true}
  const k=deckEnter(x,z);if(k!=null){P.dk=k;return true}return false}
function deckHere(){if(P.dk==null)return null;if(P.kart){P.dk=null;return null}const d=DECKS[P.dk];if(!d){P.dk=null;return null}const q=deckQ(d,P.x,P.z);if(q.off>d.hw+1.5||q.t<-1.5||q.t>d.L+1.5){P.dk=null;return null}return q.y}
function bridges(D){
  // OSM footbridges: deck heights from the lidar (the level ones held flat at their median, the TUC-CCM one comes as a deck below)
  for(const b of D.bridges||[]){const P=b.p,n=P.length;if(n<2||b.skipZ)continue;if([P[0],P[n-1]].some(q=>Math.hypot(q[0]-369.3,q[1]-171)<2.5)&&[P[0],P[n-1]].some(q=>Math.hypot(q[0]-382,q[1]-166)<3))continue;let ys=P.map(([x,z],i)=>terrH(x,z)+b.h[i]);
    if(b.lev===2){const m=Math.max(...ys);ys=ys.map(()=>m)}else if(b.lev){const s=ys.slice().sort((a,c)=>a-c),m=s[s.length>>1];ys=ys.map(()=>m)}
    else for(let it=0;it<3;it++){const y2=ys.slice();for(let i=1;i<n-1;i++)y2[i]=(ys[i-1]+ys[i]*2+ys[i+1])/4;ys=y2}
    deckMk(P,ys,b.w,'br',{cov:b.cov})}
  for(const d of D.decks||[])deckMk(d.p,d.y.map((v,i)=>v==null?terrH(d.p[i][0],d.p[i][1]):v),d.w,d.k);
  // a deck that runs into a building stops at its wall
  const FP=D.B.map(b=>{const p=gpoly(b.p[0]);return[p,bbox(p)]}),inB=(x,z)=>FP.some(([p,bb])=>x>bb[0]&&x<bb[2]&&z>bb[1]&&z<bb[3]&&inPoly(x,z,p));
  for(const d of DECKS){if(d.area||d.cst||d.nob)continue;let t0=0;while(t0<d.L*.5&&inB(...deckPt(d,t0)))t0+=.2;let t1=d.L;while(t1>d.L*.5&&inB(...deckPt(d,t1)))t1-=.2;d.t0=t0>0?t0+.35:0;d.t1=t1<d.L?t1-.35:d.L}
  const DS=THREE.DoubleSide,DK=SM({color:0xb4aea2,side:DS}),PA=SM({color:0xc9c3b6,side:DS}),RF=SM({color:0x5f6468,side:DS}),RL=SM({color:0x272b30,side:DS}),
    GL=SM({color:0x9fc3d6,transparent:true,opacity:.48,side:DS,depthWrite:false}),TRD=SM({color:0xc3bcae,side:DS}),CH=SM({color:0xaaa396,side:DS}),
    PKM=new THREE.MeshLambertMaterial({map:ctex(64,64,q=>{q.clearRect(0,0,64,64);q.fillStyle='#272b30';for(let x=6;x<64;x+=16)q.fillRect(x,0,4,64);q.fillRect(0,0,64,6);q.fillRect(0,58,64,6)}),transparent:true,alphaTest:.5,side:DS});
  const mesh=(arr,mat,uv)=>{if(!arr.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();g.setAttribute('uv',uv?new THREE.Float32BufferAttribute(uv,2):new THREE.BufferAttribute(new Float32Array(arr.length/3*2),2));const m=new THREE.Mesh(g,mat);m.castShadow=mat!==GL&&mat!==PKM;m.receiveShadow=true;m.userData.ts=1;sc.add(m);return m};
  const Q=(A,a,b,c,d)=>A.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2],a[0],a[1],a[2],c[0],c[1],c[2],d[0],d[1],d[2]);
  // a band between two edge polylines A,B (x,z) from heights lo(i) to hi(i): top, bottom and both sides; runs only where on(i)
  const band=(arr,A,B,lo,hi,caps,on)=>{const n=A.length,v=(p,y)=>[p[0],y,p[1]];let st=-1;for(let i=0;i<n;i++){const ok=!on||on(i);if(ok&&st<0)st=i;if((!ok||i===n-1)&&st>=0){const en=ok?i:i-1;
      for(let j=st;j<en;j++){Q(arr,v(A[j],hi(j)),v(B[j],hi(j)),v(B[j+1],hi(j+1)),v(A[j+1],hi(j+1)));Q(arr,v(A[j],lo(j)),v(A[j+1],lo(j+1)),v(B[j+1],lo(j+1)),v(B[j],lo(j)));Q(arr,v(A[j],lo(j)),v(A[j],hi(j)),v(A[j+1],hi(j+1)),v(A[j+1],lo(j+1)));Q(arr,v(B[j],lo(j)),v(B[j+1],lo(j+1)),v(B[j+1],hi(j+1)),v(B[j],hi(j)))}
      if(caps&&en>st)for(const j of[st,en])Q(arr,v(A[j],lo(j)),v(B[j],lo(j)),v(B[j],hi(j)),v(A[j],hi(j)));st=-1}}};
  const off=(P,d)=>P.map((p,i)=>{const a=P[Math.max(0,i-1)],c=P[Math.min(P.length-1,i+1)];let dx=c[0]-a[0],dz=c[1]-a[1];const l=Math.hypot(dx,dz)||1;return[p[0]-dz/l*d,p[1]+dx/l*d]});
  // picket railing strip (u runs along the edge, so the bars keep their spacing)
  const strip=(arr,uv,E,lo,hi,on)=>{let s=0;for(let i=0;i<E.length-1;i++){const l=Math.hypot(E[i+1][0]-E[i][0],E[i+1][1]-E[i][1]);if(!on||on(i)&&on(i+1)){Q(arr,[E[i][0],lo(i),E[i][1]],[E[i+1][0],lo(i+1),E[i+1][1]],[E[i+1][0],hi(i+1),E[i+1][1]],[E[i][0],hi(i),E[i][1]]);const u0=s/.6,u1=(s+l)/.6;uv.push(u0,0,u1,0,u1,1,u0,0,u1,1,u0,1)}s+=l}};
  const post=(A,x,y0,z,h,w=.06)=>{const a=w/2;for(const[p,q2]of[[[-a,-a],[a,-a]],[[a,-a],[a,a]],[[a,a],[-a,a]],[[-a,a],[-a,-a]]])Q(A,[x+p[0],y0,z+p[1]],[x+q2[0],y0,z+q2[1]],[x+q2[0],y0+h,z+q2[1]],[x+p[0],y0+h,z+p[1]])};
  const dense=(d,step)=>{const P=[],Y=[],T=[];for(let i=0;i<d.P.length-1;i++){const[a,b]=d.P[i],[c,e]=d.P[i+1],l=d.s[i+1]-d.s[i],m=Math.max(1,Math.ceil(l/step));for(let k=0;k<m;k++){const f=k/m;P.push([a+(c-a)*f,b+(e-b)*f]);Y.push(d.ys[i]+(d.ys[i+1]-d.ys[i])*f);T.push(d.s[i]+l*f)}}P.push(d.P[d.P.length-1].slice());Y.push(d.ys[d.ys.length-1]);T.push(d.L);return{P,Y,T}};
  // is an edge point open to another deck at the same level (junctions get no parapet)?
  const joins=(d,x,z,y)=>DECKS.some(e=>e!==d&&inBB(e,x,z)&&(()=>{const q=deckQ(e,x,z);return q.out===0&&q.off<e.hw-.05&&Math.abs(q.y-y)<.6})());
  for(const d of DECKS){if(d.area||d.cst)continue;const{P,Y,T}=dense(d,1),n=P.length,hw=d.hw,G=P.map(([x,z])=>terrH(x,z)),Yr=Y.map(y=>y+.03);
    const dk=[],pa=[],gl=[],rf=[],rl=[],pk=[],pkuv=[],tr=[],ch=[];
    const Lo=off(P,hw),Ro=off(P,-hw),openL=Lo.map(([x,z],i)=>joins(d,x,z,Y[i])),openR=Ro.map(([x,z],i)=>joins(d,x,z,Y[i])),onL=i=>!openL[i],onR=i=>!openR[i];
    if(d.k==='st'){const W=hw-.24;
      // treads and risers, flight by flight (each sloping profile segment is a flight of ~16 cm risers)
      for(let i=0;i<d.P.length-1;i++){const[a,b]=d.P[i],[c,e]=d.P[i+1],l=d.s[i+1]-d.s[i];if(l<1e-3)continue;const ux=(c-a)/l,uz=(e-b)/l,nx=-uz,nz=ux,y0=d.ys[i]+.02,dy=d.ys[i+1]-d.ys[i];
        const at=(t,o,y)=>[a+ux*t+nx*o,y,b+uz*t+nz*o];
        if(Math.abs(dy)<.02){Q(tr,at(0,-W,y0),at(0,W,y0),at(l,W,y0),at(l,-W,y0));Q(tr,at(0,-W,y0-.3),at(l,-W,y0-.3),at(l,W,y0-.3),at(0,W,y0-.3));continue}
        const m=Math.max(1,Math.round(Math.abs(dy)/.16));let yp=y0;
        for(let k=0;k<m;k++){const ta=l*k/m,tb=l*(k+1)/m,yk=y0+dy*(k+1)/m;Q(tr,at(ta,-W,yp),at(ta,W,yp),at(ta,W,yk),at(ta,-W,yk));Q(tr,at(ta,-W,yk),at(ta,W,yk),at(tb,W,yk),at(tb,-W,yk));yp=yk}}
      // cheek walls from below the ground to just above the nosings, handrails on them, and a centre rail on the wide stairs
      const Li=off(P,hw-.24),Ri=off(P,-(hw-.24)),lo=i=>Math.min(G[i],Y[i])-.7,hi=i=>Y[i]+.3;band(ch,Lo,Li,lo,hi,1,onL);band(ch,Ri,Ro,lo,hi,1,onR);   // V127: open where another deck joins at the same level
      for(const o of d.w>=2.8?[hw-.12,0,-(hw-.12)]:[hw-.12,-(hw-.12)]){band(rl,off(P,o+.035),off(P,o-.035),i=>Y[i]+.93,i=>Y[i]+1.0,0,o>0?onL:o<0?onR:null);
        for(let t=.4;t<d.L-.2;t+=1.3){const[x,z]=deckPt(d,t),[x2,z2]=deckPt(d,Math.min(d.L,t+.05)),ux=x2-x,uz=z2-z,l=Math.hypot(ux,uz)||1,y=deckY(d,t),px=x-uz/l*o,pz=z+ux/l*o;if(o!==0&&joins(d,x-uz/l*(o>0?hw:-hw),z+ux/l*(o>0?hw:-hw),y))continue;o===0?post(rl,px,y,pz,.95):post(rl,px,y+.3,pz,.65)}}}
    else{band(dk,Lo,Ro,i=>Yr[i]-.6,i=>Yr[i],1);
      if(d.k==='pod')band(ch,Lo,Ro,i=>Math.min(G[i]-.5,Y[i]-.6),i=>Y[i]-.6,1);
      const Li=off(P,hw-.22),Ri=off(P,-(hw-.22));
      if(d.cov){band(pa,Lo,Li,i=>Yr[i],i=>Yr[i]+.95,1);band(pa,Ri,Ro,i=>Yr[i],i=>Yr[i]+.95,1);
        for(const E of[Lo,Ro])for(let i=0;i<n-1;i++)Q(gl,[E[i][0],Yr[i]+.95,E[i][1]],[E[i+1][0],Yr[i+1]+.95,E[i+1][1]],[E[i+1][0],Yr[i+1]+2.9,E[i+1][1]],[E[i][0],Yr[i]+2.9,E[i][1]]);
        band(rf,off(P,hw+.15),off(P,-hw-.15),i=>Yr[i]+2.9,i=>Yr[i]+3.25,1)}
      else{band(pa,Lo,Li,i=>Yr[i],i=>Yr[i]+.42,1,onL);band(pa,Ri,Ro,i=>Yr[i],i=>Yr[i]+.42,1,onR);
        strip(pk,pkuv,off(P,hw-.11),i=>Yr[i]+.42,i=>Yr[i]+1.06,onL);strip(pk,pkuv,off(P,-(hw-.11)),i=>Yr[i]+.42,i=>Yr[i]+1.06,onR);
        band(rl,off(P,hw-.04),off(P,hw-.18),i=>Yr[i]+1.04,i=>Yr[i]+1.1,0,onL);band(rl,off(P,-(hw-.18)),off(P,-(hw-.04)),i=>Yr[i]+1.04,i=>Yr[i]+1.1,0,onR)}
      // piers under a span that runs high over the ground (never in a roadway)
      if(d.k==='br')for(let t=3.5;t<d.L-3;t+=8.5){const[x,z]=deckPt(d,t),y=deckY(d,t),g=terrH(x,z);if(y-g>2.6&&!onRoad(x,z)){cyl(x,(y-.6+g)/2,z,.42,y-.6-g+.3,mt(0xb8b2a6,.9),12).userData.ts=1;/* V129: already at its true height */markC(x,z,.5,y-g)}}}
    mesh(dk,DK);mesh(pa,PA);mesh(gl,GL);mesh(rf,RF);mesh(rl,RL);mesh(pk,PKM,pkuv);mesh(tr,TRD);mesh(ch,CH);
    // people on the ground: the solid mass under a podium or a stair, and the parapets/cheeks where the deck runs near the ground
    const[bx0,bz0,bx1,bz1]=d.bb;cells(bx0,bz0,bx1,bz1,(k,x,z)=>{const q=deckQ(d,x,z);if(q.out!==0||q.t<d.t0-.1||q.t>d.t1+.1||q.off>hw+.15)return;const g=terrH(x,z),h=q.y-g;
      if(q.off<=hw&&(d.k==='pod'||d.k==='st')&&h>.9){WG[k]=1;HG[k]=Math.max(HG[k],Math.min(255,Math.ceil(h)))}
      else if(q.off>hw-.3&&Math.abs(h)<1.4&&q.t>d.t0+1.8&&q.t<d.t1-1.8){WG[k]=1;HG[k]=Math.max(HG[k],1)}})}
  // the TUC plaza's edge above Backstage Drive: retaining wall, curb and railing from University Pavilion's corner to the bridge head
  {const z=376.0,xa=279.6,xb=300.9,c=[],r=[],pk=[],pkuv=[];
    const n=Math.ceil((xb-xa)/2),Es=[...Array(n+1)].map((_,i)=>[xa+(xb-xa)*i/n,z]),Ys=Es.map(([x,z2])=>terrH(x,z2-.3));
    band(c,Es.map(([x,z2])=>[x,z2-.2]),Es.map(([x,z2])=>[x,z2+.22]),i=>Ys[i]-8,i=>Ys[i]+.42,1);strip(pk,pkuv,Es,i=>Ys[i]+.42,i=>Ys[i]+1.06);band(r,Es.map(([x,z2])=>[x,z2-.05]),Es.map(([x,z2])=>[x,z2+.09]),i=>Ys[i]+1.04,i=>Ys[i]+1.1,0);
    mesh(c,PA);mesh(pk,PKM,pkuv);mesh(r,RL);cells(xa,z-.3,xb,z+.4,k=>{WG[k]=1;HG[k]=Math.max(HG[k],2)})}}
// ================================================================ V62 Tangeman University Center, rebuilt from the 2021 lidar and photos of its McMicken commons front:
// the 1937 front range (Flemish-bond brick, limestone trim, slate hip roof) with its Ionic portico, the main hall behind carrying the clock tower
// on the portico's axis, the glass link between them, Gwathmey Siegel's zinc wrapper (2004) all round, granite terrace steps along the commons,
// the north entrance canopy on MainStreet, and the covered plaza at the south-west corner where the footbridge to CCM starts
let TUCG=null;
function tucTex(){if(TUCG)return TUCG;const T={};
  T.slate=ctex(128,128,(q,w,h)=>{q.fillStyle='#4f535b';q.fillRect(0,0,w,h);for(let y=0;y<h;y+=8)for(let x=-((y/8)%2)*8;x<w;x+=16){const c=[[88,92,100],[96,92,104],[84,94,92],[102,98,96],[78,82,90]][(rnd()*5)|0];q.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`;q.fillRect(x+1,y+1,14,7)}});
  T.brick=ctex(128,128,(q,w,h)=>{q.fillStyle='#9d9184';q.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){const hd=(y/8)%2;for(let x=0,k=0;x<w;k++){const L=(k+hd)%2?16:8;q.fillStyle=L===8?shade('#64291e',rnd()*12-6):shade('#7d3626',rnd()*16-8);q.fillRect(x+1,y+1,L-1,6);x+=L}}});
  T.glass=ctex(128,128,(q,w,h)=>{const g=q.createLinearGradient(0,0,w,h);g.addColorStop(0,'#a9c4d4');g.addColorStop(1,'#6f8fa6');q.fillStyle=g;q.fillRect(0,0,w,h);q.fillStyle='#e8ecef';for(let x=0;x<w;x+=32)q.fillRect(x,0,3,h);for(let y=0;y<h;y+=64)q.fillRect(0,y,w,3)});
  T.tymp=ctex(256,128,(q,w,h)=>{q.fillStyle='#e2dccb';q.fillRect(0,0,w,h);q.strokeStyle='rgba(120,110,90,.55)';q.lineWidth=3;q.fillStyle='#d4ccb8';
    q.beginPath();q.ellipse(128,70,26,30,0,0,TAU);q.fill();q.stroke();q.fillStyle='#3b4652';q.beginPath();q.arc(128,70,13,0,TAU);q.fill();q.strokeStyle='#efe9da';q.lineWidth=2;q.beginPath();q.moveTo(115,70);q.lineTo(141,70);q.moveTo(128,57);q.lineTo(128,83);q.stroke();
    q.strokeStyle='rgba(110,100,80,.6)';q.lineWidth=5;for(const s of[-1,1]){q.beginPath();q.moveTo(128+s*28,62);q.quadraticCurveTo(128+s*58,96,128+s*92,70);q.stroke();q.beginPath();q.arc(128+s*96,76,6,0,TAU);q.stroke()}
    q.lineWidth=3;q.beginPath();q.moveTo(108,40);q.quadraticCurveTo(128,22,148,40);q.stroke()});
  T.clock=null;TUCG=T;return T}
function nlhBanner(word,bg,fg){const c=document.createElement('canvas');c.width=96;c.height=288;const q=c.getContext('2d');q.fillStyle=bg;q.fillRect(0,0,96,288);q.save();q.translate(50,146);q.rotate(-PI/2);q.fillStyle=fg;q.font='bold 66px Arial,Helvetica,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(word,0,0);q.restore();return new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide})}
function tucBanner(lines,bg,fg){const c=document.createElement('canvas');c.width=96;c.height=288;const q=c.getContext('2d');q.fillStyle=bg;q.fillRect(0,0,96,288);q.fillStyle=fg;q.textAlign='center';q.textBaseline='middle';
  let y=70;for(const[t,s,col]of lines){q.fillStyle=col||fg;q.font=`bold ${s}px Arial,Helvetica,sans-serif`;q.fillText(t,48,y);y+=s*1.25}q.fillStyle='#c8102e';q.fillRect(30,236,36,30);q.fillStyle='#fff';q.font='bold 20px Georgia,serif';q.fillText('UC',48,252);
  const t=new THREE.CanvasTexture(c);return new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide})}
function letters(text,w,h,col){const c=document.createElement('canvas'),W=1024,H=Math.max(32,Math.round(W*h/w));c.width=W;c.height=H;const q=c.getContext('2d');q.clearRect(0,0,W,H);q.fillStyle=col;let fs=Math.floor(H*.8);const F=s=>`${s}px Helvetica,Arial,sans-serif`;q.font=F(fs);while(q.measureText(text).width>W*.98&&fs>8){fs-=2;q.font=F(fs)}q.textAlign='center';q.textBaseline='middle';
  if(q.letterSpacing!==undefined)q.letterSpacing=Math.round(fs*.12)+'px';q.fillText(text,W/2,H/2);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.3}))}
function tucBuild(b,main){
  const T=tucTex(),AX=b.fp[1],[fx0,fz0,fx1,fz1]=b.tf,[hx0,hz0,hx1,hz1]=b.th,[lx0,lz0,lx1,lz1]=b.tl,[px0,pz0,px1,pz1]=b.tp,[tx,tz]=UCD.pts.tucTower,LV=terrH(b.fp[0]+b.fn[0]*1.6,b.fp[1]+b.fn[1]*1.6);
  const DS=THREE.DoubleSide,SL=SM({map:T.slate,side:DS}),LS=mt(0xe4dece,.85),LSd=mt(0xc6bfad,.9),WH=mt(0xf4f1ea,.6),IRON=mt(0x1d2125,.6),GRN=mt(0xa8968e,.9),DKG=mt(0x2a333d,.4),
    BRK=SM({map:T.brick}),GLR=SM({map:T.glass,side:DS,transparent:true,opacity:.86}),LEAD=mt(0x4c5157,.6),ZR=0x5d636c;
  const tri=(A,a,b2,c)=>A.push(...a,...b2,...c),quad=(A,a,b2,c,d)=>{tri(A,a,b2,c);tri(A,a,c,d)};
  const geo=(A,mat,uvs=4)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A,3));g.computeVertexNormals();const n=A.length/3,uv=new Float32Array(n*2),N=g.attributes.normal;
    for(let i=0;i<n;i++){const ax=Math.abs(N.getX(i)),az=Math.abs(N.getZ(i));uv[2*i]=(ax>az?A[3*i+2]:A[3*i])/uvs;uv[2*i+1]=(Math.abs(N.getY(i))>.95?(ax>az?A[3*i]:A[3*i+2]):A[3*i+1])/uvs}
    g.setAttribute('uv',new THREE.BufferAttribute(uv,2));const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;sc.add(m);return m};
  const bx=(x,y,z,w,h,d,mat,c=1)=>box(x,y,z,w,h,d,mat,c);
  const brickBox=(x,y,z,w,h,d)=>{const g=boxUV(new THREE.BoxGeometry(w,h,d),w,h,d,2);const m=new THREE.Mesh(g,BRK);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;sc.add(m);return m};
  // hip roof over a rectangle (ridge along its long side), gable roof along z
  const hip=(x0,z0,x1,z1,y,rise,mat)=>{const A=[],w=x1-x0,d=z1-z0,Y=y+rise;if(d>=w){const xc=(x0+x1)/2,za=z0+w/2,zb=z1-w/2;quad(A,[x0,y,z0],[x0,y,z1],[xc,Y,zb],[xc,Y,za]);quad(A,[x1,y,z1],[x1,y,z0],[xc,Y,za],[xc,Y,zb]);tri(A,[x1,y,z0],[x0,y,z0],[xc,Y,za]);tri(A,[x0,y,z1],[x1,y,z1],[xc,Y,zb])}
    else{const zc=(z0+z1)/2,xa=x0+d/2,xb=x1-d/2;quad(A,[x1,y,z0],[x0,y,z0],[xa,Y,zc],[xb,Y,zc]);quad(A,[x0,y,z1],[x1,y,z1],[xb,Y,zc],[xa,Y,zc]);tri(A,[x0,y,z0],[x0,y,z1],[xa,Y,zc]);tri(A,[x1,y,z1],[x1,y,z0],[xb,Y,zc])}return geo(A,mat)};
  markPoly(main,b.h);
  // ---- zinc wrapper: diamond-shingled walls whose top edge rolls over onto the roof (three insets of the outline)
  for(const[ring,hh,ins]of b.tz){const top=hh-1.6;prism(gpoly(ring),0,top,hh===10?'zincH':'zinc',ZR,{solid:false});const lvl=[[top,.6],[top+.6,.55],[top+1.15,.45]];ins.forEach((rs,k)=>{for(const r of rs)prism(gpoly(r),lvl[k][0],lvl[k][1],'zincP',ZR,{solid:false})})}
  // ---- glass link between the front range and the main hall
  prism([[lx0,lz0],[lx1,lz0],[lx1,lz1],[lx0,lz1]],0,10.9,'tucB',0x6d8496,{solid:false});{const g=new THREE.Mesh(new THREE.PlaneGeometry(lx1-lx0,lz1-lz0),GLR);g.rotation.x=-PI/2;g.position.set((lx0+lx1)/2,10.95,(lz0+lz1)/2);sc.add(g)}
  // ---- front range: brick on a limestone base, stringcourse, sash windows (the 'tucB' facade), limestone cornice, slate hip roof
  prism([[fx0,fz0],[fx1,fz0],[fx1,fz1],[fx0,fz1]],0,10.1,'tucB',0x4f535b,{solid:false});
  bx((fx0+fx1)/2,10.42,(fz0+fz1)/2,fx1-fx0+.8,.64,fz1-fz0+.8,LS);bx((fx0+fx1)/2,10.08,(fz0+fz1)/2,fx1-fx0+.5,.16,fz1-fz0+.5,LSd,0);
  hip(fx0-.35,fz0-.35,fx1+.35,fz1+.35,10.74,2.95,SL);
  // ---- main hall: taller brick block with a gabled slate roof; big chimneys on the gable ends; glazed panels round the tower's base
  prism([[hx0,hz0],[hx1,hz0],[hx1,hz1],[hx0,hz1]],0,15.6,'tucB',0x4f535b,{solid:false});bx((hx0+hx1)/2,15.75,(hz0+hz1)/2,hx1-hx0+.6,.36,hz1-hz0+.6,LS);
  {const A=[],G=[],y=15.9,Y=24.2,xc=(hx0+hx1)/2,x0=hx0-.35,x1=hx1+.35,z0=hz0-.3,z1=hz1+.3;quad(A,[x0,y,z0],[x0,y,z1],[xc,Y,z1],[xc,Y,z0]);quad(A,[x1,y,z1],[x1,y,z0],[xc,Y,z0],[xc,Y,z1]);geo(A,SL);
    const gb=[];tri(gb,[hx0,y-.2,hz0],[hx1,y-.2,hz0],[xc,Y-.15,hz0]);tri(gb,[hx1,y-.2,hz1],[hx0,y-.2,hz1],[xc,Y-.15,hz1]);geo(gb,SM({map:T.brick,side:DS}),2);
    // glazing on both slopes round the tower (the lidar sees straight through it to the atrium floor)
    const s=(Y-y)/(xc-x0),gy=x=>y+(x<xc?(x-x0):(x1-x))*s+.06;for(const[a,c]of[[xc-5.6,xc-.9],[xc+.9,xc+5.6]]){const P=[];quad(P,[a,gy(a),AX-5.2],[a,gy(a),AX+5.2],[c,gy(c),AX+5.2],[c,gy(c),AX-5.2]);geo(P,GLR,2)}
    for(const cz of[hz0+1.2,hz1-1.2]){brickBox(xc,22.8,cz,4.6,8.2,1.9);bx(xc,27.05,cz,5.0,.35,2.3,LS);for(const dx of[-1.5,-.5,.5,1.5])cyl(xc+dx,27.6,cz,.22,.8,0x7a3a2a,8)}}
  // ---- the clock tower, on the portico's axis: rusticated limestone base with an oculus, balustrade with urns, clock stage, octagonal louvred belfry, lead dome, finial
  {bx(tx,22.4,tz,5.0,7.6,5.0,LSd);for(let y=19.2;y<26;y+=.55)bx(tx,y,tz,5.06,.06,5.06,mt(0xa9a291,.9),0);
    for(const[dx,dz,ry]of[[0,2.53,0],[0,-2.53,PI],[2.53,0,PI/2],[-2.53,0,-PI/2]]){const r=new THREE.Mesh(GC.tor||(GC.tor=new THREE.TorusGeometry(.62,.13,6,18)),LS);r.position.set(tx+dx,24.4,tz+dz);r.rotation.y=ry;sc.add(r);const g=new THREE.Mesh(GC.ocd||(GC.ocd=new THREE.CircleGeometry(.56,16)),DKG);g.position.set(tx+dx*1.004,24.4,tz+dz*1.004);g.rotation.y=ry;sc.add(g)}
    bx(tx,26.4,tz,5.7,.5,5.7,LS);bx(tx,27.55,tz,5.2,.14,5.2,LS);
    for(const s of[-1,1])for(const ax of[0,1])for(let k=-4;k<=4;k++){const o=k*.55;cyl(tx+(ax?s*2.45:o),27.08,tz+(ax?o:s*2.45),.09,.66,LS,6,0)}
    for(const[a,c]of[[-1,-1],[1,-1],[-1,1],[1,1]]){cyl(tx+a*2.5,27.0,tz+c*2.5,.26,.7,LS,8);const u=new THREE.Mesh(GC.urn||(GC.urn=new THREE.SphereGeometry(.3,10,8)),LS);u.position.set(tx+a*2.5,27.65,tz+c*2.5);u.scale.y=1.3;sc.add(u);cyl(tx+a*2.5,28.05,tz+c*2.5,.07,.35,LS,6,0)}
    bx(tx,29.55,tz,4.1,3.9,4.1,LS);for(const[a,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])bx(tx+a*1.92,29.55,tz+c*1.92,.42,3.9,.42,LSd);
    {const c=document.createElement('canvas');c.width=c.height=256;clockCtx=c.getContext('2d');clockTex=new THREE.CanvasTexture(c);const mat=new THREE.MeshBasicMaterial({map:clockTex});for(const[dx,dz,ry]of[[0,2.07,0],[0,-2.07,PI],[2.07,0,PI/2],[-2.07,0,-PI/2]]){const r=new THREE.Mesh(GC.ckr||(GC.ckr=new THREE.TorusGeometry(1.08,.1,6,28)),LSd);r.position.set(tx+dx,29.75,tz+dz);r.rotation.y=ry;sc.add(r);const m=new THREE.Mesh(new THREE.CircleGeometry(1.02,28),mat);m.position.set(tx+dx*1.01,29.75,tz+dz*1.01);m.rotation.y=ry;sc.add(m)}}
    bx(tx,31.7,tz,4.75,.45,4.75,LS);for(const[a,c]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const f=new THREE.Mesh(GC.fin||(GC.fin=new THREE.ConeGeometry(.16,.7,8)),LS);f.position.set(tx+a*2.15,32.3,tz+c*2.15);sc.add(f)}
    cyl(tx,33.25,tz,1.78,2.7,LS,8);for(let k=0;k<8;k++){const a=k/8*TAU+PI/8,r=1.72;const p=box(tx+Math.sin(a)*r,33.2,tz+Math.cos(a)*r,.95,1.9,.08,DKG,0);p.rotation.y=a;for(let j=0;j<5;j++){const l=box(tx+Math.sin(a)*(r+.04),32.5+j*.33,tz+Math.cos(a)*(r+.04),.9,.05,.05,LSd,0);l.rotation.y=a}}
    cyl(tx,34.72,tz,2.0,.28,LS,8);dome(tx,34.85,tz,1.82,LEAD,{sy:.88,lantern:false});cyl(tx,36.6,tz,.32,.4,LEAD,8);{const s=new THREE.Mesh(new THREE.SphereGeometry(.26,10,8),mt(0xb89b52,.4,.5));s.position.set(tx,37.0,tz);sc.add(s)}cyl(tx,37.7,tz,.05,1.3,0x2a2a2a,6);
    markR(tx-2.5,tz-2.5,tx+2.5,tz+2.5,38)}
  // ---- portico: limestone floor, four Ionic columns, antae, entablature, pediment with the cartouche, slate roof
  {const cx=px0+.52,zs=[0,1,2,3].map(k=>pz0+.72+k*((pz1-pz0)-1.44)/3);bx((px0+px1)/2,.06,(pz0+pz1)/2,px1-px0+.1,.14,pz1-pz0+.1,LS,0);
    // the brick wall behind the portico (plain: its doors and windows are modelled), three arched doorways, the balcony window
    brickBox(fx0-.05,5.05,AX,.1,10.1,pz1-pz0-.2);
    for(const k of[-1,0,1]){const z=AX+k*2.33;bx(fx0-.12,2.0,z,.08,4.0,1.75,WH,0);bx(fx0-.17,1.55,z-.33,.06,3.0,.62,WH,0);bx(fx0-.17,1.55,z+.33,.06,3.0,.62,WH,0);
      for(const dz of[-.33,.33])for(const y of[.8,1.6,2.4])bx(fx0-.205,y,z+dz,.02,.5,.42,mt(0xdcd6ca),0);
      const fl=new THREE.Mesh(GC.fanl||(GC.fanl=new THREE.CircleGeometry(.66,16,0,PI)),DKG);fl.position.set(fx0-.18,3.15,z);fl.rotation.y=-PI/2;sc.add(fl);
      const ar=new THREE.Mesh(GC.arr||(GC.arr=new THREE.RingGeometry(.68,.98,16,1,0,PI)),mt(0x6e3324,.9));ar.position.set(fx0-.13,3.15,z);ar.rotation.y=-PI/2;sc.add(ar);
      bx(fx0-.12,6.85,z,.08,2.5,1.36,WH,0);bx(fx0-.15,6.85,z,.04,2.3,1.16,DKG,0);bx(fx0-.17,6.85,z,.03,2.3,.06,WH,0);bx(fx0-.17,6.85,z,.03,.06,1.16,WH,0);
      bx(fx0-.1,4.85,z,.1,.62,1.25,LSd,0)}
    {const z=AX-2.33;bx(fx0-.45,5.55,z,.8,.12,1.7,LS);const E=[[fx0-.85,z-.85],[fx0-.85,z+.85]];for(let k=0;k<=8;k++)bx(fx0-.84,6.0,z-.8+k*.2,.03,.8,.03,IRON,0);bx(fx0-.84,6.42,z,.05,.05,1.7,IRON,0);for(const s of[-1,1])bx(fx0-.45,6.42,z+s*.85,.8,.05,.05,IRON,0)}
    for(const z of zs){bx(cx,.3,z,1.0,.34,1.0,LS);const sh=new THREE.Mesh(GC.ion||(GC.ion=new THREE.CylinderGeometry(.33,.4,7.1,16)),LS);sh.position.set(cx,4.02,z);sh.castShadow=true;sc.add(sh);
      bx(cx,7.66,z,.86,.22,.86,LS);for(const s of[-1,1]){const v=new THREE.Mesh(GC.vol||(GC.vol=new THREE.CylinderGeometry(.17,.17,.8,10)),LS);v.rotation.z=PI/2;v.position.set(cx,7.86,z+s*.36);sc.add(v)}bx(cx,7.98,z,.95,.1,.95,LS);markC(cx,z,.42,8)}
    for(const z of[pz0+.32,pz1-.32]){bx(fx0-.28,4.0,z,.5,8.0,.64,LS);markR(fx0-.53,z-.32,fx0,z+.32,8)}
    bx((px0+fx0)/2+.05,8.4,AX,fx0-px0+.3,.8,pz1-pz0+.3,LS);bx((px0+fx0)/2+.05,9.15,AX,fx0-px0+.25,.7,pz1-pz0+.25,LS);bx((px0+fx0)/2-.02,9.8,AX,fx0-px0+.55,.6,pz1-pz0+.6,LS);
    for(let z=pz0-.15;z<=pz1+.15;z+=.32)bx(px0-.2,9.58,z,.08,.14,.16,LSd,0);
    // pediment (tympanum with the cartouche), raking cornices, slate roof back to the front range
    const Y0=10.1,YA=13.1,w2=(pz1-pz0)/2+.25,xf=px0-.12,xb=fx0+2.4;
    {const A=[];tri(A,[xf,Y0,AX-w2],[xf,Y0,AX+w2],[xf,YA,AX]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A,3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));g.computeVertexNormals();
      const m=new THREE.Mesh(g,SM({map:T.tymp,side:DS}));sc.add(m);const B2=[];quad(B2,[xf,Y0,AX-w2],[xb,Y0,AX-w2],[xb,YA,AX],[xf,YA,AX]);quad(B2,[xf,YA,AX],[xb,YA,AX],[xb,Y0,AX+w2],[xf,Y0,AX+w2]);geo(B2,LS);
      const sl=Math.atan2(YA-Y0,w2),Lr=Math.hypot(YA-Y0,w2)+.3;for(const s of[-1,1]){const r=new THREE.Mesh(bgeo(.75,.42,Lr),LS);r.position.set(xf+.1,(Y0+YA)/2+.18,AX+s*w2/2);r.rotation.x=s*sl;sc.add(r)}
      const R2=[],e=.45;quad(R2,[xf-.05,Y0+.2,AX-w2-e],[xb,Y0+.2,AX-w2-e],[xb,YA+.42,AX],[xf-.05,YA+.42,AX]);quad(R2,[xf-.05,YA+.42,AX],[xb,YA+.42,AX],[xb,Y0+.2,AX+w2+e],[xf-.05,Y0+.2,AX+w2+e]);geo(R2,SL)}
    // banners between the columns
    const BN=[['next','#f4f2ee','#c8102e'],['lives','#c8102e','#ffffff'],['here','#c8102e','#ffffff']];
    for(let k=0;k<3;k++){const z=(zs[k]+zs[k+1])/2;const m=new THREE.Mesh(GC.ban||(GC.ban=new THREE.PlaneGeometry(1.15,3.4)),nlhBanner(...BN[k]));m.position.set(cx+.05,5.9,z);m.rotation.y=-PI/2;sc.add(m);bx(cx+.05,7.62,z,.06,.06,1.25,IRON,0)}
    // clear the portico for walking (the footprint marked it solid), keep the columns
    cells(px0+.08,pz0+.05,fx0-.02,pz1-.05,k=>{WG[k]=0;HG[k]=0});for(const z of zs)markC(cx,z,.42,8);for(const z of[pz0+.32,pz1-.32])markR(fx0-.53,z-.32,fx0,z+.32,8)}
  // ---- granite terrace steps along the whole west front; the landing is the terrace the portico stands on
  {const N=6,RS=.13,TD=.36,xe=fx0-6.0,za=fz0-2.0,zb=fz1+.3;bx((xe+fx0)/2,-1.0,(za+zb)/2,fx0-xe,2.0,zb-za,GRN);
    for(let i=1;i<=N;i++)bx(xe-(i-.5)*TD,-i*RS-1.0+.0,(za+zb)/2+(i*.18),TD+.01,2.0,zb-za+i*.36,GRN);
    for(const z of[307.2,313.6,329.2,335.6]){const x0=xe+.1,x1=xe-N*TD+.15,y1=-N*RS;for(const[x,y]of[[x0,0],[x1,y1]])bx(x,y+.48,z,.06,.96,.06,IRON,0);const l=Math.hypot(x0-x1,y1),r=new THREE.Mesh(bgeo(l+.1,.06,.06),IRON);r.position.set((x0+x1)/2,y1/2+.95,z);r.rotation.z=Math.atan2(-y1,x0-x1);sc.add(r)}}
  // ---- V84 the main entrance is the bumped-out bay on the north-east (the old MainStreet canopy is gone)
  tucEntry(LV,letters,WH,DKG);
  // ---- covered plaza at the south-west corner: zinc soffit with downlights over the hex pavers, the name in steel letters on the zinc wall
  {const[cx0,cz0,cx1,cz1]=b.tc,gy=terrH((cx0+cx1)/2-1,(cz0+cz1)/2)-LV,y=gy+5.0;bx((cx0+cx1)/2,y+.3,(cz0+cz1)/2,cx1-cx0,.6,cz1-cz0,mt(0x4b5057,.8));{const sf=new THREE.Mesh(new THREE.PlaneGeometry(cx1-cx0-.1,cz1-cz0-.1),SM({color:0x8a8f96,side:THREE.DoubleSide}));sf.rotation.x=PI/2;sf.position.set((cx0+cx1)/2,y-.005,(cz0+cz1)/2);sc.add(sf)}bx((cx0+cx1)/2-.05,y+.62,(cz0+cz1)/2,cx1-cx0+.1,.08,cz1-cz0+.1,mt(ZR,.7),0);
    for(let x=cx0+1.2;x<cx1-.6;x+=2.4)for(let z=cz0+1.5;z<cz1-.8;z+=3){const d=new THREE.Mesh(GC.dl2||(GC.dl2=new THREE.CircleGeometry(.2,10)),bm(0xfff1d2));d.rotation.x=PI/2;d.position.set(x,y-.01,z);sc.add(d)}
    const L=letters('TANGEMAN UNIVERSITY CENTER',8.8,.5,'#2b2f35');L.position.set(cx1-.04,gy+2.5,(cz0+cz1)/2+1);L.rotation.y=-PI/2;sc.add(L)}
}
// ================================================================ V62 buildings matched to the UC walking-tour video: Langsam's cantilevered ribbon-window floors,
// Baldwin's Ionic portico, Dieterle's curved gable, University Pavilion's and Nippert West Pavilion's roof slabs
let COFT=null;function cofferTex(){return COFT||(COFT=ctex(64,64,(q,w,h)=>{q.fillStyle='#bdb7ab';q.fillRect(0,0,w,h);q.fillStyle='#8f897e';q.fillRect(8,8,48,48);q.fillStyle='#a49e92';q.fillRect(13,13,38,38);q.fillStyle='#b1ab9f';q.fillRect(18,18,28,28)}))}
function langsamX(b){const C=SM({map:cofferTex(),side:THREE.DoubleSide});
  // ground floor set back under the building; the middle floors on the outline; the top floors cantilevered all round over a coffered soffit
  for(const r of b.li||[])prism(gpoly(r),0,4.6,'langsam',0x6f6a62,{solid:false});
  for(const r of b.lr||[]){const p=gpoly(r);prism(p,4.6,4.4,'langsam',0x6f6a62,{solid:false,vo:4.6});flatShape([p],4.57,C,2.4);markPoly(p,b.lh)}
  for(const r of b.lo||[]){const p=gpoly(r);prism(p,9.0,b.lh-9.0,'langsam',0x6f6a62,{solid:false,vo:9.0});flatShape([p],8.97,C,2.4)}
  for(const[x,z,w,d,hh]of b.lw||[]){const g=boxUV(new THREE.BoxGeometry(w,hh,d),w,hh,d,16);const m=new THREE.Mesh(g,fm('langT'));m.position.set(x,hh/2,z);m.castShadow=m.receiveShadow=true;sc.add(m);box(x,hh+.15,z,w+.3,.3,d+.3,0x7a5e4c);markR(x-w/2,z-d/2,x+w/2,z+d/2,hh)}
  if(b.ll){const L=letters('WALTER C. LANGSAM LIBRARY',9.5,.6,'#3a2c22');L.position.set(b.ll[0]+(b.ll[2]||0)*.08,b.lh-.95,b.ll[1]+(b.ll[3]==null?1:b.ll[3])*.08);L.rotation.y=Math.atan2(b.ll[2]||0,b.ll[3]==null?1:b.ll[3]);sc.add(L)}}
function roofSlab(b,c=0xeceae5){for(const r of b.lo||[])prism(gpoly(r),b.lh-.1,.5,c,c,{solid:false})}
// a projecting Ionic portico: columns between two piers, entablature and pediment, a podium with steps in front
function templeFront(p,n,o){const t=[-n[1],n[0]],ry=Math.atan2(n[0],n[1]),LS=mt(0xe6e0d2,.85),LSd=mt(0xcfc8b6,.9),w=o.w,cols=o.cols||2,dep=o.dep||2,y0=o.y0||0,ch=o.ch||10,ped=o.ped||3,PR=o.pier||LSd;
  const lb=(a,s,y,W,H,D,mat,cast=1)=>{const m=box(p[0]+n[0]*a+t[0]*s,y,p[1]+n[1]*a+t[1]*s,W,H,D,mat,cast);m.rotation.y=ry;return m};
    if(y0>.25){lb(dep*.5,0,y0*.5-.25,w+1.8,y0+.5,dep+.5,LSd);const k=Math.max(2,Math.round(y0/.16));for(let i=1;i<=k;i++){const top=y0*(k-i)/k;lb(dep+.25+(i-.5)*.4,0,(top-.6)/2,w+1.8,top+.6,.42,LSd)}}
  for(let i=0;i<cols;i++){const s=-w/2+w*(i+1)/(cols+1),a=dep-.55;lb(a,s,y0+.18,1.15,.36,1.15,LS);const sh=new THREE.Mesh(GC.tcol||(GC.tcol=new THREE.CylinderGeometry(.44,.52,1,18)),LS);sh.scale.y=ch-1.0;sh.position.set(p[0]+n[0]*a+t[0]*s,y0+.36+(ch-1.0)/2,p[1]+n[1]*a+t[1]*s);sh.castShadow=true;sc.add(sh);
    lb(a,s,y0+ch-.52,1.08,.28,1.08,LS);for(const q of[-1,1]){const v=new THREE.Mesh(GC.tvol||(GC.tvol=new THREE.CylinderGeometry(.2,.2,1.0,10)),LS);v.position.set(p[0]+n[0]*a+t[0]*(s+q*.46),y0+ch-.3,p[1]+n[1]*a+t[1]*(s+q*.46));v.rotation.set(PI/2,ry,0,'YXZ');sc.add(v)}lb(a,s,y0+ch-.08,1.2,.16,1.2,LS);
    const cx=p[0]+n[0]*a+t[0]*s,cz=p[1]+n[1]*a+t[1]*s;markC(cx,cz,.5,ch)}
  for(const s of[-w/2,w/2]){{const g=boxUV(new THREE.BoxGeometry(1.1,ch,dep+.1),1.1,ch,dep+.1,2);const m=new THREE.Mesh(g,SM({map:tucTex().brick}));m.position.set(p[0]+n[0]*dep*.5+t[0]*s,y0+ch*.5,p[1]+n[1]*dep*.5+t[1]*s);m.rotation.y=ry;m.castShadow=true;sc.add(m);for(let y=y0+.6;y<y0+ch;y+=1.6)lb(dep*.5,s,y,1.16,.5,dep+.16,LSd,0)}const cx=p[0]+n[0]*dep*.5+t[0]*s,cz=p[1]+n[1]*dep*.5+t[1]*s;markC(cx,cz,.7,ch)}
  lb(dep*.5,0,y0+ch+.42,w+1.5,.84,dep+.5,LS);lb(dep*.5,0,y0+ch+1.1,w+1.5,.52,dep+.5,LS);lb(dep*.5+.12,0,y0+ch+1.6,w+2.1,.5,dep+.85,LS);
  // pediment: tympanum, raking cornices, roof behind
  const Yb=y0+ch+1.85,W2=w/2+1.3,zf=dep+.42,zb=-.6,A=[],v=(x,y,z)=>[x,y,z];const tri=(a,b2,c)=>A.push(...a,...b2,...c);
  tri(v(-W2,Yb,zf),v(W2,Yb,zf),v(0,Yb+ped,zf));tri(v(-W2,Yb,zf),v(0,Yb+ped,zf),v(0,Yb+ped,zb));tri(v(-W2,Yb,zf),v(0,Yb+ped,zb),v(-W2,Yb,zb));tri(v(W2,Yb,zf),v(W2,Yb,zb),v(0,Yb+ped,zb));tri(v(W2,Yb,zf),v(0,Yb+ped,zb),v(0,Yb+ped,zf));
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(A,3));g.computeVertexNormals();g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(A.length/3*2),2));const m=new THREE.Mesh(g,SM({color:0xe6e0d2,side:THREE.DoubleSide}));m.position.set(p[0],0,p[1]);m.rotation.y=ry;m.castShadow=true;sc.add(m);
  const sl=Math.atan2(ped,W2),Lr=Math.hypot(ped,W2)+.5;for(const q of[-1,1]){const r=new THREE.Mesh(bgeo(Lr,.42,.8),LS);r.position.set(p[0]+n[0]*(zf-.25)+t[0]*q*W2/2,(Yb+Yb+ped)/2+.2,p[1]+n[1]*(zf-.25)+t[1]*q*W2/2);r.rotation.set(0,ry,0);r.rotateZ(q*sl);sc.add(r)}
  {const o2=new THREE.Mesh(GC.ocl||(GC.ocl=new THREE.TorusGeometry(.62,.12,6,18)),LS);o2.position.set(p[0]+n[0]*(zf+.02),Yb+ped*.42,p[1]+n[1]*(zf+.02));o2.rotation.y=ry;sc.add(o2)}}
// Dieterle Vocal Arts Center: the curved brick gable with limestone coping over the arched window and the entrance
function gableFront(p,n){const t=[-n[1],n[0]],ry=Math.atan2(n[0],n[1]),W=11.5,Hw=9.2,LS=mt(0xebe6da,.85),WH=mt(0xf4f1ea,.6),DK=mt(0x26303a,.4);
  const sh=s=>{const S_=new THREE.Shape(),w=W/2*s,h=Hw*s;S_.moveTo(-w,0);S_.lineTo(-w,h);S_.quadraticCurveTo(-w,h+1.6*s,-w+1.4*s,h+1.7*s);S_.quadraticCurveTo(-2.6*s,h+1.8*s,-2.4*s,h+3.2*s);S_.lineTo(-1.2*s,h+3.4*s);S_.quadraticCurveTo(0,h+5.4*s,1.2*s,h+3.4*s);S_.lineTo(2.4*s,h+3.2*s);S_.quadraticCurveTo(2.6*s,h+1.8*s,w-1.4*s,h+1.7*s);S_.quadraticCurveTo(w,h+1.6*s,w,h);S_.lineTo(w,0);S_.lineTo(-w,0);return S_};
  const place=(m,a)=>{m.position.set(p[0]+n[0]*a,0,p[1]+n[1]*a);m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;sc.add(m)};
  {const g=new THREE.ExtrudeGeometry(sh(1.035),{depth:.3,bevelEnabled:false});const m=new THREE.Mesh(g,LS);place(m,.1)}
  {const g=new THREE.ExtrudeGeometry(sh(1),{depth:.55,bevelEnabled:false});const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/16,uv.getY(i)/16);for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*8,uv.getY(i)*8);const BR=SM({map:tucTex().brick});const m=new THREE.Mesh(g,[BR,BR]);place(m,.12)}
  const lb=(a,s,y,Wd,H,D,mat,cast=0)=>{const m=box(p[0]+n[0]*a+t[0]*s,y,p[1]+n[1]*a+t[1]*s,Wd,H,D,mat,cast);m.rotation.y=ry;return m};
  const zf=.7;lb(zf,0,1.9,3.0,3.8,.12,WH);lb(zf+.05,-.62,1.6,1.1,3.0,.06,DK);lb(zf+.05,.62,1.6,1.1,3.0,.06,DK);lb(zf+.08,0,1.6,.1,3.0,.05,WH);
  lb(zf,0,4.15,3.6,.5,.2,LS);lb(zf,0,6.1,3.6,3.2,.1,WH);lb(zf+.03,0,6.1,3.2,2.9,.06,DK);for(const s of[-1.07,0,1.07])lb(zf+.07,s,6.1,.07,2.9,.04,WH);lb(zf+.07,0,6.1,3.2,.07,.04,WH);
  {const a=new THREE.Mesh(new THREE.CircleGeometry(1.6,20,0,PI),DK);a.position.set(p[0]+n[0]*(zf+.04),7.7,p[1]+n[1]*(zf+.04));a.rotation.y=ry;sc.add(a);const r=new THREE.Mesh(new THREE.RingGeometry(1.6,1.85,20,1,0,PI),WH);r.position.set(p[0]+n[0]*(zf+.05),7.7,p[1]+n[1]*(zf+.05));r.rotation.y=ry;sc.add(r);
    const v=new THREE.Mesh(new THREE.RingGeometry(1.85,2.35,20,1,0,PI),mt(0x9b4a33,.9));v.position.set(p[0]+n[0]*(zf+.02),7.7,p[1]+n[1]*(zf+.02));v.rotation.y=ry;sc.add(v);for(let k=1;k<6;k++){const an=PI*k/6,s=lb(zf+.08,Math.cos(an)*.8,7.7+Math.sin(an)*.8,.06,1.6,.04,WH);s.rotateZ(an-PI/2)}lb(zf+.06,0,10.1,.5,.7,.2,LS)}
  for(const s of[-3.6,3.6]){lb(zf,s,7.0,1.0,1.3,.25,LS);const c=new THREE.Mesh(GC.cart||(GC.cart=new THREE.SphereGeometry(.42,10,8)),LS);c.position.set(p[0]+n[0]*(zf+.2)+t[0]*s,7.0,p[1]+n[1]*(zf+.2)+t[1]*s);c.scale.set(1,1.2,.4);sc.add(c)}
  for(let i=0;i<3;i++)lb(1.2+i*.42,0,.12+(2-i)*.15-.3,6.5-i*.4,.6,.44,mt(0xbab3a8,.9),0)}
