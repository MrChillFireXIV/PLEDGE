/* V318 The pledge quota. Every pledge job carries a quota that Danny has to fill before Hell Week (chapter 9) will start.
   It has three parts, weighted PQW:
     t  : doing the job with the T key, PQ[role].t times
     sp : five "special cases", marked places on campus where that job is expected to show up
     mg : three trials (minigames) that only that job runs, also at marked places on campus
   Progress lives in S.pq = {k:role, t:count, sp:{i:1}, mg:{i:1}, done}. A new role starts a new quota.
   Places are yearbook-photo landmarks (PHOTOS ids), so every spot is a real, reachable outdoor location.
   Trials reuse the class minigame engines (MGF in 22c) with content written for each job. */
const PQW={t:40,sp:30,mg:30};
const PQ_SORT=(intro,bins,items)=>({intro,bins,items});
const PQ_METER=(intro,act,unit,good,bad)=>({intro,act,unit,good,bad});
const PQ_BEAT=(intro,act,bpm,n)=>({intro,how:"Tap on every beat. Watch the ring pulse.",act,bpm:[bpm-12,bpm,bpm+14],n:n||12,win:[150,125,105],metro:1});
const PQ={
 popstar:{t:12,tv:"Perform for a crowd",host:"Vocal coach",
  sp:[["corbett","Sing on the Corbett Center steps","♪ This one goes out to the College-Conservatory! ♪"],["clara","Serenade the Clara Baur fountain","♪ Oh fountain, fountain, hear my song… ♪"],["clock","Belt the alma mater under the clock tower","♪ ALMA MATER, HEAR US SIIING! ♪"],["goal","Sing the anthem at the Nippert goalposts","♪ …and the hooome of the braaave! ♪"],["anchor","Open-mic night outside the Rusty Anchor","♪ Thank you, Harrowgate! I'm here all semester! ♪"]],
  mg:[["memorial","Sound Check","rhythm",PQ_BEAT("Sound check. Clap in time with the click track or the band walks.","Clap",104)],
      ["uplaza","Remember the Setlist","memory",{intro:"Four coloured lights, four songs. Watch the order of the setlist, then play it back."}],
      ["bcomm","Tune the Band","sort",PQ_SORT("The band is a mess. Send every instrument to its section.",["Strings","Brass","Percussion"],[["Violin","Strings"],["Cello","Strings"],["Banjo","Strings"],["Harp","Strings"],["Trumpet","Brass"],["Tuba","Brass"],["Trombone","Brass"],["French horn","Brass"],["Snare drum","Percussion"],["Cymbals","Percussion"],["Timpani","Percussion"],["Cowbell","Percussion"]])]]},
 stats:{t:15,tv:"Tally something worth counting",host:"Stats tutor",
  sp:[["goal","Count the empty seats at Nippert","…four hundred and twelve. Four hundred and thirteen."],["lib","Count the steps of Langsam Library","Twenty-two steps. Twenty-two. Writing it down."],["fount","Count the jets in the Campus Green fountain","Nine jets. One is clogged. Eight and a half."],["bigo","Measure the Big O statue in pledge-lengths","The Big O is one point four Dannys tall."],["diner","Count the pancakes going out at Ruby's","Thirty-one short stacks before noon. A record."]],
  mg:[["steger","Run the Numbers","math",{intro:"A stat sheet is only as good as its averages. Four problems.",gen:(g,k)=>{const n=3+(k%2),a=Array.from({length:n},()=>2+Math.floor(rnd()*9)),s=a.reduce((x,y)=>x+y,0);if(k<2){const add=(n-s%n)%n;a[0]+=add;const av=(s+add)/n;return{q:"Brothers drank "+a.join(", ")+" beers. What is the average?",a:av,w:[av+1,av-1,av+2],why:"Add them up and divide by "+n+"."}}return{q:"Tonight's tallies: "+a.join(", ")+". What is the total?",a:s,w:[s+2,s-1,s+3],why:"Just add them up."}}}],
      ["rock","Click the Counter","meter",PQ_METER("People are streaming past. Click the hand counter exactly when one crosses the line. Five clicks.","Click","Head","Counted.","Missed one. The sheet is off.")],
      ["budig","Remember the Scoreboard","memory",{intro:"The scoreboard flashes a sequence. A Stats Pledge never forgets one. Repeat it."}]]},
 skate:{t:30,tv:"Land a trick",host:"Skate shop guy",
  sp:[["lions","Ollie past Mick and Mack, the stone lions","Clean! The lions saw nothing."],["uplaza","Grind the University Plaza fountain ledge","Fifty-fifty all the way around!"],["westpav","Kickflip the Nippert West Pavilion stairs","Stuck it! Mostly!"],["tol","Carve a lap around the Tower of Light","Wheeeeee."],["bear","Skate the Bearcat roundabout the wrong way","Sorry! Pledge business!"]],
  mg:[["bcomm","Land the Kickflip","meter",PQ_METER("Pop, flick, catch. Hit the button when the board is flat under your feet. Five tries.","Catch it","Flip","Bolts. Clean landing.","Primo. Ouch.")],
      ["victory","Pump the Half-Pipe","rhythm",PQ_BEAT("Pump at the bottom of every pass to keep your speed.","Pump",92)],
      ["cgreen","Plan the Line","grid",{intro:"Plan a line across the plaza to the green landing pad. Brown squares are benches. Queue your moves, then drop in."}]]},
 burglar:{t:12,tv:"Pick a pocket",host:"A voice in the bushes",
  sp:[["pawn","Case the Lucky Pawn window","Nice watches. Just looking. Just looking."],["police","Walk past the police station looking innocent","Good evening, officers. Lovely station."],["taft","Borrow the pen off the Taft statue","He wasn't using it."],["mcmick","Check the McMicken clock tower door","Locked. Good lock, too. Respect."],["kto","Scout the Kappa Theta Omega columns","Second window from the left. Noted."]],
  mg:[["blegen","Pick the Lock","meter",PQ_METER("Five pins. Set each one the moment the pick sits in the sweet spot.","Set the pin","Pin","Click. It sets.","The pick slips.")],
      ["oldchem","Crack the Safe","memory",{intro:"The safe flashes its combination once. Watch the order, then dial it in."}],
      ["armory","Slip Past the Cameras","grid",{intro:"Plan a route through the hall to the green exit. Brown squares are in camera view. Queue your moves, then go."}]]},
 fruit:{t:15,tv:"Land a fruit slam",host:"Farmers' market lady",
  sp:[["hank","Weigh your fruit at Hank's Market","Hank says it's the biggest one this week."],["mew","Give the fruit some sun in Mew Gardens","Photosynthesize, buddy. You've earned it."],["fount","Rinse the fruit in the Campus Green fountain","Squeaky clean. Do not tell Grant."],["diner","Show the fruit to the cooks at Ruby's","No, it is NOT for the pie."],["statue","Offer the fruit to Herman Schneider","He declined. Politely."]],
  mg:[["slawn","Sort the Harvest","sort",PQ_SORT("A Fruit Pledge knows where everything grows. Sort the crate.",["On a tree","On a vine","In the ground"],[["Apple","On a tree"],["Orange","On a tree"],["Peach","On a tree"],["Cherry","On a tree"],["Grape","On a vine"],["Watermelon","On a vine"],["Pumpkin","On a vine"],["Kiwi","On a vine"],["Carrot","In the ground"],["Potato","In the ground"],["Peanut","In the ground"],["Radish","In the ground"]])],
      ["classen","Slice It Clean","meter",PQ_METER("Fruit salad for forty. Bring the knife down while the fruit is centred on the board. Five cuts.","Chop","Cut","Perfect halves.","Juice everywhere.")],
      ["cgreen","Fruit Stand Order","memory",{intro:"A customer points at four crates in order. Watch, then fill the bag in the same order."}]]},
 ouija:{t:12,tv:"Send the ghost to spook someone",host:"The board",
  sp:[["mcmick","Hold a séance at the McMicken clock tower","Is anybody there? …It says 'office hours'."],["blegen","Ask Blegen Library about its ghost","The planchette is spelling 'overdue'."],["devil","Greet the Forest Devil sculpture","It moved. I'm almost sure it moved."],["memorial","Listen for footsteps in Memorial Hall","Somebody is practising piano. Nobody is in there."],["gatehouse","Knock three times on the gatehouse","Something knocked back."]],
  mg:[["teachers","The Séance","memory",{intro:"The spirit knocks on the four corners of the table. Repeat its knocks exactly, or it gets cranky."}],
      ["figura","Ghost Quiz","quiz",{intro:"The board tests whoever carries it. Four questions.",q:[["Which two words sit in the top corners of a Ouija board?","Yes and No","Hello and Goodbye","Stop and Go","Life and Death","Yes on the left, No on the right."],["What is the pointer on a Ouija board called?","Planchette","Pendulum","Oracle","Stylus","French for 'little plank'."],["What word is printed at the bottom of the board?","Goodbye","Hello","Amen","Maybe","Always say it before you pack up."],["A ghost that throws things around is called a…","Poltergeist","Banshee","Wraith","Zombie","German for 'noisy ghost'."],["What night is Halloween?","October 31","October 13","November 1","Friday the 13th",""]]}],
      ["spencer","Find the Cold Spot","meter",PQ_METER("The air goes cold where a spirit stands. Stop the needle on the cold spot. Five readings.","Take a reading","Reading","Ice cold. Something is here.","Room temperature. Nothing.")]]},
 caveman:{t:15,tv:"Land a club smash",host:"Anthropology grad student",
  sp:[["rock","Worship the Rock of Truth","ROCK GOOD. ROCK TRUE."],["tol","Shout at the Tower of Light","BIG FIRE STICK! WHO MAKE?!"],["bear","Hunt the Bearcat","OOGA CATCH BEAR. BEAR IS… METAL."],["goal","Claim Nippert Stadium as your cave","THIS CAVE VERY BIG. OOGA LIVE HERE NOW."],["hank","Trade a shiny rock at Hank's Market","HANK SAY NO. HANK WANT 'DOLLARS'."]],
  mg:[["armory","Club the Boulder","meter",PQ_METER("Swing when the club is over the crack in the rock. Five swings.","SMASH","Swing","CRACK. Rock lose.","Club bounce. Hand hurt.")],
      ["slawn","Drum Circle","rhythm",PQ_BEAT("Beat the log drum in time with the tribe.","BONK",84)],
      ["french","Stone Age or Not","sort",PQ_SORT("Caveman must know what caveman had. Sort them.",["Stone Age","Modern"],[["Fire","Stone Age"],["Spear","Stone Age"],["Cave painting","Stone Age"],["Flint axe","Stone Age"],["Mammoth hunt","Stone Age"],["Smartphone","Modern"],["Microwave","Modern"],["Pizza delivery","Modern"],["Wi-Fi","Modern"],["Skateboard","Modern"]])]]},
 cone:{t:10,tv:"Shout through your cone",host:"Road crew foreman",
  sp:[["bear","Direct traffic at the Bearcat roundabout","KEEP IT MOVING. This is an official cone."],["gatehouse","Cone off the Clifton Avenue gatehouse","Road closed. By order of the Cone Pledge."],["victory","Announce the score at Victory Plaza","BEARCATS WIN. Probably. I can't see the board."],["lib","Shush Langsam Library through the cone","SHHHHHHHH."],["police","Return a cone to the police station. Then take it back","Just visiting. The cone and I are leaving."]],
  mg:[["westpav","Set the Cone Course","grid",{intro:"Lay a detour to the green pad. Brown squares are open manholes. Queue your moves, then send the cart."}],
      ["edwards","Stack the Cones","meter",PQ_METER("Drop each cone when it lines up over the stack. Five cones.","Drop","Cone","Stacked.","It tips. Cones everywhere.")],
      ["french","Road Sign Quiz","quiz",{intro:"If you carry the cone, you learn the signs. Four questions.",q:[["A red octagon means…","Stop","Yield","Slow down","No parking",""],["Orange diamond signs warn about…","Road work ahead","School zones","Hospitals","Rest stops","Orange is the colour of construction."],["A triangle pointing down means…","Yield","Stop","One way","Dead end",""],["A steady yellow light means…","Prepare to stop","Speed up","Go","Turn only",""],["What are traffic cones mostly made of?","Plastic or rubber","Painted steel","Concrete","Foam","So they bend instead of denting a car."]]}]]},
 weather:{t:15,tv:"Give a weather report",host:"Meteorology TA",
  sp:[["tol","Read the sky from the Tower of Light","Cirrus at twenty thousand feet. Fair weather. You're welcome."],["goal","Give the game-day forecast at Nippert","Seventy percent chance of a home win. Zero percent chance of shade."],["cgreen","Check the wind on the Campus Green","Wind out of the west at 'ruins your hair' miles an hour."],["rock","Deliver the forecast at Sigma Sigma Commons","Tonight: dark. Tomorrow: lighter."],["herald","Phone your forecast in to the Harrowgate Herald","Print it on page one. Above the fold."]],
  mg:[["spencer","Weather Quiz","quiz",{intro:"A forecast is science, pledge. Four questions.",q:[["Tall, dark cumulonimbus clouds bring…","Thunderstorms","Fog","Clear skies","Light breezes",""],["A barometer measures…","Air pressure","Wind speed","Rainfall","Humidity","Falling pressure means a storm is coming."],["An anemometer measures…","Wind speed","Temperature","Cloud height","Snow depth",""],["Water freezes at…","32°F","0°F","50°F","212°F","That's 0°C."],["Hurricanes are ranked in…","Categories 1 to 5","Levels A to F","Stars","Decibels","The Saffir-Simpson scale."]]}],
      ["budig","Read the Barometer","meter",PQ_METER("The needle is jumpy. Take each reading when it settles in the band. Five readings.","Read it","Reading","Logged.","Bad reading. Do it again tomorrow.")],
      ["sheakley","Radar Pattern","memory",{intro:"The radar lights up cells in order as the storm moves. Watch, then track it."}]]},
 basketball:{t:20,tv:"Throw the ball",host:"Assistant coach",
  sp:[["bigo","Pay respects at the Big O statue","Mr. Robertson. Sir. I'm trying my best."],["gym","Dribble through the Rec Center doors","No, I can't put it down. Pledge rules."],["armory","Spin the ball outside the Armory Fieldhouse","Three seconds on one finger. New record."],["sheakley","Run a suicide drill at the Sheakley Center","Baseline. Free throw. Baseline. Why."],["victory","Dribble a lap around Victory Plaza","Left hand only. Coach's orders."]],
  mg:[["steger","Free Throws","meter",PQ_METER("Release at the top of your shot. Five free throws.","Shoot","Shot","Nothing but net.","Brick.")],
      ["slawn","Dribble Drill","rhythm",PQ_BEAT("Keep the dribble on the beat. Lose it and you run laps.","Dribble",116)],
      ["classen","Hoops Quiz","quiz",{intro:"Know the game, pledge. Four questions.",q:[["A shot from beyond the arc is worth…","3 points","2 points","4 points","1 point",""],["How many players per team are on the court?","5","6","7","11",""],["Taking steps without dribbling is called…","Traveling","Icing","Offside","A balk",""],["A regulation rim is how high?","10 feet","8 feet","12 feet","9 feet",""],["A free throw is worth…","1 point","2 points","3 points","Nothing",""]]}]]},
 pouch:{t:12,tv:"Dig something out of the pouch",host:"Housemother",
  sp:[["lib","Deliver chapstick to a brother at Langsam","Cherry or mint? I carry both."],["gym","Run a Gatorade to the Rec Center","Lemon-lime, still cold. Mostly."],["westpav","Bring a phone charger to the West Pavilion","Lightning, USB-C and the old wide one. Covered."],["anchor","Drop off a forgotten wallet at the Rusty Anchor","Found it in the pouch. Don't ask."],["lindner","Hand a brother a pen before his exam at Lindner","Blue or black. And a spare. Good luck."]],
  mg:[["rieveschl","Remember the Orders","memory",{intro:"Four brothers shout orders at once. Watch who asks in what order, then deliver."}],
      ["daap","Pack the Pouch","sort",PQ_SORT("Everything has a pocket. Put it in the right one.",["Drinks","Snacks","Gear"],[["Gatorade","Drinks"],["Coffee","Drinks"],["Water bottle","Drinks"],["Energy drink","Drinks"],["Protein bar","Snacks"],["Beef jerky","Snacks"],["Gummy worms","Snacks"],["Pretzels","Snacks"],["Phone charger","Gear"],["Chapstick","Gear"],["Spare keys","Gear"],["Duct tape","Gear"]])],
      ["oldchem","Quick Zip","meter",PQ_METER("A brother is waiting. Yank the zipper when the pull lines up with the track. Five pockets.","Zip","Pocket","Open. Delivered.","Stuck. He's tapping his foot.")]]},
 grenade:{t:15,tv:"Dive",host:"ROTC cadet",
  sp:[["cgreen","Dive on a dropped frisbee on the Campus Green","GRENADE! …It's a frisbee. Area secure."],["westpav","Dive on a spilled soda at the West Pavilion","GRENADE! I'm sticky. Worth it."],["lib","Dive on a dropped textbook at Langsam","GRENADE! Shhh. Sorry."],["armory","Report for inspection at the Armory Fieldhouse","Grenade Pledge reporting. Belt grenade is a dummy, sir."],["diner","Dive on a dropped fork at Ruby's","GRENADE! Fork neutralized."]],
  mg:[["sheakley","Time the Dive","meter",PQ_METER("Launch when the target is in the zone. Five dives.","DIVE","Dive","Covered it. Textbook.","Belly-flop, two feet short.")],
      ["budig","Low Crawl","grid",{intro:"Plan a crawl under the wire to the green pad. Brown squares are mud pits. Queue your moves, then go."}],
      ["mew","Push-up Cadence","rhythm",PQ_BEAT("Down on the beat. The cadet is counting.","Push",76)]]},
 morning:{t:10,tv:"Sound reveille",host:"Band director",
  sp:[["clock","Sound reveille under the clock tower","RISE AND SHINE, CAMPUS!"],["rock","Wake up Sigma Sigma Commons","GOOD MORNING! IT IS A BEAUTIFUL DAY!"],["cgreen","Bugle the sunrise on the Campus Green","*a slightly flat fanfare*"],["steger","Play wake-up outside the Steger Center","ATTENTION STUDENT LIFE: IT IS MORNING."],["kto","Play reveille at the Kappa Theta Omega columns","WAKE UP, KAPPA THETA! …Running now."]],
  mg:[["corbett","Play Reveille","rhythm",PQ_BEAT("Reveille is quick and bright. Tongue every note on the beat.","Note",126,14)],
      ["memorial","Bugle Calls","memory",{intro:"The director plays a call on four notes. Listen, then play it back."}],
      ["teachers","Morning Quiz","quiz",{intro:"A bugler knows his calls. Four questions.",q:[["Reveille is played to…","Wake everyone up","End the day","Call for dinner","Signal a retreat",""],["Which call ends the day?","Taps","Reveille","Charge","First Call","Lights out."],["How many valves does a bugle have?","None","Three","One","Four","Every note is made with the lips."],["A.M. stands for…","Ante meridiem","After midnight","Any morning","Ahead of midday","Latin for 'before midday'."],["The sun rises in the…","East","West","North","South",""]]}]]},
 delinquent:{t:12,tv:"Cause some mayhem",host:"A hooded senior",
  sp:[["statue","Put a traffic vest on Herman Schneider","Safety first, Herman."],["lions","Give Mick and Mack party hats","They look thrilled. Stone-cold thrilled."],["fount","Add bubble bath to the Campus Green fountain","It's biodegradable. I checked. Run."],["taft","Stick googly eyes on the Taft statue","The Chief Justice sees all."],["police","Leave a whoopee cushion at the police station","Do not look back. Do NOT look back."]],
  mg:[["gatehouse","Tag the Wall","meter",PQ_METER("Chalk, not paint. Press the can while the stencil is lined up. Five letters.","Spray","Letter","Crisp line.","Drips. Amateur hour.")],
      ["french","Lose the Campus Cops","grid",{intro:"Plan a getaway to the green exit. Brown squares are patrols. Queue your moves, then run."}],
      ["daap","Prank or Crime","sort",PQ_SORT("Harmless mayhem only. Know the difference.",["Harmless prank","Too far"],[["Whoopee cushion on Grant's chair","Harmless prank"],["Plastic forks all over the lawn","Harmless prank"],["Googly eyes on a statue","Harmless prank"],["Rubber ducks in the fountain","Harmless prank"],["Plastic wrap across a doorway","Harmless prank"],["Pulling the fire alarm","Too far"],["Slashing tires","Too far"],["Taking someone's car","Too far"],["Breaking a window","Too far"],["Spray paint on a church","Too far"]])]]},
 captain:{t:8,tv:"Rally the pledge class",host:"Andre",
  sp:[["ram","Lead a salute at the bronze ram","PLEDGES! EYES ON THE RAM!"],["goal","Run the pledge-class chant at Nippert","ALPHA! SIG! ALPHA! SIG!"],["rock","Read the pledge oath at the Rock of Truth","Loyalty. Duty. Respect. Louder next time."],["asrback","Inspect the backyard before roll call","Two cups, one sock, one lawn chair. Unacceptable."],["lib","Post the study-hours sheet at Langsam","Mandatory. That means you, too, Ezra."]],
  mg:[["bcomm","Roll Call Order","memory",{intro:"The class lines up in a different order every night. Watch, then call them in the same order."}],
      ["victory","March Cadence","rhythm",PQ_BEAT("Left. Left. Left, right, left. Call it on the beat.","Call it",100)],
      ["steger","Captain's Exam","quiz",{intro:"If you run roll call, you know the rules cold. Four questions.",q:[["What time is roll call?","6 PM","Noon","9 PM","Midnight",""],["Where is roll call held?","The ΑΣΡ front lawn","The throne room","Nippert Stadium","Ruby's Diner",""],["What does the Pledge Captain keep track of?","Class Spirit","The house budget","Parking tickets","The beer supply",""],["What does the Pledge Captain carry?","A clipboard and a whistle","A bugle","A boombox","A traffic cone",""]]}]]},
 hype:{t:10,tv:"Hype up a crowd",host:"Campus DJ",
  sp:[["goal","Hype the student section at Nippert","LET ME HEAR YOU, NIPPERT!"],["bcomm","Start a dance circle on Bearcats Commons","MAKE A CIRCLE! MAKE! A! CIRCLE!"],["gym","Blast the boombox outside the Rec Center","ONE MORE REP! ONE MORE REP!"],["asrback","Sound-check the backyard speakers","CHECK. CHECK. LET'S GOOOO."],["anchor","Warm up the line outside the Rusty Anchor","WHO'S READY FOR TRIVIA NIGHT?!"]],
  mg:[["victory","Drop the Beat","rhythm",PQ_BEAT("Hit the pad on every beat, then the crowd does the rest.","Hit it",120,14)],
      ["westpav","Call and Response","memory",{intro:"You shout it, they shout it back. Watch the chant, then lead it in the same order."}],
      ["slawn","Peak the Crowd","meter",PQ_METER("Drop the bass when the crowd meter is in the green. Five drops.","DROP IT","Drop","The lawn goes OFF.","Too early. Awkward silence.")]]},
 snack:{t:25,tv:"Serve a snack",host:"Dining hall manager",
  sp:[["lib","Feed the all-nighters at Langsam","Pretzels for the finals crowd. No crumbs on the books."],["westpav","Work the stands at the West Pavilion","Peanuts! Get your free pledge peanuts!"],["mew","Set up a snack table in Mew Gardens","Garden party. Gummy worms are thematic."],["steger","Hand out samples at the Steger Center","One per customer. One. Sir."],["herald","Bribe the Herald newsroom with cookies","Off the record: they're oatmeal raisin."]],
  mg:[["classen","Sweet or Salty","sort",PQ_SORT("Two sides of the tray. Don't mix them.",["Sweet","Salty"],[["Gummy worms","Sweet"],["Brownie","Sweet"],["Donut","Sweet"],["Chocolate bar","Sweet"],["Cookie","Sweet"],["Pretzels","Salty"],["Potato chips","Salty"],["Popcorn","Salty"],["Beef jerky","Salty"],["Peanuts","Salty"]])],
      ["edwards","Balance the Tray","meter",PQ_METER("The tray is wobbling. Steady it when it's level. Five steps across the room.","Steady","Step","Not a crumb spilled.","A cookie hits the floor.")],
      ["rieveschl","Take the Order","memory",{intro:"The table orders in a hurry. Watch what they point at, then serve it in that order."}]]},
 scribe:{t:20,tv:"Write down what someone said",host:"Chapter secretary",
  sp:[["blegen","Copy a page from the Blegen archives","'In the year of our founding…' Got it. All of it."],["herald","Fact-check the Harrowgate Herald","Paragraph three, comma splice. I'm telling Grant."],["taft","Take dictation from the Taft statue","He's a slow talker. Appreciated."],["lions","Record the minutes for Mick and Mack","Meeting called to order. Both members silent."],["lindner","Take notes at a Lindner Hall lecture","'Synergy' used nine times. Noted nine times."]],
  mg:[["lib","Dictation","memory",{intro:"Grant talks fast and never repeats himself. Watch the order of his points, then write them down."}],
      ["oldchem","Keep Up With the Speaker","meter",PQ_METER("Start each line the instant he finishes the last one. Five lines.","Write","Line","Word for word.","You lost the thread.")],
      ["teachers","The Minutes Exam","quiz",{intro:"A scribe who can't spell is a liability. Four questions.",q:[["Which is spelled correctly?","Fraternity","Fraternaty","Fraturnity","Fraternety",""],["The minutes of a meeting are…","The written record of it","How long it ran","The agenda","The guest list",""],["Which word means 'word for word'?","Verbatim","Vague","Verbose","Vice versa",""],["Fill in: \"___ late again.\"","They're","Their","There","Thier","Short for 'they are'."],["Shorthand is…","A fast way of writing","Very small handwriting","A typing mistake","Writing with one hand",""]]}]]},
 mascot:{t:15,tv:"Ram charge",host:"Cheer captain",
  sp:[["ram","Bow to the bronze ram","BAAAH. Respect to the original."],["goal","Lead a cheer at the Nippert goalposts","GIVE ME AN A! BAAAAH!"],["bear","Stare down the Bearcat","This campus has room for two mascots. BAAH."],["bigo","Pose for photos at the Big O statue","Horns up! One more! Baah!"],["uplaza","Dance at the University Plaza fountain","*the running man, in horns*"]],
  mg:[["sheakley","Mascot Dance","rhythm",PQ_BEAT("Stomp on the beat. The horns are heavy. Keep your head up.","Stomp",108)],
      ["armory","Charge the Tackling Dummy","meter",PQ_METER("Lower the horns and go when the dummy swings into line. Five charges.","CHARGE","Charge","BAAAM. Dummy down.","You miss and keep running.")],
      ["mew","Horns or No Horns","sort",PQ_SORT("A mascot knows his own kind. Sort the animals.",["Horns","No horns"],[["Ram","Horns"],["Bull","Horns"],["Goat","Horns"],["Rhino","Horns"],["Bison","Horns"],["Bearcat","No horns"],["Horse","No horns"],["Wolf","No horns"],["Eagle","No horns"],["Tiger","No horns"]])]]}};

