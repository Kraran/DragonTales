// Eno — textes du jeu et passage du français au jeu.
// Le programme écrit ses lignes (PRINT) en anglais, sur l'écran de 32 colonnes du Dragon. say(ligne, langue, classique)
// rend chaque ligne : en anglais telle quelle dans la version classique, sinon rédigée proprement ; en français dans les
// deux versions. Les clés sont les textes du programme, espaces multiples réduits à un (le programme cale ses phrases sur
// les 32 colonnes avec des espaces). La version moderne retire ce que ses panneaux montrent déjà (objets, sorties, invite).
// Les fautes de frappe d'origine (THATAROUND, BU COULDN'T, ITWAS…) sont corrigées dans la version moderne.
const ENO_NORM=s=>s.replace(/ +/g,' ').trim();

// ---- les lieux : « YOU ARE » + A$(F) ----
const ENO_DESC={
 "IN THE LIVING ROOM":["in the living room.","dans le salon."],
 "BY A LOVE SEAT":["by a love seat.","près d'une causeuse."],
 "BY A LARGE FISH TANK":["by a large fish tank.","près d'un grand aquarium."],
 "BY A TV":["by a TV.","près d'un téléviseur."],
 "BY A STUFFED CHAIR":["by a stuffed chair.","près d'un fauteuil rembourré."],
 "BY A FLOOR LAMP":["by a floor lamp.","près d'un lampadaire."],
 "BY THE CURTAINS":["by the curtains.","près des rideaux."],
 "BY AN END TABLE":["by an end table.","près d'une table d'appoint."],
 "BY A SOFA":["by a sofa.","près d'un canapé."],
 "BY A COFFEE TABLE":["by a coffee table.","près d'une table basse."]
};

// ---- les objets : B$(n) ----
const ENO_OBJ={
 "AN OVAL RUG":["an oval rug","un tapis ovale"],
 "A LOOSE BOARD":["a loose board","une latte disjointe"],
 "A DEAD CAT":["a dead cat","un chat mort"],
 "A LOVE SEAT":["a love seat","une causeuse"],
 "A PICTURE":["a picture","un tableau"],
 "A SAFE":["a safe","un coffre-fort"],
 "1 MILLION BUCKS":["1 million bucks","un million de dollars"],
 "A LARGE FISH TANK":["a large fish tank","un grand aquarium"],
 "29 FISH":["29 fish","29 poissons"],
 "A CONSOLE TV SET":["a console TV set","un téléviseur en meuble"],
 "A STUFFED CHAIR":["a stuffed chair","un fauteuil rembourré"],
 "A CHAIR CUSHION":["a chair cushion","un coussin de fauteuil"],
 "A MAGAZINE":["a magazine","une revue"],
 "A FLOOR LAMP":["a floor lamp","un lampadaire"],
 "A BURNED OUT BULB":["a burned out bulb","une ampoule grillée"],
 "CURTAINS":["curtains","des rideaux"],
 "A PICTURE WINDOW":["a picture window","une baie vitrée"],
 "AN END TABLE":["an end table","une table d'appoint"],
 "A TABLE LAMP":["a table lamp","une lampe de table"],
 "END TABLE DOORS":["end table doors","les petites portes de la table d'appoint"],
 "A PAIR OF NURSE SHOES":["a pair of nurse shoes","une paire de chaussures d'infirmière"],
 "A SOFA":["a sofa","un canapé"],
 "A COFFEE TABLE":["a coffee table","une table basse"],
 "A BOOK":["a book","un livre"],
 "REMAINS OF A GOLD-FISH":["remains of a goldfish","les restes d'un poisson rouge"]
};

