// S.S. Poseidon — textes du jeu et passage du français au jeu.
// Le programme écrit ses lignes (PRINT) en anglais, placées sur l'écran de 32 colonnes du Dragon : le lieu en haut,
// les messages en bas. say(ligne, langue, classique) rend chaque ligne : en anglais tel quel dans la version classique,
// sinon rédigée proprement ; en français dans les deux versions. Les clés sont les textes du programme, espaces
// multiples réduits à un. La version moderne retire ce que ses panneaux montrent déjà (objets, sorties, invite).
const PS_NORM=s=>s.replace(/ +/g,' ').trim();
// R$(lieu,1) : « YOU'RE » + la description
const PS_DESC={
 "IN THE BALLROOM. EXITS ARE FORTY FEET ABOVE.":["in the ballroom. The exits are forty feet above you.","dans la salle de bal. Les sorties sont à douze mètres au-dessus de toi."],
 "BELOW THE ENTRANCE TO A LONG PASSAGEWAY.":["below the entrance to a long passageway.","sous l'entrée d'une longue coursive."],
 "BELOW A SMALL ENTRANCE OF CARVED MARBLE COLUMNS.":["below a small entrance of carved marble columns.","sous une petite entrée aux colonnes de marbre sculpté."],
 "IN THE BALLROOM, IT'S FLOODED.":["in the ballroom. It's flooded.","dans la salle de bal. Elle est inondée."],
 "IN A HUGE GALLEY. STEAM IS SPEWING OUT ALL AROUND YOU.":["in a huge galley. Steam is spewing out all around you.","dans une immense cuisine. La vapeur jaillit tout autour de toi."],
 "IN A DARK AND DAMP INTERSECTION OF HALLWAYS.":["at a dark and damp intersection of hallways.","à un croisement de couloirs, sombre et humide."],
 "IN THE DISPENSARY.":["in the dispensary.","à l'infirmerie."],
 "IN A SMALL TOOL ROOM.":["in a small tool room.","dans un petit local à outils."],
 "IN THE SHIP'S BARBER SHOP":["in the ship's barber shop.","chez le coiffeur du navire."],
 "IN A VERY DARK AND DAMP INTERSECTION":["at a very dark and damp intersection.","à un croisement très sombre et humide."],
 "IN THE COMMUNICATION CENTER":["in the communication center.","au poste radio."],
 "IN THE CAPTAIN'S QUARTERS":["in the captain's quarters.","dans les appartements du commandant."],
 "IN THE NAVIGATION ROOM":["in the navigation room.","dans la salle de navigation."],
 "IN THE PURSOR'S OFFICE":["in the purser's office.","dans le bureau du commissaire de bord."],
 "IN A WIDE HALL. A HUGE STEEL DOOR BLOCKS YOUR WAY UP":["in a wide hall. A huge steel door blocks your way up.","dans un large couloir. Une énorme porte d'acier te barre le passage vers le haut."],
 "IN A WIDE HALL. THERE'S AN OPEN STEEL DOOR ABOVE.":["in a wide hall. There's an open steel door above you.","dans un large couloir. Une porte d'acier est ouverte au-dessus de toi."],
 "ON A LEDGE ABOVE A POOL OF FLAMING OIL":["on a ledge above a pool of flaming oil.","sur une corniche, au-dessus d'une nappe de mazout en flammes."],
 "IN A LARGE CONFERENCE ROOM":["in a large conference room.","dans une grande salle de conférence."],
 "IN AN INTERSECTION OF LOW PASSAGES":["at an intersection of low passages.","à un croisement de passages bas."],
 "IN THE ENGINE ROOM":["in the engine room.","dans la salle des machines."],
 "ON A METAL WALKWAY":["on a metal walkway.","sur une passerelle métallique."],
 "AT THE HULL OF THE SHIP":["at the hull of the ship.","contre la coque du navire."]
};
// O$(n,1) : noms des objets
const PS_OBJ={
 "A CHAIR":["a chair","une chaise"],"A CABLE":["a cable","un câble"],"DEBRIS":["debris","des débris"],"FOOD":["food","de la nourriture"],
 "A CLEAVER":["a cleaver","un couperet"],"A BEAKER":["a beaker","une fiole"],"EMPTY BEAKER":["an empty beaker","une fiole vide"],
 "A CABINET":["a cabinet","une armoire"],"A WRENCH":["a wrench","une clé à molette"],"RAZOR":["a razor","un rasoir"],
 "HAM RADIO":["a ham radio","une radio amateur"],"CRUMPLED PAPER":["crumpled paper","un papier froissé"],"A LEAFLET":["a leaflet","un prospectus"],
 "A LIFE JACKET":["a life jacket","un gilet de sauvetage"],"JEWELS":["jewels","des bijoux"],"A ROPE":["a rope","une corde"],
 "EXTINGUISHER":["an extinguisher","un extincteur"],"A HATCH":["a hatch","une écoutille"],"A CROWBAR":["a crowbar","un pied-de-biche"],
 "A FLASHLIGHT":["a flashlight","une lampe torche"],"A SIGN":["a sign","un panneau"],"A PAINTING":["a painting","un tableau"],
 "HULL PLATE":["a hull plate","une tôle de coque"]
};
const PS_DIR={NORTH:['north','NORD'],SOUTH:['south','SUD'],EAST:['east','EST'],WEST:['west','OUEST'],UP:['up','HAUT'],DOWN:['down','BAS']};
// toutes les autres lignes
const PS_MSG={
 // les messages M$(1..29)
 "OKAY.":["Okay.","D'accord."],
 "YOU CAN'T.":["You can't.","Impossible."],
 "YOU CAN'T....YET.":["You can't... yet.","Pas encore..."],
 "THAT'S NOT POSSIBLE.":["That's not possible.","Ce n'est pas possible."],
 "DON'T BE RIDICULOUS.":["Don't be ridiculous.","Ne sois pas ridicule."],
 "I'M JUST AS CONFUSED AS YOU ARE.":["I'm just as confused as you are.","Je suis aussi perdu que toi."],
 "I DON'T HAVE ANY IDEA WHAT YOU ARE TALKING ABOUT.":["I don't have any idea what you are talking about.","Je ne vois pas du tout de quoi tu parles."],
 "YOU'VE GOT TO BE KIDDING.":["You've got to be kidding.","Tu plaisantes ?"],
 "YOU'RE WASTING YOUR TIME.":["You're wasting your time.","Tu perds ton temps."],
 "PLEASE BE MORE SPECIFIC.":["Please be more specific.","Sois plus précis, s'il te plaît."],
 "WITH WHAT?":["With what?","Avec quoi ?"],
 "TO WHAT?":["To what?","À quoi ?"],
 "YOUR FRENCH IS NOT IMPRESSIVE.":["Your French is not impressive.","Surveille ton langage, matelot."],
 "SORRY YOU'VE GOT TO FIGURE IT OUT ALL BY YOURSELF.":["Sorry, you've got to figure it out all by yourself.","Désolé, il va falloir trouver tout seul."],
 "I CAN'T THINK OF ANYTHING RIGHT NOW -- TRY ME LATER.":["I can't think of anything right now. Try me later.","Rien ne me vient pour l'instant. Redemande-moi plus tard."],
 "IT HAS WRITING ON IT.":["It has writing on it.","Il y a quelque chose d'écrit dessus."],
 "TRY USING IT.":["Try using it.","Essaie de t'en servir."],
 "YOU CAN'T REACH IT.":["You can't reach it.","Tu ne peux pas l'atteindre."],
 "YOU FORGOT TO HOLD YOUR BREATH.":["You forgot to hold your breath.","Tu as oublié de retenir ton souffle."],
 "YOU'RE LOST.":["You're lost.","Tu es perdu."],
 "A WALL OF WATER COMES CRASHING THROUGH.":["A wall of water comes crashing through.","Un mur d'eau déferle dans la pièce."],
 "YOUR LIFE JACKET HAS SAVED YOU.":["Your life jacket has saved you.","Ton gilet de sauvetage t'a sauvé."],
 "YOU FLOAT INTO THE NEXT ROOM.":["You float into the next room.","Tu flottes jusqu'à la pièce voisine."],
 "NOT WEARING A LIFE JACKET----- YOU DROWNED.":["Not wearing a life jacket... you drowned.","Sans gilet de sauvetage... tu t'es noyé."],
 // le début et la fin
 "DRAGON DATA LTD PRESENTS":["Dragon Data Ltd presents","DRAGON DATA LTD PRÉSENTE"],
 "ADVENTURE:":["Adventure:","AVENTURE :"],
 "SELECT YOUR SKILL CATEGORY:":["Select your skill category:","CHOISIS TON NIVEAU :"],
 "1) EXPERT":["1) Expert","1) EXPERT"],"2) AVERAGE":["2) Average","2) MOYEN"],"3) NOVICE":["3) Novice","3) DÉBUTANT"],
 "YOUR CHOICE?":["Your choice?","TON CHOIX ?"],
 "WELCOME TO: \"S.S. POSEIDON\"":["Welcome to the S.S. Poseidon.","BIENVENUE À BORD DU POSEIDON"],
 "THE ADVENTURE IS OVER.":["The adventure is over.","L'aventure est terminée."],
 "WANT TO TRY AGAIN?":["Want to try again?","Une autre partie ? (O/N)"],
 "YOU WERE TOO LATE.":["You were too late.","Tu es arrivé trop tard."],
 "THE SHIP HAS FILLED WITH WATER AND IS GOING DOWN. YOUR FRIENDS ARE MOURNING YOUR DEATH.":["The ship has filled with water and is going down. Your friends are mourning your death.","Le navire s'est rempli d'eau et sombre. Tes amis pleurent ta mort."],
 "YOU'VE LOST TOO MUCH BLOOD TO CONTINUE":["You've lost too much blood to continue.","Tu as perdu trop de sang pour continuer."],
 "YOU'VE MADE IT TO FREEDOM.":["You've made it to freedom.","Tu as retrouvé la liberté !"],
 "A COAST GUARD CUTTER IS STANDINGBY TO PICK YOU UP. YOU DID IT":["A coast guard cutter is standing by to pick you up.","Une vedette des garde-côtes attend pour te recueillir."],
 // les commandes
 "ACCEPTABLE COMMANDS : GO,CLIMB, ENTER,GET,TAKE,DROP,PUT,THROW, TIE,INVENTORY,MOVE,OPEN,EXAMINE,LOOK,HELP,USE,QUIT,CUT,SCORE, READ,BREAK,WEAR,DRINK,EAT,SAY.":
  ["Acceptable commands: go, climb, enter, get, take, drop, put, throw, tie, inventory, move, open, examine, look, help, use, quit, cut, score, read, break, wear, drink, eat, say.",
   "Commandes comprises : aller, grimper, entrer, prendre, poser, lancer, attacher, inventaire, déplacer, ouvrir, examiner, regarder, secours, utiliser, quitter, couper, score, lire, casser, mettre, boire, manger, dire."],
 "WHAT?":["What?","Quoi ?"],
 "I DON'T UNDERSTAND YOUR COMMAND ...TYPE 'LIST' FOR YOUR VERB VOCABULARY.":["I don't understand your command... Type LIST for your verb vocabulary.","Je ne comprends pas ta commande... Tape LISTE pour voir les verbes."],
 "SORRY, YOU CAN'T DO THAT.":["Sorry, you can't do that.","Désolé, tu ne peux pas faire ça."],
 // aller
 "OKAY. YOU'VE MADE IT UP TO THE NEXT LEVEL.":["Okay. You've made it up to the next level.","D'accord. Tu es monté au niveau supérieur."],
 "IT'S TOO DARK TO SEE ANYTHING.. I THINK YOU BLEW IT.":["It's too dark to see anything... I think you blew it.","Il fait trop noir pour voir quoi que ce soit... Je crois que c'est fichu."],
 "A RAGING FIRE BARS YOUR WAY OUT.":["A raging fire bars your way out.","Un violent incendie te barre la sortie."],
 "YOU FELL DOWN A SHAFT. YOU'RE BACK ON THE SECOND LEVEL.":["You fell down a shaft. You're back on the second level.","Tu es tombé dans un puits. Te revoilà au deuxième niveau."],
 "CLIMB SOMETHING ELSE.":["Climb something else.","Grimpe sur autre chose."],
 "YOU FELL INTO THE OIL. YOU'RE DEAD.":["You fell into the oil. You're dead.","Tu es tombé dans le mazout. Tu es mort."],
 "YOU CAN'T GO ANYWHERE WITH THE ROPE ATTACHED.":["You can't go anywhere with the rope attached.","Tu ne peux aller nulle part tant que la corde est attachée."],
 "YOU CAN'T GO BACK WITHOUT THE ROPE.":["You can't go back without the rope.","Tu ne peux pas revenir sans la corde."],
 "WHEW..YOU WERE ABLE TO SWING ACROSS JUST BEFORE THE ROPE CAMEUNTIED!":["Whew... you were able to swing across just before the rope came untied!","Ouf... tu as pu te balancer de l'autre côté juste avant que la corde se détache !"],
 "YOU ARE UNDERWATER.":["You are underwater.","Tu es sous l'eau."],
 "YOU CAN'T GO THAT WAY.":["You can't go that way.","Tu ne peux pas aller par là."],
 // prendre, poser, inventaire
 "YOUR ARMS ARE FULL.":["Your arms are full.","Tes bras sont pleins."],
 "YOU DON'T HAVE IT.":["You don't have it.","Tu ne l'as pas."],
 "THE CLEAVER CUT OFF YOUR FOOT. YOU CAN'T WALK.":["The cleaver cut off your foot. You can't walk.","Le couperet t'a tranché le pied. Tu ne peux plus marcher."],
 "NO ONE TO HELP. YOU CAN'T MAKE IT.":["No one to help. You can't make it.","Personne pour t'aider. Tu ne t'en sortiras pas."],
 "NO ROOM HERE TO DROP ANYTHING.":["No room here to drop anything.","Plus de place ici pour poser quoi que ce soit."],
 "YOU'RE HOLDING:":["You're holding:","Tu portes :"],
 "NOTHING":["nothing","RIEN"],
 // déplacer, ouvrir, examiner
 "A SECRET PASSAGE!":["A secret passage!","Un passage secret !"],
 "YOU DIDN'T FIND ANYTHING.":["You didn't find anything.","Tu n'as rien trouvé."],
 "YOU WERE STRONG ENOUGH TO RIP THE DOOR OPEN.":["You were strong enough to rip the door open.","Tu as eu assez de force pour arracher la porte."],
 "YOU AREN'T STRONG ENOUGH...YET.":["You aren't strong enough... yet.","Tu n'es pas assez fort... pour l'instant."],
 "TRY USING SOMETHING.":["Try using something.","Essaie de te servir de quelque chose."],
 "IT'S JAMMED SHUT.":["It's jammed shut.","Elle est coincée."],
 "LOOK!":["Look!","Regarde !"],
 "NOT HERE.":["Not here.","Ce n'est pas ici."],
 "NOTHING SPECIAL.":["Nothing special.","Rien de spécial."],
 // ce que dit EXAMINE (la description de l'objet, suivie d'un point)
 "IT'S SOLID OAK.":["It's solid oak.","C'est du chêne massif."],
 "IT'S HANGING FROM ABOVE.":["It's hanging from above.","Il pend d'en haut."],
 "YUK..IT'S COVERED WITH MAGGOTS.":["Yuk... it's covered with maggots.","Beurk... elle grouille d'asticots."],
 "IT'S SHARP.":["It's sharp.","Il est tranchant."],
 "CONTAINS LIQUID VITAMINS.":["It contains liquid vitamins.","Elle contient des vitamines liquides."],
 "THERE MIGHT BE TOOLS IN IT.":["There might be tools in it.","Il y a peut-être des outils dedans."],
 "DO YOU NEED A SHAVE?.":["Do you need a shave?","Besoin d'un rasage ?"],
 "IT'S SHORTED OUT.":["It's shorted out.","Elle est en court-circuit."],
 "IT SAYS --- S. O. S..":["It says: S.O.S.","Il est écrit : S.O.S."],
 "IT SAYS -- TRY \"THE FINAL COUNTDOWN\" --ANOTHER COOK ADVENTURE.":["It says: try “The Final Countdown”, another Cook adventure.","Il est écrit : essayez « The Final Countdown », une autre aventure des Cook."],
 "HMMM...YOUR SIZE.":["Hmmm... your size.","Hmmm... ta taille."],
 "DO YOU WANT OUT RICH OR ALIVE?.":["Do you want out rich or alive?","Tu veux sortir riche, ou vivant ?"],
 "I BET YOU HAVE TO TIE IT....":["I bet you have to tie it...","Je parie qu'il faut l'attacher..."],
 "THE GUAGE READS FULL.":["The gauge reads full.","La jauge indique plein."],
 "IT MIGHT LEAD TO FREEDOM.":["It might lead to freedom.","Elle mène peut-être à la liberté."],
 "YOU MIGHT BE ABLE TO OPEN SOMETHING WITH IT.":["You might be able to open something with it.","Tu pourrais ouvrir quelque chose avec."],
 "SIGN: SOME OBJECTS MAY BE USED.":["The sign says: some objects may be used.","Le panneau dit : certains objets peuvent servir."],
 "IT'S UPSIDE DOWN.":["It's upside down.","Il est à l'envers."],
 "THERE'S BOLTS ON IT...DO YOU HAVE A WRENCH?.":["There are bolts on it... Do you have a wrench?","Elle est boulonnée... As-tu une clé à molette ?"],
 // l'aide du jeu (HELP), selon le lieu
 "VITAMINS MAKE YOU STRONGER.":["Vitamins make you stronger.","Les vitamines rendent plus fort."],
 "ONE OBJECT INSURES YOUR SAFETY. DON'T DROP IT.":["One object ensures your safety. Don't drop it.","Un objet garantit ta sécurité. Ne le lâche pas."],
 "ARE YOU WEARING A LIFE JACKET?":["Are you wearing a life jacket?","Portes-tu un gilet de sauvetage ?"],
 "WANNA BE RICH?":["Wanna be rich?","Envie d'être riche ?"],
 "BEWARE OF SECRET PASSAGES":["Beware of secret passages.","Méfie-toi des passages secrets."],
 "TRY GOING EAST.":["Try going east.","Essaie d'aller vers l'est."],
 "YOU MIGHT TRY SAYING SOMETHING.":["You might try saying something.","Tu pourrais essayer de dire quelque chose."],
 "THERE MIGHT BE A MAGIC WORD.":["There might be a magic word.","Il y a peut-être un mot magique."],
 // utiliser, couper, lire, etc.
 "YOU FIND SOMETHING.":["You find something.","Tu trouves quelque chose."],
 "THE FIRE'S OUT. GOOD WORK.":["The fire's out. Good work.","Le feu est éteint. Bravo."],
 "OK. YOU'RE ON THE CHAIR.":["Okay. You're on the chair.","D'accord. Te voilà debout sur la chaise."],
 "IT'S NOT HERE.":["It's not here.","Ce n'est pas ici."],
 "PUT IT DOWN FIRST.":["Put it down first.","Pose-la d'abord."],
 "IT DIDN'T HELP.":["It didn't help.","Ça n'a servi à rien."],
 "OUCH, YOU CUT YOURSELF.":["Ouch, you cut yourself.","Aïe, tu t'es coupé."],
 "IT'S UNBREAKABLE.":["It's unbreakable.","C'est incassable."],
 "OK. IT FITS PERFECTLY.":["Okay. It fits perfectly.","D'accord. Il te va parfaitement."],
 "YOU CAN'T WEAR THAT.":["You can't wear that.","Tu ne peux pas mettre ça."],
 "YOU FEEL SOMEWHAT STRANGE.":["You feel somewhat strange.","Tu te sens un peu bizarre."],
 "YOU FEEL SICK....BURP.":["You feel sick... Burp.","Tu te sens mal... Burp."],
 "OKAY...AHEM...":["Okay... ahem...","D'accord... Hum hum..."]
};
// lignes de l'écran titre et du choix du niveau : la version moderne a ses propres fenêtres
const PS_SCREEN_ONLY=new Set(['DRAGON DATA LTD PRESENTS','ADVENTURE:','SELECT YOUR SKILL CATEGORY:','1) EXPERT','2) AVERAGE','3) NOVICE','YOUR CHOICE?','WELCOME TO: "S.S. POSEIDON"','WANT TO TRY AGAIN?','THE ADVENTURE IS OVER.']);
const PS_WATER={NECK:['neck','au cou'],WAIST:['waist','à la taille'],KNEES:['knees','aux genoux'],ANKLES:['ankles','aux chevilles']};
const psCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function psObj(name,fr){ const a=PS_OBJ[PS_NORM(name)]; return a?(fr?a[1]:a[0]):undefined; }
// liste d'objets « A CHAIR  DEBRIS  » (deux espaces entre les noms) : rend les noms traduits, ou undefined
function psObjList(s,fr){ const parts=s.split(/ {2,}/).map(x=>x.trim()).filter(Boolean); if(!parts.length) return undefined;
  const t=parts.map(p=>psObj(p,fr)); return t.every(x=>x!==undefined)?t:undefined; }
