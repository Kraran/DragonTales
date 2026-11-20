# Plan d'intégration — Eno (Pal Creations / Dragon Data, 1982)

Sixième aventure de DragonTales, écrite par Paul Austin et Leroy C. Smith, les auteurs de Mansion of Doom. Elle est en
BASIC et tourne sur `moteur/basic.js`. Intégrée le 20/11/2026 (pas encore publiée).

## Le jeu en bref

- Une tante excentrique est morte et te lègue ses millions, à condition de les trouver. Seul indice : le salon.
- **Le décor** : un seul salon, découpé en 15 cases (grille de 5 × 3) : cinq « dans le salon », dix près d'un meuble
  (causeuse, aquarium, télévision, fauteuil, lampadaire, rideaux, deux tables d'appoint, canapé, table basse).
  28 objets, dont beaucoup cachés : on les découvre en examinant.
- **Les commandes** : deux mots, le jeu ne lit que les trois premières lettres. Dix verbes : GET, DROP, OPEN, CLOSE,
  EXAMINE (LOOK), PUSH (MOVE), BREAK (TEAR), ENTER, READ, CHANGE (TURN). Une lettre seule déplace (N, S, E, W).
  LOOK seul redécrit ; INVENTORY ; HELP ; QUIT ou END. Cinq objets au plus.
- **L'énigme** : la combinaison du coffre-fort (derrière le tableau, près de la causeuse) se lit dans le titre de la revue
  cachée sous le coussin du fauteuil, « THE CAT EATING FISH FROM OUTER SPACE » :
  - CAT : le chat mort, sous la latte du parquet, sous le tapis ; le livre de la table basse le nomme ENO, c'est-à-dire
    ONE à l'envers : **1** ;
  - FISH : 29 poissons dans l'aquarium, plus les restes d'un dans la gueule du chat : **30** ;
  - OUTER SPACE : la télévision passe « Alien » sur la chaîne **11**.
- **Les fins** :
  - victoire : prendre le million dans le coffre ouvert ;
  - casser, pousser ou prendre l'aquarium : noyade ;
  - ouvrir, pousser, casser ou tourner la télévision : électrocution ;
  - ouvrir les portes de la table d'appoint nord-ouest (15) : un rat, crise cardiaque ; le jeu demande alors
    « CALL FOR HELP? » en boucle tant qu'on ne tape pas HELP, qui fait mourir ;
  - une mauvaise combinaison : l'alarme, la prison.
- **HELP** : trois plaisanteries (« CURIOSITY KILLED THE CAT. », « TOO MUCH TV… » près de la télé, « I'M SO CONFUSED!!! »),
  puis « THAT'S ENOUGH HELP » au sixième appel.

## Fichiers

| Fichier | Contenu |
|---|---|
| `programme.bin` / `programme.bas` | Le jeu (`ENO`, 222 lignes), extrait de `eno.cas` par `outils/cas.py` |
| `boite.webp` / `couverture.webp` | La boîte (loupe sur le salon, billets à l'effigie de la tante) et le fond de l'introduction |
| `solution.txt` | 33 commandes jusqu'à la victoire (d'après la solution fournie) ; pas de hasard |
| `aventure.js`, `data.js`, `textes.js` | La fiche, les 15 lieux (carte 5 × 3), la traduction complète |
| `fins.js` | Les cinq fins (quatre morts, la victoire) |
| `scenes.js`, `sons.js` | Ébauches (fond uni, pas de bruitage) |

## Étapes

### 1. Programme, solution, boîte, couverture — fait

### 2. Fiche, traduction, carte — fait (à relire)

- Tous les textes du jeu traduits, avec les fautes d'origine corrigées (THATAROUND, « BU COULDN'T », ITWAS…).
- Les lignes en deux temps (« SORRY, YOU JUST DON'T SEE ANY » puis « <mot> HERE. ») deviennent une seule phrase.
- Commandes françaises : PRENDRE, POSER, OUVRIR, FERMER, EXAMINER/REGARDER, POUSSER/DÉPLACER, CASSER/BRISER,
  ENTRER, LIRE, TOURNER/CHANGER/ALLUMER, INVENTAIRE, AIDE ; les nombres de la combinaison en chiffres ou en lettres
  (UN, TRENTE, ONZE) ; AU SECOURS pour l'appel à l'aide.
- Pause de quatre secondes sur l'écran titre (correctif de la ligne 130), comme pour Mansion of Doom.
- Essai `tests/essai-eno.js` (Chrome) : étagère, introduction, mort par l'aquarium, partie entière avec des commandes
  françaises, victoire.

### 3. Décisions (prises le 19/11/2026)

1. **ENO = ONE à l'envers** : on garde le nom Eno ; l'indice de la combinaison (pièces magiques) l'explique.
2. **« CALL FOR HELP? »** : toute réponse mène à la fin (correctif de la ligne 2180).
3. **HELP d'origine** : gardé, avec ses plaisanteries, à côté des pièces magiques.
4. **Petites incohérences corrigées** : le coffre-fort ouvert se dit ouvert (1210), les portes ouvertes de la table
   d'appoint aussi (1350) ; fermer les portes ou le livre les ferme vraiment (1090, 1100).
5. **Musique** : dans tout le salon.

### 4. Décors, indices, bruitages — fait

- **Décors** (`scenes.js`) : le salon de la tante, papier peint à médaillons, lambris, parquet. Chaque case montre son
  meuble au centre et ceux des cases voisines sur les côtés ; aux bords de la grille, le mur latéral. Les états se voient :
  le tapis, la latte, le trou et le chat ; le tableau, puis le coffre-fort, fermé ou ouvert avec les billets ; le coussin
  sur le fauteuil ; le livre fermé ou ouvert ; les portes de la table d'appoint et les chaussures ; les rideaux ouverts sur
  la rue où passe le facteur. La télévision montre la chaîne 11, un ciel étoilé.
- **Indices** (`hints.js`) : huit étapes (le chat sous la latte, sa gueule, le livre, la revue, les poissons, le coffre,
  la combinaison, le million) et quatre indices de situation (ne pas toucher l'aquarium ni la télévision, ne pas ouvrir
  la mauvaise table d'appoint, une seule erreur de combinaison).
- **Bruitages** (`sons.js`) : tapis, latte, découvertes, pages, rideaux, petites portes, cadran et porte du coffre,
  alarme, rat et cœur, aquarium qui éclate, court-circuit, fortune ; ambiances : bulles de l'aquarium, télévision,
  pendule, rue quand les rideaux sont ouverts.

### 5. Musique et fin de l'intégration — fait (20/11/2026)

- Musique « Eno – The Aunt's Last Will » (Suno, 2 min 14) : `musique.ogg`, Opus 56 kbit/s, fondu final de 0,8 s,
  niveau moyen −16,7 dB ; elle joue dans tout le salon.
- `EN-COURS.md` retiré : Eno est sur l'étagère. Essai `tests/essai-eno.js` ajouté aux essais automatiques,
  README (capture `docs/eno.jpg`, tableau, crédits) et journal des versions à jour.
