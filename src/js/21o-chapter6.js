// ================================================================ V131 CHAPTER 6 · THE COALITION (the Lantern Walk finale moves to chapter 7)
// After Hughes the Greek Alliance falls apart. ΑΣΡ, ΔΤΩ and ΓΓΗ merge into one brotherhood, Delta Gamma Rho (ΔΓΡ). A friendly new brother,
// Vincent Cross, turns it against its three founding presidents with help from outside: a very old wizard who wants one thing, an invitation
// to the biggest party of the year.
//  c6three      Three Houses               meet the presidents, the announcement, new shirts, new banners, the first gathering
//  c6perfect    The Perfect Brother        Vincent's cookout, introductions, recruitment, a disagreement settled a little too well
//  c6establish  Establishing the Brotherhood  three houses, the party, the activities fair, a meeting that turns on itself
//  c6favorite   The Brotherhood's Favorite leadership talk, the same complaint everywhere, Grant, the presidents, Vincent
//  c6uprising   The Brotherhood Uprising   the emergency meeting, the presidents, the holdouts, the organizers, who is behind it
//  c6down       The Presidents Go Down     Grant is gone, temporary leadership, the errands, unofficial orders, Vincent's room
//  c6ingredient The Final Ingredient       follow Vincent, the hideout, the magic, the deal, the frog
// Reuses chapter 4/5 helpers: c4Pup/c4Dup/c4Off/c4CamOn/c4Shot/c4Fade, c5List/c5Talk/c5Pres/c5Greek/c5AP/c5InAsr/c5WarStep, c5Anim.
const C6={T:0,ban:{},banM:{},crowds:[],fx:[],leash:null,tail:null,frog:null,hut:null,vin:null};
const C6IDS=['c6three','c6perfect','c6establish','c6favorite','c6uprising','c6down','c6ingredient'];
const c6S=()=>S.c6||(S.c6={ban:{},shirts:0});
const c6Ban=id=>!!(S.c6&&S.c6.ban&&S.c6.ban[id])&&!c7Restored();   // V132: the coalition banners come down at the end of chapter 7

// ---------------------------------------------------------------- the Lantern Walk becomes chapter 7
for(const m of M)if(m.ch===6)m.ch=7;
CHN[6]='The Coalition';CHN[7]='The Lantern Walk';CHN[8]='Epilogue';
CHT[7]=CHT[6];
CHT[6]='Hughes is over. The Greek Alliance is not far behind it.\n\nThree houses refuse to let the power vacuum go to waste. Three Houses. One Coalition. No One Above Us.';
XPM[7]=XPM[6];XPM[6]=140;
HOUSE.dgr={L:'ΔΓΡ',shirt:0x1b2e57,lc:'#e2b64c'};
const DG={house:'dgr',shirt:0x1b2e57,sleeve:0x1b2e57};
const C6HOUSES=[['asr','Alpha Sigma Rho','Grant Ashby'],['kto','Delta Tau Omega','Derek Vance'],['gwz','Gamma Gamma Eta','Silas Okoro']];
const C6QUAD=[286,302],C6FAIR=[292,286],C6FIRE=[121.5,77.5],C6RAM=[56.5,30.4];
const C6HUT=[150,1125];   // the hideout in the Lake District woods, open side facing -z
NOTREE.push([C6HUT[0]-9,C6HUT[1]-11,C6HUT[0]+9,C6HUT[1]+8]);   // a clearing for the hideout (trees are planted after all files load)
const C6PATH=[[70,1046],[76,1058,1],[90,1066],[104,1074,1],[116,1088],[126,1100,1],[138,1110],[146,1117]];

