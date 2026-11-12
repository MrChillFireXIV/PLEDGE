// ================================================================ PLANNER
const TABS=[['tasks','Tasks'],['roster','Pledge Class','pl'],['classes','Classes','cls'],['cliques','Cliques','clq'],['map','Map','map'],['people','People'],['yearbook','Yearbook'],['controls','Controls']];
// ================================================================ V76 SETTINGS tab in the Planner, and quitting back to the title screen
const SET=(()=>{const g=(k,d)=>{try{const v=localStorage.getItem('pledge.'+k);return v==null?d:+v}catch(e){return d}};return{vol:g('vol',.55),sfx:g('sfx',1),mus:g('mus',.4),musOn:g('musOn',1),sens:g('sens',1),inv:g('inv',0),terr:g('terr',1),cam:g('cam2',5)}})();
const setSave=(k,v)=>{SET[k]=v;try{localStorage.setItem('pledge.'+k,String(v))}catch(e){}};
camTarget=camT=clamp(SET.cam,3.5,13);
function setApplyVol(){if(MST)MST.gain.value=SET.vol;if(MGN)MGN.gain.value=SET.sfx;try{MUS.cur=-1}catch(e){}}
function quitToTitle(save){if(save)saveGame();SAVEBLOCK=1;/* V284 nothing may write the save while the title screen is up: a cutscene or timer still running from before the quit used to save the spot after 'Quit without saving' */
  $('planner').hidden=true;if(WH)closeWheel();$('card').hidden=true;cardQ=[];endScene();document.body.classList.remove('cine');
  if(EV){EV=null;$('evhud').hidden=true;NP.filter(n=>n.evTemp).forEach(despawn);kartGates.forEach(g=>g.visible=false)}
  if(AM){(AM.temps||[]).forEach(despawn);AM=null}clearActors();CINE=null;$('cineskip').hidden=true;if(P.med)toggleMed();
  P.kart=0;kartM.visible=false;P.bike=0;S.carry=null;P.vx=P.vz=0;if(P.inside){P.inside=null;showInt(null)}NP.forEach(n=>{n.chase=0;if(!n.temp){n.aggro=0;n.tgt=null}});
  $('hud').hidden=true;$('touch').hidden=true;$('prompt').hidden=true;$('toast').textContent='';K={};mode='title';$('title').hidden=false;unlock();setTimeout(()=>$('bnew').focus(),40)}
function setPage(){const seg=(id,opts,cur)=>`<div class="seg" data-s="${id}">${opts.map(([v,l])=>`<button data-v="${v}"${String(v)===String(cur)?' class="on"':''}>${l}</button>`).join('')}</div>`;
  const rng=(id,min,max,st,v,lab)=>`<div class="rng"><input type="range" id="st_${id}" min="${min}" max="${max}" step="${st}" value="${v}"><span id="sv_${id}">${lab}</span></div>`;
  return`<h2>Settings</h2>
  <h3>Graphics</h3><div class="setg">
   <label>Look</label>${seg('gfx',[['enhanced','Enhanced'],['classic','Classic']],GFX)}<small>Changing this reloads the game. Progress since your last save is lost.</small>
   <label>Resolution</label>${seg('gq',QL.map((q,i)=>[i,q[0]]),GQ)}
   <label>Shadows</label>${seg('sh',[[1,'On'],[0,'Off']],sun.castShadow?1:0)}
   <label>Performance stats</label>${seg('fps',[[0,'Show'],[1,'Hide']],FPSMIN?1:0)}</div>
  <h3>Sound &amp; camera</h3><div class="setg">
   <label>Master volume</label>${rng('vol',0,1,.05,SET.vol,Math.round(SET.vol*100)+'%')}
   <label>Music</label>${seg('musOn',[[1,'On'],[0,'Off']],SET.musOn?1:0)}
   <label>Music volume</label>${rng('mus',0,1,.05,SET.mus,Math.round(SET.mus*100)+'%')}
   <label>Sound effects</label>${rng('sfx',0,1,.05,SET.sfx,Math.round(SET.sfx*100)+'%')}
   <label>Mouse sensitivity</label>${rng('sens',.4,2.2,.1,SET.sens,SET.sens.toFixed(1)+'×')}
   <label>Invert look up/down</label>${seg('inv',[[0,'Off'],[1,'On']],SET.inv)}
   ${turfUnlocked()?`<label>Frat turf on the map</label>${seg('terr',[[1,'Show'],[0,'Hide']],SET.terr)}`:''}
   <label>Camera distance</label>${rng('cam',3.5,13,.5,camTarget,camTarget.toFixed(1)+' m')}</div>
   <p>Music: “Fluffing a Duck” by Kevin MacLeod (incompetech.com), licensed under CC BY 4.0. It plays during gameplay and fades out for cutscenes.</p>
  ${saveSection()}
  <h3>Quit</h3><p>The game saves on its own when you sleep in your bunk at the ΑΣΡ house. Saving here keeps your day, money, grades and friendships; a task you're partway through starts over when you continue, back at the house.</p>
  <div class="setq" id="setq"><button class="btn" id="qsave">Save and quit to title</button><button class="btn ghost" id="qnos">Quit without saving</button></div>`}
function setWire(p){p.querySelectorAll('.seg').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{const id=g.dataset.s,v=b.dataset.v;sfx('ui');
    if(id==='gfx'){if(v===GFX)return;GFXSAVE(v);g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));const sm=g.parentNode.querySelector('small');if(sm)sm.textContent='Switching to '+(v==='enhanced'?'Enhanced':'Classic')+'… reloading now.';toast('Graphics: '+(v==='enhanced'?'Enhanced':'Classic')+' (reloading…)',1500);setTimeout(()=>{try{location.reload()}catch(e){location.href=location.href.split('#')[0]+'#gfx='+v}},500);return}
    if(id==='gq'){GQ=+v;R.setPixelRatio(QL[GQ][1])}else if(id==='sh'){sun.castShadow=v==='1';R.shadowMap.needsUpdate=true}else if(id==='fps')setFpsMin(v==='1');else if(id==='inv')setSave('inv',+v);else if(id==='terr')setSave('terr',+v);else if(id==='musOn'){setSave('musOn',+v);audioInit();setApplyVol()}
    g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))}));
  const R_=(id,f)=>{const e=$('st_'+id);if(e)e.oninput=()=>{const v=+e.value;$('sv_'+id).textContent=f(v)}};
  R_('vol',v=>{setSave('vol',v);setApplyVol();return Math.round(v*100)+'%'});R_('mus',v=>{setSave('mus',v);setApplyVol();return Math.round(v*100)+'%'});R_('sfx',v=>{setSave('sfx',v);setApplyVol();return Math.round(v*100)+'%'});R_('sens',v=>{setSave('sens',v);return v.toFixed(1)+'×'});R_('cam',v=>{camTarget=v;setSave('cam2',v);return v.toFixed(1)+' m'});
  $('st_vol').onchange=()=>{audioInit();setApplyVol();sfx('coin')};$('st_sfx').onchange=()=>{audioInit();setApplyVol();sfx('coin')};$('st_mus').onchange=()=>{audioInit();setApplyVol()};
  saveWire();
  $('qsave').onclick=()=>{sfx('ui');quitToTitle(1)};
  $('qnos').onclick=()=>{sfx('ui');const q=$('setq');q.innerHTML=`<span class="qw">Quit without saving? Everything since your last save is lost.</span><button class="btn danger" id="qyes">Quit</button><button class="btn ghost" id="qback">Cancel</button>`;$('qyes').onclick=()=>quitToTitle(0);$('qback').onclick=()=>renderPlanner('settings')}}
TABS.push(['skills','Skill Tree','cls']);TABS.push(['settings','Settings']);TABS.push(['bug','Report a Bug']);   // V190 its own page in the menu

