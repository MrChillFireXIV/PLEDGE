// ================================================================ DIALOGUE WITH PEOPLE
const CHATL={legacies:["Sailing club is the only real club, honestly.","My family's had a box at the stadium since 1960.","Ever been to Nantucket? You should. Well. You could."],athletes:["Coach says I'm one sack away from a scholarship extension.","Protein, sleep, repeat. That's the whole secret.","You should try out for the line. You've got the build. Sort of."],studentgov:["We're trying to get the dining hall open past nine.","The bylaws say pledges can't be made to do anything unsafe. Nobody reads the bylaws.","I'm forming a committee to study committees."],activists:["Greek life runs this campus and nobody voted for it.","We're organizing a walkout Thursday.","Ask yourself who that tradition protects."],townies:["My dad worked the mill for thirty years. Now it's condos for professors.","College kids tip like it's 1950.","You're all right for a college boy. Maybe."],sororities:["Our gala raised eleven thousand dollars for the children's hospital.","Theta Zeta stole our formal theme. Again.","Your Big Brother is cute. Don't tell him I said that."],brothers:["Pledge, hydrate. Hell week is coming.","Grant runs a tight ship. Too tight, if you ask me.","Your dad still holds the house record for something. Nobody remembers what."],oldguard:["Fine weather for the lake.","The house was really something, back in my day."],staff:["Busy day.","Can I help you with something?"],police:["Keep your nose clean, Kowalski."],ra:["Quiet hours start at ten."],cops:["Move along."]};
const NLINE={gus:['"Thirty-one years on these grounds. I\'ve seen every prank twice."'],marisol:['"Coffee\'s bottomless. My patience isn\'t."'],priya:['"The dining hall vote is Thursday. Tell everyone."'],grant:['"Do what you\'re told and this will be the best year of your life."','"Your dad called. He asked if you\'re keeping up. Are you?"','"Alumni weekend is a big deal. Don\'t embarrass me."','"Tomorrow night. Don\'t be late."'],marcus:['"I haven\'t slept in two days. Is that normal?"','"Brett told me to stop asking about 2019. Like, angrily."','"Something is wrong with this place, Danny."','"If you walk away tomorrow, I\'ll walk with you."'],dean:['"Keep your grades up, Mr. Kowalski."','"I\'m still listening, if you have something to tell me."'],lena:['"Michael used to play guitar. He can\'t remember the chords now."','"Get me something on paper. Paper is what they\'re afraid of."'],charles:['"Big Ed\'s boy. You have his jaw. I hope you have his sense."'],brett:['"Leave me alone, pledge."','"Did you hear something? No? Good."'],tank:['"Keep your guard up, little brother."'],reese:['"Stick with me and doors open."'],owen:['"History repeats when nobody writes it down."']};
const nid=n=>Object.keys(NN).find(k=>NN[k]===n);
const spOf=n=>(n.title||CL[n.cl].n)+' · Lv '+n.lvl;
function shopList(id){return SHOP[id].filter(o=>!o[3]||(id==='hank'&&AM&&AM.m.id==='cater'&&o[0]!=='c2champ')||(o[0]==='c2champ'&&id==='hank'&&AM&&AM.m.id==='c2prep'&&C2.p&&C2.p.suit&&!C2.p.champ&&!has('c2champ'))||(id==='pawn'&&AM&&AM.m.id==='phone'&&o[0]!=='tux')||(o[0]==='tux'&&id==='pawn'&&AM&&AM.m.id==='c2prep'&&!S.c2suit))}
function nextMeet(c){for(let d=S.day;d<S.day+9;d++){if(d<2||(d-1)%7>=5)continue;for(const sl of[0,1]){const st=sl?13:9;if(d===S.day&&S.gt>st+.5)continue;if(clsOf(d,sl)===c)return`${DAYN[(d-1)%7]} at ${fmtH(st)}`}}return'next week'}
const TRADE={townies:[['bandage',6],['stink',9],['tip',3]],athletes:[['drink',4],['burger',5],['tip',4]],studentgov:[['notes',6],['hallpass',10]],activists:[['tip',3],['bandage',6]],sororities:[['drink',4],['burger',5],['notes',7]],legacies:[['notes',12],['hallpass',15],['drink',6]],brothers:[['burger',5],['drink',4],['stink',10]],oldguard:[['hallpass',20]]};
const SVC={notes:'Class notes (your next class goes easier)',hallpass:'Forged hall pass (clears your trouble)',tip:'A tip on a yearbook photo spot'};
const IVAL={bandage:7,drink:5,burger:6,stink:10};
function tradePrice(n,base){const fr=relPeek(n)>=30?.9:1;base*=fr;const r=S.rep[n.cl];let p=base*(1-disc());if(r!=null&&r>=50)p*=.85;else if(r!=null&&r>=25)p*=.92;return Math.max(1,Math.round(p))}
const DLG={
 follow:['"Want to roll with me for a while?"','"Come on, let\'s go. You\'re with me."'],dismiss:['"Thanks for having my back. Catch you later."','"You can head out. I\'ve got it from here."'],
 chat:{_:['"How\'s your semester going?"','"Crazy week, huh?"','"Heard anything good lately?"','"What\'s the best food around here?"'],athletes:['"Big game coming up?"','"How much can you bench, honestly?"'],townies:['"How long have you lived in Harrowgate?"','"Is the Anchor any good?"'],sororities:['"How\'s rush going at your house?"','"What\'s the theme for formal?"'],studentgov:['"What\'s Student Government working on?"','"Is the dining hall vote happening?"'],activists:['"What are you protesting this week?"','"Got a petition I can sign?"'],legacies:['"Nice boat shoes. Sailing team?"','"Is it true your family has a lake house?"'],brothers:['"Any house news?"','"What\'s Grant so stressed about?"'],staff:['"Busy day?"','"How long have you worked here?"'],oldguard:['"Were you in the house back in the day?"']},
 comp:['"Nice jacket. Seriously."','"Love the haircut."','"You\'re way cooler than people say."','"I can tell you\'ve got great taste in music."','"Everyone says you\'re the smartest one here."'],
 insult:['"You look like a dork."','"Did your mom pick out that outfit?"','"You smell like the dining hall."','"I\'ve met smarter traffic cones."','"Nice shoes. Did they come with a clown nose?"'],
 fight:['"Put \'em up, tough guy."','"You and me. Right now."','"Swing first. I dare you."','"Let\'s settle this."'],
 trade:['"Got anything to sell?"','"Want to make a deal?"','"What\'s in your pockets? I\'m buying."'],
 task:['"You wanted to see me?"','"What do you need from me?"','"I\'m here about that thing."'],
 bb:['"Any advice for me?"','"How do I survive this place?"'],
 y19:['"What happened in 2019?"','"Why is the 2019 composite missing?"'],
 notes:['"How\'s pledging treating you?"','"Did they make you do anything weird today?"'],
 sorry:['"Sorry, officer. It won\'t happen again."','"My bad. Honest mistake."'],
 rules:['"What are the rules around here?"','"When\'s curfew again?"'],
 back:['"Actually, let\'s just talk."','"Never mind the deal."']};
const CHT_={_:[
 ['How\'s your semester going?','Honestly? Best one yet. Thanks for asking.','It\'s fine. Midterms are coming.','Why do you care?'],
 ['Crazy week, huh?','Tell me about it! I haven\'t slept since Sunday.','Every week\'s crazy here.','Not really.'],
 ['Heard anything good lately?','Somebody put a canoe on top of Van Wormer Hall last night. Legendary.','Not really. Same old stuff.','Nothing I\'d tell you.'],
 ['What\'s the best food around here?','Ruby\'s. Get the pie. Trust me.','The dining hall, I guess. If you\'re desperate.','Figure it out yourself.'],
 ['What are you majoring in?','Psych! I love it. Ask me anything about your childhood.','Undeclared. Still figuring it out.','Does it matter?'],
 ['Doing anything this weekend?','There\'s a bonfire by the lake Saturday. You should come!','Probably sleeping.','Not with you.'],
 ['Did you see the game last week?','That last-second field goal? I screamed.','I caught the end of it.','I don\'t watch sports.'],
 ['Where are you from originally?','Small town in Maine. You\'d love it.','Around. Nowhere special.','Somewhere far from here, hopefully soon.'],
 ['Got any tips for surviving midterms?','Library basement, headphones, coffee from Ruby\'s. Works every time.','Study, I guess.','Don\'t fail.'],
 ['Weather\'s nice today.','Right? Perfect day to skip class on the quad.','Sure.','Riveting conversation, Danny.'],
 ['What do you think of Professor Okafor?','She\'s tough, but she\'s the best teacher here.','She\'s fine.','Don\'t ask me about professors.'],
 ['Seen any good movies lately?','Film society\'s showing old horror movies Friday. Come!','Not really.','I don\'t have time for movies.'],
 ['Any good music recommendations?','Mill Street Band. Local guys. They play the Anchor on Thursdays.','I just listen to whatever\'s on.','Not for you.'],
 ['What\'s the strangest thing you\'ve seen on campus?','A goose chasing the Dean across the quad. Best day of my life.','Nothing too weird.','You, right now.'],
 ['How do you deal with all the stress here?','Long walks around the lake. Clears my head.','I don\'t, really.','By avoiding people like you.'],
 ['Do you know any good study spots?','Third floor of the library, by the windows. Nobody goes up there.','The library, I guess.','Not telling.']],
 athletes:[['Big game coming up?','Saturday! We\'re going to crush Dartmore.','Yeah. Coach is stressed.','Like you\'d show up.'],['How much can you bench, honestly?','Two-twenty-five for reps. Want to spot me sometime?','Enough.','More than you.'],['What\'s Coach like?','Loud. But he\'d take a bullet for us.','Intense.','Ask him yourself.']],
 townies:[['How long have you lived in Harrowgate?','My whole life. Three generations at the mill.','Long enough.','Longer than you\'ll ever be here, college boy.'],['Is the Anchor any good?','Best burger in town, and Lou\'s a legend.','It\'s a bar.','Not for you it isn\'t.'],['What was the mill like?','Loud, hot, honest work. I miss it.','Closed now.','Don\'t pretend you care.']],
 sororities:[['How\'s rush going at your house?','So good! Best pledge class in years.','Busy.','Like I\'d tell a frat boy.'],['What\'s the theme for formal?','Masquerade! It\'s going to be gorgeous.','It\'s a secret.','You\'re not invited.'],['Who\'s the best house on the row?','Mine, obviously. Yours isn\'t terrible.','Depends who you ask.','Not yours.']],
 studentgov:[['What\'s Student Government working on?','Longer dining hall hours! Finally!','Budget stuff.','Things above your pay grade.'],['Is the dining hall vote happening?','Thursday! Tell everyone you know!','Allegedly.','Read the bulletin board.'],['How do I get involved?','Come to the meeting Tuesday! We need people.','There\'s a sign-up sheet somewhere.','You don\'t.']],
 activists:[['What are you protesting this week?','The endowment\'s fossil fuel investments. Want a sign?','Something important.','You, maybe.'],['Got a petition I can sign?','Yes! Thank you! Right here.','Later, maybe.','Pass.'],['Should the frats be shut down?','Some of them. Yours might surprise me.','It\'s complicated.','Yes. Starting with yours.']],
 legacies:[['Nice boat shoes. Sailing team?','Captain, actually. You should crew sometime.','Something like that.','These cost more than your tuition.'],['Is it true your family has a lake house?','Three, actually. Come up sometime.','We have a few properties.','Not that you\'d be allowed in.'],['What\'s the deal with Kappa Theta Omega?','Best house on the row. Our parties are unmatched.','We do fine.','Exclusive. That\'s the deal.']],
 brothers:[['Any house news?','Grant\'s ordering pizza for the whole house tonight!','Nothing new.','Pledges don\'t get house news.'],['What\'s Grant so stressed about?','Alumni weekend. Between us, his dad\'s a nightmare.','President stuff.','None of your business, pledge.'],['What was your pledge semester like?','Brutal. Best time of my life. You\'ll see.','Long.','Worse than yours. Stop whining.']],
 staff:[['Busy day?','Busiest of the week, but it\'s nice to be asked.','Always.','Too busy to chat.'],['How long have you worked here?','Twenty-two years. I\'ve seen a lot of kids like you go on to great things.','A while.','Too long.']],
 oldguard:[['Were you in the house back in the day?','Class of \'88. Best years of my life.','Long time ago.','That\'s not your concern, son.']]};
