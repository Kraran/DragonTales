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

### 4. À faire

1. **Traduction** : les messages du programme, les 77 descriptions, les 66 objets et l'aide (`textes.js`, comme pour Poseidon). La version moderne retire ce que ses panneaux montrent déjà (« YOU CAN SEE », « YOU CAN GO », tirets, invite).
2. **Écrits chiffrés** : traduits en français et rechiffrés avec le même alphabet, si c'est décidé. Il faut alors corriger les lignes du programme qui les affichent.
3. **Mots de passe** français (TUER VAMPIRE, CHIEN…), si c'est décidé.
4. **Pièges sans issue** : les signaler ou en faire des morts expliquées, selon la décision (voir plus bas).
5. **Plan** : affiner la carte des cinq niveaux, avec les liens irréguliers (puits, glaces, échelle).
6. **Décors** : 77 lieux, à regrouper par familles (chambres, couloirs, cave, sous-cave) avec des variantes ; icônes des objets.
7. **Indices** (pièces magiques) : étapes tirées de la solution.
8. **Sons** : bips d'origine (SOUND) dans les deux versions, bruitages dans la moderne (vent, chauves-souris, loup-garou, coup de feu, acide, cercueil…).
9. **Musique** (Suno), dans une zone à définir.
10. **Essai** `tests/essai-mansion.js` dans Chrome, note sur 5, publication.

## Décisions à prendre

1. **Écrits en gothique transylvanien** : les garder chiffrés en anglais (le dictionnaire donnerait l'anglais), ou traduire le texte en français puis le rechiffrer avec le même alphabet ?
2. **Mots tapés en entier** : accepter aussi TUER VAMPIRE pour SLAY VAMPIRE et CHIEN pour DOG ? Garder YOREL tel quel ?
3. **Parties perdues sans le savoir** (princesse en cendres, sables mouvants, interrupteur détruit, princesse abattue) : les laisser, les signaler, ou en faire des fins expliquées comme pour Poseidon ?
4. **Le HELP moqueur** (« HELP!? YOU MUST BE KIDDING… ») : le garder tel quel (les pièces magiques donnent les vrais indices) ou le remplacer ?
5. **Coucher du soleil au hasard** : le garder ?
6. **Musique** : où la faire jouer (dehors et au village, ou dans la crypte) ?
