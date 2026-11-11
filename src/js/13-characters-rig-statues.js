// ---------------------------------------------------------------- palette and material
const IRIS=[0x5a3a22,0x4a2e1a,0x6b4a2a,0x3a2a1a,0x3f6a8a,0x4f7a4a,0x7a6a3a,0x5d7f9c];
function chrGrade(c,ds=1.12,dl=.86){const q=new THREE.Color(c),h={};q.getHSL(h);q.setHSL(h.h,Math.min(1,h.s*ds),h.l*dl);return q}
function palFor(o){const V=(c,r,ds,dl)=>{const q=c&&c.isColor?c:chrGrade(c,ds,dl);return new THREE.Vector4(q.r,q.g,q.b,r)},sk=chrGrade(o.skin,1.02,.9),hr=new THREE.Color(o.hair);
  const lip=sk.clone().multiplyScalar(.84).lerp(new THREE.Color(o.fem?0xc04a5a:0xa8584e),o.fem?.55:.5);
  const P=[];P[PS.skin]=V(sk,.5);P[PS.hair]=V(o.hair,.5,1.3,.9);P[PS.shirt]=V(o.shirt,.86);P[PS.sleeve]=V(o.sleeve||o.shirt,.86);P[PS.pants]=V(o.pants,.84);P[PS.shoe]=V(o.shoe,.55);P[PS.sole]=V(o.sole,.7,1,.95);P[PS.eyeW]=V(new THREE.Color(.9,.89,.86),.1);P[PS.iris]=V(o.iris,.1,1.2,1);P[PS.dark]=V(new THREE.Color(.06,.045,.04),.35);
  P[PS.lip]=V(lip,.38);P[PS.belt]=V(0x2a221c,.5);P[PS.metal]=V(0xc4ad6c,.28);P[PS.b0]=V(0xd63a3a,.7);P[PS.b1]=V(0xf2c230,.7);P[PS.b2]=V(0x3a7ad6,.7);P[PS.b3]=V(0x3ab05a,.7);P[PS.cap]=V(o.cap||(o.hs2==='bucket'?0xb8a77a:0x23272f),.8);P[PS.glass]=V(0x15151a,.25);
  P[PS.brow]=V(hr.clone().multiplyScalar(.62),.7);P[PS.acc]=V(new THREE.Color(o.shirt).multiplyScalar(.7),.85);P[PS.white]=V(0xf4f3ee,.5,1,.95);P[PS.sacc]=V(o.sacc,.5);P[PS.lace]=V(0xf2f0ea,.7,1,.95);
  const H=HAIRP[o.hs2]||HAIRP.short;
  P[24]=new THREE.Vector4(0,0,0,0);P[25]=new THREE.Vector4(o.fh==='stubble'?1:o.fh==='beard'?1.7:o.fh?.6:o.fem?0:.25,o.fem?1:.35,o.cl2==='tank'?1:0,o.plaid?1:0);P[26]=new THREE.Vector4(...H);P[27]=new THREE.Vector4(o.hs2==='buzz'?.92:1,o.fem?1:0,o.hs2==='fade'?1:0,0);
  if(o.stone||o.metal){const base=o.stone?[0x7a7c80,0x6e7075,0x72747a]:[0xb08a50,0xa47e46,0xb89458];for(let i=0;i<24;i++){const q=new THREE.Color(base[i%3]);P[i]=new THREE.Vector4(q.r,q.g,q.b,o.stone?.95:.32)}
    const dk=new THREE.Color(base[1]).multiplyScalar(.72);P[PS.dark]=new THREE.Vector4(dk.r,dk.g,dk.b,P[0].w);P[25].set(0,0,0,0);P[27].w=1}
  return P}
function chrMat(pal,o){const m=new THREE.MeshStandardMaterial({vertexColors:true,skinning:true,roughness:.8,metalness:o.metal?.65:0,envMapIntensity:.5}),F=faceTex();m.userData.pal=pal;m.userData.dust={value:0};
  m.onBeforeCompile=sh=>{sh.uniforms.uPal={value:pal};sh.uniforms.uRim=CHR_RIM;sh.uniforms.uRimS=CHR_RIMS;sh.uniforms.uRimC=CHR_RIMC;sh.uniforms.uBnc=CHR_BNC;sh.uniforms.uSky=CHR_SKY;sh.uniforms.uFT1={value:F[0]};sh.uniforms.uFT2={value:F[1]};sh.uniforms.uDust=m.userData.dust;
    sh.vertexShader='attribute float pid;attribute vec3 hd;uniform vec4 uPal['+NPAL+'];varying float vRough;varying float vPid;varying vec3 vHd;varying vec3 vRest;varying float vShade;\n'+sh.vertexShader.replace('#include <color_vertex>','#include <color_vertex>\n{vec4 pc=uPal[int(pid+.5)];vShade=vColor.r;vColor.rgb*=pc.rgb;vRough=pc.a;vPid=pid;vHd=hd;vRest=position;}');
    sh.fragmentShader=CHR_FRAG_HEAD+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+CHR_FRAG_COL)
      .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=cRough;')
      .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n{float rim=pow(1.-clamp(dot(normal,normalize(vViewPosition)),0.,1.),2.4);float bl_=smoothstep(-.15,.55,dot(normal,normalize(vec3(.5,.42,-.75))));float rk=rim*(.3+.7*bl_);rk=mix(rk,smoothstep(.2,.36,rk),.5);totalEmissiveRadiance+=(diffuseColor.rgb*.3+uRimC)*rk*uRimS*(1.-.6*PF.w);vec3 upV=normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz);float dn=dot(normal,upV);totalEmissiveRadiance+=diffuseColor.rgb*(uBnc*smoothstep(.15,-.85,dn)+uSky*smoothstep(0.,1.,dn))*(1.-.6*PF.w);totalEmissiveRadiance+=diffuseColor.rgb*vec3(.13,.05,.028)*cSkin*clamp(uRim*3.,0.,1.)+cEm;}')
      .replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );','{float L_=dot(outgoingLight,vec3(.299,.587,.114));outgoingLight=max(vec3(0.),mix(vec3(L_),outgoingLight,1.05));}{vec3 em_=totalEmissiveRadiance;vec3 lit_=max(outgoingLight-em_,vec3(0.));float la_=max(dot(diffuseColor.rgb,vec3(.299,.587,.114)),.03);float r_=dot(lit_,vec3(.299,.587,.114))/la_;float q_=clamp(r_/1.7,0.,1.5)*4.;float i_=floor(q_);float f_=q_-i_;float st_=(i_+smoothstep(.36,.64,f_))/4.*1.7;float tr_=mix(r_,st_,.6*(1.-PF.w));vec3 tint_=mix(vec3(.78,.86,1.14),vec3(1.04,1.,.95),smoothstep(.15,1.1,tr_));lit_*=tr_/max(r_,.001)*tint_;outgoingLight=lit_+em_;}gl_FragColor = vec4( outgoingLight, diffuseColor.a );')};
  m.customProgramCacheKey=()=>'chr70';return m}
