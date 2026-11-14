// ================================================================ STICKUPS: off campus after dark, a stranger may walk up, show a knife and demand $10
const ROB={n:null,cd:30,roll:0,night:-1,t:0};
function offCampus(x,z){return !(x>=141&&x<=741&&z<=576)}
function robEnd(){if(ROB.n){despawn(ROB.n);ROB.n=null}ROB.cd=120}
function robTick(dt){if(ROB.n){const n=ROB.n;ROB.t+=dt;
    if(!NP.includes(n)){ROB.n=null;return}
    if(n.rob===1){if(n.dp<2.3)robConfront(n);else if(n.dp>40||ROB.t>45||P.inside)robEnd()}
    else if(n.rob===3){if(ROB.t>9)robEnd()}
    else if(n.rob===4){if(n.down>0){if(!n.won){n.won=1;ROB.t=0;const c=10+Math.floor(rnd()*16);money(c);toast(`You fought off the mugger and found ${money$(c)} on him.`)}else if(ROB.t>15)robEnd()}else if(n.dp>45||P.inside){bubble(n,'Not worth it.',2);robEnd()}}
    return}
  if(mode!=='play'||AM||EV||CINE||P.inside||P.kart)return;ROB.cd-=dt;if(ROB.cd>0)return;
  /* V383 after curfew (11 PM to 6 AM) muggers work anywhere off Greek Row, more often, up to three times a night */const cur=S.gt>=23||S.gt<6,night=S.gt>=21||S.gt<5||cur,key=S.day-(S.gt<6?1:0);if(!night)return;if(ROB.night!==key){ROB.night=key;ROB.cnt=0}if(ROB.cnt>=(cur?3:1))return;if(cur?(P.x<134&&P.z<160):!offCampus(P.x,P.z))return;
  if((ROB.roll-=dt)>0)return;ROB.roll=4;if(rnd()>(cur?.15:.06)&&!ROB.force)return;
  // come up from behind, out of sight
  const bx=-Math.sin(P.face),bz=-Math.cos(P.face);let sp=null;for(const d of[13,10,16,8])for(const s of[0,.5,-.5,1,-1]){const a=Math.atan2(bx,bz)+s,x=P.x+Math.sin(a)*d,z=P.z+Math.cos(a)*d;if(!sp&&freeAt(x,z,.5)&&!inLake(x,z))sp=[x,z]}
  if(!sp)return;ROB.cnt=(ROB.cnt||0)+1;ROB.t=0;
  const n=spawn('townies','heights',{x:sp[0],z:sp[1],temp:1,name:'Stranger',title:'Armed mugger',lvl:clamp(S.lvl+1,3,12),lvAbs:1,shirt:0x1b1c20,sleeve:0x1b1c20,pants:0x23262c,mode:'idle'});
  n.rob=1;n.robber=1;n.mhp=n.hp=Math.round(n.mhp*1.3);n.mode='idle';ROB.n=n;bubble(n,'Hey. Hold up a sec.',2.5)}
function robConfront(n){n.rob=2;n.sp=0;n.a=Math.atan2(P.x-n.x,P.z-n.z);P.bike=0;sfx('bad');
  {const k=new THREE.Group(),bl=new THREE.Mesh(bgeo(.03,.05,.32),mt(0xd8dde2,.2,.8)),hd=new THREE.Mesh(bgeo(.05,.07,.13),mt(0x1a1a1a));bl.position.z=.24;k.add(bl,hd);k.position.set(0,-.6,.06);if(n.g.P&&n.g.P.aR){(n.g.P.hR||n.g.P.aR).add(k);if(n.g.P.hR)k.position.set(0,-.04,.05);n.g.P.aR.rotation.x=-1.2}}
  const cash=S.money,give=Math.min(10,cash);
  const ch=[];
  if(cash>=10)ch.push(['Hand over $10',()=>robGive(n,10)]);
  else if(cash>0)ch.push([`Hand over all you have (${money$(cash)})`,()=>robGive(n,cash)]);
  else ch.push(['Show him your empty wallet',()=>{bubble(n,'You\'re broke? Then you\'re useless to me.',2.5);robFight(n)}]);
  ch.push(['Fight him (he has a knife and hits much harder)',()=>robFight(n)]);
  card({title:'Stickup',sp:'',focus:n,text:`"Ten bucks. Right now. Don't make this stupid."`,ch})}
function robGive(n,v){money(-v);n.rob=3;ROB.t=0;bubble(n,pick(['Pleasure doing business.','Smart kid.','Walk away. Don\'t look back.']),2.5);if(n.g.P&&n.g.P.aR)n.g.P.aR.rotation.x=0;n.flee=9;toast(`You handed over ${money$(v)}.`)}
function robFight(n){n.rob=4;ROB.t=0;n.aggro=1;n.tgt='P';n.foe=1;bubble(n,pick(['Wrong choice.','Have it your way.','Big mistake, college boy.']),2)}
function robKO(n){if(P.med)toggleMed();if(mode!=='play')return;sfx('bad');robEnd();
  card({title:'Mugged',sp:'',text:`The knife catches you and you go down hard. When you come to, the stranger is long gone, and so is every dollar you had on you.\n\nSomeone helped you back to the ΑΣΡ house.`,ch:[['Get up',()=>{money(-S.money);S.hp=Math.round(S.mhp*.5);S.trouble=0;P.bike=0;goIn('asr',10.6,27);advance(3);NP.forEach(m=>{m.chase=0;if(!m.temp){m.aggro=0;m.tgt=null}})}]]})}
// ================================================================ FRAT BACKYARDS: beer pong + beer die
const YARDS={},YB=[],PLAYSAY=['Bounce!','Island!','Die!','Rebuttal!','Sink it!','No way!','Cups, baby!','Shoot, shoot!','That was net!','Clink!'];
const YDEF={asr:{cx:127,cz:72.4,p:4,d:2,old:1},kto:{cx:12.5,cz:32,p:4,d:0},opd:{cx:128,cz:32,p:2,d:2},kan:{cx:128,cz:120,p:4,d:4},lxa:{cx:12.5,cz:164,p:0,d:4},tchi:{cx:13.5,cz:225,p:2,d:0},pka:{cx:13.5,cz:269,p:4,d:2},sae:{cx:126,cz:269,p:2,d:4},pkp:{cx:126,cz:225,p:0,d:2}};
function frYard(id,o){const cx=o.cx,cz=o.cz,px=cx,pz=cz-2.4,dz=cz+2.2;
  const Y=YARDS[id]={cx,cz,zone:cz<206?'greek':'heights',ptx:px,ptz:pz,dtx:cx,dtz:dz};
  NOTREE.push([cx-8,cz-6.5,cx+8,cz+6.5]);
  const cg=GC.ycup||(GC.ycup=new THREE.CylinderGeometry(.06,.045,.14,10)),cm=mt(0xc0302a,.5);
  const cup=(x,y,z)=>{const m=new THREE.Mesh(cg,cm);m.position.set(x,y,z);sc.add(m)};
  const table=(x,z,w,d,col)=>{box(x,.95,z,w,.08,d,mt(col,.6));for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])box(x+a*(w/2-.1),.47,z+b*(d/2-.1),.08,.95,.08,0x333333,0);markR(x-w/2-.1,z-d/2-.1,x+w/2+.1,z+d/2+.1,1.1)};
  if(!o.old){flat(cx-7,cz-5,cx+7,cz+5,.03,TM.concrete,4);table(px,pz,2.6,1.2,0x2b4a7a);
    for(const s of[-1,1])for(let r=0;r<3;r++)for(let c=0;c<3-r;c++)cup(px+s*(1.05-r*.12),1.06,pz+(c-(2-r)/2)*.13);
    for(const sx of[-1,1]){cyl(cx+sx*6.4,1.7,cz-4.8,.06,3.4,0x333333,6,0);markC(cx+sx*6.4,cz-4.8,.1,3.4)}
    const bg=GC.bulb||(GC.bulb=new THREE.SphereGeometry(.09,8,6));for(let i=0;i<9;i++){const b=new THREE.Mesh(bg,bm(0xffe39a));b.position.set(cx-6.4+i*1.6,3.4-Math.sin(i/8*PI)*.6,cz-4.8);sc.add(b)}}
  {/* V209 a real beer die table: 4 x 8 ft plywood, ~3 ft high, a line down the middle, a pint by each corner */const tw=2.44,td=1.22;table(cx,dz,tw,td,0xc8a070);box(cx,1.0,dz,.04,.012,td,0x1d1d22,0);
    const pg=GC.pint||(GC.pint=new THREE.CylinderGeometry(.045,.037,.15,12)),pmt=GC.pintM||(GC.pintM=new THREE.MeshStandardMaterial({color:0xe0a830,roughness:.15,transparent:true,opacity:.85}));
    for(const sx of[-1,1])for(const sz of[-1,1]){const m=new THREE.Mesh(pg,pmt);m.position.set(cx+sx*(tw/2-.14),1.07,dz+sz*(td/2-.14));sc.add(m)}}
  box(cx+.1,1.04,dz+.1,.09,.09,.09,0xf6f2e8,0);box(cx+.1,1.092,dz+.1,.03,.01,.03,0x111111,0);
  const kx=cx+4.8;box(kx,.28,cz-1.4,.95,.56,.6,0x2a6aa8);box(kx,.6,cz-1.4,1,.08,.65,0xeeeeee,0);markR(kx-.55,cz-1.75,kx+.55,cz-1.05,.7);
  cyl(kx,.4,cz+1.2,.3,.8,0xb8bcc2);box(kx+.3,.6,cz+1.2,.2,.08,.08,0x222222,0);markC(kx,cz+1.2,.35,.8);
  const ball=(kind,tx,tz,arc,cupx)=>{const m=new THREE.Mesh(kind==='die'?bgeo(.09,.09,.09):(GC.yball||(GC.yball=new THREE.SphereGeometry(.05,8,6))),bm(0xf6f2e8));m.visible=false;sc.add(m);const e={m,p:[],tx:[],tz:[],arc,cupx};YB.push(e);return e};
  Y.pb=ball('pong',px,pz,.8,.95);Y.db=ball('die',cx,dz,1.6,.78)}
function buildFratYards(){for(const id in YDEF)frYard(id,YDEF[id])}
// V99 garden path from each frat's front walk, round the side of the house, to the backyard, lit by low bollard lights that glow at night.
// Route: out of the hedge gap -> along the front (outside the hedge) -> down the side yard -> along the back -> into the yard.
const YPATH={},YROUTES={};
// fallback when a neat square route is blocked (cluttered front lawns): grid search round the obstacles, then straighten it into a few legs
function yardRoute(b,Y,segFree){const st=.5,pad=14,x0=Math.min(b.x0,Y.cx)-pad,x1=Math.max(b.x1,Y.cx)+pad,z0=Math.min(b.z0,Y.cz)-pad,z1=Math.max(b.z1,Y.cz)+pad,W=Math.ceil((x1-x0)/st)+1,H=Math.ceil((z1-z0)/st)+1;
  const ok=new Uint8Array(W*H),prev=new Int32Array(W*H).fill(-1),X=i=>x0+(i%W)*st,Z=i=>z0+Math.floor(i/W)*st,idx=(x,z)=>Math.round((z-z0)/st)*W+Math.round((x-x0)/st);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)ok[j*W+i]=freeAt(x0+i*st,z0+j*st,1.05)?1:0;
  const fw=b.face==='w'?1:-1,sx=b.ex-1*fw,sz=b.ez,gx=b.face==='w'?b.x1+2.5:b.x0-2.5,gz=Y.cz;let s0=idx(sx,sz);const g0=idx(gx,gz);if(!ok[s0]||!ok[g0])return null;
  const q=[s0];prev[s0]=s0;let h=0;while(h<q.length){const c=q[h++];if(c===g0)break;const ci=c%W,cj=(c/W)|0;for(const[a,d]of[[1,0],[-1,0],[0,1],[0,-1]]){const ni=ci+a,nj=cj+d;if(ni<0||nj<0||ni>=W||nj>=H)continue;const n=nj*W+ni;if(prev[n]>=0||!ok[n])continue;prev[n]=c;q.push(n)}}
  if(prev[g0]<0)return null;const raw=[];for(let c=g0;;c=prev[c]){raw.push([X(c),Z(c)]);if(c===s0)break}raw.reverse();
  const out=[[b.ex,b.ez],raw[0]];let k=0;while(k<raw.length-1){let j=raw.length-1;while(j>k+1&&segFree(raw[k][0],raw[k][1],raw[j][0],raw[j][1]))break;while(j>k+1&&!segFree(raw[k][0],raw[k][1],raw[j][0],raw[j][1]))j--;out.push(raw[j]);k=j}
  return out}
