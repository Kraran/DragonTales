# DragonTales — ajouter une aventure

DragonTales est une seule page, `DragonTales.html`, fabriquée par `build.py` à partir de deux choses :

- `moteur/` — ce qui est commun à toutes les aventures ;
- `aventures/<nom>/` — un dossier par aventure. Tout dossier qui contient un `aventure.js` apparaît sur l'étagère.

```
build.py                      assemble DragonTales.html
VERSION                       numéro de version affiché sur l'étagère
moteur/
  cpu6809.js                  processeur 6809
  machine.js                  mémoire du Dragon + appels à la ROM remplacés (affichage, clavier, saisie, CSAVE/CLOAD)
  dragontales.js              étagère + interface de jeu (journal, verbes, carte, version classique, sauvegardes, pièces, musique)
  sfx.js                      effets sonores synthétisés
  template.html               page et styles
  dragon.ttf, mkfont.py       police de la version classique
aventures/eldiablero/
  aventure.js                 la fiche : tout ce que le moteur doit savoir de ce jeu
  fr.js                       traduction (textes par adresse, vocabulaire, commandes françaises -> anglaises)
  data.js                     lieux : titre français, titre anglais, type de décor
  scenes.js                   illustrations (décors et objets)
  hints.js                    indices des pièces magiques
  programme.bin               code machine d'origine, extrait de la cassette
  boite.jpg  couverture.jpg  musique.ogg
outils/
  cas.py, dis.py              extraction du binaire d'une cassette, désassembleur de travail
tests/
  rejouer-solution.js         rejoue une solution sans navigateur (doit finir par VICTOIRE)
  essai.js                    essai complet dans Chrome (étagère, partie entière, retour, reprise)
```

## Les étapes

1. **Créer le dossier** `aventures/<nom>/` et y déposer `programme.bin` (le binaire extrait du `.cas`), `boite.jpg`
   (image de l'étagère, format portrait), `couverture.jpg` (fond de l'écran d'introduction, 16/9) et, si on veut, `musique.ogg`.
2. **Écrire `aventure.js`** en partant de celui d'El Diablero. Il appelle `DragonTales.register({...})` avec :
   - l'identité : `id`, `storage` (préfixe des sauvegardes), `title`, `author`, `publisher`, `year`, `system`, `blurb.fr/en` ;
   - `machine` : adresse de chargement, routine d'affichage des textes, adresse de victoire, attente de l'écran titre, correctifs ;
   - `world` : comment lire la partie en mémoire (lieu courant, sorties, objets et où ils sont), le format des commandes de
     déplacement, le nettoyage des textes (invite, listes), les zones où la musique revient, les sons d'ambiance ;
   - `labels.fr/en` : texte d'introduction, crédit, mot d'adieu ; `verbs` : les boutons de verbes ; `sfxAt` : sons liés aux textes ;
   - les modules du dossier : `FR`, `ROOMS`, `SCENES`, `HINTS` (sans `HINTS`, pas de pièces magiques).
3. **Écrire les modules** : `fr.js` (traduction), `data.js` (lieux), `scenes.js` (dessins), `hints.js` (indices).
   Ils sont assemblés par ordre alphabétique, `aventure.js` en dernier, dans une portée propre à l'aventure :
   deux aventures peuvent donc utiliser les mêmes noms (`FR`, `ROOMS`…) sans se gêner.
4. **Vérifier** : `node tests/rejouer-solution.js <nom> solution.txt`, puis `python build.py` et ouvrir `DragonTales.html`.

## Ce que le moteur attend d'une aventure

- un programme **en code machine** qui passe par la ROM du Dragon pour l'écran et le clavier. Les appels déjà remplacés
  sont dans `moteur/machine.js` ; un appel inconnu arrête le jeu avec « Appel ROM non géré $xxxx », ce qui indique quoi ajouter ;
- une **routine d'affichage unique** recevant l'adresse du texte (`machine.textHook`) : c'est elle qui permet la traduction
  et le changement de langue en cours de partie ;
- des **lieux sur une grille** (`world.cols` colonnes) pour la carte. Les passages hors grille sont tracés au fur et à mesure.

Ce qui demandera du travail dans le moteur : un jeu écrit en BASIC (il faudrait la ROM BASIC ou un interpréteur), un jeu
sans routine d'affichage unique, ou une carte qui n'est pas une grille. Dans tous les cas il faut d'abord désassembler le
programme pour trouver ses tables : c'est la partie longue, propre à chaque jeu.

## Sauvegardes

Chaque aventure range ses parties et ses réglages dans le navigateur sous son préfixe `storage`
(`eldiablero.slot.auto`, `eldiablero.music`…). Ne pas changer ce préfixe une fois l'aventure publiée.
