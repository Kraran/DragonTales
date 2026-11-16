# Plan d'intégration de Dragon Mountain

Deuxième aventure de DragonTales : **Dragon Mountain** (Dragon Data, 1982, Dragon 32).

## Ce que l'analyse a montré

- **Un programme en BASIC**, pas en code machine : 379 lignes de Dragon BASIC (13 Ko). Le moteur ne savait
  exécuter que du code 6809 ; il lui faut un interpréteur BASIC. C'est fait (`moteur/basic.js`), sans la ROM du Dragon.
- **35 lieux** reliés par une table `P(lieu, direction)` (haut, bas, nord, sud, est, ouest), sur deux étages qui tiennent
  presque dans une grille : 5 × 5 en bas, 3 × 3 en haut, plus la salle du trésor. Un passage tordu (salle à manger ↔ salon)
  ne tient pas dans la grille. Passages particuliers : porte verrouillée (clé), trois portes noires (formule ORIMIAH),
  force invisible (qui cède quand les gardiens sont vaincus), sortie finale.
- **19 objets**, dont la plupart sont **placés au hasard** à chaque partie (nourriture, eau, gourde, clé, épée, dague,
  objets en or) ; elfes, démon et dragon **apparaissent au hasard** à l'étage. Chaque partie est différente.
- **Survie** : faim, soif, fatigue et froid tuent si l'on ne mange pas, ne boit pas, ne dort pas et ne porte pas le manteau.
- **Fin** : sortir par l'ouest de la salle du trésor après avoir payé deux elfes et tué le démon et le dragon.
- **Particularités du programme d'origine** :
  - seuls les deux premiers caractères des noms de variables comptent (`DR` et `DRD` sont la même variable) ;
    l'interpréteur reproduit ce comportement, le jeu en dépend ;
  - on peut « manger » en portant seulement le gobelet, et pas avec le troisième panier de nourriture (le programme teste
    le gobelet au lieu de ce panier) — **corrigé** ;
  - si le dragon apparaît avant qu'on ait la dague, on ne peut plus quitter la pièce : la partie est bloquée sans mourir.
    Avec la stratégie simple du solveur, cela arrivait dans plus de 9 parties sur 10 — **corrigé** : le dragon ne se montre
    qu'à qui porte la dague. La même stratégie gagne maintenant 95 parties sur 100 ; les échecs restants viennent d'un
    elfe rencontré sans objet en or pour le payer, ce qui fait partie du jeu.
- La solution fournie (`DragonMountain-walkthrough.pdf`) ne correspond qu'à un tirage particulier et numérote les lieux
  autrement que le programme : elle sert de guide, pas d'essai automatique.

## Les étapes

### 1. Faire tourner le programme d'origine — fait

- [x] Extraire le programme de la cassette (`outils/cas.py`) et le rendre lisible (`outils/detok.py` → `programme.bas`).
- [x] Interpréteur Dragon BASIC (`moteur/basic.js`) : lit le programme tokenisé tel quel ; noms de variables à deux
      caractères, `RND`, `ON…GOTO`, `NEXT X,Y`, `DATA`/`READ`, `INPUT`, `CLS n` ; hasard reproductible et sauvegardable.
- [x] Une solution qui gagne avec une graine fixée (`solution.txt`, `@graine 2`), trouvée par
      `outils/dragonmountain-solveur.js` ; `node tests/rejouer-solution.js dragonmountain` la rejoue jusqu'à la victoire.
- [x] Fiche provisoire (`aventure.js`) : lieu courant, passages et leur nature, objets, épreuves (faim, soif, monstres…).
- [x] `build.py` ignore une aventure tant que son dossier contient `EN-COURS.md` (`--tout` pour l'inclure quand même).
- [x] Corrections du programme d'origine, écrites en BASIC dans la fiche (`machine.patches`) et appliquées au chargement :
      le dragon et le gobelet (voir plus haut). `--sans-correctifs` rejoue le programme d'origine.

### 2. Adapter le moteur aux jeux en BASIC — presque terminé

L'aventure se joue de bout en bout dans l'interface (`python build.py --tout`), testée par `tests/essai-dragonmountain.js`.

- [x] Choisir la machine selon la fiche (`machine.kind: 'basic'`) ; sauvegardes, annulation et reprise avec l'état BASIC
      (variables, pile, position dans le programme et hasard : une partie rechargée continue à l'identique).
- [x] Texte par lignes : le journal garde les lignes anglaises du programme et les traduit à l'affichage
      (`world.say`), ce qui permet toujours de changer de langue en cours de partie.
- [x] Version classique : en anglais, l'écran d'origine ; en français, le texte recoupé à 32 colonnes.
- [x] Deuxième sorte de saisie : la réponse à « WHAT IS THE SPELL? » passe telle quelle (`world.freeInput`).
- [x] Fins : victoire reconnue au texte final ; toute autre fin est une mort (annuler, charger, recommencer).
- [x] Carte sans grille unique : chaque lieu a sa colonne, sa ligne et son étage (`world.pos`) ; la petite carte montre
      l'étage du joueur, la grande carte tous les étages côte à côte.
- [x] Sons déclenchés par les lignes du jeu (`world.sfxFor`) ; les éclairs du combat (`CLS 3`, `CLS 4`) jouent l'éclair.
- [ ] Textes du moteur encore propres à El Diablero : la légende de la grande carte parle de « rêve ».
- [ ] Ordre de l'étagère : `order` dans la fiche (El Diablero 1, Dragon Mountain 2).

### 3. Contenu de l'aventure

- [x] Traduction française (`textes.js`) : 35 descriptions, 19 objets, tous les messages, les panneaux et le livre ;
      vocabulaire français → commandes du jeu (le jeu ne lit que les deux premières lettres du verbe et du dernier mot).
      Première version, à relire en jouant.
- [x] Titres courts des lieux (`data.js`), verbes de l'interface, texte d'introduction.
- [x] Positions des lieux sur la carte (deux étages et la salle du trésor), vérifiées contre la table des passages.
- [ ] Illustrations (pour l'instant un décor provisoire par sorte de lieu, `scenes.js`) : intérieurs de château (chambres, bibliothèque, cuisine…) et grottes de l'étage (salle des elfes,
      repaire du démon, antre du dragon, trésor), avec les objets et les monstres présents.
- [ ] Indices des pièces magiques adaptés au tirage de la partie (ils lisent où sont vraiment les objets).
- [ ] Sons : rugissement du dragon, démon, elfe, combat, porte, formule, eau, repas, sommeil.
- [ ] Image de la boîte (`boite.jpg`) et de l'introduction (`couverture.jpg`) : fournies. Texte d'introduction à écrire.
- [ ] Musique : aucune pour l'instant (facultative).

### 4. Vérifier et publier

- [ ] Essais dans Chrome : partie entière en version moderne et classique, en français et en anglais, sauvegardes.
- [ ] Retirer `EN-COURS.md`, mettre à jour l'étagère, le README et le journal des versions ; publier la 0.6.0.

## Décisions (16 novembre 2026)

1. **Le hasard** est gardé : il fait partie du jeu, chaque partie est différente.
2. **Le blocage par le dragon** est corrigé : c'était une mort injuste, plus un bug qu'un choix de l'auteur.
3. **Le gobelet qui nourrit** est corrigé.
4. **La musique** sera faite avec Suno dans un deuxième temps.
