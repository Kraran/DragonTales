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

### 3. Décisions à prendre

1. **Le bombardement au hasard** : le garder tel quel ?
2. **Le trou très profond** : creuser deux fois près de la clôture est fait tomber au fond d'un trou sans sortie ; on ne
   peut plus que creuser encore, et mourir. En faire une fin expliquée tout de suite ?
3. **HELP d'origine** : garder ses conseils à côté des pièces magiques ?
4. **Petites incohérences** : examiner la boîte de jambon ouverte répond « rien de particulier » ; ouvrir la porte
   verrouillée de la baraque des gardes ajoute « tu essaies, mais ça ne s'ouvre pas » ; refermer le cadenas ou la porte
   de la baraque 3 répond « c'est fermé » sans rien fermer. Les corriger ?
5. **Musique** : dans tout le camp, ou seulement en surface (pas au mitard ni dans les tunnels) ?

### 4. À faire ensuite

- Décors, indices des pièces magiques, bruitages, musique, puis retirer `EN-COURS.md` et publier.
