// Stalag — les lieux : titre français, titre anglais, sorte de décor, et place sur la carte (d'après Stalag-map.pdf).
// Clé : numéro du lieu dans le programme (1 à 34). POS : [colonne, ligne, niveau] ; un seul niveau, nord en haut ;
// les tunnels et la forêt à droite, comme sur la carte fournie.
const ROOMS={
 '1':["La baraque nº 1","Barracks #1",'barracks'],
 '2':["La baraque nº 2","Barracks #2",'barracks'],
 '3':["La baraque nº 3","Barracks #3",'barracks'],
 '4':["L'allée, à l'ouest","Open area, west",'open'],
 '5':["L'allée, côté ouest","Open area, west side",'open'],
 '6':["L'allée, au centre","Open area, centre",'open'],
 '7':["L'allée, côté est","Open area, east side",'open'],
 '8':["L'allée, à l'est","Open area, east",'open'],
 '9':["L'infirmerie","The prison hospital",'hospital'],
 '10':["Le foyer des soldats","The enlisted rest area",'rest'],
 '11':["Les douches","The shower hut",'shower'],
 '12':["Le foyer des officiers","The officers' rest area",'rest'],
 '13':["Le réfectoire","The chow hall",'chow'],
 '14':["Le potager","The vegetable garden",'garden'],
 '15':["La baraque des gardes","The guard barracks",'guard'],
 '16':["La cour d'exercice","The exercise area",'yard'],
 '17':["Le mitard","The hot box",'hotbox'],
 '18':["Le portail, côté camp","Inside the prison gate",'gate'],
 '19':["Sous le mirador sud-ouest","Beneath the SW guard tower",'tower'],
 '20':["Sous le mirador nord-ouest","Beneath the NW guard tower",'tower'],
 '21':["Sous le mirador nord-est","Beneath the NE guard tower",'tower'],
 '22':["Sous le mirador sud-est","Beneath the SE guard tower",'tower'],
 '23':["La clôture nord, côté est","Inside the north fence, east",'fence'],
 '24':["La clôture nord, côté ouest","Inside the north fence, west",'fence'],
 '25':["La clôture est","Inside the east fence",'fence'],
 '26':["La clôture ouest","Inside the west fence",'fence'],
 '27':["Le tunnel nord","The north tunnel",'tunnel'],
 '28':["Le tunnel est","The east tunnel",'tunnel'],
 '29':["Le tunnel sud","The south tunnel",'tunnel'],
 '30':["L'entrée du tunnel","The tunnel entranceway",'tunnel'],
 '31':["Devant la baraque nº 3","At the door to barracks #3",'door'],
 '32':["Le grenier des gardes","The guard barracks attic",'attic'],
 '33':["La forêt","The forest",'forest'],
 '34':["Au fond d'un trou","In a very deep hole",'hole']
};
const POS=[[0,1,0],[2,1,0],[4,1,0],[0,3,0],[1,3,0],[2,3,0],[3,3,0],[4,3,0],[0,4,0],[1,4,0],[2,4,0],[3,4,0],[4,4,0],[1,6,0],[2,6,0],[3,6,0],[2,5,0],
 [2,9,0],[0,9,0],[0,0,0],[4,0,0],[4,9,0],[3,0,0],[1,0,0],[4,8,0],[0,8,0],[5,1,0],[6,2,0],[5,3,0],[5,2,0],[4,2,0],[1,7,0],[7,1,0],[5,8,0]];
if(typeof module!=='undefined') module.exports={ROOMS,POS};