// Traduit une ligne du programme. Rend undefined si elle est inconnue (gardée telle quelle), null si la version moderne
// doit la retirer, sinon le texte. kind : 'desc' (description du lieu), 'list' (liste d'objets d'une ligne à l'autre).
function psLine(l,fr,classic){
  const k=PS_NORM(l), pick=a=>fr?a[1]:a[0];
  if(!k) return undefined;
  if(!classic&&PS_SCREEN_ONLY.has(k)) return null;
  if(PS_MSG[k]) return {t:pick(PS_MSG[k])};
  let m;
  if(k==='(C) 1982 BILL AND DEBBIE COOK') return classic?{t:fr?'(C) 1982 BILL ET DEBBIE COOK':k}:null;
  if(/^=+$/.test(k)||k==='--->'||k==='S. S. P O S E I D O N') return classic?undefined:null;
  if((m=/^YOU'RE (.*)$/.exec(k))&&PS_DESC[m[1]]) return {t:(fr?'Tu es ':"You're ")+pick(PS_DESC[m[1]]),kind:'desc'};
  if((m=/^YOU CAN SEE: ?(.*)$/.exec(l.replace(/^ +/,'')))){
    if(!classic) return null;
    const rest=m[1].trim(), list=rest==='NOTHING.'?[fr?'RIEN.':'nothing.']:psObjList(m[1],fr);
    return {t:(fr?'TU VOIS : ':'You can see: ')+(list||[m[1].trim()]).join('  '),kind:'list'};
  }
  if(k==='OBVIOUS EXITS:') return classic?{t:fr?'SORTIES :':'Obvious exits:'}:null;
  if(/^((NORTH|SOUTH|EAST|WEST|UP|DOWN) ?)+$/.test(k)) return classic?{t:k.split(' ').map(w=>fr?PS_DIR[w][1]:PS_DIR[w][0]).join(' ')}:null;
  if((m=/^YOU HAVE (-?\d+) MOVES LEFT\.$/.exec(k))) return {t:fr?`Il te reste ${m[1]} coups.`:`You have ${m[1]} moves left.`};
  if((m=/^IN ONLY (\d+) MOVES\. GOOD WORK!$/.exec(k))) return {t:fr?`Tu as réussi en seulement ${m[1]} coups. Bravo !`:`You did it in only ${m[1]} moves. Good work!`};
  if((m=/^THE WATER'S UP TO YOUR (NECK|WAIST|KNEES|ANKLES)\.$/.exec(k))) return {t:fr?`L'eau t'arrive ${PS_WATER[m[1]][1]}.`:`The water's up to your ${PS_WATER[m[1]][0]}.`};
  const list=psObjList(l,fr);                                   // suite de la liste « YOU CAN SEE » ou objet de l'inventaire
  if(list){ if(/ {2}$/.test(l)) return classic?{t:list.join('  '),kind:'list'}:null; return {t:fr?list[0]:psCap(list[0])}; }
  return undefined;
}
function psSay(text,lang,classic){
  if(classic&&lang==='en') return text;                       // version classique anglaise : l'écran d'origine
  const fr=lang==='fr', parts=text.split('\n'), out=[];
  parts.forEach((l,i)=>{
    const last=i===parts.length-1, nl=last?'':'\n';
    if(last&&l==='') return;
    const lead=/^ */.exec(l)[0], r=psLine(l,fr,classic);
    if(r===null) return;                                     // version moderne : déjà montré ailleurs
    if(r===undefined){ out.push(l+nl); return; }
    if(classic){ const s=lead+r.t.toLocaleUpperCase('fr');
      out.push(r.kind==='list'&&nl?s+'  ':s+(l.endsWith(' ')&&!nl?' ':'')+nl); return; }   // les listes coulent d'une ligne à l'autre
    out.push((r.kind==='desc'?'\u0002':'')+r.t+nl);
  });
  return out.join('');
}
// version moderne : la description du lieu n'est gardée qu'à l'arrivée (le programme la réécrit après chaque action)
function psClean(s,moved){
  s=moved?s.replace(/\u0002/g,''):s.replace(/(^|\n)\u0002[^\n]*/g,'$1');
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(you drowned|you're dead|too late|too much blood|can't make it|noyé|tu es mort|trop tard|trop de sang|ne t'en sortiras)/i.test(s)};
}

// ---- français -> commandes du jeu ----
// Le jeu ne lit que les trois premières lettres du verbe et du deuxième mot : on lui envoie des mots anglais complets.
const FR=(function(){
  const VERBS={ALLER:'GO',VA:'GO',VAIS:'GO',GRIMPER:'CLIMB',GRIMPE:'CLIMB',ESCALADER:'CLIMB',ESCALADE:'CLIMB',ENTRER:'ENTER',ENTRE:'ENTER',
    PRENDRE:'GET',PRENDS:'GET',RAMASSER:'GET',RAMASSE:'GET',POSER:'DROP',POSE:'DROP',LAISSER:'DROP',LAISSE:'DROP',LACHER:'DROP',LACHE:'DROP',
    LANCER:'THROW',LANCE:'THROW',JETER:'THROW',JETTE:'THROW',ATTACHER:'TIE',ATTACHE:'TIE',NOUER:'TIE',NOUE:'TIE',
    INVENTAIRE:'INVENTORY',I:'INVENTORY',INV:'INVENTORY',DEPLACER:'MOVE',DEPLACE:'MOVE',BOUGER:'MOVE',BOUGE:'MOVE',SOULEVER:'MOVE',SOULEVE:'MOVE',
    OUVRIR:'OPEN',OUVRE:'OPEN',EXAMINER:'EXAMINE',EXAMINE:'EXAMINE',REGARDER:'EXAMINE',REGARDE:'EXAMINE',FOUILLER:'EXAMINE',FOUILLE:'EXAMINE',
    SECOURS:'HELP',UTILISER:'USE',UTILISE:'USE',ALLUMER:'USE',ALLUME:'USE',QUITTER:'QUIT',QUITTE:'QUIT',COUPER:'CUT',COUPE:'CUT',
    SCORE:'SCORE',COUPS:'SCORE',LIRE:'READ',LIS:'READ',CASSER:'BREAK',CASSE:'BREAK',BRISER:'BREAK',BRISE:'BREAK',
    METTRE:'WEAR',METS:'WEAR',ENFILER:'WEAR',ENFILE:'WEAR',PORTER:'WEAR',PORTE:'WEAR',BOIRE:'DRINK',BOIS:'DRINK',MANGER:'EAT',MANGE:'EAT',
    DIRE:'SAY',DIS:'SAY',CRIER:'SAY',CRIE:'SAY',AVEC:'WITH',A:'TO',AU:'TO',LISTE:'LIST',MONTER:'GO UP',MONTE:'GO UP',DESCENDRE:'GO DOWN',DESCENDS:'GO DOWN'};
  const NOUNS={};
  const add=(en,fr)=>fr.split(' ').forEach(w=>{ NOUNS[w]=en; });
  add('CHAIR','CHAISE');add('CABLE','CABLE');add('DEBRIS','DEBRIS');add('FOOD','NOURRITURE');add('CLEAVER','COUPERET HACHOIR');
  add('BEAKER','FIOLE BECHER VITAMINES');add('CABINET','ARMOIRE PLACARD');add('WRENCH','CLE MOLETTE');add('RAZOR','RASOIR');add('RADIO','RADIO');
  add('PAPER','PAPIER');add('LEAFLET','PROSPECTUS');add('JACKET','GILET');add('JEWELS','BIJOUX');add('ROPE','CORDE');add('EXTINGUISHER','EXTINCTEUR');
  add('HATCH','ECOUTILLE TRAPPE');add('CROWBAR','BICHE PIED');add('FLASHLIGHT','LAMPE TORCHE');add('SIGN','PANNEAU');add('PAINTING','TABLEAU PEINTURE');
  add('PLATE','TOLE PLAQUE COQUE');add('LEDGE','CORNICHE REBORD');add('DOOR','PORTE');
  const DIRS={N:'NORTH',NORD:'NORTH',S:'SOUTH',SUD:'SOUTH',E:'EAST',EST:'EAST',O:'WEST',OUEST:'WEST',H:'UP',HAUT:'UP',B:'DOWN',BAS:'DOWN'};
  Object.assign(NOUNS,{NORD:'NORTH',SUD:'SOUTH',OUEST:'WEST',HAUT:'UP',BAS:'DOWN'});
  const STOP=new Set('LE LA LES L UN UNE DES DU DE D AU AUX A SUR DANS VERS EN AVEC ET MON MA MES CE CET CETTE CES PAR POUR Y SUR'.split(' '));
  const norm=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’`\-]/g,' ').replace(/[^A-Z0-9 ?!]/g,' ').replace(/\s+/g,' ').trim();
  function frToEn(line){
    const n=norm(line); if(!n) return '';
    let t=n.split(' ');
    while(t.length>1&&['JE','ME','SE','M','S','TE','T'].includes(t[0])) t.shift();
    if(t.length===1&&DIRS[t[0]]) return 'GO '+DIRS[t[0]];
    const verb=VERBS[t[0]]; if(!verb) return n;               // pas du français connu : transmis tel quel (l'anglais marche)
    const rest=t.slice(1).filter(x=>!STOP.has(x));
    if(verb==='SAY') return rest.length?'SAY '+t.slice(1).join(' '):'SAY';   // le mot à dire passe tel quel
    if(verb.startsWith('GO ')){ if(verb==='GO UP'&&rest.length&&NOUNS[rest[0]]&&!DIRS[rest[0]]) return 'CLIMB '+NOUNS[rest[0]]; return verb; }   // « monte au câble »
    if(verb==='GO'&&rest.length&&DIRS[rest[0]]) return 'GO '+DIRS[rest[0]];
    let noun=null; for(const x of rest){ if(NOUNS[x]){ noun=NOUNS[x]; break; } }
    if(!noun&&rest.length) noun=rest[rest.length-1];
    return noun?verb+' '+noun:verb;
  }
  const HELP="VERBES : ALLER (OU N, S, E, O, H, B), GRIMPER, PRENDRE, POSER, INVENTAIRE, EXAMINER, LIRE, OUVRIR, DÉPLACER, UTILISER, ATTACHER, METTRE, BOIRE, MANGER, DIRE, SCORE (COUPS RESTANTS), SECOURS (UN CONSEIL DU JEU).%RÉPONDS À « AVEC QUOI ? » PAR « AVEC … » ET À « À QUOI ? » PAR « À … ».%EXEMPLES : PRENDRE LA CHAISE, GRIMPER AU CÂBLE, OUVRIR L'ARMOIRE, AVEC LE PIED-DE-BICHE.";
  return {TEXT:{},NOUNS,VERBS,HELP,frToEn};
})();
