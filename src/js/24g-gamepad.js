// ================================================================ V421 CONTROLLER SUPPORT (Xbox and PlayStation pads, any browser with the standard Gamepad API)
// One polling loop of its own (padFrame). It never touches the game's own input code: in play it presses the same keys the keyboard does
// (padKey sends real key events, so every existing key handler works), feeds the touch stick variable `joy` for analog movement and turns the camera.
// Everywhere else (conversations, cards, planner, title, minigames) it drives a highlight ring over whatever button is on top of the screen:
// d-pad / left stick move it, A / Cross presses it, B / Circle is Escape. Minigames and cutscene games that listen for keys get arrows, Space and digits.
// Button numbers are the W3C "standard" layout, which Xbox and DualSense pads both report: 0 A/Cross, 1 B/Circle, 2 X/Square, 3 Y/Triangle,
// 4 LB/L1, 5 RB/R1, 6 LT/L2, 7 RT/R2, 8 View/Create, 9 Menu/Options, 10 L3, 11 R3, 12-15 d-pad up/down/left/right.
const PAD={on:0,ps:0,id:'',b:[],held:{},joy:0,el:null,ring:null,rep:{},navT:0,scanT:0,toastT:0};
const PAD_PLAY={0:'Space',1:'KeyQ',2:'KeyE',3:'KeyT',4:'KeyB',5:'ShiftLeft',6:'KeyR',7:'KeyF',8:'KeyM',9:'Tab',11:'KeyV',12:'Digit2',13:'KeyZ',14:'Digit1',15:'Digit3'};
const PAD_KEYN={Space:' ',Escape:'Escape',Tab:'Tab',Enter:'Enter',ArrowLeft:'ArrowLeft',ArrowRight:'ArrowRight',ArrowUp:'ArrowUp',ArrowDown:'ArrowDown',ShiftLeft:'Shift'};
function padKey(code,down){
  if(down){if(PAD.held[code])return;PAD.held[code]=1}else{if(!PAD.held[code])return;delete PAD.held[code]}
  const key=PAD_KEYN[code]||(code.startsWith('Key')?code.slice(3).toLowerCase():code.startsWith('Digit')?code.slice(5):code);
  try{(document.body||document).dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,key,bubbles:true,cancelable:true}))}catch(e){}}
function padTap(code){padKey(code,1);padKey(code,0)}
function padRelease(){for(const c of Object.keys(PAD.held))padKey(c,0);if(PAD.joy){joy.x=joy.y=0;PAD.joy=0}}
function padGet(){let L=[];try{L=navigator.getGamepads?navigator.getGamepads():[]}catch(e){}let best=null;for(const g of L){if(!g||!g.connected||!g.buttons||g.buttons.length<10)continue;if(!best||(g.mapping==='standard'&&best.mapping!=='standard'))best=g}return best}
function padAxis(v){const a=Math.abs(v||0);if(a<.2)return 0;return Math.sign(v)*Math.min(1,(a-.2)/.75)}
function padDown(g,i){const b=g.buttons[i];return!!b&&(b.pressed||b.value>.4)}
/* the name of a button on the pad that is plugged in: padName('A','✕') */
function padName(x,p){return PAD.ps?p:x}
/* ---- menus: what can be pressed right now. Only things that are really on top of the screen count, so an open overlay hides what is under it */
const PAD_SEL='button,[role="button"],[role="tab"],a[href],select,input:not([type="hidden"]):not([type="text"]):not([type="search"]):not([type="email"]):not([type="url"]):not([type="password"]),.slot,[data-pad]';
function padOk(el){if(!el||!el.isConnected||el.disabled||el.id==='cineskip'||el.closest('#touch,#hud,#fps'))return null;const r=el.getBoundingClientRect();if(r.width<6||r.height<6||r.bottom<1||r.top>innerHeight-1||r.right<1||r.left>innerWidth-1)return null;
  const x=Math.min(innerWidth-2,Math.max(1,r.left+r.width/2)),y=Math.min(innerHeight-2,Math.max(1,r.top+r.height/2)),t=document.elementFromPoint(x,y);if(!t||!(t===el||el.contains(t)))return null;return{el,r,x,y}}
/* some screens (the art and speech minigames, map pins) use plain boxes with a click handler instead of buttons: those count too. In a conversation, card,
   planner or minigame only that screen is searched, so the ring can't wander onto the HUD behind it */
