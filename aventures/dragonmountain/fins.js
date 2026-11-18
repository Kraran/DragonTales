// Les fins de l'aventure, pour la collection de l'étagère (voir aventures/eldiablero/fins.js).
const FINS=[
 {id:'victoire',won:true,fr:'Le trésor au soleil',en:'Treasure in the sunshine',
  frNote:'Tu es ressorti de la montagne avec tout le trésor.',enNote:'You came out of the mountain with all the treasure.'},
 {id:'demon',test:/KILLED BY THE DEMON/,fr:'Le démon',en:'The demon',
  frNote:'Seule l’épée vient à bout du démon.',enNote:'Only the sword can kill the demon.'},
 {id:'dragon',test:/KILLED BY THE DRAGON/,fr:'Le dragon',en:'The dragon',
  frNote:'Seule la dague vient à bout du dragon.',enNote:'Only the dagger can kill the dragon.'},
 {id:'elfe',test:/THE ELF WON/,fr:'Le combat contre l’elfe',en:'The fight with the elf',
  frNote:'L’elfe a gagné le combat.',enNote:'The elf won the fight.'},
 {id:'soif',test:/WITHOUT WATER/,fr:'La soif',en:'Thirst',
  frNote:'Il faut boire pour aller plus loin.',enNote:'You must drink to go any further.'},
 {id:'faim',test:/WITHOUT FOOD/,fr:'La faim',en:'Hunger',
  frNote:'Il faut manger pour aller plus loin.',enNote:'You must eat to go any further.'},
 {id:'fatigue',test:/TOO TIRED TO GO/,fr:'L’épuisement',en:'Exhaustion',
  frNote:'Sans sommeil, l’aventurier ne peut plus avancer.',enNote:'Without sleep, the adventurer cannot go on.'},
 {id:'froid',test:/DIED OF COLD/,fr:'Le froid',en:'The cold',
  frNote:'Là-haut, il faut se protéger du froid.',enNote:'Up there, you must keep out the cold.'}
];
