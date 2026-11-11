// ================================================================ V84 TUC: the main entrance moves to the bumped-out bay on the drum's north-east side (the "UNIVERSITY CENTER"
// band with the balcony on top, glass doors below), and the plaza between TUC, Nippert West Pavilion and the stadium becomes concrete with young
// trees in grates toward MainStreet and black metal patio tables with red umbrellas beside the pavilion
const WPRAIL=[[373.5,310.4],[368.69,320.81],[347.64,363.56],[345.94,373.39],[347.18,384.1],[351.22,394.17]],
  WPDECK=[[373.5,310.4],[368.69,320.81],[347.64,363.56],[345.94,373.39],[347.18,384.1],[351.22,394.17],[351.8,394.7],[342.8,397.8],[339.2,386.2],[338.2,373.2],[340.4,361.2],[361,317.2],[365,310.6]],
  WPWALL=[[365,310.6],[361,317.2],[340.4,361.2],[338.2,373.2],[339.2,386.2],[342.8,397.8]],
  WPSS=[[347.3,396.25],[354,406.6]];
const WPAIS=[.22,.5,.78].map(f=>{const a=WPRAIL[1],b=WPRAIL[2],L=Math.hypot(b[0]-a[0],b[1]-a[1]);return{x:a[0]+(b[0]-a[0])*f,z:a[1]+(b[1]-a[1])*f,ex:(b[1]-a[1])/L,ez:-(b[0]-a[0])/L}});
let WPSRC=null;const wpStandRing=()=>WPSRC||(WPSRC=(UCD.stands.find(s=>s.nip&&s.sl.length>20)||{sl:[{r:[[]]}]}).sl[0].r[0]);
const WPPOLY0=[[351.66,386.81],[350.36,380.7],[350.31,374.51],[351.14,369.77],[353.21,361.93],[378.46,309.97],[363.79,309.3],[352.36,332.74],[342.42,353.9],[339.37,361.15],[337.9,368.13],[337.21,374.02],[337.48,381.3],[338.97,390.61],[342.98,399.22],[352.19,395.33]];
const TUCDOOR={x:339.0,z:302.45,n:[.592,-.806],t:[-.806,-.592]};
const TUCPLZ=[[318,287],[336,284.5],[350,283],[363,283],[381,278],[386,285],[384,296],[380.5,309.7],[364,309.3],[352.4,332.7],[344,336],[346,320],[340,300],[318,300]];
const TUCTREES=[[333,292.2],[340,291.6],[347,291],[354,290.4],[368,289],[375,288.2]];
const tucNoLamp=(x,z)=>inPoly(x,z,WPPOLY0)||Math.hypot(x-TUCDOOR.x-TUCDOOR.n[0]*2,z-TUCDOOR.z-TUCDOOR.n[1]*2)<4.2||TUCTREES.some(([a,b])=>Math.hypot(x-a,z-b)<2);
const PAVZ=[
  [0,'#9b5444',[[340,440],[352,436],[366,446],[392,456],[402,468],[398,478],[386,476],[360,465],[342,458],[334,452]],1],   // CCM Boulevard in front of Dieterle: one red-brick plaza, light diagonal bands (tour 20-54 s)
  [0,'#9b5444',[[300,418],[350,418],[350,478],[300,478]],0],          // the CCM plaza ring
  [0,'#985646',[[366,424],[432,424],[432,472],[402,472],[380,454],[366,452]],0],   // brick sidewalks along the CCM roads (56-66 s)
  [1,'#b49f84',[[318,282],[350,276],[400,262],[447,244],[451,258],[405,283],[360,303],[318,303]],0],   // MainStreet: tan herringbone (306-318 s)
  [2,'#a39a8d',[[281,276],[352,276],[352,314],[307,314],[307,342],[281,342]],0],   // TUC north concourse and west plaza: square pavers (330-384 s)
  [2,'#a39a8d',[[281,376],[307,376],[307,394],[281,394]],0],
  [1,'#8e5240',[[424,226],[486,218],[492,256],[470,264],[440,270],[424,262]],0],   // CRC north entrance: red-brown herringbone (1188-1200 s)
  [1,'#8e5240',[[440,160],[474,160],[476,192],[440,194]],0],          // the walk past Lindner's west end (1116-1122 s)
  [2,'#a7a197',[[200,358],[258,358],[258,398],[200,398]],0],          // University Plaza (630-654 s)
  [2,'#a9a49b',[[268,384],[302,384],[302,472],[254,472],[254,446],[268,446]],0],   // University Pavilion and the Teachers walk (504-570 s)
  [0,'#b39a7c',[[240,346],[286,318],[296,330],[250,364]],0],          // the commons walk to TUC's portico: tan brick (684-714 s)
  [3,'#c5bfb3',[[376,148],[422,148],[422,206],[376,206]],0],          // Langsam's plaza: big concrete slabs (1008-1074 s)
  [3,'#c9c4ba',[[490,195],[545,195],[545,240],[490,240]],0],
  [3,'#c3bdb2',TUCPLZ,2],
  [3,'#bfb9ae',WPPOLY0,2],
  [3,'#c3bdb2',[[364,282],[382,276],[398,282],[400,292],[392,310],[372,312],[362,300]],2]];   // V89 the NW gate approach: one concrete floor         // Sigma Sigma Commons (1140-1182 s)
let GMASK=null,PAVT=null;
function pavPatterns(){if(PAVT)return PAVT;const mk=(f)=>{const c=document.createElement('canvas');c.width=c.height=256;const q=c.getContext('2d');q.fillStyle='rgb(82,82,82)';q.fillRect(0,0,256,256);f(q);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());return t};
  const tone=()=>{const v=118+rnd()*30|0;return`rgb(${v},${v},${v})`};
  PAVT=[mk(q=>{for(let y=0;y<256;y+=16)for(let x=-((y/16)%2)*16;x<256;x+=32){q.fillStyle=tone();q.fillRect(x+1.5,y+1.5,29,13)}}),       // running bond: 0.2 x 0.1 bricks (1.6 per tile)
    mk(q=>{for(let y=-64;y<320;y+=32)for(let x=-64;x<320;x+=32){q.fillStyle=tone();q.fillRect(x+1.5,y+1.5,29,13);q.fillStyle=tone();q.fillRect(x+17.5,y+17.5,13,29)}}),   // herringbone (basket-weave read at distance)
    mk(q=>{for(let y=0;y<256;y+=64)for(let x=0;x<256;x+=64){q.fillStyle=tone();q.fillRect(x+2,y+2,60,60);q.fillStyle='rgba(255,255,255,.06)';q.fillRect(x+2,y+2,60,4)}})];   // 0.6 m squares (2.4 per tile)
  return PAVT}
function bakePaving(D,q,K,GX){const MK=document.createElement('canvas'),N=2048,K2=N/600;MK.width=MK.height=N;const m=MK.getContext('2d');m.fillStyle='#000';m.fillRect(0,0,N,N);
  const path=(ctx,k,rings)=>{ctx.beginPath();for(const r of rings){r.forEach(([x,z],i)=>i?ctx.lineTo((x-GX)*k,z*k):ctx.moveTo((x-GX)*k,z*k));ctx.closePath()}};
  const paved=[...D.walk,...D.plaza.map(p=>p[1])],CH=['#ff0000','#00ff00','#0000ff',null];
  for(const[kind,col,poly,all]of PAVZ){const[bx0,bz0,bx1,bz1]=bbox(poly),tg=all?[null]:paved.filter(r=>{const[a,b,c,d]=bbox(r[0]);return c>bx0&&a<bx1&&d>bz0&&b<bz1});
    for(const rings of tg)for(const[ctx,k,st]of[[q,K,col],[m,K2,CH[kind]||(all===2?'#000':null)]]){if(!st)continue;ctx.save();path(ctx,k,[poly]);ctx.clip();if(rings){path(ctx,k,rings);ctx.clip('evenodd')}ctx.fillStyle=st;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
      if(ctx===q&&kind===3){ctx.strokeStyle='rgba(84,76,64,.5)';ctx.lineWidth=.06*k;ctx.beginPath();for(let x=Math.floor(bx0/1.5)*1.5;x<=bx1;x+=1.5){ctx.moveTo((x-GX)*k,bz0*k);ctx.lineTo((x-GX)*k,bz1*k)}for(let z=Math.floor(bz0/1.5)*1.5;z<=bz1;z+=1.5){ctx.moveTo((bx0-GX)*k,z*k);ctx.lineTo((bx1-GX)*k,z*k)}ctx.stroke()}
      if(all===1){ctx.strokeStyle=ctx===q?'#cdc4b4':'#000';ctx.lineWidth=1.1*k;ctx.beginPath();for(let s=-60;s<60;s+=9.5){const x0=bx0+s,z0=bz0;ctx.moveTo((x0-GX)*k,z0*k);ctx.lineTo((x0+40-GX)*k,(z0+40*.7)*k)}ctx.stroke()}
      ctx.restore()}}
  for(const g of D.gard||[])if(g.a<=300){q.save();path(q,K,[g.r]);q.fillStyle='#4a3a2c';q.fill();q.restore()}
  GMASK=new THREE.CanvasTexture(MK);GMASK.anisotropy=4}
let SGR=null;function onStreet(x,z){if(!SGR){SGR=new Uint8Array(1200*1152);for(const r of RD){if(!r.poly)continue;const p=r.poly,h=r.w/2+.5;for(let k=0;k<p.length-1;k++){const a=p[k][0],b=p[k][1],c=p[k+1][0],d=p[k+1][1],vx=c-a,vz=d-b,L2=vx*vx+vz*vz||1,
    i0=Math.max(0,Math.floor((Math.min(a,c)-h-141)*2)),i1=Math.min(1199,Math.ceil((Math.max(a,c)+h-141)*2)),j0=Math.max(0,Math.floor((Math.min(b,d)-h)*2)),j1=Math.min(1151,Math.ceil((Math.max(b,d)+h)*2));
    for(let jj=j0;jj<=j1;jj++)for(let ii=i0;ii<=i1;ii++){const X=141+(ii+.5)/2,Z=(jj+.5)/2,t=Math.max(0,Math.min(1,((X-a)*vx+(Z-b)*vz)/L2)),ex=X-a-vx*t,ez=Z-b-vz*t;if(ex*ex+ez*ez<h*h)SGR[jj*1200+ii]=1}}}}
  const ii=Math.floor((x-141)*2),jj=Math.floor(z*2);return ii>=0&&ii<1200&&jj>=0&&jj<1152&&SGR[jj*1200+ii]===1}
const inCampus=(x,z)=>x>=141&&x<=741&&z>=0&&z<=576;
// a building ID monolith set beside a building's front door, on the first free spot near the walk
function ucIdAt(name,x,z,n,addr){const t=[-n[1],n[0]];for(const[a,b]of[[0,0],[1.2,0],[2.4,0],[-1,0],[0,2.5],[0,-2.5],[3.6,0],[1.2,3],[1.2,-3]]){const sx=x+n[0]*a+t[0]*b,sz=z+n[1]*a+t[1]*b;
  if(freeAt(sx,sz,1.1)&&!onRoad(sx,sz)){const g=ucIdSign(name,addr,sx,sz,n);g.position.y=terrH(sx,sz);g.userData.ts=1;return true}}return false}
// UC's campus bench: black powder-coated steel slats on cast end frames
function bench(x,z,rot){const g=new THREE.Group(),M=mt(0x23262a,.55,.35);const a=(w,h,d,px,py,pz)=>{const e=new THREE.Mesh(bgeo(w,h,d),M);e.position.set(px,py,pz);e.castShadow=true;g.add(e)};
  for(const k of[-.18,-.06,.06,.18])a(1.9,.035,.09,0,.46,k);for(const y of[.6,.72,.84])a(1.9,.08,.03,0,y,-.27);
  for(const s of[-.86,.86]){a(.06,.46,.06,s,.23,.17);a(.06,.9,.06,s,.45,-.25);a(.06,.04,.48,s,.44,-.03);a(.06,.04,.4,s,.66,0)}
  g.position.set(x,0,z);g.rotation.y=rot;sc.add(g);markC(x,z,.7,1);try{seatAdd(x,z,rot)}catch(e){}}   /* V300 two seats people can sit on */
