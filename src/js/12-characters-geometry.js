// ================================================================ CHARACTERS
const PROPS=[];
const HOUSE={asr:{L:'ΑΣΡ',shirt:0x7d1f2c,lc:'#e2b64c'},kto:{L:'ΚΘΩ',shirt:0x1f2c52,lc:'#e2b64c'},opd:{L:'ΩΨΔ',shirt:0x2d3a36,lc:'#f2efe6'},kan:{L:'ΚΑΝ',shirt:0x6a4428,lc:'#f2c230'},dlp:{L:'ΔΛΦ',shirt:0xb84a76,lc:'#ffffff'},tz:{L:'ΘΖ',shirt:0x2f8a8a,lc:'#ffffff'},lxa:{L:'ΛΧΑ',shirt:0x1f6f3a,lc:'#5b2a86',so:'#f2c230'},gwz:{L:'ΓΩΖ',shirt:0x5a3a6a,lc:'#e2b64c'},tchi:{L:'ΘΧ',shirt:0x9a2a2a,lc:'#f2efe6'},pkp:{L:'ΠΚΦ',shirt:0xc8a43a,lc:'#1f2c52'},pka:{L:'ΠΚΑ',shirt:0x8a1f2c,lc:'#e2b64c'},sae:{L:'ΣΑΕ',shirt:0x6a4a9a,lc:'#e2b64c'},ksig:{L:'ΚΣ',shirt:0x2a6a3a,lc:'#f2efe6'},kkg:{L:'ΚΚΓ',shirt:0x3a6fa8,lc:'#f2efe6'},tri:{L:'Δ',shirt:0x23408a,lc:'#e2b64c'},tpa:{L:'ΘΦΑ',shirt:0x2f4f8f,lc:'#e2b64c'},sam:{L:'ΣΑΜ',shirt:0x4a2a7a,lc:'#f2efe6'},chio:{L:'ΧΩ',shirt:0xa8203a,lc:'#f2d98a'},stau:{L:'ΣΤ',shirt:0x3a5a6a,lc:'#e2b64c'},phimu:{L:'ΦΜ',shirt:0xd98aa4,lc:'#ffffff'},kd:{L:'ΚΔ',shirt:0x6a7a3a,lc:'#ffffff'},atht:{L:'ΑΘΤ',shirt:0xd9772a,lc:'#ffffff'},btp:{L:'ΒΘΠ',shirt:0x2a5a9a,lc:'#f2b8c8'},dtd:{L:'ΔΤΔ',shirt:0x6a3a9a,lc:'#e2b64c'},psr:{L:'ΦΣΡ',shirt:0x7a2a5a,lc:'#e2b64c'},pdt:{L:'ΦΔΘ',shirt:0xc8602a,lc:'#f2efe6'}};
const LETM={};function letMat(h){if(LETM[h])return LETM[h];const H=HOUSE[h],c=document.createElement('canvas');c.width=128;c.height=64;const q=c.getContext('2d');q.font='bold '+(H.so?42:46)+'px "Times New Roman",Georgia,serif';q.textAlign='center';q.textBaseline='middle';q.lineJoin='round';q.lineWidth=H.so?9:5;q.strokeStyle=H.so||'rgba(0,0,0,.45)';q.strokeText(H.L,64,34);q.fillStyle=H.lc;q.fillText(H.L,64,34);const t=new THREE.CanvasTexture(c);return LETM[h]=new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false})}
const PG0={leg:new THREE.BoxGeometry(.21,.86,.24).translate(0,-.43,0),torso:new THREE.BoxGeometry(.54,.68,.3),arm:new THREE.BoxGeometry(.15,.62,.17).translate(0,-.31,0),head:new THREE.SphereGeometry(.2,14,10),hair:new THREE.SphereGeometry(.214,14,10,0,TAU,0,PI*.5),long:new THREE.BoxGeometry(.38,.44,.12),cap:new THREE.CylinderGeometry(.22,.23,.13,12),brim:new THREE.BoxGeometry(.28,.03,.16),eye:new THREE.BoxGeometry(.05,.05,.02),pin:new THREE.BoxGeometry(.08,.08,.02)};
const PG=Object.assign(PG0,{curl:new THREE.SphereGeometry(.085,7,6),afro:new THREE.SphereGeometry(.29,12,10),bkt:new THREE.CylinderGeometry(.226,.226,.11,14),gh:new THREE.BoxGeometry(.11,.014,.02),gv:new THREE.BoxGeometry(.014,.08,.02),gb:new THREE.BoxGeometry(.05,.014,.02)});
const CURLP=[[.2,1.88,0],[-.2,1.88,0],[.15,1.9,-.14],[-.15,1.9,-.14],[0,1.9,-.2],[.16,1.96,.04],[-.16,1.96,.04],[0,2.0,0],[.09,1.99,-.09],[-.09,1.99,-.09],[.1,1.98,.09],[-.1,1.98,.09],[0,1.96,.14],[.2,1.8,-.08],[-.2,1.8,-.08]];
PG.mouth=new THREE.BoxGeometry(.085,.022,.02);PG.bean=[0,1,2,3].map(i=>new THREE.SphereGeometry(.228,8,6,i*PI/2,PI/2,0,PI*.5));PG.stem=new THREE.CylinderGeometry(.016,.016,.14,6);PG.blade=new THREE.BoxGeometry(.46,.018,.08);
const PMAT=SM({vertexColors:true,roughness:.72}),PMATM=SM({vertexColors:true,color:0xb08a50,roughness:.35,metalness:.7});
// ================================================================ V66 characters: rounded stylised bodies (tapered torso with collar and belt, sleeves and forearms with hands,
// trousers with shoes) and faces with brows, eye whites and pupils, nose and ears. Same rig and pivots, so every animation still works.
function roundBox(w,h,d,r,seg=3){const g=new THREE.BoxGeometry(w,h,d,seg*2,seg*2,seg*2),p=g.attributes.position,nm=g.attributes.normal,hw=w/2-r,hh=h/2-r,hd=d/2-r;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),cx=clamp(x,-hw,hw),cy=clamp(y,-hh,hh),cz=clamp(z,-hd,hd);let nx=x-cx,ny=y-cy,nz=z-cz;const l=Math.hypot(nx,ny,nz);
    if(l>1e-6){nx/=l;ny/=l;nz/=l;p.setXYZ(i,cx+nx*r,cy+ny*r,cz+nz*r);nm.setXYZ(i,nx,ny,nz)}}return g}
function taper(g,f){const p=g.attributes.position,n=g.attributes.normal;for(let i=0;i<p.count;i++){const y=p.getY(i),s=f(y);p.setX(i,p.getX(i)*s[0]);p.setZ(i,p.getZ(i)*s[1]);const nx=n.getX(i)/s[0],ny=n.getY(i),nz=n.getZ(i)/s[1],l=Math.hypot(nx,ny,nz)||1;n.setXYZ(i,nx/l,ny/l,nz/l)}return g}
function scaleN(g,f){const p=g.attributes.position,n=g.attributes.normal;for(let i=0;i<p.count;i++){const s=f(p.getX(i),p.getY(i),p.getZ(i));p.setXYZ(i,p.getX(i)*s[0],p.getY(i)*s[1],p.getZ(i)*s[2]);const nx=n.getX(i)/s[0],ny=n.getY(i)/s[1],nz=n.getZ(i)/s[2],l=Math.hypot(nx,ny,nz)||1;n.setXYZ(i,nx/l,ny/l,nz/l)}return g}
if(GFX==='enhanced'){
  // torso: broader at the shoulders, narrower at the waist, rounded edges; front stays at z=.15 for the letters and pin
  PG.torso=taper(roundBox(.54,.68,.3,.085,3),y=>{const t=(y+.34)/.68;return[.84+.18*Math.min(1,t*1.25),.9+.1*t]});
  PG.head=scaleN(new THREE.SphereGeometry(.2,24,18),(x,y,z)=>{const k=y<0?1-.16*(-y/.2):1;return[k*.98,1.07,k]});
  PG.hair=scaleN(new THREE.SphereGeometry(.216,24,12,0,TAU,0,PI*.52),()=>[1,1.05,1]);
  PG.eyeW=new THREE.SphereGeometry(.037,12,8).scale(1,1.1,.42);PG.pupil=new THREE.SphereGeometry(.019,10,6).scale(1,1.15,.4);PG.glint=new THREE.SphereGeometry(.007,6,4).scale(1,1,.3);
  PG.brow=roundBox(.072,.017,.022,.007,1);PG.nose=roundBox(.046,.072,.05,.02,2);PG.ear=new THREE.SphereGeometry(.046,10,8).scale(.48,1,.78);
  PG.neck=new THREE.CylinderGeometry(.074,.082,.14,14);PG.collar=new THREE.TorusGeometry(.108,.026,6,18).rotateX(PI/2);PG.belt=roundBox(.48,.055,.31,.022,1);PG.buckle=roundBox(.06,.045,.02,.006,1);
  PG.long=roundBox(.38,.46,.12,.05,2);PG.cap=new THREE.CylinderGeometry(.222,.232,.13,20);PG.brim=roundBox(.28,.03,.17,.012,1);PG.mouth=roundBox(.085,.02,.02,.008,1);
  // limbs: arm = sleeve over the shoulder, bare forearm, hand; leg = trouser leg and a shoe with a sole
  PG.sleeve=roundBox(.155,.4,.175,.065,2).translate(0,-.19,0);PG.fore=new THREE.CylinderGeometry(.056,.064,.2,12).translate(0,-.47,0);PG.hand=roundBox(.085,.11,.1,.04,2).translate(0,-.6,.005);
  PG.pleg=roundBox(.21,.8,.24,.07,2).translate(0,-.4,0);PG.shoe=roundBox(.22,.1,.33,.045,2).translate(0,-.83,.045);PG.sole=roundBox(.225,.03,.335,.012,1).translate(0,-.875,.045)}
const LIMBC={},SHOES=[0x232428,0xe9e7e1,0x5a3a26,0x2c2f3a,0xe9e7e1];
function limbG(kind,c1,c2){const k=kind+'|'+c1+'|'+c2;if(LIMBC[k])return LIMBC[k];
  if(GFX!=='enhanced')return LIMBC[k]=cgeo(kind==='arm'?PG.arm:PG.leg,kind,c1);
  return LIMBC[k]=kind==='arm'?mergeParts([[PG.sleeve,c1,0,0,0],[PG.fore,c2,0,0,0],[PG.hand,c2,0,0,0]]):mergeParts([[PG.pleg,c1,0,0,0],[PG.shoe,c2,0,0,0],[PG.sole,c2===0xe9e7e1?0xb9b6ae:0x141414,0,0,0]])}
// the face and the small body parts, added to the merged head-and-torso geometry
function faceParts(parts,o){if(GFX!=='enhanced'){if(!o.metal&&!o.stone){parts.push([PG.eye,0x161616,-.07,1.8,.19],[PG.eye,0x161616,.07,1.8,.19]);if(!o.noMouth)parts.push([PG.mouth,0x5a1e1e,0,1.715,.188])}return}
  const sk=o.skin,dk=c=>{const q=new THREE.Color(c);q.multiplyScalar(.78);return q.getHex()};
  parts.push([PG.neck,sk,0,1.6,0],[PG.ear,sk,-.197,1.79,-.005],[PG.ear,sk,.197,1.79,-.005],[PG.nose,sk,0,1.77,.194],[PG.collar,dk(o.shirt),0,1.548,0],[PG.belt,0x2a231e,0,.9,0],[PG.buckle,0xb9a36a,0,.9,.158]);
  if(!o.metal&&!o.stone){for(const s of[-1,1]){parts.push([PG.eyeW,0xf4f1ea,s*.072,1.805,.178],[PG.pupil,0x2a1d14,s*.07,1.802,.192],[PG.glint,0xffffff,s*.064,1.81,.199]);if(!o.prop&&!o.cap)parts.push([PG.brow,o.hair,s*.073,1.858,.181,0])}
    if(!o.noMouth)parts.push([PG.mouth,0x7a2c2c,0,1.712,.191])}}

