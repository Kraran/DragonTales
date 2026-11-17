# Plan d'intégration — Mansion of Doom (Pal Creations / Dragon Data, 1982)

Quatrième aventure de DragonTales, écrite par Leroy C. Smith et Paul Austin. Elle est en BASIC, comme Dragon Mountain et Poseidon, et tourne sur `moteur/basic.js`.

Au 17/11/2026, l'aventure tourne et se gagne. Elle s'affiche avec `python build.py --tout`. Le dossier contient `EN-COURS.md`, donc elle ne sort pas encore dans les versions publiées.

## Le jeu en bref

- La princesse Marléna a été enlevée par le comte von Steinhoff. Il faut la ramener vivante sur la grand-place du village (lieu 77).
- **Le décor** : 77 lieux sur cinq niveaux (rez-de-chaussée, deux étages et grenier, cave, sous-cave) et 66 objets.
- **Les commandes** :
  - deux mots, dont le jeu ne lit que les trois premières lettres ;
  - huit verbes : GET, DROP, OPEN, CLOSE, LOOK/EXAMINE, SHOOT, READ ;
  - une lettre seule pour se déplacer ;
  - quelques phrases lues en entier : SLAY VAMPIRE, YOREL, DOG, HELP, QUIT, INVENTORY.
- **Le temps** : chaque commande avance l'horloge de 2 (`H`). Le soleil se couche à `R` = 420 + RND(59).
  - Après le coucher du soleil, le vampire mord. Il faut alors porter la croix et l'ail, ou l'avoir tué.
  - Poser la potion magique remet l'horloge à zéro (`H` = 0).
- **Les pièges** :
  - **Cave obscure** (lieux > 48) : elle reste noire tant qu'on n'a pas abaissé l'interrupteur (CLOSE SWITCH, lieu 48). Tirer sur l'interrupteur la condamne pour toujours.
  - **Loup-garou** (lieu 61) : il faut tirer tout de suite, avec le pistolet chargé de la balle d'argent.
  - **Chauves-souris** (lieu 66) : quatre tours sur place, et on est enfermé dans les fers (lieu 73).
    - Le mot YOREL libère.
    - Les objets portés sont alors dispersés au hasard.
  - **Sables mouvants** (lieu 71) : pas de sortie.
  - **Puits** : on tombe au lieu 76, où il faut taper DOG, sinon on meurt.
  - **Coffre du grenier** : il fait tomber dans la galerie des glaces (31). Ses sorties sont propres à ce lieu (lignes 370 à 410).
  - **Cassette avant le vampire** : l'ouvrir avant de l'avoir tué réduit la princesse en cendres. La partie continue mais ne peut plus être gagnée.
- **Victoire** : arriver au lieu 77 avec la princesse, sans lui avoir tiré dessus. Le jeu affiche « YOU HAVE ALSO WON THIS ADVENTURE ». Fin : « PRESS 'Y' TO TRY AGAIN ».
- **Écriture** : les écrits sont en « gothique transylvanien », un alphabet de symboles. Le dictionnaire du jeu le traduit.
  - Correspondance : `_#+.!)-$<?^[%'*,&(=@];\>:0` ↔ A–Z.
  - Messages décodés :
    - TO SLAY VAMPIRE SAY IT
    - THIS PLUS GARLIC EQUALS SAFETY
    - SMITH AND AUSTIN
    - LIGHTS
    - BAKING SODA
    - YOREL / CONFINEMENT / MAGIC
    - SUB BASEMENT
    - TIME BACKWARDS / EMIT
    - D IS FOR DOWN AND DEATH AND DOG
- **Écrans** :
  - titre sur fond rouge (CLS 4) ;
  - scénario et verbes sur fond noir (CLS 0) ;
  - plan du manoir en semi-graphiques bleus sur fond crème (CLS 5, SET) ;
  - victoire sur fond bleu (CLS 3).

## Fichiers

| Fichier | Contenu |
|---|---|
| `programme.bin` / `programme.bas` | Le jeu (`MANSION`, 419 lignes), extrait de la cassette par `outils/cas.py` |
| `boite.jpg` | L'illustration portrait dans le cadre de la boîte d'El Diablero |
| `couverture.jpg` | L'illustration paysage, fond de l'écran d'introduction |
| `solution.txt` | 121 commandes jusqu'à la victoire, graine 1 |
| `aventure.js`, `data.js`, `textes.js`, `scenes.js` | La fiche et ses modules (ébauches) |