const tabsNow=()=>TABS.filter(t=>!t[2]||tabOn(t[2]));
function openPlanner(tab){if(mode!=='play')return;if(tab==='map'&&!tabOn('map')){toast('You don\'t have a campus map yet.',2600);tab='tasks'}mode='planner';unlock();$('planner').hidden=false;renderPlanner(tab||'tasks')}
function closePlanner(){$('planner').hidden=true;mode='play';turfNoteClosed()}
function renderPlanner(tab){if(!tabsNow().some(t=>t[0]===tab))tab='tasks';{const pl=$('planner');if(pl)pl.classList.remove('bugdev','skdark')}if(tab==='map')S.mapHint=0;if(tab!=='map')turfNoteHide();const nt=$('ntabs');nt.innerHTML='';tabsNow().forEach(([k,l])=>{const b=document.createElement('button');b.textContent=l;if(k===tab)b.className='on';b.onclick=()=>{if(k==='bug'&&bugDevTap())return;renderPlanner(k)};nt.appendChild(b)});   /* V302 3 fast clicks on Report a Bug: developer mode */const x=document.createElement('button');x.className='x';x.textContent='Close (Tab)';x.onclick=closePlanner;nt.appendChild(x);
  const p=$('npage');$('planner').querySelector('.note').classList.toggle('big',tab==='map');$('planner').querySelector('.note').classList.toggle('tall',tab!=='map');if(tab!=='map')setTimeout(()=>{fitNote();if(tab==='skills')skFit()},0);const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));let h='';
  if(tab==='tasks'){h=`<h2>Chapter ${Math.min(S.ch,4)}: ${CHN[Math.min(S.ch,5)]}</h2><p>Day ${S.day}, ${DAYN[(S.day-1)%7]} · ${fmtT(S.gt)} · Big Brother: <b>${S.bb?BBN[S.bb][0]:'none yet'}</b> · House standing: <b>${S.standing}</b></p>`;
    const st=curStep();if(AM)h+=`<h3>In progress</h3><p><b>★ ${esc(AM.m.name)}</b><br>${esc(st&&st.label||'')}</p>`;
    const av=availM();h+=`<h3>Available tasks</h3>`+(av.length?'<ul>'+av.map(m=>`<li><b>${esc(m.name)}</b> — ${mWho(m)&&NN[mWho(m)]?'talk to '+NN[mWho(m)].name:(m.side?'blue':'gold')+' star on your map'}${m.when?` (${fmtH(m.when[0])}–${fmtH(m.when[1])})`:''}</li>`).join('')+'</ul>':`<p>${AM?'Finish your current task first.':S.ch>10?'The story is over. Campus is yours.':'Nothing new right now.'}</p>`);
    const dn=M.filter(m=>S.done[m.id]&&!m.auto);if(dn.length)h+=`<h3>Done</h3><p>${dn.map(m=>esc(m.name)).join(' · ')}</p>`;
    h+=`<h3>What you know</h3><p>Clues: <b>${S.clue}</b> · Evidence: <b>${S.ev}</b>${S.ally?' · You have an ally in the house':''}${S.lena?' · Lena Reyes trusts you':''}${S.deanDeal?' · You have a deal with the Dean':''}</p>`;
    const qi=Object.keys(S.items);h+=`<h3>Carrying</h3><p>${qi.length?qi.map(k=>QI[k]).join(', '):'Nothing important.'}${S.carry?' · The bronze ram':''}</p>`}
  else if(tab==='roster'){const sp=S.spirit,gar=NP.find(n=>n.gargoyle&&(n.title||'').indexOf('ΑΣΡ')===0);h=`<h2>Pledge Class · Fall Semester</h2><p>Alpha Sigma Rho. ${PCLASS.length+1+(gar?1:0)} pledges who eat together, get punished together and fight together. Pledges nearby jump into your fights. Get busted and the whole class pays for it.</p><div class="rep"><span>Class Spirit</span><div class="rbar"><b style="left:0;width:${sp}%;background:${sp>=60?'#4f9a5a':sp>=35?'#d8a040':'#c0392b'}"></b></div><span>${sp}/100</span></div><p><b>Roll call:</b> every night 6–7 PM on the ΑΣΡ front lawn. Stand in the line to answer. ${S.rcDone===S.day?'Done today.':S.gt<18?'Tonight at 6 PM.':S.gt<19?'Happening NOW.':'Missed today.'}</p>${prRosterHTML()}<div class="grid2">`+(S.pledged&&S.prole?[]:[['you','Danny Kowalski','legacy',S.lvl,null]]).concat(PCLASS.map(k=>{const n=NN[k];return[k,n.name,n.prole,n.lvl,n]})).map(([k,nm,r,lv,n])=>{const rv=n?relPeek(n):null;return`<div class="cls"><b>${nm}${k==='you'?' (you)':''}</b> · Lv ${lv}<div style="font-weight:700;color:#7d1f2c">${PROLE[r][0]}</div><div>${PROLE[r][1]}</div>${n?`<div style="opacity:.75">${relLabel(rv,n)} (${rv>0?'+':''}${rv})${n.follow?' · with you':''}</div>`:''}</div>`}).join('')+(gar?`<div class="cls"><b>${gar.name}</b> · Lv ${gar.lvl}<div style="font-weight:700;color:#7d1f2c">Gargoyle Pledge</div><div>Stone-grey, crouched on a chair outside the house like Spider-Man. Never moves, never blinks. Watches the street.</div></div>`:'')+'</div>'}
  else if(tab==='cliques'){const known=Object.keys(S.rel||{}).filter(k=>NN[k]).map(k=>[NN[k].name,S.rel[k]]).sort((a,b)=>b[1]-a[1]);const lab=v=>v<=-50?'Hostile':v<=-25?'Wary of you':v<25?'Neutral':v<50?'Friendly':'Loyal';h=`<h2>Cliques</h2><p>Below −25, members may start fights with you on sight. At 50 or above, they greet you and jump into your fights.</p>`+CLQ.map(c=>{const v=S.rep[c],w=Math.abs(v)/2;return`<div class="rep"><span>${CL[c].n}</span><div class="rbar"><b style="left:${v<0?50-w:50}%;width:${w}%;background:${v<0?'#c0392b':'#4f9a5a'}"></b></div><span>${v>0?'+':''}${v} · ${lab(v)}</span></div>`}).join('')+`<div class="rep"><span>ΑΣΡ standing</span><div class="rbar"><b style="left:${S.standing<0?50-Math.abs(S.standing)/2:50}%;width:${Math.abs(S.standing)/2}%;background:#7d1f2c"></b></div><span>${S.standing}</span></div>${c1FratRows()}
    <h3>People you know</h3>${known.length?known.map(([nm,v])=>`<div class="rep"><span>${nm}</span><div class="rbar"><b style="left:${v<0?50-Math.abs(v)/2:50}%;width:${Math.abs(v)/2}%;background:${v<0?'#c0392b':'#4f9a5a'}"></b></div><span>${v>0?'+':''}${v} · ${relLabel(v)}</span></div>`).join(''):'<p>Talk to people to build relationships. Chat is −1 to +2, compliments −5 to +5, insults −5, fights −15. The more someone likes you, the better your odds.</p>'}<h3>Where they hang out</h3><ul><li><b>Legacies:</b> Kappa Theta Omega and the lake district</li><li><b>Athletes:</b> Nippert Stadium and the Rec Center</li><li><b>Student Gov:</b> the quad and Tangeman University Center</li><li><b>Activists:</b> the quad and downtown</li><li><b>Townies:</b> downtown, especially the Rusty Anchor</li><li><b>Sororities:</b> Greek Row and the quad</li></ul>`}
  else if(tab==='classes'){const sl=classWindow();h=`<h2>Classes</h2><p>Monday to Friday, 9:00 AM and 1:00 PM. Four classes meet in each slot: pick one and get to its building within 30 minutes of the start. Every class you pass earns a skill point for its college (see the Skill Tree tab).</p>`;
    const row=(d,s_)=>classesAt(d,s_).map(c=>`<span class="clsp${S.att[d+'-'+s_]?' done':''}" style="--skc:${COLL[CI[c].col].c}">${CI[c].n} <small>${CI[c].bn}</small></span>`).join('');
    if(S.day>=2){const d=S.day;h+=`<h3>Today · ${DAYN[(d-1)%7]}</h3>${clsDay(d)?`<p><b>9:00 AM</b>${S.att[d+'-0']?' ✓ attended':''}</p><div class="clsrow">${row(d,0)}</div><p><b>1:00 PM</b>${S.att[d+'-1']?' ✓ attended':''}</p><div class="clsrow">${row(d,1)}</div>`:'<p>No classes on weekends.</p>'}`}else h+='<h3>Today</h3><p>Move-in day. Classes start tomorrow.</p>';
    for(const col in COLL){const C=COLL[col],cl=CLS.filter(c=>CI[c].col===col);h+=`<h3 style="color:${C.c}">${C.ic} ${C.n} <small style="opacity:.7">· ${skFree(col)} skill point${skFree(col)===1?'':'s'} to spend</small></h3><div class="grid2">`+cl.map(c=>`<div class="cls"><b>${CI[c].n}</b> · ${CI[c].bn}<div class="stars">${'★'.repeat(S.grades[c]||0)}${'☆'.repeat(3-(S.grades[c]||0))}</div><div style="font-size:13px;opacity:.75">${CI[c].prof} · meets ${nextMeet(c)}</div>${(CI[c].perk||[]).map((t,i)=>`<div style="opacity:${i<S.grades[c]?1:.45}">${i<S.grades[c]?'✓':'○'} ${t}</div>`).join('')}</div>`).join('')+'</div>'}}
  else if(tab==='skills')h=skillsPage();
  else if(tab==='map'){h=`<h2>Campus Map</h2><div id="maproute" hidden></div><div class="ntabs" style="padding:0;background:none;border:0;margin:6px 0"><button data-mt="campus" class="${MAPTAB==='campus'?'on':''}">Campus</button><button data-mt="lake" class="${MAPTAB==='lake'?'on':''}">Lake District${S.ch<3?' 🔒':''}</button>${MAPTAB==='lake'||!turfUnlocked()?'':`<button id="terrbtn" class="${SET.terr?'on':''}" style="margin-left:auto" title="Show or hide the fraternity territories">Frat Turf: ${SET.terr?'On':'Off'}</button>`}</div><div class="mapwrap"><canvas id="fullmap" width="900" height="750"></canvas></div>`}
  else if(tab==='yearbook'){const n=Object.keys(S.photos).length;h=`<h2>Yearbook · ${n} of ${PHOTOS.length}</h2><p>Find the landmarks and press E to take a photo. Every ten photos pays $10, halfway pays $25, and all ${PHOTOS.length} pays $${S.grades.art>=3?150:100}.${S.grades.art>=1?'':' Pass Art History to see the spots on your map.'}</p>`+PHOTOCATS.map(([cn,ic,keys])=>{const L=PHOTOS.filter(p=>keys.includes(p[0])),g=L.filter(p=>S.photos[p[0]]).length;return `<h3 class="pcat">${ic} ${cn} <span>${g}/${L.length}${g===L.length?' ✓':''}</span></h3><div class="polas">`+L.map(p=>{const i=PHOTOS.indexOf(p);return `<div class="pola ${S.photos[p[0]]?'got':''}" style="--r:${(i%3-1)*1.6}deg">${S.pimg&&S.pimg[p[0]]?`<img src="${S.pimg[p[0]]}" alt="">`:`<div>${S.photos[p[0]]?'✓':'?'}</div>`}${S.photos[p[0]]||S.grades.art>=2?p[1]:'???'}</div>`}).join('')+'</div>'}).join('')}
  else if(tab==='people'){const seen=new Set(),L=[];for(const n of NP){if(n.temp||n.actor||n.evTemp)continue;const k=relKey(n);if(seen.has(k))continue;seen.add(k);if(!(S.rel&&S.rel[k]!=null))continue;L.push({n,v:relPeek(n)})}
    L.sort((a,b)=>b.v-a.v);const row=({n,v})=>{const w=Math.abs(v)/2;return `<div class="rep"><span>${esc(n.name)}<br><small>${esc(n.title||CL[n.cl].n)} · Lv ${n.lvl}</small></span><div class="rbar"><b style="left:${v<0?50-w:50}%;width:${w}%;background:${v<0?'#c0392b':'#4f9a5a'}"></b></div><span>${relLabel(v,n)} ${v>0?'+':''}${v}</span></div>`};
    h=`<h2>Relationships</h2><p>Everyone you've talked to, from your closest friends to people who can't stand you. Good Friends at your level or higher can follow you; Best Friends barely flinch at an insult.</p>`;
    if(!L.length)h+='<p>You haven\'t gotten to know anyone yet. Walk up to someone and press E (or Act) to talk.</p>';
    else{const top=L.filter(a=>a.v>0).slice(0,3),bot=L.filter(a=>a.v<0).slice(-3).reverse();h+=`<h3>Top 3</h3>`+(top.length?top.map(row).join(''):'<p>No friends yet. Chat and compliment people to build them up.</p>')+`<h3>Bottom 3</h3>`+(bot.length?bot.map(row).join(''):'<p>Nobody dislikes you yet. Keep it that way, or don\'t.</p>')+`<h3>Everyone (${L.length})</h3>`+L.map(row).join('')}}
  else{h=`<h2>Controls</h2><div class="keys"><kbd>W A S D</kbd><span>Move (arrow keys turn the camera)</span><kbd>Mouse</kbd><span>Left click punches and captures the mouse; then move to look. Hold the right button (or R) to block; without capture, right-dragging also looks around. Scroll to zoom.</span><kbd>Shift</kbd><span>Sprint (uses stamina)</span><kbd>F / Left click</kbd><span>Punch. Three quick hits make a combo.</span><kbd>R / Right click (hold)</kbd><span>Block. Cross your arms in front of you. Each hit you block drains stamina instead of health; with no stamina left the block fails.</span><kbd>T</kbd><span>Your pledge job's special move (once you've pledged)</span><kbd>Q / Ctrl</kbd><span>Roll. You can't be hit mid-roll.</span><kbd>Space</kbd><span>Jump. You can jump onto tables, beds, benches and other low things (up to about 1 m).</span><kbd>C</kbd><span>Sneak. Harder to spot, slower.</span><kbd>B</kbd><span>Get on or off your bike</span><kbd>Z</kbd><span>Sit down and meditate. Time passes 8× faster. Press Z (or Meditate) again to get up.</span><kbd>E</kbd><span>Talk to people: a wheel of choices pops up around their head (click one or press its number, Esc leaves), enter and leave buildings, use things inside, take photos</span><kbd>1 2 3</kbd><span>Use an item</span><kbd>Tab / M</kbd><span>Open the Planner</span><kbd>V</kbd><span>Reset the camera behind you</span><kbd>G</kbd><span>Turn shadows on or off (faster with them off)</span><kbd>O</kbd><span>Graphics quality: High, Balanced, Performance</span></div>
    <h3>Rules of the semester</h3><ul><li>Trouble fills when police or RAs see you fight, skip class, or break curfew. One pip or more and they chase you. Lose them, and it drains.</li><li>Get caught and you pay a fine. Get knocked out and you lose half your cash.</li><li>Sleep at the ΑΣΡ house to save. At 2 AM you pass out wherever you are.</li><li>Anyone can be punched. Damage depends on the level gap shown over their head: red levels outrank you, green ones don't.</li><li>Every task has more than one way through. Your classes, cliques and Big Brother open some of them.</li></ul>`}
  if(tab==='settings')h=setPage();
  if(tab==='bug')h='<h2>Report a Bug</h2>'+bugSection().replace('<h3>Report a bug</h3>','');
  p.innerHTML=h;if(tab==='settings')setWire(p);if(tab==='bug')bugWire(p);if(tab==='skills')skWire(p);if(tab==='map'){p.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{MAPTAB=b.dataset.mt;renderPlanner('map')});const tb=$('terrbtn');if(tb)tb.onclick=()=>{sfx('ui');setSave('terr',SET.terr?0:1);renderPlanner('map')};const c=$('fullmap');drawFull(c);fitMapNote();mapWire(c)}}
