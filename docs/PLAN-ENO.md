# Plan d'intégration — Eno (Pal Creations / Dragon Data, 1982)

Sixième aventure de DragonTales, écrite par Paul Austin et Leroy C. Smith, les auteurs de Mansion of Doom. Elle est en
BASIC et tourne sur `moteur/basic.js`. Au 19/11/2026, elle tourne, se gagne et se joue en français ; le dossier porte
`EN-COURS.md` (absent de la page tant que l'intégration n'est pas finie, `python build.py --tout` pour l'inclure).

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

### 3. Décisions à prendre

1. **ENO = ONE à l'envers** : l'énigme repose sur l'anglais. Garder le nom Eno (c'est le titre), et compter sur le
   fait que « one » est connu, avec un indice des pièces magiques qui le dit ? Ou rebaptiser le chat en français ?
2. **« CALL FOR HELP? »** : le jeu repose la question en boucle tant qu'on ne tape pas HELP. Faire mourir quelle que
   soit la réponse ?
3. **HELP d'origine** : garder ses plaisanteries à côté des pièces magiques, comme dans Mansion of Doom ?
4. **Petites incohérences** : EXAMINE SAFE répond « IT'S LOCKED. » même ouvert ; EXAMINE DOORS ouvertes répond
   « NOTHING SPECIAL ». Les corriger ?
5. **Musique** : tout le jeu se passe dans le salon. Une musique dans tout le salon ?

### 4. À faire ensuite

- Décors : le salon vu depuis chaque case, avec ses meubles et les objets trouvés.
- Indices des pièces magiques (`hints.js`).
- Bruitages et musique.
- Retirer `EN-COURS.md`, publier.
