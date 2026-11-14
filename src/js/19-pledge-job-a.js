// ================================================================ V75 DANNY'S PLEDGE JOB: Grant sends him to the Pledge Machine (a slot machine), which lands on one of seven jobs.
// Each job changes how he looks, how he talks and what he can do (R is the job's own move).
const PR_KEYS=['popstar','stats','skate','burglar','fruit','ouija','caveman','weather','basketball','pouch','grenade','morning','delinquent','captain','hype','snack','scribe','mascot','cone'];
/* V375 Andre Wallace is always the pledge captain: Danny's machine never lands on it */
const PR_DANNY=PR_KEYS.filter(k=>k!=='captain');
const PR={
 popstar:{n:'Popstar Pledge',d:'He isn\'t allowed to just talk anymore, so every single thing he says comes out sung, whether it\'s a question in class or an apology to a cop.',c:'#b8327e',c2:'#ffc6e6',ab:'Perform',
  perks:['Everything you say comes out sung','T: Perform. Listeners tip you and fights cool off','Charm: better odds when you chat people up']},
 stats:{n:'Stats Pledge',d:'He keeps a running count of everything that happens in the house, from bong hits to how many beers each brother put away to who brought girls to the party.',c:'#23704f',c2:'#bff0d6',ab:'Tally',
  perks:['A ✎ pops up over anything worth counting','T: Tally what you just saw before you forget it','Hand in your stat sheet at roll call for cash and XP']},
 skate:{n:'Skate Pledge',d:'He has to stay on his skateboard all day, which means outside, inside, and yes, through the dining hall at lunch.',c:'#d0662a',c2:'#ffd9b8',ab:'Trick',
  perks:['Faster everywhere, and sprinting costs less stamina','T: Kickflips, shove-its and 360 flips for XP. Chain them','Campus police hate skateboards']},
 burglar:{n:'Burglar Pledge',d:'Every day he has to sneak into another house on Greek Row and walk out with something that isn\'t his.',c:'#343a4f',c2:'#c9d2ea',ab:'Pickpocket',
  perks:['Every other house keeps a treasure in its lounge. Lift one a day','Sneaking (C) is faster and much harder to spot','T: Pickpocket people from behind']},
 fruit:{n:'Fruit Pledge',d:'He carries a piece of fruit with him wherever he goes, and every time he gets used to it, the brothers hand him a bigger one.',c:'#4f8f25',c2:'#dff3c4',ab:'Fruit slam',
  perks:['Grape, then orange, then pineapple, then watermelon','Get it to roll call in one piece. Hits bruise it','T: Fruit slam. The bigger the fruit, the bigger the hit','Health regenerates faster while it\'s fresh']},
 ouija:{n:'Ouija Pledge',d:'He lugs a Ouija board around campus, and whatever he woke up with it hasn\'t stopped following him since.',c:'#4f3784',c2:'#ddd0ff',ab:'Spook',
  perks:['A ghost follows you everywhere','T: Send the ghost to spook someone. They freeze, then run','The ghost blocks some punches meant for you','Ask the board what anyone really thinks of you']},
 caveman:{n:'Caveman Pledge',d:'He dresses like a caveman, talks like a caveman, and will answer most questions with a confident "ooga booga."',c:'#8a5426',c2:'#f3d6a8',ab:'Club smash',
  perks:['Punches hit 40% harder','T: Club smash: knocks back and stuns everyone in front of you','Jocks love you. Everyone else is a little confused']}};
Object.assign(PR,{
 cone:{n:'Cone Pledge',d:'Once a day he has to swipe a traffic cone off a campus road and carry it to roll call like it\'s a trophy.',c:'#ff6a1a',c2:'#ffe0c4',ab:'Cone-phone',
  perks:['Traffic cones line the campus roads. Orange markers show the near ones','Press E on a cone to grab it. One a day, or Grant notices','T: Shout through your cone. Everyone nearby is stunned for a moment']},
 weather:{n:'Weather Pledge',d:'Any brother can stop him at any time and ask for the forecast, and he\'d better have a full report ready.',c:'#2a6aa8',c2:'#cfe6fa',ab:'Forecast',
  perks:['Carries an umbrella everywhere, rain or shine','T: Give a weather report. Listeners are grateful and a few tip','Everyone you forecast to likes you a little more']},
 basketball:{n:'Basketball Pledge',d:'He carries a basketball everywhere he goes, and he\'s not supposed to let it touch the ground for very long.',c:'#d8662a',c2:'#ffe0c4',ab:'Shoot',
  perks:['A basketball always in your hand','T: Throw the ball. It stuns whoever it hits','Never gets winded: stamina comes back faster']},
 pouch:{n:'Pouch Pledge',d:'He wears a fanny pack stuffed with whatever a brother might ask for, whether that\'s a Gatorade, chapstick, or a phone charger.',c:'#7a4a24',c2:'#f0dcc0',ab:'Dig',
  perks:['A fanny pack that holds everything','T: Dig in the pouch. Gatorade, protein bars, coffee, chargers','Short cooldown, always something useful']},
 grenade:{n:'Grenade Pledge',d:'If a brother drops something and yells "GRENADE!", he has to throw himself on top of it, no matter where they are.',c:'#4a6a2a',c2:'#d8eab8',ab:'Dive',
  perks:['Wears a dummy grenade on the belt','T: Dive forward. You are untouchable for a moment','Land it and everyone around you gets knocked flat']},
 morning:{n:'Morning Pledge',d:'His job is to get the whole house out of bed every morning between 6 and 9, and nobody has ever accused him of being quiet about it.',c:'#c9a046',c2:'#fff0c4',ab:'Reveille',
  perks:['Carries a brass bugle','T: Reveille. Everyone nearby is stunned and fights stop','Do it between 6 and 9 AM for a daily bonus']},
 delinquent:{n:'Delinquent Pledge',d:'He has to pull off at least one harmless bit of chaos somewhere on campus every day, and the brothers expect to hear about it.',c:'#c0302a',c2:'#ffd0cc',ab:'Mayhem',
  perks:['A can of red spray paint in your hand','Hold T: spray paint. Keep it on a wall and you leave a tag','Whoever owns that wall comes after you, and a tag that starts a fight counts for the job']},
 captain:{n:'Pledge Captain',d:'He runs roll call on the front lawn every night at 6 and keeps track of how the whole pledge class is holding up.',c:'#8a6a44',c2:'#f0e4cc',ab:'Rally',
  perks:['A clipboard and a whistle','T: Rally the pledge class. Nearby pledges snap to attention','Class Spirit rises once a day when you rally']},
 hype:{n:'Hype Pledge',d:'He carries the boombox and keeps the energy up wherever the pledge class goes, and he has never once turned it off.',c:'#6a2a8a',c2:'#ecd0ff',ab:'Hype',
  perks:['A boombox on your shoulder','T: Hype. The beat drops and nearby fights cool off','Crowds like you, and Class Spirit goes up once a day']},
 snack:{n:'Snack Pledge',d:'He carries a snack tray around the house, and if you stop by once a day he\'ll hand you something to eat.',c:'#c9822a',c2:'#fff0d0',ab:'Serve',
  perks:['A tray of snacks held out in front of you','T: Serve a snack to whoever is next to you. Instant friends','Eat one yourself when nobody is near. Eight a day']},
 scribe:{n:'Scribe Pledge',d:'He writes down everything the brothers say, and his notebook turns out to be pretty useful when exams roll around.',c:'#2a3a5a',c2:'#d0dcf2',ab:'Note',
  perks:['A notebook in one hand, a pen in the other','T: Write down what someone just said. Each page earns XP','Every fifth page, Grant pays you for the minutes']},
 mascot:{n:'Mascot Pledge',d:'He wears the ram horns, bleats whenever someone tells him to, and starts dancing the moment the mood in the house drops.',c:'#a89a78',c2:'#f4ecd8',ab:'Ram charge',
  perks:['Wears the ram horns','T: Ram charge. Knocks back and stuns everyone in front of you','Bleating lifts Class Spirit once a day']}});