// ---------------------------------------------------------------- progress
function pqGet(){const k=S.pledged?S.prole:null;if(!k||!PQ[k])return null;let q=S.pq;
  if(!q||q.k!==k){q=S.pq={k,t:0,sp:{},mg:{}};if(S.ch>=9){/* saves and skips already past the gate start with it filled */q.t=PQ[k].t;for(let i=0;i<5;i++)q.sp[i]=1;for(let i=0;i<3;i++)q.mg[i]=1;q.done=1;S.pqI=1}}
  return q}
function pqParts(){const q=pqGet();if(!q)return null;const D=PQ[q.k];return{q,D,t:Math.min(q.t,D.t),sp:Object.keys(q.sp).length,mg:Object.keys(q.mg).length}}
function pqPct(){const p=pqParts();if(!p)return 0;return Math.min(100,Math.floor(PQW.t*p.t/p.D.t+PQW.sp*p.sp/5+PQW.mg*p.mg/3+1e-6))}
function pqOK(){return!S.pledged||!S.prole||!PQ[S.prole]||S.ch>=9||pqPct()>=100}
function pqBump(msg){const q=pqGet();if(!q)return;const pc=pqPct();if(msg)toast(msg+' Quota: '+pc+'%.',3000);
  if(pc>=100&&!q.done){q.done=1;setTimeout(()=>{big('QUOTA COMPLETE',2200);sfx('lvl');gainXP(40);money(20);toast('Your '+PR[q.k].n+' quota is full. Grant slips you $20. Hell Week is open to you now.',6000);try{checkChapter()}catch(e){}},900)}
  try{saveGame()}catch(e){}}
