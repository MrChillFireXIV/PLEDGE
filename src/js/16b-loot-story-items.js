// ================================================================ V197 STORY ITEMS + LOOTC CONTAINERS
// 1) Story items: whatever Danny is holding or has grabbed for the current quest shows in the normal 1-2-3 item slots (V225: they take empty slots first, then cover the rightmost pocket item until the quest ends)
//    (live holds like the champagne tray or a furniture load, plus anything picked up with a "Grab/Pick up/Take…" prompt during a quest;
//    those clear when the quest ends). Click one to see what it is.
// 2) Loot: dressers in the ΑΣΡ house and crates / dumpsters around campus can be opened (E) to see what's inside and take it.
//    Each container restocks every day.
Object.assign(ITM,{chips:{ic:'🥔',n:'Chips'},coffee:{ic:'☕',n:'Coffee'},pizza:{ic:'🍕',n:'Pizza Slice'},pills:{ic:'💊',n:'Painkillers'},gum:{ic:'🍬',n:'Candy Bar'}});
const ITMD={bandage:'+40 health',drink:'Unlimited sprint for 12 s',burger:'+60 health',stink:'Makes people nearby gag and back off',chips:'+25 health',coffee:'Unlimited sprint for 8 s',pizza:'+80 health',pills:'+50 health',gum:'+15 health, a bit of sprint'};
function itemEffect(k){if(k==='chips'){S.hp=Math.min(S.mhp,S.hp+25);toast('Chips: +25 health');return 1}if(k==='pizza'){S.hp=Math.min(S.mhp,S.hp+80);toast('Pizza: +80 health');return 1}
  if(k==='pills'){S.hp=Math.min(S.mhp,S.hp+50);toast('Painkillers: +50 health');return 1}if(k==='coffee'){S.sta=staMax();P.drinkT=8;toast('Coffee: unlimited sprint for 8 seconds');return 1}
  if(k==='gum'){S.hp=Math.min(S.mhp,S.hp+15);S.sta=Math.min(staMax(),(S.sta||0)+40);toast('Candy bar: +15 health');return 1}return 0}

