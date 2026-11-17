// Mansion of Doom — illustrations. ÉBAUCHE : un fond par sorte de lieu (dehors, manoir, cave, sous-cave, magie),
// en attendant les 77 décors dessinés comme pour les autres aventures.
const SCENES=(function(){
const W=1196, H=396;
const SKY={out:['#1a2030','#3a3048'],house:['#2a1c18','#120c0a'],cellar:['#1a1a14','#080806'],crypt:['#1c0c10','#060203'],magic:['#202838','#0a0c14']};
function render(key,off,objs,opt){
  const r=ROOMS[key]||ROOMS[String(off+1)]||ROOMS['1'], c=SKY[r[2]]||SKY.house, id='mdg'+(off|0);
  const s=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs>`+
    `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}
function icon(n,size){ return ''; }
return {render,icon,PLACES:{},OBJ:{}};
})();