const COMP_=[['Nice jacket. Seriously.','Thanks! Thrift store downtown, believe it or not.','Thanks, I guess.','This old thing? Are you making fun of me?'],
 ['Love the haircut.','Oh, thanks! I was nervous about it.','It\'s just a haircut.','I didn\'t get a haircut.'],
 ['You\'re way cooler than people say.','Ha! I\'ll take it.','What do people say?','What do people say about me?!'],
 ['I can tell you\'ve got great taste in music.','Finally, someone gets it.','How can you tell?','You don\'t know anything about me.'],
 ['Everyone says you\'re the smartest one here.','Aw. That\'s really nice to hear.','Who\'s everyone?','Is that supposed to be a joke?'],
 ['You\'ve got a great laugh.','Ha! Stop, you\'re making me do it again.','Okay?','When have you even heard me laugh?'],
 ['You\'re honestly one of the nicest people here.','That made my whole day, Danny.','That\'s nice of you.','Nice try. What do you want?']];
const FLIRT_=[['Has anyone told you your smile could light up the quad?','Smooth, Kowalski. Very smooth.','That\'s a new one.','Ew. Hard pass.'],
 ['If you were a class, I\'d never skip you.','Okay, that\'s actually cute.','Did you rehearse that?','Please never say that again.'],
 ['Save me a dance at your formal?','Maybe. If you lose the propeller hat.','We\'ll see.','I\'d rather dance with Grant.'],
 ['You must be the reason the library\'s always full.','Stop. You\'re making me blush.','...What?','That doesn\'t even make sense.'],
 ['I\'d pledge your house just to see you every day.','You\'d look cute in our letters.','Our house doesn\'t take guys.','Our house doesn\'t take creeps either.'],
 ['Want to grab a coffee at Ruby\'s sometime?','I\'d like that. You\'re buying.','Maybe sometime.','I\'m busy. Forever.']];
const INS_=[['You look like a dork.','Says the guy in a propeller hat.','Ha! Takes one to know one.'],
 ['Did your mom pick out that outfit?','At least my mom loves me. What\'s your excuse?','She did, and she has great taste, thank you.'],
 ['You smell like the dining hall.','And you smell like desperation.','Mystery Meat Monday. Worth it.'],
 ['I\'ve met smarter traffic cones.','Did one of them teach you to talk?','Wow. Okay. I\'ll remember that one.'],
 ['Nice shoes. Did they come with a clown nose?','You\'re one to talk, pledge.','They did. I\'m saving it for formal.'],
 ['Is your face always like that, or just today?','Get out of my face, Kowalski.','Only for you, buddy.'],
 ['You\'re about as fun as a pop quiz.','And you\'re about as smart as one answered wrong.','Ouch. Fair, though.']];
const isFlirt=n=>n.cl==='sororities'&&n.fem&&!n.kid;
const HKCHAT=[['Any advice before you head to college?','"Honestly? Take the co-op. And sleep. Everybody says sleep."','"Sure, whatever. Do your homework, I guess."'],
 ['What\'s the best thing about Hughes?','"The tower! You can see the whole city from up there. Allegedly. Nobody\'s allowed up."','"The tower, I guess. It\'s old."'],
 ['Heard about the gargoyles on the building?','"Every one is a school subject! The one with the flask is chemistry. The one with the ball is gym. Mr. Dale says there\'s one for every class."','"They\'re creepy. I don\'t look at them."'],
 ['What do you want to study in college?','"Engineering at UC. Co-op, internships, the whole thing. I have a plan."','"No idea. Something with money."']];
function talkOdds(n){return prOdds(n)+relBias(n)+S.grades.speech*.05-Math.max(0,n.lvl-S.lvl)*.08}
const say=(k,cl)=>{const d=DLG[k];return Array.isArray(d)?pick(d):pick((d[cl]||[]).concat(d._))};
const ln=s=>s.charAt(0).toLowerCase()+s.slice(1);
function tradeWith(n){const r=S.rep[n.cl],ch=[];
  if(r!=null&&r<=-25){talkTo(n,'"Trade with you? I\'d rather eat my own shoe."');return}
  n.stock=n.stock&&n.stockDay===S.day?n.stock:TRADE[n.cl].map(t=>t.slice());n.stockDay=S.day;
  for(const t of n.stock){const[k,base]=t;const pr=tradePrice(n,base);const lineB=ITM[k]?`"I'll take the ${ITM[k].n.toLowerCase()}." (${money$(pr)})`:k==='notes'?`"Can I buy your class notes?" (${money$(pr)})`:k==='hallpass'?`"I hear you can get me a hall pass." (${money$(pr)})`:`"Know any good photo spots?" (${money$(pr)})`;
    ch.push([lineB,()=>{if(S.money>=pr&&rnd()<.5)relAdd(n,1);if(S.money<pr){sfx('bad');return talkTo(n,'"Come back when you\'ve got the cash."')}if(ITM[k]){if(!invAdd(k))return tradeWith(n)}else if(k==='notes'){S.studied=1}else if(k==='hallpass'){S.trouble=0;NP.forEach(m=>m.chase=0)}else if(k==='tip'){const ps=PHOTOS.filter(p=>!S.photos[p[0]]&&(p[0]!=='dock'&&p[0]!=='lodge'||S.ch>=3));if(!ps.length){return talkTo(n,'"You\'ve already shot everything worth shooting."')}const mp=mapPos(),p=ps.sort((a,b)=>Math.hypot(a[2]-mp[0],a[3]-mp[1])-Math.hypot(b[2]-mp[0],b[3]-mp[1]))[0];S.tips=S.tips||{};S.tips[p[0]]=1;toast(`Photo spot marked on your map: ${p[1]}.`,4500)}money(-pr);n.stock.splice(n.stock.indexOf(t),1);if(S.rep[n.cl]!=null)rep(n.cl,1);tradeWith(n)},'','buy'])}
  const sold=new Set();S.inv.forEach(k=>{if(k&&!sold.has(k)&&IVAL[k]){sold.add(k);const pay=Math.max(1,Math.round(IVAL[k]*.6*(r!=null&&r>=50?1.2:1)));ch.push([`"Want to buy my ${ITM[k].n.toLowerCase()}?" (+${money$(pay)})`,()=>{useInv(k,true);money(pay);tradeWith(n)},'','sell'])}});
  if(!ch.length)ch.push(['"Sold out already?"',null,'Come back tomorrow.']);
  ch.push([say('back'),()=>talkTo(n),'','chat']);ch.push(['Leave',null,'','leave']);
  card({title:n.name+' · Trade',sp:`${spOf(n)} · You have ${money$(S.money)}`,text:r!=null&&r>=50?'"For you? Friend prices."':'"Cash only. What do you need?"',ch,focus:n,wheel:1})}