// ---------------------------------------------------------------- small helpers
const c6Lawn=(id,da,out)=>{const b=B.find(b=>b.id===id);return c3Free(...fpos(b,b.face,b.da+da,out))};
const c6Face=(id,x,z)=>{const b=B.find(b=>b.id===id),[fx,fz]=fpos(b,b.face,b.da,40);return Math.atan2(fx-x,fz-z)};
const c6Door=id=>{const b=B.find(b=>b.id===id);return fpos(b,b.face,b.da,4)};
const c6Pres=(nm,x,z,a,o={})=>nm==='Grant Ashby'?c4Dup('grant',x,z,a,Object.assign({pup:1},o)):c5Pres(nm,x,z,a,Object.assign({pup:1},o));
function c6Vin(x,z,a,o={}){return c4Pup('brothers',x,z,a,Object.assign({tag:'c6',name:'Vincent Cross',title:'ΔΓΡ Brother',lvl:6,hair:0x1a1410,skin:SKIN[1],pants:0x26262c},DG,o))}
function c6Bro(x,z,a,o={}){return c5Greek(x,z,a,o.house||'dgr',Object.assign({armor:false,pup:1,tag:'c6',lvl:5},o.house?{}:DG,o))}
async function c6Lines(L){for(const l of L){if(typeof l==='number'){await c4Wt(l);continue}if(typeof l==='function'){await l();continue}const[n,t,d]=l;if(n===DANNY){await c4DanSay(t,d||2.8);continue}if(d){c1Say(n,t,d);await c4Wt(d);continue}await c1Line(n,t)}}
function c6Crowd(on,spots,k,sh){if(!on){for(const C of C6.crowds)sc.remove(C.g);C6.crowds=[];return null}const C=c1Crowd(spots,{k,SH:sh||[0x1b2e57,0x1b2e57,0x24386a],PA:[0x1d1f24,0x2e3d5c,0x3a3a40,0x6a5a44],fem:.15});C.data.forEach(d=>{d.y=terrH(d.x,d.z);d.amp=.03});sc.add(C.g);C6.crowds.push(C);return C}
function c6Ring(cx,cz,r0,n,rows=2,arc=TAU,a0=0){const s=[];for(let k=0;k<rows;k++){const R=r0+k*1.3,m=n+k*4;for(let i=0;i<m;i++){const a=a0+i/m*arc;const x=cx+Math.cos(a)*R,z=cz+Math.sin(a)*R;if(freeAt(x,z,.3))s.push([x,z,Math.atan2(cx-x,cz-z)])}}return s}
function c6Rows(cx,cz,a,w,rows,gap=1.1){const s=[],ux=Math.cos(a),uz=-Math.sin(a),fx=Math.sin(a),fz=Math.cos(a);for(let r=0;r<rows;r++)for(let i=0;i<w;i++){const o=(i-(w-1)/2)*gap+(r%2)*.4,x=cx+ux*o-fx*r*1.1,z=cz+uz*o-fz*r*1.1;if(freeAt(x,z,.3))s.push([x,z,a])}return s}
// purple magic: a spray of small glowing beads (meshes, not point sprites) and a beam
function c6Spark(x,y,z,col=0xb07aff,n=26){const geo=GC.c6sp||(GC.c6sp=new THREE.SphereGeometry(.05,6,4)),mat=GC['c6spm'+col]||(GC['c6spm'+col]=new THREE.MeshBasicMaterial({color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  const L=[];for(let i=0;i<n;i++){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.userData.noMerge=1;sc.add(m);const u=rnd()*2-1,a=rnd()*TAU,s=Math.sqrt(1-u*u),sp=1.4+rnd()*2.4;L.push([m,[s*Math.cos(a)*sp,u*sp+1,s*Math.sin(a)*sp]])}
  let t=0;c5Anim(dt=>{t+=dt;for(const[m,v]of L){m.position.x+=v[0]*dt;m.position.y+=v[1]*dt;m.position.z+=v[2]*dt;v[1]-=2.4*dt;m.scale.setScalar(Math.max(.01,1-t/1.1))}if(t>1.1){for(const[m]of L)sc.remove(m);return 1}});tone(880+rnd()*400,.25,'sine',.05);tone(1320,.18,'triangle',.03,.08)}
function c6Beam(a,b,col=0xb07aff,dur=.7){const d=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]),m=new THREE.Mesh(GC.c6beam||(GC.c6beam=new THREE.CylinderGeometry(.05,.05,1,8,1,true)),GC['c6bm'+col]||(GC['c6bm'+col]=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending})));
  m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);m.scale.y=d;m.lookAt(b[0],b[1],b[2]);m.rotateX(PI/2);m.userData.noMerge=1;sc.add(m);let t=0;c5Anim(dt=>{t+=dt;m.scale.x=m.scale.z=1+Math.sin(t*40)*.4;if(t>dur){sc.remove(m);return 1}});noise(.5,.08,2400);tone(240,.6,'sawtooth',.04)}
