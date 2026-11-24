// ================================================================ CORE UTILS
// V122 ?test&seed=N: seeded Math.random (mulberry32) so every test load builds the identical world (trees, NPCs, decor). tools/run.js seeds
// before the page loads (window.__SEEDED), in which case this does nothing. Normal play (no ?test) is untouched.
(()=>{try{const q=new URLSearchParams(location.search),s=q.get('seed');if(!q.has('test')||s==null||window.__SEEDED)return;let a=(parseInt(s,10)|0)^0x9e3779b9;
  Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};window.__SEEDED=1}catch(e){}})();
const $=id=>document.getElementById(id),PI=Math.PI,TAU=PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,rnd=Math.random,pick=a=>a[Math.floor(rnd()*a.length)],NOW=()=>performance.now()/1000;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const WW=740,WD=3300 /* V354: was 2650; the interiors laid out past z=2650 (Van Wormer, library, diner, police…) had no collision grid under them, so Danny could not move inside */,OD=720,CR=2,GW=WW*CR,GD=WD*CR,WG=grNew(GW,GD,4,Uint8Array,0),HG=grNew(GW,GD,4,Uint8Array,0),SH=grNew(GW,GD,4,Uint8Array,0),RG=grNew(GW,GD,4,Uint8Array,0);
/* V438 the world grids (walls WG, heights HG, sit/step heights SH, roads RG, and the route distances DIST) are stored as square blocks of 2^s cells, and only the
   blocks something was written into exist: the map is 740 x 3300 m but the building interiors past z=1320 fill only about a seventh of their area. Every
   access goes through grGet(grid,index) / grSet(grid,index,value) with the same flat index as before; a missing block reads as the grid's default.
   All blocks live in one pool array that grows by doubling, plus an index table (-1 = no block). tgFill drops every block and sets a new default */
function grNew(W,H,s,C,d){const m=(1<<s)-1,tw=(W+m)>>s,th=(H+m)>>s,ts=1<<(2*s);return{W,H,s,m,tw,ts,C,d,n:0,length:W*H,idx:new Int32Array(tw*th).fill(-1),pool:new C(ts*64)}}
function grGet(g,k){const j=(k/g.W)|0,i=k-j*g.W,o=g.idx[(j>>g.s)*g.tw+(i>>g.s)];return o<0?g.d:g.pool[o+((j&g.m)<<g.s)+(i&g.m)]}
function grSet(g,k,v){if(!(k>=0&&k<g.length))return v;const j=(k/g.W)|0,i=k-j*g.W,t=(j>>g.s)*g.tw+(i>>g.s);let o=g.idx[t];
  if(o<0){if(v===g.d)return v;o=g.n*g.ts;if(o+g.ts>g.pool.length){const p=new g.C(LITE?Math.ceil(g.pool.length*1.25/g.ts)*g.ts:g.pool.length*2);/* V442 LITE grows by a quarter, not double (route grid 16.8 -> ~11 MB) */p.set(g.pool);g.pool=p}if(g.d)g.pool.fill(g.d,o,o+g.ts);g.idx[t]=o;g.n++}
  g.pool[o+((j&g.m)<<g.s)+(i&g.m)]=v;return v}
