// ================================================================ V395 the secret arcade: a faint ram sign in the corner of the title screen opens a menu to play
// any class game (at any grade), any pledge job trial, or the party games, straight from the title. Nothing played here touches a save:
// saving is blocked while it's open and the game state is put back exactly as it was afterwards.
let ARC=null;
function arcOpen(){if(mode!=='title')return;let el=$('arcov');if(el)el.remove();el=document.createElement('div');el.id='arcov';ARC={tab:ARC&&ARC.tab||'cls',g:ARC&&ARC.g||0};
  el.innerHTML=`<div class="ctrlbox arcbox" role="dialog" aria-modal="true" aria-label="Arcade"><div class="ctrlhd"><b>Arcade</b><button type="button" class="ctrlx">Back</button></div><div class="arctabs"></div><div class="ctrlbody arcbody"></div></div>`;document.body.appendChild(el);
  const kd=e=>{if(e.code==='Escape'&&mode==='title'){e.stopPropagation();arcClose()}};ARC.kd=kd;addEventListener('keydown',kd,true);el.querySelector('.ctrlx').onclick=arcClose;arcDraw()}
function arcClose(){const el=$('arcov');if(el)el.remove();if(ARC&&ARC.kd)removeEventListener('keydown',ARC.kd,true)}
function arcDraw(){const el=$('arcov');if(!el)return;const T=[['cls','Class games'],['pq','Pledge job trials'],['party','Party games']];
  el.querySelector('.arctabs').innerHTML=T.map(([k,n])=>`<button type="button" class="arct${ARC.tab===k?' on':''}" data-t="${k}">${n}</button>`).join('')+(ARC.tab==='cls'?`<span class="arcg">Grade ${[1,2,3].map(g=>`<button type="button" class="arcgb${ARC.g===g-1?' on':''}" data-g="${g-1}">${g}</button>`).join('')}</span>`:'');
  let h='';if(ARC.tab==='cls'){for(const col of COLK){const L=(COLCLS[col]||[]).filter(c=>CI[c]&&arcClsFn(c));if(!L.length)continue;h+=`<div class="arcsec"><h4 style="--c:${COLL[col].c}">${COLL[col].full||COLL[col].n}</h4><div class="arcgrid">${L.map(c=>`<button type="button" class="arci" data-c="${c}"><b>${CI[c].n}</b><span>${CI[c].prof||''}</span></button>`).join('')}</div></div>`}}
  else if(ARC.tab==='pq'){for(const k of PR_KEYS){const D=PQ[k];if(!D||!D.mg)continue;h+=`<div class="arcsec"><h4 style="--c:${PR[k].c}">${PR[k].n}</h4><div class="arcgrid">${D.mg.map((a,i)=>MGF[a[2]]?`<button type="button" class="arci" data-k="${k}" data-i="${i}"><b>${a[1]}</b><span>${D.host}</span></button>`:'').join('')}</div></div>`}}
  else h=`<div class="arcsec"><div class="arcgrid">${[['pong','Beer Pong','ΑΣΡ backyard'],['die','Beer Die','2 v 2 in the backyard'],['radio','WHRG Night Shift','Campus radio, six callers']].map(([e,n,s])=>`<button type="button" class="arci" data-e="${e}"><b>${n}</b><span>${s}</span></button>`).join('')}</div></div>`;
  const b=el.querySelector('.arcbody');b.innerHTML=h;
  el.querySelectorAll('.arct').forEach(x=>x.onclick=()=>{ARC.tab=x.dataset.t;sfx('ui');arcDraw()});el.querySelectorAll('.arcgb').forEach(x=>x.onclick=()=>{ARC.g=+x.dataset.g;sfx('ui');arcDraw()});
  b.querySelectorAll('.arci').forEach(x=>x.onclick=()=>{sfx('ui');if(x.dataset.c)arcClass(x.dataset.c);else if(x.dataset.k)arcTrial(x.dataset.k,+x.dataset.i);else arcParty(x.dataset.e)})}
function arcClsFn(c){const C=CI[c];return{econ:mgEcon,chem:mgChem,speech:mgSpeech,art:mgArt,phys:mgPhys}[c]||(C.mg&&MGF[C.mg]?(el,g,dn)=>MGF[C.mg](el,g,dn,c):null)}
/* run one game: keep the state to put back, block saves, hide the menu; when it ends show how it went and reopen the menu */
function arcRun(go){const bak=JSON.stringify(S),sb=SAVEBLOCK;SAVEBLOCK=1;arcClose();$('title').hidden=true;
  const back=(msg)=>{try{S=JSON.parse(bak)}catch(e){}SAVEBLOCK=sb;mode='title';$('title').hidden=false;arcOpen();if(msg)toast(msg,2600)};
  MGNEXTQ=close=>close(()=>back());try{go(back)}catch(e){console.warn(e);back('That game could not start from here.')}}
function arcClass(c){const C=CI[c],fn=arcClsFn(c),g=ARC.g;arcRun(back=>openMG(C.n+' · Grade '+(g+1)+' of 3',(C.bn||'')+' · '+(C.prof||'')+' · Arcade',(el,close)=>fn(el,g,(pass,sum)=>close(()=>back((pass?'Passed: ':'Not this time: ')+C.n)))))}
function arcTrial(k,i){const D=PQ[k],a=D.mg[i],id='pq_'+k+i,fn=MGF[a[2]];MGD[id]=Object.assign({prof:D.host},a[3]);arcRun(back=>openMG(a[1],PR[k].n+' trial · Arcade',(el,close)=>fn(el,ARC.g,(pass,sum)=>close(()=>back((pass?'Passed: ':'Not this time: ')+a[1])),id)))}
function arcParty(e){arcRun(back=>{const cb=r=>back();if(e==='pong')mgPong(cb);else if(e==='die')mgDie(cb);else mgRadio(cb)})}
{const b=$('tsecret');if(b)b.onclick=e=>{e.stopPropagation();audioInit();sfx('ui');arcOpen()}}