for(const k of PR_KEYS)if(!PROLE[k])PROLE[k]=[PR[k].n,PR[k].d];
const FRUITS=[['grape','Grape'],['orange','Orange'],['pineapple','Pineapple'],['watermelon','Watermelon']];
const BURG={kto:['silver rowing trophy','Kappa Theta Omega'],opd:['ceremonial gavel','Omega Psi Delta'],kan:['game ball','Kappa Alpha Nu'],lxa:['purple paddle','Lambda Chi Alpha'],dlp:['pink flamingo','Delta Lambda Phi'],tz:['crest pillow','Theta Zeta']};
const RS=()=>S.rs||(S.rs={});
const isR=k=>!!(S.pledged&&S.prole===k);
const prStage=()=>clamp(Math.max(S.ch-1,Math.floor((S.day-(S.prDay||S.day))/2)),0,3);
let prSpinOn=0,prPic=null,GHOST=null,GHB={},prNotes=[],prMarks=[];

// ---------------------------------------------------------------- icons (reels, the HUD, the planner)
const PRI={};
function prIcon(k){if(PRI[k])return PRI[k];const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d');q.lineJoin=q.lineCap='round';
  const ol=(w=5)=>{q.lineWidth=w;q.strokeStyle='#1d1a16';q.stroke()};
  const star=(x,y,r,col)=>{q.beginPath();for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,rr=i%2?r*.45:r;q.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}q.closePath();q.fillStyle=col;q.fill();ol(3)};
  const note=(x,y,s,col)=>{q.fillStyle=col;q.strokeStyle='#1d1a16';q.lineWidth=3;q.beginPath();q.ellipse(x,y,9*s,7*s,-.4,0,TAU);q.fill();q.stroke();q.beginPath();q.moveTo(x+8*s,y-2*s);q.lineTo(x+8*s,y-34*s);q.lineTo(x+20*s,y-26*s);q.stroke()};
  if(k==='popstar'){q.save();q.translate(60,70);q.rotate(-.55);q.fillStyle='#2a2a30';q.beginPath();q.moveTo(-9,4);q.lineTo(9,4);q.lineTo(6,52);q.lineTo(-6,52);q.closePath();q.fill();ol();
    q.fillStyle='#c9ccd4';q.fillRect(-12,-2,24,10);q.strokeRect(-12,-2,24,10);q.beginPath();q.arc(0,-20,21,0,TAU);const g=q.createRadialGradient(-7,-28,3,0,-20,22);g.addColorStop(0,'#f4f5f8');g.addColorStop(1,'#7a7e8a');q.fillStyle=g;q.fill();ol();
    q.strokeStyle='rgba(30,30,40,.55)';q.lineWidth=1.6;for(let i=-16;i<=16;i+=6){q.beginPath();q.moveTo(i,-40);q.lineTo(i,0);q.stroke();q.beginPath();q.moveTo(-20,-20+i);q.lineTo(20,-20+i);q.stroke()}q.restore();
    star(100,26,15,'#ffd34a');star(24,30,10,'#ff8ccc');note(96,104,1,'#ff5aa8')}
  else if(k==='stats'){q.fillStyle='#9a6a3a';q.beginPath();q.roundRect?q.roundRect(26,16,76,100,8):q.rect(26,16,76,100);q.fill();ol();q.fillStyle='#fffdf6';q.fillRect(34,30,60,78);q.strokeStyle='#1d1a16';q.lineWidth=3;q.strokeRect(34,30,60,78);
    q.fillStyle='#b9bec8';q.fillRect(48,10,32,16);q.strokeRect(48,10,32,16);q.strokeStyle='#23704f';q.lineWidth=4;for(let i=0;i<4;i++){q.beginPath();q.moveTo(42+i*8,42);q.lineTo(42+i*8,62);q.stroke()}q.beginPath();q.moveTo(38,58);q.lineTo(74,44);q.stroke();
    q.fillStyle='#e2584a';q.fillRect(42,92,10,10);q.fillStyle='#2a6aa8';q.fillRect(56,82,10,20);q.fillStyle='#e2b64c';q.fillRect(70,72,10,30);q.strokeStyle='#1d1a16';q.lineWidth=2;q.strokeRect(42,92,10,10);q.strokeRect(56,82,10,20);q.strokeRect(70,72,10,30);
    q.save();q.translate(98,90);q.rotate(.7);q.fillStyle='#f2c230';q.fillRect(-5,-30,10,44);q.strokeRect(-5,-30,10,44);q.fillStyle='#f0b8a0';q.fillRect(-5,-36,10,7);q.beginPath();q.moveTo(-5,14);q.lineTo(5,14);q.lineTo(0,24);q.closePath();q.fillStyle='#e8cfa0';q.fill();q.stroke();q.restore()}
  else if(k==='skate'){q.save();q.translate(64,62);q.rotate(-.42);q.fillStyle='#d0662a';q.beginPath();q.roundRect?q.roundRect(-54,-16,108,32,16):q.rect(-54,-16,108,32);q.fill();ol();
    q.fillStyle='#ffd34a';q.beginPath();q.moveTo(-18,-6);q.lineTo(-4,-6);q.lineTo(-10,8);q.closePath();q.fill();q.beginPath();q.arc(18,0,8,0,TAU);q.fill();q.strokeStyle='#1d1a16';q.lineWidth=2.5;q.stroke();
    for(const x of[-34,34])for(const y of[20,-20]){q.beginPath();q.arc(x,y*.9+ (y>0?6:-6),8,0,TAU);q.fillStyle='#f3ebd6';q.fill();ol(3.5)}q.restore();
    q.strokeStyle='#1d1a16';q.lineWidth=4;for(const[a,b,l]of[[14,100,26],[22,112,18],[8,88,16]]){q.beginPath();q.moveTo(a,b);q.lineTo(a+l,b-l*.42);q.stroke()}}
  else if(k==='burglar'){q.fillStyle='#8a6a40';q.beginPath();q.moveTo(64,40);q.bezierCurveTo(112,44,116,116,64,118);q.bezierCurveTo(12,116,16,44,64,40);q.fill();ol();q.fillStyle='#6a4e2c';q.beginPath();q.ellipse(64,40,16,7,0,0,TAU);q.fill();ol(3);
    q.font='900 46px Archivo,Arial';q.textAlign='center';q.textBaseline='middle';q.fillStyle='#e2b64c';q.strokeStyle='#1d1a16';q.lineWidth=4;q.strokeText('$',64,84);q.fillText('$',64,84);
    q.fillStyle='#16181f';q.beginPath();q.moveTo(10,22);q.bezierCurveTo(30,6,50,12,64,20);q.bezierCurveTo(78,12,98,6,118,22);q.bezierCurveTo(108,40,84,40,64,32);q.bezierCurveTo(44,40,20,40,10,22);q.fill();
    q.fillStyle='#fffdf6';q.beginPath();q.ellipse(40,24,9,6,.1,0,TAU);q.fill();q.beginPath();q.ellipse(88,24,9,6,-.1,0,TAU);q.fill();q.fillStyle='#1d1a16';q.beginPath();q.arc(42,25,3.5,0,TAU);q.fill();q.beginPath();q.arc(90,25,3.5,0,TAU);q.fill()}
  else if(k==='fruit'){q.save();q.translate(70,74);q.fillStyle='#3f8a2e';q.beginPath();q.arc(0,0,48,PI*.05,PI*.95);q.closePath();q.fill();ol();q.fillStyle='#f3f0d0';q.beginPath();q.arc(0,0,41,PI*.05,PI*.95);q.closePath();q.fill();q.fillStyle='#e8445a';q.beginPath();q.arc(0,0,36,PI*.05,PI*.95);q.closePath();q.fill();
    q.fillStyle='#1d1a16';for(const[a,r]of[[.5,20],[1.2,24],[1.9,22],[2.6,18],[.9,10],[2.2,9]]){q.beginPath();q.ellipse(Math.cos(a)*r,Math.sin(a)*r+3,2.6,4,a,0,TAU);q.fill()}q.restore();
    for(const[x,y]of[[24,26],[36,22],[30,36],[18,38],[42,34],[26,48],[38,46]]){q.beginPath();q.arc(x,y,8,0,TAU);q.fillStyle='#7a3a9a';q.fill();q.lineWidth=2.5;q.strokeStyle='#1d1a16';q.stroke();q.fillStyle='rgba(255,255,255,.45)';q.beginPath();q.arc(x-3,y-3,2.5,0,TAU);q.fill()}
    q.strokeStyle='#5a3d26';q.lineWidth=4;q.beginPath();q.moveTo(30,16);q.lineTo(34,6);q.stroke();q.fillStyle='#5f9b2e';q.beginPath();q.ellipse(42,9,9,4,-.3,0,TAU);q.fill();q.lineWidth=2.5;q.strokeStyle='#1d1a16';q.stroke()}
  else if(k==='ouija'){q.fillStyle='#d9c08a';q.beginPath();q.roundRect?q.roundRect(10,52,108,66,10):q.rect(10,52,108,66);q.fill();ol();q.fillStyle='#3a2414';q.font='700 11px Georgia';q.textAlign='center';q.fillText('YES',30,66);q.fillText('NO',100,66);
    q.font='700 9px Georgia';const L='ABCDEFGHIJKLM';for(let i=0;i<13;i++){const a=PI+.35+i*(PI-.7)/12;q.fillText(L[i],64+Math.cos(a)*44,110+Math.sin(a)*30)}
    q.fillStyle='#f6f1e3';q.beginPath();q.moveTo(64,74);q.bezierCurveTo(84,74,86,96,64,108);q.bezierCurveTo(42,96,44,74,64,74);q.fill();ol(3);q.beginPath();q.arc(64,88,5,0,TAU);q.fillStyle='#3a2414';q.fill();
    q.fillStyle='rgba(246,248,255,.96)';q.beginPath();q.moveTo(40,52);q.bezierCurveTo(36,8,92,8,88,52);q.lineTo(92,62);q.lineTo(82,56);q.lineTo(74,64);q.lineTo(64,56);q.lineTo(54,64);q.lineTo(46,56);q.lineTo(36,62);q.closePath();q.fill();ol(4);
    q.fillStyle='#1d1a16';q.beginPath();q.ellipse(55,32,4.5,7,0,0,TAU);q.fill();q.beginPath();q.ellipse(73,32,4.5,7,0,0,TAU);q.fill();q.beginPath();q.ellipse(64,46,4,5,0,0,TAU);q.fill()}
  else if(k==='caveman'){q.save();q.translate(66,66);q.rotate(.75);q.fillStyle='#8a5426';q.beginPath();q.moveTo(-7,52);q.lineTo(7,52);q.lineTo(17,-30);q.quadraticCurveTo(0,-56,-17,-30);q.closePath();q.fill();ol();
    q.fillStyle='#6a3e1a';for(const[x,y]of[[-9,-22],[8,-34],[10,-12],[-5,-2]]){q.beginPath();q.arc(x,y,5,0,TAU);q.fill();q.lineWidth=2;q.strokeStyle='#1d1a16';q.stroke()}q.restore();
    q.save();q.translate(36,98);q.rotate(-.5);q.fillStyle='#f3ebd6';q.fillRect(-20,-5,40,10);for(const x of[-22,22])for(const y of[-6,6]){q.beginPath();q.arc(x,y,7,0,TAU);q.fill()}q.lineWidth=3;q.strokeStyle='#1d1a16';q.strokeRect(-20,-5,40,10);q.restore();
    q.font='900 20px Archivo,Arial';q.fillStyle='#e2b64c';q.strokeStyle='#1d1a16';q.lineWidth=4;q.textAlign='center';q.strokeText('OOGA!',94,118);q.fillText('OOGA!',94,118)}
  else if(k==='weather'){q.fillStyle='#2a6aa8';q.beginPath();q.moveTo(8,70);q.bezierCurveTo(10,16,118,16,120,70);q.bezierCurveTo(108,60,98,60,90,70);q.bezierCurveTo(80,60,70,60,64,70);q.bezierCurveTo(56,60,46,60,38,70);q.bezierCurveTo(30,60,18,60,8,70);q.fill();ol();q.strokeStyle='#1d1a16';q.lineWidth=5;q.beginPath();q.moveTo(64,70);q.lineTo(64,108);q.arc(54,108,10,0,PI);q.stroke();q.fillStyle='#7ab8ee';for(const[x,y]of[[20,96],[36,112],[88,100],[104,112],[76,84]]){q.beginPath();q.ellipse(x,y,3,6,0,0,TAU);q.fill()}}
  else if(k==='basketball'){q.fillStyle='#e07a2a';q.beginPath();q.arc(64,64,48,0,TAU);q.fill();ol();q.strokeStyle='#1d1a16';q.lineWidth=3.5;q.beginPath();q.moveTo(16,64);q.lineTo(112,64);q.moveTo(64,16);q.lineTo(64,112);q.stroke();q.beginPath();q.arc(-6,64,48,-.9,.9);q.stroke();q.beginPath();q.arc(134,64,48,PI-.9,PI+.9);q.stroke()}
  else if(k==='pouch'){q.fillStyle='#7a4a24';q.beginPath();q.moveTo(22,60);q.bezierCurveTo(10,100,30,118,64,118);q.bezierCurveTo(98,118,118,100,106,60);q.closePath();q.fill();ol();q.fillStyle='#8f5a2c';q.beginPath();q.moveTo(20,58);q.bezierCurveTo(30,34,98,34,108,58);q.bezierCurveTo(80,70,48,70,20,58);q.fill();ol();q.fillStyle='#e2b64c';q.beginPath();q.arc(64,66,7,0,TAU);q.fill();ol(3);q.fillStyle='#3aa06a';q.fillRect(86,6,16,36);q.strokeStyle='#1d1a16';q.lineWidth=3;q.strokeRect(86,6,16,36);q.fillStyle='#f2c230';q.fillRect(86,14,16,10)}
  else if(k==='grenade'){q.fillStyle='#4a6a2a';q.beginPath();q.ellipse(64,76,34,40,0,0,TAU);q.fill();ol();q.strokeStyle='#2e4219';q.lineWidth=3;for(let y=52;y<=100;y+=16){q.beginPath();q.moveTo(34,y);q.lineTo(94,y);q.stroke()}for(let x=44;x<=84;x+=20){q.beginPath();q.moveTo(x,38);q.lineTo(x,114);q.stroke()}q.fillStyle='#8a8f98';q.fillRect(54,22,20,14);q.strokeStyle='#1d1a16';q.lineWidth=3;q.strokeRect(54,22,20,14);q.beginPath();q.moveTo(74,26);q.lineTo(104,18);q.lineTo(108,30);q.stroke();q.beginPath();q.arc(98,12,9,0,TAU);q.strokeStyle='#c9ccd4';q.lineWidth=4;q.stroke()}
  else if(k==='morning'){q.fillStyle='#c9a046';q.beginPath();q.arc(64,70,42,0,TAU);q.fill();ol();q.fillStyle='#fffdf6';q.beginPath();q.arc(64,70,32,0,TAU);q.fill();ol(3);q.strokeStyle='#1d1a16';q.lineWidth=5;q.beginPath();q.moveTo(64,70);q.lineTo(64,48);q.moveTo(64,70);q.lineTo(82,78);q.stroke();for(const s2 of[-1,1]){q.fillStyle='#e2584a';q.beginPath();q.arc(64+s2*32,30,13,PI,TAU);q.fill();ol(3)}q.strokeStyle='#ffb14a';q.lineWidth=4;for(const[a,b,c2,d]of[[10,16,20,28],[118,16,108,28],[64,2,64,14]]){q.beginPath();q.moveTo(a,b);q.lineTo(c2,d);q.stroke()}}
  else if(k==='delinquent'){q.fillStyle='#c0302a';q.fillRect(40,44,36,70);q.strokeStyle='#1d1a16';q.lineWidth=4;q.strokeRect(40,44,36,70);q.fillStyle='#c9ccd4';q.fillRect(44,28,28,18);q.strokeRect(44,28,28,18);q.fillStyle='#1d1a16';q.fillRect(54,18,8,10);q.fillStyle='#f2efe6';q.fillRect(40,70,36,14);q.fillStyle='#e2b64c';for(const[x,y,r2]of[[92,36,8],[104,26,6],[98,50,10],[112,44,5],[86,22,5]]){q.beginPath();q.arc(x,y,r2,0,TAU);q.fill()}}
  else if(k==='captain'){q.fillStyle='#d8b048';q.beginPath();q.arc(52,76,32,0,TAU);q.fill();ol();q.fillStyle='#b8923a';q.fillRect(68,50,50,24);q.strokeStyle='#1d1a16';q.lineWidth=4;q.strokeRect(68,50,50,24);q.beginPath();q.arc(52,76,12,0,TAU);q.fillStyle='#1d1a16';q.fill();q.strokeStyle='#8a8f98';q.lineWidth=4;q.beginPath();q.moveTo(52,44);q.bezierCurveTo(52,12,100,8,108,30);q.stroke();star(100,102,14,'#ffd34a')}
  else if(k==='hype'){q.fillStyle='#2a2a30';q.beginPath();q.roundRect?q.roundRect(10,40,108,66,10):q.rect(10,40,108,66);q.fill();ol();q.strokeStyle='#1d1a16';q.lineWidth=5;q.beginPath();q.moveTo(36,40);q.bezierCurveTo(36,12,92,12,92,40);q.stroke();for(const x of[34,94]){q.fillStyle='#8a8f98';q.beginPath();q.arc(x,76,21,0,TAU);q.fill();ol(3);q.fillStyle='#2a2a30';q.beginPath();q.arc(x,76,10,0,TAU);q.fill()}q.fillStyle='#e2b64c';q.fillRect(52,58,24,12);note(112,30,.8,'#ff5aa8')}
  else if(k==='snack'){q.fillStyle='#c9ccd4';q.beginPath();q.ellipse(64,86,54,16,0,0,TAU);q.fill();ol();for(const[x,y,c2]of[[36,66,'#d8a040'],[64,58,'#c0302a'],[92,66,'#7a4a2a'],[50,76,'#f2c230'],[78,78,'#e8884a']]){q.beginPath();q.arc(x,y,13,0,TAU);q.fillStyle=c2;q.fill();ol(3)}}
  else if(k==='scribe'){q.fillStyle='#2a3a5a';q.fillRect(28,14,72,100);q.strokeStyle='#1d1a16';q.lineWidth=4;q.strokeRect(28,14,72,100);q.fillStyle='#fffdf6';q.fillRect(38,22,56,84);q.strokeStyle='#4a6aa8';q.lineWidth=2;for(let y=36;y<=96;y+=12){q.beginPath();q.moveTo(42,y);q.lineTo(90,y);q.stroke()}q.save();q.translate(98,86);q.rotate(.7);q.fillStyle='#f2c230';q.fillRect(-5,-34,10,48);q.strokeStyle='#1d1a16';q.lineWidth=2.5;q.strokeRect(-5,-34,10,48);q.beginPath();q.moveTo(-5,14);q.lineTo(5,14);q.lineTo(0,24);q.closePath();q.fillStyle='#e8cfa0';q.fill();q.stroke();q.restore()}
  else if(k==='mascot'){q.fillStyle='#e8dcc0';q.strokeStyle='#1d1a16';q.lineWidth=5;for(const s2 of[-1,1]){q.beginPath();q.moveTo(64+s2*14,56);q.bezierCurveTo(64+s2*60,40,64+s2*62,96,64+s2*34,92);q.bezierCurveTo(64+s2*44,82,64+s2*42,60,64+s2*20,66);q.closePath();q.fill();q.stroke()}q.fillStyle='#f0e6d0';q.beginPath();q.ellipse(64,86,24,30,0,0,TAU);q.fill();ol();q.fillStyle='#1d1a16';q.beginPath();q.arc(54,82,4,0,TAU);q.arc(74,82,4,0,TAU);q.fill();q.beginPath();q.ellipse(64,102,7,5,0,0,TAU);q.fill()}
  else if(k==='cone'){q.fillStyle='#2a2a30';q.fillRect(14,100,100,14);q.strokeStyle='#1d1a16';q.lineWidth=4;q.strokeRect(14,100,100,14);q.fillStyle='#ff6a1a';q.beginPath();q.moveTo(64,10);q.lineTo(100,100);q.lineTo(28,100);q.closePath();q.fill();ol();q.fillStyle='#f6f2e8';q.beginPath();q.moveTo(54,38);q.lineTo(74,38);q.lineTo(80,56);q.lineTo(48,56);q.closePath();q.fill();q.beginPath();q.moveTo(42,72);q.lineTo(86,72);q.lineTo(92,88);q.lineTo(36,88);q.closePath();q.fill()}
  return PRI[k]=c}
