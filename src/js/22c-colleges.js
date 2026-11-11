// ================================================================ V308 COLLEGES: fifteen more classes, their classrooms, their minigames, and the Skill Tree
// Every class belongs to a college (CI[c].col, colleges in COLL). Passing a class session (one grade star, up to three per class) gives one
// skill point of that college (S.sp[col]); points are spent on that college's tree in the planner's Skill Tree tab (S.sk[node id]).
// The schedule: four classes meet in each weekday slot (9 AM and 1 PM, Monday to Friday), so each of the twenty classes meets twice a week.

// ---------------------------------------------------------------- schedule
function clsDay(d){const w=(d-1)%7;return d>=2&&w>=1&&w<=5}
function classesAt(d,sl){if(!clsDay(d))return[];const k=((d-1)%7-1)*2+sl;return CLS.filter((c,i)=>i%10===k||(i+5)%10===k)}
function clsBld(c){const k=CI[c].b;return B.find(b=>b.menu===k||b.id===k)}

// ---------------------------------------------------------------- classrooms: a door on each building (its real front door) and a lecture room inside
function colRoom(c,i){const C=CI[c],b=B.find(b=>b.id===C.bid);
  if(b.ex==null){const u=UCD.B.find(u=>u.n===C.bn&&u.fp&&u.fn);if(u){b.ex=u.fp[0]+u.fn[0]*1.6;b.ez=u.fp[1]+u.fn[1]*1.6;b.fn=u.fn;b.face=Math.abs(u.fn[0])>Math.abs(u.fn[1])?(u.fn[0]>0?'e':'w'):(u.fn[1]>0?'s':'n')}}
  const W=[0xe6dcc6,0xe2e6ea,0xece4d4,0xdfe6dc,0xe8e0e6][i%5];
  return classInt(C.bid,{name:C.bn+', Room '+(101+i*13),cls:c,board:C.board,wall:W,floor:['wood','tile','carpet'][i%3]})}

// ---------------------------------------------------------------- shared minigame helpers
const MGX={};
function mgWrap(el,c,intro,body){el.innerHTML=`<p class="mgintro">${CI[c].prof}: "${intro}"</p>${body}`}
function mgNeed(n,g){return Math.max(1,Math.min(n,n-2+g)-(S.studied?1:0))}   /* of n: pass 2 at grade 1, 3 at grade 2, all at grade 3; studying forgives one */
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',sup=n=>String(n).split('').map(d=>SUP[+d]).join('');

// ---- multiple choice: four questions from the class's bank
function mgQuiz(el,g,done,c){const D=MGD[c],Q=shuffle(D.q.slice()).slice(0,4),need=mgNeed(4,g);let i=0,ok=0;
  mgWrap(el,c,D.intro,`<div class="deal"><div class="lbl" id="qzn"></div><div class="item" id="qzq" style="font-size:19px;line-height:1.35"></div><div id="qzo" class="mgopts"></div><div class="log" id="qzl"></div></div>`);
  function show(){if(!$('qzq'))return;const q=Q[i],opts=shuffle([q[1],...q.slice(2,5)].filter(Boolean));$('qzn').textContent=`Question ${i+1} of 4 · need ${need} right`;$('qzq').textContent=q[0];$('qzl').textContent='';
    const o=$('qzo');o.innerHTML='';opts.forEach(t=>{const b=document.createElement('button');b.className='btn ghost';b.textContent=t;b.onclick=()=>{for(const x of o.children)x.disabled=true;const r=t===q[1];if(r){ok++;sfx('ok');b.classList.add('ok')}else{sfx('bad');b.classList.add('no');for(const x of o.children)if(x.textContent===q[1])x.classList.add('ok')}
      $('qzl').textContent=(r?'Right. ':'Not quite. ')+(q[5]||'');setTimeout(()=>{i++;if(i<4)show();else done(ok>=need,`You got ${ok} of 4. Passing mark: ${need}.`)},q[5]?1900:1100)};o.appendChild(b)})}
  show()}
// ---- generated problems with four options (calculus, gears, binary)
function mgMath(el,g,done,c){const D=MGD[c],need=mgNeed(4,g);let i=0,ok=0;const P_=[0,1,2,3].map(k=>D.gen(g,k));
  mgWrap(el,c,D.intro,`<div class="deal"><div class="lbl" id="mtn"></div><div class="item" id="mtq" style="font-size:21px;line-height:1.35"></div><div id="mto" class="mgopts"></div><div class="log" id="mtl"></div></div>`);
  function show(){if(!$('mtq'))return;const p=P_[i],opts=shuffle([...new Set([String(p.a),...p.w.map(String)])].slice(0,4));if(!opts.includes(String(p.a)))opts[0]=String(p.a);$('mtn').textContent=`Problem ${i+1} of 4 · need ${need} right`;$('mtq').textContent=p.q;$('mtl').textContent='';
    const o=$('mto');o.innerHTML='';shuffle(opts).forEach(t=>{const b=document.createElement('button');b.className='btn ghost';b.textContent=t;b.onclick=()=>{for(const x of o.children)x.disabled=true;const r=t===String(p.a);if(r){ok++;sfx('ok');b.classList.add('ok')}else{sfx('bad');b.classList.add('no');for(const x of o.children)if(x.textContent===String(p.a))x.classList.add('ok')}
      $('mtl').textContent=(r?'Right. ':'The answer is '+p.a+'. ')+(p.why||'');setTimeout(()=>{i++;if(i<4)show();else done(ok>=need,`You solved ${ok} of 4. Passing mark: ${need}.`)},1700)};o.appendChild(b)})}
  show()}
