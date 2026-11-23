// ================================================================ V66 graphics: physically based materials, image-based light, HDR post-processing
// (ambient occlusion, bloom, ACES tone mapping, colour grade, vignette, FXAA) and real night lighting. "Classic" keeps the old fast path.
const PP={on:GFX==='enhanced',w:0,h:0,ready:false,bloomK:.5,aoK:.85,sat:1.3,
  // V67 look: TAA, close-up depth of field, lifted-shadow grade, character outlines (set localStorage 'pledge.taa'/'pledge.dof'/'pledge.outline' to '0' to disable)
  taa:(()=>{try{return localStorage.getItem('pledge.taa')!=='0'}catch(e){return true}})(),
  dof:false,
  cu:0,hi:0,first:1,jf:0,pcam:null,vp:null,ivp:null,pvp:null};
const OUTL={on:false,res:{value:new THREE.Vector2(1920,1080)},w:{value:1.7},mats:{}};
// thin dark coloured outline for characters: an inverted hull pushed out by a constant number of screen pixels
function outlineMat(hex){const k=hex|0;if(OUTL.mats[k])return OUTL.mats[k];
  const m=new THREE.MeshBasicMaterial({color:k,skinning:true,side:THREE.BackSide,fog:false});
  m.onBeforeCompile=sh=>{sh.uniforms.uOR=OUTL.res;sh.uniforms.uOW=OUTL.w;
    sh.vertexShader='uniform vec2 uOR;uniform float uOW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#ifndef USE_ENVMAP\n#include <beginnormal_vertex>\n#include <skinnormal_vertex>\n#endif\n#include <begin_vertex>').replace('#include <project_vertex>','#include <project_vertex>\n{vec3 vn=normalize(normalMatrix*objectNormal);vec2 dd=(projectionMatrix*vec4(vn,0.)).xy*uOR;float dl=length(dd);dd=dl>1e-4?dd/dl:vec2(0.);float wd=uOW*clamp(1.45-gl_Position.w*.017,.85,1.25);gl_Position.xy+=dd*(wd*2./uOR)*gl_Position.w;}')};
  m.customProgramCacheKey=()=>'outl68';return OUTL.mats[k]=m}
function addOutline(mesh,sk,tint){if(!OUTL.on)return;const c=new THREE.Color(0x151021);if(tint!=null)try{c.lerp(new THREE.Color(tint),.2)}catch(e){}
  const m=new THREE.SkinnedMesh(mesh.geometry,outlineMat(c.getHex()));m.bind(sk,mesh.bindMatrix);m.castShadow=false;m.receiveShadow=false;m.userData.noMerge=1;m.userData.outline=1;m.frustumCulled=mesh.frustumCulled;mesh.add(m);return m}