function colorize(g,c){const col=new THREE.Color(c),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=col.r;a[i*3+1]=col.g;a[i*3+2]=col.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g}
const CGC={};function cgeo(geo,key,c){const k=key+'|'+c;return CGC[k]||(CGC[k]=colorize(geo.index?geo.toNonIndexed():geo.clone(),c))}
function mergeParts(parts){const gs=parts.map(([geo,c,x,y,z,ry])=>{const g=geo.index?geo.toNonIndexed():geo.clone();if(ry)g.rotateY(ry);g.translate(x,y,z);return colorize(g,c)});let n=0;gs.forEach(g=>n+=g.attributes.position.count);const P_=new Float32Array(n*3),N_=new Float32Array(n*3),C_=new Float32Array(n*3);let o=0;for(const g of gs){const c=g.attributes.position.count;P_.set(g.attributes.position.array,o*3);N_.set(g.attributes.normal.array,o*3);C_.set(g.attributes.color.array,o*3);o+=c;g.dispose()}const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(P_,3));G.setAttribute('normal',new THREE.BufferAttribute(N_,3));G.setAttribute('color',new THREE.BufferAttribute(C_,3));G.computeBoundingSphere();return G}
const BODYC={};
// ================================================================ V67 characters: sculpted, skinned, stylised people with a real skeleton (hips, spine, chest, neck, head,
// shoulders, elbows, hands, hips, knees, feet). Heads are sculpted (brow ridge, eye sockets, nose, cheekbones, lips, jaw, chin) and painted by a shared
// face atlas (lash lines, brows, lips, creases, blush) with live eyes (iris, pupil, catch-lights, blinking, looking around) and mouth shapes (smile, talking).
// Hair is a painted hairline plus chunky clumps; hands have fingers; sneakers have soles, laces and stripes. One draw call per person (two LOD levels),
// per-person palette, stylised skin shading (warm scatter, rim light). Knock-downs are verlet ragdolls; bodies lean and lag with spring physics.
const BN=['hips','spine','chest','neck','head','aL','eL','hL','aR','eR','hR','lL','kL','fL','lR','kR','fR'],BI={};BN.forEach((n,i)=>BI[n]=i);
const BPAR={hips:null,spine:'hips',chest:'spine',neck:'chest',head:'neck',aL:'chest',eL:'aL',hL:'eL',aR:'chest',eR:'aR',hR:'eR',lL:'hips',kL:'lL',fL:'kL',lR:'hips',kR:'lR',fR:'kR'};
/* V306 Enhanced proportions (less toy-like): the head bone is scaled down (mkPersonX), shoulders and torso are narrowed, arms and neck are slimmed.
   Done as a warp of the finished body (chrWarp, per skin weight) plus matching arm bone positions, so every hand-tuned shape and pose still works.
   The head is scaled by its bone, so its geometry (and the shader's hair and face detail) is untouched; seams and fabric follow the warped torso,
   which moves them by about a centimetre. (A separate rest-position attribute would cost ~50 MB of GPU memory for that.) */
const CHR_OLD=(()=>{try{return /[?&]oldchars\b/.test(location.search)}catch(e){return false}})();
const CHR_PROP=CHR_OLD?{hs:1,lift:0,kx:1,ta:1,nk:1,hand:1}:{hs:.8,lift:-.03,kx:.92,ta:.87,nk:.88,hand:.82};
function bonePos(fem){const b=bonePos0(fem);if(GFX==='enhanced'){const k=CHR_PROP.kx;for(const n of['aL','eL','hL','aR','eR','hR'])b[n]=[b[n][0]*k,b[n][1],b[n][2]]}return b}
function bonePos0(fem){const sx=fem?.29:.35,lx=fem?.1:.108;return{hips:[0,.92,0],spine:[0,1.1,0],chest:[0,1.32,0],neck:[0,1.555,-.01],head:[0,1.66,0],aL:[-sx,1.47,-.01],eL:[-sx,1.19,-.025],hL:[-sx,.955,0],aR:[sx,1.47,-.01],eR:[sx,1.19,-.025],hR:[sx,.955,0],lL:[-lx,.9,0],kL:[-lx,.5,.012],fL:[-lx,.1,-.01],lR:[lx,.9,0],kR:[lx,.5,.012],fR:[lx,.1,-.01]}}
// palette slots (rgb + roughness); 24..27 are per-person parameters for the shader
const PS={skin:0,hair:1,shirt:2,sleeve:3,pants:4,shoe:5,sole:6,eyeW:7,iris:8,dark:9,lip:10,belt:11,metal:12,b0:13,b1:14,b2:15,b3:16,cap:17,glass:18,brow:19,acc:20,white:21,sacc:22,lace:23};
const NPAL=28,CHR_RIM={value:.32},CHR_RIMS={value:.45},CHR_RIMC={value:new THREE.Color(.5,.68,.95)},CHR_BNC={value:new THREE.Color(.1,.065,.035)},CHR_SKY={value:new THREE.Color(.03,.05,.08)};
// ---------------------------------------------------------------- geometry accumulation: positions, normals, baked shading, palette ids, head directions, skin weights
function GB(){return{p:[],n:[],c:[],id:[],hd:[],si:[],sw:[],ix:[],v:0}}
function gAdd(G,g,pid,wf,sf){const P=g.attributes.position,N=g.attributes.normal,H=g.userData.hd,o=G.v;
  for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i),nx=N.getX(i),ny=N.getY(i),nz=N.getZ(i);G.p.push(x,y,z);G.n.push(nx,ny,nz);const s=sf?sf(x,y,z,nx,ny,nz):1;G.c.push(s,s,s);
    G.id.push(typeof pid==='function'?pid(x,y,z,nx,ny,nz):pid);if(H)G.hd.push(H[i*3],H[i*3+1],H[i*3+2]);else G.hd.push(0,0,0);
    const w=wf(x,y,z);G.si.push(w[0],w.length>2?w[2]:0,0,0);G.sw.push(w.length>2?w[1]:1,w.length>2?1-w[1]:0,0,0)}
  if(g.index){const I=g.index.array;for(let k=0;k<I.length;k++)G.ix.push(I[k]+o)}else for(let k=0;k<P.count;k++)G.ix.push(k+o);G.v+=P.count}
function chrWarp(G){if(GFX!=='enhanced'||!G.warp)return;const C=CHR_PROP,sx=G.fem?.29:.35,p=G.p,n=G.n,si=G.si,sw=G.sw,AZ=-.012,NZ=-.015;
  const kxy=y=>1-(1-C.kx)*sm(1.08,1.38,y);
  for(let i=0,v=0;i<p.length;i+=3,v+=4){const x=p[i],y=p[i+1],z=p[i+2];let X=0,Y=0,Z=0,fx=0,W=0;
    for(let j=0;j<2;j++){const w=sw[v+j];if(!w)continue;const b=BN[si[v+j]];let tx=x,ty=y,tz=z,f=1;
      if(b==='spine'||b==='chest'){const k=kxy(y);tx=x*k;f=1/k}
      else if(b==='neck'){tx=x*C.nk;tz=NZ+(z-NZ)*C.nk}
      else if(b==='hL'||b==='hR'){const ax=(b[1]==='L'?-1:1)*sx,WY=.955;tx=ax*C.kx+(x-ax)*C.hand;ty=WY+(y-WY)*C.hand;tz=z*C.hand}   /* hands: scaled about the wrist */
      else if(b[0]==='a'||b[0]==='e'){const ax=(b[1]==='L'?-1:1)*sx;tx=ax*C.kx+(x-ax)*C.ta;tz=AZ+(z-AZ)*C.ta}
      X+=tx*w;Y+=ty*w;Z+=tz*w;fx+=f*w;W+=w}
    if(W>0){p[i]=X/W;p[i+1]=Y/W;p[i+2]=Z/W;const k=fx/W;if(k!==1){const a=n[i]*k,b2=n[i+1],c=n[i+2],l=Math.hypot(a,b2,c)||1;n[i]=a/l;n[i+1]=b2/l;n[i+2]=c/l}}}}
function gBuild(G){chrWarp(G);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(G.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(G.n,3));g.setAttribute('color',new THREE.Float32BufferAttribute(G.c,3));
  g.setAttribute('pid',new THREE.Float32BufferAttribute(G.id,1));g.setAttribute('hd',new THREE.Float32BufferAttribute(G.hd,3));g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(G.si,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(G.sw,4));g.setIndex(G.ix);
  g.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,1,0),2.4);return g}