const CHR_FRAG_HEAD=`uniform vec4 uPal[${NPAL}];uniform float uRim,uRimS;uniform vec3 uRimC,uBnc,uSky;uniform sampler2D uFT1;uniform sampler2D uFT2;uniform float uDust;varying float vRough;varying float vPid;varying vec3 vHd;varying vec3 vRest;varying float vShade;
float S3(float a,float b,float x){float t=clamp((x-a)/(b-a),0.,1.);return t*t*(3.-2.*t);}
float h31(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float vn3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x),mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x),f.y),mix(mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x),mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}
float hairY(float a,vec4 H){float t=H.x-H.y;if(a<.5)return H.x-H.y*(a/.5)*(a/.5);if(a<.95)return t-.06*(a-.5)/.45;if(a<1.15)return mix(t-.06,H.z,(a-.95)/.2);if(a<1.36)return H.z;if(a<1.52)return mix(H.z,.24,(a-1.36)/.16);if(a<1.85)return .24;if(a<2.3)return mix(.24,H.w+.1,(a-1.85)/.45);return mix(H.w+.1,H.w,(a-2.3)/.84);}
`;
const CHR_FRAG_COL=`int cid=int(vPid+.5);float cRough=vRough;vec3 cEm=vec3(0.);float cSkin=(cid==0||cid==10)?1.:0.;
vec4 PA=uPal[24],PB=uPal[25],PH=uPal[26],PF=uPal[27];cSkin*=1.-PF.w;float cDist=length(vViewPosition);
vec3 dH=vHd/max(length(vHd),1e-4);
vec2 fu=vec2((dH.x+.8)/1.6,(dH.y+.95)/1.6);
vec2 rel=(fu-vec2(.3125,.19375))/vec2(.375,.25);
float inM=step(.5,PA.y)*step(0.,rel.x)*step(rel.x,1.)*step(0.,rel.y)*step(rel.y,1.);
vec2 auF=vec2(fu.x*.5+PF.y*.5,.5+fu.y*.5),auM=vec2((PF.y*512.+step(1.5,PA.y)*192.+clamp(rel.x,0.,1.)*192.)/1024.,1.-(512.+(1.-clamp(rel.y,0.,1.))*128.)/1024.);
vec2 au=mix(auF,auM,inM);
vec3 t1=texture2D(uFT1,au).rgb,t2=texture2D(uFT2,au).rgb;
if(cid==0&&dot(vHd,vHd)>.25){vec3 col=diffuseColor.rgb;float lipM=0.;float dkp=1.;
  float inF=step(0.,dH.z)*step(0.,fu.x)*step(fu.x,1.)*step(0.,fu.y)*step(fu.y,1.);
  if(inF>.5){float ink=t1.r,wh=t1.g,brow=t2.r,shd=t2.g,bl=t2.b;lipM=t1.b;
    col*=1.-.38*shd;col=mix(col,col*vec3(1.08,.78,.74),bl*PB.y*.8);
    float sbr=-.27+.3*smoothstep(.3,.85,abs(dH.x))+.05*clamp(PB.x-1.,0.,1.);float stub=PB.x*smoothstep(sbr+.03,sbr-.04,dH.y)*smoothstep(-.35,-.05,dH.z)*(1.-lipM);
    col=mix(col,uPal[1].rgb*mix(.55,.88,clamp(PB.x-1.,0.,1.)),min(1.,stub)*clamp(.32+.36*vn3(vRest*900.)+(PB.x-1.)*.7,0.,1.));
    col=mix(col,uPal[10].rgb*(1.-.3*shd),lipM);
    col=mix(col,uPal[19].rgb,brow*.6);
    float blink=PA.x,eo=wh*(fu.y>.56?1.-blink:1.);
    vec2 ec=vec2(dH.x<0.?.275:.725,.64875)+PA.zw*vec2(.03,.014);
    float er=length(fu-ec),ri=.05,rp=.021;
    vec3 sc=uPal[7].rgb*(1.-.35*shd);
    vec3 ic=uPal[8].rgb*(.5+.9*smoothstep(ri*1.05,ri*.2,er)*smoothstep(ec.y+.03,ec.y-.03,fu.y))*(1.-.35*shd);
    ic=mix(ic,ic*.3,smoothstep(ri*.72,ri,er));
    vec3 ey=mix(sc,ic,smoothstep(ri,ri-.0035,er));ey=mix(ey,uPal[9].rgb,smoothstep(rp,rp-.003,er));
    float hl=(smoothstep(.0115,.0075,length(fu-ec-vec2(.016,.018)))+.6*smoothstep(.006,.0035,length(fu-ec+vec2(.015,.012))))*(1.-PF.w);
    ey=mix(ey,vec3(1.),hl);
    col=mix(col,col*.32,eo*smoothstep(.62,.6,fu.y)*0.+eo*.65);
    col=mix(col,uPal[9].rgb,ink);cRough=mix(cRough,.32,lipM);dkp=(1.-.6*max(ink,max(lipM*.6,brow*.5)))*(1.-.85*wh);}
  float az=atan(dH.x,dH.z),hy=hairY(abs(az),PH);
  float cov=smoothstep(hy-.01,hy+.035,dH.y)*PF.x;cov*=mix(1.,.35+.65*smoothstep(-.05,.4,dH.y),PF.z);
  if(cov>0.){vec3 r=vRest-vec3(0.,1.76,-.02);float a2=atan(r.x,r.z);float n=vn3(vec3(a2*34.,r.y*11.,length(r.xz)*5.))*.6+vn3(vec3(a2*96.,r.y*30.,1.))*.4;n=mix(.5,n,smoothstep(.985,.88,normalize(r).y));col=mix(col,uPal[1].rgb*(.62+.62*n)*vShade,cov);cRough=mix(cRough,.55,cov);cSkin*=1.-cov;}
  {float pn=vn3(vRest*46.)*.55+vn3(vRest*160.)*.3+vn3(vRest*480.)*.15;float dd=clamp(uDust*(.3+1.15*pn),0.,.8)*(1.-cov)*dkp;col=mix(col,vec3(.93,.93,.9)*(.82+.18*vShade),dd);cRough=mix(cRough,.92,dd);}
  diffuseColor.rgb=col;}
if(cid==7&&dot(vHd,vHd)>.25){vec3 d=normalize(vHd);float sg=sign(vRest.x);vec3 c=normalize(vec3(sg*.05+PA.z*.34,.04+PA.w*.22,1.));float ang=acos(clamp(dot(d,c),-1.,1.));
  vec3 col=uPal[7].rgb;float ri=.6,rp=.26;vec3 ic=uPal[8].rgb*(.5+.9*smoothstep(ri,.08,ang)*smoothstep(-.4,.3,dot(d-c,vec3(0.,-1.,0.))+.1));ic=mix(ic,ic*.3,smoothstep(ri*.78,ri,ang));
  float aw=.03;
#if __VERSION__ >= 300
  aw=clamp(fwidth(ang)*1.25,.014,.09);
#endif
  col=mix(col,ic,smoothstep(ri+aw,ri-aw,ang));col=mix(col,uPal[9].rgb,smoothstep(rp+aw*.9,rp-aw*.9,ang));col*=1.-.4*smoothstep(-.05,.65,d.y);
  float hl=(smoothstep(.972,.984,dot(d,normalize(vec3(.34,.44,1.))))+.65*smoothstep(.988,.994,dot(d,normalize(vec3(-.3,-.24,1.)))))*(1.-PF.w);col=mix(col,vec3(1.),hl);cEm+=vec3(hl*.5);cRough=.07;
  if(PA.x>.5){col=uPal[0].rgb*(.85+.15*smoothstep(-.2,.6,d.y));col=mix(col,uPal[9].rgb,smoothstep(.07,.025,abs(d.y+.02)));cRough=.5;}
  diffuseColor.rgb=col;}
if(cid==1){vec3 r=vRest-vec3(0.,1.76,-.02);float a=atan(r.x,r.z);float n=vn3(vec3(a*34.,r.y*11.,length(r.xz)*5.))*.6+vn3(vec3(a*96.,r.y*30.,1.))*.4;n=mix(.5,n,smoothstep(.985,.88,normalize(r).y));diffuseColor.rgb*=.62+.62*n;cRough=.38+.3*(1.-n);}
if(cid==2&&PB.z>.5){float ax=abs(vRest.x),th=vRest.z>0.?1.452:1.5;float m=max(smoothstep(.152,.166,ax)*smoothstep(1.355,1.375,vRest.y),smoothstep(.078,.066,ax)*smoothstep(th,th+.012,vRest.y));diffuseColor.rgb=mix(diffuseColor.rgb,uPal[0].rgb*vShade,m);cSkin=max(cSkin,m*(1.-PF.w));cRough=mix(cRough,.5,m);cid=m>.5?0:2;}
if((cid==2||cid==3)&&PB.w>.5){float a1=vRest.x+vRest.z*.6,a2=vRest.y;float s1=step(.6,fract(a1*6.5)),s2=step(.6,fract(a2*6.5)),l1=step(.9,fract(a1*13.+.27)),l2=step(.9,fract(a2*13.+.27));diffuseColor.rgb*=1.-.42*max(s1,s2)-.2*s1*s2;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.62,.36)*vShade,.32*max(l1,l2)*(1.-max(s1,s2)));}
if(cid>=2&&cid<=4&&cDist<9.){float n=vn3(vRest*240.)*.6+vn3(vRest*vec3(40.,520.,40.))*.4;diffuseColor.rgb*=1.+(n-.5)*.12*smoothstep(9.,3.,cDist);}
if(PF.w<.5&&(cid==2||cid==3||cid==4||(cid==0&&dot(vHd,vHd)<.25))){
  float ax=abs(vRest.x),ry=vRest.y,rz=vRest.z,nr=S3(9.,3.,cDist);vec3 c0=diffuseColor.rgb,col=c0;
  float isS=(cid==2||cid==3)?1.:0.,isT=(cid==2)?1.:0.,isL=(cid==3)?1.:0.,isP=(cid==4)?1.:0.;
  col*=mix(1.,mix(.86,1.07,S3(.95,1.5,ry)),isS)*mix(1.,mix(.88,1.05,S3(.1,.95,ry)),isP);
  float tor=isS*S3(.3,.26,ax)*S3(.9,.95,ry)*S3(1.58,1.54,ry);
  float wr=sin(ry*47.+vn3(vRest*vec3(8.,2.,8.))*6.+sin(ax*10.+rz*6.)*1.3),wm=S3(1.19,1.04,ry)*S3(.93,.99,ry)*tor;
  col*=1.-.12*S3(.25,.95,wr)*wm;col*=1.+.045*S3(-.2,-.95,wr)*wm;
  float fm=tor*S3(.1,.2,ax)*S3(.27,.22,ax)*S3(1.13,1.25,ry)*S3(1.42,1.33,ry),fd=abs(fract(ry*6.2-ax*4.4+rz*2.+vn3(vRest*7.)*.6)-.5);
  col*=1.-.085*S3(.1,.02,fd)*fm;
  float side=S3(.14,.03,abs(rz)),ap=S3(.2,.26,ax)*S3(.35,.3,ax)*S3(1.2,1.29,ry)*S3(1.42,1.34,ry)*side;col*=1.-.4*ap;
  col*=1.-.34*isT*S3(1.49,1.552,ry)*S3(.26,.1,ax);
  col*=1.-.16*isT*S3(.014,0.,abs(ry-.992));
  col*=1.-.2*isP*exp(-((ry-.5)/.035)*((ry-.5)/.035))*S3(.01,-.07,rz);
  col*=1.-.07*isP*S3(.9,.78,ry)*S3(.58,.7,ry)*S3(.1,.02,abs(fract(ry*9.+ax*5.+rz*3.)-.5));
  vec3 th=c0*1.4+vec3(.09,.08,.06);float qs=vRest.x>0.?1.:-1.;
  float stT=isT*S3(.0028,.0008,abs(ry-.972))*step(.5,fract(atan(vRest.x,rz)*44.));
  float aa=atan(vRest.x-qs*.35,rz+.015);
  float stS=isL*(S3(.0028,.0008,abs(ry-1.296))+S3(.0028,.0008,abs(ry-1.418)))*step(.5,fract(aa*36.));
  float ss=isT*S3(.005,.0016,abs(rz))*S3(.16,.19,ax)*S3(.95,.99,ry)*S3(1.3,1.25,ry)*step(.5,fract(ry*60.));
  float stP=isP*S3(.0028,.0008,abs(ry-.172))*step(.5,fract(atan(vRest.x-qs*.108,rz)*42.));
  col=mix(col,th,clamp(stT+stS+ss+stP,0.,1.)*nr*.8);
  diffuseColor.rgb=col;}
`;
// ---------------------------------------------------------------- build a person (same contract as mkPerson: a Group with P.{lL,lR,aL,aR,torso,prop})
const STYLEK=[];
function nameSeed(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
// V117 o.sd (a seed from the character's name) makes hair style, facial hair, eyes and outfit come out the same every time that person is built
function pickStyle(o){const RR=o.sd!=null?mulberry(o.sd):rnd,PK=a=>a[Math.floor(RR()*a.length)];if(o.shadow&&!o.hs2)Object.assign(o,{hs2:'short',cl2:'tee',fh:0,fv:1,iris:0x4a2e1a,_pl:1});if(o.hs2&&!o._pl)return;const r=RR();
  if(o.hs2);else if(o.fem)o.hs2=o.hs==='curly'||o.hs==='afro'||o.hs==='bucket'?o.hs:PK(['long','long','pony','bun']);else o.hs2=o.hs||PK(['short','short','fade','fade','swept','buzz']);
  if(!o.cl2)o.cl2=o.letters||o.pin?'tee':PK(['tee','tee','tee','hoodie','polo',o.fem?'tee':'tank']);if(o.fh==null)o.fh=o.fem?0:(r<.22?'stubble':r<.32?'goatee':r<.4?'beard':0);
  if(o.fv==null)o.fv=o.fem?0:(RR()*3)|0;if(o.iris==null)o.iris=pick(IRIS);
  const k0=styleKey(o);if(!o._pl&&o.sd==null&&!STYLEK.includes(k0)){if(STYLEK.length<30)STYLEK.push(k0);else{const need=o.letters||o.pin;let best=null,bs=-1;
      for(const s of STYLEK){const a=s.split('|');if(+a[0]!==(o.fem?1:0)||+a[5]!==(o.prop?1:0)||+a[6]!==(o.cap?1:0)||(need&&a[2]!=='tee'))continue;const sc=(a[1]===o.hs2?2:0)+(a[2]===o.cl2?2:0)+(+a[4]===(o.gl?1:0)?1.5:0)+RR()*.8;if(sc>bs){bs=sc;best=a}}
      if(best){o.hs2=best[1];o.cl2=best[2];if(best[3]!=='0')o.fh=best[3];else if(o.fh!=='stubble')o.fh=0;o.gl=+best[4];o.fv=+best[7]}else STYLEK.push(k0)}}
  if(o.shoe==null){const k=(o.pants>>>3)%6;o.shoe=[0x23242a,0xeae8e2,0x8a2a2a,0x2c3a5a,0xeae8e2,0x5a3a26][k];o.sole=o.shoe===0xeae8e2||o.shoe===0x23242a?0xeceae4:0xf2f0ea;o.sacc=o.shoe===0xeae8e2?(o.shirt||0x2a4a8a):0xeae8e2}if(o.sole==null)o.sole=0xeceae4;if(o.sacc==null)o.sacc=0xeae8e2}
function curvedPlane(w,h,fem){const g=new THREE.PlaneGeometry(w,h,18,2),p=g.attributes.position,rx=fem?.216:.259,rf=fem?.163:.164;for(let i=0;i<p.count;i++){const x=p.getX(i),t=Math.min(.999,Math.abs(x)/rx);p.setZ(i,rf*Math.pow(1-Math.pow(t,2.6),1/2.6)+(fem?.024*Math.exp(-Math.pow((t-.38)/.25,2)):.0115*Math.exp(-Math.pow((t-.42)/.3,2)))+.008)}g.computeVertexNormals();return g}
function mkPersonX(o){o=Object.assign({},o);pickStyle(o);const fem=!!o.fem,BP=bonePos(fem),g=new THREE.Group(),B={};
  for(const n of BN){const b=new THREE.Bone();b.name=n;B[n]=b}
  for(const n of BN){const p=BPAR[n],w=BP[n];if(p){const q=BP[p];B[n].position.set(w[0]-q[0],w[1]-q[1],w[2]-q[2]);B[p].add(B[n])}else B[n].position.set(...w)}
  g.add(B.hips);g.updateMatrixWorld(true);
  const pal=palFor(o),mat=chrMat(pal,o),sk=new THREE.Skeleton(BN.map(n=>B[n])),hi=new THREE.SkinnedMesh(buildBody(o,0),mat),lo=new THREE.SkinnedMesh(buildBody(o,1),mat);
  for(const m of[hi,lo]){m.bind(sk);m.castShadow=true;m.receiveShadow=true}
  if(!(o.stone||o.metal))for(const m of[hi,lo])addOutline(m,sk,o.shirt);
  B.head.scale.setScalar(CHR_PROP.hs);B.head.position.y+=CHR_PROP.lift;   /* V306 smaller head, a little more neck (after binding, so the mesh follows) */
  const L=new THREE.LOD();L.addLevel(hi,0);L.addLevel(lo,o.shadow?60:14);g.add(L);
  {const cs=GC.csh||(GC.csh={geo:new THREE.PlaneGeometry(1,1).rotateX(-PI/2),mat:new THREE.MeshBasicMaterial({map:cvTex(128,128,(q,w,h)=>{const gr=q.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.4,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,w,h)}),transparent:true,opacity:.55,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3})});
   const m1=new THREE.Mesh(cs.geo,cs.mat),m2=new THREE.Mesh(cs.geo,cs.mat);m1.scale.set(1.05,1,.85);m2.scale.set(.62,1,.5);for(const m of[m1,m2]){m.position.y=.03;m.renderOrder=1;m.matrixAutoUpdate=true;g.add(m)}g.CS=[m1,m2]}
  g.P={lL:B.lL,lR:B.lR,aL:B.aL,aR:B.aR,torso:hi,lo,kL:B.kL,kR:B.kR,eL:B.eL,eR:B.eR,hL:B.hL,hR:B.hR,fL:B.fL,fR:B.fR,hips:B.hips,spine:B.spine,chest:B.chest,neck:B.neck,head:B.head,_o:o,pal};
  for(const n of BN)if(!g.P[n])g.P[n]=B[n];g.P.fing={};for(const S of['L','R'])g.P.fing[S]={a:[0,1,2,3].map(i=>B[S+i+'a']),b:[0,1,2,3].map(i=>B[S+i+'b']),ta:B[S+'Ta'],tb:B[S+'Tb'],c:.3,cT:.3,sp:0};   /* V307 fingers */
  if(o.letters){const k='letp67'+(fem?'f':'m'),lp=new THREE.Mesh(GC[k]||(GC[k]=curvedPlane(.34,.17,fem)),letMat(o.letters));lp.position.set(0,.02,0);B.chest.add(lp)}
  if(o.pin&&!(o.stone||o.metal)){const pn=new THREE.Mesh(GC.pin67||(GC.pin67=roundBox(.06,.06,.014,.006,1)),mt(0xe2b64c,.35,.6));pn.position.set(.12,.1,.152);B.chest.add(pn)}
  if(o.prop){const pg=GC.propg||(GC.propg=mergeParts([[PG.blade,0xf2c230,0,0,0],[PG.blade,0xd63a3a,0,0,0,PI/2]]));const pr=new THREE.Mesh(pg,PMAT);pr.position.set(0,2.135-BP.head[1],0);pr.castShadow=true;B.head.add(pr);g.P.prop=pr;PROPS.push(pr)}
  return g}
