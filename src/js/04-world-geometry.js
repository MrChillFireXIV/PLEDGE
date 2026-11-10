// ================================================================ WORLD GEOMETRY
const B=[],RD=[],PT=[],TREES=[],LAMPS=[],FENCES=[],NOTREE=[];
const FACE={e:[1,0],w:[-1,0],n:[0,-1],s:[0,1]};
const HIPG=new THREE.ConeGeometry(Math.SQRT1_2,1,4,1);HIPG.rotateY(PI/4);HIPG.translate(0,.5,0);
const COLG=new THREE.CylinderGeometry(.32,.38,1,14);
function boxUV(g,w,h,d,u){const uv=g.attributes.uv,D=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*D[f][0]/u,uv.getY(i)*D[f][1]/u)}uv.needsUpdate=true;return g}
function fpos(b,face,a,out){const[nx,nz]=FACE[face];if(nx)return[nx>0?b.x1+out:b.x0-out,a];return[a,nz>0?b.z1+out:b.z0-out]}
const fry=face=>{const[nx,nz]=FACE[face];return Math.atan2(nx,nz)};
function fbox(b,face,a,out,wt,dn,h,y,mat,cast=1){const[x,z]=fpos(b,face,a,out);const ew=FACE[face][0]!==0;return box(x,y+h/2,z,ew?dn:wt,h,ew?wt:dn,mat,cast)}
function fsign(b,face,a,out,y,text,w,h,bg,fg,font){const m=signMesh(text,w,h,bg,fg,font);const[x,z]=fpos(b,face,a,out);m.position.set(x,y,z);m.rotation.y=fry(face);sc.add(m);return m}
const MAPC={conc:'#9a958a',concT:'#9a958a',glass:'#8aa0b0',metal:'#9aa0a8',terra:'#c98a5a',white:'#e9e3d3',stripe:'#a8604c',daapG:'#a9c9b2',brick:'#9a5a48',brick2:'#7d5a4a',stone:'#b9ad92',siding:'#d9d3c6',sidingP:'#d9b8c6',sidingT:'#b8d3cf',wood:'#8a6444',stucco:'#d6cbb2'};
function bld(id,x0,z0,x1,z1,h,kind,o={}){
  const w=x1-x0,d=z1-z0,cx=(x0+x1)/2,cz=(z0+z1)/2,b={id,x0,z0,x1,z1,h,name:o.name||'',menu:o.menu,mc:o.mc||MAPC[kind]};
  fm(kind);const m=new THREE.Mesh(fdBoxUV(new THREE.BoxGeometry(w,h,d),x0,z0,x1,z1,h,kind),[fm(kind),fm(kind),mt(0x4a4a50,.95),mt(0x4a4a50,.95),fm(kind),fm(kind)]);m.position.set(cx,h/2,cz);m.castShadow=m.receiveShadow=true;sc.add(m);
  box(cx,.25,cz,w+.5,.5,d+.5,0x6c665a,0);
  box(cx,h+.2,cz,w+.7,.4,d+.7,o.trim||0xe9e3d3);
  let top=h+.4;
  if(o.roof==='hip'){const rh=o.rh||Math.min(w,d)*.3;const r=new THREE.Mesh(HIPG,mt(o.rc||0x3c4150,.75));r.scale.set(w+1.6,rh,d+1.6);r.position.set(cx,h+.4,cz);r.castShadow=true;r.receiveShadow=true;sc.add(r);top+=rh}
  else{const pc=o.trim||0xd8d0bf;box(cx,h+.75,z0+.2,w,.7,.4,pc);box(cx,h+.75,z1-.2,w,.7,.4,pc);box(x0+.2,h+.75,cz,.4,.7,d,pc);box(x1-.2,h+.75,cz,.4,.7,d,pc);if(w>14&&d>14){box(cx+w*.18,h+1.1,cz-d*.18,2.6,1.6,2.2,0x8a8d92);box(cx-w*.2,h+.9,cz+d*.15,1.6,1,1.6,0x777a80)}}
  markR(x0,z0,x1,z1,top);
  if(o.door){const[a,face]=o.door;b.face=face;b.da=a;
    fbox(b,face,a,0,3.6,.34,4.3,0,o.dtrim||0xefe9db);fbox(b,face,a,.14,2.4,.3,3.5,0,o.dc||0x3d2617);
    fbox(b,face,a,1,4.6,2,.28,0,0x9a9286,0);
    const lk=fbox(b,face,a,.32,.5,.12,.5,2.7,bm(0xffe2a0),0);b.lamp=lk;
    const[ex,ez]=fpos(b,face,a,2.3);b.ex=ex;b.ez=ez;FD.doors.push(fpos(b,face,a,0));
    if(o.portico){const ph=Math.min(h-.6,7.4);for(const k of[-4.8,-1.7,1.7,4.8]){const[x,z]=fpos(b,face,a+k,2.9);const c=new THREE.Mesh(COLG,mt(0xf3efe5,.55));c.scale.y=ph;c.position.set(x,ph/2,z);c.castShadow=c.receiveShadow=true;sc.add(c);markC(x,z,.42,ph)}
      fbox(b,face,a,1.6,11.6,3.4,.8,ph,0xf3efe5);
      const sh=new THREE.Shape();sh.moveTo(-5.9,0);sh.lineTo(5.9,0);sh.lineTo(0,2.2);sh.closePath();const pg=new THREE.ExtrudeGeometry(sh,{depth:3.3,bevelEnabled:false});pg.translate(0,0,-1.65);const pm=new THREE.Mesh(pg,mt(0xf3efe5,.55));const[x,z]=fpos(b,face,a,1.6);pm.position.set(x,ph+.8,z);pm.rotation.y=fry(face);pm.castShadow=true;sc.add(pm);
      if(o.letters){fsign(b,face,a,3.4,ph+.4,o.letters,10.6,2.0,o.lb||'#7d1f2c','#f6dc8a');const[px,pz]=fpos(b,face,a,3.3);const pl=signMesh(o.letters,2.4,1,o.lb||'#7d1f2c','#f6dc8a');pl.position.set(px,ph+2.05,pz);pl.rotation.y=fry(face);sc.add(pl)}}
    if(o.awning){fbox(b,face,a,1.1,6.4,2.2,.2,3.95,o.awning)}}
  if(o.sign){const sf=o.signFace||(o.door&&o.door[1]);const sa=o.signA!=null?o.signA:(o.door?o.door[0]:(FACE[sf][0]?cz:cx));fsign(b,sf,sa,.14,o.signY||(o.awning?5.4:Math.min(h-1.3,5.2)),o.sign,o.sw||Math.min(12,(FACE[sf][0]?d:w)*.8),o.sh||1.25,o.sbg||'#14203a',o.sfg||'#e2b64c',o.sfont)}
  B.push(b);return b}
