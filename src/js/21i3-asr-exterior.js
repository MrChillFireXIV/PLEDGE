/* V285 ΑΣΡ exterior: the house is two floors (8 high, like the other houses) until chapter 3. When the brothers get the new floor the
   outside grows a third one (12 high). The lower two floors are built as usual in buildWorld; this file adds the top block on demand:
   brick shell on the same facade texture, copies of the second-floor window frames/panes (and the cornice teeth) lifted 4 up, a new cornice and roof. */
const ASRX={on:false,g:null,roof:null,ch:[],H0:8,H1:12};
function asrxBuild(){
  const b=B.find(q=>q.id==='asr');if(!b)return false;
  const w=b.x1-b.x0,d=b.z1-b.z0,cx=(b.x0+b.x1)/2,cz=(b.z0+b.z1)/2,H0=ASRX.H0,H1=ASRX.H1,F=H1-H0,g=new THREE.Group();
  const geo=new THREE.BoxGeometry(w,F,d),was=FD.on;FD.on=false;
  /* h=2*(H0+F/2) makes the texture's v run from H0/16 to H1/16, so the painted windows continue the lower floors */
  try{fdBoxUV(geo,b.x0,b.z0,b.x1,b.z1,2*(H0+F/2),'brick')}finally{FD.on=was}
  const shell=new THREE.Mesh(geo,[fm('brick'),fm('brick'),mt(0x4a4a50,.95),mt(0x4a4a50,.95),fm('brick'),fm('brick')]);
  shell.position.set(cx,H0+F/2,cz);shell.castShadow=shell.receiveShadow=true;g.add(shell);
  const cream=mt(0xe9e3d3,.9);
  const cor=new THREE.Mesh(new THREE.BoxGeometry(w+.5,.35,d+.5),cream);cor.position.set(cx,H1-.18,cz);cor.castShadow=true;g.add(cor);
  const slab=new THREE.Mesh(new THREE.BoxGeometry(w+.7,.4,d+.7),cream);slab.position.set(cx,H1+.2,cz);slab.castShadow=true;g.add(slab);
  const rh=Math.min(w,d)*.3,roof=new THREE.Mesh(HIPG,mt(0x2e2f36,.75));roof.scale.set(w+1.6,rh,d+1.6);roof.position.set(cx,H1+.4,cz);roof.castShadow=roof.receiveShadow=true;g.add(roof);
  /* second-floor window frames, sills, panes and cornice teeth (y 4.2..8.2) copied up one floor */
  const M=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(),col=new THREE.Color();
  for(const c of FD.ch){const m=c.m;if(!m||!m.isInstancedMesh||(c.t!=='t'&&c.t!=='g'))continue;
    if(Math.hypot(c.x-cx,c.z-cz)>c.r+Math.hypot(w,d))continue;
    const pick=[];for(let i=0;i<m.count;i++){m.getMatrixAt(i,M);p.setFromMatrixPosition(M);if(p.x>b.x0-1&&p.x<b.x1+1&&p.z>b.z0-1&&p.z<b.z1+1&&p.y>4.2&&p.y<8.2)pick.push(i)}
    if(!pick.length)continue;
    const n=new THREE.InstancedMesh(m.geometry,m.material,pick.length);
    pick.forEach((i,k)=>{m.getMatrixAt(i,M);M.decompose(p,q,s);p.y+=F;M.compose(p,q,s);n.setMatrixAt(k,M);if(m.instanceColor){col.fromArray(m.instanceColor.array,i*3);n.setColorAt(k,col)}});
    n.instanceMatrix.needsUpdate=true;if(n.instanceColor)n.instanceColor.needsUpdate=true;
    n.castShadow=m.castShadow;n.receiveShadow=m.receiveShadow;n.renderOrder=m.renderOrder;n.userData.fd=m.userData.fd;n.frustumCulled=false;g.add(n);
    ASRX.ch.push({m:n,x:cx,z:cz,r:Math.hypot(w,d)/2+4,t:c.t})}
  g.userData.noMerge=1;ASRX.g=g;return true}
function asrxSync(){
  const want=!!((S&&S.ch>=3)||(C3.up&&C3.up.on));if(want===ASRX.on)return;
  const b=B.find(q=>q.id==='asr');if(!b)return;
  if(want&&!ASRX.g&&!asrxBuild())return;
  ASRX.on=want;
  if(want){sc.add(ASRX.g);if(ASRX.roof)sc.remove(ASRX.roof);for(const c of ASRX.ch)if(!FD.ch.includes(c))FD.ch.push(c);
    if(typeof OUTSIDE!=='undefined'&&!OUTSIDE.includes(ASRX.g))OUTSIDE.push(ASRX.g);
    markR(b.x0,b.z0,b.x1,b.z1,ASRX.H1+8,0);b.h=ASRX.H1}
  else{sc.remove(ASRX.g);if(ASRX.roof)sc.add(ASRX.roof);FD.ch=FD.ch.filter(c=>!ASRX.ch.includes(c));b.h=ASRX.H0}}
