// ================================================================ V299 BUILDING ENTRANCES
// Every building gets a street-level entrance instead of the same window pattern all the way down: a front entrance at its
// front door point (UCD fp/fn, snapped onto the nearest wall), plus a smaller side door on the far side of big campus buildings.
// Styles: house (stoop, hood, porch light), apt (glass doors, canopy), shop (display windows, awning), classic (stone surround,
// double doors, transom, lanterns), modern (glass lobby front, two door pairs, cantilever canopy with downlights), garage
// (vehicle opening, steel door, PARKING sign), roll (garage roll-up door), side (single service door).
// All parts are plain boxes/planes with a handful of shared materials and four small door textures, so mergeStatic folds them
// into the existing static chunks (no extra draw calls to speak of, well under 1 MB of texture).
let ENTX=null;const ENTM={},ENTC={},ENTL=[],ENTAT={};   /* ENTAT[building name] = [x,z,nx,nz] of its front entrance */   /* ENTC: entrances built per style, ENTL: [x,z,nx,nz,kind] (for tests) */
function entTex(){if(ENTX)return ENTX;const T=(w,h,f)=>{const t=ctex(w,h,f);t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;return t};
  const glassG=(q,x,y,w,h)=>{const g=q.createLinearGradient(x,y,x+w*.3,y+h);g.addColorStop(0,'#5d7184');g.addColorStop(.45,'#33414f');g.addColorStop(1,'#1f2933');q.fillStyle=g;q.fillRect(x,y,w,h);
    q.fillStyle='rgba(255,255,255,.10)';q.beginPath();q.moveTo(x+w*.15,y);q.lineTo(x+w*.45,y);q.lineTo(x+w*.05,y+h*.55);q.lineTo(x,y+h*.55);q.lineTo(x,y+h*.3);q.closePath();q.fill()};
  ENTX={
    /* panel door, light grey so the material colour tints it (red, green, navy, oak …) */
    wood:T(128,256,(q,w,h)=>{q.fillStyle='#e6e6e6';q.fillRect(0,0,w,h);const pnl=(x,y,pw,ph)=>{q.fillStyle='#cfcfcf';q.fillRect(x,y,pw,ph);q.fillStyle='#f6f6f6';q.fillRect(x,y,pw,3);q.fillRect(x,y,3,ph);q.fillStyle='#a9a9a9';q.fillRect(x,y+ph-3,pw,3);q.fillRect(x+pw-3,y,3,ph)};
      for(const[y,ph]of[[16,58],[90,68],[170,70]])for(const x of[16,68])pnl(x,y,44,ph);
      q.fillStyle='#8f8f8f';q.fillRect(0,0,w,2);q.fillRect(0,h-2,w,2);q.fillStyle='#6b5a2a';q.beginPath();q.arc(104,134,6,0,TAU);q.fill();q.fillStyle='#d8c27a';q.beginPath();q.arc(103,133,4,0,TAU);q.fill()}),
    /* aluminium-framed glass door with push bar and kick plate */
    glass:T(128,256,(q,w,h)=>{q.fillStyle='#aab0b6';q.fillRect(0,0,w,h);glassG(q,11,11,w-22,h-46);q.fillStyle='#c9ced3';q.fillRect(14,h*.52,w-28,7);q.fillStyle='#8d949a';q.fillRect(14,h*.52+7,w-28,2);q.fillStyle='#9aa1a7';q.fillRect(0,h-35,w,35);q.fillStyle='#b8bec4';q.fillRect(0,h-35,w,3)}),
    /* lobby glazing: mullions, transom, warm ceiling lights and furniture shapes inside */
    lobby:T(256,256,(q,w,h)=>{glassG(q,0,0,w,h);q.fillStyle='rgba(255,236,190,.55)';for(let x=18;x<w;x+=48)q.fillRect(x,58,26,4);
      q.fillStyle='rgba(20,24,30,.55)';q.fillRect(30,170,90,36);q.fillRect(150,160,14,46);q.fillStyle='rgba(40,70,40,.6)';q.beginPath();q.arc(210,170,18,0,TAU);q.fill();q.fillStyle='rgba(15,18,22,.6)';q.fillRect(204,180,12,26);
      q.fillStyle='#b4b9be';for(const x of[0,85,170,251])q.fillRect(x,0,5,h);q.fillRect(0,0,w,5);q.fillRect(0,46,w,5);q.fillStyle='#8e959b';q.fillRect(0,h-12,w,12)}),
    /* shop display window: shelves of colourful goods */
    shop:T(256,256,(q,w,h)=>{const g=q.createLinearGradient(0,0,0,h);g.addColorStop(0,'#3a4450');g.addColorStop(1,'#232a31');q.fillStyle=g;q.fillRect(0,0,w,h);q.fillStyle='rgba(255,240,200,.5)';q.fillRect(0,10,w,6);
      const C=['#d9483b','#f2b134','#3f8fd2','#5fb35a','#e9e2d0','#b04fa8','#e8703a'];for(let y=70;y<230;y+=52){q.fillStyle='#5a4a3a';q.fillRect(10,y+30,w-20,5);for(let x=16;x<w-24;x+=12+((x*7+y)%9)){q.fillStyle=C[(x+y)%C.length];const ph=14+((x*13+y)%14);q.fillRect(x,y+30-ph,9,ph)}}
      q.fillStyle='rgba(255,255,255,.09)';q.beginPath();q.moveTo(40,0);q.lineTo(110,0);q.lineTo(20,h);q.lineTo(0,h);q.lineTo(0,90);q.closePath();q.fill();q.fillStyle='#2b3035';q.fillRect(0,0,w,6);q.fillRect(0,0,6,h);q.fillRect(w-6,0,6,h)}),
    /* grey steel service door with a small vision panel */
    steel:T(128,256,(q,w,h)=>{q.fillStyle='#9097a0';q.fillRect(0,0,w,h);for(let x=4;x<w;x+=6){q.fillStyle='rgba(255,255,255,.04)';q.fillRect(x,0,2,h)}q.fillStyle='#6f767e';q.fillRect(0,0,w,4);q.fillRect(0,0,4,h);q.fillRect(w-4,0,4,h);
      glassG(q,46,40,36,60);q.fillStyle='#c0c6cc';q.fillRect(16,h*.5,w-32,6);q.fillStyle='#7a8189';q.fillRect(0,h-26,w,26)})};
  return ENTX}
