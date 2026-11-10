// ================================================================ V162 CHAPTER 9 · HELL WEEK, part 2: scenes, quests
// Dialogue uses the conversation box: c8Lines([[npc,text],[DANNY,text],[null,narration,secs],wait,fn]) and c8Choose for choices.
const c9Cn=(f,o)=>({t:'cine',run:d=>c8Cine(f,d,o)});
const c9Go=(label,pf,o={})=>go([0,0],label,Object.assign({r:2.4,goal:()=>{const p=pf();return[p.x,p.z]},start:()=>{const st=curStep(),p=pf();st.x=p.x;st.z=p.z;if(o.st)o.st()}},o));
const c9Note=(title,text,btn)=>fin=>{card({title,sp:'',alert:1,text,ch:[[btn||'Keep going',null]]});fin()};
const c9AtK=(k,dx,dz)=>()=>{const n=c9K(k)||c9F(k);return n?{int:P.inside==='c9pit'?'c9pit':'asr',x:n.x+(dx||0),z:n.z+(dz||0)}:c9A(24,16)};
const c9F=k=>Object.values(C4.cast).find(n=>c4Live(n)&&n.c9f===k);
const c9Bad=(n,t,w=2)=>[()=>c9Wax(-w,'Wrong answer'),[n,t]];
// a quiz in the conversation box: wrong answers cost a little wax and the question comes back
async function c9Quiz(n,title,Q){for(const[q,opts]of Q){await c8Choose(n,title,(n&&n.name?n.name.replace(/ ·.*/,'')+': ':'')+'"'+q+'"',opts.map(([l,ok,r])=>[l,ok,ok?null:c9Bad(n,r||'Wrong.')]));try{sfx('ok')}catch(e){}}}
// one award per source, even after a reload
function c9Award(key,d,why){const S9=c9S();S9.aw=S9.aw||{};if(S9.aw[key])return;S9.aw[key]=1;c9Wax(d,why);c9WaxA(d*.95)}

// ---------------------------------------------------------------- who stands where, each day (house-relative)
const C9DAY={1:[['grant',24,7.6,0],['carter',20,16,PI/2],['logan',30,16,-PI/2],['ezra',12,24,PI/2],['marcus',30,27,-PI/2]],
  2:[['carter',24,16,0],['logan',44,16,-PI/2],['ezra',58,12,0],['marcus',8,24,PI/2]],
  3:[],4:[],
  5:[['grant',24,7.6,0],['carter',30.4,12,-PI/2],['logan',27,11.6,PI/2],['ezra',20,11,PI/2],['marcus',16,8,PI/2],['tank',40,16,-PI/2]],
  6:[['grant',24,3.2,0],['carter',20.4,6.4,.5],['logan',27.6,6.4,-.5],['ezra',18,12,PI*.8],['marcus',30,12,-PI*.8]],
  7:[['grant',24,24,PI],['carter',24,16,0],['logan',36,24,-PI/2],['ezra',20,27,PI/2],['marcus',28,27,-PI/2]]};
function c9DayCast(n){for(const[k,x,z,a]of C9DAY[n]||[])c9Need(k,x,z,a)}
function c9DayFx(n){const S9=c9S();S9.lit=1;try{c6GrantHide(1)}catch(e){}c9Dark(0);c9Blind(0);c9Bandana(PM,0);if(P.inside!=='asr'&&n!==3&&n!==4)goIn('asr',24,25);if(S9.day>=n)c9DayCast(n);c9HudDraw(1)}
// morning: Danny wakes in his bunk, the candle is shorter, a new day starts
async function c9Morning(n,title,after){const S9=c9S();if(S9.day>=n){c9DayCast(n);return}
  await c4Fade(async()=>{c4Off('c9c');c4Off('c9m');c4Off('c9v');for(const k in C9.g)c9Del(k);c9Dark(0);c9Blind(0);c9Bandana(PM,0);goIn('asr',3.4,6);c4At(8.4);
    c4DanAt(...c9AX(2.5,4.6),0);C4.dan.lean=PI/2;C4.dan.y=.6;c4Shot(c9AW(7.4,2.4,9.4),c9AW(2.6,.7,4.6),0)});
  S9.day=n;if(n>1){c9Wax(-12,'',1);c9WaxA(-12)}c9HudDraw(1);big('DAY '+n+' · '+title.toUpperCase(),2600);await c4Wt(1.6);
  await c8Lines([[null,n>1?'Morning. Danny\'s candle is shorter than he left it.':'Day one.',2.6]]);C4.dan.lean=0;C4.dan.y=0;c4DanTo(...c9AX(5,7.6),1.6);await c4Wt(1.2);c9DayCast(n);if(after)await after()}
// check your candle: a close look at the three flames on the table
async function c9CheckCandle(fin){await c8Cine(async()=>{c4Shot(c9AW(19.2,1.5,21.9),c9AW(16.75,1.05,20.45),0);const W=c9S().wax;await c4Wt(.8);
  await c8Lines([[null,`Danny: ${Math.round(W.danny)}%. Ezra: ${Math.round(W.ezra)}%. Marcus: ${Math.round(W.marcus)}%. Three flames, three separate fights.`,3.4]])},fin)}
// night: two hooded brothers, the bandana, the basement stairs
async function c9Escort(n,title,done){await c8Cine(async()=>{if(S.gt<23&&S.gt>5)c4At(23.2);if(P.inside!=='asr')goIn('asr',3.4,6);c4Off('c9c');
  c4DanAt(...c9AX(2.5,4.6),0);C4.dan.lean=PI/2;C4.dan.y=.6;c4Shot(c9AW(7.6,2.2,9.2),c9AW(2.6,.8,4.8),0);await c8Lines([[null,'Lights out. Danny lies awake, waiting for it.',2.6]]);
  const a=c9Fig('shade',9,10,PI*1.2,'A hooded brother',{int:'asr',tag:'c9x'}),b=c9Fig('shade',10.6,11,PI*1.25,'A hooded brother',{int:'asr',tag:'c9x'});c4To(a,...c9AX(3.6,5.4),1.6);c4To(b,...c9AX(4.2,7),1.6);try{noise(.4,.05,700)}catch(e){}await c4Wt(2.6);
  await c8Lines([[a,n===1?'Up. Hell Week doesn\'t stop at sundown.':['','','Up. Again.','Up, Kowalski.','Up. You know the drill.','Up. Bandana.','Up. Last one.'][n-1]]]);
  C4.dan.lean=0;C4.dan.y=0;c9Bandana(PM,1);try{noise(.25,.06,1800)}catch(e){}c4Shot(c9AW(4.4,1.75,6.4),c9AW(2.8,1.55,4.8),1);await c4Wt(1.2);
  c4DanTo(...c9AX(6,16),1.3);c4To(a,...c9AX(5.2,15),1.3);c4To(b,...c9AX(7,17),1.3);c4Shot(c9AW(10,2.4,18),c9AW(5,1.2,15),1);await c4Wt(3);c4DanTo(...c9AX(1.8,16),1.2);c4To(a,...c9AX(2.4,15.2),1.2);await c4Wt(1.8);
  c9Blind(1);await c4Wt(.6);await c8Lines([[null,'Down the basement stairs. Danny counts the steps. Twenty-two. Then a door. Then cold air.',3.4]]);for(let i=0;i<4;i++){try{noise(.12,.05,260)}catch(e){}await c4Wt(.45)}
  big('NIGHT '+n+' · '+title.toUpperCase(),2600);await c4Wt(1);await c4Fade(async()=>{c4Off('c9x');goIn('c9pit',20,30);c9Dark(1,1)})},done)}
// the bandana comes off: the Nightmare stage is already built around him
async function c9Unveil(n,x,z,a,cam,look){c9NE(n);c4DanAt(...c9QX(x,z),a);c9Bandana(PM,1);c9Blind(1);c4Shot(c9QW(...cam),c9QW(...look),0);await c4Wt(.8);c9Bandana(PM,0);c9Blind(0);try{noise(.3,.06,1600)}catch(e){}await c4Wt(.9)}
function c9NightFx(n){const S9=c9S();S9.lit=1;try{c6GrantHide(1)}catch(e){}c9NE(n)}
async function c9NightEnd(n,lesson,wax){await c8Lines([[null,lesson,4]]);c9Award('n'+n,wax,'Night '+n+' survived');await c4Wt(1.2)}