function buildYardPaths(){const W=1.5,GLOW=[],SPAN=[],STONE=[],DEC={bush:[],flow:[],rock:[]},PATHS=[];
  const segFree=(ax,az,bx,bz)=>{const L=Math.hypot(bx-ax,bz-az);for(let d=0;d<=L;d+=.5){const t=d/(L||1);if(!freeAt(ax+(bx-ax)*t,az+(bz-az)*t,.45))return false}return true};
  // V112 distance from a point to any yard path (keeps the dressing off the stones)
  const pathD=(x,z)=>{let m=1e9;for(const pts of PATHS)for(let i=0;i<pts.length-1;i++){const[ax,az]=pts[i],[bx,bz]=pts[i+1],dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz||1,t=clamp(((x-ax)*dx+(z-az)*dz)/l2,0,1);m=Math.min(m,Math.hypot(x-ax-dx*t,z-az-dz*t))}return m};
  const HOUSES=[];
  for(const id in YDEF){const b0=B.find(q=>q.id===id),Y=YARDS[id];if(!b0||!Y||b0.x0==null)continue;
    // houses built late in buildWorld don't have their outside door point yet: derive it from the door line (da) the same way it's set later
    const b=b0.ex!=null?b0:Object.assign({},b0,{ex:b0.face==='w'?b0.x0-2.3:b0.x1+2.3,ez:b0.da!=null?b0.da:(b0.z0+b0.z1)/2});if(b.face!=='w'&&b.face!=='e')continue;const fw=b.face==='w'?1:-1;
    // V120: a path round BOTH sides of the house (z1 side first; it is the one NPCs use); nudge the legs a little if a gate post or lamp is in the way
    const ROUTES=[];for(const sd of[1,-1]){search:for(const so of[6,5,7,4.5,8])for(const fo of[2.4,3.1,1.9,4,5,6])for(const bo of[2.5,3.2,1.9]){const zs=sd>0?b.z1+so:b.z0-so,xf=b.ex-fo*fw,xb=b.face==='w'?b.x1+bo:b.x0-bo;
      const c=[[b.ex,b.ez],[xf,b.ez],[xf,zs],[xb,zs],[xb,Y.cz]];let ok=true;for(let i=1;i<c.length-1;i++)if(!segFree(c[i][0],c[i][1],c[i+1][0],c[i+1][1])){ok=false;break}if(ok){ROUTES.push(c);break search}}}
    if(!ROUTES.length){const r=yardRoute(b,Y,segFree);if(r)ROUTES.push(r)}
    if(!ROUTES.length)continue;YPATH[id]=ROUTES[0];YROUTES[id]=ROUTES;HOUSES.push(b);const inRC=(x,z)=>id==='asr'&&x<91.6&&x>79&&z>53&&z<99;
    for(const pts of ROUTES){PATHS.push(pts);
    // V112 stepping-stone path: irregular flagstones, two abreast with the odd big one, grass showing between them
    for(let i=0;i<pts.length-1;i++){const[ax,az]=pts[i],[bx,bz]=pts[i+1],L=Math.hypot(bx-ax,bz-az);if(L<.1||(i===0&&pts!==ROUTES[0]))continue;const ux=(bx-ax)/L,uz=(bz-az)/L,nx=-uz,nz=ux;
      for(let d=-.35;d<=L+.35;d+=.6){const big=rnd()<.28;for(const s of big?[0]:[-1,1]){const lo=big?(rnd()-.5)*.12:s*(.36+(rnd()-.5)*.08),dd=d+(rnd()-.5)*.12,x=ax+ux*dd+nx*lo,z=az+uz*dd+nz*lo,r=big?.5+rnd()*.08:.29+rnd()*.07;
        STONE.push([x,z,r*(.85+rnd()*.3),r*(.8+rnd()*.25),rnd()*TAU])}}
      NOTREE.push([Math.min(ax,bx)-2.8,Math.min(az,bz)-2.8,Math.max(ax,bx)+2.8,Math.max(az,bz)+2.8]);
      for(let d=0;d<=L;d+=.5){const cx=ax+ux*d,cz=az+uz*d;roadR(cx-W/2,cz-W/2,cx+W/2,cz+W/2)}}
    // V112 overhead string lights: tall wooden posts zig-zagging along the path (skipping the front walk), bulbs strung between them
    // V114: posts set well back from the stones at uneven distances, so the strings criss-cross high over the whole side yard
    const posts=[];let acc=2.5,side=1;for(let i=1;i<pts.length-1;i++){const[ax,az]=pts[i],[bx,bz]=pts[i+1],L=Math.hypot(bx-ax,bz-az),ux=(bx-ax)/L,uz=(bz-az)/L;if(L>2)GLOW.push([ax,az,bx,bz]);
      for(let d=acc;d<L-.6;d+=5.5+rnd()*2){let put=false;for(const o of[2.2+rnd()*1.6,1.6,1.1]){const x=ax+ux*d-uz*side*(W/2+o),z=az+uz*d+ux*side*(W/2+o);if(freeAt(x,z,.3)&&!onRoad(x,z)&&!inRC(x,z)){posts.push([x,z]);put=true;break}}if(put)side=-side}acc=2}
    for(let k=0;k<posts.length;k++){SPAN.push({p:posts[k]});if(k&&Math.hypot(posts[k][0]-posts[k-1][0],posts[k][1]-posts[k-1][1])<11)SPAN.push({a:posts[k-1],b:posts[k]})}
    // V112 dressing along both sides of the path legs: bushes, flower clumps and the odd rock
    for(let i=1;i<pts.length-1;i++){const[ax,az]=pts[i],[bx,bz]=pts[i+1],L=Math.hypot(bx-ax,bz-az);if(L<1)continue;const ux=(bx-ax)/L,uz=(bz-az)/L;
      for(const sg of[-1,1])for(let d=1+rnd();d<L-.5;d+=1.5+rnd()*.9){const o=W/2+1+rnd()*.9,x=ax+ux*d-uz*sg*o,z=az+uz*d+ux*sg*o;const t=rnd();if(!inRC(x,z))(t<.5?DEC.bush:t<.85?DEC.flow:DEC.rock).push([x,z])}}}}
  // V112 foundation planting along the side walls of each house
  for(const b of HOUSES)for(const zw of[b.z0-.85,b.z1+.85])for(let x=b.x0+1.1;x<b.x1-1;x+=1.25+rnd()*.4)(rnd()<.78?DEC.bush:DEC.flow).push([x+(rnd()-.5)*.3,zw+(rnd()-.5)*.25,1]);
  const nearPost=(x,z)=>SPAN.some(s=>s.p&&Math.hypot(s.p[0]-x,s.p[1]-z)<.9);
  const ok=(x,z,r)=>freeAt(x,z,r)&&!onRoad(x,z)&&pathD(x,z)>W/2+.45&&!nearPost(x,z);
  for(const k in DEC)DEC[k]=DEC[k].filter(([x,z])=>ok(x,z,k==='bush'?.5:.3));
  const mm=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sv=new THREE.Vector3(),c=new THREE.Color();
  const inst=(geo,mat,list,set,shadow)=>{if(!list.length)return null;const o=new THREE.InstancedMesh(geo,mat,list.length);list.forEach((it,i)=>set(it,i,o));o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;o.frustumCulled=false;o.userData.chunk=999;o.userData.noMerge=1;o.castShadow=!!shadow;o.receiveShadow=true;sc.add(o);return o};
  // flagstones: one jittered 8-sided slab, every stone turned/scaled/tinted differently
  if(!GC.flag8){const g=new THREE.CylinderGeometry(1,1,.07,8,1),p=g.attributes.position,jr=[];for(let a=0;a<8;a++)jr.push(.78+rnd()*.3);for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),l=Math.hypot(x,z);if(l<.01)continue;const a=Math.round((Math.atan2(z,x)/TAU*8+8))%8,k=jr[a]*(p.getY(i)>0?.94:1);p.setX(i,x*k);p.setZ(i,z*k)}g.computeVertexNormals();GC.flag8=g}
  const STC=[0x9b958a,0x8b857a,0xa9a397,0x80796f,0xb3a792,0x958b7b];
  inst(GC.flag8,SM({color:0xffffff,roughness:.95}),STONE,([x,z,sx,sz,r],i,o)=>{e.set(0,r,0);q.setFromEuler(e);v.set(x,terrH(x,z)+.025+rnd()*.012,z);sv.set(sx,1,sz);mm.compose(v,q,sv);o.setMatrixAt(i,mm);o.setColorAt(i,c.setHex(pick(STC)).offsetHSL(0,0,(rnd()-.5)*.06))});
  // bushes
  const BC=[0x3d7a34,0x467f30,0x2f6a33,0x557f2c,0x3a7041];
  inst(GC.blob2||(GC.blob2=blobGeoL(0,4,0)),SM({vertexColors:true,roughness:.92}),DEC.bush,([x,z,f],i,o)=>{const k=f?.55+rnd()*.2:.5+rnd()*.35;e.set(0,rnd()*TAU,0);q.setFromEuler(e);v.set(x,terrH(x,z)+k*.55,z);sv.set(k*(1+rnd()*.25),k*(.75+rnd()*.2),k);mm.compose(v,q,sv);o.setMatrixAt(i,mm);o.setColorAt(i,c.setHex(pick(BC)));markC(x,z,.3,.9)},1);
  // flower clumps: a low green tuft with a handful of blossoms of one colour
  const FC=[0xe8507a,0xf4f0e4,0xf2c230,0x9a62d0,0xd8342e,0xf28a3a],tufts=[],blooms=[];
  for(const[x,z]of DEC.flow){tufts.push([x,z]);const col=pick(FC);for(let k=0;k<6;k++){const a=rnd()*TAU,r=rnd()*.3;blooms.push([x+Math.cos(a)*r,z+Math.sin(a)*r,col])}}
  inst(GC.blob2,SM({vertexColors:true,roughness:.92}),tufts,([x,z],i,o)=>{const k=.32+rnd()*.08;v.set(x,terrH(x,z)+.12,z);q.identity();sv.set(k*1.2,k*.5,k*1.2);mm.compose(v,q,sv);o.setMatrixAt(i,mm);o.setColorAt(i,c.setHex(0x3f7a30))});
  inst(new THREE.IcosahedronGeometry(.075,0),SM({color:0xffffff,roughness:.7}),blooms,([x,z,col],i,o)=>{v.set(x,terrH(x,z)+.27+rnd()*.08,z);q.identity();sv.set(1,1,1);mm.compose(v,q,sv);o.setMatrixAt(i,mm);o.setColorAt(i,c.setHex(col))});
  inst(new THREE.DodecahedronGeometry(.3,0),SM({color:0xffffff,roughness:.95}),DEC.rock,([x,z],i,o)=>{e.set(rnd(),rnd()*TAU,rnd());q.setFromEuler(e);v.set(x,terrH(x,z)+.04,z);const k=.6+rnd()*.6;sv.set(k*1.3,k*.6,k);mm.compose(v,q,sv);o.setMatrixAt(i,mm);o.setColorAt(i,c.setHex(pick(STC)).offsetHSL(0,0,-.05))},1);
  // string lights: posts, sagging wires and bulbs that glow at night (FMLIST), plus a soft pool of light on the stones under each span
  const posts=SPAN.filter(s=>s.p).map(s=>s.p),spans=SPAN.filter(s=>s.a);if(!posts.length)return;const PH=4.3;
  inst(new THREE.BoxGeometry(.13,PH+.1,.13),mt(0x5b4431,.85,0),posts,([x,z],i,o)=>{mm.makeTranslation(x,terrH(x,z)+(PH+.1)/2,z);o.setMatrixAt(i,mm);markC(x,z,.12,3)},1);
  const bulbs=[],wire=[];
  for(const{a,b}of spans){const ya=terrH(a[0],a[1])+PH-.08,yb=terrH(b[0],b[1])+PH-.08,L=Math.hypot(b[0]-a[0],b[1]-a[1]),sag=.4+L*.06,N=Math.max(6,Math.round(L/.42));let px,py,pz;
    for(let k=0;k<=N;k++){const t=k/N,x=lerp(a[0],b[0],t),z=lerp(a[1],b[1],t),y=lerp(ya,yb,t)-sag*4*t*(1-t);if(k){wire.push(px,py,pz,x,y,z);if(k<N)bulbs.push([x,y-.07,z])}px=x;py=y;pz=z}}
  const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(wire,3));const wl=new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0x2b2622}));wl.frustumCulled=false;wl.userData.chunk=999;wl.userData.noMerge=1;sc.add(wl);
  const bulbM=SM({color:0xfff2cf,emissive:0xffc66a,emissiveIntensity:0,roughness:.3});FMLIST.push(bulbM);
  inst(new THREE.SphereGeometry(.055,8,6),bulbM,bulbs,([x,y,z],i,o)=>{mm.makeTranslation(x,y,z);o.setMatrixAt(i,mm)});
  // V114 even night glow over the lit side yard: one soft-edged sheet draped on the ground under each lit leg (no spotlight pools)
  const glowT=ctex(64,64,(q2,w,h)=>{const img=q2.createImageData(w,h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const e=k=>clamp(Math.min(k,1-k)/.28,0,1),a=e((x+.5)/w)*e((y+.5)/h),v=Math.round(255*a*a*(3-2*a)),o=(y*w+x)*4;img.data[o]=img.data[o+1]=img.data[o+2]=v;img.data[o+3]=255}q2.putImageData(img,0,0)});
  const GP=[],GU=[],GI=[];let gv=0;for(const[ax,az,bx,bz]of GLOW){const L=Math.hypot(bx-ax,bz-az),ux=(bx-ax)/L,uz=(bz-az)/L,nx=-uz,nz=ux,HW=4.6,ext=2.5,nl=Math.max(2,Math.ceil((L+ext*2)/1.5));
    for(let k=0;k<=nl;k++){const d=-ext+(L+ext*2)*k/nl;for(let m=0;m<=4;m++){const o=-HW+HW*2*m/4,x=ax+ux*d+nx*o,z=az+uz*d+nz*o;GP.push(x,terrH(x,z)+.07,z);GU.push(m/4,k/nl)}
      if(k)for(let m=0;m<4;m++){const a0=gv+(k-1)*5+m,b0=a0+5;GI.push(a0,b0,a0+1,a0+1,b0,b0+1)}}gv+=(nl+1)*5}
  if(GP.length){const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(GP,3));gg.setAttribute('uv',new THREE.Float32BufferAttribute(GU,2));gg.setIndex(GI);gg.computeVertexNormals();
    const glowM=SM({color:0x000000,emissive:0x2c1d0e,emissiveIntensity:0,alphaMap:glowT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});FMLIST.push(glowM);
    const gm=new THREE.Mesh(gg,glowM);gm.renderOrder=2;gm.frustumCulled=false;gm.userData.noMerge=1;sc.add(gm)}}
