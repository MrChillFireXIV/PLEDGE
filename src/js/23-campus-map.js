// ================================================================ V83 interactive campus map: hover a building to light it up (it lifts a little) and read what's in it,
// clearer markers with their own tooltips, and click a building or marker to send the blue stud trail there
let LEGHIT=[];   /* V297 hover boxes for the map key and turf key entries: {x,y,w,h,title,sub} */
let MAPSEL=null,MAPROUTE=null,MAPHOV=null,MKH=[],HB=null,FMT=null,MAPRAF=0,MAPMX=-1,MAPMY=-1,MAPSC=1;
const HBTYP={university:'Academic building',dormitory:'Residence hall',library:'Library',school:'School',college:'College building',apartments:'Apartments',retail:'Shops',commercial:'Offices',office:'Offices',hotel:'Hotel',church:'Church',parking:'Parking garage',stadium:'Stadium',sports_centre:'Athletics',hospital:'Hospital',house:'House',residential:'Residences',civic:'Civic building',public:'Public building',garage:'Garage'};
const HBMENU={lib:['📚','Langsam Library: study, and the old archive room'],gym:['🏈','The gym: sign up for flag football with the coach'],union:['📻','Tangeman Center: WHRG campus radio and the food court'],main:['🏛','Van Wormer: the Dean of Students\' office'],diner:['🍔',"Ruby's Diner: food that heals you"],pawn:['💰','Pawn shop: buy and sell'],hank:['🛒',"Hank's Market: groceries and party supplies"],police:['🚓','Police station: pay off your fines'],herald:['📰','The Harrowgate Herald: today\'s paper'],anchor:['🍺','The Rusty Anchor: root beer and pool'],boat:['🏎','Boathouse: go-kart races']};
function hbList(){if(HB)return HB;HB=[];const seen=new Set();
  for(const b of B){if(!b.name||b.z0>=INTZ)continue;const poly=b.poly||[[b.x0,b.z0],[b.x1,b.z0],[b.x1,b.z1],[b.x0,b.z1]];const u=(UCD.B||[]).find(u=>u.n===b.name);HB.push({b,name:b.name,poly,bb:bbox(poly),t:u&&u.t,h:u?u.h:b.h});seen.add(b.name)}
  for(const u of UCD.B||[]){if(!u.n||seen.has(u.n))continue;const a=u.p[0],poly=[];for(let i=0;i<a.length;i+=2)poly.push([a[i],a[i+1]]);HB.push({u,name:u.n,poly,bb:bbox(poly),t:u.t,h:u.h});seen.add(u.n)}
  for(const e of HB){let sx=0,sz=0;for(const[x,z]of e.poly){sx+=x;sz+=z}e.c=[sx/e.poly.length,sz/e.poly.length];e.area=(e.bb[2]-e.bb[0])*(e.bb[3]-e.bb[1])}
  HB.sort((a,b)=>a.area-b.area);return HB}
// what each building is about, for the hover label and the building card
const BLDINFO={'Rhodes Hall':['Engineering','The College of Engineering and Applied Science: labs, design studios and lecture rooms. Look for the train-car roof.'],
'Mantei Center':['Engineering Research','The Engineering Research Center: high-bay research labs under barrel-vaulted roofs.'],
'Baldwin Hall':['Engineering','Classic engineering classrooms and faculty offices behind the Ionic portico.'],
'Zimmer Hall':['Lecture Halls','Big auditorium classrooms; its roof plaza is a walkable campus shortcut.'],
'Lindner Center':['Athletics · Hall of Fame','The Richard E. Lindner Varsity Village: the Bearcats Hall of Fame, coaches\' offices and academic support for athletes.'],
'Carl H. Lindner Hall':['Business','The Lindner College of Business: trading floor, case rooms and a sunny cafe atrium.'],
'Langsam Library':['Main Library','Walter C. Langsam Library: stacks, quiet floors and a 24-hour study space.'],
'Blegen Library':['Library & Archives','Rare books, university archives and a reading room.'],
'Tangeman University Center':['Student Union','TUC: food court, bookstore, student offices and WHRG campus radio under the clock tower.'],
'Steger Student Life Center':['Student Life','Student organizations, Greek life offices and meeting rooms along MainStreet.'],
'Van Wormer Hall':['Administration','The Dean of Students and the university\'s oldest offices, under the dome.'],
'Arts & Sciences Hall':['Arts & Sciences','McMicken College of Arts & Sciences: economics, history and language classrooms.'],
'Rieveschl Hall':['Sciences','Chemistry and biology teaching labs; the rooftop vents are nicknamed the robots.'],
'Old Chemistry':['Arts & Sciences','A brick classic housing A&S departments and classrooms.'],
'Swift Hall':['Classrooms','General-purpose lecture halls and classrooms off McMicken Commons.'],
'Braunstein Hall':['Physics','Physics labs and classrooms.'],
'Hughes Correctional Institute':['Correctional Institute for Adults','Hughes Correctional Institute, a private facility that rehabilitates and disciplines adults with serious behavioral problems, housed in a 1910 Tudor Gothic pile with a 145-ft tower and gargoyles for every subject. Lights out at ten. Visitors sign in at the front window.'],
'Geology-Physics Building':['Geology & Physics','Geology collections, physics labs and lecture rooms.'],
'College of Law':['Law School','The College of Law: courtrooms, a law library and seminar rooms.'],
'Teachers College':['Education','The College of Education (CECH): classrooms and the education library.'],
'Dyer Hall':['Education','Education and human services classrooms and offices.'],
'Alms Building':['Architecture & Planning','DAAP studios for architecture and planning.'],
'DAAP Addition':['Design, Art & Architecture','Aronoff Center (DAAP): studios, galleries and workshops.'],
'Aronoff Center (DAAP)':['Design, Art & Architecture','Aronoff Center (DAAP): studios, galleries and workshops.'],
'Corbett Center for the Performing Arts':['Music · CCM','College-Conservatory of Music: concert halls, rehearsal rooms and practice studios.'],
'Mary Emery Hall':['Music · CCM','CCM practice rooms and studios on the plaza.'],
'Memorial Hall':['Music · CCM','The castle of CCM Village: rehearsal halls and faculty studios.'],
'Dieterle Vocal Arts Center':['Opera · CCM','Voice and opera studios for CCM singers.'],
'Nippert West Pavilion':['Football · Suites','Nippert Stadium\'s glass West Pavilion: club seats, suites and the press box.'],
'Armory Fieldhouse':['Athletics','Indoor practice fieldhouse for Bearcat teams.'],
'Campus Recreation Center':['Recreation & Gym','The CRC: gym, pools, climbing wall, dining and the flag football sign-up.'],
'Fifth Third Arena':['Basketball','Home of Bearcats basketball.'],
'Edwards Center':['Admissions & Services','Admissions, the registrar and student services.'],
'University Pavilion':['Student Services','Advising and student service offices beside the commons.'],
'Marian Spencer Hall':['Residence Hall','Dorm rooms with dining on the ground floor.'],
'Gatehouse':['Campus Gate','The Clifton Avenue gatehouse.'],
'Crossroads Uptown':['Church','A church community in Corryville.'],
'The Lodge':['Lake Lodge','Off-campus lodge by the lake.'],
'Boathouse':['Boathouse','Go-kart races down by the lake.']};
function bldAbout(e){const b=e.b;if(BLDINFO[e.name])return BLDINFO[e.name];if(b&&HOUSE[b.id])return['Greek Chapter House',`${HOUSE[b.id].L} chapter house on Greek Row.`];
  if(b&&HBMENU[b.menu])return[HBMENU[b.menu][1].split(':')[0],HBMENU[b.menu][1]];
  if(/Garage$/.test(e.name))return['Parking','A parking garage.'];if(e.t==='dormitory'||/Hall$/.test(e.name)&&e.t==='dormitory')return['Residence Hall','Student dorm rooms.'];
  if(e.t==='apartments')return['Apartments','Student apartments.'];if(/Fraternit|Sorority|Theta|Kappa|Sigma|Alpha|Delta|Omega|Phi|Chi|Triangle|Beta|Gamma|Mu$/.test(e.name))return['Greek Chapter House','A chapter house on Greek Row.'];
  if(e.t==='university')return['Academic Building','Classrooms and university offices.'];return[HBTYP[e.t]||'Campus Building','Part of the campus.']}