// ---------------------------------------------------------------- Nightmare sets
const C9VAL=['LOYALTY','DUTY','RESPECT','SERVICE AND STEWARDSHIP','HONOR','INTEGRITY','PERSONAL COURAGE'];
function c9NE(n){if(P.inside!=='c9pit')goIn('c9pit',20,30);if(C9.setN!==n||!C4.mine.some(m=>m.c4tag==='c9m'&&c4Live(m)))c9Set(n)}
function c9Set(n){c4Off('c9m');c4Off('c9v');for(const k in C9.g)c9Del(k);C9.setN=n;C9.obj={};c9Doors(n===5?1:0);const I=INT.c9pit,X=x=>I.x0+x,Z=z=>I.z0+z;
  const spot=(g,x,z,r,c)=>{const m=c9M(g,new THREE.CircleGeometry(r||1.2,24),new THREE.MeshBasicMaterial({color:c||0x6a0a12,transparent:true,opacity:.4,depthWrite:false}),X(x),.03,Z(z));m.rotation.x=-PI/2;return m};
  const bench=g=>{c9M(g,bgeo(7,1,2.6),0x1a0e10,X(20),.5,Z(2.6));c9M(g,bgeo(5.4,.85,.4),0x2a1418,X(20),1.42,Z(3.9));const s=signMesh('THE COURT',1.8,.34,'#160a0c','#e2b64c');s.position.set(X(20),1.5,Z(4.12));g.add(s)};
  if(n===1){c9Grp('set',g=>{C9.doorF=C9VAL.map((v,i)=>c9DoorFrame(g,5+i*5,12,0,v));C9.finalD=c9DoorFrame(g,20,3.2,0,'',{w:2,h:3.2,col:0x1a0a0c});spot(g,20,4.6,1.6,0x2a0a0c);
      const t=signMesh('NOT A BROTHER YET.',4.8,.7,'#0a0606','#c8202e');t.position.set(X(20),2.3,Z(.42));t.visible=false;g.add(t);C9.nby=t});
    C9VAL.forEach((v,i)=>{const f=c9Fig('founder',5+i*5,7.6,0,'Founder',{title:v.charAt(0)+v.slice(1).toLowerCase()});if(f){f.c9f='f'+i}})}
  if(n===2||n===5){c9Grp('set',g=>{const sofa=mt(0x7d1f2c,.9);c9M(g,bgeo(2.6,.5,.9),sofa,X(44),.25,Z(2));c9M(g,bgeo(2.6,.6,.2),sofa,X(44),.75,Z(1.55));
      c9M(g,bgeo(.7,.7,.6),0x4a2a1a,X(42),.35,Z(1.2));c9M(g,bgeo(.5,.7,.5),0x4a2a1a,X(46),.35,Z(1.2));c9M(g,bgeo(1.6,.7,.5),0x2a2020,X(52),.35,Z(1));
      const tv=c9M(g,bgeo(1.4,.85,.1),0x0a0a0a,X(52),1.15,Z(1));tv.rotation.z=.08;c9M(g,bgeo(.8,.9,.8),0x3a3a3a,X(60),.45,Z(2));
      for(const[x,z,ry,t]of[[41.2,6,PI/2,'ΑΣΡ'],[50,.25,0,'RUSH'],[62,.25,0,'1952'],[56.3,14,PI/2,'BROTHERHOOD']]){const s=signMesh(t,1.2,.5,'#7d1f2c','#e2b64c');s.position.set(X(x),2.2,Z(z));s.rotation.set(0,ry,.25);g.add(s)}
      if(n===2){const ex=c9DoorFrame(g,63.7,9.25,-PI/2,'EXIT',{col:0x1a3a1a});C9.exitD=ex;
        const mir=c9M(g,new THREE.PlaneGeometry(1,1.4),new THREE.MeshStandardMaterial({color:0x8a9aa8,roughness:.1,metalness:.8}),X(47.85),1.6,Z(4),-PI/2);const sm=c9M(g,new THREE.PlaneGeometry(.9,1.2),new THREE.MeshBasicMaterial({color:0x4a3a2a,transparent:true,opacity:.75,depthWrite:false}),X(47.8),1.6,Z(4),-PI/2);C9.obj.smudge=sm;
        const dust=c9M(g,new THREE.CylinderGeometry(.8,1,.12,12),0x5a4a3a,X(52),.06,Z(12));C9.obj.dust=dust;const br=c9M(g,bgeo(.05,1.4,.05),0x8a6a3a,X(53.4),.7,Z(12.6));br.rotation.z=.3;
        const tr=c9M(g,new THREE.CylinderGeometry(.5,.55,.5,10),0x4a4a42,X(60),1.15,Z(2));C9.obj.trash=tr;
        C9.obj.gavel=c9M(g,bgeo(.32,.12,.12),0x6a3a1a,X(52),1.66,Z(1));C9.obj.comp=c9M(g,new THREE.PlaneGeometry(.9,.65),new THREE.MeshStandardMaterial({map:ctex(256,192,(q,w,h)=>{q.fillStyle='#3a2a1a';q.fillRect(0,0,w,h);q.fillStyle='#d8ccb0';q.fillRect(12,12,w-24,h-24);q.fillStyle='#5a4a3a';for(let i=0;i<24;i++)q.fillRect(22+(i%8)*28,24+Math.floor(i/8)*50,18,30)}),roughness:.8}),X(59),.35,Z(14));C9.obj.comp.rotation.x=-1.2;
        C9.obj.flag=c9M(g,bgeo(.45,.12,.35),0x7d1f2c,X(60),1.45,Z(2));C9.obj.lamp=c9M(g,new THREE.CylinderGeometry(.12,.2,.5,10),0xe8d8a8,X(50),.2,Z(13));C9.obj.lamp.rotation.z=1.5;
        C9.home={gavel:[[X(46),.76,Z(1.2)],[0,0,0]],comp:[[X(44),1.9,Z(.3)],[0,0,0]],flag:[[X(52),1.9,Z(17.85)],[0,0,0]],lamp:[[X(42),.95,Z(1.2)],[0,0,0]]};C9.away={gavel:[[X(52),1.66,Z(1)],[0,0,0]],comp:[[X(59),.35,Z(14)],[-1.2,0,0]]}}
      if(n===5){c9M(g,new THREE.CylinderGeometry(.06,.06,4.4,8),mt(0x6a6a62,.4,.7),X(56.2),2.2,Z(4));const nt=c9M(g,new THREE.PlaneGeometry(.3,.22),mt(0xf2ece0,.9),X(57),.02,Z(9.6));nt.rotation.x=-PI/2;
        const lt=ctex(256,256,(q,w,h)=>{q.fillStyle='#2a2426';q.fillRect(0,0,w,h);q.strokeStyle='rgba(230,220,200,.8)';q.lineWidth=6;q.beginPath();q.moveTo(80,170);q.lineTo(176,170);q.lineTo(150,120);q.lineTo(106,120);q.closePath();q.stroke();q.beginPath();q.moveTo(128,120);q.quadraticCurveTo(110,80,128,50);q.quadraticCurveTo(146,80,128,120);q.stroke();q.font='bold 54px Georgia';q.fillStyle='rgba(230,220,200,.8)';q.fillText('I',118,235)});
        c9M(g,new THREE.PlaneGeometry(.8,.8),new THREE.MeshStandardMaterial({map:lt,roughness:.95}),X(63.85),1.3,Z(4),-PI/2);c9M(g,bgeo(.5,.25,.3),0x2a2a2a,X(58.5),.13,Z(1.2));
        const lk=c9M(g,bgeo(.06,.5,.7),mt(0x8a8a8a,.3,.8),X(56.12),1.4,Z(8.3));C9.lock=lk}});
    if(n===2){const a=c9Fig('shade',47,15,-PI*.75,'A watcher');if(a)a.c9f='w1';const b=c9Fig('shade',55,15,-PI*.75,'A watcher');if(b)b.c9f='w2'}}
  if(n===3){c9Grp('set',g=>{for(let i=0;i<9;i++)spot(g,6+i*7,40,.8,0x4a0a0e);const s=signMesh('THE GAUNTLET',2.2,.4,'#0a0606','#c8202e');s.position.set(X(2.2),3,Z(36.2));s.rotation.y=PI;g.add(s)});
    for(const[k,x,z,a]of[['g1',16,42.7,PI],['g2',30,37.3,0],['g3',44,42.7,PI]]){const f=c9Fig('shade',x,z,a,'A masked figure');if(f){f.c9f=k;c9Vis(f,0)}}
    const gr=c9Fig('grant',61.4,40,-PI/2,'Grant?');if(gr){gr.c9f='gg';c9Vis(gr,0)}}
  if(n===4){c9Grp('set',g=>{bench(g);C9.ob=c9Board(g,31,2.4,.4,0,6,3.4);c9BoardDraw(C9.ob,'ORDERS',[]);
      for(const[x,z,t]of[[8,18,'UNIFORM'],[20,22,'POSTURE'],[32,18,'RECITATION']]){c9M(g,bgeo(.8,1.1,.6),0x2a1418,X(x),.55,Z(z-1.2));const s=signMesh(t,1.4,.3,'#160a0c','#e2b64c');s.position.set(X(x),1.4,Z(z-.88));g.add(s);spot(g,x,z,1.2)}});
    const j=c9Fig('judge',20,2.2,0,'The Judge');if(j){j.c9f='judge';j.pup.y=1}for(const[k,x,z,a]of[['s1',9.6,17,-PI/2],['s2',21.6,21,-PI/2],['s3',33.6,17,-PI/2]]){const f=c9Fig('shade',x,z,a,'An inspector');if(f)f.c9f=k}}
  if(n===5){const v=c9Voice('The Goat','over the speaker',60,.8);if(v)v.c9f='spk';const e=c9Voice('Ezra','through the pipe',55.4,4);if(e)e.c9f='ve';const m=c9Voice('Marcus','down the pipe',54.8,4.4);if(m)m.c9f='vm';
    const ez=c9Cast('ezra',52,12,PI,{int:'c9pit',tag:'c9m'}),mc=c9Cast('marcus',44,12,PI,{int:'c9pit',tag:'c9m'});if(ez)ez.c9f='ez';if(mc)mc.c9f='mc'}
  if(n===6){c9Grp('set',g=>{bench(g);c9M(g,bgeo(1.4,1,1.2),0x2a1418,X(12),.5,Z(9.4));c9M(g,bgeo(2.6,.8,1),0x2a1418,X(24),.4,Z(16.4));c9M(g,bgeo(3.6,.8,1),0x3a2420,X(18),.4,Z(14.6));
      const ex=[['E1',0xe8e0c8],['E2',0xf2ece0],['E3',0x8a5a2a],['E4',0xd8d0b8]];ex.forEach(([t,c],i)=>{const m=c9M(g,i===2?bgeo(.7,.05,.18):bgeo(.32,.02,.42),c,X(16.6+i*.95),.82,Z(14.6));m.rotation.y=i===2?.4:0;const s=signMesh(['A','B','C','D'][i],.16,.12,'#160a0c','#e2b64c');s.position.set(X(16.6+i*.95),.82,Z(15.12));s.rotation.x=-.6;g.add(s)});
      for(let r=0;r<2;r++)c9M(g,bgeo(16,.5,.6),0x1a0e10,X(20),.25,Z(27+r*2.4));spot(g,12,11,1.1)});
    const j=c9Fig('judge',20,2.2,0,'The Judge');if(j){j.c9f='judge';j.pup.y=1}const ac=c9Fig('shade',24,17.4,PI,'The Accused');if(ac)ac.c9f='acc';
    for(let i=0;i<6;i++){const f=c9Fig('shade',12+i*3.2,27.6+(i%2)*2.4,PI,'The gallery');if(f)f.c9f='gal'+i}
    const gt=c9Fig('shade',14,25.4,PI,'The Goat',{mask:'goat',title:'in the gallery'});if(gt){gt.c9f='goat';if(gt.g&&gt.g.P&&gt.g.P.head)gt.g.P.head.children.forEach(c=>{if(c!==gt.c8mask&&c.geometry===GC.c3puff)c.visible=false})}
    const pg=c9Fig('shade',26,25.4,PI,'The Pig',{mask:'pig',title:'in the gallery'});if(pg){pg.c9f='pig';if(pg.g&&pg.g.P&&pg.g.P.head)pg.g.P.head.children.forEach(c=>{if(c!==pg.c8mask&&c.geometry===GC.c3puff)c.visible=false})}}
  if(n===7){c9Grp('set',g=>{const cx=20,cz=18;for(let i=0;i<7;i++){const a=i/7*TAU-PI/2,x=cx+Math.cos(a)*11,z=cz+Math.sin(a)*11;spot(g,x,z,1.3);const s=signMesh(['THE DOOR','THE HOUSE','THE CORRIDOR','THE INSPECTION','THE LOCK','THE COURT','THE CHAIR'][i],1.8,.32,'#160a0c','#e2b64c');s.position.set(X(x),2.6,Z(z));s.rotation.y=Math.atan2(cx-x,cz-z);g.add(s)
        if(i===0)c9DoorFrame(g,x,z-.6,Math.atan2(cx-x,cz-z),'');if(i===1){c9M(g,bgeo(.05,1.4,.05),0x8a6a3a,X(x),.7,Z(z)).rotation.z=.3;c9M(g,new THREE.CylinderGeometry(.25,.2,.4,10),0x5a6a7a,X(x+.5),.2,Z(z))}
        if(i===2)for(let k=0;k<6;k++)c9M(g,new THREE.PlaneGeometry(.15,2.4),new THREE.MeshStandardMaterial({color:0x0a080a,side:THREE.DoubleSide}),X(x-1+k*.4),3.4,Z(z));if(i===3){const b=c9Board(g,x,1.6,z,Math.atan2(cx-x,cz-z),1.6,1.1);c9BoardDraw(b,'ORDERS',[{t:'Polish your boots',x:1},{t:'Never look up',x:1}],{fs:70,lh:110})}
        if(i===4)c9M(g,bgeo(.5,.7,.1),mt(0x8a8a8a,.3,.8),X(x),1.3,Z(z));if(i===5)c9M(g,bgeo(1.4,.9,.6),0x2a1418,X(x),.45,Z(z));
        if(i===6){c9M(g,bgeo(.55,.06,.55),0x4a3626,X(x),.46,Z(z));c9M(g,bgeo(.55,.7,.06),0x4a3626,X(x),.85,Z(z-.26));const r=c9M(g,new THREE.TorusGeometry(.27,.035,6,16),mt(0x9a7a4a,.9),X(x),.7,Z(z));r.rotation.x=PI/2}}
      C9.ring=[];for(let i=0;i<7;i++){const a=i/7*TAU,x=X(cx+Math.cos(a)*1.7),z=Z(cz+Math.sin(a)*1.7);c9M(g,new THREE.CylinderGeometry(.05,.055,.4,10),mt(0xf2ead8,.6),x,.2,z);const f=c9M(g,GC.c9fl||(GC.c9fl=new THREE.ConeGeometry(.03,.09,8)),new THREE.MeshBasicMaterial({color:0xffb040}),x,.45,z);C9.ring.push(f)}spot(g,cx,cz,2.4,0x5a3a0a)});
    for(let i=0;i<7;i++){const a=i/7*TAU-PI/2,x=20+Math.cos(a)*12.6,z=18+Math.sin(a)*12.6;const f=c9Fig(i===0?'founder':i===5?'judge':'shade',x,z,Math.atan2(20-x,18-z),['A founder','A watcher','A masked figure','An inspector','A masked figure','The Judge','A masked figure'][i]);if(f)f.c9f='r'+i}
    const ez=c9Cast('ezra',18.4,21,PI,{int:'c9pit',tag:'c9m'}),mc=c9Cast('marcus',21.6,21,PI,{int:'c9pit',tag:'c9m'});if(ez)ez.c9f='ez';if(mc)mc.c9f='mc'}}