// lamps as the tour shows them: black post-top globes along most walks; tall grey poles with flat disc heads around Langsam, MainStreet, the CRC and Lindner, University Plaza and Zimmer;
// MainStreet's poles carry red UC banners (tour 306-318 s)
const DISCZ=[[376,140,450,215],[318,240,462,306],[428,178,562,272],[198,354,258,400],[240,300,300,380],[325,165,380,215]],BANZ=[328,246,454,306];
function buildLamps(){const ok=LAMPS.filter(([x,z])=>!tucNoLamp(x,z)&&!(x>462.5&&x<477.7&&z>383&&z<471)&&!solid(x,z)&&!(inCampus(x,z)?onStreet(x,z):onRoad(x,z))&&x>1&&z>1&&x<WW-1&&z<OD-1&&!(inLake(x,z)));
  const inZ=(x,z,b)=>x>b[0]&&x<b[2]&&z>b[1]&&z<b[3],isD=([x,z])=>x>=141&&x<=741&&z<=576&&DISCZ.some(b=>inZ(x,z,b)),disc=ok.filter(isD),glob=ok.filter(p=>!isD(p));
  const BLK=mt(0x1b1d20,.45,.4),GRY=mt(0x50545a,.45,.45),LB=new THREE.MeshBasicMaterial({color:0xd8d4c8}),m=new THREE.Matrix4();
  const IM=(geo,mat,n)=>{const o=new THREE.InstancedMesh(geo,mat,Math.max(1,n));o.count=n;o.frustumCulled=false;o.userData.chunk=999;o.receiveShadow=true;sc.add(o);return o};
  const n=glob.length,po=IM(new THREE.CylinderGeometry(.055,.075,3.6,6),BLK,n),bs=IM(new THREE.CylinderGeometry(.13,.17,.62,8),BLK,n),co=IM(new THREE.CylinderGeometry(.1,.06,.18,8),BLK,n),gl=IM(new THREE.SphereGeometry(.27,12,9),LB,n),fi=IM(new THREE.ConeGeometry(.05,.13,6),BLK,n);
  glob.forEach(([x,z],i)=>{const gy=terrH(x,z);m.makeTranslation(x,gy+1.8,z);po.setMatrixAt(i,m);m.makeTranslation(x,gy+.31,z);bs.setMatrixAt(i,m);m.makeTranslation(x,gy+3.69,z);co.setMatrixAt(i,m);m.makeTranslation(x,gy+4.04,z);gl.setMatrixAt(i,m);m.makeTranslation(x,gy+4.36,z);fi.setMatrixAt(i,m);markC(x,z,.2,4)});
  po.castShadow=true;
  const k=disc.length,dp=IM(new THREE.CylinderGeometry(.075,.115,6,8),GRY,k),dh=IM(new THREE.CylinderGeometry(.56,.5,.14,18),GRY,k),dl=IM(new THREE.CircleGeometry(.45,18).rotateX(PI/2),LB,k);
  const banT=cvTex(64,176,(q,w,h)=>{q.fillStyle=UCRED;q.fillRect(0,0,w,h);ucMark(q,w/2,46,34);q.fillStyle='#fff';q.fillRect(8,h-30,w-16,4);q.save();q.translate(w/2,112);q.rotate(-PI/2);q.font='bold 15px Arial,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText('BEARCATS',0,0);q.restore()}),
    banM=new THREE.MeshLambertMaterial({map:banT,side:THREE.DoubleSide}),sx=.944,sz=-.329;
  disc.forEach(([x,z],i)=>{const gy=terrH(x,z);m.makeTranslation(x,gy+3,z);dp.setMatrixAt(i,m);m.makeTranslation(x,gy+6.05,z);dh.setMatrixAt(i,m);m.makeTranslation(x,gy+5.97,z);dl.setMatrixAt(i,m);markC(x,z,.22,6);
    if(inZ(x,z,BANZ))for(const s of[-1,1]){const bx=x-sz*s*.42,bz=z+sx*s*.42;const b=new THREE.Mesh(GC.ban64||(GC.ban64=new THREE.PlaneGeometry(.55,1.5)),banM);b.position.set(bx,gy+4.1,bz);b.rotation.y=Math.atan2(sx,sz);sc.add(b);
      const ar=new THREE.Mesh(bgeo(.05,.05,.5),GRY);ar.position.set(x-sz*s*.25,gy+4.88,z+sx*s*.25);ar.rotation.y=Math.atan2(-sz*s,sx*s);sc.add(ar)}});
  dp.castShadow=true;bulbs=gl;LAMPS.length=0;ok.forEach(p=>LAMPS.push(p))}

function moreLamps(D){const HB=new Map(),hk=(x,z)=>(Math.floor(x/16)+100)*1000+Math.floor(z/16)+100,put=(x,z)=>{const k=hk(x,z);let a=HB.get(k);if(!a)HB.set(k,a=[]);a.push(x,z)};for(const[x,z]of LAMPS)if(x>120&&x<760&&z<600)put(x,z);
  const near=(x,z,r)=>{for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=HB.get(hk(x+i*16,z+j*16));if(a)for(let k=0;k<a.length;k+=2)if((a[k]-x)**2+(a[k+1]-z)**2<r*r)return true}return false};let nd=0,ng=0;
  const pitchIn=(x,z)=>D.pitches.some(f=>f.r&&inPoly(x,z,f.r[0])),rings=[...D.walk.map(r=>r[0]),...D.plaza.map(p=>p[1][0])];
  for(const r of rings){const N=r.length;let carry=2,A2=0;for(let i=0;i<N;i++){const p=r[i],q2=r[(i+1)%N];A2+=p[0]*q2[1]-q2[0]*p[1]}const sg=A2>0?1:-1;for(let i=0;i<N;i++){const[ax,az]=r[i],[bx,bz]=r[(i+1)%N],L=Math.hypot(bx-ax,bz-az);if(L<.01)continue;const ux=(bx-ax)/L,uz=(bz-az)/L;let t=carry;
    for(;t<L;t+=4){const px=ax+ux*t,pz=az+uz*t;const nx=uz*sg,nz=-ux*sg;
      const dz=DISCZ.some(b=>px>b[0]&&px<b[2]&&pz>b[1]&&pz<b[3]),x=dz?px-nx*.9:px+nx*.75,z=dz?pz-nz*.9:pz+nz*.75;
      if(x<145||x>737||z<4||z>552||solid(x,z)||onStreet(x,z)||pitchIn(x,z)||near(x,z,dz?11:15))continue;if(!freeAt(x,z,.4))continue;put(x,z);LAMPS.push([x,z]);dz?nd++:ng++}
    carry=t-L}}
  console.log('V64 lamps added: disc zones',nd,'walks',ng)}

let GBAKE=null;   // baked campus ground canvas, sampled for footstep surfaces (V101)
function bakeGround(D){const SZ=4096,GX=141,GS=600,K=SZ/GS,c=document.createElement('canvas');c.width=c.height=SZ;const q=c.getContext('2d');const X=x=>(x-GX)*K,Y=z=>z*K;
  const pat=(tx,m)=>{const p=q.createPattern(tx.image,'repeat');try{const s=m*K/tx.image.width;p.setTransform(new DOMMatrix([s,0,0,s,0,0]))}catch(e){}return p};
  const path=rings=>{q.beginPath();for(const r of rings){r.forEach(([x,z],i)=>i?q.lineTo(X(x),Y(z)):q.moveTo(X(x),Y(z)));q.closePath()}};
  const fill=(rings,st,tint)=>{path(rings);q.fillStyle=st;q.fill('evenodd');if(tint){q.globalCompositeOperation='multiply';q.fillStyle=tint;q.fill('evenodd');q.globalCompositeOperation='source-over'}};
  const line=(pts,w,st,dash,cap)=>{q.beginPath();pts.forEach(([x,z],i)=>i?q.lineTo(X(x),Y(z)):q.moveTo(X(x),Y(z)));q.lineWidth=w*K;q.strokeStyle=st;q.lineCap=cap||'round';q.lineJoin='round';q.setLineDash(dash?dash.map(v=>v*K):[]);q.stroke();q.setLineDash([])};
  const GR=pat(TX.grass,5),CO=pat(TX.concrete,4),PV=pat(TX.pavers,3),PG=pat(TX.paversG,3),HB=pat(TX.herring,3),AS=pat(TX.asphalt,10),TRK=pat(TX.track,4),SA=pat(TX.sand,4);
  q.fillStyle=GR;q.fillRect(0,0,SZ,SZ);
  for(const r of D.base)fill(r,CO);
  // hillsides are lawn, not paving: grass wherever the ground is steep (paths, plazas and streets are painted over it)
  {const T=UCT;q.fillStyle=GR;for(let j=0;j<T.nz-1;j++)for(let i=0;i<T.nx-1;i++){const k=j*T.nx+i,a=TRH[k],b=TRH[k+1],c=TRH[k+T.nx];if(Math.hypot(b-a,c-a)/100/T.dx>.15){q.beginPath();q.arc(X(T.x0+(i+.5)*T.dx),Y(T.z0+(j+.5)*T.dx),2.4*K,0,TAU);q.fill()}}}
  for(const r of D.park)fill(r,AS,'#c8c8c8');
  for(const r of D.grass)fill(r,GR);
  for(const r of D.wood)fill(r,GR,'#a3b38c');
  for(const r of D.water)fill(r,'#3a7ea8');
  for(const r of D.walk)fill(r,CO,'#f4f0e8');
  for(const[m,r]of D.plaza)fill(r,m==='pav'?PV:m==='pav2'?PG:CO);
  // V62 TUC's south plaza: brown-grey hexagonal pavers from under the canopy out to the footbridge (the user's photos)
  {const tb=D.B.find(b=>b.k==='tuc');if(tb){const HX=ctex(90,52,(q2,w,h)=>{q2.fillStyle='#5d544d';q2.fillRect(0,0,w,h);const r=15;for(let c=-1;c<5;c++)for(let rr=-1;rr<3;rr++){const cx=c*22.5,cy=rr*26+(c%2?13:0);q2.beginPath();for(let k=0;k<6;k++){const a=k*PI/3;q2.lineTo(cx+Math.cos(a)*(r-1.3),cy+Math.sin(a)*(r-1.3))}q2.closePath();q2.fillStyle=shade('#8a7e74',rnd()*16-8);q2.fill()}});
    fill([[[279.6,342.6],[306.3,342.6],[306.3,362.8],[304.4,363.8],[304.4,376.2],[279.6,376.2]]],pat(HX,2.4))}}
  // pitches
  for(const f of D.pitches){if(!f.r)continue;const sp=f.sp,[cx,cz,w,d,ang]=f.rect,L=Math.max(w,d),Wd=Math.min(w,d),a=(w>=d?ang:ang+90)*PI/180;
    if(sp==='tennis'){const ct=courtTex();q.save();q.translate(X(cx),Y(cz));q.rotate(a);try{q.drawImage(ct.image,-L*K/2,-Wd*K/2,L*K,Wd*K)}catch(e){}q.restore();continue}
    fill(f.r,sp.includes('volley')?SA:GR,sp.includes('volley')?null:sp.includes('baseball')?null:'#a8e090');
    const ux=Math.cos(a),uz=Math.sin(a),vx=-uz,vz=ux,F=(u,v)=>[cx+ux*u+vx*v,cz+uz*u+vz*v];
    if(sp==='american_football'&&f.n!=='Carson Field')for(let k=0;k<=10;k++){const u=-L/2+5+(L-10)*k/10;line([F(u,-Wd/2+.8),F(u,Wd/2-.8)],.22,'#f4f1e6',null,'butt')}
    if(sp==='soccer'){line([F(0,-Wd/2+1),F(0,Wd/2-1)],.2,'#f4f1e6',null,'butt');q.beginPath();q.arc(X(cx),Y(cz),5.7*K,0,TAU);q.lineWidth=.2*K;q.strokeStyle='#f4f1e6';q.stroke()}}
  for(const r of D.track)if(r)fill(r,TRK);
  // Nippert: yard lines, red end zones, centre logo
  {const S_=D.stad,F=(u,v)=>[S_.cx+S_.ux*u+S_.vx*v,S_.cz+S_.uz*u+S_.vz*v];for(const u of[S_.hl-3,-S_.hl+3]){const pts=[F(u-2.8,-S_.hw+.5),F(u+2.8,-S_.hw+.5),F(u+2.8,S_.hw-.5),F(u-2.8,S_.hw-.5)];fill([pts],'#18191b');q.save();const[cx_,cz_]=F(u,0);q.translate(X(cx_),Y(cz_));q.rotate(Math.atan2(S_.vz,S_.vx)+(u<0?PI:0));q.fillStyle='#f4f1e6';q.font=`bold ${Math.round(3.2*K)}px Arial,Helvetica,sans-serif`;q.textAlign='center';q.textBaseline='middle';q.fillText('CINCINNATI',0,0);q.restore()}
    for(let k=0;k<=10;k++){const u=-S_.hl+6+(2*S_.hl-12)*k/10;line([F(u,-S_.hw+.5),F(u,S_.hw-.5)],.25,'#f4f1e6',null,'butt')}
    for(const v of[-S_.hw+.5,S_.hw-.5])line([F(-S_.hl,v),F(S_.hl,v)],.25,'#f4f1e6',null,'butt');q.beginPath();q.arc(X(S_.cx),Y(S_.cz),3.2*K,0,TAU);q.fillStyle='#c8102e';q.fill();q.beginPath();q.arc(X(S_.cx),Y(S_.cz),2.1*K,.6,TAU-.6);q.lineWidth=.9*K;q.strokeStyle='#ffffff';q.stroke()}
  // the ballpark: dirt, infield grass, foul lines
  if(D.base_b){const{H,d1,d2,s}=D.base_b,at=(a,b)=>[H[0]+d1[0]*a+d2[0]*b,H[1]+d1[1]*a+d2[1]*b];if(D.base_b.dirt)fill(D.base_b.dirt,'#a8714c');fill([[at(1.8,1.8),at(s-1.8,1.8),at(s-1.8,s-1.8),at(1.8,s-1.8)]],GR,'#b8e8a0');
    for(const d of[d1,d2])line([H,[H[0]+d[0]*70,H[1]+d[1]*70]],.14,'#f4f1e6',null,'butt');q.beginPath();q.arc(X(D.base_b.m[0]),Y(D.base_b.m[1]),2.6*K,0,TAU);q.fillStyle='#a8714c';q.fill()}
  if(D.crosley)fill(D.crosley,SA,'#c8b89a');
  // streets: kerb, asphalt, centre dashes, zebra crossings
  for(const r of D.roads)line(r.pts,r.w+.7,'#a9a49a');
  for(const r of D.roads)line(r.pts,r.w,r.sf==='brick'?HB:AS);
  for(const r of D.roads)if(r.w>=7&&!r.one&&!r.sf)line(r.pts,.22,'#e8c34a',[5,7],'butt');
  for(const cpts of D.cross)line(cpts,2.6,'#f2efe6',[.5,.5],'butt');
  bakePaving(D,q,K,GX);
  const t=new THREE.CanvasTexture(c);t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;GBAKE={c,q,X,Y};return t}
function buildTerrain(D){const T=UCT,TW=(T.nx-1)*T.dx,TD=(T.nz-1)*T.dx,g=new THREE.PlaneGeometry(TW,TD,T.nx-1,T.nz-1);g.rotateX(-PI/2);g.translate(T.x0+TW/2,0,T.z0+TD/2);
  const pos=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,terrH(x,z));uv.setXY(i,(x-141)/600,1-z/600)}g.computeVertexNormals();
  // a fine tiling grain multiplied over the painted ground so it still reads close up
  const det=ctex(128,128,(q,w,h)=>{q.fillStyle='#808080';q.fillRect(0,0,w,h);for(let i=0;i<2600;i++){const v=100+rnd()*56|0;q.fillStyle=`rgb(${v},${v},${v})`;q.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1+rnd()*2)}});
  const mat=SM({map:bakeGround(D)});const PT_=pavPatterns();mat.onBeforeCompile=sh=>{sh.uniforms.dMap={value:det};const GT_=drGround();sh.uniforms.dMap2={value:GT_.a};sh.uniforms.nMap={value:GT_.n};sh.uniforms.pMask={value:GMASK};sh.uniforms.pT0={value:PT_[0]};sh.uniforms.pT1={value:PT_[1]};sh.uniforms.pT2={value:PT_[2]};sh.fragmentShader='uniform sampler2D dMap2;uniform sampler2D nMap;uniform sampler2D dMap;uniform sampler2D pMask;uniform sampler2D pT0;uniform sampler2D pT1;uniform sampler2D pT2;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n diffuseColor.rgb*=mix(vec3(1.0),texture2D(dMap,vUv*400.0).rgb*2.0,0.5);\n diffuseColor.rgb*=mix(vec3(1.0),texture2D(dMap2,vUv*70.0).rgb*2.0,0.5);{vec2 wq=vUv*600.0;float n1=sin(wq.x*.11)*sin(wq.y*.09)+sin(wq.x*.047+wq.y*.061)*.8+sin(wq.y*.19-wq.x*.13)*.5;float isG=step(diffuseColor.r+.02,diffuseColor.g)*step(diffuseColor.b,diffuseColor.g);vec3 dry=vec3(1.2,1.1,.74),deep=vec3(.8,.97,.9);diffuseColor.rgb*=mix(vec3(1.0),mix(deep,dry,smoothstep(-.9,1.3,n1)),isG*.8);}\n vec3 pm=texture2D(pMask,vUv).rgb;{vec2 pw=vec2(vUv.x,1.0-vUv.y)*600.0;vec3 s0=texture2D(pT0,pw/1.6).rgb*2.0,s1=texture2D(pT1,pw/1.6).rgb*2.0,s2=texture2D(pT2,pw/2.4).rgb*2.0;diffuseColor.rgb*=mix(vec3(1.0),s0,pm.r)*mix(vec3(1.0),s1,pm.g)*mix(vec3(1.0),s2,pm.b);}').replace('#include <normal_fragment_maps>',DRTERN)};
  const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.ts=1;m.userData.terrain=1;sc.add(m);return m}