// ---------------------------------------------------------------- part 1: the T key
let PQ_UT=-9;
function pqUse(){const q=pqGet();if(!q||TT-PQ_UT<1.5)return;PQ_UT=TT;const D=PQ[q.k];if(q.t>=D.t)return;q.t++;
  if(q.t>=D.t)pqBump('Job quota met: '+D.tv.toLowerCase()+' ×'+D.t+'.');else if(q.t%5===0||q.t===1)pqBump(D.tv+': '+q.t+' of '+D.t+'.');else if(pqPct()>=100)pqBump('')}
function pqT(){const r=RS(),c0=r.cd||0,s0=r.since||0;prAbility();const r2=RS();if((r2.cd||0)>c0&&(r2.cd||0)>TT&&(S.prole!=='stats'||(r2.since||0)>s0))pqUse()}
// ---------------------------------------------------------------- the marked places
let PQC=null;
function pqPlace(id){const p=PHOTOS.find(a=>a[0]===id);return p||PHOTOS[0]}
function pqSpots(){const q=pqGet();if(!q)return[];if(PQC&&PQC.k===q.k)return PQC.s;const D=PQ[q.k],s=[];
  const put=(kind,i,id)=>{const p=pqPlace(id);let x=p[2]+3.2,z=p[3]+2.6,ok=0;for(const[dx,dz]of[[6,4.5],[-6,4.5],[6,-4.5],[-6,-4.5],[0,6.5],[0,-6.5],[3.2,2.6],[-3.2,2.6],[9,0],[-9,0],[0,9],[0,-9],[10,8],[-10,-8]]){if(freeAt(p[2]+dx,p[3]+dz,.5)){x=p[2]+dx;z=p[3]+dz;ok=1;break}}if(!ok){try{[x,z]=nearFree(x,z,.5)}catch(e){}}s.push({kind,i,x,z,place:p[1]})};
  D.sp.forEach((a,i)=>put('sp',i,a[0]));D.mg.forEach((a,i)=>put('mg',i,a[0]));PQC={k:q.k,s};return s}