function talkTo(n,line){if(!n||n.down)return;const id=nid(n),C=CL[n.cl],r=S.rep[n.cl],ch=[],role=n.role||'',first=(n.name.split(' ')[0]);
  const reply=(t,fx)=>()=>{fx&&fx();if(n.nick)t=t.replace(/\bDanny\b|\bKowalski\b/g,n.nick);if(!n.down&&!n.aggro)talkTo(n,t)};
  let g;if(line)g=line;else if(id&&NLINE[id])g=NLINE[id][Math.min(NLINE[id].length-1,S.ch-1)];else if(n.greet)g=n.greet;else if(n.auth)g=S.trouble>0?'"I\'ve got my eye on you, Kowalski."':'"'+npcCyc(n,'t',C.say)+'"';else if(r!=null&&r<=-25)g='"'+npcCyc(n,'h',C.taunt)+'"';else if(r!=null&&r>=50)g='"'+npcCyc(n,'f',NPCX_FR)+'"';else if(n.nick&&rnd()<.6)g=npcCyc(n,'n',[`"What\'s up, ${n.nick}?"`,`"${n.nick}! My guy!"`,`"Yo, ${n.nick}. Where you been?"`,`"Look who it is. ${n.nick}!"`]);else if(relPeek(n)>=60)g='"'+npcCyc(n,'w',NPCX_WARM)+'"';else if(relPeek(n)<=-40)g='"'+npcCyc(n,'x',NPCX_HOT)+'"';else if(n.pledge)g='"'+npcCyc(n,'p',NPCX_PL)+'"';else g='"'+npcCyc(n,'t',c1Lines(n,n.lines||(C.say&&C.say.length?C.say:['Hey.'])))+'"';g=c1Voc(g);
  try{c1Talk(n,ch,reply)}catch(e){console.warn('c1Talk',e)}
  try{turfTalk(n,ch,reply)}catch(e){console.warn('turfTalk',e)}
  for(const m of availM())if(mWho(m)===id&&!C1PEND.has(m.id))ch.push([`${say('task')} (${m.name.replace(/^Side: /,'')})`,()=>tryStart(m),'','task']);
  if(n.shop){for(const o of shopList(n.shop)){let pr=priceOf(o[2]);if(n.shop==='hank'&&o[3]&&S.hankDeal)pr=Math.round(pr*.9*100)/100;const nm=o[1].replace(/ \(.*\)$/,'').toLowerCase();ch.push([`"I'll take a ${nm}." (${pr?money$(pr):'house account'}${pr&&o[3]&&S.budget&&o[0]!=='tux'?', house money':''})`,()=>{buy(n.shop,o);talkTo(n)},o[3]&&has(o[0])?'Already bought':'','buy'])}
    if(n.shop==='hank'&&AM&&AM.m.id==='cater'&&!S.hankDeal)ch.push(['"Come on, Hank. Ten percent off the party stuff?"',()=>{S.hankTry=S.day;if(S.grades.econ>=1||S.grades.speech>=1||rnd()<.5){S.hankDeal=1;reply('Hank sighs. "Fine. Ten percent off the party stuff."')()}else reply('"Price is the price, kid."')()},S.hankTry===S.day?'He already said no today':'','chat'])}
  if(role.startsWith('prof:')){const c=role.slice(5);ch.push(['"When does class meet next?"',reply(`"${CI[c].n} meets next on ${nextMeet(c)}. You have ${S.grades[c]} of 3 stars. ${S.grades[c]>=3?'You\'ve aced it.':'Next star unlocks: '+CI[c].perk[S.grades[c]]}"`),'','chat']);ch.push(['"Could you go over that last lecture again?"',()=>{if(S.daily['help'+c]===S.day)return reply('"Once a day, Mr. Kowalski. I have office hours, not a lifetime."')();S.daily['help'+c]=S.day;S.studied=1;reply('"Look at it this way..." Twenty minutes later, it clicks. Your next class will go easier.')()},'','chat'])}
  if(role==='coach')ch.push(['"Put me in, Coach."',()=>{if(!inWin(S.gt,[8,21]))return reply('"Field\'s closed. Come back in the morning."')();startEvent('football',w=>sideResult('football',w))},'','task']);
  if(role==='sergeant')ch.push([`"I'd like to pay my fine." (${money$(15)})`,()=>{if(S.money<15)return reply('"Fifteen bucks. You don\'t have fifteen bucks."')();money(-15);S.trouble=0;NP.forEach(m=>m.chase=0);reply('"Paid in full. Your record\'s clean. For now."')()},S.trouble>0?'':"You're not in trouble.",'buy']);
  if(role==='editor')ch.push(['"Can I see today\'s paper?"',()=>card({title:'The Harrowgate Herald',text:paper()}),'','chat']);
  if(role==='secretary')ch.push(['"Anything new on the bulletin board?"',()=>card({title:'Bulletin Board',text:board()}),'','chat']);
  if(role==='librarian')ch.push(['"Where do you keep the old composites?"',reply(S.ch>=2?'"The pledge composites? Someone from Alpha Sigma Rho checked out 2019 years ago. Never brought it back. I still send letters."':'"Microfilm in the back, composites in the archive room. Gloves, please."'),'','chat']);
  if(role==='attendant')ch.push([`"One kart race, please." (${money$(10)})`,()=>{if(S.money<10)return reply('"Ten bucks, pal."')();money(-10);startEvent('kart',w=>sideResult('kart',w))},'','buy']);
  if(n.kid){/* V122: the Hughes kids just chat: no trades, insults, flirting, fights or followers */
    const T_=pick(HKCHAT);ch.push(['"'+T_[0]+'"',()=>{const b=talkOdds(n),v=wpick([0,1,2],[1,.8+b,.3+b]);relAdd(n,v);reply('"'+(v>0?T_[1]:T_[2])+'"')()},'','chat']);
    ch.push(['"Shouldn\'t you be in class?"',reply(pick(['"It\'s a free period! ...Probably."','"Lunch. We have lunch. Like, a long one."','"Says the guy hanging around a high school."'])),'','chat'])}
  else if(!n.shop&&!role){
    {const pool=(CHT_[n.cl]||[]).concat(CHT_._),T_=pick(pool);ch.push(['"'+T_[0]+'"',()=>{const b=talkOdds(n);const v=wpick([-1,0,1,2],[1.3-1.1*b,1,.5+b,.2+1.6*b]);relAdd(n,v);const fst=n.talkDay!==S.day;n.talkDay=S.day;
      let t='"'+(v<0?T_[3]:v===0?T_[2]:T_[1])+'"';if(v===2)t+=pick([' Ha! You\'re all right, Danny.',' I like talking to you, honestly.',' We should hang out more.']);
      if(fst&&r!=null&&v>0){rep(n.cl,1+S.grades.speech);}if(fst&&n.cl==='brothers'&&v>0)stand(1);reply(t)()},'','chat'])}
    if(!n.auth&&TRADE[n.cl])ch.push([say('trade'),()=>tradeWith(n),'','trade']);
    if(!n.auth&&!n.temp){const rv=relPeek(n),fc=NP.filter(m=>m.follow).length;if(n.follow)ch.push([say('dismiss'),()=>{n.follow=0;if(n.named)n.leaveT=4;n.zone=zoneAt(n.x,n.z);n.path=null;n.wait=1;bubble(n,'Anytime, '+(n.nick||'Danny')+'.',2);toast(n.name+' heads off.')},'','follow']);
      else if(rv>=60)ch.push([say('follow'),()=>{n.follow=1;if(n.homeInt===undefined)n.homeInt=n.int||null;n.path=null;n.aggro=0;bubble(n,pick(['Let\'s do this.','I\'ve got your back.','Lead the way.']),2);toast(n.name+' is following you. They\'ll jump into your fights.',3500)},n.lvl<S.lvl?`They need to be at least Lv ${S.lvl}.`:fc>=FOLMAX?'You already have '+FOLMAX+' people with you.':'','follow'])}
    {const rc=typeof c3RecruitChoice==='function'?c3RecruitChoice(n):null;if(rc)ch.push(rc)}
    if(id&&id===S.bb)ch.push([say('bb'),reply(bbTip()),'','chat']);
    if(id&&BBP[id]&&n.cl==='brothers'&&!n.pledge&&!n.pclass&&S.pledged&&!S.bb)ch.push(['"Would you be my Big Brother?"',()=>card({title:'Big Brother',sp:n.name,text:BBP[id][0]+'\n\n'+BBP[id][1]+'\n\nYou only get one Big Brother, and it is permanent.',focus:n,ch:[['Make it official: '+BBN[id][0]+' is my Big Brother',()=>setBB(id)],['Let me think about it',null]]}),'','chat']);
    if(n.cl==='brothers'&&!id&&!n.pledge&&S.ch>=2)ch.push([say('y19'),reply(pick(['"Who told you about that?" He looks over his shoulder. "Drop it, pledge."','"Before my time." He won\'t look at you.','"Some kid slipped at the lake. That\'s all I know. That\'s all anybody knows."'])),'','chat']);
    if(n.pclass&&S.pledged){ch.push(['"What\'s your pledge job again?"',reply('"'+PROLE[n.prole][0]+'. '+PROLE[n.prole][1]+'"'),'','chat']);if(n.prole==='snack')ch.push(['"Can I grab a snack?"',()=>{if(S.daily.snack===S.day)return reply('"Tray\'s empty, man. Tomorrow."')();S.daily.snack=S.day;S.hp=Math.min(S.mhp,S.hp+25);reply('"Here, take the gummy worms. Don\'t tell the brothers." (+25 health)')()},'','chat']);if(n.prole==='scribe')ch.push(['"Can I see your notes?"',()=>{if(S.daily.scribe===S.day)return reply('"I already showed you today. Brothers are watching."')();S.daily.scribe=S.day;S.studied=1;reply('"Page forty-one. Your next class just got easier."')()},'','chat']);if(n.prole==='weather')ch.push(['"Give me a weather update."',reply('"'+weatherLine()+'"'),'','chat']);if(n.prole==='captain')ch.push(['"How\'s the pledge class doing?"',reply(`"Class Spirit is at ${S.spirit} out of 100. ${S.spirit>=70?'We are a machine.':S.spirit>=40?'We\'re holding it together.':'We are falling apart, Kowalski.'} Roll call is at six. Every night."`),'','chat'])}
    if(n.hpr&&typeof HPR!=='undefined'&&HPR[n.hpr])ch.push(['"What\'s your pledge job?"',reply('"'+HPR[n.hpr].n+'. '+HPR[n.hpr].d+'"'),'','chat']);
    if(n.pledge||n.pclass)ch.push([say('notes'),reply(pick(['"Brett made me iron his socks. Socks, Danny."','"I failed my econ quiz because I was fetching sandwiches at 3 AM."','"Grant keeps saying the Lantern Walk will make us. Make us what?"','"At least the hat keeps the sun off."'])),'','chat']);
    if(n.auth){if(S.trouble>0)ch.push([say('sorry'),()=>{if(rnd()<.3+.2*S.grades.speech){S.trouble=0;NP.forEach(m=>m.chase=0);reply('"...Fine. Just this once."')()}else reply('"Save it for the Dean."')()},'','comp']);ch.push([say('rules'),reply('"Class at nine and one on weekdays. Curfew at eleven: be on Greek Row or inside a building. Fight in front of me and you\'re going to Van Wormer."'),'','chat'])}
    else{{const fl=isFlirt(n),Cm=pick(fl?FLIRT_:COMP_);ch.push(['"'+Cm[0]+'"',()=>{const b=talkOdds(n);const v=clamp(Math.round(rnd()*7-3.5+(b-.5)*6),-5,5);relAdd(n,v);if(r!=null&&v!==0)rep(n.cl,v>0?2:-1);
      reply('"'+(v>=2?Cm[1]:v>=-1?Cm[2]:Cm[3])+'"')()},'',fl?'flirt':'comp'])}
      {const In=pick(INS_);ch.push(['"'+In[0]+'"',()=>{const rv=relOf(n),v=rv>=85?Math.floor(rnd()*3)-1:rv>=60?Math.floor(rnd()*5)-3:-5;relAdd(n,v);if(v<0&&n.cl==='brothers')stand(-1);
      reply('"'+(v>=0?In[2]:In[1])+'"')()},'','insult'])}
      ch.push([say('fight'),()=>{relAdd(n,-15);n.aggro=1;n.tgt='P';bubble(n,pick(C.taunt||['Bring it.']),2)},'','fight'])}}
  prTalkOpts(n,ch,reply);{const tr=ch.filter(c=>c[3]==='trade');for(const c of tr)ch.splice(ch.indexOf(c),1);ch.push(...tr)}
  ch.push(['Leave',null,'','leave']);sfx('ui');card({title:n.name,sp:spOf(n),text:g,ch,focus:n,wheel:1})}

