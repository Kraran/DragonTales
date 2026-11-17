# Journal des versions

## À venir (0.7.0)

Troisième aventure : **S.S. Poseidon** (Poseidon Adventure, Bill et Debbie Cook, Dragon Data, 1982).

### S.S. Poseidon
- Choix du niveau au départ (expert 75 coups, moyen 125, débutant 250) ; coups restants et niveau de l'eau affichés.
- Version classique fidèle à l'écran du Dragon : 32 × 16, le lieu en haut, un séparateur, les messages qui défilent dessous.
- Musique « The Last Waltz » (Suno) : écran d'introduction, et pendant le jeu dans la salle de bal et ses deux voisins
  si l'option est activée.
- Bips et petits airs d'origine (SOUND, PLAY) rejoués, dans les deux versions ; une trentaine de bruitages du navire dans la version
  moderne, dont la coque qui gémit quand l'eau franchit un palier et le klaxon d'alarme à dix coups de la fin.
- Bug d'origine corrigé : MANGER un objet que l'on porte répondait « YOU DON'T HAVE IT ».
- Pièges d'origine gardés mais expliqués : noir sans lampe, incendie du poste radio, passage secret inondé.
  L'aide du poste radio indique l'extincteur au lieu d'un « mot magique » qui n'existait pas.
- Traduction française complète, une illustration par lieu (le paquebot est à l'envers), carte sur trois niveaux.
- Pièces magiques : huit étapes d'indices et huit indices de situation.

### Moteur
- Étagère : deux flèches hautes et étroites, de part et d'autre des boîtes, font défiler les aventures d'une boîte à la fois ;
  grisées au bout de la liste, cachées si tout tient à l'écran.
- BASIC : LINE INPUT, INKEY$, POS, RUN, PRINT @ à l'écran, SOUND et PLAY ; une touche n'est prise que si le programme l'attend.
- Jeux à écran (PRINT @) : la version classique reproduit l'écran du Dragon, avec défilement partiel.
- Fenêtre de choix proposée par le jeu au départ (niveau…), état propre à l'aventure affiché sur le décor.
- Lecteur de cassettes : lecture bit à bit, plusieurs programmes par cassette.

## 0.6.0 — 17 novembre 2026

Deuxième aventure : **Dragon Mountain** (Dragon Data, 1982). Le moteur sait désormais jouer les jeux écrits en BASIC.

### Dragon Mountain
- Programme d'origine exécuté par un interpréteur Dragon BASIC, avec le hasard du jeu : chaque partie est différente.
- Deux bugs d'origine corrigés : le dragon pouvait bloquer la partie s'il apparaissait avant qu'on ait la dague ;
  le gobelet nourrissait, et le troisième panier de nourriture ne se mangeait pas.
- Traduction française complète, versions moderne et classique, carte sur deux étages et la salle du trésor.
- Une illustration par lieu, avec les objets, l'elfe, le démon, le dragon et les portes ouvertes.
- Pièces magiques : dix étapes d'indices et six indices de situation ; le second indice nomme le lieu réel de l'objet.
- Musique « The Guardian's Hoard » et effets sonores propres à l'aventure (dragon, démon, elfes, combats, portes, feu…).

### Moteur
- Interpréteur Dragon BASIC (`moteur/basic.js`), corrections de programme écrites en BASIC, carte à étages,
  sons et éléments de scène propres à chaque aventure.
- Fenêtre « À propos » : un clic sur le titre DragonTales de l'étagère l'ouvre (version, date, auteur, dépôt, aventures).
- Étagère : barre de défilement aux couleurs du thème, défilement à la molette, la boîte choisie reste visible.
- Sauvegardes : export de la partie en cours dans un fichier et import d'un fichier, pour changer d'ordinateur ou de navigateur.
- Le journal de la partie est conservé avec la sauvegarde : on le retrouve à la reprise, dans les deux versions et les deux langues.
- Corrigé : recharger une sauvegarde ne rend plus les pièces magiques déjà dépensées dans la même partie.
- Corrigé : le bouton Jouer de l'étagère avait perdu sa couleur dorée.

### El Diablero
- Le regard que l'on sent sur soi apparaît à la fenêtre de la cabane au lieu de flotter dans le ciel.

### Dépôt
- Essais automatiques sur GitHub (solutions rejouées, parties entières et sauvegardes dans Chrome), README en anglais.

## 0.5.0 — 16 novembre 2026

Première version publiée. Le portage d'El Diablero devient DragonTales, un moteur qui peut accueillir d'autres aventures.

### Moteur
- Étagère d'accueil : une boîte par aventure, avec sa fiche et l'état de la partie.
- Programme d'origine exécuté tel quel par un émulateur 6809, appels à la ROM du Dragon remplacés.
- Version moderne 16/9 à la souris et version classique texte sur fond vert, avec bascule en cours de partie.
- Français et anglais, avec bascule en cours de partie de tout l'écran et de tout l'historique.
- Carte dessinée au fil de l'exploration, déplacement d'un clic.
- Sauvegarde automatique, trois emplacements, annulation du dernier coup.
- Trois pièces magiques par partie pour obtenir des indices.
- Musique d'introduction avec fondu, effets sonores synthétisés, menu Options.
- Plein écran au premier geste, retour à l'étagère depuis une aventure, sortie avec confirmation.

### El Diablero
- Traduction française complète des textes et du vocabulaire.
- Une illustration par lieu, avec les objets présents.
- Vingt étapes d'indices et cinq indices de situation.
- Correction du compteur d'inventaire du programme d'origine (bol cassé, graines plantées, figurine brisée).