// ---------------------------------------------------------------- story items
const KIT={grab:[],el:null,t:0,sig:''};
/* V234 picture used for the 8 ball in the item slot (96x96 jpeg) */
const IMG8BALL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCABgAGADASIAAhEBAxEB/8QAHAAAAQQDAQAAAAAAAAAAAAAAAAMEBgcBBQgC/8QANxAAAgEDAQYFAQYEBwAAAAAAAQIDAAQRBQYSITFBUQcTFGFxIhUjMlKBsUJDkfAIMzRywdHx/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAIBA//EAB0RAQEBAQEAAwEBAAAAAAAAAAABAhExEiFRIkH/2gAMAwEAAhEDEQA/AOVKKd+lTu1YNsndqBrRTr0yd2rHpk7tQNqKc+nTuaz6Qbu/h93OM9M0DWinHp07mjyE7mgb0U48hO5o8hO5oG9FL+QvvR5K+9A5oooNBiiihVZ2CqCWJwAOtBtdlNCO0m0NhpZkaGK4mVJpgM+UhP1N+gq/rjwq0ewRtJ0meLULa1dlkV8ebI35veqt0GGLQrJbcKvqpCHmkB4+yj2FSa61m/h3LqCcoxAGQcMa65zP9VNWeNFtT4b2UVxItj5tlKOHlSj6Sf3FQDUtFvtKkKXMJCjk68VP61fGnbXpqtstvrUMN2ACCJVO8vw445pvd7NWerxNJol4jYJBtLvAJ9lbkaXH4v8AnXv0oGjrU/13YWNJmSWKTT7k8lZfpJ/vtUS1HZ3UNNZvMgaSMfzIxvLiudnE3Fn21lFFFYgrWKzWDQFS7ZLQvLkhvLgKZpOMMbH8I/MaR2A2SG1WsxxTzJb2qsA0jglS3QcATjvVr6n4c63s8skl1ZhUc/d3A4gjvn4xw4V0xnv2IU2TcuCIxKDgZ6+3Clpbm4eFVIjCL0xnIra6jsZqmmM09xbzIzbrLIvFWB45yPatbeDKjARWX8IZun/tdA3iupbWRlVtwFeGMHhT2xnWON0DuFZctusP6gVq3Ei5LpuZ5Hnk1s7W1kmtwYxHlV4brYYd8jtWDbaftZKIfSajHDqdpy3JxllHseYp6NB0fWSx0bUvQzsP9JdHKN7K3/dRC8tZjIcuAev0nqO4rzHctp4UmTip4g099VnVnhbaDw/EbltSsHsZB/PgwUf3yOBqE6rslc6fDJcwzRXNvGN5nB3SozjiDVnaP4iXNoTCH9RE/BYJU8xTUT8VNsdP1trfT9JtI7WK3dmuHhwEnk4AEDsOPPqTUazJOr7m+xBM16jjeaRY413ndgqjuScAf1qRbI+Hm0u3FwI9F0yWSHOHu5fu7eL3aQ8P0GT7V034V+F2wfh5cwy3UseubSBd9bmZPuom6iFTyI/Mfq+OVc0TNra7FeEVnsRpNnGQ0k0SKZSQMmUjixHbOcVM7aa0KR2dxAixx8I1YZUfGafvdidyxOGfnxpOSKOQYdVI6giq+VdZIS1WytZFKPbpJG45MM1X2veEmzmstK8UcljMxyfJbgD33TU+eHcKhHYIP4WOQKTnPJipJxjI4U+VORS20nga3pg+g3onkVRvRXJwWI57pHAZ/s1WdxoepbP3j299ZywyoOAII+CD74OPiuqJS28fp5dRWvvdE0vVJA19YxzyAYV2yGX4PSqmk3H45nkvGkLBpfLK8GVutau9ZLklCdzPEdgo6Vd+2HhfZ21pNfWduDBChd4k/EQvHA7mqY1m6sdno/OMMrXEoLRwyyb3Pqw6AdqrqLONFql+uk2xihBW6nHEk8Uj7+xPT2+aic0hmbjilb27kup3mlctI5yxpACuVvWJVsn4gbQbHuq6dfy+k3t9rSRyYmPUgfwn3FWhYeKNhrV0Lu58y3dkUCNuBRhzIPI8eXtVJWyK7jP1HotP2uPIX6cb3cVnFZ3Y6n2e2+L7qeuSeJQBvEcicnjn2AqcWOurOFJliwwyADkmuG7XaPUNMcGGUsg5Kx5fB6VYWyXjLNassMshUZ4pIeX+01i5uX11tFP5xCgE/AofgpVgcZ4VWWzXiKLyCMJeCMOW3wfqOBjHH5qd6Nqqa26i1bz8qcHlwHNj+1OqOvM4kfVkdTTqGLfQl0A3hgcOdLReVFvMEjkK/iB6/HxUJ8WfF608PdKh8mxjutTuiRDCz7oXuzY6Dt1rTrSeOniDY7H6MdPs7lJNSuVCG2HFlTue2Tjn0+a5G1HUZ7+5e4uJC8shyx/4HtWy2m1+71zULnUdQnaa6uXLyMensPao6zlmzW2uNva9fiNZrC16rGPS3oUYAOPivXrkxyYftTGijDp7mNhybNIMUPLNeKKDbaPtLf6M48mZmiyMxljj9KtHYbx6+wtVszqb332ZG+/NHbIpdsAkLxIyCxGeNUxRRU1Y64X/ABY7Cxxg/ZuuyMoOFNvEB8f5nKqC268TJdutdm1e8haIsN2GBeKwp0Gep96glFC6tLz3Jmcsc0mGArxRRPSokA71nzl96RooP//Z';
const KITIC=[[/champagne|flute|bottle|wine|beer|keg/i,'🍾'],[/tray|plate|snack|food|cake/i,'🍽'],[/towel|robe|cloth|shirt|tux|jersey/i,'🧺'],[/ice/i,'🧊'],[/key/i,'🔑'],[/letter|note|envelope|card|invite|map|list|ledger|book|file|folder|paper|report|photo|picture/i,'📄'],
  [/couch|sectional|recliner|chair|sofa/i,'🛋'],[/arcade|cabinet|tv|screen|speaker/i,'🕹'],[/painting|portrait/i,'🖼'],[/box|crate|package|bag|case|duffel/i,'📦'],[/phone/i,'📱'],[/candle|lantern|torch/i,'🕯'],[/paddle|bat|stick/i,'🏏'],[/cone/i,'🚧'],[/fruit|melon|apple|banana/i,'🍉'],[/ram|goat|mascot/i,'🐏'],[/cash|money|wallet/i,'💵'],[/mask/i,'🎭'],[/ball|football/i,'🏈'],[/drug|bag of|powder|cocaine|pill/i,'💊'],[/camera|recorder|tape/i,'📼'],[/drink|cup|coffee/i,'🥤']];
