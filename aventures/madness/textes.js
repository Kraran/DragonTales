// Madness and the Minotaur — textes. Le jeu écrit ses phrases mot par mot (listes de mots du programme) ; une ligne
// affichée en contient souvent plusieurs (description du lieu, passages, objets présents). mmSay coupe chaque ligne en
// phrases et traduit chacune : phrase connue (MM_MSG), description du lieu (MM_ROOM, lieux-fr.js), ou phrase composée
// (le nom d'un objet, d'une créature, d'un sortilège au milieu : MM_PAT).

// ---- objets, créatures, sortilèges : nom français, genre (m, f ; « ' » si l'article s'élide) ----
const MM_WORDS=['FOOD','BOTTLE','DAGGER','MACE','AX','SWORD','SHIELD','FLUTE','MUSHROOM','PENDANT','SCEPTER','LAMP','BASKET','PARCHMENT','VIAL','URN',
 'TALISMAN','SCROLL','GOBLET','SKULL','SCARAB','JEWELBOX','TABLET','ROPE','SPRITE','TROGLODYTE','SCORPION','NYMPH','SATYR','MINOTAUR','ORACLE',
 'GOLD','SILVER','DIAMOND','SPELLBOOK','RUBY','FLEECE','TIARA','POWDER','AMULET','POTION','POWERRING','LIGHTRING','TRUTHRING','CROWN','OPAL','SAPPHIRE'];
const MM_SPELLS=['VETAR','MITRA','OKKAN','AKHIROM','NERGAL','BELROG','CROM','ISHTAR'];
const MM_OBJ={
 FOOD:['nourriture','f'], BOTTLE:['bouteille','f'], DAGGER:['dague','f'], MACE:['masse d’armes','f'], AX:['hache','f'], SWORD:['épée','f'],
 SHIELD:['bouclier','m'], FLUTE:['flûte','f'], MUSHROOM:['champignon','m'], PENDANT:['pendentif','m'], SCEPTER:['sceptre','m'], LAMP:['lampe','f'],
 BASKET:['panier','m'], PARCHMENT:['parchemin','m'], VIAL:['fiole','f'], URN:['urne','f'], TALISMAN:['talisman','m'], SCROLL:['rouleau','m'],
 GOBLET:['gobelet','m'], SKULL:['crâne','m'], SCARAB:['scarabée','m'], JEWELBOX:['coffret à bijoux','m'], TABLET:['tablette','f'], ROPE:['corde','f'],
 SPRITE:['lutin','m'], TROGLODYTE:['troglodyte','m'], SCORPION:['scorpion','m'], NYMPH:['nymphe','f'], SATYR:['satyre','m'], MINOTAUR:['Minotaure','m'],
 ORACLE:['Oracle','m'], GOLD:['or','m'], SILVER:['argent','m'], DIAMOND:['diamant','m'], SPELLBOOK:['grimoire','m'], RUBY:['rubis','m'],
 FLEECE:['toison','f'], TIARA:['diadème','m'], POWDER:['poudre','f'], AMULET:['amulette','f'], POTION:['potion','f'], POWERRING:['anneau de puissance','m'],
 LIGHTRING:['anneau de lumière','m'], TRUTHRING:['anneau de vérité','m'], CROWN:['couronne','f'], OPAL:['opale','f'], SAPPHIRE:['saphir','m'],
 WATER:['eau','f'], HYDRA:['hydre','f'], LEDGE:['corniche','f'], CRYPT:['crypte','f'], DRAPES:['tentures','p'], JEWLBOX:['coffret à bijoux','m'],
 OIL:['huile','f'], LAMP2:['lampe','f']
};
const MM_ELIDE=/^[aeiouyhéèêâîôûœ]/i;
function mmName(w){ const o=MM_OBJ[w]; return o?o[0]:(MM_SPELLS.includes(w)?w:w.toLowerCase()); }
function mmLe(w){ if(MM_SPELLS.includes(w)) return w; const o=MM_OBJ[w]; if(!o) return 'le '+w.toLowerCase();
  if(o[1]==='p') return 'les '+o[0]; if(MM_ELIDE.test(o[0])) return 'l’'+o[0]; return (o[1]==='f'?'la ':'le ')+o[0]; }
function mmUn(w){ const o=MM_OBJ[w]; if(!o) return w.toLowerCase(); if(['GOLD','SILVER','WATER','FOOD','POWDER','OIL'].includes(w)) return mmDu(w);
  return (o[1]==='f'?'une ':o[1]==='p'?'des ':'un ')+o[0]; }
function mmDu(w){ const o=MM_OBJ[w]; if(!o) return 'de '+w.toLowerCase(); if(MM_ELIDE.test(o[0])) return 'de l’'+o[0]; return (o[1]==='f'?'de la ':'du ')+o[0]; }
function mmDe(w){ const o=MM_OBJ[w]; if(!o) return 'de '+w.toLowerCase(); return MM_ELIDE.test(o[0])?'d’'+o[0]:'de '+o[0]; }
// « THE PARCHMENT AND MITRA AND THE ROPE » : liste d'objets et de sortilèges
function mmList(s){ const it=s.replace(/^THE /,'').split(/ AND (?:THE )?/).map(x=>mmLe(x.trim()));
  return it.length>1?it.slice(0,-1).join(', ')+' et '+it[it.length-1]:it[0]; }

