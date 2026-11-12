// ================================================================ V344 TASKS TAB: status strip, in-progress cards and an "available" board
function tkDir(x,z){if(P.inside||P.z>OD||x==null||z>OD)return'';const dx=x-P.x,dz=z-P.z,d=Math.round(Math.hypot(dx,dz)),a=Math.atan2(dx,-dz);return d+' m '+['N','NE','E','SE','S','SW','W','NW'][Math.round(a/(PI/4)+8)%8]}
function tkWhere(m){const w=mWho(m),n=w&&NN[w];if(n)return['Talk to '+n.name,tkDir(n.x,n.z)];if(m.at)return[(m.side?'Blue':'Gold')+' star on your map',tkDir(m.at[0],m.at[1])];return['','']}
function tkStepHTML(st,esc){if(!st)return'';let t='';try{t=st.label!=null?(typeof st.label==='function'?st.label():st.label):st.lab!=null?(typeof st.lab==='function'?st.lab():st.lab):''}catch(e){}t=String(t||'').replace(/<[^>]+>/g,'').trim();if(!t)return'';
  const L=t.split('\n').map(x=>x.trim()).filter(Boolean),items=L.filter(x=>/^[✓○•\-]/.test(x)),head=L.filter(x=>!/^[✓○•\-]/.test(x)).join(' ');
  return(head?`<p class="tkstep">${esc(head)}</p>`:'')+(items.length?`<ul class="tkchk">${items.map(x=>{const dn=x[0]==='✓';return`<li class="${dn?'dn':''}"><span>${dn?'✓':''}</span>${esc(x.replace(/^[✓○•\-]\s*/,''))}</li>`}).join('')}</ul>`:'')}
function tkSideAvail(){return M.filter(m=>m.side&&!m.auto&&!S.done[m.id]&&S.ch>=m.ch&&(!m.pre||m.pre.every(mDone))&&(mWho(m)||m.at)&&!(AM&&AM.m===m))}
function tkPage(){const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const hr=Math.floor(S.gt)%24,night=hr>=20||hr<6,tod=hr<12?'Morning':hr<17?'Afternoon':hr<20?'Evening':'Night';
  const chip=(ic,lab,val,cls)=>`<div class="tkchip${cls?' '+cls:''}"><span><small>${lab}</small><b>${val}</b></span></div>`;
  let h=`<h2>Chapter ${Math.min(S.ch,4)}: ${CHN[Math.min(S.ch,5)]}</h2><div class="tkstrip">${chip('','Day '+S.day,DAYN[(S.day-1)%7]+(S.day%7===0||S.day%7===6?' · weekend':''))}${chip('',tod,fmtT(S.gt))}${chip('','Big Brother',S.bb?esc(BBN[S.bb][0]):'None yet')}${chip('','House standing',(S.standing>0?'+':'')+S.standing,S.standing>0?'up':S.standing<0?'down':'')}</div>`;
  /* in progress: the story quest and an odd job if one is running */
  const cur=[];if(AM){const st=curStep(),n=AM.steps.filter(s=>s.t!=='cine').length,i=AM.steps.slice(0,AM.i).filter(s=>s.t!=='cine').length;
    cur.push(`<div class="tkcard tknow ${AM.m.side?'side':'main'}"><div class="tktag">${AM.m.side?'Side story':'Main story'} · in progress</div><h4>${esc(AM.m.name)}</h4>${tkStepHTML(st,esc)}${n>1?`<div class="tkprog"><i style="width:${Math.round(i/n*100)}%"></i></div><small class="tkpn">Step ${Math.min(i+1,n)} of ${n}</small>`:''}</div>`)}
  if(typeof GIG!=='undefined'&&GIG.active){const g=GIG.active,T=GIGT[g.k];cur.push(`<div class="tkcard tknow odd"><div class="tktag">Odd job · $${g.pay}</div><h4>${esc(g.giver&&g.giver.name)}${T&&T.title?' · '+esc(T.title):''}</h4><p class="tkstep">${esc(T&&T.lab?T.lab(g):'')}</p></div>`)}
  h+=`<h3>In progress</h3>`+(cur.length?`<div class="tkgrid now">${cur.join('')}</div>`:`<p class="tkempty">Nothing right now. Pick something below.</p>`);
  /* available: next main task, side stories, odd jobs */
  const card=(cls,tag,name,where,dist,when)=>`<div class="tkcard ${cls}"><div class="tktag">${tag}</div><h4>${esc(name)}</h4><p>${esc(where)}${when?` <span class="tkwhen">${when}</span>`:''}</p>${dist?`<small class="tkdist">📍 ${dist}</small>`:''}</div>`;
  const L=[];for(const m of availM().filter(m=>!m.side)){const[w,d]=tkWhere(m);L.push(card('main','Main story',m.name,w,d,m.when?fmtH(m.when[0])+'–'+fmtH(m.when[1]):''))}
  for(const m of tkSideAvail()){const[w,d]=tkWhere(m);L.push(card('side','Side story',m.name.replace(/^Side:\s*/,''),w,d,m.when?fmtH(m.when[0])+'–'+fmtH(m.when[1]):''))}
  if(typeof GIG!=='undefined')for(const n of GIG.givers||[]){if(GIG.active&&GIG.active.giver===n||!n.gigOffer||!NP.includes(n))continue;L.push(card('odd','Odd job · $'+n.gigOffer.pay,n.name,(n.title||'').replace(/ · Odd job$/,'')+' · green $ on your map',tkDir(n.x,n.z),''))}
  h+=`<h3>Available${AM||GIG&&GIG.active?' <small class="tkh">· start one when your current task is done</small>':''}</h3>`+(L.length?`<div class="tkgrid">${L.join('')}</div>`:`<p class="tkempty">${S.ch>10?'The story is over. Campus is yours.':'Nothing new right now. Check back later.'}</p>`);
  return h}
