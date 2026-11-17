// The Final Countdown — indices des pièces magiques. L'étape en cours se lit dans les variables du programme.
// Deux indices par étape (une piste, puis la solution) ; les indices de situation passent avant, une seule fois chacun.
// O$(n,2) : lieu de l'objet n (« 99 » porté, « 0 » caché) ; o : numéro du lieu moins un (lieu 1 = 0).
const HINTS=(function(){
const O=(m,n)=>m.a('O$',n,2)||'0', has=(m,n)=>O(m,n)==='99', v=(m,k)=>m.v(k);
const lift=m=>/UP/.test(m.a('R$',11,2)||''), cabinet=m=>/OPEN/.test(m.a('O$',24,3)||'');
const STEPS=[
 {id:'uniforme', done:m=>v(m,'F1')===1,
  fr:["Pour entrer dans la base, il faudrait passer pour un militaire. Regarde ce qu’il y a dans la camionnette.",
      "Dans la camionnette, prends l’uniforme du général et mets-le."],
  en:["To get into the base, you would have to pass for a soldier. See what’s in the van.",
      "In the van, take the general’s uniform and wear it."]},
 {id:'papiers', done:m=>has(m,13)||v(m,'ID')===1,
  fr:["L’uniforme du général cache quelque chose.",
      "Examine l’uniforme : prends le pistolet paralysant et les papiers qui en tombent."],
  en:["The general’s uniform hides something.",
      "Examine the uniform: take the taser gun and the papers that fall out."]},
 {id:'entree', done:m=>v(m,'ID')===1,
  fr:["La caméra de l’entrée principale vérifie qui se présente.",
      "À l’entrée principale, en uniforme, montre les papiers."],
  en:["The camera at the main gate checks who is there.",
      "At the main gate, wearing the uniform, show the papers."]},
 {id:'extincteur', done:m=>has(m,35)||(lift(m)&&v(m,'F2')===0),
  fr:["Un bouton de la base met le feu là où il se trouve. Avant d’y toucher, aie de quoi éteindre un incendie.",
      "Prends l’extincteur dans la réserve de fournitures, à l’ouest de la salle informatique (au nord du hall administratif)."],
  en:["A button in the base sets fire to the room it’s in. Before you touch it, have something to put a fire out.",
      "Take the fire extinguisher in the supply room, west of the computer room (north of the administration area)."]},
 {id:'ascenseur', done:m=>lift(m)&&v(m,'F2')===0,
  fr:["Les boutons du bureau du commandant commandent l’ascenseur du hall, sous terre.",
      "Dans le bureau du commandant (à l’ouest du hall administratif), appuie sur TROIS, puis éteins le feu avec l’extincteur."],
  en:["The buttons in the C.O.’s office control the lobby elevator, underground.",
      "In the C.O.’s office (west of the administration area), press THREE, then put the fire out with the extinguisher."]},
 {id:'escalier', done:m=>O(m,25)==='8'||v(m,'L')===7||v(m,'L')===12||v(m,'L')===19||v(m,'L')===13||v(m,'L')===14,
  fr:["Le tableau d’affichage de la salle de repos parle d’escaliers. Il y en a un caché tout près.",
      "Dans la réserve obscure, au nord de la salle de repos, déplace l’armoire métallique : un escalier apparaît. Descends."],
  en:["The bulletin board in the employee lounge talks about stairways. There’s one hidden close by.",
      "In the dark storage room, north of the employee lounge, move the metal cabinet: a stairway appears. Go down."]},
 {id:'pince', done:m=>has(m,31)||O(m,31)==='20',
  fr:["Pour couper un fil, il te faudra un outil.",
      "La pince coupante est dans la salle de suivi radar, au sud du centre de commandement."],
  en:["To cut a wire, you will need a tool.",
      "The wire cutters are in the radar tracking room, south of the command center."]},
 {id:'passage', done:m=>v(m,'PA')===1,
  fr:["Le labyrinthe cache un passage secret : continue d’y marcher, tu finiras par tomber dessus.",
      "Dans le labyrinthe (au sud de la salle de stratégie), avance dans n’importe quelle direction jusqu’à trouver le passage, puis va à l’ouest."],
  en:["The maze hides a secret passage: keep walking and you’ll stumble on it.",
      "In the maze (south of the strategy room), walk in any direction until you find the passage, then go west."]},
 {id:'cle', done:m=>has(m,22)||cabinet(m),
  fr:["Le bureau du hall moquetté a un tiroir.",
      "Dans le hall moquetté (à l’ouest de la salle d’observation), examine le bureau et prends la clé."],
  en:["The desk in the carpeted lobby has a drawer.",
      "In the carpeted lobby (west of the observation room), examine the desk and take the key."]},
 {id:'gants', done:m=>v(m,'F6')===1,
  fr:["Le mécanisme d’annulation est sous tension. Il te faut des gants isolants : la clé ouvre l’armoire où ils sont rangés.",
      "Prends l’ascenseur du hall (haut), retourne à la réserve obscure, déverrouille l’armoire, prends les gants et mets-les."],
  en:["The abort mechanism is live. You need insulating gloves: the key opens the cabinet where they are kept.",
      "Take the lobby elevator (up), go back to the dark storage room, unlock the cabinet, take the gloves and wear them."]},
 {id:'panneau', done:m=>O(m,41)==='20',
  fr:["Au poste de contrôle de tir, un panneau cache le mécanisme d’annulation. Et n’appuie surtout pas sur UN !",
      "Au poste de contrôle de tir (au sud de la salle d’observation), appuie sur TROIS : le panneau s’ouvre."],
  en:["In the launch control center, a panel hides the abort mechanism. And whatever you do, don’t press ONE!",
      "In the launch control center (south of the observation room), press THREE: the panel opens."]},
 {id:'fil', done:()=>false,
  fr:["Un fil pend du mécanisme d’annulation du tir.",
      "Gants aux mains, utilise la pince coupante."],
  en:["A wire hangs from the launch abort mechanism.",
      "With the gloves on, use the wire cutters."]}
];
// indices de situation
const SPOTS=[
 {when:m=>v(m,'XX')===1, fr:"Le général est là ! Tire sur lui tout de suite avec le pistolet paralysant : toute autre commande te serait fatale.", en:"The general is here! Shoot him at once with the taser gun: any other command would be fatal."},
 {when:(m,o)=>o===9&&v(m,'F2')===0&&!lift(m)&&!has(m,35), fr:"Ne touche pas au bouton TROIS sans extincteur : il met le feu au bureau, et tu y resterais enfermé.", en:"Don’t touch button THREE without an extinguisher: it sets the office on fire, and you’d be trapped."},
 {when:(m,o)=>o===19, fr:"N’appuie jamais sur UN ici : c’est le bouton de mise à feu.", en:"Never press ONE here: it’s the firing button."},
 {when:(m,o)=>o===13&&v(m,'WI')===0, fr:"Ne casse pas la vitre : l’extincteur passerait de l’autre côté, et sauter par là te serait fatal.", en:"Don’t break the window: the extinguisher would go through, and jumping after it would be fatal."},
 {when:(m,o)=>o===12&&v(m,'PA')===0, fr:"Le passage se trouve au hasard : continue de marcher dans le labyrinthe.", en:"The passage turns up at random: keep walking through the maze."}
];
function step(mem){ for(let i=0;i<STEPS.length;i++) if(!STEPS[i].done(mem)) return i; return STEPS.length-1; }
function spot(mem,off){ return SPOTS.findIndex(s=>s.when(mem,off)); }
return {STEPS,SPOTS,step,spot,args:()=>null};
})();
