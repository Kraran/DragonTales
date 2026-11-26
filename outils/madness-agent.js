// Madness and the Minotaur — un joueur automatique qui lit la mémoire du jeu, pour écrire la solution d'une graine.
// Usage : const A=require('./madness-agent.js')(graine,'NORMAL') ; A.go(150) ; A.get('LAMP') ; … ; A.cmds = les commandes.
// Les adresses sont celles de la version Dragon (voir aventures/madness/aventure.js).
const path=require('path');
const adv=require(path.join(__dirname,'..','tests','charger.js'))('madness');
const Flux=require(path.join(__dirname,'..','moteur','flux.js'));
const OBJ0=0x4851, SPELL0=0x4716, PASS=0x490D, BLOCK=0x4A0D, BETWEEN=0x46A0, JUMP0=0x4736, ENTER0=0x47E4, PROT0=0x4B0D, WEIGHT0=0x40A0, WORDS=0x411c;
const NAMES=['?','FOOD','BOTTLE','DAGGER','MACE','AX','SWORD','SHIELD','FLUTE','MUSHROOM','PENDANT','SCEPTER','LAMP','BASKET','PARCHMENT','VIAL','URN',
 'TALISMAN','SCROLL','GOBLET','SKULL','SCARAB','JEWELBOX','TABLET','ROPE','SPRITE','TROGLODYTE','SCORPION','NYMPH','SATYR','MINOTAUR','ORACLE',
 'GOLD','SILVER','DIAMOND','SPELLBOOK','RUBY','FLEECE','TIARA','POWDER','AMULET','POTION','POWERRING','LIGHTRING','TRUTHRING','CROWN','OPAL','SAPPHIRE',
 '?','?','?','?','?','?','?','VETAR','MITRA','OKKAN','AKHIROM','NERGAL','BELROG','CROM','ISHTAR'];