function flat(x0,z0,x1,z1,y,mat,unit,unitV){const w=x1-x0,d=z1-z0,g=new THREE.PlaneGeometry(w,d);if(unit){const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*w/unit,uv.getY(i)*d/(unitV||unit))}const e=new THREE.Mesh(g,mat);e.rotation.x=-PI/2;e.position.set((x0+x1)/2,y,(z0+z1)/2);e.receiveShadow=true;sc.add(e);return e}
function road(x0,z0,x1,z1){RD.push([x0,z0,x1,z1]);flat(x0,z0,x1,z1,.035,TM.asphalt,10);roadR(x0,z0,x1,z1);const hz=(x1-x0)>(z1-z0);
  if(hz){flat(x0,z0-2.2,x1,z0,.03,TM.concrete,4);flat(x0,z1,x1,z1+2.2,.03,TM.concrete,4);roadR(x0,z0-2.2,x1,z1+2.2);const zc=(z0+z1)/2;flat(x0,zc-.12,x1,zc+.12,.045,TM.dashH,6,1);for(let x=x0+9;x<x1;x+=24){LAMPS.push([x,z0-1.5]);LAMPS.push([x+12,z1+1.5])}}
  else{flat(x0-2.2,z0,x0,z1,.03,TM.concrete,4);flat(x1,z0,x1+2.2,z1,.03,TM.concrete,4);roadR(x0-2.2,z0,x1+2.2,z1);const xc=(x0+x1)/2;flat(xc-.12,z0,xc+.12,z1,.045,TM.dashV,1,6);for(let z=z0+9;z<z1;z+=24){LAMPS.push([x0-1.5,z]);LAMPS.push([x1+1.5,z+12])}}}
