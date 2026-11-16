// Dragon Mountain (Dragon Data, 1982) — fiche de l'aventure pour DragonTales.
// EN COURS (voir EN-COURS.md) : build.py ne l'inclut pas encore dans DragonTales.html.
// Le jeu est écrit en Dragon BASIC : il tourne dans moteur/basic.js, et la partie se lit dans ses variables
// (R : lieu courant, P(lieu,direction) : passages, L(objet) : lieu de chaque objet, 0 = porté).
(function(){
const DIRS=['U','D','N','S','E','W'];              // ordre des colonnes de P(lieu, 1..6) : haut, bas, nord, sud, est, ouest
const OBJ_FIRST=7, OBJ_LAST=25;                      // objets que l'on peut voir et prendre (O$(7..25), OD$(7..25))
const PASSAGE={200:'porte verrouillée',300:'porte noire',500:'sortie',600:'force invisible'};

DragonTales.register({
 id:'dragonmountain',
 storage:'dragonmountain',
 title:'Dragon Mountain', author:'', publisher:'Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'Un trésor dort au cœur de la montagne, gardé par un dragon, un démon et des elfes. Il faudra de quoi manger, boire, se couvrir et combattre pour en ressortir vivant.',
  en:'A treasure lies in the heart of the mountain, guarded by a dragon, a demon and elves. You will need food, water, warmth and weapons to come out alive.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},

 // ---- programme d'origine ----
 machine:{
  kind:'basic',                                      // programme BASIC : moteur/basic.js au lieu de l'émulateur 6809
  victory:/I HAVE ALL THE TREASURE/                  // texte affiché à la victoire ; toute autre fin est une mort
 },

 // ---- lecture de l'état du jeu ----
 world:{
  rooms:35,
  dirs:{N:'NORTH',S:'SOUTH',E:'EAST',W:'WEST',U:'UP',D:'DOWN'},
  go:w=>'GO '+w, goVerb:'GO',
  roomOff:mem=>mem.v('R')-1,
  roomKey:(mem,off)=>String(off+1),
  // destination de chaque sortie : numéro de lieu (0 = rien), ou le nom d'un passage particulier
  links(mem,off){ const r=off+1, out={};
   DIRS.forEach((d,i)=>{ const v=mem.a('P',r,i+1); out[d]=v>=1&&v<=35?v-1:PASSAGE[v]||null; }); return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; DIRS.forEach(d=>e[d]=typeof l[d]==='number'); return e; },
  locOf:off=>off+1, carried:0,
  objects(mem){ const out=[]; for(let n=OBJ_FIRST;n<=OBJ_LAST;n++) out.push({n,name:mem.a('OD$',n),word:mem.a('O$',n),loc:mem.a('L',n)}); return out; },
  // état des épreuves : utile aux indices et à la carte
  flags(mem){ return {mange:mem.v('FE')===1, bu:mem.v('WD')===1, repose:mem.v('RF')===1, manteau:mem.v('CC')===1,
   elfe:mem.v('EP')===1, demon:mem.v('DE')===1, dragon:mem.v('DP')===1,
   elfes:(mem.v('E1')===1)+(mem.v('E2')===1), demonMort:mem.v('DD')===1, dragonMort:mem.v('DR')===1, porte22:mem.v('UL')===1}; }
 }
});
})();
