// Eno — illustrations : ÉBAUCHE. Un fond de salon uni en attendant les décors (étape suivante, docs/PLAN-ENO.md).
// render(clé, lieu, numéros, options) : numéros = objets présents (1 à 28) et éléments de scène (101 et plus, voir aventure.js).
const SCENES=(function(){
const W=1196, H=396;
function render(key,off,objs,opt){
  const s=`<rect width="${W}" height="${H}" fill="#6a4a3a"/><rect y="250" width="${W}" height="146" fill="#4a2e22"/><path d="M0 250 H${W}" stroke="#2a1a12" stroke-width="6"/>`;
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}
return {render,icon:()=>'',PLACES:{},OBJ:{}};
})();
if(typeof module!=='undefined')module.exports=SCENES;
