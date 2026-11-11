// ================================================================ FRAT TURF (V155)
// V156: ΛΧΑ and ΩΨΔ swapped turf (ΩΨΔ now holds MLK Woods, ΛΧΑ the Zimmer–Langsam Core); their brothers live there, and no other NPC brother may enter someone else's district (see fbForeign).
// Territory districts the fraternities hold on the campus map. ΑΣΡ holds none; several houses hold two (the popular ones),
// and a few chapters (ΣΤ, the sororities) hold nothing at all.
// Drawn once into TERRC (same 2 px per world unit as WORLDC) and reused by the full map and the minimap.
// Toggle: SET.terr (map tab button, Settings > Frat turf on map). terrAt(x,z) tells which district a point is in.
const TURF={kto:'#4f6bed',lxa:'#34b45a',opd:'#17a2a2',sae:'#8e5cf0',sam:'#f06292',gwz:'#b06ab3',pka:'#d6453d',tri:'#3aa0e8',pkp:'#e0b12e',kan:'#a8683a',tchi:'#ef8a2b',dtd:'#8bc34a',btp:'#3949ab',ksig:'#2e9d6a',pdt:'#d9702a'};
const TURFN={kto:'Kappa Theta Omega',lxa:'Lambda Chi Alpha',opd:'Omega Psi Delta',sae:'Sigma Alpha Epsilon',sam:'Sigma Alpha Mu',gwz:'Gamma Omega Zeta',pka:'Pi Kappa Alpha',tri:'Triangle',pkp:'Pi Kappa Phi',kan:'Kappa Alpha Nu',tchi:'Theta Chi',dtd:'Delta Tau Delta',btp:'Beta Theta Pi',ksig:'Kappa Sigma',pdt:'Phi Delta Theta'};
// p = flat [x,z,...] polygon in world units; a = where the label pill sits; clip = trim to the campus outline (UCD.base); the north woods and downtown run past it, so they aren't trimmed
const TERR=[
  {id:'kto1',f:'kto',n:'Burnet Woods',a:[178,74],clip:0,p:[152,0,300,0,300,98,232,104,152,100]},
  {id:'kto2',f:'kto',n:'DAAP Heights',a:[218,188],clip:1,p:[152,100,232,104,300,98,300,262,152,262]},
  {id:'opd1',f:'opd',n:'MLK Woods',a:[350,70],clip:0,p:[300,0,432,0,432,92,300,98]},
  {id:'lxa1',f:'lxa',n:'Zimmer–Langsam Core',a:[318,114],clip:1,p:[300,98,432,92,432,250,300,250]},
  {id:'sae1',f:'sae',n:'Law & Lindner Row',a:[462,194],clip:1,p:[432,0,546,0,546,215,432,215,432,92]},
  {id:'sam1',f:'sam',n:'Campus Green',a:[600,64],clip:1,p:[546,0,700,0,700,215,546,215]},
  {id:'gwz1',f:'gwz',n:'Steger Quarter',a:[374,292],clip:1,p:[300,250,432,250,432,300,350,300,350,262,300,262]},
  {id:'pka1',f:'pka',n:'Rec Center & Armory',a:[522,233],clip:1,p:[432,215,546,215,546,322,432,322]},
  {id:'tri1',f:'tri',n:'East Dorms',a:[612,229],clip:1,p:[546,215,700,215,700,332,575,332,546,322]},
  {id:'pkp1',f:'pkp',n:'Tangeman Commons',a:[182,368],clip:1,p:[152,262,350,262,350,300,337,300,335,395,152,395]},
  {id:'kan1',f:'kan',n:'Nippert Stadium',a:[409,358],clip:1,p:[337,300,432,300,432,322,455,322,455,412,335,412,335,395]},
  {id:'tchi1',f:'tchi',n:'Fifth Third Arena',a:[493,388],clip:1,p:[455,322,575,322,575,400,455,400]},
  {id:'dtd1',f:'dtd',n:'Sheakley Athletics',a:[677,358],clip:1,p:[575,332,700,332,700,482,575,482,575,400]},
  {id:'kan2',f:'kan',n:'Victory Plaza',a:[474,438],clip:1,p:[455,400,575,400,575,482,440,482,440,412,455,412]},
  {id:'btp1',f:'btp',n:'Arts Quarter',a:[186,541],clip:1,p:[152,395,335,395,335,572,152,572]},
  {id:'ksig1',f:'ksig',n:'Memorial Hall',a:[413,498],clip:1,p:[335,412,440,412,440,482,440,572,335,572]},
  {id:'sae2',f:'sae',n:'Corry & University Park',a:[498,508],clip:1,p:[440,482,700,482,700,572,440,572]},
  {id:'pdt1',f:'pdt',n:'Downtown Strip',a:[210,644],clip:0,p:[140,574,362,574,362,712,140,712]}
];
// V169 each house has an average brother level; popular houses (the ones holding two districts, plus the rival) sit higher, so turf can be taken in a slow ladder
// as you level up (chapter caps are Lv 3 / 6 / 9 / 10). Most brothers in a district sit at the house average, with a few one level either side.
const TURFLV={pdt:3,dtd:3,btp:4,gwz:4,tchi:5,ksig:5,tri:5,pkp:6,lxa:6,opd:7,pka:7,sam:8,kan:8,sae:9,kto:10};
const turfAvg=t=>TURFLV[t.f0||t.f]||5;
function turfLvBag(avg){const b=[0,0,0,-1,1];for(let i=b.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b.map(d=>clamp(avg+d,1,10))}
let TERRC=null;
const terrOn=()=>SET.terr!==0&&turfUnlocked();
function terrPairs(t){if(!t.q){t.q=[];for(let i=0;i<t.p.length;i+=2)t.q.push([t.p[i],t.p[i+1]])}return t.q}
function terrInBase(x,z){const B0=UCD.base||[];for(const poly of B0)if(poly[0]&&inPoly(x,z,poly[0]))return true;return false}
// which district is this point in? (null = neutral ground, Greek Row or off campus)
function terrAt(x,z){for(const t of TERR){if(x<t.bb[0]||x>t.bb[2]||z<t.bb[1]||z>t.bb[3])continue;if(inPoly(x,z,terrPairs(t))&&(!t.clip||terrInBase(x,z)))return t}return null}
for(const t of TERR){t.f0=t.f;let a=1e9,b=1e9,c=-1e9,d=-1e9;for(let i=0;i<t.p.length;i+=2){a=Math.min(a,t.p[i]);c=Math.max(c,t.p[i]);b=Math.min(b,t.p[i+1]);d=Math.max(d,t.p[i+1])}t.bb=[a,b,c,d]}
// polygon path with softly rounded corners (r in world units)
function terrPath(q,P,r){const n=P.length;q.beginPath();for(let i=0;i<n;i++){const p0=P[(i+n-1)%n],p1=P[i],p2=P[(i+1)%n];const l1=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),l2=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]),rr=Math.min(r,l1/2.2,l2/2.2);
    const ax=p1[0]+(p0[0]-p1[0])/l1*rr,az=p1[1]+(p0[1]-p1[1])/l1*rr,bx=p1[0]+(p2[0]-p1[0])/l2*rr,bz=p1[1]+(p2[1]-p1[1])/l2*rr;
    if(i)q.lineTo(ax,az);else q.moveTo(ax,az);q.quadraticCurveTo(p1[0],p1[1],bx,bz)}q.closePath()}