function pqPrompts(add){if(P.inside)return;const q=pqGet();if(!q)return;const D=PQ[q.k];
  for(const s of pqSpots()){if(q[s.kind][s.i])continue;if(s.kind==='sp')add(s.x,s.z,2.9,'Special case: '+D.sp[s.i][1],()=>pqSpecial(s.i),1);else add(s.x,s.z,2.9,'Pledge trial: '+D.mg[s.i][1],()=>pqPlay(s.i),1)}}
function pqSpecial(i){const q=pqGet();if(!q||q.sp[i])return;const D=PQ[q.k],a=D.sp[i];q.sp[i]=1;prSay(a[2],3.2);sfx('ok');tone(660,.1,'triangle',.07);tone(880,.14,'triangle',.07,.12);gainXP(6);
  try{for(const n of prNearN(10,m=>!m.auth&&!m.temp).slice(0,3)){bubble(n,pick(['Is that… a pledge?','Classic ΑΣΡ.','Should we tell someone?','Ha! Do it again.','I respect the commitment.']),2.2)}}catch(e){}
  pqBump('Special case '+Object.keys(q.sp).length+' of 5 done.')}
function pqPlay(i){const q=pqGet();if(!q||q.mg[i])return;const D=PQ[q.k],a=D.mg[i],id='pq_'+q.k+i,fn=MGF[a[2]];if(!fn)return;MGD[id]=Object.assign({prof:D.host},a[3]);
  const g=S.ch>=5?1:0;
  openMG(a[1],PR[q.k].n+' trial '+(i+1)+' of 3 · '+pqSpots().find(s=>s.kind==='mg'&&s.i===i).place,(el,close)=>fn(el,g,(pass,sum)=>close(()=>{
    if(pass){q.mg[i]=1;gainXP(15);money(5);sfx('lvl');big('TRIAL PASSED',1400);pqBump(a[1]+' passed: '+sum+' +$5.')}
    else{sfx('bad');toast(a[1]+': '+sum+' Not this time. The trial stays here, so try again whenever you like.',4600)}}),id),
    close=>close(()=>toast('You walk away from the trial. It will still be here.',2800)))}
