// ================================================================ V358 CONTROLS: one display for the title screen and the Planner (Settings › Controls)
// Two layouts, Keyboard & mouse and Touch, with a switch between them (phones open on Touch). Each is a set of group cards: key caps on the left,
// what it does on the right.
const CTRLS={kb:[
  ['Move',[['W A S D','Move','Arrow keys turn the camera'],['Shift','Sprint','Uses stamina'],['Space','Jump','Onto tables, benches and low walls'],['Q|Ctrl','Roll','You can\'t be hit mid-roll'],['C','Sneak','Slower, harder to spot'],['B','Bike','Get on or off']]],
  ['Fight',[['F|Left click','Punch','Three quick hits make a combo'],['R|Right click','Block','Hold. Blocked hits drain stamina, not health'],['T','Pledge job move','Once you\'ve pledged']]],
  ['World',[['E','Interact','Talk, enter buildings, use things, take photos'],['1 2 3','Use an item',''],['Z','Meditate','Time passes 8× faster. Press again to get up'],['Tab|M','Planner','Tasks, map, classes, skills']]],
  ['Camera & display',[['Mouse','Look around','Click to capture the mouse. Scroll to zoom'],['V','Reset camera','Snaps behind you'],['O','Graphics quality','High, Balanced, Performance'],['L','Graphics style','Enhanced or Classic'],['G','Shadows','On or off']]]],
 touch:[
  ['Move',[['Left stick','Move',''],['Drag right side','Look around',''],['Jump','Jump',''],['Roll','Roll','You can\'t be hit mid-roll']]],
  ['Fight',[['Hit','Punch','Three quick taps make a combo'],['Block','Block','Hold it down'],['Job button','Pledge job move','The panel under the minimap, once you\'ve pledged']]],
  ['World',[['Act','Interact','Talk, enter buildings, use things, take photos'],['1 2 3','Use an item','The three slots above the buttons'],['Notebook','Planner','The notebook icon on the quest panel']]],
  ['More (⋯ button)',[['Run','Sprint','Toggle'],['Sneak','Sneak','Slower, harder to spot'],['Bike','Bike','Get on or off'],['Cam','Reset camera',''],['Meditate','Meditate','Time passes 8× faster']]]]};
function ctrlHTML(dev){dev=dev||(document.body.classList.contains('mob')?'touch':'kb');
  const cap=k=>k.split('|').map(a=>`<kbd>${a}</kbd>`).join('<i>or</i>');
  return`<div class="ctrl" data-dev="${dev}"><div class="ctrlsw" role="tablist" aria-label="Control layout"><button type="button" role="tab" data-ctrl="kb" aria-selected="${dev==='kb'}" class="${dev==='kb'?'on':''}">Keyboard &amp; mouse</button><button type="button" role="tab" data-ctrl="touch" aria-selected="${dev==='touch'}" class="${dev==='touch'?'on':''}">Touch</button></div><div class="ctrlgrid">${CTRLS[dev].map(([g,L])=>`<section class="ctrlg"><h4>${g}</h4>${L.map(([k,n,d])=>`<div class="ctrlr"><span class="ctrlk">${cap(k)}</span><span class="ctrlt"><b>${n}</b>${d?`<small>${d}</small>`:''}</span></div>`).join('')}</section>`).join('')}</div></div>`}
/* the Keyboard / Touch switch works wherever the display is shown */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ctrl]');if(!b)return;const c=b.closest('.ctrl');if(!c)return;try{sfx('ui')}catch(_){}c.outerHTML=ctrlHTML(b.dataset.ctrl)});
/* title screen: a full panel instead of the old paragraph card */
function ctrlShow(back){let el=$('ctrlov');if(el)el.remove();el=document.createElement('div');el.id='ctrlov';el.innerHTML=`<div class="ctrlbox" role="dialog" aria-modal="true" aria-label="Controls"><div class="ctrlhd"><b>Controls</b><button type="button" class="ctrlx">Back</button></div><div class="ctrlbody">${ctrlHTML()}</div></div>`;
  document.body.appendChild(el);const done=()=>{removeEventListener('keydown',kd,true);el.remove();if(back)back()},kd=e=>{if(e.code==='Escape'){e.stopPropagation();done()}};el.querySelector('.ctrlx').onclick=done;addEventListener('keydown',kd,true);el.querySelector('.ctrlx').focus()}
