// ================================================================ CORE UTILS
// V122 ?test&seed=N: seeded Math.random (mulberry32) so every test load builds the identical world (trees, NPCs, decor). tools/run.js seeds
// before the page loads (window.__SEEDED), in which case this does nothing. Normal play (no ?test) is untouched.
(()=>{try{const q=new URLSearchParams(location.search),s=q.get('seed');if(!q.has('test')||s==null||window.__SEEDED)return;let a=(parseInt(s,10)|0)^0x9e3779b9;
  Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};window.__SEEDED=1}catch(e){}})();
const $=id=>document.getElementById(id),PI=Math.PI,TAU=PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,rnd=Math.random,pick=a=>a[Math.floor(rnd()*a.length)],NOW=()=>performance.now()/1000;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const WW=740,WD=2650,OD=720,CR=2,GW=WW*CR,GD=WD*CR,WG=new Uint8Array(GW*GD),HG=new Uint8Array(GW*GD),SH=new Uint8Array(GW*GD),RG=new Uint8Array(GW*GD);
function cells(x0,z0,x1,z1,f){const a=Math.max(0,Math.floor(x0*CR)),b=Math.min(GW-1,Math.ceil(x1*CR)-1),c=Math.max(0,Math.floor(z0*CR)),d=Math.min(GD-1,Math.ceil(z1*CR)-1);for(let j=c;j<=d;j++)for(let i=a;i<=b;i++)f(j*GW+i,(i+.5)/CR,(j+.5)/CR)}
// V174 jump-on-objects: SH = top of low solid things in tenths of a metre (set by markR/markTop for tops up to 1 m). A cell is climbable when WG=1, SH>0 and HG<=1
// (any taller thing overlapping it raises HG). While Danny moves, FH = his feet height above the ground; with FH>=0 `solid` lets him into a climbable cell once his feet are
// within 0.12 m of its top. FH=-1 (everything else, e.g. NPCs) keeps the old behaviour.
let FH=-1;
const markR=(x0,z0,x1,z1,h,w=1)=>cells(x0,z0,x1,z1,k=>{if(w){WG[k]=1;if(h<=1){const t=Math.max(1,Math.round(h*10));if(t>SH[k])SH[k]=t}}const v=Math.min(255,Math.ceil(h));if(v>HG[k])HG[k]=v});
const markTop=(x0,z0,x1,z1,h)=>cells(x0,z0,x1,z1,k=>{if(WG[k]===1&&h<=1){const t=Math.round(h*10);if(t>SH[k])SH[k]=t}});
// V115 round colliders: small round things (posts, poles, bushes, trunks) are true circles instead of 0.5 m grid squares,
// so thin poles can't be walked through and Danny slides round them instead of catching on a square corner
const CCOL=new Map();let CIRC_OFF=0;
const circAdd=(x,z,r)=>{const k=Math.floor(x/4)*65536+Math.floor(z/4);let a=CCOL.get(k);if(!a)CCOL.set(k,a=[]);a.push([x,z,r])};
const circNear=(x,z,f)=>{const i=Math.floor(x/4),j=Math.floor(z/4);for(let di=-1;di<=1;di++)for(let dj=-1;dj<=1;dj++){const a=CCOL.get((i+di)*65536+j+dj);if(a)for(const c of a)if(f(c))return true}return false};
const circHit=(x,z,r)=>CCOL.size>0&&circNear(x,z,c=>(c[0]-x)**2+(c[1]-z)**2<(c[2]+r)**2);
const markC=(x,z,r,h)=>{if(r<=.75){circAdd(x,z,r);cells(x-r,z-r,x+r,z+r,(k,cx,cz)=>{if((cx-x)**2+(cz-z)**2<=(r+.36)**2){const v=Math.min(255,Math.ceil(h));if(v>HG[k])HG[k]=v}});return}
  cells(x-r,z-r,x+r,z+r,(k,cx,cz)=>{if((cx-x)**2+(cz-z)**2<=r*r){WG[k]=1;const v=Math.min(255,Math.ceil(h));if(v>HG[k])HG[k]=v}})};
