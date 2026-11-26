// Stalag — textes du jeu et passage du français au jeu (même principe qu'Eno, des mêmes auteurs).
// Le programme écrit ses lignes (PRINT) en anglais, sur l'écran de 32 colonnes du Dragon. say(ligne, langue, classique)
// rend chaque ligne : en anglais telle quelle dans la version classique, sinon rédigée proprement ; en français dans les
// deux versions. Les clés sont les textes du programme, espaces multiples réduits à un. La version moderne retire ce que
// ses panneaux montrent déjà (objets, sorties, invite). Les fautes de frappe d'origine (FREIND, WILLBLEED, ISETCHED,
// SHEPHARD, LABLE…) sont corrigées dans la version moderne.
const SG_NORM=s=>s.replace(/ +/g,' ').trim();

// ---- les lieux : « YOU ARE » puis A$(F) sur la ligne suivante ----
const SG_DESC={
 "IN BARRACKS #1":["in barracks #1.","dans la baraque nº 1."],
 "IN BARRACKS #2":["in barracks #2.","dans la baraque nº 2."],
 "IN BARRACKS #3":["in barracks #3.","dans la baraque nº 3."],
 "IN AN OPEN AREA":["in an open area.","dans une allée du camp."],
 "IN THE PRISON HOSPITAL":["in the prison hospital.","à l'infirmerie du camp."],
 "IN THE ENLISTED REST AREA":["in the enlisted rest area.","au foyer des soldats."],
 "IN THE SHOWER HUT":["in the shower hut.","dans la baraque des douches."],
 "IN THE OFFICERS REST AREA":["in the officers' rest area.","au foyer des officiers."],
 "IN THE CHOW HALL":["in the chow hall.","au réfectoire."],
 "IN THE VEGETABLE GARDEN":["in the vegetable garden.","dans le potager."],
 "IN THE GUARD BARRACKS":["in the guard barracks.","dans la baraque des gardes."],
 "IN THE EXERCISE AREA":["in the exercise area.","dans la cour d'exercice."],
 "IN THE HOT BOX":["in the hot box.","au mitard."],
 "INSIDE THE PRISON GATE":["inside the prison gate.","devant le portail du camp, côté intérieur."],
 "BENEATH THE SW GUARD TOWER":["beneath the south-west guard tower.","sous le mirador sud-ouest."],
 "BENEATH THE NW GUARD TOWER":["beneath the north-west guard tower.","sous le mirador nord-ouest."],
 "BENEATH THE NE GUARD TOWER":["beneath the north-east guard tower.","sous le mirador nord-est."],
 "BENEATH THE SE GUARD TOWER":["beneath the south-east guard tower.","sous le mirador sud-est."],
 "INSIDE THE NORTH FENCE":["inside the north fence.","le long de la clôture nord."],
 "INSIDE THE EAST FENCE":["inside the east fence.","le long de la clôture est."],
 "INSIDE THE WEST FENCE":["inside the west fence.","le long de la clôture ouest."],
 "IN THE NORTH TUNNEL":["in the north tunnel.","dans le tunnel nord."],
 "IN THE EAST TUNNEL":["in the east tunnel.","dans le tunnel est."],
 "IN THE SOUTH TUNNEL":["in the south tunnel.","dans le tunnel sud."],
 "IN THE TUNNEL ENTRANCEWAY":["in the tunnel entranceway.","à l'entrée du tunnel."],
 "AT THE DOOR TO BARRACKS #3":["at the door to barracks #3.","devant la porte de la baraque nº 3."],
 "IN THE GUARD BARRACKS ATTIC":["in the guard barracks attic.","dans le grenier de la baraque des gardes."],
 "IN A FOREST":["in a forest.","dans une forêt."],
 "IN A VERY DEEP HOLE":["in a very deep hole.","au fond d'un trou très profond."]
};

// ---- les objets : B$(n), y compris les noms qui changent en cours de partie ----
const SG_OBJ={
 "A TABLE":["a table","une table"],
 "A CUP OF COLD COFFEE":["a cup of cold coffee","une tasse de café froid"],
 "A COIN":["a coin","une pièce de monnaie"],
 "A LOCKER":["a locker","un casier"],
 "A LEATHER BELT":["a leather belt","une ceinture en cuir"],
 "MANY BUNKS":["many bunks","de nombreux châlits"],
 "A DESK":["a desk","un bureau"],
 "A DECK OF CARDS":["a deck of cards","un jeu de cartes"],
 "MANY RACKS":["many racks","de nombreux râteliers"],
 "A PAIR OF BOOTS":["a pair of boots","une paire de bottes"],
 "RED CLAY":["red clay","de l'argile rouge"],
 "A WOODEN DOOR":["a wooden door","une porte en bois"],
 "A PADLOCK":["a padlock","un cadenas"],
 "AN UNLOCKED PADLOCK":["an unlocked padlock","un cadenas ouvert"],
 "AN UNLOCKED DOOR":["an unlocked door","une porte déverrouillée"],
 "AN OPEN DOOR":["an open door","une porte ouverte"],
 "8 BEDS":["8 beds","8 lits"],
 "LOOSE TILES":["loose tiles","des carreaux descellés"],
 "LOOSE BOARDS":["loose boards","des planches disjointes"],
 "AN OPENING":["an opening","une ouverture"],
 "A BUCKET":["a bucket","un seau"],
 "A SHOVEL":["a shovel","une pelle"],
 "4 COTS":["4 cots","4 lits de camp"],
 "A PILLOW":["a pillow","un oreiller"],
 "A NOTE":["a note","un billet"],
 "A MEDICINE CABINET":["a medicine cabinet","une armoire à pharmacie"],
 "BANDAGES":["bandages","des bandages"],
 "A BOTTLE OF ALCOHOL":["a bottle of alcohol","une bouteille d'alcool"],
 "AN OPERATING TABLE":["an operating table","une table d'opération"],
 "A PAIR OF SCISSORS":["a pair of scissors","une paire de ciseaux"],
 "A SINK":["a sink","un lavabo"],
 "LOOSE PLUMBING":["loose plumbing","une tuyauterie branlante"],
 "6 SHOWER STALLS":["6 shower stalls","6 cabines de douche"],
 "A DRAIN GRATE":["a drain grate","une grille d'évacuation"],
 "6 TOWEL HOOKS":["6 towel hooks","6 patères"],
 "A LEATHER JACKET":["a leather jacket","un blouson de cuir"],
 "MANY BENCHES":["many benches","de nombreux bancs"],
 "A CANOPENER":["a can opener","un ouvre-boîte"],
 "AN ICEBOX":["an icebox","une glacière"],
 "A STOVE":["a stove","un fourneau"],
 "A PAIR OF WIRECUTTERS":["a pair of wire cutters","une pince coupante"],
 "A PAIR OF BROKEN WIRECUTTERS":["a pair of broken wire cutters","une pince coupante cassée"],
 "A COUNTER":["a counter","un comptoir"],
 "A DRAWER":["a drawer","un tiroir"],
 "A KNIFE":["a knife","un couteau"],
 "A TIN OF HAM":["a tin of ham","une boîte de jambon"],
 "AN OPEN TIN":["an open tin","une boîte ouverte"],
 "RICH BLACK SOIL":["rich black soil","de la bonne terre noire"],
 "A GARDEN HOE":["a garden hoe","une binette"],
 "A PICK AXE":["a pick axe","une pioche"],
 "A WHEELBARROW":["a wheelbarrow","une brouette"],
 "RED DIRT":["red dirt","de la terre rouge"],
 "A LOCKED DOOR":["a locked door","une porte verrouillée"],
 "A COMBINATION LOCK":["a combination lock","un cadenas à combinaison"],
 "AN OPEN LOCK":["an open lock","un cadenas ouvert"],
 "A CHEST":["a chest","un coffre"],
 "A ROPE":["a rope","une corde"],
 "A BOX":["a box","une caisse"],
 "A RADIO":["a radio","une radio"],
 "A DEAD MOUSE":["a dead mouse","une souris morte"],
 "A LADDER":["a ladder","une échelle"],
 "A FOOTBALL":["a football","un ballon de football américain"],
 "A KEY":["a key","une clé"],
 "LEATHER LACING":["leather lacing","un laçage de cuir"],
 "A BASEBALL BAT":["a baseball bat","une batte de base-ball"],
 "A DOG HOUSE":["a dog house","une niche"],
 "A HUGE GERMAN SHEPHARD DOG":["a huge German shepherd dog","un énorme berger allemand"],
 "A NEEDLE":["a needle","une aiguille"],
 "A KEY HOLE":["a keyhole","un trou de serrure"],
 "A PRISON GATE":["a prison gate","le portail du camp"],
 "A FENCE":["a fence","une clôture"],
 "A TOWER":["a tower","un mirador"],
 "A TUNNEL":["a tunnel","un tunnel"],
 "A POWER SWITCH":["a power switch","un interrupteur"],
 "A SIGN":["a sign","un panneau"],
 "A LABEL":["a label","une étiquette"],
 "AN UNCANNED HAM":["a ham out of its tin","un jambon sorti de sa boîte"],
 "A DEPRESSION IN THE GROUND":["a depression in the ground","un creux dans le sol"],
 "A DEEP HOLE":["a deep hole","un trou profond"],
 "A PUDDLE OF BLOOD":["a puddle of blood","une flaque de sang"]
};