function entMat(k,o){return ENTM[k]||(ENTM[k]=SM(o))}
const ENTDC=[0x7d1f2c,0x2f4f3a,0x23324f,0x2a2a2a,0x6a4426,0xe8e2d0,0x8a6a3a,0x3f5a6a];   /* house door colours */
const ENTAW=[0xa8302a,0x2a6a3a,0x23324f,0x7a2a5a,0xc07a1a,0x2a5a7a];                      /* awning colours */

// the wall nearest to point p: {p:[x,z] snapped onto it, n:[nx,nz] outward, L, t (distance along it), ux, uz}
function entWall(poly,p,hint){let best=null,bd=1e9;for(let i=0;i<poly.length;i++){const A=poly[i],B_=poly[(i+1)%poly.length],dx=B_[0]-A[0],dz=B_[1]-A[1],L=Math.hypot(dx,dz);if(L<.6)continue;
    const t=clamp(((p[0]-A[0])*dx+(p[1]-A[1])*dz)/(L*L),0,1),x=A[0]+dx*t,z=A[1]+dz*t,ux=dx/L,uz=dz/L;let nx=uz,nz=-ux;const mx=(A[0]+B_[0])/2,mz=(A[1]+B_[1])/2;if(inPoly(mx+nx*.3,mz+nz*.3,poly)){nx=-nx;nz=-nz}
    const d=Math.hypot(p[0]-x,p[1]-z)-(hint?(nx*hint[0]+nz*hint[1])*.5:0);if(d<bd){bd=d;best={A,L,t:t*L,ux,uz,n:[nx,nz]}}}return best}
// snap a centre along the wall so an entrance of width w fits (w shrinks on short walls); returns {p,n,w} or null
function entFit(E,want,w){if(!E)return null;const room=E.L-.8;if(room<1.1)return null;w=Math.min(w,room);const c=clamp(want,w/2+.4,E.L-w/2-.4);return{p:[E.A[0]+E.ux*c,E.A[1]+E.uz*c],n:E.n,w}}

