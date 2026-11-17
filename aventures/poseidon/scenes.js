// S.S. Poseidon — illustrations vectorielles, dans le style des autres aventures : un décor par lieu, d'après sa description.
// Le paquebot est retourné : l'ancien plafond sert de sol (ses plafonniers y sont posés), l'ancien plancher est en haut,
// et le mobilier fixé au plancher pend la tête en bas. Plus on joue de coups, plus l'eau monte au bas de l'image.
// render(clé, lieu, numéros, options) : numéros = objets présents (8 à 32) et éléments de scène (110 et plus, voir aventure.js).
const SCENES=(function(){
const W=1196, H=396, G=326;            // G : ligne du sol où l'on pose les objets
let uid=0;
function rng(seed){ let s=(seed*2654435761+12345)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function grad(stops,dir){ const id='psg'+(uid++); const [x2,y2]=dir==='h'?[1,0]:[0,1];
  return [`url(#${id})`,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`]; }
function glow(cx,cy,rx,ry,c,o){ const id='psl'+(uid++); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o||.55}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`; }
const veil=()=>{ const [u,d]=grad(['rgba(10,16,24,0)','rgba(10,16,24,0)','rgba(10,16,24,.85)']); return d+`<rect width="${W}" height="${H}" fill="${u}"/>`; };
const f0=n=>n.toFixed(0);

// ---------- cloisons, sol (l'ancien plafond), plancher renversé ----------
const PAL={ // cloison haute, cloison basse, joints, sol proche, sol loin, lumière, plancher renversé
  ship:['#4c5a68','#2c3742','#1d252d','#222a32','#36414d','#d8e6f0','#3a3036'],
  luxe:['#6a4250','#3a2230','#26141c','#2a1820','#46283a','#ffd890','#5a2230'],
  dark:['#232a31','#13181d','#0b0e11','#0e1215','#1a2026','#5a6e80','#1a1a1e'],
  engine:['#4e3c30','#2a2018','#1a130e','#20170f','#3a2b20','#ff9a4a','#2a2420'],
  water:['#1e3e58','#0e2236','#0a1828','#0a1a2a','#16304a','#8fd0ff','#14283a']
};
function room(r,p,o){
  o=o||{};
  const [u,d]=grad([p[0],p[1]]); let s=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  // tôles rivetées
  for(let x=-40+r()*60;x<W;x+=150+r()*40){ s+=`<path d="M${f0(x)} 40 V250" stroke="${p[2]}" stroke-width="4" opacity=".75"/>`;
    for(let y=58;y<250;y+=26) s+=`<circle cx="${f0(x+9)}" cy="${y}" r="2.6" fill="${p[2]}" opacity=".8"/><circle cx="${f0(x-9)}" cy="${y}" r="2.6" fill="${p[2]}" opacity=".8"/>`; }
  s+=`<path d="M0 150 H${W}" stroke="${p[2]}" stroke-width="3" opacity=".5"/>`;
  // l'ancien plancher, en haut
  if(!o.noTop){ s+=`<rect width="${W}" height="40" fill="${p[6]}"/><path d="M0 40 H${W}" stroke="${p[2]}" stroke-width="6"/>`;
    if(o.carpet) for(let x=20;x<W;x+=60) s+=`<path d="M${x} 8 l14 12 l-14 12 l-14 -12Z" fill="#c9a24a" opacity=".35"/>`;
    else for(let x=0;x<W;x+=48) s+=`<path d="M${x} 0 V40" stroke="${p[2]}" stroke-width="2" opacity=".6"/>`; }
  // le sol : l'ancien plafond, avec ses plafonniers
  const [fu,fd]=grad([p[4],p[3]]);
  s+=fd+`<path d="M0 250 H${W} V${H} H0Z" fill="${fu}"/><path d="M0 250 H${W}" stroke="${p[2]}" stroke-width="5"/>`;
  for(let i=-6;i<=6;i++) s+=`<path d="M${600+i*80} 250 L${600+i*200} ${H}" stroke="${p[2]}" stroke-width="2" opacity=".45"/>`;
  if(!o.noLamps) for(let i=0;i<3;i++){ const x=180+i*380+r()*60; s+=`<path d="M${f0(x-60)} 272 H${f0(x+60)} L${f0(x+76)} 292 H${f0(x-76)}Z" fill="${p[5]}" opacity="${i===1&&o.flicker?'.55':'.16'}"/>`; }
  return s;
}
function puddles(r,c){ let s=''; for(let i=0;i<3;i++){ const x=120+r()*960, w=80+r()*140; s+=`<ellipse cx="${f0(x)}" cy="${f0(300+r()*60)}" rx="${f0(w)}" ry="${f0(8+r()*8)}" fill="${c||'#7fb4d8'}" opacity=".16"/>`; } return s; }
function drips(r,n){ let s=''; for(let i=0;i<(n||6);i++){ const x=60+r()*1080, y=44+r()*30; s+=`<path d="M${f0(x)} 40 V${f0(y)}" stroke="#9cc8e8" stroke-width="2" opacity=".55"/><circle cx="${f0(x)}" cy="${f0(y+5)}" r="3" fill="#9cc8e8" opacity=".6"/>`; } return s; }
function porthole(x,y,k){ k=k||1; const R=34*k; return `<circle cx="${x}" cy="${y}" r="${R+10}" fill="#7a8794"/><circle cx="${x}" cy="${y}" r="${R}" fill="#0e3048"/><path d="M${x-R} ${y+R*.2} Q${x} ${y-R*.1} ${x+R} ${y+R*.25} V${y+R} H${x-R}Z" fill="#1d5878" opacity=".8"/><path d="M${x-R*.5} ${y-R*.55} Q${x-R*.1} ${y-R*.8} ${x+R*.3} ${y-R*.6}" stroke="#cfe6ff" stroke-width="4" opacity=".35" fill="none"/>`+[0,1,2,3,4,5].map(i=>{ const a=i*Math.PI/3; return `<circle cx="${f0(x+Math.cos(a)*(R+5))}" cy="${f0(y+Math.sin(a)*(R+5))}" r="2.5" fill="#3c4650"/>`; }).join(''); }
function opening(x,y,w,h,c){ return `<rect x="${x-8}" y="${y-8}" width="${w+16}" height="${h+16}" rx="6" fill="#55606c"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c||'#07090c'}"/>`; }
function pipes(y,c,n){ let s=''; for(let i=0;i<(n||2);i++) s+=`<rect x="0" y="${y+i*22}" width="${W}" height="14" fill="${c||'#6a5a4e'}"/><path d="M0 ${y+i*22+4} H${W}" stroke="#fff" stroke-width="2" opacity=".12"/>`+[150,520,900].map(x=>`<rect x="${x+i*40}" y="${y+i*22-4}" width="14" height="22" fill="#3a302a"/>`).join(''); return s; }
// mobilier renversé, accroché à l'ancien plancher
function invTable(x,w,c){ c=c||['#6e4a36','#4a2e20']; return `<rect x="${x}" y="40" width="${w}" height="14" fill="${c[0]}"/><rect x="${x+12}" y="54" width="12" height="70" fill="${c[1]}"/><rect x="${x+w-24}" y="54" width="12" height="70" fill="${c[1]}"/>`; }
function invChair(x,c){ c=c||'#4a2e20'; return `<rect x="${x}" y="40" width="10" height="56" fill="${c}"/><rect x="${x+34}" y="40" width="10" height="56" fill="${c}"/><rect x="${x-2}" y="94" width="48" height="10" fill="${c}"/><rect x="${x}" y="104" width="9" height="60" fill="${c}"/>`; }
// lustre renversé, posé sur le sol
function chandelier(x){ let s=glow(x,G-110,220,130,'#ffe2a0',.28)+`<path d="M${x} ${G} V${G-140}" stroke="#c9a24a" stroke-width="8"/><ellipse cx="${x}" cy="${G-4}" rx="40" ry="10" fill="#a8781a"/>`;
  [[-110,-70],[-70,-100],[70,-100],[110,-70],[0,-150]].forEach(([dx,dy])=>{ s+=`<path d="M${x} ${G-60} Q${x+dx*.6} ${G-60} ${x+dx} ${G+dy}" stroke="#c9a24a" stroke-width="6" fill="none"/><path d="M${x+dx} ${G+dy} l-8 -18 l8 -12 l8 12Z" fill="#e8f2ff" opacity=".85"/>`; });
  for(let i=0;i<9;i++) s+=`<circle cx="${x-80+i*20}" cy="${G-40-((i*37)%30)}" r="4" fill="#f2f8ff" opacity=".8"/>`;
  return s; }
function column(x,broken){ return `<rect x="${x}" y="40" width="70" height="${broken?150:200}" fill="#d6cfc4"/><path d="M${x+18} 40 V${broken?190:240} M${x+35} 40 V${broken?190:240} M${x+52} 40 V${broken?190:240}" stroke="#b0a89c" stroke-width="5"/><rect x="${x-14}" y="${broken?190:240}" width="98" height="24" fill="#e6dfd4"/><path d="M${x-14} ${broken?214:264} q20 16 49 0 q29 16 49 0" fill="#e6dfd4"/>`+(broken?`<path d="M${x} 190 l14 14 l16 -10 l18 16 l22 -20" fill="none" stroke="#9a9286" stroke-width="3"/>`:''); }
function sign(x,y,w){ w=w||150; return `<rect x="${x}" y="${y}" width="${w}" height="58" rx="4" fill="#e8e0c8" stroke="#2a3a4a" stroke-width="5" transform="rotate(180 ${x+w/2} ${y+29})"/><path d="M${x+18} ${y+20} h${w-36} M${x+18} ${y+36} h${w-58}" stroke="#2a3a4a" stroke-width="4" opacity=".7"/>`; }
function cable(x){ return `<path d="M${x} 40 Q${x+14} 120 ${x-6} 210 Q${x-10} 240 ${x+4} 262" stroke="#2a2a30" stroke-width="7" fill="none"/><path d="M${x} 40 Q${x+14} 120 ${x-6} 210" stroke="#8a8a96" stroke-width="2" fill="none" opacity=".6"/><circle cx="${x+4}" cy="266" r="9" fill="none" stroke="#2a2a30" stroke-width="5"/>`; }
function steam(x,y,k){ let s=''; for(let i=0;i<5;i++) s+=`<ellipse cx="${x+i*18-36}" cy="${y-i*26}" rx="${46+i*12}" ry="${22+i*6}" fill="#e8f0f6" opacity="${(.22-i*.03).toFixed(2)}"/>`; return s; }
function invStove(x){ return `<rect x="${x}" y="40" width="240" height="120" fill="#5a6066"/><rect x="${x+20}" y="70" width="80" height="60" fill="#2a2e32"/><rect x="${x+130}" y="70" width="90" height="60" fill="#2a2e32"/><rect x="${x-10}" y="160" width="260" height="12" fill="#767c82"/>`+[0,1,2].map(i=>`<path d="M${x+40+i*70} 172 v26" stroke="#3a3e42" stroke-width="5"/><path d="M${x+20+i*70} 198 h40 l-6 30 h-28Z" fill="#8a8e92"/>`).join(''); }
function console_(x,lit){ let s=`<rect x="${x}" y="${G-150}" width="230" height="150" fill="#3c4650"/><rect x="${x+12}" y="${G-138}" width="206" height="70" fill="#1a2228"/>`;
  for(let i=0;i<4;i++) s+=`<circle cx="${x+40+i*50}" cy="${G-103}" r="17" fill="#c8d4dc"/><path d="M${x+40+i*50} ${G-103} l${8-i*5} -12" stroke="#2a3238" stroke-width="3"/>`;
  for(let i=0;i<8;i++) s+=`<rect x="${x+20+i*25}" y="${G-50}" width="14" height="10" fill="${lit&&i%3===0?'#ff5a4a':'#5a6a74'}"/>`;
  return s+`<path d="M${x+200} ${G-150} V${G-240} M${x+190} ${G-230} H${x+210}" stroke="#8a96a0" stroke-width="4"/>`; }
function fire(x,y,k){ k=k||1; return glow(x,y-40*k,220*k,130*k,'#ff7a2a',.55)+`<g transform="translate(${x} ${y}) scale(${k})"><path d="M-70 0 Q-80 -70 -40 -120 Q-30 -70 -10 -90 Q-6 -140 26 -170 Q30 -110 50 -100 Q80 -60 70 0Z" fill="#e8582a"/><path d="M-40 0 Q-46 -50 -14 -80 Q-4 -50 10 -60 Q20 -96 34 -110 Q40 -60 46 0Z" fill="#ffb03a"/><path d="M-16 0 Q-18 -26 0 -46 Q10 -26 18 0Z" fill="#fff0a0"/></g>`; }
function desk(x,w){ w=w||220; return `<rect x="${x}" y="40" width="${w}" height="16" fill="#6a4630"/><rect x="${x+10}" y="56" width="70" height="70" fill="#5a3a26"/><rect x="${x+w-80}" y="56" width="70" height="70" fill="#5a3a26"/><path d="M${x+20} 90 h50 M${x+w-70} 90 h50" stroke="#c9a24a" stroke-width="3"/>`; }
function wheel(x,y,k){ k=k||1; let s=`<g transform="translate(${x} ${y}) scale(${k})"><circle r="56" fill="none" stroke="#7a4a2a" stroke-width="12"/><circle r="14" fill="#c9a24a"/>`;
  for(let i=0;i<8;i++){ const a=i*Math.PI/4; s+=`<path d="M0 0 L${f0(Math.cos(a)*78)} ${f0(Math.sin(a)*78)}" stroke="#7a4a2a" stroke-width="9" stroke-linecap="round"/>`; } return s+'</g>'; }
function charts(x){ return `<rect x="${x}" y="70" width="200" height="130" fill="#d8d0b4" transform="rotate(178 ${x+100} 135)"/><path d="M${x+20} 110 q60 -30 100 10 t70 -10 M${x+30} 160 q50 20 90 -10" stroke="#3a6a8c" stroke-width="3" fill="none"/><path d="M${x+60} 90 l30 40 l40 -26" stroke="#c0392b" stroke-width="3" fill="none" stroke-dasharray="6 5"/>`; }
function binnacle(x){ return `<rect x="${x-20}" y="${G-110}" width="40" height="110" fill="#8a6a3a"/><circle cx="${x}" cy="${G-126}" r="30" fill="#c9a24a"/><circle cx="${x}" cy="${G-126}" r="22" fill="#e8e0c8"/><path d="M${x} ${G-144} L${x+6} ${G-126} L${x} ${G-108} L${x-6} ${G-126}Z" fill="#c0392b"/>`; }
function safe(x,open){ return `<rect x="${x}" y="${G-150}" width="140" height="150" rx="6" fill="#4a5258"/><rect x="${x+12}" y="${G-138}" width="116" height="126" rx="4" fill="${open?'#0c0e10':'#5c656c'}"/><circle cx="${x+70}" cy="${G-75}" r="22" fill="#8a949c"/><circle cx="${x+70}" cy="${G-75}" r="6" fill="#2a3036"/><rect x="${x+104}" y="${G-90}" width="10" height="30" fill="#8a949c"/>`; }
function barberChair(x){ return `<g transform="translate(${x} 40)"><rect x="40" y="0" width="20" height="60" fill="#8a949c"/><ellipse cx="50" cy="4" rx="46" ry="10" fill="#9aa4ac"/><rect x="0" y="60" width="100" height="26" rx="8" fill="#8c2a2a"/><rect x="0" y="86" width="16" height="70" rx="6" fill="#8c2a2a"/><rect x="-10" y="60" width="16" height="40" fill="#c8d0d6"/></g>`; }
function mirror(x){ return `<rect x="${x}" y="80" width="150" height="110" rx="8" fill="#8fa8c0" stroke="#c9a24a" stroke-width="7"/><path d="M${x+20} 170 L${x+70} 96 M${x+60} 178 L${x+110} 104" stroke="#e6f0fa" stroke-width="5" opacity=".5"/>`; }
function medCabinet(x){ return `<rect x="${x}" y="70" width="180" height="150" fill="#d8dee2"/><rect x="${x+10}" y="80" width="75" height="130" fill="#b8c4ca"/><rect x="${x+95}" y="80" width="75" height="130" fill="#b8c4ca"/><path d="M${x+75} 130 h30 M${x+90} 115 v30" stroke="#c0392b" stroke-width="10"/>`+[0,1,2].map(i=>`<rect x="${x+20+i*20}" y="${100+i*28}" width="14" height="20" rx="3" fill="${['#c98a3a','#5a8a5a','#8a5a9a'][i]}"/>`).join(''); }
function painting(x,y,moved){ return (moved?`<rect x="${x+10}" y="${y+10}" width="150" height="110" fill="#05080b"/><path d="M${x+10} ${y+120} q75 -20 150 0 V${y+120}Z" fill="#1d5878"/>`:'')+`<g transform="${moved?`translate(160 30) rotate(14 ${x} ${y})`:''}"><rect x="${x}" y="${y}" width="170" height="130" fill="#7a5a2a"/><rect x="${x+12}" y="${y+12}" width="146" height="106" fill="#5a7aa0"/><path d="M${x+12} ${y+12} H${x+158} V${y+50} Q${x+110} ${y+72} ${x+60} ${y+44} Q${x+30} ${y+36} ${x+12} ${y+56}Z" fill="#3a6a3a"/><path d="M${x+100} ${y+70} l-16 40 h32Z" fill="#e8e0c8"/><circle cx="${x+40}" cy="${y+96}" r="12" fill="#f2c94c"/></g>`; }
function toolboard(x){ let s=`<rect x="${x}" y="70" width="260" height="150" fill="#6a5a3a"/>`; for(let i=0;i<5;i++){ const tx=x+30+i*48; s+=`<path d="M${tx} 92 v70" stroke="#9aa4ac" stroke-width="6"/><rect x="${tx-10}" y="${i%2?150:84}" width="20" height="14" rx="3" fill="${i%2?'#c0392b':'#3a5a8c'}"/>`; } return s; }
function steelCab(x,open){ return `<rect x="${x}" y="${G-230}" width="150" height="230" fill="#5c666e"/>`+(open?`<rect x="${x+8}" y="${G-222}" width="134" height="214" fill="#0e1114"/><path d="M${x+8} ${G-222} L${x-42} ${G-238} V${G+4} L${x+8} ${G-8}Z" fill="#6c767e"/><path d="M${x+20} ${G-150} h110 M${x+20} ${G-80} h110" stroke="#3a4248" stroke-width="5"/>`:`<path d="M${x+75} ${G-222} V${G-8}" stroke="#3a4248" stroke-width="4"/><rect x="${x+62}" y="${G-130}" width="8" height="34" fill="#c8d0d6"/><rect x="${x+80}" y="${G-130}" width="8" height="34" fill="#c8d0d6"/><path d="M${x+20} ${G-200} h40 M${x+90} ${G-200} h40" stroke="#4a5258" stroke-width="4"/>`); }
function bunk(x){ return `<rect x="${x}" y="40" width="260" height="20" fill="#6a4630"/><rect x="${x+10}" y="60" width="240" height="34" rx="10" fill="#d8ccb8"/><rect x="${x+170}" y="60" width="70" height="28" rx="10" fill="#f0e6d6"/><rect x="${x}" y="40" width="14" height="90" fill="#5a3a26"/><rect x="${x+246}" y="40" width="14" height="90" fill="#5a3a26"/>`; }
function steelDoor(x,open){ const w=360; return `<rect x="${x-20}" y="0" width="${w+40}" height="160" fill="#4a5258"/>`+(open?`<rect x="${x}" y="0" width="${w}" height="140" fill="#06080a"/>`+[0,1,2,3,4].map(i=>`<path d="M${x+150} ${10+i*28} h60" stroke="#8a949c" stroke-width="7"/>`).join('')+`<path d="M${x+150} 0 V140 M${x+210} 0 V140" stroke="#8a949c" stroke-width="7"/><path d="M${x} 140 L${x-60} 250 L${x+60} 270 L${x+80} 150Z" fill="#6a747c"/>`
  :`<rect x="${x}" y="0" width="${w}" height="140" fill="#6a747c"/>`+[1,2,3].map(i=>`<path d="M${x+i*w/4} 0 V140" stroke="#4a5258" stroke-width="5"/>`).join('')+`<rect x="${x+150}" y="56" width="60" height="28" rx="6" fill="#a8b2ba"/>`+[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${x+20+i*46}" cy="128" r="5" fill="#3a4248"/><circle cx="${x+20+i*46}" cy="12" r="5" fill="#3a4248"/>`).join('')); }
function hatch(x,open){ return `<ellipse cx="${x}" cy="${G+20}" rx="120" ry="34" fill="#4a5258"/><ellipse cx="${x}" cy="${G+20}" rx="96" ry="26" fill="${open?'#0c2a40':'#6a747c'}"/>`+(open?'':`<path d="M${x-60} ${G+20} H${x+60} M${x} ${G} V${G+40}" stroke="#3a4248" stroke-width="6"/><circle cx="${x}" cy="${G+20}" r="14" fill="none" stroke="#c8d0d6" stroke-width="5"/>`); }
function engineBlock(x){ let s=`<rect x="${x}" y="${G-200}" width="420" height="200" fill="#5a4a3e"/>`; for(let i=0;i<4;i++){ const cx=x+50+i*100; s+=`<rect x="${cx-30}" y="${G-280}" width="60" height="120" fill="#7a6a5c"/><rect x="${cx-36}" y="${G-290}" width="72" height="16" fill="#3a2e26"/><path d="M${cx} ${G-160} v-120" stroke="#a89888" stroke-width="6"/>`; }
  return s+`<circle cx="${x+520}" cy="${G-120}" r="100" fill="none" stroke="#4a3c32" stroke-width="26"/><circle cx="${x+520}" cy="${G-120}" r="20" fill="#7a6a5c"/>`+[0,1,2,3,4,5].map(i=>{ const a=i*Math.PI/3; return `<path d="M${x+520} ${G-120} L${f0(x+520+Math.cos(a)*90)} ${f0(G-120+Math.sin(a)*90)}" stroke="#4a3c32" stroke-width="12"/>`; }).join(''); }
function walkway(){ let s=`<rect width="${W}" height="${H}" fill="#120e0c"/>`+glow(600,330,700,140,'#ff7a2a',.18);
  for(let x=0;x<W;x+=90) s+=`<path d="M${x} 0 V${H}" stroke="#1e1814" stroke-width="10"/>`;
  s+=pipes(70,'#4e3e32',3)+`<path d="M0 ${G-20} H${W} L${W} ${G+30} H0Z" fill="#4a4038"/>`;
  for(let x=0;x<W;x+=24) s+=`<path d="M${x} ${G-20} l12 50" stroke="#2a221c" stroke-width="5"/>`;
  s+=`<path d="M0 ${G-110} H${W} M0 ${G-66} H${W}" stroke="#8a7a6a" stroke-width="7"/>`; for(let x=40;x<W;x+=160) s+=`<path d="M${x} ${G-110} V${G-20}" stroke="#8a7a6a" stroke-width="8"/>`;
  return s; }
function hullPlates(r){ let s=''; const [u,d]=grad(['#5a6470','#2e353e']); s+=d+`<rect width="${W}" height="${H}" fill="${u}"/>`;
  for(let y=0;y<H;y+=66) for(let x=(y/66%2)*90-90;x<W;x+=180){ s+=`<rect x="${x}" y="${y}" width="178" height="64" fill="none" stroke="#1e242a" stroke-width="4"/>`; for(let k=0;k<6;k++) s+=`<circle cx="${x+12+k*31}" cy="${y+8}" r="3" fill="#1e242a"/>`; }
  for(let i=0;i<8;i++){ const x=r()*W; s+=`<path d="M${f0(x)} 0 q${f0(r()*20-10)} 60 ${f0(r()*30-15)} ${f0(80+r()*120)}" stroke="#8a5a3a" stroke-width="${f0(3+r()*5)}" opacity=".45" fill="none"/>`; }
  return s+`<path d="M0 ${G-10} H${W} V${H} H0Z" fill="#20262c"/>`; }
function hullPlate(x){ return glow(x+130,150,300,180,'#fff4d0',.45)+`<rect x="${x}" y="40" width="260" height="210" rx="8" fill="#7a848e" stroke="#fff4d0" stroke-width="5" stroke-opacity=".6"/>`+[0,1,2,3,4,5].map(i=>`<circle cx="${x+20+i*44}" cy="58" r="8" fill="#3a4248"/><circle cx="${x+20+i*44}" cy="232" r="8" fill="#3a4248"/>`).join('')+`<circle cx="${x+18}" cy="145" r="8" fill="#3a4248"/><circle cx="${x+242}" cy="145" r="8" fill="#3a4248"/>`; }
function water(pct,dark){ const h=Math.round(16+pct*1.1), y=H-h; return `<rect x="0" y="${y}" width="${W}" height="${h}" fill="${dark?'#06121c':'#2a6a96'}" opacity=".42"/><path d="M0 ${y} q60 -8 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" stroke="#bfe4ff" stroke-width="3" fill="none" opacity=".45"/>`; }

// ---------- les 20 lieux ----------
const PLACES={
 // la salle de bal : lustre renversé, tables au plafond ; les sorties sont tout en haut
 1:(r)=>{ let s=room(r,PAL.luxe,{carpet:1})+opening(140,46,110,80)+opening(940,46,110,80); for(let i=0;i<3;i++) s+=invTable(330+i*200,140,['#e8e0d0','#8a6a4a']);
   return {s:s+chandelier(600)+puddles(r),x0:120,x1:1080}; },
 2:(r,x)=>{ let s=room(r,PAL.luxe,{carpet:1})+opening(820,46,160,90)+`<path d="M0 46 H560" stroke="#c9a24a" stroke-width="4" opacity=".5"/>`;
   if(x.has(28)) s+=sign(260,120); if(x.has(9)) s+=cable(900); return {s:s+puddles(r),x0:120,x1:760}; },
 3:(r)=>({s:room(r,PAL.luxe,{carpet:1})+opening(500,46,200,90,'#1a1014')+column(380,1)+column(740,0)+puddles(r),x0:120,x1:1080}),
 '3b':(r)=>{ let s=room(r,PAL.water,{carpet:1,noLamps:1}); s+=`<rect x="0" y="120" width="${W}" height="${H-120}" fill="#1d5878" opacity=".75"/>`; for(let i=0;i<6;i++) s+=`<path d="M${i*200} 120 q50 -12 100 0 t100 0" stroke="#bfe4ff" stroke-width="3" fill="none" opacity=".5"/>`;
   return {s:s+chandelier(600).replace(/opacity="\.8/g,'opacity=".3'),x0:120,x1:1080}; },
 4:(r)=>({s:room(r,PAL.ship)+invStove(160)+invStove(720)+steam(300,200)+steam(860,220)+`<rect x="560" y="${G-90}" width="120" height="90" fill="#8a949c"/>`,x0:120,x1:1080}),
 5:(r)=>({s:room(r,PAL.dark,{flicker:1})+opening(80,120,120,130)+opening(996,120,120,130)+drips(r,8)+puddles(r,'#5a8aa8'),x0:240,x1:960}),
 6:(r,x)=>({s:room(r,PAL.ship)+medCabinet(140)+`<rect x="420" y="${G-70}" width="240" height="70" fill="#d8dee2"/><rect x="430" y="${G-90}" width="220" height="24" rx="8" fill="#f0f2f4"/>`+(x.has(29)||x.has(120)?painting(820,80,x.has(120)):''),x0:120,x1:1080}),
 7:(r,x)=>({s:room(r,PAL.ship)+toolboard(160)+(x.has(117)?steelCab(860,1):''),x0:120,x1:840}),
 8:(r)=>({s:room(r,PAL.ship)+mirror(160)+mirror(420)+barberChair(260)+barberChair(520)+`<path d="M900 40 V200" stroke="#c0392b" stroke-width="22"/><path d="M900 40 V200" stroke="#fff" stroke-width="22" stroke-dasharray="14 14"/>`,x0:120,x1:1080}),
 9:(r)=>({s:room(r,PAL.dark,{noLamps:1})+opening(70,110,120,140)+opening(1006,110,120,140)+drips(r,10)+puddles(r,'#4a7a98'),x0:240,x1:960}),
 10:(r,x)=>{ let s=room(r,PAL.ship)+console_(140,1)+console_(420,0)+porthole(900,140); if(x.has(110)) s+=fire(860,G+10,1.1)+glow(600,200,600,200,'#ff5a2a',.18); return {s,x0:120,x1:x.has(110)?700:1080}; },
 11:(r)=>({s:room(r,PAL.luxe,{carpet:1})+bunk(120)+desk(760,260)+porthole(560,150),x0:120,x1:1080}),
 12:(r)=>({s:room(r,PAL.ship)+charts(140)+wheel(620,170,1)+binnacle(900)+porthole(420,150,.8),x0:120,x1:1080}),
 13:(r)=>({s:room(r,PAL.ship)+desk(180,240)+safe(860,0)+`<rect x="520" y="70" width="200" height="120" fill="#3a4a3a"/><path d="M540 100 h160 M540 130 h120 M540 160 h140" stroke="#c8d4c0" stroke-width="3" opacity=".6"/>`,x0:120,x1:820}),
 14:(r)=>({s:room(r,PAL.ship,{noTop:1})+steelDoor(420,0)+`<rect x="0" y="0" width="${W}" height="6" fill="#1d252d"/>`+opening(60,150,110,100)+opening(1026,150,110,100),x0:120,x1:1080}),
 '14b':(r)=>({s:room(r,PAL.ship,{noTop:1})+steelDoor(420,1)+opening(60,150,110,100)+opening(1026,150,110,100),x0:120,x1:1080}),
 15:(r,x)=>{ let s=`<rect width="${W}" height="${H}" fill="#140c0a"/>`+glow(700,H,700,260,'#ff6a2a',.6)+pipes(30,'#3a2e26',2);
   s+=`<path d="M0 ${H} V300 Q300 280 560 300 T${W} 300 V${H}Z" fill="#2a120a"/>`+fire(520,H+20,1.2)+fire(820,H+20,.9)+fire(1060,H+10,.7);
   s+=`<path d="M0 ${G-60} H340 L320 ${G-30} H0Z" fill="#5a4a3e"/><path d="M0 ${G-60} H340" stroke="#8a7a6a" stroke-width="5"/><rect x="${W-180}" y="${G-60}" width="180" height="30" fill="#5a4a3e"/>`;
   s+=`<rect x="300" y="${G-120}" width="16" height="64" fill="#6a5a4c"/>`;
   if(x.has(118)) s+=`<path d="M308 ${G-116} Q700 ${G-10} ${W-40} ${G-70}" stroke="#c8a46a" stroke-width="6" fill="none"/>`;
   return {s,x0:60,x1:300,y:G-60}; },
 16:(r,x)=>({s:room(r,PAL.luxe,{carpet:1})+invTable(260,680,['#5a3a26','#3a2416'])+[0,1,2,3,4,5].map(i=>invChair(300+i*110,'#3a2416')).join('')+(x.has(25)?hatch(600,0):'')+porthole(1080,170,.7),x0:120,x1:1080}),
 17:(r)=>{ let s=room(r,PAL.engine,{noLamps:1})+`<rect x="0" y="0" width="${W}" height="150" fill="#1a130e"/><path d="M0 150 H${W}" stroke="#3a2b20" stroke-width="8"/>`;
   [[200,'#000'],[600,'#000'],[1000,'#000']].forEach(([cx])=>{ s+=`<ellipse cx="${cx}" cy="${G+20}" rx="110" ry="30" fill="#4a3a2e"/><ellipse cx="${cx}" cy="${G+20}" rx="90" ry="22" fill="#030202"/>`; });
   return {s:s+opening(1080,170,100,80,'#2a1a10')+glow(1130,210,120,80,'#ff9a4a',.25)+pipes(160,'#4e3e32',1),x0:300,x1:900}; },
 18:(r,x)=>({s:room(r,PAL.engine,{noLamps:1})+pipes(48,'#5a4a3e',2)+engineBlock(140)+glow(600,300,600,120,'#ff9a4a',.15)+(x.has(118)?`<path d="M40 0 Q80 180 120 ${G-60}" stroke="#c8a46a" stroke-width="6" fill="none"/>`:''),x0:880,x1:1100}),
 19:()=>({s:walkway(),x0:120,x1:1080,y:G-20}),
 20:(r,x)=>({s:hullPlates(r)+(x.has(30)?hullPlate(470):glow(600,150,400,220,'#fff8e0',.9)+`<rect x="470" y="40" width="260" height="210" rx="8" fill="#fffaf0"/>`),x0:120,x1:440})
};
const FIXED=new Set([9,25,28,29,30]);   // dessinés par le décor (câble, écoutille, panneau, tableau, tôle)

// ---------- objets ----------
// Chaque dessin a son origine au milieu de sa base.
let emptyBeaker=false;
const OBJ={
 8:()=>`<rect x="-22" y="-52" width="44" height="10" fill="#6a3f2a"/><rect x="-20" y="-42" width="8" height="42" fill="#4e2c1f"/><rect x="12" y="-42" width="8" height="42" fill="#4e2c1f"/><rect x="-22" y="-122" width="9" height="70" fill="#4e2c1f"/><rect x="-22" y="-122" width="40" height="10" fill="#6a3f2a"/><rect x="-22" y="-98" width="40" height="8" fill="#6a3f2a"/>`,
 9:()=>`<ellipse cx="0" cy="-12" rx="34" ry="12" fill="none" stroke="#2a2a30" stroke-width="7"/><ellipse cx="0" cy="-20" rx="28" ry="10" fill="none" stroke="#4a4a54" stroke-width="6"/>`,
 10:()=>`<path d="M-80 0 L-60 -30 L-20 -22 L0 -48 L30 -26 L70 -34 L86 0Z" fill="#6a5a50"/><path d="M-70 -14 L40 -40" stroke="#8a6a4a" stroke-width="10"/><path d="M-30 -8 L60 -18" stroke="#a87a50" stroke-width="8"/><path d="M10 -30 l14 -8 l6 12Z M-40 -20 l12 -6 l4 10Z" fill="#cfe6f0" opacity=".8"/>`,
 11:()=>`<ellipse cx="0" cy="-6" rx="46" ry="10" fill="#c8ccd0"/><ellipse cx="0" cy="-10" rx="34" ry="7" fill="#7a6a3a"/><path d="M-20 -12 q6 -6 12 0 M4 -13 q6 -6 12 0" stroke="#e8e0c8" stroke-width="4" fill="none"/>`,
 12:()=>`<path d="M-34 -10 L20 -10 L26 -44 L-34 -44Z" fill="#c8d0d8" stroke="#8a96a0" stroke-width="2"/><rect x="20" y="-18" width="40" height="10" rx="4" fill="#4e2c1f"/><circle cx="-24" cy="-36" r="4" fill="#4a5258"/>`,
 13:()=>`<path d="M-10 -70 h20 v24 l22 40 q4 8 -6 8 h-52 q-10 0 -6 -8 l22 -40Z" fill="#cfe6f0" opacity=".85" stroke="#e8f6ff" stroke-width="3"/>`+(emptyBeaker?'':`<path d="M-22 -20 h44 l8 14 q3 6 -5 6 h-50 q-8 0 -5 -6Z" fill="#f2c94c" opacity=".9"/>`)+`<rect x="-12" y="-76" width="24" height="8" fill="#8a96a0"/>`,
 14:()=>`<g transform="translate(0 ${-G})">${steelCab(-75,0)}</g>`,
 15:()=>`<path d="M-40 -8 L20 -14 L24 -6 L-36 -2Z" fill="#dfe6ee" stroke="#9aa6b4" stroke-width="2"/><path d="M20 -14 Q40 -26 50 -12 L24 -6Z" fill="#2a2a30"/>`,
 16:()=>`<rect x="-60" y="-60" width="120" height="60" rx="4" fill="#3c4650"/><rect x="-50" y="-50" width="60" height="30" fill="#1a2228"/><circle cx="34" cy="-36" r="12" fill="#c8d4dc"/><path d="M40 -60 V-120" stroke="#8a96a0" stroke-width="4"/><path d="M-40 -42 l30 -2 M-40 -30 l40 0" stroke="#5aa86a" stroke-width="2"/>`,
 17:()=>`<path d="M-24 -6 Q-30 -30 -8 -38 Q16 -46 24 -24 Q30 -6 8 -2 Q-14 4 -24 -6Z" fill="#e8e0c8"/><path d="M-14 -24 l14 6 l8 -12 M-4 -10 l16 -4" stroke="#b0a890" stroke-width="2" fill="none"/>`,
 18:()=>`<path d="M-34 -4 L-26 -54 L0 -48 L26 -58 L34 -6 L0 -2Z" fill="#f2ead2" stroke="#b0a890" stroke-width="2"/><path d="M0 -48 L0 -2" stroke="#b0a890" stroke-width="2"/><path d="M-22 -40 h16 M-22 -30 h14 M8 -44 h16 M8 -32 h14" stroke="#3a6a8c" stroke-width="2"/>`,
 19:()=>`<path d="M-40 0 V-70 Q-40 -90 -20 -92 L-8 -70 H8 L20 -92 Q40 -90 40 -70 V0Z" fill="#ff7a1a"/><path d="M-40 -40 H40 M-40 -20 H40" stroke="#e8e8e8" stroke-width="6"/><path d="M-8 -70 V0 M8 -70 V0" stroke="#c85a10" stroke-width="3"/>`,
 20:()=>`<path d="M-40 -4 Q-30 -30 0 -32 Q30 -30 40 -4" stroke="#ffd25a" stroke-width="5" fill="none"/><circle cx="-14" cy="-10" r="8" fill="#e05a8c"/><circle cx="6" cy="-12" r="9" fill="#5ac0e0"/><circle cx="24" cy="-8" r="7" fill="#6ae08c"/><circle cx="-28" cy="-6" r="6" fill="#f4f0e8"/><path d="M-30 -2 Q0 12 30 -2" stroke="#f4f0e8" stroke-width="5" fill="none" stroke-dasharray="1 7" stroke-linecap="round"/>`,
 23:()=>`<ellipse cx="0" cy="-10" rx="40" ry="12" fill="none" stroke="#c8a46a" stroke-width="8"/><ellipse cx="0" cy="-20" rx="32" ry="10" fill="none" stroke="#b08a50" stroke-width="7"/><ellipse cx="0" cy="-30" rx="24" ry="8" fill="none" stroke="#c8a46a" stroke-width="6"/><path d="M36 -10 q20 4 28 10" stroke="#c8a46a" stroke-width="6" fill="none"/>`,
 24:()=>`<rect x="-18" y="-90" width="36" height="90" rx="12" fill="#c0392b"/><rect x="-10" y="-104" width="20" height="16" fill="#2a2a30"/><path d="M10 -100 q30 -4 34 20" stroke="#2a2a30" stroke-width="6" fill="none"/><rect x="-14" y="-60" width="28" height="20" fill="#f4f0e8"/>`,
 25:()=>`<ellipse cx="0" cy="-14" rx="60" ry="16" fill="#6a747c" stroke="#4a5258" stroke-width="6"/><circle cx="0" cy="-14" r="8" fill="none" stroke="#c8d0d6" stroke-width="4"/>`,
 26:()=>`<path d="M-60 -8 L46 -8 Q60 -8 62 -22 Q64 -34 54 -36" stroke="#3a4a5a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-60 -8 l-8 -10" stroke="#3a4a5a" stroke-width="10" stroke-linecap="round"/>`,
 27:()=>`<rect x="-36" y="-22" width="54" height="20" rx="6" fill="#2a2a30"/><path d="M18 -26 L36 -32 V8 L18 2Z" fill="#8a96a0"/><rect x="-26" y="-18" width="12" height="6" fill="#c0392b"/>`,
 28:()=>`<rect x="-50" y="-60" width="100" height="44" rx="4" fill="#e8e0c8" stroke="#2a3a4a" stroke-width="4"/><path d="M-36 -46 h72 M-36 -32 h50" stroke="#2a3a4a" stroke-width="3"/>`,
 29:()=>`<rect x="-46" y="-70" width="92" height="70" fill="#7a5a2a"/><rect x="-38" y="-62" width="76" height="54" fill="#5a7aa0"/><path d="M-38 -8 H38 V-30 Q10 -40 -10 -26 Q-24 -20 -38 -30Z" fill="#3a6a3a"/>`,
 30:()=>`<rect x="-50" y="-80" width="100" height="80" rx="4" fill="#7a848e"/>`+[0,1,2].map(i=>`<circle cx="${-36+i*36}" cy="-70" r="5" fill="#3a4248"/><circle cx="${-36+i*36}" cy="-10" r="5" fill="#3a4248"/>`).join(''),
 32:()=>`<path d="M-50 -10 L30 -10" stroke="#8a96a0" stroke-width="12" stroke-linecap="round"/><path d="M30 -10 m-4 -20 a22 22 0 1 1 0 40 l0 -12 a10 10 0 1 0 0 -16Z" fill="#8a96a0"/><path d="M-36 -10 h40" stroke="#5a646e" stroke-width="4"/>`
};

function render(key,off,objs,opt){
  if(uid>1e6) uid=0;
  const k=PLACES[key]?key:String(off+1), n=parseInt(k)||1, r=rng((off+1)*7919+n*131);
  const x=new Set(objs); emptyBeaker=x.has(121);
  const p=(PLACES[k]||PLACES[1])(r,x);
  let s=p.s;
  const items=objs.filter(i=>OBJ[i]&&!FIXED.has(i)).sort((a,b)=>a-b);
  const span=p.x1-p.x0, slots=Math.max(4,items.length), base=p.y||G;
  items.forEach((i,j)=>{ const xx=p.x0+span*((j*3+off)%slots+.5)/slots; s+=`<g transform="translate(${f0(xx)} ${base+((i*13)%3)*8})">${OBJ[i]()}</g>`; });
  const wl=objs.find(i=>i>=200&&i<=300);
  if(wl!==undefined&&k!=='3b'&&n!==15&&n!==19) s+=water(wl-200,n===5||n===9);
  if(x.has(113)) s+=`<rect width="${W}" height="${H}" fill="#020304" opacity=".88"/>`;
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}${veil()}</svg>`;
}
const DIM={10:[180,60],12:[110,60],14:[160,240],16:[130,130],19:[100,100],24:[110,110],26:[150,50],29:[100,80],30:[110,90],32:[120,50],13:[90,90],8:[60,130],25:[140,40]};
function icon(n,size){ if(!OBJ[n]) return ''; const d=DIM[n]||[90,70]; return `<svg class="oi" width="${size}" height="${size}" viewBox="${-d[0]/2} ${-d[1]} ${d[0]} ${d[1]+6}">${OBJ[n]()}</svg>`; }
return {render,icon,PLACES,OBJ};
})();
if(typeof module!=='undefined')module.exports=SCENES;
