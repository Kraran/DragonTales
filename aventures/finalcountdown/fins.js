// Les fins de l'aventure, pour la collection de l'étagère (voir aventures/eldiablero/fins.js).
const FINS=[
 {id:'victoire',won:true,fr:'Le compte à rebours arrêté',en:'Countdown stopped',
  frNote:'Tu as arrêté le lancement à temps.',enNote:'You stopped the launch in time.'},
 {id:'bouton',test:/YOU JUST LAUNCHED A MISSILE/,fr:'Le bouton UN',en:'Button ONE',
  frNote:'C’est toi qui as lancé le missile.',enNote:'You launched the missile yourself.'},
 {id:'temps',test:/YOU'RE TOO LATE\. THE MISSILE/,fr:'T moins zéro',en:'T minus zero',
  frNote:'Le compte à rebours est arrivé à zéro.',enNote:'The countdown reached zero.'},
 {id:'taser',test:/BATTERY ON YOUR TASER/,fr:'La batterie vide',en:'The flat battery',
  frNote:'Ton pistolet paralysant n’avait plus de charge.',enNote:'Your taser had no charge left.'},
 {id:'general',test:/THE GENERAL GOT YOU/,fr:'Le général',en:'The general',
  frNote:'Le général t’a rattrapé.',enNote:'The general got you.'},
 {id:'fenetre',test:/YOU SUFFERED A PAINFUL INJURY/,fr:'La fenêtre brisée',en:'The broken window',
  frNote:'On ne passe pas par une vitre brisée sans se blesser.',enNote:'You cannot go through broken glass unhurt.'},
 {id:'courant',test:/CURRENT CURSES THROUGH/,fr:'Le courant',en:'The current',
  frNote:'Couper un fil sous tension sans protection ne pardonne pas.',enNote:'Cutting a live wire without protection is fatal.'},
 {id:'feu',test:/THE FIRE HAS YOU TRAPPED/,fr:'L’incendie',en:'The fire',
  frNote:'Sans extincteur, la fumée a envahi le bureau.',enNote:'Without an extinguisher, the smoke filled the office.'}
];