## Étapes

### 1. Moteur — fait

- `basic.js` :
  - `INKEY$` ne bloque plus. Une boucle d'attente (`Z$=INKEY$:IF Z$="" THEN …`) est reconnue et devient une attente de touche.
  - `CLS n` passe sa couleur.
  - `SET(x,y,c)` et `RESET(x,y)` sont transmis.
  - Les boucles vides `FOR … NEXT` deviennent des pauses.
  - La sortie est vidée avant `CLS`, `SOUND` et `PLAY`.
- `dragontales.js` :
  - **Écran 32 × 16** : il gère les couleurs (fond du dernier `CLS n`, texte en cases vertes) et les semi-graphiques (quatre quarts par case).
  - **Pauses** : elles sont rejouées dans la version classique ; une touche les passe.
  - **Attentes de touche** : la version classique attend le joueur, la moderne répond seule (`world.autoKey`).
- Les trois autres aventures passent toujours tous leurs essais.

### 2. Solution, boîte, couverture — fait

### 3. Fiche de l'aventure — ébauche faite

- Lieux et sorties lus dans `F`, `B(F,1…6)`, y compris les cas particuliers : galerie des glaces, et caveau quand l'acide a disparu.
- Objets lus dans `B$(n)` et `A(n)` (-1 = porté). Le mot complet de chaque objet est tiré de ses trois lettres.
- Plan provisoire sur cinq niveaux (`POS` dans `data.js`), titres français provisoires des 77 lieux.
- Question « NEED INSTRUCTIONS? » :
  - la version moderne répond N, car son introduction remplace les instructions ;
  - la version classique la pose.
- Correctif 110 : une pause de 4 s garde l'écran titre rouge visible, comme sur le Dragon pendant la lecture des DATA.
- Heure affichée sur le décor (provisoire).

### 4. Traduction — faite (17/11/2026)

- `textes.js` : les messages du programme, les 77 descriptions, les 66 objets et leurs descriptions, les écrans titre, scénario et vocabulaire, l'aide.
  - Le jeu ne dit pas de quel objet il parle (IT, HIM, HER, THEM) : le français reste neutre (« c'est ouvert », « tu l'as déjà »).
  - La version moderne retire ce que ses panneaux montrent déjà : objets, sorties, tirets, invite, écran titre.
  - La version classique française traduit l'écran du Dragon en majuscules, aux mêmes places.