/* V307 hands: fingers curl with the situation. c = curl (0 open .. 1 fist), smoothed; the thumb follows */
const HPOSE={open:[.06,.1,0],relax:[.32,.15,.05],grip:[.95,.6,0],fist:[1.25,.95,0],tray:[.12,.2,.12]};
function handPose(g,p,st,dt){const F=p.fing;if(!F)return;const H=g.HOLD,hasR=p.hR&&p.hR.children.some(c=>!c.isBone),hasL=p.hL&&p.hL.children.some(c=>!c.isBone);
  const want=s=>{if(g.HPF)return g.HPF;const R=s==='R',fight=st==='punch'||st==='guard';if(fight)return'fist';if(st==='bike')return'grip';if(H==='tray')return'tray';
    if(H==='box'||H==='overhead')return'grip';if((H==='up'||H==='bucket')&&R)return'grip';if(R?hasR:hasL)return'grip';if(st==='wave'&&R)return'open';if(st==='talk'||g.TALK)return'open';if(st==='carry')return'grip';return'relax'};
  const k=Math.min(1,dt*12);
  for(const S of['L','R']){const h=F[S],s=S==='L'?-1:1,P_=HPOSE[want(S)];h.c+=(P_[0]-h.c)*k;h.cT+=(P_[1]-h.cT)*k;h.sp+=(P_[2]-h.sp)*k;const c=h.c;
    for(let i=0;i<4;i++){const e=1+(i-1)*.06;h.a[i].rotation.set((i-1.5)*(.035+h.sp)*(1-c*.7),0,-s*c*e);h.b[i].rotation.set(0,0,-s*Math.min(1.7,c*1.25*e))}
    h.ta.rotation.set(-(.15+1*h.cT),0,-s*(.12+.42*h.cT));h.tb.rotation.set(0,0,-s*(.12+.82*h.cT))}}
