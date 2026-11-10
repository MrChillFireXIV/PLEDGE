// ================================================================ V101 motion sound effects (all synthesized with Web Audio, no files)
// footsteps by surface (grass / pavement / wood / carpet / tile / gym court), jump + landing, dodge roll, punches ("hmph"),
// getting hit ("ouch"), NPCs getting hit ("oof"), basketball bounces, bike ticks, skateboard rumble, doors.
// Sounds near the player are panned left/right from the camera and fade with distance.
let NZB=null;
function nzBuf(){if(NZB||!AC)return NZB;const n=AC.sampleRate,b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=rnd()*2-1;return NZB=b}
// output chain: gain -> (stereo pan) -> master
function maOut(v,pan){const g=AC.createGain();g.gain.value=v;if(pan&&AC.createStereoPanner){const p=AC.createStereoPanner();p.pan.value=clamp(pan,-1,1);g.connect(p);p.connect(MGN)}else g.connect(MGN);return g}
// distance volume (0..1) and pan for a point, relative to the camera
function maSpat(x,z,range=18){const d=Math.hypot(x-P.x,z-P.z),v=clamp(1-d/range,0,1);if(v<=0)return null;const e=cam.matrixWorld.elements,dx=x-cam.position.x,dz=z-cam.position.z,l=Math.hypot(dx,dz)||1;return{v:v*v,pan:(dx*e[0]+dz*e[2])/l*.8}}
// a shaped noise burst
function maNoise(out,t,dur,v,ftype,f,Q=1,f2){const s=AC.createBufferSource();s.buffer=nzBuf();const fl=AC.createBiquadFilter(),g=AC.createGain();g.gain.value=0;fl.type=ftype;fl.frequency.value=f;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=Q;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl);fl.connect(g);g.connect(out);s.start(t,rnd()*.8);s.stop(t+dur+.02)}
// a pitched thump / tone with a pitch glide
function maTone(out,t,dur,v,f0,f1,type='sine'){const o=AC.createOscillator(),g=AC.createGain();g.gain.value=0;o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(out);o.start(t);o.stop(t+dur+.02)}
// a short voiced sound: glottal sawtooth through two formant filters; formants can glide (vowel change)
function maVoice(out,t,dur,v,p0,p1,fa,fb){const o=AC.createOscillator(),g=AC.createGain(),A=AC.createBiquadFilter(),Bf=AC.createBiquadFilter();g.gain.value=0;o.type='sawtooth';o.frequency.setValueAtTime(p0,t);o.frequency.exponentialRampToValueAtTime(p1,t+dur);
  for(const[F,ff]of[[A,fa],[Bf,fb]]){F.type='bandpass';F.Q.value=5;F.frequency.setValueAtTime(ff[0],t);F.frequency.exponentialRampToValueAtTime(ff[1],t+dur);o.connect(F);F.connect(g)}
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.025);g.gain.setValueAtTime(v,t+dur*.6);g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(out);o.start(t);o.stop(t+dur+.03)}

// ---- surfaces
// one-time 1 m grass map of the baked campus ground (600 x 600 m), so steps never read the big 4096 canvas
let MAGM=null;function maGrassMap(){if(MAGM!==null)return MAGM;MAGM=false;try{const c=document.createElement('canvas');c.width=c.height=600;const q=c.getContext('2d');q.drawImage(GBAKE.c,0,0,600,600);const d=q.getImageData(0,0,600,600).data,m=new Uint8Array(600*600);
  for(let i=0;i<m.length;i++){const r=d[i*4],g=d[i*4+1],b=d[i*4+2];m[i]=g>r+12&&g>b+12?1:0}MAGM=m}catch(e){}return MAGM}
function maSurf(x,z,int){if(int){const I=INT[int];if(!I)return'wood';const base=int.replace(/_up$/,'');if(INT[base+'_up']){const lx=x-I.x0;if(lx>STX0-.3&&lx<STX1+.3&&z-I.z0>STZT-1&&z-I.z0<STZB+1)return'wood'}
    const f=String(I.floor||'wood');return f.startsWith('carpet')?'carpet':f==='tile'?'tile':f==='court'?'court':'wood'}
  if(onRoad(x,z))return'hard';
  // main campus: walkways are painted into the baked ground, so read its colour under the foot (green = grass, anything else = paving)
  if(GBAKE&&x>=141&&x<741&&z>=0&&z<600){const m=maGrassMap();if(m)return m[(z|0)*600+((x-141)|0)]?'grass':'hard'}
  return'grass'}
