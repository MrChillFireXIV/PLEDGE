// ================================================================ MATERIALS & TEXTURES
const MC={},BMC={},GC={};
const mt=(c,r=.85,m=0)=>{const k=c+'|'+r+'|'+m;return MC[k]||(MC[k]=SM({color:c,roughness:r,metalness:m}))};
const bm=c=>BMC[c]||(BMC[c]=new THREE.MeshBasicMaterial({color:c}));
const bgeo=(w,h,d)=>{const k=w+','+h+','+d;return GC[k]||(GC[k]=new THREE.BoxGeometry(w,h,d))};
function box(x,y,z,w,h,d,mat,cast=1){const e=new THREE.Mesh(bgeo(w,h,d),typeof mat==='number'?mt(mat):mat);e.position.set(x,y,z);e.castShadow=!!cast;e.receiveShadow=true;sc.add(e);return e}
function cyl(x,y,z,r,h,mat,seg=12,cast=1){const k='c'+r+','+h+','+seg;const g=GC[k]||(GC[k]=new THREE.CylinderGeometry(r,r,h,seg));const e=new THREE.Mesh(g,typeof mat==='number'?mt(mat):mat);e.position.set(x,y,z);e.castShadow=!!cast;e.receiveShadow=true;sc.add(e);return e}
function ctex(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');f(q,w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());return t}
function speck(q,w,h,n,hue,sat,l0,l1,s=2){for(let i=0;i<n;i++){q.fillStyle=`hsl(${hue+rnd()*16-8},${sat}%,${l0+rnd()*(l1-l0)}%)`;q.fillRect(rnd()*w,rnd()*h,1+rnd()*s,1+rnd()*s)}}
function shade(hex,d){const n=parseInt(hex.slice(1),16);const r=clamp(((n>>16)&255)+d|0,0,255),g=clamp(((n>>8)&255)+d|0,0,255),b=clamp((n&255)+d|0,0,255);return`rgb(${r},${g},${b})`}
const TX={},TM={};
function makeTextures(){
  TX.grass=ctex(256,256,(q,w,h)=>{q.fillStyle='#4e7a37';q.fillRect(0,0,w,h);speck(q,w,h,9000,96,40,22,38,2);speck(q,w,h,700,70,42,34,46,3)});
  TX.grass2=ctex(256,256,(q,w,h)=>{q.fillStyle='#3f6b33';q.fillRect(0,0,w,h);speck(q,w,h,9000,110,36,18,32,2)});
  TX.asphalt=ctex(256,256,(q,w,h)=>{q.fillStyle='#3a3c41';q.fillRect(0,0,w,h);speck(q,w,h,8000,220,6,17,33,2);q.strokeStyle='rgba(20,20,22,.5)';q.lineWidth=1.5;for(let i=0;i<5;i++){q.beginPath();let x=rnd()*w,y=rnd()*h;q.moveTo(x,y);for(let k=0;k<6;k++){x+=rnd()*24-12;y+=rnd()*24-12;q.lineTo(x,y)}q.stroke()}});
  TX.concrete=ctex(256,256,(q,w,h)=>{q.fillStyle='#b8b2a5';q.fillRect(0,0,w,h);speck(q,w,h,4500,40,8,60,78,2);q.strokeStyle='rgba(84,76,64,.45)';q.lineWidth=2;for(let i=0;i<=4;i++){q.beginPath();q.moveTo(i*64,0);q.lineTo(i*64,h);q.stroke();q.beginPath();q.moveTo(0,i*64);q.lineTo(w,i*64);q.stroke()}});
  TX.paversG=ctex(256,256,(q,w,h)=>{q.fillStyle='#7d7568';q.fillRect(0,0,w,h);for(let y=0;y<h;y+=16)for(let x=-((y/16)%2)*12;x<w;x+=24){q.fillStyle=`hsl(${30+rnd()*14},${8+rnd()*8}%,${50+rnd()*12}%)`;q.fillRect(x+1,y+1,22,14)}});
  TX.herring=ctex(256,256,(q,w,h)=>{q.fillStyle='#5a3a2e';q.fillRect(0,0,w,h);for(let y=-32;y<h+32;y+=16)for(let x=-32;x<w+32;x+=32){q.fillStyle=`hsl(${8+rnd()*10},${34+rnd()*12}%,${34+rnd()*10}%)`;q.save();q.translate(x+((y/16)&1)*16,y);q.rotate(PI/4);q.fillRect(0,0,22,10);q.restore();q.fillStyle=`hsl(${8+rnd()*10},${34+rnd()*12}%,${30+rnd()*10}%)`;q.save();q.translate(x+16+((y/16)&1)*16,y+6);q.rotate(-PI/4);q.fillRect(0,0,22,10);q.restore()}});
  TX.pavers=ctex(256,256,(q,w,h)=>{q.fillStyle='#5a3e30';q.fillRect(0,0,w,h);for(let y=0;y<h;y+=16)for(let x=-((y/16)%2)*16;x<w;x+=32){q.fillStyle=`hsl(${10+rnd()*12},${30+rnd()*12}%,${33+rnd()*12}%)`;q.fillRect(x+1,y+1,30,14)}});
  TX.sand=ctex(128,128,(q,w,h)=>{q.fillStyle='#cdb98e';q.fillRect(0,0,w,h);speck(q,w,h,2600,42,30,58,78,2)});
  TX.plank=ctex(128,128,(q,w,h)=>{for(let y=0;y<h;y+=16){q.fillStyle=shade('#8a6440',rnd()*24-12);q.fillRect(0,y,w,15);q.fillStyle='#3d2a18';q.fillRect(0,y+15,w,1)}});
  TX.dashH=ctex(64,8,(q)=>{q.clearRect(0,0,64,8);q.fillStyle='#e8c34a';q.fillRect(0,0,32,8)});
  TX.dashV=ctex(8,64,(q)=>{q.clearRect(0,0,8,64);q.fillStyle='#e8c34a';q.fillRect(0,0,8,32)});
  TX.field=ctex(256,400,(q,w,h)=>{const ez=h*.1;for(let i=0;i<10;i++){q.fillStyle=i%2?'#4a8a3a':'#56984a';q.fillRect(0,ez+i*(h-2*ez)/10,w,(h-2*ez)/10)}q.fillStyle='#7d1f2c';q.fillRect(0,0,w,ez);q.fillRect(0,h-ez,w,ez);q.strokeStyle='#f4f1e6';q.lineWidth=3;q.strokeRect(2,2,w-4,h-4);for(let i=0;i<=10;i++){const y=ez+i*(h-2*ez)/10;q.beginPath();q.moveTo(0,y);q.lineTo(w,y);q.stroke()}q.fillStyle='#e2b64c';q.font='bold 26px Graduate,Georgia';q.textAlign='center';q.textBaseline='middle';q.fillText('HAWKS',w/2,ez/2);q.save();q.translate(w/2,h-ez/2);q.rotate(PI);q.fillText('HAWKS',0,0);q.restore();q.fillStyle='#f4f1e6';q.font='bold 18px Archivo,Arial';for(let i=1;i<10;i++){const y=ez+i*(h-2*ez)/10;q.fillText(String((i<=5?i:10-i)*10),24,y+12)}});
  TX.track=ctex(128,128,(q,w,h)=>{q.fillStyle='#9a4a3a';q.fillRect(0,0,w,h);speck(q,w,h,2500,10,40,30,42,2)});
  TM.grass=SM({map:TX.grass,roughness:1});
  TM.grass2=SM({map:TX.grass2,roughness:1});
  TM.asphalt=SM({map:TX.asphalt,roughness:.95});
  TM.concrete=SM({map:TX.concrete,roughness:.95});
  TM.pavers=SM({map:TX.pavers,roughness:.9});
  TM.sand=SM({map:TX.sand,roughness:1});
  TM.plank=SM({map:TX.plank,roughness:.9});
  TM.field=SM({map:TX.field,roughness:1});
  TM.track=SM({map:TX.track,roughness:1});
  TM.dashH=new THREE.MeshBasicMaterial({map:TX.dashH,transparent:true,depthWrite:false});
  TM.dashV=new THREE.MeshBasicMaterial({map:TX.dashV,transparent:true,depthWrite:false});
  TM.white=new THREE.MeshBasicMaterial({color:0xf2efe6});
}
const FK={brick:['#8f3d2e','#6b2b20','#efe7d6','#2a3343'],brick2:['#6f4c3d','#523628','#e3d9c6','#2d3a36'],stone:['#cbbfa4','#a99c80','#f2ead8','#30394a'],siding:['#ece7db','#cfc8b8','#ffffff','#2f3a4a'],sidingP:['#efe6e3','#d3c7c4','#ffffff','#b84a76'],sidingT:['#e6ece9','#c9d1cd','#ffffff','#2f8a8a'],wood:['#7b5536','#5c3e26','#e6d3ae','#3b2a1c'],stucco:['#e7dcc4','#d1c3a5','#fbf6ea','#4a5a3a'],daapP:['#dcaaa5','#b88e8a','#f6efe8','#4a4e58'],daapG:['#a9c9b2','#86a890','#f2f6ee','#3a4a40'],daapB:['#a9bcd2','#8798b0','#eef2f8','#2f3a4a'],daapY:['#e8d6a6','#c8b688','#fbf6e6','#4a4430'],daapL:['#c9b0cf','#a890ad','#f6eef8','#3a3044'],brickO:['#a9573c','#84402c','#ece2d0','#2a3343'],brickB:['#c2a378','#9f845c','#efe6d2','#2f3a46'],brickL:['#6d3a2d','#4f2a20','#5b3328','#1b2028']};
const FMAT={},FMLIST=[];
// ================================================================ V68 facade depth: real 3D windows on every building — frames, mullions and glazing bars, sills,
// stone heads, shutters and reflective glass, laid exactly over each facade's painted window grid — plus profiled cornices with dentils, parapet
// copings, eaves and stone plinths swept around every footprint. Wall patterns are re-aligned per straight run of wall so no window wraps a
// corner. Details are instanced in 64 m chunks (one draw call per chunk) and fade out with distance, where the painted windows take over.
const FD={on:false,k:null,rec:{},bands:{},spans:{},ph:[],doors:[],ch:[]};
function fdRec(x,y,w,h){const r=FD.rec[FD.k];if(r&&w>3&&h>3)r.push([x,y,w,h])}
// window rectangles of a facade texture grouped into bands (a row of glass with mullions at the gaps); tile px, 512 px = 16 m
function fdBands(kind){if(FD.bands[kind])return FD.bands[kind];const R=(FD.rec[kind]||[]).slice().sort((a,b)=>a[1]-b[1]||a[0]-b[0]),rows=[],out=[];
  for(const r of R){let row=rows.find(q=>Math.abs(q.y-r[1])<=3&&Math.abs(q.h-r[3])<=3);if(!row)rows.push(row={y:r[1],h:r[3],rs:[]});row.rs.push(r)}
  for(const row of rows){row.rs.sort((a,b)=>a[0]-b[0]);let c=null;for(const r of row.rs){if(c&&r[0]-c.x1<=9){if(r[0]>c.x1+.5)c.g.push([c.x1,r[0]]);c.x1=Math.max(c.x1,r[0]+r[2])}else{if(c)out.push(c);c={x0:r[0],x1:r[0]+r[2],y:row.y,h:row.h,g:[]}}}if(c)out.push(c)}
  return FD.bands[kind]=out}
function fdSpans(kind){if(!kind)return[];if(FD.spans[kind])return FD.spans[kind];return FD.spans[kind]=fdBands(kind).map(b=>[b.x0/32,b.x1/32])}
// where along the tile a straight run of wall should start so that neither end cuts through a window
function fdShift(L,sp){if(!sp.length)return 0;const md=u=>((u%16)+16)%16,dist=u=>{const m=md(u);let d=99;for(const[a,b]of sp)for(const o of[-16,0,16]){const A=a+o,B=b+o;d=Math.min(d,m<A?A-m:m>B?m-B:-Math.min(m-A,B-m))}return d};
  let best=0,bs=1e9;for(let k=0;k<64;k++){const d=k*.25,e0=dist(d),e1=dist(d+L),c=(e0<.3?1:0)+(e1<.3?1:0),sc_=c*100-Math.min(e0,e1)-.05*Math.min(Math.abs(e0-e1),2);if(sc_<bs){bs=sc_;best=d}}return best}
function fdContour(pts){const q=[];for(const p of pts){const l=q[q.length-1];if(!l||Math.hypot(p[0]-l[0],p[1]-l[1])>1e-3)q.push(p)}if(q.length>2&&Math.hypot(q[0][0]-q[q.length-1][0],q[0][1]-q[q.length-1][1])<1e-3)q.pop();return q}
// the walls of one outline: per edge its start, length, direction, outward normal and texture offset u0 (metres)
function fdEdges(pts,kind,hole){const q=fdContour(pts),n=q.length,E=[];if(n<2)return E;
  for(let i=0;i<n;i++){const a=q[i],b=q[(i+1)%n],L=Math.hypot(b[0]-a[0],b[1]-a[1]);E.push({a,b,L,dx:(b[0]-a[0])/(L||1),dz:(b[1]-a[1])/(L||1),hole})}
  for(const e of E){let nx=-e.dz,nz=e.dx;const ins=inPoly((e.a[0]+e.b[0])/2+nx*.05,(e.a[1]+e.b[1])/2+nz*.05,q);if(hole?!ins:ins){nx=-nx;nz=-nz}e.nx=nx;e.nz=nz}
  const brk=E.map((e,i)=>{const p=E[(i+n-1)%n];return Math.acos(clamp(p.dx*e.dx+p.dz*e.dz,-1,1))>.26}),st=brk.indexOf(true),runs=[];
  if(st<0)runs.push(E.map((_,i)=>i));else{let cur=[];for(let k=0;k<n;k++){const i=(st+k)%n;if(brk[i]&&cur.length){runs.push(cur);cur=[]}cur.push(i)}if(cur.length)runs.push(cur)}
  const sp=fdSpans(kind);for(const r of runs){let L=0;for(const i of r)L+=E[i].L;const d=fdShift(L,sp);let t=0;for(const i of r){E[i].u0=t+d;t+=E[i].L}}
  return E}
// prism wall UVs: u runs along each straight run of wall from its aligned start; caps as before. Returns the wall edges for the 3D details.
function fdUV(g,p,o,side){const t0_=performance.now();const uv=g.attributes.uv,pos=g.attributes.position,key=(x,y)=>Math.round(x*1000)+','+Math.round(y*1000),EM=new Map(),kind=typeof side==='string'?side:null,EDG=[];
  const conts=[[p,0],...(o.holes||[]).filter(h=>h.length>=3).map(h=>[h,1])];
  for(const[c,hole]of conts){const E=fdEdges(c,kind,hole);for(const e of E){EDG.push(e);const ka=key(e.a[0],-e.a[1]),kb=key(e.b[0],-e.b[1]);EM.set(ka+'|'+kb,[e,0]);EM.set(kb+'|'+ka,[e,1])}}
  for(const gr of g.groups){if(gr.materialIndex!==1){for(let i=gr.start;i<gr.start+gr.count;i++)uv.setXY(i,uv.getX(i)/8,uv.getY(i)/8);continue}
    for(let i=gr.start;i<gr.start+gr.count;i+=3){const ks=[0,1,2].map(t=>key(pos.getX(i+t),pos.getY(i+t))),ds=[...new Set(ks)],hit=ds.length===2?EM.get(ds[0]+'|'+ds[1]):null;
      if(hit){const[e,rev]=hit,ka=rev?ds[1]:ds[0];for(let t=0;t<3;t++)uv.setXY(i+t,(ks[t]===ka?e.u0:e.u0+e.L)/16,(1-uv.getY(i+t)+(o.vo||0))/16)}
      else{let ex=1,ey=0;for(const[a,b2]of[[0,1],[1,2],[0,2]]){const dx=pos.getX(i+b2)-pos.getX(i+a),dy=pos.getY(i+b2)-pos.getY(i+a),l=Math.hypot(dx,dy);if(l>1e-4){ex=dx/l;ey=dy/l;break}}if(ex<-1e-6||(Math.abs(ex)<=1e-6&&ey<0)){ex=-ex;ey=-ey}for(let t=0;t<3;t++)uv.setXY(i+t,(pos.getX(i+t)*ex+pos.getY(i+t)*ey)/16,(1-uv.getY(i+t)+(o.vo||0))/16)}}}
  FD.tUV=(FD.tUV||0)+performance.now()-t0_;return EDG}
// box buildings (bld): the same aligned UVs on the four walls
function fdBoxUV(g,x0,z0,x1,z1,h,kind){const E=fdEdges([[x0,z0],[x1,z0],[x1,z1],[x0,z1]],kind,0),uv=g.attributes.uv,pos=g.attributes.position,cx=(x0+x1)/2,cz=(z0+z1)/2,F=[1,3,-1,-1,2,0];
  for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k,x=pos.getX(i)+cx,y=pos.getY(i),z=pos.getZ(i)+cz;if(F[f]<0){uv.setXY(i,x/16,z/16);continue}const e=E[F[f]];uv.setXY(i,(e.u0+(x-e.a[0])*e.dx+(z-e.a[1])*e.dz)/16,(y+h/2)/16)}
  uv.needsUpdate=true;fdPlace(E,0,h,kind,{},[cx,cz]);return g}