function c9Tween(m,p,r,secs){if(!m)return;const p0=m.position.clone(),r0=m.rotation.clone();let t=0;c5Anim(dt=>{t+=dt/(secs||.9);const k=Math.min(1,t),e=k*k*(3-2*k),hop=Math.sin(k*PI)*.6;m.position.set(p0.x+(p[0]-p0.x)*e,p0.y+(p[1]-p0.y)*e+hop,p0.z+(p[2]-p0.z)*e);if(r)m.rotation.set(r0.x+(r[0]-r0.x)*e,r0.y+(r[1]-r0.y)*e,r0.z+(r[2]-r0.z)*e);return k>=1})}
// a masked figure lunges out of the dark
async function c9Lunge(k,tx,tz){const f=c9F(k);if(!f)return null;c9Vis(f,1);try{c6Poof(f.x,1.4,f.z,0x220000);noise(.5,.2,140);tone(70,.5,'sawtooth',.06)}catch(e){}c4To(f,tx,tz,4.2);await c4Wt(.7);return f}

// ---------------------------------------------------------------- chapter 9 opening: the candles
CHSCENE[9]=async function(){const fade=$('fade');fade.style.opacity=1;await c4Sl(500);endScene();C1.act=[];const S9=c9S();S9.lit=0;S9.day=1;try{c6GrantHide(1)}catch(e){}
  goIn('asr',24,25);c4At(Math.max(S.gt,10));c4CamOn();c4Off('c9c');
  const gr=c9Cast('grant',18.4,21.8,PI/2),ca=c9Cast('carter',19,24.6,PI*.6),lo=c9Cast('logan',19,18.9,PI*.4),ez=c9Cast('ezra',22.2,22.9,-PI/2),mc=c9Cast('marcus',22,24.3,-PI/2);
  c4DanAt(...c9AX(22,21.5),-PI/2);c4Shot(c9AW(25,2.6,26.6),c9AW(18.5,1.3,21.4),0);fade.style.opacity=0;big('CHAPTER 9 · HELL WEEK',2800);await c4Wt(2.4);
  await c8Lines([[null,'A week after the Haze Room, the house acts like nothing happened.',3],[null,'The Haze Room is still there. So are the men who ran it.',3]]);
  c4Shot(c9AW(21.4,1.8,23.6),c9AW(18.4,1.65,21.8),1.2);await c8Lines([[gr,'Associates. This is Hell Week. Seven days, then initiation.'],[gr,'Loyalty. Duty. Respect. Service and Stewardship. Honor. Integrity. Personal Courage. By Sunday you\'ll know what every one of those costs.']]);
  // the candles are lit, one at a time
  c4To(gr,...c9AX(17.6,22.4),1.2);await c4Wt(1.4);c4Shot(c9AW(19.2,1.5,21.9),c9AW(16.75,1.05,20.45),1);await c4Wt(.6);C9.unlit=[0,1,2];S9.lit=1;c9CandUpd();
  for(let i=0;i<3;i++){await c4Wt(.7);const c=C9.cand&&C9.cand.c[i];C9.unlit=C9.unlit.filter(j=>j!==i);if(c){try{c6Spark(c.x,1.4,c.z,0xffb040,5);tone(660+i*120,.12,'sine',.04)}catch(e){}}}
  await c4Wt(.6);c4Shot(c9AW(21.6,1.8,23),c9AW(19,1.65,24.6),1.2);
  await c8Lines([[ca,'One candle each. It burns all week. Earn your wax in the trials, or watch it go out.'],[lo,'Wax doesn\'t move. You can\'t give yours away, and nobody saves you with theirs.'],[ca,'And if your candle burns out, you start Hell Week over. From Day one.']]);
  c9HudDraw(1);c4To(gr,...c9AX(20,29),1.4);c4Shot(c9AW(23.6,1.75,20),c9AW(21.2,1.6,21.5),1);c4To(ca,...c9AX(21,20.9),1.3);await c4Wt(2);
  await c8Lines([[ca,'Still a pledge, Kowalski. Still mine. The Haze Room didn\'t close just because Grant walked down the stairs.'],[DANNY,'(Grant pulled us out. He never shut it down. Carter and Logan never lost a thing.)'],[ez,'Seven days, Danny. We just have to get through seven days.']]);
  toast('Your candle burns while you play. Trials and Nightmares earn wax back.',4200);await c4Fade(async()=>{c4CamOff()});c5Next('c9d1');saveGame()};

// ================================================================ DAY 1 · FRATERNITY HISTORY
async function c9D1Assign(done){await c8Cine(async()=>{c9DayCast(1);const ca=c9K('carter'),gr=c9K('grant');c4DanAt(...c9AX(22.4,16),-PI/2);c4To(ca,...c9AX(20.8,16),1.4);c4Shot(c9AW(23.6,1.8,17.4),c9AW(20.8,1.6,16),0);await c4Wt(1);
  await c8Lines([[ca,'Day one. History. Grant wants you to know where you come from.'],[ca,'Me? I want to watch you get it wrong. Study the house. Grant quizzes you in the throne room.']])},done)}
async function c9D1Quiz(done){await c8Cine(async()=>{c9DayCast(1);const gr=c9K('grant');c4DanAt(...c9AX(24,10),PI);c4Shot(c9AW(26.4,1.8,12.4),c9AW(24,1.65,7.6),0);
  await c8Lines([[gr,'Five questions. Get them wrong and it\'s your own candle that pays.']]);
  await c9Quiz(gr,'Day 1 · Fraternity History',[['What year was this chapter founded?',[['"1952."',1],['"1971."',0,'1971 is the year the Haze Room was built. Wrong.'],['"2009."',0,'That\'s the year somebody ironed the flag.']]],
    ['Lamp, star, open book. What does the lamp stand for?',[['"Honor."',0,'The star is honor.'],['"Knowledge."',1],['"The ritual."',0,'The book is the ritual.']]],
    ['Finish the ribbon: FIDES · FRATERNITAS · …',[['"…VERITAS."',0,'Close. Wrong.'],['"…MCMLII."',1],['"…ALPHA."',0,'No.']]],
    ['How many founders signed the charter?',[['"Seven."',1],['"Three."',0,'Count again.'],['"Twelve."',0,'That\'s a jury.']]],
    ['One frame in the composite row is empty. Which year?',[['"2019."',1],['"2020."',0,'2020 is hanging right there.'],['"1952."',0,'The founders\' frame is the first one, Danny.']]]]);
  await c8Lines([[gr,'Good. Five for five is better than I did.']]);c9Award('d1',15,'Day 1 trial')},done)}

// ================================================================ NIGHT 1 · THE UNWORTHY
async function c9N1Open(done){await c8Cine(async()=>{await c9Unveil(1,20,30,PI,[20,3,34],[20,1.6,10]);const f3=c9F('f3');
  c4Shot(c9QW(20,2.6,22),c9QW(20,1.8,8),1.6);await c8Lines([[null,'Seven doors. Seven robed figures behind them. Seven blank masks, turned toward him.',3.4],[f3,'You don\'t belong here.'],[c9F('f0'),'You were never chosen. You were tolerated.'],[c9F('f6'),'Open the doors, associate. Prove us wrong.']])},done)}
const C9N1Q=[['A founder wrote it in 1952: "We are bound by ___." What did he write?',[['"…each other."',1],['"…the rules."',0,'Rules came later.'],['"…the house."',0,'A house is a building.']]],
  ['An order and your conscience disagree. Which do you owe first?',[['"The order."',0,'Then you are a soldier, not a brother.'],['"My conscience, and then an honest word with whoever gave the order."',1],['"Whichever is easier."',0,'No.']]],
  ['A brother you dislike is speaking at chapter. What do you do?',[['"Listen until he\'s done."',1],['"Talk over him."',0,'No.'],['"Leave."',0,'No.']]],
  ['Seven associates sweep seven rooms in seven minutes. How long do fourteen associates take to sweep fourteen rooms?',[['"Seven minutes."',1],['"Fourteen minutes."',0,'Think again.'],['"Three and a half."',0,'Think again.']]],
  ['You find a brother\'s wallet on the porch. Nobody saw. What is it worth to you?',[['"Exactly what\'s in it."',0,'No.'],['"Nothing. It\'s his."',1],['"A finder\'s fee."',0,'No.']]],
  ['A brother says: "Everything I tell you tonight is a lie." Can that sentence be true?',[['"Yes."',0,'Then it would be a lie.'],['"No. If it were true, it would be a lie."',1],['"Only after midnight."',0,'Very funny. No.']]],
  ['Someone you love asks you to stay quiet about something wrong. What takes courage?',[['"Staying quiet."',0,'Silence is the easy part.'],['"Saying no to him, to his face."',1],['"Changing the subject."',0,'No.']]]];
function c9N1Door(i){return fin=>{c8Cine(async()=>{c9NE(1);const f=c9F('f'+i),fr=C9.doorF&&C9.doorF[i];c4DanAt(...c9QX(5+i*5,13.4),PI);c9OpenDoor(fr,1);c4Shot(c9QW(5+i*5+1.4,1.9,15.6),c9QW(5+i*5,1.7,8),0);await c4Wt(.9);if(f)c4To(f,...c9QX(5+i*5,10.6),1.2);await c4Wt(1);
  await c8Lines([[f,C9VAL[i].charAt(0)+C9VAL[i].slice(1).toLowerCase()+'.']]);await c9Quiz(f,'Night 1 · '+C9VAL[i],[C9N1Q[i]]);await c8Lines([[f,'…Pass.']]);if(f)c4To(f,...c9QX(5+i*5,7.6),1.2)},fin)}}
async function c9N1Final(done){await c8Cine(async()=>{c9NE(1);c4DanAt(...c9QX(20,5.4),PI);c4Shot(c9QW(22.4,2,8.4),c9QW(20,2,1),0);await c4Wt(.6);c9OpenDoor(C9.finalD,1);await c4Wt(1.2);if(C9.nby)C9.nby.visible=true;try{noise(.6,.12,120);tone(55,1,'sawtooth',.05)}catch(e){}
  c4Shot(c9QW(20,2.2,6.6),c9QW(20,2.3,.4),1.2);await c4Wt(1.4);await c8Lines([[null,'Painted on the wall behind the last door: NOT A BROTHER YET.',3],[c9F('f3'),'Not yet.'],[DANNY,'(Not yet. But not never.)']]);
  await c9NightEnd(1,'Brotherhood begins with belonging to something larger than yourself.',5)},done)}

// ================================================================ DAY 2 · HOUSE RESPONSIBILITIES
async function c9D2Assign(done){await c8Cine(async()=>{c9DayCast(2);const ca=c9K('carter');c4DanAt(...c9AX(24,17.6),PI);c4Shot(c9AW(26,1.8,19.6),c9AW(24,1.6,16),0);
  await c8Lines([[ca,'Chores. Your list, nobody else\'s. Not Ezra\'s, not Marcus\'s.'],[ca,'Trash, sink, laundry, the pong table, the TV room. I\'ll be checking.'],[DANNY,'(He\'ll be looking for a reason. Don\'t give him one.)']])},done)}