function c6Poof(x,y,z,col=0xdcd4ff){const s=new THREE.Mesh(GC.c3puff||(GC.c3puff=new THREE.SphereGeometry(1,12,8)),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85,depthWrite:false}));s.position.set(x,y,z);s.scale.setScalar(.2);s.userData.noMerge=1;sc.add(s);let t=0;
  c5Anim(dt=>{t+=dt;s.scale.setScalar(.2+t*2.2);s.material.opacity=Math.max(0,.85-t*1.1);if(t>.8){sc.remove(s);s.material.dispose();return 1}});noise(.25,.25,600)}
// a strange flicker: the purple glint someone gets in their eyes, rendered as a small spark at the head
const c6Glint=n=>{if(c4Live(n))c6Spark(n.x,(n.y||terrH(n.x,n.z))+1.65,n.z,0xb07aff,8)};

// ---------------------------------------------------------------- ΔΓΡ banners on the three founding houses
function c6BanMesh(id){if(C6.banM[id])return C6.banM[id];const b=B.find(b=>b.id===id);if(!b||!b.face)return null;const m=signMesh('ΔΓΡ · THREE HOUSES · ONE COALITION',8.6,1.1,'#1b2e57','#e2b64c');const[x,z]=fpos(b,b.face,b.da,3.6);m.position.set(x,terrH(x,z)+(id==='asr'?4.4:4.9),z);m.rotation.y=fry(b.face);m.userData.noMerge=1;m.visible=false;sc.add(m);C6.banM[id]=m;return m}
function c6BanApply(){for(const[id]of C6HOUSES){const on=c6Ban(id),m=c6BanMesh(id);if(m)m.visible=on;const g=C4.frM&&C4.frM[id];if(g&&g.children[2])g.children[2].visible=!on;if(id==='asr'&&on&&C5.ban)c5Banner(0)}}
// raise one banner: the old one drops, the new one unrolls upward
function c6BanRaise(id){const S6=c6S();S6.ban[id]=1;const m=c6BanMesh(id);if(!m)return;const y1=m.position.y;m.visible=true;m.scale.y=.02;m.position.y=y1+.5;if(id==='asr'&&C5.ban){const o=C5.ban;let t=0;c5Anim(dt=>{t+=dt;o.position.y-=dt*4;o.rotation.z+=dt;if(t>.9){c5Banner(0);return 1}})}
  const g=C4.frM&&C4.frM[id];if(g&&g.children[2]){const o=g.children[2],y0=o.position.y;let t=0;c5Anim(dt=>{t+=dt;o.position.y=y0-t*3;if(t>.8){o.visible=false;o.position.y=y0;return 1}})}
  let t=0;c5Anim(dt=>{t+=dt;const k=Math.min(1,t/1.1);m.scale.y=Math.max(.02,k);m.position.y=y1+.5*(1-k);return k>=1});sfx('ok')}

