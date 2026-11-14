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
function c3Flash(){let e=$('c3flash');if(!e){e=document.createElement('div');e.id='c3flash';document.body.appendChild(e)}e.classList.remove('on');void e.offsetWidth;e.classList.add('on');noise(.05,.12,5000);tone(2400,.03,'square',.03)}
function c3Herald(img,day){const e=document.createElement('div');e.id='c3herald';e.innerHTML=`<div class="hp"><div class="hm">THE HARROWGATE HERALD</div><div class="hd"><span>Day ${day} · Morning edition</span><span>Harrowgate, Ohio</span><span>75¢</span></div><h1>SNOWED</h1><div class="hs">Police find cocaine at three more houses on Greek Row after an anonymous tip</div><div class="hph">${img?`<img src="${img}" alt="">`:'<div class="hnp"></div>'}<p>Detective Alana Ruiz on the steps of Gamma Omega Zeta this morning.</p></div><div class="hcol"><p>A call from a payphone outside Hank's Market sent Harrowgate PD to Omega Psi Delta, Kappa Alpha Nu and Gamma Omega Zeta before dawn. Officers found packages taped under the dining table in each house.</p><p>It is the second Greek Row raid this week. Kappa Theta Omega was closed after a raid earlier in the week.</p></div></div>`;document.body.appendChild(e);return e}
async function c3FrameCine(done){const s0=S.gt,hk=B.find(b=>b.menu==='hank'),HS=['opd','kan','gwz'].map(id=>B.find(b=>b.id===id)).filter(Boolean),props=[];let caller=null,ruiz=null,img=null,blink=null;const W=c4Wt;
  if(!hk||HS.length<3){for(const id of['opd','kan','gwz'])c3Shut(id);if(done)done();return}
  const add=o=>{sc.add(o);props.push(o);return o};
  await c6Cine(async()=>{
    /* 1. the payphone, late at night */
    c1Sub('','That night. A payphone outside Hank\'s Market.');for(let i=0;i<7;i++)tone([697,770,852,941][i%4],.09,'sine',.05,.6+i*.16);await W(2.2);
    for(let i=0;i<3;i++){tone(440,.5,'sine',.04,i*1.1);tone(480,.5,'sine',.04,i*1.1)}await W(2.4);c1Sub(null);
    c1Say(caller,'Harrowgate police? I want to report drugs. On Greek Row.',2.8);await W(2.8);c4Shot([hk.ex+3.4,1.5,hk.ez+3.6],[hk.ex+2.2,1.55,hk.ez+1.4],1.2);
    c1Say(caller,'Omega Psi Delta. Kappa Alpha Nu. Gamma Omega Zeta. Look under the dining tables.',3.4);await W(3.4);
    c1Say(caller,'No. No names.',1.8);await W(1.6);noise(.06,.15,800);caller.pup.post=null;await W(.8);
    /* 2. that night: cruisers and tape at three doors */
    await c4Fade(async()=>{c4Off('c3fc');S.gt=23.6;c3SirenOverlay(true);for(const b of HS){const c=add(c3Cruiser());c.position.set(b.ex-9.5,terrH(b.ex-9.5,b.ez),b.ez+(b.id==='kan'?3:-3));c.rotation.y=PI*.02;for(let i=0;i<2;i++){const p=c4Pup('cops',b.ex-8+i*1.4,b.ez+1.2-i*2.4,PI/2,{tag:'c3fp',int:null,name:'Officer',title:'Harrowgate PD',lvl:6});c4To(p,b.ex-1.6,b.ez+(i?-1:1),3.6)}}
      blink=setInterval(()=>{for(const o of props)if(o.userData.lr){const t=(Date.now()/250|0)%2;o.userData.lr.visible=!!t;o.userData.lb.visible=!t}},120);
      c4Shot([62,16,58],[92,1,98],0)});
    c1Sub('','Harrowgate PD gets the call a little after midnight.');c4Shot([66,10,74],[92,1,100],.5);await W(3.2);
    for(const b of HS){c4Shot([b.ex-7,2.6,b.ez+5.5],[b.ex,1.6,b.ez],1.6);await W(1.3);c3Shut(b.id);noise(.2,.1,2600);c1Sub('',{opd:'Omega Psi Delta.',kan:'Kappa Alpha Nu.',gwz:'Gamma Omega Zeta.'}[b.id]);await W(1.6)}
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
    c1Say(ruiz,'Gamma Omega Zeta. Under the dining table, exactly where the caller said it would be.',3.4);await W(2);c3Flash();await W(1.5);
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
