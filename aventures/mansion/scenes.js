// Mansion of Doom — illustrations vectorielles, dans le style des autres aventures : un décor par lieu, d'après sa description.
// Le manoir du comte von Steinoff : pièces tendues de papier peint sombre au rez-de-chaussée et aux étages, cave voûtée en
// pierre (noire tant que le courant est coupé, baignée de lueur rouge ensuite), sous-cave creusée dans le roc.
// Les fenêtres et le dehors suivent l'heure du jeu : après-midi, puis soir à l'approche du coucher du soleil, puis nuit.
// render(clé, lieu, numéros, options) : numéros = objets présents (1 à 67) et éléments de scène (101 et plus, voir aventure.js).
const SCENES=(function(){
const W=1196, H=396, G=330;            // G : ligne du sol où l'on pose les objets
let uid=0, X=new Set();
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,dir){ const id='mdg'+(uid++); const [x2,y2]=dir==='h'?[1,0]:[0,1];
  return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function glow(cx,cy,rx,ry,c,o){ const id='mdl'+(uid++); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o||.55}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`; }
const veil=()=>{ const [u,d]=grad(['rgba(8,6,10,0)','rgba(8,6,10,0)','rgba(8,6,10,.85)']); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; };
const f0=n=>n.toFixed(0);
const sky=()=>X.has(116)?'night':X.has(115)?'dusk':'day';
const SKY={day:['#7a9cc0','#c8d8e0'],dusk:['#3a2a5a','#d86a3a'],night:['#06081a','#1a1e3a']};

// ---------- pièces du manoir ----------
// papier peint haut, bas, boiseries, parquet proche, parquet lointain, motif
const PAL={
 red:['#5a1e26','#3a1218','#2a140e','#2a1a10','#4a3020','#8a3a40'],
 green:['#2a3e2e','#18261c','#2a1e12','#24180e','#40301e','#4a6a4e'],
 white:['#d0ccc0','#a8a496','#7a7466','#5a4a36','#8a7656','#e8e4d8'],
 blue:['#3a5068','#203040','#26303a','#1e2630','#3a4a5a','#6a8aa8'],
 musty:['#4a4c36','#2c2e1e','#2a2216','#241c12','#3e3220','#6a6c48'],
 murky:['#26302a','#121812','#1a1a12','#161410','#2a261c','#3a4a3a'],
 rancid:['#5a4a22','#33280e','#2a1e0a','#2a1e10','#4a3a1e','#7a6a30'],
 sunny:['#a0783a','#6a4a20','#4a3216','#4a3420','#7a5a34','#d8b060'],
 purple:['#3e2646','#22142a','#24141a','#22160e','#3e2a1c','#6a4a7a'],
 brown:['#4a3222','#2a1c12','#1e140c','#2a1c10','#4a3220','#6a4a30'],
 grey:['#4a4848','#2a2828','#1e1c1a','#26201a','#3e342a','#6a6866']
};
function room(r,p,o){
  o=o||{};
  const [u,d]=grad([p[0],p[1]]); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  // motif de papier peint : losanges et fleurs de lys discrètes
  if(!o.plain) for(let y=70;y<210;y+=46) for(let x=((y/46)%2)*36;x<W;x+=72)
    s+=`<path d="M${x} ${y-12} l9 12 l-9 12 l-9 -12Z" fill="${p[5]}" opacity=".22"/>`;
  // corniche
  s+=`<rect width="${W}" height="34" fill="${p[2]}"/><path d="M0 34 H${W}" stroke="${p[5]}" stroke-width="3" opacity=".5"/><path d="M0 44 H${W}" stroke="${p[2]}" stroke-width="6"/>`;
  // lambris
  s+=`<rect x="0" y="210" width="${W}" height="58" fill="${p[2]}"/><path d="M0 212 H${W}" stroke="${p[5]}" stroke-width="3" opacity=".45"/>`;
  for(let x=20;x<W;x+=120) s+=`<rect x="${x}" y="222" width="96" height="36" fill="none" stroke="${p[5]}" stroke-width="2" opacity=".3"/>`;
  // parquet en perspective
  const [fu,fd]=grad([p[4],p[3]]);
  s+=fd+`<path d="M0 268 H${W} V${H} H0Z" fill="${fu}"/><path d="M0 268 H${W}" stroke="#0a0604" stroke-width="5"/>`;
  for(let i=-7;i<=7;i++) s+=`<path d="M${600+i*86} 268 L${600+i*210} ${H}" stroke="#0a0604" stroke-width="2" opacity=".4"/>`;
  if(o.rug) s+=`<path d="M${o.rug[0]} 290 H${o.rug[1]} L${o.rug[1]+40} 360 H${o.rug[0]-40}Z" fill="${o.rugC||'#6a1a20'}" opacity=".8"/><path d="M${o.rug[0]+12} 298 H${o.rug[1]-12} L${o.rug[1]+22} 350 H${o.rug[0]-22}Z" fill="none" stroke="#c8a04a" stroke-width="3" opacity=".6"/>`;
  return s;
}
function cobweb(x,y,k,flip){ k=k||1; const sx=flip?-1:1; let s=`<g transform="translate(${x} ${y}) scale(${sx*k} ${k})" stroke="#d8d4cc" stroke-width="1.6" fill="none" opacity=".55">`;
  for(let a=0;a<=90;a+=18){ const t=a*Math.PI/180; s+=`<path d="M0 0 L${f0(Math.cos(t)*120)} ${f0(Math.sin(t)*120)}"/>`; }
  for(let r=30;r<=120;r+=30){ let d='M'+r+' 0'; for(let a=18;a<=90;a+=18){ const t=a*Math.PI/180, m=(a-9)*Math.PI/180; d+=` Q${f0(Math.cos(m)*r*.8)} ${f0(Math.sin(m)*r*.8)} ${f0(Math.cos(t)*r)} ${f0(Math.sin(t)*r)}`; } s+=`<path d="${d}"/>`; }
  return s+'</g>'; }
function door(x,w,o){ o=o||{}; const h=o.h||200, y=268-h; let s=`<rect x="${x-10}" y="${y-12}" width="${w+20}" height="${h+12}" fill="#1a0e08"/>`;
  if(o.open) s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.inside||'#050304'}"/><path d="M${x} ${y} L${x+w*.3} ${y+16} V${268-6} L${x} 268Z" fill="#5a3a22"/>`;
  else { s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.c||'#4a2c18'}"/>`;
    s+=`<rect x="${x+12}" y="${y+14}" width="${w/2-18}" height="${h/2-22}" fill="none" stroke="#2a180c" stroke-width="4"/><rect x="${x+w/2+6}" y="${y+14}" width="${w/2-18}" height="${h/2-22}" fill="none" stroke="#2a180c" stroke-width="4"/>`;
    s+=`<rect x="${x+12}" y="${y+h/2+4}" width="${w/2-18}" height="${h/2-22}" fill="none" stroke="#2a180c" stroke-width="4"/><rect x="${x+w/2+6}" y="${y+h/2+4}" width="${w/2-18}" height="${h/2-22}" fill="none" stroke="#2a180c" stroke-width="4"/>`;
    s+=`<circle cx="${x+w-14}" cy="${y+h/2+10}" r="6" fill="#c8a04a"/>`; }
  return s; }
function arch(x,w,h,c){ const y=268-h; return `<path d="M${x-10} 268 V${y+w/2} A${w/2+10} ${w/2+10} 0 0 1 ${x+w+10} ${y+w/2} V268Z" fill="#1a0e08"/><path d="M${x} 268 V${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w} ${y+w/2} V268Z" fill="${c||'#060405'}"/>`; }
function moon(x,y,R){ return glow(x,y,R*3,R*3,'#e8e8ff',.35)+`<circle cx="${x}" cy="${y}" r="${R}" fill="#f0eedc"/><circle cx="${x-R*.3}" cy="${y-R*.2}" r="${R*.18}" fill="#d8d4c0"/><circle cx="${x+R*.3}" cy="${y+R*.3}" r="${R*.12}" fill="#d8d4c0"/>`; }
function windowW(x,y,w,h,o){ o=o||{}; const k=sky(), [u,d]=grad(SKY[k]); let s=d+`<rect x="${x-14}" y="${y-14}" width="${w+28}" height="${h+28}" fill="#1a0e08"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${u}"/>`;
  if(k==='night') s+=`<circle cx="${x+w*.7}" cy="${y+h*.28}" r="${Math.min(w,h)*.12}" fill="#f0eedc"/>`;
  if(k==='dusk') s+=`<circle cx="${x+w*.4}" cy="${y+h*.9}" r="${w*.2}" fill="#ff9a4a" opacity=".85"/>`;
  s+=`<path d="M${x} ${y+h*.72} Q${x+w*.3} ${y+h*.6} ${x+w*.55} ${y+h*.7} T${x+w} ${y+h*.66} V${y+h} H${x}Z" fill="#1a1e1a" opacity=".85"/>`;
  s+=`<path d="M${x+w/2} ${y} V${y+h} M${x} ${y+h/2} H${x+w}" stroke="#1a0e08" stroke-width="7"/>`;
  if(o.curtain) s+=`<path d="M${x-26} ${y-20} Q${x+10} ${y+h/2} ${x-10} ${y+h+30} H${x-40} V${y-20}Z" fill="${o.curtain}"/><path d="M${x+w+26} ${y-20} Q${x+w-10} ${y+h/2} ${x+w+10} ${y+h+30} H${x+w+40} V${y-20}Z" fill="${o.curtain}"/>`;
  if(k==='day'&&o.beam) s+=`<path d="M${x} ${y+h} L${x+w} ${y+h} L${x+w+160} ${H} L${x+60} ${H}Z" fill="#fff4c0" opacity=".14"/>`;
  return s; }
function sconce(x,y,lit){ return (lit!==false?glow(x,y-20,80,70,'#ffcc66',.35):'')+`<path d="M${x-14} ${y} H${x+14} L${x+6} ${y+16} H${x-6}Z" fill="#a8803a"/><rect x="${x-5}" y="${y-26}" width="10" height="26" fill="#ece4cc"/>`+(lit!==false?`<path d="M${x} ${y-42} q8 10 0 16 q-8 -6 0 -16Z" fill="#ffb84a"/>`:''); }
function frame(x,y,w,h,inner){ return `<rect x="${x-8}" y="${y-8}" width="${w+16}" height="${h+16}" fill="#a8803a"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${inner||'#2a2a3a'}"/>`; }
function portrait(x,y){ return frame(x,y,110,140,'#1e1a24')+`<ellipse cx="${x+55}" cy="${y+60}" rx="26" ry="32" fill="#d8ccc0"/><path d="M${x+29} ${y+52} Q${x+55} ${y+10} ${x+81} ${y+52} L${x+70} ${y+40} L${x+55} ${y+50} L${x+40} ${y+40}Z" fill="#0a0808"/><path d="M${x+15} ${y+140} Q${x+20} ${y+96} ${x+55} ${y+94} Q${x+90} ${y+96} ${x+95} ${y+140}Z" fill="#0a0808"/><path d="M${x+38} ${y+94} L${x+55} ${y+122} L${x+72} ${y+94}" fill="#c0392b"/><circle cx="${x+46}" cy="${y+58}" r="3" fill="#a01818"/><circle cx="${x+64}" cy="${y+58}" r="3" fill="#a01818"/>`; }
function fireplace(x,lit){ let s=`<rect x="${x}" y="${G-150}" width="240" height="150" fill="#6a625a"/><rect x="${x-14}" y="${G-164}" width="268" height="20" fill="#8a8278"/><path d="M${x+40} ${G} V${G-90} Q${x+120} ${G-130} ${x+200} ${G-90} V${G}Z" fill="#0c0806"/>`;
  if(lit) s+=glow(x+120,G-30,200,90,'#ff8a3a',.45)+`<path d="M${x+80} ${G-6} q20 -60 40 -20 q10 -50 30 -10 q14 -30 20 10Z" fill="#ff9a3a"/><path d="M${x+100} ${G-6} q14 -30 24 -6 q10 -24 18 4Z" fill="#ffe08a"/>`;
  else s+=`<path d="M${x+70} ${G-4} h100" stroke="#3a2a1e" stroke-width="12"/>`;
  return s; }
