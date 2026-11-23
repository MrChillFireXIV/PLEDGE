// ================================================================ V433 ?bisect: find which object stops the 3D (made for Edge on Xbox, which loses the 3D context on the first frames)
// Every drawable thing in the scene is moved to camera layer 3 (the camera sees layer 0), so nothing is drawn. Then a few are put back on layer 0 each frame,
// frustum culling off so each one really is drawn, and a description of the batch is written to localStorage BEFORE that frame renders.
// If the 3D context is lost, the error screen (ctxGuard, file 24) shows the last batch: that is the culprit (or, if it dies late, the amount).
const BISS={on:(()=>{try{return/[?&#]bisect\b/.test(location.search+location.hash)}catch(e){return false}})(),list:null,i:0,k:3,t:0};
function bisDesc(o){const m=Array.isArray(o.material)?o.material[0]:o.material,g=o.geometry,mp=m&&(m.map||m.alphaMap||m.emissiveMap);let nm=[];for(let p=o;p&&p!==sc&&nm.length<3;p=p.parent)if(p.name)nm.push(p.name);
  return o.type+' · '+(m?m.type+(m.onBeforeCompile&&String(m.onBeforeCompile).length>20?'+custom':'')+(m.transparent?' transp':'')+(m.vertexColors?' vcol':'')+(m.side===2?' 2side':''):'')+(mp&&mp.image?' · tex '+(mp.image.width||'?')+'x'+(mp.image.height||'?')+(mp.isDataTexture?' data':'')+' f'+mp.format+' t'+mp.type+(mp.anisotropy>1?' an'+mp.anisotropy:''):'')+
    (g&&g.attributes&&g.attributes.position?' · '+g.attributes.position.count+' pts'+(g.index?' '+g.index.array.constructor.name.replace('Array',''):''):'')+(o.isInstancedMesh?' ×'+o.count:'')+(nm.length?' · '+nm.join('<'):'')}
function bisTick(){if(!BISS.on||typeof mode==='undefined'||mode==='loading')return;
  if(!BISS.list){const L=[];sc.traverse(o=>{if(o.isMesh||o.isPoints||o.isLine||o.isSprite)L.push(o)});/* the unusual ones first: what the title camera always draws (frustum culling off), custom shaders, points, lines, sprites. The Xbox stopped on frame 2 with only 47 shapes set up, so the culprit is very likely among these */
    const rank=o=>{const m=Array.isArray(o.material)?o.material[0]:o.material;return(o.frustumCulled===false?0:4)+(m&&(m.isShaderMaterial||m.onBeforeCompile&&String(m.onBeforeCompile).length>20)?0:2)+(o.isMesh?1:0)};L.sort((a,b)=>rank(a)-rank(b));
    for(const o of L){o.layers.set(3);o.userData.bisFc=o.frustumCulled}BISS.list=L;BISS.i=0;
    const d=document.createElement('div');d.id='bisbar';d.style.cssText='position:fixed;left:50%;top:44px;transform:translateX(-50%);z-index:99999;background:#14182c;color:#ffd24a;font:700 18px Arial;padding:8px 18px;border-radius:8px;border:2px solid #ffd24a';document.body.appendChild(d);
    try{localStorage.setItem('pledge.bisect','start · '+L.length+' things to show')}catch(e){}return}
  const L=BISS.list;if(BISS.i>=L.length){if(!BISS.done){BISS.done=1;for(const o of L)o.frustumCulled=o.userData.bisFc;try{localStorage.setItem('pledge.bisect','finished: all '+L.length+' shown with no problem')}catch(e){}const d=$('bisbar');if(d)d.textContent='Finished: all '+L.length+' things drawn, the 3D kept working. Send a photo of this.'}return}
  const add=[],K=BISS.i<300?1:BISS.i<900?4:12;for(let k=0;k<K&&BISS.i<L.length;k++){const o=L[BISS.i++];o.layers.set(0);o.frustumCulled=false;add.push(o)}
  try{localStorage.setItem('pledge.bisect',BISS.i+'/'+L.length+' · '+add.map(bisDesc).join(' | '))}catch(e){}
  const d=$('bisbar');if(d)d.textContent='Testing: '+BISS.i+' of '+L.length+' things drawn'}