function hbInfo(e){const L=[],b=e.b,bb=e.bb,inB=(x,z,m=4)=>x>=bb[0]-m&&x<=bb[2]+m&&z>=bb[1]-m&&z<=bb[3]+m;
  const AB=bldAbout(e);let sub=AB[0]+' · '+(HBTYP[e.t]||(b&&HOUSE[b.id]?'Greek house':'Campus building'));if(e.h)sub+=` · ${Math.max(1,Math.round(e.h/3.6))} storeys`;
  if(b){for(const c of Object.keys(CI).filter(c=>CI[c].b===b.menu))L.push(['📖',`${CI[c].n} with ${CI[c].prof}`,`Next class: ${nextMeet(c)} · Grade ${S.grades[c]} of 3`]);
    if(HBMENU[b.menu])L.push([HBMENU[b.menu][0],HBMENU[b.menu][1]]);
    if(SHOP[b.menu])L.push(['$','Sells: '+SHOP[b.menu].filter(o=>!o[3]).map(o=>o[1].replace(/ \(.*\)$/,'')).join(', ')]);
    if(HOUSE[b.id]){const ch=CHAPTERS.find(c=>c[0]===b.id);L.push(['🏠',`${HOUSE[b.id].L} chapter house`+(ch&&ch[3]?` · President ${ch[3]}`:b.id==='asr'?' · your house':'')])}
    if(b.id==='asr')L.push(['🛏','Your bunk: sleep to save and skip to morning · beer pong']);
    if(typeof BURG!=='undefined'&&BURG[b.id]&&isR('burglar'))L.push(['🦝',`Treasure: the ${BURG[b.id][0]}`+' (in the lounge)']);
    if(INT[b.id])L.push(['🚪',b.id==='lodge'&&S.ch<3?'Locked until Chapter 3':'You can go inside'])}
  for(const m of availM()){const[x,z]=mAt(m);if(inB(x,z))L.push([m.side?'🔷':'⭐',m.name.replace(/^Side: /,''),m.side?'Side task':'Story task'])}
  const st=curStep();if(st&&st.x!=null&&st.t!=='card'&&inB(st.x,st.z))L.push(['◎','Your current objective',st.label||'']);
  for(const p of PHOTOS)if(!S.photos[p[0]]&&ybOn()&&(skv('ybMap')>=1||(S.tips&&S.tips[p[0]]))&&inB(p[2],p[3]))L.push(['📷','Yearbook photo spot nearby']);
  try{const q_=pqGet();if(q_)for(const s of pqSpots())if(!q_[s.kind][s.i]&&inB(s.x,s.z))L.push([s.kind==='sp'?'★':'◎',s.kind==='sp'?'Pledge job special case: '+PQ[q_.k].sp[s.i][1]:'Pledge job trial: '+PQ[q_.k].mg[s.i][1]])}catch(e){}
  if(!L.length)L.push(['·','Nothing to do inside, but it\'s a landmark on the walking tour']);
  return{sub,L,about:AB[1],cat:AB[0]}}
function hbTarget(e){const b=e.b;if(b&&b.ex!=null)return[b.ex,b.ez];{const u=(UCD.B||[]).find(u=>u.n===e.name&&u.fp&&u.fn);if(u)return[u.fp[0]+u.fn[0]*2.3,u.fp[1]+u.fn[1]*2.3]}const P0=mapPos();let best=null,bd=1e9;const p=e.poly,n=p.length;
  for(let i=0;i<n;i++){const[a,c]=p[i],[d,f]=p[(i+1)%n],vx=d-a,vz=f-c,L2=vx*vx+vz*vz||1,t=clamp(((P0[0]-a)*vx+(P0[1]-c)*vz)/L2,0,1),x=a+vx*t,z=c+vz*t,dd=Math.hypot(x-P0[0],z-P0[1]);if(dd<bd){bd=dd;best=[x,z,vx,vz]}}
  if(!best)return e.c;const[x,z]=best;let nx=-best[3],nz=best[2];const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;if(inPoly(x+nx,z+nz,p)){nx=-nx;nz=-nz}
  return[x+nx*3,z+nz*3]}
function setMapRoute(x,z,name,px,pz){MAPROUTE={x,z,name,px:px==null?x:px,pz:pz==null?z:pz};GKEY='';refreshGoal(1);tone(660,.08,'triangle',.12);tone(990,.1,'triangle',.1,.07);mapRouteUI()}
function clearMapRoute(silent){if(!MAPROUTE)return;MAPROUTE=null;GKEY='';refreshGoal(1);if(!silent)tone(420,.08,'triangle',.1);mapRouteUI()}
function mapRouteUI(){const e=$('maproute');if(!e)return;e.hidden=true;return;   // V143 the route is shown on the map card itself; the banner squeezed the map
  e.innerHTML=`<b>Route set:</b> ${MAPROUTE.name}. Close the map and follow the blue trail. <button id="mrclr">Clear route</button>`;$('mrclr').onclick=()=>clearMapRoute()}
