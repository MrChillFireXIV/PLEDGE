// ================================================================ INTERIORS (separate area of the map, reached by door teleport)
const INT={},IFL={};let islotN=0,COMPT=null,BOOKM=null;
function ifloor(k){if(IFL[k])return IFL[k];const t=k==='wood'?ctex(256,256,(q,w,h)=>{for(let y=0;y<h;y+=32)for(let x=-((y/32)%2)*64;x<w;x+=128){q.fillStyle=shade('#8a5a34',rnd()*26-13);q.fillRect(x,y,127,31)}q.fillStyle='rgba(0,0,0,.28)';for(let y=0;y<h;y+=32)q.fillRect(0,y+31,w,1)}):k==='tile'?ctex(256,256,(q,w,h)=>{for(let y=0;y<h;y+=32)for(let x=0;x<w;x+=32){q.fillStyle=((x+y)/32)%2?'#ebe5d8':'#2c2c33';q.fillRect(x,y,32,32)}}):k==='carpet'?ctex(128,128,(q,w,h)=>{q.fillStyle='#6a2a30';q.fillRect(0,0,w,h);speck(q,w,h,3500,350,40,16,30,2)}):k==='court'?ctex(256,256,(q,w,h)=>{for(let x=0;x<w;x+=16){q.fillStyle=shade('#c8955a',rnd()*18-9);q.fillRect(x,0,15,h)}}):ctex(256,256,(q,w,h)=>{q.fillStyle='#9a958a';q.fillRect(0,0,w,h);speck(q,w,h,4000,40,6,50,66,2)});t.anisotropy=4;return IFL[k]=SM({map:t,roughness:.7})}
function mkInt(id,w,d,o){let x0,z0;if(o.at){[x0,z0]=o.at}else{const col=islotN%4,row=Math.floor(islotN/4);islotN++;x0=8+col*86;z0=OD+640+row*76}   // V137 o.at: a fixed slot for oversized rooms
  const dX=o.doorX!=null?o.doorX:w/2;const I={id,x0,z0,x1:x0+w,z1:z0+d,w,d,dX,name:o.name,objs:[],walls:[],staff:[],wc:o.wall||0xd9ceb4,lc:o.low||0x5a3a24,floor:o.floor||'wood',wm:o.wm||null,lm:o.lm||null,rail:o.rail!=null?o.rail:null};INT[id]=I;
  const holeRects=(h)=>h?[[0,0,w,h[1]],[0,h[3],w,d],[0,h[1],h[0],h[3]],[h[2],h[1],w,h[3]]]:[[0,0,w,d]];
  for(const[a,b,c,e]of holeRects(o.hole))if(c>a&&e>b)flat(x0+a,z0+b,x0+c,z0+e,.02,ifloorX(o.floor||'wood'),String(o.floor).startsWith('carpet')?3:6);
  for(const[a,b,c,e]of holeRects(o.chole))if(c>a&&e>b){const cm=new THREE.Mesh(new THREE.PlaneGeometry(c-a,e-b),mt(o.ceil||0xeee8da,.95));cm.rotation.x=PI/2;cm.position.set(x0+(a+c)/2,6.02,z0+(b+e)/2);sc.add(cm)}
  iwall(I,0,0,w,0);iwall(I,0,d,w,d);iwall(I,0,0,0,d);iwall(I,w,0,w,d);(o.walls||[]).forEach(s=>iwall(I,...s));
  if(!o.up){box(x0+dX,1.75,z0+d-.3,2.6,3.5,.2,0x3d2617,0);box(x0+dX,3.6,z0+d-.3,3.2,.3,.26,0xefe9db,0);
  {const s=signMesh('EXIT',1.3,.48,'#1a0a0a','#ff5a4a','Archivo');s.position.set(x0+dX,4.2,z0+d-.45);s.rotation.y=PI;sc.add(s)}
  flat(x0+dX-1.6,z0+d-2.4,x0+dX+1.6,z0+d-.45,.045,mt(0x3a2a20,.95));
  I.ix=x0+dX;I.iz=z0+d-2.8;I.objs.push({x:x0+dX,z:z0+d-1.4,r:1.9,label:'Exit to campus',f:()=>exitInt()})}
  for(let x=6;x<w;x+=12)for(let z=6;z<d;z+=12){const l=new THREE.Mesh(GC.ilt||(GC.ilt=new THREE.CylinderGeometry(.65,.65,.08,18)),bm(0xfff4d6));l.position.set(x0+x,5.95,z0+z);sc.add(l)}
  ZN[id]=[x0+1.4,z0+1.4,x0+w-1.4,z0+d-3.6];return I}
function iwall(I,ax,az,bx,bz){const t=.3,h=6,hz=az===bz,x0=I.x0+Math.min(ax,bx),x1=I.x0+Math.max(ax,bx),z0=I.z0+Math.min(az,bz),z1=I.z0+Math.max(az,bz),cx=(x0+x1)/2,cz=(z0+z1)/2,L=hz?x1-x0+t:z1-z0+t,Le=L+.06;
  const mk=(w,hh,d,y,mat,u,cast)=>{if(mat&&mat.map){const e=new THREE.Mesh(boxUV(new THREE.BoxGeometry(w,hh,d),w,hh,d,u),mat);e.position.set(cx,y,cz);e.castShadow=!!cast;e.receiveShadow=true;sc.add(e);return e}return box(cx,y,cz,w,hh,d,mat,cast)};
  mk(hz?L:t,h,hz?t:L,h/2,I.wm||I.wc,2.4,1);mk(hz?Le:t+.1,1.2,hz?t+.1:Le,.6,I.lm||I.lc,1.2,0);
  if(I.rail!=null)box(cx,1.22,cz,hz?L+.1:t+.16,.07,hz?t+.16:L+.1,I.rail,0);
  box(cx,5.85,cz,hz?Le:t+.12,.3,hz?t+.12:Le,0xf2ece0,0);
  markR(x0-t/2,z0-t/2,x1+t/2,z1+t/2,h);I.walls.push([x0,z0,x1,z1])}
const iobj=(I,x,z,label,f,r=1.8)=>I.objs.push({x:I.x0+x,z:I.z0+z,r,label,f});
function fb(I,x,z,w,d,h,c,y0=0,col=1){const e=box(I.x0+x,y0+h/2,I.z0+z,w,h,d,typeof c==='number'?mt(c,.75):c);if(col&&y0<1)markR(I.x0+x-w/2,I.z0+z-d/2,I.x0+x+w/2,I.z0+z+d/2,y0+h);return e}
function frug(I,x,z,w,d,c){return flat(I.x0+x-w/2,I.z0+z-d/2,I.x0+x+w/2,I.z0+z+d/2,.035,mt(c,.95))}
function fsofa(I,x,z,len,face,c){const[nx,nz]=FACE[face],ew=nx!==0;fb(I,x,z,ew?1.2:len,ew?len:1.2,.55,c);fb(I,x-nx*.5,z-nz*.5,ew?.3:len,ew?len:.3,1.15,c,0,0);for(const s of[-1,1])fb(I,x+(ew?0:s*(len/2-.15)),z+(ew?s*(len/2-.15):0),ew?1.2:.3,ew?.3:1.2,.82,c,0,0)}
function fbed(I,x,z,c){fb(I,x,z,1.8,3,.5,0x3a2414);markTop(I.x0+x-.81,I.z0+z+.15-1.3,I.x0+x+.81,I.z0+z+.15+1.3,.72);fb(I,x,z+.15,1.62,2.6,.22,c,.5,0);fb(I,x,z-1.1,1.1,.5,.16,0xeeeae0,.62,0);fb(I,x,z-1.45,1.9,.14,1.3,0x3a2414,0,0)}
function ftable(I,x,z,w,d,c){box(I.x0+x,.88,I.z0+z,w,.08,d,mt(c,.55));for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])box(I.x0+x+a*(w/2-.15),.42,I.z0+z+b*(d/2-.15),.1,.84,.1,c,0);markR(I.x0+x-w/2,I.z0+z-d/2,I.x0+x+w/2,I.z0+z+d/2,.95)}
function fchair(I,x,z,c=0x2a1a10){fb(I,x,z,.55,.55,.48,c)}
function bookM(){return BOOKM||(BOOKM=SM({map:ctex(256,64,(q,w,h)=>{q.fillStyle='#1a120c';q.fillRect(0,0,w,h);let x=0;while(x<w){const bw=6+rnd()*8;q.fillStyle=pick(['#6a2a2a','#2a3a5a','#3a5a3a','#5a4a2a','#8a6a2a','#4a2a4a','#d8cbb0']);q.fillRect(x,rnd()*12,bw-1,h);x+=bw}}),roughness:.8}))}
function fshelf(I,x,z,len,ew){fb(I,x,z,ew?.7:len,ew?len:.7,3.3,0x3a2415);for(let s=0;s<3;s++){const W=ew?.76:len-.3,D=ew?len-.3:.76;const m=new THREE.Mesh(boxUV(new THREE.BoxGeometry(W,.72,D),W,.72,D,1.5),bookM());m.position.set(I.x0+x,.62+s*1,I.z0+z);sc.add(m)}}
function ftv(I,x,z,face){const[nx,nz]=FACE[face],ew=nx!==0;fb(I,x,z,ew?.6:2.4,ew?2.4:.6,.7,0x2a2a30);const s=new THREE.Mesh(bgeo(ew?.1:2.7,1.5,ew?2.7:.1),bm(0x3a6ab0));s.position.set(I.x0+x+nx*.05,1.6,I.z0+z+nz*.05);sc.add(s)}
function ffire(I,x,z,face){const[nx,nz]=FACE[face],ew=nx!==0;fb(I,x,z,ew?.9:3,ew?3:.9,2.6,0x8a8478);const f=new THREE.Mesh(bgeo(ew?.22:1.6,.9,ew?1.6:.22),bm(0xff8a2a));f.position.set(I.x0+x+nx*.38,.7,I.z0+z+nz*.38);sc.add(f)}
function fplant(I,x,z){cyl(I.x0+x,.35,I.z0+z,.35,.7,0x8a4a2a);const p=new THREE.Mesh(GC.pl||(GC.pl=new THREE.IcosahedronGeometry(.72,0)),mt(0x3a6a2a,.9));p.position.set(I.x0+x,1.3,I.z0+z);p.castShadow=true;sc.add(p);markC(I.x0+x,I.z0+z,.42,1.6)}
function fpong(I,x,z){fb(I,x,z,2.6,1.2,.9,0x2b4a7a);const cg=GC.cup||(GC.cup=new THREE.CylinderGeometry(.06,.045,.14,10));for(const s of[-1,1])for(let r=0;r<3;r++)for(let c=0;c<3-r;c++){const m=new THREE.Mesh(cg,mt(0xc0302a,.5));m.position.set(I.x0+x+s*(1.05-r*.12),.97,I.z0+z+(c-(2-r)/2)*.13);sc.add(m)}}
function fpool(I,x,z){fb(I,x,z,2.8,1.6,.72,0x4a2a18);fb(I,x,z,2.5,1.3,.08,0x1f6a3a,.72,0)}
function wsign(I,x,z,face,y,text,w,h,bg,fg,font){const m=signMesh(text,w,h,bg,fg,font);m.position.set(I.x0+x,y,I.z0+z);m.rotation.y=fry(face);sc.add(m);return m}
const PAINTS=[];function paintTex(){if(PAINTS.length<6)PAINTS.push(ctex(128,96,(q,W,H)=>{const g=q.createLinearGradient(0,0,0,H);g.addColorStop(0,`hsl(${190+rnd()*40},45%,60%)`);g.addColorStop(1,`hsl(${30+rnd()*20},50%,80%)`);q.fillStyle=g;q.fillRect(0,0,W,H);for(let i=0;i<3;i++){q.fillStyle=`hsl(${90+rnd()*60},30%,${28+i*8}%)`;q.beginPath();q.moveTo(0,H);q.quadraticCurveTo(rnd()*W,H*.35+rnd()*20,W,H);q.fill()}q.fillStyle='#f6d36b';q.beginPath();q.arc(20+rnd()*90,20,8,0,TAU);q.fill()}));return pick(PAINTS)}
const COMPC={},PICM={};
function compTex(L,year,empty){const k=L+year+(empty?'e':'');if(COMPC[k])return COMPC[k];return COMPC[k]=ctex(128,112,(q,W,H)=>compPaint(q,W,H,L,year,empty))}
function compPaint(q,W,H,L,year,empty){{q.fillStyle=empty?'#3a3330':'#1d1a16';q.fillRect(0,0,W,H);q.fillStyle='#b08a3a';q.fillRect(0,0,W,16);q.fillStyle='#1d1a16';q.font='bold 12px Georgia,serif';q.textAlign='center';q.textBaseline='middle';q.fillText(L,W/2,8.5);
  if(empty){q.fillStyle='#8a8070';q.beginPath();q.arc(W/2,H/2+2,3,0,TAU);q.fill();q.strokeStyle='rgba(0,0,0,.35)';q.strokeRect(10,24,W-20,H-46)}
  else{const rows=4,cols=7;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=10+c*(W-20)/(cols-1),y=28+r*16;q.fillStyle=pick(['#e0b090','#c08a5c','#8a5a3a','#f0c8a8','#6e4630']);q.beginPath();q.ellipse(x,y,5,6.5,0,0,TAU);q.fill();q.fillStyle=pick(['#2a1d14','#4a3020','#c9a46a','#151515']);q.beginPath();q.ellipse(x,y-4,5,3,0,PI,0);q.fill();q.fillStyle='#1d2440';q.fillRect(x-5,y+5,10,4)}}
  q.fillStyle='#b08a3a';q.fillRect(0,H-16,W,16);q.fillStyle='#1d1a16';q.font='bold 12px Georgia,serif';q.fillText(empty?year+' —':'PLEDGE CLASS '+year,W/2,H-7.5)}}
