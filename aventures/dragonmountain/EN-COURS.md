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

- illustrations des 35 lieux, des objets et des monstres ; indices des pièces magiques ; boîte alignée sur celle d'El Diablero.

- musique (Suno), en boucle sur l'introduction et, en option, dans le château.

Reste : une relecture de la traduction en jouant, puis la publication en 0.6.0.