// ---------------------------------------------------------------- the wizard, the frog, the hideout
function c6Wizard(x,z,a,o={}){const n=c4Pup('townies',x,z,a,Object.assign({tag:'c6wiz',name:'The Wizard',title:'Very Old · Very Purple',lvl:99,shirt:0x5b2a86,sleeve:0x5b2a86,pants:0x5b2a86,hair:0xe8e8e8,skin:SKIN[0],v:1.6},o));if(!o.plain)c6Robe(n,1);return n}
function c6Robe(n,on){const g=n.g;if(!g)return;if(g.userData.c6robe){g.userData.c6robe.forEach(m=>m.parent&&m.parent.remove(m));g.userData.c6robe=null}if(!on)return;const P_=g.P||{},pur=mt(0x5b2a86,.7),add=(m,par)=>{m.userData.noMerge=1;(par||g).add(m);return m},L=[];
  const hat=add(new THREE.Mesh(GC.c6hat||(GC.c6hat=new THREE.ConeGeometry(.24,.7,12)),pur),P_.head||g);hat.position.set(0,P_.head?.68:2.3,0);L.push(hat);
  const brim=add(new THREE.Mesh(GC.c6brim||(GC.c6brim=new THREE.CylinderGeometry(.36,.36,.03,16)),pur),P_.head||g);brim.position.set(0,P_.head?.35:2.0,0);L.push(brim);
  for(let i=0;i<5;i++){const st=add(new THREE.Mesh(GC.c6star||(GC.c6star=new THREE.OctahedronGeometry(.035)),bm(0xffd84a)),hat);st.position.set(Math.cos(i*1.3)*.13,-.2+i*.09,Math.sin(i*1.3)*.13);L.push(st)}
  const beard=add(new THREE.Mesh(GC.c6beard||(GC.c6beard=new THREE.ConeGeometry(.16,.55,10)),mt(0xeeeeee,.9)),P_.head||g);beard.rotation.x=PI;beard.position.set(0,P_.head?-.08:1.45,.13);L.push(beard);
  const robe=add(new THREE.Mesh(GC.c6robeG||(GC.c6robeG=new THREE.CylinderGeometry(.3,.5,1.0,14,1,true)),new THREE.MeshStandardMaterial({color:0x5b2a86,roughness:.7,side:THREE.DoubleSide})));robe.position.set(0,.55,0);L.push(robe);
  const staff=add(new THREE.Mesh(GC.c6staff||(GC.c6staff=new THREE.CylinderGeometry(.03,.035,1.7,6)),mt(0x5a3a22,.8)));staff.position.set(.42,.85,.12);L.push(staff);
  const orb=add(new THREE.Mesh(GC.c6orb||(GC.c6orb=new THREE.SphereGeometry(.09,12,8)),bm(0xc9a4ff)),staff);orb.position.y=.9;L.push(orb);g.userData.c6robe=L;n.c6orb=orb}
const c6Orb=n=>{const o=n&&n.c6orb;if(!o)return[n.x,1.8,n.z];const v=new THREE.Vector3();o.getWorldPosition(v);return[v.x,v.y,v.z]};
function c6FrogMesh(){const g=new THREE.Group(),G=mt(0x4fa83a,.6),D=mt(0x2f7a26,.6),W=mt(0xf6f2e8,.4),K=bm(0x111111);const add=(geo,m,x,y,z,s)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(s)o.scale.set(...s);o.userData.noMerge=1;o.castShadow=true;g.add(o);return o};
  const sp=GC.c6fs||(GC.c6fs=new THREE.SphereGeometry(1,12,9));add(sp,G,0,.1,0,[.16,.11,.19]);add(sp,G,0,.17,.12,[.12,.08,.1]);for(const s of[-1,1]){add(sp,W,s*.06,.25,.13,[.04,.04,.04]);add(sp,K,s*.06,.26,.165,[.018,.018,.012]);add(sp,D,s*.13,.05,-.06,[.07,.05,.11]);add(sp,D,s*.08,.03,.12,[.035,.03,.06])}
  add(GC.c6tie||(GC.c6tie=new THREE.BoxGeometry(.04,.06,.01)),mt(0x7d1f2c,.6),0,.1,.2);g.userData.noMerge=1;return g}