// ---------------------------------------------------------------- animation: knees, elbows, hips, spine, breathing, glances, eye contact, blinking, talking mouths,
// and a spring layer (lean into acceleration and turns, lag on stops, flinch / stagger on hits) that makes bodies feel physical
const _q=new THREE.Quaternion();
function animX(g,sp,t,st){const p=g.P;if(!p.kL||g.RAG)return;const k=Math.min(1,sp/3),run=sp>4.6,w=run?11.5:7.6,ph=t*w,s=Math.sin(ph),c=Math.cos(ph);
  const A=g.AX||(g.AX={t,x:g.position.x,z:g.position.z,ry:g.rotation.y,vf:0,vr:0,yr:0,lx:0,lxv:0,lz:0,lzv:0,hb:0,hbv:0,bt:2+rnd()*3,bl:0,lk:0,lky:0,tl:0,tly:0,lt:0,id:rnd()*100});
  let dt=t-A.t;A.t=t;if(!(dt>0)||dt>.25)dt=1/60;
  const ry=g.rotation.y,fx=Math.sin(ry),fz=Math.cos(ry),vx=(g.position.x-A.x)/dt,vz=(g.position.z-A.z)/dt;A.x=g.position.x;A.z=g.position.z;
  let dry=ry-A.ry;dry=Math.atan2(Math.sin(dry),Math.cos(dry));A.ry=ry;
  const tele=Math.hypot(vx,vz)>25;const vf=tele?A.vf:vx*fx+vz*fz,vr=tele?A.vr:vx*fz-vz*fx;
  const af=clamp((vf-A.vf)/dt,-40,40),ar=clamp((vr-A.vr)/dt,-40,40);A.vf+=(vf-A.vf)*Math.min(1,dt*10);A.vr+=(vr-A.vr)*Math.min(1,dt*10);A.yr+=(clamp(dry/dt,-8,8)-A.yr)*Math.min(1,dt*8);
  // springs: pitch (lx) and roll (lz)
  const tx=clamp(-af*.006+(run?.16:.04)*k,-.4,.45),tz=clamp(ar*.004+A.yr*Math.min(1,sp/5)*.06,-.3,.3);
  A.lxv+=((tx-A.lx)*90-A.lxv*11)*dt;A.lx+=A.lxv*dt;A.lzv+=((tz-A.lz)*80-A.lzv*10)*dt;A.lz+=A.lzv*dt;
  for(const b of[p.hips,p.spine,p.chest,p.neck,p.head])b.rotation.set(0,0,0);p.hips.position.set(0,.92,0);p.fL.rotation.set(0,0,0);p.fR.rotation.set(0,0,0);
  let kl=0,kr=0,el=-.3,er=-.3,azL=-.1,azR=.1;
  if(st==='sit'){kl=kr=1.45;el=er=-.55;azL=-.05;azR=.05}
  else if(st==='bike'){kl=1.3+Math.sin(t*9)*.45;kr=1.3-Math.sin(t*9)*.45;el=er=-.5;p.spine.rotation.x=.25}
  else{kl=k*(.1+(run?1.3:.9)*Math.max(0,-c));kr=k*(.1+(run?1.3:.9)*Math.max(0,c));
    const sw=run?1.25:.42;el=-(.18+sw*k*(.6+.4*Math.max(0,s)));er=-(.18+sw*k*(.6+.4*Math.max(0,-s)));
    p.hips.position.y=.92-.025*k+Math.abs(s)*(run?.05:.03)*k;p.hips.rotation.y=-s*.09*k;p.hips.rotation.z=s*.035*k;p.chest.rotation.y=s*.13*k;p.spine.rotation.x=A.lx*.6;p.chest.rotation.x=A.lx*.35;
    p.spine.rotation.z=-A.lz*.6;p.head.rotation.x=-A.lx*.55;p.head.rotation.z=A.lz*.3;p.head.rotation.y=-s*.05*k;
    if(k<.05){p.chest.rotation.x+=Math.sin(t*1.6+A.id)*.025;p.hips.rotation.z+=Math.sin(t*.55+A.id)*.025;p.hips.position.x=Math.sin(t*.55+A.id)*.012;p.spine.rotation.z-=Math.sin(t*.55+A.id)*.02;
      azL=-.12-Math.sin(t*1.6+A.id)*.015;azR=.12+Math.sin(t*1.6+A.id)*.015;p.aL.rotation.x-=.07;p.aR.rotation.x-=.07;el=-.32-Math.sin(t*1.6+A.id)*.03;er=-.32-Math.sin(t*1.6+A.id+.5)*.03;kl=.06+Math.max(0,Math.sin(t*.55+A.id))*.08;kr=.06+Math.max(0,-Math.sin(t*.55+A.id))*.08}
    else{azL=-.08-.05*k;azR=.08+.05*k}
    if(st==='punch'){er=-.05;el=-1.9;p.chest.rotation.y=-.4}else if(st==='guard'){el=er=-1.9;p.spine.rotation.x+=.14;p.head.rotation.x-=.1}else if(st==='carry'){el=er=-.25}
    else if(st==='wave'){er=-.6-Math.max(0,Math.sin(t*8))*.5;azR=.25}else if(st==='talk'){el=-.5-Math.max(0,Math.sin(t*1.7))*.7;er=-.5-Math.max(0,Math.sin(t*2.3+1))*.8;p.head.rotation.x+=Math.sin(t*2.1+A.id)*.05}
    else if(st==='throw'){el=-.4;er=-.6}}
  // eye contact: people near the player turn their head and eyes to them; otherwise an occasional glance around
  let hy=0,ey=0,near=false,px=0,pz=0;try{if(g!==PM&&st!=='bike'&&P&&PM){near=true;px=P.x;pz=P.z}}catch(e){}
  if(near){const dx=px-g.position.x,dz=pz-g.position.z,d=Math.hypot(dx,dz);if(d<7&&d>.3){let rel=Math.atan2(dx,dz)-ry;rel=Math.atan2(Math.sin(rel),Math.cos(rel));if(Math.abs(rel)<1.9){A.tl=clamp(rel,-1.05,1.05);A.lt=t}}}
  if(t-A.lt>.6){if(t>A.tly){A.tly=t+2+rnd()*4;A.tl=rnd()<.55?0:(rnd()-.5)*1.3}}
  A.lk+=(A.tl-A.lk)*Math.min(1,dt*(near?4:2.5));hy=A.lk*.75;ey=clamp((A.tl-A.lk)*2.2+A.lk*.35,-1,1);
  p.neck.rotation.y=hy*.35;p.head.rotation.y+=hy*.65;
  // head bobble spring
  A.hbv+=((-(p.hips.position.y-.92)*6-A.hb)*120-A.hbv*12)*dt;A.hb+=A.hbv*dt;p.head.rotation.x+=A.hb*.4;
  p.kL.rotation.set(kl,0,0);p.kR.rotation.set(kr,0,0);p.eL.rotation.set(el,0,0);p.eR.rotation.set(er,0,0);
  p.aL.rotation.z=azL-A.lz*.4;p.aR.rotation.z=azR-A.lz*.4;p.aL.rotation.x+=A.lx*.5;p.aR.rotation.x+=A.lx*.5;
  p.fL.rotation.x=-kl*.3*(k>.05?1:0);p.fR.rotation.x=-kr*.3*(k>.05?1:0);
  if(st!=='sit'&&st!=='bike'&&k>.05){p.lL.rotation.x-=.06;p.lR.rotation.x-=.06}
  if(g.HOLD==='up'&&st!=='punch'&&st!=='guard'){p.aR.rotation.set(-.35,0,.14);p.eR.rotation.set(-1.35,0,0)}else if(g.HOLD==='overhead'&&st!=='punch'&&st!=='guard'){p.aL.rotation.set(-2.9,0,-.2);p.aR.rotation.set(-2.9,0,.2);p.eL.rotation.set(-.45,0,0);p.eR.rotation.set(-.45,0,0)}else if(g.HOLD==='bucket'&&st!=='punch'&&st!=='guard'){p.aR.rotation.set(p.aR.rotation.x*.35,0,.24);p.eR.rotation.set(-.12,0,0)}
  else if(g.HOLD==='box'&&st!=='punch'&&st!=='guard'){p.aR.rotation.set(-.3,0,.3);p.eR.rotation.set(-2.05,0,0)}
  else if(g.HOLD==='tray'&&st!=='punch'&&st!=='guard'){for(const[a,e,sg]of[[p.aL,p.eL,-1],[p.aR,p.eR,1]]){a.rotation.set(-.03,-sg*.02,-sg*.254);e.rotation.set(-1.296,0,0)}}   // V166 solved so both palms sit on the rim of a tray at chest (0,-.135,.27), r .25
  try{handPose(g,p,st,dt)}catch(e){}
  const gsm=gestPose(g,p,t);
  // hit reactions: a damped spring kicked by hitNPC / hitPlayer
  if(g.FL){const a=t-(g.FLt??t);if(g.FLt==null)g.FLt=t;if(a>1.4)g.FL=0;else{const f=g.FL*Math.exp(-a*4.5)*Math.cos(a*12),dir=g.FLd||1;p.spine.rotation.x-=f*.4*dir;p.chest.rotation.x-=f*.32*dir;p.head.rotation.x-=f*.55*dir;p.neck.rotation.z+=f*.25*(g.FLs||1);p.spine.rotation.z+=f*.15*(g.FLs||1);
    p.aL.rotation.x+=f*.6;p.aR.rotation.x+=f*.6;p.aL.rotation.z-=f*.35;p.aR.rotation.z+=f*.35;p.kL.rotation.x+=Math.abs(f)*.4;p.kR.rotation.x+=Math.abs(f)*.25;p.hips.position.y-=Math.abs(f)*.05}}
  // face: blinking, eyes, mouth
  const pal=p.pal;if(pal&&pal[27].w<.5){A.bt-=dt;if(A.bt<=0){A.bl=.14;A.bt=2+rnd()*4;if(rnd()<.15)A.bt=.25}if(A.bl>0)A.bl-=dt;
    const pa=pal[24];pa.x=A.bl>0?1:0;pa.z=ey;pa.w=(st==='sit'?-.3:0)+(g.FL?.4:0);
    pa.y=gsm?gsm:p.smileOn?1:st==='wave'?1:st==='talk'||g.TALK?(Math.sin(t*13+A.id)>.1&&Math.sin(t*3.1+A.id)>-.6?2:0):0}}