const prIconURL=k=>(prIcon(k).__u||(prIcon(k).__u=prIcon(k).toDataURL()));

// ---------------------------------------------------------------- textures for the props
const PRTX={};
const prTex=(k,w,h,f)=>PRTX[k]||(PRTX[k]=(()=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t})());
const texLeopard=()=>prTex('leo',256,256,(q,w,h)=>{q.fillStyle='#d79c45';q.fillRect(0,0,w,h);for(let i=0;i<70;i++){const x=rnd()*w,y=rnd()*h,r=7+rnd()*7;q.fillStyle='#b9792e';q.beginPath();q.ellipse(x,y,r,r*.8,rnd()*3,0,TAU);q.fill();q.strokeStyle='#2a1a0e';q.lineWidth=3.2;for(let a=0;a<3;a++){const s=rnd()*TAU;q.beginPath();q.arc(x,y,r,s,s+1.3);q.stroke()}}});
const texMelon=()=>prTex('mel',256,128,(q,w,h)=>{q.fillStyle='#4f9a36';q.fillRect(0,0,w,h);q.fillStyle='#1f4f1a';for(let i=0;i<12;i++){const x0=i*w/12;q.beginPath();q.moveTo(x0,0);for(let y=0;y<=h;y+=8)q.lineTo(x0+Math.sin(y*.15+i)*4+5,y);for(let y=h;y>=0;y-=8)q.lineTo(x0+Math.sin(y*.15+i)*4+13,y);q.fill()}});
const texPine=()=>prTex('pin',128,128,(q,w,h)=>{q.fillStyle='#c98a26';q.fillRect(0,0,w,h);q.strokeStyle='#6a4214';q.lineWidth=3;for(let i=-8;i<16;i++){q.beginPath();q.moveTo(i*16,0);q.lineTo(i*16+h,h);q.stroke();q.beginPath();q.moveTo(i*16,h);q.lineTo(i*16+h,0);q.stroke()}q.fillStyle='#8a5a18';for(let x=8;x<w;x+=16)for(let y=0;y<h;y+=16){q.beginPath();q.arc(x,y,2.4,0,TAU);q.fill()}});
const texOuija=()=>prTex('oui',256,176,(q,w,h)=>{q.fillStyle='#d9c08a';q.fillRect(0,0,w,h);q.strokeStyle='#5a3a1e';q.lineWidth=5;q.strokeRect(6,6,w-12,h-12);q.fillStyle='#3a2414';q.textAlign='center';q.textBaseline='middle';q.font='700 20px Georgia';q.fillText('YES',44,30);q.fillText('NO',w-40,30);
  q.font='700 17px Georgia';const A='ABCDEFGHIJKLM',B='NOPQRSTUVWXYZ';for(let i=0;i<13;i++){const a=PI+.32+i*(PI-.64)/12;q.fillText(A[i],128+Math.cos(a)*104,108+Math.sin(a)*62)}for(let i=0;i<13;i++){const a=PI+.32+i*(PI-.64)/12;q.fillText(B[i],128+Math.cos(a)*86,130+Math.sin(a)*52)}
  q.font='700 15px Georgia';q.fillText('1 2 3 4 5 6 7 8 9 0',128,140);q.fillText('GOOD BYE',128,160);q.beginPath();q.arc(128,30,10,0,TAU);q.fill();q.fillStyle='#d9c08a';q.beginPath();q.arc(132,27,9,0,TAU);q.fill()});