function maStep(x,z,int,run,vol=1,player=0){if(!AC)return;const sp=player?{v:1,pan:0}:maSpat(x,z,12);if(!sp)return;const t=AC.currentTime,k=(.8+rnd()*.4)*vol*sp.v*(run?1.35:1),j=.92+rnd()*.16,out=maOut(1,sp.pan),s=maSurf(x,z,int);
  if(s==='grass'){maNoise(out,t,.09,.12*k,'bandpass',800*j,.6,450);maNoise(out,t+.01,.06,.05*k,'highpass',3200*j,.5);maTone(out,t,.05,.03*k,95*j,60)}
  else if(s==='hard'){maTone(out,t,.05,.06*k,130*j,70);maNoise(out,t,.035,.05*k,'bandpass',2300*j,1.3)}
  else if(s==='wood'){maTone(out,t,.075,.09*k,170*j,95);maNoise(out,t,.04,.035*k,'bandpass',1100*j,1.5)}
  else if(s==='carpet'){maNoise(out,t,.07,.04*k,'lowpass',420*j,.7);maTone(out,t,.05,.03*k,110*j,70)}
  else if(s==='tile'){maTone(out,t,.04,.05*k,150*j,90);maNoise(out,t,.03,.06*k,'bandpass',3200*j,1.6)}
  else{maTone(out,t,.05,.06*k,140*j,80);maNoise(out,t,.03,.04*k,'bandpass',2600*j,1.4);if(run&&rnd()<.3)maTone(out,t+.02,.06,.025*k,2300*j,2700,'triangle')}}
function maLand(x,z,int,hard){if(!AC)return;const t=AC.currentTime,out=maOut(1,0),s=maSurf(x,z,int),k=hard?1.4:1;maTone(out,t,.12,.16*k,s==='grass'?95:120,45);maNoise(out,t,.09,(s==='grass'?.07:.06)*k,s==='grass'?'bandpass':'lowpass',s==='grass'?800:1600,.8)}

// ---- voices (player is a guy; NPC pitch varies, women higher)
function voxHmph(){if(!AC)return;const t=AC.currentTime,out=maOut(1,0);maNoise(out,t,.06,.05,'bandpass',1300,1.2);maVoice(out,t+.03,.16,.07,125,98,[300,260],[900,700]);maNoise(out,t+.17,.05,.03,'bandpass',1800,1)}
function voxOuch(){if(!AC)return;const t=AC.currentTime,out=maOut(1,0),p=150+rnd()*25;maVoice(out,t,.24,.11,p*1.35,p,[780,380],[1250,850]);maNoise(out,t+.22,.07,.05,'highpass',3200,.8)}
function voxOof(n,big){if(!AC||!n)return;const sp=maSpat(n.x,n.z,16);if(!sp)return;const t=AC.currentTime,out=maOut(sp.v,sp.pan),fem=!!(n.fem||n.cl==='sororities'),p=(fem?230:120)*(.9+((n.uid||1)%7)*.03);
  maVoice(out,t,big?.32:.16,big?.12:.09,p*1.15,p*.8,[420,330],[900,760]);maNoise(out,t,.05,.03,'bandpass',1200,1)}
function voxHup(){if(!AC)return;const t=AC.currentTime,out=maOut(1,0);maNoise(out,t,.05,.03,'bandpass',1500,1);maVoice(out,t+.01,.09,.045,135,165,[500,600],[1300,1500])}

// ---- objects
function maBall(x,z,player){if(!AC)return;const sp=player?{v:1,pan:0}:maSpat(x,z,18);if(!sp)return;const t=AC.currentTime,out=maOut(sp.v,sp.pan),j=.95+rnd()*.1;
  maTone(out,t,.09,.16,175*j,95);maTone(out,t,.05,.05,420*j,300,'triangle');maNoise(out,t,.03,.05,'bandpass',900,1.2)}