function kitIcon(n){for(const[r,ic]of KITIC)if(r.test(n))return ic;return'✋'}
function storyGrab(label){if(!AM||!label)return;if(/^(grab a tray of champagne|take a bottle of champagne|take a towel|take the ice bucket)/i.test(String(label).trim()))return;/* chapter 2 supplies are tracked live by kitLive, so they leave the Story slot the moment they are delivered or dropped */if(/^(take over|take a (seat|look|break|shower|nap|picture|photo|selfie)|get (in|out|up|on|off|some|back|ready|dressed)|take (it|him|her|them) |get to |carry on)/i.test(String(label).trim()))return;const m=/^(?:grab|pick up|take|collect|get|lift|steal|swipe|pocket|carry|snag|retrieve|fetch)\s+(?:the |a |an |your |his |her |their |some |one )?(.+?)(?:\s+(?:from|off|out of|out|at|in|on|into|for|to|and|before)\b.*)?(?:\s*\(.*\))?$/i.exec(String(label).trim());if(!m)return;
  let n=m[1].replace(/^painting /,'Painting ').replace(/[.!?:,]+$/,'').trim();if(!n||n.length>40)return;n=n[0].toUpperCase()+n.slice(1);if(KIT.grab.some(g=>g.n===n&&g.m===AM.m.id))return;KIT.grab.push({n,ic:kitIcon(n),m:AM.m.id});if(KIT.grab.length>8)KIT.grab.shift();kitRender(1)}
/* V285 putting a grabbed item down (or handing it over) takes it out of the item slot straight away */
function storyDrop(label){if(!KIT.grab.length||!label)return;const lab=String(label).trim().toLowerCase();
  const strong=/^(put (it |that |this )?(down|back)|put down|set (it )?down|drop\b(?! off)|put back)/.test(lab);
  if(!strong&&!/^(hand|give|deliver|return|place|leave|hang|toss|throw|stash|deposit|turn in|set|put|plant)/.test(lab))return;
  const obj=lab.replace(/^(put down|put back|put it down|put it back|set down|set it down|drop off|drop|hand over|hand in|give back|give|deliver|return|place|leave|hang|toss|throw|stash|deposit|turn in|set|put|plant)\s+/,'').replace(/^(the|a|an|your|his|her|their|some|one)\s+/,'').replace(/\s+(on|in|at|to|into|onto|from|for|by|with)\b.*$/,'').replace(/[.!?:,]+$/,'').trim();
  let hit=KIT.grab.filter(g=>{const n=g.n.toLowerCase();return obj&&(n===obj||lab.includes(n)||(obj.length>2&&(n.includes(obj)||obj.includes(n))))});
  if(!hit.length&&strong)hit=[KIT.grab[KIT.grab.length-1]];
  if(!hit.length)return;KIT.grab=KIT.grab.filter(g=>!hit.includes(g));kitRender(1)}
function kitLive(){const L=[];try{
    if(typeof C3!=='undefined'&&C3.carryM&&typeof c3S==='function'){const k=c3S().carry,f=k&&C3F.find(f=>f[0]===k);if(f)L.push({n:f[1].replace(/^Painting: /,'Painting: '),ic:kitIcon(f[1])})}
    if(typeof C2!=='undefined'&&C2.heldM&&C2.a&&C2.a.hold){const h=C2.a.hold;L.push({n:{champagne:'Champagne tray',towel:'Towel',ice:'Ice bucket'}[h]||h,ic:{champagne:'🍾',towel:'🧺',ice:'🧊'}[h]||kitIcon(h)})}
    if(typeof C2!=='undefined'&&AM&&AM.m.id==='c2room'&&C2.r&&C2.r.glasses>0)L.push({n:'Champagne tray',ic:'🍾'});if(S.carry==='ram')L.push({n:'The ram',ic:'🐏'});
    /* V233 the bags from The Executive Secret: one slot, with how many are left */
    if(typeof C3!=='undefined'&&AM&&AM.m.id==='c3secret'&&typeof c3S==='function'){const s=c3S(),q=5-s.sold;if(s.bags>0&&q>0)L.push({n:'8 ball',ic:'\uD83E\uDDC2',img:IMG8BALL,q})}
    /* V280 the ten bags Danny carries into the ΚΘΩ raid */
    if(typeof C3!=='undefined'&&AM&&(AM.m.id==='c3accuse'||AM.m.id==='c3empire')&&typeof c3S==='function'){const k=c3S().kbags;if(k>0)L.push({n:'Bags',ic:'\uD83E\uDDC2',img:IMG8BALL,q:k})}
    if(PM&&PM.HOLD==='tray'&&!L.length)L.push({n:'Tray',ic:'🍽'});if(PM&&PM.HOLD==='box'&&!L.length)L.push({n:'Box',ic:'📦'});
  }catch(e){}return L}
