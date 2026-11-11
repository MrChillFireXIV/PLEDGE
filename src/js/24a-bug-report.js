// ================================================================ V186 REPORT A BUG (Settings tab)
// Players describe the bug, attach a picture (a file, or a screenshot of the game as it is right now) and send it.
// Where it goes: BUG_URL below, or a URL saved in localStorage 'pledge.bugUrl' (handy for testing). Two kinds of address work:
//   • your own report server: tools/bug-server/server.js (POST <server>/api/bugs, JSON body; browse <server>/ to read reports)
//   • a Discord channel webhook (https://discord.com/api/webhooks/...): each report arrives as a message with the picture attached
// If nothing is set up, or sending fails, the player can download the report as a file instead.
const BUG_URL='https://discordapp.com/api/webhooks/1568170276447985734/rryOSkVmL6wQqJpnlKq-PUWPa-Z8HuvQPGxOYVFchdEKNBR6LDn6_OQMEktajNCcgUp5';
function bugUrl(){try{const v=localStorage.getItem('pledge.bugUrl');if(v)return v}catch(e){}return BUG_URL}
const BUG={img:null,busy:0};
function bugSection(){return`<h3>Report a bug</h3><div class="bugbox">
   <p>Found something broken? Tell us what happened and what you expected. A picture helps a lot.</p>
   <textarea id="bugtxt" maxlength="4000" rows="5" placeholder="What went wrong? Where were you and what were you doing?"></textarea>
   <div class="bugrow"><label class="btn ghost bugfile">🖼 Choose a picture<input type="file" id="bugfile" accept="image/*" hidden></label><button class="btn ghost" id="bugshot">📸 Use a screenshot of the game</button><button class="btn ghost" id="bugclr" hidden>Remove picture</button></div>
   <div id="bugprev" hidden><img id="bugimg" alt="Attached picture"></div>
   <div class="bugrow"><button class="btn" id="bugsend">Send report</button><span id="bugmsg" class="bugmsg"></span></div></div>`}
// shrink any picture to at most 1280 px wide, JPEG, so reports stay small
function bugShrink(src,cb){const im=new Image();im.onload=()=>{const k=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.82))};im.onerror=()=>cb(null);im.src=src}
function bugSetImg(d){BUG.img=d;const pv=$('bugprev');if(!pv)return;pv.hidden=!d;$('bugclr').hidden=!d;if(d)$('bugimg').src=d}
function bugMeta(){const st=typeof AM!=='undefined'&&AM?AM:null;return{ver:'v186',ch:S.ch,day:S.day,time:typeof fmtT==='function'&&S.gt!=null?fmtT(S.gt):'',quest:st?st.m.id+' / '+st.m.name+' (step '+(st.i+1)+')':'',inside:P.inside||'',pos:[+P.x.toFixed(1),+P.z.toFixed(1)],lvl:S.lvl,gfx:typeof GFX!=='undefined'?GFX:'',screen:innerWidth+'x'+innerHeight,ua:navigator.userAgent}}
function bugDownload(rep){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(rep,null,1)],{type:'application/json'}));a.download='pledge-bug-'+Date.now()+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
async function bugSend(rep){const url=bugUrl();if(!url)throw new Error('not set up');
  if(/discord(app)?\.com\/api\/webhooks\//.test(url)){const fd=new FormData(),m=rep.meta;fd.append('payload_json',JSON.stringify({username:'PLEDGE bug report',content:('**Bug report**\n'+rep.text).slice(0,1800)+'\n```'+['Chapter '+m.ch+' · day '+m.day+' · '+m.time,'Quest: '+(m.quest||'none'),'Where: '+(m.inside||'outdoors')+' '+m.pos.join(','),'Lv '+m.lvl+' · '+m.gfx+' · '+m.screen].join('\n')+'```'}));
    if(rep.image){const b=await (await fetch(rep.image)).blob();fd.append('files[0]',b,'screenshot.jpg')}const r=await fetch(url,{method:'POST',body:fd});if(!r.ok)throw new Error('HTTP '+r.status);return}
  const r=await fetch(url.replace(/\/+$/,'')+(/\/api\/bugs$/.test(url)?'':'/api/bugs'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(rep)});if(!r.ok)throw new Error('HTTP '+r.status)}