function routeTick(){if(!MAPROUTE||P.inside||mode!=='play')return;if(Math.hypot(P.x-MAPROUTE.x,P.z-MAPROUTE.z)<4.5){toast(`You've arrived: ${MAPROUTE.name}.`,2600);tone(880,.12,'triangle',.12);clearMapRoute(1)}}
// ---- markers: bigger, outlined, each with a tooltip; the route pin and the trail show on both maps
function mapMarkers(q,X,Z,k,full){const st=curStep(),f=full?1.45:1;if(full)MKH=[];const hit=(x,y,r,title,sub,wx,wz,card)=>{if(full)MKH.push({x,y,r:r+4,title,sub,wx,wz,card})};
  try{gigMap(q,X,Z,k,full,hit)}catch(e){}
  q.save();if(full){q.shadowColor='rgba(0,0,0,.6)';q.shadowBlur=5;q.shadowOffsetY=1.5}
  const disc=(x,y,r,fill,stroke,lw=2)=>{q.beginPath();q.arc(x,y,r,0,TAU);q.fillStyle=fill;q.fill();q.lineWidth=lw;q.strokeStyle=stroke;q.stroke()};
  {q.fillStyle=TRGOLD?'#ffd873':'#7fd8ff';q.strokeStyle=TRGOLD?'#6a4a00':'#123a7a';q.lineWidth=1.2;for(const p of trailPts){q.beginPath();q.arc(X(p[0]),Z(p[1]),full?3.2:1.8,0,TAU);q.fill();if(full)q.stroke()}}
  for(const p of PHOTOS)if(!S.photos[p[0]]&&ybOn()&&(skv('ybMap')>=1||(S.tips&&S.tips[p[0]]))){const x=X(p[2]),y=Z(p[3]),r=6*f;disc(x,y,r,'#14203a','#e2b64c',1.6);q.shadowBlur=0;q.fillStyle='#e2b64c';q.fillRect(x-r*.5,y-r*.28,r,r*.62);q.fillStyle='#14203a';q.beginPath();q.arc(x,y+r*.03,r*.22,0,TAU);q.fill();hit(x,y,r,'Yearbook photo spot',skv('ybPay')>=1?p[1]:'Somewhere around here',p[2],p[3],()=>cardForPhoto(p))}
  /* V396 the pledge job's special cases (star) and trials (target) that are still to do, in the job's colour; toggled by the Pledge Job button */try{pqMapDraw(q,X,Z,f,disc,hit)}catch(e){}
  for(const b of B)if(b.ex!=null&&['diner','pawn','hank'].includes(b.menu)){const x=X(b.ex),y=Z(b.ez),r=7*f;q.shadowBlur=0;q.font=`900 ${Math.round(17*f)}px Archivo,Arial`;q.textAlign='center';q.textBaseline='middle';q.lineJoin='round';q.lineWidth=Math.max(3,3.2*f);q.strokeStyle='#1d1a16';q.strokeText('$',x,y+.5);q.fillStyle='#e2b64c';q.fillText('$',x,y+.5);hit(x,y,r,b.name,'Shop: '+(SHOP[b.menu]||[]).filter(o=>!o[3]).map(o=>o[1].replace(/ \(.*\)$/,'')).slice(0,4).join(', '),b.ex,b.ez,()=>cardForShop(b))}
  const sl=classWindow();if(sl!==null&&!S.att[S.day+'-'+sl])for(const c of classesAt(S.day,sl)){const b=clsBld(c);if(b&&b.ex!=null){const x=X(b.ex),y=Z(b.ez),r=8*f;q.fillStyle='#2f7fd0';q.strokeStyle='#fff';q.lineWidth=2;q.beginPath();q.roundRect?q.roundRect(x-r,y-r*.8,r*2,r*1.6,3):q.rect(x-r,y-r*.8,r*2,r*1.6);q.fill();q.stroke();q.shadowBlur=0;q.fillStyle='#fff';q.fillRect(x-r*.6,y-r*.45,r*.5,r*.9);q.fillRect(x+r*.1,y-r*.45,r*.5,r*.9);q.fillStyle='#2f7fd0';q.fillRect(x-.6,y-r*.5,1.2,r);
    hit(x,y,r,`Class now: ${CI[c].n}`,`${CI[c].bn} · ${CI[c].prof} · starts at ${sl?'1 PM':'9 AM'}`,b.ex,b.ez,()=>cardForClass(c,b,sl))}}
  for(const s of SIDES()){const x=X(s[0]),y=Z(s[1]),r=8.5*f;if(MGIC[s[2]])mgBadge(q,x,y,r,MGIC[s[2]]);else{q.fillStyle='#4a9cff';q.strokeStyle='#fff';q.lineWidth=2;q.beginPath();q.moveTo(x,y-r);q.lineTo(x+r*.8,y);q.lineTo(x,y+r);q.lineTo(x-r*.8,y);q.closePath();q.fill();q.stroke()}hit(x,y,r,s[2],'Side activity',s[0],s[1],()=>cardForSide(s))}
  for(const m of availM()){const[mx,mz]=mAt(m),x=X(mx),y=Z(mz);starAt(q,x,y,(full?12:8),m.side);if(full){q.shadowBlur=0;q.lineWidth=1.2;q.strokeStyle='#fff';q.stroke()}const w=mWho(m);hit(x,y,10*f,m.name.replace(/^Side: /,''),(m.side?'Side task':'Story task')+(w&&NN[w]?' · talk to '+NN[w].name:''),mx,mz,()=>cardForMission(m,w))}
  if(!full)for(const n of NP){if(n.down||n.hidden||n.dp>70)continue;let c=null;if(n.chase||n.aggro&&n.tgt==='P'||n.foe)c='#ff4a3a';else if(n.ally)c='#7fe07a';else if(S.bb==='owen'&&n.auth)c='#5aa7e0';else if(S.bb==='owen'&&S.rep[n.cl]!=null&&S.rep[n.cl]<=-25)c='#e07a3a';if(c){q.fillStyle=c;q.beginPath();q.arc(X(n.x),Z(n.z),3.6,0,TAU);q.fill()}}
  if(st&&st.x!=null&&st.t!=='card'){const x=X(st.x),y=Z(st.z),r=(7+Math.sin(TT*4)*1.5)*f;q.strokeStyle='#ffd060';q.lineWidth=3;q.beginPath();q.arc(x,y,r,0,TAU);q.stroke();q.fillStyle='rgba(255,208,96,.35)';q.fill();q.beginPath();q.arc(x,y,r+4*f,0,TAU);q.lineWidth=1.2;q.stroke();hit(x,y,r,'Current objective',st.label||'',st.x,st.z,()=>cardForObjective(st))}
  if(MAPROUTE){const x=X(MAPROUTE.px),y=Z(MAPROUTE.pz),r=7*f;q.fillStyle='#2556d6';q.strokeStyle='#fff';q.lineWidth=2;q.beginPath();q.moveTo(x,y);q.bezierCurveTo(x-r*1.3,y-r*1.4,x-r*.9,y-r*2.8,x,y-r*2.8);q.bezierCurveTo(x+r*.9,y-r*2.8,x+r*1.3,y-r*1.4,x,y);q.fill();q.stroke();q.shadowBlur=0;q.fillStyle='#fff';q.beginPath();q.arc(x,y-r*1.8,r*.4,0,TAU);q.fill();hit(x,y-r*1.5,r*1.4,'Your route',MAPROUTE.name+' · click the pin or right-click the map to clear',MAPROUTE.px,MAPROUTE.pz)}
  q.restore()}
