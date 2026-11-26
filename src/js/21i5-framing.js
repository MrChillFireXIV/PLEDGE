// ================================================================ V401 Framing, animated (was one text card): the anonymous call from the payphone outside Hank's Market,
// police cruisers and tape at three houses on Greek Row that night, Detective Ruiz holding up a bag on the ΓΩΖ steps the next morning in front of
// the press, and the Harrowgate Herald front page spinning in with her photo under the headline SNOWED.
function c3PayphoneMesh(){const g=new THREE.Group(),M=(geo,c,x,y,z,m)=>{const e=new THREE.Mesh(geo,m||mt(c,.6));e.position.set(x,y,z);e.castShadow=true;e.userData.noMerge=1;g.add(e);return e};
  M(bgeo(.1,1.9,.1),0x5a5f68,0,.95,0);M(bgeo(.55,.75,.3),0x2f5a8a,0,1.5,.12);M(bgeo(.6,.08,.36),0x2f5a8a,0,1.92,.12);M(bgeo(.42,.5,.02),0xd8dce4,0,1.52,.28,SM({color:0xd8dce4,roughness:.3,metalness:.6}));
  for(let i=0;i<12;i++)M(bgeo(.06,.05,.02),0x1d1d22,-.08+(i%3)*.08,1.62-Math.floor(i/3)*.07,.3);const s=signMesh('PHONE',.5,.14,'#ffffff','#2f5a8a','Archivo');s.position.set(0,2.05,.31);g.add(s);return g}
function c3Cruiser(){const g=new THREE.Group(),M=(geo,c,x,y,z,m)=>{const e=new THREE.Mesh(geo,m||mt(c,.5));e.position.set(x,y,z);e.castShadow=true;e.userData.noMerge=1;g.add(e);return e};
  M(roundBox(1.9,.7,4.4,.18,2),0xf2f2ee,0,.62,0);M(roundBox(1.88,.32,4.42,.1,2),0x15171c,0,.42,0);M(roundBox(1.6,.55,2.1,.18,2),0x1d222b,0,1.18,-.2);for(const[x,z]of[[-.85,1.4],[.85,1.4],[-.85,-1.4],[.85,-1.4]]){const w=M(new THREE.CylinderGeometry(.34,.34,.25,14),0x111111,x,.34,z);w.rotation.z=PI/2}
  const R_=new THREE.MeshBasicMaterial({color:0xff2a2a}),B_=new THREE.MeshBasicMaterial({color:0x2a5aff});g.userData.lr=M(bgeo(.55,.13,.24),0,-.32,1.52,-.2,R_);g.userData.lb=M(bgeo(.55,.13,.24),0,.32,1.52,-.2,B_);
  const sg=signMesh('POLICE',1.2,.3,'#15171c','#f2f2ee','Archivo');sg.position.set(.96,.75,0);sg.rotation.y=PI/2;g.add(sg);return g}
/* V464 the SWAT van: a tall dark armoured box with a light bar and SWAT on the side */
function c3SwatVan(){const g=new THREE.Group(),M=(geo,c,x,y,z,m)=>{const e=new THREE.Mesh(geo,m||mt(c,.55));e.position.set(x,y,z);e.castShadow=true;e.userData.noMerge=1;g.add(e);return e};
  M(roundBox(2.3,1.9,5.4,.12,2),0x1b2129,0,1.35,-.2);M(roundBox(2.2,1.0,1.5,.12,2),0x1b2129,0,.95,2.4);M(bgeo(2.0,.5,.06),0x0e1218,0,1.25,3.15);M(bgeo(2.32,.3,5.5),0x11151b,0,.45,0);
  for(const[x,z]of[[-1,1.9],[1,1.9],[-1,-1.6],[1,-1.6]]){const w=M(new THREE.CylinderGeometry(.42,.42,.3,14),0x0b0b0b,x,.42,z);w.rotation.z=PI/2}
  const R_=new THREE.MeshBasicMaterial({color:0xff2a2a}),B_=new THREE.MeshBasicMaterial({color:0x2a5aff});g.userData.lr=M(bgeo(.6,.14,.26),0,-.38,2.38,1.2,R_);g.userData.lb=M(bgeo(.6,.14,.26),0,.38,2.38,1.2,B_);
  for(const sx of[-1,1]){const sg=signMesh('SWAT',1.6,.5,'#f2f2ee','#1b2129','Archivo');sg.position.set(sx*1.16,1.5,-.4);sg.rotation.y=sx*PI/2;g.add(sg)}return g}
