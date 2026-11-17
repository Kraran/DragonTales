// S.S. Poseidon (Poseidon Adventure) — Bill et Debbie Cook, Dragon Data, 1982 — fiche de l'aventure pour DragonTales.
// Ce fichier est assemblé après data.js, hints.js, scenes.js, sons.js et textes.js du même dossier : ROOMS, POS, HINTS,
// SCENES, PS_SFX et psSfxFor, FR et psSay/psClean.
// Jeu en Dragon BASIC (moteur/basic.js). La partie se lit dans ses variables :
//   L lieu courant (1 à 20) ; R$(L,1) description, R$(L,2) sorties (« NOSO0411 » : nord vers 4, sud vers 11) ;
//   O$(n,1) nom de l'objet, O$(n,2) mot reconnu (3 lettres), O$(n,3) lieu (« 99 » porté, « 0 » caché), O$(n,4) description ;
//   T coups joués, MT coups permis (niveau), NO objets portés (5 au plus), C coupures, F1…F7 et DK : voir flags().
// Le jeu écrit à des places fixes de l'écran (PRINT @) : le lieu en haut, un séparateur, les messages qui défilent en bas.
(function(){
const CODE={NO:'N',SO:'S',EA:'E',WE:'W',UP:'U',DO:'D'};
// mot anglais complet de chaque objet (le jeu ne lit que ses trois premières lettres)
const WORD={8:'CHAIR',9:'CABLE',10:'DEBRIS',11:'FOOD',12:'CLEAVER',13:'BEAKER',14:'CABINET',15:'RAZOR',16:'RADIO',17:'PAPER',18:'LEAFLET',
  19:'JACKET',20:'JEWELS',23:'ROPE',24:'EXTINGUISHER',25:'HATCH',26:'CROWBAR',27:'FLASHLIGHT',28:'SIGN',29:'PAINTING',30:'PLATE'};
const WRENCH=32;                                     // l'armoire ouverte devient « A WRENCH » (O$(14,1)) : dessin à part
const WATER={fr:[[.75,'au cou'],[.5,'à la taille'],[.25,'aux genoux'],[0,'aux chevilles']],en:[[.75,'neck'],[.5,'waist'],[.25,'knees'],[0,'ankles']]};

DragonTales.register({
 id:'poseidon', order:3,
 storage:'poseidon',
 title:'S.S. Poseidon', author:'Bill et Debbie Cook', publisher:'Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'Un raz-de-marée a retourné le paquebot Poseidon, qui flotte la quille en l’air. Remonte jusqu’à la coque avant que l’eau n’envahisse tout.',
  en:'A tidal wave has capsized the liner Poseidon, which floats upside down. Climb up to the hull before the water fills the ship.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine ----
 machine:{
  kind:'basic',
  victory:/MADE IT TO FREEDOM/,
  endKeyLines:[2220],                                 // « WANT TO TRY AGAIN? » : fin de partie
  echo:false,
  screen:true,                                        // le texte est placé à l'écran (PRINT @) : la version classique reproduit l'écran
  // Correction du programme d'origine (décidée le 17/11/2026) : MANGER un objet que l'on porte répondait
  // « YOU DON'T HAVE IT » parce que le programme testait le mot de l'objet (O$(N,2)) au lieu de son lieu (O$(N,3)).
  // Les pièges mortels restent (décidé le 17/11/2026), mais chaque mort dit clairement pourquoi :
  //  490 dans le noir sans lampe, la partie continuait sans issue jusqu'à la fin des coups : c'est désormais une mort expliquée ;
  //  500/505 au poste radio en feu, sans extincteur, on restait enfermé : mort expliquée (avec l'extincteur, rien ne change) ;
  //  570/590 le passage secret mène à la salle de bal inondée : on s'y noie dès l'arrivée, avec l'explication ;
  //  1040 l'aide du poste radio parlait d'un « mot magique » qui n'existe pas : elle indique l'extincteur de la cuisine.
  // Les textes ajoutés sont calés sur les 32 colonnes de l'écran, comme ceux d'origine.
  patches:{
   1290:'IF O$(N,3)<>"99" THEN PRINT"YOU DON\'T HAVE IT.":GOTO 200',
   490:'IF L>3 AND O$(27,3)<>"99" THEN FOR A=0 TO 160 STEP 32:PRINT@A,CHR$(13):NEXT:PRINT@480,"IT\'S TOO DARK TO SEE ANYTHING.":PRINT"WITHOUT A LIGHT YOU GOT LOST IN THE DARK PASSAGES, AND THE      RISING WATER CAUGHT YOU.":DK=1:GOSUB 2230:GOTO 180',
   500:'IF L=10 AND F2=0 AND (O$(24,3)="99" OR VAL(O$(24,3))=10) THEN PRINT"A RAGING FIRE BARS YOUR WAY OUT.":GOTO 200',
   505:'IF L=10 AND F2=0 THEN PRINT"A RAGING FIRE BARS YOUR WAY OUT.":PRINT"WITHOUT AN EXTINGUISHER YOU     CAN\'T PUT IT OUT. THE SMOKE     FILLS THE ROOM AND YOU CHOKE TO DEATH.":GOSUB 2230:GOTO 180',
   570:'IF L=3 AND F7=1 THEN PRINT"YOU ARE UNDERWATER.":PRINT M$(24):PRINT"THE SECRET PASSAGE LED INTO THE FLOODED BALLROOM, AND YOU       DROWNED.":GOSUB 2230:GOTO 180',
   590:'L5=L:L=VAL(MID$(R$(L,2),A+LEN(R$(L,2))/2,2)):DB=DB+1:IF L=3 AND F7=1 THEN 570 ELSE 1400',
   1040:'IF L=10 AND F2=0 THEN PRINT"NO MAGIC WORD WILL PUT OUT THIS FIRE. YOU NEED AN EXTINGUISHER: THERE\'S ONE IN THE GALLEY.":GOTO 200'}
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES, HINTS,
 labels:{
  fr:{
   sub:"Une aventure de Bill et Debbie Cook, Dragon Data, 1982. Version française.",
   bye:"Bon vent, matelot.",
   won:"Sauvé !",
   sfxNote:"Les bips et les airs du jeu d’origine jouent dans les deux versions ; les bruitages du navire (eau, métal, flammes, machines) seulement dans la version moderne.",
   musicNote:"Pas encore de musique pour cette aventure.",
   mapHint:"Clique un lieu pour t’y rendre. De gauche à droite : les salons, les coursives, les ponts des machines. ▲▼ : un passage monte ou descend vers l’autre niveau.",
   intro:[
    "La veille du Nouvel An, un séisme sous-marin soulève une vague gigantesque. Le Poseidon, paquebot de luxe, chavire et flotte la quille en l’air.",
    "Tu reprends connaissance dans la salle de bal, au plafond devenu plancher. L’eau monte. La seule issue est tout en haut : la coque.",
    "Le temps est compté, et le nombre de coups aussi : choisis ton niveau au départ."]},
  en:{
   sub:"An adventure by Bill and Debbie Cook, Dragon Data, 1982.",
   bye:"Fair winds, sailor.",
   won:"Saved!",
   sfxNote:"The beeps and tunes of the original game play in both versions; the ship sounds (water, metal, flames, engines) only in the modern version.",
   musicNote:"No music for this adventure yet.",
   mapHint:"Click a place to walk there. From left to right: the lounge deck, the passageways, the engine decks. ▲▼: a passage leads up or down to the other level.",
   intro:[
    "On New Year’s Eve an undersea earthquake raises a gigantic wave. The luxury liner Poseidon capsizes and floats upside down.",
    "You come to in the ballroom, whose ceiling is now the floor. The water is rising. The only way out is at the very top: the hull.",
    "Time is short, and so are your moves: choose your skill level at the start."]}
 },
 helpEn:'VERBS: GO (OR N, S, E, W, U, D), CLIMB, GET, DROP, INVENTORY, EXAMINE, READ, OPEN, MOVE, USE, TIE, WEAR, DRINK, EAT, SAY, SCORE (MOVES LEFT), HELP (A HINT FROM THE GAME).%ANSWER "WITH WHAT?" WITH "WITH …" AND "TO WHAT?" WITH "TO …".%EXAMPLES: GET CHAIR, CLIMB CABLE, OPEN CABINET, WITH CROWBAR.',
 // [mot anglais du jeu, libellé français, libellé anglais, s'emploie sans cible ?] — le premier est le verbe par défaut
 verbs:[['GET','Prendre','Take'],['DROP','Poser','Drop'],['EXAMINE','Examiner','Examine'],['READ','Lire','Read'],['USE','Utiliser','Use'],
  ['OPEN','Ouvrir','Open'],['CLIMB','Grimper','Climb'],['TIE','Attacher','Tie'],['WITH','Avec…','With…'],['TO','À…','To…'],
  ['WEAR','Mettre','Wear'],['DRINK','Boire','Drink'],['EAT','Manger','Eat'],['MOVE','Déplacer','Move'],['SCORE','Coups','Score',1],['HELP','Secours','Help',1]],
 sfxAt:{},
 sfx:PS_SFX,                                           // sons propres à l'aventure (sons.js)
 frSkip:['EST','PORTE','A'],
 revExtra:{GET:'PRENDRE',DROP:'POSER',INVENTORY:'INVENTAIRE',GO:'ALLER',EXAMINE:'EXAMINER',USE:'UTILISER',WITH:'AVEC',TO:'À',CLIMB:'GRIMPER',
  TIE:'ATTACHER',WEAR:'METTRE',HELP:'SECOURS',SCORE:'SCORE',READ:'LIRE',OPEN:'OUVRIR',MOVE:'DÉPLACER',DRINK:'BOIRE',EAT:'MANGER',SAY:'DIRE',LIST:'LISTE'},
 nounEn:w=>{ const x=FR.frToEn('PRENDRE '+w).split(' '); return x.length>1?x[1]:''; },

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:20,
  dirs:{N:'NORTH',S:'SOUTH',E:'EAST',W:'WEST',U:'UP',D:'DOWN'},
  go:w=>'GO '+w, goVerb:'GO',
  promptText:'\n---> ',                               // invite remise après un chargement ou l'aide (version classique)
  scrollTop:8,                                        // écran partagé : seules les lignes 8 à 15 défilent (routine $600 du chargeur)
  screenFrame:[{p:224},{b:'='.repeat(31)+'\n'}],      // le séparateur, redessiné si l'écran est repris sans effacement
  defaultScene:'1', transient:[],
  nouns:Object.values(WORD).concat(['WRENCH','LEDGE','DOOR','VITAMINS']),
  pos:off=>POS[off+1],
  levelName:(lv,lang)=>[['le pont des salons','the lounge deck'],['les coursives','the passageways'],['les ponts des machines','the engine decks']][lv][lang==='fr'?0:1],
  say:(text,lang,classic)=>psSay(text,lang,classic),
  clean:(s,moved)=>psClean(s,moved),
  objLabel:(o,lang)=>{ const a=PS_OBJ[PS_NORM(o.name)]; return a?(lang==='fr'?a[1]:a[0]).replace(/^(a|an|un|une|des|de la) /i,''):o.name; },
  proper:(s,lang)=>s.replace(/\bposeidon\b/g,'Poseidon').replace(/\bs\.o\.s\./g,'S.O.S.').replace(/\bthe final countdown\b/gi,'The Final Countdown').replace(/\bcook\b/g,'Cook'),
  // choix du niveau (INPUT YY de la ligne 2160) : une fenêtre dans la version moderne, la question d'origine dans la classique
  menu(mem,lang){ if(mem.prompt()===null||mem.line()!==2160) return null; const fr=lang==='fr';
   return {title:fr?'Choisis ton niveau':'Choose your skill level',
    text:fr?'Le navire coule : plus le niveau est élevé, moins tu as de coups pour en sortir.':'The ship is sinking: the higher the level, the fewer moves you have to get out.',
    def:1, choices:[{en:'1',label:fr?'Expert':'Expert',note:fr?'75 coups':'75 moves'},{en:'2',label:fr?'Moyen':'Average',note:fr?'125 coups':'125 moves'},{en:'3',label:fr?'Débutant':'Novice',note:fr?'250 coups':'250 moves'}]}; },
  freeInput:mem=>mem.prompt()!==null&&mem.line()===2160,
  status(mem,lang){ const mt=mem.v('MT'), t=mem.v('T'); if(!mt) return ''; const left=Math.max(0,mt-t), w=WATER[lang==='fr'?'fr':'en'].find(x=>t>mt*x[0])||WATER.en[3];
   return lang==='fr'?`Encore ${left} coup${left>1?'s':''} — l’eau t’arrive ${w[1]}`:`${left} move${left===1?'':'s'} left — the water is up to your ${w[1]}`; },
  sfxFor:(line,cmd,mem)=>psSfxFor(line,cmd,mem),        // sons.js
  ambient(mem,off){ const r=off+1; return r===4?['ps_steam']:r===10&&mem.v('F2')===0?['ps_fire']:r===15?['ps_fire']:r===18?['ps_engine']:r===3&&mem.v('F7')===1?['ps_flood']:[]; },
  roomOff:mem=>mem.v('L')-1,
  roomKey:(mem,off)=>{ const r=off+1; if(r===3&&mem.v('F7')===1) return '3b'; if(r===14&&/UP/.test(mem.a('R$',14,2))) return '14b'; return String(r); },
  // destination de chaque sortie ; depuis les passages bas (17), nord, sud et ouest sont des puits qui ramènent au niveau 2
  links(mem,off){ const r=off+1, s=mem.a('R$',r,2)||'', h=s.length/2, out={N:null,S:null,E:null,W:null,U:null,D:null};
   for(let i=0;i<h;i+=2){ const c=s.substr(i,2), to=+s.substr(h+i,2)-1; if(CODE[c]) out[CODE[c]]=r===17&&c!=='EA'?'puits':to; }
   return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d of ['N','S','E','W','U','D']) e[d]=l[d]!==null; return e; },
  locOf:off=>off+1, carried:99,
  objects(mem){ const out=[]; for(let n=8;n<=30;n++){ const name=mem.a('O$',n,1); if(!name) continue;
    const wr=n===14&&name==='A WRENCH';
    out.push({n:wr?WRENCH:n,name,word:wr?'WRENCH':WORD[n],loc:+mem.a('O$',n,3)||0}); } return out; },
  // éléments de scène : 110 incendie du poste radio ; 113 noir complet ; 117 armoire ouverte ; 118 corde attachée à la corniche ;
  // 120 passage secret ouvert (infirmerie) ; 121 fiole vidée ; 200 + n : l'eau monte (n = pourcentage des coups joués)
  sceneExtras(mem,off){ const r=off+1, l=[];
   if(r===10&&mem.v('F2')===0) l.push(110);
   if(mem.v('DK')===1) l.push(113);
   if(r===7&&mem.v('F3')===2) l.push(117);
   if(mem.v('F5')===1&&(r===15||r===18)) l.push(118);
   if(r===6&&mem.v('F7')===1) l.push(120);
   if(mem.a('O$',13,1)==='EMPTY BEAKER') l.push(121);
   const mt=mem.v('MT'); if(mt) l.push(200+Math.min(100,Math.round(100*mem.v('T')/mt)));
   return l; },
  flags(mem){ return {coups:mem.v('T'),max:mem.v('MT'),vitamines:mem.v('F1')===1,feuEteint:mem.v('F2')===1,armoire:mem.v('F3'),gilet:mem.v('F4')===2,
   corde:mem.v('F5')===1,debris:mem.v('F6'),inonde:mem.v('F7')===1,noir:mem.v('DK')===1,coupures:mem.v('C')}; }
 }
});
})();