- **Écrits chiffrés** : traduits en français puis rechiffrés avec le même alphabet, sans accents. Le dictionnaire du jeu donne toujours l'alphabet.
  - POUR TUER VAMPIRE DIS LE
  - CECI PLUS AIL EGALE PROTECTION
  - SMITH ET AUSTIN
  - LUMIERES
  - BICARBONATE
  - YOREL/DETENTION/MAGIE
  - TEMPS A REBOURS, et SPMET sur la potion (TEMPS à l'envers, comme EMIT pour TIME)
  - C COMME CHUTE ET COMME CHIEN
  - SOUS SOL (le plan)
- **Mots de passe** : TUER VAMPIRE (ou TUER LE VAMPIRE) vaut SLAY VAMPIRE, CHIEN vaut DOG. YOREL reste tel quel.
- **Fins expliquées** (correctifs dans `aventure.js`) :
  - les sables mouvants tuent, avec l'explication ;
  - la princesse en cendres, l'interrupteur détruit (sans la princesse en main) et la princesse abattue terminent la partie, en expliquant pourquoi elle est perdue.
- Le HELP moqueur d'origine est gardé, traduit, en plus des pièces magiques.
- L'heure du coucher du soleil reste tirée au hasard. Ce n'est pas gênant : il faut au moins 210 commandes pour l'atteindre (la solution en fait 121), la croix et l'ail protègent, et la potion remet l'horloge à midi.
- L'heure s'affiche sur le décor quand on porte la montre, comme la montre du jeu (midi + 2 minutes par commande).
- Zone de la musique : dehors, devant le manoir, et sur la grand-place du village (la musique reste à composer).

### 5. Carte, décors, pièces magiques — faits (17/11/2026)

- **Carte** : cinq niveaux cohérents avec les sorties du programme. La galerie des glaces, magique, reste à part : ses sorties mènent au village, à la salle d'armes et au deuxième étage.
- **Décors** (`scenes.js`) : un par lieu, d'après sa description.
  - Pièces tendues de papier peint, avec un ton propre à chacune ; cave voûtée en pierre, sous-cave dans le roc.
  - Les fenêtres, le dehors et la grand-place suivent l'heure du jeu : après-midi, soir à l'approche du coucher du soleil, puis nuit.
  - États montrés (éléments de scène 101 à 119, `sceneExtras`) : porte d'entrée, serpent, coffre du grenier, trappe, interrupteur, lueur rouge de la cave, cave noire sans courant, loup-garou vivant ou abattu, acide calmé, cercueil, vampire, pieu, cassette, princesse ou cendres, villageois qui acclament la princesse.
  - Les écrits chiffrés sont peints sur les murs, dans la langue de la partie.
- **Objets** : dessins des objets transportables (icônes de la carte et des listes) ; les objets fixes font partie des décors. Noms français dans les listes (`objLabel`).
- **Pièces magiques** (`hints.js`) : douze étapes tirées de la solution, chacune avec une piste puis la solution.
  - Les étapes : porte, croix et ail, serpent, pistolet chargé, courant, loup-garou, sac, pieu et maillet, acide, vampire, princesse, retour.
  - Indices de situation : la nuit qui tombe sans protection, la chute dans le puits (CHIEN), les fers (YOREL), les chauves-souris, les sables mouvants, la cassette à ne pas ouvrir trop tôt, l'interrupteur.
- Dans la cave sans lumière, la version moderne ne montre pas les objets du lieu (le jeu dit qu'on n'y voit rien).

### 6. Sons et essai — faits (17/11/2026)

- **Bips d'origine** : SOUND et le coup de feu en PLAY jouent dans les deux versions, par le moteur.
- **Bruitages** (`sons.js`, version moderne seulement), synthétisés comme les autres :
  - **Portes et meubles** : porte d'entrée qui grince, cercueil, cassette, trappe.
  - **Pièges et chutes** : déclic du coffre puis chute, corps qui s'écrase, objets qui tombent.
  - **Courant** : interrupteur qui claque, puis bourdonnement ; extinction.
  - **Acide et bêtes** : acide qui bouillonne puis s'éteint ; serpent chassé ; mangouste ; chauves-souris ; rats ; ménagerie.
  - **Magie et lumière** : fiole brisée (le temps recule) ; coup de vent sur la bougie.
  - **Le vampire et la princesse** : coups de maillet et cri du vampire, morsure, cendres, princesse retrouvée.
  - **Fins** : fers qui tombent, sables mouvants, foule qui acclame au village, et le glas au loin quand le soir puis la nuit tombent.
- **Ambiances à l'entrée des lieux** :
  - dehors, le vent avec des corbeaux le jour, une chouette la nuit ; la place du village, sa foule et sa cloche ;
  - l'orgue de la chapelle, le feu du petit salon, le scintillement de la galerie des glaces et de la salle magique ;
  - le bourdonnement de la salle du courant, les gouttes et le grondement de la sous-cave ;
  - un cœur qui bat dans la cave noire.
- **Essai dans Chrome** (`tests/essai-mansion.js`, dans l'intégration continue avec `build.py --tout`) :
  - commandes et objets en français, secours, pièce magique, solution entière jusqu'à la victoire ;
  - version classique en français et en anglais ;
  - écran titre rouge, question des instructions, plan semi-graphique au titre chiffré en français ;
  - sables mouvants, et chute dans le puits avec et sans CHIEN.

### 7. À faire

1. **Musique** (Suno), dehors et au village.
2. **Note** sur 5 (difficulté, note globale).
3. **Publication** : retirer `EN-COURS.md`, version, journal des modifications.

## Décisions prises (17/11/2026)

1. Écrits chiffrés : traduits en français et rechiffrés.
2. TUER VAMPIRE et CHIEN acceptés ; YOREL gardé.
3. Parties perdues sans le savoir : fins expliquées.
4. HELP moqueur : gardé, en plus des pièces magiques.
5. Coucher du soleil au hasard : gardé.
6. Musique : dehors et au village, pas dans la sous-cave.
