// V119 TEST MODE — open dist/PLEDGE.html?test (or ?test=<interior id>, e.g. ?test=kto or ?test=kto_up) for fast automated checks.
// What it changes (only when ?test is in the URL; normal play is untouched):
//  · skips prewarm()'s full-scene shader pre-render (≈390 of 475 s in a GPU-less headless browser) and the 2.5 s font wait
//  · records every wall-decor piece hangDecor() places in TESTDECOR [{k,id,x,y,z,nx,nz}] (k = decor kind, n = direction into the room)
//  · with ?test=<id>: skips the title screen and drops the player inside that interior, ready to walk around
//  · exposes window.PTEST, the helpers tools/shot.js uses, and sets window.PLEDGE_READY=true when boot is done
const TEST=(()=>{try{return new URLSearchParams(location.search).get('test')}catch(e){return null}})();
const TESTDECOR=[];let TESTPAUSE=0;
function testPrewarm(){try{gfxReady()}catch(e){console.warn(e)}try{TRUCK.visible=false;for(const id in INT)INT[id].g.visible=false;for(const n of NP)n.g.visible=false}catch(e){console.warn(e)}}
function testBoot(){
  window.PTEST={
    ints:()=>Object.keys(INT),
    decor:(f)=>TESTDECOR.filter(d=>!f||(f.k==null||d.k===f.k)&&(f.id==null||d.id===f.id||d.id===f.id+'_up')),
    enter:(id)=>{if(!INT[id])throw new Error('no interior '+id);if(!$('title').hidden)testPlay();goIn(id);return{x0:INT[id].x0,z0:INT[id].z0,w:INT[id].w,d:INT[id].d}},
    // render one still from an explicit camera and return a PNG data URL. Pauses the game loop (call PTEST.resume() to unpause).
    shot:(o)=>{TESTPAUSE=1;sceneSync();const c=new THREE.PerspectiveCamera(o.fov||55,R.domElement.width/R.domElement.height,.1,400);c.position.set(o.x,o.y,o.z);c.lookAt(o.lx,o.ly,o.lz);R.render(sc,c);return R.domElement.toDataURL('image/png')},
    // aim at a decor record (from PTEST.decor) from `dist` metres out into the room
    shotDecor:(d,dist)=>{const id=d.id.replace(/_up$/,'');PTEST.enter(d.id.endsWith('_up')&&INT[d.id]?d.id:id);const r=dist||2.6;return PTEST.shot({x:d.x+d.nx*r,y:d.y-.1,z:d.z+d.nz*r,lx:d.x,ly:d.y,lz:d.z})},
    resume:()=>{TESTPAUSE=0}};
  if(TEST&&INT[TEST]){testPlay();goIn(TEST);toast('TEST MODE · '+INT[TEST].name,2500)}
  window.PLEDGE_READY=true}
function testPlay(){$('title').hidden=true;$('hud').hidden=false;mode='play';S=S0();try{refreshNamed();renderInv()}catch(e){}}