// build one entrance; p on the wall, n outward, y0 = floor level (local), w = width available
function entrance(p,n,kind,w,o={}){ENTC[kind]=(ENTC[kind]||0)+1;ENTL.push([p[0],p[1],n[0],n[1],kind]);const T=entTex(),ry=Math.atan2(n[0],n[1]),tx=n[1],tz=-n[0],y0=o.y0||0,sd=o.seed||0;
  const put=(geo,mat,a,y,out,cast)=>{const m=new THREE.Mesh(geo,mat);m.position.set(p[0]+tx*a+n[0]*out,y0+y,p[1]+tz*a+n[1]*out);m.rotation.y=ry;m.castShadow=!!cast;m.receiveShadow=true;sc.add(m);return m};
  const bx=(bw,bh,bd,col,a,y,out,cast=1,r=.8,mm=0)=>put(bgeo(bw,bh,bd),typeof col==='number'?mt(col,r,mm):col,a,y+bh/2,out+bd/2,cast);   /* box from height y up, from 'out' metres in front of the wall outwards */
  const pane=(pw,ph,mat,a,y,out)=>{const k='entp'+pw.toFixed(2)+'x'+ph.toFixed(2);return put(GC[k]||(GC[k]=new THREE.PlaneGeometry(pw,ph)),mat,a,y+ph/2,out,0)};
  const lamp=(a,y,out)=>{bx(.06,.06,out+.05,0x2a2a2a,a,y+.3,0,0,.5,.5);bx(.2,.32,.2,bm(0xffe2a0),a,y,out,0)};
  for(let a=-w/2;a<=w/2+.01;a+=2)FD.doors.push([p[0]+tx*a,p[1]+tz*a]);   /* no 3D window frames poke through the entrance */
  const GL=entMat('glass',{map:T.glass,roughness:.25,metalness:.35}),ALU=0xa9afb5;
  if(kind==='house'){const dc=ENTDC[sd%ENTDC.length],D=entMat('wood'+dc,{map:T.wood,color:dc,roughness:.6}),sh=.34;
    bx(1.9,sh,1.25,0xb9b3a7,0,0,0);bx(1.9,sh/2,.38,0xb2aca0,0,0,1.25);
    pane(.95,2.1,D,0,sh,.07);bx(.13,2.28,.14,0xf2efe8,-.54,sh,0);bx(.13,2.28,.14,0xf2efe8,.54,sh,0);bx(1.34,.14,.16,0xf2efe8,0,sh+2.2,0);
    bx(1.75,.1,.8,0x3c3f45,0,sh+2.55,0);bx(.08,.32,.55,0xf2efe8,-.78,sh+2.24,0);bx(.08,.32,.55,0xf2efe8,.78,sh+2.24,0);lamp(.86,sh+1.65,.08);return}
  if(kind==='apt'){const W2=Math.min(w,3.2);bx(W2+1.4,.12,2.1,0xbdb9b0,0,0,0);
    pane(.96,2.25,GL,-.5,.12,.06);pane(.96,2.25,GL,.5,.12,.06);pane(1.96,.55,GL,0,2.45,.06);
    for(const a of[-1.03,0,1.03])bx(.08,2.95,.12,ALU,a,.12,0,1,.4,.5);bx(2.14,.1,.12,ALU,0,2.37,0,1,.4,.5);bx(2.14,.1,.12,ALU,0,3.0,0,1,.4,.5);
    bx(W2+.4,.18,1.6,0x4a4f55,0,3.15,0,1,.6,.3);for(const a of[-.8,.8]){const d=bx(.24,.03,.24,bm(0xfff3c4),a,3.12,.6,0)}lamp(-1.5,1.9,.08);return}
  if(kind==='shop'){const W2=Math.max(3.2,Math.min(w,9)),aw=ENTAW[sd%ENTAW.length],SH=entMat('shop',{map:T.shop,roughness:.3,metalness:.2}),dw=1.0,ww=(W2-dw-.5)/2;
    bx(W2,.45,.1,0x2d3135,0,0,0);pane(ww,2.25,SH,-(dw/2+.15+ww/2),.45,.06);pane(ww,2.25,SH,(dw/2+.15+ww/2),.45,.06);pane(dw,2.25,GL,0,.04,.06);
    for(const a of[-W2/2,-(dw/2+.1),(dw/2+.1),W2/2])bx(.12,2.75,.12,0x2d3135,a,0,0,1,.5,.3);bx(W2+.12,.14,.14,0x2d3135,0,2.7,0,1,.5,.3);
    const A=put(bgeo(W2+.5,.07,1.5),mt(aw,.75),0,3.25,.72,1);A.rotation.order='YXZ';A.rotation.x=.38;bx(W2+.5,.28,.06,mt(aw,.75),0,2.84,1.42,0);return}
  if(kind==='classic'){const sc_=w<3.6?w/3.6:1,S=0xd8d0bd,wood=o.wood,DR=wood?entMat('wood0x4a2c1a',{map:T.wood,color:0x4a2c1a,roughness:.55}):entMat('glassB',{map:T.glass,color:0xd8b48a,roughness:.25,metalness:.45});
    const dw=1.2*sc_,dh=2.7;bx(4.6*sc_,.16,2.3,0xc9c3b6,0,0,0);
    pane(dw,dh,DR,-dw/2-.02,.16,.08);pane(dw,dh,DR,dw/2+.02,.16,.08);pane(dw*2+.1,.72,GL,0,.16+dh+.12,.08);bx(dw*2+.2,.12,.14,0x3a3027,0,.16+dh,.02);
    bx(.5*sc_,3.95,.36,S,-(dw+.42*sc_),.16,0);bx(.5*sc_,3.95,.36,S,(dw+.42*sc_),.16,0);bx(dw*2+1.5*sc_,.55,.48,S,0,.16+3.62,0);bx(dw*2+1.8*sc_,.14,.62,0xe6dfcf,0,.16+4.17,0);
    lamp(-(dw+1.05*sc_),2.55,.1);lamp((dw+1.05*sc_),2.55,.1);return}
  if(kind==='modern'){const W2=Math.max(3.4,Math.min(w,9)),LB=entMat('lobby',{map:T.lobby,roughness:.22,metalness:.3}),cc=o.dark?0x3a3e44:0xd6d8d8;
    bx(W2+2,.1,3.0,0xc6c3bc,0,0,0);pane(W2,3.25,LB,0,.1,.05);
    const pr=W2>=5.4?[-1.25,1.25]:[0];for(const c of pr){pane(.92,2.3,GL,c-.47,.1,.08);pane(.92,2.3,GL,c+.47,.1,.08);bx(1.96,.1,.1,ALU,c,2.4,.05,1,.4,.5);bx(1.8,.02,1.3,0x2a2c30,c,.1,.2,0)}
    for(let a=-W2/2;a<=W2/2+.01;a+=W2/Math.max(2,Math.round(W2/1.7)))bx(.07,3.25,.1,ALU,a,.1,.04,1,.4,.5);
    bx(W2+1.4,.3,2.6,cc,0,3.45,0,1,.6,.2);for(let a=-W2/2+.6;a<=W2/2-.5;a+=1.5)bx(.26,.02,.26,bm(0xfff3c4),a,3.43,1.3,0);return}
  if(kind==='garage'){const W2=Math.min(w,7);bx(W2,2.75,.06,0x15171a,0,0,0,0);bx(W2+.8,.55,.32,0x9a978f,0,2.75,0);bx(W2-.6,.12,.12,0xe0b02a,0,2.4,.8,1,.6);
    const sg=signMesh('PARKING',2.4,.55,'#1d4f8a','#ffffff');sg.position.set(p[0]+n[0]*.36,y0+3.65,p[1]+n[1]*.36);sg.rotation.y=ry;sc.add(sg);
    if(w>W2+2.4){const a=W2/2+1.2,ST=entMat('steel',{map:T.steel,roughness:.5,metalness:.4});pane(.95,2.1,ST,a,0,.05);bx(1.6,.1,.8,0x4a4f55,a,2.45,0);lamp(a+.75,1.8,.08)}return}
  if(kind==='roll'){const W2=Math.min(w,3);bx(W2,2.3,.08,0xe9e5dc,0,0,0,1,.7);for(let y=.45;y<2.3;y+=.45)bx(W2,.03,.1,0xb8b3a8,0,y,0,0);bx(W2+.3,.15,.14,0xf2efe8,0,2.3,0);return}
  /* side: a single service door with a small canopy and a lamp */
  {const ST=o.glass?GL:entMat('steel',{map:T.steel,roughness:.5,metalness:.4});pane(1.0,2.15,ST,0,o.lift||0,.06);bx(.1,2.3,.12,0x6f767e,-.56,o.lift||0,0,1,.5,.4);bx(.1,2.3,.12,0x6f767e,.56,o.lift||0,0,1,.5,.4);
    bx(1.6,.1,.9,0x4a4f55,0,(o.lift||0)+2.5,0);lamp(.85,(o.lift||0)+1.75,.08)}}