// ---- sorting: put each item in the right bin
function mgSort(el,g,done,c){const D=MGD[c],n=6+g,items=shuffle(D.items.slice()).slice(0,n),need=Math.max(1,Math.round(n*(.6+.1*g))-(S.studied?1:0));let i=0,ok=0;
  mgWrap(el,c,D.intro,`<div class="deal"><div class="lbl" id="srn"></div><div class="item" id="sri" style="text-align:center;font-size:26px"></div><div id="sro" class="mgopts"></div><div class="log" id="srl"></div></div>`);
  function show(){if(!$('sri'))return;const it=items[i];$('srn').textContent=`${i+1} of ${n} · need ${need} right`;$('sri').textContent=it[0];$('srl').textContent='';const o=$('sro');o.innerHTML='';
    D.bins.forEach(t=>{const b=document.createElement('button');b.className='btn ghost';b.textContent=t;b.onclick=()=>{for(const x of o.children)x.disabled=true;const r=t===it[1];if(r){ok++;sfx('ok');b.classList.add('ok')}else{sfx('bad');b.classList.add('no');for(const x of o.children)if(x.textContent===it[1])x.classList.add('ok')}
      $('srl').textContent=(r?'Right. ':'That one is '+it[1]+'. ')+(it[2]||'');setTimeout(()=>{i++;if(i<n)show();else done(ok>=need,`You sorted ${ok} of ${n} correctly. Passing mark: ${need}.`)},it[2]?1700:1000)};o.appendChild(b)})}
  show()}
// ---- memory: watch a sequence of coloured squares light up, then repeat it
function mgMemory(el,g,done,c){const D=MGD[c],L=[4+g,5+g,6+g],need=S.studied?1:2,COL=['#d84a4a','#3a8ad8','#e2b64c','#3aa86a'];let r=0,ok=0,seq=[],inp=[],busy=1;
  mgWrap(el,c,D.intro,`<div class="deal"><div class="lbl" id="mmn"></div><div id="mmg" style="display:grid;grid-template-columns:repeat(2,96px);gap:12px;justify-content:center;margin:8px 0">${COL.map((k,j)=>`<button data-j="${j}" style="height:96px;border-radius:12px;border:3px solid rgba(0,0,0,.35);background:${k};opacity:.35;cursor:pointer"></button>`).join('')}</div><div class="log" id="mml"></div></div>`);
  const pads=[...$('mmg').children];const lit=(j,on)=>{pads[j].style.opacity=on?1:.35;pads[j].style.transform=on?'scale(1.06)':''};
  pads.forEach(p=>p.onclick=()=>{if(busy)return;const j=+p.dataset.j;lit(j,1);setTimeout(()=>lit(j,0),180);tone(330+j*110,.12,'triangle',.08);inp.push(j);const k=inp.length-1;
    if(inp[k]!==seq[k]){busy=1;sfx('bad');$('mml').textContent='Wrong square. The pattern was lost.';setTimeout(next,1200)}else if(inp.length===seq.length){busy=1;ok++;sfx('ok');$('mml').textContent='Perfect recall.';setTimeout(next,1000)}});
  function play(){busy=1;let k=0;$('mml').textContent='Watch…';const step=()=>{if(k>=seq.length){busy=0;$('mml').textContent='Your turn: repeat it.';return}const j=seq[k++];lit(j,1);tone(330+j*110,.18,'triangle',.08);setTimeout(()=>{lit(j,0);setTimeout(step,170)},Math.max(320,560-g*90))};setTimeout(step,600)}
  function next(){if(!$('mmg'))return;if(r>=3||ok>=need&&r>=2){done(ok>=need,`You recalled ${ok} of ${r} sequences. Passing mark: ${need}.`);return}seq=Array.from({length:L[r]},()=>Math.floor(rnd()*4));inp=[];r++;$('mmn').textContent=`Sequence ${r} of 3 · ${seq.length} squares · need ${need}`;play()}
  next()}
// ---- timing meter: stop the needle inside the green zone
function mgMeter(el,g,done,c){const D=MGD[c],N=5,need=Math.max(1,3+(g>=1?1:0)-(S.studied?1:0)),zw=[.26,.19,.13][g],spd=[1.15,1.45,1.8][g];let i=0,ok=0,t0=performance.now(),z=0,raf=0,stop=0;
  mgWrap(el,c,D.intro,`<div class="deal"><div class="lbl" id="mrn"></div><div style="position:relative;height:46px;background:#1b2a22;border-radius:8px;border:1px solid #3d5a48;overflow:hidden"><div id="mrz" style="position:absolute;top:0;bottom:0;background:rgba(90,200,120,.55)"></div><div id="mrk" style="position:absolute;top:-4px;bottom:-4px;width:4px;background:#ffe2a0;box-shadow:0 0 8px #ffe2a0"></div></div><div style="text-align:center"><button class="btn" id="mrb">${D.act}</button></div><div class="log" id="mrl"></div></div>`);
  const pos=()=>.5+.5*Math.sin((performance.now()-t0)/1000*spd*Math.PI);
  function set(){if(!$('mrz'))return;z=.08+rnd()*(.84-zw);$('mrz').style.left=(z*100)+'%';$('mrz').style.width=(zw*100)+'%';$('mrn').textContent=`${D.unit} ${i+1} of ${N} · need ${need}`;t0=performance.now()-rnd()*900;stop=0}
  function loop(){if(!$('mrk'))return;if(!stop)$('mrk').style.left='calc('+(pos()*100)+'% - 2px)';raf=requestAnimationFrame(loop)}
  $('mrb').onclick=()=>{if(stop)return;stop=1;const p=pos(),hit=p>=z&&p<=z+zw;if(hit){ok++;sfx('ok')}else sfx('bad');$('mrl').textContent=hit?D.good:D.bad;$('mrb').disabled=true;
    setTimeout(()=>{i++;$('mrb').disabled=false;if(i<N)set();else{cancelAnimationFrame(raf);done(ok>=need,`${ok} of ${N} ${D.unit.toLowerCase()}s placed. Passing mark: ${need}.`)}},900)};
  set();loop()}
