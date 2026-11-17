// The Final Countdown — Bill et Debbie Cook, Dragon Data, 1983 — fiche de l'aventure pour DragonTales.
// INTÉGRATION EN COURS (17/11/2026) : voir docs/PLAN-FINALCOUNTDOWN.md. Le dossier contient EN-COURS.md : build.py ne
// l'assemble qu'avec « --tout ».
// Ce fichier est assemblé après data.js, hints.js, scenes.js, sons.js et textes.js du même dossier : ROOMS, POS, HINTS,
// SCENES, FC_SFX/fcSfxFor/fcAmbient, FR et fcSay/fcClean.
// Jeu en Dragon BASIC (moteur/basic.js), du même moule que S.S. Poseidon. La partie se lit dans ses variables :
//   L lieu courant (1 à 20) ; R$(L,1) description, R$(L,2) sorties (« NOSO0301 » : nord vers 3, sud vers 1 ; ST l'escalier,
//   PA le passage secret) ; O$(n,1) nom de l'objet, O$(n,2) lieu (« 99 » porté, « 0 » caché), O$(n,3) description ;
//   T coups joués, MT coups permis (niveau) ; NO objets portés (5 au plus) ; SH tirs du pistolet paralysant ;
//   F1 uniforme revêtu, F2 incendie du bureau du commandant, F3 tiroir ouvert, F4 bouton UN (ou uniforme examiné),
//   F6 gants mis, ID autorisation acceptée, PA passage du labyrinthe trouvé, WI vitre cassée, XX le général est là.
(function(){
const CODE={NO:'N',SO:'S',EA:'E',WE:'W',UP:'U',DO:'D',PA:'W'};   // ST (l'escalier secret) : « bas » une fois l'armoire déplacée
// mot anglais complet de chaque objet (le jeu ne lit que ses trois premières lettres)
const WORD={7:'SNAKE',9:'RADIO',10:'UNIFORM',11:'TASER',13:'PAPERS',15:'CAMERA',16:'GATE',17:'ELEVATOR',19:'SCREEN',21:'DESK',22:'KEY',
  23:'DRAWER',24:'CABINET',25:'STAIRWAY',26:'GLOVES',27:'BOARD',28:'MONITORS',29:'BUTTONS',30:'DESK',31:'CUTTERS',32:'PASSAGE',34:'WINDOW',
  35:'BOTTLE',36:'GENERAL',37:'PHONE',40:'BUTTONS',41:'PANEL'};

DragonTales.register({
 id:'finalcountdown', order:5,
 storage:'finalcountdown',
 title:'The Final Countdown', author:{fr:'Bill et Debbie Cook',en:'Bill and Debbie Cook'}, publisher:'Dragon Data', year:1983, system:'Dragon 32',
 blurb:{
  fr:'Un général devenu fou a lancé le compte à rebours d’un missile nucléaire, puis fait évacuer la base. Entre dans le silo et arrête le tir avant la troisième guerre mondiale.',
  en:'A berserk general has started the countdown on a nuclear missile and had the base evacuated. Get into the silo and stop the launch before World War III.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine ----
 machine:{
  kind:'basic',
  victory:/STOPPED THE COUNTDOWN/,
  endKeyLines:[60],                                   // « WANT TO TRY AGAIN? » (GOSUB 60 depuis la ligne 210) : fin de partie
  echo:false,
  screen:true,                                        // le texte est placé à l'écran (PRINT @) : la version classique reproduit l'écran
  // 40 : le programme poke une petite routine en langage machine ($600) qui fait défiler le bas de l'écran ; le moteur
  // fait ce défilement lui-même (scrollTop), il suffit de lire les 59 octets qui précèdent les données du jeu.
  // Commodités pour jouer à la souris (le jeu d'origine n'en souffre pas) :
  //  810 l'escalier découvert derrière l'armoire se prend aussi par « bas » (le jeu ne connaissait que « GO STAIRWAY ») ;
  //  470 une fois le passage du labyrinthe trouvé, « ouest » y mène (sinon seul « GO PASSAGE » y menait).
  patches:{
   40:'FOR I=1 TO 59:READ A$:NEXT',
   470:'IF L=13 AND N=32 THEN 550 ELSE IF L=13 AND N=4 AND PA=1 THEN A=9:GOTO 550',
   810:'IF N=24 THEN O$(25,2)="8":R$(8,2)="WESOSTDO18090707":PRINT"WOW! LOOK!":GOSUB 1560:T=T+1:IF T<MT THEN 290 ELSE 180',
   // Décidé le 17/11/2026 :
   //  540 l'incendie du bureau du commandant (déclenché par le bouton TROIS) enfermait le joueur sans extincteur jusqu'à la
   //      fin du compte à rebours : c'est désormais une mort expliquée (avec l'extincteur, porté ou posé là, rien ne change) ;
   //  1480 cette ligne interceptait le bouton UN du poste de contrôle de tir, si bien que le piège prévu par les auteurs
   //      (ligne 1510 : appuyer sur UN lance le missile) ne se déclenchait jamais : il est rétabli.
   540:'IF L=10 AND F2=1 AND (O$(35,2)="99" OR VAL(O$(35,2))=10) THEN PRINT"A RAGING FIRE BARS YOUR WAY OUT":GOTO 250 ELSE IF L=10 AND F2=1 THEN PRINT"A RAGING FIRE BARS YOUR WAY OUT":PRINT"THE FIRE HAS YOU TRAPPED. WITHOUT AN EXTINGUISHER YOU CAN\'T PUT IT OUT, AND THE SMOKE FILLS THE OFFICE.":GOTO 200',
   1480:'REM'}
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES, HINTS,
 labels:{
  fr:{
   sub:"Une aventure de Bill et Debbie Cook, Dragon Data, 1983. Version française.",
   bye:"Mission terminée.",
   won:"Compte à rebours arrêté !",
   sfxNote:"Le jeu d’origine est muet : les bruitages de la base (vent, radio, grille, feu, ascenseur, pistolet paralysant, sirène…) ne jouent que dans la version moderne.",
   mapHint:"Clique un lieu pour t’y rendre. À gauche la surface, à droite le silo, sous terre. ▲▼ : un passage monte ou descend vers l’autre niveau.",
   intro:[
    "Un général pris de folie a lancé le compte à rebours d’un missile nucléaire, puis fait évacuer sa base en plein désert.",
    "Tu arrives devant l’entrée principale. Il faut entrer dans le silo et arrêter le tir avant que la troisième guerre mondiale n’éclate.",
    "Le compte à rebours ne t’attend pas : choisis ton niveau au départ."]},
  en:{
   sub:"An adventure by Bill and Debbie Cook, Dragon Data, 1983.",
   bye:"Mission over.",
   won:"Countdown stopped!",
   sfxNote:"The original game is silent: the base sounds (wind, radio, gate, fire, elevator, taser, siren…) only play in the modern version.",
   mapHint:"Click a place to walk there. On the left the surface, on the right the silo, underground. ▲▼: a passage leads up or down to the other level.",
   intro:[
    "A berserk general has started the countdown on a nuclear missile, then had his desert base evacuated.",
    "You arrive outside the main gate. Get into the silo and stop the launch before World War III breaks out.",
    "The countdown won't wait for you: choose your skill level at the start."]}
 },
 helpEn:'VERBS: GO (OR N, S, E, W, U, D), GET, DROP, INVENTORY, WEAR, EXAMINE, MOVE, USE, UNLOCK, SHOW, SHOOT, BREAK, PRESS (ONE, TWO, THREE), SCORE (THE COUNTDOWN), HELP (A HINT FROM THE GAME).%EXAMPLES: WEAR UNIFORM, SHOW PAPERS, GO STAIRWAY, PRESS THREE.',
 // [mot anglais du jeu, libellé français, libellé anglais, s'emploie sans cible ?] — le premier est le verbe par défaut
 verbs:[['GET','Prendre','Take'],['DROP','Poser','Drop'],['EXAMINE','Examiner','Examine'],['WEAR','Mettre','Wear'],['USE','Utiliser','Use'],
  ['SHOW','Montrer','Show'],['SHOOT','Tirer sur','Shoot'],['UNLOCK','Déverrouiller','Unlock'],['MOVE','Déplacer','Move'],['BREAK','Casser','Break'],
  ['PRESS','Appuyer sur','Press'],['SCORE','Compte à rebours','Score',1],['HELP','Secours','Help',1]],
 sfxAt:{},
 sfx:FC_SFX,                                           // sons propres à l'aventure (sons.js)
 frSkip:['EST','PORTE','A'],
 revExtra:{GET:'PRENDRE',DROP:'POSER',INVENTORY:'INVENTAIRE',GO:'ALLER',EXAMINE:'EXAMINER',USE:'UTILISER',WEAR:'METTRE',HELP:'SECOURS',SCORE:'SCORE',
  READ:'LIRE',OPEN:'OUVRIR',MOVE:'DÉPLACER',SHOW:'MONTRER',SHOOT:'TIRER',UNLOCK:'DÉVERROUILLER',BREAK:'CASSER',PRESS:'APPUYER',QUIT:'QUITTER',
  ONE:'UN',TWO:'DEUX',THREE:'TROIS'},
 nounEn:w=>{ const x=FR.frToEn('PRENDRE '+w).split(' '); return x.length>1?x[1]:''; },

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:20,
  dirs:{N:'NORTH',S:'SOUTH',E:'EAST',W:'WEST',U:'UP',D:'DOWN'},
  go:w=>'GO '+w, goVerb:'GO',
  promptText:'\n :',                                  // invite remise après un chargement ou l'aide (version classique)
  scrollTop:8,                                        // écran partagé : seules les lignes 8 à 15 défilent (routine $600)
  screenFrame:[{p:224},{b:'='.repeat(31)+'\n'}],      // le séparateur, redessiné si l'écran est repris sans effacement
  defaultScene:'2', transient:[],
  nouns:Object.values(WORD).concat(['ONE','TWO','THREE']),
  pos:off=>POS[off+1],
  levelName:(lv,lang)=>[['la surface','the surface'],['le silo','the silo']][lv][lang==='fr'?0:1],
  say:(text,lang,classic)=>fcSay(text,lang,classic),
  clean:(s,moved)=>fcClean(s,moved),
  objLabel:(o,lang)=>{ const a=FC_OBJ[FC_NORM(o.name).toUpperCase()]; return a?(lang==='fr'?a[1]:a[0]).replace(/^(an|a|the|une|un|des|le|la) |^l['’]/i,''):o.name; },
  proper:(s,lang)=>s.replace(/\bthe final countdown\b/gi,'The Final Countdown').replace(/\bcook\b/g,'Cook').replace(/\bi love lucy\b/gi,'I Love Lucy').replace(/\bmaison-blanche\b/g,'Maison-Blanche').replace(/\bwhite house\b/g,'White House'),
  // choix du niveau (INPUT YY de la ligne 2140) : une fenêtre dans la version moderne, la question d'origine dans la classique
  menu(mem,lang){ if(mem.prompt()===null||mem.line()!==2140) return null; const fr=lang==='fr';
   return {title:fr?'Choisis ton niveau':'Choose your skill level',
    text:fr?'Le missile part à la fin du compte à rebours : plus le niveau est élevé, moins tu as de coups pour l’arrêter.':'The missile goes when the countdown ends: the higher the level, the fewer moves you have to stop it.',
    def:1, choices:[{en:'1',label:fr?'Expert':'Expert',note:fr?'75 coups':'75 moves'},{en:'2',label:fr?'Moyen':'Average',note:fr?'125 coups':'125 moves'},{en:'3',label:fr?'Débutant':'Novice',note:fr?'250 coups':'250 moves'}]}; },
  freeInput:mem=>mem.prompt()!==null&&mem.line()===2140,
  // « ARE YOU SURE YOU WANT TO QUIT? » (ligne 1180) : la version moderne répond non (elle a son propre bouton Quitter)
  musicZone:key=>['1','2','3'].includes(key),          // dehors : le désert, la camionnette, l'entrée principale
  sfxFor:(line,cmd,mem)=>fcSfxFor(line,cmd,mem),        // sons.js
  ambient:(mem,off)=>fcAmbient(mem,off+1),
  autoKey:mem=>mem.line()===1180?'N':' ',
  status(mem,lang){ const mt=mem.v('MT'), t=mem.v('T'); if(!mt) return ''; const left=Math.max(0,mt-t), fr=lang==='fr';
   const taser=mem.a('O$',11,2)==='99'?(fr?` — pistolet : ${mem.v('SH')} tir${mem.v('SH')>1?'s':''}`:` — taser: ${mem.v('SH')} shot${mem.v('SH')===1?'':'s'}`):'';
   return (fr?`T moins ${left}`:`T minus ${left}`)+taser; },
  roomOff:mem=>mem.v('L')-1,
  roomKey:(mem,off)=>String(off+1),
  // destination de chaque sortie ; PA (le passage du labyrinthe) mène à l'ouest, dans la salle d'observation ; les autres
  // sorties du labyrinthe y ramènent
  links(mem,off){ const r=off+1, s=mem.a('R$',r,2)||'', h=s.length/2, out={N:null,S:null,E:null,W:null,U:null,D:null};
   for(let i=0;i<h;i+=2){ const c=s.substr(i,2), to=+s.substr(h+i,2)-1; if(CODE[c]) out[CODE[c]]=r===13&&c!=='PA'?'labyrinthe':to; }
   return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d of ['N','S','E','W','U','D']) e[d]=l[d]!==null; return e; },
  locOf:off=>off+1, carried:99,
  objects(mem){ const out=[]; for(let n=7;n<=41;n++){ if(n===33) continue; const name=mem.a('O$',n,1); if(!name) continue;
    out.push({n,name,word:WORD[n],loc:+mem.a('O$',n,2)||0}); } return out; },
  // éléments de scène : 101 grille ouverte (autorisation acceptée) ; 102 incendie du bureau du commandant ; 103 ascenseur
  // en service ; 104 vitre de la salle d'observation brisée ; 106 armoire métallique déverrouillée ; 1000 + n : il reste n coups
  sceneExtras(mem,off){ const l=[], v=k=>mem.v(k);
   if(v('ID')===1) l.push(101);
   if(v('F2')===1) l.push(102);
   if(/UP/.test(mem.a('R$',11,2)||'')) l.push(103);
   if(v('WI')===1) l.push(104);
   if(/OPEN/.test(mem.a('O$',24,3)||'')) l.push(106);
   const mt=v('MT'); if(mt) l.push(1000+Math.max(0,mt-v('T')));
   return l; },
  flags(mem){ return {coups:mem.v('T'),max:mem.v('MT'),uniforme:mem.v('F1')===1,feu:mem.v('F2')===1,gants:mem.v('F6')===1,autorise:mem.v('ID')===1,
   passage:mem.v('PA')===1,vitre:mem.v('WI')===1,general:mem.v('XX')===1,tirs:mem.v('SH')}; }
 }
});
})();
