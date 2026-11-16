// Rejoue la solution d'une aventure (aventures/<nom>/solution.txt) dans le programme d'origine, sans navigateur,
// et vérifie qu'on arrive à la victoire.
//   node tests/rejouer-solution.js [aventure] [--sans-correctifs]        (aventure : eldiablero par défaut)
const Machine=require('../moteur/machine.js');
const name=process.argv.slice(2).find(a=>!a.startsWith('--'))||'eldiablero', adv=require('./charger.js')(name), cmds=adv.solution;
if(!cmds.length){ console.log('aventures/'+name+'/solution.txt est absent ou vide'); process.exit(1); }
let won=false, texts=0, missing=new Set();
const io={out(){},puts(){},cls(){},save(){},load(){return null;},quit(v){won=!!v;},fixes:!process.argv.includes('--sans-correctifs'),
  text(a){ texts++; const k=a.toString(16).toUpperCase().padStart(4,'0'); if(adv.FR.TEXT[k]===undefined) missing.add(k); return null; }};
const m=Machine(adv.bin,io,adv.machine), W=adv.world, vis=new Set();
let w=m.run(); m.key(32); w=m.run(); let n=0, step=-1, back=0;
for(const c of cmds){ if(w!=='line'){ console.log('arrêt avant',c,'état',w); break; }
  m.line(c); w=m.run(); n++; vis.add(W.roomOff(m.mem));
  if(adv.HINTS){ const s=adv.HINTS.step(m.mem,vis); if(s<step) back++; step=s; } }
console.log(adv.title+' : '+n+'/'+cmds.length+' commandes, état final « '+w+' », '+(won?'VICTOIRE':'pas de victoire')+', '+vis.size+' lieux visités, '+texts+' textes affichés');
console.log('textes sans traduction rencontrés : '+(missing.size?[...missing].join(' '):'aucun')+' ; retours en arrière des indices : '+back);
process.exit(won?0:1);
