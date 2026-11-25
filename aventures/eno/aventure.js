// Eno — Paul Austin et Leroy C. Smith, Pal Creations, 1982 (diffusé par Dragon Data) — fiche de l'aventure.
// Intégration commencée le 19/11/2026 : voir docs/PLAN-ENO.md.
// Ce fichier est assemblé après data.js, fins.js, hints.js, scenes.js, sons.js et textes.js du même dossier : ROOMS, POS, FINS, HINTS, SCENES,
// ENO_SFX/enoSfxFor/enoAmbient, FR, ENO_OBJ, enoSay/enoClean.
// Jeu en Dragon BASIC (moteur/basic.js), des mêmes auteurs que Mansion of Doom. La partie se lit dans ses variables :
//   F lieu courant (1 à 15) ; A$(F) description ; B(F,1…6) sorties N S E W U D (0 = pas de sortie) ;
//   B$(n) nom de l'objet, A(n) lieu (-1 porté, 0 caché) ; H$ les mots de 3 lettres des objets ; E nombre d'objets (28) ;
//   B objets portés (5 au plus, A) ; C(1) livre ouvert, C(2) portes de la table d'appoint (11) ouvertes, C(3) rideaux ouverts ;
//   O nombre d'appels à l'aide (HELP).
(function(){
const DIRS={N:'N',S:'S',E:'E',W:'W',U:'U',D:'D'};
// mot anglais complet de chaque objet, d'après ses trois lettres (H$)
const FULL={RUG:'RUG',BOA:'BOARD',CAT:'CAT',SEA:'SEAT',PIC:'PICTURE',SAF:'SAFE',BUC:'BUCKS',TAN:'TANK',FIS:'FISH','TV':'TV',CHA:'CHAIR',
 CUS:'CUSHION',MAG:'MAGAZINE',LAM:'LAMP',BUL:'BULB',CUR:'CURTAINS',WIN:'WINDOW',TAB:'TABLE',DOO:'DOORS',SHO:'SHOES',SOF:'SOFA',BOO:'BOOK',REM:'REMAINS'};

DragonTales.register({
 id:'eno', order:6,
 storage:'eno',
 rating:{difficulty:2.4,overall:2.8},
 title:'Eno', author:{fr:'Paul Austin et Leroy C. Smith',en:'Paul Austin and Leroy C. Smith'}, publisher:'Pal Creations / Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'Ta tante excentrique est morte et te lègue ses millions, à condition de les trouver. Seul indice : le salon. Et un chat qui s’appelait Eno.',
  en:'Your eccentric aunt has died and left you her millions, if you can find them. Your only clue: the living room. And a cat called Eno.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine ----
 machine:{
  kind:'basic',
  victory:/NOW A MILLIONAIRE/,
  endKeyLines:[2200],                                 // « PRESS <Y> TO TRY AGAIN » : fin de partie
  echo:false,
  screen:true,                                        // écran titre, scénario et vocabulaire (PRINT @)
  // Sur le Dragon, l'écran titre restait affiché pendant que le programme lisait ses DATA, quelques secondes.
  // Ici la lecture est instantanée : une pause de 4 secondes avant le scénario rend l'écran titre (comme Mansion of Doom).
  // Correctifs (décisions du 19/11/2026, docs/PLAN-ENO.md) :
  //   2180 : après le rat, « CALL FOR HELP? » se reposait en boucle tant qu'on ne tapait pas HELP : toute réponse mène à la fin ;
  //   1210 : le coffre-fort ouvert ne se dit plus « fermé à clé » ; 1350 : les portes ouvertes de la table d'appoint le disent ;
  //   1090, 1100 : fermer les portes ou le livre les fermait pour de faux (le jeu disait « fermé » sans rien changer).
  patches:{
   1090:'IFM=20ANDC(2)=1THENPRINT"OK, THEY\'RE CLOSED.":C(2)=0:GOTO330:ELSEIFM=20THENPRINT"THEY\'RE ALREADY CLOSED":GOTO330',
   1100:'IFM=24ANDC(1)=1THENPRINT"OK, IT\'S CLOSED.":C(1)=0:GOTO330:ELSEIFM=24THENPRINT"IT\'S ALREADY CLOSED":GOTO330',
   1210:'IFM=6ANDA(7)=0THENPRINT"IT\'S LOCKED.":GOTO330:ELSEIFM=6THENPRINT"IT\'S OPEN.":GOTO330',
   1350:'IFM=20ANDC(2)=0THENPRINT"THEY\'RE CLOSED.":GOTO330:ELSEIFM=20THENPRINT"THEY\'RE OPEN.":GOTO330',
   2180:'CLS:PRINT"YOU SHOULD HAVE WATCHED YOUR    CHOLESTEROL INTAKE. YOU ARE DEAD":GOTO2190',
   130:'FOR Z9=1 TO 2700:NEXT:CLS:PRINT"YOUR ECCENTRIC AUNT HAS JUST    DIED AND LEFT YOU HER ESTATE.   SHE HAD MILLIONS.":PRINT"IF YOU FIND IT, IT\'S YOURS!!!   YOUR ONLY CLUE: LIVING ROOM!?!?!"'}
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES, HINTS, endings:FINS,   // FINS : fins.js (collection des fins)
 labels:{
  fr:{
   sub:"Une aventure de Paul Austin et Leroy C. Smith, Pal Creations, 1982. Version française.",
   bye:"Bonne chasse au trésor.",
   won:"Te voilà millionnaire !",
   musicNote:"Elle joue dans tout le salon.",
   sfxNote:"Le bip de l’invite du jeu d’origine joue dans les deux versions ; les bruitages du salon seulement dans la version moderne.",
   mapHint:"Clique un endroit du salon pour t’y rendre.",
   intro:[
    "Ta tante excentrique vient de mourir et te laisse tous ses biens. Elle avait des millions : s’ils sont à toi, encore faut-il les trouver.",
    "Son seul indice : le salon. Tout se joue dans cette pièce, entre l’aquarium, la télévision et les fauteuils.",
    "Le jeu ne comprend que deux mots à la fois : un verbe et un nom. Une lettre seule (N, S, E, O) te déplace."]},
  en:{
   sub:"An adventure by Paul Austin and Leroy C. Smith, Pal Creations, 1982.",
   bye:"Good hunting.",
   won:"You are now a millionaire!",
   musicNote:"It plays throughout the living room.",
   sfxNote:"The prompt beep of the original game plays in both versions; the living room sounds only in the modern version.",
   mapHint:"Click a spot in the living room to walk there.",
   intro:[
    "Your eccentric aunt has just died and left you her whole estate. She had millions: they are yours, if you can find them.",
    "Her only clue: the living room. Everything happens in this one room, between the fish tank, the TV and the armchairs.",
    "The game only understands two words at a time: a verb and a noun. A single letter (N, S, E, W) moves you."]}
 },
 helpEn:'VERBS: GET, DROP, OPEN, CLOSE, LOOK, EXAMINE, PUSH, BREAK, ENTER, READ, CHANGE (TURN), INVENTORY, HELP, QUIT. DIRECTIONS: N, S, E, W.%THE GAME ONLY READS TWO WORDS: A VERB AND A NOUN (EXAMINE RUG, OPEN BOOK).',
 verbs:[['GET','Prendre','Take'],['DROP','Poser','Drop'],['EXAMINE','Examiner','Examine'],['READ','Lire','Read'],['OPEN','Ouvrir','Open'],
  ['CLOSE','Fermer','Close'],['PUSH','Pousser','Push'],['BREAK','Casser','Break'],['CHANGE','Tourner','Turn'],['ENTER','Entrer','Enter'],
  ['INVENTORY','Inventaire','Inventory',1],['LOOK','Regarder','Look',1],['HELP','Aide','Help',1]],
 sfxAt:{},
 sfx:ENO_SFX,                                          // sons propres à l'aventure (sons.js)
 frSkip:[],
 revExtra:{GET:'PRENDRE',DROP:'POSER',OPEN:'OUVRIR',CLOSE:'FERMER',LOOK:'REGARDER',EXAMINE:'EXAMINER',PUSH:'POUSSER',BREAK:'CASSER',ENTER:'ENTRER',
  READ:'LIRE',CHANGE:'TOURNER',INVENTORY:'INVENTAIRE',HELP:'AIDE',QUIT:'QUITTER'},
 nounEn:w=>{ const x=FR.frToEn('PRENDRE '+w).split(' '); return x.length>1?x[1]:''; },

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:15,
  dirs:DIRS,
  go:w=>w, goVerb:'GO',                               // le jeu se déplace avec une lettre seule
  promptText:'\nWHAT NOW? ',
  defaultScene:'1', transient:[],
  nouns:Object.values(FULL),
  pos:off=>POS[off],
  levelName:(lv,lang)=>lang==='fr'?'le salon':'the living room',
  say:(text,lang,classic)=>enoSay(text,lang,classic),
  clean:(s,moved)=>enoClean(s,moved),
  autoKey:mem=>' ',                                   // écrans titre et vocabulaire : une touche
  musicZone:(key,kind)=>true,                          // la musique joue dans tout le salon
  roomOff:mem=>Math.max(1,Math.floor(mem.v('F')))-1,
  roomKey:(mem,off)=>String(off+1),
  links(mem,off){ const r=off+1, out={N:null,S:null,E:null,W:null,U:null,D:null};
   ['N','S','E','W','U','D'].forEach((d,j)=>{ const to=mem.a('B',r,j+1); if(to) out[d]=to-1; });
   return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d of ['N','S','E','W','U','D']) e[d]=l[d]!==null; return e; },
  locOf:off=>off+1, carried:-1,
  objects(mem){ const out=[], e=mem.v('E')||28, h=mem.v('H$')||'';
   for(let n=1;n<=e;n++){ const name=mem.a('B$',n); if(!name) continue; const w=h.substr((n-1)*3,3).trim();
    out.push({n,name,word:FULL[w]||w,loc:Math.floor(mem.a('A',n))}); } return out; },
  // noms propres que la mise en minuscules de la version moderne ne doit pas toucher
  proper:(s,lang)=>s.replace(/\beno\b/g,'Eno').replace(/\balien\b/g,'Alien').replace(/\bpologne\b/g,'Pologne').replace(/\bpoland\b/g,'Poland').replace(/\bone\b(?= à l’envers| backwards)/g,'ONE'),
  objLabel:(o,lang)=>{ const a=ENO_OBJ[ENO_NORM(o.name)]; return a?(lang==='fr'?a[1]:a[0]).replace(/^(a|an|the|un|une|des|les|le|la) |^l['’]/i,''):o.name; },
  sfxFor:(line,cmd,mem)=>enoSfxFor(line,cmd,mem),       // sons.js
  ambient:(mem,off)=>enoAmbient(mem,off+1),
  // éléments de scène (101 et plus) : états que les décors montrent (scenes.js)
  sceneExtras(mem,off){ const l=[];
   if(mem.a('C',1)===1) l.push(101);                   // livre ouvert
   if(mem.a('C',2)===1) l.push(102);                   // portes de la table d'appoint (11) ouvertes
   if(mem.a('C',3)===1) l.push(103);                   // rideaux ouverts
   if(mem.a('A',7)!==0) l.push(104);                   // coffre-fort ouvert
   return l; },
  flags(mem){ return {porte:mem.v('B'),aide:mem.v('O'),livre:mem.a('C',1)===1,portes:mem.a('C',2)===1,rideaux:mem.a('C',3)===1}; }
 }
});
})();