// ---- phrases connues : anglais → français (null : rien dans la version moderne) ----
const MM_MSG={
 // écran titre de la version Dragon
 "COPR.":"©", "1982 SPECTRAL ASSOCIATES LICENSED TO DRAGON DATA LTD.":"1982 Spectral Associates, sous licence de Dragon Data Ltd.",
 "ENTER THE LABYRINTH IF YOU DARE!!":"Entre dans le labyrinthe, si tu l’oses !",
 "BUT BEWARE THE CREATURES WHICH HAUNT ITS DEPTHS.":"Mais prends garde aux créatures qui hantent ses profondeurs.",
 "GOOD LUCK!":"Bonne chance !",
 "WELCOME TO THE LABYRINTH!!":"Bienvenue dans le labyrinthe !",
 "BEWARE OF THE MINOTAUR AND GOOD LUCK.":"Prends garde au Minotaure, et bonne chance.",
 // passages (un au hasard pour chaque sortie)
 "A SMALL OPENING WINDS OUT OF SIGHT TO THE SOUTH.":"Une petite ouverture serpente au sud et se perd de vue.",
 "A GREAT DOORWAY IS ON THE SOUTH WALL.":"Une grande porte s’ouvre dans le mur sud.",
 "A GENTLY SLOPING TRAIL WINDS SOUTH.":"Une piste en pente douce serpente vers le sud.",
 "THERE IS A PASSAGE WAY TO THE SOUTH.":"Un passage part vers le sud.",
 "A LARGE DOORWAY IS RECESSED INTO THE SOUTH WALL.":"Une large porte est creusée dans le mur sud.",
 "A DOORWAY TO THE SOUTH WINDS INTO A CHAMBER.":"Au sud, une porte mène par un détour à une salle.",
 "A SLOPING PASSAGE LEADS TO THE SOUTH.":"Un passage en pente mène vers le sud.",
 "A WINDING PASSAGE DISAPPEARS TO THE SOUTH.":"Un passage sinueux disparaît vers le sud.",
 "A GREAT DOORWAY IS ON THE WEST WALL.":"Une grande porte s’ouvre dans le mur ouest.",
 "THERE IS A NARROW PASSAGE WAY TO THE WEST.":"Un passage étroit part vers l’ouest.",
 "THERE IS A PASSAGE WAY TO THE WEST.":"Un passage part vers l’ouest.",
 "A BROKEN TRAIL LEADS WEST.":"Une piste défoncée mène vers l’ouest.",
 "A DOORWAY TO THE WEST WINDS INTO A CHAMBER.":"À l’ouest, une porte mène par un détour à une salle.",
 "SWIRLING MIST WINDS OUT OF A DOORWAY TO THE WEST.":"Une brume tourbillonnante s’échappe d’une porte à l’ouest.",
 "A WINDING PASSAGE DISAPPEARS TO THE WEST.":"Un passage sinueux disparaît vers l’ouest.",
 "A TWISTING TRAIL LEADS WEST.":"Une piste tortueuse mène vers l’ouest.",
 "THERE IS A NARROW PASSAGE WAY TO THE EAST.":"Un passage étroit part vers l’est.",
 "THERE IS A GREAT HOLE IN THE EAST WALL.":"Un grand trou s’ouvre dans le mur est.",
 "A BROKEN TRAIL LEADS EAST.":"Une piste défoncée mène vers l’est.",
 "A WIDE OPENING ON THE EAST WALL DISAPPEARS INTO THE DARK.":"Une large ouverture dans le mur est s’enfonce dans le noir.",
 "SWIRLING MIST WINDS OUT OF A DOORWAY TO THE EAST.":"Une brume tourbillonnante s’échappe d’une porte à l’est.",
 "A GREAT HALL DISAPPEARS TO THE EAST.":"Une grande salle se perd vers l’est.",
 "A TWISTING TRAIL LEADS EAST.":"Une piste tortueuse mène vers l’est.",
 "A SUNKEN TRAIL LEADS EAST.":"Une piste encaissée mène vers l’est.",
 "A SMALL OPENING WINDS OUT OF SIGHT TO THE NORTH.":"Une petite ouverture serpente au nord et se perd de vue.",
 "THERE IS A GREAT HOLE IN THE NORTH WALL.":"Un grand trou s’ouvre dans le mur nord.",
 "A GENTLY SLOPING TRAIL WINDS NORTH.":"Une piste en pente douce serpente vers le nord.",
 "A WIDE OPENING ON THE NORTH WALL DISAPPEARS INTO THE DARK.":"Une large ouverture dans le mur nord s’enfonce dans le noir.",
 "A LARGE DOORWAY IS RECESSED INTO THE NORTH WALL.":"Une large porte est creusée dans le mur nord.",
 "A GREAT HALL DISAPPEARS TO THE NORTH.":"Une grande salle se perd vers le nord.",
 "A SLOPING PASSAGE LEADS TO THE NORTH.":"Un passage en pente mène vers le nord.",
 "A SUNKEN TRAIL LEADS NORTH.":"Une piste encaissée mène vers le nord.",
 "A SWIRLING MIST WINDS UP A STAIR WAY.":"Une brume tourbillonnante monte le long d’un escalier.",
 "THERE IS A HOLE IN THE FLOOR.":"Il y a un trou dans le sol.",
 "THERE IS A LARGE OPENING IN THE FLOOR.":"Une large ouverture s’ouvre dans le sol.",
 "A LARGE OPENING LEADS DOWN.":"Une large ouverture descend.",
 "YOU ARE AT THE TOP OF A TWISTING STAIR WAY.":"Tu es en haut d’un escalier tournant.",
 "A STAIR WAY LEADS DOWN.":"Un escalier descend.",
 "YOU ARE AT THE TOP OF A PIT.":"Tu es au bord d’une fosse.",
 "A TWISTING TRAIL LEADS DOWN.":"Une piste tortueuse descend.",
 "A SWIRLING MIST WINDS DOWN A STAIR WAY.":"Une brume tourbillonnante descend le long d’un escalier.",
 "THERE IS A HOLE IN THE CEILING.":"Il y a un trou dans le plafond.",
 "THERE IS A LARGE OPENING IN THE CEILING.":"Une large ouverture s’ouvre dans le plafond.",
 "A LARGE OPENING LEADS UP.":"Une large ouverture monte.",
 "YOU ARE AT THE BOTTOM OF A TWISTING STAIR WAY.":"Tu es au pied d’un escalier tournant.",
 "A STAIR WAY LEADS UP.":"Un escalier monte.",
 "YOU ARE AT THE BOTTOM OF A PIT.":"Tu es au fond d’une fosse.",
 "A TWISTING TRAIL LEADS UP.":"Une piste tortueuse monte.",
 "BUT IT IS BLOCKED.":"Mais il est bouché.",
 // objets à leur place de départ
 "THERE IS FOOD HERE.":"Il y a de la nourriture ici.",
 "A BOTTLE IS RESTING ON THE FLOOR.":"Une bouteille est posée sur le sol.",
 "A SMALL DAGGER IS ON THE FLOOR.":"Une petite dague est par terre.",
 "A MACE IS IN THE CENTER OF THE PATH.":"Une masse d’armes est au milieu du chemin.",
 "A GREAT AX IS STUCK IN THE FLOOR.":"Une grande hache est plantée dans le sol.",
 "A BRONZE SWORD IS HERE.":"Une épée de bronze est ici.",
 "A LEATHER SHIELD IS AT YOUR FEET.":"Un bouclier de cuir est à tes pieds.",
 "A GOLD FLUTE SITS IN THE CORNER.":"Une flûte d’or est posée dans un coin.",
 "THERE IS A MUSHROOM ON THE FLOOR.":"Il y a un champignon par terre.",
 "A PENDANT IS IN A SMALL HOLE RECESSED INTO THE WALL.":"Un pendentif est dans une petite niche creusée dans le mur.",
 "THERE IS A SCEPTER ON THE FLOOR.":"Il y a un sceptre par terre.",
 "THERE IS A SMALL LAMP RESTING AGAINST THE WALL.":"Une petite lampe est appuyée contre le mur.",
 "A BASKET IS IN THE CENTER OF THE FLOOR.":"Un panier est posé au milieu de la pièce.",
 "AN ANCIENT PARCHMENT IS RESTING ON A STONE.":"Un parchemin ancien est posé sur une pierre.",
 "A SMALL VIAL SITS IN THE CORNER.":"Une petite fiole est posée dans un coin.",
 "AN URN IS RESTING ON A LARGE SMOOTH STONE.":"Une urne est posée sur une grande pierre lisse.",
 "A MAGIC TALISMAN SITS ON THE EDGE OF THE PATH.":"Un talisman magique est posé au bord du chemin.",
 "A MUSTY SCROLL IS RESTING AGAINST THE WALL.":"Un rouleau moisi est appuyé contre le mur.",
 "THERE IS A GOBLET ON THE FLOOR.":"Il y a un gobelet par terre.",
 "A SKULL SITS IN A SMALL HOLE IN THE FLOOR.":"Un crâne est posé dans un petit trou du sol.",
 "A GOLD SCARAB IS SPARKLING IN THE DIM LIGHT.":"Un scarabée d’or étincelle dans la pénombre.",
 "AN ANCIENT JEWELBOX LAYS TO THE SIDE OF A PATH.":"Un coffret à bijoux ancien gît au bord d’un chemin.",
 "A BROKEN MARBLE TABLET IS GENTLY RESTING AGAINST A STONE.":"Une tablette de marbre brisée est doucement appuyée contre une pierre.",
 "A LONG ROPE IS ON THE FLOOR.":"Une longue corde est par terre.",
 "A SPRITE SITS ON A CHAIR IN THE CORNER OF THE ROOM.":"Un lutin est assis sur une chaise, dans un coin de la pièce.",
 "A LARGE TROGLODYTE IS IN THE ROOM.":"Un grand troglodyte est dans la pièce.",
 "THE SCORPION IS HERE.":"Le scorpion est ici.",
 "THE NYMPH IS HERE.":"La nymphe est ici.",
 "THE SATYR IS HERE.":"Le satyre est ici.",
 "THE MINOTAUR IS HERE.":"Le Minotaure est ici.",
 "THE ORACLE IS HERE.":"L’Oracle est ici.",
 "THERE IS GOLD ON THE FLOOR.":"Il y a de l’or par terre.",
 "A BAG OF SILVER IS HERE.":"Un sac d’argent est ici.",
 "A SPARKLING DIAMOND IS IN A SMALL HOLE IN THE WALL.":"Un diamant étincelant est dans un petit trou du mur.",
 "THE SPELLBOOK IS HERE.":"Le grimoire est ici.",
 "A LARGE RUBY LAYS TO THE SIDE OF THE PATH IN THE DIRT.":"Un gros rubis gît dans la poussière, au bord du chemin.",
 "A GOLD FLEECE LAYS ON A SMALL TABLE.":"Une toison d’or est posée sur une petite table.",
 "A SMALL SILVER TIARA LAYS ON THE FLOOR.":"Un petit diadème d’argent gît par terre.",
 "A BAG OF MAGIC POWDER IS ON A TABLE.":"Un sac de poudre magique est sur une table.",
 "A SMALL AMULET IS ON THE FLOOR.":"Une petite amulette est par terre.",
 "A SMALL BOTTLE WITH A MAGIC POTION IN IT IS HERE.":"Une petite bouteille contenant une potion magique est ici.",
 "THE POWERRING IS SPARKLING ON THE TRAIL.":"L’anneau de puissance étincelle sur la piste.",
 "THE LIGHTRING IS SPARKLING ON THE PATH.":"L’anneau de lumière étincelle sur le chemin.",
 "THE TRUTHRING IS SPARKLING ON THE FLOOR.":"L’anneau de vérité étincelle sur le sol.",
 "A GOLD CROWN IS RESTING IN A PILE OF DIRT.":"Une couronne d’or repose sur un tas de terre.",
 "A LARGE OPAL IS SPARKLING IN THE LIGHT.":"Une grosse opale étincelle dans la lumière.",
 "A LARGE SAPPHIRE LAYS AGAINST THE EDGE OF A STONE.":"Un gros saphir gît contre le bord d’une pierre.",
 "A MAGIC SWORD IS STUCK IN A LARGE STONE.":"Une épée magique est plantée dans une grosse pierre.",
 "A LEATHER SHIELD IS HANGING ON THE WALL.":"Un bouclier de cuir est accroché au mur.",
 "A GLASS VIAL IS SUSPENDED IN THE AIR.":"Une fiole de verre flotte dans les airs.",
 "A SKULL IS RESTING IN THE CENTER OF A SKULL TABLE.":"Un crâne repose au milieu d’une table aux crânes.",
 "A MAGIC SPELLBOOK SITS ON THE EDGE OF A SHALLOW TABLE.":"Un grimoire magique est posé au bord d’une table basse.",
 "THE POWERRING IS ON A VELVET CHAIR.":"L’anneau de puissance est posé sur une chaise de velours.",
 "THE LIGHTRING SITS ON A PILE OF BONES.":"L’anneau de lumière est posé sur un tas d’ossements.",
 "THE TRUTHRING IS BURIED IN THE CENTER OF A GLASS STONE.":"L’anneau de vérité est enfoui au cœur d’une pierre de verre.",
 // objets protégés
 "THE SWORD WILL NOT MOVE.":"L’épée ne bouge pas.",
 "YOU CAN NOT REACH THE SHIELD.":"Tu n’arrives pas à atteindre le bouclier.",
 "THE VIAL IS OUT OF REACH.":"La fiole est hors de portée.",
 "A MAGIC FORCE KEEPS YOU FROM THE SKULL.":"Une force magique t’empêche d’approcher du crâne.",
 "THE SPELLBOOK FLOATS OUT OF REACH WHEN YOU MOVE NEAR IT.":"Le grimoire s’éloigne en flottant dès que tu t’en approches.",
 "THE POWERRING DISAPPEARS WHEN YOU MOVE NEAR IT.":"L’anneau de puissance disparaît dès que tu t’en approches.",
 "A SKELETON SPRINGS UP FROM THE BONES AND KEEPS YOU FROM THE LIGHTRING.":"Un squelette surgit des ossements et t’empêche d’approcher de l’anneau de lumière.",
 "THE GLASS STONE IS PROTECTED BY MAGIC.":"La pierre de verre est protégée par la magie.",
 // réponses du jeu
 "OK":"D’accord.", "OK.":"D’accord.",
 "I DON'T UNDERSTAND THAT.":"Je ne comprends pas.",
 "YOU DON'T HAVE THAT.":"Tu n’as pas ça.",
 "DON'T BE RIDICULOUS.":"Ne sois pas ridicule.",
 "IT'S TOO BULKY.":"C’est trop encombrant.",
 "IT'S TOO HEAVY.":"C’est trop lourd.",
 "WHAT?":"Quoi ?",
 "WITH WHAT?":"Avec quoi ?",
 "ASK WHO?":"Interroger qui ?",
 "HYDRA?":"L’hydre ?",
 "I DON'T SEE ANYTHING INTERESTING.":"Je ne vois rien d’intéressant.",
 "NOTHING SPECIAL HAPPENS.":"Il ne se passe rien de spécial.",
 "YOU MUST BE KIDDING!":"Tu plaisantes !",
 "DON'T ASK ME FOR HELP - YOU GOT YOURSELF INTO THIS MESS!":"Ne compte pas sur moi : tu t’es mis tout seul dans ce pétrin !",
 "THANK YOU, I NEEDED THAT.":"Merci, j’en avais besoin.",
 "IT WAS YUMMY.":"C’était délicieux.",
 "THAT IS VERY STRONG MEDICINE.":"C’est un remède très fort.",
 "THE SCORPION'S STING HAS BEEN CURED.":"La piqûre du scorpion est guérie.",
 "THE BOTTLE IS EMPTY.":"La bouteille est vide.",
 "THE BOTTLE IS FILLED WITH WATER.":"La bouteille est pleine d’eau.",
 "THERE IS NO WATER HERE.":"Il n’y a pas d’eau ici.",
 "THERE IS NOTHING IN THE URN.":"Il n’y a rien dans l’urne.",
 "THE URN IS FILLED WITH OIL.":"L’urne est pleine d’huile.",
 "THE URN IS FILLED WITH OIL":"L’urne est pleine d’huile.",
 "THE URN IS FULL OF OIL.":"L’urne est pleine d’huile.",
 "THERE IS A POOL OF OIL ON THE FLOOR.":"Une flaque d’huile s’étale sur le sol.",
 "THE LAMP IS OFF.":"La lampe est éteinte.", "THE LAMP IS OFF":"La lampe est éteinte.", "THE LAMP IS ON":"La lampe est allumée.", "THERE IS NO OIL IN THE LAMP":"Il n’y a pas d’huile dans la lampe.",
 "THE LAMP IS ON.":"La lampe est allumée.",
 "THE LAMP IS FLICKERING.":"La lampe vacille.",
 "THERE IS NO OIL IN THE LAMP.":"Il n’y a pas d’huile dans la lampe.",
 "YOUR LAMP HAS JUST GONE OFF.":"Ta lampe vient de s’éteindre.",
 "YOU DON'T HAVE THE LAMP.":"Tu n’as pas la lampe.",
 "IT'S DARK AND YOU CAN'T SEE - IF YOU CONTINUE, YOU MAY FALL.":"Il fait noir et tu n’y vois rien ; si tu continues, tu risques de tomber.",
 "YOU CAN NOT SEE IN THE DIM LIGHT.":"Tu n’y vois rien dans cette pénombre.",
 "YOUR SIGHT IS DIM.":"Ta vue se brouille.",
 "THE GROUND IS SHAKING!":"Le sol tremble !",
 "THE FLOOR UNDER YOU HAS JUST CAVED IN!!":"Le sol vient de s’effondrer sous tes pieds !",
 "THE AIR IS CRACKLING WITH ENCHANTMENT.":"L’air crépite d’enchantements.",
 "THE MINOTAUR IS ATTACKING.":"Le Minotaure attaque !",
 "THE TROGLODYTE IS ATTACKING.":"Le troglodyte attaque !",
 "THE TROGLODYTE IS ATTACKING":"Le troglodyte attaque !",
 "THE SATYR IS ATTACKING.":"Le satyre attaque !",
 "THE SCORPION HAS JUST STUNG YOU.":"Le scorpion vient de te piquer.",
 "THE SCORPION DISAPPEARS.":"Le scorpion disparaît.",
 "OUCH!!":"Aïe !", "THAT HURT.":"Ça fait mal.",
 "YOU MISSED.":"Tu l’as manqué.",
 "THE ROOM IS FILLED WITH MIST AND THE ORACLE DISAPPEARS.":"La pièce s’emplit de brume et l’Oracle disparaît.",
 "A MYSTERIOUS CALM SETTLES OVER THE ROOM AS THE ORACLE SPEAKS...":"Un calme mystérieux s’installe dans la pièce tandis que l’Oracle parle…",
 "IN A REFLECTION IN THE POOL YOU CAN READ THE FOLLOWING WORDS ON THE CEILING...":"Dans le reflet du bassin, tu lis ces mots inscrits au plafond…",
 "THE PARCHMENT HAS A SCORE ON IT.":"Le parchemin porte une partition.",
 "BY PLAYING THE FLUTE ACCORDING TO A SONG ON THE PARCHMENT, A SECRET LEDGE HAS BEEN EXPOSED.":"En jouant de la flûte l’air noté sur le parchemin, tu as fait apparaître une corniche secrète.",
 "A CLOUD OF SMOKE FILLS THE ROOM AND AN EERIE HOWL ECHOS OFF THE WALLS AS THE TOP FALLS SHUT.":"Un nuage de fumée emplit la pièce et un hurlement sinistre résonne contre les murs tandis que le couvercle retombe.",
 "THE TOP WON'T BUDGE.":"Le couvercle ne bouge pas.",
 "ONE OF THE HYDRA'S HEADS IS LOPPED OFF, BUT ANOTHER ONE TAKES ITS PLACE AND SNEERS AT YOU.":"Une des têtes de l’hydre tombe, tranchée, mais une autre repousse aussitôt et te nargue.",
 "THE HYDRA IS DEAD!":"L’hydre est morte !",
 "A NINE-HEADED HYDRA BLOCKS YOUR PASSAGE.":"Une hydre à neuf têtes te barre le passage.",
 "A VERY MAD HYDRA IS TIED UP HERE.":"Une hydre folle de rage est attachée ici.",
 "THE LIGHT GROWS STRONGER UNTIL THE ENTIRE ROOM IS BATHED IN ITS GLOW.":"La lumière grandit jusqu’à baigner toute la pièce de son éclat.",
 "A BOLT OF LIGHTNING UNBLOCKS THE PASSAGE!!!":"Un éclair dégage le passage !",
 "A DULL, EERIE GLOW IS EMANATING FROM BEHIND A PILE OF ROCKS.":"Une lueur terne et sinistre émane de derrière un tas de rochers.",
 "A POWERFUL GUST OF WIND HAS BLOWN THE LAMP OUT OF YOUR GRASP.":"Une violente bourrasque t’a arraché la lampe des mains.",
 "A VERY POWERFUL MAGIC FORCE STRIKES YOU AND DRIVES YOU BACK.":"Une force magique très puissante te frappe et te repousse.",
 "A MAGIC SPELL HAS PUSHED YOU BACK OUT OF THIS ROOM.":"Un sortilège t’a repoussé hors de cette pièce.",
 "A MYSTERIOUS FOG BEGINS RISING FROM THE FLOOR!":"Un brouillard mystérieux commence à monter du sol !",
 "IT'S POISONOUS!!":"Il est empoisonné !",
 "AN EERIE PHOSPHORESCENT GLOW FILLS THE ENTIRE ROOM!":"Une étrange lueur phosphorescente emplit toute la pièce !",
 "THE WALLS OF THIS ROOM ARE A VERY STRANGE COLOR!":"Les murs de cette pièce sont d’une couleur très étrange !",
 "A PACKRAT SCURRIES INTO A SMALL HOLE.":"Un rat voleur file se cacher dans un petit trou.",
 "THANK THE PACKRAT FOR THIS TREASURE!":"Remercie le rat voleur pour ce trésor !",
 "YOU HAVE JUST WALKED THROUGH AN ENCHANTED AURA.":"Tu viens de traverser une aura enchantée.",
 "THERE IS A SMALL PIT IN THE CORNER OF THE ROOM.":"Il y a un petit puits dans un coin de la pièce.",
 "A LAYER OF MIST OBSCURES THE EAST WALL.":"Une nappe de brume masque le mur est.",
 "THE SCARAB IS GLOWING.":"Le scarabée luit.",
 "YOU HAVE STUMBLED AND FALLEN.":"Tu as trébuché et tu es tombé.",
 // fins
 "YOU HAVE JUST FALLEN INTO A PIT AND KILLED YOURSELF.":"Tu viens de tomber dans une fosse et de te tuer.",
 "YOUR JUMPING ABILITY IS NOT AS GOOD AS IT ONCE WAS - YOU HAVE FALLEN AND DIED.":"Tu ne sautes plus aussi bien qu’avant : tu es tombé, et tu en es mort.",
 "YOU HAVE DIED FROM EXHAUSTION AND WOUNDS.":"Tu es mort d’épuisement et de tes blessures.",
 "YOU HAVE DIED FROM A SCORPION BITE.":"Tu es mort de la piqûre du scorpion.",
 "THE POISON FOG HAS KILLED YOU!":"Le brouillard empoisonné t’a tué !",
 "YOU PUT UP A GOOD FIGHT, BETTER LUCK NEXT TIME.":"Tu t’es bien battu. Plus de chance la prochaine fois.",
 "CONGRATULATIONS!!!":"Félicitations !",
 "YOU WIN!":"Tu as gagné !",
 // ajout de DragonTales
 "TIME PASSES.":"Le temps passe.",
 "TO SAVE OR LOAD A GAME, USE THE SAVES BUTTON.":"Pour sauvegarder ou reprendre une partie, utilise le bouton Sauvegardes."
};
// ---- phrases composées ----
const MM_VERB_FR={GET:'Prendre',TAKE:'Prendre',GRAB:'Prendre',DROP:'Poser',THROW:'Lancer',OPEN:'Ouvrir',EAT:'Manger',DRINK:'Boire',FILL:'Remplir',
 ASK:'Interroger',KILL:'Tuer',STAB:'Poignarder',JUMP:'Sauter',CLIMB:'Grimper',TIE:'Attacher',PLAY:'Jouer',LAMP:'Lampe',LOOK:'Regarder'};