function maWhoosh(v=.08){if(!AC)return;const t=AC.currentTime,out=maOut(1,0);maNoise(out,t,.28,v,'bandpass',500,1.4,2200);maNoise(out,t+.05,.2,v*.5,'bandpass',1800,1,700)}
function maDoor(){if(!AC)return;const t=AC.currentTime,out=maOut(1,0);maTone(out,t,.05,.05,900,600,'square');maTone(out,t,.22,.04,240,180,'sawtooth');maTone(out,t+.24,.1,.12,110,60);maNoise(out,t+.24,.06,.06,'lowpass',900,.8)}
function maTick(v){if(!AC)return;const t=AC.currentTime,out=maOut(1,0);maNoise(out,t,.012,v,'highpass',4500,1)}
function maRumble(v){if(!AC)return;const t=AC.currentTime,out=maOut(1,0);maNoise(out,t,.14,v,'lowpass',260+rnd()*80,.7)}

// ---- per-frame driver (called from the main update loop)
const MA={st:0,air:0,roll:0,bk:0,sk:0,npcCd:0};
function motionAudio(dt){if(!AC||mode!=='play'||!PM)return;const spd=Math.hypot(P.vx,P.vz),air=P.jy>.02||P.jv>0,int=P.inside||null;
  // jump / land / roll
  if(air&&!MA.air&&P.jv>0)voxHup();if(!air&&MA.air&&MA.peak>.35)maLand(P.x,P.z,int,MA.peak>1.2);MA.peak=air?Math.max(MA.peak||0,P.jy):0;MA.air=air;
  if(P.roll>0&&!MA.roll)maWhoosh(.09);if(P.roll<=0&&MA.roll>0)maLand(P.x,P.z,int,0);MA.roll=P.roll>0?1:0;
  // player footsteps, bike, skateboard
  const skating=typeof prSk==='function'&&prSk();
  if(P.bike){if(spd>1){MA.bk-=dt;if(MA.bk<=0){MA.bk=clamp(.9/spd,.06,.25);maTick(.012+Math.min(spd,14)*.0015)}}}
  else if(skating){if(spd>.8&&!air){MA.sk-=dt;if(MA.sk<=0){MA.sk=.1;maRumble(.012+Math.min(spd,8)*.004)}}}
  else if(!air&&P.roll<=0&&spd>.6&&!P.kart){const run=spd>4.6;MA.st-=dt;if(MA.st<=0){MA.st=PI/(run?11.5:7.6)*(.95+rnd()*.1);maStep(P.x,P.z,int,run,1,1)}}else MA.st=Math.min(MA.st,.05);
  // nearby people: footsteps and dribbling basketballs (a few per frame at most)
  let budget=3;for(const n of NP){if(n.down||n.hidden||!n.g.visible||n.dp>12||(n.int||null)!==int)continue;
    if(n.ball&&!n.aggro&&!n.follow&&!n.job){const s=Math.sin(TT*5+n.uid)>=0;if(n.bbS!=null&&s!==n.bbS)maBall(n.x,n.z,0);n.bbS=s}
    if(budget>0&&n.sp>.6&&!n.statue){n.stT=(n.stT||rnd()*.3)-dt;if(n.stT<=0){const run=n.sp>4.6;n.stT=PI/(run?11.5:7.6)*(.95+rnd()*.1);maStep(n.x,n.z,n.int||null,run,.55);budget--}}}}

