// Essai d'Eno dans Chrome : étagère, introduction, partie entière en français jusqu'à la victoire (combinaison du coffre),
// textes traduits, carte du salon, une mort (l'aquarium), version classique, aucune erreur JavaScript.
//   python build.py && node tests/essai-eno.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const adv=require('./charger.js')('eno');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const clickOv=re=>p.evaluate(src=>{ const re=new RegExp(src); const b=[...document.querySelectorAll('#overlay button')].find(x=>re.test(x.innerText)); if(b) b.click(); return !!b; },re.source);
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 const log=()=>p.innerText('#log');
 const type=async c=>{ if(!await p.evaluate(()=>window.__dt.m.wait==='line')) return false; await p.fill('#in',c); await p.press('#in','Enter'); await p.waitForTimeout(30); return true; };   // comme le joueur, en français
 await p.goto(PAGE); await p.waitForTimeout(300);
 for(let i=0;i<8&&!/^Eno$/.test(await p.innerText('.shInfo h2'));i++) await p.keyboard.press('ArrowRight');
 ok('étagère : Eno',/Paul Austin et Leroy C\. Smith/.test(await p.innerText('.shInfo'))&&/Fins découvertes : 0 sur 5/.test(await p.innerText('.shInfo')));
 await p.screenshot({path:OUT+'/eno-etagere.png'});
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 ok('introduction',/tante excentrique/.test(await p.innerText('#overlay')));
 await clickOv(/Commencer/); await p.waitForTimeout(500);
 ok('premier lieu : le milieu du salon',/Le milieu du salon/.test(await p.innerText('body'))&&/Tu es dans le salon/.test(await log()));
 // une mort : pousser l'aquarium, puis annuler
 for(const c of ['E','E','N']) await send(c);
 await type('POUSSER L AQUARIUM'); await p.waitForTimeout(200);
 let t=await p.innerText('#overlay');
 ok('mort : l’aquarium',/Tu es mort/.test(t)&&/noyé/.test(t)&&/Le grand aquarium/.test(t),t.replace(/\n+/g,' | ').slice(0,200));
 await clickOv(/Recommencer/); await p.waitForTimeout(500);
 // la partie entière, en français pour quelques commandes
 const FRC={'GET RUG':'PRENDRE LE TAPIS','EXAMINE TABLE':'EXAMINER LA TABLE BASSE','OPEN BOOK':'OUVRIR LE LIVRE','READ BOOK':'LIRE LE LIVRE','EXAMINE TANK':'REGARDER L AQUARIUM',
  'READ MAGAZINE':'LIRE LA REVUE','OPEN SAFE':'OUVRIR LE COFFRE-FORT','GET BUCKS':'PRENDRE LES DOLLARS'};
 let n=0; for(const c of adv.solution){ if(!(FRC[c]?await type(FRC[c]):await send(c))) break; n++; if(c==='READ MAGAZINE') await p.screenshot({path:OUT+'/eno-jeu.png'}); }
 await p.waitForTimeout(400);
 const L=await log(); t=await p.innerText('#overlay');
 ok('solution jouée jusqu’au bout',n===adv.solution.length,n+'/'+adv.solution.length);
 ok('textes en français',/« Le chat aux neuf vies »/.test(L)&&/chaîne 11/.test(L)&&/29 poissons rouges/.test(L)&&/Troisième nombre de la combinaison/.test(L));
 ok('victoire',/Te voilà millionnaire/.test(t)&&/L’héritage/.test(t),t.replace(/\n+/g,' | ').slice(0,200));
 await p.screenshot({path:OUT+'/eno-victoire.png'});
 // le rat : n'importe quelle réponse à « Appeler à l'aide ? » mène à la fin (correctif 2180)
 await clickOv(/Rejouer/); await p.waitForTimeout(500);
 // une pièce magique au départ : l'indice du tapis
 await p.click('.coin'); await p.click('#overlay button.main'); await p.waitForTimeout(100);
 ok('pièce magique : le tapis',/tapis persan/i.test(await p.innerText('#log .turn.hint:last-of-type')),await p.innerText('#log .turn.hint:last-of-type'));
 // près de l'aquarium : l'indice de situation passe avant
 for(const c of ['N','E','E']) await send(c);
 await p.click('.coin'); await p.click('#overlay button.main'); await p.waitForTimeout(100);
 ok('pièce magique près de l’aquarium : n’y touche pas',/n’y touche pas/.test(await p.innerText('#log .turn.hint:last-of-type')));
 await p.screenshot({path:OUT+'/eno-aquarium.png'});
 for(const c of ['W','W','S']) await send(c);
 for(const c of ['W','N','W','EXAMINE TABLE','OPEN DOORS']) await send(c);
 await type('NON'); await p.waitForTimeout(300);
 t=await p.innerText('#overlay');
 ok('le rat : « non » mène aussi à la fin',/Tu es mort/.test(t)&&/cholestérol/.test(t)&&/Le rat/.test(t),t.replace(/\n+/g,' | ').slice(0,160));
 ok('aucune erreur JavaScript',!errs.length,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);
})();
