// Les fins de l'aventure, pour la collection de l'étagère (voir aventures/eldiablero/fins.js).
const FINS=[
 {id:'victoire',won:true,fr:'La forêt',en:'The forest',
  frNote:'Par le tunnel de la baraque 3, tu es sorti du camp à temps. Reste à traverser l’Allemagne…',enNote:'Through the barracks 3 tunnel, you got out of the camp in time. Now to cross Germany…'},
 {id:'bombes',test:/BOMBS HIT THE CAMP/,fr:'Le bombardement',en:'The bombing',
  frNote:'Les avions alliés sont arrivés avant que tu sortes.',enNote:'The Allied planes arrived before you got out.'},
 {id:'cloture',test:/FRIED ON THE FENCE/,fr:'La clôture électrique',en:'The electric fence',
  frNote:'Le courant passait encore dans les barbelés.',enNote:'The barbed wire was still live.'},
 {id:'radio',test:/RADIO ELECTRICITY/,fr:'La radio',en:'The radio',
  frNote:'La souris morte à côté de la radio branchée aurait dû te mettre en garde.',enNote:'The dead mouse by the plugged-in radio should have warned you.'},
 {id:'eboulement',test:/TUNNEL COLLAPSED/,fr:'L’éboulement',en:'The cave-in',
  frNote:'Le tunnel nord s’est effondré sur toi.',enNote:'The north tunnel caved in on you.'},
 {id:'tombe',test:/YOUR OWN GRAVE/,fr:'La tombe',en:'The grave',
  frNote:'À force de creuser près de la clôture est, tu es tombé au fond d’un trou sans issue.',enNote:'Digging by the east fence, you fell into a hole with no way out.'},
 {id:'hemorragie',test:/YOU BLED TO DEATH/,fr:'La morsure',en:'The bite',
  frNote:'Mordu par le berger allemand, tu n’as pas soigné ta jambe à temps.',enNote:'Bitten by the German shepherd, you didn’t treat your leg in time.'}
];