// ================================================================ V102 background music: "Fluffing a Duck" (Kevin MacLeod, CC BY 4.0), embedded in data/music.js.
// Loops quietly under the sound effects during actual gameplay; fades out for cutscenes, story cards, scenes, the title screen and a hidden tab.
const MUS={g:null,src:null,buf:null,loading:false,cur:-1};
function musStart(){if(!AC||MUS.loading||MUS.buf||typeof MUSIC_B64==='undefined')return;MUS.loading=true;
  try{const bin=atob(MUSIC_B64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    const ok=b=>{MUS.buf=b;MUS.g=AC.createGain();MUS.g.gain.value=0;MUS.g.connect(MST||MGN);const s=AC.createBufferSource();s.buffer=b;s.loop=true;s.loopStart=.03;s.loopEnd=Math.max(1,b.duration-.06);s.connect(MUS.g);s.start();MUS.src=s;MUS.cur=-1},
      bad=()=>{MUS.loading=false};const p=AC.decodeAudioData(u.buffer,ok,bad);if(p&&p.catch)p.catch(bad)}catch(e){MUS.loading=false}}
function musGameplay(){try{return!!SET.musOn&&(mode==='play'||mode==='wheel'||mode==='planner')&&!CINE&&!(typeof SCENE!=='undefined'&&SCENE)&&!document.hidden}catch(e){return false}}
const MUS_LEVEL=.3;   // full music slider = 30% of the master volume, so footsteps and voices stay on top
function musTick(){if(!AC)return;if(!MUS.buf){musStart();return}const tgt=musGameplay()?SET.mus*MUS_LEVEL:0;if(Math.abs(tgt-MUS.cur)<.001)return;
  MUS.g.gain.cancelScheduledValues(AC.currentTime);MUS.g.gain.setTargetAtTime(tgt,AC.currentTime,tgt>MUS.cur?.9:.25);MUS.cur=tgt}

// ================================================================ V103 "babble" voices: a fast, faint string of pitched blips per letter while someone talks
// (in the spirit of Animal Crossing's gibberish). Each speaker has a steady pitch; vowels shape the tone, consonants add a tick.
// Speech bubbles come from the speaker's position; conversation and story lines play centred on one "dialogue" channel.
const BAB_F={a:[800,1250],e:[480,1900],i:[320,2300],o:[520,900],u:[340,820],y:[320,2200]};
const BAB={dlg:null,amb:[]};
/* V109: men's voices pitched down ~15% */
function babVoice(n){if(!n)return{p:310,fem:0};if(n.isP)return{p:310,fem:0};let h=0;const k=String(n.uid!=null?n.uid:(n.name||n.key||'x'));for(let i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))>>>0;
  const fem=!!(n.fem||n.cl==='sororities'),old=n.cl==='oldguard'||n.cl==='staff'||n.auth;return{p:(fem?540:old?245:300)*(.9+(h%17)*.0125),fem}}