// ---- the full map: a cached base, then an overlay redrawn every frame while the map is open
// V151 the map key, drawn as a two-row strip in the empty green strip south of the downtown blocks (below the bottom road), so it covers no buildings
// V205 each minigame has its own icon on the map and in the key
const MGIC={'Beer Die':'🎲','Beer Pong':'🍺','Flag Football':'🏈','WHRG Radio':'📻','Go-Karts':'🏎'};
function mgBadge(q,x,y,r,ic){q.fillStyle='#14203a';q.strokeStyle='#5aa7e0';q.lineWidth=2;q.beginPath();q.arc(x,y,r,0,TAU);q.fill();q.stroke();q.font=Math.round(r*1.25)+'px Arial';q.textAlign='center';q.textBaseline='middle';q.fillStyle='#fff';q.fillText(ic,x,y+1)}
function mapLegend(q,c){if(MAPTAB==='lake')return;const L=[['★','#ffd060','Story task'],['★','#4a9cff','Side quest'],['🎮','','Minigame','mg'],['$','#e2b64c','Shop'],['$','#2f9a4a','Odd job','dot'],['📖','','Class now'],['📷','','Yearbook spot'],['📍','','Your route']];/* V396 */try{if(SET.pqm&&pqGet())L.push(['★',PR[pqGet().k].c,'Pledge job spot','dot'])}catch(e){}
  const w=476,h=58,x=c.width-w-6,y=c.height-h-5,cw=104;q.save();q.fillStyle='rgba(22,20,16,.84)';q.strokeStyle='#e2b64c';q.lineWidth=1.6;q.beginPath();q.roundRect?q.roundRect(x,y,w,h,8):q.rect(x,y,w,h);q.fill();q.stroke();
  q.fillStyle='#e2b64c';q.font='13px Graduate,Georgia';q.textAlign='center';q.textBaseline='middle';q.fillText('MAP',x+30,y+h/2-8);q.fillText('KEY',x+30,y+h/2+8);
  L.forEach(([ic,col,t,dot],i)=>{const cx=x+66+(i%4)*cw,cy=y+17+Math.floor(i/4)*24;if(dot==='mg')mgBadge(q,cx,cy,8,ic);else if(dot){q.fillStyle=col;q.beginPath();q.arc(cx,cy,7,0,TAU);q.fill();q.fillStyle='#fff';q.font='bold 10px Arial';q.textAlign='center';q.fillText(ic,cx,cy+1)}
    else{q.font=col?'bold 15px Arial':'13px Arial';q.textAlign='center';q.fillStyle=col||'#fff';q.fillText(ic,cx,cy+1)}q.textAlign='left';q.fillStyle='#f2e6c8';q.font='600 11.5px Archivo,Arial';q.fillText(t,cx+12,cy+1)});
  q.restore()}
function drawFull(c){const lake=MAPTAB==='lake',ZS=1010,LH=320;c.width=lake?1400:900;c.height=lake?LH*2:750;const q=c.getContext('2d'),k=900/WW;q.clearRect(0,0,c.width,c.height);let X,Z,IX,IZ;
  if(lake){q.drawImage(WORLDC,0,ZS*2,700*2,LH*2,0,0,c.width,c.height);X=x=>x*2;Z=z=>(z-ZS)*2;IX=px=>px/2;IZ=py=>py/2+ZS}else{q.drawImage(WORLDC,0,0,WW*2,OD*2,0,0,c.width,c.height);const kz=c.height/OD;X=x=>x*k;Z=z=>z*kz;IX=px=>px/k;IZ=py=>py/kz;try{terrDrawFull(q,c)}catch(e){}}
  let TP=null;TERRHIT=[];LEGHIT=[];if(!lake){try{TP=terrPills(q,X,Z,k)}catch(e){}}
  mapLabels(q,X,Z,lake?1.7:k,TP&&TP.r);try{mapLegend(q,c)}catch(e){}try{if(TP){terrPillDraw(q,TP);terrLegend(q,c)}}catch(e){}const base=c.__base||(c.__base=document.createElement('canvas'));base.width=c.width;base.height=c.height;base.getContext('2d').drawImage(c,0,0);
  FMT={c,X,Z,IX,IZ,k:lake?1.7:k,lake};mapOverlay()}
function mapOverlay(){if(!FMT||!FMT.c.isConnected)return;const{c,X,Z,k,lake}=FMT,q=c.getContext('2d');q.drawImage(c.__base,0,0);
  if(MAPHOV&&MAPHOV.e){const e=MAPHOV.e,cx=X(e.c[0]),cy=Z(e.c[1]),s=MAPSC;q.save();q.translate(cx,cy);q.scale(s,s);q.translate(-cx,-cy);q.beginPath();e.poly.forEach(([x,z],i)=>i?q.lineTo(X(x),Z(z)):q.moveTo(X(x),Z(z)));q.closePath();
    q.shadowColor='rgba(0,0,0,.55)';q.shadowBlur=14;q.shadowOffsetY=4;q.fillStyle=(e.b&&e.b.mc)||'#a88a70';q.fill();q.shadowBlur=0;q.shadowOffsetY=0;q.fillStyle='rgba(255,236,170,.38)';q.fill();q.lineWidth=2.6/s;q.strokeStyle='#ffd34a';q.stroke();q.restore();
    {const nm=e.name,fs=Math.round(FMT.lake?20:16),y0=Z(e.bb[1])-(cy-Z(e.bb[1]))*(s-1)-10;q.save();q.font=`800 ${fs}px Archivo,Arial`;q.textAlign='center';q.textBaseline='bottom';const w=q.measureText(nm).width+16,x=clamp(cx,w/2+4,c.width-w/2-4),y=Math.max(fs+12,y0);q.fillStyle='rgba(14,18,30,.9)';q.strokeStyle='#ffd34a';q.lineWidth=1.5;q.beginPath();q.roundRect?q.roundRect(x-w/2,y-fs-8,w,fs+10,6):q.rect(x-w/2,y-fs-8,w,fs+10);q.fill();q.stroke();q.fillStyle='#ffe9a8';q.fillText(nm,x,y-2);q.restore()}}
  if(!lake||S.ch>=3)mapMarkers(q,X,Z,k,true);
  const mp=mapPos();q.save();q.translate(X(mp[0]),Z(mp[1]));q.rotate(PI-P.face);q.shadowColor='rgba(0,0,0,.6)';q.shadowBlur=5;q.fillStyle='#fff';q.strokeStyle='#7d1f2c';q.lineWidth=2.5;q.beginPath();q.moveTo(0,-13);q.lineTo(10,11);q.lineTo(0,5);q.lineTo(-10,11);q.closePath();q.fill();q.stroke();q.restore();
  if(MAPHOV&&MAPHOV.lab)mapHovLabel(q,c,MAPHOV.lab);
  else if(MAPHOV&&MAPHOV.m){const m=MAPHOV.m,sb=String(m.sub||'');mapHovLabel(q,c,{x:m.x,y:m.y-m.r,h:m.r*2,title:m.title,sub:sb.length>64?sb.slice(0,62)+'…':sb})}   /* V298 names for the icons across campus */
  if(MAPSEL)mapCardDraw(q,c);
  if(lake&&S.ch<3){q.fillStyle='rgba(10,14,24,.6)';q.fillRect(0,0,c.width,c.height);q.fillStyle='#fff';q.font='20px Graduate,Georgia';q.textAlign='center';q.textBaseline='middle';q.fillText('LOCKED UNTIL CHAPTER 3',c.width/2,c.height/2)}}