const num=n=>typeof n==='number'?n:NAMES.indexOf(n);
const DIRS={S:[1,8],W:[2,-1],E:[4,1],N:[8,-8],D:[16,64],U:[32,-64]}, BACKD={S:'N',N:'S',E:'W',W:'E',U:'D',D:'U'};
module.exports=function(seed,mode,opt){
  opt=opt||{};
  let out='';
  const m=Flux(adv.bin,{out(s){out+=s;},cls(){},end(){}},Object.assign({},adv.machine,{seed}));
  m.run(); const R=m.mem.raw; const cmds=[], log=[];
  function say(c){ out=''; m.line(c); m.run(); cmds.push(c); const t=out.replace(/\s+/g,' ').trim(); log.push('> '+c+' ['+R[0]+' '+R[5]+']\n'+t); if(opt.verbose) console.log('> '+c+'  ['+R[0]+' état '+R[5]+']\n  '+t); return t; }
  say(mode||'NORMAL');
  // ---- l'état ----
  const W=(()=>{ const w=[]; let p=WORDS; for(let k=0;k<256;k++){ let s=''; for(;;){ const c=R[p++]; s+=String.fromCharCode(c&0x7f); if(c&0x80) break; } w.push(s); } return w; })();
  const o=n=>{ n=num(n); const p=OBJ0+3*(n-1); return {n,room:R[p],f:R[p+2],pack:!!(R[p+2]&0x80),hidden:!!(R[p+2]&3)}; };
  const spell=k=>{ const p=SPELL0+4*k; return {o1:R[p],o2:R[p+1],room:R[p+2],known:!!(R[p+3]&0x80)}; };
  const knows=s=>spell(num(s)-55).known;
  const dex=()=>R[5]-Math.max(R[4],R[6]);                 // sauts : état moins poids, et état moins volume
  const lit=r=>r<40||r===202;
  // passages : naturels moins bouchés ; les passages à risque (téléportation au hasard) sont évités
  function between(r,d){ for(let k=0;k<27;k++){ const p=BETWEEN+4*k; const a=R[p], bit=R[p+1], h=(R[p+2]<<8)|R[p+3];
      if(a===r&&bit===DIRS[d][0]) return h; const to=(r+DIRS[d][1])&255; if(a===to&&bit===DIRS[BACKD[d]][0]) return h; } return 0; }
  function jumps(r){ const l=[]; for(let k=0;k<25;k++){ const p=JUMP0+5*k; if(R[p]===r){ l.push({to:R[p+3],need:R[p+1],fail:R[p+2],word:R[p+4]}); break; } } return l; }
  // actions à l'entrée des lieux (table $47E4, 3 octets) : la sorte dépend de la place dans la table (désassemblage CoCo)
  const ENTER_KIND=['a','b','c','d','e','f1','g','h','i','j','k','l','m','n','o','p','q1','r','q2','q3','s','t','q4','u','v','f2','32a','x1','x2','203a','213','32b','33','203b','z','232'];
  const GUARD={h:null,i:'VETAR',j:'MITRA',k:'OKKAN',l:'AKHIROM',m:'NERGAL',n:'BELROG',o:'CROM',p:'ISHTAR'};
  function enterKinds(r){ const l=[]; for(let k=0;k<ENTER_KIND.length;k++){ if(R[ENTER0+3*k]===r) l.push(ENTER_KIND[k]); } return l; }
  function roomCost(r){ let c=0;
    for(const k of enterKinds(r)){
      // gardien : sans le sortilège, on passe si un tirage dépasse poids + 128 (le sac doit être léger)
      if(k in GUARD){ const sp=GUARD[k]; if(k==='h'?!(knows('VETAR')||o('SCEPTER').pack):!knows(sp)) c+=R[4]>=110?1000:15; }
      else if(/^q/.test(k)&&!knows('NERGAL')) c+=8;
      else if(/^[abc]$/.test(k)) c+=R[4]>90?30:0;
      else if(/^f/.test(k)) c+=o('LAMP').pack?30:0;
      else if(/^32/.test(k)) c+=lit(r)||R[0x0A]?0:30; }
    // créatures qui attaquent
    for(const n of [26,29,30]){ const ob=o(n); if(ob.room===r&&!(ob.f&2)) c+=10; }
    return c; }
  function edges(r){
    const e=[]; const p=R[PASS+r]&~R[BLOCK+r];
    for(const d in DIRS){ if(!(p&DIRS[d][0])) continue; const to=(r+DIRS[d][1])&255;
      const h=between(r,d); let ok=true, cost=1;
      // routines entre deux lieux (adresses Dragon) : B 1B20→1C7?, F, G, H, I téléportent ; A C D E sont des montées difficiles
      if(h&&!BETWEEN_OK(h,d)) ok=false;
      if(h&&'BFGHI'.includes(BH[h])) cost=60;          // passages qui téléportent au hasard : en dernier recours
      if(to===R[0x33]&&R[0x0E]!==0xAA&&R[0x0E]!==1&&opt.hydra!==false) ok=false;   // l'hydre repousse
      const rc=roomCost(to); if(rc>=1000) ok=false;
      if(ok) e.push({d,to,cost:cost+rc,cmd:d}); }
    for(const j of jumps(r)){ const safe=dex()>=j.need+(opt.margin||5);
      // BELROG fait le saut à coup sûr (20 points d'état)
      if(!safe&&knows('BELROG')&&R[5]>60&&roomCost(j.to)<1000){ e.push({d:'J',to:j.to,cost:6+roomCost(j.to),cmd:'BELROG',jump:j}); continue; }
      if(!safe||roomCost(j.to)>=1000) continue;
      e.push({d:'J',to:j.to,cost:1+roomCost(j.to),cmd:'JUMP'+(j.word===0xFF?'':' '+W[j.word]),jump:j}); }
    // BACK ramène au lieu précédent si l'on vient d'arriver (moins de 15 secondes)
    if(r===R[0]&&R[1]!==R[0]&&((R[0x4C]<<8)|R[0x4D])<15) e.push({d:'B',to:R[1],cost:2,cmd:'BACK'});
    return e;
  }
  let BETWEEN_OK=(h,d)=>{ const k=BH[h]; if(!k) return true;
    if('BFGHI'.includes(k)) return !opt.noTeleport;
    if(d!=='U') return true;
    const need={A:192,C:192,D:64,E:128}[k]; return dex()>=need; };
  const BH={};  // routine → lettre, rempli plus bas à partir de la table
  (()=>{ const seen=[]; for(let k=0;k<27;k++){ const p=BETWEEN+4*k; const h=(R[p+2]<<8)|R[p+3]; if(!seen.includes(h)) seen.push(h); }
    // ordre de la table CoCo : A(1AFB) B(1B20) C(1B03) D(1B06) E(1B09) F(1B34) G(1B5F) H(1B43) I(1B4A) ; Dragon : même ordre relatif
    const coco={0x1AFB:'A',0x1B20:'B',0x1B03:'C',0x1B06:'D',0x1B09:'E',0x1B34:'F',0x1B5F:'G',0x1B43:'H',0x1B4A:'I'};
    const off=0xB39;                                                   // code Dragon = code CoCo + $B39
    for(const h of seen) BH[h]=coco[h-off]||'?'; })();
  function route(to,from){
    from=from===undefined?R[0]:from; if(from===to) return [];
    const dist=new Map([[from,0]]), prev=new Map([[from,null]]), done=new Set(); const q=[from];
    while(q.length){ q.sort((a,b)=>dist.get(a)-dist.get(b)); const r=q.shift(); if(done.has(r)) continue; done.add(r);
      if(r===to){ const p=[]; let x=to; while(prev.get(x)){ p.unshift(prev.get(x).e); x=prev.get(x).r; } return p; }
      for(const e of edges(r)){ const d=dist.get(r)+e.cost; if(!dist.has(e.to)||d<dist.get(e.to)){ dist.set(e.to,d); prev.set(e.to,{r,e}); q.push(e.to); } } }
    return null;
  }
  function light(to){ if(!lit(to)&&o('LAMP').pack&&!R[0x0A]) say('LAMP ON');
    else if(lit(to)&&lit(R[0])&&R[0x0A]&&opt.saveOil) say('LAMP OFF'); }
  const dead=()=>m.wait!=='line'&&m.wait!=='end';   // 'end' : la partie est gagnée
  function try_(act,ok,n){ const s=snap(); let best=null;
    for(let k=0;k<(n||8);k++){ if(k){ back(s); for(let i=0;i<k;i++) say(i%3===2?'WAIT':'LOOK'); }
      act(); if(!dead()&&ok()) return true; }
    // aucun essai ne marche : on garde le dernier s'il n'est pas mortel, sinon le premier
    if(dead()){ back(s); act(); }
    return false; }
  // une étape qui peut mal finir : en cas de mort, on revient en arrière et on laisse passer du temps avant de réessayer
  function safe(fn,label){
    for(let t=0;t<12;t++){ const s=snap(); let err=null;
      try{ fn(); }catch(e){ err=e; }
      if(!dead()&&!err) return;
      if(err&&!dead()&&!/partie finie/.test(err.message)) throw err;
      if(opt.verbose||process.env.TRACE) console.log('  !! '+(label||'')+' : '+(err?err.message:'mort')+' — nouvel essai '+(t+1));
      back(s); if(R[0x0A]) say('LAMP OFF'); for(let k=0;k<=t%4;k++) say('WAIT'); }
    throw new Error('échec répété : '+label);
  }
  function snap(){ return {s:m.snapshot(),n:cmds.length,l:log.length}; }
  function back(x){ m.restore(x.s); cmds.length=x.n; log.length=x.l; }
  function get(n){ n=num(n); const ob=o(n); if(ob.pack) return; if(ob.room!==R[0]||ob.hidden) go(ob.room); say('GET '+NAMES[n]); if(!o(n).pack) throw new Error('pas pu prendre '+NAMES[n]+' : '+log[log.length-1]); }
  function drop(n){ n=num(n); if(!o(n).pack) return; say('DROP '+NAMES[n]); }
  function heal(min){ min=min||200;
    for(let k=0;k<6&&R[5]<min;k++){
      if(o('FOOD').pack){ say('EAT FOOD'); continue; }
      if(o('BOTTLE').pack){ const before=R[5]; say('DRINK WATER'); if(R[5]>before) continue; }
      break; } }
  function go(to,o2){
    o2=o2||{};
    for(let n=0;n<400&&R[0]!==to;n++){
      if(m.wait!=='line') throw new Error('partie finie : '+log.slice(-3).join(' | '));
      let p=route(to);
      if(!p&&R[0x34]>0&&knows('ISHTAR')){ say('ISHTAR'); p=route(to); }      // pris au piège : ISHTAR ramène à la forêt
      if(!p) throw new Error('pas de chemin de '+R[0]+' à '+to);
      const e=p[0]; if(o2.light&&e.to===to&&o('LAMP').pack&&!R[0x0A]) say('LAMP ON'); else light(e.to); const before=R[0];
      // le hasard du jeu est fixé par les commandes : si le pas échoue (repoussé, téléporté, blessé), on revient en
      // arrière et on fait d'abord passer quelques secondes (LOOK) pour tomber sur un autre tirage
      const w0=R[4]; try_(()=>say(e.cmd),()=>R[0]===e.to&&R[4]>=w0,8);
      if(R[0]!==e.to&&opt.verbose) console.log('  (arrivé en '+R[0]+' au lieu de '+e.to+')');
    }
    if(R[0]!==to) throw new Error('impossible d’atteindre '+to);
  }
  return {try_,enterKinds,roomCost,m,R,o,spell,knows,dex,edges,route,go,say,cmds,log,W,NAMES,BH,get,drop,heal,safe,lit,dead,
    get state(){ return {room:R[0],phys:R[5],weight:R[4],bulk:R[6],lamp:R[0x0A],oil:(R[0x38]<<8)|R[0x39]}; },
    snap,back};
};