// V120 atlas: each house's composites are tiles (128×112, 8×9 per 1024² sheet) on shared sheets, so ~50 frames per house use one texture and one
// material (and merge into one draw call) instead of 50 of each. compTile returns the sheet's material and the tile's UV rectangle.
const COMPA={};
function compTile(L,year,empty){const k=year+(empty?'e':'');const pages=COMPA[L]||(COMPA[L]=[]);for(const pg of pages)if(pg.slots[k])return pg.slots[k];
  let pg=pages[pages.length-1];if(!pg||pg.n>=72){const t=ctex(512,512,(q,W,H)=>{q.fillStyle='#1d1a16';q.fillRect(0,0,W,H)});pg={t,q:t.image.getContext('2d'),n:0,slots:{},mat:new THREE.MeshBasicMaterial({map:t})};pages.push(pg)}
  const tx=(pg.n%8)*64,ty=Math.floor(pg.n/8)*56;pg.n++;const q=pg.q;q.save();q.translate(tx,ty);q.scale(.5,.5);q.beginPath();q.rect(0,0,128,112);q.clip();compPaint(q,128,112,L,year,empty);q.restore();pg.t.needsUpdate=true;   /* V296 half-size tiles on 512 px pages */
  return pg.slots[k]={mat:pg.mat,u0:(tx+.5)/512,u1:(tx+63.5)/512,v0:1-(ty+55.5)/512,v1:1-(ty+.5)/512}}
function tileGeo(w,h,T){const g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,T.u0+uv.getX(i)*(T.u1-T.u0),T.v0+uv.getY(i)*(T.v1-T.v0));return g}
const picMat=t=>PICM[t.uuid]||(PICM[t.uuid]=new THREE.MeshBasicMaterial({map:t}));
function compWall(I,L,ax,az,bx,bz,face,skip=[],y=3.3){const hz=az===bz,a0=hz?ax:az,a1=hz?bx:bz,yrs=I.yrs;for(let t=a0;t<=a1+1e-6;t+=2.1){if(skip.some(([u,v])=>t>u-1&&t<v+1))continue;const yr=yrs[(I.yi=(I.yi||0)+1)%yrs.length];wframe(I,hz?t:ax,hz?az:t,face,y,1.5,1.3,{comp:[L,yr]})}}
function fswords(I,x,z,face,y,col){const g=new THREE.Group(),M_=c=>mt(c,.4,.5);const sh=new THREE.Mesh(GC.shield||(GC.shield=new THREE.CylinderGeometry(.62,.62,.08,22).rotateX(PI/2)),M_(col));sh.position.z=.07;g.add(sh);const rim=new THREE.Mesh(GC.rim||(GC.rim=new THREE.TorusGeometry(.62,.05,6,22)),M_(0xc9a046));rim.position.z=.1;g.add(rim);const boss=new THREE.Mesh(bgeo(.26,.26,.06),M_(0xc9a046));boss.rotation.z=PI/4;boss.position.z=.13;g.add(boss);
  for(const sgn of[-1,1]){const sw=new THREE.Group();const add=(ge,c,px,py)=>{const m=new THREE.Mesh(ge,M_(c));m.position.set(px,py,0);sw.add(m)};add(bgeo(.08,2.1,.025),0xdfe4ea,0,.35);add(bgeo(.46,.08,.08),0xc9a046,0,-.72);add(bgeo(.08,.36,.08),0x4a2a18,0,-.94);add(bgeo(.12,.12,.12),0xc9a046,0,-1.15);sw.rotation.z=sgn*.72;sw.position.z=.03;g.add(sw)}
  g.position.set(I.x0+x,y,I.z0+z);g.rotation.y=fry(face);sc.add(g)}
function houseDecor(I,o){const L=o.letters;I.yrs=[];for(let yv=1952;yv<=2024;yv+=1+Math.floor(rnd()*3))I.yrs.push(yv);if(I.id==='asr')I.yrs=I.yrs.filter(v=>v!==2019);
  if(I.id==='asr'){compWall(I,L,14.2,2,14.2,12,'e');compWall(I,L,33.8,2,33.8,12,'w',[[8.3,8.3]])}
  compWall(I,L,1,14.2,47,14.2,'s',[[5,9],[22,26],[39,43]]);compWall(I,L,1,17.8,47,17.8,'n',[[5,9],[22,26],[39,43]]);
  fb(I,8,35.25,3.6,.55,.14,0x5a3a24,2.6,0);fswords(I,8,35.82,'n',4.05,o.shield);fswords(I,24,.18,'s',5.05,o.shield);fswords(I,47.82,7,'w',4.55,o.shield);fswords(I,24,35.82,'n',4.9,o.shield);
  if(I.id==='asr')wframe(I,33.8,8.3,'w',3.3,1.5,1.3,{comp:[L,2019,1]})}   // V134: the empty 2019 frame sits in the composite row, not behind the throne
