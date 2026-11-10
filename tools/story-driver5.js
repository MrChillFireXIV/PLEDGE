/* tools/story-driver5.js: drives chapter 5 and 6 quests end to end (inject tools/story-driver.js, then tools/story-driver4.js, then this). Set C4.auto=1 so the boards fill themselves.
   T5.go(n) loops like T4.go: clicks cards, presses go steps, walks Danny to each checklist item (inside or out) and fires it, wins the fights (shoots a few rifle rounds and molotovs first), and herds the ΦΔΘ brothers to the buses. Returns a log. */
window.T5={err:T4.err,shots:0,molos:0,async go(n=400){const log=[],W=ms=>new Promise(r=>setTimeout(r,ms));let last='',same=0;
 const put=p=>{p=c5At(p);if(!p)return;if(p.int){if(P.inside!==p.int)goIn(p.int);P.x=p.x+.9;P.z=p.z+.9}else{if(P.inside)goOut(p.x+.9,p.z+.9);else{P.x=p.x+.9;P.z=p.z+.9;P.y=terrH(P.x,P.z)}}};
 for(let i=0;i<n;i++){if(!AM){let k=0;while(!AM&&k++<14){await W(250);RT.step(2)}if(!AM){log.push('NO-AM ch='+S.ch);break}}const st=curStep();if(!st){RT.step(5);await W(20);continue}const lab=(st.label||st.title||(st.lab?st.lab().split('\n').filter(Boolean)[0]:'')||'').slice(0,64);const key=AM.m.id+':'+AM.i;
  if(key!==last){last=key;same=0;log.push(key+' '+st.t+' '+lab)}else same++;
  if(same>120){log.push('STUCK '+key+' mode='+mode+' '+lab+' '+JSON.stringify(T3.state()).slice(0,200));break}
  if(mode==='card'||mode==='wheel'){T3.click(i%3===1?1:0);await W(40);RT.step(3);continue}
  if(mode==='mg'){RT.step(10);await W(120);continue}
  if(mode==='play'&&st.t==='go'){T3.press();await W(20);continue}
  if(mode==='play'&&st.t==='cond'){
   if(st.c5items){const d=c5S().d,it=st.c5items.find(it=>!d[it.k]&&!it.busy&&(!it.need||it.need()));if(it){put(it.at());RT.step(2);c5Do(it)}else if(/Silas/.test(lab)||(C5.guard||[]).some(c4Live)){for(const g of C5.guard||[])if(c4Live(g)&&!g.down)hitNPC(g,999,'P')}RT.step(6);await W(30);continue}
   if(C5.w&&!C5.w.done){const live=C5.w.foes.filter(n=>c4Live(n)&&!n.down);if(C5.gun&&live.length){const t=live[0];P.face=Math.atan2(t.x-P.x,t.z-P.z);yaw=P.face+Math.PI;for(let k=0;k<3;k++){c5Shoot();T5.shots++}if(C5.molo>0&&T5.molos<4){c5Molotov();T5.molos++}}if(same>8)for(const f of live)hitNPC(f,999,'P');RT.step(10);await W(30);continue}
   if(/Return to Alpha|Alliance's announcement|ΑΣΡ house|throne room/.test(lab)&&!/^asr/.test(P.inside||''))goIn('asr');
   if(/Follow Vincent/.test(lab)&&typeof C6!=='undefined'&&C6.tail&&C6.tail.v){const v=C6.tail.v,w=C6PATH[Math.min(C6PATH.length-1,C6.tail.i)],d=Math.hypot(v.x-w[0],v.z-w[1])||1,k=C6.tail.pause>0?17:11;P.x=v.x-(w[0]-v.x)/d*k;P.z=v.z-(w[1]-v.z)/d*k;P.y=terrH(P.x,P.z)}
   if(/Union/.test(lab)&&P.inside!=='union')goIn('union');
   if(/ΦΔΘ brothers/.test(lab)){for(const p of C5.pdt||[])if(c4Live(p)){p.x=C5BUS[0]+1;p.z=C5BUS[1]+(Math.random()-.5)*4}}
   RT.step(20);await W(30);continue}
  RT.step(30);await W(st.t==='cine'&&mode==='play'?160:35)}
 log.push('END '+JSON.stringify(T3.state())+' ch='+S.ch+' shots='+T5.shots+' molos='+T5.molos);return log.join('\n')}};1
