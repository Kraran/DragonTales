# Plan d'intégration — The Final Countdown (Dragon Data, 1983)

Cinquième aventure de DragonTales, écrite par Bill et Debbie Cook, les auteurs de S.S. Poseidon. Le programme est du même moule : écran partagé, choix du niveau, compte des coups. Il tourne sur `moteur/basic.js`.

Au 17/11/2026, l'aventure tourne, se gagne et elle est traduite. Elle s'affiche avec `python build.py --tout`. Le dossier contient `EN-COURS.md`, donc elle ne sort pas encore dans les versions publiées.

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
| `scenes.js` | Ébauche : un fond par sorte de lieu |

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

### 4. À faire

1. Décors des 20 lieux et dessins des objets.
2. Pièces magiques (indices).
3. Sons : bips d'origine, bruitages et ambiances.
4. Musique (Suno).
5. Essai `tests/essai-finalcountdown.js` dans Chrome. Comme le général surgit au hasard, l'essai doit réagir à ses apparitions.
6. Note sur 5, publication.

## Décisions à prendre

1. **L'incendie du bureau du commandant** : appuyer sur TROIS sans extincteur enferme le joueur jusqu'à la fin du compte à rebours. En faire une fin expliquée, comme pour Poseidon ?
2. **Le général** : le garder tel quel (une chance sur dix par coup dans le silo ; une seule réponse possible, TIRER) ou l'adoucir dans la version moderne ?
3. **Le piège oublié** : les auteurs avaient écrit qu'appuyer sur UN au poste de contrôle de tir lance le missile, mais une autre ligne passe avant et ce piège ne se déclenche jamais. Le rétablir ?
4. **Le labyrinthe** : garder le hasard pur (une chance sur quatre à chaque pas) ?
5. **Musique** : dans quels lieux la faire jouer ?
