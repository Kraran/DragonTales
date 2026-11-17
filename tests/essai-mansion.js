// Essai de Mansion of Doom (jeu en BASIC, écrans en couleur) dans Chrome : commandes françaises, noms français des objets,
// pièce magique, partie entière avec solution.txt, version classique (écran titre rouge, plan semi-graphique, français et
// anglais), mots de passe français, fins expliquées.
//   python build.py --tout && node tests/essai-mansion.js      (l'aventure est encore « en cours » : --tout l'inclut)
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const sol=require('./charger.js')('mansion');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE); await p.waitForTimeout(300);
 for(let i=0;i<6&&!/Mansion/.test(await p.innerText('.shInfo h2'));i++) await p.keyboard.press('ArrowRight');
 ok('Mansion of Doom choisi sur l’étagère',/Mansion/.test(await p.innerText('.shInfo h2')));
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 ok('écran d’introduction',/Marléna/.test(await p.innerText('#overlay')));
 await p.click('#overlay button:has-text("Commencer")'); await p.waitForTimeout(300);
 ok('premier lieu affiché',/devant le manoir/.test(await p.innerText('#log')));
 ok('pas d’écran titre ni de question dans le journal',!/DRAGON DATA|MANOIR MAUDIT|INSTRUCTIONS|WHAT NOW/i.test(await p.innerText('#log')));
 ok('musique : zone du dehors',(await p.evaluate(()=>window.__dt.music())).desert===true);
 const cmd=async c=>{ await p.fill('#in',c); await p.keyboard.press('Enter'); await p.waitForTimeout(60); return p.innerText('#log .turn:last-child'); };
 ok('commande française : ouvrir la porte',/C'est ouvert/.test(await cmd('ouvre la porte')));
 await cmd('s'); await cmd('o'); await cmd('o');
 ok('musique : hors zone dans le manoir',(await p.evaluate(()=>window.__dt.music())).desert===false);
 ok('objet du lieu nommé en français',/Cage/.test(await p.innerText('#here')),await p.innerText('#here'));
 await cmd('prends la cage');
 ok('objet pris, au panneau « Je porte »',/Cage/.test(await p.innerText('#inv')));
 ok('secours moqueur traduit',/Tu plaisantes/.test(await cmd('secours')));
 ok('mot inconnu',/Je ne connais pas le mot/.test(await cmd('prends la licorne')));
 await p.click('.coin'); await p.click('#overlay button.main'); await p.waitForTimeout(100);
 ok('pièce magique : se protéger avant la nuit',/chapelle/i.test(await p.innerText('#log .turn.hint:last-of-type')),await p.innerText('#log .turn.hint:last-of-type'));
 // retour au départ, puis la solution entière
 for(let i=0;i<8;i++) await p.click('#tool-undo').catch(()=>{});
 ok('annulé jusqu’au départ',await p.evaluate(()=>window.__dt.state().off)===0);
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 let n=0;
 for(const c of sol.solution){ if(!await send(c)){ console.log('arrêt avant',c); break; } n++;
   if(c==='CLOSE SWITCH') ok('courant rétabli : lueur rouge',/lueur rouge/.test(await p.innerText('#log .turn:last-child')));
   if(n===40){
     const log=await p.innerText('#log');
     ok('journal moderne entièrement en français',!/\b(YOU ARE|YOU CAN|OK, YOU|WHAT NOW)\b/.test(log));
     await p.click('#toClassic'); const fr=await p.innerText('#cScreen'); const rows=fr.split('\n');
     ok('version classique : 16 lignes de 32 colonnes',rows.length===16&&rows.every(r=>r.length===32),rows.length+' lignes');
     ok('version classique en français',/TU ES /.test(fr)&&/SORTIES :/.test(fr)&&/ET MAINTENANT \?/.test(fr),fr.slice(-200));
     await p.click('#cLang'); const en=await p.innerText('#cScreen');
     ok('version classique anglaise : texte d’origine',/YOU ARE /.test(en)&&/YOU CAN GO:/.test(en)&&/WHAT NOW\?/.test(en));
     await p.screenshot({path:OUT+'/md-classique-en.png'});
     await p.click('#cLang'); await p.click('#cModern');
   } }
 await p.waitForTimeout(300);
 ok('solution jouée jusqu’à la victoire',n===sol.solution.length&&/sauvée/.test(await p.innerText('#overlay')),n+' / '+sol.solution.length+' : '+(await p.innerText('#overlay')).replace(/\n+/g,' | '));
 ok('le village acclame la princesse',/princesse héritière vivante/.test(await p.innerText('#log')));
 await p.screenshot({path:OUT+'/md-victoire.png'});
 // la version classique depuis le début : écran titre rouge, question des instructions, plan semi-graphique
 await p.click('#overlay button.main'); await p.waitForTimeout(300);
 await p.click('#toClassic'); await p.evaluate(()=>document.getElementById('tool-restart').click());
 await p.evaluate(()=>{ const b=[...document.querySelectorAll('#overlay button')].find(x=>/Recommencer/.test(x.innerText)); b&&b.click(); });
 await p.waitForTimeout(400);
 ok('écran titre sur fond rouge',/MANOIR MAUDIT/.test(await p.innerText('#cScreen'))&&/rgb\(2\d\d, \d+, \d+\)/.test(await p.$eval('#cScreen',e=>e.style.background)),await p.$eval('#cScreen',e=>e.style.background));
 await p.waitForTimeout(4600);
 ok('question des instructions',/DES INSTRUCTIONS \? \(O\/N\)/.test(await p.innerText('#cScreen')));
 await p.keyboard.press('n'); await p.waitForTimeout(200);
 for(const c of ['OUVRE LA PORTE','S','O','S','O','LIS LE PLAN']){ await p.keyboard.type(c); await p.keyboard.press('Enter'); await p.waitForTimeout(80); }
 await p.waitForTimeout(300);
 const sg=await p.$$eval('#cScreen .sg',l=>l.length), title=await p.innerText('#cScreen');
 ok('plan du manoir en semi-graphiques, titre chiffré en français',sg>100&&title.includes('=*]= =*['),sg+' cases');
 await p.screenshot({path:OUT+'/md-classique-plan.png'});
 await p.keyboard.press(' '); await p.waitForTimeout(200);
 await p.click('#cModern').catch(()=>{});
 // mots de passe français et fins expliquées : on place le joueur dans la situation
 const set=async(vars,arr)=>p.evaluate(([vars,arr])=>{ const d=window.__dt; const S=JSON.parse(d.m.snapshot().m); Object.assign(S.vars,vars);
   for(const [name,i,v] of arr||[]){ const k=Object.keys(S.arrs).find(x=>x===name||x.startsWith(name+'(')||x===name+'()')||name; S.arrs[k].v[i]=v; }
   d.m.restore({m:JSON.stringify(S)}); },[vars,arr]);
 const piege=async(nom,vars,c,attendu)=>{ await set(vars); const before=await p.innerText('#log .turn:last-child');
   await send(c); await p.waitForTimeout(150);
   const t=await p.innerText('#overlay').catch(()=>''), log=await p.innerText('#log .turn:last-child');
   ok(nom,attendu.test(t+' '+log),(t+' '+log).replace(/\n+/g,' | ').slice(0,220));
   if(await p.$eval('#overlay',e=>!e.hidden)) await p.click('#overlay button:has-text("Annuler")').catch(()=>{});
 };
 await piege('sables mouvants : mort expliquée',{F:70,A6:1},'S',/Tu es mort[\s\S]*sables mouvants/);
 await set({F:76}); ok('chute dans le puits : CHIEN, tapé en français, sauve',/au bord d'un puits/.test(await cmd('chien')),await p.innerText('#log .turn:last-child'));
 await piege('chute dans le puits sans le mot : écrasé',{F:76},'N',/SPLATCH|Tu es mort/);
 ok('aucune erreur JavaScript',errs.length===0,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);})();