// ---- rhythm: tap on the beat (music) or keep a steady rate (CPR)
function mgRhythm(el,g,done,c){const D=MGD[c],bpm=D.bpm[g],per=60000/bpm,N=D.n,win=D.win[g]+(S.studied?25:0);let taps=[],t0=0,raf=0,started=0,fin=0;
  mgWrap(el,c,D.intro,`<div class="deal"><div class="lbl" id="rhn">${D.how}</div><div style="display:flex;justify-content:center;margin:6px 0"><div id="rhc" style="width:110px;height:110px;border-radius:50%;border:4px solid #e2b64c;display:flex;align-items:center;justify-content:center;font:700 26px var(--fd);color:#f4f1e4">●</div></div><div style="text-align:center"><button class="btn" id="rhb">${D.act}</button></div><div class="log" id="rhl">Press the button (or Space) to start.</div></div>`);
  const ring=$('rhc');
  function loop(){if(!$('rhc'))return;const t=performance.now()-t0,ph=(t%per)/per,show=D.metro||taps.length<4;ring.style.transform='scale('+(show?1+.18*Math.max(0,1-ph*5):1)+')';ring.style.borderColor=show&&ph<.18?'#ffe2a0':'#e2b64c';raf=requestAnimationFrame(loop)}
  function tap(){if(fin)return;const now=performance.now();if(!started){started=1;t0=now;taps=[];$('rhl').textContent=D.metro?'Tap on every beat.':'Keep going. Steady.';loop();tone(660,.05,'square',.05);return}
    taps.push(now-t0);tone(D.metro?520:180,.05,D.metro?'square':'sine',.06);ring.textContent=taps.length;if(taps.length>=N){fin=1;cancelAnimationFrame(raf);score()}}
  function score(){let good=0,txt;if(D.metro){for(const t of taps){const off=Math.abs(t-Math.round(t/per)*per);if(off<=win)good++}const need=Math.round(N*(.6+.08*g))-(S.studied?1:0);txt=`${good} of ${N} taps landed on the beat. Passing mark: ${need}.`;done(good>=need,txt)}
    else{const iv=[];for(let k=1;k<taps.length;k++)iv.push(taps[k]-taps[k-1]);const avg=iv.reduce((a,b)=>a+b,0)/iv.length,rate=Math.round(60000/avg);for(const v of iv){const r=60000/v;if(r>=100-win/10&&r<=120+win/10)good++}
      const need=Math.round(iv.length*(.55+.1*g))-(S.studied?1:0),pass=good>=need&&rate>=95&&rate<=125;txt=`Average rate: ${rate} a minute. ${good} of ${iv.length} compressions were in the 100 to 120 range. Passing mark: ${need}.`;done(pass,txt)}}
  $('rhb').onclick=tap;MGX.key=e=>{if(e.code==='Space'){e.preventDefault();tap()}};MGK=MGX.key}
// ---- robot grid: queue moves, then run the program
function mgGrid(el,g,done,c){const D=MGD[c],Nn=[5,6,6][g],T=3,need=S.studied?1:2;let lv=0,ok=0,grid,st,gl,prog=[],run=0,maxL=0;
  mgWrap(el,c,D.intro,`<div class="deal"><div class="lbl" id="gdn"></div><canvas id="gdc" class="mgc" width="300" height="300"></canvas><div id="gdp" class="log" style="min-height:28px;text-align:center;letter-spacing:2px"></div><div class="mgopts" style="justify-content:center">${['↑','↓','←','→'].map(a=>`<button class="btn ghost gdk">${a}</button>`).join('')}<button class="btn ghost" id="gdu">Undo</button><button class="btn" id="gdr">Run</button></div><div class="log" id="gdl"></div></div>`);
  const DIR={'↑':[0,-1],'↓':[0,1],'←':[-1,0],'→':[1,0]},q=$('gdc').getContext('2d'),cs=300/Nn;
  function bfs(){const Q=[[...st,0]],seen=new Set([st.join()]);while(Q.length){const[x,y,d]=Q.shift();if(x===gl[0]&&y===gl[1])return d;for(const[dx,dy]of Object.values(DIR)){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=Nn||Y>=Nn||grid[Y][X]||seen.has(X+','+Y))continue;seen.add(X+','+Y);Q.push([X,Y,d+1])}}return -1}
  function make(){for(let t=0;t<200;t++){grid=Array.from({length:Nn},()=>Array(Nn).fill(0));const nw=Math.round(Nn*Nn*(.18+.06*g));for(let k=0;k<nw;k++)grid[Math.floor(rnd()*Nn)][Math.floor(rnd()*Nn)]=1;st=[0,Nn-1];gl=[Nn-1,0];grid[st[1]][st[0]]=0;grid[gl[1]][gl[0]]=0;const d=bfs();if(d>=Nn-1+g){maxL=d+2-g+(S.studied?1:0);return}}}
  function draw(rx,ry){q.fillStyle='#16241c';q.fillRect(0,0,300,300);for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++){q.fillStyle=grid[y][x]?'#5a4a3a':'#21362a';q.fillRect(x*cs+1,y*cs+1,cs-2,cs-2)}
    q.fillStyle='#3aa86a';q.fillRect(gl[0]*cs+6,gl[1]*cs+6,cs-12,cs-12);q.fillStyle='#e2b64c';q.beginPath();q.arc((rx+.5)*cs,(ry+.5)*cs,cs*.32,0,TAU);q.fill();q.fillStyle='#1b1b1b';q.fillRect((rx+.5)*cs-cs*.14,(ry+.5)*cs-cs*.08,cs*.08,cs*.08);q.fillRect((rx+.5)*cs+cs*.06,(ry+.5)*cs-cs*.08,cs*.08,cs*.08)}
  function upd(){$('gdp').textContent=prog.join(' ')||'(empty program)';$('gdn').textContent=`Course ${lv+1} of ${T} · need ${need} · at most ${maxL} moves · ${prog.length}/${maxL}`}
  function level(){make();prog=[];run=0;draw(st[0],st[1]);upd();$('gdl').textContent='Queue moves to reach the green pad, then press Run. Brown squares are walls.'}
  for(const b of el.querySelectorAll('.gdk'))b.onclick=()=>{if(run||prog.length>=maxL)return;prog.push(b.textContent);sfx('ui');upd()};
  $('gdu').onclick=()=>{if(run)return;prog.pop();upd()};
  $('gdr').onclick=()=>{if(run||!prog.length)return;run=1;let x=st[0],y=st[1],k=0;const stepF=()=>{if(k>=prog.length){fin(x===gl[0]&&y===gl[1],'The robot stops short of the pad.');return}const[dx,dy]=DIR[prog[k++]],X=x+dx,Y=y+dy;
      if(X<0||Y<0||X>=Nn||Y>=Nn||grid[Y][X]){sfx('hit');fin(false,'CLUNK. The robot drives into a wall.');return}x=X;y=Y;draw(x,y);tone(400,.04,'square',.04);if(x===gl[0]&&y===gl[1]){fin(true,'Beep boop. Course complete.');return}setTimeout(stepF,260)};setTimeout(stepF,200)};
  function fin(w,msg){if(w){ok++;sfx('ok')}else sfx('bad');$('gdl').textContent=msg;setTimeout(()=>{lv++;if(ok>=need||lv>=T||ok+(T-lv)<need)done(ok>=need,`The robot finished ${ok} of ${lv} courses. Passing mark: ${need}.`);else level()},1300)}
  level()}