function wframe(I,x,z,face,y,w=1.6,h=1.2,kind){if(!COMPT)COMPT=ctex(128,96,(q,W,H)=>{q.fillStyle='#1d1a16';q.fillRect(0,0,W,H);for(let r=0;r<4;r++)for(let c=0;c<7;c++){q.fillStyle=pick(['#e0b090','#c08a5c','#8a5a3a','#f0c8a8']);q.beginPath();q.ellipse(10+c*17,14+r*22,5,7,0,0,TAU);q.fill()}});const g=new THREE.Group();const fr=new THREE.Mesh(bgeo(w+.18,h+.18,.06),mt(0xb08a3a,.4,.5));let pic;if(kind&&kind.comp){const T=compTile(...kind.comp);pic=new THREE.Mesh(tileGeo(w,h,T),T.mat)}else pic=new THREE.Mesh(new THREE.PlaneGeometry(w,h),picMat(kind==='paint'?paintTex():COMPT));pic.position.z=.035;g.add(fr,pic);g.position.set(I.x0+x,y,I.z0+z);g.rotation.y=fry(face);sc.add(g)}
function chand(I,x,z){const t=new THREE.Mesh(GC.chd||(GC.chd=new THREE.TorusGeometry(1,.06,6,18)),bm(0xffd884));t.rotation.x=PI/2;t.position.set(I.x0+x,4.7,I.z0+z);sc.add(t);for(let i=0;i<6;i++){const a=i/6*TAU;const b=new THREE.Mesh(GC.bulb||(GC.bulb=new THREE.SphereGeometry(.09,8,6)),bm(0xfff2c0));b.position.set(I.x0+x+Math.cos(a),4.8,I.z0+z+Math.sin(a));sc.add(b)}}
const STX0=28.6,STX1=31.4,STZT=19.6,STZB=31.1,STH=6.2,STAIRR=[];
function stairSteps(I,up,col,rug){if(up){STAIRR.push([I.x0+STX0-.4,I.z0+STZT-.8,I.x0+STX1+.6,I.z0+STZB+1]);return}
  const N=28,d=(STZB-STZT)/N,ri=STH/N,W=STX1-STX0,cx=I.x0+(STX0+STX1)/2,rc=rug||0x7d1f2c;
  for(let k=0;k<N;k++){const zf=STZB-k*d,zc=zf-d/2,top=(k+1)*ri;
    box(cx,top/2,I.z0+zc,W,top,d,0x4a3020,0);
    box(cx,top+.025,I.z0+zc+.03,W+.1,.05,d+.06,0x9a6a3e,0);
    box(cx,top+.055,I.z0+zc,1.55,.02,d,rc,0);
    box(cx,top-ri/2+.03,I.z0+zf+.035,1.55,ri,.02,rc,0)}
  const L=Math.hypot(STZB-STZT,STH),ang=Math.atan2(STH,STZB-STZT),zm=I.z0+(STZT+STZB)/2;
  for(const[x,w,h,yo,c]of[[STX0-.06,.14,.55,0,0x3a2415],[STX1+.2,.4,.55,0,0x3a2415],[STX0-.12,.1,.1,1.05,0x2a170c],[STX1+.25,.07,.07,.95,0x2a170c]]){const m=new THREE.Mesh(bgeo(w,h,L+.4),mt(c,.6));m.position.set(I.x0+x,STH/2+yo,zm);m.rotation.x=ang;m.castShadow=true;sc.add(m)}
  for(let k=0;k<N;k++){const z=STZB-(k+.5)*d,top=(k+1)*ri;box(I.x0+STX0-.12,top+.52,I.z0+z,.045,1,.045,0xf2ece0,0)}
  box(I.x0+STX0-.12,.7,I.z0+STZB+.2,.2,1.4,.2,0x2a170c);box(I.x0+STX0-.12,1.45,I.z0+STZB+.2,.26,.12,.26,0x9a6a3e,0);
  box(I.x0+STX0-.12,STH+.6,I.z0+STZT-.15,.2,1.2,.2,0x2a170c,0);
  box(cx,.012,I.z0+STZB+.9,2.4,.02,1.2,rc,0)}
// V198 height of the stairs under a point in the interior Danny is in (for trail studs and the marker), and whether it is on a staircase
function intStair(x,z){const id=P.inside;if(!id)return null;const I=INT[id];if(!I)return null;const lx=x-I.x0,lz=z-I.z0;
  if(typeof C3SW!=='undefined'&&typeof c3StairOK==='function'&&c3StairOK()&&(id==='asr_up'||id==='asr_top')){const[a,b,c,e]=C3SW;if(lx>a&&lx<c&&lz>b-.3&&lz<e+.1){if(id==='asr_up')return clamp((lz-b)/(e-b)*C3SH,0,C3SH);if(lz<e)return-clamp((e-lz)/(e-b)*C3SH,0,C3SH)}}
  const base=id.replace(/_up$/,'');if(!INT[base+'_up']||!(lx>STX0&&lx<STX1))return null;if(id.endsWith('_up')){if(lz<STZT||lz>STZB+.2)return null;return-clamp((lz-STZT)/(STZB-STZT)*STH,0,STH)}
  if(lz<STZT-.6||lz>STZB+.2)return null;return clamp((STZB-lz)/(STZB-STZT)*STH,0,STH)}
function onStairsLocal(lx,lz){return lx>STX0&&lx<STX1}
function daisAt(){if(!P.inside||P.inside!=='asr')return 0;const I=INT.asr,dx=P.x-I.x0,dz=P.z-I.z0;return dx>19.8&&dx<28.2&&dz>.6&&dz<4.8}
function stairY(){if(P.inside==='asr_up'||P.inside==='asr_top'){const y=typeof c3StairY==='function'?c3StairY():null;if(y!=null)return y}if(!P.inside){const dy=deckHere();if(dy!=null)return dy;return onDock(P.x,P.z)?.5:terrH(P.x,P.z)}const I=INT[P.inside];if(P.inside==='asr_bsmt'){const lx=P.x-I.x0,lz=P.z-I.z0;if(Math.abs(lx-DUNG.sx)<1.55&&lz>DUNG.D-7)return clamp((lz-(DUNG.D-7))/5*2.5,0,2.5);return 0}   // V138 the dungeon stair
if(P.inside==='asr'){const dx=P.x-I.x0,dz=P.z-I.z0;if(dx>21.5&&dx<26.5&&dz>.8&&dz<3.6)return .6;if(dx>19.8&&dx<28.2&&dz>.6&&dz<4.8)return .3}const up=P.inside.endsWith('_up'),base=P.inside.replace(/_up$/,'');if(!INT[base+'_up'])return 0;const lx=P.x-I.x0,lz=P.z-I.z0;if(!onStairsLocal(lx,lz)||P.stLz!=null&&Math.abs(lz-P.stLz)>1.5){P.stLz=lz;P.stOn=0;return 0}P.stLz=lz;if(!P.stOn){if(up?(lz>STZT-1.5&&lz<STZT+1.2):(lz>STZB-1.2&&lz<STZB+2))P.stOn=1;else return 0}
  if(!up){if(lz<STZT-.6||lz>STZB+.2)return 0;return clamp((STZB-lz)/(STZB-STZT)*STH,0,STH)}if(lz<STZT)return 0;return-clamp((lz-STZT)/(STZB-STZT)*STH,0,STH)}
function stairCheck(){if(!P.inside)return;const up=P.inside.endsWith('_up'),base=P.inside.replace(/_up$/,'');if(!INT[base+'_up'])return;const I=INT[P.inside],lx=P.x-I.x0,lz=P.z-I.z0;if(!onStairsLocal(lx,lz)||!P.stOn)return;
  let to=null,fx=0,fz=0;if(!up&&lz<STZT+1&&lz>STZT-1.2){to=base+'_up';fx=30;fz=17.4}else if(up&&lz>STZB-.6&&lz<STZB+1.5){to=base;fx=26.6;fz=STZB+2.2}if(!to)return;
  const T=INT[to];P.inside=to;showInt(to);P.x=T.x0+lx;P.z=T.z0+lz;let i=0;for(const n of NP){if(!n.follow||n.down)continue;n.int=to;n.x=T.x0+fx+(i%2)*1.2;n.z=T.z0+fz+Math.floor(i/2)*1.2;n.path=null;n.aggro=0;i++}}
function houseInt(id,o){const hs=hsty(id);const I=mkInt(id,64,36,{doorX:24,chole:o.up?[STX0-.2,STZT-.8,STX1+.4,STZB+.8]:null,name:o.name,floor:hs.floor,wall:o.wall,low:o.low,wm:wallTex(hs.paper,o.wall),lm:wainTex(hs.wains,o.low),rail:hs.paper==='plank'?0x2a1a0e:hs.pk([0xf2ece0,0x3a2415,0xf2ece0]),walls:[[48,0,48,14],[48,18,48,28],[48,32,48,36],[48,14,50.5,14],[53.5,14,58.5,14],[61.5,14,64,14],[56,0,56,14],[48,18,54,18],[58,18,64,18],[0,14,5,14],[9,14,22,14],[26,14,39,14],[43,14,48,14],[14,0,14,14],[34,0,34,14],[0,18,5,18],[9,18,22,18],[26,18,39,18],[43,18,48,18],[16,18,16,27],[16,30,16,36]].concat(o.up?[[32,21,32,36]]:[[32,18,32,27],[32,30,32,36]])});
  for(const x of[2.5,7,11.5])fbed(I,x,2.4,o.bed);fb(I,12.9,11,1.4,.7,1.7,0x5a3a24);fplant(I,1.2,12.5);
  let spots=[];if(id==='asr')throneRoom(I,o);else spots=spots.concat(hChapter(I,o,hs));
  spots=spots.concat(hGame(I,o,hs),hLiving(I,o,hs),hFoyer(I,o,hs),hBedroom(I,o,hs,0));houseDecor(I,o);
  frugP(I,24,27.5,4,15,o.rug,'stripe');chand(I,24,26);
  wsign(I,24,18.25,'s',4.7,o.letters,3.6,1,o.lb,'#e2b64c');fplant(I,17.2,34.8);fplant(I,26.8,34.8);
  spots=spots.concat(hDining(I,o,hs));wing(I,o,14,18,1);
  if(YDEF[id])backDoorIn(I,id);
  if(id==='asr')try{dungDoor(I)}catch(e){console.warn('dungeon door',e)}
  try{spots=houseExtras(I,o,hs,spots)}catch(e){console.warn('house extras',id,e)}
  try{hangDecor(I,o,hs,spots,hs.soro?['paddles','grp','paint','mirror','pennants']:['paddles','grp','paint','swords','deer','grpBig'])}catch(e){console.warn('house decor',id,e)}
  if(o.up){stairSteps(I,0,0x6a4a2a,o.rug);markR(I.x0+STX0-.45,I.z0+18,I.x0+STX1,I.z0+STZT+.1,7);markR(I.x0+STX0-.45,I.z0+STZT,I.x0+STX0-.05,I.z0+STZB-1.6,2);markR(I.x0+STX1,I.z0+STZT-.9,I.x0+32,I.z0+36,7);wsign(I,30,35.78,'n',3.3,'UP ↑',1.3,.45,'#14203a','#e2b64c','Archivo');
  /* V153 the 1.5 m slot between the top of the stairs and the north wall was open, so from the stair room you could look straight through it into the next room. Fill it with stair-coloured solid (same as the steps). */
  box(I.x0+(STX0+STX1)/2,3.05,I.z0+(18.1+STZT+.05)/2,STX1-STX0,6.1,STZT+.05-18.1,0x4a3020,0)}
  return I}