function fitMapNote(){const n=$('planner').querySelector('.note'),c=$('fullmap');if(!c||!n.classList.contains('big'))return;n.style.width='';const wrap=c.parentElement,pg=$('npage'),cs=getComputedStyle(pg),padX=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),maxW=$('planner').clientWidth-32;n.style.width=Math.min(wrap.clientHeight*(c.width/c.height)+padX+4,maxW)+'px';NOTEW={w:n.style.width,pw:$('planner').clientWidth,ph:$('planner').clientHeight}}
/* V324: every tab uses the Map tab's larger size: full height, and the width the map tab fits to (remembered, or worked out the same way before the map has been opened) */
let NOTEW=null;
function fitNote(){const pl=$('planner'),n=pl.querySelector('.note');if(pl.hidden||!n.classList.contains('tall'))return;const maxW=pl.clientWidth-32;
  if(NOTEW&&NOTEW.pw===pl.clientWidth&&NOTEW.ph===pl.clientHeight){n.style.width=NOTEW.w;return}
  const pg=$('npage'),cs=getComputedStyle(pg),padX=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),tabs=n.querySelector('.ntabs'),h=n.clientHeight-(tabs?tabs.offsetHeight:0)-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-128;
  n.style.width=Math.min(Math.max(h*1.2+padX+4,Math.min(760,maxW)),maxW)+'px'}
addEventListener('resize',()=>{if(!$('planner').hidden){fitMapNote();fitNote();skFit()}});