// ---------------------------------------------------------------- per-class content
const MGD={
 arch:{intro:'A beam carries load to the columns. Set each beam while the load line sits over its bearing. Five beams.',act:'Set the beam',unit:'Beam',good:'Clean bearing. The structure takes the load.',bad:'Off the bearing. The beam sags.'},
 indd:{intro:'Design is decisions. Four questions on how people actually use things.',q:[
   ['A door with a flat metal plate and no handle is telling you to…','Push','Pull','Slide','Knock',"A plate affords pushing. That's affordance."],
   ['Why are fire extinguishers red?','They have to be found instantly','Red paint is cheap','It is the brand colour','It looks hot','Colour carries meaning.'],
   ['"Form follows function" means…','The use decides the shape','Looks come first','Use the cheapest form','Copy the competition','Louis Sullivan, 1896.'],
   ['A chair seat is usually about 45 cm high because…','That fits the knee height of most adults','It stacks better','It saves fabric','It is a law','That is ergonomics.'],
   ['The "undo" button is an example of…','Forgiving design: mistakes are reversible','Decoration','Branding','Planned obsolescence','Good design lets people recover.'],
   ['A prototype is mainly for…','Testing an idea cheaply before building it for real','Selling to customers','Patenting','Packaging','Fail early, fail cheap.'],
   ['Rounded corners on a phone mostly help…','Comfort in the hand and durability when dropped','Battery life','Signal','Screen colour',''],
   ['A light switch that goes up for on is following…','A convention people already expect','A safety law','The cheapest wiring','Random chance','Mapping to expectations.']]},
 geol:{intro:'Every rock tells you how it was made. Sort each one: igneous, sedimentary or metamorphic.',bins:['Igneous','Sedimentary','Metamorphic'],items:[
   ['Granite','Igneous','Cooled slowly from magma underground.'],['Basalt','Igneous','Cooled fast from lava.'],['Obsidian','Igneous','Volcanic glass.'],['Pumice','Igneous','Lava full of gas bubbles.'],
   ['Sandstone','Sedimentary','Cemented sand.'],['Limestone','Sedimentary','Shells and calcite.'],['Shale','Sedimentary','Compacted mud.'],['Coal','Sedimentary','Squeezed plant matter.'],['Conglomerate','Sedimentary','Pebbles cemented together.'],
   ['Marble','Metamorphic','Limestone, heated and squeezed.'],['Slate','Metamorphic','Shale under pressure.'],['Quartzite','Metamorphic','Sandstone, recrystallized.'],['Gneiss','Metamorphic','Banded by heat and pressure.'],['Schist','Metamorphic','Sparkly with flattened mica.']]},
 fchem:{intro:'Every contact leaves a trace. Four questions from the crime lab.',q:[
   ['Luminol glows blue when it reacts with…','The iron in blood','Bleach only','Fingerprint oil','Gunpowder','It is a presumptive test: a lead, not proof.'],
   ['Superglue fuming is used to…','Develop fingerprints on smooth surfaces','Test for poison','Date a document','Find fibres','The vapour sticks to the oils in a print.'],
   ['Chromatography separates a mixture by…','How far each part travels through a medium','Its smell','Its weight on a scale','Its temperature','Inks and dyes split into bands.'],
   ['A Kastle-Meyer test turning pink suggests…','Blood','Saliva','Ink','Rust','Pink means probably blood.'],
   ['Why are evidence samples sealed and signed?','To keep the chain of custody','To look official','To stop them smelling','For the photographs','Every hand that touches it is recorded.'],
   ['Mass spectrometry identifies a substance by…','The masses of its charged fragments','Its colour','Its taste','Its boiling noise',''],
   ['Locard\'s principle says that…','Every contact leaves a trace','The butler did it','Fingerprints never repeat','Blood always clots',''],
   ['Fibres found at a scene are most useful when they…','Are rare and can be matched to a source','Are white cotton','Are very long','Are wet','Common fibres prove very little.']]},
 calc:{intro:'Four problems. Show your work, or at least get the answer.',gen:(g,k)=>{const R=n=>1+Math.floor(rnd()*n);
   if(k===0){const a=R(5)+1,n=R(4)+1;return{q:`d/dx of ${a}x${sup(n)} = ?`,a:n===1?`${a}`:`${a*n}x${n-1>1?sup(n-1):''}`,w:[`${a*n}x${sup(n)}`,`${a}x${sup(Math.max(1,n-1))}`,`${a+n}x${sup(Math.max(1,n-1))}`,`${a*(n+1)}x${sup(n+1)}`],why:'Power rule: bring the power down, subtract one.'}}
   if(k===1){const x=R(3)+1,n=2+g;return{q:`f(x) = x${sup(n)}. What is f′(${x})?`,a:n*Math.pow(x,n-1),w:[Math.pow(x,n),n*Math.pow(x,n),Math.pow(x,n-1),n*x],why:`f′(x) = ${n}x${sup(n-1)}.`}}
   if(k===2){const a=R(6)+1;return{q:`lim x→${a} of (x² − ${a*a}) / (x − ${a}) = ?`,a:2*a,w:[a,a*a,0,'undefined'],why:'Factor: (x − a)(x + a) / (x − a) = x + a.'}}
   const a=R(4)+1,n=R(2)+1;return{q:`∫ ${a*(n+1)}x${n>1?sup(n):''} dx = ?`,a:`${a}x${sup(n+1)} + C`,w:[`${a*(n+1)}x${sup(n+1)} + C`,`${a}x${sup(n)} + C`,`${a*(n+1)*n}x${sup(Math.max(1,n-1))} + C`],why:'Add one to the power, divide by the new power.'}}},
 write:{intro:'Strong sentences do the work. Four quick ones.',q:[
   ['Which line shows instead of tells?','Her hands shook as she unfolded the letter.','She was very nervous.','She felt really, really nervous.','Nervousness was felt by her.',''],
   ['Pick the correct word: "The rain will ___ the game."','affect','effect','effort','afflict','Affect is the verb; effect is usually the noun.'],
   ['Which sentence is in the active voice?','The dog chased the ball.','The ball was chased by the dog.','The ball had been chased.','Chasing was done.',''],
   ['"Its" or "it\'s": "The house lost ___ roof."','its','it\'s','its\'','it is','It\'s always means "it is".'],
   ['The strongest verb for a sprinting runner:','bolted','went','moved','did running',''],
   ['A story\'s first line should mostly…','Make the reader want the second line','Explain the whole plot','List the characters','Describe the weather',''],
   ['Which is a cliché?','Cold as ice','The radiator ticked like a clock','Snow muffled the street','Her breath fogged the glass',''],
   ['"Their / there / they\'re": "___ late again."','They\'re','Their','There','Theyre','They\'re = they are.']]},
 mech:{intro:'Gears trade speed for force. Four problems.',gen:(g,k)=>{const T=[12,16,18,20,24,30,36,40,48,60],R=a=>a[Math.floor(rnd()*a.length)];
   if(k===3){const n=3+g,dir=rnd()<.5?'clockwise':'counterclockwise',other=dir==='clockwise'?'counterclockwise':'clockwise';return{q:`${n} gears in a row. The first turns ${dir}. Which way does the last one turn?`,a:n%2?dir:other,w:[n%2?other:dir,'It doesn\'t move','Both ways'],why:'Each mesh reverses direction.'}}
   let a=R(T),b=R(T);while(a===b)b=R(T);const rpm=R([60,90,120,180,240]);const out=Math.round(rpm*a/b*10)/10;
   return{q:`Driver gear: ${a} teeth at ${rpm} rpm. Driven gear: ${b} teeth. Output speed?`,a:out+' rpm',w:[Math.round(rpm*b/a*10)/10+' rpm',rpm+' rpm',Math.round(rpm*a/b*20)/10+' rpm'],why:`${rpm} × ${a} ÷ ${b}.`}}},
 robo:{intro:'Robots do exactly what you tell them. Nothing else. Program a route to the green pad.'},
 cs:{intro:'Computers count in ones and zeros. Four problems.',gen:(g,k)=>{const bits=4+g+(k>1?1:0),v=1+Math.floor(rnd()*(Math.pow(2,bits)-1));
   if(k===0)return{q:`Binary ${v.toString(2).padStart(bits,'0')} in decimal is…`,a:v,w:[v+1,v-1>0?v-1:v+2,v*2],why:'Each place is a power of two.'};
   if(k===1)return{q:`Decimal ${v} in binary is…`,a:v.toString(2),w:[(v+1).toString(2),(v^1).toString(2),(v>>1).toString(2)].map(x=>x===v.toString(2)?(v+2).toString(2):x),why:''};
   if(k===2&&g>=1){const h=16+Math.floor(rnd()*230);return{q:`Hex 0x${h.toString(16).toUpperCase()} in decimal is…`,a:h,w:[h+16,h-16,h+1],why:'Sixteens and ones.'}}
   const n=3+Math.floor(rnd()*(5+g*3));return{q:`total = 0; for i from 1 to ${n}: total = total + i. What is total?`,a:n*(n+1)/2,w:[n*n,n*(n-1)/2,n+1],why:`1 + 2 + … + ${n}.`}}},
 mkt:{intro:'Marketing is knowing who you\'re talking to. Four questions.',q:[
   ['The four Ps of marketing are product, price, place and…','Promotion','Profit','People','Packaging',''],
   ['Selling the same burger for $5 at lunch and $8 at a stadium is about…','Place and price','Product quality','Packaging','Patents',''],
   ['A "target market" is…','The specific group you design the campaign for','Everyone','Your competitors','Your shareholders',''],
   ['Free samples at a grocery store mainly aim to…','Get people to try it with no risk','Get rid of old stock','Collect taxes','Train staff',''],
   ['A brand\'s "positioning" is…','The place it holds in customers\' minds','Where the logo sits','Its shelf height','Its stock price',''],
   ['Which is the best ad for college students?','"Late-night delivery, 20% off with a student ID"','"Retirement plans for every budget"','"Luxury yachts, financing available"','"New minivans in stock"',''],
   ['A "call to action" is…','The part that tells people exactly what to do next','A phone call to a customer','A legal notice','A slogan',''],
   ['Word of mouth works because people trust…','Their friends more than ads','Billboards','Pop-up ads','Small print','']]},
 music:{intro:'Feel the pulse. Tap with the metronome, on every beat.',bpm:[92,100,108],n:16,win:[150,120,95],metro:1,act:'Tap',how:'16 taps on the beat (button or Space)'},
 trial:{intro:'Listen to the question, then make the right objection. Four rounds.',q:(()=>{const O=['Hearsay','Leading','Relevance','Speculation'],S_=[
   ['"My cousin told me he saw the defendant there."','Hearsay','Repeating what someone else said, for its truth.'],['"The neighbour said she heard a gunshot."','Hearsay',''],
   ['"You were at the bar at 11 PM, weren\'t you?" (asked of their own witness)','Leading','On direct, the question suggests the answer.'],['"Isn\'t it true the light was red?" (on direct examination)','Leading',''],
   ['"What is your favourite movie?"','Relevance','Nothing to do with the case.'],['"How much did your house cost?" (in a parking-ticket case)','Relevance',''],
   ['"What do you think the defendant was planning?"','Speculation','The witness can\'t know someone else\'s mind.'],['"Why do you suppose he ran?"','Speculation','']];
   return S_.map(([q,a,w])=>[q,a,...O.filter(x=>x!==a),w])})()},
 cj:{intro:'Know the system. Sort each offence: infraction, misdemeanour or felony.',bins:['Infraction','Misdemeanor','Felony'],items:[
   ['Jaywalking','Infraction','A ticket, not a crime record.'],['Parking at an expired meter','Infraction',''],['Speeding 10 over','Infraction',''],['Littering (first time)','Infraction',''],
   ['Shoplifting a $20 shirt','Misdemeanor','Petty theft.'],['Underage drinking','Misdemeanor',''],['Trespassing','Misdemeanor',''],['Vandalism under $1,000','Misdemeanor',''],['Disorderly conduct','Misdemeanor',''],
   ['Armed robbery','Felony',''],['Burglary','Felony',''],['Arson','Felony',''],['Selling cocaine','Felony','Possession with intent to sell is a felony.'],['Kidnapping','Felony','']]},
 smed:{intro:'Hands-only CPR. Push hard and fast in the centre of the chest: 100 to 120 compressions a minute. No metronome, keep the rhythm yourself.',bpm:[110,110,110],n:21,win:[140,100,70],metro:0,act:'Compress',how:'21 compressions at 100 to 120 a minute'},
 psych:{intro:'Short-term memory holds about seven things. Let\'s see yours. Watch the squares, then repeat the sequence.'}};