// ================================================================ SCENES (dialogue played out in the world)
let SCENE=null,EAVES=0;   // V174 EAVES: an overheard conversation, so the speech box must not turn the speaker to Danny or reframe the camera
const SPK={'Gus Pappas':'gus','Marisol Vega':'marisol','Priya Nair':'priya','Grant Ashby':'grant','Tank Hale':'tank','Reese Whitford':'reese','Owen Park':'owen','Brett Calloway':'brett','Dean Margaret Halvorsen':'dean','Lena Reyes':'lena'};
const ACT={'Madison':['sororities',{fem:true,name:'Madison',title:'Delta Lambda Phi'}],'Kayla':['sororities',{fem:true,name:'Kayla',title:'Theta Zeta'}],'Earl, at the pool table':['townies',{name:'Earl',title:'Regular',lvl:6}],'A trustee in a seersucker jacket':['legacies',{name:'Trustee Pell',title:'Board of Trustees',shirt:0xd8d2b8,sleeve:0xd8d2b8,lvl:5}]};
function sceneActor(sp){if(!sp)return null;const nm=sp.split(' · ')[0];{const k=c4Cast(nm);if(k)return k}/* V128 chapter 4 cast members stand where the scene put them */const id=SPK[nm];let def=null;
  if(id){const n=NN[id];if(n&&!n.hidden&&!n.down&&(n.int||null)===(P.inside||null)&&Math.hypot(n.x-P.x,n.z-P.z)<12)return n;const d=NAMED.find(d=>d.id===id);if(!d)return null;def=[d.cl,{name:d.name,title:d.title,lvl:d.lvl,shirt:d.shirt,sleeve:d.sleeve,pants:d.pants,hair:d.hair,skin:d.skin,fem:!!d.fem,scale:d.scale,prop:d.prop}]}else def=ACT[nm];
  if(!def)return null;if(AM){AM.actors=AM.actors||{};const ex=AM.actors[nm];if(ex&&NP.includes(ex))return ex}
  let x=P.x,z=P.z+1.9;/* V270 a free spot that isn't the throne dais (an actor there sinks into it) and isn't already taken by another speaker */
  {const I=P.inside&&INT[P.inside],bad=(tx,tz)=>{if(!freeAt(tx,tz,.35))return 1;if(P.inside==='asr'&&I){const dx=tx-I.x0,dz=tz-I.z0;if(dx>19.2&&dx<28.8&&dz>.2&&dz<5.2)return 1}return NP.some(m=>!m.down&&!m.hidden&&(m.int||null)===(P.inside||null)&&Math.hypot(m.x-tx,m.z-tz)<1.1)};
  find:for(const r of[1.9,2.6,3.3,4.2])for(const da of[0,.6,-.6,1.2,-1.2,1.8,-1.8,PI]){const a=P.face+da,tx=P.x+Math.sin(a)*r,tz=P.z+Math.cos(a)*r;if(!bad(tx,tz)){x=tx;z=tz;break find}}}
  const n=spawn(def[0],P.inside||'greek',Object.assign({},def[1],{x,z,temp:1,mode:'idle',actor:1,int:P.inside}));n.hx=x;n.hz=z;if(AM){AM.actors[nm]=n;AM.temps.push(n)}return n}
function clearActors(){if(AM&&AM.actors){for(const k in AM.actors){const a=AM.actors[k];despawn(a);AM.temps=AM.temps.filter(n=>n!==a)}AM.actors={}}}
function endScene(){SCENE=null;$('card').classList.remove('scene');document.body.classList.remove('cine')}
function clearLine(x0,z0,x1,z1,y){const d=Math.hypot(x1-x0,z1-z0)||1;for(let t=0;t<=d;t+=.3)if(hAt(x0+(x1-x0)*t/d,z0+(z1-z0)*t/d)>y-.2)return false;return true}
const _cv=new THREE.Vector3();
// a camera spot is good if it isn't inside a wall/building, isn't inside a tree canopy, and can see both people
function camSpotOK(mx,mz,x,z,n){if(hAt(x,z)>1.5)return false;for(const[ox,oz]of[[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]])if(hAt(x+ox*1.1,z+oz*1.1)>1.5)return false;if(!clearLine(mx,mz,x,z,2.2))return false;if(!clearLine(P.x,P.z,x,z,1.9))return false;if(n&&!clearLine(n.x,n.z,x,z,1.9))return false;if(P.inside)return true;
  for(const[tx,tz,s]of TREES){const r=2.9*s;if(Math.abs(tx-x)>r+8&&Math.abs(tz-z)>r+8)continue;if((tx-x)**2+(tz-z)**2<r*r)return false;const vx=x-mx,vz=z-mz,L=vx*vx+vz*vz||1;const t=clamp(((tx-mx)*vx+(tz-mz)*vz)/L,0,1);const px=mx+vx*t,pz=mz+vz*t;if((tx-px)**2+(tz-pz)**2<(2.2*s)**2&&t>.25)return false}return true}
// does any bystander stand between the camera and a person's upper body?
function camBlockers(cx,cz,n,out){let c=0;const tg=[[P.x,P.z,n],[n.x,n.z,null]];for(const[tx,tz,self]of tg){const vx=tx-cx,vz=tz-cz,L=Math.hypot(vx,vz)||1;
  const cand=NP.filter(o=>o!==n&&!o.hidden&&!o.down&&(o.int||null)===(P.inside||null)&&Math.abs(o.x-cx)<L+2&&Math.abs(o.z-cz)<L+2);if(self)cand.push(self);else cand.push({x:P.x,z:P.z,isP:1});
  for(const o of cand){if(o.x===tx&&o.z===tz)continue;const t=((o.x-cx)*vx+(o.z-cz)*vz)/L;if(t<.2||t>L-.3)continue;const px=cx+vx*t/L,pz=cz+vz*t/L;if(Math.hypot(o.x-px,o.z-pz)<.62){c++;if(out&&!o.isP&&o!==n&&!out.includes(o))out.push(o)}}
    if(!out&&!P.inside)for(const[lx,lz]of LAMPS){if(Math.abs(lx-cx)>L+1||Math.abs(lz-cz)>L+1)continue;const t=((lx-cx)*vx+(lz-cz)*vz)/L;if(t<.3||t>L-.2)continue;if(Math.hypot(lx-cx-vx*t/L,lz-cz-vz*t/L)<.45)c++}}return c}
let BAND=[0,1],BANDT=0;function freeBand(){if((BANDT-=1)>0)return BAND;BANDT=8;const H=innerHeight||1;let t=0,b=H;for(const id of['wbal','wpills','card']){const e=$(id);if(!e)continue;const el=id==='card'?e.querySelector('.paper'):e;if(!el)continue;if(id!=='card'&&$('wheel').hidden)continue;if(id==='card'&&e.hidden)continue;const r=el.getBoundingClientRect();if(!r.height)continue;if(r.top<H*.4)t=Math.max(t,r.bottom);else if(r.bottom>H*.6)b=Math.min(b,r.top)}
  if(b-t<H*.3){t=0;b=H}BAND=[t/H,b/H];return BAND}
function sceneBand(){const k=Math.round(P.x*2)+','+Math.round(P.z*2)+','+Math.round(SCENE.n.x*2)+','+Math.round(SCENE.n.z*2)+','+mode;if(SCENE.bd&&SCENE.bk===k)return SCENE.bd;BANDT=0;SCENE.bd=freeBand().slice();SCENE.bk=k;return SCENE.bd}
function sceneCam(dt){const n=SCENE.n;let dx=n.x-P.x,dz=n.z-P.z;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;P.face=Math.atan2(dx,dz);{const ft=n.faceTo&&NP.includes(n.faceTo)&&!n.faceTo.down?n.faceTo:null;n.a=ft?Math.atan2(ft.x-n.x,ft.z-n.z):Math.atan2(-dx,-dz)}
  const mx=(P.x+n.x)/2,mz=(P.z+n.z)/2,chest=n.tall?1.6:1.32,bd=sceneBand(),yT=1-2*bd[0]-.06,yB=1-2*bd[1]+.04,tv=Math.tan(cam.fov*PI/360),hTop=n.tall?3.2:2.6,hBot=n.tall?.25:.95,ym=(hTop+hBot)/2;
  const key=Math.round(P.x*2)+','+Math.round(P.z*2)+','+Math.round(n.x*2)+','+Math.round(n.z*2)+','+(P.inside||'')+','+Math.round(bd[0]*20)+','+Math.round(bd[1]*20);let c;
  if(SCENE.ck===key&&SCENE.cc)c=SCENE.cc;else{
    // frame both upper bodies: distance from horizontal field of view, then search a ring of angles for a clear spot
    const th=Math.tan(cam.fov*PI/360)*cam.aspect,hh=Math.atan(th)*.82,Dmin=Math.max(2.3,(l/2+.55)/(th*.8),(hTop-hBot)*1.08/(tv*(yT-yB)))*(n.tall&&!P.inside?1.18:1);let best=null,bs=1e9;
    for(const sd of[1,-1])for(const deg of[15,0,30,-15,45,60,-30,75]){const r=deg*PI/180*sd,px=-dz*sd,pz=dx*sd;
      // rotate the perpendicular toward Danny's back (positive deg) so the speaker faces the lens
      const ux=px*Math.cos(r)-dx*Math.sin(r)*sd,uz=pz*Math.cos(r)-dz*Math.sin(r)*sd;
      for(const k of[1.1,1.3,1,1.6,2,.85,.7]){const D=Dmin*k;if(P.inside&&D>Dmin*1.6)continue;const x=mx+ux*D,z=mz+uz*D;if(!camSpotOK(mx,mz,x,z,n))continue;
        const va=Math.atan2(mx-x,mz-z);let fit=0;for(const[tx,tz]of[[P.x,P.z],[n.x,n.z]]){let q=Math.atan2(tx-x,tz-z)-va;q=Math.atan2(Math.sin(q),Math.cos(q));if(Math.abs(q)>hh)fit++}
        const sc_=camBlockers(x,z,n)*60+fit*90+Math.abs(deg-15)*.35+Math.abs(k-1.2)*6+(k<1?(1-k)*80:0)+(sd<0?1:0);if(sc_<bs){bs=sc_;best=[x,z]}if(bs<3)break}if(bs<3)break}
    c=best;if(!c){let up=null;for(const sg of[1,-1]){const q=[P.x-dx*1.9-dz*sg*.9,P.z-dz*1.9+dx*sg*.9];if(hAt(q[0],q[1])<1.5&&!TREES.some(([tx,tz,s2])=>(tx-q[0])**2+(tz-q[1])**2<(2.9*s2)**2)){up=q;break}}c=up||[P.x-dx*1.2,P.z-dz*1.2];SCENE.high=1}else SCENE.high=0;SCENE.ck=key;SCENE.cc=c}
  const Dc=Math.hypot(c[0]-mx,c[1]-mz),ctr=(yT+yB)/2;_cv.set(c[0],Math.max(P.y+ym+.25+(SCENE.high?2:0),terrH(c[0],c[1])+1.2),c[1]);if(!SCENE.init){cam.position.copy(_cv);SCENE.init=1}else cam.position.lerp(_cv,Math.min(1,dt*4));cam.lookAt(mx,P.y+ym-ctr*Dc*tv,mz);
  // anyone still wandering into the shot is tucked out of view until the conversation ends
  const hid=[];camBlockers(cam.position.x,cam.position.z,n,hid);for(const o of hid)o.g.visible=false;
  PM.rotation.set(0,P.face,0);PM.position.set(P.x,P.y,P.z);animP(PM,0,TT,dannyTalking()?'talk':'');n.g.rotation.set(0,n.a,0);n.g.position.set(n.x,n.statue&&n.sy!=null?n.sy:terrH(n.x,n.z),n.z);animP(n.g,0,TT,'talk')}