// ---- les messages ----
const SG_MSG={
 // écran titre, scénario, vocabulaire : la version moderne a son introduction (retirés, sauf en classique).
 // Le scénario est placé ligne à ligne (PRINT @) : chaque morceau français tient dans la place de l'anglais.
 "<<STALAG>>":null,"CREATORS:":null,"PAUL AUSTIN":null,"AND":null,"LEROY C. SMITH":null,
 "COPYRIGHT 1982 BY PAL CREATIONS":null,"DISTRIBUTED BY DRAGON DATA LTD":null,
 "TURN THE SOUND UP":["Turn the sound up","Monte le son"],
 "YOU ARE ALONE IN A NAZI PRISON":["You are alone in a Nazi prison","Tu es seul dans un camp de"],
 "CAMP. THE YEAR: 1944. THE":["camp. The year: 1944. The","prisonniers nazi, en 1944."],
 "GERMANS MOVED ALL THE PRISONERS":["Germans moved all the prisoners","Les Allemands ont emmené tous"],
 "TO ANOTHER CAMP BECAUSE IT WILL":["to another camp because it will","les prisonniers ailleurs, car"],
 "ONLY BE A MATTER OF HOURS TILL":["only be a matter of hours till","d'ici quelques heures, les"],
 "THE ALLIES BOMB THE CAMP!":["the Allies bomb the camp!","Alliés bombarderont le camp !"],
 "THEY LOCKED THE GATE AND":["They locked the gate and","Ils ont fermé le portail et"],
 "ABANDONED THE CAMP. YOU WERE":["abandoned the camp. You were","abandonné le camp. On t'a"],
 "FORGOTTEN BECAUSE YOU WERE":["forgotten because you were","oublié, car tu étais enfermé"],
 "LOCKED IN THE HOT BOX, WHERE ALL":["locked in the hot box, where all","au mitard, où chaque nouveau"],
 "NEW PRISONERS SPEND THEIR FIRST":["new prisoners spend their first","prisonnier passe sa première"],
 "WEEK, TO REMIND THEM WHY THEY":["week, to remind them why they","semaine, pour qu'il n'ait plus"],
 "SHOULD NOT TRY TO ESCAPE. YOU":["should not try to escape. You","envie de s'évader. Sors d'ici"],
 "HAVE GOT TO GET OUT ALIVE BEFORE":["have got to get out alive before","vivant avant que les bombes"],
 "THE BOMBS HIT!!!":["the bombs hit!!!","ne tombent !!!"],
 "[PRESS ANY KEY]":["[Press any key]","[Appuie sur une touche]"],
 "YOUR VERB VOCABULARY:":["Your verb vocabulary:","Tes verbes :"],
 "GET":["GET","PRENDRE"],"DIG":["DIG","CREUSER"],"CUT":["CUT","COUPER"],"LOOK":["LOOK","REGARDER"],"OPEN":["OPEN","OUVRIR"],
 "PICK":["PICK","CROCHETER"],"PUSH":["PUSH","POUSSER"],"HELP":["HELP","AIDE"],"DROP":["DROP","POSER"],"QUIT":["QUIT","QUITTER"],
 "READ":["READ","LIRE"],"CLOSE":["CLOSE","FERMER"],"EXAMINE":["EXAMINE","EXAMINER"],"INVENTORY":["INVENTORY","INVENTAIRE"],
 // la partie
 "USE SINGLE LETTERS TO INDICATE DIRECTION (EXAMPLE, N=NORTH)":["Use single letters to indicate a direction (for example, N = north).","Une lettre seule suffit pour te déplacer (par exemple, N = nord)."],
 "YOU ARE CARRYING:":["You are carrying:","Tu portes :"],
 "NOTHING":["nothing","rien"],
 "TRY USING TWO WORD COMMANDS.":["Try using two-word commands.","Essaie avec deux mots : un verbe et un nom."],
 "YOU CAN'T GO THAT WAY!":["You can't go that way!","Tu ne peux pas aller par là !"],
 "I DON'T UNDERSTAND WHAT YOU ARE TELLING ME.":["I don't understand what you are telling me.","Je ne comprends pas ce que tu me dis."],
 "..YOU HEAR AIRPLANES OVERHEAD..":["…You hear airplanes overhead…","… Tu entends des avions passer au-dessus du camp…"],
 // le chien et la blessure
 "A DOG JUST RAN OUT OF THE DOG HOUSE AND BIT YOUR LEG. YOU ARE BLEEDING VERY BADLY.":["A dog just ran out of the dog house and bit your leg. You are bleeding very badly.","Un chien vient de jaillir de la niche et t'a mordu à la jambe. Tu saignes abondamment."],
 "YOU BLED TO DEATH":["You bled to death.","Tu as perdu tout ton sang."],
 "YOU ARE STILL BLEEDING. YOU WILLBLEED TO DEATH IF YOU DON'T STOP THE BLEEDING!":["You are still bleeding. You will bleed to death if you don't stop the bleeding!","Tu saignes toujours. Si tu n'arrêtes pas l'hémorragie, tu vas mourir !"],
 "VERY GOOD. YOU STOPPED THE BLEEDING.":["Very good. You stopped the bleeding.","Très bien. Tu as arrêté l'hémorragie."],
 "YOU ARE STILL BLEEDING BUT YOU CAN'T TREAT IT HERE":["You are still bleeding, but you can't treat it here.","Tu saignes toujours, mais tu ne peux pas te soigner ici."],
 // HELP
 "NO MORE HELP FOR YOU, FREIND. FIND YOUR WAY OUT OF HERE OR- DIE!":["No more help for you, friend. Find your way out of here or… die!","Plus d'aide pour toi, mon ami. Trouve la sortie ou… meurs !"],
 "MAYBE HE'S HUNGRY":["Maybe he's hungry.","Il a peut-être faim."],
 "EXAMINE THINGS":["Examine things.","Examine les choses."],
 "LOOK CLOSELY":["Look closely.","Regarde de près."],
 "MAYBE IF YOU OPEN THE LOCK...":["Maybe if you open the lock…","Et si tu ouvrais le cadenas…"],
 "I'M SO CONFUSED!":["I'm so confused!","Je suis perdu !"],
 // GET
 "YOU ALREADY HAVE IT!":["You already have it!","Tu l'as déjà !"],
 "YOU DON'T SEE IT HERE.":["You don't see it here.","Tu ne vois pas ça ici."],
 "YOU DON'T SEE IT HERE":["You don't see it here.","Tu ne vois pas ça ici."],
 "YOU CAN'T CARRY ANYTHING ELSE!":["You can't carry anything else!","Tu ne peux rien porter de plus !"],
 "IT IS BOLTED DOWN,":["It is bolted down,","C'est fixé au sol,"],
 "IT IS BOLTED TO THE WALL,":["It is bolted to the wall,","C'est fixé au mur,"],
 "THEY ARE BOLTED DOWN,":["They are bolted down,","C'est fixé au sol,"],
 "YOU CAN NOT TAKE THEM.":["you can't take them.","tu ne peux pas les emporter."],
 "IT'S TOO HEAVY FOR YOU TO CARRY,":["It's too heavy for you to carry,","C'est trop lourd pour toi,"],
 "IT'S TOO HEAVY FOR YOU TO CARRY,YOU CAN NOT GET IT.":["It's too heavy for you to carry, you can't take it.","C'est trop lourd pour toi, tu ne peux pas l'emporter."],
 "FIRST YOU OPEN, THEN YOU GET!":["First you open, then you get!","D'abord tu ouvres, ensuite tu prends !"],
 "ONE IS WAY TOO HEAVY TO CARRY,":["One is way too heavy to carry,","Un lit est bien trop lourd à porter,"],
 "HOW CAN YOU GET A VOID?":["How can you get a void?","Comment veux-tu prendre un trou ?"],
 "IT'S BUILT IN TO THE DOOR,":["It's built into the door,","Il fait corps avec la porte,"],
 "THEY ARE TOO BULKY FOR YOU TO CARRY. YOU CAN NOT GET THEM.":["They are too bulky for you to carry. You can't get them.","C'est trop encombrant pour toi. Tu ne peux pas les prendre."],
 "THE DOG TOOK IT.":["The dog took it.","Le chien te l'a pris."],
 "YOU CAN'T GET IT OUT FROM THE LACING.":["You can't get it out of the lacing.","Tu n'arrives pas à le sortir du laçage."],
 "THE LACING WILL NOT UNLACE":["The lacing will not unlace.","Le laçage ne se défait pas."],
 "HE DOESN'T LET YOU.":["He doesn't let you.","Il ne se laisse pas faire."],
 "YOU CAN'T GET IT OUT OF THE GROUND":["You can't get it out of the ground.","Tu ne peux pas l'arracher du sol."],
 "HOW ON EARTH DO YOU EXPECT TO CARRY A THIRTY FOOT TOWER????":["How on earth do you expect to carry a thirty-foot tower????","Comment comptes-tu emporter un mirador de dix mètres ????"],
 "THE DIRT CRUMBLES TOO FAST,":["The dirt crumbles too fast,","La terre s'effrite trop vite,"],
 "OK, YOU GOT THEM":["OK, you got them.","Ça y est, tu les as."],
 "THE DOG WON'T GIVE IT UP!!":["The dog won't give it up!!","Le chien ne le lâchera pas !!"],
 "OK, YOU HAVE IT... YOU SEE AN OPENING!!!":["OK, you have them… You see an opening!!!","Ça y est, tu les as… Tu vois une ouverture !!!"],
 "YOU CAN NOT GET IT.":["you can't take it.","tu ne peux pas l'emporter."],
 "OK, YOU HAVE IT":["OK, you have it.","Ça y est, tu l'as."],
 // DIG
 "YOU CAN'T DIG ANYTHING NOT IN THE SAME ROOM WITH YOU.":["You can't dig anything that isn't here with you.","Tu ne peux pas creuser ce qui n'est pas là."],
 "YOU DON'T HAVE ENOUGH TOOLS.":["You don't have enough tools.","Tu n'as pas assez d'outils."],
 "YOU DUG FOR A LONG TIME. NOW":["You dug for a long time. Now","Tu as creusé longtemps. Maintenant,"],
 "YOU SEE A LIGHT ABOVE":["you see a light above.","tu vois de la lumière au-dessus de toi."],
 "YOU DUG FOR A LONG TIME NOW, ANDYOU SEE A LIGHT ABOVE":["You dug for a long time, and now you see a light above.","Tu as creusé longtemps, et tu vois enfin de la lumière au-dessus de toi."],
 "OK, YOU DUG A HOLE":["OK, you dug a hole.","Voilà, tu as creusé un trou."],
 "YOU DUG, AND THE HOLE IS DEEPER":["You dug, and the hole is deeper.","Tu creuses, le trou est plus profond."],
 "YOU BETTER STOP AND LOOK":["You'd better stop and look.","Tu ferais bien de t'arrêter et de regarder."],
 "YOU DUG SO DEEP THAT YOU FELL INTO THE HOLE. THE WALLS ARE TOO STEEP TO CLIMB: YOU ARE TRAPPED AT THE BOTTOM OF YOUR OWN GRAVE.":["You dug so deep that you fell into the hole. The walls are too steep to climb: you are trapped at the bottom of your own grave.","Tu as creusé si profond que tu es tombé dans le trou. Les parois sont trop raides pour remonter : te voilà pris au fond de ta propre tombe."],
 "YOU JUST DUG A VERY DEEP GRAVE. YOU HAVE NO WAY TO GET OUT!!!!":["You just dug a very deep grave. You have no way to get out!!!!","Tu viens de creuser ta propre tombe, très profonde. Tu ne peux plus en sortir !!!!"],
 "YOU DUG UNTIL YOUR FINGERS ARE RAW. YOU CAN'T DIG ANY MORE. YOUMADE IT DOWN 3 1/4 INCHES":["You dug until your fingers were raw. You can't dig any more. You made it down 3 1/4 inches.","Tu as gratté jusqu'à t'en écorcher les doigts. Tu n'en peux plus. Tu es descendu de 8 centimètres."],
 "YOU CAN NOT DIG THAT":["You can't dig that.","Tu ne peux pas creuser ça."],
 // CUT
 "THE KNIFE IS TOO DULL":["The knife is too dull.","Le couteau est trop émoussé."],
 "OK, YOU CUT IT.":["OK, you cut it.","Voilà, c'est coupé."],
 "OK, YOU CUT IT":["OK, you cut it.","Voilà, c'est coupé."],
 "IT'S ALREADY CUT, DUMMY!":["It's already cut, dummy!","C'est déjà coupé, banane !"],
 "CUT THE GATE WITH WHAT?":["Cut the gate with what?","Couper le portail avec quoi ?"],
 "CUT THE FENCE WITH WHAT?":["Cut the fence with what?","Couper la clôture avec quoi ?"],
 "THE WIRECUTTERS JUST BROKE":["The wire cutters just broke.","La pince coupante vient de casser."],
 "CUT IT WITH WHAT?":["Cut it with what?","Couper avec quoi ?"],
 "YOU FOUND SOMETHING":["You found something.","Tu as trouvé quelque chose."],
 "YOU CAN'T CUT TIN WITH SCISSORS":["You can't cut tin with scissors.","On ne coupe pas du fer-blanc avec des ciseaux."],
 // OPEN
 "YOU CAN'T OPEN ANYTHING THAT YOU CAN'T SEE OR DON'T HAVE.":["You can't open anything that you can't see or don't have.","Tu ne peux pas ouvrir ce que tu ne vois pas ou que tu n'as pas."],
 "OK, IT IS OPEN":["OK, it is open.","Voilà, c'est ouvert."],
 "YOU NEED A CANOPENER":["You need a can opener.","Il te faut un ouvre-boîte."],
 "YOU OPENED IT":["You opened it.","Tu l'as ouverte."],
 "IT IS OPEN, AND YOU FOUND A TOOL":["It is open, and you found a tool.","C'est ouvert, et tu as trouvé un outil."],
 "YOU'VE FOUND SOMETHING!":["You've found something!","Tu as trouvé quelque chose !"],
 "WHO DO YOU THINK YOU ARE, ALI BABA? THERE IS A LOCK HERE!":["Who do you think you are, Ali Baba? There is a lock here!","Tu te prends pour Ali Baba ? Il y a un cadenas !"],
 "OK, IT'S OPEN":["OK, it's open.","Voilà, c'est ouvert."],
 "THE LOCK DID NOT OPEN":["The lock did not open.","Le cadenas ne s'ouvre pas."],
 "THE TUMBLERS CLICKED":["The tumblers clicked.","Les gorges du cadenas cliquettent."],
 "THE CHEST IS OPEN":["The chest is open.","Le coffre est ouvert."],
 "YOU CAN NOT OPEN IT":["You can't open it.","Tu ne peux pas l'ouvrir."],
 "YOU CAN'T OPEN A FENCE!":["You can't open a fence!","On n'ouvre pas une clôture !"],
 "IT UNLOCKED!":["It unlocked!","Il s'ouvre !"],
 "YOU NEED A KEY FOR THIS ONE!":["You need a key for this one!","Il te faut une clé pour celui-là !"],
 "HOW CAN YOU OPEN A DOOR WITH A LOCKED PADLOCK ON IT?":["How can you open a door with a locked padlock on it?","Comment ouvrir une porte fermée par un cadenas ?"],
 "YOU TRIED, BUT IT DOESN'T OPEN.":["You tried, but it doesn't open.","Tu essaies, mais ça ne s'ouvre pas."],
 "COMBINATION?":["Combination?","Combinaison ?"],
 "COMBINATION??":["Combination?","Combinaison ?"],
 // EXAMINE
 "YOU CAN'T EXAMINE SOMETHING NOT IN THE SAME ROOM WITH YOU.":["You can't examine something that isn't here with you.","Tu ne peux pas examiner ce qui n'est pas là."],
 "THERE IS A CUP OF COLD COFFEE":["There is a cup of cold coffee.","Il y a une tasse de café froid."],
 "THERE IS A COIN IN IT":["There is a coin in it.","Il y a une pièce de monnaie dedans."],
 "'KILROY WAS HERE'":["“Kilroy was here”","« Kilroy est passé par là »"],
 "THERE IS A LEATHER BELT IN IT.":["There is a leather belt in it.","Il y a une ceinture en cuir dedans."],
 "SIZE 48, STENCILED 'SCHULTZ'":["Size 48, stencilled “Schultz”.","Taille 48, marquée « Schultz » au pochoir."],
 "YOU FOUND A SHOVEL!":["You found a shovel!","Tu as trouvé une pelle !"],
 "THEY SAG SLIGHTLY":["They sag slightly.","Ils s'affaissent un peu."],
 "YOU FOUND A DECK OF CARDS":["You found a deck of cards.","Tu as trouvé un jeu de cartes."],
 "CLEAN":["Clean.","Propre."],
 "THE 3 OF SPADES HAS AN -X-":["The 3 of spades has an X on it.","Le 3 de pique porte un X."],
 "THEY HAVE NO MATTRESSES":["They have no mattresses.","Ils n'ont pas de matelas."],
 "YOU SEE RED CLAY ON THEM":["You see red clay on them.","Tu y vois de l'argile rouge."],
 "IT IS RED AND WET":["It is red and wet.","C'est rouge et humide."],
 "IT IS UNLOCKED AND OPEN":["It is unlocked and open.","Elle est déverrouillée et ouverte."],
 "IT IS LOCKED WITH A PADLOCK. IT HAS 'OFFICERS' PAINTED ON IT":["It is locked with a padlock. It has “OFFICERS” painted on it.","Elle est fermée par un cadenas. On y a peint « OFFICIERS »."],
 "IT IS LOCKED AND RUSTY":["It is locked and rusty.","Il est fermé et rouillé."],
 "IT IS UNLOCKED":["It is unlocked.","Il est ouvert."],
 "ONE OF THEM IS CHIPPED":["One of them is chipped.","L'un d'eux est ébréché."],
 "THEY ARE WELL-WORN":["They are well-worn.","Elles sont bien usées."],
 "IT LEADS DOWNWARD":["It leads downward.","Elle descend sous terre."],
 "EMPTY(NOW)":["Empty (now).","Vide (maintenant)."],
 "IT IS A SPADE-TYPE SHOVEL":["It is a spade-type shovel.","C'est une pelle-bêche."],
 "4 FOLDING CANVAS COTS WITH A PILLOW ON ONE":["4 folding canvas cots, with a pillow on one.","4 lits de camp pliants en toile, un oreiller sur l'un d'eux."],
 "4 FOLDING CANVAS COTS":["4 folding canvas cots.","4 lits de camp pliants en toile."],
 "IT LOOKS LIKE IT HAS BEEN RE- SEWN RECENTLY":["It looks like it has been re-sewn recently.","On dirait qu'il a été recousu récemment."],
 "THERE IS A NOTE INSIDE":["There is a note inside.","Il y a un billet dedans."],
 "IT HAS BEEN CUT OPEN":["It has been cut open.","Il a été ouvert au couteau."],
 "'E' X 'N' X 'N'":["“E” X “N” X “N”","« E » X « N » X « N »"],
 "YOU FOUND BANDAGES AND A BOTTLE":["You found bandages and a bottle.","Tu as trouvé des bandages et une bouteille."],
 "EMPTY":["Empty.","Vide."],
 "25 FEET LONG":["25 feet long.","Sept mètres cinquante de long."],
 "LABLE:'SHICKELGRUBERS ALCOHOL'":["Label: “Schicklgruber's Alcohol”","Étiquette : « Alcool Schicklgruber »"],
 "6 FEET LONG WITH A PAIR OF SCISSORS ON IT":["6 feet long, with a pair of scissors on it.","Deux mètres de long, avec une paire de ciseaux dessus."],
 "6 FEET LONG":["6 feet long.","Deux mètres de long."],
 "THEY ARE SHARP":["They are sharp.","Ils sont bien aiguisés."],
 "IT HAS LOOSE PLUMBING":["It has loose plumbing.","Sa tuyauterie branle."],
 "IT LEAKS":["It leaks.","Elle fuit."],
 "THEY LEAK":["They leak.","Elles fuient."],
 "THERE IS A DRAIN GRATE IN THE MIDDLE OF THEM":["There is a drain grate in the middle of them.","Il y a une grille d'évacuation au milieu."],
 "'MADE IN MUNICH'":["“Made in Munich”","« Fabriqué à Munich »"],
 "YOU FOUND A LEATHER JACKET":["You found a leather jacket.","Tu as trouvé un blouson de cuir."],
 "THE HOOKS ARE EMPTY":["The hooks are empty.","Les patères sont vides."],
 "IT SAYS: HOGAN, COL., SER# C660723":["It says: Hogan, Col., ser. no. C660723","On y lit : Hogan, colonel, matricule C660723"],
 "THEY ARE RED":["They are red.","Ils sont rouges."],
 "MANUAL":["Manual.","Manuel."],
 "THERE IS A TIN OF HAM INSIDE":["There is a tin of ham inside.","Il y a une boîte de jambon dedans."],
 "COOL":["Cool.","Fraîche."],
 "IT RATTLES":["It rattles.","Ça cliquette à l'intérieur."],
 "BLACK":["Black.","Noir."],
 "VERY VERY OLD":["Very, very old.","Très, très vieille."],
 "THERE IS A DRAWER UNDERNEATH":["There is a drawer underneath.","Il y a un tiroir dessous."],
 "DIRTY":["Dirty.","Sale."],
 "THERE IS A KNIFE IN IT":["There is a knife in it.","Il y a un couteau dedans."],
 "FALLING APART":["Falling apart.","Il tombe en morceaux."],
 "VERY DULL":["Very dull.","Très émoussé."],
 "IT IS SEALED":["It is sealed.","Elle est scellée."],
 "IT IS OPEN":["It is open.","C'est ouvert."],
 "GOOD FOR GROWING VEGETABLES":["Good for growing vegetables.","Idéale pour les légumes."],
 "WEATHER-WORN":["Weather-worn.","Usée par les intempéries."],
 "IT IS VERY SHINY":["It is very shiny.","Elle brille."],
 "FILLED WITH RED DIRT":["Filled with red dirt.","Pleine de terre rouge."],
 "IT IS DRY":["It is dry.","Elle est sèche."],
 "IT'S SECURED WITH A COMBINATION LOCK AND IT HAS A SIGN ON IT":["It's secured with a combination lock, and it has a sign on it.","Elle est fermée par un cadenas à combinaison, et un panneau y est accroché."],
 "THE DOOR IS OPEN":["The door is open.","La porte est ouverte."],
 "THE PHRASE '6 NUMBERS NEEDED' ISETCHED ON THE BACK":["The phrase “6 numbers needed” is etched on the back.","« 6 chiffres » est gravé au dos."],
 "THERE IS A ROPE INSIDE":["There is a rope inside.","Il y a une corde dedans."],
 "THE CHEST IS EMPTY":["The chest is empty.","Le coffre est vide."],
 "IT IS 20 FEET LONG":["It is 20 feet long.","Elle fait six mètres de long."],
 "THERE IS A RADIO INSIDE. IT IS PLUGGED IN. THERE IS A DEAD MOUSE BESIDE IT.":["There is a radio inside. It is plugged in. There is a dead mouse beside it.","Il y a une radio dedans, branchée. À côté, une souris morte."],
 "IT IS HOT":["It is hot.","Elle est brûlante."],
 "IT IS SINGED":["It is singed.","Elle est roussie."],
 "IT LEADS UPWARDS":["It leads upwards.","Elle monte vers le grenier."],
 "IT HAS LEATHER LACING":["It has leather lacing.","Il est lacé de cuir."],
 "IT HAS CUT LEATHER LACING":["Its leather lacing has been cut.","Son laçage de cuir est coupé."],
 "IT IS WOVEN IN THE LACING":["It is woven into the lacing.","Elle est prise dans le laçage."],
 "IT IS LOOSE":["It is loose.","Elle est libre."],
 "THERE IS SOMETHING HARD WOVEN INTO THE LACING":["There is something hard woven into the lacing.","Quelque chose de dur est pris dans le laçage."],
 "IT HAS BEEN CUT":["It has been cut.","Il a été coupé."],
 "<<LOUISVILLE SLUGGER>>":["“Louisville Slugger”","« Louisville Slugger »"],
 "THERE IS A GERMAN SHEPHERD INSIDE":["There is a German shepherd inside.","Il y a un berger allemand dedans."],
 "HE APPEARS RABID. HE IS FROTHINGAT THE MOUTH AND IS GROWLING":["He appears rabid. He is frothing at the mouth and growling.","Il a l'air enragé. Il a l'écume aux lèvres et il grogne."],
 "A LONG SEWING NEEDLE":["A long sewing needle.","Une longue aiguille à coudre."],
 "YOU SEE DAYLIGHT THROUGH IT":["You see daylight through it.","Tu vois le jour au travers."],
 "CLOSED. YOU CAN NOT OPEN IT FROMTHE INSIDE":["Closed. You can't open it from the inside.","Fermé. Il ne s'ouvre pas de l'intérieur."],
 "VERY STRONG":["Very strong.","Très solide."],
 "THIRTY FEET HIGH":["Thirty feet high.","Dix mètres de haut."],
 "IT STOPS HERE":["It stops here.","Il s'arrête là."],
 "THERE IS A LABEL ON IT":["There is a label on it.","Il porte une étiquette."],
 "YOU SHOULD READ IT":["You should read it.","Tu devrais le lire."],
 "JUICY":["Juicy.","Juteux."],
 "IT LOOKS SOFT HERE":["It looks soft here.","La terre a l'air meuble ici."],
 "IT IS VERY DEEP":["It is very deep.","Il est très profond."],
 "NOTHING SPECIAL ABOUT IT.":["Nothing special about it.","Rien de particulier."],
 // PUSH
 "YOU PUSHED REAL HARD, AND ONE OFTHE BEDS FINALLY MOVED":["You pushed real hard, and one of the beds finally moved.","Tu pousses de toutes tes forces, et l'un des lits finit par bouger."],
 "YOU PUSHED IT, AND IT MOVED":["You pushed it, and it moved.","Tu appuies dessus, et il bascule."],
 "OK, YOU PUSHED THE FENCE. IT SPRANG BACK.":["OK, you pushed the fence. It sprang back.","Tu pousses la clôture. Elle revient en place."],
 "OK, YOU PUSHED THE GATE. IT DID NOT OPEN":["OK, you pushed the gate. It did not open.","Tu pousses le portail. Il ne s'ouvre pas."],
 "YOU PUSHED IT, BUT NOTHING HAPPENED.":["You pushed it, but nothing happened.","Tu pousses, mais il ne se passe rien."],
 "YOU PUSHED THEM, BUT NOTHING HAPPENED.":["You pushed them, but nothing happened.","Tu pousses, mais il ne se passe rien."],
 // READ
 "NOTHING LIKE THAT AROUND HERE THAT YOU CAN READ.":["Nothing like that around here that you can read.","Rien de tel à lire par ici."],
 "ZE GATEN-ZE ONDER UDDERSIDENSKY":["“Ze gaten-ze onder uddersidensky”","« Ze portailen ist de l'autre côtenstein »"],
 "ELECTRIC FENCE POWER":["Electric fence power","Courant de la clôture électrique"],
 "-E- -X- -N- -X- -N-'":["-E- -X- -N- -X- -N-","-E- -X- -N- -X- -N-"],
 "YOU READ NOTHING INTERESTING.":["You read nothing interesting.","Rien d'intéressant à lire."],
 // CLOSE
 "YOU DON'T SEE ANYTHING LIKE THATAROUND HERE.":["You don't see anything like that around here.","Tu ne vois rien de tel par ici."],
 "OK, IT IS CLOSED":["OK, it is closed.","Voilà, c'est fermé."],
 "OK, IT IS LOCKED AGAIN":["OK, it is locked again.","Voilà, il est refermé."],
 "OK, IT'S CLOSED":["OK, it's closed.","Voilà, c'est fermé."],
 "OK, IT'S LOCKED AGAIN":["OK, it's locked again.","Voilà, il est refermé."],
 "IT'S ALREADY CLOSED":["It's already closed.","C'est déjà fermé."],
 "CLOSE THE DOOR FIRST.":["Close the door first.","Ferme d'abord la porte."],
 "YOU TRIED, BUT IT DOESN'T CLOSE":["You tried, but it doesn't close.","Tu essaies, mais ça ne se ferme pas."],
 // DROP
 "OK, YOU DROPPED IT.":["OK, you dropped it.","C'est posé."],
 "YOU DON'T HAVE IT!":["You don't have it!","Tu ne l'as pas !"],
 "THE DOG GRABBED THE HAM AND IS NOW EATING IT QUIETLY IN A CORNER":["The dog grabbed the ham and is now eating it quietly in a corner.","Le chien s'est jeté sur le jambon et le mange tranquillement dans un coin."],
 // PICK
 "YOU CAN'T PICK IT IF YOU CAN'T SEE IT OR DON'T HAVE IT":["You can't pick it if you can't see it or don't have it.","Tu ne peux pas crocheter ce que tu ne vois pas ou que tu n'as pas."],
 "-CLICK-":["-Click-","-Clic-"],
 "YOU JUST FOUND OUT YOU DON'T KNOW HOW TO PICK A U.S. LOCK.":["You just found out you don't know how to pick an American lock.","Tu découvres que tu ne sais pas crocheter une serrure américaine."],
 "HOW DO YOU PLAN TO PICK A COMBINATION LOCK?":["How do you plan to pick a combination lock?","Comment comptes-tu crocheter un cadenas à combinaison ?"],
 "SORRY, YOU CAN'T PICK THAT":["Sorry, you can't pick that.","Désolé, ça ne se crochète pas."],
 // les fins
 "!!!!!!!!!!!!!!ZAP!!!!!!!!!!!!!!":["!!!!!!!!!!!!!! ZAP !!!!!!!!!!!!!!","!!!!!!!!!!!!!! ZAP !!!!!!!!!!!!!!"],
 "DON'T WORRY ABOUT THE BOMBS NOW,YOU JUST FRIED ON THE FENCE!!!!!":["Don't worry about the bombs now, you just fried on the fence!!!!!","Plus la peine de t'inquiéter des bombes : tu viens de griller sur la clôture !!!!!"],
 "YOU JUST DIED FROM TOO MUCH RADIO ELECTRICITY!!!!!!!!!!!!!!!DON'T WORRY ABOUT THE BOMBS NOW!":["You just died from too much radio electricity!!!!!!!!!!!!!!! Don't worry about the bombs now!","Tu viens de mourir électrocuté par la radio !!!!!!!!!!!!!!! Plus la peine de t'inquiéter des bombes !"],
 "YOU DUG FOR ABOUT 30 SECONDS ANDTHE TUNNEL COLLAPSED ON TOP OF YOU. YOU HAVE NO AIR------":["You dug for about 30 seconds and the tunnel collapsed on top of you. You have no air------","Tu as creusé une trentaine de secondes, et le tunnel s'est effondré sur toi. Tu n'as plus d'air------"],
 "AND NOW HAVE NO LIFE.":["and now no life.","et maintenant, plus de vie."],
 "THE ALLIED BOMBS HIT THE CAMP. YOU DIDN'T GET OUT IN TIME!":["The Allied bombs hit the camp. You didn't get out in time!","Les bombes alliées s'abattent sur le camp. Tu n'es pas sorti à temps !"],
 "THE FOREST. CONGRATULATIONS!!!YOU MADE IT IN TIME! JUST ONE QUESTION- HOW ARE YOU GOING TO EVADE THE NAZIS AND ESCAPE GERMANY ALIVE??.":
  ["The forest. Congratulations!!! You made it in time! Just one question: how are you going to evade the Nazis and escape Germany alive??",
   "La forêt. Félicitations !!! Tu es sorti à temps ! Une seule question : comment vas-tu échapper aux nazis et quitter l'Allemagne vivant ??"],
 "[PRESS <Y> TO TRY AGAIN]":["[Press <Y> to try again]","[Appuie sur <O> pour rejouer]"],
 "OK, SEE YOU LATER.":["OK, see you later.","D'accord, à plus tard."]
};
const SG_DIR={NORTH:'NORD',SOUTH:'SUD',EAST:'EST',WEST:'OUEST',UP:'HAUT',DOWN:'BAS'};
// lignes qui ne servent qu'à la version classique : la version moderne a son introduction et ses panneaux
const SG_SCREEN_ONLY=new Set(['TURN THE SOUND UP','YOU ARE ALONE IN A NAZI PRISON','CAMP. THE YEAR: 1944. THE','GERMANS MOVED ALL THE PRISONERS','TO ANOTHER CAMP BECAUSE IT WILL',
 'ONLY BE A MATTER OF HOURS TILL','THE ALLIES BOMB THE CAMP!','THEY LOCKED THE GATE AND','ABANDONED THE CAMP. YOU WERE','FORGOTTEN BECAUSE YOU WERE','LOCKED IN THE HOT BOX, WHERE ALL',
 'NEW PRISONERS SPEND THEIR FIRST','WEEK, TO REMIND THEM WHY THEY','SHOULD NOT TRY TO ESCAPE. YOU','HAVE GOT TO GET OUT ALIVE BEFORE','THE BOMBS HIT!!!','[PRESS ANY KEY]','YOUR VERB VOCABULARY:',
 'GET','DIG','CUT','LOOK','OPEN','PICK','PUSH','HELP','DROP','QUIT','READ','CLOSE','EXAMINE','INVENTORY','[PRESS <Y> TO TRY AGAIN]','OK, SEE YOU LATER.']);
