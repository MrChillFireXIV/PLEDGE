// ================================================================ V96 house personality: every Greek house gets its own wall finish, floor, furniture layout and wall decor
// (paddles, group photos, paintings, swords, deer mounts, oars, pennants, jerseys...). Choices are seeded from the house id so a house always looks the same.
function hHash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
const hexS=c=>'#'+(c>>>0).toString(16).padStart(6,'0');
const HSTY={};
const HCL={asr:'brothers',kto:'legacies',opd:'studentgov',kan:'athletes',dlp:'sororities',tz:'sororities',lodge:'oldguard',lxa:'brothers'};
function hsty(id){const b=id.replace(/_up$/,'');if(HSTY[b])return HSTY[b];const r=mulberry(hHash(b)*7+11),pk=a=>a[Math.floor(r()*a.length)];
  let F=null;try{F=FRATS.find(f=>f.id===b)}catch(e){}const cl=(F&&F.cl)||HCL[b]||'brothers',soro=cl==='sororities';
  const TH={athletes:['sport','sport','lodge'],legacies:['trad','gallery','naut'],studentgov:['trad','gallery'],activists:['gallery','naut'],brothers:['lodge','naut','trad','sport'],oldguard:['lodge'],sororities:['chic','chic','gallery']};
  const theme=b==='asr'?'trad':pk(TH[cl]||['lodge','trad','sport','naut','gallery']);
  const PAPER={lodge:['plank','plaid','plank'],trad:['stripe','damask','paint'],sport:['paint','brick','stripe'],naut:['stripe','paint','bead'],gallery:['paint','damask','stripe'],chic:['damask','stripe','paint']};
  const FLOOR={lodge:['walnut','wood'],trad:['parquet','walnut'],sport:['oak','wood'],naut:['oak','wood'],gallery:['parquet','oak'],chic:['oak','parquet']};
  const s={b,r,pk,cl,soro,theme,paper:b==='asr'?'damask':pk(PAPER[theme]),wains:pk(['panel','bead','panel','flat']),floor:pk(FLOOR[theme]),
    lay:b==='asr'?0:Math.floor(r()*3),chap:Math.floor(r()*3),game:b==='asr'?0:Math.floor(r()*3),dine:b==='asr'?0:Math.floor(r()*3),rug:pk(['persian','border','stripe'])};
  return HSTY[b]=s}

// ---------------------------------------------------------------- surface textures
const HTEX={};
function wallTex(kind,col){const k=kind+col;if(HTEX[k])return HTEX[k];const B=hexS(col);
  const t=ctex(256,256,(q,W,H)=>{q.fillStyle=B;q.fillRect(0,0,W,H);
    if(kind==='stripe'){for(let x=0;x<W;x+=32){q.fillStyle=shade(B,-11);q.fillRect(x,0,15,H);q.fillStyle=shade(B,12);q.fillRect(x+23,0,2,H)}}
    else if(kind==='damask'){q.fillStyle=shade(B,-13);for(let y=0;y<H;y+=64)for(let x=0;x<W;x+=64){const ox=(y/64)%2?32:0;for(const[dx,dy]of[[0,-9],[0,9],[-9,0],[9,0]]){q.beginPath();q.ellipse(x+ox+dx+16,y+dy+32,5,8,dx?PI/2:0,0,TAU);q.fill()}q.beginPath();q.arc(x+ox+16,y+32,3,0,TAU);q.fill();q.fillRect(x+ox+15,y+12,2,6);q.fillRect(x+ox+15,y+46,2,6)}}
    else if(kind==='plaid'){for(const[o,w,a]of[[0,40,.13],[64,10,.1],[150,26,.12],[210,6,.16]]){q.fillStyle=`rgba(40,20,10,${a})`;q.fillRect(o,0,w,H);q.fillRect(0,o,W,w)}q.fillStyle='rgba(255,240,210,.18)';q.fillRect(100,0,2,H);q.fillRect(0,100,W,2)}
    else if(kind==='plank'){for(let x=0;x<W;x+=32){const c=shade('#7a5434',rnd()*24-12);q.fillStyle=c;q.fillRect(x,0,32,H);q.strokeStyle=shade(c,-14);q.lineWidth=1;for(let i=0;i<4;i++){q.beginPath();const gx=x+4+rnd()*24;q.moveTo(gx,0);q.bezierCurveTo(gx+4,H*.3,gx-4,H*.7,gx+2,H);q.stroke()}q.fillStyle='rgba(0,0,0,.45)';q.fillRect(x,0,2,H)}}
    else if(kind==='bead'){for(let x=0;x<W;x+=21){q.fillStyle=shade(B,-16);q.fillRect(x,0,2,H);q.fillStyle=shade(B,10);q.fillRect(x+2,0,2,H)}}
    else if(kind==='brick'){for(let y=0,r_=0;y<H;y+=21,r_++)for(let x=-(r_%2)*32;x<W;x+=64){q.fillStyle=shade(B,rnd()*12-8);q.fillRect(x+2,y+2,60,17)}q.globalCompositeOperation='destination-over';q.fillStyle=shade(B,16);q.fillRect(0,0,W,H);q.globalCompositeOperation='source-over'}
    for(let i=0;i<1800;i++){q.fillStyle=rnd()<.5?'rgba(0,0,0,.035)':'rgba(255,255,255,.035)';q.fillRect(rnd()*W,rnd()*H,2,2)}});
  return HTEX[k]=SM({map:t,roughness:kind==='plank'?.75:.92})}
function wainTex(kind,col){if(kind==='flat')return null;const k='w'+kind+col;if(HTEX[k])return HTEX[k];const B=hexS(col);
  const t=ctex(128,128,(q,W,H)=>{q.fillStyle=B;q.fillRect(0,0,W,H);
    if(kind==='panel'){q.fillStyle=shade(B,-22);q.fillRect(14,16,W-28,H-30);q.fillStyle=shade(B,16);q.fillRect(14,16,W-28,3);q.fillRect(14,16,3,H-30);q.fillStyle=shade(B,8);q.fillRect(20,22,W-40,H-42);q.fillStyle=shade(B,-30);q.fillRect(14,H-17,W-28,3);q.fillRect(W-17,16,3,H-30)}
    else{for(let x=0;x<W;x+=16){q.fillStyle=shade(B,-24);q.fillRect(x,0,2,H);q.fillStyle=shade(B,14);q.fillRect(x+2,0,2,H)}}
    q.fillStyle=shade(B,-30);q.fillRect(0,0,W,4)});
  return HTEX[k]=SM({map:t,roughness:.6})}
function ifloorX(k){if(!k||IFL[k])return ifloor(k||'wood');let t;
  if(k==='oak'||k==='walnut')t=ctex(256,256,(q,w,h)=>{const base=k==='oak'?'#b8875a':'#5a3a24';for(let y=0;y<h;y+=16)for(let x=-((y/16)%3)*40;x<w;x+=120){const c=shade(base,rnd()*22-11);q.fillStyle=c;q.fillRect(x,y,119,15);q.fillStyle=shade(c,-10);q.fillRect(x+10+rnd()*80,y+5+rnd()*6,20+rnd()*30,1)}q.fillStyle='rgba(0,0,0,.3)';for(let y=0;y<h;y+=16)q.fillRect(0,y+15,w,1)});
  else if(k==='parquet')t=ctex(256,256,(q,w,h)=>{for(let y=0;y<h;y+=64)for(let x=0;x<w;x+=64){const v=((x+y)/64)%2;for(let i=0;i<4;i++){q.fillStyle=shade('#8a5c36',rnd()*24-12);if(v)q.fillRect(x+i*16,y,15,63);else q.fillRect(x,y+i*16,63,15)}}q.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<w;i+=64){q.fillRect(i,0,1,h);q.fillRect(0,i,w,1)}});
  else if(k.startsWith('carpet:'))t=ctex(128,128,(q,w,h)=>{const c=hexS(+k.slice(7));q.fillStyle=c;q.fillRect(0,0,w,h);for(let i=0;i<3500;i++){q.fillStyle=shade(c,rnd()*30-15);q.fillRect(rnd()*w,rnd()*h,2,2)}});
  else return ifloor(k);
  t.anisotropy=4;return IFL[k]=SM({map:t,roughness:k.startsWith('carpet')?.98:.55})}
function rugTex(kind,col){const k='rug'+kind+col;if(HTEX[k])return HTEX[k];const B=hexS(col),G='#d8c08a';
  const t=ctex(256,256,(q,W,H)=>{q.fillStyle=B;q.fillRect(0,0,W,H);
    if(kind==='stripe'){for(let y=0;y<H;y+=32){q.fillStyle=shade(B,-18);q.fillRect(0,y,W,10);q.fillStyle=G;q.fillRect(0,y+16,W,3)}}
    else{q.strokeStyle=G;q.lineWidth=8;q.strokeRect(12,12,W-24,H-24);q.strokeStyle=shade(B,-25);q.lineWidth=14;q.strokeRect(30,30,W-60,H-60);
      if(kind==='persian'){q.fillStyle=G;q.beginPath();q.moveTo(W/2,52);q.lineTo(W-60,H/2);q.lineTo(W/2,H-52);q.lineTo(60,H/2);q.closePath();q.fill();q.fillStyle=B;q.beginPath();q.moveTo(W/2,72);q.lineTo(W-82,H/2);q.lineTo(W/2,H-72);q.lineTo(82,H/2);q.closePath();q.fill();
        q.fillStyle=shade(B,-30);q.beginPath();q.arc(W/2,H/2,22,0,TAU);q.fill();q.fillStyle=G;for(const[a,b]of[[60,60],[W-60,60],[60,H-60],[W-60,H-60]]){q.beginPath();q.arc(a,b,8,0,TAU);q.fill()}}
      else{q.fillStyle=shade(B,12);q.fillRect(52,52,W-104,H-104)}}
    for(let i=0;i<2500;i++){q.fillStyle='rgba(0,0,0,.05)';q.fillRect(rnd()*W,rnd()*H,2,2)}});
  return HTEX[k]=SM({map:t,roughness:.98})}
function frugP(I,x,z,w,d,c,kind){const g=new THREE.PlaneGeometry(w,d);const e=new THREE.Mesh(g,rugTex(kind||'border',c));e.rotation.x=-PI/2;e.position.set(I.x0+x,.04,I.z0+z);e.receiveShadow=true;sc.add(e);return e}

// ---------------------------------------------------------------- extra furniture
function farm(I,x,z,face,c){const[nx,nz]=FACE[face];fb(I,x,z,1.1,1.1,.5,c);fb(I,x-nx*.45,z-nz*.45,nx?.22:1.1,1.05,nz?.22:1.1,c,0,0);
  for(const s of[-1,1])fb(I,x+(nx?0:s*.47),z+(nz?0:s*.47),nx?1.1:.18,.75,nx?.18:1.1,c,0,0)}