function yardBalls(){for(const y of YB){let on=false;for(let k=0;k<y.p.length&&!on;k++){const n=y.p[k];if(n.down||n.aggro||n.dp>45||n.mode!=='play'||Math.hypot(n.x-n.hx,n.z-n.hz)>.6)continue;const c=(n.t*.36)%1;if(c>=.74&&c<.9){const u=(c-.74)/.16;y.m.position.set(n.x+(y.tx[k]-n.x)*u,lerp(1.6,1.1,u)+Math.sin(u*PI)*y.arc,n.z+(y.tz[k]-n.z)*u);on=true}}y.m.visible=on}}
function mkRam(){const g=new THREE.Group(),m=mt(0x8a6a3a,.35,.65);const a=(geo,x,y,z,rx=0)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.rotation.x=rx;e.castShadow=true;g.add(e);return e};a(bgeo(.9,.8,1.5),0,.5,0);a(bgeo(.55,.55,.7),0,.95,.85);for(const s of[-1,1]){const h=a(new THREE.TorusGeometry(.22,.07,6,12,PI*1.4),s*.3,1.05,.75);h.rotation.y=s*PI/2}for(const[x,z]of[[-.3,-.5],[.3,-.5],[-.3,.5],[.3,.5]])a(bgeo(.16,.4,.16),x,.1,z);return g}
function extRoad(x0,z0,x1,z1){flat(x0,z0,x1,z1,.035,TM.asphalt,10);const hz=(x1-x0)>(z1-z0);if(hz){flat(x0,z0-2.2,x1,z0,.03,TM.concrete,4);flat(x0,z1,x1,z1+2.2,.03,TM.concrete,4);const zc=(z0+z1)/2;flat(x0,zc-.12,x1,zc+.12,.045,TM.dashH,6,1)}else{flat(x0-2.2,z0,x0,z1,.03,TM.concrete,4);flat(x1,z0,x1+2.2,z1,.03,TM.concrete,4);const xc=(x0+x1)/2;flat(xc-.12,z0,xc+.12,z1,.045,TM.dashV,1,6)}}
function buildSurroundings(){const ER=[[-280,576,0,586],[WW,576,WW+280,586],[65,-280,75,8],[142,-280,152,0],[696,-280,706,2],[WW,2,WW+280,10],[245,710,255,1000],[WW,646,WW+280,656]];ER.forEach(r=>extRoad(...r));
  const nearRoad=(x,z)=>ER.some(([a,b,c,d])=>x>a-9&&x<c+9&&z>b-9&&z<d+9);
  // roadside houses so the roads lead somewhere
  const HC=[0xe8e0cc,0xc9b89a,0xb8c4c8,0xd8c8b0,0xa8b8a0,0xe0d0d8],RC=[0x4a3a3a,0x3a4150,0x5a3a2a,0x2e3a2e];let hi=0;
  const house=(x,z,rot)=>{const w=7+rnd()*4,d=6+rnd()*3,h=4.5+rnd()*2.5;const g=new THREE.Group();const b=new THREE.Mesh(bgeo(w,h,d),mt(HC[hi%HC.length],.9));b.position.y=h/2;b.castShadow=b.receiveShadow=true;g.add(b);const r=new THREE.Mesh(HIPG,mt(RC[hi%RC.length],.8));r.scale.set(w+.8,2.6,d+.8);r.position.y=h;r.castShadow=true;g.add(r);for(const sx of[-1,1]){const wn=new THREE.Mesh(bgeo(1.2,1.2,.05),bm(0x2a3a4a));wn.position.set(sx*w*.25,h*.6,d/2+.03);g.add(wn)}const dr=new THREE.Mesh(bgeo(1.1,2,.05),mt(0x4a2e1a));dr.position.set(0,1,d/2+.03);g.add(dr);g.position.set(x,0,z);g.rotation.y=rot;sc.add(g);hi++};
  for(let x=WW+22;x<WW+260;x+=16+rnd()*8){house(x,569-rnd()*4,0);house(x+6,593+rnd()*4,PI)}for(let x=WW+24;x<WW+250;x+=17+rnd()*8){house(x,-4-rnd()*3,0);house(x+7,21+rnd()*3,PI)}
  for(let x=-24;x>-260;x-=16+rnd()*8){house(x,569-rnd()*4,0);if(x-6<-112)house(x-6,593+rnd()*4,PI)}/* V122: Hughes's rear wings stand south of this road */
  for(let x=WW+26;x<WW+250;x+=18+rnd()*8){house(x,639-rnd()*3,0);house(x+7,663+rnd()*3,PI)}
  for(let z=-24;z>-240;z-=18+rnd()*8){if(z<-100){house(57-rnd()*3,z,PI/2);house(83+rnd()*3,z+6,-PI/2)}/* V118: the tunnel hill covers the nearer ones */house(135-rnd()*3,z,PI/2);house(159+rnd()*3,z+6,-PI/2);house(689-rnd()*3,z,PI/2);house(713+rnd()*3,z+6,-PI/2)}
  for(let z=OD+26;z<OD+260;z+=18+rnd()*8){house(237-rnd()*3,z,PI/2);house(263+rnd()*3,z+7,-PI/2)}
  {const s1=signMesh('WELCOME TO HARROWGATE · EST. 1791',9,1.4,'#1f3a2c','#f2efe6');s1.position.set(WW+14,3,574);s1.rotation.y=-PI/2;sc.add(s1);cyl(WW+14,1.3,570,.12,2.6,0x333333);cyl(WW+14,1.3,578,.12,2.6,0x333333)}
  // outer forest and hills
  const pts=[];for(let i=0;i<5200&&pts.length<2600;i++){const side=Math.floor(rnd()*4);let x,z;const o=6+rnd()*150;if(side===0){x=-o;z=-150+rnd()*(OD+300)}else if(side===1){x=WW+o;z=-150+rnd()*(OD+300)}else if(side===2){z=-o;x=-150+rnd()*(WW+300)}else{z=OD+o;x=-150+rnd()*(WW+300)}if(nearRoad(x,z))continue;if(x>-110&&x<2&&z>586&&z<712)continue;if(ER.some(()=>0))continue;pts.push([x,z,1+rnd()*.6])}
  const n=pts.length,tr=new THREE.InstancedMesh(new THREE.CylinderGeometry(.22,.34,3.4,6),mt(0x5a3d26,.9),n),fo=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),SM({flatShading:true}),n*2),m=new THREE.Matrix4(),q=new THREE.Quaternion(),c=new THREE.Color(),e=new THREE.Euler();
  pts.forEach(([x,z,s2],i)=>{m.compose(V3(x,1.7*s2,z),q.identity(),V3(s2,s2,s2));tr.setMatrixAt(i,m);e.set(0,rnd()*3,0);q.setFromEuler(e);const pine=rnd()<.35;m.compose(V3(x,(pine?5:4)*s2,z),q,V3(2.6*s2,(pine?3.6:2.3)*s2,2.6*s2));fo.setMatrixAt(i*2,m);m.compose(V3(x,(pine?7:5.6)*s2,z),q,V3(1.7*s2,(pine?2.6:1.6)*s2,1.7*s2));fo.setMatrixAt(i*2+1,m);const fall=rnd()<.22;c.setHSL(fall?.06+rnd()*.06:.26+rnd()*.07,fall?.65:.4,fall?.4:.2+rnd()*.08);fo.setColorAt(i*2,c);fo.setColorAt(i*2+1,c)});
  for(const k of[tr,fo]){k.frustumCulled=false;k.receiveShadow=false;k.castShadow=false;k.userData.chunk=235;sc.add(k)}   // V121 chunk tag: chunkStatic() tiles these 64 m and culls them by view + distance (fog ends at 220)
  const hm=SM({color:0x4d6e3a,flatShading:true});for(let i=0;i<26;i++){const a=i/26*TAU,rx=WW/2+Math.cos(a)*(WW/2+190),rz=OD/2+Math.sin(a)*(OD/2+190);if(Math.hypot(rx-TUN.x,rz-TUN.zp)<150)continue;/* V118: keep the tunnel hill clear */const h=new THREE.Mesh(GC.hill||(GC.hill=new THREE.SphereGeometry(1,10,6,0,TAU,0,PI/2)),hm);h.scale.set(60+rnd()*40,22+rnd()*26,60+rnd()*40);h.position.set(rx,-2,rz);sc.add(h)}}
// ================================================================ V66 trees: puffy multi-lobed crowns (smooth, shaded darker underneath), tapered trunks with branch stubs,
// split into map chunks so the camera only draws the trees in view
function blobGeo(){return GC.blob||(GC.blob=blobGeoL(1,7,2))}
// V97 tree LOD: 840 tris (near) / 280 (mid) / 80 (far) per foliage blob
function blobGeoL(det,nl,ck){const lobes=[[0,0,0,.8],[.48,.12,.08,.56],[-.42,.08,.26,.56],[.06,.18,-.46,.56],[-.08,.46,.02,.52],[.22,-.22,.38,.46],[-.3,-.18,-.3,.44]].slice(0,nl),parts=[];if(nl<7)lobes[0][3]=.92;
  for(const[lx,ly,lz,r]of lobes){const g=new THREE.IcosahedronGeometry(r,det),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=1+(Math.sin(x*9.1+z*5.3)+Math.cos(y*7.7+x*3.1))*.035;p.setXYZ(i,x*k+lx,y*k+ly,z*k+lz)}g.computeVertexNormals();parts.push(g)}
  // chunky faceted leaf clumps standing proud of each lobe
  for(const[lx,ly,lz,r]of lobes)for(let k=0;k<ck;k++){const a=rnd()*TAU,e=.2+rnd()*.9,dx=Math.cos(a)*Math.cos(e),dy=Math.sin(e),dz=Math.sin(a)*Math.cos(e),cr=.17+rnd()*.12,g=new THREE.IcosahedronGeometry(cr,0),pp=g.attributes.position;for(let i=0;i<pp.count;i++)pp.setXYZ(i,pp.getX(i)+lx+dx*r*.88,pp.getY(i)+ly+dy*r*.88,pp.getZ(i)+lz+dz*r*.88);g.computeVertexNormals();parts.push(g)}
  let n=0;parts.forEach(g=>n+=g.attributes.position.count);const P_=new Float32Array(n*3),N_=new Float32Array(n*3),C_=new Float32Array(n*3);let o=0;
  for(const g of parts){const c=g.attributes.position.count;P_.set(g.attributes.position.array,o*3);N_.set(g.attributes.normal.array,o*3);for(let i=0;i<c;i++){const y=g.attributes.position.getY(i),s=.5+.62*clamp((y+.9)/1.7,0,1);C_[(o+i)*3]=C_[(o+i)*3+1]=C_[(o+i)*3+2]=s}o+=c}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(P_,3));G.setAttribute('normal',new THREE.BufferAttribute(N_,3));G.setAttribute('color',new THREE.BufferAttribute(C_,3));return G}
