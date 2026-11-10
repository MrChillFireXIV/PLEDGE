/* tools/story-driver.js: helpers for driving quests with tools/run.js. Inject it first:
   node tools/run.js --lite "eval:$(tr -d '\n' < tools/story-driver.js)" "eval:chapJump('c3secret');1" "eval:T3.run()" ...  (give repeated evals a distinct tag, e.g. T3.run(40) vs T3.run(41), or their results overwrite each other)
   T3.run() clicks through cards (real-time waits between clicks), T3.prompts() / T3.doAll(/regex/) fire quest prompts, T3.press() completes a go step, T3.state().
   chapJump() already starts the quest: never call startMission() after it. The file is joined onto one line, so use only block comments in it. */
window.T3={
 click(k=0){const e=document.getElementById(mode==='wheel'?'wheel':mode==='card'?'card':'none');if(!e||e.hidden)return null;const b=[...e.querySelectorAll('button')];const t=b[Math.min(k,b.length-1)];if(t){t.click();return t.textContent.slice(0,40)}e.click&&e.click();return 'tap'},
 async run(n=40){const log=[],W=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<n;i++){const st=curStep();if(!AM){log.push('NO-AM');break}if(mode==='card'||mode==='wheel'){const c=T3.click();if(c)log.push('c:'+c);await W(450);RT.step(2);await W(150);continue}if(st&&(st.t==='card'||st.t==='fx'||st.t==='cine')){RT.step(2);await W(150);continue}break}const st=curStep();log.push('AT:'+(st?(st.t+':'+(st.label||st.act||(st.lab?st.lab().split('\n')[1]:''))).slice(0,70):'none'));return log},
 prompts(){const L=[];const add=(x,z,r,label,f)=>L.push({x,z,label,f});try{c3Prompts(add)}catch(e){L.push({label:'ERR '+e.message})}try{if(typeof c4Prompts==='function')c4Prompts(add)}catch(e){L.push({label:'ERR4 '+e.message})}for(const id in INT)for(const o of INT[id].objs)if(o.c3)L.push({x:o.x,z:o.z,label:o.label,f:o.f,int:id});return L},
 doAll(re){let k=0;for(let g=0;g<30;g++){const p=T3.prompts().find(p=>p.f&&(!re||re.test(p.label)));if(!p)break;p.f();k++;RT.step(1)}return k},
 press(){const st=curStep();if(st&&st.t==='go'){completeGo(st);RT.step(1);return 'pressed '+(st.act||st.label)}return 'not go'},
 state(){const st=curStep();return{m:AM&&AM.m.id,i:AM&&AM.i,t:st&&st.t,lab:st&&(st.lab?st.lab():st.label),mode,inside:P.inside}}};1
