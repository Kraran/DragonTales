// The Final Countdown — textes du jeu et passage du français au jeu.
// Même programme de base que S.S. Poseidon (Bill et Debbie Cook) : l'écran est partagé, le lieu en haut, un séparateur,
// les messages qui défilent en bas. say(ligne, langue, classique) rend chaque ligne : en anglais tel quel dans la version
// classique, sinon rédigée proprement ; en français dans les deux versions. Les clés sont les textes du programme,
// espaces multiples réduits à un. La version moderne retire ce que ses panneaux montrent déjà (objets, sorties, invite).
const FC_NORM=s=>s.replace(/ +/g,' ').trim();
// R$(lieu,1) : « YOU'RE » + la description
const FC_DESC={
 "IN THE DESERT":["in the desert.","dans le désert."],
 "IN A LARGE VAN OUTSIDE THE MAIN GATE":["in a large van outside the main gate.","dans une grande camionnette, devant l'entrée principale."],
 "AT THE MAIN GATE":["at the main gate.","à l'entrée principale."],
 "IN THE ADMINISTRATION AREA":["in the administration area.","dans le hall administratif."],
 "IN THE COMPUTER ROOM":["in the computer room.","dans la salle informatique."],
 "IN THE PERSONNEL OFFICE":["in the personnel office.","dans le bureau du personnel."],
 "IN THE COMMAND CENTER":["in the command center.","dans le centre de commandement."],
 "IN A DARK STORAGE ROOM":["in a dark storage room.","dans une réserve obscure."],
 "IN THE EMPLOYEE LOUNGE":["in the employee lounge.","dans la salle de repos du personnel."],
 "IN THE C.O.'S OFFICE":["in the C.O.'s office.","dans le bureau du commandant."],
 "IN A CARPETED LOBBY":["in a carpeted lobby.","dans un hall moquetté."],
 "IN THE RADAR TRACKING ROOM":["in the radar tracking room.","dans la salle de suivi radar."],
 "IN A MAZE OF HALLWAYS":["in a maze of hallways.","dans un labyrinthe de couloirs."],
 "IN AN OBSERVATION ROOM":["in an observation room.","dans une salle d'observation."],
 "IN THE SUPPLY ROOM":["in the supply room.","dans la réserve de fournitures."],
 "IN THE COMMUNICATIONS CENTER":["in the communications center.","dans le centre de transmissions."],
 "IN A WIDE HALL":["in a wide hall.","dans un grand couloir."],
 "IN A HALLWAY":["in a hallway.","dans un couloir."],
 "IN THE STRATEGY ROOM":["in the strategy room.","dans la salle de stratégie."],
 "IN THE LAUNCH CONTROL CENTER":["in the launch control center.","dans le poste de contrôle de tir."]
};
// O$(n,1) : les objets
const FC_OBJ={
 "A RATTLESNAKE":["a rattlesnake","un serpent à sonnette"],"2-WAY RADIO":["a two-way radio","un talkie-walkie"],
 "GENERAL'S UNIFORM":["the general's uniform","l'uniforme du général"],"TASER GUN":["a taser gun","un pistolet paralysant"],
 "PAPERS":["papers","des papiers"],"TV CAMERA ABOVE":["a TV camera above","une caméra au-dessus"],"SECURITY GATE":["a security gate","une grille de sécurité"],
 "AN ELEVATOR":["an elevator","un ascenseur"],"A COMPUTER SCREEN":["a computer screen","un écran d'ordinateur"],"A DESK":["a desk","un bureau"],
 "KEY":["a key","une clé"],"OPEN DRAWER":["an open drawer","un tiroir ouvert"],"METAL CABINET":["a metal cabinet","une armoire métallique"],
 "STAIRWAY":["a stairway","un escalier"],"RUBBER GLOVES":["rubber gloves","des gants en caoutchouc"],"BULLETIN BOARD":["a bulletin board","un tableau d'affichage"],
 "3 MONITORS":["3 monitors","trois écrans de contrôle"],"A ROW OF BUTTONS":["a row of buttons","une rangée de boutons"],"ROW OF BUTTONS":["a row of buttons","une rangée de boutons"],
 "WIRE CUTTERS":["wire cutters","une pince coupante"],"SECRET PASSAGE":["a secret passage","un passage secret"],"WINDOW":["a window","une vitre"],
 "FIRE BOTTLE":["a fire extinguisher","un extincteur"],"THE GENERAL":["the general","le général"],"A RED PHONE":["a red phone","un téléphone rouge"],
 "PANEL":["a panel","un panneau"]
};
// les descriptions (EXAMINE) et les messages
const FC_MSG={
 // les messages M$(1..15)
 "OKAY.":["Okay.","D'accord."],"YOU CAN'T DO THAT.":["You can't do that.","Tu ne peux pas faire ça."],"YOU MUST BE KIDDING.":["You must be kidding.","Tu plaisantes ?"],
 "YOUR FRENCH IS NOT IMPRESSIVE.":["Your French is not impressive.","Ton vocabulaire ne m'impressionne pas."],
 "WHICH ONE?":["Which one?","Lequel ?"],"TRY SOMETHING ELSE.":["Try something else.","Essaie autre chose."],"EXAMINE THINGS CLOSELY.":["Examine things closely.","Examine bien les choses."],
 "YOUR TASER GUN CAN STUN AN OPPONENT AND CAUSE EXCRUCIATING PAIN.":["Your taser gun can stun an opponent and cause excruciating pain.","Ton pistolet paralysant peut assommer un adversaire en lui infligeant une douleur atroce."],
 "BOY ARE YOU IN A FIX!":["Boy, are you in a fix!","Te voilà dans de beaux draps !"],"YOU'RE NOT GETTING ANYWHERE.":["You're not getting anywhere.","Tu tournes en rond."],
 "YOU SUFFERED A PAINFUL INJURY--":["You suffered a painful injury.","Tu es grièvement blessé."],
 "YOUR INJURIES ARE TOO EXTENSIVE TO CONTINUE.":["Your injuries are too extensive to continue.","Tes blessures sont trop graves pour continuer."],
 "THE RADIO MESSAGE IS GARGLED ANDUNINTELLIGIBLE.":["The radio message is garbled and unintelligible.","Le message radio est brouillé, incompréhensible."],
 "A MESSAGE COMES THROUGH...":["A message comes through…","Un message arrive…"],
 "'WATCH OUT FOR SPONTANEOUS COMBUSTION'.":["“Watch out for spontaneous combustion.”","« Attention aux combustions spontanées. »"],
 // descriptions des objets
 "PAY ATTENTION -- IT'S VENOMOUS.":["Pay attention: it's venomous.","Attention : il est venimeux."],"TRY USING IT":["Try using it.","Essaie de t'en servir."],
 "YOU FIND SOMETHING":["You find something.","Tu trouves quelque chose."],"YOU FIND SOMETHING.":["You find something.","Tu trouves quelque chose."],
 "DELIVERS SEVERE ELECTRICAL SHOCK. GOOD FOR 5 SHOTS ONLY.":["It delivers a severe electrical shock. Good for 5 shots only.","Il envoie une violente décharge électrique. Bon pour cinq tirs seulement."],
 "AUTHORIZATION PAPERS WITH YOUR PICTURE ON THEM":["Authorization papers with your picture on them.","Des papiers d'autorisation, avec ta photo dessus."],
 "IT SAYS -- EVACUATION COMPLETE":["It says: EVACUATION COMPLETE.","Il affiche : ÉVACUATION TERMINÉE."],
 "IT'S LOCKED":["It's locked.","C'est fermé à clé."],"IT'S LOCKED.":["It's locked.","C'est fermé à clé."],"IT'S OPEN.":["It's open.","C'est ouvert."],
 "TRY GO STAIRWAY":["Try GO STAIRWAY.","Essaie ALLER ESCALIER."],
 "IT SAYS 'WATCH YOUR STEP ON STAIRWAYS'":["It says: “Watch your step on stairways.”","On y lit : « Attention aux marches dans les escaliers. »"],
 "PRESS SOME BUTTONS TO MAKE SOMETHING HAPPEN":["Press some buttons to make something happen.","Appuie sur quelques boutons pour faire bouger les choses."],
 "THEY'RE LABELED 'ONE TWO THREE'":["They're labeled ONE, TWO, THREE.","Ils sont numérotés UN, DEUX, TROIS."],
 "THEY'RE LABELED 'ONE TWO THREE\"":["They're labeled ONE, TWO, THREE.","Ils sont numérotés UN, DEUX, TROIS."],
 "IT OVERLOOKS THE LAUNCH CONTROL AREA":["It overlooks the launch control area.","Elle donne sur le poste de contrôle de tir."],
 "IT HAS WHITE LETTERING ON IT":["It has white lettering on it.","Il porte des inscriptions blanches."],
 "THERE'S A WIRE HANGING FROM THE LAUNCH ABORT MECHANISM":["There's a wire hanging from the launch abort mechanism.","Un fil pend du mécanisme d'annulation du tir."],
 // l'écran titre et la fin
 "DRAGON DATA LTD PRESENTS:":["DRAGON DATA LTD PRESENTS:","DRAGON DATA LTD PRESENTE :"],"THE FINAL COUNTDOWN":["THE FINAL COUNTDOWN","THE FINAL COUNTDOWN"],
 "AN ADVENTURE":["AN ADVENTURE","UNE AVENTURE"],"(C)1983 BY DRAGON DATA LTD/ BILL AND DEBBIE COOK":["(C)1983 BY DRAGON DATA LTD/ BILL AND DEBBIE COOK","(C)1983 DRAGON DATA LTD/ BILL ET DEBBIE COOK"],
 "SELECT YOUR SKILL CATEGORY:":["SELECT YOUR SKILL CATEGORY:","CHOISIS TON NIVEAU :"],"1) EXPERT":["1) EXPERT","1) EXPERT"],"2) AVERAGE":["2) AVERAGE","2) MOYEN"],"3) NOVICE":["3) NOVICE","3) DEBUTANT"],
 "YOUR CHOICE?":["YOUR CHOICE?","TON CHOIX ?"],"WELCOME TO:":["Welcome to:","Bienvenue dans :"],"BY BILL AND DEBBIE COOK":["by Bill and Debbie Cook","de Bill et Debbie Cook"],
 "YOU'RE TOO LATE. THE MISSILE":["You're too late. The missile","Trop tard. Le missile"],"BURST OUT OF THE SILO IN AN":["burst out of the silo in an","jaillit du silo dans une"],
 "ORANGE BALL OF FIERY FLAME.":["orange ball of fiery flame.","boule de feu orange."],
 "THE ADVENTURE IS OVER.":["The adventure is over.","L'aventure est terminée."],"WANT TO TRY AGAIN?":["Want to try again?","Une autre partie ? (O/N)"],
 // la partie
 "HUH?":["Huh?","Hein ?"],"YOU CAN'T GO THAT WAY.":["You can't go that way.","Tu ne peux pas aller par là."],"LOOK WHAT YOU FOUND":["Look what you found!","Regarde ce que tu as trouvé !"],
 "A METALLIC VOICE SAYS: AUTHORIZATION INSUFFICIENT.":["A metallic voice says: “Authorization insufficient.”","Une voix métallique annonce : « Autorisation insuffisante. »"],
 "A RAGING FIRE BARS YOUR WAY OUT":["A raging fire bars your way out.","Un violent incendie te barre la sortie."],
 "YOU CAN'T.":["You can't.","Tu ne peux pas."],"YOUR ARMS ARE FULL.":["Your arms are full.","Tu as les bras chargés."],"YOU'RE NOT HOLDING IT.":["You're not holding it.","Tu ne l'as pas en main."],
 "YOU CAN ONLY CHANGE CLOTHES IN THE VAN.":["You can only change clothes in the van.","Tu ne peux te changer que dans la camionnette."],
 "YOUR INVENTORY:":["Your inventory:","Tu portes :"],"NOTHING.":["Nothing.","Rien."],"YOU'RE WEARING THE UNIFORM.":["You're wearing the uniform.","Tu as revêtu l'uniforme."],
 "YOUR GLOVES ARE ON.":["Your gloves are on.","Tu as mis les gants."],"YOU DON'T HAVE IT.":["You don't have it.","Tu ne l'as pas."],
 "YOU CANNOT CHANGE CLOTHES OUT HERE. GO TO THE VAN.":["You cannot change clothes out here. Go to the van.","Tu ne peux pas te changer ici. Va dans la camionnette."],
 "WOW! LOOK!":["Wow! Look!","Ça alors ! Regarde !"],"THAT WON'T HELP YOU.":["That won't help you.","Ça ne t'avancera pas."],"YOU ALREADY DID THAT ONCE.":["You already did that once.","Tu l'as déjà fait."],
 "IT SAYS:":["It says:","On y lit :"],"HOTLINE TO THE WHITE HOUSE.":["Hotline to the White House.","Ligne directe avec la Maison-Blanche."],
 "NOT VERY REMARKABLE.":["Not very remarkable.","Rien de remarquable."],
 "I'M JUST AS CONFUSED AS YOU ARE":["I'm just as confused as you are.","Je suis aussi perdu que toi."],
 "WATCH OUT FOR SECRET PANELS AND PASSAGES.":["Watch out for secret panels and passages.","Méfie-toi des panneaux et des passages secrets."],
 "STAIRS AND ELEVATORS ARE HELPFUL.":["Stairs and elevators are helpful.","Les escaliers et les ascenseurs sont bien utiles."],
 "YOU MAY TURN UP SOMETHING BY EXAMINING EVERYTHING CLOSELY.":["You may turn up something by examining everything closely.","En examinant tout de près, tu pourrais dénicher quelque chose."],
 "TRY...UNLOCK":["Try… unlock.","Essaie… ouvrir à clé."],
 "CURRENT CURSES THROUGH YOUR BODY.":["Current courses through your body.","Le courant te traverse le corps."],
 "THE FIRE IS OUT.":["The fire is out.","Le feu est éteint."],"A RECORDED VOICE EXPLAINS:":["A recorded voice explains:","Une voix enregistrée explique :"],
 "FEDERAL EMPLOYEE WORKING HOURS ARE 0800-1630 MONDAY - FRIDAY.":["“Federal employee working hours are 8:00 to 16:30, Monday to Friday.”","« Les fonctionnaires fédéraux travaillent de 8 h à 16 h 30, du lundi au vendredi. »"],
 "YOU CAN'T USE THAT.":["You can't use that.","Tu ne peux pas t'en servir."],"ARE YOU SURE YOU WANT TO QUIT?":["Are you sure you want to quit?","Tu veux vraiment abandonner ? (O/N)"],
 "COMMAND NOT IMPLEMENTED.":["Command not implemented.","Commande non prévue."],"I DON'T THINK THAT'S LOCKED.":["I don't think that's locked.","Je ne crois pas que ce soit fermé à clé."],
 "YOU WILL NEED A KEY TO UNLOCK THAT.":["You will need a key to unlock that.","Il te faudra une clé pour ouvrir ça."],
 "AND COUNTING.":["and counting.","et le compte continue."],
 "A METALLIC VOICE SAYS:":["A metallic voice says:","Une voix métallique annonce :"],"...AUTHORIZATION ACCEPTED.":["“…Authorization accepted.”","« … Autorisation acceptée. »"],
 "AUTHORIZATION REFUSED.":["“Authorization refused.”","« Autorisation refusée. »"],
 "YOU STUNNED HIM. HE RAN OUT IN SEVERE PAIN.":["You stunned him. He ran out in severe pain.","Tu l'as touché. Il s'enfuit, plié de douleur."],
 "THE BATTERY ON YOUR TASER GAVE OUT. THE GENERAL GOT YOU!":["The battery on your taser gave out. The general got you!","La pile de ton pistolet paralysant est à plat. Le général t'a eu !"],
 "NOTHING HAPPENED.":["Nothing happened.","Il ne se passe rien."],"THE GENERAL GOT YOU.":["The general got you.","Le général t'a eu."],"HE'S NOT HERE.":["He's not here.","Il n'est pas ici."],
 "YOU DIDN'T BRING YOUR READING GLASSES, TRY 'EXAMINE'.":["You didn't bring your reading glasses. Try EXAMINE.","Tu as oublié tes lunettes de lecture. Essaie EXAMINER."],
 "YOU CAN'T BREAK THAT.":["You can't break that.","Tu ne peux pas casser ça."],
 "WITH WHAT? YOU AREN'T CARRYING ANYTHING HEAVY ENOUGH.":["With what? You aren't carrying anything heavy enough.","Avec quoi ? Tu ne portes rien d'assez lourd."],
 "YOU THREW THE EXTINGUISHER THROUGH THE GLASS, AND IT WENT CRASHING TO THE FLOOR IN ANOTHERROOM.":["You threw the extinguisher through the glass, and it went crashing to the floor in another room.","Tu lances l'extincteur à travers la vitre : il va s'écraser au sol, dans la pièce d'à côté."],
 "YOU HEAR A NOISE IN THE OTHER ROOM.":["You hear a noise in the other room.","Tu entends un bruit dans la pièce voisine."],
 "YOU JUST TUNED IN 'I LOVE LUCY'":["You just tuned in to “I Love Lucy”.","Tu viens de tomber sur « I Love Lucy »."],
 "CLICK.":["Click.","Clic."],"A PANEL JUST OPENED UP.":["A panel just opened up.","Un panneau vient de s'ouvrir."],
 "CLICK. THE GROUND BEGINS TO RUMBLE...OH NO!........ YOU JUST LAUNCHED A MISSILE. IT":["Click. The ground begins to rumble… oh no! You just launched a missile. It","Clic. Le sol se met à gronder… oh non ! Tu viens de lancer un missile. Il"],
 "BE MORE SPECIFIC.":["Be more specific.","Sois plus précis."],
 // lignes ajoutées par la fiche (patches de aventure.js)
 "THE FIRE HAS YOU TRAPPED. WITHOUT AN EXTINGUISHER YOU CAN'T PUT IT OUT, AND THE SMOKE FILLS THE OFFICE.":["The fire has you trapped. Without an extinguisher you can't put it out, and the smoke fills the office.","Le feu te prend au piège. Sans extincteur, impossible de l'éteindre, et la fumée envahit le bureau."]
};
const FC_DIR={NORTH:['north','NORD'],SOUTH:['south','SUD'],EAST:['east','EST'],WEST:['west','OUEST'],UP:['up','HAUT'],DOWN:['down','BAS']};
// lignes de l'écran titre et du choix du niveau : la version moderne a ses propres fenêtres
const FC_SCREEN_ONLY=new Set(['DRAGON DATA LTD PRESENTS:','THE FINAL COUNTDOWN','AN ADVENTURE','(C)1983 BY DRAGON DATA LTD/ BILL AND DEBBIE COOK','SELECT YOUR SKILL CATEGORY:',
 '1) EXPERT','2) AVERAGE','3) NOVICE','YOUR CHOICE?','WELCOME TO:','BY BILL AND DEBBIE COOK','WANT TO TRY AGAIN?','THE ADVENTURE IS OVER.']);
const fcCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function fcObj(name,fr){ const a=FC_OBJ[FC_NORM(name).toUpperCase()]; return a?(fr?a[1]:a[0]):undefined; }
// liste d'objets « 2-WAY RADIO  GENERAL'S UNIFORM  » (deux espaces entre les noms) : rend les noms traduits, ou undefined
function fcObjList(s,fr){ const parts=s.split(/ {2,}/).map(x=>x.trim()).filter(Boolean); if(!parts.length) return undefined;
  const t=parts.map(p=>fcObj(p,fr)); return t.every(x=>x!==undefined)?t:undefined; }
// Traduit une ligne du programme. Rend undefined si elle est inconnue (gardée telle quelle), null si la version moderne
// doit la retirer, sinon {t, kind}. kind : 'desc' (description du lieu), 'list' (liste d'objets d'une ligne à l'autre).
function fcLine(l,fr,classic){
  const k=FC_NORM(l), pick=a=>fr?a[1]:a[0];
  if(!k) return undefined;
  if(!classic&&FC_SCREEN_ONLY.has(k)) return null;
  if(FC_MSG[k]) return {t:pick(FC_MSG[k])};
  let m;
  if(/^=+$/.test(k)||k===':') return classic?undefined:null;
  if((m=/^YOU'RE (.*)\.$/.exec(k))&&FC_DESC[m[1]]) return {t:(fr?'Tu es ':"You're ")+pick(FC_DESC[m[1]]),kind:'desc'};
  // le général surgit : la version moderne le dit en toutes lettres (sinon il n'apparaît que dans la liste des objets)
  const gen=fr?'Le général est là ! Il se jette sur toi.':'The general is here, and he’s coming at you!';
  if((m=/^YOU CAN SEE: ?(.*)$/.exec(l.replace(/^ +/,'')))){
    if(!classic) return /the general/.test(m[1])?{t:gen}:null;
    const rest=m[1].trim(), list=rest==='NOTHING.'?[fr?'RIEN.':'nothing.']:fcObjList(m[1],fr);
    return {t:(fr?'TU VOIS : ':'You can see: ')+(list||[m[1].trim()]).join('  '),kind:'list'};
  }
  if(k==='YOU CAN GO:') return classic?{t:fr?'SORTIES :':'You can go:'}:null;
  if(/^((NORTH|SOUTH|EAST|WEST|UP|DOWN) ?)+$/.test(k)) return classic?{t:k.split(' ').map(w=>fr?FC_DIR[w][1]:FC_DIR[w][0]).join(' ')}:null;
  if((m=/^YOU CAN'T "(.*)"\.$/.exec(k))) return {t:fr?`Je ne connais pas le verbe « ${m[1].trim().toLowerCase()} ».`:`You can't “${m[1].trim().toLowerCase()}”.`};
  if((m=/^THE "(.*)" IS NOT RELEVANT\.$/.exec(k))) return {t:fr?`« ${m[1].trim().toLowerCase()} » ne sert à rien ici.`:`The “${m[1].trim().toLowerCase()}” is not relevant.`};
  if((m=/^YOU HAVE STOPPED THE COUNTDOWN IN (\d+) TURNS\. NICE GOING\.$/.exec(k))) return {t:fr?`Tu as arrêté le compte à rebours en ${m[1]} coups. Bien joué !`:`You have stopped the countdown in ${m[1]} turns. Nice going!`};
  if((m=/^HOW CAN YOU WORRY ABOUT POINTS AT A TIME LIKE THIS\? ANYWAY, THE COUNTDOWN IS AT T MINUS ?(-?\d+)$/.exec(k)))
    return {t:fr?`Comment peux-tu penser aux points à un moment pareil ? Enfin, le compte à rebours en est à T moins ${m[1]}`:`How can you worry about points at a time like this? Anyway, the countdown is at T minus ${m[1]}`};
  if((m=/^YOUR GUN HAS ?(-?\d+) SHOTS LEFT\.$/.exec(k))) return {t:fr?`Ton pistolet n'a plus que ${m[1]} tirs.`:`Your gun has ${m[1]} shots left.`};
  const list=fcObjList(l,fr);                                   // suite de la liste « YOU CAN SEE » ou objet de l'inventaire
  if(list){ if(/ {2}$/.test(l)) return classic?{t:list.join('  '),kind:'list'}:/the general/.test(l)?{t:gen}:null; return {t:fr?fcCap(list[0]):fcCap(list[0])}; }
  return undefined;
}
function fcSay(text,lang,classic){
  text=text.replace(/ ?\x08/g,'');                             // CHR$(8) : le programme efface l'espace avant le guillemet
  if(classic&&lang==='en') return text;                       // version classique anglaise : l'écran d'origine
  const fr=lang==='fr', parts=text.split('\n'), out=[];
  parts.forEach((l,i)=>{
    const last=i===parts.length-1, nl=last?'':'\n';
    if(last&&l==='') return;
    const lead=/^ */.exec(l)[0], r=fcLine(l,fr,classic);
    if(r===null) return;                                     // version moderne : déjà montré ailleurs
    if(r===undefined){ out.push(l+nl); return; }
    if(classic){ const s=lead+r.t.toLocaleUpperCase('fr');
      out.push(r.kind==='list'&&nl?s+'  ':s+(l.endsWith(' ')&&!nl?' ':'')+nl); return; }   // les listes coulent d'une ligne à l'autre
    out.push((r.kind==='desc'?'\u0002':'')+r.t+nl);
  });
  return out.join('');
}
// version moderne : la description du lieu n'est gardée qu'à l'arrivée (le programme la réécrit après chaque action)
function fcClean(s,moved){
  s=moved?s.replace(/\u0002/g,''):s.replace(/(^|\n)\u0002[^\n]*/g,'$1');
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(too late|trop tard|general got you|général t'a eu|too extensive|trop graves|smoke fills|fumée envahit)/i.test(s)};
}

// ---- français -> commandes du jeu ----
// Le jeu ne lit que les trois premières lettres du verbe et du deuxième mot : on lui envoie des mots anglais complets.
const FR=(function(){
  const VERBS={ALLER:'GO',VA:'GO',VAIS:'GO',ENTRER:'ENTER',ENTRE:'ENTER',GRIMPER:'CLIMB',GRIMPE:'CLIMB',
    PRENDRE:'GET',PRENDS:'GET',RAMASSER:'GET',RAMASSE:'GET',POSER:'DROP',POSE:'DROP',LAISSER:'DROP',LAISSE:'DROP',LACHER:'DROP',LACHE:'DROP',
    LANCER:'THROW',LANCE:'THROW',JETER:'THROW',JETTE:'THROW',INVENTAIRE:'INVENTORY',I:'INVENTORY',INV:'INVENTORY',
    METTRE:'WEAR',METS:'WEAR',ENFILER:'WEAR',ENFILE:'WEAR',PORTER:'WEAR',PORTE:'WEAR',REVETIR:'WEAR',
    DEPLACER:'MOVE',DEPLACE:'MOVE',BOUGER:'MOVE',BOUGE:'MOVE',POUSSER:'MOVE',POUSSE:'MOVE',
    OUVRIR:'OPEN',OUVRE:'OPEN',EXAMINER:'EXAMINE',EXAMINE:'EXAMINE',REGARDER:'LOOK',REGARDE:'LOOK',FOUILLER:'EXAMINE',FOUILLE:'EXAMINE',
    SECOURS:'HELP',AIDE:'HELP',UTILISER:'USE',UTILISE:'USE',QUITTER:'QUIT',QUITTE:'QUIT',DEVERROUILLER:'UNLOCK',DEVERROUILLE:'UNLOCK',
    SCORE:'SCORE',COUPS:'SCORE',TIRER:'SHOOT',TIRE:'SHOOT',MONTRER:'SHOW',MONTRE:'SHOW',PRESENTER:'SHOW',PRESENTE:'SHOW',
    LIRE:'READ',LIS:'READ',CASSER:'BREAK',CASSE:'BREAK',BRISER:'BREAK',BRISE:'BREAK',APPUYER:'PRESS',APPUIE:'PRESS',PRESSER:'PRESS',PRESSE:'PRESS',
    MERDE:'SHIT',PUTAIN:'SHIT',ZUT:'SHIT',
    MONTER:'GO UP',MONTE:'GO UP',DESCENDRE:'GO DOWN',DESCENDS:'GO DOWN'};
  const NOUNS={};
  const add=(en,fr)=>fr.split(' ').forEach(w=>{ NOUNS[w]=en; });
  add('SNAKE','SERPENT CROTALE');add('RADIO','RADIO TALKIE WALKIE');add('UNIFORM','UNIFORME');add('TASER','TASER PISTOLET');add('GUN','ARME');
  add('PAPERS','PAPIERS PAPIER AUTORISATION');add('CAMERA','CAMERA');add('GATE','GRILLE PORTAIL BARRIERE');add('ELEVATOR','ASCENSEUR');add('DOOR','PORTE');
  add('SCREEN','ECRAN ORDINATEUR');add('DESK','BUREAU');add('KEY','CLE');add('DRAWER','TIROIR');add('CABINET','ARMOIRE PLACARD');
  add('STAIRWAY','ESCALIER ESCALIERS MARCHES');add('GLOVES','GANTS');add('BOARD','TABLEAU AFFICHAGE');add('MONITORS','MONITEURS CONTROLE');
  add('BUTTONS','BOUTONS BOUTON');add('CUTTERS','PINCE CISAILLE');add('PASSAGE','PASSAGE');add('PANEL','PANNEAU TRAPPE');add('WINDOW','VITRE FENETRE');
  add('BOTTLE','EXTINCTEUR BOUTEILLE');add('GENERAL','GENERAL');add('PHONE','TELEPHONE COMBINE');add('ONE','UN');add('TWO','DEUX');add('THREE','TROIS');
  add('DESERT','DESERT SABLE');add('VAN','CAMIONNETTE FOURGON');add('ROPE','CORDE');add('WIRE','FIL');
  const DIRS={N:'NORTH',NORD:'NORTH',S:'SOUTH',SUD:'SOUTH',E:'EAST',EST:'EAST',O:'WEST',OUEST:'WEST',H:'UP',HAUT:'UP',B:'DOWN',BAS:'DOWN'};
  Object.assign(NOUNS,{NORD:'NORTH',SUD:'SOUTH',OUEST:'WEST',HAUT:'UP',BAS:'DOWN'});
  const STOP=new Set('LE LA LES L UN UNE DES DU DE D AU AUX A SUR DANS VERS EN AVEC ET MON MA MES CE CET CETTE CES PAR POUR Y LUI SES SON'.split(' '));
  const norm=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’`\-]/g,' ').replace(/[^A-Z0-9 ?!]/g,' ').replace(/\s+/g,' ').trim();
  function frToEn(line){
    const n=norm(line); if(!n) return '';
    let t=n.split(' ');
    while(t.length>1&&['JE','ME','SE','M','S','TE','T'].includes(t[0])) t.shift();
    if(t.length===1&&DIRS[t[0]]) return 'GO '+DIRS[t[0]];
    const verb=VERBS[t[0]]; if(!verb) return n;               // pas du français connu : transmis tel quel (l'anglais marche)
    if(verb.startsWith('GO ')) return verb;
    // APPUYER SUR UN / DEUX / TROIS : « un » est ici le bouton, pas l'article
    if(verb==='PRESS'){ const B={UN:'ONE',1:'ONE',DEUX:'TWO',2:'TWO',TROIS:'THREE',3:'THREE'}, b=t.slice(1).reverse().find(x=>B[x]); if(b) return 'PRESS '+B[b]; }
    const rest=t.slice(1).filter(x=>!STOP.has(x));
    if(verb==='GO'&&rest.length&&DIRS[rest[0]]) return 'GO '+DIRS[rest[0]];
    let noun=null; for(const x of rest){ if(NOUNS[x]){ noun=NOUNS[x]; break; } }
    if(!noun&&rest.length) noun=rest[rest.length-1];
    return noun?verb+' '+noun:verb;
  }
  const HELP="VERBES : ALLER (OU N, S, E, O, H, B), PRENDRE, POSER, INVENTAIRE, METTRE, EXAMINER, DÉPLACER, UTILISER, DÉVERROUILLER, MONTRER, TIRER (SUR), CASSER, APPUYER (SUR UN, DEUX, TROIS), SCORE (LE COMPTE À REBOURS), SECOURS (UN CONSEIL DU JEU).%EXEMPLES : METTRE L'UNIFORME, MONTRER LES PAPIERS, ALLER ESCALIER, APPUYER SUR TROIS.";
  return {TEXT:{},NOUNS,VERBS,HELP,frToEn};
})();
