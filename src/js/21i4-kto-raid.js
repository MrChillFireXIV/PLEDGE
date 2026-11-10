// ================================================================ V287 KTHO RAID SCENE (Framing)
/* Once the Cocaine Empire raid is done and until Framing is finished, the KTHO house is closed and the police are still outside:
   three cruisers with flashing lights on the lawn and street, red/blue light on the facade, cops carrying packages of coke out of the front door
   to an evidence table, and KTHO brothers standing in handcuffs next to the cops. Same cheap tricks as the party (merged panes, shared materials). */
const C3KR={on:0,chk:0,g:null,cars:[],npcs:[],boxes:[],ej:0};
const c3kRaidWant=()=>!!(S&&S.ch===3&&S.done&&S.done.c3empire&&!S.done.c3frame);
function c3kRaidProps(){if(C3KR.g)return;const g=new THREE.Group();g.userData.noMerge=1;
  for(const[x,z,r]of[[57.6,26.5,PI/2+.25],[57.2,38.5,PI/2-.2],[66.8,32,PI]]){const car=mkCarMesh();car.position.set(x,terrH(x,z),z);car.rotation.y=r;
    const bar=new THREE.Group(),L=[];for(const s of[-.4,.4]){const l=new THREE.Mesh(bgeo(.7,.16,.3),new THREE.MeshBasicMaterial({color:s<0?0xff2a2a:0x2a6aff}));l.position.x=s;bar.add(l);L.push(l)}bar.position.y=1.72;car.add(bar);car.userData.L=L;g.add(car);C3KR.cars.push(car)}
  /* evidence table with bricks of coke and a couple of bags */
  const tx=54.6,tz=33.4,tb=new THREE.Group();tb.position.set(tx,terrH(tx,tz),tz);const top=new THREE.Mesh(bgeo(.9,.07,2.4),mt(0x7a6a50,.8));top.position.y=.9;tb.add(top);
  for(const[a,b]of[[-.35,-1.1],[.35,-1.1],[-.35,1.1],[.35,1.1]]){const l=new THREE.Mesh(bgeo(.07,.9,.07),mt(0x3a3a3a));l.position.set(a,.45,b);tb.add(l)}
  const wh=mt(0xf4f4f0,.7);for(let i=0;i<12;i++){const k=new THREE.Mesh(bgeo(.2,.1,.13),wh);k.position.set(-.15+(i%2)*.3,.99+Math.floor(i/6)*.1,-.9+((i%6)*.34));k.rotation.y=(i%3-1)*.15;tb.add(k)}
  g.add(tb);sc.add(g);C3KR.g=g}
function c3kRaidSpawn(){for(const n of C3KR.npcs)if(NP.includes(n))despawn(n);C3KR.npcs=[];
  const D=[49.9,31.3],T=[53.7,31.9],mk=(cl,nm,x,z,ha,o)=>{[x,z]=c3Free(x,z,.4);const n=spawn(cl,'greek',Object.assign({x,z,a:ha,mode:'idle',temp:1,name:nm,lvl:8},o));if(!n)return null;n.c3guard=1;n.ha=ha;n.hx=x;n.hz=z;C3KR.npcs.push(n);return n};
  /* two cops shuttle packages from the door to the table */
  [['Officer Dale Kerrigan',0],['Officer Tomas Reyes',1]].forEach(([nm,i])=>{const n=mk('cops',nm,D[0]+i*.9,D[1]-i*1.4,PI/2,{title:'Harrowgate PD'});if(!n)return;n.c3rk='carry';n.rA=[D[0]+i*.4,D[1]+(i?-1.3:.5)];n.rB=[T[0]-.2,T[1]+(i?-.5:.6)];n.rs=i;n.rw=i*1.4;
    const box=new THREE.Mesh(bgeo(.42,.22,.3),mt(0xf4f4f0,.7));box.position.set(0,1.02,.36);box.visible=!!n.rs;n.g.add(box);n.box=box});
  mk('cops','Detective Alana Ruiz',51.4,35.8,PI/2+.5,{title:'Harrowgate PD',fem:true,lvl:9}).c3rk='cop';
  /* three arrested brothers, each with the cop who has them */
  [['Pierce Langford',55.3,23.6,'Officer Mara Voss',56.3,24.4,PI/2],['Dex Calloway',55.4,41.2,'Officer Ben Hollis',56.4,40.4,PI/2],['Tripp Wynn',61.2,29.6,'Officer Gus Pruitt',62.2,30.4,PI/2]].forEach(([bn,bx,bz,cn,cx,cz,a])=>{
    const b=mk('brothers',bn,bx,bz,a-.15,{title:'KTHO Brother',house:'kto',lvl:5});if(b)b.c3rk='cuff';const c=mk('cops',cn,cx,cz,a+PI,{title:'Harrowgate PD',fem:cn.indexOf('Mara')>0});if(c)c.c3rk='cop'})}
