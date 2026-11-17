// The Final Countdown — les lieux : titre français, titre anglais, sorte de décor, et place sur la carte.
// Clé : numéro du lieu dans le programme (1 à 20).
// POS : [colonne, ligne, niveau] ; niveau 0 = la surface (le désert, l'entrée, les bureaux), 1 = le silo, sous terre
// (on y descend par l'escalier de la réserve ; l'ascenseur du hall remonte au centre de transmissions).
const ROOMS={
  '1':["Le désert","The desert",'desert'],
  '2':["La camionnette","The van",'van'],
  '3':["L'entrée principale","The main gate",'gate'],
  '4':["Le hall administratif","The administration area",'office'],
  '5':["La salle informatique","The computer room",'tech'],
  '6':["Le bureau du personnel","The personnel office",'office'],
  '7':["Le centre de commandement","The command center",'tech'],
  '8':["La réserve obscure","The dark storage room",'store'],
  '9':["La salle de repos","The employee lounge",'office'],
  '10':["Le bureau du commandant","The C.O.'s office",'office'],
  '11':["Le hall moquetté","The carpeted lobby",'office'],
  '12':["La salle de suivi radar","The radar tracking room",'tech'],
  '13':["Le labyrinthe de couloirs","The maze of hallways",'hall'],
  '14':["La salle d'observation","The observation room",'tech'],
  '15':["La réserve de fournitures","The supply room",'store'],
  '16':["Le centre de transmissions","The communications center",'tech'],
  '17':["Le grand couloir","The wide hall",'hall'],
  '18':["Le couloir","The hallway",'hall'],
  '19':["La salle de stratégie","The strategy room",'tech'],
  '20':["Le poste de contrôle de tir","The launch control center",'tech']
};
const POS={
  16:[0,0,0], 17:[1,0,0], 18:[2,0,0], 8:[3,0,0],
  15:[0,1,0], 5:[1,1,0], 9:[3,1,0],
  10:[0,2,0], 4:[1,2,0], 6:[3,2,0],
  3:[1,3,0], 2:[1,4,0], 1:[1,5,0],
  7:[1,0,1],
  12:[1,1,1], 19:[2,1,1],
  11:[0,2,1], 14:[1,2,1], 13:[2,2,1],
  20:[1,3,1]
};
