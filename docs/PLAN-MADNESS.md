# Plan d'intégration — Madness and the Minotaur (Spectral Associates, 1981 ; Dragon Data, 1982)

Huitième aventure de DragonTales. Écrite par Tom Rosenbaum (fondateur de Spectral Associates) pour le TRS-80 Color
Computer en 1981, adaptée au Dragon 32 un an plus tard. Au 26/11/2026, elle tourne dans la page d'essai, en anglais ;
le dossier porte `EN-COURS.md` (absent de la page normale, `python build.py --tout` pour l'inclure).

## Le jeu en bref

- Le labyrinthe du roi Minos, à Cnossos. Il faut apprendre les **huit sortilèges** (VETAR, MITRA, OKKAN, AKHIROM, NERGAL,
  BELROG, CROM, ISHTAR) et déposer les **seize trésors** dans la forêt (lieu 202). 240 points.
- **256 lieux** : quatre étages de 8 × 8. Les trois dernières rangées de chaque étage, et presque tout le quatrième, sont un
  dédale de tunnels identiques. Passages à sens unique, 24 endroits où sauter (JUMP), passages qui envoient au hasard.
- **40 objets**, dont 16 trésors ; une partie est « protégée » : il faut porter une certaine combinaison d'objets pour
  les prendre. Six créatures (lutin, troglodyte, scorpion, nymphe, satyre, Minotaure) et une hydre ; on les tue en portant
  les bons objets. L'Oracle donne ces combinaisons.
- **Tout change à chaque partie** : place des objets et des sortilèges, combinaisons, lieux des créatures. Le plan du
  labyrinthe, lui, est fixe.
- **Temps réel** : une interruption, 60 fois par seconde, fait vivre le labyrinthe. Chaque seconde, les créatures
  présentes attaquent et la lampe brûle son huile ; chaque minute, elles se déplacent et le sol peut trembler (des
  passages se bouchent). Sur la machine d'origine, tout cela continue pendant qu'on lit et qu'on tape.
- État physique (255 au départ), qui baisse avec les coups, les sauts manqués, les sortilèges ; le poids et le volume du
  sac limitent ce qu'on porte.
- Le désassemblage complet de la version CoCo par Chris Cantrell (computerarcheology.com) sert de référence ; la
  version Dragon est la même, déplacée en mémoire (code chargé en $1000, données décalées de $B55).

## Comment il tourne ici

- `moteur/flux.js` (nouveau) : le processeur 6809 de `moteur/cpu6809.js` (qui gagne l'instruction RTI et les
  interruptions) fait tourner le code d'origine ; le texte est lu caractère par caractère à la sortie de ses routines
  d'affichage et traité comme celui des jeux en BASIC (traduction phrase par phrase, version classique, journal).
- Saisie : la routine du jeu reçoit les touches de la commande ; l'interruption tourne quelques secondes à chaque
  commande (réglage `seconds`, voir décision 1).
- La ROM du Dragon n'est pas fournie : le jeu y puise ses octets « au hasard » ; elle est remplie d'octets
  pseudo-aléatoires. La graine des essais fixe le nombre de tours d'attente à l'écran titre, donc la partie.
- QUIET (sauvegarde sur cassette) renvoie vers le bouton des sauvegardes de la page.

## Fichiers

| Fichier | Contenu |
|---|---|
| `programme.bin` | Le jeu (« DMINO », 16 Ko de code machine, chargé et lancé en $1000), extrait de la cassette |
| `boite.webp` / `couverture.webp` | La boîte et le fond de l'introduction |
| `aventure.js` | La fiche : adresses de la version Dragon, lecture des lieux, des passages, des objets |
| `data.js` | Les 256 lieux, titres tirés des descriptions du jeu (titres français à écrire) |
| `textes.js`, `fins.js` | Ébauches (le jeu s'affiche en anglais) |
| `scenes.js`, `sons.js`, `hints.js`, `solution.txt` | Ébauches |

## Étapes

### 1. Programme, boîte, couverture, moteur — fait
### 2. Décisions à prendre

1. **Le temps** : temps réel comme à l'origine (les créatures bougent et frappent pendant qu'on lit et qu'on tape,
   des messages arrivent seuls), ou un temps qui avance à chaque commande (quelques secondes par commande, avec une
   commande ATTENDRE pour laisser passer une minute) ?
2. **Le hasard** : garder une partie différente à chaque fois (fidèle), ou proposer aussi une partie fixe ?
3. **Les bugs d'origine** (huit relevés sur la version CoCo, par exemple « YOUR SIGHT IS DIM » jamais affiché, ISHTAR
   qui ne guérit pas du brouillard empoisonné) : les corriger, comme pour les autres aventures ?
4. **La difficulté** : le jeu est réputé l'un des plus durs de son époque (dédales identiques, éboulements, sauts
   mortels, temps réel). Le garder tel quel, ou adoucir certains points ?
5. **La musique** : partout, ou seulement hors du dédale ?

### 3. Ensuite

- Traduction (phrases du jeu, descriptions des lieux, descriptions aléatoires des passages, objets, sortilèges).
- Carte des quatre étages (positions déjà là : la grille du jeu), noms des lieux en français.
- Solution pour une graine fixe (essais automatiques), fins, indices des pièces magiques (lus dans la mémoire :
  combinaisons et lieux changent à chaque partie), décors, bruitages, musique.