function kitList(){const id=AM&&AM.m&&AM.m.id;KIT.grab=KIT.grab.filter(g=>g.m===id);const L=kitLive();for(const g of KIT.grab)if(!L.some(x=>x.n===g.n))L.push(g);return L.slice(0,3)}
/* V225: story items are drawn in the normal 1-2-3 slots (no extra slots). They take empty slots first, then cover the rightmost pocket item until the quest ends; the covered item is not lost and not usable meanwhile. kitOverlay() gives per-slot {n,ic} or null. */
KIT.pos={};
function kitOverlay(){const L=kitList(),V=[null,null,null];if(!L.length){KIT.pos={};return V}const used=new Set();
  for(const it of L){const p=KIT.pos[it.n];if(p!=null&&!used.has(p)&&!S.inv[p]){V[p]=it;used.add(p)}}
  for(const it of L){if(V.includes(it))continue;let p=[0,1,2].find(i=>!used.has(i)&&!S.inv[i]);if(p==null)p=[2,1,0].find(i=>!used.has(i));if(p==null)break;V[p]=it;used.add(p)}
  KIT.pos={};V.forEach((it,i)=>{if(it)KIT.pos[it.n]=i});return V}
function kitRender(force){const V=kitOverlay(),sig=V.map(v=>v?v.ic+v.n+(v.q||''):'-').join('|')+'#'+S.inv.join(',');if(!force&&sig===KIT.sig)return;KIT.sig=sig;renderInv()}
function kitTick(dt){KIT.t-=dt;if(KIT.t>0)return;KIT.t=.3;kitRender(0)}

// ---------------------------------------------------------------- loot containers
const LOOTC={list:[],built:0};
const LOOTPOOL={dresser:[['bandage',3],['pills',2],['gum',3],['drink',2],['cash',4],['stink',1]],crate:[['drink',3],['chips',3],['bandage',2],['stink',2],['cash',3],['coffee',2]],
  dumpster:[['pizza',3],['burger',2],['chips',3],['cash',2],['stink',2],['gum',2]],fridge:[['burger',3],['pizza',3],['drink',3],['coffee',2]]};
const LOOTN={dresser:'Dresser',crate:'Wooden crate',dumpster:'Dumpster',fridge:'Fridge'};
function lootRng(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h=Math.imul(h^h>>>15,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
function lootRoll(c){const r=lootRng(c.id+':'+S.day),P_=LOOTPOOL[c.t],tot=P_.reduce((a,p)=>a+p[1],0),n=1+Math.floor(r()*(c.t==='dumpster'?2:3)),out=[];
  for(let i=0;i<n;i++){let x=r()*tot,k=P_[0][0];for(const[q,w]of P_){x-=w;if(x<=0){k=q;break}}if(k==='cash')out.push({k:'cash',v:2+Math.floor(r()*(c.t==='dresser'?18:10))});else out.push({k})}return out}
function lootS(){S.loot=S.loot||{};return S.loot}
function lootGet(c){const L=lootS();let e=L[c.id];if(!e||e.d!==S.day){e=L[c.id]={d:S.day,items:lootRoll(c)}}return e}
function lootMesh(t,x,z,a){const g=new THREE.Group(),y=terrH(x,z);g.position.set(x,y,z);g.rotation.y=a||0;
  if(t==='crate'){const w=new THREE.Mesh(bgeo(1,.8,.8),mt(0x9a6e3c,.85));w.position.y=.4;g.add(w);for(const s of[-.44,.44]){const sl=new THREE.Mesh(bgeo(.1,.82,.82),mt(0x6e4a26,.85));sl.position.set(s,.4,0);g.add(sl)}const tp=new THREE.Mesh(bgeo(1.04,.08,.84),mt(0x7a5430,.85));tp.position.y=.82;g.add(tp)}
  else{const b=new THREE.Mesh(bgeo(1.8,1.15,1.05),mt(0x2e5a3a,.6,.3));b.position.y=.62;g.add(b);const l=new THREE.Mesh(bgeo(1.86,.08,1.1),mt(0x1e3a28,.6));l.position.set(0,1.22,0);l.rotation.x=-.06;g.add(l);
    for(const s of[-.7,.7]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.06,10),mt(0x111111));w.rotation.x=PI/2;w.position.set(s,.07,.5);g.add(w)}const lb=signMesh('TRASH',.7,.18,'#e8e2d2','#1e3a28','Archivo');lb.position.set(0,.75,.53);g.add(lb)}
  g.traverse(m=>{m.userData.noMerge=1;if(m.isMesh)m.castShadow=true});sc.add(g);const hw=t==='crate'?.55:.95,hd=t==='crate'?.45:.58,ca=Math.abs(Math.cos(a||0)),sa=Math.abs(Math.sin(a||0));const ex=hw*ca+hd*sa,ez=hw*sa+hd*ca;markR(x-ex,z-ez,x+ex,z+ez,1.2);return g}