function mapLoop(){MAPRAF=0;if(mode!=='planner'||!FMT||!FMT.c.isConnected){const m=$('mapcard');if(m)m.hidden=true;return}const tgt=MAPHOV&&MAPHOV.e?1.07:1;MAPSC+=(tgt-MAPSC)*.25;mapOverlay();MAPRAF=requestAnimationFrame(mapLoop)}
function mapPick(px,py){if(!FMT)return null;for(let i=MKH.length-1;i>=0;i--){const m=MKH[i];if(Math.hypot(px-m.x,py-m.y)<=m.r)return{m}}if(FMT.lake&&S.ch<3)return null;
  const x=FMT.IX(px),z=FMT.IZ(py);for(const e of hbList()){if(FMT.lake!==(e.bb[1]>OD))continue;if(x<e.bb[0]||x>e.bb[2]||z<e.bb[1]||z>e.bb[3])continue;if(inPoly(x,z,e.poly))return{e}}return null}
function mapWire(c){MAPSEL=null;const wrap=c.parentElement;wrap.style.position='relative';let tip=$('maptip');if(!tip){tip=document.createElement('div');tip.id='maptip';tip.hidden=true}wrap.appendChild(tip);
  const toCanvas=ev=>{const r=c.getBoundingClientRect(),s=Math.min(r.width/c.width,r.height/c.height),w=c.width*s,h=c.height*s,ox=r.left+(r.width-w)/2,oy=r.top+(r.height-h)/2;return[(ev.clientX-ox)/s,(ev.clientY-oy)/s,ev.clientX-wrap.getBoundingClientRect().left,ev.clientY-wrap.getBoundingClientRect().top]};
  c.onmousemove=ev=>{const[px,py,lx,ly]=toCanvas(ev);if(MAPSEL&&MAPSEL.r){const inR=r=>r&&px>=r[0]&&px<=r[0]+r[2]&&py>=r[1]&&py<=r[1]+r[3];if(inR(MAPSEL.r)){MAPHOV=null;tip.hidden=true;c.style.cursor=inR(MAPSEL.btn)||inR(MAPSEL.close)?'pointer':'default';return}}{const lg=LEGHIT.find(o=>px>=o.x&&px<=o.x+o.w&&py>=o.y&&py<=o.y+o.h),tt=lg?null:terrPillHit(px,py);   /* V297 names for the key entries and the turf letter pills */
    if(lg||tt){c.style.cursor=tt?'pointer':'help';tip.hidden=true;const key=lg?'k:'+lg.title:'t:'+tt.id;if(!MAPHOV||MAPHOV.key!==key){if(lg)MAPHOV={key,lab:{x:lg.x+lg.w/2,y:lg.y,h:lg.h,title:lg.title,sub:lg.sub}};else{const o=TERRHIT.find(q=>q.t===tt),L=(HOUSE[tt.f]||{}).L||tt.f.toUpperCase(),N=(TURFN[tt.f]||(tt.f==='asr'?'Alpha Sigma Rho':L));MAPHOV={key,lab:{x:o?o.x:px,y:o?o.y-o.h/2:py,h:o?o.h:0,title:N+' ('+L+')',sub:(tt.f==='asr'?'Your turf: ':'Turf: ')+tt.n,pill:o}}}}return}}const h=mapPick(px,py),key=h?(h.m?'m:'+h.m.title+h.m.x:'b:'+h.e.name):'';if(!h){MAPHOV=null;tip.hidden=true;c.style.cursor='';return}c.style.cursor='pointer';
    if(!MAPHOV||MAPHOV.key!==key){MAPHOV=Object.assign({key},h);if(h.e){MAPSC=1;const I=hbInfo(h.e);const nc=I.L.filter(l=>l[0]==='📖').length;tip.innerHTML=`<div class="mtn">${h.e.name}</div><div class="mts">${I.sub}</div>`+(nc?`<div class="mtl"><span>📖</span><div>${nc} of your classes meet here</div></div>`:'')+`<div class="mtf">Click for the building card</div>`}
      else tip.innerHTML=`<div class="mtn">${h.m.title}</div>${h.m.sub?`<div class="mts">${h.m.sub}</div>`:''}<div class="mtf">${h.m.card?'Click for the card':'Click to send the blue trail here'}</div>`}
    tip.hidden=false;const W=wrap.clientWidth,H=wrap.clientHeight,tw=tip.offsetWidth,th=tip.offsetHeight;tip.style.left=Math.max(4,Math.min(W-tw-4,lx+16))+'px';tip.style.top=Math.max(4,Math.min(H-th-4,ly+16))+'px'};
  c.onmouseleave=()=>{MAPHOV=null;tip.hidden=true};
  c.onpointerdown=ev=>{c.__pd=[ev.clientX,ev.clientY]};c.onclick=null;c.onpointerup=ev=>{if(ev.button!==0)return;const pd=c.__pd;c.__pd=null;if(pd&&Math.hypot(ev.clientX-pd[0],ev.clientY-pd[1])>14)return;const[px,py]=toCanvas(ev);
    if(MAPSEL&&MAPSEL.r){const inR=(r)=>r&&px>=r[0]&&px<=r[0]+r[2]&&py>=r[1]&&py<=r[1]+r[3];if(inR(MAPSEL.close)){MAPSEL=null;tone(420,.06,'triangle',.08);return}if(inR(MAPSEL.btn2)){const M_=MAPSEL;MAPSEL=null;if(M_.ft)fastTo(M_.ft);else fastHome();return}if(inR(MAPSEL.btn)){const r=MAPSEL.route;if(mapSelRouted())clearMapRoute();else setMapRoute(r.x,r.z,r.name,r.px,r.pz);return}if(inR(MAPSEL.r))return}
    {const th=terrPillHit(px,py);if(th){tip.hidden=true;MAPSEL=cardForTurf(th);const r=MAPSEL.route;setMapRoute(r.x,r.z,r.name,r.px,r.pz);return}}
    const h=mapPick(px,py);if(!h){if(FMT.lake&&S.ch<3)return;const wx=FMT.IX(px),wz=FMT.IZ(py),[tx,tz]=pinGround(wx,wz);MAPSEL=cardForArea(wx,wz,tx,tz);setMapRoute(tx,tz,MAPSEL.route.name,wx,wz);return}
    if(h.m){if(h.m.title==='Your route'){clearMapRoute();return}if(h.m.card){let C=null;try{C=h.m.card()}catch(e){}if(C){tip.hidden=true;MAPSEL=Object.assign({bld:0,secs:[],sub:'',about:''},C,{route:{x:h.m.wx,z:h.m.wz,px:h.m.wx,pz:h.m.wz,name:h.m.title}});tone(520,.06,'triangle',.08);setMapRoute(h.m.wx,h.m.wz,h.m.title,h.m.wx,h.m.wz);return}}setMapRoute(h.m.wx,h.m.wz,h.m.title)}else{tip.hidden=true;MAPSEL=cardForBuilding(h.e);const r=MAPSEL.route;setMapRoute(r.x,r.z,r.name,r.px,r.pz)}};
  c.oncontextmenu=ev=>{ev.preventDefault();clearMapRoute()};
  mapRouteUI();if(!MAPRAF)MAPRAF=requestAnimationFrame(mapLoop)}

