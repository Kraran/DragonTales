// Madness and the Minotaur — illustrations vectorielles, d'après la boîte : voûtes de pierre dans l'ombre violette et
// bleue, arches, escaliers, et au loin une lumière dorée. Chaque étage a sa teinte (sable, violet, vert d'eau, bleu
// nuit) pour se repérer ; les sorties du lieu sont dessinées (arche au fond pour le nord, ouvertures sur les côtés pour
// l'ouest et l'est, escalier pour monter, trou pour descendre). Sans lumière, tout est noir : on devine à peine les murs.
// render(clé, lieu, numéros, options) : numéros = objets présents (1 à 62) et éléments de scène (101 et plus) :
//   101 noir (pas de lumière), 102 petit puits, 103 corniche, 104 hydre libre, 105 hydre attachée, 106 tas de rochers,
//   107 rochers dégagés, 108 brouillard, 109 aura, 110 flaque d'huile, 111 musique, 112 lampe allumée ici,
//   121 à 126 sorties (nord, sud, est, ouest, haut, bas).
const SCENES=(function(){
const W=1196, H=396, G=322;
let uid=0, X=new Set();
const has=n=>X.has(n);
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,dir){ const id='mgg'+(uid++); const [x2,y2]=dir==='h'?[1,0]:[0,1];
  return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function glow(cx,cy,rx,ry,c,o){ const id='mgl'+(uid++); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o||.55}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`; }
const dl=(d,x)=>` style="animation-delay:-${d.toFixed(1)}s${x?';'+x:''}"`;
const g=(x,k,s,y)=>`<g transform="translate(${x.toFixed(0)} ${(y===undefined?G:y).toFixed(0)}) scale(${k})">${s}</g>`;

// ---------- teintes des quatre étages : pierre, joints, ombre, lumière lointaine ----------
const FLOORS=[
 {stone:'#7a6248',joint:'#4a3a2a',shade:'#2a2030',far:'#f0c070',floor:'#5a4634'},     // 1 : grès chaud, près de l'entrée
 {stone:'#5e4c70',joint:'#3a2c4a',shade:'#1c1428',far:'#e8a860',floor:'#3e3048'},     // 2 : violet
 {stone:'#3e5a5a',joint:'#24383a',shade:'#101c22',far:'#c8d870',floor:'#2c3e3c'},     // 3 : vert d'eau
 {stone:'#34406a',joint:'#1e2644',shade:'#0c1022',far:'#a8c8f0',floor:'#262e4a'}];    // 4 : bleu nuit, le plus profond
// ---------- la salle : mur du fond, murs de côté, voûte, sol en perspective ----------
// Le mur du fond va de x=250 à 946 ; les murs de côté fuient vers les bords. Profondeur réglable (étroit = couloir).
function vault(r,o){
  const P=FLOORS[(r>>6)&3], rn=rng(r+11);
  const L=o.narrow?330:250, R=W-L, top=o.low?92:60, back=286;      // cadre du mur du fond
  let s=`<rect width="${W}" height="${H}" fill="${P.shade}"/>`;
  // murs de côté (trapèzes) et sol
  const [fu,fd]=grad([P.floor,P.shade]); s+=fd+`<path d="M${L} ${back} H${R} L${W} ${H} H0Z" fill="${fu}"/>`;
  for(let i=-6;i<=6;i++) s+=`<path d="M${598+i*(R-L)/12} ${back} L${598+i*120} ${H}" stroke="${P.joint}" stroke-width="2" opacity=".5"/>`;
  for(const y of [306,334,372]) s+=`<path d="M0 ${y} H${W}" stroke="${P.joint}" stroke-width="2" opacity=".35"/>`;
  const [lu,ld]=grad([P.shade,P.stone],'h'), [ru,rd]=grad([P.stone,P.shade],'h');
  s+=ld+rd+`<path d="M0 0 L${L} ${top} V${back} L0 ${H}Z" fill="${lu}"/><path d="M${W} 0 L${R} ${top} V${back} L${W} ${H}Z" fill="${ru}"/>`;
  // mur du fond en blocs
  s+=`<rect x="${L}" y="${top}" width="${R-L}" height="${back-top}" fill="${P.stone}"/>`;
  for(let y=top+26,k=0;y<back;y+=26,k++){ s+=`<path d="M${L} ${y} H${R}" stroke="${P.joint}" stroke-width="2"/>`;
    for(let x=L+(k%2?30:60);x<R;x+=60) s+=`<path d="M${x} ${y-26} v26" stroke="${P.joint}" stroke-width="2"/>`; }
  for(let i=0;i<10;i++){ const x=L+rn()*(R-L-40), y=top+rn()*(back-top-20); s+=`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(20+rn()*30).toFixed(0)}" height="10" fill="${P.joint}" opacity=".35"/>`; }
  // voûte : arc sombre au-dessus du mur du fond
  s+=`<path d="M0 0 H${W} L${R} ${top} Q598 ${top-70} ${L} ${top}Z" fill="${P.shade}"/><path d="M${L} ${top} Q598 ${top-70} ${R} ${top}" stroke="${P.joint}" stroke-width="10" fill="none"/>`;
  return {s,P,L,R,top,back};
}
// une ouverture en arche (vers une autre salle), avec la lueur lointaine
function arch(cx,base,w,h,P,deep){ const id='mga'+(uid++);
  return `<defs><radialGradient id="${id}" cy=".85"><stop offset="0" stop-color="${P.far}" stop-opacity="${deep?.25:.55}"/><stop offset=".6" stop-color="${P.shade}" stop-opacity=".9"/><stop offset="1" stop-color="#05040a"/></radialGradient></defs>`+
   `<path d="M${cx-w/2} ${base} V${base-h+w/2} A${w/2} ${w/2} 0 0 1 ${cx+w/2} ${base-h+w/2} V${base}Z" fill="url(#${id})" stroke="${P.joint}" stroke-width="8"/>`; }