function bugWire(p){const f=$('bugfile');if(!f)return;const msg=t=>{$('bugmsg').textContent=t};
  f.onchange=()=>{const file=f.files&&f.files[0];if(!file)return;if(!/^image\//.test(file.type)){msg('That file isn\'t a picture.');return}const fr=new FileReader();fr.onload=()=>bugShrink(fr.result,d=>{bugSetImg(d);msg(d?'':'Couldn\'t read that picture.')});fr.readAsDataURL(file);f.value=''};
  $('bugshot').onclick=()=>{sfx('ui');try{const pl=$('planner');pl.style.visibility='hidden';R.render(sc,cam);const d=R.domElement.toDataURL('image/jpeg',.85);pl.style.visibility='';bugShrink(d,x=>{bugSetImg(x);msg(x?'Screenshot attached.':'Couldn\'t take a screenshot.')})}catch(e){$('planner').style.visibility='';msg('Couldn\'t take a screenshot.')}};
  $('bugclr').onclick=()=>{sfx('ui');bugSetImg(null);msg('')};if(BUG.img)bugSetImg(BUG.img);
  $('bugsend').onclick=async()=>{if(BUG.busy)return;const text=$('bugtxt').value.trim();if(text.length<4){msg('Please describe the bug first.');return}
    const rep={text,image:BUG.img,meta:bugMeta(),at:new Date().toISOString()};BUG.busy=1;msg('Sending…');$('bugsend').disabled=true;
    try{await bugSend(rep);sfx('coin');msg('Thanks! Your report was sent.');$('bugtxt').value='';bugSetImg(null)}
    catch(e){msg(bugUrl()?'Couldn\'t reach the report server.':'Bug reporting isn\'t connected yet.');const q=$('bugmsg');const b=document.createElement('button');b.className='btn ghost';b.textContent='Download the report instead';b.onclick=()=>bugDownload(rep);q.appendChild(document.createTextNode(' '));q.appendChild(b)}
    finally{BUG.busy=0;$('bugsend').disabled=false}}}
// ================================================================ V189 EXPORT / IMPORT SAVE
// The save lives in this browser (localStorage SAVEK). Export downloads it as a small .json file; Import loads one back,
// so progress moves between versions of the game, folders, browsers or computers. Available in Settings and on the title screen.
function saveFileData(){let raw=null;try{raw=localStorage.getItem(SAVEK)}catch(e){}if(!raw)return null;let d;try{d=JSON.parse(raw)}catch(e){return null}
  return{game:'PLEDGE',kind:'save',savedAt:new Date().toISOString(),ch:d.S&&d.S.ch,day:d.S&&d.S.day,save:d}}
function saveExport(){if(mode!=='title')saveGame();const f=saveFileData();if(!f){toast('There is no save to export yet.',2600);return false}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(f)],{type:'application/json'}));a.download='PLEDGE-save-ch'+(f.ch||1)+'-day'+(f.day||1)+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);toast('Save exported.',2200);return true}
function saveImportPick(done){const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json';inp.style.display='none';document.body.appendChild(inp);
  inp.onchange=()=>{const file=inp.files&&inp.files[0];inp.remove();if(!file)return;const fr=new FileReader();fr.onload=()=>{let f;try{f=JSON.parse(fr.result)}catch(e){toast('That file isn\'t a PLEDGE save.',3000);return}
      const d=f&&f.save&&f.save.S?f.save:f&&f.S?f:null;if(!d){toast('That file isn\'t a PLEDGE save.',3000);return}
      try{localStorage.setItem(SAVEK,JSON.stringify(d))}catch(e){toast('Couldn\'t store the save in this browser.',3000);return}done&&done(d)};fr.readAsText(file)};inp.click()}