function buildCampus(){
  const D=UCD,P=D.pts,pt=k=>P[k],R2=r=>r,shiftFrom=(i0,f)=>{for(let i=i0;i<sc.children.length;i++){const o=sc.children[i];if(o.userData.ts)continue;o.position.y+=f(o);o.userData.ts=1}};
  FENCEM=SM({color:0x2a2d33,transparent:true,opacity:.28,depthWrite:false});
  // ------------------------------------------------ ground (OpenStreetMap) painted onto the terrain; walkable/road cells and minimap layers as before
  try{cchPrep(D)}catch(e){console.warn('cch prep',e)}
  buildTerrain(D);
  for(const r of D.base)PT.push({rings:r,c:'#d2cbbb'});
  for(const r of D.park){roadRings(r);PT.push({rings:r,c:'#9b9893'})}
  for(const r of D.grass)PT.push({rings:r,c:'#5a9446'});
  for(const r of D.wood)PT.push({rings:r,c:'#3f7436'});
  for(const r of D.water){const[x0,z0,x1,z1]=bbox(r[0]);cells(x0,z0,x1,z1,(k,x,z)=>{if(inPoly(x,z,r[0]))WG[k]=1});PT.push({rings:r,c:'#3a7ea8'})}
  for(const r of D.walk){roadRings(r);PT.push({rings:r,c:'#e2dccd'})}
  for(const[m,r]of D.plaza){roadRings(r);PT.push({rings:r,c:m==='pav'?'#c08070':'#ddd6c6'})}
  for(const f of D.pitches)if(f.r)PT.push({rings:f.r,c:f.sp==='tennis'?'#2f5f8f':f.sp.includes('volley')?'#d8c08a':'#3f9a3c'});
  for(const r of D.track)if(r)PT.push({rings:r,c:'#b0503c'});
  for(const r of D.roads){markRoad(r.pts,r.w);RD.push({poly:r.pts,w:r.w});if(r.w>=8)for(let j=0;j<r.pts.length-1;j++){const[a,b]=r.pts[j],[c,d]=r.pts[j+1],L=Math.hypot(c-a,d-b);for(let t=8;t<L;t+=28){const x=a+(c-a)*t/L,z=b+(d-b)*t/L,nx=-(d-b)/L,nz=(c-a)/L,lx=x+nx*(r.w/2+1.6),lz=z+nz*(r.w/2+1.6);if(!D.lamps.some(([p,q])=>(p-lx)**2+(q-lz)**2<100))LAMPS.push([lx,lz])}}}
  // ------------------------------------------------ staircases up the hills (OSM steps), each tread set into the slope
  {const SM_=mt(0xbdb6a8,.9);for(const st of D.steps){const w=st[0],pts=st.slice(1);if(pts.some(([x,z])=>x>325&&x<339&&z>419&&z<434)||pts.some(([x,z])=>Math.abs(x-332.94)<.1&&Math.abs(z-472.81)<.1))continue;for(let j=0;j<pts.length-1;j++){const[a,b]=pts[j],[c,d]=pts[j+1],L=Math.hypot(c-a,d-b);if(L<.3)continue;const ux=(c-a)/L,uz=(d-b)/L,ry=Math.atan2(ux,uz);
    for(let t=.2;t<L;t+=.42){const x=a+ux*t,z=b+uz*t,y=terrH(x,z);const s=new THREE.Mesh(GC['st'+w]||(GC['st'+w]=new THREE.BoxGeometry(w,.9,.44)),SM_);s.position.set(x,y-.4,z);s.rotation.y=ry;s.receiveShadow=true;s.userData.ts=1;sc.add(s)}
    if(w>=2.4)for(let t=0;t<L;t+=1.6){const x=a+ux*t,z=b+uz*t;const r=new THREE.Mesh(GC.rail||(GC.rail=new THREE.CylinderGeometry(.03,.03,.95,5)),mt(0x2a3a3a,.5,.4));r.position.set(x,terrH(x,z)+.48,z);r.userData.ts=1;sc.add(r)}}}}
  // ------------------------------------------------ buildings (OSM footprints) stand at the ground level of their front door; on slopes the lower side gets an exposed base
  const RC=[0x3c4150,0x5a3a32,0x4a4a4a,0x6b5b4b,0x2f3a34],PLN={dabney:0x5d6970,daap:'dpMix',steger:'brick',crc:'metal',morgens:'conc',garage:0x8f8c86,diag:'diag',cch:'cchB',cchG:'cchG',stone:'stone',tuc:'zinc'};
  const ALLP=D.B.map(b=>gpoly(b.p[0]));
  for(const b of D.B){if(b.rect&&Math.abs(b.rect[0]-330.67)<.1&&Math.abs(b.rect[1]-475.88)<.1)b.brz=1;if(b.n==='Braunstein Hall'&&!b.v121){b.v121=1;b.h=16;b.lvo=terrH(b.fp[0]+b.fn[0]*1.6,b.fp[1]+b.fn[1]*1.6);b.fp=[241.45,244.25];b.fn=[0,1];b.f='phys'}/* V121: physics class, main door on the north face *//* V120: three storeys, one facade tile, arched stone entrance */if(b.n==='Mary Emery Hall'&&b.us)for(let k=0;k<3;k++)b.us[k]='ccmR';if(b.rect&&Math.abs(b.rect[0]-406.73)<.15&&Math.abs(b.rect[1]-192)<.15&&!b.n)b.brg=6.4;const main=gpoly(b.p[0]),holes=(b.ho||[]).map(gpoly),h=b.k==='zimmer'?6.6:b.k==='memorial'?14.5:b.h,fp=b.fp,fn=b.fn,N=b.n,K=b.k;let id='uc'+B.length;const mc=UCMC[b.s]||'#9a5a48',o={holes};const p=main;const i0=sc.children.length;
    switch(b.s){
      case 'daap':prism(p,0,h,'dpMix',0xe2e2de,o);break;
      case 'steger':prism(p,0,5,'stegB',0x6c665a,o);prism(p,5,h-5,'metal',0x6c665a,{holes,solid:false});markPoly(p,h);break;
      case 'crc':if(b.pb){const pb=gpoly(b.pb);prism(pb,0,8.6,'glass',0x6c6a64,{});prism(p,8.6,h-8.6,'metal',0x6c6a64,{holes,solid:false});prism(p,8.2,.4,0xd9d5cc,0xd9d5cc,{holes,solid:false});markPoly(pb,h);
          for(const[x,z]of b.cols||[]){cyl(x,4.1,z,1.1,8.2,mt(0xd6d2c8,.85),20);cyl(x,8.05,z,1.9,.5,mt(0xd6d2c8,.85),20);markC(x,z,1.1,8);for(const f of[.06,.12]){const dx=b.c[0]-x,dz=b.c[1]-z,l=Math.hypot(dx,dz)||1,u=Math.min(4.5,l*f*3);const d=new THREE.Mesh(GC.dl||(GC.dl=new THREE.CircleGeometry(.4,12)),bm(0xfff1d2));d.rotation.x=PI/2;d.position.set(x+dx/l*u,8.18,z+dz/l*u);sc.add(d)}}crcGround(b,p);}   // upper floors overhang MainStreet on round concrete columns
        else{prism(p,0,7,'metal',0x6c6a64,o);prism(p,7,h-7,'glass',0x6c6a64,{holes,solid:false});markPoly(p,h)}break;
      case 'tuc':tucBuild(b,main);break;
      case 'morgens':prism(p,0,6,'glass',0x6c6a64,o);prism(p,6,h-6,'morg',0x6c6a64,{holes,solid:false});markPoly(p,h);break;
      case 'garage':{for(let k=0;k*2.9<h;k++)prism(p,k*2.9,.45,0x8f8c86,0x7a7772,{holes,solid:false});for(let i=0;i<p.length;i+=Math.max(1,Math.floor(p.length/14)))box(p[i][0],h/2,p[i][1],.9,h,.9,0x8f8c86);markPoly(p,h);break}
      case 'roof':{prism(p,h-.5,.5,0xd8d4ca,0xc9c4b8,{solid:false});for(const[x,z]of p.filter((q,i)=>i%Math.max(1,Math.floor(p.length/4))===0))cyl(x,(h-.5)/2,z,.18,h-.5,0x9a9a9a,6);break}
      case 'diag':if(N==='Lindner Center'){const ip=lindnerBase(p,h,b);prism(p,4.8,h-4.8,'diag',0xb8bcc2,{holes,solid:false});try{lindnerScreen(p,h)}catch(e){console.warn('lindner',e)}markPoly(ip,h)}else prism(p,0,h,'diag',0xb8bcc2,o);break;
      case 'cch':{const pb=b.pb?gpoly(b.pb):p,H0=4.4;prism(pb,0,H0,'cchB',0x3a3d42,{solid:false});prism(p,H0,h-H0,'cchT',0x4a4d52,{holes,solid:false});prism(p,H0-.14,.14,0xe4e0d8,0xe4e0d8,{solid:false,cast:false});
        if(b.atr){const[x0,z0,x1,z1]=b.atr,L=Math.hypot(x1-x0,z1-z0),ry=Math.atan2(-(z1-z0),x1-x0),nx=-(z1-z0)/L,nz=(x1-x0)/L,sgn=nz>0?-1:1;
          const g=new THREE.Mesh(boxUV(new THREE.BoxGeometry(L+.4,h-.4,.3),L+.4,h-.4,.3,8),fm('glass'));g.position.set((x0+x1)/2+nx*sgn*.2,(h-.4)/2,(z0+z1)/2+nz*sgn*.2);g.rotation.y=ry;sc.add(g);
          for(let y=4.4;y<h;y+=3.6){const f=new THREE.Mesh(bgeo(L+.3,.18,1.1),mt(0x262b32));f.position.set((x0+x1)/2+nx*sgn*.6,y,(z0+z1)/2+nz*sgn*.6);f.rotation.y=ry;sc.add(f)}}
        markPoly(p,h);break}
      case 'cchG':if(!b.cchX)prism(p,0,h,'cchG',0x4a4d52,o);break;   // V126: the south wing became the cube and patio (file 09b)
      default:
        if(b.brz){}
        else if(b.brg){prism(p,b.brg,h-b.brg,b.s,0x5a5c62,{holes,solid:false});const sh=new THREE.Shape(p.map(([x,z])=>new THREE.Vector2(x,z))),sg=new THREE.ShapeGeometry(sh);sg.rotateX(PI/2);const so=new THREE.Mesh(sg,mt(0x7a6a5e,.9));so.position.y=b.brg;sc.add(so)}
        else if(K==='langsam'){prism(p,0,4,'glass',0x6c6a64,{holes,solid:false});prism(p,4,h-4,b.s,0x6c6a64,o);markPoly(p,h)}
        else if(K==='arena'){prism(p,0,8,'glass',0x6c6a64,{holes,solid:false});prism(p,8,h-8,'darkM',0xdedcd6,o);markPoly(p,h)}
        else if(K==='westpav'){wpavX(b,p,h)}
        else if(b.s==='daniels'){danielsX(b,p,h,holes,fp,fn)}
        else if(b.s==='dabney'){dabneyX(b,p,h,holes)}
        else if(K==='zimmer'){prism(p,0,h,'rieve',SM({map:zimPave2(),roughness:.85}),o)}
        else if(b.pp){for(const r of b.pp)prism(gpoly(r),0,h,b.s,0x5a5c62,{});{const M=mcPass(b);prism(gpoly(b.arch),M.yc,h-M.yc,b.s,0x5a5c62,{solid:false})}}   // McMicken: walk-through passage under the centre
        else prism(p,0,h,b.s,b.s==='stone'?0x7a7468:b.s==='daapO'?0xdcdad4:0x5a5c62,o)}
    if(b.up){const PF={daap:'dpMix',steger:'metal',crc:'metal',tuc:'zinc',morgens:'morgC',cch:'cchT',cchG:'cchG',garage:null,roof:null},pf=b.s in PF?PF[b.s]:b.s;if(pf)b.up.forEach(([ring,hh],ui)=>{if(ui===b.lx)return;const pp=gpoly(ring),y0=b.pb?8.2:b.s==='daniels'?DANY:b.s==='dabney'?DABY:0;prism(pp,y0,hh-y0,(b.us&&b.us[ui])||pf,b.s==='daapO'?0xdcdad4:0x6c6a64,{solid:false});if(!b.pb&&b.s!=='dabney')markPoly(pp,hh);else if(b.s==='dabney')for(const q of[clipX(pp,DABP[0],1,1),clipX(pp,DABP[1],0,1)])if(q.length>=3)markPoly(q,hh)})}   /* V312 keep Dabney's breezeway walkable */
    // roofs: hips on simple blocks, stepped hips on the irregular old brick halls, plant rooms on big flat roofs
    if(!(b.r==='hip'&&b.rn>.72)&&!b.ir&&!b.brz&&b.u&&!['garage','roof','tuc','crc','steger','morgens','cch','daap'].includes(b.s))coping(main,h,/brick|bald|stone|diet|lind|steger/.test(String(b.s))?0xd6cebc:0xb9b5ac);
    if(b.r==='hip'&&b.rn>.72&&b.s!=='roof')hipOnRect(b.rect,h,b.rh?Math.min(b.rh,Math.min(b.rect[2],b.rect[3])*.55):Math.min(b.u?5.5:4,Math.min(b.rect[2],b.rect[3])*(b.u?.28:.42)),b.u?0x3c4150:RC[(B.length*7)%RC.length]);
    else if(b.ir){const st=b.rh?Math.min(1.8,Math.max(.4,b.rh/b.ir.length)):.85;b.ir.forEach((r,k)=>prism(gpoly(r),h+k*st,st,0x3c4150,0x3c4150,{solid:false}))}
    else if(!['garage','daap','roof'].includes(b.s)&&b.u&&!b.up&&!b.ld){const[cx,cz,w,d,ang]=b.rect;if(w*d>500&&inPoly(b.c[0],b.c[1],main)){const m=new THREE.Mesh(bgeo(Math.min(w,d)*.25,1.8,Math.min(w,d)*.2),mt(0x8a8d92));m.position.set(b.c[0],h+.9,b.c[1]);m.rotation.y=-ang*PI/180;sc.add(m)}}
    // signature details
    if(K==='daap')eisenmanBoxes(main,h,true,fp,(x,z)=>ALLP.some(q=>q!==main&&inPoly(x,z,q)));
    if(K==='erc')ercX(b,main,h);
    if(K==='rieve')rieveX(b);
    if(K==='as'){mcmickenTower(b,main,h);if(b.pp)mcmickenPassage(b)}
    if(K==='langsam')langsamX(b);
    if(b.lo&&K==='upav')roofSlab(b);
    if(K==='baldwin')templeFront(fp,fn,{w:Math.min(9.5,(b.pw||12)-2.4),y0:1.5,ch:Math.max(9,h-3.2),ped:3.6,dep:2.2,cols:2,pier:mt(0x8a3f2c,.9)});
    if(K==='dieterle')gableFront(fp,fn);
    if(b.s==='steger'){const L=letters('JOSEPH A. STEGER STUDENT LIFE CENTER',12.5,.62,'#2f343a');L.position.set(fp[0]+fn[0]*.12,5.75,fp[1]+fn[1]*.12);L.rotation.y=Math.atan2(fn[0],fn[1]);sc.add(L)}
    if(K==='vw'){const[cx,cz]=b.c;const r=Math.min(4.2,Math.min(b.rect[2],b.rect[3])*.3);cyl(cx,h+1.4,cz,r,2.8,mt(0xcbbfa4,.8),20);dome(cx,h+2.8,cz,r-.2,mt(0x9fc4d8,.15,.35),{lantern:false});cyl(cx,h+2.8+r,cz,.6,1.2,0xcbbfa4,10)}
    if(K==='blegen'&&!b.ld){const[cx,cz]=b.rect;box(cx,h+5,cz,6,10,6,fm(b.s));box(cx,h+10.4,cz,6.6,.8,6.6,0xe9e3d3);const r=new THREE.Mesh(HIPG,mt(0x3c4150,.75));r.scale.set(6.6,3,6.6);r.position.set(cx,h+10.8,cz);sc.add(r);markR(cx-3,cz-3,cx+3,cz+3,h+14)}
    if(K==='church'){// former St. George church (Crossroads Uptown): twin brick towers with green copper spires on the Calhoun St front
      const tq=[-fn[1],fn[0]],w=Math.min(b.rect[2],b.rect[3])*.42;for(const sg of[-1,1]){const x=fp[0]-fn[0]*2.6+tq[0]*sg*w,z=fp[1]-fn[1]*2.6+tq[1]*sg*w;box(x,(h+10)/2,z,4.2,h+10,4.2,fm('brick'));box(x,h+10.3,z,4.6,.5,4.6,0xd9cfb8);const sp=new THREE.Mesh(GC.spire||(GC.spire=new THREE.ConeGeometry(2.4,9,8)),mt(0x5f9a86,.6));sp.position.set(x,h+15,z);sp.castShadow=true;sc.add(sp);cyl(x,h+20.4,z,.06,1.6,0x2a2a2a,6);markR(x-2.1,z-2.1,x+2.1,z+2.1,h+19)}}
    if(K==='memorial')castleX(b,main,h);
    if(K==='corbett'){const[cx,cz]=inPoly(b.c[0],b.c[1],main)?b.c:b.rect;cyl(cx,h/2+1,cz,Math.min(9,Math.min(b.rect[2],b.rect[3])*.3),h+2,fm('brickO'),28);box(cx,h+6,cz,9,12,9,0xc9c1ad);markR(cx-4.5,cz-4.5,cx+4.5,cz+4.5,h+12)}
    if(K==='armory'||K==='vaultL'){const[cx,cz,w,d,ang]=b.rect;const L=Math.max(w,d)-2,W=Math.min(w,d)-2,a=-ang*PI/180;const g=new THREE.Group(),m=new THREE.Mesh(new THREE.CylinderGeometry(W/2,W/2,L,24,1,false,0,PI),mt(K==='armory'?0x8a6a5a:0x9aa0a8,.5,.2));m.rotation.z=PI/2;m.scale.set(1,1,K==='arena'?.3:K==='armory'?.42:.22);g.add(m);g.position.set(cx,h,cz);g.rotation.y=a+(w>=d?0:PI/2);sc.add(g)}
    if(K==='plant'){const[cx,cz]=b.c;if(inPoly(cx,cz,main)){cyl(cx,h+9,cz,1.4,18,mt(0x9a5a48,.9),14);markC(cx,cz,1.5,h+18)}}
    if(K==='zimmer')zimmerX(b,main,h);
    if(b.po&&N!=='Old Chemistry'&&K!=='baldwin')porticoAt(fp,fn,N==='Baldwin Hall'?7:Math.min(12,Math.max(7,Math.hypot(b.rect[2],b.rect[3])*.18)),Math.min(h-2,N==='Baldwin Hall'?12:10),N==='Baldwin Hall'?2:4);   // Baldwin: two giant columns under the pediment
    const fx=b.f&&UCFUNC[b.f];
    /* V299 a street-level entrance on every building (07b-entrances); TUC, Zimmer, Braunstein, Daniels and the Rec Center model their own */
    if(K!=='tuc'&&K!=='zimmer'&&b.s!=='daniels'&&b.s!=='crc'&&!(fx&&fx[0]==='braun'))try{entrancesUCD(b,main,h,b.lvo!=null?b.lvo:terrH(fp[0]+fn[0]*1.6,fp[1]+fn[1]*1.6),ALLP)}catch(e){console.warn('entrance',N,e)}
    if(fx){id=fx[0];if(id==='braun')FD.doors.push([fp[0],fp[1]]);const[x0,z0,x1,z1]=bbox(main);const face=Math.abs(fn[0])>Math.abs(fn[1])?(fn[0]>0?'e':'w'):(fn[1]>0?'s':'n');const bb={id,name:N,menu:fx[1],x0,z0,x1,z1,h,poly:main,mc,face,da:Math.abs(fn[0])>Math.abs(fn[1])?fp[1]:fp[0],ex:fp[0]+fn[0]*2.3,ez:fp[1]+fn[1]*2.3,fp,fn};B.push(bb)}
    else if(!b.brz)decoB(id,N,main,h,mc);
    // set the building into the hillside: level = ground at the front door; exposed base down to the lowest ground under the footprint
    {const lv=b.lvo!=null?b.lvo:terrH(fp[0]+fn[0]*1.6,fp[1]+fn[1]*1.6);let mn=lv;for(const[x,z]of main)mn=Math.min(mn,terrH(x,z));const[x0,z0,x1,z1]=bbox(main);for(let x=x0+3;x<x1;x+=6)for(let z=z0+3;z<z1;z+=6)if(inPoly(x,z,main))mn=Math.min(mn,terrH(x,z));
      if(lv-mn>.25&&b.s!=='roof'&&!b.brg&&!b.brz&&b.k!=='westpav'){const ps=PLN[b.s]!==undefined?PLN[b.s]:b.s;if(b.pp)for(const r of b.pp)prism(gpoly(r),mn-lv-.8,lv-mn+.8,ps,0x5a5c62,{solid:false});else prism(b.pb?gpoly(b.pb):main,mn-lv-.8,lv-mn+.8,ps,0x5a5c62,{holes:b.pb?[]:holes,solid:false})}
      shiftFrom(i0,()=>lv)}
    if(b.sg&&GROUND_SIGNS.has(N))ucIdAt(N,fp[0]+fn[0]*(fx?6.2:3.2)+(fx?-fn[1]*4.5:0),fp[1]+fn[1]*(fx?6.2:3.2)+(fx?fn[0]*4.5:0),fn)}
  // ------------------------------------------------ stands: rows of seats rising from the field level up the sides of the bowl
  const pitchLv=(x,z)=>{let best=null,bd=1e9;for(const f of D.pitches){const d=Math.hypot(f.rect[0]-x,f.rect[1]-z);if(d<bd){bd=d;best=f}}return best?terrH(best.rect[0],best.rect[1]):terrH(x,z)};
  for(const s of D.stands){if(s.nip&&s.sl.length<10){nipNorthStand(D.stad);continue}const r0=s.sl[0].r[0],lv=s.nip?terrH(D.stad.cx,D.stad.cz):pitchLv(r0[0][0],r0[0][1]);
    for(const q of s.sl){const r=R2(q.r),east=s.nip&&(()=>{let a=0;for(const[x,z]of r[0])a+=(x-D.stad.cx)*D.stad.vx+(z-D.stad.cz)*D.stad.vz;return a/r[0].length>8})(),gry=east&&q.h>7.5,col=gry?(q.c?0x9a9da3:0x84878d):(q.c?0xa8192e:0x861828);const m=prism(r[0],lv,q.h,col,col,{holes:r.slice(1),mh:q.h});m.userData.ts=1}
    for(const[x0,z0,x1,z1]of s.w){if(s.nip&&nipRailSeg(x0,z0,x1,z1,lv+s.top))continue;const L=Math.hypot(x1-x0,z1-z0),wh=s.top+1.4;const w=new THREE.Mesh(boxUV(new THREE.BoxGeometry(L+.3,wh+3,.5),L+.3,wh+3,.5,16),fm('arcade'));w.position.set((x0+x1)/2,lv+(wh-3)/2,(z0+z1)/2);w.rotation.y=Math.atan2(-(z1-z0),x1-x0);w.castShadow=true;w.userData.ts=1;sc.add(w)}}
  const iFree=sc.children.length;
  // ------------------------------------------------ Nippert Stadium on Carson Field (lines are painted on the ground texture)
  {STAD=Object.assign({},D.stad);const L=(u,v)=>fromField(u,v);
   for(const u of[STAD.hl-8,-STAD.hl+8]){{const[x,z]=L(u,STAD.hw+12);cyl(x,13,z,.4,26,0x5a5c62,8);const lb=box(x,26.5,z,3.4,1.8,.6,bm(0xfff4d0));lb.rotation.y=Math.atan2(STAD.ux,STAD.uz)+PI/2;markC(x,z,.5,26)}{const[x,z]=L(u,-STAD.hw-12);cyl(x,26,z,.3,4,0x5a5c62,8);const lb=box(x,28.4,z,3.4,1.8,.6,bm(0xfff4d0));lb.rotation.y=Math.atan2(STAD.ux,STAD.uz)+PI/2}}
   for(const s of[-1,1]){const YG=GC.gpm||(GC.gpm=SM({color:0xf2c230,emissive:0x4a3806})),ry=Math.atan2(STAD.ux,STAD.uz),[x,z]=L(s*(STAD.hl-.2),0),[bx,bz]=L(s*(STAD.hl+1.25),0);
     cyl(bx,1.35,bz,.17,2.7,YG,10);cyl(bx,1.0,bz,.3,2.0,mt(0xb0172b,.8),12);{const nk=new THREE.Mesh(bgeo(.24,.24,1.5),YG);nk.position.set((x+bx)/2,2.78,(z+bz)/2);nk.rotation.y=ry;sc.add(nk)}cyl(x,2.92,z,.13,.32,YG,10);
     const cb=new THREE.Mesh(bgeo(5.64,.2,.2),YG);cb.position.set(x,3.05,z);cb.rotation.y=ry;sc.add(cb);
     for(const t of[-2.82,2.82]){const px=x+STAD.vx*t,pz=z+STAD.vz*t;cyl(px,3.05+5.35,pz,.07,10.7,YG,8);const fl=new THREE.Mesh(GC.gpf||(GC.gpf=new THREE.PlaneGeometry(.16,1.2)),SM({color:0xff5a1f,side:THREE.DoubleSide}));fl.position.set(px,13.75+.6,pz);fl.rotation.y=ry;sc.add(fl)}
     markC(bx,bz,.35,3)}
   if(D.score){const{x,z}=D.score,w=D.score.w||14,lv=terrH(STAD.cx,STAD.cz),nx=-STAD.ux,nz=-STAD.uz,ry=Math.atan2(nx,nz),tx=STAD.vx,tz=STAD.vz;   // the video board faces down the field from the north-east end
     for(const s of[-w*.32,w*.32]){const lx=x+tx*s,lz=z+tz*s;for(const dy of[-3,3]){const r=box(lx-nx*1.5,lv+25.6+dy,lz-nz*1.5,.3,.3,2.6,0x3a3c42,0);r.rotation.y=ry;r.userData.ts=1}}   // V86 hung off the CRC wall: no posts down into the stands
     const sb=new THREE.Mesh(bgeo(w+.8,9.4,1.2),mt(0x111317));sb.position.set(x,lv+25.6,z);sb.userData.ts=1;sb.rotation.y=ry;sc.add(sb);
     const c=document.createElement('canvas');c.width=1024;c.height=352;const q2=c.getContext('2d');q2.fillStyle='#050608';q2.fillRect(0,0,1024,352);q2.fillStyle='#c8102e';q2.fillRect(0,0,1024,92);q2.fillStyle='#ffffff';q2.font='bold 64px Arial,Helvetica,sans-serif';q2.textAlign='center';q2.textBaseline='middle';q2.fillText('CINCINNATI',512,48);
     q2.fillStyle='#e8e8e8';q2.font='bold 120px Arial,Helvetica,sans-serif';q2.fillText('BEARCATS',512,196);q2.fillStyle='#c8102e';q2.fillRect(0,300,1024,52);q2.fillStyle='#ffffff';q2.font='bold 36px Arial,Helvetica,sans-serif';q2.fillText('HOME  0      QTR 1      GUEST  0',512,327);
     const sf=new THREE.Mesh(new THREE.PlaneGeometry(w,8.6),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));sf.position.set(x+nx*.62,lv+25.6,z+nz*.62);sf.userData.ts=1;sf.rotation.y=ry;sc.add(sf)}
   {const s=D.stands.find(s=>s.nip&&s.sl.length>20);if(s){const r=s.sl[0].r[0].map(([x,z])=>[x,z]);decoB('nippert','Nippert Stadium',r,10,'#8a4a4a')}}}
  // ------------------------------------------------ UC Baseball Stadium: bases, mound and outfield wall (diamond painted on the ground)
  if(D.base_b){const{H,d1,d2,s,m}=D.base_b,at=(a,b)=>[H[0]+d1[0]*a+d2[0]*b,H[1]+d1[1]*a+d2[1]*b];
    cyl(m[0],.14,m[1],2.6,.28,mt(0xa8714c,1),16,0);box(m[0],.3,m[1],.6,.04,.15,0xf4f4ee,0);
    for(const[a,b]of[[s,0],[s,s],[0,s]]){const[x,z]=at(a,b);box(x,.12,z,.45,.14,.45,0xf4f4ee,0)}box(H[0],.08,H[1],.45,.06,.45,0xf4f4ee,0);
    const w=D.base_b.wall;fenceLine(w,{wall:1,h:2.4,c:0x2e4a3c,gap:[Math.floor((w.length-1)/2),3.2]});}
  // ------------------------------------------------ tennis fences, Crosley Tower demolition site
  for(const f of D.fence){let li=0,lm=0;for(let i=0;i<f.length-1;i++){const l=Math.hypot(f[i+1][0]-f[i][0],f[i+1][1]-f[i][1]);if(l>lm){lm=l;li=i}}fenceLine(f,{h:3,gap:[li,3]})}
  if(D.crosley){const r=R2(D.crosley)[0];const[x0,z0,x1,z1]=bbox(r),cx=(x0+x1)/2,cz=(z0+z1)/2;
    fenceLine([...r,r[0]].map(([x,z])=>[x+(x-cx)*.04,z+(z-cz)*.04]),{h:2.2,c:0x2a2d33,gap:[0,3.5]});
    // what is left of Crosley Tower in mid-October 2026: taken down slab by slab from the top since late January (over half gone by July, done ~February 2027),
    // so about 4 of its 17 storeys still stand, on the tower's cross-shaped plan as the 2021 lidar measured it
    const FP=D.crosFp,FL=3.9,NF=4;let tx0,tz0,tx1,tz1;
    if(FP)[tx0,tz0,tx1,tz1]=bbox(FP);else{const w=Math.min(18,(x1-x0)*.5),d=Math.min(22,(z1-z0)*.55);tx0=cx-w/2;tx1=cx+w/2;tz0=cz-d/2;tz1=cz+d/2}
    const tcx=(tx0+tx1)/2,tcz=(tz0+tz1)/2,gy=terrH(tcx,tcz),fp=FP||[[tx0,tz0],[tx1,tz0],[tx1,tz1],[tx0,tz1]];
    const st=prism(fp,gy-2,2+FL*(NF-1),'concT',0x6c6a64,{mh:FL*NF});st.userData.ts=1;
    // the storey being cut apart: bare columns, the last slab pieces waiting for a pick
    for(const[x,z]of fp){const c=box(x,0,z,.9,FL,.9,0x8f8a80);c.position.y=gy+FL*(NF-1)+FL/2;c.userData.ts=1}
    for(let k=0;k<5;k++){const bx=box(tcx-5+k*2.6,0,tcz-3+((k*3)%4)*1.6,2.4,.35,3.1,0x9e998e);bx.position.y=gy+FL*NF+.2;bx.rotation.y=k*.3;bx.userData.ts=1}
    for(let k=0;k<3;k++){const bx=box(tcx-3+k*3,0,tcz+2-k,2.2,1+(k%2),2.2,0x8a857b);bx.position.y=gy+FL*(NF-1)+.5+(k%2)*.5;bx.userData.ts=1}
    {const kx=tx1+4.5,c1=cyl(kx,22,tcz,.9,44,0xe2b64c,6);const j=new THREE.Mesh(bgeo(34,1.2,1.2),mt(0xe2b64c));j.position.set(kx-10,44,tcz);sc.add(j);const c2=cyl(kx-14,(44+FL*NF+3)/2,tcz,.05,44-FL*NF-3,0x222,4);
      const sl=new THREE.Mesh(bgeo(2.6,.35,3.2),mt(0x9e998e));sl.position.set(kx-14,FL*NF+3,tcz);sl.castShadow=true;sc.add(sl);const gy2=terrH(kx,tcz);for(const o of[c1,j,c2]){o.position.y+=gy2;o.userData.ts=1}sl.position.y+=gy;sl.userData.ts=1;markC(kx,tcz,1.2,44)}
    for(let i=0;i<7;i++){const a=PI+i*PI/6,rr=new THREE.Mesh(new THREE.DodecahedronGeometry(1.6+(i%3)*.6,0),mt(0x9e998e,.95));rr.position.set(tcx+Math.cos(a)*((tx1-tx0)/2+2.5),.6,tcz+Math.sin(a)*((tz1-tz0)/2+2.5));sc.add(rr)}
    }
  // ------------------------------------------------ fountains, statue, flagpole, plaza signs
  FOUNT=pt('fount');{const s=mt(0xc9c1ad,.8);const b=new THREE.Mesh(new THREE.CylinderGeometry(5,5.3,.9,32),s);b.position.set(FOUNT[0],.45,FOUNT[1]);b.receiveShadow=b.castShadow=true;sc.add(b);const w=new THREE.Mesh(new THREE.CylinderGeometry(4.6,4.6,.1,32),SM({color:0x3a7ea8}));w.position.set(FOUNT[0],.78,FOUNT[1]);sc.add(w);cyl(FOUNT[0],1.6,FOUNT[1],.5,2.4,s);const bowl=new THREE.Mesh(new THREE.CylinderGeometry(1.7,.6,.6,24),s);bowl.position.set(FOUNT[0],2.9,FOUNT[1]);bowl.castShadow=true;sc.add(bowl);markC(FOUNT[0],FOUNT[1],5.4,1.2);
    const n=180,p=new Float32Array(n*3);fountainPts=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:0xd8eeff,size:.16,transparent:true,opacity:.85}));fountainPts.geometry.setAttribute('position',new THREE.BufferAttribute(p,3));fountainPts.userData.ph=Array.from({length:n},()=>[rnd(),rnd()*TAU,.6+rnd()*.6]);fountainPts.frustumCulled=false;fountainPts.position.y=terrH(FOUNT[0],FOUNT[1]);fountainPts.userData.ts=1;sc.add(fountainPts)}
  for(const[x,z,nm]of D.founts){if(Math.hypot(x-FOUNT[0],z-FOUNT[1])<3)continue;const s=mt(0xc9c1ad,.8);const b=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.6,.7,24),s);b.position.set(x,.35,z);b.castShadow=true;sc.add(b);const w=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,.08,24),SM({color:0x3a7ea8}));w.position.set(x,.62,z);sc.add(w);cyl(x,1.1,z,.25,1.4,s);markC(x,z,2.7,1)}
  {const[x,z]=pt('sigma');cyl(x,4,z,.09,8,0xd8d8d8,8);const fl=new THREE.Mesh(bgeo(1.6,1,.04),mt(0x7d1f2c,.8));fl.position.set(x+.8,7.4,z);sc.add(fl);markC(x,z,.3,8)}
  for(const[x,z,a,t]of D.benches)if(t)cafeSet(x,z,a);else bench(x,z,a+PI);
  campusArt(D);streetFurniture(D);v64Campus(D);lindnerWalk();ccmDecks();ccmVillage();tucPlaza();nipWalk();crcPodDecks();nipLink();wpavConcourse(D);coneInit(D);try{cchCube(D)}catch(e){console.warn('cch',e)}try{zimTunnel()}catch(e){console.warn('zimTunnel',e)}try{gettlerFence(D)}catch(e){console.warn('gettler',e)}bridges(D);zimDecks();try{zimFill()}catch(e){console.warn('zimFill',e)}deckFields(D);
  // everything free-standing sits on the ground where it stands
  shiftFrom(iFree,o=>terrH(o.position.x,o.position.z));
  for(const l of D.lamps)LAMPS.push(l);moreLamps(D);
  for(const[x,z,s,o,hs]of D.trees)tryTree(x,z,s,hs||0);
}
// ------------------------------------------------ kerbside furniture where Mapillary's street photos detected it: litter bins, fire hydrants, utility poles, stop signs, traffic signals
function streetFurniture(D){const st=D.street;if(!st)return;const inRd=(x,z,m=.7)=>[[0,0],[m,0],[-m,0],[0,m],[0,-m]].some(([a,b])=>onRoad(x+a,z+b)||(inCampus(x+a,z+b)&&onStreet(x+a,z+b)));const BL=mt(0x22252a,.6),RD=mt(0xb02a22,.6),WD=mt(0x6b5440,.9),GY=mt(0x8a8d90,.5);
  const G=(x,z,ry=0)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);return g},P=(g,geo,m,x,y,z)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.castShadow=true;g.add(e);return e};
  const near=(x,z)=>{let best=null,bd=1e9;for(const r of D.roads)for(let i=0;i<r.pts.length-1;i++){const[a,b]=r.pts[i],[c,d]=r.pts[i+1],L2=(c-a)**2+(d-b)**2||1;let t=((x-a)*(c-a)+(z-b)*(d-b))/L2;t=Math.max(0,Math.min(1,t));const px=a+(c-a)*t,pz=b+(d-b)*t,dd=(px-x)**2+(pz-z)**2;if(dd<bd){bd=dd;best=[px,pz]}}return best};
  let bi=0;for(const[x,z]of st.bins){if(solid(x,z))continue;const g=G(x,z);P(g,GC.bin||(GC.bin=new THREE.CylinderGeometry(.32,.3,.95,10)),BL,0,.48,0);P(g,GC.binl||(GC.binl=new THREE.CylinderGeometry(.35,.35,.08,10)),BL,0,.99,0);markC(x,z,.38,1);if((bi++)%2===0&&!solid(x+.8,z)){const GN=mt(0x2f6a3c,.6);P(g,GC.rbin||(GC.rbin=new THREE.CylinderGeometry(.3,.28,1.0,10)),GN,.8,.5,0);P(g,GC.rbinl||(GC.rbinl=new THREE.CylinderGeometry(.33,.33,.1,10)),GN,.8,1.04,0);markC(x+.8,z,.36,1)}}
  for(const[x,z]of st.hyd){if(solid(x,z)||inRd(x,z,.3))continue;const g=G(x,z);P(g,GC.hyd||(GC.hyd=new THREE.CylinderGeometry(.13,.15,.7,8)),RD,0,.35,0);P(g,GC.hydc||(GC.hydc=new THREE.SphereGeometry(.15,8,6)),GY,0,.72,0);P(g,GC.hydn||(GC.hydn=new THREE.CylinderGeometry(.06,.06,.42,6).rotateZ(PI/2)),RD,0,.48,0);markC(x,z,.2,1)}
  for(const[x,z]of st.poles){if(solid(x,z)||inRd(x,z))continue;const g=G(x,z,rnd()*PI);P(g,GC.upole||(GC.upole=new THREE.CylinderGeometry(.13,.17,9.5,7)),WD,0,4.75,0);P(g,bgeo(2.2,.12,.12),WD,0,8.8,0);for(const s of[-1,0,1])P(g,GC.ins||(GC.ins=new THREE.CylinderGeometry(.05,.05,.18,6)),GY,s*.9,9,0);markC(x,z,.25,9)}
  for(const[x,z]of st.stops){if(solid(x,z)||inRd(x,z,.4))continue;const n=near(x,z),g=G(x,z,n?Math.atan2(n[0]-x,n[1]-z):0);P(g,GC.spole||(GC.spole=new THREE.CylinderGeometry(.04,.04,2.4,6)),GY,0,1.2,0);const o=P(g,GC.oct||(GC.oct=new THREE.CylinderGeometry(.38,.38,.03,8).rotateX(PI/2)),mt(0xc8221c,.6),0,2.35,.05);o.rotation.z=PI/8;markC(x,z,.15,2.5)}
  // traffic signals: one mast per detected cluster, arm reaching over the nearest street
  for(const[x,z]of st.sig){if(solid(x,z)||inRd(x,z))continue;const n=near(x,z);if(!n)continue;const ry=Math.atan2(n[0]-x,n[1]-z),L=Math.min(6,Math.max(2.5,Math.hypot(n[0]-x,n[1]-z)+1.5)),g=G(x,z,ry);P(g,GC.sigp||(GC.sigp=new THREE.CylinderGeometry(.11,.14,5.6,8)),GY,0,2.8,0);P(g,bgeo(.12,.12,L),GY,0,5.4,L/2);
    for(const t of[L*.55,L*.95]){P(g,bgeo(.34,.95,.28),mt(0x2a2c30,.6),0,4.85,t);for(const[k,c]of[[0,0xd23a2a],[1,0xe0b030],[2,0x3aa05a]])P(g,GC.lens||(GC.lens=new THREE.CircleGeometry(.09,10)),bm(c),0,5.15-k*.3,t+.15)}markC(x,z,.2,5.6)}}
