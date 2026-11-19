// Eno — illustrations vectorielles, dans le style des autres aventures. Tout se passe dans le salon de la tante, un salon
// américain du début des années 80 : papier peint à motifs, lambris, parquet, meubles qui jurent entre eux (le fauteuil
// avec les rideaux, le canapé avec le tapis). Chaque case du salon montre son meuble au centre et, sur les côtés, ceux des
// cases voisines (grille 5 × 3, data.js) ; aux bords de la grille, le mur du côté.
// render(clé, lieu, numéros, options) : numéros = objets présents (1 à 28) et éléments de scène (101 et plus) :
//   101 livre ouvert, 102 portes de la table d'appoint (11) ouvertes, 103 rideaux ouverts, 104 coffre-fort ouvert.
const SCENES=(function(){
const W=1196, H=396, G=330;            // G : ligne du sol où l'on pose les objets
let uid=0, X=new Set();
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,dir){ const id='eng'+(uid++); const [x2,y2]=dir==='h'?[1,0]:[0,1];
  return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function glow(cx,cy,rx,ry,c,o){ const id='enl'+(uid++); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o||.55}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`; }
const veil=()=>{ const [u,d]=grad(['rgba(12,8,6,0)','rgba(12,8,6,0)','rgba(12,8,6,.85)']); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; };
const g=(x,k,s,y)=>`<g transform="translate(${x.toFixed(0)} ${(y===undefined?G:y).toFixed(0)}) scale(${k})">${s}</g>`;

// ---------- le salon : papier peint, lambris, parquet ----------
function salon(r,o){
  o=o||{};
  const [u,d]=grad(['#d8b88a','#c49a6a']); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  // motif du papier peint : médaillons et fleurs de lys, en quinconce
  for(let y=34,j=0;y<200;y+=56,j++) for(let x=(j%2)*60;x<W+60;x+=120)
    s+=`<path d="M${x} ${y-14} q10 8 0 22 q-10 -14 0 -22Z M${x-12} ${y+4} q12 -4 24 0 q-12 8 -24 0Z" fill="#a8784a" opacity=".45"/><circle cx="${x}" cy="${y+18}" r="2.5" fill="#a8784a" opacity=".45"/>`;
  s+=`<rect width="${W}" height="16" fill="#e8d8b8"/><rect y="16" width="${W}" height="6" fill="#8a5a32"/>`;      // corniche
  // cimaise et lambris
  s+=`<rect y="196" width="${W}" height="8" fill="#6a4226"/><rect y="204" width="${W}" height="52" fill="#7a4e2c"/>`;
  for(let x=20;x<W;x+=150) s+=`<rect x="${x}" y="212" width="130" height="36" fill="none" stroke="#5a3418" stroke-width="3"/>`;
  s+=`<rect y="256" width="${W}" height="12" fill="#4a2a16"/>`;
  // parquet en perspective
  const [fu,fd]=grad(['#a8743e','#7a4e26']); s+=fd+`<path d="M0 268 H${W} V${H} H0Z" fill="${fu}"/>`;
  for(let i=-9;i<=9;i++) s+=`<path d="M${598+i*70} 268 L${598+i*190} ${H}" stroke="#5a3418" stroke-width="2" opacity=".35"/>`;
  for(const y of [284,304,330,362]) s+=`<path d="M0 ${y} H${W}" stroke="#5a3418" stroke-width="1.5" opacity=".2"/>`;
  // murs latéraux (bords de la grille)
  if(o.wallL) s+=`<path d="M0 0 H90 V268 L0 ${H}Z" fill="#a07a50"/><path d="M90 0 V268" stroke="#5a3418" stroke-width="4"/><path d="M0 196 L90 196 M0 256 L90 256" stroke="#5a3418" stroke-width="5" opacity=".7"/>`;
  if(o.wallR) s+=`<path d="M${W} 0 H${W-90} V268 L${W} ${H}Z" fill="#a07a50"/><path d="M${W-90} 0 V268" stroke="#5a3418" stroke-width="4"/><path d="M${W} 196 L${W-90} 196 M${W} 256 L${W-90} 256" stroke="#5a3418" stroke-width="5" opacity=".7"/>`;
  return s;
}
// ---------- les meubles (origine au milieu de leur base) ----------
const F={
 // la causeuse rose, et au-dessus le tableau, le coffre-fort, le million
 loveseat:()=>`<rect x="-150" y="-150" width="300" height="96" rx="34" fill="#d88aa0"/><rect x="-160" y="-72" width="320" height="44" rx="14" fill="#e8a0b4"/>`+
   `<rect x="-182" y="-118" width="46" height="96" rx="20" fill="#c87890"/><rect x="136" y="-118" width="46" height="96" rx="20" fill="#c87890"/>`+
   `<path d="M-150 -104 q75 -10 150 0 q75 -10 150 0" stroke="#b86a82" stroke-width="3" fill="none"/><path d="M0 -150 V-72" stroke="#b86a82" stroke-width="3"/>`+
   `<rect x="-150" y="-28" width="12" height="28" fill="#4a2a16"/><rect x="138" y="-28" width="12" height="28" fill="#4a2a16"/>`,
 // le grand aquarium sur son meuble
 tank:()=>{ let s=`<rect x="-140" y="-104" width="280" height="104" fill="#5a3418"/><rect x="-130" y="-94" width="125" height="84" fill="#6a4226"/><rect x="5" y="-94" width="125" height="84" fill="#6a4226"/>`;
   const [u,d]=grad(['#7ac8e8','#2a7aa8']); s+=d+`<rect x="-150" y="-252" width="300" height="148" fill="${u}" opacity=".9"/>`;
   s+=`<path d="M-150 -118 q40 -12 80 0 t80 0 t80 0 t60 -4 V-104 H-150Z" fill="#c8a868"/>`;
   for(const [x,h] of [[-120,70],[-100,50],[110,80],[126,56]]) s+=`<path d="M${x} -112 q-10 ${-h/2} 0 ${-h} q10 ${h/2} 0 ${h}" stroke="#3a8a3a" stroke-width="6" fill="none"/>`;
   for(const [x,y,k] of [[-60,-200,1],[10,-160,.8],[60,-215,.9],[-20,-226,.7],[90,-170,1],[-90,-150,.8],[30,-196,.75]])
     s+=`<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="0" rx="13" ry="8" fill="#ff8a2a"/><path d="M12 0 l12 -8 v16Z" fill="#ff6a1a"/><circle cx="-6" cy="-2" r="1.8" fill="#111"/></g>`;
   for(let i=0;i<6;i++) s+=`<circle cx="${-30+i%2*8}" cy="${-130-i*20}" r="${3+i%3}" fill="none" stroke="#e8f8ff" stroke-width="1.5" opacity=".7"/>`;
   return s+`<rect x="-156" y="-258" width="312" height="10" fill="#2a2a2a"/><rect x="-150" y="-252" width="300" height="148" fill="none" stroke="#1a1a1a" stroke-width="5"/><path d="M-130 -240 l60 0 M-130 -228 l30 0" stroke="#fff" stroke-width="4" opacity=".35"/>`; },
 // le téléviseur en meuble, allumé sur la chaîne 11
 tv:()=>{ let s=`<rect x="-170" y="-170" width="340" height="150" rx="6" fill="#6a4228"/><rect x="-170" y="-170" width="340" height="12" fill="#7a5032"/>`;
   s+=`<rect x="-150" y="-150" width="200" height="118" rx="16" fill="#0a1418"/>`+glow(-50,-91,110,70,'#6ad8a8',.35);
   s+=`<circle cx="-90" cy="-110" r="22" fill="#2a4a3a"/><circle cx="-84" cy="-114" r="22" fill="#0a1418"/>`+[[-30,-130],[0,-80],[20,-120],[-120,-60],[30,-60]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#e8fff0"/>`).join('');
   s+=`<path d="M-60 -50 q30 -40 60 0" stroke="#4ad88a" stroke-width="3" fill="none" opacity=".7"/><text x="34" y="-126" font-family="sans-serif" font-weight="bold" font-size="18" fill="#8affc8" opacity=".85">11</text>`;
   s+=`<rect x="70" y="-150" width="84" height="118" fill="#4a2a16"/>`+[0,1,2,3,4,5,6].map(i=>`<path d="M78 ${-142+i*16} H146" stroke="#2a180c" stroke-width="5"/>`).join('');
   s+=[0,1].map(i=>`<circle cx="${92+i*40}" cy="-44" r="8" fill="#c8a868"/>`).join('');
   return s+`<rect x="-160" y="-20" width="14" height="20" fill="#3a2010"/><rect x="146" y="-20" width="14" height="20" fill="#3a2010"/>`; },
 // le fauteuil rembourré, moutarde à carreaux
 chair:()=>{ let s=`<rect x="-96" y="-210" width="192" height="132" rx="36" fill="#c8922a"/><rect x="-110" y="-96" width="220" height="50" rx="14" fill="#d8a23a"/>`;
   s+=`<rect x="-136" y="-150" width="52" height="128" rx="22" fill="#b8821e"/><rect x="84" y="-150" width="52" height="128" rx="22" fill="#b8821e"/>`;
   for(let i=-3;i<=3;i++) s+=`<path d="M${i*28} -206 V-82" stroke="#8a5a14" stroke-width="3" opacity=".5"/>`;
   for(let j=0;j<4;j++) s+=`<path d="M-92 ${-190+j*28} H92" stroke="#8a5a14" stroke-width="3" opacity=".5"/>`;
   return s+`<rect x="-110" y="-46" width="220" height="24" fill="#a8721a"/><rect x="-100" y="-22" width="14" height="22" fill="#3a2010"/><rect x="86" y="-22" width="14" height="22" fill="#3a2010"/>`; },
 cushion:()=>`<rect x="-92" y="-122" width="184" height="30" rx="14" fill="#c8483a"/><path d="M-80 -107 H80" stroke="#a8382a" stroke-width="3" stroke-dasharray="8 6"/>`,
 // le lampadaire (ampoule grillée : pas de lumière)
 floorlamp:()=>`<ellipse cx="0" cy="-6" rx="46" ry="10" fill="#3a3a32"/><rect x="-5" y="-290" width="10" height="284" fill="#b8a060"/><path d="M-60 -250 L-40 -320 H40 L60 -250Z" fill="#e8d8a8"/><path d="M-60 -250 H60" stroke="#c8b07a" stroke-width="4"/>`,
 // la table d'appoint, sa lampe et ses deux petites portes
 endtable:(open,shoes)=>{ let s=`<rect x="-80" y="-150" width="160" height="16" fill="#5a3418"/><rect x="-70" y="-134" width="140" height="120" fill="#7a4e2c"/><rect x="-70" y="-14" width="14" height="14" fill="#4a2a16"/><rect x="56" y="-14" width="14" height="14" fill="#4a2a16"/>`;
   if(open){ s+=`<rect x="-62" y="-126" width="124" height="104" fill="#1a0e08"/>`;
     if(shoes) s+=`<path d="M-50 -30 q0 -16 18 -16 h26 q8 0 8 10 v6Z M2 -30 q0 -16 18 -16 h26 q8 0 8 10 v6Z" fill="#f4f0e8"/><path d="M-30 -60 q6 -10 0 -18 M10 -64 q6 -10 0 -18" stroke="#9ab84a" stroke-width="3" fill="none" opacity=".8"/>`;
     s+=`<path d="M-62 -126 L-110 -116 V-30 L-62 -22Z M62 -126 L110 -116 V-30 L62 -22Z" fill="#8a5a32"/>`; }
   else s+=`<path d="M0 -126 V-22" stroke="#4a2a16" stroke-width="3"/><rect x="-62" y="-126" width="124" height="104" fill="none" stroke="#5a3418" stroke-width="3"/><circle cx="-10" cy="-74" r="4" fill="#c8a868"/><circle cx="10" cy="-74" r="4" fill="#c8a868"/>`;
   return s+`<ellipse cx="0" cy="-166" rx="26" ry="20" fill="#3a6a8a"/><rect x="-4" y="-200" width="8" height="30" fill="#c8a868"/><path d="M-50 -196 L-34 -250 H34 L50 -196Z" fill="#f0e0b8"/>`+glow(0,-220,90,60,'#fff0b0',.35); },
 // le canapé vert pomme
 sofa:()=>`<rect x="-240" y="-150" width="480" height="96" rx="30" fill="#8aa83a"/><rect x="-250" y="-72" width="500" height="46" rx="14" fill="#9ab84a"/>`+
   `<rect x="-276" y="-120" width="50" height="98" rx="20" fill="#7a9830"/><rect x="226" y="-120" width="50" height="98" rx="20" fill="#7a9830"/><path d="M-80 -150 V-72 M80 -150 V-72" stroke="#6a8828" stroke-width="3"/>`+
   `<rect x="-240" y="-26" width="12" height="26" fill="#3a2010"/><rect x="228" y="-26" width="12" height="26" fill="#3a2010"/>`,
 // la table basse
 coffeetable:()=>`<rect x="-190" y="-86" width="380" height="18" rx="4" fill="#6a4226"/><rect x="-176" y="-68" width="352" height="10" fill="#5a3418"/>`+
   `<rect x="-170" y="-60" width="14" height="60" fill="#5a3418"/><rect x="156" y="-60" width="14" height="60" fill="#5a3418"/><rect x="-100" y="-60" width="10" height="44" fill="#4a2a16" opacity=".6"/><rect x="90" y="-60" width="10" height="44" fill="#4a2a16" opacity=".6"/>`
};
// la fenêtre et les rideaux (sur le mur) : fermés, ou ouverts sur la rue où passe le facteur
function windowW(x,open){
  let s=`<rect x="${x-190}" y="40" width="380" height="160" fill="#f4f0e8"/>`;
  const [u,d]=grad(['#9ad0f0','#d8f0ff']); s+=d+`<rect x="${x-178}" y="52" width="356" height="136" fill="${u}"/>`;
  s+=`<path d="M${x-178} 160 H${x+178} V188 H${x-178}Z" fill="#7ab84a"/><rect x="${x+60}" y="128" width="8" height="40" fill="#4a4a4a"/><rect x="${x+48}" y="116" width="32" height="18" rx="6" fill="#3a5a8a"/>`;
  s+=`<g transform="translate(${x-60} 166)"><circle cx="0" cy="-48" r="8" fill="#e8b890"/><rect x="-9" y="-40" width="18" height="30" rx="5" fill="#3a5a9a"/><path d="M-7 -10 v14 M7 -10 v14" stroke="#2a3a6a" stroke-width="5"/><rect x="8" y="-34" width="16" height="18" fill="#8a5a2a"/><path d="M-10 -55 h20 v-5 h-20Z" fill="#2a3a6a"/></g>`;
  s+=`<path d="M${x} 52 V188 M${x-178} 120 H${x+178}" stroke="#f4f0e8" stroke-width="8"/>`;
  const stripes=['#d8a82a','#7a3a8a','#e87a2a','#e88aa8'];
  const panel=(x0,w)=>{ let p=''; for(let i=0;i<8;i++) p+=`<rect x="${(x0+i*w/8).toFixed(1)}" y="26" width="${(w/8+.5).toFixed(1)}" height="234" fill="${stripes[i%4]}"/>`;
    return p+`<path d="M${x0} 26 h${w} v234 h${-w}Z" fill="none" stroke="#5a2a3a" stroke-width="2"/>`+[1,2,3].map(i=>`<path d="M${x0+i*w/4} 30 V258" stroke="#000" stroke-width="2" opacity=".12"/>`).join(''); };
  s+=`<rect x="${x-240}" y="20" width="480" height="10" rx="4" fill="#c8a868"/>`;
  s+=open?panel(x-250,80)+panel(x+170,80):panel(x-230,230)+panel(x,230);
  return s;
}
// le tableau du chat noir, le coffre-fort derrière, le million
function picture(x){ return `<rect x="${x-70}" y="50" width="140" height="110" fill="#c8a040"/><rect x="${x-58}" y="62" width="116" height="86" fill="#e8dcc0"/>`+
  `<path d="M${x-30} 140 q-6 -40 14 -54 l-6 -18 l16 12 h12 l16 -12 l-6 18 q20 14 14 54Z" fill="#1a1a1a"/><circle cx="${x-8}" cy="${100}" r="3" fill="#d8c83a"/><circle cx="${x+10}" cy="${100}" r="3" fill="#d8c83a"/><path d="M${x+30} 138 q30 -6 22 -40" stroke="#1a1a1a" stroke-width="6" fill="none"/>`; }
