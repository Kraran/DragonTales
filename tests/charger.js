// Charge une aventure sous Node comme le fait build.py dans la page (sans images ni musique) : renvoie sa fiche.
// adv.solution : les commandes de aventures/<nom>/solution.txt (une par ligne, # pour les commentaires), ou [] s'il n'y en a pas.
const fs=require('fs'), path=require('path');
module.exports=function(name){
  const dir=path.resolve(__dirname,'..','aventures',name);
  const mods=fs.readdirSync(dir).filter(f=>f.endsWith('.js')&&f!=='aventure.js').sort().concat('aventure.js');
  const src=mods.map(f=>fs.readFileSync(path.join(dir,f),'utf8').replace(/^.*typeof (require|module)!=='undefined'.*$/gm,'')).join('\n');
  let adv=null;
  new Function('DragonTales','ASSETS',src)({register(a){ adv=a; }},{});
  adv.bin=fs.readFileSync(path.join(dir,'programme.bin'));
  const sol=path.join(dir,'solution.txt');
  adv.solution=fs.existsSync(sol)?fs.readFileSync(sol,'utf8').split(/\r?\n/).map(l=>l.trim()).filter(l=>l&&!l.startsWith('#')).map(l=>l.toUpperCase()):[];
  return adv;
};