/* one SWAT officer: dark tactical gear, a helmet with a visor, a vest with POLICE across it */
function c3Swat(x,z){const n=c4Pup('cops',x,z,PI/2,{tag:'c3fp',int:null,name:'SWAT',title:'Harrowgate PD',lvl:7,shirt:0x232831,sleeve:0x232831,pants:0x1c2027,cap:0,noLetters:1,look:{cl2:'tee',fh:0,shoe:0x111111,sole:0x0a0a0a}});if(!n)return n;const p=n.g&&n.g.P;
  if(p&&p.head){const D=mt(0x1a1d22,.6),h=new THREE.Mesh(new THREE.SphereGeometry(.27,16,10,0,TAU,0,PI*.55),D);h.position.y=.2;h.userData.noMerge=1;p.head.add(h);const v=new THREE.Mesh(bgeo(.34,.09,.05),new THREE.MeshStandardMaterial({color:0x223040,roughness:.2,metalness:.5}));v.position.set(0,.1,.24);v.userData.noMerge=1;p.head.add(v)}
  if(p&&p.chest){const vs=new THREE.Mesh(bgeo(.5,.42,.36),mt(0x2c333b,.8));vs.position.set(0,-.05,0);vs.userData.noMerge=1;p.chest.add(vs);try{const sg=signMesh('POLICE',.42,.11,'#f2f2ee','#2c333b','Archivo');sg.position.set(0,0,.185);p.chest.add(sg);const sb=sg.clone();sb.position.z=-.185;sb.rotation.y=PI;p.chest.add(sb)}catch(e){}}
  return n}
