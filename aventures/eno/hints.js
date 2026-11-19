// Eno — indices des pièces magiques. L'étape en cours se lit dans les variables du programme.
// Deux indices par étape (une piste, puis la solution) ; les indices de situation passent avant, une seule fois chacun.
// A(n) : lieu de l'objet n (-1 = porté, 0 = caché) ; C(1) livre ouvert ; o : numéro de la case moins un (case 1 = 0).
// Le salon (data.js) :  15 14  2  3  4  /  12 13  1  6  5  /  11 10  9  8  7  — on commence au milieu (1).
const HINTS=(function(){
const A=(m,n)=>Math.floor(m.a('A',n)), C=(m,n)=>m.a('C',n);
const STEPS=[
 {id:'chat', done:m=>A(m,3)!==0,
  fr:["Au milieu du salon, le tapis persan ne repose pas sur un parquet tout à fait d’aplomb.",
      "Prends le tapis au milieu du salon : une latte disjointe apparaît. Prends-la aussi : il y a quelque chose dessous."],
  en:["In the middle of the living room, the Persian rug doesn’t lie on a perfectly flat floor.",
      "Take the rug in the middle of the living room: a loose board shows up. Take it too: there is something underneath."]},
 {id:'gueule', done:m=>A(m,28)!==0,
  fr:["Le pauvre chat a emporté quelque chose dans la tombe, et ça se compte.",
      "Examine le chat : il a dans la gueule les restes d’un poisson rouge."],
  en:["The poor cat took something to the grave with him, and it counts.",
      "Examine the cat: there are the remains of a goldfish in his mouth."]},
 {id:'livre', done:m=>C(m,1)===1,
  fr:["Ce chat avait un nom, écrit quelque part sur la table basse.",
      "Va à l’ouest du milieu du salon, examine la table basse, puis ouvre le livre et lis-le : la dédicace donne le nom du chat."],
  en:["That cat had a name, written somewhere on the coffee table.",
      "Go west of the middle of the living room, examine the coffee table, then open the book and read it: the dedication gives the cat’s name."]},
 {id:'revue', done:m=>A(m,13)!==0,
  fr:["Le fauteuil qui jure avec les rideaux cache de la lecture.",
      "Le fauteuil est dans le coin sud-est. Examine-le, puis examine le coussin : lis la revue qui était dessous."],
  en:["The chair that clashes with the curtains hides some reading.",
      "The chair is in the south-east corner. Examine it, then examine the cushion: read the magazine that was underneath."]},
 {id:'poissons', done:m=>A(m,9)!==0,
  fr:["Le titre de la revue parle de poissons : il y en a un plein aquarium.",
      "L’aquarium est dans le coin nord-est : examine-le et compte les poissons. Surtout, n’y touche pas."],
  en:["The magazine title talks about fish: there’s a whole tank of them.",
      "The fish tank is in the north-east corner: examine it and count the fish. Above all, don’t touch it."]},
 {id:'coffre', done:m=>A(m,6)!==0,
  fr:["Le portrait du chat noir, près de la causeuse, est accroché devant quelque chose.",
      "Va au nord du milieu du salon, près de la causeuse, et prends le tableau : le coffre-fort est derrière."],
  en:["The portrait of the black cat, by the love seat, hangs in front of something.",
      "Go north of the middle of the living room, by the love seat, and take the picture: the safe is behind it."]},
 {id:'combinaison', done:m=>A(m,7)!==0,
  fr:["La combinaison est dans le titre de la revue, dans l’ordre : le chat, les poissons, l’espace. Chaque mot donne un nombre.",
      "Le chat s’appelle Eno : ONE à l’envers, 1. Les poissons : 29 dans l’aquarium, plus les restes d’un dans la gueule du chat, 30. L’espace : la télé passe « Alien » sur la chaîne 11. Ouvre le coffre-fort et tape 1, puis 30, puis 11."],
  en:["The combination is in the magazine title, in order: the cat, the fish, outer space. Each word gives a number.",
      "The cat is called Eno: ONE backwards, 1. The fish: 29 in the tank, plus the remains of one in the cat’s mouth, 30. Outer space: the TV is playing “Alien” on channel 11. Open the safe and type 1, then 30, then 11."]},
 {id:'million', done:()=>false,
  fr:["Le million est dans le coffre ouvert : il n’y a plus qu’à se servir.",
      "Prends les dollars. Si tu portes déjà cinq objets, pose-en un avant."],
  en:["The million is in the open safe: just help yourself.",
      "Take the bucks. If you are already carrying five things, drop one first."]}
];
// indices de situation
const SPOTS=[
 {when:(m,o)=>o===3, fr:"Regarde l’aquarium autant que tu veux, mais n’y touche pas : le pousser, l’ouvrir ou le casser inonderait le salon.", en:"Look at the fish tank all you want, but don’t touch it: pushing, opening or breaking it would flood the living room."},
 {when:(m,o)=>o===4, fr:"Regarde la télévision, mais n’y touche pas : elle est en court-circuit.", en:"Watch the TV, but don’t touch it: it’s short-circuiting."},
 {when:(m,o)=>o===14&&A(m,27)!==0, fr:"N’ouvre surtout pas les portes de cette table d’appoint-ci.", en:"Whatever you do, don’t open the doors of this end table."},
 {when:(m,o)=>o===1&&A(m,6)!==0&&A(m,7)===0, fr:"Une seule erreur de combinaison déclenche l’alarme. Sois sûr de tes trois nombres avant d’ouvrir le coffre.", en:"A single wrong number sets off the alarm. Be sure of your three numbers before you open the safe."}
];
function step(mem){ for(let i=0;i<STEPS.length;i++) if(!STEPS[i].done(mem)) return i; return STEPS.length-1; }
function spot(mem,off){ return SPOTS.findIndex(s=>s.when(mem,off)); }
return {STEPS,SPOTS,step,spot,args:()=>null};
})();
