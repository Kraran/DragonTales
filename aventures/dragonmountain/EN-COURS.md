# Dragon Mountain — intégration en cours

Cette aventure n'est pas encore assemblée dans `DragonTales.html` : `build.py` ignore tout dossier qui contient ce fichier.
Le plan complet est dans `docs/PLAN-DRAGON-MOUNTAIN.md`.

Fait :
- programme extrait de la cassette (`programme.bin`) et listing lisible (`programme.bas`, par `outils/detok.py`) ;
- le programme tourne dans l'interpréteur Dragon BASIC du moteur (`moteur/basic.js`) ;
- `solution.txt` gagne la partie avec la graine 2 ; `node tests/rejouer-solution.js dragonmountain` le vérifie ;
- `aventure.js` sait lire la partie : lieu courant, passages, objets, épreuves.

Reste : l'interface (texte par lignes, carte sans grille, fins), la traduction, les illustrations, les indices, les sons.
