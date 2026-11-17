// S.S. Poseidon (Poseidon Adventure) — Bill et Debbie Cook, Dragon Data, 1982 — fiche de l'aventure pour DragonTales.
// Jeu en Dragon BASIC (moteur/basic.js). La partie se lit dans ses variables :
//   L lieu courant (1 à 20) ; R$(L,1) description, R$(L,2) sorties (« NOSO0411 » : nord vers 4, sud vers 11) ;
//   O$(n,1) nom de l'objet, O$(n,2) mot reconnu (3 lettres), O$(n,3) lieu (« 99 » porté, « 0 » caché), O$(n,4) description ;
//   T coups joués, MT coups permis (niveau), NO objets portés (5 au plus), C coupures, F1…F7 et DK : voir flags().
(function(){
const CODE={NO:'N',SO:'S',EA:'E',WE:'W',UP:'U',DO:'D'};
DragonTales.register({
 id:'poseidon', order:3,
 storage:'poseidon',
 title:'S.S. Poseidon', author:'Bill et Debbie Cook', publisher:'Dragon Data', year:1982, system:'Dragon 32',
 blurb:{
  fr:'Une vague géante a retourné le paquebot Poseidon, qui flotte la quille en l’air. Remonte vers la coque avant que l’eau n’envahisse tout.',
  en:'A tidal wave has capsized the liner Poseidon, which floats upside down. Climb up to the hull before the water fills the ship.'},
 assets:typeof ASSETS!=='undefined'?ASSETS:{},
 machine:{
  kind:'basic',
  victory:/MADE IT TO FREEDOM/,
  endKeyLines:[2220],                                 // « WANT TO TRY AGAIN? » : fin de partie
  echo:false
 },
 world:{
  rooms:20,
  dirs:{N:'NORTH',S:'SOUTH',E:'EAST',W:'WEST',U:'UP',D:'DOWN'},
  go:w=>'GO '+w, goVerb:'GO',
  roomOff:mem=>mem.v('L')-1,
  roomKey:(mem,off)=>String(off+1),
  links(mem,off){ const s=mem.a('R$',off+1,2), h=s.length/2, out={N:null,S:null,E:null,W:null,U:null,D:null};
   for(let i=0;i<h;i+=2){ const c=s.substr(i,2), to=+s.substr(h+i,2)-1; if(CODE[c]) out[CODE[c]]=to; else if(c==='CA') out.cable=to; }
   return out; },
  exits(mem,off){ const l=this.links(mem,off), e={}; for(const d of ['N','S','E','W','U','D']) e[d]=typeof l[d]==='number'; return e; },
  locOf:off=>off+1, carried:99,
  objects(mem){ const out=[]; for(let n=8;n<=30;n++){ const name=mem.a('O$',n,1); if(!name) continue; out.push({n,name,word:mem.a('O$',n,2),loc:+mem.a('O$',n,3)||0}); } return out; },
  flags(mem){ return {coups:mem.v('T'),max:mem.v('MT'),vitamines:mem.v('F1')===1,feuEteint:mem.v('F2')===1,armoire:mem.v('F3'),gilet:mem.v('F4')===2,
   corde:mem.v('F5')===1,debris:mem.v('F6'),inonde:mem.v('F7')===1,noir:mem.v('DK')===1,coupures:mem.v('C')}; }
 }
});
})();