const texClip=()=>prTex('clip',96,128,(q,w,h)=>{q.fillStyle='#fffdf6';q.fillRect(0,0,w,h);q.fillStyle='#23704f';q.font='800 14px Archivo,Arial';q.fillText('STATS',8,18);q.strokeStyle='#26221c';q.lineWidth=2.4;for(let r=0;r<5;r++){const y=34+r*18;for(let i=0;i<4;i++){q.beginPath();q.moveTo(10+i*6,y);q.lineTo(10+i*6,y+12);q.stroke()}q.beginPath();q.moveTo(7,y+10);q.lineTo(33,y+2);q.stroke();q.fillStyle='#9aa4b8';q.fillRect(44,y+4,44-r*6,4)}});
const texMask=()=>prTex('mask',128,32,(q,w,h)=>{q.fillStyle='#15171c';q.fillRect(0,4,w,24);q.globalCompositeOperation='destination-out';for(const x of[46,82]){q.beginPath();q.ellipse(x,16,9,6,0,0,TAU);q.fill()}});
const texNote=()=>prTex('note',64,64,(q,w,h)=>{q.font='900 50px Georgia';q.textAlign='center';q.textBaseline='middle';q.lineWidth=6;q.strokeStyle='#3a0a24';q.strokeText('♪',32,34);q.fillStyle='#ff6ab8';q.fillText('♪',32,34)});
const texMark=()=>prTex('mark',128,64,(q,w,h)=>{q.fillStyle='#fffdf6';q.strokeStyle='#23704f';q.lineWidth=5;q.beginPath();q.roundRect?q.roundRect(6,6,116,46,14):q.rect(6,6,116,46);q.fill();q.stroke();q.font='900 28px Archivo,Arial';q.textAlign='center';q.textBaseline='middle';q.fillStyle='#23704f';q.fillText('✎ +1?',64,30)});

