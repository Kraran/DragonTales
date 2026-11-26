// DragonTales — machine « à flux » : un jeu en code machine 6809 dont on lit le texte caractère par caractère, comme un
// jeu en BASIC (chaque ligne affichée part vers io.out, traduite ensuite par la fiche). Écrite pour Madness and the
// Minotaur (Spectral Associates), qui tourne en temps réel : une interruption 60 fois par seconde fait vivre le labyrinthe.
// cfg (fourni par l'aventure) :
//   load, entry, stack          chargement, départ, pile
//   rom(mem)                    remplit la ROM absente ($8000-$BFFF) : le jeu y lit son hasard
//   outHook, outSkip            routine(s) qui reçoivent chaque caractère (A) ; adresses de retour à ignorer (échos, reprises)
//   keyWait, lineRet, endRet    attente de touche de la ROM ; retour qui signifie « saisie d'une commande » ; « rejouer ? »
//   inkey                       lecture du clavier sans attente (écran titre : on y compte les tours pour le hasard)
//   cls, nop                    effacement d'écran ; appels de ROM sans effet ici
//   irq:{vec,hz}                routine d'interruption et sa fréquence ; seconds : secondes qui passent à chaque commande
//   victory                     expression du texte de victoire (fin de partie gagnée plutôt que « rejouer ? »)
//   traps:{adr:'TEXTE'}         routines remplacées : le texte s'affiche et la routine rend la main (RTS)
//   patches:{adr:[octets]}      correctifs du programme d'origine, posés à chaque chargement
//   modes:{MOT:{seconds,patches,label}}, modeAddr   niveaux proposés avant la partie (le mot choisi est la première
//                               commande) ; le choix est noté en mémoire (modeAddr : 1, 2…) pour les sauvegardes
//   wait:{re,seconds,text}      commande ajoutée : laisser passer le temps (ATTENDRE)
//   seed                        hasard fixé (essais) : nombre de tours d'attente à l'écran titre
const CPU6809F=(typeof window!=='undefined'&&window.CPU6809)||require('./cpu6809.js');   // dans la page : la fonction globale de cpu6809.js
function Flux(bin,io,cfg){
  const mem=new Uint8Array(65536), hooks=new Set([].concat(cfg.outHook)), skip=new Set(cfg.outSkip||[]), nop=new Set(cfg.nop||[]), hz=cfg.irq?cfg.irq.hz||60:60, traps=cfg.traps||null;
  let cpu, wait=null, queue=[], buf='', spins=0, spinMax=0, recent='', yesNo=false;
  const b64=u=>{ let s=''; for(let i=0;i<u.length;i+=0x8000) s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000)); return btoa(s); };
  const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  function reset(){
    mem.fill(0); if(cfg.rom) cfg.rom(mem); mem.set(bin,cfg.load); patch(cfg.patches);
    cpu=CPU6809F(mem); cpu.S=cfg.stack||0x7F00; cpu.PC=cfg.entry===undefined?cfg.load:cfg.entry;
    wait=null; queue=[]; buf=''; spins=0; recent=''; yesNo=false;
    spinMax=cfg.seed!==undefined?cfg.seed:Math.floor(Math.random()*5000);
  }
  const MODES=cfg.modes?Object.keys(cfg.modes):[];
  function patch(p){ if(p) for(const a in p) mem.set(p[a],+a); }
  const modeOf=()=>MODES.length?MODES[mem[cfg.modeAddr]-1]||null:null;
  const choosing=()=>MODES.length>0&&!modeOf();
  const seconds=()=>{ const md=modeOf(); return md&&cfg.modes[md].seconds!==undefined?cfg.modes[md].seconds:cfg.seconds||0; };
  function flush(){ if(buf){ io.out(buf); buf=''; } }
  function emit(a){
    if(a===8){ buf=buf.slice(0,-1); recent=recent.slice(0,-1); return; }
    const ch=a===13?'\n':a>=32?String.fromCharCode(a&0x7f):''; if(!ch) return;
    buf+=ch; recent=(recent+ch).slice(-600); if(ch==='\n') flush();
  }
  // un pas de la machine ; renvoie faux quand il faut s'arrêter (attente)
  function step(){
    const pc=cpu.PC;
    if(hooks.has(pc)){ const ret=(mem[cpu.S]<<8)|mem[cpu.S+1]; if(!skip.has(ret)) emit(cpu.A); }
    if(traps&&traps[pc]!==undefined){ for(const ch of traps[pc]) emit(ch.charCodeAt(0)); emit(13); cpu.rts(); return true; }
    if(pc>=0x8000){
      const ret=(mem[cpu.S]<<8)|mem[cpu.S+1];
      if(pc===cfg.keyWait){
        if(queue.length){ cpu.A=queue.shift(); cpu.setZ(false); cpu.rts(); return true; }
        if(ret===cfg.endRet&&cfg.victory&&cfg.victory.test(recent)){ wait='end'; io.end&&io.end(); }
        else if(ret===cfg.lineRet) wait='line';
        else { wait='key'; yesNo=ret===cfg.endRet; if(yesNo) io.end&&io.end(); }
        flush(); return false;
      }
      if(pc===cfg.inkey){                        // écran titre : on attend un nombre de tours qui fixe le hasard de la partie
        if(spins>spinMax) spinMax=spins+(cfg.seed!==undefined?cfg.seed+1:Math.floor(Math.random()*5000));   // nouvelle partie après une fin
        if(spins++<spinMax){ cpu.A=0; cpu.setZ(true); } else { cpu.A=32; cpu.setZ(false); } cpu.rts(); return true; }
      if(pc===cfg.cls){ flush(); io.cls(); cpu.rts(); return true; }
      if(nop.has(pc)){ cpu.rts(); return true; }
      throw new Error('Appel ROM non géré $'+pc.toString(16)+' (retour $'+ret.toString(16)+')');
    }
    cpu.step(); return true;
  }
  function run(){ if(wait==='line'||wait==='key'||wait==='end') return wait; if(choosing()){ wait='line'; return wait; } let n=0;
    while(step()){ if(++n>30000000) throw new Error('boucle infinie ? PC=$'+cpu.PC.toString(16)); }
    return wait; }
  // le temps passe (secondes) pendant que le jeu attend : l'interruption tourne, ce qu'elle affiche part vers io.out
  function tick(sec){
    if(!cfg.irq||wait!=='line') return wait;
    const ticks=Math.round(sec*hz);
    for(let i=0;i<ticks&&wait==='line';i++){
      if(!cpu.irq(cfg.irq.vec)) break;
      wait=null; let n=0; while(step()){ if(++n>3000000) throw new Error('interruption sans fin ? PC=$'+cpu.PC.toString(16)); }
    }
    return wait;
  }
  reset();
  return {
    kind:'flux',
    get wait(){ return wait; }, get yesNo(){ return yesNo; },
    run,
    tick,
    line(s){ if(wait!=='line') return; s=String(s).toUpperCase().trim();
      if(choosing()){ const k=MODES.indexOf(s.split(' ')[0]); if(k<0) return; mem[cfg.modeAddr]=k+1; patch(cfg.modes[s.split(' ')[0]].patches); wait=null; return; }
      if(cfg.wait&&cfg.wait.re.test(s)){ tick(cfg.wait.seconds); if(wait==='line'){ for(const ch of cfg.wait.text) emit(ch.charCodeAt(0)); emit(13); } return; }
      const sec=seconds(); if(sec) tick(sec); if(wait!=='line') return;
      queue=[...String(s).toUpperCase().slice(0,cfg.maxLen||30)].map(c=>c.charCodeAt(0)&127).concat(13); wait=null; },
    key(c){ if(wait!=='key'&&wait!=='end') return; queue=[typeof c==='number'?c:String(c||' ').toUpperCase().charCodeAt(0)]; wait=null; yesNo=false; },
    reset,
    mem:{ b:a=>mem[a&0xffff], w:a=>(mem[a&0xffff]<<8)|mem[(a+1)&0xffff], raw:mem, mode:modeOf, choosing },
    snapshot(){ return {m:JSON.stringify({r:b64(mem.subarray(0,0x8000)),c:cpu.dump(),w:wait,q:queue,y:yesNo,t:recent}),c:{}}; },
    restore(s){ const o=JSON.parse(typeof s.m==='string'?s.m:new TextDecoder().decode(s.m));
      mem.set(unb64(o.r),0); cpu.load(o.c); wait=o.w; queue=o.q||[]; yesNo=!!o.y; recent=o.t||''; buf=''; }
  };
}
if(typeof module!=='undefined') module.exports=Flux;
