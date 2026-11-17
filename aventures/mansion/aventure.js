// Mansion of Doom — Leroy C. Smith et Paul Austin, Pal Creations, 1982 (diffusé par Dragon Data) — fiche de l'aventure.
// INTÉGRATION EN COURS (17/11/2026) : le jeu tourne, se gagne (solution.txt) et il est traduit ; décors, indices,
// sons et musique restent à faire (voir docs/PLAN-MANSION.md). Le dossier contient EN-COURS.md : build.py ne l'assemble
// qu'avec « --tout ».
// Ce fichier est assemblé après data.js, hints.js, scenes.js, sons.js et textes.js du même dossier : ROOMS, POS, HINTS, SCENES,
// MD_SFX/mdSfxFor/mdAmbient, FR, mdSay/mdClean.
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
  // Les parties perdues sans le savoir deviennent des fins expliquées (décidé le 17/11/2026) :
  //  4150 les sables mouvants (lieu 71) n'ont pas d'issue : on y meurt, avec l'explication, après la description ;
  //  1430 ouvrir la cassette avant d'avoir tué le vampire réduit la princesse en cendres : partie perdue, expliquée ;
  //  1920 tirer sur l'interrupteur condamne la cave au noir ; sans la princesse en main, partie perdue, expliquée ;
  //  1950 tirer sur la princesse : partie perdue, expliquée (le jeu laissait continuer sans victoire possible).
  // Les textes ajoutés sont traduits dans textes.js (MD_MSG).
  patches:{
   110:'FOR Z9=1 TO 2700:NEXT:CLS:PRINT@228,"NEED INSTRUCTIONS? (Y/N)"',
   4150:'IF F=71 THEN PRINT"THE QUICKSAND SWALLOWS YOU. THERE IS NO WAY OUT OF THE SOUTH PART OF THE MOOR. YOU ARE DEAD!":GOTO 3990 ELSE 270',
   1430:'IF M=64 AND A(63)=0 THEN A(63)=F:PRINT"YOU FOUND THE PRINCESS!":IF B9=0 THEN C3=1:D$(63)="NOTHING REMAINS OF HER BUT ASHES":PRINT"SHE TURNS TO ASH BEFORE YOUR    EYES":PRINT"WITHOUT HER YOU CAN\'T WIN. THE VAMPIRE HAD TO BE SLAIN BEFORE THE CASKET WAS OPENED. YOU HAVE LOST.":GOTO 3990',
   1920:'IF M=13 THEN A7=1:A6=0:IF A(63)<>-1 THEN PRINT"THE SWITCH IS DESTROYED. THE CELLAR WILL STAY DARK FOREVER, AND THE PRINCESS IS DOWN THERE. YOU HAVE LOST.":GOTO 3990',
   1950:'IF M=63 THEN B7=1:D$(63)="SHE IS DEAD":PRINT"OK, YOU SHOT HER":PRINT"YOU SHOT THE PRINCESS. THE TOWN WILL NEVER FORGIVE YOU. YOU HAVE LOST.":GOTO 3990'}
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES, HINTS,
 labels:{
  fr:{
   sub:"Une aventure de Leroy C. Smith et Paul Austin, Pal Creations, 1982. Version française.",
   bye:"Que la croix te garde.",
   won:"La princesse est sauvée !",
   sfxNote:"Les bips et le coup de feu du jeu d’origine jouent dans les deux versions ; les bruitages du manoir (vent, portes, chauves-souris, acide…) seulement dans la version moderne.",
   mapHint:"Clique un lieu pour t’y rendre. Les niveaux : le rez-de-chaussée, les deux étages, la cave, la sous-cave.",
   intro:[
    "La princesse Marléna a disparu. Les villageois savent où chercher : dans le vieux manoir, de l’autre côté de la lande.",
    "Tu as jusqu’au coucher du soleil. Après, le maître des lieux se réveille.",
    "Le jeu ne comprend que deux mots à la fois : un verbe et un nom. Une lettre seule (N, S, E, O, H, B) te déplace."]},
  en:{
   sub:"An adventure by Leroy C. Smith and Paul Austin, Pal Creations, 1982.",
   bye:"May the cross keep you.",
   won:"The princess is saved!",
   sfxNote:"The beeps and the gunshot of the original game play in both versions; the mansion sounds (wind, doors, bats, acid…) only in the modern version.",
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
 sfx:MD_SFX,                                           // sons propres à l'aventure (sons.js)
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
  // l'heure, comme la montre du jeu (EXAMINE WATCH, lignes 1700 à 1740) : midi + H minutes. Seulement quand on porte la montre.
  status(mem,lang){ if(mem.a('A',27)!==-1||mem.v('B1')===1) return ''; const h=Math.floor(mem.v('H')), hh=12+Math.floor(h/60), mm=String(h%60).padStart(2,'0');
   return lang==='fr'?`Montre : ${hh} h ${mm}`:`Watch: ${hh-12||12}:${mm} pm`; },
  musicZone:(key,kind)=>kind==='out',                  // dehors, devant le manoir, et sur la grand-place du village
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
  // objets ; dans la cave sans lumière, ceux du lieu où l'on est restent invisibles (le jeu dit qu'on n'y voit rien)
  objects(mem){ const out=[], e=mem.v('E')||67, h=mem.v('H$'), f=Math.floor(mem.v('F')), blind=f>48&&mem.v('A6')===0;
   for(let n=1;n<=e;n++){ const name=mem.a('B$',n); if(!name) continue; const w=h.substr((n-1)*3,3);
    if(blind&&Math.floor(mem.a('A',n))===f) continue;
    out.push({n,name,word:FULL[w]||w,loc:Math.floor(mem.a('A',n))}); } return out; },
  // éléments de scène (101 et plus) : états que les décors montrent (scenes.js)
  objLabel:(o,lang)=>{ const a=MD_OBJ[MD_NORM(o.name)]; return a?(lang==='fr'?a[1]:a[0]).replace(/^(a|an|the|un|une|des|du|de la|la|le) |^de l['’]/i,''):o.name; },
  sfxFor:(line,cmd,mem)=>mdSfxFor(line,cmd,mem),        // sons.js
  ambient:(mem,off)=>mdAmbient(mem,off+1),
  sceneExtras(mem,off){ const r=off+1, l=[], v=k=>mem.v(k), h=v('H'), R=v('R');
   if(v('B0')===1) l.push(101);                        // loup-garou abattu
   if(v('B5')===1) l.push(102);                        // cercueil ouvert
   if(v('B9')===1) l.push(103);                        // vampire tué
   if(v('A6')===1) l.push(104);                        // courant rétabli : lueur rouge dans la cave
   if(r>48&&v('A6')===0) l.push(105);                  // cave sans lumière : on n'y voit rien
   if(v('B8')===1) l.push(106);                        // cassette ouverte
   if(v('A8')===1) l.push(107);                        // acide neutralisé par le bicarbonate
   if(v('A5')===1) l.push(108);                        // coffre du grenier ouvert
   if(v('C6')===1) l.push(109);                        // porte d'entrée ouverte
   if(v('C5')===1) l.push(110);                        // bougie soufflée
   if(v('B2')===1) l.push(111);                        // cage ouverte
   if(v('B3')===1) l.push(112);                        // trappe ouverte
   if(v('C3')===1) l.push(113);                        // princesse en cendres
   if(v('A0')===1) l.push(114);                        // boîte à chaussures ouverte
   if(R&&h>=R-90) l.push(h>=R?116:115);                // le soir tombe, puis la nuit
   if(v('C4')===1) l.push(117);                        // dans les fers
   if(v('C0')===1) l.push(118);                        // fiole brisée
   if(mem.a('A',63)===-1&&v('C3')===0&&v('B7')===0) l.push(119);   // on porte la princesse, vivante
   return l; },
  flags(mem){ return {heure:mem.v('H'),coucher:mem.v('R'),porte:mem.v('B'),courant:mem.v('A6')===1,cercueil:mem.v('B5')===1,vampire:mem.v('B9')===1,
   fers:mem.v('C4')===1}; }
 }
});
})();