// ================================================================ SAVE
let SAVEK=slotKey(curSlot());   // V210 the chosen save slot
let SAVEBLOCK=0;
function saveGame(){if(SAVEBLOCK||mode==='title')return;try{localStorage.setItem(SAVEK,JSON.stringify({S,px:P.x,pz:P.z,meta:saveMeta()}))}catch(e){}}
function loadGame(){try{const d=JSON.parse(localStorage.getItem(SAVEK)||'null');if(!d||!d.S)return false;S=Object.assign(S0(),d.S);S.rep=Object.assign(S0().rep,d.S.rep);S.grades=Object.assign(S0().grades,d.S.grades);S.sp=d.S.sp||{};S.sk=d.S.sk||{};try{skMig()}catch(e){}S.stats=Object.assign(S0().stats,d.S.stats);S.daily=d.S.daily||{};if(S.pledged==null)S.pledged=S.done.arrive?1:0;if(S.spirit==null)S.spirit=50;setHat(S.pledged);if(S.xp==null)S.xp=(S.lvl-1)*100;if(!S.xpv2){const fr=clamp((S.xp-(S.lvl-1)*100)/100,0,.9);S.lvl=Math.min(S.lvl,lvCap());S.xp=xpT(S.lvl)+Math.round(fr*XPC);S.mhp=100+(S.lvl-1)*10;S.hp=Math.min(S.hp,S.mhp);S.xpv2=1}S.rel=d.S.rel||{};for(const k in S.rel)if(!NN[k])delete S.rel[k];try{c1Migrate(d.S)}catch(e){console.warn(e)}goIn('asr',4.6,6);if(S.ch>=3)unlockLake();if(S.done.ram)placeRam();S.carry=null;S.budget=0;refreshNamed();renderInv();try{turfEnsure()}catch(e){console.warn(e)}return true}catch(e){return false}}
const hasSave=()=>{try{return!!localStorage.getItem(SAVEK)}catch(e){return false}};

// ================================================================ LIGHTING & SKY
const C_HM=new THREE.Color(0xcfe3ff),C_DT=new THREE.Color(0x3f7fd0),C_DB=new THREE.Color(0xc4dcf0),C_NT=new THREE.Color(0x050916),C_NB=new THREE.Color(0x182242),C_SB=new THREE.Color(0xf09a5a),C_ST=new THREE.Color(0x3a4a8a),tc=new THREE.Color(),bc=new THREE.Color();let lastClock=-1;
let CLOUDS=null;function mkClouds(){const c=document.createElement('canvas');c.width=256;c.height=128;const q=c.getContext('2d');for(let i=0;i<14;i++){const x=40+rnd()*176,y=58+(rnd()-.5)*36*(1-Math.abs(x-128)/140),r=22+rnd()*26;const g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.6,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=g;q.beginPath();q.arc(x,y,r,0,TAU);q.fill()}
  const tex=new THREE.CanvasTexture(c);CLOUDS=[];for(let i=0;i<16;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,fog:false,opacity:.85}));const s=50+rnd()*50;m.scale.set(s,s*.45,1);m.renderOrder=-1;sc.add(m);const a=rnd()*TAU,r=80+rnd()*140;CLOUDS.push({m,ox:Math.cos(a)*r,oz:Math.sin(a)*r,y:48+rnd()*30,sp:.8+rnd()*1.2})}}
const _cc=new THREE.Color(),_cn=new THREE.Color(0x2a3248),_cd=new THREE.Color(0xffb88a);
function cloudTick(dt){if(!CLOUDS){if(typeof sc==='undefined')return;mkClouds()}const vis=!P.inside&&mode!=='loading',mul=P.med&&mode==='play'?18:1,day=1-NIGHT;_cc.copy(_cn).lerp(_cd,clamp(day*1.6,0,1)).lerp(new THREE.Color(0xffffff),clamp(day*1.4-.4,0,1));
  for(const c of CLOUDS){c.m.visible=vis;if(!vis)continue;c.ox+=c.sp*mul*dt*1.4;c.oz+=c.sp*mul*dt*.35;if(c.ox>240)c.ox-=480;if(c.oz>240)c.oz-=480;c.m.position.set(cam.position.x+c.ox,c.y,cam.position.z+c.oz);c.m.material.color.copy(_cc);c.m.material.opacity=.45+.4*day}}
function lighting(){const a=(S.gt-6)/24*TAU,el=Math.sin(a),day=clamp(el*2.4+.3,0,1),dusk=clamp(1-Math.abs(el-.06)*6,0,1);NIGHT=1-day;
  tc.copy(C_NT).lerp(C_DT,day).lerp(C_ST,dusk*.5);bc.copy(C_NB).lerp(C_DB,day).lerp(C_SB,dusk*.75);skyU.top.value.copy(tc);skyU.bot.value.copy(bc);sc.fog.color.copy(bc);sc.fog.near=lerp(35,80,day);sc.fog.far=lerp(130,220,day);if(TC.g){sc.fog.near*=3.5;sc.fog.far*=3}/* V105 clear sky for the title card */
  const sdx=Math.cos(a),sdy=el,moon=el<0;const dir=moon?V3(-sdx*.7,-sdy+.25,-.4).normalize():V3(sdx*.8,Math.max(.12,sdy),.45).normalize();sun.position.set(P.x+dir.x*100,dir.y*100,P.z+dir.z*100);sun.target.position.set(P.x,0,P.z);
  sun.intensity=moon?.32:.25+1.2*day;sun.color.setHex(moon?0x9fb4ff:(dusk>.3?0xffb070:0xfff0d8));hemi.intensity=GFX==='enhanced'?(.32+.34*day):.18+.56*day;CHR_RIM.value=.1+.24*day;hemi.color.copy(tc).lerp(C_HM,.5);hemi.groundColor.setRGB(lerp(lerp(.1,.5,day),.58,dusk*.5),lerp(lerp(.125,.38,day),.32,dusk*.5),lerp(lerp(.19,.24,day),.3,dusk*.5));
  {const k=dusk*.6;CHR_RIMS.value=.42+.55*NIGHT;CHR_RIMC.value.setRGB(lerp(lerp(.22,.5,day),1,k),lerp(lerp(.44,.68,day),.5,k),lerp(lerp(1.25,.95,day),.55,k));CHR_BNC.value.setRGB(.01+.09*day,.013+.055*day,.03+.005*day);CHR_SKY.value.setRGB(.012+.035*day,.02+.05*day,.04+.075*day);if(GC.csh)GC.csh.mat.opacity=.32+.28*day}
  sunDisc.position.set(cam.position.x+sdx*250,sdy*250,cam.position.z+110);moonDisc.position.set(cam.position.x-sdx*250,-sdy*250,cam.position.z-110);sunDisc.visible=el>-.08;moonDisc.visible=el<.12;stars.position.copy(cam.position);stars.material.opacity=clamp(NIGHT*1.3-.25,0,1);sky.position.copy(cam.position);
  const em=clamp(NIGHT*1.15-.1,0,1);for(const m of FMLIST)m.emissiveIntensity=em*(GFX==='enhanced'?1.25:.9);if(bulbs)bulbs.material.color.setHex(em>.2?0xfff0b8:0xd8d4c8);plamp.intensity=em*1.1;plamp.visible=GFX==='enhanced'||em>.25;nightTick(1/60,em);plamp.position.set(P.x,P.y+3.2,P.z);
  if(radioBlink)radioBlink.visible=em>.2&&Math.sin(TT*4)>0;
  sun.shadow.normalBias=P.inside?Math.max(SHB[1],MOB?.2:.12):SHB[1];
  /* V239 phones: the shadow depth range was 220 units, too coarse for phone GPUs (wide diagonal black bands on indoor walls and carpet). Indoors the sun is pulled closer and the range cut to ~70, with a bias to match. */
  {const off=P.inside&&MOB,fr=off?160:P.inside?72:220,nr=off?150:1,bb=P.inside?(MOB?-.004:-.0012):SHB[0],c=sun.shadow.camera;if(c.far!==fr||c.near!==nr){c.near=nr;c.far=fr;c.updateProjectionMatrix();R.shadowMap.needsUpdate=true}sun.shadow.bias=bb}
  /* V241 phones indoors: the shadow camera is moved past everything (near 150) so the sun casts no shadow inside; the black diagonal bands on indoor walls and floors were this shadow map */
  sky.visible=!P.inside;if(P.inside){hemi.intensity=.95;hemi.color.setHex(0xfff2dc);hemi.groundColor.setHex(0x6a5a48);sun.intensity=.6;sun.color.setHex(0xfff0d8);sun.position.set(P.x+8,33,P.z+10.5);sc.fog.color.setHex(0x1e1812);sc.fog.near=45;sc.fog.far=150;sunDisc.visible=moonDisc.visible=false;stars.material.opacity=0;plamp.visible=false}
  if(P.inside==='asr_bsmt'){hemi.intensity=.34;hemi.color.setHex(0xd8b890);hemi.groundColor.setHex(0x1a1410);sun.intensity=.12;sun.color.setHex(0xffd8a0);sc.fog.color.setHex(0x080605);sc.fog.near=10;sc.fog.far=72}   // V136 the dungeon is dark
  try{c1Light()}catch(e){}
  if(P.inside){CHR_RIMS.value=.3;CHR_RIMC.value.setRGB(.7,.62,.5);CHR_BNC.value.setRGB(.06,.04,.025);CHR_SKY.value.setRGB(.02,.025,.03)}
  {const E=sun.shadow.camera.right,tx=2*E/sun.shadow.mapSize.x,dx=sun.position.x-sun.target.position.x,dy=sun.position.y-sun.target.position.y,dz=sun.position.z-sun.target.position.z,dl=Math.hypot(dx,dy,dz)||1,fx=dx/dl,fy=dy/dl,fz=dz/dl;
    let rx=fz,rz=-fx;const rl=Math.hypot(rx,rz)||1;rx/=rl;rz/=rl;const ux=fy*rz,uy=fz*rx-fx*rz,uz=-fy*rx;const T=sun.target.position,pr=T.x*rx+T.z*rz,pu=T.x*ux+T.y*uy+T.z*uz,sr=pr-Math.round(pr/tx)*tx,su=pu-Math.round(pu/tx)*tx;
    const pf=T.x*fx+T.y*fy+T.z*fz,sf=pf-Math.round(pf/.5)*.5;/* V238 also snap along the light direction so depth steps stay fixed in the world instead of crawling across walls as the player moves */const ox=-(sr*rx+su*ux+sf*fx),oy=-(su*uy+sf*fy),oz=-(sr*rz+su*uz+sf*fz);T.x+=ox;T.y+=oy;T.z+=oz;sun.position.x+=ox;sun.position.y+=oy;sun.position.z+=oz}
  const cm=Math.floor(S.gt*12);if(cm!==lastClock&&clockCtx){lastClock=cm;const q=clockCtx;q.fillStyle='#f2ead8';q.beginPath();q.arc(128,128,124,0,TAU);q.fill();q.strokeStyle='#1d2440';q.lineWidth=8;q.stroke();q.fillStyle='#1d2440';for(let i=0;i<12;i++){const aa=i/12*TAU;q.fillRect(128+Math.sin(aa)*100-3,128-Math.cos(aa)*100-8,6,16)}const h=S.gt%12,mm=(S.gt%1)*60;const hand=(ang,len,w)=>{q.save();q.translate(128,128);q.rotate(ang);q.fillRect(-w/2,-len,w,len);q.restore()};hand(h/12*TAU,60,10);hand(mm/60*TAU,92,6);q.beginPath();q.arc(128,128,9,0,TAU);q.fill();clockTex.needsUpdate=true}}

