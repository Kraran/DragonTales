// Eno — les lieux : titre français, titre anglais, sorte de décor, et place sur la carte.
// Clé : numéro du lieu dans le programme (1 à 15). Tout le jeu se passe dans le salon de la tante, découpé en une grille
// de 5 × 3 cases : cinq cases « dans le salon » (le jeu ne les distingue pas) et dix près d'un meuble.
// POS : [colonne, ligne, niveau] ; un seul niveau. Nord en haut :
//   15 14  2  3  4
//   12 13  1  6  5
//   11 10  9  8  7
const ROOMS={
 '1':["Le milieu du salon","The middle of the living room",'salon'],
 '2':["Près de la causeuse","By the love seat",'salon'],
 '3':["Le salon, côté nord","The living room, north side",'salon'],
 '4':["Près du grand aquarium","By the large fish tank",'salon'],
 '5':["Près de la télévision","By the TV",'salon'],
 '6':["Le salon, côté est","The living room, east side",'salon'],
 '7':["Près du fauteuil","By the stuffed chair",'salon'],
 '8':["Près du lampadaire","By the floor lamp",'salon'],
 '9':["Près des rideaux","By the curtains",'salon'],
 '10':["Le salon, côté sud-ouest","The living room, south-west side",'salon'],
 '11':["Près d'une table d'appoint","By an end table",'salon'],
 '12':["Près du canapé","By the sofa",'salon'],
 '13':["Près de la table basse","By the coffee table",'salon'],
 '14':["Le salon, côté nord-ouest","The living room, north-west side",'salon'],
 '15':["Près de l'autre table d'appoint","By the other end table",'salon']
};
const POS=[[2,1,0],[2,0,0],[3,0,0],[4,0,0],[4,1,0],[3,1,0],[4,2,0],[3,2,0],[2,2,0],[1,2,0],[0,2,0],[0,1,0],[1,1,0],[1,0,0],[0,0,0]];
if(typeof module!=='undefined') module.exports={ROOMS,POS};
