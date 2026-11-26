// Essai de Madness and the Minotaur dans Chrome : étagère, introduction, choix du niveau, un abandon (UNCLE), partie
// entière au niveau débutant jusqu'à la victoire (graine 7, quelques commandes tapées en français), textes traduits,
// aucune erreur JavaScript.
//   python build.py && node tests/essai-madness.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const adv=require('./charger.js')('madness');
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const clickOv=re=>p.evaluate(src=>{ const re=new RegExp(src); const b=[...document.querySelectorAll('#overlay button')].find(x=>re.test(x.innerText)); if(b) b.click(); return !!b; },re.source);
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 const type=async c=>{ if(!await p.evaluate(()=>window.__dt.m.wait==='line')) return false; await p.fill('#in',c); await p.press('#in','Enter'); await p.waitForTimeout(30); return true; };
 const log=()=>p.innerText('#log');
 await p.goto(PAGE+'#graine='+adv.seed); await p.waitForTimeout(300);
 for(let i=0;i<10&&!/Minotaur/.test(await p.innerText('.shInfo h2'));i++) await p.keyboard.press('ArrowRight');
 ok('étagère : Madness and the Minotaur',/Tom Rosenbaum/.test(await p.innerText('.shInfo'))&&/Fins découvertes : 0 sur 8/.test(await p.innerText('.shInfo')));
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 ok('introduction',/Minos/.test(await p.innerText('#overlay')));
 await clickOv(/Commencer/); await p.waitForTimeout(500);
 ok('choix du niveau',/Choisis ton niveau/.test(await p.innerText('#overlay'))&&/Débutant/.test(await p.innerText('#overlay')));
 await clickOv(/Normal/); await p.waitForTimeout(400);
 ok('premier lieu : la bibliothèque',/Petite bibliothèque/.test(await p.innerText('body'))&&/Tu es dans une petite bibliothèque/.test(await log()));
 // un abandon
 await type('ABANDONNER'); await p.waitForTimeout(400);
 let t=await p.innerText('#overlay');
 ok('fin : l’abandon',/L’abandon/.test(t)&&/Tu t’es bien battu/.test(t),t.replace(/\n+/g,' | ').slice(0,200));
 await clickOv(/Recommencer/); await p.waitForTimeout(500);
 await clickOv(/Débutant/); await p.waitForTimeout(400);
 // deux pièces magiques au départ : la lampe, puis l'endroit où elle est dans cette partie (lu dans la mémoire du jeu)
 const coin=async()=>{ await p.click('.coin'); await p.click('#overlay button.main'); await p.waitForTimeout(100); return p.innerText('#log .turn.hint:last-of-type'); };
 let h1=await coin(), h2=await coin();
 ok('pièces magiques : la lampe et où elle est',/Une lampe traîne/.test(h1)&&/La lampe est ici : .+ \(étage 1\)/.test(h2),h1+' | '+h2);
 const FRC={'GET LAMP':'PRENDRE LA LAMPE','LAMP ON':'ALLUMER LA LAMPE','EAT FOOD':'MANGER LA NOURRITURE','KILL NYMPH':'TUER LA NYMPHE','GET POWERRING':'PRENDRE L ANNEAU DE PUISSANCE','OPEN CRYPT':'OUVRIR LA CRYPTE'};
 let n=1, L1=''; for(const c of adv.solution.slice(1)){ if(!(FRC[c]?await type(FRC[c]):await send(c))) break; n++; if(n===120) L1=await log(); if(n===400) await p.screenshot({path:OUT+'/madness-jeu.png'}); }
 await p.waitForTimeout(400);
 const L=await log(); t=await p.innerText('#overlay');
 ok('solution jouée jusqu’au bout',n===adv.solution.length,n+'/'+adv.solution.length);
 ok('textes en français',/Tu connais désormais le secret du sortilège VETAR/.test(L1)&&/Tu découvriras celui du sortilège suivant si tu possèdes le parchemin/.test(L1)&&/Félicitations/.test(L)&&/Tu as gagné/.test(L),L.slice(-200).replace(/\n/g,' | '));
 ok('victoire',/Tu es sorti du labyrinthe/.test(t)&&/La forêt/.test(t),t.replace(/\n+/g,' | ').slice(0,200));
 await p.screenshot({path:OUT+'/madness-victoire.png'});
 ok('aucune erreur JavaScript',!errs.length,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);
})();