// ---------------------------------------------------------------- the props on Danny
function prMesh(geo,mat,par,x,y,z,rx=0,ry=0,rz=0){const m=new THREE.Mesh(geo,typeof mat==='number'?mt(mat,.6):mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;par.add(m);(PM.userData.rp||(PM.userData.rp=[])).push(m);return m}
function prGroup(par,x,y,z,rx=0,ry=0,rz=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.set(rx,ry,rz);par.add(g);(PM.userData.rp||(PM.userData.rp=[])).push(g);return g}
function prClear(){for(const m of PM.userData.rp||[])if(m.parent)m.parent.remove(m);PM.userData.rp=[];PM.HOLD=null;PM.userData.board=null;PM.userData.fruit=null;PM.userData.mic=null;PM.userData.can=null}
function prFruitMesh(par,st){const T=prGroup(par,0,0,0);
  if(st===0){const G=GC.grape||(GC.grape=new THREE.SphereGeometry(.024,10,8)),M=SM({color:0x6a2a8a,roughness:.25});for(const[x,y,z]of[[0,0,0],[.03,.01,.01],[-.028,.012,.012],[.012,.04,0],[-.014,.038,.018],[.02,-.03,.012],[-.016,-.028,.008],[0,-.056,.01],[.03,.042,.02]])prMesh(G,M,T,x,y,z);prMesh(new THREE.CylinderGeometry(.004,.004,.05,5),0x5a3d26,T,0,.08,0)}
  else if(st===1){prMesh(new THREE.SphereGeometry(.065,18,14),SM({color:0xf08a1c,roughness:.6}),T,0,0,0);prMesh(new THREE.SphereGeometry(.018,8,6),0x4f8f25,T,.01,.066,0).scale.set(1.4,.4,.8)}
  else if(st===2){const b=prMesh(new THREE.SphereGeometry(.085,18,14),SM({map:texPine(),roughness:.7}),T,0,0,0);b.scale.set(1,1.38,1);for(let i=0;i<9;i++){const a=i/9*TAU,l=prMesh(new THREE.ConeGeometry(.018,.16-.04*(i%3),4),SM({color:0x3f7a2a,roughness:.7}),T,Math.cos(a)*.02,.18,Math.sin(a)*.02);l.rotation.set(Math.sin(a)*.5,0,-Math.cos(a)*.5)}}
  else{const b=prMesh(new THREE.SphereGeometry(.2,24,16),SM({map:texMelon(),roughness:.35}),T,0,0,0);b.scale.set(1.3,.85,.85)}
  return T}
function prApply(){if(!PM)return;prClear();const k=S.pledged?S.prole:null,p=PM.P;PM.userData.prk=k?k+prStage():'';if(!k){prGhost(0);return}
  if(k==='popstar'){const u=prGroup(p.hR,0,-.1,.05,-.25,0,0);PM.userData.mic=u;prMesh(new THREE.CylinderGeometry(.026,.018,.2,12),SM({color:0x2a2a32,roughness:.35,metalness:.5}),u,0,-.01,0);
    prMesh(new THREE.SphereGeometry(.058,16,12),SM({color:0xd8dce4,roughness:.25,metalness:.85}),u,0,.12,0);prMesh(new THREE.CylinderGeometry(.04,.034,.03,14),SM({color:0xd8b048,roughness:.3,metalness:.8}),u,0,.08,0);
    {const sh=new THREE.Shape();for(let i=0;i<10;i++){const a=PI/2+i*PI/5,rr=i%2?.024:.055;i?sh.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):sh.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}const SG=new THREE.ShapeGeometry(sh),PK=SM({color:0xff4fa0,roughness:.4,side:THREE.DoubleSide}),DK=SM({color:0x1a1420,roughness:.2,metalness:.3,side:THREE.DoubleSide});
      for(const x of[-.068,.068]){const st=prMesh(SG,PK,p.head,x,.132,.198,0,x*1.1,0);const ln=prMesh(new THREE.CircleGeometry(.026,14),DK,st,0,0,.002)}prMesh(bgeo(.05,.012,.012),PK,p.head,0,.14,.205)}
    const boa=prMesh(new THREE.TorusGeometry(.15,.045,8,22),SM({color:0xff5aa8,roughness:1}),p.chest,0,.2,.01,PI/2+.25,0,0);boa.scale.set(1,1.15,1)}
  else if(k==='stats'){const b=prMesh(bgeo(.025,.34,.26),mt(0x9a6a3a,.7),p.hL,.016,-.2,.04);const pg=prMesh(new THREE.PlaneGeometry(.22,.29),SM({map:texClip(),roughness:.9}),b,.014,-.015,0,0,PI/2,0);prMesh(bgeo(.03,.05,.1),SM({color:0xb9bec8,metalness:.7,roughness:.3}),b,.0,.16,0);
    prMesh(new THREE.CylinderGeometry(.007,.007,.17,6),mt(0xf2c230,.6),p.hR,-.004,-.1,.04,1.2,0,0)}
  else if(k==='skate'){const B=new THREE.Group();B.position.set(0,-.1,0);PM.add(B);PM.userData.rp.push(B);PM.userData.board=B;const D=new THREE.Group();D.position.y=.075;B.add(D);B.userData.deck=D;
    const deck=new THREE.Mesh(roundBox(.25,.022,.82,.01,2),SM({color:0xd0662a,roughness:.6}));deck.castShadow=true;D.add(deck);const grip=new THREE.Mesh(roundBox(.24,.004,.8,.002,1),SM({color:0x1b1c20,roughness:1}));grip.position.y=.013;D.add(grip);
    for(const s of[-1,1]){const tr=new THREE.Mesh(bgeo(.18,.03,.05),SM({color:0xaeb3bc,roughness:.35,metalness:.7}));tr.position.set(0,-.026,s*.28);D.add(tr);for(const x of[-.1,.1]){const w=new THREE.Mesh(GC.skw||(GC.skw=new THREE.CylinderGeometry(.03,.03,.036,12).rotateZ(PI/2)),SM({color:0xf3ebd6,roughness:.5}));w.position.set(x,-.045,s*.28);D.add(w)}}
    for(const s of[-1,1]){const t=new THREE.Mesh(roundBox(.25,.022,.13,.01,2),deck.material);t.position.set(0,.02,s*.465);t.rotation.x=-s*.34;t.castShadow=true;D.add(t)}}
  else if(k==='burglar'){const m=prMesh(new THREE.CylinderGeometry(.198,.198,.075,24,1,true,-1.15,2.3),SM({map:texMask(),transparent:true,alphaTest:.5,side:THREE.DoubleSide,roughness:.8}),p.head,0,.158,0);m.scale.set(1,1,1.04);m.castShadow=false;
    const BU=SM({color:0x8a6a40,roughness:1}),sk=prMesh(new THREE.SphereGeometry(1,14,12),BU,p.chest,0,-.04,-.29);sk.scale.set(.17,.2,.13);prMesh(new THREE.ConeGeometry(.07,.12,10),BU,p.chest,0,.19,-.29);prMesh(new THREE.TorusGeometry(.045,.016,6,12),mt(0x4a2e1a,.9),p.chest,0,.15,-.29,PI/2,0,0);
    prMesh(new THREE.CylinderGeometry(.012,.012,.42,5),mt(0x5a3d26,.9),p.chest,.1,.1,-.08,.2,0,-.55)}
  else if(k==='fruit'){const st=prStage();if(st===3){PM.HOLD='tray';PM.userData.fruit=prFruitMesh(p.chest,3);PM.userData.fruit.position.set(0,-.16,.27)}else{const f=prFruitMesh(p.hR,st);f.position.set(0,-.13,.05+st*.02);PM.userData.fruit=f}}
  else if(k==='ouija'){const b=prMesh(bgeo(.022,.3,.44),[SM({map:texOuija(),roughness:.6}),SM({map:texOuija(),roughness:.6}),mt(0x5a3a1e,.6),mt(0x5a3a1e,.6),mt(0x5a3a1e,.6),mt(0x5a3a1e,.6)],p.hL,.018,-.18,.07);texOuija().center.set(.5,.5);texOuija().rotation=-PI/2}
  else if(k==='caveman'){const L=SM({map:texLeopard(),roughness:.95,side:THREE.DoubleSide});const ug=new THREE.CylinderGeometry(.2,.215,.5,24,1,true),upp=ug.attributes.position;for(let i=0;i<upp.count;i++)if(upp.getY(i)>0)upp.setY(i,upp.getY(i)-.1-upp.getX(i)*.55);ug.computeVertexNormals();const up=prMesh(ug,L,p.chest,0,-.06,0);up.scale.set(1.08,1,1.02);
    const sk=new THREE.CylinderGeometry(.21,.29,.34,22,2,true),sp=sk.attributes.position;for(let i=0;i<sp.count;i++)if(sp.getY(i)<-.1)sp.setY(i,sp.getY(i)-((i%3)===0?.05:0));sk.computeVertexNormals();const lo=prMesh(sk,L,p.hips,0,-.08,0);lo.scale.set(1.05,1,.82);
    
    const cl=prGroup(p.hR,0,-.12,.05,2.6,0,0);prMesh(new THREE.CylinderGeometry(.075,.03,.6,10),SM({color:0x7a4a22,roughness:.9}),cl,0,.22,0);for(const[x,y,z]of[[.06,.38,.02],[-.05,.3,.04],[.02,.45,-.06]])prMesh(new THREE.SphereGeometry(.03,8,6),mt(0x5a3416,.9),cl,x,y,z)}
  else if(k==='weather'){PM.HOLD='up';const u=prGroup(p.hR,-.012,-.1,.035,1.7,0,0);prMesh(new THREE.CylinderGeometry(.012,.012,1.1,6),mt(0x222222,.5),u,0,.45,0);const c=prMesh(new THREE.ConeGeometry(.6,.28,12,1,true),SM({color:0x2a6aa8,roughness:.8,side:THREE.DoubleSide}),u,0,1.02,0);prMesh(new THREE.SphereGeometry(.02,6,4),mt(0x222222,.5),u,0,1.16,0)}
  else if(k==='basketball'){const b=prMesh(new THREE.SphereGeometry(.13,18,14),bbMat(),p.hR,0,-.16,.1);PM.userData.ball=b}
  else if(k==='pouch'){const f=prMesh(bgeo(.3,.15,.1),mt(0x5a3a1e,.6),p.hips,0,.06,.15);prMesh(bgeo(.12,.04,.02),mt(0x3a2412,.5),f,0,.02,.055)}
  else if(k==='grenade'){const gm=prMesh(new THREE.SphereGeometry(.07,12,10),mt(0x4a6a2a,.6),p.hips,.17,.02,.1);gm.scale.set(1,1.2,1);prMesh(new THREE.CylinderGeometry(.02,.02,.04,6),mt(0x8a8f98,.4,.5),gm,0,.075,0)}
  else if(k==='morning'){/* V373 a real megaphone: white flared horn with a red rim, a grey mouthpiece and a pistol grip with a trigger, held by the grip */
    const u=prGroup(p.hR,0,-.07,.05,0,0,0);PM.userData.mega=u;const W=SM({color:0xf2f0ea,roughness:.45,side:THREE.DoubleSide}),RD=mt(0xc0302a,.5),GR=mt(0x3a3d44,.6);
    const hz=new THREE.Group();hz.position.set(0,-.02,.07);hz.rotation.x=PI/2;u.add(hz);
    prMesh(new THREE.CylinderGeometry(.11,.04,.26,16,1,true),W,hz,0,.07,0);prMesh(new THREE.TorusGeometry(.11,.012,6,18),RD,hz,0,.2,0,PI/2,0,0);prMesh(new THREE.CylinderGeometry(.045,.045,.09,12),GR,hz,0,-.1,0);prMesh(new THREE.CylinderGeometry(.03,.03,.03,10),mt(0x1c1d21,.6),hz,0,-.155,0);
    prMesh(bgeo(.03,.1,.04),GR,u,0,-.0,.0);prMesh(bgeo(.012,.025,.02),mt(0xc0302a,.5),u,0,.0,.03);PM.userData.megaH=hz}
  else if(k==='delinquent'){/* V374 the can sits through his fist (the curled fingers close around it), cap and nozzle forward; spraying raises it to a wall */const u=prGroup(p.hR,-.035,-.085,0,PI/2,0,0);PM.userData.can=u;prMesh(new THREE.CylinderGeometry(.033,.033,.17,14),mt(0xc0302a,.45),u,0,0,0);prMesh(new THREE.CylinderGeometry(.03,.033,.025,14),SM({color:0xd8dce4,roughness:.3,metalness:.6}),u,0,.097,0);prMesh(new THREE.CylinderGeometry(.009,.009,.022,8),mt(0x1c1c1c,.5),u,0,.12,0);prMesh(new THREE.CylinderGeometry(.0335,.0335,.05,14,1,true),mt(0xf2efe6,.6),u,0,-.02,0)}
  else if(k==='captain'){const b=prMesh(bgeo(.03,.32,.24),mt(0x8a6a44,.7),p.hL,.012,-.2,.03);prMesh(bgeo(.034,.26,.2),mt(0xf2efe6,.8),b,.002,-.02,0);prMesh(new THREE.TorusGeometry(.03,.01,6,10),SM({color:0xd8b048,roughness:.3,metalness:.8}),p.chest,.08,.12,.2)}
  else if(k==='hype'){const sh=!!p.chest;if(sh)PM.HOLD='box';const b=sh?prMesh(bgeo(.17,.26,.46),mt(0x222222,.5),p.chest,.3,.33,-.01):prMesh(bgeo(.17,.26,.46),mt(0x222222,.5),p.hR,0,-.26,0);for(const z of[-.12,.12])prMesh(new THREE.CylinderGeometry(.075,.075,.02,12).rotateZ(PI/2),mt(0x888888,.4,.4),b,.09,0,z);if(sh){prMesh(new THREE.CylinderGeometry(.04,.04,.02,10).rotateZ(PI/2),mt(0xcccccc,.4,.5),b,.09,.07,0);const hd=prMesh(new THREE.TorusGeometry(.06,.012,5,10,PI),mt(0x333333,.5),b,0,.13,0);hd.rotation.y=PI/2}}
  else if(k==='snack'){PM.HOLD='tray';const t=prMesh(bgeo(.5,.025,.32),mt(0xc9ccd2,.4,.4),p.chest,0,-.135,.27);for(let i=0;i<4;i++)prMesh(new THREE.SphereGeometry(.05,8,6),mt([0xd8a040,0xc0302a,0x7a4a2a,0xf2c230][i],.6),t,-.15+i*.1,.05,0)}
  else if(k==='scribe'){prMesh(bgeo(.04,.26,.19),mt(0x2a3a5a,.7),p.hL,.012,-.17,.03);prMesh(new THREE.CylinderGeometry(.007,.007,.17,6),mt(0xf2c230,.6),p.hR,-.004,-.1,.04,1.2,0,0)}
  else if(k==='mascot'){for(const sg of[-1,1])prMesh(new THREE.TorusGeometry(.1,.035,6,12,PI*1.4),mt(0xe8dcc0,.8),p.head,sg*.17,.26,0,0,sg*PI/2,0)}
  else if(k==='cone'){if(RS().cnD===S.day){const u=prGroup(p.hR,0,-.14,.05,-.2,0,0);prMesh(new THREE.ConeGeometry(.12,.4,12),SM({color:0xff6a1a,roughness:.6}),u,0,.2,0);prMesh(new THREE.CylinderGeometry(.075,.092,.07,12),mt(0xf6f2e8,.6),u,0,.15,0);prMesh(bgeo(.26,.03,.26),mt(0x2a2a30,.7),u,0,.01,0)}}
  prGhost(k==='ouija');$('tips')&&($('tips').textContent='Tab: Planner · F: Punch · B: Bike · E: Interact · R: Block · T: '+PR[k].ab)}

