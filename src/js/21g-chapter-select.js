/* V150 Chapter select: the title-screen "Chapters" button lists every chapter and its tasks; picking one starts a run at that task. */
/* V228: each chapter starts collapsed (right arrow); tap its header to expand (down arrow) and show its tasks. */
/* V226: tasks you have not done yet show as locked (dashed, padlock) with their name hidden as ???. Double tap or double click one to unlock it, then tap to start. Done tasks, the task you are on in your save, and tasks you unlocked before are open. Unlocks are remembered on this device. */
const CHU_K='pledge.chapunlock.v1';
function chapUnlocked(){try{const a=JSON.parse(localStorage.getItem(CHU_K)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function chapUnlock(id){const L=chapUnlocked();if(!L.includes(id)){L.push(id);try{localStorage.setItem(CHU_K,JSON.stringify(L))}catch(e){}}}
function chapSelOpen(){
  const box=$('chapsel');if(!box)return;
  const body=$('chapbody');body.innerHTML='';
  let saved=null;try{saved=hasSave()?JSON.parse(localStorage.getItem(SAVEK)||'null'):null}catch(e){}
  const sd=(saved&&saved.S&&saved.S.done)||{},un=chapUnlocked();
  const cur=saved&&saved.S?M.filter(m=>m.ch===saved.S.ch&&m.main&&!m.auto).find(m=>!sd[m.id]):null;
  const first=M.find(m=>m.ch===1&&!m.side&&!m.auto);/* V230: the very first quest is always open */
  for(let c=1;c<=10;c++){
    const ms=M.filter(m=>m.ch===c&&!m.auto);if(!ms.length)continue;
    const sec=document.createElement('section');sec.className='chsec';
    const h=document.createElement('h3'),hb=document.createElement('button');hb.className='chhead';hb.type='button';hb.setAttribute('aria-expanded','false');
    const ar=document.createElement('span');ar.className='char';ar.textContent='\u25B6';const ht=document.createElement('span');ht.textContent='Chapter '+c+': '+CHN[c];hb.appendChild(ar);hb.appendChild(ht);h.appendChild(hb);sec.appendChild(h);
    const list=document.createElement('div');list.className='chlist';list.hidden=true;sec.appendChild(list);
    hb.onclick=()=>{const o=list.hidden;list.hidden=!o;ar.textContent=o?'\u25BC':'\u25B6';hb.setAttribute('aria-expanded',o?'true':'false')};
    const mains=ms.filter(m=>!m.side),sides=ms.filter(m=>m.side);
    const add=(m,label,tag)=>{
      const b=document.createElement('button');b.className='chtask';b.type='button';
      let open=!!(sd[m.id]||un.includes(m.id)||(cur&&cur.id===m.id)||(first&&first.id===m.id));
      const nm=document.createElement('span');nm.className='chn';b.appendChild(nm);
      const tg=document.createElement('span');tg.className='cht';b.appendChild(tg);
      const paint=()=>{b.classList.toggle('locked',!open);nm.textContent=(open?(sd[m.id]?'\u2713 ':''):'\uD83D\uDD12 ')+(open?label:'???');tg.textContent=open?tag:'Locked'};paint();
      let lastT=0,unlockedAt=0;
      b.onclick=()=>{const now=Date.now();
        if(open){if(now-unlockedAt<600)return;chapJump(m.id);return}
        if(now-lastT<450){open=true;unlockedAt=now;chapUnlock(m.id);paint();tg.textContent='Unlocked';setTimeout(paint,1400);return}
        lastT=now;tg.textContent='Double tap to unlock';setTimeout(()=>{if(!open)paint()},1600)};
      list.appendChild(b)};
    mains.forEach((m,i)=>add(m,(i+1)+'. '+m.name.replace(/^Side:\s*/,''),'Main'));
    sides.forEach(m=>add(m,m.name.replace(/^Side:\s*/,''),'Side'));
    body.appendChild(sec)}
  $('title').hidden=true;box.hidden=false;body.scrollTop=0;
  setTimeout(()=>{const f=body.querySelector('.chhead');f&&f.focus()},40)}
function chapSelClose(){const box=$('chapsel');if(!box||box.hidden)return;box.hidden=true;$('title').hidden=false;mode='title';slotsOpen()}
addEventListener('keydown',e=>{const box=$('chapsel');if(e.code==='Escape'&&box&&!box.hidden){e.preventDefault();e.stopPropagation();chapSelClose()}},true);

function chapJump(id){
  const m=M.find(x=>x.id===id);if(!m)return;
  audioInit();
  $('chapsel').hidden=true;$('title').hidden=true;{const se=$('slotsel');if(se)se.hidden=true}
  if(matchMedia('(pointer:coarse)').matches)$('touch').hidden=false;
  $('hud').hidden=false;mode='play';TC.pr=null;
  S=S0();setHat(0);
  /* everything the story would have finished before this task */
  const need=new Set(),addPre=mm=>{(mm.pre||[]).forEach(pid=>{if(need.has(pid))return;need.add(pid);const pm=M.find(x=>x.id===pid);pm&&addPre(pm)})};
  addPre(m);
  for(const x of M)if(!x.side&&x.ch<m.ch)S.done[x.id]=1;
  need.forEach(pid=>S.done[pid]=1);
  delete S.done[m.id];
  S.ch=m.ch;
  S.pledged=(m.ch>=2||S.done.c1decide)?1:0;
  if(S.pledged&&!S.prole){S.prole='pouch';S.prDay=1}
  if(m.ch>=2||S.done.cater||m.id==='cater')S.uMap=1;
  if(m.ch>=2||S.done.c1meet){S.uCliques=1;S.uClasses=1}
  if(m.ch>=2||m.bbm)S.bb=S.bb||'tank';
  S.lvl=Math.min(10,m.ch);S.xp=xpT(S.lvl);S.mhp=100+(S.lvl-1)*10;S.hp=S.mhp;S.money=5+(m.ch-1)*40;
  S.day=[1,1,3,5,6,8,10,12,15,16,24][m.ch]||1;
  const w=Array.isArray(m.when)?m.when[0]:null;S.gt=w!=null?w+.2:11;
  if(S.ch>=3)unlockLake();
  if(S.done.ram)placeRam();
  try{c1Migrate({done:S.done,pledged:S.pledged})}catch(e){console.warn(e)}
  setHat(S.pledged);refreshNamed();renderInv();
  P.x=77.9;P.z=76.9;P.face=PI/2;yaw=-PI/2;
  /* put Danny where the task begins: inside the giver's building, or outside near the spot */
  const who=mWho(m),n=who&&NN[who];
  if(n&&n.int&&INT[n.int])goIn(n.int);
  else{const p=m.at||(n?npcSpot(who):[77.9,76.9]);let done=0;
    for(const[dx,dz]of[[-2.5,0],[2.5,0],[0,2.5],[0,-2.5],[-4,0],[4,0],[0,4],[0,-4],[0,0]]){if(freeAt(p[0]+dx,p[1]+dz,.34)){goOut(p[0]+dx,p[1]+dz);done=1;break}}
    if(!done)goOut(p[0],p[1])}
  try{P.y=P.inside?P.y:terrH(P.x,P.z)}catch(e){}
  /* V92: a task flagged talkFirst (Meet the Brothers) is not started by the skip: Danny is dropped beside its giver, whose gold star / 'Task' option starts it the normal way */
  const go=()=>{if(m.talkFirst&&n){toast('Chapter '+m.ch+': talk to '+n.name+' to start \u201c'+m.name+'\u201d.',4200)}
  else{startMission(m);
  toast('Chapter '+m.ch+': '+m.name.replace(/^Side:\s*/,''),3200)}
  setTimeout(()=>{try{saveGame()}catch(e){}},4000)};
  /* V317: on the preview, a skip that lands with Danny already pledged lets the tester pick his pledge job from the full menu */
  if(S.pledged&&prPickOn())prPick(go);else go()}
/* V317 (preview only): pledge job menu shown after a chapter skip. Every job from PR, one tap to choose. */
function prPickOn(){return!!(window.PLEDGE_PREVIEW||/[?&]pickrole/.test(location.search))}
function prPick(done){const old=$('prpick');if(old)old.remove();mode='slots';const el=document.createElement('div');el.id='prpick';
  el.innerHTML=`<div class="prpk" role="dialog" aria-label="Pick a pledge job"><div class="prpkh"><b>Pick Danny's pledge job</b><span>Preview only · chapter skip</span></div><div class="prpkg">${PR_DANNY.map(k=>`<button class="prpkb" type="button" data-k="${k}" style="--rc:${PR[k].c};--rc2:${PR[k].c2}"><img src="${prIconURL(k)}" alt=""><span class="prpkt"><b>${PR[k].n}</b><small>${PR[k].d}</small><i>T: ${PR[k].ab}</i></span></button>`).join('')}</div></div>`;
  document.body.appendChild(el);
  const kd=e=>{if(e.code!=='F12')e.stopPropagation()};
  const fin=k=>{removeEventListener('keydown',kd,true);el.remove();S.prole=k;S.prDay=S.day;S.rs={};try{prApply()}catch(e){console.warn(e)}mode='play';toast(`You're the ${PR[k].n}. Press T: ${PR[k].ab}.`,3600);if(done)done()};
  el.querySelectorAll('.prpkb').forEach(b=>b.onclick=()=>fin(b.dataset.k));addEventListener('keydown',kd,true);
  setTimeout(()=>{const f=el.querySelector('.prpkb');if(f)f.focus()},40)}
