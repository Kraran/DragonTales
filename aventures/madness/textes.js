// Madness and the Minotaur — textes : ÉBAUCHE. Pour l'instant le jeu s'affiche en anglais dans les deux langues ;
// la traduction (phrases du jeu, descriptions, passages, objets) est une étape du plan (docs/PLAN-MADNESS.md).
const MM_WORDS=['FOOD','BOTTLE','DAGGER','MACE','AX','SWORD','SHIELD','FLUTE','MUSHROOM','PENDANT','SCEPTER','LAMP','BASKET','PARCHMENT','VIAL','URN',
 'TALISMAN','SCROLL','GOBLET','SKULL','SCARAB','JEWELBOX','TABLET','ROPE','SPRITE','TROGLODYTE','SCORPION','NYMPH','SATYR','MINOTAUR','ORACLE',
 'GOLD','SILVER','DIAMOND','SPELLBOOK','RUBY','FLEECE','TIARA','POWDER','AMULET','POTION','POWERRING','LIGHTRING','TRUTHRING','CROWN','OPAL','SAPPHIRE'];
function mmSay(text,lang,classic){
  text=text.replace(/THERE IS NO HERE\./g,'THERE IS NO WATER HERE.');   // bug d'origine : le mot WATER manque au message
  return text; }
function mmClean(s,moved){
  s=s.replace(/\n{3,}/g,'\n\n');
  return {text:s.replace(/^\s+|\s+$/g,''),death:/(DIED FROM|HAS KILLED YOU|YOU ARE DEAD|KILLED YOU)/.test(s)};
}
const FR=(function(){
  const NOUNS={}; for(const w of MM_WORDS) NOUNS[w]=w;
  return {NOUNS,TEXT:{},VERBS:{},HELP:'',frToEn:s=>s};
})();
