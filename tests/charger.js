// Charge une aventure sous Node comme le fait build.py dans la page (sans images ni musique) : renvoie sa fiche.
const fs=require('fs'), path=require('path');
module.exports=function(name){
  const dir=path.resolve(__dirname,'..','aventures',name);
  const mods=fs.readdirSync(dir).filter(f=>f.endsWith('.js')&&f!=='aventure.js').sort().concat('aventure.js');
  const src=mods.map(f=>fs.readFileSync(path.join(dir,f),'utf8').replace(/^.*typeof (require|module)!=='undefined'.*$/gm,'')).join('\n');
  let adv=null;
  new Function('DragonTales','ASSETS',src)({register(a){ adv=a; }},{});
  adv.bin=fs.readFileSync(path.join(dir,'programme.bin'));
  return adv;
};