const MM_PAT=[
 [/^YOU ARE (IN|ON|AT|NEAR) (.+?)\.?$/, (m,s)=>{ const r=MM_ROOM[m[1]+' '+m[2]]; return r?'Tu es '+r[0]+'.':null; }],
 [/^YOU DROPPED THE (\w+)\.$/, m=>`Tu as lâché ${mmLe(m[1])}.`],
 [/^I DO NOT SEE ANY (\w+)\.?$/, m=>`Je ne vois pas ${MM_OBJ[m[1]]?mmDe(m[1]):'de « '+m[1].toLowerCase()+' »'} ici.`],
 [/^YOU ARE HOLDING: ?(.*)$/, m=>{ const w=m[1].trim().split(/\s+/).filter(Boolean);
   if(!w.length||w[0]==='NOTHING') return 'Tu ne portes rien.';
   const l=w.map(x=>MM_SPELLS.includes(x)?x:mmLe(x)); return 'Tu portes : '+(l.length>1?l.slice(0,-1).join(', ')+' et '+l[l.length-1]:l[0])+'.'; }],
 [/^(\w+) WHAT\?$/, m=>MM_VERB_FR[m[1]]?`${MM_VERB_FR[m[1]]} quoi ?`:null],
 [/^TO LEARN THE SECRET OF THE (\w+) YOU MUST POSSESS (.+?)\.?$/, m=>`Pour percer le secret ${MM_SPELLS.includes(m[1])?'de '+m[1]:'d'+(MM_ELIDE.test(mmName(m[1]))?'e l’':(MM_OBJ[m[1]]&&MM_OBJ[m[1]][1]==='f'?'e la ':'u '))+mmName(m[1])}, il te faut posséder ${mmList(m[2])}.`],
 [/^YOU NOW KNOW THE SECRET OF THE MAGIC SPELL (\w+)(?: - YOU WILL DISCOVER THE SECRET OF THE NEXT SPELL IF YOU POSSESS (.+?))?\.?$/, m=>
   `Tu connais désormais le secret du sortilège ${m[1]}.`+(m[2]?` Tu découvriras celui du sortilège suivant si tu possèdes ${mmList(m[2])}.`:'')],
 [/^IN HIS DYING EFFORT THE (\w+) PULLS THE (\w+) FROM A BAG AND THROWS IT BEFORE HE DISAPPEARS IN A PUFF OF PURPLE SMOKE\.$/, m=>
   `Dans un dernier effort, ${mmLe(m[1])} tire ${mmLe(m[2])} d’un sac et ${MM_OBJ[m[2]]&&MM_OBJ[m[2]][1]==='f'?'la':'le'} lance avant de disparaître dans un nuage de fumée pourpre.`],
 [/^(?:THE )?(\w+) IS NOW LAYING AT YOUR FEET!$/, m=>{ const s=mmLe(m[1]); return s[0].toUpperCase()+s.slice(1)+' est maintenant à tes pieds !'; }],
 [/^THE (\w+) IS ATTACKING\.?$/, m=>{ const s=mmLe(m[1]); return s[0].toUpperCase()+s.slice(1)+' attaque !'; }],
 [/^THERE IS NO (\w+) HERE\.$/, m=>`Il n’y a pas ${mmDe(m[1])} ici.`],
 [/^YOU HAVE SCORED (\d+) POINTS OUT OF A TOTAL OF 240 POINTS\.$/, m=>`Tu as marqué ${m[1]} point${+m[1]>1?'s':''} sur 240.`],
 [/^PHYS COND = +(\d+)$/, m=>`État physique : ${m[1]}.`]
];
// phrase anglaise → française (undefined si inconnue)
function mmSentence(s){
  s=s.replace(/ {2,}/g,' ');
  if(Object.prototype.hasOwnProperty.call(MM_MSG,s)) return MM_MSG[s];
  for(const [re,f] of MM_PAT){ const m=re.exec(s); if(m){ const r=f(m,s); if(r!=null) return r; } }
  return undefined;
}
// une ligne de texte → ses phrases (les points de suspension, « !! » et « ? » restent avec leur phrase)
function mmSplit(l){
  const out=[]; let cur='';
  const t=l.trim();
  for(let i=0;i<t.length;i++){ cur+=t[i];
    if(/[.!?]/.test(t[i])&&(t[i+1]===' '||i===t.length-1)&&!/[.!?]/.test(t[i+1]||'')){
      // « TO LEARN THE SECRET OF THE VIAL » suit « SPEAKS... » ; « ... YOU WIN! » : phrase par phrase
      out.push(cur.trim()); cur=''; } }
  if(cur.trim()) out.push(cur.trim());
  return out;
}
function mmSay(text,lang,classic){
  text=text.replace(/THERE IS NO HERE\./g,'THERE IS NO WATER HERE.');   // bug d'origine : le mot WATER manque au message
  if(lang!=='fr') return text;
  const lines=text.split('\n'), out=[];
  for(const l of lines){
    if(!l.trim()){ out.push(l); continue; }
    // « PHYS COND = 255 » suit le score sur sa propre ligne
    const parts=mmSplit(l).map(s=>{ const r=mmSentence(s); return r===undefined?s:r; }).filter(x=>x!==null);
    const t=parts.join(' ');
    out.push(classic?t.toLocaleUpperCase('fr'):t);
  }
  return out.join('\n');
}
function mmClean(s,moved){
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(DIED FROM|HAS KILLED YOU|KILLED YOURSELF|FALLEN AND DIED|BETTER LUCK NEXT TIME)/.test(s)};
}

