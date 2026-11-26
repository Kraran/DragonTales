// Madness and the Minotaur — illustrations : ÉBAUCHE. Un fond uni en attendant les décors (docs/PLAN-MADNESS.md).
const SCENES=(function(){
const W=1196, H=396;
function render(key,off,objs,opt){
  const s=`<rect width="${W}" height="${H}" fill="#2a2620"/><rect y="270" width="${W}" height="126" fill="#3a3228"/>`;
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}
return {render,icon:()=>'',PLACES:{},OBJ:{}};
})();
if(typeof module!=='undefined')module.exports=SCENES;
