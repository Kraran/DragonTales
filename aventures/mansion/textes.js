// Mansion of Doom — textes du jeu et passage du français au jeu.
// Le programme écrit ses lignes (PRINT) en anglais, sur l'écran de 32 colonnes du Dragon. say(ligne, langue, classique)
// rend chaque ligne : en anglais telle quelle dans la version classique, sinon rédigée proprement ; en français dans les
// deux versions. Les clés sont les textes du programme, espaces multiples réduits à un (le programme cale ses phrases sur
// les 32 colonnes avec des espaces). La version moderne retire ce que ses panneaux montrent déjà (objets, sorties, invite).
// Le jeu ne dit pas de quel objet il parle (IT, HIM, HER, THEM) : le français reste neutre (« c'est », « l' », « ça »).
const MD_NORM=s=>s.replace(/ +/g,' ').trim();

// ---- l'écriture gothique transylvanienne ----
// Un symbole par lettre, de A à Z. Les écrits du jeu sont traduits en français puis rechiffrés avec le même alphabet
// (sans accents) : le dictionnaire du jeu, qui donne l'alphabet dans l'ordre, sert toujours à les lire.
const MD_GOTH="_#+.!)-$<?^[%'*,&(=@];\\>:0";
const mdCipher=s=>s.replace(/[A-Z]/g,c=>MD_GOTH[c.charCodeAt(0)-65]);
// écrit chiffré d'origine (anglais) -> texte français en clair, chiffré à l'affichage
const MD_WRIT={
 "@* =[_: ;_%,<(! =_: <@":"POUR TUER VAMPIRE DIS LE",                       // TO SLAY VAMPIRE SAY IT (l'inscription de Transylvanie)
 "@$<= ,[]= -_([<+ !&]_[= =_)!@:":"CECI PLUS AIL EGALE PROTECTION",       // THIS PLUS GARLIC EQUALS SAFETY (la croix)
 "=%<@$ _'. _]=@<'":"SMITH ET AUSTIN",                                    // SMITH AND AUSTIN (le pistolet)
 "[<-$@=":"LUMIERES",                                                     // LIGHTS (l'interrupteur)
 "#_^<'- =*._":"BICARBONATE",                                             // BAKING SODA (le sac)
 ":*(![/+*')<'!%!'@/%_-<+":"YOREL/DETENTION/MAGIE",                       // YOREL/CONFINEMENT/MAGIC (le billet)
 "@<%! #_+^\\_(.=":"TEMPS A REBOURS",                                     // TIME BACKWARDS (le panneau)
 "!%<@":"SPMET",                                                          // EMIT, TIME à l'envers (la potion) : TEMPS à l'envers
 "!":"S",                                                                 // ce qui reste lisible sur la fiole brisée
 ". <= )*( .*\\' _'. .!_@$ _'. .*-":"C COMME CHUTE ET COMME CHIEN",        // D IS FOR DOWN AND DEATH AND DOG (au bord du puits)
 "=]# #_=!%!'@":"SOUS SOL",                                               // SUB BASEMENT (le titre du plan)
 "_#+.!)-$<?^[%'*,&(=@];\\>:0":"ABCDEFGHIJKLMNOPQRSTUVWXYZ"                // le dictionnaire : l'alphabet, inchangé
};

// ---- les lieux : « YOU ARE » + A$(F) ----
const MD_DESC={
 "OUTSIDE THE MANSION":["outside the mansion.","devant le manoir."],
 "IN A ROOM":["in a room.","dans une pièce."],
 "IN A FRONT ROOM":["in a front room.","dans un salon."],
 "IN A VESTIBULE":["in a vestibule.","dans le vestibule."],
 "IN A DISPLAY ROOM":["in a display room.","dans une salle d'exposition."],
 "IN THE MAP ROOM":["in the map room.","dans la salle des cartes."],
 "IN A WEST HALL":["in a west hall.","dans un couloir, à l'ouest."],
 "BY THE STAIRS":["by the stairs.","près de l'escalier."],
 "IN AN EAST HALL":["in an east hall.","dans un couloir, à l'est."],
 "IN A WHITE ROOM":["in a white room.","dans une pièce blanche."],
 "IN A MUSTY ROOM":["in a musty room.","dans une pièce qui sent le moisi."],
 "IN A COOL ROOM":["in a cool room.","dans une pièce fraîche."],
 "IN A MURKY ROOM":["in a murky room.","dans une pièce sombre."],
 "IN A RANCID ROOM":["in a rancid room.","dans une pièce qui sent le rance."],
 "IN A SUNNY ROOM":["in a sunny room.","dans une pièce ensoleillée."],
 "IN A ROOM THAT SMELLS OF RATS":["in a room that smells of rats.","dans une pièce qui sent le rat."],
 "IN A ROOM OF CORPSES":["in a room of corpses.","dans une salle pleine de cadavres."],
 "IN A STUDY":["in a study.","dans un bureau."],
 "IN A MENAGERIE":["in a menagerie.","dans une ménagerie."],
 "IN A MEAT LOCKER":["in a meat locker.","dans une chambre froide."],
 "IN THE KITCHEN":["in the kitchen.","dans la cuisine."],
 "IN THE EAST END OF THE DINING HALL":["in the east end of the dining hall.","au bout est de la salle à manger."],
 "IN THE WEST END OF THE DINING HALL":["in the west end of the dining hall.","au bout ouest de la salle à manger."],
 "IN A ROOM THAT SMELLS OFDECAYING FLESH":["in a room that smells of decaying flesh.","dans une pièce qui sent la chair pourrie."],
 "IN THE TRANSYLVANIA ROOM":["in the Transylvania room.","dans la salle de Transylvanie."],
 "IN A ROOM OF MIRRORS- THERE ARE MIRRORS EVERYWHERE....":["in a room of mirrors. There are mirrors everywhere…","dans une galerie des glaces. Il y a des miroirs partout…"],
 "IN A GUN ROOM":["in a gun room.","dans une salle d'armes."],
 "IN A WOODSHOP":["in a woodshop.","dans un atelier de menuiserie."],
 "IN A WOOD STORAGE ROOM":["in a wood storage room.","dans une réserve de bois."],
 "IN A CHAPEL":["in a chapel.","dans une chapelle."],
 "UNDER THE WEST SKYLIGHT":["under the west skylight.","sous la verrière ouest."],
 "UNDER THE EAST SKYLIGHT":["under the east skylight.","sous la verrière est."],
 "IN A DEN":["in a den.","dans un petit salon."],
 "IN A CLOSET":["in a closet.","dans un placard."],
 "IN A BEDROOM":["in a bedroom.","dans une chambre."],
 "IN A LIBRARY":["in a library.","dans une bibliothèque."],
 "IN THE ATTIC":["in the attic.","au grenier."],
 "IN A ROOM FULL OF WORMS":["in a room full of worms.","dans une salle pleine de vers."],
 "IN THE POWER ROOM":["in the power room.","dans la salle du courant."],
 "IN A SMALL ROOM":["in a small room.","dans une petite pièce."],
 "IN A SUPPLY ROOM":["in a supply room.","dans une réserve."],
 "IN A MAGIC ROOM":["in a magic room.","dans une salle magique."],
 "IN A ROOM THAT SMELLS OFSULPHUR":["in a room that smells of sulphur.","dans une pièce qui sent le soufre."],
 "IN A ROOM OF SKELETONS":["in a room of skeletons.","dans une salle pleine de squelettes."],
 "IN A SLIMY ROOM":["in a slimy room.","dans une pièce gluante."],
 "IN THE ROOM OF DEATH":["in the room of death.","dans la salle de la mort."],
 "IN A ROOM THAT SMELLS OFDECAYING WOOD":["in a room that smells of decaying wood.","dans une pièce qui sent le bois pourri."],
 "IN A ROOM OF RUIN":["in a room of ruin.","dans une salle en ruine."],
 "IN THE DOG ROOM":["in the dog room.","dans la salle du chien."],
 "IN A ROOM OF DARKNESS":["in a room of darkness.","dans la salle des ténèbres."],
 "IN THE WEREWOLF'S ROOM":["in the werewolf's room.","dans l'antre du loup-garou."],
 "ON A LADDER":["on a ladder.","sur une échelle."],
 "IN A TUNNEL. FRESH AIR SEEMS TO COME FROM ABOVE":["in a tunnel. Fresh air seems to come from above.","dans un tunnel. De l'air frais semble venir d'en haut."],
 "IN A ROOM FULL OF BODIES":["in a room full of bodies.","dans une salle pleine de corps."],
 "ON THE EDGE OF A PIT":["on the edge of a pit.","au bord d'un puits."],
 "IN A ROOM FULL OF BATS":["in a room full of bats.","dans une salle pleine de chauves-souris."],
 "IN AN EERIE PASSAGEWAY":["in an eerie passageway.","dans un passage sinistre."],
 "AT THE BOTTOM OF THE STAIRS":["at the bottom of the stairs.","au pied de l'escalier."],
 "IN THE NORTH PORTION OF THE MOOR ROOM. YOU SEE QUICK- SAND TO THE SOUTH":["in the north part of the moor room. You see quicksand to the south.","dans la partie nord de la salle de la lande. Tu vois des sables mouvants au sud."],
 "IN THE SOUTH PORTION OFTHE MOOR- SINKING IN QUICKSAND":["in the south part of the moor, sinking in quicksand.","dans la partie sud de la lande, et tu t'enfonces dans les sables mouvants."],
 "IN A BLOOD BANK":["in a blood bank.","dans une banque du sang."],
 "IN THE CONFINEMENT ROOM":["in the confinement room.","dans la salle de détention."],
 "IN A ROOM OF ACID. YOU CAN SEE A BLACK COFFIN AND A CASKET TO THE WEST- ON THE OTHERSIDE OF THE ACID":["in a room of acid. To the west, on the other side of the acid, you can see a black coffin and a casket.","dans une salle d'acide. À l'ouest, de l'autre côté de l'acide, tu vois un cercueil noir et une cassette."],
 "IN A DARK ROOM. A BLACK COFFIN AND A CASKET LIE HERE. THE ROOM IS DEATHLY QUIET...":["in a dark room. A black coffin and a casket lie here. The room is deathly quiet…","dans une pièce obscure. Un cercueil noir et une cassette reposent ici. Il règne un silence de mort…"],
 "FALLING DOWN A PIT":["falling down a pit!","en train de tomber dans un puits !"],
 "IN THE TOWN SQUARE":["in the town square.","sur la grand-place du village."]
};