// the words actually spoken: quoted parts if the text has quotes, else the whole line (for story narration with no quotes: nothing)
function babWords(t,story){t=String(t||'').replace(/[♪★]/g,'');const q=t.match(/[“"]([^”"]+)[”"]/g);if(q)return q.map(s=>s.slice(1,-1)).join(' ');return story?'':t}
function babble(n,text,story,vol){if(!AC||!SET||!(SET.sfx>0))return;const words=babWords(text,story).toLowerCase().replace(/[^a-z .,!?'-]/g,'').trim();if(!words)return;
  let pan=0,v=vol||.045;/* clearly audible, a little above a footstep */const dlg=!!story||n===DANNY&&mode!=='play'||mode==='wheel'||mode==='card';
  if(!dlg){if(n&&n.isP){v=.042}else{if(n==null||n.x==null||(n.int||null)!==(P.inside||null))return;const sp=maSpat(n.x,n.z,15);if(!sp)return;v*=sp.v;pan=sp.pan;
    BAB.amb=BAB.amb.filter(b=>b.end>AC.currentTime);if(BAB.amb.length>=2)return}}
  // a reply waits for Danny's own line to finish; anything else cuts the previous dialogue babble off
  let t0=AC.currentTime+.03;if(dlg&&BAB.dlg){if(BAB.dlg.isP&&!(n&&n.isP)&&BAB.dlg.end>t0)t0=BAB.dlg.end+.08;else{try{BAB.dlg.g.gain.setTargetAtTime(0,AC.currentTime,.02);const old=BAB.dlg.g;setTimeout(()=>{try{old.disconnect()}catch(e){}},300)}catch(e){}}BAB.dlg=null}
  const out=maOut(1,pan),bus=AC.createGain();bus.gain.value=1;bus.connect(out);const V=babVoice(n);let t=t0,cnt=0;
  for(let i=0;i<words.length&&cnt<70;i++){const c=words[i];
    if(c===' '){t+=.024;continue}if('.,!?'.includes(c)){t+=c===','?.06:.11;continue}if(c==="'"||c==='-')continue;
    babBlip(bus,V,words,i,t,v);
    t+=BAB_DT;cnt++}
  const rec={g:bus,end:t,isP:!!(n&&n.isP)};if(dlg)BAB.dlg=rec;else BAB.amb.push(rec)}

// one voice blip for letter i of `words` at time t (shared by pre-scheduled bubbles and the live typewriter)
function babBlip(bus,V,words,i,t,v){const c=words[i];let vow=BAB_F[c];if(!vow){for(let j=i+1;j<Math.min(words.length,i+4);j++)if(BAB_F[words[j]]){vow=BAB_F[words[j]];break}if(!vow)for(let j=i-1;j>=Math.max(0,i-3);j--)if(BAB_F[words[j]]){vow=BAB_F[words[j]];break}vow=vow||BAB_F.a}
  const end=i+1>=words.length||' .,!?'.includes(words[i+1]),qi=words.indexOf('?',i),q=qi>=0&&qi<i+6;
  // bouncy pitch per syllable (fixed per letter + position so a line always sounds the same), questions lift at the end
  const jit=(((c.charCodeAt(0)*13+i*7)%11)/10-.5)*.26,p=V.p*(1+jit)*(end&&q?1.16:1),d=.064,g=v*(BAB_F[c]?1:.8);
  const o=AC.createOscillator(),o2=AC.createOscillator(),h2=AC.createGain(),F1=AC.createBiquadFilter(),F2=AC.createBiquadFilter(),LP=AC.createBiquadFilter(),G=AC.createGain();G.gain.value=0;h2.gain.value=vow[1]>1700?.45:.25;
  o.type='sawtooth';o2.type='triangle';for(const[O,m]of[[o,1],[o2,2]]){O.frequency.setValueAtTime(p*m*.96,t);O.frequency.linearRampToValueAtTime(p*m*1.05,t+d*.35);O.frequency.linearRampToValueAtTime(p*m*(end?.9:1),t+d)}
  F1.type='peaking';F1.frequency.value=vow[0]*(V.fem?1.15:1);F1.Q.value=1.1;F1.gain.value=7;F2.type='peaking';F2.frequency.value=vow[1]*(V.fem?1.15:1);F2.Q.value=1.4;F2.gain.value=9;LP.type='lowpass';LP.frequency.value=6500;
  o.connect(F1);o2.connect(h2);h2.connect(F1);F1.connect(F2);F2.connect(LP);LP.connect(G);
  G.gain.setValueAtTime(.0001,t);G.gain.exponentialRampToValueAtTime(g,t+.006);G.gain.setValueAtTime(g,t+d*.55);G.gain.exponentialRampToValueAtTime(.0001,t+d);G.connect(bus);o.start(t);o2.start(t);o.stop(t+d+.02);o2.stop(t+d+.02);
  if(!BAB_F[c]&&'stfhkpcxzjgqbd'.includes(c))maNoise(bus,t,.016,g*.35,'highpass','sfzxcj'.includes(c)?6000:3200,1)}

// ================================================================ V104 typewriter dialogue: text appears letter by letter so it can be read along.
// Spoken words (in quotes, or a whole non-story line) type at voice speed and each letter triggers its babble blip, so voice and text stay in sync;
// narration types faster and silently. Any key or click finishes the line at once; the answer buttons wake up when the line is done.
let TYPE=null;
const BAB_DT=1/28;/* V106: speech runs ~1.5x faster */
function typeDelay(c,spoken){if(spoken){if(c===' ')return .024;if(c===',')return .06;if('.!?'.includes(c))return .11;return /[a-z]/i.test(c)?BAB_DT:.014}
  if(c===',')return .03;if('.!?'.includes(c))return .06;return 1/130}
function typeOut(el,text,speaker,story,box){typeStop(true);text=String(text||'');el.textContent='';const t0=performance.now();
  // which characters are spoken: inside quotes if the line has any, otherwise the whole line unless it's story narration
  const hasQ=/[“"]/.test(text),sp=new Uint8Array(text.length);let inQ=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'||c==='“'||c==='”'){inQ=c==='”'?false:c==='“'?true:!inQ;continue}sp[i]=hasQ?(inQ?1:0):(story?0:1)}
  const voice=speaker&&AC&&SET&&SET.sfx>0;let bus=null,V=null,words='',map=[];
  if(voice){V=babVoice(speaker);bus=AC.createGain();bus.gain.value=1;bus.connect(maOut(1,0));
    // the same lower-case letter string babble() voices, with a map from text index -> letter index for blips
    for(let i=0;i<text.length;i++){if(!sp[i])continue;const c=text[i].toLowerCase();if(/[a-z .,!?'-]/.test(c)){map[i]=words.length;words+=c}else map[i]=-1}}
  // wait for Danny's own spoken reply to finish before the next speaker starts
  /* V107: the next line starts at once; whatever dialogue babble is still playing (e.g. Danny's reply) is faded out */
  const wait=0;if(BAB.dlg&&AC){try{BAB.dlg.g.gain.setTargetAtTime(0,AC.currentTime,.03);const old=BAB.dlg.g;setTimeout(()=>{try{old.disconnect()}catch(e){}},300)}catch(e){}BAB.dlg=null}
  /* V170: speech boxes don't show quote marks (the box already says it's speech); only when no narration sits outside the quotes */
  const strip=hasQ&&!Array.from(text).some((c,i)=>!sp[i]&&/[A-Za-z]/.test(c)),shown=x=>strip?x.replace(/[“”"]/g,''):x;
  const T={el,text:shown(text),box,i:0,next:t0+wait,bus,done:false,sp:!!(speaker&&speaker.isP)};TYPE=T;if(box)box.classList.add('typing');
  const step=()=>{if(T.done||TYPE!==T)return;const now=performance.now();if(!el.isConnected||(box&&box.hidden)){typeStop(true);return}
    while(T.i<text.length&&now>=T.next){const i=T.i,c=text[i];T.i++;T.next+=typeDelay(c,!!sp[i])*1000;
      if(voice&&sp[i]&&map[i]>=0&&/[a-z]/i.test(c)){try{babBlip(bus,V,words,map[i],AC.currentTime+.005,.045)}catch(e){}}}
    el.textContent=shown(text.slice(0,T.i));if(T.i>=text.length)typeStop(false);else setTimeout(step,16)};
  setTimeout(step,16)}
function typeStop(silent){const T=TYPE;if(!T)return;T.done=true;TYPE=null;try{T.el.textContent=T.text}catch(e){}
  if(silent&&T.bus)try{T.bus.gain.setTargetAtTime(0,AC.currentTime,.02)}catch(e){}
  // keep the answers inert a moment so the click that skipped the text can't land on one
  const box=T.box;if(box)setTimeout(()=>{if(!TYPE||TYPE.box!==box){box.classList.remove('typing');try{const b=box.querySelector('#cb button:not(:disabled),#wpills button:not(:disabled)');b&&b.focus()}catch(e){}}},silent?180:0)}
// a key press or click while a line is typing just finishes the line
/* V106: any key, mouse button or touch finishes the line (Escape also passes through) */
for(const ev of['keydown','pointerdown','mousedown','contextmenu'])addEventListener(ev,e=>{if(!TYPE||!(mode==='wheel'||mode==='card'))return;if(e.type==='keydown'&&e.key==='Escape'){typeStop(true);return}
  e.preventDefault();e.stopPropagation();if(e.type!=='contextmenu')typeStop(true)},true);

/* V107: is Danny's own dialogue voice playing right now? (drives his talking arms) */
let DAN_TALK=0;function dannyTalking(){return performance.now()<DAN_TALK||!!(AC&&BAB.dlg&&BAB.dlg.isP&&BAB.dlg.end>AC.currentTime)||!!(TYPE&&TYPE.sp)}
