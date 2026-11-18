// Vérifie la liste des fins de chaque aventure (aventures/<nom>/fins.js) sans navigateur : identifiants uniques, titres et
// notes en deux langues, une seule victoire, et chaque texte cherché présent dans le programme d'origine ou ses correctifs
// (un texte mal recopié ne serait jamais reconnu), chaque lieu présent dans ROOMS.
//   node tests/fins.js
const fs=require('fs'), path=require('path');
const DIR=path.resolve(__dirname,'..','aventures'); let bad=0;
const ko=(a,msg)=>{ bad++; console.log('ÉCHEC '+a+' : '+msg); };
for(const name of fs.readdirSync(DIR).filter(n=>fs.existsSync(path.join(DIR,n,'aventure.js'))&&!fs.existsSync(path.join(DIR,n,'EN-COURS.md')))){
  const adv=require('./charger.js')(name), list=adv.endings||[];
  if(!list.length){ ko(name,'aucune fin (fins.js)'); continue; }
  let txt;
  if(adv.machine.kind==='basic'){ const bas=path.join(DIR,name,'programme.bas');
    txt=(fs.existsSync(bas)?fs.readFileSync(bas,'latin1'):'')+' '+Object.values(adv.machine.patches||{}).join(' '); }
  else txt=Buffer.from(adv.bin).toString('latin1').replace(/[#%]/g,' ');
  txt=txt.replace(/\\'/g,"'").replace(/\s+/g,' ');
  const ids=new Set(); let wins=0;
  for(const e of list){
    if(ids.has(e.id)) ko(name,'identifiant en double '+e.id); ids.add(e.id);
    for(const k of ['fr','en','frNote','enNote']) if(!e[k]) ko(name,e.id+' : '+k+' manquant');
    if(e.won){ wins++; continue; }
    if(!e.test&&!e.room) ko(name,e.id+' : ni texte ni lieu');
    if(e.test&&!e.test.test(txt)) ko(name,e.id+' : texte introuvable dans le programme '+e.test);
    if(e.room&&!adv.ROOMS[e.room]) ko(name,e.id+' : lieu inconnu '+e.room);
  }
  if(wins!==1) ko(name,wins+' victoires');
  console.log((bad?'':'ok   ')+adv.title+' : '+list.length+' fins ('+(list.length-wins)+' morts et la victoire)');
}
console.log(bad?bad+' erreur(s)':'tout est bon'); process.exit(bad?1:0);
