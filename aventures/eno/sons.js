// Eno — bruitages du salon, synthétisés comme ceux du moteur (moteur/sfx.js) : aucun fichier son.
// Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
// Le seul son du programme d'origine, le bip de l'invite (SOUND), est joué par le moteur dans les deux versions ;
// ces bruitages-ci ne jouent que dans la version moderne.
const ENO_SFX={
 // prendre et poser
 eno_take(c,o,t,H){ H.hiss(c,o,t,{dur:.14,peak:.18,type:'bandpass',f0:2600,Q:1.2,attack:.01}); },
 eno_drop(c,o,t,H){ H.tone(c,o,t,{f0:180,f1:110,dur:.18,peak:.28,attack:.003}); },
 // le tapis qu'on roule, la latte qui grince
 eno_rug(c,o,t,H){ H.hiss(c,o,t,{dur:.7,peak:.3,type:'bandpass',f0:700,f1:1400,Q:.9,attack:.2}); },
 eno_board(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=900; bp.Q.value=5; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(70,t); os.frequency.linearRampToValueAtTime(130,t+.5); os.frequency.linearRampToValueAtTime(60,t+.8);
   os.connect(H.env(c,bp,t,.05,.8,.8)); os.start(t); os.stop(t+.85); H.tone(c,o,t+.8,{f0:120,f1:70,dur:.2,peak:.3,attack:.004}); },
 // découvrir quelque chose de caché
 eno_find(c,o,t,H){ [784,988,1319].forEach((f,i)=>H.tone(c,o,t+i*.09,{f0:f,dur:.7,peak:.1,attack:.004})); },
 // une page qu'on tourne, un livre qu'on ouvre
 eno_page(c,o,t,H){ H.hiss(c,o,t,{dur:.22,peak:.25,type:'highpass',f0:2500,f1:5000,attack:.03}); H.hiss(c,o,t+.25,{dur:.12,peak:.12,type:'highpass',f0:3000,attack:.01}); },
 // les rideaux qu'on tire, les portes de la table d'appoint
 eno_curtains(c,o,t,H){ H.hiss(c,o,t,{dur:1,peak:.25,type:'bandpass',f0:1500,f1:3000,Q:.7,attack:.3}); for(let i=0;i<5;i++) H.tone(c,o,t+.1+i*.15,{type:'triangle',f0:2400,f1:2200,dur:.04,peak:.05,attack:.003}); },
 eno_doors(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:1500,dur:.02,peak:.15,attack:.001}); H.hiss(c,o,t+.05,{dur:.3,peak:.15,type:'bandpass',f0:600,Q:2,attack:.05}); },
 // le coffre-fort : le cadran qui cliquette, puis la porte
 eno_dial(c,o,t,H){ for(let i=0;i<9;i++) H.tone(c,o,t+i*.07,{type:'square',f0:2200+(i%3)*180,dur:.012,peak:.18,attack:.001}); },
 eno_safe(c,o,t,H){ ENO_SFX.eno_dial(c,o,t,H); H.tone(c,o,t+.75,{type:'square',f0:380,f1:250,dur:.08,peak:.3,attack:.001}); H.tone(c,o,t+.9,{type:'triangle',f0:140,f1:90,dur:.6,peak:.25,attack:.02});
   [523,659,784,1047].forEach((f,i)=>H.tone(c,o,t+1.3+i*.12,{f0:f,dur:1.2,peak:.1,attack:.01})); },
 // l'alarme du cambrioleur
 eno_alarm(c,o,t,H){ for(let i=0;i<6;i++) H.tone(c,o,t+i*.4,{type:'square',f0:i%2?660:880,dur:.38,peak:.12,attack:.01}); },
 // le rat qui bondit, et le cœur qui lâche
 eno_rat(c,o,t,H){ for(let i=0;i<4;i++) H.tone(c,o,t+i*.12+Math.random()*.05,{type:'triangle',f0:3200+Math.random()*900,f1:2600,dur:.08,peak:.14,attack:.005});
   for(let i=0;i<10;i++) H.hiss(c,o,t+.5+i*.04,{dur:.03,peak:.14,type:'highpass',f0:4000,attack:.002});
   for(let i=0;i<3;i++){ H.tone(c,o,t+1.2+i*.5,{f0:60,f1:40,dur:.14,peak:.5,attack:.005}); H.tone(c,o,t+1.38+i*.5,{f0:55,f1:38,dur:.12,peak:.35,attack:.005}); } },
 // l'aquarium qui éclate et inonde le salon
 eno_flood(c,o,t,H){ H.hiss(c,o,t,{dur:.2,peak:.6,type:'highpass',f0:3500,attack:.001}); [2637,3520,4186].forEach((f,i)=>H.tone(c,o,t+.02+i*.05,{f0:f,dur:.4,peak:.07,attack:.002}));
   H.hiss(c,o,t+.15,{dur:2.4,peak:.5,type:'lowpass',f0:1200,f1:300,attack:.05}); for(let i=0;i<8;i++){ const f=90+Math.random()*80; H.tone(c,o,t+.6+i*.22,{f0:f,f1:f*1.8,dur:.18,peak:.3,attack:.02}); } },
 // le court-circuit du téléviseur
 eno_zap(c,o,t,H){ for(let i=0;i<6;i++) H.hiss(c,o,t+i*.09+Math.random()*.04,{dur:.07,peak:.5,type:'highpass',f0:4000,attack:.001});
   H.tone(c,o,t,{type:'sawtooth',f0:100,dur:1,peak:.2,attack:.01}); H.tone(c,o,t,{type:'sawtooth',f0:150,f1:40,dur:1,peak:.15,attack:.01}); H.tone(c,o,t+.95,{type:'square',f0:60,f1:30,dur:.25,peak:.35,attack:.002}); },
 // la fortune : les billets, la fanfare
 eno_rich(c,o,t,H){ for(let i=0;i<10;i++) H.hiss(c,o,t+i*.06,{dur:.05,peak:.2,type:'bandpass',f0:3000,Q:1,attack:.004});
   [[523,0],[659,.15],[784,.3],[1047,.5],[784,.75],[1047,.9]].forEach(([f,d])=>H.tone(c,o,t+.7+d,{type:'square',f0:f,dur:d===.9?.9:.18,peak:.07,attack:.005}));
   for(let k=0;k<3;k++) H.hiss(c,o,t+.7+k*.15,{dur:2.2-k*.3,peak:.25,type:'bandpass',f0:900+k*500,Q:.9,attack:.25}); },
 // ambiances : l'aquarium (bulles, pompe), la télévision (souffle et voix lointaines), la pendule
 eno_tank(c,o,t,H){ H.hiss(c,o,t,{dur:2.6,peak:.08,type:'bandpass',f0:500,Q:.8,attack:.6}); for(let i=0;i<12;i++){ const f=500+Math.random()*700; H.tone(c,o,t+i*.2+Math.random()*.1,{f0:f,f1:f*1.7,dur:.05,peak:.08,attack:.004}); } },
 eno_tv(c,o,t,H){ H.hiss(c,o,t,{dur:2.6,peak:.07,type:'highpass',f0:3000,attack:.4}); [[0,140],[.5,180],[1.1,120],[1.6,200]].forEach(([d,f])=>H.tone(c,o,t+d,{type:'sawtooth',f0:f,f1:f*.9,dur:.35,peak:.03,attack:.05}));
   H.tone(c,o,t+.2,{f0:15734/16,dur:2.2,peak:.012,attack:.3}); H.tone(c,o,t+1.4,{type:'triangle',f0:880,f1:1760,dur:.8,peak:.04,attack:.1,vib:7,vibDepth:30}); },
 eno_clock(c,o,t,H){ for(let i=0;i<6;i++) H.tone(c,o,t+i*.5,{type:'square',f0:i%2?1600:1300,dur:.012,peak:.12,attack:.001}); },
 eno_street(c,o,t,H){ H.hiss(c,o,t,{dur:2.4,peak:.08,type:'bandpass',f0:300,f1:600,Q:.6,attack:.8}); [[.4,2600],[.9,2900],[1.6,2500]].forEach(([d,f])=>H.tone(c,o,t+d,{type:'triangle',f0:f,f1:f*1.2,dur:.09,peak:.05,attack:.005})); }
};
function enoSfxFor(line,cmd,mem){
  const l=line.replace(/ +/g,' '), c=cmd||'';
  if(/YOU HAVE JUST BROKEN THE TANK/.test(l)) return 'eno_flood';
  if(/SHORT-CIRCUITED/.test(l)) return 'eno_zap';
  if(/A LARGE RAT JUST JUMPED OUT/.test(l)) return 'eno_rat';
  if(/YOU ARE DEAD/.test(l)) return 'death';
  if(/WRONG NUMBER/.test(l)) return 'eno_alarm';
  if(/NOW A MILLIONAIRE/.test(l)) return 'eno_rich';
  if(/NUMBER OF (THE )?COMBINATION/.test(l)) return 'eno_dial';
  if(/^OK, IT'S OPEN/.test(l.trim())&&/^\d+$/.test(c.trim())) return 'eno_safe';
  if(/^OK, YOU HAVE IT/.test(l.trim())) return /^GET RUG/.test(c)?'eno_rug':/^GET BOA/.test(c)?'eno_board':/^GET PIC/.test(c)?'eno_find':'eno_take';
  if(/^OK, YOU DROPPED IT/.test(l.trim())) return 'eno_drop';
  if(/^OK, THEY'RE (OPEN|CLOSED)/.test(l.trim())) return /^(OPEN|CLOSE) CUR/.test(c)?'eno_curtains':'eno_doors';
  if(/^OK, IT'S (OPEN|CLOSED)/.test(l.trim())) return 'eno_page';
  if(/THERE IS A MAGAZINE UNDER IT|IT HAS 2 DOORS|THE REMAINS OF A GOLD-FISH|IT HAS A BURNED OUT BULB/.test(l)||/^BROWN$/.test(l.trim())) return 'eno_find';
  if(/^TITLE:|TO MY BELOVED CAT/.test(l.trim())) return 'eno_page';
  return null;
}
// Ambiance à l'entrée d'une case du salon (1 à 15)
function enoAmbient(mem,r){
  if(r===4||r===3) return ['eno_tank'];
  if(r===5||r===6) return ['eno_tv'];
  if(r===14) return ['eno_clock'];
  if(r===9&&mem.a('C',3)===1) return ['eno_street'];
  return [];
}