// ---------------------------------------------------------------- floating markers over the open spots
let PQM=null;
function pqMarkTex(k,kind){const c=document.createElement('canvas');c.width=128;c.height=160;const x=c.getContext('2d'),R_=PR[k];
  x.fillStyle=R_.c2;x.beginPath();x.arc(64,60,54,0,TAU);x.fill();x.lineWidth=8;x.strokeStyle=kind==='mg'?'#e2b64c':R_.c;x.stroke();try{x.drawImage(prIcon(k),24,20,80,80)}catch(e){}
  x.fillStyle=kind==='mg'?'#e2b64c':R_.c;const w=kind==='mg'?76:96;x.fillRect(64-w/2,122,w,30);x.fillStyle=kind==='mg'?'#1b2440':'#fff';x.font='700 20px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(kind==='mg'?'TRIAL':'SPECIAL',64,138);
  const t=new THREE.CanvasTexture(c);return t}
function pqMarks(){const q=pqGet(),k=q?q.k:null;if(!PQM)PQM={k:null,sp:[]};
  if(PQM.k!==k){for(const s of PQM.sp){sc.remove(s);if(s.material.map)s.material.map.dispose();s.material.dispose()}PQM.sp=[];PQM.k=k;
    if(k){const tx={sp:pqMarkTex(k,'sp'),mg:pqMarkTex(k,'mg')};for(const s of pqSpots()){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tx[s.kind],transparent:true,depthWrite:false}));m.scale.set(1.5,1.875,1);m.userData.s=s;m.userData.y=terrH(s.x,s.z)+2.9;m.position.set(s.x,m.userData.y,s.z);m.visible=false;sc.add(m);PQM.sp.push(m)}}}
  for(const m of PQM.sp){const s=m.userData.s,on=!!q&&!P.inside&&!q[s.kind][s.i]&&mode!=='title';m.visible=on;if(on)m.position.y=m.userData.y+Math.sin(TT*2+s.i)*.12}}