const W1=b=>()=>[BI[b]],Wb=(a,b,t)=>[BI[a],1-clamp(t,0,1),BI[b]];
const sm=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const G2=(x,y,cx,cy,sx,sy)=>Math.exp(-((x-cx)*(x-cx))/(sx*sx)-((y-cy)*(y-cy))/(sy*sy));
const at=(g,x,y,z)=>g.translate(x,y,z);
const v3n=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]},v3x=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// a welded tube through rings {y,cx,cz,rx,rf,rb} (superellipse section, rf/rb = front/back depth), optional dome caps and a radial displacement d(y,angle)
function tube(R,seg=16,e=2.2,cap0=0,cap1=0,disp=null){const n0=R.length,dir=Math.sign(R[n0-1].y-R[0].y)||1,dr=(r,s,dy)=>({y:r.y+dy,cx:r.cx,cz:r.cz,rx:r.rx*s,rf:r.rf*s,rb:r.rb*s,cap:1});
  let pre=[],post=[],p0=null,p1=null;
  if(cap1){const r=R[n0-1],h=Math.min(r.rx,(r.rf+r.rb)/2)*(cap1===2?.4:.9)*dir;post=[dr(r,.84,h*.5),dr(r,.52,h*.85)];p1=[r.cx,r.y+h,r.cz]}
  if(cap0){const r=R[0],h=-Math.min(r.rx,(r.rf+r.rb)/2)*(cap0===2?.4:.9)*dir;pre=[dr(r,.52,h*.85),dr(r,.84,h*.5)];p0=[r.cx,r.y+h,r.cz]}
  const all=[...pre,...R,...post],pos=[],ix=[],N=all.length,fl=dir<0,T=(a,b,c)=>fl?ix.push(a,c,b):ix.push(a,b,c);
  for(const r of all)for(let k=0;k<seg;k++){const a=k/seg*TAU,c=Math.cos(a),s=Math.sin(a),sx=Math.sign(c)*Math.pow(Math.abs(c),2/e),sz=Math.sign(s)*Math.pow(Math.abs(s),2/e),d=disp&&!r.cap?disp(r.y,a,r):0;
    pos.push(r.cx+sx*(r.rx+d),r.y,r.cz+sz*((s>0?r.rf:r.rb)+d))}
  for(let j=0;j<N-1;j++)for(let k=0;k<seg;k++){const a=j*seg+k,a1=j*seg+(k+1)%seg,b=a+seg,b1=a1+seg;T(a,b,a1);T(a1,b,b1)}
  if(p1){const p=pos.length/3,L=(N-1)*seg;pos.push(...p1);for(let k=0;k<seg;k++)T(L+k,p,L+(k+1)%seg)}
  if(p0){const p=pos.length/3;pos.push(...p0);for(let k=0;k<seg;k++)T(k,(k+1)%seg,p)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();return g}
// a tapered hair clump along a quadratic curve; its flat side faces away from cen
function clumpGeo(P0,P1,P2,w,th,cen,seg=5,sides=6,tk=.95){const pos=[],ix=[],B=t=>{const u=1-t;return[0,1,2].map(i=>u*u*P0[i]+2*u*t*P1[i]+t*t*P2[i])},D=t=>{const u=1-t;return[0,1,2].map(i=>2*u*(P1[i]-P0[i])+2*t*(P2[i]-P1[i]))};let T;
  for(let i=0;i<=seg;i++){const t=i/seg,b=B(t);T=v3n(D(t));let o=v3n([b[0]-cen[0],b[1]-cen[1],b[2]-cen[2]]),sd=v3x(T,o);if(Math.hypot(...sd)<1e-3)sd=v3x(T,[1,0,0]);sd=v3n(sd);const up=v3x(sd,T),tp=Math.pow(1-t*tk,.75),W=w*tp,H=th*tp;
    for(let k=0;k<sides;k++){const a=k/sides*TAU,ca=Math.cos(a),sa=Math.sin(a);pos.push(b[0]+sd[0]*ca*W+up[0]*sa*H,b[1]+sd[1]*ca*W+up[1]*sa*H,b[2]+sd[2]*ca*W+up[2]*sa*H)}}
  for(let i=0;i<seg;i++)for(let k=0;k<sides;k++){const a=i*sides+k,a1=i*sides+(k+1)%sides,b=a+sides,b1=a1+sides;ix.push(a,b,a1,a1,b,b1)}
  const p=pos.length/3,L=seg*sides;pos.push(P2[0]+T[0]*w*.25,P2[1]+T[1]*w*.25,P2[2]+T[2]*w*.25);for(let k=0;k<sides;k++)ix.push(L+k,p,L+(k+1)%sides);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();return g}
// ---------------------------------------------------------------- the sculpted head (unit direction -> position); the face atlas uses the same (ux,uy) space
const HC=1.79,HR=.19,EYEX=.36,EYEY=.088;
/* V306 smaller, less cartoon eyes: the openings, the eyeballs and the painted lash lines all shrink by EYF around each eye's centre, so they still line up */
const EYF=CHR_OLD?1:.84;
const EYA=fem=>(fem?[.2,.108,.08]:[.19,.105,.078]).map(v=>v*EYF);   // almond eye opening: half width, half heights above / below
function eyeA(ux,uy,fem){const[aw,at,ab]=EYA(fem),lx=(Math.abs(ux)-EYEX)/aw,yy=uy-(EYEY+.12*(Math.abs(ux)-EYEX)),ly=yy/(yy>0?at:ab);return[lx*lx+ly*ly,yy]}
function headPt(ux,uy,uz,fem,fv=0,noEye=0){let x=ux*(fem?.86:.875),y=uy*1.12,z=uz;
  if(uz<0)z*=1+.07*Math.min(1,-uz*1.5)*sm(-.6,.3,uy);
  if(uy<0){const t=-uy,jaw=fem?1-.3*Math.pow(t,1.4):1-.1*sm(0,.55,t)-(.24+fv*.04)*sm(.55,1,t);x*=jaw;if(uz<.2)z*=1-.08*sm(.3,1,t)}
  if(uz>0){z*=1-.075*sm(.45,1,uz);let dz=0;const F=sm(.2,.6,uz);
    dz+=(fem?.022:.04)*G2(ux,uy,0,.25,.62,.085)*F;                                                        // brow ridge
    for(const s of[-1,1])dz-=.045*G2(ux,uy,s*EYEX,EYEY+.05,.24,.17);                                   // eye sockets under the brow
    if(!noEye){const[a,yy]=eyeA(ux,uy,fem),fw=sm(-.045,.045,yy);dz+=-.12*sm(1.4,.42,a)+.03*Math.exp(-Math.pow((a-1.2)/.4,2))+.03*Math.exp(-Math.pow((a-1.75)/.45,2))*fw+.012*Math.exp(-Math.pow((a-1.6)/.4,2))*(1-fw)}   // opening, lid rims, upper-lid fold
    const nb=uy>-.2?.05*sm(.3,.1,uy)+(fem?.15:.19)*sm(.1,-.2,uy):(fem?.19:.24)*sm(-.32,-.2,uy),nw=(fem?.04:.046)+.05*sm(.05,-.22,uy);
    dz+=nb*Math.exp(-(ux*ux)/(nw*nw));                                                                    // nose bridge and tip
    for(const s of[-1,1]){dz+=.07*G2(ux,uy,s*.082,-.235,.045,.042);dz-=.05*G2(ux,uy,s*.05,-.285,.03,.02)}   // nostril wings and nostrils
    dz-=.03*G2(ux,uy,0,-.3,.1,.03);
    for(const s of[-1,1])dz+=(fem?.025:.035)*G2(ux,uy,s*.5,-.02,.16,.12);                                            // cheekbones
    const lw=Math.exp(-Math.pow(ux/(fem?.24:.26),4)),uw=Math.exp(-Math.pow(ux/(fem?.23:.245),4));
    dz+=(fem?.075:.06)*G2(0,uy,0,-.398,1,.04)*uw+(fem?.09:.072)*G2(0,uy,0,-.495,1,.055)*lw-.025*G2(ux,uy,0,-.37,.04,.025);   // lips, cupid's bow
    dz-=.04*G2(ux,uy,0,-.441,.3,.012);for(const s of[-1,1])dz-=.045*G2(ux,uy,s*.255,-.445,.035,.045);         // mouth line and corners
    dz-=.022*G2(ux,uy,0,-.33,.028,.04);dz-=.03*G2(ux,uy,0,-.585,.17,.035);                               // philtrum, under the lip
    dz+=(fem?.045:.07+fv*.012)*Math.exp(-Math.pow(ux/(fem?.15:.21+fv*.03),4))*G2(0,uy,0,-.76,1,.11);      // chin
    z+=dz}
  return[x*HR,HC+y*HR,z*HR]}
const surfP=(ux,uy,uz,fem,fv,off)=>{const p=headPt(ux,uy,uz,fem,fv),dx=p[0],dy=p[1]-HC,dz=p[2],l=Math.hypot(dx,dy,dz)||1;return[p[0]+dx/l*off,p[1]+dy/l*off,p[2]+dz/l*off]};
const dirAt=(ph,v)=>{const r=Math.sqrt(Math.max(0,1-v*v));return[Math.sin(ph)*r,v,Math.cos(ph)*r]};
// hairline height by |azimuth| (0 front .. PI back); H=[front, temple dip, sideburn, nape] — the shader paints the same line
function hairYJ(a,H){const f=H[0],t=H[0]-H[1];if(a<.5)return f-H[1]*(a/.5)*(a/.5);if(a<.95)return t-.06*(a-.5)/.45;if(a<1.15)return t-.06+(H[2]-t+.06)*(a-.95)/.2;if(a<1.36)return H[2];if(a<1.52)return H[2]+(.24-H[2])*(a-1.36)/.16;if(a<1.85)return .24;if(a<2.3)return .24+(H[3]+.1-.24)*(a-1.85)/.45;return H[3]+.1-.1*(a-2.3)/.84}
// V89: the close-up head packs extra rows/columns where the eyes, nose and mouth are sculpted, so the eye openings stay smooth instead of stair-stepping
let HQG=null;
function hqGrid(n,a,b,rho){const M=2400,c=[0];for(let k=1;k<=M;k++)c.push(c[k-1]+rho(a+(b-a)*(k-.5)/M));const T=c[M],o=[];let k=0;for(let m=0;m<=n;m++){const g=T*m/n;while(k<M-1&&c[k+1]<g)k++;const f=(g-c[k])/Math.max(c[k+1]-c[k],1e-9);o.push(a+(b-a)*(k+Math.min(1,Math.max(0,f)))/M)}return o}
function hqGrids(){if(HQG)return HQG;const gb=(x,c,s)=>Math.exp(-Math.pow((x-c)/s,2));
  const rows=hqGrid(112,0,PI,th=>{const u=Math.cos(th);return 1+5.5*gb(u,.1,.13)+2.4*gb(u,-.3,.22)});
  const cols=hqGrid(152,-PI,PI,ph=>{const a=Math.abs(ph);return 1+5.5*gb(a,.38,.19)+2.4*gb(a,0,.26)});
  return HQG={rows,cols}}
function headGeo(fem,fv,lod,inf=0,mask=null,infF=null,hr=0){const HQ=hr&&!lod,GQ=HQ?hqGrids():null,W=lod?28:HQ?152:hr?100:56,H=lod?20:HQ?112:hr?76:42,pos=[],hd=[],ix=[];
  for(let j=0;j<=H;j++){const v=j/H,w=v-(.5/TAU)*(Math.sin(TAU*(v-.56))+Math.sin(TAU*.56)),th=HQ?GQ.rows[j]:PI*w;
    for(let i=0;i<W;i++){const t=i/W*2-1,ph=HQ?GQ.cols[i]:PI*(t-(.6/PI)*Math.sin(PI*t)),ux=Math.sin(th)*Math.sin(ph),uy=Math.cos(th),uz=Math.sin(th)*Math.cos(ph);
      const k=inf+(infF?infF(ux,uy,uz):0);pos.push(...surfP(ux,uy,uz,fem,fv,k));hd.push(ux,uy,uz)}}
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const a=j*W+i,a1=j*W+(i+1)%W,b=a+W,b1=a1+W;const q=[[a,b,a1],[a1,b,b1]];for(const t of q){if(mask&&!t.every(v=>mask(hd[v*3],hd[v*3+1],hd[v*3+2])))continue;ix.push(...t)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();
  const N=g.attributes.normal;
  for(let i=0;i<W;i++){N.setXYZ(i,0,1,0);N.setXYZ(H*W+i,0,-1,0)}g.userData.hd=hd;return g}
// ---------------------------------------------------------------- the face atlas (shared): ink, eye whites, lips | brows, creases, blush; neutral faces plus smile / talk mouths
let FTX=null;
function faceTex(){if(FTX)return FTX;const S=1024,L={};
  // soft layers (creases, blush) are painted at quarter size and smoothed up: no canvas blur filters, which are slow without a GPU
  try{for(const k of['ink','wh','lip','brow','shd','bl']){const c=document.createElement('canvas'),z=k==='shd'||k==='bl'?.25:1;c.width=c.height=S*z;const q=c.getContext('2d',{willReadFrequently:true});if(!q)throw 0;q.fillStyle='#000';q.fillRect(0,0,S*z,S*z);L[k]=[c,q,z]}}
  catch(e){const t=new THREE.DataTexture(new Uint8Array([0,0,0,255]),1,1);t.needsUpdate=true;return FTX=[t,t]}
  for(const fem of[0,1]){const ox=fem*512;drawFace(L,fem,0,(q,z)=>q.setTransform(320*z,0,0,-320*z,(ox+256)*z,208*z),null);
    for(const v of[1,2]){const bx=ox+(v-1)*192,by=512;drawFace(L,fem,v,(q,z)=>q.setTransform(320*z,0,0,-320*z,(bx+96)*z,(by-76.8)*z),[bx,by,192,128])}}
  const px=k=>{const[c,q,z]=L[k];if(z===1)return q.getImageData(0,0,S,S).data;const o=document.createElement('canvas');o.width=o.height=S;const r=o.getContext('2d',{willReadFrequently:true});r.imageSmoothingEnabled=true;r.imageSmoothingQuality='high';r.drawImage(c,0,0,S,S);return r.getImageData(0,0,S,S).data};
  const mk=(a,b,c)=>{const o=document.createElement('canvas');o.width=o.height=S;const q=o.getContext('2d'),D=q.createImageData(S,S),A=px(a),B=px(b),C=px(c),d=D.data;
    for(let i=0;i<d.length;i+=4){d[i]=A[i];d[i+1]=B[i];d[i+2]=C[i];d[i+3]=255}q.putImageData(D,0,0);const t=new THREE.CanvasTexture(o);t.anisotropy=4;return t};
  return FTX=[mk('ink','wh','lip'),mk('brow','shd','bl')]}
function drawFace(L,fem,mv,tf,clip){const R=mulberry(fem*7+mv*3+11);
  const each=(k,fn)=>{const q=L[k][1],z=L[k][2];q.save();if(clip){q.beginPath();q.rect(...clip.map(v=>v*z));q.clip()}tf(q,z);q.fillStyle=q.strokeStyle='#fff';q.lineCap=q.lineJoin='round';fn(q);q.restore()};
  const E=fem?{ix:.17,ox:.565,iy:.074,oy:.14,top:.26,bot:-.035}:{ix:.17,ox:.555,iy:.075,oy:.118,top:.245,bot:-.03};
  const up=(q,s)=>{q.moveTo(s*E.ix,E.iy);q.bezierCurveTo(s*(E.ix+.045),E.top,s*(E.ox-.1),E.top+.01,s*E.ox,E.oy)},
    lo=(q,s)=>{q.bezierCurveTo(s*(E.ox-.07),E.bot-.004,s*(E.ix+.08),E.bot,s*E.ix,E.iy)},
    eye=(q,s)=>{q.beginPath();up(q,s);lo(q,s);q.closePath()};
  const blur=()=>{};
  const ell=(q,x,y,rx,ry,a=0)=>{q.beginPath();q.ellipse(x,y,rx,ry,a,0,TAU);q.fill()};
  const soft=(q,x,y,rx,ry,al)=>{q.save();q.translate(x,y);q.scale(rx,ry);const g=q.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,'rgba(255,255,255,'+al+')');g.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=g;q.beginPath();q.arc(0,0,1,0,TAU);q.fill();q.restore()};
  // mouth shapes in (ux,uy)
  const MW=fem?.235:.25,MY=-.441;
  const mouthLine=q=>{q.beginPath();q.moveTo(-MW,MY+.006);q.bezierCurveTo(-MW*.45,MY-.004,MW*.45,MY-.004,MW,MY+.006)};
  const upLip=q=>{q.beginPath();q.moveTo(-MW-.006,MY+.004);q.bezierCurveTo(-MW*.6,MY+.026,-.07,MY+(fem?.072:.058),-.04,MY+(fem?.068:.056));q.quadraticCurveTo(0,MY+(fem?.048:.042),.04,MY+(fem?.068:.056));q.bezierCurveTo(.07,MY+(fem?.072:.058),MW*.6,MY+.026,MW+.006,MY+.004);q.bezierCurveTo(MW*.45,MY-.004,-MW*.45,MY-.004,-MW-.006,MY+.004);q.closePath()};
  const loLip=q=>{q.beginPath();q.moveTo(-MW,MY+.004);q.bezierCurveTo(-MW*.45,MY-.004,MW*.45,MY-.004,MW,MY+.004);q.bezierCurveTo(MW*.75,MY-.06,.06,MY-(fem?.104:.088),0,MY-(fem?.104:.088));q.bezierCurveTo(-.06,MY-(fem?.104:.088),-MW*.75,MY-.06,-MW,MY+.004);q.closePath()};
  const smileO=q=>{q.beginPath();q.moveTo(-.23,MY+.05);q.bezierCurveTo(-.11,MY+.006,.11,MY+.006,.23,MY+.05);q.bezierCurveTo(.17,MY-.1,-.17,MY-.1,-.23,MY+.05);q.closePath()};
  const talkO=q=>{q.beginPath();q.ellipse(0,MY-.022,.1,.058,0,0,TAU)};
  // eye whites (and teeth)
  const eyeZ=(q,s)=>{q.translate(s*EYEX,EYEY);q.scale(EYF,EYF);q.translate(-s*EYEX,-EYEY)};
  each('wh',q=>{for(const s of[-1,1]){q.save();eyeZ(q,s);eye(q,s);q.fill();q.restore()}
    if(mv===1){q.save();smileO(q);q.clip();q.fillRect(-.2,MY-.022,.4,.07);q.restore()}
    if(mv===2){q.save();talkO(q);q.clip();q.fillRect(-.1,MY+.004,.2,.03);q.restore()}});
  // ink: lash lines, crease, lower lash, nostrils, mouth line / mouth interior
  each('ink',q=>{for(const s of[-1,1]){q.save();eyeZ(q,s);q.lineWidth=fem?.034:.03;q.beginPath();up(q,s);q.stroke();
      q.lineWidth=fem?.034:.028;q.beginPath();q.moveTo(s*(E.ix+.15),E.top-.004);q.bezierCurveTo(s*(E.ox-.06),E.top+.008,s*(E.ox-.02),E.oy+.02,s*(E.ox+.004),E.oy);q.stroke();
      if(fem){q.lineWidth=.012;q.beginPath();q.moveTo(s*(E.ox-.01),E.oy+.004);q.quadraticCurveTo(s*(E.ox+.03),E.oy+.02,s*(E.ox+.05),E.oy+.042);q.stroke();
        q.lineWidth=.006;for(let i=0;i<6;i++){const t=.45+i*.1,x=E.ix+(E.ox-E.ix)*t,y=E.top-.006-(t-.6)*(t-.6)*.15+(t>.85?(E.oy-E.top)*(t-.85)*4:0);q.beginPath();q.moveTo(s*x,y);q.lineTo(s*(x+.012+t*.01),y+.026);q.stroke()}}
      q.globalAlpha=.32;q.lineWidth=.008;q.beginPath();q.moveTo(s*(E.ix+.03),E.iy+.075);q.bezierCurveTo(s*(E.ix+.08),E.top+.055,s*(E.ox-.1),E.top+.055,s*(E.ox-.01),E.oy+.05);q.stroke();if(!fem){q.globalAlpha=1;q.lineWidth=.012;q.beginPath();q.moveTo(s*(E.ox-.01),E.oy+.002);q.lineTo(s*(E.ox+.025),E.oy+.016);q.stroke()}
      q.globalAlpha=.4;q.lineWidth=.007;q.beginPath();q.moveTo(s*(E.ox-.005),E.oy-.004);q.bezierCurveTo(s*(E.ox-.05),E.bot-.002,s*(E.ix+.07),E.bot,s*(E.ix+.03),E.iy-.022);q.stroke();q.globalAlpha=1;
      q.restore();q.globalAlpha=.6;ell(q,s*.052,-.262,.018,.0075,s*.3);q.globalAlpha=1}
    q.globalAlpha=.28;q.lineWidth=.009;q.beginPath();q.arc(0,-.215,.055,PI*1.18,PI*1.82,false);q.stroke();q.globalAlpha=1;
    if(mv===0){q.globalAlpha=.92;q.lineWidth=.0095;mouthLine(q);q.stroke();q.globalAlpha=.5;for(const s of[-1,1])ell(q,s*MW,MY+.006,.009,.006);q.globalAlpha=1}
    else if(mv===1){smileO(q);q.fill();q.save();smileO(q);q.clip();q.fillStyle='#000';q.fillRect(-.2,MY-.018,.4,.07);q.restore();q.globalAlpha=.6;q.lineWidth=.006;smileO(q);q.stroke();q.globalAlpha=1}
    else{talkO(q);q.fill();q.save();talkO(q);q.clip();q.fillStyle='#000';q.fillRect(-.1,MY+.008,.2,.03);q.restore()}});
  // lips
  each('lip',q=>{blur(q,1.5);q.globalAlpha=fem?.96:.8;if(mv===0){upLip(q);q.fill();loLip(q);q.fill()}
    else if(mv===1){q.lineWidth=.024;q.beginPath();q.moveTo(-.23,MY+.05);q.bezierCurveTo(-.11,MY+.006,.11,MY+.006,.23,MY+.05);q.stroke();q.lineWidth=.036;q.beginPath();q.moveTo(-.225,MY+.045);q.bezierCurveTo(-.17,MY-.105,.17,MY-.105,.225,MY+.045);q.stroke()}
    else{q.lineWidth=.026;talkO(q);q.stroke()}});
  // brows: tapered and arched, with hair strokes
  each('brow',q=>{q.translate(0,.028);for(const s of[-1,1]){const th=fem?.038:.062,yb=.255;q.save();q.globalAlpha=.97;q.beginPath();q.moveTo(s*.1,yb);q.quadraticCurveTo(s*.095,yb+th,s*.13,yb+th+.004);q.quadraticCurveTo(s*.3,(fem?.37:.35),s*.42,(fem?.372:.348));q.quadraticCurveTo(s*.52,(fem?.36:.335),s*.6,(fem?.29:.285));
      q.quadraticCurveTo(s*.5,(fem?.322:.3),s*.4,(fem?.338:.302));q.quadraticCurveTo(s*.25,(fem?.325:.29),s*.1,yb);q.closePath();q.fill();q.restore();
      q.lineWidth=.004;q.globalAlpha=.5;for(let i=0;i<30;i++){const t=R(),x=.12+t*.44,yb2=yb+(fem?.08:.055)*Math.sin(Math.min(1,t*1.4)*PI*.62)-(t>.7?(t-.7)*.2:0),y=yb2+R()*(th*(1-t*.6))*.8;q.beginPath();q.moveTo(s*x,y);q.lineTo(s*(x+.03+R()*.02),y+.012-t*.025);q.stroke()}}});
  // creases and occlusion
  each('shd',q=>{blur(q,2.5);for(const s of[-1,1]){soft(q,s*EYEX,EYEY+.01,.2,.15,.3);soft(q,s*(E.ix-.01),EYEY-.01,.06,.06,.32);soft(q,s*.085,-.12,.05,.1,.3);soft(q,s*.07,-.02,.028,.12,.18);soft(q,s*.7,-.36,.13,.28,.3);soft(q,s*.46,-.33,.13,.06,.16);soft(q,s*.165,-.445,.03,.025,.45);soft(q,s*.72,.24,.13,.18,.18);
      q.save();eye(q,s);q.clip();const g=q.createLinearGradient(0,E.top+.01,0,EYEY-.01);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=g;q.fillRect(-1,-1,2,2);q.restore();q.fillStyle='#fff';
      q.globalAlpha=.28;q.lineWidth=.022;q.beginPath();q.moveTo(s*.11,-.255);q.bezierCurveTo(s*.16,-.31,s*.19,-.38,s*.2,-.47);q.stroke();q.globalAlpha=1;
      q.globalAlpha=.42;q.lineWidth=.012;q.beginPath();q.arc(s*.072,-.232,.04,s>0?-.3:PI+.3,s>0?2.0:PI-2.0,s<0);q.stroke();q.globalAlpha=1}
    soft(q,0,-.288,.075,.028,.55);soft(q,0,-.34,.013,.035,.25);soft(q,0,-.565,.085,.028,.5);soft(q,0,-.92,.3,.08,.35)});
  // warm blush
  each('bl',q=>{blur(q,3);for(const s of[-1,1])soft(q,s*.43,-.2,.17,.13,.6);soft(q,0,-.19,.06,.06,.5);soft(q,0,-.44,.16,.07,.25)})}
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// ---------------------------------------------------------------- hair styles: hairline [front, temple dip, sideburn, nape], density, fade
const HAIRP={short:[.5,.12,-.02,-.5],swept:[.48,.12,-.02,-.5],fade:[.52,.12,.06,-.42],buzz:[.53,.15,.02,-.48],afro:[.55,.05,.02,-.45],curly:[.52,.08,.0,-.5],long:[.5,.0,.1,-.55],pony:[.52,0,.12,-.5],bun:[.52,0,.12,-.5],bucket:[.5,.1,0,-.5]};
function hairInside(ux,uy,uz,H,m=0){return uy>hairYJ(Math.abs(Math.atan2(ux,uz)),H)+m}
function addHair(G,o,fem,fv,lod){const hs=o.hs2,H=HAIRP[hs]||HAIRP.short,cen=[0,HC,0],RR=mulberry((hs.length*31+(fem?7:3)+(o.fv|0)*5)|0),HW=W1('head'),pid=PS.hair;
  const shellF=(base,top)=>(ux,uy,uz)=>{const hy=hairYJ(Math.abs(Math.atan2(ux,uz)),H);return (base+top*Math.max(0,uy))*sm(hy+.035,hy+.2,uy)};
  const shell=(base,top,m=.035)=>gAdd(G,headGeo(fem,fv,lod,.0008,(ux,uy,uz)=>hairInside(ux,uy,uz,H,m),shellF(base,top)),pid,HW,(x,y,z,nx,ny)=>.84+.16*sm(-.5,.3,ny));
  const cl=(ph0,v0,ph1,v1,lift,w,th,liftM,wf)=>{const off=.006,a=surfP(...dirAt(ph0,v0),fem,fv,off),c=surfP(...dirAt(ph1,v1),fem,fv,off+lift),m=surfP(...dirAt((ph0+ph1)/2,(v0+v1)/2),fem,fv,off+(liftM!=null?liftM:lift*.6+.012));
    gAdd(G,clumpGeo(a,m,c,w,th,cen,lod?3:5,lod?4:6),pid,wf||HW,(x,y,z,nx,ny)=>.86+.18*Math.max(0,ny))};
  const skip=i=>lod&&(i&1);
  if((o.prop||o.cap||hs==='bucket')&&!fem){shell(.004,0,.04);return}const hat=o.prop||o.cap||hs==='bucket';
  if(hs==='buzz')shell(.004,0,.04);
  else if(hs==='short'||hs==='swept'){shell(.012,.01);const sw=hs==='swept'?.55:.12;
    for(let i=0;i<6;i++){if(skip(i))continue;const ph=-.55+i*.22+(RR()-.5)*.08;cl(ph,.86,ph+sw+(RR()-.5)*.1,hs==='swept'?.58:.5,hs==='swept'?.07:.045,.07,.03,hs==='swept'?.06:null)}
    for(let i=0;i<7;i++){if(skip(i))continue;const ph=(i/7)*TAU+RR()*.3;cl(ph,.97,ph*1.02+(Math.cos(ph)>0?sw*.5:0),.6,.03,.075,.028)}
    for(const s of[-1,1])for(let i=0;i<4;i++){if(skip(i))continue;const ph=s*(1.05+i*.32);cl(ph,.62,ph+s*.12,.24,.012,.075,.022)}
    for(let i=0;i<4;i++){if(skip(i))continue;const ph=PI+(i-1.5)*.38;cl(ph,.55,ph,-.18,.012,.085,.022)}}
  else if(hs==='fade'){shell(.008,.012,.06);for(let i=0;i<7;i++){if(skip(i))continue;const ph=-.6+i*.2+(RR()-.5)*.1;cl(ph,.9,ph+(RR()-.5)*.2,.66,.05,.06,.026,.045)}
    for(let i=0;i<6;i++){if(skip(i))continue;const ph=(i/6)*TAU+.3;cl(ph,.98,ph,.78,.035,.065,.024)}}
  else if(hs==='afro'){shell(.012,.01);const a=new THREE.SphereGeometry(.25,lod?16:32,lod?12:24),p=a.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=1+.07*Math.sin(x*60+y*23)*Math.sin(z*55-y*31)+.04*Math.sin(x*130+z*90);p.setXYZ(i,x*1.04*n,y*.9*n,z*1.0*n)}a.computeVertexNormals();at(a,0,1.985,-.055);gAdd(G,a,pid,HW,(x,y)=>y<1.84?.78:1)}
  else if(hs==='curly'){shell(.014,.012);for(let i=0;i<(lod?12:34);i++){const v=.25+.75*Math.sqrt(RR()),ph=RR()*TAU;if(!hairInside(...dirAt(ph,v),H,.05))continue;const c=new THREE.SphereGeometry(.036+RR()*.016,lod?6:9,lod?4:7),p=surfP(...dirAt(ph,v),fem,fv,.03);at(c,...p);gAdd(G,c,pid,HW,(x,y)=>y<HC?.8:1)}}
  else if(hs==='long'||hs==='pony'||hs==='bun'){shell(hs==='long'?.012:.007,hs==='long'?.012:.004);
    const lw=(x,y)=>y>1.66?[BI.head]:Wb('chest','head',(y-1.44)/.22);
    if(hs==='long'){if(!hat)for(const s of[-1,1])for(let i=0;i<3;i++){if(skip(i))continue;cl(s*(.06+i*.05),.9,s*(.55+i*.22),.3-i*.05,.022,.085,.026,.03)}
      for(const s of[-1,1])for(let i=0;i<2;i++){const a=surfP(...dirAt(s*(1.05+i*.25),.55),fem,fv,.008);gAdd(G,clumpGeo(a,[s*(.205+i*.02),1.7,-.01-i*.04],[s*(.2+i*.03),1.44,-.03-i*.05],.1,.03,[0,1.6,-.02],lod?3:5,lod?4:6,.72),pid,lw,(x,y)=>y<1.55?.84:1)}
      for(let i=0;i<7;i++){if(skip(i))continue;const ph=PI+(i-3)*.33,a=surfP(...dirAt(ph,.45),fem,fv,.008),x=Math.sin(ph)*.2;gAdd(G,clumpGeo(a,[x*1.15,1.66,-.23],[x*1.25,1.3,-.16-.03*Math.cos(i)],.15,.035,[0,1.55,0],lod?3:5,lod?4:6,.7),pid,lw,(x,y)=>y<1.45?.82:1)}}
    else if(hs==='pony'){const r=[0,1.86,-.2];for(let i=0;i<4;i++){const dx=(i-1.5)*.02;gAdd(G,clumpGeo([dx,1.86,-.19],[dx*1.5,1.82,-.29],[dx*2,1.5,-.25],.05,.04,[0,1.7,-.2],lod?3:5,lod?4:6),pid,lw,()=>.92)}
      const t=new THREE.TorusGeometry(.032,.011,6,12);t.rotateX(PI/2.6);at(t,...r);gAdd(G,t,PS.dark,HW);if(!hat)for(const s of[-1,1])cl(s*.2,.82,s*.66,.38,.016,.075,.02,.025)}
    else{const b=new THREE.SphereGeometry(.085,lod?10:16,lod?8:12);b.scale(1.1,.95,1);at(b,0,1.98,-.1);gAdd(G,b,pid,HW);if(!hat)for(const s of[-1,1])cl(s*.2,.82,s*.66,.38,.016,.075,.02,.025)}}}
