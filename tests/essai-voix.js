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
 // activer la lecture
 await p.evaluate(()=>{ const b=[...document.querySelectorAll('.voiceOpts .optRow button')][0]; b.click(); });
 ok('lecture activée et gardée',await p.evaluate(()=>Object.keys(localStorage).some(k=>k.endsWith('.voice')&&localStorage[k]==='1')));
 await clickOv(/^Fermer$/); await p.waitForTimeout(100);
 await p.evaluate(()=>{ window.__said.length=0; });
 await clickOv(/Commencer/); await p.waitForTimeout(600);
 said=await p.evaluate(()=>window.__said.slice());
 ok('première réponse lue automatiquement',said.length>=1&&said.every(x=>/Remy/.test(x.voice)),JSON.stringify(said).slice(0,300));
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
 ok('aucune erreur JavaScript',!errs.length,JSON.stringify(errs));
 await b.close(); console.log(bad?bad+' échec(s)':'tout est bon'); process.exit(bad?1:0);
})();
