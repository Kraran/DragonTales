// Les fins de l'aventure, pour la collection de l'étagère. Une fin est reconnue au texte anglais d'origine affiché
// pendant le dernier coup (test), au lieu où elle arrive (room : clé de ROOMS) et, si dead est vrai, seulement quand
// le jeu annonce la mort. La première qui correspond l'emporte ; won : la victoire.
const FINS=[
 {id:'victoire',won:true,fr:'Le maître retrouvé',en:'The master found',
  frNote:'Le coyote au regard humain était ton maître : l’apprentissage est terminé.',enNote:'The coyote with human eyes was your master: your apprenticeship is over.'},
 {id:'serpent',test:/HE BIT ME/,fr:'La morsure du serpent',en:'The snakebite',
  frNote:'On n’attrape pas un serpent à sonnette à mains nues.',enNote:'You do not pick up a rattlesnake with your bare hands.'},
 {id:'machette',dead:true,room:'19AD',fr:'L’homme à la machette',en:'The man with the machete',
  frNote:'Face à l’homme à la machette, il fallait agir vite, et avec ce qu’il fallait.',enNote:'Facing the man with the machete, you had to act fast, with the right thing in hand.'},
 {id:'aigle',test:/EAGLE KNOCKS YOU OFF/,fr:'L’attaque de l’aigle',en:'The eagle’s attack',
  frNote:'L’aigle t’a précipité du haut de la montagne.',enNote:'The eagle knocked you off the mountain.'},
 {id:'gouffre',dead:true,test:/I'M FALLING/,fr:'La chute',en:'The fall',
  frNote:'Le gouffre ne pardonne pas un pas de trop.',enNote:'The chasm does not forgive one step too many.'},
 {id:'poison',test:/POISON AIR/,fr:'L’air empoisonné',en:'The poisoned air',
  frNote:'On ne s’attarde pas dans la caverne de l’étang.',enNote:'You do not linger in the cavern of the pond.'},
 {id:'pouvoir',test:/YOU HAVE NOT LEARNED/,fr:'Un pouvoir inutile',en:'A useless power',
  frNote:'Un pouvoir ne sert à rien si l’on n’a rien appris.',enNote:'A power is useless if you have learned nothing.'},
 {id:'diablero',dead:true,room:'20BB',fr:'Le diablero',en:'The diablero',
  frNote:'Tu n’étais pas prêt à affronter son pouvoir.',enNote:'You were not ready to meet his power.'}
];