// ---- les objets : B$(n) ----
const MD_OBJ={
 "TRANSYLVANIAN WRITING":["Transylvanian writing","une inscription transylvanienne"],
 "A CROSS":["a cross","une croix"],"A SHOE BOX":["a shoe box","une boîte à chaussures"],"A BULLET":["a bullet","une balle"],
 "MIRRORS":["mirrors","des miroirs"],"A GUN":["a gun","un pistolet"],"A MATH TEXT":["a math textbook","un manuel de maths"],
 "A WOODEN STAKE":["a wooden stake","un pieu de bois"],"A DESK":["a desk","un secrétaire"],"A DICTIONARY":["a dictionary","un dictionnaire"],
 "A CHEST":["a chest","un coffre"],"AN EYE OF A NEWT":["an eye of newt","un œil de triton"],"A POWER SWITCH":["a power switch","un interrupteur"],
 "HUNDREDS OF WORMS":["hundreds of worms","des centaines de vers"],"A TORCH":["a torch","une torche"],"SULPHUR":["sulphur","du soufre"],
 "48 SKELETONS":["48 skeletons","48 squelettes"],"A MILLION MAGGOTS":["a million maggots","un million d'asticots"],"2 HANDS":["2 hands","deux mains"],
 "A CANVAS SACK":["a canvas sack","un sac de toile"],"A DEAD DOG":["a dead dog","un chien mort"],"A WEREWOLF":["a werewolf","un loup-garou"],
 "A LADDER":["a ladder","une échelle"],"A LARGE MALLET":["a large mallet","un gros maillet"],"A SMALL HAMMER":["a small hammer","un petit marteau"],
 "A DOOR":["a door","une porte"],"A WATCH":["a watch","une montre"],"A RAT":["a rat","un rat"],"HUNDREDS OF CORPSES":["hundreds of corpses","des centaines de cadavres"],
 "A MONGOOSE":["a mongoose","une mangouste"],"A DINING TABLE":["a dining table","une table de banquet"],"A NOTE":["a note","un billet"],
 "AN EXTREMELY DEEP PIT":["an extremely deep pit","un puits très profond"],"FROZEN MEAT":["frozen meat","de la viande congelée"],
 "A CANDLE":["a candle","une bougie"],"A PORTRAIT":["a portrait","un portrait"],"A MAP":["a map","un plan"],
 "A SNAKE GUARDING THE SOUTH EXIT":["a snake guarding the south exit","un serpent qui garde la sortie sud"],"COBWEBS":["cobwebs","des toiles d'araignée"],
 "A SIGN":["a sign","un panneau"],"A CAGE":["a cage","une cage"],"A DOOR TO THE EAST":["a door to the east","une porte à l'est"],
 "A TRAPDOOR":["a trapdoor","une trappe"],"A TUNNEL":["a tunnel","un tunnel"],"HUNDREDS OF BODIES":["hundreds of bodies","des centaines de corps"],
 "MUD":["mud","de la boue"],"QUICKSAND":["quicksand","des sables mouvants"],"A CRACK":["a crack","une fissure"],"NUMEROUS BATS":["numerous bats","des nuées de chauves-souris"],
 "8 VATS":["8 vats","8 cuves"],"A YOUNG WOMAN":["a young woman","une jeune femme"],"A COFFIN":["a coffin","un cercueil"],"A VAMPIRE":["a vampire","un vampire"],
 "A DEEP POOL OF ACID":["a deep pool of acid","une fosse d'acide"],"A MAGIC POTION":["a magic potion","une potion magique"],"SHACKELS":["shackles","des fers"],
 "AN ALMANAC":["an almanac","un almanach"],"A BOOKCASE":["a bookcase","une bibliothèque"],"A CHANDALIER":["a chandelier","un lustre"],
 "THE PRINCESS":["the princess","la princesse"],"A CASKET":["a casket","une cassette"],"A KEY":["a key","une clé"],"GARLIC":["garlic","de l'ail"]
};
// mot anglais du jeu (commande) -> nom français, pour la ligne qui répète le mot tapé (G$, TIRER sans pistolet)
const MD_WORD={WRITING:'l\'inscription',CROSS:'la croix',BOX:'la boîte',BULLET:'la balle',MIRRORS:'les miroirs',GUN:'le pistolet',TEXT:'le manuel',
 STAKE:'le pieu',DESK:'le secrétaire',DICTIONARY:'le dictionnaire',CHEST:'le coffre',EYE:'l\'œil',SWITCH:'l\'interrupteur',WORMS:'les vers',TORCH:'la torche',
 SULPHUR:'le soufre',SKELETONS:'les squelettes',MAGGOTS:'les asticots',HANDS:'les mains',SACK:'le sac',DOG:'le chien',WEREWOLF:'le loup-garou',
 LADDER:'l\'échelle',MALLET:'le maillet',HAMMER:'le marteau',DOOR:'la porte',WATCH:'la montre',RAT:'le rat',CORPSES:'les cadavres',MONGOOSE:'la mangouste',
 TABLE:'la table',NOTE:'le billet',PIT:'le puits',MEAT:'la viande',CANDLE:'la bougie',PORTRAIT:'le portrait',MAP:'le plan',SNAKE:'le serpent',
 COBWEBS:'les toiles d\'araignée',SIGN:'le panneau',CAGE:'la cage',TRAPDOOR:'la trappe',TUNNEL:'le tunnel',BODIES:'les corps',MUD:'la boue',
 QUICKSAND:'les sables mouvants',CRACK:'la fissure',BATS:'les chauves-souris',VATS:'les cuves',WOMAN:'la jeune femme',COFFIN:'le cercueil',
 VAMPIRE:'le vampire',ACID:'l\'acide',POTION:'la potion',SHACKELS:'les fers',ALMANAC:'l\'almanach',BOOKCASE:'la bibliothèque',CHANDALIER:'le lustre',
 PRINCESS:'la princesse',CASKET:'la cassette',KEY:'la clé',GARLIC:'l\'ail'};