// ouverture dans un mur de côté (en perspective)
function sideDoor(left,v){ const P=v.P, x0=left?70:W-70, x1=left?170:W-170, t0=v.top*0.5, k=left?1:-1;
  const id='mgs'+(uid++);
  return `<defs><linearGradient id="${id}" x1="${left?1:0}" y1="0" x2="${left?0:1}" y2="0"><stop offset="0" stop-color="#05040a"/><stop offset="1" stop-color="${P.far}" stop-opacity=".25"/></linearGradient></defs>`+
   `<path d="M${x0} ${H-40} V${130+t0} Q${(x0+x1)/2} ${70+t0} ${x1} ${150+t0*.6} V${H-80-(left?0:0)}Z" fill="url(#${id})" stroke="${P.joint}" stroke-width="6"/>`; }
// escalier qui monte (au fond à droite) et trou qui descend (au sol)
function stairsUp(v){ const P=v.P; let s=''; for(let i=0;i<7;i++){ const y=v.back-i*24, x=820+i*14; s+=`<path d="M${x} ${y} h${120-i*6} v-24 h-${120-i*6}Z" fill="${i%2?P.stone:P.joint}" stroke="${P.shade}" stroke-width="2"/>`; }
  return s+arch(905,v.back-168,64,90,P,true); }
function holeDown(v){ const P=v.P; return `<ellipse cx="420" cy="350" rx="110" ry="26" fill="#05040a" stroke="${P.joint}" stroke-width="6"/>`+
  [0,1,2].map(i=>`<path d="M${350+i*20} ${344+i*4} h${120-i*30}" stroke="${P.stone}" stroke-width="5" opacity="${.6-i*.15}"/>`).join(''); }
function exits(v){ let s=''; const mid=598;
  if(has(121)) s+=arch(mid,v.back,v.R-v.L>500?150:120,v.back-v.top-30,v.P);
  if(has(124)) s+=sideDoor(true,v); if(has(123)) s+=sideDoor(false,v);
  if(has(125)) s+=stairsUp(v); if(has(126)) s+=holeDown(v);
  return s; }
