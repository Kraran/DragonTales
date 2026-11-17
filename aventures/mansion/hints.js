// Mansion of Doom — indices des pièces magiques. L'étape en cours se lit dans les variables du programme.
// Deux indices par étape (une piste, puis la solution) ; les indices de situation passent avant, une seule fois chacun.
// A(n) : lieu de l'objet n (-1 = porté, 0 = caché) ; o : numéro du lieu moins un (lieu 1 = 0).
const HINTS=(function(){
const A=(m,n)=>Math.floor(m.a('A',n)), v=(m,k)=>m.v(k), has=(m,n)=>A(m,n)===-1;
const STEPS=[
 {id:'porte', done:m=>v(m,'C6')===1,
  fr:["La porte du manoir est fermée, mais elle n’est pas verrouillée.",
      "Ouvre la porte, puis va au sud : tu entres dans le vestibule."],
  en:["The mansion door is closed, but it is not locked.",
      "Open the door, then go south into the vestibule."]},
 {id:'protection', done:m=>(has(m,2)&&has(m,66))||v(m,'B9')===1,
  fr:["Au coucher du soleil, le maître des lieux se réveille. L’inscription gravée sur un objet de la chapelle dit comment s’en protéger.",
      "Prends la croix dans la chapelle (deuxième étage, à l’ouest de la verrière ouest) et l’ail dans la cuisine (premier étage, à l’est du bout est de la salle à manger). Garde-les toujours sur toi."],
  en:["At sunset, the master of the house wakes up. The writing etched on something in the chapel tells you how to protect yourself.",
      "Take the cross in the chapel (second floor, west of the west skylight) and the garlic in the kitchen (first floor, east of the east end of the dining hall). Always keep both on you."]},
 {id:'serpent', done:m=>A(m,39)!==11,
  fr:["Un serpent garde la sortie sud de la pièce blanche. Un animal de la ménagerie s’en chargerait volontiers… encore faut-il l’attraper.",
      "Prends la cage dans la pièce à l’ouest du salon (rez-de-chaussée). À la ménagerie (premier étage, au nord-est), pose la cage, ouvre-la et prends la mangouste. Pose ensuite la mangouste dans la pièce blanche (rez-de-chaussée, à l’est)."],
  en:["A snake guards the south exit of the white room. An animal from the menagerie would gladly deal with it… if you can catch it.",
      "Take the cage in the room west of the front room (ground floor). In the menagerie (first floor, north-east), drop the cage, open it and take the mongoose. Then drop the mongoose in the white room (ground floor, east)."]},
 {id:'pistolet', done:m=>(has(m,6)&&v(m,'A1')===1)||v(m,'B0')===1,
  fr:["Plus bas rôde une bête que seule une balle d’argent arrête. Le pistolet est dans une salle où l’on ne va pas à pied ; la balle, dans une boîte d’un placard.",
      "Monte au grenier et prends le coffre : tu tomberas dans la galerie des glaces ; va à l’est, prends le pistolet. Puis, au deuxième étage, va dans la chambre au sud de la verrière ouest, puis dans le placard à l’ouest : ouvre la boîte et prends la balle."],
  en:["Further down prowls a beast that only a silver bullet can stop. The gun is in a room you can’t walk into; the bullet is in a box in a closet.",
      "Go up to the attic and take the chest: you will fall into the room of mirrors; go east and take the gun. Then, on the second floor, go to the bedroom south of the west skylight, then to the closet to the west: open the box and take the bullet."]},
 {id:'courant', done:m=>v(m,'A6')===1,
  fr:["La cave est plongée dans le noir : quelque part en bas, il y a de quoi rendre la lumière.",
      "Dans la cave, va au nord de l’escalier, puis à l’ouest : c’est la salle du courant. Ferme l’interrupteur. Surtout, ne tire jamais dessus."],
  en:["The cellar is pitch dark: somewhere down there, something can bring the light back.",
      "In the cellar, go north of the stairs, then west: that’s the power room. Close the switch. Above all, never shoot it."]},
 {id:'loup', done:m=>v(m,'B0')===1,
  fr:["L’antre du loup-garou est au sud de la salle de la mort. En entrant, tu n’auras le temps que d’une seule commande.",
      "Avec le pistolet chargé, entre dans l’antre (cave, à l’est de l’escalier puis au sud) et tire tout de suite sur le loup-garou. Prends ensuite la clé."],
  en:["The werewolf’s room is south of the room of death. When you walk in, you will have time for one command only.",
      "With the loaded gun, walk into the room (cellar, east of the stairs then south) and shoot the werewolf at once. Then take the key."]},
 {id:'sac', done:m=>(has(m,20)&&v(m,'A9')===1)||v(m,'A8')===1,
  fr:["La clé du loup-garou ouvre un coffre que tu as déjà croisé, tout en haut.",
      "Monte au grenier avec la clé, ouvre le coffre, prends le sac qui en tombe et ouvre-le. Si tu es trop chargé, laisse le pistolet : il ne sert plus."],
  en:["The werewolf’s key opens a chest you have already seen, at the very top.",
      "Go up to the attic with the key, open the chest, take the sack that falls out and open it. If you carry too much, leave the gun behind: you won’t need it any more."]},
 {id:'pieu', done:m=>(has(m,8)&&has(m,24))||v(m,'B9')===1,
  fr:["Pour tuer un vampire, il faut un pieu de bois… et de quoi l’enfoncer.",
      "Le pieu est dans la réserve de bois (deuxième étage : la verrière est, l’atelier au nord, puis à l’est). Pour le maillet, examine la bibliothèque du bureau (premier étage, à l’ouest) : un passage s’ouvre au nord."],
  en:["To kill a vampire, you need a wooden stake… and something to drive it in.",
      "The stake is in the wood storage room (second floor: the east skylight, the woodshop to the north, then east). For the mallet, examine the bookcase in the study (first floor, west): a way opens to the north."]},
 {id:'acide', done:m=>v(m,'A8')===1,
  fr:["Une fosse d’acide te sépare du caveau. Ce qui est écrit sur le sac te met sur la voie.",
      "Ouvre la trappe de la réserve (rez-de-chaussée, au sud de la pièce blanche), descends deux fois, puis pose le sac ouvert dans l’acide. Le passage à l’ouest sera libre."],
  en:["A pool of acid lies between you and the vault. What is written on the sack points the way.",
      "Open the trapdoor in the supply room (ground floor, south of the white room), go down twice, then drop the open sack into the acid. The way west will be clear."]},
 {id:'vampire', done:m=>v(m,'B9')===1,
  fr:["Le vampire dort dans le cercueil. L’inscription de la salle de Transylvanie dit comment en finir. Et n’ouvre pas la cassette avant !",
      "Avec le pieu et le maillet sur toi, ouvre le cercueil, puis tape exactement : tuer vampire."],
  en:["The vampire sleeps in the coffin. The writing in the Transylvania room tells you how to finish him. And don’t open the casket before that!",
      "With the stake and the mallet on you, open the coffin, then type exactly: slay vampire."]},
 {id:'princesse', done:m=>has(m,63),
  fr:["La princesse n’est pas loin : dans la cassette, à côté du cercueil.",
      "Ouvre la cassette et prends la princesse."],
  en:["The princess is close by: in the casket, next to the coffin.",
      "Open the casket and take the princess."]},
 {id:'retour', done:()=>false,
  fr:["Il reste à la ramener au village. Le plus court chemin passe par un endroit plein de reflets.",
      "Remonte au grenier et prends de nouveau le coffre : tu tomberas dans la galerie des glaces. Va au nord : c’est la grand-place du village."],
  en:["All that’s left is to bring her back to the town. The shortest way goes through a place full of reflections.",
      "Go back up to the attic and take the chest again: you will fall into the room of mirrors. Go north: that’s the town square."]}
];
// indices de situation
const SPOTS=[
 {when:m=>v(m,'R')&&v(m,'H')>=v(m,'R')-60&&!(has(m,2)&&has(m,66))&&v(m,'B9')===0,
  fr:"Le soleil va se coucher. Sans la croix et l’ail sur toi, le vampire viendra te mordre. Une potion magique, posée, remonterait le temps…",
  en:"The sun is about to set. Without the cross and the garlic on you, the vampire will come and bite you. A magic potion, once dropped, would turn back time…"},
 {when:(m,o)=>o===75, fr:"Tu tombes ! Tape vite le mot que porte le panneau au bord du puits : chien.", en:"You are falling! Quickly type the word on the sign at the edge of the pit: dog."},
 {when:(m,o)=>o===72&&v(m,'C4')===1, fr:"Pour te libérer des fers, dis le premier mot écrit sur le billet : yorel.", en:"To free yourself from the shackles, say the first word written on the note: yorel."},
 {when:(m,o)=>o===65, fr:"Ne t’attarde pas ici : les chauves-souris finissent par t’assommer, et tu te réveilles dans les fers, sans tes affaires.", en:"Don’t linger here: the bats end up knocking you out, and you wake up in shackles, without your belongings."},
 {when:(m,o)=>o===69, fr:"Ne va pas au sud : les sables mouvants n’ont pas d’issue.", en:"Don’t go south: there is no way out of the quicksand."},
 {when:(m,o)=>o===74&&v(m,'B9')===0&&v(m,'B8')===0, fr:"N’ouvre surtout pas la cassette avant d’avoir tué le vampire : la princesse tomberait en cendres.", en:"Don’t open the casket before you have slain the vampire: the princess would turn to ashes."},
 {when:(m,o)=>o===47&&v(m,'A6')===0, fr:"Ferme l’interrupteur pour rallumer la cave. Et ne tire jamais dessus : la cave resterait noire pour toujours.", en:"Close the switch to light the cellar again. And never shoot it: the cellar would stay dark forever."}
];
function step(mem){ for(let i=0;i<STEPS.length;i++) if(!STEPS[i].done(mem)) return i; return STEPS.length-1; }
function spot(mem,off){ return SPOTS.findIndex(s=>s.when(mem,off)); }
return {STEPS,SPOTS,step,spot,args:()=>null};
})();