// the building card: name, what it is, your classes there, and everything else inside or around it
function mapCard(e,cx,cy){let el=$('mapcard');if(!el){el=document.createElement('div');el.id='mapcard'}if(el.parentElement!==document.body)document.body.appendChild(el);
  const I=hbInfo(e),cls=I.L.filter(l=>l[0]==='📖'),oth=I.L.filter(l=>l[0]!=='📖'&&l[0]!=='·'),row=([ic,t,s2])=>`<div class="mcl"><span>${ic}</span><div>${t}${s2?`<small>${s2}</small>`:''}</div></div>`;
  const here=MAPROUTE&&MAPROUTE.name===e.name;
  el.innerHTML=`<button class="mcx" aria-label="Close">✕</button><div class="mck">${I.cat}</div><div class="mcn">${e.name}</div><div class="mcs">${I.sub.split(' · ').slice(1).join(' · ')}</div><p class="mca">${I.about}</p>
    <h4>Your classes here</h4>${cls.length?cls.map(row).join(''):'<div class="mce">None of your classes meet in this building.</div>'}
    <h4>In and around</h4>${oth.length?oth.map(row).join(''):'<div class="mce">Nothing to do inside right now, but it\'s a stop on the walking tour.</div>'}
    <div class="mcb"><button class="mcgo">${here?'✓ Route set · clear it':'📍 Send the blue trail here'}</button></div>`;
  el.hidden=false;{if(cx==null){const r=FMT.c.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2}const W=innerWidth,H=innerHeight,w=el.offsetWidth,h=el.offsetHeight;let x=cx+18;if(x+w>W-8)x=cx-w-18;x=Math.max(8,Math.min(W-w-8,x));const y=Math.max(8,Math.min(H-h-8,cy-h/2));el.style.left=x+'px';el.style.top=y+'px'}tone(520,.06,'triangle',.08);
  el.querySelector('.mcx').onclick=()=>{el.hidden=true};
  el.querySelector('.mcgo').onclick=()=>{if(here)clearMapRoute();else{const[x,z]=hbTarget(e);setMapRoute(x,z,e.name)}el.hidden=true}}

// the building card drawn on the map canvas itself (so it shows wherever the map shows): name, what it is, your classes, what's in and around, a route button
function mapCardDraw(q,c){const M=MAPSEL,sc=c.width/900,W=Math.round(330*sc),P=14*sc,F=(w,px)=>`${w} ${Math.round(px*sc)}px Archivo,Arial,sans-serif`;
  const wrap=(t,font,maxW)=>{q.font=font;const out=[];let line='';for(const w of String(t).split(' ')){const tt=line?line+' '+w:w;if(q.measureText(tt).width>maxW&&line){out.push(line);line=w}else line=tt}if(line)out.push(line);return out};
  const iw=W-P*2,ops=[];let y=P;
  const add=(kind,text,font,color,lh,indent=0)=>{for(const ln of wrap(text,font,iw-indent)){ops.push([kind,ln,font,color,y,indent]);y+=lh}};
  add('t',M.cat.toUpperCase(),F(800,10.5),'#7d1f2c',15*sc);add('t',M.name,F(800,19),'#26221c',23*sc);if(M.sub)add('t',M.sub,F(400,11),'#6b6358',16*sc);y+=3*sc;
  add('t',M.about,F(400,12.5),'#26221c',16*sc);y+=6*sc;
  const sec=(h,rows,empty)=>{ops.push(['h',h,F(800,10),'#4b443a',y,0]);y+=15*sc;if(!rows.length){add('t',empty,'italic '+F(400,11.5),'#6b6358',15*sc)}else for(const[ic,t,s2]of rows){ops.push(['i',ic,F(400,12.5),'#26221c',y,0]);add('t',t,F(600,12.5),'#26221c',16*sc,20*sc);if(s2)add('t',s2,F(400,11),'#6b6358',14*sc,20*sc);y+=2*sc}y+=4*sc};
  for(const[h,rows,empty]of M.secs)sec(h,rows,empty);
  const BH=30*sc;y+=4*sc;const by=y;y+=BH+P;const by2=M.home||M.ft?y-P+8*sc:0;if(M.home||M.ft)y+=BH+8*sc;const H=y;
  const left=FMT.X(M.route.px)>c.width/2,x0=left?10*sc:c.width-W-10*sc,y0=Math.max(10*sc,Math.min(c.height-H-10*sc,FMT.Z(M.route.pz)-H/2));
  q.save();q.shadowColor='rgba(0,0,0,.5)';q.shadowBlur=16*sc;q.shadowOffsetY=5*sc;q.fillStyle='rgba(251,247,238,.97)';q.beginPath();q.roundRect?q.roundRect(x0,y0,W,H,9*sc):q.rect(x0,y0,W,H);q.fill();q.shadowColor='transparent';q.lineWidth=2.2*sc;q.strokeStyle='#7d1f2c';q.stroke();
  q.textBaseline='top';q.textAlign='left';
  for(const[kind,t,font,color,yy,ind]of ops){q.font=font;q.fillStyle=color;if(kind==='h'){q.fillText(t,x0+P,y0+yy);q.fillStyle='#e0d6c2';q.fillRect(x0+P,y0+yy+12*sc,iw,1*sc)}else q.fillText(t,x0+P+ind,y0+yy)}
  const here=mapSelRouted(),bt=here?(M.bld?'✓ Trail set to the front door - clear':'✓ Pin set here - clear'):'📍 Send the blue trail here';q.font=F(800,12.5);const bw=q.measureText(bt).width+26*sc,bx=x0+(W-bw)/2,byy=y0+by;
  q.fillStyle=here?'#2a6a3a':'#1e3c78';q.beginPath();q.roundRect?q.roundRect(bx,byy,bw,BH,6*sc):q.rect(bx,byy,bw,BH);q.fill();q.fillStyle='#fff';q.textAlign='center';q.textBaseline='middle';q.fillText(bt,bx+bw/2,byy+BH/2+1);
  // V178 the ΑΣΡ card carries the fast travel home (pledges only)
  if(M.home||M.ft){const t2=M.home?'🏠 Fast travel to the living-room couch':'🚩 Fast travel here';q.font=F(800,12.5);const w2=q.measureText(t2).width+26*sc,x2=x0+(W-w2)/2,y2=y0+by2;q.fillStyle='#7d1f2c';q.beginPath();q.roundRect?q.roundRect(x2,y2,w2,BH,6*sc):q.rect(x2,y2,w2,BH);q.fill();q.fillStyle='#fff';q.textAlign='center';q.textBaseline='middle';q.fillText(t2,x2+w2/2,y2+BH/2+1);MAPSEL.btn2=[x2,y2,w2,BH]}else MAPSEL.btn2=null;
  const cs=22*sc,cx=x0+W-cs-6*sc,cy=y0+6*sc;q.fillStyle='#7d1f2c';q.font=F(800,16);q.fillText('✕',cx+cs/2,cy+cs/2);q.restore();
  MAPSEL.r=[x0,y0,W,H];MAPSEL.btn=[bx,byy,bw,BH];MAPSEL.close=[cx,cy,cs,cs]}