const MGF={quiz:mgQuiz,math:mgMath,sort:mgSort,memory:mgMemory,meter:mgMeter,rhythm:mgRhythm,grid:mgGrid};

// ---------------------------------------------------------------- the Skill Tree
// fx keys: study (that college's classes count as studied), xp, disc (shop discount), dmg (punch damage), def (damage taken), sta (stamina regen),
// spd (run speed), hp (max HP, once), rep (reputation gains), heat (police heat gains), bust (talk your way out), talk, spirit, stand, pay ($ every Monday)
/* V310 every college's tree has the same branching shape (x = column 0..2, y = row), so you choose a path:
   root -> three branches -> a hub any branch can reach -> two upper skills -> a capstone that needs two of its three parents.
   r = parents (ANY one of them unlocks it), need = how many parents it needs (default 1). Costs total 20; small colleges can't buy everything. */
const SKSHAPE=[[1,0,1,[]],[0,1,1,[0]],[1,1,1,[0]],[2,1,1,[0]],[0,2,2,[1]],[2,2,2,[3]],[1,3,2,[2,4,5]],[0,4,3,[4,6]],[2,4,3,[5,6]],[1,5,4,[6,7,8],2]];
function skMake(col,L){return L.map((q,i)=>{const[x,y,c,r,need]=SKSHAPE[i];return{id:col+i,x,y,c,r:r.map(k=>col+k),need:need||1,ic:q[0],n:q[1],d:q[2],fx:q[3]}})}
const SKT={
 design:skMake('design',[['✏️','Studio Habits','DAAP classes count as studied: easier to pass.',{study:1}],['🎨','Color Theory','+5% XP from everything.',{xp:.05}],['📐','Drafting','Shops are 4% cheaper.',{disc:.04}],['🪧','Poster Design','Standing with the brothers grows 10% faster.',{stand:.1}],
   ['🖼️','Visual Thinker','+8% XP from everything.',{xp:.08}],['📣','Branding','Reputation gains are 10% bigger.',{rep:.1}],['🎭','Set Builder','Class Spirit gains are 15% bigger.',{spirit:.15}],['💼','Portfolio','Design commissions pay $20 every Monday.',{pay:20}],['🏷️','Bargain Eye','Shops are another 6% cheaper.',{disc:.06}],['🏛️','Masterwork','$35 every Monday and +7% XP.',{pay:35,xp:.07}]]),
 as:skMake('as',[['🔬','Lab Safety','Arts & Sciences classes count as studied.',{study:1}],['🧲','Applied Physics','Punches hit 5% harder.',{dmg:.05}],['🌿','Field Work','Stamina recovers 12% faster.',{sta:.12}],['📊','Statistics','+6% XP from everything.',{xp:.06}],
   ['🦴','Anatomy','+10 max health.',{hp:10}],['🧮','Calculus','+8% XP from everything.',{xp:.08}],['🧪','Scientific Method','Take 6% less damage.',{def:.06}],['💥','Momentum','Punches hit 8% harder.',{dmg:.08}],['🏃','Endurance','Stamina recovers 15% faster.',{sta:.15}],['🧬','Grand Theory','+20 max health, take 6% less damage.',{hp:20,def:.06}]]),
 eng:skMake('eng',[['⚙️','Problem Sets','Engineering classes count as studied.',{study:1}],['🔧','Leverage','Punches hit 6% harder.',{dmg:.06}],['⚡','Efficiency','Run 4% faster.',{spd:.04}],['🛡️','Safety Factor','Take 5% less damage.',{def:.05}],
   ['🔩','Torque','Punches hit 7% harder.',{dmg:.07}],['🧱','Load Bearing','Take 6% less damage.',{def:.06}],['🔋','Power Supply','Stamina recovers 12% faster.',{sta:.12}],['🏎️','Aerodynamics','Run 5% faster.',{spd:.05}],['🦾','Reinforced Frame','+15 max health.',{hp:15}],['🤖','Prototype','Punches hit 10% harder, take 6% less damage.',{dmg:.1,def:.06}]]),
 bus:skMake('bus',[['💼','Case Studies','Business classes count as studied.',{study:1}],['🛒','Bulk Buyer','Shops are 4% cheaper.',{disc:.04}],['🤝','Networking','Reputation gains are 10% bigger.',{rep:.1}],['📈','Side Hustle','$10 every Monday.',{pay:10}],
   ['🧾','Coupons','Shops are another 5% cheaper.',{disc:.05}],['🏦','Interest','Another $15 every Monday.',{pay:15}],['🗣️','The Pitch','Conversations go your way more often.',{talk:.06}],['🌐','Connections','Reputation gains are 15% bigger.',{rep:.15}],['💰','Dividends','Another $20 every Monday.',{pay:20}],['🏢','Corner Office','Shops 6% cheaper and $25 every Monday.',{disc:.06,pay:25}]]),
 ccm:skMake('ccm',[['🎭','Rehearsal','CCM classes count as studied.',{study:1}],['🎤','Stage Presence','Conversations go your way more often.',{talk:.05}],['🥁','Crowd Work','Class Spirit gains are 15% bigger.',{spirit:.15}],['⭐','Charisma','Standing with the brothers grows 10% faster.',{stand:.1}],
   ['🎙️','Projection','Conversations go your way even more often.',{talk:.06}],['🎬','Leading Man','Standing grows another 12% faster.',{stand:.12}],['📯','Encore','Reputation gains are 10% bigger.',{rep:.1}],['🎺','Showstopper','Class Spirit gains are 20% bigger.',{spirit:.2}],['🎻','Practice Room','+6% XP from everything.',{xp:.06}],['🌟','Star Power','Talk your way through more, standing grows 15% faster.',{talk:.08,stand:.15}]]),
 law:skMake('law',[['⚖️','Case Briefs','Law & Justice classes count as studied.',{study:1}],['🪪','Know Your Rights','Police heat builds 15% slower.',{heat:.15}],['📜','Plea Deal','+8% chance to talk your way out of a bust.',{bust:.08}],['🗨️','Cross-Examination','Conversations go your way more often.',{talk:.05}],
   ['🕶️','Low Profile','Police heat builds another 15% slower.',{heat:.15}],['📁','Precedent','+10% chance to talk your way out of a bust.',{bust:.1}],['🛡️','Self-Defense','Take 5% less damage.',{def:.05}],['🚔','Clean Record','Police heat builds another 20% slower.',{heat:.2}],['🧑‍⚖️','Objection!','+12% chance to talk your way out of a bust.',{bust:.12}],['🏛️','Supreme Court','+10% bust escape, heat 15% slower.',{bust:.1,heat:.15}]]),
 health:skMake('health',[['🩺','Rounds','Health classes count as studied.',{study:1}],['💪','Conditioning','+10 max health.',{hp:10}],['🫁','Cardio','Stamina recovers 12% faster.',{sta:.12}],['🧘','Composure','Take 5% less damage.',{def:.05}],
   ['🍎','Nutrition','+10 max health.',{hp:10}],['👟','Agility','Run 4% faster.',{spd:.04}],['❤️‍🩹','Recovery','Stamina recovers 15% faster.',{sta:.15}],['🏋️','Strength Block','+15 max health.',{hp:15}],['🦺','Iron Constitution','Take 7% less damage.',{def:.07}],['🏥','Chief Resident','+20 max health, take 6% less damage.',{hp:20,def:.06}]])};
