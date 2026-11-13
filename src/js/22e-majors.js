// ================================================================ V350 MAJORS: Danny declares a major in the Dean's office. A major opens three colleges
// (one for the body, one for the wallet, one for people skills) and their courses; classes outside the major are closed to him, and the Skill Tree
// shows exactly those three colleges. cols[0] is the home college (all five courses); the other two give four courses each (skip = left out).
const COLFX={design:['Wallet','Shop discounts, weekly pay and faster XP'],as:['Body','Harder hits, more stamina and faster XP'],eng:['Body','Punch damage, defense and run speed'],
  bus:['Wallet','Weekly pay, discounts and reputation'],ccm:['People','Persuasion, class spirit and house standing'],law:['People','Less police heat and talking out of busts'],edu:['People','Faster XP, class spirit and reputation'],health:['Body','More health, stamina and defense']};
const MAJ={
  civil:{n:'Civil Engineering',d:'Bridges, buildings and the codes that keep them standing.',cols:['eng','design','law'],skip:['fash','trial']},
  indd:{n:'Industrial Design',d:'Making things people want to pick up, then selling the idea to a room.',cols:['design','eng','ccm'],skip:['cs','music']},
  liberal:{n:'Liberal Arts',d:'A bit of everything: the lab, the studio and the stage.',cols:['as','design','ccm'],skip:['arch','dance']},
  sport:{n:'Sport Administration',d:'The business of games: budgets, bodies and the crowd.',cols:['bus','health','ccm'],skip:['anat','film']},
  media:{n:'Digital Media',d:'Cameras, code and campaigns. Half artist, half engineer, part salesman.',cols:['ccm','eng','bus'],skip:['mech','acct']},
  prelaw:{n:'Pre-Law',d:'Arguments, evidence and the money behind both.',cols:['law','as','bus'],skip:['geol','mkt']},
  health:{n:'Public Health',d:'Keeping a whole city well: medicine, messaging and policy.',cols:['health','design','law'],skip:['fash','contract']},
  /* V351 fourteen more (21 in all). Same rule: one Body, one Wallet, one People college; no two majors share both the same colleges and the same home */
  archi:{n:'Architecture',d:'Studio all night, structures all day, and a zoning board that says no.',cols:['design','eng','law'],skip:['robo','invest']},
  graphic:{n:'Graphic Design',d:'Posters, type and colour, with enough history to know what you are stealing from.',cols:['design','as','ccm'],skip:['chem','music']},
  fashion:{n:'Fashion Design',d:'Cloth, bodies and a runway. It is harder than it looks.',cols:['design','health','ccm'],skip:['smed','film']},
  urban:{n:'Urban Planning',d:'Where the roads go, why the river floods, and who gets to decide.',cols:['design','as','law'],skip:['chem','trial']},
  mecheng:{n:'Mechanical Engineering',d:'Gears, forces and the patent that pays for them.',cols:['eng','bus','law'],skip:['mkt','trial']},
  compsci:{n:'Computer Science',d:'Code, a startup idea and a demo day pitch.',cols:['eng','bus','ccm'],skip:['acct','dance']},
  forensic:{n:'Forensic Science',d:'The lab coat side of the courtroom, billed by the hour.',cols:['as','bus','law'],skip:['entr','contract']},
  marketing:{n:'Marketing',d:'Knowing what people want before they do, and writing the line that sells it.',cols:['bus','as','ccm'],skip:['geol','dance']},
  finance:{n:'Finance',d:'Numbers, risk and the fine print underneath both.',cols:['bus','eng','law'],skip:['robo','invest']},
  theatre:{n:'Musical Theatre',d:'Sing, dance, act, and sew your own costume when the budget runs out.',cols:['ccm','health','design'],skip:['aid','arch']},
  musbiz:{n:'Music Business',d:'The band is the easy part. The contract and the tour budget are the job.',cols:['ccm','as','bus'],skip:['chem','acct']},
  crimjust:{n:'Criminal Justice',d:'Police work from the inside: procedure, people and paperwork.',cols:['law','health','bus'],skip:['nutr','mkt']},
  hca:{n:'Health Care Administration',d:'Running the hospital instead of working the floor.',cols:['health','bus','law'],skip:['mkt','invest']},
  psychology:{n:'Psychology',d:'Why people do what they do, and how to stand in front of a room and explain it.',cols:['health','bus','ccm'],skip:['acct','music']},
  /* V352 eighteen more, including the School of Education (39 in all) */
  busadmin:{n:'Business Administration',d:'A little of everything a company needs, and the law that keeps it out of court.',cols:['bus','as','law'],skip:['geol','invest']},
  accounting:{n:'Accounting',d:'Somebody has to know where the money went. It pays well to be that person.',cols:['bus','eng','ccm'],skip:['robo','dance']},
  econ:{n:'Economics',d:'Why prices move and people don\'t, argued out loud.',cols:['as','bus','ccm'],skip:['mkt','dance']},
  english:{n:'English',d:'Read closely, write clearly, argue well.',cols:['as','design','law'],skip:['arch','invest']},
  history:{n:'History',d:'Old arguments, primary sources and a classroom of your own some day.',cols:['as','design','edu'],skip:['indd','coach']},
  chemistry:{n:'Chemistry',d:'The lab, the patent office or the front of a classroom. Your pick.',cols:['as','bus','edu'],skip:['mkt','coach']},
  aero:{n:'Aerospace Engineering',d:'Things that fly, and the drawings and presentations that get them funded.',cols:['eng','design','ccm'],skip:['fash','dance']},
  elec:{n:'Electrical Engineering',d:'Circuits, a product to sell and a lab section to teach.',cols:['eng','bus','edu'],skip:['mkt','child']},
  interior:{n:'Interior Design',d:'Rooms that work for the people in them, and pass inspection.',cols:['design','health','law'],skip:['nutr','trial']},
  comm:{n:'Communications',d:'Writing, speaking and making it look good on a screen.',cols:['ccm','as','design'],skip:['chem','arch']},
  film:{n:'Film',d:'Cameras, cuts and the gear that makes both possible.',cols:['ccm','eng','design'],skip:['mech','fash']},
  musicperf:{n:'Music Performance',d:'Hours in a practice room, a body that survives it, and a way to get paid.',cols:['ccm','health','bus'],skip:['anat','acct']},
  polisci:{n:'Political Science',d:'Power, history and the campaign poster.',cols:['law','as','design'],skip:['chem','fash']},
  cyber:{n:'Cybersecurity',d:'Break into systems legally, then bill for it.',cols:['law','eng','bus'],skip:['mech','mkt']},
  exsci:{n:'Exercise Science',d:'How bodies move, how gyms make money, and how to coach.',cols:['health','bus','edu'],skip:['acct','child']},
  earlyed:{n:'Early Childhood Education',d:'Small people, big feelings, and a lot of construction paper.',cols:['edu','health','design'],skip:['smed','arch']},
  seced:{n:'Secondary Education',d:'Teach a subject you love to teenagers who don\'t. Yet.',cols:['edu','as','bus'],skip:['fchem','fin']},
  physed:{n:'Physical Education',d:'A whistle, a clipboard and a gym full of kids.',cols:['edu','health','bus'],skip:['anat','acct']}};