// ---------------------------------------------------------------- the ghost that follows the Ouija pledge
function prGhostMesh(){const g=new THREE.Group(),pts=[[0,.62],[.1,.61],[.18,.57],[.24,.49],[.27,.38],[.28,.22],[.29,.05],[.31,-.1],[.34,-.24],[.38,-.36],[.4,-.4]].map(([x,y])=>new THREE.Vector2(x,y));
  const L=new THREE.LatheGeometry(pts,28),p=L.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<-.3){const a=Math.atan2(p.getX(i),p.getZ(i));p.setY(i,y+Math.sin(a*7)*.05)}}L.computeVertexNormals();
  const M=SM({color:0xf2f5ff,emissive:0x8fa4d0,emissiveIntensity:.3,transparent:true,opacity:.84,roughness:.6,side:THREE.DoubleSide});const b=new THREE.Mesh(L,M);g.add(b);g.userData.M=M;
  const E=mt(0x14161c,.4);for(const x of[-.085,.085]){const e=new THREE.Mesh(new THREE.SphereGeometry(.045,12,8),E);e.scale.set(.75,1.15,.45);e.position.set(x,.4,.235);g.add(e)}const mo=new THREE.Mesh(new THREE.SphereGeometry(.04,12,8),E);mo.scale.set(.8,1,.4);mo.position.set(0,.27,.262);g.add(mo);
  for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.SphereGeometry(.08,10,8),M);a.scale.set(.6,1.1,.6);a.position.set(s*.3,.14,.05);a.rotation.z=s*.6;g.add(a)}g.scale.setScalar(.72);return g}