function terrLayer(){if(TERRC)return TERRC;const c=document.createElement('canvas');c.width=WW*2;c.height=OD*2;const q=c.getContext('2d');q.scale(2,2);q.lineJoin='round';
  const draw=t=>{const col=TURF[t.f]||'#ffffff',P=terrPairs(t);terrPath(q,P,7);q.fillStyle=col;q.globalAlpha=.36;q.fill();
    q.save();q.clip();q.globalAlpha=.34;q.strokeStyle=col;q.lineWidth=11;terrPath(q,P,7);q.stroke();q.restore();   // soft inner glow along the edge
    q.globalAlpha=.8;q.strokeStyle='rgba(16,12,8,.9)';q.lineWidth=4.2;terrPath(q,P,7);q.stroke();   // V161 dark casing so the border reads on every background
    q.globalAlpha=1;q.strokeStyle=col;q.lineWidth=2.8;q.setLineDash([6,2.6]);terrPath(q,P,7);q.stroke();q.setLineDash([]);q.globalAlpha=1};
  q.save();q.beginPath();for(const poly of UCD.base||[])if(poly[0])poly[0].forEach(([x,z],i)=>i?q.lineTo(x,z):q.moveTo(x,z));q.closePath();q.clip();
  for(const t of TERR)if(t.clip)draw(t);q.restore();
  for(const t of TERR)if(!t.clip)draw(t);
  return TERRC=c}