function path(x0,z0,x1,z1,mat){PT.push([x0,z0,x1,z1]);flat(x0,z0,x1,z1,.025,mat||TM.pavers,4);roadR(x0,z0,x1,z1)}
function tryTree(x,z,s=1,hs=0){if(x<3||z<3||x>WW-3||(z>OD-3&&!(z>540+LZ&&z<1330)))return false;if(typeof DECKS!=='undefined'&&DECKS.some(d=>{if(d.area||!d.bb||x<d.bb[0]-4||x>d.bb[2]+4||z<d.bb[1]-4||z>d.bb[3]+4)return false;const q=deckQ(d,x,z);return q.out===0&&q.off<d.hw+(hs?2.2:3.2)*s&&q.y-terrH(x,z)>1.2}))return false;if(NOTREE.some(r=>x>r[0]&&x<r[2]&&z>r[1]&&z<r[3]))return false;if(!freeAt(x,z,1.7))return false;for(const[a,b]of[[0,0],[1.6,0],[-1.6,0],[0,1.6],[0,-1.6]])if(onRoad(x+a,z+b))return false;TREES.push([x,z,hs?s:s*(.85+rnd()*.35),hs]);markC(x,z,.5,9);return true}
function fence(x0,z0,x1,z1){FENCES.push([x0,z0,x1,z1]);const L=Math.hypot(x1-x0,z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2,hz=Math.abs(x1-x0)>Math.abs(z1-z0);box(cx,1.55,cz,hz?L:.08,.08,hz?.08:L,0x1d1f24,0);box(cx,.35,cz,hz?L:.08,.08,hz?.08:L,0x1d1f24,0);for(let t=0;t<=L;t+=2.5){const x=hz?Math.min(x0,x1)+t:x0,z=hz?z0:Math.min(z0,z1)+t;box(x,.85,z,.09,1.7,.09,0x1d1f24,0)}markR(Math.min(x0,x1)-.3,Math.min(z0,z1)-.3,Math.max(x0,x1)+.3,Math.max(z0,z1)+.3,1.7)}
function car(x,z,rot,col){const g=new THREE.Group();const add=(m,geo,px,py,pz)=>{const e=new THREE.Mesh(geo,m);e.position.set(px,py,pz);e.castShadow=true;e.receiveShadow=true;g.add(e)};add(mt(col,.35,.3),bgeo(1.9,.75,4.3),0,.62,0);add(mt(0x1b222c,.2,.4),bgeo(1.7,.62,2.2),0,1.28,-.25);add(mt(col,.35,.3),bgeo(1.74,.12,2.3),0,1.62,-.25);const wg=GC.wheel||(GC.wheel=new THREE.CylinderGeometry(.38,.38,.3,14).rotateZ(PI/2));for(const[a,b]of[[-.9,1.35],[.9,1.35],[-.9,-1.35],[.9,-1.35]])add(mt(0x16171a),wg,a,.38,b);add(bm(0xfff4cf),bgeo(.4,.18,.05),-.6,.75,2.16);add(bm(0xfff4cf),bgeo(.4,.18,.05),.6,.75,2.16);add(bm(0xa41818),bgeo(.4,.18,.05),-.6,.75,-2.16);add(bm(0xa41818),bgeo(.4,.18,.05),.6,.75,-2.16);g.position.set(x,0,z);g.rotation.y=rot;sc.add(g);const ew=Math.abs(Math.sin(rot))>.5;markR(x-(ew?2.2:1),z-(ew?1:2.2),x+(ew?2.2:1),z+(ew?1:2.2),1.7)}
// ellipse helpers (lake + kart track)
const LZ=480,INTZ=OD+600,LK={x:70,z:608+LZ,rx:34,rz:22},TK={x:70,z:608+LZ,rx:46,rz:36,w:3.6};
const inLake=(x,z)=>((x-LK.x)/LK.rx)**2+((z-LK.z)/LK.rz)**2<1;
const HOLLOW_W=[[410,1175,120,64],[590,1240,28,18]];
const HOLLOW_D=[[402.3,1095,405.7,1135],[378.3,1215,381.7,1245],[588.3,1214,591.7,1232]];
const HOLLOW_T=[[240,1027,248,1262],[440,1027,448,1115],[566,1027,574,1215],[116,1086,240,1092],[158,1262,640,1268],[388,1088,396,1095]];
const onDock=(x,z)=>(x>67.6&&x<72.4&&z>580+LZ&&z<602.5+LZ)||HOLLOW_D.some(r=>x>r[0]&&x<r[2]&&z>r[1]&&z<r[3]);
const trackPos=th=>[TK.x+TK.rx*Math.cos(th),TK.z+TK.rz*Math.sin(th)];
const trackR=(x,z)=>Math.hypot((x-TK.x)/TK.rx,(z-TK.z)/TK.rz);

let ram,ramHome,gateMesh,clockCtx,clockTex,fountainPts,radioBlink,kartGates=[],pongCups,bulbs,trunkIM;
// modern facades: brutalist concrete, ribbed tower, curtain-wall glass, metal panel, terracotta, white panel, striped brick
const FX2={ccmR:1,conc:1,concT:1,glass:1,metal:1,terra:1,white:1,stripe:1,diag:1,arcade:1,cchT:1,cchG:1,cchB:1,dpMix:1,dpG:1,dpP:1,dpL:1,dpS:1,dpW:1,dbG:1,dbT:1,dbP:1,dbL:1,dbW:1,dbGl:1,daapO:1,rieve:1,tanC:1,fins:1,panelG:1,panelW:1,darkM:1,zinc:1,zincP:1,tucB:1,langsam:1,langT:1,lindL:1,lindD:1,baldB:1,stegB:1,upav:1,rustD:1,diet:1,wpav:1,wpavL:1,zincH:1,rhodes:1,erc2:1,morg:1,morgC:1,spenc:1,daniels:1,eastG:1,eastB:1,eastD:1,french:1,brickM:1};
let COURT=null;const courtTex=()=>{if(!COURT)COURT=ctex(256,128,q=>{q.fillStyle='#3e7a5e';q.fillRect(0,0,256,128);q.fillStyle='#2f5f8f';q.fillRect(26,22,204,84);q.strokeStyle='#f4f4ee';q.lineWidth=2.4;q.strokeRect(26,22,204,84);q.beginPath();q.moveTo(26,32);q.lineTo(230,32);q.moveTo(26,96);q.lineTo(230,96);q.moveTo(72,32);q.lineTo(72,96);q.moveTo(184,32);q.lineTo(184,96);q.moveTo(72,64);q.lineTo(184,64);q.stroke();q.strokeStyle='#1a1c20';q.lineWidth=2;q.beginPath();q.moveTo(128,16);q.lineTo(128,112);q.stroke()});const t=COURT.clone();t.needsUpdate=true;return t};
function facade2(kind){FD.k=kind;FD.rec[kind]=[];const S=512,em=document.createElement('canvas');em.width=em.height=S;const qe=em.getContext('2d');qe.fillStyle='#000';qe.fillRect(0,0,S,S);const lit=(x,y,w,h)=>{fdRec(x,y,w,h);if(rnd()<.5){qe.fillStyle=rnd()<.8?'#ffc670':'#c0dcff';qe.fillRect(x,y,w,h)}};
  const glassG=(q,x,y,w,h)=>{const g=q.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#8fb0c8');g.addColorStop(1,'#34495c');q.fillStyle=g;q.fillRect(x,y,w,h)};
  const map=ctex(S,S,q=>{
    if(kind==='ccmR')ccmRibbon(q,lit,glassG,S);
    else if(kind==='conc'){q.fillStyle='#a7a297';q.fillRect(0,0,S,S);speck(q,S,S,6000,40,6,58,70,2);for(let x=0;x<S;x+=12){q.fillStyle='rgba(60,56,50,.08)';q.fillRect(x,0,1,S)}
      for(let r=0;r<4;r++){const y=r*128+46;q.fillStyle='#6c685f';q.fillRect(0,y-6,S,6);glassG(q,0,y,S,40);for(let x=0;x<S;x+=32){q.fillStyle='#55524b';q.fillRect(x,y,3,40);lit(x+3,y,29,40)}q.fillStyle='rgba(0,0,0,.25)';q.fillRect(0,y+40,S,4)}}
    else if(kind==='concT'){q.fillStyle='#a39e93';q.fillRect(0,0,S,S);speck(q,S,S,5000,40,6,56,68,2);for(let r=0;r<4;r++)for(let x=0;x<S;x+=26){const y=r*128+14;glassG(q,x+7,y,12,100);lit(x+7,y,12,100)}}
    else if(kind==='zinc'||kind==='zincP'){q.fillStyle='#565c65';q.fillRect(0,0,S,S);
      for(let y=0;y<=S;y+=12)for(let x=((y/12)%2)*12;x<=S+12;x+=24){q.fillStyle=shade('#646b75',rnd()*14-7);q.beginPath();q.moveTo(x,y-11);q.lineTo(x+11,y);q.lineTo(x,y+11);q.lineTo(x-11,y);q.closePath();q.fill()}
      if(kind==='zinc'){glassG(q,0,397,S,115);for(let x=0;x<S;x+=48){q.fillStyle='#41464d';q.fillRect(x,397,5,115);lit(x+5,400,43,110)}q.fillStyle='#3a3f46';q.fillRect(0,381,S,16);
        for(const x of[58,314]){q.fillStyle='#30353c';q.fillRect(x-4,294,50,50);glassG(q,x,298,42,42);lit(x,298,42,42)}
        for(let x=20;x<S;x+=128){q.fillStyle='#1f2328';q.fillRect(x,179,84,30);lit(x,179,84,30)}}}
    else if(kind==='tucB'){q.fillStyle='#b3a897';q.fillRect(0,0,S,S);
      for(let y=0;y<S;y+=8){const hd=(y/8)%2;for(let x=0,k=0;x<S;k++){const L=(k+hd)%2?16:8;q.fillStyle=L===8?shade('#6e3325',rnd()*12-6):shade('#8a4330',rnd()*16-8);q.fillRect(x+1,y+1,L-1,6);x+=L}}
      const LSc='#ddd6c6';q.fillStyle=LSc;q.fillRect(0,483,S,29);q.fillStyle='#c9c1ae';q.fillRect(0,481,S,3);q.fillRect(0,352,S,13);q.fillStyle=LSc;q.fillRect(0,354,S,10);
      for(let k=0;k<4;k++){const cx=k*128+64;
        for(const[y0,y1]of[[381,470],[243,326]]){const w=40,x=cx-w/2;q.fillStyle='#f3f0e8';q.fillRect(x-5,y0-5,w+10,y1-y0+10);glassG(q,x,y0,w,y1-y0);lit(x,y0,w,y1-y0);q.fillStyle='#f3f0e8';q.fillRect(x,(y0+y1)/2-2,w,4);for(let i=1;i<4;i++)q.fillRect(x+i*w/4-1,y0,2,y1-y0);for(let j=1;j<4;j++)q.fillRect(x,y0+j*(y1-y0)/4-1,w,2);q.fillStyle=LSc;q.fillRect(x-9,y1+4,w+18,6)}
        q.fillStyle='#d6cebd';q.fillRect(cx-28,366,56,13);q.fillStyle='rgba(90,80,60,.35)';q.fillRect(cx-28,378,56,2)}}
    else if(kind==='langsam'||kind==='langT'){// Langsam Library: tan-brown brick, piers over a recessed glass ground floor, deep ribbon windows under the cantilevered top floors
      const BR='#8e6b55',brk=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y+=6){const off=((y/6)%2)*7;for(let x=x0-off;x<x0+w;x+=14){q.fillStyle=shade(BR,rnd()*14-7);q.fillRect(Math.max(x0,x+1),y+1,Math.min(12,x0+w-Math.max(x0,x+1)),4)}}};
      q.fillStyle='#6f5444';q.fillRect(0,0,S,S);brk(0,0,S,S);
      if(kind==='langT'){for(const x of[120,376]){q.fillStyle='#2b2622';q.fillRect(x,40,16,420);glassG(q,x+2,44,12,412);lit(x+2,44,12,412)}}
      else{glassG(q,0,378,S,134);for(let x=0;x<S;x+=40){q.fillStyle='#3a332d';q.fillRect(x,378,3,134);lit(x+3,380,37,130)}q.fillStyle='rgba(0,0,0,.35)';q.fillRect(0,378,S,10);
        for(const px of[0,256]){q.fillStyle='#6f5444';q.fillRect(px,378,54,134);brk(px,378,52,134);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(px+50,378,4,134)}
        q.fillStyle='#cfc9bd';q.fillRect(0,352,S,26);q.fillStyle='rgba(0,0,0,.18)';q.fillRect(0,376,S,3);
        for(let x=0;x<S;x+=128){glassG(q,x+20,269,88,45);lit(x+20,269,88,45);q.fillStyle='rgba(0,0,0,.4)';q.fillRect(x+20,265,88,5)}
        glassG(q,0,134,S,71);for(let x=0;x<S;x+=51){q.fillStyle='#2e2823';q.fillRect(x,134,3,71);lit(x+3,136,48,67)}q.fillStyle='rgba(0,0,0,.45)';q.fillRect(0,134,S,8);q.fillStyle='rgba(0,0,0,.22)';q.fillRect(0,108,S,4)}}
    else if(kind==='lindL'||kind==='lindD'){// Carl H. Lindner Hall: staggered vertical panels and glass, shifting floor to floor, over a glazed ground floor
      const P1=kind==='lindL'?'#c7cbcf':'#4d5258',P2=kind==='lindL'?'#b3b8bd':'#3f444a';glassG(q,0,0,S,S);
      for(let x=0;x<S;x+=40){q.fillStyle='#5a5f66';q.fillRect(x,384,4,128);lit(x+4,388,36,124)}q.fillStyle=kind==='lindL'?'#dfe2e4':'#5d6268';q.fillRect(0,376,S,9);
      for(let r=0;r<3;r++){const y=r*126;let x=-((r*37)%70),k=r;while(x<S){const w=[22,34,16,28,40,18][k%6],g=[14,26,10,30,18,22][(k*5+r)%6];q.fillStyle=k%3?P1:P2;q.fillRect(x,y+8,w,118);q.fillStyle='rgba(0,0,0,.2)';q.fillRect(x+w,y+8,3,118);lit(x+w+3,y+10,g-3,114);x+=w+g;k++}
        q.fillStyle=kind==='lindL'?'#e3e6e8':'#5d6268';q.fillRect(0,y,S,8)}}
    else if(kind==='baldB'){// Baldwin Hall: red brick, limestone base, stringcourses and window heads, white sash windows in five bays
      q.fillStyle='#b4a593';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*10;for(let x=-off;x<S;x+=20){q.fillStyle=shade('#8f432f',rnd()*16-8);q.fillRect(x+1,y+1,18,6)}}
      const LSc='#e2dccd';q.fillStyle=LSc;q.fillRect(0,474,S,38);q.fillRect(0,368,S,10);q.fillRect(0,104,S,8);
      for(let k=0;k<5;k++){const cx=Math.round(k*102.4+51);for(const[y0,y1]of[[397,462],[250,326],[122,198],[18,86]]){const w=38,x=cx-w/2;q.fillStyle='#f4f1ea';q.fillRect(x-4,y0-4,w+8,y1-y0+8);glassG(q,x,y0,w,y1-y0);lit(x,y0,w,y1-y0);q.fillStyle='#f4f1ea';q.fillRect(x,(y0+y1)/2-2,w,4);q.fillRect(cx-1,y0,2,y1-y0);q.fillStyle=LSc;q.fillRect(x-7,y1+4,w+14,5);q.fillRect(x-6,y0-12,w+12,7);q.fillStyle='#cfc6b2';q.fillRect(cx-4,y0-14,8,10)}}}
    else if(kind==='stegB'){// Steger's base: big orange-red brick piers between glass storefronts on a granite plinth
      glassG(q,0,0,S,S);for(let x=0;x<S;x+=32){q.fillStyle='#2c3138';q.fillRect(x,0,3,S);lit(x+3,0,29,S)}for(let y=0;y<S;y+=128){q.fillStyle='#2c3138';q.fillRect(0,y+60,S,4)}
      for(const px of[0,192,384]){q.fillStyle='#8a4030';q.fillRect(px,0,60,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*9;for(let x=px-off;x<px+58;x+=18){q.fillStyle=shade('#a5513a',rnd()*16-8);q.fillRect(Math.max(px,x+1),y+1,16,6)}}q.fillStyle='rgba(0,0,0,.25)';q.fillRect(px+58,0,4,S)}
      q.fillStyle='#b8b1a8';q.fillRect(0,493,S,19)}
    else if(kind==='upav'){// University Pavilion: glass curtain wall with white floor bands and white stone piers
      glassG(q,0,0,S,S);for(let x=0;x<S;x+=43){q.fillStyle='#d8dcdf';q.fillRect(x,0,3,S);lit(x+3,0,40,S)}for(let r=0;r<4;r++){q.fillStyle='#eef0ef';q.fillRect(0,r*128,S,14)}for(const x of[0,256]){q.fillStyle='#f2f2ef';q.fillRect(x,0,26,S);q.fillStyle='rgba(0,0,0,.12)';q.fillRect(x+26,0,3,S)}}
    else if(kind==='rustD'){// the rust-red curved drum at Mary Emery Hall, seen across Backstage Drive from the TUC plaza
      q.fillStyle='#7a3b26';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=20){q.fillStyle=shade('#8a4630',rnd()*14-7);q.fillRect(0,y+2,S,17);q.fillStyle='rgba(30,10,5,.35)';q.fillRect(0,y,S,2)}speck(q,S,S,4000,18,40,24,34,2);
      for(const x of[90,346]){q.fillStyle='#2a2422';q.fillRect(x,300,70,48);glassG(q,x+3,303,64,42);lit(x+3,303,64,42)}}
    else if(kind==='diet'){// Dieterle Vocal Arts Center: red brick with projecting checker courses, white-trimmed sash windows
      q.fillStyle='#b8ab98';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*10;for(let x=-off;x<S;x+=20){q.fillStyle=shade('#8a3a28',rnd()*18-9);q.fillRect(x+1,y+1,18,6)}}
      for(const y of[150,340])for(let x=0;x<S;x+=16){q.fillStyle=(x/16)%2?'#6e2a1c':'#9a4632';q.fillRect(x,y,14,10)}q.fillStyle='#f0ece2';q.fillRect(0,486,S,26);
      for(let k=0;k<4;k++){const cx=k*128+64;for(const[y0,y1]of[[380,468],[190,300]]){const w=46,x=cx-w/2;q.fillStyle='#f4f1ea';q.fillRect(x-7,y0-7,w+14,y1-y0+14);glassG(q,x,y0,w,y1-y0);lit(x,y0,w,y1-y0);q.fillStyle='#f4f1ea';q.fillRect(x,(y0+y1)/2-2,w,4);q.fillRect(cx-1,y0,2,y1-y0)}}}
    else if(kind==='zincH'){// TUC's south block where the name is: horizontal zinc panels
      q.fillStyle='#62686f';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=16){q.fillStyle=shade('#6a7077',rnd()*10-5);q.fillRect(0,y+1,S,14);q.fillStyle='rgba(20,24,28,.35)';q.fillRect(0,y,S,1)}for(let x=0;x<S;x+=96){q.fillStyle='rgba(20,24,28,.25)';q.fillRect(x,0,1,S)}}
    else if(kind==='wpavL'){// the West Pavilion's lower floors: white precast panels, concourse openings and stair landings
      q.fillStyle='#e4e4df';q.fillRect(0,0,S,S);for(let x=0;x<S;x+=64){q.fillStyle='rgba(0,0,0,.08)';q.fillRect(x,0,2,S)}for(let y=0;y<S;y+=96){q.fillStyle='rgba(0,0,0,.08)';q.fillRect(0,y,S,2)}
      for(let x=24;x<S;x+=128){q.fillStyle='#3d4249';q.fillRect(x,380,80,132);q.fillStyle='#55606a';q.fillRect(x+6,250,68,70);lit(x+6,250,68,70)}}
    else if(kind==='wpav'){// Nippert West Pavilion: stacked glazed club and suite levels between white floor bands
      q.fillStyle='#e8e8e4';q.fillRect(0,0,S,S);for(let r=0;r<4;r++){const y=r*128;glassG(q,0,y+30,S,90);for(let x=0;x<S;x+=32){q.fillStyle='#c8ccd0';q.fillRect(x,y+30,3,90);lit(x+3,y+30,29,90)}q.fillStyle='rgba(0,0,0,.22)';q.fillRect(0,y+30,S,6);q.fillStyle='#cfd1d1';q.fillRect(0,y+120,S,3)}}
    else if(kind==='rieve'){// Rieveschl Hall (tour 930 s): buff brick bays standing proud between recessed window slots, concrete floor bands
      q.fillStyle='#b49a7c';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*9;for(let x=-off;x<S;x+=18){q.fillStyle=shade('#c2a787',rnd()*14-7);q.fillRect(x+1,y+1,16,6)}}
      for(let r=0;r<4;r++){q.fillStyle='#8c8c86';q.fillRect(0,r*128+120,S,8)}
      for(let x=96;x<S;x+=128){q.fillStyle='#5d564f';q.fillRect(x-2,0,36,S);for(let r=0;r<4;r++){glassG(q,x+4,r*128+18,24,92);lit(x+4,r*128+18,24,92);q.fillStyle='#3b3631';q.fillRect(x+4,r*128+62,24,3)}q.fillStyle='rgba(0,0,0,.28)';q.fillRect(x-2,0,6,S)}}
    else if(kind==='rhodes'){// Rhodes Hall: tan precast panels, a grid of deep-set windows
      q.fillStyle='#c7b597';q.fillRect(0,0,S,S);speck(q,S,S,5000,36,18,64,76,2);for(let x=0;x<S;x+=64){q.fillStyle='rgba(80,64,44,.18)';q.fillRect(x,0,2,S)}
      for(let r=0;r<4;r++){q.fillStyle='rgba(80,64,44,.2)';q.fillRect(0,r*128,S,3);for(let k=0;k<8;k++){const x=k*64+12,y=r*128+34;q.fillStyle='#6d5d48';q.fillRect(x-3,y-3,46,64);glassG(q,x,y,40,58);lit(x,y,40,58);q.fillStyle='rgba(0,0,0,.35)';q.fillRect(x,y,40,7)}}}
    else if(kind==='erc2'){// Mantei Center (Michael Graves): orange-red brick, buff bands, rows of porthole windows
      q.fillStyle='#9e5638';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*9;for(let x=-off;x<S;x+=18){q.fillStyle=shade('#a85d3d',rnd()*16-8);q.fillRect(x+1,y+1,16,6)}}
      for(let r=0;r<4;r++){q.fillStyle='#d6c3a2';q.fillRect(0,r*128+4,S,12);for(let k=0;k<5;k++){const cx=k*102.4+51,cy=r*128+70;q.fillStyle='#d6c3a2';q.beginPath();q.arc(cx,cy,19,0,TAU);q.fill();q.fillStyle='#2b3440';q.beginPath();q.arc(cx,cy,14,0,TAU);q.fill();q.fillStyle='rgba(160,190,210,.35)';q.beginPath();q.arc(cx-4,cy-4,6,0,TAU);q.fill();if(rnd()<.5){qe.fillStyle='#ffc670';qe.beginPath();qe.arc(cx,cy,14,0,TAU);qe.fill()}}}
      for(let x=0;x<S;x+=128){glassG(q,x+38,392,52,100);lit(x+38,392,52,100);q.fillStyle='#8a2f22';q.fillRect(x+34,388,60,4);q.fillRect(x+34,388,4,108);q.fillRect(x+90,388,4,108)}}
    else if(kind==='morg'){// Morgens and Scioto halls: blue-green glass curtain walls with dark vertical fins
      const g=q.createLinearGradient(0,0,0,S);g.addColorStop(0,'#6fa8b4');g.addColorStop(1,'#2f5f72');q.fillStyle=g;q.fillRect(0,0,S,S);
      for(let x=0;x<S;x+=32){q.fillStyle=(x/32)%4===0?'#1d3442':'#5f8f9c';q.fillRect(x,0,(x/32)%4===0?7:2,S);lit(x+8,0,22,S)}for(let y=0;y<S;y+=128){q.fillStyle='#244452';q.fillRect(0,y,S,9)}for(let y=64;y<S;y+=128){q.fillStyle='rgba(20,40,52,.5)';q.fillRect(0,y,S,2)}}
    else if(kind==='spenc'||kind==='daniels'){// Marian Spencer Hall (new orange-red brick slab) / Daniels Hall (1960s orange-tan brick tower): punched windows in a grid
      const BR=kind==='spenc'?'#a24f35':'#b56e47';q.fillStyle=shade(BR,-30);q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*9;for(let x=-off;x<S;x+=18){q.fillStyle=shade(BR,rnd()*16-8);q.fillRect(x+1,y+1,16,6)}}
      const n=kind==='spenc'?6:8,wd=kind==='spenc'?34:22,ht=kind==='spenc'?60:44;for(let r=0;r<(kind==='spenc'?4:5);r++)for(let k=0;k<n;k++){const x=k*S/n+(S/n-wd)/2,y=r*(S/(kind==='spenc'?4:5))+24;q.fillStyle=kind==='spenc'?'#4a4f55':'#d9d3c6';q.fillRect(x-3,y-3,wd+6,ht+6);glassG(q,x,y,wd,ht);lit(x,y,wd,ht)}}
    else if(kind==='eastG'||kind==='eastB'||kind==='eastD'){// the 2000s residence halls east of Campus Green: standing-seam metal panels, punched windows, brick lower floors
      const P=kind==='eastD'?'#5c626a':kind==='eastB'?'#7f95ab':'#c3c7cb';q.fillStyle=P;q.fillRect(0,0,S,S);for(let x=0;x<S;x+=12){q.fillStyle=shade(P,-20);q.fillRect(x,0,2,S)}
      if(kind==='eastB')for(let y=256;y<S;y+=8){const off=((y/8)%2)*9;for(let x=-off;x<S;x+=18){q.fillStyle=shade('#94412d',rnd()*16-8);q.fillRect(x+1,y+1,16,6)}}
      for(let r=0;r<4;r++)for(let k=0;k<4;k++){const x=k*128+30+((r*37+k*13)%3)*14,y=r*128+22,w=kind==='eastD'?60:44;q.fillStyle='#2d3238';q.fillRect(x-3,y-3,w+6,92);glassG(q,x,y,w,86);lit(x,y,w,86)}}
    else if(kind==='french'){// French Hall: white concrete, long horizontal window bands
      q.fillStyle='#e4e1d8';q.fillRect(0,0,S,S);speck(q,S,S,4000,40,6,82,90,2);for(let r=0;r<4;r++){const y=r*128+40;q.fillStyle='rgba(0,0,0,.18)';q.fillRect(0,y-5,S,5);glassG(q,0,y,S,44);for(let x=0;x<S;x+=40){q.fillStyle='#b9bcbc';q.fillRect(x,y,4,44);lit(x+4,y,36,44)}}}
    else if(kind==='brickM'){// V120 Braunstein Hall: red brick with cream cast-stone trim, a stone base, tall rectangular windows in threes on the main floor,
      // arched windows in threes above with ornamented stone spandrels between, roundels in the frieze, stone parapet (one 16 m tile = the whole wall)
      const ST='#e2dac6',STd='#c9bfa8';q.fillStyle='#b3a796';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*10;for(let x=-off;x<S;x+=20){q.fillStyle=shade('#8d3f2c',rnd()*16-8);q.fillRect(x+1,y+1,18,6)}}
      // stone base, belt course, parapet and frieze line
      q.fillStyle=ST;q.fillRect(0,392,S,120);for(let y=392;y<S;y+=20){q.fillStyle='rgba(0,0,0,.07)';q.fillRect(0,y,S,1)}for(let x=0;x<S;x+=32){q.fillStyle='rgba(0,0,0,.05)';q.fillRect(x,392,1,120)}
      q.fillStyle=ST;q.fillRect(0,0,S,30);q.fillStyle=STd;q.fillRect(0,26,S,4);q.fillStyle=ST;q.fillRect(0,58,S,6);q.fillRect(0,384,S,10);q.fillStyle=STd;q.fillRect(0,392,S,2);
      const win=(x,y,w,h,arch)=>{q.fillStyle=ST;q.fillRect(x-4,y-(arch?w/2:0)-3,w+8,h+(arch?w/2:0)+6);if(arch){q.beginPath();q.arc(x+w/2,y,w/2+4,PI,0);q.fill()}
        glassG(q,x,y,w,h);if(arch){q.save();q.beginPath();q.arc(x+w/2,y,w/2,PI,0);q.closePath();q.clip();glassG(q,x,y-w/2,w,w/2);q.restore()}lit(x,y,w,h);
        q.fillStyle='#f4f1e8';q.fillRect(x+w/2-1,y-(arch?w/2:0),2,h+(arch?w/2:0));for(let k=1;k<4;k++)q.fillRect(x,y+h*k/4-1,w,2);if(arch){q.beginPath();q.arc(x+w/2,y,w/2,PI,0);q.lineWidth=2;q.strokeStyle='#f4f1e8';q.stroke()}};
      for(let b=0;b<4;b++){const bx=b*128;
        // brick pilasters between bays
        q.fillStyle='rgba(60,18,10,.18)';q.fillRect(bx,64,4,320);q.fillRect(bx+124,64,4,320);
        // frieze roundel
        q.fillStyle=ST;q.beginPath();q.arc(bx+64,44,10,0,TAU);q.fill();q.strokeStyle=STd;q.lineWidth=2;q.beginPath();q.arc(bx+64,44,6,0,TAU);q.stroke();
        for(let w=0;w<3;w++){const x=bx+16+w*34;win(x,110,28,92,1);win(x,262,28,108,0);win(x+3,428,22,44,0)}
        // ornamented cast-stone spandrel panel between the floors
        q.fillStyle=ST;q.fillRect(bx+12,210,104,42);q.fillStyle=STd;q.fillRect(bx+12,210,104,3);q.fillRect(bx+12,249,104,3);
        for(let k=0;k<3;k++){const cx=bx+30+k*34;q.strokeStyle='#b5aa90';q.lineWidth=2;q.beginPath();q.moveTo(cx,222);q.lineTo(cx+7,231);q.lineTo(cx,240);q.lineTo(cx-7,231);q.closePath();q.stroke();q.fillStyle='#b5aa90';q.fillRect(cx-1,229,2,4)}}}
    else if(kind==='morgC'){// the white screened crowns on Morgens and Scioto
      q.fillStyle='#e8e9e6';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=10){q.fillStyle='rgba(0,0,0,.12)';q.fillRect(0,y,S,3)}}
    else if(kind==='glass'){glassG(q,0,0,S,S);for(let r=0;r<4;r++){const y=r*128;q.fillStyle='#c9ced4';q.fillRect(0,y,S,10);for(let x=0;x<S;x+=64){q.fillStyle='rgba(255,255,255,.08)';q.beginPath();q.moveTo(x+6,y+120);q.lineTo(x+34,y+14);q.lineTo(x+44,y+14);q.lineTo(x+16,y+120);q.fill();lit(x+3,y+12,58,114)}}for(let x=0;x<S;x+=64){q.fillStyle='#b8bec6';q.fillRect(x,0,4,S)}for(let y=64;y<S;y+=128){q.fillStyle='rgba(200,206,212,.6)';q.fillRect(0,y,S,2)}}
    else if(kind==='metal'){q.fillStyle='#b9bdc3';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=16){q.fillStyle='rgba(60,64,70,.18)';q.fillRect(0,y,S,1.5)}for(let r=0;r<4;r++){const y=r*128+52;glassG(q,0,y,S,26);for(let x=0;x<S;x+=48){q.fillStyle='#8a8e94';q.fillRect(x,y,3,26);lit(x+3,y,45,26)}}}
    else if(kind==='terra'){q.fillStyle='#bf7550';q.fillRect(0,0,S,S);for(let r=0;r<4;r++){const y=r*128;glassG(q,0,y+30,S,80);for(let x=0;x<S;x+=20){q.fillStyle=shade('#c47a52',rnd()*16-8);q.fillRect(x,y+30,8,80)}lit(0,y+30,S,80);q.fillStyle='#a6603e';q.fillRect(0,y+110,S,18)}}
    else if(kind==='white'){q.fillStyle='#ecebe6';q.fillRect(0,0,S,S);for(let x=0;x<S;x+=64){q.fillStyle='rgba(0,0,0,.07)';q.fillRect(x,0,2,S)}for(let r=0;r<4;r++){const y=r*128+60;glassG(q,40,y,S-80,22);lit(40,y,S-80,22)}}
    else if(kind==='arcade'){q.fillStyle='#8c3f2c';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=8){const off=((y/8)%2)*9;for(let x=-off;x<S;x+=18){q.fillStyle=shade('#9b4a33',rnd()*16-8);q.fillRect(x+1,y+1,16,6)}}
      for(let b=0;b<4;b++){const cx=b*128+64;q.fillStyle='#d8cdb4';q.fillRect(cx-48,S-176,96,10);q.beginPath();q.moveTo(cx-44,S);q.lineTo(cx-44,S-120);q.arc(cx,S-120,44,PI,0);q.lineTo(cx+44,S);q.closePath();q.fillStyle='#d8cdb4';q.fill();q.beginPath();q.moveTo(cx-36,S);q.lineTo(cx-36,S-120);q.arc(cx,S-120,36,PI,0);q.lineTo(cx+36,S);q.closePath();q.fillStyle='#1e1a18';q.fill();q.fillStyle='#d8cdb4';q.fillRect(cx-20,S-250,40,30);q.fillStyle='#2a2522';q.fillRect(cx-15,S-246,30,24)}
      q.fillStyle='#d8cdb4';q.fillRect(0,S-292,S,12);q.fillStyle='#bfb59c';q.fillRect(0,S-298,S,6)}
    else if(kind==='dpMix'||kind.startsWith('dp')){// DAAP / Aronoff Center: Eisenman's pastel panel cladding (mint, salmon, lavender, sage, pale grey), dark-red window frames
      const C={dpG:'#a2c6b4',dpP:'#e8936f',dpL:'#b2b6d0',dpS:'#87b0a2',dpW:'#d9dad6'};
      const panel=(x,y,w,h,col)=>{q.fillStyle=col;q.fillRect(x,y,w,h);for(let i=0;i<w;i+=48){q.fillStyle=shade(col,rnd()*8-4);q.fillRect(x+i+1,y,Math.min(46,w-i-1),h)}q.fillStyle=shade(col,-38);for(let i=0;i<=w;i+=48)q.fillRect(x+i,y,2,h);for(let j=0;j<=h;j+=40)q.fillRect(x,y+j,w,2)};
      const win=(x,y,w,h,nx,ny)=>{q.fillStyle='#5e2626';q.fillRect(x-4,y-4,w+8,h+8);glassG(q,x,y,w,h);q.fillStyle='#6b2e2e';for(let i=1;i<nx;i++)q.fillRect(x+w*i/nx-2,y,4,h);for(let j=1;j<ny;j++)q.fillRect(x,y+h*j/ny-2,w,4);lit(x,y,w,h)};
      const ledge=y=>{q.fillStyle='#ece9e3';q.fillRect(0,y,S,7);q.fillStyle='rgba(0,0,0,.22)';q.fillRect(0,y+7,S,5)};
      if(kind==='dpMix'){panel(0,0,150,256,C.dpP);panel(0,256,150,256,C.dpG);panel(150,0,40,S,C.dpL);panel(190,0,200,S,C.dpG);panel(190,0,200,118,C.dpP);panel(390,0,122,190,C.dpW);panel(390,190,122,322,C.dpL);
        win(22,300,108,170,3,3);win(204,150,170,46,6,1);win(204,402,170,46,6,1);win(412,226,78,84,2,2);ledge(118);ledge(256)}
      else{const col=C[kind]||C.dpG;panel(0,0,S,S,col);const k=kind.charCodeAt(2);const y=130+(k%3)*90,x0=40+(k%4)*30;win(x0,y,S-x0-60,44,7,1);if(k%2)win(60,y+170,120,120,2,2)}}
    else if(kind.startsWith('db')){// one storey of Eisenman's panel cladding: 512px = 16 m wide x 4.5 m tall, ribbon windows with dark-red frames
      const C={dbG:'#a2c6b4',dbT:'#82ad9f',dbP:'#e8936f',dbL:'#b2b6d0',dbW:'#d9dad6'},k=kind.charCodeAt(2)+kind.length;
      if(kind==='dbGl'){glassG(q,0,0,S,S);q.fillStyle='#6b2e2e';for(let x=0;x<S;x+=64)q.fillRect(x,0,5,S);q.fillRect(0,0,S,12);q.fillRect(0,S-60,S,8);q.fillStyle='#e8936f';q.fillRect(0,0,S,40);lit(8,60,S-16,S-140)}
      else{const col=C[kind];q.fillStyle=col;q.fillRect(0,0,S,S);for(let x=0;x<S;x+=48)for(let y=0;y<S;y+=171){q.fillStyle=shade(col,rnd()*10-5);q.fillRect(x+2,y+2,44,167)}q.fillStyle=shade(col,-40);for(let x=0;x<=S;x+=48)q.fillRect(x,0,2,S);for(let y=0;y<=S;y+=171)q.fillRect(0,y,S,3);
        const win=(x,y,w,h,n)=>{q.fillStyle='#5e2626';q.fillRect(x-5,y-5,w+10,h+10);glassG(q,x,y,w,h);q.fillStyle='#6b2e2e';for(let i=1;i<n;i++)q.fillRect(x+w*i/n-2,y,4,h);lit(x,y,w,h)};
        if(k%3===0)win(30,180,300,150,6);else if(k%3===1){win(60,150,150,220,3);win(330,190,150,130,3)}else win(10,200,492,120,10)}}
    else if(kind==='daapO'){// the 1970s DAAP buildings: pale board-formed concrete, dark ribbon windows, brick piers
      q.fillStyle='#d6d0c2';q.fillRect(0,0,S,S);speck(q,S,S,5000,40,6,80,84,2);for(let x=0;x<S;x+=10){q.fillStyle='rgba(80,74,64,.06)';q.fillRect(x,0,1,S)}
      for(let r=0;r<4;r++){const y=r*128+40;q.fillStyle='rgba(0,0,0,.22)';q.fillRect(0,y-4,S,4);glassG(q,0,y,S,46);for(let x=0;x<S;x+=40){q.fillStyle='#3a332c';q.fillRect(x,y,3,46);lit(x+3,y,37,46)}}
      for(const x of[60,316]){q.fillStyle='#8a4a38';q.fillRect(x,0,26,S);for(let y=0;y<S;y+=8){q.fillStyle='rgba(0,0,0,.12)';q.fillRect(x,y,26,1)}}}
    else if(kind==='tanC'){// College of Law: warm orange-tan precast, deep horizontal window strips
      q.fillStyle='#d08a52';q.fillRect(0,0,S,S);speck(q,S,S,5000,40,6,70,80,2);for(let r=0;r<4;r++){const y=r*128+44;q.fillStyle='rgba(0,0,0,.25)';q.fillRect(0,y-6,S,6);glassG(q,0,y,S,40);for(let x=0;x<S;x+=42){q.fillStyle='#5a3a22';q.fillRect(x,y,3,40);lit(x+3,y,39,40)}}}
    else if(kind==='fins'){// Lindner Hall: white vertical aluminium fins in front of glass
      glassG(q,0,0,S,S);for(let r=0;r<4;r++){q.fillStyle='#dfe2e4';q.fillRect(0,r*128,S,12);lit(0,r*128+12,S,116)}for(let x=0;x<S;x+=22){const w=6+((x/22)%3)*3;q.fillStyle='#f2f3f2';q.fillRect(x,0,w,S);q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x+w,0,3,S)}}
    else if(kind==='panelG'||kind==='panelW'){// newer dorms: light panel grid with punched windows
      const c=kind==='panelW'?'#e9eae7':'#a9adb0';q.fillStyle=c;q.fillRect(0,0,S,S);for(let x=0;x<S;x+=64){q.fillStyle=shade(c,-22);q.fillRect(x,0,2,S)}for(let y=0;y<S;y+=64){q.fillStyle=shade(c,-22);q.fillRect(0,y,S,2)}
      for(let r=0;r<4;r++)for(let k=0;k<4;k++){const x=k*128+20,y=r*128+30;glassG(q,x,y,kind==='panelW'?88:54,74);lit(x,y,54,74)}if(kind==='panelG'){q.fillStyle='#4a4f55';q.fillRect(236,0,40,S)}}
    else if(kind==='darkM'){// dark bronze metal and glass (60 West Charlton, Fifth Third Arena's upper band)
      q.fillStyle='#2f2d2c';q.fillRect(0,0,S,S);for(let x=0;x<S;x+=32){q.fillStyle='rgba(255,255,255,.05)';q.fillRect(x,0,2,S)}for(let r=0;r<2;r++){const y=r*256+90;glassG(q,0,y,S,70);for(let x=0;x<S;x+=64){q.fillStyle='#1d1c1b';q.fillRect(x,y,4,70);lit(x+4,y,60,70)}}}
    else if(kind==='cchT'){// Clifton Court Hall: rust terracotta rainscreen, vertical joints, staggered tall window strips with dark frames
      q.fillStyle='#a2473a';q.fillRect(0,0,S,S);for(let x=0;x<S;x+=16){q.fillStyle=shade('#a2473a',rnd()*12-6);q.fillRect(x+1,0,15,S);q.fillStyle='rgba(70,24,18,.4)';q.fillRect(x,0,1,S)}for(let y=0;y<S;y+=32){q.fillStyle='rgba(70,24,18,.12)';q.fillRect(0,y,S,1)}
      const win=(x,y0,y1,w)=>{q.fillStyle='#262b32';q.fillRect(x-3,y0-3,w+6,y1-y0+6);glassG(q,x,y0,w,y1-y0);q.fillStyle='rgba(255,255,255,.1)';q.fillRect(x+3,y0,4,y1-y0);q.fillStyle='#262b32';for(let y=y0+124;y<y1-8;y+=128)q.fillRect(x,y,w,5);q.fillRect(x+w/2-1,y0,2,y1-y0);for(let y=y0+30;y<y1;y+=128){q.fillStyle='#1d2127';q.fillRect(x-5,y,w+10,3)}lit(x,y0,w,y1-y0)};
      const PAT=[[[14,244],[270,498]],[[46,178],[206,462]],[[14,498]],[[78,334],[366,498]],[[14,110],[142,398]],[[46,498]],[[14,306],[334,462]],[[110,498]]];
      for(let b=0;b<8;b++){const x=b*64+10+((b*5)%3)*6;for(const[y0,y1]of PAT[(b*3)%8])win(x,y0,y1,38);if(b%3===2){q.fillStyle='#262b32';q.fillRect(b*64+57,40+((b*7)%3)*60,5,190)}}}
    else if(kind==='cchG'){// its grey-panel wing: square punched windows with terracotta accent fins
      q.fillStyle='#5f656c';q.fillRect(0,0,S,S);for(let x=0;x<S;x+=32){q.fillStyle='rgba(20,24,28,.35)';q.fillRect(x,0,1,S)}for(let y=0;y<S;y+=64){q.fillStyle='rgba(20,24,28,.3)';q.fillRect(0,y,S,1)}
      for(let r=0;r<4;r++)for(let c=0;c<6;c++){const x=c*85+18,y=r*128+34;q.fillStyle='#262b32';q.fillRect(x-3,y-3,48,62);glassG(q,x,y,42,56);lit(x,y,42,56);if((c+r)%3===0){q.fillStyle='#a2473a';q.fillRect(x+50,y-26,14,112)}}}
    else if(kind==='cchB'){// recessed ground floor: storefront glass between dark metal panels
      q.fillStyle='#434950';q.fillRect(0,0,S,S);for(let x=0;x<S;x+=64){if((x/64)%4===3){q.fillStyle='#4d535b';q.fillRect(x+2,0,60,S);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(x+31,0,1,S);continue}glassG(q,x+5,0,54,S);q.fillStyle='#262b32';q.fillRect(x,0,5,S);lit(x+5,0,54,S)}for(let y=0;y<S;y+=128){q.fillStyle='#262b32';q.fillRect(0,y+92,S,4)}}
    else if(kind==='diag'){// V133 Lindner Center: behind the 3D precast screen (lindnerScreen, file 08) the wall is dark glass with mullions and floor slabs
      q.fillStyle='#2b3540';q.fillRect(0,0,S,S);for(let y0=0;y0<S;y0+=128){const g=q.createLinearGradient(0,y0,0,y0+128);g.addColorStop(0,'rgba(150,180,205,.35)');g.addColorStop(1,'rgba(40,55,70,0)');q.fillStyle=g;q.fillRect(0,y0,S,128);
        q.fillStyle='#c9c6be';q.fillRect(0,y0+118,S,10);for(let x=0;x<S;x+=32){q.fillStyle='#59626b';q.fillRect(x,y0,3,118)}
        for(let x=0;x<S;x+=64){qe.fillStyle=rnd()<.55?(rnd()<.8?'#ffc670':'#c0dcff'):'#000';qe.fillRect(x+2,y0+10,60,104)}}}
    else if(kind==='stripe'){q.fillStyle='#6b2b20';q.fillRect(0,0,S,S);for(let y=0;y<S;y+=10){const off=((y/10)%2)*11;for(let x=-off;x<S;x+=22){q.fillStyle=shade('#a24c36',rnd()*18-9);q.fillRect(x+1,y+1,20,8)}}for(let y=0;y<S;y+=64){q.fillStyle='#d9c7a6';q.fillRect(0,y+56,S,8)}
      for(let ty=0;ty<4;ty++)for(let tx=0;tx<4;tx++){const x=tx*128+44,y=ty*128+30;q.fillStyle='#d9c7a6';q.fillRect(x-5,y-5,50,50);glassG(q,x,y,40,40);q.fillStyle='#d9c7a6';q.fillRect(x+18,y,4,40);lit(x,y,40,40)}}});
  const emap=new THREE.CanvasTexture(em);emap.wrapS=emap.wrapT=THREE.RepeatWrapping;
  const m=SM({map,emissiveMap:emap,emissive:0xffffff,emissiveIntensity:0});FMLIST.push(m);return m}

