// Madness and the Minotaur — écrit la solution de la graine 7 (niveau débutant) en jouant avec outils/madness-agent.js.
// node outils/madness-solution.js : quelques minutes ; réécrit aventures/madness/solution.txt si la partie est gagnée.
const A=require('./madness-agent.js')(7,'BEGINNER',{verbose:!!process.env.V,saveOil:true});
const sac=()=>[...Array(63).keys()].filter(n=>n&&A.NAMES[n]!=='?'&&A.o(n).pack).map(n=>A.NAMES[n]).join(',');
const st=l=>console.log((l||'').padEnd(14),JSON.stringify(A.state),'sac',sac(),'cmds',A.cmds.length);
const learn=k=>{ const sp=A.spell(k); if(sp.o1<55&&!A.o(sp.o1).pack) get(sp.o1); A.safe(()=>{ for(let t=0;t<4&&!A.spell(k).known;t++){ A.go(A.spell(k).room); if(!A.spell(k).known){ const e=A.edges(A.R[0])[0]; A.say(e.cmd); } } if(!A.spell(k).known) throw new Error('sort '+k+' pas appris'); },'sort '+k); st('sort '+A.NAMES[55+k]); };
const get=n=>{ A.safe(()=>A.get(n),n); };
const R=A.R, o=A.o;
const inPack=n=>o(n).pack;
// chasser une créature : on va vers elle (elle bouge chaque minute) et on la tue quand on la rejoint
const hunt=(c)=>{ const n=A.NAMES.indexOf(c); A.safe(()=>{ for(let k=0;k<300&&!(o(n).f&2);k++){
    if(o(n).room===R[0]){ A.try_(()=>A.say('KILL '+c),()=>!!(o(n).f&2),8); continue; }
    const p=A.route(o(n).room); if(!p){ A.say('WAIT'); continue; } const e=p[0];
    if(!A.lit(e.to)&&o('LAMP').pack&&!R[0x0A]) A.say('LAMP ON'); A.say(e.cmd); }
  if(!(o(n).f&2)) throw new Error(c+' toujours vivant'); },'chasse '+c); st('tué '+c); };
// le butin d'une créature morte ou d'une cachette
const loot=t=>{ get(t); };
// se soigner : eau (toutes les 16 minutes), nourriture, aura (lieux 127 et 191, toutes les 10 minutes), champignon
const auras=()=>[0,1,2,3].flatMap(k=>[]).concat(A.enterKinds?[...Array(256).keys()].filter(r=>A.enterKinds(r).some(k=>/^x/.test(k))):[]);
const healTo=(t)=>{ for(let k=0;k<8&&R[5]<t;k++){
    if(o('BOTTLE').pack&&(o('BOTTLE').f&0x0C)&&!R[0x3E]){ A.say('DRINK WATER'); continue; }
    if(o('FOOD').pack){ A.say('EAT FOOD'); continue; }
    const au=auras().filter(r=>A.route(r)).sort((a,b)=>A.route(a).length-A.route(b).length)[0];
    if(au!==undefined&&!R[0x13]&&A.route(au).length<12){ A.go(au); continue; }
    if(!o('MUSHROOM').hidden&&A.route(o('MUSHROOM').room)&&A.route(o('MUSHROOM').room).length<15){ get('MUSHROOM'); A.try_(()=>A.say('EAT MUSHROOM'),()=>!A.dead(),8); continue; }
    if(!o('FOOD').hidden&&A.route(o('FOOD').room)&&A.route(o('FOOD').room).length<15){ get('FOOD'); A.say('EAT FOOD'); continue; }
    break; } };
// prendre un objet lourd : on pose d'abord la lampe et la bouteille, puis ce qui ne sert plus, et on les reprend
const getHeavy=(n,after)=>{ A.safe(()=>{ const ob=o(n); if(R[0]!==ob.room) A.go(ob.room);
    const set=[]; for(const x of ['BOTTLE','LAMP']) if(o(x).pack){ A.drop(x); set.push(x); }
    A.say('GET '+n); for(const x of after||[]) A.drop(x); for(const x of set) A.say('GET '+x);
    if(!o(n).pack) throw new Error('trop lourd : '+n); },n); };