// ================================================================ MAIN UPDATE
function update(dt){TT+=dt;if(mode!=='title'&&mode!=='loading'&&S)S.playT=(S.playT||0)+dt;
  if(mode==='play'){
    const pg=S.gt;advance(dt*TS*(P.med?12:1)*TSMUL);/* V117 meditation keeps its old speed (12 min/s) */
    
    if(pg<23&&S.gt>=23)toast('11 PM: curfew. Get back to Greek Row.',4500);
    if(S.gt>=2&&S.gt<2.2&&pg<2)toast('2 AM. You\'re running on fumes. Get some sleep when you can.',4000);   // V168 no more forced pass-out at 2 AM
    // offenses
    OFFENSE=null;const sl=(S.day>=2&&(S.day-1)%7<5)?(S.gt>=9.5&&S.gt<11.5?0:S.gt>=13.5&&S.gt<15.5?1:null):null;if((S.gt>=23||S.gt<6)&&!(P.x<134&&P.z<160)&&!EV&&!P.inside)OFFENSE='curfew';
    BIGT-=dt;if(BIGQ.length&&BIGT<=0&&$('wheel').hidden&&$('card').hidden&&!CINE){const b=BIGQ.shift();big(b[0],b[1],1);BIGT=b[1]/1000+.5}navBudget=8;if((GT_=(GT_||0)-dt)<=0){GT_=.4;refreshGoal()}rollCallTick(dt);if(GRAB.on){try{grabTick(dt)}catch(e){console.error('grab',e);try{grabEnd(true)}catch(_){GRAB.on=0;$('fade').style.opacity=0;PM.visible=true}}}else playerUpd(dt);try{motionAudio(dt)}catch(e){}SEEN=0;CHASED=0;for(let i=NP.length-1;i>=0;i--)npcUpd(NP[i],dt);yardBalls();robTick(dt);carsTick(dt);routeTick();if(!SEEN&&!CHASED)S.trouble=Math.max(0,S.trouble-(OFFENSE?1:4)*dt);
    if(EV){if(EV.type==='football')footballTick(dt);else if(EV.type==='kart')kartTick(dt)}
    stepTick(dt);
    if(ePress){ePress=0;const it=nearest();if(it){sfx('ui');const lab=it.label;it.f();try{storyGrab(lab)}catch(e){}try{storyDrop(lab)}catch(e){}}}try{kitTick(dt)}catch(e){}
    if(K.KeyB){K.KeyB=0;if(P.inside){toast('No bikes indoors.',1500)}else if(!EV&&!P.kart){if(S.carry){toast("You can't ride while carrying the ram.")}else{P.bike=P.bike?0:1;toast(P.bike?'On your bike. Shift to pedal hard.':'Off your bike.',1500)}}}
    if(K.KeyV){K.KeyV=0;yaw=P.face+PI}
    if((PRT-=dt)<=0){PRT=.12;const it=nearest();const pr=$('prompt');if(it&&!EV&&!GRAB.on){if(pr.dataset.l!==it.label){pr.dataset.l=it.label;pr.innerHTML='<kbd>E</kbd>';pr.appendChild(document.createTextNode(it.label))}pr.hidden=false}else{pr.hidden=true;pr.dataset.l=''}}
    if(S.hp<S.mhp&&!NP.some(n=>n.aggro&&n.tgt==='P'))S.hp=Math.min(S.mhp,S.hp+.6*dt);P.hurt=Math.max(0,P.hurt-dt);
  }else if(mode==='card'||mode==='wheel'){
    // V167: during a conversation the people around keep doing their own thing; only the one you're talking to, anyone chasing you (cops) and scripted actors are held; fighters keep fighting but can't hurt you (`hitPlayer` is off while a card or wheel is open)
    navBudget=8;const tk=SCENE&&SCENE.n;for(let i=NP.length-1;i>=0;i--){const m=NP[i];if(m===tk||m.chase||m.actor)continue;npcUpd(m,dt)}
  }
  // ambient anim always
  prTick(dt);try{compassTick()}catch(e){}try{c1Tick(dt)}catch(e){console.warn('c1Tick',e)}
  if(fountainPts){const a=fountainPts.geometry.attributes.position.array,ph=fountainPts.userData.ph;for(let i=0;i<ph.length;i++){const p=ph[i];const t=((TT*.6+p[0])%1);const r=t*1.9*p[2];a[i*3]=FOUNT[0]+Math.cos(p[1])*r;a[i*3+1]=3.2+t*3.2-t*t*5.2;a[i*3+2]=FOUNT[1]+Math.sin(p[1])*r}fountainPts.geometry.attributes.position.needsUpdate=true}
  for(const pr of PROPS)propSpin(pr,dt);dmgTick(dt);lootTick(dt);
  puffs=puffs.filter(p=>{p[1]+=dt;p[0].scale.setScalar(1+p[1]*3);p[0].material.opacity=.5*(1-p[1]/2.5);if(p[1]>2.5){sc.remove(p[0]);return false}return true});
  if(mode!=='title'&&mode!=='loading'){trailUpd(dt);markersUpd();tmTick(dt)}
  // camera
  if(GRAB.on&&mode!=='play'){try{grabEnd(true)}catch(e){GRAB.on=0;$('fade').style.opacity=0;PM.visible=true}}   // V166 safety: a card/cutscene took over mid-grab, so drop him instead of leaving a black screen
  if(mode==='cine'||CINE)cineTick(dt);
  if(mode==='cine'||((mode==='card'||mode==='wheel')&&CINE&&CINE.ride)){}else if(mode==='title'||mode==='loading'){const a=TT*.05;cam.position.set(400+Math.cos(a)*110,58,320+Math.sin(a)*110);cam.lookAt(400,10,300)}
  else if((mode==='card'||mode==='wheel')&&SCENE&&SCENE.n&&NP.includes(SCENE.n)){if(!EAVES)sceneCam(dt);if(mode==='wheel')wheelPos()}
  else if(GRAB.on&&mode==='play')grabCam(dt);
  else{const cp=Math.cos(pitch),dx=Math.sin(yaw)*cp,dy=Math.sin(pitch),dz=Math.cos(yaw)*cp,ty=P.y+P.jy+1.55,gy=P.y-(P.dk==null&&!P.bike?P.sup||0:0);/* V174: gy = floor level without the object he stands on */let t=camTarget*(P.kart?1.1:P.bike?1.15:1);if(P.inside)t=Math.min(t,3.6);if(P.inside&&dy>.02&&(Math.abs(gy)<.3||daisAt()))t=Math.min(t,Math.max(1.2,(5.3-ty)/dy));for(let q=.6;q<=t;q+=.25){const x=P.x+dx*q,z=P.z+dz*q,y=ty+dy*q;if(camTop(x,z)>y-.3||CAMBLK&&CAMBLK(x,y,z)){t=Math.max(1.2,q-.4);break}}camT+=(t-camT)*Math.min(1,(t<camT?20:4)*dt);cam.position.set(P.x+dx*camT,P.inside?ty+dy*camT:Math.max(.6+terrH(P.x+dx*camT,P.z+dz*camT),ty+dy*camT),P.z+dz*camT);if(P.inside&&(P.inside==='asr_up'||P.inside==='asr_top')&&Math.abs(gy)>.3&&typeof c3StairOK==='function'&&c3StairOK()&&(()=>{const I=INT[P.inside],[a,b,c,e]=C3SW,lx=P.x-I.x0,lz=P.z-I.z0;return lx>a-.5&&lx<c+.5&&lz>b-1&&lz<e+1})()){const I=INT[P.inside],[a,b,c,e]=C3SW;   // V206 the 2nd→3rd floor stairs: the camera stays free inside their own stairwell
    cam.position.x=clamp(cam.position.x,I.x0+a+.15,I.x0+c-.15);cam.position.z=clamp(cam.position.z,I.z0+b-2.5,I.z0+e+.6);cam.position.y=clamp(cam.position.y,gy+1.2,P.inside==='asr_up'?C3SH+5.6:5.6)}
  else if(P.inside&&P.inside!==DUNG.id&&Math.abs(gy)>.3&&!daisAt()){const I=INT[P.inside];cam.position.x=clamp(cam.position.x,I.x0+STX0+.15,I.x0+STX1-.15);cam.position.z=clamp(cam.position.z,I.z0+STZT-.4,I.z0+STZB+.6);cam.position.y=clamp(cam.position.y,gy+1.2,P.inside.endsWith('_up')?5.6:12.2)}else if(P.inside)cam.position.y=Math.max(.6,cam.position.y);cam.lookAt(P.x,ty,P.z)}
  if(mode==='cine'||mode==='wheel'||mode==='card'||CINE){for(const n of NP)if(n.tag)n.tag.visible=false}
  lighting();cloudTick(dt);
  hudT-=dt;if(hudT<=0&&mode!=='title'&&mode!=='loading'){hudT=.1;hud()}
  if(++mapN%4===0&&WORLDC&&mode!=='title'){const mv=tabOn('map');if(MINIV!==mv){MINIV=mv;$('mini').style.visibility=mv?'':'hidden'}if(mv)drawMini()}
  $('vig').style.opacity=Math.min(.9,(1-S.hp/S.mhp)*.7+P.hurt)}
