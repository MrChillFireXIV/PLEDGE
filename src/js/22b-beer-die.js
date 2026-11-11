// V255: the minigame view is now a top-down view of the real ΑΣΡ backyard (plywood table, pints, people, deck, fence, string lights).
// ================================================================ V209 BEER DIE (ΑΣΡ backyard, next to the pong table)
// 2 v 2: Danny + Marcus vs two brothers on a 4 × 8 ft plywood table split down the middle, a pint by every corner.
// Offense: lock your aim on their half, then your toss height (it must clear the height line). Defense: catch the die
// ONE-handed (Space) when it comes off your half, call HEIGHT (H) on a low toss, or FIFA (F) an air ball for Marcus to catch.
// Rules (from the house rule sheet): high/low call for first toss · 1 pt if it bounces on their half and isn't caught ·
// tink (off their pint, not caught) 2 · sink 3 + kill & fill · short or on the line = dead · kill & fill every 3 (to 9) or 4 (to 11) ·
// win by 2 · FIFA (preferred rule): kicked air ball caught by the partner benches the tosser for the next defense, max 3 per team,
// FIFAs never score, so nobody can win on one.
function mgDie(cb){openMG('Beer Die','ΑΣΡ backyard · Danny & Marcus vs Chase & Colton',(el,close)=>{
  el.innerHTML=`<p class="mgintro" id="dii">First toss: call the roll.</p><div class="mgrow" id="dib"></div><canvas class="mgc" id="dc" width="360" height="484" style="width:min(360px,100%)"></canvas><div class="mgstat" id="dis"></div>`;
  const cv=$('dc'),q=cv.getContext('2d'),W=360,H=484,TX=90,TY=50,TW=180,TH=350,MID=TY+TH/2,HL=.42,SWW=.1;   // table rectangle; HL = height line on the toss meter
  const cups=[{x:TX+22,y:TY+22,s:1},{x:TX+TW-22,y:TY+22,s:1},{x:TX+22,y:TY+TH-22,s:0},{x:TX+TW-22,y:TY+TH-22,s:0}];   // s:1 = their pints (top), 0 = ours
  const G=window.__DIE={to:11,us:0,them:0,usF:0,themF:0,kfUs:0,kfThem:0,benchUs:null,benchThem:null,turn:null,ourT:0,theirT:0,phase:'call',t:0,die:null,msg:'',busy:0,ended:0};
  const P_={dan:{x:TX+40,y:TY+TH+24,n:'Danny'},mar:{x:TX+TW-40,y:TY+TH+24,n:'Marcus'},ch:{x:TX+40,y:TY-24,n:'Chase'},co:{x:TX+TW-40,y:TY-24,n:'Colton'}};
  /* V309 the green height zone follows the aim: the near edge of their half needs a low arc, the far corners a high one */
  const dieSW=()=>{if(!G.aim)return .7;const d=P_.dan,dist=(x,y)=>Math.hypot(x-d.x,y-d.y),near=Math.abs(d.y-MID),far=Math.max(dist(TX,TY),dist(TX+TW,TY)),t=Math.max(0,Math.min(1,(dist(G.aim.x,G.aim.y)-near)/Math.max(1,far-near)));return Math.min(.86,Math.max(.46,.47+.37*t+(G.swj||0)))};
  const btns=(L)=>{const b=$('dib');b.innerHTML='';for(const[l,f]of L){const e=document.createElement('button');e.className='btn';e.textContent=l;e.onclick=()=>{sfx('ui');b.innerHTML='';f()};b.appendChild(e)}};
  const info=t=>{$('dii').textContent=t};const say=t=>{G.msg=t};
  const kfEvery=()=>G.to===9?3:4;
  const score=(team,pts,why)=>{{const d=G.die;if(d&&d.x1!=null&&d.x2==null&&pts<3){const top=d.y1<MID;d.x2=d.x1+(d.x1<TX+TW/2?-1:1)*(30+rnd()*40);d.y2=top?TY-20:TY+TH+20;d.t2=0}}   // the die bounces off the table when it's a point
    const k=team==='us'?'us':'them',o=k==='us'?'them':'us',b=G[k];G[k]+=pts;say(why+' +'+pts+(team==='us'?' for you':' for them'));sfx(team==='us'?'ok':'bad');
    // the team scored ON kills and fills every 3/4 points (counted off the points scored against them)
    const fk=o==='us'?'kfUs':'kfThem';while(Math.floor(G[k]/kfEvery())>G[fk]){G[fk]++;say(G.msg+' · '+(o==='us'?'You and Marcus':'Chase and Colton')+' kill & fill!')}};
  const sinkKF=team=>{const fk=team==='us'?'kfThem':'kfUs';G[fk]=Math.max(G[fk],Math.floor(G[team==='us'?'us':'them']/kfEvery()))};
  const won=()=>{const a=G.us,b=G.them;if(a>=G.to&&a-b>=2)return'us';if(b>=G.to&&b-a>=2)return'them';return null};
  const stat=()=>{$('dis').textContent=`You ${G.us} · Them ${G.them} (to ${G.to}, win by 2) · FIFAs left: you ${3-G.usF}, them ${3-G.themF}${G.msg?' · '+G.msg:''}`};
  const next=()=>{const w=won();if(w){G.ended=1;G.phase='end';info(w==='us'?'Game! Alpha Sigma Rho beer die champions.':'They take it. Shake hands, kill your beer.');setTimeout(()=>close(()=>cb(w==='us')),1600);return}
    G.turn=G.turn==='us'?'them':'us';setTimeout(G.turn==='us'?ourToss:theirToss,700)};
  // ------------------------------------------------ outcome on a defending half: caught? (who defends, how high)
  const defend=(side,ht,tink,toward)=>{// AI defense; side 'them' = Chase/Colton catching, 'us' = Marcus catching
    const bench=side==='them'?G.offThem:G.offUs;let p=.62-(ht-HL)*.55-(tink?.12:0);if(bench===toward)p-=.4;return rnd()<clamp(p,.08,.85)};
  // ================================================= OUR TOSS
  function ourToss(){const tosser=G.ourT++%2===0?'dan':'mar';G.offThem=G.benchThem;G.benchThem=null;G.offUs=null;
    if(tosser==='mar'){info('Marcus tosses.');G.die={x0:P_.mar.x,y0:P_.mar.y,t:0};const r=rnd();
      if(r<.1){aiLand('us','short')}else if(r<.2){aiLand('us','low')}else if(r<.28){aiLand('us','air')}else if(r<.31){aiLand('us','sink')}else if(r<.4){aiLand('us','tink')}else aiLand('us','table');return}
    G.phase='aim';G.t=0;G.aim={x:TX+TW/2,y:TY+TH/4};G.swj=(rnd()-.5)*.05;G.sw=dieSW();info('Your toss. Space / click: lock your aim on their half.');}
  function act(){if(G.phase==='aim'){G.phase='height';G.t=0;info('Space / click: lock your height in the GREEN zone. Below the dashed line they call height; under green is short, over green lands soft and gets caught.');return}
    if(G.phase==='height'){const ht=G.hv,ax=G.aim.x,ay=G.aim.y,onT=ax>TX&&ax<TX+TW,zone=ht<HL?'low':ht<G.sw?'short':ht<=G.sw+SWW?'good':'over';
      let tx=ax,ty=ay,x2=null,y2=null;const cup=cups.find(c=>c.s===1&&Math.hypot(c.x-ax,c.y-ay)<12);
      if(zone==='short'){ty=MID+18+(G.sw-ht)*200;tx=clamp(ax,TX+12,TX+TW-12)}
      else if(zone==='good'&&onT&&!(cup&&Math.hypot(cup.x-ax,cup.y-ay)<5.5)){// the bounce carries it off the far end or a side
        const sx=ax<TX+TW/2?-1:1,side=rnd()<.45;x2=side?(sx<0?TX-26:TX+TW+26):ax+(rnd()-.5)*40;y2=side?ay-30-rnd()*30:TY-22-rnd()*14}
      else if(zone==='over'&&onT){const who=ax<TX+TW/2?'ch':'co';x2=P_[who].x;y2=P_[who].y+8}
      G.phase='fly';G.die={x0:P_.dan.x,y0:P_.dan.y,x1:tx,y1:ty,x2,y2,t:0,t2:0,ht};G.zone=zone;
      setTimeout(()=>resolveOurs(tx,ty,ht,zone,!!cup&&onT),x2!=null?1250:750);return}
    if(G.phase==='catch'){G.pressed=1;return}}
  function resolveOurs(x,y,ht,zone,onCup){G.phase='res';
    if(zone==='low'){say('Too low: Chase calls HEIGHT. Dead die.');sfx('whiff');return next()}
    const onT=G.aim.x>TX&&G.aim.x<TX+TW;if(!onT)return airBall('us','dan');
    const cup=cups.find(c=>c.s===1&&Math.hypot(c.x-x,c.y-y)<5.5);if(cup&&zone!=='short'){score('us',3,'SINK!');if(G.msg.indexOf('kill & fill')<0)say(G.msg+' · Chase and Colton kill & fill!');sinkKF('us');return next()}
    if(zone==='short'){say('Short: it lands on your side. Dead die.');sfx('whiff');return next()}
    if(zone==='over'){const who=x<TX+TW/2?'Chase':'Colton';say('Too high: it lands soft and '+who+' catches it one-handed.');sfx('whiff');return next()}
    score('us',onCup?2:1,onCup?'TINK! Off their pint and off the table':'Perfect toss: it bounces off their half and off the table');next()}
  // a die lands at x,y on the table area; team = tossing team
  function landing(team,x,y,ht,tosser){const theirHalf=team==='us'?(y<MID-2):(y>MID+2),onTable=x>TX&&x<TX+TW&&y>TY&&y<TY+TH,onLine=Math.abs(y-MID)<3&&onTable;
    const cup=cups.find(c=>c.s===(team==='us'?1:0)&&Math.hypot(c.x-x,c.y-y)<12);
    if(cup&&Math.hypot(cup.x-x,cup.y-y)<5.5){score(team,3,'SINK!');const fk=team==='us'?'kfThem':'kfUs';if(G.msg.indexOf('kill & fill')<0)say(G.msg+' · '+(team==='us'?'Chase and Colton':'You and Marcus')+' kill & fill!');sinkKF(team);return next()}
    if(onLine||(onTable&&!theirHalf)){say(onLine?'On the line: dead die.':'Short: dead die.');sfx('whiff');return next()}
    if(!onTable&&!cup){return airBall(team,tosser)}
    const tink=!!cup,toward=x<TX+TW/2?(team==='us'?'ch':'dan'):(team==='us'?'co':'mar');
    if(team==='us'){const c=defend('them',ht,tink,toward);if(c){say(P_[toward].n+' catches it one-handed.');sfx('whiff');return next()}score('us',tink?2:1,tink?'TINK! Off their pint and down':'It bounces off their half and drops');return next()}
    // their toss on our half
    if(toward==='mar'){const c=defend('us',ht,tink,toward);if(c){say('Marcus snags it one-handed.');sfx('ok');return next()}score('them',tink?2:1,tink?'Tink off your pint':'Marcus can\'t get to it');return next()}
    danCatch(ht,tink)}
  function airBall(team,tosser){// FIFA chance for the defending team
    if(team==='us'){if(G.themF<3&&rnd()<.55){G.themF++;if(rnd()<.55){G.benchUs=tosser;say('Air ball. Chase FIFAs it, Colton catches: '+P_[tosser].n+' sits out on defense next.');sfx('bad')}else say('Air ball. Their FIFA goes nowhere.')}else say('Air ball.');return next()}
    // their air ball: Danny can FIFA it (F)
    if(G.usF>=3){say('Air ball. You\'re out of FIFAs.');return next()}
    G.phase='fifa';G.t=0;info('AIR BALL! Press F to FIFA it up to Marcus!');G.fifaDone=()=>{G.phase='res';info('');next()}}
  // Danny's catch: a ring closes on the die; Space when it lines up (one hand). H calls height on a low toss.
  function danCatch(ht,tink){G.phase='catch';G.t=0;G.pressed=0;const d0=G.die||{x1:TX+TW/4,y1:MID+80};G.cp=null;G.ct={ht,tink,win:tink?.085:.12,dur:1.05+rnd()*.25,tgt:.62+rnd()*.12,E:{x:TX-28,y:Math.max(MID+50,Math.min(TY+TH+30,d0.y1+55+rnd()*25))}};
    info((tink?'It clips your pint! ':'')+'Coming at you! Space to catch ONE-handed when the ring closes.'+(ht<HL?' (Looks low… H to call height.)':''))}
  function aiLand(team,kind){// Marcus / Chase / Colton tosses: pick a landing that produces the result
    const top=team==='us',ht=kind==='low'?.2+rnd()*.15:HL+.05+rnd()*.45;let x,y;const half=()=>top?TY+20+rnd()*(TH/2-40):MID+20+rnd()*(TH/2-40);
    if(kind==='short'){x=TX+20+rnd()*(TW-40);y=top?MID+15+rnd()*60:MID-15-rnd()*60}
    else if(kind==='air'){x=rnd()<.5?TX-30:TX+TW+30;y=half()}
    else if(kind==='sink'||kind==='tink'){const c=pick(cups.filter(c=>c.s===(top?1:0)));x=c.x+(kind==='sink'?0:8);y=c.y+(kind==='sink'?0:-6)}
    else{x=TX+20+rnd()*(TW-40);y=half()}
    const from=top?(G.ourT%2?P_.dan:P_.mar):(G.theirT%2?P_.ch:P_.co);G.die={x0:from.x,y0:from.y,x1:x,y1:y,t:0,ht};G.phase='fly';
    setTimeout(()=>{G.phase='res';if(kind==='low'&&top){say('Marcus tosses too low. HEIGHT, dead die.');return next()}landing(team,x,y,ht,top?'mar':null)},700)}
  // ================================================= THEIR TOSS
  function theirToss(){const who=G.theirT++%2===0?'ch':'co';G.offUs=G.benchUs;G.benchUs=null;G.offThem=null;G.lastThem=who;info(P_[who].n+' tosses at you.');
    const r=rnd();let kind=r<.1?'short':r<.22?'low':r<.31?'air':r<.33?'sink':r<.42?'tink':'table';
    if(kind==='low'){// a low toss still has to be called: it comes at you, H calls it
      const x=TX+20+rnd()*(TW-40),y=MID+30+rnd()*(TH/2-60),ht=.18+rnd()*.18;G.die={x0:P_[who].x,y0:P_[who].y,x1:x,y1:y,t:0,ht};G.phase='fly';
      setTimeout(()=>{G.phase='res';const toward=x<TX+TW/2?'dan':'mar';if(toward==='mar'){if(rnd()<.7){say('Marcus calls HEIGHT. Dead die.');return next()}const c=defend('us',ht,0,'mar');if(c){say('Marcus catches it.');return next()}score('them',1,'Low one, but nobody called it');return next()}danCatch(ht,0)},700);return}
    aiLand('them',kind)}
  // ================================================= the first-toss call
  btns([['Play to 11',()=>{G.to=11;callRoll()}],['Play to 9',()=>{G.to=9;callRoll()}]]);info('House rules: play to 9 (kill & fill every 3) or to 11 (every 4)?');
  function callRoll(){info('Colton rolls a die for first toss. Call it: high (4-6) or low (1-3)?');btns([['High',()=>roll(1)],['Low',()=>roll(0)]])}
  function roll(hi){const v=1+Math.floor(rnd()*6),ok=(v>=4)===!!hi;G.rollV=v;G.rollT=1.4;say('Rolled a '+v+'. '+(ok?'You toss first.':'They toss first.'));G.turn=ok?'them':'us';setTimeout(next,1400)}
  MGK=e=>{if(e.repeat)return;if(e.code==='Space'||e.code==='Enter'){e.preventDefault();act()}else if(e.code==='KeyH'&&G.phase==='catch'){e.preventDefault();G.called=1}else if(e.code==='KeyF'&&G.phase==='fifa'){e.preventDefault();G.kick=1}};
  cv.onpointerdown=()=>act();
  // ================================================= V255 TOP-DOWN BACKYARD VIEW (art only; the game logic above/below is unchanged)
  const mkC=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
  const LIGHTS=[];for(let i=0;i<14;i++){const x=14+i*(332/13);LIGHTS.push([x,34+15*(1-Math.pow((x-180)/166,2))])}
  const pint=(g,x,y)=>{g.fillStyle='rgba(50,30,10,.28)';g.beginPath();g.arc(x+2,y+3,13,0,TAU);g.fill();g.fillStyle='rgba(60,40,20,.22)';g.beginPath();g.arc(x,y,15,0,TAU);g.fill();g.fillStyle='rgba(225,238,242,.8)';g.beginPath();g.arc(x,y,12,0,TAU);g.fill();const gr=g.createRadialGradient(x-2,y-2,1,x,y,10);gr.addColorStop(0,'#f5c24a');gr.addColorStop(1,'#c88a1c');g.fillStyle=gr;g.beginPath();g.arc(x,y,9.5,0,TAU);g.fill();g.strokeStyle='rgba(255,248,222,.9)';g.lineWidth=2.4;g.beginPath();g.arc(x,y,6.2,0,TAU);g.stroke();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(x-5,y-5,2,0,TAU);g.fill()};
  const BG=(()=>{const c=mkC(W,H),g=c.getContext('2d');let sd=11;const lr=()=>{sd=sd*16807%2147483647;return sd/2147483647};
    /* grass, mowing stripes, blades, trampled dirt around the table */
    g.fillStyle='#3b7137';g.fillRect(0,0,W,H);for(let x=0;x<W;x+=36){g.fillStyle=(x/36)%2?'rgba(255,255,255,.035)':'rgba(0,0,0,.04)';g.fillRect(x,0,36,H)}
    for(let i=0;i<1800;i++){g.fillStyle=lr()<.5?'rgba(20,60,20,.35)':'rgba(150,205,95,.22)';g.fillRect(lr()*W,lr()*H,1.5,3)}
    let r=g.createRadialGradient(W/2,TY+TH/2,40,W/2,TY+TH/2,255);r.addColorStop(0,'rgba(132,104,64,.8)');r.addColorStop(.55,'rgba(132,104,64,.42)');r.addColorStop(1,'rgba(132,104,64,0)');g.fillStyle=r;g.fillRect(0,0,W,H);
    for(let i=0;i<300;i++){const a=lr()*TAU,d=lr()*200;g.fillStyle='rgba(92,66,36,.32)';g.fillRect(W/2+Math.cos(a)*d*.85,TY+TH/2+Math.sin(a)*d*1.3,2,2)}
    /* back fence along the top */
    for(let x=0;x<W;x+=10){g.fillStyle=(x/10)%2?'#8a6a46':'#7c5e3d';g.fillRect(x,0,10,28);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,0,1,28)}
    g.fillStyle='#5a432b';g.fillRect(0,26,W,4);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,30,W,7);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(0,37,W,5);
    /* right-hand fence */
    for(let y=28;y<H;y+=10){g.fillStyle=(y/10)%2?'#8a6a46':'#7c5e3d';g.fillRect(346,y,14,10);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(346,y,14,1)}
    g.fillStyle='rgba(0,0,0,.28)';g.fillRect(340,30,6,H);
    /* ΑΣΡ house: siding wall, back deck, rail, steps, lit sliding door, couch */
    g.fillStyle='#cdbf9f';g.fillRect(0,0,14,H);for(let y=0;y<H;y+=7){g.fillStyle='rgba(0,0,0,.1)';g.fillRect(0,y,14,1)}g.fillStyle='#7d1f2c';g.fillRect(13,0,2,H);
    for(let y=0;y<H;y+=9){g.fillStyle=(y/9)%2?'#7a5a38':'#6f5232';g.fillRect(15,y,45,9);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(15,y,45,1)}
    g.fillStyle='#e8d9a4';g.fillRect(0,212,14,52);g.fillStyle='rgba(60,50,40,.7)';g.fillRect(0,212,14,2);g.fillRect(0,262,14,2);
    r=g.createRadialGradient(14,238,2,14,238,70);r.addColorStop(0,'rgba(255,224,150,.5)');r.addColorStop(1,'rgba(255,224,150,0)');g.fillStyle=r;g.fillRect(14,160,70,160);
    g.fillStyle='#5a432b';for(let y=0;y<H;y+=20){if(y>196&&y<268)continue;g.fillRect(58,y,4,14)}g.fillRect(58,0,4,196);g.fillRect(58,268,4,H);
    g.fillStyle='rgba(0,0,0,.28)';g.fillRect(62,0,7,196);g.fillRect(62,268,7,H);
    for(let i=0;i<3;i++){g.fillStyle=i%2?'#8a8f96':'#9aa0a8';g.fillRect(60+i*4,200,4,64);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(60+i*4,200,1,64)}
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.roundRect?g.roundRect(23,333,26,82,5):g.rect(23,333,26,82);g.fill();g.fillStyle='#6b3b3b';g.beginPath();g.roundRect?g.roundRect(20,330,26,82,5):g.rect(20,330,26,82);g.fill();g.fillStyle='#4e2a2a';g.fillRect(20,330,9,82);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(29,370,17,1.5);g.fillStyle='rgba(255,255,255,.07)';for(let y=334;y<410;y+=8)g.fillRect(31,y,14,3);
    /* yard dressing: cooler, keg, trash can, stray cups */
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(284,141,36,24);g.fillStyle='#2a6aa8';g.fillRect(281,137,34,23);g.fillStyle='#eef1f4';g.fillRect(284,140,28,17);g.fillStyle='#9aa4ad';g.fillRect(292,147,12,3);
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.arc(303,317,14,0,TAU);g.fill();g.fillStyle='#b8bcc2';g.beginPath();g.arc(300,313,13,0,TAU);g.fill();g.strokeStyle='#7d838a';g.lineWidth=2;g.beginPath();g.arc(300,313,10,0,TAU);g.stroke();g.beginPath();g.arc(300,313,5,0,TAU);g.stroke();g.fillStyle='#222';g.fillRect(310,311,8,4);
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.arc(309,424,12,0,TAU);g.fill();g.fillStyle='#3a3f46';g.beginPath();g.arc(306,421,11,0,TAU);g.fill();g.fillStyle='#252a30';g.beginPath();g.arc(306,421,8,0,TAU);g.fill();
    for(const[x,y,l]of[[76,64,0],[280,206,0],[72,300,1],[262,448,0],[114,456,0],[322,262,1],[80,430,0]]){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(x+1.5,y+2,4,0,TAU);g.fill();g.fillStyle='#d8322b';g.beginPath();if(l)g.ellipse(x,y,5,3.4,.6,0,TAU);else g.arc(x,y,3.8,0,TAU);g.fill();g.strokeStyle='#fff';g.lineWidth=1;g.beginPath();if(l)g.ellipse(x,y,3,1.8,.6,0,TAU);else g.arc(x,y,2.3,0,TAU);g.stroke()}
    /* the plywood table: soft shadow, grain, edge band, painted ΑΣΡ, black tape down the middle */
    g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=16;g.shadowOffsetX=7;g.shadowOffsetY=10;g.fillStyle='#c9a26a';g.fillRect(TX,TY,TW,TH);g.restore();
    for(let i=0;i<46;i++){const y=TY+4+lr()*(TH-8);g.strokeStyle=lr()<.5?'rgba(110,72,34,.2)':'rgba(255,236,196,.16)';g.lineWidth=.6+lr()*1.4;g.beginPath();g.moveTo(TX+2,y);g.bezierCurveTo(TX+TW*.3,y+(lr()-.5)*7,TX+TW*.7,y+(lr()-.5)*7,TX+TW-2,y+(lr()-.5)*4);g.stroke()}
    g.strokeStyle='#8a653a';g.lineWidth=5;g.strokeRect(TX+2.5,TY+2.5,TW-5,TH-5);g.strokeStyle='rgba(255,230,180,.35)';g.lineWidth=1;g.strokeRect(TX+5.5,TY+5.5,TW-11,TH-11);
    g.fillStyle='rgba(125,31,44,.55)';g.font='bold 40px Georgia,serif';g.textAlign='center';g.fillText('ΑΣΡ',TX+TW/2,TY+TH*.77);g.save();g.translate(TX+TW/2,TY+TH*.23);g.rotate(PI);g.fillText('ΑΣΡ',0,14);g.restore();
    g.fillStyle='rgba(60,40,20,.2)';for(const c of cups){g.beginPath();g.arc(c.x,c.y,16,0,TAU);g.fill()}
    g.fillStyle='#1d1d22';g.fillRect(TX+3,MID-2,TW-6,4);
    for(const c of cups)pint(g,c.x,c.y);
    /* tree canopies overhanging the fence corners */
    for(const[x,y,rr]of[[334,-2,44],[350,476,40]]){g.fillStyle='rgba(0,0,0,.32)';g.beginPath();g.arc(x-6,y+9,rr,0,TAU);g.fill();g.fillStyle='#1f4d27';g.beginPath();g.arc(x,y,rr,0,TAU);g.fill();for(let i=0;i<16;i++){const a=lr()*TAU,d=lr()*rr*.8;g.fillStyle=lr()<.5?'#2c6a35':'#18401f';g.beginPath();g.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,7+lr()*9,0,TAU);g.fill()}}
    /* string lights: wire, glow, bulbs */
    g.strokeStyle='rgba(20,14,8,.8)';g.lineWidth=1.2;g.beginPath();LIGHTS.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();
    for(const[x,y]of LIGHTS){r=g.createRadialGradient(x,y,0,x,y,26);r.addColorStop(0,'rgba(255,226,150,.5)');r.addColorStop(1,'rgba(255,226,150,0)');g.fillStyle=r;g.fillRect(x-26,y-26,52,52);g.fillStyle='#fff3c4';g.beginPath();g.arc(x,y,2.6,0,TAU);g.fill()}
    return c})();
  const FG=(()=>{const c=mkC(W,H),g=c.getContext('2d');g.fillStyle='rgba(12,22,56,.14)';g.fillRect(0,0,W,H);let r=g.createRadialGradient(W/2,H/2,H*.33,W/2,H/2,H*.78);r.addColorStop(0,'rgba(6,10,28,0)');r.addColorStop(1,'rgba(6,10,28,.5)');g.fillStyle=r;g.fillRect(0,0,W,H);
    for(const[x,y]of LIGHTS){r=g.createRadialGradient(x,y,0,x,y,70);r.addColorStop(0,'rgba(255,214,140,.1)');r.addColorStop(1,'rgba(255,214,140,0)');g.fillStyle=r;g.fillRect(x-70,y-70,140,140)}return c})();
  /* a person seen from above: shadow, shoulders, arms, cup, head with hair. (fx,fy) = the way they face. o.rh/o.lh = hand spots in body coordinates (forward = -y); o.wt = world point the right hand reaches for */
  const person=(x,y,fx,fy,L,o)=>{o=o||{};const a=Math.atan2(fx,-fy);q.save();q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.ellipse(x+3,y+4,15,10,0,0,TAU);q.fill();q.translate(x,y);q.rotate(a);
    if(L.long){q.fillStyle=L.hair;q.beginPath();q.ellipse(0,6,7,9,0,0,TAU);q.fill()}
    q.fillStyle=L.shirt;q.strokeStyle=L.dk;q.lineWidth=1.5;q.beginPath();q.ellipse(0,1,13.5,8,0,0,TAU);q.fill();q.stroke();
    if(L.tag){q.fillStyle=L.tag;q.font='bold 6.5px Georgia,serif';q.textAlign='center';q.fillText('ΑΣΡ',0,5)}
    let rh=o.rh||[11,-8],lh=o.lh||[-11,-8];
    if(o.wt){const dx=o.wt[0]-x,dy=o.wt[1]-y,c=Math.cos(a),s=Math.sin(a);let lx=dx*c+dy*s,ly=-dx*s+dy*c;const sx=11,sy=1,vx=lx-sx,vy=ly-sy,d=Math.hypot(vx,vy),m=Math.min(d,25);rh=[sx+vx/d*m,sy+vy/d*m]}
    if(o.cheer){const w=Math.sin(o.cheer*18)*2;rh=[16,-9+w];lh=[-16,-9-w]}
    const arm=(sx,h,cup)=>{const mx=lerp(sx,h[0],.5),my=lerp(1,h[1],.5);q.lineCap='round';q.strokeStyle=L.shirt;q.lineWidth=6;q.beginPath();q.moveTo(sx,1);q.lineTo(mx,my);q.stroke();q.strokeStyle=L.skin;q.lineWidth=4;q.beginPath();q.moveTo(mx,my);q.lineTo(h[0],h[1]);q.stroke();q.fillStyle=L.skin;q.beginPath();q.arc(h[0],h[1],o.cheer?4.6:3.3,0,TAU);q.fill();
      if(cup){q.fillStyle='#d8322b';q.beginPath();q.arc(h[0],h[1]-1,4.3,0,TAU);q.fill();q.strokeStyle='#fff';q.lineWidth=1.2;q.beginPath();q.arc(h[0],h[1]-1,2.7,0,TAU);q.stroke()}};
    arm(-11,lh,L.cup!==0);arm(11,rh,0);
    if(o.die){q.fillStyle='#fffdf6';q.fillRect(rh[0]-3,rh[1]-6,6,6);q.fillStyle='#1d1d22';q.fillRect(rh[0]-.8,rh[1]-3.8,1.6,1.6)}
    q.fillStyle=L.skin;q.beginPath();q.arc(-7.6,-.5,1.9,0,TAU);q.arc(7.6,-.5,1.9,0,TAU);q.fill();q.beginPath();q.arc(0,-1.5,7.6,0,TAU);q.fill();
    q.fillStyle=L.hair;q.beginPath();q.arc(0,1.2,7.4,0,TAU);q.fill();
    if(L.cap){q.fillStyle=L.cap;q.beginPath();q.arc(0,.8,7.6,0,TAU);q.fill();q.fillRect(-6,-11.5,12,5.5);q.fillStyle='rgba(0,0,0,.18)';q.fillRect(-6,-7,12,1.2)}
    q.restore()};
  const LK={dan:{shirt:'#e2b64c',dk:'#a98425',skin:'#e0b48e',hair:'#4a3020',tag:'#7d1f2c'},mar:{shirt:'#7d1f2c',dk:'#4e1019',skin:'#6e4630',hair:'#151515',tag:'#e2b64c'},ch:{shirt:'#5a6aa8',dk:'#3a4678',skin:'#efc9a6',hair:'#2a2018',cap:'#f2f2f2'},co:{shirt:'#7a8cc4',dk:'#4a5c92',skin:'#e6bd98',hair:'#c9a24a'}};
  const BY=[{x:300,y:158,f:[-1,.15],L:{shirt:'#3a8a6a',dk:'#24604a',skin:'#c68a60',hair:'#1a1410',cap:'#3a8a6a'}},{x:297,y:334,f:[-1,-.1],L:{shirt:'#c0568a',dk:'#8a3a62',skin:'#e9c3a0',hair:'#6a3a1c',long:1}},{x:304,y:402,f:[-1,-.5],L:{shirt:'#d8d8d0',dk:'#9a9a92',skin:'#8a5a3c',hair:'#1a1410'}},
    {x:36,y:356,f:[1,0],L:{shirt:'#4a6aa0',dk:'#2e4a78',skin:'#efc9a6',hair:'#b8863a'}},{x:36,y:392,f:[1,0],L:{shirt:'#e07a3a',dk:'#a85422',skin:'#d9a67c',hair:'#2a1a10',long:1}},{x:34,y:150,f:[1,.35],L:{shirt:'#6a4a8a',dk:'#46305e',skin:'#f0cfae',hair:'#2a2018'}},{x:76,y:262,f:[1,-.1],L:{shirt:'#2f2f36',dk:'#17171b',skin:'#b97b52',hair:'#0e0e0e',cap:'#d8322b'}}];
  let cheerT=0,lastTot=0;
  // ================================================= loop
  let lt=NOW();(function loop(){if(mode!=='mg'||!cv.isConnected)return;const now=NOW(),dt=Math.min(.05,now-lt);lt=now;G.t+=dt;
    if(G.phase==='aim'){G.aim.x=TX+TW/2+Math.sin(G.t*2.3)*(TW/2+18);G.aim.y=TY+TH/4+Math.sin(G.t*1.37)*(TH/4-6)}
    if(G.phase==='height')G.hv=(Math.sin(G.t*3.1-PI/2)+1)/2;
    if(G.phase==='catch'){const C=G.ct,k=G.t/C.dur;
      if(G.called){G.called=0;G.phase='res';if(C.ht<HL){say('You call HEIGHT. Dead die.');sfx('ok')}else{score('them',C.tink?2:1,'You called height on a good toss and froze')}next()}
      else if(G.pressed){G.pressed=0;const off=Math.abs(k-C.tgt);
        if(off<C.win){G.phase='res';G.bob=0;G.die=null;G.cp=null;say('Caught it one-handed!');sfx('ok');next()}
        else if(off<C.win*2.2&&!G.bob){G.bob=1;C.tgt=Math.min(.97,k+.2);C.win*=.85;info('Bobbled! It pops up off your hand… Space again before it hits the table!')}
        else{G.phase='res';const b=G.bob;G.bob=0;score('them',C.tink?2:1,b?'The bobble drops':'You grab at air');next()}}
      else if(k>1){G.phase='res';G.bob=0;score('them',C.tink?2:1,C.tink?'Tink! It drops':'It drops past you');next()}}
    if(G.phase==='fifa'){if(G.kick){G.kick=0;G.usF++;if(rnd()<.6){const who=G.lastThem||'ch';G.benchThem=who;say('FIFA! You kick it up, Marcus catches: '+P_[who].n+' sits out next defense.');sfx('ok')}else{say('Your FIFA sails wide. No harm done.');sfx('whiff')}G.fifaDone()}else if(G.t>.9){say('Air ball. Too slow on the FIFA.');G.fifaDone()}}
    if(G.die){G.die.t=Math.min(1,G.die.t+dt/.7);if(G.die.t>=1&&G.die.x2!=null)G.die.t2=Math.min(1,(G.die.t2||0)+dt/.5)}
    // draw
    q.drawImage(BG,0,0);{const tot=G.us+G.them;if(tot>lastTot)cheerT=1.1;lastTot=tot;if(cheerT>0)cheerT-=dt;
      BY.forEach((b,i)=>{const sw=Math.sin(G.t*1.6+i*1.9);person(b.x+sw*.7,b.y+Math.cos(G.t*1.3+i)*.5,b.f[0],b.f[1],b.L,cheerT>0?{cheer:cheerT+i*.3}:{})})}
    {const tk=G.phase==='fly'&&G.die&&G.die.x1!=null?Object.keys(P_).find(k=>P_[k].x===G.die.x0&&P_[k].y===G.die.y0):null;
    for(const k in P_){const p0=P_[k],lm=G.phase==='catch'&&G.ct?Math.min(1,G.t/(G.ct.dur*G.ct.tgt*.55)):0,p=k==='dan'&&lm>0?{n:p0.n,x:lerp(p0.x,G.ct.E.x+16,lm),y:lerp(p0.y,G.ct.E.y+6,lm)}:p0,benched=G.offUs===k||G.offThem===k||G.benchUs===k||G.benchThem===k;
      let f=k==='ch'||k==='co'?[0,1]:[0,-1];const o={};
      if(k==='dan'&&(G.phase==='aim'||G.phase==='height')){o.rh=[5,-15];o.die=1}
      if(k===tk){const e=G.die.t<.45?Math.sin(G.die.t/.45*PI)*13:0;o.rh=[4,-14-e]}
      if(k==='dan'&&G.phase==='catch'&&G.ct){const E=G.ct.E;o.wt=[E.x,E.y-16];f=[E.x-p.x,E.y-16-p.y];if(Math.hypot(f[0],f[1])<3)f=[0,-1]}
      q.globalAlpha=benched?.4:1;person(p.x,p.y,f[0],f[1],LK[k],o);q.globalAlpha=1;
      q.fillStyle='#fff';q.strokeStyle='rgba(0,0,0,.75)';q.lineWidth=3;q.font='bold 10px Archivo,Arial';q.textAlign='center';const lb=p.n+(benched?' (out)':''),ly=p.y+(p.y<MID?-17:25);q.strokeText(lb,p.x,ly);q.fillText(lb,p.x,ly)}}
    q.drawImage(FG,0,0);
    if(G.phase==='aim'){q.strokeStyle='#ffe27a';q.lineWidth=3;q.beginPath();q.arc(G.aim.x,G.aim.y,9,0,TAU);q.moveTo(G.aim.x-14,G.aim.y);q.lineTo(G.aim.x+14,G.aim.y);q.moveTo(G.aim.x,G.aim.y-14);q.lineTo(G.aim.x,G.aim.y+14);q.stroke()}
    if(G.phase==='height'){q.strokeStyle='#ffe27a';q.lineWidth=3;q.beginPath();q.arc(G.aim.x,G.aim.y,9,0,TAU);q.stroke()}
    // toss height meter (right edge)
    {if(G.phase==='aim'&&G.aim)G.sw=dieSW();const mx=W-30,my=62,mh=330;q.fillStyle='#0a1426';q.fillRect(mx,my,14,mh);const v=G.phase==='height'?G.hv:G.die&&G.die.ht!=null?G.die.ht:0;if(G.sw!=null&&(G.phase==='height'||G.phase==='aim'||G.zone)){q.fillStyle='rgba(90,220,110,.55)';q.fillRect(mx-3,my+mh-(G.sw+SWW)*mh,20,SWW*mh);q.strokeStyle='#7fe07a';q.lineWidth=1.5;q.strokeRect(mx-3,my+mh-(G.sw+SWW)*mh,20,SWW*mh)}q.fillStyle=v<HL?'#c0302a':'#e2b64c';q.globalAlpha=.85;q.fillRect(mx+3,my+mh-v*mh,8,v*mh);q.globalAlpha=1;
      q.strokeStyle='#fff';q.setLineDash([4,3]);q.beginPath();q.moveTo(mx-6,my+mh-HL*mh);q.lineTo(mx+20,my+mh-HL*mh);q.stroke();q.setLineDash([]);q.fillStyle='#fff';q.font='9px Archivo,Arial';q.textAlign='center';q.fillText('HEIGHT',mx+7,my-6)}
    if(G.phase!=='catch'&&G.cp){if(G.die)G.die.drop={x:G.cp.x,y:G.cp.y};G.cp=null}
    if(G.die&&G.die.drop){const dp=G.die.drop;q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.arc(dp.x,dp.y,5,0,TAU);q.fill();q.fillStyle='#fffdf6';q.fillRect(dp.x-5,dp.y-8,10,10);q.fillStyle='#1d1d22';q.beginPath();q.arc(dp.x,dp.y-3,1.8,0,TAU);q.fill()}
    else if(G.phase!=='catch'&&G.die&&G.die.x1!=null){const d=G.die,k=d.t,b=d.x2!=null&&k>=1?d.t2:0;let x=lerp(d.x0,d.x1,k),y=lerp(d.y0,d.y1,k),h=Math.sin(k*PI)*(30+(d.ht||.5)*90);if(b>0){x=lerp(d.x1,d.x2,b);y=lerp(d.y1,d.y2,b);h=Math.sin(b*PI)*22}q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.arc(x,y,4,0,TAU);q.fill();
      q.fillStyle='#fffdf6';q.fillRect(x-6-h/40,y-h-6-h/40,12+h/20,12+h/20);q.fillStyle='#1d1d22';q.beginPath();q.arc(x,y-h,1.8,0,TAU);q.fill();}
    if(G.phase==='catch'){const C=G.ct,k=G.t/C.dur,d=G.die||{x1:TX+TW/4,y1:MID+80},E=C.E,ta=Math.max(.2,C.tgt-C.win),u=Math.min(1,k/ta),ez=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;let x,y,h;
      // approach: eased flight from the table to the circle; hover in the circle through the catch window; then it drops past you
      if(k<=C.tgt+C.win){x=lerp(d.x1,E.x,ez);y=lerp(d.y1,E.y,ez);h=(30+C.ht*70)*4*u*(1-u)+16*ez+(k>ta?Math.sin(G.t*18)*1.5:0)}
      else{const v=Math.min(1,(k-C.tgt-C.win)/.12);x=E.x;y=E.y+v*14;h=16*(1-v)}
      G.cp={x,y};
      // dotted guide: where the die is going
      q.save();q.strokeStyle='rgba(255,226,122,.45)';q.lineWidth=2;q.setLineDash([3,5]);q.beginPath();q.moveTo(x,y-h);q.lineTo(E.x,E.y-16);q.stroke();q.restore();
      const r=10+Math.max(0,C.tgt-k)*90,ok=Math.abs(k-C.tgt)<C.win;
      q.fillStyle=ok?'rgba(127,224,122,.28)':'rgba(255,226,122,.14)';q.beginPath();q.arc(E.x,E.y-16,13,0,TAU);q.fill();   // the circle the die flies into
      q.strokeStyle='#fff';q.lineWidth=2;q.beginPath();q.arc(E.x,E.y-16,r,0,TAU);q.stroke();q.strokeStyle=ok?'#7fe07a':'#e2b64c';q.lineWidth=3.5;q.beginPath();q.arc(E.x,E.y-16,13,0,TAU);q.stroke();
      q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.arc(x,y,5,0,TAU);q.fill();   // shadow on the ground
      const sz=13+h/18;q.fillStyle='#fffdf6';q.fillRect(x-sz/2,y-h-sz/2,sz,sz);q.strokeStyle='#1d1d22';q.lineWidth=1;q.strokeRect(x-sz/2,y-h-sz/2,sz,sz);q.fillStyle='#1d1d22';q.beginPath();q.arc(x,y-h,2.2,0,TAU);q.fill();
      if(ok){q.fillStyle='#7fe07a';q.font='bold 13px Archivo,Arial';q.textAlign='center';q.fillText('GRAB!',E.x,E.y-38)}}
    if(G.phase==='fifa'){q.fillStyle='#e2b64c';q.font='bold 22px Archivo,Arial';q.textAlign='center';q.fillText('F  —  FIFA!',W/2,MID+120)}
    if(G.rollT>0){G.rollT-=dt;q.fillStyle='#fffdf6';q.fillRect(W/2-22,MID-22,44,44);q.fillStyle='#1d1d22';q.font='bold 28px Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(G.rollV,W/2,MID+1);q.textBaseline='alphabetic'}
    q.fillStyle='rgba(10,16,36,.78)';q.fillRect(6,3,78,19);q.fillRect(W-84,H-26,78,19);q.fillStyle='#fff';q.font='bold 13px Archivo,Arial';q.textAlign='left';q.fillText('THEM '+G.them,12,17);q.textAlign='right';q.fillText('YOU '+G.us,W-12,H-12);
    stat();requestAnimationFrame(loop)})()})}
