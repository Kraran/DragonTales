// S.S. Poseidon — indices des pièces magiques. L'étape en cours se lit dans les variables du programme.
// Deux indices par étape (une piste, puis la solution) ; les indices de situation passent avant, une seule fois chacun.
const HINTS=(function(){
const O=(m,n)=>+m.a('O$',n,3)||0;                  // lieu de l'objet n : 99 = porté, 0 = caché
const L=m=>m.v('L');
const doorOpen=m=>/UP/.test(m.a('R$',14,2));
const STEPS=[
 {id:'lampe', done:m=>O(m,27)===99||L(m)>=4,
  fr:["Plus haut, tout est plongé dans le noir. Avant de quitter la salle de bal, trouve de quoi t’éclairer.",
      "Examine les débris sous les colonnes de marbre, à l’ouest de la salle de bal, puis prends la lampe torche."],
  en:["Further up, everything is pitch dark. Before you leave the ballroom, find something to light your way.",
      "Examine the debris below the marble columns, west of the ballroom, then take the flashlight."]},
 {id:'cable', done:m=>L(m)>=4,
  fr:["Les sorties sont trop haut. Lis le panneau à l’est de la salle de bal, et cherche ce qui t’aiderait à atteindre le plafond.",
      "Porte la chaise sous l’entrée de la coursive, à l’est de la salle de bal, et pose-la. Utilise la lampe torche pour repérer le câble, puis grimpe au câble."],
  en:["The exits are too high. Read the sign east of the ballroom, and look for something to help you reach the ceiling.",
      "Carry the chair below the passageway entrance, east of the ballroom, and drop it. Use the flashlight to spot the cable, then climb the cable."]},
 {id:'vitamines', done:m=>m.v('F1')===1||doorOpen(m),
  fr:["Une énorme porte d’acier barre le large couloir, au sud de la cuisine. Il te faudrait plus de force.",
      "Prends la fiole à l’infirmerie, au nord du croisement humide, et bois les vitamines. Ne mange rien ensuite : la nourriture annulerait leur effet."],
  en:["A huge steel door blocks the wide hall, south of the galley. You would need more strength.",
      "Take the beaker in the dispensary, north of the damp crossing, and drink the vitamins. Don’t eat anything afterwards: the food would cancel their effect."]},
 {id:'porte', done:m=>doorOpen(m),
  fr:["Avec les vitamines dans le sang, tu as la force qu’il faut.",
      "Va dans le large couloir, au sud de la cuisine, ouvre la porte, puis monte."],
  en:["With the vitamins in your blood, you have the strength you need.",
      "Go to the wide hall, south of the galley, open the door, then go up."]},
 {id:'corde', done:m=>O(m,26)===99||m.v('F3')===2,
  fr:["Au-dessus du mazout en flammes, seule une corde bien attachée permet de passer au sud.",
      "Sur la corniche : prends la corde, attache la corde, réponds « à la corniche », puis va au sud. Prends le pied-de-biche dans la salle des machines."],
  en:["Above the flaming oil, only a well-tied rope lets you cross to the south.",
      "On the ledge: take the rope, tie the rope, answer “to ledge”, then go south. Take the crowbar in the engine room."]},
 {id:'armoire', done:m=>m.v('F3')===2,
  fr:["L’armoire du local à outils est coincée. Le pied-de-biche en viendrait à bout.",
      "Garde la corde pour repasser au nord, vers la corniche. Dans les passages bas, à l’ouest, un puits te ramène aux coursives. Au local à outils, ouvre l’armoire et réponds « avec le pied-de-biche »."],
  en:["The cabinet in the tool room is jammed shut. The crowbar would deal with it.",
      "Keep the rope to swing back north to the ledge. In the low passages, to the west, a shaft takes you back to the passageways. In the tool room, open the cabinet and answer “with crowbar”."]},
 {id:'cle', done:m=>O(m,14)===99,
  fr:["L’armoire a livré son secret : emporte-le.",
      "Prends la clé à molette dans le local à outils."],
  en:["The cabinet has given up its secret: take it with you.",
      "Take the wrench in the tool room."]},
 {id:'sortie', done:()=>false,
  fr:["La coque est boulonnée, et ta clé à molette s’y adapte. Remonte jusqu’à elle.",
      "Sur la corniche, attache la corde, « à la corniche », passe au sud, puis pose la corde : attachée, elle te retient. Va à l’est puis au nord, et utilise la clé à molette."],
  en:["The hull is bolted, and your wrench fits. Climb up to it.",
      "On the ledge, tie the rope, “to ledge”, cross to the south, then drop the rope: tied, it holds you back. Go east then north, and use the wrench."]}
];
// indices de situation
const SPOTS=[
 {when:m=>m.v('DK')===1, fr:"Sans lumière, tu tourneras en rond pour de bon. Annule ce coup et reviens chercher la lampe torche.", en:"Without light you will go round in circles for good. Undo this move and go back for the flashlight."},
 {when:(m,o)=>o===9&&m.v('F2')===0, fr:"Les flammes te barrent la sortie, et aucun mot magique ne les éteindra. Seul l’extincteur de la cuisine en viendra à bout : utilise-le.", en:"The flames bar your way out, and no magic word will put them out. Only the extinguisher from the galley will: use it."},
 {when:(m,o)=>o===15, fr:"Cette écoutille ouvre sur un mur d’eau. Sans gilet de sauvetage sur le dos, tu te noierais ; et elle ne mène pas à la sortie.", en:"This hatch opens onto a wall of water. Without a life jacket on, you would drown; and it does not lead to the way out."},
 {when:(m,o)=>o===5&&m.v('F7')===0, fr:"Laisse le tableau où il est : le passage secret qu’il cache mène tout droit sous l’eau.", en:"Leave the painting where it is: the secret passage behind it leads straight under water."},
 {when:(m,o)=>o===14&&m.v('F5')===0, fr:"Sauter au sud sans corde attachée, c’est finir dans le mazout.", en:"Jumping south without a tied rope means ending up in the oil."},
 {when:m=>O(m,12)===99, fr:"Ne lâche jamais le couperet : il te tomberait sur le pied. Et ne coupe rien avec.", en:"Never drop the cleaver: it would land on your foot. And don’t cut anything with it."},
 {when:m=>O(m,11)===99&&m.v('F1')===1, fr:"Ne mange pas cette nourriture : elle effacerait l’effet des vitamines.", en:"Don’t eat that food: it would cancel the effect of the vitamins."},
 {when:(m,o)=>o===16, fr:"Ici, seul l’est mène plus loin. Les autres passages sont des puits qui ramènent aux coursives… bien pratique pour redescendre.", en:"Here only the east leads further. The other passages are shafts down to the passageways… handy for going back down."}
];
function step(mem){ for(let i=0;i<STEPS.length;i++) if(!STEPS[i].done(mem)) return i; return STEPS.length-1; }
function spot(mem,off){ return SPOTS.findIndex(s=>s.when(mem,off)); }
return {STEPS,SPOTS,step,spot,args:()=>null};
})();