// remember a building's walls; the details are generated once the building has been settled onto the terrain
function fdPlace(E,y0,h,side,o,at){if(!FD.on||GFX!=='enhanced'||typeof side!=='string'||!E.length)return;const ph=new THREE.Object3D();if(at)ph.position.set(at[0],0,at[1]);
  ph.userData.fd={E,y0,h,kind:side,vo:o.vo||0,x:at?at[0]:0,z:at?at[1]:0};sc.add(ph);FD.ph.push(ph)}
// window and cornice styles: classic painted facades get white sash frames with glazing bars, sills, stone heads, shutters on the clapboard houses
const FDO={baldB:{fc:0xf4f1ea,sc:0xe2dccd,ft:.1,fd:.13,cross:1,sill:1,head:0xe2dccd,corn:'classic',cc:0xe2dccd,dent:1,plinth:0xd9d2c2},diet:{fc:0xf4f1ea,sc:0xf0ece2,ft:.11,fd:.13,cross:1,sill:1,corn:'classic',cc:0xf0ece2,plinth:0xe6e0d2},
  tucB:{fc:0xf3f0e8,ft:.08,fd:.12,cross:1,sill:1,sc:0xddd6c6,corn:'classic',cc:0xddd6c6},brickM:{fc:0xece8de,ft:.1,fd:.26,sill:1,sc:0xddd5c4,corn:'classic',cc:0xddd5c4,dent:1,plinth:0xcfc6b2,relief:1},spenc:{fc:0x4a4f55,sill:1,sc:0x7a7e83,fd:.12},
  daniels:{fc:0x2f2c2a,sill:1,sc:0xb9ad9c,fd:.12,cc:0xe6e3dc},dabney:{fc:0xf1efe9,sill:1,sc:0xb4b9bc,fd:.1,cc:0xb4b9bc},rhodes:{fc:0x6d5d48,fd:.17,ft:.08,cc:0xb3a284},erc2:{fc:0x8a2f22,fd:.12,corn:'classic',cc:0xd6c3a2},conc:{fc:0x55524b,sill:1,sc:0x8a867d,fd:.1,cc:0x9a958a},
  french:{fc:0xb9bcbc,sill:1,sc:0xd8d5cc,cc:0xe4e1d8},wpav:{fc:0xc8ccd0,sill:1,sc:0xe0e0dc,cc:0xe8e8e4},upav:{fc:0xd8dcdf,cc:0xeef0ef},glass:{fc:0xb8bec6,ft:.07,fd:.1,cc:0xb8bec6},morg:{fc:0x1d3442,ft:.06,fd:.15,cc:0x244452},
  rieve:{fc:0x3b3631,fd:.13,cc:0x8c8c86},lindL:{fc:0x5a5f66,cc:0xdfe2e4},lindD:{fc:0x3a3f46,cc:0x5d6268},stegB:{fc:0x2c3138,cc:0xb8b1a8,corn:null},langsam:{fc:0x3a332d,cc:0xcfc9bd},langT:{fc:0x2b2622,cc:0xcfc9bd},zinc:{fc:0x41464d,cc:0x3a3f46},
  eastG:{fc:0x2d3238,sill:1,sc:0x9aa0a6,cc:0x9aa0a6},eastB:{fc:0x2d3238,sill:1,sc:0x9aa0a6,cc:0x9aa0a6},eastD:{fc:0x2d3238,sill:1,sc:0x9aa0a6,cc:0x9aa0a6},wpavL:{corn:null},stone:{dent:1},panelG:{fc:0xcfd3d6,ft:.07,fd:.15,sill:1,sc:0xc4c8cb,cc:0xd8dbdd},panelW:{fc:0xe2e2de,ft:.07,fd:.13,sill:1,sc:0xd6d6d2,cc:0xe8e8e4},concT:{fc:0x6f6b63,fd:.12},cchT:{fc:0x2e3238},cchG:{fc:0x2e3238},diag:{fc:0x4a4e55}};
