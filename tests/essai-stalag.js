// Essai de Stalag dans Chrome : étagère, introduction, une mort (la radio), partie entière en français jusqu'à la
// victoire (graine sans bombardement), une pièce magique, textes traduits, aucune erreur JavaScript.
//   python build.py && node tests/essai-stalag.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const adv=require('./charger.js')('stalag');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const clickOv=re=>p.evaluate(src=>{ const re=new RegExp(src); const b=[...document.querySelectorAll('#overlay button')].find(x=>re.test(x.innerText)); if(b) b.click(); return !!b; },re.source);
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 const type=async c=>{ if(!await p.evaluate(()=>window.__dt.m.wait==='line')) return false; await p.fill('#in',c); await p.press('#in','Enter'); await p.waitForTimeout(30); return true; };
 const log=()=>p.innerText('#log');
 await p.goto(PAGE+'#graine='+adv.seed); await p.waitForTimeout(300);
 for(let i=0;i<9&&!/^Stalag$/.test(await p.innerText('.shInfo h2'));i++) await p.keyboard.press('ArrowRight');
 ok('étagère : Stalag',/Paul Austin et Leroy C\. Smith/.test(await p.innerText('.shInfo'))&&/Fins découvertes : 0 sur 7/.test(await p.innerText('.shInfo')));
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 ok('introduction',/1944/.test(await p.innerText('#overlay')));
 await clickOv(/Commencer/); await p.waitForTimeout(500);
 ok('premier lieu : le mitard',/Le mitard/.test(await p.innerText('body'))&&/Tu es au mitard/.test(await log()));
 // une mort : la radio branchée de la baraque des gardes
 await type('CROCHETER LA SERRURE'); await send('S'); await type('EXAMINER LA CAISSE'); await type('PRENDRE LA RADIO');
 await p.waitForTimeout(400);
 let t=await p.innerText('#overlay');
 ok('mort : la radio',/Tu es mort/.test(t)&&/électrocuté par la radio/.test(t)&&/La radio/.test(t),t.replace(/\n+/g,' | ').slice(0,200));
 await clickOv(/Recommencer/); await p.waitForTimeout(500);
 // une pièce magique au départ : l'inventaire (l'aiguille)
 await p.click('.coin'); await p.click('#overlay button.main'); await p.waitForTimeout(100);
 ok('pièce magique : fais l’inventaire',/Fais l’inventaire/.test(await p.innerText('#log .turn.hint:last-of-type')),await p.innerText('#log .turn.hint:last-of-type'));
 const FRC={'PICK HOLE':'CROCHETER LE TROU DE SERRURE','EXAMINE JACKET':'EXAMINER LE BLOUSON','OPEN LOCK':'OUVRIR LE CADENAS A COMBINAISON','GET CANOPENER':'PRENDRE L OUVRE-BOITE',
  'GET AXE':'PRENDRE LA PIOCHE','EXAMINE TABLE':'EXAMINER LA TABLE','DROP HAM':'DONNER LE JAMBON AU CHIEN','CUT LACING':'COUPER LE LACET','PUSH BEDS':'POUSSER LES LITS','DIG TUNNEL':'CREUSER LE TUNNEL'};
 let n=0; for(const c of adv.solution){ if(!(FRC[c]?await type(FRC[c]):await send(c))) break; n++; if(c==='DROP HAM') await p.screenshot({path:OUT+'/stalag-jeu.png'}); if(c==='GET BOARDS') await p.screenshot({path:OUT+'/stalag-baraque3.png'}); }
 await p.waitForTimeout(400);
 const L=await log(); t=await p.innerText('#overlay');
 ok('solution jouée jusqu’au bout',n===adv.solution.length,n+'/'+adv.solution.length);
 console.log(L.split('\n').filter(x=>/matricule|gorges|lumière/.test(x)).join(' // '));
 ok('textes en français',/matricule C660723/.test(L)&&/Les gorges du cadenas cliquettent/.test(L)&&/tu vois enfin de la lumière/.test(L));
 ok('victoire',/Tu es sorti du camp/.test(t)&&/La forêt/.test(t),t.replace(/\n+/g,' | ').slice(0,200));
 await p.screenshot({path:OUT+'/stalag-victoire.png'});
 ok('aucune erreur JavaScript',!errs.length,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);
})();