function mainQuestText(){if(S.ch>10)return'Story complete. The campus is yours: classes, side quests and the yearbook are still open.';
  if(AM&&AM.m.auto){const st=curStep();return st&&st.label?st.label:'Meet the brothers'}
  const ms=M.filter(m=>m.main&&m.ch===S.ch),dn=ms.filter(m=>S.done[m.id]).length,pre='';
  if(AM&&AM.m.main){return pre+AM.m.name+': '+($('otext').textContent||'…')}
  const av=ms.filter(m=>!S.done[m.id]&&(!m.pre||m.pre.every(mDone)));if(!av.length)return pre+'Wrapping up…';
  const m=av[0],w=mWho(m);let t=m.bbm&&!S.bb?'Choose a Big Brother: talk to Tank Hale, Reese Whitford or Owen Park on the porch':w&&NN[w]?`Talk to ${NN[w].name}: "${m.name}"`:`"${m.name}": go to the gold star`;if(m.hint)t=m.hint;if(m.when)t+=` (${fmtH(m.when[0])}–${fmtH(m.when[1])})`;if(AM&&AM.m.side)t+=' · finish your side quest first';return pre+t}
// 30-minute heads-up for anything you have to be at
let REMK=null;function upcoming(){const E=[],gt=S.gt,wk=clsDay(S.day)&&clsLive();
  if(wk)for(const sl of[0,1]){const st=sl?13:9;if(!S.att[S.day+'-'+sl]){E.push({k:'c'+sl,t:st,txt:'Class: '+classesAt(S.day,sl).map(c=>CI[c].n).join(', ')})}}
  if(S.pledged&&S.rcDone!==S.day)E.push({k:'rc',t:18,txt:'Roll call on the ΑΣΡ front lawn'});
  if(!AM)for(const m of availM())if(m.when&&m.main)E.push({k:'m'+m.id,t:m.when[0],txt:`"${m.name}"${mWho(m)&&NN[mWho(m)]?' with '+NN[mWho(m)].name:''}`});
  E.push({k:'cf',t:23,txt:'Curfew. Be on Greek Row or inside'});
  let best=null;for(const e of E){const d=e.t-gt;if(d>0&&d<=.5&&(!best||d<best.d))best=Object.assign(e,{d})}return best}
function remindTick(){const r=$('remind');if(!r)return;const e=mode==='play'||mode==='planner'?upcoming():null;if(!e){r.hidden=true;REMK=null;return}
  const key=S.day+e.k;if(REMK!==key){REMK=key;sfx('bell');toast('⏰ 30 minutes: '+e.txt+' at '+fmtH(e.t)+'.',4500)}
  const mn=Math.max(1,Math.ceil(e.d*60));r.textContent=`⏰ In ${mn} min (${fmtH(e.t)}): ${e.txt}`;r.hidden=false}
function hud(){remindTick();prHud();if(AM&&!AM.m.auto&&!AM.m.main){$('mql').textContent='★ Side quest';$('mqt').textContent=AM.m.name.replace(/^Side: /,'')+': '+($('otext').textContent||'…')}else{$('mql').textContent='★ Main quest';$('mqt').textContent=mainQuestText()}$('chap').textContent=S.ch<=10?`Chapter ${S.ch} · ${CHN[S.ch]}`+(()=>{const ms=M.filter(m=>m.main&&m.ch===S.ch&&!m.noCount);return ms.length?` (${Math.min(ms.length,ms.filter(m=>S.done[m.id]).length+1)}/${ms.length})`:''})():'Epilogue · Free roam';$('when').textContent=`${DAYN[(S.day-1)%7]} · ${fmtT(S.gt)}`;
  let sc_='';const wk=clsDay(S.day)&&clsLive();if(wk){for(const sl of[0,1]){const st=sl?13:9;if(S.gt<st+2.5&&!S.att[S.day+'-'+sl]){sc_=(S.gt<st+.5?'Next: ':'Missed: ')+`class at ${fmtH(st)} (${classesAt(S.day,sl).length} to choose from, see Tab › Classes)`;if(S.gt>=st+.5)sc_='Truant! Avoid police until '+fmtH(st+2.5);break}}}if(!sc_&&S.pledged&&S.gt>=16&&S.gt<19&&S.rcDone!==S.day)sc_=S.gt>=18?'ROLL CALL NOW: ΑΣΡ front lawn':'Roll call at 6 PM: ΑΣΡ front lawn';if(!sc_)sc_=S.gt>=23||S.gt<6?'Curfew: stay on Greek Row':!tabOn('cls')?'Find your way around campus':S.day<2||!clsLive()?'Classes start tomorrow at 9 AM':'No more classes today';$('sched').textContent=sc_;
  const pips=Math.ceil(S.trouble/25-.001);$('trouble').querySelectorAll('i').forEach((e,i)=>e.classList.toggle('on',i<pips));$('cash').textContent='Cash '+money$(S.money)+(S.budget>0?' · Grant\'s '+money$(S.budget):'');$('lv').textContent='Lv '+S.lvl+(S.lvl<10?' · '+Math.max(0,S.xp-xpT(S.lvl))+'/'+XPC+' XP':' · MAX');$('xpb').style.width=(S.lvl>=10?100:Math.min(100,Math.max(0,(S.xp-xpT(S.lvl))/XPC*100)))+'%';$('hpb').style.width=(S.hp/S.mhp*100)+'%';$('stb').style.width=(S.sta/staMax()*100)+'%';if(AM)updObj()}

