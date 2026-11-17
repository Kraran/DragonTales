// Mansion of Doom — textes du jeu et passage du français au jeu.
// ÉBAUCHE : pour l'instant say() rend les lignes anglaises telles quelles ; la traduction française des messages,
// des descriptions et des objets viendra ici (tables MD_DESC, MD_OBJ, MD_MSG, comme pour S.S. Poseidon).
// Le jeu lit une commande de deux mots, dont il ne garde que les trois premières lettres : verbe (GET, DROP, OPEN, CLOSE,
// LOOK, EXAMINE, SHOOT, READ) puis nom. Une lettre seule (N, S, E, W, U, D) déplace. Quelques phrases sont lues en entier :
// SLAY VAMPIRE, YOREL (dans les fers), DOG (en tombant dans le puits), INVENTORY, HELP, QUIT.
const MD_NORM=s=>s.replace(/ +/g,' ').trim();
function mdSay(text,lang,classic){ return text; }
// ÉBAUCHE : la version moderne retirera ce que ses panneaux montrent déjà (« YOU CAN SEE », « YOU CAN GO », l'invite, les tirets).
function mdClean(s,moved){
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(VERY DEAD|YOU ARE DEAD|tu es mort)/i.test(s)};
}
const FR=(function(){
  const VERBS={PRENDRE:'GET',PRENDS:'GET',RAMASSER:'GET',RAMASSE:'GET',POSER:'DROP',POSE:'DROP',LAISSER:'DROP',LAISSE:'DROP',LACHER:'DROP',LACHE:'DROP',
    OUVRIR:'OPEN',OUVRE:'OPEN',FERMER:'CLOSE',FERME:'CLOSE',ABAISSER:'CLOSE',ABAISSE:'CLOSE',
    REGARDER:'LOOK',REGARDE:'LOOK',EXAMINER:'EXAMINE',EXAMINE:'EXAMINE',FOUILLER:'EXAMINE',FOUILLE:'EXAMINE',
    TIRER:'SHOOT',TIRE:'SHOOT',ABATTRE:'SHOOT',ABATS:'SHOOT',LIRE:'READ',LIS:'READ',
    INVENTAIRE:'INVENTORY',I:'INVENTORY',INV:'INVENTORY',SECOURS:'HELP',AIDE:'HELP',QUITTER:'QUIT',QUITTE:'QUIT',
    TUER:'SLAY',TUE:'SLAY'};
  const NOUNS={};
  const add=(en,fr)=>fr.split(' ').forEach(w=>{ NOUNS[w]=en; });
  add('WRITING','ECRITURE INSCRIPTION');add('CROSS','CROIX CRUCIFIX');add('BOX','BOITE CARTON');add('BULLET','BALLE');add('MIRRORS','MIROIRS MIROIR GLACES');
  add('GUN','PISTOLET REVOLVER ARME');add('TEXT','MANUEL');add('STAKE','PIEU');add('DESK','SECRETAIRE BUREAU');add('DICTIONARY','DICTIONNAIRE');
  add('CHEST','COFFRE');add('EYE','OEIL');add('SWITCH','INTERRUPTEUR');add('WORMS','VERS');add('TORCH','TORCHE');add('SULPHUR','SOUFRE');
  add('SKELETONS','SQUELETTES');add('MAGGOTS','ASTICOTS');add('HANDS','MAINS');add('SACK','SAC');add('DOG','CHIEN');add('WEREWOLF','LOUP GAROU');
  add('LADDER','ECHELLE');add('MALLET','MAILLET MASSE');add('HAMMER','MARTEAU');add('DOOR','PORTE');add('WATCH','MONTRE');add('RAT','RAT');
  add('CORPSES','CADAVRES');add('MONGOOSE','MANGOUSTE');add('TABLE','TABLE');add('NOTE','BILLET MOT');add('PIT','PUITS FOSSE');add('MEAT','VIANDE');
  add('CANDLE','BOUGIE CHANDELLE');add('PORTRAIT','PORTRAIT');add('MAP','CARTE PLAN');add('SNAKE','SERPENT');add('COBWEBS','TOILES ARAIGNEE');
  add('SIGN','PANNEAU PANCARTE');add('CAGE','CAGE');add('TRAPDOOR','TRAPPE');add('TUNNEL','TUNNEL');add('BODIES','CORPS');add('MUD','BOUE');
  add('QUICKSAND','SABLES MOUVANTS');add('CRACK','FISSURE FENTE');add('BATS','CHAUVES SOURIS');add('VATS','CUVES');add('WOMAN','FEMME');
  add('COFFIN','CERCUEIL');add('VAMPIRE','VAMPIRE');add('ACID','ACIDE');add('POTION','POTION FIOLE');add('SHACKELS','FERS CHAINES');
  add('ALMANAC','ALMANACH');add('BOOKCASE','BIBLIOTHEQUE ETAGERE');add('CHANDALIER','LUSTRE');add('PRINCESS','PRINCESSE');add('CASKET','CASSETTE');
  add('KEY','CLE');add('GARLIC','AIL');
  const DIRS={N:'N',NORD:'N',S:'S',SUD:'S',E:'E',EST:'E',O:'W',OUEST:'W',H:'U',HAUT:'U',MONTER:'U',MONTE:'U',B:'D',BAS:'D',DESCENDRE:'D',DESCENDS:'D'};
  const STOP=new Set('LE LA LES L UN UNE DES DU DE D AU AUX A SUR DANS VERS EN AVEC ET MON MA MES CE CET CETTE CES PAR POUR Y'.split(' '));
  const norm=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/['’`\-]/g,' ').replace(/[^A-Z0-9 ?!]/g,' ').replace(/\s+/g,' ').trim();
  function frToEn(line){
    const n=norm(line); if(!n) return '';
    let t=n.split(' ');
    if(t.length===1&&DIRS[t[0]]) return DIRS[t[0]];
    if((t[0]==='ALLER'||t[0]==='VA')&&t.length>1){ const d=t.slice(1).find(x=>DIRS[x]); if(d) return DIRS[d]; }
    const verb=VERBS[t[0]]; if(!verb) return n;               // pas du français connu : transmis tel quel (l'anglais marche)
    const rest=t.slice(1).filter(x=>!STOP.has(x));
    let noun=null; for(const x of rest){ if(NOUNS[x]){ noun=NOUNS[x]; break; } }
    if(!noun&&rest.length) noun=rest[rest.length-1];
    return noun?verb+' '+noun:verb;
  }
  const HELP="ÉBAUCHE — VERBES : PRENDRE, POSER, OUVRIR, FERMER, REGARDER, EXAMINER, TIRER, LIRE, INVENTAIRE, SECOURS, QUITTER. DIRECTIONS : N, S, E, O, H, B.%LE JEU NE LIT QUE DEUX MOTS : UN VERBE ET UN NOM (PRENDRE LA CAGE, OUVRIR LE COFFRE).";
  return {TEXT:{},NOUNS,VERBS,HELP,frToEn};
})();
