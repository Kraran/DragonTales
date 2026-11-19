// Essai de la lecture à voix haute dans Chrome, avec une synthèse vocale simulée qui imite les voix d'Edge :
// choix de la voix (Rémy multilingue en ligne d'abord), lecture automatique de chaque réponse, arrêt à la commande
// suivante, bouton de lecture d'une entrée, réglages, musique baissée pendant la voix.
//   python build.py && node tests/essai-voix.js
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs'), path=require('path');
const PAGE='file://'+path.resolve(__dirname,'..','DragonTales.html'), OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
let bad=0; const ok=(k,v,d)=>{ if(!v) bad++; console.log((v?'ok   ':'ÉCHEC ')+k+(d!==undefined?'  → '+d:'')); };
const FAKE=()=>{
  const V=(name,lang,local)=>({name,lang,localService:local,voiceURI:name,default:false});
  const voices=[V('Microsoft Hortense - French (France)','fr-FR',true),V('Microsoft Paul - French (France)','fr-FR',true),
    V('Microsoft Denise Online (Natural) - French (France)','fr-FR',false),V('Microsoft Remy Multilingual Online (Natural) - French (France)','fr-FR',false),
    V('Microsoft Sylvie Online (Natural) - French (Canada)','fr-CA',false),V('Microsoft Zira - English (United States)','en-US',true),
    V('Microsoft Andrew Multilingual Online (Natural) - English (United States)','en-US',false)];
  const said=[]; let speaking=false, q=[];
  window.__said=said; window.__cancels=0;
  const ss={get speaking(){return speaking;},get pending(){return q.length>0;},getVoices:()=>voices,addEventListener(){},
    speak(u){ said.push({text:u.text,voice:u.voice&&u.voice.name,rate:u.rate,volume:u.volume}); q.push(u); if(!speaking) next(); },
    cancel(){ window.__cancels++; q=[]; speaking=false; }};
  function next(){ const u=q.shift(); if(!u){ speaking=false; return; } speaking=true; setTimeout(()=>{ u.onstart&&u.onstart(); setTimeout(()=>{ if(!speaking) return; u.onend&&u.onend(); next(); },1500); },10); }
  Object.defineProperty(window,'speechSynthesis',{value:ss,configurable:true});
  window.SpeechSynthesisUtterance=function(text){ this.text=text; };
};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1920,height:1080}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(FAKE);
 await p.goto(PAGE); await p.waitForTimeout(300);
 const clickOv=re=>p.evaluate(src=>{ const re=new RegExp(src); const b=[...document.querySelectorAll('#overlay button')].find(x=>re.test(x.innerText)); if(b) b.click(); return !!b; },re.source);
 const send=c=>p.evaluate(c=>{const d=window.__dt; if(d.m.wait!=='line') return false; d.send(c,c.toLowerCase()); return true;},c);
 await p.click('#shelf button.main'); await p.waitForTimeout(300);
 // réglages depuis l'introduction
 await clickOv(/^Options$/); await p.waitForTimeout(200);
 const opts=await p.evaluate(()=>({sel:[...document.querySelectorAll('.voiceSel option')].map(o=>o.textContent),cur:document.querySelector('.voiceSel').selectedOptions[0].textContent,txt:document.getElementById('overlay').innerText}));
 ok('voix proposées : Rémy multilingue en ligne en premier',opts.cur==='Rémy multilingue (en ligne)'&&opts.sel.length===5,JSON.stringify(opts.sel));
 ok('réglages : lecture, voix, vitesse, volume',/Lecture à voix haute/.test(opts.txt)&&/Vitesse/.test(opts.txt)&&/Volume de la voix/.test(opts.txt));
 await p.screenshot({path:OUT+'/voix-options.png'});
 await clickOv(/^Écouter$/); await p.waitForTimeout(100);
 let said=await p.evaluate(()=>window.__said.slice());
 ok('Écouter lit la phrase d’essai avec Rémy',said.length===1&&/Bienvenue/.test(said[0].text)&&/Remy/.test(said[0].voice),JSON.stringify(said));
 // Rémy multilingue disponible : lecture activée d'office, sans rien enregistrer ; le choix du joueur est gardé
 const tog=()=>p.evaluate(()=>[...document.querySelectorAll('.voiceOpts .optRow button')][0].innerText);
 const stored=()=>p.evaluate(()=>{ const k=Object.keys(localStorage).find(k=>k.endsWith('.voice')); return k?localStorage[k]:null; });
 ok('lecture activée par défaut avec Rémy multilingue',(await tog())==='Activée'&&(await stored())===null);
 await p.evaluate(()=>[...document.querySelectorAll('.voiceOpts .optRow button')][0].click());
 ok('désactivée par le joueur : choix gardé',(await tog())==='Désactivée'&&(await stored())==='0');
 await p.reload(); await p.waitForTimeout(300); await p.click('#shelf button.main'); await p.waitForTimeout(300);
 await clickOv(/^Options$/); await p.waitForTimeout(200);
 ok('après rechargement, le choix du joueur l’emporte',(await tog())==='Désactivée');
 await p.evaluate(()=>[...document.querySelectorAll('.voiceOpts .optRow button')][0].click());
 ok('réactivée par le joueur',(await tog())==='Activée'&&(await stored())==='1');
 await clickOv(/^Fermer$/); await p.waitForTimeout(100);
 await p.evaluate(()=>{ window.__said.length=0; });
 await clickOv(/Commencer/); await p.waitForTimeout(600);
 said=await p.evaluate(()=>window.__said.slice());
 ok('première réponse lue automatiquement',said.length>=1&&said.every(x=>/Remy/.test(x.voice)),JSON.stringify(said).slice(0,300));
 ok('le titre du lieu n’est pas lu',said.length>=1&&!/^La mare jaune/.test(said[0].text),said[0]&&said[0].text.slice(0,40));
 ok('morceaux de 220 caractères au plus',said.every(x=>x.text.length<=260),said.map(x=>x.text.length).join(','));
 const talking=await p.evaluate(()=>document.body.classList.contains('talking'));
 ok('pendant la voix, le corps porte la classe talking (musique baissée)',talking);
 const c0=await p.evaluate(()=>window.__cancels);
 await p.evaluate(()=>{ window.__said.length=0; });
 await send('LOOK'); await p.waitForTimeout(200);
 said=await p.evaluate(()=>window.__said.slice());
 ok('nouvelle commande : la lecture précédente s’arrête, la nouvelle réponse est lue',(await p.evaluate(()=>window.__cancels))>c0&&said.length>=1,JSON.stringify(said).slice(0,200));
 ok('la commande elle-même n’est pas lue',!said.some(x=>/^(regarder|look)\b/i.test(x.text)));
 // bouton d'une entrée ancienne
 await p.evaluate(()=>{ window.__said.length=0; });
 await p.hover('#log .turn:first-child'); await p.waitForTimeout(100);
 await p.click('#log .turn:first-child .say'); await p.waitForTimeout(100);
 said=await p.evaluate(()=>window.__said.slice());
 ok('bouton 🔊 : relit une ancienne entrée',said.length>=1&&(await p.evaluate(()=>!!document.querySelector('#log .turn.saying'))),JSON.stringify(said).slice(0,200)+' '+(await p.evaluate(()=>document.querySelectorAll('#log .turn').length)));
 await p.screenshot({path:OUT+'/voix-jeu.png'});
 // anglais : la voix anglaise
 await p.evaluate(()=>{ window.__said.length=0; });
 await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(x=>x.innerText==='English'); b&&b.click(); });
 await send('LOOK'); await p.waitForTimeout(200);
 said=await p.evaluate(()=>window.__said.slice());
 ok('en anglais : voix Andrew multilingue',said.length>=1&&said.every(x=>/Andrew/.test(x.voice)),JSON.stringify(said).slice(0,200));
 // sans Rémy multilingue (autre navigateur) : lecture désactivée par défaut, Hortense proposée
 const p2=await b.newPage({viewport:{width:1920,height:1080}});
 await p2.addInitScript(()=>{ const V=(name,lang)=>({name,lang,localService:true,voiceURI:name,default:false});
   const vs=[V('Microsoft Hortense - French (France)','fr-FR'),V('Microsoft Paul - French (France)','fr-FR')];
   Object.defineProperty(window,'speechSynthesis',{value:{speaking:false,pending:false,getVoices:()=>vs,addEventListener(){},speak(){},cancel(){}},configurable:true});
   window.SpeechSynthesisUtterance=function(t){ this.text=t; }; });
 await p2.goto(PAGE); await p2.waitForTimeout(300);
 await p2.evaluate(()=>localStorage.clear()); await p2.reload(); await p2.waitForTimeout(300);
 await p2.click('#shelf button.main'); await p2.waitForTimeout(300);
 await p2.evaluate(()=>{ const b=[...document.querySelectorAll('#overlay button')].find(x=>x.innerText==='Options'); b.click(); }); await p2.waitForTimeout(200);
 const r2=await p2.evaluate(()=>({tog:[...document.querySelectorAll('.voiceOpts .optRow button')][0].innerText,cur:document.querySelector('.voiceSel').selectedOptions[0].textContent}));
 ok('sans Rémy multilingue : lecture désactivée par défaut',r2.tog==='Désactivée'&&r2.cur==='Hortense',JSON.stringify(r2));
 ok('aucune erreur JavaScript',!errs.length,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);
})();