// ------------------------------------------------ a practice field on a deck: turf at the measured surface, retaining walls with brick piers down to the streets, a tall net fence
function deckFields(D){if(!UCT.dlev)return;const DS=THREE.DoubleSide,WL=SM({color:0xaaa59b,side:DS}),BRK=mt(0x8a5442,.9),TF=SM({color:0x3d8a3a}),LN=mt(0xf2efe6,.9),
  NET=SM({color:0x24272b,transparent:true,opacity:.32,side:DS,depthWrite:false}),PO=mt(0x2a2d30,.5);
  const mesh=(arr,mat,cast=1)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(arr.length/3*2),2));const m=new THREE.Mesh(g,mat);m.castShadow=!!cast;m.receiveShadow=true;m.userData.ts=1;sc.add(m)};
  const Q=(A,a,b,c,d)=>A.push(...a,...b,...c,...a,...c,...d);
  for(const f of D.pitches){const lv=UCT.dlev[f.n];if(lv===undefined||!f.r)continue;const ring=f.r[0],n=ring.length,top=lv+.35;
    const sh=new THREE.Shape();ring.forEach(([x,z],i)=>i?sh.lineTo(x,-z):sh.moveTo(x,-z));const g=new THREE.ShapeGeometry(sh);g.rotateX(-PI/2);const tf=new THREE.Mesh(g,TF);tf.position.y=lv;tf.receiveShadow=true;tf.userData.ts=1;sc.add(tf);
    {const[cx,cz,w,d,ang]=f.rect,L=Math.max(w,d),Wd=Math.min(w,d),a=(w>=d?ang:ang+90)*PI/180,ux=Math.cos(a),uz=Math.sin(a);
      for(let k=0;k<=10;k++){const u=-L/2+5+(L-10)*k/10,ln=new THREE.Mesh(bgeo(.22,.03,Wd-1.6),LN);ln.position.set(cx+ux*u,lv+.03,cz+uz*u);ln.rotation.y=-a;ln.userData.ts=1;sc.add(ln)}}
    const wl=[],net=[];
    for(let i=0;i<n;i++){const[ax,az]=ring[i],[bx,bz]=ring[(i+1)%n],L=Math.hypot(bx-ax,bz-az);if(L<.5)continue;const dx=(bx-ax)/L,dz=(bz-az)/L;
      let nx=dz,nz=-dx;if(inPoly((ax+bx)/2+nx*.6,(az+bz)/2+nz*.6,ring)){nx=-nx;nz=-nz}       // outward
      const m=Math.max(1,Math.ceil(L/1.5)),P=[];for(let k=0;k<=m;k++){const x=ax+dx*L*k/m,z=az+dz*L*k/m;P.push([x,z,Math.min(terrH(x+nx*1.2,z+nz*1.2),terrH(x+nx*2.6,z+nz*2.6))-.3])}
      for(let k=0;k<m;k++){const[x0,z0,g0]=P[k],[x1,z1,g1]=P[k+1];if(top-g0<.6&&top-g1<.6)continue;
        Q(wl,[x0,g0,z0],[x1,g1,z1],[x1,top,z1],[x0,top,z0]);Q(wl,[x0+nx*-.35,top,z0+nz*-.35],[x0,top,z0],[x1,top,z1],[x1+nx*-.35,top,z1+nz*-.35])}
      for(let k=0;k<=m;k++){const[x,z,g0]=P[k];if(k%3===0&&top-g0>1.2){const p=new THREE.Mesh(bgeo(.9,top-g0,.3),BRK);p.position.set(x+nx*.12,(top+g0)/2,z+nz*.12);p.rotation.y=-Math.atan2(dz,dx);p.castShadow=true;p.userData.ts=1;sc.add(p)}
        if(k<m){const[x1,z1]=P[k+1];Q(net,[x,top,z],[x1,top,z1],[x1,top+3.6,z1],[x,top+3.6,z])}
        if(k%2===0){const c=new THREE.Mesh(bgeo(.12,3.7,.12),PO);c.position.set(x,top+1.85,z);c.userData.ts=1;sc.add(c)}}}
    mesh(wl,WL);mesh(net,NET,0);markPoly(ring,top+3.6-Math.min(...ring.map(([x,z])=>terrH(x,z))))}}
