// The Final Countdown — illustrations vectorielles, dans le style des autres aventures : un décor par lieu, d'après sa
// description. Une base de missiles en plein désert, au début des années 80 : bureaux vert administration, néons,
// consoles à voyants, et sous terre le silo. Le compte à rebours s'affiche en chiffres rouges dans les salles de contrôle.
// render(clé, lieu, numéros, options) : numéros = objets présents (7 à 41) et éléments de scène (101 et plus, voir aventure.js ;
// 1000 + n : il reste n coups).
const SCENES=(function(){
const W=1196, H=396, G=330;            // G : ligne du sol où l'on pose les objets
let uid=0, X=new Set(), LEFT=null;
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,dir){ const id='fcg'+(uid++); const [x2,y2]=dir==='h'?[1,0]:[0,1];
  return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function glow(cx,cy,rx,ry,c,o){ const id='fcl'+(uid++); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o||.55}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`; }
const veil=()=>{ const [u,d]=grad(['rgba(6,8,10,0)','rgba(6,8,10,0)','rgba(6,8,10,.85)']); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; };
const f0=n=>n.toFixed(0);

// ---------- intérieurs de la base ----------
// mur haut, mur bas, plinthe, sol proche, sol loin, néon
const PAL={
 office:['#8a9a86','#6a7a68','#3a4438','#5a5a50','#7a7a6c','#f4fff0'],
 tech:['#3a4a52','#25323a','#141c22','#1e262c','#323e46','#c8f0ff'],
 store:['#5a5848','#3a3a2e','#22221a','#2a281e','#4a4636','#e8e0b0'],
 hall:['#a0a898','#7a8274','#3a4036','#6a685c','#8e8a7a','#ffffff'],
 lobby:['#7a6a5a','#5a4a3e','#2a1e18','#5a1e22','#7a2a2e','#fff0d0'],
 c2:['#2a2e36','#181c22','#0c0e12','#14171c','#262a32','#ff9a8a']
};
function room(r,p,o){
  o=o||{};
  const [u,d]=grad([p[0],p[1]]); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  // plafond à dalles et néons
  s+=`<rect width="${W}" height="40" fill="${p[2]}"/>`;
  if(!o.dark) for(let x=120;x<W;x+=320) s+=glow(x+60,44,200,70,p[5],.22)+`<rect x="${x}" y="30" width="120" height="12" fill="${p[5]}" opacity=".9"/>`;
  for(let x=0;x<W;x+=80) s+=`<path d="M${x} 0 V40" stroke="#000" stroke-width="2" opacity=".25"/>`;
  // plinthe
  s+=`<rect x="0" y="256" width="${W}" height="12" fill="${p[2]}"/>`;
  if(o.stripe) s+=`<rect x="0" y="150" width="${W}" height="10" fill="${o.stripe}" opacity=".8"/>`;
  // sol (dalles de linoléum en perspective)
  const [fu,fd]=grad([p[4],p[3]]);
  s+=fd+`<path d="M0 268 H${W} V${H} H0Z" fill="${fu}"/>`;
  for(let i=-7;i<=7;i++) s+=`<path d="M${600+i*86} 268 L${600+i*210} ${H}" stroke="#000" stroke-width="2" opacity=".18"/>`;
  for(const y of [290,318,352]) s+=`<path d="M0 ${y} H${W}" stroke="#000" stroke-width="2" opacity=".15"/>`;
  return s;
}
function door(x,w,o){ o=o||{}; const h=o.h||190, y=268-h; let s=`<rect x="${x-8}" y="${y-8}" width="${w+16}" height="${h+8}" fill="#4a4e50"/>`;
  s+=o.open?`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0a0c0e"/>`:`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.c||'#7a8288'}"/><rect x="${x+w*.2}" y="${y+20}" width="${w*.6}" height="${h*.25}" fill="#2a3a44" opacity=".6"/><rect x="${x+w-22}" y="${y+h/2}" width="12" height="6" fill="#d8d8d0"/>`;
  if(o.sign) s+=`<rect x="${x+w/2-50}" y="${y-36}" width="100" height="22" fill="#1e3a1e"/><text x="${x+w/2}" y="${y-20}" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e8f0e0">${o.sign}</text>`;
  return s; }
function elevator(x,on){ let s=`<rect x="${x-14}" y="60" width="208" height="208" fill="#8a8e92"/><rect x="${x}" y="78" width="180" height="190" fill="#b8bcc0"/><path d="M${x+90} 78 V268" stroke="#6a6e72" stroke-width="4"/>`;
  s+=`<rect x="${x+200}" y="150" width="22" height="50" rx="4" fill="#4a4e52"/><circle cx="${x+211}" cy="165" r="6" fill="${on?'#ffcc4a':'#2a2a2a'}"/><circle cx="${x+211}" cy="185" r="6" fill="#2a2a2a"/>`;
  if(on) s+=glow(x+211,165,30,30,'#ffcc4a',.5)+`<path d="M${x+80} 66 l10 -8 l10 8Z" fill="#ffcc4a"/>`;
  return s; }
function deskD(x,w,c){ c=c||'#6a5a48'; return `<rect x="${x}" y="${G-96}" width="${w}" height="14" fill="${c}"/><rect x="${x+8}" y="${G-82}" width="${w*.35}" height="82" fill="#5a5048"/><rect x="${x+w-w*.35-8}" y="${G-82}" width="${w*.35}" height="82" fill="#5a5048"/>`+[0,1,2].map(i=>`<path d="M${x+14} ${G-60+i*26} h${w*.35-12}" stroke="#3a3228" stroke-width="3"/>`).join(''); }
function chairD(x,c){ c=c||'#3a3a3e'; return `<rect x="${x}" y="${G-120}" width="54" height="56" rx="8" fill="${c}"/><rect x="${x-4}" y="${G-66}" width="62" height="14" rx="5" fill="${c}"/><path d="M${x+27} ${G-52} V${G-10} M${x} ${G} L${x+27} ${G-10} L${x+54} ${G}" stroke="#5a5a60" stroke-width="5"/>`; }
function filing(x,n){ let s=''; for(let i=0;i<(n||2);i++){ const fx=x+i*74; s+=`<rect x="${fx}" y="${G-150}" width="70" height="150" fill="#8a9098"/>`+[0,1,2,3].map(j=>`<rect x="${fx+6}" y="${G-144+j*36}" width="58" height="30" fill="#9aa0a8" stroke="#6a7078" stroke-width="2"/><rect x="${fx+28}" y="${G-132+j*36}" width="14" height="5" fill="#4a4e54"/>`).join(''); } return s; }
function flag(x){ return `<path d="M${x} ${G} V${G-230}" stroke="#c8a04a" stroke-width="5"/><rect x="${x+3}" y="${G-226}" width="90" height="56" fill="#b22234"/>`+[1,3,5].map(i=>`<rect x="${x+3}" y="${G-226+i*8}" width="90" height="8" fill="#f4f4f4"/>`).join('')+`<rect x="${x+3}" y="${G-226}" width="38" height="32" fill="#3c3b6e"/>`; }
function clock(x,y){ return `<circle cx="${x}" cy="${y}" r="26" fill="#f4f4ec" stroke="#2a2a2a" stroke-width="5"/><path d="M${x} ${y} V${y-16} M${x} ${y} L${x+11} ${y+6}" stroke="#2a2a2a" stroke-width="3"/>`; }
// compteur rouge du compte à rebours
function countdown(x,y,k){ k=k||1; const t=LEFT===null?'--':String(LEFT).padStart(3,'0');
  return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-90" y="-34" width="180" height="62" rx="6" fill="#0a0606" stroke="#3a3a3a" stroke-width="5"/>`+glow(0,-3,90,30,'#ff2a1a',.25)+
    `<text x="-70" y="12" font-family="monospace" font-size="15" fill="#ff5a4a">T-</text><text x="18" y="18" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="42" fill="#ff3a2a">${t}</text></g>`; }
function console_(x,w,r){ let s=`<path d="M${x} ${G} V${G-90} L${x+30} ${G-120} H${x+w-30} L${x+w} ${G-90} V${G}Z" fill="#4a545c"/><path d="M${x+30} ${G-120} H${x+w-30} L${x+w} ${G-90} H${x}Z" fill="#5a666e"/>`;
  for(let i=0;i<Math.floor(w/22)-2;i++) s+=`<circle cx="${x+30+i*22}" cy="${G-104}" r="4" fill="${['#ff4a3a','#4aff6a','#ffd84a','#4ac8ff'][Math.floor(r()*4)]}"/>`;
  for(let i=0;i<3;i++) s+=`<rect x="${x+20+i*(w-40)/3}" y="${G-80}" width="${(w-40)/3-14}" height="10" fill="#2a3036"/>`;
  return s; }
function crt(x,y,w,h,txt,c){ c=c||'#4aff7a'; return `<rect x="${x-10}" y="${y-10}" width="${w+20}" height="${h+20}" rx="8" fill="#3a3e42"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#071a0e"/>`+glow(x+w/2,y+h/2,w*.6,h*.6,c,.18)+
  (txt||[]).map((t,i)=>`<text x="${x+12}" y="${y+24+i*20}" font-family="monospace" font-size="15" fill="${c}">${t}</text>`).join(''); }
function mainframe(x,r){ let s=`<rect x="${x}" y="${G-200}" width="110" height="200" fill="#c8ccc4"/><rect x="${x}" y="${G-200}" width="110" height="14" fill="#2a4a6a"/>`;
  for(const cy of [G-150,G-150]) s+=`<circle cx="${x+30}" cy="${cy}" r="22" fill="#2a2e30"/><circle cx="${x+80}" cy="${cy}" r="22" fill="#2a2e30"/><circle cx="${x+30}" cy="${cy}" r="7" fill="#8a8e90"/><circle cx="${x+80}" cy="${cy}" r="7" fill="#8a8e90"/>`;
  for(let i=0;i<8;i++) s+=`<circle cx="${x+14+i*12}" cy="${G-96}" r="3.5" fill="${r()<.5?'#ff4a3a':'#ffd84a'}"/>`;
  return s+`<rect x="${x+10}" y="${G-80}" width="90" height="60" fill="#a8aca4"/>`; }
function shelves(x,w,r,boxes){ let s=`<rect x="${x}" y="${G-220}" width="${w}" height="220" fill="#3a3a32"/>`; for(let j=0;j<4;j++){ const y=G-210+j*54; s+=`<rect x="${x}" y="${y+44}" width="${w}" height="8" fill="#6a6a5a"/>`;
  for(let bx=x+8;bx<x+w-30;){ const bw=26+r()*40, bh=20+r()*20; s+=`<rect x="${f0(bx)}" y="${f0(y+44-bh)}" width="${f0(bw)}" height="${f0(bh)}" fill="${boxes[Math.floor(r()*boxes.length)]}" stroke="#2a2418" stroke-width="2"/>`; bx+=bw+6; } } return s; }
function buttons(x,y,k){ k=k||1; return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-90" y="-30" width="180" height="60" rx="6" fill="#2a2e32"/>`+
  [['UN','ONE','#e8e0c8',-55],['DEUX','TWO','#e8e0c8',0],['TROIS','THREE','#e8e0c8',55]].map(([f,e,c,dx])=>`<circle cx="${dx}" cy="-4" r="15" fill="${dx===55?'#d83a2a':dx===0?'#3a8ad8':'#3ac85a'}" stroke="#111" stroke-width="3"/><text x="${dx}" y="24" text-anchor="middle" font-family="sans-serif" font-size="10" fill="${c}">${LBL.fr()?f:e}</text>`).join('')+`</g>`; }
// la vitre de la salle d'observation : le silo et le missile en contrebas
function silo(x,y,w,h,broken){ const [u,d]=grad(['#1a2028','#0a0c10']); let s=d+`<rect x="${x-14}" y="${y-14}" width="${w+28}" height="${h+28}" fill="#4a4e52"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${u}"/>`;
  const mx=x+w/2; s+=glow(mx,y+h,w*.5,h*.8,'#ffe0a0',.18)+`<path d="M${mx-26} ${y+h} V${y+60} Q${mx} ${y+10} ${mx+26} ${y+60} V${y+h}Z" fill="#e8e8e0"/><rect x="${mx-26}" y="${y+100}" width="52" height="30" fill="#c83a2a"/><path d="M${mx-26} ${y+60} Q${mx} ${y+10} ${mx+26} ${y+60}Z" fill="#c83a2a"/>`;
  s+=`<path d="M${x} ${y+h*.35} H${mx-60} M${mx+60} ${y+h*.35} H${x+w} M${x} ${y+h*.7} H${mx-60} M${mx+60} ${y+h*.7} H${x+w}" stroke="#5a5e62" stroke-width="5"/>`;
  if(broken) s+=`<path d="M${x+w*.3} ${y} L${x+w*.45} ${y+h*.4} L${x+w*.2} ${y+h*.7} M${x+w*.45} ${y+h*.4} L${x+w*.8} ${y+h*.3} M${x+w*.45} ${y+h*.4} L${x+w*.6} ${y+h}" stroke="#e8f0ff" stroke-width="3" opacity=".8"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" opacity=".25"/>`;
  else s+=`<path d="M${x+30} ${y+20} l60 -10 M${x+30} ${y+40} l100 -20" stroke="#fff" stroke-width="4" opacity=".15"/>`;
  return s; }
function fire(x,y,k){ k=k||1; let s=glow(x,y-60*k,220*k,140*k,'#ff7a2a',.55); for(let i=0;i<5;i++){ const dx=(i-2)*34*k; s+=`<path d="M${x+dx-24*k} ${y} Q${x+dx-30*k} ${y-60*k} ${x+dx} ${y-(110+i%2*40)*k} Q${x+dx+30*k} ${y-60*k} ${x+dx+24*k} ${y}Z" fill="${i%2?'#ff9a2a':'#ff5a1a'}" opacity=".9"/><path d="M${x+dx-10*k} ${y} Q${x+dx} ${y-50*k} ${x+dx+10*k} ${y}Z" fill="#ffe08a"/>`; } return s; }
// le général : uniforme kaki, casquette, médailles, le regard fou
function general(x){ return `<g transform="translate(${x} ${G})"><path d="M-34 0 L-26 -120 Q0 -134 26 -120 L34 0 H10 L6 -60 H-6 L-10 0Z" fill="#5a6a3a"/><path d="M-26 -116 L-62 -60 L-50 -52 L-20 -92 M26 -116 L64 -62 L52 -54 L20 -92" fill="#5a6a3a" stroke="#5a6a3a" stroke-width="14" stroke-linejoin="round"/>`+
  `<rect x="-20" y="-104" width="16" height="10" fill="#c8a04a"/><rect x="4" y="-104" width="6" height="10" fill="#b22234"/><rect x="11" y="-104" width="6" height="10" fill="#3c3b6e"/><circle cx="0" cy="-146" r="18" fill="#e0b898"/>`+
  `<path d="M-24 -156 Q0 -178 24 -156 L30 -150 H-30Z" fill="#4a5a2e"/><rect x="-30" y="-156" width="60" height="6" fill="#1a1a14"/><path d="M-6 -168 l6 -6 l6 6 l-6 4Z" fill="#c8a04a"/>`+
  `<circle cx="-7" cy="-146" r="3.5" fill="#fff"/><circle cx="7" cy="-146" r="3.5" fill="#fff"/><circle cx="-7" cy="-146" r="1.6" fill="#a01010"/><circle cx="7" cy="-146" r="1.6" fill="#a01010"/><path d="M-12 -152 l8 3 M12 -152 l-8 3" stroke="#2a1a10" stroke-width="2.5"/><path d="M-8 -136 q8 -5 16 0" stroke="#5a2a1a" stroke-width="3" fill="none"/></g>`; }

// ---------- décors des lieux ----------
const PLACES={
 // le désert : dunes, montagnes, la base au loin derrière ses barbelés
 1:(r,x)=>{ const [u,d]=grad(['#f4c27a','#e8a85a','#f0d8a8']); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`+glow(950,70,160,120,'#fff8e0',.7)+`<circle cx="950" cy="70" r="34" fill="#fff8e0"/>`;
   s+=`<path d="M0 200 L120 150 L230 190 L360 130 L520 195 L700 160 L880 200 L1040 150 L${W} 190 V230 H0Z" fill="#b87a5a" opacity=".6"/>`;
   s+=`<path d="M0 230 Q300 200 600 230 T${W} 220 V${H} H0Z" fill="#e0b070"/><path d="M0 300 Q260 270 520 300 T${W} 290 V${H} H0Z" fill="#d8a060"/>`;
   s+=`<rect x="640" y="196" width="160" height="30" fill="#8a8a80"/><rect x="680" y="182" width="40" height="16" fill="#7a7a70"/>`+[0,1,2,3,4,5,6,7,8,9].map(i=>`<path d="M${560+i*30} 228 V206" stroke="#5a5a52" stroke-width="2"/>`).join('')+`<path d="M560 210 H830" stroke="#5a5a52" stroke-width="1.5"/>`;
   for(const [cx,k] of [[160,1],[1060,.8],[420,.55]]) s+=`<g transform="translate(${cx} ${G-10}) scale(${k})"><path d="M-10 0 V-130 Q-10 -142 0 -142 Q10 -142 10 -130 V0Z M-10 -70 H-34 V-100 Q-34 -110 -26 -110 Q-18 -110 -18 -100 V-80 H-10 M10 -60 H34 V-96 Q34 -106 26 -106 Q18 -106 18 -96 V-70 H10" fill="#4a7a3a"/></g>`;
   if(x.has(7)) s+=`<g transform="translate(700 ${G+20})"><path d="M-80 0 q20 -14 40 0 t40 0 t40 0" stroke="#8a6a3a" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-80 0 q20 -14 40 0 t40 0 t40 0" stroke="#5a3a1a" stroke-width="12" stroke-dasharray="6 10" fill="none"/><path d="M40 0 q20 -10 18 -40" stroke="#8a6a3a" stroke-width="12" fill="none"/><ellipse cx="60" cy="-46" rx="16" ry="10" fill="#8a6a3a"/><path d="M74 -44 l12 -2 M80 -46 l6 4" stroke="#c0392b" stroke-width="2"/><path d="M-84 -2 l-8 -4 l-4 6 l-8 -4" stroke="#c8b08a" stroke-width="5" fill="none"/></g>`;
   return {s,x0:300,x1:600}; },
 // la camionnette : l'intérieur, la portière ouverte sur l'entrée de la base
 2:(r,x)=>{ let s=`<rect width="${W}" height="${H}" fill="#3a3e42"/>`+[0,1,2,3,4,5,6].map(i=>`<path d="M${i*180} 0 V${H}" stroke="#2a2e32" stroke-width="10"/>`).join('');
   s+=`<path d="M0 0 H${W} V40 Q600 10 0 40Z" fill="#2a2e32"/>`;
   const [u,d]=grad(['#e8b070','#f0d8a8']); s+=d+`<rect x="760" y="70" width="330" height="200" rx="10" fill="${u}"/><rect x="900" y="150" width="120" height="70" fill="#8a8a80"/><path d="M760 230 H1090" stroke="#5a5a52" stroke-width="3"/><rect x="750" y="60" width="350" height="220" rx="12" fill="none" stroke="#1e2226" stroke-width="18"/>`;
   s+=`<rect x="80" y="${G-90}" width="560" height="40" fill="#5a3a2a"/><rect x="80" y="${G-170}" width="560" height="84" fill="#6a4a32" rx="8"/><rect x="80" y="${G-50}" width="560" height="50" fill="#2a2e32"/>`;
   s+=`<rect x="200" y="60" width="220" height="90" fill="#4a5056" rx="4"/>`+[0,1,2].map(i=>`<circle cx="${240+i*60}" cy="105" r="12" fill="#8a9098"/>`).join('');
   const [fu,fd]=grad(['#2a2e32','#1a1e22']); s+=fd+`<path d="M0 ${G+10} H${W} V${H} H0Z" fill="${fu}"/>`;
   return {s,x0:140,x1:600,y:G-90}; },
 // l'entrée principale : la grille, la caméra, le poste de garde
 3:(r,x)=>{ const [u,d]=grad(['#f0c07a','#f4dca8']); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
   s+=`<rect x="0" y="80" width="${W}" height="190" fill="#9a9a8e"/>`+[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect x="${40+i*120}" y="110" width="60" height="40" fill="#3a4a5a"/>`).join('');
   s+=`<path d="M0 270 H${W} V${H} H0Z" fill="#c89a62"/><path d="M420 ${H} L540 270 H660 L780 ${H}Z" fill="#5a5a56"/>`;
   for(let i=0;i<14;i++){ const fx=i*90-10; if(fx>380&&fx<820) continue; s+=`<path d="M${fx} ${G+10} V160" stroke="#6a6a62" stroke-width="5"/>`; }
   s+=`<path d="M0 170 H400 M800 170 H${W} M0 210 H400 M800 210 H${W}" stroke="#6a6a62" stroke-width="2"/>`+[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${i*44} 160 l10 -10 l10 10" stroke="#6a6a62" stroke-width="2" fill="none"/><path d="M${820+i*44} 160 l10 -10 l10 10" stroke="#6a6a62" stroke-width="2" fill="none"/>`).join('');
   const open=x.has(101); s+=`<rect x="400" y="150" width="20" height="${G+10-150}" fill="#4a4a46"/><rect x="780" y="150" width="20" height="${G+10-150}" fill="#4a4a46"/>`;
   if(open) s+=`<rect x="420" y="180" width="40" height="${G-180}" fill="none" stroke="#c8c8c0" stroke-width="5"/>`+[0,1].map(i=>`<path d="M${430+i*14} 180 V${G}" stroke="#c8c8c0" stroke-width="3"/>`).join('');
   else { s+=`<rect x="420" y="180" width="360" height="${G-180}" fill="none" stroke="#c8c8c0" stroke-width="6"/>`; for(let i=1;i<12;i++) s+=`<path d="M${420+i*30} 180 V${G}" stroke="#c8c8c0" stroke-width="3"/>`; s+=`<path d="M420 180 L780 ${G} M780 180 L420 ${G}" stroke="#c8c8c0" stroke-width="3"/>`; }
   s+=`<rect x="440" y="120" width="320" height="34" fill="#c83a2a"/><text x="600" y="143" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#fff">${LBL.fr()?'ZONE INTERDITE':'RESTRICTED AREA'}</text>`;
   s+=`<path d="M880 ${G} V60" stroke="#4a4a46" stroke-width="10"/><path d="M880 70 h-30" stroke="#4a4a46" stroke-width="6"/><rect x="800" y="56" width="58" height="30" rx="4" fill="#d8d8d0"/><rect x="786" y="62" width="16" height="18" fill="#2a2a2a"/><circle cx="854" cy="62" r="4" fill="#ff3a2a"/>`;
   s+=`<rect x="960" y="${G-130}" width="140" height="130" fill="#d8d0c0"/><rect x="980" y="${G-110}" width="100" height="50" fill="#4a5a6a"/><path d="M950 ${G-130} H1110 L1100 ${G-150} H960Z" fill="#8a3a2a"/>`;
   return {s,x0:120,x1:380}; },
 4:(r,x)=>({s:room(r,PAL.office,{stripe:'#4a6a4a'})+door(80,110,{sign:LBL.fr()?'PERSONNEL':'PERSONNEL'})+door(1000,110,{sign:LBL.fr()?'COMMANDANT':'C.O.'})+flag(300)+clock(600,90)+`<rect x="480" y="${G-110}" width="260" height="110" fill="#6a5a48"/><rect x="470" y="${G-120}" width="280" height="14" fill="#7a6a58"/>`+chairD(800)+chairD(880),x0:420,x1:780}),
 5:(r,x)=>{ let s=room(r,PAL.office,{stripe:'#3a5a7a'}); for(let i=0;i<4;i++) s+=mainframe(60+i*130,r); s+=mainframe(900,r);
   s+=crt(640,90,200,120,LBL.fr()?['> ETAT BASE','EVACUATION','TERMINEE_']:['> BASE STATUS','EVACUATION','COMPLETE_'])+`<rect x="620" y="${G-90}" width="240" height="90" fill="#8a9098"/>`;
   return {s,x0:640,x1:860,y:G-90}; },
 6:(r,x)=>({s:room(r,PAL.office,{stripe:'#6a5a3a'})+filing(60,3)+deskD(420,300)+chairD(540)+`<rect x="460" y="${G-130}" width="70" height="34" fill="#e8e4d8"/><rect x="600" y="${G-122}" width="60" height="26" fill="#3a3e42"/>`+frame(820,70,240,120,'#e8e0c8')+`<path d="M840 100 h200 M840 130 h160 M840 160 h180" stroke="#6a6a5a" stroke-width="4"/>`,x0:760,x1:1100}),
 // le centre de commandement : la grande carte du monde et les trajectoires
 7:(r,x)=>{ let s=room(r,PAL.c2,{dark:1}); s+=`<rect x="160" y="50" width="880" height="190" fill="#06141e" stroke="#3a4a5a" stroke-width="8"/>`;
   for(const [cx,cy,rx,ry] of [[330,130,90,50],[300,200,40,30],[560,120,60,50],[600,190,50,40],[820,120,140,60],[900,200,40,25]]) s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a5a3a" opacity=".8"/>`;
   for(let i=0;i<9;i++) s+=`<path d="M${160+i*110} 50 V240 M160 ${50+i*24} H1040" stroke="#2a6a8a" stroke-width="1" opacity=".5"/>`;
   s+=`<path d="M360 140 Q560 30 820 120" stroke="#ff3a2a" stroke-width="4" fill="none" stroke-dasharray="10 8"/><circle cx="360" cy="140" r="7" fill="#ff3a2a"/>`+glow(820,120,40,40,'#ff3a2a',.6);
   s+=countdown(1100,100,.8)+console_(120,420,r)+console_(660,420,r);
   return {s,x0:540,x1:660,y:G-100}; },
 // la réserve obscure : l'armoire métallique, puis l'escalier qu'elle cachait
 8:(r,x)=>{ let s=room(r,PAL.store,{dark:1})+shelves(60,330,r,['#8a7a5a','#6a5a3a','#5a6a4a'])+glow(600,30,300,90,'#e8e0b0',.12)+`<path d="M600 0 V40" stroke="#2a2a22" stroke-width="2"/><path d="M584 40 h32 l-6 12 h-20Z" fill="#6a6a5a"/>`;
   const moved=x.has(25); const cx=moved?880:640;
   if(moved) s+=`<path d="M560 268 L760 268 L800 ${H} L520 ${H}Z" fill="#050505"/>`+[0,1,2,3].map(i=>`<rect x="${560+i*6}" y="${280+i*28}" width="${200-i*10}" height="10" fill="#4a4a42"/>`).join('');
   s+=`<rect x="${cx}" y="${G-230}" width="180" height="230" fill="#7a8088"/><path d="M${cx+90} ${G-230} V${G}" stroke="#4a4e54" stroke-width="4"/><rect x="${cx+76}" y="${G-130}" width="8" height="30" fill="#c8ccd0"/><rect x="${cx+96}" y="${G-130}" width="8" height="30" fill="#c8ccd0"/>`+(x.has(106)?`<rect x="${cx+180}" y="${G-230}" width="40" height="230" fill="#5a6068" transform="skewY(8)"/>`:`<circle cx="${cx+150}" cy="${G-110}" r="7" fill="#c8a04a"/>`);
   return {s:s+`<rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`,x0:420,x1:600}; },
 9:(r,x)=>{ let s=room(r,PAL.office,{stripe:'#7a5a3a'}); s+=`<rect x="80" y="${G-90}" width="320" height="60" rx="14" fill="#a85a3a"/><rect x="80" y="${G-140}" width="320" height="60" rx="14" fill="#b86a4a"/><rect x="90" y="${G-30}" width="300" height="30" fill="#5a3a2a"/>`;
   s+=`<rect x="480" y="${G-90}" width="160" height="14" fill="#c8b89a"/><path d="M500 ${G-76} V${G} M620 ${G-76} V${G}" stroke="#6a6a60" stroke-width="6"/><rect x="530" y="${G-120}" width="24" height="30" fill="#f4f4ec"/><path d="M542 ${G-128} q6 -10 0 -18" stroke="#e8e8e8" stroke-width="2" fill="none" opacity=".7"/>`;
   s+=`<rect x="900" y="${G-230}" width="140" height="230" fill="#c83a2a"/><rect x="915" y="${G-215}" width="80" height="140" fill="#1a1a1a"/>`+[0,1,2,3].map(i=>`<rect x="922" y="${G-205+i*34}" width="66" height="26" fill="${['#e8c84a','#4a8ad8','#4ac86a','#e86a4a'][i]}" opacity=".85"/>`).join('')+`<rect x="1005" y="${G-200}" width="22" height="60" fill="#3a3a3a"/>`;
   if(x.has(27)) s+=`<rect x="420" y="70" width="260" height="150" fill="#b8865a" stroke="#6a4a2a" stroke-width="8"/>`+[[440,90,'#f4f0d8'],[540,84,'#f4e8a0'],[600,130,'#e8f4f8'],[460,150,'#f4f0d8']].map(([px,py,c])=>`<rect x="${px}" y="${py}" width="70" height="56" fill="${c}" transform="rotate(${(px%7)-3} ${px} ${py})"/><circle cx="${px+35}" cy="${py+4}" r="4" fill="#c83a2a"/>`).join('');
   return {s,x0:480,x1:860}; },
 // le bureau du commandant : le grand bureau, les écrans, la rangée de boutons ; le feu quand on a appuyé sur TROIS
 10:(r,x)=>{ let s=room(r,PAL.lobby,{stripe:'#c8a04a'})+flag(100)+frame(880,70,200,130,'#3a4a3a')+`<path d="M900 120 l40 -20 l40 30 l40 -30 l40 20" stroke="#c8a04a" stroke-width="3" fill="none"/>`;
   s+=`<rect x="380" y="${G-110}" width="440" height="20" fill="#5a3a22"/><rect x="390" y="${G-90}" width="420" height="90" fill="#4a2c18"/>`;
   for(let i=0;i<3;i++) s+=crt(400+i*140,90,110,80,[['C2','T-'+(LEFT===null?'':LEFT)],['TV','LUCY'],['SILO','OK']][i],['#4aff7a','#8ac8ff','#ffd84a'][i]);
   s+=buttons(600,G-130,.9)+chairD(240,'#5a2a1a')+countdown(1080,240,.6);
   if(x.has(102)) s+=fire(600,G+20,1.2)+fire(240,G+30,.8)+fire(980,G+30,.9)+`<rect width="${W}" height="${H}" fill="#3a1a0a" opacity=".2"/>`;
   return {s,x0:160,x1:340}; },
 // le hall moquetté : l'ascenseur, le bureau d'accueil et son tiroir
 11:(r,x)=>{ let s=room(r,PAL.lobby)+elevator(820,x.has(103)); s+=`<path d="M0 268 H${W} V${H} H0Z" fill="#6a1e24" opacity=".7"/>`+[0,1,2,3,4,5].map(i=>`<path d="M${i*240} 300 h120" stroke="#8a2a30" stroke-width="20" opacity=".4"/>`).join('');
   s+=deskD(200,360,'#7a5a3a')+`<rect x="230" y="${G-140}" width="70" height="44" fill="#3a3e42"/><path d="M420 ${G-110} l30 -20 l10 14" stroke="#2a2a2a" stroke-width="5" fill="none"/>`;
   if(x.has(23)) s+=`<rect x="236" y="${G-74}" width="140" height="28" fill="#6a4a2a" stroke="#3a2a1a" stroke-width="3"/>`;
   s+=`<rect x="620" y="${G-80}" width="70" height="80" fill="#3a5a3a"/><ellipse cx="655" cy="${G-110}" rx="50" ry="40" fill="#4a7a3a"/>`;
   return {s,x0:220,x1:560,y:G-96}; },
 // la salle de suivi radar
 12:(r,x)=>{ let s=room(r,PAL.tech,{dark:1}); s+=`<circle cx="600" cy="150" r="110" fill="#06180c" stroke="#5a6a6a" stroke-width="14"/>`+[30,60,90].map(rr=>`<circle cx="600" cy="150" r="${rr}" fill="none" stroke="#2a8a4a" stroke-width="2"/>`).join('');
   s+=`<path d="M490 150 H710 M600 40 V260" stroke="#2a8a4a" stroke-width="2"/>`+glow(600,150,110,110,'#4aff7a',.15)+`<path d="M600 150 L690 90 A110 110 0 0 0 640 48Z" fill="#4aff7a" opacity=".35"/><path d="M600 150 L690 90" stroke="#8aff9a" stroke-width="3"/>`+[[650,110],[540,190],[580,90]].map(([bx,by])=>`<circle cx="${bx}" cy="${by}" r="5" fill="#bfffbf"/>`).join('');
   s+=console_(60,360,r)+console_(780,360,r)+crt(120,80,180,100,['TRACK 07','ALT 82000','---'])+crt(890,80,180,100,['NORAD','LINK OK']);
   return {s,x0:460,x1:740}; },
 // le labyrinthe : des couloirs tous pareils, à perte de vue
 13:(r,x)=>{ let s=room(r,PAL.hall,{stripe:'#8a3a2a'}); s+=`<path d="M380 40 L520 120 H680 L820 40 M380 268 L520 210 H680 L820 268" stroke="#5a6056" stroke-width="4" fill="none"/><rect x="520" y="120" width="160" height="90" fill="#5a6056"/><rect x="560" y="140" width="80" height="70" fill="#1a1e1a"/>`;
   for(const [dx,w] of [[60,120],[1016,120],[250,90],[856,90]]) s+=door(dx,w,{h:dx<200||dx>1000?200:150,open:true});
   for(let i=0;i<4;i++) s+=`<path d="M${80+i*290} 200 l20 -10 v20Z" fill="#c83a2a" opacity=".7"/>`;
   if(x.has(32)) s+=`<path d="M40 268 V100 Q40 80 60 80 H160 Q180 80 180 100 V268Z" fill="#050505"/><path d="M40 268 V100 Q40 80 60 80 H160 Q180 80 180 100 V268" stroke="#ffd84a" stroke-width="4" fill="none" stroke-dasharray="8 6"/>`;
   return {s,x0:300,x1:900}; },
 // la salle d'observation : la grande vitre sur le silo
 14:(r,x)=>({s:room(r,PAL.tech,{dark:1})+silo(300,50,600,210,x.has(104))+console_(260,680,r)+countdown(150,90,.7),x0:320,x1:880,y:G-100}),
 15:(r,x)=>({s:room(r,PAL.store)+shelves(60,420,r,['#c8b88a','#8a7a5a','#e8e0c8','#5a6a8a'])+shelves(720,420,r,['#c8b88a','#8a7a5a','#3a8a3a']),x0:500,x1:700}),
 // le centre de transmissions : les radios, le téléphone rouge, l'ascenseur
 16:(r,x)=>{ let s=room(r,PAL.tech,{dark:1})+elevator(880,true); for(let i=0;i<3;i++){ const rx=80+i*190; s+=`<rect x="${rx}" y="70" width="170" height="${G-70}" fill="#5a6066"/>`+[0,1,2,3].map(j=>`<rect x="${rx+10}" y="${84+j*50}" width="150" height="40" fill="#2a3036"/>`+[0,1,2].map(k=>`<circle cx="${rx+30+k*30}" cy="${104+j*50}" r="8" fill="#c8ccd0"/>`).join('')+`<rect x="${rx+120}" y="${96+j*50}" width="30" height="14" fill="${r()<.5?'#4aff7a':'#ffd84a'}" opacity=".8"/>`).join(''); }
   s+=`<rect x="640" y="${G-90}" width="200" height="16" fill="#4a3a2a"/><path d="M660 ${G-74} V${G} M820 ${G-74} V${G}" stroke="#3a2a1a" stroke-width="8"/>`;
   if(x.has(37)) s+=`<g transform="translate(740 ${G-90})"><path d="M-40 0 L-34 -30 H34 L40 0Z" fill="#c8241a"/><path d="M-46 -34 Q-46 -50 -30 -50 H30 Q46 -50 46 -34 L40 -28 H-40Z" fill="#a81a12"/><circle cx="0" cy="-16" r="10" fill="#e8e0d8"/><text x="0" y="-36" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#fff">HOTLINE</text></g>`;
   return {s,x0:640,x1:840,y:G-90}; },
 17:(r,x)=>({s:room(r,PAL.hall,{stripe:'#3a5a7a'})+`<path d="M300 40 L480 140 H720 L900 40 M300 268 L480 200 H720 L900 268" stroke="#6a7066" stroke-width="4" fill="none"/><rect x="480" y="140" width="240" height="60" fill="#6a7066"/>`+door(80,120,{})+door(996,120,{})+clock(600,90),x0:320,x1:880}),
 18:(r,x)=>({s:room(r,PAL.hall,{stripe:'#3a5a7a'})+`<path d="M420 40 L540 130 H660 L780 40 M420 268 L540 210 H660 L780 268" stroke="#6a7066" stroke-width="4" fill="none"/><rect x="540" y="130" width="120" height="80" fill="#6a7066"/><rect x="570" y="150" width="60" height="60" fill="#2a2e2a"/>`+door(140,110,{})+door(946,110,{})+`<rect x="320" y="120" width="40" height="70" rx="6" fill="#c83a2a"/><text x="340" y="160" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#fff">EXIT</text>`,x0:300,x1:900}),
 // la salle de stratégie : la table aux cartes et aux épingles
 19:(r,x)=>{ let s=room(r,PAL.c2,{dark:1})+glow(600,230,500,120,'#c8e0ff',.12); s+=`<path d="M220 ${G-60} L320 ${G-130} H880 L980 ${G-60}Z" fill="#2a5a3a"/><path d="M220 ${G-60} H980 V${G-40} H220Z" fill="#3a2a1a"/>`;
   for(const [cx,cy,rx] of [[420,G-100,70],[620,G-90,50],[780,G-105,90]]) s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="16" fill="#6a8a4a"/>`;
   for(let i=0;i<10;i++) s+=`<circle cx="${f0(340+r()*520)}" cy="${f0(G-120+r()*50)}" r="5" fill="${r()<.5?'#ff3a2a':'#4a8aff'}"/>`;
   s+=`<path d="M420 ${G-100} Q600 ${G-160} 780 ${G-105}" stroke="#ff3a2a" stroke-width="3" fill="none" stroke-dasharray="8 6"/>`+[260,940].map(cx=>chairD(cx)).join('')+frame(120,60,220,110,'#e8e0c8')+frame(860,60,220,110,'#e8e0c8')+`<path d="M140 90 h180 M140 120 h140 M880 90 h180 M880 120 h120" stroke="#5a5a4a" stroke-width="4"/>`;
   return {s,x0:340,x1:860,y:G-80}; },
 // le poste de contrôle de tir : le compte à rebours, la rangée de boutons, le panneau du mécanisme d'annulation
 20:(r,x)=>{ let s=room(r,PAL.c2,{dark:1})+glow(600,120,600,140,'#ff2a1a',.12)+countdown(600,100,1.5);
   s+=console_(80,1040,r)+buttons(300,G-150,1.1);
   s+=`<rect x="760" y="140" width="220" height="120" fill="#4a4e54" stroke="#2a2e32" stroke-width="6"/>`;
   if(x.has(41)) s+=`<rect x="776" y="156" width="188" height="88" fill="#0a0c0e"/><path d="M800 170 Q860 230 840 248 M840 248 Q900 190 940 170" stroke="#d83a2a" stroke-width="5" fill="none"/><path d="M800 170 h20 M940 170 h-20" stroke="#c8a04a" stroke-width="8"/><text x="870" y="166" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#ffd84a">ABORT</text>`;
   else s+=[0,1,2,3].map(i=>`<circle cx="${780+(i%2)*180}" cy="${156+Math.floor(i/2)*88}" r="5" fill="#8a8e92"/>`).join('');
   for(let i=0;i<6;i++) s+=`<circle cx="${100+i*40}" cy="50" r="8" fill="#ff2a1a" opacity="${i%2?.9:.3}"/>`;
   return {s,x0:460,x1:720,y:G-120}; }
};
// textes peints dans les décors : dans la langue de la partie
const LBL={ fr:()=>!(typeof document!=='undefined'&&document.documentElement.lang==='en') };
function frame(x,y,w,h,inner){ return `<rect x="${x-8}" y="${y-8}" width="${w+16}" height="${h+16}" fill="#3a3a32"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${inner||'#2a2a3a'}"/>`; }
// objets dessinés par le décor (fixés ou trop grands)
const FIXED=new Set([7,15,16,17,19,21,23,24,25,27,28,29,30,32,34,37,40,41]);

// ---------- objets ----------
// Chaque dessin a son origine au milieu de sa base.
const OBJ={
 9:()=>`<rect x="-14" y="-62" width="28" height="62" rx="5" fill="#2a2e32"/><rect x="-8" y="-54" width="16" height="16" fill="#4a5a4a"/><path d="M8 -62 V-96" stroke="#2a2e32" stroke-width="4"/><circle cx="0" cy="-24" r="4" fill="#8a8e92"/><circle cx="0" cy="-12" r="4" fill="#8a8e92"/>`,
 10:()=>`<path d="M-40 0 L-34 -70 L-14 -80 L0 -64 L14 -80 L34 -70 L40 0Z" fill="#5a6a3a"/><path d="M-14 -80 L0 -40 L14 -80" fill="#e8e0c8"/><path d="M-3 -60 L0 -30 L3 -60" fill="#2a2a1a"/><rect x="-30" y="-58" width="14" height="8" fill="#c8a04a"/><rect x="16" y="-58" width="5" height="8" fill="#b22234"/><rect x="22" y="-58" width="5" height="8" fill="#3c3b6e"/><path d="M-36 -72 h14 M22 -72 h14" stroke="#c8a04a" stroke-width="4"/>`,
 11:()=>`<path d="M-34 -28 H24 V-14 H-20 L-26 0 H-40 L-34 -28Z" fill="#e8c84a"/><rect x="24" y="-26" width="14" height="8" fill="#2a2a2a"/><path d="M-20 -14 q4 10 12 6" stroke="#2a2a2a" stroke-width="4" fill="none"/><path d="M38 -22 l8 -6 M38 -22 l8 6" stroke="#4ac8ff" stroke-width="2"/>`,
 13:()=>`<rect x="-34" y="-46" width="58" height="44" fill="#f4f0e0" stroke="#8a8a7a" stroke-width="2" transform="rotate(-8)"/><rect x="-24" y="-40" width="58" height="44" fill="#fffaf0" stroke="#8a8a7a" stroke-width="2"/><rect x="-18" y="-32" width="16" height="20" fill="#8aa0b8"/><path d="M4 -30 h24 M4 -22 h20 M-18 -6 h46" stroke="#5a5a5a" stroke-width="2"/><circle cx="22" cy="-10" r="6" fill="none" stroke="#c83a2a" stroke-width="2"/>`,
 22:()=>`<circle cx="-16" cy="-10" r="10" fill="none" stroke="#c8ccd0" stroke-width="5"/><path d="M-6 -10 H26 M18 -10 v8 M24 -10 v6" stroke="#c8ccd0" stroke-width="5"/>`,
 26:()=>`<path d="M-30 0 V-34 Q-30 -40 -24 -40 V-58 Q-24 -62 -20 -62 Q-16 -62 -16 -58 V-44 V-62 Q-16 -66 -12 -66 Q-8 -66 -8 -62 V-44 V-60 Q-8 -64 -4 -64 Q0 -64 0 -60 V-40 Q4 -46 8 -42 L4 -24 Q0 0 -10 0Z" fill="#e8c83a"/><path d="M6 0 V-34 Q6 -40 12 -40 V-58 Q12 -62 16 -62 Q20 -62 20 -58 V-44 V-62 Q20 -66 24 -66 Q28 -66 28 -62 V-44 V-60 Q28 -64 32 -64 Q36 -64 36 -60 V-40 Q40 -46 44 -42 L40 -24 Q36 0 26 0Z" fill="#d8b82a"/>`,
 31:()=>`<path d="M-40 -8 L0 -20 M-40 -30 L0 -20" stroke="#c83a2a" stroke-width="10" stroke-linecap="round"/><path d="M0 -20 L30 -26 L38 -20 L30 -14Z" fill="#8a9098"/><circle cx="0" cy="-20" r="5" fill="#4a4e52"/>`,
 35:()=>`<rect x="-16" y="-90" width="32" height="90" rx="12" fill="#c8241a"/><rect x="-8" y="-104" width="16" height="16" fill="#2a2a2a"/><path d="M8 -100 q30 -4 34 20" stroke="#2a2a2a" stroke-width="5" fill="none"/><rect x="-12" y="-60" width="24" height="20" fill="#f4f0e0"/>`,
 36:()=>general(0).replace(`translate(0 ${G})`,'translate(0 0)')
};

function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const k=PLACES[key]?key:String(off+1), n=parseInt(k)||1, r=rng((off+1)*7919+n*131);
  X=new Set(objs); const cd=objs.find(i=>i>=1000); LEFT=cd===undefined?null:cd-1000;
  const p=(PLACES[k]||PLACES[2])(r,X);
  let s=p.s;
  const items=objs.filter(i=>OBJ[i]&&!FIXED.has(i)&&i!==36).sort((a,b)=>a-b);
  const span=p.x1-p.x0, slots=Math.max(4,items.length), base=p.y||G;
  items.forEach((i,j)=>{ const xx=p.x0+span*((j*3+off)%slots+.5)/slots; s+=`<g transform="translate(${f0(xx)} ${base+((i*13)%3)*8})">${OBJ[i]()}</g>`; });
  if(X.has(36)) s+=general(n===13?700:980);                      // le général, au premier plan
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}${veil()}</svg>`;
}
const DIM={9:[60,100],10:[90,90],11:[90,40],13:[80,56],22:[60,30],26:[90,70],31:[90,40],35:[80,110],36:[140,180]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[80,60]; return `<svg class="oi" width="${size}" height="${size}" viewBox="${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES,OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