const mapSelRouted=()=>{const r=MAPSEL&&MAPSEL.route;return!!(r&&MAPROUTE&&MAPROUTE.name===r.name&&Math.hypot(MAPROUTE.px-r.px,MAPROUTE.pz-r.pz)<.5)};
function cardForBuilding(e){const I=hbInfo(e),[x,z]=hbTarget(e);return{bld:1,name:e.name,cat:I.cat,sub:I.sub.split(' · ').slice(1).join(' · '),about:I.about,
  secs:[['YOUR CLASSES HERE',I.L.filter(l=>l[0]==='📖'),'None of your classes meet in this building.'],['IN AND AROUND',I.L.filter(l=>l[0]!=='📖'&&l[0]!=='·').slice(0,5),"Nothing to do inside right now - it's a stop on the walking tour."]],
  home:!!(S.pledged&&e.b&&e.b.id==='asr'),ft:S.pledged&&e.b?fastSpots().find(f=>f.b===e.b.id)||null:null,route:{x,z,px:e.c[0],pz:e.c[1],name:e.name}}}
// open ground: which part of campus is this? (plazas and lawns, streets, then the districts)
const AREAINFO={'Campus Green':['Lawn','The big lawn on the east side of campus: frisbee, picnics and the shortcut to class.'],
'Sigma Sigma Commons':['Plaza','The old Sigma Sigma tailgate lawn: game-day crowds, grills and lawn chairs.'],
'Bearcats Commons':['Lawn','The central lawn between TUC and the Arts & Sciences halls; everybody crosses it between classes.'],
'Schneider Quad':['Quad','The residence-hall quad by Schneider, Calhoun and Daniels: hammocks and late-night pizza.'],
'Victory Plaza':['Plaza','The plaza outside the stadium gates where the team walks in on game day.'],
'CCM Plaza':['Plaza','CCM Village\'s plaza: music students rehearsing outside the concert halls.'],
'University Plaza':['Plaza','The fountain plaza by University Pavilion; a favourite meeting spot.'],
'Budig Commons':['Lawn','A quiet lawn on the north side of campus.'],
'Mew Gardens':['Garden','Shady garden paths and benches.'],
'Sheakley Lawn':['Lawn','The lawn by the Sheakley Athletics Center.'],
'Classen Park':['Park','A small park on the edge of campus.'],
'Burnet Woods':['Park','The big wooded park north of campus: trails, a pond and the old bandstand.'],
'MainStreet':['Pedestrian Street','UC\'s pedestrian spine past TUC, Steger and the CRC: food, clubs and crowds all day.'],
'GREEK ROW':['Neighborhood','Chapter houses for UC\'s fraternities and sororities, including yours.'],
'CLIFTON HEIGHTS':['Neighborhood','The off-campus student neighborhood: apartments, porches and parties.'],
'ATHLETICS':['Athletics District','Nippert Stadium, Fifth Third Arena, the Lindner Center and the practice fields.'],
'U-SQUARE':['Neighborhood','The Calhoun Street strip: Ruby\'s Diner, the pawn shop, Hank\'s Market and the police station.'],
'LAKE DISTRICT':['Lake','The lake, the Lodge and the boathouse, past the edge of town.'],
'CAMP HOLLOW':['Woods','The old camp grounds in the hollow by the lake.'],
'Mirror Pond':['Pond','A still pond in the woods by the lake.']};
function areaAt(x,z){let best=null,bv=1;const cand=[];for(const[n,p]of Object.entries(UCD.lbl||{})){const street=/ (Ave|Dr|Blvd|Cir|St)$/.test(n);cand.push([n,p[0],p[1],street?22:n==='MainStreet'?50:n==='Burnet Woods'?90:45,street?'Street':null])}
  for(const[n,x0,z0]of MAPLBL)if(n===n.toUpperCase()||n==='Mirror Pond')cand.push([n,x0,z0,n==='ATHLETICS'?85:n==='Mirror Pond'?40:130,null]);else if(!UCD.lbl[n])cand.push([n,x0,z0,22,'Street']);
  for(const[n,ax,az,r,kind]of cand){const v=Math.hypot(x-ax,z-az)/r;if(v<bv){bv=v;best=[n,kind]}}return best}
function cardForArea(wx,wz,tx,tz){const a=areaAt(wx,wz),nm=a?a[0]:(inCampus(wx,wz)?'Campus grounds':'Around town'),pretty=nm===nm.toUpperCase()?nm.split(' ').map(w=>w[0]+w.slice(1).toLowerCase()).join(' ').replace('U-square','U-Square'):nm;
  const info=AREAINFO[nm]||(a&&a[1]==='Street'?['Street',`${pretty}: watch for cars, and cross at the crosswalks.`]:['Open Ground','A stretch of campus between the buildings.']);
  const near=hbList().map(e=>[e,Math.hypot(e.c[0]-wx,e.c[1]-wz)]).sort((a,b)=>a[1]-b[1]).slice(0,3).map(([e,d])=>['🏛',e.name,`${bldAbout(e)[0]} · ${Math.round(d)} m away`]);
  const todo=[];for(const m of availM()){const[x,z]=mAt(m);const d=Math.hypot(x-wx,z-wz);if(d<45)todo.push([m.side?'🔷':'⭐',m.name.replace(/^Side: /,''),`${m.side?'Side task':'Story task'} · ${Math.round(d)} m away`])}
  for(const s2 of SIDES()){const d=Math.hypot(s2[0]-wx,s2[1]-wz);if(d<45)todo.push([MGIC[s2[2]]||'◆',s2[2],`Minigame · ${Math.round(d)} m away`])}
  for(const p of PHOTOS)if(!S.photos[p[0]]&&ybOn()&&(skv('ybMap')>=1||(S.tips&&S.tips[p[0]]))&&Math.hypot(p[2]-wx,p[3]-wz)<45)todo.push(['📷','Yearbook photo spot nearby'])
  return{name:pretty,cat:info[0],sub:(()=>{try{return terrSub(wx,wz)}catch(e){return''}})(),about:info[1],secs:[['NEARBY BUILDINGS',near,'No buildings nearby.'],['THINGS TO DO NEARBY',todo.slice(0,4),'Nothing going on here right now.']],route:{x:tx,z:tz,px:wx,pz:wz,name:pretty}}}


