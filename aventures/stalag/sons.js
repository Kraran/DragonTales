// Stalag — bruitages du camp, synthétisés comme ceux du moteur (moteur/sfx.js) : aucun fichier son.
// Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
// Les sons du programme d'origine (le déclic du mitard, le grondement des avions, les bombes, la clôture électrique,
// l'éboulement) sont joués par le moteur dans les deux versions ; ces bruitages-ci ne jouent que dans la version moderne.
const SG_SFX={
 // prendre et poser
 sg_take(c,o,t,H){ H.hiss(c,o,t,{dur:.14,peak:.18,type:'bandpass',f0:2400,Q:1.2,attack:.01}); },
 sg_drop(c,o,t,H){ H.tone(c,o,t,{f0:170,f1:100,dur:.18,peak:.28,attack:.003}); H.hiss(c,o,t,{dur:.12,peak:.12,type:'lowpass',f0:900,attack:.002}); },
 // découvrir quelque chose de caché
 sg_find(c,o,t,H){ [659,880,1175].forEach((f,i)=>H.tone(c,o,t+i*.09,{f0:f,dur:.7,peak:.1,attack:.004})); },
 // les serrures : le cadenas à clé, les gorges du cadenas à combinaison
 sg_unlock(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:1900,dur:.015,peak:.2,attack:.001}); H.hiss(c,o,t+.04,{dur:.1,peak:.2,type:'bandpass',f0:3000,Q:3,attack:.003}); H.tone(c,o,t+.18,{type:'square',f0:900,f1:600,dur:.04,peak:.3,attack:.001}); },
 sg_dial(c,o,t,H){ for(let i=0;i<12;i++) H.tone(c,o,t+i*.06,{type:'square',f0:2100+(i%4)*160,dur:.012,peak:.16,attack:.001}); H.tone(c,o,t+.85,{type:'square',f0:700,f1:420,dur:.05,peak:.3,attack:.001}); },
 sg_locked(c,o,t,H){ for(let i=0;i<3;i++) H.tone(c,o,t+i*.11,{type:'square',f0:320,f1:260,dur:.05,peak:.22,attack:.001}); },
 // une porte de bois qui s'ouvre en grinçant
 sg_door(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1100; bp.Q.value=6; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(90,t); os.frequency.linearRampToValueAtTime(160,t+.6); os.frequency.linearRampToValueAtTime(110,t+1);
   os.connect(H.env(c,bp,t,.08,1,.7)); os.start(t); os.stop(t+1.05); H.tone(c,o,t+1,{f0:110,f1:70,dur:.25,peak:.3,attack:.004}); },
 // la boîte de jambon à l'ouvre-boîte
 sg_tin(c,o,t,H){ for(let i=0;i<8;i++) H.tone(c,o,t+i*.1,{type:'square',f0:2600+(i%2)*300,dur:.03,peak:.12,attack:.001}); H.hiss(c,o,t+.85,{dur:.15,peak:.15,type:'highpass',f0:3500,attack:.01}); },
 // le chien : grognement, morsure, festin
 sg_growl(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:85,f1:70,dur:1.1,peak:.25,attack:.15,vib:22,vibDepth:12}); H.hiss(c,o,t,{dur:1.1,peak:.12,type:'bandpass',f0:400,Q:2,attack:.2}); },
 sg_bite(c,o,t,H){ for(let i=0;i<3;i++) H.tone(c,o,t+i*.18,{type:'sawtooth',f0:420,f1:260,dur:.12,peak:.3,attack:.003});
   SG_SFX.sg_growl(c,o,t+.55,H); H.tone(c,o,t+.6,{type:'triangle',f0:880,f1:520,dur:.5,peak:.1,attack:.02}); },
 sg_eat(c,o,t,H){ for(let i=0;i<9;i++) H.hiss(c,o,t+i*.16+Math.random()*.05,{dur:.06,peak:.18,type:'bandpass',f0:700+Math.random()*500,Q:2,attack:.004}); },
 // les ciseaux, le laçage qu'on coupe
 sg_cut(c,o,t,H){ for(let i=0;i<2;i++){ H.hiss(c,o,t+i*.22,{dur:.08,peak:.3,type:'highpass',f0:4200,attack:.002}); H.tone(c,o,t+i*.22,{type:'square',f0:3000,dur:.02,peak:.08,attack:.001}); } },
 // pousser un lit, les carreaux, les planches
 sg_scrape(c,o,t,H){ H.hiss(c,o,t,{dur:.8,peak:.3,type:'bandpass',f0:500,f1:900,Q:1.5,attack:.1}); H.tone(c,o,t+.75,{f0:120,f1:80,dur:.2,peak:.3,attack:.004}); },
 sg_tiles(c,o,t,H){ for(let i=0;i<3;i++) H.tone(c,o,t+i*.13,{type:'triangle',f0:1500-i*120,dur:.08,peak:.16,attack:.002}); },
 sg_boards(c,o,t,H){ SG_SFX.sg_door(c,o,t,H); SG_SFX.sg_find(c,o,t+1.2,H); },
 // la pelle et la pioche
 sg_dig(c,o,t,H){ for(let i=0;i<4;i++){ H.tone(c,o,t+i*.35,{type:'square',f0:900,f1:500,dur:.03,peak:.18,attack:.001}); H.hiss(c,o,t+i*.35+.03,{dur:.22,peak:.22,type:'lowpass',f0:900,attack:.01}); } },
 // le tunnel percé : la lumière du jour et la forêt
 sg_light(c,o,t,H){ SG_SFX.sg_dig(c,o,t,H); [523,659,784,1047].forEach((f,i)=>H.tone(c,o,t+1.5+i*.14,{f0:f,dur:1.4,peak:.08,attack:.02})); },
 sg_free(c,o,t,H){ [[784,0],[988,.18],[1175,.36],[1568,.6]].forEach(([f,d])=>H.tone(c,o,t+d,{type:'triangle',f0:f,dur:d===.6?1.4:.2,peak:.1,attack:.005}));
   for(let i=0;i<8;i++){ const f=2800+Math.random()*1500; H.tone(c,o,t+1.2+i*.22+Math.random()*.1,{type:'triangle',f0:f,f1:f*1.25,dur:.08,peak:.05,attack:.004}); } },
 // ambiances : le vent sur la place, le bourdonnement de la clôture, la goutte des douches, le poêle, le tunnel
 sg_wind(c,o,t,H){ H.hiss(c,o,t,{dur:2.6,peak:.09,type:'bandpass',f0:350,f1:600,Q:.6,attack:.9}); },
 sg_hum(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:50,dur:2.4,peak:.035,attack:.5}); H.tone(c,o,t,{type:'sawtooth',f0:100,dur:2.4,peak:.02,attack:.5});
   for(let i=0;i<3;i++) H.hiss(c,o,t+.3+i*.7+Math.random()*.2,{dur:.04,peak:.08,type:'highpass',f0:5000,attack:.002}); },
 sg_drip(c,o,t,H){ for(let i=0;i<5;i++){ const f=1100+Math.random()*500; H.tone(c,o,t+i*.5+Math.random()*.1,{f0:f,f1:f*1.8,dur:.06,peak:.07,attack:.003}); } },
 sg_stove(c,o,t,H){ H.hiss(c,o,t,{dur:2.5,peak:.06,type:'lowpass',f0:700,attack:.6}); for(let i=0;i<7;i++) H.hiss(c,o,t+Math.random()*2.3,{dur:.02,peak:.1,type:'highpass',f0:3000,attack:.001}); },
 sg_earth(c,o,t,H){ H.hiss(c,o,t,{dur:2.6,peak:.05,type:'lowpass',f0:300,attack:1}); for(let i=0;i<3;i++) H.hiss(c,o,t+.4+i*.7+Math.random()*.3,{dur:.25,peak:.05,type:'bandpass',f0:1500,Q:1,attack:.05}); SG_SFX.sg_drip(c,o,t+1,H); },
 sg_birds(c,o,t,H){ for(let i=0;i<6;i++){ const f=2600+Math.random()*1600; H.tone(c,o,t+i*.38+Math.random()*.15,{type:'triangle',f0:f,f1:f*1.3,dur:.09,peak:.05,attack:.004}); H.tone(c,o,t+i*.38+.11,{type:'triangle',f0:f*1.2,f1:f,dur:.07,peak:.04,attack:.004}); } }
};
function sgSfxFor(line,cmd,mem){
  const l=line.replace(/ +/g,' ').trim(), c=cmd||'';
  if(/YOU MADE IT IN TIME/.test(l)) return 'sg_free';
  if(/BLED TO DEATH|YOUR OWN GRAVE|HIT THE CAMP|FRIED ON THE FENCE|RADIO ELECTRICITY|NO LIFE/.test(l)) return 'death';
  if(/A DOG JUST RAN OUT/.test(l)) return 'sg_bite';
  if(/THE DOG GRABBED THE HAM/.test(l)) return 'sg_eat';
  if(/THE DOG (TOOK IT|WON'T GIVE)/.test(l)) return 'sg_growl';
  if(/SEE A LIGHT ABOVE/.test(l)) return 'sg_light';
  if(/^(OK, YOU DUG|YOU DUG, AND)/.test(l)) return 'sg_dig';
  if(/THE TUMBLERS CLICKED/.test(l)) return 'sg_dial';
  if(/THE LOCK DID NOT OPEN|ALI BABA|LOCKED WITH A PADLOCK ON IT/.test(l)) return 'sg_locked';
  if(/^IT UNLOCKED|LOCKED AGAIN/.test(l)) return 'sg_unlock';
  if(/^OK, IT'?S? (IS )?OPEN|^OK, IT IS OPEN|^OK, IT'S OPEN/.test(l)) return /^OPEN (DOO|GAT)/.test(c)?'sg_door':'sg_take';
  if(/^OK, IT('S| IS) CLOSED/.test(l)) return 'sg_drop';
  if(/^YOU OPENED IT/.test(l)) return 'sg_tin';
  if(/^OK, YOU CUT IT/.test(l)) return 'sg_cut';
  if(/ONE OF ?THE BEDS FINALLY MOVED|PUSHED IT, AND IT MOVED/.test(l)) return 'sg_scrape';
  if(/YOU SEE AN OPENING/.test(l)) return 'sg_boards';
  if(/^OK, YOU (HAVE IT|GOT THEM)/.test(l)) return /^GET TIL/.test(c)?'sg_tiles':'sg_take';
  if(/^OK, YOU DROPPED IT/.test(l)) return 'sg_drop';
  if(/^YOU('VE)? FOUND|^THERE IS .* (INSIDE|IN IT|UNDERNEATH)|IT IS OPEN, AND YOU FOUND/.test(l)) return 'sg_find';
  return null;
}
// Ambiance à l'entrée d'un lieu (1 à 34)
function sgAmbient(mem,r){
  const live=mem.a('C',10)!==1;
  if(r===33) return ['sg_birds'];
  if(r>=18&&r<=26) return live?['sg_hum','sg_wind']:['sg_wind'];
  if(r>=4&&r<=8||r===14) return ['sg_wind'];
  if(r===16) return mem.a('C',3)===1?['sg_eat']:['sg_growl'];
  if(r===11) return ['sg_drip'];
  if(r===13) return ['sg_stove'];
  if(r>=27&&r<=30||r===34) return ['sg_earth'];
  if(r===32&&live) return ['sg_hum'];
  return [];
}