// ================================================================ INPUT
addEventListener('keydown',e=>{audioInit();if(e.target&&(e.target.tagName==='TEXTAREA'||(e.target.tagName==='INPUT'&&/^(text|search|email|url)$/.test(e.target.type))))return;/* V186 typing in the bug report box */if(mode==='mg'){if(e.code==='Escape'&&MGQ){e.preventDefault();mgQuitAsk();return}if(MGK)MGK(e);return}
  if(mode==='cine'){if(e.code==='Escape'||e.code==='Space'||e.code==='Enter'){e.preventDefault();cineSkip()}return}
  if(mode==='wheel'&&WH){if(e.code==='Escape'){e.preventDefault();if(WH.leave)wheelPick(WH.leave[1]);return}const m=/^Digit([1-9])$/.exec(e.code);if(m){const b=$('wpills').children[+m[1]-1];if(b&&b!==WH.lb&&!b.disabled){e.preventDefault();b.click()}}return}
  if(mode==='planner'){if(e.code==='Tab'||e.code==='Escape'||e.code==='KeyM'){e.preventDefault();closePlanner()}return}
  if(mode!=='play')return;if(e.code==='Tab'||e.code==='KeyM'){e.preventDefault();openPlanner(e.code==='KeyM'?'map':'tasks');return}if(e.code==='Escape'){openPlanner('tasks');return}
  K[e.code]=1;if(e.code==='KeyE'&&!e.repeat)ePress=1;if(e.code==='KeyF'&&!e.repeat)fPress=1;if(/^Digit[123]$/.test(e.code))useSlot(+e.code[5]-1);if(e.code==='KeyZ'&&!e.repeat)toggleMed();if(e.code==='KeyO'&&!e.repeat){GQ=(GQ+1)%3;R.setPixelRatio(QL[GQ][1]);toast('Graphics: '+QL[GQ][0]+' (O to change)',1800)}if(e.code==='KeyL'&&!e.repeat){const nx=GFX==='enhanced'?'classic':'enhanced';try{localStorage.setItem('pledge.gfx',nx)}catch(err){}toast('Graphics: '+(nx==='enhanced'?'Enhanced':'Classic')+' (reloading…)',1500);setTimeout(()=>location.reload(),900)}if(e.code==='KeyG'&&!e.repeat){sun.castShadow=!sun.castShadow;toast('Shadows '+(sun.castShadow?'on':'off')+' (G to toggle)',1800)}if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault()});
addEventListener('keyup',e=>{K[e.code]=0});
addEventListener('blur',()=>{K={};RMB=0;BLKT=0});
let drag=null,RMB=0,BLKT=0;   // V172 block: RMB = right mouse held, BLKT = on-screen Block button held
R.domElement.addEventListener('pointerdown',e=>{audioInit();if(mode!=='play')return;if(e.pointerType==='mouse'){if(e.button===0){MLK.free=0;fPress=1;if(document.pointerLockElement!==R.domElement)lockMouse()}else{if(e.button===2)RMB=1;drag={x:e.clientX,y:e.clientY,id:e.pointerId}}}else{drag={x:e.clientX,y:e.clientY,id:e.pointerId}}});
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){MLK.mx=e.clientX;MLK.my=e.clientY}if(RMB&&e.pointerType==='mouse'&&!(e.buttons&2))RMB=0;if(mode!=='play')return;if(document.pointerLockElement===R.domElement){yaw-=e.movementX*.0026*SET.sens;pitch=clamp(pitch+e.movementY*.0022*SET.sens*(SET.inv?-1:1),-.25,1.15)}else if(MLK.fail&&!MLK.free&&e.pointerType==='mouse'&&!(drag&&drag.id===e.pointerId)){yaw-=e.movementX*.0026*SET.sens;pitch=clamp(pitch+e.movementY*.0022*SET.sens*(SET.inv?-1:1),-.25,1.15)}else if(drag&&drag.id===e.pointerId){yaw-=(e.clientX-drag.x)*.006*SET.sens;pitch=clamp(pitch+(e.clientY-drag.y)*.004*SET.sens*(SET.inv?-1:1),-.25,1.15);drag.x=e.clientX;drag.y=e.clientY}});
addEventListener('pointerup',e=>{if(e.pointerType==='mouse'&&e.button===2)RMB=0;if(drag&&drag.id===e.pointerId)drag=null});addEventListener('pointercancel',()=>{RMB=0});
R.domElement.addEventListener('contextmenu',e=>e.preventDefault());
/* V173 auto mouse-look (desktop): once play resumes, the mouse is captured again (no cursor, no click needed). Browsers only allow capture after a key press or click,
   so it is tried right away and again on the first key/click. Pressing Esc releases it; click to capture again. */
{const coarse=matchMedia('(pointer:coarse)').matches,locked=()=>document.pointerLockElement===R.domElement;
 const tryLock=()=>{if(coarse||!MLK.want||mode!=='play'||locked())return;lockMouse()};
 document.addEventListener('pointerlockerror',()=>{MLK.fail=1});
 document.addEventListener('pointerlockchange',()=>{if(locked()){MLK.want=0;MLK.fail=0}if(locked())return;else{if(!MLK.script&&mode==='play')MLK.want=0;MLK.script=0}});
 addEventListener('keydown',e=>{if(e.code==='Escape'&&mode==='play')MLK.free=1},true);
 /* no pointer lock available (embedded preview): the cursor can't be pinned, so when it touches a screen edge the camera keeps turning that way */
 setInterval(()=>{if(coarse||mode!=='play'||!MLK.fail||MLK.free||locked()||MLK.mx<0)return;const k=.016*2.4*SET.sens,w=innerWidth,h=innerHeight;
   if(MLK.mx<=2)yaw+=k;else if(MLK.mx>=w-3)yaw-=k;if(MLK.my<=2)pitch=clamp(pitch-k*.6,-.25,1.15);else if(MLK.my>=h-3)pitch=clamp(pitch+k*.6,-.25,1.15)},16)
 for(const ev of['keydown','pointerdown','mousedown'])addEventListener(ev,()=>{if(mode==='play')setTimeout(tryLock,0)},true);
 setInterval(()=>{if(coarse)return;const pl=mode==='play';if(pl&&MLK.prev!=='play'&&MLK.prev!=='')MLK.want=1;MLK.prev=mode;R.domElement.style.cursor=pl&&!MLK.free?'none':'';if(pl&&MLK.want&&!locked()&&performance.now()-MLK.t>400){MLK.t=performance.now();tryLock()}},120)}
R.domElement.addEventListener('wheel',e=>{camTarget=clamp(camTarget+e.deltaY*.006,3.5,13);SET.cam=camTarget;clearTimeout(SET.ct);SET.ct=setTimeout(()=>setSave('cam2',camTarget),600);e.preventDefault()},{passive:false});
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});
$('fps').addEventListener('click',()=>setFpsMin(!FPSMIN));$('fps').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setFpsMin(!FPSMIN)}});setFpsMin(FPSMIN);
$('cineskip').addEventListener('click',()=>cineSkip());
document.querySelectorAll('.slot').forEach((b,i)=>b.onclick=()=>{if(mode==='play')useSlot(i)});
// touch
function setupTouch(){if(!matchMedia('(pointer:coarse)').matches)return;$('touch').hidden=false;$('tips').textContent='Drag the right side to look';const st=$('stick'),kn=$('knob');let id=null;const mv=e=>{const r=st.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=(e.clientX-cx)/55,dy=(e.clientY-cy)/55;const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}joy.x=dx;joy.y=dy;kn.style.transform=`translate(${dx*42}px,${dy*42}px)`};
  st.addEventListener('pointerdown',e=>{id=e.pointerId;st.setPointerCapture(id);mv(e);e.stopPropagation()});st.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e)});const up=e=>{if(e.pointerId===id){id=null;joy.x=joy.y=0;kn.style.transform=''}};st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  document.body.classList.add('mob');const tray=$('ttray'),more=$('bmore');
  const syncMore=()=>more.classList.toggle('dot',!tray.hidden||Object.values(toggles).some(Boolean));
  const closeTray=()=>{tray.hidden=true;more.classList.remove('open');syncMore()};
  more.addEventListener('pointerdown',e=>{e.stopPropagation();audioInit();if(mode!=='play')return;tray.hidden=!tray.hidden;more.classList.toggle('open',!tray.hidden);syncMore()});
  R.domElement.addEventListener('pointerdown',()=>{if(!tray.hidden)closeTray()});
  $('tbtns').querySelectorAll('button[data-k]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.stopPropagation();audioInit();if(mode!=='play')return;const k=b.dataset.k;if(b.dataset.toggle){toggles[k]=!toggles[k];b.classList.toggle('on',!!toggles[k]);syncMore();return}if(k==='KeyZ'){toggleMed();closeTray();return}if(k==='KeyE')ePress=1;else if(k==='KeyF')fPress=1;else K[k]=1;setTimeout(()=>{if(k!=='KeyE'&&k!=='KeyF')K[k]=0},120);if(tray.contains(b))closeTray()})});
  {const bb=$('bblk');if(bb){const on=e=>{e.stopPropagation();e.preventDefault();audioInit();if(mode!=='play')return;BLKT=1;bb.classList.add('on');try{bb.setPointerCapture(e.pointerId)}catch(_){}},off=()=>{BLKT=0;bb.classList.remove('on')};bb.addEventListener('pointerdown',on);bb.addEventListener('pointerup',off);bb.addEventListener('pointercancel',off);bb.addEventListener('lostpointercapture',off)}}
  // HUD taps replace buttons: clock/quest box = planner, minimap = map, role badge = role ability
  const tap=(el,fn)=>el.addEventListener('pointerdown',e=>{e.stopPropagation();audioInit();if(mode!=='play')return;if(!tray.hidden)closeTray();fn()});
  tap($('tl'),()=>openPlanner('tasks'));tap($('mini'),()=>openPlanner('map'));
  tap($('rolep'),()=>{K.KeyT=1;setTimeout(()=>{K.KeyT=0},120)})}