// ------------------------------------------------ footbridges between buildings (OSM bridges, deck heights measured by the 2021 Ohio lidar)

// V121 Braunstein Hall's main entrance, on the middle of the north face (where the walk leads): a stone bay with a curved parapet, a big arch
// over a carved tympanum, three arched windows, PHYSICS cut into the lintel, bronze doors; lanterns either side and the NEWTON / PYTHAGORAS plaques
function braunEntry(b){const X=241.45,Z=243.2,gy=terrH(X,Z+1.6)-.25,W=8,H=11.9,D=.75,PX=64,DW=2.7,DH=3.2,UP=1.3;
  const tex=ctex(W*PX,Math.round(H*PX),(q,w,h)=>{const Y=m=>h-(m+UP)*PX,XX=m=>w/2+m*PX,ST='#e0d9c6',ST2='#cfc6b0',DK='#a89d82';
    q.fillStyle=ST;q.fillRect(0,0,w,h);for(let y=0;y<h;y+=26){q.fillStyle='rgba(0,0,0,.05)';q.fillRect(0,y,w,1)}
    // pilasters and their reveals
    for(const s of[-1,1]){q.fillStyle=ST2;q.fillRect(XX(s>0?3.25:-3.95),Y(9.2),.7*PX,(9.2+UP)*PX);q.fillStyle='rgba(0,0,0,.12)';q.fillRect(XX(s*3.25)-(s>0?0:2),Y(9.2),2,(9.2+UP)*PX)}
    // curved parapet panel with a sunburst carving
    q.fillStyle=ST2;q.fillRect(XX(-.7),Y(10.35),1.4*PX,1*PX);q.strokeStyle=DK;q.lineWidth=2;q.strokeRect(XX(-.6),Y(10.25),1.2*PX,.8*PX);for(let k=0;k<12;k++){const a=k/12*TAU;q.beginPath();q.moveTo(XX(0),Y(9.85));q.lineTo(XX(Math.cos(a)*.35),Y(9.85+Math.sin(a)*.3));q.stroke()}
    // archivolt and tympanum relief
    const cy=Y(5.9);q.fillStyle=ST2;q.beginPath();q.arc(XX(0),cy,3.2*PX,PI,0);q.fill();q.fillStyle=ST;q.beginPath();q.arc(XX(0),cy,2.95*PX,PI,0);q.fill();q.fillStyle=ST2;q.beginPath();q.arc(XX(0),cy,2.7*PX,PI,0);q.fill();
    q.fillStyle='#d8d0bb';q.beginPath();q.arc(XX(0),cy,2.45*PX,PI,0);q.fill();q.strokeStyle=DK;q.lineWidth=2;
    q.beginPath();q.arc(XX(0),cy-.95*PX,.55*PX,0,TAU);q.stroke();q.beginPath();q.ellipse(XX(0),cy-.95*PX,.55*PX,.2*PX,0,0,TAU);q.stroke();q.beginPath();q.moveTo(XX(0),cy-1.5*PX);q.lineTo(XX(0),cy-.4*PX);q.stroke();
    for(const s of[-1,1]){q.beginPath();q.moveTo(XX(s*.8),cy-.5*PX);q.quadraticCurveTo(XX(s*1.5),cy-1.4*PX,XX(s*2.1),cy-.35*PX);q.stroke();q.beginPath();q.moveTo(XX(s*1.2),cy-.2*PX);q.lineTo(XX(s*1.7),cy-.9*PX);q.lineTo(XX(s*2),cy-.2*PX);q.stroke();
      q.fillStyle=ST2;q.fillRect(XX(s*2.85)-12,cy-14,24,30);q.strokeRect(XX(s*2.85)-12,cy-14,24,30)}
    // three arched windows
    for(const c of[-1.2,0,1.2]){const x=XX(c-.45),y0=Y(5.55),y1=Y(2.95),ww=.9*PX,r=ww/2;q.fillStyle=ST2;q.beginPath();q.moveTo(x-5,y1+5);q.lineTo(x-5,y0);q.arc(x+r,y0,r+5,PI,0);q.lineTo(x+ww+5,y1+5);q.closePath();q.fill();
      const g=q.createLinearGradient(0,y0-r,0,y1);g.addColorStop(0,'#a9c2d4');g.addColorStop(1,'#425a6c');q.fillStyle=g;q.beginPath();q.moveTo(x,y1);q.lineTo(x,y0);q.arc(x+r,y0,r,PI,0);q.lineTo(x+ww,y1);q.closePath();q.fill();
      q.strokeStyle='#f3f0e7';q.lineWidth=3;q.beginPath();q.moveTo(x+r,y1);q.lineTo(x+r,y0-r);q.stroke();for(let k=1;k<5;k++){const yy=y0+(y1-y0)*k/5;q.beginPath();q.moveTo(x,yy);q.lineTo(x+ww,yy);q.stroke()}q.beginPath();q.moveTo(x,y0);q.lineTo(x+ww,y0);q.stroke()}
    q.fillStyle=ST2;q.fillRect(XX(-2.4),Y(2.95),4.8*PX,10);
    // PHYSICS lintel
    q.fillStyle='#d6cdb6';q.fillRect(XX(-2.3),Y(2.75),4.6*PX,.62*PX);q.font=`600 ${Math.round(.42*PX)}px Georgia, serif`;q.textAlign='center';q.textBaseline='middle';q.fillStyle='#9d9277';q.fillText('P H Y S I C S',XX(0)+1,Y(2.44)+1);q.fillStyle='#bdb299';q.fillText('P H Y S I C S',XX(0),Y(2.44));
  });
  tex.repeat.set(1/W,1/H);tex.offset.set(.5,0);tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;
  const sh=new THREE.Shape();sh.moveTo(-W/2,0);sh.lineTo(-DW/2,0);sh.lineTo(-DW/2,DH);sh.lineTo(DW/2,DH);sh.lineTo(DW/2,0);sh.lineTo(W/2,0);sh.lineTo(W/2,H-1.15);sh.quadraticCurveTo(0,H+.75,-W/2,H-1.15);sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:D,bevelEnabled:false,curveSegments:16});const m=new THREE.Mesh(g,[SM({map:tex,roughness:.85}),SM({color:0xd9d1bd,roughness:.9})]);m.position.set(X,gy,Z);m.castShadow=true;m.receiveShadow=true;sc.add(m);
  braunDoor(X,Z,gy,D,DW,DH);
  // coping along the curved top
  const cs=new THREE.Shape();cs.moveTo(-W/2-.12,H-1.2);cs.quadraticCurveTo(0,H+.7,W/2+.12,H-1.2);cs.lineTo(W/2+.12,H-1.0);cs.quadraticCurveTo(0,H+.92,-W/2-.12,H-1.0);cs.closePath();
  const cg=new THREE.ExtrudeGeometry(cs,{depth:D+.2,bevelEnabled:false,curveSegments:16});const cm=new THREE.Mesh(cg,SM({color:0xc9bfa8,roughness:.9}));cm.position.set(X,gy,Z-.05);sc.add(cm);
  // lanterns on the brick either side
  const br=SM({color:0x6a5634,roughness:.4,metalness:.6}),glow=SM({color:0xfff0c8,emissive:0xffcf80,emissiveIntensity:0,roughness:.3});FMLIST.push(glow);
  for(const s of[-1,1]){const lx=X+s*5.2,ly=gy+2.4;const c=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.75,10),glow);c.position.set(lx,ly,Z+.32);sc.add(c);for(const dy of[-.42,.42]){const k=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.1,10),br);k.position.set(lx,ly+dy,Z+.32);sc.add(k)}const a=new THREE.Mesh(bgeo(.08,.08,.3),br);a.position.set(lx,ly+.2,Z+.12);sc.add(a)}
  // octagonal name plaques high on the brick
  for(const[s,name]of[[-1,'NEWTON'],[1,'PYTHAGORAS']]){const t=ctex(128,128,(q,w,h)=>{q.fillStyle='#d8d0bb';q.beginPath();for(let k=0;k<8;k++){const a=k/8*TAU+PI/8;q.lineTo(64+Math.cos(a)*62,64+Math.sin(a)*62)}q.closePath();q.fill();q.strokeStyle='#a99e84';q.lineWidth=4;q.stroke();q.font=`700 ${name.length>7?15:20}px Georgia, serif`;q.fillStyle='#9a8f74';q.textAlign='center';q.textBaseline='middle';q.fillText(name,64,66)});
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.5),SM({map:t,transparent:true,alphaTest:.5,roughness:.9}));pl.position.set(X+s*7.6,gy+H-2.2,Z+.06);sc.add(pl)}
  markR(X-W/2,Z,X+W/2,Z+D,20)}