let ppRT=null,ppAO=null,ppAO2=null,ppD=null,ppH=[],ppB=[],ppT=[],ppLDR=null,ppQ=null,ppS=null,ppC=null,ppM={};
function ppMat(fs,u){return new THREE.ShaderMaterial({uniforms:u,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:fs,depthTest:false,depthWrite:false})}
const PPH=`varying vec2 vUv;`;
function ppInit(){if(!PP.on)return;const gl2=R.capabilities.isWebGL2,half=gl2&&(R.extensions.get('EXT_color_buffer_float')||R.extensions.get('EXT_color_buffer_half_float'));PP.type=half?THREE.HalfFloatType:THREE.UnsignedByteType;PP.hdr=!!half;
  ppS=new THREE.Scene();ppC=new THREE.OrthographicCamera(-1,1,1,-1,0,1);ppQ=new THREE.Mesh(new THREE.PlaneGeometry(2,2),null);ppQ.frustumCulled=false;ppS.add(ppQ);
  ppM.ao=ppMat(PPH+`uniform sampler2D tD;uniform mat4 pInv;uniform float pS,rad,str,mob;uniform vec2 res;
    vec3 vp(vec2 u){float d=texture2D(tD,u).x;vec4 p=pInv*vec4(u*2.-1.,d*2.-1.,1.);return p.xyz/p.w;}
    float hs(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    void main(){float d=texture2D(tD,vUv).x;if(d>.99995){gl_FragColor=vec4(1.);return;}vec3 P=vp(vUv);vec2 px=1./res;
      vec3 Pr=vp(vUv+vec2(px.x,0.)),Pl=vp(vUv-vec2(px.x,0.)),Pu=vp(vUv+vec2(0.,px.y)),Pd=vp(vUv-vec2(0.,px.y));vec3 ex=abs(Pr.z-P.z)<abs(P.z-Pl.z)?Pr-P:P-Pl;vec3 ey=abs(Pu.z-P.z)<abs(P.z-Pd.z)?Pu-P:P-Pd;/* V238 pick the neighbour with the smaller depth step so walls seen at a grazing angle keep a clean normal (phone depth steps made moving dark stripes) */vec3 N=normalize(cross(ex,ey));float th=.12+mob*.0045*(-P.z);float ru=rad*pS/max(.5,-P.z),a=hs(vUv*res)*6.2832,o=0.;
      for(int i=0;i<12;i++){float t=(float(i)+.6)/12.;float an=a+t*17.;vec2 off=vec2(cos(an),sin(an))*ru*t;vec3 v=vp(vUv+off)-P;float l=length(v);o+=max(0.,dot(v/max(l,.001),N)-th)*(1.-smoothstep(rad*.6,rad*1.6,l));}
      float ao=1.-o/12.*str;ao=mix(ao,1.,smoothstep(45.,90.,-P.z));if(!(ao>=0.))ao=1.;gl_FragColor=vec4(vec3(clamp(ao,0.,1.)),1.);}`,{tD:{value:null},pInv:{value:new THREE.Matrix4()},pS:{value:1},rad:{value:1.1},str:{value:MOB?0:2.6},mob:{value:MOB?1:0},res:{value:new THREE.Vector2()}});
  ppM.blur=ppMat(PPH+`uniform sampler2D t;uniform vec2 dir;void main(){vec4 c=texture2D(t,vUv)*.2270270;c+=(texture2D(t,vUv+dir*1.3846154)+texture2D(t,vUv-dir*1.3846154))*.3162162;c+=(texture2D(t,vUv+dir*3.2307692)+texture2D(t,vUv-dir*3.2307692))*.0702703;gl_FragColor=c;}`,{t:{value:null},dir:{value:new THREE.Vector2()}});
  ppM.bright=ppMat(PPH+`uniform sampler2D t;uniform float th;void main(){vec3 c=min(max(texture2D(t,vUv).rgb,vec3(0.)),vec3(64.));float l=max(c.r,max(c.g,c.b));float k=clamp((l-th+.35)/.7,0.,1.);k=k*k*.5;float w=max(l-th,0.)+k*.35;gl_FragColor=vec4(c*(w/max(l,.0001)),1.);}`,{t:{value:null},th:{value:1}});
  ppM.copy=ppMat(PPH+`uniform sampler2D t;void main(){gl_FragColor=texture2D(t,vUv);}`,{t:{value:null}});
  ppM.comp=ppMat(PPH+`uniform sampler2D tC,tA,b0,b1,b2,tD;uniform mat4 pInv,cw;uniform vec3 cp,sd,fc,sc;uniform float exps,bk,aok,sat,vig,nt,vib,con,lift,fogD,fogK,fogH;
    vec3 RRT(vec3 v){vec3 a=v*(v+.0245786)-.000090537;vec3 b=v*(.983729*v+.4329510)+.238081;return a/b;}
    vec3 aces(vec3 c){const mat3 I=mat3(vec3(.59719,.07600,.02840),vec3(.35458,.90834,.13383),vec3(.04823,.01566,.83777));const mat3 O=mat3(vec3(1.60475,-.10208,-.00327),vec3(-.53108,1.10813,-.07276),vec3(-.07367,-.00605,1.07602));c*=exps/.6;c=I*c;c=RRT(c);c=O*c;return clamp(c,0.,1.);}
    void main(){vec3 c=texture2D(tC,vUv).rgb;c=max(c,vec3(0.));if(!(c.r+c.g+c.b<1e5))c=vec3(1.);float ao=texture2D(tA,vUv).r;c*=mix(vec3(1.),vec3(pow(ao,1.18),ao,pow(ao,.82)),aok);
      float fz=texture2D(tD,vUv).x;if(fogD>0.&&fz<.99995){vec4 fq=pInv*vec4(vUv*2.-1.,fz*2.-1.,1.);vec3 fv=fq.xyz/fq.w;vec3 fw=(cw*vec4(fv,1.)).xyz;vec3 rv=fw-cp;float ds=length(rv);vec3 rd=rv/max(ds,.001);float y0=cp.y-fogH,dy=rv.y;float ig=abs(fogK*dy)<1e-3?ds:(1.-exp(-fogK*dy))*ds/(fogK*dy);float dn=fogD*exp(-fogK*max(y0,-4.))*ig;float T=clamp(exp(-dn),0.,1.);float sg=pow(max(dot(rd,sd),0.),5.);c=mix(fc+sc*sg,c,T);}
      vec3 bl=texture2D(b0,vUv).rgb*.95+texture2D(b1,vUv).rgb*.6+texture2D(b2,vUv).rgb*.4;c+=bl*bk;
      c=aces(c);float l=dot(c,vec3(.2126,.7152,.0722));float sp=max(c.r,max(c.g,c.b))-min(c.r,min(c.g,c.b));c=clamp(mix(vec3(l),c,sat+vib*(1.-clamp(sp*1.6,0.,1.))),0.,1.);c=mix(c,c*c*(3.-2.*c),con);c*=vec3(1.015,1.,.985)+vec3(-.02,-.005,.04)*nt;
      vec2 q=vUv-.5;c*=1.-dot(q,q)*vig;c=c*(1.-lift)+lift*vec3(.62,.58,.86);gl_FragColor=vec4(c,1.);}`,{tC:{value:null},tA:{value:null},b0:{value:null},b1:{value:null},b2:{value:null},exps:{value:1.18},bk:{value:.5},aok:{value:.6},sat:{value:1.16},vig:{value:.46},nt:{value:0},vib:{value:.22},con:{value:.42},lift:{value:.05},tD:{value:null},pInv:{value:new THREE.Matrix4()},cw:{value:new THREE.Matrix4()},cp:{value:new THREE.Vector3()},sd:{value:new THREE.Vector3(0,1,0)},fc:{value:new THREE.Color()},sc:{value:new THREE.Color()},fogD:{value:0},fogK:{value:.09},fogH:{value:0}});
  ppM.taa=ppMat(PPH+`uniform sampler2D tC,tH,tD;uniform mat4 ivp,pvp;uniform vec2 px;uniform float first;
    void main(){vec3 c=texture2D(tC,vUv).rgb;vec3 mn=c,mx=c;
      for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec3 s=texture2D(tC,vUv+vec2(float(i),float(j))*px).rgb;mn=min(mn,s);mx=max(mx,s);}
      float d=texture2D(tD,vUv).x;vec4 wp=ivp*vec4(vUv*2.-1.,d*2.-1.,1.);wp/=wp.w;vec4 pc=pvp*wp;vec2 hu=pc.xy/pc.w*.5+.5;
      float a=.34;if(first>.5||hu.x<0.||hu.x>1.||hu.y<0.||hu.y>1.||!(pc.w>0.))a=1.;
      vec3 h=clamp(texture2D(tH,hu).rgb,mn,mx);a=clamp(a+length((hu-vUv)/px)*.1,0.,1.);
      gl_FragColor=vec4(mix(h,c,a),1.);}`,{tC:{value:null},tH:{value:null},tD:{value:null},ivp:{value:new THREE.Matrix4()},pvp:{value:new THREE.Matrix4()},px:{value:new THREE.Vector2()},first:{value:1}});
  ppM.dof=ppMat(PPH+`uniform sampler2D t,tD;uniform vec2 px;uniform float focus,amt,nr,fr;
    float ld(vec2 u){float d=texture2D(tD,u).x;return nr*fr/(fr-d*(fr-nr));}
    float cc(float z){float o=max(abs(z-focus)-(focus*.18+.7),0.);return amt*clamp(o/max(z,.1),0.,1.);}
    void main(){vec3 c0=texture2D(t,vUv).rgb;float R=cc(ld(vUv));if(R<.3){gl_FragColor=vec4(c0,1.);return;}
      vec3 acc=c0;float ws=1.;float rot=fract(sin(dot(vUv,vec2(12.9898,78.233)))*43758.5453)*6.2832;
      for(int i=0;i<14;i++){float fi=float(i);float r=sqrt((fi+.5)/14.);float an=fi*2.39996+rot;vec2 u=vUv+vec2(cos(an),sin(an))*r*R*px;
        float ci=cc(ld(u));float w=clamp(ci-r*R+1.,0.,1.);acc+=texture2D(t,u).rgb*w;ws+=w;}
      gl_FragColor=vec4(acc/ws,1.);}`,{t:{value:null},tD:{value:null},px:{value:new THREE.Vector2()},focus:{value:5},amt:{value:0},nr:{value:.1},fr:{value:320}});
  ppM.fxaa=ppMat(PPH+`uniform sampler2D t;uniform vec2 px;uniform float sh,mk;void main(){vec3 L=vec3(.299,.587,.114);vec3 nw=texture2D(t,vUv+vec2(-1.,-1.)*px).rgb,ne=texture2D(t,vUv+vec2(1.,-1.)*px).rgb,sw=texture2D(t,vUv+vec2(-1.,1.)*px).rgb,se=texture2D(t,vUv+vec2(1.,1.)*px).rgb,m=texture2D(t,vUv).rgb;
    float a=dot(nw,L),b=dot(ne,L),c=dot(sw,L),d=dot(se,L),e=dot(m,L),mn=min(e,min(min(a,b),min(c,d))),mx=max(e,max(max(a,b),max(c,d)));vec2 dir=vec2(-((a+b)-(c+d)),(a+c)-(b+d));
    float rd=max((a+b+c+d)*.03125,.0078125),rc=1./(min(abs(dir.x),abs(dir.y))+rd);dir=clamp(dir*rc,-8.,8.)*px;
    vec3 A=.5*(texture2D(t,vUv+dir*(-.1666667)).rgb+texture2D(t,vUv+dir*.1666667).rgb);vec3 B=A*.5+.25*(texture2D(t,vUv-dir*.5).rgb+texture2D(t,vUv+dir*.5).rgb);float lb=dot(B,L);
    vec3 r=mix(m,(lb<mn||lb>mx)?A:B,mk);vec3 av=(nw+ne+sw+se)*.25;r=clamp(r+(m-av)*sh,0.,1.);gl_FragColor=vec4(r,1.);}`,{t:{value:null},px:{value:new THREE.Vector2()},sh:{value:.5},mk:{value:.6}});
  R.toneMapping=THREE.NoToneMapping;PP.ready=true;ppResize()}