// ================================================================ LOOT DROPS
const LOOT=[],ICT={};let COINM=null,lootMsgT=0;
function coinMats(){return COINM||(COINM=[[0xb8733a,1],[0xc8ccd4,1.15],[0xf2c230,1.4]].map(([c,sz])=>({m:SM({color:c,emissive:c,emissiveIntensity:.35}),sz})))}
function itemTex(k){return ICT[k]||(ICT[k]=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');q.fillStyle='rgba(18,26,44,.85)';q.beginPath();q.arc(32,32,29,0,TAU);q.fill();q.strokeStyle='#e2b64c';q.lineWidth=3;q.stroke();q.font='32px serif';q.textAlign='center';q.textBaseline='middle';q.fillText(ITM[k].ic,32,35);return new THREE.CanvasTexture(c)})())}
function dropLoot(t){const lvl=t.lvl;let total=Math.round(lvl*lvl*.45+lvl*.8+rnd()*lvl);if(t.pledge)total=Math.max(1,Math.round(total*.6));const cnt=clamp(1+Math.floor(lvl/2),1,7);let left=total;
  for(let i=0;i<cnt&&left>0;i++){const v=i===cnt-1?left:Math.max(1,Math.round(total/cnt));left-=v;spawnLoot(t,{v})}
  const pool=lvl>=6?['bandage','burger','drink','stink']:['bandage','drink','burger'];if(rnd()<.15+lvl*.05)spawnLoot(t,{item:pick(pool)});if(lvl>=9)spawnLoot(t,{item:pick(pool)})}
function spawnLoot(t,o){let m;if(o.item){m=new THREE.Sprite(new THREE.SpriteMaterial({map:itemTex(o.item),transparent:true,depthWrite:false}));m.scale.set(.75,.75,1)}else{const cm=coinMats(),k=o.v>=8?2:o.v>=3?1:0;m=new THREE.Mesh(GC.coin||(GC.coin=new THREE.CylinderGeometry(.17,.17,.045,16).rotateX(PI/2)),cm[k].m);m.scale.setScalar(cm[k].sz)}
  const a=rnd()*TAU,sp=1.6+rnd()*2.2;const L={m,x:t.x,z:t.z,y:1.2,vx:Math.cos(a)*sp,vz:Math.sin(a)*sp,vy:3.5+rnd()*2,v:o.v||0,item:o.item,int:t.int||null,age:0,ph:rnd()*TAU};m.position.set(L.x,L.y,L.z);sc.add(m);LOOT.push(L)}
function lootTick(dt){for(let i=LOOT.length-1;i>=0;i--){const L=LOOT[i];L.age+=dt;const here=(L.int||null)===(P.inside||null);L.m.visible=here;
  if(L.y>.3||L.vy>0){L.vy-=14*dt;L.y+=L.vy*dt;const nx=L.x+L.vx*dt,nz=L.z+L.vz*dt;if(freeAt(nx,nz,.1)){L.x=nx;L.z=nz}else{L.vx*=-.3;L.vz*=-.3}if(L.y<=.3){L.y=.3;L.vy=Math.abs(L.vy)>1.2?-L.vy*.35:0;L.vx*=.55;L.vz*=.55}}
  const d=Math.hypot(P.x-L.x,P.z-L.z);if(here&&mode==='play'&&L.age>.6&&d<3.2){const k=Math.min(1,dt*(9-d*2));L.x+=(P.x-L.x)*k;L.z+=(P.z-L.z)*k}
  if(here&&mode==='play'&&L.age>.6&&d<.9){if(L.item){if(invAdd(L.item)){toast('Picked up: '+ITM[L.item].n,1400);sfx('coin')}else{if(lootMsgT<=0){toast('Your pockets are full (3 items).',1500);lootMsgT=3}L.age=.3;continue}}else money(L.v);sc.remove(L.m);LOOT.splice(i,1);continue}
  if(L.age>120){sc.remove(L.m);LOOT.splice(i,1);continue}
  const bob=L.vy===0&&L.y<=.3?.18+Math.sin(TT*3+L.ph)*.08:0;L.m.position.set(L.x,L.y+bob+terrH(L.x,L.z),L.z);if(!L.item)L.m.rotation.y+=dt*4;const fade=L.age>110?(120-L.age)/10:1;if(L.item)L.m.scale.setScalar(.75*fade);}
  lootMsgT-=dt}

// ================================================================ INTRO: BIG ED DROPS DANNY OFF
let TRUCK=null,CINE=null;
function mkTruck(){if(GFX==='enhanced')return mkTruck2();const g=new THREE.Group(),paint=mt(0x6e1f1f,.45,.3),dark=mt(0x1b1f26,.3),chrome=mt(0xc9ccd2,.3,.6);const add=(geo,m,x,y,z)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.castShadow=true;g.add(e);return e};
  add(bgeo(2.2,.7,5.6),paint,0,.95,0);add(bgeo(2.1,1.15,2.1),paint,0,1.85,.55);add(bgeo(1.96,.8,.06),dark,0,1.95,1.63);add(bgeo(2.12,.6,1.6),dark,0,2.0,.5);add(bgeo(2.12,.1,2.15),paint,0,2.46,.55);
  add(bgeo(2.2,.75,2.4),paint,0,1.4,-1.55);add(bgeo(1.9,.72,2.3),mt(0x2a2a2a,.9),0,1.45,-1.55);add(bgeo(2.3,.25,.2),chrome,0,.75,2.85);add(bgeo(1.8,.5,.1),chrome,0,1.15,2.82);
  add(bgeo(.4,.22,.06),bm(0xfff4cf),-.72,1.2,2.84);add(bgeo(.4,.22,.06),bm(0xfff4cf),.72,1.2,2.84);add(bgeo(.3,.25,.06),bm(0xa41818),-.85,1.25,-2.8);add(bgeo(.3,.25,.06),bm(0xa41818),.85,1.25,-2.8);add(bgeo(2.3,.2,.2),chrome,0,.7,-2.85);
  const wg=new THREE.CylinderGeometry(.5,.5,.38,16).rotateZ(PI/2);g.userData.wh=[];for(const[x,z]of[[-1.05,1.8],[1.05,1.8],[-1.05,-1.8],[1.05,-1.8]]){const w=add(wg,mt(0x141414),x,.5,z);g.userData.wh.push(w);add(new THREE.CylinderGeometry(.24,.24,.4,10).rotateZ(PI/2),chrome,x,.5,z)}
  g.visible=false;sc.add(g);return g}
let PLAID=null;
// ================================================================ Big Ed's pickup: an old two-tone work truck with rounded panels, chrome grille and bumpers,
// round headlights, glass, door seams and handles, mirrors, a bed with rails and tailgate, mud flaps, treaded tyres on spoked rims (wheels spin as it drives)
function mkTruck2(){const g=new THREE.Group(),S_=(c,r,m)=>SM({color:c,roughness:r,metalness:m||0}),paint=S_(0x7a1f1f,.38,.15),paint2=S_(0xe9e2d0,.45),dark=S_(0x1b1f26,.6),chrome=S_(0xd6d9de,.18,.9),rubber=S_(0x161616,.9),trim=S_(0x2a2c30,.7),rust=S_(0x7a4a2a,.9),
    glass=new THREE.MeshStandardMaterial({color:0x1a2632,roughness:.05,metalness:.2,transparent:true,opacity:.55,envMapIntensity:1.6});
  const add=(geo,m,x,y,z,rx,ry,rz)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);if(rx)e.rotation.x=rx;if(ry)e.rotation.y=ry;if(rz)e.rotation.z=rz;e.castShadow=true;e.receiveShadow=true;g.add(e);return e};
  const rb=(w,h,d,r,m,x,y,z)=>add(roundBox(w,h,d,r,3),m,x,y,z);
  // chassis, front fenders with round arches, hood, cab, bed
  rb(2.16,.62,5.5,.14,paint,0,1.0,0);                          // lower body
  rb(2.0,.5,1.9,.2,paint,0,1.42,1.75);                         // hood
  add(roundBox(1.9,.06,1.8,.03,2),paint2,0,1.68,1.75);          // two-tone hood stripe
  const oSw=[],oCab=rb(2.06,1.12,1.9,.2,paint,0,1.95,.25);                       // cab
  const oRoof=rb(2.1,.12,1.98,.06,paint2,0,2.5,.25);                       // roof cap
  const oWs=add(roundBox(1.86,.66,.06,.04,2),glass,0,2.02,1.21,-.22);    // windshield
  const oBw=add(roundBox(1.7,.5,.05,.03,2),glass,0,2.05,-.71);           // back window
  for(const s of[-1,1]){oSw.push(add(roundBox(.05,.52,1.2,.03,2),glass,s*1.035,2.08,.3));    // side windows
    add(bgeo(.02,.9,.02),trim,s*1.04,1.6,1.15);add(bgeo(.02,.9,.02),trim,s*1.04,1.6,-.6);add(bgeo(.02,.02,1.7),trim,s*1.04,1.12,.28);   // door seams
    add(roundBox(.05,.06,.22,.02,1),chrome,s*1.07,1.6,-.35);   // door handle
    const mr=add(roundBox(.06,.22,.3,.04,2),chrome,s*1.22,2.05,1.05);add(bgeo(.2,.04,.04),chrome,s*1.12,2.0,1.05);   // mirrors
    add(roundBox(.04,.1,4.9,.02,1),paint2,s*1.085,1.18,-.1);   // side stripe
    for(const z of[1.8,-1.8]){add(new THREE.TorusGeometry(.62,.1,8,20,PI),paint,s*1.03,.62,z,0,PI/2,0)}   // wheel arch lips
    add(bgeo(.04,.36,.3),rubber,s*.96,.42,-2.35)}              // mud flaps
  // bed with rails, ribbed floor and tailgate
  add(bgeo(1.9,.06,2.5),trim,0,1.33,-1.55);for(let x=-.8;x<=.8;x+=.27)add(bgeo(.04,.04,2.5),dark,x,1.37,-1.55);
  for(const s of[-1,1]){rb(.12,.55,2.6,.05,paint,s*1.02,1.6,-1.55);add(new THREE.CylinderGeometry(.03,.03,2.6,8).rotateX(PI/2),chrome,s*1.02,1.92,-1.55)}
  rb(2.06,.55,.1,.04,paint,0,1.6,-2.83);add(roundBox(.5,.08,.04,.02,1),chrome,0,1.75,-2.89);
  add(roundBox(.4,.22,.03,.02,1),S_(0xf2efe6,.5),0,1.18,-2.82);   // licence plate
  for(const s of[-1,1])add(roundBox(.18,.34,.06,.03,2),bm(0xb01818),s*.95,1.55,-2.86);   // tail lights
  // front: grille, bars, round headlights, indicators, bumpers
  rb(1.6,.55,.12,.06,chrome,0,1.25,2.72);for(let i=0;i<5;i++)add(bgeo(1.46,.04,.06),dark,0,1.06+i*.095,2.77);
  for(const s of[-1,1]){add(new THREE.CylinderGeometry(.17,.17,.08,16).rotateX(PI/2),chrome,s*.86,1.28,2.74);add(new THREE.CircleGeometry(.14,16),bm(0xfff4cf),s*.86,1.28,2.79);add(roundBox(.2,.08,.05,.02,1),bm(0xf2a33a),s*.86,1.04,2.77)}
  rb(2.3,.24,.3,.08,chrome,0,.78,2.83);rb(2.3,.22,.26,.08,chrome,0,.78,-2.86);
  add(new THREE.CylinderGeometry(.05,.05,.4,8).rotateX(PI/2),chrome,.7,.55,-2.9);   // exhaust
  const oMk=add(roundBox(.5,.06,.12,.02,1),bm(0xf2a33a),0,2.6,.95);       // cab marker lights
  add(roundBox(.5,.3,.05,.02,1),rust,-.62,1.1,-2.15);            // a patch of rust: it's been through a lot
  // cab interior seen through the glass: seat and steering wheel
  const oSeat=add(bgeo(1.8,.5,.6),dark,0,1.6,-.25),oWh=add(new THREE.TorusGeometry(.2,.03,6,16),trim,-.45,1.95,.75,-.9);
  // wheels: treaded tyres, spoked rims, hub caps (each wheel group spins on its axle)
  const tyre=new THREE.TorusGeometry(.4,.16,10,28);tyre.rotateY(PI/2);const tread=new THREE.BoxGeometry(.3,.06,.08);
  g.userData.wh=[];for(const[x,z]of[[-1.03,1.8],[1.03,1.8],[-1.03,-1.8],[1.03,-1.8]]){const w=new THREE.Group();w.position.set(x,.56,z);g.add(w);
    const t=new THREE.Mesh(tyre,rubber);t.castShadow=true;w.add(t);for(let i=0;i<22;i++){const a=i/22*TAU,b=new THREE.Mesh(tread,rubber);b.position.set(0,Math.cos(a)*.555,Math.sin(a)*.555);b.rotation.x=-a;w.add(b)}
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.22,18).rotateZ(PI/2),chrome);w.add(rim);for(let i=0;i<6;i++){const sp=new THREE.Mesh(bgeo(.24,.05,.5),dark);sp.rotation.x=i/6*PI;sp.position.x=Math.sign(x)*.02;w.add(sp)}
    const hub=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),chrome);hub.position.x=Math.sign(x)*.12;w.add(hub);g.userData.wh.push(w)}
  g.userData.cabOrig=[oCab,oRoof,oWs,oBw,oMk,oSeat,oWh,...oSw];g.visible=false;sc.add(g);return g}
