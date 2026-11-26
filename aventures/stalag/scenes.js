// Stalag — illustrations vectorielles, dans le style des autres aventures. Le camp au crépuscule, comme sur la boîte :
// ciel violet et orange, terre rouge, baraques à toit arrondi, miradors, barbelés. Les intérieurs sont en planches,
// éclairés par la lumière du soir ; le mitard, les tunnels et le trou sont sombres.
// render(clé, lieu, numéros, options) : numéros = objets présents (1 à 85) et éléments de scène (101 et plus) :
//   101 cadenas de la baraque 3 ouvert, 102 sa porte ouverte, 103 cadenas à combinaison ouvert, 104 porte de la baraque
//   des gardes ouverte, 105 le chien mange, 106 courant de la clôture coupé, 107 mitard ouvert, 108 ouverture sous le lit,
//   109 les avions passent (la partie dure).
const SCENES=(function(){
const W=1196, H=396, G=330;
let uid=0, X=new Set();
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,dir){ const id='sgg'+(uid++); const [x2,y2]=dir==='h'?[1,0]:[0,1];
  return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function glow(cx,cy,rx,ry,c,o){ const id='sgl'+(uid++); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o||.55}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`; }
const veil=()=>{ const [u,d]=grad(['rgba(10,8,14,0)','rgba(10,8,14,0)','rgba(10,8,14,.85)']); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; };
const dl=(d,x)=>` style="animation-delay:-${d.toFixed(1)}s${x?';'+x:''}"`;
const g=(x,k,s,y)=>`<g transform="translate(${x.toFixed(0)} ${(y===undefined?G:y).toFixed(0)}) scale(${k})">${s}</g>`;

// ---------- dehors : ciel du soir, terre rouge, baraques, miradors, barbelés ----------
function sky(seed){
  const [u,d]=grad(['#2a2a5a','#6a4a7a','#c8664a','#e8a050']); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  const r=rng(seed);
  s+='<g class="an-drift">'; for(let i=0;i<5;i++){ const x=r()*W, y=40+r()*90, w=120+r()*180; s+=`<path d="M${x} ${y} q${w/3} -14 ${w/2} 0 q${w/4} -10 ${w/2} 2 q-${w/2} 12 -${w} -2Z" fill="#a8586a" opacity=".45"/>`; } s+='</g>';
  if(X.has(109)) for(const [x,y,k] of [[180,70,1],[300,52,.8],[420,84,.7],[880,60,.9],[990,90,.6]]) s+=plane(x,y,k);
  return s;
}
function plane(x,y,k){ return `<g class="an-fly"${dl((x/100)%14)}><g transform="translate(${x} ${y}) scale(${k})" fill="#2a2030"><path d="M-30 0 h60 l6 3 h-72Z"/><path d="M-6 0 l-14 -16 h6 l18 16Z M-6 3 l-14 16 h6 l18 -16Z"/><path d="M-30 0 l-6 -8 h4 l8 8Z"/></g></g>`; }
function ground(){ const [u,d]=grad(['#8a4a2a','#5a2e1a']); let s=d+`<path d="M0 250 H${W} V${H} H0Z" fill="${u}"/>`;
  const r=rng(7); for(let i=0;i<40;i++){ const x=r()*W, y=262+r()*120; s+=`<path d="M${x} ${y} h${8+r()*20}" stroke="#4a2414" stroke-width="2" opacity=".5"/>`; } return s; }
// baraque à toit arrondi (vue de face, en perspective légère)
function hut(x,y,k,door){ return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-110 0 V-40 Q-110 -110 0 -112 Q110 -110 110 -40 V0Z" fill="#6a5a7a"/>`+
  [-80,-40,0,40,80].map(dx=>`<path d="M${dx} -110 Q${dx*1.05} -60 ${dx} 0" stroke="#4a3e5a" stroke-width="3" fill="none"/>`).join('')+
  `<rect x="-110" y="-40" width="220" height="40" fill="#5a4a3a"/><rect x="-80" y="-34" width="34" height="22" fill="#e8b060" opacity=".7"/><rect x="46" y="-34" width="34" height="22" fill="#e8b060" opacity=".7"/><g class="an-pulse"${dl(x%4,'animation-duration:5s')}>${glow(-63,-23,40,20,'#ffb060',.4)}${glow(63,-23,40,20,'#ffb060',.4)}</g>`+
  (door?`<rect x="-16" y="-40" width="32" height="40" fill="#3a2a1e"/>`:'')+`</g>`; }
function tower(x,y,k){ return `<g transform="translate(${x} ${y}) scale(${k})"><g class="an-sweep"${dl((x%7))}><path d="M0 -196 L-90 200 H90Z" fill="#fff4d0" opacity=".1"/></g></g><g transform="translate(${x} ${y}) scale(${k})" stroke="#3a2a22" stroke-width="5" fill="none"><path d="M-40 0 L-26 -170 M40 0 L26 -170 M-36 -40 L34 -100 M36 -40 L-34 -100 M-33 -100 L30 -150 M33 -100 L-30 -150"/>`+
  `<rect x="-50" y="-215" width="100" height="45" fill="#6a4a32"/><path d="M-60 -215 L0 -250 L60 -215Z" fill="#4a3226"/><rect x="-36" y="-205" width="72" height="18" fill="#2a1e18" stroke="none"/><circle class="an-pulse" cx="0" cy="-196" r="7" fill="#fff4d0" stroke="none"/></g>`; }
// la clôture de barbelés au premier plan (sur toute la largeur)
function fence(y,live){ let s=''; for(let x=40;x<W;x+=190) s+=`<rect x="${x}" y="${y-170}" width="12" height="190" fill="#7a6a5a"/><path d="M${x+6} ${y-170} l-26 -20" stroke="#7a6a5a" stroke-width="7"/>`;
  for(let i=0;i<6;i++){ const yy=y-150+i*26; s+=`<path d="M0 ${yy} Q300 ${yy+8} 600 ${yy} T${W} ${yy}" stroke="#9a9aa8" stroke-width="2.5" fill="none"/>`;
    for(let x=20+i*13;x<W;x+=64) s+=`<path d="M${x-4} ${yy-4} l8 8 m0 -8 l-8 8" stroke="#9a9aa8" stroke-width="2"/>`; }
  if(live) s+=`<g opacity=".8">${[200,560,930].map((x,i)=>`<path class="an-buzz"${dl(i*1.3,'animation-duration:'+(2+i*.7).toFixed(1)+'s')} d="M${x} ${y-120} l8 -10 l-4 0 l8 -12" stroke="#bfe8ff" stroke-width="2" fill="none"/>`).join('')}</g>`;
  return s; }
// ---------- dedans : murs de planches, plancher, fenêtre sur le soir ----------
function room(o){
  o=o||{}; const wall=o.wall||'#7a5a3e', dark=o.dark||'#5a3e28';
  let s=`<rect width="${W}" height="${H}" fill="${wall}"/>`;
  for(let x=0;x<W;x+=46) s+=`<path d="M${x} 0 V260" stroke="${dark}" stroke-width="3" opacity=".6"/>`;
  s+=`<rect y="0" width="${W}" height="22" fill="${dark}"/>`;
  for(const x of (o.beams||[200,600,1000])) s+=`<rect x="${x-10}" y="0" width="20" height="260" fill="${dark}"/>`;
  const [fu,fd]=grad([o.floor||'#8a6a48','#5a4028']); s+=fd+`<path d="M0 260 H${W} V${H} H0Z" fill="${fu}"/>`;
  for(let i=-9;i<=9;i++) s+=`<path d="M${598+i*70} 260 L${598+i*190} ${H}" stroke="#3a2818" stroke-width="2" opacity=".35"/>`;
  for(const wx of (o.windows||[])) s+=`<rect x="${wx-46}" y="70" width="92" height="74" fill="#3a2a1e"/>`+(()=>{ const [u,d]=grad(['#6a4a7a','#e89050']); return d+`<rect x="${wx-40}" y="76" width="80" height="62" fill="${u}"/>`; })()+`<path d="M${wx} 76 V138 M${wx-40} 107 H${wx+40}" stroke="#3a2a1e" stroke-width="5"/>`+glow(wx,150,140,70,'#e89050',.25);
  if(o.lamp) s+=`<g class="an-swing" style="animation-duration:5s"><path d="M${o.lamp} 0 V50" stroke="#2a2a2a" stroke-width="3"/><path d="M${o.lamp-24} 64 L${o.lamp} 46 L${o.lamp+24} 64Z" fill="#4a4a3a"/><g class="an-pulse" style="animation-duration:3s">${glow(o.lamp,70,90,60,'#ffe0a0',.45)}</g></g>`;
  return s;
}
// ---------- meubles et choses fixes (origine au milieu de leur base, au sol) ----------
const F={
 bunk:()=>`<rect x="-90" y="-200" width="10" height="200" fill="#5a3a22"/><rect x="80" y="-200" width="10" height="200" fill="#5a3a22"/>`+
   [-70,-170].map(y=>`<rect x="-92" y="${y}" width="184" height="14" fill="#6a4a2e"/><rect x="-84" y="${y-10}" width="168" height="10" fill="#8a8a7a"/>`).join(''),
 table:()=>`<rect x="-120" y="-96" width="240" height="16" fill="#6a4a2e"/><rect x="-110" y="-80" width="12" height="80" fill="#4a3220"/><rect x="98" y="-80" width="12" height="80" fill="#4a3220"/>`,
 locker:()=>`<rect x="-50" y="-220" width="100" height="220" fill="#5a6a5a"/><path d="M0 -216 V-4" stroke="#3a4a3a" stroke-width="3"/>`+[-30,30].map(x=>[0,1,2,3,4].map(i=>`<path d="M${x-14} ${-200+i*8} h28" stroke="#3a4a3a" stroke-width="2"/>`).join('')).join('')+`<circle cx="-8" cy="-110" r="4" fill="#c8c8b8"/><circle cx="8" cy="-110" r="4" fill="#c8c8b8"/>`,
 desk:()=>`<rect x="-110" y="-110" width="220" height="18" fill="#6a4a2e"/><rect x="-104" y="-92" width="80" height="92" fill="#5a3e26"/><rect x="-96" y="-84" width="64" height="24" fill="none" stroke="#3a2818" stroke-width="3"/><rect x="92" y="-92" width="12" height="92" fill="#4a3220"/>`,
 racks:()=>[-100,0,100].map(x=>`<rect x="${x-34}" y="-160" width="8" height="160" fill="#5a3a22"/><rect x="${x+26}" y="-160" width="8" height="160" fill="#5a3a22"/>`+[-140,-90,-40].map(y=>`<rect x="${x-34}" y="${y}" width="68" height="8" fill="#6a4a2e"/>`).join('')).join(''),
 beds:()=>[-150,0,150].map(x=>`<rect x="${x-60}" y="-60" width="120" height="16" fill="#6a6a5a"/><rect x="${x-60}" y="-90" width="10" height="90" fill="#4a4a42"/><rect x="${x+50}" y="-90" width="10" height="90" fill="#4a4a42"/><rect x="${x-54}" y="-72" width="108" height="12" fill="#9a9a8a"/>`).join(''),
 cots:()=>[-130,0,130].map(x=>`<path d="M${x-55} -50 L${x+55} -50 L${x+50} -40 L${x-50} -40Z" fill="#8a8a6a"/><path d="M${x-50} -40 l-10 40 M${x+50} -40 l10 40 M${x-50} 0 l100 -40 M${x+50} 0 l-100 -40" stroke="#4a4a3a" stroke-width="3"/>`).join(''),
 cabinet:()=>`<rect x="-46" y="-240" width="92" height="110" fill="#e8e8e0"/><rect x="-40" y="-234" width="80" height="98" fill="#d8d8d0"/><path d="M0 -234 V-136" stroke="#a8a8a0" stroke-width="2"/><path d="M-12 -200 h24 M0 -212 v24" stroke="#c83a3a" stroke-width="7"/>`,
 optable:()=>`<rect x="-130" y="-100" width="260" height="20" fill="#c8c8c0"/><rect x="-10" y="-80" width="20" height="70" fill="#8a8a82"/><rect x="-60" y="-10" width="120" height="10" fill="#6a6a62"/>`,
 sink:()=>`<path d="M-60 -130 H60 L48 -96 H-48Z" fill="#e8e8e0"/><rect x="-8" y="-96" width="16" height="96" fill="#9a9a92"/><path d="M0 -130 v-24 h22" stroke="#9aa0a8" stroke-width="6" fill="none"/><path d="M22 -152 v10" stroke="#9aa0a8" stroke-width="4"/>`,
 stalls:()=>[-180,-60,60,180].map(x=>`<rect x="${x-56}" y="-230" width="112" height="230" fill="#c8d0c8"/>`+[0,1,2,3,4,5].map(i=>`<path d="M${x-56} ${-230+i*38} h112" stroke="#a0aaa0" stroke-width="2"/>`).join('')+`<path d="M${x} -220 v20" stroke="#8a9098" stroke-width="5"/><circle cx="${x}" cy="-196" r="8" fill="#8a9098"/>`).join('')+`<ellipse cx="0" cy="-6" rx="30" ry="6" fill="#4a4a4a"/>`,
 hooks:()=>[-150,-90,-30,30,90,150].map(x=>`<path d="M${x} -200 v12 q0 8 8 8" stroke="#3a3a3a" stroke-width="4" fill="none"/>`).join(''),
 benches:()=>[-180,180].map(x=>`<rect x="${x-130}" y="-50" width="260" height="14" fill="#6a4a2e"/><rect x="${x-120}" y="-36" width="10" height="36" fill="#4a3220"/><rect x="${x+110}" y="-36" width="10" height="36" fill="#4a3220"/>`).join('')+`<rect x="-120" y="-90" width="240" height="14" fill="#7a5a3a"/>`,
 icebox:()=>`<rect x="-50" y="-190" width="100" height="190" rx="8" fill="#e8e0c8"/><path d="M-50 -110 H50" stroke="#a8a090" stroke-width="3"/><rect x="30" y="-170" width="10" height="40" rx="4" fill="#9a9a90"/><rect x="30" y="-96" width="10" height="40" rx="4" fill="#9a9a90"/>`,
 stove:()=>`<rect x="-70" y="-110" width="140" height="110" fill="#2a2a2a"/><rect x="-70" y="-120" width="140" height="12" fill="#3a3a3a"/><rect x="-50" y="-90" width="70" height="50" fill="#1a1a1a"/>`+`<g class="an-pulse" style="animation-duration:1.2s">${glow(-15,-64,30,20,'#ff7a2a',.3)}</g><circle class="an-smoke" cx="40" cy="-264" r="10" fill="#d8d0c8" opacity=".35"/><circle class="an-smoke" style="animation-delay:-3.5s" cx="40" cy="-264" r="10" fill="#d8d0c8" opacity=".35"/><rect x="30" y="-260" width="20" height="140" fill="#2a2a2a"/>`,
 counter:()=>`<rect x="-160" y="-100" width="320" height="100" fill="#6a4a2e"/><rect x="-170" y="-108" width="340" height="12" fill="#8a6a48"/><rect x="-60" y="-84" width="120" height="30" fill="none" stroke="#3a2818" stroke-width="3"/><circle cx="0" cy="-69" r="4" fill="#c8a868"/>`,
 soil:()=>[0,1,2,3].map(i=>`<path d="M${-300+i*40} ${-8-i*14} Q0 ${-22-i*14} ${300-i*40} ${-8-i*14}" stroke="#2a1a12" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('')+[-200,-100,0,100,200].map((x,i)=>`<path d="M${x} ${-30-i%2*14} q-10 -20 0 -30 q10 10 0 30 M${x} ${-30-i%2*14} q14 -16 24 -12" stroke="#4a8a3a" stroke-width="4" fill="none"/>`).join(''),
 wheelbarrow:()=>`<path d="M-70 -50 L60 -50 L40 -14 L-50 -14Z" fill="#6a7a6a"/><circle cx="66" cy="-14" r="14" fill="none" stroke="#3a3a3a" stroke-width="5"/><path d="M-70 -50 l-40 -14 M-50 -14 v14" stroke="#5a3a22" stroke-width="6"/>`,
 lockeddoor:(open,lockOpen)=>{ let s=`<rect x="-70" y="-230" width="140" height="230" fill="#2a1a12"/>`;
   if(open) s+=`<path d="M-70 -230 L-120 -220 V-8 L-70 0Z" fill="#6a4a2e"/>`+(()=>{ const [u,d]=grad(['#6a4a7a','#e89050']); return d+`<rect x="-62" y="-222" width="124" height="222" fill="${u}"/>`; })()+`<path d="M-62 -60 H62 V0 H-62Z" fill="#8a4a2a"/>`;
   else s+=`<rect x="-64" y="-224" width="128" height="224" fill="#6a4a2e"/><path d="M-64 -150 H64 M-64 -74 H64" stroke="#4a3220" stroke-width="4"/>`+
     `<rect x="30" y="-130" width="26" height="30" rx="4" fill="${lockOpen?'#8a8a82':'#3a3a3e'}"/><circle cx="43" cy="-115" r="7" fill="#c8c8c0"/><path d="M34 -130 q9 ${lockOpen?-26:-16} 18 0" stroke="#8a8a92" stroke-width="4" fill="none"/>`+
     `<rect x="-40" y="-200" width="80" height="40" fill="#e8dcc0"/><path d="M-30 -186 h60 M-30 -174 h44" stroke="#3a2a1e" stroke-width="4"/>`;
   return s; },
 chest:()=>`<rect x="-70" y="-70" width="140" height="70" fill="#5a3a22"/><path d="M-70 -70 Q0 -100 70 -70" fill="#6a4a2e"/><rect x="-8" y="-60" width="16" height="16" fill="#c8a868"/>`,
 box:()=>`<rect x="-60" y="-90" width="120" height="90" fill="#9a7a4a"/><path d="M-60 -90 L60 0 M60 -90 L-60 0" stroke="#7a5a32" stroke-width="3"/><rect x="-60" y="-90" width="120" height="90" fill="none" stroke="#6a4a22" stroke-width="4"/>`,
 ladder:()=>`<path d="M-30 0 L-22 -300 M30 0 L22 -300" stroke="#7a5a32" stroke-width="9"/>`+[0,1,2,3,4,5,6,7].map(i=>`<path d="M-28 ${-20-i*36} H28" stroke="#7a5a32" stroke-width="7"/>`).join(''),
 doghouse:(fed)=>`<path d="M-80 0 V-90 L0 -150 L80 -90 V0Z" fill="#8a5a32"/><path d="M-96 -86 L0 -162 L96 -86" stroke="#5a3a1e" stroke-width="14" fill="none"/><path d="M-36 0 V-50 Q0 -86 36 -50 V0Z" fill="#1a0e08"/>`+
   (fed?'':`<circle cx="-12" cy="-40" r="4" fill="#ffd040"/><circle cx="12" cy="-40" r="4" fill="#ffd040"/>`),
 dog:(fed)=>fed?`<g transform="translate(-30 0)"><ellipse cx="0" cy="-24" rx="60" ry="22" fill="#6a4a2a"/><ellipse cx="-24" cy="-36" rx="34" ry="18" fill="#3a2a1a"/><circle cx="-62" cy="-36" r="18" fill="#6a4a2a"/><path d="M-70 -50 l-6 -18 l14 10Z M-56 -52 l2 -18 l10 14Z" fill="#3a2a1a"/><path d="M-86 -24 q14 -4 22 6" fill="#c88a6a"/><path d="M-96 -14 h40" stroke="#e8d8c0" stroke-width="7" stroke-linecap="round"/><path d="M58 -30 q24 -10 30 -30" stroke="#6a4a2a" stroke-width="9" fill="none" stroke-linecap="round"/></g>`
   :`<g><path d="M-60 -10 L-50 -60 Q0 -84 50 -60 L60 -10" fill="#6a4a2a"/><path d="M-30 -70 Q0 -90 30 -70 L20 -60 L-20 -60Z" fill="#3a2a1a"/><circle cx="-60" cy="-74" r="24" fill="#6a4a2a"/><path d="M-72 -94 l-8 -24 l18 12Z M-52 -96 l2 -24 l12 18Z" fill="#3a2a1a"/>`+
     `<path d="M-90 -66 q12 -8 26 -2 l-2 16 q-14 6 -26 -6Z" fill="#8a2a2a"/><path d="M-86 -66 l4 6 l4 -6 l4 6 M-86 -52 l4 -6 l4 6 l4 -6" stroke="#fff" stroke-width="2" fill="none"/><circle cx="-64" cy="-80" r="3.5" fill="#ffd040"/>`+
     `<path d="M-90 -50 q-6 10 -2 18" stroke="#e8f0ff" stroke-width="3" fill="none"/><path d="M-50 -10 v10 M40 -10 v10" stroke="#3a2a1a" stroke-width="8"/><path d="M60 -50 q30 -20 24 -50" stroke="#6a4a2a" stroke-width="9" fill="none" stroke-linecap="round"/></g>`,
 gate:(live)=>{ let s=`<rect x="-220" y="-250" width="20" height="250" fill="#5a4a3a"/><rect x="200" y="-250" width="20" height="250" fill="#5a4a3a"/>`;
   for(const x0 of [-200,0]){ s+=`<rect x="${x0}" y="-220" width="200" height="220" fill="none" stroke="#6a6a72" stroke-width="7"/><path d="M${x0} -220 L${x0+200} 0 M${x0+200} -220 L${x0} 0" stroke="#6a6a72" stroke-width="5"/>`;
     for(let i=0;i<10;i++) s+=`<path d="M${x0+i*20+10} -216 V-4" stroke="#8a8a92" stroke-width="1.5"/>`; }
   s+=`<rect x="-14" y="-130" width="28" height="34" rx="4" fill="#3a3a3e"/>`+[0,1,2].map(i=>`<path d="M-220 ${-260-i*12} Q0 ${-250-i*12} 220 ${-260-i*12}" stroke="#9a9aa8" stroke-width="2" fill="none"/>`).join('');
   return s+`<rect x="-100" y="-270" width="200" height="34" fill="#e8dcc0"/><path d="M-84 -258 h168 M-84 -246 h120" stroke="#2a1a12" stroke-width="5"/>`; },
 switch:(off)=>`<rect x="-46" y="-250" width="92" height="120" fill="#4a4a46"/><rect x="-38" y="-242" width="76" height="104" fill="#6a6a62"/><path d="M0 -190 L${off?-26:26} ${off?-170:-220}" stroke="#c8c8c0" stroke-width="10" stroke-linecap="round"/><circle cx="0" cy="-190" r="10" fill="#3a3a3a"/>`+
   `<rect x="-34" y="-128" width="68" height="18" fill="#e8dcc0"/><path d="M-26 -119 h52" stroke="#c83a3a" stroke-width="4"/><path d="M-60 -200 H-200 M60 -200 H200" stroke="#2a2a2a" stroke-width="6"/>`,
 keyhole:(open)=>open?'':`<rect x="-26" y="-150" width="52" height="70" rx="6" fill="#6a6a6a"/><circle cx="0" cy="-124" r="8" fill="#0a0a0a"/><path d="M-4 -120 h8 l3 24 h-14Z" fill="#0a0a0a"/>`
};
// ---------- les lieux ----------
const KIND={1:'barracks',2:'barracks',3:'barracks',4:'open',5:'open',6:'open',7:'open',8:'open',9:'hospital',10:'rest',11:'shower',12:'rest',13:'chow',14:'garden',15:'guard',16:'yard',
 17:'hotbox',18:'gate',19:'tower',20:'tower',21:'tower',22:'tower',23:'fence',24:'fence',25:'fence',26:'fence',27:'tunnel',28:'tunnel',29:'tunnel',30:'tunnel',31:'door',32:'attic',33:'forest',34:'hole'};
function outdoor(r,huts){ let s=sky(r)+ground(); const rr=rng(r*7);
  for(let i=0;i<5;i++) s+=tower(80+i*260+rr()*60,252,.32);
  for(const [x,k] of huts||[[200,.9],[600,1],[1000,.9]]) s+=hut(x,262+k*10,k,true);
  return s; }
function tunnelBg(r){ let s=`<rect width="${W}" height="${H}" fill="#1a100a"/>`;
  const [u,d]=grad(['#4a2a18','#2a1810']); s+=d+`<path d="M220 ${H} L380 90 Q600 40 820 90 L980 ${H}Z" fill="${u}"/>`;
  s+=`<path d="M420 ${H} L500 150 Q600 120 700 150 L780 ${H}Z" fill="#0a0604"/>`;
  for(const [x0,y0,x1] of [[290,330,370],[830,330,910]]) s+=`<rect x="${x0}" y="110" width="22" height="${y0-110}" fill="#6a4a2a" transform="skewX(${x0<600?6:-6})"/>`;
  s+=`<rect x="330" y="96" width="540" height="22" fill="#6a4a2a"/><g class="an-pulse">${glow(600,140,240,90,'#ffb060',.18)}</g>`;
  for(let i=0;i<30;i++){ const rr=rng(r*31+i); s+=`<circle class="an-float"${dl(i*.23)} cx="${(rr()*W).toFixed(0)}" cy="${(rr()*H).toFixed(0)}" r="${(1+rr()*3).toFixed(1)}" fill="#6a4a30" opacity=".6"/>`; }
  return s; }
function place(r){
  const k=KIND[r], own=[]; let s='';
  const has=n=>X.has(n);
  switch(k){
   case 'open': { const L={4:[[160,.8],[560,.6],[960,1]],5:[[300,1],[900,.7]],6:[[220,.6],[640,.9],[1040,.6]],7:[[180,.9],[1000,.9]],8:[[420,.7],[860,1]]};
     s=outdoor(r,L[r]);
     if(r===4) s+=`<path d="M940 330 V90" stroke="#3a3a3a" stroke-width="6"/><path d="M943 94 h70 v44 h-70Z" fill="#4a5a4a"/><path d="M943 116 h70" stroke="#c8c0a0" stroke-width="4"/>`;
     if(r===5) s+=[0,1,2].map(i=>`<rect x="${560+i*44}" y="280" width="38" height="52" rx="6" fill="#4a5a4a" stroke="#2a3a2a" stroke-width="3"/>`).join('');
     if(r===6) s+=`<path d="M380 330 V200 M820 330 V200" stroke="#5a3a22" stroke-width="7"/><path d="M380 206 Q600 236 820 206" stroke="#d8d0c0" stroke-width="2" fill="none"/>`+[440,520,640,720].map((x,i)=>`<rect x="${x}" y="${214+(i%2)*4}" width="34" height="${30+i*4}" fill="${['#e8e0c8','#7a8a6a','#c8c0a8','#6a7a8a'][i]}"/>`).join('');
     if(r===7) s+=`<g transform="translate(600 330)"><path d="M-40 0 L-30 -170 M40 0 L30 -170 M-36 -60 L34 -120 M36 -60 L-34 -120" stroke="#3a2a22" stroke-width="6"/><ellipse cx="0" cy="-200" rx="70" ry="20" fill="#4a3a32"/><rect x="-70" y="-260" width="140" height="60" fill="#5a4a42"/><ellipse cx="0" cy="-260" rx="70" ry="20" fill="#6a5a52"/></g>`;
     if(r===8) s+=`<path d="M200 334 V230" stroke="#5a3a22" stroke-width="7"/><rect x="140" y="214" width="120" height="34" fill="#e8dcc0"/><path d="M154 226 h92 M154 236 h60" stroke="#2a1a12" stroke-width="4"/>`;
     break; }
   case 'tower': s=sky(r)+ground()+hut(r%2?900:300,262,.5,true)+tower([300,820,460,980][r-19],320,1.2)+fence(340,!has(106)); break;
   case 'fence': s=sky(r)+ground(); for(let i=0;i<3;i++) s+=hut(260+i*340,268,.55,true);
     if(r===25&&(has(83)||has(84))){ s+=`<ellipse cx="760" cy="350" rx="${has(84)?90:70}" ry="${has(84)?26:18}" fill="${has(84)?'#120804':'#4a2414'}"/>`; own.push(83,84); }
     s+=fence(300,!has(106)); break;
   case 'gate': s=sky(r)+ground()+tower(140,300,.8)+tower(1060,300,.8)+g(600,1,F.gate(!has(106)),338)+fence(320,!has(106)).replace(/<rect x="(4|2|6|8)\d\d" [^>]*>/g,''); break;
   case 'forest': { const [u,d]=grad(['#1a2a4a','#4a4a6a','#c87a4a']); s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
     const rr=rng(33); for(let i=0;i<26;i++){ const x=rr()*W, h=160+rr()*180, w=40+rr()*40; s+=`<path class="an-sway"${dl(i*.4,'animation-duration:'+(6+i%4)+'s')} d="M${x} ${300} L${x-w} 300 L${x} ${300-h} L${x+w} 300Z" fill="${i%2?'#1a3a2a':'#24442e'}"/><rect x="${x-5}" y="300" width="10" height="20" fill="#2a1a12"/>`; }
     s+=`<path d="M0 300 H${W} V${H} H0Z" fill="#2a2a1a"/><ellipse cx="600" cy="352" rx="60" ry="16" fill="#120a06"/><path d="M570 352 q30 -30 60 0" stroke="#6a4a2a" stroke-width="5" fill="none"/>`+glow(980,120,200,120,'#ffb060',.35);
     if(has(109)) s+=plane(300,80,1)+plane(420,60,.8); break; }
   case 'hole': s=`<rect width="${W}" height="${H}" fill="#120804"/>`+(()=>{ const [u,d]=grad(['#e8a050','#6a4a7a']); return d+`<ellipse cx="600" cy="30" rx="180" ry="40" fill="${u}"/>`; })()+
     `<path d="M300 ${H} L420 60 M900 ${H} L780 60" stroke="#2a1408" stroke-width="40"/>`; break;
   case 'tunnel': s=tunnelBg(r);
     if(r===30) s+=`<rect x="560" y="0" width="80" height="120" fill="#2a1a10"/>`+[0,1,2].map(i=>`<path d="M570 ${20+i*34} H630" stroke="#7a5a32" stroke-width="6"/>`).join('')+glow(600,40,80,60,'#e89050',.4);
     break;
   case 'hotbox': s=`<rect width="${W}" height="${H}" fill="#2a2018"/>`;
     for(let x=300;x<900;x+=40) s+=`<path d="M${x} 0 V${H}" stroke="#1a140e" stroke-width="3"/>`;
     s+=`<path d="M0 0 L300 40 V300 L0 ${H}Z M${W} 0 L900 40 V300 L${W} ${H}Z" fill="#1a140e"/><path d="M300 300 H900 L${W} ${H} H0Z" fill="#3a2a1e"/>`;
     if(has(107)) s+=`<rect x="520" y="80" width="160" height="220" fill="#1a0e08"/>`+(()=>{ const [u,d]=grad(['#6a4a7a','#e89050']); return d+`<rect x="530" y="90" width="140" height="210" fill="${u}" opacity=".85"/>`; })();
     else s+=`<rect x="520" y="80" width="160" height="220" fill="#4a3424"/><rect x="530" y="90" width="140" height="200" fill="none" stroke="#2a1a10" stroke-width="4"/>`+g(600,1,F.keyhole(false),300)+`<path d="M560 100 h80" stroke="#e8b060" stroke-width="3" opacity=".6"/>`;
     s+=glow(600,96,140,30,'#e8b060',.25); own.push(66); break;
   case 'barracks': {
     s=room({windows:[300,900],lamp:600});
     if(r===1){ s+=g(180,1,F.bunk())+g(1010,1,F.bunk())+g(420,1,F.locker())+g(760,1,F.table()); own.push(1,4,6); if(has(2)) { s+=g(740,1,`<rect x="-10" y="-120" width="20" height="24" rx="3" fill="#e8e8e0"/><path d="M10 -112 q8 0 8 8 q0 8 -8 8" stroke="#e8e8e0" stroke-width="3" fill="none"/><ellipse cx="0" cy="-118" rx="8" ry="3" fill="#3a2418"/>`); own.push(2); } }
     if(r===2){ s+=g(330,1,F.desk())+g(800,1,F.racks()); own.push(7,9); if(has(10)){ s+=g(800,1,`<path d="M-80 -152 v-38 h20 v30 h14 v8Z M-40 -152 v-38 h20 v30 h14 v8Z" fill="#2a1a12"/>`+(has(11)?`<path d="M-80 -152 h34 M-40 -152 h34" stroke="#b84a2a" stroke-width="4"/>`:'')); own.push(10,11); } }
     if(r===3){ const lifted=has(108);
       s+=g(600,1.05,F.beds()); own.push(15,12);
       if(has(16)||!has(108)&&!has(17)) {}
       s+=`<path d="M470 352 H730 L740 370 H460Z" fill="${lifted?'#0a0604':(has(17)?'#8a6a48':'#7a7a70')}" stroke="#3a2818" stroke-width="2"/>`;
       if(lifted){ s+=[0,1,2].map(i=>`<path d="M${520+i*60} 356 v14" stroke="#7a5a32" stroke-width="5"/>`).join(''); own.push(18); }
       if(has(16)) own.push(16); if(has(17)) own.push(17); }
     break; }
   case 'door': s=outdoor(r,[[180,.7],[1020,.7]]);
     s+=`<g transform="translate(600 300) scale(1.6)"><path d="M-150 0 V-50 Q-150 -150 0 -152 Q150 -150 150 -50 V0Z" fill="#6a5a7a"/><rect x="-150" y="-50" width="300" height="50" fill="#5a4a3a"/></g>`+
       g(600,.7,F.lockeddoor(has(102),has(101)),300); own.push(13,14); break;
   case 'hospital': s=room({wall:'#c8c8b8',dark:'#a8a898',floor:'#9a9a8a',windows:[160],lamp:620})+g(620,1,F.cots(),330)+g(930,1,F.cabinet(),330)+g(380,1,F.optable(),330); own.push(21,24,27);
     if(has(22)){ s+=g(620,1,`<ellipse cx="-130" cy="-56" rx="30" ry="10" fill="#f4f0e8"/>`,330); own.push(22); }
     if(has(28)){ s+=g(380,1,`<path d="M-10 -104 l30 -10 M-10 -110 l30 10" stroke="#9aa0a8" stroke-width="4"/><circle cx="-16" cy="-102" r="5" fill="none" stroke="#c83a3a" stroke-width="3"/><circle cx="-16" cy="-112" r="5" fill="none" stroke="#c83a3a" stroke-width="3"/>`,330); own.push(28); }
     break;
   case 'rest': s=room({windows:[300,900],lamp:600,wall:r===12?'#6a5a4a':'#7a5a3e'})+g(600,1,F.table())+[440,760].map(x=>g(x,1,`<rect x="-24" y="-60" width="48" height="10" fill="#5a3a22"/><rect x="-24" y="-110" width="8" height="110" fill="#4a3220"/><rect x="16" y="-60" width="8" height="60" fill="#4a3220"/>`)).join('')+
     (r===12?`<rect x="140" y="60" width="140" height="90" fill="#3a2a1e"/><rect x="150" y="70" width="120" height="70" fill="#5a6a4a"/><path d="M160 80 h40 M160 92 h70" stroke="#e8dcc0" stroke-width="3"/>`:`<rect x="900" y="60" width="90" height="120" fill="#e8dcc0"/>`+[0,1,2,3,4].map(i=>`<path d="M912 ${84+i*18} h66" stroke="#8a7a6a" stroke-width="2"/>`).join('')+`<rect x="900" y="60" width="90" height="18" fill="#8a3a2a"/>`); break;
   case 'shower': s=room({wall:'#a8b0a8',dark:'#88908a',floor:'#7a8278',beams:[],windows:[]})+g(620,1,F.stalls())+g(1060,1,F.sink())+g(160,1,F.hooks()); own.push(30,31,32,33,34);
     if(has(35)){ s+=g(160,1,`<path d="M-60 -188 l-20 90 h40 l-6 -60 l6 60 h40 l-20 -90Z" fill="#5a3a22"/>`); own.push(35); } break;
   case 'chow': s=room({windows:[600],lamp:400})+g(600,1,F.benches())+g(1000,1,F.stove())+g(200,1,F.icebox())+g(780,1,F.counter(),300); own.push(36,38,39,41,42); break;
   case 'garden': s=sky(r)+ground()+hut(300,262,.7,true)+hut(900,262,.7,true)+g(600,1,F.soil(),360)+g(940,1,F.wheelbarrow(),346); own.push(45,48);
     if(has(46)){ s+=g(250,1,`<path d="M0 0 L60 -200" stroke="#7a5a32" stroke-width="7"/><path d="M60 -200 l-30 4 l-6 14 l40 -6Z" fill="#6a6a72"/>`,350); own.push(46); }
     if(has(47)){ s+=g(370,1,`<path d="M0 0 L20 -170" stroke="#7a5a32" stroke-width="8"/><path d="M-40 -160 Q20 -190 80 -160 L20 -172Z" fill="#6a6a72"/>`,350); own.push(47); } break;
   case 'guard': s=room({windows:[180],lamp:600})+g(600,1,F.lockeddoor(has(104),has(103)),300)+g(920,1,F.chest())+g(330,1,F.box())+g(1080,1,F.ladder()); own.push(50,51,53,55,58);
     if(has(56)){ s+=g(330,1,`<rect x="-34" y="-130" width="68" height="40" rx="6" fill="#4a3a2a"/><circle cx="-14" cy="-110" r="10" fill="#c8a868"/><path d="M8 -120 h20 M8 -110 h20 M8 -100 h20" stroke="#c8a868" stroke-width="3"/><path d="M34 -110 q40 0 50 100" stroke="#2a2a2a" stroke-width="3" fill="none"/>`); own.push(56); }
     if(has(57)){ s+=g(400,1,`<ellipse cx="0" cy="-96" rx="12" ry="6" fill="#8a8a82"/><path d="M12 -96 q14 0 12 -8" stroke="#8a8a82" stroke-width="2" fill="none"/>`); own.push(57); }
     break;
   case 'yard': s=sky(r)+ground()+fence(300,!has(106)).replace(/opacity="\.8"/,'opacity="0"')+g(820,1,F.doghouse(has(105)),340); own.push(63);
     if(has(105)){ s+=g(380,1.1,F.dog(true),352); own.push(64,82); }
     else if(has(64)){ s+=g(640,1.1,F.dog(false),352); own.push(64); }
     if(has(62)){ s+=g(260,1,`<path d="M-60 -6 L60 -18" stroke="#c89a5a" stroke-width="12" stroke-linecap="round"/><path d="M-60 -6 L-20 -10" stroke="#8a6a3a" stroke-width="8"/>`,356); own.push(62); }
     break;
   case 'attic': s=`<rect width="${W}" height="${H}" fill="#3a2a1e"/>`+[0,1,2,3,4,5].map(i=>`<path d="M${i*240-120} 0 L600 -400 M${i*240-120} ${H}" stroke="#5a3e28" stroke-width="20"/>`).join('')+
     `<path d="M0 260 L600 20 L${W} 260" stroke="#5a3e28" stroke-width="26" fill="none"/><path d="M0 300 H${W} V${H} H0Z" fill="#4a3424"/><rect x="560" y="300" width="80" height="60" fill="#120a06"/>`+glow(600,330,80,30,'#e8b060',.3)+g(600,1,F.switch(has(106)),300); own.push(78,80); break;
  }
  return {s,own};
}
function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const r=parseInt(key)||off+1;
  X=new Set(objs);
  const p=place(r);
  let s=p.s;
  const items=objs.filter(i=>OBJ[i]&&!FIXED.has(i)&&!p.own.includes(i)).sort((a,b)=>a-b);
  const x0=260, x1=940, slots=Math.max(4,items.length);
  items.forEach((i,j)=>{ const xx=x0+(x1-x0)*((j*3+off)%slots+.5)/slots; s+=g(xx,1.3,OBJ[i](),G+20+((i*13)%3)*8); });
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}${veil()}</svg>`;
}
// choses fixes : jamais posées au sol
const FIXED=new Set([1,4,6,7,9,12,13,14,15,18,21,24,27,29,30,31,32,33,34,36,38,39,41,42,45,48,50,51,52,53,55,58,63,64,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,83,84]);

// ---------- objets qu'on peut porter (posés au sol, et icônes) ----------
const OBJ={
 2:()=>`<rect x="-10" y="-24" width="20" height="24" rx="3" fill="#e8e8e0"/><path d="M10 -16 q8 0 8 8 q0 8 -8 8" stroke="#e8e8e0" stroke-width="3" fill="none"/>`,
 3:()=>`<ellipse cx="0" cy="-6" rx="12" ry="5" fill="#c8a040" stroke="#8a6a20" stroke-width="2"/>`,
 5:()=>`<path d="M-50 -6 h90" stroke="#5a3a22" stroke-width="8"/><rect x="40" y="-12" width="14" height="12" fill="none" stroke="#c8a868" stroke-width="3"/>`,
 8:()=>`<rect x="-16" y="-14" width="32" height="12" rx="2" fill="#e8e8e0" stroke="#3a3a3a" stroke-width="1.5"/><path d="M-10 -10 h10" stroke="#c83a3a" stroke-width="3"/>`,
 10:()=>`<path d="M-40 0 v-38 h20 v30 h14 v8Z M0 0 v-38 h20 v30 h14 v8Z" fill="#2a1a12"/>`,
 11:()=>`<ellipse cx="0" cy="-6" rx="26" ry="8" fill="#b84a2a"/>`,
 16:()=>[0,1,2].map(i=>`<rect x="${-36+i*24}" y="${-10-i%2*4}" width="22" height="10" fill="#9a9a90" stroke="#6a6a62" stroke-width="1.5"/>`).join(''),
 17:()=>`<rect x="-60" y="-14" width="120" height="10" fill="#8a6a48" stroke="#5a3e28" stroke-width="2"/><rect x="-56" y="-6" width="112" height="6" fill="#7a5a3a"/>`,
 19:()=>`<path d="M-22 -40 h44 l-6 40 h-32Z" fill="#8a8a92"/><path d="M-22 -40 q22 -26 44 0" stroke="#5a5a62" stroke-width="3" fill="none"/>`,
 20:()=>`<path d="M-50 -4 L40 -40" stroke="#7a5a32" stroke-width="7"/><path d="M40 -40 l12 -18 l20 6 l-10 24Z" fill="#6a6a72"/>`,
 22:()=>`<rect x="-34" y="-20" width="68" height="20" rx="10" fill="#f4f0e8"/>`,
 23:()=>`<rect x="-20" y="-14" width="40" height="14" fill="#f4ecd8" transform="rotate(-6)"/><path d="M-14 -8 h26" stroke="#3a2a1e" stroke-width="2"/>`,
 25:()=>`<ellipse cx="-10" cy="-10" rx="16" ry="10" fill="#f4f0e8"/><ellipse cx="-10" cy="-10" rx="6" ry="4" fill="#d8d0c0"/><path d="M6 -10 h30" stroke="#f4f0e8" stroke-width="8"/>`,
 26:()=>`<rect x="-10" y="-44" width="20" height="44" rx="4" fill="#8ab0c0" opacity=".85"/><rect x="-5" y="-54" width="10" height="12" fill="#5a3a22"/><rect x="-10" y="-30" width="20" height="14" fill="#f4ecd8"/>`,
 28:()=>`<path d="M-30 -4 l50 -20 M-30 -24 l50 20" stroke="#9aa0a8" stroke-width="5"/><circle cx="-36" cy="-4" r="7" fill="none" stroke="#c83a3a" stroke-width="4"/><circle cx="-36" cy="-24" r="7" fill="none" stroke="#c83a3a" stroke-width="4"/>`,
 35:()=>`<path d="M-40 0 l10 -50 l20 -6 l10 10 l10 -10 l20 6 l10 50Z" fill="#5a3a22"/><path d="M0 -46 V0" stroke="#3a2412" stroke-width="2"/>`,
 37:()=>`<path d="M-30 -6 H20" stroke="#9aa0a8" stroke-width="6"/><path d="M20 -6 l12 -10 l4 6 l-10 10Z" fill="#9aa0a8"/><rect x="-36" y="-12" width="22" height="12" rx="3" fill="#5a3a22"/>`,
 40:()=>`<path d="M-40 -4 L10 -18 M-40 -24 L10 -10" stroke="#c83a3a" stroke-width="7" stroke-linecap="round"/><path d="M10 -18 l24 -6 M10 -10 l24 6" stroke="#6a6a72" stroke-width="6"/>`,
 43:()=>`<path d="M-30 -6 H10" stroke="#5a3a22" stroke-width="8" stroke-linecap="round"/><path d="M10 -10 H44 L36 -2 H10Z" fill="#a8aab0"/>`,
 44:()=>`<rect x="-30" y="-24" width="60" height="24" rx="10" fill="#b8b8c0"/><rect x="-30" y="-18" width="60" height="10" fill="#c83a3a"/><path d="M-18 -13 h36" stroke="#f4ecd8" stroke-width="2"/>`,
 46:()=>`<path d="M-50 -4 L50 -30" stroke="#7a5a32" stroke-width="6"/><path d="M50 -30 l10 -4 l-2 22 l-12 -4Z" fill="#6a6a72"/>`,
 47:()=>`<path d="M-40 -4 L40 -30" stroke="#7a5a32" stroke-width="7"/><path d="M20 -50 Q40 -30 60 -10 L44 -26Z" fill="#6a6a72"/>`,
 49:()=>`<ellipse cx="0" cy="-8" rx="30" ry="10" fill="#a84a2a"/>`,
 54:()=>`<ellipse cx="0" cy="-10" rx="28" ry="10" fill="none" stroke="#c8a868" stroke-width="5"/><ellipse cx="0" cy="-10" rx="18" ry="6" fill="none" stroke="#c8a868" stroke-width="5"/>`,
 56:()=>`<rect x="-34" y="-40" width="68" height="40" rx="6" fill="#4a3a2a"/><circle cx="-14" cy="-20" r="10" fill="#c8a868"/><path d="M8 -30 h20 M8 -20 h20 M8 -10 h20" stroke="#c8a868" stroke-width="3"/><path d="M20 -40 l14 -20" stroke="#2a2a2a" stroke-width="3"/>`,
 57:()=>`<ellipse cx="0" cy="-6" rx="12" ry="6" fill="#8a8a82"/><path d="M12 -6 q14 0 12 -8" stroke="#8a8a82" stroke-width="2" fill="none"/>`,
 59:()=>`<ellipse cx="0" cy="-16" rx="30" ry="16" fill="#8a4a22"/><path d="M-14 -22 H14" stroke="#f4ecd8" stroke-width="3"/>`+[-8,0,8].map(x=>`<path d="M${x} -26 v8" stroke="#f4ecd8" stroke-width="2"/>`).join(''),
 60:()=>`<circle cx="-16" cy="-8" r="8" fill="none" stroke="#c8a040" stroke-width="4"/><path d="M-8 -8 H24 M18 -8 v8 M24 -8 v6" stroke="#c8a040" stroke-width="4"/>`,
 61:()=>`<path d="M-30 -6 q10 -10 20 0 t20 0 t20 0" stroke="#5a3a22" stroke-width="3" fill="none"/>`,
 62:()=>`<path d="M-60 -6 L60 -18" stroke="#c89a5a" stroke-width="12" stroke-linecap="round"/>`,
 65:()=>`<path d="M-30 -6 H30" stroke="#c8c8d0" stroke-width="2"/><ellipse cx="26" cy="-6" rx="4" ry="2" fill="none" stroke="#c8c8d0" stroke-width="1.5"/>`,
 82:()=>`<path d="M-34 0 q-6 -30 26 -34 q30 -2 38 20 q4 14 -12 14Z" fill="#d87a6a"/><path d="M-20 -8 q10 -16 30 -14" stroke="#f4d0c0" stroke-width="4" fill="none"/>`,
 85:()=>`<ellipse cx="0" cy="-4" rx="34" ry="8" fill="#8a1a1a" opacity=".85"/>`
};
OBJ[1]=OBJ[17];
const DIM={10:[90,46],20:[140,70],28:[100,40],40:[100,40],46:[130,50],47:[120,60],62:[140,40],35:[100,60]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[90,50]; return `<svg class="oi" width="${size}" height="${size}" viewBox="${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES:{},OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