const sgCap=s=>s.charAt(0).toUpperCase()+s.slice(1);
// Traduit une ligne du programme. Rend undefined si elle est inconnue (gardée telle quelle), null si la version moderne
// doit la retirer, sinon {t, kind} ; kind 'list' : objet d'une liste.
function sgLine(l,fr,classic){
  const k=SG_NORM(l).replace(/"$/,''), pick=a=>fr?a[1]:a[0];   // le texte de la victoire finit par un guillemet égaré
  if(!k) return undefined;
  if(!classic&&SG_SCREEN_ONLY.has(k)) return null;
  // Les messages en deux lignes (deux PRINT) arrivent parfois séparément : chaque moitié se traduit seule.
  if(k==="SORRY, I JUST DON'T KNOW HOW TO") return classic?{t:fr?'JE NE SAIS PAS FAIRE :':k}:{t:fr?'Désolé, je ne sais pas faire ça.':"Sorry, I just don't know how to do that."};
  if(k==="SORRY, I JUST DON'T SEE ANY"||k==="SORRY, YOU JUST DON'T SEE ANY") return classic?{t:fr?'TU NE VOIS PAS DE :':k}:{t:fr?'Désolé, tu ne vois pas ça ici.':"Sorry, you don't see that here."};
  if(Object.prototype.hasOwnProperty.call(SG_MSG,k)) return SG_MSG[k]===null?(classic?undefined:null):{t:pick(SG_MSG[k])};
  if(/^={32}/.test(k)) return classic?undefined:null;
  let m2;
  if((m2=/^(.+) (ANYTHING|HERE)\.$/.exec(k))) return classic?{t:fr?'« '+m2[1]+' »'+(m2[2]==='HERE'?' ICI.':'.'):k}:null;
  if(/^z+$/.test(k)) return classic?undefined:null;            // l'écran rempli de « z » de l'électrocution
  if(/^WHAT SHOULD YOU DO\??$/.test(k)) return classic?{t:fr?'QUE FAIS-TU ?':'WHAT SHOULD YOU DO?'}:null;
  // « YOU ARE » et le lieu sont deux PRINT : la version moderne en fait une phrase sur la ligne du lieu
  if(k==='YOU ARE') return classic?{t:fr?'TU ES':'YOU ARE'}:null;
  if(SG_DESC[k]) return classic?{t:pick(SG_DESC[k]).replace(/\.$/,'')}:{t:(fr?'Tu es ':'You are ')+pick(SG_DESC[k])};
  if(k==='YOU CAN SEE:') return classic?{t:fr?'TU VOIS :':'You can see:'}:null;
  if(k==='YOU CAN GO:') return classic?{t:fr?'TU PEUX ALLER :':'You can go:'}:null;
  if(k==='NOTHING IMPORTANT') return classic?{t:fr?'RIEN D\'IMPORTANT':'nothing important',kind:'list'}:null;
  if(/^(\*(NORTH|SOUTH|EAST|WEST|UP|DOWN) ?)+$/.test(k)) return classic?{t:fr?k.replace(/\*(\w+)/g,(_,d)=>'*'+SG_DIR[d]):k}:null;
  if(SG_OBJ[k]) return /^ /.test(l)?(classic?{t:pick(SG_OBJ[k]),kind:'list'}:null):{t:sgCap(pick(SG_OBJ[k]))};   // « YOU CAN SEE » (décalé) ou inventaire
  return undefined;
}
// Le jeu écrit « YOU ARE » puis le lieu sur la ligne suivante, et répète le mot tapé sur la ligne suivante
// (« SORRY, I JUST DON'T SEE ANY » puis « <mot> HERE. ») : on en fait une seule phrase.
function sgSay(text,lang,classic){
  if(classic&&lang==='en') return text;                       // version classique anglaise : l'écran d'origine
  const fr=lang==='fr', out=[];
  const parts=text.replace(/([^=\n])(={32})/g,'$1\n$2').replace(/(={32})(?=[^=\n])/g,'$1\n').replace(/(z{20,})(?=[^z\n])/g,'$1\n')
    .replace(/([^\n])(\[PRESS <Y> TO TRY AGAIN\])/g,'$1\n$2')
    .replace(/,\n?(YOU CAN NOT (GET IT|TAKE THEM)\.)/g,',\n$1').split('\n');
  for(let i=0;i<parts.length;i++){
    const l=parts[i], last=i===parts.length-1, nl=last?'':'\n';
    if(last&&l==='') continue;
    const k=SG_NORM(l), next=SG_NORM(parts[i+1]||'');
    let m;
    if(k==='YOU ARE'&&SG_DESC[next]){ const s=(fr?'Tu es ':'You are ')+(fr?SG_DESC[next][1]:SG_DESC[next][0]);
      out.push((classic?s.toLocaleUpperCase('fr'):s)+'\n'); i++; continue; }
    if(k==="SORRY, I JUST DON'T KNOW HOW TO"&&(m=/^(.*) ANYTHING\.$/.exec(next))){
      const s=fr?`Désolé, je ne sais pas faire « ${m[1].toLowerCase()} ».`:`Sorry, I just don't know how to ${m[1].toLowerCase()} anything.`;
      out.push((classic?s.toLocaleUpperCase('fr'):s)+'\n'); i++; continue; }
    if(k==="SORRY, I JUST DON'T SEE ANY"&&(m=/^(.*) HERE\.$/.exec(next))){
      const s=fr?`Désolé, je ne vois pas de « ${m[1].toLowerCase()} » ici.`:`Sorry, I just don't see any ${m[1].toLowerCase()} here.`;
      out.push((classic?s.toLocaleUpperCase('fr'):s)+'\n'); i++; continue; }
    // « IT IS BOLTED DOWN, » puis « YOU CAN NOT GET IT. » : une seule phrase dans la version moderne
    if(!classic&&/,$/.test(k)&&/^YOU CAN NOT (GET IT|TAKE THEM)\.$/.test(next)){ const a=sgLine(l,fr,false), b=sgLine(parts[i+1],fr,false);
      if(a&&b){ out.push(a.t+' '+b.t+'\n'); i++; continue; } }
    const lead=/^ */.exec(l)[0], r=sgLine(l,fr,classic);
    if(r===null) continue;                                    // version moderne : déjà montré ailleurs
    if(r===undefined){ out.push(l+nl); continue; }
    if(classic){ out.push((r.kind==='list'?'  ':lead)+r.t.toLocaleUpperCase('fr')+(l.endsWith(' ')&&!nl?' ':'')+nl); continue; }
    out.push(r.t+(nl||'\n'));
  }
  return out.join('');
}
// version moderne : lignes vides en trop retirées ; les morts sont repérées pour la fenêtre de fin
function sgClean(s,moved){
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(BLED TO DEATH|VERY DEEP GRAVE|YOUR OWN GRAVE|FRIED ON THE FENCE|RADIO ELECTRICITY|NO LIFE|BOMBS HIT THE CAMP|tout ton sang|ta propre tombe|griller sur la clôture|électrocuté par la radio|plus de vie|pas sorti à temps)/i.test(s)};
}

