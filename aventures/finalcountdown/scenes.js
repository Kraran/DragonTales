// The Final Countdown — illustrations. ÉBAUCHE : un fond par sorte de lieu, en attendant les 20 décors dessinés.
const SCENES=(function(){
const W=1196, H=396;
const SKY={desert:['#e8a85a','#7a4a2a'],van:['#4a4e52','#1e2226'],gate:['#d89a5a','#5a3a2a'],office:['#5a6a7a','#2a323a'],tech:['#1e3a4a','#081418'],
 store:['#3a3a32','#141410'],hall:['#4a5058','#1a1e22']};
function render(key,off,objs,opt){
  const r=ROOMS[key]||ROOMS[String(off+1)]||ROOMS['2'], c=SKY[r[2]]||SKY.office, id='fcg'+(off|0);
  const s=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs>`+
    `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  if(opt&&opt.crop) return `<svg viewBox="${opt.crop}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}
function icon(n,size){ return ''; }
return {render,icon,PLACES:{},OBJ:{}};
})();