function c3Flash(){let e=$('c3flash');if(!e){e=document.createElement('div');e.id='c3flash';document.body.appendChild(e)}e.classList.remove('on');void e.offsetWidth;e.classList.add('on');noise(.05,.12,5000);tone(2400,.03,'square',.03)}
function c3Herald(img,day){const e=document.createElement('div');e.id='c3herald';e.innerHTML=`<div class="hp"><div class="hm">THE HARROWGATE HERALD</div><div class="hd"><span>Day ${day} · Morning edition</span><span>Harrowgate, Ohio</span><span>75¢</span></div><h1>SNOWED</h1><div class="hs">A hostage call sends SWAT to three Greek Row houses. No hostages. Cocaine in all three.</div><div class="hph">${img?`<img src="${img}" alt="">`:'<div class="hnp"></div>'}<p>Detective Alana Ruiz on the steps of Gamma Omega Zeta this morning.</p></div><div class="hcol"><p>A caller at a payphone outside Hank's Market told police that people were being held hostage over cocaine at Omega Psi Delta, Kappa Alpha Nu and Gamma Omega Zeta. SWAT teams forced their way into all three houses before dawn. They found no hostages. They did find packages taped under the dining table in each house.</p><p>It is the second Greek Row raid this week. Kappa Theta Omega was closed after a raid earlier in the week.</p></div></div>`;document.body.appendChild(e);return e}
async function c3FrameCine(done){const s0=S.gt,hk=B.find(b=>b.menu==='hank'),HS=['opd','kan','gwz'].map(id=>B.find(b=>b.id===id)).filter(Boolean),props=[];let caller=null,ruiz=null,img=null,blink=null;const W=c4Wt;
  if(!hk||HS.length<3){for(const id of['opd','kan','gwz'])c3Shut(id);if(done)done();return}
  const add=o=>{sc.add(o);props.push(o);return o};
  await c6Cine(async()=>{
    /* 1. the payphone, late at night */
    c1Sub('','That night. A payphone outside Hank\'s Market.');for(let i=0;i<7;i++)tone([697,770,852,941][i%4],.09,'sine',.05,.6+i*.16);await W(2.2);
    for(let i=0;i<3;i++){tone(440,.5,'sine',.04,i*1.1);tone(480,.5,'sine',.04,i*1.1)}await W(2.4);c1Sub(null);
    c1Say(caller,'Harrowgate police? There are people being held hostage. On Greek Row.',3);await W(3);c4Shot([hk.ex+3.4,1.5,hk.ez+3.6],[hk.ex+2.2,1.55,hk.ez+1.4],1.2);
    c1Say(caller,'Omega Psi Delta. Kappa Alpha Nu. Gamma Omega Zeta. They\'ve got people locked up over cocaine money. Guns, everything. Please hurry.',4.2);await W(4.2);
    c1Say(caller,'The cocaine? Under the dining tables. All three houses.',3);await W(3);
    c1Say(caller,'No. No names.',1.8);await W(1.6);noise(.06,.15,800);caller.pup.post=null;await W(.8);
    /* 2. that night: cruisers and tape at three doors */
    await c4Fade(async()=>{c4Off('c3fc');S.gt=23.6;c3SirenOverlay(true);/* V464 the caller said hostages, so it is SWAT that comes: an armoured van and a four-man stack at every door */for(const b of HS){const c=add(c3SwatVan());c.position.set(b.ex-9.5,terrH(b.ex-9.5,b.ez),b.ez+(b.id==='kan'?3:-3));c.rotation.y=PI*.02;for(let i=0;i<4;i++){const p=c3Swat(b.ex-8+(i%2)*1.2,b.ez+1.8-i*1.2);c4To(p,b.ex-1.4-i*.75,b.ez+(i%2?-.5:.5),3.4)}}
      blink=setInterval(()=>{for(const o of props)if(o.userData.lr){const t=(Date.now()/250|0)%2;o.userData.lr.visible=!!t;o.userData.lb.visible=!t}},120);
      c4Shot([62,16,58],[92,1,98],0)});
    c1Sub('','A hostage call. Harrowgate PD sends SWAT to all three houses a little after midnight.');c4Shot([66,10,74],[92,1,100],.5);await W(3.2);
    for(const b of HS){c4Shot([b.ex-7,2.6,b.ez+5.5],[b.ex,1.6,b.ez],1.6);await W(1.1);const lead=C4.pups.find(n=>n.c4tag==='c3fp'&&Math.hypot(n.x-b.ex,n.z-b.ez)<4);if(lead)c1Say(lead,'POLICE! SEARCH WARRANT!',1.3);await W(.6);/* the door goes in */noise(.25,.2,1800);c3Flash();await W(.3);c3Shut(b.id);c1Sub('',{opd:'Omega Psi Delta.',kan:'Kappa Alpha Nu.',gwz:'Gamma Omega Zeta.'}[b.id]+' No hostages.');await W(1.7)}
    c1Sub(null);
    /* 3. the next morning on the ΓΩΖ steps */
    const g=HS[2];
    await c4Fade(async()=>{c4Off('c3fp');c3SirenOverlay(false);clearInterval(blink);blink=null;S.gt=8.4;
      ruiz=c4Pup('cops',g.ex-1.3,g.ez,-PI/2,{tag:'c3fm',int:null,name:'Detective Alana Ruiz',title:'Harrowgate PD',fem:true,lvl:8});
      const bag=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),SM({color:0xf6f6f2,roughness:.4,transparent:true,opacity:.92}));bag.scale.set(1.3,1,.8);bag.userData.noMerge=1;if(ruiz.g.P&&ruiz.g.P.hL){ruiz.g.P.hL.add(bag);bag.position.set(0,-.14,.04)}
      ruiz.pup.post=gg=>{const p=gg.P;if(!p)return;p.aL.rotation.set(-2.75,0,-.15);p.eL.rotation.set(-.25,0,0)};
      for(let i=0;i<4;i++){const r=c4Pup(i%2?'activists':'studentgov',g.ex-6.2+(i%2)*.6,g.ez-2.4+i*1.6,PI/2,{tag:'c3fm',int:null,name:'Reporter',title:'Press',lvl:3});c4Look(r,g.ex-1.3,g.ez);const cm=new THREE.Mesh(bgeo(.16,.12,.1),mt(0x15161a,.5));cm.userData.noMerge=1;if(r.g.P&&r.g.P.hR){r.g.P.hR.add(cm);cm.position.set(0,-.08,.08)}r.pup.post=gg=>{const p=gg.P;if(!p)return;p.aR.rotation.set(-1.6,0,-.1);p.eR.rotation.set(-1.1,0,0)}}
      c4Shot([g.ex-5.4,1.7,g.ez+.6],[g.ex-1.3,2.1,g.ez],0)});
    c1Sub('','The next morning.');await W(1.6);c1Sub(null);
    for(let i=0;i<3;i++){c3Flash();await W(.35)}
    c1Say(ruiz,'No hostages. Not in any of the three houses. Just this, under the dining table, exactly where the caller said.',3.8);await W(2);c3Flash();await W(1.5);
    /* the front-page photo: this exact frame */
    try{c4Shot([g.ex-4.2,1.6,g.ez+1.4],[g.ex-1.3,2.05,g.ez],0);await W(.1);R.render(sc,cam);img=R.domElement.toDataURL('image/jpeg',.8)}catch(e){img=null}c3Flash();
    const rp=C4.pups.find(n=>n.name==='Reporter'&&n.c4tag==='c3fm');if(rp){c1Say(rp,'Detective! Is this connected to the Kappa Theta Omega raid?',2.6);await W(2.6)}
    c1Say(ruiz,'No comment.',1.6);await W(1.8);
    /* 4. the Herald */
    const hp=c3Herald(img,S.day+1);sfx('ok');await W(5.2);hp.classList.add('out');await W(.5);hp.remove()
  },()=>{S.gt=Math.max(s0,9);S.day++;try{newDay()}catch(e){}if(done)done()},{
    fade:async()=>{if(P.inside)goOut(86.5,76);PM.visible=false;const pp=add(c3PayphoneMesh());const px=hk.ex+2.2,pz=hk.ez+1.2;pp.position.set(px,terrH(px,pz),pz);pp.rotation.y=PI;S.gt=23.4;
      caller=c4Pup('townies',px,pz+.62,PI,{tag:'c3fc',int:null,name:'Caller',title:'',lvl:3,shirt:0x1d1d22,sleeve:0x1d1d22,pants:0x1d1d22,look:{cl2:'hoodie'}});caller.pup.post=gg=>{const p=gg.P;if(!p)return;p.aR.rotation.set(-.35,0,.25);p.eR.rotation.set(-2.35,0,0);if(p.head)p.head.rotation.x=.2};
      c4Shot([px+3.2,2.1,pz+4.6],[px,1.4,pz],0)},
    after:()=>{PM.visible=true;if(blink)clearInterval(blink);c3SirenOverlay(false);for(const o of props)if(o.parent)o.parent.remove(o);c4Off('c3fc');c4Off('c3fp');c4Off('c3fm');for(const id of['opd','kan','gwz'])c3Shut(id);const h=$('c3herald');if(h)h.remove()}})}