function prGhost(on){if(on&&!GHOST){GHOST=prGhostMesh();GHOST.position.set(P.x-1,P.y+1.6,P.z-1);sc.add(GHOST);GHB={g:GHOST,bub:null,bubT:0,st:0}}if(!on&&GHOST){sc.remove(GHOST);GHOST=null}}

// ---------------------------------------------------------------- how Danny talks: sung, or cave-speak
const prHash=t=>{let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return Math.abs(h)};
function prSing(t){const m=/^(.*?)([.!?…]*)$/.exec(t);let b=m[1],e=m[2]||'';const w=/([A-Za-z']*[aeiouyAEIOUY]+)([^aeiouyAEIOUY\s]*)(\W*)$/.exec(b);if(w){const v=w[1].match(/[aeiouyAEIOUY]+$/)[0];b=b.slice(0,w.index)+w[1]+v.slice(-1).repeat(2)+w[2]+w[3]}return b+'~'+e}
function prCave(t){let s=' '+t+' ';s=s.replace(/\bI'm\b|\bI am\b/g,'Me').replace(/\bI've\b|\bI'd\b|\bI'll\b/g,'Me').replace(/\bI\b/g,'Me').replace(/\b[Mm]y\b/g,'me').replace(/\b(you're|you are)\b/gi,'you').replace(/\b(can't|don't|won't|isn't|aren't|not)\b/gi,'no').replace(/\b(a|an|the|is|are|am|was|were|to|of)\s+/gi,'').replace(/\s+/g,' ').trim();
  s=s.charAt(0).toUpperCase()+s.slice(1);const h=prHash(t)%4;return h===0?'OOGA BOOGA! '+s:h===1?s+' UGH.':h===2?'Ooga. '+s+' Booga.':s+' OOGA BOOGA!'}
function prLine(l){if(!S.pledged||!(S.prole==='popstar'||S.prole==='caveman')||typeof l!=='string')return l;const m=/^(\s*)"([^"]+)"(.*)$/.exec(l);if(!m)return l;
  return S.prole==='popstar'?m[1]+'♪ "'+prSing(m[2])+'" ♪'+m[3]:m[1]+'"'+prCave(m[2])+'"'+m[3]}
function prSay(t,d=2.8){bubble(DANNY,t,d);DANNY.bub.position.y=3.25;DANNY.bubT=d}
function prMelody(n=6,base=523){const sc_=[0,2,4,5,7,9,11,12],tr=prHash(String(TT))%5;for(let i=0;i<n;i++){const f=base*Math.pow(2,sc_[(i*3+tr+(i%2?2:0))%8]/12);tone(f,.2,'triangle',.07,i*.16);tone(f*2,.12,'sine',.02,i*.16)}}
function prSpoke(l){if(typeof l==='string'&&/^\s*"/.test(l))try{DAN_TALK=performance.now()+Math.min(2600,Math.max(1300,l.length*BAB_DT*1000));babble(DANNY,l,1)}catch(e){}if(!S.pledged||typeof l!=='string'||!/^\s*"/.test(l))return;const t=prLine(l).replace(/\s*\([^)]*\)\s*$/,'');if(S.prole==='popstar'){prSay(t.length>60?t.slice(0,58)+'…♪':t,2.8);prMelody(5+Math.min(4,Math.floor(t.length/18)));P.sing=2.2}
  else if(S.prole==='caveman'){prSay(t.length>60?t.slice(0,58)+'…':t,2.6);tone(110,.18,'sawtooth',.06);tone(92,.22,'sawtooth',.06,.2)}}

