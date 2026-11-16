// Dragon Mountain — effets sonores propres à l'aventure, synthétisés comme ceux du moteur (moteur/sfx.js) :
// aucun fichier son. Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
const DM_SFX={
 // le dragon surgit : grondement qui monte, souffle, cri
 dm_roar(c,o,t,H){ const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(300,t); lp.frequency.linearRampToValueAtTime(1400,t+.5); lp.frequency.exponentialRampToValueAtTime(250,t+2); lp.connect(o);
   const am=c.createGain(); am.gain.value=.6; am.connect(lp); const l=c.createOscillator(); l.frequency.value=28; const lg=c.createGain(); lg.gain.value=.35; l.connect(lg); lg.connect(am.gain); l.start(t); l.stop(t+2.1);
   [72,107,143].forEach((f,i)=>H.tone(c,am,t,{type:'sawtooth',f0:f*.8,f1:f*.55,dur:2.2,peak:.5-i*.1,attack:.2}));
   H.hiss(c,o,t+.05,{dur:1.8,peak:.45,type:'bandpass',f0:500,f1:250,Q:1.2,attack:.2});
   H.tone(c,o,t+.35,{type:'sawtooth',f0:420,f1:180,dur:1.1,peak:.08,attack:.1,vib:9,vibDepth:30}); },
 // le démon : accord grave et dissonant, puis un ricanement
 dm_demon(c,o,t,H){ [55,58.3,82.4].forEach(f=>H.tone(c,o,t,{type:'sawtooth',f0:f,dur:2.4,peak:.13,attack:.9}));
   H.hiss(c,o,t,{dur:2.2,peak:.12,f0:220,attack:.8});
   for(let i=0;i<5;i++) H.tone(c,o,t+1+i*.17,{type:'triangle',f0:190-i*14,f1:150-i*14,dur:.14,peak:.22,attack:.01,vib:30,vibDepth:25}); },
 // un elfe : notes cristallines et frémissement
 dm_elf(c,o,t,H){ [1568,1976,2349,2637,3136,2637].forEach((f,i)=>H.tone(c,o,t+i*.07,{f0:f,dur:.5,peak:.1,attack:.003}));
   H.hiss(c,o,t,{dur:.9,peak:.06,type:'highpass',f0:6000,attack:.1}); },
 // le combat : lames qui s'entrechoquent
 dm_clash(c,o,t,H){ [0,.32,.55].forEach((d,k)=>{ H.hiss(c,o,t+d,{dur:.06,peak:.4,type:'highpass',f0:3000,attack:.001});
   [1180,1730,2490,3310].forEach((f,i)=>H.tone(c,o,t+d,{type:'sine',f0:f*(1+k*.03),dur:.7-i*.12,peak:.09,attack:.001})); }); },
 // un gardien abattu : râle qui s'éteint, puis la chute
 dm_slain(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:150,f1:38,dur:1.4,peak:.22,attack:.05,vib:14,vibDepth:12});
   H.hiss(c,o,t,{dur:1.2,peak:.16,type:'bandpass',f0:600,f1:150,attack:.05});
   H.tone(c,o,t+1.3,{f0:70,f1:30,dur:.5,peak:.5,attack:.002}); H.hiss(c,o,t+1.3,{dur:.3,peak:.3,f0:400,attack:.002}); },
 // l'elfe s'enfuit : pas qui s'éloignent
 dm_fled(c,o,t,H){ for(let i=0;i<7;i++) H.hiss(c,o,t+i*.16,{dur:.08,peak:1.1*(1-i/8),type:'lowpass',f0:700,attack:.002}); },
 // la porte de bois s'ouvre en grinçant
 dm_creak(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=900; bp.Q.value=6; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(140,t); os.frequency.linearRampToValueAtTime(240,t+.5); os.frequency.linearRampToValueAtTime(120,t+1.1);
   const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=22; lg.gain.value=40; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t+1.2);
   os.connect(H.env(c,bp,t,.08,.5,1.15)); os.start(t); os.stop(t+1.2); H.tone(c,o,t+1.1,{f0:90,f1:60,dur:.3,peak:.3}); },
 // une porte noire cède à la formule : magie, puis la pierre qui roule
 dm_spelldoor(c,o,t,H){ [523,659,784,1047].forEach((f,i)=>H.tone(c,o,t+i*.12,{type:'triangle',f0:f,dur:1.2,peak:.12,attack:.05,vib:6,vibDepth:8}));
   H.hiss(c,o,t+.5,{dur:1.6,peak:.35,f0:180,attack:.3}); H.tone(c,o,t+.5,{f0:55,f1:40,dur:1.5,peak:.35,attack:.3}); },
 // la clé tourne dans la serrure
 dm_key(c,o,t,H){ [0,.22].forEach((d,i)=>{ H.hiss(c,o,t+d,{dur:.05,peak:.45,type:'highpass',f0:2500,attack:.001}); H.tone(c,o,t+d,{type:'square',f0:i?1900:2400,dur:.06,peak:.08,attack:.001}); }); H.tone(c,o,t+.3,{f0:180,dur:.12,peak:.25,attack:.002}); },
 // manger
 dm_crunch(c,o,t,H){ for(let i=0;i<5;i++) H.hiss(c,o,t+i*.2+(i%2)*.04,{dur:.1,peak:.8,type:'bandpass',f0:1800+i*300,Q:1.5,attack:.003}); },
 // boire
 dm_gulp(c,o,t,H){ for(let i=0;i<3;i++){ H.tone(c,o,t+i*.32,{f0:320,f1:140,dur:.16,peak:.35,attack:.01}); H.hiss(c,o,t+i*.32,{dur:.1,peak:.08,f0:700,attack:.01}); } },
 // dormir : deux ronflements
 dm_snore(c,o,t,H){ [0,1.5].forEach(d=>{ H.hiss(c,H.swell(c,o,t+d,1.2,.9),t+d,{dur:1.2,peak:.9,f0:260,attack:.4}); H.tone(c,o,t+d,{type:'sawtooth',f0:85,f1:70,dur:1.1,peak:.08,attack:.4,vib:24,vibDepth:10}); }); },
 // le froid : un vent glacé
 dm_wind(c,o,t,H){ const n=H.noiseSrc(c), f=c.createBiquadFilter(); f.type='bandpass'; f.Q.value=4; f.frequency.setValueAtTime(400,t); f.frequency.linearRampToValueAtTime(1100,t+1.2); f.frequency.linearRampToValueAtTime(350,t+2.6);
   n.connect(f); f.connect(H.swell(c,o,t,2.7,.5)); n.start(t); n.stop(t+2.8); },
 // la faim, la soif
 dm_stomach(c,o,t,H){ H.tone(c,o,t,{type:'triangle',f0:75,f1:52,dur:1.1,peak:.4,attack:.1,vib:9,vibDepth:14}); H.tone(c,o,t+.6,{type:'triangle',f0:95,f1:70,dur:.6,peak:.25,attack:.05,vib:12,vibDepth:10}); },
 // le trésor : une cascade de pièces
 dm_hoard(c,o,t,H){ for(let i=0;i<16;i++){ const f=1800+((i*977)%1700); H.tone(c,o,t+i*.06+((i*37)%5)*.01,{f0:f,dur:.35,peak:.09,attack:.001}); H.tone(c,o,t+i*.06,{f0:f*1.5,dur:.2,peak:.04,attack:.001}); } },
 // ambiance : un feu qui crépite (salle chaude, salle des elfes)
 dm_fire(c,o,t,H){ H.hiss(c,o,t,{dur:2,peak:.2,f0:500,attack:.3}); for(let i=0;i<12;i++) H.hiss(c,o,t+((i*0.37)%1.8),{dur:.03,peak:.12,type:'highpass',f0:1500+((i*511)%2500),attack:.001}); },
 // ambiance : des gouttes (grotte humide)
 dm_drip(c,o,t,H){ [0,.7,1.2].forEach((d,i)=>H.tone(c,o,t+d,{f0:1500-i*200,f1:500,dur:.12,peak:.22,attack:.002})); }
};
// quel son pour quelle ligne du jeu (ligne affichée, commande anglaise qui l'a provoquée)
function dmSfxFor(line,cmd){
  const l=line.trim(), v=(cmd||'').split(' ')[0];
  if(/DRAGON IS IN/.test(l)) return 'dm_roar';
  if(/DEMON IS IN/.test(l)) return 'dm_demon';
  if(/ELF IS IN/.test(l)) return 'dm_elf';
  if(/ELF RAN AWAY/.test(l)) return 'dm_fled';
  if(/THE (DEMON|DRAGON) IS DEAD/.test(l)) return 'dm_slain';
  if(/KILLED|DIED|ADVENTURER IS DEAD|NO FURTHER|TOO TIRED/.test(l)) return 'death';
  if(/THE DOOR IS OPEN/.test(l)) return 'dm_spelldoor';
  if(/ELF HAS TAKEN/.test(l)) return 'coin';
  if(/SLEEP HERE/.test(l)) return 'dm_snore';
  if(/RESTED/.test(l)) return 'dream';
  if(/VERY COLD/.test(l)) return 'dm_wind';
  if(/HUNGRY|THIRSTY|MUST FIND (FOOD|WATER)/.test(l)) return 'dm_stomach';
  if(/OUTSIDE IN THE SUNSHINE/.test(l)) return 'dm_hoard';
  if(/ALL THE TREASURE/.test(l)) return 'victory';
  if(/^LOCKED|HEAVY BLACK DOOR IS CLOSED|UNSEEN FORCE/.test(l)) return 'rumble';
  if(l==='OK'){
    if(v==='UNLOCK') return 'dm_key';
    if(v==='OPEN') return 'dm_creak';
    if(v==='EAT') return 'dm_crunch';
    if(v==='DRINK') return 'dm_gulp';
    if(/^(GET|TAKE) WATER/.test(cmd)) return 'splash';
  }
  return null;
}
