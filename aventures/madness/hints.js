// Madness and the Minotaur — indices des pièces magiques. Tout est tiré au hasard à chaque partie : le second indice
// de chaque étape lit la mémoire du jeu au moment où l'on dépense la pièce (HINTS.args) et nomme les lieux et les objets
// de la partie en cours. Un texte peut donc être une fonction (args, langue, titre d'un lieu).
// Étapes : la lampe, les huit sortilèges dans l'ordre, puis les seize trésors (le premier qui manque dans la forêt).
const HINTS=(function(){
const OBJ0=0x4851, SPELL0=0x4716, ENTER0=0x47E4, HOLD0=0x47C4, PROT0=0x4B0D;
const B=(m,a)=>m.b(a);
const ob=(m,n)=>({room:B(m,OBJ0+3*(n-1)),f:B(m,OBJ0+3*(n-1)+2)});
const inPack=(m,n)=>!!(ob(m,n).f&0x80);
const known=(m,k)=>!!(B(m,SPELL0+4*k+3)&0x80);
const SPELLS=['VETAR','MITRA','OKKAN','AKHIROM','NERGAL','BELROG','CROM','ISHTAR'];
const WORD=n=>n>=55&&n<=62?SPELLS[n-55]:MM_WORDS[n-1];
const name=(n,lang)=>n>=55?SPELLS[n-55]:lang==='fr'?mmLe(MM_WORDS[n-1]):'the '+MM_WORDS[n-1].toLowerCase();
const fem=n=>n<55&&(MM_OBJ[MM_WORDS[n-1]]||[])[1]==='f';
// ce qu'il faut avoir : les objets à porter, puis les sortilèges à connaître
const needs=(a,lang)=>{ const o=a.filter(n=>n<55), sp=a.filter(n=>n>=55), fr=lang==='fr';
  return (o.length?(fr?'porter ':'carry ')+list(o,lang):'')+(o.length&&sp.length?(fr?(o.length>1?', et ':' et '):(o.length>1?', and ':' and ')):'')+(sp.length?(fr?'connaître ':'know ')+list(sp,lang):''); };
const list=(a,lang)=>{ const l=a.map(n=>name(n,lang)); const et=lang==='fr'?' et ':' and '; return l.length>1?l.slice(0,-1).join(', ')+et+l[l.length-1]:l[0]||''; };
// ce qu'il faut porter pour prendre un objet protégé ou tuer une créature (listes tirées au début de la partie)
function combo(m,n){ let p=PROT0;
  for(let g=0;g<20&&B(m,p)!==0xFF;g++){ const who=B(m,p)&0x3F; p++; const l=[]; while(B(m,p)!==0xFF){ l.push(B(m,p)&0x3F); p++; } p++; if(who===n) return l; }
  return null; }
// lieu des actions d'entrée (place fixe dans la table : voir outils/madness-agent.js)
const KIND=['a','b','c','d','e','f1','g','h','i','j','k','l','m','n','o','p','q1','r','q2','q3','s','t','q4','u','v','f2','32a','x1','x2','203a','213','32b','33','203b','z','232'];
const enterRoom=(m,k)=>B(m,ENTER0+3*KIND.indexOf(k));
// qui détient chaque trésor (créature ou cachette)
function holder(m,n){ for(let k=0;k<16;k++) if(B(m,HOLD0+2*k+1)===n) return B(m,HOLD0+2*k); return 0; }
const visible=(m,n)=>!(ob(m,n).f&3);
const where=(m,n)=>inPack(m,n)?-1:visible(m,n)?ob(m,n).room:null;
// titre d'un lieu (numéro 0 à 255) et son étage : plusieurs lieux portent le même nom (les dédales…)
const T=(a,T0,lang)=>a==null?'?':T0(a+1)+(a===202?'':` (${lang==='en'?'floor':'étage'} ${(a>>6)+1})`);

// ---- où trouver un objet : par terre, protégé, détenu par une créature ou caché dans un lieu ----
const TREAS=[...Array(16).keys()].map(k=>32+k);
function locate(m,n){
  if(inPack(m,n)) return {kind:'pack',n};
  if(visible(m,n)) return ob(m,n).f&0x10?{kind:'protected',n,at:ob(m,n).room,need:combo(m,n)||[]}:{kind:'get',n,at:ob(m,n).room};
  const h=holder(m,n);
  if(h>=25&&h<=30) return {kind:'creature',n,c:h,at:ob(m,h).room,need:combo(m,h)||[]};
  const R={1:67,2:102,3:enterRoom(m,'u'),4:enterRoom(m,'33'),5:B(m,0x35),6:enterRoom(m,'e'),7:B(m,0x33),8:B(m,0x10)?B(m,0x37):enterRoom(m,'d'),
           9:enterRoom(m,'s'),10:enterRoom(m,'t'),11:enterRoom(m,'r')};
  return h in R?{kind:'h'+h,n,at:R[h],rat:B(m,0x2C)}:{kind:'lost',n};
}
function nextTreasure(m){
  const miss=TREAS.filter(n=>!(ob(m,n).room===202&&!inPack(m,n)&&visible(m,n)));
  if(!miss.length) return null;
  const l=miss.map(n=>locate(m,n)), rank=t=>({pack:0,get:1,protected:2}[t.kind]??3);
  return l.sort((x,y)=>rank(x)-rank(y))[0];
}
// texte d'un emplacement ; court (pour les objets d'un sortilège) ou complet (pour un trésor)
function placeText(t,lang,T0,short){
  const fr=lang==='fr', N=name(t.n,lang), at=T(t.at,T0,lang), cap=s=>s[0].toUpperCase()+s.slice(1);
  switch(t.kind){
   case 'pack': return short?(fr?`${cap(N)} : tu l’as.`:`${cap(N)}: you have it.`)
                     :fr?`Tu portes ${N} : pose-${fem(t.n)?'la':'le'} près de la grande forêt. Pour y monter depuis le couloir à la table (lieu de départ), il faut voyager léger ; sinon BELROG fait le saut depuis les fosses des étages, et ISHTAR t’y transporte (peu de fois).`
                       :`You are carrying ${N}: lay it down by the great forest. To climb there from the hallway with a table (where you started), travel light; otherwise BELROG makes the jump from the pits, and ISHTAR takes you there (a few times only).`;
   case 'get': return short?(fr?`${cap(N)} : ${at}.`:`${cap(N)}: ${at}.`):fr?`${cap(N)} t’attend ici : ${at}. Prends-${fem(t.n)?'la':'le'} et rapporte-${fem(t.n)?'la':'le'} dans la forêt.`:`${cap(N)} is waiting in ${at}. Take it to the forest.`;
   case 'protected': return fr?`${cap(N)} se trouve ici : ${at}. Pour t’en emparer, il faut ${needs(t.need,lang)}.`:`${cap(N)} is in ${at}. To take it, you must ${needs(t.need,lang)}.`;
   case 'creature': return fr?`${cap(name(t.c,lang))} détient ${N}. ${fem(t.c)?'Elle':'Il'} rôde en ce moment ici : ${at}. Pour ${fem(t.c)?'la':'le'} tuer (TUER), il faut ${needs(t.need,lang)}.`
                               :`${cap(name(t.c,lang))} holds ${N}. It is now prowling in ${at}. To kill it, you must ${needs(t.need,lang)}.`;
   case 'h1': return fr?`${cap(N)} est dans la crypte de ce lieu : ${at}. Elle ne s’ouvre (OUVRIR LA CRYPTE) que si tu es presque en pleine forme, le sac vide.`
                        :`${cap(N)} is in the crypt of ${at}. It only opens if you are nearly at full strength with an empty pack.`;
   case 'h2': return fr?`${cap(N)} est dans la crypte de l’ancien roi : ${at}. Ouvre-la en portant l’anneau de puissance.`:`${cap(N)} is in the crypt of the ancient king, in ${at}. Open it while carrying the powerring.`;
   case 'h3': case 'h4': return fr?`Entre dans ce lieu, la lampe allumée : ${at}. ${cap(N)} t’y attend.`:`Enter ${at} with the lamp lit. ${cap(N)} is waiting there.`;
   case 'h5': return fr?`Un petit puits se cache ici : ${at}. Regarde-le (REGARDER LE PUITS), plusieurs fois s’il le faut, la lampe allumée : ${N} finira par apparaître.`
                        :`A small pit hides in ${at}. Look at it (LOOK PIT), several times if need be, with the lamp lit: ${N} will appear.`;
   case 'h6': return fr?`Ici, on entend de la musique : ${at}. Joue de la flûte en portant le parchemin : une corniche apparaît. Grimpe dessus (GRIMPER CORNICHE) avec la corde : ${N} y est.`
                        :`Music can be heard in ${at}. Play the flute while carrying the parchment: a ledge appears. Climb it with the rope: ${N} is there.`;
   case 'h7': return fr?`L’hydre de ce lieu garde ${N} : ${at}. Quand elle te repousse, attache-la (ATTACHER HYDRE) avec la corde, entre, puis prononce AKHIROM.`
                        :`The hydra in ${at} guards ${N}. When it pushes you back, tie it up with the rope, go in, then say AKHIROM.`;
   case 'h8': return fr?`Un tas de rochers lumineux cache ${N} : il se montre ici, à qui connaît VETAR : ${at}. OKKAN le dégage.`:`A pile of glowing rocks hides ${N}: it shows up in ${at} to whoever knows VETAR. OKKAN clears it.`;
   case 'h9': return fr?`Entre dans ce lieu en portant la lampe, éteinte : ${at}. ${cap(N)} t’y attend.`:`Enter ${at} carrying the lamp, switched off. ${cap(N)} is waiting there.`;
   case 'h10': return fr?`Un rat voleur se cache ici : ${at}. Il te rend ${N} si tu portes ${name(t.rat,lang)}.`:`A packrat hides in ${at}. It gives you ${N} if you carry ${name(t.rat,lang)}.`;
   case 'h11': return fr?`Entre trois fois dans ce lieu : ${at}. À la troisième, ${N} apparaît.`:`Enter ${at} three times. On the third, ${N} appears.`;
  }
  return fr?`${cap(N)} : introuvable pour l’instant.`:`${cap(N)}: nowhere to be found for now.`;
}
function treasureText(a,lang,T0){
  if(!a||!a.t) return lang==='fr'?'Tous les trésors sont dans la forêt : le score devrait te donner la victoire.':'All the treasures are in the forest.';
  return placeText(a.t,lang,T0,false);
}

// ---- les étapes ----
const STEPS=[
 {id:'lampe', done:m=>inPack(m,12)||known(m,0), args:m=>({at:where(m,12)}),
  fr:["Hors des premières salles, il fait noir, et l’on y tombe dans les fosses. Une lampe traîne près de l’entrée.",
      (a,_,T0)=>`La lampe est ici : ${T(a.at,T0,'fr')}. Prends-la, et allume-la (ALLUMER LA LAMPE) avant d’entrer dans le noir.`],
  en:["Beyond the first rooms it is dark, and you fall into pits. A lamp lies near the entrance.",
      (a,_,T0)=>`The lamp is in ${T(a.at,T0,'en')}. Take it, and light it (LAMP ON) before going into the dark.`]}
];
const spellTxt=(s,lang)=>(a,_,T0)=>(lang==='fr'?`Pour apprendre ${s}, entre ici : ${T(a.room,T0,'fr')}, en portant ${list(a.need,'fr')}.`:`To learn ${s}, enter ${T(a.room,T0,'en')} carrying ${list(a.need,'en')}.`)
  +a.items.map(i=>' '+placeText(i,lang,T0,true)).join('');
SPELLS.forEach((s,k)=>STEPS.push({id:s.toLowerCase(), done:m=>known(m,k),
  args:m=>{ const need=[B(m,SPELL0+4*k),B(m,SPELL0+4*k+1)].filter((n,i,a)=>n&&n<55&&a.indexOf(n)===i);
    return {room:B(m,SPELL0+4*k+2), need, items:need.map(n=>locate(m,n))}; },
  fr:[k?`Les sortilèges s’apprennent dans l’ordre. Le suivant, ${s}, se révèle à qui entre au bon endroit en portant les bons objets, et en connaissant le sortilège précédent.`
       :`Huit sortilèges, à apprendre dans l’ordre. Le premier, ${s}, se révèle à qui entre au bon endroit en portant les bons objets.`, spellTxt(s,'fr')],
  en:[k?`Spells are learned in order. The next one, ${s}, reveals itself to whoever enters the right place carrying the right objects and knowing the previous spell.`
       :`Eight spells, learned in order. The first, ${s}, reveals itself to whoever enters the right place carrying the right objects.`, spellTxt(s,'en')]}));
STEPS.push({id:'tresors', done:()=>false, args:m=>({t:nextTreasure(m)}),
  fr:["Seize trésors sont à poser près de la grande forêt, au quatrième étage. Le score dit où tu en es ; l’Oracle donne les combinaisons qu’il faut porter.",
      (a,_,T0)=>treasureText(a,'fr',T0)],
  en:["Sixteen treasures must be laid down by the great forest, on the fourth floor. The score tells you how far you are; the Oracle gives the combinations you must carry.",
      (a,_,T0)=>treasureText(a,'en',T0)]});

// ---- indices de situation, une fois chacun, en priorité ----
const here=(m,n,o)=>ob(m,n).room===o&&visible(m,n);
const SPOTS=[
 {when:(m,o)=>B(m,0x14)===1, fr:"La bourrasque t’a arraché la lampe : prononce VETAR tout de suite, avant de faire un pas, pour la récupérer.", en:"The gust tore the lamp from you: say VETAR right now, before taking a step, to get it back."},
 {when:(m,o)=>o>=40&&o!==202&&!B(m,0x0A), fr:"Il fait noir ici : chaque pas sans lumière peut être le dernier. Allume la lampe.", en:"It is dark here: every step without light may be your last. Light the lamp."},
 {when:(m,o)=>B(m,0x0F)===1&&B(m,0x0E)===0, fr:"L’hydre vient de te repousser : c’est le moment de l’attacher avec la corde (ATTACHER HYDRE).", en:"The hydra just pushed you back: now is the time to tie it up with the rope (TIE HYDRA)."},
 {when:(m,o)=>B(m,0x09)>0, fr:"La piqûre du scorpion empire chaque minute. MITRA l’efface ; la potion la guérit presque toujours.", en:"The scorpion’s sting gets worse every minute. MITRA removes it; the potion nearly always cures it."},
 {when:(m,o)=>B(m,0x32)&&!known(m,4), fr:"Ce brouillard est empoisonné : ne t’attarde pas. NERGAL permet d’y rester.", en:"This fog is poisonous: don’t linger. NERGAL lets you stay."},
 {when:(m,o)=>[26,29,30].some(n=>here(m,n,o)), fr:"Une créature attaque. Sans la combinaison qu’il faut porter, la frapper te coûte cher : mieux vaut partir.", en:"A creature is attacking. Without the combination you must carry, striking it costs you dearly: better leave."},
 {when:(m,o)=>here(m,31,o), fr:"L’Oracle est ici : interroge-le (INTERROGER L’ORACLE). Il donne une combinaison, puis disparaît.", en:"The Oracle is here: ask it (ASK ORACLE). It gives one combination, then vanishes."},
 {when:(m,o)=>o===0&&!!(ob(m,35).f&0x10), fr:"Ce bassin reflète le plafond. Regarde-le (REGARDER LE BASSIN).", en:"This pool reflects the ceiling. Look at it (LOOK POOL)."},
 {when:(m,o)=>o===202&&TREAS.some(n=>inPack(m,n)), fr:"Tu es dans la forêt : pose ici les trésors que tu portes.", en:"You are in the forest: lay down here the treasures you carry."},
 {when:(m,o)=>B(m,5)<70, fr:"Tu es très affaibli. Mange, bois l’eau de la bouteille, ou passe par une aura enchantée.", en:"You are very weak. Eat, drink the water in the bottle, or walk through an enchanted aura."}
];
function step(mem){ for(let i=0;i<STEPS.length;i++) if(!STEPS[i].done(mem)) return i; return STEPS.length-1; }
function spot(mem,off){ return SPOTS.findIndex(s=>s.when(mem,off)); }
function args(mem,d){ if(d.step==null) return null; const s=STEPS[d.step]; return s.args?s.args(mem):null; }
return {STEPS,SPOTS,step,spot,args};
})();