// ================================================================ BOOT
function gfxReady(){if(GFX!=='enhanced')return;try{ppInit()}catch(e){console.warn('post-processing off:',e);PP.ready=false;R.toneMapping=THREE.ACESFilmicToneMapping}for(const m of FMLIST)pbrize(m,{detail:1});sc.traverse(o=>{const m=o.material;if(o.isMesh&&m&&!Array.isArray(m)&&m.isMeshStandardMaterial&&m.map&&m.map.image&&m.map.image.width>256&&!o.userData.terrain&&!m.transparent)pbrize(m)});envUpdate(true)}
function prewarm(){try{gfxReady();for(const id in INT)INT[id].g.visible=true;for(const n of NP)n.g.visible=true;const n0=NP.find(n=>!n.tag);if(n0)mkTag(n0);const d=mkDad();sc.add(d);TRUCK.visible=true;
  /* V296 shaders for everything (interiors, every character, the truck, a name tag) are compiled without drawing, so their textures only go to the graphics card when they're first seen. Before, this drew every interior and gave all ~740 characters a name tag, which loaded about a gigabyte of textures up front and could run the graphics card out of memory */
  R.compile(sc,cam);sc.remove(d);TRUCK.visible=false;for(const id in INT)INT[id].g.visible=false;for(const n of NP)n.g.visible=false;if(n0)tagDrop(n0);
  for(const[x,z]of[[70,80],[70,300],[220,150],[330,150],[460,120],[600,120],[260,320],[400,320],[540,330],[650,320],[260,480],[420,500],[580,500],[250,640],[70,620]]){cam.position.set(x,70,z+.01);cam.lookAt(x,0,z);R.render(sc,cam)}}catch(e){console.warn(e)}}
function begin(fresh){SAVEBLOCK=0;audioInit();window.__played=1;try{const pn=document.querySelector('#title .pennant');TC.pr=fresh&&pn&&!$('title').hidden?pn.getBoundingClientRect():null}catch(e){}$('title').hidden=true;if(matchMedia('(pointer:coarse)').matches)$('touch').hidden=false;$('hud').hidden=false;mode='play';
  if(fresh){S=S0();setHat(0);try{localStorage.removeItem(SAVEK)}catch(e){}P.x=77.9;P.z=76.9;P.face=PI/2;yaw=-PI/2;refreshNamed();renderInv();startMission(M[0])}
  else{if(!loadGame()){begin(true);return}yaw=-PI/2;toast(`Welcome back. ${DAYN[(S.day-1)%7]}, ${fmtT(S.gt)}.`)}}
async function boot(){if(TEST==null)try{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))])}catch(e){}
  buildWorld();optimizeScene();mkMarkers();mkPlayer();spawnAll();prWorldInit();carsInit();TRUCK=mkTruck();try{lootBuild()}catch(e){console.warn('loot',e)}if(TEST!=null)testPrewarm();else prewarm();refreshNamed();renderInv();setupTouch();
  $('loading').hidden=true;$('title').hidden=false;$('touch').hidden=true;mode='title';
  $('chapback').onclick=chapSelClose;slotsBoot();$('bhow').onclick=()=>{$('title').hidden=true;mode='play';$('hud').hidden=true;card({title:'Controls',text:'W A S D move · Mouse looks · Left click or F punches · Hold R or the right button to block (right drag also looks without capture) · Shift sprint · Q roll · Space jump · C sneak · B bike · E interact · 1 2 3 items · Tab planner · V reset camera · O resolution · L graphics (Enhanced / Classic) · G shadows.\n\nOn a phone: left stick moves, drag the right side to look, buttons do the rest.',ch:[['Back',()=>{mode='title';$('title').hidden=false}]]})};
  if(MOB&&GFX==='enhanced')adpSet(1);
  if(TEST!=null)testBoot();
  let last=NOW(),fpsN=0,fpsT=0;(function tick(){requestAnimationFrame(tick);if(TESTPAUSE){last=NOW();return}const t=NOW(),rdt=t-last,dt=Math.min(.05,rdt);last=t;fpsN++;fpsT+=rdt;if(rdt>.4)ADP.skip=1;if(fpsT>=.5){const f=Math.round(fpsN/fpsT),e=$('fps');adpTick(f,rdt);if(!FPSMIN)e.textContent=f+' FPS · '+R.info.render.calls+' draws · cpu '+CPUMS.toFixed(1)+' ms';if(!FPSMIN)e.style.color=f>=50?'#a6e597':f>=30?'#ffcf6a':'#ff8a7a';fpsN=0;fpsT=0}const c0=performance.now();try{update(dt)}catch(err){console.error(err)}CPUMS=CPUMS*.9+(performance.now()-c0)*.1;if((SHF++%ADP.shf)===0)R.shadowMap.needsUpdate=true;try{musTick()}catch(e){}renderFrame()})()}
// V296 lost graphics context (the graphics card ran out of memory or reset): instead of a white/blank screen, save if in free play,
// say what happened, and reload straight back into the save. A second loss within a day switches to Classic graphics (less memory).
function ctxGuard(){const cv=R.domElement;let fired=0;cv.addEventListener('webglcontextlost',e=>{e.preventDefault();if(fired||TEST!=null)return;fired=1;
  let L=[];try{L=JSON.parse(localStorage.getItem('pledge.ctxlost')||'[]').filter(t=>Date.now()-t<864e5)}catch(err){}L.push(Date.now());try{localStorage.setItem('pledge.ctxlost',JSON.stringify(L))}catch(err){}
  const playing=mode!=='title'&&mode!=='loading';if(mode==='play')try{saveGame()}catch(err){}
  const third=L.length>=3,classic=L.length===2&&GFX==='enhanced';if(classic)GFXSAVE('classic');
  const m=document.createElement('div');m.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#0a0e18;color:#f6efe0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font:600 17px Archivo,Arial,sans-serif;line-height:1.5';
  m.innerHTML=third?'Your graphics card keeps running out of memory.<br>Close other tabs or games that use 3D, then reload this page.<br><small style="opacity:.7">Your last save is kept.</small>':'The graphics card ran out of memory'+(mode==='play'?', so your progress was saved':'')+'.<br>'+(classic?'Switching to Classic graphics (uses less memory; press L in game to switch back) and reloading…':'Reloading…');
  document.body.appendChild(m);if(third)return;try{if(playing&&hasSave())sessionStorage.setItem('pledge.auto','go')}catch(err){}setTimeout(()=>location.reload(),2200)},false)}
try{ctxGuard()}catch(e){console.warn('ctxGuard',e)}
boot();

// propeller beanie: one spin rule for every wearer (player and NPCs) — idle 7 rad/s, +2.5 per m/s of ground speed,
// so standing, walking (3.3 m/s) and running (6.2 m/s) look the same on everyone. NPC speed comes from the owner's position delta.
function propSpin(pr,dt){const U=pr.userData;let sp;
  if(PM&&pr===PM.P.prop)sp=Math.hypot(P.vx,P.vz);
  else{let g=U.own;if(!g){g=pr.parent;while(g&&!g.P)g=g.parent;U.own=g=g||pr}
    const x=g.position.x,z=g.position.z;let v=0;if(U.px!=null&&dt>0){v=Math.hypot(x-U.px,z-U.pz)/dt;if(v>20)v=U.sp||0}U.px=x;U.pz=z;
    sp=U.sp=(U.sp||0)+(v-(U.sp||0))*Math.min(1,dt*8)}
  pr.rotation.y+=dt*(7+sp*2.5)}