// ---------------------------------------------------------------- passive effects, called from the game's own systems
const prSk=()=>isR('skate')&&!P.bike&&!P.kart&&!P.med;
const prSpeedMul=()=>prSk()?1.42:isR('fruit')&&prStage()===3&&!(RS().fr&&RS().fr.gone)?.9:1;
const prAcc=()=>prSk()?4.6:10;
const prStaMul=()=>prSk()?.62:1;
const prCrouchMul=()=>isR('burglar')?1.75:1;
const prSeeMul=()=>isR('burglar')&&(K.KeyC||toggles.KeyC)?.55:1;
const prPunchMul=()=>isR('caveman')?1.4:1;
function prOdds(n){return isR('popstar')?.12:isR('caveman')?(n.cl==='athletes'?.12:-.08):0}
function prBlock(n){if(!isR('ouija')||!GHOST||rnd()>.18)return false;dmgNum(P.x,2.6,P.z,'BOO!','#cfd8ff');sfx('whiff');n.stun=Math.max(n.stun,.8);if(GHB)GHB.lunge=.5;return true}
function prHurt(d){if(!isR('fruit'))return;const f=RS().fr;if(!f||f.gone)return;f.hp-=Math.round(d*(prStage()===3?.45:.8));if(f.hp<=0)prSplat('A punch squashed your '+FRUITS[prStage()][1].toLowerCase()+'!')}
function prSplat(msg){const f=RS().fr;f.hp=0;f.gone=1;const x=P.x+Math.sin(P.face)*.4,z=P.z+Math.cos(P.face)*.4;const g=new THREE.Mesh(new THREE.SphereGeometry(.5,10,8),new THREE.MeshBasicMaterial({color:[0x7a3a9a,0xf08a1c,0xe8c040,0xe8445a][prStage()],transparent:true,opacity:.6,depthWrite:false}));g.position.set(x,P.y+.9,z);sc.add(g);puffs.push([g,1.4]);
  noise(.18,.3,500);sfx('bad');toast(msg+' Hank\'s Market sells a replacement. Andre inspects it at roll call.',4800);prApply()}

// ---------------------------------------------------------------- Danny's pose on top of the normal animation
function prPose(dt){const p=PM&&PM.P;if(!p||!PM.userData)return;const B=PM.userData.board;
  if(B){B.visible=prSk();if(B.visible){PM.position.y+=.1;const sp=Math.hypot(P.vx,P.vz),A=PM.AX||{lz:0};
      p.hips.rotation.y=-1.25;p.hips.position.y=.86;p.spine.rotation.x=.08;p.spine.rotation.z=(A.lz||0)*.8;p.neck.rotation.y=.45;p.head.rotation.y=.75;
      p.lL.rotation.set(-.12,0,.16);p.lR.rotation.set(.1,0,-.16);p.kL.rotation.set(.38,0,0);p.kR.rotation.set(.32,0,0);p.fL.rotation.set(-.2,0,0);p.fR.rotation.set(-.15,0,0);
      if(P.punch<=0&&!PM.HOLD){p.aL.rotation.set(-.1,0,-.62);p.aR.rotation.set(-.1,0,.62);p.eL.rotation.set(-.35,0,0);p.eR.rotation.set(-.35,0,0)}
      const pushing=(K.KeyW||joy.y<-.3)&&sp<5.6&&P.jy<=0;P.pushT=pushing?(P.pushT||0)+dt:0;if(pushing){const ph=Math.sin(P.pushT*8);p.lR.rotation.x=.1+Math.max(0,ph)*.75;p.kR.rotation.x=.12;p.hips.position.y=.82}
      const D=B.userData.deck,T=P.trick;if(T&&P.jy>0){const u=clamp(T.t/T.dur,0,1);D.rotation.set(0,T.k==='shove'||T.k==='360'?u*(T.k==='360'?TAU:PI):0,T.k==='kick'||T.k==='360'?u*TAU:T.k==='heel'?-u*TAU:0);D.position.y=.075+Math.sin(u*PI)*.18}else{D.rotation.set(0,0,0);D.position.y=.075}}}
  /* V373 Morning Pledge: T raises the megaphone to his mouth for a few seconds and he shouts through it, head tilted back */
  {const u=PM.userData.mega;if(u){if(P.mega>0&&P.punch<=0){const k=Math.min(1,P.mega*3,(2.6-P.mega+.3)*4);P.mega=Math.max(0,P.mega-dt);p.aR.rotation.set(-1.5*k,0,-.42*k);p.eR.rotation.set(-1.5*k,0,0);p.hR.rotation.set(0,0,0);p.head.rotation.x-=.12*k;p.spine.rotation.x-=.05*k;p.aR.rotation.z+=Math.sin(TT*30)*.012*k;
      /* the horn points straight ahead from his mouth whatever the arm does */PM.updateMatrixWorld(true);const qp=new THREE.Quaternion();u.parent.getWorldQuaternion(qp);const qc=new THREE.Quaternion();p.chest.getWorldQuaternion(qc);const qt=qp.invert().multiply(qc);u.quaternion.slerp(qt,k);
      /* and its mouthpiece sits just in front of his mouth */const hp=new THREE.Vector3();p.head.getWorldPosition(hp);const fw=new THREE.Vector3(0,0,1).applyQuaternion(qc);const mp=hp.add(fw.multiplyScalar(.2)).add(new THREE.Vector3(0,.05,0));const lp=u.parent.worldToLocal(mp.clone()).sub(new THREE.Vector3(0,-.02,.07-.085).applyQuaternion(u.quaternion));u.position.lerp(lp,k)}else{u.quaternion.set(0,0,0,1);u.position.set(0,-.07,.05)}}}
  /* V374 spraying: arm straight out at the wall, can upright in the fist, a little shake */if(P.spray&&PM.userData.can){p.aR.rotation.set(-1.32+Math.sin(TT*31)*.02,0,-.18);p.eR.rotation.set(-.12,0,0);p.hR.rotation.set(0,0,0);p.spine.rotation.y-=.08}
  const mic=PM.userData.mic;if(mic&&P.sing>0&&P.punch<=0){p.aR.rotation.set(-.55,0,.42);p.eR.rotation.set(-2.25,0,0);p.head.rotation.x-=.12}}