// Grant as a frog: a puppet whose body is hidden and replaced by the frog (so he can still talk in bubbles)
function c6Frog(x,z,a,y){const n=c4Pup('brothers',x,z,a,{tag:'c6frog',name:'Grant Ashby',title:'ΔΓΡ Founder · currently a frog',lvl:9,y,st:'sit'});if(n.g){n.g.children.forEach(c=>{if(c!==n.bub)c.visible=false});const f=c6FrogMesh();n.g.add(f);n.frogM=f;n.pup.frozen=1}C6.frog=n;return n}
function c6FrogSay(n,t,d=2.4){if(!c4Live(n))return;bubble(n,t,d);if(n.bub)n.bub.position.y=.9;c1Sub('Grant Ashby',t)}
function c6Hut(on){if(C6.hut){sc.remove(C6.hut.g);C6.hut=null}if(!on)return;const[cx,cz]=C6HUT,y=terrH(cx,cz),g=new THREE.Group();g.userData.noMerge=1;g.position.set(cx,y,cz);const st=mt(0xb4ada0,.95),wd=mt(0x6a4a30,.85),A=(geo,m,x,yy,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,yy,z);o.castShadow=true;o.receiveShadow=true;o.userData.noMerge=1;g.add(o);return o};
  A(bgeo(7.4,.12,6.4),mt(0x7a7266,.95),0,.06,1.2);A(bgeo(7.4,3.2,.4),st,0,1.6,4.2);A(bgeo(.4,3.2,6.4),st,-3.5,1.6,1.2);A(bgeo(.4,3.2,6.4),st,3.5,1.6,1.2);const roof=A(bgeo(8,.25,7.2),wd,0,3.35,1.2);roof.rotation.x=-.08;
  for(const x of[-3.5,3.5])A(bgeo(.3,3.2,.3),wd,x,1.6,-1.9);
  // the rune circle on the floor
  const rune=new THREE.Mesh(new THREE.RingGeometry(1.1,1.35,40),new THREE.MeshBasicMaterial({color:0xb07aff,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false}));rune.rotation.x=-PI/2;rune.position.set(0,.13,1.6);rune.userData.noMerge=1;g.add(rune);
  const rm=GC.c6runeTex||(GC.c6runeTex=ctex(256,256,(q,w,h)=>{q.clearRect(0,0,w,h);q.strokeStyle='#c9a4ff';q.lineWidth=5;q.beginPath();for(let i=0;i<5;i++){const a=-PI/2+i*4*PI/5;q[i?'lineTo':'moveTo'](128+Math.cos(a)*100,128+Math.sin(a)*100)}q.closePath();q.stroke();q.font='bold 26px serif';q.fillStyle='#e0ccff';for(let i=0;i<8;i++){const a=i/8*TAU;q.fillText('ᚠᚢᚦᚨᚱᚲᚷᚹ'[i],128+Math.cos(a)*112-8,128+Math.sin(a)*112+8)}}));
  const star=new THREE.Mesh(new THREE.PlaneGeometry(2.5,2.5),new THREE.MeshBasicMaterial({map:rm,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));star.rotation.x=-PI/2;star.position.set(0,.14,1.6);star.userData.noMerge=1;g.add(star);
  // shelves of books, a crystal ball, a cauldron, candles, floating books
  const shelf=A(bgeo(.5,2.2,2.6),wd,-3.0,1.1,2.2),bkc=[0x7a2a2a,0x2a4a7a,0x3f6a3a,0x6a5a2a,0x4a2a6a];for(let r=0;r<3;r++)for(let i=0;i<7;i++)A(bgeo(.3,.38,.12),mt(bkc[(r*7+i)%5],.7),-2.82,.45+r*.7,1.1+i*.33);
  const ball=A(GC.c6ball||(GC.c6ball=new THREE.SphereGeometry(.28,16,12)),new THREE.MeshBasicMaterial({color:0x9ad8ff,transparent:true,opacity:.75}),2.4,1.35,3.2);A(new THREE.CylinderGeometry(.18,.28,1.05,10),wd,2.4,.6,3.2);
  const caul=A(new THREE.SphereGeometry(.55,14,10,0,TAU,PI*.35,PI*.65),mt(0x1a1a1c,.5,.6),-1.6,.62,3.4);const brew=A(new THREE.CircleGeometry(.47,16),new THREE.MeshBasicMaterial({color:0x6aff5a,transparent:true,opacity:.85}),-1.6,.82,3.4);brew.rotation.x=-PI/2;
  for(const[x,z]of[[-2.6,3.7],[2.9,2.2],[1.2,3.8],[-.8,3.8]]){A(new THREE.CylinderGeometry(.04,.04,.25,6),mt(0xf2ead6,.6),x,.26,z);A(GC.c6fl2||(GC.c6fl2=new THREE.SphereGeometry(.035,6,4)),bm(0xffc86a),x,.43,z)}
  const books=[];for(let i=0;i<4;i++){const bk=A(bgeo(.32,.06,.24),mt(bkc[i],.7),-.8+i*.55,1.9+i%2*.3,2.4);books.push(bk)}
  for(const[x,z]of[[-2,0],[2,0],[0,3]]){A(GC.c6lan||(GC.c6lan=new THREE.SphereGeometry(.13,10,8)),bm(0xffc86a),x,2.7,z);A(bgeo(.02,.5,.02),mt(0x222222,.5),x,3,z)}
  const tarp=A(bgeo(5.2,1.7,.12),mt(0x5a4a3a,.95),0,.9,2.7);tarp.visible=false;
  sc.add(g);C6.hut={g,books,ball,brew,rune,tarp,star,t:0}}
