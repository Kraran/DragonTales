// Cherche les fins (morts) d'une aventure : rejoue la solution et, à chaque état différent rencontré, essaie toutes les
// commandes verbe + nom (et les déplacements, et l'attente) ; note le texte qui précède chaque mort.
//   node outils/fins-explorer.js <aventure> [--max N]
const path=require('path');
const name=process.argv[2]||'eldiablero', adv=require(path.resolve(__dirname,'..','tests','charger.js'))(name);
const basic=adv.machine.kind==='basic', W=adv.world;
let shown='', addrs=[], won=false;
const io={out(s){ shown+=s; },puts(){},cls(){},save(){},load(){return null;},quit(v){won=!!v;},fixes:true,
  text:basic?undefined:(a=>{ addrs.push(a); return ''; })};
const m=basic?require('../moteur/basic.js')(adv.bin,io,Object.assign({},adv.machine,{seed:adv.seed})):require('../moteur/machine.js')(adv.bin,io,adv.machine);
let w=m.run(); if(!basic){ m.key(32); w=m.run(); }
const keys=()=>{ let g=0; while(w==='key'&&!m.yesNo&&g++<50){ const k=W.autoKey&&W.autoKey(m.mem); m.key(k||' '); w=m.run(); } };
keys();
const txt=a=>{ let s=''; for(let x=a;m.mem[x]!==0x23&&s.length<90;x++) s+=String.fromCharCode(m.mem[x]); return s.replace(/%/g,' '); };
const hex4=v=>v.toString(16).toUpperCase().padStart(4,'0');
const verbs=[...new Set(adv.verbs.map(v=>v[0]))].filter(v=>!/^(SAVE|LOAD|CSAVE|CLOAD|QUIT|INV|INVENTORY|LOOK|HELP|SCORE)$/.test(v));
const nouns=[...new Set(Object.values(adv.FR.NOUNS))].filter(n=>typeof n==='string'&&/^[A-Z]+$/.test(n));
const dirs=Object.values(W.dirs||{N:'N',S:'S',E:'E',W:'W',U:'U',D:'D'}).map(d=>W.go?W.go(d):d);
const deaths=new Map(), full=new Map();
function dead(){ return basic?(w==='end'&&!(adv.machine.victory&&adv.machine.victory.test(shown.slice(-400)))):(w==='key'&&m.yesNo); }
function key(){ // identifiant de la mort : adresse du dernier texte avant l'annonce (code machine) ou dernières lignes (BASIC)
  if(!basic){ const a=addrs.slice(0,-1); return a.slice(-2).map(x=>hex4(x)+' '+txt(x)).join(' + '); }
  return shown.replace(/\s+$/,'').split('\n').filter(l=>l.trim()).slice(-3).join(' | ').slice(0,200);
}
function tryCmd(snap,c,via){
  m.restore(snap); shown=''; addrs=[]; w=m.wait; try{ m.line(c); w=m.run(); keys(); }catch(e){ errs++; return false; }
  if(dead()){ const k=key(); if(!deaths.has(k)) { deaths.set(k,via.concat(c)); full.set(k,basic?shown.slice(-600):addrs.map(x=>hex4(x)+' '+txt(x)).join('\n      ')); } return true; }
  return false;
}
const seen=new Set(); const MAX=+(process.argv[process.argv.indexOf('--max')+1])||1e9, DEEP=process.argv.includes('--profond');
let path0=[], tried=0, errs=0;
const stateKey=()=>basic?JSON.stringify(m.snapshot().m).replace(/"lbuf":"[^"]*"/,''):Buffer.from(m.mem.slice(0x0F03,0x101B)).toString('hex');
const WAITCMD=basic?'LOOK':'LOOK';
function scan(snap,via){
  const cmds=[...dirs, ...verbs.flatMap(v=>[v,...nouns.map(n=>v+' '+n)])];
  for(const x of cmds){ tryCmd(snap,x,via); tried++; }
  // attendre : plusieurs tours sans rien faire (dangers à retardement)
  m.restore(snap); w=m.wait; const v2=via.slice();
  for(let i=0;i<15&&w==='line';i++){ shown=''; addrs=[]; try{ m.line(WAITCMD); w=m.run(); keys(); }catch(e){ break; } v2.push(WAITCMD); if(dead()){ const k=key(); if(!deaths.has(k)){ deaths.set(k,v2.slice()); full.set(k,basic?shown.slice(-600):addrs.map(x=>hex4(x)+' '+txt(x)).join('\n      ')); } break; } }
}
function visit(via){ if(w!=='line') return null; const k=stateKey(); if(seen.has(k)) return null; seen.add(k); const snap=m.snapshot(); scan(snap,via); m.restore(snap); w=m.wait; return snap; }
for(const c of [null,...adv.solution]){
  if(c){ m.line(c); w=m.run(); keys(); path0.push(c); }
  if(w!=='line') break;
  if(seen.size>MAX) break;
  const here=m.snapshot();
  visit(path0.slice());
  if(DEEP) for(const d of dirs){ m.restore(here); w=m.wait; try{ m.line(d); w=m.run(); keys(); }catch(e){ continue; }
    const s1=visit(path0.concat(d)); if(!s1) continue;
    for(const d2 of dirs){ m.restore(s1); w=m.wait; try{ m.line(d2); w=m.run(); keys(); }catch(e){ continue; } visit(path0.concat(d,d2)); } }
  m.restore(here); w=m.wait;
  process.stderr.write('\r'+seen.size+' états, '+tried+' essais, '+deaths.size+' morts, '+errs+' erreurs   ');
}
console.log('\n'+adv.title+' : '+deaths.size+' fins trouvées');
for(const [k,v] of deaths) console.log('---\n'+k+'\n   par : … '+v.slice(-3).join(' / ')+'  (coup '+v.length+')'+(process.argv.includes('--detail')?'\n      '+full.get(k):''));