// full map: the cached layer goes under the building labels
function terrDrawFull(q,c){if(!terrOn())return;q.drawImage(terrLayer(),0,0,WW*2,OD*2,0,0,c.width,c.height)}
// minimap: same slice the world image uses
function terrMini(q,cx,cy,k){if(!terrOn())return;const r=50,sx=clamp(P.x-r,0,WW),sz=clamp(P.z-r,0,OD),ex=clamp(P.x+r,0,WW),ez=clamp(P.z+r,0,OD);if(ex>sx&&ez>sz)q.drawImage(terrLayer(),sx*2,sz*2,(ex-sx)*2,(ez-sz)*2,cx+(sx-P.x)*k,cy+(sz-P.z)*k,(ex-sx)*k,(ez-sz)*k);
  // V160: each district's trio shows on the minimap at its exact spot (colour dot + letters)
  q.save();q.textAlign='center';q.textBaseline='bottom';q.font='700 9px Graduate,Georgia';q.lineJoin='round';
  for(const t of TERR){const c=t.tc;if(!c)continue;const dx=c[0]-P.x,dz=c[1]-P.z;if(Math.abs(dx)>r||Math.abs(dz)>r)continue;const x=cx+dx*k,y=cy+dz*k,col=TURF[t.f]||'#fff';
    q.fillStyle=col;q.strokeStyle='#fff';q.lineWidth=1.4;q.beginPath();q.arc(x,y,3.4,0,TAU);q.fill();q.stroke();
    const L=(HOUSE[t.f]||{}).L||'';q.lineWidth=2.4;q.strokeStyle='rgba(18,16,12,.85)';q.strokeText(L,x,y-4.5);q.fillStyle='#fff6dc';q.fillText(L,x,y-4.5)}
  q.restore()}
// one small letters pill per district; returns the boxes so building labels can steer clear of them
let TERRHIT=[];
function terrPills(q,X,Z,k){TERRHIT=[];if(!terrOn())return null;const fs=Math.max(11,Math.min(15,k*11.5)),out={r:[],items:[]};q.font='700 '+fs+'px Graduate,Georgia';
  const sc=Math.abs(X(1)-X(0))||1;
  for(const t of TERR){const L=(HOUSE[t.f]||{}).L||t.f.toUpperCase(),w=q.measureText(L).width+14,h=fs+8,tp=t.tc||t.a,pp=terrPillSpot(t,tp,(w/2+4)/sc,(h/2+4)/sc,Math.round(sc*8)/8+':'+fs),x=X(pp[0]),y=Z(pp[1]);out.items.push({t,L,x,y,w,h,tx:X(tp[0]),ty:Z(tp[1])});out.r.push([x-w/2-2,y-h/2-2,x+w/2+2,y+h/2+2])}
  TERRHIT=out.items;return out}