function ppTarget(w,h,o={}){const t=new THREE.WebGLRenderTarget(Math.max(1,w|0),Math.max(1,h|0),Object.assign({minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,depthBuffer:false,stencilBuffer:false},o));t.texture.generateMipmaps=false;return t}
function ppResize(){const v=new THREE.Vector2();R.getDrawingBufferSize(v);const w=v.x,h=v.y;if(w===PP.w&&h===PP.h&&ppRT)return;PP.w=w;PP.h=h;
  for(const t of[ppRT,ppAO,ppAO2,ppLDR,ppD,...ppH,...ppB,...ppT])if(t){if(t.depthTexture)t.depthTexture.dispose();t.dispose()}
  ppRT=ppTarget(w,h,{type:PP.type,depthBuffer:true});ppRT.depthTexture=new THREE.DepthTexture(w,h);ppRT.depthTexture.type=THREE.UnsignedIntType;ppRT.depthTexture.format=THREE.DepthFormat;
  ppAO=ppTarget(w/2,h/2);ppAO2=ppTarget(w/2,h/2);ppLDR=ppTarget(w,h);ppD=ppTarget(w,h);ppH=[ppTarget(w,h),ppTarget(w,h)];PP.first=1;ppB=[];ppT=[];for(let k=0;k<3;k++){const s=2<<k;ppB.push(ppTarget(w/s,h/s,{type:PP.type}));ppT.push(ppTarget(w/s,h/s,{type:PP.type}))}}