async function c9D2Report(done){await c8Cine(async()=>{c9DayCast(2);const ca=c9K('carter');c4DanAt(...c9AX(24,17.6),PI);c4To(ca,...c9AX(24,16),1.2);c4Shot(c9AW(26,1.8,19.6),c9AW(24,1.6,16),0);
  await c8Lines([[ca,'Trash. Sink. Laundry. Table. TV room.'],[ca,'…Fine. It\'s fine.'],[DANNY,'Say it like it hurts.'],[ca,'Get out of my hallway, Kowalski.']]);c9Award('d2',15,'Day 2 trial')},done)}

// ================================================================ NIGHT 2 · THE ENDLESS HOUSE
async function c9N2Open(done){await c8Cine(async()=>{await c9Unveil(2,44,13,PI,[44,2.2,16.6],[45,1.4,6]);c4Shot(c9QW(46,2.4,16.4),c9QW(52,1.2,4),1.6);
  await c8Lines([[null,'The house. His house, almost. The frames hang crooked. The rooms go on longer than they should.',3.4],[c9F('w1'),'Chores, associate. The house is a mess.'],[c9F('w2'),'Put everything back where it belongs.']])},done)}
function c9N2Put(k,label){return fin=>{const m=C9.obj&&C9.obj[k],h=C9.home&&C9.home[k];if(m&&h)c9Tween(m,h[0],h[1],1);try{sfx('ok')}catch(e){}toast(label,1800);fin()}}
function c9N2Chore(k,label){return fin=>{const m=C9.obj&&C9.obj[k];if(m){let t=0;const s0=m.scale.clone();c5Anim(dt=>{t+=dt;const e=Math.max(0,1-t);m.scale.set(s0.x*(k==='trash'?1:e),s0.y*e,s0.z*(k==='trash'?1:e));if(k==='smudge')m.material.opacity=.75*e;return t>=1})}try{noise(.6,.05,2200)}catch(e){}toast(label,1800);fin()}}
async function c9N2Loop(done){await c8Cine(async()=>{c9NE(2);c4DanAt(...c9QX(62.4,9.25),PI/2);c4Shot(c9QW(59,2,12.4),c9QW(63.6,1.4,9.25),0);await c4Wt(.4);c9OpenDoor(C9.exitD,1);await c4Wt(1);c4DanTo(...c9QX(64.6,9.25),1.4);await c4Wt(1);
  await c4Fade(async()=>{c4DanAt(...c9QX(42,9.25),PI/2);const o=C9.obj,a=C9.away;for(const k of['gavel','comp']){const m=o[k];m.position.set(...a[k][0]);m.rotation.set(...a[k][1])}const d=o.dust;if(d)d.scale.set(1,1,1);c9OpenDoor(C9.exitD,0);c4Shot(c9QW(45,2,13),c9QW(42,1.4,9),0)});
  await c8Lines([[null,'Through the exit… and into the first room again. The gavel is back on the TV. The frame is back on the floor. The dust is back.',3.6],[DANNY,'(It loops. They built it so it never ends.)']]);
  const w1=c9F('w1'),w2=c9F('w2');await c8Lines([[w1,'House is never finished, Kowalski.'],[w2,'And nobody\'s watching anymore. Why bother?']]);for(const w of[w1,w2])if(w){c4To(w,...c9QX(52,24),2);setTimeout(()=>{if(c4Live(w))c9Vis(w,0)},2400)}await c4Wt(2.6)},done)}
async function c9N2End(done){await c8Cine(async()=>{c9NE(2);c4Shot(c9QW(46,2,14),c9QW(46,1.5,4),0);await c4Wt(.6);
  await c8Lines([[null,'Nobody saw him put it back. Nobody saw him sweep. He did it anyway.',3.2]]);await c9NightEnd(2,'Membership is responsibility, not privilege. Service still matters when nobody notices.',5)},done)}

// ================================================================ DAY 3 · PHYSICAL EVALUATION (outside)
async function c9D3Open(done){await c8Cine(async()=>{await c9Morning(3,'Physical Evaluation');await c4Fade(async()=>{c4Off('c9c');goOut(...c9Front(4,0));const[x,z]=c9Front(4,0),f=c9FrontFace();c4DanAt(x,z,f+PI);
    const[lx,lz]=c9Front(3,-3),[cx,cz]=c9Front(3.4,3);c9Cast('logan',lx,lz,f+PI,{abs:1,int:null});c9Cast('carter',cx,cz,f+PI,{abs:1,int:null});const[ex,ez]=c9Front(1.4,-5.4),[mx,mz]=c9Front(1.4,5.4);c9Cast('ezra',ex,ez,f+PI,{abs:1,int:null});c9Cast('marcus',mx,mz,f+PI,{abs:1,int:null});
    const[sx,sz]=c9Front(9,0);c4Shot([sx,2.6,sz],[x,1.4,z],0)});const lo=c9K('logan'),ca=c9K('carter');
  await c8Lines([[lo,'Individual evaluation. A run, then push-ups. I\'ve got the stopwatch.'],[ca,'Nobody runs it for you, Kowalski. Nobody carries you.'],[c9K('ezra'),'(quietly) You got this.']])},done)}
async function c9D3Composure(done){await c8Cine(async()=>{const ca=c9K('carter'),lo=c9K('logan');if(ca)c4To(ca,P.x+1,P.z+.6,1.4);c4Shot([P.x+2.4,1.4,P.z+2.2],[P.x,1,P.z],0);await c4Wt(1);
  await c8Lines([[ca,'Grant\'s favorite. Gassed already? Andre would have done fifty.']]);
  await c8Choose(ca,'Day 3 · Physical Evaluation','Carter crouches next to you, smiling.',[['"Say that again."',0,[()=>c9Wax(-3,'Lost your composure'),[lo,'(Logan writes something down.)']]],['"(Keep your breathing even. Say nothing.)"',1],['"(Smile back.)"',1]]);
  await c8Lines([[lo,'Time. That\'s a pass.'],[ca,'…Whatever.']]);c9Award('d3',15,'Day 3 trial')},done,{after:()=>{}})}
async function c9BackInside(done){await c8Cine(async()=>{await c4Fade(async()=>{c4Off('c9c');goIn('asr',24,25);c4DanAt(...c9AX(24,25),PI);c4Shot(c9AW(26,1.8,28),c9AW(24,1.4,22),0)})},done)}

// ================================================================ NIGHT 3 · THE GAUNTLET OF FEAR
async function c9N3Open(done){await c8Cine(async()=>{await c9Unveil(3,2,33,0,[6,2,30],[2,1.4,38]);c4Shot(c9QW(3,1.8,34),c9QW(10,1.4,40),1.4);
  await c8Lines([[null,'A long black corridor. Red lights. Strips of cloth hanging in the dark.',3]])},done)}
async function c9N3Rec(done){await c8Cine(async()=>{c9NE(3);c4Off('c9v');const v=c9Voice('Danny Kowalski','a recording',8,40);c4Shot(c9QW(4,1.6,38),c9QW(10,1.6,41),0);const dist=()=>{try{tone(110,.7,'sawtooth',.03);noise(.7,.04,600)}catch(e){}};
  await c8Lines([dist,[v,'…I\'ll do whatever Grant needs…'],dist,[v,'…I didn\'t mean to…'],dist,[v,'…nobody has to know…'],[DANNY,'That\'s my voice. They recorded me.']])},done,{after:()=>c4Off('c9v')})}
function c9N3Fig(k,x,taunt,opts){return async done=>{await c8Cine(async()=>{c9NE(3);c4DanAt(...c9QX(x,40),PI/2);c4Shot(c9QW(x-3.4,1.7,40.6),c9QW(x+2,1.5,40),0);await c4Wt(.4);const f=await c9Lunge(k,...c9QX(x+1.4,40));
  c4Shot(c9QW(x-1.6,1.75,41.6),c9QW(x+1.3,1.65,40),.8);await c8Lines([[f,taunt]]);await c8Choose(f,'Night 3 · The Gauntlet of Fear','The mask leans closer.',opts);
  await c8Lines([[null,'The figure steps back into the dark.',2]]);if(f){c4To(f,...c9QX(x+1.4,k==='g2'?37.3:42.7),2);await c4Wt(.8);c9Vis(f,0)}},done)}}
async function c9N3Grant(done){await c8Cine(async()=>{c9NE(3);c4DanAt(...c9QX(56,40),PI/2);c4Shot(c9QW(53,1.8,41.4),c9QW(60,1.6,40),0);await c4Wt(.6);const g=await c9Lunge('gg',...c9QX(58.6,40));c4Shot(c9QW(56.6,1.75,41.8),c9QW(58.6,1.7,40),1);
  await c8Lines([[g,'Danny.'],[g,'You\'re disloyal. You always were. You\'d sell every one of us to save yourself.'],[DANNY,'(It\'s not him. It\'s his clothes and his voice, and a mask.)']]);
  await c8Choose(g,'Night 3 · The Gauntlet of Fear','"Say it. Say you\'re sorry."',[['"You\'re right, Grant. I\'m sorry."',0,[()=>c9Wax(-3,'Said what they wanted'),[g,'Good boy.'],[DANNY,'(No. That\'s what it wanted to hear.)']]],['"I walked into that basement for this house. I\'m not disloyal. I just won\'t lie to myself."',1],['"You\'re not Grant. And I\'m not scared of a mask."',1]]);
  await c8Lines([[null,'The mask tilts, like it\'s listening. Then the lights die.',2.6]]);if(g)c9Vis(g,0);try{noise(.5,.2,90)}catch(e){}await c4Wt(.8)},done)}
async function c9N3End(done){await c8Cine(async()=>{c9NE(3);c4DanAt(...c9QX(62,40),PI/2);c4Shot(c9QW(57,2,41),c9QW(62,1.4,40),0);await c4Wt(.6);await c9NightEnd(3,'Courage means standing by your convictions when challenged.',5)},done)}

// ================================================================ DAY 4 · TRADITION AND ENDURANCE (the vigil, outside at dusk)
async function c9D4Open(done){await c8Cine(async()=>{await c9Morning(4,'Tradition and Endurance');await c4Fade(async()=>{c4Off('c9c');c4At(Math.max(S.gt,18.6));goOut(...c9Front(4,0));const[x,z]=c9Front(2.6,0),f=c9FrontFace();c4DanAt(x,z,f+PI);
    const sp=[['grant',4.4,-2.6],['carter',4.6,2.8],['tank',6.4,-4.2],['logan',6.6,4.2]];for(const[k,ff,s]of sp){const[a,b]=c9Front(ff,s);c9Cast(k,a,b,f,{abs:1,int:null})}const[cx,cz]=c9Front(8.6,1.6);c4Shot([cx,2.2,cz],[x,1.3,z],0)});
  const gr=c9K('grant'),ca=c9K('carter'),tk=c9K('tank');await c8Lines([[null,'Dusk. The whole house comes out on the lawn to watch.',2.8],[gr,'Every pledge class stands vigil. One candle, one hour. We\'ll call it forty seconds.'],[ca,'Move off the mark, or let the wind take it, and you start over.'],[tk,'DANNY. Danny, look at me. Danny, I\'m doing a bit. Danny.'],[DANNY,'(Don\'t look at Tank. Don\'t look at Tank.)']])},done)}
async function c9D4End(done){await c8Cine(async()=>{const gr=c9K('grant');c4Shot([P.x+2.6,1.6,P.z+1.6],[P.x,1.2,P.z],0);await c4Wt(.4);
  await c8Lines([[gr,'Time.'],[gr,'Self-control isn\'t something you have, Danny. It\'s something you do. Every second.']]);c9Award('d4',15,'Day 4 trial')},done)}

