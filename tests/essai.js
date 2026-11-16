// Essai de bout en bout dans Chrome : étagère, lancement, solution complète, retour à l'étagère, reprise.
//   node tests/essai.js          (rejoue aventures/eldiablero/solution.txt ; code de sortie 1 si un contrôle échoue)
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }const fs=require('fs');const path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const cmds=require('./charger.js')('eldiablero').solution;
let bad=0; const say=(k,v)=>{ if(v===false) bad++; console.log((v===false?'ÉCHEC ':'')+k.padEnd(34),v); };   // un contrôle qui vaut false compte comme un échec
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:1920,height:1080}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 const vis=s=>p.evaluate(s=>{const e=document.querySelector(s);return !!e&&!e.hidden;},s);
 await p.goto(PAGE); await p.waitForTimeout(400);
 say('étagère au lancement',await vis('#shelf')); say('titre de page',await p.title());
 say('texte étagère',(await p.innerText('#shelf')).replace(/\n+/g,' | ').slice(0,330));
 await p.screenshot({path:OUT+'/1-etagere.png'});
 await p.click('#shelf .shFoot button:has-text("English")'); await p.screenshot({path:OUT+'/2-etagere-en.png'});
 say('étagère en anglais',(await p.innerText('.shInfo')).replace(/\n+/g,' | ').slice(0,200));
 await p.click('#shelf .shFoot button:has-text("Français")');
 await p.click('#shelf .shFoot button:has-text("Quitter")'); say('confirmation quitter',(await p.innerText('#overlay')).replace(/\n+/g,' | ')); await p.click('#overlay button:has-text("Rester")');
 await p.click('#shelf button.main'); await p.waitForTimeout(700);
 say('écran d’introduction',await vis('#overlay.title')); say('boutons',(await p.$$eval('#overlay button',l=>l.map(x=>x.textContent))).join(' / '));
 say('titre de page',await p.title()); say('musique intro',JSON.stringify(await p.evaluate(()=>window.__dt.music())));
 await p.screenshot({path:OUT+'/3-intro.png'});
 await p.click('#overlay button:has-text("Retour à DragonTales")'); await p.waitForTimeout(300);
 say('retour étagère depuis intro',await vis('#shelf')&&!(await vis('#overlay')));
 await p.waitForTimeout(1800); say('musique sur étagère',JSON.stringify(await p.evaluate(()=>window.__dt.music())));
 await p.click('.shBox.on'); await p.waitForTimeout(300); say('relance par la boîte',await vis('#overlay.title'));
 await p.click('#overlay button:has-text("English")'); await p.click('#overlay button.main');
 let n=0,full=0;
 for(const c of cmds){ const ok=await p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c); if(!ok){console.log('arret avant',c);break;} n++;
   const last=await p.evaluate(()=>{const t=document.querySelectorAll('#log .turn');return t[t.length-1].innerText;}); if(/hands are full/i.test(last)){full++;console.log('MAINS PLEINES:',c);}
   if(n===150){ await p.screenshot({path:OUT+'/4-jeu.png'});
     // retour à l'étagère en pleine partie, puis reprise
     const before=await p.evaluate(()=>window.__dt.state());
     await p.click('#tool-quit'); say('fenêtre quitter en jeu',(await p.$$eval('#overlay button',l=>l.map(x=>x.textContent))).join(' / '));
     await p.click('#overlay button:has-text("Back to DragonTales")'); await p.waitForTimeout(300);
     say('étagère en pleine partie',await vis('#shelf')); say('état étagère',await p.innerText('.shState')); await p.screenshot({path:OUT+'/5-etagere-partie.png'});
     await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowRight'); await p.keyboard.type('x');   // les flèches parcourent l'étagère : aller-retour
     await p.click('#shelf button.main'); await p.waitForTimeout(300);
     say('intro après retour',(await p.$$eval('#overlay button',l=>l.map(x=>x.textContent))).join(' / '));
     await p.click('#overlay button:has-text("Resume game")'); await p.waitForTimeout(300);
     const after=await p.evaluate(()=>window.__dt.state());
     say('reprise au même lieu',before.off===after.off&&before.visited.length===after.visited.length&&after.coins===before.coins&&after.started);
   } }
 await p.waitForTimeout(300);
 say('commandes jouées',n+' / '+cmds.length+', mains pleines '+full+', état '+await p.evaluate(()=>window.__dt.m.wait));
 say('solution jouée jusqu’à la victoire',n===cmds.length&&full===0&&/complete/i.test(await p.innerText('#overlay')));
 say('fenêtre de fin',(await p.innerText('#overlay')).replace(/\n+/g,' | '));
 await p.screenshot({path:OUT+'/6-fin.png'});
 say('lieux visités',await p.evaluate(()=>window.__dt.state().visited.length));
 // rejouer, version classique, changement de langue, options
 await p.click('#overlay button.main'); await p.waitForTimeout(200);
 await p.evaluate(()=>window.__dt.send('GO NORTH','go north'));
 await p.click('#toClassic'); await p.waitForTimeout(200); await p.click('#cLang'); await p.screenshot({path:OUT+'/7-classique.png'});
 say('classique (fin d’écran)',JSON.stringify((await p.innerText('#cScreen')).slice(-90)));
 await p.click('#cQuit'); await p.click('#overlay button:has-text("Retour à DragonTales")'); await p.waitForTimeout(300);
 say('étagère depuis le classique',await vis('#shelf')&&!(await vis('#classic')));
 await p.click('#shelf button.main'); await p.click('#overlay button:has-text("Options")'); await p.screenshot({path:OUT+'/8-options.png'}); await p.click('#overlay button:has-text("Fermer")');
 await p.click('#overlay button:has-text("Commencer")'); await p.fill('#in','regarder'); await p.keyboard.press('Enter'); await p.keyboard.press('ArrowUp');
 await p.click('.coin'); await p.click('#overlay button.main'); await p.waitForTimeout(200);
 say('indice',(await p.innerText('#log .turn.hint')).replace(/\n+/g,' | ').slice(0,160));
 await p.screenshot({path:OUT+'/9-jeu-fr.png'});
 say('erreurs JS',JSON.stringify(errs)); say('aucune erreur JavaScript',errs.length===0);
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);})();