// wing with bathroom, laundry room and kitchen (x 48-64), reached from the hallway
function wing(I,o,h0,h1,diningDoor){const C=0xe8e8e8;
  frug(I,52,h0/2,7,h0-1.2,0xcfd8dc);for(const z of[2,5.5])fb(I,49.1,z,1.2,1,1.6,0xf2f2f2);for(const z of[2,5.5])fb(I,49.5,z+.8,.1,.06,1,0x8a8a8a,1.2,0);for(let k=0;k<2;k++)fb(I,55.2,2.4+k*3.6,1.2,2.4,2.2,0xb8c4cc);fb(I,48.4,h0-3.8,.6,3.6,.9,0xdedede);box(I.x0+48.42,.92,I.z0+h0-3.8,.36,.04,.9,0x9aa6ae,0);box(I.x0+48.2,1.08,I.z0+h0-3.8,.05,.28,.05,0xb8bcc0,0);box(I.x0+48.08,1.7,I.z0+h0-3.8,.05,.9,3.2,0xa8c4d8,0);   /* V160 vanity on the west wall: it used to stand right across the bathroom door */
  wsign(I,52,h0+.18,'s',4.3,'BATHROOM',2.6,.5,'#14203a','#e2b64c','Archivo');
  iobj(I,49.3,h0-3.8,'Wash up at the sink (restores stamina)',()=>{S.sta=staMax();S.hp=Math.min(S.mhp,S.hp+5);toast('You splash cold water on your face. Stamina restored.')},1.7);
  for(let k=0;k<3;k++){fb(I,57.2,2+k*2.2,1.4,1.8,1.5,C);const dr=new THREE.Mesh(GC.wd||(GC.wd=new THREE.CylinderGeometry(.42,.42,.06,16).rotateZ(PI/2)),mt(0x2a3a4a,.3));dr.position.set(I.x0+57.95,.85,I.z0+2+k*2.2);sc.add(dr)}
  for(let k=0;k<3;k++){fb(I,62.8,2+k*2.2,1.4,1.8,1.5,0xd8d8d8);const dr=new THREE.Mesh(GC.wd,mt(0x3a3a3a,.3));dr.position.set(I.x0+62.05,.85,I.z0+2+k*2.2);sc.add(dr)}
  fb(I,60,h0-2.6,2.6,1.2,.9,0x8a6a44);fb(I,58,h0-1.4,.8,.8,.6,0x3a7ad6);wsign(I,60,h0+.18,'s',4.3,'LAUNDRY',2.4,.5,'#14203a','#e2b64c','Archivo');
  iobj(I,60,h0-4,'Do a load of laundry (1 hour)',()=>{if(S.daily.laundry===S.day)return toast('Your clothes are already clean today.');S.daily.laundry=S.day;advance(1);const f=1+Math.floor(rnd()*4);money(f);toast(`Clean clothes, and $${f} you forgot in a pocket.`)},1.7);
  const kz=h1;fb(I,63.3,kz+10.5,1.2,8,.95,0x8a8a8a);fb(I,63.2,kz+2,1.3,1.4,2.3,C);fb(I,63.2,kz+5,1.3,1.3,.95,0x2a2a2a);for(const[a,b]of[[-.3,-.3],[.3,-.3],[-.3,.3],[.3,.3]]){const bu=new THREE.Mesh(GC.bur||(GC.bur=new THREE.CylinderGeometry(.16,.16,.03,12)),mt(0x111111));bu.position.set(I.x0+63.2+a,.97,I.z0+kz+5+b);sc.add(bu)}
  fb(I,55.5,35.2,12,1.2,.95,0x8a8a8a);fb(I,56,kz+8,4,2,.95,0x6a4a2c);for(const x of[54.6,57.4])fchair(I,x,kz+9.6,0x2a2a30);box(I.x0+56,4.6,I.z0+kz+8,.04,2,.04,0x222222,0);const lamp=new THREE.Mesh(GC.pend||(GC.pend=new THREE.ConeGeometry(.45,.4,14,1,true)),bm(0xffe2a0));lamp.position.set(I.x0+56,3.5,I.z0+kz+8);sc.add(lamp);
  wsign(I,56,kz-.18,'n',4.3,'KITCHEN',2.4,.5,'#14203a','#e2b64c','Archivo');frug(I,56,kz+8,9,10,0x6a5a4a);
  iobj(I,56,kz+6.3,'Make a sandwich (+30 health, once a day)',()=>{if(S.daily['sand'+I.id]===S.day)return toast('The fridge is out of turkey. Try tomorrow.');S.daily['sand'+I.id]=S.day;S.hp=Math.min(S.mhp,S.hp+30);toast('You make a sandwich out of whatever is left. +30 health.')},1.8);
  }
function upInt(id,o){const hs=hsty(id);const I=mkInt(id+'_up',64,36,{up:1,doorX:24,hole:[STX0,STZT,STX1,STZB+.2],chole:id==='asr'?[25.3,25.6,28.3,32.5]:null,   // V196 ΑΣΡ: an opening in the 2nd-floor ceiling over the stairs to the 3rd floor
   name:o.name+', Second Floor',floor:'carpet:'+new THREE.Color(o.rug).multiplyScalar(.55).getHex(),wall:o.wall,low:o.low,wm:wallTex(hs.paper==='brick'?'paint':hs.paper,o.wall),lm:wainTex(hs.wains,o.low),rail:0xf2ece0,walls:[[48,0,48,16],[48,20,48,36],[48,16,50.5,16],[53.5,16,58.5,16],[61.5,16,64,16],[56,0,56,16],[48,20,54,20],[58,20,64,20],[0,16,4.5,16],[7.5,16,16.5,16],[19.5,16,28.5,16],[31.5,16,40.5,16],[43.5,16,48,16],[0,20,6.5,20],[9.5,20,16,20],[32,20,33.5,20],[36.5,20,41.5,20],[44.5,20,48,20],[12,0,12,16],[24,0,24,16],[36,0,36,16],[16,20,16,36],[32,20,32,36],[38,20,38,36]]});
  I.yrs=[];for(let yv=1952;yv<=2024;yv+=1+Math.floor(rnd()*3))I.yrs.push(yv);const L=o.letters;
  for(let r=0;r<4;r++){const bx=r*12;fbed(I,bx+2.4,2.4,o.bed);fbed(I,bx+9.6,2.4,o.bed);fb(I,bx+2,13.4,1.8,.8,.8,0x6a4a2c);fchair(I,bx+2,12.4);fb(I,bx+10,13.6,1.5,.7,1.4,0x5a3a24);frug(I,bx+6,8,5,5,o.rug);}
  ftv(I,.7,28,'e');fsofa(I,6,28,6,'w',o.sofa);fsofa(I,8,34.4,5,'n',o.sofa);ftable(I,4.5,28,1.4,3,0x5a3a24);fshelf(I,15.4,27,8,true);frugP(I,7,28,9,10,o.rug2,hs.rug);
  frug(I,22,26,9,9,o.rug);stairSteps(I,1,0x6a4a2a);box(I.x0+STX0-.2,1.05,I.z0+(STZT+.4+36)/2,.12,.1,36-STZT-.4,0x3a2415,0);for(let z=STZT+.3;z<36;z+=1.4)box(I.x0+STX0-.2,.52,I.z0+z,.1,1.05,.1,0x3a2415,0);markR(I.x0+STX0-.45,I.z0+STZT+.3,I.x0+STX0-.02,I.z0+36,1.1);markR(I.x0+STX0,I.z0+STZB+.25,I.x0+STX1,I.z0+36,1.1);markR(I.x0+STX1,I.z0+STZT-.4,I.x0+32,I.z0+36,6);
  
  for(const z of[23,26,29])fb(I,33.2,z,1.2,1.2,.9,0xeeeeee);for(let k=0;k<3;k++)fb(I,37.1,22+k*3,1.4,2.2,2.2,0xb8c4cc);frug(I,35,28,5,15,0xd8dde2);
  fbed(I,43,23,o.bed);fb(I,46.8,32,1.4,.8,.8,0x6a4a2c);fchair(I,45.8,32);wing(I,o,16,20,0);
  compWall(I,L,1,16.2,47,16.2,'s',[[4.5,7.5],[16.5,19.5],[28.5,31.5],[40.5,43.5]],3.4);compWall(I,L,1,19.8,47,19.8,'n',[[6.5,9.5],[16,32],[33.5,36.5],[41.5,44.5]],3.4);
  fswords(I,.18,18,'e',3.4,o.shield);fswords(I,63.82,18,'w',3.4,o.shield);fplant(I,1.2,16.7);fplant(I,62.6,16.7);   // V134: the second shield was hanging in the open hall endfswords(I,24,35.82,'n',4.4,o.shield);
  try{hangDecor(I,o,hs,hBedroom(I,o,hs,1).concat([[.2,22.5,'e',3.3,3.5],[.2,33.5,'e',3.3,3.5],[8,35.8,'n',3.3,7],[16.2,25,'e',3.3,6],[16.2,33,'e',3.3,4],[38.2,28,'e',3.3,8],[43,35.8,'n',3.3,8],[47.8,28,'w',3.3,8]]),['paddles5','grp','paint'])}catch(e){console.warn('house decor',id,e)}
  return I}
function classInt(id,o){const I=mkInt(id,34,26,{name:o.name,floor:o.floor||'wood',wall:o.wall||0xe6dcc6,low:0x4a3a2a});
  wsign(I,17,.2,'s',3.1,o.board,13,2.6,'#1f3a2c','#f2efe6','Kalam');if(!o.stage)fb(I,17,3.4,1.2,.8,1.25,0x5a3a24);
  for(let r=0;r<4;r++)for(let c=0;c<5;c++){const x=5+c*6,z=8.5+r*3.6;fb(I,x,z,1.5,.8,.78,0x8a6a44);fchair(I,x,z+.85,0x2a2a30)}
  iobj(I,17,13.9,'Take your seat for class',()=>{const op=classOpt(o.cls);if(!op)toast("Class isn't in session. Check your schedule in the Planner (Tab).");else if(op[1])op[1]();else toast(op[0])},1.4);
  for(const x of[2,32])fplant(I,x,23.5);for(let k=0;k<3;k++)wframe(I,33.8,6+k*6,'w',3.2,1.6,1.1,'paint');
  I.staff.push(['staff',17,2.1,0,{name:CI[o.cls].prof,title:CI[o.cls].n+' professor',role:'prof:'+o.cls,lvl:4,greet:'"Take a seat, Mr. Kowalski. Or don\'t, and explain it to the Dean."'}]);return I}