const skOn=id=>!!(S.sk&&S.sk[id]);
const skReady=n=>!n.r.length||n.r.filter(skOn).length>=Math.min(n.need||1,n.r.length);
function skv(k){let v=0;if(!S.sk)return 0;for(const col in SKT)for(const n of SKT[col])if(S.sk[n.id]&&typeof n.fx[k]==='number'&&k!=='study')v+=n.fx[k];return v}
function skStudy(col){return!!(SKT[col]&&SKT[col].some(n=>n.fx.study&&skOn(n.id)))}
function skEarned(col){return(S.sp&&S.sp[col])||0}
function skSpent(col){return(SKT[col]||[]).reduce((a,n)=>a+(skOn(n.id)?n.c:0),0)}
function skFree(col){return skEarned(col)-skSpent(col)}
function skTotalFree(){return Object.keys(COLL).reduce((a,k)=>a+Math.max(0,skFree(k)),0)}
/* old saves: points for every grade star earned before skill points existed */
function skMig(){if(S.spMig)return;S.sp=S.sp||{};S.sk=S.sk||{};for(const c of CLS){const col=CI[c].col;if(col)S.sp[col]=(S.sp[col]||0)+((S.grades&&S.grades[c])||0)}S.spMig=1}
function skGain(col,n=1){skMig();S.sp[col]=(S.sp[col]||0)+n}
function skLearn(col,id){const n=(SKT[col]||[]).find(n=>n.id===id);if(!n||skOn(id))return;if(!skReady(n)){toast(n.need>1?`Learn ${n.need} of the skills linked below it first.`:'Learn a skill linked below it first.');sfx('bad');return}
  if(skFree(col)<n.c){toast(`You need ${n.c} ${COLL[col].n} point${n.c>1?'s':''}. Pass more ${COLL[col].n} classes.`);sfx('bad');return}
  S.sk[id]=1;if(n.fx.hp){S.mhp+=n.fx.hp;S.hp=Math.min(S.mhp,S.hp+n.fx.hp)}sfx('lvl');toast(`Learned: ${n.n}. ${n.d}`,4200);try{saveGame()}catch(e){}renderPlanner('skills');setTimeout(()=>{const b=document.querySelector(`.skhex[data-sk="${id}"]`);if(b)b.click()},0)}