const deliver=(list,ishtar)=>{ A.safe(()=>{
    const p=A.route(202);
    if(ishtar&&R[0x34]>0) A.say('ISHTAR');
    else if(p) A.go(202);
    else { // BELROG rend le saut sûr : depuis 164 ou 203
      const c=[164,203].map(r=>({r,p:A.route(r)})).filter(x=>x.p).sort((a,b)=>a.p.length-b.p.length)[0];
      if(!c) throw new Error('pas de chemin vers la forêt');
      A.go(c.r); A.try_(()=>{ A.say('BELROG'); },()=>R[0]===202,6); }
    if(R[0]!==202) throw new Error('pas arrivé à la forêt');
    for(const t of list) A.drop(t); },'livraison'); st('livré '+list.join(',')); };
try{

get('LAMP'); get('FOOD'); get('BOTTLE'); get('MUSHROOM'); learn(0); A.drop('MUSHROOM');
get('PARCHMENT'); get('TALISMAN'); st('4e étage');
learn(1); learn(2); A.drop('TALISMAN');
get('ROPE'); learn(3);
get('SCEPTER'); A.drop('ROPE'); learn(4);
const refill=()=>{ if(A.state.oil<1800){ A.safe(()=>{ get('URN'); A.say('FILL LAMP'); A.drop('URN'); },'huile'); st('huile'); } };
A.drop('SCEPTER'); refill();
get('VIAL'); learn(5); A.drop('VIAL');
get('PENDANT'); learn(6); st('CROM');
get('TALISMAN'); get('SKULL'); A.drop('TALISMAN'); get('FLUTE'); get('SPELLBOOK'); learn(7);
A.drop('PENDANT'); A.drop('SKULL'); A.drop('SPELLBOOK'); get('ROPE');
A.safe(()=>{ A.go(201); A.try_(()=>A.say('PLAY FLUTE'),()=>R[0x36]===201,6); A.say('CLIMB LEDGE'); },'corniche'); st('corniche');
get('DIAMOND'); A.drop('ROPE');
A.safe(()=>{ A.go(R[0x35]); A.try_(()=>A.say('LOOK PIT'),()=>!o('RUBY').hidden,10); },'puits'); get('RUBY'); st('rubis'); A.drop('PARCHMENT'); A.drop('ROPE');
A.safe(()=>{ A.go(177); },'rat'); get('CROWN'); st('couronne');
deliver(['DIAMOND','RUBY','CROWN']);
A.safe(()=>A.go(33,{light:true}),'argent'); get('SILVER'); st('argent');
// saphir (lampe éteinte dans le lieu 70) et huile de l'urne, au même endroit
A.safe(()=>{ const p=A.route(70); A.go(p.length>1?p[p.length-2].to:R[0]); A.say('LAMP OFF'); A.say(p[p.length-1].cmd); if(R[0]!==70) throw new Error('pas en 70'); A.say('LAMP ON'); },'saphir');
get('SAPPHIRE'); A.safe(()=>{ A.drop('SILVER'); A.drop('SAPPHIRE'); get('URN'); A.say('FILL LAMP'); A.drop('URN'); get('SILVER'); get('SAPPHIRE'); },'huile'); st('saphir');
deliver(['SILVER','SAPPHIRE']);
// opale : entrer trois fois dans le lieu 105
A.safe(()=>{ for(let k=0;k<4&&o('OPAL').hidden;k++){ if(R[0]!==105) A.go(105); else { const e=A.edges(105).sort((a,b)=>a.cost-b.cost)[0]; A.say(e.cmd); A.go(105); } } },'opale'); get('OPAL'); st('opale');
A.drop('FLUTE'); const flute=R[0];
deliver(['OPAL']);
get('DAGGER'); get('SHIELD'); A.drop('DAGGER'); get('MACE'); get('SKULL'); A.safe(()=>{ for(let k=0;k<4;k++){ healTo(255); A.go(144); if(o('BOTTLE').pack&&R[5]<251&&!R[0x3E]) A.say('DRINK WATER'); if(R[5]>=251) break; } A.drop('BOTTLE'); A.drop('LAMP'); A.say('GET POWERRING'); A.drop('SHIELD'); A.drop('MACE'); A.drop('SKULL'); A.say('GET LAMP'); A.say('GET BOTTLE'); if(!o('POWERRING').pack||!o('LAMP').pack) throw new Error('anneau de puissance'); },'anneau de puissance'); st('puissance');
A.safe(()=>{ A.go(102); A.say('OPEN CRYPT'); },'crypte du roi'); get('POTION'); st('potion');
deliver(['POTION']);
get('AX'); getHeavy('LIGHTRING',['AX','POWERRING']); get('BASKET'); getHeavy('TRUTHRING',['BASKET']); st('anneaux');
deliver(['LIGHTRING','TRUTHRING']);
console.log('score',R[0x28]);
// diadème : la crypte s'ouvre si état - poids >= 250
get('MUSHROOM');
A.safe(()=>{ for(let k=0;k<4;k++){ healTo(255); A.go(67); if(o('MUSHROOM').pack&&R[5]<250) A.try_(()=>A.say('EAT MUSHROOM'),()=>R[5]>=250,8); if(o('BOTTLE').pack&&R[5]<250&&!R[0x3E]) A.say('DRINK WATER'); if(R[5]>=250) break; } A.drop('MUSHROOM'); A.drop('BOTTLE'); A.drop('LAMP'); A.say('OPEN CRYPT'); A.say('GET LAMP'); A.say('GET BOTTLE'); if(o('TIARA').hidden) throw new Error('crypte fermée'); },'crypte'); get('TIARA'); st('diadème');
// amulette : l'hydre
get('ROPE');
A.safe(()=>{ const hr=R[0x33]; const p=A.route(hr,undefined); 
  // passage vers l'hydre (l'hydre bloque la route : on cherche un voisin)
  const nb=[['S',8],['W',-1],['E',1],['N',-8],['D',64],['U',-64]].map(([d,s])=>({d,r:(hr-s)&255})).filter(x=>(R[0x490D+x.r]&{S:1,W:2,E:4,N:8,D:16,U:32}[x.d])&&A.route(x.r));
  const n=nb[0]; A.go(n.r); A.say(n.d); A.say('TIE HYDRA'); A.say(n.d); A.say('AKHIROM'); },'hydre'); st('hydre');
get('AMULET');
deliver(['TIARA','AMULET']);
get('FLUTE'); hunt('NYMPH'); get('GOLD'); st('or');
hunt('SCORPION'); get('FLEECE'); st('toison');
deliver(['GOLD','FLEECE']);
A.drop('FLUTE');
get('SPELLBOOK'); hunt('TROGLODYTE'); get('POWDER'); st('poudre');
deliver(['SPELLBOOK','POWDER']);
get('POWERRING'); deliver(['POWERRING']);

console.log(A.log.slice(-3).join('\n'));
// tout est-il dans la forêt ? (un saut manqué, le lutin…)
for(let t=0;t<4;t++){ const miss=[...Array(16).keys()].map(k=>32+k).filter(n=>o(n).room!==202||o(n).pack).map(n=>A.NAMES[n]);
  if(!miss.length) break; console.log('manque',miss.join(',')); for(const n of miss){ if(!o(n).pack) getHeavy(n,[]); } deliver(miss); }
console.log('SCORE',R[0x28],'attente',A.m.wait); console.log(A.log.slice(-2).join('\n'));
for(let n=32;n<=47;n++) if(n!==30&&n!==31) process.stdout.write(A.NAMES[n]+':'+o(n).room+(o(n).pack?'(sac)':'')+' '); console.log(); console.log('lutin',o('SPRITE').room,o('SPRITE').f.toString(2));


}catch(e){ console.log('ERREUR',e.message);  console.log(A.log.slice(-6).join('\n')); }
st('fin'); if(A.m.wait==='end') require('fs').writeFileSync(require('path').join(__dirname,'..','aventures','madness','solution.txt'),'# Madness and the Minotaur — une partie gagnée, niveau débutant, graine 7 (écrite par outils/madness-solution.js :\n# les énigmes changent à chaque partie, cette suite de commandes ne vaut que pour cette graine).\n@graine 7\n'+A.cmds.join('\n')+'\n');