/* majors grouped by home college, in college order */
const MAJG=COLK.map(col=>[col,Object.keys(MAJ).filter(k=>MAJ[k].cols[0]===col)]).filter(g=>g[1].length);
function mjNow(){return S.major&&MAJ[S.major]||null}
function mjList(k){const m=MAJ[k];return m.cols.map(col=>[col,COLCLS[col].filter(c=>!m.skip.includes(c))])}
function mjHas(c){const m=mjNow();return!!m&&m.cols.includes(CI[c].col)&&!m.skip.includes(c)}
function mjNeedHTML(){return S.uClasses?`<div class="mjneed"><b>You haven't declared a major.</b><span>Your major decides which three colleges you can take classes in.</span><button type="button" class="mjgo" data-mj="1">Declare a major</button></div>`:`<div class="mjneed"><b>No major yet.</b><span>The Dean will have you declare one when you meet her in Chapter 1.</span></div>`}
/* the picker: majors on the left, a live preview of the colleges and courses on the right */
function mjPick(done){const old=$('mjpick');if(old)old.remove();mode='slots';let sel=S.major&&MAJ[S.major]?S.major:MAJG[0][1][0];
  const el=document.createElement('div');el.id='mjpick';
  el.innerHTML=`<div class="mjbox" role="dialog" aria-label="Declare a major"><div class="mjhd"><b>Declare your major</b><span>${Object.keys(MAJ).length} majors · Office of the Dean of Students · Form 12-B</span></div><div class="mjbody"><div class="mjlist" role="listbox" aria-label="Majors">${MAJG.map(([col,L])=>`<div class="mjgh" style="--skc:${COLL[col].c}">${COLL[col].n}</div>`+L.map(k=>`<button type="button" class="mjopt" role="option" data-k="${k}"><b>${MAJ[k].n}</b><span>${MAJ[k].cols.slice(1).map(c=>`<i style="background:${COLL[c].c}">${COLL[c].n}</i>`).join('')}</span></button>`).join('')).join('')}</div><div class="mjprev" aria-live="polite"></div></div></div>`;
  document.body.appendChild(el);const prev=el.querySelector('.mjprev');
  const show=k=>{sel=k;const m=MAJ[k];el.querySelectorAll('.mjopt').forEach(b=>{const on=b.dataset.k===k;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
    prev.innerHTML=`<h3>${m.n}</h3><p class="mjd">${m.d}</p><div class="mjcols">${mjList(k).map(([col,L],i)=>`<div class="mjcol" style="--skc:${COLL[col].c}"><div class="mjch"><b>${COLL[col].n}</b><small>${i?L.length+' courses':'Home college · '+L.length+' courses'}</small></div><div class="mjfx"><i>${COLFX[col][0]}</i>${COLFX[col][1]}</div><ul>${L.map(c=>`<li><b>${CI[c].n}</b><small>${CI[c].bn}</small></li>`).join('')}</ul></div>`).join('')}</div><div class="mjfoot"><span>Your Skill Tree will show these three colleges. This can't be changed later.</span><button type="button" class="mjok">Declare ${m.n}</button></div>`;
    prev.querySelector('.mjok').onclick=()=>fin(k)};
  const kd=e=>{if(e.code!=='F12')e.stopPropagation()};
  const fin=k=>{removeEventListener('keydown',kd,true);el.remove();S.major=k;mode='play';sfx('lvl');big('MAJOR DECLARED',1800);toast(`${MAJ[k].n}: ${MAJ[k].cols.map(c=>COLL[c].n).join(', ')}.`,4200);try{saveGame()}catch(e){}if(done)done()};
  el.querySelectorAll('.mjopt').forEach(b=>{b.onclick=()=>show(b.dataset.k);b.onmouseenter=()=>show(b.dataset.k);b.onfocus=()=>show(b.dataset.k)});
  addEventListener('keydown',kd,true);show(sel);setTimeout(()=>{const f=el.querySelector('.mjopt.on');if(f)f.focus()},40)}