function saveSection(){return`<h3>Your save</h3><p>Your progress is stored in this browser. Export it to keep a copy or to move it to a new version of the game, another browser or another computer. Exporting also saves the game right now; a task you're partway through starts over when you continue.</p>
  <div class="setq"><button class="btn ghost" id="svexp">⬇ Export save</button><button class="btn ghost" id="svimp">⬆ Import save</button><span id="svmsg" class="bugmsg"></span></div>`}
function saveWire(){const e=$('svexp');if(!e)return;e.onclick=()=>{sfx('ui');if(saveExport())$('svmsg').textContent='Saved and exported.'};
  $('svimp').onclick=()=>{sfx('ui');const q=$('svmsg');q.innerHTML='<span>Importing replaces your current progress.</span> <button class="btn danger" id="svyes">Choose a save file</button> <button class="btn ghost" id="svno">Cancel</button>';
    $('svno').onclick=()=>{q.textContent=''};$('svyes').onclick=()=>saveImportPick(d=>{q.textContent='Save imported (chapter '+(d.S.ch||1)+', day '+(d.S.day||1)+'). Reloading…';setTimeout(()=>location.reload(),900)})}}
// ================================================================ V302 DEVELOPER BUG REPORT (Report a Bug tab, clicked 3 times fast)
// A dark version of the bug form for the developer. Password-gated (the password is checked by hash, not stored in plain text; this
// keeps players out of it, it is not real security). Submit builds a prompt with the description plus everything useful about the game
// right now (version, chapter, quest and step, where, graphics, recent errors), copies it, and opens the PLEDGE Claude conversation
// in a new tab: paste (Ctrl+V) and press Enter to send it as a prompt. The conversation link can be changed in the panel.
const DEVCHAT='https://claude.ai/code/session_01EjpaRCuhtyusSZFv6EwSez',DEVH='87e4ba65';
const DEV={taps:[],img:null,errs:[]};
function devHash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16)}
function devChat(){try{return localStorage.getItem('pledge.devChat')||DEVCHAT}catch(e){return DEVCHAT}}
function devOn(){try{return sessionStorage.getItem('pledge.dev')==='1'}catch(e){return false}}
// keep the last few errors for reports
(function devErrHook(){const push=t=>{DEV.errs.push(new Date().toTimeString().slice(0,8)+' '+String(t).slice(0,180));if(DEV.errs.length>8)DEV.errs.shift()};
  try{addEventListener('error',e=>push((e.message||'error')+(e.filename?' @'+e.filename.split('/').pop()+':'+e.lineno:'')));addEventListener('unhandledrejection',e=>push('promise: '+(e.reason&&e.reason.message||e.reason)));
    const ce=console.error.bind(console);console.error=(...a)=>{try{push(a.map(x=>x&&x.message||String(x)).join(' '))}catch(e){}ce(...a)}}catch(e){}})();
