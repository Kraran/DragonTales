# Journal des versions

## Prochaine version (en préparation)

### Améliorations
- **El Diablero, illustrations retravaillées** : soleil et halo, nuages du soir, mesas à l'horizon, saguaros avec
  leur ombre et un cactus au premier plan, broussailles et cailloux ; canyon aux strates colorées ; montagne avec
  crêtes lointaines et genévriers ; falaise de l'aigle veinée ; cabane avec cheminée qui fume, palissade et fenêtre
  éclairée, intérieur avec table et lampe à pétrole ; grottes au bord rocheux irrégulier et éclairé, parois veinées,
  passage qui s'enfonce au fond, rochers et stalagmites ; passage taillé en blocs ; puits avec poussière dans la
  lumière ; sous l'eau, rayons, algues et fond de sable.
- **El Diablero, objets retravaillés** : reliefs, reflets et ombres au sol ; serpent à sonnette avec sa sonnette et
  sa langue, lézard tacheté, scarabées irisés, masque de jade gravé, statue et clé d'or qui brillent, cloche de bronze,
  puits avec treuil et seau, pierre tombale fendue et moussue, plume, crâne, corde, coffre, bête ailée aux yeux rouges.
- **El Diablero, petites animations** : la fumée de la cabane monte, la lampe à pétrole vacille, les algues ondulent
  et les bulles remontent sous l'eau, les vaguelettes de l'étang glissent, les mares scintillent, la poussière flotte
  dans la lumière des puits, les nuages dérivent, l'aigle plane, le rêve respire, les yeux dans l'ombre clignent, la
  statue d'or étincelle. Rien ne bouge sur la carte, ni si le système demande de réduire les animations.
- **Dragon Mountain, illustrations retravaillées et animées** : murs aux pierres nuancées et fissurées, ombre au pied
  des murs, dallage, voûtes de grotte avec stalactites ; torches murales, bannières, toiles d'araignée dans les
  pièces sombres ; fenêtre avec la lune et des nuages qui passent ; objets en relief (épée et couronne qui
  scintillent, coupe, bouteille, tonneau cerclé, corbeille tressée…). Animations : flammes des torches, des bougies,
  de la cheminée, du feu de camp et de la grande lampe, fumée du poêle, braises du repaire, poussière dans la lumière,
  reflets des miroirs, éclats du trésor et de la grille d'or ; le dragon bat de la queue et fume des naseaux, les
  yeux du démon clignent.
- **Petites animations dans toutes les aventures** :
  - S.S. Poseidon : coulures de rouille, gouttes qui tombent, néon qui grésille, flaques et hublots qui miroitent,
    vapeur de la cuisine, incendie, eau qui monte en ondulant, lustre qui scintille, aiguilles et voyants des pupitres,
    compas, câble qui se balance, bulles dans la salle de bal engloutie.
  - Mansion of Doom : flammes des appliques, chandeliers, torches et cheminée ; nuages et éclairs aux fenêtres, étoiles,
    toiles d'araignée dans le courant d'air, yeux du portrait, lueur rouge de la cave, chauves-souris, acide qui
    bouillonne, gouttes, rivière souterraine, fumée des cheminées du village.
  - The Final Countdown : radar qui tourne, bandes magnétiques, voyants et curseurs qui clignotent, trajectoire du
    missile, compte à rebours, néon qui grésille, incendie, drapeau, soleil du désert.
  - Eno : poissons qui nagent, bulles et algues de l'aquarium, télévision qui scintille, lustre, plante, pendule, nuages.
  - Stalag : projecteurs des miradors qui balaient le camp, bombardiers qui passent, nuages, clôture électrifiée qui
    crépite, lampes qui se balancent, poêle qui fume, poussière du tunnel, sapins dans le vent.
  - Madness and the Minotaur : torches, bassin, huile, brouillard, aura, notes de musique, étoiles, poussière, têtes de
    l'hydre, lutin, Oracle et sortilèges.

## 1.1.0 — 26 novembre 2026

Trois nouvelles aventures : huit jeux sur l'étagère.

### Nouveautés
- **Eno** (Paul Austin et Leroy C. Smith, Pal Creations, 1982), sixième aventure : ta tante excentrique te lègue ses
  millions, à condition de les trouver dans son salon. Traduction française complète, salon illustré case par case,
  carte, indices des pièces magiques, bruitages, cinq fins et une musique, « The Aunt's Last Will ».
  Correctifs : l'appel à l'aide après le rat ne tourne plus en boucle ; le coffre-fort et les portes ouverts se disent
  ouverts ; fermer le livre ou les portes les ferme vraiment.