// ---------------------------------------------------------------- hands, sneakers
function addHand(G,X,s,A,fem,lod){const hw=W1(A[2]),F=fem?1.18:1.32;if(lod)return;   // the palm is part of the arm; fingers and thumb grow out of it
  const fz=[.036,.012,-.012,-.034],fl=[.072,.082,.078,.062];
  for(let i=0;i<4;i++){const z=fz[i]*F+.008,l=fl[i]*F,R=[];for(let k=0;k<4;k++){const t=k/3;R.push({y:.858-l*t*(1-.1*t),cx:X-s*(.006+.45*l*t*t),cz:z+.004*t,rx:.0122*F*(1-t*.15),rf:.0126*F*(1-t*.12),rb:.0126*F*(1-t*.12)})}
    gAdd(G,tube(R,8,2,0,1),PS.skin,hw,(x,y)=>y>.845?.92:1)}
  const th=tube([{y:.935,cx:X-s*.012,cz:.034*F,rx:.017*F,rf:.017*F,rb:.017*F},{y:.9,cx:X-s*.024,cz:.058*F,rx:.0145*F,rf:.0145*F,rb:.0145*F},{y:.868,cx:X-s*.034,cz:.068*F,rx:.013*F,rf:.013*F,rb:.013*F}],8,2,0,1);gAdd(G,th,PS.skin,hw)}