function safe(x,open,cash){ let s=`<rect x="${x-60}" y="60" width="120" height="100" fill="#3a3e42"/><rect x="${x-52}" y="68" width="104" height="84" fill="#2a2c30"/>`;
  if(open){ if(cash) s+=[0,1,2].map(i=>`<rect x="${x-40+i*28}" y="${118-i%2*10}" width="40" height="22" fill="#6aa04a" stroke="#3a6a2a" stroke-width="2"/><rect x="${x-24+i*28}" y="${118-i%2*10}" width="8" height="22" fill="#e8e0c0"/>`).join('');
    s+=`<path d="M${x-52} 68 L${x-110} 76 V146 L${x-52} 152Z" fill="#5a5e62"/><circle cx="${x-84}" cy="110" r="10" fill="#8a8e92"/>`; }
  else s+=`<rect x="${x-52}" y="68" width="104" height="84" fill="#5a5e62"/><circle cx="${x}" cy="110" r="22" fill="#8a8e92" stroke="#2a2c30" stroke-width="4"/>`+[0,1,2,3,4,5,6,7].map(i=>`<path d="M${x} 110 l${(Math.cos(i*.785)*18).toFixed(1)} ${(Math.sin(i*.785)*18).toFixed(1)}" stroke="#3a3e42" stroke-width="2"/>`).join('')+`<rect x="${x+30}" y="104" width="14" height="12" fill="#8a8e92"/>`;
  return s; }