/* V262 windshield shot of the cab: the solid cab is swapped for an open shell (glass, pillars, dash, seat back, wheel) so a camera ahead of the truck can look in at the two of them */
function truckCabOn(g,on){const U=g&&g.userData;if(!U||!U.cabOrig)return 0;
  if(on&&!U.cabShell){const sh=new THREE.Group(),S_=(c,r,m)=>SM({color:c,roughness:r,metalness:m||0}),paint=S_(0x7a1f1f,.38,.15),paint2=S_(0xe9e2d0,.45),dark=S_(0x1b1f26,.6),seat=S_(0x4a4038,.92),lin=S_(0x6a625a,.95),
      glass=new THREE.MeshStandardMaterial({color:0xb9d3e4,roughness:.05,metalness:.1,transparent:true,opacity:.12,envMapIntensity:1.8,depthWrite:false});
    const A=(geo,m,x,y,z,rx,cs)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);if(rx)e.rotation.x=rx;e.castShadow=!!cs;e.receiveShadow=true;sh.add(e);return e};
    A(roundBox(2.1,.12,2.1,.05,2),paint2,0,2.86,.25);A(bgeo(1.9,.02,1.8),lin,0,2.79,.25);                  /* roof + headliner */
    A(roundBox(1.9,1.17,.03,.01,2),glass,0,2.27,1.05,-.35);                                                   /* windshield */
    for(const s of[-1,1]){A(bgeo(.09,1.2,.09),paint,s*.95,2.27,1.05,-.35,1);A(bgeo(.07,.58,2.0),paint,s*1.03,1.69,.25,0,1);A(roundBox(.04,.74,1.7,.02,2),glass,s*1.03,2.4,.2);   /* A-pillars, doors, side glass */
      A(bgeo(.2,.5,.1),paint,s*.93,2.22,-.75,0,1);A(bgeo(.04,.5,1.9),lin,s*.97,1.78,.25)}
    A(bgeo(2.06,.6,.1),paint,0,1.7,-.75,0,1);A(bgeo(2.06,.36,.1),paint,0,2.62,-.75,0,1);A(roundBox(1.66,.5,.03,.01,2),glass,0,2.22,-.75);   /* back wall + rear window */
    A(roundBox(1.9,.55,.2,.06,2),seat,0,1.9,-.55);A(roundBox(1.96,.34,.7,.08,2),dark,0,1.74,.95,0,1);        /* seat back, dash */
    A(bgeo(.34,.09,.05),dark,0,2.64,.9);A(bgeo(.03,.14,.03),dark,0,2.72,.9);                                    /* rear-view mirror */
    A(new THREE.TorusGeometry(.25,.036,8,22),dark,.5,2.0,.52,.55);A(new THREE.CylinderGeometry(.05,.05,.05,10).rotateX(PI/2),dark,.5,2.0,.52,.55);   /* wheel on the driver's (left) side */
    U.cabShell=sh;g.add(sh)}
  U.cabOrig.forEach(m=>m.visible=!on);if(U.cabShell)U.cabShell.visible=on;return 1}
/* Big Ed (driver, truck's left) and Danny (passenger) seated in the cab; cabPoseSet(T) poses + idles them each frame */
function cabPeople(g){const U=g.userData;if(U.cabPpl)return U.cabPpl;
  const ed=mkDad(),dn=mkPerson({shadow:1,shirt:0x7d1f2c,sleeve:0x7d1f2c,pants:0x34486e,skin:0xf1c9a5,hair:0x4a3020,pin:1});if(dn.CS)dn.CS.forEach(m=>m.visible=false);
  ed.scale.set(1.3,1.08,1.2);ed.position.set(.52,1.64-.92*1.08,-.1);dn.position.set(-.56,1.64-.92,-.1);g.add(ed);g.add(dn);U.cabPpl={ed,dn};cabPoseSet(0);return U.cabPpl}
function cabPoseSet(T){const U=TRUCK&&TRUCK.userData.cabPpl;if(!U)return;const R=(b,x,y,z)=>{if(b)b.rotation.set(x,y,z)},bump=Math.sin(T*17)*.006+Math.sin(T*6.3)*.01;
  for(const k of['ed','dn']){const g=U[k],p=g.P;if(!p)continue;const ed=k==='ed',ph=ed?0:1.7;
    R(p.lL,-1.5,0,.07);R(p.lR,-1.5,0,-.07);R(p.kL,1.5,0,0);R(p.kR,1.5,0,0);
    g.position.y=(ed?1.64-.92*1.08:1.64-.92)+bump*(ed?1:1.2);g.rotation.z=Math.sin(T*2.1+ph)*.012;
    if(ed){R(p.aL,-1.12,0,-.08);R(p.aR,-1.12,0,.08);R(p.eL,-.35,0,0);R(p.eR,-.35,0,0);R(p.spine,0,-.1,0);R(p.head,.02+Math.sin(T*4.4)*.025,-.32+Math.sin(T*.9)*.28,Math.sin(T*1.4)*.03)}
    else{R(p.aL,-.2,0,-.05);R(p.aR,-.2,0,.05);R(p.eL,-.9,0,0);R(p.eR,-.9,0,0);R(p.spine,0,.14,0);R(p.head,Math.sin(T*13)*.02,.55+Math.sin(T*1.3)*.1,Math.sin(T*2.2)*.05)}}}
function cabCamSet(dt,tx,tz){const T=CINE.cabT||0,asp=cam.aspect||1.78,half=Math.tan(cam.fov*PI/360)*asp,d=Math.max(3.5,1.35/half);TRUCK.updateMatrixWorld(true);
  const vb=Math.sin(T*23)*.006+Math.sin(T*8.7)*.008,p=TRUCK.localToWorld(new THREE.Vector3(.04,2.95+vb,.1+d)),l=TRUCK.localToWorld(new THREE.Vector3(0,2.3,.1));cam.position.copy(p);cam.lookAt(l)}
function cabEnd(){try{if(TRUCK){truckCabOn(TRUCK,false);const U=TRUCK.userData.cabPpl;if(U){TRUCK.remove(U.ed);TRUCK.remove(U.dn);TRUCK.userData.cabPpl=null}}}catch(e){console.warn(e)}if(typeof CINE!=='undefined'&&CINE){CINE.cabAnim=null}if(cam.fov!==60){cam.fov=60;cam.updateProjectionMatrix()}}

function mkDad(){if(GFX==='enhanced'){const g=mkPersonX({shirt:0x9a2f24,sleeve:0x9a2f24,plaid:1,pants:0x2e4466,skin:0xe8b08a,hair:0x5a4030,hs2:'short',cl2:'flannel',fh:'beard',fv:2,big:1,iris:0x4a3a2a,shoe:0x5a3620,sole:0x2a1d14,sacc:0x5a3620,cap:0x1f3a5a,gl:0,shadow:0});g.scale.set(1.62,1.45,1.55);return g}if(!PLAID)PLAID=new THREE.MeshLambertMaterial({map:ctex(64,64,(q,W,H)=>{q.fillStyle='#9a2f24';q.fillRect(0,0,W,H);q.fillStyle='rgba(20,15,15,.55)';for(let i=0;i<W;i+=16){q.fillRect(i,0,6,H);q.fillRect(0,i,W,6)}q.fillStyle='rgba(240,200,120,.25)';for(let i=8;i<W;i+=16){q.fillRect(i,0,1.5,H);q.fillRect(0,i,W,1.5)}})});
  const g=new THREE.Group(),skin=mt(0xe8b08a,.8),jean=mt(0x2e4466,.85),boot=mt(0x4a2e1a,.8),hair=mt(0x5a4030,.9);const add=(geo,m,par,x,y,z)=>{const e=new THREE.Mesh(geo,m);e.position.set(x,y,z);e.castShadow=true;par.add(e);return e};const piv=(x,y)=>{const p=new THREE.Group();p.position.set(x,y,0);g.add(p);return p};
  const lL=piv(-.28,1.05),lR=piv(.28,1.05);for(const L of[lL,lR]){add(new THREE.BoxGeometry(.38,1.0,.42).translate(0,-.5,0),jean,L,0,0,0);add(bgeo(.42,.2,.6),boot,L,0,-.98,.08)}
  const torso=add(new THREE.SphereGeometry(.8,20,16),PLAID,g,0,1.72,.05);torso.scale.set(1.18,1.05,.95);add(bgeo(1.85,.5,.95),PLAID,g,0,2.3,0);add(bgeo(1.2,.1,.8),jean,g,0,1.05,.08);add(bgeo(.3,.16,.1),mt(0xc9a046,.4,.6),g,0,1.07,.5);
  const aL=piv(-.98,2.35),aR=piv(.98,2.35);for(const A of[aL,aR]){add(new THREE.BoxGeometry(.36,.9,.38).translate(0,-.45,0),PLAID,A,0,0,0);add(new THREE.BoxGeometry(.3,.45,.32).translate(0,-1.1,0),skin,A,0,0,0);add(new THREE.SphereGeometry(.2,10,8),skin,A,0,-1.4,0)}
  add(bgeo(.4,.22,.4),skin,g,0,2.6,0);const head=add(new THREE.SphereGeometry(.3,16,12),skin,g,0,2.9,.02);head.scale.set(1,1.05,1);
  add(new THREE.SphereGeometry(.31,14,10,0,TAU,PI*.55,PI*.45),hair,g,0,2.88,.04);add(bgeo(.34,.07,.06),hair,g,0,2.8,.3);
  add(bgeo(.12,.04,.04),mt(0x2a1d14),g,-.1,3.0,.28).rotation.z=-.35;add(bgeo(.12,.04,.04),mt(0x2a1d14),g,.1,3.0,.28).rotation.z=.35;add(bgeo(.16,.035,.03),mt(0x5a1e1e),g,0,2.73,.29);add(bgeo(.05,.05,.02),mt(0x161616),g,-.1,2.95,.29);add(bgeo(.05,.05,.02),mt(0x161616),g,.1,2.95,.29);
  const cap=add(new THREE.CylinderGeometry(.31,.32,.18,16),mt(0x1f3a5a,.8),g,0,3.17,0);add(bgeo(.4,.04,.26),mt(0xd8762a,.8),g,0,3.1,.36);
  g.P={lL,lR,aL,aR,torso};return g}
