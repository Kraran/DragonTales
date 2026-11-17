# Plan d'intégration — Poseidon Adventure (Dragon Data, 1982)

Troisième aventure de DragonTales, écrite par Bill et Debbie Cook. Elle est en BASIC, comme Dragon Mountain, et tourne donc sur l'interpréteur `moteur/basic.js`. Le dossier `aventures/poseidon/` contient `EN-COURS.md` tant que l'intégration n'est pas finie : `build.py` l'ignore, sauf avec `--tout`.

## Le jeu en bref

- Le paquebot S.S. Poseidon s'est retourné. Il faut remonter vers la coque et en sortir par l'arbre d'hélice avant que le navire ne coule.
- 20 lieux, 23 objets, verbes et noms reconnus par leurs 3 premières lettres.
- Limite de coups selon le niveau choisi au départ : expert 75, moyen 125, débutant 250.
- Sans lampe, au-delà du lieu 3, le joueur tourne en rond dans le noir.
- Victoire : « YOU'VE MADE IT TO FREEDOM ». Défaite : « WANT TO TRY AGAIN? », puis `RUN`.

## Fichiers de la cassette

La cassette contient deux programmes, extraits par `outils/cas.py`, qui lit maintenant la bande bit à bit car elle a des glissements de bits et des octets de synchronisation abîmés :

| Programme | Contenu | Fichier |
|---|---|---|
| `POSEIDON` | Chargeur, instructions, routine machine `$600` pour l'écran partagé | `introduction.bas` |
| `ADVENT` | Le jeu (220 lignes) | `programme.bin` / `programme.bas` |

La routine machine ne sert qu'à faire défiler le bas de l'écran. DragonTales la remplace par sa propre mise en page : le chargeur n'est pas exécuté, et ses instructions seront reprises dans le texte d'introduction.

## Étapes

### 1. Moteur BASIC — fait

Ajouts à `moteur/basic.js` dont Poseidon a besoin :

- `LINE INPUT`, `INKEY$` (attente d'une touche), `POS`, `RUN` (en gardant la graine), `PRINT @` ;
- `SOUND` et `PLAY` transmis au moteur (`io.sound`, `io.play`) ;
- `EXEC`, `CLOAD`, `CSAVE`, `MOTOR` ignorés ;
- les éléments `DATA` gardent leurs espaces de fin (le verbe `"GO "` en dépend) ;
- `endKeyLines` : une attente de touche sur ces lignes signale la fin de partie.

El Diablero et Dragon Mountain gagnent toujours avec leur solution.

### 2. Solution et boîte — fait

- `solution.txt` : 47 commandes, niveau expert, victoire en 47 coups sur 75. La solution du PDF d'origine est fausse et incomplète ; celle-ci est tirée de la logique du programme.
- `boite.jpg` : aligné sur la boîte d'El Diablero (cadre jaune, bande DRAGON 32). `couverture.jpg` : illustration plein cadre.

### 3. Adaptateur de monde et interface — en cours

- `aventure.js` : salles (`L`), sorties tirées de `R$(L,2)`, objets `O$(n,…)` (99 = porté, 0 = caché), drapeaux.
- Choix du niveau au lancement : menu cliquable dans l'interface moderne, saisie `1/2/3` en vue classique.
- Invite `--->` du `LINE INPUT` reconnue par le moteur.
- Écran partagé : la description du lieu en haut (lignes `PRINT @0`), les commandes en bas (`PRINT @480`). L'interface moderne affiche la description dans le panneau du lieu, la vue classique garde une transcription défilante.
- Fin de partie (`INKEY$` en 2220) et « TRY AGAIN » (ligne 180) branchés sur l'écran de fin.
- Compteur de coups restants visible dans l'interface moderne.

### 4. Traduction

- `textes.js` : descriptions des 20 lieux, objets, messages, réponses aux verbes, en français.
- Vocabulaire français vers les codes d'origine (« prends » → `GET`, « lampe » → `FLA`…), comme pour Dragon Mountain.

### 5. Illustrations et carte

- `scenes.js` : une scène par lieu dans le style des deux autres jeux, vue d'un navire retourné (tout est à l'envers : plafonds au sol, escaliers inversés).
- `data.js` : positions sur la carte. Le navire se lit en coupe verticale : la carte montre les ponts de bas en haut.

### 6. Indices (pièces magiques)

- `hints.js` : un indice par blocage — la lampe dans les débris, la chaise pour lire le panneau, la corde à attacher, le pied-de-biche pour l'armoire, la clé à molette à la fin.

### 7. Sons et musique

- Les airs `PLAY` et bips `SOUND` d'origine rejoués par le synthé du moteur.
- Effets propres à l'aventure (eau qui monte, métal qui grince, chute).
- Musique Suno pour le jeu, comme les deux autres aventures.

### 8. Essais et publication

- `tests/essai-poseidon.js` dans la CI.
- Retrait de `EN-COURS.md`, captures, `CHANGELOG.md`, release 0.7.0.

## Décisions à prendre

1. **Niveau** : menu au lancement (expert / moyen / débutant) ou niveau fixe ?
2. **Vue classique** : transcription défilante, ou reproduction exacte de l'écran partagé 32×16 ?
3. **Sons d'origine** : rejouer les airs `PLAY` et bips `SOUND` du jeu ?
4. **Bug `EAT`** (ligne 1290) : pour tout objet autre que la nourriture, le programme teste le mot de l'objet au lieu de son emplacement (`O$(N,2)` au lieu de `O$(N,3)`), et répond toujours « YOU DON'T HAVE IT » même si on l'a en main. Le bug ne change que le message (on ne peut de toute façon manger que la nourriture). Corriger ?
5. **Musique** : instructions Suno à préparer quand tu voudras.