// ---- français -> commandes du jeu ----
// Le jeu ne lit que les trois premières lettres du verbe et du nom : on lui envoie des mots anglais complets.
const FR=(function(){
  const VERBS={PRENDRE:'GET',PRENDS:'GET',RAMASSER:'GET',RAMASSE:'GET',ATTRAPER:'GET',ATTRAPE:'GET',SOULEVER:'GET',SOULEVE:'GET',RETIRER:'GET',RETIRE:'GET',ENLEVER:'GET',ENLEVE:'GET',
    POSER:'DROP',POSE:'DROP',LAISSER:'DROP',LAISSE:'DROP',LACHER:'DROP',LACHE:'DROP',JETER:'DROP',JETTE:'DROP',DONNER:'DROP',DONNE:'DROP',LANCER:'DROP',LANCE:'DROP',
    CREUSER:'DIG',CREUSE:'DIG',COUPER:'CUT',COUPE:'CUT',DECOUPER:'CUT',DECOUPE:'CUT',TRANCHER:'CUT',TRANCHE:'CUT',
    OUVRIR:'OPEN',OUVRE:'OPEN',DEVERROUILLER:'OPEN',DEVERROUILLE:'OPEN',FERMER:'CLOSE',FERME:'CLOSE',VERROUILLER:'CLOSE',VERROUILLE:'CLOSE',
    CROCHETER:'PICK',CROCHETE:'PICK',CROCHETTE:'PICK',
    REGARDER:'LOOK',REGARDE:'LOOK',EXAMINER:'EXAMINE',EXAMINE:'EXAMINE',FOUILLER:'EXAMINE',FOUILLE:'EXAMINE',OBSERVER:'EXAMINE',OBSERVE:'EXAMINE',
    POUSSER:'PUSH',POUSSE:'PUSH',DEPLACER:'PUSH',DEPLACE:'PUSH',BOUGER:'PUSH',BOUGE:'PUSH',APPUYER:'PUSH',APPUIE:'PUSH',ACTIONNER:'PUSH',ACTIONNE:'PUSH',BASCULER:'PUSH',BASCULE:'PUSH',
    LIRE:'READ',LIS:'READ',
    INVENTAIRE:'INVENTORY',I:'INVENTORY',INV:'INVENTORY',AIDE:'HELP',QUITTER:'QUIT',QUITTE:'QUIT',FIN:'END'};
  const NOUNS={};
  const add=(en,fr)=>fr.split(' ').forEach(w=>{ NOUNS[w]=en; });
  add('TABLE','TABLE');add('CUP','TASSE CAFE');add('COIN','PIECE MONNAIE');add('LOCKER','CASIER');add('BELT','CEINTURE');
  add('BUNKS','CHALITS CHALIT COUCHETTES COUCHETTE SUPERPOSES');add('DESK','BUREAU');add('CARDS','CARTES CARTE');add('RACKS','RATELIERS RATELIER');
  add('BOOTS','BOTTES BOTTE');add('CLAY','ARGILE GLAISE');add('DOOR','PORTE PORTES');add('PADLOCK','CADENAS');add('BEDS','LITS LIT');
  add('TILES','CARREAUX CARREAU CARRELAGE DALLES DALLE');add('BOARDS','PLANCHES PLANCHE LATTES');add('OPENING','OUVERTURE PASSAGE');
  add('BUCKET','SEAU');add('SHOVEL','PELLE');add('PILLOW','OREILLER');add('NOTE','BILLET NOTE MESSAGE PAPIER MOT');
  add('CABINET','ARMOIRE PHARMACIE');add('BANDAGES','BANDAGES BANDAGE PANSEMENTS PANSEMENT BANDES');add('BOTTLE','BOUTEILLE ALCOOL');
  add('SCISSORS','CISEAUX');add('SINK','LAVABO EVIER');add('PLUMBING','TUYAUTERIE TUYAUX TUYAU PLOMBERIE');add('STALLS','CABINES CABINE DOUCHES DOUCHE');
  add('GRATE','GRILLE');add('HOOKS','PATERES PATERE CROCHETS');add('JACKET','BLOUSON VESTE');add('BENCHES','BANCS BANC');
  add('CANOPENER','OUVREBOITE');add('ICEBOX','GLACIERE FRIGO FRIGIDAIRE');add('STOVE','FOURNEAU CUISINIERE POELE');add('WIRECUTTERS','PINCE CISAILLE TENAILLES');
  add('COUNTER','COMPTOIR');add('DRAWER','TIROIR');add('KNIFE','COUTEAU');add('TIN','BOITE CONSERVE');add('SOIL','TERRE TERREAU');
  add('HOE','BINETTE HOUE');add('AXE','PIOCHE HACHE');add('WHEELBARROW','BROUETTE');add('LOCK','SERRURE COMBINAISON');add('CHEST','COFFRE MALLE');
  add('ROPE','CORDE');add('BOX','CAISSE CARTON');add('RADIO','RADIO POSTE');add('MOUSE','SOURIS');add('LADDER','ECHELLE');
  add('FOOTBALL','BALLON BALLE');add('KEY','CLE CLEF');add('LACING','LACET LACETS LACAGE');add('BAT','BATTE');add('HOUSE','NICHE');
  add('DOG','CHIEN BERGER');add('NEEDLE','AIGUILLE');add('HOLE','TROU');add('GATE','PORTAIL');add('FENCE','CLOTURE BARBELES GRILLAGE');
  add('TOWER','MIRADOR TOUR');add('TUNNEL','TUNNEL GALERIE');add('SWITCH','INTERRUPTEUR COMMUTATEUR MANETTE');add('SIGN','PANNEAU PANCARTE');
  add('LABEL','ETIQUETTE');add('HAM','JAMBON');add('DEPRESSION','CREUX DEPRESSION');add('BLOOD','SANG FLAQUE');
  // groupes de mots lus avant les mots seuls
  const PHRASES=[['LITS DE CAMP','COTS'],['LIT DE CAMP','COTS'],['LITS SUPERPOSES','BUNKS'],['OUVRE BOITE','CANOPENER'],['OUVRE BOITES','CANOPENER'],
    ['TROU DE SERRURE','HOLE'],['CADENAS A COMBINAISON','LOCK'],['TERRE ROUGE','DIRT'],['TERRE NOIRE','SOIL'],['TABLE D OPERATION','TABLE'],
    ['ARMOIRE A PHARMACIE','CABINET'],['PINCE COUPANTE','WIRECUTTERS'],['JEU DE CARTES','CARDS'],['GRILLE D EVACUATION','GRATE']];
  const DIRS={N:'N',NORD:'N',S:'S',SUD:'S',E:'E',EST:'E',O:'W',OUEST:'W',H:'U',HAUT:'U',MONTER:'U',MONTE:'U',B:'D',BAS:'D',DESCENDRE:'D',DESCENDS:'D'};
  const STOP=new Set('LE LA LES L UN UNE DES DU DE D AU AUX A SUR SOUS DANS VERS EN AVEC ET MON MA MES CE CET CETTE CES PAR POUR Y'.split(' '));
  const norm=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’`\-]/g,' ').replace(/[^A-Z0-9 ?!]/g,' ').replace(/\s+/g,' ').trim();
  function frToEn(line){
    const n=norm(line); if(!n) return '';
    let t=n.split(' ');
    if(t.length===1&&DIRS[t[0]]) return DIRS[t[0]];
    if((t[0]==='ALLER'||t[0]==='VA'||t[0]==='VAIS')&&t.length>1){ const d=t.slice(1).find(x=>DIRS[x]); if(d) return DIRS[d]; }
    const verb=VERBS[t[0]]; if(!verb) return n;               // pas du français connu : transmis tel quel (l'anglais marche, les nombres aussi)
    if(verb==='INVENTORY'||verb==='HELP'||verb==='QUIT'||verb==='END') return verb;
    const restS=' '+t.slice(1).join(' ')+' ';
    for(const [p,en] of PHRASES) if(restS.includes(' '+p+' ')) return verb+' '+en;
    const rest=t.slice(1).filter(x=>!STOP.has(x));
    if(verb==='LOOK'&&!rest.length) return 'LOOK';
    let noun=null; for(const x of rest){ if(NOUNS[x]){ noun=NOUNS[x]; break; } }
    if(verb==='PICK'&&noun==='LOCK') noun='HOLE';             // crocheter la serrure : le trou de serrure du mitard
    if(!noun&&rest.length) noun=rest[rest.length-1];
    return noun?verb+' '+noun:verb;
  }
  const HELP="VERBES : PRENDRE, POSER, CREUSER, COUPER, OUVRIR, FERMER, CROCHETER, POUSSER, LIRE, REGARDER, EXAMINER, INVENTAIRE, AIDE, QUITTER. UNE LETTRE SEULE DÉPLACE : N, S, E, O, H (HAUT), B (BAS).%LE JEU NE LIT QUE DEUX MOTS : UN VERBE ET UN NOM (EXAMINER LE CASIER, CROCHETER LA SERRURE).";
  return {TEXT:{},NOUNS,VERBS,HELP,frToEn};
})();
