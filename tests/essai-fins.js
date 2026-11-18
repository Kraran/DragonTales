// Essai des fins et du bilan dans Chrome : collection vide sur l'étagère, mort par le loup-garou dans Mansion of Doom
// (nouvelle fin, bilan, puis la même fin après un retour en arrière), fenêtre des fins depuis la mort, victoire,
// collection mise à jour sur l'étagère, fin reconnue au lieu dans El Diablero (l'homme à la machette).
//   python build.py && node tests/essai-fins.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const md=require('./charger.js')('mansion'), ed=require('./charger.js')('eldiablero');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const pick=async re=>{ for(let i=0;i<8&&!re.test(await p.innerText('.shInfo h2'));i++) await p.keyboard.press('ArrowRight'); };
 const ovText=async()=>(await p.innerText('#overlay')).replace(/\n+/g,' | ');
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 const clickOv=re=>p.evaluate(src=>{ const re=new RegExp(src); const b=[...document.querySelectorAll('#overlay button')].find(x=>re.test(x.innerText)); if(b) b.click(); return !!b; },re.source);

 await p.goto(PAGE+'#graine='+md.seed); await p.waitForTimeout(300);
 await pick(/Mansion/);
 ok('étagère : aucune fin découverte',/Fins découvertes : 0 sur 8/.test(await p.innerText('.shFins')),await p.innerText('.shFins'));
 await p.click('.shFins'); await p.waitForTimeout(100);
 ok('fenêtre des fins : huit fins inconnues',(await p.$$('#overlay .fnItem.unk')).length===8&&/Les fins de Mansion of Doom/.test(await ovText()));
 await p.screenshot({path:OUT+'/fins-vide.png'});
 await p.keyboard.press('Escape'); await p.waitForTimeout(100);
 ok('Échap ferme la fenêtre des fins',await p.evaluate(()=>document.getElementById('overlay').hidden));
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 await clickOv(/Commencer/); await p.waitForTimeout(300);
 // mort : le loup-garou (solution jusqu'au couloir, puis vers le nord sans l'avoir tué)
 for(const c of md.solution.slice(0,65)) await send(c);
 await send('N'); await p.waitForTimeout(200);
 let t=await ovText();
 ok('mort : nouvelle fin découverte',/Tu es mort/.test(t)&&/Nouvelle fin découverte/.test(t)&&/Le loup-garou/.test(t)&&/Fins découvertes : 1 sur 8/.test(t),t);
 ok('bilan : coups, lieux, pièces, temps',/Coups joués \| 66 \|/.test(t)&&/Lieux découverts \| \d+ sur 77/.test(t)&&/Pièces magiques dépensées \| 0 sur 3/.test(t)&&/Temps de jeu \| < 1 min/.test(t)&&/Morts \| 1 \|/.test(t),t);
 await p.screenshot({path:OUT+'/fins-mort.png'});
 await clickOv(/Voir les fins/); await p.waitForTimeout(100);
 t=await ovText();
 ok('fenêtre des fins depuis la mort',/Le loup-garou/.test(t)&&(await p.$$('#overlay .fnItem.unk')).length===7,t);
 await p.screenshot({path:OUT+'/fins-liste.png'});
 await clickOv(/^Fermer$/); await p.waitForTimeout(100);
 ok('retour à la fenêtre de mort',/Tu es mort/.test(await ovText()));
 await clickOv(/Annuler le dernier coup/); await p.waitForTimeout(100);
 await send('N'); await p.waitForTimeout(200);
 t=await ovText();
 ok('même mort : fin déjà découverte, bilan mis à jour',/Fin déjà découverte/.test(t)&&/Fins découvertes : 1 sur 8/.test(t)&&/Coups annulés \| 1 \|/.test(t)&&/Morts \| 2 \|/.test(t),t);
 await clickOv(/Annuler le dernier coup/); await p.waitForTimeout(100);
 let n=65; for(const c of md.solution.slice(65)){ if(!await send(c)) break; n++; }
 await p.waitForTimeout(300); t=await ovText();
 ok('victoire : nouvelle fin et bilan',n===md.solution.length&&/Nouvelle fin découverte/.test(t)&&/La princesse sauvée/.test(t)&&/Fins découvertes : 2 sur 8/.test(t)&&/Coups joués/.test(t),t);
 await p.screenshot({path:OUT+'/fins-victoire.png'});
 // l'étagère compte les fins ; la sauvegarde garde le bilan
 const pk=await p.evaluate(()=>window.__dt.pack());
 ok('sauvegarde : le bilan est enregistré',pk.stats&&pk.stats.moves>=md.solution.length&&pk.stats.deaths===2,JSON.stringify(pk.stats));
 await p.goto('about:blank'); await p.goto(PAGE); await p.waitForTimeout(300);
 await pick(/Mansion/);
 ok('étagère : deux fins découvertes',/Fins découvertes : 2 sur 8/.test(await p.innerText('.shFins')));
 await p.click('.shFins'); await p.waitForTimeout(100);
 t=await ovText();
 ok('collection : la victoire en tête, datée',(await p.$$('#overlay .fnItem.won:not(.unk)')).length===1&&/Victoire/.test(t)&&/le \d+ \w+ 20\d\d/.test(t),t);
 await p.keyboard.press('Escape');
 // El Diablero : fin reconnue au lieu (l'homme à la machette)
 await pick(/El Diablero/);
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 await clickOv(/Commencer/); await p.waitForTimeout(400);
 for(const c of ed.solution.slice(0,97)) await send(c);
 await send('GO WEST'); await p.waitForTimeout(200);
 t=await ovText();
 ok('El Diablero : l’homme à la machette',/Tu es mort/.test(t)&&/L’homme à la machette/.test(t)&&/1 sur 8/.test(t),t);
 ok('aucune erreur JavaScript',!errs.length,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);
})();