// ---------------------------------------------------------------- Grant's speech
let PQ_IB=0;
async function pqIntro(){if(S.pqI||PQ_IB)return;const q=pqGet();if(!q)return;PQ_IB=1;const D=PQ[q.k],R_=PR[q.k],g=NN.grant;
  try{if(g&&NP.includes(g)&&!g.hidden){
    await c1Line(g,'One more thing, '+R_.n+'. Every pledge in this house carries a quota. The job is not a costume. It is a debt.');
    await c1Line(g,'Three ways to pay it. One: do the job. '+D.tv+', '+D.t+' times. Press T. I will know.');
    await c1Line(g,'Two: five special cases around campus. Places where a '+R_.n+' is expected to show up. They are marked. Go to each one.');
    await c1Line(g,'Three: three trials that only a '+R_.n+' can run. Also marked. Pass all three.');
    await c1Line(g,'The patch under your job shows the number. Nobody walks into Hell Week under one hundred percent. Nobody.');
    try{await c8Lines([[DANNY,'(A quota. Of course there is a quota.)']])}catch(e){}}
  }catch(e){console.warn(e)}
  S.pqI=1;PQ_IB=0;if(mode==='cine'&&!CINE)mode='play';toast('Pledge quota: '+pqPct()+'%. Details are in the Planner (Tab → Pledge Class). Marked spots show up around campus.',6000);try{saveGame()}catch(e){}}