// ---- V169 narration gestures: stage directions in dialogue ("He grins.", "He shrugs.") play as body animation on the character instead of emoji.
// gesture(g,key) starts one; animX layers it over the normal pose (g.GST = {k,t0,d}); returns the mouth state (0 none, 1 smile, 2 open).
const GEST={
 grin:[1.9,(P,e,w)=>{P.head.rotation.x-=.08*e;P.head.rotation.z+=.14*e;P.chest.rotation.x-=.05*e;P.chest.rotation.x+=Math.sin(w*13)*.012*e;return 1}],
 smile:[1.9,(P,e,w)=>{P.head.rotation.z+=.1*e;P.head.rotation.x-=.04*e;return 1}],
 laugh:[2.0,(P,e,w)=>{const b=Math.sin(w*15);P.head.rotation.x+=(-.22+b*.05)*e;P.chest.rotation.x+=(-.08+b*.05)*e;P.spine.rotation.x-=.06*e;P.hips.position.y+=Math.abs(b)*.012*e;P.aL.rotation.x+=b*.05*e;P.aR.rotation.x+=b*.05*e;return 2}],
 wink:[1.4,(P,e,w)=>{P.head.rotation.z+=.17*e;P.head.rotation.x-=.05*e;return 1}],
 nod:[1.5,(P,e,w)=>{P.head.rotation.x+=Math.sin(w*7.5)*.2*e;P.chest.rotation.x+=Math.sin(w*7.5-.5)*.03*e;return 0}],
 shrug:[2.0,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aL,-.35,0,-.55);R(P.aR,-.35,0,.55);R(P.eL,-1.25,0,0);R(P.eR,-1.25,0,0);P.head.rotation.z+=.16*e;P.head.rotation.x-=.05*e;P.chest.rotation.x-=.04*e;return 0}],
 sigh:[2.4,(P,e,w,u)=>{const inh=u<.35?Math.sin(u/.35*PI/2):Math.cos((u-.35)/.65*PI/2),slump=u<.35?0:Math.sin((u-.35)/.65*PI);P.chest.rotation.x+=-.1*inh*e+.1*slump*e;P.spine.rotation.x+=.16*slump*e;P.head.rotation.x+=.2*slump*e-.05*inh*e;P.aL.rotation.z-=.12*inh*e;P.aR.rotation.z+=.12*inh*e;return 0}],
 glare:[2.0,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};P.spine.rotation.x+=.1*e;P.head.rotation.x+=.14*e;R(P.eL,-1.0,0,0);R(P.eR,-1.0,0,0);R(P.aL,-.25,0,-.1);R(P.aR,-.25,0,.1);return 0}],
 punch:[1.1,(P,e,w,u)=>{const k=Math.sin(Math.min(1,u*1.6)*PI);const R=(o,x,y,z,f)=>{o.rotation.x+=(x-o.rotation.x)*f;o.rotation.y+=(y-o.rotation.y)*f;o.rotation.z+=(z-o.rotation.z)*f};R(P.aR,-1.5,0,.1,k);R(P.eR,-.1,0,0,k);P.chest.rotation.y-=.45*k;P.spine.rotation.x+=.1*k;return 0}],
 shove:[1.3,(P,e,w,u)=>{const k=Math.sin(Math.min(1,u*1.4)*PI);const R=(o,x,y,z,f)=>{o.rotation.x+=(x-o.rotation.x)*f;o.rotation.y+=(y-o.rotation.y)*f;o.rotation.z+=(z-o.rotation.z)*f};R(P.aL,-1.25,0,-.15,k);R(P.aR,-1.25,0,.15,k);R(P.eL,-.3,0,0,k);R(P.eR,-.3,0,0,k);P.chest.rotation.x+=.18*k;P.spine.rotation.x+=.1*k;return 0}],
 give:[2.0,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aR,-1.15,0,.2);R(P.eR,-.4,0,0);P.chest.rotation.x+=.08*e;P.head.rotation.x+=.05*e;return 0}],
 point:[1.8,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aR,-1.45,0,.2);R(P.eR,-.1,0,0);P.chest.rotation.y-=.15*e;return 0}],
 look:[1.8,(P,e,w)=>{P.spine.rotation.x+=.1*e;P.head.rotation.x+=.1*e;P.head.rotation.z+=.1*e+Math.sin(w*2)*.02*e;return 0}],
 blush:[2.0,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aR,-.9,0,.25);R(P.eR,-2.1,0,0);P.head.rotation.x+=.28*e;P.head.rotation.z+=.1*e;return 1}],
 eyeroll:[1.6,(P,e,w,u)=>{P.head.rotation.x-=.24*Math.sin(Math.min(1,u*1.5)*PI)*e;P.head.rotation.y+=Math.sin(w*4.5)*.2*e;P.head.rotation.z+=.08*e;return 0}],
 phone:[2.2,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aR,-.55,0,.45);R(P.eR,-2.1,0,0);P.head.rotation.z-=.12*e;return 0}],
 drink:[2.1,(P,e,w,u)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aR,-.5,0,.2);R(P.eR,-2.3,0,0);P.head.rotation.x-=.25*Math.sin(Math.min(1,u*1.2)*PI)*e;return 0}],
 yawn:[2.4,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aR,-.6,0,.2);R(P.eR,-2.2,0,0);P.head.rotation.x-=.3*e;P.chest.rotation.x-=.06*e;return 2}],
 clap:[2.0,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};const c=Math.sin(w*18)*.5+.5;R(P.aL,-.85,0,-.08-.22*c);R(P.aR,-.85,0,.08+.22*c);R(P.eL,-1.4,0,0);R(P.eR,-1.4,0,0);return 1}],
 sing:[2.4,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};const s=Math.sin(w*3);P.spine.rotation.z+=s*.1*e;P.head.rotation.z+=s*.12*e;P.head.rotation.x-=.12*e;R(P.aR,-.7+s*.15,0,.3);R(P.eR,-.9,0,0);return 2}],
 turn:[1.8,(P,e,w)=>{P.neck.rotation.y+=.5*e;P.head.rotation.y+=.45*e;P.chest.rotation.y+=.2*e;return 0}],
 think:[1.9,(P,e,w)=>{const R=(o,x,y,z)=>{o.rotation.x+=(x-o.rotation.x)*e;o.rotation.y+=(y-o.rotation.y)*e;o.rotation.z+=(z-o.rotation.z)*e};R(P.aR,-.7,0,.3);R(P.eR,-1.9,0,0);P.head.rotation.x+=.08*e;P.head.rotation.z+=.1*e;return 0}],
 cringe:[1.3,(P,e,w)=>{P.head.rotation.z+=.15*e;P.head.rotation.x+=.1*e;P.spine.rotation.x+=.08*e;P.aL.rotation.z-=.2*e;P.aR.rotation.z+=.2*e;return 0}]
};
function gesture(g,k){if(!g||!g.P||!g.P.kL||!GEST[k])return;g.GST={k,t0:null,d:GEST[k][0]}}
function gestPose(g,p,t){const G=g.GST;if(!G)return 0;if(G.t0==null)G.t0=t;const a=t-G.t0,d=G.d;if(!(a>=0)||a>d){g.GST=null;return 0}
  let e=Math.max(0,Math.min(1,a/.28,(d-a)/.4));e=e*e*(3-2*e);const def=GEST[G.k];if(!def){g.GST=null;return 0}
  if(G.k==='cringe'&&!G.f){G.f=1;try{flinch(g,0,1)}catch(_){}}
  try{return def[1](p,e,a,a/d)||0}catch(_){g.GST=null;return 0}}