function ppPass(mat,target){ppQ.material=mat;R.setRenderTarget(target);R.render(ppS,ppC)}
// Inside a house nothing outdoors can be seen, but the merged campus meshes and the instanced trees/foliage are never frustum-culled
// (huge bounding spheres / frustumCulled=false), so they were still drawn and shadow-cast every frame. Skip them while the camera is in an interior.
let OUTSIDE=[];const OUTHID=[];
function outsideOff(){if(!OUTSIDE.length||typeof P==='undefined'||!P||!P.inside||mode==='title'||mode==='loading')return false;const I=INT[P.inside];if(!I)return false;const c=cam.position,m=14;
  if(c.x<I.x0-m||c.x>I.x1+m||c.z<I.z0-m||c.z>I.z1+m)return false;
  for(const o of OUTSIDE)if(o.visible){o.visible=false;OUTHID.push(o)}R.setClearColor(0x1e1812,1);return true}
function outsideOn(){for(const o of OUTHID)o.visible=true;OUTHID.length=0;R.setClearColor(0x000000,1)}
// V121 rig/interior parking. THREE recomputes every object's matrix each frame whether it is visible or not, and hidden NPC rigs (≈750 rigs,
// 34 bones each) plus the 69 hidden interiors were ~90% of the scene graph (13.9 ms → 1.5 ms per frame measured headless). Before each frame,
// anything hidden is detached from the scene and re-attached the moment the game makes it visible again. Only direct children of sc are touched;
// the scene root has an identity transform, so getWorldPosition on a parked group still gives the right answer.
function sceneSync(){try{for(const n of NP){const g=n.g;if(!g)continue;if(g.visible){if(g.userData.parked&&!g.parent){sc.add(g);g.userData.parked=0}}else if(g.parent===sc){sc.remove(g);g.userData.parked=1}}
  for(const id in INT){const g=INT[id].g;if(!g)continue;if(g.visible){if(g.userData.parked&&!g.parent){sc.add(g);g.userData.parked=0}}else if(g.parent===sc){sc.remove(g);g.userData.parked=1}}}catch(e){console.warn('sceneSync',e)}}