function pqTick(){pqMarks();const q=pqGet();if(!q||S.pqI||PQ_IB||mode!=='play'||AM||CINE||EV||prSpinOn||P.inside!=='asr'||P.dead)return;if(S.ch>=9){S.pqI=1;return}pqIntro()}
// ---------------------------------------------------------------- the Hell Week gate
let PQ_GT=-99;
function pqGate(){if(pqOK())return false;if(TT-PQ_GT>40){PQ_GT=TT;const pc=pqPct();setTimeout(()=>{if(mode==='play')toast('Hell Week will not start until your pledge quota is full. You are at '+pc+'%. Check the Planner (Tab → Pledge Class).',7000)},2600)}return true}
// ---------------------------------------------------------------- HUD bar and planner panel
function pqHud(){const e=$('rolq');if(!e)return;const q=pqGet();e.hidden=!q;if(!q)return;const pc=pqPct();if(e.dataset.p!==''+pc){e.dataset.p=''+pc;$('rolqf').style.width=pc+'%';$('rolqn').textContent=pc+'%';e.classList.toggle('full',pc>=100);e.setAttribute('aria-label','Pledge quota '+pc+' percent')}}
function pqWhere(s){const dx=s.x-P.x,dz=s.z-P.z,d=Math.round(Math.hypot(dx,dz));if(P.inside||P.z>OD)return'';const a=Math.atan2(dx,-dz),dir=['N','NE','E','SE','S','SW','W','NW'][Math.round(a/(PI/4)+8)%8];return' · '+d+' m '+dir}
function pqRank(pc){return pc>=100?'Quota full':pc>=75?'Almost a brother':pc>=50?'Pulling your weight':pc>=25?'Getting somewhere':pc>0?'Barely started':'Dead weight'}
/* V323: the job card and the quota are one box. job = {pic, body} from prRosterHTML. */
function pqHTML(job){const p=pqParts();if(!p)return'';const{q,D}=p,pc=pqPct(),R_=PR[q.k],S_=pqSpots(),full=pc>=100;
  const fr={t:p.t/D.t,sp:p.sp/5,mg:p.mg/3},pts=k=>Math.floor(PQW[k]*fr[k]+1e-6);
  const li=(kind,i,txt)=>{const s=S_.find(a=>a.kind===kind&&a.i===i),dn=q[kind][i];return`<li class="${dn?'dn':''}"><span class="pqck">${dn?'✓':''}</span><span class="pqtx"><b>${txt}</b><small>${s.place}${dn?'':pqWhere(s)}</small></span></li>`};
  const pips=(n,tot)=>`<div class="pqpips">${Array.from({length:tot},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div>`;
  const part=(k,name,body,cnt)=>`<div class="pqpart${fr[k]>=1?' dn':''}"><div class="pqph"><b>${name}</b><span>${pts(k)}<small> / ${PQW[k]}%</small></span></div>${body}<div class="pqpc">${fr[k]>=1?'✓ Done':cnt}</div></div>`;
  return`<div class="pqbox${full?' full':''}" style="--rc:${R_.c};--rc2:${R_.c2}">
    ${job?`<div class="pqjob"><img class="pqpic" src="${job.pic}" alt=""><div class="pqjd"><div class="lbl">Your pledge job</div><h3>${R_.n}</h3>${job.body}</div></div>`:''}
    <div class="pqhead"><div class="pqring" style="--p:${pc}" role="img" aria-label="Pledge quota ${pc} percent"><div><b>${pc}<small>%</small></b><span>quota</span></div></div>
      <div class="pqhd"><div class="lbl">Pledge quota</div><h3>${pqRank(pc)}</h3>
        <p class="pqnote">${full?'Quota full. Hell Week is open to you.':'Fill this to 100% before Hell Week (Chapter 9) will start. '+(100-pc)+'% to go.'}</p></div>${job?'':`
      <img class="pqico" src="${prIconURL(q.k)}" alt="">`}</div>
    <div class="pqparts">${part('t','The job',`<div class="pqmini"><i style="width:${Math.round(fr.t*100)}%"></i></div>`,`${D.tv} with <kbd>T</kbd> · ${p.t} of ${D.t}`)}${part('sp','Special cases',pips(p.sp,5),`${p.sp} of 5 found`)}${part('mg','Trials',pips(p.mg,3),`${p.mg} of 3 passed`)}</div>
    <div class="pqcols"><div><div class="lbl">Trials</div><ul>${D.mg.map((a,i)=>li('mg',i,a[1])).join('')}</ul></div>
    <div><div class="lbl">Special cases</div><ul>${D.sp.map((a,i)=>li('sp',i,a[1])).join('')}</ul></div></div></div>`}
