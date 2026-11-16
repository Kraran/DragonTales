// Essai des sauvegardes dans Chrome : pièces magiques, journal conservé, export et import par fichier.
//   node tests/sauvegardes.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const st=()=>p.evaluate(()=>window.__dt.state()), send=c=>p.evaluate(c=>window.__dt.send(c,c.toLowerCase()),c);
 const start=async()=>{ await p.goto(PAGE); await p.click('#shelf button.main'); await p.waitForTimeout(300); };
 await start(); await p.click('#overlay button:has-text("Commencer")');
 for(const c of ['LOOK','GO WEST','GO EAST']) await send(c);
 // 1. pièces magiques
 await p.click('#tool-saves'); await p.click('.slot:nth-child(2) button:has-text("Sauvegarder")'); await p.click('#overlay button.main');
 await p.click('.coin'); await p.click('#overlay button.main'); ok('une pièce dépensée',(await st()).coins===2);
 await p.click('#tool-saves'); await p.click('.slot:nth-child(2) button:has-text("Charger")');
 ok('recharger ne rend pas la pièce',(await st()).coins===2,(await st()).coins);
 await p.click('.coin'); await p.click('#overlay button.main');
 ok('deuxième indice plus précis (pas le même)',await p.$$eval('#log .hintText',l=>l.length>=1&&new Set(l.map(x=>x.textContent)).size===l.length));
 await p.click('#tool-restart'); await p.click('#overlay button.main'); ok('nouvelle partie : trois pièces',(await st()).coins===3);
 await p.click('#tool-saves'); await p.click('.slot:nth-child(2) button:has-text("Charger")');
 ok('ancienne partie rechargée après recommencer : pièces toujours dépensées',(await st()).coins===1,(await st()).coins);
 // 3. journal conservé
 for(const c of ['GO SOUTH','LOOK']) await send(c);
 const before=await p.$$eval('#log .turn',l=>l.map(x=>x.innerText));
 await start(); await p.click('#overlay button:has-text("Reprendre")'); await p.waitForTimeout(200);
 const after=await p.$$eval('#log .turn',l=>l.map(x=>x.innerText));
 ok('journal retrouvé à la reprise',after.length===before.length+1&&before.every((x,i)=>x===after[i]),before.length+' tours → '+after.length);
 await start(); await p.click('#overlay button:has-text("Reprendre")'); await p.waitForTimeout(200);
 const again=await p.$$eval('#log .turn',l=>l.map(x=>x.innerText));
 ok('reprendre deux fois n’empile pas les « Partie chargée »',again.length===after.length,after.length+' → '+again.length);
 await p.screenshot({path:OUT+'/reprise.png'});
 await p.click('#tool-options'); await p.click('#overlay button:has-text("English")'); await p.click('#overlay button:has-text("Close")');
 ok('journal repris traduisible',/look/i.test(await p.innerText('#log'))&&!/regarder/i.test(await p.innerText('#log')));
 await p.click('#toClassic'); const cl=await p.innerText('#cScreen');
 ok('version classique : historique puis invite',/GAME LOADED/.test(cl)&&/WHAT DO I DO NOW\?\s*$/.test(cl)&&cl.split('WHAT DO I DO NOW?').length>3,JSON.stringify(cl.slice(-120)));
 await p.click('#cModern'); await p.click('#tool-options'); await p.click('#overlay button:has-text("Français")'); await p.click('#overlay button:has-text("Fermer")');
 const size=await p.evaluate(()=>localStorage.getItem('eldiablero.slot.auto').length); ok('taille de la sauvegarde raisonnable',size<200000,size+' caractères');
 // 8. export / import
 const ref=await st();
 await p.click('#tool-saves');
 const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#overlay button:has-text("Exporter")')]);
 const file=path.join(OUT,dl.suggestedFilename()); await dl.saveAs(file);
 ok('fichier exporté',/^DragonTales-eldiablero-\d{8}-\d{4}\.json$/.test(dl.suggestedFilename()),dl.suggestedFilename()+', '+fs.statSync(file).size+' octets');
 ok('message d’export',/exportée/.test(await p.innerText('.portNote')));
 await p.screenshot({path:OUT+'/sauvegardes.png'});
 // autre navigateur : contexte neuf, sans aucune donnée
 const ctx2=await b.newContext({viewport:{width:1920,height:1080}}); const q=await ctx2.newPage(); q.on('pageerror',e=>errs.push(e.message));
 await q.goto(PAGE); await q.click('#shelf button.main'); await q.waitForTimeout(300); await q.click('#overlay button:has-text("Commencer")');
 await q.click('#tool-saves');
 fs.writeFileSync(OUT+'/faux.json','{"bonjour":1}'); fs.writeFileSync(OUT+'/autre.json',JSON.stringify(Object.assign(JSON.parse(fs.readFileSync(file,'utf8')),{adventure:'autrejeu'})));
 await q.setInputFiles('#overlay input[type=file]',OUT+'/faux.json'); await q.waitForTimeout(200);
 ok('fichier quelconque refusé',/n’est pas une sauvegarde/.test(await q.innerText('.portNote')));
 await q.setInputFiles('#overlay input[type=file]',OUT+'/autre.json'); await q.waitForTimeout(200);
 ok('autre aventure refusée',/autre aventure \(autrejeu\)/.test(await q.innerText('.portNote')));
 ok('partie intacte après les refus',(await q.evaluate(()=>window.__dt.state())).visited.length===1);
 await q.setInputFiles('#overlay input[type=file]',file); await q.waitForTimeout(300);
 const got=await q.evaluate(()=>window.__dt.state());
 ok('import : même lieu, mêmes lieux visités, mêmes pièces',got.off===ref.off&&got.visited.length===ref.visited.length&&got.coins===ref.coins,JSON.stringify({off:got.off,coins:got.coins}));
 ok('import : journal retrouvé',(await q.$$eval('#log .turn',l=>l.length))>=before.length);
 ok('import : la partie continue',await q.evaluate(()=>window.__dt.send('LOOK','look'))&&await q.evaluate(()=>window.__dt.m.wait==='line'));
 ok('import : sauvegarde automatique faite',await q.evaluate(()=>!!localStorage.getItem('eldiablero.slot.auto')));
 ok('aucune erreur JavaScript',errs.length===0,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);})();