const OFFICERS=['VP','Treasurer','Ritualist/Pledgemaster','Recruiter','Secretary','Alumni Advisor','Philanthropy Chair','Party Planner'];
const CHAPTERS=[['asr','brothers','ΑΣΡ',null],['kto','legacies','ΚΘΩ','Preston Vanderhall'],['opd','studentgov','ΩΨΔ','Milton Cho'],['kan','athletes','ΚΑΝ','Brock Ramirez'],['dlp','sororities','ΔΛΦ','Madison Ashe'],['tz','sororities','ΘΖ','Sloane Whitaker']];
const RES={dlp:[['sororities',1]],tz:[['sororities',1]],lodge:[['oldguard',3]],whit:[['studentgov',2],['legacies',2]],hollis:[['studentgov',3]],arts:[['activists',3]],banc:[['sororities',2],['activists',1]],lib:[['studentgov',4]],union:[['studentgov',2],['athletes',2],['sororities',2]],gym:[['athletes',4]],diner:[['townies',3]],anchor:[['townies',3]],herald:[['activists',2]],hank:[['townies',1]]};
function buildInteriors(){const grp=f=>{const n0=sc.children.length;const I=f();const g=new THREE.Group();sc.children.slice(n0).forEach(k=>g.add(k));sc.add(g);g.visible=false;I.g=g;return I};
  grp(()=>{const I=houseInt('asr',{name:'Alpha Sigma Rho House',up:1,shield:0x7d1f2c,wall:0xe2d6bc,low:0x5a1f2a,rug:0x7d1f2c,rug2:0x3a4a6a,sofa:0x4a3a3a,bed:0x7d1f2c,letters:'ΑΣΡ',lb:'#7d1f2c'});
    iobj(I,2.5,4.6,'Sleep in your bunk (saves the game)',()=>sleep(),1.6);iobj(I,41,5.8,'Play beer pong',()=>startEvent('pong',w=>sideResult('pong',w)),1.6);iobj(I,10.6,27,'Watch TV for an hour',()=>{advance(1);S.hp=Math.min(S.mhp,S.hp+20);toast('One hour of a show about rich people being sad. +20 health.')},1.4);
    iobj(I,32.9,9.3,'Look at the pledge class composites',()=>card({title:'The Composite Wall',sp:'',text:'Every Alpha Sigma Rho pledge class since 1952 hangs on this wall in matching gold frames. The years run in order until 2018, then skip straight to 2020.\n\nBetween them hangs an empty gold frame where 2019 should be.'}),1.6);return I});
  grp(()=>houseInt('kto',{name:'Kappa Theta Omega House',up:1,shield:0x1f2c52,wall:0xdcd6c6,low:0x1f2c52,rug:0x1f2c52,rug2:0x5a4a2a,sofa:0x2c3646,bed:0x1f2c52,letters:'ΚΘΩ',lb:'#1f2c52'}));
  for(const[id,o]of[['asr',{name:'Alpha Sigma Rho House',shield:0x7d1f2c,wall:0xe2d6bc,low:0x5a1f2a,rug:0x7d1f2c,rug2:0x3a4a6a,sofa:0x4a3a3a,bed:0x7d1f2c,letters:'ΑΣΡ'}],['kto',{name:'Kappa Theta Omega House',shield:0x1f2c52,wall:0xdcd6c6,low:0x1f2c52,rug:0x1f2c52,rug2:0x5a4a2a,sofa:0x2c3646,bed:0x1f2c52,letters:'ΚΘΩ'}],['opd',{name:'Omega Psi Delta House',shield:0x2d3a36,wall:0xd8d0c0,low:0x2d3a36,rug:0x2d3a36,rug2:0x5a5a4a,sofa:0x3a3a3a,bed:0x2d3a36,letters:'ΩΨΔ'}],['kan',{name:'Kappa Alpha Nu House',shield:0x4a3a2a,wall:0xd8cfc0,low:0x4a3a2a,rug:0x4a3a2a,rug2:0x7a5a3a,sofa:0x5a3a2a,bed:0x4a3a2a,letters:'ΚΑΝ'}]])grp(()=>upInt(id,o));
  grp(()=>c3BuildTop());   // V126 chapter 3: the ΑΣΡ third floor (and the staircase up to it on the second floor)
  grp(()=>c7BuildNexus());
  grp(()=>c8BuildHaze());grp(()=>c9BuildPit());   // V162 chapter 9: the Nightmare basement + the candle table   // V161 chapter 8: the Haze Room   // V132 chapter 7: the wizard's realm (an open interior dressed as a purple void)
  grp(()=>houseInt('dlp',{name:'Delta Lambda Phi House',shield:0xb84a76,wall:0xf2e2e8,low:0xb84a76,rug:0xd88aa6,rug2:0xe6c8d2,sofa:0xc06a8a,bed:0xd88aa6,letters:'ΔΛΦ',lb:'#b84a76'}));
  grp(()=>houseInt('tz',{name:'Theta Zeta House',shield:0x2f8a8a,wall:0xe2efec,low:0x2f8a8a,rug:0x2f8a8a,rug2:0xbcdcd6,sofa:0x3a6a6a,bed:0x2f8a8a,letters:'ΘΖ',lb:'#2f8a8a'}));
  grp(()=>houseInt('opd',{name:'Omega Psi Delta House',up:1,shield:0x2d3a36,wall:0xd8d0c0,low:0x2d3a36,rug:0x2d3a36,rug2:0x5a5a4a,sofa:0x3a3a3a,bed:0x2d3a36,letters:'ΩΨΔ',lb:'#2d3a36'}));
  grp(()=>upInt('lxa',{name:'Lambda Chi Alpha House',shield:0x4b2a7a,wall:0xd9d2c0,low:0x1f4a2a,rug:0x1f6f3a,rug2:0x4b2a7a,sofa:0x3a2a5a,bed:0x1f6f3a,letters:'ΛΧΑ'}));
  grp(()=>houseInt('lxa',{name:'Lambda Chi Alpha House',up:1,shield:0x4b2a7a,wall:0xd9d2c0,low:0x1f4a2a,rug:0x1f6f3a,rug2:0x4b2a7a,sofa:0x3a2a5a,bed:0x1f6f3a,letters:'ΛΧΑ',lb:'#4b2a7a'}));
  grp(()=>houseInt('kan',{name:'Kappa Alpha Nu House',up:1,shield:0x4a3a2a,wall:0xd8cfc0,low:0x4a3a2a,rug:0x4a3a2a,rug2:0x7a5a3a,sofa:0x5a3a2a,bed:0x4a3a2a,letters:'ΚΑΝ',lb:'#4a3a2a'}));
  for(const[id,o]of[
   ['gwz',{name:'Gamma Omega Zeta House',shield:0x5a3a6a,wall:0xdfd6e2,low:0x5a3a6a,rug:0x5a3a6a,rug2:0x9a7aaa,sofa:0x4a3a5a,bed:0x5a3a6a,letters:'ΓΩΖ',lb:'#5a3a6a'}],
   ['tchi',{name:'Theta Chi House',shield:0x9a2a2a,wall:0xe2d8c8,low:0x6a1f1f,rug:0x9a2a2a,rug2:0x3a3a44,sofa:0x4a3030,bed:0x9a2a2a,letters:'ΘΧ',lb:'#9a2a2a'}],
   ['pkp',{name:'Pi Kappa Phi House',shield:0xc8a43a,wall:0xe6dec4,low:0x7a6420,rug:0x1f2c52,rug2:0xc8a43a,sofa:0x2c3646,bed:0x1f2c52,letters:'ΠΚΦ',lb:'#c8a43a'}],
   ['pka',{name:'Pi Kappa Alpha House',shield:0x8a1f2c,wall:0xdcd2c0,low:0x5a1a22,rug:0x8a1f2c,rug2:0xcbb98f,sofa:0x3a3030,bed:0x8a1f2c,letters:'ΠΚΑ',lb:'#8a1f2c'}],
   ['sae',{name:'Sigma Alpha Epsilon House',shield:0x6a4a9a,wall:0xdcd4e4,low:0x4a3470,rug:0x6a4a9a,rug2:0xc9a046,sofa:0x4a3a6a,bed:0x6a4a9a,letters:'ΣΑΕ',lb:'#6a4a9a'}],
   ['ksig',{name:'Kappa Sigma House',shield:0x2a6a3a,wall:0xd6dccb,low:0x1f4a2a,rug:0x2a6a3a,rug2:0xcbb98f,sofa:0x2c4a34,bed:0x2a6a3a,letters:'ΚΣ',lb:'#2a6a3a'}],
   ['kkg',{name:'Kappa Kappa Gamma House',shield:0x3a6fa8,wall:0xe0e8f2,low:0x2a4a7a,rug:0x3a6fa8,rug2:0xb8cce6,sofa:0x3a5a8a,bed:0x3a6fa8,letters:'ΚΚΓ',lb:'#3a6fa8'}],
   ['tri',{name:'Triangle House',shield:0x23408a,wall:0xdcd8cc,low:0x1a2c5a,rug:0x23408a,rug2:0x8a96b4,sofa:0x2c3a5a,bed:0x23408a,letters:'Δ',lb:'#23408a'}],
   ['tpa',{name:'Theta Phi Alpha House',shield:0x2f4f8f,wall:0xe4e6ee,low:0x2a3f70,rug:0x2f4f8f,rug2:0xc9a046,sofa:0x3a4a7a,bed:0x2f4f8f,letters:'ΘΦΑ',lb:'#2f4f8f'}],
   ['sam',{name:'Sigma Alpha Mu House',shield:0x4a2a7a,wall:0xd9d2e0,low:0x34205a,rug:0x4a2a7a,rug2:0xb8a6d0,sofa:0x3a2a5a,bed:0x4a2a7a,letters:'ΣΑΜ',lb:'#4a2a7a'}],
   ['chio',{name:'Chi Omega House',shield:0xa8203a,wall:0xf0e2d6,low:0x7a1a2c,rug:0xa8203a,rug2:0xf2d98a,sofa:0x8a2a3a,bed:0xa8203a,letters:'ΧΩ',lb:'#a8203a'}],
   ['stau',{name:'Sigma Tau House',shield:0x3a5a6a,wall:0xd6dce0,low:0x2a404c,rug:0x3a5a6a,rug2:0xcbb98f,sofa:0x2c4650,bed:0x3a5a6a,letters:'ΣΤ',lb:'#3a5a6a'}],
   ['phimu',{name:'Phi Mu House',shield:0xd98aa4,wall:0xf6e6ec,low:0xb06a84,rug:0xd98aa4,rug2:0xf0cfdb,sofa:0xc0788f,bed:0xd98aa4,letters:'ΦΜ',lb:'#d98aa4'}],
   ['kd',{name:'Kappa Delta House',shield:0x6a7a3a,wall:0xe6ead6,low:0x4a5a2a,rug:0x6a7a3a,rug2:0xd8dcb8,sofa:0x56643a,bed:0x6a7a3a,letters:'ΚΔ',lb:'#6a7a3a'}],
   ['atht',{name:'Alpha Theta Tau House',shield:0xd9772a,wall:0xf2e4d2,low:0xa85a1a,rug:0xd9772a,rug2:0xf0c9a0,sofa:0xb86a2a,bed:0xd9772a,letters:'ΑΘΤ',lb:'#d9772a'}],
   ['btp',{name:'Beta Theta Pi House',shield:0x2a5a9a,wall:0xdce0ea,low:0x1f3f6e,rug:0x2a5a9a,rug2:0xe8a8bc,sofa:0x2c3f66,bed:0x2a5a9a,letters:'ΒΘΠ',lb:'#2a5a9a'}],
   ['dtd',{name:'Delta Tau Delta House',shield:0x6a3a9a,wall:0xe0d8e6,low:0x4a2a70,rug:0x6a3a9a,rug2:0xc9a046,sofa:0x4a3a6a,bed:0x6a3a9a,letters:'ΔΤΔ',lb:'#6a3a9a'}],
   ['psr',{name:'Phi Sigma Rho House',shield:0x7a2a5a,wall:0xf0e0e6,low:0x5a1f44,rug:0x7a2a5a,rug2:0xe2b64c,sofa:0x6a3a58,bed:0x7a2a5a,letters:'ΦΣΡ',lb:'#7a2a5a'}],
   ['pdt',{name:'Phi Delta Theta House',shield:0xc8602a,wall:0xe6dccb,low:0x8a3f1a,rug:0xc8602a,rug2:0x3a3a3a,sofa:0x5a3a2a,bed:0xc8602a,letters:'ΦΔΘ',lb:'#c8602a'}]
  ]){grp(()=>houseInt(id,Object.assign({up:1},o)));grp(()=>upInt(id,o))}
  grp(()=>houseInt('lodge',{name:'The Lodge',shield:0x2e4030,wall:0x8a7a62,low:0x3a2a1c,rug:0x2e4030,rug2:0x5a4a2a,sofa:0x3a2a1c,bed:0x2e4030,letters:'ΑΣΡ ALUMNI',lb:'#2e4030'}));
  grp(()=>classInt('whit',{name:'McMicken Hall, Room 101',cls:'econ',board:'ECON 101 · SUPPLY & DEMAND'}));
  grp(()=>{const I=classInt('hollis',{name:'Rieveschl Hall, Lab B',cls:'chem',board:'CHEM 110 · CMY = 1 − RGB',floor:'tile',wall:0xe6ece8});fb(I,32.6,13,1.4,12,1,0x2a2a30);for(let k=0;k<6;k++)cyl(I.x0+32.6,1.2,I.z0+8+k*2,.16,.4,bm([0x5ad0e0,0xe05ab0,0xf0d040][k%3]));iobj(I,31.2,13,'Mix a stink bomb at the lab bench ($2)',()=>{if(S.grades.chem<1)return toast('You need a Chemistry grade first.');if(S.money<2)return toast('Not enough money.');if(invAdd('stink')){money(-2);toast('Stink bomb mixed. Handle with care.')}},1.6);return I});
  grp(()=>{const I=classInt('braun',{name:'Braunstein Hall, Room 204',cls:'phys',board:'PHYS 101 · v² = u² + 2as',wall:0xe8e2d2});fb(I,30,13,1.6,8,.95,0x3a3a42);
    {const g=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,1.1,12),bm(0x6a6e78));g.rotation.z=-.7;g.position.set(I.x0+30,1.55,I.z0+11);sc.add(g);const ba=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),bm(0xd8452e));ba.position.set(I.x0+30.4,1.95,I.z0+12.5);sc.add(ba);const pd=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1.6,6),bm(0x888888));pd.position.set(I.x0+30,2.4,I.z0+15.5);sc.add(pd);const bob=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),bm(0xc8a040));bob.position.set(I.x0+30,1.55,I.z0+15.5);sc.add(bob)}
    return I});
  grp(()=>classInt('arts',{name:'DAAP, Gallery Room',cls:'art',board:'ART 220 · ORIGINAL OR FORGERY?',wall:0xefe9dc}));
  grp(()=>{const I=classInt('banc',{name:'CCM · Corbett Auditorium',cls:'speech',board:'SPEECH 101 · PROJECT FROM THE DIAPHRAGM',floor:'carpet',stage:1});fb(I,17,3.2,24,4.6,.25,0x5a3a24,0,0);for(const x of[4.6,29.4])fb(I,x,2.4,1.2,3,5.6,0x8a1f2a,0,1);iobj(I,9,4,'Practice your speech on stage (1 hour)',()=>{advance(1);S.studied=1;toast('You run the speech to the empty seats. Your next class will go easier.')},1.6);return I});
  grp(()=>cchInt());
  grp(()=>asrDungeon());
  grp(()=>{const I=mkInt('lib',40,30,{name:'Langsam Library',floor:'carpet',wall:0xd8ccb0});for(let k=0;k<7;k++)fshelf(I,4+k*5.3,7.5,10,true);for(const x of[8,16,24]){ftable(I,x,20.5,3,1.6,0x5a3a24);fchair(I,x-.8,21.9);fchair(I,x+.8,21.9)}fb(I,33,24.5,5,1.2,1,0x5a3a24);fb(I,38,14,1.2,1.4,1.6,0x3a3a40);chand(I,20,20);
    iobj(I,16,22.9,'Study for an hour (helps your next class)',()=>{advance(1);S.studied=1;toast('You study. Your next class will go a little easier.')},1.5);iobj(I,36.6,14,'Use the microfilm reader',()=>card({title:'Microfilm Reader',text:'Fifty years of the Harrowgate Herald on plastic spools. The machine hums and smells like dust.'+(S.ch>=3?'\n\nSomeone has left the November 2019 spool on the desk.':'')}),1.5);
    I.staff.push(['staff',33,23.2,0,{name:'Mrs. Abernathy-Cole',title:'Librarian',role:'librarian',lvl:3,fem:true,greet:'"Shh. What do you need?"'}]);return I});
  grp(()=>{const I=mkInt('union',44,30,{name:'Tangeman University Center',floor:'tile',wall:0xe2dccb,walls:[[34,0,34,5],[34,8,34,12],[34,12,44,12],[10,0,10,5],[10,8,10,12],[0,12,10,12]]});fb(I,22,2.6,14,1.2,1,0xb8b8bc);fb(I,22,.5,14,.8,1.9,0x8a8a8e,0,0);
    for(const x of[16,22,28])for(const z of[17,22.5]){ftable(I,x,z,3.2,1.4,0x8a6a44);fchair(I,x-.9,z-1.2);fchair(I,x+.9,z+1.2)}
    fb(I,39,3,4,1.2,1,0x2a2a30);wsign(I,39,.2,'s',3.4,'ON AIR',2.4,.8,'#3a0a0a','#ff4a3a','Archivo');wsign(I,5,.2,'s',3.4,'STUDENT GOVERNMENT',5,.8,'#1f3a2c','#e2b64c');fb(I,5,4,3,1.2,.9,0x5a3a24);
    iobj(I,39,4.6,'Take the WHRG mic for the night shift',()=>{if(!inWin(S.gt,[16,23]))return toast('Shifts run from 4 PM to 11 PM.');startEvent('radio',w=>sideResult('radio',w))},1.4);
    iobj(I,5,5.6,'Volunteer at Student Government (1 hour)',()=>{if(S.daily.sg===S.day)return toast("They don't need you again today.");S.daily.sg=S.day;advance(1);rep('studentgov',6);toast('You staple 400 flyers. Student Gov +6.')},1.4);
    I.staff.push(['staff',22,1.45,0,{name:'Dolores',title:'Cafeteria',shop:'union',lvl:3,fem:true,greet:'"Sandwich? It\'s turkey. It\'s always turkey."'}]);return I});
  grp(()=>{const I=mkInt('main',36,26,{name:'Van Wormer Hall',floor:'tile',wall:0xd9cfb8});for(let x=4;x<34;x+=6)wframe(I,x,.2,'s',3.2,1.3,1.7,'paint');fb(I,18,8,4,1.2,1,0x5a3a24);wsign(I,30,.2,'s',4.8,'DEAN OF STUDENTS →',5,.7,'#14203a','#e2b64c');
    {const X=x=>I.x0+x,Z=z=>I.z0+z,W=mt(0x5a3a24,.55),F=mt(0xefe9db,.6);box(X(32.2),1.3,Z(.1),1.5,2.6,.12,F,0);box(X(32.2),1.25,Z(.17),1.25,2.45,.1,W,0);for(const y of[.65,1.85])box(X(32.2),y,Z(.24),.95,.8,.03,mt(0x4a3020,.6),0);box(X(31.75),1.15,Z(.26),.08,.08,.1,mt(0xc8a24a,.3,.8),0);
      wsign(I,32.2,.26,'s',2.85,'DEAN M. HALVORSEN',1.15,.2,'#e2b64c','#14203a')}/* V147 the Dean's office door */wsign(I,.2,13,'e',2.2,'BULLETIN BOARD',3,1.5,'#a8885a','#24211c');chand(I,18,14);
    iobj(I,1.6,13,'Read the bulletin board',()=>card({title:'Bulletin Board',text:board()}),1.6);iobj(I,32,2.2,"Knock on the Dean's office door",()=>toast(NN.dean&&NN.dean.int==='deanoff'?'"Go right in, Mr. Kowalski," the secretary says. "She\'s waiting."':'"She\'s out on the front steps," the secretary says. "She likes the air."'),1.6);
    I.staff.push(['staff',18,6.7,0,{name:'Mr. Pruitt',title:"Dean's secretary",role:'secretary',lvl:2,greet:'"Do you have an appointment? No? Of course not."'}]);return I});
  grp(()=>{const I=mkInt('gym',44,32,{name:'Campus Recreation Center',floor:'court',wall:0xc9c1ad,low:0x7d1f2c});for(const[x,f]of[[1.2,'e'],[42.8,'w']]){fb(I,x,14,.3,.3,3.4,0x888888);box(I.x0+x+(f==='e'?.6:-.6),3.6,I.z0+14,.08,1.2,1.8,0xf2f2f2,0);cyl(I.x0+x+(f==='e'?1.1:-1.1),3.05,I.z0+14,.25,.04,0xff6a2a)}frug(I,22,14,.2,24,0xf2efe6);
    fb(I,22,.6,36,.8,2.4,0x3a5a8a);for(const x of[33,37,41]){fb(I,x,26,1,2.4,.5,0x222222);box(I.x0+x,1.1,I.z0+26,2.2,.06,.06,0x888888,0)}
    iobj(I,37,23.6,'Lift weights (1 hour, once a day)',()=>{if(S.daily.gym===S.day)return toast('Your arms are done for today.');S.daily.gym=S.day;advance(1);S.mhp=Math.min(200,S.mhp+5);S.hp=S.mhp;rep('athletes',3);toast('Max health +5. Athletes +3.')},1.6);
    I.staff.push(['staff',8,26,PI/2,{name:'Coach Brannigan',title:'Intramurals',role:'coach',lvl:7,shirt:0x7d1f2c,greet:'"You here to play or to stand there?"'}]);return I});
  grp(()=>{const I=mkInt('diner',28,18,{name:"Ruby's Diner",floor:'tile',wall:0xf0e6d0,low:0xb3262e});fb(I,13,4,16,1.2,1.05,0xd8d0c0);fb(I,13,.5,16,.8,2,0xb8b0a0,0,0);for(let k=0;k<7;k++){cyl(I.x0+6.4+k*2.2,.4,I.z0+5.6,.28,.8,0xb3262e);markC(I.x0+6.4+k*2.2,I.z0+5.6,.3,.8)}for(const x of[1.6,26.4])for(const z of[8.5,12.5]){ftable(I,x,z,1.4,1.6,0xe8e0d0);fb(I,x,z-1.3,1.6,.6,1,0xb3262e);fb(I,x,z+1.3,1.6,.6,1,0xb3262e)}fb(I,26.6,3,1,.8,1.8,0xd84a8a);
    I.staff.push(['staff',13,2.3,0,{name:'Ruby',title:"Ruby's Diner",shop:'diner',lvl:4,fem:true,shirt:0xb3262e,greet:'"Sit anywhere, hon. Except the booth by the jukebox. That\'s Earl\'s."'}]);return I});
  grp(()=>{const I=mkInt('pawn',22,16,{name:'Lucky Pawn',floor:'tile',wall:0xcfc3a6});fb(I,11,4,10,1,1.05,0x7a8a90);fshelf(I,1,8,9,true);fshelf(I,21,8,9,true);wsign(I,11,.2,'s',3.6,'WE BUY GOLD',5,.9,'#1b2a1a','#8fe07a','Archivo');
    I.staff.push(['staff',11,2.4,0,{name:'Pete',title:'Lucky Pawn',shop:'pawn',lvl:5,greet:'"No refunds. No questions. No exceptions."'}]);return I});
  grp(()=>{const I=mkInt('hank',26,18,{name:"Hank's Market",floor:'tile',wall:0xe8e0cc});for(const z of[5.5,9.5])fshelf(I,9,z,12,false);fb(I,20,12.5,1.2,3.6,1,0x8a6a44);fb(I,13,.7,20,1,2.4,0xc8d8e0);
    I.staff.push(['staff',21.8,12.5,-PI/2,{name:'Hank',title:"Hank's Market",shop:'hank',lvl:6,greet:'"You buying or loitering?"'}]);return I});
  grp(()=>{const I=mkInt('police',26,18,{name:'Harrowgate Police',floor:'tile',wall:0xcfd4d8,low:0x2a3a5a});fb(I,13,7,7,1.2,1.1,0x5a5a62);for(let k=0;k<13;k++)box(I.x0+1+k*.5,1.6,I.z0+4,.06,3.2,.06,0x333333,0);markR(I.x0+.4,I.z0+3.8,I.x0+7.2,I.z0+4.2,3);fb(I,3,1.5,2.4,1,.5,0x555555);wsign(I,13,.2,'s',3.6,'HARROWGATE PD',5,.9,'#16223c','#dfe8f6');
    I.staff.push(['staff',13,5.3,0,{name:'Sgt. Dombrowski',title:'Desk sergeant',role:'sergeant',lvl:8,shirt:0x23272f,sleeve:0x23272f,pants:0x23272f,greet:'"If you\'re here to confess, take a number."'}]);return I});
  grp(()=>{const I=mkInt('anchor',28,20,{name:'The Rusty Anchor',floor:'wood',wall:0x6a4a30,low:0x3a2414,ceil:0x5a4030});fb(I,10,3.4,16,1.2,1.1,0x4a2a18);fb(I,10,.5,16,.8,2.2,0x3a2414,0,0);for(let k=0;k<6;k++){cyl(I.x0+4+k*2.4,.4,I.z0+5,.28,.8,0x2a1a10);markC(I.x0+4+k*2.4,I.z0+5,.3,.8)}fpool(I,20,11);wsign(I,27.8,6,'w',2.2,'◎',1,1,'#2a1a10','#e0c080');fb(I,26.8,15,1,.8,1.8,0xd8a040);
    iobj(I,20,13.1,'Shoot pool with the regulars ($5)',()=>{if(S.money<5)return toast('Not enough money.');const p=.35+S.grades.econ*.08+(S.rep.townies>20?.1:0);money(-5);if(rnd()<p){money(12);rep('townies',4);toast('You sink the eight ball. +$12. Townies +4.')}else{rep('townies',1);toast('Earl runs the table. He buys you a soda anyway.')}},1.6);
    I.staff.push(['staff',10,1.85,0,{name:'Lou',title:'Bartender',shop:'anchor',lvl:6,shirt:0x6d4a2e,greet:'"Root beer or nothing, college boy. I know how old you are."'}]);I.staff.push(['townies',18,8.6,0,{name:'Earl',title:'Regular',lvl:6,greet:'"Wanna lose five bucks at pool?"'}]);return I});
  grp(()=>{const I=mkInt('herald',28,20,{name:'The Harrowgate Herald',floor:'carpet',wall:0xe0d8c4,walls:[[20,0,20,4],[20,7,20,9],[20,9,28,9]]});for(const x of[4,10,16])for(const z of[6,12]){fb(I,x,z,3,1.4,.9,0x8a6a44);box(I.x0+x,1.3,I.z0+z-.3,1.2,.8,.1,0x1a1a20,0)}fb(I,5,16.4,1.2,.8,.9,0xf2efe6);
    iobj(I,5,15,"Read today's paper",()=>card({title:'The Harrowgate Herald',text:paper()}),1.4);
    I.staff.push(['staff',24,4.5,0,{name:'Ms. Vance',title:'Editor',role:'editor',lvl:4,fem:true,greet:'"Unless you\'ve got a story, I\'ve got a deadline."'}]);return I});
  grp(()=>{const I=mkInt('boat',22,14,{name:'Boathouse',floor:'wood',wall:0x7a5536,low:0x4a3020,ceil:0x6a4a30});for(let k=0;k<3;k++){const c=new THREE.Mesh(GC.canoe||(GC.canoe=new THREE.SphereGeometry(1,12,8)),mt([0xc0392b,0x2a6aa8,0x3a8a4a][k],.5));c.scale.set(.5,.3,2.6);c.position.set(I.x0+3+k*2.2,.5+k*.9,I.z0+6);sc.add(c)}fb(I,5,6,6,5,.2,0x4a3020,0,1);
    I.staff.push(['staff',14,4,0,{name:'Skip',title:'Boathouse',role:'attendant',lvl:4,shirt:0x1f2c52,pants:0xcbb98f,greet:'"Karts are gassed up. Ten bucks a race."'}]);return I});
  /* V153 the Dean's office behind the door in Van Wormer Hall: she is in here (not out on the steps) during the Meet the Dean quest. Fixed slot east of the dungeon so no other interior moves. */
  grp(()=>{const I=mkInt('deanoff',14,11,{at:[500,OD+640],up:1,doorX:7,name:"Van Wormer Hall · Dean's Office",floor:'carpet',wall:0xd9cfb8,low:0x3a2a1c});
    frug(I,7,5.4,7,5,0x2a3a5a);
    fb(I,7,4.1,4.4,1.5,.95,0x4a2f1c);box(I.x0+7,.97,I.z0+4.1,4.1,.04,1.3,mt(0x1f3a2a,.5),0);fb(I,5.6,4.0,.9,.6,.08,0xe8e0cc,.97,0);fb(I,8.4,4.0,.5,.4,.3,0x2a2a30,.97,0);
    fb(I,7,1.4,.9,.9,1.3,0x2a1a10);fchair(I,5.8,6.6,0x3a2a20);fchair(I,8.2,6.6,0x3a2a20);
    fshelf(I,1,5,7,true);fshelf(I,13,5,7,true);
    wsign(I,7,.2,'s',4.3,'OFFICE OF THE DEAN OF STUDENTS',5.2,.6,'#14203a','#e2b64c','Archivo');
    wframe(I,3.4,.2,'s',2.9,1.3,1.7,'paint');wframe(I,10.6,.2,'s',2.9,1.3,1.7,'paint');
    chand(I,7,5.5);
    box(I.x0+7,1.75,I.z0+10.7,2.6,3.5,.2,0x3d2617,0);box(I.x0+7,3.6,I.z0+10.7,3.2,.3,.26,0xefe9db,0);
    {const sg=signMesh('EXIT',1.3,.48,'#1a0a0a','#ff5a4a','Archivo');sg.position.set(I.x0+7,4.2,I.z0+10.55);sg.rotation.y=PI;sc.add(sg)}
    I.ix=I.x0+7;I.iz=I.z0+8.2;I.objs.push({x:I.x0+7,z:I.z0+9.5,r:1.9,label:'Leave the Dean\'s office',f:()=>deanOffOut()});
    return I});
}
function deanOffOut(){sfx('ui');try{maDoor()}catch(e){}fadeTo(()=>{goIn('main',32.2,3.2);P.face=0;yaw=P.face+PI;camT=3})}
function pairOf(id){if(!id)return null;const b=id.replace(/_up$/,'');if(!INT[b+'_up'])return null;return id.endsWith('_up')?b:b+'_up'}
function setCast(g,on){g.traverse(o=>{if(o.isMesh){if(o.userData.cs==null)o.userData.cs=o.castShadow;o.castShadow=on?o.userData.cs:false}})}
function showInt(id){for(const k in INT){const g=INT[k].g;g.visible=k===id;if(g.position.lengthSq()){g.position.set(0,0,0);setCast(g,1)}}const pr=pairOf(id);if(pr){const A=INT[id],B_=INT[pr],g=B_.g;g.visible=true;g.position.set(A.x0-B_.x0,pr.endsWith('_up')?STH:-STH,A.z0-B_.z0);setCast(g,0)}
  // V196 the ΑΣΡ third floor is open to the second: each shows the other through the stairwell
  if(typeof c3StairOK==='function'&&c3StairOK()&&INT.asr_top&&INT.asr_up&&(id==='asr_up'||id==='asr_top')){const A=INT[id],O=INT[id==='asr_up'?'asr_top':'asr_up'];O.g.visible=true;O.g.position.set(A.x0-O.x0,id==='asr_up'?C3SH:-C3SH,A.z0-O.z0);setCast(O.g,0)}}
