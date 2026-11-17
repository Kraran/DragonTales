// Capture des images de la bande-annonce DragonTales (1920×1080, JPEG 92). Écrit /tmp/tr/f/<plan>/NNNN.jpg et /tmp/tr/shots.json
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require('/opt/npm-tools/node_modules/playwright')); }
const fs=require('fs');
const PAGE='file:///home/claude/dragontales/DragonTales.html';
const sol=require('/home/claude/dragontales/tests/charger.js')('eldiablero').solution;
const FPS=30, OUT='/tmp/tr/f';
const shots={}; let cur=null, n=0, page=null;
function begin(name){ cur=name; shots[name]=[]; n=0; fs.mkdirSync(`${OUT}/${name}`,{recursive:true}); }
async function snap(sec){ const f=`${OUT}/${cur}/${String(n++).padStart(4,'0')}.jpg`; await page.screenshot({path:f,type:'jpeg',quality:92}); shots[cur].push([f,Math.max(1,Math.round(sec*FPS))]); }
const CSS=`
#trCap{position:fixed;left:0;right:0;top:0;height:210px;z-index:9999;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:44px;
 background:linear-gradient(rgba(10,7,14,.96),rgba(10,7,14,.85) 50%,rgba(10,7,14,0))}
#trCap b{font:italic 400 60px/1.1 var(--serif);color:var(--os);text-shadow:0 2px 14px #000}
#trCap i{display:block;width:110px;height:3px;background:var(--souci);margin-top:20px;border-radius:2px}
#trCard{position:fixed;inset:0;z-index:10000;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
#trCard .lg{font-size:190px;line-height:1}
#trCard .lg .d{font-family:var(--sans);font-weight:800;letter-spacing:-6px;background:linear-gradient(90deg,#e5231b 0%,#f47b20 22%,#ffd400 45%,#3aa935 68%,#1c8fd6 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
#trCard .lg .t{font-family:var(--serif);font-style:italic;color:var(--os);margin-left:14px}
#trCard p{font:40px/1.4 var(--serif);color:var(--sable);margin:34px 0 0}
#trCard p.big{font:italic 64px/1.3 var(--serif);color:var(--os);margin:0}
#trCard p.small{font:30px/1.4 var(--sans);color:var(--sourd);margin-top:22px}
#trCard p.url{font:34px/1.4 var(--sans);color:var(--souci);margin-top:60px;letter-spacing:.5px}
`;
async function prep(){ await page.addStyleTag({content:CSS}); await page.addStyleTag({content:'.cursor,#in{caret-color:transparent} *{scrollbar-width:none} ::-webkit-scrollbar{display:none}'}); }
async function cap(text){ await page.evaluate(t=>{ let c=document.getElementById('trCap'); if(!t){ if(c) c.remove(); return; } if(!c){ c=document.createElement('div'); c.id='trCap'; document.body.appendChild(c); } c.innerHTML='<b></b><i></i>'; c.firstChild.textContent=t; },text||''); }
async function card(html){ await page.evaluate(h=>{ let c=document.getElementById('trCard'); if(!h){ if(c) c.remove(); return; } if(!c){ c=document.createElement('div'); c.id='trCard'; document.body.appendChild(c); } c.innerHTML=h; },html||''); }
const LOGO='<div class="lg"><span class="d">Dragon</span><span class="t">Tales</span></div>';
async function silent(cmds){ for(const c of cmds) await page.evaluate(c=>window.__dt.send(c,window.__dt.rev(c)),c); await page.waitForTimeout(150); }
async function type(txt,hold){ await page.click('#in'); for(const ch of txt){ await page.keyboard.type(ch); await snap(ch===' '?.05:.075); } await snap(.35); await page.keyboard.press('Enter'); await page.waitForTimeout(420); await snap(hold); }
async function fresh(id){ // page neuve, aventure choisie et son écran d'introduction ouvert
  await page.goto(PAGE); await page.evaluate(()=>{ localStorage.clear(); sessionStorage.clear(); }); await page.goto(PAGE); await page.waitForTimeout(500); await prep();
}
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 page=await b.newPage({viewport:{width:1920,height:1080}});
 await fresh();
 // 1-2. cartes d'ouverture
 begin('c1'); await card('<p class="big">1982. Sur Dragon 32,<br>on jouait avec des mots.</p>'); await snap(1);
 begin('c2'); await card(LOGO+'<p>Les aventures textuelles du Dragon 32/64,<br>traduites et illustrées</p>'); await snap(1);
 await card('');
 // 3. l'étagère qui défile (pas à pas), puis retour sur El Diablero
 begin('shelf');
 const max=await page.evaluate(()=>{ const r=document.querySelector('.shRow'); r.style.scrollBehavior='auto'; return r.scrollWidth-r.clientWidth; });
 await snap(.8);
 const steps=Math.round(2.2*FPS);
 for(let i=1;i<=steps;i++){ const k=i/steps, e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; await page.evaluate(x=>{ document.querySelector('.shRow').scrollLeft=x; },max*e); await snap(1/FPS); }
 await snap(.6);
 for(let i=1;i<=steps;i++){ const k=i/steps, e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; await page.evaluate(x=>{ document.querySelector('.shRow').scrollLeft=x; },max*(1-e)); await snap(1/FPS); }
 await snap(.9);
 // 4. écran d'introduction d'El Diablero
 await page.click('#shelf button.main'); await page.waitForTimeout(600);
 begin('introED'); await snap(1);
 await page.click('#overlay button:has-text("Commencer")'); await page.waitForTimeout(500);
 // 5. le désert : on tape en français
 begin('desert'); await cap('Traduites en français'); await snap(.8);
 await type('ouest',1.1); await type('ouest',1.1); await silent(sol.slice(2,4)); await snap(.5); await type('va au sud',1.6);
 // 6. le canyon
 await silent(sol.slice(5,18));
 begin('canyon'); await cap('Une illustration pour chaque lieu'); await snap(.6);
 await type('est',1.0); await silent(sol.slice(19,22)); await snap(.9); await type("regarde l'inscription",2.0);
 // 7. la cabane
 await silent(sol.slice(23,47));
 begin('cabane'); await cap('Un désert à explorer…'); await snap(.6);
 await type('est',1.0); await type('est',.9); await type('regarde la fenêtre',2.2);
 // 8. l'homme à la machette
 await silent(sol.slice(50,96));
 begin('machette'); await cap('… et ses mystères'); await snap(.5); await type('va au sud',2.6);
 // 9. la carte
 await silent(sol.slice(97,123));
 begin('carte'); await cap('Une carte qui se dessine à mesure que tu avances'); await page.click('#mapBig'); await page.waitForTimeout(500); await snap(1);
 await page.click('#bigmap button.main').catch(()=>page.keyboard.press('Escape')); await page.waitForTimeout(300);
 // 10. une pièce magique
 await silent(sol.slice(123,136));
 begin('piece'); await cap('Trois pièces magiques pour un coup de pouce'); await snap(.8);
 await page.click('#inv .coin'); await page.waitForTimeout(450); await snap(1.6);
 await page.click('#overlay button.main'); await page.waitForTimeout(500); await snap(2.4);
 // 11. la version classique
 begin('classique'); await cap("Et l'écran d'origine, à un clic"); await page.click('#toClassic'); await page.waitForTimeout(400); await snap(.6);
 await page.click('#cScreen').catch(()=>{}); for(const ch of 'REGARDE'){ await page.keyboard.type(ch); await snap(.09); } await page.keyboard.press('Enter'); await page.waitForTimeout(300); await snap(2.2);
 await cap('');
 // 12. carte : d'autres aventures
 begin('c3'); await card('<p class="big">Et d’autres aventures<br>vous attendent sur l’étagère</p>'); await snap(1); await card('');
 // 13-14. écrans d'introduction de Dragon Mountain et de Poseidon
 for(const [id,shot] of [['Dragon Mountain','introDM'],['Poseidon','introPS']]){
   await fresh();
   for(let i=0;i<6&&!(await page.innerText('.shInfo h2')).includes(id);i++) await page.keyboard.press('ArrowRight');
   await page.click('#shelf button.main'); await page.waitForTimeout(400);
   if(!page.url().includes('xx')) await page.waitForTimeout(800);
   if(!(await page.$('#overlay:not([hidden])'))){ await page.waitForTimeout(1200); }
   await prep(); begin(shot); await snap(1);
 }
 // 15. carte de fin
 begin('fin'); await card(LOGO+'<p>Rejoue les aventures du Dragon 32, en français,<br>directement dans ton navigateur.</p><p class="small">De nouvelles aventures rejoignent l’étagère au fil du temps.</p><p class="url">github.com/Kraran/DragonTales</p>'); await snap(1);
 fs.writeFileSync('/tmp/tr/shots.json',JSON.stringify(shots));
 for(const k in shots) console.log(k,shots[k].length,(shots[k].reduce((a,x)=>a+x[1],0)/FPS).toFixed(2)+'s');
 await b.close();
})();
