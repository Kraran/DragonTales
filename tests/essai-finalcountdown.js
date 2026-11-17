// Essai de The Final Countdown (jeu en BASIC à écran partagé, comme S.S. Poseidon) dans Chrome : choix du niveau,
// commandes françaises, pièce magique, partie entière (le général et le labyrinthe sont au hasard : l'essai réagit),
// version classique (français et anglais), fins expliquées (incendie, lancement par erreur, général).
//   python build.py && node tests/essai-finalcountdown.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const sol=require('./charger.js')('finalcountdown');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE); await p.waitForTimeout(300);
 for(let i=0;i<7&&!/Countdown/.test(await p.innerText('.shInfo h2'));i++){ await p.keyboard.press('ArrowRight'); await p.waitForTimeout(80); }
 ok('The Final Countdown choisi sur l’étagère',/Countdown/.test(await p.innerText('.shInfo h2')));
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 ok('écran d’introduction',/compte à rebours/.test(await p.innerText('#overlay')));
 await p.click('#overlay button:has-text("Commencer")'); await p.waitForTimeout(300);
 ok('choix du niveau proposé',/Choisis ton niveau/.test(await p.innerText('#overlay')));
 await p.click('#overlay .menuRow button:has-text("Expert")'); await p.waitForTimeout(200);
 ok('premier lieu affiché',/camionnette/.test(await p.innerText('#log')));
 ok('pas d’écran titre dans le journal',!/DRAGON DATA|SKILL|NIVEAU :|WELCOME|Bienvenue/i.test(await p.innerText('#log')));
 ok('compte à rebours affiché',/T moins 74/.test(await p.innerText('#sceneStatus')),await p.innerText('#sceneStatus'));
 ok('musique : zone du dehors',(await p.evaluate(()=>window.__dt.music())).desert===true);
 const cmd=async c=>{ await p.fill('#in',c); await p.keyboard.press('Enter'); await p.waitForTimeout(60); return p.innerText('#log .turn:last-child'); };
 ok('objets du lieu nommés en français',/Uniforme du général/.test(await p.innerText('#here')),await p.innerText('#here'));
 await cmd('prends l’uniforme'); await cmd('mets l’uniforme');
 ok('commande française : examiner l’uniforme',/Tu trouves quelque chose/.test(await cmd('examine l’uniforme')));
 ok('jurons : la réponse d’origine, traduite',/vocabulaire/.test(await cmd('merde')));
 await p.click('.coin'); await p.click('#overlay button.main'); await p.waitForTimeout(100);
 ok('pièce magique : l’uniforme cache quelque chose',/uniforme du général cache/i.test(await p.innerText('#log .turn.hint:last-of-type')),await p.innerText('#log .turn.hint:last-of-type'));
 for(let i=0;i<4;i++) await p.click('#tool-undo').catch(()=>{});
 ok('annulé jusqu’au départ',/T moins 74/.test(await p.innerText('#sceneStatus')),await p.innerText('#sceneStatus'));
 // la solution, en réagissant au hasard : le général qui surgit, le passage du labyrinthe
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,d.rev(c)); return true;},c);
 const mv=k=>p.evaluate(k=>window.__dt.m.mem.v(k),k);
 const plan=sol.solution.slice(1).filter(c=>c!=='SHOOT GENERAL');
 let n=0, gen=0, seen=false;
 for(let i=0;i<plan.length;i++){ const c=plan[i];
   if(c==='GO PASSAGE'){ let g=0; while(await mv('PA')===0&&g++<60){ await send('N'); if(await mv('XX')===1){ gen++; await send('SHOOT GENERAL'); } } }
   if(!await send(c)){ console.log('arrêt avant',c); break; } n++;
   if(await mv('XX')===1){ gen++;
     if(!seen){ seen=true; ok('le général surgit : annoncé dans le journal',/Le général est là/.test(await p.innerText('#log .turn:last-child')),await p.innerText('#log .turn:last-child')); }
     await send('SHOOT GENERAL'); }
   if(c==='PRESS THREE'&&n<20) ok('bouton TROIS : le feu prend dans le bureau',/bruit/.test(await p.innerText('#log .turn:last-child')));
   if(n===8){
     await p.click('#toClassic'); const fr=await p.innerText('#cScreen'); const rows=fr.split('\n');
     ok('version classique : écran de 16 lignes de 32 colonnes',rows.length===16&&rows.every(r=>r.length===32),rows.length+' lignes');
     ok('séparateur à la ligne 8',/^=+ ?$/.test(rows[7]),JSON.stringify(rows[7]));
     ok('version classique en français',/TU ES /.test(fr)&&/SORTIES :/.test(fr),fr.slice(0,200));
     await p.screenshot({path:OUT+'/fc-classique-fr.png'});
     await p.click('#cLang'); const en=await p.innerText('#cScreen');
     ok('version classique anglaise : texte d’origine',/YOU'RE /.test(en)&&/YOU CAN GO:/.test(en));
     await p.click('#cLang'); await p.click('#cModern');
   } }
 await p.waitForTimeout(300);
 ok('solution jouée jusqu’à la victoire',/arrêté/.test(await p.innerText('#overlay')),n+' / '+plan.length+', général : '+gen+' fois : '+(await p.innerText('#overlay')).replace(/\n+/g,' | '));
 await p.screenshot({path:OUT+'/fc-victoire.png'});
 // les fins : on place le joueur dans la situation
 await p.click('#overlay button.main'); await p.waitForTimeout(200);
 await p.click('#overlay .menuRow button:has-text("Débutant")'); await p.waitForTimeout(100);
 const set=vars=>p.evaluate(vars=>{ const d=window.__dt; const S=JSON.parse(d.m.snapshot().m); Object.assign(S.vars,vars); d.m.restore({m:JSON.stringify(S)}); },vars);
 const piege=async(nom,vars,c,attendu)=>{ await set(vars); await send(c); await p.waitForTimeout(150);
   const t=await p.innerText('#overlay').catch(()=>''), log=await p.innerText('#log .turn:last-child');
   ok(nom,attendu.test(t+' '+log),(t+' '+log).replace(/\n+/g,' | ').slice(0,220));
   if(await p.$eval('#overlay',e=>!e.hidden)) await p.click('#overlay button:has-text("Annuler")').catch(()=>{});
 };
 await piege('incendie sans extincteur : mort expliquée',{L:10,F2:1},'GO NORTH',/Tu es mort[\s\S]*fumée envahit le bureau/);
 await piege('bouton UN au poste de tir : le missile part',{L:20},'PRESS ONE',/Tu es mort[\s\S]*lancer un missile/);
 await piege('le général : toute autre commande est fatale',{L:15,XX:1},'GO NORTH',/Tu es mort[\s\S]*général t'a eu/);
 ok('aucune erreur JavaScript',errs.length===0,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);})();