function cineWait(sec){return new Promise(res=>{CINE.waits.push({t:sec,res})})}
function cineDrive(z0,z1,dur,o){return new Promise(res=>{CINE.drive=Object.assign({z0,z1,dur,t:0,res},o||{})})}   // V183 o.ax:'x' drives along x, o.ease:'in'|'out'|'lin'
function cineSkip(){if(!CINE)return;CINE.skipped=1;if(TC.g)TC.skip=1;if(CINE.drive)CINE.drive.t=CINE.drive.dur;CINE.waits.forEach(w=>w.t=0)}
function cineTick(dt){if(!CINE)return;if(CINE.cabAnim){CINE.cabT=(CINE.cabT||0)+dt;cabPoseSet(CINE.cabT)}const d=CINE.drive;if(d){d.t+=dt;const k=Math.min(1,d.t/d.dur),e=d.ease==='in'?k*k:1-Math.pow(1-k,2.2);const z=lerp(d.z0,d.z1,d.ease==='lin'?k:d.ease==='out'?e:d.ease==='in'?k*k:d.z1<d.z0&&d.z0<120?k*k:e);if(d.ax==='x')TRUCK.position.x=z;else TRUCK.position.z=z;TRUCK.position.y=terrH(TRUCK.position.x,TRUCK.position.z);const sp=Math.abs(d.z1-d.z0)/d.dur*(d.z0<120?2*k:2.2*(1-k));TRUCK.userData.wh.forEach(w=>w.rotation.x-=sp*dt*2);CINE.eng=(CINE.eng||0)-dt;if(CINE.eng<=0){CINE.eng=.13;tone(48+sp*3,.16,'sawtooth',.035)}if(k>=1){CINE.drive=null;d.res()}}
  for(let i=CINE.waits.length-1;i>=0;i--){const w=CINE.waits[i];w.t-=dt;if(w.t<=0){CINE.waits.splice(i,1);w.res()}}
  if((mode==='cine'||((mode==='card'||mode==='wheel')&&CINE.ride))&&TRUCK&&CINE.shot!=='throne'&&!CINE.hold){const tx=TRUCK.position.x,tz=TRUCK.position.z;if(CINE.shot==='titleRise'||CINE.shot==='title'||CINE.shot==='titlePan')tcCam(dt);else if(CINE.shot==='drive'){cam.position.set(tx+2.9,3.4,tz+10);cam.lookAt(tx,1.4,tz-1)}else if(CINE.shot==='leave'){cam.position.set(74.2,2.3,P.z+5.5);cam.lookAt(tx,1.3,tz)}else if(CINE.camf)CINE.camf(dt,tx,tz)}}
// ================================================================ V105 opening title card: the PLEDGE pennant waving in the sky over Greek Row.
// The camera drifts toward it, speeds up and flies straight through the cloth (Harry Potter-logo style), then sweeps down to Big Ed's truck.
const TC={g:null,flag:null,geo:null,base:null,clouds:[],t:0,tp:0,F:new THREE.Vector3(72.4,64,168),W:18,H:4.3,C:null,L0:null,T0:null,wh:null,skip:0};
const tcEase=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,tcSm=k=>{k=clamp(k,0,1);return k*k*k*(k*(k*6-15)+10)};
function tcTex(){return ctex(1024,256,(q,W,H)=>{q.clearRect(0,0,W,H);const P_=[[0,0],[.8*W,.13*H],[W,.5*H],[.8*W,.87*H],[0,H]];
  q.beginPath();P_.forEach(([x,y],i)=>i?q.lineTo(x,y):q.moveTo(x,y));q.closePath();q.fillStyle='#7d1f2c';q.fill();q.save();q.clip();
  const g=q.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,255,255,.10)');g.addColorStop(.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.22)');q.fillStyle=g;q.fillRect(0,0,W,H);
  for(let i=0;i<1400;i++){q.fillStyle=Math.random()<.5?'rgba(0,0,0,.05)':'rgba(255,255,255,.04)';q.fillRect(Math.random()*W,Math.random()*H,2,1)}
  q.fillStyle='#e2b64c';q.fillRect(0,0,16,H);
  // same lettering as the title screen: gold Graduate with a dark drop shadow, sized to fit the pennant
  let fs=200;const fam="Graduate, Rockwell, Georgia, serif";q.font=fs+'px '+fam;const maxW=.74*W-70;const w0=q.measureText('PLEDGE').width;if(w0>maxW){fs=Math.floor(fs*maxW/w0);q.font=fs+'px '+fam}if(fs>.7*H){fs=Math.floor(.7*H);q.font=fs+'px '+fam}
  q.textBaseline='middle';q.fillStyle='#3b0c13';q.fillText('PLEDGE',58,H/2+10);q.fillStyle='#e2b64c';q.fillText('PLEDGE',52,H/2+2);q.restore()})}
function tcCloudTex(){return ctex(128,128,(q,W,H)=>{for(let i=0;i<9;i++){const x=24+Math.random()*80,y=40+Math.random()*48,r=18+Math.random()*28,g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=g;q.fillRect(0,0,W,H)}})}
// V106: the shot starts from wherever the title-screen camera is. The flag is hung in the sky straight ahead of it and the whole rig
// is built in a local frame (flag at the origin, camera approaching from +z) that is then turned to face the title camera.
function tcStart(){tcEnd();const g=new THREE.Group();TC.g=g;TC.t=0;TC.tp=0;TC.skip=0;
  const C=cam.position.clone(),d=new THREE.Vector3();cam.getWorldDirection(d);d.y=0;if(d.lengthSq()<1e-4)d.set(0,0,-1);d.normalize();
  TC.C=C;TC.T0=C.clone().addScaledVector(cam.getWorldDirection(new THREE.Vector3()),40);
  const F=C.clone().addScaledVector(d,58);F.y=C.y+36;TC.F=F;g.position.copy(F);g.rotation.y=Math.atan2(-d.x,-d.z);g.updateMatrixWorld(true);TC.L0=g.worldToLocal(C.clone());
  const geo=new THREE.PlaneGeometry(TC.W,TC.H,64,18);geo.translate(TC.W/2,0,0);TC.geo=geo;TC.base=Float32Array.from(geo.attributes.position.array);
  const fm=SM({map:tcTex(),alphaTest:.5,side:THREE.DoubleSide,roughness:.9,emissive:0x1a0406});fm.color.setHex(0x8c8c8c);fm.emissive.setHex(0x5a5a5a);fm.emissiveMap=fm.map;/* reads like the flat title-screen pennant whatever the sun is doing */fm.fog=false;const flag=new THREE.Mesh(geo,fm);flag.position.set(-TC.W/2+.5,0,0);flag.castShadow=false;g.add(flag);TC.flag=flag;
  /* V107: no pole - it is the title-screen pennant itself, blown loose and riding the wind */
  TC.dFit=Math.max((TC.W/2+.9)/(Math.tan(cam.fov*PI/360)*cam.aspect),(TC.H/2+.6)/Math.tan(cam.fov*PI/360));
  const ct=tcCloudTex();TC.clouds=[];for(let i=0;i<52;i++){const onPath=i<10,bank=i>=10&&i<18;
    const m=new THREE.SpriteMaterial({map:ct,color:0xf2f0ec,transparent:true,opacity:bank?.85:(onPath?.32:.42)+Math.random()*.25,depthWrite:false,fog:false});const s=new THREE.Sprite(m);
    // most clouds frame the flag; a few sit on the approach so they sweep past the lens; a thick bank waits just behind the flag
    let x,y,z;if(onPath){x=(Math.random()-.5)*14;y=(Math.random()-.5)*8-6;z=18+Math.random()*40}else if(bank){x=(Math.random()-.5)*10;y=(Math.random()-.5)*6;z=-10-Math.random()*14}
    else{x=(Math.random()-.5)*90;y=-14+Math.random()*30;z=-30+Math.random()*120;if(Math.abs(x)<10&&Math.abs(y)<6&&Math.abs(z)<20)y+=12;if(z>-6&&Math.abs(x)<24)x=(x<0?-1:1)*(24+Math.random()*24)}
    s.position.set(x,y,z);s.userData.o=m.opacity;s.userData.path=onPath||bank;const k=bank?16+Math.random()*8:onPath?7+Math.random()*7:14+Math.random()*22;s.scale.set(k,k*.6,1);g.add(s);TC.clouds.push(s)}
  sc.add(g);
  // white-out used while the camera is inside the cloud bank behind the flag
  let wh=document.getElementById('tcwhite');if(!wh){wh=document.createElement('div');wh.id='tcwhite';wh.style.cssText='position:fixed;inset:0;background:#f3f2ee;opacity:0;pointer-events:none;z-index:8';document.body.appendChild(wh)}TC.wh=wh;wh.style.opacity=0;tcSwoosh()}