// ================================================================ V464 THE VICTORY PARTY (user: a whole coke party, powdered faces, a mound in the living room, snow angels, powder raining down)
/* a dusting of white over the nose and mouth, and a white smear on the chest */
function c3Powder(n){const p=n&&n.g&&n.g.P;if(!p||!p.head)return;const Y=1.78-(typeof BP!=='undefined'&&BP.head?BP.head[1]:1.78),W_=new THREE.MeshStandardMaterial({color:0xf8f8f6,roughness:1,transparent:true,opacity:.92});
  const f=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),W_);f.scale.set(.1,.075,.035);f.position.set(0,Y-.02,.205);f.userData.noMerge=1;p.head.add(f);
  const ns=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),W_);ns.scale.set(.04,.03,.03);ns.position.set(0,Y+.03,.225);ns.userData.noMerge=1;p.head.add(ns);
  if(p.chest){const c=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshStandardMaterial({color:0xf2f2ee,roughness:1,transparent:true,opacity:.55}));c.scale.set(.15,.1,.02);c.position.set(.05,.08,.2);c.userData.noMerge=1;p.chest.add(c)}}
/* the powder in the air: one Points cloud, bursts thrown up from a spot that fall back down slowly and drift, plus a steady fall over the whole room */
function c3Snow(I){const N=2400,pos=new Float32Array(N*3),V=[];for(let i=0;i<N;i++){pos[i*3+1]=-50;V.push({x:0,y:-50,z:0,vx:0,vy:0,vz:0,on:0})}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(G,new THREE.PointsMaterial({color:0xffffff,size:.07,transparent:true,opacity:.95,depthWrite:false}));pts.frustumCulled=false;pts.userData.noMerge=1;I.g.add(pts);
  let k=0;const S_={pts,rain:0,
    burst(x,y,z,n,up){for(let i=0;i<n;i++){const v=V[k++%N];v.on=1;v.x=x+(rnd()-.5)*.3;v.y=y;v.z=z+(rnd()-.5)*.3;const a=rnd()*TAU,r=rnd()*(up?1.6:2.4);v.vx=Math.cos(a)*r;v.vz=Math.sin(a)*r;v.vy=up?3.5+rnd()*3.5:.5+rnd()*1.6}},
    tick(dt){for(let i=0;i<this.rain*dt*60;i++){const v=V[k++%N];v.on=1;v.x=I.x0+4+rnd()*40;v.z=I.z0+18+rnd()*16;v.y=3.2+rnd()*.6;v.vx=(rnd()-.5)*.3;v.vz=(rnd()-.5)*.3;v.vy=-.2}
      for(let i=0;i<N;i++){const v=V[i];if(!v.on)continue;v.vy=Math.max(-.9,v.vy-6*dt);v.vx*=1-dt*1.5;v.vz*=1-dt*1.5;v.x+=v.vx*dt+Math.sin(TT*2+i)*.004;v.y+=v.vy*dt;v.z+=v.vz*dt;if(v.y<.02){v.y=.02;v.on=0}pos[i*3]=v.x;pos[i*3+1]=v.y;pos[i*3+2]=v.z}G.attributes.position.needsUpdate=true}};return S_}