const PAD_ROOT={wheel:'#wheel',card:'#card',planner:'#planner',mg:'#mg',title:'#title'};
function padList(){const scan=root=>{const out=[],seen=new Set();for(const el of root.querySelectorAll('*')){if(!((el.tagName!=='CANVAS'&&el.matches(PAD_SEL))||el.onclick||el.onpointerdown||el.onmousedown))continue;if(!el.getClientRects().length)continue;const c=padOk(el);if(c&&!seen.has(el)){seen.add(el);out.push(c)}}return out};
  const q=PAD_ROOT[mode],root=q&&document.querySelector(q);let L=root&&root.getClientRects().length?scan(root):[];if(!L.length)L=scan(document.body);/* nothing there: a panel is open on top of that screen */return L}
function padPickFirst(){const L=padList();if(!L.length)return null;const pref=L.find(c=>c.el.closest('#wpills,#cb,.choices'))||L.find(c=>c.el.classList.contains('primary')||c.el.id==='bcont'||c.el.id==='bnew')||L[0];return pref.el}
function padMove(dx,dy){const cur=padOk(PAD.el);if(!cur){PAD.el=padPickFirst();return}let best=null,bs=1e9;
  for(const c of padList()){if(c.el===cur.el)continue;const ox=c.x-cur.x,oy=c.y-cur.y,al=ox*dx+oy*dy,pe=Math.abs(ox*dy-oy*dx);if(al<6)continue;
    /* the gap between the two boxes along the way matters more than centre distance, so a wide button under a narrow one is still "below" it */
    const s=al+pe*2.6;if(s<bs){bs=s;best=c}}
  if(best){PAD.el=best.el;try{best.el.scrollIntoView({block:'nearest',inline:'nearest'})}catch(e){}try{sfx('ui')}catch(e){}}}
function padClick(el){const c=padOk(el);if(!c)return;if(el.tagName==='CANVAS'&&PAD.curEl===el){c.x=c.r.left+c.r.width*PAD.cx;c.y=c.r.top+c.r.height*PAD.cy}const o={bubbles:true,cancelable:true,clientX:c.x,clientY:c.y,button:0,view:window};
  if(el.tagName==='SELECT'){el.selectedIndex=(el.selectedIndex+1)%el.options.length;el.dispatchEvent(new Event('change',{bubbles:true}));return}
  try{el.dispatchEvent(new PointerEvent('pointerdown',Object.assign({pointerId:1,pointerType:'mouse',isPrimary:true,buttons:1},o)))}catch(e){}
  el.dispatchEvent(new MouseEvent('mousedown',Object.assign({buttons:1},o)));
  try{el.dispatchEvent(new PointerEvent('pointerup',Object.assign({pointerId:1,pointerType:'mouse',isPrimary:true},o)))}catch(e){}
  el.dispatchEvent(new MouseEvent('mouseup',o));el.dispatchEvent(new MouseEvent('click',o))}
/* a slider under the ring: left / right change it */
function padSlide(el,d){if(!el||el.tagName!=='INPUT'||el.type!=='range')return false;const mn=+el.min||0,mx=el.max===''?100:+el.max,st=Math.max(+el.step||0,(mx-mn)/40);el.value=Math.min(mx,Math.max(mn,+el.value+d*st));el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true}
function padScroll(dy,dx){let el=PAD.el&&PAD.el.isConnected?PAD.el.parentElement:null;while(el&&el!==document.body){if((el.scrollHeight>el.clientHeight+4||el.scrollWidth>el.clientWidth+4)&&/(auto|scroll)/.test(getComputedStyle(el).overflowY+getComputedStyle(el).overflowX))break;el=el.parentElement}
  if(!el||el===document.body){el=null;for(const q of['#npage','.ctrlbody','#cx','.paper','.arcbody','#chapsel .cslist']){const e=document.querySelector(q);if(e&&e.offsetParent!==null&&e.scrollHeight>e.clientHeight+4){el=e;break}}}
  if(el){el.scrollTop+=dy;if(dx)el.scrollLeft+=dx}}
function padRing(){let r=PAD.ring;if(!r){r=PAD.ring=document.createElement('div');r.id='padring';r.hidden=true;document.body.appendChild(r)}
  const show=PAD.on&&mode!=='play'&&mode!=='loading',c=show?padOk(PAD.el):null;if(!c){r.hidden=true;return}
  r.hidden=false;r.style.left=(c.r.left-4)+'px';r.style.top=(c.r.top-4)+'px';r.style.width=(c.r.width+8)+'px';r.style.height=(c.r.height+8)+'px';
  /* on a picture you click on (spot the difference, the map) the left stick moves a pointer inside it */
  const cv=c.el.tagName==='CANVAS'&&PAD.curEl===c.el;r.innerHTML=cv?'<i></i>':'';if(cv){const i=r.firstChild;i.style.left=(4+c.r.width*PAD.cx)+'px';i.style.top=(4+c.r.height*PAD.cy)+'px'}}