// pick a style for a UCD building
const ENT_CLASSIC=new Set(['brick','brickO','brickB','baldB','diet','stone','brickM','erc2','stucco','brick2','wood']),ENT_RES=new Set(['siding','sidingP','sidingT','stucco','wood','brick2','brick']);
function entKind(b,h,area){const s=b.s,t=b.t||'',u=!!b.u;
  if(s==='roof'||b.brz||b.brg)return null;
  if(s==='garage'||t==='parking')return'garage';
  if(t==='garage')return'roll';
  if(t==='shed'||t==='guardhouse'||t==='service')return'side';
  if(t==='retail'||t==='commercial')return'shop';
  if(!u){if(ENT_RES.has(s)&&h>=7&&entMainRoad(b.fp,13))return'shop';if(t==='apartments'||t==='dormitory'||area>420||h>12||!ENT_RES.has(s))return'apt';return'house'}
  return ENT_CLASSIC.has(s)?'classic':'modern'}
// a busy road (primary/secondary/tertiary) within r metres of p
function entMainRoad(p,r){if(!p||!UCD.roads)return false;for(const R_ of UCD.roads){if(!/^(primary|secondary|tertiary)$/.test(R_.k))continue;const P_=R_.pts;for(let i=0;i+1<P_.length;i++){const[a,b]=P_[i],[c,d]=P_[i+1],dx=c-a,dz=d-b,L2=dx*dx+dz*dz||1,t=clamp(((p[0]-a)*dx+(p[1]-b)*dz)/L2,0,1);if(Math.hypot(p[0]-a-dx*t,p[1]-b-dz*t)<r+(R_.w||7)/2)return true}}return false}
// a stable small number per building, for door / awning colours
const entSeed=b=>Math.abs(Math.round((b.c?b.c[0]*7.3+b.c[1]*3.1:b.fp[0]*5+b.fp[1]))|0);