// le tapis persan ovale, au milieu du salon
function rug(cx,cy,rx,ry){ return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#8a2a2a"/><ellipse cx="${cx}" cy="${cy}" rx="${rx-16}" ry="${ry-6}" fill="none" stroke="#d8a84a" stroke-width="5"/>`+
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx-36}" ry="${ry-13}" fill="#1a2a5a"/><ellipse cx="${cx}" cy="${cy}" rx="${rx*.3}" ry="${ry*.4}" fill="#8a2a2a" stroke="#d8a84a" stroke-width="3"/>`+
  [-1,1].map(k=>`<path d="M${cx+k*rx*.55} ${cy} l${k*20} -10 l${k*20} 10 l${-k*20} 10Z" fill="#d8a84a"/>`).join(''); }
// le chat mort (Eno), couché sur le flanc
function cat(k){ return `<g transform="scale(${k||1})"><ellipse cx="0" cy="-16" rx="46" ry="16" fill="#1a1a1a"/><circle cx="-48" cy="-22" r="15" fill="#1a1a1a"/><path d="M-58 -34 l-4 -12 l10 6Z M-44 -36 l2 -12 l6 10Z" fill="#1a1a1a"/>`+
  `<path d="M-55 -26 l5 5 m0 -5 l-5 5 M-45 -26 l5 5 m0 -5 l-5 5" stroke="#e8e0c0" stroke-width="2"/><path d="M44 -14 q30 0 34 -20" stroke="#1a1a1a" stroke-width="7" fill="none" stroke-linecap="round"/>`+
  `<path d="M-20 -2 v-6 M0 -2 v-6 M20 -2 v-6" stroke="#1a1a1a" stroke-width="5"/><path d="M-66 -18 l-14 6 l4 -10 Z" fill="#ff8a2a"/></g>`; }