- **Stalag** (Paul Austin et Leroy C. Smith, Pal Creations, 1982), septième aventure : en 1944, oublié au mitard d'un
  camp de prisonniers évacué, tu dois t'évader avant le bombardement allié. Traduction française complète, camp
  illustré au crépuscule, carte de 34 lieux, indices des pièces magiques, bruitages, sept fins et une musique,
  « Before the Bombs » (en surface seulement). Correctifs : la victoire ne tourne plus en boucle ; le trou creusé près
  de la clôture, côté est, devient une fin expliquée ; la boîte de jambon ouverte se dit ouverte ; la porte de la baraque n° 3
  se referme vraiment, et son cadenas ne se reverrouille que porte fermée.
- **Madness and the Minotaur** (Tom Rosenbaum, Spectral Associates, 1981), huitième aventure : seize trésors à
  rapporter du labyrinthe du roi Minos, huit sortilèges à apprendre, des créatures qui rôdent et le Minotaure. Premier
  jeu en code machine : le programme 6809 d'origine tourne tel quel (nouveau moteur `moteur/flux.js`) et ses textes sont
  traduits au fil de l'affichage. Le temps avance à chaque commande (ATTENDRE laisse passer une minute) ; deux niveaux,
  le jeu d'origine ou « Débutant » (le sol ne tremble plus, la lampe dure deux fois plus longtemps, les sauts
  manqués ne tuent plus). Traduction française complète, quatre étages illustrés (une teinte par étage, sorties
  dessinées, le noir sans lampe), carte, pièces magiques qui lisent la partie en cours (tout est tiré au hasard),
  bruitages, huit fins et une musique, « The Labyrinth of Minos » (hors des dédales). Correctifs de bugs d'origine
  (voir docs/PLAN-MADNESS.md).

### Moteur
- `moteur/flux.js` : fait tourner un jeu en code machine 6809 dont on lit l'affichage caractère par caractère, comme
  un jeu en BASIC ; le processeur gagne les interruptions (RTI). Temps par commande, choix d'un niveau avant la
  partie, pièges sur les routines de la ROM (cassette, clavier).

## 1.0.1 — 19 novembre 2026

### Nouveautés
- **Lecture à voix haute** : chaque réponse du jeu est lue (pas le titre du lieu ni la commande ; les indices des
  pièces, oui). Dans Microsoft Edge, ce sont les voix neurales en ligne de Microsoft, les mêmes que Bifurk :
  Rémy multilingue par défaut (Andrew multilingue en anglais). La lecture s'active d'office quand Rémy est disponible ;
  ailleurs, elle reste désactivée et utilise les voix de l'ordinateur. Options : activer, voix, « Écouter », vitesse,
  volume ; le choix du joueur est gardé et vaut pour toutes les aventures. Un bouton 🔊 sur chaque entrée du journal
  la relit ; la musique baisse pendant la voix.

## 1.0.0 — 18 novembre 2026

Première version complète : cinq aventures du Dragon 32/64, traduites et illustrées, avec leur collection de fins.

### Nouveautés
- **Collection des fins** : chaque aventure a sa liste de fins (sept ou huit morts, et la victoire). Une fin atteinte
  s'y ajoute, datée, et y reste même si l'on recommence. L'étagère indique « Fins découvertes : 2 sur 8 » et ouvre la
  liste ; les fins pas encore trouvées restent masquées.
- **Bilan de fin de partie** : la fenêtre de mort ou de victoire annonce la fin (nouvelle ou déjà découverte) et résume
  la partie : coups joués, lieux découverts, pièces magiques dépensées, temps de jeu, coups annulés et morts. Le bilan
  est gardé dans les sauvegardes.
- Page plus légère : 15,0 Mo au lieu de 20,1 (images en WebP, musiques réencodées en Opus 56 kbit/s depuis les originaux).

### Corrections
- Après un changement de langue, les déplacements (O, B, OUEST…) s'affichent correctement dans l'historique.
- El Diablero : le dernier texte anglais qui restait (la fin de la liste des sorties) est traduit.
- « Mots rencontrés » garde les mots composés entiers (loup-garou, chauves-souris).