function bringFollowers(){for(const n of NP){if(!n.follow||n.down)continue;n.int=P.inside||null}FOLT=-1;for(const n of NP){if(!n.follow||n.down)continue;const[x,z]=folSlot(n);n.x=x;n.z=z;n.path=null;n.aggro=0;n.tgt=null}}
function zoneAt(x,z){if(P.inside)return P.inside;for(const k of['greek','quad','ath','down','lake','ave'])if(inR(x,z,ZN[k]))return k;return'quad'}
function goIn(id,rx,rz){const I=INT[id];P.inside=id;showInt(id);P.x=I.x0+(rx!=null?rx:I.dX);P.z=I.z0+(rz!=null?rz:I.d-2.8);P.vx=P.vz=0;P.bike=0;P.face=PI;yaw=0;camT=3;bringFollowers()}
function lakeGo(into){sfx('ui');fadeTo(()=>{goOut(70,into?LZ+551:696);P.face=into?0:PI;if(GREAL)setGoal(GREAL[0],GREAL[1]);toast(into?'The Lake District':'Back on campus',1600)})}
function goOut(x,z){if(P.inside){P.inside=null;showInt(null)}P.x=x;P.z=z;P.vx=P.vz=0;bringFollowers()}
function fadeTo(fn){if(P.tp)return;P.tp=1;$('fade').style.opacity=1;setTimeout(()=>{fn();P.tp=0;$('fade').style.opacity=0},240)}
let GKEY='',GT_=0;
function guideTarget(){if(EV)return null;let t=null;const st=curStep();
  if(MAPROUTE)t=[MAPROUTE.x,MAPROUTE.z];else if(AM){if(st&&st.goal){t=st.goal()}else if(st&&st.x!=null&&!st.nogoal&&st.t!=='card'&&st.t!=='cine')t=[st.x,st.z]}
  else if(S.ch<=10){const av=availM().filter(m=>m.main);const m=av[0];if(m)t=mAt(m);else if(S.pledged&&!S.bb)t=npcSpot('tank')}
  if(!t)return null;const inTgt=t[1]>=INTZ;
  {const T=INT.asr_top,inTop=T&&t[0]>=T.x0&&t[0]<=T.x1&&t[1]>=T.z0&&t[1]<=T.z1;   // V193 trails to and from the third floor use the new stairs
   if(P.inside==='asr_top'&&!inTop)return[T.x0+26.8,T.z0+C3SW[3]-2.4];if(inTop&&P.inside==='asr_up')return[INT.asr_up.x0+26.8,INT.asr_up.z0+C3SW[3]-.4];if(inTop&&P.inside==='asr')return[INT.asr.x0+30,INT.asr.z0+STZT+.6]}   // V126 the third floor's way out is its staircase
  if(P.inside&&!inTgt){const I=INT[P.inside];if(P.inside.endsWith('_up'))return[I.x0+30,I.z0+STZB-.4];return[I.x0+I.dX,I.z0+I.d-1.4]}
  if(P.inside&&inTgt){const I=INT[P.inside];if(!(t[0]>=I.x0&&t[0]<=I.x1&&t[1]>=I.z0&&t[1]<=I.z1)){const base=P.inside.replace(/_up$/,'');const other=P.inside.endsWith('_up')?INT[base]:INT[base+'_up'];if(other&&t[0]>=other.x0&&t[0]<=other.x1&&t[1]>=other.z0&&t[1]<=other.z1)return P.inside.endsWith('_up')?[I.x0+30,I.z0+STZB-.4]:[I.x0+30,I.z0+STZT+.6];return[I.x0+I.dX,I.z0+I.d-1.4]}}
  if(!P.inside&&inTgt){const id=Object.keys(INT).find(k=>{const I=INT[k];return t[0]>=I.x0&&t[0]<=I.x1&&t[1]>=I.z0&&t[1]<=I.z1});const b=id&&B.find(b=>b.id===id.replace(/_up$/,''));if(b)return[b.ex,b.ez]}
  return t}