// ================================================================ NIGHT 4 · THE IMPOSSIBLE INSPECTION
const C9ORD=['1. Boots polished to a mirror shine.','2. Stand at attention, eyes on the Judge.','3. Recite the creed, word for word.','4. Do not touch your boots before inspection.','5. Never look the Judge in the eye.','6. The creed may never be spoken outside the ritual.'];
function c9N4Draw(){const S9=c9S(),o=S9.ord||[],x=S9.ordX||[];c9BoardDraw(C9.ob,'ORDERS',C9ORD.map((t,i)=>o.includes(i)?{t,x:x.includes(i),red:x.includes(i)}:{t:'…',dim:1}))}
async function c9N4Open(done){await c8Cine(async()=>{await c9Unveil(4,20,30,PI,[20,2.8,33],[20,2,4]);c9S().ord=[];c9S().ordX=[];c9N4Draw();const j=c9F('judge');c4Shot(c9QW(20,2.4,12),c9QW(20,2.6,2.2),1.4);
  await c8Lines([[j,'Associate Kowalski. You will be inspected.'],[j,'You will satisfy every order. If you fail, the failure is yours. Report to the stations.']])},done)}
function c9N4Station(i,add){return fin=>{c8Cine(async()=>{c9NE(4);const S9=c9S(),j=c9F('judge'),s=c9F('s'+(i+1)),[x,z]=[[8,18],[20,22],[32,18]][i];c4DanAt(...c9QX(x,z),PI);c4Shot(c9QW(x+2.2,1.9,z+2.6),c9QW(x,1.5,z-1),0);await c4Wt(.4);
  await c8Lines([[s,['Uniform.','Posture.','Recitation.'][i]],[j,'New orders.']]);S9.ord=[...new Set([...(S9.ord||[]),...add])];c9N4Draw();c4Shot(c9QW(28,2.2,6),c9QW(31,2.4,.4),1);try{noise(.4,.05,2600)}catch(e){}await c4Wt(1.6)},fin)}}
async function c9N4Contra(done){await c8Cine(async()=>{c9NE(4);const S9=c9S(),j=c9F('judge');S9.ord=[0,1,2,3,4,5];c9N4Draw();c4DanAt(...c9QX(28,7),PI);c4Shot(c9QW(28,2.2,7.6),c9QW(31,2.4,.4),0);
  await c8Lines([[j,'You have six orders. Satisfy all six.'],[DANNY,'(I can\'t. Half of them cancel the other half.)']]);const opt=(r)=>C9ORD.filter((_,i)=>i!==r).map(t=>t);
  const Q=[[0,3,'Order 1 says polish your boots. Which order makes that impossible?'],[1,4,'Order 2 says keep your eyes on the Judge. Which order makes that impossible?'],[2,5,'Order 3 says recite the creed. Which order makes that impossible?']];
  for(const[a,b,q]of Q){await c8Choose(j,'Night 4 · The Impossible Inspection',q,C9ORD.filter((_,i)=>i!==a).map(t=>[t,t===C9ORD[b],[()=>c9Wax(-2,'Not a contradiction'),[j,'Those two get along fine.']]]));S9.ordX=[...S9.ordX,a,b];c9N4Draw();try{sfx('ok')}catch(e){}}},done)}
async function c9N4Refuse(done){await c8Cine(async()=>{c9NE(4);const j=c9F('judge');c4DanAt(...c9QX(20,9),PI);c4Shot(c9QW(21.6,1.8,11.4),c9QW(20,2.6,2.2),0);
  await c8Lines([[j,'You failed every station. Say it. "It\'s my fault."']]);
  await c8Choose(j,'Night 4 · The Impossible Inspection','The Judge waits.',[['"It\'s my fault."',0,[()=>c9Wax(-3,'Took the blame for an impossible order'),[j,'Yes. It always will be.'],[DANNY,'(No. That\'s not accountability. That\'s a trap.)']]],
    ['"These orders cancel each other out. I\'ll answer for what I can do. Not for something nobody could."',1],['"(Point at the board.) Explain how. Then I\'ll take the blame."',1]]);
  await c8Lines([[j,'…'],[null,'The Judge doesn\'t have an answer. He never did.',2.6]]);await c9NightEnd(4,'Accountability matters. But authority without fairness becomes abuse.',5)},done)}

// ================================================================ DAY 5 · LOYALTY AND PROBLEM-SOLVING
function c9Shards(on){if(!on){c9Del('shards');return}c9Grp('shards',g=>{const I=INT.asr;for(let i=0;i<9;i++){const m=c9M(g,bgeo(.12+(i%3)*.05,.03,.1),mt(0xe2b64c,.3,.8),I.x0+31+Math.sin(i*2.1)*.5,.02,I.z0+10.2+Math.cos(i*1.7)*.4);m.rotation.y=i}const b=c9M(g,new THREE.CylinderGeometry(.12,.16,.3,10),mt(0xb8962a,.3,.8),I.x0+31.3,.15,I.z0+10.6);b.rotation.z=1.4})}
async function c9D5Open(done){await c8Cine(async()=>{await c9Morning(5,'Loyalty and Problem-Solving');c9Shards(1);c9DayCast(5);const ca=c9K('carter'),lo=c9K('logan'),ez=c9K('ezra'),gr=c9K('grant');
  await c4Fade(async()=>{c4DanAt(...c9AX(28,13),-PI*.8);c4Shot(c9AW(26,2,14.4),c9AW(31,.6,10.4),0)});
  await c8Lines([[null,'The founders\' trophy, the gold lamp from 1952, lies in pieces under the composites.',3.2],[ca,'Ezra broke it. I saw him. Go tell Grant. That\'s loyalty, Kowalski.'],[lo,'Pretty sure it was Marcus, actually.'],[ez,'I didn\'t touch it, Danny. I swear I didn\'t.'],[DANNY,'(Two stories. Neither of them adds up. Find out what happened.)']])},done)}
async function c9D5Decide(done){await c8Cine(async()=>{c9DayCast(5);const gr=c9K('grant'),ca=c9K('carter'),lo=c9K('logan'),ez=c9K('ezra');c4DanAt(...c9AX(24,10),PI);if(ez)c4To(ez,...c9AX(22.8,10.4),1.4);c4Shot(c9AW(26.2,1.8,12.6),c9AW(24,1.65,7.6),0);await c4Wt(.8);
  await c8Lines([[gr,'Somebody broke the founders\' lamp. Carter says you know who.']]);
  await c8Choose(gr,'Day 5 · Loyalty and Problem-Solving','Grant, Carter and Logan all look at you. So does Ezra.',[['"Ezra did it. Carter saw him."',0,[()=>c9Wax(-3,'Obedience, not loyalty'),[DANNY,'(…No. That isn\'t loyalty. That\'s just doing what Carter says.)']]],
    ['"I did it. Blame me, so nobody else gets hurt."',0,[()=>c9Wax(-3,'A lie on yourself is still a lie'),[DANNY,'(Taking a lie on myself is still a lie.)']]],
    ['"Here\'s what the evidence says, and Ezra\'s standing right here with me while I say it."',1]]);
  await c8Lines([[DANNY,'The chore log puts Ezra in the laundry room all night. Logan wrote that log himself. Tank heard Logan swear around midnight, and there\'s gold on Logan\'s broom.'],[lo,'…It was an accident. I knocked it with the broom.'],[gr,'Then you say so. You don\'t let an associate take it. Logan. My office.'],[ca,'(Carter says nothing. He stares at Danny the whole time.)'],[ez,'Thanks, Danny. You didn\'t have to.'],[DANNY,'Yeah, I did.']]);c9Award('d5',15,'Day 5 trial')},done)}

// ================================================================ NIGHT 5 · THE BETRAYAL GAME
async function c9N5Open(done){await c8Cine(async()=>{await c9Unveil(5,60,12,PI,[60,2.2,16],[60,1.4,6]);const v=c9F('spk');c4Shot(c9QW(58,2,15),c9QW(60,3.6,.8),1.4);
  await c8Lines([[null,'A cell. The door is shut. The other two are gone.',2.8],[v,'Ezra talked, Kowalski. He says you swung first. He says you wanted to.'],[v,'And Marcus says you\'re going to tell Grant everything and let them take the fall.'],[v,'Sleep tight.']])},done)}
async function c9N5Compare(done){await c8Cine(async()=>{c9NE(5);const e=c9F('ve'),m=c9F('vm');c4DanAt(...c9QX(56.8,4),-PI/2);c4Shot(c9QW(58.6,1.6,6),c9QW(56.2,1.2,4),0);try{tone(900,.05,'square',.04)}catch(x){}await c4Wt(.5);
  await c8Lines([[e,'Danny? Danny, is that you on the pipe?'],[e,'They told me you blamed me. For Andre.'],[m,'They told ME you were going to talk. They played me a tape of Ezra saying it.'],[DANNY,'They gave me a note in Carter\'s handwriting and a tape that\'s been cut and spliced.'],[e,'So all three of us heard a different story.'],[m,'Which means none of them are true.']])},done)}
async function c9N5Trust(done){await c8Cine(async()=>{c9NE(5);const e=c9F('ve');c4Shot(c9QW(58.6,1.6,6),c9QW(56.2,1.2,4),0);
  await c8Lines([[e,'There\'s a lock on my door with three symbols. A lamp, a star, a book. I\'ve got the star scratched in my wall. Number two.'],[c9F('vm'),'Book, in mine. Number three.']]);
  await c8Choose(e,'Night 5 · The Betrayal Game','Ezra: "What\'s in yours, Danny?"',[['"(Say nothing. Keep it to yourself.)"',0,[[DANNY,'(If I don\'t trust them, nobody gets out. That\'s the whole game.)']]],['"A lamp. Number one. Lamp, star, book."',1]]);
  await c8Lines([[e,'Lamp, star, book. Like the coat of arms.']])},done)}
async function c9N5Lock(done){await c8Cine(async()=>{c9NE(5);c4DanAt(...c9QX(57,8.3),-PI/2);c4Shot(c9QW(58.6,1.7,7),c9QW(56.1,1.4,8.3),0);await c4Wt(.4);
  await c8Choose(null,'Night 5 · The Betrayal Game','The lock has three dials.',[['Book · Star · Lamp',0,[()=>{try{tone(120,.3,'square',.05)}catch(e){}},[null,'The lock buzzes.',1.6]]],['Star · Lamp · Book',0,[()=>{try{tone(120,.3,'square',.05)}catch(e){}},[null,'The lock buzzes.',1.6]]],['Lamp · Star · Book',1]]);
  try{tone(880,.15,'sine',.06);tone(1320,.2,'sine',.05)}catch(e){}c9Doors(0);c9S().bia5=1;await c4Wt(.6);const ez=c9F('ez'),mc=c9F('mc');c4DanTo(...c9QX(52,14),1.4);if(ez)c4To(ez,...c9QX(52.8,13),1.4);if(mc)c4To(mc,...c9QX(51.2,13.4),1.6);c4Shot(c9QW(52,2,16.6),c9QW(52,1.4,12),1.2);await c4Wt(2);
  await c8Lines([[null,'All three doors open at once. It only ever worked if all three of them told the truth.',3.2],[c9F('mc'),'Nobody believe a single thing they say down here. Deal?'],[DANNY,'Deal.']]);await c9NightEnd(5,'Loyalty is tested when trust is difficult. It is not the same as unquestioning obedience.',5)},done)}