async function c3CokeParty(done){const I=INT.asr;if(!I){if(done)done();return}const L=(x,z)=>[I.x0+x,I.z0+z],MX=24,MZ=25.5,W=c4Wt,ppl=[],O={tag:'c3cp',int:'asr',lvl:4};let snow=null,mound=null,run=1,crowdWas=null;
  const mk=(x,z,a,o)=>{const[px,pz]=L(x,z);const n=c4Pup(o.cl||'brothers',px,pz,a,Object.assign({},O,o));if(n){c3Powder(n);ppl.push(n)}return n};
  /* dancing: bouncing on the spot, both arms pumping over the head */
  const hype=(n,ph)=>{n.pup.arms=null;n.pup.post=g=>{const p=g.P;if(!p)return;const t=TT*7.5+ph,b=Math.abs(Math.sin(t));g.position.y+=b*.28;if(p.aL){p.aL.rotation.set(-2.7+Math.sin(t)*.35,0,.25);p.aR.rotation.set(-2.7-Math.sin(t)*.35,0,-.25)}if(p.eL){p.eL.rotation.set(-.3,0,0);p.eR.rotation.set(-.3,0,0)}if(p.head)p.head.rotation.x=-.25+Math.sin(t*2)*.15}};
  /* a snow angel: flat on his back on the mound, arms and legs sweeping out and in */
  const angel=(n,ph)=>{n.pup.lie=1;n.pup.frozen=1;n.pup.post=g=>{const p=g.P;if(!p)return;const s=(Math.sin(TT*4+ph)+1)/2;if(p.aL){p.aL.rotation.set(0,0,.3+s*2.4);p.aR.rotation.set(0,0,-.3-s*2.4)}if(p.lL){p.lL.rotation.set(0,0,-.05-s*.55);p.lR.rotation.set(0,0,.05+s*.55)}}};
  await c6Cine(async()=>{
    (async()=>{let t0=TT;while(run){const dt=Math.min(.05,Math.max(.001,TT-t0));t0=TT;if(snow)snow.tick(dt);if(C3.disco&&C3.disco[0])C3.disco[0].rotation.y+=dt*1.4;await W(.033)}})();
    /* 1. the room */
    c4Shot([I.x0+MX+9,4.2,I.z0+MZ+8.5],[I.x0+MX,1.2,I.z0+MZ-1],0);c4Shot([I.x0+MX+7.5,3.6,I.z0+MZ+7.5],[I.x0+MX,1.2,I.z0+MZ-1],.25);
    c1Sub('','That night the house is shaking. Every face in the room is white to the eyebrows.');for(const n of ppl)if(n.c3d)hype(n,n.c3d);snow.rain=6;await W(3.6);
    /* 2. the mound: Brett tips a whole duffel out onto the living-room floor */
    const pour=ppl.find(n=>n.c3pour);c4Shot([I.x0+MX+3.6,2.2,I.z0+MZ+4.2],[I.x0+MX,.8,I.z0+MZ],1.2);c1Sub(null);
    if(pour){c1Say(pour,'MAKE IT RAIN, BOYS!',2);pour.pup.post=g=>{const p=g.P;if(!p)return;p.aL.rotation.set(-1.9,0,.2);p.aR.rotation.set(-1.9,0,-.2);if(p.eL){p.eL.rotation.set(-.6,0,0);p.eR.rotation.set(-.6,0,0)}}}
    const[bx,bz]=L(MX+.9,MZ);for(let i=0;i<=60;i++){const k=i/60;mound.scale.set(.1+.9*k,(.05+.95*k)*.5,.1+.9*k);mound.visible=true;snow.burst(bx-.3,1.5,bz,8,false);if(i%12===0)noise(.15,.04,500);await W(.05)}
    c1Sub('','Somebody tips a whole duffel bag out onto the living-room floor. It keeps coming.');await W(2.4);c1Sub(null);
    /* 3. snow angels */
    const angels=ppl.filter(n=>n.c3ang);c4Shot([I.x0+MX-3.2,3,I.z0+MZ+3.4],[I.x0+MX,.6,I.z0+MZ],1.4);
    for(const[i,n]of angels.entries()){const[x,z]=L(MX-.35+i*.75,MZ+(i?-.25:.35));c4To(n,x,z,4.2);if(i===0)c1Say(n,'SNOW ANGELS!',1.6);await W(.55);n.pup.y=.84;angel(n,i*1.7);const[mx,mz]=[n.x,n.z];snow.burst(mx,.7,mz,90,true);noise(.2,.08,700)}
    await W(3.2);for(const n of angels)snow.burst(n.x,.7,n.z,40,true);await W(1.6);
    /* 4. handfuls thrown at the ceiling, and it all comes down */
    c4Shot([I.x0+MX-5.6,2.7,I.z0+MZ+6],[I.x0+MX+.5,2.3,I.z0+MZ-1],1.2);snow.rain=22;
    for(let r=0;r<6;r++){for(const n of ppl.filter(m=>m.c3d)){if(rnd()<.5){snow.burst(n.x,2.1,n.z,26,true)}}if(r===1){const t=ppl.find(m=>m.c3d);if(t)c1Say(t,'WOOOOOOO!',1.4)}await W(.6)}
    c1Sub('','Handfuls of it go up at the ceiling and come down over everybody, like the first snow of the year.');await W(3.4);c1Sub(null);
    /* 5. Grant up on the coffee table, Danny with his water */
    const g=ppl.find(n=>n.c3grant);if(g){c4Shot([I.x0+MX+.6,2.8,I.z0+MZ+5.5],[g.x,2.1,g.z],1.3);g.pup.post=gg=>{const p=gg.P;if(!p)return;p.aR.rotation.set(-2.8,0,-.15);p.eR.rotation.set(-.2,0,0)};c1Say(g,'LAST! HOUSE! STANDING!',2.4);await W(.7);for(let r=0;r<3;r++){for(const n of ppl.filter(m=>m.c3d))snow.burst(n.x,2.2,n.z,18,true);await W(.5)}await W(1.2)}
    c4Shot([P.x-1.6,1.8,P.z+2.2],[P.x,1.45,P.z],.8);c1Sub('','You hold a glass of water and try not to breathe through your nose.');await W(3);c1Sub(null)
  },()=>{run=0;if(done)done()},{
    fade:async()=>{if(P.inside!=='asr')goIn('asr');c3Party(1);if(C3.party){crowdWas=C3.party.g.visible;C3.party.g.visible=false}snow=c3Snow(I);
      mound=new THREE.Mesh(new THREE.SphereGeometry(1.9,24,12,0,TAU,0,PI/2),new THREE.MeshStandardMaterial({color:0xfbfbf8,roughness:1}));mound.scale.set(1,.55,1);const[mx,mz]=L(MX,MZ);mound.position.set(mx,0,mz);mound.userData.noMerge=1;mound.visible=false;I.g.add(mound);mound.userData.k=1;
      /* the people: a ring of dancers, two angels-to-be, Brett with the duffel, Grant on the coffee table */
      for(let i=0;i<14;i++){const a=i/14*TAU,r=4.2+(i%3)*1.3,x=MX+Math.cos(a)*r,z=MZ+Math.sin(a)*r*.75;if(z<18.5||z>34||(x>MX+1.5&&z>MZ+1.5)||(x<MX-3&&z>MZ+3))continue;/* keep the camera's corner clear */const n=mk(x,z,Math.atan2(MX-x,MZ-z),{cl:i%4===3?'sororities':'brothers',fem:i%4===3,name:i%4===3?'Party guest':'Brother',title:'ΑΣΡ'});if(n)n.c3d=1+i}
      for(let i=0;i<2;i++){const n=mk(MX-2.2+i*.5,MZ+2.6,PI,{name:i?'Owen':'Tank',title:'ΑΣΡ'});if(n)n.c3ang=1}
      {const n=mk(MX+1.3,MZ-.2,-PI/2,{name:'Brett Calloway',title:'ΑΣΡ'});if(n)n.c3pour=1}
      {const n=mk(MX+3.4,MZ-3.2,-.6,{name:'Grant Ashby',title:'Chapter president',hair:0xc8a24a,shirt:0x7d1f2c,y:.45});if(n){n.c3grant=1;n.pup.y=.45}}
      {const[tx,tz]=L(MX+3.4,MZ-3.2);c3M(bgeo(1.6,.42,.9),mt(0x4a3020,.6),tx,.21,tz,I.g).userData.c3cp=1}
      const[dx,dz]=L(MX-4.6,MZ+4.4);c4DanAt(dx,dz,Math.atan2(I.x0+MX-dx,I.z0+MZ-dz))},
    after:()=>{run=0;c4Off('c3cp');if(snow&&snow.pts.parent)snow.pts.parent.remove(snow.pts);if(mound)mound.userData.keep=1;I.g.children.filter(o=>o.userData&&o.userData.c3cp).forEach(o=>o.parent.remove(o));if(C3.party&&crowdWas!=null)C3.party.g.visible=crowdWas;
      /* the mound stays in the living room for the rest of the party */C3.mound=mound}})}
