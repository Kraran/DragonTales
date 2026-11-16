// Dragon Mountain — illustrations PROVISOIRES : un décor simple par sorte de lieu (voir data.js), en attendant les vraies
// illustrations (étape 3 du plan). Même interface que les scènes d'El Diablero : render(clé, lieu, objets, options), icon(n, taille).
const SCENES=(function(){
const W=1196, H=396;
const KIND={ // fond haut, fond bas, sol, lumière
  cave:['#2a2230','#16111c','#0e0a12','#7d6a8c'], passage:['#2c2a33','#17151d','#0f0d14','#8c8396'],
  hall:['#3a2e2a','#211915','#140f0c','#d9a35b'], bedroom:['#3b2a33','#22171d','#150e12','#e0a3a8'],
  cupboard:['#2d2420','#1a1411','#100c0a','#a07a5a'], dark:['#141218','#0b0a0e','#060508','#4b4656'],
  library:['#30261d','#1c160f','#110d09','#c9a46b'], kitchen:['#3a2c20','#221911','#150f0a','#e8a34f'],
  lair:['#3a1414','#200a0a','#140606','#e0503a'], throne:['#2c2238','#18121f','#0f0b14','#b48ce0'],
  magic:['#1c2c44','#0f1828','#090f1a','#8fd2ff'], treasure:['#463410','#261b06','#170f03','#ffd25a']
};
const ICON={7:'#e8b04a',8:'#9fd3e0',9:'#ffd25a',10:'#8c6bb0',11:'#9a9aa6',12:'#cfd6e0',13:'#ffd25a',14:'#ff9a3a',15:'#ffd25a',
  16:'#ffd25a',17:'#e05a8c',18:'#7a4a2a',19:'#8a8a94',20:'#b07a3a',21:'#b07a3a',22:'#b07a3a',23:'#5a8cc0',24:'#5a8cc0',25:'#ffd25a'};
let uid=0;
function rng(seed){ let x=seed>>>0||1; return ()=>{ x^=x<<13; x>>>=0; x^=x>>>17; x^=x<<5; x>>>=0; return x/4294967296; }; }
function render(key,off,objs,opt){
  const r=rng((off+1)*7919), k=(typeof ROOMS!=='undefined'&&ROOMS[key]?ROOMS[key][2]:'cave'), c=KIND[k]||KIND.cave, id='dm'+(++uid);
  let s=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`+
        `<radialGradient id="${id}l" cx=".5" cy=".55" r=".55"><stop offset="0" stop-color="${c[3]}" stop-opacity=".35"/><stop offset="1" stop-color="${c[3]}" stop-opacity="0"/></radialGradient></defs>`;
  s+=`<rect width="${W}" height="${H}" fill="url(#${id})"/><rect width="${W}" height="${H}" fill="url(#${id}l)"/>`;
  // pierres du mur
  for(let i=0;i<26;i++){ const x=r()*W, y=r()*260, w=60+r()*120; s+=`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(24+r()*20).toFixed(0)}" rx="6" fill="#000" opacity="${(.05+r()*.08).toFixed(2)}"/>`; }
  s+=`<path d="M0 300 H${W} V${H} H0Z" fill="${c[2]}"/><path d="M0 300 H${W}" stroke="#000" stroke-opacity=".5" stroke-width="4"/>`;
  // objets : petits symboles au sol
  (objs||[]).forEach((n,i)=>{ const x=420+i*70; s+=`<g transform="translate(${x} 326)">${glyph(n,26)}</g>`; });
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}
function glyph(n,size){ const f=ICON[n]||'#ccc', h=size/2; return `<circle r="${h}" fill="${f}" opacity=".9"/><circle r="${h*.45}" fill="#000" opacity=".25"/>`; }
function icon(n,size){ return `<svg width="${size}" height="${size}" viewBox="${-size/2} ${-size/2} ${size} ${size}">${glyph(n,size*.8)}</svg>`; }
return {render,icon};
})();
