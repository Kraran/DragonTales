// Rejoue la solution d'une aventure (aventures/<nom>/solution.txt) dans le programme d'origine, sans navigateur,
// et vérifie qu'on arrive à la victoire.
//   node tests/rejouer-solution.js [aventure] [--sans-correctifs]        (aventure : eldiablero par défaut)
const Machine=require('../moteur/machine.js');
const name=process.argv.slice(2).find(a=>!a.startsWith('--'))||'eldiablero', adv=require('./charger.js')(name), cmds=adv.solution;
if(!cmds.length){ console.log('aventures/'+name+'/solution.txt est absent ou vide'); process.exit(1); }
const basic=adv.machine.kind==='basic';
let won=false, texts=0, missing=new Set(), shown='';
const io={out(s){ shown+=s; },puts(){},cls(){},save(){},load(){return null;},quit(v){won=!!v;},fixes:!process.argv.includes('--sans-correctifs'),
  text:basic?undefined:(a=>{ texts++; const k=a.toString(16).toUpperCase().padStart(4,'0'); if(adv.FR.TEXT[k]===undefined) missing.add(k); return null; })};
const m=basic?require('../moteur/basic.js')(adv.bin,io,{seed:adv.seed}):Machine(adv.bin,io,adv.machine), W=adv.world, vis=new Set();
let w=m.run(); if(!basic){ m.key(32); w=m.run(); } let n=0, step=-1, back=0;
for(const c of cmds){ if(w!=='line'){ console.log('arrêt avant',c,'état',w); break; }
  m.line(c); w=m.run(); n++; vis.add(W.roomOff(m.mem));
  if(adv.HINTS){ const s=adv.HINTS.step(m.mem,vis); if(s<step) back++; step=s; } }
if(basic){ won=w==='end'&&adv.machine.victory.test(shown.slice(-400)); texts=shown.split('\n').length; }
console.log(adv.title+' : '+n+'/'+cmds.length+' commandes, état final « '+w+' », '+(won?'VICTOIRE':'pas de victoire')+', '+vis.size+' lieux visités, '+texts+(basic?' lignes affichées':' textes affichés')+(adv.seed!==undefined?', graine '+adv.seed:''));
if(!basic) console.log('textes sans traduction rencontrés : '+(missing.size?[...missing].join(' '):'aucun')+' ; retours en arrière des indices : '+back);
process.exit(won?0:1);