// ================================================================ DAY 6 · FRATERNITY SECRETS
async function c9D6Exam(done){await c8Cine(async()=>{await c9Morning(6,'Fraternity Secrets');c9DayCast(6);const gr=c9K('grant'),ca=c9K('carter'),lo=c9K('logan');if(gr)gr.pup.y=.6;
  await c4Fade(async()=>{c4DanAt(...c9AX(24,10),PI);c4Shot(c9AW(24,2.2,14),c9AW(24,1.8,4),0)});
  await c8Lines([[gr,'Oral exam. Customs, expectations, and what stays inside this house.']]);
  await c9Quiz(gr,'Day 6 · Fraternity Secrets',[['What does the open book on the coat of arms stand for?',[['"The library."',0,'No.'],['"The ritual nobody is allowed to write down."',1],['"Grades."',0,'Cute. No.']]],
    ['A brother calls you at three in the morning. What do you do?',[['"Pick up."',1],['"Text him back in the morning."',0,'Wrong.'],['"Ask what\'s in it for me."',0,'Wrong.']]],
    ['Finish it: "What is said in chapter…"',[['"…stays in chapter."',1],['"…goes in the group chat."',0,'Wrong.'],['"…depends who\'s asking."',0,'Wrong.']]],
    ['Who may take down the house flag?',[['"The president."',0,'No.'],['"Nobody. Unless it\'s for a tailgate."',1],['"Anybody who irons it."',0,'No.']]]]);
  c4Shot(c9AW(22.6,1.75,9.4),c9AW(20.4,1.65,6.4),1);await c8Lines([[ca,'One more. Mine.'],[ca,'Is there anything you\'re keeping from your brothers, Kowalski?']]);
  const c=await c8Choose(ca,'Day 6 · Fraternity Secrets','Carter holds your eyes. Logan looks at the floor.',[['"No."',1],['"Nothing that\'s mine alone to tell."',1],['"(Tell them about Andre.)"',1]]);
  if(/Andre/.test(c[0])){c9S().exposed=1;await c8Lines([[DANNY,'Andre didn\'t run away. He died in the Haze Room. I—'],[gr,'That\'s enough. Exam\'s over. Everybody out.'],[ca,'(Carter leans in.) Say one more word and Ezra and Marcus go down with you. Think about them.'],[DANNY,'(…He\'s right. It isn\'t only mine.)']])}
  else await c8Lines([[ca,'Good answer.'],[DANNY,'(He didn\'t want an answer. He wanted me to remember he holds the other half of the secret.)']]);
  await c8Lines([[gr,'You pass. Go.']]);if(gr)gr.pup.y=null;c9Award('d6',15,'Day 6 trial')},done)}

// ================================================================ NIGHT 6 · THE COURT OF SECRETS
async function c9N6Open(done){await c8Cine(async()=>{await c9Unveil(6,20,31,PI,[20,3,34],[20,1.8,8]);const j=c9F('judge');c4Shot(c9QW(16,2.6,22),c9QW(20,2.4,3),1.6);
  await c8Lines([[null,'A courtroom built out of bedsheets and folding tables. A full gallery. Two masks in the front row he knows: a goat and a pig.',3.6],[j,'Take the stand, associate.']])},done)}
async function c9N6Case(done){await c8Cine(async()=>{c9NE(6);const j=c9F('judge'),ac=c9F('acc');c4DanAt(...c9QX(12,11),PI*.75);c4Shot(c9QW(10,2,13.4),c9QW(20,2.2,3),0);
  await c8Lines([[j,'The court hears the case of Thomas Reyes. Spring of 1987. A pledge who fell down the basement stairs, they say, and was never seen again.'],[j,'The accused was there that night. He says he saw nothing. Examine the evidence.'],[ac,'…I saw nothing.']])},done)}
const C9EX=[['A','Campus police report, 1987: "accidental fall." The stamp and the ink have faded together, and the case number matches the archive sticker.',1],
  ['B','Twelve statements from twelve brothers. Every one uses the same words in the same order, down to the same misspelling: "he slipt."',0],
  ['C','A paddle with a cracked handle. "SPRING \'87" is carved into it, and the carving is as worn as the wood.',1],
  ['D','A newspaper clipping: "Pledge transfers out of state, family says." It\'s printed on this year\'s paper, in a laser-printer font.',0]];
function c9N6Ex(i){return fin=>{c8Cine(async()=>{c9NE(6);const j=c9F('judge'),[t,txt,real]=C9EX[i];c4DanAt(...c9QX(16.6+i*.95,15.8),PI);c4Shot(c9QW(16.6+i*.95+.8,1.7,17),c9QW(16.6+i*.95,.8,14.6),0);await c4Wt(.4);
  await c8Lines([[null,'Exhibit '+t+'. '+txt,4]]);await c8Choose(j,'Night 6 · Exhibit '+t,'The Judge: "Genuine, or fabricated?"',[['"Genuine."',!!real,[()=>c9Wax(-2,'Wrong call'),[j,'Look closer.']]],['"Fabricated."',!real,[()=>c9Wax(-2,'Wrong call'),[j,'Look closer.']]]])},fin)}}
async function c9N6Verdict(done){await c8Cine(async()=>{c9NE(6);const j=c9F('judge'),ac=c9F('acc'),gt=c9F('goat');c4DanAt(...c9QX(12,11),PI*.75);c4Shot(c9QW(14,1.9,13.6),c9QW(24,1.6,17.4),0);
  await c8Choose(j,'Night 6 · The Court of Secrets','The Judge: "Is the accused hiding the truth to protect the fraternity?"',[['"No. He saw nothing."',0,[()=>c9Wax(-2,'Wrong call'),[j,'Read Exhibit B again.']]],['"Yes. Somebody wrote his story for him, and the clipping covers for it."',1]]);
  c4Shot(c9QW(13.4,1.8,12.6),c9QW(20,2.6,2.2),1.2);await c8Lines([[ac,'…'],[j,'Then the court asks you, associate.'],[j,'Would you tell the truth if doing so destroyed your own brotherhood?']]);
  const c=await c8Choose(j,'Night 6 · The Court of Secrets','The gallery goes quiet. The goat mask in the front row doesn\'t move.',[['"Yes. A brotherhood that needs a lie isn\'t one."',1],['"I don\'t know. That\'s the honest answer."',1],['"(Tell the court what happened to Andre.)"',1]]);
  if(/Andre/.test(c[0])){c9S().exposed=1;await c8Lines([[DANNY,'There was another death. Andre Wallace. In the Haze Room. We—'],()=>{try{noise(.6,.3,90)}catch(e){}},[null,'Every light in the room goes out at once.',2.4],[gt,'(close, in the dark) Careful, Kowalski. Ezra and Marcus are standing right behind you.']])}
  c4Shot(c9QW(13,1.75,12.4),c9QW(14,1.65,25.4),1.2);await c8Lines([[DANNY,'(Thomas Reyes. The basement stairs. Twelve brothers with one story. They didn\'t write this trial for the values. They wrote it for me.)'],[gt,'Sleep well, Kowalski.']]);
  await c9NightEnd(6,'Accept responsibility, even when the truth has consequences. Protecting people is not the same as protecting a lie.',5)},done)}

// ================================================================ DAY 7 · FINAL EVALUATION
async function c9D7Open(done){await c8Cine(async()=>{await c9Morning(7,'Final Evaluation');c9DayCast(7);const gr=c9K('grant');await c4Fade(async()=>{c4DanAt(...c9AX(24,27),PI);c4Shot(c9AW(26,1.8,29.4),c9AW(24,1.6,24),0)});
  await c8Lines([[gr,'Final evaluation. Everything from this week, one more time. Five stations.'],[gr,'History, the house, your body, your nerve, and your brothers.']])},done)}
async function c9D7Sprint(fin){await c8Cine(async()=>{c4DanAt(...c9AX(46.5,2.4),PI);c4Shot(c9AW(44,2,8),c9AW(46.5,1.2,2),0);await c4Wt(.3);c4DanTo(...c9AX(46.5,14),4.8);await c4Wt(2.2);c4DanTo(...c9AX(46.5,2.4),4.8);await c4Wt(2.2);await c8Lines([[c9K('logan'),'Eleven seconds. Fine.']])},fin)}
async function c9D7Loyal(fin){await c8Cine(async()=>{const ca=c9K('carter');c4DanAt(...c9AX(24,17.6),PI);c4To(ca,...c9AX(24,16.2),1.2);c4Shot(c9AW(26,1.8,19.6),c9AW(24,1.6,16),0);
  await c8Lines([[ca,'Last station. Mine. Tell Grant Ezra slacked this week, and I\'ll pour wax into your candle myself.']]);
  await c8Choose(ca,'Day 7 · Final Evaluation','Carter holds out a lit candle stub.',[['"(Take the deal.)"',0,[[DANNY,'(…No. Wax doesn\'t move. Neither do I.)']]],['"Wax doesn\'t transfer, Carter. Neither do I."',1]]);await c8Lines([[ca,'…Your funeral.']])},fin)}
async function c9D7End(done){await c8Cine(async()=>{c9DayCast(7);const gr=c9K('grant');c4DanAt(...c9AX(24,27),PI);c4Shot(c9AW(26,1.8,29.4),c9AW(24,1.6,24),0);
  await c8Lines([[gr,'Five for five. One more night, Danny. The last one.']]);c9Award('d7',20,'Final evaluation')},done)}

// ================================================================ NIGHT 7 · THE FINAL JUDGMENT
async function c9N7Open(done){await c8Cine(async()=>{await c9Unveil(7,20,32,PI,[20,4,36],[20,1,16]);const j=c9F('r5');c4Shot(c9QW(28,3.4,30),c9QW(20,1.2,16),1.8);
  await c8Lines([[null,'Seven rooms in a ring, built out of every Nightmare of the week. In the middle, a circle of candles. Ezra and Marcus are already there.',3.6],[j,'Seven rooms. One last time. Then we\'ll see what you are.']])},done)}
const C9R7=[['The Door','A founder steps out of the doorframe.',f=>[[f,'Not a brother yet.'],[DANNY,'Not yet. But close.']]],
  ['The House','A broom, a bucket, nobody watching.',f=>[()=>{try{noise(.8,.05,2200)}catch(e){}},[null,'He sweeps the spot clean. Nobody claps. That\'s fine.',2.6]]],
  ['The Corridor','A speaker hisses his own voice at him.',f=>[[f,'…I didn\'t mean to…'],[DANNY,'I know what I did. I\'ll carry it. You don\'t get to.']]],
  ['The Inspection','The board of orders, every pair crossed out.',f=>[[f,'Satisfy all of them.'],[null,'He tears the board in half.',2]]],
  ['The Lock','A lamp, a star, a book.',f=>[[f,'Ezra says you\'ll break first.'],[c9F('ez'),'(from the circle) I never said that. Keep walking, Danny.']]],
  ['The Court','The gavel comes down.',f=>[[f,'Would you tell the truth?'],[DANNY,'Ask me again at initiation.']]],
  ['The Chair','A wooden chair with a rope around it. The Haze Room.',f=>[[f,'Remember the chair?'],[DANNY,'Every night. Luke didn\'t get to walk out. I did. I\'m not forgetting either one.']]]];
function c9N7Room(i){return fin=>{c8Cine(async()=>{c9NE(7);const a=i/7*TAU-PI/2,x=20+Math.cos(a)*9.6,z=18+Math.sin(a)*9.6,f=c9F('r'+i);c4DanAt(...c9QX(x,z),Math.atan2(Math.cos(a),Math.sin(a)));
  c4Shot(c9QW(20+Math.cos(a)*6.4,2,18+Math.sin(a)*6.4),c9QW(20+Math.cos(a)*11.6,1.5,18+Math.sin(a)*11.6),0);await c4Wt(.4);await c8Lines([[null,C9R7[i][0]+'. '+C9R7[i][1],2.4],...C9R7[i][2](f)])},fin)}}
