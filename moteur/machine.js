// DragonTales — machine hôte : charge le binaire d'origine d'une aventure et remplace les appels à la ROM du Dragon 32/64.
// cfg (fourni par l'aventure, tout est facultatif sauf load) :
//   load      adresse de chargement et d'exécution du binaire
//   stack     pile de départ (défaut $7F00)
//   textHook  adresse de la routine d'affichage du jeu (X = adresse du texte) ; permet la traduction et le journal bilingue
//   textEnd   octet qui termine un texte (défaut '#'), textLimit : borne de recherche de cette fin
//   victory   adresse atteinte quand la partie est gagnée (si le jeu boucle au lieu de rendre la main)
//   titleRet  adresse de retour de l'attente de touche de l'écran titre
//   cloadAt   adresse où CLOAD recharge une partie
//   afterRun(mem,wait)  appelé à chaque arrêt (correctifs du programme d'origine)
const CPU6809=(typeof require!=='undefined')?require('./cpu6809.js'):window.CPU6809;
function Machine(bin,io,cfg){
  cfg=cfg||{}; // io: {out(ch), cls(), save(bytes), load()->bytes|null, quit()}
  const mem=new Uint8Array(65536);
  const LOAD=cfg.load, TEND=cfg.textEnd===undefined?0x23:cfg.textEnd, TLIM=cfg.textLimit||0x8000, H_OUT=0xFF00, H_KEY=0xFF02;
  let cpu, wait=null, yn=false; // wait: null | 'key' | 'line' | 'end'
  function reset(){
    mem.fill(0); mem.set(bin,LOAD);
    mem[0xA000]=H_KEY>>8;mem[0xA001]=H_KEY&255;mem[0xA002]=H_OUT>>8;mem[0xA003]=H_OUT&255;
    cpu=CPU6809(mem); cpu.S=cfg.stack||0x7F00; cpu.PC=LOAD; wait=null; yn=false;
  }
  function run(){ // exécute jusqu'à ce qu'une entrée soit nécessaire
    let n=0;
    while(!wait){
      const pc=cpu.PC;
      if(pc===cfg.textHook && io.text){          // routine d'affichage du jeu : X = adresse du texte
        const t=io.text(cpu.X);
        if(t!=null){ io.puts(t); let x=cpu.X; while(mem[x]!==TEND && x<TLIM) x++;
          cpu.X=x+1; cpu.B=0x20; cpu.setZ(true); cpu.rts(); continue; }
      }
      if(pc===cfg.victory){ wait='end'; io.quit(true); break; }   // victoire : le jeu d'origine boucle indéfiniment
      if(pc>=0x8000){
        switch(pc){
          case H_OUT: io.out(cpu.A); cpu.rts(); break;
          case H_KEY: { const ret=(mem[cpu.S]<<8)|mem[cpu.S+1];
            if(ret===cfg.titleRet){wait='key';break;}      // écran titre : attend une touche
            cpu.A=0; cpu.setZ(true); cpu.rts(); break; }
          case 0xBA77: io.cls(); cpu.rts(); break;
          case 0xB5C9: wait='line'; break;          // saisie d'une ligne dans $02DD
          case 0xB538: wait='key'; yn=true; break;           // attente d'une touche (O/N)
          case 0xB3B4: wait='end'; io.quit(); break; // retour au BASIC
          case 0xB6A6: io.save(mem.slice(mem[0x19]<<8|mem[0x1A],(mem[0x1B]<<8|mem[0x1C])+1)); cpu.rts(); break;
          case 0xA095: { const d=io.load(); if(d)mem.set(d,cfg.cloadAt); cpu.rts(); break; }
          default: throw new Error('Appel ROM non géré $'+pc.toString(16));
        }
      } else cpu.step();
      if(++n>20000000) throw new Error('boucle infinie ? PC=$'+cpu.PC.toString(16));
    }
    if(cfg.afterRun && io.fixes!==false) cfg.afterRun(mem,wait);
    return wait;
  }
  function key(ch){ if(wait!=='key')return; cpu.A=ch&255; cpu.setZ(false); cpu.rts(); wait=null; yn=false; }
  function line(s){ if(wait!=='line')return;
    s=s.toUpperCase().slice(0,60); let i=0;
    for(;i<s.length;i++)mem[0x02DD+i]=s.charCodeAt(i)&127; mem[0x02DD+i]=0;
    cpu.X=0x02DC; cpu.B=s.length; cpu.CC&=~1; cpu.rts(); wait=null; }
  reset();
  return {mem,run,key,line,reset,get wait(){return wait;},get yesNo(){return yn;},
    snapshot(){return {m:mem.slice(0,0x8000),c:cpu.dump(),w:wait};},
    restore(s){mem.set(s.m,0);cpu.load(s.c);wait=s.w;yn=false;}};
}
if(typeof module!=='undefined')module.exports=Machine;