/* a direction that repeats while held: true on the frames it fires */
function padRep(k,on,dt){const s=PAD.rep[k]||(PAD.rep[k]={t:0,d:0});if(!on){s.d=0;return false}if(!s.d){s.d=1;s.t=.36;return true}s.t-=dt;if(s.t<=0){s.t=.13;return true}return false}
/* the prompt at the bottom of the screen and the job key show the pad button while a pad is in use */
function padHints(){const want=PAD.on?padName('X','□'):'E',k=$('prompt')&&$('prompt').firstChild;if(k&&k.tagName==='KBD'&&(k.textContent==='E'||k.textContent==='X'||k.textContent==='□')&&k.textContent!==want)k.textContent=want;
  const rk=$('rolek')&&$('rolek').querySelector('kbd');if(rk){const w=PAD.on?padName('Y','△'):'T';if((rk.textContent==='T'||rk.textContent==='Y'||rk.textContent==='△')&&rk.textContent!==w)rk.textContent=w}
  const cs=$('cineskip');if(cs){const w=PAD.on?'Skip ('+padName('Menu','Options')+')':'Skip (Esc)';if(/^Skip \(/.test(cs.textContent)&&cs.textContent!==w)cs.textContent=w}}
function padFrame(dt){const g=padGet();if(!g){if(PAD.on||PAD.joy||Object.keys(PAD.held).length){padRelease();PAD.on=0;padRing();padHints()}PAD.b=[];return}
  const nb=g.buttons.length,now=[];for(let i=0;i<nb;i++)now[i]=padDown(g,i);const was=PAD.b,hit=i=>now[i]&&!was[i],rel=i=>!now[i]&&was[i];
  const lx=padAxis(g.axes[0]),ly=padAxis(g.axes[1]),rx=padAxis(g.axes[2]),ry=padAxis(g.axes[3]);
  const any=now.some(Boolean)||lx||ly||rx||ry;
  if(any&&!PAD.on){PAD.on=1;const id=(g.id||'')+'';PAD.id=id;PAD.ps=/dualsense|dualshock|playstation|054c|wireless controller/i.test(id)?1:0;document.body.classList.add('padon');
    if(performance.now()-PAD.toastT>60000){PAD.toastT=performance.now();try{if(mode==='play')toast('Controller on ('+(PAD.ps?'PlayStation':'Xbox')+' buttons). Controls: Planner › Settings › Controls.',3600)}catch(e){}}}
  if(!PAD.on){PAD.b=now;return}
  /* the screen changed (a conversation opened, the planner closed): let go of every key the pad was holding so nothing sticks */
  if(PAD.mode!==mode){for(const c of Object.keys(PAD.held))padKey(c,0);if(PAD.joy){joy.x=joy.y=0;PAD.joy=0}PAD.mode=mode;PAD.el=null;PAD.scanT=0}
  if(mode==='play'){
    /* move with the left stick, look with the right, and press the keyboard's keys with the buttons */
    if(lx||ly||PAD.joy){joy.x=lx;joy.y=ly;PAD.joy=lx||ly?1:0}
    if(rx||ry){const s=(typeof SET!=='undefined'&&SET.sens)||1;yaw-=rx*Math.abs(rx)*2.9*s*dt;pitch=clamp(pitch+ry*Math.abs(ry)*1.7*s*dt*(SET.inv?-1:1),-.25,1.15)}
    MLK.free=1;
    for(const i in PAD_PLAY){if(hit(+i))padKey(PAD_PLAY[i],1);else if(rel(+i))padKey(PAD_PLAY[i],0)}
    if(hit(10)){toggles.KeyC=!toggles.KeyC;try{toast(toggles.KeyC?'Sneaking':'Standing',900)}catch(e){}}
    PAD.el=null}
  else{
    const keyCtx=!!((mode==='mg'&&typeof MGK!=='undefined'&&MGK)||(typeof C4!=='undefined'&&C4.keys));
    const L=now[14]||lx<-.5,Rt=now[15]||lx>.5,U=now[12]||ly<-.5,D=now[13]||ly>.5;
    if(keyCtx){
      /* a game that listens for keys: arrows from the d-pad / stick, Space on A, and the letter and number keys those games use. The right stick moves the ring */
      padKey('ArrowLeft',L);padKey('ArrowRight',Rt);padKey('ArrowUp',U);padKey('ArrowDown',D);
      const c4=typeof C4!=='undefined'&&C4.keys;
      if(hit(0)){const c=padOk(PAD.el);if(c)padClick(PAD.el);else padTap('Space')}
      if(hit(2))padTap(c4?'Digit1':'KeyH');if(hit(3))padTap(c4?'Digit2':'KeyF');if(hit(1))padTap(c4?'Digit3':'KeyE');
      if(hit(4))padTap('KeyA');if(hit(5))padTap('KeyD');
      if(padRep('nl',rx<-.5,dt))padMove(-1,0);if(padRep('nr',rx>.5,dt))padMove(1,0);if(padRep('nu',ry<-.5,dt))padMove(0,-1);if(padRep('nd',ry>.5,dt))padMove(0,1)}
    else{
      for(const c of['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'])padKey(c,0);
      if(!padOk(PAD.el)&&(PAD.scanT-=dt)<=0){PAD.scanT=.15;PAD.el=padPickFirst()}
      const cv=PAD.el&&PAD.el.tagName==='CANVAS'?padOk(PAD.el):null;
      if(cv){if(PAD.curEl!==PAD.el){PAD.curEl=PAD.el;PAD.cx=PAD.cy=.5}
        if(lx||ly){PAD.cx=Math.min(1,Math.max(0,PAD.cx+lx*420*dt/cv.r.width));PAD.cy=Math.min(1,Math.max(0,PAD.cy+ly*420*dt/cv.r.height));const o={bubbles:true,cancelable:true,clientX:cv.r.left+cv.r.width*PAD.cx,clientY:cv.r.top+cv.r.height*PAD.cy,view:window};try{PAD.el.dispatchEvent(new PointerEvent('pointermove',Object.assign({pointerId:1,pointerType:'mouse'},o)))}catch(e){}PAD.el.dispatchEvent(new MouseEvent('mousemove',o))}}
      const nL=cv?now[14]:L,nR=cv?now[15]:Rt,nU=cv?now[12]:U,nD=cv?now[13]:D;
      if(padRep('nl',nL,dt)){if(!padSlide(PAD.el,-1))padMove(-1,0)}if(padRep('nr',nR,dt)){if(!padSlide(PAD.el,1))padMove(1,0)}
      if(padRep('nu',nU,dt))padMove(0,-1);if(padRep('nd',nD,dt))padMove(0,1);
      if(ry||rx)padScroll(ry*900*dt,rx*900*dt);
      if(hit(0)){if(padOk(PAD.el))padClick(PAD.el);else if(mode==='cine'){/* nothing to press in a cutscene: A does not skip, Menu does */}}
      if(hit(1)&&mode!=='cine'&&mode!=='mg')padTap('Escape');
      if(mode==='planner'&&(hit(4)||hit(5))){const T=[...document.querySelectorAll('#ntabs > button')].filter(b=>b.offsetParent!==null&&!/^Close/.test(b.textContent)),i=T.findIndex(b=>b.classList.contains('on'));if(T.length){const nx=T[(Math.max(0,i)+(hit(5)?1:T.length-1))%T.length];nx.click();PAD.el=null}}
      if(mode==='wheel'){/* number keys still work: X Y pick nothing here on purpose */}}
    if(hit(9)&&mode!=='title')padTap('Escape');
    if(hit(8)&&mode==='planner')padTap('Escape')}
  PAD.b=now;padRing();padHints()}
/* a real key press or mouse move hands control back to keyboard and mouse (the ring and the pad button names go away) */
for(const ev of['keydown','mousedown','mousemove','touchstart'])addEventListener(ev,e=>{if(!e.isTrusted||!PAD.on)return;if(ev==='mousemove'&&Math.abs(e.movementX||0)+Math.abs(e.movementY||0)<3)return;PAD.on=0;document.body.classList.remove('padon');padRelease();padRing();padHints()},true);
addEventListener('gamepaddisconnected',()=>{padRelease();PAD.on=0;document.body.classList.remove('padon');padRing();padHints()});
addEventListener('blur',()=>{PAD.held={};PAD.joy=0});
{let last=performance.now();const loop=t=>{const dt=Math.min(.05,Math.max(0,(t-last)/1000));last=t;try{if(!PAD.manual)padFrame(dt)}catch(e){console.warn('pad',e)}requestAnimationFrame(loop)};requestAnimationFrame(loop)}
