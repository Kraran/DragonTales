// Madness and the Minotaur — Tom Rosenbaum, Spectral Associates, 1981 (version Dragon 32 : Dragon Data, 1982) — fiche.
// Intégration commencée le 26/11/2026 : voir docs/PLAN-MADNESS.md.
// Ce fichier est assemblé après data.js, fins.js, hints.js, scenes.js, sons.js et textes.js du même dossier.
// Jeu en code machine 6809 (16 Ko chargés en $1000), lu caractère par caractère par moteur/flux.js. Adresses de la
// version Dragon (la version CoCo, désassemblée par Chris Cantrell sur computerarcheology.com, est décalée) :
//   $1003 affichage d'un caractère (A) ; $10F9 affichage avec retour à la ligne automatique ; $1372 saisie d'une commande
//   (touches lues par la ROM en $B538, écho en $13AE) ; $125E interruption (60 par seconde : toutes les secondes les
//   créatures attaquent, la lampe brûle ; toutes les minutes elles se déplacent, le sol tremble) ; $115C hasard (lu dans
//   la ROM, d'où le remplissage ci-dessous) ; $1894 fin de partie (« rejouer ? », touche en $B538 puis $17FA).
// Mémoire : $00 lieu courant, $01 lieu précédent, $05 état physique, $0A lampe allumée, $28 score, $38-$39 huile ;
//   $4716 sortilèges (4 octets : deux objets requis, lieu, appris $80) ; $4851 objets (3 octets : lieu, nom, drapeaux
//   b s d p PP x y — b porté, x/y inaccessible) ; $490D passages (--UDNEWS, 256 octets) ; $4A0D passages bouchés.
(function(){
const OBJ0=0x4851, PASS=0x490D, BLOCK=0x4A0D;
const BIT={S:1,W:2,E:4,N:8,D:16,U:32}, STEP={S:8,W:-1,E:1,N:-8,D:64,U:-64};

DragonTales.register({
 id:'madness', order:8,
 storage:'madness',
 rating:{difficulty:4.8,overall:3.6},
 title:'Madness and the Minotaur', author:'Tom Rosenbaum', publisher:'Spectral Associates / Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'Le labyrinthe du roi Minos, à Cnossos : quatre étages, des trésors, des sortilèges, des créatures qui rôdent… et le Minotaure. Rapporte seize trésors dans la forêt et sors vivant.',
  en:'King Minos’s labyrinth at Knossos: four floors, treasures, spells, prowling creatures… and the Minotaur. Bring sixteen treasures to the forest and get out alive.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine (code machine, moteur/flux.js) ----
 machine:{
  kind:'flux',
  load:0x1000, entry:0x1000, stack:0x7F00,
  // la ROM du Dragon n'est pas fournie : le jeu y lit ses octets « au hasard » ; on la remplit d'octets pseudo-aléatoires fixes
  rom(mem){ let s=0x2F6E2B1; for(let a=0x8000;a<0xC000;a++){ s=(Math.imul(s,1103515245)+12345)>>>0; mem[a]=s>>>24; } },
  outHook:[0x10F9,0x1003], outSkip:[0x13B1,0x1149,0x1152],  // texte avec retour à la ligne, et direct ; sauf l'écho de la saisie et ce que $10F9 repasse à $1003
  keyWait:0xB538, lineRet:0x1380, endRet:0x18A0,
  inkey:0xBBE5, cls:0xBA77, nop:[0xBAC5,0xBAF1],
  irq:{vec:0x125E,hz:60},
  // Le temps n'avance qu'à chaque commande (décision du 26/11/2026) : quelques secondes de jeu par commande ; ATTENDRE
  // laisse passer une minute (le temps de laisser se rouvrir un passage bouché, ou de reprendre des forces).
  seconds:5,
  wait:{re:/^(WAIT|ATTENDRE)$/,seconds:60,text:'TIME PASSES.'},
  // Correctifs des bugs d'origine relevés par Chris Cantrell sur la version CoCo (computerarcheology.com), à leur place
  // dans la version Dragon. Le code ajouté est rangé en $5000, hors du programme (rien ne s'y trouve).
  patches:{
   // 1. Boire la potion sans l'avoir répondait « la bouteille est vide » : « tu n'as pas ça ».
   0x1E38:[0xBD,0x50,0x00,0x12],                                        // JSR $5000 ; NOP (au lieu de BSR $1DE5 ; BCC)
   0x5000:[0xBD,0x1D,0xE5, 0x24,0x01, 0x39, 0x32,0x62, 0x8E,0x35,0xE4, 0x7E,0x1B,0x9E],
   // 2. Tuer l'Oracle disait « l'urne est pleine d'huile » : le message de l'Oracle qui disparaît.
   0x22ED:[0x07],
   // 3. ISHTAR, pour quitter le brouillard empoisonné, laissait tourner son compteur : il est remis à zéro.
   0x2009:[0x7E,0x50,0x10], 0x5010:[0xBD,0x12,0x3E, 0x7E,0x1B,0x4F],
   // 4. Trop chargé pour descendre, on descendait quand même : la descente échoue.
   0x2650:[0x25,0x04],
   // 6. Le petit puits du quatrième étage (on y saute vers le temple de Zeus) pouvait tomber dans un lieu qui a déjà son
   //    saut : celui du temple devenait introuvable. On le replace ailleurs sur l'étage.
   0x17DC:[0xBD,0x50,0x20],
   0x5020:[0xB6,0x48,0x3B, 0x81,0xCA,0x27,0x0E, 0x81,0xCB,0x27,0x0A, 0x81,0xD4,0x27,0x06, 0x81,0xD5,0x27,0x02, 0x20,0x0C,
           0xBD,0x11,0x5C, 0xCA,0xC0, 0x1F,0x98, 0xB7,0x48,0x3B, 0x20,0xE2, 0x39],
   // 8. « YOUR SIGHT IS DIM » (état physique bas) n'était jamais affiché : mauvaise routine d'affichage.
   0x1889:[0xBD,0x1B,0x67]
   // 5. « THERE IS NO HERE. » (le mot WATER manque) : corrigé dans le texte (textes.js). 7 : rien à corriger ici.
  },
  // Deux niveaux, choisis avant la partie (décision du 26/11/2026) : le jeu d'origine, ou une version pour débuter.
  modeAddr:0x5FFF,
  modes:{
   NORMAL:{seconds:5},
   BEGINNER:{seconds:3,patches:{
    0x132F:[0x20],                                     // le sol ne tremble plus : aucun passage ne se bouche
    0x173D:[0x0E,0x10], 0x207B:[0x0E,0x10],            // la lampe brûle une heure au lieu d'une demi-heure
    0x4738:[0x28], 0x4760:[0x28], 0x47A6:[0x28]}}      // les trois sauts mortels deviennent des chutes (40 points d'état)
  },
  maxLen:30,
  victory:/YOU WIN!/,
  // QUIET (sauvegarde sur cassette) attend une touche du lecteur : remplacé par un renvoi vers les sauvegardes de la page
  traps:{0x2277:'TO SAVE OR LOAD A GAME, USE THE SAVES BUTTON.'}
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES, HINTS, endings:FINS,
 labels:{
  fr:{
   sub:"Une aventure de Tom Rosenbaum, Spectral Associates, 1981. Version française (en préparation).",
   bye:"Que les dieux te gardent.",
   won:"Tu es sorti du labyrinthe !",
   musicNote:"« The Labyrinth of Minos » : elle joue dans les salles et les couloirs du labyrinthe ; elle se tait dans les dédales de tunnels.",
   sfxNote:"",
   mapHint:"Clique un lieu pour t’y rendre.",
   intro:[
    "On raconte que des trésors sont cachés aux abords du labyrinthe du roi Minos, à Cnossos.",
    "Seize trésors, huit sortilèges, des créatures qui rôdent… et le Minotaure."]},
  en:{
   sub:"An adventure by Tom Rosenbaum, Spectral Associates, 1981.",
   bye:"May the gods keep you.",
   won:"You got out of the labyrinth!",
   musicNote:"“The Labyrinth of Minos”: it plays in the halls and corridors of the labyrinth; it falls silent in the tunnel mazes.",
   sfxNote:"",
   mapHint:"Click a place to walk there.",
   intro:[
    "Rumor has it that there are treasures hidden in the vicinity of King Minos’s labyrinth at Knossos.",
    "Sixteen treasures, eight spells, prowling creatures… and the Minotaur."]}
 },
 helpEn:'VERBS: GET, DROP, THROW, INV, LOOK, OPEN, EAT, DRINK, FILL, ASK, KILL, STAB, RUN, BACK, JUMP, CLIMB, TIE, PLAY, LAMP, SCORE, HELP, WAIT (ONE MINUTE), UNCLE (GIVE UP).%SPELLS: VETAR, MITRA, OKKAN, AKHIROM, NERGAL, BELROG, CROM, ISHTAR.%DIRECTIONS: N, S, E, W, U, D.',
 verbs:[['GET','Prendre','Take'],['DROP','Poser','Drop'],['LOOK','Regarder','Look',1],['INV','Inventaire','Inventory',1],['OPEN','Ouvrir','Open'],
  ['EAT','Manger','Eat'],['DRINK','Boire','Drink'],['FILL','Remplir','Fill'],['ASK','Interroger','Ask'],['KILL','Tuer','Kill'],['STAB','Poignarder','Stab'],
  ['THROW','Lancer','Throw'],['JUMP','Sauter','Jump'],['CLIMB','Grimper','Climb'],['TIE','Attacher','Tie'],['PLAY','Jouer','Play'],
  ['LAMP','Lampe','Lamp'],['RUN','Fuir','Run',1],['BACK','Revenir','Back',1],['WAIT','Attendre','Wait',1],['SCORE','Score','Score',1]],
 sfxAt:{},
 sfx:MM_SFX,
 frSkip:[],
 revExtra:{},
 nounEn:w=>w,

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:256,
  dirs:{N:'N',S:'S',E:'E',W:'W',U:'U',D:'D'},
  go:w=>w, goVerb:'GO',
  promptText:'',
  defaultScene:'18', transient:[],
  nouns:MM_WORDS,
  pos:off=>[off&7,(off>>3)&7,off>>6],
  levelName:(lv,lang)=>(lang==='fr'?'étage ':'floor ')+(lv+1),
  say:(text,lang,classic)=>mmSay(text,lang,classic),
  clean:(s,moved)=>mmClean(s,moved),
  autoKey:mem=>' ',
  // le niveau, avant la partie
  menu(mem,lang){ if(!mem.choosing()) return null; const fr=lang==='fr';
   return {title:fr?'Choisis ton niveau':'Choose your level',
    text:fr?'Le labyrinthe est le même ; la version débutant l’adoucit.':'The labyrinth is the same; the beginner version softens it.',
    def:0, choices:[{en:'NORMAL',label:fr?'Normal':'Normal',note:fr?'Le jeu d’origine':'The original game'},
     {en:'BEGINNER',label:fr?'Débutant':'Beginner',note:fr?'Pas d’éboulements, lampe deux fois plus longue, aucun saut mortel, le temps passe moins vite':'No cave-ins, lamp lasts twice as long, no deadly jumps, time runs slower'}]}; },
  freeInput:mem=>mem.choosing(),
  musicZone:(key,kind)=>kind!=='maze',                 // la musique se tait dans les dédales (décision du 26/11/2026)
  roomOff:mem=>mem.choosing()?18:mem.b(0),             // avant le choix du niveau, le jeu n'a pas commencé : la bibliothèque du départ
  roomKey:(mem,off)=>String(off),
  links(mem,off){ const p=mem.b(PASS+off)&~mem.b(BLOCK+off), out={};
   for(const d in BIT) out[d]=p&BIT[d]?(off+STEP[d])&255:null; return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d in l) e[d]=l[d]!==null; return e; },
  locOf:off=>off, carried:-1,
  objects(mem){ const out=[]; if(mem.choosing()) return out;
   for(let n=1;n<=MM_WORDS.length;n++){ const p=OBJ0+3*(n-1), f=mem.b(p+2);
    if(f&3) continue;                                  // créature morte, objet porté par une créature, sortilège…
    out.push({n,name:MM_WORDS[n-1],word:MM_WORDS[n-1],loc:f&0x80?-1:mem.b(p)}); }
   return out; },
  status(mem,lang){ if(mem.choosing()) return ''; const c=mem.b(5); return (lang==='fr'?'État physique : ':'Condition: ')+c; },
  sfxFor:(line,cmd,mem)=>mmSfxFor(line,cmd,mem),
  ambient:(mem,off)=>mmAmbient(mem,off),
  sceneExtras(mem,off){ return []; }
 }
});
})();
