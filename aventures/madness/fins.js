// Les fins de l'aventure, pour la collection de l'étagère (voir aventures/eldiablero/fins.js). Toutes les morts passent
// par « YOU PUT UP A GOOD FIGHT, BETTER LUCK NEXT TIME. » (la routine UNCLE) : on reconnaît d'abord la cause, et
// l'abandon seulement si rien d'autre ne l'explique.
const FINS=[
 {id:'victoire',won:true,fr:'La forêt',en:'The forest',
  frNote:'Huit sortilèges appris, seize trésors posés près de la grande forêt : le labyrinthe de Minos est vaincu.',
  enNote:'Eight spells learned, sixteen treasures laid down by the great forest: the labyrinth of Minos is beaten.'},
 {id:'epuisement',test:/DIED FROM EXHAUSTION AND WOUNDS/,fr:'L’épuisement',en:'Exhaustion',
  frNote:'Les coups des créatures, les chutes et les sortilèges ont fini par t’épuiser.',
  enNote:'The creatures’ blows, the falls and the spells wore you out in the end.'},
 {id:'scorpion',test:/DIED FROM A SCORPION BITE/,fr:'Le scorpion',en:'The scorpion',
  frNote:'Seule la potion guérit sa piqûre, et encore, pas toujours.',
  enNote:'Only the potion cures its sting, and not always.'},
 {id:'brouillard',test:/POISON FOG HAS KILLED YOU/,fr:'Le brouillard empoisonné',en:'The poison fog',
  frNote:'On ne s’attarde pas dans la brume sans connaître NERGAL.',
  enNote:'You don’t linger in the mist without knowing NERGAL.'},
 {id:'champignon',test:/IT'S POISONOUS!!/,dead:true,fr:'Le champignon',en:'The mushroom',
  frNote:'Une fois sur trente-deux, le champignon est vénéneux.',
  enNote:'One time in thirty-two, the mushroom is poisonous.'},
 {id:'fosse',test:/FALLEN INTO A PIT AND KILLED YOURSELF/,fr:'La fosse dans le noir',en:'The pit in the dark',
  frNote:'Sans lumière, chaque pas risque d’être le dernier.',
  enNote:'Without light, every step may be your last.'},
 {id:'saut',test:/YOUR JUMPING ABILITY IS NOT AS GOOD AS IT ONCE WAS/,fr:'Le saut manqué',en:'The failed jump',
  frNote:'Trop chargé, ou trop affaibli : certains sauts ne pardonnent pas.',
  enNote:'Too heavy, or too weak: some jumps are unforgiving.'},
 {id:'abandon',test:/YOU PUT UP A GOOD FIGHT, BETTER LUCK NEXT TIME/,fr:'L’abandon',en:'Giving up',
  frNote:'UNCLE : tu as jeté l’éponge.',
  enNote:'UNCLE: you threw in the towel.'}
];
