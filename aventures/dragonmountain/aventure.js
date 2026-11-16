// Dragon Mountain (Dragon Data, 1982) — fiche de l'aventure pour DragonTales.
// EN COURS (voir EN-COURS.md) : build.py ne l'inclut pas encore dans DragonTales.html (python build.py --tout pour l'essayer).
// Ce fichier est assemblé après data.js, hints.js, scenes.js et textes.js du même dossier : ROOMS, POS, HINTS, SCENES, FR et dmSay/dmClean.
// Le jeu est écrit en Dragon BASIC : il tourne dans moteur/basic.js, et la partie se lit dans ses variables
// (R : lieu courant, P(lieu,direction) : passages, L(objet) : lieu de chaque objet, 0 = porté).
(function(){
const DIRS=['U','D','N','S','E','W'];              // ordre des colonnes de P(lieu, 1..6) : haut, bas, nord, sud, est, ouest
const OBJ_FIRST=7, OBJ_LAST=25;                      // objets que l'on peut voir et prendre (O$(7..25), OD$(7..25))
const PASSAGE={200:'porte verrouillée',300:'porte noire',500:'sortie',600:'force invisible'};
// mots du jeu (O$) que l'on peut cliquer dans le texte anglais
const NOUNS_EN='LAMP FLASK BRACELET CLOAK KEY SWORD GOBLET TORCH PLATE CROWN DAGGER SPELLBOOK AXE FOOD WATER TREASURE SIGN DOOR FIRE FIREPLACE TABLE WINDOW CANDLES BED WARDROBE COT STAIRCASE CARPET BOOKS CHAIR CHAIRS BARREL SHELVES STOVE BONES STRAW THRONE GATE DEMON DRAGON ELF'.split(' ');

DragonTales.register({
 id:'dragonmountain', order:2,
 storage:'dragonmountain',
 title:'Dragon Mountain', author:'', publisher:'Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'Un trésor dort au cœur de la montagne, gardé par un dragon, un démon et des elfes. Il faudra de quoi manger, boire, se couvrir et combattre pour en ressortir vivant.',
  en:'A treasure lies in the heart of the mountain, guarded by a dragon, a demon and elves. You will need food, water, warmth and weapons to come out alive.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine ----
 machine:{
  kind:'basic',                                      // programme BASIC : moteur/basic.js au lieu de l'émulateur 6809
  victory:/I HAVE ALL THE TREASURE/,
  echo:false,                 // texte affiché à la victoire ; toute autre fin est une mort
  // Corrections du programme d'origine (décidées le 16/11/2026) :
  patches:{
   // Le dragon ne se montre qu'à qui porte la dague. À l'origine, s'il apparaissait avant, on ne pouvait plus quitter
   // la pièce ni le tuer : partie bloquée. Le tirage au hasard reste le même (RND est appelé comme avant).
   4240:'IF DR<>R OR L(17)<>0 THEN 4260',
   // Manger demande un panier de nourriture. À l'origine le programme testait le gobelet (L(13)) au lieu du
   // troisième panier (L(22)) : on pouvait manger en ne portant que le gobelet.
   1470:'IF L(22)<>0 AND L(20)<>0 AND L(21)<>0 THEN 5290'
  }
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES, HINTS,
 labels:{
  fr:{
   sub:"Une aventure de Dragon Data, 1982. Version française.",
   bye:"Que la montagne te soit clémente.",
   sfxNote:"Dragon, démon, elfe, combat, portes… Ils ne jouent que dans la version moderne.",
   musicNote:"Elle joue dans le château et s’efface en fondu quand on monte au royaume des gardiens.",
   mapHint:"Clique un lieu pour t’y rendre. De gauche à droite : le château, le royaume des gardiens et le trésor. ▲▼ : un escalier monte ou descend vers l’autre étage.",
   intro:[
    "Au cœur de la Montagne du Dragon dort un trésor que nul n’a jamais rapporté. Des elfes rôdent dans ses salles, un démon garde ses profondeurs et un dragon veille sur l’or.",
    "Pour en ressortir vivant, il te faudra manger, boire, dormir et te protéger du froid, trouver les armes qui viennent à bout des gardiens, et de quoi acheter les elfes.",
    "Lis les panneaux : ils en disent plus long qu’il n’y paraît."]},
  en:{
   sub:"An adventure by Dragon Data, 1982.",
   bye:"May the mountain be kind to you.",
   sfxNote:"Dragon, demon, elf, fighting, doors… They only play in the modern version.",
   musicNote:"It plays in the castle and fades out when you climb to the kingdom of the guardians.",
   mapHint:"Click a place to walk there. From left to right: the castle, the kingdom of the guardians and the treasure. ▲▼: a staircase leads up or down to the other level.",
   intro:[
    "Deep inside Dragon Mountain lies a treasure no one has ever brought back. Elves roam its halls, a demon guards its depths and a dragon watches over the gold.",
    "To come out alive you will have to eat, drink, sleep and keep out the cold, find the weapons that can defeat the guardians, and something to buy off the elves.",
    "Read the signs: they say more than you might think."]}
 },
 helpEn:'VERBS: GO (OR N, S, E, W, UP, DOWN), LOOK, GET, LEAVE, INVENTORY, OPEN, UNLOCK, EAT, DRINK, READ, WEAR, BRIBE, KILL, SLEEP.%EXAMPLES: GET LAMP, READ SIGN, BRIBE ELF.',
 // [mot anglais du jeu, libellé français, libellé anglais, s'emploie sans cible ?] — le premier est le verbe par défaut
 verbs:[['GET','Prendre','Take'],['LEAVE','Poser','Drop'],['LOOK','Regarder','Look',1],['INVENTORY','Inventaire','Inventory',1],
  ['OPEN','Ouvrir','Open'],['UNLOCK','Déverrouiller','Unlock'],['READ','Lire','Read'],['WEAR','Porter','Wear'],
  ['EAT','Manger','Eat'],['DRINK','Boire','Drink'],['SLEEP','Dormir','Sleep',1],['BRIBE','Soudoyer','Bribe'],['KILL','Tuer','Kill']],
 sfxAt:{},
 frSkip:['EST','PORTE'],                              // mots français à ne pas rendre cliquables (« est » la direction, « porte » le verbe)
 revExtra:{GET:'PRENDRE',LEAVE:'POSER',INVENTORY:'INVENTAIRE',GO:'ALLER'},
 nounEn:w=>{ const x=FR.frToEn('PRENDRE '+w).split(' '); return x.length>1?x[1]:''; },

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:35,
  dirs:{N:'NORTH',S:'SOUTH',E:'EAST',W:'WEST',U:'UP',D:'DOWN'},
  go:w=>'GO '+w, goVerb:'GO',
  promptText:'\nWHAT SHALL I DO?\n? ',      // invite remise après un chargement ou l'aide (version classique)
  defaultScene:'1', transient:[],
  nouns:NOUNS_EN,
  // la carte : deux étages et la salle du trésor (data.js)
  pos:off=>POS[off+1],
  levelName:(lv,lang)=>[['le château','the castle'],['le royaume des gardiens','the kingdom of the guardians'],['le trésor','the treasure']][lv][lang==='fr'?0:1],
  say:(text,lang,classic)=>dmSay(text,lang,classic),
  objLabel:(o,lang)=>{ const a=DM_OBJ[DM_NORM(o.name)]; return a?(lang==='fr'?a[1]:a[0]).replace(/^(a|an|un|une) /i,''):o.name; },
  clean:s=>dmClean(s),
  musicZone:key=>+key>=1&&+key<=25,                   // la musique revient dans le château (étage du bas)
  proper:(s,lang)=>s.replace(/\borimiah\b/g,'Orimiah').replace(/\bdragon mountain\b/g,'Dragon Mountain').replace(/\bmontagne du dragon\b/g,'Montagne du Dragon'),
  freeInput:mem=>mem.prompt()!==null&&mem.line()===1270,   // « WHAT IS THE SPELL? » : la formule passe telle quelle
  sfxFor(line){ if(/DRAGON IS IN/.test(line)) return 'growl'; if(/DEMON IS IN/.test(line)) return 'rumble'; if(/ELF IS IN/.test(line)) return 'magic';
   if(/IS DEAD|RAN AWAY/.test(line)) return 'smash'; if(/KILLED|DIED/.test(line)) return 'death'; if(/DOOR IS OPEN/.test(line)) return 'glow';
   if(/ELF HAS TAKEN/.test(line)) return 'coin'; if(/RESTED/.test(line)) return 'dream'; if(/ALL THE TREASURE/.test(line)) return 'victory'; return null; },
  roomOff:mem=>mem.v('R')-1,
  roomKey:(mem,off)=>String(off+1),
  // destination de chaque sortie : numéro de lieu (0 = rien), ou le nom d'un passage particulier
  links(mem,off){ const r=off+1, out={};
   DIRS.forEach((d,i)=>{ const v=mem.a('P',r,i+1); out[d]=v>=1&&v<=35?v-1:PASSAGE[v]||null; }); return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; DIRS.forEach(d=>e[d]=typeof l[d]==='number'); return e; },
  locOf:off=>off+1, carried:0,
  objects(mem){ const out=[]; for(let n=OBJ_FIRST;n<=OBJ_LAST;n++) out.push({n,name:mem.a('OD$',n),word:mem.a('O$',n),loc:mem.a('L',n)}); return out; },
  // éléments de scène : 101 elfe, 102 démon, 103 dragon présents ; 111 porte du couloir sinueux ouverte ;
  // 112 porte noire ouverte (lieux 27, 29, 31) ; 113 force invisible levée (antre du dragon)
  sceneExtras(mem,off){ const r=off+1, l=[];
   if(mem.v('EP')===1) l.push(101); if(mem.v('DE')===1) l.push(102); if(mem.v('DP')===1) l.push(103);
   if(r===22&&mem.a('P',22,6)===21) l.push(111);
   if((r===27&&mem.a('P',27,3)===30)||(r===29&&mem.a('P',29,5)===30)||(r===31&&mem.a('P',31,6)===30)) l.push(112);
   if(r===30&&mem.a('P',30,1)===35) l.push(113);
   return l; },
  // état des épreuves : utile aux indices et à la carte
  flags(mem){ return {mange:mem.v('FE')===1, bu:mem.v('WD')===1, repose:mem.v('RF')===1, manteau:mem.v('CC')===1,
   elfe:mem.v('EP')===1, demon:mem.v('DE')===1, dragon:mem.v('DP')===1,
   elfes:(mem.v('E1')===1)+(mem.v('E2')===1), demonMort:mem.v('DD')===1, dragonMort:mem.v('DR')===1, porte22:mem.v('UL')===1}; }
 }
});
})();