// the tab button: 3 clicks within 1.5 s opens developer mode
function bugDevTap(){const t=performance.now();DEV.taps=DEV.taps.filter(x=>t-x<1500);DEV.taps.push(t);if(DEV.taps.length>=3){DEV.taps=[];devOpen();return true}return false}
function devOpen(){renderPlanner('bug');const pl=$('planner');if(pl)pl.classList.add('bugdev');const p=$('npage');if(!p)return;
  if(!devOn()){p.innerHTML=`<h2>Developer mode</h2><div class="bugbox"><p>Enter the developer password.</p><div class="bugrow"><input id="devpw" type="password" autocomplete="off" maxlength="40" aria-label="Developer password"><button class="btn" id="devgo">Unlock</button></div><span id="devmsg" class="bugmsg"></span></div>`;
    const go=()=>{const v=$('devpw').value.trim();if(devHash(v)===DEVH){try{sessionStorage.setItem('pledge.dev','1')}catch(e){}sfx('coin');devOpen()}else{sfx('bad');$('devmsg').textContent='Wrong password.';$('devpw').select()}};
    $('devgo').onclick=go;$('devpw').onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')go()};setTimeout(()=>{try{$('devpw').focus()}catch(e){}},30);return}
  p.innerHTML=`<h2>Developer bug report</h2><div class="bugbox">
   <p>Goes to Claude as a prompt. Game details are added automatically (shown below).</p>
   <input id="devtitle" maxlength="120" placeholder="Short summary (e.g. Beam stuck on Greek Row)" aria-label="Summary">
   <textarea id="devtxt" maxlength="3000" rows="5" placeholder="What happened, and what should happen instead?"></textarea>
   <div class="bugrow"><span class="devlbl">Severity</span><label><input type="radio" name="devsev" value="minor" checked> Minor</label><label><input type="radio" name="devsev" value="major"> Major</label><label><input type="radio" name="devsev" value="blocker"> Blocker</label></div>
   <div class="bugrow"><button class="btn ghost" id="devshot">📸 Take a screenshot of the game</button><button class="btn ghost" id="devclr" hidden>Remove screenshot</button></div>
   <div id="devprev" hidden><img id="devimg" alt="Screenshot for the report"></div>
   <details class="devdet"><summary>Game details that will be included</summary><pre id="devmeta"></pre></details>
   <div class="bugrow"><button class="btn" id="devsend">Submit to Claude</button><button class="btn ghost" id="devcopy">Copy only</button><button class="btn ghost" id="devcpimg" hidden>Copy screenshot</button></div>
   <span id="devmsg" class="bugmsg"></span>
   <details class="devdet"><summary>Conversation link</summary><div class="bugrow"><input id="devurl" aria-label="Conversation link"><button class="btn ghost" id="devurlsave">Save</button><button class="btn ghost" id="devlock">Lock developer mode</button></div></details></div>`;
  const msg=t=>{$('devmsg').textContent=t};$('devmeta').textContent=devMeta();$('devurl').value=devChat();
  for(const id of['devtitle','devtxt','devurl'])$(id).onkeydown=e=>e.stopPropagation();
  const setImg=d=>{DEV.img=d;$('devprev').hidden=!d;$('devclr').hidden=!d;$('devcpimg').hidden=!d;if(d)$('devimg').src=d};setImg(DEV.img);
  $('devshot').onclick=()=>{sfx('ui');try{const pl=$('planner');pl.style.visibility='hidden';R.render(sc,cam);const d=R.domElement.toDataURL('image/png');pl.style.visibility='';bugShrink(d,x=>{setImg(x);msg(x?'Screenshot ready. After pasting the report, press Copy screenshot and paste it too.':'Couldn\'t take a screenshot.')})}catch(e){$('planner').style.visibility='';msg('Couldn\'t take a screenshot.')}};
  $('devclr').onclick=()=>{setImg(null);msg('')};
  $('devurlsave').onclick=()=>{const v=$('devurl').value.trim();try{if(v)localStorage.setItem('pledge.devChat',v);else localStorage.removeItem('pledge.devChat')}catch(e){}msg('Saved.')};
  $('devlock').onclick=()=>{try{sessionStorage.removeItem('pledge.dev')}catch(e){}DEV.img=null;renderPlanner('bug')};
  const build=()=>{const t=$('devtxt').value.trim(),ti=$('devtitle').value.trim(),sev=(document.querySelector('input[name=devsev]:checked')||{}).value||'minor';
    return 'PLEDGE dev bug report ['+sev+']'+(ti?': '+ti:'')+'\n\n'+(t||'(no description)')+'\n\n--- Game details ---\n'+devMeta()+(DEV.img?'\nScreenshot: pasted below':'')};
  const copy=async txt=>{try{await navigator.clipboard.writeText(txt);return true}catch(e){try{const a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();return ok}catch(e2){return false}}};
  $('devcopy').onclick=async()=>{if($('devtxt').value.trim().length<3&&!$('devtitle').value.trim()){msg('Write what went wrong first.');return}msg(await copy(build())?'Copied. Paste it into the Claude conversation.':'Couldn\'t copy. Select the details and copy them by hand.')};
  $('devsend').onclick=async()=>{if($('devtxt').value.trim().length<3&&!$('devtitle').value.trim()){msg('Write what went wrong first.');return}const ok=await copy(build());
    let w=null;try{w=window.open(devChat(),'_blank');if(w)w.opener=null}catch(e){}
    if(!ok){msg('Couldn\'t copy. Use Copy only, or select the details by hand.');return}sfx('coin');
    msg(w?'Report copied. In the Claude tab: click the message box, press Ctrl+V, then Enter.'+(DEV.img?' Then come back here for Copy screenshot.':''):'Report copied, but the browser blocked the new tab. Open the conversation link (below) and paste it there.')};
  $('devcpimg').onclick=async()=>{if(!DEV.img)return;try{const b=await (await fetch(DEV.img)).blob(),png=b.type==='image/png'?b:await new Promise(r=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);c.toBlob(r,'image/png')};im.src=DEV.img});
      await navigator.clipboard.write([new ClipboardItem({'image/png':png})]);msg('Screenshot copied. Paste it into the Claude conversation.')}catch(e){msg('Couldn\'t copy the screenshot in this browser.')}}}