function fcoffee(I,x,z,w,d,c=0x3a2415){box(I.x0+x,.46,I.z0+z,w,.07,d,mt(c,.5));for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])box(I.x0+x+a*(w/2-.1),.21,I.z0+z+b*(d/2-.1),.08,.42,.08,c,0);markR(I.x0+x-w/2,I.z0+z-d/2,I.x0+x+w/2,I.z0+z+d/2,.5)}
function fbag(I,x,z,c){const m=new THREE.Mesh(GC.bag||(GC.bag=new THREE.SphereGeometry(.55,14,10)),mt(c,.9));m.scale.set(1,.55,1);m.position.set(I.x0+x,.3,I.z0+z);m.castShadow=true;sc.add(m);markR(I.x0+x-.5,I.z0+z-.5,I.x0+x+.5,I.z0+z+.5,.6)}
function fbar(I,x,z,len,face,c=0x3a2415){const[nx,nz]=FACE[face],ew=nx!==0;fb(I,x,z,ew?.8:len,ew?len:.8,1.1,c);box(I.x0+x,1.13,I.z0+z,ew?1:len+.1,.06,ew?len+.1:1,mt(0x1a120c,.35),0);
  for(let s=-len/2+.7;s<len/2-.3;s+=1.1){const sx=x+(ew?nx*.95:s),sz=z+(ew?s:nz*.95);cyl(I.x0+sx,.4,I.z0+sz,.05,.8,0x2a2a30);const t=new THREE.Mesh(GC.stool||(GC.stool=new THREE.CylinderGeometry(.24,.24,.08,14)),mt(c,.6));t.position.set(I.x0+sx,.82,I.z0+sz);sc.add(t)}
  for(let s=-len/2+.4;s<len/2-.2;s+=.35){const b=new THREE.Mesh(GC.btl||(GC.btl=new THREE.CylinderGeometry(.04,.05,.3,8)),mt(pick([0x2a6a3a,0x6a3a1a,0x3a5a8a,0xc9a046]),.2));b.position.set(I.x0+x-(ew?nx*.2:0)+(ew?0:s),1.31,I.z0+z-(ew?0:nz*.2)+(ew?s:0));sc.add(b)}}
function ffoos(I,x,z){fb(I,x,z,2.2,1.2,.9,0x2a2a30);fb(I,x,z,2,1,.04,0x2f8a3a,.9,0);for(let i=0;i<6;i++)box(I.x0+x-.85+i*.34,1.05,I.z0+z,.03,.03,1.7,0xcfd4d8,0)}
function fhockey(I,x,z){fb(I,x,z,2.4,1.3,.82,0x1f3a7a);fb(I,x,z,2.2,1.1,.03,0xf2f4f6,.82,0);for(const s of[-1,1]){const p=new THREE.Mesh(GC.puck||(GC.puck=new THREE.CylinderGeometry(.09,.09,.06,14)),mt(s<0?0xd63a3a:0x3a7ad6,.4));p.position.set(I.x0+x+s*.8,.88,I.z0+z);sc.add(p)}}
function farcade(I,x,z,face,c){const[nx,nz]=FACE[face],ew=nx!==0;fb(I,x,z,ew?.8:.9,ew?.9:.8,1.9,c);const s=new THREE.Mesh(bgeo(ew?.04:.7,.55,ew?.7:.04),bm(pick([0x2a4a7a,0x4a2a6a,0x2a5a4a])));s.position.set(I.x0+x+nx*.42,1.45,I.z0+z+nz*.42);sc.add(s);box(I.x0+x+nx*.45,1.02,I.z0+z+nz*.45,ew?.3:.7,.06,ew?.7:.3,0x1a1a1e,0)}
function fround(I,x,z,rad,c=0x4a2a18,n=4){cyl(I.x0+x,.86,I.z0+z,rad,.07,c);cyl(I.x0+x,.42,I.z0+z,.12,.84,0x2a170c);markR(I.x0+x-rad,I.z0+z-rad,I.x0+x+rad,I.z0+z+rad,.95);for(let i=0;i<n;i++){const a=i/n*TAU+PI/4;fchair(I,x+Math.cos(a)*(rad+.55),z+Math.sin(a)*(rad+.55))}}
function ftroph(I,x,z,face,len){const[nx,nz]=FACE[face],ew=nx!==0;fb(I,x,z,ew?.6:len,ew?len:.6,2.1,0x3a2415);const gm=mt(0xd8b048,.3,.8);
  for(const yy of[.9,1.5])for(let s=-len/2+.35;s<len/2-.2;s+=.5){const c_=new THREE.Mesh(GC.cupg||(GC.cupg=new THREE.CylinderGeometry(.1,.05,.22,10)),gm);c_.position.set(I.x0+x+(ew?nx*.32:s),yy+.2,I.z0+z+(ew?s:nz*.32));sc.add(c_)}
  const gl=new THREE.Mesh(bgeo(ew?.02:len-.1,1.6,ew?len-.1:.02),SM({color:0xcfe6ef,transparent:true,opacity:.18,roughness:.05}));gl.position.set(I.x0+x+nx*.31,1.25,I.z0+z+nz*.31);sc.add(gl)}
function flampF(I,x,z){cyl(I.x0+x,.85,I.z0+z,.04,1.7,0x2a2a30);const s=new THREE.Mesh(GC.lshade||(GC.lshade=new THREE.CylinderGeometry(.22,.3,.36,14,1,true)),SM({color:0xe8d8b8,emissive:0x2a2014,side:THREE.DoubleSide,roughness:.9}));s.position.set(I.x0+x,1.8,I.z0+z);sc.add(s);markR(I.x0+x-.25,I.z0+z-.25,I.x0+x+.25,I.z0+z+.25,1.9)}

// ---------------------------------------------------------------- wall decor pieces (local +z points into the room)
const LMAT={};const litMat=t=>LMAT[t.uuid]||(LMAT[t.uuid]=SM({map:t,roughness:.8}));
function wallGrp(I,x,z,face,y){const g=new THREE.Group();g.position.set(I.x0+x,y,I.z0+z);g.rotation.y=fry(face);sc.add(g);return g}
function frameAt(I,x,z,face,y,w,h,tex,fc=0xb08a3a,mat=.08){const g=wallGrp(I,x,z,face,y);const F=mt(fc,.45,fc===0xb08a3a||fc===0xc9a046?.5:0);
  const fr=new THREE.Mesh(bgeo(+(w+.2+mat*2).toFixed(2),+(h+.2+mat*2).toFixed(2),.07),F);fr.position.z=.035;fr.castShadow=true;g.add(fr);
  if(mat){const m=new THREE.Mesh(bgeo(+(w+mat*2).toFixed(2),+(h+mat*2).toFixed(2),.02),mt(0xf2ede0,.9));m.position.z=.075;g.add(m)}
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),litMat(tex));p.position.z=.09;g.add(p);return g}
const PADT={};
function paddleTex(L,col,v){const k=L+col+v;if(PADT[k])return PADT[k];const C=hexS(col),wood=v%2?'#c89a62':'#7a4e2c';
  return PADT[k]=ctex(64,192,(q,W,H)=>{q.clearRect(0,0,W,H);const path=()=>{q.beginPath();if(q.roundRect)q.roundRect(4,4,56,128,22);else q.rect(4,4,56,128);q.rect(25,120,14,62);q.fill()};
    q.fillStyle=v===2?C:wood;path();q.save();q.beginPath();if(q.roundRect)q.roundRect(4,4,56,128,22);else q.rect(4,4,56,128);q.rect(25,120,14,62);q.clip();
    q.strokeStyle='rgba(0,0,0,.18)';for(let i=0;i<9;i++){q.beginPath();q.moveTo(8+i*6,0);q.lineTo(10+i*6,H);q.stroke()}
    if(v!==2){q.fillStyle=C;q.fillRect(0,v===3?96:18,W,14)}q.fillStyle='#e2b64c';q.fillRect(0,v===3?112:34,W,3);
    q.fillStyle=v===2?'#f2e2b0':C;q.font='bold 26px Georgia,serif';q.textAlign='center';q.textBaseline='middle';const ls=[...L.replace(/ .*/,'')];ls.forEach((ch,i)=>q.fillText(ch,32,(v===3?30:62)+i*26-(ls.length-1)*4));
    q.fillStyle='#2a170c';q.fillRect(25,176,14,8);q.restore()})}
function paddleMesh(L,col,v){const t=paddleTex(L,col,v);const m=new THREE.Mesh(GC.padg||(GC.padg=new THREE.PlaneGeometry(.42,1.26)),PADT[t.uuid+'m']||(PADT[t.uuid+'m']=SM({map:t,alphaTest:.5,roughness:.55,side:THREE.DoubleSide})));m.castShadow=true;return m}
function wpaddles(I,x,z,face,y,n,L,col,v){const g=wallGrp(I,x,z,face,y);if(n===2){for(const s of[-1,1]){const p=paddleMesh(L,col,v);p.rotation.z=s*.55;p.position.set(s*.02,0,.03+(s>0?.01:0));g.add(p)}return g}
  const sp=.56,rack=new THREE.Mesh(bgeo(+(n*sp+.2).toFixed(2),.1,.08),mt(0x3a2415,.6));rack.position.set(0,.72,.04);g.add(rack);
  for(let i=0;i<n;i++){const p=paddleMesh(L,col,(v+i)%4);p.position.set((i-(n-1)/2)*sp,-.05,.05+i*.002);p.rotation.z=(i%2?.05:-.05);g.add(p)}return g}
