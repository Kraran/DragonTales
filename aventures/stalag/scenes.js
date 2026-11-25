// Stalag — illustrations : ÉBAUCHE. Un fond uni en attendant les décors (étape suivante, docs/PLAN-STALAG.md).
const SCENES=(function(){
const W=1196, H=396;
function render(key,off,objs,opt){
  const s=`<rect width="${W}" height="${H}" fill="#4a3a5a"/><rect y="260" width="${W}" height="136" fill="#6a3a24"/>`;
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}
return {render,icon:()=>'',PLACES:{},OBJ:{}};
})();
if(typeof module!=='undefined')module.exports=SCENES;
