# Plan d'intégration — The Final Countdown (Dragon Data, 1983)

Cinquième aventure de DragonTales, écrite par Bill et Debbie Cook, les auteurs de S.S. Poseidon. Le programme est du même moule : écran partagé, choix du niveau, compte des coups. Il tourne sur `moteur/basic.js`.

Au 17/11/2026, l'aventure tourne, se gagne, elle est traduite, illustrée et sonorisée. Elle s'affiche avec `python build.py --tout`. Le dossier contient `EN-COURS.md`, donc elle ne sort pas encore dans les versions publiées.

## Le jeu en bref

- **Le but** : un général devenu fou a lancé le compte à rebours d'un missile nucléaire et fait évacuer la base. Il faut arrêter le tir avant la fin du compte à rebours.
- **Les lieux** : 20, dont 13 en surface (le désert, la camionnette, l'entrée, les bureaux) et 7 dans le silo (le centre de commandement, le labyrinthe, le poste de contrôle de tir).
- **Les objets** : une trentaine, dont une partie seulement se prend.
- **Les commandes** : deux mots, dont le jeu ne lit que les trois premières lettres. 25 verbes, dont GO, GET, DROP, WEAR, EXAMINE, MOVE, USE, UNLOCK, SHOW, SHOOT, BREAK, PRESS, SCORE et HELP.
- **Niveaux** : expert 75 coups, moyen 125, débutant 250. À la fin, le missile part.
- **Le hasard** :
  - **Le général** : à chaque coup, il surgit une fois sur dix dans un lieu du silo ou des étages (lieux 11 à 20). Il faut alors tirer sur lui tout de suite avec le pistolet paralysant, qui a 5 tirs ; toute autre commande est mortelle.
  - **Le passage du labyrinthe** : il se découvre une fois sur quatre à chaque pas.

### La solution, en résumé

1. **Dans la camionnette** : mettre l'uniforme du général et l'examiner (on y trouve le pistolet et des papiers).
2. **À l'entrée** : montrer les papiers.
3. **L'extincteur et l'ascenseur** : prendre l'extincteur dans la réserve de fournitures. Dans le bureau du commandant, appuyer sur TROIS : l'ascenseur du hall s'active, mais le feu prend dans le bureau ; l'éteindre avec l'extincteur.
4. **L'escalier** : dans la réserve obscure, déplacer l'armoire pour découvrir l'escalier, puis descendre dans le silo.
5. **Dans le silo** : prendre la pince coupante dans la salle radar, puis trouver le passage du labyrinthe.
6. **Les gants** : prendre la clé dans le bureau du hall, remonter par l'ascenseur, déverrouiller l'armoire pour trouver les gants, et les mettre.
7. **Le tir** : redescendre au poste de contrôle de tir, appuyer sur TROIS (un panneau s'ouvre) et couper le fil avec la pince.

La solution d'essai fait 51 commandes, avec la graine 1 et le niveau expert.

## Fichiers

| Fichier | Contenu |
|---|---|
| `programme.bin` / `programme.bas` | Le jeu (`FINAL`, 216 lignes), extrait de la cassette par `outils/cas.py` |
| `boite.jpg` | La boîte (ton image `FinalCountdown-box.jpg`, ramenée au format des autres boîtes) |
| `couverture.jpg` | L'illustration paysage, fond de l'écran d'introduction |
| `solution.txt` | 51 commandes jusqu'à la victoire, graine 1 |
| `aventure.js`, `data.js`, `textes.js` | La fiche, les lieux, la traduction |
| `scenes.js`, `hints.js`, `sons.js` | Décors, pièces magiques, bruitages |

## Étapes

### 1. Moteur — fait

- **BASIC** : une boucle FOR de même variable n'efface plus le retour d'un GOSUB.
  - Comme dans le BASIC Microsoft, la recherche s'arrête au sous-programme en cours.
  - Le jeu quitte une boucle FOR A par GOTO, puis appelle un sous-programme qui refait FOR A. Avant le correctif, cela causait « ?RG ERROR ».
- Les trois autres aventures en BASIC passent toujours leurs essais.

### 2. Programme et correctifs — faits

- **Ligne 40** : le jeu installait une petite routine en langage machine qui fait défiler le bas de l'écran. Le moteur fait ce défilement lui-même, comme pour Poseidon ; le correctif lit simplement les 59 octets de la routine.
- **Ligne 810** : une fois l'armoire déplacée, l'escalier se prend aussi par « bas ». Avant, seul « GO STAIRWAY » marchait.
- **Ligne 470** : une fois le passage du labyrinthe trouvé, « ouest » y mène. Avant, seul « GO PASSAGE » y menait.

### 3. Fiche et traduction — faites

- **Fiche** : lieux, sorties et objets lus dans `L`, `R$` et `O$`, carte sur deux niveaux (la surface, le silo).
- **Niveau** : choix dans une fenêtre, comme pour Poseidon.
- **Bandeau d'état** : le compte à rebours (« T moins 61 »), et les tirs du pistolet quand on le porte.
- **Traduction française complète** : lieux, objets, descriptions, messages, aide du jeu, écran titre.
- **Commandes françaises** : APPUYER SUR UN / DEUX / TROIS, MONTRER LES PAPIERS, TIRER SUR LE GÉNÉRAL… Les jurons ont leur réponse : « Ton vocabulaire ne m'impressionne pas. »
- **Le général** : quand il surgit, la version moderne l'annonce en toutes lettres (« Le général est là ! Il se jette sur toi. »). Le jeu d'origine ne le montrait que dans la liste des objets.
- **Coquilles d'origine corrigées dans la traduction** : COUNTDOWM, GARGLED pour garbled, CURRENT CURSES pour courses.

### 4. Décisions appliquées (17/11/2026)

- **L'incendie du bureau du commandant**, sans extincteur (ni porté ni posé là), est une mort expliquée dès qu'on veut sortir (correctif 540).
- **Le général** reste tel quel : il surgit au hasard, et seule la commande TIRER sauve.
- **Le piège du bouton UN au poste de contrôle de tir** est rétabli (correctif 1480) : il lance le missile.
- **Le labyrinthe** garde son hasard.
- **Musique** : dehors, c'est-à-dire le désert, la camionnette et l'entrée principale.

### 5. Décors, objets, pièces magiques, sons, essai — faits (17/11/2026)

- **Décors** (`scenes.js`) : un par lieu.
  - Le désert et ses cactus, la camionnette, l'entrée gardée par sa caméra, les bureaux vert administration sous les néons.
  - La salle informatique et ses bandes, la grande carte du centre de commandement, le radar, le silo vu de la salle d'observation, le poste de contrôle de tir.
  - Le compte à rebours s'affiche en chiffres rouges dans les salles de contrôle.
  - **Les états montrés** : grille ouverte, incendie, ascenseur en service, vitre brisée, armoire déverrouillée ou déplacée (l'escalier), passage du labyrinthe, panneau ouvert, et le général quand il surgit.
- **Pièces magiques** (`hints.js`) : 12 étapes et 5 indices de situation.
  - Les étapes : uniforme, papiers, entrée, extincteur, ascenseur, escalier, pince, passage, clé, gants, panneau, fil.
  - Les indices de situation : le général, le bouton TROIS sans extincteur, le bouton UN, la vitre, le labyrinthe.
- **Sons** (`sons.js`) : le jeu d'origine est muet, donc tout est en version moderne.
  - **Dehors** : le vent, le crotale.
  - **À l'entrée** : la radio brouillée, la voix métallique de la caméra, la grille qui coulisse ou le buzzer de refus.
  - **Dans le bureau du commandant** : le feu, l'extincteur, la télévision.
  - **Dans la base** : l'ascenseur, l'armoire qu'on traîne ou qu'on déverrouille, le pistolet paralysant et le cri du général, la vitre, la décharge électrique.
  - **Au poste de tir** : le panneau, le fil coupé, le décollage du missile.
  - **Le compte à rebours** : une sirène à dix coups de la fin, puis un bip à chaque coup.
  - **Ambiances** : salle informatique, radar, transmissions, néons du silo, pas dans le labyrinthe.
- **Essai Chrome** (`tests/essai-finalcountdown.js`, dans l'intégration continue avec `build.py --tout`) :
  - niveau, commandes françaises, pièce magique ;
  - partie entière en réagissant au général et au labyrinthe ;
  - version classique en français et en anglais ;
  - les trois fins : incendie, lancement par erreur, général.

### 6. À faire

1. Musique (Suno), dehors.
2. Note sur 5, publication.

## Décisions prises (17/11/2026)

1. Incendie sans extincteur : mort expliquée.
2. Le général : gardé tel quel.
3. Le piège du bouton UN : rétabli.
4. Le labyrinthe : hasard gardé.
5. Musique : dehors (désert, camionnette, entrée).