function skillsPage(){skMig();const HX=64,HY=58,PX=26,PY=34,CW=PX*2+HX*3+52;   /* V310 hex grid: three columns, six rows per college */
  const pos=n=>[PX+n.x*(HX+26)+HX/2,PY+(5-n.y)*(HY+22)+HY/2],H=PY*2+6*(HY+22)-22;
  let h=`<div class="skhead"><h2>Skill Tree</h2><p>Pass classes to earn a college's points. Trees grow from the bottom up and branch: pick your path. The top skill needs two of the three below it. Click a skill for details.</p></div><div class="skwrap"><div class="sktree">`;
  for(const col in COLL){const C=COLL[col],cls=CLS.filter(c=>CI[c].col===col),free=skFree(col),T=SKT[col];
    let svg=`<svg class="sklinks" width="${CW}" height="${H}" viewBox="0 0 ${CW} ${H}">`;
    for(const n of T)for(const r of n.r){const m=T.find(x=>x.id===r),[x1,y1]=pos(n),[x2,y2]=pos(m),on=skOn(n.id)&&skOn(r);svg+=`<path d="M${x2} ${y2}V${(y1+y2)/2}H${x1}V${y1}" class="${on?'on':skOn(r)?'half':''}"/>`}
    svg+='</svg>';
    h+=`<div class="skcol" style="--skc:${C.c};width:${CW}px"><div class="skemb"><span>${C.ic}</span></div><div class="skname">${C.n}</div><div class="sksub">${C.full}</div>
      <div class="skpts"><b>${free}</b> point${free===1?'':'s'} to spend · ${skEarned(col)} earned</div>
      <div class="skgrid" style="height:${H}px">${svg}`;
    for(const n of T){const own=skOn(n.id),ready=!own&&skReady(n),can=ready&&free>=n.c,[x,y]=pos(n);
      h+=`<button class="skhex${own?' own':can?' can':ready?' ready':' locked'}" style="left:${x-HX/2}px;top:${y-HY/2}px" data-col="${col}" data-sk="${n.id}" title="${n.n}: ${n.d}"><span class="ski">${n.ic}</span><span class="skc">${own?'✓':n.c}</span></button>`}
    h+=`</div><div class="skclasses">${cls.map(c=>`<span title="${CI[c].bn}">${CI[c].n} <em>${'★'.repeat(S.grades[c]||0)}${'☆'.repeat(3-(S.grades[c]||0))}</em></span>`).join('')}</div></div>`}
  return h+`</div></div><div class="skinfo" id="skinfo" hidden></div>`}