// V121 the real doorway: a stepped stone architrave, a deep reveal, and two bronze doors with gilded upper panels, glazed lower panels and push bars
function braunDoor(X,Z,gy,D,DW,DH){const st=SM({color:0xd2c9b2,roughness:.85}),st2=SM({color:0xc4b99f,roughness:.85}),bz=SM({color:0x5e4b2a,roughness:.35,metalness:.65}),gd=SM({color:0xc9a24a,roughness:.3,metalness:.8}),gl=SM({color:0x1e2a34,roughness:.08,metalness:.2});
  const add=(geo,mat,x,y,z)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;sc.add(o);return o},zf=Z+D;
  // architrave: two steps of moulding around the opening
  for(const[o,dz,m]of[[.32,.07,st],[.18,.14,st2]]){add(bgeo(o,DH+o,dz),m,X-DW/2-o/2,gy+(DH+o)/2,zf+dz/2);add(bgeo(o,DH+o,dz),m,X+DW/2+o/2,gy+(DH+o)/2,zf+dz/2);add(bgeo(DW+2*o,o,dz),m,X,gy+DH+o/2,zf+dz/2)}
  // the doors sit back in the reveal; threshold and a little landing
  const dz=Z+.2,lw=DW/2-.04,lh=DH-.06;add(bgeo(DW,.06,D+.2),st2,X,gy+.03,Z+D/2);add(bgeo(DW+2,.18,1.6),st,X,gy-.06,zf+.8);
  add(bgeo(DW,DH,.06),SM({color:0x15110c,roughness:.9}),X,gy+DH/2,Z+.12);
  for(const s of[-1,1]){const cx=X+s*(lw/2+.02);add(bgeo(lw,lh,.08),bz,cx,gy+lh/2+.03,dz);
    add(bgeo(lw-.16,.82,.03),gd,cx,gy+lh-.55,dz+.055);const r=add(new THREE.CylinderGeometry(.13,.13,.04,16),gd,cx,gy+lh-.55,dz+.08);r.rotation.x=PI/2;
    for(let rr=0;rr<3;rr++)for(let c=0;c<2;c++)add(bgeo(.4,.38,.02),gl,cx+(c-.5)*.48,gy+.45+rr*.52,dz+.05);
    add(bgeo(.05,.05,.12),gd,X+s*.12,gy+1.1,dz+.1);add(new THREE.BoxGeometry(.05,.55,.05),gd,X+s*.18,gy+1.1,dz+.16)}
  add(bgeo(.03,lh,.1),SM({color:0x2a2216}),X,gy+lh/2,dz+.01)}