// carried things: held in the hand bone (or the chest for trays and umbrellas' poses), with a holding pose
function addRoleProp2(n){const r=n.prole,g=n.g,P_=g.P,M_=c=>mt(c,.6);const att=(geo,c,par,x,y,z)=>{const m=new THREE.Mesh(geo,M_(c));m.position.set(x,y,z);m.castShadow=true;par.add(m);return m};
  if(r==='basketball'){n.ball=att(new THREE.SphereGeometry(.13,14,12),0xd8662a,g,.36,.4,.22);n.ball.material=bbMat()}
  else if(r==='pouch'){const p=att(roundBox(.3,.15,.1,.03,1),0x5a3a1e,P_.hips,0,.06,.15);att(roundBox(.12,.04,.02,.01,1),0x3a2412,p,0,.02,.055)}
  else if(r==='weather'){g.HOLD='up';const u=new THREE.Group();u.position.set(-.012,-.1,.035);u.rotation.x=1.7;P_.hR.add(u);att(new THREE.CylinderGeometry(.012,.012,1.1,6),0x222222,u,0,.45,0);
    const c=att(new THREE.ConeGeometry(.6,.28,12,1,true),0x2a6aa8,u,0,1.02,0);c.material.side=THREE.DoubleSide;att(new THREE.SphereGeometry(.02,6,4),0x222222,u,0,1.16,0);const h=att(new THREE.TorusGeometry(.035,.01,5,10,PI),0x222222,u,.035,-.1,0);h.rotation.z=PI}
  else if(r==='morning'){const m=att(new THREE.CylinderGeometry(.035,.075,.3,10,1,true),0xc9a046,P_.hR,0,-.2,.03);m.material.side=THREE.DoubleSide}
  else if(r==='delinquent')att(new THREE.CylinderGeometry(.034,.034,.12,10),0xc0302a,P_.hR,-.006,-.1,.035);
  else if(r==='captain'){const b=att(bgeo(.03,.32,.24),0x8a6a44,P_.hL,.012,-.2,.03);att(bgeo(.034,.26,.2),0xf2efe6,b,s0(1)*.002,-.02,0)}
  else if(r==='scribe')att(bgeo(.04,.26,.19),0x2a3a5a,P_.hL,.012,-.17,.03);
  else if(r==='hype'){g.HOLD='box';const b=att(bgeo(.17,.26,.46),0x222222,P_.chest,.3,.33,-.01);for(const z of[-.12,.12])att(new THREE.CylinderGeometry(.075,.075,.02,12).rotateZ(PI/2),0x888888,b,.09,0,z);att(new THREE.TorusGeometry(.06,.012,5,10,PI),0x333333,b,0,.13,0).rotation.y=PI/2}
  else if(r==='snack'){g.HOLD='tray';const t=att(bgeo(.5,.025,.32),0xc9ccd2,P_.chest,0,-.135,.27);for(let i=0;i<4;i++)att(new THREE.SphereGeometry(.05,8,6),[0xd8a040,0xc0302a,0x7a4a2a,0xf2c230][i],t,-.15+i*.1,.05,0)}
  else if(r==='cone'){att(new THREE.ConeGeometry(.1,.36,10),0xff6a1a,P_.hR,0,-.2,.04);att(new THREE.CylinderGeometry(.06,.075,.05,10),0xf6f2e8,P_.hR,0,-.14,.04)}
  else if(r==='popstar'){att(new THREE.CylinderGeometry(.018,.018,.2,8),0x222222,P_.hR,0,-.13,.035);att(new THREE.SphereGeometry(.04,8,6),0xb8bcc2,P_.hR,0,-.01,.035)}
  else if(r==='stats'){const b=att(bgeo(.04,.28,.2),0x6b4a2a,P_.hL,.012,-.18,.03);att(bgeo(.044,.24,.16),0xf2efe6,b,.002,-.01,0)}
  else if(r==='skate'){const b=att(bgeo(.2,.03,.72),0xd0662a,P_.hL,0,-.2,.03);b.rotation.x=1.2;for(const z of[-.25,.25])att(new THREE.CylinderGeometry(.03,.03,.22,8).rotateZ(PI/2),0xdddddd,b,0,-.04,z)}
  else if(r==='burglar'){att(new THREE.SphereGeometry(.14,10,8),0x2a2c33,P_.hR,0,-.22,.05);att(new THREE.CylinderGeometry(.03,.05,.07,8),0x2a2c33,P_.hR,0,-.09,.05)}
  else if(r==='fruit')att(new THREE.SphereGeometry(.075,10,8),0x6a3a8a,P_.hR,0,-.12,.04);
  else if(r==='ouija'){const b=att(bgeo(.04,.3,.22),0x7a5a30,P_.hL,.012,-.18,.03);att(bgeo(.044,.2,.16),0xd8c496,b,.002,0,0)}
  else if(r==='caveman')att(new THREE.CylinderGeometry(.035,.06,.62,8),0x8a5426,P_.hR,0,-.3,.05);
  else if(r==='mascot'){for(const sg of[-1,1]){const h=att(new THREE.TorusGeometry(.1,.035,6,12,PI*1.4),0xe8dcc0,P_.head,sg*.17,.26,0);h.rotation.y=sg*PI/2}}}