// ---- ce que tape le joueur : français → anglais du jeu (un verbe, un nom) ----
const FR=(function(){
  const VERBS={PRENDRE:'GET',PRENDS:'GET',RAMASSER:'GET',RAMASSE:'GET',ATTRAPER:'GET',ATTRAPE:'GET',SAISIR:'GET',SAISIS:'GET',
    POSER:'DROP',POSE:'DROP',LAISSER:'DROP',LAISSE:'DROP',LACHER:'DROP',LACHE:'DROP',DEPOSER:'DROP',DEPOSE:'DROP',
    LANCER:'THROW',LANCE:'THROW',JETER:'THROW',JETTE:'THROW',
    INVENTAIRE:'INV',INV:'INV',I:'INV',REGARDER:'LOOK',REGARDE:'LOOK',EXAMINER:'LOOK',EXAMINE:'LOOK',OBSERVER:'LOOK',OBSERVE:'LOOK',
    OUVRIR:'OPEN',OUVRE:'OPEN',MANGER:'EAT',MANGE:'EAT',BOIRE:'DRINK',BOIS:'DRINK',REMPLIR:'FILL',REMPLIS:'FILL',
    INTERROGER:'ASK',INTERROGE:'ASK',DEMANDER:'ASK',DEMANDE:'ASK',CONSULTER:'ASK',CONSULTE:'ASK',
    TUER:'KILL',TUE:'KILL',ATTAQUER:'KILL',ATTAQUE:'KILL',FRAPPER:'KILL',FRAPPE:'KILL',COMBATTRE:'KILL',COMBATS:'KILL',
    POIGNARDER:'STAB',POIGNARDE:'STAB',FUIR:'RUN',FUIS:'RUN',COURIR:'RUN',COURS:'RUN',REVENIR:'BACK',REVIENS:'BACK',RETOUR:'BACK',RETOURNER:'BACK',
    SAUTER:'JUMP',SAUTE:'JUMP',GRIMPER:'CLIMB',GRIMPE:'CLIMB',ESCALADER:'CLIMB',ESCALADE:'CLIMB',ATTACHER:'TIE',ATTACHE:'TIE',NOUER:'TIE',NOUE:'TIE',
    JOUER:'PLAY',JOUE:'PLAY',LAMPE:'LAMP',ALLUMER:'LAMP ON',ALLUME:'LAMP ON',ETEINDRE:'LAMP OFF',ETEINS:'LAMP OFF',
    SCORE:'SCORE',POINTS:'SCORE',AIDE:'HELP',ABANDONNER:'UNCLE',ABANDONNE:'UNCLE',ATTENDRE:'WAIT',ATTENDS:'WAIT',
    SAUVER:'QUIET',SAUVEGARDER:'QUIET'};
  const NOUNS={};
  const add=(en,fr)=>fr.split(' ').forEach(w=>{ NOUNS[w]=en; });
  add('FOOD','NOURRITURE REPAS VIVRES PAIN');add('BOTTLE','BOUTEILLE');add('DAGGER','DAGUE POIGNARD');add('MACE','MASSE');add('AX','HACHE');
  add('SWORD','EPEE');add('SHIELD','BOUCLIER ECU');add('FLUTE','FLUTE');add('MUSHROOM','CHAMPIGNON');add('PENDANT','PENDENTIF');
  add('SCEPTER','SCEPTRE');add('LAMP','LAMPE');add('BASKET','PANIER');add('PARCHMENT','PARCHEMIN PARTITION');add('VIAL','FIOLE');
  add('URN','URNE');add('TALISMAN','TALISMAN');add('SCROLL','ROULEAU MANUSCRIT');add('GOBLET','GOBELET COUPE');add('SKULL','CRANE');
  add('SCARAB','SCARABEE');add('JEWELBOX','COFFRET ECRIN');add('TABLET','TABLETTE');add('ROPE','CORDE');add('SPRITE','LUTIN');
  add('TROGLODYTE','TROGLODYTE');add('SCORPION','SCORPION');add('NYMPH','NYMPHE');add('SATYR','SATYRE');add('MINOTAUR','MINOTAURE');
  add('ORACLE','ORACLE');add('GOLD','OR');add('SILVER','ARGENT SAC');add('DIAMOND','DIAMANT');add('SPELLBOOK','GRIMOIRE LIVRE');
  add('RUBY','RUBIS');add('FLEECE','TOISON');add('TIARA','DIADEME TIARE');add('POWDER','POUDRE');add('AMULET','AMULETTE');add('POTION','POTION');
  add('CROWN','COURONNE');add('OPAL','OPALE');add('SAPPHIRE','SAPHIR');add('WATER','EAU');add('HYDRA','HYDRE');add('LEDGE','CORNICHE REBORD');
  add('CRYPT','CRYPTE TOMBE TOMBEAU');add('DRAPES','TENTURES TENTURE RIDEAUX RIDEAU');
  for(const s of MM_SPELLS) NOUNS[s]=s;
  const PHRASES=[['ANNEAU DE PUISSANCE','POWERRING'],['ANNEAU DE LUMIERE','LIGHTRING'],['ANNEAU DE VERITE','TRUTHRING'],
    ['MASSE D ARMES','MACE'],['COFFRET A BIJOUX','JEWELBOX'],['SAC D ARGENT','SILVER'],['SAC DE POUDRE','POWDER'],['TOISON D OR','FLEECE']];
  const DIRS={N:'N',NORD:'N',S:'S',SUD:'S',E:'E',EST:'E',O:'W',OUEST:'W',H:'U',HAUT:'U',MONTER:'U',MONTE:'U',B:'D',BAS:'D',DESCENDRE:'D',DESCENDS:'D'};
  const STOP=new Set('LE LA LES L UN UNE DES DU DE D AU AUX A SUR SOUS DANS VERS EN AVEC ET MON MA MES CE CET CETTE CES PAR POUR Y LUI'.split(' '));
  const norm=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’`\-]/g,' ').replace(/[^A-Z0-9 ?!]/g,' ').replace(/\s+/g,' ').trim();
  function frToEn(line){
    const n=norm(line); if(!n) return '';
    const t=n.split(' ');
    if(t.length===1&&DIRS[t[0]]) return DIRS[t[0]];
    if((t[0]==='ALLER'||t[0]==='VA'||t[0]==='VAIS')&&t.length>1){ const d=t.slice(1).find(x=>DIRS[x]); if(d) return DIRS[d]; }
    if(MM_SPELLS.includes(t[0])) return t[0];
    if(t[0]==='LAMPE'&&t.length>1) return /^(ALLUM|ON)/.test(t[t.length-1])?'LAMP ON':/^(ETEIN|OFF)/.test(t[t.length-1])?'LAMP OFF':'LAMP';
    const verb=VERBS[t[0]]; if(!verb) return n;               // pas du français connu : transmis tel quel (l'anglais marche)
    if(['INV','SCORE','HELP','UNCLE','WAIT','QUIET','RUN','BACK','LAMP ON','LAMP OFF'].includes(verb)) return verb;
    const restS=' '+t.slice(1).join(' ')+' ';
    for(const [p,en] of PHRASES) if(restS.includes(' '+p+' ')) return verb+' '+en;
    const rest=t.slice(1).filter(x=>!STOP.has(x));
    if(verb==='LOOK'&&!rest.length) return 'LOOK';
    let noun=null; for(const x of rest){ if(NOUNS[x]){ noun=NOUNS[x]; break; } }
    if(!noun&&rest.length) noun=rest[rest.length-1];
    return noun?verb+' '+noun:verb;
  }
  const HELP="VERBES : PRENDRE, POSER, LANCER, INVENTAIRE, REGARDER, OUVRIR, MANGER, BOIRE, REMPLIR, INTERROGER, TUER, POIGNARDER, FUIR, REVENIR, SAUTER, GRIMPER, ATTACHER, JOUER, LAMPE (ALLUMER, ÉTEINDRE), ATTENDRE (UNE MINUTE), SCORE, ABANDONNER.%SORTILÈGES : VETAR, MITRA, OKKAN, AKHIROM, NERGAL, BELROG, CROM, ISHTAR.%DIRECTIONS : N, S, E, O, H (HAUT), B (BAS).%LE JEU NE LIT QUE DEUX MOTS : UN VERBE ET UN NOM (PRENDRE LA LAMPE, INTERROGER L’ORACLE).";
  return {TEXT:{},NOUNS,VERBS,HELP,frToEn};
})();
