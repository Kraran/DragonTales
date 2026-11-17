// S.S. Poseidon — bruitages du navire, synthétisés comme ceux du moteur (moteur/sfx.js) : aucun fichier son.
// Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
// Les bips (SOUND) et les petits airs (PLAY) du programme d'origine sont joués à part, par le moteur.
const PS_SFX={
 // la vapeur qui fuse dans la cuisine
 ps_steam(c,o,t,H){ H.hiss(c,o,t,{dur:1.6,peak:.32,type:'highpass',f0:2600,attack:.25}); H.hiss(c,o,t+.5,{dur:1.1,peak:.18,type:'bandpass',f0:5200,Q:1.2,attack:.05}); },
 // un incendie : grondement sourd et crépitements
 ps_fire(c,o,t,H){ H.hiss(c,o,t,{dur:2,peak:.4,f0:420,attack:.5});
   for(let i=0;i<14;i++) H.hiss(c,o,t+.1+Math.random()*1.7,{dur:.03,peak:.35+Math.random()*.3,type:'highpass',f0:2500+Math.random()*3000,attack:.001}); },
 // la salle des machines : ronronnement grave, coups de piston
 ps_engine(c,o,t,H){ [48,72,96].forEach((f,i)=>H.tone(c,o,t,{type:'sawtooth',f0:f,dur:2.2,peak:.12-i*.03,attack:.6}));
   for(let i=0;i<4;i++) H.hiss(c,o,t+.3+i*.45,{dur:.12,peak:.3,f0:900,attack:.005}); },
 // la salle de bal inondée : l'eau qui s'engouffre
 ps_flood(c,o,t,H){ H.hiss(c,o,t,{dur:2.2,peak:.5,f0:700,f1:300,attack:.4}); H.hiss(c,o,t+.2,{dur:1.6,peak:.2,type:'bandpass',f0:1800,Q:.6,attack:.3}); },
 // la coque gémit : tôle qui se tord
 ps_creak(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=520; bp.Q.value=5; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(70,t); os.frequency.linearRampToValueAtTime(110,t+.9); os.frequency.linearRampToValueAtTime(64,t+1.7);
   const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=13; lg.gain.value=18; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t+1.8);
   os.connect(H.env(c,bp,t,.3,.8,1.75)); os.start(t); os.stop(t+1.8); },
 // grimper au câble : le câble d'acier qui grince, efforts
 ps_climb(c,o,t,H){ for(let i=0;i<5;i++){ const s=t+i*.32; H.tone(c,o,s,{type:'triangle',f0:1300+i*60,f1:1100+i*60,dur:.16,peak:.08,attack:.01}); H.hiss(c,o,s,{dur:.12,peak:.22,type:'bandpass',f0:1400,Q:2,attack:.01}); }
   PS_SFX.ps_creak(c,o,t+1.5,H); },
 // la porte d'acier arrachée : grincement aigu, puis le choc
 ps_door(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1500; bp.Q.value=7; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(220,t); os.frequency.linearRampToValueAtTime(420,t+.8);
   const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=31; lg.gain.value=60; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t+.95);
   os.connect(H.env(c,bp,t,.05,.6,.9)); os.start(t); os.stop(t+.95);
   [180,262,371,523].forEach((f,i)=>H.tone(c,o,t+.95,{f0:f,dur:1.6-i*.25,peak:.2-i*.03,attack:.002})); H.hiss(c,o,t+.95,{dur:.4,peak:.5,f0:1200,f1:200,attack:.002}); },
 // trouver quelque chose
 ps_find(c,o,t,H){ [784,988,1319].forEach((f,i)=>H.tone(c,o,t+i*.09,{f0:f,dur:.7,peak:.12,attack:.004})); },
 // le mur d'eau
 ps_wave(c,o,t,H){ H.hiss(c,o,t,{dur:2.4,peak:.85,f0:2600,f1:260,attack:.3}); H.tone(c,o,t,{f0:60,f1:35,dur:2,peak:.5,attack:.3}); PS_SFX.ps_bubbles(c,o,t+1.6,H); },
 ps_bubbles(c,o,t,H){ for(let i=0;i<9;i++){ const f=200+Math.random()*500; H.tone(c,o,t+i*.13+Math.random()*.06,{f0:f,f1:f*1.9,dur:.08,peak:.3,attack:.01}); } },
 // la chute dans le mazout en flammes
 ps_oil(c,o,t,H){ H.tone(c,o,t,{type:'triangle',f0:800,f1:120,dur:.9,peak:.25,attack:.03}); H.hiss(c,o,t+.85,{dur:1.6,peak:.7,f0:3000,f1:300,attack:.01}); PS_SFX.ps_fire(c,o,t+1.1,H); },
 // l'extincteur
 ps_extinguish(c,o,t,H){ H.hiss(c,o,t,{dur:1.8,peak:.55,type:'highpass',f0:1800,attack:.03}); H.hiss(c,o,t+1.6,{dur:.6,peak:.2,f0:500,f1:150,attack:.05}); },
 // une coupure
 ps_cut(c,o,t,H){ H.hiss(c,o,t,{dur:.18,peak:.5,type:'highpass',f0:4000,f1:1500,attack:.002}); H.tone(c,o,t+.15,{type:'triangle',f0:330,f1:260,dur:.4,peak:.15,attack:.01}); },
 // boire les vitamines, puis le vertige
 ps_drink(c,o,t,H){ for(let i=0;i<3;i++) H.tone(c,o,t+i*.28,{f0:180,f1:90,dur:.16,peak:.35,attack:.01});
   [440,466,494].forEach((f,i)=>H.tone(c,o,t+1,{f0:f,dur:1.3,peak:.05,attack:.4,vib:5,vibDepth:20})); },
 ps_burp(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:95,f1:70,dur:.5,peak:.3,attack:.03,vib:28,vibDepth:15}); },
 // se balancer au bout de la corde
 ps_swing(c,o,t,H){ H.hiss(c,o,t,{dur:.9,peak:.4,type:'bandpass',f0:500,f1:1600,Q:1.2,attack:.4}); H.hiss(c,o,t+.95,{dur:.12,peak:.4,f0:800,attack:.002}); },
 // nouer la corde
 ps_tie(c,o,t,H){ for(let i=0;i<4;i++) H.hiss(c,o,t+i*.14,{dur:.11,peak:.3,type:'bandpass',f0:1100+i*200,Q:2,attack:.02}); H.hiss(c,o,t+.65,{dur:.06,peak:.4,f0:600,attack:.002}); },
 // le passage secret : un panneau glisse, et l'eau entre
 ps_secret(c,o,t,H){ H.hiss(c,o,t,{dur:.9,peak:.4,type:'bandpass',f0:300,Q:1.5,attack:.1}); H.tone(c,o,t,{type:'sawtooth',f0:55,dur:.9,peak:.12,attack:.1}); PS_SFX.ps_flood(c,o,t+.9,H); },
 // plus de lumière
 ps_dark(c,o,t,H){ [55,58].forEach(f=>H.tone(c,o,t,{f0:f,dur:2.4,peak:.2,attack:.8})); PS_SFX.ps_creak(c,o,t+.6,H); },
 // trop tard : le navire sombre
 ps_sink(c,o,t,H){ PS_SFX.ps_creak(c,o,t,H); H.hiss(c,o,t+.8,{dur:2.6,peak:.6,f0:500,f1:150,attack:.8}); PS_SFX.ps_bubbles(c,o,t+2.2,H); },
 // la liberté : la clé à molette, la tôle qui tombe, le grand air
 ps_freedom(c,o,t,H){ for(let i=0;i<6;i++) H.hiss(c,o,t+i*.12,{dur:.03,peak:.5,type:'highpass',f0:3500,attack:.001});
   [140,210,297].forEach((f,i)=>H.tone(c,o,t+.9,{f0:f,dur:1.4-i*.3,peak:.25,attack:.002})); H.hiss(c,o,t+.9,{dur:.4,peak:.5,f0:900,f1:200,attack:.002});
   H.hiss(c,o,t+1.4,{dur:2.4,peak:.25,f0:900,attack:.8});
   [0,.5].forEach(d=>H.tone(c,o,t+1.8+d,{type:'triangle',f0:2100,f1:1500,dur:.35,peak:.07,attack:.03,vib:12,vibDepth:80})); }
};
// son lié à une ligne du programme (anglais) ou à la commande envoyée
function psSfxFor(line,cmd){
  const l=line.replace(/ +/g,' ');
  if(/MADE IT UP TO THE NEXT LEVEL/.test(l)) return 'ps_climb';
  if(/RIP THE DOOR OPEN/.test(l)) return 'ps_door';
  if(/^LOOK!|YOU FIND SOMETHING/.test(l)) return 'ps_find';
  if(/WALL OF WATER/.test(l)) return 'ps_wave';
  if(/YOU DROWNED|HOLD YOUR BREATH/.test(l)) return 'ps_bubbles';
  if(/FELL DOWN A SHAFT/.test(l)) return 'fall';
  if(/FELL INTO THE OIL/.test(l)) return 'ps_oil';
  if(/FIRE'S OUT/.test(l)) return 'ps_extinguish';
  if(/YOU CUT YOURSELF|CUT OFF YOUR FOOT/.test(l)) return 'ps_cut';
  if(/FEEL SOMEWHAT STRANGE/.test(l)) return 'ps_drink';
  if(/BURP/.test(l)) return 'ps_burp';
  if(/SWING ACROSS/.test(l)) return 'ps_swing';
  if(/SECRET PASSAGE/.test(l)) return 'ps_secret';
  if(/TOO DARK TO SEE/.test(l)) return 'ps_dark';
  if(/YOU WERE TOO LATE/.test(l)) return 'ps_sink';
  if(/MADE IT TO FREEDOM/.test(l)) return 'ps_freedom';
  if(/^OKAY\.$/.test(l.trim())&&/^TO /.test(cmd||'')) return 'ps_tie';
  return null;
}