function refreshGoal(force){const g=guideTarget();const key=g?g[0].toFixed(1)+','+g[1].toFixed(1):'-';if(key===GKEY&&!force)return;GKEY=key;if(g)setGoal(g[0],g[1]);else setGoal(null)}
function enterBld(b){if(typeof c4Moving==='function'&&c4Moving(b.id)){toast(b.name+' is still moving in. Boxes everywhere. Come back after Homecoming.');sfx('bad');return}if(typeof c3IsShut==='function'&&c3IsShut(b.id)){toast('Police tape across the door. CLOSED BY ORDER OF THE HARROWGATE PD.');sfx('bad');return}if(b.id==='lodge'&&S.ch<3){toast('"Members and invited guests only." The door is locked.');sfx('bad');return}if(S.carry){toast("The ram won't fit through the door.");return}sfx('ui');try{maDoor()}catch(e){}{const st=curStep();if(st&&st.t==='go'&&st.x!=null&&Math.hypot(st.x-b.ex,st.z-b.ez)<4){completeGo(st);return}}fadeTo(()=>{goIn(b.id);toast(INT[b.id].name,1800)})}
// V98 back doors: the game room's north wall opens straight onto the backyard (where the pong/dice tables are), and a matching door
// on the house's back wall outside leads back in, so you don't have to walk round the block
function backDoorIn(I,id){const x=46.5,x0=I.x0,z0=I.z0;box(x0+x,1.75,z0+.3,2.6,3.5,.2,0x3d2617,0);box(x0+x,3.6,z0+.3,3.2,.3,.26,0xefe9db,0);
  box(x0+x+.9,1.7,z0+.43,.1,.1,.06,0xc9a046,0);{const s=signMesh('BACKYARD',1.7,.48,'#14203a','#e2b64c','Archivo');s.position.set(x0+x,4.2,z0+.45);sc.add(s)}
  flat(x0+x-1.5,z0+.45,x0+x+1.5,z0+2.2,.045,mt(0x3a2a20,.95));I.objs.push({x:x0+x,z:z0+1.4,r:1.9,label:'Out the back door to the yard',f:()=>backOut(id)})}