// ---- les messages ----
const ENO_MSG={
 // écran titre, scénario, vocabulaire (la version moderne a son introduction : retirés, sauf en classique)
 "<<ENO>>":null,"CREATORS:":null,"PAUL AUSTIN":null,"AND":null,"LEROY C. SMITH":null,
 "COPYRIGHT 1982 BY PAL CREATIONS":null,"DISTRIBUTED BY DRAGON DATA LTD":null,
 "YOUR ECCENTRIC AUNT HAS JUST DIED AND LEFT YOU HER ESTATE. SHE HAD MILLIONS.":
  ["Your eccentric aunt has just died and left you her estate. She had millions.","Ta tante excentrique vient de mourir et te laisse ses biens. Elle avait des millions."],
 "IF YOU FIND IT, IT'S YOURS!!! YOUR ONLY CLUE: LIVING ROOM!?!?!":
  ["If you find it, it's yours!!! Your only clue: living room!?!?!","Si tu les trouves, ils sont à toi !!! Ton seul indice : le salon !?!?!"],
 "GOOD HUNTING.":["Good hunting.","Bonne chasse."],
 "[PRESS ANY KEY]":["[Press any key]","[Appuie sur une touche]"],
 "YOUR VOCABULARY:":["Your vocabulary:","Ton vocabulaire :"],
 "PUSH=MOVE":["PUSH=MOVE","POUSSER=DÉPLACER"],"TAKE=GET":["TAKE=GET","PRENDRE=RAMASSER"],"LOOK=EXAMINE":["LOOK=EXAMINE","REGARDER=EXAMINER"],
 "DROP=LEAVE":["DROP=LEAVE","POSER=LAISSER"],"TEAR=BREAK":["TEAR=BREAK","DÉCHIRER=CASSER"],"TURN=CHANGE":["TURN=CHANGE","TOURNER=CHANGER"],
 "QUIT=END":["QUIT=END","QUITTER=FIN"],"READ":["READ","LIRE"],"OPEN":["OPEN","OUVRIR"],"HELP":["HELP","AIDE"],
 "[PRESS ANY KEY TO START]":["[Press any key to start]","[Appuie sur une touche pour commencer]"],
 // la partie
 "USE SINGLE LETTERS TO INDICATE DIRECTION (EXAMPLE, N=NORTH)":["Use single letters to indicate a direction (for example, N = north).","Une lettre seule suffit pour te déplacer (par exemple, N = nord)."],
 "YOU ARE CARRYING:":["You are carrying:","Tu portes :"],
 "NOTHING":["nothing","rien"],
 "THAT'S ENOUGH HELP FOR YOU. YOU CAN'T CALL FOR HELP EVERY TIME YOU ARE PUZZLED.":
  ["That's enough help for you. You can't call for help every time you are puzzled.","Ça suffit, l'aide. Tu ne peux pas appeler au secours chaque fois que tu sèches."],
 "CURIOSITY KILLED THE CAT.":["Curiosity killed the cat.","La curiosité a tué le chat."],
 "TOO MUCH TV IS NOT GOOD FOR YOU.":["Too much TV is not good for you.","Trop de télé, ce n'est pas bon pour toi."],
 "I'M SO CONFUSED!!!":["I'm so confused!!!","Je suis perdu !!!"],
 "TRY USING TWO WORD COMMANDS.":["Try using two-word commands.","Essaie avec deux mots : un verbe et un nom."],
 "YOU CAN'T GO THAT WAY!":["You can't go that way!","Tu ne peux pas aller par là !"],
 "I DON'T UNDERSTAND WHAT YOU ARE TELLING ME.":["I don't understand what you are telling me.","Je ne comprends pas ce que tu me dis."],
 "YOU ALREADY HAVE IT!":["You already have it!","Tu l'as déjà !"],
 "YOU DON'T SEE IT HERE.":["You don't see it here.","Tu ne vois pas ça ici."],
 "YOU CAN'T CARRY ANYTHING ELSE!":["You can't carry anything else!","Tu ne peux rien porter de plus !"],
 "YOU CAN'T TAKE IT.":["You can't take it.","Tu ne peux pas prendre ça."],
 "OK, YOU HAVE IT":["OK, you have it.","Ça y est, tu l'as."],
 "OK, YOU DROPPED IT.":["OK, you dropped it.","C'est posé."],
 "YOU DON'T HAVE IT!":["You don't have it!","Tu ne l'as pas !"],
 "OK, THEY'RE OPEN":["OK, they're open.","Voilà, c'est ouvert."],
 "THEY ARE ALREADY OPEN":["They are already open.","C'est déjà ouvert."],
 "IT'S ALREADY OPEN":["It's already open.","C'est déjà ouvert."],
 "SORRY, IT DOES NOT OPEN.":["Sorry, it does not open.","Désolé, ça ne s'ouvre pas."],
 "OK, IT'S OPEN":["OK, it's open.","Voilà, c'est ouvert."],
 "YOU CAN'T CLOSE ANYTHING THAT YOU CAN'T SEE OR DON'T HAVE.":["You can't close anything that you can't see or don't have.","Tu ne peux pas fermer ce que tu ne vois pas ou que tu n'as pas."],
 "OK, THEY'RE CLOSED.":["OK, they're closed.","Voilà, c'est fermé."],
 "THEY'RE ALREADY CLOSED":["They're already closed.","C'est déjà fermé."],
 "OK, IT'S CLOSED.":["OK, it's closed.","Voilà, c'est fermé."],
 "IT'S ALREADY CLOSED":["It's already closed.","C'est déjà fermé."],
 "YOU TRIED, BUT IT DOESN'T CLOSE.":["You tried, but it doesn't close.","Tu essaies, mais ça ne se ferme pas."],
 "YOU DON'T SEE ANYTHING LIKE THATAROUND HERE.":["You don't see anything like that around here.","Tu ne vois rien de tel par ici."],
 "NOTHING HAPPENED.":["Nothing happened.","Il ne se passe rien."],
 "NOTHING LIKE THAT AROUND HERE THAT YOU CAN BREAK.":["Nothing like that around here that you can break.","Rien de tel à casser par ici."],
 "YOU TRIED, BUT COULDN'T BREAK IT":["You tried, but couldn't break it.","Tu essaies, mais tu n'arrives pas à le casser."],
 "YOU TRIED TO ENTER, BU COULDN'T.":["You tried to enter, but couldn't.","Tu essaies d'entrer, sans y arriver."],
 "NOTHING IMPORTANT.":["Nothing important.","Rien d'important."],
 "YOU CAN'T TURN IT":["You can't turn it.","Ça ne se tourne pas."],
 "OPEN BEFORE READING":["Open it before reading.","Il faut l'ouvrir avant de le lire."],
 "NOTHING SPECIAL ABOUT IT.":["Nothing special about it.","Rien de particulier."],
 // EXAMINE
 "IT IS A PERSIAN RUG.":["It is a Persian rug.","C'est un tapis persan."],
 "LOOSE":["Loose.","Elle bouge."],
 "IT STINKS. THERE IS THE REMAINS OF A GOLD-FISH IN THE CATS MOUTH":["It stinks. There are the remains of a goldfish in the cat's mouth.","Il pue. Il a les restes d'un poisson rouge dans la gueule."],
 "PINK":["Pink.","Rose."],
 "PICTURE OF A BLACK CAT.":["A picture of a black cat.","Le portrait d'un chat noir."],
 "IT'S LOCKED.":["It's locked.","Il est fermé à clé."],
 "IT'S OPEN.":["It's open.","Il est ouvert."],
 "THEY'RE OPEN.":["They're open.","Elles sont ouvertes."],
 "GREEN":["Green.","Vert."],
 "THERE ARE 29 GOLDFISH IN HERE.":["There are 29 goldfish in here.","Il y a 29 poissons rouges là-dedans."],
 "SWIMMING":["Swimming.","Ils nagent."],
 "THE TV IS ON. IT'S TUNED TO CHANNEL 11 WHICH IS PLAYING 'ALIEN'.":["The TV is on. It's tuned to channel 11, which is playing “Alien”.","La télé est allumée, sur la chaîne 11, qui passe « Alien »."],
 "IT CLASHES WITH THE CURTAINS.":["It clashes with the curtains.","Il jure avec les rideaux."],
 "THERE IS A MAGAZINE UNDER IT.":["There is a magazine under it.","Il y a une revue dessous."],
 "IT'S A SCIENCE FICTION MAGAZINE.":["It's a science fiction magazine.","C'est une revue de science-fiction."],
 "IT HAS A BURNED OUT BULB.":["It has a burned out bulb.","Son ampoule est grillée."],
 "*MADE IN POLAND*":["*Made in Poland*","*Fabriqué en Pologne*"],
 "GOLD, PURPLE, ORANGE, AND PINK":["Gold, purple, orange and pink.","Or, violet, orange et rose."],
 "THERE GOES THE MAILMAN":["There goes the mailman.","Tiens, le facteur passe."],
 "IT HAS 2 DOORS.":["It has 2 doors.","Elle a deux petites portes."],
 "ELECTRIC":["Electric.","Électrique."],
 "THEY'RE CLOSED.":["They're closed.","Elles sont fermées."],
 "P.U.!!!! THEY STINK!!":["P.U.!!!! They stink!!","Pouah !!!! Elles puent !!"],
 "CLASHES WITH THE RUG.":["It clashes with the rug.","Il jure avec le tapis."],
 "BROWN":["Brown.","Marron."],
 "'THE CAT WITH 9 LIVES'":["“The Cat with 9 Lives”","« Le chat aux neuf vies »"],
 "IT STINKS. NOT MUCH REMAINS OF 1":["It stinks. Not much remains of 1.","Ça pue. Il ne reste pas grand-chose de celui-là."],
 // READ
 "TITLE:'THE CAT EATING FISH FROM OUTER SPACE'":["Title: “The Cat Eating Fish from Outer Space”","Titre : « Le chat qui mangeait des poissons venus de l'espace »"],
 "TO MY BELOVED CAT 'ENO' ON HIS NINTH LIFE.":["“To my beloved cat Eno, on his ninth life.”","« À mon chat bien-aimé, Eno, pour sa neuvième vie. »"],
 // le coffre-fort
 "FIRST NUMBER OF THE COMBINATION:?":["First number of the combination?","Premier nombre de la combinaison ?"],
 "2ND NUMBER OF COMBINATION:?":["Second number of the combination?","Deuxième nombre de la combinaison ?"],
 "3RD NUMBER OF COMBINATION:?":["Third number of the combination?","Troisième nombre de la combinaison ?"],
 // les fins
 "C O N G R A T U L A T I O N S ! YOU ARE NOW A MILLIONAIRE!!!!!!!DON'T SPEND IT ALL IN ONE PLACE!":
  ["C O N G R A T U L A T I O N S ! You are now a millionaire!!!!!!! Don't spend it all in one place!","F É L I C I T A T I O N S ! Te voilà millionnaire !!!!!!! Ne dépense pas tout au même endroit !"],
 "YOU HAVE JUST BROKEN THE TANK.":["You have just broken the tank.","Tu viens de briser l'aquarium."],
 "IT FLOODED THE LIVING ROOM AND YOU HAVE DROWNED. WE TOLD YOU ITWAS A <<LARGE>> FISH TANK!!!!!!!":
  ["It flooded the living room and you have drowned. We told you it was a large, a really large fish tank!!!!!!!","Il a inondé le salon et tu t'es noyé. On t'avait pourtant prévenu : c'était un grand, un très grand aquarium !!!!!!!"],
 "NEXT TIME LISTEN TO WHAT WE SAY!":["Next time, listen to what we say!","La prochaine fois, écoute ce qu'on te dit !"],
 "THE TV SET JUST SHORT-CIRCUITED AND ELECTROCUTED YOU. YOUR SPOUSE WILL GET THE MONEY NOW!!!":
  ["The TV set just short-circuited and electrocuted you. Your spouse will get the money now!!!","Le téléviseur vient de faire court-circuit et de t'électrocuter. C'est ton conjoint qui touchera l'argent !!!"],
 "A LARGE RAT JUST JUMPED OUT. IT SCARED YOU SO BAD YOU ARE HAVING A CARDIAC ARREST. YOU FEEL A SEVERE PAIN IN YOUR CHESTAND YOU COLLAPSE TO THE FLOOR.":
  ["A large rat just jumped out. It scared you so badly that you are having a cardiac arrest. You feel a severe pain in your chest and you collapse to the floor.",
   "Un gros rat vient de bondir dehors. Il t'a fait une telle peur que ton cœur lâche. Une douleur terrible te serre la poitrine et tu t'effondres sur le sol."],
 "CALL FOR HELP?":["Call for help?","Appeler à l'aide ?"],
 "YOU SHOULD HAVE WATCHED YOUR CHOLESTEROL INTAKE. YOU ARE DEAD":["You should have watched your cholesterol intake. You are dead.","Tu aurais dû surveiller ton cholestérol. Tu es mort."],
 "WRONG NUMBER!!! YOU SET OFF THE ALARM AND HAVE BEEN MISTAKEN FOR A BURGLAR. YOUHAVE BEEN ARRESTED AND SENT TO JAIL. AFTER YOU SERVE YOUR TIME TRY AGAIN.":
  ["Wrong number!!! You set off the alarm and have been mistaken for a burglar. You have been arrested and sent to jail. After you serve your time, try again.",
   "Mauvais numéro !!! Tu as déclenché l'alarme et on t'a pris pour un cambrioleur. Te voilà arrêté et en prison. Quand tu auras purgé ta peine, réessaie."],
 "PRESS <Y> TO TRY AGAIN":["Press <Y> to try again","Appuie sur <O> pour rejouer"],
 "OK, SEE YOU LATER.":["OK, see you later.","D'accord, à plus tard."]
};
const ENO_DIR={NORTH:'NORD',SOUTH:'SUD',EAST:'EST',WEST:'OUEST',UP:'HAUT',DOWN:'BAS'};
// lignes qui ne servent qu'à la version classique : la version moderne a son introduction et ses panneaux
const ENO_SCREEN_ONLY=new Set(['YOUR ECCENTRIC AUNT HAS JUST DIED AND LEFT YOU HER ESTATE. SHE HAD MILLIONS.','IF YOU FIND IT, IT\'S YOURS!!! YOUR ONLY CLUE: LIVING ROOM!?!?!',
 'GOOD HUNTING.','[PRESS ANY KEY]','YOUR VOCABULARY:','PUSH=MOVE','TAKE=GET','LOOK=EXAMINE','DROP=LEAVE','TEAR=BREAK','TURN=CHANGE','QUIT=END','READ','OPEN','HELP',
 '[PRESS ANY KEY TO START]','PRESS <Y> TO TRY AGAIN','OK, SEE YOU LATER.']);
const enoCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
// Traduit une ligne du programme. Rend undefined si elle est inconnue (gardée telle quelle), null si la version moderne
// doit la retirer, sinon {t, kind} ; kind 'list' : objet d'une liste.
function enoLine(l,fr,classic){
  const k=ENO_NORM(l), pick=a=>fr?a[1]:a[0];
  if(!k) return undefined;
  if(!classic&&ENO_SCREEN_ONLY.has(k)) return null;
  if(Object.prototype.hasOwnProperty.call(ENO_MSG,k)) return ENO_MSG[k]===null?(classic?undefined:null):{t:pick(ENO_MSG[k])};
  let m;
  if(/^={32}/.test(k)) return classic?undefined:null;
  if(/^WHAT NOW\??$/.test(k)) return classic?{t:fr?'ET MAINTENANT ?':'WHAT NOW?'}:null;
  if((m=/^YOU ARE (.*)$/.exec(k))&&ENO_DESC[m[1]]) return {t:(fr?'Tu es ':'You are ')+pick(ENO_DESC[m[1]])};
  if(k==='YOU CAN SEE:') return classic?{t:fr?'TU VOIS :':'You can see:'}:null;
  if(k==='YOU CAN GO:') return classic?{t:fr?'TU PEUX ALLER :':'You can go:'}:null;
  if(k==='NOTHING IMPORTANT') return classic?{t:fr?'RIEN D\'IMPORTANT':'nothing important',kind:'list'}:null;
  if(/^(\*(NORTH|SOUTH|EAST|WEST|UP|DOWN) ?)+$/.test(k)) return classic?{t:fr?k.replace(/\*(\w+)/g,(_,d)=>'*'+ENO_DIR[d]):k}:null;
  if(ENO_OBJ[k]) return /^ /.test(l)?(classic?{t:pick(ENO_OBJ[k]),kind:'list'}:null):{t:enoCap(pick(ENO_OBJ[k]))};   // « YOU CAN SEE » (décalé) ou inventaire
  return undefined;
}
// Le jeu répète le mot tapé sur la ligne suivante (« SORRY, YOU JUST DON'T SEE ANY » puis « <mot> HERE. ») :
// la version moderne et le français en font une seule phrase.
function enoSay(text,lang,classic){
  if(classic&&lang==='en') return text;                       // version classique anglaise : l'écran d'origine
  const fr=lang==='fr', out=[];
  // un message suivi d'un « ; » se colle aux traits de séparation ou à « PRESS <Y> » : on les sépare
  const parts=text.replace(/([^=\n])(={32})/g,'$1\n$2').replace(/(={32})(?=[^=\n])/g,'$1\n').replace(/([^\n])(PRESS <Y> TO TRY AGAIN)/g,'$1\n$2').split('\n');
  for(let i=0;i<parts.length;i++){
    const l=parts[i], last=i===parts.length-1, nl=last?'':'\n';
    if(last&&l==='') continue;
    const k=ENO_NORM(l), next=ENO_NORM(parts[i+1]||'');
    let m;
    if(k==="SORRY, I JUST DON'T KNOW HOW TO"&&(m=/^(.*) ANYTHING\.$/.exec(next))){
      const s=fr?`Désolé, je ne sais pas faire « ${m[1].toLowerCase()} ».`:`Sorry, I just don't know how to ${m[1].toLowerCase()} anything.`;
      out.push((classic?s.toLocaleUpperCase('fr'):s)+'\n'); i++; continue; }
    if(k==="SORRY, YOU JUST DON'T SEE ANY"&&(m=/^(.*) HERE\.$/.exec(next))){
      const s=fr?`Désolé, tu ne vois pas de « ${m[1].toLowerCase()} » ici.`:`Sorry, you just don't see any ${m[1].toLowerCase()} here.`;
      out.push((classic?s.toLocaleUpperCase('fr'):s)+'\n'); i++; continue; }
    const lead=/^ */.exec(l)[0], r=enoLine(l,fr,classic);
    if(r===null) continue;                                    // version moderne : déjà montré ailleurs
    if(r===undefined){ out.push(l+nl); continue; }
    if(classic){ out.push((r.kind==='list'?'  ':lead)+r.t.toLocaleUpperCase('fr')+(l.endsWith(' ')&&!nl?' ':'')+nl); continue; }
    out.push(r.t+(nl||'\n'));
  }
  return out.join('');
}
// version moderne : lignes vides en trop retirées ; les morts sont repérées pour la fenêtre de fin
function enoClean(s,moved){
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(DROWNED|ELECTROCUTED|YOU ARE DEAD|SENT TO JAIL|noyé|électrocuter|Tu es mort|en prison)/i.test(s)};
}