// V160: the pill must sit wholly inside its own district (never over a neighbour's colour). The trio's true spot stays the target for the trail, the minimap dot and the leader dot.
function terrIn(t,x,z){return inPoly(x,z,terrPairs(t))&&(!t.clip||terrInBase(x,z))}
function terrBoxIn(t,x,z,hw,hh){return terrIn(t,x,z)&&terrIn(t,x-hw,z-hh)&&terrIn(t,x+hw,z-hh)&&terrIn(t,x-hw,z+hh)&&terrIn(t,x+hw,z+hh)&&terrIn(t,x,z-hh)&&terrIn(t,x,z+hh)&&terrIn(t,x-hw,z)&&terrIn(t,x+hw,z)}
function terrPillSpot(t,tp,hw,hh,key){const pc=t.pc;if(pc&&pc.key===key&&pc.tx===tp[0]&&pc.tz===tp[1])return pc.p;
  let best=null;if(terrBoxIn(t,tp[0],tp[1],hw,hh))best=tp;else{let bd=1e9;const st=Math.max(2,Math.min(hw,hh)*.7);for(let x=t.bb[0];x<=t.bb[2];x+=st)for(let z=t.bb[1];z<=t.bb[3];z+=st){const d=Math.hypot(x-tp[0],z-tp[1]);if(d<bd&&terrBoxIn(t,x,z,hw,hh)){bd=d;best=[x,z]}}}
  if(!best)best=t.a;t.pc={key,tx:tp[0],tz:tp[1],p:best};return best}
function terrPillDraw(q,TP){q.save();q.textAlign='center';q.textBaseline='middle';q.lineJoin='round';
  for(const o of TP.items){const col=TURF[o.t.f]||'#fff';if(Math.hypot(o.x-o.tx,o.y-o.ty)>8){q.strokeStyle=col;q.lineWidth=1.6;q.setLineDash([3,2]);q.beginPath();q.moveTo(o.x,o.y);q.lineTo(o.tx,o.ty);q.stroke();q.setLineDash([])}
    q.fillStyle=col;q.strokeStyle='#fff';q.lineWidth=1.6;q.beginPath();q.arc(o.tx,o.ty,3.6,0,TAU);q.fill();q.stroke()}
  for(const o of TP.items){const col=TURF[o.t.f]||'#fff',fs=o.h-8;q.font='700 '+fs+'px Graduate,Georgia';q.shadowColor='rgba(0,0,0,.5)';q.shadowBlur=5;q.shadowOffsetY=2;
    q.fillStyle='rgba(18,16,12,.84)';q.strokeStyle=col;q.lineWidth=2.2;q.beginPath();q.roundRect?q.roundRect(o.x-o.w/2,o.y-o.h/2,o.w,o.h,o.h/2):q.rect(o.x-o.w/2,o.y-o.h/2,o.w,o.h);q.fill();q.shadowBlur=0;q.shadowOffsetY=0;q.stroke();
    q.fillStyle='#fff6dc';q.fillText(o.L,o.x,o.y+1)}q.restore()}
// legend, bottom-left (the map key sits bottom-right)
// V192 the turf key sits under the map (HTML), so it never covers the southern districts
function terrLegendHTML(){const own=[],cnt={};for(const t of TERR)cnt[t.f]=(cnt[t.f]||0)+1;for(const f in cnt)own.push(f);
  const it=own.map(f=>`<span class="tlk"><i style="background:${TURF[f]}"></i>${(HOUSE[f]||{}).L||f}${cnt[f]>1?' ×'+cnt[f]:''}</span>`).join('')+(cnt.asr?'':'<span class="tlk none"><i></i>ΑΣΡ none</span>');
  return`<div class="turfkey"><b>Frat turf</b>${it}</div>`}
