# Plan d'intégration — Stalag (Pal Creations / Dragon Data, 1982)

Septième aventure de DragonTales, de Paul Austin et Leroy C. Smith (Mansion of Doom, Eno). Elle est en BASIC et tourne
sur `moteur/basic.js`. Au 26/11/2026, elle tourne, se gagne et se joue en français ; le dossier porte `EN-COURS.md`
(absent de la page tant que l'intégration n'est pas finie, `python build.py --tout` pour l'inclure).

## Le jeu en bref

- 1944 : les Allemands ont évacué le camp de prisonniers avant le bombardement allié, en oubliant le joueur au mitard.
  Il faut sortir du camp avant que les bombes ne tombent.
- **Le camp** : 34 lieux (carte fournie, `Stalag-map.pdf`) : trois baraques de prisonniers, cinq allées, l'infirmerie,
  deux foyers, les douches, le réfectoire, le potager, la baraque des gardes et son grenier, la cour d'exercice et sa niche,
  le mitard, le portail, quatre miradors, les clôtures, un réseau de tunnels sous la baraque 3, la forêt.
  85 objets, dont beaucoup cachés.
- **Les commandes** : deux mots, trois lettres lues. Dix verbes : GET (TAKE), DIG, CUT, OPEN, PICK, PUSH (MOVE), READ,
  CLOSE, DROP (LEAVE), EXAMINE (LOOK). Une lettre seule déplace (N, S, E, W, U, D). Cinq objets au plus.
- **La solution** (80 commandes) :
  - crocheter le trou de serrure du mitard avec l'aiguille ;
  - le blouson des douches porte le matricule de Hogan, C660723 : la combinaison du cadenas de la baraque des gardes ;
  - les outils : ouvre-boîte (clôture ouest), pioche (potager), ciseaux (infirmerie), pelle (casier de la baraque 1) ;
  - le jambon de la glacière du réfectoire, ouvert à l'ouvre-boîte, nourrit le chien de la cour d'exercice ;
  - la clé est prise dans le laçage du ballon : on le coupe aux ciseaux ;
  - la clé ouvre le cadenas de la baraque 3 ; sous un lit, des carreaux puis des planches : le tunnel ;
  - dans le tunnel est, creuser avec la pelle et la pioche mène à la forêt.
- **Le temps** : à chaque commande, les avions peuvent passer, et à chaque passage, une chance sur vingt qu'ils
  bombardent. Le risque grandit avec le nombre de commandes : environ 2 % sur la solution la plus courte, beaucoup plus
  pour une partie qui dure (au-delà de 150 commandes, un passage tous les six tours environ).
- **Les fins** : la forêt (victoire) ; le bombardement ; la clôture électrique ; la radio branchée ; l'éboulement du
  tunnel nord ; la tombe creusée près de la clôture est ; l'hémorragie après la morsure du chien.

## Fichiers

| Fichier | Contenu |
|---|---|
| `programme.bin` / `programme.bas` | Le jeu (`STALAG`, 436 lignes), extrait de `stalag.cas` par `outils/cas.py` |
| `boite.webp` / `couverture.webp` | La boîte et le fond de l'introduction |
| `solution.txt` | 80 commandes jusqu'à la victoire, graine 1 (pas de bombardement) |
| `aventure.js`, `data.js`, `textes.js` | La fiche, les 34 lieux (carte), la traduction complète |
| `fins.js` | Les sept fins |
| `scenes.js`, `sons.js`, `hints.js` | Ébauches |

## Étapes

### 1. Programme, solution, boîte, couverture — fait

### 2. Fiche, traduction, carte — fait (à relire)

- Tous les textes traduits, fautes d'origine corrigées (FREIND, WILLBLEED, ISETCHED, SHEPHARD, LABLE…). Les mesures
  passent en mètres (« dix mètres de haut »). Le panneau en faux allemand (« ZE GATEN-ZE ONDER UDDERSIDENSKY ») devient
  « Ze portailen ist de l'autre côtenstein ». Le scénario de l'écran classique est découpé à la place exacte de l'anglais.
- Commandes françaises : PRENDRE, POSER, DONNER (au chien), CREUSER, COUPER, OUVRIR, FERMER, CROCHETER, POUSSER,
  LIRE, REGARDER/EXAMINER… ; groupes de mots reconnus (LITS DE CAMP, OUVRE-BOÎTE, TROU DE SERRURE, CADENAS À
  COMBINAISON, TERRE ROUGE…) ; « crocheter la serrure » vise le trou de serrure du mitard.
- La blessure du chien s'affiche en haut de l'écran (« Blessé : tu saignes (3/10) »).
- Correctifs : pause de l'écran titre (125) ; « TIMER=50000 » retiré (220, sans effet) ; la victoire ne tourne plus en
  boucle sans fin (300) ; le bombardement, annoncé seulement par des éclairs, est dit en une phrase (4320).
- Essai `tests/essai-stalag.js` (Chrome) : étagère, mort par la radio, partie entière avec des commandes françaises.

### 3. Décisions — prises le 26/11/2026

1. **Le bombardement au hasard** : gardé tel quel (environ 2 % de risque sur la solution la plus courte).
2. **Le trou très profond** : devient une fin expliquée tout de suite (ligne 1380 : « …te voilà pris au fond de ta propre
   tombe »), au lieu de laisser le joueur creuser jusqu'à la mort.
3. **HELP d'origine** : gardé, à côté des pièces magiques.
4. **Petites incohérences** : corrigées. La boîte de jambon ouverte répond « c'est ouvert » (2210) ; la porte verrouillée
   des gardes ne dit plus « tu essaies » après « Ali Baba » (1630) ; la porte de la baraque 3 se referme vraiment
   (2780, 2785 nouvelle) et le cadenas ne se reverrouille que porte fermée (2790).
5. **Musique** : en surface seulement (ni au mitard, ni dans les tunnels, ni au fond du trou).

### 4. Décors, indices, bruitages — fait

- **Décors** (`scenes.js`) : le camp au crépuscule, comme sur la boîte. Dehors : ciel violet et orange, terre rouge,
  baraques à toit arrondi, miradors, barbelés (des étincelles tant que le courant passe) ; chaque allée a son repère
  (mât, bidons, corde à linge, château d'eau, panneau). Dedans : planches, fenêtres sur le soir, meubles propres à chaque
  lieu. Mitard, tunnels et trou sombres ; la forêt. États montrés : cadenas et portes ouverts, chien qui mange ou qui
  menace, courant coupé, mitard ouvert, ouverture sous le lit, et les bombardiers dans le ciel passé cent tours.
- **Pièces magiques** (`hints.js`) : douze étapes (mitard, combinaison, ouvre-boîte, jambon, chien, ciseaux, clé, outils,
  cadenas, porte, ouverture, tunnel) et sept indices de situation (clôture électrique, chien avant le jambon, hémorragie,
  radio, creux de la clôture est, tunnel nord, mains pleines dans la baraque 3).
- **Bruitages** (`sons.js`) : serrures, gorges du cadenas, portes qui grincent, ouvre-boîte, chien (grognement, morsure,
  festin), ciseaux, lit qu'on pousse, carreaux, planches, pelle et pioche, la lumière au bout du tunnel, la forêt ;
  ambiances : vent, bourdonnement de la clôture, gouttes des douches, poêle du réfectoire, terre du tunnel, oiseaux.

### 5. Musique et mise en place

- Fait le 26/11/2026 : musique « Before the Bombs » (Suno, 2 min 42, Opus 56k), `EN-COURS.md` retiré, essai dans
  l’intégration continue, README, CHANGELOG. Reste la publication.
