// Mansion of Doom — Leroy C. Smith et Paul Austin, Pal Creations, 1982 (diffusé par Dragon Data) — fiche de l'aventure.
// ÉBAUCHE D'INTÉGRATION (17/11/2026) : le jeu tourne, se gagne (solution.txt) et s'affiche ; textes, décors, indices,
// sons et musique restent à faire (voir docs/PLAN-MANSION.md). Le dossier contient EN-COURS.md : build.py ne l'assemble
// qu'avec « --tout ».
// Ce fichier est assemblé après data.js, scenes.js et textes.js du même dossier : ROOMS, POS, SCENES, FR, mdSay/mdClean.
// Jeu en Dragon BASIC (moteur/basic.js). La partie se lit dans ses variables :
//   F lieu courant (1 à 77) ; A$(F) description ; B(F,1…6) sorties N S E W U D (0 = pas de sortie) ;
//   B$(n) nom de l'objet, D$(n) description, A(n) lieu (-1 porté, 0 caché) ; H$ les mots de 3 lettres des objets ;
//   E nombre d'objets ; B objets portés (5 au plus, A) ; H heure (2 par commande) et R coucher du soleil (420 + 0…58) ;
//   A6 courant coupé (la cave est éclairée) ; B5 cercueil ouvert ; B9 vampire tué ; B7 princesse abattue ; C4 dans les fers.
(function(){
const DIRS={N:'N',S:'S',E:'E',W:'W',U:'U',D:'D'};
// mot anglais complet de chaque objet, d'après ses trois lettres (H$)
const FULL={WRI:'WRITING',CRO:'CROSS',BOX:'BOX',BUL:'BULLET',MIR:'MIRRORS',GUN:'GUN',TEX:'TEXT',STA:'STAKE',DES:'DESK',DIC:'DICTIONARY',
 CHE:'CHEST',EYE:'EYE',SWI:'SWITCH',WOR:'WORMS',TOR:'TORCH',SUL:'SULPHUR',SKE:'SKELETONS',MAG:'MAGGOTS',HAN:'HANDS',SAC:'SACK',DOG:'DOG',
 WER:'WEREWOLF',LAD:'LADDER',MAL:'MALLET',HAM:'HAMMER',DOO:'DOOR',WAT:'WATCH',RAT:'RAT',COR:'CORPSES',MON:'MONGOOSE',TAB:'TABLE',NOT:'NOTE',
 PIT:'PIT',MEA:'MEAT',CAN:'CANDLE',POR:'PORTRAIT',MAP:'MAP',SNA:'SNAKE',COB:'COBWEBS',SIG:'SIGN',CAG:'CAGE',TRA:'TRAPDOOR',TUN:'TUNNEL',
 BOD:'BODIES',MUD:'MUD',QUI:'QUICKSAND',CRA:'CRACK',BAT:'BATS',VAT:'VATS',WOM:'WOMAN',COF:'COFFIN',VAM:'VAMPIRE',ACI:'ACID',POT:'POTION',
 SHA:'SHACKELS',ALM:'ALMANAC',BOO:'BOOKCASE',CHA:'CHANDALIER',PRI:'PRINCESS',CAS:'CASKET',KEY:'KEY',GAR:'GARLIC'};

DragonTales.register({
 id:'mansion', order:4,
 storage:'mansion',
 title:'Mansion of Doom', author:{fr:'Leroy C. Smith et Paul Austin',en:'Leroy C. Smith and Paul Austin'}, publisher:'Pal Creations / Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'La princesse Marléna a disparu dans le manoir du comte. Le soleil se couche à sept heures et quelque : ramène-la au village avant que le vampire ne s’éveille.',
  en:'Princess Marlena has vanished into the count’s mansion. The sun sets some time after seven: bring her back to the village before the vampire wakes.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine ----
 machine:{
  kind:'basic',
  victory:/WON THIS ADVENTURE/,
  endKeyLines:[4000],                                 // « PRESS 'Y' TO TRY AGAIN » : fin de partie
  echo:false,
  screen:true,                                        // écrans titres en couleur, carte en semi-graphiques (CLS n, SET, PRINT @)
  // Sur le Dragon, l'écran titre (rouge) restait affiché pendant que le programme lisait ses DATA, quelques secondes.
  // Ici la lecture est instantanée : une pause de 4 secondes avant la question des instructions rend l'écran titre.
  patches:{110:'FOR Z9=1 TO 2700:NEXT:CLS:PRINT@228,"NEED INSTRUCTIONS? (Y/N)"'}
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES,
 labels:{
  fr:{
   sub:"Une aventure de Leroy C. Smith et Paul Austin, Pal Creations, 1982. Version française.",
   bye:"Que la croix te garde.",
   won:"La princesse est sauvée !",
   mapHint:"Clique un lieu pour t’y rendre. Les niveaux : le rez-de-chaussée, les deux étages, la cave, la sous-cave.",
   intro:[
    "La princesse Marléna a disparu. Les villageois savent où chercher : dans le vieux manoir, de l’autre côté de la lande.",
    "Tu as jusqu’au coucher du soleil. Après, le maître des lieux se réveille.",
    "Le jeu ne comprend que deux mots à la fois : un verbe et un nom. Une lettre seule (N, S, E, O, H, B) te déplace."]},
  en:{
   sub:"An adventure by Leroy C. Smith and Paul Austin, Pal Creations, 1982.",
   bye:"May the cross keep you.",
   won:"The princess is saved!",
   mapHint:"Click a place to walk there. The levels: the ground floor, the two upper floors, the cellar, the sub-basement.",
   intro:[
    "Princess Marlena has disappeared. The villagers know where to look: in the old mansion, across the moor.",
    "You have until sunset. After that, the master of the house wakes up.",
    "The game only understands two words at a time: a verb and a noun. A single letter (N, S, E, W, U, D) moves you."]}
 },
 helpEn:'VERBS: GET, DROP, OPEN, CLOSE, LOOK, EXAMINE, SHOOT, READ, INVENTORY, HELP, QUIT. DIRECTIONS: N, S, E, W, U, D.%THE GAME ONLY READS TWO WORDS: A VERB AND A NOUN (GET CAGE, OPEN CHEST).',
 verbs:[['GET','Prendre','Take'],['DROP','Poser','Drop'],['EXAMINE','Examiner','Examine'],['READ','Lire','Read'],['OPEN','Ouvrir','Open'],
  ['CLOSE','Fermer','Close'],['SHOOT','Tirer sur','Shoot'],['INVENTORY','Inventaire','Inventory',1],['LOOK','Regarder','Look',1],['HELP','Secours','Help',1]],
 sfxAt:{},
 frSkip:[],
 revExtra:{GET:'PRENDRE',DROP:'POSER',OPEN:'OUVRIR',CLOSE:'FERMER',LOOK:'REGARDER',EXAMINE:'EXAMINER',SHOOT:'TIRER',READ:'LIRE',
  INVENTORY:'INVENTAIRE',HELP:'SECOURS',QUIT:'QUITTER',SLAY:'TUER'},
 nounEn:w=>{ const x=FR.frToEn('PRENDRE '+w).split(' '); return x.length>1?x[1]:''; },

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:77,
  dirs:DIRS,
  go:w=>w, goVerb:'GO',                               // le jeu se déplace avec une lettre seule
  promptText:'\nWHAT NOW? ',
  defaultScene:'1', transient:[],
  nouns:Object.values(FULL),
  pos:off=>POS[off],
  levelName:(lv,lang)=>[['le rez-de-chaussée','the ground floor'],['le premier étage','the first floor'],['le deuxième étage','the second floor'],
   ['la cave','the cellar'],['la sous-cave','the sub-basement']][lv][lang==='fr'?0:1],
  say:(text,lang,classic)=>mdSay(text,lang,classic),
  clean:(s,moved)=>mdClean(s,moved),
  // attentes de touche : « NEED INSTRUCTIONS? (Y/N) » (ligne 120) : non, l'introduction moderne les remplace ; ailleurs, espace
  autoKey:mem=>mem.line()===120?'N':' ',
  status(mem,lang){ const h=mem.v('H'), r=mem.v('R'); if(!r) return '';
   const t=7*60+Math.floor(h/7); const hh=Math.floor(t/60), mm=t%60;   // ÉBAUCHE : l'heure affichée reste à caler sur l'almanach et la montre
   return lang==='fr'?`${hh} h ${String(mm).padStart(2,'0')}`:`${hh}:${String(mm).padStart(2,'0')} pm`; },
  roomOff:mem=>Math.max(1,Math.floor(mem.v('F')))-1,
  roomKey:(mem,off)=>String(off+1),
  // destination de chaque sortie, lue dans B(F,1…6) ; la galerie des glaces (31) est réglée par les lignes 370 à 410
  links(mem,off){ const r=off+1, out={N:null,S:null,E:null,W:null,U:null,D:null};
   if(r===31) return {N:76,S:35,E:31,W:'puits',U:null,D:null};
   ['N','S','E','W','U','D'].forEach((d,j)=>{ const to=mem.a('B',r,j+1); if(to) out[d]=to-1; });
   if(r===74&&mem.v('A8')===1) out.W=74;                // l'acide s'est retiré : le caveau est à l'ouest
   return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d of ['N','S','E','W','U','D']) e[d]=l[d]!==null; return e; },
  locOf:off=>off+1, carried:-1,
  objects(mem){ const out=[], e=mem.v('E')||66, h=mem.v('H$');
   for(let n=1;n<=e;n++){ const name=mem.a('B$',n); if(!name) continue; const w=h.substr((n-1)*3,3);
    out.push({n,name,word:FULL[w]||w,loc:Math.floor(mem.a('A',n))}); } return out; },
  sceneExtras:()=>[],
  flags(mem){ return {heure:mem.v('H'),coucher:mem.v('R'),porte:mem.v('B'),courant:mem.v('A6')===1,cercueil:mem.v('B5')===1,vampire:mem.v('B9')===1,
   fers:mem.v('C4')===1}; }
 }
});
})();