function c6HutUpd(dt){const H=C6.hut;if(!H)return;H.t+=dt;H.books.forEach((b,i)=>{b.position.y=1.9+i%2*.3+Math.sin(H.t*1.6+i)*.12;b.rotation.y+=dt*(.4+i*.1);b.rotation.z=Math.sin(H.t+i)*.25});H.ball.material.opacity=.6+Math.sin(H.t*3)*.15;H.brew.material.color.setHSL(.3+Math.sin(H.t)*.05,1,.55+Math.sin(H.t*5)*.05);H.star.rotation.z+=dt*.2;H.rune.material.opacity=.55+Math.sin(H.t*2)*.2}
const c6HutP=(dx,dz)=>[C6HUT[0]+dx,C6HUT[1]+dz];
// Derek on the wizard's leash: shirtless, a black leather mask, a chain to the wizard's hand
function c6LeashDerek(x,z,a,wiz){const sk=SKIN[3]||0x8a5a3a,n=c5Pres('Derek Vance',x,z,a,{tag:'c6wiz',pup:1,shirt:sk,sleeve:sk,pants:0x121214,title:'The Wizard\'s Familiar',noLetters:1,house:null});const h=n.g&&n.g.P&&n.g.P.head;
  if(h){const mask=new THREE.Mesh(GC.c6mask||(GC.c6mask=new THREE.SphereGeometry(.205,14,10)),mt(0x0d0d0f,.25,.4));mask.scale.set(1.06,1.08,1.08);mask.position.set(0,.18,0);mask.userData.noMerge=1;h.add(mask);const zip=new THREE.Mesh(bgeo(.015,.16,.01),mt(0xcfcfcf,.3,.8));zip.position.set(0,.12,.225);h.add(zip);for(const s of[-1,1]){const e=new THREE.Mesh(bgeo(.05,.018,.01),bm(0xeeeeee));e.position.set(s*.07,.22,.218);h.add(e)}}
  if(n.g){const col=new THREE.Mesh(GC.c6col||(GC.c6col=new THREE.TorusGeometry(.1,.025,6,14)),mt(0x111111,.3,.5));col.rotation.x=PI/2;col.position.set(0,1.47,0);n.g.add(col)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x222222}));line.frustumCulled=false;line.userData.noMerge=1;sc.add(line);C6.leash={line,a:wiz,b:n};return n}
function c6LeashUpd(){const L=C6.leash;if(!L)return;if(!c4Live(L.a)||!c4Live(L.b)){sc.remove(L.line);C6.leash=null;return}const p=L.line.geometry.attributes.position.array,[ax,ay,az]=c6Orb(L.a);p[0]=L.a.x+Math.cos(L.a.g.rotation.y)*-.3;p[1]=1.15+(L.a.y||0);p[2]=L.a.z-Math.sin(L.a.g.rotation.y)*-.3;p[3]=L.b.x;p[4]=(L.b.y||0)+1.47;p[5]=L.b.z;L.line.geometry.attributes.position.needsUpdate=true}
// tied to a chair and gagged
function c6Tie(n){if(!n||!n.g||!n.pup)return;n.pup.st='sit';n.pup.arms=.55;const rope=new THREE.Mesh(GC.c6rope||(GC.c6rope=new THREE.TorusGeometry(.27,.035,6,16)),mt(0x9a7a4a,.9));rope.rotation.x=PI/2;rope.position.set(0,.95,0);rope.userData.noMerge=1;n.g.add(rope);
  const h=n.g.P&&n.g.P.head;if(h){const gag=new THREE.Mesh(bgeo(.44,.06,.44),mt(0xeeeeee,.8));gag.position.set(0,.08,0);h.add(gag)}}