function grFill(g,v){g.idx.fill(-1);g.n=0;g.d=v}
/* after loading: cut each pool down to the blocks in use (it had doubled past them) */
function grTrim(g){const u=g.n*g.ts;if(g.pool.length>u*1.1+g.ts){const p=new g.C(Math.max(g.ts,u));p.set(g.pool.subarray(0,u));g.pool=p}}
function cells(x0,z0,x1,z1,f){const a=Math.max(0,Math.floor(x0*CR)),b=Math.min(GW-1,Math.ceil(x1*CR)-1),c=Math.max(0,Math.floor(z0*CR)),d=Math.min(GD-1,Math.ceil(z1*CR)-1);for(let j=c;j<=d;j++)for(let i=a;i<=b;i++)f(j*GW+i,(i+.5)/CR,(j+.5)/CR)}
// V174 jump-on-objects: SH = top of low solid things in tenths of a metre (set by markR/markTop for tops up to 1 m). A cell is climbable when WG=1, SH>0 and HG<=1
// (any taller thing overlapping it raises HG). While Danny moves, FH = his feet height above the ground; with FH>=0 `solid` lets him into a climbable cell once his feet are
// within 0.12 m of its top. FH=-1 (everything else, e.g. NPCs) keeps the old behaviour.
let FH=-1;
const markR=(x0,z0,x1,z1,h,w=1)=>cells(x0,z0,x1,z1,k=>{if(w){grSet(WG,k,1);if(h<=1){const t=Math.max(1,Math.round(h*10));if(t>grGet(SH,k))grSet(SH,k,t)}}const v=Math.min(255,Math.ceil(h));if(v>grGet(HG,k))grSet(HG,k,v)});
const markTop=(x0,z0,x1,z1,h)=>cells(x0,z0,x1,z1,k=>{if(grGet(WG,k)===1&&h<=1){const t=Math.round(h*10);if(t>grGet(SH,k))grSet(SH,k,t)}});
// V115 round colliders: small round things (posts, poles, bushes, trunks) are true circles instead of 0.5 m grid squares,
// so thin poles can't be walked through and Danny slides round them instead of catching on a square corner
const CCOL=new Map();let CIRC_OFF=0;
const circAdd=(x,z,r)=>{const k=Math.floor(x/4)*65536+Math.floor(z/4);let a=CCOL.get(k);if(!a)CCOL.set(k,a=[]);a.push([x,z,r])};
const circNear=(x,z,f)=>{const i=Math.floor(x/4),j=Math.floor(z/4);for(let di=-1;di<=1;di++)for(let dj=-1;dj<=1;dj++){const a=CCOL.get((i+di)*65536+j+dj);if(a)for(const c of a)if(f(c))return true}return false};
const circHit=(x,z,r)=>CCOL.size>0&&circNear(x,z,c=>(c[0]-x)**2+(c[1]-z)**2<(c[2]+r)**2);
const markC=(x,z,r,h)=>{if(r<=.75){circAdd(x,z,r);cells(x-r,z-r,x+r,z+r,(k,cx,cz)=>{if((cx-x)**2+(cz-z)**2<=(r+.36)**2){const v=Math.min(255,Math.ceil(h));if(v>grGet(HG,k))grSet(HG,k,v)}});return}
  cells(x-r,z-r,x+r,z+r,(k,cx,cz)=>{if((cx-x)**2+(cz-z)**2<=r*r){grSet(WG,k,1);const v=Math.min(255,Math.ceil(h));if(v>grGet(HG,k))grSet(HG,k,v)}})};
const roadR=(x0,z0,x1,z1)=>cells(x0,z0,x1,z1,k=>grSet(RG,k,1));
const cidx=(x,z)=>{const i=Math.floor(x*CR),j=Math.floor(z*CR);return i<0||j<0||i>=GW||j>=GD?-1:j*GW+i};
const solid=(x,z)=>{const k=cidx(x,z);if(k<0)return true;if(grGet(WG,k)!==1)return false;if(FH>=0){const t=grGet(SH,k);if(t>0&&grGet(HG,k)<=1&&FH>=t/10-.12)return false}return true};
const supTop=(x,z)=>{const k=cidx(x,z);return k<0||grGet(WG,k)!==1||grGet(HG,k)>1?0:grGet(SH,k)/10};
const freeAt=(x,z,r=.35)=>!solid(x,z)&&!solid(x-r,z-r)&&!solid(x+r,z-r)&&!solid(x-r,z+r)&&!solid(x+r,z+r)&&(CIRC_OFF||!circHit(x,z,r*.85));
const hAt=(x,z)=>{const k=cidx(x,z);return k<0?99:grGet(HG,k)};
const camTop=(x,z)=>{const t=hAt(x,z)+terrH(x,z);return(typeof ZIM!=='undefined'&&ZIM&&t>ZIM.Y-1.5&&inPoly(x,z,ZIM.main))?ZIM.Y+.4:t};
const onRoad=(x,z)=>{const k=cidx(x,z);return k>=0&&grGet(RG,k)===1};
const inR=(x,z,r)=>x>=r[0]&&x<=r[2]&&z>=r[1]&&z<=r[3];
const inWin=(h,w)=>w[0]<w[1]?h>=w[0]&&h<w[1]:h>=w[0]||h<w[1];
const fmtH=h=>{h=((h%24)+24)%24;const H=Math.floor(h),m=Math.floor((h-H)*60);return(H%12||12)+(m?':'+String(m).padStart(2,'0'):'')+(H<12?' AM':' PM')};
const fmtT=h=>{h=((h%24)+24)%24;const H=Math.floor(h),m=Math.floor((h-H)*60);return(H%12||12)+':'+String(m).padStart(2,'0')+(H<12?' AM':' PM')};

