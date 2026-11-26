// Les fins de l'aventure, pour la collection de l'étagère (voir aventures/eldiablero/fins.js). À compléter.
const FINS=[
 {id:'victoire',won:true,fr:'La forêt',en:'The forest',frNote:'Les seize trésors posés dans la forêt, les huit sortilèges appris : tu es sorti du labyrinthe.',enNote:'Sixteen treasures laid down in the forest, eight spells learned: you got out of the labyrinth.'},
 {id:'epuisement',test:/DIED FROM EXHAUSTION/,fr:'L’épuisement',en:'Exhaustion',frNote:'Tes blessures et ta fatigue ont eu raison de toi.',enNote:'Your wounds and weariness got the better of you.'},
 {id:'brouillard',test:/POISON FOG HAS KILLED/,fr:'Le brouillard empoisonné',en:'The poison fog',frNote:'Il ne fallait pas s’attarder dans la brume.',enNote:'You should not have lingered in the mist.'},
 {id:'scorpion',test:/DIED FROM A SCORPION/,fr:'Le scorpion',en:'The scorpion',frNote:'Son venin a fait son œuvre.',enNote:'Its venom did its work.'}
];