const s0=v=>v;
function addShoe(G,X,L,lod){const fw=W1(L[2]),sg=lod?8:14;
  // shoe space: tube 'y' runs heel->toe (becomes +z), cz is minus the height, rb = height above the centre, rf = depth below it
  const S=(z,h,w,t,b)=>({y:z*1.1,cx:X,cz:-h,rx:w*1.16,rf:b,rb:t});
  const up=tube([S(-.085,.062,.046,.042,.045),S(-.06,.064,.056,.05,.05),S(0,.064,.06,.052,.052),S(.07,.058,.062,.04,.046),S(.13,.052,.062,.03,.04),S(.18,.048,.054,.024,.036),S(.205,.045,.04,.018,.032)],sg,2.6,1,1);up.rotateX(PI/2);at(up,0,0,.045);
  gAdd(G,up,PS.shoe,fw,(x,y,z,nx,ny)=>ny>.6?1.04:ny<-.2?.85:.97);
  const so=tube([S(-.092,.021,.054,.019,.021),S(-.06,.021,.062,.019,.021),S(.06,.021,.067,.017,.021),S(.16,.021,.064,.015,.021),S(.215,.022,.046,.014,.02)],sg,3.4,1,1);so.rotateX(PI/2);at(so,0,0,.045);
  gAdd(G,so,(x,y)=>y<.009?PS.dark:PS.sole,fw,(x,y,z,nx,ny)=>ny<-.5?.6:1);
  const co=tube([{y:.1,cx:X,cz:-.022,rx:.055,rf:.058,rb:.06},{y:.122,cx:X,cz:-.025,rx:.05,rf:.052,rb:.056},{y:.122,cx:X,cz:-.025,rx:.036,rf:.038,rb:.04}],sg,2.2);gAdd(G,co,PS.shoe,fw,()=>.78);
  if(lod)return;
  const tg=roundBox(.07,.016,.09,.007,1);tg.rotateX(-.42);at(tg,X,.108,.065);gAdd(G,tg,PS.shoe,fw,()=>.95);
  for(let i=0;i<4;i++){const l=roundBox(.064,.007,.012,.003,1);l.rotateX(-.4);at(l,X,.112-i*.0105,.05+i*.024);gAdd(G,l,PS.lace,fw)}
  for(const sd of[-1,1]){const st=roundBox(.006,.02,.11,.004,1);st.rotateX(.28);st.rotateY(sd*.06);at(st,X+sd*.058,.062,.06);gAdd(G,st,PS.sacc,fw)}
  const hb=roundBox(.03,.04,.012,.005,1);at(hb,X,.1,-.045);gAdd(G,hb,PS.sacc,fw)}
// ---------------------------------------------------------------- one body: geometry for a style key and level of detail
const BODYG={};
const fhG=o=>o.fh==='goatee'||o.fh==='beard'?o.fh:0;
function styleKey(o){return[o.fem?1:0,o.hs2,o.cl2+(o.big?'B':''),fhG(o),o.gl&&!(o.stone||o.metal)?1:0,o.prop?1:0,o.cap?1:0,o.fv|0,(o.letters||o.pin)?1:0].join('|')}
function bodyKey(o,lod){return styleKey(o)+'|'+lod}
// V170 bare torso (cage fighters): skin slot plus pec, sternum, ab and navel shading
function c2BareShade(x,y,nz){const ax=Math.abs(x),fr=sm(.15,.55,nz);if(fr<=0)return 1;let d=0;
  d+=.13*sm(.02,.06,ax)*sm(.2,.15,ax)*sm(1.29,1.315,y)*sm(1.345,1.32,y);
  d+=.07*sm(.025,0,ax)*sm(1.08,1.14,y)*sm(1.45,1.38,y);
  for(const yy of[1.154,1.226])d+=.06*sm(.09,.06,ax)*sm(.018,0,Math.abs(y-yy));
  d+=.14*sm(.016,0,ax)*sm(.016,0,Math.abs(y-1.05));
  d+=.06*sm(.1,.14,ax)*sm(1.12,1.0,y)*sm(.95,1.0,y);
  return 1-d*fr}