// ================================================================ AUDIO
let AC=null,MGN=null,MST=null;
function audioInit(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();MST=AC.createGain();MST.gain.value=typeof SET!=='undefined'?SET.vol:.55;MST.connect(AC.destination);MGN=AC.createGain();MGN.gain.value=typeof SET!=='undefined'?SET.sfx:1;MGN.connect(MST)}catch(e){AC=null}}
function tone(f,d=.12,type='sine',v=.15,when=0){if(!AC)return;const t=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(MGN);o.start(t);o.stop(t+d+.03)}
function noise(d=.12,v=.2,f=900){if(!AC)return;const n=Math.floor(AC.sampleRate*d),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(rnd()*2-1)*(1-i/n);const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=b;fl.frequency.value=f;g.gain.value=v;s.connect(fl);fl.connect(g);g.connect(MGN);s.start()}
const SFX={hit:()=>{noise(.1,.15,700);tone(95,.14,'sine',.13)},whiff:()=>noise(.07,.12,2400),coin:()=>{tone(880,.07,'square',.06);tone(1320,.12,'square',.06,.07)},ok:()=>{tone(523,.1,'triangle',.14);tone(784,.2,'triangle',.14,.09)},bad:()=>tone(196,.3,'sawtooth',.08),cam:()=>{noise(.05,.35,5000);tone(1900,.04,'square',.04)},ui:()=>tone(660,.05,'triangle',.07),bust:()=>{tone(392,.25,'square',.08);tone(262,.4,'square',.08,.22)},lvl:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.16,'triangle',.11,i*.08)),bell:()=>[784,659,523].forEach((f,i)=>tone(f,.5,'sine',.12,i*.28)),whistle:()=>{tone(2100,.35,'square',.05);tone(2300,.2,'square',.05,.38)}};
const sfx=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};

// ================================================================ RENDERER
const MOB=(()=>{try{return (typeof matchMedia==='function'&&(matchMedia('(pointer:coarse)').matches||matchMedia('(any-pointer:coarse)').matches))||(navigator.maxTouchPoints||0)>1||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'')}catch(e){return false}})();
/* V236 the Look choice is kept three ways (URL hash, window.name, localStorage) because phones, file:// pages and sandboxed viewers often drop localStorage, which made Enhanced reload straight back to Classic */
const GFXSAVE=v=>{try{localStorage.setItem('pledge.gfx',v)}catch(e){}try{window.name='pledge-gfx='+v}catch(e){}try{history.replaceState(null,'','#gfx='+v)}catch(e){try{location.hash='gfx='+v}catch(e2){}}};
/* V426 LITE: a low-memory build of the world for browsers with a small memory limit per tab (Edge on Xbox stops the page with SBOX_FATAL_MEMORY_EXCEEDED).
   On by itself on an Xbox; ?lite forces it on, ?full forces it off. Classic look, half-size procedural textures, a smaller ground bake and map, a quarter crowd, pixel ratio 1 */