function c3kRaidTick(n,dt){const k=n.c3rk;
  if(k==='carry'){if(n.rw>0){n.rw-=dt;n.sp=0;return''}const T=n.rs?n.rB:n.rA,d=Math.hypot(T[0]-n.x,T[1]-n.z);
    if(d<.3){n.rs^=1;n.rw=1.3+rnd()*1.2;n.sp=0;if(n.box)n.box.visible=!!n.rs;return''}
    n.a+=((((Math.atan2(T[0]-n.x,T[1]-n.z)-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*6);moveTo(n,T[0],T[1],1.5,dt);return'walk'}
  n.a+=((((n.ha-n.a)%TAU)+TAU*1.5)%TAU-PI)*Math.min(1,dt*3);if(Math.hypot(n.x-n.hx,n.z-n.hz)>.4)moveTo(n,n.hx,n.hz,1.4,dt);return''}
function c3kRaidOn(){const s=c3S();if(!s.shut.kto)c3Shut('kto');else c3ShutVis('kto');
  c3kBuild();if(C3KP.g)C3KP.g.visible=true;c3kInt(0);c3kRaidProps();C3KR.g.visible=true;C3KR.on=1;try{c3kRaidSpawn()}catch(e){console.warn('c3kRaidSpawn',e)}c3kClear()}
function c3kRaidOff(){C3KR.on=0;if(C3KR.g)C3KR.g.visible=false;if(C3KP.g&&!C3KP.on)C3KP.g.visible=false;for(const n of C3KR.npcs)if(NP.includes(n))despawn(n);C3KR.npcs=[]}
function c3kRaidFrame(dt){if(mode==='title'||mode==='loading'||!INT.kto)return;
  C3KR.chk-=dt;if(C3KR.chk<=0){C3KR.chk=1;const w=c3kRaidWant();if(w&&!C3KR.on)c3kRaidOn();else if(!w&&C3KR.on)c3kRaidOff();else if(C3KR.on&&!C3KR.npcs.every(n=>NP.includes(n)))c3kRaidSpawn()}
  if(!C3KR.on)return;
  const ph=(TT*3.2|0);for(const car of C3KR.cars){const L=car.userData.L;L[0].visible=!!(ph&1);L[1].visible=!(ph&1)}
  if(C3KP.g&&!C3KP.on)C3KP.pm.forEach((m,k)=>{m.color.set(((ph+k)&1)?0xff2020:0x2860ff);m.opacity=.5});
  if(C3KP.g&&!C3KP.on)C3KP.sm.forEach((m,k)=>{m.color.set(((ph+k)&1)?0x2860ff:0xff2020);m.opacity=.4});
  C3KR.ej-=dt;if(C3KR.ej<=0){C3KR.ej=.4;c3kClear()}}
{const _t=c3Tick;c3Tick=function(dt){try{c3kRaidFrame(dt)}catch(e){console.warn('c3kRaidFrame',e)}return _t.apply(this,arguments)}}