// V107: the title-screen pennant is torn off by the wind - it flutters up and out of the top of the screen, and the camera tilts up after it
function tcSwoosh(){const r=TC.pr;TC.pr=null;const src=document.querySelector('#title .pennant');if(!r||!src||!r.width)return;
  const box=document.createElement('div');box.id='tcswoosh';box.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:9;pointer-events:none;transform-origin:0 50%`;
  const pn=src.cloneNode(true);pn.style.margin='0';pn.style.transformOrigin='0 50%';box.appendChild(pn);document.body.appendChild(box);
  const dx=innerWidth*.5-r.left-r.width*.5,dy=-r.top-r.height*1.6;
  try{pn.animate([{transform:'skewY(0deg) scaleX(1)'},{transform:'skewY(-5deg) scaleX(.94)'},{transform:'skewY(4deg) scaleX(1.03)'},{transform:'skewY(-3deg) scaleX(.96)'},{transform:'skewY(0deg) scaleX(1)'}],{duration:420,iterations:2});
    const a=box.animate([{transform:'none',opacity:1},{transform:`translate(${dx*.08}px,${-r.height*.25}px) rotate(-3deg)`,opacity:1,offset:.18},{transform:`translate(${dx*.45}px,${dy*.45}px) rotate(-9deg) scale(.86)`,opacity:1,offset:.55},{transform:`translate(${dx}px,${dy}px) rotate(-16deg) scale(.7)`,opacity:0}],{duration:750,easing:'cubic-bezier(.4,0,.8,.5)',fill:'forwards'});
    a.onfinish=()=>box.remove()}catch(e){box.remove()}setTimeout(()=>{try{box.remove()}catch(e){}},1100)}
function tcEnd(){const wh=document.getElementById('tcwhite');if(wh)wh.remove();const sw=document.getElementById('tcswoosh');if(sw)sw.remove();TC.wh=null;if(!TC.g)return;sc.remove(TC.g);TC.g.traverse(o=>{if(o.geometry)o.geometry.dispose()});TC.g=null;TC.flag=null;cam.up.set(0,1,0)}
// the pennant ripples from the pole outward, more toward the free end, with a little sag
function tcWave(t){const p=TC.geo.attributes.position,a=p.array,b=TC.base,W=TC.W;for(let i=0;i<a.length;i+=3){const x=b[i],y=b[i+1],u=x/W,f=Math.pow(u,1.25);
    const f2=.3+.7*f;a[i+2]=(Math.sin(u*9-t*5.2+y*.35)*.5+Math.sin(u*19-t*8.7)*.14)*f2*1.4;a[i+1]=y-.32*u*u+Math.sin(u*6-t*3.6)*.12*f;a[i]=x-.18*f*Math.abs(Math.sin(u*9-t*5.2))}
  p.needsUpdate=true;TC.geo.computeVertexNormals()}
// shots: 'titleRise' tilts up from the title view to the flag; 'title' pushes in and through it into the cloud bank; 'titlePan' comes out of the cloud over Greek Row and sweeps down onto the truck
const TC_RISE=2.6,TC_PUSH=3.2,TC_THRU=.2;
function tcCam(dt){if(!TC.g)return;const g=TC.g,s=(TC.t+=dt);tcWave(s);if(TC.flag){TC.flag.position.y=Math.sin(s*1.3)*.35;TC.flag.rotation.z=Math.sin(s*.9)*.05}const camL=g.worldToLocal(cam.position.clone());
  for(const c of TC.clouds){c.position.x+=dt*(1.2+(c.scale.x%3)*.4);if(c.userData.path){const d=c.position.distanceTo(camL);c.material.opacity=c.userData.o*Math.min(1,Math.max(0,(30-d)/14))*Math.min(1,Math.max(0,(d-2)/5))}}/* near clouds only show up close, so they streak past instead of hazing the flag */
  const W=v=>g.localToWorld(v),aim=W(new THREE.Vector3(.6,0,0));let pos,look,white=0;cam.up.set(0,1,0);
  if(CINE.shot==='titleRise'){const k=tcSm((s-.3)/(TC_RISE-.3));/* V110: hold a beat so the blown-away pennant is gone before the sky flag comes into view */pos=TC.C.clone();pos.y+=1.5*k;look=TC.T0.clone().lerp(aim,k)}
  else if(CINE.shot==='title'){const u=TC.tp+=dt,L=TC.L0;let l;
    /* V107: push in until the whole flag just fills the frame, then cut (quick white flash) straight to Greek Row */
    const df=TC.dFit||10;if(u<TC_PUSH){const k=tcEase(u/TC_PUSH);l=new THREE.Vector3(lerp(L.x,.6,k)+Math.sin(u*.8)*1.2*(1-k),lerp(L.y,0,k),lerp(L.z,df,k));const r=Math.sin(u*.6)*.04*(1-k);cam.up.set(Math.sin(r),Math.cos(r),0).applyQuaternion(g.quaternion)}
    else{const k=Math.min(1,(u-TC_PUSH)/TC_THRU);l=new THREE.Vector3(.6,0,df-df*.5*k*k);white=k}
    pos=W(l.clone());look=aim}
  else{// out of the cloud above the road, then sweep down onto the truck as it rolls up Greek Row
    const u=TC.tp+=dt,k=tcSm(u/3.2),tx=TRUCK.position.x,tz=TRUCK.position.z,from=new THREE.Vector3(tx+1.5,46-5*Math.min(1,u),tz+40-4*u);
    pos=new THREE.Vector3(lerp(from.x,tx+2.9,k),lerp(from.y,3.4,k),lerp(from.z,tz+10,k));const lk=tcSm(Math.min(1,u/2.4));look=new THREE.Vector3(tx,lerp(10,1.4,lk),lerp(tz-60,tz-1,lk));white=clamp(1-u/.6,0,1)}
  if(TC.wh)TC.wh.style.opacity=white.toFixed(3);cam.position.copy(pos);cam.lookAt(look)}
async function introCine(done){if(!TRUCK)TRUCK=mkTruck();CINE={waits:[],shot:'drive'};mode='cine';unlock();document.body.classList.add('cine');$('cineskip').hidden=false;
  TRUCK.visible=true;TRUCK.rotation.y=PI;TRUCK.position.set(72.4,0,152);PM.visible=false;S.gt=15;
  let titled=false;try{tcStart();titled=true}catch(e){console.warn('title card',e)}
  const intro='Fall semester. Big Ed Kowalski\'s truck rattles up Greek Row…';
  if(titled){/* V106: continue straight from the title-screen camera (no fade) */
    const W_=async t=>{if(!TC.skip)await cineWait(t)};
    CINE.shot='titleRise';await W_(TC_RISE);CINE.shot='title';TC.tp=0;await W_(TC_PUSH+TC_THRU);
    if(TC.skip){tcEnd();$('fade').style.opacity=1;setTimeout(()=>$('fade').style.opacity=0,60);CINE.shot='drive';TRUCK.position.z=80}
    else{CINE.shot='titlePan';TC.tp=0;const drv=cineDrive(152,80,6.5);toast(intro,3200);await W_(3.2);CINE.shot='drive';tcEnd();await drv}}
  else{$('fade').style.opacity=1;setTimeout(()=>$('fade').style.opacity=0,60);toast(intro,3200);await cineDrive(152,80,6.5)}
  tcEnd();CINE.shot='hold';await cineWait(.6);$('cineskip').hidden=true;
  const dad=spawn('staff','greek',{x:76.6,z:79.6,a:PI/2,name:'Big Ed Kowalski',title:'Your Dad · ΑΣΡ Class of \'94',lvl:9,mode:'idle',temp:1,actor:1});sc.remove(dad.g);dad.g=mkDad();dad.g.position.set(dad.x,0,dad.z);sc.add(dad.g);dad.tall=1;
  P.x=77.9;P.z=76.9;P.face=0;PM.visible=true;tone(180,.12,'square',.05);tone(140,.12,'square',.05,.1);
  const sayC=(text,ch)=>new Promise(res=>card({title:'Big Ed Kowalski',sp:'Your dad · ΑΣΡ, class of \'94',text,focus:dad,ch:(ch||[['Continue',null]]).map(([l,f])=>[l,()=>{mode='cine';res(f?f():0)}])}));
  
  await sayC('"Here it is, Danny! HARROWGATE UNIVERSITY! Founded 1791! Ivy on the walls, money in the vaults, and now a KOWALSKI on a full scholarship! Smell that? That\'s OPPORTUNITY, son! Your old man sweated through four years and two hernias on this campus so YOU could stand right here!"',[['"Yeah, Dad. It\'s… really big."',null]]);
  await sayC('"See that house? ALPHA SIGMA RHO! Class of \'94! I was the loudest, toughest, hardest-working pledge they EVER had! They still talk about me! Probably! DOESN\'T MATTER!"',[['"They talk about you? Like, good stuff?"',null]]);
  await sayC('"Now, I heard the house has hit a rough patch. Dean\'s breathing down their necks, looking for any excuse to shut \'em down. And those boys up there? They won\'t care whose kid you are! GOOD! You don\'t need my name! You make your OWN name!"',[['"Got it. Make my own name."',null]]);
  const r=await sayC('"You are going to march up that walk and EARN those letters! No quitting! No crying! No \'Dad, I want to find myself!\' Kowalskis don\'t FIND themselves! We BUILD ourselves! You hear me?!"',[['"Yes, sir!"',()=>1],['"Dad… I\'m not sure I even want to pledge."',()=>2]]);
  if(r===2)await sayC('"NOT SURE?! Kowalskis are ALWAYS sure! I did not drive six hours on a busted transmission for NOT SURE! You get up there and you MAKE yourself sure!"',[['"Okay, okay! I\'m sure! I\'m sure."',null]]);
  else await sayC('"THAT\'S my boy! That\'s the fire! Now hold onto it, because those trust-fund twerps are gonna try to stomp it out of you!"',[['"They can try."',null]]);
  await sayC('"…Look. I\'m proud of you, kid. Real proud. Now get up there before I get emotional in front of these preppies. Here, five bucks. Don\'t spend it all in one place!"',[['"Thanks, Dad. Love you too."',null]]);
  if(S.money<5)S.money=5;bubble(dad,'MAKE ME PROUD!',2.5);dad.g.P.aR.rotation.x=-2.7;mode='cine';await cineWait(1.4);
  despawn(dad);tone(180,.12,'square',.05);CINE.shot='leave';$('cineskip').hidden=false;await cineWait(.5);await cineDrive(80,6,5.5);
  TRUCK.visible=false;$('cineskip').hidden=true;CINE=null;mode='play';endScene();P.face=PI/2;yaw=-PI/2;camT=6;done()}

// ================================================================ PLEDGE CLASS
const PROLE={legacy:['Legacy Pledge','Big Ed\'s kid. Runs whatever errand Grant hands him.'],weather:['Weather Pledge','Must give a weather report to any brother, any time.'],basketball:['Basketball Pledge','Carries a basketball everywhere. Never lets it touch the ground for long.'],pouch:['Pouch Pledge','Fetches anything a brother asks for. Gatorade, chapstick, chargers.'],grenade:['Grenade Pledge','When a brother drops something and yells "GRENADE!", he dives on it.'],morning:['Morning Pledge','Wakes up the house every morning between 6 and 9 AM. Loudly.'],delinquent:['Delinquent Pledge','Has to cause harmless mayhem somewhere on campus every day.'],captain:['Pledge Captain','Runs roll call every night at 6 PM on the front lawn and tracks Class Spirit.'],hype:['Hype Pledge','Carries the boombox. Keeps the energy up. Never stops.'],snack:['Snack Pledge','Carries the snack tray. Talk to him once a day for a free snack.'],scribe:['Scribe Pledge','Writes down everything the brothers say. His notes help with class.'],mascot:['Mascot Pledge','Wears the ram horns. Bleats on command. Dances when spirits are low.']};
const PCLASS=['marcus','hunter','felix','cody','sanjay','vinny','andre','miles','kofi','theo','gavin','jaylen','nate','tyler','rico','ben','wes','brock','pruitt'];
