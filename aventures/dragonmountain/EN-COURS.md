# Dragon Mountain — intégration en cours

Cette aventure n'est pas encore assemblée dans `DragonTales.html` : `build.py` ignore tout dossier qui contient ce fichier.
Le plan complet est dans `docs/PLAN-DRAGON-MOUNTAIN.md`.

Fait :
- programme extrait de la cassette (`programme.bin`) et listing lisible (`programme.bas`, par `outils/detok.py`) ;
- le programme tourne dans l'interpréteur Dragon BASIC du moteur (`moteur/basic.js`) ;
- `solution.txt` gagne la partie avec la graine 2 ; `node tests/rejouer-solution.js dragonmountain` le vérifie ;
- `aventure.js` sait lire la partie : lieu courant, passages, objets, épreuves ;
- deux bugs d'origine corrigés au chargement (`machine.patches`) : le dragon qui bloquait la partie, le gobelet qui nourrissait.

- l'interface sait jouer les jeux en BASIC : l'aventure se joue de bout en bout, en français et en anglais, en version
  moderne et classique (`python build.py --tout`, essai : `tests/essai-dragonmountain.js`) ;
- traduction française complète (première version), titres des lieux, carte sur deux étages.

Reste : les illustrations (décors provisoires pour l'instant), les indices des pièces magiques, la musique, une relecture
de la traduction en jouant.