function terrLegend(q,c){const own=[],cnt={};for(const t of TERR)cnt[t.f]=(cnt[t.f]||0)+1;for(const f in cnt)own.push(f);
  const cols=2,cw=77,rows=Math.ceil((own.length+1)/cols),w=cols*cw+8,h=24+rows*17,x=3,y=c.height-h-4;/* V203 a narrow key in the bottom-left corner, over Greek Row / Clifton Heights where there's no turf */q.save();q.fillStyle='rgba(22,20,16,.84)';q.strokeStyle='#e2b64c';q.lineWidth=1.6;q.beginPath();q.roundRect?q.roundRect(x,y,w,h,8):q.rect(x,y,w,h);q.fill();q.stroke();
  q.fillStyle='#e2b64c';q.font='12px Graduate,Georgia';q.textAlign='left';q.textBaseline='middle';q.fillText('FRAT TURF',x+10,y+13);
  own.forEach((f,i)=>{const cx=x+8+(i%cols)*cw,cy=y+31+Math.floor(i/cols)*17;q.fillStyle=TURF[f];q.fillRect(cx,cy-5,10,10);q.strokeStyle='rgba(255,255,255,.6)';q.lineWidth=1;q.strokeRect(cx+.5,cy-4.5,9,9);
    q.fillStyle='#f2e6c8';q.font='700 11px Archivo,Arial';q.fillText(((HOUSE[f]||{}).L||f)+(cnt[f]>1?' ×'+cnt[f]:''),cx+15,cy+1)});
  if(!cnt.asr){const i=own.length,cx=x+8+(i%cols)*cw,cy=y+31+Math.floor(i/cols)*17;q.strokeStyle='#c03a4c';q.lineWidth=1.4;q.setLineDash([2,2]);q.strokeRect(cx+.5,cy-4.5,9,9);q.setLineDash([]);q.fillStyle='#e8909c';q.font='700 11.5px Archivo,Arial';q.fillText('ΑΣΡ none',cx+15,cy+1)}
  q.restore()}
// the line the ground card shows for a spot of turf
function terrSub(x,z){if(!terrOn())return'';const t=terrAt(x,z);return t?'Turf of '+((HOUSE[t.f]||{}).L||'')+' · '+(TURFN[t.f]||''):''}
// ---- V156 turf rule for NPC brothers
// n.fb (set in spawn) = a fraternity brother who must stay out of other chapters' districts. Neutral ground and his own turf are fine.
function fbForeign(n,x,z){if(!n.fb||n.int||!turfUnlocked())return false;const t=terrAt(x,z);return !!t&&t.f!==n.house}
// brothers who hang out on their own turf: every district gets a chatting trio and two roamers of its owner (t.crew)
function turfCrew(t){const f=t.f,L=(HOUSE[f]||{}).L||f.toUpperCase(),cl=(FRATS.find(q=>q.id===f)||{}).cl||'brothers',zone=t.id;ZN[zone]=t.bb.slice();t.crew=[];   // their wander box = the district's bounding box
  const bag=turfLvBag(turfAvg(t)),lv=()=>bag.length?bag.pop():turfAvg(t),spot=()=>{for(let i=0;i<150;i++){const x=t.bb[0]+rnd()*(t.bb[2]-t.bb[0]),z=t.bb[1]+rnd()*(t.bb[3]-t.bb[1]);if(terrAt(x,z)===t&&freeAt(x,z,.7)&&!inLake(x,z))return[x,z]}return null};
  const add=(n,g)=>{if(!n)return;n.td=t;n.tg=g;t.crew.push(n)};
  for(let i=0;i<2;i++){const s=spot();if(s)add(spawn(cl,zone,{x:s[0],z:s[1],house:f,title:L+' Brother',lvl:lv(),mode:'wander'}),0)}
  const c=spot();t.tc=c;if(c)for(let i=0;i<4;i++){const a=i*TAU/4+PI/4,x=c[0]+Math.cos(a)*1.05,z=c[1]+Math.sin(a)*1.05,   /* V297 four in the group (was three) */ok=freeAt(x,z,.4)&&terrAt(x,z)===t,px=ok?x:c[0],pz=ok?z:c[1];
    add(spawn(cl,zone,{x:px,z:pz,a:Math.atan2(c[0]-px,c[1]-pz),house:f,title:L+' Brother',lvl:lv(),mode:'chat'}),1)}}