// ---- V312 Dabney Hall (residence hall, 1960s, painted grey-blue brick): a glass ground floor set back behind teal-tiled round columns under a cream
// canopy band; a walk-through breezeway under the middle block from the sand volleyball court to the other side; the volleyball court, a
// picnic table with a red umbrella, ornamental grass and the UC Bike Kitchen sign.
const DABY=4.0,DABP=[274.6,278.4],DABLV=-1.1;   /* ground floor height; the breezeway runs east-west through the north end of the west wing, between these z */
function clipX(p,v,keepLess,ax=0){const o=[],n=p.length,ins=q=>keepLess?q[ax]<=v:q[ax]>=v;for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n],ia=ins(a),ib=ins(b);if(ia)o.push(a);if(ia!==ib){const t=(v-a[ax])/(b[ax]-a[ax]),q=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];q[ax]=v;o.push(q)}}return o}   /* half-plane clip on x (ax 0) or z (ax 1) */
function dabneyX(b,p,h,holes){const Y=DABY,CRM=mt(0xdcd3bf,.85),SOF=mt(0xc9c4b8,.9),TEAL=mt(0x3d7a74,.45,.1),GL='glass';
  const parts=[clipX(p,DABP[0],1,1),clipX(p,DABP[1],0,1)].filter(q=>q.length>=3);
  for(const q of parts){prism(danOff(q,-1.3),0,Y,GL,0x5d6266,{solid:false});markPoly(danOff(q,-1.3),h)}   // glass ground floor, set back
  prism(p,Y,h-Y,'dabney',SOF,{holes,solid:false});                                                    // painted brick above (the bottom face is the soffit)
  prism(danOff(p,.25),Y-.85,.85,CRM,CRM,{solid:false});                                               // cream canopy band
  // round columns along the front of the ground floor, every ~4.5 m, skipping the breezeway
  for(let i=0;i<p.length;i++){const[ax,az]=p[i],[bx,bz]=p[(i+1)%p.length],L=Math.hypot(bx-ax,bz-az);if(L<2.5)continue;const ux=(bx-ax)/L,uz=(bz-az)/L,k=Math.max(1,Math.round(L/4.5));
    const sgn=inPoly((ax+bx)/2+uz*.5,(az+bz)/2-ux*.5,p)?1:-1;
    for(let j=0;j<=k;j++){const t=Math.min(L-.6,Math.max(.6,j*L/k)),x=ax+ux*t+uz*.55*sgn,z=az+uz*t-ux*.55*sgn;if(z>DABP[0]-.6&&z<DABP[1]+.6&&x<572.5)continue;
      const c=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,Y-.85,14),TEAL);c.position.set(x,(Y-.85)/2,z);c.castShadow=true;sc.add(c);markR(x-.3,z-.3,x+.3,z+.3,Y)}}
  // the breezeway: lit ceiling, side walls of painted block, a floor of concrete
  {const xW=563.8,xE=571.5,L=xE-xW,W=DABP[1]-DABP[0],cx=(xW+xE)/2,cz=(DABP[0]+DABP[1])/2;
    for(let k=0;k<3;k++){const l=new THREE.Mesh(bgeo(.3,.05,1.2),SM({color:0xfff6e0,emissive:0xfff0d0,emissiveIntensity:.9}));l.position.set(xW+L*(k+.5)/3,Y-.03,cz);sc.add(l)}
    const f=new THREE.Mesh(bgeo(L+1.6,.04,W),mt(0xbdb9b0,.95));f.position.set(cx,.02,cz);f.receiveShadow=true;sc.add(f)}
  dabneyYard()}