function renderFrame(){if(GLLOST)return;sceneSync();fdCull();try{dressTick()}catch(e){}try{treeLod()}catch(e){}const hid=outsideOff();try{if(!PP.ready){R.render(sc,cam);return}try{renderPost()}catch(e){console.warn('post-processing off:',e);PP.ready=false;try{cam.clearViewOffset()}catch(_){}R.toneMapping=THREE.ACESFilmicToneMapping;R.setRenderTarget(null);R.render(sc,cam)}}finally{if(hid)outsideOn()}}
const HAL=[[.5,.3333],[.25,.6667],[.75,.1111],[.125,.4444],[.625,.7778],[.375,.2222],[.875,.5556],[.0625,.8889]];
function renderPost(){ppResize();
  if(!PP.vp){PP.vp=new THREE.Matrix4();PP.ivp=new THREE.Matrix4();PP.pvp=new THREE.Matrix4();PP.pcam=new THREE.Vector3()}
  // close-up factor: how near the camera sits to the player (drives depth of field and a slightly deeper vignette)
  let fd=8,cu=0;try{if(mode!=='cine'&&mode!=='title'&&mode!=='loading'&&P&&P.x!=null){fd=Math.hypot(cam.position.x-P.x,cam.position.y-(P.y+(P.jy||0)+1.55),cam.position.z-P.z);cu=Math.min(1,Math.max(0,(9-fd)/5.5))}}catch(e){}
  if(!isFinite(fd)){fd=8;cu=0}PP.cu+=(cu-PP.cu)*.12;if(!isFinite(PP.cu))PP.cu=0;PP.fd=fd;   // V135: a single bad frame (NaN position) must not black out the picture for good
  const jit=PP.taa;if(jit){cam.updateMatrixWorld();if(PP.pcam.distanceTo(cam.position)>6)PP.first=1;PP.pcam.copy(cam.position);const j=HAL[PP.jf++&7];cam.setViewOffset(PP.w,PP.h,j[0]-.5,j[1]-.5,PP.w,PP.h)}
  OUTL.res.value.set(PP.w,PP.h);OUTL.w.value=Math.max(1.2,1.7*PP.h/1080);
  R.setRenderTarget(ppRT);R.render(sc,cam);
  // ambient occlusion from the depth buffer at half resolution, then a separable blur
  const A=ppM.ao.uniforms;A.tD.value=ppRT.depthTexture;A.pInv.value.copy(cam.projectionMatrixInverse);A.pS.value=cam.projectionMatrix.elements[5]*.5;A.res.value.set(ppAO.width,ppAO.height);ppPass(ppM.ao,ppAO);
  const Bu=ppM.blur.uniforms;Bu.t.value=ppAO.texture;Bu.dir.value.set(1/ppAO.width,0);ppPass(ppM.blur,ppAO2);Bu.t.value=ppAO2.texture;Bu.dir.value.set(0,1/ppAO.height);ppPass(ppM.blur,ppAO);
  if(jit){cam.clearViewOffset();cam.updateMatrixWorld();PP.vp.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);PP.ivp.copy(PP.vp).invert()}
  // bloom: bright pass, then a blurred mip chain
  ppM.bright.uniforms.t.value=ppRT.texture;ppM.bright.uniforms.th.value=PP.hdr?(1.05-NIGHT*.25):.82;ppPass(ppM.bright,ppB[0]);
  for(let k=0;k<3;k++){if(k){ppM.copy.uniforms.t.value=ppB[k-1].texture;ppPass(ppM.copy,ppB[k])}for(let r=0;r<(k?1:2);r++){Bu.t.value=ppB[k].texture;Bu.dir.value.set(1/ppB[k].width,0);ppPass(ppM.blur,ppT[k]);Bu.t.value=ppT[k].texture;Bu.dir.value.set(0,1/ppB[k].height);ppPass(ppM.blur,ppB[k])}}
  const C=ppM.comp.uniforms;C.tC.value=ppRT.texture;C.tA.value=ppAO.texture;C.b0.value=ppB[0].texture;C.b1.value=ppB[1].texture;C.b2.value=ppB[2].texture;C.bk.value=PP.bloomK*(.55+NIGHT*.9);C.aok.value=PP.aoK*(P&&P.inside?.8:1);C.sat.value=PP.sat;C.nt.value=NIGHT;C.exps.value=R.toneMappingExposure*.9;C.vig.value=.46+.18*PP.cu;C.lift.value=.05*(1-.4*NIGHT);C.sat.value=PP.sat;
  {const ins=!!(P&&P.inside)||mode==='title'||mode==='loading',sv=sun.position.clone().sub(sun.target.position).normalize();{const py=P&&isFinite(P.y)?P.y:0;if(PP.fh==null||!isFinite(PP.fh))PP.fh=py-2.5;else PP.fh+=((py-2.5)-PP.fh)*.05}
    C.tD.value=ppRT.depthTexture;C.pInv.value.copy(cam.projectionMatrixInverse);C.cw.value.copy(cam.matrixWorld);C.cp.value.copy(cam.position);C.sd.value.copy(sv);C.fc.value.copy(sc.fog.color);C.sc.value.copy(sun.color).multiplyScalar((1-NIGHT)*(sun.position.y>0?.5:0));C.fogH.value=PP.fh;C.fogD.value=ins?0:.0015*(1+.8*NIGHT)*(TC.g?.12:1)}
  ppPass(ppM.comp,ppLDR);let src=ppLDR;
  // temporal anti-aliasing (jittered camera, depth reprojection, neighbourhood clamp)
  if(jit){const T=ppM.taa.uniforms;T.tC.value=ppLDR.texture;T.tH.value=ppH[PP.hi^1].texture;T.tD.value=ppRT.depthTexture;T.ivp.value.copy(PP.ivp);T.pvp.value.copy(PP.pvp);T.px.value.set(1/PP.w,1/PP.h);T.first.value=PP.first?1:0;
    ppPass(ppM.taa,ppH[PP.hi]);src=ppH[PP.hi];PP.hi^=1;PP.first=0;PP.pvp.copy(PP.vp)}
  // slight depth of field when the camera is close in
  if(PP.dof&&PP.cu>.03){const D=ppM.dof.uniforms;D.t.value=src.texture;D.tD.value=ppRT.depthTexture;D.px.value.set(1/PP.w,1/PP.h);D.focus.value=Math.max(1.2,PP.fd);D.amt.value=4.2*PP.cu*Math.max(1,PP.h/1080);D.nr.value=cam.near;D.fr.value=cam.far;ppPass(ppM.dof,ppD);src=ppD}
  ppM.fxaa.uniforms.t.value=src.texture;ppM.fxaa.uniforms.px.value.set(1/PP.w,1/PP.h);{const far=Math.min(1,Math.max(0,(PP.fd-5)/8));ppM.fxaa.uniforms.sh.value=.55+.55*far;ppM.fxaa.uniforms.mk.value=jit?.55:.9}ppPass(ppM.fxaa,null)}