FDO.ccmR={fc:0x2e3238,ft:.06,fd:.1,cc:0xc9a68c,corn:'classic'};const FDS={};
function fdStyle(kind){if(FDS[kind])return FDS[kind];const K=FK[kind],hx=c=>parseInt(String(c).slice(1),16);let s;
  if(K){const sid=kind.startsWith('siding')||kind==='wood',br=kind.startsWith('brick')||kind==='stone';s={fc:hx(K[2]),sc:br?0xd8cfbb:hx(K[1]),ft:.11,fd:.13,cross:1,sill:1,head:br&&kind!=='stone'?0xd8cfbb:null,shut:sid||kind==='stucco'?hx(K[3]):null,corn:sid?'eave':'classic',cc:br?0xddd3bd:hx(K[2]),plinth:br?0xb5aa95:null,dent:kind==='brick'||kind==='brickB'||kind==='brickO'}}
  else s={fc:0x3b4047,sc:0x8c8f93,ft:.06,fd:.08,cross:0,sill:0,corn:'cope',cc:0x8e9298};
  return FDS[kind]=Object.assign(s,FDO[kind]||{})}
// ---------------------------------------------------------------- generation
const FDB=(()=>{const g=new THREE.BoxGeometry(1,1,1);g.setIndex(Array.from(g.index.array).slice(0,30));return g})(),FDP=new THREE.PlaneGeometry(1,1),_fq=new THREE.Quaternion(),_fe=new THREE.Euler(),_fm=new THREE.Matrix4(),_fp=new THREE.Vector3(),_fs=new THREE.Vector3(),_fc=new THREE.Color();
const PROF={classic:[[0,-.62],[.05,-.62],[.05,-.48],[.09,-.46],[.09,-.36],[.14,-.34],[.3,-.21],[.32,-.21],[.32,-.07],[.38,-.03],[.38,.08],[.3,.12],[0,.12]],
  eave:[[0,-.36],[.04,-.36],[.06,-.16],[.22,-.07],[.22,.06],[0,.08]],cope:[[0,-.16],[.055,-.16],[.055,.1],[.03,.13],[0,.13]],plinth:[[0,-.04],[.08,-.04],[.08,.52],[.05,.58],[0,.6]],belt:[[0,-.16],[.1,-.16],[.13,-.11],[.13,.08],[.09,.14],[0,.14]]};
