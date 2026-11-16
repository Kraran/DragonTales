// El Diablero (Kenneth Kalish, Computerware, 1982) — fiche de l'aventure pour DragonTales.
// Ce fichier est assemblé en dernier, après fr.js, data.js, scenes.js et hints.js du même dossier : FR, ROOMS, SCENES, HINTS
// et ASSETS (fichiers du dossier encodés par build.py) sont donc disponibles ici.
(function(){
const ROOM0=0x12FC, NROOMS=190;          // table des lieux : un octet par lieu, grille de 10 colonnes
const OBJ0=0x0F3F, FIRST=7, LAST=73;      // table des objets : 3 octets (adresse du nom, lieu ; lieu 0 = porté)
const word=(mem,a)=>(mem[a]<<8)|mem[a+1];
const hex4=v=>v.toString(16).toUpperCase().padStart(4,'0');
const str=(mem,a,max)=>{ let s=''; while(mem[a]!==0x23&&s.length<max){ s+=String.fromCharCode(mem[a]); a++; } return s; };

DragonTales.register({
 id:'eldiablero',
 storage:'eldiablero',                    // préfixe des sauvegardes et réglages dans le navigateur
 title:'El Diablero', author:'Kenneth Kalish', publisher:'Computerware', year:1982, system:'Dragon 32',
 blurb:{
  fr:'Seul dans le désert, la mémoire vide, un apprenti sorcier doit retrouver ses sortilèges avant d’affronter le diablero qui a fait disparaître son maître.',
  en:'Alone in the desert, his memory gone, a sorcerer’s apprentice must recover his spells before facing the diablero who made his teacher vanish.'},
 assets:ASSETS,                           // programme (binaire), boite, couverture, musique

 // ---- programme d'origine ----
 machine:{
  load:0x0F00, textHook:0x2137, textEnd:0x23, textLimit:0x4900, victory:0x4402, titleRet:0x1156, cloadAt:0x0F03,
  // Correctif : le programme d'origine oublie de décompter certains objets qui disparaissent pendant qu'on les porte
  // (bol cassé, graines plantées, figurine brisée). On réaligne le compteur ($0F0C) sur le nombre d'objets réellement portés.
  afterRun(mem,wait){ if(wait!=='line') return; let n=0; for(let i=FIRST;i<=LAST;i++) if(mem[OBJ0+2+3*(i-1)]===0) n++; mem[0x0F0C]=n; }
 },

 // ---- textes, lieux, dessins, indices ----
 FR, ROOMS, SCENES, HINTS,
 labels:{
  fr:{
   sub:"Une aventure de Kenneth Kalish, Computerware, 1982. Version française.",
   bye:"À bientôt, apprenti.",
   sfxNote:"Corbeau, coup de feu, magie, eau… Ils ne jouent que dans la version moderne.",
   musicNote:"Elle joue dans le désert et s’efface en fondu dès qu’on le quitte.",
   intro:[
    "Tu te réveilles, hébété et désorienté, au beau milieu d’un désert. Tu apprenais les techniques de la sorcellerie auprès d’un vieil homme. Celui-ci t’avait dit qu’un sorcier maléfique, un « diablero », était devenu son ennemi. À présent, ton maître a disparu et tu es seul. Pire encore, tu ne te souviens plus des sorts que tu avais déjà appris. Tu te rappelles pourtant une strophe étrange :",
    ["Souviens-toi bien du mot de pouvoir,", "Souviens-toi de ce que tu as entendu deux fois.", "Réveille-toi à ce qui demeure en toi.", "Jette au loin le joug de l’ignorance."],
    "Tu es entré dans le monde d’El Diablero !",
    "Ici, tu dois apprendre à acquérir et à utiliser le pouvoir magique, afin de te préparer à l’affrontement final avec ton ennemi."]},
  en:{
   sub:"An adventure by Kenneth Kalish, Computerware, 1982.",
   bye:"See you soon, apprentice.",
   sfxNote:"Crow, gunshot, magic, water… They only play in the modern version.",
   musicNote:"It plays in the desert and fades out as soon as you leave it.",
   intro:[
    "You awake, dazed and confused, in the middle of a desert. You had been learning the techniques of sorcery from an old man. The old man told you that an evil Sorcerer, a “diablero”, had become his enemy. Now, your teacher is missing and you are alone. Worse still, you cannot remember those spells you had already learnt. However, you can remember a strange verse:",
    ["Remember well the power word,", "Remember that which twice you heard.", "Awake to that which dwells within.", "Throw off the yoke of ignorance."],
    "You have entered the world of El Diablero!",
    "Here you must learn to acquire and use magical power, in order to prepare for the final conflict with your enemy."]}
 },
 helpEn:'VERBS: GO (OR THE ARROW KEYS), LOOK, GET, DROP, INV, READ, OPEN, PUSH, PULL, LIFT, TURN, BREAK, CUT, THROW, WEAR, DRINK, SWIM, PLANT, DIP, RING, SAY, GAZE, DREAM, AWAKE, REMEMBER, SHOOT, CSAVE, CLOAD.%EXAMPLES: LOOK ROCK, GET KEY, DREAM MOUNTAIN.',
 // [mot anglais du jeu, libellé français, libellé anglais, s'emploie sans cible ?, sorcellerie ?] — le premier est le verbe par défaut
 verbs:[ // [anglais, français, libellé anglais, sans cible ?, sorcellerie ?]
 ['LOOK','Regarder','Look'],['GET','Prendre','Take'],['DROP','Poser','Drop'],['READ','Lire','Read'],['OPEN','Ouvrir','Open'],
 ['PUSH','Pousser','Push'],['PULL','Tirer','Pull'],['LIFT','Soulever','Lift'],['TURN','Tourner','Turn'],['BREAK','Casser','Break'],
 ['CUT','Couper','Cut'],['THROW','Lancer','Throw'],['WEAR','Porter','Wear'],['DRINK','Boire','Drink'],['PLANT','Planter','Plant'],
 ['DIP','Tremper','Dip'],['RING','Sonner','Ring'],['SHOOT','Faire feu','Shoot'],['SWIM','Nager','Swim'],['GO','Aller vers','Go to'],
 ['GAZE','Contempler','Gaze',0,1],['DREAM','Rêver','Dream',0,1],['AWAKE','Se réveiller','Awake',1,1],['REMEMBER','Se souvenir','Remember',1,1],['SAY','Dire','Say',0,1]
],
 // sons déclenchés par les textes du jeu (adresse du texte -> effet de moteur/sfx.js)
 sfxAt:{'414F':'shot','4054':'dream','4289':'dream','44C6':'dream','2B97':'dream','29A8':'magic','4704':'magic','44D3':'magic','4378':'magic','458A':'magic','2C7F':'magic','3AC4':'magic',
 '3D72':'flash','3E23':'flash','47B7':'smash','47E3':'smash','3FE8':'glow','400B':'glow','4021':'glow','2AA8':'bell','2B4E':'bell','2A2E':'click','488F':'click','4883':'click',
 '2A61':'rumble','2F62':'rumble','2FA9':'rumble','2FF5':'rumble','1BC6':'eagle','1BF7':'eagle','2CE7':'fall','1FD9':'growl','20BB':'growl','19AD':'sting','3A72':'rattle',
 '1D7E':'splash','1F59':'splash','1DB9':'bubbles','2BF4':'bubbles','4405':'victory'},
 frSkip:['TOUT','TERRE','MONTE','MONTER','EST'],       // mots français à ne pas rendre cliquables
 revExtra:{TAKE:'PRENDRE',SMASH:'CASSER',TWIST:'TOURNER',INV:'INVENTAIRE',CSAVE:'SAUVER',CLOAD:'CHARGER'},
 nounEn:w=>FR.frToEn('REGARDER '+w).split(' ')[1]||'',  // nom français tapé -> mot anglais du jeu

 // ---- lecture de l'état du jeu en mémoire ----
 world:{
  rooms:NROOMS, cols:10,
  dirs:{W:'WEST',N:'NORTH',E:'EAST',S:'SOUTH',U:'UP',D:'DOWN'},
  go:w=>'GO '+w, goVerb:'GO', allWord:'EVERY',
  promptAddr:0x2815,                     // texte de l'invite (« WHAT DO I DO NOW? »)
  defaultScene:'15C7', transient:['25C6'], // décor par défaut ; décors qui peuvent s'afficher dans n'importe quel lieu
  roomOff:mem=>word(mem,0x0F13)-ROOM0,
  roomKey:(mem,off)=>hex4(word(mem,0x13BA+2*off)),
  exits(mem,off){ const f=mem[ROOM0+off], dark=!!(f&0x80);
   return {W:!dark&&!(f&1),N:!dark&&!(f&2),E:!dark&&!(f&4),S:!dark&&!(f&8),U:!dark&&!!(f&16),D:!dark&&!!(f&32)}; },
  str,
  locOf:off=>(off+1)&255, carried:0,
  objects(mem){ const out=[]; for(let n=FIRST;n<=LAST;n++){ const p=OBJ0+3*(n-1); out.push({n,np:word(mem,p),loc:mem[p+2]}); } return out; },
  // retire l'invite, l'annonce de mort et les listes déjà montrées par les panneaux
  clean(s){
   s=s.replace(/\n*(QUE DOIS-JE FAIRE \? |WHAT DO I DO NOW\? )$/,'');
   const dm=s.match(/\n*(TU ES MORT, ALORS :|YOU'RE DEAD SO:)\n[^\n]*$/);
   if(dm) s=s.slice(0,dm.index);
   s=s.replace(/\n*(JE VOIS :|I SEE:)\n(?: [^\n]*(?:\n|$))*/g,'\n\n').replace(/\n*(SORTIES VISIBLES :|OBVIOUS EXITS ARE:)\n[^\n]*/g,'');
   return {text:s.replace(/^\n+|\s+$/g,''),death:!!dm};
  },
  proper(s,lang){ s=s.replace(/\buxmal\b/g,'Uxmal').replace(/\bel diablero\b/g,'El Diablero').replace(/\bkenneth kalish\b/g,'Kenneth Kalish');
   return lang==='en'?s.replace(/\bmayan\b/g,'Mayan'):s; },
  musicZone:(key,kind)=>kind==='desert'||kind==='canyon'||key==='1862'||key==='1843',   // la musique revient dans le désert
  ambient(mem,off){ const no=(off+1)&255, l=[]; if(mem[0x0F41+3*8]===no) l.push('rattle'); if(mem[0x0F41+3*9]===no) l.push('crow'); return l; },
  link:en=>/^AWAK/.test(en)?'skip':/^DREA/.test(en)?'dream':null    // passages à ne pas tracer / passages de rêve
 }
});
})();