// ---------- décors fixes ----------
const D={
 torch:(P)=>`<rect x="-6" y="-200" width="12" height="40" fill="#3a2a1e"/><path d="M-10 -200 h20 l-4 -10 h-12Z" fill="#5a4030"/><path class="an-flicker" d="M0 -236 q-12 14 -6 26 h12 q6 -12 -6 -26Z" fill="#f0a040"/><path class="an-flicker" style="animation-delay:-.4s" d="M0 -226 q-5 8 -2 14 h4 q3 -6 -2 -14Z" fill="#fff0b0"/><g class="an-pulse">${glow(0,-215,90,70,'#f0a040',.35)}</g>`,
 column:(P)=>`<rect x="-26" y="-250" width="52" height="250" fill="${P.stone}"/>`+[-14,0,14].map(x=>`<path d="M${x} -244 V-6" stroke="${P.joint}" stroke-width="3"/>`).join('')+
   `<rect x="-38" y="-262" width="76" height="16" fill="${P.joint}"/><rect x="-34" y="-12" width="68" height="12" fill="${P.joint}"/>`,
 minoan:(P)=>`<path d="M-22 -250 h44 l-8 240 h-28Z" fill="#8a2a22"/><ellipse cx="0" cy="-256" rx="34" ry="12" fill="#2a1a14"/><rect x="-30" y="-12" width="60" height="12" fill="#2a1a14"/>`,
 stalac:(x,l,P)=>`<path d="M${x-14} 0 L${x} ${l} L${x+14} 0Z" fill="${P.joint}"/>`,
 bones:()=>`<path d="M-40 -6 h50" stroke="#d8d0b8" stroke-width="6" stroke-linecap="round"/><circle cx="-44" cy="-8" r="5" fill="#d8d0b8"/><circle cx="14" cy="-8" r="5" fill="#d8d0b8"/>`+
   `<path d="M20 -4 l40 -12" stroke="#c8c0a8" stroke-width="5" stroke-linecap="round"/><ellipse cx="-70" cy="-12" rx="14" ry="12" fill="#e0d8c0"/><circle cx="-74" cy="-14" r="3" fill="#2a2020"/><circle cx="-66" cy="-14" r="3" fill="#2a2020"/>`,
 sarcophagus:(P)=>`<path d="M-140 0 V-70 H140 V0Z" fill="${P.joint}"/><path d="M-150 -70 L-130 -96 H130 L150 -70Z" fill="${P.stone}"/><path d="M-110 -50 H110 M-110 -30 H110" stroke="${P.shade}" stroke-width="3"/>`+
   `<path d="M-20 -96 l20 -14 l20 14" fill="none" stroke="#c8a040" stroke-width="4"/>`,
 amphora:(c)=>`<path d="M-14 -90 h28 l-4 10 q30 20 18 60 q-6 18 -24 20 h-8 q-18 -2 -24 -20 q-12 -40 18 -60Z" fill="${c}"/><path d="M-12 -80 q-16 4 -14 20 M12 -80 q16 4 14 20" stroke="${c}" stroke-width="4" fill="none"/><path d="M-20 -50 h40" stroke="#2a1a14" stroke-width="4"/>`,
 bed:(P)=>`<rect x="-150" y="-60" width="300" height="40" fill="#5a3a22"/><rect x="-150" y="-110" width="20" height="110" fill="#4a2e1a"/><rect x="130" y="-80" width="20" height="80" fill="#4a2e1a"/><rect x="-130" y="-74" width="270" height="18" fill="#8a3a3a"/><ellipse cx="-100" cy="-78" rx="26" ry="10" fill="#d8c8b0"/>`,
 shelves:(P)=>[-120,0,120].map(x=>`<rect x="${x-56}" y="-230" width="112" height="230" fill="#3a2618"/>`+[-196,-140,-84,-28].map(y=>`<rect x="${x-52}" y="${y}" width="104" height="6" fill="#5a3e28"/>`+
   [0,1,2,3,4].map(i=>`<rect x="${x-46+i*20}" y="${y-30}" width="14" height="30" rx="3" fill="${['#c8b890','#a89870','#d8c8a0','#8a6a48','#c8a878'][(i+x/120+y)&3&&i%5]}"/>`).join('')).join('')).join(''),
 well:(P)=>`<ellipse cx="0" cy="0" rx="150" ry="34" fill="#05040a" stroke="${P.joint}" stroke-width="10"/><ellipse cx="0" cy="4" rx="120" ry="22" fill="none" stroke="${P.stone}" stroke-width="3" opacity=".4"/>`,
 water:(P)=>{ const [u,d]=grad(['#3a6a8a','#12283a']); return d+`<ellipse cx="0" cy="0" rx="200" ry="40" fill="${u}" stroke="${P.joint}" stroke-width="8"/>`+
   [0,1,2].map(i=>`<path class="an-wave"${dl(i*2)} d="M${-120+i*70} ${-6+i*6} q20 -6 40 0" stroke="#a8d0e8" stroke-width="2" fill="none" opacity=".6"/>`).join(''); },
 oil:()=>`<ellipse cx="0" cy="0" rx="90" ry="16" fill="#1a1610"/><ellipse class="an-shimmer" cx="-20" cy="-4" rx="40" ry="5" fill="#6a5a3a" opacity=".5"/>`,
 ledge:(P)=>`<path d="M-160 -150 H160 L140 -126 H-140Z" fill="${P.stone}" stroke="${P.joint}" stroke-width="4"/><path d="M-160 -150 H160" stroke="${P.far}" stroke-width="2" opacity=".5"/>`,
 rocks:(lit)=>[[-60,0,40],[0,-10,52],[60,0,38],[-28,-40,30],[30,-44,28]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y-r/2}" rx="${r}" ry="${r*.7}" fill="${lit?'#6a8a5a':'#4a4a52'}" stroke="#2a2a30" stroke-width="3"/>`).join('')+(lit?`<g class="an-pulse">${glow(0,-30,140,80,'#a8f0a0',.45)}</g>`:''),
 fog:()=>{ let s=''; const r=rng(5); for(let i=0;i<9;i++){ const x=r()*W, y=200+r()*150; s+=`<ellipse class="an-drift"${dl(r()*40,'animation-duration:'+(20+r()*20).toFixed(0)+'s')} cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(160+r()*160).toFixed(0)}" ry="${(18+r()*20).toFixed(0)}" fill="#c8e8a8" opacity=".16"/>`; } return s; },
 aura:()=>`<g class="an-pulse">${glow(598,200,260,170,'#c8a8ff',.5)}</g>`+[0,1,2,3,4,5].map(i=>`<circle class="an-twinkle"${dl(i*.4)} cx="${480+i*46}" cy="${120+(i*37)%90}" r="3" fill="#f0e8ff" opacity=".8"/>`).join(''),
 notes:()=>[[300,120],[860,90],[640,70]].map(([x,y],i)=>`<g class="an-float"${dl(i*2)}><g transform="translate(${x} ${y})" fill="#e8d8a0" opacity=".7"><ellipse cx="0" cy="0" rx="8" ry="6"/><rect x="6" y="-30" width="3" height="30"/><path d="M9 -30 q12 6 10 16" stroke="#e8d8a0" stroke-width="3" fill="none"/></g></g>`).join('')
};
// ---------- créatures (debout sur le sol, origine aux pieds) ----------
const C={
 25:()=>`<g class="an-float" style="animation-duration:3s"><g opacity=".9">${glow(0,-150,60,60,'#a8f0ff',.6)}<path d="M0 -180 q-14 20 -10 40 q10 16 20 0 q4 -20 -10 -40Z" fill="#c8f0ff"/><path d="M-6 -150 q-30 -20 -40 -6 q20 6 40 14 M6 -150 q30 -20 40 -6 q-20 6 -40 14" fill="#a8e0f0" opacity=".6"/></g></g>`,
 26:()=>`<path d="M-40 0 l10 -80 q-20 -30 0 -70 q30 -24 60 0 q16 40 -4 70 l12 80 h-20 l-8 -60 h-24 l-8 60Z" fill="#5a6a3a"/><ellipse cx="10" cy="-170" rx="26" ry="22" fill="#6a7a44"/><circle cx="2" cy="-174" r="4" fill="#f0e040"/><circle cx="20" cy="-174" r="4" fill="#f0e040"/>`+
   `<path d="M-30 -120 l-40 40 M50 -120 l40 30" stroke="#5a6a3a" stroke-width="14" stroke-linecap="round"/><path d="M90 -90 l20 -60" stroke="#5a3a22" stroke-width="10" stroke-linecap="round"/>`,
 27:()=>`<ellipse cx="0" cy="-16" rx="60" ry="16" fill="#3a2418"/>`+[-40,-20,0,20,40].map(x=>`<path d="M${x} -10 l${x/3} 14 M${x} -20 l${x/3} -14" stroke="#3a2418" stroke-width="5"/>`).join('')+
   `<path d="M50 -20 q40 -10 30 -60 q-10 -30 -30 -10" stroke="#3a2418" stroke-width="12" fill="none"/><path d="M48 -82 l-6 -14 l12 4Z" fill="#c8a040"/><path d="M-60 -16 l-30 -14 l-6 8 M-60 -16 l-30 10 l-6 -6" stroke="#3a2418" stroke-width="6" fill="none"/>`,
 28:()=>`<path d="M-30 0 Q-40 -80 -20 -140 h40 Q40 -80 30 0Z" fill="#5a9a7a" opacity=".85"/><circle cx="0" cy="-160" r="20" fill="#e8c8a8"/><path d="M-22 -170 q-10 40 -4 90 M22 -170 q10 40 4 90" stroke="#3a6a3a" stroke-width="10" fill="none"/>`+
   [[-14,-110],[14,-80],[-8,-40]].map(([x,y])=>`<path d="M${x} ${y} q-8 -10 0 -18 q8 8 0 18Z" fill="#8ad08a"/>`).join(''),
 29:()=>`<path d="M-26 0 l6 -60 q-10 -10 -6 -30 l-10 -50 h60 l-10 50 q4 20 -6 30 l6 60 h-14 l-6 -50 h-6 l-6 50Z" fill="#6a4a2a"/><path d="M-30 -140 h60 v40 h-60Z" fill="#c89a78"/><circle cx="0" cy="-160" r="18" fill="#c89a78"/>`+
   `<path d="M-16 -174 q-14 -20 -4 -30 M16 -174 q14 -20 4 -30" stroke="#d8c8a0" stroke-width="5" fill="none"/><path d="M-10 -142 q10 14 20 0" fill="#4a2e1a"/><path d="M30 -130 l40 -10 l4 -14" stroke="#c89a78" stroke-width="10" fill="none" stroke-linecap="round"/>`,
 30:()=>`<path d="M-40 0 l10 -100 l-16 -60 h92 l-16 60 l10 100 h-24 l-10 -80 h-12 l-10 80Z" fill="#7a4a2e"/><rect x="-40" y="-120" width="80" height="28" fill="#2a1a12"/><circle cx="0" cy="-120" r="6" fill="#c8c8b8"/>`+
   `<path d="M-50 -160 l-40 50 l-10 40 M50 -160 l40 40" stroke="#7a4a2e" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M-26 -230 q-4 -30 26 -34 q30 4 26 34 l-6 34 h-40Z" fill="#4a2e1e"/>`+
   `<path d="M-24 -246 q-40 -6 -46 -40 q24 18 46 20 M24 -246 q40 -6 46 -40 q-24 18 -46 20" fill="#e8d8b0"/><circle cx="-10" cy="-226" r="5" fill="#ff4020"/><circle cx="10" cy="-226" r="5" fill="#ff4020"/>`+
   `<path d="M90 -120 l20 -40" stroke="#5a5a62" stroke-width="6"/><circle cx="112" cy="-166" r="14" fill="#5a5a62"/>`+[0,60,120,180,240,300].map(a=>`<path d="M112 -166 l${(20*Math.cos(a*Math.PI/180)).toFixed(0)} ${(20*Math.sin(a*Math.PI/180)).toFixed(0)}" stroke="#5a5a62" stroke-width="4"/>`).join(''),
 31:()=>`<g class="an-pulse">${glow(0,-120,110,120,'#f0e0a0',.45)}</g>`+`<path d="M-50 0 Q-60 -100 -30 -180 h60 Q60 -100 50 0Z" fill="#e8e0d0" opacity=".85"/><path d="M-30 -180 q30 -50 60 0Z" fill="#d8d0c0"/><ellipse cx="0" cy="-150" rx="18" ry="8" fill="#2a2030"/>`,
};
// ---------- objets qu'on peut porter (posés au sol, et icônes) ----------
const gem=(c)=>`<path d="M-14 -16 l8 -10 h12 l8 10 l-14 16Z" fill="${c}" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/><path d="M-14 -16 h28 M-6 -26 l6 26 l6 -26" stroke="#fff" stroke-width="1" opacity=".5" fill="none"/>`;
const ring=(c,s)=>`<ellipse cx="0" cy="-10" rx="14" ry="9" fill="none" stroke="#d8b040" stroke-width="5"/><circle cx="0" cy="-20" r="6" fill="${c}" stroke="#fff" stroke-width="1"/>`+(s||'');
const OBJ={
 1:()=>`<ellipse cx="0" cy="-12" rx="24" ry="12" fill="#c89048"/><path d="M-14 -16 q14 -8 28 0" stroke="#8a5a28" stroke-width="3" fill="none"/>`,
 2:()=>`<path d="M-10 0 v-30 q0 -10 6 -14 v-12 h8 v12 q6 4 6 14 v30Z" fill="#6a9a8a" opacity=".85"/><rect x="-5" y="-60" width="10" height="6" fill="#5a3a22"/>`,
 3:()=>`<path d="M-30 -6 H14" stroke="#b8bcc8" stroke-width="5"/><path d="M14 -6 l20 0 l-20 -6Z" fill="#b8bcc8"/><rect x="-38" y="-12" width="10" height="12" fill="#5a3a22"/><path d="M-28 -14 v16" stroke="#c8a040" stroke-width="4"/>`,
 4:()=>`<path d="M-40 -4 L20 -18" stroke="#5a3a22" stroke-width="7"/><circle cx="26" cy="-20" r="12" fill="#6a6a72"/>`+[0,72,144,216,288].map(a=>`<path d="M26 -20 l${(16*Math.cos(a*Math.PI/180)).toFixed(0)} ${(16*Math.sin(a*Math.PI/180)).toFixed(0)}" stroke="#6a6a72" stroke-width="4"/>`).join(''),
 5:()=>`<path d="M-40 -4 L36 -28" stroke="#6a4a2a" stroke-width="7"/><path d="M20 -24 q20 -24 30 -10 q-4 20 -22 22Z" fill="#9aa0a8"/>`,
 6:()=>`<path d="M-44 -8 H30" stroke="#c8ccd8" stroke-width="7"/><path d="M30 -11 l18 3 l-18 3Z" fill="#c8ccd8"/><path d="M-44 -18 v20" stroke="#c8a040" stroke-width="6"/><rect x="-60" y="-12" width="16" height="8" fill="#5a3a22"/>`,
 7:()=>`<ellipse cx="0" cy="-30" rx="30" ry="30" fill="#8a5a2a" stroke="#c8a040" stroke-width="4"/><circle cx="0" cy="-30" r="8" fill="#c8a040"/>`,
 8:()=>`<path d="M-36 -8 L36 -20" stroke="#d8c088" stroke-width="7" stroke-linecap="round"/>`+[-20,-6,8,22].map(x=>`<circle cx="${x}" cy="${-11-(x+36)/6}" r="2" fill="#5a3a22"/>`).join(''),
 9:()=>`<path d="M-22 -16 q22 -30 44 0Z" fill="#c83a2a"/><circle cx="-8" cy="-22" r="3" fill="#fff"/><circle cx="8" cy="-24" r="3" fill="#fff"/><rect x="-6" y="-16" width="12" height="16" fill="#e8e0c8"/>`,
 10:()=>`<path d="M-20 -40 q20 30 40 0" stroke="#d8b040" stroke-width="2" fill="none"/><path d="M0 -14 l10 -10 l-10 -10 l-10 10Z" fill="#40a0c8" stroke="#d8b040" stroke-width="2"/>`,
 11:()=>`<path d="M-40 -4 L30 -24" stroke="#d8b040" stroke-width="5"/><circle cx="34" cy="-26" r="9" fill="#c83a5a" stroke="#d8b040" stroke-width="3"/>`,
 12:()=>`<path d="M-24 -10 q24 -16 40 -6 l12 -6 v6 l-12 6 q-16 10 -40 0Z" fill="#c8a040"/><path d="M-24 -10 q-10 0 -10 6" stroke="#c8a040" stroke-width="3" fill="none"/><path d="M28 -18 q4 -14 0 -20 q-6 10 0 20Z" fill="#f0a040"/>`,
 13:()=>`<path d="M-26 -34 h52 l-6 34 h-40Z" fill="#a8844a"/>`+[-14,0,14].map(x=>`<path d="M${x} -34 v34" stroke="#7a5a2a" stroke-width="2"/>`).join('')+`<path d="M-20 -34 q20 -24 40 0" stroke="#7a5a2a" stroke-width="3" fill="none"/>`,
 14:()=>`<rect x="-26" y="-18" width="52" height="14" fill="#e8dcb8"/><circle cx="-26" cy="-11" r="7" fill="#d8c8a0"/><circle cx="26" cy="-11" r="7" fill="#d8c8a0"/>`,
 15:()=>`<path d="M-6 0 v-20 l-4 -8 v-8 h20 v8 l-4 8 v20Z" fill="#a868c8" opacity=".85"/>`,
 16:()=>`<path d="M-24 0 q-10 -30 6 -44 h36 q16 14 6 44Z" fill="#9a5a3a"/><path d="M-20 -44 h40 v-6 h-40Z" fill="#7a4228"/><path d="M-18 -22 h36" stroke="#2a1a14" stroke-width="4"/>`,
 17:()=>`<circle cx="0" cy="-16" r="14" fill="none" stroke="#d8b040" stroke-width="4"/><path d="M0 -26 l4 8 h-8Z M0 -6 l4 -8 h-8Z" fill="#d8b040"/>`,
 18:()=>`<rect x="-22" y="-20" width="44" height="16" fill="#e8d8b0"/><rect x="-26" y="-22" width="6" height="20" rx="2" fill="#8a6a48"/><rect x="20" y="-22" width="6" height="20" rx="2" fill="#8a6a48"/>`,
 19:()=>`<path d="M-16 -36 h32 q0 22 -12 26 v6 h8 v4 h-24 v-4 h8 v-6 q-12 -4 -12 -26Z" fill="#d8b040"/>`,
 20:()=>`<ellipse cx="0" cy="-16" rx="18" ry="16" fill="#e0d8c0"/><circle cx="-6" cy="-18" r="4" fill="#2a2020"/><circle cx="6" cy="-18" r="4" fill="#2a2020"/><rect x="-8" y="-4" width="16" height="6" fill="#e0d8c0"/>`,
 21:()=>`<ellipse cx="0" cy="-12" rx="18" ry="12" fill="#2a6a5a"/><path d="M0 -24 v24 M-18 -12 l-8 -6 M18 -12 l8 -6 M-14 -4 l-8 6 M14 -4 l8 6" stroke="#1a3a32" stroke-width="3"/>`,
 22:()=>`<rect x="-22" y="-26" width="44" height="26" fill="#7a3a5a" stroke="#d8b040" stroke-width="3"/><path d="M-22 -18 h44" stroke="#d8b040" stroke-width="2"/><circle cx="0" cy="-14" r="3" fill="#d8b040"/>`,
 23:()=>`<rect x="-20" y="-40" width="40" height="40" rx="6" fill="#9a9488"/>`+[-28,-20,-12].map(y=>`<path d="M-12 ${y} h24" stroke="#5a564e" stroke-width="2"/>`).join(''),
 24:()=>`<ellipse cx="0" cy="-8" rx="26" ry="8" fill="none" stroke="#b8945a" stroke-width="5"/><ellipse cx="0" cy="-12" rx="18" ry="6" fill="none" stroke="#b8945a" stroke-width="5"/>`,
 32:()=>[[-16,0],[0,0],[16,0],[-8,-8],[8,-8],[0,-16]].map(([x,y])=>`<rect x="${x-8}" y="${y-8}" width="16" height="8" fill="#e8c040" stroke="#a87a10" stroke-width="1.5"/>`).join(''),
 33:()=>`<path d="M-20 0 q-6 -26 10 -32 l-4 -6 h28 l-4 6 q16 6 10 32Z" fill="#c8ccd8"/><path d="M-12 -38 h24" stroke="#8a8a92" stroke-width="3"/>`,
 34:()=>gem('#e8f4ff'),
 35:()=>`<rect x="-24" y="-20" width="48" height="16" fill="#5a2a3a"/><rect x="-22" y="-24" width="44" height="6" fill="#e8dcc0"/><path d="M-6 -16 l6 -4 l6 4" stroke="#d8b040" stroke-width="2" fill="none"/>`,
 36:()=>gem('#d8203a'),
 37:()=>`<path d="M-30 0 q-6 -20 10 -24 q4 -10 20 -6 q16 -6 22 6 q12 6 4 24Z" fill="#e8c040"/>`+[-16,-4,8,20].map(x=>`<circle cx="${x}" cy="-12" r="5" fill="#f0d870"/>`).join(''),
 38:()=>`<path d="M-24 -6 l6 -20 l8 12 l10 -18 l10 18 l8 -12 l6 20Z" fill="#d8b040"/>`+[-12,0,12].map(x=>`<circle cx="${x}" cy="-14" r="3" fill="#40a0e0"/>`).join(''),
 39:()=>`<path d="M-14 0 q-6 -20 8 -24 l-2 -6 h16 l-2 6 q14 4 8 24Z" fill="#d8c8f0"/><path d="M-8 -30 l16 0" stroke="#a87a10" stroke-width="3"/>`,
 40:()=>`<path d="M-18 -40 q18 30 36 0" stroke="#d8b040" stroke-width="2" fill="none"/><circle cx="0" cy="-12" r="10" fill="#40c890" stroke="#d8b040" stroke-width="3"/>`,
 41:()=>`<path d="M-8 0 v-18 q-8 -6 -8 -14 h32 q0 8 -8 14 v18Z" fill="#e04080" opacity=".85"/><rect x="-4" y="-40" width="8" height="8" fill="#5a3a22"/>`,
 42:()=>ring('#c83a2a'), 43:()=>ring('#f0f0a0',glow(0,-20,24,24,'#fff8c0',.7)), 44:()=>ring('#40a0e0'),
 45:()=>`<path d="M-24 0 v-20 l12 8 l12 -18 l12 18 l12 -8 v20Z" fill="#e8c040" stroke="#a87a10" stroke-width="2"/>`+[-12,0,12].map(x=>`<circle cx="${x}" cy="-6" r="3" fill="#c8203a"/>`).join(''),
 46:()=>`<ellipse cx="0" cy="-12" rx="16" ry="12" fill="#e8e0f0"/><ellipse cx="-4" cy="-14" rx="8" ry="5" fill="#a0f0d0" opacity=".7"/><ellipse cx="6" cy="-10" rx="5" ry="3" fill="#f0a0c0" opacity=".7"/>`,
 47:()=>gem('#2040c8'),
};
for(let n=55;n<=62;n++) OBJ[n]=()=>`<g class="an-pulse">${glow(0,-20,40,30,'#c8a8ff',.6)}</g>`+`<path class="an-twinkle" d="M-12 -8 l12 -24 l12 24 l-20 -14 h16Z" fill="none" stroke="#e8d8ff" stroke-width="3"/>`;
for(const n in C) OBJ[n]=C[n];
// ---------- les lieux, d'après leur sorte (data.js) ----------
function place(r,kind){
  let v, s='', own=[];
  const deco=(xs,f)=>xs.map(x=>g(x,1,f)).join('');
  switch(kind){
   case 'forest': {
     const [u,d]=grad(['#0a1030','#2a3060','#4a4a70']); s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
     const rn=rng(3); for(let i=0;i<40;i++) s+=`<circle${i%3?'':` class="an-twinkle"${dl(i*.3)}`} cx="${(rn()*W).toFixed(0)}" cy="${(rn()*140).toFixed(0)}" r="${(rn()*1.6+.4).toFixed(1)}" fill="#e8e8ff"/>`;
     s+=`<circle cx="980" cy="70" r="30" fill="#f0ecd0"/>`+glow(980,70,90,90,'#f0ecd0',.3);
     s+=`<path d="M0 300 Q300 270 600 290 T${W} 280 V${H} H0Z" fill="#1a2a1a"/>`;
     // l'entrée du labyrinthe, dans la colline
     s+=`<path d="M440 300 Q600 150 760 300Z" fill="#3a3a4a"/>`+arch(600,300,120,110,FLOORS[0]);
     for(const [x,k] of [[120,1.2],[260,.9],[900,1],[1080,1.3],[1180,.8],[20,.9]]) s+=g(x,k,`<rect x="-8" y="-60" width="16" height="60" fill="#2a1a12"/><path d="M-60 -50 L0 -230 L60 -50Z M-50 -110 L0 -260 L50 -110Z" fill="#14301a"/>`,310);
     return {s,own}; }
   case 'tower': v=vault(r,{}); s=v.s+`<path d="M${v.L} ${v.top} Q598 ${v.top+40} ${v.R} ${v.top}" stroke="${v.P.joint}" stroke-width="4" fill="none"/>`;
     { const [u,d]=grad(['#2a3060','#e8a060']); s+=d+`<path d="M560 200 V140 Q598 100 636 140 V200Z" fill="${u}" stroke="${v.P.joint}" stroke-width="8"/>`; }
     s+=exits(v)+g(598,1,D.water(v.P),340); break;
   case 'library': v=vault(r,{}); s=v.s+exits(v)+g(380,.9,D.shelves(v.P),v.back+4)+g(860,.8,D.shelves(v.P),v.back+4)+g(598,1,D.torch(v.P),v.back); break;
   case 'pool': v=vault(r,{}); s=v.s+exits(v)+g(598,1,D.water(v.P),350)+deco([330,866],D.torch(v.P)); break;
   case 'temple': v=vault(r,{}); s=v.s+exits(v);
     s+=`<path d="M${v.L+40} ${v.top+40} L598 ${v.top-10} L${v.R-40} ${v.top+40}Z" fill="${v.P.stone}" stroke="#c8a040" stroke-width="4"/>`+deco([330,450,746,866],D.minoan(v.P))+glow(598,200,200,120,'#f0c060',.3);
     s=s.replace(/<g transform="translate\((\d+) 322\)/g,(m,x)=>`<g transform="translate(${x} ${v.back+6})`); break;
   case 'hall': v=vault(r,{}); s=v.s+exits(v)+[300,440,756,896].map(x=>g(x,1,D.column(v.P),v.back+6)).join('')+g(598,1,D.torch(v.P),v.back-90); break;
   case 'crypt': v=vault(r,{low:true}); s=v.s+exits(v)+g(598,1.1,D.sarcophagus(v.P),335)+deco([340,856],D.torch(v.P)); break;
   case 'lair': v=vault(r,{low:true}); s=v.s+exits(v)+g(420,1,D.bones(),345)+g(800,1.2,D.bones(),360)+g(640,.8,D.bones(),330); break;
   case 'cellar': v=vault(r,{low:true}); s=v.s+exits(v)+[[330,'#8a4a2a'],[380,'#6a3a22'],[820,'#7a4428'],[870,'#8a4a2a']].map(([x,c])=>g(x,1,D.amphora(c),v.back+20)).join(''); break;
   case 'bedroom': v=vault(r,{}); s=v.s+exits(v)+g(598,1,D.bed(v.P),345)+g(330,1,D.torch(v.P),v.back); break;
   case 'stair': v=vault(r,{}); s=v.s+exits(v)+(has(125)?'':stairsUp(v)); break;
   case 'court': { v=vault(r,{}); const [u,d]=grad(['#0a1030','#3a3a6a']);
     s=v.s.replace(new RegExp(`<path d="M0 0 H${W} L${v.R}[^"]*"[^>]*>`),'')+d+`<path d="M0 0 H${W} L${v.R} ${v.top} H${v.L}Z" fill="${u}"/>`+exits(v);
     const rn=rng(r); for(let i=0;i<14;i++) s+=`<circle cx="${(300+rn()*600).toFixed(0)}" cy="${(rn()*50).toFixed(0)}" r="1.2" fill="#fff"/>`; break; }
   case 'cave': v=vault(r,{}); s=v.s+exits(v);
     { const rn=rng(r+5); for(let i=0;i<14;i++) s+=D.stalac(rn()*W,30+rn()*70,v.P);
       s+=`<path d="M0 ${H} Q120 300 250 330 T560 340 Q760 320 900 344 T${W} 330 V${H}Z" fill="${v.P.joint}" opacity=".6"/>`; } break;
   case 'pit': v=vault(r,{}); s=v.s+exits(v)+g(598,1.2,D.well(v.P),346); break;
   case 'shaft': v=vault(r,{narrow:true}); s=v.s+exits(v)+glow(598,60,90,200,v.P.far,.35)+[...Array(14).keys()].map(i=>`<circle class="an-float"${dl(i*.5)} cx="${540+(i*37)%120}" cy="${30+(i*53)%200}" r="1.5" fill="${v.P.far}" opacity=".6"/>`).join('')+`<path d="M560 0 H636 L680 ${v.top} H516Z" fill="${v.P.far}" opacity=".12"/>`; break;
   case 'tunnel': v=vault(r,{narrow:true,low:true}); s=v.s+exits(v); break;
   case 'passage': v=vault(r,{narrow:true}); s=v.s+exits(v)+g(v.L+40,1,D.torch(v.P),v.back-10); break;
   case 'maze': { v=vault(r,{narrow:true}); s=v.s;
     // cloisons qui se répètent : on ne sait plus où on est
     for(let i=0;i<3;i++){ const k=1-i*.22, x=598+(i%2?-1:1)*60*i; s+=`<path d="M${x-150*k} ${v.back} V${v.back-170*k} H${x+150*k} V${v.back}" fill="none" stroke="${v.P.joint}" stroke-width="${10*k}" opacity="${.8-i*.2}"/>`; }
     s+=exits(v); break; }
   default: v=vault(r,{}); s=v.s+exits(v)+deco([v.L+60,v.R-60],D.torch(v.P));
  }
  return {s,own,v};
}
function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const r=parseInt(key)||0;
  X=new Set(objs);
  const kind=(typeof ROOMS!=='undefined'&&ROOMS[r]?ROOMS[r][2]:'chamber');
  const p=place(r,kind); let s=p.s;
  // éléments de la partie
  if(has(102)) s+=g(820,.55,D.well(FLOORS[(r>>6)&3]),360);
  if(has(110)) s+=g(360,1,D.oil(),368);
  if(has(103)) s+=g(598,1,D.ledge(FLOORS[(r>>6)&3]),G-20);
  if(has(106)||has(107)) s+=g(870,1,D.rocks(has(107)),348);
  if(has(109)) s+=D.aura();
  if(has(111)) s+=D.notes();
  // l'hydre : sept têtes au bout de longs cous ; attachée, une corde l'enserre
  if(has(104)||has(105)){ let h=`<ellipse cx="0" cy="-40" rx="90" ry="44" fill="#2a5a3a"/>`;
    for(let i=0;i<7;i++){ const a=-150+i*20, x=Math.cos(a*Math.PI/180)*150, y=-60+Math.sin(a*Math.PI/180)*150;
      h+=`<g${has(104)?` class="an-sway"${dl(i*.7,'transform-origin:50% 100%;animation-duration:'+(2.5+i%3*.6).toFixed(1)+'s')}`:''}><path d="M0 -60 Q${(x*.5).toFixed(0)} ${(y+40).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}" stroke="#2a5a3a" stroke-width="16" fill="none"/><ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="20" ry="13" fill="#3a7a4a"/><circle cx="${(x+6).toFixed(0)}" cy="${(y-4).toFixed(0)}" r="3" fill="#ff4020"/></g>`; }
    if(has(105)) h+=`<path d="M-90 -50 Q0 -10 90 -50 M-80 -24 Q0 10 80 -24" stroke="#b8945a" stroke-width="7" fill="none"/>`;
    s+=g(598,1,h,358); }
  // créatures, puis objets au sol
  const cr=objs.filter(n=>n>=25&&n<=31);
  cr.forEach((n,j)=>{ s+=g([780,420,640,940,300,520,860][j%7],1,C[n](),G+30); });
  const items=objs.filter(n=>OBJ[n]&&!(n>=25&&n<=31)&&n<101).sort((a,b)=>a-b);
  const x0=300, x1=900, slots=Math.max(5,items.length);
  items.forEach((n,j)=>{ const xx=x0+(x1-x0)*((j*3+r)%slots+.5)/slots; s+=g(xx,1.8,OBJ[n](),G+30+((n*13)%3)*12); });
  if(has(108)) s+=D.fog();
  // la lumière : la lampe éclaire autour du joueur ; sans elle, on ne voit rien
  if(has(101)) s+=`<rect width="${W}" height="${H}" fill="#020106" opacity=".95"/>`;
  else if(has(112)) s+=`<g class="an-pulse" style="animation-duration:2.4s">${glow(598,300,520,260,'#ffd890',.18)}</g>`;
  const [vu,vd]=grad(['rgba(4,2,10,.55)','rgba(4,2,10,0)','rgba(4,2,10,0)','rgba(4,2,10,.75)']);
  s+=vd+`<rect width="${W}" height="${H}" fill="${vu}"/>`;
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}
const DIM={4:[90,50],5:[100,60],6:[120,40],7:[70,70],11:[90,50],12:[80,40],26:[260,260],27:[200,100],28:[120,200],29:[160,220],30:[260,300],31:[220,260],25:[120,200]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[80,50]; return `<svg class="oi" width="${size}" height="${size}" viewBox="${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES:{},OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
