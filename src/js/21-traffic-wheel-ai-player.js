// ================================================================ V77 TRAFFIC: cars drive the streets on a lane network, slow down and stop for people in the road,
// and knock Danny flat (and hurt him) if he steps in front of one too late.
const CARS=[],CNET={edges:[],nodes:[]};let carsOn=false;
const CAR_K={primary:11,secondary:9.5,tertiary:8,residential:7,unclassified:7};
function carNet(){const E=[];
  for(const r of UCD.roads||[]){if(!CAR_K[r.k]||r.w<6||r.sf||r.pts.length<2)continue;E.push({pts:r.pts.map(p=>[p[0],p[1]]),w:r.w,one:!!r.one,v:CAR_K[r.k]})}
  for(const r of RD){if(!Array.isArray(r))continue;const[x0,z0,x1,z1]=r,wx=x1-x0,wz=z1-z0;if(Math.min(wx,wz)<6)continue;E.push(wx>wz?{pts:[[x0,(z0+z1)/2],[x1,(z0+z1)/2]],w:wz,one:false,v:7}:{pts:[[(x0+x1)/2,z0],[(x0+x1)/2,z1]],w:wx,one:false,v:7})}
  // split a road where another road's end meets its middle (T junctions)
  const near=(e,x,z)=>{let best=null;for(let i=0;i<e.pts.length-1;i++){const[a,b]=e.pts[i],[c,d]=e.pts[i+1],vx=c-a,vz=d-b,L2=vx*vx+vz*vz||1,t=clamp(((x-a)*vx+(z-b)*vz)/L2,0,1),px=a+vx*t,pz=b+vz*t,dd=Math.hypot(px-x,pz-z);if(!best||dd<best.d)best={i,t,d:dd,p:[px,pz]}}return best};
  for(let pass=0;pass<2;pass++)for(let a=0;a<E.length;a++)for(const end of[E[a].pts[0],E[a].pts[E[a].pts.length-1]])for(let b=0;b<E.length;b++){if(a===b)continue;const e=E[b],q=near(e,end[0],end[1]);if(!q||q.d>Math.max(4,e.w/2+1.5))continue;
      const f=e.pts[0],l=e.pts[e.pts.length-1];if(Math.hypot(q.p[0]-f[0],q.p[1]-f[1])<5||Math.hypot(q.p[0]-l[0],q.p[1]-l[1])<5){continue}
      const A=e.pts.slice(0,q.i+1).concat([q.p]),B=[q.p].concat(e.pts.slice(q.i+1));E[b]=Object.assign({},e,{pts:A});E.push(Object.assign({},e,{pts:B}));end[0]=q.p[0];end[1]=q.p[1]}
  // nodes: ends within 4 m are the same junction
  const N=[];const node=(p)=>{for(let i=0;i<N.length;i++)if(Math.hypot(N[i].x-p[0],N[i].z-p[1])<4.5)return i;N.push({x:p[0],z:p[1],e:[]});return N.length-1};
  for(const e of E){const s=[0];for(let i=1;i<e.pts.length;i++)s.push(s[i-1]+Math.hypot(e.pts[i][0]-e.pts[i-1][0],e.pts[i][1]-e.pts[i-1][1]));e.s=s;e.L=s[s.length-1];if(e.L<3)continue;e.a=node(e.pts[0]);e.b=node(e.pts[e.pts.length-1]);if(e.a===e.b)continue;e.id=CNET.edges.length;CNET.edges.push(e);N[e.a].e.push(e.id);N[e.b].e.push(e.id)}
  CNET.nodes=N}
function carAt(e,s){s=clamp(s,0,e.L);let i=1;while(i<e.s.length-1&&e.s[i]<s)i++;const u=(s-e.s[i-1])/((e.s[i]-e.s[i-1])||1),a=e.pts[i-1],b=e.pts[i];return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,Math.atan2(b[0]-a[0],b[1]-a[1])]}
// ---- the cars themselves: a painted body and a dark/chrome/lights detail mesh, four shapes
const CAR_PAINT=[0xf2f2ee,0xb8bcc2,0x1c1d22,0xb3262e,0x2a5aa8,0x2f5a3a,0x6a1f2a,0xd8b048,0x5a6670,0xe8e2d0,0x24345a];
const CAR_T={};
function carType(k){if(CAR_T[k])return CAR_T[k];const sp={sedan:{L:4.5,W:1.82,bh:.62,ch:.5,cz:-.15,cl:2.2,rl:1.9},hatch:{L:3.95,W:1.75,bh:.62,ch:.55,cz:-.35,cl:2.05,rl:1.8},suv:{L:4.7,W:1.95,bh:.82,ch:.62,cz:-.35,cl:2.7,rl:2.5},pick:{L:5.2,W:1.95,bh:.8,ch:.62,cz:.55,cl:1.55,rl:1.4}}[k];
  const{L,W,bh,ch,cz,cl,rl}=sp,by=.32+bh/2,cy=.32+bh+ch/2,P_=[],D_=[];
  P_.push([roundBox(W,bh,L,.13,2),0xffffff,0,by,0]);
  P_.push([roundBox(W-.2,.07,rl,.03,1),0xffffff,0,cy+ch/2+.02,cz]);
  for(const sx of[-1,1])for(const sz of[-1,1])P_.push([bgeo(.08,ch,.1),0xffffff,sx*(W/2-.16),cy,cz+sz*(cl/2-.08)]);
  if(k==='pick'){for(const sx of[-1,1])P_.push([bgeo(.08,.36,2.1),0xffffff,sx*(W/2-.04),.32+bh+.18,-1.45]);P_.push([bgeo(W,.36,.08),0xffffff,0,.32+bh+.18,-2.56])}
  D_.push([roundBox(W-.16,ch,cl,.1,1),0x1a2430,0,cy,cz]);
  for(const sx of[-1,1])for(const z of[L/2-.85,-L/2+.85]){D_.push([GC.cwh||(GC.cwh=new THREE.CylinderGeometry(.34,.34,.26,14).rotateZ(PI/2)),0x16171a,sx*(W/2-.12),.34,z]);D_.push([GC.chub||(GC.chub=new THREE.CylinderGeometry(.19,.19,.27,10).rotateZ(PI/2)),0x9a9ea6,sx*(W/2-.12),.34,z])}
  for(const sz of[-1,1])D_.push([bgeo(W+.04,.2,.16),0x2a2c30,0,.42,sz*(L/2+.02)]);
  D_.push([bgeo(W*.5,.16,.04),0x101114,0,by+.05,L/2+.01]);D_.push([bgeo(.5,.14,.03),0xf2efe6,0,.5,-L/2-.08]);
  const Lg=[];for(const sx of[-1,1]){Lg.push([bgeo(.36,.13,.05),0xfff6d8,sx*(W/2-.32),by+.1,L/2+.005]);Lg.push([bgeo(.32,.14,.05),0xe0281e,sx*(W/2-.3),by+.12,-L/2-.005])}
  return CAR_T[k]={L,W,body:mergeParts(P_),det:mergeParts(D_),lit:mergeParts(Lg)}}
function mkCarMesh(){const k=pick(['sedan','sedan','hatch','suv','suv','pick']),T=carType(k),g=new THREE.Group();const col=pick(CAR_PAINT);
  const b=new THREE.Mesh(T.body,GC['cpaint'+col]||(GC['cpaint'+col]=SM({color:col,roughness:.32,metalness:.35,vertexColors:true})));b.castShadow=true;b.receiveShadow=true;g.add(b);
  const d=new THREE.Mesh(T.det,GC.cdet||(GC.cdet=SM({vertexColors:true,roughness:.35,metalness:.3})));d.castShadow=true;g.add(d);
  const l=new THREE.Mesh(T.lit,GC.clit||(GC.clit=new THREE.MeshBasicMaterial({vertexColors:true})));g.add(l);g.userData.L=T.L;g.userData.W=T.W;sc.add(g);return g}
function carsInit(){carNet();const ed=CNET.edges.filter(e=>e.L>12);let tot=0;ed.forEach(e=>tot+=e.L*(e.one?1:2));const n=Math.min(46,Math.round(tot/85));
  for(let i=0;i<n;i++){let e=null;for(let t=0;t<20&&!e;t++){let r=rnd()*tot;for(const x of ed){r-=x.L*(x.one?1:2);if(r<=0){e=x;break}}}if(!e)continue;const dir=e.one?1:(rnd()<.5?1:-1),s=rnd()*e.L;
    if(CARS.some(c=>c.e===e&&c.dir===dir&&Math.abs(c.s-s)<14))continue;const g=mkCarMesh();CARS.push({g,e,dir,s,v:e.v*.8,cr:e.v*(.85+rnd()*.25),hold:0,nt:rnd(),near:[],honk:0,x:0,z:0,a:0,ra:null,L:g.userData.L,W:g.userData.W})}
  carsOn=CARS.length>0}
function carPick(c){const nd=CNET.nodes[c.dir>0?c.e.b:c.e.a],opts=[];for(const id of nd.e){const e=CNET.edges[id];if(e===c.e&&nd.e.length>1)continue;const fromA=CNET.nodes[e.a]===nd;if(e.one&&!fromA)continue;opts.push([e,fromA?1:-1])}
  if(!opts.length){c.dir=-c.dir;c.s=c.dir>0?0:c.e.L;if(Math.abs(c.x-TUN.x)<9&&c.z<TUN.zp+8)c.tunT=3+rnd()*7;return}const[e,d]=pick(opts);c.e=e;c.dir=d;c.s=d>0?0:e.L}