function flinch(g,dx,dz){if(!g||!g.P||!g.P.kL)return;g.FL=1;g.FLt=null;g.FLs=rnd()<.5?-1:1;g.FLd=1;
  if(dx!=null&&dz!=null){const ry=g.rotation.y,f=dx*Math.sin(ry)+dz*Math.cos(ry),r=dx*Math.cos(ry)-dz*Math.sin(ry),l=Math.hypot(f,r)||1;g.FLd=f/l>.3?-1:1;g.FLs=r/l>0?-1:1}}
// ---------------------------------------------------------------- ragdoll: verlet joints with distance constraints, ground and wall collision, bones re-aimed every frame
const RJ=['hips','chest','head','aL','eL','hL','aR','eR','hR','lL','kL','fL','lR','kR','fR'],RJI={};RJ.forEach((n,i)=>RJI[n]=i);
const RCON=[['hips','chest'],['chest','head'],['chest','aL'],['chest','aR'],['aL','aR'],['aL','eL'],['eL','hL'],['aR','eR'],['eR','hR'],['hips','lL'],['hips','lR'],['lL','lR'],['lL','kL'],['kL','fL'],['lR','kR'],['kR','fR'],['chest','lL'],['chest','lR'],['aL','hips'],['aR','hips'],['head','aL'],['head','aR']];
const _v=new THREE.Vector3(),_v2=new THREE.Vector3(),_m=new THREE.Matrix4();
function ragStart(n){const g=n.g,P_=g.P;g.updateMatrixWorld(true);const pos=[],prev=[];
  for(const j of RJ){const b=P_[j];b.getWorldPosition(_v);if(j==='head'){_v2.set(0,.15,0).applyQuaternion(b.getWorldQuaternion(_q));_v.add(_v2)}if(j==='hL'||j==='hR')_v.y-=.06;if(j==='fL'||j==='fR'){_v2.set(0,-.04,.1).applyQuaternion(g.quaternion);_v.add(_v2)}pos.push(_v.clone());prev.push(_v.clone())}
  const L=RCON.map(([a,b])=>pos[RJI[a]].distanceTo(pos[RJI[b]]));let dx=n.hitDx||0,dz=n.hitDz||0;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const pw=(n.hitP||5)*(.8+rnd()*.5),dt=1/60;
  pos.forEach((p,i)=>{const nm=RJ[i],up=nm==='head'||nm==='chest'||nm[0]==='a'||nm[0]==='e'||nm==='hL'||nm==='hR'?1:.45;prev[i].x-=dx*pw*up*dt;prev[i].z-=dz*pw*up*dt;prev[i].y-=(1.6+rnd())*dt*(up>.5?1:.3)});
  n.rag={pos,prev,L,t:0,sleep:0};g.RAG=1;const pa=P_.pal&&P_.pal[24];if(pa){pa.x=1;pa.y=0}}
