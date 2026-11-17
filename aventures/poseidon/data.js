// S.S. Poseidon — les lieux : titre français, titre anglais, sorte de décor, et place sur la carte.
// Clé : numéro du lieu dans le programme (1 à 20) ; « 3b » : la salle de bal inondée par le passage secret ;
// « 14b » : le large couloir une fois la porte d'acier arrachée.
// Le navire flotte à l'envers : on monte vers la coque. POS : [colonne, ligne, niveau] ; niveau 0 = la salle de bal,
// 1 = les coursives (on y monte par le câble), 2 = les machines et la coque (par la porte d'acier).
const ROOMS={
  '1':["La salle de bal","The ballroom",'luxe'],
  '2':["Sous la coursive","Below the passageway",'luxe'],
  '3':["Les colonnes de marbre","The marble columns",'luxe'],
  '3b':["La salle de bal inondée","The flooded ballroom",'water'],
  '4':["La cuisine","The galley",'ship'],
  '5':["Le croisement humide","The damp crossing",'dark'],
  '6':["L'infirmerie","The dispensary",'ship'],
  '7':["Le local à outils","The tool room",'ship'],
  '8':["Le salon de coiffure","The barber shop",'ship'],
  '9':["Le croisement obscur","The dark crossing",'dark'],
  '10':["Le poste radio","The communication center",'ship'],
  '11':["Les appartements du commandant","The captain's quarters",'ship'],
  '12':["La salle de navigation","The navigation room",'ship'],
  '13':["Le bureau du commissaire","The purser's office",'ship'],
  '14':["Le large couloir","The wide hall",'ship'],
  '14b':["Le large couloir","The wide hall",'ship'],
  '15':["La corniche","The ledge",'engine'],
  '16':["La salle de conférence","The conference room",'ship'],
  '17':["Les passages bas","The low passages",'engine'],
  '18':["La salle des machines","The engine room",'engine'],
  '19':["La passerelle","The metal walkway",'engine'],
  '20':["La coque","The hull",'engine']
};
const POS={
  1:[1,0,0], 2:[2,0,0], 3:[0,0,0],
  16:[0,0,1], 8:[1,0,1], 6:[2,0,1],
  7:[1,1,1], 5:[2,1,1], 4:[3,1,1],
  13:[1,2,1], 14:[3,2,1],
  12:[1,3,1], 9:[2,3,1], 11:[3,3,1],
  10:[2,4,1],
  17:[0,0,2], 15:[1,0,2], 20:[2,0,2],
  18:[1,1,2], 19:[2,1,2]
};
