# PLEDGE (THREE.js r128 college game): read this first

Read `MAP.md` next (about 3k tokens). Open only the files you need. The whole game is about 1.5 MB (about 460k tokens), so never read it all.

## Build
- Edit only `src/`, then run `python3 build.py --check`. This builds `dist/PLEDGE.html`, one self-contained file that is the game, and syntax-checks the JavaScript.
- `dist/` isn't in this zip. Build once before testing.
- All `src/js/*.js` files are joined in `src/order.txt` order into one strict-mode `<script>`. They share one global scope:
  - A duplicate `function` name silently replaces the earlier one. A duplicate `const` breaks the build.
  - Check before adding a name: `grep -nw NAME src/js/*.js`.
  - A new file must be added to `order.txt` with its `js/` prefix.
- Most code is written as one-line functions. Never put a `//` comment inside one; it silently comments out the rest of the line. Use `/* */`.
- The shared geometry cache `GC.*` and the material helpers `mt()`/`bm()` are caches. Prefix new `GC` keys with your feature name.

## Test
Testing runs in headless Chromium.
- `tools/q.sh OUT "eval:(async()=>{…;return 'x'})()" "pcam:js:name"`
  - It loads the story drivers, runs your JavaScript, prints the result, and saves `OUT/name.png`.
  - Set `window.__cam=[x,y,z,lookX,lookY,lookZ]` in the eval before `pcam:js`. `pcam` screenshots include the HTML UI.
- Each load takes about 60 s. Put all checks in one command, and never run two at once.
- Jump to a quest with `chapJump('c3house')`, which already starts it. Then:
  - click through cards with `for(…){if(mode==='card'||mode==='wheel')T3.click(0);RT.step(4);await W(8)}` and `C4.auto=1`
  - step the game with `RT.step(n)`.
- The software renderer sometimes crashes ("Target crashed") on busy gameplay frames. Screenshot inside a held cutscene instead: `c6Cine(async()=>{await c4Wt(999)},()=>{})`, then retry.
- `S.pledged=1` with no job opens the Pledge Machine. Also set `S.prole='pouch'`.
- DOM minigames need a stepped clock in headless mode. Do this before starting one:
  `let T=0;Object.defineProperty(performance,'now',{value:()=>T,configurable:true});requestAnimationFrame=f=>setTimeout(()=>{T+=20;f(T)},5)`
- More test options are in the header of `tools/run.js`: `--compare` baseline diffs, `perf`, `views`, `room:ID`.

## Game API cheat sheet
- **Quests:** a quest is `{id,ch,main|side,name,who|at,pre,steps:()=>[…],fin,reset}` in `M`. Step types:
  - `card` via `C_(title,speaker,text,choices)`
  - `go` via `go([x,z],label,{press,act})`, which needs an E press
  - `cond` `{lab,ok,goal,start}`
  - `cine` `{run:done=>…}`
  - `fight`, `event`
  - `c5List(title,items)` for checklists
- **Dialogue (user rule: all speech uses the in-game conversation box):**
  - `c1Line(npc,text,ack)` shows one box.
  - `c8Lines([[npc,text],[DANNY,text],[null,narration,secs],secondsToWait,fn])` runs a scene.
  - `c1Card`, `c1Sub` (subtitle), `bubble(n,text,secs)` (overhead bubble).
- **Cutscenes:** `c6Cine(async fn,done)` / `c8Cine`. Inside one:
  - camera: `c4Shot(pos,look,k)`
  - waiting: `c4Wt(s)`
  - puppets: `c4Dup(id,x,z,a,{pup:1,tag,int})`, `c4To(n,x,z)`, `c4Off(tag)`, `c4DanAt(x,z,face)`
  - fades: `c4Fade(fn)`
- **World:**
  - `goIn(interiorId,localX,localZ)` / `goOut(x,z)`
  - `INT[id]` gives `{x0,z0,w,d,g,objs}`
  - `iobj(I,lx,lz,label,fn,r)` adds an E-prompt object inside an interior
  - `freeAt(x,z,r)`, `nearFree`, `markR(x0,z0,x1,z1,h)` (collision)
- **NPCs:**
  - `spawn(clique,zone,opts)`; `NN.grant` and similar are the named characters; `NP` is all NPCs.
  - Flags: `n.temp`, `n.actor`, `n.foe`, `n.ally`, `n.follow`.
- **Saves:** `saveGame()` writes `{S,px,pz,meta}` to `SAVEK`, the current slot (`pledge.save.v1`, `.s2`, `.s3`).

## How the user works
- After each change:
  - build
  - verify with a screenshot when it's visual
  - zip the project, excluding `dist/`
  - send the zip plus `dist/PLEDGE.html` and the screenshots
  - write a short plain-language summary of what changed, what was tested and what wasn't
  - commit and push to GitHub (`MrChillFireXIV/PLEDGE`, branch `main`): every push rebuilds the live game at https://mrchillfirexiv.github.io/PLEDGE/ (see README.md). Never rename the save keys (`pledge.save.v1`, `.s2`, `.s3`, `pledge.slot`): the publish check stops if they change.
- Every story beat should be visualized and animated, not just a text card. Talking uses conversation boxes.
- Keep `docs/HISTORY.md` growing: add one line per version (`- V212 (files): what changed`).
- Earlier, the user asked for a correctional-facility crowd that was 80% dark-skinned. That was declined, so don't reintroduce it.
