// Stalag — indices des pièces magiques. L'étape en cours se lit dans les variables du programme.
// Deux indices par étape (une piste, puis la solution) ; les indices de situation passent avant, une seule fois chacun.
// A(n) : lieu de l'objet n (-1 = porté, 0 = caché) ; F : lieu du joueur ; o : numéro du lieu moins un.
// C(1) cadenas de la baraque 3 ouvert, C(2) laçage coupé, C(3) chien nourri, C(4) boîte de jambon ouverte,
// C(10) courant coupé, C(11) hémorragie. B(31,1)=3 : porte de la baraque 3 ouverte ; B(3,6)=30 : ouverture sous le lit.
const HINTS=(function(){
const A=(m,n)=>Math.floor(m.a('A',n)), C=(m,n)=>m.a('C',n), F=m=>m.v('F');
const carried=m=>{ let n=0; for(let i=1;i<=85;i++) if(A(m,i)===-1) n++; return n; };
const STEPS=[
 {id:'mitard', done:m=>F(m)!==17,
  fr:["Les gardes t’ont laissé au mitard, mais pas les poches vides. Fais l’inventaire.",
      "Tu as une aiguille : crochète le trou de serrure de la porte (CROCHETER TROU DE SERRURE)."],
  en:["The guards left you in the hot box, but not with empty pockets. Check your inventory.",
      "You have a needle: pick the keyhole of the door (PICK HOLE)."]},
 {id:'combinaison', done:m=>m.a('B',15,2)===18,
  fr:["La porte sud de la baraque des gardes a un cadenas à six chiffres. Un prisonnier célèbre a laissé son matricule aux douches.",
      "Aux douches (à l’ouest de la baraque des gardes, puis au nord et à l’est), examine les patères puis le blouson : matricule C660723. Reviens dans la baraque des gardes, ouvre le cadenas à combinaison, tape 660723, puis ouvre la porte."],
  en:["The south door of the guard barracks has a six-number lock. A famous prisoner left his serial number in the shower hut.",
      "In the shower hut (west of the guard barracks, then north and east), examine the hooks, then the jacket: serial number C660723. Back in the guard barracks, open the combination lock, type 660723, then open the door."]},
 {id:'ouvreboite', done:m=>A(m,37)===-1||C(m,4)===1,
  fr:["Derrière la porte des gardes, le portail. Quelque chose d’utile traîne au pied de la clôture ouest. Ramasse-le, mais ne touche pas la clôture.",
      "Du portail, va à l’ouest puis au nord : prends l’ouvre-boîte au pied de la clôture ouest. Surtout ne pousse, ne coupe et ne prends pas la clôture : elle est électrifiée."],
  en:["Past the guards’ door is the gate. Something useful is lying at the foot of the west fence. Pick it up, but don’t touch the fence.",
      "From the gate, go west then north: take the can opener at the foot of the west fence. Whatever you do, don’t push, cut or take the fence: it is electrified."]},
 {id:'jambon', done:m=>C(m,4)===1,
  fr:["Les Allemands ont oublié des provisions au réfectoire, bien au frais.",
      "Au réfectoire (tout à l’est, après le foyer des officiers), examine la glacière : il y a une boîte de jambon. Ouvre-la avec l’ouvre-boîte que tu portes, puis prends le jambon."],
  en:["The Germans left some food in the chow hall, nice and cold.",
      "In the chow hall (far east, past the officers’ rest area), examine the icebox: there is a tin of ham. Open it with the can opener you carry, then take the ham."]},
 {id:'chien', done:m=>C(m,3)===1,
  fr:["Le berger allemand de la cour d’exercice garde sa niche. Il a sûrement faim.",
      "Prends le jambon et va dans la cour d’exercice (au sud du foyer des officiers) : pose-le (POSER JAMBON). Le chien le mangera tranquillement dans un coin."],
  en:["The German shepherd in the exercise yard guards his dog house. He is surely hungry.",
      "Take the ham to the exercise yard (south of the officers’ rest area) and drop it (DROP HAM). The dog will eat it quietly in a corner."]},
 {id:'ciseaux', done:m=>A(m,28)===-1||C(m,2)===1,
  fr:["Il te faudra de quoi couper du cuir. L’infirmerie a des instruments.",
      "À l’infirmerie (à l’ouest du foyer des soldats), examine la table d’opération : prends les ciseaux qui y étaient."],
  en:["You will need something that cuts leather. The hospital has instruments.",
      "In the hospital (west of the enlisted rest area), examine the operating table: take the scissors that were on it."]},
 {id:'cle', done:m=>A(m,60)===-1||C(m,1)===1,
  fr:["Le ballon de football de la cour cache quelque chose de dur dans son laçage.",
      "Dans la cour d’exercice, examine le ballon puis le laçage. Coupe le laçage avec les ciseaux (COUPER LACAGE) et prends la clé."],
  en:["The football in the yard has something hard hidden in its lacing.",
      "In the exercise yard, examine the football, then the lacing. Cut the lacing with the scissors (CUT LACING) and take the key."]},
 {id:'outils', done:m=>A(m,20)===-1&&A(m,47)===-1,
  fr:["Pour creuser un tunnel, il faut une pelle et une pioche. L’une est au potager, l’autre dans un casier.",
      "Prends la pioche au potager. Dans la baraque n° 1 (au nord de l’allée ouest), examine le casier deux fois : sous la ceinture, il y a une pelle. Prends-la."],
  en:["To dig a tunnel you need a shovel and a pick axe. One is in the garden, the other in a locker.",
      "Take the pick axe in the garden. In barracks #1 (north of the west end of the lane), examine the locker twice: under the belt there is a shovel. Take it."]},
 {id:'cadenas', done:m=>C(m,1)===1,
  fr:["La baraque n° 3, celle des « OFFICIERS », est fermée par un cadenas. Tu as une clé.",
      "Va à la porte de la baraque n° 3, au nord du bout est de l’allée, et ouvre le cadenas avec la clé (OUVRIR CADENAS)."],
  en:["Barracks #3, the “OFFICERS” one, is closed with a padlock. You have a key.",
      "Go to the door of barracks #3, north of the east end of the lane, and open the padlock with the key (OPEN PADLOCK)."]},
 {id:'porte', done:m=>m.a('B',31,1)===3,
  fr:["Le cadenas est ouvert ; la porte, pas encore.",
      "Ouvre la porte (OUVRIR PORTE), puis entre au nord."],
  en:["The padlock is open; the door isn’t yet.",
      "Open the door (OPEN DOOR), then go in to the north."]},
 {id:'ouverture', done:m=>m.a('B',3,6)===30,
  fr:["Les officiers creusaient un tunnel. Regarde sous les lits.",
      "Dans la baraque n° 3, pousse les lits, prends les carreaux, puis les planches : une ouverture apparaît. Si tes mains sont pleines, pose d’abord l’ouvre-boîte et les ciseaux."],
  en:["The officers were digging a tunnel. Look under the beds.",
      "In barracks #3, push the beds, take the tiles, then the boards: an opening appears. If your hands are full, drop the can opener and the scissors first."]},
 {id:'tunnel', done:()=>false,
  fr:["Le tunnel des officiers n’est pas fini. Un seul de ses bras mène hors du camp.",
      "Descends dans l’ouverture, va à l’est et creuse le tunnel (CREUSER TUNNEL) avec la pelle et la pioche. Puis monte : c’est la forêt."],
  en:["The officers’ tunnel isn’t finished. Only one of its branches leads out of the camp.",
      "Go down the opening, head east and dig the tunnel (DIG TUNNEL) with the shovel and the pick axe. Then go up: it’s the forest."]}
];
// indices de situation
const SPOTS=[
 {when:(m,o)=>[17,22,23,24,25].includes(o)&&C(m,10)!==1, fr:"Le courant passe dans la clôture et le portail : ne les touche pas, ne les pousse pas, ne les coupe pas.", en:"The fence and the gate are live: don’t touch, push or cut them."},
 {when:(m,o)=>o===15&&C(m,3)!==1&&C(m,11)===0&&A(m,82)!==-1, fr:"Ne traîne pas dans la cour sans rien pour le chien : la prochaine fois que tu y entres, il sortira de sa niche et mordra.", en:"Don’t hang around the yard with nothing for the dog: next time you come in, he will run out of his dog house and bite."},
 {when:(m,o)=>C(m,11)>0, fr:"Tu saignes. Il te faut les bandages et la bouteille d’alcool de l’armoire à pharmacie, et les porter tous les deux à l’infirmerie.", en:"You are bleeding. You need the bandages and the bottle of alcohol from the medicine cabinet, and to carry both in the hospital."},
 {when:(m,o)=>o===14&&A(m,56)!==0, fr:"La radio est branchée et brûlante. Ne la prends pas, ne l’ouvre pas.", en:"The radio is plugged in and hot. Don’t take it, don’t open it."},
 {when:(m,o)=>o===24, fr:"Ce creux près de la clôture est un piège : creuser ici ne mène qu’au fond d’un trou sans sortie.", en:"This dip by the fence is a trap: digging here only leads to the bottom of a hole with no way out."},
 {when:(m,o)=>o===26, fr:"Ne creuse pas le tunnel nord : il s’effondrerait sur toi.", en:"Don’t dig the north tunnel: it would collapse on you."},
 {when:(m,o)=>o===2&&carried(m)>=5&&m.a('B',3,6)!==30, fr:"Tu ne peux porter que cinq objets. Pose ce qui ne sert plus (l’ouvre-boîte, les ciseaux) avant de prendre les carreaux et les planches.", en:"You can only carry five things. Drop what you no longer need (the can opener, the scissors) before taking the tiles and the boards."}
];
function step(mem){ for(let i=0;i<STEPS.length;i++) if(!STEPS[i].done(mem)) return i; return STEPS.length-1; }
function spot(mem,off){ return SPOTS.findIndex(s=>s.when(mem,off)); }
return {STEPS,SPOTS,step,spot,args:()=>null};
})();