// V160: frat turf switches on after the chapter 1 rivalry brawl (S.uTurf; older saves and later chapters have it already)
function turfUnlocked(){return!!(S.uTurf||S.ch>=2||(S.done&&S.done.c1rival))}
let TURFSPAWNED=0;
function turfReset(){TURFSPAWNED=0;for(const t of TERR){t.f=t.f0;t.crew=null;t.tc=null;t.pc=null}TERRC=null}   // called from spawnAll: a fresh world
function turfEnsure(){if(TURFSPAWNED||!turfUnlocked())return;TURFSPAWNED=1;for(const id of S.turfAsr||[]){const t=TERR.find(q=>q.id===id);if(t)t.f='asr'}TERRC=null;for(const t of TERR)turfCrew(t)}
// V158: talk to one of the four (V297, was three) and take their district for ΑΣΡ. The old owners concede and leave; an ΑΣΡ crew moves in.
TURF.asr='#c03a4c';TURFN.asr='Alpha Sigma Rho';
function turfTake(t,instant){if(t.f==='asr')return;const old=(t.crew||[]).slice();t.f='asr';TERRC=null;S.turfAsr=S.turfAsr||[];if(!S.turfAsr.includes(t.id))S.turfAsr.push(t.id);
  const swap=()=>{for(const m of old)if(NP.includes(m))despawn(m);turfCrew(t)};
  if(instant)swap();else{for(const m of old)if(NP.includes(m))bubble(m,pick(['Fine. It\'s yours.','Whatever. Take it.','We\'ll be back for this.','This isn\'t over.']),2.4);setTimeout(swap,2600)}}
// V162: you can have FOLMAX (5) followers; taking turf needs a full squad, and every one of them an ΑΣΡ brother (not a pledge)
const FOLMAX=5;
const isASRbro=m=>m.house==='asr'&&!m.pledge&&!m.pclass&&!m.prop&&!m.fem;
function turfBlock(t){if(t.f==='asr')return'Already ΑΣΡ turf';const fl=NP.filter(m=>m.follow&&!m.down);if(fl.length<FOLMAX)return'You need '+FOLMAX+' ΑΣΡ brothers following you ('+fl.length+' now).';if(!fl.every(isASRbro))return'All '+FOLMAX+' people following you must be ΑΣΡ brothers.';return''}
function turfTalk(n,ch,reply){if(!n.tg||!n.td)return;const t=n.td;ch.push(['"This is ΑΣΡ turf now." (take over '+t.n+')',()=>{if(turfBlock(t))return;turfTake(t,0);toast('ΑΣΡ now holds '+t.n+'.',3500)},turfBlock(t),'task'])}
// V157: anyone on campus who isn't a frat guy cheers for whoever holds the turf they're standing on
function turfChant(f){const N=TURFN[f]||'',L=(HOUSE[f]||{}).L||'';return['Go '+N+'!',N+' rules!','Let\'s go '+N+'!',N+'! '+N+'!','This is '+N+' turf!','Who runs this place? '+N+'!',L+'! '+L+'! '+L+'!','Go '+L+'!','Nobody beats '+N+'!']}
// V159: the letters pill sits where the district's trio stands; click it on the map for the fraternity card
function terrPillHit(px,py){for(let i=TERRHIT.length-1;i>=0;i--){const o=TERRHIT[i];if(px>=o.x-o.w/2&&px<=o.x+o.w/2&&py>=o.y-o.h/2&&py<=o.y+o.h/2)return o.t}return null}
function cardForTurf(t){const f=t.f,L=(HOUSE[f]||{}).L||'',N=TURFN[f]||L,mine=f==='asr',all=TERR.filter(q=>q.f===f),crew=(t.crew||[]).filter(m=>NP.includes(m)),
  avg=Math.max(1,turfAvg(t)-lvShift()),lv_=crew.map(m=>m.lvl),lo=lv_.length?Math.min(...lv_):avg-1,hi=lv_.length?Math.max(...lv_):avg+1,gap=avg-S.lvl,tier=gap<=-2?'easy':gap<=0?'fair fight':gap<=2?'tough':'very tough',
  row=m=>['🧑',m.name,(m.title||'')+' · Lv '+m.lvl],trio=crew.filter(m=>m.tg),roam=crew.filter(m=>!m.tg),[tx,tz]=pinGround(...(t.tc||t.a));
  return{name:N+' ('+L+')',cat:'Frat turf',sub:t.n+(mine?'':' · Avg Lv '+avg)+(all.length>1?' · holds '+all.length+' districts':''),
    about:mine?'Your chapter holds '+t.n+'. Your brothers hang out here, and no other chapter\'s brothers will set foot on it.':N+' holds '+t.n+'. Its brothers hang out here, and no other chapter\'s brothers will set foot on it. Everyone else on campus cheers for them while they stand on it.',
    secs:[mine?['',[],'']:['DIFFICULTY',[['⚔','Average level '+avg+' · '+tier,'Most brothers here are Lv '+avg+(lo<hi?' (range Lv '+lo+' to '+hi+')':'')+'. You are Lv '+S.lvl+'.']],''],['THE GROUP HERE',trio.map(row),'Nobody\'s around right now.'],['ROAMING THE TURF',roam.map(row),'No roamers right now.'],
      all.length>1?['ALSO HELD',all.filter(q=>q!==t).map(q=>['🏴',q.n,'']),'']:mine?['',[],'']:['TAKING IT',[['🗣','Bring '+FOLMAX+' ΑΣΡ brothers as followers, then talk to any of the four','']],'']].filter(s=>s[0]),
    ft:mine&&S.pledged?{name:t.n,x:(t.tc||t.a)[0]+1.8,z:(t.tc||t.a)[1]+1.8,face:Math.atan2(-1.8,-1.8),msg:'With your brothers at '+t.n+'.'}:null,   // V185 ΑΣΡ turf is a fast travel point
    route:{x:tx,z:tz,px:t.tc?t.tc[0]:t.a[0],pz:t.tc?t.tc[1]:t.a[1],name:t.n+' · '+L}}}