function c6Chair(x,z,a){return c4Group('c6chair'+x.toFixed(1),1,g=>{const W=mt(0x4a3626,.8);c4M(bgeo(.5,.06,.5),W,x,.46,z,g);c4M(bgeo(.5,.6,.06),W,x-Math.sin(a)*.25,.8,z-Math.cos(a)*.25,g).rotation.y=a;for(const sx of[-.22,.22])for(const sz of[-.22,.22])c4M(bgeo(.05,.46,.05),W,x+sx,.23,z+sz,g)})}

// ---------------------------------------------------------------- props for the events
function c6Table(name,x,z,a,sign){return c4Group(name,1,g=>{const y=terrH(x,z);const t=c4M(bgeo(2.2,.06,.8),mt(0xf2f2ee,.6),x,y+.78,z,g);t.rotation.y=a;const cl=c4M(bgeo(2.24,.7,.82),mt(0x1b2e57,.7),x,y+.4,z,g);cl.rotation.y=a;
  if(sign){const s=signMesh(sign,2.4,.6,'#1b2e57','#e2b64c');s.position.set(x-Math.sin(a)*.5,y+1.8,z-Math.cos(a)*.5);s.rotation.y=a;g.add(s);for(const k of[-1.1,1.1])c4M(bgeo(.05,1.8,.05),0xcfcfcf,x-Math.sin(a)*.5+Math.cos(a)*k,y+.9,z-Math.cos(a)*.5-Math.sin(a)*k,g)}})}
function c6Stage(on){if(!on){c4Group('c6stage',0);return}c4Group('c6stage',1,g=>{const[cx,cz]=C6RAM,y=terrH(cx,cz-4);c4M(bgeo(6,.4,2.4),mt(0x2a2a30,.7),cx,y+.2,cz-4,g);const s=signMesh('DELTA GAMMA RHO · ΔΓΡ',6,1.1,'#1b2e57','#e2b64c');s.position.set(cx,y+3.4,cz-5.1);g.add(s);for(const k of[-2.9,2.9])c4M(bgeo(.1,3.6,.1),0xcfcfcf,cx+k,y+1.8,cz-5.1,g)});const g=C4.props.c6stage;if(g)g.visible=true}
function c6Party(on){if(!on){c4Group('c6party',0);return}c4Group('c6party',1,g=>{const x=124,z=80.5,y=terrH(x,z);c4M(bgeo(2,1,.9),mt(0x1a1a1c,.4,.3),x,y+.5,z,g);for(const s of[-1,1])c4M(bgeo(.5,1.3,.5),mt(0x111111,.5),x+s*1.4,y+.65,z,g);const s=signMesh('ΔΓΡ',1.6,.5,'#1b2e57','#e2b64c');s.position.set(x,y+1.4,z+.46);g.add(s)});const g=C4.props.c6party;if(g)g.visible=true}