const BPT={};
function backPt(id){if(BPT[id]!==undefined)return BPT[id];let Y=null,bb=null;try{Y=YARDS[id];bb=B.find(b=>b.id===id)}catch(e){}if(!Y||!bb||bb.ex==null||!INT[id])return BPT[id]=null;
  const dx=bb.ex-Y.cx,dz=bb.ez-Y.cz,L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;let w=-1;for(let d=2;d<L;d+=.25)if(!freeAt(Y.cx+ux*d,Y.cz+uz*d,.34)){w=d;break}if(w<0)return BPT[id]=null;
  const x=Y.cx+ux*(w-1.1),z=Y.cz+uz*(w-1.1),wx=Y.cx+ux*(w+.3),wz=Y.cz+uz*(w+.3),face=Math.atan2(-ux,-uz);
  const g=new THREE.Group();g.position.set(wx,terrH(wx,wz),wz);g.rotation.y=face;const add=(w_,h_,d_,px,py,pz,c,r=.6,m_=0)=>{const m=new THREE.Mesh(bgeo(w_,h_,d_),mt(c,r,m_));m.position.set(px,py,pz);m.castShadow=true;m.receiveShadow=true;g.add(m)};
  add(1.5,2.5,.14,0,1.25,.02,0x3d2617);add(1.86,.16,.22,0,2.58,0,0xefe9db);for(const s of[-1,1])add(.16,2.6,.22,s*.84,1.3,0,0xefe9db);add(.07,.07,.08,.55,1.15,.12,0xc9a046,.3,.7);add(2,.14,1,0,.07,.55,0x8a8478,.9);
  for(let i=0;i<4;i++)add(.12,1.1,.03,(i-1.5)*.3,1.75,.1,0x2a1a10);sc.add(g);return BPT[id]={x,z,face}}
function backOut(id){const bp=backPt(id);if(!bp){exitInt();return}sfx('ui');try{maDoor()}catch(e){}fadeTo(()=>{goOut(bp.x,bp.z);P.face=bp.face;yaw=P.face+PI;camT=3;bringFollowers()})}
function backIn(id){if(S.carry){toast("The ram won't fit through the door.");return}sfx('ui');try{maDoor()}catch(e){}fadeTo(()=>{goIn(id,46.5,2.6);P.face=0;yaw=PI;camT=3;bringFollowers();toast(INT[id].name,1800)})}
function exitInt(){const b=B.find(b=>b.id===P.inside);if(!b)return;sfx('ui');try{maDoor()}catch(e){}fadeTo(()=>{if(b.id==='cch'&&cchExitUp())return;goOut(b.ex,b.ez);const[nx,nz]=b.id==='union'&&b.fn?b.fn:FACE[b.face];P.face=Math.atan2(nx,nz);yaw=P.face+PI;camT=3})}
const mapPos=()=>{if(P.inside){const b=B.find(b=>b.id===P.inside.replace(/_up$|_bsmt$/,''));if(b)return[b.ex,b.ez]}return[P.x,P.z]};