// ---- image-based light: the sky colours baked into a PMREM environment, refreshed as the day turns
let ENVS=null,ENVT=null,ENVK=-1,PMG=null,ENVBAD=0;
function envUpdate(force){if(GFX!=='enhanced'||ENVBAD)return;try{envUpdate_(force)}catch(e){ENVBAD=1;console.warn('environment light off:',e)}}
function envUpdate_(force){const k=Math.round((1-NIGHT)*12);if(!force&&k===ENVK)return;ENVK=k;
  if(!ENVS){ENVS=new THREE.Scene();const u={top:{value:new THREE.Color()},bot:{value:new THREE.Color()},gnd:{value:new THREE.Color()}};ENVS.userData.u=u;
    ENVS.add(new THREE.Mesh(new THREE.SphereGeometry(10,32,16),new THREE.ShaderMaterial({uniforms:u,side:THREE.BackSide,vertexShader:'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 top,bot,gnd;varying vec3 p;void main(){float h=p.y;vec3 c=h>0.?mix(bot,top,pow(clamp(h*1.6,0.,1.),.7)):mix(bot*.8,gnd,clamp(-h*4.,0.,1.));gl_FragColor=vec4(c,1.);\n#include <encodings_fragment>\n}'})));PMG=new THREE.PMREMGenerator(R)}
  const u=ENVS.userData.u;u.top.value.copy(skyU.top.value);u.bot.value.copy(skyU.bot.value);u.gnd.value.setRGB(.36,.29,.19).multiplyScalar(.35+.65*(1-NIGHT));
  const rt=PMG.fromScene(ENVS,0,.1,100);if(ENVT)ENVT.dispose();ENVT=rt;sc.environment=rt.texture}