function fdBuild(){const t0_=performance.now();FD.on=false;const PH=FD.ph;FD.ph=[];if(GFX!=='enhanced'||!PH.length){for(const ph of PH)ph.parent&&ph.parent.remove(ph);return}
  const CS=64,TR=new Map(),GL=new Map(),CO=new Map(),ck=(M,x,z,cs=CS)=>{const k=Math.floor(x/cs)+','+Math.floor(z/cs);let c=M.get(k);if(!c)M.set(k,c={a:[],x0:1e9,z0:1e9,x1:-1e9,z1:-1e9,y0:1e9,y1:-1e9});return c};
  const grow=(c,x,y,z)=>{if(x<c.x0)c.x0=x;if(x>c.x1)c.x1=x;if(z<c.z0)c.z0=z;if(z>c.z1)c.z1=z;if(y<c.y0)c.y0=y;if(y>c.y1)c.y1=y};
  // a box on a wall: centre on the wall line (x,z) shifted t along the wall, y up, out from the wall; size w (along), h, d (out)
  const box=(e,x,z,t,y,out,w,h,d,col)=>{const px=x+e.dx*t+e.nx*out,pz=z+e.dz*t+e.nz*out,c=ck(TR,px,pz);c.a.push(px,y,pz,Math.atan2(e.nx,e.nz),w,h,d,col);grow(c,px,y,pz)};
  const pane=(e,x,z,y,w,h)=>{const px=x+e.nx*.03,pz=z+e.nz*.03,c=ck(GL,px,pz);c.a.push(px,y,pz,Math.atan2(e.nx,e.nz),w,h);grow(c,px,y,pz)};
  let nWin=0,nPh=PH.length,nSkip=0,KC={};
  // settle every building block, then mark walls that a taller block of the same building stands on (no doubled windows or cornices there)
  const PD=[];for(const ph of PH){if(ph.parent!==sc){nSkip++;ph.parent&&ph.parent.remove(ph);continue}ph.updateMatrixWorld(true);const D=ph.userData.fd,dy=ph.matrixWorld.elements[13];sc.remove(ph);
    const poly=D.E.filter(e=>!e.hole).map(e=>e.a),bb=bbox(poly);PD.push({D,dy,poly,bb,yb:dy+D.y0,yt:dy+D.y0+D.h})}
  for(const A of PD)for(const e of A.D.E){const qx=(e.a[0]+e.b[0])/2-e.nx*.3,qz=(e.a[1]+e.b[1])/2-e.nz*.3;e.cov=PD.some(B=>B!==A&&B.yb<=A.yb+.3&&B.yt>=A.yt+.5&&qx>B.bb[0]&&qx<B.bb[2]&&qz>B.bb[1]&&qz<B.bb[3]&&inPoly(qx,qz,B.poly))}
  for(const Q of PD){const D=Q.D,dy=Q.dy,S=fdStyle(D.kind),bands=fdBands(D.kind),y0=D.y0,h=D.h;{const kk=D.kind;KC[kk]=(KC[kk]||0)+1}
    // windows
    for(const e of D.E){if(e.L<1.3||e.cov)continue;
      for(const b of bands){const bw=(b.x1-b.x0)/32,bx0=b.x0/32,bx1=b.x1/32,zt=(1-b.y/512)*16-D.vo,zb=(1-(b.y+b.h)/512)*16-D.vo,tall=zt-zb>3.3,wide=bw>3.3;
        for(let j=Math.floor((-zt)/16)-1;j<=Math.ceil((h-zb)/16)+1;j++){let z0=16*j+zb,z1=16*j+zt;if(tall){z0=Math.max(z0,.15);z1=Math.min(z1,h-.2)}if(z1-z0<.5||z0<.1||z1>h-.15)continue;
          for(let k=Math.floor((e.u0-bx1)/16);k<=Math.ceil((e.u0+e.L-bx0)/16);k++){let U0=16*k+bx0,U1=16*k+bx1;const lo=e.u0+.18,hi=e.u0+e.L-.18;if(wide){U0=Math.max(U0,lo);U1=Math.min(U1,hi);if(U1-U0<.7)continue}else if(U0<lo||U1>hi)continue;
            const tc=(U0+U1)/2-e.u0,cx=e.a[0]+e.dx*tc,cz=e.a[1]+e.dz*tc,W=U1-U0,H=z1-z0,yc=dy+y0+(z0+z1)/2;
            if(z0<4.6&&FD.doors.some(d=>Math.hypot(d[0]-cx,d[1]-cz)<W/2+2.2))continue;
            nWin++;const ft=S.ft,fd=S.fd,fc=S.fc;
            box(e,cx,cz,-W/2-ft/2,yc,fd/2,ft,H+2*ft,fd,fc);box(e,cx,cz,W/2+ft/2,yc,fd/2,ft,H+2*ft,fd,fc);
            box(e,cx,cz,0,yc+H/2+ft/2,fd/2,W,ft,fd,fc);box(e,cx,cz,0,yc-H/2-ft/2,fd/2,W,ft,fd,fc);
            for(const[g0,g1]of b.g){const gu=16*k+(g0+g1)/64;if(gu<=U0+.05||gu>=U1-.05)continue;box(e,cx,cz,gu-(U0+U1)/2,yc,fd*.35,Math.max(.045,(g1-g0)/32),H,fd*.7,fc)}
            if(S.cross&&!b.g.length&&W<2.6){box(e,cx,cz,0,yc,fd*.3,.05,H,fd*.55,fc);box(e,cx,cz,0,yc,fd*.3,W,.05,fd*.55,fc)}
            if(S.sill)box(e,cx,cz,0,yc-H/2-ft-.045,(fd+.09)/2,W+2*ft+.16,.09,fd+.09,S.sc);
            if(S.head)box(e,cx,cz,0,yc+H/2+ft+.1,.045,W+2*ft+.22,.2,.09,S.head);
            if(S.shut&&W<2.6)for(const sg of[-1,1])box(e,cx,cz,sg*(W/2+ft+.3),yc,.03,.5,H+.2,.06,S.shut);
            pane(e,cx,cz,yc,W,H)}}}}
    // cornice, coping or eave along the top; a stone plinth along the bottom of masonry buildings
    const top=dy+y0+h;
    if(S.corn&&y0+h>2.4&&h>=2)fdSweep(D.E,top,PROF[S.corn],S.cc,CO,ck,grow);
    if(S.plinth&&Math.abs(y0)<.05&&h>3)fdSweep(D.E,dy+y0,PROF.plinth,S.plinth,CO,ck,grow);
    // V121 masonry relief (Braunstein): stone belt courses at the base, the floor line and under the frieze, and brick pilasters standing proud between the 4 m bays
    if(S.relief&&h>8){const b0=dy+y0;for(const zz of[4.0,8.1,9.45,15.05])if(zz<h-.3)fdSweep(D.E,b0+zz,PROF.belt,S.cc,CO,ck,grow);
      for(const e of D.E){if(e.L<1.3||e.cov)continue;for(let k=Math.ceil(e.u0/4);k*4<=e.u0+e.L+.01;k++){const t=k*4-e.u0;if(t<.25||t>e.L-.25)continue;box(e,e.a[0],e.a[1],t,b0+4.15+(h-4.6)/2,.08,.34,h-4.6,.16,0x86402e)}
        box(e,e.a[0],e.a[1],.17,b0+h/2,.1,.34,h-.3,.2,0x86402e);box(e,e.a[0],e.a[1],e.L-.17,b0+h/2,.1,.34,h-.3,.2,0x86402e)}}
    if(S.dent&&S.corn==='classic'&&y0+h>2.4)for(const e of D.E){if(e.L<1.2||e.cov)continue;for(let t=.3;t<e.L-.3;t+=.27)box(e,e.a[0],e.a[1],t,top-.27,.125,.1,.11,.13,S.cc)}}
  // build the chunks
  const TM_=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.62,metalness:0,envMapIntensity:.5}),GM_=new THREE.MeshStandardMaterial({color:0x22303c,roughness:.04,metalness:.15,transparent:true,opacity:.4,depthWrite:false,envMapIntensity:1.7}),
    CM_=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.78,metalness:0,envMapIntensity:.55});let nT=0,nG=0,nC=0;
  // V121 chunks carry a world-space bounding sphere, so they can be frustum-culled (THREE r128 InstancedMesh defaults to frustumCulled=false)
  const sphere=c=>{const cx=(c.x0+c.x1)/2,cy=(c.y0+c.y1)/2,cz=(c.z0+c.z1)/2;return new THREE.Sphere(new THREE.Vector3(cx,cy,cz),Math.hypot(c.x1-c.x0,c.y1-c.y0,c.z1-c.z0)/2+3)};
  for(const c of TR.values()){const n=c.a.length/8;if(!n)continue;const g=FDB.clone();g.boundingSphere=sphere(c);const m=new THREE.InstancedMesh(g,TM_,n);
    for(let i=0;i<n;i++){const o=i*8,A=c.a;_fe.set(0,A[o+3],0);_fq.setFromEuler(_fe);_fp.set(A[o],A[o+1],A[o+2]);_fs.set(A[o+4],A[o+5],A[o+6]);_fm.compose(_fp,_fq,_fs);m.setMatrixAt(i,_fm);_fc.setHex(A[o+7]);m.setColorAt(i,_fc)}
    m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.castShadow=true;m.receiveShadow=true;m.userData.fd='t';m.frustumCulled=true;sc.add(m);FD.ch.push({m,x:g.boundingSphere.center.x,z:g.boundingSphere.center.z,r:g.boundingSphere.radius,t:'t'});nT+=n}
  for(const c of GL.values()){const n=c.a.length/6;if(!n)continue;const g=FDP.clone();g.boundingSphere=sphere(c);const m=new THREE.InstancedMesh(g,GM_,n);
    for(let i=0;i<n;i++){const o=i*6,A=c.a;_fe.set(0,A[o+3],0);_fq.setFromEuler(_fe);_fp.set(A[o],A[o+1],A[o+2]);_fs.set(A[o+4],A[o+5],1);_fm.compose(_fp,_fq,_fs);m.setMatrixAt(i,_fm)}
    m.instanceMatrix.needsUpdate=true;m.renderOrder=2;m.userData.fd='g';m.frustumCulled=true;sc.add(m);FD.ch.push({m,x:g.boundingSphere.center.x,z:g.boundingSphere.center.z,r:g.boundingSphere.radius,t:'g'});nG+=n}
  for(const c of CO.values()){if(!c.a.length)continue;const A=c.a,n=A.length/9,P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Float32Array(n*3);for(let i=0;i<n;i++){for(let k=0;k<3;k++){P[i*3+k]=A[i*9+k];N[i*3+k]=A[i*9+3+k];C[i*3+k]=A[i*9+6+k]}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));g.computeBoundingSphere();
    const m=new THREE.Mesh(g,CM_);m.castShadow=true;m.receiveShadow=true;m.userData.fd='c';m.userData.noMerge=1;sc.add(m);nC+=n/3}
  console.log('V68 facades: ms',Math.round(performance.now()-t0_),'uvms',Math.round(FD.tUV||0),'ph',nPh,'skip',nSkip,'windows',nWin,'trim boxes',nT,'panes',nG,'cornice tris',nC,'chunks',FD.ch.length)}