async function c9N7Provoke(done){await c8Cine(async()=>{c9NE(7);const ez=c9F('ez'),mc=c9F('mc'),s=c9F('r2'),j=c9F('r5');c4DanAt(...c9QX(20,24),PI);if(s)c4To(s,...c9QX(17.6,24.6),2);if(j)c4To(j,...c9QX(22.6,24.6),2);c4Shot(c9QW(20,2,28.6),c9QW(20,1.4,20),0);await c4Wt(1.6);
  await c8Lines([[s,'Look at the candles, Ezra. His is taller than yours. Ask yourself why.'],[ez,'…'],[j,'Kowalski. Blow out Marcus\'s candle and yours burns forever. That\'s a promise.']]);
  await c8Choose(j,'Night 7 · The Final Judgment','The Judge points at Marcus\'s flame.',[['"(Reach for Marcus\'s candle.)"',0,[[DANNY,'(…No. Not him. Not ever.)']]],['"Wax doesn\'t transfer. Neither does this. Nobody\'s candle goes out for mine."',1]]);
  await c8Lines([[mc,'Told you he wouldn\'t.'],[ez,'Yeah. You did.']]);if(s)c4To(s,...c9QX(20+Math.cos(TAU*2/7-PI/2)*12.6,18+Math.sin(TAU*2/7-PI/2)*12.6),2);if(j)c4To(j,...c9QX(20+Math.cos(TAU*5/7-PI/2)*12.6,18+Math.sin(TAU*5/7-PI/2)*12.6),2)},done)}
async function c9N7Circle(done){await c8Cine(async()=>{c9NE(7);const ez=c9F('ez'),mc=c9F('mc'),j=c9F('r5');c4DanAt(...c9QX(20,19.6),PI);if(ez)c4To(ez,...c9QX(18.6,17.4),1.2);if(mc)c4To(mc,...c9QX(21.4,17.4),1.2);c4Shot(c9QW(20,2.4,23.4),c9QW(20,1.2,18),0);await c4Wt(1.2);
  await c8Lines([[j,'Stand together, then. And tell us what brotherhood means.']]);
  await c8Choose(j,'Night 7 · The Final Judgment','Every mask in the ring turns to you.',[['"Doing what you\'re told."',0,[[DANNY,'(That\'s their version.)']]],['"A secret you keep for each other."',0,[[DANNY,'(No. That\'s what they want it to be.)']]],['"Standing next to people with your own eyes open. Carrying each other, not each other\'s lies."',1]]);
  await c8Lines([[ez,'Showing up when it costs you something.'],[mc,'And still being yourself at the end of it.'],[null,'The flames in the ring stand straight up. For a second, nobody in a mask says anything.',3]]);c9S().bia7=1;
  await c9NightEnd(7,'Brotherhood requires loyalty, courage and personal responsibility. It cannot require surrendering your judgment.',10)},done)}
// the ending: back in the house at dawn, three candles still burning
async function c9Ending(done){await c8Cine(async()=>{await c4Fade(async()=>{c4Off('c9m');c4Off('c9v');for(const k in C9.g)c9Del(k);c9Dark(0);goIn('asr',24,25);if(S.gt>12||S.gt<6.2)c4At(6.2);
    const gr=c9Cast('grant',18.4,21.8,PI/2),ca=c9Cast('carter',19,24.6,PI*.6),lo=c9Cast('logan',19,18.9,PI*.4),ez=c9Cast('ezra',22.2,22.9,-PI/2),mc=c9Cast('marcus',22,24.3,-PI/2);c4DanAt(...c9AX(22,21.5),-PI/2);c4Shot(c9AW(19.2,1.5,21.9),c9AW(16.75,1.05,20.45),0)});
  await c4Wt(.8);await c8Lines([[null,'Dawn. They come up out of the basement one at a time. On the table in the chapter room, three candles are still burning.',3.6]]);
  const gr=c9K('grant'),ca=c9K('carter');c4Shot(c9AW(25,2.2,26),c9AW(19.4,1.5,21.8),1.4);await c4Wt(1);
  await c8Lines([[gr,'You made it through the week. That\'s no small thing.'],[ca,'Seven days. Seven tests. Seven Nightmares.'],[gr,'Hell Week is complete. Get some sleep. You\'ve earned it.']]);
  c4To(ca,...c9AX(20.8,21.2),1.2);c4Shot(c9AW(23.6,1.75,20.2),c9AW(20.8,1.65,21.2),1.2);await c4Wt(1.6);await c8Lines([[ca,'See you at initiation.']]);
  const S9=c9S();S9.ach.hell=1;if(S9.bia5&&S9.bia7)S9.ach.arms=1;if(!S9.exposed)S9.ach.mouth=1;
  for(const[k,t,d]of[['hell','SURVIVED HELL','All seven days, candle still burning.'],['arms','BROTHERS IN ARMS','The Loyalty and Brotherhood Nightmares, side by side.'],['mouth','KEEP YOUR MOUTH SHUT','Hell Week ended with the secret still kept.']]){if(!S9.ach[k])continue;c9AchBanner(t,d);try{tone(880,.12,'sine',.05);tone(1320,.18,'sine',.04)}catch(e){}await c4Wt(2.4)}
  await c8Lines([[null,'Hell Week is over. Initiation isn\'t. And Andre is still a secret.',3.4]]);big('CHAPTER 9 · HELL WEEK · COMPLETE',3200);await c4Wt(3.4)},done,{after:()=>{c4Off('c9c')}})}