// ---- les descriptions des objets : D$(n), et celles que le programme change en cours de partie ----
const MD_EXAM={
 "IT IS IN GOTHIC TRANSYLVANIAN":["It is in Gothic Transylvanian.","C'est écrit en gothique transylvanien."],
 "IT IS EXTREMELY HEAVY-IT HAS GOTHIC TRANSYLVANIAN ETCHED ON IT":["It is extremely heavy. It has Gothic Transylvanian etched on it.","Elle est extrêmement lourde. Du gothique transylvanien y est gravé."],
 "IT SMELLS BAD":["It smells bad.","Ça sent mauvais."],"IT IS SILVER":["It is silver.","Elle est en argent."],
 "YOU SMILE AT YOURSELF":["You smile at yourself.","Tu te souris."],"EMPTY":["Empty.","Vide."],"IT IS WRITTEN IN ENGLISH":["It is written in English.","Il est écrit en anglais."],
 "IT IS VERY SHARP":["It is very sharp.","Il est très pointu."],"IT IS BROWN":["It is brown.","C'est marron."],
 "A GOTHIC TRANSYLVANIAN DICTIONARY":["A Gothic Transylvanian dictionary.","Un dictionnaire de gothique transylvanien."],
 "IT IS LOCKED":["It is locked.","C'est fermé à clé."],"HERE'S LOOKING AT YOU-KID":["Here's looking at you, kid.","À la tienne, mon petit."],
 "IT IS AN OLD KNIFE-TYPE SWITCH. IT IS MARKED [<-$@=":["It is an old knife switch. It is marked [<-$@=","C'est un vieil interrupteur à couteau. Il porte l'inscription "+mdCipher("LUMIERES")],
 "THEY ARE CRAWLING":["They are crawling.","Ça grouille."],"IT WILL NOT BUDGE":["It will not budge.","Elle ne bouge pas d'un pouce."],
 "IT SMELLS LIKE ROTTEN EGGS":["It smells like rotten eggs.","Ça sent l'œuf pourri."],"THEY ARE CRUMBLING":["They are crumbling.","Ils tombent en poussière."],
 "THEY ARE GORY AND GRUESOME":["They are gory and gruesome.","Elles sont sanglantes et horribles."],
 "IT HAS SOMETHING WHITE IN IT. ITHAS GOTHIC TRANSYLVANIAN ON IT.":["It has something white in it. It has Gothic Transylvanian on it.","Il contient quelque chose de blanc. Il porte une inscription en gothique transylvanien."],
 "IT IS ROTTEN. IT WEIGHS 20 LBS":["It is rotten. It weighs 20 lbs.","Il est pourri. Il pèse dans les dix kilos."],
 "HE IS DEAD":["He is dead.","Il est mort."],"SHE IS DEAD":["She is dead.","Elle est morte."],
 "IT LEADS UP AND DOWN":["It leads up and down.","Elle monte et elle descend."],"IT WEIGHS 15 POUNDS":["It weighs 15 pounds.","Il pèse sept kilos."],
 "IT IS A 10 OUNCE HAMMER":["It is a 10-ounce hammer.","C'est un marteau de 300 grammes."],"IT IS OPEN":["It is open.","C'est ouvert."],"IT IS OPEN...":["It is open…","C'est ouvert…"],
 "HE IS GREY":["He is grey.","Il est gris."],"SLIMY AND ROTTEN-WITH NO BLOOD":["Slimy and rotten, with no blood.","Gluants et pourris, sans une goutte de sang."],
 "HE CHIRPS AT YOU":["He chirps at you.","Elle pépie en te regardant."],"IT IS GIGANTIC":["It is gigantic.","Elle est gigantesque."],
 "YOU CAN'T SEE ANYTHING DOWN THERE!":["You can't see anything down there!","Tu ne vois rien, tout au fond !"],
 "IT LOOKS FRESH... HOPE IT CAME FROM A COW...":["It looks fresh… hope it came from a cow…","Elle a l'air fraîche… pourvu qu'elle vienne d'une vache…"],
 "IT IS LIT":["It is lit.","Elle est allumée."],"IT IS OUT":["It is out.","Elle est éteinte."],"LOOKS LIKE BELLA LUGOSI":["Looks like Bela Lugosi.","On dirait Bela Lugosi."],
 "HE LOOKS HUNGRY!":["He looks hungry!","Il a l'air d'avoir faim !"],"THEY ARE THICK":["They are thick.","Elles sont épaisses."],
 "1' BY 2' BY 2'":["1' by 2' by 2'.","30 cm sur 60 sur 60."],"IT IS CLOSED":["It is closed.","C'est fermé."],"IT IS CLOSED...":["It is closed…","C'est fermé…"],
 "IT IS DANK":["It is dank.","Il est humide et froid."],
 "THEY ARE SLIMY AND ROTTEN-WITH NO BLOOD":["They are slimy and rotten, with no blood.","Ils sont gluants et pourris, sans une goutte de sang."],
 "YOU ARE STUCK IN IT!!!":["You are stuck in it!","Tu es pris dedans !"],
 "IT IS BIG ENOUGH FOR A BAT":["It is big enough for a bat.","Une chauve-souris y passerait."],"BIG ENOUGH FOR A BAT":["Big enough for a bat.","Une chauve-souris y passerait."],
 "THEY ARE VAMPIRE BATS WHICH ARE SUCKING YOU DRY!":["They are vampire bats, and they are sucking you dry!","Ce sont des vampires, et ils te vident de ton sang !"],
 "A+/O-/B-/AB+/O+/A-/AB-/B+":["A+/O-/B-/AB+/O+/A-/AB-/B+","A+/O-/B-/AB+/O+/A-/AB-/B+"],
 "SHE IS PALE WHITE AND UNCONCIOUS":["She is pale white and unconscious.","Elle est d'une pâleur mortelle, et sans connaissance."],
 "IT IS BLACK":["It is black.","Il est noir."],"HE IS ASLEEP":["He is asleep.","Il dort."],"BUBBLING":["Bubbling.","Il bouillonne."],
 "IT HAS SOMETHING WRITTEN ON IT":["It has something written on it.","Quelque chose est écrit dessus."],"BROKEN":["Broken.","Brisée."],
 "THEY ARE OLD":["They are old.","Ils sont vieux."],"READ FOR SUNSET":["Read it for the sunset time.","À lire pour l'heure du coucher du soleil."],
 "THERE IS NOTHING BEHIND IT":["There is nothing behind it.","Il n'y a rien derrière."],"IT IS OUT OF REACH":["It is out of reach.","Il est hors de portée."],
 "SHE IS ALIVE":["She is alive.","Elle est vivante."],"IT IS WHITE":["It is white.","Elle est blanche."],"IT IS GOLDEN":["It is golden.","Elle est dorée."],
 "NOTHING REMAINS OF HER BUT ASHES":["Nothing remains of her but ashes.","Il ne reste d'elle que des cendres."],
 "IT HAS BEEN SHOT":["It has been shot.","Une balle l'a touché."],"HE HAS BEEN SHOT":["He has been shot.","Une balle l'a touché."],
 "THEY HAVE BEEN SHOT":["They have been shot.","Une balle les a touchés."],"SHE HAS BEEN SHOT":["She has been shot.","Une balle l'a touchée."]
};