const GRPT={};
function grpTex(L,col,year,bg,big){const k=L+col+year+bg+(big?1:0);if(GRPT[k])return GRPT[k];const C=hexS(col);
  return GRPT[k]=ctex(256,128,(q,W,H)=>{if(bg===0){q.fillStyle='#9a4a32';q.fillRect(0,0,W,H);for(let y=0;y<90;y+=8)for(let x=(y/8)%2*8;x<W;x+=16){q.fillStyle=shade('#9a4a32',rnd()*20-10);q.fillRect(x,y,15,7)}q.fillStyle='#ece6d6';for(const cx of[30,100,156,226])q.fillRect(cx-6,0,12,90);q.fillStyle='#bdb5a4';q.fillRect(0,86,W,42)}
    else if(bg===1){const g=q.createLinearGradient(0,0,0,H);g.addColorStop(0,'#8ab8de');g.addColorStop(.55,'#cfe2ee');g.addColorStop(.56,'#4a7a9a');g.addColorStop(1,'#3a6a3a');q.fillStyle=g;q.fillRect(0,0,W,H);q.fillStyle='#2f5a2f';q.beginPath();q.moveTo(0,70);q.quadraticCurveTo(80,40,160,66);q.quadraticCurveTo(210,52,W,64);q.lineTo(W,80);q.lineTo(0,80);q.fill()}
    else{q.fillStyle='#5a5a62';q.fillRect(0,0,W,H);for(let y=0;y<H;y+=10){q.fillStyle=y%20?'#6a6a72':'#4a4a52';q.fillRect(0,y,W,5)}}
    const rows=big?[[34,13],[56,12],[80,11]]:[[40,10],[64,9],[88,8]];rows.forEach(([y,n],ri)=>{for(let i=0;i<n;i++){const x=W/2+(i-(n-1)/2)*(W-24)/n+(ri%2?6:0);q.fillStyle=ri===2&&rnd()<.5?'#f2f2ee':C;q.fillRect(x-7,y+5,14,22);
      q.fillStyle=pick(['#e8c0a0','#c08a5c','#8a5a3a','#f0d0b8','#6e4630']);q.beginPath();q.ellipse(x,y,5,6,0,0,TAU);q.fill();q.fillStyle=pick(['#2a1d14','#4a3020','#c9a46a','#151515','#7a3a1a']);q.beginPath();q.ellipse(x,y-3,5.4,3.6,0,PI,0);q.fill()}});
    q.fillStyle='rgba(20,16,12,.85)';q.fillRect(0,H-18,W,18);q.fillStyle='#f2e6c4';q.font='bold 12px Georgia,serif';q.textAlign='center';q.textBaseline='middle';q.fillText(L.replace(/ .*/,'')+'  ·  '+pick(['FALL','SPRING','FORMAL','BID DAY','HOMECOMING'])+' '+year,W/2,H-9);
    const v=q.createRadialGradient(W/2,H/2,40,W/2,H/2,150);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(60,40,10,.35)');q.fillStyle=v;q.fillRect(0,0,W,H)})}
const PORT=[];function portraitTex(){if(PORT.length<5)PORT.push(ctex(96,128,(q,W,H)=>{const g=q.createRadialGradient(48,50,8,48,60,90);g.addColorStop(0,pick(['#5a4a3a','#3a4a3a','#4a3a4a']));g.addColorStop(1,'#140f0a');q.fillStyle=g;q.fillRect(0,0,W,H);
  q.fillStyle=pick(['#1a1a24','#2a1a14','#1a2430']);q.beginPath();q.moveTo(10,H);q.quadraticCurveTo(14,78,48,74);q.quadraticCurveTo(82,78,86,H);q.fill();q.fillStyle='#ece6d6';q.beginPath();q.moveTo(40,76);q.lineTo(48,96);q.lineTo(56,76);q.fill();q.fillStyle=pick(['#7a1f2c','#1f2c52','#2a4a2a']);q.fillRect(46,80,4,18);
  q.fillStyle=pick(['#e0b090','#d8a888','#c08a5c','#f0c8a8']);q.beginPath();q.ellipse(48,50,15,19,0,0,TAU);q.fill();q.fillStyle=pick(['#d8d8d8','#a8a8a8','#3a2a1a','#6a5a4a']);q.beginPath();q.ellipse(48,38,16,10,0,PI,0);q.fill();
  q.fillStyle='rgba(0,0,0,.4)';q.fillRect(41,48,4,2);q.fillRect(51,48,4,2);q.fillRect(44,60,8,1.5)}));return pick(PORT)}
const SEAS=[];function seaTex(){if(SEAS.length<3)SEAS.push(ctex(128,96,(q,W,H)=>{const g=q.createLinearGradient(0,0,0,H);g.addColorStop(0,'#c8b890');g.addColorStop(.5,'#e6d6aa');g.addColorStop(.52,'#3a5a6a');g.addColorStop(1,'#1f3a4a');q.fillStyle=g;q.fillRect(0,0,W,H);
  q.strokeStyle='rgba(255,255,255,.25)';for(let i=0;i<14;i++){q.beginPath();const y=56+rnd()*36,x=rnd()*W;q.moveTo(x,y);q.quadraticCurveTo(x+6,y-3,x+12,y);q.stroke()}
  const sx=30+rnd()*50;q.fillStyle='#3a2414';q.beginPath();q.moveTo(sx-22,58);q.lineTo(sx+24,58);q.lineTo(sx+16,66);q.lineTo(sx-16,66);q.fill();q.fillStyle='#f2ecd8';for(const[o,h]of[[-10,30],[4,36],[16,24]]){q.beginPath();q.moveTo(sx+o,56);q.lineTo(sx+o,56-h);q.lineTo(sx+o+10,56-h*.3);q.fill()}}));return pick(SEAS)}
function pellYachtDraw(q,W,H){
  const K=W/640;q.save();q.scale(K,K);
  let sd=11;const R=()=>(sd=sd*16807%2147483647)/2147483647;
  const HZ=236,WL=294,SX=548,TAU=6.2832;
  let g=q.createLinearGradient(0,0,0,HZ);
  g.addColorStop(0,'#10173a');g.addColorStop(.3,'#3b2a63');g.addColorStop(.55,'#a9446e');g.addColorStop(.8,'#ee7f4a');g.addColorStop(1,'#ffd68a');
  q.fillStyle=g;q.fillRect(0,0,640,HZ+1);
  for(let i=0;i<22;i++){q.fillStyle='rgba(255,240,220,'+(.25+R()*.45)+')';q.fillRect(R()*640,R()*70,1,1)}
  g=q.createRadialGradient(SX,HZ,4,SX,HZ,210);g.addColorStop(0,'rgba(255,232,170,.95)');g.addColorStop(.25,'rgba(255,170,90,.45)');g.addColorStop(1,'rgba(255,120,70,0)');
  q.fillStyle=g;q.fillRect(0,0,640,HZ);
  for(let i=0;i<11;i++){const cx=R()*640,cy=26+R()*165,w=50+R()*130,h=2+R()*4,warm=cy>110;
    for(let k=0;k<3;k++){q.fillStyle='rgba('+(warm?255:200)+','+(warm?165:120)+','+(warm?120:160)+','+(.07+R()*.07)+')';
      q.beginPath();q.ellipse(cx+k*6,cy+k*1.5,w*(1-k*.18),h*(1+k*.5),0,0,TAU);q.fill()}}
  q.fillStyle='#fff3c8';q.beginPath();q.arc(SX,HZ,25,Math.PI,0);q.fill();
  q.fillStyle='#4a2f58';q.beginPath();q.moveTo(0,HZ);q.lineTo(0,224);q.bezierCurveTo(40,215,74,223,112,230);q.bezierCurveTo(134,233,152,235,176,HZ);q.fill();
  q.strokeStyle='#2a1d3c';q.lineWidth=1.4;q.lineCap='round';
  for(const[bx,by]of[[96,92],[116,102],[134,88]]){q.beginPath();q.moveTo(bx-5,by);q.quadraticCurveTo(bx-2,by-4,bx,by);q.quadraticCurveTo(bx+2,by-4,bx+5,by);q.stroke()}
  g=q.createLinearGradient(0,HZ,0,384);g.addColorStop(0,'#eb9760');g.addColorStop(.08,'#9a5a73');g.addColorStop(.3,'#3a3c68');g.addColorStop(1,'#101c3a');
  q.fillStyle=g;q.fillRect(0,HZ,640,384-HZ);
  for(let y=HZ+1;y<384;y+=2.5){const t=(y-HZ)/(384-HZ),w=16+t*90,a=.62-.44*t;
    for(let k=0;k<4;k++){q.fillStyle='rgba(255,214,140,'+(a*(.35+R()*.65))+')';q.fillRect(SX-w/2+R()*w*.7,y,w*(.15+R()*.4),1+t*1.6)}}
  for(let i=0;i<90;i++){const t=Math.pow(R(),1.4),y=HZ+4+t*146,l=8+t*40,x=R()*640;
    q.fillStyle=R()<.5?'rgba(255,200,150,.09)':'rgba(10,20,50,.22)';q.fillRect(x,y,l,1+t*1.2)}
  const SH=[];for(let i=0;i<=100;i++){const t=i/100,u=1-t;SH.push([u*u*118+2*u*t*300+t*t*512,u*u*256+2*u*t*258+t*t*244])}
  const sy=x=>{for(let i=1;i<SH.length;i++)if(SH[i][0]>=x){const a=SH[i-1],b=SH[i],f=(x-a[0])/(b[0]-a[0]||1);return a[1]+(b[1]-a[1])*f}return SH[100][1]};
  const poly=(pts,fill)=>{q.beginPath();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();q.fillStyle=fill;q.fill()};
  const white=(x0,x1)=>{const w=q.createLinearGradient(x0,0,x1,0);w.addColorStop(0,'#c4b2ae');w.addColorStop(.6,'#f6ead8');w.addColorStop(1,'#fff3d4');return w};
  const glass=(pts,x0,x1)=>{const w=q.createLinearGradient(x0,0,x1,0);w.addColorStop(0,'#141e3c');w.addColorStop(.7,'#2a3860');w.addColorStop(1,'#6c5a7c');poly(pts,w)};
  const rim=(a,b,c,d)=>{q.strokeStyle='rgba(255,232,172,.95)';q.lineWidth=1.3;q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke()};
  const gold='#d9a94a';
  const body=()=>{
    poly([[196,264],[196,234],[434,231],[470,264]],white(196,470));
    glass([[206,252],[206,238],[430,235],[458,252]],206,458);
    for(let i=0;i<9;i++){if((i*7)%10<6){const x0=210+i*26;g=q.createLinearGradient(0,238,0,252);g.addColorStop(0,'#ffe3a0');g.addColorStop(1,'#ffb860');q.fillStyle=g;q.fillRect(x0,238-i*.12,21,14)}}
    q.fillStyle='#fff1d8';for(let i=0;i<=9;i++)q.fillRect(207+i*26,236-i*.12,2,16);
    poly([[330,252],[350,236],[372,235],[352,252]],'rgba(255,190,120,.25)');
    rim(434,231,470,264);
    poly([[236,236],[236,214],[398,211],[430,236]],white(236,430));
    glass([[244,230],[244,218],[396,215],[420,230]],244,420);
    q.fillStyle='#fff1d8';for(let i=0;i<=5;i++)q.fillRect(246+i*31,218-i*.4,2,12);
    poly([[300,230],[322,216],[344,215],[322,230]],'rgba(255,190,120,.28)');
    rim(398,211,430,236);
    poly([[274,214],[274,196],[362,193],[388,214]],white(274,388));
    glass([[282,209],[282,200],[360,197],[380,209]],282,380);
    q.fillStyle='#fff1d8';for(let i=0;i<=4;i++)q.fillRect(284+i*24,200-i*.4,2,9);
    rim(362,193,388,214);
    poly([[140,231],[440,229],[448,235],[140,237]],'#fbf0dc');poly([[140,237],[448,235],[448,237.5],[140,239.5]],'#a98f86');
    poly([[226,211],[404,208],[412,214],[226,216]],'#fbf0dc');poly([[226,216],[412,214],[412,216],[226,218]],'#a98f86');
    poly([[268,194],[366,191],[394,197],[268,199]],'#fbf0dc');poly([[268,199],[394,197],[394,199],[268,201]],'#a98f86');
    q.strokeStyle=gold;q.lineWidth=1;for(const[a,b,c,d]of[[140,237.5,448,235.5],[226,217,412,215],[268,200,394,198]]){q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke()}
    q.beginPath();q.moveTo(118,256);q.quadraticCurveTo(300,260,512,244);q.bezierCurveTo(506,270,490,288,468,WL);q.lineTo(132,WL);q.lineTo(118,256);q.closePath();
    g=q.createLinearGradient(118,0,512,0);g.addColorStop(0,'#0c1330');g.addColorStop(.6,'#1a2650');g.addColorStop(1,'#46386a');q.fillStyle=g;q.fill();q.save();q.clip();
    g=q.createLinearGradient(400,0,512,0);g.addColorStop(0,'rgba(255,170,100,0)');g.addColorStop(1,'rgba(255,170,100,.4)');q.fillStyle=g;q.fillRect(400,230,120,70);
    g=q.createLinearGradient(0,244,0,WL);g.addColorStop(0,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(0,0,0,.25)');q.fillStyle=g;q.fillRect(100,230,430,70);
    q.fillStyle='#8a2330';q.fillRect(100,WL-4,430,5);q.fillStyle=gold;q.fillRect(100,WL-5.2,430,1.2);
    q.beginPath();for(let x=110;x<=520;x+=6){const y=sy(x)+(x>512?0:0);x===110?q.moveTo(x,y):q.lineTo(x,y)}for(let x=520;x>=110;x-=6)q.lineTo(x,sy(x)+3.4);q.closePath();q.fillStyle='#f6ead8';q.fill();
    q.restore();
    q.strokeStyle=gold;q.lineWidth=1.2;q.beginPath();for(let x=124;x<=506;x+=6){x===124?q.moveTo(x,sy(x)+9):q.lineTo(x,sy(x)+9)}q.stroke();
    for(let i=0,x=150;x<466;x+=15,i++){q.fillStyle=(i*5)%10<7?'#ffd37a':'#2a3560';q.beginPath();q.arc(x,sy(x)+17,2.3,0,TAU);q.fill()}
    q.fillStyle='#d4a443';q.font='italic bold 9px Georgia,serif';let tx=344;for(const ch of 'THE LANTERN'){q.fillText(ch,tx,sy(tx)+31);tx+=q.measureText(ch).width+2}
    q.fillStyle='#b98a4f';q.fillRect(108,WL-7,26,3);
    q.fillStyle='#e9e0d2';for(const x of[150,190]){q.fillRect(x-1.5,237,3,sy(x)-237)}
    g=q.createLinearGradient(0,237,0,258);g.addColorStop(0,'rgba(255,200,110,.6)');g.addColorStop(1,'rgba(255,160,70,.1)');q.fillStyle=g;q.fillRect(152,237,36,20);
    q.fillStyle='#7a4a2a';q.fillRect(160,248,20,2);q.fillStyle='#ffe3a2';q.fillRect(164,245,12,3);q.fillStyle='#4a3020';for(const cx of[160,178])q.fillRect(cx,250,2,4);
    q.strokeStyle='#f4ead6';q.lineWidth=1;q.beginPath();q.moveTo(120,sy(120)-9);q.lineTo(196,sy(196)-9);q.stroke();
    for(let x=122;x<=196;x+=6){q.beginPath();q.moveTo(x,sy(x));q.lineTo(x,sy(x)-9);q.stroke()}
    q.fillStyle='rgba(220,236,255,.18)';q.fillRect(120,sy(120)-9,76,9);
    q.strokeStyle='#f4ead6';q.beginPath();q.moveTo(142,221);q.lineTo(232,221);q.stroke();
    for(let x=142;x<=232;x+=6){q.beginPath();q.moveTo(x,231);q.lineTo(x,221);q.stroke()}
    q.fillStyle='rgba(220,236,255,.18)';q.fillRect(142,221,90,10);
    q.fillStyle='#efe6d4';q.beginPath();q.ellipse(186,231,40,4.2,0,0,TAU);q.fill();
    q.strokeStyle=gold;q.lineWidth=1;q.beginPath();q.ellipse(186,231,30,3,0,0,TAU);q.stroke();
    q.strokeStyle='#d9a94a';q.lineWidth=1.4;q.beginPath();q.moveTo(180,229.6);q.lineTo(180,232.6);q.moveTo(192,229.6);q.lineTo(192,232.6);q.moveTo(180,231);q.lineTo(192,231);q.stroke();
    q.fillStyle='#161f3a';q.beginPath();q.ellipse(186,224,13,6.5,0,0,TAU);q.fill();
    poly([[176,222],[148,220],[148,223],[176,226]],'#161f3a');poly([[148,214],[153,214],[150,223],[146,223]],'#161f3a');
    q.fillStyle='#8fb4d2';q.beginPath();q.ellipse(193,223,5,3.6,0,0,TAU);q.fill();
    q.strokeStyle='#161f3a';q.lineWidth=1.2;q.beginPath();q.moveTo(186,218);q.lineTo(186,215);q.moveTo(176,230);q.lineTo(197,230);q.moveTo(180,227);q.lineTo(180,230);q.moveTo(192,227);q.lineTo(192,230);q.stroke();
    q.strokeStyle='rgba(22,31,58,.55)';q.lineWidth=.9;q.beginPath();q.moveTo(150,214.4);q.lineTo(224,215.6);q.stroke();
    q.strokeStyle='#fbf0dc';q.lineWidth=3;q.beginPath();q.moveTo(286,192);q.quadraticCurveTo(322,142,366,192);q.stroke();
    q.lineWidth=1.2;q.beginPath();q.moveTo(338,192);q.lineTo(339,146);q.moveTo(329,157);q.lineTo(350,157);q.stroke();
    q.fillStyle='#fbf0dc';q.beginPath();q.arc(308,168,5.5,0,TAU);q.fill();q.beginPath();q.arc(326,157,4,0,TAU);q.fill();
    poly([[339,146],[360,150],[339,155]],gold);
    q.strokeStyle='#cfc4b6';q.lineWidth=.8;q.beginPath();q.moveTo(368,196);q.lineTo(376,180);q.moveTo(376,196);q.lineTo(384,182);q.stroke();
    q.strokeStyle='#f4ead6';q.lineWidth=1;q.beginPath();q.moveTo(474,sy(474)-8);q.lineTo(510,sy(510)-8);q.stroke();
    for(let x=476;x<=510;x+=7){q.beginPath();q.moveTo(x,sy(x));q.lineTo(x,sy(x)-8);q.stroke()}
    q.strokeStyle='#cfc4b6';q.beginPath();q.moveTo(124,sy(124));q.lineTo(124,sy(124)-24);q.stroke();
    poly([[124,sy(124)-24],[136,sy(124)-21],[124,sy(124)-18]],'#b3202e');
  };
  q.save();q.beginPath();q.rect(0,WL,640,60);q.clip();q.translate(0,WL);q.scale(1,-.5);q.translate(0,-WL);q.globalAlpha=.24;body();q.restore();
  for(let y=WL+1;y<WL+50;y+=2.4){q.fillStyle='rgba(22,30,64,'+(.2+R()*.2)+')';q.fillRect(100+R()*20,y,400,1)}
  g=q.createLinearGradient(30,0,122,0);g.addColorStop(0,'rgba(255,236,210,0)');g.addColorStop(1,'rgba(255,236,210,.5)');
  q.fillStyle=g;q.beginPath();q.moveTo(122,WL-3);q.lineTo(8,WL-8);q.lineTo(8,WL+14);q.lineTo(122,WL+1);q.fill();
  for(let i=0;i<30;i++){q.fillStyle='rgba(255,240,225,'+(.15+R()*.3)+')';q.fillRect(14+R()*104,WL-6+R()*18,4+R()*14,1)}
  body();
  q.fillStyle='rgba(255,246,232,.9)';q.beginPath();q.ellipse(476,WL-1,22,3.4,0,0,TAU);q.fill();q.beginPath();q.ellipse(496,WL-3,12,2.2,0,0,TAU);q.fill();
  q.strokeStyle='rgba(255,236,210,.35)';q.lineWidth=1.2;q.beginPath();q.moveTo(472,WL+1);q.quadraticCurveTo(432,WL+8,374,WL+30);q.moveTo(480,WL);q.quadraticCurveTo(452,WL+14,422,WL+44);q.stroke();
  for(let i=0;i<14;i++){q.fillStyle='rgba(255,250,240,.7)';q.fillRect(488+R()*22,WL-14+R()*10,1.2,1.2)}
  g=q.createRadialGradient(320,200,150,320,200,420);g.addColorStop(0,'rgba(8,6,26,0)');g.addColorStop(1,'rgba(8,6,26,.4)');q.fillStyle=g;q.fillRect(0,0,640,384);
  for(let i=0;i<1400;i++){q.fillStyle=R()<.5?'rgba(255,255,255,.035)':'rgba(0,0,0,.05)';q.fillRect(R()*640,R()*384,1.5,1.5)}
  q.restore();
}
const PELLYT=[];function pellYachtTex(){return PELLYT[0]||(PELLYT[0]=ctex(640,384,pellYachtDraw))}
const PENT={};function pennantTex(L,col){const k=L+col;if(PENT[k])return PENT[k];return PENT[k]=ctex(256,96,(q,W,H)=>{q.clearRect(0,0,W,H);q.fillStyle=hexS(col);q.beginPath();q.moveTo(0,4);q.lineTo(W,H/2);q.lineTo(0,H-4);q.fill();q.fillStyle='#f2ecd8';q.fillRect(0,4,16,H-8);q.font='bold 34px Georgia,serif';q.textBaseline='middle';q.fillText(L.replace(/ .*/,''),26,H/2+1)})}
function wpennants(I,x,z,face,y,L,col){const g=wallGrp(I,x,z,face,y);const t=pennantTex(L,col),m=SM({map:t,alphaTest:.5,roughness:.9,side:THREE.DoubleSide});
  for(const s of[-1,1]){const p=new THREE.Mesh(GC.pen||(GC.pen=new THREE.PlaneGeometry(1.4,.52)),m);p.position.set(.1,s*.3,.03+(s>0?.01:0));p.rotation.z=-s*.1;g.add(p)}return g}
function woars(I,x,z,face,y,col){const g=wallGrp(I,x,z,face,y);const W_=mt(0xc89a62,.5),Cm=mt(col,.5);
  for(const s of[-1,1]){const o=new THREE.Group();const sh=new THREE.Mesh(GC.oar||(GC.oar=new THREE.CylinderGeometry(.035,.035,2.6,8)),W_);o.add(sh);const bl=new THREE.Mesh(bgeo(.22,.62,.03),Cm);bl.position.y=1.5;o.add(bl);const gp=new THREE.Mesh(GC.oarg||(GC.oarg=new THREE.CylinderGeometry(.045,.045,.4,8)),mt(0x1a1a1e,.8));gp.position.y=-1.15;o.add(gp);o.rotation.z=s*.62;o.position.z=.06+(s>0?.04:0);o.traverse(m=>m.castShadow=true);g.add(o)}return g}
function wmirror(I,x,z,face,y){const g=wallGrp(I,x,z,face,y);const fr=new THREE.Mesh(bgeo(1.2,1.7,.06),mt(0xc9a046,.35,.6));fr.position.z=.03;g.add(fr);const m=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.5),SM({color:0xdfe8ec,roughness:.05,metalness:1}));m.position.z=.065;g.add(m);return g}
let CLOCKT=null;function wclock(I,x,z,face,y){const g=wallGrp(I,x,z,face,y);if(!CLOCKT)CLOCKT=ctex(128,128,(q,W,H)=>{q.fillStyle='#f2ecd8';q.fillRect(0,0,W,H);q.fillStyle='#1d1a16';q.font='bold 14px Georgia,serif';q.textAlign='center';q.textBaseline='middle';for(let i=1;i<=12;i++){const a=i/12*TAU;q.fillText(['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][i-1],64+Math.sin(a)*48,64-Math.cos(a)*48)}q.lineWidth=4;q.strokeStyle='#1d1a16';q.beginPath();q.moveTo(64,64);q.lineTo(64,30);q.moveTo(64,64);q.lineTo(88,72);q.stroke()});
  const rim=new THREE.Mesh(GC.clk||(GC.clk=new THREE.CylinderGeometry(.42,.42,.08,28).rotateX(PI/2)),mt(0x3a2415,.5));rim.position.z=.04;g.add(rim);const f=new THREE.Mesh(GC.clkf||(GC.clkf=new THREE.CircleGeometry(.36,28)),litMat(CLOCKT));f.position.z=.085;g.add(f);return g}
const JERT={};function wjersey(I,x,z,face,y,col,num){const k=col+'|'+num;const t=JERT[k]||(JERT[k]=ctex(128,128,(q,W,H)=>{q.fillStyle='#1a1a1e';q.fillRect(0,0,W,H);q.fillStyle=hexS(col);q.beginPath();q.moveTo(36,16);q.lineTo(52,22);q.lineTo(76,22);q.lineTo(92,16);q.lineTo(120,36);q.lineTo(106,54);q.lineTo(96,48);q.lineTo(96,118);q.lineTo(32,118);q.lineTo(32,48);q.lineTo(22,54);q.lineTo(8,36);q.closePath();q.fill();q.fillStyle='#f2ecd8';q.font='bold 40px Archivo,Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(num,64,78);q.fillRect(32,104,64,4)}));
  return frameAt(I,x,z,face,y,1.0,1.0,t,0x1a1a1e,0)}
function wdart(I,x,z,face,y){const g=wallGrp(I,x,z,face,y);const t=HTEX.dart||(HTEX.dart=ctex(128,128,(q,W,H)=>{q.fillStyle='#1a1a1a';q.fillRect(0,0,W,H);for(let i=0;i<20;i++){const a0=i/20*TAU-PI/20;for(const[r0,r1,c]of[[60,52,i%2?'#2a8a3a':'#c8202a'],[52,34,i%2?'#f2ecd8':'#1a1a1a'],[34,28,i%2?'#2a8a3a':'#c8202a'],[28,8,i%2?'#f2ecd8':'#1a1a1a']]){q.fillStyle=c;q.beginPath();q.arc(64,64,r0,a0,a0+TAU/20);q.arc(64,64,r1,a0+TAU/20,a0,true);q.fill()}}q.fillStyle='#2a8a3a';q.beginPath();q.arc(64,64,8,0,TAU);q.fill();q.fillStyle='#c8202a';q.beginPath();q.arc(64,64,4,0,TAU);q.fill()}));
  const b=new THREE.Mesh(GC.dartb||(GC.dartb=new THREE.CylinderGeometry(.3,.3,.06,28).rotateX(PI/2)),mt(0x1a1a1a,.8));b.position.z=.03;g.add(b);const f=new THREE.Mesh(GC.dartf||(GC.dartf=new THREE.CircleGeometry(.29,28)),litMat(t));f.position.z=.062;g.add(f);
  const cab=new THREE.Mesh(bgeo(.9,.9,.05),mt(0x3a2415,.6));cab.position.z=-.0;g.add(cab);return g}
function wbanner(I,x,z,face,y,L,col){const k='ban'+L+col;const t=HTEX[k]||(HTEX[k]=ctex(96,160,(q,W,H)=>{q.fillStyle=hexS(col);q.fillRect(0,0,W,H-20);q.beginPath();q.moveTo(0,H-20);q.lineTo(W/2,H);q.lineTo(W,H-20);q.fill();q.fillStyle='#e2b64c';q.fillRect(0,8,W,4);q.fillRect(6,0,3,H-22);q.fillRect(W-9,0,3,H-22);q.fillStyle='#f2ecd8';q.font='bold 30px Georgia,serif';q.textAlign='center';q.textBaseline='middle';[...L.replace(/ .*/,'')].forEach((c,i,a)=>q.fillText(c,W/2,62+i*32-(a.length-1)*12));
    q.strokeStyle='#e2b64c';q.lineWidth=2;q.beginPath();q.arc(W/2,H-44,9,0,TAU);q.stroke()}));
  const g=wallGrp(I,x,z,face,y);const p=new THREE.Mesh(GC.ban||(GC.ban=new THREE.PlaneGeometry(1.3,2.2)),SM({map:t,roughness:.95,side:THREE.DoubleSide,alphaTest:.5}));p.position.z=.03;g.add(p);const rod=new THREE.Mesh(GC.rod||(GC.rod=new THREE.CylinderGeometry(.03,.03,1.6,8).rotateZ(PI/2)),mt(0xc9a046,.35,.6));rod.position.set(0,1.12,.05);g.add(rod);return g}
function wshelfT(I,x,z,face,y,len){const g=wallGrp(I,x,z,face,y);const sh=new THREE.Mesh(bgeo(len,.07,.32),mt(0x3a2415,.6));sh.position.set(0,0,.16);g.add(sh);const gm=mt(0xd8b048,.3,.8),sv=mt(0xcfd4d8,.3,.8);
  for(let i=0;i<4;i++){const m=i%3===1?sv:gm,h=.28+rnd()*.22,cx=(i-1.5)*len/4.4;const c_=new THREE.Mesh(new THREE.CylinderGeometry(.11,.06,h,10),m);c_.position.set(cx,.06+h/2+.08,.16);g.add(c_);const b=new THREE.Mesh(bgeo(.2,.08,.2),mt(0x1a1a1e,.6));b.position.set(cx,.08,.16);g.add(b)}return g}
let DEERG=null;
function deerGeo(){if(DEERG)return DEERG;const P_=[],C1=0x7a5232,C2=0xa4774c,AN=0xe2d4b0,DK=0x1a120c;const add=(geo,c,x,y,z)=>P_.push([geo,c,x,y,z]);
  add(new THREE.CylinderGeometry(.62,.62,.07,6,1).rotateX(PI/2).scale(.8,1,1),0x3a2415,0,0,.035);
  add(new THREE.CylinderGeometry(.2,.25,.55,12).rotateX(PI/2-.5),C1,0,-.08,.3);
  add(new THREE.SphereGeometry(.2,14,10).scale(.85,.9,1.35),C2,0,.12,.55);
  add(new THREE.CylinderGeometry(.075,.13,.32,10).rotateX(PI/2+.25),C2,0,.04,.82);
  add(new THREE.SphereGeometry(.06,10,8),DK,0,0,.98);
  for(const s of[-1,1]){add(new THREE.SphereGeometry(.03,8,6),DK,s*.12,.18,.68);
    add(new THREE.ConeGeometry(.07,.26,8).rotateZ(-s*1.15).scale(1,1,.4),C1,s*.27,.24,.48);
    const seg=(x0,y0,z0,x1,y1,z1,r)=>{const L=Math.hypot(x1-x0,y1-y0,z1-z0),g=new THREE.CylinderGeometry(r*.8,r,L,6);g.translate(0,L/2,0);const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(x1-x0,y1-y0,z1-z0).normalize());g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));add(g,AN,x0,y0,z0)};
    const b0=[s*.1,.28,.5],b1=[s*.3,.55,.45],b2=[s*.42,.85,.5],b3=[s*.38,1.1,.62];seg(...b0,...b1,.035);seg(...b1,...b2,.03);seg(...b2,...b3,.025);
    seg(...b1,s*.24,.82,.62,.02);seg(...b2,s*.3,1.05,.72,.018);seg(...b2,s*.55,1.04,.42,.018);seg(s*.18,.4,.5,s*.12,.55,.72,.018)}
  return DEERG=mergeParts(P_)}
let DEERM=null;function wdeer(I,x,z,face,y){const m=new THREE.Mesh(deerGeo(),DEERM||(DEERM=SM({vertexColors:true,roughness:.75})));m.castShadow=true;m.userData.noMerge=1;m.position.set(I.x0+x,y-.35,I.z0+z);m.rotation.y=fry(face);sc.add(m);return m}

// ---------------------------------------------------------------- choose and hang decor on a list of wall spots
// spot: [x,z,face,y,maxW,tag]
// V119 frat-house wall decor: an American flag themed with the chapter's shield and letters, and beer posters (invented local brands)
// the flag is drawn in the house's colours: stripes in the house colour and cream, the star field (canton) in the first accent colour that
// actually contrasts with it (alts = [rug2, rug, low]; else gold). A light accent becomes the stars on a darkened house-colour canton.
function flagPal(col,alts){const rgb=c=>[c>>16&255,c>>8&255,c&255],lum=c=>{const[r,g,b]=rgb(c);return(.299*r+.587*g+.114*b)/255},dist=(a,b)=>{const A=rgb(a),B=rgb(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2])};
  const shade=(c,f)=>{const[r,g,b]=rgb(c);return(Math.round(r*f)<<16)|(Math.round(g*f)<<8)|Math.round(b*f)};
  let c2=(alts||[]).find(a=>a!=null&&dist(a,col)>=70);if(c2==null)c2=0xc9a046;
  const light=lum(c2)>.5;const canton=light?shade(col,.55):c2;return{stripe:col,cream:0xf2ead0,canton,star:light?c2:0xf2ead0,trim:0xd8b048,ink:lum(col)>.5?canton:col}}
function fratFlagTex(L,col,alts){const P_=flagPal(col,alts),k='flag'+L+col+'|'+P_.canton;if(HTEX[k])return HTEX[k];return HTEX[k]=ctex(608,320,(q,W,H)=>{const sh=H/13;
  for(let i=0;i<13;i++){q.fillStyle=hexS(i%2?P_.cream:P_.stripe);q.fillRect(0,i*sh,W,sh+1)}
  const cw=W*.4,ch=sh*7;q.fillStyle=hexS(P_.canton);q.fillRect(0,0,cw,ch);q.fillStyle=hexS(P_.star);
  const star=(x,y,r)=>{q.beginPath();for(let j=0;j<10;j++){const a=-PI/2+j*PI/5,rr=j%2?r*.42:r;q.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}q.closePath();q.fill()};
  for(let row=0;row<9;row++){const n=row%2?5:6;for(let c=0;c<n;c++)star(cw/12*(1+c*2+(row%2)),ch/10*(1+row),6.2)}
  // the chapter's shield over the stripes: cream with a gold rim, letters in the house colour
  const C=hexS(P_.ink),cx=cw+(W-cw)/2,cy=H/2+4,sw=150,shh=200,GD=hexS(P_.trim);
  const shield=(s)=>{q.beginPath();q.moveTo(cx-sw/2*s,cy-shh/2*s);q.lineTo(cx+sw/2*s,cy-shh/2*s);q.lineTo(cx+sw/2*s,cy+shh*.08*s);q.quadraticCurveTo(cx+sw/2*s,cy+shh*.38*s,cx,cy+shh/2*s);q.quadraticCurveTo(cx-sw/2*s,cy+shh*.38*s,cx-sw/2*s,cy+shh*.08*s);q.closePath()};
  q.shadowColor='rgba(0,0,0,.45)';q.shadowBlur=10;shield(1.08);q.fillStyle=GD;q.fill();q.shadowBlur=0;shield(1);q.fillStyle='#f4eed8';q.fill();
  shield(.9);q.strokeStyle=C;q.lineWidth=3;q.stroke();
  q.fillStyle=hexS(P_.canton);star(cx,cy-shh*.3,13);
  const lt=L.replace(/ .*/,'');q.font=`bold ${lt.length>2?50:62}px Georgia,serif`;q.textAlign='center';q.textBaseline='middle';q.lineWidth=3;q.strokeStyle=GD;q.strokeText(lt,cx,cy+8);q.fillStyle=C;q.fillText(lt,cx,cy+8);
  q.font='bold 13px Georgia,serif';q.fillStyle=C;q.fillText('EST. 1952',cx,cy+shh*.3);
  // soft folds in the fabric
  for(let x=0;x<W;x+=2){const v=Math.sin(x/W*TAU*3.2)*.5+Math.sin(x/W*TAU*7.1)*.2;q.fillStyle=v>0?`rgba(255,255,255,${v*.07})`:`rgba(0,0,0,${-v*.16})`;q.fillRect(x,0,2,H)}})}
function wflag(I,x,z,face,y,L,col,alts){const g=wallGrp(I,x,z,face,y);const w=3.0,h=1.58;
  const geo=new THREE.PlaneGeometry(w,h,30,1),p=geo.attributes.position;for(let i=0;i<p.count;i++){const u=p.getX(i)/w+.5;p.setZ(i,.03+.035*(1+Math.sin(u*TAU*3.2))+.012*Math.sin(u*TAU*7.1))}geo.computeVertexNormals();
  const m=new THREE.Mesh(geo,SM({map:fratFlagTex(L,col,alts),roughness:.95}));m.position.z=.02;g.add(m);
  const tk=mt(0xc9a046,.35,.6);for(const[a,b]of[[-1,1],[1,1],[-1,-1],[1,-1],[0,1]]){const t=new THREE.Mesh(GC.tack||(GC.tack=new THREE.SphereGeometry(.035,8,6)),tk);t.position.set(a*(w/2-.06),b*(h/2-.06),.1);g.add(t)}
  const[nx,nz]=FACE[face];iobj(I,x+nx*1.4,z+nz*1.4,'Look at the flag',()=>card({title:'The House Flag',sp:L,text:`Old Glory, redone in the house colours, with the chapter's shield and the letters ${L} stitched in over the stripes. Someone ironed it once, in 2009. It hangs on brass tacks, and nobody is allowed to take it down unless it's for a tailgate.`}),1.5);return g}
const BEERS=[['CLIFTON','LIGHT','Easy on the hill.','#1d2f5c','#7fb2e6','can','#c9d4e2'],['QUEEN CITY','AMBER','Brewed on the river since 1888.','#6a1418','#e8b04a','bottle','#a8641c'],
  ['BEARCAT','LAGER','Cold. Crisp. Clawed.','#141414','#e2b64c','can','#d8a83a'],['OHIO RIVER','PILSNER','Float on.','#0f5a5e','#f2e2a0','pint','#e8b43a'],
  ['PORKOPOLIS','PALE ALE','Bring home the bacon.','#c8561c','#ffe6b0','bottle','#7a4a18'],['MILL CREEK','STOUT','Dark as finals week.','#e8dcc0','#2a1a10','pint','#1e120a']];
const BEERT=[];function beerTex(i){if(BEERT[i])return BEERT[i];const[b1,b2,sl,bg,fg,kind,lq]=BEERS[i];return BEERT[i]=ctex(200,300,(q,W,H)=>{
  q.fillStyle=bg;q.fillRect(0,0,W,H);q.save();q.translate(W/2,H*.56);q.globalAlpha=.13;q.fillStyle=fg;for(let j=0;j<16;j++){q.rotate(TAU/16);q.beginPath();q.moveTo(0,0);q.lineTo(-14,-260);q.lineTo(14,-260);q.fill()}q.restore();q.globalAlpha=1;
  const cx=W/2,cy=H*.56;q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.55)';
  if(kind==='can'){q.fillStyle=lq;q.beginPath();q.roundRect?q.roundRect(cx-30,cy-56,60,116,8):q.rect(cx-30,cy-56,60,116);q.fill();q.stroke();q.fillStyle=bg;q.fillRect(cx-30,cy-26,60,52);q.fillStyle=fg;q.font='bold 13px Arial,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(b2,cx,cy);
    q.fillStyle='#e6e6e6';q.beginPath();q.ellipse(cx,cy-56,30,6,0,0,TAU);q.fill();q.stroke();q.fillStyle='rgba(255,255,255,.35)';q.fillRect(cx-22,cy-48,6,100)}
  else if(kind==='bottle'){q.fillStyle=lq;q.beginPath();q.moveTo(cx-9,cy-78);q.lineTo(cx+9,cy-78);q.lineTo(cx+9,cy-44);q.quadraticCurveTo(cx+28,cy-30,cx+28,cy-10);q.lineTo(cx+28,cy+60);q.lineTo(cx-28,cy+60);q.lineTo(cx-28,cy-10);q.quadraticCurveTo(cx-28,cy-30,cx-9,cy-44);q.closePath();q.fill();q.stroke();
    q.fillStyle='#d8b048';q.fillRect(cx-11,cy-84,22,9);q.fillStyle='#f2ead0';q.fillRect(cx-28,cy+2,56,38);q.fillStyle=bg;q.font='bold 11px Arial,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(b2,cx,cy+21);q.fillStyle='rgba(255,255,255,.3)';q.fillRect(cx-20,cy-20,5,76)}
  else{q.fillStyle=lq;q.beginPath();q.moveTo(cx-34,cy-50);q.lineTo(cx+34,cy-50);q.lineTo(cx+26,cy+60);q.lineTo(cx-26,cy+60);q.closePath();q.fill();q.stroke();q.fillStyle='#f6f0dc';q.beginPath();q.moveTo(cx-36,cy-50);for(let j=0;j<=6;j++)q.arc(cx-30+j*10,cy-54,8,PI,0);q.lineTo(cx+34,cy-42);q.lineTo(cx-34,cy-42);q.fill();
    q.fillStyle='rgba(255,255,255,.25)';q.fillRect(cx-24,cy-38,6,92);q.fillStyle='rgba(255,255,255,.55)';for(let j=0;j<7;j++){q.beginPath();q.arc(cx-14+((j*37)%30),cy+50-j*13,1.6,0,TAU);q.fill()}}
  q.textAlign='center';q.textBaseline='alphabetic';q.fillStyle=fg;q.strokeStyle='rgba(0,0,0,.5)';q.lineWidth=4;
  q.lineJoin='round';const mw=W-24;q.font='bold 30px Impact,Arial Black,sans-serif';q.strokeText(b1,cx,48,mw);q.fillText(b1,cx,48,mw);q.font='bold 22px Impact,Arial Black,sans-serif';q.strokeText(b2,cx,76,mw);q.fillText(b2,cx,76,mw);
  q.font='italic 14px Georgia,serif';q.fillText(sl,cx,H-22,mw);q.fillRect(24,H-44,W-48,2);q.fillStyle='rgba(0,0,0,.25)';q.fillRect(0,0,W,4);q.fillRect(0,H-4,W,4)})}
function wbeer(I,x,z,face,y,v,framed){const t=beerTex(v);if(framed)return frameAt(I,x,z,face,y,.95,1.42,t,0x1a1a1e,0);const g=wallGrp(I,x,z,face,y);
  const p=new THREE.Mesh(GC.bposter||(GC.bposter=new THREE.PlaneGeometry(.95,1.42)),litMat(t));p.position.z=.025;p.rotation.z=(v%3-1)*.025;g.add(p);
  const tp=mt(0xe8e0c4,.9);for(const[a,b]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const s=new THREE.Mesh(GC.btape||(GC.btape=new THREE.PlaneGeometry(.16,.06)),tp);s.position.set(a*.45,b*.69,.03);s.rotation.z=a*b*.7;g.add(s)}return g}
/* V265 Big Ed's 1993 mower photo: drawn once from EDPHOTO (filled in when the image has loaded) */
let EDPT=null;function edPhotoTex(){if(EDPT)return EDPT;const c=document.createElement('canvas');c.width=1024;c.height=768;const q=c.getContext('2d');q.fillStyle='#d9c8a2';q.fillRect(0,0,1024,768);const t=new THREE.CanvasTexture(c);t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());const im=new Image();im.onload=()=>{q.drawImage(im,0,0,1024,768);t.needsUpdate=true};im.src=EDPHOTO;EDPT=t;return t}
const DECW={flag:3.2,beer:1.2,paddles:2.0,paddles5:3.1,paddleX:1.2,grp:2.6,grpBig:3.6,paint:2.6,paintM:1.6,paintSea:1.8,portrait:1.2,swords:2.0,deer:1.5,oars:2.6,mirror:1.4,clock:1.0,jersey:1.3,dart:1.0,banner:1.5,pennants:2.8,trophy:2.0,comp:4.2};
const DPOOL={lodge:['deer','deer','oars','paint','paddles','grp','clock','swords','banner','trophy','paddleX'],trad:['portrait','portrait','paint','swords','comp','clock','grp','paddles','mirror','deer','paddleX'],
  sport:['jersey','jersey','pennants','trophy','grp','paddles','dart','grpBig','banner','deer','paddles5'],naut:['oars','oars','paintSea','grp','pennants','clock','paddles','swords','deer','mirror','paintSea'],
  gallery:['paint','paintM','paintM','portrait','paintSea','grpBig','mirror','swords','deer','paddles','paint'],chic:['mirror','paintM','paint','grp','grpBig','pennants','banner','paddles','clock','portrait','paddleX']};
function hangDecor(I,o,s,spots,need){const r=s.r,L=o.letters,col=o.shield;if(!s.soro)need=need.concat(/_up$/.test(I.id)?['beer','beer','beer']:['flag','beer','beer']);const sh=spots.slice();for(let i=sh.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[sh[i],sh[j]]=[sh[j],sh[i]]}
  const used=new Set(),cnt={};const put=(sp,k)=>{const[x,z,f,y]=sp;if(TEST!=null)TESTDECOR.push({k,id:I.id,x:I.x0+x,y,z:I.z0+z,nx:FACE[f][0],nz:FACE[f][1]});cnt[k]=(cnt[k]||0)+1;const yr=1955+Math.floor(r()*69);
    if(k==='paddles')wpaddles(I,x,z,f,y,3,L,col,Math.floor(r()*4));else if(k==='paddles5')wpaddles(I,x,z,f,y,5,L,col,Math.floor(r()*4));else if(k==='paddleX')wpaddles(I,x,z,f,y,2,L,col,Math.floor(r()*4));
    else if(k==='grp')frameAt(I,x,z,f,y,2.1,1.05,grpTex(L,col,yr,Math.floor(r()*3),0),pick([0x1a1a1e,0x3a2415,0xb08a3a]));
    else if(k==='grpBig')frameAt(I,x,z,f,y+.1,3.0,1.5,grpTex(L,col,yr,Math.floor(r()*3),1),pick([0x1a1a1e,0x3a2415,0xb08a3a]));
    else if(k==='paint')frameAt(I,x,z,f,y+.1,2.2,1.5,paintTex(),0xb08a3a,0);else if(k==='paintM')frameAt(I,x,z,f,y,1.3,.95,paintTex(),pick([0xb08a3a,0x3a2415]),0);
    else if(k==='paintSea')frameAt(I,x,z,f,y,1.5,1.1,seaTex(),0xb08a3a,0);else if(k==='portrait')frameAt(I,x,z,f,y+.1,.9,1.2,portraitTex(),0xb08a3a,0);
    else if(k==='swords')fswords(I,x,z,f,y+.2,col);else if(k==='deer')wdeer(I,x,z,f,y);else if(k==='oars')woars(I,x,z,f,y+.2,col);else if(k==='mirror')wmirror(I,x,z,f,y);
    else if(k==='clock')wclock(I,x,z,f,y+.3);else if(k==='jersey')wjersey(I,x,z,f,y,col,String(1+Math.floor(r()*99)));else if(k==='dart')wdart(I,x,z,f,y-.1);
    else if(k==='banner')wbanner(I,x,z,f,y+.2,L,col);else if(k==='pennants')wpennants(I,x,z,f,y+.2,L,col);else if(k==='trophy')wshelfT(I,x,z,f,y-.4,1.8);
    else if(k==='flag')wflag(I,x,z,f,y+.15,L,col,[o.rug2,o.rug,o.low]);else if(k==='beer')wbeer(I,x,z,f,y,Math.floor(r()*BEERS.length),r()<.35);
    else if(k==='comp'){const w=sp[4],n=Math.max(1,Math.floor(w/2.1)),hz=f==='s'||f==='n';for(let i=0;i<n;i++){const d=(i-(n-1)/2)*2.1;const yr2=I.yrs&&I.yrs.length?I.yrs[(I.yi=(I.yi||0)+1)%I.yrs.length]:yr;wframe(I,hz?x+d:x,hz?z:z+d,f,y,1.5,1.3,{comp:[L,yr2]})}}};
  if(I.id==='asr'){const sp=sh.find(p=>p[2]==='s'&&Math.abs(p[0]-12.5)<.5&&Math.abs(p[1]-18.2)<.5)||sh.find(p=>p[4]>=2.4);if(sp){used.add(sp);frameAt(I,sp[0],sp[1],sp[2],sp[3],2.0,1.5,edPhotoTex(),0x1a1815,.06);if(TEST!=null)TESTDECOR.push({k:'edphoto',id:I.id,x:I.x0+sp[0],y:sp[3],z:I.z0+sp[1],nx:FACE[sp[2]][0],nz:FACE[sp[2]][1]})}}   /* V265 Big Ed's mower photo always hangs on the living-room wall (12.5, 18.2) of the ASR ground floor */
  for(const k of need){const sp=sh.find(p=>!used.has(p)&&p[4]>=DECW[k]);if(sp){used.add(sp);put(sp,k)}}
  const pool=(DPOOL[s.theme]||DPOOL.trad).concat(s.soro?[]:['beer','beer']);
  for(const sp of sh){if(used.has(sp))continue;if(r()<.1)continue;let k=null;for(let t=0;t<8&&!k;t++){const c=pool[Math.floor(r()*pool.length)];if(DECW[c]<=sp[4]&&(cnt[c]||0)<(c==='beer'?5:3)&&!(s.soro&&(c==='deer'||c==='swords'||c==='oars')))k=c}
    if(sp[5]==='game'&&r()<.5&&sp[4]>=1)k=pick(['dart','jersey','pennants','paddleX'].concat(s.soro?[]:['beer','beer']).filter(c=>DECW[c]<=sp[4]));if(k){used.add(sp);put(sp,k)}}}

// ---------------------------------------------------------------- room layouts (ground floor of houseInt); each returns the wall spots it leaves free
function hChapter(I,o,s){const v=s.chap;
  if(v===0){frugP(I,24,7.5,14,7,o.rug,s.rug);ftable(I,24,7.5,10,2.2,0x3a2415);for(let k=0;k<5;k++){fchair(I,20+k*2,5.7);fchair(I,20+k*2,9.3)}}
  else if(v===1){frugP(I,24,8,12,8,o.rug,s.rug);ftable(I,24,4.4,9,1.2,0x3a2415);ftable(I,19,8.6,1.2,6,0x3a2415);ftable(I,29,8.6,1.2,6,0x3a2415);for(let k=0;k<4;k++)fchair(I,20.6+k*2.3,3.3);for(const z of[6.6,8.6,10.6]){fchair(I,17.8,z);fchair(I,30.2,z)}fb(I,24,11.3,.9,.6,1.25,0x5a3a24)}
  else{frugP(I,24,8,2.4,11,o.rug,'stripe');fb(I,24,3.4,1.1,.7,1.25,0x5a3a24);for(const z of[7,9,11])for(const x of[18,20,22,26,28,30])fchair(I,x,z);ftroph(I,14.55,7,'e',4)}
  wsign(I,24,.2,'s',2.9,o.letters,5,1.2,o.lb,'#e2b64c');
  return[[14.2,7,'e',3.3,v===2?3:9],[33.8,7,'w',3.3,9],[18.2,.2,'s',3.3,4.5],[29.8,.2,'s',3.3,4.5]]}
function hGame(I,o,s){const v=s.game;
  if(v===0){fpong(I,41,4.2);fpool(I,41,10.2)}
  else if(v===1){fpool(I,41,6.5);ffoos(I,37,11.6);fpong(I,45,11.6);flampF(I,35,1.2)}
  else{fpong(I,38.5,4.2);fhockey(I,44.5,4.2);farcade(I,47.4,9.4,'w',0x2a2a40);farcade(I,47.4,10.5,'w',0x5a1a2a);fsofa(I,37.5,11.6,4,'n',o.sofa)}
  return[[41,.2,'s',3.3,7,'game'],[34.2,7,'e',3.3,9,'game'],[47.8,3.6,'w',3.4,2.2,'game'],[47.8,11.6,'w',3.6,2.6,'game']]}
function hLiving(I,o,s){const v=s.lay;ffire(I,8,35.5,'n');const sp=[[2.6,18.2,'s',3.3,3],[12.5,18.2,'s',3.3,6],[15.8,22.5,'w',3.4,7],[15.8,33,'w',3.3,4.5],[3,35.8,'n',3.3,4],[13,35.8,'n',3.3,4]];
  if(v===0){frugP(I,7.5,27,9,10,o.rug2,s.rug);ftv(I,.7,27,'e');fsofa(I,9,27,6,'w',o.sofa);ftable(I,5,27,1.4,3,0x5a3a24);fplant(I,15,19.2);fplant(I,1,34.8);sp.push([.2,21.5,'e',3.3,3.6],[.2,32.5,'e',3.3,3.6],[.2,27,'e',3.7,3])}
  else if(v===1){frugP(I,8,31,9,6.5,o.rug2,s.rug);fsofa(I,8,29.6,6,'s',o.sofa);fcoffee(I,8,32,3,1.1);farm(I,3.4,32.4,'e',o.sofa);farm(I,12.6,32.4,'w',o.sofa);ftv(I,12.4,18.75,'s');fbag(I,11.2,21.8,o.rug);fbag(I,13.6,22.2,o.rug2);fshelf(I,.75,23,6,true);fplant(I,1,34.8);flampF(I,1.2,28.6);sp.push([.2,32.6,'e',3.3,3])}
  else{frugP(I,11.5,23.5,7.5,7,o.rug2,s.rug);ftv(I,15.35,22.5,'w');fsofa(I,9.2,22.8,5,'e',o.sofa);fsofa(I,12.3,26.4,4,'n',o.sofa);fcoffee(I,12.2,22.8,1.4,2.2);fbar(I,1.2,27,6,'e');farm(I,5,32.4,'s',o.sofa);farm(I,11,32.4,'s',o.sofa);fplant(I,1,34.8);sp.push([.2,21.5,'e',3.4,4],[.2,33,'e',3.3,3])}
  return sp}
// V123 the dinner tables + chairs (everything hDining puts below 1.3 m that isn't the rug) are remembered in I.dine so a story task can clear
// them out (ΑΣΡ's 'Clear out the long dinner table' for the gala). In ΑΣΡ they're kept out of the static merge so they can be hidden.
function dineGrab(I,n0){const objs=sc.children.slice(n0).filter(m=>m.isMesh&&m.position.y<1.3&&!(m.geometry&&m.geometry.type==='PlaneGeometry'));if(!objs.length)return;
  const bb=new THREE.Box3();for(const m of objs){m.updateMatrixWorld(true);bb.expandByObject(m);if(I.id==='asr')m.userData.noMerge=1}
  I.dine={objs,c:[(bb.min.x+bb.max.x)/2-I.x0,(bb.min.z+bb.max.z)/2-I.z0],v:null}}
function hDining(I,o,s){const v=s.dine,n0_=sc.children.length;try{return hDiningB(I,o,s,v)}finally{try{dineGrab(I,n0_);if(I.dine)I.dine.v=v}catch(e){console.warn('dineGrab',e)}}}
function hDiningB(I,o,s,v){
  if(v===0){ftable(I,38.5,27,2.6,7,0x4a2a18);for(let k=0;k<3;k++){fchair(I,36.6,24.7+k*2.3);fchair(I,40.4,24.7+k*2.3)}chand(I,38.5,27)}
  else if(v===1){for(const z of[23.5,31]){frugP(I,40,z,8.4,3.6,o.rug,'border');ftable(I,40,z,7,1.6,0x4a2a18);for(let k=0;k<3;k++){fchair(I,37.5+k*2.5,z-1.25);fchair(I,37.5+k*2.5,z+1.25)}chand(I,40,z)}fb(I,40,35.4,5,.6,1.1,0x3a2415)}
  else{frugP(I,39.5,27.5,11,13,o.rug,s.rug);fround(I,36.6,23.8,1.1);fround(I,43,23.8,1.1);fround(I,39.6,31.4,1.1);chand(I,39.6,27.5);fb(I,32.6,33,.6,4,1.05,0x3a2415)}
  return[[32.2,23.8,'e',3.3,4.5],[32.2,33,'e',3.3,4.5],[47.8,23.5,'w',3.3,6],[47.8,33.6,'w',3.3,3.8],[40,35.8,'n',3.3,10],[36,18.2,'s',3.3,5],[45,18.2,'s',3.3,3.4]]}
function hFoyer(I,o,s){const sp=[[16.2,22.5,'e',3.3,7],[16.2,33,'e',3.3,4.5],[19.5,35.8,'n',3.3,4],[19,18.2,'s',3.3,4.5]];if(!o.up)sp.push([31.8,22.5,'w',3.3,7],[28.6,35.8,'n',3.3,3],[29,18.2,'s',3.3,4.5]);return sp}
function hBedroom(I,o,s,up){const sp=[];if(!up){for(const x of[2.5,7,11.5])sp.push([x,.2,'s',3.2,2.6]);sp.push([.2,8,'e',3.3,6],[13.8,5.6,'w',3.3,4])}
  else for(let r_=0;r_<4;r_++){const bx=r_*12;sp.push([bx+2.4,.2,'s',3.2,2.4],[bx+9.6,.2,'s',3.2,2.4],[bx+6,.2,'s',3.4,3.2],[bx+.2,8,'e',3.3,6],[bx+11.8,8,'w',3.3,6])}return sp}
// V134 every house gets its showpieces on fixed walls (taken out of the random decor spots): the framed chapter charter in the foyer, the
// chapter's coat of arms on the dining room's end wall, big gold letters over the dining room's long wall, and more plants in the corners
function charterTex(o){const k='chr'+o.letters;return HTEX[k]||(HTEX[k]=ctex(320,420,(q,W,H)=>{const g=q.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f4ead0');g.addColorStop(1,'#e2d2a8');q.fillStyle=g;q.fillRect(0,0,W,H);
  q.strokeStyle='#8a6a2a';q.lineWidth=3;q.strokeRect(12,12,W-24,H-24);q.lineWidth=1;q.strokeRect(18,18,W-36,H-36);q.fillStyle='#3a2410';q.textAlign='center';
  q.font='bold 26px Georgia,serif';q.fillText('CHARTER',W/2,62);q.font='italic 15px Georgia,serif';q.fillText('granted to the chapter of',W/2,92);q.font='bold 34px Georgia,serif';q.fillText(o.letters,W/2,136);
  q.font='italic 14px Georgia,serif';q.fillText(o.name.replace(/ House$/,''),W/2,162);q.fillStyle='rgba(58,36,16,.55)';for(let y=188;y<330;y+=11){const w=(W-80)*(y>318?.5:.9+rnd()*.1);q.fillRect((W-w)/2,y,w,2)}
  q.fillStyle='#3a2410';q.font='italic 13px Georgia,serif';q.fillText('In witness whereof · '+romanYr(houseFounded(o)),W/2,350);q.strokeStyle='#3a2410';for(const x of[80,W-80]){q.beginPath();q.moveTo(x-45,382);q.bezierCurveTo(x-20,368,x,392,x+40,374);q.stroke()}
  q.fillStyle='#9a1f24';q.beginPath();q.arc(W/2,384,22,0,TAU);q.fill();q.fillStyle='#c84040';q.beginPath();q.arc(W/2,384,14,0,TAU);q.fill();q.fillStyle='#9a1f24';q.font='bold 12px Georgia,serif';q.fillText(o.letters,W/2,388)}))}
function crestTex(o){const k='crest'+o.letters+o.shield;return HTEX[k]||(HTEX[k]=ctex(320,380,(q,W,H)=>{q.clearRect(0,0,W,H);const C=hexS(o.shield),GD='#d8b048';
  const shield=()=>{q.beginPath();q.moveTo(60,70);q.lineTo(260,70);q.lineTo(260,190);q.quadraticCurveTo(255,280,160,330);q.quadraticCurveTo(65,280,60,190);q.closePath()};
  // laurel wreath behind, then the shield quartered with a gold chevron, a lamp, a star, a book and the letters, then the motto ribbon
  q.strokeStyle='#4a6a2a';q.lineWidth=5;for(const s of[-1,1])for(let i=0;i<9;i++){const a=-1.9+i*.32,x=160+s*Math.cos(a)*130,y=200+Math.sin(a)*130;q.fillStyle=i%2?'#5a7a32':'#6f9440';q.beginPath();q.ellipse(x,y,14,6,a*s+.8*s,0,TAU);q.fill()}
  shield();q.fillStyle=C;q.fill();q.save();shield();q.clip();q.fillStyle=GD;q.fillRect(160,70,100,120);q.fillRect(60,190,100,150);
  q.fillStyle=GD;q.beginPath();q.moveTo(50,250);q.lineTo(160,160);q.lineTo(270,250);q.lineTo(270,280);q.lineTo(160,190);q.lineTo(50,280);q.fill();q.restore();
  q.lineWidth=6;q.strokeStyle=GD;shield();q.stroke();q.lineWidth=2;q.strokeStyle='#5a3a10';shield();q.stroke();
  q.fillStyle=GD;q.beginPath();q.ellipse(110,140,26,12,0,0,TAU);q.fill();q.fillRect(104,112,12,18);q.fillStyle='#ffd27a';q.beginPath();q.ellipse(110,104,6,12,0,0,TAU);q.fill();   // lamp
  q.fillStyle=C;q.beginPath();for(let i=0;i<10;i++){const r=i%2?11:26,a=-PI/2+i*PI/5;q.lineTo(210+Math.cos(a)*r,130+Math.sin(a)*r)}q.closePath();q.fill();    // star
  q.fillStyle=C;q.fillRect(88,232,46,32);q.fillStyle='#f2ead0';q.fillRect(92,236,18,24);q.fillRect(112,236,18,24);                                                   // open book
  q.fillStyle='#f2ead0';q.font='bold 34px Georgia,serif';q.textAlign='center';q.fillText(o.letters,210,268);
  // helm crest on top and the ribbon
  q.fillStyle=GD;q.beginPath();q.moveTo(120,68);q.lineTo(130,30);q.lineTo(145,52);q.lineTo(160,18);q.lineTo(175,52);q.lineTo(190,30);q.lineTo(200,68);q.closePath();q.fill();
  q.fillStyle='#f2ead0';q.beginPath();q.moveTo(30,330);q.quadraticCurveTo(160,370,290,330);q.lineTo(296,356);q.quadraticCurveTo(160,396,24,356);q.closePath();q.fill();q.strokeStyle='#8a6a2a';q.lineWidth=2;q.stroke();
  q.fillStyle='#5a1a1a';q.font='bold 17px Georgia,serif';q.fillText('FIDES · FRATERNITAS · MCMLII',160,358)}))}
function houseExtras(I,o,s,spots){const take=(x,z)=>{spots=spots.filter(p=>!(Math.abs(p[0]-x)<.6&&Math.abs(p[1]-z)<.6))};
  // the charter, framed and lit, on the foyer wall, with a little reading shelf
  {const x=16.2,z=22.5;take(x,z);frameAt(I,x,z,'e',2.75,1.25,1.65,charterTex(o),0x2a1a10,.14);const g=wallGrp(I,x,z,'e',3.95);const lt=new THREE.Mesh(bgeo(.9,.07,.14),bm(0xfff0c0));lt.position.z=.2;g.add(lt);
    const br=new THREE.Mesh(bgeo(.12,.05,.25),mt(0xc9a046,.35,.6));br.position.set(0,.05,.1);g.add(br);fb(I,16.45,22.5,.5,1.6,1.0,0x3a2415);
    const pl=signMesh('OUR CHARTER',1.2,.22,'#2a1a10','#e2b64c','Georgia');pl.position.set(I.x0+x+.03,1.75,I.z0+z);pl.rotation.y=fry('e');sc.add(pl);
    iobj(I,x+1.4,z,'Read the chapter charter',()=>card({title:'The Chapter Charter',sp:o.name,text:`A sheet of heavy parchment behind glass, the seal still bright red: the charter that founded this chapter of ${o.letters} in ${houseFounded(o)}.\n\nThe founders' signatures run along the bottom. Somebody has polished the brass picture light so often the paint has worn off round the switch.`}),1.5)}
  // the coat of arms on a carved wooden plaque, on the dining room's end wall
  {const x=47.8,z=23.5;take(x,z);const g=wallGrp(I,x,z,'w',3.25),W=mt(0x3a2415,.6);const bk=new THREE.Mesh(bgeo(2.6,3.0,.08),W);bk.position.z=.04;bk.castShadow=true;g.add(bk);
    const tr=new THREE.Mesh(bgeo(2.75,3.15,.04),mt(0xc9a046,.35,.6));tr.position.z=.01;g.add(tr);
    const c=new THREE.Mesh(new THREE.PlaneGeometry(2.3,2.73),new THREE.MeshLambertMaterial({map:crestTex(o),transparent:true,alphaTest:.4}));c.position.z=.09;g.add(c);
    iobj(I,x-1.4,z,'Look at the coat of arms',()=>card({title:'Coat of Arms',sp:o.name,text:'Lamp for knowledge, star for honour, the open book for the ritual nobody is allowed to write down. The ribbon reads FIDES · FRATERNITAS · MCMLII.'}),1.5)}
  // big gold letters over the dining room's long wall (a shadow copy behind gives them depth)
  {const x=40,z=35.8;take(x,z);for(const[d,c,dy]of[[.02,'#3a2a10',-.05],[.07,'#d8b048',0]]){const m=letters(o.letters,6.4,1.9,c);m.position.set(I.x0+x,3.7+dy,I.z0+z-d);m.rotation.y=fry('n');sc.add(m)}}
  // plants in the corners and at the ends of the hall
  for(const[x,z]of[[1.2,14.7],[46.6,14.7],[47.2,35.2],[47.2,19.0],[17,19.4],[34.8,13.2]])fplant(I,x,z);
  return spots}