function trunkGeo(){if(GC.trunk66)return GC.trunk66;const parts=[[new THREE.CylinderGeometry(.16,.3,3.2,10),0,0,0,0,0]];for(const[a,y,l]of[[0,.55,.9],[2.2,.85,.75],[4.1,.7,.8]]){const b=new THREE.CylinderGeometry(.05,.09,l,6);b.translate(0,l/2,0);b.rotateZ(-.9);b.rotateY(a);b.translate(0,y,0);parts.push([b,0,0,0,0,0])}
  const gs=parts.map(([g])=>g.index?g.toNonIndexed():g);let n=0;gs.forEach(g=>n+=g.attributes.position.count);const P_=new Float32Array(n*3),N_=new Float32Array(n*3);let o=0;for(const g of gs){P_.set(g.attributes.position.array,o*3);N_.set(g.attributes.normal.array,o*3);o+=g.attributes.position.count}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(P_,3));G.setAttribute('normal',new THREE.BufferAttribute(N_,3));return GC.trunk66=G}
// V97: split big static InstancedMeshes (props, bushes, lamps, flowers, decals) that were drawn map-wide every frame into 64 m cells
// with real bounds, so the camera and the shadow pass skip what they can't see, and far/fogged cells aren't drawn at all
const WCH=[];
function chunkInst(im,CS=64){const n=im.count;if(n<48)return;const A=im.instanceMatrix.array,cells=new Map();
  for(let i=0;i<n;i++){const k=Math.floor(A[i*16+12]/CS)+','+Math.floor(A[i*16+14]/CS);let c=cells.get(k);if(!c)cells.set(k,c=[]);c.push(i)}
  if(cells.size<2)return;const g0=im.geometry;if(!g0.boundingSphere)g0.computeBoundingSphere();const gr=g0.boundingSphere.radius+g0.boundingSphere.center.length(),cd=im.userData.chunk;
  for(const idx of cells.values()){const g=new THREE.BufferGeometry();if(g0.index)g.setIndex(g0.index);
    for(const k in g0.attributes){const at=g0.attributes[k];if(at.isInstancedBufferAttribute){const s=at.itemSize,a=new at.array.constructor(idx.length*s);idx.forEach((i,j)=>{for(let q=0;q<s;q++)a[j*s+q]=at.array[i*s+q]});g.setAttribute(k,new THREE.InstancedBufferAttribute(a,s,at.normalized,at.meshPerAttribute))}else g.setAttribute(k,at)}
    for(const gp of g0.groups)g.addGroup(gp.start,gp.count,gp.materialIndex);
    const c=new THREE.InstancedMesh(g,im.material,idx.length);let cx=0,cy=0,cz=0,sm=0;
    idx.forEach((i,j)=>{for(let q=0;q<16;q++)c.instanceMatrix.array[j*16+q]=A[i*16+q];cx+=A[i*16+12];cy+=A[i*16+13];cz+=A[i*16+14];const e=A.subarray(i*16,i*16+12);sm=Math.max(sm,Math.hypot(e[0],e[1],e[2]),Math.hypot(e[4],e[5],e[6]),Math.hypot(e[8],e[9],e[10]))});
    if(im.instanceColor){const a=new Float32Array(idx.length*3);idx.forEach((i,j)=>{for(let q=0;q<3;q++)a[j*3+q]=im.instanceColor.array[i*3+q]});c.instanceColor=new THREE.InstancedBufferAttribute(a,3)}
    cx/=idx.length;cy/=idx.length;cz/=idx.length;let r=0;idx.forEach(i=>{r=Math.max(r,Math.hypot(A[i*16+12]-cx,A[i*16+13]-cy,A[i*16+14]-cz))});
    g.boundingSphere=new THREE.Sphere(new THREE.Vector3(cx,cy,cz),r+gr*sm+1);
    c.castShadow=im.castShadow;c.receiveShadow=im.receiveShadow;c.renderOrder=im.renderOrder;c.userData=Object.assign({},im.userData);c.frustumCulled=true;c.matrixAutoUpdate=false;c.updateMatrix();
    (im.parent||sc).add(c);WCH.push({m:c,x:cx,z:cz,r:g.boundingSphere.radius,cd})}
  im.parent&&im.parent.remove(im)}
function chunkStatic(){for(const o of sc.children.slice())if(o.isInstancedMesh&&o.userData.chunk&&!o.userData.fd&&o.matrixWorld.equals(new THREE.Matrix4()))chunkInst(o)}
const TREECH=[];
// pick a foliage detail level per 64 m chunk from the camera distance, and skip chunks that are wholly inside the fog
function treeLod(){if(P&&P.inside)return;const cx=cam.position.x,cz=cam.position.z,ff=(sc.fog&&sc.fog.far)||220;
  for(const c of WCH)c.m.visible=Math.hypot(c.x-cx,c.z-cz)-c.r<Math.min(ff+12,c.cd);
  for(const c of TREECH){const d=Math.hypot(c.cx-cx,c.cz-cz),on=d-48<ff+12;c.fo.visible=c.tr.visible=on;if(!on)continue;const lv=d<95?0:d<165?1:2;if(lv!==c.lv){c.lv=lv;c.fo.geometry=c.g[lv]}}}
function buildTrees(){if(GFX!=='enhanced')return buildTreesClassic();const CS=64,cells=new Map();TREES.forEach((t,i)=>{const k=Math.floor(t[0]/CS)+','+Math.floor(t[1]/CS);let a=cells.get(k);if(!a)cells.set(k,a=[]);a.push(i)});
  const TM_=mt(0x5a3d26,.95),FM_=drTreeMat(),bT=trunkGeo(),bF=blobGeo(),bF1=GC.blob1||(GC.blob1=blobGeoL(0,7,1)),bF2=GC.blob2||(GC.blob2=blobGeoL(0,4,0)),m=new THREE.Matrix4(),q=new THREE.Quaternion(),c=new THREE.Color(),e=new THREE.Euler();
  const share=(b,cx,cz)=>{const g=new THREE.BufferGeometry();for(const k in b.attributes)g.setAttribute(k,b.attributes[k]);g.boundingSphere=new THREE.Sphere(new THREE.Vector3(cx,8,cz),CS*.72+16);return g};
  for(const[key,idx]of cells){const[ix,iz]=key.split(',').map(Number),cx=(ix+.5)*CS,cz=(iz+.5)*CS,tr=new THREE.InstancedMesh(share(bT,cx,cz),TM_,idx.length),fo=new THREE.InstancedMesh(share(bF,cx,cz),FM_,idx.length*2);TREECH.push({tr,fo,cx,cz,g:[fo.geometry,share(bF1,cx,cz),share(bF2,cx,cz)],lv:0});
    idx.forEach((ti,j)=>{const[x,z,s,hs]=TREES[ti],gy=terrH(x,z)-.15;e.set(0,rnd()*TAU,0);q.setFromEuler(e);
      if(hs){const Ht=6.7*hs,R=2.4*s,cv=Math.min(.34*Ht,1.2*R),c1=Ht-cv*1.45,c2=Ht-cv*.62,tk=Math.max(.6,Math.min(1.8,R*.28));
        m.compose(V3(x,c1/2+gy,z),q,V3(tk,c1/3.2,tk));tr.setMatrixAt(j,m);m.compose(V3(x,c1+gy,z),q,V3(R,cv,R));fo.setMatrixAt(j*2,m);m.compose(V3(x+(rnd()-.5)*.5*R,c2+gy,z+(rnd()-.5)*.5*R),q,V3(R*.68,cv*.7,R*.68));fo.setMatrixAt(j*2+1,m)}
      else{m.compose(V3(x,1.6*s+gy,z),q,V3(s,s,s));tr.setMatrixAt(j,m);m.compose(V3(x,3.7*s+gy,z),q,V3(2.4*s,2.1*s,2.4*s));fo.setMatrixAt(j*2,m);m.compose(V3(x+(rnd()-.5)*.9,5.2*s+gy,z+(rnd()-.5)*.9),q,V3(1.6*s,1.5*s,1.6*s));fo.setMatrixAt(j*2+1,m)}
      const fall=rnd()<.18;c.setHSL(fall?.07+rnd()*.05:.25+rnd()*.07,fall?.72:.48+rnd()*.15,fall?.47:.27+rnd()*.08);fo.setColorAt(j*2,c);c.offsetHSL(0,0,.05);fo.setColorAt(j*2+1,c)});
    for(const k of[tr,fo]){k.castShadow=true;k.receiveShadow=true;k.frustumCulled=true;sc.add(k)}}}
// ================================================================ V67 world dressing: wind-swayed grass and flowers, painted ground with normal detail and decals,
// leaf-cluster trees, instanced props (benches, bins, bikes, signs), height fog, lamp light cones, fireflies and dust
const DRS={t:{value:0},pl:{value:new THREE.Vector3(0,-999,0)},wind:{value:1}};
let DRCH=[],DRMASK=null,DRCONES=null,DRFLY=null,DRDUST=null,DRGT=null,DRLEAF=null,DROK=false;const DRGX=141,DRGW=300;
const drSS=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
// one patchy low-frequency field shared by the ground shader and the grass blades so they always agree
const drNoise=(x,z)=>{const wx=x-141,wy=600-z;return Math.sin(wx*.11)*Math.sin(wy*.09)+Math.sin(wx*.047+wy*.061)*.8+Math.sin(wy*.19-wx*.13)*.5};
function drTex(c,rep=true){const t=new THREE.CanvasTexture(c);if(rep)t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());return t}
// hand-painted tiling ground: a brush-stroke albedo variation tile and a matching normal map (grass blades, pebbles)
function drGround(){if(DRGT)return DRGT;const S=256,mk=()=>{const c=document.createElement('canvas');c.width=c.height=S;return c},wrap=f=>{for(let ox=-S;ox<=S;ox+=S)for(let oy=-S;oy<=S;oy+=S)f(ox,oy)};
  const hc=mk(),hq=hc.getContext('2d');hq.fillStyle='rgb(128,128,128)';hq.fillRect(0,0,S,S);
  for(let i=0;i<1300;i++){const x=rnd()*S,y=rnd()*S,a=rnd()*TAU,l=3+rnd()*9,v=(rnd()<.5?60+rnd()*50:190+rnd()*60)|0,w=1+rnd()*1.6;wrap((ox,oy)=>{hq.strokeStyle=`rgba(${v},${v},${v},.35)`;hq.lineWidth=w;hq.beginPath();hq.moveTo(x+ox,y+oy);hq.lineTo(x+ox+Math.cos(a)*l,y+oy+Math.sin(a)*l);hq.stroke()})}
  for(let i=0;i<80;i++){const x=rnd()*S,y=rnd()*S,r=2+rnd()*4;wrap((ox,oy)=>{const g=hq.createRadialGradient(x+ox,y+oy,0,x+ox,y+oy,r);g.addColorStop(0,'rgba(240,240,240,.85)');g.addColorStop(1,'rgba(128,128,128,0)');hq.fillStyle=g;hq.beginPath();hq.arc(x+ox,y+oy,r,0,TAU);hq.fill()})}
  const hd=hq.getImageData(0,0,S,S).data,nc=mk(),nq=nc.getContext('2d'),nd=nq.createImageData(S,S),H=(x,y)=>hd[(((y+S)%S)*S+((x+S)%S))*4]/255;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(H(x-1,y)-H(x+1,y))*2.4,dy=(H(x,y-1)-H(x,y+1))*2.4,l=Math.hypot(dx,dy,1),i=(y*S+x)*4;nd.data[i]=(dx/l*.5+.5)*255;nd.data[i+1]=(dy/l*.5+.5)*255;nd.data[i+2]=(1/l*.5+.5)*255;nd.data[i+3]=255}
  nq.putImageData(nd,0,0);
  const ac=mk(),aq=ac.getContext('2d');aq.fillStyle='rgb(128,128,128)';aq.fillRect(0,0,S,S);
  for(let i=0;i<220;i++){const x=rnd()*S,y=rnd()*S,rx=10+rnd()*26,ry=3+rnd()*7,a=rnd()*TAU,v=(rnd()<.5?92+rnd()*24:150+rnd()*40)|0;wrap((ox,oy)=>{aq.fillStyle=`rgba(${v},${v},${v},.10)`;aq.beginPath();aq.ellipse(x+ox,y+oy,rx,ry,a,0,TAU);aq.fill()})}
  for(let i=0;i<650;i++){const x=rnd()*S,y=rnd()*S,a=rnd()*TAU,l=4+rnd()*11,v=(rnd()<.5?96+rnd()*24:150+rnd()*50)|0;wrap((ox,oy)=>{aq.strokeStyle=`rgba(${v},${v},${v},.22)`;aq.lineWidth=1+rnd()*1.4;aq.beginPath();aq.moveTo(x+ox,y+oy);aq.lineTo(x+ox+Math.cos(a)*l,y+oy+Math.sin(a)*l);aq.stroke()})}
  return DRGT={a:drTex(ac),n:drTex(nc)}}