// ---- les messages ----
const MD_MSG={
 // écran titre, scénario, vocabulaire
 "<<MANSION OF DOOM>>":["<<MANSION OF DOOM>>","<<LE MANOIR MAUDIT>>"],
 "COPYRIGHT 1982 PAL CREATIONS":["COPYRIGHT 1982 PAL CREATIONS","COPYRIGHT 1982 PAL CREATIONS"],
 "CREATED BY":["CREATED BY","ECRIT PAR"],"AND":["AND","ET"],"LEROY C. SMITH":["LEROY C. SMITH","LEROY C. SMITH"],"PAUL AUSTIN":["PAUL AUSTIN","PAUL AUSTIN"],
 "DISTRIBUTED BY DRAGON DATA LTD":["DISTRIBUTED BY DRAGON DATA LTD","DIFFUSE PAR DRAGON DATA LTD"],
 "NEED INSTRUCTIONS? (Y/N)":["NEED INSTRUCTIONS? (Y/N)","DES INSTRUCTIONS ? (O/N)"],
 "YOU ARE A CITIZEN":["You are a citizen","Tu es un citoyen"],"OF TRANSYLVANIA":["of Transylvania.","de Transylvanie."],
 "THE POPULACE IS IN AN OUTRAGE!":["The populace is in an outrage!","La population est en colère !"],
 "THE MYSTERIOUS COUNT VON STEINOFF HAS JUST ABDUCTED THE CROWN PRINCESS MARLENA AND TAKENHER TO HIS EVIL MANSION. ONLY HEAVEN KNOWS WHAT IS HAPPENING TO HER RIGHT NOW...":
  ["The mysterious Count von Steinoff has just abducted the crown princess Marlena and taken her to his evil mansion. Only heaven knows what is happening to her right now…",
   "Le mystérieux comte von Steinoff vient d'enlever Marléna, la princesse héritière, et l'a emmenée dans son sinistre manoir. Dieu seul sait ce qu'elle y subit en ce moment…"],
 "THE CITIZEN COUNCIL HAS JUST":["The citizens' council has just","Le conseil des citoyens vient"],
 "GIVEN YOU THE 'HONOR' OF":["given you the 'honor' of","de te faire « l'honneur »"],
 "BRINGING HER BACK TO THE TOWN-":["bringing her back to the town,","de la ramener au village,"],"ALIVE.":["alive.","vivante."],
 "NO EASY TASK...":["No easy task…","Ce ne sera pas facile…"],
 "THE VON STEINOFF MANSION HAS A CENTURIES-OLD LEGEND OF BEING POPULATED BY VAMPIRES, MONSTERS,AND OTHER CUTE CREATURES.":
  ["The von Steinoff mansion has a centuries-old legend of being populated by vampires, monsters and other cute creatures.",
   "Depuis des siècles, la légende peuple le manoir von Steinoff de vampires, de monstres et d'autres charmantes créatures."],
 "IN FACT, NO ONE RECALLS EVER SEEING THE COUNT HIMSELF DURING THE DAYTIME...":
  ["In fact, no one recalls ever seeing the count himself during the daytime…","D'ailleurs, personne ne se souvient d'avoir jamais vu le comte en plein jour…"],
 "NO ONE IS EXACTLY SURE WHAT IS THERE BECAUSE-":["No one is exactly sure what is there, because…","Personne ne sait au juste ce qu'il y a là-bas, car…"],
 "NO ONE HAS EVER RETURNED":["no one has ever returned.","personne n'en est jamais revenu."],
 "[PRESS ANY KEY TO PROCEED]":["[PRESS ANY KEY TO PROCEED]","[APPUIE SUR UNE TOUCHE]"],
 "[PRESS 'Y' TO TRY AGAIN]":["[PRESS 'Y' TO TRY AGAIN]","[APPUIE SUR O POUR REJOUER]"],
 "YOUR VERB VOCABULARY:":["Your verb vocabulary:","Tes verbes :"],
 "GET":["GET","PRENDRE"],"DROP":["DROP","POSER"],"LOOK":["LOOK","REGARDER"],"READ":["READ","LIRE"],"QUIT":["QUIT","QUITTER"],"HELP":["HELP","SECOURS"],
 "OPEN":["OPEN","OUVRIR"],"CLOSE":["CLOSE","FERMER"],"SHOOT":["SHOOT","TIRER"],"EXAMINE":["EXAMINE","EXAMINER"],"INVENTORY":["INVENTORY","INVENTAIRE"],
 // la partie
 "IT IS DARK HERE. YOU CAN'T SEE":["It is dark here. You can't see.","Il fait noir ici. Tu n'y vois rien."],
 "DO SOMETHING,EVEN IF IT'S WRONG!":["Do something, even if it's wrong!","Fais quelque chose, même si c'est une bêtise !"],
 "THE SHACKELS FALL AWAY":["The shackles fall away.","Les fers tombent."],
 "YOU CAN'T DO ANYTHING WITH THESESHACKELS ON!!!!":["You can't do anything with these shackles on!","Tu ne peux rien faire avec ces fers aux poignets !"],
 "SPLAT!!! YOU HIT THE BOTTOM OF THE PIT!! YOU ARE VERY DEAD!!":["SPLAT! You hit the bottom of the pit. You are very dead!","SPLATCH ! Tu t'écrases au fond du puits. Tu es mort, bien mort !"],
 "YOU JUST DROVE THE WOODEN STAKE THROUGH THE HEART OF THE VAMPIREYOU KILLED HIM!!!":["You just drove the wooden stake through the heart of the vampire. You killed him!","Tu viens d'enfoncer le pieu de bois dans le cœur du vampire. Tu l'as tué !"],
 "YOU CAN'T":["You can't.","Tu ne peux pas."],
 "OK. TRY AGAIN SOON.":["OK. Try again soon.","D'accord. Reviens vite."],
 "YOU HAVE:":["You have:","Tu portes :"],"NOTHING WITH YOU RIGHT NOW":["Nothing with you right now.","Rien pour l'instant."],
 "USE 2 WORDS":["Use 2 words.","Emploie 2 mots."],
 "THE WEREWOLF JUST RIPPED YOUR HEART OUT AND IS NOW EATING IT!! YOU ARE VERY DEAD!!!":["The werewolf just ripped your heart out and is now eating it. You are very dead!","Le loup-garou vient de t'arracher le cœur et il le dévore. Tu es mort, bien mort !"],
 "THE STAIRS STRETCH FROM THE TOP TO THE BOTTOM":["The stairs stretch from the top to the bottom.","L'escalier va du haut en bas de la maison."],
 "HELP!? YOU MUST BE KIDDING! THIS ADVENTURE IS EASY! ALL YOU HAVE TO DO IS RESCUE PRINCESS MARLENA!":["Help!? You must be kidding! This adventure is easy! All you have to do is rescue Princess Marlena!","Du secours ?! Tu plaisantes ! Cette aventure est facile ! Tu n'as qu'à sauver la princesse Marléna !"],
 "YOU CAN'T DO THAT":["You can't do that.","Tu ne peux pas faire ça."],
 "YOU CAN'T GO THAT WAY":["You can't go that way.","Tu ne peux pas aller par là."],"HUH?":["Huh?","Hein ?"],
 "YOU CAN NOT CARRY ANY MORE":["You can't carry any more.","Tu ne peux rien porter de plus."],
 "OK, YOU GOT IT, THEN YOU LOADED THE GUN WITH IT":["OK, you got it, then you loaded the gun with it.","Tu prends la balle et tu en charges le pistolet."],
 "HER ASHES CRUMBLE THROUGH YOUR FINGERS. YOU CAN'T PICK HER UP!!":["Her ashes crumble through your fingers. You can't pick her up!","Ses cendres s'écoulent entre tes doigts. Tu ne peux pas la prendre !"],
 "OK, YOU GOT IT, THEN YOU LOADED THE BULLET INTO THE GUN":["OK, you got it, then you loaded the bullet into the gun.","Tu prends le pistolet et tu y glisses la balle."],
 "YOU TRIED TO GET THE CHEST, BUT WHEN YOU STARTED TO PICK IT UP, SOMETHING CLICKED...":["You tried to get the chest, but when you started to pick it up, something clicked…","Tu essaies de prendre le coffre, mais quand tu le soulèves, quelque chose fait clic…"],
 "YOU ARE FALLING!":["You are falling!","Tu tombes !"],
 "HE RUNS AWAY FROM YOU":["He runs away from you.","Il s'enfuit."],
 "THEY CRUMBLE WHEN YOU TOUCH THEM":["They crumble when you touch them.","Ils s'effritent dès que tu les touches."],
 "THEY ARE TOO FAST FOR YOU":["They are too fast for you.","Elles sont trop rapides pour toi."],
 "THERE IS TOO MUCH HERE":["There is too much here.","Il y en a beaucoup trop."],
 "HE WILL NOT LET YOU GET HIM":["He will not let you get him.","Il ne se laisse pas attraper."],
 "YOU CAN'T GET IT OUT OF THE GUN":["You can't get it out of the gun.","Impossible de la sortir du pistolet."],
 "THE ACID BUBBLES FURIOUSLY":["The acid bubbles furiously.","L'acide bouillonne furieusement."],
 "THE MONGOOSE CHASED THE SNAKE INTO ANOTHER ROOM":["The mongoose chased the snake into another room.","La mangouste a chassé le serpent dans une autre pièce."],
 "YOU CAUGHT THE MONGOOSE":["You caught the mongoose.","Tu as attrapé la mangouste."],
 "THE BOTTLE SHATTERED. THE LIGHTING CHANGED":["The bottle shattered. The lighting changed.","La fiole se brise. La lumière change."],
 "THE COFFIN CREAKS OPEN...":["The coffin creaks open…","Le cercueil s'ouvre en grinçant…"],
 "THE CASKET CREAKS OPEN":["The casket creaks open.","La cassette s'ouvre en grinçant."],
 "SOMETHING FELL OUT":["Something fell out.","Quelque chose en est tombé."],"A SACK FELL OUT":["A sack fell out.","Un sac en est tombé."],
 "THE LIGHTS WENT OUT":["The lights went out.","Les lumières s'éteignent."],"YOU SEE A WAY DOWN":["You see a way down.","Tu vois un passage qui descend."],
 "YOU SEE A VAMPIRE!":["You see a vampire!","Tu vois un vampire !"],"YOU FOUND THE PRINCESS!":["You found the princess!","Tu as trouvé la princesse !"],
 "SHE TURNS TO ASH BEFORE YOUR EYES":["She turns to ash before your eyes.","Elle tombe en cendres sous tes yeux."],
 "OK,YOU CLOSED IT. AN EERIE RED GLOW PERMEATES THE AREA":["OK, you closed it. An eerie red glow permeates the area.","Tu abaisses l'interrupteur. Une étrange lueur rouge baigne les lieux."],
 "INSIDE THE GUN":["Inside the gun.","Dans le pistolet."],"IT IS LOADED":["It is loaded.","Il est chargé."],"ON YOU":["On you.","Sur toi."],
 "YOU FOUND A DICTIONARY AND AN ALMANAC":["You found a dictionary and an almanac.","Tu trouves un dictionnaire et un almanach."],
 "YOU FOUND A TEXTBOOK":["You found a textbook.","Tu trouves un manuel."],
 "CLICK":["Click.","Clic."],"BANG!!!":["BANG!","PAN !"],"YOU MISSED":["You missed.","Raté."],"OK, YOU SHOT HER":["OK, you shot her.","Tu l'as touchée."],
 "YOU FIRED INTO THE DARKNESS":["You fired into the darkness.","Tu as tiré dans le noir."],
 "A VAMPIRE ATTACKS YOU AND BITES YOU ON THE NECK. YOU PASS OUT..":["A vampire attacks you and bites you on the neck. You pass out…","Un vampire t'attaque et te mord au cou. Tu perds connaissance…"],
 "TO READ":null,                                             // fin de « THERE IS NOTHING ON IT / TO READ », déjà dite
 "Z=0":["Z=0","Z=0"],
 "A GUST OF WIND BLEW OUT THE CANDLE":["A gust of wind blew out the candle.","Un coup de vent a soufflé la bougie."],
 "A VAMPIRE JUST ATTACKED YOU":["A vampire just attacked you.","Un vampire vient de t'attaquer."],
 "HE IS BITING YOUR NECK..........":["He is biting your neck…","Il te mord au cou…"],
 "HE JUST SUCKED ALL YOUR BLOOD FROM YOUR BODY. YOU ARE DEAD!!!":["He just sucked all the blood from your body. You are dead!","Il a bu tout ton sang. Tu es mort !"],
 "YOU GOT BIT BY THE BATS":["You got bitten by the bats","Les chauves-souris"],"ONCE TOO OFTEN":["once too often.","t'ont mordu une fois de trop."],"YOU PASS OUT":["You pass out.","Tu t'évanouis."],
 "YOU HAVE SUCCEEDED IN BRINGING THE CROWN PRINCESS BACK TO HER COUNTRY ALIVE!!! YOU ARE CHEEREDBY THE TOWNSPEOPLE!!! YOU ARE A NATIONAL HERO!!":
  ["You have brought the crown princess back to her country alive! The townspeople cheer you! You are a national hero!",
   "Tu as ramené la princesse héritière vivante dans son pays ! Les villageois t'acclament ! Tu es un héros national !"],
 "YOU HAVE ALSO WON THIS ADVENTURE":["You have also won this adventure!","Et tu as gagné cette aventure !"],
 "THE TOWNSPEOPLE SAY 'THAT IS NOTPRINCESS MARLENA!! WHERE IS SHE?GO BACK AND SAVE HER!!!":["The townspeople say: “That is not Princess Marlena! Where is she? Go back and save her!”","Les villageois disent : « Ce n'est pas la princesse Marléna ! Où est-elle ? Retourne la sauver ! »"],
 "THE TOWNSPEOPLE ARE UPSET AT YOUTHEY SHOUT: GO BACK AND SAVE OURPRINCESS!!":["The townspeople are upset at you. They shout: “Go back and save our princess!”","Les villageois t'en veulent. Ils crient : « Retourne sauver notre princesse ! »"],
 // lignes ajoutées par la fiche (patches de aventure.js) : fins expliquées
 "THE QUICKSAND SWALLOWS YOU. THERE IS NO WAY OUT OF THE SOUTH PART OF THE MOOR. YOU ARE DEAD!":
  ["The quicksand swallows you. There is no way out of the south part of the moor. You are dead!","Les sables mouvants t'engloutissent : la partie sud de la lande n'a pas d'issue. Tu es mort !"],
 "WITHOUT HER YOU CAN'T WIN. THE VAMPIRE HAD TO BE SLAIN BEFORE THE CASKET WAS OPENED. YOU HAVE LOST.":
  ["Without her you can't win. The vampire had to be slain before the casket was opened. You have lost.","Sans elle, plus de victoire possible : il fallait tuer le vampire avant d'ouvrir la cassette. Tu as perdu."],
 "THE SWITCH IS DESTROYED. THE CELLAR WILL STAY DARK FOREVER, AND THE PRINCESS IS DOWN THERE. YOU HAVE LOST.":
  ["The switch is destroyed. The cellar will stay dark forever, and the princess is down there. You have lost.","L'interrupteur est détruit. La cave restera noire à jamais, et la princesse y est. Tu as perdu."],
 "YOU SHOT THE PRINCESS. THE TOWN WILL NEVER FORGIVE YOU. YOU HAVE LOST.":
  ["You shot the princess. The town will never forgive you. You have lost.","Tu as tiré sur la princesse. Le village ne te le pardonnera jamais. Tu as perdu."]
};
const MD_DIR={N:'N',S:'S',E:'E',W:'O',U:'H',D:'B'};
// lignes que la version moderne ne montre pas (elle a ses panneaux, son introduction et ses fenêtres)
const MD_SCREEN_ONLY=new Set(['<<MANSION OF DOOM>>','COPYRIGHT 1982 PAL CREATIONS','CREATED BY','LEROY C. SMITH','AND','PAUL AUSTIN','DISTRIBUTED BY DRAGON DATA LTD',
 'NEED INSTRUCTIONS? (Y/N)','[PRESS ANY KEY TO PROCEED]',"[PRESS 'Y' TO TRY AGAIN]",'YOUR VERB VOCABULARY:','GET','DROP','LOOK','READ','QUIT','HELP','OPEN','CLOSE','SHOOT','EXAMINE','INVENTORY']);
const mdCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const mdLow=s=>s.toLowerCase();
// Traduit une ligne du programme. Rend undefined si elle est inconnue (gardée telle quelle), null si la version moderne
// doit la retirer, sinon {t, kind}. kind : 'list' (objet d'une liste), 'writ' (écrit chiffré, jamais changé de casse).
function mdLine(l,fr,classic){
  const k=MD_NORM(l), pick=a=>fr?a[1]:a[0];
  if(!k) return undefined;
  if(!classic&&MD_SCREEN_ONLY.has(k)) return null;
  if(Object.prototype.hasOwnProperty.call(MD_MSG,k)) return MD_MSG[k]===null?(classic&&!fr?undefined:null):{t:pick(MD_MSG[k])};
  if(MD_WRIT[k]!==undefined) return {t:fr?mdCipher(MD_WRIT[k]):k,kind:'writ'};
  if(MD_EXAM[k]) return {t:pick(MD_EXAM[k])};
  let m;
  if(/^-{32}/.test(k)) return classic?undefined:null;
  if(/^WHAT NOW\??$/.test(k)) return classic?{t:fr?'ET MAINTENANT ?':'WHAT NOW?'}:null;
  if((m=/^YOU ARE (.*)$/.exec(k))&&MD_DESC[m[1]]) return {t:(fr?'Tu es ':'You are ')+pick(MD_DESC[m[1]])};
  if(k==='YOU CAN SEE') return classic?{t:fr?'TU VOIS :':'You can see:'}:null;
  if(k==='YOU CAN GO:') return classic?{t:fr?'SORTIES :':'You can go:'}:null;
  if(k==='NOTHING IMPORTANT') return classic?{t:fr?'RIEN DE PARTICULIER':'nothing important',kind:'list'}:null;
  if(/^(\*[NSEWUD] ?)+$/.test(k)) return classic?{t:k.replace(/\*([NSEWUD])/g,(_,d)=>'*'+(fr?MD_DIR[d]:d))}:null;
  if(MD_OBJ[k]) return /^ /.test(l)?(classic?{t:pick(MD_OBJ[k]),kind:'list'}:null):{t:mdCap(pick(MD_OBJ[k]))};   // « YOU CAN SEE » (décalé) ou inventaire
  if(/^(IT|HE|SHE|THEY) (IS|ARE) NOT HERE$/.test(k)) return {t:fr?"Ce n'est pas ici.":mdCap(mdLow(k))+'.'};
  if((m=/^YOU ALREADY HAVE (IT|HIM|HER|THEM)!$/.exec(k))) return {t:fr?(m[1]==='THEM'?'Tu les as déjà !':"Tu l'as déjà !"):mdCap(mdLow(k))};
  if((m=/^OK, YOU HAVE (IT|HIM|HER|THEM)$/.exec(k))) return {t:fr?(m[1]==='THEM'?'Tu les as.':"Ça y est, tu l'as."):'OK, you have '+mdLow(m[1])+'.'};
  if((m=/^(IT|HE|SHE|THEY) (IS|ARE) (FASTENED SECURELY|TOO HEAVY|TOO SLIPPERY)$/.exec(k)))
    return {t:fr?{"FASTENED SECURELY":"C'est solidement fixé.","TOO HEAVY":"C'est trop lourd.","TOO SLIPPERY":"Ça glisse trop."}[m[3]]:mdCap(mdLow(k))+'.'};
  if((m=/^YOU CAN'T GET A (.+)!$/.exec(k))) return {t:fr?'Tu ne peux pas prendre ça !':"You can't get a "+mdLow(m[1])+'!'};
  if(/^YOU CAN NOT GET (IT|HIM|HER|THEM)$/.test(k)) return {t:fr?"Impossible de t'en emparer.":mdCap(mdLow(k)).replace('can not',"can't")+'.'};
  if((m=/^YOU DON'T HAVE (IT|HIM|HER|THEM)!$/.exec(k))) return {t:fr?(m[1]==='THEM'?'Tu ne les as pas !':"Tu ne l'as pas !"):mdCap(mdLow(k))};
  if(/^OK, YOU DROPPED (IT|HIM|HER|THEM)$/.test(k)) return {t:fr?"C'est posé.":'OK, you dropped '+mdLow(k.slice(16))+'.'};
  if((m=/^YOU TRIED, BUT (IT|HE|SHE|THEY) WON'T (OPEN|CLOSE)$/.exec(k))) return {t:fr?(m[2]==='OPEN'?"Tu essaies, mais ça ne s'ouvre pas.":'Tu essaies, mais ça ne se ferme pas.'):mdCap(mdLow(k))+'.'};
  if(/^(IT|HE|SHE|THEY) WON'T OPEN WITHOUT A KEY$/.test(k)) return {t:fr?"Ça ne s'ouvre pas sans clé.":mdCap(mdLow(k))+'.'};
  if((m=/^(IT|HE|SHE|THEY) (IS|ARE) ALREADY (OPEN|CLOSED)$/.exec(k))) return {t:fr?(m[3]==='OPEN'?"C'est déjà ouvert.":"C'est déjà fermé."):mdCap(mdLow(k))+'.'};
  if(/^OK, (IT|HE|SHE|THEY) (IS|ARE) OPEN$/.test(k)) return {t:fr?"C'est ouvert.":'OK, '+mdLow(k.slice(4))+'.'};
  if((m=/^OK, YOU CLOSED (IT|HE|SHE|THEY)$/.exec(k))) return {t:fr?"C'est fermé.":'OK, you closed '+({IT:'it',HE:'him',SHE:'her',THEY:'them'}[m[1]])+'.'};
  if(/^OK, YOU SHOT (IT|HIM|HER|THEM)$/.test(k)) return {t:fr?'Touché !':'OK, you shot '+mdLow(k.slice(13))+'.'};
  if((m=/^THERE IS NOTHING ON (IT|HIM|HER|THEM)$/.exec(k))) return {t:fr?"Il n'y a rien à lire dessus.":'There is nothing on '+mdLow(m[1])+(classic?'':' to read.')};
  if(k==='YOU POINTED YOUR FINGER AT THE') return {t:fr?'Tu pointes le doigt vers':'You pointed your finger at the'};
  if(k==="AND WENT 'BANG!' UNFORTUNATELY, YOUR FINGER WASN'T LOADED, NOTHING HAPPENED!")
    return {t:fr?"et tu fais « PAN ! ». Malheureusement, ton doigt n'était pas chargé : il ne se passe rien !":"and went “BANG!” Unfortunately, your finger wasn't loaded, so nothing happened!"};
  if((m=/^THIS ADVENTURE DOES NOT RECOGNIZE (.*)$/.exec(k))) return {t:fr?`Je ne connais pas le mot « ${mdLow(m[1])} ».`:`This adventure does not recognize “${mdLow(m[1])}”`};
  if(k==="AS A NOUN. IF YOU CAN'T SEE IT, IT'S NOT HERE!") return {t:fr?"Si tu ne vois pas une chose, c'est qu'elle n'est pas ici !":"as a noun. If you can't see it, it's not here!"};
  if((m=/^IT IS ?(\d+):(\d\d)PM$/.exec(k))) return {t:fr?`Il est ${+m[1]===12?12:+m[1]+12} h ${m[2]}.`:`It is ${m[1]}:${m[2]} pm.`};
  if((m=/^SUNSET-7:(\d\d)PM$/.exec(k))) return {t:fr?`Coucher du soleil : 19 h ${m[1]}`:`Sunset: 7:${m[1]} pm`};
  if((m=/^TITLE: (MATH|DICTIONARY|ALMANAC)$/.exec(k))) return {t:fr?'Titre : '+{MATH:'MATHÉMATIQUES',DICTIONARY:'DICTIONNAIRE',ALMANAC:'ALMANACH'}[m[1]]:'Title: '+m[1]};
  if(MD_WORD[k]) return {t:fr?MD_WORD[k]:mdLow(k)};       // le mot tapé, repris seul sur une ligne (TIRER sans pistolet)
  return undefined;
}
function mdSay(text,lang,classic){
  if(classic&&lang==='en') return text;                       // version classique anglaise : l'écran d'origine
  const fr=lang==='fr', out=[];
  // un message suivi d'un « ; » se colle aux tirets et à l'invite : on les sépare
  const parts=text.replace(/([^-\n])(-{32})/g,'$1\n$2').replace(/(-{32})(?=[^-\n])/g,'$1\n').split('\n');
  parts.forEach((l,i)=>{
    const last=i===parts.length-1, nl=last?'':'\n';
    if(last&&l==='') return;
    const lead=/^ */.exec(l)[0], r=mdLine(l,fr,classic);
    if(r===null) return;                                     // version moderne : déjà montré ailleurs
    if(r===undefined){ out.push(l+nl); return; }
    if(classic){ const t=r.kind==='writ'?r.t:r.t.toLocaleUpperCase('fr'); out.push((r.kind==='list'?' ':lead)+t+(l.endsWith(' ')&&!nl?' ':'')+nl); return; }
    out.push(r.t+(nl||'\n'));                              // un PRINT « ; » suivi d'un autre texte : chacun sa ligne
  });
  return out.join('');
}
// version moderne : lignes vides en trop retirées ; les morts et les parties perdues sont repérées pour la fenêtre de fin
function mdClean(s,moved){
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(VERY DEAD|YOU ARE DEAD|YOU HAVE LOST|tu es mort|tu as perdu)/i.test(s)};
}

// ---- français -> commandes du jeu ----
// Le jeu ne lit que les trois premières lettres du verbe et du nom : on lui envoie des mots anglais complets.
const FR=(function(){
  const VERBS={PRENDRE:'GET',PRENDS:'GET',RAMASSER:'GET',RAMASSE:'GET',ATTRAPER:'GET',ATTRAPE:'GET',
    POSER:'DROP',POSE:'DROP',LAISSER:'DROP',LAISSE:'DROP',LACHER:'DROP',LACHE:'DROP',JETER:'DROP',JETTE:'DROP',
    OUVRIR:'OPEN',OUVRE:'OPEN',FERMER:'CLOSE',FERME:'CLOSE',ABAISSER:'CLOSE',ABAISSE:'CLOSE',
    REGARDER:'LOOK',REGARDE:'LOOK',EXAMINER:'EXAMINE',EXAMINE:'EXAMINE',FOUILLER:'EXAMINE',FOUILLE:'EXAMINE',
    TIRER:'SHOOT',TIRE:'SHOOT',ABATTRE:'SHOOT',ABATS:'SHOOT',LIRE:'READ',LIS:'READ',
    INVENTAIRE:'INVENTORY',I:'INVENTORY',INV:'INVENTORY',SECOURS:'HELP',AIDE:'HELP',QUITTER:'QUIT',QUITTE:'QUIT',
    TUER:'SLAY',TUE:'SLAY'};
  const NOUNS={};
  const add=(en,fr)=>fr.split(' ').forEach(w=>{ NOUNS[w]=en; });
  add('WRITING','ECRITURE INSCRIPTION ECRITEAU');add('CROSS','CROIX CRUCIFIX');add('BOX','BOITE CARTON');add('BULLET','BALLE');add('MIRRORS','MIROIRS MIROIR GLACES GLACE');
  add('GUN','PISTOLET REVOLVER ARME');add('TEXT','MANUEL MATHS');add('STAKE','PIEU');add('DESK','SECRETAIRE BUREAU');add('DICTIONARY','DICTIONNAIRE');
  add('CHEST','COFFRE');add('EYE','OEIL TRITON');add('SWITCH','INTERRUPTEUR');add('WORMS','VERS');add('TORCH','TORCHE');add('SULPHUR','SOUFRE');
  add('SKELETONS','SQUELETTES SQUELETTE');add('MAGGOTS','ASTICOTS');add('HANDS','MAINS');add('SACK','SAC');add('DOG','CHIEN');add('WEREWOLF','LOUP GAROU');
  add('LADDER','ECHELLE');add('MALLET','MAILLET MASSE');add('HAMMER','MARTEAU');add('DOOR','PORTE');add('WATCH','MONTRE');add('RAT','RAT');
  add('CORPSES','CADAVRES');add('MONGOOSE','MANGOUSTE');add('TABLE','TABLE');add('NOTE','BILLET MOT');add('PIT','PUITS FOSSE');add('MEAT','VIANDE');
  add('CANDLE','BOUGIE CHANDELLE');add('PORTRAIT','PORTRAIT');add('MAP','CARTE PLAN');add('SNAKE','SERPENT');add('COBWEBS','TOILES ARAIGNEE');
  add('SIGN','PANNEAU PANCARTE');add('CAGE','CAGE');add('TRAPDOOR','TRAPPE');add('TUNNEL','TUNNEL');add('BODIES','CORPS');add('MUD','BOUE');
  add('QUICKSAND','SABLES MOUVANTS');add('CRACK','FISSURE FENTE');add('BATS','CHAUVES SOURIS');add('VATS','CUVES CUVE');add('WOMAN','FEMME');
  add('COFFIN','CERCUEIL');add('VAMPIRE','VAMPIRE');add('ACID','ACIDE');add('POTION','POTION FIOLE');add('SHACKELS','FERS CHAINES');
  add('ALMANAC','ALMANACH');add('BOOKCASE','BIBLIOTHEQUE ETAGERE');add('CHANDALIER','LUSTRE');add('PRINCESS','PRINCESSE MARLENA');add('CASKET','CASSETTE');
  add('KEY','CLE');add('GARLIC','AIL');
  const DIRS={N:'N',NORD:'N',S:'S',SUD:'S',E:'E',EST:'E',O:'W',OUEST:'W',H:'U',HAUT:'U',MONTER:'U',MONTE:'U',B:'D',BAS:'D',DESCENDRE:'D',DESCENDS:'D'};
  const STOP=new Set('LE LA LES L UN UNE DES DU DE D AU AUX A SUR DANS VERS EN AVEC ET MON MA MES CE CET CETTE CES PAR POUR Y'.split(' '));
  const norm=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’`\-]/g,' ').replace(/[^A-Z0-9 ?!]/g,' ').replace(/\s+/g,' ').trim();
  // phrases que le jeu lit en entier (les mots de passe), en français
  const WHOLE={CHIEN:'DOG','TUER VAMPIRE':'SLAY VAMPIRE','TUER LE VAMPIRE':'SLAY VAMPIRE','TUE LE VAMPIRE':'SLAY VAMPIRE','TUE VAMPIRE':'SLAY VAMPIRE'};
  function frToEn(line){
    const n=norm(line); if(!n) return '';
    if(WHOLE[n]) return WHOLE[n];
    let t=n.split(' ');
    if(t.length===1&&DIRS[t[0]]) return DIRS[t[0]];
    if((t[0]==='ALLER'||t[0]==='VA'||t[0]==='VAIS')&&t.length>1){ const d=t.slice(1).find(x=>DIRS[x]); if(d) return DIRS[d]; }
    const verb=VERBS[t[0]]; if(!verb) return n;               // pas du français connu : transmis tel quel (l'anglais marche, YOREL aussi)
    if(verb==='INVENTORY'||verb==='HELP'||verb==='QUIT') return verb;
    const rest=t.slice(1).filter(x=>!STOP.has(x));
    if(verb==='LOOK'&&!rest.length) return 'LOOK';
    let noun=null; for(const x of rest){ if(NOUNS[x]){ noun=NOUNS[x]; break; } }
    if(!noun&&rest.length) noun=rest[rest.length-1];
    return noun?verb+' '+noun:verb;
  }
  const HELP="VERBES : PRENDRE, POSER, OUVRIR, FERMER, REGARDER, EXAMINER, TIRER (SUR), LIRE, INVENTAIRE, SECOURS, QUITTER. UNE LETTRE SEULE DÉPLACE : N, S, E, O, H (HAUT), B (BAS).%LE JEU NE LIT QUE DEUX MOTS : UN VERBE ET UN NOM (PRENDRE LA CAGE, OUVRIR LE COFFRE). QUELQUES PHRASES SE TAPENT EN ENTIER, QUAND LE JEU LES DEMANDE.";
  return {TEXT:{},NOUNS,VERBS,HELP,frToEn};
})();