// UCD building: main entrance at the front door point, plus a side door on the far side of big campus buildings.
// Called inside buildCampus' loop before the building is shifted to its front-door level, so y 0 = the ground at the front door.
function entrancesUCD(b,main,h,lv,others){const fp=b.fp,fn=b.fn;if(!fp||!fn)return;let area=0;for(let i=0,j=main.length-1;i<main.length;j=i++)area+=(main[j][0]+main[i][0])*(main[j][1]-main[i][1]);area=Math.abs(area/2);
  if(h<1.5)return;const kind=entKind(b,h,area);if(!kind)return;
  /* walls nearest the front-door point first (facing the same way), the first one long enough for this style wins; otherwise a plain side door */
  const MINW={house:1.7,apt:2.6,shop:3.2,classic:3.0,modern:3.4,garage:4.2,roll:2.6,side:1.3},W=[];
  for(let i=0;i<main.length;i++){const A=main[i],B_=main[(i+1)%main.length],L=Math.hypot(B_[0]-A[0],B_[1]-A[1]);if(L<1.9)continue;const e=entWall(main,[(A[0]+B_[0])/2,(A[1]+B_[1])/2]);if(!e||Math.abs(e.L-L)>.01)continue;
    const dx=B_[0]-A[0],dz=B_[1]-A[1],t=clamp(((fp[0]-A[0])*dx+(fp[1]-A[1])*dz)/(L*L),0,1),d=Math.hypot(fp[0]-A[0]-dx*t,fp[1]-A[1]-dz*t),fa=e.n[0]*fn[0]+e.n[1]*fn[1];if(fa<-.2)continue;W.push(Object.assign(e,{t:t*L,sc:d-fa*2}))}
  W.sort((a,b)=>a.sc-b.sc);let E=W.find(e=>e.L-.8>=MINW[kind]),k2=kind;if(!E){E=W.find(e=>e.L-.8>=MINW.side);k2='side'}if(!E)return;
  const want={house:2.4,apt:3.8,shop:Math.min(9,Math.max(4,E.L*.45)),classic:h>=15?4.6:3.9,modern:Math.min(9,Math.max(5.4,Math.sqrt(area)*.28)),garage:9.5,roll:3.2,side:1.8}[k2];
  const F=entFit(E,E.t,want);if(!F)return;if(F.w<MINW[k2])k2='side';
  /* V357: the door sits on the ground Danny actually walks on. A building whose floor level (lvo) is above or below the pavement at its door used to
     get its entrance at floor level, floating a storey up the wall or buried; now it is moved to pavement height (down the plinth or up the wall). */
  const gy=terrH(F.p[0]+F.n[0]*1.6,F.p[1]+F.n[1]*1.6)-lv,y0=Math.abs(gy)>.3?clamp(gy,-9,9):0;
  entrance(F.p,F.n,k2,F.w,{seed:entSeed(b),y0,wood:/^(baldB|diet|stone)$/.test(b.s),dark:/^(darkM|metal|lindD|zinc|stegB)$/.test(b.s)});
  ENTAT[b.n]=[F.p[0],F.p[1],F.n[0],F.n[1]];
  /* side door on big campus buildings: the longest wall facing away from the front, if the ground there is about level and nothing is in the way */
  if(!b.u||area<900||kind==='garage')return;let best=null;
  for(let i=0;i<main.length;i++){const A=main[i],B_=main[(i+1)%main.length],L=Math.hypot(B_[0]-A[0],B_[1]-A[1]);if(L<6)continue;const e=entWall(main,[(A[0]+B_[0])/2,(A[1]+B_[1])/2]);if(!e||(e.n[0]*fn[0]+e.n[1]*fn[1])>-.3)continue;if(!best||L>best.L)best=Object.assign(e,{L})}
  if(!best)return;const S2=entFit(best,best.L/2,2);if(!S2)return;const fx=S2.p[0]+S2.n[0]*1.6,fz=S2.p[1]+S2.n[1]*1.6;if(others.some(q=>q!==main&&inPoly(fx,fz,q)))return;
  const g=terrH(fx,fz)-lv;if(g>.3||g<-1.4)return;
  if(g<-.15){entrance(S2.p,S2.n,'side',2,{lift:0,glass:kind==='modern'});const ry=Math.atan2(S2.n[0],S2.n[1]),st=Math.ceil(-g/.17),m0=mt(0xbdb9b0);for(let k=0;k<st;k++){const y=-k*.17,d=1.3+k*.3,m=new THREE.Mesh(bgeo(1.9,y-g+.02,.32),m0);m.position.set(S2.p[0]+S2.n[0]*d,(y+g)/2,S2.p[1]+S2.n[1]*d);m.rotation.y=ry;m.receiveShadow=true;sc.add(m)}const ld=new THREE.Mesh(bgeo(1.9,.12-g,1.3),m0);ld.position.set(S2.p[0]+S2.n[0]*.65,(g+.12)/2,S2.p[1]+S2.n[1]*.65);ld.rotation.y=ry;ld.receiveShadow=true;sc.add(ld)}
  else entrance(S2.p,S2.n,'side',2,{glass:kind==='modern'})}

// buildings made with bld() that had no door (downtown / Lake District)
function entrancesExtra(){const L=[['apt1','s','apt'],['laund','n','shop'],['town1','n','apt'],['arcade','n','shop'],['apt2','n','apt'],['mansion','s','classic']];
  for(const[id,face,kind]of L){const b=B.find(q=>q.id===id);if(!b||b.face)continue;const[nx,nz]=FACE[face],a=nx?(b.z0+b.z1)/2:(b.x0+b.x1)/2,p=fpos(b,face,a,0),w=(nx?b.z1-b.z0:b.x1-b.x0)-1;
    entrance(p,[nx,nz],kind,Math.min(w,kind==='shop'?8:4.2),{seed:Math.round(b.x0+b.z0)})}}