// sweep a cross-section profile [out, up] along a closed outline (mitred corners, flat-shaded faces, vertex colours)
function fdSweep(E,y,prof,col,M,ck,grow){const n=E.length;if(n<2)return;_fc.setHex(col);const cr=_fc.r,cg=_fc.g,cb=_fc.b;
  const mit=E.map((e,i)=>{const p=E[(i+n-1)%n];let mx=p.nx+e.nx,mz=p.nz+e.nz;const dd=1+p.nx*e.nx+p.nz*e.nz;if(dd<.25)return[e.nx,e.nz];mx/=dd;mz/=dd;const l=Math.hypot(mx,mz);if(l>2.6){mx*=2.6/l;mz*=2.6/l}return[mx,mz]});
  for(let i=0;i<n;i++){const e=E[i];if(e.L<.02||e.cov)continue;const j=(i+1)%n,ma=mit[i],mb=mit[j],c=ck(M,(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2,96),A=c.a;
    for(let k=0;k<prof.length-1;k++){const[o0,h0]=prof[k],[o1,h1]=prof[k+1],du=o1-o0,dv=h1-h0,l=Math.hypot(du,dv)||1,n2=[dv/l,-du/l],NX=e.nx*n2[0],NY=n2[1],NZ=e.nz*n2[0];
      const P=[[e.a[0]+ma[0]*o0,y+h0,e.a[1]+ma[1]*o0],[e.b[0]+mb[0]*o0,y+h0,e.b[1]+mb[1]*o0],[e.b[0]+mb[0]*o1,y+h1,e.b[1]+mb[1]*o1],[e.a[0]+ma[0]*o1,y+h1,e.a[1]+ma[1]*o1]];
      const ux=P[1][0]-P[0][0],uy=P[1][1]-P[0][1],uz=P[1][2]-P[0][2],vx=P[3][0]-P[0][0],vy=P[3][1]-P[0][1],vz=P[3][2]-P[0][2],flip=((uy*vz-uz*vy)*NX+(uz*vx-ux*vz)*NY+(ux*vy-uy*vx)*NZ)<0;
      for(const t of(flip?[0,2,1,0,3,2]:[0,1,2,0,2,3])){const q=P[t];A.push(q[0],q[1],q[2],NX,NY,NZ,cr,cg,cb);grow(c,q[0],q[1],q[2])}}}}
// distance culling: details fade to the painted textures beyond ~200 m; only nearby trim casts shadows
let FDF=0;function fdCull(){if(!FD.ch.length||(FDF++%6))return;const cx=cam.position.x,cz=cam.position.z;for(const c of FD.ch){const d=Math.hypot(c.x-cx,c.z-cz)-c.r;c.m.visible=d<(c.t==='g'?110:135);if(c.t==='t')c.m.castShadow=d<45}}

function facade(kind){FD.k=kind;FD.rec[kind]=[];const K=FK[kind],S=512,em=document.createElement('canvas');em.width=em.height=S;const qe=em.getContext('2d');qe.fillStyle='#000';qe.fillRect(0,0,S,S);
  const map=ctex(S,S,q=>{q.fillStyle=K[0];q.fillRect(0,0,S,S);
    if(kind.startsWith('brick')){q.fillStyle=K[1];q.fillRect(0,0,S,S);for(let y=0;y<S;y+=10){const off=((y/10)%2)*11;for(let x=-off;x<S;x+=22){q.fillStyle=shade(K[0],rnd()*18-9);q.fillRect(x+1,y+1,20,8)}}}
    else if(kind==='stone'){q.fillStyle=K[1];q.fillRect(0,0,S,S);for(let y=0;y<S;y+=32)for(let x=-((y/32)%2)*32;x<S;x+=64){q.fillStyle=shade(K[0],rnd()*14-7);q.fillRect(x+2,y+2,60,28)}}
    else if(kind.startsWith('siding')){for(let y=0;y<S;y+=12){q.fillStyle=shade(K[0],-16);q.fillRect(0,y+10,S,2)}}
    else if(kind==='wood'){for(let x=0;x<S;x+=16){q.fillStyle=shade(K[0],rnd()*18-9);q.fillRect(x+1,0,14,S)}}
    else speck(q,S,S,7000,40,22,76,88,3);
    for(let ty=0;ty<4;ty++)for(let tx=0;tx<4;tx++){const x=tx*128,y=ty*128,wx=x+40,wy=y+26,ww=48,wh=74;fdRec(wx,wy,ww,wh);
      if(kind.startsWith('siding')||kind==='stucco'){q.fillStyle=K[3];q.fillRect(wx-22,wy-4,15,wh+8);q.fillRect(wx+ww+7,wy-4,15,wh+8)}
      q.fillStyle=K[2];q.fillRect(wx-6,wy-6,ww+12,wh+12);q.fillStyle=K[1];q.fillRect(wx-9,wy+wh+5,ww+18,7);
      const g=q.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,'#48607a');g.addColorStop(1,'#141c28');q.fillStyle=g;q.fillRect(wx,wy,ww,wh);
      if(kind==='stone'){q.fillStyle=K[2];q.beginPath();q.arc(wx+ww/2,wy,ww/2+6,PI,0);q.fill();q.fillStyle='#3a4e66';q.beginPath();q.arc(wx+ww/2,wy,ww/2,PI,0);q.fill()}
      q.fillStyle=K[2];q.fillRect(wx+ww/2-2,wy,4,wh);q.fillRect(wx,wy+wh/2-2,ww,4);
      q.fillStyle='rgba(255,255,255,.13)';q.beginPath();q.moveTo(wx+4,wy+wh-6);q.lineTo(wx+ww*.5,wy+6);q.lineTo(wx+ww*.5+10,wy+6);q.lineTo(wx+14,wy+wh-6);q.fill();
      if(rnd()<.55){qe.fillStyle=rnd()<.82?'#ffc670':'#c0dcff';qe.fillRect(wx,wy,ww,wh);if(kind==='stone'){qe.beginPath();qe.arc(wx+ww/2,wy,ww/2,PI,0);qe.fill()}qe.fillStyle='#000';qe.fillRect(wx+ww/2-2,wy,4,wh);qe.fillRect(wx,wy+wh/2-2,ww,4)}
    }});
  const emap=new THREE.CanvasTexture(em);emap.wrapS=emap.wrapT=THREE.RepeatWrapping;
  const m=SM({map,emissiveMap:emap,emissive:0xffffff,emissiveIntensity:0,roughness:.9});FMLIST.push(m);return m}