// ---- WebGL context loss (V118): a second WebGL tab/game can make the browser drop this page's GL context (blank frame). three.js re-uploads
// textures/programs on restore, but render-target CONTENTS are gone: the PMREM environment map and the shadow map came back empty (terrain
// rendered black). So skip drawing while lost, then rebuild the post targets, environment map and shadow map when the context returns.
let GLLOST=false;
(function(){const cv=R.domElement;
  cv.addEventListener('webglcontextlost',e=>{e.preventDefault();GLLOST=true;console.warn('WebGL context lost')},false);
  cv.addEventListener('webglcontextrestored',()=>{
    try{
      R.setRenderTarget(null);
      if(PP.ready){PP.w=0;PP.h=0;try{ppResize()}catch(e){console.warn('post targets rebuild failed:',e);PP.ready=false;R.toneMapping=THREE.ACESFilmicToneMapping}PP.first=1}
      if(PMG){try{PMG.dispose()}catch(e){}PMG=new THREE.PMREMGenerator(R)}ENVT=null;ENVK=-1;ENVBAD=0;envUpdate(true);
      if(sun.shadow.map){try{sun.shadow.map.dispose()}catch(e){}sun.shadow.map=null}
      R.shadowMap.needsUpdate=true;SHF=0;ADP.skip=1;
    }catch(e){console.warn('GL restore failed:',e)}
    GLLOST=false;console.log('WebGL context restored')},false)})();
