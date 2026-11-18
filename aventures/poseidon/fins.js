// Les fins de l'aventure, pour la collection de l'étagère (voir aventures/eldiablero/fins.js).
const FINS=[
 {id:'victoire',won:true,fr:'La liberté',en:'Freedom',
  frNote:'Le garde-côte t’attendait à la sortie du paquebot.',enNote:'The coast guard cutter was waiting for you outside the liner.'},
 {id:'naufrage',test:/YOU WERE TOO LATE/,fr:'Le naufrage',en:'The sinking',
  frNote:'Le navire s’est rempli d’eau avant que tu ne sortes.',enNote:'The ship filled with water before you got out.'},
 {id:'sang',test:/LOST TOO MUCH BLOOD/,fr:'Trop de blessures',en:'Too many wounds',
  frNote:'Tu as perdu trop de sang pour continuer.',enNote:'You lost too much blood to continue.'},
 {id:'huile',test:/FELL INTO THE OIL/,fr:'La nappe d’huile',en:'The oil slick',
  frNote:'Tu es tombé dans l’huile.',enNote:'You fell into the oil.'},
 {id:'couperet',test:/CLEAVER CUT OFF YOUR FOOT/,fr:'Le couperet',en:'The cleaver',
  frNote:'Le couperet t’a coupé le pied, et personne ne pouvait t’aider.',enNote:'The cleaver cut off your foot, and no one could help.'},
 {id:'gilet',test:/NOT WEARING A LIFE JACKET/,fr:'Sans gilet de sauvetage',en:'No life jacket',
  frNote:'Le mur d’eau t’a emporté.',enNote:'The wall of water swept you away.'},
 {id:'passage',test:/FLOODED BALLROOM/,fr:'Le passage secret',en:'The secret passage',
  frNote:'Le passage secret menait à la salle de bal inondée.',enNote:'The secret passage led into the flooded ballroom.'},
 {id:'noir',test:/LOST IN THE DARK PASSAGES/,fr:'Perdu dans le noir',en:'Lost in the dark',
  frNote:'Sans lumière, l’eau t’a rattrapé dans les coursives.',enNote:'Without a light, the water caught you in the passages.'},
 {id:'fumee',test:/CHOKE TO DEATH/,fr:'La fumée',en:'The smoke',
  frNote:'Sans extincteur, l’incendie t’a enfermé.',enNote:'Without an extinguisher, the fire trapped you.'}
];
