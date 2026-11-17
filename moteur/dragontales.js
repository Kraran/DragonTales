// DragonTales — moteur d'aventures textuelles du Dragon 32/64.
// Ce fichier contient : l'étagère (page de garde où l'on choisit une aventure) et l'interface de jeu commune
// (journal, verbes, carte, illustrations, version classique, sauvegardes, pièces magiques, musique, sons).
// Chaque aventure est un dossier de aventures/ qui s'enregistre avec DragonTales.register({...}) : voir AJOUTER-UNE-AVENTURE.md.
(function(){
'use strict';
const $=id=>document.getElementById(id);
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
const LS={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}};
const SS={get(k){try{return sessionStorage.getItem(k);}catch(e){return null;}},set(k,v){try{sessionStorage.setItem(k,v);}catch(e){}},del(k){try{sessionStorage.removeItem(k);}catch(e){}}};
const ADVENTURES=window.DragonTales.adventures.slice().sort((a,b)=>(a.order||99)-(b.order||99));   // ordre sur l'étagère
let lang='fr';   // toujours en français au lancement
let shelfOpen=true, current=null;   // étagère affichée ? ; aventure chargée (une seule à la fois par page)

// ---------- libellés ----------
const T={
 fr:{here:'Ici',inv:'Je porte',lex:'Mots rencontrés',nothing:'rien',none:'aucun pour l’instant',
  ph:'Clique un verbe puis un mot, ou écris ta commande…',cancel:'Annuler',
  armed:v=>v+'… choisis une cible (ou reclique le verbe)',
  undo:'Défaire',saves:'Sauvegardes',restart:'Recommencer',lang:'English',full:'Plein écran',help:'Aide',options:'Options',quit:'Quitter',quitAsk:'Quitter le jeu ?',quitNote:'Ta partie est sauvegardée automatiquement : tu pourras la reprendre au prochain lancement.',quitNoSave:'Aucune partie n’est en cours.',stay:'Rester',
  bye:'À bientôt.',byeNote:'Tu peux fermer cette fenêtre.',back:'Revenir au jeu',language:'Langue',sfx:'Effets sonores',sfxVol:'Volume des effets',sfxNote:'Ils ne jouent que dans la version moderne.',
  musicInGame:'Musique pendant le jeu',musicNote:'Sans cette option, elle ne joue que sur l’écran d’introduction.',volume:'Volume de la musique',on:'Activée',off:'Désactivée',
  musicBlocked:'Clique n’importe où pour lancer la musique.',
  start:'Commencer',resume:'Reprendre la partie',
  dead:'Tu es mort',retry:'Recommencer du début',undoLast:'Annuler le dernier coup',loadSave:'Charger une sauvegarde',
  won:'Ta tâche est accomplie',again:'Rejouer',over:'Fin de la partie',
  save:'Sauvegarder',load:'Charger',close:'Fermer',slot:n=>'Emplacement '+n,emptySlot:'vide',auto:'Sauvegarde automatique',
  coin:'Pièce magique',coinTip:n=>'Pièce magique : un indice pour te mettre sur la voie (il en reste '+n+')',coinAsk:n=>'Chaque pièce magique donne un indice sur ce qu’il faut chercher maintenant. Il t’en reste '+n+' pour toute la partie.',
  coinUse:'Utiliser une pièce',coinKeep:'La garder',coinNone:'Tu n’as plus de pièce magique.',coinHead:n=>n?'La pièce se dissout dans ta main. Il t’en reste '+n+'.':'La dernière pièce se dissout dans ta main.',
  saved:'Partie sauvegardée.',loaded:t=>'Partie chargée : '+t+'.',undone:'Dernier coup annulé.',noSave:'Aucune sauvegarde rapide.',
  quick:'Sauvegarde rapide enregistrée.',quickLoaded:'Sauvegarde rapide rechargée.',confirm:'Recommencer la partie ?',confirmNote:'Tu repars du début avec trois pièces magiques. La partie en cours sera perdue, sauf si tu l’as enregistrée dans un emplacement de sauvegarde.',
  walkStop:'Je m’arrête : quelque chose a changé en chemin.',mapTitle:'Carte des lieux visités',enlarge:'Agrandir',
  mapHint:'Clique un lieu pour t’y rendre. En pointillés turquoise : les passages particuliers déjà empruntés, avec la commande utilisée. ▲▼ : on peut monter ou descendre.',dreamTag:'rêve',mapUnknown:'Lieu hors carte',
  helpTitle:'Comment jouer',
  helpText:['Clique un verbe, puis sa cible : un mot souligné dans le texte, un objet de la liste « Ici » ou « Je porte », un mot déjà rencontré ou une direction.',
   'Un clic direct sur un mot ou un objet le regarde. Un second clic sur le verbe choisi le lance sans cible (Rêver, Nager, Regarder…).',
   'Sur la carte, clique un lieu déjà visité pour t’y rendre. La boussole ou les flèches du clavier déplacent d’une case.',
   'Tu peux toujours écrire : « prendre la clé », « n », « regarder ». Ctrl+Z annule le dernier coup, Échap annule le verbe choisi.',
   'Tu portes trois pièces magiques. Chacune donne un indice sur ce qu’il faut chercher à ce moment de l’aventure : clique une pièce, ou écris « utiliser une pièce ». Elles ne reviennent pas.'],
  toClassic:'Version classique',toModern:'Version moderne',
  cEnd:'\n\nFIN DE LA PARTIE.\nAPPUIE SUR UNE TOUCHE POUR REJOUER.',cWon:'\n\n*** BRAVO, TA TÂCHE EST ACCOMPLIE ! ***\nAPPUIE SUR UNE TOUCHE POUR REJOUER.',
  exportGame:'Exporter vers un fichier',importGame:'Importer un fichier',portNote:'Un fichier de sauvegarde permet de reprendre la partie en cours sur un autre ordinateur ou dans un autre navigateur.',
  exported:n=>'Partie exportée dans « '+n+' ».',importBad:'Ce fichier n’est pas une sauvegarde DragonTales lisible.',importOther:a=>'Cette sauvegarde vient d’une autre aventure ('+a+').',
  about:'À propos',aboutDesc:'Un moteur pour rejouer sur PC les aventures textuelles du Dragon 32/64. Le programme d’origine tourne tel quel dans un émulateur 6809 ; DragonTales lui ajoute la traduction française, le jeu à la souris, une carte, des illustrations, des sauvegardes, des indices, de la musique et des sons.',
  abVersion:'Version',abDate:'Date',abAuthor:'Auteur',abRepo:'Dépôt',abStack:'Techno',abStackText:'HTML, CSS, JavaScript (émulateur 6809), Python pour l’assemblage',abGames:'Aventures',
  aboutNote:'Logiciel fourni « tel quel ». Les programmes, textes et illustrations d’origine des aventures appartiennent à leurs auteurs et éditeurs.',abProfile:'Profil Kraran',abGithub:'Dépôt GitHub',
  backShelf:'Retour à DragonTales',play:'Jouer',playing:'Partie en cours',noGame:'Pas encore commencée',by:'de',
  shelfTag:'Les aventures textuelles du Dragon 32/64, traduites et illustrées',soon:'D’autres aventures prendront place ici.',difficulty:'Difficulté',overall:'Note globale',shPrev:'Aventures précédentes',shNext:'Aventures suivantes',quitShelf:'Quitter DragonTales ?',quitShelfNote:'Les parties en cours sont sauvegardées automatiquement.',
  dirs:{W:'Ouest',N:'Nord',E:'Est',S:'Sud',U:'Haut',D:'Bas'}},
 en:{here:'Here',inv:'Carrying',lex:'Words met so far',nothing:'nothing',none:'none yet',
  ph:'Click a verb then a word, or type a command…',cancel:'Cancel',
  armed:v=>v+'… pick a target (or click the verb again)',
  undo:'Undo',saves:'Saved games',restart:'Restart',lang:'Français',full:'Full screen',help:'Help',options:'Options',quit:'Quit',quitAsk:'Quit the game?',quitNote:'Your game is saved automatically: you can resume it next time.',quitNoSave:'No game is in progress.',stay:'Stay',
  bye:'See you soon.',byeNote:'You can close this window.',back:'Back to the game',language:'Language',sfx:'Sound effects',sfxVol:'Effects volume',sfxNote:'They only play in the modern version.',
  musicInGame:'Music during the game',musicNote:'Without this option it only plays on the intro screen.',volume:'Music volume',on:'On',off:'Off',
  musicBlocked:'Click anywhere to start the music.',
  start:'Begin',resume:'Resume game',
  dead:'You are dead',retry:'Start over',undoLast:'Undo the last move',loadSave:'Load a saved game',
  won:'Your task is complete',again:'Play again',over:'Game over',
  save:'Save',load:'Load',close:'Close',slot:n=>'Slot '+n,emptySlot:'empty',auto:'Autosave',
  coin:'Magic coin',coinTip:n=>'Magic coin: a hint to put you on the right track ('+n+' left)',coinAsk:n=>'Each magic coin gives a hint about what to look for now. You have '+n+' left for the whole game.',
  coinUse:'Use a coin',coinKeep:'Keep it',coinNone:'You have no magic coin left.',coinHead:n=>n?'The coin dissolves in your hand. You have '+n+' left.':'The last coin dissolves in your hand.',
  saved:'Game saved.',loaded:t=>'Game loaded: '+t+'.',undone:'Last move undone.',noSave:'No quick save found.',
  quick:'Quick save stored.',quickLoaded:'Quick save restored.',confirm:'Restart the game?',confirmNote:'You start again from the beginning with three magic coins. The current game will be lost unless you stored it in a save slot.',
  walkStop:'I stop: something changed on the way.',mapTitle:'Map of visited places',enlarge:'Enlarge',
  mapHint:'Click a place to walk there. Dashed turquoise lines: special passages already taken, with the command used. ▲▼: you can go up or down.',dreamTag:'dream',mapUnknown:'Off the map',
  helpTitle:'How to play',
  helpText:['Click a verb, then its target: an underlined word in the text, an object under “Here” or “Carrying”, a word met earlier, or a direction.',
   'Clicking a word or an object directly looks at it. Clicking the chosen verb a second time runs it with no target (Dream, Swim, Look…).',
   'On the map, click a place you have visited to walk there. The compass or the arrow keys move one step.',
   'You can always type: “get key”, “go north”, “look”. Ctrl+Z undoes the last move, Esc cancels the chosen verb.',
   'You carry three magic coins. Each gives a hint about what to look for at that point of the adventure: click a coin, or type “use a coin”. They do not come back.'],
  toClassic:'Classic version',toModern:'Modern version',
  cEnd:'\n\nGAME OVER.\nPRESS ANY KEY TO PLAY AGAIN.',cWon:'\n\n*** WELL DONE, YOUR TASK IS COMPLETE! ***\nPRESS ANY KEY TO PLAY AGAIN.',
  exportGame:'Export to a file',importGame:'Import a file',portNote:'A save file lets you carry on the current game on another computer or in another browser.',
  exported:n=>'Game exported to “'+n+'”.',importBad:'This file is not a readable DragonTales save.',importOther:a=>'This save belongs to another adventure ('+a+').',
  about:'About',aboutDesc:'An engine for replaying Dragon 32/64 text adventures on a PC. The original program runs unchanged in a 6809 emulator; DragonTales adds a French translation, mouse play, a map, illustrations, saved games, hints, music and sound.',
  abVersion:'Version',abDate:'Date',abAuthor:'Author',abRepo:'Repository',abStack:'Built with',abStackText:'HTML, CSS, JavaScript (6809 emulator), Python for the build',abGames:'Adventures',
  aboutNote:'Software provided “as is”. The original programs, texts and artwork of the adventures belong to their authors and publishers.',abProfile:'Kraran’s profile',abGithub:'GitHub repository',
  backShelf:'Back to DragonTales',play:'Play',playing:'Game in progress',noGame:'Not started yet',by:'by',
  shelfTag:'Text adventures from the Dragon 32/64, translated and illustrated',soon:'More adventures will take their place here.',difficulty:'Difficulty',overall:'Overall rating',shPrev:'Previous adventures',shNext:'Next adventures',quitShelf:'Quit DragonTales?',quitShelfNote:'Games in progress are saved automatically.',
  dirs:{W:'West',N:'North',E:'East',S:'South',U:'Up',D:'Down'}}
};
const t0=()=>T[lang];
function flipLang(){ lang=lang==='fr'?'en':'fr'; LS.set('dragontales.lang',lang); document.documentElement.lang=lang; }

// ---------- fichiers embarqués ----------
const urls=new Map();
function assetURL(a){ // {mime,b64} -> adresse utilisable par <img>, <audio> ou CSS
  if(!a||!a.b64) return '';
  if(!urls.has(a)) urls.set(a,URL.createObjectURL(new Blob([Uint8Array.from(atob(a.b64),c=>c.charCodeAt(0))],{type:a.mime})));
  return urls.get(a);
}

// ---------- écran ----------
let firstGesture=false, autoFullAt=0;
function enterFullscreen(){ const d=document.documentElement; if(!document.fullscreenElement&&d.requestFullscreen) d.requestFullscreen().catch(()=>{}); }
function fullscreen(){ const d=document.documentElement; if(Date.now()-autoFullAt<900) return;   // le plein écran vient d'être mis par ce même clic
  if(document.fullscreenElement) document.exitFullscreen(); else if(d.requestFullscreen) d.requestFullscreen().catch(()=>{}); }
function fit(){ const s=Math.min(innerWidth/1920,innerHeight/1080), st=$('stage').style; st.transform='translate('+((innerWidth-1920*s)/2)+'px,'+((innerHeight-1080*s)/2)+'px) scale('+s+')'; }
addEventListener('resize',fit);
['pointerdown','keydown'].forEach(e=>document.addEventListener(e,ev=>{   // premier geste : passage en plein écran
  if(!firstGesture&&!(ev.type==='keydown'&&(ev.key==='Escape'||ev.key==='F11'))){ firstGesture=true; if(!document.fullscreenElement){ autoFullAt=Date.now(); enterFullscreen(); } } },true));

// ---------- fenêtres ----------
const ov=$('overlay');
function overlay(cls,build){ ov.className=cls||''; ov.textContent=''; const c=el('div','card'); build(c); ov.appendChild(c); ov.hidden=false; const b=c.querySelector('button.main')||c.querySelector('button'); if(b) b.focus(); }
function hideOverlay(){ ov.hidden=true; ov.textContent=''; if(shelfOpen){ const b=$('shelf').querySelector('button.main'); if(b) b.focus(); } else $('in').focus(); }
function btn(parent,label,fn,main){ const b=el('button',main?'main':'',label); b.type='button'; b.onclick=fn; parent.appendChild(b); return b; }

// ---------- étagère : la page de garde de DragonTales ----------
let picked=0;
function savedGame(a){ try{ const d=JSON.parse(LS.get(a.storage+'.slot.auto')||'null'); return d&&d.date?d:null; }catch(e){ return null; } }
function renderShelf(){
  const sh=$('shelf'); const old=sh.querySelector('.shRow'), keep=old?old.scrollLeft:0;   // garder la position de défilement
  sh.textContent='';
  document.title='DragonTales';
  const head=el('header','shHead');
  const h=el('h1'), hb=el('button','shTitle'); hb.type='button'; hb.title=t0().about; hb.onclick=showAbout;
  hb.appendChild(el('span','shDragon','Dragon')); hb.appendChild(el('span','shTales','Tales')); h.appendChild(hb); head.appendChild(h);
  head.appendChild(el('p','shTag',t0().shelfTag));
  sh.appendChild(head);
  const row=el('div','shRow');
  ADVENTURES.forEach((a,i)=>{
    const b=el('button','shBox'+(i===picked?' on':'')); b.type='button'; b.setAttribute('aria-label',a.title); b.setAttribute('aria-pressed',i===picked?'true':'false');
    const im=el('img'); im.src=assetURL(a.assets.boite); im.alt=''; b.appendChild(im);
    b.onclick=()=>{ if(picked===i) launch(a); else { picked=i; renderShelf(); } };
    row.appendChild(b);
  });
  const empty=el('div','shBox shEmpty'); empty.appendChild(el('span',null,t0().soon)); row.appendChild(empty);
  // flèches de part et d'autre : une boîte de plus à chaque clic ; grisées au bout, cachées si tout tient
  const strip=el('div','shStrip'), arrow=(dir,label)=>{ const b=el('button','shArrow'); b.type='button'; b.setAttribute('aria-label',label); b.title=label;
    b.innerHTML=`<svg viewBox="0 0 22 96" aria-hidden="true"><path d="${dir<0?'M20 2 L2 48 L20 94Z':'M2 2 L20 48 L2 94Z'}"/></svg>`;
    b.onclick=()=>{ const box=row.querySelector('.shBox'), step=box?box.offsetWidth+44:400, max=row.scrollWidth-row.clientWidth;
      glide(Math.max(0,Math.min(max,(Math.round(row.scrollLeft/step)+dir)*step))); }; return b; };
  // défilement animé à la main : Chrome interrompt le défilement doux du navigateur lancé pendant un clic
  let glideId=0;
  const glide=to=>{ const id=++glideId, from=row.scrollLeft, d=to-from, t1=performance.now(); row.style.scrollBehavior='auto';
    const f=now=>{ if(id!==glideId) return; const k=Math.min(1,(now-t1)/340), e=1-Math.pow(1-k,3); row.scrollLeft=from+d*e;
      if(k<1) requestAnimationFrame(f); else row.style.scrollBehavior=''; }; requestAnimationFrame(f); };
  const left=arrow(-1,t0().shPrev), right=arrow(1,t0().shNext);
  const arrows=()=>{ const max=row.scrollWidth-row.clientWidth, fit=max<=2; left.hidden=right.hidden=fit; left.disabled=row.scrollLeft<=2; right.disabled=row.scrollLeft>=max-2; };
  strip.appendChild(left); strip.appendChild(row); strip.appendChild(right); sh.appendChild(strip);
  row.addEventListener('scroll',arrows,{passive:true});
  if(!window.__shResize){ window.__shResize=true; addEventListener('resize',()=>{ const r=document.querySelector('#shelf .shRow'); if(r) r.dispatchEvent(new Event('scroll')); }); }
  row.scrollTo({left:keep,behavior:'instant'});
  arrows();
  // la molette fait défiler l'étagère de gauche à droite
  row.addEventListener('wheel',ev=>{ if(Math.abs(ev.deltaY)>Math.abs(ev.deltaX)&&row.scrollWidth>row.clientWidth){ ev.preventDefault(); row.scrollBy({left:ev.deltaY*1.5}); } },{passive:false});
  // la boîte choisie reste visible (flèches du clavier)
  const on=row.querySelector('.shBox.on'); if(on){ const l=on.offsetLeft-row.offsetLeft, r=l+on.offsetWidth; if(l<keep+12||r>keep+row.clientWidth-12) row.scrollTo({left:Math.max(0,l<keep+12?l-14:r-row.clientWidth+14)}); }
  const a=ADVENTURES[picked], info=el('section','shInfo');
  if(a){
    info.appendChild(el('h2',null,a.title));
    info.appendChild(el('p','shMeta',[a.author?t0().by+' '+authorOf(a):'',a.publisher,a.year,a.system].filter(Boolean).join(', ')));
    info.appendChild(el('p','shBlurb',a.blurb[lang]));
    if(a.rating) info.appendChild(ratingEl(a.rating));
    const d=savedGame(a);
    info.appendChild(el('p','shState',d?t0().playing+' ('+new Date(d.date).toLocaleDateString(lang,{day:'numeric',month:'long',year:'numeric'})+')':t0().noGame));
    const r=el('div','row'); btn(r,t0().play,()=>launch(a),true); info.appendChild(r);
  }
  sh.appendChild(info);
  const foot=el('footer','shFoot');
  foot.appendChild(el('span','shVer','DragonTales '+(window.DragonTales.version||'')));
  btn(foot,t0().lang,()=>{ flipLang(); renderShelf(); if(current) current.relang(); });
  btn(foot,t0().quit,askQuitShelf);
  sh.appendChild(foot);
  const m=info.querySelector('button.main'); if(m&&ov.hidden) m.focus();
}
// notes sur 5 en étoiles, chacune remplie au prorata (3,8 : trois pleines et une remplie aux huit dixièmes)
const STAR='M12 1.6l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.7l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9Z';
let starId=0;
function stars(v){ const w=el('span','shStars'); for(let i=0;i<5;i++){ const f=Math.max(0,Math.min(1,v-i)), id='st'+(++starId);
    w.insertAdjacentHTML('beforeend',`<svg viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="${id}"><rect width="${f>=1?24:f<=0?0:(1.7+20.6*f).toFixed(2)}" height="24"/></clipPath></defs><path class="e" d="${STAR}"/><path class="f" d="${STAR}" clip-path="url(#${id})"/></svg>`); }
  return w; }
function ratingEl(r){ const box=el('div','shRating'), num=v=>v.toLocaleString(lang,{minimumFractionDigits:1,maximumFractionDigits:1});
  [['difficulty',t0().difficulty],['overall',t0().overall]].forEach(([k,label])=>{ if(r[k]==null) return;
    const row=el('div','shRate'+(k==='overall'?' all':'')); row.setAttribute('role','img'); row.setAttribute('aria-label',label+' : '+num(r[k])+' / 5');
    row.appendChild(el('span','shRateL',label)); row.appendChild(stars(r[k])); row.appendChild(el('span','shRateN',num(r[k]))); box.appendChild(row); });
  return box; }
const authorOf=a=>a.author&&typeof a.author==='object'?a.author[lang]||a.author.fr:a.author;   // un nom, ou {fr, en}
function openShelf(){ shelfOpen=true; picked=Math.max(0,ADVENTURES.findIndex(a=>current&&a.id===current.id)); $('shelf').hidden=false; renderShelf(); }
function launch(a){
  enterFullscreen();
  if(current&&current.id!==a.id){ SS.set('dragontales.go',a.id); location.reload(); return; }   // une autre aventure : on repart d'une page neuve
  shelfOpen=false; $('shelf').hidden=true;
  if(!current) current=play(a);
  current.show();
}
// ---------- à propos ----------
const ABOUT={author:'Franck Fornasari',handle:'Kraran',portraitTip:'King Kraran',authorUrl:'https://github.com/Kraran',repo:'https://github.com/Kraran/DragonTales',repoLabel:'github.com/Kraran/DragonTales'};
function link(href,txt){ const a=el('a',null,txt); a.href=href; a.target='_blank'; a.rel='noopener'; return a; }
function showAbout(){
  const DT=window.DragonTales;
  overlay('about',c=>{
    const head=el('div','abHead'); head.appendChild(el('h3',null,t0().about));
    const x=btn(head,'×',hideOverlay); x.className='abX'; x.title=t0().close; x.setAttribute('aria-label',t0().close);
    c.appendChild(head);
    const lay=el('div','abLayout');
    const por=link(ABOUT.authorUrl,''); por.className='abPortrait'; por.title=ABOUT.portraitTip; por.setAttribute('aria-label',ABOUT.portraitTip+' — GitHub');
    const im=el('img'); im.src=DT.portrait; im.alt=ABOUT.portraitTip; por.appendChild(im); por.appendChild(el('div','abFade'));
    lay.appendChild(por);
    const main=el('div','abMain');
    const hero=el('div','abHero'), name=el('h2'); name.appendChild(el('span','shDragon','Dragon')); name.appendChild(el('span','shTales','Tales'));
    hero.appendChild(name); hero.appendChild(el('span','abVer','v'+DT.version)); main.appendChild(hero);
    main.appendChild(el('p','abDesc',t0().aboutDesc));
    const dl=el('dl','abGrid');
    const row=(k,v)=>{ if(v==null||v==='') return; dl.appendChild(el('dt',null,k)); const dd=el('dd'); if(typeof v==='string') dd.textContent=v; else dd.appendChild(v); dl.appendChild(dd); };
    row(t0().abVersion,DT.version);
    const d=DT.date&&new Date(DT.date+'T12:00:00');
    row(t0().abDate,d&&!isNaN(d)?d.toLocaleDateString(lang,{day:'numeric',month:'long',year:'numeric'}):'');
    const au=el('span'); au.appendChild(document.createTextNode(ABOUT.author+' (')); au.appendChild(link(ABOUT.authorUrl,ABOUT.handle)); au.appendChild(document.createTextNode(')'));
    row(t0().abAuthor,au);
    row(t0().abRepo,link(ABOUT.repo,ABOUT.repoLabel));
    row(t0().abStack,t0().abStackText);
    row(t0().abGames,ADVENTURES.map(a=>a.title+' ('+[authorOf(a),a.publisher,a.year].filter(Boolean).join(', ')+')').join(' ; '));
    main.appendChild(dl);
    main.appendChild(el('p','abNote',t0().aboutNote));
    lay.appendChild(main); c.appendChild(lay);
    const r=el('div','abFoot');
    btn(r,t0().abProfile,()=>window.open(ABOUT.authorUrl,'_blank','noopener'));
    btn(r,t0().abGithub,()=>window.open(ABOUT.repo,'_blank','noopener'));
    btn(r,t0().close,hideOverlay,true);
    c.appendChild(r);
  });
}
ov.addEventListener('click',ev=>{ if(ev.target===ov&&ov.classList.contains('about')) hideOverlay(); });
function askQuitShelf(){
  overlay('',c=>{
    c.appendChild(el('h2',null,t0().quitShelf));
    c.appendChild(el('p',null,t0().quitShelfNote));
    const r=el('div','row'); btn(r,t0().quit,quitShelf,true); btn(r,t0().stay,hideOverlay); c.appendChild(r);
  });
}
function quitShelf(){
  let gone=true;
  if(document.fullscreenElement&&document.exitFullscreen) document.exitFullscreen().catch(()=>{});
  overlay('bye',c=>{
    c.appendChild(el('h2',null,t0().bye));
    c.appendChild(el('p',null,t0().byeNote));
    const r=el('div','row'); btn(r,t0().backShelf,()=>{ gone=false; hideOverlay(); }); c.appendChild(r);
  });
  setTimeout(()=>{ if(gone){ try{ window.close(); }catch(e){} } },1700);   // ne ferme que si le navigateur l'autorise
}
document.addEventListener('keydown',ev=>{
  if(shelfOpen&&!ov.hidden&&ov.classList.contains('about')&&ev.key==='Escape'){ hideOverlay(); return; }
  if(!shelfOpen||!ov.hidden) return;
  const d=ev.key==='ArrowRight'?1:ev.key==='ArrowLeft'?-1:0;
  if(d&&ADVENTURES.length>1){ ev.preventDefault(); picked=(picked+d+ADVENTURES.length)%ADVENTURES.length; renderShelf(); }
});

// ---------- une aventure ----------
function play(ADV){
const FR=ADV.FR, ROOMS=ADV.ROOMS, SCENES=ADV.SCENES, HINTS=ADV.HINTS||null, WORLD=ADV.world;
const KEY=ADV.storage+'.';                       // préfixe des sauvegardes et réglages
const VERBS=ADV.verbs, SFX_AT=ADV.sfxAt||{}, DIRS=WORLD.dirs, ALLW=WORLD.allWord||'';
const COLS=WORLD.cols||0, NROOMS=WORLD.rooms, DELTA={W:-1,N:-COLS,E:1,S:COLS};
const BASIC=ADV.machine.kind==='basic';             // jeu écrit en BASIC (moteur/basic.js) plutôt qu'en code machine
const SCREEN=BASIC&&!!ADV.machine.screen;           // jeu qui place son texte à l'écran (PRINT @) : la version classique reproduit l'écran 32×16
// Géométrie de la carte. Par défaut, la grille du programme (COLS colonnes) ; sinon la fiche donne pour chaque lieu
// sa colonne, sa ligne et son étage (WORLD.pos) et la destination de chaque sortie (WORLD.links).
const posOf=a=>WORLD.pos?WORLD.pos(a):[a%COLS,Math.floor(a/COLS),0];
const GRIDW=WORLD.pos?Math.max(...Array.from({length:NROOMS},(_,a)=>posOf(a)[0]))+1:COLS;
const LEVELS=[...new Set(Array.from({length:NROOMS},(_,a)=>posOf(a)[2]))].sort((a,b)=>a-b);
function dest(a,d){ // lieu atteint depuis a dans la direction d (ou null)
  if(WORLD.links){ const l=WORLD.links(mem,a)[d]; return typeof l==='number'?l:null; }
  if(!DELTA[d]) return null; const n=a+DELTA[d]; if(n<0||n>=NROOMS) return null;
  if((d==='W'||d==='E')&&Math.floor(a/COLS)!==Math.floor(n/COLS)) return null; return n;
}
const PROMPT_ITEM=WORLD.promptAddr!==undefined?{a:WORLD.promptAddr}:{b:WORLD.promptText||''};
const TRANSIENT=new Set(WORLD.transient||[]), COINS=HINTS?3:0;
if(ADV.sfx) for(const k in ADV.sfx) SFX.define(k,ADV.sfx[k]);   // sons propres à l'aventure
let curEn='';                                     // commande anglaise en cours (pour les sons liés à une action)
const TA={fr:Object.assign({},T.fr,ADV.labels.fr),en:Object.assign({},T.en,ADV.labels.en)};
const bin=Uint8Array.from(atob(ADV.assets.programme.b64),c=>c.charCodeAt(0));
$('stage').style.setProperty('--cover','url("'+assetURL(ADV.assets.couverture)+'")');
const t=()=>TA[lang];

// ---------- noms cliquables ----------
const DIRWORDS=new Set(Object.values(DIRS));
const FR_SKIP=new Set(ADV.frSkip||[]);
const EN_NOUNS=new Set(Object.values(FR.NOUNS).concat(WORLD.nouns||[]).filter(v=>!DIRWORDS.has(v)&&v!==ALLW));
const strip=s=>s.toUpperCase().replace(/Œ/g,'OE').normalize('NFD').replace(/[̀-ͯ]/g,'');
function nounOf(word){ // mot affiché -> mot-clé anglais du jeu, ou null
  const w=strip(word);
  if(w.length<3) return null;
  if(lang==='fr'){ if(FR_SKIP.has(w)) return null; const v=FR.NOUNS[w]; return v&&!DIRWORDS.has(v)&&v!==ALLW?v:null; }
  if(EN_NOUNS.has(w)) return w;
  if(w.endsWith('S')&&EN_NOUNS.has(w.slice(0,-1))) return w.slice(0,-1);
  if(EN_NOUNS.has(w+'S')) return w+'S';
  return null;
}

// ---------- mise en forme du texte ----------
function pretty(s){
  s=s.toLocaleLowerCase(lang);
  s=s.replace(/(^[\s"'«(]*|[.!?]["']?\s+["'«]?)(\p{Ll})/gmu,(m,a,b)=>a+b.toLocaleUpperCase(lang));
  s=s.replace(/(:\s*["'])(\p{Ll})/gu,(m,a,b)=>a+b.toLocaleUpperCase(lang));
  if(lang==='en') s=s.replace(/\bi\b/g,'I');
  if(WORLD.proper) s=WORLD.proper(s,lang);
  return s;
}
function richText(parent,s,lexSink){ // texte -> paragraphes avec mots cliquables
  s.split(/\n{2,}/).forEach(par=>{
    if(!par.trim()) return;
    const p=el('p');
    par.split('\n').forEach((line,i)=>{
      if(i) p.appendChild(el('br'));
      let last=0; const re=/[\p{L}]+/gu; let mt;
      while((mt=re.exec(line))){
        const kw=nounOf(mt[0]);
        if(!kw) continue;
        if(mt.index>last) p.appendChild(document.createTextNode(line.slice(last,mt.index)));
        const sp=el('span','w',mt[0]); sp.dataset.kw=kw; sp.tabIndex=0; p.appendChild(sp);
        last=mt.index+mt[0].length;
        if(lexSink) lexSink(kw,mt[0].toLocaleLowerCase(lang));
      }
      if(last<line.length) p.appendChild(document.createTextNode(line.slice(last)));
    });
    parent.appendChild(p);
  });
}

// ---------- machine ----------
let pendSfx=[], pendNotes=[];
let pending='', won=false, started=false, quickMsg=null, sceneKey=null;
const io={
  out(c){ if(c===8){ pending=pending.slice(0,-1); pendItems.push({r:'\b'}); } else if(c===13){ pending+='\n'; pendItems.push({r:'\n'}); } else if(c>=32){ pending+=String.fromCharCode(c); pendItems.push({r:String.fromCharCode(c)}); } },
  puts(s){ for(const ch of s){ if(ch==='\b') pending=pending.slice(0,-1); else pending+=(ch==='%'?'\n':ch); } },
  text(addr){ const k=hex4(addr); if(ROOMS[k]) sceneKey=k; if(SFX_AT[k]) pendSfx.push(SFX_AT[k]); pendItems.push({a:addr}); return textFor(addr,lang); },
  cls(){ pending=''; pendItems=[]; },
  save(d){ quickMsg=LS.set(KEY+'save.v1',btoa(String.fromCharCode.apply(null,d)))?'quick':null; },
  load(){ const s=LS.get(KEY+'save.v1'); if(!s){ quickMsg='noSave'; return null; } quickMsg='quickLoaded'; return Uint8Array.from(atob(s),c=>c.charCodeAt(0)); },
  quit(v){ won=!!v; }
};
// Jeu en BASIC : chaque PRINT arrive comme une ligne anglaise ({b:…}), traduite à l'affichage par WORLD.say.
const ioBasic={
  out(s){ pending+=s; pendItems.push({b:s}); if(WORLD.sfxFor){ const f=WORLD.sfxFor(s,curEn,mem); if(f) pendSfx.push(f); } },
  cls(c){ if(c&&!SCREEN){ const f=WORLD.flashSfx||'flash'; if(!pendSfx.includes(f)) pendSfx.push(f); return; } pending=''; pendItems=SCREEN?[{f:1}]:[]; },   // CLS n : éclair de couleur
  at(p){ if(pending&&!pending.endsWith('\n')) pending+='\n'; pendItems.push({p}); },       // PRINT @ (jeux à écran, ADV.machine.screen)
  sound(tone,dur){ if(pendNotes.length<400) pendNotes.push([SFX.dragonPitch(tone),SFX.dragonTicks(dur)]); },   // bips et airs d'origine
  play(str){ if(pendNotes.length<400) pendNotes.push(...SFX.parsePlay(str)); },
  end(){ won=!!(ADV.machine.victory&&ADV.machine.victory.test(pending)); }
};
const SEED=/[#&]graine=(\d+)/.exec(location.hash);   // essais : DragonTales.html#graine=2 fixe le hasard des jeux BASIC
const m=BASIC?Basic(bin,ioBasic,Object.assign({echo:false},ADV.machine,SEED?{seed:+SEED[1]}:{})):Machine(bin,io,ADV.machine);
const mem=m.mem;

// ---------- lecture de l'état du jeu ----------
const hex4=v=>v.toString(16).toUpperCase().padStart(4,'0');
function roomOff(){ return WORLD.roomOff(mem); }
function roomInfo(off){
  const d=ROOMS[WORLD.roomKey(mem,off)];
  return d?{title:d[lang==='fr'?0:1],kind:d[2]}:{title:t().mapUnknown,kind:'under'};
}
function exitsOf(off){ return WORLD.exits(mem,off); }
function rawStr(a){ return WORLD.str(mem,a,700); }
function textFor(addr,L){ const k=hex4(addr); return L==='fr'&&FR.TEXT[k]!==undefined?FR.TEXT[k]:rawStr(addr); }
function memStr(a){ return WORLD.str(mem,a,80); }
function objName(o){ // nom affiché d'un objet, dans la langue courante
  if(o.np===undefined) return pretty(WORLD.objLabel?WORLD.objLabel(o,lang):o.name);
  return pretty(lang==='fr'&&FR.TEXT[hex4(o.np)]||memStr(o.np));
}
function objects(){
  const here=[],inv=[],no=WORLD.locOf(roomOff());
  for(const o of WORLD.objects(mem)){
    if(o.loc!==no&&o.loc!==WORLD.carried) continue;
    const en=o.np===undefined?o.name:memStr(o.np), kw=o.word||en.split(' ').pop().replace(/[^A-Z]/g,'');
    (o.loc===WORLD.carried?inv:here).push({kw,name:objName(o),n:o.n});
  }
  return {here,inv};
}

// ---------- état de l'interface ----------
let armed=null;                    // verbe choisi (entrée de VERBS)
let visited=new Set();             // lieux visités (décalages)
let lex=new Map();                 // mots rencontrés : mot-clé -> mot affiché
let coins=COINS, hintUse={}, gid=newGid();            // pièces magiques restantes ; nombre d'indices déjà donnés par étape ou lieu
let links=new Map();                // passages spéciaux découverts : 'de>vers' -> {from,to,label}
let undo=[];                       // pile d'annulation
let walking=false;
let classicOn=false, classicItems=[], pendItems=[], lastCmd=null, cbuf='';   // version classique : même partie, affichage texte sur fond vert
const logEl=$('log'), inEl=$('in');

// Le journal moderne est conservé sous forme de données (turns) pour pouvoir être réaffiché dans l'autre langue.
let turns=[];
function cleanText(s,moved){ return WORLD.clean(s,!!moved); }   // moved : le joueur vient d'arriver dans ce lieu
function cmdText(c){ return c.tl===lang?c.typed:(lang==='en'?c.en:REV(c.en)).toLocaleLowerCase(lang); }
function turnEl(d){
  const turn=el('div','turn');
  if(d.note==='hint'){ turn.classList.add('hint'); turn.appendChild(el('p','note',t().coinHead(d.left))); let src=d.spot!=null?HINTS.SPOTS[d.spot][lang]:HINTS.STEPS[d.step][lang][d.lvl];
    if(typeof src==='function') src=src(d.args||{},lang,n=>roomInfo(n-1).title);   // indice qui dépend de la partie (lieu d'un objet…)
    turn.appendChild(el('p','hintText',src)); return turn; }
  if(d.note){ turn.appendChild(el('p','note',d.note==='raw'?d.text:d.note==='loaded'?t().loaded(roomInfo(d.off).title):t()[d.note])); return turn; }
  if(d.cmd) turn.appendChild(el('div','cmd',cmdText(d.cmd)));
  if(d.off!=null) turn.appendChild(el('h3',null,roomInfo(d.off).title));
  const s=cleanText(composeItems(d.items),d.off!=null).text;
  if(s) richText(turn,pretty(s),addLex);
  if(d.quick) turn.appendChild(el('p','note',t()[d.quick]));
  return turn;
}
function addTurn(d){
  const e=turnEl(d); if(!e.childNodes.length) return;
  [...logEl.querySelectorAll('.turn:not(.old)')].forEach(x=>x.classList.add('old'));
  turns.push(d); logEl.appendChild(e);
  while(turns.length>300){ turns.shift(); logEl.removeChild(logEl.firstChild); undo.forEach(x=>{ x.n=Math.max(0,x.n-1); }); }
}
function rerenderLog(){
  logEl.textContent='';
  turns.forEach((d,i)=>{ const e=turnEl(d); if(i<turns.length-1) e.classList.add('old'); logEl.appendChild(e); });
  scrollLog();
}
function note(key,extra){ addTurn(Object.assign({note:key},extra||{})); scrollLog(); }
function scrollLog(){ logEl.scrollTop=logEl.scrollHeight; }
function addLex(kw,word){ if(!lex.has(kw)) lex.set(kw,word); }

function compact(items){ // regroupe les caractères isolés pour alléger le journal et les sauvegardes
  const out=[]; for(const it of items){ const l=out[out.length-1]; if(it.r!==undefined&&l&&l.r!==undefined) l.r+=it.r; else out.push(it.r!==undefined?{r:it.r}:it); } return out;
}
function flush(echo,prevOff){ // transforme la sortie du jeu en entrée du journal
  const cmd=echo?(lastCmd||{en:echo.toUpperCase(),typed:echo,tl:lang}):null;
  lastCmd=null; pending='';
  const items=compact(pendItems); pendItems=[];
  if(cmd) classicItems.push({e:cmd});
  classicItems.push(...items);
  const off=roomOff(), inMap=off>=0&&off<NROOMS, moved=inMap&&off!==prevOff;
  const r=cleanText(composeItems(items),moved);
  if(inMap) visited.add(off);
  addTurn({cmd,off:moved?off:null,items,quick:quickMsg});
  quickMsg=null;
  return r;
}

function step(echo){ // fait tourner le jeu jusqu'à la prochaine attente
  if(BASIC&&!started) return;   // un jeu BASIC n'a pas d'écran titre à lui : il démarre au clic sur Commencer
  const prev=turns.length?roomOff():-1;
  let w;
  try{ w=m.run(); }catch(e){ note('raw',{text:'Erreur : '+e.message}); return; }
  if(w==='key'&&!m.yesNo){            // écran titre du jeu d'origine
    pending='';
    if(!started){ showTitle(); return; }
    m.key(32); pendSfx=[]; return step(echo);
  }
  const r=flush(echo,prev);
  playSfx(prev,w);
  if(classicOn){ if(w==='end'&&!SCREEN) classicItems.push({k:won?'cWon':'cEnd'}); }   // jeu à écran : il pose lui-même sa question
  else if(menuNow()) showMenu();
  else if(w==='key'&&m.yesNo) showDeath(r.text);
  else if(w==='end'&&BASIC&&!won) showDeath(r.text);
  else if(w==='end') showEnd();
  refresh(); scrollLog(); renderClassic();
  if(w==='line') autosave();
}

function pushUndo(){
  undo.push({snap:m.snapshot(),n:turns.length,ct:classicItems.length,visited:new Set(visited),lex:new Map(lex),links:new Map(links)});
  if(undo.length>60) undo.shift();
}
function doUndo(){
  const u=undo.pop(); if(!u) return;
  m.restore(u.snap); sceneKey=null; visited=u.visited; lex=u.lex; links=u.links; won=false; pending='';
  while(turns.length>u.n){ turns.pop(); logEl.removeChild(logEl.lastChild); }
  classicItems.length=Math.min(classicItems.length,u.ct); pendItems=[]; cbuf='';
  hideOverlay(); note('undone'); refresh(); renderClassic();
}

function send(en,echo){ // envoie une commande anglaise au jeu
  if(m.wait!=='line') return false;
  pushUndo(); disarm();
  lastCmd={en,typed:echo||en,tl:lang};
  const cmdObj=lastCmd;
  const before=roomOff();
  curEn=en; m.line(en); step(echo); curEn='';
  const after=roomOff();
  if(m.wait==='line'&&after!==before&&after>=0&&after<NROOMS&&before>=0&&before<NROOMS){
    const d=Object.keys(DIRS).find(k=>en===WORLD.go(DIRS[k])||en===k);   // « GO NORTH » ou « N »
    const kind=WORLD.link?WORLD.link(en):null;
    if(!(d&&after===dest(before,d))&&kind!=='skip'){ const dream=kind==='dream'; links.set(dream?'r>'+after:before+'>'+after,{from:before,to:after,label:echo||en.toLowerCase(),cmd:cmdObj,dream}); drawMap(after,true); }
  }
  return true;
}
function typed(line){
  line=line.trim(); if(!line) return;
  const up=line.toUpperCase();
  if(lang==='fr'&&(up==='AIDE'||up==='?')){ showHelp(); return; }
  if(!classicOn&&isCoinCommand(up)){ useCoin(); return; }
  if(WORLD.freeInput&&WORLD.freeInput(mem)){ send(up,line); return; }   // réponse libre (une formule…) : rien à traduire
  send(lang==='fr'?FR.frToEn(line):up, line);
}

// ---------- verbes, cibles ----------
const verbLabel=v=>v[lang==='fr'?1:2];
function arm(v){
  if(m.wait!=='line') return;
  if(armed===v){ send(v[0],verbLabel(v)); return; }
  if(v[3]){ send(v[0],verbLabel(v)); return; }
  armed=v; refreshVerbs();
}
function disarm(){ if(armed){ armed=null; refreshVerbs(); } }
function target(kw,label){
  const v=armed||VERBS[0];
  send(v[0]+' '+kw, verbLabel(v)+' '+label);
}
function direction(d){
  if(armed&&armed[0]!==WORLD.goVerb) target(DIRS[d],t().dirs[d].toLocaleLowerCase(lang));
  else send(WORLD.go(DIRS[d]),t().dirs[d]);
}

// ---------- affichage ----------
function chips(box,title,list,emptyTxt,cls){
  box.textContent='';
  box.appendChild(el('h2',null,title));
  if(!list.length){ box.appendChild(el('span','empty',emptyTxt)); return; }
  const c=el('span','chips');
  list.forEach(o=>{ const b=el('button','chip'+(cls?' '+cls:''),o.name); b.type='button'; b.dataset.kw=o.kw; b.dataset.label=o.name.toLocaleLowerCase(lang); c.appendChild(b); });
  box.appendChild(c);
}
function refreshVerbs(){
  [...$('verbs').children].forEach((b,i)=>b.classList.toggle('on',VERBS[i]===armed));
  $('armed').textContent=armed?t().armed(verbLabel(armed)):'';
  $('cancel').hidden=!armed;
  inEl.placeholder=armed?'':t().ph;
}
function buildStatic(){
  document.documentElement.lang=lang;
  const vb=$('verbs'); vb.textContent='';
  VERBS.forEach(v=>{ const b=el('button',v[4]?'sorc':'',verbLabel(v)); b.type='button'; b.onclick=()=>{arm(v);inEl.focus();}; vb.appendChild(b); });
  const cp=$('compass'); cp.textContent='';
  const lay=['','N','U','W','','E','','S','D'];
  lay.forEach(d=>{ if(!d){ cp.appendChild(el('span')); return; } const b=el('button',null,t().dirs[d]); b.type='button'; b.dataset.dir=d; b.onclick=()=>{direction(d);inEl.focus();}; cp.appendChild(b); });
  const tb=$('tools'); tb.textContent='';
  [['undo',doUndo],['saves',showSaves],['restart',askRestart],['help',showHelp],['options',showOptions],['quit',askQuit]]
    .forEach(([k,f])=>{ const b=el('button',null,t()[k]); b.type='button'; b.id='tool-'+k; b.onclick=()=>{f();inEl.focus();}; tb.appendChild(b); });
  $('cancel').textContent=t().cancel;
  $('mapBig').textContent=t().enlarge;
  $('toClassic').textContent=t().toClassic; $('cModern').textContent=t().toModern; $('cLang').textContent=t().lang; $('cFull').textContent=t().full; $('cQuit').textContent=t().quit;
  refreshVerbs();
}
function refresh(){
  const off=roomOff(), ok=off>=0&&off<NROOMS;
  const info=ok?roomInfo(off):{title:'',kind:'under'};
  $('sceneTitle').textContent=started?info.title:'';
  const stv=started&&ok&&WORLD.status?WORLD.status(mem,lang):'';   // état propre à l'aventure (coups restants…)
  $('sceneStatus').textContent=stv; $('sceneStatus').hidden=!stv;
  const ex=ok?exitsOf(off):{};
  [...$('compass').querySelectorAll('button')].forEach(b=>b.classList.toggle('off',!ex[b.dataset.dir]));
  const o=ok?objects():{here:[],inv:[]};
  const key=ok?(sceneKeyFor(off)||staticKey(off)):WORLD.defaultScene;
  const extra=ok&&WORLD.sceneExtras?WORLD.sceneExtras(mem,off):[];   // éléments de scène propres à l'aventure (monstres, portes ouvertes…)
  $('sceneArt').innerHTML=SCENES.render(key,ok?off:0,o.here.map(x=>x.n).concat(extra));
  chips($('here'),t().here,o.here,t().nothing);
  chips($('inv'),t().inv,o.inv,coins?'':t().nothing);
  for(let i=0;i<coins;i++){ const b=el('button','coin'); b.type='button'; b.title=t().coinTip(coins); b.setAttribute('aria-label',t().coin); b.innerHTML=COIN_SVG; b.onclick=askCoin; $('inv').appendChild(b); }
  const shown=new Set([...o.here,...o.inv].map(x=>x.kw));
  chips($('lex'),t().lex,[...lex].filter(([k])=>!shown.has(k)).map(([kw,name])=>({kw,name:lang==='fr'&&FR.NOUNS[strip(name)]===kw||lang==='en'&&nounOf(name)===kw?name:(lang==='en'?kw:Object.keys(FR.NOUNS).find(w=>FR.NOUNS[w]===kw)||kw).toLowerCase()})),t().none,'lexi');
  $('tool-undo').disabled=!undo.length;
  drawMap(off,ok);
  musicUpdate(3500);
}

// ---------- carte ----------
// La carte suit la grille du programme : COLS colonnes, ouest -1, nord -COLS, est +1, sud +COLS.
const MINI={cw:112,ch:56,px:130,py:76,lab:0,icon:22}, BIG={cw:164,ch:78,px:184,py:154,lab:50,icon:28};
function objectsIn(off){ // objets posés dans un lieu (numéro, nom affiché)
  const out=[],no=WORLD.locOf(off);
  for(const o of WORLD.objects(mem)){ if(o.loc!==no) continue; out.push({n:o.n,name:objName(o)}); }
  return out;
}
function staticKey(off){ return WORLD.roomKey(mem,off); }
function buildMap(host,geo,cur,origin,shownAt){ // origin(off) -> [x,y] du coin de la case ; shownAt(off) : lieu affiché ?
  shownAt=shownAt||(()=>true);
  host.textContent='';
  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','links'); host.appendChild(svg);
  const top=document.createElementNS(NS,'svg'); top.setAttribute('class','links top');
  let layer=svg;
  const mk=(tag,attrs)=>{ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); layer.appendChild(e); return e; };
  const bh=geo.ch+geo.lab;
  const cx=a=>origin(a)[0]+geo.cw/2, cy=a=>origin(a)[1]+bh/2;
  const hw=geo.cw/2, hh=bh/2;
  visited.forEach(a=>{ if(!shownAt(a)) return; const ex=exitsOf(a);
    for(const d of ['E','S','W','N']){ if(!ex[d]) continue; const n=dest(a,d); if(n===null) continue;
      if(!shownAt(n)&&visited.has(n)) continue;   // passage vers un autre étage
      const known=visited.has(n); if(known&&(d==='W'||d==='N')&&dest(n,d==='W'?'E':'S')===a) continue;
      const dx=(d==='E')-(d==='W'), dy=(d==='S')-(d==='N');
      const x1=cx(a)+dx*hw, y1=cy(a)+dy*hh;
      if(known) mk('line',{x1,y1,x2:cx(n)-dx*hw,y2:cy(n)-dy*hh,stroke:'#b9a6cf','stroke-width':4,'stroke-linecap':'round'});
      else { const gx=(geo.px-geo.cw)*.5, gy=(geo.py-bh)*.5;
        mk('line',{x1,y1,x2:x1+dx*gx,y2:y1+dy*gy,stroke:'#b9a6cf','stroke-width':3,'stroke-dasharray':'2 5','stroke-linecap':'round'});
        mk('circle',{cx:x1+dx*(gx+5),cy:y1+dy*(gy+5),r:4,fill:'none',stroke:'#b9a6cf','stroke-width':2}); }
    } });
  layer=top;
  const dreams=new Map();
  links.forEach(l=>{ if(l.dream){ dreams.set(l.to,l.cmd?cmdText(l.cmd).toLocaleLowerCase(lang):l.label); return; } if(!visited.has(l.from)||!visited.has(l.to)||!shownAt(l.from)||!shownAt(l.to)) return;
    let x1=cx(l.from),y1=cy(l.from),x2=cx(l.to),y2=cy(l.to);
    const pf=posOf(l.from), pt=posOf(l.to), far=Math.hypot(pf[0]-pt[0],pf[1]-pt[1])>2.9;
    const lab=l.cmd?cmdText(l.cmd).toLocaleLowerCase(lang):l.label;
    if(far){ // passage lointain : simple amorce fléchée avec la commande, pour ne pas barrer toute la carte
      const d0=Math.hypot(x2-x1,y2-y1)||1, ux=(x2-x1)/d0, uy=(y2-y1)/d0, e=Math.abs(ux)*hw+Math.abs(uy)*hh;
      x1+=ux*e; y1+=uy*e; x2=x1+ux*34; y2=y1+uy*34;
    }
    const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1, k=far?0:Math.min(60,len*.22);
    const qx=mx-dy/len*k, qy=my+dx/len*k;
    mk('path',{d:`M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}`,fill:'none',stroke:'#45c2b6','stroke-width':3,'stroke-dasharray':'7 6',opacity:.9});
    const a=Math.atan2(y2-qy,x2-qx), back=far?0:Math.abs(Math.cos(a))*hw+Math.abs(Math.sin(a))*hh+4, ax=x2-Math.cos(a)*back, ay=y2-Math.sin(a)*back;
    mk('path',{d:`M${ax} ${ay} l${-12*Math.cos(a-.45)} ${-12*Math.sin(a-.45)} M${ax} ${ay} l${-12*Math.cos(a+.45)} ${-12*Math.sin(a+.45)}`,stroke:'#45c2b6','stroke-width':3,fill:'none','stroke-linecap':'round'});
    if(geo.lab){ const t=mk('text',{x:far?x2+Math.cos(a)*10:(mx+qx)/2,y:far?y2+Math.sin(a)*18+5:(my+qy)/2-4,'text-anchor':'middle',class:'linkLabel'}); t.textContent=far?lab+' → '+roomInfo(l.to).title:lab; }
  });
  let maxX=0,maxY=0;
  visited.forEach(a=>{
    if(!shownAt(a)) return;
    const [x,y]=origin(a); maxX=Math.max(maxX,x+geo.cw); maxY=Math.max(maxY,y+geo.ch+geo.lab);
    const info=roomInfo(a), objs=objectsIn(a), ex=exitsOf(a);
    const c=el('div','cell mc'+(a===cur?' cur':'')); c.dataset.off=a;
    c.style.cssText=`left:${x}px;top:${y}px;width:${geo.cw}px;height:${bh}px`;
    c.title=info.title+(objs.length?' : '+objs.map(o=>o.name.toLocaleLowerCase(lang)).join(', '):'');
    const th=el('div','th'); th.style.height=geo.ch+'px'; th.innerHTML=SCENES.render(a===cur&&sceneKeyFor(a)||staticKey(a),a,[],{crop:'330 40 680 340'}); c.appendChild(th);
    if(objs.length){ const ic=el('div','ic'); ic.style.top=(geo.ch-geo.icon-6)+'px'; ic.innerHTML=objs.slice(0,4).map(o=>SCENES.icon(o.n,geo.icon)).join('')+(objs.length>4?`<span>+${objs.length-4}</span>`:''); c.appendChild(ic); }
    if(ex.U||ex.D) c.appendChild(el('span','ud',(ex.U?'▲':'')+(ex.D?'▼':'')));
    if(dreams.has(a)){ c.appendChild(el('span','dr',t().dreamTag)); c.title+=' — '+dreams.get(a); }
    if(geo.lab){ const lb=el('div','lb'); lb.style.cssText=`top:${geo.ch}px;height:${geo.lab}px`; lb.appendChild(el('b',null,info.title)); if(objs.length) lb.appendChild(el('span',null,objs.map(o=>o.name.toLocaleLowerCase(lang)).join(', '))); c.appendChild(lb); }
    host.appendChild(c);
  });
  host.appendChild(top);
  return [maxX,maxY];
}
function sceneKeyFor(off){ const sk=staticKey(off); return sceneKey&&ROOMS[sceneKey]&&(ROOMS[sceneKey][0]===(ROOMS[sk]||[])[0]||TRANSIENT.has(sceneKey))?sceneKey:null; }
function drawMap(off,ok){
  const host=$('mapView'); $('mapLabel').textContent='';
  if(!ok||!started){ host.textContent=''; return; }
  const [pc,pr,lv]=posOf(off), W=652, H=392;
  // toute la largeur de la grille ne tient pas : on centre sur le joueur, sans dépasser les bords de la grille
  const ox=Math.max(Math.min(W/2-MINI.cw/2-pc*MINI.px, 8), W-8-MINI.cw-(GRIDW-1)*MINI.px);
  const oy=Math.min(H/2+12-MINI.ch/2-pr*MINI.py, 44);
  buildMap(host,MINI,off,a=>{ const p=posOf(a); return [ox+p[0]*MINI.px, oy+p[1]*MINI.py]; },a=>posOf(a)[2]===lv);   // l'étage du joueur seulement
  $('mapLabel').textContent=roomInfo(off).title+(LEVELS.length>1&&WORLD.levelName?' — '+WORLD.levelName(lv,lang):'');
  if(!$('bigmap').hidden) drawBig(false);
}
function drawBig(center){
  const off=roomOff(), host=$('bigInner'), pad=40;
  // plusieurs étages : côte à côte, de gauche à droite
  const lx=lv=>LEVELS.indexOf(lv)*(GRIDW+1)*BIG.px, width=pad+(LEVELS.length*(GRIDW+1)-1)*BIG.px;
  const [mx,my]=buildMap(host,BIG,off,a=>{ const p=posOf(a); return [pad+lx(p[2])+p[0]*BIG.px, pad+p[1]*BIG.py]; });
  host.style.width=width+'px'; host.style.height=(my+pad)+'px';
  host.querySelectorAll('svg.links').forEach(svg=>{ svg.setAttribute('width',width); svg.setAttribute('height',my+pad); });
  if(center){ const sc=$('bigScroll'); sc.scrollTop=pad+posOf(off)[1]*BIG.py-sc.clientHeight/2+BIG.ch/2; }
}
function showBig(){ if(!started) return; $('bigmap').hidden=false; $('bigTitle').textContent=t().mapTitle; $('bigHint').textContent=t().mapHint; $('bigClose').textContent=t().close; drawBig(true); }
function hideBig(){ $('bigmap').hidden=true; inEl.focus(); }
function pathTo(from,to){
  const prev=new Map([[from,null]]),q=[from];
  while(q.length){ const a=q.shift(); if(a===to) break; const ex=exitsOf(a);
    for(const d in DIRS){ if(!ex[d]) continue; const n=dest(a,d); if(n===null||prev.has(n)||!visited.has(n)) continue; prev.set(n,[a,d]); q.push(n); } }
  if(!prev.has(to)) return null;
  const path=[]; let c=to; while(prev.get(c)){ const [a,d]=prev.get(c); path.unshift([d,c]); c=a; }
  return path;
}
function walkTo(to){
  if(walking||m.wait!=='line') return;
  const path=pathTo(roomOff(),to); if(!path||!path.length) return;
  walking=true;
  (function next(){
    if(!path.length||m.wait!=='line'){ walking=false; return; }
    const [d,expect]=path.shift();
    send(WORLD.go(DIRS[d]),t().dirs[d]);
    if(roomOff()!==expect){ walking=false; if(m.wait==='line') note('walkStop'); return; }
    setTimeout(next,path.length?260:0);
  })();
}

// ---------- musique ----------
// En boucle sur l'écran d'introduction ; long fondu au démarrage du jeu ; en option, elle revient dans le désert.
const num=(k,d)=>{ const v=parseFloat(LS.get(k)); return isNaN(v)?d:Math.max(0,Math.min(1,v)); };
const opts={sfx:LS.get(KEY+'sfx')!=='0',sfxVol:num(KEY+'sfxvol',0.7),music:LS.get(KEY+'music')==='1',vol:(v=>isNaN(v)?0.6:Math.max(0,Math.min(1,v)))(parseFloat(LS.get(KEY+'vol')))};
const MUSIC=assetURL(ADV.assets.musique);
const audio=new Audio(MUSIC||''); audio.loop=true; audio.volume=0; audio.preload='auto';
let gate=0, gateTarget=0, fadeMs=3000, fadeTimer=null, musicBlocked=false;
function inDesert(){
  const off=roomOff(); if(off<0||off>=NROOMS) return false;
  const k=sceneKeyFor(off)||staticKey(off), r=ROOMS[k];
  return !!r&&!!WORLD.musicZone&&WORLD.musicZone(k,r[2]);
}
let quitting=false;
function musicWant(){ if(quitting||shelfOpen) return 0; if(!started) return 1; if(m.wait==='end') return 0; return opts.music&&inDesert()?1:0; }
function applyVol(){ audio.volume=Math.max(0,Math.min(1,opts.vol*gate*gate)); }
function musicTick(){
  const s=50/fadeMs;
  gate=gate<gateTarget?Math.min(gateTarget,gate+s):Math.max(gateTarget,gate-s);
  applyVol();
  if(gate===gateTarget){ clearInterval(fadeTimer); fadeTimer=null; if(gate===0) audio.pause(); }
}
function musicUpdate(ms){
  if(!MUSIC) return;
  const want=musicWant();
  if(want!==gateTarget){ gateTarget=want; fadeMs=ms||3500; }
  if(want&&audio.paused){ const p=audio.play(); if(p&&p.catch) p.then(()=>{ musicBlocked=false; }).catch(()=>{ musicBlocked=true; gate=0; applyVol(); if(!started&&!ov.hidden&&ov.classList.contains('title')&&!ov.querySelector('.blocked')){ const n=el('p','credit blocked',t().musicBlocked); ov.querySelector('.card').appendChild(n); } }); }
  if(gate!==gateTarget&&!fadeTimer) fadeTimer=setInterval(musicTick,50);
  applyVol();
}
function showOptions(){
  overlay('',c=>{
    c.classList.add('opts');
    c.appendChild(el('h2',null,t().options));
    const row1=el('div','optRow'); row1.appendChild(el('span',null,t().musicInGame));
    const tog=btn(row1,opts.music?t().on:t().off,()=>{ opts.music=!opts.music; LS.set(KEY+'music',opts.music?'1':'0'); tog.textContent=opts.music?t().on:t().off; tog.classList.toggle('main',opts.music); musicUpdate(2500); },opts.music);
    c.appendChild(row1);
    c.appendChild(el('p','small',t().musicNote));
    const row2=el('div','optRow'); row2.appendChild(el('span',null,t().volume));
    const sl=el('input'); sl.type='range'; sl.min=0; sl.max=100; sl.value=Math.round(opts.vol*100);
    const val=el('b',null,sl.value+' %');
    sl.oninput=()=>{ opts.vol=sl.value/100; LS.set(KEY+'vol',String(opts.vol)); val.textContent=sl.value+' %'; applyVol(); };
    row2.appendChild(sl); row2.appendChild(val); c.appendChild(row2);
    const row3=el('div','optRow'); row3.appendChild(el('span',null,t().sfx));
    const tog2=btn(row3,opts.sfx?t().on:t().off,()=>{ opts.sfx=!opts.sfx; LS.set(KEY+'sfx',opts.sfx?'1':'0'); SFX.setEnabled(opts.sfx); tog2.textContent=opts.sfx?t().on:t().off; tog2.classList.toggle('main',opts.sfx); if(opts.sfx) SFX.play('coin'); },opts.sfx);
    c.appendChild(row3);
    c.appendChild(el('p','small',t().sfxNote));
    const row4=el('div','optRow'); row4.appendChild(el('span',null,t().sfxVol));
    const sl2=el('input'); sl2.type='range'; sl2.min=0; sl2.max=100; sl2.value=Math.round(opts.sfxVol*100);
    const val2=el('b',null,sl2.value+' %');
    sl2.oninput=()=>{ opts.sfxVol=sl2.value/100; LS.set(KEY+'sfxvol',String(opts.sfxVol)); val2.textContent=sl2.value+' %'; SFX.setVolume(opts.sfxVol); };
    sl2.onchange=()=>{ SFX.play('click'); };
    row4.appendChild(sl2); row4.appendChild(val2); c.appendChild(row4);
    const row5=el('div','optRow'); row5.appendChild(el('span',null,t().language));
    btn(row5,t().lang,()=>{ toggleLang(); showOptions(); });
    c.appendChild(row5);
    const r=el('div','row'); btn(r,t().full,fullscreen); btn(r,t().close,closeOverlay,true); c.appendChild(r);
  });
}
function closeOverlay(){ if(!started) showTitle(); else if(!classicOn&&menuNow()) showMenu(); else if(!classicOn&&m.wait==='key'&&m.yesNo) showDeath(''); else if(!classicOn&&m.wait==='end') showEnd(); else hideOverlay(); }
SFX.setEnabled(opts.sfx); SFX.setVolume(opts.sfxVol);
function playSfx(prevOff,w){ // joue les sons du tour (version moderne seulement)
  const list=pendSfx; pendSfx=[];
  const notes=pendNotes; pendNotes=[];
  if(notes.length&&opts.sfx&&started) SFX.beeper(notes);   // SOUND et PLAY du jeu d'origine : dans les deux versions
  if(classicOn||!opts.sfx||!started) return;
  const off=roomOff();
  if(off!==prevOff&&off>=0&&off<NROOMS&&WORLD.ambient) list.unshift(...WORLD.ambient(mem,off));
  if(w==='key'&&m.yesNo&&!list.includes('shot')) list.push('death');
  [...new Set(list)].slice(0,3).forEach((n,i)=>SFX.play(n,i*.45));
}

// ---------- recommencer ----------
function askRestart(){
  overlay('',c=>{
    c.appendChild(el('h2',null,t().confirm));
    c.appendChild(el('p',null,t().confirmNote));
    const r=el('div','row'); btn(r,t().restart,restart,true); btn(r,t().cancel,closeOverlay); c.appendChild(r);
  });
}

// ---------- quitter ----------
function askQuit(){
  overlay('',c=>{
    c.appendChild(el('h2',null,t().quitAsk));
    c.appendChild(el('p',null,started?t().quitNote:t().quitNoSave));
    const r=el('div','row'); btn(r,t().quit,doQuit,true); btn(r,t().backShelf,leave); btn(r,t().stay,closeOverlay); c.appendChild(r);
  });
}
function doQuit(){
  if(started&&m.wait==='line') saveSlot('auto');
  quitting=true; musicUpdate(1500);
  if(document.fullscreenElement&&document.exitFullscreen) document.exitFullscreen().catch(()=>{});
  overlay('bye',c=>{
    c.appendChild(el('h2',null,t().bye));
    c.appendChild(el('p',null,t().byeNote));
    const r=el('div','row'); btn(r,t().back,()=>{ quitting=false; closeOverlay(); musicUpdate(2500); }); c.appendChild(r);
  });
  setTimeout(()=>{ if(quitting){ try{ window.close(); }catch(e){} } },1700);   // ne ferme que si le navigateur l'autorise
}

// ---------- pièces magiques (indices) ----------
const COIN_SVG='<svg viewBox="0 0 40 40" width="34" height="34"><defs><radialGradient id="cg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#eaa93b"/><stop offset="1" stop-color="#a8701f"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#cg)" stroke="#7a4f12" stroke-width="2"/><circle cx="20" cy="20" r="13" fill="none" stroke="#7a4f12" stroke-width="1.5" opacity=".7"/><path d="M20 12c5 0 8 4 8 8s-3 7-7 7-6-3-6-6 2-5 5-5 4 2 4 4-1 3-3 3" fill="none" stroke="#7a4f12" stroke-width="2" stroke-linecap="round"/></svg>';
function isCoinCommand(up){
  const w=strip(up).replace(/[^A-Z ]/g,' ').trim().split(/\s+/).filter(x=>!['LA','LE','UNE','UN','A','THE','MAGIQUE','MAGIC'].includes(x));
  const noun=w[w.length-1], verb=w.length>1?w[0]:'';
  if(['INDICE','HINT','HINTS','INDICES'].includes(noun)&&w.length<=2) return true;
  return ['PIECE','COIN'].includes(noun)&&['','UTILISER','UTILISE','USE','LANCER','LANCE','FROTTER','FROTTE','DEPENSER','DEPENSE','SPEND','RUB'].includes(verb);
}
function askCoin(){
  if(m.wait!=='line'||classicOn) return;
  overlay('',c=>{
    c.appendChild(el('h2',null,t().coin));
    c.appendChild(el('p',null,t().coinAsk(coins)));
    const r=el('div','row'); btn(r,t().coinUse,()=>{ hideOverlay(); useCoin(); },true); btn(r,t().coinKeep,hideOverlay); c.appendChild(r);
  });
}
function useCoin(){
  if(m.wait!=='line') return;
  if(!coins){ note('coinNone'); return; }
  if(!HINTS) return;
  const off=roomOff(), sp=HINTS.spot(mem,off), st=HINTS.step(mem,visited);
  let d;
  if(sp>=0&&!hintUse['s'+sp]){ hintUse['s'+sp]=1; d={spot:sp}; }
  else { const k='e'+st, lvl=Math.min(hintUse[k]||0,1); hintUse[k]=(hintUse[k]||0)+1; d={step:st,lvl}; }
  coins--; spendNote(); if(opts.sfx) SFX.play('coin');
  if(HINTS.args){ const a=HINTS.args(mem,d); if(a) d.args=a; }
  addTurn(Object.assign({note:'hint',left:coins},d));
  refresh(); scrollLog(); autosave();
}

// ---------- fenêtres ----------
function showTitle(){
  overlay('title',c=>{
    c.classList.add('intro');
    t().intro.forEach(x=>{
      if(Array.isArray(x)){ const v=el('p','verse'); x.forEach((l,i)=>{ if(i) v.appendChild(el('br')); v.appendChild(document.createTextNode(l)); }); c.appendChild(v); }
      else c.appendChild(el('p',null,x));
    });
    const r=el('div','row');
    btn(r,t().start,()=>{ enterFullscreen(); started=true; musicUpdate(9000); hideOverlay(); m.key(32); step(null); },true);
    if(slotData('auto')) btn(r,t().resume,()=>{ enterFullscreen(); started=true; musicUpdate(9000); m.key(32); m.run(); pending=''; hideOverlay(); loadSlot('auto'); });
    btn(r,t().lang,()=>{ toggleLang(); showTitle(); });
    btn(r,t().options,showOptions);
    btn(r,t().backShelf,leave);
    btn(r,t().quit,askQuit);
    c.appendChild(r);
    c.appendChild(el('p','credit',t().sub));
    if(musicBlocked) c.appendChild(el('p','credit blocked',t().musicBlocked));
  });
}
function showDeath(text){
  overlay('',c=>{
    c.appendChild(el('h2',null,t().dead));
    if(text){ const last=text.split(/\n{2,}/).pop(); c.appendChild(el('p',null,pretty(last))); }
    const r=el('div','row');
    const u=btn(r,t().undoLast,doUndo,true); u.disabled=!undo.length;
    btn(r,t().loadSave,showSaves);
    btn(r,t().retry,restart);
    c.appendChild(r);
  });
}
// Choix proposé par le jeu avant la partie (niveau de difficulté…) : WORLD.menu(mem, langue) -> {title, text, choices:[{label, en}]}
function menuNow(){ return started&&m.wait==='line'&&WORLD.menu?WORLD.menu(mem,lang):null; }
function showMenu(){
  const mn=menuNow(); if(!mn) return;
  overlay('menu',c=>{
    c.appendChild(el('h2',null,mn.title));
    if(mn.text) c.appendChild(el('p',null,mn.text));
    const r=el('div','row menuRow');
    mn.choices.forEach((ch,i)=>{ const b=btn(r,'',()=>{ hideOverlay(); send(ch.en,ch.label); inEl.focus(); },i===mn.def);
      b.appendChild(el('b',null,ch.label)); if(ch.note) b.appendChild(el('span',null,ch.note)); });
    c.appendChild(r);
  });
}
function showEnd(){
  overlay('',c=>{
    c.appendChild(el('h2',null,won?t().won:t().over));
    const r=el('div','row'); btn(r,t().again,restart,true); c.appendChild(r);
  });
}
function showHelp(){
  overlay('',c=>{ c.classList.add('help');
    c.appendChild(el('h2',null,t().helpTitle));
    t().helpText.forEach(x=>c.appendChild(el('p',null,x)));
    const r=el('div','row'); btn(r,t().close,hideOverlay,true); c.appendChild(r);
  });
}
function clearGame(){
  hideOverlay(); logEl.textContent=''; turns=[]; undo=[]; visited=new Set(); lex=new Map(); links=new Map(); coins=COINS; hintUse={}; won=false; pending=''; armed=null; classicItems=[]; pendItems=[]; cbuf=''; pendSfx=[]; pendNotes=[]; sceneKey=null; gid=newGid();
}
function restart(){ clearGame(); m.reset(); started=true; step(null); }
// retour à l'étagère DragonTales : la partie est sauvegardée, l'aventure revient à son écran d'introduction
function leave(){
  if(started&&m.wait==='line') saveSlot('auto');
  if(classicOn) setClassic(false);
  $('bigmap').hidden=true; quitting=false;
  clearGame(); started=false; m.reset(); step(null);
  ov.hidden=true; ov.textContent='';
  openShelf(); musicUpdate(1500);
}
function show(){ document.title=ADV.title+' — DragonTales'; showTitle(); refresh(); musicUpdate(2500); }

// ---------- sauvegardes ----------
const b64=u8=>{ let s=''; for(let i=0;i<u8.length;i+=8192) s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192)); return btoa(s); };
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
// Chaque partie a un identifiant (gid). Les pièces dépensées sont notées à part, par partie : recharger une
// sauvegarde plus ancienne de la même partie ne rend donc pas les pièces déjà utilisées.
function newGid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function ledger(){ try{ return JSON.parse(LS.get(KEY+'coins')||'{}')||{}; }catch(e){ return {}; } }
function spendNote(){
  const l=ledger(); l[gid]={c:coins,h:hintUse,t:Date.now()};
  const ids=Object.keys(l).sort((a,b)=>l[b].t-l[a].t); ids.slice(30).forEach(k=>delete l[k]);
  LS.set(KEY+'coins',JSON.stringify(l));
}
function slotData(id){ const s=LS.get(KEY+'slot.'+id); if(!s) return null; try{ return JSON.parse(s); }catch(e){ return null; } }
function packGame(withLog){ // l'état complet de la partie, pour un emplacement ou un fichier
  const sn=m.snapshot();
  const d={format:'dragontales-save',version:1,adventure:ADV.id,gid,m:typeof sn.m==='string'?sn.m:b64(sn.m),c:sn.c,visited:[...visited],lex:[...lex],links:[...links],coins,hintUse,room:roomOff(),date:Date.now()};
  if(withLog){ d.turns=turns.slice(-80); d.classic=classicItems.slice(-600); }
  return d;
}
function saveSlot(id){
  if(m.wait!=='line') return false;
  return LS.set(KEY+'slot.'+id,JSON.stringify(packGame(true)))||LS.set(KEY+'slot.'+id,JSON.stringify(packGame(false)));   // sans le journal si la place manque
}
function autosave(){ if(started&&!walking) saveSlot('auto'); }
function loadSlot(id){ const d=slotData(id); if(d) loadData(d); }
function loadData(d){
  m.restore({m:BASIC?d.m:unb64(d.m),c:d.c,w:'line'}); sceneKey=null;
  gid=d.gid||'ancienne';
  visited=new Set(d.visited); lex=new Map(d.lex); links=new Map(d.links||[]); coins=d.coins===undefined?COINS:d.coins; hintUse=Object.assign({},d.hintUse);
  const spent=ledger()[gid];
  if(spent){ coins=Math.min(coins,spent.c); for(const k in spent.h) hintUse[k]=Math.max(hintUse[k]||0,spent.h[k]); }
  undo=[]; won=false; pending=''; armed=null; started=true;
  turns=Array.isArray(d.turns)?d.turns.slice():[];
  while(turns.length&&turns[turns.length-1].note==='loaded') turns.pop();
  rerenderLog(); hideOverlay();
  const off=roomOff();
  note('loaded',{off});
  classicItems=Array.isArray(d.classic)&&d.classic.length?d.classic.concat([{r:'\n'}]):[];
  classicItems.push({k:'loaded',off},PROMPT_ITEM); pendItems=[]; pendNotes=[]; pendSfx=[]; cbuf='';
  if(menuNow()) showMenu();
  refreshVerbs(); refresh(); renderClassic();
}
// ---------- sauvegarde dans un fichier ----------
function exportGame(){
  if(m.wait!=='line') return null;
  const p=n=>String(n).padStart(2,'0'), d=new Date();
  const name='DragonTales-'+ADV.id+'-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+'.json';
  const a=el('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(packGame(true))],{type:'application/json'})); a.download=name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),5000);
  return name;
}
function importText(txt){ // renvoie null si la partie est chargée, sinon le message d'erreur
  let d; try{ d=JSON.parse(txt); }catch(e){ return t().importBad; }
  if(!d||d.format!=='dragontales-save'||typeof d.m!=='string'||!d.c||typeof d.c!=='object'||!Array.isArray(d.visited)) return t().importBad;
  if(d.adventure!==ADV.id) return t().importOther(String(d.adventure).slice(0,40));
  if(BASIC){ try{ const st=JSON.parse(d.m); if(!st||typeof st.vars!=='object') return t().importBad; }catch(e){ return t().importBad; } }
  else { let bytes; try{ bytes=unb64(d.m); }catch(e){ return t().importBad; }
    if(bytes.length!==m.snapshot().m.length) return t().importBad; }
  const back=m.snapshot(), state={gid,visited,lex,links,coins,hintUse,turns,classicItems,started};
  try{ loadData(d); }
  catch(e){ m.restore(back); ({gid,visited,lex,links,coins,hintUse,turns,classicItems,started}=state); rerenderLog(); refresh(); return t().importBad; }
  autosave(); return null;
}
function showSaves(){
  overlay('',c=>{
    c.appendChild(el('h2',null,t().saves));
    const list=el('div','slots');
    ['auto',1,2,3].forEach(id=>{
      const d=slotData(id), row=el('div','slot'), lab=el('span',null,id==='auto'?t().auto:t().slot(id));
      const sm=el('small',null,d?roomTitleAt(d)+' · '+new Date(d.date).toLocaleString(lang):t().emptySlot); lab.appendChild(sm);
      row.appendChild(lab);
      if(id==='auto') row.appendChild(el('span'));
      else { const s=btn(row,t().save,()=>{ if(saveSlot(id)) showSaves(); }); s.disabled=m.wait!=='line'; }
      const l=btn(row,t().load,()=>loadSlot(id)); l.disabled=!d;
      list.appendChild(row);
    });
    c.appendChild(list);
    const msg=el('p','small portNote',t().portNote); c.appendChild(msg);
    const pick=el('input'); pick.type='file'; pick.accept='.json,application/json'; pick.hidden=true; c.appendChild(pick);
    pick.onchange=()=>{ const f=pick.files[0]; if(!f) return; const rd=new FileReader();
      rd.onload=()=>{ const err=importText(String(rd.result)); if(err){ msg.textContent=err; msg.classList.add('bad'); pick.value=''; } };
      rd.onerror=()=>{ msg.textContent=t().importBad; msg.classList.add('bad'); };
      rd.readAsText(f); };
    const r=el('div','row');
    const ex=btn(r,t().exportGame,()=>{ const n=exportGame(); if(n){ msg.textContent=t().exported(n); msg.classList.remove('bad'); } }); ex.disabled=m.wait!=='line';
    btn(r,t().importGame,()=>pick.click());
    btn(r,t().close,()=>{ if(m.wait==='key'&&m.yesNo) showDeath(''); else hideOverlay(); },true); c.appendChild(r);
  });
}
function roomTitleAt(d){ const k=WORLD.roomKey(mem,d.room); const r=ROOMS[k]; return r?r[lang==='fr'?0:1]:''; }

// ---------- version classique (texte sur fond vert) ----------
const REV=(function(){ // anglais -> premier mot français, pour réafficher une commande dans l'autre langue
  const v={},n={};
  for(const w in FR.VERBS){ const e=FR.VERBS[w]; if(!v[e]) v[e]=w; }
  for(const w in FR.NOUNS){ const e=FR.NOUNS[w]; if(!n[e]) n[e]=w; }
  Object.assign(v,ADV.revExtra||{});
  const find=(tab,w)=>{ if(tab[w]) return tab[w]; const p=w.slice(0,4); for(const e in tab){ if(e.slice(0,4)===p) return tab[e]; } return w; };
  return en=>{ const p=en.trim().split(/\s+/); if(!p[0]) return ''; return find(v,p[0])+(p.length>1?' '+find(n,p[p.length-1]):''); };
})();
const HELP_EN=ADV.helpEn||'';
function composeItems(items,classic){ // recompose une suite d'éléments du journal dans la langue courante (classic : écran d'origine)
  let s='';
  for(const it of items){
    let x;
    if(it.a!==undefined) x=textFor(it.a,lang).replace(/%/g,'\n');
    else if(it.r!==undefined) x=it.r;
    else if(it.b!==undefined) x=WORLD.say?WORLD.say(it.b,lang,!!classic):it.b;
    else if(it.p!==undefined) x=classic&&SCREEN?String.fromCharCode(0xE000+it.p):(s&&!s.endsWith('\n')?'\n':'');   // PRINT @
    else if(it.f) x=classic&&SCREEN?'\f':'';                                                                       // CLS
    else if(it.e) x=(it.e.tl===lang?it.e.typed.toLocaleUpperCase(lang):lang==='en'?it.e.en:REV(it.e.en))+'\n';
    else if(it.k==='loaded') x=t().loaded(roomInfo(it.off).title).toLocaleUpperCase(lang);
    else if(it.k==='help') x='\n'+(lang==='fr'?FR.HELP:HELP_EN).replace(/%/g,'\n')+'\n';
    else x=t()[it.k]||'';
    for(const ch of x){ if(ch==='\b') s=s.slice(0,-1); else s+=ch; }
  }
  return s;
}
function classicString(){ return composeItems(classicItems,true); }
// Écran du Dragon, 32 colonnes × 16 lignes, pour les jeux qui placent leur texte (PRINT @). Le texte qui sort en bas fait
// défiler les lignes à partir de WORLD.scrollTop seulement (écran partagé). '\uE000'+position place le curseur, '\f' efface,
// '\n' complète la ligne par des espaces (comme le Dragon). words : coupure aux espaces (traduction), sinon au caractère près.
function dragonScreen(s,words){
  const W=32,H=16,top=(WORLD.scrollTop||0)*W, g=new Array(W*H).fill(' ');
  let c=0, soft=false;
  const scroll=()=>{ g.copyWithin(top,top+W); g.fill(' ',W*H-W); c-=W; };
  const put=ch=>{ g[c++]=ch; if(c>=W*H) scroll(); if(words&&c%W===0) soft=true; };
  const nl=()=>{ do g[c++]=' '; while(c%W); if(c>=W*H) scroll(); };
  const sep=ch=>ch===' '||ch==='\n'||ch==='\f'||ch>='\uE000';
  for(let i=0;i<s.length;i++){
    const ch=s[i];
    if(ch>='\uE000'&&ch<'\uE200'){ c=ch.charCodeAt(0)-0xE000; soft=false; continue; }
    if(ch==='\f'){ g.fill(' '); c=0; soft=false; continue; }
    if(ch==='\n'){ if(!soft) nl(); soft=false; continue; }
    if(ch===' '){ if(!(soft&&c%W===0)) { soft=false; put(' '); } continue; }
    if(words&&(i===0||sep(s[i-1]))){ let j=i; while(j<s.length&&!sep(s[j])) j++;
      const L=j-i; if(c%W>0&&c%W+L>W&&L<=W){ nl(); soft=true; } }
    soft=false; put(ch);
  }
  return {g,c};
}
function renderScreen(){
  let from=-1; for(let i=classicItems.length-1;i>=0;i--) if(classicItems[i].f){ from=i; break; }
  const items=from<0?[{f:1}].concat(WORLD.screenFrame||[],classicItems.slice(-500)):classicItems.slice(from);   // sans effacement connu : on redessine le cadre
  const r=dragonScreen(composeItems(items,true)+(m.wait==='line'?cbuf:''),lang==='fr');
  const rows=[]; for(let y=0;y<16;y++) rows.push(r.g.slice(y*32,y*32+32).join(''));
  const txt=rows.join('\n'), at=r.c+Math.floor(r.c/32);
  const scr=$('cScreen'); scr.textContent=txt.slice(0,at);
  scr.appendChild(el('span','cursor',txt[at]===' '?'\u00a0':txt[at])); scr.appendChild(document.createTextNode(txt.slice(at+1)));
  scr.scrollTop=0;
}
function renderClassic(){
  if(!classicOn) return;
  if(SCREEN){ renderScreen(); return; }
  const scr=$('cScreen');
  scr.textContent=classicString().slice(-6000)+(m.wait==='line'?cbuf:'');
  scr.appendChild(el('span','cursor','\u00a0'));
  scr.scrollTop=scr.scrollHeight;
}
function setClassic(on){
  if(on&&!started) return;
  classicOn=on; LS.set(KEY+'view',on?'classic':'modern');
  $('classic').hidden=!on; cbuf='';
  if(on){ hideOverlay(); $('bigmap').hidden=true; disarm(); inEl.blur(); renderClassic(); }
  else { if(m.wait==='key'&&m.yesNo) showDeath(''); else if(m.wait==='end') showEnd(); else if(menuNow()) showMenu(); else inEl.focus(); refresh(); scrollLog(); }
}
function classicKey(ev){
  if(ev.ctrlKey||ev.metaKey||(ev.altKey&&!ev.getModifierState('AltGraph'))) return;
  if(ev.target&&ev.target.tagName==='BUTTON'&&(ev.key==='Enter'||ev.key===' ')) return;
  const k=ev.key, w=m.wait, one=k.length===1;
  const last=classicItems[classicItems.length-1];
  if(SCREEN&&w==='end'&&!(last&&last.k==='cEnd')){   // « WANT TO TRY AGAIN? » du jeu : O ou Y pour rejouer
    if(!one) return; ev.preventDefault(); const c=k.toUpperCase();
    if(c==='Y'||c==='O') restart(); else { classicItems.push({k:'cEnd'}); renderClassic(); }
    return;
  }
  if(w==='end'||(w==='key'&&m.yesNo&&last&&last.k==='cEnd')){ if(one||k==='Enter'){ ev.preventDefault(); restart(); } return; }
  if(w==='key'&&m.yesNo){
    if(!one) return; ev.preventDefault();
    const c=k.toUpperCase(); classicItems.push({r:c});
    if(c==='Y'||c==='O') restart(); else { classicItems.push({k:'cEnd'}); renderClassic(); }
    return;
  }
  if(w!=='line') return;
  const arrows={ArrowLeft:'W',ArrowRight:'E',ArrowUp:'N',ArrowDown:'S'};
  if(k==='Enter'){ ev.preventDefault(); const line=cbuf.trim(); cbuf=''; if(!line){ renderClassic(); return; }
    const up=line.toUpperCase();
    if(up==='AIDE'||up==='HELP'||up==='?'){ classicItems.push({e:{en:'HELP',typed:lang==='fr'?'AIDE':'HELP',tl:lang}},{k:'help'},PROMPT_ITEM); renderClassic(); return; }
    typed(line.toLocaleLowerCase(lang)); }
  else if(k==='Backspace'){ ev.preventDefault(); cbuf=cbuf.slice(0,-1); renderClassic(); }
  else if(arrows[k]&&cbuf===''){ ev.preventDefault(); direction(arrows[k]); }
  else if(one&&cbuf.length<60){ ev.preventDefault(); cbuf+=k.toLocaleUpperCase(lang); renderClassic(); }
}

// ---------- divers ----------
function toggleLang(){ flipLang(); relang(); }
function relang(){ buildStatic(); if(started){ rerenderLog(); refresh(); } renderClassic(); if(!classicOn&&!ov.hidden&&ov.classList.contains('menu')) showMenu(); if(!started&&!shelfOpen&&!ov.hidden&&ov.classList.contains('title')) showTitle(); }

$('cmd').addEventListener('submit',ev=>{ ev.preventDefault(); const v=inEl.value; inEl.value=''; if(armed&&!v.trim()){ arm(armed); return; } if(armed&&v.trim()){ const a=armed; const line=verbLabel(a)+' '+v.trim(); send(a[0]+' '+(lang==='fr'?(ADV.nounEn(v)||v.trim().toUpperCase()):v.trim().toUpperCase()),line); return; } typed(v); });
$('cancel').onclick=()=>{ disarm(); inEl.focus(); };
document.addEventListener('click',ev=>{
  if(shelfOpen) return;
  const w=ev.target.closest&&ev.target.closest('.w,.chip');
  if(w&&w.dataset.kw){ target(w.dataset.kw,w.dataset.label||w.textContent.toLocaleLowerCase(lang)); inEl.focus(); return; }
  const cell=ev.target.closest&&ev.target.closest('.cell');
  if(cell){ const big=!$('bigmap').hidden; if(big) hideBig(); walkTo(+cell.dataset.off); inEl.focus(); }
});
document.addEventListener('keydown',ev=>{
  if(shelfOpen) return;
  if(classicOn){ classicKey(ev); return; }
  if(!$('bigmap').hidden){ if(ev.key==='Escape'||ev.key.toLowerCase()==='m') hideBig(); return; }
  if(!ov.hidden){ if(ev.key==='Escape'&&!ov.classList.contains('title')&&!ov.classList.contains('menu')&&m.wait==='line') hideOverlay(); return; }
  if(ev.key==='Escape'){ disarm(); return; }
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='z'){ ev.preventDefault(); doUndo(); return; }
  if(ev.key==='Enter'&&ev.target.classList&&ev.target.classList.contains('w')){ ev.target.click(); return; }
  const arrows={ArrowLeft:'W',ArrowRight:'E',ArrowUp:'N',ArrowDown:'S'};
  if(arrows[ev.key]&&inEl.value===''&&!ev.ctrlKey&&!ev.altKey){ ev.preventDefault(); direction(arrows[ev.key]); return; }
  if(ev.key.length===1&&!ev.ctrlKey&&!ev.metaKey&&document.activeElement!==inEl) inEl.focus();
});

$('mapBig').onclick=showBig; $('bigClose').onclick=hideBig;
$('toClassic').onclick=()=>setClassic(true); $('cModern').onclick=()=>{ setClassic(false); };
$('cLang').onclick=()=>{ toggleLang(); $('cLang').blur(); }; $('cFull').onclick=()=>{ fullscreen(); $('cFull').blur(); }; $('cQuit').onclick=()=>{ $('cQuit').blur(); askQuit(); };
['pointerdown','keydown'].forEach(e=>document.addEventListener(e,()=>{   // un geste débloque la musique si le navigateur l'avait retenue
  if(musicBlocked){ musicBlocked=false; const n=ov.querySelector('.blocked'); if(n) n.style.visibility='hidden'; musicUpdate(2500); } },true));
buildStatic(); refresh(); step(null); ov.hidden=true; ov.textContent='';
window.__dt=window.__diablero={m,send,importText,pack:()=>packGame(true),state:()=>({off:roomOff(),visited:[...visited],coins,started}),sfxLog:()=>window.__sfxLog||[],music:()=>({gate:+gate.toFixed(2),target:gateTarget,paused:audio.paused,vol:+audio.volume.toFixed(3),t:+audio.currentTime.toFixed(1),opt:opts.music,desert:inDesert()})};
return {id:ADV.id,show,relang};
}

// ---------- démarrage ----------
document.documentElement.lang=lang; fit();
const go=SS.get('dragontales.go'); SS.del('dragontales.go');
const direct=go&&ADVENTURES.find(a=>a.id===go);
if(direct){ picked=ADVENTURES.indexOf(direct); launch(direct); } else openShelf();
})();