// ---- Tank's "open your map" lesson: opens the full map on its own and pins a note with what he just said ----
const TURF_NOTE={title:'Frat Turf',sp:'Tank Hale · ΑΣΡ Brother',
  tx:'"Every district\'s got four brothers hanging out in the middle of it, with a couple more wandering. Walk up to one of the three and tell \'em the ground is ours now. But they won\'t blink unless you show up with a full squad: five brothers following you, all ΑΣΡ, no pledges. Right now ΑΣΡ holds nothing. Let\'s fix that."'};
const TURFNOTE={on:0,opened:0,done:0,timer:0};
function turfNoteShow(){const el=$('mapnote');if(!el)return;$('mnt').textContent=TURF_NOTE.title;$('mnsp').textContent=TURF_NOTE.sp;$('mntx').textContent=TURF_NOTE.tx;
  $('mnkey').innerHTML=document.body.classList.contains('mob')?'Tap the minimap any time to open the full map.':'Press <kbd>M</kbd> any time to open or close the map.';
  el.hidden=false;el.classList.remove('in');void el.offsetWidth;el.classList.add('in');setTimeout(()=>{const b=$('mnok');b&&b.focus()},60)}
function turfNoteHide(){const el=$('mapnote');if(el)el.hidden=true}
// planner closed: hide the note, and finish the task step if the map was actually shown
function turfNoteClosed(){turfNoteHide();if(TURFNOTE.on&&TURFNOTE.opened){TURFNOTE.on=0;TURFNOTE.done=1}}
function turfMapNote(){TURFNOTE.on=1;TURFNOTE.opened=0;TURFNOTE.done=0;clearTimeout(TURFNOTE.timer);let tries=0;
  const go=()=>{if(!TURFNOTE.on)return;
    if(mode==='planner'||mode==='play'){if(!tabOn('map')){TURFNOTE.on=0;TURFNOTE.done=1;return}
      if(mode==='play')openPlanner('map');else renderPlanner('map');
      if(mode==='planner'){TURFNOTE.opened=1;turfNoteShow();return}}
    if(++tries<80)TURFNOTE.timer=setTimeout(go,150);else{TURFNOTE.on=0;TURFNOTE.done=1}};
  TURFNOTE.timer=setTimeout(go,250)}   // map pops up right after the dialogue closes, unlocked banner over it
(function(){const ok=()=>{turfNoteHide()};
  const wire=()=>{const b=$('mnok');if(b)b.onclick=()=>{sfx('ui');ok()}};
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',wire);else wire();
  addEventListener('keydown',e=>{const el=$('mapnote');if(!el||el.hidden||mode!=='planner')return;if(e.code==='Enter'||e.code==='Space'||e.code==='NumpadEnter'){e.preventDefault();e.stopPropagation();sfx('ui');ok()}},true)})();