function dabneyYard(){const g=(x,z)=>terrH(x,z)-DABLV,   /* the building's objects are lifted by its level (lvo) after it is built */add=(geo,m,x,y,z,ry)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(ry)o.rotation.y=ry;o.castShadow=true;o.receiveShadow=true;sc.add(o);return o};
  // sand volleyball court (8 x 16 m) in the courtyard north of the middle block, east of the west wing, red boundary tape
  const cx=580.5,cz=289,W=8,L=16,y=g(cx,cz);
  add(bgeo(W+2,.06,L+2),mt(0xd9c9a2,1),cx,y+.03,cz);for(let k=0;k<60;k++){const s=add(new THREE.SphereGeometry(.18+Math.random()*.2,6,4),mt(0xcdbb92,1),cx+(Math.random()-.5)*(W+1.6),y+.02,cz+(Math.random()-.5)*(L+1.6));s.scale.y=.25;s.castShadow=false}
  const RED=mt(0xc8323a,.6);for(const[w,d,x,z]of[[W,.06,cx,cz-L/2],[W,.06,cx,cz+L/2],[.06,L,cx-W/2,cz],[.06,L,cx+W/2,cz]])add(bgeo(w,.015,d),RED,x,y+.07,z).castShadow=false;
  for(const s of[-1,1]){add(new THREE.CylinderGeometry(.06,.06,2.6,8),mt(0x1e1f22,.5),cx+s*(W/2+.7),y+1.3,cz);add(bgeo(.14,1.1,.03),mt(0x1e1f22,.6),cx+s*(W/2+.7),y+.6,cz+.05)}
  {const nt=ctex(256,32,q=>{q.clearRect(0,0,256,32);q.strokeStyle='rgba(20,20,22,.85)';q.lineWidth=1;for(let x=0;x<256;x+=6){q.beginPath();q.moveTo(x,0);q.lineTo(x,32);q.stroke()}for(let y=0;y<32;y+=6){q.beginPath();q.moveTo(0,y);q.lineTo(256,y);q.stroke()}q.fillStyle='#c8323a';q.fillRect(0,0,256,4);q.fillRect(0,29,256,3)});
    const n=add(new THREE.PlaneGeometry(W+1.4,.95),new THREE.MeshStandardMaterial({map:nt,transparent:true,side:THREE.DoubleSide,roughness:.9}),cx,y+1.95,cz);n.castShadow=false}
  markR(cx-W/2-.8,cz-.08,cx-W/2-.6,cz+.08,3);markR(cx+W/2+.6,cz-.08,cx+W/2+.8,cz+.08,3);
  // picnic table with a red umbrella, beside the court
  {const tx=574.6,tz=296,ty=g(tx,tz),BK=mt(0x1d1e20,.45,.3);add(new THREE.CylinderGeometry(.7,.7,.05,20),BK,tx,ty+.74,tz);add(new THREE.CylinderGeometry(.06,.08,.74,8),BK,tx,ty+.37,tz);
    for(let k=0;k<4;k++){const a=k*Math.PI/2+.4,sx=tx+Math.cos(a)*1.05,sz=tz+Math.sin(a)*1.05;add(new THREE.CylinderGeometry(.22,.22,.04,12),BK,sx,ty+.45,sz);add(bgeo(.4,.42,.04),BK,sx+Math.cos(a)*.2,ty+.68,sz+Math.sin(a)*.2,-a+Math.PI/2)}
    add(new THREE.CylinderGeometry(.03,.03,2.5,8),mt(0xb0b4b8,.4,.6),tx,ty+1.25,tz);const um=add(new THREE.ConeGeometry(1.5,.55,10,1,true),new THREE.MeshStandardMaterial({color:0xa8232e,roughness:.8,side:THREE.DoubleSide}),tx,ty+2.3,tz);
    markR(tx-.8,tz-.8,tx+.8,tz+.8,1.2)}
  // ornamental grass clumps along the court and the building
  for(const[x,z]of[[575.2,284],[575.6,290],[575.2,301.8],[579,299.6],[584,300.2],[586.4,286],[586.6,293.5]]){const y0=g(x,z);for(let k=0;k<5;k++){const c=add(new THREE.ConeGeometry(.08,1+Math.random()*.5,4),mt(k%2?0xc9b77e:0xb3a56b,.9),x+(Math.random()-.5)*.5,y0+.6,z+(Math.random()-.5)*.5);c.rotation.z=(Math.random()-.5)*.35}}
  // UC BIKE KITCHEN sign with a bicycle above it, on the west wing's courtyard wall (ground floor, inside the canopy line)
  {const sx=571.5+1.32,sz=294,sy=g(sx,sz)+2.75,tx=ctex(512,96,q=>{q.fillStyle='#fbfbf8';q.fillRect(0,0,512,96);q.fillStyle='#c8202c';q.font='bold 54px Archivo,Arial,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText('UC BIKE KITCHEN',256,50)});
    add(new THREE.PlaneGeometry(2.6,.5),new THREE.MeshStandardMaterial({map:tx,roughness:.7}),sx+.02,sy,sz,Math.PI/2).castShadow=false;
    const BK=mt(0x22252a,.4,.5);for(const d of[-.42,.42]){const w=add(new THREE.TorusGeometry(.3,.025,6,20),BK,sx+.06,sy+.75,sz+d,Math.PI/2);w.castShadow=false}
    const fr=add(bgeo(.03,.03,.8),BK,sx+.06,sy+.85,sz,0);fr.castShadow=false}}
// ---- V293 Daniels Hall (1960s brick dorm tower): an open ground floor of glass set back behind brick piers, a light concrete canopy
// band all the way round at the first-floor line, the entrance with DANIELS HALL letters on the brick above it, a pale band at the top
const DANY=4.6;   /* height of the glass ground floor; the brick tower starts here */
function danOff(p,d){/* offset a closed polygon outward by d (inward when d<0), mitred corners */let A=0;for(let i=0;i<p.length;i++){const[a,b]=p[i],[c,e]=p[(i+1)%p.length];A+=a*e-c*b}const sg=A>0?1:-1,n=p.length,N=[];
  for(let i=0;i<n;i++){const[a,b]=p[i],[c,e]=p[(i+1)%n],L=Math.hypot(c-a,e-b)||1;N.push([sg*(e-b)/L,-sg*(c-a)/L])}
  return p.map(([x,z],i)=>{const n0=N[(i-1+n)%n],n1=N[i];let mx=n0[0]+n1[0],mz=n0[1]+n1[1];const k=mx*n1[0]+mz*n1[1];if(Math.abs(k)<.2)return[x+n1[0]*d,z+n1[1]*d];return[x+mx/k*d,z+mz/k*d]})}
function danielsX(b,p,h,holes,fp,fn){const Y=DANY,BRK=fm('daniels'),CON=mt(0xd9dad7,.8),SOF=mt(0xbfbdb7,.9),FR=mt(0x2a2a2c,.5,.3);
  prism(danOff(p,-1.6),0,Y,'glass',0x55534f,{solid:false});            // glass ground floor, set back under the tower
  prism(p,Y,h-Y,'daniels',0x5a5c62,{holes,solid:false});                // brick tower above it
  prism(danOff(p,.9),Y-.95,.95,CON,SOF,{solid:false});                    // light concrete canopy band round the building
  markPoly(p,h);
  // brick piers: every corner and about every 6 m along the walls, from the ground up into the brick
  for(let i=0;i<p.length;i++){const[ax,az]=p[i],[bx,bz]=p[(i+1)%p.length],L=Math.hypot(bx-ax,bz-az);if(L<1.2)continue;const ux=(bx-ax)/L,uz=(bz-az)/L,ry=Math.atan2(ux,uz)+PI/2,k=Math.max(1,Math.round(L/6));
    for(let j=0;j<=k;j++){const t=Math.min(L-.55,Math.max(.55,j*L/k)),x=ax+ux*t,z=az+uz*t,m=new THREE.Mesh(bgeo(1.1,Y-.9,1.6),BRK);const sgn=inPoly(x+uz*.5,z-ux*.5,p)?1:-1;   /* inward normal, so the pier's face lines up with the brick wall above */
      m.position.set(x+uz*.75*sgn,(Y-.9)/2,z-ux*.75*sgn);m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;sc.add(m)}}
  // uphill walls: the building stands at its front-door level (the low east side), so on the north and west the ground is up to ~5 m higher
  // and buries the glass floor. There the same ground floor (glass, brick piers, canopy) is added again at the local ground level, stepping with the slope.
  if(fp&&fn){const lv=terrH(fp[0]+fn[0]*1.6,fp[1]+fn[1]*1.6),GL=fm('glass'),H1=DANY-.95;
    for(let i=0;i<p.length;i++){const[ax,az]=p[i],[bx,bz]=p[(i+1)%p.length],L=Math.hypot(bx-ax,bz-az);if(L<1.2)continue;const ux=(bx-ax)/L,uz=(bz-az)/L,ry=Math.atan2(ux,uz)+PI/2,k=Math.max(1,Math.round(L/6)),sl=L/k;
      const sgn=inPoly((ax+bx)/2+uz*.5,(az+bz)/2-ux*.5,p)?1:-1,ox=-uz*sgn,oz=ux*sgn;   /* outward normal */
      for(let j=0;j<k;j++){const t0=j*sl,t1=t0+sl,mx=ax+ux*(t0+t1)/2,mz=az+uz*(t0+t1)/2;
        const g=Math.max(terrH(ax+ux*t0+ox*.6,az+uz*t0+oz*.6),terrH(ax+ux*t1+ox*.6,az+uz*t1+oz*.6),terrH(mx+ox*.6,mz+oz*.6))-lv;if(g<1.2)continue;
        const gl=new THREE.Mesh(bgeo(sl,H1+.6,.12),GL);gl.position.set(mx+ox*.07,g-.6+(H1+.6)/2,mz+oz*.07);gl.rotation.y=ry;sc.add(gl);
        const cn=new THREE.Mesh(bgeo(sl+.02,.95,1.0),CON);cn.position.set(mx+ox*.48,g+H1+.475,mz+oz*.48);cn.rotation.y=ry;cn.castShadow=true;sc.add(cn);
        for(const t of[t0,t1]){const tt=Math.min(L-.55,Math.max(.55,t)),px=ax+ux*tt,pz=az+uz*tt,pm=new THREE.Mesh(bgeo(1.1,H1+.6,.7),BRK);pm.position.set(px+ox*.34,g-.6+(H1+.6)/2,pz+oz*.34);pm.rotation.y=ry;pm.castShadow=true;pm.receiveShadow=true;sc.add(pm)}}}}
  // entrance on the front face: deeper canopy over glass doors, DANIELS HALL in steel letters on the brick
  if(fp&&fn){const ry=Math.atan2(fn[0],fn[1]),tx=-fn[1],tz=fn[0],[x,z]=fp;
    const dr=new THREE.Mesh(bgeo(4.4,2.7,.12),fm('glass'));dr.position.set(x-fn[0]*1.5,1.35,z-fn[1]*1.5);dr.rotation.y=ry;sc.add(dr);
    for(const s of[-2.2,-.73,.73,2.2]){const f=new THREE.Mesh(bgeo(.1,2.8,.16),FR);f.position.set(x-fn[0]*1.45+tx*s,1.4,z-fn[1]*1.45+tz*s);f.rotation.y=ry;sc.add(f)}
    const tr=new THREE.Mesh(bgeo(4.5,.12,.18),FR);tr.position.set(x-fn[0]*1.45,2.8,z-fn[1]*1.45);tr.rotation.y=ry;sc.add(tr);
    const cn=new THREE.Mesh(bgeo(6.2,.45,2.6),CON);cn.position.set(x+fn[0]*.2,Y-1.2,z+fn[1]*.2);cn.rotation.y=ry;cn.castShadow=true;sc.add(cn);
    const L=letters('DANIELS  HALL',5.4,.62,'#c9ccd0');L.position.set(x+fn[0]*.06,Y+1.05,z+fn[1]*.06);L.rotation.y=ry;sc.add(L)}
  // pale concrete band along the top of the tower
  if(b.up)for(const[ring,hh]of b.up){const pp=gpoly(ring);prism(danOff(pp,.12),hh-1.4,1.4,CON,0xcfcdc6,{solid:false})}}