function bones(){ return `<path d="M-30 -6 H20" stroke="#e8e0c8" stroke-width="3"/>`+[-20,-10,0,10].map(x=>`<path d="M${x} -6 l-5 -9 M${x} -6 l-5 9" stroke="#e8e0c8" stroke-width="2"/>`).join('')+`<path d="M20 -6 l14 -9 v18Z" fill="none" stroke="#e8e0c8" stroke-width="3"/><circle cx="-34" cy="-6" r="6" fill="none" stroke="#e8e0c8" stroke-width="3"/>`; }

// ---------- les cases du salon ----------
// chaque meuble, dans sa case, au centre ; à côté, en plus petit, ceux des cases voisines
function furnish(n,x,k,full){
  const at=(s,y)=>g(x,k,s,y);
  switch(n){
   case 2: return at(F.loveseat());
   case 4: return at(F.tank());
   case 5: return at(F.tv());
   case 7: return at(F.chair()+(full&&X.has(12)?F.cushion():''));
   case 8: return at(F.floorlamp());
   case 11: return at(F.endtable(full&&X.has(102),full&&X.has(21)));
   case 12: return at(F.sofa());
   case 13: return at(F.coffeetable());
   case 15: return at(F.endtable(false,false));
   default: return '';
  }
}
const GRID=[[15,14,2,3,4],[12,13,1,6,5],[11,10,9,8,7]];
function where(r){ for(let y=0;y<3;y++){ const x=GRID[y].indexOf(r); if(x>=0) return [x,y]; } return [2,1]; }
// décor mural des cases sans meuble
const DECOR={
 1:()=>`<path d="M600 0 V40" stroke="#c8a868" stroke-width="3"/><ellipse cx="600" cy="52" rx="60" ry="14" fill="#c8a868"/>`+[-48,-24,0,24,48].map(x=>`<path d="M${600+x} 52 v-12" stroke="#f4ecd8" stroke-width="5"/>`+glow(600+x,36,16,16,'#fff0b0',.6)).join('')+[-40,-14,14,40].map(x=>`<path d="M${600+x} 62 l-3 14 h6Z" fill="#e8f0ff" opacity=".8"/>`).join(''),
 3:()=>[[-110,70,60,78],[-30,96,44,56],[40,64,70,90]].map(([dx,y,w,h])=>`<rect x="${600+dx}" y="${y}" width="${w}" height="${h}" fill="#c8a040"/><rect x="${606+dx}" y="${y+6}" width="${w-12}" height="${h-12}" fill="#8aa8b8"/><circle cx="${600+dx+w/2}" cy="${y+h/2-4}" r="${w/6}" fill="#e8c8a8"/>`).join(''),
 6:()=>`<rect x="560" y="70" width="80" height="110" rx="40" fill="#c8a040"/><rect x="568" y="78" width="64" height="94" rx="32" fill="#b8d0d8"/><path d="M576 90 q20 30 48 60" stroke="#fff" stroke-width="4" opacity=".5"/>`,
 10:()=>g(600,1,`<path d="M-30 0 L-24 -60 H24 L30 0Z" fill="#a85a2a"/>`+[[-50,-150],[-20,-190],[10,-170],[40,-140],[-36,-110],[30,-110]].map(([x,y])=>`<path d="M0 -60 Q${x/2} ${y/2} ${x} ${y}" stroke="#3a6a2a" stroke-width="5" fill="none"/><ellipse cx="${x}" cy="${y}" rx="18" ry="9" fill="#4a8a3a" transform="rotate(${x/2} ${x} ${y})"/>`).join('')),
 14:()=>`<circle cx="600" cy="110" r="44" fill="#6a4226"/><circle cx="600" cy="110" r="36" fill="#f4ecd8"/><path d="M600 110 V84 M600 110 L620 120" stroke="#2a1a10" stroke-width="4"/>`+[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<circle cx="${(600+Math.sin(i*.5236)*30).toFixed(1)}" cy="${(110-Math.cos(i*.5236)*30).toFixed(1)}" r="2" fill="#2a1a10"/>`).join('')
};
function place(r){
  const [cx,cy]=where(r), wallL=cx===0, wallR=cx===4;
  let s=salon(r,{wallL,wallR}), own=[];
  // la fenêtre (case 9) et le mur au-dessus des meubles
  if(r===9) s+=windowW(600,X.has(103));
  if(r===8||r===10) s+=`<g opacity=".9">${windowW(r===8?-40:1236,X.has(103))}</g>`;
  if(r===2){ if(X.has(5)){ s+=picture(600); own.push(5); } else if(X.has(6)){ s+=safe(600,X.has(104),X.has(7)); own.push(7); } }
  if(DECOR[r]) s+=DECOR[r]();
  // voisins : à gauche et à droite, en plus petit
  const L=cx>0?GRID[cy][cx-1]:null, R=cx<4?GRID[cy][cx+1]:null;
  if(L) s+=furnish(L,150,.72,false);
  if(R) s+=furnish(R,1046,.72,false);
  s+=furnish(r,600,1.08,true);
  if(r===7&&X.has(12)) own.push(12);
  if(r===11&&X.has(21)&&X.has(102)) own.push(21);
  // le milieu du salon : le tapis, la latte, le trou, le chat
  if(r===1){
    if(X.has(1)){ s+=rug(600,312,330,42); own.push(1); }
    else { s+=`<path d="M520 298 H680 L690 322 H510Z" fill="${X.has(2)?'#c08a4a':'#2a1a10'}" stroke="#5a3418" stroke-width="2"/>`; if(X.has(2)) own.push(2);
      if(!X.has(2)&&X.has(3)){ s+=g(606,1.1,cat(),318); own.push(3); } }
  }
  if(r===13&&X.has(24)){ const op=X.has(101); s+=g(560,1.08,op?`<path d="M-44 -94 L0 -88 L44 -94 L44 -86 L0 -80 L-44 -86Z" fill="#f4ecd8" stroke="#6a4a2a" stroke-width="2"/><path d="M0 -88 V-80" stroke="#6a4a2a" stroke-width="2"/>`:
    `<rect x="-36" y="-96" width="72" height="12" fill="#6a3a1a"/><rect x="-32" y="-94" width="66" height="8" fill="#f4ecd8"/>`); own.push(24); }
  return {s,own};
}
function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const r=parseInt(key)||off+1;
  X=new Set(objs);
  const p=place(r);
  let s=p.s;
  const items=objs.filter(i=>OBJ[i]&&!FIXED.has(i)&&!p.own.includes(i)).sort((a,b)=>a-b);
  const x0=300, x1=900, slots=Math.max(4,items.length);
  items.forEach((i,j)=>{ const xx=x0+(x1-x0)*((j*3+off)%slots+.5)/slots; s+=g(xx,1.3,OBJ[i](),G+14+((i*13)%3)*8); });
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}${veil()}</svg>`;
}
// meubles et éléments fixés : jamais posés au sol
const FIXED=new Set([4,6,8,9,10,11,14,16,17,18,19,20,22,23,25,26,27]);

// ---------- objets qu'on peut porter (posés au sol, et icônes) ----------
const OBJ={
 1:()=>rug(0,-14,70,14),
 2:()=>`<rect x="-60" y="-12" width="120" height="12" fill="#c08a4a" stroke="#7a4e26" stroke-width="2"/><circle cx="-50" cy="-6" r="2" fill="#3a2010"/><circle cx="50" cy="-6" r="2" fill="#3a2010"/>`,
 3:()=>cat(.9),
 5:()=>`<g transform="translate(0 -60) scale(.6) translate(-600 -50)">${picture(600)}</g>`,
 7:()=>[0,1,2].map(i=>`<rect x="${-46+i*28}" y="${-24-i%2*10}" width="40" height="22" fill="#6aa04a" stroke="#3a6a2a" stroke-width="2"/><rect x="${-30+i*28}" y="${-24-i%2*10}" width="8" height="22" fill="#e8e0c0"/>`).join(''),
 12:()=>`<g transform="translate(0 46) scale(.5)">${F.cushion()}</g>`,
 13:()=>`<rect x="-26" y="-36" width="52" height="34" fill="#1a2a5a" transform="rotate(-6)"/><circle cx="8" cy="-22" r="8" fill="#e8c84a" transform="rotate(-6)"/><path d="M-20 -32 h26" stroke="#ff6a4a" stroke-width="4" transform="rotate(-6)"/>`,
 15:()=>`<path d="M-8 -6 h16 v-8 q14 -10 0 -30 q-8 -10 -16 0 q-14 20 0 30Z" fill="#e8e8e0" stroke="#8a8a80" stroke-width="2"/><path d="M-6 -30 l4 6 l4 -6 l4 6" stroke="#4a4a42" stroke-width="2" fill="none"/>`,
 21:()=>`<path d="M-50 0 q0 -18 20 -18 h24 q10 0 10 12 v6Z M4 0 q0 -18 20 -18 h24 q10 0 10 12 v6Z" fill="#f4f0e8" stroke="#a8a49a" stroke-width="2"/><path d="M-30 -26 q6 -10 0 -18 M24 -28 q6 -10 0 -18" stroke="#9ab84a" stroke-width="3" fill="none"/>`,
 24:()=>`<rect x="-36" y="-14" width="72" height="12" fill="#6a3a1a"/><rect x="-32" y="-12" width="66" height="8" fill="#f4ecd8"/>`,
 28:()=>bones()
};
const DIM={1:[150,34],3:[170,60],5:[90,80],12:[100,30],15:[40,50],21:[110,50]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[90,50]; return `<svg class="oi" width="${size}" height="${size}" viewBox="${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES:{},OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