// ---- V160 cards for the map markers (shops, class, side activities, story tasks, objective, yearbook spots, odd jobs)
const SIDEABOUT={'Beer Die':['Party Game','2 v 2 beer die with Marcus on the ΑΣΡ backyard plywood: toss on offense, catch one-handed on defense. To 9 or 11, win by 2.','Play it at the ΑΣΡ backyard, next to the pong table'],'Beer Pong':['Party Game','Backyard beer pong with the brothers: sink all six cups.','Play it at the ΑΣΡ backyard'],'Flag Football':['Pickup Game','Sign up for flag football with the coach at the gym.','Talk to the coach at the gym'],'WHRG Radio':['Campus Radio','Take the mic for the night shift: six callers, one set list.','Shifts run 4 PM to 11 PM'],'Go-Karts':['Lake Activity','Race karts down by the lake.','Open from Chapter 3']};
const GIGABOUT={lost:'A student lost something on campus and will pay to get it back.',letter:'A secret admirer needs a love letter delivered, discreetly.',setup:'Student Gov needs a hand setting up an event.',truant:'A professor wants a skipping student found and sent back to class.',delivery:'The dining hall needs a hot order delivered.',flyers:'Somebody needs flyers posted around campus.',pet:'A pet owner needs help with a pet.',coffee:'Somebody needs a coffee run.'};
function mkArea(x,z){try{const a=areaAt(x,z);return a?(a[0]===a[0].toUpperCase()?a[0][0]+a[0].slice(1).toLowerCase():a[0]):''}catch(e){return''}}
function mkNear(x,z){try{const e=hbList().map(e=>[e,Math.hypot(e.c[0]-x,e.c[1]-z)]).sort((a,b)=>a[1]-b[1])[0];return e&&e[1]<60?`Near ${e[0].name}`:''}catch(e){return''}}
function cardForShop(b){let ab='';try{const e=hbList().find(e=>e.b===b);if(e)ab=bldAbout(e)[1]}catch(e){}
  const rows=(SHOP[b.menu]||[]).filter(o=>!o[3]).map(o=>['$',o[1].replace(/ \(.*\)$/,''),'$'+o[2]]);
  return{cat:'Shop',name:b.name,sub:mkNear(b.ex,b.ez)||'U-Square',about:ab||'A shop on the strip.',secs:[['FOR SALE',rows,'Nothing for sale right now.']]}}
function cardForClass(c,b,sl){return{cat:'Class Now',name:CI[c].n,sub:`${CI[c].bn} · ${CI[c].prof}`,about:`Your class starts at ${sl?'1 PM':'9 AM'}. Show up on time to keep your attendance.`,secs:[['DETAILS',[['📖','Grade '+S.grades[c]+' of 3','Next class: '+nextMeet(c)],['🏛',CI[c].bn,mkArea(b.ex,b.ez)]],'']]}}
function cardForSide(s){const A=SIDEABOUT[s[2]]||['Side Activity','An optional activity for extra cash and reputation.',''];
  return{cat:A[0],name:s[2],sub:'Side activity'+(mkNear(s[0],s[1])?' · '+mkNear(s[0],s[1]):''),about:A[1],secs:[['HOW TO PLAY',[['🎮',A[2]||'Walk up to it']],'']]}}
function cardForMission(m,w){const nm=m.name.replace(/^Side: /,''),n=w&&NN[w],rows=[],at=mAt(m);
  if(n)rows.push(['💬','Talk to '+n.name,n.title||'']);const ar=mkArea(at[0],at[1]);if(ar)rows.push(['📍',ar,mkNear(at[0],at[1])]);
  if(m.when)rows.push(['🕒','Available '+m.when[0]+':00 to '+m.when[1]+':00']);
  return{cat:m.side?'Side Task':'Story Task',name:nm,sub:m.side?'Optional · extra cash and reputation':'Main story',about:m.side?'An optional favor for someone on campus.':'Part of the main story. Finishing it moves your rush week forward.',secs:[['WHERE TO GO',rows,'']]}}
function cardForObjective(st){return{cat:'Current Objective',name:st.label||'Objective',sub:'Your next step',about:'Where your current task wants you to go next.',secs:[['WHERE',[['📍',mkArea(st.x,st.z)||'Campus',mkNear(st.x,st.z)]],'']]}}
function cardForPhoto(p){const known=skv('ybPay')>=1;return{cat:'Yearbook Photo',name:known?p[1]:'Yearbook photo spot',sub:'Photo spot',about:known?'A shot the yearbook editor wants. Stand near it and take the picture.':'The yearbook editor wants a shot somewhere around here.',secs:[['WHERE',[['📷',mkArea(p[2],p[3])||'Around here',mkNear(p[2],p[3])]],'']]}}
function cardForGiver(n){const o=n.gigOffer||{},T=GIGT[o.k]||{};
  return{cat:'Odd Job',name:n.name,sub:(T.title||'Student')+' · pays about $'+(o.pay||'?'),about:GIGABOUT[o.k]||'Somebody needs a favor and will pay for it.',secs:[['HOW IT WORKS',[['💬','Walk up and talk to them','Accept the offer to start'],['💵','Pays $'+(o.pay||'?'),'Paid when you report back']],''],['WHERE THEY ARE',[['📍',mkArea(n.x,n.z)||'Campus',mkNear(n.x,n.z)]],'']]}}
function cardForGigPoint(g){let lab='',pt=[0,0];try{lab=GIGT[g.k].lab(g);pt=GIGT[g.k].pts(g)[0]||pt}catch(e){}return{cat:'Odd Job Objective',name:lab||'Odd job',sub:'Pays $'+(g.pay||'?'),about:GIGABOUT[g.k]||'Your current odd job.',secs:[['STATUS',[['💵','Pays $'+(g.pay||'?')],['📍',mkArea(pt[0],pt[1])||'Campus',mkNear(pt[0],pt[1])]],'']]}}

// a pin dropped on something you can't stand on (a roof, a pond, a stand): the trail runs to the nearest open ground
function pinGround(x,z){if(freeAt(x,z,.5))return[x,z];for(let r=1.5;r<=40;r+=1.5)for(let k=0;k<20;k++){const a=k/20*TAU,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(freeAt(px,pz,.5))return[px,pz]}return[x,z]}
// V297 name label for a hovered turf pill or key entry, drawn on the map in the same style as the building names (dark box, gold border)
function mapHovLabel(q,c,L){q.save();if(L.pill){const o=L.pill;q.strokeStyle='#ffd34a';q.lineWidth=2.4;q.beginPath();q.roundRect?q.roundRect(o.x-o.w/2-3,o.y-o.h/2-3,o.w+6,o.h+6,(o.h+6)/2):q.rect(o.x-o.w/2-3,o.y-o.h/2-3,o.w+6,o.h+6);q.stroke()}
  const fs=15,fs2=11.5;q.font=`800 ${fs}px Archivo,Arial`;const w1=q.measureText(L.title).width;q.font=`600 ${fs2}px Archivo,Arial`;const w2=L.sub?q.measureText(L.sub).width:0;
  const w=Math.max(w1,w2)+18,h=fs+10+(L.sub?fs2+4:0),x=clamp(L.x,w/2+4,c.width-w/2-4);let y=L.y-8-h;if(y<4)y=L.y+(L.h||0)+8;
  q.fillStyle='rgba(14,18,30,.92)';q.strokeStyle='#ffd34a';q.lineWidth=1.5;q.beginPath();q.roundRect?q.roundRect(x-w/2,y,w,h,6):q.rect(x-w/2,y,w,h);q.fill();q.stroke();
  q.textAlign='center';q.textBaseline='top';q.fillStyle='#ffe9a8';q.font=`800 ${fs}px Archivo,Arial`;q.fillText(L.title,x,y+5);if(L.sub){q.fillStyle='#d9ccb0';q.font=`600 ${fs2}px Archivo,Arial`;q.fillText(L.sub,x,y+fs+8)}q.restore()}

