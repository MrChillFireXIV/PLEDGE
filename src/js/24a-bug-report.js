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