function buildBody(o,lod=0){const k=bodyKey(o,lod);if(BODYG[k])return BODYG[k];const G=GB(),fem=!!o.fem,BP=bonePos0(fem);G.fem=fem;G.warp=1;const fv=o.fv|0,cl=o.cl2,sg=lod?10:20,HW=W1('head');
  // head and neck
  gAdd(G,headGeo(fem,fv,lod,0,null,null,1),PS.skin,HW,(x,y,z,nx,ny,nz)=>1-.12*sm(-.4,-.9,ny));
  // eyeballs sitting in the openings (iris, pupil and catch-lights drawn by the shader from each eyeball's own direction)
  for(const s of[-1,1]){const ux=s*EYEX,uy=EYEY,uz=Math.sqrt(Math.max(0,1-ux*ux-uy*uy)),P=headPt(ux,uy,uz,fem,fv,1),rE=(fem?.041:.04)*EYF,n=v3n([s*.2,.05,1]),c=[P[0]-n[0]*(rE-.011*EYF),P[1]-n[1]*(rE-.011*EYF),P[2]-n[2]*(rE-.011*EYF)];
    const e=new THREE.SphereGeometry(rE,lod?12:32,lod?10:24),ep=e.attributes.position,eh=[];for(let i=0;i<ep.count;i++){const x=ep.getX(i),y=ep.getY(i),z=ep.getZ(i),l=Math.hypot(x,y,z)||1;eh.push(x/l,y/l,z/l)}e.userData.hd=eh;at(e,...c);gAdd(G,e,PS.eyeW,HW)}
  gAdd(G,tube([{y:1.48,cx:0,cz:-.008,rx:fem?.064:.08,rf:fem?.062:.076,rb:fem?.064:.078},{y:1.58,cx:0,cz:-.012,rx:fem?.06:.077,rf:fem?.058:.072,rb:fem?.061:.076},{y:1.69,cx:0,cz:-.025,rx:fem?.056:.07,rf:fem?.054:.066,rb:fem?.056:.07}],lod?8:14,2.1),PS.skin,(x,y)=>y>1.65?[BI.head]:y<1.53?Wb('chest','neck',(y-1.48)/.05*.5+.0):Wb('neck','head',(y-1.53)/.12*.6),(x,y,z,nx,ny,nz)=>(1-.1*sm(-.1,-.6,nz))*(.82+.18*sm(1.5,1.62,y)));
  for(const s of[-1,1]){const ex=headPt(s*.99,-.02,-.05,fem,fv),e=new THREE.SphereGeometry(.043,lod?8:14,lod?6:10);e.scale(.34,1.12,.68);e.rotateY(s*.32);at(e,ex[0]+s*.004,ex[1]-.008,ex[2]-.01);gAdd(G,e,PS.skin,HW,(x,y,z,nx)=>.78+.22*sm(-.2,.4,nx*s));
    if(!lod){const ie=new THREE.SphereGeometry(.021,8,6);ie.scale(.3,1,.6);ie.rotateY(s*.32);at(ie,ex[0]+s*.012,ex[1]-.01,ex[2]-.006);gAdd(G,ie,PS.skin,HW,()=>.8)}}
  addHair(G,o,fem,fv,lod);
  if(!lod&&!(o.prop||o.cap||o.hs2==='bucket'||o.stone||o.metal)){const bw=fem?.006:.008,bh=fem?.0035:.0045;for(const s of[-1,1]){const bp=(ux,uy,off)=>surfP(s*ux,uy,Math.sqrt(Math.max(0,1-ux*ux-uy*uy)),fem,fv,off);
    gAdd(G,clumpGeo(bp(.14,.305,.004),bp(.31,.372,.006),bp(.48,.338,.004),bw,bh,[0,HC,0],6,6,.45),PS.brow,HW,()=>.94)}}
  // facial hair
  if(fhG(o)){const ax=Math.abs,hole=(ux,uy)=>sm(.75,1.05,Math.hypot(ux/.19,(uy+.447)/.085)),
      bf=o.fh==='goatee'?(ux,uy,uz)=>Math.max(sm(.25,.17,ax(ux))*sm(-.56,-.66,uy)*sm(-1,-.92,uy),sm(.25,.17,ax(ux))*G2(0,uy,0,-.36,1,.045)*sm(.5,.8,uz),sm(.25,.17,ax(ux))*sm(.13,.17,ax(ux))*sm(-.36,-.44,uy)*sm(-.66,-.58,uy))*hole(ux,uy)
        :(ux,uy,uz)=>{const yb=-.24+.3*sm(.3,.85,ax(ux));return sm(yb+.03,yb-.07,uy)*sm(-.32,-.12,uz)*hole(ux,uy)*(uy>-.36&&ax(ux)<.3&&uz>.8?sm(.3,.38,ax(ux))+G2(0,uy,0,-.36,1,.04)*sm(.24,.14,ax(ux)):1)};
    gAdd(G,headGeo(fem,fv,lod,.0006,(ux,uy,uz)=>bf(ux,uy,uz)>.008,(ux,uy,uz)=>(o.fh==='goatee'?.011:.015)*bf(ux,uy,uz),1),PS.hair,HW,(x,y,z,nx,ny)=>.86+.12*sm(-.6,.2,ny))}
  // hats
  if(o.prop){for(let i=0;i<4;i++){const q=headGeo(fem,fv,lod,.016,(ux,uy,uz)=>uy>.18&&((Math.atan2(ux,uz)+PI*2.25)%TAU)>=i*PI/2&&((Math.atan2(ux,uz)+PI*2.25)%TAU)<(i+1)*PI/2+.001,(ux,uy)=>.01*Math.max(0,uy));gAdd(G,q,PS.b0+i,HW)}
    const rim=tube([0,1].map(j=>({y:HC+.035+j*.03,cx:0,cz:-.008,rx:.19,rf:.205,rb:.215})),sg,2.2);gAdd(G,rim,PS.b1,HW,()=>.9);const st=new THREE.CylinderGeometry(.014,.014,.12,6);at(st,0,2.07,0);gAdd(G,st,PS.dark,HW)}
  else if(o.cap){gAdd(G,headGeo(fem,fv,lod,.02,(ux,uy,uz)=>uy>.24,(ux,uy)=>.008*Math.max(0,uy)),PS.cap,HW);const br=tube([{y:-.0,cx:0,cz:0,rx:.11,rf:.015,rb:.015},{y:.09,cx:0,cz:0,rx:.1,rf:.013,rb:.013},{y:.15,cx:0,cz:0,rx:.07,rf:.011,rb:.011}],sg,3,0,2);br.rotateX(PI/2+.05);at(br,0,HC+.075,.16);gAdd(G,br,PS.cap,HW,(x,y,z,nx,ny)=>ny<0?.7:1);
    const bt=new THREE.SphereGeometry(.024,10,8);bt.scale(1,.55,1);at(bt,0,HC+.215,-.01);gAdd(G,bt,PS.cap,HW,()=>1.1);gAdd(G,headGeo(fem,fv,lod,.03,(ux,uy,uz)=>uy>.24&&uy<.34,null),PS.cap,HW,()=>.8)}
  else if(o.hs2==='bucket'){const c=tube([{y:1.84,cx:0,cz:-.005,rx:.21,rf:.22,rb:.22},{y:1.93,cx:0,cz:-.005,rx:.2,rf:.21,rb:.21},{y:1.97,cx:0,cz:-.005,rx:.18,rf:.19,rb:.19}],sg,2.2,0,2);gAdd(G,c,PS.cap,HW);const br=tube([{y:1.86,cx:0,cz:0,rx:.21,rf:.22,rb:.22},{y:1.83,cx:0,cz:0,rx:.29,rf:.3,rb:.3},{y:1.82,cx:0,cz:0,rx:.29,rf:.3,rb:.3},{y:1.845,cx:0,cz:0,rx:.21,rf:.22,rb:.22}],sg,2.2);gAdd(G,br,PS.cap,HW,(x,y,z,nx,ny)=>ny<0?.75:.95)}
  if(o.gl&&!(o.stone||o.metal)){for(const s of[-1,1]){const p=surfP(...dirAt(s*.36,EYEY),fem,fv,0),r=new THREE.TorusGeometry(.036,.0045,6,lod?10:20);r.scale(1.18,.82,1);at(r,p[0],p[1]+.004,p[2]+.016);gAdd(G,r,PS.glass,HW);
      const t=roundBox(.006,.006,.17,.002,1);at(t,s*.172,p[1]+.008,p[2]-.07);gAdd(G,t,PS.glass,HW)}const p=surfP(0,EYEY,1,fem,fv,0),b=roundBox(.03,.006,.006,.002,1);at(b,0,p[1]+.012,p[2]+.004);gAdd(G,b,PS.glass,HW)}
  // torso
  const TM=fem?[[.913,.18,.115,.12],[.92,.208,.137,.142],[.96,.198,.13,.136],[1.04,.182,.12,.124],[1.12,.172,.115,.115],[1.2,.182,.125,.115],[1.27,.2,.148,.118],[1.33,.214,.162,.12],[1.39,.224,.152,.12],[1.44,.242,.13,.118],[1.48,.262,.1,.105],[1.505,.255,.09,.094],[1.525,.19,.076,.078],[1.542,.12,.068,.07],[1.556,.07,.064,.066]]
    :[[.913,.19,.12,.118],[.92,.215,.14,.137],[.96,.207,.134,.131],[1.04,.188,.13,.128],[1.12,.194,.133,.128],[1.2,.224,.145,.132],[1.28,.25,.158,.138],[1.35,.272,.165,.142],[1.41,.292,.158,.14],[1.46,.31,.138,.135],[1.5,.318,.112,.118],[1.52,.265,.098,.103],[1.54,.19,.088,.092],[1.556,.12,.082,.084],[1.57,.086,.078,.08]];
  const tdisp=(y,a)=>{let d=0;const f=Math.sin(a),ca=Math.cos(a);
    if(fem)d+=.024*sm(1.23,1.32,y)*sm(1.42,1.34,y)*Math.max(0,f)*Math.exp(-Math.pow((Math.abs(ca)-.38)/.25,2));
    else{d+=.013*sm(1.27,1.36,y)*sm(1.47,1.39,y)*Math.max(0,f)*Math.exp(-Math.pow((Math.abs(ca)-.42)/.3,2));d-=.006*sm(1.25,1.33,y)*sm(1.45,1.38,y)*Math.exp(-Math.pow(ca/.12,2))*Math.max(0,f)}
    d+=.009*Math.max(0,-f)*sm(1.3,1.38,y)*sm(1.48,1.4,y)*Math.exp(-Math.pow((Math.abs(ca)-.5)/.3,2));
    if(cl!=='polo'&&cl!=='bare')d+=.0035*Math.sin(y*95+a*3)*sm(1.17,1.0,y)*sm(.93,.98,y);if(cl==='hoodie')d+=.012*sm(1.5,1.4,y);if(o.big)d+=Math.max(0,f)*.13*sm(.9,1.12,y)*sm(1.46,1.18,y)*Math.exp(-Math.pow(ca/.8,2))+.04*sm(.93,1.15,y)*sm(1.48,1.25,y);return d};
  let R_=TM.map(([y,rx,rf,rb])=>({y,cx:0,cz:fem?.004:0,rx,rf,rb}));
  const BARE=cl==='bare'&&!fem;if(BARE&&!lod){const D=[];for(let i=0;i<R_.length-1;i++){const a=R_[i],b=R_[i+1],n=Math.max(1,Math.ceil((b.y-a.y)/.011));for(let k=0;k<n;k++){const t=k/n;D.push({y:a.y+(b.y-a.y)*t,cx:0,cz:0,rx:a.rx+(b.rx-a.rx)*t,rf:a.rf+(b.rf-a.rf)*t,rb:a.rb+(b.rb-a.rb)*t})}}D.push(R_[R_.length-1]);R_=D}
  const tdisp0=tdisp,tdispB=(y,a,r)=>{let d=tdisp0(y,a,r);const f=Math.sin(a);if(f<=0)return d;const u=Math.pow(Math.abs(Math.cos(a)),2/2.6),G=(v,c,w)=>Math.exp(-Math.pow((v-c)/w,2));
    d+=.018*G(u,.34,.2)*sm(1.29,1.345,y)*sm(1.47,1.38,y)*f;
    let ab=0;for(const c of[1.262,1.19,1.118])ab+=G(y,c,.027);d+=.005*G(u,.2,.09)*Math.min(1,ab)*sm(1.08,1.11,y)*sm(1.3,1.28,y)*f;
    d-=.003*G(u,0,.05)*sm(1.06,1.12,y)*sm(1.33,1.29,y)*f;return d};
  const torsoW=(x,y)=>y<1.0?[BI.hips]:y<1.14?Wb('hips','spine',(y-1)/.14):y<1.24?[BI.spine]:y<1.36?Wb('spine','chest',(y-1.24)/.12):y<1.52?(Math.abs(x)>.19?Wb('chest',x<0?'aL':'aR',(Math.abs(x)-.19)/.2*.55*Math.min(1,(1.52-y)/.02)):[BI.chest]):Wb('chest','neck',(y-1.52)/.08*.6);
  gAdd(G,tube(R_,lod?16:BARE?64:30,2.6,0,0,BARE?tdispB:tdisp),cl==='bare'?PS.skin:PS.shirt,torsoW,(x,y,z,nx,ny,nz)=>(cl==='bare'?c2BareShade(x,y,nz):1)*(1-.08*sm(-.1,-.6,nz))*(1-.16*sm(.15,.26,Math.abs(x))*sm(1.24,1.3,y)*sm(1.44,1.38,y)*sm(.7,.3,Math.abs(nz)))*(1-.12*sm(.97,.93,y))*(1-.2*sm(-.4,-.8,ny)));
  // V172 bare torso: pecs and abs are sculpted into the torso (tdispB); only flush areolae are added
  if(BARE&&!lod){const fz=(x,y)=>{let i=0;while(i<TM.length-2&&TM[i+1][0]<y)i++;const a=TM[i],b=TM[i+1],t=clamp((y-a[0])/(b[0]-a[0]),0,1),rx=a[1]+(b[1]-a[1])*t,rf=a[2]+(b[2]-a[2])*t,u=Math.min(.999,Math.abs(x)/rx),c=Math.pow(u,2.6/2),sn=Math.sqrt(1-c*c),G=(v,cc,w)=>Math.exp(-Math.pow((v-cc)/w,2));
      return Math.pow(sn,2/2.6)*(rf+(.018*G(u,.34,.2)*sm(1.29,1.345,y)*sm(1.47,1.38,y)+.013*sm(1.27,1.36,y)*sm(1.47,1.39,y)*Math.exp(-Math.pow((Math.pow(1-sn*sn,.5)-.42)/.3,2)))*sn)};
    for(const s of[-1,1]){const nx_=s*.1,ny_=1.352,nz_=fz(nx_,ny_);const ar=new THREE.SphereGeometry(.0135,10,6);ar.scale(1,1,.22);at(ar,nx_,ny_,nz_);gAdd(G,ar,PS.lip,W1('chest'),()=>.9);
      const ni=new THREE.SphereGeometry(.0042,6,4);ni.scale(1,1,.6);at(ni,nx_,ny_,nz_+.003);gAdd(G,ni,PS.lip,W1('chest'),()=>.78)}}
  // hem band, chest pocket
  if(!o.big&&(cl==='tee'||cl==='tank'||cl==='flannel')){const trow=y=>{for(let i=0;i<TM.length-1;i++){const a=TM[i],b=TM[i+1];if(y<=b[0]){const t=clamp((y-a[0])/(b[0]-a[0]),0,1);return[1,2,3].map(k=>a[k]+(b[k]-a[k])*t)}}return TM[TM.length-1].slice(1)};
    const HR_=[[.926,0],[.934,.008],[.965,.0075],[.99,.0065],[.998,.001]].map(([y,g])=>{const r=trow(y);return{y,cx:0,cz:fem?.004:0,rx:r[0]+g,rf:r[1]+g,rb:r[2]+g}});
    gAdd(G,tube(HR_,lod?16:30,2.6),PS.shirt,W1('hips'),(x,y,z,nx,ny)=>ny<-.3?.8:(y>.985?1.03:.95))}
  if(!lod&&!o.big&&!o.letters&&!o.pin&&(cl==='tee'||cl==='polo'||cl==='flannel')){const pz=.167,pw=Wb('spine','chest',0),pf=(x,y)=>Wb('spine','chest',(y-1.24)/.12);
    const pk=roundBox(.088,.098,.012,.004,1);at(pk,-.105,1.3,pz);gAdd(G,pk,PS.shirt,pf,(x,y,z,nx,ny)=>ny>.5?1.02:.9);
    const pt=roundBox(.092,.014,.016,.005,1);at(pt,-.105,1.347,pz+.001);gAdd(G,pt,PS.acc,pf,()=>.95)}
  // collars, hood, pocket, placket
  if(cl==='tee'){const c=new THREE.TorusGeometry(fem?.074:.092,.015,8,lod?12:24);c.rotateX(PI/2);c.scale(1,1,.92);at(c,0,1.562,-.004);gAdd(G,c,PS.acc,()=>Wb('chest','neck',.3))}
  if(cl==='hoodie'){const h=new THREE.TorusGeometry(.125,.05,8,lod?10:20,PI*1.2);h.rotateX(PI/2);h.rotateY(PI*.9);h.scale(1.02,1.2,1.05);at(h,0,1.57,-.035);gAdd(G,h,PS.shirt,()=>Wb('chest','neck',.35),(x,y,z,nx,ny)=>ny<0?.8:.95);
    const pk=roundBox(.26,.12,.022,.01,1);at(pk,0,1.08,.147);gAdd(G,pk,PS.shirt,W1('spine'),(x,y,z,nx,ny)=>ny>.5?1:.88);
    if(!lod)for(const s of[-1,1]){const d=tube([{y:1.53,cx:s*.035,cz:.118,rx:.0045,rf:.0045,rb:.0045},{y:1.39,cx:s*.038,cz:.16,rx:.0045,rf:.0045,rb:.0045}],5,2,0,1);gAdd(G,d,PS.white,W1('chest'))}
    const wb=tube([{y:.93,cx:0,cz:0,rx:.222,rf:.147,rb:.144},{y:.89,cx:0,cz:0,rx:.218,rf:.143,rb:.14},{y:.89,cx:0,cz:0,rx:.205,rf:.13,rb:.13}],lod?16:30,2.6);gAdd(G,wb,PS.acc,W1('hips'))}
  if(cl==='flannel'){for(const s of[-1,1]){const f=roundBox(.085,.014,.065,.006,1);f.rotateZ(s*.6);f.rotateX(-.45);at(f,s*.055,1.545,.075);gAdd(G,f,PS.shirt,W1('chest'),()=>.92)}const c=new THREE.TorusGeometry(fem?.072:.09,.013,6,lod?12:22);c.rotateX(PI/2);at(c,0,1.565,-.01);gAdd(G,c,PS.shirt,()=>Wb('chest','neck',.3));if(!lod)for(let y=1.02;y<1.5;y+=.09){const b=new THREE.SphereGeometry(.008,6,4);b.scale(1,1,.5);const z=(o.big?.19:.14)+(o.big?.05*sm(.98,1.15,y)*sm(1.45,1.25,y):0);at(b,0,y,y>1.36?.15:z);gAdd(G,b,PS.white,y<1.24?W1('spine'):W1('chest'))}}
  if(cl==='polo'){for(const s of[-1,1]){const f=roundBox(.075,.012,.055,.006,1);f.rotateZ(s*.55);f.rotateX(-.4);at(f,s*.05,1.538,.07);gAdd(G,f,PS.shirt,W1('chest'),()=>.95)}
    const c=new THREE.TorusGeometry(fem?.072:.09,.012,6,lod?12:22);c.rotateX(PI/2);at(c,0,1.565,-.01);gAdd(G,c,PS.shirt,()=>Wb('chest','neck',.3));
    const pl=roundBox(.034,.13,.008,.003,1);at(pl,0,1.47,.13);gAdd(G,pl,PS.acc,W1('chest'));if(!lod)for(const y of[1.44,1.5]){const b=new THREE.SphereGeometry(.0065,6,4);at(b,0,y,.136);gAdd(G,b,PS.white,W1('chest'))}
    const bt=tube([{y:.975,cx:0,cz:0,rx:.205,rf:.135,rb:.133},{y:.935,cx:0,cz:0,rx:.207,rf:.137,rb:.135}],lod?16:30,2.6);gAdd(G,bt,PS.belt,W1('hips'));const bk=roundBox(.05,.034,.012,.004,1);at(bk,0,.955,.14);gAdd(G,bk,PS.metal,W1('hips'))}
  // pelvis (trousers) and legs
  {const PF_=fem?.94:1,pv=tube([{y:.99,cx:0,cz:0,rx:.185*PF_,rf:.118,rb:.116},{y:.92,cx:0,cz:0,rx:.192*PF_,rf:.122,rb:.126},{y:.85,cx:0,cz:0,rx:.175*PF_,rf:.115,rb:.125},{y:.79,cx:0,cz:0,rx:.1,rf:.08,rb:.09}],lod?14:24,2.4);
    gAdd(G,pv,PS.pants,(x,y)=>y>.88?[BI.hips]:Wb('hips',x<0?'lL':'lR',(.88-y)/.08*.5),(x,y,z,nx,ny,nz)=>(nz<-.3?.9:1)*(y<.84?.85:1))}
  for(const s of[-1,1]){const X=s*BP.lR[0],L=s<0?['lL','kL','fL']:['lR','kR','fR'],F=fem?.92:1;
    const LG=[[.9,.098,.1,.106],[.84,.104,.1,.112],[.72,.095,.091,.102],[.6,.08,.08,.088],[.51,.071,.074,.076],[.43,.069,.067,.086],[.33,.07,.062,.087],[.23,.061,.057,.068],[.155,.057,.056,.059],[.125,.065,.066,.068],[.098,.064,.064,.066]];
    const lg=tube(LG.map(([y,rx,rf,rb])=>({y,cx:X+s*(y>.6?(y-.6)*.015:0),cz:y<.56&&y>.44?.012:y<.3?-.008:0,rx:rx*F,rf:rf*F,rb:rb*F})),lod?10:16,2.2,0,0,(y,a)=>.003*Math.sin(a*5+y*70)*sm(.2,.12,y)+.0025*Math.sin(y*120+a*2)*sm(.58,.5,y)*sm(.4,.46,y));
    gAdd(G,lg,cl==='bare'?(x,y)=>y<.6?PS.skin:PS.pants:PS.pants,(x,y)=>y>.56?(y>.84?Wb(L[0],'hips',(y-.84)/.1*.4):[BI[L[0]]]):y>.44?Wb(L[0],L[1],(.56-y)/.12):[BI[L[1]]],(x,y,z,nx,ny,nz)=>(y<.14?.86:1)*(nx*s<-.4?.9:1)*(y>.8&&nx*s<-.2?.85:1));
    addShoe(G,X,L,lod)}
  // arms: shoulder dome, deltoid, bicep, elbow, forearm, wrist; sleeves; hands
  const sx=Math.abs(BP.aL[0]);
  for(const s of[-1,1]){const X=s*sx,A=s<0?['aL','eL','hL']:['aR','eR','hR'],F=fem?.84:1,cz=y=>y>1.19?-.01-.015*(1.47-y)/.28:-.025+.025*(1.19-y)/.235;
    const ring=([y,rx,rf,rb])=>({y,cx:X-s*((y>1.44?.008:0)+(fem?.02:.026)*sm(1.28,1.45,y)),cz:cz(y),rx:rx*F,rf:rf*F,rb:(rb||rf)*F});
    const AR=[[1.49,.072,.07],[1.46,.086,.083],[1.41,.088,.083],[1.36,.083,.079],[1.29,.078,.076],[1.235,.068,.066],[1.19,.06,.062],[1.14,.066,.068],[1.08,.06,.06],[1.01,.047,.047],[.975,.043,.044]].map(ring);const HF=(fem?1.2:1.34)/F;AR.push(...[[.952,.034,.05,.05],[.915,.031,.058,.056],[.875,.029,.06,.057],[.842,.025,.055,.052]].map(([y,rx,rf,rb])=>({y,cx:X-s*.004,cz:.008,rx:rx*HF*F,rf:rf*HF*F,rb:rb*HF*F})));
    const aw=(x,y)=>y>1.4?Wb(A[0],'chest',(y-1.4)/.15*.55):y>1.24?[BI[A[0]]]:y>1.14?Wb(A[0],A[1],(1.24-y)/.1):y>.995?[BI[A[1]]]:Wb(A[1],A[2],(.995-y)/.07);
    gAdd(G,tube(AR,lod?8:14,2.1,2,2),(x,y)=>y<.97||!(cl==='hoodie'||cl==='flannel')?PS.skin:PS.sleeve,aw,(x,y,z,nx,ny,nz)=>(nx*s<-.3?.86:1)*(y>1.2&&y<1.32&&nx*s<-.5?.9:1)*(y<.96&&nx*s<-.4?.92:1));
    if(cl==='tee'||cl==='polo'){const SL=[[1.497,.08,.078],[1.462,.097,.093],[1.41,.099,.093],[1.36,.095,.089],[1.3,.092,.086],[1.278,.091,.085],[1.275,.076,.073]].map(ring);
      gAdd(G,tube(SL,lod?8:14,2.2,2,0,(y,a)=>.003*Math.sin(a*4+y*60)*sm(1.4,1.3,y)),PS.sleeve,aw,(x,y,z,nx)=>(y<1.3?.86:1)*(nx*s<-.3?.9:1));
      gAdd(G,tube([[1.318,.094,.088],[1.31,.1,.094],[1.285,.1,.094],[1.272,.096,.09]].map(ring),lod?8:14,2.2),PS.sleeve,aw,(x,y,z,nx,ny)=>(y<1.29?.8:.95)*(nx*s<-.3?.92:1));
      if(!lod)gAdd(G,tube([[1.434,.1035,.0975],[1.425,.1075,.1015],[1.411,.1075,.1015],[1.402,.1035,.0975]].map(ring),14,2.2),PS.sleeve,aw,(x,y,z,nx)=>.9*(nx*s<-.3?.92:1))}
    if(cl==='hoodie'||cl==='flannel'){const cf=tube([{y:1.03,cx:X,cz:-.005,rx:.056*F,rf:.056*F,rb:.056*F},{y:.96,cx:X,cz:.004,rx:.05*F,rf:.054*F,rb:.054*F},{y:.956,cx:X,cz:.004,rx:.036*F,rf:.044*F,rb:.044*F}],lod?8:12,2,0,2);gAdd(G,cf,PS.acc,(x,y)=>y>.995?[BI[A[1]]]:Wb(A[1],A[2],(.995-y)/.07));
      gAdd(G,tube(AR.map(r=>Object.assign({},r,{rx:r.rx+.008,rf:r.rf+.008,rb:r.rb+.008})).filter(r=>r.y>1.02&&r.y<1.6),lod?8:14,2.1,2,0,(y,a)=>.004*Math.sin(a*3+y*55)),PS.sleeve,aw,(x,y,z,nx)=>nx*s<-.3?.86:1)}
    addHand(G,X,s,A,fem,lod)}
  return BODYG[k]=gBuild(G)}
