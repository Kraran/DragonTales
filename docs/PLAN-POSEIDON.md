# Plan d'intégration — Poseidon Adventure (Dragon Data, 1982)

Troisième aventure de DragonTales, écrite par Bill et Debbie Cook. Elle est en BASIC, comme Dragon Mountain, et tourne donc sur l'interpréteur `moteur/basic.js`. L'aventure est jouable dans `DragonTales.html` depuis le 17/11/2026 ; il reste la musique avant la version 0.7.0.

## Le jeu en bref

- Le paquebot S.S. Poseidon s'est retourné. Il faut remonter vers la coque et en sortir par l'arbre d'hélice avant que le navire ne coule.
- 20 lieux, 23 objets, verbes et noms reconnus par leurs 3 premières lettres.
- Limite de coups selon le niveau choisi au départ : expert 75, moyen 125, débutant 250.
- Sans lampe, au-delà du lieu 3, le joueur tourne en rond dans le noir.
- Victoire : « YOU'VE MADE IT TO FREEDOM ». Défaite : « WANT TO TRY AGAIN? », puis `RUN`.

## Fichiers de la cassette

La cassette contient deux programmes, extraits par `outils/cas.py`, qui lit maintenant la bande bit à bit car elle a des glissements de bits et des octets de synchronisation abîmés :

| Programme | Contenu | Fichier |
|---|---|---|
| `POSEIDON` | Chargeur, instructions, routine machine `$600` pour l'écran partagé | `introduction.bas` |
| `ADVENT` | Le jeu (220 lignes) | `programme.bin` / `programme.bas` |

La routine machine ne sert qu'à faire défiler le bas de l'écran. DragonTales la remplace par sa propre mise en page : le chargeur n'est pas exécuté, et ses instructions seront reprises dans le texte d'introduction.

## Étapes

### 1. Moteur BASIC — fait

Ajouts à `moteur/basic.js` dont Poseidon a besoin :

- `LINE INPUT`, `INKEY$` (attente d'une touche), `POS`, `RUN` (en gardant la graine), `PRINT @` ;
- `SOUND` et `PLAY` transmis au moteur (`io.sound`, `io.play`) ;
- `EXEC`, `CLOAD`, `CSAVE`, `MOTOR` ignorés ;
- les éléments `DATA` gardent leurs espaces de fin (le verbe `"GO "` en dépend) ;
- `endKeyLines` : une attente de touche sur ces lignes signale la fin de partie.

El Diablero et Dragon Mountain gagnent toujours avec leur solution.

### 2. Solution et boîte — fait

- `solution.txt` : 47 commandes, niveau expert, victoire en 47 coups sur 75. La solution du PDF d'origine est fausse et incomplète ; celle-ci est tirée de la logique du programme.
- `boite.jpg` : aligné sur la boîte d'El Diablero (cadre jaune, bande DRAGON 32). `couverture.jpg` : illustration plein cadre.

### 3. Adaptateur de monde et interface — fait

- `aventure.js` : salles (`L`), sorties tirées de `R$(L,2)`, objets `O$(n,…)` (99 = porté, 0 = caché), drapeaux.
- Choix du niveau : fenêtre dans la version moderne (`world.menu`), la question d'origine dans la version classique.
- Écran du Dragon dans la version classique (`machine.screen`) : `PRINT @` place le texte, seules les lignes 8 à 15
  défilent, comme avec la routine `$600` du chargeur. En français, les lignes sont coupées aux espaces.
- Fin de partie : « WANT TO TRY AGAIN? » (O ou Y pour rejouer) dans la version classique, fenêtre de fin dans la moderne.
- Coups restants et niveau de l'eau affichés sur le décor (`world.status`).

### 4. Traduction — fait

- `textes.js` : les 22 descriptions, les 23 objets, tous les messages ; vocabulaire français vers les mots du jeu.

### 5. Illustrations et carte — fait

- `scenes.js` : une scène par lieu, le navire à l'envers (plafonniers au sol, mobilier qui pend du plancher) ;
  l'eau monte au bas de l'image au fil des coups ; salle de bal inondée, porte d'acier ouverte, incendie, corde attachée.
- `data.js` : carte sur trois niveaux (salons, coursives, machines et coque).

### 6. Indices (pièces magiques) — fait

- `hints.js` : huit étapes à deux indices, huit indices de situation (noir complet, incendie, écoutille, tableau, corniche,
  couperet, nourriture, puits).

### 7. Sons et musique — sons faits, musique à venir

- Bips `SOUND` et airs `PLAY` d'origine, dans les deux versions.
- `sons.js` : vapeur, incendie, machines, câble, porte d'acier, mur d'eau, mazout, extincteur, corde, liberté…
- Musique Suno : dans un deuxième temps.

### 8. Essais et publication

- `tests/essai-poseidon.js` dans la CI — fait.
- Musique, captures, release 0.7.0 — à faire.

## Décisions (17/11/2026)

1. **Niveau** : menu au lancement.
2. **Vue classique** : reproduction de l'écran du Dragon.
3. **Sons d'origine** : rejoués.
4. **Bug `EAT`** (ligne 1290) : corrigé — le programme testait `O$(N,2)` au lieu de `O$(N,3)`.
5. **Musique** : dans un deuxième temps.

## Pièges d'origine : gardés, mais expliqués (décision du 17/11/2026)

- **Noir** (ligne 490) : sans lampe au-delà de la salle de bal, la partie continuait sans issue jusqu'à la fin des coups.
  C'est maintenant une mort, avec l'explication : perdu dans le noir, l'eau t'a rattrapé.
- **Incendie du poste radio** (500, 505) : sans extincteur, on restait enfermé. Tenter de sortir tue désormais, avec
  l'explication (la fumée) ; avec l'extincteur porté ou posé dans la pièce, rien ne change.
- **Passage secret** (570, 590) : il mène à la salle de bal inondée. On s'y noie dès l'arrivée, avec l'explication.
- **Mot magique** (1040) : l'aide du poste radio parlait d'un mot magique qui n'existe pas. Elle indique maintenant
  l'extincteur de la cuisine.
- Les textes ajoutés sont en anglais dans le programme, calés sur les 32 colonnes, et traduits comme les autres.
