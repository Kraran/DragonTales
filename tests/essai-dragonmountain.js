// Essai de Dragon Mountain (jeu en BASIC) dans Chrome : partie entière avec la graine de solution.txt, sauvegarde et
// chargement, version classique, français et anglais, formule magique, mort.
//   python build.py && node tests/essai-dragonmountain.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const sol=require('./charger.js')('dragonmountain');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE+'#graine='+sol.seed); await p.waitForTimeout(300);
 const boxes=await p.$$eval('.shBox:not(.shEmpty)',l=>l.length); ok('au moins trois aventures sur l’étagère',boxes>=3,boxes);
 await p.keyboard.press('ArrowRight'); ok('flèche : Dragon Mountain choisi',/Dragon Mountain/.test(await p.innerText('.shInfo h2')));
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 ok('écran d’introduction',/Montagne du Dragon/.test(await p.innerText('#overlay')));
 await p.click('#overlay button:has-text("Commencer")'); await p.waitForTimeout(200);
 ok('premier lieu affiché',/vaste caverne/.test(await p.innerText('#log')));
 // une commande tapée en français
 await p.fill('#in','lire le panneau'); await p.keyboard.press('Enter');
 ok('commande française comprise',/Montagne du Dragon/.test(await p.innerText('#log .turn:last-child')));
 // pièce magique : le premier indice, puis le second qui nomme le lieu de la cape (placée au hasard ou non)
 await p.click('.coin'); await p.click('#overlay button.main'); await p.click('.coin'); await p.click('#overlay button.main');
 const hints=await p.$$eval('#log .hintText',l=>l.map(x=>x.textContent));
 ok('deux indices, le second nomme un lieu',hints.length===2&&/armoire/i.test(hints[1]),hints.join(' | '));
 await p.click('#tool-options'); await p.click('#overlay button:has-text("English")'); await p.click('#overlay button:has-text("Close")');
 ok('indice recomposé en anglais',/wardrobe/i.test(await p.innerText('#log .turn.hint:last-of-type')));
 await p.click('#tool-options'); await p.click('#overlay button:has-text("Français")'); await p.click('#overlay button:has-text("Fermer")');
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 let n=0, spell=false, dragonSeen=false;
 for(const c of sol.solution){ if(!await send(c)){ console.log('arrêt avant',c); break; } n++;
   if(c==='OPEN DOOR'&&/formule/.test(await p.innerText('#log .turn:last-child'))) spell=true;
   if(/dragon est dans/i.test(await p.innerText('#log .turn:last-child'))) dragonSeen=await p.evaluate(()=>document.querySelector('#sceneArt').innerHTML.includes('#3f8a3f'));
   if(n===50){
     await p.click('#tool-saves'); await p.click('.slot:nth-child(2) button:has-text("Sauvegarder")'); await p.click('#overlay button.main');
     const st=await p.evaluate(()=>window.__dt.state()); await send('GO NORTH');
     await p.click('#tool-saves'); await p.click('.slot:nth-child(2) button:has-text("Charger")');
     ok('sauvegarde rechargée au même lieu',(await p.evaluate(()=>window.__dt.state())).off===st.off);
     const log=await p.innerText('#log');
     ok('journal moderne entièrement en français',!/\b(I AM|WHAT SHALL|EXITS FROM|I DON'T)\b/i.test(log));
     await p.click('#toClassic'); const fr=await p.innerText('#cScreen');
     ok('version classique en français, invite à la fin',/QUE DOIS-JE FAIRE \?\s*\?\s*$/.test(fr),JSON.stringify(fr.slice(-40)));
     await p.click('#cLang'); const en=await p.innerText('#cScreen');
     ok('version classique anglaise : texte d’origine',/WHAT SHALL I DO\?\s*\?\s*$/.test(en)&&/EXITS FROM THE ROOM ARE TO THE/.test(en));
     await p.screenshot({path:OUT+'/dm-classique.png'});
     await p.click('#cLang'); await p.click('#cModern');
   } }
 ok('la porte noire demande la formule',spell);
 ok('le dragon est dessiné quand il apparaît',dragonSeen);
 await p.waitForTimeout(300);
 ok('solution jouée jusqu’à la victoire',n===sol.solution.length&&/accomplie/.test(await p.innerText('#overlay')),n+' / '+sol.solution.length);
 await p.screenshot({path:OUT+'/dm-victoire.png'});
 // mort : un elfe combattu (une chance sur deux à chaque coup)
 await p.click('#overlay button.main'); await p.waitForTimeout(200);
 let dead=false;
 for(let i=0;i<20&&!dead;i++){
   await p.evaluate(()=>{ const d=window.__dt; const S=JSON.parse(d.m.snapshot().m); S.vars['R']=26; S.vars['E1']=0; S.vars['EP']=1; d.m.restore({m:JSON.stringify(S)}); });
   await send('KILL ELF'); dead=await p.evaluate(()=>window.__dt.m.wait==='end'); }
 const ov=await p.innerText('#overlay');
 ok('mort : fenêtre avec annuler, charger, recommencer',dead&&/Tu es mort/.test(ov)&&/Annuler/.test(ov)&&/Recommencer/.test(ov),ov.replace(/\n+/g,' | '));
 await p.click('#overlay button:has-text("Annuler")'); ok('annuler revient avant la mort',await p.evaluate(()=>window.__dt.m.wait==='line'));
 ok('aucune erreur JavaScript',errs.length===0,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);})();