function skInfo(col,id){const n=SKT[col].find(x=>x.id===id),own=skOn(id),ready=skReady(n),free=skFree(col),T=SKT[col],par=n.r.map(r=>T.find(x=>x.id===r).n);
  const el=$('skinfo');if(!el)return;el.hidden=false;el.style.setProperty('--skc',COLL[col].c);
  el.innerHTML=`<span class="ski">${n.ic}</span><div><b>${n.n}</b> <small>${COLL[col].n} · ${n.c} point${n.c>1?'s':''}</small><div>${n.d}</div><small>${own?'Learned.':!par.length?'The first skill of the tree.':(n.need>1?`Needs ${n.need} of: `:'Needs any of: ')+par.join(', ')}</small></div>${own?'':`<button class="btn" id="sklearn" ${ready&&free>=n.c?'':'disabled'}>${!ready?'Locked':free<n.c?`Need ${n.c-free} more point${n.c-free>1?'s':''}`:'Learn'}</button>`}`;
  const b=$('sklearn');if(b)b.onclick=()=>{skLearn(col,id);skInfo(col,id)}}
function skWire(p){const pl=$('planner');if(pl)pl.classList.add('skdark');for(const b of p.querySelectorAll('.skhex'))b.onclick=()=>{sfx('ui');for(const x of p.querySelectorAll('.skhex.sel'))x.classList.remove('sel');b.classList.add('sel');skInfo(b.dataset.col,b.dataset.sk)}}
