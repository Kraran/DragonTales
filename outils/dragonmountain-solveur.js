// Cherche des graines pour lesquelles une stratégie simple gagne Dragon Mountain (le jeu place objets et monstres au hasard),
// et écrit la suite de commandes gagnante. Sert à fabriquer aventures/dragonmountain/solution.txt.
//   node outils/dragonmountain-solveur.js [première graine] [nombre de graines]
const Basic=require('../moteur/basic.js');const fs=require('fs');const path=require('path');
const adv=require('../tests/charger.js')('dragonmountain'), bin=adv.bin;   // avec les corrections de la fiche
const NAMES={7:'LAMP',8:'FLASK',9:'BRACELET',10:'CLOAK',11:'KEY',12:'SWORD',13:'GOBLET',14:'TORCH',15:'PLATE',16:'CROWN',17:'DAGGER',18:'SPELLBOOK',19:'AXE',20:'FOOD',21:'FOOD',22:'FOOD',23:'WATER',24:'WATER'};
const DIRW=[null,'UP','DOWN','NORTH','SOUTH','EAST','WEST'];
function attempt(seed,verbose){
  let buf='';const b=Basic(bin,{out(s){buf+=s;}},Object.assign({},adv.machine,{seed}));
  let w=b.run(); const cmds=[]; const M=b.mem;
  const R=()=>M.v('R'), L=i=>M.a('L',i), P=(r,d)=>M.a('P',r,d);
  let last='';
  function cmd(c){ if(w!=='line') throw new Error('fin: '+last.slice(-200)); buf=''; cmds.push(c); b.line(c); w=b.run(); last=buf; if(verbose) process.stdout.write('> '+c+'\n'+buf);
    if(w==='end'){ if(/ALL THE TREASURE/.test(buf)) throw {win:true}; throw new Error('mort: '+buf.replace(/\n/g,' | ').slice(-160)); }
    react(); }
  function react(){ // répondre aux rencontres
    for(let k=0;k<6;k++){
      if(M.v('DP')===1){ if(L(17)!==0) throw new Error('dragon sans dague'); cmd('KILL DRAGON'); continue; }
      if(M.v('DE')===1){ if(L(12)!==0) throw new Error('démon sans épée'); cmd('KILL DEMON'); continue; }
      if(M.v('EP')===1){ if(![9,13,15,16].some(i=>L(i)===0)) throw new Error('elfe sans or'); cmd('BRIBE ELF'); continue; }
      break;
    }
  }
  function path(to){ // BFS sur les passages ouverts
    const prev=new Map([[R(),null]]), q=[R()];
    while(q.length){ const r=q.shift(); if(r===to) break;
      for(let d=1;d<=6;d++){ const n=P(r,d); if(n>=1&&n<=35&&!prev.has(n)){ prev.set(n,[r,d]); q.push(n);} } }
    if(!prev.has(to)) return null;
    const out=[]; let r=to; while(prev.get(r)){ const [p,d]=prev.get(r); out.unshift(d); r=p; } return out;
  }
  function goTo(to){ let guard=0; while(R()!==to){ if(++guard>60) throw new Error('égaré'); const p=path(to); if(!p) return false; cmd('GO '+DIRW[p[0]]); } return true; }
  function fetch(i){ if(L(i)===0) return true; const r=L(i); if(r<1||r>35) return false; if(!goTo(r)) return false; cmd('GET '+NAMES[i]); return L(i)===0; }
  try{
    // en bas : manteau, épée, clé, nourriture, gourde et eau, deux objets en or, sommeil
    fetch(10); cmd('WEAR CLOAK');
    if(!fetch(20)&&!fetch(21)&&!fetch(22)) throw new Error('pas de nourriture'); cmd('EAT FOOD');
    fetch(8); if(!(fetch(24)||fetch(23))) throw new Error('pas d’eau'); cmd('DRINK WATER'); cmd('LEAVE FLASK');
    fetch(12); fetch(11);
    let gold=0; for(const i of [9,13,15]) if(gold<3&&fetch(i)) gold++;
    cmd('SLEEP');
    goTo(22); cmd('UNLOCK DOOR'); cmd('OPEN DOOR'); cmd('LEAVE KEY');
    // en haut : ouvrir les portes noires, prendre la dague et la couronne
    const doors=[[27,3],[29,5],[31,6]];
    for(let pass=0;pass<3;pass++){
      for(const [r,d] of doors) if(P(r,d)===300 && path(r)){ goTo(r); cmd('OPEN DOOR'); cmd('ORIMIAH'); }
      if(L(17)!==0) fetch(17);
      if(L(16)>=26&&L(16)<=35) fetch(16);
    }
    if(L(17)!==0) throw new Error('dague introuvable');
    // errer en haut jusqu'à ce que le passage vers le trésor s'ouvre
    let guard=0;
    while(P(30,1)!==35){ if(++guard>80) throw new Error('rencontres incomplètes');
      const rooms=[26,27,28,29,30,31,32,33,34].filter(r=>r!==R()&&path(r)); goTo(rooms[(guard*7)%rooms.length]); }
    goTo(35); cmd('GO WEST');
    throw new Error('pas de victoire');
  }catch(e){ if(e&&e.win) return {win:true,cmds}; return {win:false,cmds,why:String(e.message||e)}; }
}
if(require.main===module){
  const from=+process.argv[2]||1, n=+process.argv[3]||200; const why={};
  for(let s=from;s<from+n;s++){ const r=attempt(s); if(r.win){ console.log('graine',s,'gagne en',r.cmds.length,'commandes'); if(!process.argv[4]){ console.log(r.cmds.join(', ')); break;} } else why[r.why.slice(0,40)]=(why[r.why.slice(0,40)]||0)+1; }
  console.log(why);
}
module.exports=attempt;