// ---- français -> commandes du jeu ----
// Le jeu ne lit que les trois premières lettres du verbe et du nom : on lui envoie des mots anglais complets.
const FR=(function(){
  const VERBS={PRENDRE:'GET',PRENDS:'GET',RAMASSER:'GET',RAMASSE:'GET',ATTRAPER:'GET',ATTRAPE:'GET',SOULEVER:'GET',SOULEVE:'GET',
    POSER:'DROP',POSE:'DROP',LAISSER:'DROP',LAISSE:'DROP',LACHER:'DROP',LACHE:'DROP',JETER:'DROP',JETTE:'DROP',
    OUVRIR:'OPEN',OUVRE:'OPEN',FERMER:'CLOSE',FERME:'CLOSE',
    REGARDER:'LOOK',REGARDE:'LOOK',EXAMINER:'EXAMINE',EXAMINE:'EXAMINE',FOUILLER:'EXAMINE',FOUILLE:'EXAMINE',OBSERVER:'EXAMINE',OBSERVE:'EXAMINE',
    POUSSER:'PUSH',POUSSE:'PUSH',DEPLACER:'PUSH',DEPLACE:'PUSH',BOUGER:'PUSH',BOUGE:'PUSH',
    CASSER:'BREAK',CASSE:'BREAK',BRISER:'BREAK',BRISE:'BREAK',DECHIRER:'BREAK',DECHIRE:'BREAK',
    ENTRER:'ENTER',ENTRE:'ENTER',LIRE:'READ',LIS:'READ',
    TOURNER:'CHANGE',TOURNE:'CHANGE',CHANGER:'CHANGE',CHANGE:'CHANGE',ALLUMER:'CHANGE',ALLUME:'CHANGE',ETEINDRE:'CHANGE',ETEINS:'CHANGE',ZAPPER:'CHANGE',ZAPPE:'CHANGE',
    INVENTAIRE:'INVENTORY',I:'INVENTORY',INV:'INVENTORY',AIDE:'HELP',SECOURS:'HELP',QUITTER:'QUIT',QUITTE:'QUIT',FIN:'END'};
  const NOUNS={};
  const add=(en,fr)=>fr.split(' ').forEach(w=>{ NOUNS[w]=en; });
  add('RUG','TAPIS');add('BOARD','LATTE PLANCHE LAME');add('CAT','CHAT ENO');add('SEAT','CAUSEUSE');add('PICTURE','TABLEAU CADRE PEINTURE PORTRAIT');
  add('SAFE','COFFRE COFFREFORT');add('BUCKS','DOLLARS MILLION MILLIONS ARGENT BILLETS MAGOT');add('TANK','AQUARIUM BOCAL');add('FISH','POISSONS POISSON');
  add('TV','TELE TELEVISION TELEVISEUR TV POSTE');add('CHAIR','FAUTEUIL CHAISE');add('CUSHION','COUSSIN');add('MAGAZINE','REVUE MAGAZINE JOURNAL');
  add('LAMP','LAMPE LAMPADAIRE');add('BULB','AMPOULE');add('CURTAINS','RIDEAUX RIDEAU');add('WINDOW','FENETRE BAIE VITRE');
  add('TABLE','TABLE GUERIDON');add('DOORS','PORTES PORTE PORTILLONS PORTILLON');add('SHOES','CHAUSSURES SOULIERS');add('SOFA','CANAPE SOFA DIVAN');
  add('BOOK','LIVRE');add('REMAINS','RESTES ARETES');
  const DIRS={N:'N',NORD:'N',S:'S',SUD:'S',E:'E',EST:'E',O:'W',OUEST:'W',H:'U',HAUT:'U',B:'D',BAS:'D'};
  const STOP=new Set('LE LA LES L UN UNE DES DU DE D AU AUX A SUR SOUS DANS VERS EN AVEC ET MON MA MES CE CET CETTE CES PAR POUR Y'.split(' '));
  const norm=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’`\-]/g,' ').replace(/[^A-Z0-9 ?!]/g,' ').replace(/\s+/g,' ').trim();
  // phrases lues en entier : la réponse à « CALL FOR HELP? », les nombres de la combinaison écrits en lettres
  const WHOLE={'AU SECOURS':'HELP','A L AIDE':'HELP','AIDEZ MOI':'HELP',UN:'1',TRENTE:'30',ONZE:'11'};
  function frToEn(line){
    const n=norm(line); if(!n) return '';
    if(WHOLE[n]) return WHOLE[n];
    let t=n.split(' ');
    if(t.length===1&&DIRS[t[0]]) return DIRS[t[0]];
    if((t[0]==='ALLER'||t[0]==='VA'||t[0]==='VAIS')&&t.length>1){ const d=t.slice(1).find(x=>DIRS[x]); if(d) return DIRS[d]; }
    const verb=VERBS[t[0]]; if(!verb) return n;               // pas du français connu : transmis tel quel (l'anglais marche, les nombres aussi)
    if(verb==='INVENTORY'||verb==='HELP'||verb==='QUIT'||verb==='END') return verb;
    const rest=t.slice(1).filter(x=>!STOP.has(x));
    if(verb==='LOOK'&&!rest.length) return 'LOOK';
    let noun=null; for(const x of rest){ if(NOUNS[x]){ noun=NOUNS[x]; break; } }
    if(!noun&&rest.length) noun=rest[rest.length-1];
    return noun?verb+' '+noun:verb;
  }
  const HELP="VERBES : PRENDRE, POSER, OUVRIR, FERMER, REGARDER, EXAMINER, POUSSER, CASSER, ENTRER, LIRE, TOURNER, INVENTAIRE, AIDE, QUITTER. UNE LETTRE SEULE DÉPLACE : N, S, E, O.%LE JEU NE LIT QUE DEUX MOTS : UN VERBE ET UN NOM (EXAMINER LE TAPIS, OUVRIR LE LIVRE).";
  return {TEXT:{},NOUNS,VERBS,HELP,frToEn};
})();
