// ================================================================ V210 THREE SAVE SLOTS
// Slot 1 keeps the old key, so existing saves show up there. The title screen's New semester / Continue open a picker that
// shows each slot's chapter, current quest, in-game day and total time played (S.playT, counted while the game runs).
const SLOTN=3,slotKey=i=>i===1?'pledge.save.v1':'pledge.save.s'+i;
function curSlot(){try{return clamp(+localStorage.getItem('pledge.slot')||1,1,SLOTN)}catch(e){return 1}}
function setSlot(i){try{localStorage.setItem('pledge.slot',String(i))}catch(e){}SAVEK=slotKey(i)}
function slotData(i){try{const d=JSON.parse(localStorage.getItem(slotKey(i))||'null');return d&&d.S?d:null}catch(e){return null}}
function fmtPlay(s){s=Math.max(0,Math.round(s||0));const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+' h '+m+' min':m?m+' min':'under a minute'}
function saveMeta(){let quest='';try{if(AM&&AM.m)quest=AM.m.name;else{const m=availM().find(m=>m.main)||availM()[0];if(m)quest=m.name}}catch(e){}
  const ch=S.ch||1;return{ch,chName:(typeof CHN!=='undefined'&&CHN[ch])||'',quest,day:S.day,gt:S.gt,playT:S.playT||0,at:Date.now()}}
function slotRow(i){const d=slotData(i),m=d&&(d.meta||{ch:d.S.ch,chName:(CHN[d.S.ch]||''),quest:'',day:d.S.day,gt:d.S.gt,playT:d.S.playT||0,at:0});
  if(!d)return`<div class="slotc empty" data-i="${i}"><div class="sh"><b>Save ${i}</b><span>Empty</span></div><p>No semester here yet.</p><div class="sb"><button class="btn" data-a="new">New semester</button><button class="btn ghost" data-a="chap">Chapters</button><button class="btn ghost" data-a="imp">Import save</button></div></div>`;
  const when=m.at?new Date(m.at).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'';
  return`<div class="slotc" data-i="${i}"><div class="sh"><b>Save ${i}</b><span>${when?'Saved '+when:''}</span></div>
    <div class="sch">Chapter ${m.ch}${m.chName?': '+m.chName:''}</div>
    <div class="sq">★ ${m.quest?m.quest.replace(/^Side: /,''):'Between quests'}</div>
    <div class="sm">Day ${m.day||1}${m.gt!=null?' · '+fmtT(m.gt):''} · Played ${fmtPlay(m.playT)}</div>
    <div class="sb"><button class="btn" data-a="go">Continue</button><button class="btn ghost" data-a="new">New semester</button><button class="btn ghost" data-a="chap">Chapters</button><button class="btn ghost" data-a="imp">Import save</button><button class="btn ghost" data-a="del">Delete</button></div></div>`}
function slotsOpen(){const el=$('slotsel');if(!el)return;
  el.innerHTML=`<div class="paper slotpaper"><div class="ctitle">Choose a save</div><div class="csp">Saves happen when you sleep in your bunk or save and quit.</div>
    <button class="btn ghost" id="slotback">Back</button><div class="slots3">${[1,2,3].map(slotRow).join('')}</div></div>`;
  el.hidden=false;$('slotback').onclick=()=>{sfx('ui');el.hidden=true};
  el.querySelectorAll('.slotc button').forEach(b=>b.onclick=()=>{const c=b.closest('.slotc'),i=+c.dataset.i,a=b.dataset.a;sfx('ui');
    if(((a==='new'||a==='imp')&&slotData(i))||a==='del'){if(b.dataset.arm!=='1'){const t0=b.textContent;b.dataset.arm='1';b.textContent=a==='del'?'Delete this save?':'Overwrite this save?';b.classList.add('danger');setTimeout(()=>{if(b.isConnected){b.dataset.arm='';b.textContent=t0;b.classList.remove('danger')}},3500);return}}
    if(a==='chap'){setSlot(i);el.hidden=true;chapSelOpen();return}
    if(a==='imp'){setSlot(i);saveImportPick(d=>{slotsOpen();titleSync()});return}
    if(a==='del'){try{localStorage.removeItem(slotKey(i))}catch(e){}slotsOpen();titleSync();return}
    slotStart(i,a==='new')})}
function slotStart(i,fresh){setSlot(i);if(fresh)try{localStorage.removeItem(slotKey(i))}catch(e){}
  // a game already ran this session: reload so the world starts clean for this save
  if(window.__played){try{sessionStorage.setItem('pledge.auto',fresh?'new':'go')}catch(e){}location.reload();return}
  const el=$('slotsel');if(el)el.hidden=true;window.__played=1;begin(fresh)}
function titleSync(){const n=$('bnew');if(n)n.textContent='Start'}
function slotsBoot(){titleSync();$('bnew').onclick=()=>{sfx('ui');const el=$('slotsel');if(el&&!el.hidden)el.hidden=true;else slotsOpen()};
  let a=null;try{a=sessionStorage.getItem('pledge.auto');sessionStorage.removeItem('pledge.auto')}catch(e){}if(a){window.__played=1;begin(a==='new')}}