function ragStep(n,dt){const R=n.rag;if(!R)return;dt=Math.min(dt,1/30);R.t+=dt;const{pos,prev,L}=R;
  if(!R.sleep){let mv=0;for(let i=0;i<pos.length;i++){const p=pos[i],q=prev[i],vx=(p.x-q.x)*.985,vy=(p.y-q.y)*.985,vz=(p.z-q.z)*.985;q.copy(p);p.x+=vx;p.y+=vy-15*dt*dt;p.z+=vz;mv+=Math.abs(vx)+Math.abs(vy)+Math.abs(vz)}
    for(let it=0;it<8;it++){RCON.forEach(([a,b],k)=>{const A=pos[RJI[a]],B_=pos[RJI[b]],dx=B_.x-A.x,dy=B_.y-A.y,dz=B_.z-A.z,d=Math.hypot(dx,dy,dz)||1e-4,f=(d-L[k])/d*.5;A.x+=dx*f;A.y+=dy*f;A.z+=dz*f;B_.x-=dx*f;B_.y-=dy*f;B_.z-=dz*f});
      for(let i=0;i<pos.length;i++){const p=pos[i],r=RJ[i]==='head'?.14:RJ[i]==='chest'||RJ[i]==='hips'?.12:.06,gy=terrH(p.x,p.z)+r;if(p.y<gy){p.y=gy;const q=prev[i];q.x+=(p.x-q.x)*.35;q.z+=(p.z-q.z)*.35}if(solid(p.x,p.z)){const q=prev[i];p.x=q.x;p.z=q.z}}}
    if(R.t>1.2&&mv<.004*pos.length)R.sleep=1}
  ragPose(n)}
function ragPose(n){const g=n.g,P_=g.P,R=n.rag,J=k=>R.pos[RJI[k]];
  const up=_v.copy(J('chest')).sub(J('hips')).normalize(),xr=_v2.copy(J('lR')).sub(J('lL'));xr.addScaledVector(up,-xr.dot(up)).normalize();const fw=new THREE.Vector3().crossVectors(xr,up);
  _m.makeBasis(xr,up,fw);g.quaternion.setFromRotationMatrix(_m);const hp=J('hips');g.position.copy(hp).addScaledVector(up,-.92);g.updateMatrixWorld(true);
  for(const b of[P_.hips,P_.spine,P_.chest])b.quaternion.identity();P_.hips.position.set(0,.92,0);
  const aim=(bone,from,to,rest)=>{const par=bone.parent;par.updateMatrixWorld(true);const pq=par.getWorldQuaternion(_q).invert();const d=new THREE.Vector3().copy(J(to)).sub(J(from)).normalize().applyQuaternion(pq);bone.quaternion.setFromUnitVectors(rest,d);bone.updateMatrixWorld(true)};
  const DN=new THREE.Vector3(0,-1,0),UPV=new THREE.Vector3(0,1,0);
  P_.neck.quaternion.identity();aim(P_.head,'chest','head',UPV);
  aim(P_.aL,'aL','eL',DN);aim(P_.eL,'eL','hL',DN);aim(P_.aR,'aR','eR',DN);aim(P_.eR,'eR','hR',DN);aim(P_.lL,'lL','kL',DN);aim(P_.kL,'kL','fL',DN);aim(P_.lR,'lR','kR',DN);aim(P_.kR,'kR','fR',DN)}
function ragEnd(n){const g=n.g;if(!n.rag)return;n.rag=null;g.RAG=0;g.quaternion.identity();g.rotation.set(0,n.a,0);for(const k of BN)g.P[k].rotation.set(0,0,0);g.P.hips.position.set(0,.92,0);const pa=g.P.pal&&g.P.pal[24];if(pa)pa.x=0}
// ---------------------------------------------------------------- statues: bake a posed person into a plain mesh (so static scenery can merge it)
function bakeSkinned(m){m.updateMatrixWorld(true);const sk=m.skeleton;const g=m.geometry.clone(),P_=g.attributes.position,N=g.attributes.normal,SI=g.attributes.skinIndex,SW=g.attributes.skinWeight,inv=new THREE.Matrix4().copy(m.matrixWorld).invert();
  const mats=sk.bones.map((b,i)=>new THREE.Matrix4().multiplyMatrices(b.matrixWorld,sk.boneInverses[i]).premultiply(inv)),v=new THREE.Vector3(),n=new THREE.Vector3(),o=new THREE.Vector3(),no=new THREE.Vector3(),t=new THREE.Vector3();
  for(let i=0;i<P_.count;i++){v.fromBufferAttribute(P_,i);n.fromBufferAttribute(N,i);o.set(0,0,0);no.set(0,0,0);for(let k=0;k<4;k++){const w=SW.array[i*4+k];if(!w)continue;const M=mats[SI.array[i*4+k]];o.addScaledVector(t.copy(v).applyMatrix4(M),w);no.addScaledVector(t.copy(n).transformDirection(M),w)}
    P_.setXYZ(i,o.x,o.y,o.z);no.normalize();N.setXYZ(i,no.x,no.y,no.z)}
  g.computeBoundingSphere();const mat=m.material.clone();mat.skinning=false;mat.onBeforeCompile=m.material.onBeforeCompile;mat.customProgramCacheKey=()=>'chr67s';mat.userData={statue:1};
  const r=new THREE.Mesh(g,mat);r.castShadow=true;r.receiveShadow=true;r.userData.noMerge=1;return r}