// ---- physically based surfaces for the procedural textures: glass glossy and a little metallic, masonry rough, relief from the texture itself
function pbrize(m,o={}){if(GFX!=='enhanced'||!m||!m.map||!m.map.image||m.userData.pbr||!m.isMeshStandardMaterial)return;m.userData.pbr=1;const img=m.map.image,W=img.width,H=img.height;if(!W||!H)return;
  const f=Math.min(1,(Math.max(W,H)>1024?512:256)/Math.max(W,H)),w2=Math.max(1,Math.round(W*f)),h2=Math.max(1,Math.round(H*f));   /* V296 roughness maps at 256 px (512 for big textures): a quarter of the graphics memory or less, same look */
  const c=document.createElement('canvas');c.width=w2;c.height=h2;const q=c.getContext('2d');q.drawImage(img,0,0,w2,h2);let d;try{d=q.getImageData(0,0,w2,h2)}catch(e){return}const a=d.data,base=o.rough!=null?o.rough*255:212;
  for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2],glass=b>r+14&&b>=g-8&&r+g+b<600;a[i]=255;a[i+1]=glass?30+(i%13):Math.min(255,base+((i*7)%23)-11);a[i+2]=glass?140:0;a[i+3]=255}
  q.putImageData(d,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=m.map.wrapS;t.wrapT=m.map.wrapT;t.repeat.copy(m.map.repeat);t.anisotropy=m.map.anisotropy;
  m.roughnessMap=t;m.metalnessMap=t;m.roughness=1;m.metalness=1;if(!MOB){m.bumpMap=m.map;m.bumpScale=o.bump!=null?o.bump:.022}/* V242 no bump relief on phones: its screen-space derivatives drew moving black diagonal stripes on big flat walls */
  if(o.detail){// close-up grain: a fine tiling noise multiplied over the facade so walls stay crisp at arm's length
    if(!FDET)FDET=ctex(128,128,(q,w,h)=>{q.fillStyle='#808080';q.fillRect(0,0,w,h);for(let i=0;i<5200;i++){const v=104+rnd()*48|0;q.fillStyle=`rgb(${v},${v},${v})`;q.fillRect(rnd()*w,rnd()*h,1+rnd()*2.5,1+rnd()*1.5)}for(let y=0;y<h;y+=16){q.fillStyle='rgba(60,60,60,.25)';q.fillRect(0,y,w,1)}});
    m.onBeforeCompile=sh=>{sh.uniforms.fDet={value:FDET};sh.fragmentShader='uniform sampler2D fDet;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n diffuseColor.rgb*=mix(vec3(1.),texture2D(fDet,vUv*14.).rgb*2.,.3);')};m.customProgramCacheKey=()=>'fdet'}
  m.needsUpdate=true}
let FDET=null;
// ---- night: warm pools of lamplight on the ground, the nearest lamps as real lights, the stadium field washed with floodlight
let POOLM=null,LPTS=[],LPT_T=0,FIELDL=null;
function nightLights(){if(GFX!=='enhanced')return;const tex=cvTex(128,128,(q,w,h)=>{const g=q.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=g;q.fillRect(0,0,w,h)});
  POOLM=new THREE.MeshBasicMaterial({map:tex,color:0xffc98a,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-4});
  const L=LAMPS.filter(([x,z])=>x>-50),im=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-PI/2),POOLM,L.length),m=new THREE.Matrix4();
  L.forEach(([x,z],i)=>{const disc=typeof DISCZ!=='undefined'&&DISCZ.some(b=>x>b[0]&&x<b[2]&&z>b[1]&&z<b[3]),s=disc?15:10;m.makeScale(s,1,s);m.setPosition(x,terrH(x,z)+.07,z);im.setMatrixAt(i,m)});im.frustumCulled=false;im.renderOrder=2;sc.add(im);
  for(let k=0;k<3;k++){const l=new THREE.PointLight(0xffc98a,0,16,2);l.position.set(0,-50,0);sc.add(l);LPTS.push(l)}
  if(typeof STAD!=='undefined'&&STAD.hl){const g=new THREE.PlaneGeometry(STAD.hl*2+14,STAD.hw*2+14).rotateX(-PI/2),fm2=new THREE.MeshBasicMaterial({map:tex,color:0xe8f0ff,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-4});
    FIELDL=new THREE.Mesh(g,fm2);FIELDL.position.set(STAD.cx,terrH(STAD.cx,STAD.cz)+.1,STAD.cz);FIELDL.rotation.y=Math.atan2(STAD.vx,STAD.vz);FIELDL.renderOrder=2;sc.add(FIELDL)}}
function nightTick(dt,em){if(GFX!=='enhanced')return;if(POOLM)POOLM.opacity=em*.55;if(FIELDL)FIELDL.material.opacity=em*.6;
  if(bulbs&&PP.hdr&&em>.2)bulbs.material.color.setRGB(2.6,2.25,1.6);
  if((LPT_T-=dt)<=0){LPT_T=.4;const px=P.x,pz=P.z,best=[];if(em>.05&&!P.inside)for(const[x,z]of LAMPS){const d=(x-px)**2+(z-pz)**2;if(d>1600)continue;best.push([d,x,z])}best.sort((a,b)=>a[0]-b[0]);
    LPTS.forEach((l,k)=>{const b=best[k];if(b){l.position.set(b[1],terrH(b[1],b[2])+4,b[2]);l.intensity=em*1.6}else{l.intensity=0}})}
  envUpdate(false)}