const LITE=(()=>{try{const s=(location.search||'')+(location.hash||'');if(/[?&#]full\b/.test(s))return false;if(/[?&#]lite\b/.test(s))return true;try{if(localStorage.getItem('pledge.lite')==='1')return true}catch(e){}if(window.PLEDGE_CONSOLE)return true;if(navigator.deviceMemory&&navigator.deviceMemory<=2)return true;return/Xbox/i.test(navigator.userAgent||'')}catch(e){return false}})();/* V443: Edge on the Xbox no longer says Xbox in its browser id (photo: full mode, no lite). The console test site now always starts in LITE
   (PLEDGE_CONSOLE, set by pages/publish.py --console; ?full still overrides), and any browser reporting 2 GB or less of memory gets it too */
const GFX=(()=>{const ok=v=>v==='classic'||v==='enhanced';try{const m=/gfx=(classic|enhanced)/.exec(location.hash||'');if(m)return m[1]}catch(e){}if(LITE)return'classic';try{const m=/pledge-gfx=(classic|enhanced)/.exec(window.name||'');if(m)return m[1]}catch(e){}try{const v=localStorage.getItem('pledge.gfx');if(ok(v))return v}catch(e){}return MOB?'classic':'enhanced'})();
const R=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance',stencil:false});
const PRCAP=LITE?1:MOB?1.25:1.75;const QL=[['High',Math.min(devicePixelRatio,PRCAP)],['Balanced',Math.min(devicePixelRatio,PRCAP)*.75],['Performance',Math.min(devicePixelRatio,PRCAP)*.55]];const QLB=QL.map(q=>q[1]);let GQ=0,CPUMS=0,FPSMIN=0;try{FPSMIN=localStorage.getItem('pledge.fpsmin')==='1'}catch(e){}

// ---- adaptive performance governor: watches the frame rate and steps resolution, TAA, shadows and post-processing down (and back up) to hold ~60 fps
const ADP={lv:0,acc:0,cnt:0,since:0,good:0,up:0,noup:0,skip:0,shf:3,taa0:null};
function adpSet(lv){if(ADP.taa0==null)ADP.taa0=PP.taa;ADP.lv=lv;const k=[1,.8,.65,.55,.7][lv];for(let i=0;i<3;i++)QL[i][1]=QLB[i]*k;R.setPixelRatio(QL[GQ][1]);
  PP.taa=!!ADP.taa0&&lv<3;ADP.shf=lv>=2?6:3;
  if(lv>=3&&sun.shadow.mapSize.x>1024){sun.shadow.mapSize.set(1024,1024);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}
  if(lv>=4&&PP.ready){PP.ready=false;try{cam.clearViewOffset()}catch(_){}R.setRenderTarget(null);R.toneMapping=THREE.ACESFilmicToneMapping}
  console.log('perf level',lv)}
function adpTick(f,rdt){if(!MOB)return;if(mode!=='play'||document.hidden){ADP.acc=ADP.cnt=0;return}if(ADP.skip){ADP.skip=0;ADP.acc=ADP.cnt=0;return}
  ADP.acc+=f;if(++ADP.cnt<4)return;const a=ADP.acc/ADP.cnt;ADP.acc=ADP.cnt=0;ADP.since++;
  if(a<45&&ADP.lv<4&&ADP.since>=2){if(ADP.up)ADP.noup=1;ADP.up=0;adpSet(ADP.lv+1);ADP.since=0;ADP.good=0}
  else if(a>=57){if(++ADP.good>=4&&ADP.lv>0&&ADP.lv<4&&ADP.since>=6&&!ADP.noup){ADP.up=1;adpSet(ADP.lv-1);ADP.since=0;ADP.good=0}}else ADP.good=0}
function setFpsMin(v){FPSMIN=v;const e=$('fps');e.classList.toggle('min',!!v);e.textContent=v?'📊 Stats':'… FPS';e.title=v?'Click to show performance stats':'Click to hide performance stats';try{localStorage.setItem('pledge.fpsmin',v?'1':'0')}catch(err){}}/* V432 LITE (Xbox): the 3D area must have an even width and height. The Xbox graphics test passed at 1280x640 and failed at the screen's own 1280x639, which is
   also what the game used. So in LITE the drawing size is rounded down to even numbers and stretched over the window, and the pixel ratio stays exactly 1 */
if(LITE){const spr=R.setPixelRatio.bind(R);R.setPixelRatio=()=>spr(1)}
function rSize(){if(!LITE){R.setSize(innerWidth,innerHeight);return}const w=Math.max(2,innerWidth&~1),h=Math.max(2,innerHeight&~1);R.setSize(w,h);const st=R.domElement.style;st.width=innerWidth+'px';st.height=innerHeight+'px'}
R.setPixelRatio(QL[0][1]);R.shadowMap.autoUpdate=false;let SHF=0;rSize();R.shadowMap.enabled=true;R.shadowMap.type=GFX==='enhanced'?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.18;R.domElement.id='gl';R.domElement.tabIndex=0;document.body.prepend(R.domElement);
const SM=o=>{o=Object.assign({},o);delete o.flatShading;if(GFX==='enhanced'){if(o.roughness==null)o.roughness=.88;if(o.metalness==null)o.metalness=0;o.envMapIntensity=.55;return new THREE.MeshStandardMaterial(o)}delete o.roughness;delete o.metalness;return new THREE.MeshLambertMaterial(o)};
// basketball: pebbled orange leather with black channel seams
let BALLM=null;function bbMat(){if(BALLM)return BALLM;const c=document.createElement('canvas');c.width=512;c.height=256;const q=c.getContext('2d');q.fillStyle='#d8661f';q.fillRect(0,0,512,256);
  for(let i=0;i<2600;i++){q.fillStyle=rnd()<.5?'rgba(255,175,105,.2)':'rgba(110,45,10,.2)';q.fillRect(rnd()*512,rnd()*256,2,2)}
  q.strokeStyle='#150d07';q.lineWidth=6;q.lineCap='round';
  q.beginPath();q.moveTo(0,128);q.lineTo(512,128);q.stroke();
  for(const x of[128,384]){q.beginPath();q.moveTo(x,0);q.lineTo(x,256);q.stroke()}
  for(const x0 of[0,256,512]){q.beginPath();for(let y=0;y<=256;y+=8){const x=x0+46*Math.sin(y/256*TAU);y?q.lineTo(x,y):q.moveTo(x,y)}q.stroke()}
  const t=new THREE.CanvasTexture(c);if(R.capabilities)t.anisotropy=4;BALLM=SM({map:t,roughness:.82});return BALLM}
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,320);
sc.fog=new THREE.Fog(0xc4d6e6,130,300);
const hemi=new THREE.HemisphereLight(0xcfe3ff,0x4a5a3a,.62);sc.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d8,1.3);sun.castShadow=!LITE;/* V427 no shadows in LITE */sun.shadow.mapSize.set(GFX==='enhanced'?2048:1024,GFX==='enhanced'?2048:1024);{const c=sun.shadow.camera,E=GFX==='enhanced'?52:40;c.left=-E;c.right=E;c.top=E;c.bottom=-E;c.near=1;c.far=220}/* V237 phones have less shadow-depth precision, so surfaces at a grazing angle to the sun (walls, esp. indoors) showed moving dark stripes (shadow acne). Bigger bias on mobile, bigger normal offset indoors. */
const SHB=MOB?[-.0016,.1]:[-.0005,.04];sun.shadow.bias=SHB[0];sun.shadow.normalBias=SHB[1];sc.add(sun,sun.target);
const plamp=new THREE.PointLight(0xffd7a0,0,20,1.6);sc.add(plamp);
const skyU={top:{value:new THREE.Color(0x4a86d4)},bot:{value:new THREE.Color(0xbfd9ee)}};
const sky=new THREE.Mesh(new THREE.SphereGeometry(300,24,12),new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,fog:false,vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w*.99999;}'/* V446 the sky sits on the far plane, so it still shows when the console looks less far than its 300 m size */,fragmentShader:'uniform vec3 top;uniform vec3 bot;varying float h;void main(){float t=clamp(h*1.7+.12,0.,1.);gl_FragColor=vec4(mix(bot,top,pow(t,.75)),1.);}'}));sky.renderOrder=999;sky.material.depthTest=true;sc.add(sky);
const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(9,16,12),new THREE.MeshBasicMaterial({color:0xfff3c8,fog:false}));const moonDisc=new THREE.Mesh(new THREE.SphereGeometry(6,16,12),new THREE.MeshBasicMaterial({color:0xdfe6f6,fog:false}));sc.add(sunDisc,moonDisc);
/* V434 Edge on Xbox stops the 3D the moment it draws a point cloud (THREE.Points): the ?bisect run on the Xbox named the 700-star cloud. In LITE (on for the Xbox)
   THREE.Points is replaced: it returns a Group that keeps the same .geometry and .material for the game code (which moves the dots by writing to geometry
   positions), and draws each dot as a tiny solid diamond in a child mesh that lptsSync rebuilds whenever the positions change. Points with a custom shader
   (Chapter 5 fire and smoke) are not drawn in LITE */
const LITEPTS=[];
if(LITE){THREE.Points=function(geo,mat){const G=new THREE.Group();G.geometry=geo||new THREE.BufferGeometry();if(!mat||mat.isShaderMaterial){G.material=mat;return G}
  const bm=new THREE.MeshBasicMaterial({color:mat.color?mat.color.getHex():0xffffff,transparent:!!mat.transparent,opacity:mat.opacity==null?1:mat.opacity,blending:mat.blending,depthWrite:mat.depthWrite,fog:mat.fog,vertexColors:!!mat.vertexColors});
  G.material=bm;const eg=new THREE.BufferGeometry(),ch=new THREE.Mesh(eg,bm);ch.frustumCulled=false;G.add(ch);G.userData.lp={ch,eg,ver:-1,n:-1,miss:0,r:mat.sizeAttenuation===false?(mat.size||1)*.375:(mat.size||.1)*.5};LITEPTS.push(G);return G}}
const LPDV=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],LPF=[0,2,4,2,1,4,1,3,4,3,0,4,2,0,5,1,2,5,3,1,5,0,3,5];
function lptsSync(){for(let j=LITEPTS.length-1;j>=0;j--){const G=LITEPTS[j],lp=G.userData.lp;if(!G.parent){if(++lp.miss>900)LITEPTS.splice(j,1);continue}lp.miss=0;lp.ch.renderOrder=G.renderOrder;
  const pa=G.geometry.attributes.position;if(!pa||(pa.version===lp.ver&&pa.count===lp.n))continue;lp.ver=pa.version;const n=pa.count,ca=G.geometry.attributes.color,r=lp.r;
  if(lp.n!==n){lp.n=n;lp.eg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*72),3));if(ca)lp.eg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*72),3))}
  const A=lp.eg.attributes.position.array,C=ca&&lp.eg.attributes.color?lp.eg.attributes.color.array:null;let k=0;
  for(let i=0;i<n;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i);for(let f=0;f<24;f++){const d=LPDV[LPF[f]];if(C){C[k]=ca.getX(i);C[k+1]=ca.getY(i);C[k+2]=ca.getZ(i)}A[k++]=x+d[0]*r;A[k++]=y+d[1]*r;A[k++]=z+d[2]*r}}
  lp.eg.attributes.position.needsUpdate=true;if(C)lp.eg.attributes.color.needsUpdate=true;lp.eg.computeBoundingSphere()}}