function shelf(x,w,rows,c){ let s=`<rect x="${x}" y="${G-220}" width="${w}" height="220" fill="${c||'#3a2414'}"/>`; const rr=rng(x*7+w);
  for(let i=0;i<rows;i++){ const y=G-210+i*(210/rows); s+=`<rect x="${x+8}" y="${y}" width="${w-16}" height="${210/rows-10}" fill="#1a0e08"/>`;
    for(let bx=x+12;bx<x+w-24;){ const bw=10+rr()*12, bh=210/rows-18-rr()*14; s+=`<rect x="${f0(bx)}" y="${f0(y+210/rows-10-bh)}" width="${f0(bw)}" height="${f0(bh)}" fill="${['#6a1e1e','#2a3a5a','#4a5a2a','#7a5a2a','#3a2a4a'][Math.floor(rr()*5)]}"/>`; bx+=bw+2; } }
  return s; }
function sofa(x,c){ c=c||'#5a1a28'; return `<rect x="${x}" y="${G-80}" width="220" height="60" rx="16" fill="${c}"/><rect x="${x-14}" y="${G-60}" width="30" height="50" rx="10" fill="${c}"/><rect x="${x+204}" y="${G-60}" width="30" height="50" rx="10" fill="${c}"/><rect x="${x+6}" y="${G-36}" width="208" height="24" rx="6" fill="#3a0e18"/><path d="M${x} ${G-10} v10 M${x+220} ${G-10} v10" stroke="#2a180c" stroke-width="8"/>`; }
function armchair(x,c){ c=c||'#4a2a3a'; return `<rect x="${x}" y="${G-110}" width="90" height="80" rx="20" fill="${c}"/><rect x="${x-12}" y="${G-60}" width="114" height="44" rx="10" fill="${c}"/><path d="M${x} ${G-16} v16 M${x+90} ${G-16} v16" stroke="#2a180c" stroke-width="8"/>`; }
function table(x,w,c){ c=c||'#4a2c18'; return `<rect x="${x}" y="${G-90}" width="${w}" height="16" fill="${c}"/><rect x="${x+14}" y="${G-74}" width="12" height="74" fill="#2a180c"/><rect x="${x+w-26}" y="${G-74}" width="12" height="74" fill="#2a180c"/>`; }
function chair(x,c){ c=c||'#2a180c'; return `<rect x="${x}" y="${G-130}" width="10" height="130" fill="${c}"/><rect x="${x}" y="${G-60}" width="50" height="10" fill="${c}"/><rect x="${x+40}" y="${G-60}" width="10" height="60" fill="${c}"/><path d="M${x+2} ${G-124} h8 M${x+2} ${G-100} h8" stroke="#5a3a22" stroke-width="3"/>`; }
function bed(x){ return `<rect x="${x}" y="${G-200}" width="22" height="200" fill="#2a180c"/><rect x="${x+300}" y="${G-140}" width="22" height="140" fill="#2a180c"/><rect x="${x+10}" y="${G-90}" width="300" height="50" fill="#d8d0c0"/><rect x="${x+90}" y="${G-104}" width="222" height="44" rx="6" fill="#6a1a28"/><ellipse cx="${x+56}" cy="${G-100}" rx="38" ry="16" fill="#efe8d8"/><path d="M${x} ${G-200} Q${x+160} ${G-240} ${x+322} ${G-200}" stroke="#6a1a28" stroke-width="14" fill="none"/>`; }
function candelabra(x,y,lit){ let s=`<path d="M${x} ${y} V${y-60} M${x-34} ${y-60} Q${x-34} ${y-30} ${x} ${y-30} Q${x+34} ${y-30} ${x+34} ${y-60}" stroke="#c8a04a" stroke-width="5" fill="none"/><ellipse cx="${x}" cy="${y}" rx="22" ry="6" fill="#a8803a"/>`;
  for(const dx of [-34,0,34]){ s+=`<rect x="${x+dx-4}" y="${y-84}" width="8" height="24" fill="#ece4cc"/>`; if(lit!==false) s+=glow(x+dx,y-92,40,40,'#ffcc66',.3)+`<path d="M${x+dx} ${y-100} q6 8 0 12 q-6 -4 0 -12Z" fill="#ffb84a"/>`; }
  return s; }
function stairs(x,up){ let s=''; for(let i=0;i<9;i++){ const y=G-i*28; s+=`<rect x="${x+(up?i*34:0)}" y="${y-28}" width="${up?300-i*34:170+i*14}" height="28" fill="${i%2?'#4a2c18':'#5a3a22'}" stroke="#2a180c" stroke-width="2"/>`; }
  s+=`<path d="M${x+20} ${G-30} L${x+300} ${G-260}" stroke="#2a180c" stroke-width="10"/>`; for(let i=0;i<8;i++) s+=`<path d="M${x+20+i*35} ${G-30-i*29} v-60" stroke="#3a2414" stroke-width="5"/>`;
  return s; }
function stairwell(r,p){ // l'escalier qui va de la cave au grenier : marches qui montent et trémie qui descend
  return room(r,p)+stairs(140,1)+`<path d="M640 268 L980 268 L1040 ${H} L580 ${H}Z" fill="#0a0604"/>`+[0,1,2,3].map(i=>`<rect x="${650+i*24}" y="${280+i*28}" width="${300-i*10}" height="10" fill="#3a2414"/>`).join('')+sconce(560,140)+sconce(1100,140);
}
function hall(r,p,o){ o=o||{}; let s=room(r,p,{rug:[380,820],rugC:o.rug||'#4a1a2a'}); for(const x of [120,940]) s+=door(x,110,{h:180}); s+=sconce(330,130,!o.dark)+sconce(860,130,!o.dark)+frame(520,90,150,100,'#3a3a2a');
  s+=`<path d="M530 180 Q590 120 660 170" stroke="#5a6a4a" stroke-width="6" fill="none"/>`; return s; }

// ---------- cave et sous-cave ----------
function stones(r,c1,c2,y0,y1){ let s=''; for(let y=y0;y<y1;y+=34){ const off=((y/34)%2)*45; for(let x=-off;x<W;x+=90){ s+=`<rect x="${f0(x+2)}" y="${y+2}" width="86" height="30" rx="4" fill="${r()<.5?c1:c2}"/>`; } } return s; }
function cellar(r,o){ o=o||{}; let s=`<rect width="${W}" height="${H}" fill="#120e0c"/>`+stones(r,'#3a332c','#2e2822',0,260);
  // voûtes
  for(const x of [0,400,800]) s+=`<path d="M${x} 0 Q${x+200} 120 ${x+400} 0" stroke="#1a1410" stroke-width="22" fill="none"/>`;
  const [fu,fd]=grad(['#2a241e','#141010']); s+=fd+`<path d="M0 260 H${W} V${H} H0Z" fill="${fu}"/><path d="M0 260 H${W}" stroke="#0a0806" stroke-width="5"/>`;
  for(let i=0;i<14;i++){ const x=r()*W, y=280+r()*100; s+=`<ellipse cx="${f0(x)}" cy="${f0(y)}" rx="${f0(10+r()*30)}" ry="${f0(3+r()*5)}" fill="#0a0806" opacity=".6"/>`; }
  if(o.torch) s+=torch(o.torch,120);
  return s; }
function torch(x,y,lit){ return (lit!==false?glow(x,y-30,140,120,'#ff8a3a',.45):'')+`<path d="M${x-6} ${y} L${x+6} ${y} L${x+3} ${y+50} H${x-3}Z" fill="#4a2c18"/><rect x="${x-16}" y="${y+20}" width="32" height="8" fill="#3a3a3a"/>`+(lit!==false?`<path d="M${x} ${y-40} q22 24 8 40 h-16 q-14 -16 8 -40Z" fill="#ff9a3a"/><path d="M${x} ${y-22} q10 12 4 22 h-8 q-6 -10 4 -22Z" fill="#ffe08a"/>`:''); }
function rock(r,o){ o=o||{}; const [u,d]=grad([o.c1||'#2a2420',o.c2||'#0e0c0a']); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  for(let i=0;i<9;i++){ const x=i*150-40+r()*40; s+=`<path d="M${f0(x)} 0 Q${f0(x+40)} ${f0(80+r()*80)} ${f0(x+20)} ${f0(250+r()*20)} L${f0(x+150)} 260 Q${f0(x+110)} 120 ${f0(x+170)} 0Z" fill="${o.c3||'#1e1a16'}" opacity=".7"/>`; }
  for(let i=0;i<10;i++){ const x=40+r()*1120, l=30+r()*70; s+=`<path d="M${f0(x-14)} 0 L${f0(x)} ${f0(l)} L${f0(x+14)} 0Z" fill="${o.c3||'#1e1a16'}"/>`; }
  const [fu,fd]=grad([o.f1||'#262018',o.f2||'#100c0a']); s+=fd+`<path d="M0 262 Q300 250 600 264 T${W} 258 V${H} H0Z" fill="${fu}"/>`;
  for(let i=0;i<8;i++){ const x=r()*W, y=290+r()*90; s+=`<path d="M${f0(x-30)} ${f0(y)} Q${f0(x)} ${f0(y-20-r()*20)} ${f0(x+30)} ${f0(y)}Z" fill="#141010"/>`; }
  return s; }