// leaf-cluster map for the tree crowns (puffs of bright leaves with dark gaps), sampled triplanar in the shader
function drLeafTex(){if(DRLEAF)return DRLEAF;const S=128,c=document.createElement('canvas');c.width=c.height=S;const q=c.getContext('2d');q.fillStyle='rgb(70,70,70)';q.fillRect(0,0,S,S);
  for(let i=0;i<150;i++){const x=rnd()*S,y=rnd()*S,r=6+rnd()*9;for(const ox of[-S,0,S])for(const oy of[-S,0,S]){const g=q.createRadialGradient(x+ox-r*.2,y+oy-r*.25,0,x+ox,y+oy,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.55,'rgba(190,190,190,.9)');g.addColorStop(1,'rgba(60,60,60,0)');q.fillStyle=g;q.beginPath();q.arc(x+ox,y+oy,r,0,TAU);q.fill()}}
  return DRLEAF=drTex(c)}
function drTreeMat(){const m=SM({vertexColors:true,roughness:.92});
  m.onBeforeCompile=sh=>{sh.uniforms.lMap={value:drLeafTex()};
    sh.vertexShader='varying vec3 vOp;varying vec3 vOn;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvOp=position;vOn=normal;');
    sh.fragmentShader='uniform sampler2D lMap;varying vec3 vOp;varying vec3 vOn;\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n{vec3 an=pow(abs(normalize(vOn)),vec3(4.));an/=an.x+an.y+an.z+1e-4;vec3 op=vOp*1.7;float lf=texture2D(lMap,op.zy).r*an.x+texture2D(lMap,op.xz).r*an.y+texture2D(lMap,op.xy).r*an.z;diffuseColor.rgb*=mix(.6,1.3,lf)*mix(vec3(.8,.9,.82),vec3(1.12,1.08,.86),smoothstep(-.8,.9,vOp.y));}')};
  m.customProgramCacheKey=()=>'tree67';return m}