function lootBuild(){if(LOOTC.built)return;LOOTC.built=1;try{Object.assign(IVAL,{chips:2,coffee:3,pizza:4,pills:5,gum:1})}catch(e){}const add=(id,t,x,z,inside,opts)=>LOOTC.list.push(Object.assign({id,t,x,z,int:inside||null},opts||{}));
  // the ΑΣΡ house: the bedroom dressers that are already there, the kitchen fridge, and a crate in the basement
  const A=INT.asr,U=INT.asr_up,BS=INT.asr_bsmt;
  if(A){add('asr_dr0','dresser',A.x0+12.9,A.z0+11,'asr')}
  if(U)for(let r=0;r<4;r++)add('asr_dr'+(r+1),'dresser',U.x0+r*12+10,U.z0+13.6,'asr_up');
  if(BS){const[x,z]=nearFree(BS.x0+70,BS.z0+40,.6);add('asr_bc','crate',x,z,'asr_bsmt');lootMesh('crate',x,z,0)}
  // campus and town: crates and dumpsters beside buildings (deterministic, so they're in the same places every game)
  const r=lootRng('campus-loot'),cand=B.filter(b=>b.ex!=null&&!HOUSE[b.id]&&!INT[b.id]&&b.id!=='hughes').sort((a,b)=>a.id<b.id?-1:1);let n=0;
  for(const b of cand){if(n>=34)break;if(r()<.45)continue;const t=r()<.55?'dumpster':'crate';
    for(let tries=0;tries<6;tries++){const ang=r()*TAU,d=4+r()*4,x=b.ex+Math.sin(ang)*d,z=b.ez+Math.cos(ang)*d;
      if(!freeAt(x,z,1.3)||(typeof inLane==='function'&&inLane(x,z))||Math.hypot(x-b.ex,z-b.ez)<3.5)continue;const a=Math.round(r()*4)*PI/2;lootMesh(t,x,z,a);add('c_'+b.id,t,x,z,null,{near:b.name||''});n++;break}}}
function lootPrompts(add){if(!LOOTC.built)return;for(const c of LOOTC.list){if((c.int||null)!==(P.inside||null))continue;if(Math.abs(c.x-P.x)>3||Math.abs(c.z-P.z)>3)continue;const e=lootGet(c);
    add(c.x,c.z,c.t==='dumpster'?2.3:1.9,(e.items.length?'Search the ':'Look in the ')+LOOTN[c.t].toLowerCase()+(e.items.length?'':' (empty)'),()=>lootOpen(c),2)}}
function lootLine(it){return it.k==='cash'?'💵 $'+it.v:ITM[it.k].ic+' '+ITM[it.k].n+(ITMD[it.k]?' · '+ITMD[it.k]:'')}
function lootOpen(c){const e=lootGet(c);tone(240,.08,'triangle',.05);noise(.08,.12,500);
  if(!e.items.length){card({title:LOOTN[c.t],sp:'Empty',text:'Nothing left in here today. Check back tomorrow.',ch:[['Close',null]]});return}
  const take=i=>{const it=e.items[i];if(!it)return;if(it.k==='cash'){money(it.v);e.items.splice(i,1)}else if(invAdd(it.k)){e.items.splice(i,1);sfx('coin')}else return;setTimeout(()=>lootOpen(c),40)};
  const ch=e.items.map((it,i)=>['Take '+(it.k==='cash'?'$'+it.v:ITM[it.k].n),()=>take(i)]);
  if(e.items.length>1)ch.push(['Take everything',()=>{for(let i=e.items.length-1;i>=0;i--){const it=e.items[i];if(it.k==='cash'){money(it.v);e.items.splice(i,1)}else if(S.inv.includes(null)&&invAdd(it.k))e.items.splice(i,1)}if(e.items.length)toast('Your pockets are full (3 items).',2200);sfx('coin');if(e.items.length)setTimeout(()=>lootOpen(c),40)}]);
  ch.push(['Close',null]);card({title:LOOTN[c.t],sp:c.t==='dumpster'?'Smells like last week':c.t==='fridge'?'House fridge':'Inside',text:'You find:\n'+e.items.map(lootLine).join('\n'),ch})}
