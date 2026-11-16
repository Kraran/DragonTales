// Illustrations vectorielles : un décor par description de lieu (varié selon la case),
// et un dessin par objet, posé dans le décor tant que l'objet est présent.
const SCENES=(function(){
const W=1196,H=396;
let uid=0;
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,horiz){ const id='sg'+(uid++); return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${horiz?1:0}" y2="${horiz?0:1}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function fillRect(stops){ const [u,d]=grad(stops); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; }
function wave(y,amp,r,fill,n){ n=n||4; const st=W/n; let d=`M0 ${(y+(r()-.5)*amp).toFixed(0)}`; for(let i=1;i<=n;i++){ const x=i*st; d+=` Q${(x-st/2).toFixed(0)} ${(y+(r()-.5)*amp*2).toFixed(0)} ${x.toFixed(0)} ${(y+(r()-.5)*amp).toFixed(0)}`; } return `<path d="${d} V${H} H0Z" fill="${fill}"/>`; }
function cactus(x,y,h,fill){ const w=h*.16; return `<g stroke="${fill}" stroke-width="${w.toFixed(1)}" fill="none" stroke-linecap="round"><path d="M${x} ${y} v${-h}"/><path d="M${x} ${y-h*.45} h${-h*.26} v${-h*.3}"/><path d="M${x} ${y-h*.3} h${h*.24} v${-h*.36}"/></g>`; }
function glyphs(x,y,n,c,r,sz){ sz=sz||14; let s=''; for(let i=0;i<n;i++){ const gx=x+i*sz*1.7, k=Math.floor(r()*5);
  s+=k===0?`<rect x="${gx}" y="${y}" width="${sz}" height="${sz}" rx="3" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="${gx+sz/2}" cy="${y+sz/2}" r="2" fill="${c}"/>`
    :k===1?`<path d="M${gx} ${y+sz} v${-sz} h${sz} v${sz*.5} h${-sz*.5}" fill="none" stroke="${c}" stroke-width="2.5"/>`
    :k===2?`<circle cx="${gx+sz/2}" cy="${y+sz/2}" r="${sz/2}" fill="none" stroke="${c}" stroke-width="2.5"/><path d="M${gx} ${y+sz/2} h${sz}" stroke="${c}" stroke-width="2.5"/>`
    :k===3?`<path d="M${gx} ${y} l${sz/2} ${sz} l${sz/2} ${-sz}" fill="none" stroke="${c}" stroke-width="2.5"/>`
    :`<path d="M${gx} ${y+sz*.3} h${sz} M${gx} ${y+sz*.7} h${sz} M${gx+sz/2} ${y} v${sz}" stroke="${c}" stroke-width="2.5"/>`; }
  return `<g opacity=".8">${s}</g>`; }
const veil=()=>{ const [u,d]=grad(['rgba(29,22,38,0)','rgba(29,22,38,0)','rgba(29,22,38,.82)']); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; };

// ---------- décors de plein air ----------
function desert(r,o){
  o=o||{};
  const sk=o.mood==='dark'?['#b98a63','#9c4c40','#43203a']:o.mood==='soft'?['#f7d48a','#eaa066','#8d4d60']:['#f0b765','#d9774a','#7a3550'];
  let s=fillRect(sk);
  const sx=640+r()*430, sy=95+r()*80;
  s+=`<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${o.mood==='dark'?40:54}" fill="${o.mood==='dark'?'#e9b98a':'#fbe3a4'}"/>`;
  if(o.mountain) s+=`<path d="M-30 300 L120 150 L190 205 L285 96 L360 180 L420 150 L560 300Z" fill="#a4606b"/><path d="M285 96 L312 132 L290 126 L270 146 L262 124Z" fill="#f1dcc4"/>`;
  s+=wave(280,34,r,'#9c4a3c');
  const n=2+Math.floor(r()*3);
  for(let i=0;i<n;i++){ const x=(o.mountain?520:150)+r()*(o.mountain?620:980); s+=cactus(x.toFixed(0),(292+r()*8).toFixed(0),(38+r()*44).toFixed(0),'#4a2233'); }
  if(o.edge) s+=`<path d="M300 322 L1196 286 V318 L260 352Z" fill="#2a1322"/><path d="M300 322 L1196 286 V294 L330 328Z" fill="#c26a4a"/><path d="M520 320 l-6 16 M760 309 l-5 15 M990 300 l-5 14" stroke="#5f2c3b" stroke-width="3"/>`;
  if(o.rock==='flat') s+=`<path d="M770 304 Q776 262 840 256 H1000 Q1062 262 1068 304Z" fill="#7b5a66"/><path d="M800 262 H1036" stroke="#b79a96" stroke-width="5" stroke-linecap="round"/>`;
  if(o.rock==='slab') s+=`<path d="M790 306 L826 246 L1030 232 L1062 306Z" fill="#7b5a66"/><path d="M826 246 L1030 232" stroke="#b79a96" stroke-width="5" stroke-linecap="round"/><path d="M900 300 l14 -52 M970 300 l-8 -40" stroke="#5a3f4e" stroke-width="3"/>`;
  if(o.on){ s+=`<path d="M0 396 V332 Q110 300 310 296 H890 Q1090 300 1196 332 V396Z" fill="#7b5a66"/><path d="M300 300 H900" stroke="#b79a96" stroke-width="5" stroke-linecap="round"/><path d="M420 330 l60 22 l80 -10 M760 320 l50 30 M980 338 l40 14" stroke="#5a3f4e" stroke-width="3" fill="none"/>`; }
  else s+=wave(336,22,r,'#5f2c3b');
  if(o.pool){ const c=o.pool==='yellow'?['#e6c740','#f7e58c']:['#4fa9c9','#a9e0ee']; s+=`<ellipse cx="600" cy="322" rx="170" ry="24" fill="${c[0]}"/><ellipse cx="560" cy="316" rx="80" ry="7" fill="${c[1]}" opacity=".7"/><ellipse cx="600" cy="322" rx="170" ry="24" fill="none" stroke="#3d1d2c" stroke-width="3"/>`; }
  if(o.grave) s+=`<ellipse cx="640" cy="326" rx="130" ry="22" fill="#8b5a44"/><ellipse cx="640" cy="320" rx="104" ry="14" fill="#a8704f"/><circle cx="540" cy="336" r="6" fill="#c9b09a"/><circle cx="742" cy="338" r="5" fill="#c9b09a"/><circle cx="600" cy="344" r="5" fill="#c9b09a"/>`;
  return {s,G:330,x0:430,x1:1120};
}
function canyon(r,o){
  o=o||{};
  let s=fillRect(['#f3c98b','#c8623f','#5b2433']);
  s+=`<path d="M0 0 H${330+r()*40} L${390+r()*30} 396 H0Z" fill="#7d3a34"/><path d="M1196 0 H${820-r()*40} L${770-r()*30} 396 H1196Z" fill="#6b2f33"/><path d="M0 0 H230 L300 396 H0Z" fill="#572636"/><path d="M1196 0 H930 L880 396 H1196Z" fill="#4a2033"/>`;
  for(let i=0;i<5;i++){ const y=60+i*58+r()*20; s+=`<path d="M0 ${y} H${250+i*10} M${940-i*8} ${y+18} H1196" stroke="#8d463c" stroke-width="3" opacity=".6"/>`; }
  if(o.end){ s+=`<path d="M300 396 L340 60 Q600 20 860 60 L890 396Z" fill="#6a2f36"/><path d="M340 60 Q600 20 860 60" stroke="#8d463c" stroke-width="4" fill="none"/>`+glyphs(455,170,10,'#f3c98b',r,18); }
  if(o.cave) s+=`<path d="M520 300 Q530 200 600 196 Q670 200 680 300Z" fill="#1d0f1c"/>`;
  s+=`<path d="M300 396 Q600 322 890 396Z" fill="#3a1a2b"/>`;
  return {s,G:356,x0:400,x1:800};
}
function mountain(r,o){
  o=o||{};
  let s=fillRect(o.sky||['#9fc3d6','#e2a273','#6b3f55']);
  s+=`<circle cx="${(220+r()*200).toFixed(0)}" cy="${(90+r()*50).toFixed(0)}" r="44" fill="#fff1cf"/>`;
  s+=`<path d="M-20 330 L160 ${200+r()*40} L300 290 L460 ${170+r()*50} L640 320 L820 ${210+r()*40} L1000 300 L1216 ${230+r()*40} V396 H-20Z" fill="#8a6278" opacity=".75"/>`;
  if(o.top){ s+=`<path d="M0 396 V340 Q300 300 600 296 Q900 300 1196 340 V396Z" fill="#553049"/><path d="M380 306 Q600 290 820 306" stroke="#f4e6d2" stroke-width="6" fill="none" stroke-linecap="round"/>`; return {s,G:330,x0:420,x1:900}; }
  if(o.ledge){ s+=`<path d="M0 0 H300 L360 396 H0Z" fill="#553049"/><path d="M0 300 H760 L700 328 H0Z" fill="#70445a"/><path d="M0 328 H700 L640 396 H0Z" fill="#3d2238"/>`+bird(960,120,.5,'#2a1626'); return {s,G:314,x0:400,x1:680}; }
  if(o.cliff){ s+=`<path d="M560 396 L620 40 Q700 0 1196 0 V396Z" fill="#553049"/><path d="M620 40 L680 396" stroke="#70445a" stroke-width="5"/><path d="M0 396 V350 Q300 320 620 340 V396Z" fill="#3d2238"/>`;
    s+=`<g transform="translate(700 96)">${nest()}</g>`+bird(o.attack?330:250,o.attack?170:90,o.attack?2.2:1,'#2a1626',o.attack);
    return {s,G:356,x0:140,x1:560}; }
  if(o.nest){ s+=`<path d="M0 396 V300 Q300 268 600 276 Q900 268 1196 300 V396Z" fill="#553049"/>`; return {s,G:306,x0:300,x1:900}; }
  const px=420+r()*300;
  s+=`<path d="M${px-380} 396 L${px} ${o.near?70:120} L${px+150} ${o.near?190:230} L${px+300} ${o.near?140:180} L${px+640} 396Z" fill="#70445a"/><path d="M${px} ${o.near?70:120} l52 84 l-36 -10 l-30 30 l-26 -62Z" fill="#f4e6d2"/>`;
  s+=`<path d="M0 396 V352 Q260 300 520 330 T1196 318 V396Z" fill="#553049"/><path d="M90 380 Q380 312 640 344 T1120 330" stroke="#8a6278" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="2 22"/>`;
  if(o.earth) s+=`<ellipse cx="640" cy="352" rx="210" ry="22" fill="#2f1a22"/><path d="M500 352 q20 -12 40 0 M610 356 q20 -12 40 0 M720 350 q20 -12 40 0" stroke="#5a3a2f" stroke-width="4" fill="none"/>`;
  return {s,G:348,x0:420,x1:900};
}
function bird(x,y,k,c,dive){ return `<g transform="translate(${x} ${y}) scale(${k}) ${dive?'rotate(24)':''}"><path d="M-70 -8 Q-36 -34 0 0 Q36 -34 70 -8 Q36 -16 12 10 L0 26 L-12 10 Q-36 -16 -70 -8Z" fill="${c}"/><path d="M0 26 l-6 14 h12Z" fill="#eaa93b"/></g>`; }
function nest(){ return `<path d="M-60 0 Q0 46 60 0Z" fill="#7a5a3a"/><path d="M-64 0 H64 M-50 10 l30 -14 M-10 14 l34 -16 M20 12 l30 -12" stroke="#4d3724" stroke-width="5" stroke-linecap="round"/><ellipse cx="-14" cy="-6" rx="12" ry="15" fill="#f4e6d2"/><ellipse cx="14" cy="-5" rx="12" ry="15" fill="#e9d8bd"/>`; }

// ---------- la cabane ----------
function planks(c1,c2,x,y,w,h,step){ let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c1}"/>`; for(let i=x+step;i<x+w;i+=step) s+=`<path d="M${i} ${y} v${h}" stroke="${c2}" stroke-width="3"/>`; return s; }
function cabinOut(r,o){
  o=o||{};
  let s=fillRect(['#f0b765','#d9774a','#7a3550']);
  s+=`<circle cx="${(200+r()*200).toFixed(0)}" cy="110" r="50" fill="#fbe3a4"/>`+wave(300,20,r,'#9c4a3c');
  if(o.window){ s+=planks('#6e4032','#4b2a26',260,40,700,300,58)+`<rect x="520" y="110" width="190" height="150" fill="#1d0f1c"/><path d="M510 100 h210 v170 h-210Z M615 110 v150 M520 185 h190" fill="none" stroke="#3b2020" stroke-width="12"/>`; }
  let doorX=0, eyes=o.window?[615,305,1]:null;   // le regard qu'on sent sur soi apparaît à la fenêtre
  if(!o.window){ const x=460+r()*160; doorX=x+70; eyes=[x+241,305,.55,1]; s+=`<path d="M${x-40} 318 V200 L${x+170} 120 L${x+380} 200 V318Z" fill="#6e4032"/><path d="M${x-70} 206 L${x+170} 110 L${x+410} 206" stroke="#3b2020" stroke-width="16" fill="none" stroke-linejoin="round"/>`;
    for(let i=0;i<6;i++) s+=`<path d="M${x-10+i*62} 215 V318" stroke="#4b2a26" stroke-width="3"/>`;
    s+=`<rect x="${x+210}" y="226" width="62" height="52" fill="#f6c979"/><path d="M${x+241} 226 v52 M${x+210} 252 h62" stroke="#3b2020" stroke-width="4"/>`; }
  s+=wave(338,16,r,'#5f2c3b');
  return {s,G:334,x0:o.window?330:140,x1:o.window?900:430,door:o.window?null:[doorX,322,.6],eyes};
}
function cabinIn(r,o){
  o=o||{};
  let s=planks(o.store?'#4a2b29':'#63392f',o.store?'#33191d':'#4b2a26',0,0,W,300,64);
  s+=`<path d="M0 300 H1196 V396 H0Z" fill="${o.store?'#3a2024':'#7a4a3a'}"/><path d="M0 300 H1196" stroke="#33191d" stroke-width="5"/>`;
  if(o.store){ s+=`<path d="M120 110 H520 M120 190 H520" stroke="#2a1218" stroke-width="12"/><rect x="160" y="70" width="46" height="40" fill="#7a5a3a"/><rect x="250" y="146" width="70" height="44" fill="#5d4032"/><circle cx="430" cy="92" r="18" fill="#8b5a44"/>`; }
  else s+=`<rect x="800" y="70" width="150" height="120" fill="#f0b765"/><path d="M800 150 q40 -30 80 -6 t70 -10 v56 h-150Z" fill="#9c4a3c"/><path d="M790 60 h170 v140 h-170Z M875 70 v120 M800 130 h150" fill="none" stroke="#33191d" stroke-width="12"/>`;
  return {s,G:340,x0:300,x1:760,door:[o.store?900:470,300,1.2],eyes:o.store?null:[875,262]};
}
function dream(r){
  let s=fillRect(['#f6d37a','#e98fb0','#5fc7c0']);
  for(let i=0;i<7;i++) s+=`<circle cx="600" cy="200" r="${60+i*62}" fill="none" stroke="${['#fff6d8','#ffd0e0','#c9f3ee'][i%3]}" stroke-width="${10-i}" opacity="${(.7-i*.08).toFixed(2)}"/>`;
  for(let i=0;i<24;i++) s+=`<circle cx="${(r()*W).toFixed(0)}" cy="${(r()*H).toFixed(0)}" r="${(3+r()*9).toFixed(0)}" fill="${['#fff6d8','#45c2b6','#eaa93b','#e98fb0'][i%4]}" opacity=".7"/>`;
  s+=`<circle cx="600" cy="200" r="46" fill="#fff6d8"/>`;
  return {s,G:330,x0:420,x1:900};
}

// ---------- souterrains ----------
function cave(r,o){ // intérieur + sol, puis cadre rocheux au premier plan (dans frame)
  o=o||{};
  let s=fillRect(o.in||['#6a5184','#46325a','#2a1e38']);
  if(o.bricks){ for(let y=30;y<300;y+=44) for(let x=((y/44)%2)*46-10;x<W;x+=92) s+=`<rect x="${x}" y="${y}" width="86" height="38" rx="3" fill="${o.bricks}" opacity="${(.5+r()*.4).toFixed(2)}"/>`; }
  const fl=o.floorY||306;
  s+=`<path d="M0 ${fl} ${o.slope?`L1196 ${fl+o.slope}`:'H1196'} V396 H0Z" fill="${o.floor||'#3a2b4a'}"/>`;
  return s;
}
function frame(r,o){
  o=o||{}; const c=o.c||'#120c19';
  let s=`<path d="M0 0 H1196 V396 H0Z M${o.l||120} 396 Q${(o.l||120)+10} ${o.t||44} 600 ${o.t?o.t-14:30} Q${(o.rr||1076)-10} ${o.t||44} ${o.rr||1076} 396Z" fill="${c}" fill-rule="evenodd"/>`;
  for(let i=0;i<6;i++){ const x=260+r()*680, h=30+r()*70; s+=`<path d="M${x.toFixed(0)} ${o.t?o.t-20:20} l${(8+r()*10).toFixed(0)} ${h.toFixed(0)} l${(8+r()*10).toFixed(0)} ${(-h).toFixed(0)}Z" fill="${c}"/>`; }
  return s;
}
function abyss(x0,x1,far){ // gouffre entre deux bords
  return `<path d="M${x0} 300 L${x0+30} 396 H${x1-30} L${x1} 300Z" fill="#07040b"/>`+(far?`<path d="M${x1} 300 H1196 V396 H${x1-30}Z" fill="#2b2140"/>`:'');
}
function column(x,y,h,w,c){ c=c||'#8a7a94'; return `<rect x="${x-w/2}" y="${y-h}" width="${w}" height="${h}" fill="${c}"/><rect x="${x-w*.75}" y="${y-h-10}" width="${w*1.5}" height="12" fill="${c}"/><rect x="${x-w*.75}" y="${y-8}" width="${w*1.5}" height="10" fill="${c}"/><path d="M${x-w*.2} ${y-h} v${h} M${x+w*.2} ${y-h} v${h}" stroke="#5f516c" stroke-width="2"/>`; }
function goldBridge(x0,x1,y,op){ return `<g opacity="${op}"><path d="M${x0} ${y} Q${(x0+x1)/2} ${y-70} ${x1} ${y} v16 Q${(x0+x1)/2} ${y-50} ${x0} ${y+16}Z" fill="#eaa93b"/><path d="M${x0} ${y} Q${(x0+x1)/2} ${y-70} ${x1} ${y}" stroke="#fbe3a4" stroke-width="4" fill="none"/></g>`; }
function goldDoor(x,y){ return `<path d="M${x-80} ${y} V${y-190} Q${x} ${y-250} ${x+80} ${y-190} V${y}Z" fill="#eaa93b"/><path d="M${x} ${y-222} V${y} M${x-80} ${y-150} H${x+80} M${x-80} ${y-70} H${x+80}" stroke="#a8701f" stroke-width="5"/><circle cx="${x-18}" cy="${y-100}" r="7" fill="#a8701f"/><circle cx="${x+18}" cy="${y-100}" r="7" fill="#a8701f"/><path d="M${x-80} ${y} V${y-190} Q${x} ${y-250} ${x+80} ${y-190} V${y}" stroke="#fbe3a4" stroke-width="5" fill="none"/>`; }
function bull(x,y,k,c){ return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-30 0 v-22 q0 -12 14 -12 h30 q16 0 18 -14 l8 2 q-2 8 4 10 l-4 10 h-8 v26 h-8 v-16 h-32 v16Z" fill="${c}"/><path d="M34 -46 q-10 -10 -2 -18 M42 -44 q10 -8 4 -18" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`; }
function man(x,y){ return `<g transform="translate(${x} ${y})"><path d="M-70 0 L-58 -150 Q-50 -196 0 -200 Q50 -196 58 -150 L70 0Z" fill="#150e1c"/><circle cx="0" cy="-226" r="34" fill="#150e1c"/><path d="M44 -170 L120 -260" stroke="#150e1c" stroke-width="30" stroke-linecap="round"/><path d="M118 -262 L196 -340 L206 -326 L134 -246Z" fill="#cfd3d6"/><path d="M-48 -168 L-96 -90" stroke="#150e1c" stroke-width="28" stroke-linecap="round"/><circle cx="-12" cy="-230" r="4" fill="#eaa93b"/><circle cx="12" cy="-230" r="4" fill="#eaa93b"/></g>`; }
function coyote(x,y,k){ return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-90 0 l6 -50 q4 -22 30 -24 h60 q20 0 30 -18 l14 -24 l6 20 l10 -14 l4 26 l22 14 l-4 10 l-30 4 q-10 30 -30 34 l-4 46 h-12 l-2 -40 h-58 l-8 40 h-12 l2 -44 q-20 -6 -34 -40Z" fill="#1a1220"/><path d="M-84 -56 q-30 -4 -40 22" stroke="#1a1220" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="62" cy="-92" r="4.5" fill="#eaa93b"/></g>`; }

const U={ // décors souterrains, par clé
 tunnel:(r,o)=>{ let s=cave(r,{in:['#33263f','#241a30','#120c19'],floorY:320})+frame(r,{l:380,rr:816,t:o&&o.low?170:110}); if(o&&o.low) s+=`<path d="M380 396 Q390 180 600 170 Q810 180 816 396Z" fill="#1c1426"/><path d="M470 396 Q480 250 600 244 Q720 250 726 396Z" fill="#120c19"/>`; return {s,G:350,x0:440,x1:760}; },
 shaft:(r,o)=>{ let s=fillRect(['#241a30','#191222','#120c19']); s+=`<path d="M470 0 H726 L800 396 H396Z" fill="#3c2a4b"/>`;
   if(o&&o.mid) s+=`<path d="M726 0 L800 396" stroke="#57466a" stroke-width="4"/><path d="M742 150 q70 -30 110 30 q-10 70 -86 60Z" fill="#07040b"/><path d="M430 60 h60 M440 150 h60 M424 240 h60 M416 330 h60" stroke="#57466a" stroke-width="6" stroke-linecap="round"/>`;
   else s+=`<path d="M520 0 H676 L740 396 H456Z" fill="#fbe3a4" opacity=".22"/><ellipse cx="598" cy="26" rx="100" ry="26" fill="#f0b765"/><ellipse cx="598" cy="26" rx="100" ry="26" fill="none" stroke="#57466a" stroke-width="8"/>`;
   s+=`<path d="M396 396 L420 340 H776 L800 396Z" fill="#221830"/>`; return {s,G:366,x0:450,x1:750}; },
 yellow:(r)=>({s:cave(r,{in:['#8a6b2f','#6f5527','#3d2f1c'],bricks:'#b08a3a',floor:'#3a2b1f'})+`<path d="M300 300 q40 -6 60 6 M700 310 q30 -8 70 4" stroke="#5fa9b8" stroke-width="5" opacity=".5" fill="none"/>`+frame(r),G:340,x0:330,x1:880}),
 machete:(r)=>({s:cave(r,{in:['#8a6b2f','#6f5527','#3d2f1c'],bricks:'#b08a3a',floor:'#3a2b1f'})+man(640,360)+frame(r),G:350,x0:330,x1:500}),
 inscr:(r)=>({s:cave(r,{in:['#d9b46a','#b08a3a','#5a4426'],floor:'#4a3823'})+glyphs(300,90,22,'#5a3a1e',r,20)+glyphs(330,150,20,'#5a3a1e',r,20)+glyphs(300,210,22,'#5a3a1e',r,20)+frame(r),G:340,x0:330,x1:880}),
 dark:(r,o)=>{ let s=cave(r,{in:['#1c1426','#150f1c','#0b0710'],floor:'#0f0a15',slope:o&&o.end?0:50}); if(o&&o.end) s+=`<path d="M330 300 V70 H870 V300Z" fill="#191222"/><path d="M350 300 H850" stroke="#fbe3a4" stroke-width="5"/><path d="M350 300 H850 L900 396 H300Z" fill="#fbe3a4" opacity=".1"/>`; return {s:s+frame(r,{c:'#07040b'}),G:346,x0:340,x1:860}; },
 carved:(r,o)=>{ let s=fillRect(['#4a4257','#353044','#1f1b2a'])+`<path d="M300 300 V60 H900 V300Z" fill="#2a2536"/><path d="M0 0 L300 60 V300 L0 396Z" fill="#3d374a"/><path d="M1196 0 L900 60 V300 L1196 396Z" fill="#332e40"/><path d="M0 396 L300 300 H900 L1196 396Z" fill="#221d2d"/>`;
   for(let i=0;i<5;i++) s+=`<path d="M${60+i*50} ${20+i*10} v${330-i*20}" stroke="#2a2536" stroke-width="2"/>`;
   if(o&&o.hatch) s+=`<path d="M520 340 l40 -26 h150 l30 26Z" fill="#07040b"/><path d="M710 314 l60 -70 l40 16 l-40 80Z" fill="#6b6478"/><path d="M520 340 l40 -26 h150 l30 26Z" fill="none" stroke="#6b6478" stroke-width="5"/>`;
   return {s,G:356,x0:330,x1:(o&&o.hatch)?500:860}; },
 platform:(r)=>({s:cave(r,{in:['#46325a','#2a1e38','#07040b'],floorY:396})+`<path d="M360 396 V300 H840 V396Z" fill="#4a4257"/><path d="M340 300 H860 v16 H340Z" fill="#6b6478"/>`+frame(r),G:296,x0:400,x1:800}),
 chasm:(r,o)=>{ o=o||{}; const x0=o.small?480:420, x1=o.small?720:1000;
   let s=cave(r,{floor:'#4a3860',floorY:300})+abyss(x0,x1,false)+`<path d="M${x0} 300 H${x1}" stroke="#8d7aa3" stroke-width="3" opacity=".5"/>`;
   if(o.cols) s+=column(1010,300,140,24)+column(1060,300,140,24);
   if(o.bridge) s+=goldBridge(x0-6,x1+6,300,o.bridge);
   if(o.pillarAcross) s+=`<path d="M${x0-40} 286 H${x1+40} v22 H${x0-40}Z" fill="#8a7a94"/><path d="M${x0-40} 293 H${x1+40}" stroke="#5f516c" stroke-width="2"/>`;
   return {s:s+frame(r,{l:90,rr:1106}),G:306,x0:200,x1:x0-30}; },
 onBridge:(r,o)=>{ const c=o&&o.pillar?['#8a7a94','#5f516c']:['#eaa93b','#fbe3a4'];
   let s=fillRect(['#241a30','#120c19','#07040b'])+`<path d="M520 110 H676 L900 396 H296Z" fill="${c[0]}"/><path d="M520 110 L296 396 M676 110 L900 396" stroke="${c[1]}" stroke-width="6"/>`;
   for(let i=0;i<5;i++){ const y=150+i*i*14+i*20; s+=`<path d="M${520-(y-110)*.78} ${y} H${676+(y-110)*.78}" stroke="${c[1]}" stroke-width="2" opacity=".6"/>`; }
   s+=`<path d="M470 110 H726 V70 H470Z" fill="#2b2140"/>`; return {s:s+frame(r,{l:120,rr:1080,c:'#07040b'}),G:340,x0:420,x1:780}; },
 bottom:(r)=>({s:fillRect(['#120c19','#1c1426','#241a30'])+`<path d="M560 0 H640 L720 396 H480Z" fill="#33263f"/><path d="M590 0 h20 l10 120 h-40Z" fill="#fbe3a4" opacity=".25"/><path d="M0 0 H560 L480 396 H0Z" fill="#191222"/><path d="M1196 0 H640 L720 396 H1196Z" fill="#150f1c"/><path d="M420 396 L500 330 H700 L780 396Z" fill="#3c2a4b"/>`,G:366,x0:470,x1:730}),
 path:(r)=>({s:cave(r,{floorY:250,slope:110})+`<path d="M0 260 L1196 372" stroke="#57466a" stroke-width="4" stroke-dasharray="30 26"/>`+frame(r),G:330,x0:420,x1:860}),
 door:(r,o)=>({s:cave(r,{in:o&&o.inside?['#6b6478','#4a4257','#2a2536']:undefined})+goldDoor(o&&o.inside?420:800,306)+`<ellipse cx="${o&&o.inside?420:800}" cy="316" rx="130" ry="14" fill="#eaa93b" opacity=".18"/>`+frame(r),G:344,x0:o&&o.inside?560:330,x1:o&&o.inside?880:660}),
 statues:(r)=>{ let s=cave(r,{in:['#4a3a3a','#3a2a30','#1f1620'],floor:'#2b1f26'}); for(let row=0;row<3;row++) for(let i=0;i<9-row;i++) s+=bull(300+row*24+i*(62+row*10),250+row*40,.5+row*.16,['#8a5a48','#a86a50','#c07a58'][row]); return {s:s+frame(r),G:366,x0:420,x1:800}; },
 lived:(r)=>({s:cave(r,{})+`<path d="M330 306 v-90 h60 v30 h40 v60Z M760 306 v-60 h50 v-40 h50 v100Z" fill="#57466a"/><path d="M520 306 q10 -40 40 -40 q30 0 40 40Z" fill="#8b5a44"/><circle cx="640" cy="318" r="26" fill="#150f1c"/><path d="M622 318 l10 -22 l10 12 l8 -18 l8 28Z" fill="#eaa93b" opacity=".5"/>`+frame(r),G:346,x0:400,x1:860}),
 growl:(r)=>({s:cave(r,{})+`<path d="M690 306 V150 Q780 70 870 150 V306Z" fill="#07040b"/><path d="M690 306 V150 Q780 70 870 150 V306" stroke="#57466a" stroke-width="8" fill="none"/><circle cx="764" cy="230" r="5" fill="#eaa93b"/><circle cx="796" cy="230" r="5" fill="#eaa93b"/>`+frame(r),G:344,x0:330,x1:640}),
 pondEdge:(r)=>({s:cave(r,{in:['#2f3a52','#243047','#141c2c'],floor:'#221830'})+`<ellipse cx="700" cy="336" rx="210" ry="30" fill="#2d7f8a"/><ellipse cx="660" cy="328" rx="90" ry="8" fill="#8fd3d6" opacity=".5"/>`+frame(r),G:340,x0:300,x1:480}),
 green:(r)=>({s:cave(r,{in:['#3f7a5a','#2d5a45','#16302a'],bricks:'#58a078',floor:'#1b2c28'})+coyote(700,372,1.25)+frame(r),G:350,x0:320,x1:520}),
 pond:(r,o)=>{ o=o||{}; let s=fillRect(o.poison?['#3a4a2c','#2c3a2a','#141c1a']:['#2f3a52','#243047','#141c2c']);
   s+=`<path d="M0 230 Q200 190 420 214 T860 204 T1196 222 V260 H0Z" fill="${o.poison?'#4d5a3a':'#4a4257'}"/><circle cx="240" cy="214" r="18" fill="#6b6478"/><circle cx="930" cy="206" r="24" fill="#6b6478"/><circle cx="1010" cy="218" r="14" fill="#57466a"/>`;
   s+=`<path d="M0 250 Q150 236 300 250 T600 250 T900 250 T1196 250 V396 H0Z" fill="${o.poison?'#3f6a4a':'#2d7f8a'}"/><path d="M0 310 Q150 296 300 310 T600 310 T900 310 T1196 310 V396 H0Z" fill="${o.poison?'#2a4a38':'#1c5566'}"/>`;
   if(o.poison) for(let i=0;i<7;i++) s+=`<ellipse cx="${(100+r()*1000).toFixed(0)}" cy="${(60+r()*120).toFixed(0)}" rx="${(60+r()*80).toFixed(0)}" ry="14" fill="#b6c94a" opacity=".16"/>`;
   return {s:s+frame(r,{l:60,rr:1136,t:40}),G:236,x0:320,x1:860}; },
 under:(r)=>{ let s=fillRect(['#1c4a5c','#123040','#07141f']); for(let i=0;i<22;i++) s+=`<circle cx="${(r()*W).toFixed(0)}" cy="${(r()*H).toFixed(0)}" r="${(2+r()*7).toFixed(0)}" fill="none" stroke="#8fd3d6" stroke-width="2" opacity="${(.2+r()*.4).toFixed(2)}"/>`;
   s+=`<path d="M0 396 V350 Q300 320 600 344 T1196 336 V396Z" fill="#07141f"/><path d="M200 0 l60 396 M520 0 l-30 396 M900 0 l80 396" stroke="#8fd3d6" stroke-width="26" opacity=".05"/>`; return {s,G:356,x0:300,x1:900}; }
};
const cf=r=>frame(r);

// ---------- table des lieux ----------
const PLACES={
 '1536':r=>U.tunnel(r), '1549':r=>U.tunnel(r,{low:1}),
 '1579':r=>desert(r,{rock:'flat',mountain:1}), '1598':r=>desert(r,{mountain:1}), '15C7':r=>desert(r), '15EE':r=>desert(r,{rock:'slab'}),
 '1628':r=>canyon(r), '165A':r=>canyon(r,{end:1}),
 '16B3':r=>desert(r,{pool:'yellow',edge:1}), '16DE':r=>desert(r,{edge:1}),
 '1716':r=>desert(r,{on:1,mood:'dark'}), '1753':r=>desert(r,{on:1,mood:'soft'}), '17AA':r=>desert(r,{pool:'blue'}),
 '17CF':r=>cabinIn(r), '1825':r=>cabinIn(r,{store:1}), '1843':r=>cabinOut(r,{window:1}), '1862':r=>cabinOut(r), '1886':r=>desert(r,{grave:1}),
 '18A3':r=>dream(r), '18F9':r=>U.shaft(r), '193D':r=>U.shaft(r,{mid:1}), '197B':r=>U.yellow(r), '19AD':r=>U.machete(r), '19FB':r=>U.inscr(r),
 '1A48':r=>U.dark(r), '1A92':r=>U.dark(r,{end:1}),
 '1AD2':r=>mountain(r,{earth:1}), '1B07':r=>mountain(r,{near:1}), '1B30':r=>mountain(r,{top:1,sky:['#7fb0d0','#c9d8dc','#e2a273']}), '1B5C':r=>mountain(r,{ledge:1}),
 '1BB4':r=>{ const m=mountain(r,{nest:1}); m.s+=`<g transform="translate(600 300) scale(2.2)">${nest()}</g>`; return m; },
 '1BC6':r=>mountain(r,{cliff:1,attack:1}), '1BF7':r=>mountain(r,{cliff:1}),
 '1C3C':r=>{ let s=fillRect(['#f3c98b','#c8623f','#5b2433'])+`<path d="M0 396 V250 L300 210 L520 240 L800 200 L1196 236 V396Z" fill="#7d3a34"/><path d="M0 396 V310 L400 296 L900 306 L1196 290 V396Z" fill="#3a1a2b"/>`; return {s:s+frame(r,{l:170,rr:1026,t:60,c:'#1d0f1c'}),G:350,x0:330,x1:860}; },
 '1C75':r=>U.carved(r), '1CA3':r=>U.carved(r,{hatch:1}), '1CCC':r=>U.platform(r), '1CF5':r=>U.chasm(r),
 '1D22':r=>U.onBridge(r), '1D4C':r=>U.bottom(r), '1D7E':r=>U.pond(r), '1DB9':r=>U.under(r), '1DF1':r=>U.path(r),
 '1E22':r=>U.chasm(r,{cols:1}), '1E78':r=>U.chasm(r,{small:1}), '25C6':r=>U.chasm(r,{small:1,pillarAcross:1}), '1EB2':r=>U.onBridge(r,{pillar:1}),
 '1EF9':r=>U.door(r,{inside:1}), '1F2B':r=>U.statues(r), '1F59':r=>U.pond(r,{poison:1}), '1FB3':r=>U.lived(r), '1FD9':r=>U.growl(r),
 '202B':r=>U.pondEdge(r), '2042':r=>U.door(r), '2074':r=>U.chasm(r,{bridge:.55}), '20BB':r=>U.green(r)
};

// ---------- objets ----------
// chaque dessin est centré en x, posé sur y=0, pour une hauteur d'environ 60 unités
const g=(inner)=>inner;
const OBJ={
 7:()=>`<g stroke="#8f9470" stroke-width="11" fill="none" stroke-linecap="round"><path d="M0 0 q-4 -40 6 -66"/><path d="M0 -30 h-20 q-6 6 -4 18"/><path d="M4 -22 h18 v-16"/></g><path d="M-10 -70 l8 -8 M10 -72 l-2 -10" stroke="#5d6248" stroke-width="3"/>`,
 8:()=>`<path d="M-34 -6 q10 -14 34 -10 q20 2 30 -2 l10 4 l-8 8 q-16 4 -30 2 q-24 0 -52 10 q-14 4 -22 -4 q14 2 38 -8Z" fill="#7fb069"/><path d="M-10 -8 l-6 10 M10 -8 l8 10 M-22 -4 l-10 6" stroke="#5a8a4a" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="-12" r="2.5" fill="#1d1626"/>`,
 9:()=>`<path d="M-60 -6 q20 -26 40 0 t40 0 t34 -14" stroke="#c9a24b" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-60 -6 q20 -26 40 0 t40 0 t34 -14" stroke="#6b4a1f" stroke-width="13" fill="none" stroke-dasharray="6 12"/><path d="M50 -26 l22 -4 l-6 16Z" fill="#c9a24b"/><path d="M-66 -4 l-12 -10 M-66 -2 l-14 -2" stroke="#e8d18a" stroke-width="4"/>`,
 10:()=>`<path d="M-30 -22 q4 -26 34 -26 q10 -16 26 -8 l16 4 l-16 6 q-2 26 -30 32 l-34 12 l-18 -4Z" fill="#15101b"/><path d="M-2 -2 v14 M10 -4 v14" stroke="#15101b" stroke-width="4"/><circle cx="32" cy="-46" r="3" fill="#eaa93b"/><path d="M-20 -24 q14 -6 30 4" stroke="#3a2f4a" stroke-width="3" fill="none"/>`,
 12:()=>`<path d="M-60 0 l14 -22 l20 8 l12 -26 l26 14 l10 -14 l24 18 l14 22Z" fill="#8a7468"/><path d="M-34 -14 l20 14 M-2 -38 l10 38 M34 -26 l-8 26" stroke="#5a463f" stroke-width="3"/><path d="M-70 0 l-8 -8 M72 0 l10 -6" stroke="#8a7468" stroke-width="5"/>`,
 13:()=>`<circle cx="0" cy="-12" r="30" fill="#45c2b6" opacity=".25"/><circle cx="0" cy="-12" r="19" fill="#45c2b6" opacity=".35"/><ellipse cx="0" cy="-10" rx="12" ry="10" fill="#7fe6ff"/><ellipse cx="-3" cy="-13" rx="4" ry="3" fill="#fff"/>`,
 20:()=>`<path d="M-44 0 V-150 H44 V0Z" fill="#150c14"/><path d="M-52 0 V-158 H52 V0" stroke="#3b2020" stroke-width="12" fill="none"/>`,
 22:()=>`<path d="M-30 -24 q30 44 60 0Z" fill="#c9825b"/><ellipse cx="0" cy="-24" rx="30" ry="7" fill="#7a4632"/><path d="M-20 -12 q20 14 40 0" stroke="#e8a983" stroke-width="3" fill="none"/>`,
 23:()=>`<path d="M-70 -6 l96 -30 l4 8 l-96 32Z" fill="#6b6478"/><path d="M20 -34 l44 -10 l8 16 l-40 12Z" fill="#7a4a2f"/><path d="M0 -22 q6 14 16 6" stroke="#2a1626" stroke-width="3" fill="none"/>`,
 24:()=>`<path d="M-30 0 V-56 Q0 -90 30 -56 V0Z" fill="#b9b4bd"/><path d="M-16 -50 H16 M-16 -38 H16 M-10 -26 H10" stroke="#6b6478" stroke-width="4"/><path d="M-30 0 V-56 Q0 -90 30 -56" stroke="#e6e1ea" stroke-width="3" fill="none"/>`,
 27:()=>[[-20,-4],[-6,-8],[8,-3],[22,-7],[0,-1],[-12,-1],[14,-12]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="4" ry="2.6" fill="#e8d18a"/>`).join(''),
 28:()=>[0,1,2,3,4].map(i=>`<g transform="translate(${-90+i*44} ${-4-(i%2)*10})"><ellipse cx="0" cy="0" rx="7" ry="5.5" fill="#2a1322"/><circle cx="-7" cy="-8" r="2.6" fill="#2a1322"/><circle cx="0" cy="-10" r="2.6" fill="#2a1322"/><circle cx="7" cy="-8" r="2.6" fill="#2a1322"/></g>`).join(''),
 29:()=>`<path d="M-56 0 V-50 H56 V0Z" fill="#8a8494"/><ellipse cx="0" cy="-50" rx="56" ry="14" fill="#b9b4bd"/><ellipse cx="0" cy="-50" rx="40" ry="9" fill="#150c14"/><path d="M-56 -26 H56 M-28 -50 V0 M0 -36 V0 M28 -50 V0" stroke="#5f596b" stroke-width="3"/>`,
 30:()=>[[-26,-6,1],[0,-10,1.2],[26,-5,.9]].map(p=>`<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})"><ellipse cx="0" cy="0" rx="12" ry="8" fill="#22342c"/><path d="M0 -8 v16" stroke="#4f8a6a" stroke-width="2"/><path d="M-10 4 l-8 6 M10 4 l8 6 M-12 -2 l-8 -2 M12 -2 l8 -2" stroke="#22342c" stroke-width="2.5"/><circle cx="13" cy="0" r="4" fill="#22342c"/></g>`).join(''),
 31:()=>`<path d="M-66 -4 L30 -30 L40 -14 L-60 4Z" fill="#cfd3d6"/><path d="M30 -30 L64 -38 L70 -22 L40 -14Z" fill="#5a3a2f"/><path d="M-60 0 L34 -24" stroke="#fff" stroke-width="2" opacity=".7"/>`,
 34:()=>`<ellipse cx="0" cy="-8" rx="70" ry="18" fill="#07040b"/><ellipse cx="0" cy="-8" rx="70" ry="18" fill="none" stroke="#57466a" stroke-width="4"/>`,
 37:()=>`<path d="M-50 0 Q-10 -60 56 -64 Q30 -10 -50 0Z" fill="#f4e6d2"/><path d="M-50 0 Q0 -40 56 -64" stroke="#7a5a3a" stroke-width="3" fill="none"/><path d="M-10 -20 l14 6 M10 -36 l14 6 M30 -50 l12 4" stroke="#7a5a3a" stroke-width="2"/><path d="M20 -62 Q44 -52 56 -64" fill="#5a3a2f"/>`,
 38:()=>[0,1,2,3].map(i=>`<g transform="translate(${-80+i*52} ${-4-(i%2)*12}) rotate(80)"><ellipse cx="0" cy="0" rx="14" ry="6.5" fill="#2a1322"/><ellipse cx="-17" cy="-1" rx="5.5" ry="5" fill="#2a1322"/></g>`).join(''),
 39:()=>`<path d="M-30 -66 H30 Q36 -30 0 0 Q-36 -30 -30 -66Z" fill="#3f9c7c"/><path d="M-30 -66 H30 v-10 H-30Z" fill="#eaa93b"/><circle cx="-42" cy="-44" r="9" fill="#3f9c7c"/><circle cx="42" cy="-44" r="9" fill="#3f9c7c"/><path d="M-20 -48 h14 M6 -48 h14" stroke="#10241c" stroke-width="6" stroke-linecap="round"/><path d="M-10 -20 h20 v8 h-20Z" fill="#10241c"/><path d="M0 -44 v14" stroke="#2a6a54" stroke-width="5"/>`,
 40:()=>`<path d="M-24 -4 L-14 -40 L26 -32 L18 4Z" fill="#f4ecd8"/><path d="M-10 -30 l26 5 M-12 -22 l26 5 M-14 -14 l20 4" stroke="#8a7a66" stroke-width="2.5"/>`,
 41:()=>`<path d="M-44 -2 L40 -26 M-4 -13 L10 -40 M14 -18 L36 -8" stroke="#8b5a3a" stroke-width="6" stroke-linecap="round"/><path d="M10 -40 l6 -8 M40 -26 l10 -2" stroke="#6fa85a" stroke-width="5" stroke-linecap="round"/>`,
 42:()=>`<path d="M0 0 v-40 M0 -20 l-26 -26 M0 -24 l28 -24" stroke="#5a3a2f" stroke-width="6"/><circle cx="-34" cy="-60" r="30" fill="#4f8a4a"/><circle cx="34" cy="-62" r="32" fill="#5d9a52"/><circle cx="0" cy="-86" r="34" fill="#6fae5c"/><circle cx="-10" cy="-78" r="5" fill="#45c2b6"/><circle cx="26" cy="-66" r="5" fill="#45c2b6"/><circle cx="-36" cy="-54" r="5" fill="#45c2b6"/>`,
 43:()=>`<ellipse cx="-20" cy="-120" rx="13" ry="7" fill="#fbe3a4"/><ellipse cx="20" cy="-120" rx="13" ry="7" fill="#fbe3a4"/><circle cx="-20" cy="-120" r="4" fill="#1d1626"/><circle cx="20" cy="-120" r="4" fill="#1d1626"/>`,
 45:()=>`<path d="M-60 0 Q-30 -46 0 -46 Q30 -46 60 0Z" fill="#7a4a3a"/><path d="M-30 -18 q10 -10 22 -4 M10 -30 q10 -6 20 2" stroke="#a8704f" stroke-width="4" fill="none" stroke-linecap="round"/>`,
 46:()=>`<path d="M-44 0 l10 -22 l18 10 l-6 12Z M-8 0 l6 -28 l22 6 l-6 22Z M26 0 l10 -16 l16 6 l-4 10Z" fill="#c9825b"/><path d="M-34 -22 l18 10 M-2 -28 l22 6" stroke="#7a4632" stroke-width="3"/>`,
 47:()=>`<circle cx="-22" cy="-12" r="12" fill="none" stroke="#eaa93b" stroke-width="6"/><path d="M-10 -12 H36 M22 -12 v12 M34 -12 v10" stroke="#eaa93b" stroke-width="6" stroke-linecap="round"/>`,
 48:()=>`<path d="M-70 0 Q-66 -90 0 -94 Q66 -90 70 0Z" fill="#07040b"/><path d="M-70 0 Q-66 -90 0 -94 Q66 -90 70 0" stroke="#57466a" stroke-width="7" fill="none"/>`,
 49:()=>`<g stroke="#6e7a3c" stroke-width="5" fill="none" stroke-linecap="round"><path d="M-70 0 q20 -60 60 -50 q30 -30 60 6 q20 10 22 44"/><path d="M-50 0 q10 -40 40 -30 M-10 0 q10 -50 40 -36 M20 0 q14 -30 36 -14 M-64 -14 l30 -30 M10 -46 l20 -20 M40 -30 l24 -10"/></g><path d="M-70 0 q20 -60 60 -50 q30 -30 60 6 q20 10 22 44Z" fill="#4d5a2c" opacity=".7"/>`,
 50:()=>`<path d="M-36 0 V-36 H36 V0Z" fill="#7a5a3a"/><path d="M-40 -36 H40 V-46 H-40Z" fill="#8d6a44"/><path d="M-36 -18 H36 M-12 -36 V0 M12 -36 V0" stroke="#4d3724" stroke-width="3"/><rect x="-6" y="-34" width="12" height="12" fill="#b9b4bd"/>`,
 51:()=>`<g transform="translate(0 -22)">${nest()}</g>`,
 53:()=>`<path d="M-64 0 L-44 -26 H64 L44 0Z" fill="#f4ecd8"/><path d="M-56 -8 H50 M-50 -16 H56" stroke="#3f7fb8" stroke-width="5"/><path d="M-30 -26 L-50 0 M4 -26 L-16 0 M38 -26 L18 0" stroke="#3f7fb8" stroke-width="3"/>`,
 55:()=>`<path d="M-50 0 Q-60 -70 -10 -90 Q40 -100 56 -40 Q60 -10 44 0Z" fill="#07040b"/><path d="M-50 0 Q-60 -70 -10 -90 Q40 -100 56 -40 Q60 -10 44 0" stroke="#57466a" stroke-width="6" fill="none"/>`,
 56:()=>`<path d="M-40 0 V-96 H40 V0" stroke="#5a3a2f" stroke-width="8" fill="none"/><path d="M0 -96 v14" stroke="#5a3a2f" stroke-width="5"/><path d="M-22 -30 Q-22 -80 0 -82 Q22 -80 22 -30 L30 -22 H-30Z" fill="#c8763a"/><circle cx="0" cy="-18" r="6" fill="#8a4a1f"/><path d="M-10 -70 q-4 20 -2 34" stroke="#f0b27a" stroke-width="4" fill="none"/>`,
 58:()=>`<path d="M-30 0 H30 V-14 H-30Z" fill="#a8701f"/><path d="M-18 -14 V-70 Q-18 -86 0 -86 Q18 -86 18 -70 V-14Z" fill="#eaa93b"/><circle cx="0" cy="-102" r="15" fill="#eaa93b"/><path d="M-18 -60 l-16 20 M18 -60 l16 20" stroke="#eaa93b" stroke-width="8" stroke-linecap="round"/><path d="M-6 -80 v60" stroke="#fbe3a4" stroke-width="3"/>`,
 59:()=>`<circle cx="0" cy="-22" r="34" fill="#f2d24a" opacity=".22"/>${bull(0,0,.62,'#f2d24a')}`,
 60:()=>`<path d="M-40 0 V-50 H30 V0Z" fill="#8a8494"/><path d="M-40 -50 L-24 -66 H46 L30 -50Z" fill="#b9b4bd"/><path d="M30 0 V-50 L46 -66 V-16Z" fill="#6b6478"/>`,
 61:()=>`<ellipse cx="0" cy="-8" rx="28" ry="12" fill="none" stroke="#4a4654" stroke-width="8"/><path d="M-6 -2 h12 v8 h-12Z" fill="#6b6478"/><path d="M-20 -14 q20 -10 40 0" stroke="#8a8494" stroke-width="2" fill="none"/>`,
 62:()=>`<path d="M-80 0 V-20 H-40 V-40 H0 V-60 H40 V-80 H80 V0Z" fill="#8a8494"/><path d="M-80 -20 H-40 M-40 -40 H0 M0 -60 H40 M40 -80 H80" stroke="#cfcad6" stroke-width="4"/>`,
 63:()=>`<path d="M-26 0 L-34 -90 Q0 -130 34 -90 L26 0Z" fill="#150e1c"/><path d="M-30 -92 Q-120 -190 -190 -110 Q-150 -120 -130 -80 Q-100 -100 -84 -60 Q-60 -80 -32 -50Z" fill="#241830"/><path d="M30 -92 Q120 -190 190 -110 Q150 -120 130 -80 Q100 -100 84 -60 Q60 -80 32 -50Z" fill="#241830"/><circle cx="0" cy="-126" r="24" fill="#150e1c"/><path d="M-16 -144 l-8 -22 l14 12 M16 -144 l8 -22 l-14 12" fill="#150e1c"/><path d="M0 0 q30 20 50 -4" stroke="#150e1c" stroke-width="8" fill="none" stroke-linecap="round"/>`,
 66:()=>column(0,0,210,34),
 67:()=>column(-34,0,150,26)+column(34,0,150,26),
 68:()=>`<ellipse cx="0" cy="-8" rx="60" ry="16" fill="#1f1620"/><ellipse cx="0" cy="-6" rx="46" ry="10" fill="#c9962f"/><ellipse cx="-10" cy="-8" rx="18" ry="3" fill="#fbe3a4" opacity=".7"/>`,
 69:()=>`<path d="M-70 0 l10 -20 l22 -4 l10 -18 l26 6 l14 -12 l24 16 l20 6 l14 26Z" fill="#8a8494"/><path d="M-38 -24 l16 24 M10 -36 l-6 36 M48 -32 l-10 32" stroke="#5f596b" stroke-width="3"/>`,
 70:()=>`<path d="M-90 0 V-70 H-50 V-40 H-20 V-96 H20 V-50 H50 V-80 H90 V0Z" fill="#8a8494"/><path d="M-90 -36 H90 M-60 -36 V0 M0 -96 V-36 M40 -36 V0 M-20 -66 H20" stroke="#5f596b" stroke-width="3"/><path d="M-110 0 l8 -12 l12 4 M100 0 l10 -10" stroke="#8a8494" stroke-width="6"/>`,
 72:()=>`<ellipse cx="0" cy="-10" rx="34" ry="12" fill="none" stroke="#c9a877" stroke-width="7"/><ellipse cx="0" cy="-16" rx="26" ry="9" fill="none" stroke="#b08e5c" stroke-width="7"/><path d="M30 -8 q20 4 30 -8" stroke="#c9a877" stroke-width="7" fill="none" stroke-linecap="round"/>`,
 73:()=>`<path d="M-22 -18 Q-28 -52 0 -54 Q28 -52 22 -18 L14 -14 V0 H-14 V-14Z" fill="#f4ecd8"/><circle cx="-9" cy="-30" r="6.5" fill="#1d1626"/><circle cx="9" cy="-30" r="6.5" fill="#1d1626"/><path d="M0 -22 l-4 8 h8Z" fill="#1d1626"/><path d="M-8 -6 v6 M0 -6 v6 M8 -6 v6" stroke="#1d1626" stroke-width="2"/>`
};
OBJ[21]=OBJ[20];
// objets « de décor » : grands, à un emplacement fixe (fraction de la zone libre), dessinés derrière les petits
const BIG={20:[.86,1.25],21:[.86,1.25],29:[.7,1.3],34:[.5,1.2],42:[.2,1.2],43:[.5,1],48:[.82,1.2],49:[.8,1.2],51:[.5,1.4],55:[.84,1.1],56:[.62,1.2],58:[.72,1.3],62:[.8,1.3],63:[.92,1],66:[.9,1],67:[.85,1],68:[.72,1.2],70:[.6,1.2],24:[.56,1.3],60:[.3,1.2]};
const SMALL_SCALE={13:1.1,27:1.3,47:1.1,30:1.1};

function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const r=rng((off+1)*7919+parseInt(key,16));
  const p=(PLACES[key]||PLACES['197B'])(r);
  let s=p.s; const span=p.x1-p.x0;
  // inscriptions (objet 44) : gravées sur la paroi
  if(objs.includes(44)&&key!=='165A'&&key!=='19FB') s+=glyphs(p.x0+span*.2,p.G-150,8,'#eaa93b',r,16);
  objs.filter(n=>BIG[n]&&OBJ[n]).forEach(n=>{ const b=BIG[n];
    if(n===43&&p.eyes){ s+=`<g transform="translate(${p.eyes[0].toFixed(0)} ${p.eyes[1]}) scale(${p.eyes[2]||1})">${p.eyes[3]?'<rect x="-52" y="-138" width="104" height="36" fill="#1d0f1c" opacity=".8"/>':''}${OBJ[n]()}</g>`; return; }
    if((n===20||n===21)&&p.door){ s+=`<g transform="translate(${p.door[0].toFixed(0)} ${p.door[1]}) scale(${p.door[2]})">${OBJ[n]()}</g>`; return; } s+=`<g transform="translate(${(p.x0+span*b[0]).toFixed(0)} ${p.G-6}) scale(${b[1]})">${OBJ[n]()}</g>`; });
  const small=objs.filter(n=>!BIG[n]&&OBJ[n]).sort((a,b)=>a-b);
  const slots=Math.max(5,small.length), used=new Set();
  small.forEach(n=>{ let k=(n*5+off)%slots; while(used.has(k)) k=(k+1)%slots; used.add(k);
    const x=p.x0+span*(k+.5)/slots, y=p.G+((n*13)%3)*9;
    s+=`<g transform="translate(${x.toFixed(0)} ${y}) scale(${SMALL_SCALE[n]||1.15})">${OBJ[n]()}</g>`; });
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}${veil()}</svg>`;
}
// petite icône d'un objet pour la carte ; DIM = largeur et hauteur approximatives du dessin
const DIM={7:[60,84],9:[160,50],12:[170,48],20:[120,166],21:[120,166],23:[150,50],24:[70,92],28:[210,30],29:[124,70],31:[150,48],34:[150,32],37:[116,70],38:[200,34],39:[104,84],42:[140,124],48:[150,100],49:[160,74],51:[136,48],53:[136,32],55:[124,100],56:[90,104],58:[80,122],62:[170,86],63:[390,172],66:[60,226],67:[110,166],68:[130,30],69:[160,48],70:[230,102],72:[100,34]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[76,66]; const vb=n===43?'-44 -136 88 32':`${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}`; return `<svg class="oi" width="${size}" height="${size}" viewBox="${vb}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES,OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
