/* tools/story-driver4.js: drives chapter 4 quests end to end (inject tools/story-driver.js first, then this). Set C4.auto=1 so the small games play themselves.
   T4.go(n) loops: clicks cards, presses go steps, fires prompts, moves Danny between floors when a step needs it, and steps the sim 1 s at a time. Returns a log of the steps it passed. */
(()=>{const w=console.warn;console.warn=(...a)=>{try{T4.err.push(a.map(x=>x&&x.stack?String(x.stack).split('\n').slice(0,3).join(' | '):String(x)).join(' ').slice(0,400))}catch(e){}w.apply(console,a)}})();window.T4={err:[],async go(n=300){const log=[],W=ms=>new Promise(r=>setTimeout(r,ms));let last='',same=0;
 for(let i=0;i<n;i++){if(!AM){let k=0;while(!AM&&k++<12){await W(250);RT.step(2)}if(!AM){log.push('NO-AM ch='+S.ch);break}}const st=curStep();if(!st){RT.step(5);await W(20);continue}const lab=(st.label||st.title||(st.lab?st.lab().split('\n').filter(Boolean)[0]:'')||'').slice(0,60);const key=AM.m.id+':'+AM.i;
  if(key!==last){last=key;same=0;log.push(key+' '+st.t+' '+lab)}else same++;
  if(same>90){log.push('STUCK '+key+' mode='+mode+' '+lab);break}
  if(mode==='card'||mode==='wheel'){T3.click(0);await W(40);RT.step(3);continue}
  if(mode==='mg'){RT.step(10);await W(120);continue}
  if(mode==='play'&&st.t==='go'){T3.press();await W(20);continue}
  if(mode==='play'&&st.t==='cond'){if(/Go home/.test(lab)&&P.inside!=='asr')goIn('asr');if(/Brett/.test(lab)){if(!c4S().clue.coat){if(P.inside!=='asr')goIn('asr')}else if(P.inside!=='asr_top')goIn('asr_top')}if(/run the party|side piece/.test(lab)&&P.inside!=='asr')goIn('asr');if(P.inside&&st.goal&&!/Go home|Brett|run the party|side piece/.test(lab)){const g=st.goal();if(g&&g[1]<INTZ)goOut(g[0],g[1])}{const p=T3.prompts().find(p=>p.f);if(p)p.f()}RT.step(20);await W(30);continue}
  if(C4.cprUpd||C4.eggUpd||C4.tugUpd||C4FB.on){RT.step(4);await W(4);same-=.97}else{RT.step(30);await W(st.t==='cine'&&mode==='play'?160:35)}}
 log.push('END '+JSON.stringify(T3.state())+' ch='+S.ch);return log.join('\n')}};1