// ---------------------------------------------------------------- the stealth tail: stay close enough not to lose him, far enough (and out of his eyes) when he stops and looks back
const c6AngD=(a,b)=>Math.abs(((a-b)%TAU+TAU*1.5)%TAU-PI);
function c6TailStep(){return{t:'cond',lab:()=>{const T=C6.tail;return'Follow Vincent without being noticed'+(T?` · ${Math.round(T.d||0)} m`+(T.pause>0?' · HE\'S LOOKING BACK':T.d>34?' · you\'re losing him':'')+` · hold C to crouch`:'')},ok:()=>!!(C6.tail&&C6.tail.done),
  goal:()=>{const v=C6.tail&&C6.tail.v;return v&&c4Live(v)?[v.x,v.z]:C6PATH[0]},
  start:()=>{c4At(22.4);const[x0,z0]=C6PATH[0];goOut(70,1031);P.face=0;c4Off('c6tail');const v=c6Vin(x0,z0,0,{tag:'c6tail',v:2.2});C6.tail={v,i:1,pause:0,d:15,sus:0,done:0};toast('Vincent is heading into the Lake District woods. Keep up, stay out of sight.',4200)},
  tick:dt=>{const T=C6.tail;if(!T||T.done)return;const v=T.v;if(!c4Live(v)){T.done=1;return}T.d=Math.hypot(P.x-v.x,P.z-v.z);const crouch=K.KeyC||toggles.KeyC,rng=crouch?7:13.5;
    c1Hud(`TAILING VINCENT · ${Math.round(T.d)} m`+(T.pause>0?' · HE\'S LOOKING BACK':'')+(crouch?' · crouched':''));
    if(T.pause>0){T.pause-=dt;const toP=Math.atan2(P.x-v.x,P.z-v.z);if(T.d<rng&&c6AngD(v.pup.face,toP)<.95){T.sus++;bubble(v,pick(['…Hello?','Is someone there?','Danny?']),1.8);sfx('bad');
        const[px,pz]=C6PATH[Math.max(0,T.i-2)];fadeTo(()=>{P.x=px;P.z=pz-4;P.y=terrH(P.x,P.z)});toast('He almost saw you. Back off and keep further away when he stops.',3200);T.pause=.6}
      if(T.pause<=0){v.pup.look=null}return}
    if(T.d<4.5){bubble(v,'Huh?',1.2);T.pause=1.6;v.pup.look=[P.x,P.z];return}
    if(T.d>38){c4To(v,v.x,v.z);return}
    const w=C6PATH[T.i];c4To(v,w[0],w[1],2.2);if(Math.hypot(v.x-w[0],v.z-w[1])<.5){if(w[2]){T.pause=2.6;const pv=C6PATH[T.i-1];c4Face(v,Math.atan2(pv[0]-v.x,pv[1]-v.z))}T.i++;if(T.i>=C6PATH.length){T.done=1;c1Hud(null)}}},
  done:()=>{c1Hud(null)}}}

// ---------------------------------------------------------------- hooks
function c6Prompts(add){if(!AM||!C6IDS.includes(AM.m.id))return;const st=curStep();if(!st||!st.c5items)return;const d=c5S().d;
  for(const it of st.c5items){if(d[it.k]||it.busy||(it.need&&!it.need()))continue;const p=c5At(it.at());if(!p||(p.int||null)!==(P.inside||null))continue;add(p.x,p.z,it.r||2.5,it.act,()=>c5Do(it),0)}}
function c6CleanAll(){c6Crowd(0);for(const k of['c6stage','c6party','c6cook','c6recruit','c6fair','c6table','c6ufix'])c4Group(k,0);for(const k in C4.props)if(/^c6chair/.test(k))c4Group(k,0);c6Hut(0);if(C6.leash){sc.remove(C6.leash.line);C6.leash=null}C6.tail=null;
  for(let i=C5.fires.length-1;i>=0;i--)if(C5.fires[i].tag==='c6')c5FireOff(C5.fires[i]);if(PM&&PM.userData.c6frog){PM.remove(PM.userData.c6frog);PM.userData.c6frog=null}}
function c6Tick(dt){if(mode==='title'||mode==='loading')return;c6LeashUpd();c6HutUpd(dt);for(const C of C6.crowds)c1CrowdUpd(C,TT);
  if((C6.T-=dt)>0)return;C6.T=1.5;if(S.ch>=6)c6BanApply();
  if(!CINE&&mode==='play'&&(!AM||!C6IDS.includes(AM.m.id)&&!C7IDS.includes(AM.m.id)&&!C8IDS.includes(AM.m.id)&&!C9IDS.includes(AM.m.id)&&!C10IDS.includes(AM.m.id))&&TT-C4.chainT>8&&(C6.crowds.length||C6.hut||C6.leash))c6CleanAll()}
function c6Migrate(d){if(!d)return;if(S.ch>=7)for(const id of C6IDS)S.done[id]=1;setTimeout(()=>{try{if(!AM||!C6IDS.includes(AM.m.id))c6CleanAll();c6BanApply()}catch(e){console.warn('c6Migrate',e)}},8)}