## 0.9.0 — 18 novembre 2026

Cinquième aventure : **The Final Countdown** (Bill et Debbie Cook, Dragon Data, 1983).

### The Final Countdown
- Un général devenu fou a lancé le compte à rebours d'un missile nucléaire : 20 lieux, de la camionnette au silo, à
  parcourir avant la fin du compte. Choix du niveau au départ (75, 125 ou 250 coups), compte à rebours affiché.
- Le général surgit au hasard sous terre : la version moderne l'annonce et le dessine ; il faut tirer sur lui sur-le-champ.
- Traduction française complète, commandes françaises (APPUYER SUR TROIS, MONTRER LES PAPIERS…).
- Version classique fidèle à l'écran du Dragon (écran partagé, comme Poseidon).
- Une illustration par lieu, le compte à rebours en chiffres rouges dans les salles de contrôle ; carte sur deux niveaux.
- L'incendie du bureau du commandant, sans extincteur, est une mort expliquée ; le piège prévu par les auteurs au poste
  de contrôle de tir (le bouton UN lance le missile), que le programme ne déclenchait jamais, est rétabli.
- Pièces magiques : douze étapes d'indices et cinq indices de situation.
- Bruitages de la base dans la version moderne (le jeu d'origine est muet), sirène à dix coups de la fin.
- Musique « T Minus Zero » (Suno) : écran d'introduction, et dehors si l'option est activée.
- Notes sur l'étagère : difficulté 3,3, note globale 3,2.

### Moteur
- BASIC : une boucle FOR de même variable ne traverse plus un GOSUB (comme le BASIC Microsoft).

## 0.8.0 — 17 novembre 2026

Quatrième aventure : **Mansion of Doom** (Leroy C. Smith et Paul Austin, Pal Creations, diffusé par Dragon Data, 1982).

### Mansion of Doom
- Le manoir du comte von Steinoff : 77 lieux sur cinq niveaux, du village à la sous-cave. Ramène la princesse Marléna avant
  que le soleil se couche.
- Traduction française complète. Les écrits en « gothique transylvanien » sont traduits puis rechiffrés avec le même
  alphabet : le dictionnaire du jeu sert toujours à les lire. Mots de passe français : TUER VAMPIRE, CHIEN (YOREL reste).
- Version classique fidèle à l'écran du Dragon : écran titre rouge, scénario sur fond noir, plan du manoir en
  semi-graphiques, pauses d'origine ; question des instructions (O/N).
- Une illustration par lieu ; fenêtres et dehors suivent l'heure du jeu (après-midi, soir, nuit) ; la cave rougit quand le
  courant revient et reste noire avant. L'heure s'affiche quand on porte la montre.
- Parties perdues sans le savoir devenues des fins expliquées : sables mouvants, princesse en cendres, interrupteur détruit,
  princesse abattue. Le « HELP » moqueur d'origine est gardé.
- Pièces magiques : douze étapes d'indices et sept indices de situation.
- Bips et coup de feu d'origine dans les deux versions ; une quarantaine de bruitages et d'ambiances du manoir dans la
  version moderne (portes, cercueil, acide, chauves-souris, vampire, glas du soir…).
- Musique « The Count's Last Night » (Suno) : écran d'introduction, et dehors et au village si l'option est activée.
- Notes sur l'étagère : difficulté 3,7, note globale 3,6.

### Moteur
- BASIC : INKEY$ ne bloque plus (une boucle d'attente devient une attente de touche), CLS n en couleur, SET et RESET,
  boucles FOR vides rejouées comme des pauses.
- Écran du Dragon : couleurs du fond, texte en cases vertes, semi-graphiques ; les attentes de touche du jeu sont
  laissées au joueur dans la version classique.

## 0.7.2 — 17 novembre 2026

- Étagère : sous la description de chaque aventure, sa difficulté et sa note globale sur 5, en étoiles remplies au
  dixième près (El Diablero 4,2 et 3,8 ; Dragon Mountain 3,6 et 3,3 ; S.S. Poseidon 3,1 et 3,1).
- Étagère : en anglais, « Bill and Debbie Cook » ; la boîte choisie au clavier n'est plus rognée au bord.
- README : bande-annonce sur YouTube.

## 0.7.1 — 17 novembre 2026

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
- Pièces magiques : huit étapes d’indices et sept indices de situation.

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
