// Dragon Mountain — illustrations vectorielles, dans le style d'El Diablero : un décor par lieu (35), d'après sa description,
// avec de petites variations ; un dessin par objet, posé au sol ou sur la table (le jeu dit « sur la table » dans les
// lieux 3, 5, 13, 15, 20, 21, 23 et 24) ; l'elfe, le démon et le dragon quand ils sont là ; les portes ouvertes.
// render(clé, lieu, numéros, options) : numéros = objets présents (7 à 25) et éléments de scène (101 et plus, voir aventure.js).
const SCENES=(function(){
const W=1196, H=396, G=326;            // G : ligne du sol où l'on pose les objets
let uid=0;
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,dir){ const id='dmg'+(uid++); const [x2,y2]=dir==='h'?[1,0]:[0,1];
  return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function glow(cx,cy,rx,ry,c,o){ const id='dml'+(uid++); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o||.55}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`; }
const veil=()=>{ const [u,d]=grad(['rgba(20,14,26,0)','rgba(20,14,26,0)','rgba(20,14,26,.85)']); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; };
const f0=n=>n.toFixed(0);
const dl=(d,x)=>` style="animation-delay:-${d.toFixed(1)}s${x?';'+x:''}"`;
// torche murale : support de fer, flamme qui vacille, halo qui respire
function torch(x,y){ return `<g class="an-pulse">${glow(x,y-14,150,120,'#ffb04a',.38)}</g><path d="M${x-12} ${y+30} h24 l-6 10 h-12Z" fill="#2a2228"/><path d="M${x} ${y+40} v18" stroke="#2a2228" stroke-width="6"/><path d="M${x-9} ${y+2} h18 l-4 28 h-10Z" fill="#5a3a22"/>`+
  `<path class="an-flicker"${dl((x%7)/7)} d="M${x} ${y+4} q-16 -14 -6 -34 q2 10 8 6 q-2 -14 6 -22 q12 18 6 38 q-4 12 -14 12Z" fill="#ff8a3a"/><path class="an-flicker"${dl((x%5)/5)} d="M${x} ${y+2} q-8 -10 -2 -22 q8 10 6 22Z" fill="#ffe08a"/>`; }
function cobweb(x,y,flip){ const k=flip?-1:1; let s=`<g transform="translate(${x} ${y}) scale(${k} 1)" stroke="#c8c0d8" stroke-width="1.2" fill="none" opacity=".35">`;
  for(const a of [0,22,45,68,90]) s+=`<path d="M0 0 L${f0(110*Math.cos(a*Math.PI/180))} ${f0(110*Math.sin(a*Math.PI/180))}"/>`;
  for(const rr of [26,50,76,100]) s+=`<path d="M${rr} 0 Q${f0(rr*.75)} ${f0(rr*.3)} ${f0(rr*.92)} ${f0(rr*.38)} Q${f0(rr*.5)} ${f0(rr*.5)} ${f0(rr*.7)} ${f0(rr*.7)} Q${f0(rr*.3)} ${f0(rr*.75)} ${f0(rr*.38)} ${f0(rr*.92)} Q${f0(rr*.2)} ${f0(rr*.85)} 0 ${rr}"/>`;
  return s+'</g>'; }
function motes(r,x0,x1,y0,y1,n,c){ let s=''; for(let i=0;i<n;i++) s+=`<circle class="an-float"${dl(r()*7)} cx="${f0(x0+r()*(x1-x0))}" cy="${f0(y0+r()*(y1-y0))}" r="${(1+r()*1.6).toFixed(1)}" fill="${c||'#fff4d8'}" opacity="${(.3+r()*.4).toFixed(2)}"/>`; return s; }

// ---------- murs et sols ----------
const PAL={ // mur haut, mur bas, joints, sol proche, sol loin, lumière
  castle:['#4a3a52','#2e2436','#231a2a','#2a1f2f','#3b2d40','#f0b765'],
  warm:['#5a3d3a','#352326','#28191c','#2d1d20','#46302f','#f4a35a'],
  dark:['#1d1822','#120e16','#0c090f','#0f0c12','#18131c','#5a5068'],
  cave:['#3a2c46','#211829','#17111d','#1c1422','#2c2134','#8a7aa8'],
  lair:['#4a1d22','#2a0f14','#1d0a0e','#220c10','#36151a','#ff6a3a'],
  magic:['#2c4466','#17263c','#101b2b','#14203a','#22385a','#b8e6ff'],
  gold:['#5a4214','#33240a','#241906','#2c1f08','#4a3510','#ffd25a']
};
function room(r,p,o){ // mur de pierres taillées et dallage en perspective
  o=o||{};
  const [u,d]=grad([p[0],p[1]]); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  const rowH=o.cave?0:34;
  if(rowH) for(let y=12,row=0;y<250;y+=rowH,row++){ s+=`<path d="M0 ${y} H${W}" stroke="${p[2]}" stroke-width="3" opacity=".7"/><path d="M0 ${y+3} H${W}" stroke="#fff" stroke-width="1" opacity=".05"/>`;
    let px=0; for(let x=(row%2)*55+(r()*20);x<W;x+=110+r()*30){ s+=`<path d="M${f0(x)} ${y} v${rowH}" stroke="${p[2]}" stroke-width="3" opacity=".6"/>`;
      const v=r(); if(v<.18) s+=`<rect x="${f0(px+2)}" y="${y+2}" width="${f0(x-px-4)}" height="${rowH-4}" fill="#000" opacity=".14"/>`; else if(v>.86) s+=`<rect x="${f0(px+2)}" y="${y+2}" width="${f0(x-px-4)}" height="${rowH-4}" fill="#fff" opacity=".05"/>`;
      if(v>.97) s+=`<path d="M${f0(px+10)} ${y+4} l12 10 l-4 8 l10 8" stroke="${p[2]}" stroke-width="2" fill="none"/>`; px=x; } }
  if(o.cave){ for(let i=0;i<9;i++){ const x=i*150-40+r()*60, y=20+r()*150; s+=`<path d="M${f0(x)} ${f0(y)} l${f0(60+r()*60)} ${f0(-20-r()*30)} l${f0(70+r()*60)} ${f0(30+r()*30)} l${f0(-30-r()*40)} ${f0(50+r()*40)} Z" fill="${p[2]}" opacity="${(.35+r()*.3).toFixed(2)}"/>`; }
    s+=`<path d="M0 0 H${W} V${f0(30+r()*20)} Q${f0(900+r()*100)} ${f0(70+r()*30)} 760 40 Q600 90 420 46 Q260 80 0 ${f0(40+r()*20)}Z" fill="${p[2]}"/>`; }
  const [fu,fd]=grad([p[4],p[3]]);
  s+=fd+`<path d="M0 250 H${W} V${H} H0Z" fill="${fu}"/><path d="M0 250 H${W}" stroke="${p[2]}" stroke-width="5"/>`;
  { const [su,sd]=grad(['rgba(0,0,0,.35)','rgba(0,0,0,0)']); s+=sd+`<rect x="0" y="252" width="${W}" height="26" fill="${su}"/>`; }
  if(!o.cave) for(let y=282;y<H;y+=(y-240)*.45) s+=`<path d="M0 ${f0(y)} H${W}" stroke="${p[2]}" stroke-width="2" opacity=".35"/>`;
  else { for(let i=0;i<10;i++){ const x=r()*W, h=4+r()*30, w=10+r()*10; s+=`<path d="M${f0(x-w)} 30 L${f0(x)} ${f0(56+h)} L${f0(x+w)} 30Z" fill="${p[2]}"/><path d="M${f0(x-w*.5)} 36 L${f0(x)} ${f0(52+h)}" stroke="${p[0]}" stroke-width="2" opacity=".5"/>`; }
    for(let i=0;i<14;i++) s+=`<ellipse cx="${f0(r()*W)}" cy="${f0(262+r()*130)}" rx="${f0(4+r()*10)}" ry="${f0(2+r()*4)}" fill="#000" opacity=".25"/>`; }
  if(!o.cave) for(let i=-6;i<=6;i++) s+=`<path d="M${600+i*70} 250 L${600+i*190} ${H}" stroke="${p[2]}" stroke-width="2" opacity=".5"/>`;
  return s;
}
function banner(x,c){ return `<path d="M${x-4} 26 H${x+84}" stroke="#2a2030" stroke-width="8" stroke-linecap="round"/><path d="M${x} 30 H${x+80} V170 L${x+40} 150 L${x} 170Z" fill="${c||'#7a2a3a'}"/><path d="M${x+8} 38 H${x+72} V158 L${x+40} 142 L${x+8} 158Z" fill="none" stroke="#d9a35b" stroke-width="3"/><path d="M${x+40} 70 l14 24 l-14 24 l-14 -24Z" fill="#d9a35b"/>`; }
function arch(x,y,w,h,fill,stroke){ return `<path d="M${x} ${y+h} V${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w} ${y+w/2} V${y+h}Z" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="8"`:''}/>`; }

// ---------- mobilier et détails ----------
function table(x,w,h,c){ c=c||['#7a4a32','#4e2c1f']; const y=G-h;
  return {s:`<rect x="${x}" y="${y}" width="${w}" height="14" rx="3" fill="${c[0]}"/><rect x="${x+10}" y="${y+14}" width="12" height="${h-14}" fill="${c[1]}"/><rect x="${x+w-22}" y="${y+14}" width="12" height="${h-14}" fill="${c[1]}"/><path d="M${x} ${y+3} H${x+w}" stroke="#a87050" stroke-width="3" opacity=".6"/>`, top:[x+20,x+w-20,y]}; }
function chair(x,flip,high){ const k=flip?-1:1, b=high?120:70; return `<g transform="translate(${x} ${G}) scale(${k} 1)"><rect x="0" y="-52" width="44" height="10" fill="#6a3f2a"/><rect x="2" y="-42" width="8" height="42" fill="#4e2c1f"/><rect x="34" y="-42" width="8" height="42" fill="#4e2c1f"/><rect x="0" y="${-52-b}" width="9" height="${b}" fill="#4e2c1f"/><rect x="0" y="${-52-b}" width="40" height="10" fill="#6a3f2a"/></g>`; }
function door(x,w,h,kind,open){ const y=G-h-20, black=kind==='black';
  const frame=black?'#0d0a10':'#3a2418', leaf=black?'#1b1620':'#6e4032';
  let s=arch(x-10,y-10,w+20,h+10,frame);
  if(open) s+=arch(x,y,w,h,black?'#ffb84a':'#120d14')+(black?glow(x+w/2,y+h*.6,w,h*.6,'#ffcf6a',.6):'')+`<path d="M${x} ${y+w/2} L${x-w*.35} ${y+w/2+18} V${y+h+14} L${x} ${y+h}Z" fill="${leaf}"/>`;
  else { s+=arch(x,y,w,h,leaf); for(let i=1;i<4;i++) s+=`<path d="M${x+i*w/4} ${y+(i===2?0:12)} V${y+h}" stroke="${black?'#0d0a10':'#4b2a26'}" stroke-width="3"/>`;
    s+=`<path d="M${x+6} ${y+h*.35} H${x+w-6} M${x+6} ${y+h*.75} H${x+w-6}" stroke="${black?'#2e2a36':'#2b1a14'}" stroke-width="7"/><circle cx="${x+w-16}" cy="${y+h*.58}" r="5" fill="${black?'#8a8296':'#d9b06a'}"/>`; }
  return s; }
function sign(x,y,w){ w=w||120; return `<rect x="${x}" y="${y}" width="${w}" height="50" rx="4" fill="#c79a5a" stroke="#5a3a20" stroke-width="5"/><path d="M${x+14} ${y+18} h${w-28} M${x+14} ${y+32} h${w-46}" stroke="#5a3a20" stroke-width="4" opacity=".7"/>`; }
function fire(x,y,k){ k=k||1; let sp=''; for(let i=0;i<6;i++) sp+=`<circle class="an-rise"${dl(i*1.3)} cx="${-20+i*8}" cy="-50" r="2" fill="#ffd27a"/>`;
  return `<g class="an-pulse">${glow(x,y-30*k,170*k,110*k,'#ffb04a',.5)}</g><g transform="translate(${x} ${y}) scale(${k})"><path d="M-46 0 H46" stroke="#4a2a1a" stroke-width="12" stroke-linecap="round"/><path d="M-40 -4 L36 4 M-36 4 L40 -4" stroke="#3a2016" stroke-width="9" stroke-linecap="round"/><path class="an-flicker" d="M-30 -4 Q-40 -50 -6 -86 Q-4 -54 12 -66 Q34 -40 30 -4Z" fill="#e8582a"/><path class="an-flicker"${dl(.4)} d="M-16 -4 Q-22 -36 0 -58 Q6 -34 16 -40 Q22 -22 16 -4Z" fill="#ffc24a"/><path d="M-30 0 H30" stroke="#ff6a2a" stroke-width="4" opacity=".7"/>${sp}</g>`; }
function stairs(x,dir,n,c){ n=n||6; c=c||['#5a4a62','#3a2f44']; let s=''; const sw=150, sh=30;
  for(let i=0;i<n;i++){ const w=sw-i*14, yy=dir==='up'?G-i*sh:G-(n-i)*8; s+=dir==='up'?`<rect x="${x+i*7}" y="${yy-sh}" width="${w}" height="${sh}" fill="${i%2?c[0]:c[1]}"/>`:`<path d="M${x-i*6} ${G-40+i*14} H${x+sw+i*6}" stroke="${i%2?c[0]:c[1]}" stroke-width="12"/>`; }
  if(dir==='down') s=`<path d="M${x-50} ${G-48} H${x+sw+50} L${x+sw+20} ${G+40} H${x-20}Z" fill="#0b0810"/>`+s;
  return s; }
function spiral(x,dir){ let s=`<rect x="${x+48}" y="${dir==='up'?40:150}" width="16" height="${dir==='up'?G-40:G-150}" fill="#2e2436"/>`;
  for(let i=0;i<7;i++){ const y=(dir==='up'?60:170)+i*(dir==='up'?36:22), l=i%2; s+=`<path d="M${x+56} ${y} L${x+(l?118:-6)} ${y+12} L${x+(l?110:2)} ${y+24} L${x+56} ${y+16}Z" fill="${i%2?'#6a5878':'#4e4058'}"/>`; }
  if(dir==='down') s=`<ellipse cx="${x+56}" cy="${G}" rx="90" ry="20" fill="#0b0810"/>`+s; return s; }
function bed(x,w,posts){ let s=`<rect x="${x}" y="${G-70}" width="${w}" height="46" rx="6" fill="#6e4032"/><rect x="${x+8}" y="${G-92}" width="${w-16}" height="30" rx="10" fill="#d9c2a8"/><rect x="${x+12}" y="${G-108}" width="70" height="26" rx="10" fill="#f1e2cc"/><rect x="${x+w*.35}" y="${G-96}" width="${w*.62}" height="36" rx="8" fill="#8c3a4a"/><rect x="${x}" y="${G-120}" width="16" height="120" fill="#4e2c1f"/><rect x="${x+w-14}" y="${G-80}" width="14" height="80" fill="#4e2c1f"/>`;
  if(posts) s+=`<rect x="${x}" y="${G-250}" width="12" height="250" fill="#4e2c1f"/><rect x="${x+w-12}" y="${G-250}" width="12" height="250" fill="#4e2c1f"/><path d="M${x-10} ${G-250} H${x+w+10}" stroke="#4e2c1f" stroke-width="16"/><path d="M${x+12} ${G-242} Q${x+40} ${G-150} ${x+20} ${G-110}" fill="#8c3a4a"/><path d="M${x+12} ${G-242} q30 70 6 120" stroke="#8c3a4a" stroke-width="22" fill="none"/>`;
  return s; }
function wardrobe(x,ajar){ return `<rect x="${x}" y="${G-230}" width="150" height="230" fill="#5a3326"/><rect x="${x+8}" y="${G-222}" width="134" height="210" fill="#6e4032"/>`+(ajar?`<rect x="${x+75}" y="${G-222}" width="67" height="210" fill="#120c10"/><path d="M${x+142} ${G-222} L${x+186} ${G-232} V${G-6} L${x+142} ${G-12}Z" fill="#7a4a3a"/>`:`<path d="M${x+75} ${G-222} V${G-12}" stroke="#4b2a26" stroke-width="4"/>`)+`<circle cx="${x+66}" cy="${G-110}" r="5" fill="#d9b06a"/>`; }
function shelves(x,w,n,items){ let s=`<rect x="${x}" y="${G-240}" width="${w}" height="240" fill="#4e2c1f"/>`; for(let i=0;i<n;i++){ const y=G-230+i*(220/n); s+=`<rect x="${x+8}" y="${y}" width="${w-16}" height="${220/n-12}" fill="#2a1712"/><path d="M${x} ${y+220/n-12} H${x+w}" stroke="#6e4032" stroke-width="8"/>`;
  if(items==='books') for(let b=x+12;b<x+w-20;b+=14+((b*7)%9)) s+=`<rect x="${b}" y="${y+10+((b*3)%12)}" width="12" height="${220/n-24-((b*3)%12)}" fill="${['#8c3a4a','#3a5a8c','#5a7a3a','#a87a3a','#6a3a7a'][b%5]}"/>`;
  if(items==='jars') for(let b=x+18;b<x+w-30;b+=46) s+=`<rect x="${b}" y="${y+18}" width="28" height="${220/n-32}" rx="8" fill="${['#a87a3a','#8c5a3a','#c9a46b'][b%3]}"/><rect x="${b+4}" y="${y+12}" width="20" height="8" fill="#5a3a20"/>`; }
  return s; }
function candles(r){ let s=''; for(let row=0;row<2;row++) for(let i=0;i<9;i++){ const x=120+i*120+row*60, y=70+row*70; s+=glow(x,y-10,40,40,'#ffd27a',.45)+`<rect x="${x-14}" y="${y+18}" width="28" height="6" fill="#3a2a20"/><rect x="${x-5}" y="${y-6}" width="10" height="24" fill="#f1e6c8"/><path class="an-flicker"${dl((i*.37+row*.2)%1)} d="M${x} ${y-8} q-6 -10 0 -20 q6 10 0 20" fill="#ffc24a"/>`; } return s; }
function window_(x){ const id='dmw'+(uid++); return glow(x+40,120,220,160,'#cfe6ff',.35)+`<defs><clipPath id="${id}"><path d="M${x} 210 V60 A40 40 0 0 1 ${x+80} 60 V210Z"/></clipPath></defs><path d="M${x} 210 V60 A40 40 0 0 1 ${x+80} 60 V210Z" fill="#a9c8e8"/><g clip-path="url(#${id})"><circle cx="${x+58}" cy="64" r="12" fill="#fffbe8"/><g class="an-drift"><path d="M${x-30} 110 q30 -10 60 0 q20 -8 40 2Z M${x+20} 160 q30 -8 60 2 q20 -6 34 4Z" fill="#fff" opacity=".6"/></g></g>`+motes(rng(x),x-60,x+200,210,G,14,'#e8f4ff')+`<path d="M${x+40} 22 V210 M${x} 120 H${x+80}" stroke="#2e2436" stroke-width="8"/><path d="M${x+40} 210 L${x-120} ${G} H${x+260}Z" fill="#cfe6ff" opacity=".08"/>`; }
function mirror(x){ return `<path d="M${x} 230 V80 A50 50 0 0 1 ${x+100} 80 V230Z" fill="#8fa8c0" stroke="#c9a24a" stroke-width="8"/><path class="an-shimmer"${dl(x/97)} d="M${x+20} 200 L${x+70} 70" stroke="#e6f0fa" stroke-width="6" opacity=".6"/><path d="M${x+45} 214 L${x+86} 120" stroke="#e6f0fa" stroke-width="3" opacity=".5"/>`; }
function fireplace(x){ return `<rect x="${x}" y="${G-200}" width="260" height="200" fill="#5a4a52"/><rect x="${x-20}" y="${G-214}" width="300" height="22" fill="#6a5a62"/><path d="M${x+40} ${G} V${G-120} Q${x+130} ${G-180} ${x+220} ${G-120} V${G}Z" fill="#140c10"/>`+fire(x+130,G-6,.9); }
function carpet(x,w,c){ return `<path d="M${x+40} ${G-26} H${x+w-40} L${x+w} ${G+40} H${x}Z" fill="${c||'#7a2a3a'}"/><path d="M${x+52} ${G-18} H${x+w-52} L${x+w-18} ${G+32} H${x+18}Z" fill="none" stroke="#d9a35b" stroke-width="4"/>`; }
function stove(x){ return `<rect x="${x}" y="${G-150}" width="200" height="150" fill="#2e2a30"/><rect x="${x-10}" y="${G-160}" width="220" height="14" fill="#47424a"/><rect x="${x+30}" y="${G-110}" width="60" height="60" fill="#140c10"/><g class="an-pulse">${glow(x+60,G-70,80,50,'#ff8a3a',.4)}</g><path class="an-flicker" d="M${x+40} ${G-56} q20 -30 40 0" fill="#ff8a3a"/><rect x="${x+120}" y="${G-110}" width="50" height="40" fill="#3a363c"/><path d="M${x+60} ${G-160} V${G-300}" stroke="#2e2a30" stroke-width="40"/><ellipse cx="${x+150}" cy="${G-168}" rx="34" ry="10" fill="#555"/><rect x="${x+120}" y="${G-196}" width="60" height="28" fill="#555"/>`+[0,1,2].map(i=>`<circle class="an-smoke"${dl(i*2.3)} cx="${x+150}" cy="${G-206}" r="10" fill="#e8e0d8" opacity=".4"/>`).join(''); }
function cot(x){ return `<rect x="${x}" y="${G-80}" width="170" height="60" rx="8" fill="#a87a5a"/>`+[0,1,2,3,4,5,6].map(i=>`<path d="M${x+14+i*24} ${G-80} V${G-28}" stroke="#7a4a32" stroke-width="5"/>`).join('')+`<rect x="${x+6}" y="${G-28}" width="10" height="28" fill="#7a4a32"/><rect x="${x+154}" y="${G-28}" width="10" height="28" fill="#7a4a32"/><path d="M${x} ${G-80} Q${x+85} ${G-120} ${x+170} ${G-80}" stroke="#a87a5a" stroke-width="6" fill="none"/>`; }
function crates(x){ return `<rect x="${x}" y="${G-80}" width="90" height="80" fill="#7a5a3a"/><path d="M${x} ${G-80} L${x+90} ${G} M${x+90} ${G-80} L${x} ${G}" stroke="#5a3a20" stroke-width="5"/><rect x="${x+96}" y="${G-60}" width="70" height="60" fill="#8c6a42"/><rect x="${x+20}" y="${G-140}" width="70" height="60" fill="#8c6a42"/><ellipse cx="${x+220}" cy="${G-30}" rx="40" ry="34" fill="#b0946a"/><path d="M${x+204} ${G-62} q16 -14 32 0" stroke="#7a5a3a" stroke-width="6" fill="none"/>`; }
function throne(x,gold){ const c=gold?['#e8b84a','#a8781a']:['#7a3a5a','#4a2238']; return `<rect x="${x}" y="${G-260}" width="140" height="200" rx="16" fill="${c[1]}"/><path d="M${x} ${G-260} l20 -30 l20 30 l30 -40 l30 40 l20 -30 l20 30" fill="${c[0]}"/><rect x="${x+16}" y="${G-240}" width="108" height="170" rx="10" fill="${gold?'#c9962a':'#8c3a5a'}"/><rect x="${x-20}" y="${G-80}" width="180" height="40" rx="8" fill="${c[0]}"/><rect x="${x-10}" y="${G-40}" width="20" height="40" fill="${c[1]}"/><rect x="${x+130}" y="${G-40}" width="20" height="40" fill="${c[1]}"/><circle cx="${x+70}" cy="${G-200}" r="12" fill="${gold?'#e05a8c':'#e8b84a'}"/>`; }
function bones(x,n,r){ let s=''; for(let i=0;i<n;i++){ const bx=x+r()*260, by=G-6+r()*40, a=r()*180; s+=`<g transform="translate(${f0(bx)} ${f0(by)}) rotate(${f0(a)})"><rect x="-22" y="-3" width="44" height="6" rx="3" fill="#e6dccb"/><circle cx="-22" cy="-4" r="5" fill="#e6dccb"/><circle cx="-22" cy="4" r="5" fill="#e6dccb"/><circle cx="22" cy="-4" r="5" fill="#e6dccb"/><circle cx="22" cy="4" r="5" fill="#e6dccb"/></g>`; } return s; }
function bonePile(x){ return `<path d="M${x} ${G} Q${x+40} ${G-110} ${x+130} ${G-120} Q${x+220} ${G-110} ${x+260} ${G}Z" fill="#cfc2ad"/><circle cx="${x+120}" cy="${G-80}" r="26" fill="#e6dccb"/><circle cx="${x+110}" cy="${G-84}" r="6" fill="#2a1a1a"/><circle cx="${x+132}" cy="${G-84}" r="6" fill="#2a1a1a"/><path d="M${x+40} ${G-40} l60 -20 M${x+150} ${G-50} l70 10 M${x+80} ${G-20} l90 -6" stroke="#f1e9dc" stroke-width="10" stroke-linecap="round"/>`; }
function straw(x){ let s=`<ellipse cx="${x+130}" cy="${G-14}" rx="150" ry="40" fill="#c9a24a"/>`; for(let i=0;i<22;i++) s+=`<path d="M${x+20+i*11} ${G-10} l${(i%3-1)*18} -40" stroke="#e8c86a" stroke-width="3"/>`; return s; }
function gate(x){ let sp=''; for(let i=0;i<10;i++) sp+=`<path class="an-twinkle"${dl(i*.55)} d="M${x-30+((i*53)%220)} ${40+((i*71)%240)} l3 -8 l3 8 l-3 8Z" fill="#fffbe0"/>`;
  return `<g class="an-pulse">${glow(x+80,150,260,200,'#fff0b0',.6)}</g>`+sp+`<path d="M${x} ${G} V60 A80 80 0 0 1 ${x+160} 60 V${G}Z" fill="#fff6d0" opacity=".85"/>`+[0,1,2,3,4,5,6].map(i=>`<path d="M${x+10+i*23} ${G} V${i===3?0:30}" stroke="#d9a62a" stroke-width="8"/>`).join('')+`<path d="M${x} 140 H${x+160} M${x} 240 H${x+160}" stroke="#d9a62a" stroke-width="8"/>`; }
function bigLamp(x){ return `<g class="an-pulse">${glow(x,170,340,220,'#ffe08a',.7)}</g>`+`<path d="M${x} ${G} V${G-80}" stroke="#a8781a" stroke-width="20"/><ellipse cx="${x}" cy="${G}" rx="70" ry="16" fill="#a8781a"/><path d="M${x-90} ${G-90} Q${x} ${G-30} ${x+90} ${G-90}Z" fill="#e8b84a"/><path class="an-flicker" d="M${x} ${G-96} q-40 -60 0 -130 q40 70 0 130" fill="#ffd25a"/><path class="an-flicker"${dl(.5)} d="M${x} ${G-104} q-18 -34 0 -70 q18 36 0 70" fill="#fff4c0"/>`; }
function heap(x,w,h,B){ B=B===undefined?G:B; let s=`<path d="M${x} ${B+20} Q${x+w*.2} ${B-h} ${x+w/2} ${B-h-10} Q${x+w*.8} ${B-h} ${x+w} ${B+20}Z" fill="#d9a62a"/>`; for(let i=0;i<40;i++){ const cx=x+w*.1+((i*137)%(w*.8)), cy=B-((i*53)%h)*.9+10; s+=`<ellipse cx="${f0(cx)}" cy="${f0(cy)}" rx="12" ry="5" fill="${i%3?'#ffd25a':'#f4c03a'}" stroke="#a8781a" stroke-width="2"/>`; }
  for(let i=0;i<7;i++) s+=`<path class="an-twinkle"${dl(i*.7)} d="M${f0(x+w*(.15+((i*37)%70)/100))} ${f0(B-h*(.2+((i*29)%60)/100))} l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3Z" fill="#fffbe0"/>`;
  return s+`<circle cx="${x+w*.3}" cy="${B-h*.5}" r="10" fill="#e05a8c"/><circle cx="${x+w*.62}" cy="${B-h*.62}" r="9" fill="#5ac0e0"/><circle cx="${x+w*.5}" cy="${B-h*.3}" r="8" fill="#6ae08c"/>`; }
function gap(x,y,c){ return `<g class="an-pulse">${glow(x,y,180,140,c||'#fff2c0',.6)}</g>`+`<path d="M${x-10} ${y-90} L${x+16} ${y-10} L${x-4} ${y+40} L${x+10} ${y+110} L${x-14} ${y+40} L${x+2} ${y-10}Z" fill="${c||'#fff6d8'}"/>`; }

// ---------- les 35 lieux ----------
const PLACES={
 1:(r,x)=>{ let s=room(r,PAL.cave,{cave:1})+door(880,120,170,'wood',x.open22?0:0)+sign(870,40,140); return {s,x0:160,x1:780}; },
 2:(r)=>{ let s=room(r,PAL.castle)+torch(180,110)+torch(1016,110); for(let i=0;i<4;i++){ const w=360-i*80, x=600-w/2; s+=arch(x,40+i*36,w,210-i*36,i%2?'#2e2436':'#251d2c'); } return {s:s+glow(600,200,200,120,'#f0b765',.25),x0:300,x1:900}; },
 3:(r)=>{ const t=table(860,220,90); return {s:room(r,PAL.warm)+fireplace(300)+t.s,x0:120,x1:700,top:t.top}; },
 4:(r)=>({s:room(r,PAL.castle)+window_(560+r()*200),x0:140,x1:1000}),
 5:(r)=>{ const t=table(460,280,96); return {s:room(r,PAL.warm)+candles(r)+t.s,x0:140,x1:1060,top:t.top}; },
 6:(r)=>({s:room(r,PAL.castle)+banner(560,'#3a5a7a')+torch(860,110)+bed(120,300),x0:520,x1:1060}),
 7:(r)=>({s:room(r,PAL.castle)+bed(420,300,1)+wardrobe(940,1),x0:120,x1:400}),
 8:(r)=>{ let s=`<rect width="${W}" height="${H}" fill="#3a2118"/>`; for(let x=0;x<W;x+=70) s+=`<path d="M${x} 0 V${H}" stroke="#2a1712" stroke-width="4"/>`;
   s+=`<path d="M0 60 H${W}" stroke="#7a5a3a" stroke-width="10"/>`; for(let i=0;i<6;i++){ const x=160+i*170+r()*40; s+=`<path d="M${x} 60 v14 M${x-30} 92 L${x} 74 L${x+30} 92" stroke="#bfb2a2" stroke-width="4" fill="none"/>`; }
   return {s:s+`<path d="M0 ${G-10} H${W} V${H} H0Z" fill="#24140f"/>`,x0:200,x1:1000}; },
 9:(r)=>({s:room(r,PAL.castle)+torch(700,110)+cot(120)+glow(600,180,300,160,'#e0a3a8',.15),x0:420,x1:1060}),
 10:(r)=>({s:room(r,PAL.dark)+cobweb(0,0)+cobweb(1196,0,1)+glow(600,300,260,90,'#5a5068',.25),x0:200,x1:1000}),
 11:(r)=>{ let s=room(r,PAL.castle)+`<path d="M200 0 Q600 -80 1000 0" stroke="#c9a24a" stroke-width="6" fill="none"/>`; for(let i=0;i<5;i++) s+=mirror(150+i*200); return {s,x0:160,x1:1040}; },
 12:(r)=>({s:room(r,PAL.dark)+cobweb(0,0)+stairs(800,'up',7,['#3a3044','#2a2232'])+glow(300,200,200,120,'#5a5068',.2),x0:140,x1:760}),
 13:(r)=>{ const t=table(380,440,100); return {s:room(r,PAL.warm)+banner(140,'#3a5a3a')+banner(976,'#3a5a3a')+torch(560,90)+carpet(260,680)+t.s,x0:140,x1:1060,top:t.top}; },
 14:(r)=>({s:room(r,PAL.warm)+shelves(80,330,4,'books')+shelves(786,330,4,'books'),x0:420,x1:780}),
 15:(r)=>{ const t=table(780,230,96); return {s:room(r,PAL.warm)+t.s+chair(740),x0:140,x1:680,top:t.top}; },
 16:(r)=>({s:room(r,PAL.dark)+cobweb(0,0)+cobweb(1196,0,1)+shelves(200,800,3,''),x0:220,x1:980}),
 17:(r)=>({s:room(r,PAL.castle)+cobweb(1196,0,1)+torch(400,110)+crates(780),x0:140,x1:740}),
 18:(r)=>({s:room(r,PAL.castle)+torch(420,110)+spiral(860,'up'),x0:160,x1:820}),
 19:(r)=>{ let s=room(r,PAL.castle); s+=glow(600,180,160,120,'#f0b765',.25)+`<path d="M0 0 H380 L470 ${H} H0Z" fill="#251d2c"/><path d="M${W} 0 H816 L726 ${H} H${W}Z" fill="#251d2c"/>`+torch(300,120)+torch(896,120); return {s,x0:480,x1:720}; },
 20:(r)=>{ const t=table(420,300,92); return {s:room(r,PAL.warm)+shelves(860,280,4,'jars')+t.s,x0:120,x1:400,top:t.top}; },
 21:(r)=>{ const t=table(120,170,84); return {s:room(r,PAL.castle)+sign(60,60,130)+t.s+spiral(900,'up'),x0:340,x1:860,top:t.top}; },
 22:(r,x)=>{ let s=room(r,PAL.castle)+torch(560,110)+`<path d="M1196 0 Q900 120 1000 ${H} H1196Z" fill="#251d2c"/>`+door(140,140,190,'wood',x.open22); return {s,x0:360,x1:900}; },
 23:(r)=>{ const t=table(480,240,70); return {s:room(r,PAL.warm)+carpet(300,600,'#3a5a7a')+t.s+chair(400)+chair(800,1)+chair(560)+`<g opacity=".8">${chair(700,1)}</g>`,x0:120,x1:1080,top:t.top}; },
 24:(r)=>{ const t=table(200,800,92); let s=room(r,PAL.warm)+banner(300)+banner(820)+torch(80,110)+torch(1116,110); for(let i=0;i<6;i++) s+=chair(210+i*140,i%2,1); return {s:s+t.s,x0:220,x1:980,top:t.top}; },
 25:(r)=>({s:room(r,PAL.warm)+stove(480),x0:120,x1:440}),
 26:(r)=>({s:room(r,PAL.cave,{cave:1})+fire(600,G+6,1.3),x0:140,x1:460}),
 27:(r,x)=>({s:room(r,PAL.cave,{cave:1})+torch(380,110)+torch(820,110)+door(530,140,200,'black',x.openBlack),x0:140,x1:480}),
 28:(r)=>({s:room(r,PAL.lair,{cave:1})+`<g class="an-pulse">${glow(600,200,500,200,'#ff4a2a',.25)}</g>`+motes(r,100,1100,150,330,16,'#ff9a4a')+bonePile(860)+bones(160,7,r),x0:140,x1:820}),
 29:(r,x)=>({s:room(r,PAL.cave,{cave:1})+gap(560,120)+stairs(160,'down')+door(940,130,190,'black',x.openBlack),x0:420,x1:900}),
 30:(r,x)=>({s:room(r,PAL.lair,{cave:1})+straw(80)+bones(420,6,r)+spiral(980,'up')+(x.force?`<g class="an-pulse">${glow(1036,150,140,200,'#b8e6ff',.5)}</g>`+motes(r,960,1110,40,300,10,'#e8f8ff'):''),x0:420,x1:920}),
 31:(r,x)=>({s:room(r,PAL.cave,{cave:1})+torch(700,110)+door(120,140,200,'black',x.openBlack)+throne(900),x0:360,x1:860}),
 32:(r)=>{ const t=table(460,260,90,['#7a5aa8','#4a3a78']); return {s:room(r,PAL.magic)+`<g class="an-pulse">${glow(600,140,560,260,'#ffffff',.35)}</g>`+motes(r,200,1000,60,300,16,'#e8f8ff')+t.s+stairs(880,'down',6,['#5a7aa8','#3a5a88']),x0:140,x1:420,top:t.top}; },
 33:(r)=>({s:room(r,PAL.magic,{cave:1})+gate(880)+spiral(160,'down'),x0:380,x1:840}),
 34:(r)=>({s:room(r,PAL.gold,{cave:1})+bigLamp(520)+throne(900,1),x0:140,x1:400}),
 35:(r)=>({s:room(r,PAL.gold,{cave:1})+door(80,130,190,'wood',0)+gap(146,170,'#fff6d8')+heap(420,520,130)+spiral(1020,'down'),x0:460,x1:920})
};

// ---------- objets ----------
// Chaque dessin a son origine au milieu de sa base.
function lg(c1,c2,vert){ const id='dmo'+(uid++); return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`]; }
const OBJ={
 7:()=>{ const [f,d]=lg('#f0c050','#a8781a',1); return d+`<ellipse cx="0" cy="-12" rx="30" ry="12" fill="${f}"/><path d="M-20 -18 q14 -6 30 -2" stroke="#fff3c0" stroke-width="2.5" fill="none"/><path d="M24 -14 q22 -4 26 -18" stroke="#a8781a" stroke-width="6" fill="none"/><path d="M-26 -14 h-18" stroke="#a8781a" stroke-width="6"/><path class="an-flicker" d="M-44 -16 q-6 -16 0 -28 q8 12 0 28" fill="#ffc24a"/><rect x="-10" y="0" width="20" height="4" fill="#7a5a1a"/>`; },
 8:()=>`<path d="M-8 -64 h16 v16 q20 10 20 30 v18 h-56 v-18 q0 -20 20 -30Z" fill="#9fd3e0" opacity=".85" stroke="#e6f6fa" stroke-width="3"/><path d="M-26 -14 q26 6 52 0 v14 h-52Z" fill="#5aa8c8" opacity=".55"/><path class="an-shimmer" d="M-24 -14 q24 -4 48 0" stroke="#e6f6fa" stroke-width="2" fill="none"/><rect x="-10" y="-74" width="20" height="10" fill="#7a5a3a"/><path d="M-14 -30 q-4 12 0 22" stroke="#fff" stroke-width="4" opacity=".7"/>`,
 9:()=>`<ellipse cx="0" cy="-14" rx="26" ry="14" fill="none" stroke="#ffd25a" stroke-width="9"/><ellipse cx="0" cy="-14" rx="26" ry="14" fill="none" stroke="#a8781a" stroke-width="2"/><path d="M-20 -22 a24 12 0 0 1 16 -6" stroke="#fff3c0" stroke-width="2.5" fill="none"/><circle cx="0" cy="-28" r="5" fill="#e05a8c"/><path class="an-twinkle" d="M4 -36 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2Z" fill="#fff"/>`,
 10:()=>{ const [f,d]=lg('#8c6bb0','#4a3270'); return d+`<path d="M-50 0 Q-46 -40 -20 -56 Q0 -66 20 -56 Q46 -40 50 0Z" fill="${f}"/><path d="M-20 -56 Q0 -40 20 -56" stroke="#a88bd0" stroke-width="6" fill="none"/><path d="M-30 -6 Q-24 -30 -10 -40 M24 -6 Q20 -28 8 -40 M0 -4 Q2 -24 -2 -40" stroke="#3a2260" stroke-width="4" fill="none"/><circle cx="0" cy="-54" r="4" fill="#d9a35b"/><path d="M-50 0 H50" stroke="#2a1a40" stroke-width="3"/>`; },
 11:()=>`<circle cx="-30" cy="-14" r="13" fill="none" stroke="#6a6a76" stroke-width="9"/><circle cx="-30" cy="-14" r="13" fill="none" stroke="#9a9aa6" stroke-width="5"/><path d="M-17 -14 H34 M24 -14 v12 M14 -14 v8" stroke="#8a8a96" stroke-width="8" stroke-linecap="round"/><path d="M-14 -17 H30 M-38 -22 a10 10 0 0 1 10 -4" stroke="#d8d8e0" stroke-width="2" fill="none"/>`,
 12:()=>{ const [f,d]=lg('#f4f8fc','#9aa6b4',1); return d+`<path d="M-80 -10 L60 -10 L74 -6 L60 -2 L-80 -2Z" fill="${f}" stroke="#9aa6b4" stroke-width="2"/><path d="M-76 -6 H60" stroke="#7a8696" stroke-width="1.5"/><rect x="-104" y="-18" width="8" height="24" rx="3" fill="#c9a24a"/><rect x="-118" y="-10" width="22" height="8" rx="3" fill="#5a3a20"/><circle cx="-122" cy="-6" r="4" fill="#c9a24a"/><path class="an-twinkle" d="M40 -12 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2Z" fill="#fff"/>`; },
 13:()=>{ const [f,d]=lg('#ffe07a','#c08a20'); return d+`<path d="M-24 -66 H24 Q22 -34 0 -30 Q-22 -34 -24 -66Z" fill="${f}" stroke="#a8781a" stroke-width="3"/><ellipse cx="0" cy="-66" rx="24" ry="5" fill="#a8781a"/><rect x="-4" y="-30" width="8" height="22" fill="#e8b84a"/><ellipse cx="0" cy="-6" rx="20" ry="6" fill="#e8b84a"/><path d="M-16 -60 q2 18 10 24" stroke="#fff3c0" stroke-width="3" fill="none"/><circle cx="0" cy="-52" r="5" fill="#5ac0e0"/><circle cx="-1.5" cy="-53.5" r="1.5" fill="#fff"/>`; },
 14:()=>`<g class="an-pulse">${glow(48,-50,60,50,'#ffb04a',.45)}</g><path d="M-50 -6 L40 -26" stroke="#6e4032" stroke-width="12" stroke-linecap="round"/><path d="M32 -24 l14 -4" stroke="#3a2a20" stroke-width="14"/><path class="an-flicker" d="M40 -26 q14 -30 4 -56 q24 20 20 52" fill="#ff8a3a"/><path class="an-flicker" style="animation-delay:-.4s" d="M44 -30 q6 -18 2 -32 q12 14 8 30" fill="#ffd25a"/>`,
 15:()=>`<ellipse cx="0" cy="-8" rx="44" ry="12" fill="#e8b84a" stroke="#a8781a" stroke-width="3"/><ellipse cx="0" cy="-10" rx="28" ry="7" fill="#ffd25a"/><ellipse class="an-shimmer" cx="-10" cy="-12" rx="14" ry="2.5" fill="#fff8d8"/><path d="M-44 -8 a44 12 0 0 0 88 0" stroke="#c08a20" stroke-width="2" fill="none"/>`,
 16:()=>{ const [f,d]=lg('#ffe07a','#c08a20',1); return d+`<path d="M-34 0 V-34 L-22 -18 L-10 -46 L0 -20 L10 -46 L22 -18 L34 -34 V0Z" fill="${f}" stroke="#a8781a" stroke-width="3"/><path d="M-34 -8 H34" stroke="#a8781a" stroke-width="3"/><circle cx="-10" cy="-10" r="5" fill="#e05a8c"/><circle cx="10" cy="-10" r="5" fill="#5ac0e0"/><circle cx="-22" cy="-20" r="3" fill="#fff8d8"/><circle cx="0" cy="-22" r="3" fill="#fff8d8"/><circle cx="22" cy="-20" r="3" fill="#fff8d8"/><path class="an-twinkle" d="M10 -52 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2Z" fill="#fff"/>`; },
 17:()=>{ const [f,d]=lg('#f4f8fc','#9aa6b4',1); return d+`<path d="M-30 -9 L44 -9 L56 -6 L44 -3 L-30 -3Z" fill="${f}" stroke="#9aa6b4" stroke-width="2"/><rect x="-40" y="-18" width="8" height="24" rx="3" fill="#ffd25a"/><rect x="-62" y="-10" width="24" height="8" rx="3" fill="#7a2a4a"/><circle cx="-36" cy="-6" r="5" fill="#e05a8c"/><path class="an-twinkle" d="M30 -10 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2Z" fill="#fff"/>`; },
 18:()=>`<rect x="-40" y="-26" width="80" height="26" rx="4" fill="#7a2a3a"/><rect x="-36" y="-24" width="72" height="8" fill="#f1e2cc"/><path d="M-34 -20 H34" stroke="#c8b8a0" stroke-width="1"/><path d="M-40 -14 H40" stroke="#5a1a2a" stroke-width="2"/><path d="M-12 -14 l12 -8 l12 8 l-12 8Z" fill="#ffd25a"/><path d="M-36 -26 v26 M36 -26 v26" stroke="#d9a35b" stroke-width="3"/>`,
 19:()=>{ const [f,d]=lg('#c8ccd4','#6a6a74'); return d+`<path d="M-60 -6 L50 -6" stroke="#6e4032" stroke-width="10" stroke-linecap="round"/><path d="M-40 -6 h4 M-20 -6 h4" stroke="#4a2a1a" stroke-width="10"/><path d="M30 -6 Q36 -46 64 -40 Q70 -10 56 6 Q44 -2 30 -6Z" fill="${f}" stroke="#5a5a64" stroke-width="3"/><path d="M62 -36 Q66 -12 56 2" stroke="#fff" stroke-width="2" opacity=".6" fill="none"/>`; },
 20:()=>`<path d="M-44 -40 H44 L36 0 H-36Z" fill="#b07a3a"/>`+[0,1,2,3].map(i=>`<path d="M-40 ${-32+i*9} H40" stroke="#7a4a1a" stroke-width="3"/>`).join('')+[-30,-15,0,15,30].map(x=>`<path d="M${x} -40 L${x*.85} 0" stroke="#7a4a1a" stroke-width="2"/>`).join('')+`<path d="M-40 -40 Q0 -86 40 -40" stroke="#7a4a1a" stroke-width="6" fill="none"/><ellipse cx="-12" cy="-44" rx="20" ry="10" fill="#e8b46a"/><circle cx="16" cy="-46" r="11" fill="#c0392b"/>`,
 23:()=>{ const [f,d]=lg('#a06a3e','#6a4022'); return d+`<path d="M-36 0 Q-46 -40 -36 -80 H36 Q46 -40 36 0Z" fill="${f}"/>`+[-24,-12,0,12,24].map(x=>`<path d="M${x} 0 Q${x*1.2} -40 ${x} -80" stroke="#5a3a20" stroke-width="2" fill="none"/>`).join('')+`<path d="M-41 -20 H41 M-41 -60 H41" stroke="#4a5a6c" stroke-width="8"/><path d="M-40 -23 H40 M-40 -63 H40" stroke="#8a9aac" stroke-width="2"/><ellipse cx="0" cy="-80" rx="36" ry="10" fill="#5a8cc0"/><ellipse class="an-shimmer" cx="-8" cy="-81" rx="14" ry="3" fill="#cfe6ff"/><path d="M-30 -70 q-6 30 0 60" stroke="#fff" stroke-width="3" opacity=".15" fill="none"/>`; },
 25:()=>heap(-110,220,60,-20)
};
OBJ[21]=OBJ[20]; OBJ[22]=OBJ[20]; OBJ[24]=OBJ[23];

// ---------- l'elfe, le démon, le dragon ----------
function elf(x){ return `<g transform="translate(${x} ${G})"><path d="M-36 0 L-20 -120 Q0 -136 20 -120 L36 0Z" fill="#3a7a4a"/><circle cx="0" cy="-146" r="24" fill="#e8c8a0"/><path d="M-22 -150 l-22 -16 l16 22 M22 -150 l22 -16 l-16 22" fill="#e8c8a0" stroke="#e8c8a0" stroke-width="6"/><path d="M-26 -156 Q0 -196 26 -156 Q14 -168 0 -170 Q-14 -168 -26 -156Z" fill="#2a5a3a"/><circle cx="-8" cy="-146" r="3" fill="#1a1a1a"/><circle cx="8" cy="-146" r="3" fill="#1a1a1a"/><path d="M-6 -134 q6 4 12 0" stroke="#7a3a2a" stroke-width="2" fill="none"/><path d="M30 -100 l40 -30" stroke="#c9a24a" stroke-width="5"/><path class="an-twinkle" d="M70 -138 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3Z" fill="#fffbe0"/></g>`; }
function demon(x){ return `<g class="an-pulse">${glow(x,G-120,200,160,'#ff3a1a',.35)}</g>`+`<g transform="translate(${x} ${G})"><path d="M-60 0 L-50 -140 Q0 -180 50 -140 L60 0 L30 0 L20 -60 L-20 -60 L-30 0Z" fill="#8c1a1a"/><path d="M-50 -130 L-120 -190 L-80 -110 M50 -130 L120 -190 L80 -110" fill="#5a0e12" stroke="#5a0e12" stroke-width="10"/><circle cx="0" cy="-180" r="34" fill="#a8241e"/><path d="M-24 -206 L-40 -250 L-12 -212 M24 -206 L40 -250 L12 -212" fill="#e6dccb" stroke="#e6dccb" stroke-width="6"/><g class="an-blink"><circle cx="-12" cy="-184" r="6" fill="#ffe04a"/><circle cx="12" cy="-184" r="6" fill="#ffe04a"/></g><path d="M-14 -164 l6 8 l8 -8 l8 8 l6 -8" stroke="#fff" stroke-width="3" fill="none"/></g>`; }
function dragon(x){ const g='#3f8a3f', d='#2a5e2e', b='#9ad06a';
  return `<g class="an-pulse">${glow(x-80,G-150,280,190,'#ff7a2a',.3)}</g><g transform="translate(${x} ${G})">`+
   `<path class="an-sway" style="transform-origin:0% 100%" d="M60 -60 Q170 -50 200 -110 Q215 -150 180 -160 Q200 -120 160 -96 Q120 -80 70 -86Z" fill="${g}"/>`+                       // queue
   `<path d="M-10 -120 L-40 -260 L10 -200 L40 -280 L70 -196 L120 -250 L110 -130Z" fill="${d}"/><path d="M-40 -260 L20 -140 M40 -280 L50 -140 M120 -250 L80 -140" stroke="${g}" stroke-width="5"/>`+   // aile
   `<ellipse cx="30" cy="-86" rx="110" ry="58" fill="${g}"/><path d="M-50 -60 Q30 -20 110 -60" stroke="${b}" stroke-width="10" fill="none" opacity=".7"/>`+          // corps et ventre
   `<path d="M-40 -50 L-50 0 H-14 L-10 -40 M70 -50 L80 0 H116 L106 -50" fill="${d}" stroke="${d}" stroke-width="22" stroke-linejoin="round"/>`+                  // pattes
   `<path d="M-50 -110 Q-90 -150 -110 -200" stroke="${g}" stroke-width="44" fill="none" stroke-linecap="round"/>`+                                                // cou
   `<path d="M-90 -232 Q-130 -244 -186 -218 L-190 -200 Q-150 -196 -120 -186 Q-96 -184 -90 -200Z" fill="${g}"/><path d="M-186 -210 L-150 -204" stroke="${d}" stroke-width="4"/>`+   // tête
   `<path d="M-104 -230 L-96 -262 L-114 -236 M-120 -234 L-128 -262 L-134 -232" stroke="#e6dccb" stroke-width="6" stroke-linecap="round"/><circle cx="-128" cy="-222" r="6" fill="#ffd25a"/><circle cx="-128" cy="-222" r="2.5" fill="#1a1a1a"/>`+
   `<path class="an-flicker" style="transform-origin:100% 50%" d="M-190 -208 Q-230 -214 -262 -196 Q-240 -204 -226 -190 Q-252 -186 -270 -172 Q-232 -178 -196 -196Z" fill="#ff8a3a"/><path class="an-flicker" style="transform-origin:100% 50%;animation-delay:-.4s" d="M-192 -206 Q-214 -206 -232 -198 Q-214 -198 -198 -198Z" fill="#ffd25a"/>`+[0,1,2].map(i=>`<circle class="an-smoke"${dl(i*2.2)} cx="-176" cy="-232" r="7" fill="#c8c0b8" opacity=".5"/>`).join('')+   // feu
   `<path d="M-80 -150 l10 -12 l10 12 l10 -12 l10 12" stroke="${b}" stroke-width="4" fill="none"/></g>`; }

function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const n=+key||1, r=rng((off+1)*7919+n*131);
  const x={open22:objs.includes(111), openBlack:objs.includes(112), force:objs.includes(113)};
  const p=(PLACES[n]||PLACES[1])(r,x);
  let s=p.s;
  const items=objs.filter(k=>OBJ[k]).sort((a,b)=>a-b);
  if(p.top&&items.length&&!(opt&&opt.crop)){ // sur la table
    const [a,b,y]=p.top, step=Math.min(110,(b-a)/items.length);
    items.forEach((k,i)=>{ s+=`<g transform="translate(${f0(a+step*(i+.5))} ${y}) scale(.85)">${OBJ[k]()}</g>`; });
  } else {
    const span=p.x1-p.x0, slots=Math.max(4,items.length);
    items.forEach((k,i)=>{ const xx=p.x0+span*((i*3+off)%slots+.5)/slots; s+=`<g transform="translate(${f0(xx)} ${G+((k*13)%3)*8})">${OBJ[k]()}</g>`; });
  }
  if(objs.includes(101)) s+=elf(p.x1>900?960:p.x1-60);
  if(objs.includes(102)) s+=demon(900);
  if(objs.includes(103)) s+=dragon(900);
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}${veil()}</svg>`;
}
const DIM={23:[100,98],24:[100,98],12:[200,40],17:[130,36],19:[140,60],25:[240,100],14:[160,110],7:[110,50],10:[110,70],20:[100,90],21:[100,90],22:[100,90]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[90,80]; return `<svg class="oi" width="${size}" height="${size}" viewBox="${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES,OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