function skull(x,y,k){ k=k||1; return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-16 0 Q-22 -26 0 -28 Q22 -26 16 0 L10 0 V8 H-10 V0Z" fill="#e0d8c4"/><circle cx="-7" cy="-12" r="5" fill="#1a1410"/><circle cx="7" cy="-12" r="5" fill="#1a1410"/><path d="M-6 4 V8 M0 4 V8 M6 4 V8" stroke="#8a8270" stroke-width="2"/></g>`; }
function bone(x,y,a){ return `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-24" y="-3" width="48" height="6" fill="#d8d0bc"/><circle cx="-24" cy="-4" r="5" fill="#d8d0bc"/><circle cx="-24" cy="4" r="5" fill="#d8d0bc"/><circle cx="24" cy="-4" r="5" fill="#d8d0bc"/><circle cx="24" cy="4" r="5" fill="#d8d0bc"/></g>`; }
function body(x,y,a,c){ return `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse cx="0" cy="0" rx="60" ry="14" fill="${c||'#5a5048'}"/><circle cx="-68" cy="-2" r="13" fill="#b8a898"/><path d="M-30 10 l-20 14 M20 10 l24 12" stroke="${c||'#5a5048'}" stroke-width="9"/></g>`; }
function coffin(x,open,vampire,slain){ let s=`<path d="M${x} ${G-6} L${x+40} ${G-56} H${x+260} L${x+300} ${G-30} L${x+260} ${G} H${x+40}Z" fill="#141014" stroke="#3a2a3a" stroke-width="4"/>`;
  if(open){ s+=`<path d="M${x+20} ${G-30} L${x+50} ${G-50} H${x+250} L${x+280} ${G-30} L${x+250} ${G-10} H${x+50}Z" fill="#7a1020"/>`;
    s+=`<path d="M${x+40} ${G-56} L${x+20} ${G-170} H${x+240} L${x+260} ${G-56}Z" fill="#1e161e" stroke="#3a2a3a" stroke-width="4"/>`;
    if(vampire){ s+=`<ellipse cx="${x+150}" cy="${G-36}" rx="100" ry="12" fill="#0a0808"/><ellipse cx="${x+60}" cy="${G-38}" rx="18" ry="14" fill="#d8dce0"/><path d="M${x+46} ${G-46} L${x+60} ${G-52} L${x+74} ${G-46}" stroke="#0a0808" stroke-width="5" fill="none"/><path d="M${x+60} ${G-30} l-3 6 M${x+64} ${G-30} l3 6" stroke="#fff" stroke-width="2"/><path d="M${x+90} ${G-48} L${x+110} ${G-22} L${x+130} ${G-48}" fill="#a01820"/>`;
      if(slain) s+=`<path d="M${x+150} ${G-40} L${x+150} ${G-130}" stroke="#a87a4a" stroke-width="10"/><path d="M${x+150} ${G-40} l-6 8 M${x+150} ${G-40} l6 8" stroke="#8a1018" stroke-width="4"/><ellipse cx="${x+150}" cy="${G-36}" rx="26" ry="6" fill="#8a1018"/>`; } }
  else s+=`<path d="M${x+150} ${G-50} v-0 M${x+136} ${G-30} h28 M${x+150} ${G-44} v28" stroke="#a8803a" stroke-width="5"/>`;
  return s; }
function casketBox(x,open,princess,ash){ let s=`<rect x="${x}" y="${G-60}" width="170" height="60" rx="4" fill="#5a3a1a" stroke="#c8a04a" stroke-width="4"/>`;
  if(open){ s+=`<path d="M${x} ${G-60} L${x+20} ${G-120} H${x+190} L${x+170} ${G-60}Z" fill="#6a4a22" stroke="#c8a04a" stroke-width="4"/>`;
    if(ash) s+=`<ellipse cx="${x+85}" cy="${G-60}" rx="70" ry="10" fill="#8a8680"/><ellipse cx="${x+85}" cy="${G-64}" rx="40" ry="6" fill="#a8a49c"/>`;
    else if(princess) s+=`<ellipse cx="${x+85}" cy="${G-62}" rx="70" ry="10" fill="#e8e0f0"/><circle cx="${x+22}" cy="${G-66}" r="10" fill="#f0e8e0"/><path d="M${x+12} ${G-70} q10 -10 22 -2" stroke="#e8c050" stroke-width="5" fill="none"/>`; }
  else s+=`<rect x="${x-4}" y="${G-70}" width="178" height="16" rx="4" fill="#6a4a22" stroke="#c8a04a" stroke-width="4"/><rect x="${x+77}" y="${G-44}" width="16" height="18" fill="#c8a04a"/>`;
  return s; }
// pièce obscure : on ne voit presque rien
function dark(s){ return s+`<rect width="${W}" height="${H}" fill="#020203" opacity=".93"/>`; }
// lueur rouge du courant rétabli dans la cave
function red(){ return `<rect width="${W}" height="${H}" fill="#a0101a" opacity=".16"/>`+glow(600,40,700,160,'#ff2a2a',.18); }

// ---------- décors des lieux ----------
const PLACES={
 // devant le manoir : la façade, la lande, le ciel suit l'heure
 1:(r,x)=>{ const k=sky(), [u,d]=grad(SKY[k]); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
   if(k==='night') { for(let i=0;i<40;i++) s+=`<circle cx="${f0(r()*W)}" cy="${f0(r()*160)}" r="${(1+r()*1.5).toFixed(1)}" fill="#fff" opacity=".7"/>`; s+=moon(1020,70,28); }
   else if(k==='dusk') s+=glow(200,250,400,140,'#ff7a3a',.6)+`<circle cx="200" cy="240" r="40" fill="#ff9a4a"/>`;
   else s+=`<circle cx="1030" cy="70" r="30" fill="#fff4c0" opacity=".85"/>`+[[160,80],[420,50],[760,96]].map(([cx,cy])=>`<ellipse cx="${cx}" cy="${cy}" rx="90" ry="20" fill="#e8ecf0" opacity=".6"/>`).join('');
   s+=`<path d="M0 250 Q200 220 420 240 T900 236 T${W} 244 V${H} H0Z" fill="#1e2418"/>`;
   // la façade
   s+=`<rect x="340" y="80" width="520" height="190" fill="#3a3238"/><path d="M320 84 L600 10 L880 84Z" fill="#241c22"/><rect x="380" y="20" width="40" height="70" fill="#2a2228"/><rect x="780" y="26" width="40" height="64" fill="#2a2228"/>`;
   s+=`<path d="M240 270 V110 L290 70 L340 110 V270Z" fill="#30282e"/><path d="M860 270 V110 L910 70 L960 110 V270Z" fill="#30282e"/>`;
   for(const [wx,wy] of [[380,120],[460,120],[700,120],[780,120],[380,190],[780,190],[270,130],[890,130]]) s+=`<rect x="${wx}" y="${wy}" width="40" height="50" fill="${k==='day'?'#20242a':'#e8b04a'}" opacity="${k==='day'?1:.75}"/><path d="M${wx+20} ${wy} v50 M${wx} ${wy+25} h40" stroke="#1a1418" stroke-width="3"/>`;
   s+=door(550,100,{h:120,open:x.has(109),inside:'#120a08'});
   s+=`<path d="M560 330 L500 ${H} M640 330 L700 ${H}" stroke="#5a5a4a" stroke-width="3" opacity=".6"/><path d="M500 ${H} L560 270 H640 L700 ${H}Z" fill="#4a4436" opacity=".6"/>`;
   // arbre mort et grille
   s+=`<path d="M110 ${H} L120 200 L80 150 M118 220 L160 160 L190 150 M120 180 L100 120" stroke="#0e0e0c" stroke-width="12" fill="none" stroke-linecap="round"/>`;
   for(let i=0;i<16;i++) s+=`<path d="M${980+i*14} ${G} V${G-90}" stroke="#0e0e0c" stroke-width="4"/><path d="M${976+i*14} ${G-90} l4 -10 l4 10" fill="#0e0e0c"/>`;
   s+=`<path d="M970 ${G-60} H${W}" stroke="#0e0e0c" stroke-width="5"/>`;
   return {s,x0:720,x1:960}; },
 2:(r)=>({s:room(r,PAL.brown,{rug:[420,780]})+windowW(520,70,150,120,{curtain:'#3a1018'})+cobweb(0,34,.8)+chair(260)+chair(900),x0:160,x1:1040}),
 3:(r)=>({s:room(r,PAL.red,{rug:[300,900]})+fireplace(480,0)+portrait(160,70)+sofa(160,'#5a1a28')+armchair(880)+candelabra(600,G-164),x0:200,x1:1000}),
 4:(r,x)=>{ let s=room(r,PAL.grey,{plain:1}); for(let i=0;i<10;i++) s+=`<path d="M${i*130-50} 268 L${i*150-120} ${H}" stroke="#d8d0c0" stroke-width="2" opacity=".2"/>`;
   s+=`<path d="M0 300 H${W} M0 340 H${W}" stroke="#d8d0c0" stroke-width="2" opacity=".15"/>`;
   s+=door(540,120,{h:220,open:x.has(109),inside:SKY[sky()][0]})+sconce(440,120)+sconce(760,120);
   s+=`<path d="M220 ${G} V${G-180} M200 ${G-170} h40 M196 ${G-150} l24 -8 l24 8" stroke="#2a180c" stroke-width="7" fill="none"/><ellipse cx="220" cy="${G}" rx="30" ry="6" fill="#2a180c"/><path d="M196 ${G-150} q-6 40 6 60 h20" fill="#2a2a34"/>`;
   s+=`<rect x="900" y="${G-140}" width="40" height="140" fill="#3a2414"/><ellipse cx="920" cy="${G-140}" rx="40" ry="10" fill="#5a3a22"/>`;
   return {s,x0:260,x1:880}; },
 5:(r,x)=>({s:room(r,PAL.purple,{rug:[320,880]})+armchair(220)+armchair(860)+table(500,200)+windowW(140,70,110,110,{curtain:'#2a1430'})+frame(820,80,120,90,'#3a4a5a'),x0:300,x1:820}),
 6:(r)=>{ let s=room(r,PAL.red); for(const x of [140,420,700,980]){ s+=`<rect x="${x}" y="${G-150}" width="110" height="150" fill="#2a180c"/><rect x="${x+8}" y="${G-142}" width="94" height="90" fill="#9ac0d0" opacity=".25" stroke="#c8d8e0" stroke-width="2"/>`;
     s+=[`<circle cx="${x+55}" cy="${G-96}" r="18" fill="#c8a04a"/>`,`<path d="M${x+30} ${G-60} L${x+55} ${G-130} L${x+80} ${G-60}Z" fill="#8a8a9a"/>`,`<rect x="${x+30}" y="${G-120}" width="50" height="60" fill="#6a3a5a"/>`,skull(x+55,G-70,1.2)][[140,420,700,980].indexOf(x)]; }
   return {s:s+portrait(540,60),x0:280,x1:960}; },
 7:(r)=>({s:room(r,PAL.green,{rug:[380,820],rugC:'#2a3a2a'})+frame(160,70,220,130,'#d8c89a')+`<path d="M180 100 h60 v40 h60 v30 h-80 M200 80 v60" stroke="#6a5a3a" stroke-width="3" fill="none"/>`+frame(820,70,220,130,'#d8c89a')+`<path d="M840 110 q40 -30 80 0 t80 0 M860 160 h120" stroke="#6a5a3a" stroke-width="3" fill="none"/>`+table(480,240,'#3a2414')+`<path d="M500 ${G-94} l40 -10 l60 6 l50 -8 l40 8 Z" fill="#d8c89a"/>`+`<circle cx="600" cy="${G-150}" r="40" fill="#5a7aa0" stroke="#c8a04a" stroke-width="5"/><path d="M572 ${G-160} q28 -10 56 6 M570 ${G-140} q30 10 60 0" stroke="#4a6a3a" stroke-width="6" fill="none"/>`,x0:180,x1:1020}),
 8:(r)=>({s:hall(r,PAL.red),x0:280,x1:900}),
 9:(r)=>({s:stairwell(r,PAL.red),x0:480,x1:620}),
 10:(r)=>({s:hall(r,PAL.purple),x0:280,x1:900}),
 11:(r,x)=>{ let s=room(r,PAL.white,{rug:[400,800],rugC:'#d8d4c8'})+windowW(520,70,150,120,{curtain:'#e8e4d8'})+`<rect x="160" y="${G-100}" width="160" height="100" fill="#e8e4d8"/><rect x="880" y="${G-100}" width="160" height="100" fill="#e8e4d8"/>`;
   s+=door(1060,100,{h:170,open:!x.has(39),c:'#d8d0c0'});
   if(x.has(39)) s+=`<path d="M1000 ${G} q-30 -14 0 -26 q40 -14 0 -26 q-30 -12 4 -22" stroke="#4a6a2a" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="1012" cy="${G-80}" rx="18" ry="11" fill="#4a6a2a"/><path d="M1026 ${G-78} l14 -2 l4 -6 M1040 ${G-80} l6 4" stroke="#c0392b" stroke-width="3"/><circle cx="1014" cy="${G-84}" r="3" fill="#ffe04a"/>`;
   return {s,x0:300,x1:900}; },
 12:(r)=>{ let s=room(r,PAL.musty)+cobweb(0,34,1.2)+cobweb(W,34,1.1,1); for(let i=0;i<10;i++) s+=`<ellipse cx="${f0(r()*W)}" cy="${f0(60+r()*150)}" rx="${f0(20+r()*40)}" ry="${f0(10+r()*20)}" fill="#2a3a1e" opacity=".5"/>`;
   return {s:s+table(460,260,'#3a2e1e')+chair(380,'#3a2e1e')+chair(760,'#3a2e1e'),x0:200,x1:1000}; },
 13:(r,x)=>{ let s=room(r,PAL.blue)+glow(600,150,500,160,'#bfe0ff',.18); for(let i=0;i<20;i++) s+=`<path d="M${f0(r()*W)} 34 v${f0(10+r()*24)}" stroke="#d8f0ff" stroke-width="3" opacity=".6"/>`;
   if(x.has(41)) s+=`<rect x="460" y="90" width="280" height="80" fill="#e8e0c8" stroke="#2a180c" stroke-width="6"/><text x="600" y="142" text-anchor="middle" font-family="monospace" font-size="26" fill="#2a1a10">${LBL.sign()}</text>`;
   return {s:s+armchair(200,'#2a3a4a')+armchair(900,'#2a3a4a'),x0:300,x1:880}; },
 14:(r)=>({s:room(r,PAL.murky)+`<rect width="${W}" height="${H}" fill="#060a06" opacity=".45"/>`+sconce(600,120,false)+table(420,340,'#1e1a12')+chair(340,'#1e1a12'),x0:200,x1:1000}),
 15:(r,x)=>{ let s=room(r,PAL.rancid); for(let i=0;i<12;i++) s+=`<ellipse cx="${f0(r()*W)}" cy="${f0(290+r()*90)}" rx="${f0(20+r()*50)}" ry="${f0(5+r()*8)}" fill="#3a2a0a" opacity=".7"/>`;
   for(let i=0;i<6;i++) s+=`<path d="M${f0(100+r()*1000)} ${f0(80+r()*120)} q4 30 -2 60" stroke="#2a200a" stroke-width="10" opacity=".5"/>`;
   return {s:s+door(540,110,{h:190})+`<rect x="160" y="${G-60}" width="100" height="60" fill="#5a4a2a"/><rect x="940" y="${G-80}" width="80" height="80" fill="#4a3a1a"/>`,x0:280,x1:900}; },
 16:(r)=>({s:room(r,PAL.sunny,{rug:[380,820],rugC:'#a05a2a'})+windowW(200,60,170,150,{curtain:'#c89a3a',beam:1})+windowW(820,60,170,150,{curtain:'#c89a3a',beam:1})+armchair(560,'#a06a2a'),x0:180,x1:1020}),
 17:(r)=>({s:room(r,PAL.red,{rug:[300,900]})+sofa(480,'#3a1a30')+windowW(160,70,130,120,{curtain:'#3a1018'})+portrait(900,70),x0:200,x1:1000}),
 18:(r,x)=>{ let s=room(r,PAL.brown); for(const hx of [160,520,980]) s+=`<path d="M${hx-26} 268 Q${hx} 230 ${hx+26} 268Z" fill="#0a0604"/>`;
   for(let i=0;i<8;i++) s+=`<ellipse cx="${f0(80+r()*1040)}" cy="${f0(300+r()*80)}" rx="4" ry="2" fill="#1a1008"/>`;
   if(x.has(28)) s+=`<g transform="translate(600 ${G})">${OBJ[28]()}</g>`;
   return {s:s+cobweb(W,34,.9,1),x0:240,x1:960}; },
 19:(r)=>{ let s=room(r,PAL.red)+`<rect width="${W}" height="${H}" fill="#2a0008" opacity=".25"/>`; for(let i=0;i<9;i++) s+=body(f0(140+i*120+r()*30),f0(G-6-(i%3)*18),f0(-8+r()*16),['#4a4038','#3a3a3a','#5a4a3a'][i%3]);
   for(let i=0;i<5;i++) s+=`<ellipse cx="${f0(r()*W)}" cy="${f0(300+r()*80)}" rx="${f0(30+r()*40)}" ry="8" fill="#5a0a10" opacity=".7"/>`;
   return {s,x0:200,x1:1000}; },
 20:(r)=>({s:room(r,PAL.green,{rug:[420,820],rugC:'#2a3a2a'})+shelf(80,260,5)+`<rect x="460" y="${G-100}" width="280" height="100" fill="#3a2414"/><rect x="450" y="${G-112}" width="300" height="16" fill="#4a2c18"/><rect x="600" y="${G-90}" width="120" height="80" fill="#2a180c"/>`+candelabra(520,G-112)+chair(780)+windowW(900,70,150,120,{curtain:'#1e2e20'}),x0:440,x1:1100}),
 21:(r)=>({s:hall(r,PAL.green,{rug:'#2a3a2a'}),x0:280,x1:900}),
 22:(r)=>({s:stairwell(r,PAL.green),x0:480,x1:620}),
 23:(r)=>({s:hall(r,PAL.brown),x0:280,x1:900}),
 24:(r,x)=>{ let s=room(r,PAL.brown,{plain:1}); for(const cx of [140,420,700,980]){ s+=`<rect x="${cx}" y="${G-170}" width="130" height="170" fill="#140c08"/>`; for(let i=0;i<7;i++) s+=`<path d="M${cx+8+i*19} ${G-170} V${G}" stroke="#8a8a8a" stroke-width="4"/>`; s+=`<rect x="${cx}" y="${G-176}" width="130" height="10" fill="#6a6a6a"/>`; }
   s+=`<circle cx="210" cy="${G-60}" r="5" fill="#ffe04a"/><circle cx="226" cy="${G-60}" r="5" fill="#ffe04a"/><circle cx="1040" cy="${G-110}" r="4" fill="#ff5a4a"/><circle cx="1054" cy="${G-110}" r="4" fill="#ff5a4a"/>`;
   return {s,x0:300,x1:900}; },
 25:(r,x)=>{ let s=room(r,PAL.blue,{plain:1})+`<rect width="${W}" height="${H}" fill="#cfe8ff" opacity=".08"/><path d="M0 70 H${W}" stroke="#8a96a0" stroke-width="8"/>`;
   for(let i=0;i<6;i++){ const hx=120+i*190; s+=`<path d="M${hx} 70 V110 q0 14 -12 14" stroke="#aab4bc" stroke-width="5" fill="none"/><path d="M${hx-40} 124 Q${hx-10} 110 ${hx+30} 126 Q${hx+46} 190 ${hx} 240 Q${hx-50} 200 ${hx-40} 124Z" fill="#a8424a"/><path d="M${hx-26} 150 q20 10 40 0 M${hx-20} 190 q20 10 30 0" stroke="#e8d0d0" stroke-width="5" fill="none"/>`; }
   for(let i=0;i<14;i++) s+=`<path d="M${f0(r()*W)} 34 v${f0(8+r()*20)}" stroke="#d8f0ff" stroke-width="3" opacity=".7"/>`;
   return {s,x0:200,x1:1000}; },
 26:(r,x)=>{ let s=room(r,PAL.grey,{plain:1}); for(let y=60;y<210;y+=30) for(let xx=((y/30)%2)*30;xx<W;xx+=60) s+=`<rect x="${xx}" y="${y}" width="58" height="28" fill="#5a5856" opacity=".35"/>`;
   s+=`<rect x="120" y="${G-140}" width="300" height="140" fill="#1e1e20"/><rect x="140" y="${G-120}" width="120" height="70" fill="#0a0a0a"/>`+glow(200,G-80,80,40,'#ff6a2a',.4)+`<rect x="280" y="${G-120}" width="120" height="70" fill="#2a2a2c"/><rect x="200" y="${G-280}" width="80" height="140" fill="#2a2a2c"/>`;
   s+=`<ellipse cx="200" cy="${G-146}" rx="40" ry="10" fill="#4a4a4a"/><path d="M160 ${G-146} v-30 h80 v30" fill="#3a3a3a"/>`;
   for(let i=0;i<5;i++) s+=`<path d="M${620+i*80} 60 v40" stroke="#3a3a3a" stroke-width="3"/><ellipse cx="${620+i*80}" cy="${116+(i%2)*10}" rx="${20+i*3}" ry="14" fill="#8a6a4a"/>`;
   return {s:s+table(620,380,'#5a4430'),x0:640,x1:980,y:G-90}; },
 27:(r,x)=>{ let s=room(r,PAL.red,{rug:[160,1040],rugC:'#4a1020'})+table(140,920,'#3a2010')+[0,1,2,3,4,5,6].map(i=>chair(200+i*130)).join('');
   s+=`<path d="M600 34 V80" stroke="#c8a04a" stroke-width="4"/>`+candelabra(600,150)+candelabra(380,G-90)+candelabra(820,G-90);
   return {s,x0:220,x1:980,y:G-90}; },
 28:(r,x)=>{ let s=room(r,PAL.red,{rug:[160,1040],rugC:'#4a1020'})+windowW(140,70,110,110,{curtain:'#3a1018'})+windowW(940,70,110,110,{curtain:'#3a1018'});
   if(x.has(31)) s+=table(140,920,'#3a2010')+[0,1,2,3,4,5,6].map(i=>chair(200+i*130)).join('');
   s+=candelabra(500,G-90)+candelabra(720,G-90);
   return {s,x0:220,x1:980,y:G-90}; },
 29:(r)=>{ let s=room(r,PAL.rancid)+`<rect width="${W}" height="${H}" fill="#3a1008" opacity=".3"/>`; for(let i=0;i<10;i++) s+=`<path d="M${f0(r()*W)} 34 q${f0(-10+r()*20)} ${f0(30+r()*60)} 0 ${f0(70+r()*90)}" stroke="#6a0a10" stroke-width="${f0(4+r()*6)}" fill="none" opacity=".7"/>`;
   s+=table(420,360,'#2a180c')+`<ellipse cx="600" cy="${G-96}" rx="150" ry="14" fill="#7a2a2a"/><path d="M480 ${G-100} q60 -30 120 -4 q60 -26 110 6" fill="#8a3a3a"/>`;
   for(let i=0;i<14;i++) s+=`<circle cx="${f0(500+r()*200)}" cy="${f0(G-150-r()*80)}" r="2" fill="#0a0a0a"/>`;
   return {s,x0:160,x1:1040}; },
 30:(r,x)=>{ let s=room(r,PAL.red,{rug:[320,880],rugC:'#2a1040'}); s+=`<path d="M120 40 V220 L180 200 L240 220 V40Z" fill="#2a1040"/><path d="M960 40 V220 L1020 200 L1080 220 V40Z" fill="#2a1040"/>`;
   for(const fx of [180,1020]) s+=`<path d="M${fx-30} 90 l30 -30 l30 30 l-30 30Z" fill="#c8a04a"/><circle cx="${fx}" cy="90" r="10" fill="#7a1020"/>`;
   if(x.has(1)) s+=`<rect x="330" y="80" width="540" height="110" fill="#d8ccb0" stroke="#3a2a1a" stroke-width="6"/><text x="600" y="128" text-anchor="middle" font-family="monospace" font-size="26" fill="#3a1a10">${LBL.writ1()}</text><text x="600" y="166" text-anchor="middle" font-family="monospace" font-size="26" fill="#3a1a10">${LBL.writ2()}</text>`;
   return {s:s+armchair(520,'#2a1040'),x0:300,x1:900}; },
 // la galerie des glaces : des miroirs partout, des reflets à l'infini
 31:(r)=>{ let s=`<rect width="${W}" height="${H}" fill="#1a1e2a"/>`; for(let i=0;i<7;i++){ const mx=20+i*168; s+=`<rect x="${mx}" y="30" width="150" height="250" rx="70" fill="#a8b8c8" stroke="#c8a04a" stroke-width="7"/>`;
     for(let k=1;k<5;k++) s+=`<rect x="${f0(mx+75-75*(1-k*.18))}" y="${f0(155-125*(1-k*.18))}" width="${f0(150*(1-k*.18))}" height="${f0(250*(1-k*.18))}" rx="${f0(70*(1-k*.18))}" fill="none" stroke="#c8a04a" stroke-width="3" opacity="${(.6-k*.1).toFixed(2)}"/>`;
     s+=`<path d="M${mx+30} 60 L${mx+60} 40 M${mx+24} 100 L${mx+80} 56" stroke="#fff" stroke-width="4" opacity=".4"/>`; }
   const [fu,fd]=grad(['#2a2a3a','#0e0e18']); s+=fd+`<path d="M0 280 H${W} V${H} H0Z" fill="${fu}"/>`;
   for(let i=0;i<8;i++) s+=`<path d="M${i*170} 280 L${i*170-60} ${H}" stroke="#4a4a6a" stroke-width="2"/>`;
   return {s:s+glow(600,200,500,180,'#c8d8ff',.15),x0:200,x1:1000}; },
 32:(r,x)=>{ let s=room(r,PAL.green,{rug:[380,820],rugC:'#2a2a1a'}); for(let i=0;i<7;i++){ const gx=170+i*40; s+=`<path d="M${gx} 80 L${gx+6} 230" stroke="#3a2414" stroke-width="10"/><path d="M${gx+1} 80 l4 -30" stroke="#5a5a5a" stroke-width="5"/>`; }
   s+=`<rect x="150" y="70" width="300" height="14" fill="#2a180c"/><rect x="150" y="230" width="300" height="14" fill="#2a180c"/>`;
   s+=`<path d="M760 120 l80 -40 l10 14 l-80 40Z M900 110 l90 0 v14 h-90Z" fill="#4a4a4a"/>`+frame(760,160,260,60,'#5a1a1a');
   return {s:s+table(480,240,'#3a2414'),x0:480,x1:720,y:G-90}; },
 33:(r,x)=>{ let s=room(r,PAL.brown,{plain:1}); s+=`<rect x="160" y="${G-110}" width="460" height="24" fill="#8a6a42"/><rect x="180" y="${G-86}" width="20" height="86" fill="#5a3a22"/><rect x="580" y="${G-86}" width="20" height="86" fill="#5a3a22"/>`;
   s+=`<rect x="160" y="90" width="460" height="120" fill="#5a4030"/>`; for(let i=0;i<8;i++) s+=`<circle cx="${190+i*55}" cy="110" r="5" fill="#2a1a10"/><path d="M${190+i*55} 115 v${30+(i%3)*14}" stroke="#8a8a8a" stroke-width="${4+(i%2)*4}"/>`;
   s+=`<path d="M720 ${G} L760 ${G-40} H900 L940 ${G}" fill="#a87a4a"/>`;
   for(let i=0;i<20;i++) s+=`<path d="M${f0(r()*W)} ${f0(290+r()*90)} l${f0(4+r()*10)} 2" stroke="#d8b080" stroke-width="2"/>`;
   return {s,x0:220,x1:600,y:G-110}; },
 34:(r,x)=>{ let s=room(r,PAL.brown,{plain:1}); for(let j=0;j<4;j++) for(let i=0;i<7;i++){ const lx=120+i*60+(j%2)*30, ly=G-24-j*44; s+=`<circle cx="${lx}" cy="${ly}" r="22" fill="#8a6a42" stroke="#5a3a22" stroke-width="4"/><circle cx="${lx}" cy="${ly}" r="10" fill="none" stroke="#6a4a2a" stroke-width="2"/>`; }
   for(let i=0;i<8;i++) s+=`<rect x="${800+i*34}" y="${G-200+(i%3)*20}" width="18" height="${200-(i%3)*20}" fill="#a87a4a" stroke="#6a4a2a" stroke-width="2"/>`;
   return {s,x0:560,x1:780}; },
 35:(r,x)=>{ let s=room(r,PAL.purple,{plain:1}); s+=`<path d="M520 220 V70 Q600 0 680 70 V220Z" fill="#1a1028"/>`;
   const cols=['#a01828','#2848a0','#c8a03a','#2a8a4a']; for(let i=0;i<12;i++) s+=`<rect x="${530+(i%4)*36}" y="${80+Math.floor(i/4)*44}" width="32" height="40" fill="${cols[(i*3)%4]}" opacity=".85"/>`;
   s+=glow(600,150,200,140,'#ffe0a0',.25)+`<rect x="460" y="${G-100}" width="280" height="100" fill="#d8d0c0"/><rect x="450" y="${G-110}" width="300" height="14" fill="#a8803a"/>`+candelabra(510,G-110)+candelabra(690,G-110);
   for(let i=0;i<3;i++) s+=`<rect x="${120+i*30}" y="${G-60}" width="250" height="14" fill="#3a2414" transform="skewX(-10)"/><rect x="${850+i*30}" y="${G-60}" width="250" height="14" fill="#3a2414" transform="skewX(10)"/>`;
   return {s,x0:480,x1:720,y:G-110}; },
 36:(r)=>{ const [u,d]=grad(SKY[sky()]); let s=room(r,PAL.grey)+d+`<path d="M300 0 H900 L840 120 H360Z" fill="${u}"/>`; for(let i=1;i<6;i++) s+=`<path d="M${300+i*100} 0 L${360+i*80} 120" stroke="#1a1418" stroke-width="6"/>`;
   s+=`<path d="M300 0 L360 120 H840 L900 0" stroke="#1a1418" stroke-width="10" fill="none"/>`+(sky()==='night'?moon(700,50,20):'')+`<path d="M360 120 L280 ${H} H920 L840 120Z" fill="${sky()==='night'?'#8a9ac8':'#fff4c0'}" opacity=".1"/>`;
   return {s:s+cobweb(0,34,.9),x0:300,x1:900}; },
 37:(r)=>({s:stairwell(r,PAL.purple),x0:480,x1:620}),
 38:(r)=>{ const [u,d]=grad(SKY[sky()]); let s=room(r,PAL.grey)+d+`<path d="M300 0 H900 L840 120 H360Z" fill="${u}"/>`; for(let i=1;i<6;i++) s+=`<path d="M${300+i*100} 0 L${360+i*80} 120" stroke="#1a1418" stroke-width="6"/>`;
   s+=`<path d="M300 0 L360 120 H840 L900 0" stroke="#1a1418" stroke-width="10" fill="none"/>`+(sky()==='night'?moon(480,60,20):'')+`<path d="M360 120 L280 ${H} H920 L840 120Z" fill="${sky()==='night'?'#8a9ac8':'#fff4c0'}" opacity=".1"/>`;
   return {s:s+cobweb(W,34,.9,1),x0:300,x1:900}; },
 39:(r)=>({s:room(r,PAL.brown,{rug:[300,900],rugC:'#5a2a10'})+fireplace(100,1)+armchair(460,'#5a2a10')+armchair(640,'#5a2a10')+shelf(900,220,4)+frame(160,40,120,80,'#3a4a3a'),x0:420,x1:860}),
 40:(r,x)=>{ let s=room(r,PAL.brown,{plain:1}); s+=`<rect x="0" y="0" width="200" height="${H}" fill="#1a0e08"/><rect x="996" y="0" width="200" height="${H}" fill="#1a0e08"/><path d="M200 120 H996" stroke="#8a8a8a" stroke-width="6"/>`;
   for(let i=0;i<7;i++){ const cx=260+i*100; s+=`<path d="M${cx} 120 v10" stroke="#8a8a8a" stroke-width="3"/><path d="M${cx-40} 140 L${cx} 128 L${cx+40} 140 L${cx+34} 260 H${cx-34}Z" fill="${['#3a2a4a','#2a3a2a','#5a2a1a','#2a2a3a'][i%4]}"/>`; }
   return {s:s+`<rect x="200" y="200" width="796" height="12" fill="#3a2414"/>`,x0:320,x1:880}; },
 41:(r)=>({s:room(r,PAL.purple,{rug:[500,900],rugC:'#3a1a40'})+bed(140)+windowW(620,70,140,120,{curtain:'#2a1430'})+`<rect x="900" y="${G-170}" width="160" height="170" fill="#3a2414"/><rect x="910" y="${G-160}" width="66" height="150" fill="#2a180c"/><rect x="984" y="${G-160}" width="66" height="150" fill="#2a180c"/>`,x0:520,x1:880}),
 42:(r)=>({s:room(r,PAL.red,{rug:[500,900]})+bed(740)+windowW(260,70,140,120,{curtain:'#3a1018'})+`<rect x="80" y="${G-120}" width="120" height="120" fill="#3a2414"/>`+candelabra(140,G-120),x0:220,x1:700}),
 43:(r,x)=>{ let s=room(r,PAL.brown,{plain:1}); s+=`<rect x="0" y="0" width="200" height="${H}" fill="#1a0e08"/><rect x="996" y="0" width="200" height="${H}" fill="#1a0e08"/>`;
   for(let j=0;j<3;j++) s+=`<rect x="200" y="${90+j*60}" width="796" height="10" fill="#3a2414"/>`; for(let i=0;i<8;i++) s+=`<rect x="${240+i*90}" y="${60+(i%3)*60}" width="60" height="30" fill="${['#6a5a3a','#4a3a2a','#5a4a5a'][i%3]}"/>`;
   return {s,x0:320,x1:880}; },
 44:(r)=>({s:room(r,PAL.green,{plain:1,rug:[380,820],rugC:'#2a3a2a'})+shelf(40,340,6)+shelf(820,340,6)+`<path d="M400 268 L460 ${G-200} H740 L800 268" fill="none"/>`+shelf(440,320,5,'#2a1a0e')+`<path d="M600 34 V70" stroke="#c8a04a" stroke-width="4"/>`+candelabra(600,110),x0:420,x1:780}),
 45:(r,x)=>{ let s=`<rect width="${W}" height="${H}" fill="#1e1610"/>`; for(let i=0;i<7;i++) s+=`<path d="M${i*200-100} 0 L${i*200+100} 260" stroke="#3a2a1a" stroke-width="18"/><path d="M${i*200+300} 0 L${i*200+100} 260" stroke="#3a2a1a" stroke-width="18"/>`;
   s+=`<path d="M0 60 H${W}" stroke="#4a3420" stroke-width="20"/>`+cobweb(0,0,1.4)+cobweb(W,0,1.3,1)+glow(600,40,200,80,'#c8d0e0',.18)+`<rect x="560" y="10" width="80" height="50" fill="${SKY[sky()][0]}"/>`;
   const [fu,fd]=grad(['#3a2a1a','#1a120a']); s+=fd+`<path d="M0 260 H${W} V${H} H0Z" fill="${fu}"/>`; for(let i=0;i<12;i++) s+=`<path d="M0 ${270+i*12} H${W}" stroke="#140c06" stroke-width="2" opacity=".5"/>`;
   if(x.has(11)) s+=`<rect x="760" y="${G-90}" width="200" height="90" fill="#5a3a1a" stroke="#2a180c" stroke-width="5"/>`+(x.has(108)?`<path d="M760 ${G-90} L780 ${G-170} H980 L960 ${G-90}Z" fill="#4a2c14" stroke="#2a180c" stroke-width="5"/>`:`<path d="M756 ${G-90} Q860 ${G-130} 964 ${G-90}Z" fill="#6a4a22" stroke="#2a180c" stroke-width="5"/><rect x="850" y="${G-74}" width="20" height="22" fill="#c8a04a"/>`)+`<path d="M760 ${G-60} H960 M760 ${G-30} H960" stroke="#c8a04a" stroke-width="4"/>`;
   s+=`<rect x="140" y="${G-60}" width="120" height="60" fill="#3a2a1a"/><rect x="300" y="${G-40}" width="80" height="40" fill="#4a3a2a"/><path d="M160 ${G-60} q40 -30 80 0" fill="#d8d0c0" opacity=".3"/>`;
   return {s,x0:420,x1:720}; },
 // la cave
 46:(r,x)=>({s:cellar(r,{torch:900})+stairs(160,1).replace(/#4a2c18/g,'#4a443c').replace(/#5a3a22/g,'#5a544a'),x0:520,x1:760}),
 47:(r,x)=>{ let s=cellar(r,{torch:1000}); for(let i=0;i<60;i++){ const wx=40+r()*1120, wy=270+r()*120; s+=`<path d="M${f0(wx)} ${f0(wy)} q8 -6 16 0 t16 0" stroke="#c87a7a" stroke-width="4" fill="none"/>`; }
   return {s,x0:200,x1:900}; },
 48:(r,x)=>{ let s=cellar(r,{torch:200}); s+=`<rect x="460" y="70" width="280" height="190" fill="#4a4e52" stroke="#2a2e30" stroke-width="6"/><rect x="480" y="90" width="240" height="40" fill="#2a2e30"/>`;
   s+=`<text x="600" y="120" text-anchor="middle" font-family="monospace" font-size="24" fill="#d8d0b0">${LBL.switch()}</text>`;
   const on=x.has(104); s+=`<rect x="560" y="150" width="80" height="90" fill="#1a1e20"/><path d="M576 230 L${on?624:600} ${on?240:160}" stroke="#c8ccd0" stroke-width="10" stroke-linecap="round"/><circle cx="576" cy="230" r="8" fill="#8a8e92"/><rect x="${on?612:586}" y="${on?236:150}" width="28" height="14" fill="#2a1a10"/>`;
   for(const cx of [480,720]) s+=`<path d="M${cx} 70 V0" stroke="#1a1a1a" stroke-width="10"/>`;
   return {s,x0:780,x1:1100}; },
 49:(r,x)=>({s:cellar(r)+torch(600,110,true),x0:200,x1:1000}),
 50:(r)=>({s:room(r,PAL.brown,{plain:1})+`<rect x="440" y="${G-80}" width="320" height="80" fill="#3a2414"/>`+cobweb(0,34,1)+windowW(540,70,120,100),x0:300,x1:900}),
 51:(r,x)=>{ let s=room(r,PAL.grey,{plain:1}); for(let j=0;j<3;j++) s+=`<rect x="100" y="${80+j*60}" width="1000" height="10" fill="#3a2414"/>`;
   for(let i=0;i<18;i++) s+=`<rect x="${120+i*54}" y="${50+(i%3)*60}" width="${30+(i%4)*6}" height="${30-(i%3)*4}" fill="${['#6a5a3a','#4a5a6a','#8a7a5a','#5a3a2a'][i%4]}" transform="translate(0 ${(i%3)*0})"/>`;
   s+=`<path d="M480 300 L720 300 L760 360 L440 360Z" fill="${x.has(112)?'#050304':'#4a2c18'}" stroke="#2a180c" stroke-width="5"/>`+(x.has(112)?`<path d="M480 300 L520 210 H760 L720 300Z" fill="#5a3a22" stroke="#2a180c" stroke-width="5"/><path d="M560 320 v40 M640 320 v40 M560 335 h80 M560 350 h80" stroke="#6a4a2a" stroke-width="5"/>`:`<circle cx="600" cy="330" r="8" fill="none" stroke="#c8a04a" stroke-width="4"/>`);
   s+=`<rect x="140" y="${G-70}" width="90" height="70" fill="#5a4026"/><rect x="900" y="${G-90}" width="120" height="90" fill="#5a4026"/><path d="M900 ${G-90} l120 90 M1020 ${G-90} l-120 90" stroke="#3a2414" stroke-width="5"/>`;
   return {s,x0:240,x1:880}; },
 52:(r,x)=>{ let s=cellar(r); s+=glow(600,330,360,80,'#a04aff',.4)+`<ellipse cx="600" cy="330" rx="260" ry="50" fill="none" stroke="#c88aff" stroke-width="4"/>`;
   const pts=[0,1,2,3,4].map(i=>[600+Math.cos(-Math.PI/2+i*4*Math.PI/5)*240, 330+Math.sin(-Math.PI/2+i*4*Math.PI/5)*44]); s+=`<path d="M${pts.map(p=>f0(p[0])+' '+f0(p[1])).join(' L')}Z" fill="none" stroke="#c88aff" stroke-width="3"/>`;
   s+=`<rect x="140" y="100" width="260" height="10" fill="#3a2414"/><rect x="800" y="100" width="260" height="10" fill="#3a2414"/>`;
   for(let i=0;i<5;i++) s+=`<path d="M${160+i*50} 100 v-30 q-12 -6 0 -20 h12 q12 14 0 20 v30" fill="${['#4a8aff','#ff5a8a','#5ad88a','#ffd84a','#c88aff'][i]}" opacity=".85"/>`;
   for(let i=0;i<4;i++) s+=candelabra(380+i*150,G-60,true).replace(/#c8a04a/g,'#6a6a6a');
   return {s,x0:300,x1:900}; },
 53:(r,x)=>{ let s=cellar(r); for(let i=0;i<8;i++) s+=`<ellipse cx="${f0(100+r()*1000)}" cy="${f0(80+r()*180)}" rx="${f0(120+r()*120)}" ry="${f0(30+r()*30)}" fill="#d8d04a" opacity=".12"/>`;
   for(let i=0;i<5;i++) s+=`<path d="M${200+i*200} ${G} q-30 -10 -20 -40 q20 -20 40 0 q10 30 -20 40Z" fill="#c8b83a"/>`;
   return {s:s+`<rect width="${W}" height="${H}" fill="#a0901a" opacity=".1"/>`,x0:300,x1:900}; },
 54:(r,x)=>{ let s=cellar(r); for(let j=0;j<3;j++) s+=`<rect x="80" y="${70+j*60}" width="1040" height="12" fill="#2a2420"/>`;
   for(let j=0;j<3;j++) for(let i=0;i<13;i++) s+=skull(110+i*80+(j%2)*20,64+j*60,.9);
   for(let i=0;i<12;i++) s+=bone(f0(100+r()*1000),f0(G-10+r()*40),f0(r()*180));
   return {s,x0:300,x1:900}; },
 55:(r,x)=>{ let s=cellar(r); for(let i=0;i<14;i++){ const sx=r()*W; s+=`<path d="M${f0(sx)} 0 q${f0(-6+r()*12)} ${f0(40+r()*60)} 0 ${f0(80+r()*140)}" stroke="#5aa03a" stroke-width="${f0(6+r()*10)}" fill="none" opacity=".7"/>`; }
   s+=`<path d="M0 300 Q300 280 600 300 T${W} 296 V${H} H0Z" fill="#3a6a2a" opacity=".6"/>`;
   for(let i=0;i<40;i++) s+=`<ellipse cx="${f0(r()*W)}" cy="${f0(290+r()*100)}" rx="5" ry="2.5" fill="#e8e0c8"/>`;
   return {s,x0:300,x1:900}; },
 56:(r,x)=>{ let s=cellar(r)+`<rect width="${W}" height="${H}" fill="#3a0008" opacity=".25"/>`; s+=`<path d="M540 260 V100 h120 V260" fill="#1a1410"/>`+skull(600,160,2.4);
   for(let i=0;i<6;i++) s+=`<path d="M${f0(150+i*170)} ${f0(G-40)} q10 -40 0 -80 l20 0 q10 40 0 80Z" fill="#c8c0b0"/><path d="M${f0(150+i*170)} ${f0(G-120)} l-14 -20 M${f0(150+i*170)+20} ${f0(G-120)} l14 -20 M${f0(150+i*170)+10} ${f0(G-120)} v-24" stroke="#c8c0b0" stroke-width="6"/>`;
   return {s,x0:300,x1:900}; },
 57:(r,x)=>{ let s=cellar(r); for(let i=0;i<6;i++) s+=`<path d="M${120+i*190} 0 V${180+(i%3)*40}" stroke="#3a2a14" stroke-width="26"/><path d="M${110+i*190} ${170+(i%3)*40} l10 30 l10 -20 l10 26" stroke="#3a2a14" stroke-width="8" fill="none"/>`;
   for(let i=0;i<10;i++) s+=`<rect x="${f0(r()*W)}" y="${f0(G-10+r()*40)}" width="${f0(60+r()*80)}" height="12" fill="#3a2a14" transform="rotate(${f0(-20+r()*40)} 600 330)"/>`;
   return {s:s+`<rect width="${W}" height="${H}" fill="#2a3a10" opacity=".12"/>`,x0:300,x1:900}; },
 58:(r,x)=>{ let s=cellar(r); s+=`<path d="M700 0 L760 120 L720 260 H1196 V0Z" fill="#0a0806"/>`; for(let i=0;i<20;i++){ const bx=r()*W, by=G-r()*60; s+=`<path d="M${f0(bx)} ${f0(by)} l${f0(20+r()*40)} -${f0(10+r()*30)} l${f0(20+r()*30)} ${f0(10+r()*40)}Z" fill="${r()<.5?'#3a332c':'#2a241e'}"/>`; }
   return {s,x0:200,x1:680}; },
 59:(r,x)=>{ let s=cellar(r,{torch:1060}); s+=`<path d="M160 ${G} V${G-110} L240 ${G-170} L320 ${G-110} V${G}Z" fill="#3a2a1a" stroke="#1a120a" stroke-width="5"/><path d="M200 ${G} V${G-70} Q240 ${G-110} 280 ${G-70} V${G}Z" fill="#0a0806"/>`;
   s+=`<ellipse cx="560" cy="${G+10}" rx="40" ry="10" fill="#6a6a6a"/><path d="M600 ${G-60} q60 -20 140 0" stroke="#4a4a4a" stroke-width="6" fill="none"/>`;
   if(x.has(21)) s+=`<g transform="translate(800 ${G})">${OBJ[21]()}</g>`;
   return {s,x0:360,x1:720}; },
 60:(r)=>({s:`<rect width="${W}" height="${H}" fill="#030204"/>`+glow(600,200,500,160,'#3a1a4a',.3)+`<circle cx="420" cy="180" r="4" fill="#ff3a3a"/><circle cx="436" cy="180" r="4" fill="#ff3a3a"/><circle cx="880" cy="230" r="3" fill="#ffe04a"/><circle cx="892" cy="230" r="3" fill="#ffe04a"/>`,x0:300,x1:900}),
 // l'antre du loup-garou
 61:(r,x)=>{ let s=cellar(r); for(let i=0;i<5;i++) s+=`<path d="M${200+i*200} 60 l40 110 M${215+i*200} 60 l40 110 M${230+i*200} 60 l40 110" stroke="#0a0806" stroke-width="5"/>`;
   for(let i=0;i<10;i++) s+=bone(f0(80+r()*1040),f0(G+r()*40),f0(r()*180));
   if(x.has(22)){ if(x.has(101)) s+=`<g transform="translate(560 ${G+20}) rotate(-4)"><ellipse cx="0" cy="-20" rx="140" ry="32" fill="#4a3a2a"/><ellipse cx="-150" cy="-30" rx="40" ry="28" fill="#4a3a2a"/><path d="M-180 -50 l-10 -30 l20 20 M-150 -54 l0 -30 l14 24" fill="#4a3a2a"/><path d="M120 -30 q60 -30 90 10" stroke="#4a3a2a" stroke-width="18" fill="none"/><circle cx="-20" cy="-30" r="10" fill="#8a1018"/><ellipse cx="0" cy="10" rx="120" ry="10" fill="#6a0a10" opacity=".7"/></g>`;
     else s+=`<g transform="translate(620 ${G})"><path d="M-70 0 L-50 -120 Q-60 -170 -20 -190 L20 -190 Q60 -170 50 -120 L70 0 H30 L20 -80 H-20 L-30 0Z" fill="#4a3a2a"/><path d="M-50 -150 L-120 -90 L-110 -70 L-40 -120 M50 -150 L120 -90 L110 -70 L40 -120" fill="#4a3a2a" stroke="#4a3a2a" stroke-width="20" stroke-linejoin="round"/><path d="M-120 -90 l-10 14 l6 4 l8 -12 M120 -90 l10 14 l-6 4 l-8 -12" stroke="#e8e0c8" stroke-width="3"/><ellipse cx="0" cy="-210" rx="42" ry="34" fill="#4a3a2a"/><path d="M-36 -230 l-10 -40 l24 26 M36 -230 l10 -40 l-24 26" fill="#4a3a2a"/><path d="M-10 -196 L0 -168 L10 -196" fill="#2a1a10"/><path d="M-20 -186 h40 l-6 14 h-28Z" fill="#a01818"/><path d="M-14 -186 l3 8 l3 -8 M6 -186 l3 8 l3 -8" fill="#fff"/><circle cx="-16" cy="-216" r="6" fill="#ffd84a"/><circle cx="16" cy="-216" r="6" fill="#ffd84a"/></g>`; }
   return {s,x0:220,x1:420}; },
 // la sous-cave
 62:(r,x)=>{ let s=rock(r); s+=`<path d="M560 0 V${H} M680 0 V${H}" stroke="#6a4a2a" stroke-width="14"/>`; for(let y=20;y<H;y+=44) s+=`<path d="M560 ${y} H680" stroke="#6a4a2a" stroke-width="10"/>`;
   s+=glow(620,0,200,80,'#c8c0a0',.2);
   return {s,x0:200,x1:500}; },
 63:(r,x)=>({s:rock(r)+arch(500,200,220,'#050404')+glow(600,40,180,80,'#c8d8e8',.22)+`<path d="M560 140 q40 -20 80 0" stroke="#c8d8e8" stroke-width="3" opacity=".4" fill="none"/>`,x0:180,x1:460}),
 64:(r)=>{ let s=rock(r,{c1:'#2a1e1e'}); for(let i=0;i<14;i++) s+=body(f0(60+r()*1080),f0(G-20+r()*60),f0(-30+r()*60),['#4a4038','#3a3a3a','#5a4a3a','#2a2a2e'][i%4]); return {s,x0:300,x1:900}; },
 65:(r,x)=>{ let s=rock(r); s+=`<ellipse cx="760" cy="330" rx="300" ry="60" fill="#000"/><ellipse cx="760" cy="322" rx="300" ry="52" fill="none" stroke="#3a3028" stroke-width="10"/>`;
   if(x.has(67)) s+=`<path d="M220 ${G} V${G-110}" stroke="#4a2c18" stroke-width="12"/><rect x="120" y="${G-180}" width="200" height="80" fill="#d8ccb0" stroke="#3a2a1a" stroke-width="5"/><text x="220" y="${G-130}" text-anchor="middle" font-family="monospace" font-size="15" fill="#3a1a10">${LBL.pit()}</text>`;
   return {s,x0:120,x1:420}; },
 66:(r)=>{ let s=rock(r,{c1:'#1e1a22'}); for(let i=0;i<46;i++){ const bx=r()*W, by=20+r()*230, k=.4+r()*.7; s+=`<path transform="translate(${f0(bx)} ${f0(by)}) scale(${k.toFixed(2)})" d="M0 0 q-14 -16 -34 -10 q8 6 4 12 q-10 0 -16 8 q20 -2 30 6 q4 -8 16 -8 q12 0 16 8 q10 -8 30 -6 q-6 -8 -16 -8 q-4 -6 4 -12 q-20 -6 -34 10Z" fill="#0a080c"/>`; }
   return {s,x0:300,x1:900}; },
 67:(r)=>({s:rock(r,{c1:'#22262a'})+glow(300,180,300,120,'#4a8a6a',.15)+glow(900,140,260,100,'#4a6a8a',.15)+`<path d="M0 200 Q300 170 600 210 T${W} 190" stroke="#c8d8d0" stroke-width="40" opacity=".05" fill="none"/>`,x0:200,x1:1000}),
 68:(r)=>({s:rock(r)+stairs(700,0).replace(/#4a2c18/g,'#3a342c').replace(/#5a3a22/g,'#4a443a'),x0:160,x1:620}),
 69:(r)=>({s:rock(r,{c1:'#26222a'})+glow(600,200,400,120,'#6a4a8a',.15)+`<path d="M0 200 Q300 170 600 210 T${W} 190" stroke="#c8c0d8" stroke-width="40" opacity=".05" fill="none"/>`,x0:200,x1:1000}),
 70:(r)=>{ let s=rock(r,{f1:'#3a3a26',f2:'#1a1a10'}); for(let i=0;i<6;i++) s+=`<ellipse cx="${f0(r()*W)}" cy="${f0(250+r()*60)}" rx="${f0(200+r()*200)}" ry="20" fill="#c8d0c0" opacity=".1"/>`;
   s+=`<path d="M0 360 Q300 340 600 356 T${W} 350 V${H} H0Z" fill="#6a5a3a"/>`; for(let i=0;i<6;i++) s+=`<path d="M${f0(100+r()*1000)} 300 l-6 -30 l6 10 l6 -16 l2 36" fill="#4a4a2a"/>`;
   return {s,x0:200,x1:1000,y:G-10}; },
 71:(r)=>{ let s=rock(r,{f1:'#7a6a42',f2:'#4a3e22'}); s+=`<ellipse cx="600" cy="340" rx="560" ry="70" fill="#8a7a4a"/>`; for(let i=0;i<8;i++) s+=`<ellipse cx="600" cy="340" rx="${560-i*60}" ry="${70-i*7}" fill="none" stroke="#6a5a32" stroke-width="3" opacity=".6"/>`;
   s+=`<path d="M560 330 q20 -40 40 0 M620 334 q10 -30 30 -6" stroke="#2a2a3a" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M640 300 l14 -30 M650 296 l20 -20" stroke="#d8b8a0" stroke-width="6"/>`;
   return {s,x0:200,x1:1000,y:G+10}; },
 72:(r,x)=>{ let s=rock(r,{c1:'#2a1a1e'}); for(let i=0;i<8;i++){ const vx=90+i*134; s+=`<rect x="${vx}" y="${G-150}" width="110" height="150" rx="10" fill="#5a5e62" stroke="#2a2e30" stroke-width="5"/><rect x="${vx+10}" y="${G-110}" width="90" height="100" rx="6" fill="#6a0a14"/><rect x="${vx+10}" y="${G-110}" width="90" height="20" fill="#8a1018"/>`;
     s+=`<rect x="${vx+20}" y="${G-140}" width="70" height="22" fill="#e8e0c8"/><text x="${vx+55}" y="${G-123}" text-anchor="middle" font-family="monospace" font-size="16" fill="#2a1a10">${['A+','O-','B-','AB+','O+','A-','AB-','B+'][i]}</text>`; }
   return {s,x0:200,x1:1000,y:G+30}; },
 73:(r,x)=>{ let s=rock(r,{c1:'#2a2626'}); s+=`<path d="M600 0 L590 120 L610 180 L596 260" stroke="#0a0808" stroke-width="5" fill="none"/>`;
   for(const sx of [300,900]) s+=`<path d="M${sx-40} 120 q40 60 80 0" stroke="#7a7a7a" stroke-width="7" fill="none"/><circle cx="${sx-40}" cy="120" r="10" fill="none" stroke="#7a7a7a" stroke-width="6"/><circle cx="${sx+40}" cy="120" r="10" fill="none" stroke="#7a7a7a" stroke-width="6"/>`;
   if(x.has(52)) s+=`<g transform="translate(900 ${G})"><path d="M-30 0 L-20 -90 Q0 -100 20 -90 L30 0Z" fill="#c8b8d8"/><circle cx="0" cy="-110" r="18" fill="#f0e0d0"/><path d="M-20 -116 q20 -26 40 0 v20 q-6 -14 -20 -16 q-14 2 -20 16Z" fill="#6a3a1a"/><path d="M-20 -86 L-40 -122 M20 -86 L40 -122" stroke="#f0e0d0" stroke-width="8"/></g>`;
   if(x.has(117)) s+=`<path d="M560 ${G} q40 -30 80 0" stroke="#7a7a7a" stroke-width="8" fill="none"/>`;
   return {s,x0:220,x1:700}; },
 // la salle de l'acide : l'acide bouillonne jusqu'à ce que le bicarbonate le calme
 74:(r,x)=>{ let s=rock(r); const calm=x.has(107); s+=`<path d="M0 270 Q300 250 600 266 T${W} 260 V${H} H0Z" fill="${calm?'#5a6a5a':'#4adf3a'}" opacity="${calm?.8:.85}"/>`;
   if(!calm){ s+=glow(600,320,600,90,'#8aff4a',.3); for(let i=0;i<30;i++) s+=`<circle cx="${f0(r()*W)}" cy="${f0(280+r()*110)}" r="${f0(3+r()*8)}" fill="none" stroke="#c8ff8a" stroke-width="2"/>`;
     for(let i=0;i<6;i++) s+=`<ellipse cx="${f0(r()*W)}" cy="${f0(200+r()*60)}" rx="${f0(80+r()*80)}" ry="20" fill="#aaff8a" opacity=".1"/>`; }
   s+=`<g transform="translate(40 150) scale(.42)">${coffin(0,0)}${casketBox(380,0)}</g>`;   // de l'autre côté de l'acide, à l'ouest
   return {s,x0:820,x1:1100,y:G+30}; },
 // le caveau du vampire
 75:(r,x)=>{ let s=rock(r,{c1:'#1e1418'}); s+=glow(600,250,500,140,'#6a1a2a',.3)+candelabra(180,G,true)+candelabra(1020,G,true);
   s+=coffin(260,x.has(102),x.has(55),x.has(103))+casketBox(680,x.has(106),x.has(63),x.has(113));
   return {s,x0:900,x1:1100}; },
 // la chute dans le puits
 76:(r)=>{ let s=`<rect width="${W}" height="${H}" fill="#050404"/>`; s+=`<path d="M300 0 L420 ${H} M896 0 L776 ${H}" stroke="#2a2420" stroke-width="80"/>`;
   for(let i=0;i<30;i++){ const lx=440+r()*320, ly=r()*H; s+=`<path d="M${f0(lx)} ${f0(ly)} v${f0(30+r()*60)}" stroke="#8a8070" stroke-width="2" opacity=".5"/>`; }
   s+=`<g transform="translate(600 200)"><circle cx="0" cy="-50" r="16" fill="#e8d0b8"/><path d="M-14 -34 L-20 20 L20 20 L14 -34Z" fill="#3a3a5a"/><path d="M-16 -30 L-60 -80 M16 -30 L60 -80 M-12 20 L-30 70 M12 20 L30 70" stroke="#3a3a5a" stroke-width="10" stroke-linecap="round"/></g>`;
   return {s,x0:500,x1:700}; },
 // la grand-place du village : les villageois attendent la princesse
 77:(r,x)=>{ const k=sky(), [u,d]=grad(SKY[k]); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`+(k==='night'?moon(980,60,24):'');
   for(let i=0;i<7;i++){ const hx=-20+i*180, hh=140+(i%3)*30; s+=`<rect x="${hx}" y="${260-hh}" width="160" height="${hh}" fill="${['#c8b89a','#a89878','#b8a88a'][i%3]}"/><path d="M${hx-14} ${264-hh} L${hx+80} ${200-hh} L${hx+174} ${264-hh}Z" fill="#6a2a1a"/>`;
     for(let j=0;j<2;j++) s+=`<rect x="${hx+30+j*70}" y="${280-hh}" width="30" height="36" fill="${k==='day'?'#3a4a5a':'#ffd06a'}"/>`; s+=`<path d="M${hx+20} 260 V${210} M${hx+140} 260 V210" stroke="#4a2a1a" stroke-width="8"/>`; }
   const [fu,fd]=grad(['#7a7060','#4a4438']); s+=fd+`<path d="M0 260 H${W} V${H} H0Z" fill="${fu}"/>`; for(let i=0;i<12;i++) s+=`<path d="M0 ${270+i*12} H${W}" stroke="#3a342a" stroke-width="2" opacity=".4"/>`;
   s+=`<rect x="560" y="${G-80}" width="80" height="80" fill="#8a8a8a"/><path d="M550 ${G-80} H650 M570 ${G-80} V${G-150} M630 ${G-80} V${G-150} M560 ${G-150} H640" stroke="#4a3a2a" stroke-width="8"/>`;
   for(let i=0;i<9;i++){ const px=80+i*120+(i>3?160:0); s+=`<g transform="translate(${px} ${G+20})"><circle cx="0" cy="-74" r="12" fill="#e0c8b0"/><path d="M-16 0 L-12 -62 H12 L16 0Z" fill="${['#5a2a1a','#2a3a5a','#4a5a2a','#6a4a2a'][i%4]}"/>${x.has(63)||x.has(119)?`<path d="M-12 -56 L-26 -96 M12 -56 L26 -96" stroke="${['#5a2a1a','#2a3a5a','#4a5a2a','#6a4a2a'][i%4]}" stroke-width="7" stroke-linecap="round"/>`:''}</g>`; }
   if(x.has(119)) s+=`<g transform="translate(470 ${G+24})">${OBJ[63]()}</g>`;   // la princesse ramenée
   return {s,x0:500,x1:700}; }
};
// textes peints dans les décors : écrits chiffrés (langue de la partie), titres
const LBL={ fr:()=>typeof document!=='undefined'&&document.documentElement.lang==='en'?false:true,
  enc:t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
  writ1(){ return this.enc(this.fr()?mdCipher('POUR TUER'):"@* =[_: ;_%,<(!".slice(0,15)); },
  writ2(){ return this.enc(this.fr()?mdCipher('VAMPIRE DIS LE'):"=_: <@"); },
  switch(){ return this.enc(this.fr()?mdCipher('LUMIERES'):'[<-$@='); },
  sign(){ return this.enc(this.fr()?mdCipher('TEMPS A REBOURS'):'@<%! #_+^\\_(.='); },
  pit(){ return this.enc(this.fr()?mdCipher('C COMME CHUTE'):'. <= )*( .*\\\''); }
};
// objets dessinés par le décor (fixés, trop lourds, ou liés au lieu)
const FIXED=new Set([1,5,9,11,13,14,15,17,18,19,21,22,23,26,28,29,31,33,35,37,38,39,40,41,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,61,62,64,67]);

// ---------- objets ----------
// Chaque dessin a son origine au milieu de sa base.
const book=(c,t)=>`<path d="M-34 -4 L-26 -50 H30 L34 -4Z" fill="${c}" stroke="#1a0e08" stroke-width="3"/><path d="M-34 -4 H34 V2 H-34Z" fill="#e8e0c8"/><path d="M-14 -36 h28 M-10 -26 h20" stroke="#c8a04a" stroke-width="3"/>`;
const OBJ={
 2:()=>`<path d="M-8 0 V-90 M-30 -64 H14" stroke="#c8ccd4" stroke-width="12" stroke-linecap="square" transform="translate(4 0)"/><path d="M-4 -86 v8" stroke="#fff" stroke-width="3"/>`,
 3:()=>`<rect x="-46" y="-34" width="92" height="34" fill="#c8a878" stroke="#6a4a2a" stroke-width="3"/>`+(X.has(114)?`<path d="M-46 -34 L-40 -60 H52 L46 -34" fill="#b8986a" stroke="#6a4a2a" stroke-width="3"/>`:`<rect x="-50" y="-42" width="100" height="12" fill="#b8986a" stroke="#6a4a2a" stroke-width="3"/>`),
 4:()=>`<rect x="-6" y="-24" width="12" height="18" fill="#c8a04a"/><path d="M-6 -24 Q0 -38 6 -24Z" fill="#d8dce0"/><rect x="-7" y="-6" width="14" height="6" fill="#a8803a"/>`,
 6:()=>`<path d="M-44 -30 H30 V-18 H-30 L-38 0 H-54 L-44 -30Z" fill="#3a3a3e"/><rect x="-10" y="-40" width="40" height="12" fill="#4a4a4e"/><path d="M-28 -18 q4 10 12 6" stroke="#3a3a3e" stroke-width="4" fill="none"/><path d="M-50 -2 L-40 -28" stroke="#6a4a2a" stroke-width="10"/>`,
 7:()=>book('#2a4a6a'),
 8:()=>`<path d="M-50 -10 L46 -18 L64 -12 L46 -6 L-50 -2Z" fill="#a87a4a" stroke="#6a4a2a" stroke-width="3"/>`,
 10:()=>book('#5a1a28'),
 12:()=>`<ellipse cx="0" cy="-10" rx="12" ry="9" fill="#e8e0b0"/><circle cx="2" cy="-10" r="5" fill="#2a6a2a"/><circle cx="3" cy="-11" r="2" fill="#000"/>`,
 15:()=>`<path d="M-4 0 L4 0 L6 -60 H-6Z" fill="#4a2c18"/><path d="M0 -84 q14 14 6 24 h-12 q-8 -10 6 -24Z" fill="#ff9a3a"/>`,
 16:()=>`<path d="M-30 0 Q-36 -24 -10 -30 Q14 -36 30 -16 Q36 0 20 0Z" fill="#d8c83a"/><path d="M-14 -14 q10 -6 18 0" stroke="#a8982a" stroke-width="3" fill="none"/>`,
 20:()=>`<path d="M-34 0 Q-40 -40 -20 -56 L-14 -66 L14 -66 L20 -56 Q40 -40 34 0Z" fill="#c8b48a" stroke="#8a744a" stroke-width="3"/><path d="M-16 -60 h32" stroke="#6a4a2a" stroke-width="5"/>`,
 21:()=>`<ellipse cx="0" cy="-16" rx="64" ry="16" fill="#6a4a2a"/><ellipse cx="-66" cy="-22" rx="20" ry="14" fill="#6a4a2a"/><path d="M-76 -32 l-6 -14 l12 8" fill="#5a3a1a"/><path d="M-40 -4 l-10 4 M40 -4 l10 4 M60 -18 q24 -4 30 10" stroke="#6a4a2a" stroke-width="7" fill="none"/>`,
 24:()=>`<rect x="-4" y="-80" width="10" height="80" fill="#6a4a2a"/><rect x="-34" y="-100" width="70" height="34" rx="6" fill="#8a6a42" stroke="#5a3a22" stroke-width="3"/>`,
 25:()=>`<rect x="-3" y="-50" width="7" height="50" fill="#6a4a2a"/><path d="M-18 -60 H18 V-48 H-18Z" fill="#7a7e84"/><path d="M18 -60 q10 6 8 12" fill="#7a7e84"/>`,
 27:()=>`<circle cx="0" cy="-22" r="20" fill="#c8a04a"/><circle cx="0" cy="-22" r="15" fill="#f0ead8"/><path d="M0 -22 V-34 M0 -22 L8 -18" stroke="#2a1a10" stroke-width="3"/><path d="M-8 -44 q8 -10 16 0" stroke="#c8a04a" stroke-width="4" fill="none"/>`,
 28:()=>`<ellipse cx="0" cy="-12" rx="28" ry="12" fill="#5a5a5a"/><circle cx="-28" cy="-16" r="9" fill="#5a5a5a"/><circle cx="-31" cy="-24" r="4" fill="#8a7a7a"/><circle cx="-32" cy="-17" r="2" fill="#ff3a3a"/><path d="M28 -10 q30 -2 40 -14" stroke="#8a7a7a" stroke-width="3" fill="none"/>`,
 30:()=>`<ellipse cx="0" cy="-16" rx="34" ry="12" fill="#8a7a5a"/><path d="M-30 -20 q-14 -16 -26 -10 l-6 6 l14 4" fill="#8a7a5a"/><circle cx="-54" cy="-24" r="2" fill="#000"/><path d="M32 -14 q30 6 40 24" stroke="#8a7a5a" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-20 -6 v6 M16 -6 v6" stroke="#6a5a3a" stroke-width="5"/>`,
 32:()=>`<path d="M-30 -4 L-22 -40 L28 -34 L30 -2Z" fill="#e8e0c8" stroke="#a8a090" stroke-width="2"/><path d="M-18 -28 h36 M-18 -18 h30" stroke="#3a1a10" stroke-width="3"/>`,
 34:()=>`<path d="M-36 -4 Q-40 -40 0 -44 Q40 -40 36 -4Z" fill="#a8424a"/><path d="M-20 -24 q20 10 40 0" stroke="#e8d0d0" stroke-width="5" fill="none"/>`,
 36:()=>(X.has(110)?'':glow(0,-60,40,40,'#ffcc66',.4)+`<path d="M0 -70 q7 9 0 14 q-7 -5 0 -14Z" fill="#ffb84a"/>`)+`<rect x="-6" y="-54" width="12" height="46" fill="#ece4cc"/><ellipse cx="0" cy="-6" rx="18" ry="6" fill="#a8803a"/>`,
 42:()=>`<rect x="-36" y="-70" width="72" height="70" fill="none" stroke="#a8a8a8" stroke-width="4"/>`+[-24,-12,0,12,24].map(i=>`<path d="M${i} -70 V0" stroke="#a8a8a8" stroke-width="3"/>`).join('')+`<path d="M-40 -74 H40 M-40 0 H40" stroke="#6a6a6a" stroke-width="7"/><path d="M0 -74 v-12" stroke="#6a6a6a" stroke-width="4"/>`+(X.has(111)?`<path d="M36 -60 l24 6 v40 l-24 -6" fill="#1a1a1a" stroke="#a8a8a8" stroke-width="3"/>`:''),
 57:()=>X.has(118)?`<path d="M-24 -4 l10 -14 l8 8 l10 -12 l10 16 Z" fill="#9ac0d0" opacity=".7"/>`:`<path d="M-8 -50 h16 v14 q22 10 18 30 q-4 8 -26 8 q-22 0 -26 -8 q-4 -20 18 -30Z" fill="#7a4aaa" opacity=".9" stroke="#c8a8e8" stroke-width="2"/><rect x="-10" y="-58" width="20" height="10" fill="#8a6a42"/>`,
 59:()=>book('#4a3a1a'),
 63:()=>X.has(113)?`<ellipse cx="0" cy="-4" rx="40" ry="6" fill="#8a8680"/>`:`<path d="M-30 0 L-20 -90 Q0 -100 20 -90 L30 0Z" fill="#e8e0f0"/><circle cx="0" cy="-108" r="16" fill="#f4e8e0"/><path d="M-18 -112 q18 -22 36 0 q6 26 -4 34 M-18 -112 q-6 26 4 34" stroke="#e8c050" stroke-width="7" fill="none"/><path d="M-12 -126 l6 -10 l6 6 l6 -6 l6 10Z" fill="#e8c050"/>`,
 64:()=>`<rect x="-40" y="-30" width="80" height="30" fill="#5a3a1a" stroke="#c8a04a" stroke-width="3"/><rect x="-42" y="-36" width="84" height="10" fill="#6a4a22" stroke="#c8a04a" stroke-width="3"/>`,
 65:()=>`<circle cx="-18" cy="-12" r="10" fill="none" stroke="#c8a04a" stroke-width="5"/><path d="M-8 -12 H26 M18 -12 v8 M24 -12 v6" stroke="#c8a04a" stroke-width="5"/>`,
 66:()=>`<path d="M0 -40 q4 -10 10 -14" stroke="#a8b08a" stroke-width="3" fill="none"/><path d="M0 -40 Q-24 -36 -22 -14 Q-18 0 0 0 Q18 0 22 -14 Q24 -36 0 -40Z" fill="#f0ece0" stroke="#c8c0b0" stroke-width="2"/><path d="M0 -38 v36 M-10 -34 q-4 16 0 32 M10 -34 q4 16 0 32" stroke="#c8c0b0" stroke-width="2" fill="none"/>`
};

function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const k=PLACES[key]?key:String(off+1), n=parseInt(k)||1, r=rng((off+1)*7919+n*131);
  X=new Set(objs);
  const p=(PLACES[k]||PLACES[1])(r,X);
  let s=p.s;
  if(n>=46&&n<=61&&n!==50&&n!==51&&X.has(104)) s+=red();
  const items=objs.filter(i=>OBJ[i]&&!FIXED.has(i)&&!(n===75&&i===63)).sort((a,b)=>a-b);   // dans le caveau, la princesse est dans sa cassette
  const span=p.x1-p.x0, slots=Math.max(4,items.length), base=p.y||G;
  items.forEach((i,j)=>{ const xx=p.x0+span*((j*3+off)%slots+.5)/slots; s+=`<g transform="translate(${f0(xx)} ${base+((i*13)%3)*8})">${OBJ[i]()}</g>`; });
  if(X.has(105)) s=dark(s);
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}${veil()}</svg>`;
}
const DIM={2:[80,100],3:[110,70],6:[110,50],8:[130,30],20:[90,80],21:[180,60],24:[80,110],34:[90,60],36:[60,80],42:[100,100],63:[80,140],64:[100,50],66:[60,60]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[80,60]; return `<svg class="oi" width="${size}" height="${size}" viewBox="${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES,OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
