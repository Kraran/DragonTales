// Dragon Mountain — indices des pièces magiques. L'étape en cours se lit dans les variables du programme.
// Les objets sont placés au hasard : le second indice de certaines étapes nomme le lieu où se trouve vraiment l'objet.
// Un texte peut donc être une fonction (args, langue, titre) : args est calculé au moment où l'on dépense la pièce
// (HINTS.args), gardé avec l'indice, et le texte est recomposé dans la langue courante.
const HINTS=(function(){
const L=(m,n)=>m.a('L',n);                        // lieu de l'objet n : 0 = porté, 99 = disparu
const GOLD=[9,13,15,16];                          // bracelet, gobelet, assiette, couronne
const near=(m,list)=>{ for(const n of list){ const l=L(m,n); if(l>=1&&l<=35) return l; } return 0; };   // un lieu où le trouver
const STEPS=[
 {id:'manteau', done:m=>m.v('CC')===1, where:m=>L(m,10),
  fr:["Lis les panneaux : l’un d’eux te dit ce qu’il faut emporter pour survivre au royaume des gardiens, où le froid tue.",
      a=>a?`La cape de laine se trouve ici : ${a.toLocaleLowerCase('fr')}. Prends-la, puis porte-la sur toi.`:"Tu as la cape dans ton sac : il faut la porter sur toi."],
  en:["Read the signs: one tells you what to take to survive in the kingdom of the guardians, where the cold kills.",
      a=>a?`The woollen cloak is in ${a.toLowerCase()}. Take it, then wear it.`:"You have the cloak in your bag: you need to wear it."]},
 {id:'manger', done:m=>m.v('FE')===1, where:m=>near(m,[20,21,22]),
  fr:["On ne va pas loin le ventre vide. Le château n’en manque pas : cherche des paniers.",
      a=>a?`Un panier de nourriture t’attend ici : ${a.toLocaleLowerCase('fr')}. Prends-le et mange.`:"Tu as un panier de nourriture : mange."],
  en:["You won’t get far on an empty stomach. The castle has plenty: look for baskets.",
      a=>a?`A basket of food is waiting in ${a.toLowerCase()}. Take it and eat.`:"You have a basket of food: eat."]},
 {id:'flacon', done:m=>m.v('WD')===1||L(m,8)===0, where:m=>L(m,8),
  fr:["La soif viendra. L’eau des tonneaux ne se porte pas à mains nues.",
      a=>`Il te faut le flacon de verre pour emporter de l’eau. Il est ici : ${(a||'?').toLocaleLowerCase('fr')}.`],
  en:["Thirst will come. You cannot carry water from the barrels in your bare hands.",
      a=>`You need the glass flask to carry water. It is in ${(a||'?').toLowerCase()}.`]},
 {id:'boire', done:m=>m.v('WD')===1, where:m=>near(m,[23,24]),
  fr:["Avec le flacon, tu peux emporter de l’eau. Trouve un tonneau.",
      a=>a?`Un tonneau d’eau se trouve ici : ${a.toLocaleLowerCase('fr')}. Prends l’eau, puis bois.`:"Tu as de l’eau : bois."],
  en:["With the flask you can carry water. Find a barrel.",
      a=>a?`A barrel of water is in ${a.toLowerCase()}. Take the water, then drink.`:"You have water: drink."]},
 {id:'epee', done:m=>L(m,12)===0||m.v('DD')===1, where:m=>L(m,12),
  fr:["Un démon hante les profondeurs. Un panneau dit avec quelle arme on en vient à bout.",
      a=>`L’épée se trouve ici : ${(a||'?').toLocaleLowerCase('fr')}. Ne monte pas sans elle.`],
  en:["A demon haunts the depths. A sign tells you which weapon defeats it.",
      a=>`The sword is in ${(a||'?').toLowerCase()}. Don’t go up without it.`]},
 {id:'or', done:m=>GOLD.filter(n=>L(m,n)===0).length+(m.v('E1')===1)+(m.v('E2')===1)>=2, where:m=>near(m,[9,13,15,16]),
  fr:["Des elfes rôdent là-haut et ne te laisseront pas passer sans payer. Ce qui brille les intéresse.",
      a=>`Il te faut deux objets en or, un par elfe. L’un d’eux est ici : ${(a||'?').toLocaleLowerCase('fr')}.`],
  en:["Elves roam up there and won’t let you pass without payment. They like things that shine.",
      a=>`You need two gold objects, one per elf. One of them is in ${(a||'?').toLowerCase()}.`]},
 {id:'dormir', done:m=>m.v('RF')===1,
  fr:["Là-haut, la fatigue te rattrapera vite, et l’on n’y dort pas n’importe où.",
      "Repose-toi avant de monter : dans le château, il suffit de dormir."],
  en:["Up there, tiredness will catch up with you quickly, and you can’t sleep just anywhere.",
      "Rest before you go up: in the castle, just sleep."]},
 {id:'dague', done:m=>L(m,17)===0||m.v('DR')===1, where:m=>L(m,17),
  fr:["Le dragon ne craint qu’une arme, cachée dans le royaume des gardiens. Il ne se montrera qu’à qui la porte.",
      a=>`La dague sertie de joyaux se trouve ici : ${(a||'?').toLocaleLowerCase('fr')}. Si une porte noire te barre la route, une formule l’ouvre.`],
  en:["The dragon fears only one weapon, hidden in the kingdom of the guardians. It will only show itself to whoever carries it.",
      a=>`The jewelled dagger is in ${(a||'?').toLowerCase()}. If a black door bars the way, a spell opens it.`]},
 {id:'gardiens', done:m=>m.a('P',30,1)===35, args:m=>({left:[m.v('E1')!==1||m.v('E2')!==1?'e':'',m.v('DD')!==1?'d':'',m.v('DR')!==1?'g':''].filter(Boolean).join('')}),
  fr:["Le chemin du trésor reste fermé tant que ses gardiens n’ont pas tous été vaincus ou achetés.",
      a=>"Il te reste à régler : "+[a.left.includes('e')?'les elfes (deux en tout)':'',a.left.includes('d')?'le démon':'',a.left.includes('g')?'le dragon':''].filter(Boolean).join(', ')+". Promène-toi dans le royaume des gardiens : ils viendront à toi."],
  en:["The way to the treasure stays shut until all its guardians have been defeated or bought off.",
      a=>"Still to deal with: "+[a.left.includes('e')?'the elves (two in all)':'',a.left.includes('d')?'the demon':'',a.left.includes('g')?'the dragon':''].filter(Boolean).join(', ')+". Wander through the kingdom of the guardians: they will come to you."]},
 {id:'sortie', done:()=>false,
  fr:["La force invisible a cédé. Au-dessus de l’antre du dragon, le trésor t’attend.",
      "Monte depuis l’antre du dragon, puis sors vers l’ouest, où passe la lumière du jour."],
  en:["The unseen force has given way. Above the dragon’s den, the treasure awaits.",
      "Go up from the dragon’s den, then leave to the west, where daylight shines through."]}
];
// étapes qui nomment un lieu : le texte reçoit le titre du lieu (dans la langue courante), ou null si l'objet est porté
STEPS.forEach(s=>{ if(!s.where) return; s.args=m=>({at:s.where(m)});
  ['fr','en'].forEach(l=>{ s[l]=s[l].map(x=>typeof x==='function'?((f=>(a,_,T)=>f(a.at>=1&&a.at<=35?T(a.at):null))(x)):x); }); });
// indices de situation : donnés une seule fois chacun, en priorité
const SPOTS=[
 {when:m=>m.v('EP')===1, fr:"Combattre un elfe, c’est jouer sa vie à pile ou face. Il préfère de loin l’or.", en:"Fighting an elf means betting your life on a coin toss. It much prefers gold."},
 {when:m=>m.v('DE')===1, fr:"Le démon ne craint que l’épée. Sans elle, ne l’attaque pas.", en:"The demon fears only the sword. Without it, don’t attack."},
 {when:m=>m.v('DP')===1, fr:"La dague, rien que la dague, et maintenant.", en:"The dagger, only the dagger, and now."},
 {when:(m,o)=>o===21&&m.a('P',22,6)!==21, fr:"Cette lourde porte est fermée à clé. Une clé de fer traîne quelque part dans le château ; il faut la déverrouiller avant de l’ouvrir.", en:"This heavy door is locked. An iron key lies somewhere in the castle; unlock the door before opening it."},
 {when:(m,o)=>(o===26&&m.a('P',27,3)!==30)||(o===28&&m.a('P',29,5)!==30)||(o===30&&m.a('P',31,6)!==30), fr:"Les portes noires ne cèdent qu’à une formule. Le grimoire de la salle de la magie l’enseigne, à condition d’être lu dans un lieu enchanté.", en:"The black doors yield only to a spell. The spellbook in the hall of magic teaches it, if read in an enchanted place."},
 {when:(m,o)=>o===33&&L(m,18)===0, fr:"Ici, la lumière est enchantée. Ce serait le bon endroit pour relire ce que tu portes.", en:"Here the light is enchanted. This would be the right place to read again what you are carrying."}
];
function step(mem){ for(let i=0;i<STEPS.length;i++) if(!STEPS[i].done(mem)) return i; return STEPS.length-1; }
function spot(mem,off){ return SPOTS.findIndex(s=>s.when(mem,off)); }
function args(mem,d){ if(d.step==null) return null; const s=STEPS[d.step]; return s.args?s.args(mem):null; }
return {STEPS,SPOTS,step,spot,args};
})();
