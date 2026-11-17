// Essai de S.S. Poseidon (jeu en BASIC à écran partagé) dans Chrome : choix du niveau, partie entière avec solution.txt,
// sauvegarde et chargement, écran du Dragon dans la version classique (français et anglais), correctif de MANGER, mort,
// fin de partie dans la version classique.
//   python build.py && node tests/essai-poseidon.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const sol=require('./charger.js')('poseidon');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE); await p.waitForTimeout(300);
 for(let i=0;i<5&&!/Poseidon/.test(await p.innerText('.shInfo h2'));i++) await p.keyboard.press('ArrowRight');
 ok('Poseidon choisi sur l’étagère',/Poseidon/.test(await p.innerText('.shInfo h2')));
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 ok('écran d’introduction',/Poseidon/.test(await p.innerText('#overlay')));
 await p.click('#overlay button:has-text("Commencer")'); await p.waitForTimeout(200);
 const menu=await p.innerText('#overlay');
 ok('choix du niveau proposé',/Choisis ton niveau/.test(menu)&&/75 coups/.test(menu)&&/250 coups/.test(menu),menu.replace(/\n+/g,' | '));
 await p.keyboard.press('Escape'); ok('Échap ne ferme pas le choix du niveau',!(await p.$eval('#overlay',e=>e.hidden)));
 await p.click('#overlay .menuRow button:has-text("Expert")'); await p.waitForTimeout(200);
 ok('musique : zone de la salle de bal',(await p.evaluate(()=>window.__dt.music())).desert===true);
 ok('premier lieu affiché',/salle de bal/.test(await p.innerText('#log')));
 ok('coups restants affichés',/Encore 74 coups/.test(await p.innerText('#sceneStatus')),await p.innerText('#sceneStatus'));
 ok('pas de texte de l’écran titre dans le journal',!/DRAGON DATA|CHOICE|NIVEAU :|Bienvenue/i.test(await p.innerText('#log')));
 // commandes tapées en français
 await p.fill('#in','o'); await p.keyboard.press('Enter');
 await p.fill('#in','examine les débris'); await p.keyboard.press('Enter');
 ok('commande française comprise',/Regarde/.test(await p.innerText('#log .turn:last-child')),await p.innerText('#log .turn:last-child'));
 await p.fill('#in','prends la lampe torche'); await p.keyboard.press('Enter');
 ok('objet pris, au panneau « Je porte »',/Lampe torche/i.test(await p.innerText('#inv')));
 // correctif : manger un objet que l'on porte
 await p.fill('#in','mange la lampe'); await p.keyboard.press('Enter');
 ok('MANGER un objet porté : plus de « Tu ne l’as pas »',/plaisantes/.test(await p.innerText('#log .turn:last-child')),await p.innerText('#log .turn:last-child'));
 await p.click('#tool-undo'); await p.click('#tool-undo'); await p.click('#tool-undo'); await p.click('#tool-undo');
 ok('annulé jusqu’au départ',await p.evaluate(()=>window.__dt.state().off)===0);
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 let n=0;
 for(const c of sol.solution.slice(1)){ if(!await send(c)){ console.log('arrêt avant',c); break; } n++;
   if(c==='CLIMB CABLE'){ ok('montée au câble : deuxième niveau',/croisement/.test(await p.innerText('#log .turn:last-child')));
     ok('musique : hors zone dans les coursives',(await p.evaluate(()=>window.__dt.music())).desert===false); }
   if(n===24){
     await p.click('#tool-saves'); await p.click('.slot:nth-child(2) button:has-text("Sauvegarder")'); await p.click('#overlay button.main');
     const st=await p.evaluate(()=>window.__dt.state()); await send('W');
     await p.click('#tool-saves'); await p.click('.slot:nth-child(2) button:has-text("Charger")');
     ok('sauvegarde rechargée au même lieu',(await p.evaluate(()=>window.__dt.state())).off===st.off);
     const log=await p.innerText('#log');
     ok('journal moderne entièrement en français',!/\b(YOU'RE|YOU CAN|OBVIOUS|OKAY|--->)\b/i.test(log));
     await p.click('#toClassic'); const fr=await p.innerText('#cScreen');
     const rows=fr.split('\n');
     ok('version classique : écran de 16 lignes de 32 colonnes',rows.length===16&&rows.every(r=>r.length===32),rows.length+' lignes');
     ok('séparateur à la ligne 8, invite en bas',/^=+ ?$/.test(rows[7])&&/^---> /.test(rows[15].replace(/ /g,' ')),JSON.stringify([rows[7],rows[15]]));
     ok('version classique en français',/TU ES /.test(fr)&&/SORTIES :/.test(fr));
     await p.screenshot({path:OUT+'/ps-classique-fr.png'});
     await p.click('#cLang'); const en=await p.innerText('#cScreen');
     ok('version classique anglaise : texte d’origine',/YOU'RE /.test(en)&&/OBVIOUS EXITS:/.test(en));
     await p.screenshot({path:OUT+'/ps-classique-en.png'});
     await p.click('#cLang'); await p.click('#cModern');
   } }
 await p.waitForTimeout(300);
 ok('solution jouée jusqu’à la victoire',n===sol.solution.length-1&&/Sauvé/.test(await p.innerText('#overlay')),n+' / '+(sol.solution.length-1)+' : '+(await p.innerText('#overlay')).replace(/\n+/g,' | '));
 await p.screenshot({path:OUT+'/ps-victoire.png'});
 // mort : sauter de la corniche sans corde
 await p.click('#overlay button.main'); await p.waitForTimeout(200);
 await p.click('#overlay .menuRow button:has-text("Débutant")'); await p.waitForTimeout(100);
 ok('rejouer : niveau débutant',/Encore 249 coups/.test(await p.innerText('#sceneStatus')),await p.innerText('#sceneStatus'));
 await p.evaluate(()=>{ const d=window.__dt; const S=JSON.parse(d.m.snapshot().m); S.vars['L']=15; const o=S.arrs[Object.keys(S.arrs).find(k=>k.startsWith('O'))]; o.v[27*(o.d[1]+1)+3]='99'; d.m.restore({m:JSON.stringify(S)}); });
 await send('S'); await p.waitForTimeout(100);
 const ov=await p.innerText('#overlay');
 ok('mort dans le mazout : fenêtre de mort',/Tu es mort/.test(ov)&&/mazout/.test(ov),ov.replace(/\n+/g,' | '));
 // la même fin dans la version classique : la question du jeu, O pour rejouer
 await p.click('#overlay button:has-text("Annuler")');
 await p.click('#toClassic'); await send('S'); await p.waitForTimeout(100);
 const cl=await p.innerText('#cScreen');
 ok('version classique : « UNE AUTRE PARTIE ? »',/UNE AUTRE PARTIE/.test(cl),cl.slice(-120));
 await p.keyboard.press('o'); await p.waitForTimeout(150);
 ok('O : nouvelle partie, choix du niveau',/CHOISIS TON NIVEAU/.test(await p.innerText('#cScreen')));
 await p.keyboard.type('2'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
 ok('niveau tapé au clavier',/TU ES DANS LA SALLE DE BAL/.test(await p.innerText('#cScreen')));
 await p.screenshot({path:OUT+'/ps-classique-depart.png'});
 // les pièges d'origine : mort expliquée
 await p.click('#cModern').catch(()=>{});
 const piege=async(nom,L,cmd,attendu,f)=>{
   await p.evaluate(([L,f])=>{ const d=window.__dt; const S=JSON.parse(d.m.snapshot().m); S.vars['L']=L; const o=S.arrs[Object.keys(S.arrs).find(k=>k.startsWith('O'))];
     const r=S.arrs[Object.keys(S.arrs).find(k=>k.startsWith('R'))]; o.v[27*(o.d[1]+1)+3]=f.lampe===false?'0':'99';
     if(f.f7){ S.vars['F7']=1; r.v[6*(r.d[1]+1)+2]='SOWE0503'; } d.m.restore({m:JSON.stringify(S)}); },[L,f||{}]);
   await send(cmd); await p.waitForTimeout(100);
   const t=await p.innerText('#overlay').catch(()=>''), log=await p.innerText('#log .turn:last-child');
   ok(nom,attendu.test(t+' '+log),(t+' '+log).replace(/\n+/g,' | ').slice(0,200));
   if(await p.$eval('#overlay',e=>!e.hidden)) await p.click('#overlay button:has-text("Annuler")');
 };
 await piege('aide du poste radio : l’extincteur, pas un mot magique',10,'HELP',/extincteur : il y en a un dans la cuisine/);
 await piege('poste radio en feu sans extincteur : mort expliquée',10,'N',/Tu es mort[\s\S]*asphyxié/);
 await piege('noir sans lampe : mort expliquée',5,'N',/Tu es mort[\s\S]*perdu dans les coursives/,{lampe:false});
 await piege('passage secret : noyade expliquée dès l’arrivée',6,'W',/Tu es mort[\s\S]*salle de bal inondée/,{f7:1});
 ok('aucune erreur JavaScript',errs.length===0,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);})();
