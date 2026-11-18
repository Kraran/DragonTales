// Les fins de l'aventure, pour la collection de l'étagère (voir aventures/eldiablero/fins.js).
const FINS=[
 {id:'victoire',won:true,fr:'La princesse sauvée',en:'The princess saved',
  frNote:'Tu as ramené la princesse au village.',enNote:'You brought the princess back to the village.'},
 {id:'puits',test:/HIT THE BOTTOM OF THE PIT/,fr:'Le puits',en:'The pit',
  frNote:'Tu es tombé au fond du puits.',enNote:'You fell to the bottom of the pit.'},
 {id:'loup',test:/WEREWOLF JUST RIPPED/,fr:'Le loup-garou',en:'The werewolf',
  frNote:'Le loup-garou t’a arraché le cœur.',enNote:'The werewolf ripped your heart out.'},
 {id:'vampire',test:/SUCKED ALL YOUR BLOOD/,fr:'La nuit tombée',en:'Nightfall',
  frNote:'La nuit est tombée, et le vampire s’est réveillé.',enNote:'Night fell, and the vampire woke up.'},
 {id:'sables',test:/QUICKSAND SWALLOWS YOU/,fr:'Les sables mouvants',en:'The quicksand',
  frNote:'Il n’y a pas d’issue au sud de la lande.',enNote:'There is no way out of the south part of the moor.'},
 {id:'cendres',test:/SHE TURNS TO ASH/,fr:'Les cendres',en:'Ashes',
  frNote:'Il fallait tuer le vampire avant d’ouvrir la cassette.',enNote:'The vampire had to be slain before the casket was opened.'},
 {id:'interrupteur',test:/THE SWITCH IS DESTROYED/,fr:'L’interrupteur',en:'The switch',
  frNote:'La cave restera plongée dans le noir.',enNote:'The cellar will stay dark forever.'},
 {id:'princesse',test:/YOU SHOT THE PRINCESS/,fr:'Le coup de feu',en:'The gunshot',
  frNote:'Tu as tiré sur la princesse.',enNote:'You shot the princess.'}
];
