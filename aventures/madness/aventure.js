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
  seconds:5,                                         // temps qui passe à chaque commande (décision à prendre)
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
   musicNote:"",
   sfxNote:"",
   mapHint:"Clique un lieu pour t’y rendre.",
   intro:[
    "On raconte que des trésors sont cachés aux abords du labyrinthe du roi Minos, à Cnossos.",
    "Seize trésors, huit sortilèges, des créatures qui rôdent… et le Minotaure."]},
  en:{
   sub:"An adventure by Tom Rosenbaum, Spectral Associates, 1981.",
   bye:"May the gods keep you.",
   won:"You got out of the labyrinth!",
   musicNote:"",
   sfxNote:"",
   mapHint:"Click a place to walk there.",
   intro:[
    "Rumor has it that there are treasures hidden in the vicinity of King Minos’s labyrinth at Knossos.",
    "Sixteen treasures, eight spells, prowling creatures… and the Minotaur."]}
 },
 helpEn:'VERBS: GET, DROP, THROW, INV, LOOK, OPEN, EAT, DRINK, FILL, ASK, KILL, STAB, RUN, BACK, JUMP, CLIMB, TIE, PLAY, LAMP, SCORE, HELP, UNCLE (GIVE UP).%SPELLS: VETAR, MITRA, OKKAN, AKHIROM, NERGAL, BELROG, CROM, ISHTAR.%DIRECTIONS: N, S, E, W, U, D.',
 verbs:[['GET','Prendre','Take'],['DROP','Poser','Drop'],['LOOK','Regarder','Look',1],['INV','Inventaire','Inventory',1],['OPEN','Ouvrir','Open'],
  ['EAT','Manger','Eat'],['DRINK','Boire','Drink'],['FILL','Remplir','Fill'],['ASK','Interroger','Ask'],['KILL','Tuer','Kill'],['STAB','Poignarder','Stab'],
  ['THROW','Lancer','Throw'],['JUMP','Sauter','Jump'],['CLIMB','Grimper','Climb'],['TIE','Attacher','Tie'],['PLAY','Jouer','Play'],
  ['LAMP','Lampe','Lamp'],['RUN','Fuir','Run',1],['BACK','Revenir','Back',1],['SCORE','Score','Score',1]],
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
  musicZone:()=>false,
  roomOff:mem=>mem.b(0),
  roomKey:(mem,off)=>String(off),
  links(mem,off){ const p=mem.b(PASS+off)&~mem.b(BLOCK+off), out={};
   for(const d in BIT) out[d]=p&BIT[d]?(off+STEP[d])&255:null; return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d in l) e[d]=l[d]!==null; return e; },
  locOf:off=>off, carried:-1,
  objects(mem){ const out=[];
   for(let n=1;n<=MM_WORDS.length;n++){ const p=OBJ0+3*(n-1), f=mem.b(p+2);
    if(f&3) continue;                                  // créature morte, objet porté par une créature, sortilège…
    out.push({n,name:MM_WORDS[n-1],word:MM_WORDS[n-1],loc:f&0x80?-1:mem.b(p)}); }
   return out; },
  status(mem,lang){ const c=mem.b(5); return (lang==='fr'?'État physique : ':'Condition: ')+c; },
  sfxFor:(line,cmd,mem)=>mmSfxFor(line,cmd,mem),
  ambient:(mem,off)=>mmAmbient(mem,off),
  sceneExtras(mem,off){ return []; }
 }
});
})();
