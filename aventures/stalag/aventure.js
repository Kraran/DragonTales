// Stalag — Paul Austin et Leroy C. Smith, Pal Creations, 1982 (diffusé par Dragon Data) — fiche de l'aventure.
// Intégration commencée le 26/11/2026 : voir docs/PLAN-STALAG.md.
// Ce fichier est assemblé après data.js, fins.js, hints.js, scenes.js, sons.js et textes.js du même dossier.
// Jeu en Dragon BASIC (moteur/basic.js), des auteurs de Mansion of Doom et d'Eno. La partie se lit dans ses variables :
//   F lieu courant (1 à 34) ; A$(F) description ; B(F,1…6) sorties N S E W U D (0 = pas de sortie) ;
//   B$(n) nom de l'objet, A(n) lieu (-1 porté, 0 caché) ; H$ les mots de 3 lettres des objets ; E nombre d'objets (85) ;
//   B objets portés (5 au plus, A) ; H tours écoulés (le danger des bombes grandit avec) ; O appels à l'aide ;
//   C(1) cadenas de la baraque 3 ouvert, C(2) laçage coupé, C(3) chien nourri, C(4) boîte de jambon ouverte,
//   C(5) cadenas à combinaison ouvert, C(9) trou de la clôture est, C(10) courant de la clôture coupé (1),
//   C(11) hémorragie (tours), C(12) le chien est prêt à mordre.
(function(){
const DIRS={N:'N',S:'S',E:'E',W:'W',U:'U',D:'D'};
// mot anglais complet de chaque objet (par numéro), pour les commandes envoyées au clic
const WORD=[null,'TABLE','CUP','COIN','LOCKER','BELT','BUNKS','DESK','CARDS','RACKS','BOOTS','CLAY','DOOR','DOOR','PADLOCK','BEDS','TILES','BOARDS',
 'OPENING','BUCKET','SHOVEL','COTS','PILLOW','NOTE','CABINET','BANDAGES','BOTTLE','TABLE','SCISSORS','CHUTE','SINK','PLUMBING','STALLS','GRATE','HOOKS',
 'JACKET','BENCHES','CANOPENER','ICEBOX','STOVE','WIRECUTTERS','COUNTER','DRAWER','KNIFE','TIN','SOIL','HOE','AXE','WHEELBARROW','DIRT','DOOR','LOCK',
 'FOREST','CHEST','ROPE','BOX','RADIO','MOUSE','LADDER','FOOTBALL','KEY','LACING','BAT','HOUSE','DOG','NEEDLE','HOLE','GATE','FENCE','FENCE','FENCE',
 'TOWER','TOWER','TOWER','TOWER','TUNNEL','TUNNEL','TUNNEL','SWITCH','SIGN','LABEL','FENCE','HAM','DEPRESSION','HOLE','BLOOD'];

DragonTales.register({
 id:'stalag', order:7,
 storage:'stalag',
 rating:{difficulty:3.6,overall:3.4},
 title:'Stalag', author:{fr:'Paul Austin et Leroy C. Smith',en:'Paul Austin and Leroy C. Smith'}, publisher:'Pal Creations / Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'1944. Les Allemands ont évacué le camp de prisonniers avant le bombardement allié… en oubliant un homme au mitard. Toi. Sors vivant avant que les bombes ne tombent.',
  en:'1944. The Germans evacuated the prison camp before the Allied bombing… and forgot one man in the hot box. You. Get out alive before the bombs hit.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine ----
 machine:{
  kind:'basic',
  victory:/YOU MADE IT IN TIME/,
  endKeyLines:[4240],                                 // « [PRESS <Y> TO TRY AGAIN] » : fin de partie
  echo:false,
  screen:true,                                        // écran titre, scénario et vocabulaire (PRINT @)
  // Correctifs (docs/PLAN-STALAG.md) :
  //   125 : sur le Dragon, l'écran titre restait affiché pendant la lecture des DATA ; ici elle est instantanée :
  //         une pause de quatre secondes le rend (comme Mansion of Doom et Eno) ;
  //   300 : dans la forêt, le jeu tournait en boucle sans fin après le message de victoire : il propose de rejouer ;
  //   220 : « TIMER=50000 » (régler l'horloge du Dragon) n'a pas d'effet sur le hasard : retiré ;
  //   4320 : le bombardement ne s'annonçait que par des éclairs de couleur : une phrase dit ce qui s'est passé.
  // Décisions du 26/11/2026 :
  //   1380 : creuser une deuxième fois près de la clôture est faisait tomber au fond d'un trou sans sortie, où l'on ne
  //          pouvait plus que creuser encore pour mourir : c'est maintenant une fin, expliquée tout de suite ;
  //   2210 : la boîte de jambon ouverte se dit ouverte ; 1630 : la porte verrouillée de la baraque des gardes ne
  //          répond plus deux fois ; 2780-2790 : refermer la porte ou le cadenas de la baraque 3 les referme vraiment.
  patches:{
   125:'FOR Z9=1 TO 2700:NEXT:CLS:PRINT@231,"TURN THE SOUND UP":FORC=1TO1000:NEXTC:SOUND100,1:SOUND150,1:SOUND200,1',
   220:'F=17:A(65)=-1:B=1:G=RND(50000):H=0:C(11)=0',
   300:'IF F=33 THEN 4230',
   1380:'IF M=84 AND C(9)=2 THEN CLS:PRINT"YOU DUG SO DEEP THAT YOU FELL INTO THE HOLE. THE WALLS ARE TOO STEEP TO CLIMB: YOU ARE TRAPPED AT THE BOTTOM OF YOUR OWN GRAVE.":GOTO4230',
   1630:'IFM=50 AND C(5)<>1THENPRINT"WHO DO YOU THINK YOU ARE, ALI   BABA? THERE IS A LOCK HERE!":A(51)=F:GOTO360',
   2210:'IFM=44 AND C(4)<>1THEN PRINT"IT IS SEALED":GOTO360:ELSE IF M=44 THEN PRINT"IT IS OPEN":GOTO360',
   2780:'IFM=39 OR M=4 OR M=12 OR M=24 OR M=26 OR M=38 OR M=55 OR M=42 OR M=53 THEN PRINT"OK, IT IS CLOSED":GOTO360',
   2785:'IF M=13 AND B(31,1)=3 THEN PRINT"OK, IT IS CLOSED":B(31,1)=0:B$(13)="AN UNLOCKED DOOR":GOTO360:ELSE IF M=13 THEN PRINT"IT\'S ALREADY CLOSED":GOTO360',
   2790:'IF M=14 AND B(31,1)=3 THEN PRINT"CLOSE THE DOOR FIRST.":GOTO360:ELSE IF M=14 THEN PRINT"OK, IT IS LOCKED AGAIN":C(1)=0:B$(14)="A PADLOCK":B$(13)="A WOODEN DOOR":GOTO360',
   4320:'CLS:PRINT"THE ALLIED BOMBS HIT THE CAMP. YOU DIDN\'T GET OUT IN TIME!":GOTO4230'}
 },

 // ---- textes, lieux, dessins ----
 FR, ROOMS, SCENES, HINTS, endings:FINS,   // FINS : fins.js (collection des fins)
 labels:{
  fr:{
   sub:"Une aventure de Paul Austin et Leroy C. Smith, Pal Creations, 1982. Version française.",
   bye:"Bonne évasion.",
   won:"Tu es sorti du camp !",
   musicNote:"Elle joue en surface, dans tout le camp ; pas au mitard ni dans les tunnels.",
   sfxNote:"Les sons du jeu d’origine (avions, bombes, électrocution) jouent dans les deux versions ; les bruitages du camp seulement dans la version moderne.",
   mapHint:"Clique un endroit du camp pour t’y rendre.",
   intro:[
    "1944. Les Allemands ont vidé le camp de prisonniers : dans quelques heures, les Alliés vont le bombarder. Ils ont fermé le portail et sont partis.",
    "Ils t’ont oublié au mitard, la cellule où chaque nouveau prisonnier passe sa première semaine. Il faut sortir vivant avant que les bombes ne tombent.",
    "Le jeu ne comprend que deux mots à la fois : un verbe et un nom. Une lettre seule (N, S, E, O, H, B) te déplace. Les avions approchent : ne traîne pas."]},
  en:{
   sub:"An adventure by Paul Austin and Leroy C. Smith, Pal Creations, 1982.",
   bye:"Good luck with your escape.",
   won:"You got out of the camp!",
   musicNote:"It plays above ground, throughout the camp; not in the hot box or the tunnels.",
   sfxNote:"The original game’s sounds (planes, bombs, electrocution) play in both versions; the camp sounds only in the modern version.",
   mapHint:"Click a spot in the camp to walk there.",
   intro:[
    "1944. The Germans have emptied the prison camp: in a few hours, the Allies will bomb it. They locked the gate and left.",
    "They forgot you in the hot box, the cell where every new prisoner spends his first week. You have to get out alive before the bombs hit.",
    "The game only understands two words at a time: a verb and a noun. A single letter (N, S, E, W, U, D) moves you. The planes are coming: don’t dawdle."]}
 },
 helpEn:'VERBS: GET, DROP, DIG, CUT, OPEN, CLOSE, PICK, PUSH, READ, LOOK, EXAMINE, INVENTORY, HELP, QUIT. DIRECTIONS: N, S, E, W, U, D.%THE GAME ONLY READS TWO WORDS: A VERB AND A NOUN (EXAMINE LOCKER, PICK HOLE).',
 verbs:[['GET','Prendre','Take'],['DROP','Poser','Drop'],['EXAMINE','Examiner','Examine'],['READ','Lire','Read'],['OPEN','Ouvrir','Open'],
  ['CLOSE','Fermer','Close'],['PUSH','Pousser','Push'],['CUT','Couper','Cut'],['DIG','Creuser','Dig'],['PICK','Crocheter','Pick'],
  ['INVENTORY','Inventaire','Inventory',1],['LOOK','Regarder','Look',1],['HELP','Aide','Help',1]],
 sfxAt:{},
 sfx:SG_SFX,                                           // sons propres à l'aventure (sons.js)
 frSkip:[],
 revExtra:{GET:'PRENDRE',DROP:'POSER',DIG:'CREUSER',CUT:'COUPER',OPEN:'OUVRIR',CLOSE:'FERMER',PICK:'CROCHETER',PUSH:'POUSSER',READ:'LIRE',
  LOOK:'REGARDER',EXAMINE:'EXAMINER',INVENTORY:'INVENTAIRE',HELP:'AIDE',QUIT:'QUITTER'},
 nounEn:w=>{ const x=FR.frToEn('PRENDRE '+w).split(' '); return x.length>1?x[1]:''; },

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:34,
  dirs:DIRS,
  go:w=>w, goVerb:'GO',                               // le jeu se déplace avec une lettre seule
  promptText:'\nWHAT SHOULD YOU DO? ',
  defaultScene:'17', transient:[],
  nouns:[...new Set(WORD.filter(Boolean))],
  pos:off=>POS[off],
  levelName:(lv,lang)=>lang==='fr'?'le camp':'the camp',
  say:(text,lang,classic)=>sgSay(text,lang,classic),
  clean:(s,moved)=>sgClean(s,moved),
  autoKey:mem=>' ',                                   // écrans titre et vocabulaire : une touche
  musicZone:(key,kind)=>!['hotbox','tunnel','hole'].includes(kind),   // en surface seulement : ni au mitard, ni dans les tunnels
  roomOff:mem=>Math.max(1,Math.floor(mem.v('F')))-1,
  roomKey:(mem,off)=>String(off+1),
  links(mem,off){ const r=off+1, out={N:null,S:null,E:null,W:null,U:null,D:null};
   ['N','S','E','W','U','D'].forEach((d,j)=>{ const to=mem.a('B',r,j+1); if(to) out[d]=to-1; });
   return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d of ['N','S','E','W','U','D']) e[d]=l[d]!==null; return e; },
  locOf:off=>off+1, carried:-1,
  objects(mem){ const out=[], e=mem.v('E')||85;
   for(let n=1;n<=e;n++){ const name=mem.a('B$',n); if(!name||n===52) continue;   // 52 : le texte de la victoire, rangé parmi les objets
    out.push({n,name,word:WORD[n]||name,loc:Math.floor(mem.a('A',n))}); } return out; },
  // noms propres et inscriptions que la mise en minuscules de la version moderne ne doit pas toucher
  proper:(s,lang)=>{ for(const w of ['Hogan','Schultz','Kilroy','Munich','Ali Baba','Allemagne','Allemands','Alliés','Allied','Allies','Germany','Germans','Nazis','American',
    'Schicklgruber','Louisville Slugger','Stalag'].sort((a,b)=>b.length-a.length)) s=s.replace(new RegExp('\\b'+w.toLowerCase()+'\\b','g'),w);
   return s.replace(/\bc660723\b/g,'C660723').replace(/« officiers »/g,'« OFFICIERS »').replace(/“officers”/g,'“OFFICERS”').replace(/\bcol\./g,'Col.'); },
  objLabel:(o,lang)=>{ const a=SG_OBJ[SG_NORM(o.name)]; return a?(lang==='fr'?a[1]:a[0]).replace(/^(a|an|the|un|une|des|les|le|la|de la|de l'|de) |^l['’]|^de l['’]/i,''):o.name; },
  // l'hémorragie (morsure du chien) : un rappel en haut de l'écran
  status(mem,lang){ const c=mem.a('C',11); if(!(c>0)) return ''; return lang==='fr'?'Blessé : tu saignes ('+c+'/10)':'Wounded: you are bleeding ('+c+'/10)'; },
  sfxFor:(line,cmd,mem)=>sgSfxFor(line,cmd,mem),       // sons.js
  ambient:(mem,off)=>sgAmbient(mem,off+1),
  // éléments de scène (101 et plus) : états que les décors montrent (scenes.js)
  sceneExtras(mem,off){ const l=[];
   if(mem.a('C',1)===1) l.push(101);                   // cadenas de la baraque 3 ouvert
   if(mem.a('B',31,1)===3) l.push(102);                // porte de la baraque 3 ouverte
   if(mem.a('C',5)===1) l.push(103);                   // cadenas à combinaison ouvert
   if(mem.a('B',15,2)===18) l.push(104);               // porte de la baraque des gardes ouverte
   if(mem.a('C',3)===1) l.push(105);                   // le chien mange
   if(mem.a('C',10)===1) l.push(106);                  // courant coupé
   if(mem.a('B',17,2)===15) l.push(107);               // mitard ouvert
   if(mem.a('B',3,6)===30) l.push(108);                // ouverture sous le lit
   if(mem.v('H')>=100) l.push(109);                    // les bombardiers passent : le temps presse
   return l; },
  flags(mem){ return {porte:mem.v('B'),tours:mem.v('H'),aide:mem.v('O'),sang:mem.a('C',11),chien:mem.a('C',3)===1,courant:mem.a('C',10)!==1}; }
 }
});
})();
