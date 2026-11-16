// Rejoue une solution dans le programme d'origine, sans navigateur, et vérifie qu'on arrive à la victoire.
//   node tests/rejouer-solution.js eldiablero <solution.txt> [--sans-correctifs]
// La solution est une suite de commandes anglaises séparées par des virgules, après une ligne START.
const fs=require('fs'), path=require('path');
const Machine=require('../moteur/machine.js'), adv=require('./charger.js')(process.argv[2]);
const raw=fs.readFileSync(process.argv[3],'utf8');
let body=raw.slice(raw.indexOf('START')).replace(/\([^)]*\)/g,' ').replace(/\r/g,''), cmds=[];
for(const line of body.split('\n')){ if(/^[A-Z ,\-]+$/.test(line.trim())&&!/,/.test(line)) continue;
  for(let c of line.split(/[,.]/)){ c=c.trim(); if(c) cmds.push(c); } }
const D={W:'GO WEST',N:'GO NORTH',E:'GO EAST',S:'GO SOUTH'};
cmds=cmds.map(c=>{ const u=c.toUpperCase(); return D[u]||u.replace('CACTUW','CACTUS').replace('BEETLEW','BEETLES'); });
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