function freezePerson(g){g.updateMatrixWorld(true);const L=g.children.find(c=>c.isLOD);if(!L)return g;const m=bakeSkinned(L.levels[0].object);g.remove(L);g.add(m);g.P.torso=m;return g}

let PMATS=null;function mkPerson(o){if(GFX==='enhanced'&&!o.classic)return mkPersonX(o);const g=new THREE.Group(),mat=o.stone?(PMATS||(PMATS=SM({vertexColors:true,color:0xffffff,roughness:.95}))):o.metal?PMATM:PMAT,sh=!!o.shadow||GFX==='enhanced';const mk=(geo,par,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=sh;par.add(m);return m};const piv=(x,y)=>{const p=new THREE.Group();p.position.set(x,y,0);g.add(p);return p};
  const lL=piv(-.13,.88),lR=piv(.13,.88);const LG=limbG('leg',o.pants,o.stone||o.metal?o.pants:SHOES[(o.pants>>>2)%5]);mk(LG,lL);mk(LG,lR);
  const aL=piv(-.36,1.5),aR=piv(.36,1.5);const AG=limbG('arm',o.sleeve||o.shirt,o.skin);mk(AG,aL);mk(AG,aR);
  const key=[o.shirt,o.skin,o.hair,o.fem?1:0,o.cap||0,o.pin?1:0,o.prop?1:0,o.metal||o.stone?1:0,o.noMouth?1:0,o.gl?1:0,o.hs||''].join(',');
  let bg=BODYC[key];if(!bg){const parts=[[PG.torso,o.shirt,0,1.22,0],[PG.head,o.skin,0,1.78,0]];if(!o.prop)parts.push([PG.hair,o.hair,0,1.8,-.012]);if(!o.prop&&o.hs==='curly')for(const[cx,cy,cz]of CURLP)parts.push([PG.curl,o.hair,cx,cy,cz]);if(!o.prop&&o.hs==='afro')parts.push([PG.afro,o.hair,0,1.98,-.07]);if(!o.prop&&o.hs==='bucket')parts.push([PG.bkt,o.hair,0,1.89,-.005]);if(o.gl){for(const sx of[-1,1]){const cx=sx*.07;parts.push([PG.gh,0x15151a,cx,1.842,.206],[PG.gh,0x15151a,cx,1.758,.206],[PG.gv,0x15151a,cx-.055,1.8,.206],[PG.gv,0x15151a,cx+.055,1.8,.206])}parts.push([PG.gb,0x15151a,0,1.81,.206])}faceParts(parts,o);if(o.fem)parts.push([PG.long,o.hair,0,1.66,-.13]);if(o.cap)parts.push([PG.cap,o.cap,0,1.97,0],[PG.brim,o.cap,0,1.92,.2]);if(o.pin)parts.push([PG.pin,0xe2b64c,.14,1.42,.16]);if(o.prop){const cols=[0xd63a3a,0xf2c230,0x3a7ad6,0x3ab05a];PG.bean.forEach((ge,i)=>parts.push([ge,cols[i],0,1.8,-.005]));parts.push([PG.stem,0x2a2a2a,0,2.07,0])}bg=BODYC[key]=mergeParts(parts)}
  const torso=mk(bg,g);g.P={lL,lR,aL,aR,torso};if(o.letters){const lp=new THREE.Mesh(GC.letp||(GC.letp=new THREE.PlaneGeometry(.44,.22)),letMat(o.letters));lp.position.set(0,1.3,.152);g.add(lp)}
  if(o.prop){const pg=GC.propg||(GC.propg=mergeParts([[PG.blade,0xf2c230,0,0,0],[PG.blade,0xd63a3a,0,0,0,PI/2]]));const pr=mk(pg,g,0,2.14,0);g.P.prop=pr;PROPS.push(pr)}
  return g}
function animP(g,sp,t,st){if(g.RAG)return;animP0(g,sp,t,st);animX(g,sp,t,st);if(g.HOLD&&!g.DIVE)try{holdPose(g)}catch(e){};if(g.DIVE){const p=g.P;/* grenade dive: arms stretched fully overhead */if(p&&p.aL&&p.aR){p.aL.rotation.set(PI,0,.05);p.aR.rotation.set(PI,0,-.05);if(p.eL)p.eL.rotation.set(0,0,0);if(p.eR)p.eR.rotation.set(0,0,0);if(p.hL)p.hL.rotation.set(0,0,0);if(p.hR)p.hR.rotation.set(0,0,0)}}}
function animP0(g,sp,t,st){const p=g.P,k=Math.min(1,sp/3),w=sp>4.6?11.5:7.6,s=Math.sin(t*w);
  if(st==='bike'){p.lL.rotation.x=-1+Math.sin(t*9)*.5*Math.min(1,sp/4);p.lR.rotation.x=-1-Math.sin(t*9)*.5*Math.min(1,sp/4);p.aL.rotation.x=p.aR.rotation.x=-1.1;return}
  if(st==='sit'){p.lL.rotation.x=p.lR.rotation.x=-1.45;p.aL.rotation.x=p.aR.rotation.x=-1.0;return}
  p.lL.rotation.x=s*.75*k;p.lR.rotation.x=-s*.75*k;
  if(st==='punch'){p.aR.rotation.x=-1.65;p.aL.rotation.x=-1.1}else if(st==='guard'){p.aR.rotation.x=-1.15+s*.1;p.aL.rotation.x=-1.3}else if(st==='carry'){p.aL.rotation.x=p.aR.rotation.x=-2.9}else if(st==='wave'){p.aR.rotation.x=-2.6+Math.sin(t*8)*.25;p.aL.rotation.x=0}else if(st==='talk'){p.aL.rotation.x=-Math.max(0,Math.sin(t*1.7))*.8;p.aR.rotation.x=-Math.max(0,Math.sin(t*2.3+1))*.9}else if(st==='throw'){const c=(t*.36)%1;let r=-.2,l=-.15;if(c<.4)l=-Math.sin(c/.4*PI)*1.5;else if(c<.74)r=-.2-(c-.4)/.34*1.9;else if(c<.9)r=-2.1+(c-.74)/.16*.95;else r=-1.15+(c-.9)/.1*.95;p.aR.rotation.x=r;p.aL.rotation.x=l}else{p.aL.rotation.x=-s*.6*k;p.aR.rotation.x=s*.6*k;if(k<.1){p.aL.rotation.z=-.06;p.aR.rotation.z=.06}}}
const BUBC={},BUBQ=[];function bubbleTex(t){if(BUBC[t]){const i=BUBQ.indexOf(t);if(i>=0){BUBQ.splice(i,1);BUBQ.push(t)}return BUBC[t]}if(BUBQ.length>=160){const o=BUBQ.shift();try{BUBC[o].dispose()}catch(e){}delete BUBC[o]}BUBQ.push(t);   /* V301 keep the 160 most recent bubble textures (thousands of lines now) */const c=document.createElement('canvas');c.width=420;c.height=72;const q=c.getContext('2d');q.font='600 22px Archivo,Arial';const w=Math.min(400,q.measureText(t).width+34),x0=(420-w)/2;q.fillStyle='#f6f1e3';q.beginPath();if(q.roundRect)q.roundRect(x0,4,w,48,14);else q.rect(x0,4,w,48);q.fill();q.beginPath();q.moveTo(200,52);q.lineTo(210,68);q.lineTo(220,52);q.fill();q.fillStyle='#1d1a16';q.textAlign='center';q.textBaseline='middle';q.fillText(t,210,29,380);return BUBC[t]=new THREE.CanvasTexture(c)}