function devMeta(){const L=[];const add=(k,v)=>{if(v!=null&&v!=='')L.push(k+': '+v)};let sv='';try{sv=localStorage.getItem('pledge.siteVersion')||''}catch(e){}
  add('Version',window.__pledgeVer||sv||'local file (not the hosted site)');add('Site',location.href.split('#')[0]);
  try{add('Chapter',S.ch+((typeof CHN!=='undefined'&&CHN[S.ch])?' · '+CHN[S.ch]:''));add('Day',(typeof DAYN!=='undefined'?DAYN[(S.day-1)%7]+' ':'')+(typeof fmtT==='function'?fmtT(S.gt):'')+' (day '+S.day+')')}catch(e){}
  try{if(AM){const st=curStep();add('Quest',AM.m.id+' · '+AM.m.name);let lb='';try{lb=st?(typeof st.lab==='function'?st.lab():st.lab||st.label||''):''}catch(e){}add('Step',(AM.i+1)+' of '+(AM.steps?AM.steps.length:'?')+(st?' ('+st.t+(lb?': '+String(lb).replace(/\s+/g,' ').slice(0,140):'')+')':''))}else add('Quest','none active')}catch(e){}
  try{add('Where',P.inside?P.inside+' (inside)':'outdoors'+(typeof terrSub==='function'&&terrSub(P.x,P.z)?' · '+terrSub(P.x,P.z):''));add('Position',P.x.toFixed(1)+', '+P.z.toFixed(1)+' facing '+(P.face*180/Math.PI).toFixed(0)+'°')}catch(e){}
  try{add('Player','Lv '+S.lvl+' · HP '+Math.round(S.hp)+'/'+S.mhp+' · $'+S.money+' · pledged '+(S.pledged?'yes':'no'))}catch(e){}
  try{const g=R.getContext(),d=g.getExtension('WEBGL_debug_renderer_info');add('Graphics',GFX+' · '+(d?String(g.getParameter(d.UNMASKED_RENDERER_WEBGL)).replace(/^ANGLE \(|\)$/g,'').slice(0,90):'?')+' · '+((($('fps')||{}).textContent||'').split('·')[0].trim()))}catch(e){}
  try{add('Scene',NP.filter(n=>n.g&&n.g.visible).length+' people visible · '+R.info.memory.textures+' textures · mode '+mode)}catch(e){}
  try{add('Save slot',SAVEK)}catch(e){}add('Screen',innerWidth+'x'+innerHeight);add('Browser',(navigator.userAgent.match(/(Edg|OPR|Chrome|Firefox|Safari)\/[\d.]+/)||[''])[0]+' · '+(navigator.platform||''));
  L.push('Recent errors: '+(DEV.errs.length?'\n  '+DEV.errs.slice(-5).join('\n  '):'none'));return L.join('\n')}