function c9AchBanner(t,d){const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;top:22%;transform:translateX(-50%) scale(.9);z-index:40;padding:12px 22px;border-radius:12px;background:linear-gradient(180deg,#3a2a0e,#1a1206);border:2px solid #e2b64c;color:#ffe9a8;font:700 15px system-ui;text-align:center;box-shadow:0 0 32px rgba(226,182,76,.55);opacity:0;transition:opacity .4s,transform .4s';
  e.innerHTML='<div style="font-size:11px;letter-spacing:.2em;opacity:.8">ACHIEVEMENT UNLOCKED</div><div style="font-size:20px;margin:3px 0">🏆 '+t+'</div><div style="font-weight:400;opacity:.85">'+d+'</div>';document.body.appendChild(e);requestAnimationFrame(()=>{e.style.opacity=1;e.style.transform='translateX(-50%) scale(1)'});setTimeout(()=>{e.style.opacity=0;setTimeout(()=>e.remove(),500)},2200)}

// ================================================================ the quests
const c9Check=n=>c5List('Check your candle',[{k:'q9c'+n,l:'Check your candle in the chapter room',at:()=>c9A(18,20.45),act:'Check your candle',run:fin=>c9CheckCandle(fin)}]);
const c9Bunk=()=>c9Go('Go back to your bunk when night falls',()=>c9A(3.4,6),{r:2,act:'Turn in for the night'});
const c9Day=(n,name,steps)=>({id:'c9d'+n,ch:9,main:1,name:'Day '+n+' · '+name,at:[84,79],pre:n>1?['c9n'+(n-1)]:undefined,steps:()=>[{t:'fx',f:()=>c9DayFx(n)},...steps(),c9Check(n),c9Bunk(),{t:'cine',run:d=>c9Escort(n,C9NN[n-1],d)}],fin:()=>c5Next('c9n'+n)});
const C9NN=['The Unworthy','The Endless House','The Gauntlet of Fear','The Impossible Inspection','The Betrayal Game','The Court of Secrets','The Final Judgment'];
const c9Night=(n,steps,fin)=>({id:'c9n'+n,ch:9,main:1,name:'Night '+n+' · '+C9NN[n-1],at:[84,79],pre:['c9d'+n],steps:()=>[{t:'fx',f:()=>c9NightFx(n)},...steps()],fin:fin||(()=>c5Next('c9d'+(n+1)))});
const C9M=[
 c9Day(1,'Fraternity History',()=>[
   {t:'cine',run:c9D1Assign},
   c5List('Study the house',[
     {k:'q9a1',l:'Read the chapter charter',at:()=>c9A(17.6,22.5),act:'Read the charter',run:c9Note('Day 1 · Study','The charter that founded the chapter in 1952. Seven signatures run along the bottom: seven founders.')},
     {k:'q9a2',l:'Study the coat of arms',at:()=>c9A(46.4,23.5),act:'Study the coat of arms',run:c9Note('Day 1 · Study','Lamp for knowledge. Star for honor. The open book for the ritual nobody may write down. The ribbon: FIDES · FRATERNITAS · MCMLII.')},
     {k:'q9a3',l:'Look over the pledge class composites',at:()=>c9A(32.9,9.3),act:'Study the composites',run:c9Note('Day 1 · Study','Every pledge class since 1952. One frame is empty: 2019. Nobody will say why.')},
     {k:'q9a4',l:'Look at the house flag',at:()=>c9A(33.6,23.8),act:'Study the flag',run:c9Note('Day 1 · Study','The house flag. Ironed exactly once, in 2009. Nobody takes it down unless it\'s for a tailgate.')}]),
   c9Go('Take the history quiz in the throne room',()=>c9A(24,10),{act:'Take the quiz'}),
   {t:'cine',run:c9D1Quiz}]),
 c9Night(1,()=>[
   {t:'cine',run:c9N1Open},
   c5List('Enter the seven doors',C9VAL.map((v,i)=>({k:'q9n1'+i,l:'The door of '+v.charAt(0)+v.slice(1).toLowerCase(),need:i?()=>c5S().d['q9n1'+(i-1)]:null,at:()=>c9Q(5+i*5,13.4),act:'Open the door: '+v,run:c9N1Door(i)}))),
   c9Go('Open the final door',()=>c9Q(20,5.4),{act:'Open the final door'}),
   {t:'cine',run:c9N1Final}]),
 c9Day(2,'House Responsibilities',()=>[
   {t:'cine',run:d=>c8Cine(async()=>{await c9Morning(2,'House Responsibilities')},d)},
   {t:'cine',run:c9D2Assign},
   c5List('Do your chores',[
     {k:'q9b1',l:'Bag the kitchen trash',at:()=>c9A(56,24.3),act:'Bag the trash',run:fin=>{toast('Three bags. Somebody put a whole pizza in here.',2200);fin()}},
     {k:'q9b2',l:'Take the trash out the back door',need:()=>c5S().d.q9b1,at:()=>c9A(46.5,2.2),act:'Take out the trash',run:fin=>{try{noise(.4,.08,400)}catch(e){}toast('Out. Lid on.',1600);fin()}},
     {k:'q9b3',l:'Scrub the sink',at:()=>c9A(49.3,10.2),act:'Scrub the sink',run:fin=>{try{noise(.8,.05,2400)}catch(e){}toast('Something was living in the drain. Not anymore.',2200);fin()}},
     {k:'q9b4',l:'Run the laundry',at:()=>c9A(60,10),act:'Run the laundry',run:fin=>{try{noise(.6,.06,300)}catch(e){}toast('Whites and colors. Separately. Like a person.',2200);fin()}},
     {k:'q9b5',l:'Clean the beer pong table',at:()=>c9A(41,5.8),act:'Clean the table',run:fin=>{toast('Sticky. Then less sticky.',1800);fin()}},
     {k:'q9b6',l:'Straighten up the TV room',at:()=>c9A(10.6,27),act:'Straighten the TV room',run:fin=>{toast('Forty-one remotes. Two TVs.',1800);fin()}}]),
   c5List('The mess nobody assigned',[{k:'q9b7',l:'Deal with the spilled cereal in the hall',at:()=>c9A(30,16),act:'Look at the mess',run:fin=>{c8Choose(null,'Day 2 · House Responsibilities','Cereal and milk all over the hallway. It isn\'t on your list.',[['"(Step over it. Not my chore.)"',1],['"(Clean it up.)"',1]]).then(c=>{if(/Clean/.test(c[0])){c9Award('d2mess',5,'Nobody asked');toast('Grant saw that.',2000)}else{c9Wax(-3,'Somebody else\'s problem?')}mode='play';fin()})}}],{start:()=>c9Grp('cereal',g=>{const I=INT.asr;for(let i=0;i<14;i++)c9M(g,bgeo(.05,.02,.05),0xd8a050,I.x0+30+Math.sin(i*2.4)*.6,.02,I.z0+16+Math.cos(i*1.3)*.5);const m=c9M(g,new THREE.CircleGeometry(.5,16),mt(0xf2f2ee,.2),I.x0+30,.015,I.z0+16);m.rotation.x=-PI/2})}),
   {t:'fx',f:()=>c9Del('cereal')},
   {t:'cine',run:c9D2Report}]),
 c9Night(2,()=>[
   {t:'cine',run:c9N2Open},
   c5List('Put everything back where it belongs',[
     {k:'q9e1',l:'The gavel is sitting on the TV',at:()=>c9Q(52,1.9),act:'Put the gavel back',run:c9N2Put('gavel','Gavel back on its stand.')},
     {k:'q9e2',l:'A composite frame is lying on the floor',at:()=>c9Q(59,14.6),act:'Hang the composite',run:c9N2Put('comp','Back on the wall.')},
     {k:'q9e3',l:'Someone threw the house flag in the trash',at:()=>c9Q(60,3),act:'Take out the flag',run:c9N2Put('flag','The flag goes back up.')},
     {k:'q9e4',l:'The lamp is knocked over',at:()=>c9Q(50,13.6),act:'Set the lamp back',run:c9N2Put('lamp','The lamp goes back on the table.')}]),
   c5List('Finish the neglected chores',[
     {k:'q9e5',l:'Wipe the mirror',at:()=>c9Q(47.2,4),act:'Wipe the mirror',run:c9N2Chore('smudge','Clean.')},
     {k:'q9e6',l:'Sweep the floor',at:()=>c9Q(52,13),act:'Sweep',run:c9N2Chore('dust','Swept.')},
     {k:'q9e7',l:'Empty the trash',need:()=>c5S().d.q9e3,at:()=>c9Q(60,3),act:'Empty the trash',run:c9N2Chore('trash','Empty.')}]),
   c9Go('Leave the house',()=>c9Q(62.4,9.25),{act:'Go through the EXIT door'}),
   {t:'cine',run:c9N2Loop},
   c5List('Do it again, with nobody watching',[
     {k:'q9e8',l:'Put the gavel back. Again.',at:()=>c9Q(52,1.9),act:'Put the gavel back',run:c9N2Put('gavel','Again.')},
     {k:'q9e9',l:'Hang the composite. Again.',at:()=>c9Q(59,14.6),act:'Hang the composite',run:c9N2Put('comp','Again.')},
     {k:'q9e10',l:'Sweep the floor. Again.',at:()=>c9Q(52,13),act:'Sweep',run:c9N2Chore('dust','Again.')}]),
   {t:'cine',run:c9N2End}]),
 c9Day(3,'Physical Evaluation',()=>[
   {t:'cine',run:c9D3Open},
   c9LapStep(48),
   c9PushStep(15),
   {t:'cine',run:c9D3Composure},
   {t:'cine',run:c9BackInside}]),
 c9Night(3,()=>[
   {t:'cine',run:c9N3Open},
   c9Go('Enter the dark corridor',()=>c9Q(3,40),{act:'Step into the corridor'}),
   {t:'cine',run:c9N3Rec},
   c9Go('Walk the Gauntlet',()=>c9Q(14,40),{act:'Keep walking'}),
   {t:'cine',run:c9N3Fig('g1',14,'You hit him because you wanted to.',[['"…Maybe I did."',0,[()=>c9Wax(-3,'Said what they wanted'),[DANNY,'(No. I was getting Andre off Ezra. That\'s the truth, and I\'m keeping it.)']]],['"I was pulling him off Ezra. I\'m not pretending it was anything else."',1]])},
   c9Go('Keep walking the Gauntlet',()=>c9Q(28,40),{act:'Keep walking'}),
   {t:'cine',run:c9N3Fig('g2',28,'You\'re only here because Grant likes you.',[['"You\'re right. I\'m nothing without him."',0,[()=>c9Wax(-3,'Said what they wanted'),[DANNY,'(…That\'s Carter talking. Not me.)']]],['"Then cut me. I\'m still not going to agree with you."',1],['"I\'m here because I didn\'t quit."',1]])},
   c9Go('Keep walking the Gauntlet',()=>c9Q(42,40),{act:'Keep walking'}),
   {t:'cine',run:c9N3Fig('g3',42,'Say it: "I\'ll do anything this house asks."',[['"I\'ll do anything this house asks."',0,[()=>c9Wax(-3,'Said what they wanted'),[DANNY,'(Anything. That\'s how Luke ended up under a sheet.)']]],['"I\'ll do what\'s right. That\'s not the same thing."',1]])},
   c9Go('Face the end of the corridor',()=>c9Q(56,40),{act:'Keep walking'}),
   {t:'cine',run:c9N3Grant},
   c9Go('Reach the end of the Gauntlet',()=>c9Q(62,40),{act:'Touch the far wall'}),
   {t:'cine',run:c9N3End}]),
 c9Day(4,'Tradition and Endurance',()=>[
   {t:'cine',run:c9D4Open},
   c9VigilStep(40),
   {t:'cine',run:c9D4End},
   {t:'cine',run:c9BackInside}]),
 c9Night(4,()=>[
   {t:'cine',run:c9N4Open},
   c5List('Visit the inspection stations',[
     {k:'q9g1',l:'The uniform station',at:()=>c9Q(8,18),act:'Stand for inspection',run:c9N4Station(0,[0,4])},
     {k:'q9g2',l:'The posture station',at:()=>c9Q(20,22),act:'Stand for inspection',run:c9N4Station(1,[1,5])},
     {k:'q9g3',l:'The recitation station',at:()=>c9Q(32,18),act:'Stand for inspection',run:c9N4Station(2,[2,3])}]),
   c9Go('Read the orders on the board',()=>c9Q(28,7),{act:'Read the orders'}),
   {t:'cine',run:c9N4Contra},
   {t:'cine',run:c9N4Refuse}]),
 c9Day(5,'Loyalty and Problem-Solving',()=>[
   {t:'cine',run:c9D5Open},
   c5List('Find out what really happened',[
     {k:'q9h1',l:'Look at the broken trophy',at:()=>c9A(31,10.4),act:'Look at the pieces',run:c9Note('Day 5 · The Trophy','The lamp was knocked off its shelf from the side, low, about the height of a broom handle. Flecks of gold paint went everywhere.')},
     {k:'q9h2',l:'Read the chore log on the fridge',at:()=>c9A(56,24.3),act:'Read the chore log',run:c9Note('Day 5 · The Chore Log','EZRA COLE · laundry · 11 PM - 1 AM. In Logan\'s handwriting. So by Logan\'s own log, Ezra was in the laundry room when it broke.')},
     {k:'q9h3',l:'Ask Tank what he heard',at:c9AtK('tank'),act:'Talk to Tank',run:fin=>c8Talk(c9K('tank'),'Day 5 · Tank','"Around midnight? Big crash. Then Logan going \'no no no no\'. Then sweeping. Lot of sweeping."',null,fin)},
     {k:'q9h4',l:'Check the broom by the basement stairs',at:()=>c9A(3,16),act:'Check the broom',run:c9Note('Day 5 · The Broom','Gold paint in the bristles. Logan\'s initials on the handle, in Sharpie.')}]),
   c9Go('Tell Grant what you found',()=>c9A(24,10),{act:'Talk to Grant'}),
   {t:'cine',run:c9D5Decide},
   {t:'fx',f:()=>c9Shards(0)}]),
 c9Night(5,()=>[
   {t:'cine',run:c9N5Open},
   c5List('Find the clues in your cell',[
     {k:'q9i1',l:'The note slipped under the door',at:()=>c9Q(57,9.6),act:'Read the note',run:c9Note('Night 5 · The Note','"Danny told them it was my idea. — E." It isn\'t Ezra\'s handwriting. It\'s the same handwriting as the clipboard in the Haze Room. Carter\'s.')},
     {k:'q9i2',l:'The symbol scratched into the wall',at:()=>c9Q(63,4),act:'Look at the wall',run:c9Note('Night 5 · The Wall','A lamp, scratched deep into the paint. Under it: I.')},
     {k:'q9i3',l:'The tape player in the corner',at:()=>c9Q(58.5,2),act:'Play the tape',run:fin=>{try{tone(300,.6,'sawtooth',.02)}catch(e){}c9Note('Night 5 · The Tape','Marcus\'s voice: "…Danny\'s going to… tell…" There\'s a click between every word. Somebody cut it together.')(fin)}}]),
   c9Go('Find a way to talk to the others',()=>c9Q(57,4),{act:'Knock on the pipe'}),
   {t:'cine',run:c9N5Compare},
   {t:'cine',run:c9N5Trust},
   c9Go('Solve the lock on your door',()=>c9Q(57,8.3),{act:'Work the lock'}),
   {t:'cine',run:c9N5Lock}]),
 c9Day(6,'Fraternity Secrets',()=>[
   {t:'cine',run:c9D6Exam}]),
 c9Night(6,()=>[
   {t:'cine',run:c9N6Open},
   c9Go('Take the stand',()=>c9Q(12,11),{act:'Take the stand'}),
   {t:'cine',run:c9N6Case},
   c5List('Examine the evidence',C9EX.map((e,i)=>({k:'q9j'+i,l:'Exhibit '+e[0],at:()=>c9Q(16.6+i*.95,15.8),act:'Examine Exhibit '+e[0],run:c9N6Ex(i)}))),
   c9Go('Return to the stand',()=>c9Q(12,11),{act:'Give your answer'}),
   {t:'cine',run:c9N6Verdict}]),
 c9Day(7,'Final Evaluation',()=>[
   {t:'cine',run:c9D7Open},
   c5List('The five stations',[
     {k:'q9k1',l:'History: the charter',at:()=>c9A(17.6,22.5),act:'Answer the question',run:fin=>{c8Cine(async()=>{const gr=c9K('grant');await c9Quiz(gr,'Day 7 · History',[['Lamp, star, book. Name all three.',[['"Knowledge, honor, the ritual."',1],['"Light, luck, the library."',0,'No.'],['"Honor, knowledge, the ritual."',0,'Out of order.']]]])},fin)}},
     {k:'q9k2',l:'The house: straighten the flag',need:()=>c5S().d.q9k1,at:()=>c9A(33.6,23.8),act:'Straighten the flag',run:fin=>{toast('Square. Level. Nobody had to tell you.',2000);fin()}},
     {k:'q9k3',l:'Your body: sprint to the back door and back',need:()=>c5S().d.q9k2,at:()=>c9A(46.5,2.4),act:'Sprint',run:fin=>c9D7Sprint(fin)},
     {k:'q9k4',l:'Your nerve: hold your candle while Carter talks',need:()=>c5S().d.q9k3,at:()=>c9A(18,20.45),act:'Pick up your candle',run:fin=>{c8Cine(async()=>{const ca=c9K('carter');c4Shot(c9AW(19.2,1.5,21.9),c9AW(16.75,1.1,20.45),0);await c8Lines([[ca,'Shaky hands, Kowalski. Thinking about the basement?'],[null,'The flame doesn\'t move.',2]])},fin)}},
     {k:'q9k5',l:'Your brothers: Carter\'s last station',need:()=>c5S().d.q9k4,at:()=>c9A(24,17.6),act:'Talk to Carter',run:fin=>c9D7Loyal(fin)}]),
   {t:'cine',run:c9D7End}]),
 c9Night(7,()=>[
   {t:'cine',run:c9N7Open},
   c5List('Walk the seven rooms again',C9R7.map((r,i)=>({k:'q9l'+i,l:r[0],need:i?()=>c5S().d['q9l'+(i-1)]:null,at:()=>{const a=i/7*TAU-PI/2;return c9Q(20+Math.cos(a)*9.6,18+Math.sin(a)*9.6)},act:'Enter '+r[0],run:c9N7Room(i)}))),
   {t:'cine',run:c9N7Provoke},
   c9Go('Stand together in the circle',()=>c9Q(20,19.6),{act:'Step into the circle'}),
   {t:'cine',run:c9N7Circle},
   {t:'cine',run:c9Ending}],
  ()=>{c9S().done=1;c9CleanAll();toast('Hell Week complete. See you at initiation.',5200)})];
M.push(...C9M);