function carLane(c){const[x,z,a]=carAt(c.e,c.s),h=c.dir>0?a:a+PI,off=c.e.one?0:Math.min(c.e.w/4,2.1);return[x-Math.cos(h)*off,z+Math.sin(h)*off,h]}
function carsTick(dt){if(!carsOn)return;const hide=!!(P.inside||CINE||EV||mode==='title'||mode==='loading');
  for(const c of CARS){if(hide){c.g.visible=false;continue}if(c.tunT>0){c.tunT-=dt;c.g.visible=false;continue}/* V118 inside the Greek Row tunnel */
    const fx=Math.sin(c.a),fz=Math.cos(c.a),rx=fz,rz=-fx;let obst=1e9,forP=false;
    const look=c.v*c.v/8+14;
    // Danny in the lane ahead
    if(!P.kart){const dx=P.x-c.x,dz=P.z-c.z,ah=dx*fx+dz*fz,la=dx*rx+dz*rz;if(ah>-1&&ah<look+4&&Math.abs(la)<c.W/2+1.1&&Math.abs(P.y-terrH(P.x,P.z))<1.5){obst=Math.min(obst,ah-c.L/2);forP=true}}
    // other cars and people ahead
    if((c.nt-=dt)<=0){c.nt=.3;c.near=NP.filter(n=>!n.hidden&&!n.down&&!n.int&&Math.abs(n.x-c.x)<26&&Math.abs(n.z-c.z)<26)}
    c.blk=null;for(const n of c.near){const dx=n.x-c.x,dz=n.z-c.z,ah=dx*fx+dz*fz,la=dx*rx+dz*rz;if(ah>0&&ah<look&&Math.abs(la)<c.W/2+.7){const d=ah-c.L/2;if(d<obst){obst=d;c.blk=n;c.blkS=la>=0?1:-1;c.rx_=rx;c.rz_=rz}}}
    for(const o of CARS){if(o===c)continue;const dx=o.x-c.x,dz=o.z-c.z;if(Math.abs(dx)>look+5||Math.abs(dz)>look+5)continue;const ah=dx*fx+dz*fz,la=dx*rx+dz*rz;if(ah>0&&ah<look+4&&Math.abs(la)<1.7)obst=Math.min(obst,ah-(c.L+o.L)/2-1)}
    // slow for the corner at the end of the street
    const rem=c.dir>0?c.e.L-c.s:c.s;let tv=c.cr;if(rem<10)tv=Math.min(tv,4.5+rem*.5);
    if(obst<1e8)tv=Math.min(tv,Math.sqrt(Math.max(0,2*4*(obst-2.8))));if(c.hold>0){c.hold-=dt;tv=0}
    c.v+=clamp(tv-c.v,-9*dt,3*dt);if(c.v<0)c.v=0;
    // V123 someone standing in the lane: honk, and they get out of the way (walk to the nearest spot off the road)
    if(!forP&&c.blk&&c.v<.5&&obst<9){c.honk-=dt;if(c.honk<=0){c.honk=2.5+rnd()*2;if(Math.hypot(P.x-c.x,P.z-c.z)<30){tone(370,.22,'square',.05);tone(440,.28,'square',.05,.05);dmgNum(c.x,2.4,c.z,'HONK!','#ffd34a')}npcOffRoad(c.blk,c.rx_*c.blkS,c.rz_*c.blkS)}}
    else if(forP&&c.v<.5&&obst<9){c.honk-=dt;if(c.honk<=0){c.honk=4+rnd()*3;if(Math.hypot(P.x-c.x,P.z-c.z)<30){tone(370,.22,'square',.05);tone(440,.28,'square',.05,.05);dmgNum(c.x,2.4,c.z,'HONK!','#ffd34a')}}}else c.honk=Math.min(c.honk,.8);
    c.s+=c.dir*c.v*dt;if(c.s<0||c.s>c.e.L){const over=c.dir>0?c.s-c.e.L:-c.s;carPick(c);c.s+=c.dir*over}
    const[lx,lz,la]=carLane(c);if(c.ra==null){c.x=lx;c.z=lz;c.a=la;c.ra=1}else{const k=Math.min(1,dt*6);c.x+=(lx-c.x)*k;c.z+=(lz-c.z)*k;c.a+=((((la-c.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*5)}
    const dp=Math.hypot(P.x-c.x,P.z-c.z);c.g.visible=dp<170;if(!c.g.visible)continue;
    const yf=terrH(c.x+fx*1.4,c.z+fz*1.4),yb=terrH(c.x-fx*1.4,c.z-fz*1.4);c.g.position.set(c.x,(yf+yb)/2,c.z);c.g.rotation.set(0,c.a,0);c.g.rotateX(-Math.atan2(yf-yb,2.8));
    // hitting Danny
    if(mode==='play'&&!P.kart&&c.v>1.4&&!(P.flatT>0)&&(P.carCd||0)<TT){const dx=P.x-c.x,dz=P.z-c.z,ah=dx*fx+dz*fz,la=dx*rx+dz*rz;if(Math.abs(ah)<c.L/2+.3&&Math.abs(la)<c.W/2+.32&&Math.abs(P.y+P.jy-terrH(P.x,P.z))<1.1)carHit(c,la)}
    // nudge people out of the way rather than drive through them
    if(c.v>.3)for(const n of c.near){const dx=n.x-c.x,dz=n.z-c.z,ah=dx*fx+dz*fz,la=dx*rx+dz*rz;if(Math.abs(ah)<c.L/2+.2&&Math.abs(la)<c.W/2+.3){const s=la>=0?1:-1,push=c.W/2+.45-Math.abs(la);n.x+=rx*s*push;n.z+=rz*s*push;if(!n.named&&rnd()<.3)bubble(n,pick(['WHOA!','Watch it!','Hey!']),1.4)}}}}
function carHit(c,la){if(GRAB.on)return;/* V116: not while the pledgemaster is carrying Danny */const v=c.v,d=Math.round(clamp(9+v*2.1,10,34));P.carCd=TT+2.5;S.hp-=d;P.hurt=.6;dmgNum(P.x,2.5,P.z,'-'+d,'#ff5a4a');sfx('hit');noise(.25,.35,500);tone(80,.3,'sine',.3);
  const fx=Math.sin(c.a),fz=Math.cos(c.a),s=la>=0?1:-1,ah=(P.x-c.x)*fx+(P.z-c.z)*fz;if(ah>-c.L/2){const px=c.x+fx*(c.L/2+.6)+Math.cos(c.a)*s*.4,pz=c.z+fz*(c.L/2+.6)-Math.sin(c.a)*s*.4;if(mvOK(px,pz,.3)){P.x=px;P.z=pz}}P.vx=fx*(v*1.1+2)+Math.cos(c.a)*s*3.5;P.vz=fz*(v*1.1+2)-Math.sin(c.a)*s*3.5;P.flatT=2.4;P.flatF=Math.atan2(P.vx,P.vz);if(P.bike){P.bike=0}
  c.v*=.25;c.hold=3.5;c.honk=.2;flinch(PM);toast(pick(['You got hit by a car! Look both ways.','A car slams into you. The driver leans on the horn.','Hit by a car. That one\'s going to bruise.']),3200);if(S.hp<=0){S.hp=0;setTimeout(()=>{if(mode==='play'){P.flatT=0;PM.rotation.x=0;knockout()}},900)}}
// Danny lying flat after a hit: slides, lies there, gets back up
function carFlat(dt){P.flatT-=dt;const T=2.4-P.flatT,k=Math.min(1,dt*2.2);P.vx-=P.vx*k;P.vz-=P.vz*k;const r=.34;if(mvOK(P.x+P.vx*dt,P.z,r))P.x+=P.vx*dt;else P.vx=0;if(mvOK(P.x,P.z+P.vz*dt,r))P.z+=P.vz*dt;else P.vz=0;
  P.y=stairY();const fall=T<.35?T/.35:P.flatT<.5?Math.max(0,P.flatT/.5):1;PM.position.set(P.x,P.y+.12*fall,P.z);PM.rotation.set(0,P.flatF+PI,0);PM.rotateX(-PI/2*fall);animP(PM,0,TT,'');
  if(P.flatT<=0){P.flatT=0;PM.rotation.set(0,P.face,0)}return true}


function addRoleProp(n){if(n.g.P&&n.g.P.hR)return addRoleProp2(n);const r=n.prole,g=n.g,P_=g.P,M_=c=>mt(c,.6);const att=(geo,c,par,x,y,z)=>{const m=new THREE.Mesh(geo,M_(c));m.position.set(x,y,z);par.add(m);return m};
  if(r==='basketball'){n.ball=att(new THREE.SphereGeometry(.13,14,12),0xd8662a,g,.36,.4,.22);n.ball.material=bbMat()}
  else if(r==='pouch')att(bgeo(.3,.16,.1),0x5a3a1e,g,0,.98,.17);
  else if(r==='weather'){att(new THREE.CylinderGeometry(.015,.015,.8,6),0x222222,P_.aR,0,-.5,.05);const c=att(new THREE.ConeGeometry(.42,.22,10),0x2a6aa8,P_.aR,0,-.1,.05);c.rotation.x=PI}
  else if(r==='morning')att(new THREE.CylinderGeometry(.03,.06,.3,8),0xc9a046,P_.aR,0,-.62,.08);
  else if(r==='delinquent')att(new THREE.CylinderGeometry(.04,.04,.2,8),0xc0302a,P_.aR,0,-.64,.06);
  else if(r==='captain')att(bgeo(.22,.3,.03),0x8a6a44,P_.aL,0,-.6,.1);
  else if(r==='hype'){const b=att(bgeo(.46,.26,.16),0x222222,P_.aR,0,-.72,.12);att(new THREE.CylinderGeometry(.07,.07,.02,10).rotateX(PI/2),0x888888,b,-.12,0,.09);att(new THREE.CylinderGeometry(.07,.07,.02,10).rotateX(PI/2),0x888888,b,.12,0,.09)}
  else if(r==='snack'){const t=att(bgeo(.5,.03,.32),0xc9ccd2,P_.aR,0,-.64,.2);for(let i=0;i<4;i++)att(new THREE.SphereGeometry(.05,8,6),[0xd8a040,0xc0302a,0x7a4a2a,0xf2c230][i],t,-.15+i*.1,.05,0)}
  else if(r==='scribe')att(bgeo(.18,.24,.04),0x2a3a5a,P_.aL,0,-.6,.1);
  else if(r==='cone')att(new THREE.ConeGeometry(.1,.36,10),0xff6a1a,P_.aR,0,-.64,.08);
  else if(r==='popstar')att(new THREE.CylinderGeometry(.02,.02,.22,8),0x222222,P_.aR,0,-.64,.08);
  else if(r==='stats'||r==='ouija')att(bgeo(.18,.24,.04),r==='stats'?0x6b4a2a:0x7a5a30,P_.aL,0,-.6,.1);
  else if(r==='skate')att(bgeo(.2,.03,.72),0xd0662a,P_.aL,0,-.6,.1);
  else if(r==='burglar')att(new THREE.SphereGeometry(.14,10,8),0x2a2c33,P_.aR,0,-.66,.08);
  else if(r==='fruit')att(new THREE.SphereGeometry(.075,10,8),0x6a3a8a,P_.aR,0,-.64,.08);
  else if(r==='caveman')att(new THREE.CylinderGeometry(.035,.06,.62,8),0x8a5426,P_.aR,0,-.64,.08);
  else if(r==='mascot'){for(const sg of[-1,1]){const h=att(new THREE.TorusGeometry(.1,.035,6,12,PI*1.4),0xe8dcc0,g,sg*.2,1.92,0);h.rotation.y=sg*PI/2}}}
function weatherLine(){const day=1-NIGHT,t=Math.round(48+day*16+Math.sin(S.day)*5);const sky=NIGHT>.6?'clear and dark, stars out':pick(['clear skies','a few clouds over the quad','light breeze off the lake','crisp fall air']);return pick([`WEATHER UPDATE! ${fmtH(S.gt)}, ${t} degrees, ${sky}, sir!`,`Weather report: ${t} and ${sky}! Perfect day to be an Alpha Sig!`,`It is ${t} degrees, sir! ${sky.charAt(0).toUpperCase()+sky.slice(1)}!`])}
const isBro=m=>m.cl==='brothers'&&!m.pclass&&!m.pledge&&!m.down&&!m.hidden;
function roleTick(n,dt){if(n.aggro||n.follow||n.job||n.down||mode!=='play')return;if(n.ball){const b=Math.abs(Math.sin(TT*5+n.uid));n.ball.position.y=.25+b*.75;n.ball.rotation.x=TT*4}
  if(n.danceT>0){n.danceT-=dt;n.a+=dt*7}
  n.rt-=dt;if(n.rt>0||n.dp>40)return;n.rt=25+rnd()*20;const r=n.prole,same=m=>(m.int||null)===(n.int||null)&&Math.hypot(m.x-n.x,m.z-n.z);
  if(r==='weather')bubble(n,weatherLine(),3.6);
  else if(r==='basketball')bubble(n,pick(['Ball is life, sir!','Dribbling since 6 AM!','It never touches the floor!']),2.6);
  else if(r==='pouch'){const b=NP.find(m=>isBro(m)&&same(m)&&same(m)<20);if(b){bubble(b,pick(['POUCH! Gatorade. Now.','Pouch! My chapstick!','POUCH! Phone charger!','Pouch, get me a burrito.']),2.6);n.job={type:'fetch',b,st:0,t:0}}}
  else if(r==='grenade'){const b=NP.find(m=>isBro(m)&&same(m)&&same(m)<16);if(b){bubble(b,'GRENADE!',2.4);const o=new THREE.Mesh(bgeo(.22,.22,.22),mt(0x3a5a2a,.7));o.position.set(b.x+Math.sin(b.a)*1.4,.11+terrH(b.x+Math.sin(b.a)*1.4,b.z+Math.cos(b.a)*1.4),b.z+Math.cos(b.a)*1.4);sc.add(o);n.job={type:'grenade',b,o,st:0,t:0};tone(1400,.08,'square',.05)}}
  else if(r==='morning'){if(inWin(S.gt,[6,9.5])){n.rt=12;bubble(n,pick(['RISE AND SHINE, GENTLEMEN!','IT IS A BEAUTIFUL DAY TO BE AN ALPHA SIG!','WAKE UP! BREAKFAST IS NOT GOING TO EAT ITSELF!']),3);if(n.dp<25)[523,659,784,1046].forEach((f,i)=>tone(f,.18,'square',.05,i*.14))}else bubble(n,pick(['Is it morning yet?','I set eleven alarms.']),2.4)}
  else if(r==='delinquent'){puff(n.x,n.z);bubble(n,pick(['MAYHEM!','ALPHA SIG FOREVER!','You saw NOTHING.','For the house!']),2.6);NP.forEach(m=>{if(m!==n&&!m.auth&&!m.named&&same(m)&&same(m)<7){m.flee=3;bubble(m,'Hey! What is that smell?!',2)}});const cop=NP.find(m=>m.auth&&same(m)&&same(m)<16);if(cop)bubble(cop,'Russo! Again?!',2.4)}
  else if(r==='captain')bubble(n,pick(['Pledges! Stand up straight!',(S.pledged?'Kowalski, tuck your shirt in!':'Rush is almost over, gentlemen.'),'Roll call. Six PM. Front lawn. Do NOT be late.',`Class Spirit is at ${S.spirit}. We can do better!`]),3);
  else if(r==='hype'){bubble(n,pick(['LET\'S GOOOOO!','WHO RUNS THIS ROW? ALPHA SIG!','TURN IT UP!']),2.4);if(n.dp<14)[0,.25,.5,.75].forEach(t=>tone(t%.5?180:90,.12,'sine',.12,t))}
  else if(r==='snack')bubble(n,pick(['Snacks! Get your snacks!','Pretzels, sir?','I have gummy worms.']),2.4);
  else if(r==='scribe')bubble(n,pick(['*scribbling furiously*','Noted, sir.','Page forty-one...']),2.2);
  else if(r==='cone')bubble(n,pick(['Got my cone for today.','Found it by the road. It is MINE.','Do not ask where I got this.']),2.6);
  else if(r==='popstar')bubble(n,pick(['? Alpha Sigma, baby, ooh! ?','? Roll call tonight, na na na! ?','? I did not choose this lyric! ?']),2.8);
  else if(r==='stats')bubble(n,pick(['Beers by brother: Tank is up four.','Tally: nine bong hits since lunch.','Women at the party: still zero. Noted.']),3);
  else if(r==='skate')bubble(n,pick(['Kickflip! ...almost.','Campus cops hate this board.','Watch this one, sir!']),2.4);
  else if(r==='burglar')bubble(n,pick(['I was never here.','Nice trophy. Be a shame if it walked off.','Just borrowing it, sir.']),2.4);
  else if(r==='fruit')bubble(n,pick(['It is getting bigger, sir.','Do NOT bruise the fruit.','Day three with this grape. Still fresh.']),2.6);
  else if(r==='ouija')bubble(n,pick(['The board says Grant is lying.','Something is standing behind you, sir.','It spelled your name. Twice.']),2.8);
  else if(r==='caveman')bubble(n,pick(['OOGA BOOGA!','Fire bad. Beer good.','Me pledge. Me hit things.']),2.4);
  else if(r==='mascot'){bubble(n,pick(['BAAAAAH!','GO ALPHA SIG! BAAAH!']),2.2);n.danceT=2}}
function jobTick(n,dt){const j=n.job;j.t+=dt;
  if(j.type==='fetch'){if(j.st===0){navTo(n,j.b.x,j.b.z,4.4,dt);if(Math.hypot(n.x-j.b.x,n.z-j.b.z)<1.7||j.t>20){j.st=1;j.t=0;bubble(n,'Here you go, sir!',2);bubble(j.b,pick(['Took you long enough, Pouch.','Good pouch.','Wrong flavor. Whatever.']),2.4)}}else if(j.st===1){if(j.t>1.6)n.job=null}}
  else if(j.type==='grenade'){if(j.st===0){navTo(n,j.o.position.x,j.o.position.z,5.2,dt);if(Math.hypot(n.x-j.o.position.x,n.z-j.o.position.z)<.9||j.t>12){j.st=1;j.t=0;bubble(n,'I GOT IT! SAVE YOURSELVES!',2.6);sfx('hit')}}else if(j.st===1){n.g.DIVE=1;n.g.rotation.set(PI/2,n.a,0,'YXZ');n.g.position.set(j.o.position.x,.3+terrH(j.o.position.x,j.o.position.z),j.o.position.z);if(j.t>3){sc.remove(j.o);n.g.DIVE=0;n.g.rotation.set(0,n.a,0);bubble(j.b,pick(['Good pledge.','Heroic. Truly.','That was a shoe, Ramsey.']),2.4);n.job=null}return 1}}
  else if(j.type==='line'){const d=Math.hypot(n.x-j.x,n.z-j.z);if(d>.4){if(j.dt>0){j.dt-=dt;navTo(n,j.dx,j.dz,3.4,dt)}else{navTo(n,j.x,j.z,3.4,dt);j.st=(j.lastD!=null&&j.lastD-d<.01)?(j.st||0)+dt:0;j.lastD=d;if(j.st>1){j.st=0;const s_=rnd()<.5?-1:1;j.dx=n.x+s_*1.6;j.dz=n.z+(j.z>n.z?.5:-.5);j.dt=1.1}}}else{const k=Math.min(1,dt*4);n.x+=(j.x-n.x)*k;n.z+=(j.z-n.z)*k;n.a=j.face}}}
// V100 roll call formation spread across the whole ASR front lawn (inside the gold box RC_BOX): 3 ranks x 7 files, 2.4 m between ranks and
// 5 m between files, centred on the front walk and facing the class captain (Andre) out by the sidewalk. The rear rank stays west of the
// backyard path (x 87.55+). Front-rank centre is left open for Danny.
const RC_BOX=[80.2,54,91.2,98],RC_CAP=[80.9,76],RC_ME=[82.4,76];
const RC_SLOTS=(()=>{const a=[];for(let r=0;r<3;r++)for(let f=0;f<7;f++){if(r===0&&f===3)continue;if(r===2&&(f===0||f===6))continue;a.push([82.4+r*2.4,76+(f-3)*5])}return a})();
const RC_PMS=[80.9,78.6];let RC_PMN=null;function rcPM(){if(RC_PMN&&NP.includes(RC_PMN))return RC_PMN;return RC_PMN=NP.find(n=>/^ΑΣΡ Ritualist/.test(n.title||''))||null}
function rollCallTick(dt){if(!S.pledged)return;const inRC=S.gt>=18&&S.gt<19&&S.day>=1;const cls=PCLASS.map(k=>NN[k]).filter(Boolean);
  if(inRC){const mates=cls.filter(m=>m!==NN.andre);cls.forEach((n,i)=>{if(n.follow||n.aggro||n.down)return;const sl=n===NN.andre?RC_CAP:RC_SLOTS[mates.indexOf(n)%RC_SLOTS.length];if(!n.atLine){if((n.int||null)!==null){if((P.inside||null)===(n.int||null)&&n.dp<14)return;n.int=null;n.path=null;const tx=sl[0]-2.2,tz=sl[1]+(rnd()-.5);if(freeAt(tx,tz,.34)){n.x=tx;n.z=tz}else{n.x=RC_CAP[0]-1;n.z=RC_CAP[1]}}n.atLine=1}
    // NPCs over 60 m from Danny aren't simulated, so far-away pledges would never arrive: bring them in while they're out of sight
    if(!n.int&&n.dp>55&&Math.hypot(n.x-sl[0],n.z-sl[1])>45){const tx=sl[0]-2.2,tz=sl[1];n.path=null;if(freeAt(tx,tz,.34)){n.x=tx;n.z=tz}else{n.x=sl[0];n.z=sl[1]}}if(!n.job||n.job.type!=='line')n.job={type:'line',x:sl[0],z:sl[1],face:n===NN.andre?PI/2:-PI/2,t:0}});
    // V113: the ASR pledgemaster comes out and stands beside the pledge captain for roll call
    {const pm=rcPM();if(pm&&!pm.down&&!pm.aggro&&!pm.follow&&!pm.grab){if(!pm.rcHome)pm.rcHome={int:pm.int||null,x:pm.x,z:pm.z};const sl=RC_PMS;
      if((pm.int||null)!==null&&!((P.inside||null)===(pm.int||null)&&pm.dp<14)){pm.int=null;pm.path=null;pm.x=sl[0]-1.6;pm.z=sl[1]}
      if(!pm.int&&pm.dp>55&&Math.hypot(pm.x-sl[0],pm.z-sl[1])>45){pm.path=null;pm.x=sl[0];pm.z=sl[1]}
      if(!pm.int&&!pm.grab&&(!pm.job||pm.job.type!=='line'))pm.job={type:'line',x:sl[0],z:sl[1],face:PI/2,t:0}
      /* V116: not inside the gold perimeter when roll call starts? the pledgemaster comes and gets you */
      if(!GRAB.on&&mode==='play'&&!EV&&!P.kart&&!CINE&&S.rcDone!==S.day&&S.rcGrab!==S.day&&S.gt<18.5&&(P.inside||!(P.x>RC_BOX[0]&&P.x<RC_BOX[2]&&P.z>RC_BOX[1]&&P.z<RC_BOX[3]))){S.rcGrab=S.day;grabStart(pm)}}}
    const cap=NN.andre;if(S.rcDone!==S.day&&!P.inside&&cap&&cap.atLine&&S.rcHint!==S.day&&Math.hypot(P.x-RC_ME[0],P.z-RC_ME[1])<26){S.rcHint=S.day;toast('Fall in! Your spot is the gap in the middle of the front rank.',3200)}
    if(S.rcDone!==S.day&&!P.inside&&P.x>RC_BOX[0]&&P.x<RC_BOX[2]&&P.z>RC_BOX[1]&&P.z<RC_BOX[3]&&cap&&cap.atLine){S.rcDone=S.day;bubble(cap,'ROLL CALL! ...Kowalski?',2.6);setTimeout(()=>{S.spirit=clamp(S.spirit+8,0,100);stand(2);gainXP(10);toast('"Present!" Roll call complete. Class Spirit +8.',3200);sfx('ok')},900);setTimeout(prRollCall,3800)}}
  else{{const pm=RC_PMN;if(pm&&pm.rcHome){if(pm.dp>22&&!pm.follow&&!pm.aggro){pm.int=pm.rcHome.int;pm.x=pm.rcHome.x;pm.z=pm.rcHome.z;pm.path=null;pm.job=null;pm.rcHome=null}else if(pm.job&&pm.job.type==='line')pm.job=null}}
  cls.forEach(n=>{if(n.atLine&&n.dp>22&&!n.follow){n.atLine=0;n.job=null;n.int=n.homeInt||null;n.x=n.hx;n.z=n.hz;n.path=null}else if(n.atLine&&n.job&&n.job.type==='line')n.job=null});
    if(S.gt>=19&&S.gt<19.2&&S.rcChk!==S.day&&S.day>=2){S.rcChk=S.day;if(S.rcDone!==S.day){S.spirit=clamp(S.spirit-6,0,100);stand(-3);toast('You missed roll call. Andre writes your name in the book. Class Spirit −6.',3600);sfx('bad')}}}}
function pclassFight(n,dt){if(!S.pledged||!n.pclass||n.down||n.follow)return;n.pcT=(n.pcT||0)-dt;if(n.pcT>0)return;n.pcT=.6;if(n.aggro&&n.tgt==='P')return;
  const foe=NP.find(m=>!m.down&&!m.pclass&&!m.ally&&(m.int||null)===(n.int||null)&&Math.hypot(m.x-n.x,m.z-n.z)<18&&((m.aggro&&m.tgt==='P')||m.foe||(m===P.lastHit&&TT-P.lastHitT<6)));
  if(foe&&!n.aggro){n.aggro=1;n.tgt=foe;n.job=null;bubble(n,pick(['PLEDGE CLASS, GO!','Nobody touches Kowalski!','We stand together!']),2)}}
function becomePledge(){S.pledged=1;setHat(1);sfx('lvl');big('PLEDGE',1500)}
function classSpirit(d,msg){if(d>0)d=Math.round(d*(1+skv('spirit')));S.spirit=clamp((S.spirit||50)+d,0,100);if(msg)toast(msg,3200)}

// ================================================================ INTERACTION WHEEL
const ACKS=['"Okay."','"That\'s cool."','"Got it."','"Sounds good."','"Uh… okay."','"Huh. Interesting."','"Makes sense."','"Will do."','"Right."','"Noted."','"Yeah, I hear you."','"For real?"','"No way."','"Cool, cool."'];
let WH=null;const DANNY={isP:1,name:'Danny Kowalski',get x(){return P.x},get z(){return P.z},get g(){return PM},get lvl(){return S.lvl}};const _wv=new THREE.Vector3();
const WICON={flirt:'💋 ',follow:'👥 ',task:'★ ',chat:'💬 ',trade:'$ ',buy:'$ ',sell:'$ ',comp:'♥ ',insult:'✖ ',fight:'✊ '};
const REL0={tank:20,reese:20,owen:20,marcus:25,grant:5,gus:10,marisol:5,priya:10};
const relKey=n=>nid(n)||('u'+n.uid);
function relOf(n){S.rel=S.rel||{};const k=relKey(n);if(S.rel[k]==null)S.rel[k]=REL0[nid(n)]||0;return S.rel[k]}
function relPeek(n){const k=relKey(n);return S.rel&&S.rel[k]!=null?S.rel[k]:(REL0[nid(n)]||0)}
const relLabel=(v,n)=>n&&isFlirt(n)&&v>=85?'Side Piece':v<=-60?'Enemy':v<=-20?'Disliked':v<10?'Stranger':v<30?'Acquaintance':v<60?'Friend':v<85?'Good Friend':'Best Friend';
function relAdd(n,v){v=Math.round(v);S.rel=S.rel||{};const k=relKey(n);S.rel[k]=clamp(relOf(n)+v,-100,100);try{c1Rel(n,k,S.rel[k])}catch(e){}if(S.rel[k]<=-100&&!n.auth&&!n.actor&&!n.aggro){n.aggro=1;n.tgt='P';setTimeout(()=>bubble(n,'That\'s it. You\'re done, Kowalski!',2.4),0)}dmgNum(n.x,2.85,n.z,(v>0?'+':v<0?'−':'±')+Math.abs(v)+' ♥',v>0?'#7fe07a':v<0?'#ff6a5a':'#d8d0c0');if(v>0)tone(880+v*60,.12,'triangle',.07);else if(v<0)tone(240,.18,'sawtooth',.05);return S.rel[k]}
const relBias=n=>(relOf(n)+100)/200;
function wpick(vals,ws){let t=0;ws.forEach(w=>t+=Math.max(0,w));let r=rnd()*t;for(let i=0;i<vals.length;i++){r-=Math.max(0,ws[i]);if(r<=0)return vals[i]}return vals[vals.length-1]}
function relUI(n){const v=relOf(n),w=Math.abs(v)/2;$('wrl').textContent=relLabel(v,n)+' '+(v>0?'+':'')+v;const b=$('wrb');b.style.left=(v<0?50-w:50)+'%';b.style.width=w+'%';b.style.background=v<0?'#c0392b':'#4f9a5a'}
function openWheel(o){mode='wheel';unlock();const n=o.focus;if(n.isP)SCENE=null;else if(!(SCENE&&SCENE.n===n))SCENE={n};document.body.classList.add('cine');
  const leave=o.ch.filter(c=>c[3]==='leave'),rest=o.ch.filter(c=>c[3]!=='leave');WH={n,o,rest,leave:leave[0]||null,page:0,armed:0,t0:Date.now()};$('wheel').classList.toggle('dock',innerWidth<1000||matchMedia('(pointer:coarse)').matches);
  if(o.story)$('wname').textContent=[o.title,o.sp||(n.isP?'':n.name)].filter(Boolean).join(' · ');else $('wname').textContent=n.name+' · '+(n.title||CL[n.cl].n)+' · Lv '+n.lvl+(o.sp&&o.sp.includes('You have')?' · You have '+money$(S.money):'')+(n.shop==='hank'&&S.budget>0?' · Grant\'s money: '+money$(S.budget):'');$('wbal').classList.toggle('story',!!o.story);try{typeOut($('wline'),o.text||'',n.isP?(o.sp?{name:o.sp}:null):n,o.story?1:0,$('wheel'))}catch(e){$('wline').textContent=o.text||''}$('wrel').hidden=!!(o.story||n.isP||!n.uid);if(!$('wrel').hidden)relUI(n);$('wheel').hidden=false;wheelRender()}
function ghost(e){return!!(e&&e.isTrusted&&e.detail>0&&WH&&!WH.armed&&Date.now()-WH.t0<900)}
addEventListener('pointerdown',()=>{if(WH&&Date.now()-WH.t0>60)WH.armed=1},true);
function wheelRender(){const box=$('wpills');box.innerHTML='';const per=8,pages=Math.ceil(WH.rest.length/per)||1,many=WH.rest.length>per+1;const list=many?WH.rest.slice(WH.page*per,WH.page*per+per):WH.rest;
  const items=list.map(c=>({c}));if(many)items.push({more:1});WH.items=items;
  items.forEach((it,i)=>{const b=document.createElement('button');b.className='wp';const k=document.createElement('kbd');k.textContent=String(i+1);b.appendChild(k);
    if(it.more){b.classList.add('more');b.appendChild(document.createTextNode(`More choices… (${WH.page+1}/${pages})`));b.onclick=()=>{sfx('ui');WH.page=(WH.page+1)%pages;wheelRender()}}
    else{const[l,f,dis,cls]=it.c;const why=typeof dis==='function'?dis():dis;const ic=WICON[cls]||'';b.appendChild(document.createTextNode(ic+prLine(l)));if(cls)b.dataset.k=cls;if(why&&why!==true){const sm=document.createElement('small');sm.textContent='('+why+')';b.appendChild(sm);b.title=why}b.disabled=!!why;if(cls==='task')b.classList.add('task');if(cls==='insult'||cls==='fight')b.classList.add('danger');b.onclick=e=>{if(ghost(e))return;prSpoke(l);wheelPick(f)}}
    box.appendChild(b);setTimeout(()=>b.classList.add('in'),25+i*28)});
  WH.lb=null;if(WH.leave){const lb=document.createElement('button');lb.className='wp leave';lb.textContent=WH.o.story?prLine(WH.leave[0])+' (Esc)':prLine('"Catch you later."')+' (Esc)';lb.onclick=e=>{if(ghost(e))return;prSpoke(WH.o.story?WH.leave[0]:'"Catch you later."');wheelPick(WH.leave[1])};box.appendChild(lb);setTimeout(()=>lb.classList.add('in'),25);WH.lb=lb}
  wheelPos();setTimeout(()=>{const b=box.querySelector('.wp:not(:disabled)');b&&b.focus({preventScroll:true})},40)}
function wheelPick(f){if(!WH)return;sfx('ui');closeWheel();mode='play';f&&f();if(mode==='play'){endScene();if(cardQ.length)card(cardQ.shift())}}
function closeWheel(){$('wheel').hidden=true;$('wpills').innerHTML='';WH=null}
function wheelPos(){if(!WH||$('wheel').classList.contains('dock'))return;const n=WH.n,W=innerWidth,H=innerHeight;_wv.set(n.x,n.isP?P.y+2.1:(n.tall?3.35:(n.prop?2.25:2.05)*(n.g.scale.y||1))+(n.g?n.g.position.y:terrH(n.x,n.z)),n.z).project(cam);   /* V368 from where the speaker actually stands (a stage, the Nippert field, a balcony), not the terrain under them */
  const rx=Math.min(250,W*.3),ry=Math.min(130,H*.2);let cx=(_wv.x+1)/2*W,cy=(1-_wv.y)/2*H;if(_wv.z>1){cx=W/2;cy=H/2}const headY=_wv.z>1?H:cy;   /* V311 the speaker's head top on screen */cx=clamp(cx,rx*.6+20,W-rx*.6-20);cy=clamp(Math.max(cy,$('wbal').offsetHeight+ry+40),ry+120,H-ry-70);
  const bs=[...$('wpills').children].filter(b=>b!==WH.lb),N=bs.length,R_=Math.ceil(N/2),L_=N-R_;
  bs.forEach((b,i)=>{const right=i<R_,k=right?i:i-R_,cnt=right?R_:L_,a=cnt>1?(-1+2*k/(cnt-1))*1.05:0;const x=cx+(right?1:-1)*(rx*.38+rx*.62*Math.cos(a)),y=cy+ry*Math.sin(a);const w=b.offsetWidth,h=b.offsetHeight;let left=right?x:x-w;left=clamp(left,8,W-w-8);b.style.transform=`translate(${left}px,${clamp(y-h/2,8,H-h-8)}px)`});
  if(WH.lb){const w=WH.lb.offsetWidth;WH.lb.style.transform=`translate(${clamp(cx-w/2,8,W-w-8)}px,${Math.min(H-50,cy+ry+34)}px)`}
  const bal=$('wbal');bal.style.left=clamp(cx,bal.offsetWidth/2+8,W-bal.offsetWidth/2-8)+'px';bal.style.top=Math.max(bal.offsetHeight+10,Math.min(cy-ry-26,headY-34))+'px'}   /* V311 never cover the faces: the balloon ends above the speaker's head, or at the top of the screen */

// ================================================================ DAMAGE NUMBERS & LEVEL TAGS
const DMG=[];
function dmgNum(x,y,z,t,col){y+=terrH(x,z);let s=DMG.find(d=>d.t>=1);if(!s){if(DMG.length>18)return;const c=document.createElement('canvas');c.width=160;c.height=64;s={c,sp:new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,depthTest:false})),t:1};s.sp.scale.set(1.9,.76,1);s.sp.renderOrder=5;sc.add(s.sp);DMG.push(s)}const q=s.c.getContext('2d');q.clearRect(0,0,160,64);q.font='900 40px Archivo,Arial';q.textAlign='center';q.textBaseline='middle';q.lineWidth=7;q.strokeStyle='#000';q.strokeText(t,80,34);q.fillStyle=col;q.fillText(t,80,34);s.sp.material.map.needsUpdate=true;s.t=0;s.x=x+(rnd()-.5)*.6;s.y=y;s.z=z;s.sp.visible=true}
function dmgTick(dt){for(const d of DMG)if(d.t<1){d.t+=dt*1.1;d.sp.position.set(d.x,d.y+d.t*1.3,d.z);d.sp.material.opacity=Math.min(1,(1-d.t)*1.6);if(d.t>=1)d.sp.visible=false}}
function rrect(q,x,y,w,h,r){q.beginPath();if(q.roundRect)q.roundRect(x,y,w,h,r);else q.rect(x,y,w,h);q.fill()}
function mkTag(n){const c=document.createElement('canvas');c.width=360;c.height=84;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));s.scale.set(3.3,.77,1);s.position.y=n.tall?3.55:n.prop?2.75:2.5;s.userData.c=c;n.tag=s;n.g.add(s);drawTag(n)}
function tagDrop(n){const t=n.tag;if(!t)return;n.tag=null;n.tagHp=n.tagLv=null;if(t.parent)t.parent.remove(t);try{t.material.map.dispose();t.material.dispose()}catch(e){}}   /* V296 frees a far-away name tag's texture */
/* V327 level diamonds: a crayon-scribbled diamond with the number inside, one color per level (1 orange … 10 red, then the colors repeat). Used on name tags, the HUD and the Pledge Class. */
const LVCOL=['#f26522','#f5a300','#d9c400','#39b54a','#29a8e0','#1f62d6','#1f2c9c','#7d33c4','#e22fbe','#e0262c'];
function lvCol(lv){return LVCOL[(Math.max(1,lv|0)-1)%10]}
/* V335: the diamond takes the color of the person's fraternity (their house shirt color) or, if they have no house, their clique. Danny and the ΑΣΡ pledge class use ΑΣΡ maroon. */
function lvColOf(n){if(!n||n===PM)return'#'+HOUSE.asr.shirt.toString(16).padStart(6,'0');const hk=n.house||(n.cl==='brothers'?'asr':null),h=hk&&HOUSE[hk];if(h&&h.shirt!=null)return'#'+h.shirt.toString(16).padStart(6,'0');return(CL[n.cl]&&CL[n.cl].c)||lvCol(n.lvl)}
function lvDraw(q,cx,cy,r,lv,c){const col=c||lvCol(lv);q.save();
  const dia=k=>{q.beginPath();q.moveTo(cx,cy-r*k);q.lineTo(cx+r*k,cy);q.lineTo(cx,cy+r*k);q.lineTo(cx-r*k,cy);q.closePath()};
  /* V328: solid diamond in the level color, thin dark edge and a thin white inner line */
  dia(.97);q.fillStyle=col;q.fill();q.lineJoin='round';q.lineWidth=Math.max(1,r*.05);q.strokeStyle='rgba(0,0,0,.35)';q.stroke();
  dia(.8);q.lineWidth=Math.max(1,r*.035);q.strokeStyle='rgba(255,255,255,.85)';q.stroke();
  const t=String(lv);q.font=`800 ${Math.round(r*(t.length>1?.72:.98))}px Archivo,"Arial Black",Arial,sans-serif`;q.textAlign='center';q.textBaseline='middle';
  /* light fills (Staff beige, RA gold) get a dark number so it stays readable */const lum=(()=>{const m=/^#?([0-9a-f]{6})$/i.exec(col);if(!m)return 0;const v=parseInt(m[1],16);return(.299*(v>>16&255)+.587*(v>>8&255)+.114*(v&255))/255})(),dark=lum>.62;
  q.lineWidth=Math.max(1,r*.07);q.strokeStyle=dark?'rgba(255,255,255,.35)':'rgba(0,0,0,.28)';q.strokeText(t,cx,cy+r*.06);q.fillStyle=dark?'#2a2028':'#fff';q.fillText(t,cx,cy+r*.06);q.restore()}
const LVIMG={};
function lvImg(lv,col){lv=Math.max(1,lv|0);const k=lv+'|'+(col||'');if(LVIMG[k])return LVIMG[k];const c=document.createElement('canvas');c.width=c.height=96;lvDraw(c.getContext('2d'),48,48,45,lv,col);return LVIMG[k]=c.toDataURL()}
function lvBadge(lv,cls,col){return`<img class="lvd${cls?' '+cls:''}" src="${lvImg(lv,col)}" alt="Level ${lv}" title="Level ${lv}">`}
function drawTag(n){const c=n.tag.userData.c,q=c.getContext('2d');q.clearRect(0,0,360,84);q.font='600 24px Archivo,Arial';const tw=Math.min(210,q.measureText(n.name).width),W=tw+78,x0=(360-W)/2;q.fillStyle='rgba(14,20,34,.86)';rrect(q,x0,4,W,46,10);q.fillStyle=CL[n.cl].c;q.fillRect(x0+10,14,8,26);q.fillStyle='#fff';q.textBaseline='middle';q.fillText(n.name,x0+26,28,210);
  const lv=n.lvl;lvDraw(q,x0+tw+54,27,20,lv,lvColOf(n));
  const f=clamp(n.hp/n.mhp,0,1);q.fillStyle='rgba(0,0,0,.7)';rrect(q,x0+8,56,W-16,14,6);q.fillStyle=f>.5?'#6fd06a':f>.25?'#f0c040':'#e0483a';if(f>0)rrect(q,x0+10,58,(W-20)*f,10,5);
  n.tag.material.map.needsUpdate=true;n.tagHp=n.hp;n.tagLv=S.lvl}

// ================================================================ VISION
function los(x0,z0,x1,z1){const d=Math.hypot(x1-x0,z1-z0);for(let t=.8;t<d-.5;t+=.5){if(hAt(x0+(x1-x0)*t/d,z0+(z1-z0)*t/d)>1.7)return false}return true}
function canSee(n,range){range*=prSeeMul();if(n.down||n.stun>0)return false;const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz);if(d>range)return false;if(d>2.2&&(dx*Math.sin(n.a)+dz*Math.cos(n.a))/d<.3)return false;return los(n.x,n.z,P.x,P.z)}

// ================================================================ NPC AI
/* V171 NPC wall handling: remember the last free spot, climb out of a wall if embedded (spawn, teleport, shove), slide around corners, and give up on a blocked route */
function npcEject(n){if(n.lgx!=null&&freeAt(n.lgx,n.lgz,.3)){n.x=n.lgx;n.z=n.lgz;n.path=null;return}
  for(let q=.25;q<=3;q+=.25)for(let k=0;k<16;k++){const a=k/16*TAU+q,x=n.x+Math.cos(a)*q,z=n.z+Math.sin(a)*q;if(freeAt(x,z,.3)){n.x=x;n.z=z;n.path=null;return}}}
function moveTo(n,tx,tz,spd,dt){const dx=tx-n.x,dz=tz-n.z,d=Math.hypot(dx,dz);if(d<.05)return true;if(freeAt(n.x,n.z,.2)){n.lgx=n.x;n.lgz=n.z}else{npcEject(n);return false}const v=Math.min(d,spd*dt),nx=n.x+dx/d*v,nz=n.z+dz/d*v,r=.34;if(n.fb&&fbForeign(n,nx,nz)){n.path=null;n.sp=0;if(!(n.wait>0))n.wait=1+rnd()*2;return false}let moved=false;if(freeAt(nx,nz,r)){n.x=nx;n.z=nz;moved=true}else if(freeAt(nx,n.z,r)){n.x=nx;moved=true}else if(freeAt(n.x,nz,r)){n.z=nz;moved=true}
  if(!moved&&d>.4){const ux=dx/d,uz=dz/d,sg=n.sdir||(n.sdir=rnd()<.5?1:-1);for(const ang of[.7*sg,-.7*sg,1.4*sg,-1.4*sg]){const c=Math.cos(ang),s2=Math.sin(ang),sx=n.x+(ux*c-uz*s2)*v,sz=n.z+(ux*s2+uz*c)*v;if(freeAt(sx,sz,r)){n.x=sx;n.z=sz;moved=true;break}}}
  if(moved)n.blk=0;else if(d>.4&&(n.blk=(n.blk||0)+dt)>1.2){n.blk=0;n.sdir=-(n.sdir||1);n.path=null;if(!(n.wait>0))n.wait=.4+rnd()*1.2}
  const ta=Math.atan2(dx,dz);n.a+=((((ta-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*10);n.sp=moved?spd:0;return moved}
// --- grid navigation for NPCs (BFS on the 1m walk grid)
const NR=30,NW=NR*2+1,NPAR=new Int32Array(NW*NW),NQB=new Int32Array(NW*NW);let navBudget=8;
function navBFS(x0,z0,gx,gz,rect,cap){const ox=Math.floor(x0)-NR,oz=Math.floor(z0)-NR;NPAR.fill(-1);const si=NR*NW+NR;NPAR[si]=si;let h=0,t=0,found=-1;NQB[t++]=si;
  const G=gx!=null?(Math.floor(gz)-oz)*NW+(Math.floor(gx)-ox):-2;const vis=[];
  while(h<t){const c=NQB[h++];if(c===G){found=c;break}if(gx==null){vis.push(c);if(cap&&vis.length>=cap)break}const ci=c%NW,cj=(c/NW)|0;
    for(const[di,dj]of[[1,0],[-1,0],[0,1],[0,-1]]){const i=ci+di,j=cj+dj;if(i<0||j<0||i>=NW||j>=NW)continue;const k=j*NW+i;if(NPAR[k]>=0)continue;const wx=ox+i,wz=oz+j;if(wx<0||wz<0||wx>=WW||wz>=WD||!PW[wz*WW+wx])continue;if(rect&&(wx<rect[0]||wx>rect[2]||wz<rect[1]||wz>rect[3]))continue;NPAR[k]=c;NQB[t++]=k}}
  return{found,vis,ox,oz,si}}
function navPath(B,c,x0,z0){const pts=[];let k=c,g=0;while(k!==B.si&&g++<4000){pts.push([B.ox+(k%NW)+.5,B.oz+((k/NW)|0)+.5]);k=NPAR[k]}pts.reverse();const out=[];let cur=[x0,z0],i=0;while(i<pts.length){let j=Math.min(pts.length-1,i+14);while(j>i&&!losPW(cur,pts[j]))j--;cur=pts[j];out.push(cur);i=j+1}return out}
function follow(n,spd,dt){const p=n.path;if(!p||n.pi2>=p.length)return true;const w=p[n.pi2];const x0=n.x,z0=n.z;moveTo(n,w[0],w[1],spd,dt);if(Math.hypot(w[0]-n.x,w[1]-n.z)<.45)n.pi2++;
  n.stk=(n.stk||0)+dt;if(n.stk>.6){const mv=Math.hypot(n.x-(n.sx||0),n.z-(n.sz||0));n.sx=n.x;n.sz=n.z;n.stk=0;if(mv<.25){n.stuck=(n.stuck||0)+1;if(n.stuck>2){n.path=null;n.stuck=0;return true}}else n.stuck=0}return n.pi2>=p.length}
// V169: ΑΣΡ brothers outside (front pair, front trio, backyard idlers; tagged `n.roam` in spawnFrats) drift around the whole lot -- front yard, both side paths, back yard --
// once the first mission (c1arrive, finding the house) is done. Until then they stay put exactly as before. Stand a while, stroll to a nearby spot, stand again.
let ROAM=null;
function roamOn(n){return !!S.done.c1arrive&&!n.temp&&!n.int&&!n.pledge&&!n.down}
function roamPool(){if(ROAM)return ROAM;const pts=[],Y=YARDS.asr,add=(x,z)=>{if(freeAt(x,z,.5))pts.push([x,z])};
  for(let x=80;x<=91;x+=3)for(let z=56;z<=96;z+=3)add(x,z);                                  // front yard (the roll-call lawn)
  for(const r of(YROUTES.asr||[]))for(let i=0;i<r.length-1;i++){const[ax,az]=r[i],[bx,bz]=r[i+1],L=Math.hypot(bx-ax,bz-az),k=Math.max(1,Math.round(L/3));for(let j=0;j<=k;j++)add(ax+(bx-ax)*j/k,az+(bz-az)*j/k)}   // side paths
  if(Y)for(let dx=-7;dx<=7;dx+=3.5)for(let dz=-9;dz<=9;dz+=3)add(Y.cx+dx,Y.cz+dz);            // back yard
  let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;for(const[x,z]of pts){x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z)}
  return ROAM={pts,rect:[Math.floor(x0)-3,Math.floor(z0)-3,Math.ceil(x1)+3,Math.ceil(z1)+3]}}
function roamTick(n,dt){const R=roamPool(),still=n.mode==='chat'?'talk':'';
  if(n.rwait==null)n.rwait=1+rnd()*8;
  if(n.rwait>0){n.rwait-=dt;if(n.dp<2.4)n.a+=((((Math.atan2(P.x-n.x,P.z-n.z)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*4);return n.named&&n.dp<5?'talk':still}
  if(!n.path){if(navBudget<=0)return still;navBudget--;
    const near=R.pts.filter(q=>{const d=Math.hypot(q[0]-n.x,q[1]-n.z);return d>4&&d<24});
    if(!near.length||rnd()<.12){n.rwait=3+rnd()*6;return still}
    const q=pick(near),B=navBFS(n.x,n.z,q[0],q[1],R.rect,0);
    if(B.found<0){n.rwait=2+rnd()*4;return still}
    n.path=navPath(B,B.found,n.x,n.z);n.pi2=0;n.stk=0;n.sx=n.x;n.sz=n.z;return ''}
  if(follow(n,1.3,dt)){n.path=null;n.rwait=6+rnd()*16}
  return ''}
function newWander(n){const r=ZN[n.zone]||ZN.quad,B=navBFS(n.x,n.z,null,null,r,1800);const far=B.vis.filter(c=>{const i=c%NW-NR,j=((c/NW)|0)-NR;return i*i+j*j>=64&&!c3kHold(B.ox+c%NW+.5,B.oz+((c/NW)|0)+.5)&&!(n.fb&&fbForeign(n,B.ox+c%NW+.5,B.oz+((c/NW)|0)+.5))});if(!far.length){n.wait=2+rnd()*3;return}const c=pick(far);n.path=navPath(B,c,n.x,n.z);n.pi2=0;n.stk=0;n.sx=n.x;n.sz=n.z}
// V176 a Big Brother backing Danny up leads the way to the fight along the gold trail studs (a few studs ahead of Danny), waiting if Danny falls behind
function allyLead(n,dt){const st=AM&&curStep();if(!st||st.t!=='fight'||!st.ally||st.woke||!goal||P.inside||n.int)return false;const T=trailPts;if(!T||T.length<2){return false}
  const dg=Math.hypot(goal[0]-P.x,goal[1]-P.z);if(dg<16)return false;
  const k=Math.max(0,T.length-3),t=T[k],dP=Math.hypot(n.x-P.x,n.z-P.z),aheadOfDanny=Math.hypot(goal[0]-n.x,goal[1]-n.z)<dg;
  if(dP>11&&aheadOfDanny){n.sp=0;n.a=Math.atan2(P.x-n.x,P.z-n.z);n.leadT=(n.leadT||0)-dt;if(n.leadT<=0){n.leadT=6;bubble(n,pick(['Keep up, pledge.','This way.','Over here!']),2)}return true}
  const ps=n.lpP?Math.hypot(P.x-n.lpP[0],P.z-n.lpP[1])/Math.max(dt,1e-3):0;n.lpP=[P.x,P.z];n.dSp=(n.dSp||0)+(Math.min(ps,9)-(n.dSp||0))*Math.min(1,dt*3);
  const sp=Math.max(3.4,Math.min(8,!aheadOfDanny||dP<4.5?n.dSp*1.25+1.2:n.dSp+.2));
  if(Math.hypot(t[0]-n.x,t[1]-n.z)>.6)navTo(n,t[0],t[1],sp,dt);else{n.sp=0;n.a=Math.atan2(P.x-n.x,P.z-n.z)}return true}
function navTo(n,tx,tz,spd,dt){const d=Math.hypot(tx-n.x,tz-n.z);if(d<2.5||losPW([n.x,n.z],[tx,tz])){n.path=null;return moveTo(n,tx,tz,spd,dt)}
  n.pathT=(n.pathT||0)-dt;if((!n.path||n.pathT<=0||Math.hypot(tx-(n.ptx||0),tz-(n.ptz||0))>2.5)&&navBudget>0){navBudget--;n.pathT=.8;n.ptx=tx;n.ptz=tz;const B=navBFS(n.x,n.z,tx,tz,null,0);if(B.found>=0){n.path=navPath(B,B.found,n.x,n.z);n.pi2=0}else n.path=null}
  if(n.path&&n.path.length){follow(n,spd,dt);return true}return moveTo(n,tx,tz,spd,dt)}
function tgtPos(n){if(n.tgt==='P')return[P.x,P.z];if(n.tgt&&!n.tgt.down&&NP.includes(n.tgt))return[n.tgt.x,n.tgt.z];return null}
function fightAI(n,dt){const tp=tgtPos(n);if(!tp){n.aggro=0;n.tgt=null;return}const d=Math.hypot(tp[0]-n.x,tp[1]-n.z);if(d>30&&!n.temp){n.aggro=0;n.tgt=null;return}if(d>1.45)navTo(n,tp[0],tp[1],3.3+n.lvl*.09,dt);else{n.sp=0;n.a=Math.atan2(tp[0]-n.x,tp[1]-n.z)}n.cd-=dt;if(d<1.75&&n.cd<=0){n.cd=1.05+rnd()*.5;n.punch=.22;if(n.tgt==='P')hitPlayer(n);else hitNPC(n.tgt,clamp(9*Math.pow(1.45,n.lvl-n.tgt.lvl),1,45),n)}}
const LVM=(a,d)=>Math.pow(1.32,a-d);
// V98 follower slots: up to 3 per row behind the player (left, right, centre), rows 1.5 m apart, so a group never stacks on one spot
let FOLT=-1,FOL=[];
function folSlot(n){if(FOLT!==TT){FOLT=TT;FOL=NP.filter(m=>(m.follow||m.ally)&&!m.down&&(m.int||null)===(P.inside||null))}
  const k=Math.max(0,FOL.indexOf(n)),row=Math.floor(k/3),lat=[-1.5,1.5,0][k%3]*(1+row*.12),back=1.9+row*1.5,fx=Math.sin(P.face),fz=Math.cos(P.face);
  let x=P.x-fx*back+fz*lat,z=P.z-fz*back-fx*lat;if(!freeAt(x,z,.34)){x=P.x-fx*back;z=P.z-fz*back;if(!freeAt(x,z,.34)){x=P.x-fx*1.2;z=P.z-fz*1.2}}return[x,z]}
function hitNPC(t,dmg,src){if(t.kid||t.mute)return;/* V122: never the high schoolers */if(t.throne&&t.statue&&src==='P')throneRise(t);if(src&&src.dmgMul)dmg*=src.dmgMul;dmg=Math.max(1,Math.round(dmg));if(src&&src.noKill){if(t.hp<=1)return;dmg=Math.min(dmg,t.hp-1)}/* V144 brawl allies leave the last hit to Danny */t.hp-=dmg;t.stun=Math.max(t.stun,.22);{const sx=src==='P'?P.x:(src&&src.x!=null?src.x:t.x-Math.sin(t.a)),sz=src==='P'?P.z:(src&&src.z!=null?src.z:t.z-Math.cos(t.a));t.hitDx=t.x-sx;t.hitDz=t.z-sz;t.hitP=Math.min(8.5,3.5+dmg*.22);flinch(t.g,t.hitDx,t.hitDz)}sfx('hit');if(TT-(t.ofT??-9)>.25){t.ofT=TT;try{voxOof(t,t.hp<=0)}catch(e){}}dmgNum(t.x,2.4,t.z,'-'+dmg,src==='P'?(dmg>=18?'#ffb14a':'#ffffff'):'#d8d0c0');if(t.hp<=0&&!t.down){t.hp=0;t.down=t.temp?9999:24;t.aggro=0;t.tgt=null;t.chase=0;t.koP=src==='P';if(src==='P')onKO(t)}else if(!t.down&&!t.auth){t.aggro=1;t.tgt=src}}
function onKO(t){S.stats.kos++;dropLoot(t);{const g=clamp(4+3*(t.lvl-S.lvl),2,20);toast(`You knocked out ${t.name}. +${g} XP`,1800);gainXP(g)}
  if(!t.temp){if(t.cl==='brothers')stand(t.named?-8:-4);else if(S.rep[t.cl]!=null)rep(t.cl,t.named?-8:-3);if(t===NN.dean)trouble(100);}if(t.auth)trouble(100)}
function hitPlayer(n){if(mode==='card'||mode==='wheel')return;if(P.dk!=null&&Math.abs(P.y-terrH(n.x,n.z))>1.4)return;if(prBlock(n))return;if(P.roll>0||P.jy>.6){dmgNum(P.x,2.5,P.z,'DODGE','#7fd8ff');sfx('whiff');return}if(P.blocking&&blkHit(n))return;const d=Math.max(1,Math.round(clamp(7*LVM(n.lvl,S.lvl)*(S.bb==='tank'?.85:1)*(n.robber?1.9:1),1,n.robber?50:40)*(1-Math.min(.6,skv('def')))));S.hp-=d;prHurt(d);P.hurt=.45;flinch(PM);sfx('hit');if(TT-(P.ouT??-9)>.35){P.ouT=TT;try{voxOuch()}catch(e){}}dmgNum(P.x,2.5,P.z,'-'+d,'#ff5a4a');const dx=P.x-n.x,dz=P.z-n.z,l=Math.hypot(dx,dz)||1;P.vx+=dx/l*4;P.vz+=dz/l*4;if(P.bike){P.bike=0;toast('Knocked off your bike!')}if(S.hp<=0){S.hp=0;if(n.robber)robKO(n);else knockout()}}
// V124 car lanes only (RG also marks footpaths, sidewalks and patios): the same roads carNet() drives — map roads of a car kind ≥ 6 m wide,
// plus the downtown asphalt rectangles in RD. Built once, lazily, on the collision grid.
let LANEG=null;
function laneGrid(){if(LANEG)return LANEG;const G=new Uint8Array(RG.length);
  for(const r of UCD.roads||[]){if(!CAR_K[r.k]||r.w<6||r.sf||r.pts.length<2)continue;const R_=r.w/2;for(let i=0;i<r.pts.length-1;i++){const[a,b]=r.pts[i],[c,d]=r.pts[i+1],vx=c-a,vz=d-b,L2=vx*vx+vz*vz||1;
    cells(Math.min(a,c)-R_,Math.min(b,d)-R_,Math.max(a,c)+R_,Math.max(b,d)+R_,(k,x,z)=>{const t=clamp(((x-a)*vx+(z-b)*vz)/L2,0,1);if(Math.hypot(x-a-vx*t,z-b-vz*t)<=R_)G[k]=1})}}
  for(const r of RD){if(!Array.isArray(r))continue;const[x0,z0,x1,z1]=r;if(Math.min(x1-x0,z1-z0)<6)continue;cells(x0,z0,x1,z1,k=>{G[k]=1})}return LANEG=G}
const inLane=(x,z)=>{const k=cidx(x,z);return k>=0&&laneGrid()[k]===1};
// V123 the nearest free spot out of the car lanes, trying the given side first (sx,sz = unit vector), then all round
function offRoadSpot(x,z,sx,sz){for(let d=1.5;d<=16;d+=.75){const tries=sx!=null?[[sx,sz],[-sx,-sz]]:[];for(let a=0;a<12;a++)tries.push([Math.cos(a/12*TAU),Math.sin(a/12*TAU)]);
    for(const[ux,uz]of tries){const X=x+ux*d,Z=z+uz*d;if(!inLane(X,Z)&&!inLane(X+ux*.6,Z+uz*.6)&&freeAt(X,Z,.4)){const X2=X+ux*.9,Z2=Z+uz*.9;return freeAt(X2,Z2,.4)&&!inLane(X2,Z2)?[X2,Z2]:[X,Z]}}}return null}
// a car honked at n: walk off the road (idle/chat/play people get a new spot to stand; wanderers just pick a new walk)
function npcOffRoad(n,sx,sz){if(!n||n.actor||n.temp||n.job||n.statue||n.aggro||n.chase)return;
  if(n.mode==='wander'||!n.mode){n.wait=0;n.path=null;return}const p=offRoadSpot(n.x,n.z,sx,sz);if(!p)return;n.hx=p[0];n.hz=p[1];n.ha=null;if(n.mode==='chat'||n.mode==='play')n.mode='idle';
  if(n.dp<30&&rnd()<.6)bubble(n,pick(['Okay, okay!','Sorry!','Geez, relax.','My bad.','I\'m going!']),1.8)}
// at start-up nobody who stands still is left in a car lane (ambient NPCs and the crowd's virtual people)
function roadClearAll(){let k=0;const still=m=>m==='idle'||m==='chat'||m==='play';
  for(const n of NP){if(n.int||n.actor||n.temp||n.statue||n.job||!still(n.mode)||!inLane(n.x,n.z))continue;const p=offRoadSpot(n.x,n.z);if(!p)continue;n.x=n.hx=n.tx=p[0];n.z=n.hz=n.tz=p[1];if(n.g)n.g.position.set(p[0],terrH(p[0],p[1]),p[1]);if(n.vp){n.vp.x=p[0];n.vp.z=p[1]}k++}
  try{for(const v of CROWD.V){if(v.slot||!still(v.mode)||!inLane(v.x,v.z))continue;const p=offRoadSpot(v.x,v.z);if(p){v.x=p[0];v.z=p[1];k++}}}catch(e){}return k}
function npcUpd(n,dt){if(n.grab)return;const dx=P.x-n.x,dz=P.z-n.z;n.dp=Math.hypot(dx,dz);if(n.rose&&!n.down){if(n.aggro&&(n.int||null)===(P.inside||null))n.calm=0;else if((n.calm=(n.calm||0)+dt)>8||(n.int||null)!==(P.inside||null))throneReseat(n)}if(n.leaveT>0){n.leaveT-=dt;if(n.leaveT<=0){n.int=n.homeInt;n.x=n.hx;n.z=n.hz;n.path=null}}if(n.hidden){n.g.visible=false;return}if((n.int||null)!==(P.inside||null)&&!n.aggro){n.g.visible=false;n.dp=999;return}
  if(n.pclass&&!n.job&&!n.actor&&!n.down&&!n.statue&&(n.fixT=(n.fixT||0)-dt)<=0){n.fixT=2;if(!freeAt(n.x,n.z,.12))npcEject(n)}
  const near=n.dp<60;n.g.visible=near;/* V360 at most 6 bodies are built per frame so walking into a crowd doesn't stutter; the rest wait a frame, hidden */if(near&&n.g.userData.lazy){if(BODYF!==TT){BODYF=TT;BODYQ=0}if(BODYQ++<6)bodyBuild(n.g);else n.g.visible=false}if(n.statue){n.aggro=0;n.chase=0;n.sp=0;n.x=n.sx;n.z=n.sz;n.g.position.set(n.sx,n.sy,n.sz);if(n.bub&&n.bubT>0){n.bubT-=dt;if(n.bubT<=0)n.bub.visible=false}try{if(n.dp<30&&!n.mute){if(!n.tag)mkTag(n);else if(n.tagHp!==n.hp||n.tagLv!==S.lvl)drawTag(n);n.tag.visible=true}else if(n.tag)n.tag.visible=false}catch(e){}return}if(!near&&!n.aggro&&!n.chase&&!n.def)return;n.t+=dt;n.sp=0;
  if(n.bub&&n.bubT>0){n.bubT-=dt;if(n.bubT<=0)n.bub.visible=false}
  n.g.TALK=!!(n.bub&&n.bubT>1.1);
  if(SCENE&&SCENE.n===n&&(mode==='wheel'||mode==='card')&&!(n.down>0)){n.sp=0;n.g.position.set(n.x,terrH(n.x,n.z),n.z);n.g.rotation.set(0,n.a,0);return}
  if(n.down>0){n.down-=dt;if(n.g.P&&n.g.P.kL){if(!n.rag)ragStart(n);ragStep(n,dt)}else{n.g.rotation.set(-PI/2,n.a,0,'YXZ');n.g.position.set(n.x,.25+terrH(n.x,n.z),n.z)}if(n.down<=0){n.hp=n.mhp*.6;ragEnd(n);n.g.rotation.set(0,n.a,0);n.down=0}return}
  if(n.stun>0){n.stun-=dt;n.g.position.set(n.x,terrH(n.x,n.z),n.z);n.g.rotation.y=n.a;if(n.flee>0){n.flee-=dt;moveTo(n,n.x-dx,n.z-dz,2.6,dt)}animP(n.g,n.sp,n.t,'');n.g.rotation.z=Math.sin(n.t*20)*.05;return}n.g.rotation.z=0;
  let st='',amb=0;
  if(n.def){if(EV&&EV.type==='football'&&EV.start<=0){const lx=P.x+P.vx*.45,lz=P.z+P.vz*.45;moveTo(n,lx,lz,4.35+n.lvl*.06,dt);if(n.dp<1.05&&P.roll<=0&&!EV.tag){EV.tag=1;sfx('whistle')}}st='guard'}
  else if(n.chase){navTo(n,P.x,P.z,(n.cl==='cops'?5.4:5.0),dt);st='guard';if(n.dp<1.3&&P.roll<=0){n.chase=0;busted()}}
  else if(n.aggro){fightAI(n,dt);st=n.punch>0?'punch':'guard';n.punch-=dt}
  else if(n.rob===1){navTo(n,P.x,P.z,2.9,dt)}
  else if(n.nag){st=tgNagTick(n,dt)}
  else if(n.dance){st=hyDanceTick(n,dt)}
  else if(n.eat){st=snEatTick(n,dt)}
  else if(n.goIn){st=nightInTick(n,dt)}
  else if(n.follow){}
  else if(n.flee>0){n.flee-=dt;moveTo(n,n.x-dx,n.z-dz,3.6,dt)}
  else if(n.job){if(jobTick(n,dt)){animP(n.g,0,n.t,'');return}}
  else if(n.c3guard){st=c3kGuardTick(n,dt)}
  else if(n.c3wired){st=c3WiredTick(n,dt)}
  else if(n.roam&&roamOn(n)){st=roamTick(n,dt)}
  else if(ambOK(n)){st=ambLife(n,dt);amb=1}
  else if(ambLiteOK(n)){st=ambLite(n,dt,ambR(n));amb=1}
  else if(n.mode==='idle'){if(n.dp<5){n.a+=((((Math.atan2(dx,dz)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*4)}else if(n.ha!=null)n.a+=((((n.ha-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*3);if(Math.hypot(n.x-n.hx,n.z-n.hz)>.5&&!n.temp)navTo(n,n.hx,n.hz,1.6,dt);st=n.named&&n.dp<5?'talk':''}
  else if(n.mode==='play'){if(Math.hypot(n.x-n.hx,n.z-n.hz)>.6){if(!n.temp)navTo(n,n.hx,n.hz,1.8,dt)}else{if(n.ha!=null)n.a+=((((n.ha-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*4);st='throw';if(n.dp<16&&n.dp>2&&((n.pbc=(n.pbc==null?3+rnd()*6:n.pbc)-dt)<=0)){n.pbc=8+rnd()*10;bubble(n,pick(PLAYSAY),2.2)}}}
  else if(n.mode==='guard'&&n.patrol){const p=n.patrol[n.pi];if(n.wait>0)n.wait-=dt;else if(moveTo(n,p[0],p[1],1.5,dt)===false||Math.hypot(p[0]-n.x,p[1]-n.z)<.4){n.pi=(n.pi+1)%n.patrol.length;n.wait=1.5}if(n.wait>0){n.alPose='look';amb=1}}
  else if(n.mode==='chat'){st=chatTick(n,dt);amb=1}   /* V300 take turns */
  else{if(n.wait>0){n.wait-=dt;if(!n.wAct)n.wAct=ambPick();n.alPose=n.wAct;amb=1}else if(!n.path){n.wAct=null;if(navBudget>0){navBudget--;newWander(n)}}else if(follow(n,n.auth?1.6:1.35,dt)){n.path=null;n.wait=2+rnd()*6}}
  // social
  if(!EV&&!n.temp&&!n.named&&!n.follow&&n.dp<20&&!n.aggro&&!n.chase&&n.mode!=='chat'&&!(n.al&&(n.al.cv||n.al.k==='away'||n.al.k==='watch'||n.al.k==='wait'))){n.bubCd-=dt;if(n.bubCd<=0){n.bubCd=9+rnd()*14;const C=CL[n.cl];const fr=S.rep[n.cl]>=50;const tt=(turfUnlocked()&&!n.fb&&!n.pledge&&!n.prop&&!n.auth&&!n.int)?terrAt(n.x,n.z):null;if(tt&&rnd()<.7)bubble(n,pick(turfChant(tt.f)));else if(n.nick&&n.dp<7&&rnd()<.5)bubble(n,pick(['Yo, '+n.nick+'!',n.nick+'! What up!','Sup, '+n.nick+'.']));else if(fr&&n.dp<7)bubble(n,pick(['Hey, Danny!','Danny! My guy.','Looking good, Kowalski.']));else{const L=c1Lines(n,n.lines||C.say);if(L.length)bubble(n,npcCyc(n,'b',L))}}
    n.hostCd-=dt;if(n.hostCd<=0&&!n.mute){n.hostCd=1.6;const r=S.rep[n.cl];if(!n.auth&&!n.kid&&n.dp<7&&relPeek(n)<=-100){n.aggro=1;n.tgt='P';bubble(n,'I told you to stay away from me!',2)}if(r!=null&&r<=-25&&n.dp<8&&rnd()<(-r-15)/140&&!n.auth&&!n.kid){n.aggro=1;n.tgt='P';bubble(n,pick(CL[n.cl].taunt),2)}
      if(r!=null&&r>=50&&!n.auth&&!n.kid){const foe=NP.find(m=>m.aggro&&m.tgt==='P'&&!m.down&&m.cl!==n.cl&&Math.hypot(m.x-n.x,m.z-n.z)<14);if(foe){n.aggro=1;n.tgt=foe;bubble(n,'Leave him alone!',2)}}}}
  if(n.pclass){pclassFight(n,dt);roleTick(n,dt)}
  if(n.hpr)hpTick(n,dt);
  if((n.ally||n.follow)&&!n.down){n.hostCd-=dt;if(n.hostCd<=0){n.hostCd=.5;const foe=NP.filter(m=>(m.foe||(m.aggro&&m.tgt==='P')||(m===P.lastHit&&TT-P.lastHitT<6))&&!m.down&&!m.ally&&!m.follow&&(m.int||null)===(P.inside||null)&&Math.hypot(m.x-P.x,m.z-P.z)<20).sort((a,b)=>Math.hypot(a.x-n.x,a.z-n.z)-Math.hypot(b.x-n.x,b.z-n.z))[0];if(foe){n.aggro=1;n.tgt=foe}else{n.aggro=0;n.tgt=null}}if(!n.aggro&&n.ally&&allyLead(n,dt)){}else if(!n.aggro&&(n.follow||n.dp>3.2)){const[sx,sz]=folSlot(n),ds=Math.hypot(sx-n.x,sz-n.z);if(ds>.45)navTo(n,sx,sz,n.dp>7?6.4:ds>2.5?4.2:2.8,dt);else if(n.follow)n.a=P.face}}
  // authority
  if(n.auth&&!EV){const rng=(n.cl==='ra'?12:n.cl==='cops'?18:16)*(NIGHT>.6?.75:1)*(K.KeyC||toggles.KeyC?.7:1);if(n.dp<rng&&canSee(n,rng)){n.lastSeen=0;SEEN=1;if(OFFENSE){trouble(26*dt);if(rnd()<dt*.5&&(!n.bub||!n.bub.visible))bubble(n,'Curfew, kid!')}if(S.trouble>=25&&!n.chase){n.chase=1;bubble(n,'Stop right there!',2);sfx('whistle')}}else n.lastSeen+=dt;if(n.chase){CHASED=1;if(n.lastSeen>5||S.trouble<1){n.chase=0}}}
  n.g.position.set(n.x,terrH(n.x,n.z),n.z);n.g.rotation.y=n.a;animP(n.g,n.sp,n.t,st);if(n.dance)hyDancePose(n);if(n.eat)snEatPose(n);if(n.c3wired)c3WiredPose(n);if(n.c3guard)c3kGuardPose(n);if(amb)ambPose(n);else if(n.alPose||n.alProp){n.alPose=null;ambPose(n)}
  if(n.dp<30&&!n.mute){if(!n.tag)mkTag(n);else if(n.tagHp!==n.hp||n.tagLv!==S.lvl)drawTag(n);n.tag.visible=true}else if(n.tag){n.tag.visible=false;if(n.dp>60)tagDrop(n)}}
let PRT=0,SEEN=0,CHASED=0,OFFENSE=null,NIGHT=0;

// ================================================================ PLAYER
let PM,bikeM,kartM,ramC,lanternM;
function mkPlayer(){const DO={shadow:1,noMouth:1,shirt:0x7d1f2c,sleeve:0x7d1f2c,pants:0x34486e,skin:0xf1c9a5,hair:0x4a3020,pin:1};PM=mkPerson(DO);sc.add(PM);{const tmp=mkPerson(Object.assign({},DO,{prop:1}));PM.P.geoHair=PM.P.torso.geometry;PM.P.geoHat=tmp.P.torso.geometry;const pr=tmp.P.prop;if(pr.parent)pr.parent.remove(pr);(PM.P.head||PM).add(pr);PM.P.prop=pr;pr.visible=false}
  {const mm=new THREE.MeshBasicMaterial({color:0x5a1e1e});const mouth=new THREE.Mesh(new THREE.BoxGeometry(.085,.022,.02),mm);mouth.position.set(0,1.715,.188);PM.add(mouth);
   const smile=new THREE.Mesh(new THREE.TorusGeometry(.052,.014,6,12,PI),mm);smile.rotation.z=PI;smile.position.set(0,1.735,.187);smile.visible=false;PM.add(smile);
   const teeth=new THREE.Mesh(new THREE.BoxGeometry(.07,.016,.012),new THREE.MeshBasicMaterial({color:0xfafaf2}));teeth.position.set(0,1.722,.195);teeth.visible=false;PM.add(teeth);PM.P.mouth=mouth;PM.P.smile=smile;PM.P.teeth=teeth;if(PM.P.pal){for(const m of[mouth,smile,teeth])PM.remove(m);const pp=PM.P;pp.mouth={visible:true};pp.teeth={visible:false};pp.smile={get visible(){return!!pp.smileOn},set visible(v){pp.smileOn=!!v}}}}
  bikeM=new THREE.Group();const wg=new THREE.TorusGeometry(.36,.05,8,20);wg.rotateY(PI/2);for(const z of[-.58,.58]){const w=new THREE.Mesh(wg,mt(0x161616));w.position.set(0,.38,z);bikeM.add(w)}const fr=mt(0x2a6aa8,.4,.3);const a=(w,h,d,x,y,z,rx=0)=>{const e=new THREE.Mesh(bgeo(w,h,d),fr);e.position.set(x,y,z);e.rotation.x=rx;e.castShadow=true;bikeM.add(e)};a(.06,.06,1.1,0,.62,0);a(.06,.55,.06,0,.66,-.2,.3);a(.06,.6,.06,0,.68,.45,-.3);a(.5,.05,.05,0,1.02,.52);a(.2,.06,.3,0,.95,-.28);bikeM.visible=false;PM.add(bikeM);
  kartM=mkKart(0x7d1f2c);kartM.visible=false;PM.add(kartM);
  ramC=mkRam();ramC.scale.setScalar(.8);ramC.position.set(0,1.95,0);ramC.visible=false;PM.add(ramC);
  lanternM=new THREE.Group();{const l=new THREE.Mesh(bgeo(.22,.3,.22),bm(0xffd27a));l.position.y=-.65;lanternM.add(l);const lt=new THREE.PointLight(0xffc060,1.2,10,1.8);lt.position.y=-.6;lanternM.add(lt)}lanternM.visible=false;(PM.P.hR||PM.P.aR).add(lanternM);if(PM.P.hR)lanternM.position.y=.55}
function mkKart(col){const g=new THREE.Group();const a=(geo,m,x,y,z)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.castShadow=true;g.add(e);return e};a(bgeo(1.3,.25,2.1),mt(col,.4,.3),0,.3,0);a(bgeo(.8,.4,.5),mt(0x1a1a1a),0,.55,-.45);a(bgeo(1.4,.14,.3),mt(col,.4,.3),0,.45,1.05);const wg=GC.kw||(GC.kw=new THREE.CylinderGeometry(.24,.24,.22,12).rotateZ(PI/2));for(const[x,z]of[[-.72,.75],[.72,.75],[-.72,-.75],[.72,-.75]])a(wg,mt(0x111111),x,.24,z);return g}
function setHat(v){if(!PM)return;PM.P.torso.geometry=v?PM.P.geoHat:PM.P.geoHair;PM.P.prop.visible=!!v}
function medPose(on){const p=PM.P;for(const l of[p.lL,p.lR]){l.rotation.order=on?'YXZ':'XYZ';l.rotation.set(0,0,0)}p.aL.rotation.set(0,0,0);p.aR.rotation.set(0,0,0);PM.position.y=P.y}
function toggleMed(){if(P.med){P.med=0;medPose(0);$('bmed')&&$('bmed').classList.remove('on');toast('You stand up, feeling centered.',1600);return}
  if(mode!=='play'||EV||P.kart||CINE)return;if(P.bike)return toast('Get off your bike first.',1500);if(S.carry)return toast("You can't meditate while carrying that.",1500);if(NP.some(n=>n.aggro&&n.tgt==='P'))return toast("Not now, someone's coming at you!",1500);
  P.med=1;P.medHp=S.hp;P.medG=0;P.vx=P.vz=0;medPose(1);$('bmed')&&$('bmed').classList.add('on');sfx('ui');toast('Criss-cross applesauce. Time flows 8× faster. Press Z / Meditate again to get up.',3200)}
// V115 push Danny out of any round collider he overlaps and drop the velocity going into it, so he slides round posts and bushes
function circPushP(pr){for(let it=0;it<2;it++)circNear(P.x,P.z,c=>{const dx=P.x-c[0],dz=P.z-c[1],m=c[2]+pr,d2=dx*dx+dz*dz;if(d2>=m*m)return false;const d=Math.sqrt(d2)||1e-3,nx=d2?dx/d:1,nz=d2?dz/d:0,x=c[0]+nx*m,z=c[1]+nz*m;
  CIRC_OFF=1;const ok=mvOK(x,z,pr);CIRC_OFF=0;if(ok){P.x=x;P.z=z;const vn=P.vx*nx+P.vz*nz;if(vn<0){P.vx-=vn*nx;P.vz-=vn*nz;/* dead-on hit: steer to one side so he walks round it */const vt=Math.hypot(P.vx,P.vz);if(vt<-vn*.5){let g=P.gs||1;const sideOK=g2=>freeAt(P.x-nz*g2*.55,P.z+nx*g2*.55,pr);if(!sideOK(g)&&sideOK(-g))g=-g;P.gs=g;P.vx+=-nz*g*-vn*.85;P.vz+=nx*g*-vn*.85}}}return false})}
function playerUpd(dt){CIRC_OFF=0;P.blocking=0;if(P.flatT>0&&carFlat(dt))return;if(P.med){if(S.hp<P.medHp-.5||NP.some(n=>n.aggro&&n.tgt==='P')){toggleMed();toast('Your meditation is interrupted!',1800)}else{P.medHp=Math.max(P.medHp,S.hp);P.vx=P.vz=0;S.sta=Math.min(staMax(),S.sta+30*dt);if(K.ArrowLeft)yaw+=1.9*dt;if(K.ArrowRight)yaw-=1.9*dt;if(K.ArrowUp)pitch=clamp(pitch-1.2*dt,-.25,1.15);if(K.ArrowDown)pitch=clamp(pitch+1.2*dt,-.25,1.15);/* V123: up/down arrows tilt the camera */
    const p=PM.P,br=Math.sin(TT*1.3)*.04;PM.position.set(P.x,P.y-.68,P.z);PM.rotation.set(0,P.face,0);PM.scale.y=1;p.lL.rotation.set(-1.5,.62,0);p.lR.rotation.set(-1.36,-.62,0);p.aL.rotation.set(-.7+br,0,.18);p.aR.rotation.set(-.7+br,0,-.18);return}}
if(P.pose>0){P.pose-=dt;const tf=Math.atan2(cam.position.x-P.x,cam.position.z-P.z);P.face+=((((tf-P.face)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*12);P.vx=P.vz=0;PM.position.set(P.x,P.y,P.z);PM.rotation.set(0,P.face,0);PM.scale.y=1;animP(PM,0,TT,'wave');const sm=P.pose>0;PM.P.smile.visible=PM.P.teeth.visible=sm;PM.P.mouth.visible=!sm;if(P.pose<=0){PM.P.smile.visible=PM.P.teeth.visible=false;PM.P.mouth.visible=true}return}
  const kb=K.KeyW?1:0,kbS=K.KeyS?1:0,kA=K.KeyA?1:0,kD=K.KeyD?1:0;let f=kb-kbS+(-joy.y),s=kD-kA+joy.x;const ml=Math.hypot(f,s);if(ml>1){f/=ml;s/=ml}
  if(K.ArrowLeft)yaw+=1.9*dt;if(K.ArrowRight)yaw-=1.9*dt;if(K.ArrowUp)pitch=clamp(pitch-1.2*dt,-.25,1.15);if(K.ArrowDown)pitch=clamp(pitch+1.2*dt,-.25,1.15);
  if(P.kart){kartUpd(dt,f,s);return}
  const cr=K.KeyC||toggles.KeyC,sprintK=K.ShiftLeft||K.ShiftRight||toggles.ShiftLeft;const carry=S.carry==='ram';
  let wx=0,wz=0;const mv=Math.hypot(f,s)>.12;if(mv){wx=-Math.sin(yaw)*f+Math.cos(yaw)*s;wz=-Math.cos(yaw)*f-Math.sin(yaw)*s;const l=Math.hypot(wx,wz);wx/=l;wz/=l}
  if(P.exh&&S.sta>30)P.exh=0;if(P.drinkT>0)P.drinkT-=dt;
  /* V172 BLOCK: hold R or the right mouse button. Arms cross in an X in front of him. Blocked hits cost stamina instead of health (see blkHit);
     with no stamina the block can't be raised, and a hit bigger than what's left breaks the guard (P.blkBrk) until stamina is back to 20. */
  if(P.blkBrk&&S.sta>=20)P.blkBrk=0;
  const blkWant=!!(K.KeyR||RMB||BLKT)&&mode==='play'&&!P.bike&&!carry&&!P.blkBrk&&S.sta>=3&&P.roll<=0&&P.jy<=.05&&P.jv===0&&!P.atk&&P.punch<=0&&!P.med&&!GRAB.on;
  P.blk=clamp((P.blk||0)+(blkWant?dt*8:-dt*6),0,1);P.blocking=blkWant&&P.blk>.4?1:0;if(P.blkHitT>0)P.blkHitT-=dt;
  const run=sprintK&&mv&&!P.exh&&!cr&&!carry&&S.sta>0&&!blkWant;
  if(K.KeyQ||K.ControlLeft){K.KeyQ=K.ControlLeft=0;if(P.roll<=0&&S.sta>=15&&!cr&&!P.bike&&!carry){P.roll=.45;S.sta-=skv('roll')>=1?10:20;P.rdx=mv?wx:Math.sin(P.face);P.rdz=mv?wz:Math.cos(P.face);P.pt=.5}}
  if(K.Space){K.Space=0;if(P.jy<=0&&P.jv===0&&!P.bike&&!carry&&S.sta>=6){P.jv=6.4*(skv('jmp')>=1?1.12:1);S.sta-=6;P.pt=.5}}
  let sp=P.bike?(run?14.5:10):carry?2.1:(cr?1.7*prCrouchMul():run?6.2*(1+skv('spd')):3.3)*prSpeedMul()*(blkWant?.45:1);let tx=wx*sp,tz=wz*sp;
  if(P.roll>0){P.roll-=dt;tx=P.rdx*7.6;tz=P.rdz*7.6}
  /* V381 Mascot ram: crouched and pawing he can only turn (WASD aims), then the charge shoots him forward */if(P.ramT>0){P.ramT-=dt;tx=P.rdx*9.5;tz=P.rdz*9.5}else if(P.ramHold>0){if(wx||wz)P.face+=((((Math.atan2(wx,wz)-P.face)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*6);tx=0;tz=0}
  const acc=P.bike?3.2:P.roll>0?30:prAcc(),k=Math.min(1,acc*dt);P.vx+=(tx-P.vx)*k;P.vz+=(tz-P.vz)*k;
  const r=P.bike?.5:.34;CIRC_OFF=1;/* V115: grid walls here; round colliders are resolved by circPushP below */
  P.sup=P.sup||0;FH=(P.dk==null&&!P.bike)?P.sup+P.jy:-1;   /* V174 jump onto low objects (see SH in file 01) */
  // V113 never stuck: if Danny is already overlapping something, ease him out to the nearest clear spot
  if(P.dk==null&&!mvOK(P.x,P.z,r)){let best=null;for(const d of[.12,.25,.4,.6,.85,1.15,1.6]){for(let a=0;a<16;a++){const an=a/16*TAU,x=P.x+Math.cos(an)*d,z=P.z+Math.sin(an)*d;if(mvOK(x,z,r)){best=[x,z,d];break}}if(best)break}
    if(best){const k=Math.min(1,6*dt/best[2]);P.x+=(best[0]-P.x)*Math.max(k,.35);P.z+=(best[1]-P.z)*Math.max(k,.35)}}
  const ivx=P.vx,ivz=P.vz,ox=P.x,oz=P.z;
  if(mvOK(P.x+P.vx*dt,P.z,r))P.x+=P.vx*dt;else{if(P.bike&&Math.abs(P.vx)>6){P.bike=0;S.hp-=8;sfx('hit');toast('You crashed your bike.')}P.vx=0}if(mvOK(P.x,P.z+P.vz*dt,r))P.z+=P.vz*dt;else{if(P.bike&&Math.abs(P.vz)>6){P.bike=0;S.hp-=8;sfx('hit');toast('You crashed your bike.')}P.vz=0}
  // V113 glide: when a post, bush or corner stops most of the move, slide round it at a slight angle instead of sticking
  {const want=Math.hypot(ivx,ivz)*dt,got=Math.hypot(P.x-ox,P.z-oz);if(P.dk==null&&want>.004&&got<want*.5&&P.jy<=0){const rem=want-got;let done=false;
    const gs=P.gs||1;for(const an of[.45*gs,-.45*gs,.9*gs,-.9*gs,1.35*gs,-1.35*gs,1.57*gs,-1.57*gs]){const c=Math.cos(an),sn=Math.sin(an),dx=(ivx*c-ivz*sn)/Math.hypot(ivx,ivz),dz=(ivx*sn+ivz*c)/Math.hypot(ivx,ivz),st=rem*Math.max(.55,Math.cos(an));
      if(mvOK(P.x+dx*st,P.z+dz*st,r)&&mvOK(P.x+dx*st*.5,P.z+dz*st*.5,r)){P.x+=dx*st;P.z+=dz*st;if(!P.bike){P.vx=dx*Math.hypot(ivx,ivz)*.8;P.vz=dz*Math.hypot(ivx,ivz)*.8}P.gs=an>0?1:-1;done=true;break}}}}
  CIRC_OFF=0;if(P.dk==null)circPushP(P.bike?.42:.3);if(S.hp<=0){S.hp=0;knockout()}
  for(const n of NP){if(P.dk!=null)break;if(n.down||n.g.visible===false||n.dp>2)continue;const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz);if(d<.7&&d>.01){const px=P.x+dx/d*(.7-d)*.6,pz=P.z+dz/d*(.7-d)*.6;if(freeAt(px,pz,r)){P.x=px;P.z=pz}}}
  FH=-1;const spd=Math.hypot(P.vx,P.vz);if(spd>.4){const ta=Math.atan2(P.vx,P.vz);P.face+=((((ta-P.face)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*(P.bike?6:14));P.bob+=dt*spd*2.2}
  if(blkWant){/* face whoever is attacking (else straight ahead of the camera) and hold the stamina regen */let tn=null,td=8;for(const n of NP){if(n.down||n.hidden||!n.g.visible||!n.aggro||n.tgt!=='P'||(n.int||null)!==(P.inside||null))continue;const d=Math.hypot(n.x-P.x,n.z-P.z);if(d<td){td=d;tn=n}}
    const tf=tn?Math.atan2(tn.x-P.x,tn.z-P.z):yaw+PI;P.face+=((((tf-P.face)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*12);P.pt=Math.max(P.pt,.5)}
  if(run&&P.drinkT<=0){S.sta-=(P.bike?9:15*prStaMul())*dt;P.pt=.6;if(S.sta<=0){S.sta=0;P.exh=1}}else{P.pt-=dt;if(P.pt<=0)S.sta=Math.min(staMax(),S.sta+26*(1+skv('sta'))*dt)}
  /* V174 support: P.sup = top of the object Danny stands on (0 = ground), P.jy = height above that. Walking off an edge keeps his height, so he drops. */
  if(P.dk==null&&!P.bike){if(Math.hypot(P.x-(P.sx??P.x),P.z-(P.sz??P.z))>2.5)P.sup=0;P.sx=P.x;P.sz=P.z;const ns=supTop(P.x,P.z);
    if(ns!==P.sup){const H=P.sup+P.jy;if(ns<P.sup){P.jy=H-ns;P.sup=ns}else if(H>=ns-.13){P.jy=Math.max(0,H-ns);P.sup=ns}}}else P.sup=0;
  if(P.jy>0||P.jv!==0){P.jv-=19*dt;P.jy+=P.jv*dt;if(P.jy<=0){P.jy=0;P.jv=0}}
  // punching
  P.pcd-=dt;P.punch-=dt;P.comboT-=dt;if(P.atk){P.atk.t+=dt;if(P.atk.t>=P.atk.d){P.atk=null;const q=PM.P;if(q&&q.lR){q.lR.rotation.z=0;if(q.hR)q.hR.rotation.x=0}}}if(fPress){fPress=0;if(!P.bike&&!carry)punch()}
  P.y=stairY();stairCheck();if(typeof c3StairCheck==='function')c3StairCheck();P.y=stairY()+(P.dk==null&&!P.bike?P.sup:0);
  PM.rotation.order='YXZ';PM.rotation.y=P.face;let ru=0;
  if(P.roll>0){ru=clamp((.45-P.roll)/.45,0,1);if(!P.rwas){P.rwas=1;rollDust(P.x,P.y,P.z,5,1);sfx('whiff');noise(.22,.1,1500)}}else if(P.rwas){P.rwas=0;rollDust(P.x,P.y,P.z,4,.6)}
  PM.DIVE=(ru>0&&P.diveT>TT)?1:0;
  if(ru>0&&P.diveT>TT){/* V148 the grenade dive is a face-down belly flop, not a somersault */const k=Math.min(1,ru*3.2),land=ru>.7?(ru-.7)/.3:0;PM.scale.y=1;PM.rotation.x=PI/2*k*(1-.08*land);PM.position.set(P.x,P.y+.28*k+.45*Math.sin(PI*Math.min(1,ru*1.4))*(1-land),P.z)}
  else if(ru>0){const e=ru*ru*(3-2*ru),th=e*TAU,sy=1-.38*Math.sin(PI*ru),h=.72*sy,lift=.34*Math.sin(PI*ru);
    PM.scale.y=sy;PM.rotation.x=th;
    const back=-h*Math.sin(th);PM.position.set(P.x+Math.sin(P.face)*back,P.y+P.jy+h*(1-Math.cos(th))+lift,P.z+Math.cos(P.face)*back);
    if(rnd()<.35)rollDust(P.x,P.y,P.z,1,.4)}
  else{PM.rotation.x=0;PM.scale.y=cr?.82:1;PM.position.set(P.x,P.y+P.jy+(P.bike?.12:0),P.z)}
  dustTick(dt);
  bikeM.visible=!!P.bike;ramC.visible=carry;lanternM.visible=!!(curStep()&&curStep().lantern);
  animP(PM,prSk()?0:spd,TT,P.bike?'bike':carry?'carry':P.atk?'':P.punch>0?'punch':(NP.some(n=>n.aggro&&n.tgt==='P'&&n.dp<5)?'guard':''));if(P.bike){if(!PM.P.kL)PM.P.lL.position.y=PM.P.lR.position.y=.88}prPose(dt);if(P.atk)atkPose(PM,P.atk.ty,P.atk.t/P.atk.d);else{PM.HPA=null;if(PM.P)fistSet(PM.P,null)}if(P.blk>.001&&!P.atk)blockPose(PM,P.blk,Math.max(0,P.blkHitT||0)/.22);try{snKnee()}catch(e){}
  if(ru>0){const q=PM.P,t=Math.sin(PI*Math.min(1,ru*1.15));q.lL.rotation.x=q.lR.rotation.x=-1.55*t;q.aL.rotation.x=q.aR.rotation.x=-2.3*t}
  prDribble(dt,spd,ru>0||cr||P.bike||carry||P.punch>0||P.jy>.05);
}
// roll dust puffs
const DUST=[];let DUSTG=null,DUSTM=null;
function rollDust(x,y,z,n,sc){if(!DUSTG){DUSTG=new THREE.SphereGeometry(1,8,6)}for(let i=0;i<n;i++){const m=new THREE.Mesh(DUSTG,new THREE.MeshBasicMaterial({color:0xcfc3a4,transparent:true,opacity:.5,depthWrite:false}));const a=rnd()*TAU;m.position.set(x+Math.cos(a)*.25,y+.08,z+Math.sin(a)*.25);m.scale.setScalar(.06*sc+.04);sc_add(m);DUST.push({m,vx:Math.cos(a)*.9*sc,vz:Math.sin(a)*.9*sc,t:0})}}
const sc_add=m=>sc.add(m);
function dustTick(dt){for(let i=DUST.length-1;i>=0;i--){const d=DUST[i];d.t+=dt;d.m.position.x+=d.vx*dt;d.m.position.z+=d.vz*dt;d.m.position.y+=.5*dt;d.m.scale.multiplyScalar(1+dt*3.2);d.m.material.opacity=Math.max(0,.5-d.t*1.1);if(d.t>.45){sc.remove(d.m);d.m.material.dispose();DUST.splice(i,1)}}}
// basketball pledge: dribble the ball while it's in hand
function prDribble(dt,spd,off){const b=PM.userData.ball;if(!b||!b.parent||S.prole!=='basketball'||!S.pledged)return;if(BBL.on){b.visible=false;return}b.visible=true;const rest=b.userData.rest||(b.userData.rest=b.position.clone());
  if(off||mode!=='play'){b.position.copy(rest);b.rotation.x=0;P.dbU=null;return}
  /* V361 the bounce phase is accumulated, not taken from the clock: before, phase = clock × rate, so any change in speed (walk → run → stop) made the ball jump to a
     new point in its bounce and look like it was spinning fast. The rate also eases toward its target so speed-ups and slow-downs are gradual. */
  const tgt=2.1+Math.min(spd,6.2)*.12;P.dbR=P.dbR==null?tgt:P.dbR+(tgt-P.dbR)*Math.min(1,dt*2.5);P.dbPh=((P.dbPh||0)+dt*P.dbR)%1;const u=P.dbPh,q=PM.P;
  q.aR.rotation.x=-.3-.62*(1-Math.cos(u*TAU))/2;q.aR.rotation.z=.06;
  PM.updateMatrixWorld(true);const H=q.hR.localToWorld(rest.clone()),fy=P.y+P.jy+.13,A=Math.max(.12,H.y-fy),y=fy+A*(1-(2*u-1)*(2*u-1));
  const lead=Math.min(spd,6)*.045,wx=H.x+Math.sin(P.face)*lead,wz=H.z+Math.cos(P.face)*lead;
  b.position.copy(q.hR.worldToLocal(V3(wx,y,wz)));b.rotation.x=TT*5;
  if(P.dbU!=null&&u<P.dbU){try{maBall(P.x,P.z,1)}catch(e){}}P.dbU=u}
let punchHint=0;
// V119 Danny's attack moves: left and right punches, palm strike, elbow strike, front kick and side kick, each a short wind-up/strike/recover
const ATK={club:{d:.52,m:1.4,r:2.8,push:.7},jabL:{d:.3,m:1,r:2.5},jabR:{d:.3,m:1,r:2.5},palm:{d:.36,m:1.05,r:2.4,push:.5},elbow:{d:.36,m:1.2,r:1.9},kickF:{d:.5,m:1.25,r:2.9,push:.6},kickS:{d:.52,m:1.3,r:3,push:1}};
function atkPick(d){const fin=P.comboT>0&&P.combo===2;if(fin)return rnd()<.5?'kickF':'kickS';const r=rnd();/* V389 the Caveman Pledge fights with his club and his feet only */if(isR('caveman')&&PM.userData.club)return r<.62?'club':r<.82?'kickF':'kickS';
  if(r<.12)return'kickF';if(r<.22)return'kickS';if(r<.36)return d<1.6?'elbow':'palm';if(r<.48)return'palm';P.hand=P.hand==='L'?'R':'L';return P.hand==='L'?'jabL':'jabR'}
function punch(){if(P.pcd>0||S.sta<5||P.blocking)return;let best=null,bd=9;const fx_=Math.sin(P.face),fz=Math.cos(P.face);
  for(const n of NP){if(n.down||n.ally||n.follow||n.actor||n.hidden||n.kid||n.mute||!n.g.visible||(n.int||null)!==(P.inside||null))continue;if(P.dk!=null&&Math.abs(P.y-terrH(n.x,n.z))>1.4)continue;const dx=n.x-P.x,dz=n.z-P.z,d=Math.hypot(dx,dz);if(d>2.5)continue;const sc_=d-(dx*fx_+dz*fz)/(d||1)*.7;if(sc_<bd){bd=sc_;best=n}}
  {const ty=atkPick(best?Math.hypot(best.x-P.x,best.z-P.z):9),A=ATK[ty];P.atk={ty,t:0,d:A.d};P.punch=A.d;P.pcd=A.d*.85+.04;S.sta-=ty[0]==='k'?8:5;P.pt=.5;if(best&&Math.hypot(best.x-P.x,best.z-P.z)>A.r)best=null;P.atkM=A}
  if(!best){const kid=NP.find(n=>n.kid&&!n.down&&n.dp<2.4);if(kid&&(kid.kidT||0)<TT){kid.kidT=TT+4;bubble(kid,pick(['Whoa! I\'m in high school, man!','Dude! Chill!','Not cool, college guy!']),2.2);kid.flee=2}}
  sfx('whiff');try{maWhoosh(P.atkM&&P.atkM.d>.4?.05:.035)}catch(e){}if(!best)return;P.face=Math.atan2(best.x-P.x,best.z-P.z);P.combo=P.comboT>0?P.combo+1:1;P.comboT=1;
  let dmg=clamp(10*LVM(S.lvl,best.lvl)*(S.bb==='tank'?1.2:1)*(1+skv('dmg'))*prPunchMul()*P.atkM.m*(P.atk&&P.atk.ty[0]==='k'&&skv('kick')>=1?1.15:1),2,60);if(P.atkM.push){const dx=best.x-P.x,dz=best.z-P.z,l=Math.hypot(dx,dz)||1,pu=P.atkM.push;if(freeAt(best.x+dx/l*pu,best.z+dz/l*pu,.32)){best.x+=dx/l*pu;best.z+=dz/l*pu}}if(P.combo>=3){dmg*=1.8;P.combo=0;best.stun=.8;const dx=best.x-P.x,dz=best.z-P.z,l=Math.hypot(dx,dz)||1;if(freeAt(best.x+dx/l*1.4,best.z+dz/l*1.4,.32)){best.x+=dx/l*1.4;best.z+=dz/l*1.4}big('COMBO!',500)}
  if(!punchHint){punchHint=1;toast('The level gap decides the damage. Red levels are stronger than you; green ones go down fast.',5200)}
  const unprov=!best.aggro&&!best.foe&&!best.def&&best.tgt!=='P';if(unprov&&!best.temp&&!best.auth)relAdd(best,-15);
  if(unprov&&!best.temp){if(best.auth)trouble(100);else{if(best.cl==='brothers')stand(best.named?-6:-3);else if(S.rep[best.cl]!=null)rep(best.cl,best.named?-6:-4);if(best===NN.dean)trouble(100);if(NP.some(m=>m.auth&&m.dp<26&&canSee(m,26)))trouble(35);NP.forEach(m=>{if(m.cl===best.cl&&m!==best&&!m.named&&!m.pledge&&(m.int||null)===(best.int||null)&&Math.hypot(m.x-best.x,m.z-best.z)<10&&(S.rep[m.cl]==null||S.rep[m.cl]<50)){m.aggro=1;m.tgt='P'}})}}
  P.lastHit=best;P.lastHitT=TT;try{voxHmph()}catch(e){}hitNPC(best,dmg,'P');if(best.auth&&!best.down){best.chase=1;best.aggro=0}}
function kartUpd(dt,f,s){const onT=Math.abs(trackR(P.x,P.z)-1)<.1,mx=onT?17:8;if(EV&&EV.start>0){f=0}
  if(f>0)P.kv+=12*dt*f;else if(f<0)P.kv+=f*(P.kv>0?20:8)*dt;else P.kv*=Math.pow(.6,dt);P.kv=clamp(P.kv,-4,mx);if(P.kv>mx)P.kv=lerp(P.kv,mx,dt*3);
  P.ka-=s*dt*2.3*clamp(P.kv/9,-1,1);const nx=P.x+Math.sin(P.ka)*P.kv*dt,nz=P.z+Math.cos(P.ka)*P.kv*dt;if(freeAt(nx,nz,.8)){P.x=nx;P.z=nz}else{P.kv*=-.3;sfx('hit')}
  P.face=P.ka;yaw+=((((P.ka+PI-yaw)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*3);PM.position.set(P.x,0,P.z);PM.rotation.set(0,P.ka,0);PM.scale.y=1;animP(PM,0,TT,'sit');kartM.visible=true;if(!PM.P.kL)PM.P.lL.position.y=PM.P.lR.position.y=.88;bikeM.visible=false}


// V172 block. blkHit(n): called from hitPlayer while Danny's guard is up. Returns true when the hit was absorbed (it costs stamina, no health);
// false when it gets through (from behind, or not enough stamina: the guard breaks and he takes the full hit).
function blkHit(n){const dx=n.x-P.x,dz=n.z-P.z,l=Math.hypot(dx,dz)||1;if((dx*Math.sin(P.face)+dz*Math.cos(P.face))/l<-.35)return false;
  const d=Math.max(1,Math.round(clamp(7*LVM(n.lvl,S.lvl)*(S.bb==='tank'?.85:1)*(n.robber?1.9:1),1,n.robber?50:40)*(1-Math.min(.6,skv('def'))))),cost=Math.round(clamp(d*1.5,5,45));
  if(S.sta>=cost){S.sta-=cost;P.pt=.8;P.blkHitT=.22;dmgNum(P.x,2.5,P.z,'BLOCKED  -'+cost+' stamina','#7fd8ff');try{tone(150,.09,'square',.07);noise(.07,.14,900)}catch(e){}
    P.vx-=dx/l*2.2;P.vz-=dz/l*2.2;return true}
  S.sta=0;P.blkBrk=1;P.blocking=0;P.blk=Math.min(P.blk,.5);dmgNum(P.x,2.9,P.z,'GUARD BROKEN','#ffb347');return false}
// Both forearms raised and crossed in an X in front of his face (right arm in front). b = 0..1 raise, fl = 0..1 recoil from a blocked hit.
function blockPose(g,b,fl){const p=g.P;if(!p||!p.aR||!p.eR||!p.aL||!p.eL)return;const e=b*b*(3-2*b);
  const set=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};
  set(p.aR,-1.9+fl*.18,-.7,-.5);set(p.eR,-.75,0,0);set(p.aL,-2.0+fl*.18,.75,.75);set(p.eL,-1.1,0,0);
  if(p.hR)set(p.hR,-.25,0,0);if(p.hL)set(p.hL,-.25,0,0);
  p.spine.rotation.x+=(.12-.1*fl)*e;if(p.head)p.head.rotation.x+=.1*e;p.chest.rotation.y+=-.08*fl*e}

// V119 strike poses on the skinned rig, laid over the normal animation. k runs 0..1: wind-up (to .3), strike (peak .4-.55), recover
// V91: closed fists while attacking. The hand's fingers are baked into the body mesh, so a skin-coloured fist block per hand bone is shown over them for the length of an attack (the palm strike keeps its striking hand open)
function fistFor(hb,s){if(hb.userData.fist)return hb.userData.fist;const m=new THREE.Mesh(roundBox(.1,.135,.125,.04,2),new THREE.MeshStandardMaterial({color:0xf1c9a5,roughness:.6}));m.position.set(-s*.025,-.15,.008);m.castShadow=true;m.visible=false;hb.add(m);return hb.userData.fist=m}
function fistSet(p,ty){if(!p)return;for(const s of[-1,1]){const hb=s<0?p.hL:p.hR;if(!hb)continue;const f=ty?fistFor(hb,s):hb.userData.fist;if(!f)continue;const on=!!ty&&!(ty==='palm'&&s>0)&&!p.fing;f.visible=on;if(on&&p.pal&&p.pal[0])f.material.color.setRGB(p.pal[0].x,p.pal[0].y,p.pal[0].z)}}
function atkPose(g,ty,k){const p=g.P;if(!p||!p.chest||!p.kL)return;k=clamp(k,0,1);g.HPA=ty;fistSet(p,ty);const sm=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
  const w=k<.3?sm(k/.3):1-sm((k-.3)/.15),st=k<.3?0:k<.45?sm((k-.3)/.15):1-sm((k-.55)/.45),rec=k>.55?1-sm((k-.55)/.45):1;
  const guard=(a,e,z)=>{a.rotation.x=-1.05*rec+a.rotation.x*(1-rec);e.rotation.x=-1.9*rec+e.rotation.x*(1-rec);a.rotation.z=z};
  if(ty==='jabR'||ty==='jabL'||ty==='palm'){const R=ty!=='jabL',a=R?p.aR:p.aL,e=R?p.eR:p.eL,o=R?p.aL:p.aR,oe=R?p.eL:p.eR,sg=R?1:-1;
    guard(o,oe,sg*-.12);a.rotation.x=-.55*w-1.55*st+a.rotation.x*(1-Math.max(w,st));e.rotation.x=-1.9*w-.08*st+e.rotation.x*(1-Math.max(w,st));a.rotation.z=sg*.12*(1-st);
    p.chest.rotation.y+=sg*(.28*w-.5*st);p.spine.rotation.x+=.1*st;p.hips.rotation.y+=sg*-.15*st;
    if(ty==='palm'&&p.hR){p.hR.rotation.x=-1.2*st;p.spine.rotation.x+=.08*st}}
  else if(ty==='club'){/* V389 club swing: raised back over the shoulder, then chopped down and across */guard(p.aL,p.eL,-.15);const a=p.aR,e=p.eR,up=k<.35?sm(k/.35):1-sm((k-.35)/.2),dn=k<.35?0:k<.55?sm((k-.35)/.2):1-sm((k-.6)/.4);
    a.rotation.x=-2.7*up-.55*dn+a.rotation.x*(1-Math.max(up,dn));a.rotation.z=.35*up+.05*dn;e.rotation.x=-1.2*up-.15*dn+e.rotation.x*(1-Math.max(up,dn));if(p.hR)p.hR.rotation.x=.4*up-.6*dn;p.chest.rotation.y+=.45*up-.55*dn;p.spine.rotation.x+=-.12*up+.3*dn;p.hips.rotation.y+=-.2*dn}
  else if(ty==='elbow'){guard(p.aL,p.eL,-.12);const a=p.aR,e=p.eR;a.rotation.x=-.5*w-1.15*st+a.rotation.x*(1-Math.max(w,st));a.rotation.z=.25*w+1.0*st;e.rotation.x=-2.3*Math.max(w,st)+e.rotation.x*(1-Math.max(w,st));
    p.chest.rotation.y+=.35*w-.85*st;p.hips.rotation.y+=-.25*st}
  else{const side=ty==='kickS',ch=k<.3?sm(k/.3):k<.7?1:1-sm((k-.7)/.3),ext=k<.3?0:k<.42?sm((k-.3)/.12):k<.6?1:1-sm((k-.6)/.25);
    guard(p.aL,p.eL,-.2);guard(p.aR,p.eR,.2);
    if(!side){p.lR.rotation.x=-1.45*ch;p.kR.rotation.x=1.7*ch*(1-ext)+.05*ext;p.fR.rotation.x=.5*ext;p.spine.rotation.x-=.22*ch;p.kL.rotation.x=.18*ch}
    else{p.hips.rotation.y+=-1.1*ch;p.lR.rotation.x=-1.1*ch*(1-ext)-.25*ext;p.lR.rotation.z=1.25*ext;p.kR.rotation.x=1.8*ch*(1-ext)+.05*ext;p.spine.rotation.z+=-.42*ext;p.chest.rotation.y+=.6*ch;p.kL.rotation.x=.22*ch}}}
