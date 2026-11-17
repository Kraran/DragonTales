# Bande-annonce DragonTales

Deux scripts qui refont la bande-annonce (1920 × 1080, 30 images/s, musique d'El Diablero) à partir de la page assemblée.

1. `python build.py`, puis `node outils/bande-annonce/capture.js` : Chrome joue El Diablero (commandes tapées en français,
   légendes et cartons ajoutés dans la page) et enregistre chaque plan en images JPEG dans `/tmp/tr/f/`, avec leurs durées
   dans `/tmp/tr/shots.json`.
2. `python3 outils/bande-annonce/montage.py` : un fichier vidéo par plan (zoom lent sur les images fixes, fondus), puis
   l'assemblage et la fin de la musique d'El Diablero, calée pour finir avec la vidéo : `/tmp/tr/DragonTales-trailer.mp4`.

Les chemins sont ceux de la session où la bande-annonce a été faite (17/11/2026) : à adapter au besoin.
Les cartons ne citent pas de nombre d'aventures : l'étagère grandira.