const fm=k=>FMAT[k]||(FMAT[k]=(typeof FX2!=='undefined'&&FX2[k])?facade2(k):facade(k));
// V120 signs are cached by content: identical signs (EXIT, KITCHEN, BACKYARD, house letters... in all 70 interiors) share one texture,
// material and geometry instead of each making its own 1024-px canvas. Canvas width now follows the sign's size (≈420 px/m, 384–1024).
const SIGNC={},SIGNG={};
function signMesh(text,w,h,bg,fg,font){const W=Math.min(512,   /* V296 was 1024: a quarter of the graphics memory */Math.max(384,Math.round(w*420/64)*64)),H=Math.max(64,Math.round(W*h/w)),k=[text,W,H,bg,fg,font].join('\u0001');
  let mat=SIGNC[k];if(!mat){const c=document.createElement('canvas');c.width=W;c.height=H;const q=c.getContext('2d');q.fillStyle=bg;q.fillRect(0,0,W,H);const lw=Math.max(4*W/1024,H*.06,2);q.strokeStyle=fg;q.lineWidth=lw;q.strokeRect(lw*1.5,lw*1.5,W-lw*3,H-lw*3);q.fillStyle=fg;let fs=Math.floor(H*.66);const F=s=>`bold ${s}px ${font||'Graduate'},Georgia,serif`;q.font=F(fs);while(q.measureText(text).width>W*.9&&fs>8){fs-=2;q.font=F(fs)}q.textAlign='center';q.textBaseline='middle';q.fillText(text,W/2,H/2+fs*.06);const t=new THREE.CanvasTexture(c);t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());mat=SIGNC[k]=new THREE.MeshBasicMaterial({map:t})}
  const gk=w+'x'+h;return new THREE.Mesh(SIGNG[gk]||(SIGNG[gk]=new THREE.PlaneGeometry(w,h)),mat)}