/* V437 LITE: the merged world shapes made at load are new geometries nobody else holds. Once one is on the graphics card its arrays in normal memory are
   swapped for tiny ones (bounds are worked out first, for culling). About 50 MB on the Xbox, where Edge's memory runs out */
/* V442 LITE: a 2D canvas keeps a list of every drawing command until something reads it. Texture canvases drawn at load (speckled facades, signs,
   paving: thousands of tiny rectangles each) kept those lists for minutes, ~90 MB in the Xbox-sized test. Reading one pixel makes the browser paint
   the list into pixels and drop it. Done once per canvas, shortly after it gets its drawing context (after each loading step, and every few seconds in play for new ones) */
const LCV={L:[],q:false,t:0};
if(LITE)try{const gc0=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){const q=gc0.call(this,t,...a);if(q&&t==='2d'&&!this.__q){this.__q=q;LCV.L.push(new WeakRef(this));if(!LCV.q){LCV.q=true;setTimeout(liteCvFlush,0)}}return q}}catch(e){}
function liteCvFlush(){LCV.q=false;LCV.t=performance.now();if(!LITE)return;for(const w of LCV.L){const c=w.deref();if(c&&c.width>1&&c.height>1)try{c.__q.getImageData(0,0,1,1)}catch(e){}}LCV.L=[]}/* once per canvas: reading again and again made browser-side garbage of its own */
/* V442 LITE: nudge the script engine to clean up. On the Xbox it waits until its heap is near its ~740 MB limit, so after loading ~165 MB of
   thrown-away building pieces sat in memory and play tipped the browser over. Making (and dropping at once) a 68 MB buffer that is never written to
   makes it collect right away; the memory is never actually touched. Used after big loading steps, on entering/leaving buildings and whenever
   ~30 MB has piled up */