// instanced wind material: sway grows with height, gusts roll across the field, the player tramples blades, far tufts shrink away
function drWindMat(o){const m=new THREE.MeshLambertMaterial(Object.assign({vertexColors:true},o));
  m.onBeforeCompile=sh=>{sh.uniforms.uT=DRS.t;sh.uniforms.uPl=DRS.pl;sh.uniforms.uWd=DRS.wind;
    sh.vertexShader='uniform float uT,uWd;uniform vec3 uPl;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
{vec3 iw=instanceMatrix[3].xyz;float hh=clamp(position.y/.62,0.,1.6);float ph=iw.x*.31+iw.z*.27;
float sw=sin(uT*1.7+ph)*.5+sin(uT*3.1+iw.x*.9+iw.z*.7)*.25+sin(uT*.55+iw.x*.04+iw.z*.03)*.7;
float k=hh*hh;transformed.x+=sw*.10*k*uWd;transformed.z+=cos(uT*1.3+ph*1.1)*.05*k*uWd;
vec2 dp=iw.xz-uPl.xz;float dl=length(dp);float tr=(1.-smoothstep(.2,1.3,dl))*step(abs(iw.y-uPl.y),2.2);
transformed.xz+=dp/max(dl,.05)*tr*k*.4;transformed.y*=1.-tr*.45*hh;
transformed*=1.-smoothstep(30.,48.,distance(iw.xz,cameraPosition.xz));}`)};
  m.customProgramCacheKey=()=>'wind67';return m}
function drGrassGeo(){if(GC.grs67)return GC.grs67;const P_=[],C_=[],N_=[],nb=6;
  const tri=(a,b,c,ca,cb,cc)=>{for(const[p,k]of[[a,ca],[b,cb],[c,cc]]){P_.push(...p);C_.push(...k);N_.push(0,1,0)}};
  for(let i=0;i<nb;i++){const an=i/nb*TAU+rnd()*.8,r=.03+rnd()*.13,cx=Math.cos(an)*r,cz=Math.sin(an)*r,h=.32+rnd()*.3,w=.032+rnd()*.018,ra=rnd()*TAU,ca=Math.cos(ra),sa=Math.sin(ra),ln=.05+rnd()*.14;
    const b0=[cx-w*ca,0,cz-w*sa],b1=[cx+w*ca,0,cz+w*sa],tp=[cx-sa*ln,h,cz+ca*ln],R0=[.46,.54,.4],T0=[1.15,1.2,.86];
    tri(b0,b1,tp,R0,R0,T0);tri(b1,b0,tp,R0,R0,T0)}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(P_,3));G.setAttribute('color',new THREE.Float32BufferAttribute(C_,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(N_,3));return GC.grs67=G}
function drFlowerGeo(pal){const P_=[],C_=[],N_=[];const tri=(a,b,c,k)=>{for(const p of[a,b,c]){P_.push(...p);C_.push(...k);N_.push(0,1,0)}};
  for(let i=0;i<9;i++){const a=rnd()*TAU,r=Math.sqrt(rnd())*.38,x=Math.cos(a)*r,z=Math.sin(a)*r,h=.22+rnd()*.26,w=.012,ra=rnd()*TAU,ca=Math.cos(ra),sa=Math.sin(ra),g1=[.28,.5,.2],g2=[.42,.7,.28];
    const b0=[x-w*ca,0,z-w*sa],b1=[x+w*ca,0,z+w*sa],tp=[x+.03*sa,h,z-.03*ca];tri(b0,b1,tp,g1);tri(b1,b0,tp,g2);
    const pc=pal[(rnd()*pal.length)|0],hr=.05+rnd()*.035,hy=h+.01;for(let k=0;k<6;k++){const a0=k/6*TAU,a1=(k+1)/6*TAU;tri([tp[0],hy,tp[2]],[tp[0]+Math.cos(a0)*hr,hy-.012,tp[2]+Math.sin(a0)*hr],[tp[0]+Math.cos(a1)*hr,hy-.012,tp[2]+Math.sin(a1)*hr],pc)}
    const cr=hr*.34;for(let k=0;k<3;k++){const a0=k/3*TAU,a1=(k+1)/3*TAU;tri([tp[0],hy+.004,tp[2]],[tp[0]+Math.cos(a0)*cr,hy+.002,tp[2]+Math.sin(a0)*cr],[tp[0]+Math.cos(a1)*cr,hy+.002,tp[2]+Math.sin(a1)*cr],[1.2,1.05,.35])}}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(P_,3));G.setAttribute('color',new THREE.Float32BufferAttribute(C_,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(N_,3));return G}
function drInRings(rings,x,z){return rings.some(r=>inPoly(x,z,r[0])&&!r.slice(1).some(h=>inPoly(x,z,h)))}
function drGrass(D){const sp=1.2,CS=48,ch=new Map(),mask=new Uint8Array(DRGW*DRGW),excl=[];for(const f of D.pitches||[])if(f.r)excl.push(f.r);for(const r of D.track||[])if(r)excl.push(r);
  const mk=(x,z)=>{const i=((x-DRGX)/2)|0,j=(z/2)|0;if(i>=0&&j>=0&&i<DRGW&&j<DRGW)mask[j*DRGW+i]=255};
  const flowers=[];let total=0;
  for(const r of D.grass||[]){const p=r[0],hs=r.slice(1),[x0,z0,x1,z1]=bbox(p);
    for(let x=x0;x<x1;x+=sp)for(let z=z0;z<z1;z+=sp){const px=x+(rnd()-.5)*sp,pz=z+(rnd()-.5)*sp,k=cidx(px,pz);if(k<0||WG[k]||RG[k])continue;if(!inPoly(px,pz,p)||hs.some(h=>inPoly(px,pz,h)))continue;if(excl.length&&drInRings(excl,px,pz))continue;
      const key=Math.floor(px/CS)+','+Math.floor(pz/CS);let c=ch.get(key);if(!c)ch.set(key,c=[]);c.push(px,pz);total++;mk(px,pz);
      if(flowers.length<420&&rnd()<.0035)flowers.push([px,pz])}}
  for(const r of D.wood||[]){const[x0,z0,x1,z1]=bbox(r[0]);for(let x=x0;x<x1;x+=2)for(let z=z0;z<z1;z+=2)if(inPoly(x,z,r[0]))mk(x,z)}
  const keep=Math.min(1,95000/Math.max(1,total)),m=new THREE.Matrix4(),col=new THREE.Color(),geo=drGrassGeo(),mat=drWindMat({}),deep=[.8,.97,.9],dry=[1.2,1.1,.74];
  for(const[key,arr]of ch){const[ix,iz]=key.split(',').map(Number),cx=(ix+.5)*CS,cz=(iz+.5)*CS,n=[];for(let i=0;i<arr.length;i+=2)if(keep>=1||rnd()<keep)n.push(arr[i],arr[i+1]);const cnt=n.length/2;if(!cnt)continue;
    const g=new THREE.BufferGeometry();for(const a in geo.attributes)g.setAttribute(a,geo.attributes[a]);g.boundingSphere=new THREE.Sphere(new THREE.Vector3(cx,10,cz),CS*.72+14);
    const im=new THREE.InstancedMesh(g,mat,cnt);
    for(let i=0;i<cnt;i++){const x=n[i*2],z=n[i*2+1],sy=.7+rnd()*.7,w=.8+rnd()*.55,t=drSS(-.9,1.3,drNoise(x,z)),k=.72+rnd()*.3;
      m.compose(V3(x,terrH(x,z)-.02,z),new THREE.Quaternion(),V3(w,sy,w));im.setMatrixAt(i,m);
      col.setRGB(.36*(deep[0]+(dry[0]-deep[0])*t*.9)*k,.58*(deep[1]+(dry[1]-deep[1])*t*.9)*k,.27*(deep[2]+(dry[2]-deep[2])*t*.9)*k);im.setColorAt(i,col)}
    im.receiveShadow=true;im.castShadow=false;im.userData.cx=cx;im.userData.cz=cz;sc.add(im);DRCH.push(im)}
  const tex=new THREE.DataTexture(mask,DRGW,DRGW,THREE.LuminanceFormat,THREE.UnsignedByteType);tex.minFilter=tex.magFilter=THREE.LinearFilter;tex.unpackAlignment=1;tex.needsUpdate=true;DRMASK=tex;
  drFlowers(D,flowers)}
function drFlowers(D,spots){const pals=[[[1,.35,.5],[1,.78,.2],[.95,.5,.2],[.92,.2,.28]],[[.62,.52,1],[.42,.62,1],[.92,.5,.9],[.95,.95,1]],[[1,1,.9],[1,.9,.3],[1,.7,.85],[.9,.95,1]]],geos=pals.map(drFlowerGeo),mat=drWindMat({}),lists=[[],[],[]];
  for(const[x,z]of spots)lists[(rnd()*3)|0].push([x,z]);
  // beds along building faces
  for(const b of D.B||[]){if(!b.p||!b.p[0])continue;const ring=gpoly(b.p[0]),pal=(rnd()*3)|0;if(rnd()<.45)continue;drEdge(ring,6.5,(x,z,ox,oz)=>{if(rnd()<.55)return;for(let k=0;k<2+((rnd()*3)|0);k++){const fx=x+ox*(1.1+rnd()*.9)+(rnd()-.5)*2.4,fz=z+oz*(1.1+rnd()*.9)+(rnd()-.5)*2.4;if(!solid(fx,fz)&&!onRoad(fx,fz)&&lists[pal].length<900)lists[pal].push([fx,fz])}})}
  lists.forEach((L,i)=>{if(!L.length)return;const im=new THREE.InstancedMesh(geos[i],mat,L.length),m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
    L.forEach(([x,z],j)=>{e.set(0,rnd()*TAU,0);q.setFromEuler(e);const s=.8+rnd()*.7;m.compose(V3(x,terrH(x,z)-.02,z),q,V3(s,s,s));im.setMatrixAt(j,m)});im.frustumCulled=false;im.userData.chunk=100;im.receiveShadow=true;sc.add(im)})}
// walk a polygon's edges; fn gets a point on the edge, the outward normal and the edge direction
function drEdge(ring,step,fn){for(let i=0;i<ring.length;i++){const[ax,az]=ring[i],[bx,bz]=ring[(i+1)%ring.length],L=Math.hypot(bx-ax,bz-az);if(L<2)continue;const ux=(bx-ax)/L,uz=(bz-az)/L;let nx=-uz,nz=ux;
    for(let t=1+rnd()*step*.6;t<L-1;t+=step*(.7+rnd()*.6)){const x=ax+ux*t,z=az+uz*t;if(inPoly(x+nx*.5,z+nz*.5,ring)){nx=-nx;nz=-nz}fn(x,z,nx,nz,ux,uz)}}}
// ground decals: fallen leaves under trees, dirt along path edges, cracks in the paving (one atlas, one instanced draw)
function drDecals(D){const S=256,c=document.createElement('canvas');c.width=c.height=S;const q=c.getContext('2d');
  const leaf=(cx,cy,w,h,rot)=>{q.save();q.translate(cx,cy);q.rotate(rot);q.fillStyle='#fff';q.beginPath();q.moveTo(0,-h);q.quadraticCurveTo(w,-h*.2,0,h);q.quadraticCurveTo(-w,-h*.2,0,-h);q.fill();q.strokeStyle='rgba(120,120,120,.8)';q.lineWidth=2;q.beginPath();q.moveTo(0,-h*.9);q.lineTo(0,h*.9);q.stroke();q.restore()};
  leaf(64,64,26,50,.5);leaf(192,64,34,40,-.3);
  q.strokeStyle='#fff';q.lineCap='round';for(let b=0;b<5;b++){let x=20+rnd()*30,y=140+rnd()*90;q.lineWidth=2.4;q.beginPath();q.moveTo(x,y);for(let k=0;k<7;k++){x+=6+rnd()*9;y=clamp(y+(rnd()-.5)*22,134,250);q.lineTo(x,y)}q.stroke()}
  for(let i=0;i<46;i++){const a=rnd()*TAU,r=Math.sqrt(rnd())*58,x=192+Math.cos(a)*r*1.1,y=192+Math.sin(a)*r*.8,rr=6+rnd()*16,g=q.createRadialGradient(x,y,0,x,y,rr);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,rr,0,TAU);q.fill()}
  const tex=drTex(c,false),L=[],tiles=[[0,.5],[.5,.5],[0,0],[.5,0]];
  const add=(x,z,tile,sx,sz,yaw,col)=>{if(solid(x,z))return;L.push([x,z,tile,sx,sz,yaw,col])};
  const leafCols=[[.75,.45,.12],[.62,.25,.08],[.85,.7,.2],[.4,.5,.15],[.55,.33,.1]];
  for(const t of TREES){if(rnd()<.35)continue;const s=t[2]||1,n=5+((rnd()*9)|0);for(let k=0;k<n;k++){const a=rnd()*TAU,r=1.2+rnd()*3.6*s;add(t[0]+Math.cos(a)*r,t[1]+Math.sin(a)*r,rnd()<.5?0:1,.28+rnd()*.14,.2+rnd()*.1,rnd()*TAU,leafCols[(rnd()*5)|0])}}
  const paths=[];for(const r of D.walk||[])paths.push(r);for(const pl of D.plaza||[])paths.push(pl[1]);
  for(const r of paths){const ring=r[0];drEdge(ring,3.4,(x,z,ox,oz,ux,uz)=>{if(L.length>9000||rnd()<.5)return;const o=.2+rnd()*.5,px=x+ox*o,pz=z+oz*o;if(onRoad(px+ox*.6,pz+oz*.6))return;add(px,pz,3,1.6+rnd()*1.6,.7+rnd()*.5,Math.atan2(ux,uz),[.34+rnd()*.08,.26+rnd()*.06,.17])});
    const[x0,z0,x1,z1]=bbox(ring),area=(x1-x0)*(z1-z0),nc=Math.min(26,Math.floor(area/700));for(let k=0;k<nc;k++){const x=x0+rnd()*(x1-x0),z=z0+rnd()*(z1-z0);if(inPoly(x,z,ring)&&L.length<9500)add(x,z,2,1.2+rnd()*1.6,1.2+rnd()*1.4,rnd()*TAU,[.1,.095,.09])}
    for(let k=0;k<Math.min(14,nc*2);k++){const x=x0+rnd()*(x1-x0),z=z0+rnd()*(z1-z0);if(inPoly(x,z,ring)&&L.length<9800)add(x,z,rnd()<.5?0:1,.26+rnd()*.1,.18+rnd()*.08,rnd()*TAU,leafCols[(rnd()*5)|0])}}
  if(!L.length)return;
  const g=new THREE.PlaneGeometry(1,1).rotateX(-PI/2),tAttr=new Float32Array(L.length*4);g.setAttribute('aT',new THREE.InstancedBufferAttribute(tAttr,4));
  const mat=new THREE.MeshLambertMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  mat.onBeforeCompile=sh=>{sh.vertexShader='attribute vec4 aT;varying float vFd;\n'+sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvUv=uv*aT.zw+aT.xy;').replace('#include <begin_vertex>','#include <begin_vertex>\nvFd=distance((instanceMatrix*vec4(0.,0.,0.,1.)).xz,cameraPosition.xz);');
    sh.fragmentShader='varying float vFd;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.a*=(1.-smoothstep(42.,70.,vFd))*.92;')};
  mat.customProgramCacheKey=()=>'decal67';
  const im=new THREE.InstancedMesh(g,mat,L.length),m=new THREE.Matrix4(),qq=new THREE.Quaternion(),qy=new THREE.Quaternion(),c3=new THREE.Color(),up=V3(0,1,0),nv=V3(0,1,0);
  L.forEach(([x,z,tile,sx,sz,yaw,col],i)=>{const h=terrH(x,z);nv.set(terrH(x-1,z)-terrH(x+1,z),2,terrH(x,z-1)-terrH(x,z+1)).normalize();qq.setFromUnitVectors(up,nv);qy.setFromAxisAngle(up,yaw);qq.multiply(qy);m.compose(V3(x,h+.035,z),qq,V3(sx,1,sz));im.setMatrixAt(i,m);c3.setRGB(col[0],col[1],col[2]);im.setColorAt(i,c3);const T=tiles[tile];tAttr[i*4]=T[0];tAttr[i*4+1]=T[1];tAttr[i*4+2]=.5;tAttr[i*4+3]=.5});
  im.frustumCulled=false;im.userData.chunk=80;im.receiveShadow=true;im.renderOrder=1;sc.add(im)}
// props: benches, bins, bike racks with bikes, wayfinding signs
function drGeo(parts){const gs=[];for(const[g,c,M]of parts){const a=g.index?g.toNonIndexed():g.clone();a.applyMatrix4(M);const n=a.attributes.position.count,col=new Float32Array(n*3),cc=new THREE.Color(c);for(let i=0;i<n;i++){col[i*3]=cc.r;col[i*3+1]=cc.g;col[i*3+2]=cc.b}a.setAttribute('color',new THREE.BufferAttribute(col,3));a.deleteAttribute('uv');gs.push(a)}
  const n=gs.reduce((s,g)=>s+g.attributes.position.count,0),P_=new Float32Array(n*3),N_=new Float32Array(n*3),C_=new Float32Array(n*3);let o=0;for(const g of gs){P_.set(g.attributes.position.array,o*3);N_.set(g.attributes.normal.array,o*3);C_.set(g.attributes.color.array,o*3);o+=g.attributes.position.count}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(P_,3));G.setAttribute('normal',new THREE.BufferAttribute(N_,3));G.setAttribute('color',new THREE.BufferAttribute(C_,3));G.computeBoundingSphere();return G}
const drT=(x,y,z,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1)=>new THREE.Matrix4().compose(V3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)),V3(sx,sy,sz));
const drBox=(w,h,d,c,x,y,z,ry=0)=>[new THREE.BoxGeometry(w,h,d),c,drT(x,y,z,0,ry,0)];
const drCyl=(r,h,c,x,y,z,rx=0,rz=0,seg=8)=>[new THREE.CylinderGeometry(r,r,h,seg),c,drT(x,y,z,rx,0,rz)];
const drSeg=(a,b,r,c)=>{const d=V3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),L=d.length(),q=new THREE.Quaternion().setFromUnitVectors(V3(0,1,0),d.normalize());return[new THREE.CylinderGeometry(r,r,1,5),c,new THREE.Matrix4().compose(V3((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2),q,V3(1,L,1))]};
function drProps(D){const WOOD=0x8b5e3c,MET=0x23262a,occ=[],near=(x,z,d)=>occ.some(o=>(o[0]-x)**2+(o[1]-z)**2<d*d),M=SM({vertexColors:true,roughness:.7,metalness:.1});
  const benchG=drGeo([...[-.18,-.06,.06,.18].map(k=>drBox(1.9,.035,.09,WOOD,0,.46,k)),...[.6,.72,.84].map(y=>drBox(1.9,.08,.03,WOOD,0,y,-.27)),...[-.86,.86].flatMap(s=>[drBox(.06,.46,.06,MET,s,.23,.17),drBox(.06,.9,.06,MET,s,.45,-.25),drBox(.06,.04,.48,MET,s,.44,-.03),drBox(.06,.04,.4,MET,s,.66,0)])]);
  const binG=drGeo([drCyl(.27,.8,0x35503f,0,.4,0,0,0,10),drCyl(.3,.07,MET,0,.84,0,0,0,10),drCyl(.05,.06,MET,0,.9,0,0,0,6),drBox(.04,.22,.04,MET,0,.11,0)]);
  const rackG=drGeo([-2,-1,0,1,2].flatMap(i=>[drCyl(.02,.75,0x9aa0a8,i*.62,.375,-.3),drCyl(.02,.75,0x9aa0a8,i*.62,.375,.3),drCyl(.02,.62,0x9aa0a8,i*.62,.75,0,PI/2,0)]));
  const wh=z=>[new THREE.TorusGeometry(.33,.022,5,16).rotateY(PI/2),0x16171a,drT(0,.33,z)];
  const bikeG=drGeo([wh(.5),wh(-.5),drSeg([0,.33,-.5],[0,.72,-.28],.016,0xffffff),drSeg([0,.33,.5],[0,.8,.28],.016,0xffffff),drSeg([0,.72,-.28],[0,.8,.28],.016,0xffffff),drSeg([0,.33,-.5],[0,.28,0],.014,0xffffff),drSeg([0,.28,0],[0,.72,-.28],.016,0xffffff),drSeg([0,.28,0],[0,.8,.28],.016,0xffffff),drBox(.1,.03,.2,0x1a1a1a,0,.76,-.3),drCyl(.014,.46,0x1a1a1a,0,.9,.3,0,PI/2,5)]);
  const signG=drGeo([drCyl(.035,2.2,0x2a2d33,0,1.1,0,0,0,6),drBox(.9,.5,.04,0x1f4a7a,0,1.85,0),drBox(.9,.07,.05,0xf0ece0,0,2.12,0),drBox(.5,.06,.05,0xf0ece0,0,1.88,0),drBox(.7,.06,.05,0xf0ece0,0,1.72,0)]);
  const bench=[],bin=[],rack=[],bike=[],sign=[];
  const free=(x,z,r)=>freeAt(x,z,r)&&!onRoad(x,z)&&!near(x,z,r*2.2);
  const put=(list,x,z,yaw,r,cap)=>{if(list.length>=cap||!free(x,z,r))return false;list.push([x,z,yaw]);occ.push([x,z]);return true};
  const paths=[];for(const r of D.walk||[])paths.push(r[0]);for(const pl of D.plaza||[])paths.push(pl[1][0]);
  for(const ring of paths)drEdge(ring,17,(x,z,ox,oz)=>{const px=x+ox*1.0,pz=z+oz*1.0,yaw=Math.atan2(-ox,-oz),a=rnd();if(a<.2)put(bench,px,pz,yaw,.8,130);else if(a<.38)put(bin,px+ox*.1,pz+oz*.1,0,.45,160);else if(a<.45)put(sign,px,pz,Math.atan2(-ox,-oz),.5,70)});
  try{for(const[x,z,y]of bench)seatAdd(x,z,y)}catch(e){}   // V300 path benches are seats too
  for(const[x,z]of LAMPS)if(rnd()<.12)put(bin,x+1.1,z+.4,0,.45,160);
  for(const b of D.B||[]){if(!b.p||!b.p[0]||rnd()<.6||rack.length>=55)continue;const ring=gpoly(b.p[0]);let done=0;drEdge(ring,9,(x,z,ox,oz,ux,uz)=>{if(done||rnd()<.5)return;const px=x+ox*1.7,pz=z+oz*1.7;const yaw=Math.atan2(-uz,ux);if(put(rack,px,pz,yaw,1.5,55)){done=1;for(const k of[-1.5,-.5,.5,1.5])if(rnd()<.6)bike.push([px+Math.cos(yaw)*k*.62,pz-Math.sin(yaw)*k*.62,yaw,rnd()])}})}
  const mk=(geo,list,cast=true,mark)=>{if(!list.length)return;const im=new THREE.InstancedMesh(geo,M,list.length),m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),c=new THREE.Color();
    list.forEach((o,i)=>{e.set(0,o[2],0);q.setFromEuler(e);m.compose(V3(o[0],terrH(o[0],o[1]),o[1]),q,V3(1,1,1));im.setMatrixAt(i,m);if(o[3]!=null){c.setHSL(o[3],.55,.55);im.setColorAt(i,c)}if(mark)mark(o)});im.castShadow=cast;im.receiveShadow=true;im.frustumCulled=false;im.userData.chunk=cast?999:130;sc.add(im)};
  mk(benchG,bench,true,o=>{const s=Math.sin(o[2]),c=Math.cos(o[2]);for(const k of[-.6,0,.6])markC(o[0]+c*k,o[1]-s*k,.4,.9)});
  mk(binG,bin,true,o=>markC(o[0],o[1],.3,.9));mk(rackG,rack,true,o=>{const s=Math.sin(o[2]),c=Math.cos(o[2]);for(let k=-2;k<=2;k++)markC(o[0]+c*k*.62,o[1]-s*k*.62,.2,.8)});
  mk(bikeG,bike,true);mk(signG,sign,true,o=>markC(o[0],o[1],.12,2.2))}
// atmosphere: lamp light cones, fireflies at night, drifting dust by day
function drPoints(n,drift,blink,col,size,mask){const sd=new Float32Array(n*4);for(let i=0;i<n*4;i++)sd[i]=rnd();const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));g.setAttribute('sd',new THREE.BufferAttribute(sd,4));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,uniforms:{uT:DRS.t,uS:{value:900},uA:{value:0},uC:{value:new THREE.Vector3()},uDr:{value:drift},uBl:{value:blink},uCol:{value:new THREE.Vector3(...col)},uSz:{value:size},uMk:{value:mask?1:0},uM:{value:DRMASK}},
    vertexShader:`attribute vec4 sd;uniform float uT,uS,uSz,uDr,uBl,uMk;uniform vec3 uC;uniform sampler2D uM;varying float vA;
void main(){vec2 box=vec2(56.);vec2 xz=sd.xz*box+vec2(sin(uT*.31+sd.w*40.),cos(uT*.27+sd.w*23.))*1.4+vec2(.16,.08)*uT*uDr;xz=mod(xz-uC.xz+box*.5,box)-box*.5;
vec3 wp=vec3(uC.x+xz.x,uC.y-.6+sd.y*3.6+sin(uT*.8+sd.w*17.)*.3,uC.z+xz.y);vA=1.-smoothstep(.55,1.,length(xz)/28.);
if(uMk>.5)vA*=texture2D(uM,vec2((wp.x-141.)/600.,wp.z/600.)).r;if(uBl>.5){float b=.5+.5*sin(uT*(1.2+sd.w*1.5)+sd.w*60.);vA*=smoothstep(.2,.95,b);}
vec4 mv=viewMatrix*vec4(wp,1.);gl_Position=projectionMatrix*mv;gl_PointSize=max(uSz*projectionMatrix[1][1]*uS*.5/-mv.z,1.6);}`,
    fragmentShader:`uniform float uA;uniform vec3 uCol;varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d)*vA*uA;gl_FragColor=vec4(uCol*a,a);}`});
  const p=new THREE.Points(g,m);p.frustumCulled=false;p.renderOrder=3;p.visible=false;sc.add(p);return p}
function drAtmos(){
  const g=new THREE.ConeGeometry(1,1,20,1,true).translate(0,-.5,0),
    mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false,uniforms:{uI:{value:0}},
      vertexShader:`varying float vH;varying vec3 vN;varying vec3 vV;varying float vD;void main(){mat4 M=modelMatrix*instanceMatrix;vec4 wp=M*vec4(position,1.);vH=position.y;vN=normalize((M*vec4(normal,0.)).xyz);vV=normalize(cameraPosition-wp.xyz);vD=distance(wp.xz,cameraPosition.xz);gl_Position=projectionMatrix*viewMatrix*wp;}`,
      fragmentShader:`uniform float uI;varying float vH;varying vec3 vN;varying vec3 vV;varying float vD;void main(){float f=abs(dot(normalize(vN),normalize(vV)));float a=pow(clamp(1.+vH,0.,1.),1.4)*pow(f,1.7)*uI*smoothstep(0.,.1,-vH)*(1.-smoothstep(38.,72.,vD));gl_FragColor=vec4(vec3(1.,.78,.5)*1.5*a,a);}`});
  const L=LAMPS.filter(([x,z])=>x>-50&&x<760&&z>-50);if(L.length){const im=new THREE.InstancedMesh(g,mat,L.length),m=new THREE.Matrix4();
    L.forEach(([x,z],i)=>{const disc=typeof DISCZ!=='undefined'&&x>=141&&x<=741&&z<=576&&DISCZ.some(b=>x>b[0]&&x<b[2]&&z>b[1]&&z<b[3]),hh=disc?5.9:3.95,H=disc?5.8:3.9,r=disc?5.2:3.4;m.compose(V3(x,terrH(x,z)+hh,z),new THREE.Quaternion(),V3(r,H,r));im.setMatrixAt(i,m)});im.frustumCulled=false;im.renderOrder=2;im.visible=false;sc.add(im);DRCONES=im}
  DRFLY=drPoints(420,0,1,[3.4,3.6,.9],.07,true);DRDUST=drPoints(380,1,0,[.95,.92,.8],.028,false)}
function buildDressing(){if(GFX!=='enhanced')return;const D=UCD;
  for(const[name,f]of[['grass',()=>drGrass(D)],['decals',()=>drDecals(D)],['props',()=>drProps(D)],['atmosphere',()=>drAtmos()]])try{f()}catch(e){console.warn('V67 dressing: '+name+' skipped:',e)}
  if(DRMASK){if(DRFLY)DRFLY.material.uniforms.uM.value=DRMASK}DROK=true}
function dressTick(){if(!DROK)return;const t=NOW(),em=clamp(NIGHT*1.15-.1,0,1),ins=!!(P&&P.inside);DRS.t.value=t;if(P)DRS.pl.value.set(P.x,P.y,P.z);
  const cx=cam.position.x,cz=cam.position.z;for(const c of DRCH)c.visible=!ins&&Math.hypot(c.userData.cx-cx,c.userData.cz-cz)<82;
  if(DRCONES){DRCONES.visible=em>.05&&!ins;DRCONES.material.uniforms.uI.value=em*.4}
  const sh=R.domElement.height||innerHeight;
  if(DRFLY){const a=ins?0:clamp(em*1.3,0,1);DRFLY.visible=a>.02;const u=DRFLY.material.uniforms;u.uA.value=a;u.uS.value=sh;if(P)u.uC.value.set(P.x,P.y,P.z)}
  if(DRDUST){const a=ins?0:(1-NIGHT)*.5;DRDUST.visible=a>.02;const u=DRDUST.material.uniforms;u.uA.value=a;u.uS.value=sh;if(P)u.uC.value.set(P.x,P.y,P.z)}}

const DRTERN='#include <normal_fragment_maps>\n{vec2 nw=vUv*600.0;vec3 nA=texture2D(nMap,nw/1.5).xyz*2.-1.;vec3 nB=texture2D(nMap,nw/5.3+.37).xyz*2.-1.;float ps=clamp(pm.r+pm.g+pm.b,0.,1.);vec2 gg=(nA.xy*mix(.55,.95,ps)+nB.xy*.5)*(1.-smoothstep(25.,70.,length(vViewPosition)));vec3 ex=normalize((viewMatrix*vec4(1.,0.,0.,0.)).xyz),ez=normalize((viewMatrix*vec4(0.,0.,1.,0.)).xyz);normal=normalize(normal+ex*gg.x+ez*gg.y);}';

// stone coping along the parapet of every flat-roofed campus building (the trim line the textures alone could not give)
function coping(p,h,col){if(GFX!=='enhanced'||FD.built)return;const M=mt(col,.8);for(let i=0;i<p.length;i++){const[ax,az]=p[i],[bx,bz]=p[(i+1)%p.length],L=Math.hypot(bx-ax,bz-az);if(L<.8)continue;let nx=-(bz-az)/L,nz=(bx-ax)/L;
    if(inPoly((ax+bx)/2+nx*.3,(az+bz)/2+nz*.3,p)){nx=-nx;nz=-nz}const m=new THREE.Mesh(new THREE.BoxGeometry(L+.36,.42,.5),M);m.position.set((ax+bx)/2+nx*.1,h+.12,(az+bz)/2+nz*.1);m.rotation.y=-Math.atan2(bz-az,bx-ax);m.castShadow=true;m.receiveShadow=true;sc.add(m)}}

function buildTreesClassic(){const n=TREES.length,tr=new THREE.InstancedMesh(new THREE.CylinderGeometry(.18,.3,3.2,7),mt(0x5a3d26,.9),n),fo=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),SM({roughness:.9,flatShading:true}),n*2),m=new THREE.Matrix4(),q=new THREE.Quaternion(),c=new THREE.Color(),e=new THREE.Euler();
  TREES.forEach(([x,z,s,hs],i)=>{const gy=terrH(x,z)-.15;
    if(hs){// measured tree (lidar): real height, measured crown spread
      const Ht=6.7*hs,R=2.4*s,cv=Math.min(.34*Ht,1.2*R),c1=Ht-cv*1.45,c2=Ht-cv*.62,tk=Math.max(.6,Math.min(1.8,R*.28));
      m.compose(V3(x,c1/2+gy,z),q.identity(),V3(tk,c1/3.2,tk));tr.setMatrixAt(i,m);
      e.set(0,rnd()*3,0);q.setFromEuler(e);m.compose(V3(x,c1+gy,z),q,V3(R,cv,R));fo.setMatrixAt(i*2,m);
      m.compose(V3(x+(rnd()-.5)*.5*R,c2+gy,z+(rnd()-.5)*.5*R),q,V3(R*.68,cv*.7,R*.68));fo.setMatrixAt(i*2+1,m)}
    else{m.compose(V3(x,1.6*s+gy,z),q.identity(),V3(s,s,s));tr.setMatrixAt(i,m);
    e.set(0,rnd()*3,0);q.setFromEuler(e);m.compose(V3(x,3.7*s+gy,z),q,V3(2.4*s,2.1*s,2.4*s));fo.setMatrixAt(i*2,m);
    m.compose(V3(x+(rnd()-.5)*.9,5.2*s+gy,z+(rnd()-.5)*.9),q,V3(1.6*s,1.5*s,1.6*s));fo.setMatrixAt(i*2+1,m)}
    const fall=rnd()<.18;c.setHSL(fall?.07+rnd()*.05:.25+rnd()*.07,fall?.7:.42+rnd()*.15,fall?.42:.22+rnd()*.08);fo.setColorAt(i*2,c);c.offsetHSL(0,0,.05);fo.setColorAt(i*2+1,c)});
  for(const k of[tr,fo]){k.castShadow=true;k.receiveShadow=true;k.frustumCulled=false;sc.add(k)}}

// ================================================================ STATIC MERGE (cuts draw calls)
// V121 with CS set (outdoor world), merged meshes are also split by position: CS-metre tiles, so frustum culling can skip what's off screen,
// and small props (bounding radius < DET_R) go into 64 m tiles that are hidden beyond DET_D metres (via WCH, see treeLod). Objects bigger than a
// tile stay in one map-wide bucket per material. Without CS (interiors) it merges per material as before.
const DET_R=1.25,DET_D=100;
function mergeStatic(objs,parent,CS){const buckets=new Map(),kill=[],_s=new THREE.Sphere();
  const put=(mat,cast,rec,g)=>{let cell='',det=0;if(CS){g.computeBoundingSphere();const b=g.boundingSphere;if(b.radius<DET_R){det=1;cell='d'+Math.floor(b.center.x/64)+','+Math.floor(b.center.z/64)}else if(b.radius<CS*.75)cell=Math.floor(b.center.x/CS)+','+Math.floor(b.center.z/CS);else cell='G'}
    const key=mat.uuid+(cast?'c':'')+(rec?'r':'')+'|'+cell;let b=buckets.get(key);if(!b){b={mat,cast,rec,det,list:[]};buckets.set(key,b)}b.list.push(g)};
  for(const o of objs){o.updateMatrixWorld(true);o.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||m.userData.noMerge||!m.geometry||!m.geometry.attributes.position)return;const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrixWorld);
    if(Array.isArray(m.material)){const gs=m.geometry.groups&&m.geometry.groups.length?m.geometry.groups:[{start:0,count:g.attributes.position.count,materialIndex:0}];for(const gr of gs){const mat=m.material[gr.materialIndex];if(!mat)continue;const sub=new THREE.BufferGeometry();for(const nm of['position','normal','uv']){const at=g.attributes[nm];if(!at)continue;sub.setAttribute(nm,new THREE.BufferAttribute(at.array.slice(gr.start*at.itemSize,(gr.start+gr.count)*at.itemSize),at.itemSize))}put(mat,m.castShadow,m.receiveShadow,sub)}g.dispose()}
    else put(m.material,m.castShadow,m.receiveShadow,g);kill.push(m)})}
  for(const m of kill)m.parent&&m.parent.remove(m);
  for(const b of buckets.values()){let n=0;for(const g of b.list)n+=g.attributes.position.count;const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2);let o=0;for(const g of b.list){const c=g.attributes.position.count;pos.set(g.attributes.position.array.subarray(0,c*3),o*3);if(g.attributes.normal)nor.set(g.attributes.normal.array.subarray(0,c*3),o*3);if(g.attributes.uv&&g.attributes.uv.itemSize===2)uv.set(g.attributes.uv.array.subarray(0,c*2),o*2);o+=c;g.dispose()}
    const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(pos,3));G.setAttribute('normal',new THREE.BufferAttribute(nor,3));G.setAttribute('uv',new THREE.BufferAttribute(uv,2));G.computeBoundingSphere();const M=new THREE.Mesh(G,b.mat);M.castShadow=b.cast;M.receiveShadow=b.rec;M.matrixAutoUpdate=false;parent.add(M);
    if(b.det){const S_=G.boundingSphere;WCH.push({m:M,x:S_.center.x,z:S_.center.z,r:S_.radius,cd:DET_D})}}}
function optimizeScene(){try{chunkStatic()}catch(e){console.warn('chunkStatic',e)}const keep=new Set([ram,gateMesh,radioBlink,sky,sunDisc,moonDisc,stars,fountainPts,sun,sun.target,hemi,plamp,...kartGates]);for(const id in INT)keep.add(INT[id].g);/* V382 the road cones stay separate so a grabbed one can disappear */for(const c of CONES)keep.add(c.m);
  const out=new THREE.Group();mergeStatic(sc.children.filter(o=>!keep.has(o)&&!o.isLight),out,128);sc.add(out);
  for(const id in INT){const g=INT[id].g;const kids=g.children.slice();const m=new THREE.Group();mergeStatic(kids,m);g.add(m)}
  sc.children.filter(o=>o.isGroup&&o!==out&&!keep.has(o)&&o.children.length===0).forEach(o=>sc.remove(o));
  OUTSIDE=sc.children.filter(o=>!keep.has(o)&&!o.isLight)}

// ================================================================ V118 Greek Row tunnel: the north end of Greek Row runs into a grassy hill through a stone tunnel
// portal instead of just stopping. The hill is a heightfield dome cut flat in front of the portal (an apron held by retaining walls);
// the strip of hill crossing the arch opening is removed so the tunnel can be seen into; the tube is dark inside with a row of lamps.
const TUN={x:70,zp:6.5,hw:5.5,spring:4,len:42,ax:11};
function tunDome(x,z){const T=TUN,Zc=T.zp-45,f=1-((x-T.x)/55)**2-((z-Zc)/52)**2;return f>0?29*Math.pow(f,.6):0}
function tunH(x,z){const T=TUN;if(z>T.zp+.05&&Math.abs(x-T.x)<T.ax)return 0;return tunDome(x,z)}
function buildTunnel(){const T=TUN,X=T.x,Zp=T.zp;
  // hill heightfield on a grid that has extra lines inside the facade and retaining walls, so the steps hide inside them
  const xs=[],zs=[];for(let x=12;x<=128;x+=2.5)xs.push(x);for(const d of[-T.ax-.1,-T.ax+.1,T.ax-.1,T.ax+.1,-T.hw-.4,T.hw+.4])xs.push(X+d);xs.sort((a,b)=>a-b);
  for(let z=Zp-100;z<=Zp+9;z+=2.5)zs.push(z);zs.push(Zp+.1,Zp-.1);zs.sort((a,b)=>a-b);
  const pos=[],col=[],idx=[],NX=xs.length,c=new THREE.Color();
  for(const z of zs)for(const x of xs){const h=tunH(x,z);pos.push(x,h-.15,z);const k=.85+.15*Math.sin(x*.37+z*.21);c.setHex(h>18?0x587a3e:0x4f7438).multiplyScalar(k);col.push(c.r,c.g,c.b)}
  for(let j=0;j<zs.length-1;j++)for(let i=0;i<NX-1;i++){const a=j*NX+i,b=a+1,d=a+NX,e=d+1,cx=(xs[i]+xs[i+1])/2,cz=(zs[j]+zs[j+1])/2;
    if(Math.abs(cx-X)<T.hw+.4&&cz>Zp-.1&&cz<Zp+.1)continue;/* the opening */
    const hs=[pos[a*3+1],pos[b*3+1],pos[d*3+1],pos[e*3+1]];if(Math.max(...hs)<0)continue;idx.push(a,d,b,b,d,e)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
  const hill=new THREE.Mesh(g,SM({vertexColors:true,roughness:.95,flatShading:true}));hill.receiveShadow=true;hill.userData.noMerge=1;sc.add(hill);
  // portal facade: a stone wall with an arched opening, a cornice and a keystone
  const stone=SM({color:0x948b7d,roughness:.92}),dark=SM({color:0x6f675c,roughness:.95});
  const arch=(s,hw,sp)=>{s.moveTo(-hw,0);s.lineTo(-hw,sp);s.absarc(0,sp,hw,PI,0,true);s.lineTo(hw,0);return s};
  const sh=new THREE.Shape();sh.moveTo(-T.ax-.4,0);sh.lineTo(-T.ax-.4,13);sh.lineTo(T.ax+.4,13);sh.lineTo(T.ax+.4,0);sh.lineTo(T.hw,0);sh.lineTo(T.hw,T.spring);sh.absarc(0,T.spring,T.hw,0,PI,false);sh.lineTo(-T.hw,0);sh.closePath();
  const fg=new THREE.ExtrudeGeometry(sh,{depth:1.5,bevelEnabled:false});fg.translate(X,0,Zp-.3);const fac=new THREE.Mesh(fg,stone);fac.castShadow=true;fac.receiveShadow=true;sc.add(fac);
  const bx=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(bgeo(w,h,d),m||stone);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;sc.add(o);return o};
  bx(T.ax*2+1.6,.7,2,X,13.1,Zp+.45,dark);bx(1.3,1.6,1.7,X,T.spring+T.hw+.35,Zp+.5,dark);
  // arch ring of voussoir blocks
  for(let k=0;k<=16;k++){const a=PI*k/16,r=T.hw+.5,o=bx(1.02,1,1.62,X+Math.cos(a)*r,T.spring+Math.sin(a)*r,Zp+.45,dark);o.rotation.z=a-PI/2}
  for(const s of[-1,1])bx(1,T.spring,1.62,X+s*(T.hw+.5),T.spring/2,Zp+.45,dark);
  for(const s of[-1,1]){bx(.9,13.6,1.9,X+s*(T.ax+.1),6.8,Zp+.5,dark);/* pilasters */
    // retaining walls stepping down along the apron
    // retaining walls: one sloped wall each side whose top follows the hill down to the apron, with a coping stone
    {const ws=new THREE.Shape(),pts=[];for(let z=Zp+1.2;z<=Zp+9.01;z+=.5)pts.push([z-Zp,Math.max(.6,tunDome(X+s*T.ax,z)+.5)]);ws.moveTo(pts[0][0],0);for(const[u,v]of pts)ws.lineTo(u,v);ws.lineTo(pts[pts.length-1][0],0);ws.closePath();
      const wg=new THREE.ExtrudeGeometry(ws,{depth:.8,bevelEnabled:false});wg.rotateY(-PI/2);wg.translate(X+s*T.ax+.4,0,Zp);const w=new THREE.Mesh(wg,stone);w.castShadow=true;w.receiveShadow=true;sc.add(w);
      const cs=new THREE.Shape();cs.moveTo(pts[0][0],pts[0][1]-.05);for(const[u,v]of pts)cs.lineTo(u,v+.22);for(let i=pts.length-1;i>=0;i--)cs.lineTo(pts[i][0],pts[i][1]-.05);cs.closePath();
      const cg=new THREE.ExtrudeGeometry(cs,{depth:1.05,bevelEnabled:false});cg.rotateY(-PI/2);cg.translate(X+s*T.ax+.525,0,Zp);sc.add(new THREE.Mesh(cg,dark))}}
  {const sg=signMesh('GREEK ROW',6.4,1.1,'#2b2620','#e2c27a');sg.position.set(X,11.6,Zp+1.25);sc.add(sg)}
  // the tube: an arch prism seen from inside, darkening with depth, lamps along the crown
  const ts=arch(new THREE.Shape(),T.hw,T.spring),tg=new THREE.ExtrudeGeometry(ts,{depth:T.len,bevelEnabled:false});tg.translate(X,-.03,Zp-T.len);
  {const p=tg.attributes.position,cc=[];for(let i=0;i<p.count;i++){const d=clamp((Zp-p.getZ(i))/T.len,0,1),v=.26*(1-d)**1.6+.012;cc.push(v,v*.97,v*.92)}tg.setAttribute('color',new THREE.Float32BufferAttribute(cc,3))}
  const tube=new THREE.Mesh(tg,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide}));tube.userData.noMerge=1;sc.add(tube);
  const lampM=new THREE.MeshBasicMaterial({color:0xffd27a});for(let z=Zp-3;z>Zp-T.len+2;z-=5){const l=new THREE.Mesh(bgeo(.5,.12,1.4),lampM);l.position.set(X,T.spring+T.hw-.25,z);sc.add(l)}
  {const rg=new THREE.Mesh(new THREE.PlaneGeometry(T.hw*2-.2,T.len).rotateX(-PI/2),new THREE.MeshBasicMaterial({color:0x1a1a1c}));rg.position.set(X,.02,Zp-T.len/2);sc.add(rg);
    const dash=new THREE.MeshBasicMaterial({color:0x6a5a2a});for(let z=Zp-2;z>Zp-T.len;z-=4){const d=new THREE.Mesh(new THREE.PlaneGeometry(.18,1.8).rotateX(-PI/2),dash);d.position.set(X,.03,z);sc.add(d)}}
  // collision: the hill and the walls are solid; the apron and the first stretch of tunnel are walkable
  cells(12,0,128,Zp+9,(k,x,z)=>{const inAp=Math.abs(x-X)<T.ax-.45;if(inAp&&z>Zp+1.25)return;if(Math.abs(x-X)<T.hw-.35&&z<=Zp+1.25)return;if(tunH(x,z)>.35||(Math.abs(x-X)<T.ax+.5&&z<Zp+1.3)||Math.abs(Math.abs(x-X)-T.ax)<.45&&z<Zp+9)WG[k]=1});
  NOTREE.push([X-T.ax-3,0,X+T.ax+3,Zp+12])}