const roadR=(x0,z0,x1,z1)=>cells(x0,z0,x1,z1,k=>RG[k]=1);
const cidx=(x,z)=>{const i=Math.floor(x*CR),j=Math.floor(z*CR);return i<0||j<0||i>=GW||j>=GD?-1:j*GW+i};
const solid=(x,z)=>{const k=cidx(x,z);if(k<0)return true;if(WG[k]!==1)return false;if(FH>=0){const t=SH[k];if(t>0&&HG[k]<=1&&FH>=t/10-.12)return false}return true};
const supTop=(x,z)=>{const k=cidx(x,z);return k<0||WG[k]!==1||HG[k]>1?0:SH[k]/10};
const freeAt=(x,z,r=.35)=>!solid(x,z)&&!solid(x-r,z-r)&&!solid(x+r,z-r)&&!solid(x-r,z+r)&&!solid(x+r,z+r)&&(CIRC_OFF||!circHit(x,z,r*.85));
const hAt=(x,z)=>{const k=cidx(x,z);return k<0?99:HG[k]};
const camTop=(x,z)=>{const t=hAt(x,z)+terrH(x,z);return(typeof ZIM!=='undefined'&&ZIM&&t>ZIM.Y-1.5&&inPoly(x,z,ZIM.main))?ZIM.Y+.4:t};
const onRoad=(x,z)=>{const k=cidx(x,z);return k>=0&&RG[k]===1};
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
const GFX=(()=>{const ok=v=>v==='classic'||v==='enhanced';try{const m=/gfx=(classic|enhanced)/.exec(location.hash||'');if(m)return m[1]}catch(e){}try{const m=/pledge-gfx=(classic|enhanced)/.exec(window.name||'');if(m)return m[1]}catch(e){}try{const v=localStorage.getItem('pledge.gfx');if(ok(v))return v}catch(e){}return MOB?'classic':'enhanced'})();
const R=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance',stencil:false});
const PRCAP=MOB?1.25:1.75;const QL=[['High',Math.min(devicePixelRatio,PRCAP)],['Balanced',Math.min(devicePixelRatio,PRCAP)*.75],['Performance',Math.min(devicePixelRatio,PRCAP)*.55]];const QLB=QL.map(q=>q[1]);let GQ=0,CPUMS=0,FPSMIN=0;try{FPSMIN=localStorage.getItem('pledge.fpsmin')==='1'}catch(e){}

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
function setFpsMin(v){FPSMIN=v;const e=$('fps');e.classList.toggle('min',!!v);e.textContent=v?'📊 Stats':'… FPS';e.title=v?'Click to show performance stats':'Click to hide performance stats';try{localStorage.setItem('pledge.fpsmin',v?'1':'0')}catch(err){}}R.setPixelRatio(QL[0][1]);R.shadowMap.autoUpdate=false;let SHF=0;R.setSize(innerWidth,innerHeight);R.shadowMap.enabled=true;R.shadowMap.type=GFX==='enhanced'?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.18;R.domElement.id='gl';R.domElement.tabIndex=0;document.body.prepend(R.domElement);
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
const sun=new THREE.DirectionalLight(0xfff0d8,1.3);sun.castShadow=true;sun.shadow.mapSize.set(GFX==='enhanced'?2048:1024,GFX==='enhanced'?2048:1024);{const c=sun.shadow.camera,E=GFX==='enhanced'?52:40;c.left=-E;c.right=E;c.top=E;c.bottom=-E;c.near=1;c.far=220}/* V237 phones have less shadow-depth precision, so surfaces at a grazing angle to the sun (walls, esp. indoors) showed moving dark stripes (shadow acne). Bigger bias on mobile, bigger normal offset indoors. */
const SHB=MOB?[-.0016,.1]:[-.0005,.04];sun.shadow.bias=SHB[0];sun.shadow.normalBias=SHB[1];sc.add(sun,sun.target);
const plamp=new THREE.PointLight(0xffd7a0,0,20,1.6);sc.add(plamp);
const skyU={top:{value:new THREE.Color(0x4a86d4)},bot:{value:new THREE.Color(0xbfd9ee)}};
const sky=new THREE.Mesh(new THREE.SphereGeometry(300,24,12),new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,fog:false,vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 top;uniform vec3 bot;varying float h;void main(){float t=clamp(h*1.7+.12,0.,1.);gl_FragColor=vec4(mix(bot,top,pow(t,.75)),1.);}'}));sky.renderOrder=999;sky.material.depthTest=true;sc.add(sky);
const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(9,16,12),new THREE.MeshBasicMaterial({color:0xfff3c8,fog:false}));const moonDisc=new THREE.Mesh(new THREE.SphereGeometry(6,16,12),new THREE.MeshBasicMaterial({color:0xdfe6f6,fog:false}));sc.add(sunDisc,moonDisc);
let stars;{const p=[];for(let i=0;i<700;i++){const a=rnd()*TAU,e=rnd()*1.35+.08,r=290;p.push(Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));stars=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.6,fog:false,transparent:true,opacity:0,sizeAttenuation:false}));stars.frustumCulled=false;sc.add(stars)}