const LGC={last:0,n:0,t:0};function liteHeap(){try{return performance.memory.usedJSHeapSize}catch(e){return 0}}
const LGCOFF=(()=>{try{return/[?&]nonudge\b/.test(location.search)}catch(e){return false}})();
function liteGcNudge(){if(!LITE||LGCOFF)return;const pre=liteHeap();try{let x=new ArrayBuffer(68<<20);x=null}catch(e){}LGC.n++;LGC.t=performance.now();setTimeout(()=>{const h=liteHeap();LGC.last=h>pre?pre:h},1500)/* the reading can still include the 68 MB buffer: never let it raise the baseline */}
/* a nudge needs about a second to finish its clean-up (300 -> ~190 MB after loading in the test); nudges stacked closer get in each other's way */
function liteGcBurst(n){if(!LITE)return;let i=0;const f=()=>{liteGcNudge();if(++i<n)setTimeout(f,1500)};f()}
function liteGcCheck(){if(!LITE)return;if(performance.now()-LCV.t>4000)liteCvFlush();const h=liteHeap();if(!h)return;if(!LGC.last)LGC.last=h;if(h>LGC.last+30e6&&performance.now()-LGC.t>3000){LGC.last=h;liteGcNudge()}}
/* V442: the free-after-upload callback lives out here. Inside liteFreeMark it kept that function's list of every merged geometry alive, so the 57 MB of
   interiors V441 let go never left memory */
function liteFreeArr(){this.array=new this.array.constructor(this.itemSize)}
function liteFreeMark(groups,pre){let n=0;const fr=liteFreeArr;const seen=new Set();
  for(const G of groups)G.traverse(o=>{const g=o.geometry;if(!o.isMesh||o.isInstancedMesh||!g||pre.has(g)||seen.has(g))return;seen.add(g);if(!g.boundingSphere)g.computeBoundingSphere();if(!g.boundingBox)g.computeBoundingBox();g.userData.lfree=1;for(const k in g.attributes)g.attributes[k].onUpload(fr);if(g.index)g.index.onUpload(fr);n++});LITEFREEN=n}
let LITEFREEN=0;
function mkPoints(geo,o){return new THREE.Points(geo,new THREE.PointsMaterial(o))}
let stars;{const p=[];for(let i=0;i<700;i++){const a=rnd()*TAU,e=rnd()*1.35+.08,r=290;p.push(Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));stars=mkPoints(g,{color:0xffffff,size:1.6,fog:false,transparent:true,opacity:0,sizeAttenuation:false});stars.frustumCulled=false;sc.add(stars)}
